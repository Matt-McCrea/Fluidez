/* ============================================================================
 * THE LICENCE: when a bank sentence may be re-inflected at all.
 *
 * A transform (another person, another tense, negated, its object as a
 * pronoun) rewrites a sentence the learner can read into one nobody wrote.
 * That is only fair when the engine has understood the sentence completely,
 * so the rewrite is a certainty and not a guess, and when the result is in a
 * tense the learner has been taught. `refusal` says why a clause is not safe
 * (null when it is); a caller that gets a reason makes no item, and the card
 * falls back to a plain one. A missing item costs nothing. A wrong one is
 * the app teaching broken Spanish as "the right version".
 *
 * Read from real screens: "Ayer cuidá a tu hermano mientras yo salí" (a
 * command with a verb in the present beside it), "Cada uní con su cuento"
 * (uno is not unir), "Ayer hay un cliente, Valió" (Vale is a name), "Antes
 * Perdón, era de Cali" (an interjection in front of the verb), "¿Cómo se
 * digo" (an impersonal se).
 * ========================================================================== */
import { analyzeToken } from '../engine';
import type { Analysis, TenseKey } from '../engine';
import type { BankSentence } from '../content/schema';
import { bankIndex } from './bank-index';
import { DETERMINERS, FINITE, PREPOSITIONS, enSubject, isFunctionWord, low, toToks, type Clause } from './spanish';

/** Words the engine reads as a verb that, in a bank sentence, are the story's own names or a pronoun. */
const NEVER_THE_VERB = new Set(['vale', 'uno', 'media']);
/** Nouns that are also verb forms; they are a verb here only when somebody is named as doing it. */
const WEAK_VERBS = new Set(['trabajo', 'cocina', 'cena', 'paseo', 'viaje', 'estudio', 'baile', 'camino', 'vuelo', 'regreso', 'pregunta', 'cuento', 'ayuda', 'llamada', 'compra', 'vino', 'canto', 'desayuno', 'gusto', 'espera', 'juego', 'sueño', 'lleno', 'limpio', 'seco', 'cuenta', 'vuelta', 'parte', 'cambio']);
/** Nouns that say how long ago or how long: "Hace una semana." is not "she makes a week". */
const SPAN_NOUNS = new Set(['semana', 'semanas', 'mes', 'meses', 'año', 'años', 'día', 'días', 'rato', 'hora', 'horas', 'minuto', 'minutos', 'tiempo']);
/** Commands the engine does not recognise (dale que dale). */
const COMMANDS = new Set(['dale']);
/** Words that look like a verb to the engine and are not one here (para = parar, como = comer after a noun). */
const NOT_A_SECOND_VERB = new Set(['para', 'entre', 'sobre', 'bajo', 'nada', 'solo', 'mientras', 'cerca', 'bien', 'mal', 'tarde', 'pronto', 'claro', 'cada', 'medio', 'junto', 'como']);
/** Nouns the engine can only read as a voseo or a vosotros form (mamá = mamar, sed = ser). */
const NOUN_FORMS = new Set(['mamá', 'mamás', 'papá', 'papás', 'sofá', 'sofás', 'café', 'cafés', 'bebé', 'bebés', 'menú', 'menús', 'maní', 'sed', 'pésame']);
/** Words that open a clause that has its own verb after it. */
const SUBORDINATORS = new Set(['cuando', 'si', 'aunque', 'porque', 'que', 'donde', 'mientras', 'como', 'después', 'antes', 'hasta', 'ni', 'pues', 'apenas', 'cuanto', 'según']);
/** Words that open a sentence with a capital and are not names: a time word in front of them lowers them. */
const OPENERS = new Set([
  'poco', 'poca', 'pocos', 'pocas', 'mucho', 'mucha', 'muchos', 'muchas', 'bastante', 'bastantes', 'casi', 'solo', 'sólo', 'tan', 'tanto', 'tanta',
  'medio', 'difícil', 'fácil', 'imposible', 'todo', 'toda', 'todos', 'todas', 'nadie', 'nada', 'alguien', 'algo', 'ambos', 'varios', 'varias',
  'otro', 'otra', 'otros', 'otras', 'demasiado', 'demasiada', 'bueno', 'buena', 'malo', 'mala', 'claro', 'seguro', 'listo', 'algún', 'alguna', 'algunos', 'algunas',
  'ningún', 'ninguna', 'ninguno', 'cualquier', 'esto', 'eso', 'aquello', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo', 'sábados', 'domingos',
]);
/** How often, said in words: "Ayer raras veces" contradicts itself, and "raras veces no" is a double negative. */
export const FREQUENCY = /(^|[\s¿¡])(rara vez|raras veces|a menudo|de vez en cuando|con frecuencia|frecuentemente|casi siempre|casi nunca|cada vez|mientras tanto)(?=[\s,.!?;:]|$)/i;

/** The tense a clause is really in: haber + participle is the perfect, not the present of haber. */
const COMPOUND: Partial<Record<TenseKey, TenseKey>> = {
  presente: 'perfecto', imperfecto: 'plusc', futuro: 'futperf', condicional: 'condperf', presubj: 'perfsubj', impsubj: 'pluscsubj',
};
export function tenseOf(c: Clause): TenseKey {
  return c.participle >= 0 ? COMPOUND[c.choice.tense] ?? c.choice.tense : c.choice.tense;
}

const isCapital = (core: string) => /^\p{Lu}/u.test(core);
const isCommand = (a: Analysis) => a.tense === 'imperativo' || a.tense === 'impneg';

/**
 * Why this clause is not safe to re-inflect, or null when it is. `en` is the
 * bank English, which tells a command from a statement when the Spanish
 * cannot ("Habla despacio." is "Speak slowly", not "She speaks slowly").
 */
export function refusal(c: Clause, en: string): string | null {
  const ts = c.toks;
  // one sentence: a second one has its own verb, its own punctuation, its own speaker
  if (ts.slice(0, -1).some((t) => /[.?!…]/.test(t.post))) return 'more than one sentence';
  const verb = ts[c.verb].core;
  if (NEVER_THE_VERB.has(verb.toLowerCase())) return 'not a verb here';
  if (c.verb > 0 && isCapital(verb)) return 'a name, not a verb';
  if (c.verb > 0 && SUBORDINATORS.has(low(ts[0]))) return 'opens with a clause of its own';
  for (let i = 0; i < ts.length; i++) {
    const core = ts[i].core;
    const l = low(ts[i]);
    // a name, whatever the engine makes of it (Tomás is also a voseo "you take")
    if (isCapital(core) && (i > 0 || /(ás|és|ís)$/i.test(core))) continue;
    if (/^vos(otros|otras)?$/.test(l)) return 'voseo or vosotros';
    if (COMMANDS.has(l)) return 'a command beside the verb';
    if (NOUN_FORMS.has(l) || i === c.verb) continue;
    const an = analyzeToken(l).filter((a) => a.accentExact);
    // voseo, vosotros, an archaic future subjunctive: recognised, but not what the course teaches to say
    if (an.length && an.every((a) => !a.target)) return 'voseo, vosotros or an archaic form';
    // a command with its pronouns on the end (dime, pásame, llévatelo)
    if (an.length && an.every(isCommand)) return 'a command beside the verb';
    // a second verb the engine did not count: hay, and the nouns it reads as verbs (Estudio, camino) outside a noun slot
    const prev = i > 0 ? low(ts[i - 1]) : '';
    const noun = DETERMINERS.has(prev) || PREPOSITIONS.has(prev);
    if (!NOT_A_SECOND_VERB.has(l) && !isFunctionWord(l) && !noun && i !== c.participle && i !== c.complement
      && an.some((a) => FINITE.has(a.tense) && a.target && !a.clitics)) return 'a second verb';
    if (l === 'hay' && low(ts[c.verb]) !== 'hay') return 'a second verb';
  }
  // a noun that is also a verb form, with nobody named as the doer: Mucho trabajo, Buen estudio
  if (WEAK_VERBS.has(verb.toLowerCase()) && c.subject < 0 && !enSubject(en)) return 'a noun here';
  // "Tantos como el año pasado": como is not comer unless somebody eats
  if (verb.toLowerCase() === 'como' && !/\b(eat|eats|ate|eating|eaten|have)\b/i.test(en)) return 'not a verb here';
  // "Hace una semana": how long ago, not hacer
  if (c.choice.inf === 'hacer' && ts.slice(c.verb + 1, c.verb + 4).some((t) => SPAN_NOUNS.has(t.core.toLowerCase()))) return 'a span of time';
  // "Habla despacio.": a command when nobody is named as the doer
  if (c.groupStart === 0 && c.neg < 0 && c.subject < 0 && analyzeToken(verb.toLowerCase()).some((a) => a.accentExact && a.tense === 'imperativo')
    && !/^(he|she|they|we|i|you|it)\b/i.test(en.replace(/^\W+/, ''))) return 'probably a command';
  return null;
}

/** May a time word go in front of this clause as a plain adverb: nothing but its own subject comes before the verb. */
export function opensClean(c: Clause): boolean {
  return !c.toks.slice(0, c.verb).some((t) => /[,;:.!?…]/.test(t.post));
}

/**
 * What becomes of the first word when something goes in front of it. A verb,
 * a pronoun and the words that open a sentence lose their capital; a name
 * (Tomás, Rosa, Bogotá) keeps it. Null when the word is a capital the engine
 * cannot account for: it may be either, so the sentence is not used.
 */
export function opening(c: Clause, names?: ReadonlySet<string>): 'lower' | 'keep' | null {
  const first = c.toks[0];
  if (!isCapital(first.core)) return 'keep';
  const l = first.core.toLowerCase();
  if (c.verb === 0 || c.subject === 0 || isFunctionWord(l) || OPENERS.has(l)) return 'lower';
  return names?.has(l) ? 'keep' : null;
}

/**
 * The names in a bank: words it writes with a capital in the middle of a
 * sentence, and hardly ever without one. Once per bank array. `placesOf` are
 * the ones among them that the bank mostly puts after en, desde, hasta or
 * hacia (Bogotá, Toronto), as opposed to the people.
 */
const nameIndex = (() => {
  interface Count { upper: Map<string, number>; lower: Map<string, number>; after: Map<string, number>; names?: Set<string>; places?: Set<string> }
  return bankIndex<Count>(() => ({ upper: new Map(), lower: new Map(), after: new Map() }), (n, s) => {
    n.names = undefined;
    n.places = undefined;
    for (const line of s.es.split(/\n|\\n/)) {
      const ts = toToks(line);
      for (let i = 1; i < ts.length; i++) {
        if (!ts[i].core || /[.?!…]/.test(ts[i - 1].post)) continue;       // empty, or it opens a sentence
        const upper = isCapital(ts[i].core);
        const m = upper ? n.upper : n.lower;
        const w = ts[i].core.toLowerCase();
        m.set(w, (m.get(w) ?? 0) + 1);
        if (upper && PLACE_PREPOSITIONS.has(low(ts[i - 1])) && !/[,;:]/.test(ts[i - 1].post)) n.after.set(w, (n.after.get(w) ?? 0) + 1);
      }
    }
  });
})();
const PLACE_PREPOSITIONS = new Set(['en', 'desde', 'hasta', 'hacia']);

export const namesOf = (bank: readonly BankSentence[]): ReadonlySet<string> => {
  const n = nameIndex(bank);
  if (!n.names) {
    n.names = new Set();
    for (const [w, up] of n.upper) if (up >= 2 && up >= 4 * (n.lower.get(w) ?? 0)) n.names.add(w);
  }
  return n.names;
};

export const placesOf = (bank: readonly BankSentence[]): ReadonlySet<string> => {
  const n = nameIndex(bank);
  if (!n.places) {
    n.places = new Set();
    for (const [w, k] of n.after) if (k >= 3 && k >= 0.2 * (n.upper.get(w) ?? 0)) n.places.add(w);
  }
  return n.places;
};
