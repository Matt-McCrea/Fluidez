/* ============================================================================
 * RE-INFLECTION — a known sentence turned into a new one by the engine:
 * another person, another tense, negated, its object replaced by a pronoun.
 *
 * Each function returns null when it is not sure. The rules for "sure":
 *  - the verb is the sentence's only finite verb and its reading is unique
 *    (parseClause);
 *  - the new verb form exists, is target-variety (never vosotros), and the
 *    analyser reads it back as exactly the requested tense and person;
 *  - everything that agrees with the change (reflexive pronoun, possessive,
 *    predicate adjective) is changed with it, or the sentence is refused.
 * ========================================================================== */
import { attachEnclitic, PERSONS, verbByInf } from '../../engine';
import type { Person, TenseKey } from '../../engine';
import { conjugateBareCells } from '../../engine/conjugate';
import { closedClass } from './lexicon';
export const FREQUENCY = /(^|[\s¿¡])(rara vez|raras veces|a menudo|de vez en cuando|con frecuencia|frecuentemente|casi siempre|casi nunca|cada vez|mientras tanto)(?=[\s,.!?;:]|$)/i;
import {
  ARTICLES, CLITICS, DEMONSTRATIVES, DETERMINERS, EXPERIENCER, POLARITY, POSSESSIVES, PREPOSITIONS, REFLEXIVE, SUBJECT_PRONOUNS, TIME_WORDS,
  cliticFor, enSubject, gerundOf, insertTok, isFunctionWord, isInfinitive, isPluralWord, low, nounGender,
  parseClause, pluralize, removeToks, render, replaceCore, singularize, splitEnclitic, timeSpans, verbReadings,
  type Clause, type Tok,
} from './spanish';

/** Verbs whose grammatical subject is not the doer (me gusta, me duele):
 *  a person swap of the verb would change who likes what, not who speaks. */
export { EXPERIENCER };
const WEATHER = new Set(['llover', 'nevar', 'tronar', 'amanecer', 'anochecer']);
/** Verbs whose predicate agrees with the subject: "Seguimos bravos", "Se ven cansados". */
const COPULAS = new Set(['ser', 'estar', 'sentirse', 'quedarse', 'ponerse', 'seguir', 'andar', 'verse', 'encontrarse', 'hallarse', 'mantenerse', 'volverse', 'hacerse']);
/** Verbs that never take a direct object noun phrase. */
/** Verbs whose noun phrase after them is their direct object, never their subject (empieza la reunión, cambió el barrio) or a time (cocina los domingos). */
const TRANSITIVE = new Set([
  'ver', 'mirar', 'oír', 'escuchar', 'leer', 'escribir', 'abrir', 'cerrar', 'comprar', 'vender', 'pagar', 'cobrar', 'tener', 'llevar', 'traer', 'dar', 'mandar', 'enviar',
  'regalar', 'prestar', 'devolver', 'pedir', 'buscar', 'encontrar', 'perder', 'dejar', 'poner', 'quitar', 'tomar', 'comer', 'beber', 'preparar', 'cocinar', 'hacer', 'usar',
  'necesitar', 'querer', 'preferir', 'conocer', 'entender', 'saber', 'aceptar', 'firmar', 'revisar', 'llenar', 'lavar', 'limpiar', 'repetir', 'mostrar', 'recomendar', 'publicar',
  'olvidar', 'guardar', 'probar', 'romper', 'visitar', 'llamar', 'esperar', 'levantar', 'cubrir', 'apagar', 'contestar', 'cortar', 'recoger', 'arreglar', 'cargar', 'esconder',
  'invitar', 'ayudar', 'comprender', 'sentir', 'ganar', 'decir', 'contar', 'explicar', 'cuidar', 'extrañar', 'cruzar',
]);
/** Nouns that say when, not what: "los domingos", "el lunes", "la semana". */
const WHEN_NOUNS = new Set(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'sábados', 'domingo', 'domingos', 'semana', 'semanas', 'mes', 'meses', 'año', 'años', 'día', 'días', 'noche', 'noches', 'tarde', 'tardes', 'mañana', 'mañanas', 'rato', 'vez', 'veces', 'hora', 'horas', 'momento', 'fin']);
/** Verbs that let an infinitive's pronoun climb (lo quiero ver = quiero verlo). */
export const CLIMBING = new Set(['querer', 'poder', 'deber', 'ir', 'tener', 'saber', 'empezar', 'comenzar', 'acabar', 'volver', 'estar', 'seguir', 'necesitar', 'pensar', 'soler', 'intentar', 'tratar', 'preferir', 'esperar']);

/** Bare (no reflexive pronoun) target form of a verb, or null. */
export function form(inf: string, tense: TenseKey, person: Person): string | null {
  const v = verbByInf(inf);
  if (!v || person === 'vosotros') return null;
  const cell = conjugateBareCells(v, tense)[PERSONS.indexOf(person)];
  if (!cell?.form || cell.form.includes(' ')) return null;
  // round-trip: the analyser must read it back as exactly this cell
  const back = verbReadings(cell.form).some((a) => a.tense === tense && a.person === person && (a.inf === inf || a.inf === inf.replace(/se$/, '') || a.inf + 'se' === inf));
  return back ? cell.form : null;
}

/** Subject pronoun for a person, keeping the gender of the one replaced. */
export function pronounFor(p: Person, was?: string): string {
  const fem = was ? /^(ella|ellas|nosotras)$/.test(was) : false;
  switch (p) {
    case 'yo': return 'yo';
    case 'tú': return 'tú';
    case 'él/ella': return fem ? 'ella' : 'él';
    case 'nosotros': return fem ? 'nosotras' : 'nosotros';
    case 'ellos': return fem ? 'ellas' : 'ellos';
    default: return 'vosotros';
  }
}

const PLURAL_PERSON = (p: Person) => p === 'nosotros' || p === 'ellos' || p === 'vosotros';
const OWN_POSSESSIVE: Readonly<Partial<Record<Person, RegExp>>> = { yo: /^mis?$/, 'tú': /^tus?$/, nosotros: /^nuestr[oa]s?$/ };

function possessiveFor(p: Person, plural: boolean, gender: 'm' | 'f' | null): string | null {
  switch (p) {
    case 'yo': return plural ? 'mis' : 'mi';
    case 'tú': return plural ? 'tus' : 'tu';
    case 'él/ella': case 'ellos': return plural ? 'sus' : 'su';
    case 'nosotros': return gender ? 'nuestr' + (gender === 'm' ? 'o' : 'a') + (plural ? 's' : '') : null;
    default: return null;
  }
}

/** Is the subject a pronoun or dropped (so a person swap is safe)? Anything
 *  before the verb group other than a pronoun, a time word, a question word
 *  or a conjunction may be a noun subject: mi hermana trabaja. */
function pronounSubject(c: Clause, en?: string): boolean {
  // a question phrase in front of the verb ("¿A qué hora te levantas?") is not a subject
  const qPhrase = c.subject < 0 && /^(qué|dónde|cuándo|cómo|quién|cuál|cuánto|cuántos|cuánta|cuántas|a|de|con|para|por|en|desde|hasta)$/.test(low(c.toks[0]))
    && c.toks.slice(0, c.groupStart).some((t) => /^(qué|dónde|cuándo|cómo|quién|quiénes|cuál|cuáles|cuánto|cuántos|cuánta|cuántas)$/.test(low(t)))
    && c.toks.some((t) => /\?/.test(t.post));
  if (qPhrase) return en ? !!enSubject(en) : false;
  for (let i = 0; i < c.groupStart; i++) {
    const l = low(c.toks[i]);
    if (i === c.subject || TIME_WORDS.has(l)) continue;
    if (timeSpans(c.toks).some(([a, b]) => i >= a && i < b)) continue;
    if (/^(qué|dónde|cuándo|cómo|por|y|pero|también|a|quién|cuál|cuánto|cuántos|cuánta|cuántas)$/.test(l)) continue;
    return false;
  }
  if (c.subject >= 0) return true;
  // dropped subject: the English must have a pronoun subject (or none given)
  return en ? !!enSubject(en) : false;
}

const CAPITAL = /^\p{Lu}/u;
/** insertTok for a word that may open a question: the ¿ (or quote) before the verb moves to the new word, so "¿van a vender" is "¿la van a vender", not "la ¿van a vender". */
function insertBefore(ts: readonly Tok[], at: number, core: string): Tok[] {
  const out = insertTok(ts, at, core);
  if (at > 0 && out[at + 1]) { out[at].pre = out[at + 1].pre; out[at + 1].pre = ''; }
  return out;
}
/** Words a person is addressed by. */
const TITLES = /^(don|doña|señor|señora|señorita|doctor|doctora|profe|profesor|profesora)$/;
/** A question with a name on the end or the front: ¿De dónde eres, Vale? */
function addressesByName(c: Clause): boolean {
  const n = c.toks.length;
  if (n < 2 || !/[?]/.test(c.toks[n - 1].post)) return false;
  const last = CAPITAL.test(c.toks[n - 1].core) && /,$/.test(c.toks[n - 2].post);
  const first = c.verb > 0 && CAPITAL.test(c.toks[0].core) && c.toks[0].post === ',' && !isFunctionWord(low(c.toks[0]));
  // ", don Hernando?", ", señora?": a title on its own or in front of the name
  const titled = TITLES.test(low(c.toks[n - 1])) ? /,$/.test(c.toks[n - 2].post) : TITLES.test(low(c.toks[n - 2])) && CAPITAL.test(c.toks[n - 1].core) && n > 2 && /,$/.test(c.toks[n - 3].post);
  return last || first || titled;
}
/** Two names joined by y (Ana y Pedro): the sentence is about two people whatever the person of the verb. */
function joinsNames(c: Clause): boolean {
  return c.toks.some((t, i) => i > 0 && CAPITAL.test(t.core) && low(c.toks[i + 1]) === 'y' && CAPITAL.test(c.toks[i + 2]?.core ?? ''));
}

/** What a verb with this person as its subject cannot have beside it: it would be doing it to itself ("Me ayudamos", "Nos vi", "¿Vengo conmigo?", "Eres para ti"). */
const OWN_WORDS: Readonly<Partial<Record<Person, RegExp>>> = {
  yo: /^(me|nos|conmigo|mí|nosotros|nosotras)$/,
  nosotros: /^(me|nos|conmigo|mí|nosotros|nosotras)$/,
  'tú': /^(te|contigo|ti)$/,
};
/** Participles of the verbs whose subject is not the doer: "Me habría gustado" is haber on the surface and gustar underneath. */
const EXPERIENCER_PARTICIPLES = new Set([...EXPERIENCER].map((v) => v.replace(/ar$/, 'ado').replace(/[ei]r$/, 'ido')));

/**
 * Do the words around the verb tie it to the person it has now? A person swap
 * changes the verb, a reflexive pronoun, an own possessive and a subject
 * pronoun in its usual place. Anything else that names a person stays as it
 * is, so a sentence that has one is left alone:
 *  - a clitic that is the subject's own, on a verb the engine has no reflexive
 *    entry for or in a compound tense (Me limpio las manos, Nos reímos, No me
 *    he olvidado): it cannot tell a reflexive from a reciprocal;
 *  - a clitic or a prepositional pronoun of the new person (Me ayudamos, Nos
 *    vi, ¿Vengo conmigo?, Eres para ti);
 *  - se in front of an indirect object (Se me olvidó, Se te ve nervioso): the
 *    subject is the thing forgotten, and it has no person to change;
 *  - a second subject pronoun, or one the parse did not find after a
 *    participle or an object (Voy a llamar yo, ¿Tienen hambre ustedes?);
 *  - a possessive said as the predicate (Son mías).
 */
function tiedToPerson(c: Clause, to: Person): boolean {
  const ts = c.toks;
  const from = c.choice.person;
  const own = from === 'él/ella' || from === 'ellos' ? null : REFLEXIVE[from];
  const clash = OWN_WORDS[to];
  const last = c.proclitics.length - 1;
  for (const [k, at] of c.proclitics.entries()) {
    const l = low(ts[at]);
    if (l === 'se' && /^(me|te|le|les|nos)$/.test(low(ts[c.proclitics[k + 1]]))) return true;
    if (c.reflexive && k === last) continue;                                          // the verb's own: it changes with it
    if (l === own || clash?.test(l)) return true;
  }
  for (let i = 0; i < ts.length; i++) {
    if (i === c.subject || i === c.verb || c.proclitics.includes(i)) continue;
    const l = low(ts[i]);
    if (SUBJECT_PRONOUNS[l] && !PREPOSITIONS.has(low(ts[i - 1]))) return true;
    if (clash?.test(l)) return true;
    if (c.choice.inf === 'ser' && /^(mí[oa]|tuy[oa]|suy[oa])s?$/.test(l)) return true;
    // an enclitic on an infinitive or a gerund: the complement's own is changed with the verb, any other stays behind
    const sp = i > c.verb ? splitEnclitic(l) : null;
    if (sp?.clitics.some((x) => (x === REFLEXIVE[from] ? i !== c.complement : clash?.test(x)))) return true;
  }
  return false;
}

const DEPICTIVE_VERBS = new Set(['llegar', 'venir', 'volver', 'regresar', 'salir', 'entrar', 'vivir', 'ir', 'dormir', 'despertar', 'nacer', 'morir', 'terminar', 'acabar', 'llevar']);
const DEPICTIVE = /(ad|id)[oa]s?$|^(content|tranquil|list|enferm|nervios)[oa]s?$|^(triste|feliz|tristes|felices)$/;

/**
 * A word that shows the number of the subject on a verb that is no copula:
 * "Trabajamos juntos", "¿Cabemos todos?", "Nos caímos los dos", "Vivo sola".
 * It agrees with a subject that is no longer there. A word that quantifies
 * something else (todos los días, a todos, a los dos) is no obstacle.
 */
function numberLeftBehind(c: Clause, to: Person): boolean {
  const from = c.choice.person;
  if (PLURAL_PERSON(from) === PLURAL_PERSON(to)) return false;
  const ts = c.toks;
  const next = (c.participle >= 0 ? c.participle : c.verb) + 1;
  // "Llegó cansada": how the subject came, not an object
  if (DEPICTIVE_VERBS.has(c.choice.inf.replace(/se$/, '')) && DEPICTIVE.test(low(ts[next]))) return true;
  return ts.some((t, i) => {
    const l = low(t);
    const before = low(ts[i - 1]);
    if (!PLURAL_PERSON(from)) return /^(sola|mism[oa])$/.test(l) || (l === 'solo' && (i === next || i === ts.length - 1));
    if (/^(junt[oa]s|ambos|ambas|sol[oa]s|mism[oa]s)$/.test(l)) return true;
    if (/^(todos|todas)$/.test(l)) return !DETERMINERS.has(low(ts[i + 1])) && !PREPOSITIONS.has(before);
    return /^(los|las)$/.test(l) && /^(dos|tres|cuatro|cinco|seis)$/.test(low(ts[i + 1])) && !PREPOSITIONS.has(before);
  });
}

/** Words that say how or where, and agree with nothing: "Estamos bien", "Se sentía como si…", "Nos sentimos fatal". */
const NO_AGREEMENT = /^(que|como|fatal|regular|genial)$/;

/**
 * The predicate after a copula, in the number of the new subject. One word, or
 * words joined by y or o; a noun with an adjective ("buen narrador", "buena
 * gente"), a comma with more behind it or anything the engine cannot place is
 * refused. A word that does not agree with anybody (de Cali, aquí, contigo,
 * buscándote, como si…) ends the search: nothing is written over it.
 */
function agreePredicate(ts: Tok[], from: number, plural: boolean): Tok[] | null {
  let out = ts;
  let j = from;
  while (j < out.length && (/^(muy|bastante|tan|demasiado|más|menos|un|poco|algo|siempre|nunca|ya|también|hoy|todavía)$/.test(low(out[j])) || /mente$/.test(low(out[j])))) {
    if (low(out[j]) === 'un' && low(out[j + 1]) !== 'poco') return null;
    j++;
  }
  const noWordToChange = (l: string) => {
    const kind = closedClass(l);
    return kind === 'prep' || (kind === 'adv' && !/^(mejor|peor|igual)$/.test(l)) || kind === 'conj' || NO_AGREEMENT.test(l) || TIME_WORDS.has(l) || !!gerundOf(l) || !!splitEnclitic(l) || (kind === 'pron' && /^(conmigo|contigo|consigo)$/.test(l));
  };
  for (;;) {
    const l = low(out[j]);
    if (!l) return out;
    if (/^\p{Lu}/u.test(out[j].core)) return null;                                      // Tomás Herrera is a name, not a noun to pluralise
    if (noWordToChange(l)) return out;
    if (closedClass(l) || isFunctionWord(l)) return null;                                // es un libro, cada vez más altos: no plain predicate here
    const nw = plural ? (isPluralWord(l) ? l : pluralize(l)) : (isPluralWord(l) ? singularize(l) : l);
    if (nw !== l) out = replaceCore(out, j, nw);
    if (j === out.length - 1) return out;
    if (out[j].post) return null;                                                        // "Nos sentíamos tristes, pero también contentos"
    const next = low(out[j + 1]);
    if (next === 'y' || next === 'e' || next === 'o' || next === 'u') { j += 2; continue; }
    if (next === 'pero' || next === 'sino' || !noWordToChange(next)) return null;        // a second word it may agree with or lean on
    return out;
  }
}

export interface Rewritten { es: string; toks: Tok[]; accept: string[] }

/**
 * The same sentence said about another person: como > comemos. `distractor`:
 * the result is a wrong option to pick among others and is never offered as
 * the right Spanish, so a name or a vocative in the sentence is no obstacle.
 */
export function changePerson(c: Clause, to: Person, opts: { en?: string; pronoun?: 'keep' | 'drop' | 'add'; distractor?: boolean } = {}): Rewritten | null {
  const { inf, tense, person: from } = c.choice;
  if (to === from || to === 'vosotros') return null;
  const lexInf = c.participle >= 0 ? (verbReadings(low(c.toks[c.participle])).length ? null : inf) : inf;
  if (EXPERIENCER.has(inf.replace(/se$/, '')) || WEATHER.has(inf) || lexInf === null) return null;
  if (c.participle >= 0 && !c.reflexive && EXPERIENCER_PARTICIPLES.has(low(c.toks[c.participle]))) return null;
  if (!pronounSubject(c, opts.en)) return null;
  // se on its own is impersonal, passive or reciprocal here (se dice, se puede): it has no person to change
  if (!c.reflexive && c.proclitics.length === 1 && low(c.toks[c.proclitics[0]]) === 'se') return null;
  // a question to someone by name, and names joined by y: "¿Soy yo, Tomás?", "Yo soy Ana y Pedro"
  if (!opts.distractor && (addressesByName(c) || joinsNames(c) || tiedToPerson(c, to) || numberLeftBehind(c, to))) return null;
  const nf = form(inf, tense, to);
  if (!nf) return null;
  let ts = replaceCore(c.toks, c.verb, nf);

  // reflexive and object clitics
  if (c.reflexive) {
    const at = c.proclitics[c.proclitics.length - 1];
    ts = replaceCore(ts, at, REFLEXIVE[to]);
  } else {
    for (const at of c.proclitics) if (low(ts[at]) === REFLEXIVE[to] && low(ts[at]) !== 'se') return null; // me ayudas > *me ayudo
  }
  if (c.complement >= 0) {
    const sp = splitEnclitic(low(ts[c.complement]));
    if (sp && sp.clitics.includes(REFLEXIVE[from])) {
      // "¿Me dejarías ayudarte?": the infinitive has a doer of its own, and te is the object, not the subject
      if (!c.reflexive && c.proclitics.length) return null;
      const base = sp.kind === 'inf' ? sp.base : gerundOf(sp.base) ? sp.base : null;
      if (!base) return null;
      const cl = sp.clitics.map((x) => (x === REFLEXIVE[from] ? REFLEXIVE[to] : x)).join('');
      ts = replaceCore(ts, c.complement, attachEnclitic(base, cl));
    } else if (sp && sp.clitics.includes(REFLEXIVE[to]) && REFLEXIVE[to] !== 'se') return null;
  }

  // possessives that belong to the subject
  const ownRe = OWN_POSSESSIVE[from];
  for (let i = 0; i < ts.length; i++) {
    const l = low(ts[i]);
    if (ownRe?.test(l)) {
      const np = possessiveFor(to, /s$/.test(l), nounGender(low(ts[i + 1]) || ''));
      if (!np) return null;
      ts = replaceCore(ts, i, np);
    } else if (from !== 'yo' && from !== 'tú' && from !== 'nosotros' && /^sus?$/.test(l)) {
      return null;                                                                       // su: whose? not safe
    }
  }

  // predicate agreement after a copula
  if (COPULAS.has(inf) && PLURAL_PERSON(from) !== PLURAL_PERSON(to)) {
    const after = (c.participle >= 0 ? c.participle : c.verb) + 1;
    // "Es usted muy generoso": the predicate starts after the subject
    const agreed = agreePredicate(ts, c.subject === after ? after + 1 : after, PLURAL_PERSON(to));
    if (!agreed) return null;
    ts = agreed;
  }

  // the subject pronoun
  const mode = opts.pronoun ?? 'keep';
  if (c.subject >= 0) {
    if (mode === 'drop') ts = removeToks(ts, c.subject, c.subject + 1);
    else ts = replaceCore(ts, c.subject, pronounFor(to, low(c.toks[c.subject])));
  } else if (mode === 'add') {
    ts = insertBefore(ts, c.groupStart, pronounFor(to));
  }
  return { es: render(ts), toks: ts, accept: [] };
}

/** Voy a + infinitive, whether or not the engine knows the infinitive: the near future, not a going anywhere. */
export function goingTo(c: Clause): boolean {
  return /^ir(se)?$/.test(c.choice.inf) && low(c.toks[c.verb + 1]) === 'a' && /[aeií]r(me|te|se|lo|la|le|nos|los|las|les)*$/.test(low(c.toks[c.verb + 2])) && !CAPITAL.test(c.toks[c.verb + 2].core);
}

/** The same sentence in another tense. Refuses a sentence with a time word
 *  (ayer, mañana, siempre…) unless `stripTime`, which removes them. */
export function changeTense(c: Clause, to: TenseKey, opts: { stripTime?: boolean } = {}): Rewritten | null {
  const { inf, tense, person } = c.choice;
  if (to === tense || c.participle >= 0 || WEATHER.has(inf) && person !== 'él/ella') return null;
  if (tense === 'presubj' || tense === 'impsubj' || to === 'presubj' || to === 'impsubj') return null;
  // "solí", "soleré": soler only lives in the present and the imperfect
  if (inf === 'soler' && to !== 'presente' && to !== 'imperfecto') return null;
  // "Los clientes fueron a llegar": voy a + infinitive is a future, its past is iba a, and fui a is going somewhere to do it
  if (to === 'preterito' && goingTo(c)) return null;
  const nf = form(inf, to, person);
  if (!nf) return null;
  // a form shared with the source tense (hablamos) is no change at all
  if (verbReadings(nf).some((a) => a.tense === tense && a.person === person)) return null;
  let ts = replaceCore(c.toks, c.verb, nf);
  const spans = timeSpans(ts);
  if (spans.length) {
    if (!opts.stripTime || leavesHanging(ts, spans)) return null;
    for (const [a, b] of spans.slice().reverse()) ts = removeToks(ts, a, b);
    if (!ts.some((t) => t.core)) return null;
    ts = closeUp(ts);
  }
  return { es: render(ts), toks: ts, accept: [] };
}

/** Words that lean on what comes after them: "muy temprano", "tan pronto", "casi todos los días", "menos el martes", "más que ayer". */
const LEANS_FORWARD = /^(muy|tan|más|menos|demasiado|bastante|justo|casi|poco|mucho|algo|excepto|salvo|sino|que|como)$/;
/** Words a time word leans on: "antes de pagar", "después de comer", "antes que mi jefe", "ahora mismo", "hoy en día". */
const LEANS_BACK = /^(de|del|que|mismo|misma|en)$/;

/**
 * A time word is only a phrase of its own when nothing leans on it. Cutting
 * "mañana" out of "toda la mañana" leaves "toda la", "temprano" out of "muy
 * temprano" leaves "muy", and "antes" out of "antes de pagar" leaves "de
 * pagar": each is the middle of a longer phrase, and taking it out leaves a
 * word hanging.
 */
function leavesHanging(ts: readonly Tok[], spans: ReadonlyArray<[number, number]>): boolean {
  return spans.some(([a, b]) => {
    const open = (t: Tok | undefined) => !!t && !/[,;:.!?]/.test(t.post);
    const prev = low(ts[a - 1]);
    if (a > 0 && open(ts[a - 1]) && (DETERMINERS.has(prev) || PREPOSITIONS.has(prev) || LEANS_FORWARD.test(prev))) return true;
    return open(ts[b - 1]) && LEANS_BACK.test(low(ts[b]));
  });
}

/** A time phrase cut off the end takes its comma with it: "la esquina, los sábados." is "la esquina.", not "la esquina,.". */
function closeUp(ts: Tok[]): Tok[] {
  const out = ts.map((t) => ({ ...t }));
  const last = out[out.length - 1];
  last.post = last.post.replace(/[,;:]+(?=[.!?…»”"]+$)/, '');
  return out;
}

/** Remove time words: the structured-input form where only the verb tells you when. Nothing is left when taking them out would leave a word hanging. */
export function stripTimeWords(ts: readonly Tok[]): Tok[] {
  let out = ts.slice();
  const spans = timeSpans(out);
  if (leavesHanging(out, spans)) return [];
  for (const [a, b] of spans.slice().reverse()) out = removeToks(out, a, b);
  return out.length ? closeUp(out) : out;
}

const QUESTION_WORD = /^(qué|dónde|cuándo|cómo|quién|quiénes|cuál|cuáles|cuánto|cuánta|cuántos|cuántas)$/;
const NEGATIVE_FORCE = /(^|\s)(poco|poca|pocos|pocas|apenas|difícilmente|escasamente)(\s|$)/;

/** Negate: como > no como, lo veo > no lo veo. Refuses polarity words
 *  (también, ya, algo, siempre…) and sentences already negative. */
export function negate(c: Clause): Rewritten | null {
  if (c.neg >= 0) return null;
  if (/^(qué|dónde|cuándo|cómo|quién|quiénes|cuál|cuáles|cuánto|cuánta|cuántos|cuántas|por)$/.test(low(c.toks[0]))) return null; // ¿Dónde no vives?
  if (c.toks.some((t) => QUESTION_WORD.test(low(t)))) return null;                                                            // ¿En qué calle no vive…?, ¿No vive con quién?
  if (low(c.toks[0]) === 'sí') return null;                                                                                    // "Sí, no está enorme" contradicts itself
  if (c.toks.some((t) => POLARITY.has(low(t)))) return null;
  // poco, apenas, rara vez already say "not": "Poco no me sirvió" is the double negative Spanish does not use
  if (NEGATIVE_FORCE.test(c.toks.map(low).join(' ')) || FREQUENCY.test(c.toks.map(low).join(' '))) return null;
  const ts = insertBefore(c.toks, c.groupStart, 'no');
  return { es: render(ts), toks: ts, accept: [] };
}

/** Make a negative sentence affirmative: no como > como. */
export function affirm(c: Clause): Rewritten | null {
  if (c.neg < 0) return null;
  if (c.toks.some((t, i) => i !== c.neg && POLARITY.has(low(t)))) return null;
  const ts = removeToks(c.toks, c.neg, c.neg + 1);
  return { es: render(ts), toks: ts, accept: [] };
}

export interface Pronominalised extends Rewritten {
  /** The noun phrase replaced, as written ("el libro"). */
  np: string;
  clitic: string;
  gender: 'm' | 'f';
  plural: boolean;
}

const DEFINITE = /^(el|la|los|las|este|esta|estos|estas|ese|esa|esos|esas|mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras)$/;

/** Replace the direct object with a pronoun: leo el libro > lo leo;
 *  quiero comprar la casa > quiero comprarla (or la quiero comprar). */
export function pronominalise(c: Clause, lexicon?: Readonly<Record<string, 'm' | 'f'>>): Pronominalised | null {
  const comp = c.complement >= 0 ? low(c.toks[c.complement]) : '';
  if (comp && !isInfinitive(comp) && !gerundOf(comp)) return null;                   // already has enclitics
  const head = comp ? (isInfinitive(comp) ? comp : gerundOf(comp)!) : c.choice.inf;
  if (!TRANSITIVE.has(head) || (comp && !CLIMBING.has(c.choice.inf.replace(/se$/, '')))) return null;
  // "Te voy a mostrar mi cuarto" is "Te lo voy a mostrar" or "Voy a mostrártelo": two clitics do not split around the verbs
  if (comp && c.proclitics.length) return null;
  // a question word or an exclamation in front: the noun phrase after the verb is usually its subject (¿Cuándo empieza la reunión?, ¡Cómo cambió el barrio!)
  if (c.toks.some((t) => /[¿¡]/.test(t.pre)) && c.toks.slice(0, c.verb).some((t) => /^(qué|quién|quiénes|cuál|cuáles|cuánto|cuánta|cuántos|cuántas|cómo)$/.test(low(t)) || /¡/.test(c.toks[0].pre))) return null;
  if (c.reflexive && !comp) return null;
  const j = (c.complement >= 0 ? c.complement : c.participle >= 0 ? c.participle : c.verb) + 1;
  const det = low(c.toks[j]);
  if (!DEFINITE.test(det) || low(c.toks[j - 1]) === 'a') return null;
  if (/[,;:]$/.test(c.toks[j - 1].post)) return null;                                // "…, la verdad.": a remark, not an object
  const noun = low(c.toks[j + 1]);
  if (!noun || isFunctionWord(noun) || WHEN_NOUNS.has(noun) || verbReadings(noun).length && !/[aeo]s?$/.test(noun)) return null;
  let end = j + 2;
  // one adjective may follow, if the noun has no comma after it
  const adj = low(c.toks[end]);
  if (adj && !c.toks[j + 1].post && !isFunctionWord(adj) && !TIME_WORDS.has(adj) && !PREPOSITIONS.has(adj) && !/^(todos|todas|mucho|mucha|muchos|muchas|poco|más|menos|también)$/.test(adj)) end++;
  // the NP must end the sentence, or be followed only by time words
  const spans = timeSpans(c.toks);
  let k = end;
  while (k < c.toks.length) {
    const span = spans.find(([a]) => a === k);
    if (!span) return null;
    k = span[1];
  }
  if (c.toks[end - 1].post && /[,;]/.test(c.toks[end - 1].post)) return null;
  const plural = /s$/.test(det) || isPluralWord(noun) && !/^(el|la|este|esta|ese|esa|mi|tu|su|nuestro|nuestra)$/.test(det);
  // "¿Dónde comen los médicos?": behind a third-person verb in a question, a noun phrase that agrees with it is its subject as readily as its object
  const third = c.choice.person === 'él/ella' ? false : c.choice.person === 'ellos' ? true : undefined;
  if (third === plural && c.subject < 0 && c.toks.some((t) => /¿/.test(t.pre))) return null;
  const gender = nounGender(noun, /^(mi|mis|tu|tus|su|sus)$/.test(det) ? undefined : det, lexicon);
  if (!gender) return null;
  const clitic = cliticFor(gender, plural);
  const np = c.toks.slice(j, end).map((t) => t.core).join(' ');

  let ts = removeToks(c.toks, j, end);
  const accept: string[] = [];
  if (comp) {
    // enclitic on the infinitive / gerund, proclitic before the finite verb as an alternative
    const encl = attachEnclitic(comp, clitic);
    const tsEncl = replaceCore(ts, c.complement, encl);
    if (!c.proclitics.length) accept.push(render(insertBefore(ts, c.verb, clitic)));
    ts = tsEncl;
  } else {
    if (c.proclitics.length > 1) return null;
    if (c.proclitics.length === 1 && low(ts[c.proclitics[0]]) === 'se' && !c.reflexive) return null;   // se vende el carro: the noun phrase is the subject
    if (c.proclitics.length === 1) {
      const p = low(ts[c.proclitics[0]]);
      if (p === 'le' || p === 'les') ts = replaceCore(ts, c.proclitics[0], 'se');
      else if (!/^(me|te|nos|se)$/.test(p)) return null;
    }
    ts = insertBefore(ts, c.verb, clitic);
  }
  return { es: render(ts), toks: ts, accept, np, clitic, gender, plural };
}

