/* ============================================================================
 * WHERE A CLAUSE OR A PHRASE SITS.
 *
 * Spanish lets a subordinate clause open the sentence or close it ("Si tengo
 * tiempo, voy" and "Voy si tengo tiempo"), and lets a time or a place phrase
 * do the same ("Hace dos semanas llegamos a Bogotá", "Llegamos a Bogotá hace
 * dos semanas"). The matcher does not look for such a move in what the learner
 * typed: it moves the model's own phrase and compares, so a form is accepted
 * only when it is the model with one whole constituent in another place.
 *
 * Each function returns the other orders of one single-sentence statement and
 * nothing for anything it is not sure of: a question, a dialogue, a clause
 * with a comma of its own, a phrase that belongs to an inner clause, an `si`
 * that means whether. A missing form costs a false rejection the sidecar can
 * fix. A wrong one teaches wrong Spanish.
 * ========================================================================== */
import { analyzeToken } from '../engine';
import { closedClass, isKnownForm } from './support/lexicon';
import { finiteCandidates, gerundOf, isInfinitive, low, participleOf, render, splitEnclitic, verbReadings, type Tok } from './support/spanish';

const STOP = /[.!?…]+$/;
/** A stop or a comma that closes a piece of the sentence. */
const ENDING = /[.!?…,;]+$/;
const clone = (ts: readonly Tok[]): Tok[] => ts.map((t) => ({ ...t }));
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** One statement: a single stop, at the very end, and no question, exclamation or colon inside. */
function oneStatement(ts: readonly Tok[]): boolean {
  return ts.length >= 3 && ts.every((t, i) => !/[¿¡]/.test(t.pre) && (i === ts.length - 1 || !/[.!?…:;]/.test(t.post)));
}

/** Does this stretch have a verb of its own: a finite form, or a command (llámame)? */
function hasVerb(ts: readonly Tok[]): boolean {
  return finiteCandidates(ts).length > 0 || ts.some((t) => analyzeToken(low(t)).some((a) => a.target && a.accentExact && a.tense === 'imperativo'));
}

/** Names of places. A name after en is a place only if it is one: confío en Tomás, tengo fe en Vale. */
const PLACE_NAME = new Set([
  'bogotá', 'medellín', 'toronto', 'cali', 'candelaria', 'cartagena', 'colombia', 'chapinero', 'taganga', 'boyacá', 'canadá', 'monserrate', 'madrid', 'caracas',
  'barranquilla', 'paloquemao', 'miami', 'panamá', 'huila', 'españa', 'zipaquirá', 'tunja', 'méxico', 'usaquén', 'antioquia', 'pasto', 'lima', 'salento', 'honda',
  'quito', 'japón', 'soacha', 'ciénaga', 'sudamérica', 'américa', 'caribe', 'santander', 'cundinamarca', 'popayán', 'cúcuta', 'bucaramanga', 'manizales', 'pereira',
]);

/** The cast: a capital on one of these is a name's, whether or not the word is also a word (Vale, Rosa, Mariana). */
const CAST = /^(vale|rosa|mariana|simón|tomás|hernando|altamira|yesid|joaquín|fredy|gloria|marta|beatriz|lucía|camila|jhon|ricardo|ana|clara|luz|pilar|jaime|pedro|laura|inés|andrés|teresa|luis|sofía|pablo|cecilia|eduardo|valentina|clemencia|pacho|pancho|victorino|mono|burra|esquina)$/;

/** The token that opened the sentence, now opening nothing: lowered when its capital was only the sentence's, kept when it is a name. */
function lowerFirst(t: Tok): Tok {
  const l = t.core.toLowerCase();
  const word = closedClass(l) || isKnownForm(l) || verbReadings(l).length > 0 || /^(si|cuando|aunque|nadie|lindo|solo)$/.test(l);
  return /^\p{Lu}/u.test(t.core) && word && !CAST.test(l) && !PLACE_NAME.has(l) ? { ...t, core: l } : t;
}
const capFirst = (t: Tok): Tok => ({ ...t, core: cap(t.core) });

/** `first` then `second` as one sentence: `first` opens it, `second` ends it and carries the stop; a comma shows where `first` ends when it is the clause or phrase that was moved up. */
function joined(first: readonly Tok[], second: readonly Tok[], stop: string, comma: boolean): string {
  const a = clone(first), b = clone(second);
  a[a.length - 1].post = a[a.length - 1].post.replace(ENDING, '') + (comma ? ',' : '');
  b[b.length - 1].post = b[b.length - 1].post.replace(ENDING, '') + stop;
  return render([capFirst(a[0]), ...a.slice(1), lowerFirst(b[0]), ...b.slice(1)]);
}

const commaIn = (ts: readonly Tok[]) => ts.slice(0, -1).some((t) => t.post.includes(','));

// ---- si, cuando, aunque -------------------------------------------------------------

const CLAUSE = /^(si|cuando|aunque)$/;
/** What may not stand right before the word that opens the clause: it would be part of something else (como si, por si, aun cuando, desde cuando, y aunque, si bien). */
const NOT_BEFORE = /^(y|o|e|u|ni|pero|sino|que|como|porque|aun|solo|sólo|apenas|casi|por|de|desde|hasta|para|hace|mucho|cada|todo|todas|todos|tal|incluso|justo|justamente|precisamente|exactamente|especialmente|menos|excepto|salvo|es|fue|era|son|eran|fueron|será|sería|sea|fuera)$/;
/** Verbs whose si is "whether": No sé si viene, Pregúntele si viene, a ver si. Moving that clause up would say another thing. */
const WHETHER = /^(saber|preguntar|decir|dudar|ver|averiguar|depender|importar|avisar|comprobar|confirmar|mirar|fijar|contar|imaginar|recordar|acordar|olvidar|ignorar|entender|parecer|adivinar|asegurar|revisar|chequear|checar|consultar|querer|quedar|resolver|establecer|aclarar|determinar|decidir|discutir|plantear|cuestionar|evaluar|analizar|investigar|examinar|verificar|reconocer|notar|descubrir|explicar|demostrar|enterar|mostrar|indicar|probar|medir|calcular|esperar)$/;
/** Nouns that hand the question on: la duda de si, no tengo idea si. */
const WHETHER_NOUN = /^(idea|duda|pregunta|cuestión|incógnita|problema|misterio|razón|señal|prueba|manera)$/;

/** Does a si after these words ask something ("¿Sabes si viene?") instead of making a condition? Any form of these verbs counts: the infinitive, a command, a form with its little words on. */
export function asksWhether(before: readonly string[]): boolean {
  return before.some((w) => {
    return WHETHER_NOUN.test(w) || WHETHER.test(w.replace(/(se|me|te|lo|la|le|nos|los|las|les)+$/, '')) || analyzeToken(w).some((a) => a.accentExact && WHETHER.test(a.inf.replace(/se$/, '')));
  });
}

/** The sentence with its subordinate clause moved to the other end, or none. */
export function clauseOrderVariants(es: string, toks: readonly Tok[]): string[] {
  if (/\n/.test(es) || !oneStatement(toks)) return [];
  const stop = toks[toks.length - 1].post.match(STOP)?.[0] ?? '';
  // the clause first: it ends at the first comma that follows a verb of its own, and what is left has a verb and no comma
  if (CLAUSE.test(low(toks[0]))) {
    if (low(toks[0]) === 'si' && /^(bien|no|es|acaso)$/.test(low(toks[1]))) return [];
    const k = toks.findIndex((t, i) => i > 0 && i < toks.length - 1 && t.post.includes(',') && hasVerb(toks.slice(0, i + 1)));
    if (k < 0) return [];
    const sub = toks.slice(0, k + 1), main = toks.slice(k + 1);
    if (!hasVerb(main) || commaIn(main) || /^(y|e|o|u|pero|sino|que|porque|entonces|pues|así|ni)$/.test(low(main[0]))) return [];
    return [joined(main, sub, stop, false)];
  }
  // the clause last: from its opening word to the end. The main clause has the one verb the clause hangs on, and no verb of saying or asking
  const p = toks.findIndex((t, i) => i > 0 && CLAUSE.test(low(t)));
  if (p < 1) return [];
  const main = toks.slice(0, p), sub = toks.slice(p);
  if (!hasVerb(sub) || commaIn(main) || commaIn(sub) || finiteCandidates(main).length !== 1) return [];
  // "Fue ayer cuando me enteré": a cleft, the clause is what it is about
  if (/^(fue|es|era|será|sería)$/.test(low(main[0])) && main.length <= 3 && /^(entonces|ayer|hoy|ahora|ahí|allí|aquí|allá|así|anoche|en)$/.test(low(main[1]))) return [];
  // "Siento no haberte escuchado cuando me hablaste": the clause belongs to the perfect inside, and in front of siento it says another thing
  if (main.some((t) => /^haber/.test(low(t)) && (low(t) === 'haber' || splitEnclitic(low(t))?.base === 'haber'))) return [];
  if (NOT_BEFORE.test(low(main[main.length - 1])) || (low(sub[0]) !== 'aunque' && asksWhether(main.map(low))) || (low(sub[0]) === 'si' && /^(bien|no|es|acaso)$/.test(low(sub[1])))) return [];
  return [joined(sub, main, stop, true)];
}

// ---- hace dos semanas, en el café -------------------------------------------------------

const NUMBER = /^(\d+|un|una|unos|unas|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta|cuarenta|cincuenta|sesenta|cien|mil|varios|varias|muchos|muchas|pocos|pocas)$/;
const TIME_UNIT = /^(segundos?|minutos?|horas?|días?|semanas?|mes|meses|años?|siglos?|décadas?|momento|rato|ratos)$/;

/** Verbs that put something somewhere, are somewhere, or ask for an en that is not a place: the phrase is part of what they say, and fronting it leaves a verb on its own at the end. */
const NOT_LOCATIVE = /^(poner|ponerse|meter|dejar|colocar|guardar|echar|tirar|sentarse|instalar|ubicar|esconder|subir|ser|estar|quedar|quedarse|pensar|confiar|creer|consistir|tardar|insistir|convertir|convertirse|entrar|participar|fijarse|interesarse|soñar|especializarse|basarse|apoyarse)$/;
/** Subordinators in what is left: the phrase might belong to the clause they open. */
const SUBORDINATING = /^(que|porque|si|cuando|aunque|mientras|donde|quien|quienes|como|para|y|e|o|u|pero|sino)$/;

const PLACE = new Set([
  'casa', 'café', 'cafetería', 'oficina', 'ciudad', 'parque', 'tienda', 'banco', 'calle', 'hotel', 'restaurante', 'plaza', 'barrio', 'centro', 'mercado',
  'estación', 'universidad', 'colegio', 'escuela', 'hospital', 'aeropuerto', 'biblioteca', 'iglesia', 'cocina', 'sala', 'cuarto', 'habitación', 'baño',
  'jardín', 'piso', 'edificio', 'país', 'pueblo', 'finca', 'playa', 'montaña', 'panadería', 'farmacia', 'supermercado', 'teatro', 'cine', 'museo', 'gimnasio',
]);
/** Places that take no article after en: "en casa". */
const BARE_PLACE = new Set(['casa']);
const DET = /^(el|la|los|las|mi|tu|su|nuestro|nuestra|este|esta|ese|esa|un|una)$/;
const isName = (t: Tok | undefined) => !!t && /^\p{Lu}/u.test(t.core);
/** What may not stand right before a phrase that moves: it would be part of a comparison or a list. */
const NOT_BEFORE_PHRASE = /^(que|como|y|o|e|u|ni|pero|sino|más|menos|de|desde|hasta|entre|también|solo|sólo|solamente|únicamente|incluso|aun|tanto|todo)$/;
/** Little words that open an inner phrase around a verb form: "se queja de haber esperado en la calle" keeps the phrase in there. */
const INNER_OPENER = /^(de|en|por|sin|con|para|al)$/;
const isNonfinite = (w: string) => isInfinitive(w) || !!gerundOf(w) || !!participleOf(w) || !!splitEnclitic(w);

/** How many tokens from `at` are one place phrase (en el café, en Bogotá, en la casa de Vale), or 0. */
function placeLength(ts: readonly Tok[], at: number): number {
  if (low(ts[at]) !== 'en') return 0;
  let n = at + 1;
  if (isName(ts[n])) {
    while (isName(ts[n + 1]) && !ts[n].post) n++;
    return ts.slice(at + 1, n + 1).some((t) => PLACE_NAME.has(low(t))) ? n + 1 - at : 0;
  }
  if (DET.test(low(ts[n]))) n++;
  const noun = low(ts[n]);
  if (!PLACE.has(noun) || (n === at + 1 && !BARE_PLACE.has(noun))) return 0;
  n++;
  // "de Vale", "de la universidad": one more small phrase of the same place
  if (low(ts[n]) === 'de' && !ts[n - 1].post) {
    let m = n + 1;
    if (DET.test(low(ts[m]))) m++;
    if (ts[m] && ((isName(ts[m]) && PLACE_NAME.has(low(ts[m]))) || PLACE.has(low(ts[m])))) n = m + 1;
  }
  return n - at;
}

/** The sentence with a hace phrase or a place phrase moved from the front to the end, or from the end to the front. */
export function movedPhraseVariants(es: string, toks: readonly Tok[]): string[] {
  if (/\n/.test(es) || !oneStatement(toks)) return [];
  const stop = toks[toks.length - 1].post.match(STOP)?.[0] ?? '';
  const out: string[] = [];
  // "hace dos semanas": hace + a number + a unit of time, and not "hace dos años que" or "desde hace"
  const hacePhrase = (at: number) => low(toks[at]) === 'hace' && NUMBER.test(low(toks[at + 1])) && TIME_UNIT.test(low(toks[at + 2])) && low(toks[at + 3]) !== 'que'
    && !(at > 0 && /^(desde|por|de|para|hasta|hace)$/.test(low(toks[at - 1])));
  const phraseAt = (at: number): number => (hacePhrase(at) ? 3 : placeLength(toks, at));
  /** The rest is one clause: a single verb of its own, and no comma, so the phrase belongs to it and to nothing else. */
  const oneClause = (rest: readonly Tok[], place: boolean) => {
    const verb = finiteCandidates(rest);
    if (verb.length !== 1 || commaIn(rest) || rest.some((t) => SUBORDINATING.test(low(t)) || low(t) === 'hay')) return false;
    // "En Bogotá, nací" and "Hace una década, eso fue": the phrase was what the verb was saying. An adverb gives the verb something to stand on
    const bare = verb[0].index === rest.length - 1 && !/mente$/.test(low(rest[verb[0].index - 1]));
    if (bare && (place || verb[0].analyses.some((a) => a.inf === 'ser' || a.inf === 'estar'))) return false;
    if (!place) return true;
    if (verb[0].analyses.some((a) => NOT_LOCATIVE.test(a.inf.replace(/se$/, '')))) return false;
    // "se queja de haber esperado en la calle": the place goes with the verb inside. "recuerdos de mi niñez en Boyacá": with the noun in front of it
    if (rest.some((t, i) => i > 0 && INNER_OPENER.test(low(rest[i - 1])) && isNonfinite(low(t)))) return false;
    return !rest.slice(-4).some((t) => low(t) === 'de');
  };
  const front = phraseAt(0);
  if (front && front < toks.length - 1) {
    const rest = toks.slice(front);
    // the comma after the phrase is the one comma allowed; the rest keeps none
    if (oneClause(rest, low(toks[0]) === 'en')) out.push(joined(rest, toks.slice(0, front), stop, false));
  }
  // at the end: the phrase must run to the last word
  for (let at = toks.length - 2; at >= Math.max(1, toks.length - 6); at--) {
    const len = phraseAt(at);
    if (!len || at + len !== toks.length) continue;
    const rest = toks.slice(0, at);
    if (!NOT_BEFORE_PHRASE.test(low(rest[rest.length - 1])) && oneClause(rest, low(toks[at]) === 'en')) out.push(joined(toks.slice(at), rest, stop, true));
    break;
  }
  return out;
}
