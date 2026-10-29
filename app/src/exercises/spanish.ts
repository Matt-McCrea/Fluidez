/* ============================================================================
 * THE SENTENCE LAYER the generators and the translation matcher share.
 *
 * Bank sentences are plain strings. To re-inflect one (new person, new tense,
 * negated, object replaced by a pronoun) the generator has to find the verb,
 * its subject, its clitics and its object, and it does that with the engine's
 * analyser plus a few closed word classes — never with a guess. Every
 * function here returns null when the sentence is not one it is sure about,
 * and every caller drops the item on null. A missing item costs nothing; a
 * wrong one is the app being wrong at the learner.
 * ========================================================================== */
import { analyzeToken, deaccent, enPhrase as enPhraseFn, gerund as gerundFn, participle as participleFn, PERSONS, verbByInf, VERBS } from '../engine';
import type { Analysis, Person, TenseKey } from '../engine';
import { nuclei, stressedNucleus } from '../engine/ortho';

// ---- tokens ----------------------------------------------------------------

/** One whitespace-separated chunk: leading marks, the word, trailing marks. */
export interface Tok { pre: string; core: string; post: string }

const TOK_RE = /^([¿¡"'«“‘(\[—–-]*)(.*?)([.,;:!?»"'”’)\]…—–-]*)$/u;

export function toToks(s: string): Tok[] {
  return s.trim().split(/\s+/).filter(Boolean).map((chunk) => {
    const m = TOK_RE.exec(chunk);
    return m ? { pre: m[1], core: m[2], post: m[3] } : { pre: '', core: chunk, post: '' };
  }).filter((t) => t.core || t.pre || t.post);
}

export function render(ts: readonly Tok[]): string {
  return ts.map((t) => t.pre + t.core + t.post).join(' ');
}

export const low = (t: Tok | undefined): string => (t ? t.core.toLowerCase() : '');

/** Lowercase word tokens, punctuation and ¿¡ removed. */
export function words(s: string): string[] {
  return s.toLowerCase().replace(/[^a-záéíóúñü\s]/g, ' ').split(/\s+/).filter(Boolean);
}

/** Comparison key for "is this the same sentence": lowercase, no punctuation. */
export function sentenceKey(s: string): string {
  return words(s).join(' ');
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** Is a capitalised sentence-initial word capitalised only because it opens
 *  the sentence? Function words and verb forms are; a name is not. */
function lowerable(core: string): boolean {
  const first = core.split(' ')[0];
  const l = first.toLowerCase();
  return FUNCTION.has(l) || analyzeToken(l).length > 0 || /^[a-záéíóúñü]+$/.test(first);
}

/** Copy a token list, insert `core` at `at`. Leading marks (¿ ¡) stay at the
 *  front of the sentence and capitalisation moves with them. */
export function insertTok(ts: readonly Tok[], at: number, core: string): Tok[] {
  const out = ts.map((t) => ({ ...t }));
  const tok: Tok = { pre: '', core, post: '' };
  if (at === 0 && out.length) {
    tok.pre = out[0].pre; out[0].pre = '';
    if (/^[A-ZÁÉÍÓÚÑ]/.test(out[0].core)) {
      tok.core = cap(core);
      if (lowerable(out[0].core)) out[0].core = out[0].core[0].toLowerCase() + out[0].core.slice(1);
    }
  }
  out.splice(at, 0, tok);
  return out;
}

/** Copy a token list without tokens [from, to). Marks are handed on. */
export function removeToks(ts: readonly Tok[], from: number, to: number): Tok[] {
  const out = ts.map((t) => ({ ...t }));
  const gone = out.splice(from, to - from);
  if (!gone.length) return out;
  const pre = gone[0].pre, post = gone[gone.length - 1].post;
  if (from < out.length) {
    out[from].pre = pre + out[from].pre;
    if (from === 0 && /^[A-ZÁÉÍÓÚÑ]/.test(gone[0].core)) out[0].core = cap(out[0].core);
  } else if (out.length) {
    out[out.length - 1].post += post;
  }
  return out;
}

export function replaceCore(ts: readonly Tok[], at: number, core: string): Tok[] {
  const out = ts.map((t) => ({ ...t }));
  const was = out[at].core;
  out[at].core = /^[A-ZÁÉÍÓÚÑ]/.test(was) ? cap(core) : core;
  return out;
}

// ---- closed word classes ---------------------------------------------------

export const SUBJECT_PRONOUNS: Readonly<Record<string, Person>> = {
  yo: 'yo', 'tú': 'tú', 'él': 'él/ella', ella: 'él/ella', usted: 'él/ella',
  nosotros: 'nosotros', nosotras: 'nosotros', ellos: 'ellos', ellas: 'ellos', ustedes: 'ellos',
  vosotros: 'vosotros', vosotras: 'vosotros',
};
export const CLITICS = new Set(['me', 'te', 'se', 'lo', 'la', 'le', 'nos', 'os', 'los', 'las', 'les']);
export const REFLEXIVE: Readonly<Record<Person, string>> = {
  yo: 'me', 'tú': 'te', 'él/ella': 'se', nosotros: 'nos', vosotros: 'os', ellos: 'se',
};
export const ARTICLES = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas']);
export const DEMONSTRATIVES = new Set(['este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas']);
export const POSSESSIVES = new Set(['mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra', 'vuestros', 'vuestras']);
export const PREPOSITIONS = new Set(['a', 'al', 'ante', 'bajo', 'con', 'contra', 'de', 'del', 'desde', 'en', 'entre', 'hacia', 'hasta', 'para', 'por', 'según', 'sin', 'sobre', 'tras']);
export const DETERMINERS = new Set([...ARTICLES, ...DEMONSTRATIVES, ...POSSESSIVES]);

/** Words the analyser reads as a verb that are, in a bank sentence, nearly
 *  always something else (para = parar, entre = entrar, nada = nadar). */
const NOT_VERBS = new Set(['para', 'entre', 'sobre', 'bajo', 'nada', 'solo', 'casa', 'como', 'mientras', 'cerca', 'bien', 'mal', 'tarde', 'pronto', 'claro', 'cada', 'medio', 'junto']);
/** `como` is a verb only when nothing else in the sentence is. */
const WEAK_NOT_VERBS = new Set(['como', 'trabajo', 'cocina', 'cena', 'paseo', 'viaje', 'estudio', 'baile', 'camino', 'vuelo', 'regreso', 'pregunta', 'cuento', 'ayuda', 'llamada', 'compra', 'vino', 'canto', 'desayuno', 'gusto', 'espera', 'juego', 'sueño', 'lleno', 'limpio', 'seco']);

const FUNCTION = new Set([
  ...Object.keys(SUBJECT_PRONOUNS), ...CLITICS, ...DETERMINERS, ...PREPOSITIONS,
  'no', 'que', 'qué', 'y', 'o', 'pero', 'si', 'sí', 'ya', 'también', 'siempre', 'nunca', 'hoy', 'ayer', 'mañana', 'ahora', 'aquí', 'allí',
  'dónde', 'cuándo', 'cómo', 'cuánto', 'cuánta', 'cuántos', 'cuántas', 'quién', 'quiénes', 'cuál', 'cuáles', 'por', 'muy', 'hay', 'todavía', 'anoche',
]);

/** Words whose presence makes negating a sentence change more than "no":
 *  también > tampoco, algo > nada, ya > todavía no. */
export const POLARITY = new Set(['no', 'nunca', 'nada', 'nadie', 'tampoco', 'ni', 'jamás', 'ya', 'también', 'todavía', 'algo', 'alguien', 'algún', 'alguna', 'alguno', 'algunos', 'algunas', 'siempre', 'todo', 'todos', 'todas', 'aún', 'muy', 'mucho', 'mucha', 'muchos', 'muchas']);

/** Time words. A tense swap removes them (structured input: the verb alone
 *  must carry the time) and a tense transform refuses a sentence with one. */
export const TIME_WORDS = new Set(['ayer', 'hoy', 'mañana', 'anoche', 'ahora', 'siempre', 'nunca', 'ya', 'todavía', 'luego', 'después', 'antes', 'pronto', 'anteayer', 'normalmente', 'generalmente', 'entonces', 'temprano', 'aún', 'recién', 'jamás']);
export const TIME_PHRASES: readonly string[][] = [
  ['todos', 'los', 'días'], ['todas', 'las', 'semanas'], ['todas', 'las', 'mañanas'], ['todas', 'las', 'noches'],
  ['la', 'semana', 'pasada'], ['el', 'año', 'pasado'], ['el', 'mes', 'pasado'], ['la', 'semana', 'que', 'viene'], ['el', 'año', 'que', 'viene'],
  ['esta', 'mañana'], ['esta', 'tarde'], ['esta', 'noche'], ['este', 'fin', 'de', 'semana'], ['el', 'fin', 'de', 'semana'],
  ['por', 'la', 'mañana'], ['por', 'la', 'tarde'], ['por', 'la', 'noche'], ['a', 'veces'], ['de', 'niño'], ['de', 'niña'],
  ['el', 'lunes'], ['el', 'martes'], ['el', 'miércoles'], ['el', 'jueves'], ['el', 'viernes'], ['el', 'sábado'], ['el', 'domingo'],
  ['los', 'lunes'], ['los', 'martes'], ['los', 'miércoles'], ['los', 'jueves'], ['los', 'viernes'], ['los', 'sábados'], ['los', 'domingos'],
  ['cada', 'día'], ['cada', 'semana'], ['de', 'repente'], ['una', 'vez'], ['muchas', 'veces'],
];

/** Index ranges [from, to) of every time word or phrase in a token list. */
export function timeSpans(ts: readonly Tok[]): Array<[number, number]> {
  const lw = ts.map(low);
  const out: Array<[number, number]> = [];
  for (let i = 0; i < lw.length; i++) {
    const phrase = TIME_PHRASES.find((p) => p.every((w, k) => lw[i + k] === w));
    if (phrase) { out.push([i, i + phrase.length]); i += phrase.length - 1; continue; }
    if (TIME_WORDS.has(lw[i])) out.push([i, i + 1]);
  }
  return out;
}

// ---- finding the verb ------------------------------------------------------

export const FINITE: ReadonlySet<TenseKey> = new Set<TenseKey>(['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'presubj', 'impsubj']);

function inNounSlot(ts: readonly Tok[], i: number): boolean {
  const prev = low(ts[i - 1]);
  /* la / las / los / lo are articles AND clitics. Before a verb form they are
   * clitics when nothing but "no", a subject pronoun or another clitic is in
   * front of them: "La llamo", "No la veo" — but "Compré la cocina". */
  if (/^(la|las|los|lo)$/.test(prev)) {
    const pp = low(ts[i - 2]);
    if (!pp || pp === 'no' || SUBJECT_PRONOUNS[pp] || /^(me|te|se|nos|le|les)$/.test(pp) || /[,;:]$/.test(ts[i - 2].post)) return false;
    if (prev === 'lo') return false;
  }
  return DETERMINERS.has(prev) || PREPOSITIONS.has(prev);
}

/** Exact (accented) target-variety analyses of a token, finite or imperative. */
export function verbReadings(core: string): Analysis[] {
  return analyzeToken(core.toLowerCase()).filter((a) => a.accentExact && a.target && !a.clitics);
}

export interface FiniteCandidate { index: number; analyses: Analysis[] }

/** Every token that is a finite verb form, conservatively: noun slots, the
 *  NOT_VERBS list, and a weak reading when a stronger one exists are out. */
export function finiteCandidates(ts: readonly Tok[]): FiniteCandidate[] {
  const out: FiniteCandidate[] = [];
  const weak: FiniteCandidate[] = [];
  ts.forEach((t, i) => {
    const l = low(t);
    if (!l || NOT_VERBS.has(l) && !WEAK_NOT_VERBS.has(l)) return;
    if (inNounSlot(ts, i)) return;
    const an = verbReadings(l).filter((a) => FINITE.has(a.tense) || a.tense === 'imperativo');
    if (!an.length) return;
    (WEAK_NOT_VERBS.has(l) ? weak : out).push({ index: i, analyses: an });
  });
  // haber + participle: the participle is not a candidate (it never is); the
  // haber form is, and is marked by the caller through `compoundAt`.
  return out.length ? out : weak;
}

/** Is the token after i (skipping one adverb) a participle of a known verb? */
export function compoundParticiple(ts: readonly Tok[], i: number): number {
  const an = verbReadings(low(ts[i]));
  if (!an.some((a) => a.inf === 'haber')) return -1;
  for (let j = i + 1; j <= i + 2 && j < ts.length; j++) {
    if (/(ado|ido|ído|to|cho|so)$/.test(low(ts[j])) && participleOf(low(ts[j]))) return j;
  }
  return -1;
}

let PART_MAP: Map<string, string> | null = null;
let GER_MAP: Map<string, string> | null = null;
function buildVerbMaps(): void {
  if (PART_MAP && GER_MAP) return;
  PART_MAP = new Map(); GER_MAP = new Map();
  for (const v of VERBS) {
    try {
      PART_MAP.set(participleFn(v), v.inf);
      GER_MAP.set(deaccent(gerundFn(v)), v.inf);
    } catch { /* a verb the engine cannot build is simply not indexed */ }
  }
}

/** Infinitive whose participle this is (comido > comer), or null. */
export function participleOf(word: string): string | null {
  buildVerbMaps();
  return PART_MAP!.get(word.toLowerCase()) ?? null;
}
/** Infinitive whose gerund this is, accents ignored (comiendo > comer). */
export function gerundOf(word: string): string | null {
  buildVerbMaps();
  return GER_MAP!.get(deaccent(word.toLowerCase())) ?? null;
}
/** Is this word an infinitive of a known verb (comer, levantarse, ir)? */
export function isInfinitive(word: string): boolean {
  const w = word.toLowerCase();
  return !!verbByInf(w) || (/(ar|er|ir|ír)$/.test(w) && !!verbByInf(w + 'se'));
}

/** A verb form with enclitics split off: comerlo > comer + [lo],
 *  dándomelo > dando + [me, lo]. Only infinitives and gerunds — commands keep
 *  their enclitics (dámelo is not me lo das). */
export function splitEnclitic(word: string): { base: string; clitics: string[]; kind: 'inf' | 'ger' } | null {
  const w = word.toLowerCase();
  const tryBase = (b: string, cl: string[]) => {
    const plain = deaccent(b);
    if (isInfinitive(plain) && /(ar|er|ir)$/.test(plain)) return { base: plain === 'reir' || plain === 'oir' ? b.replace(/ir$/, 'ír') : plain, clitics: cl, kind: 'inf' as const };
    if (/(ando|iendo|yendo)$/.test(plain) && gerundOf(plain)) return { base: plain, clitics: cl, kind: 'ger' as const };
    return null;
  };
  for (const c1 of CLITICS) {
    if (!w.endsWith(c1) || w.length <= c1.length + 2) continue;
    const b1 = w.slice(0, -c1.length);
    for (const c2 of CLITICS) {
      if (!b1.endsWith(c2) || b1.length <= c2.length + 2) continue;
      const r = tryBase(b1.slice(0, -c2.length), [c2, c1]);
      if (r) return r;
    }
    const r = tryBase(b1, [c1]);
    if (r) return r;
  }
  return null;
}

// ---- English subject ---------------------------------------------------------

const EN_AUX = new Set(['do', 'does', 'did', 'am', 'is', 'are', 'was', 'were', 'can', 'could', 'will', 'would', 'should', 'have', 'has', 'had', "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't", "can't", "won't", "haven't", "hasn't"]);
const EN_WH = new Set(['what', 'where', 'when', 'why', 'how', 'which', 'who']);
const EN_SUBJ: Readonly<Record<string, Person[]>> = {
  i: ['yo'], you: ['tú', 'él/ella', 'ellos'], he: ['él/ella'], she: ['él/ella'], we: ['nosotros'], they: ['ellos'],
};

export interface EnSubject {
  /** The pronoun as written, lowercase ("she"), or null for a noun subject. */
  pronoun: string | null;
  /** Persons the English allows. "you" allows tú, usted (3sg) and ustedes (3pl). */
  persons: Person[];
  /** Token index of the subject pronoun in enWords(). */
  index: number;
}

const EN_CONTRACTIONS: Readonly<Record<string, string>> = {
  "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is', "it's": 'it is', "we're": 'we are', "they're": 'they are',
  "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have', "i'll": 'i will', "you'll": 'you will',
  "he'll": 'he will', "she'll": 'she will', "we'll": 'we will', "they'll": 'they will', "i'd": 'i would', "you'd": 'you would',
  "he'd": 'he would', "she'd": 'she would', "we'd": 'we would', "they'd": 'they would', "let's": 'let us',
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not',
  "weren't": 'were not', "can't": 'cannot', "won't": 'will not', "haven't": 'have not', "hasn't": 'has not', "wouldn't": 'would not',
  "couldn't": 'could not', "shouldn't": 'should not',
};
export function expandContractions(s: string): string {
  return s.replace(/[’‘]/g, "'").replace(/\b[a-z]+'[a-z]+\b/gi, (m) => {
    const x = EN_CONTRACTIONS[m.toLowerCase()];
    return x ?? m;
  });
}

/** Lowercase English words, contractions expanded. */
export function enWords(en: string): string[] {
  return expandContractions(en.toLowerCase()).replace(/[^a-z'\s-]/g, ' ').split(/\s+/).filter(Boolean);
}

const EN_LEADING = new Set(['yesterday', 'today', 'tomorrow', 'now', 'then', 'sometimes', 'usually', 'normally', 'finally', 'so', 'and', 'but', 'well', 'tonight', 'later', 'also', 'still']);

/** The subject of a simple English sentence: "I ate fish" > I; "Do you
 *  speak English?" > you; "Where does she live?" > she. Null when the
 *  subject is not a personal pronoun (a noun, a name, "it", "there"). */
export function enSubject(en: string): EnSubject | null {
  const w = enWords(en);
  let i = 0;
  while (EN_LEADING.has(w[i])) i++;
  if (EN_WH.has(w[i])) {
    i++;
    // "what time do you…", "how many brothers do you…", "how much does it…"
    if (!EN_AUX.has(w[i]) && EN_AUX.has(w[i + 1])) i++;
    else if (!EN_AUX.has(w[i]) && EN_AUX.has(w[i + 2]) && /^(many|much|long|often|old)$/.test(w[i])) i += 2;
  }
  if (EN_AUX.has(w[i])) i++;
  if (w[i] === 'not') i++;
  const p = w[i];
  if (p === 'you' && (w[i + 1] === 'all' || w[i + 1] === 'guys')) return { pronoun: 'you all', persons: ['ellos'], index: i };
  if (p && EN_SUBJ[p]) return { pronoun: p, persons: EN_SUBJ[p].slice(), index: i };
  return null;
}

/** Does the English say "you" to one person, several, or leave it open? */
export function enYou(en: string): 'none' | 'open' | 'singular' | 'plural' | 'formal' | 'informal' {
  const l = en.toLowerCase();
  if (!/\byou(r|rs|rself|rselves)?\b/.test(l)) return 'none';
  if (/\(formal\)|\bsir\b|\bmadam\b|\bma'am\b/.test(l)) return 'formal';
  if (/\(informal\)|\(to a friend\)/.test(l)) return 'informal';
  if (/\byou all\b|\byou guys\b|\byourselves\b|\(plural\)|\bboth of you\b/.test(l)) return 'plural';
  if (/\byourself\b/.test(l)) return 'singular';
  return 'open';
}

// ---- parsing a clause ----------------------------------------------------------

/** Verbs whose grammatical subject is not the doer (me gusta, me duele): the
 *  English subject ("I like") is the Spanish indirect object. */
export const EXPERIENCER = new Set(['gustar', 'encantar', 'interesar', 'importar', 'doler', 'molestar', 'faltar', 'parecer', 'quedar', 'fascinar', 'preocupar', 'aburrir']);

export interface VerbChoice { inf: string; tense: TenseKey; person: Person }

export interface Clause {
  toks: Tok[];
  /** Index of the finite verb (the haber form in a compound). */
  verb: number;
  choice: VerbChoice;
  /** Participle index when the verb is haber + participle. */
  participle: number;
  /** Index of "no" before the verb group, or -1. */
  neg: number;
  /** Indices of proclitics between "no" and the verb. */
  proclitics: number[];
  /** Explicit subject pronoun index, or -1. */
  subject: number;
  /** First index of the verb group (no / clitics / verb). */
  groupStart: number;
  /** Is the verb reflexive here (me levanto)? */
  reflexive: boolean;
  /** Infinitive or gerund complement index (quiero comer, estoy comiendo), or -1. */
  complement: number;
}

const PERSON_TENSE_HINTS: ReadonlyArray<[RegExp, TenseKey[]]> = [
  [/\b(ayer|anoche|anteayer|pasad[oa])\b/, ['preterito', 'imperfecto']],
];
/** Tense the English verb phrase pins, when it pins one. */
function enTenseHint(en: string): TenseKey[] | null {
  const w = ' ' + enWords(en).join(' ') + ' ';
  if (/ (am|is|are) (not )?\w+ing /.test(w) && !/ going to /.test(w)) return ['presente'];
  if (/ (was|were) \w+ing | used to /.test(w)) return ['imperfecto'];
  if (/ will /.test(w)) return ['futuro'];
  if (/ (do|does) /.test(w)) return ['presente'];
  if (/ did /.test(w)) return ['preterito', 'imperfecto'];
  return null;
}

/** English verb phrase of an analysis, subject and qualifier removed. */
function enVP(inf: string, tense: TenseKey, person: Person): string | null {
  const v = verbByInf(inf);
  if (!v) return null;
  const idx = PERSONS.indexOf(person);
  const ph = enPhraseFn(v, tense, idx).text.replace(/\s*\([^)]*\)/g, '');
  return ph.split(' ').slice(person === 'ellos' && /^you all/.test(ph) ? 2 : 1).join(' ').toLowerCase();
}

/** Which of several readings of one form does the English mean? */
function byEnglish(an: Analysis[], en: string): Analysis[] {
  const ew = ' ' + enWords(en).join(' ') + ' ';
  const hit = an.filter((a) => {
    const vp = enVP(a.inf, a.tense, a.person as Person);
    if (!vp) return false;
    const head = vp.split(' ').pop()!;
    return ew.includes(' ' + vp + ' ') || (vp.split(' ').length === 1 && ew.includes(' ' + head + ' '));
  });
  return hit.length ? hit : an;
}

/** Choose the finite verb and its reading. `en` (the bank English) resolves
 *  person and tense where one Spanish form has several (comía: yo or él;
 *  hablamos: present or preterite). Null if the sentence has no single finite
 *  verb or the reading stays ambiguous. */
export function parseClause(es: string, en?: string, opts: { allowMany?: boolean; index?: number } = {}): Clause | null {
  const ts = toToks(es);
  let cands = finiteCandidates(ts);
  if (opts.index != null) cands = cands.filter((c) => c.index === opts.index);
  if (!cands.length) return null;
  if (cands.length > 1 && !opts.allowMany) return null;
  const cand = cands[0];
  const i = cand.index;
  let an = cand.analyses.filter((a) => a.tense !== 'imperativo');
  if (!an.length || an.some((a) => EXPERIENCER.has(a.inf))) return null;

  // the verb group to the left: [no] [clitic]* verb
  let k = i - 1;
  const proclitics: number[] = [];
  while (k >= 0 && CLITICS.has(low(ts[k])) && proclitics.length < 2) { proclitics.unshift(k); k--; }
  const neg = k >= 0 && low(ts[k]) === 'no' ? k : -1;
  if (neg >= 0) k--;
  const groupStart = k + 1;
  let subject = -1;
  if (k >= 0 && SUBJECT_PRONOUNS[low(ts[k])] && !PREPOSITIONS.has(low(ts[k - 1]))) subject = k;
  else if (SUBJECT_PRONOUNS[low(ts[i + 1])] && !ts[i].post) subject = i + 1;

  const persons = new Set<string>();
  if (subject >= 0) persons.add(SUBJECT_PRONOUNS[low(ts[subject])]);
  const sub = en ? enSubject(en) : null;
  let allowed: Person[] | null = null;
  if (subject >= 0) allowed = [SUBJECT_PRONOUNS[low(ts[subject])]];
  if (sub) allowed = allowed ? allowed.filter((p) => sub.persons.includes(p)) : sub.persons;
  if (allowed) an = an.filter((a) => allowed!.includes(a.person as Person));
  if (!an.length) return null;

  // reflexive: a proclitic matching the person, on a verb with a reflexive entry
  const lastClitic = proclitics.length ? low(ts[proclitics[proclitics.length - 1]]) : '';
  const reflexAn = an.filter((a) => /se$/.test(a.inf) && REFLEXIVE[a.person as Person] === lastClitic);
  const reflexive = reflexAn.length > 0;
  an = reflexive ? reflexAn : (an.some((a) => !/se$/.test(a.inf)) ? an.filter((a) => !/se$/.test(a.inf)) : an);

  if (en) an = byEnglish(an, en);
  const keyOf = (a: Analysis) => `${a.tense}|${a.person}`;
  if (new Set(an.map(keyOf)).size > 1 && en) {
    const hint = enTenseHint(en);
    if (hint) { const f = an.filter((a) => hint.includes(a.tense)); if (f.length) an = f; }
  }
  if (new Set(an.map(keyOf)).size > 1) {
    const lw = ts.map(low).join(' ');
    for (const [re, tenses] of PERSON_TENSE_HINTS) if (re.test(lw)) an = an.filter((a) => tenses.includes(a.tense));
    if (new Set(an.map(keyOf)).size > 1) return null;
  }
  const a = an[0];
  if (!a) return null;
  const participle = compoundParticiple(ts, i);

  let complement = -1;
  for (let j = (participle >= 0 ? participle : i) + 1; j <= i + 3 && j < ts.length; j++) {
    const lj = low(ts[j]);
    if (isInfinitive(lj) || splitEnclitic(lj) || (/(ando|iendo|yendo)$/.test(lj) && gerundOf(lj))) { complement = j; break; }
    if (!['a', 'de', 'que'].includes(lj)) break;
  }
  return {
    toks: ts, verb: i, choice: { inf: a.inf, tense: a.tense, person: a.person as Person },
    participle, neg, proclitics, subject, groupStart, reflexive, complement,
  };
}

// ---- nouns and adjectives ---------------------------------------------------------

const KEEP_HIATUS = (w: string, i: number) => {
  const c = w[i];
  if (c !== 'í' && c !== 'ú') return false;
  return /[aeoáéó]/.test(w[i - 1] ?? '') || /[aeoáéó]/.test(w[i + 1] ?? '');
};
function stripStressAccents(w: string): string {
  let out = '';
  for (let i = 0; i < w.length; i++) out += /[áéíóú]/.test(w[i]) && !KEEP_HIATUS(w, i) ? deaccent(w[i]) : w[i];
  return out;
}
/** Spell `plain` with stress on nucleus `s` (counted from the END: 0 = last). */
function respell(plain: string, sFromEnd: number): string {
  const ns = nuclei(plain);
  if (!ns.length) return plain;
  const s = ns.length - 1 - sFromEnd;
  if (s < 0) return plain;
  const natural = /[aeiouns]$/.test(plain) ? ns.length - 2 : ns.length - 1;
  if (s === Math.max(0, natural) || ns.length === 1) return plain;
  const [a, b] = ns[s];
  let pos = -1;
  for (let j = a; j < b; j++) if (/[aeo]/.test(plain[j])) { pos = j; break; }
  if (pos < 0) pos = b - 1;
  const acute: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
  return acute[plain[pos]] ? plain.slice(0, pos) + acute[plain[pos]] + plain.slice(pos + 1) : plain;
}
function stressFromEnd(w: string): number {
  return nuclei(w).length - 1 - stressedNucleus(w);
}

const INVARIANT_PLURAL = new Set(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'crisis', 'tesis', 'virus', 'paraguas', 'cumpleaños', 'gafas']);

/** Plural of a Spanish noun or adjective: casa > casas, ciudad > ciudades,
 *  lápiz > lápices, canción > canciones, joven > jóvenes, inglés > ingleses. */
export function pluralize(w: string): string {
  if (INVARIANT_PLURAL.has(w)) return w;
  if (/[aeiouáéó]$/.test(w)) return w + 's';
  if (/[íú]$/.test(w)) return w + 'es';
  const sFromEnd = stressFromEnd(w) + 1;
  let plain = stripStressAccents(w);
  if (/z$/.test(plain)) plain = plain.slice(0, -1) + 'c';
  return respell(plain + 'es', sFromEnd);
}

/** Singular of a regular plural; inverse of pluralize for the words it makes. */
export function singularize(w: string): string {
  if (INVARIANT_PLURAL.has(w)) return w;
  if (/[^aeiouáéíóú]es$/.test(w) && !/[aeiou]s$/.test(w.slice(0, -1))) {
    const sFromEnd = stressFromEnd(w) - 1;
    let plain = stripStressAccents(w.slice(0, -2));
    if (/c$/.test(plain) && /ces$/.test(w)) plain = plain.slice(0, -1) + 'z';
    return respell(plain, Math.max(0, sFromEnd));
  }
  if (/[íú]es$/.test(w)) return w.slice(0, -2);
  if (/s$/.test(w)) return w.slice(0, -1);
  return w;
}

export const isPluralWord = (w: string) => /s$/.test(w) && !INVARIANT_PLURAL.has(w);

/** Adjective in the other gender, or null when it does not inflect for gender
 *  (grande, feliz, verde) or the ending is not one we are sure of. */
export function otherGender(w: string): string | null {
  const pl = isPluralWord(w);
  const sg = pl ? singularize(w) : w;
  let out: string | null = null;
  if (/o$/.test(sg)) out = sg.slice(0, -1) + 'a';
  else if (/a$/.test(sg) && !/ista$/.test(sg)) out = sg.slice(0, -1) + 'o';
  else if (/(or|ón|ín|án|és)$/.test(sg) && !/(mejor|peor|mayor|menor|anterior|posterior|exterior|interior|superior|inferior)$/.test(sg)) out = respell(stripStressAccents(sg) + 'a', 1);
  else if (/(ora|ona|ina|ana|esa)$/.test(sg) && GENDER_FEM_FROM.has(sg)) out = GENDER_FEM_FROM.get(sg)!;
  if (!out) return null;
  return pl ? pluralize(out) : out;
}
const GENDER_FEM_FROM = new Map([
  ['trabajadora', 'trabajador'], ['habladora', 'hablador'], ['española', 'español'], ['inglesa', 'inglés'], ['francesa', 'francés'],
  ['alemana', 'alemán'], ['japonesa', 'japonés'], ['portuguesa', 'portugués'], ['dormilona', 'dormilón'], ['profesora', 'profesor'],
]);

/** Nouns that come in a masculine/feminine pair, with English for each. */
export const GENDER_PAIRS: ReadonlyArray<{ m: string; f: string; enM: string; enF: string }> = [
  { m: 'niño', f: 'niña', enM: 'boy', enF: 'girl' }, { m: 'chico', f: 'chica', enM: 'boy', enF: 'girl' },
  { m: 'hermano', f: 'hermana', enM: 'brother', enF: 'sister' }, { m: 'hijo', f: 'hija', enM: 'son', enF: 'daughter' },
  { m: 'amigo', f: 'amiga', enM: 'friend', enF: 'friend' }, { m: 'abuelo', f: 'abuela', enM: 'grandfather', enF: 'grandmother' },
  { m: 'tío', f: 'tía', enM: 'uncle', enF: 'aunt' }, { m: 'primo', f: 'prima', enM: 'cousin', enF: 'cousin' },
  { m: 'vecino', f: 'vecina', enM: 'neighbour', enF: 'neighbour' }, { m: 'profesor', f: 'profesora', enM: 'teacher', enF: 'teacher' },
  { m: 'doctor', f: 'doctora', enM: 'doctor', enF: 'doctor' }, { m: 'señor', f: 'señora', enM: 'man', enF: 'woman' },
  { m: 'novio', f: 'novia', enM: 'boyfriend', enF: 'girlfriend' }, { m: 'esposo', f: 'esposa', enM: 'husband', enF: 'wife' },
  { m: 'compañero', f: 'compañera', enM: 'classmate', enF: 'classmate' }, { m: 'alumno', f: 'alumna', enM: 'student', enF: 'student' },
  { m: 'gato', f: 'gata', enM: 'cat', enF: 'cat' }, { m: 'perro', f: 'perra', enM: 'dog', enF: 'dog' },
  { m: 'cocinero', f: 'cocinera', enM: 'cook', enF: 'cook' }, { m: 'médico', f: 'médica', enM: 'doctor', enF: 'doctor' },
];

/** Feminine nouns ending in -o / masculine ending in -a, the ones learners meet. */
const GENDER_EXCEPTIONS: Readonly<Record<string, 'm' | 'f'>> = {
  'día': 'm', mapa: 'm', problema: 'm', idioma: 'm', programa: 'm', sistema: 'm', tema: 'm', clima: 'm', planeta: 'm', sofá: 'm', 'papá': 'm',
  mano: 'f', foto: 'f', moto: 'f', radio: 'f', 'mamá': 'f',
};

/** Gender of a noun from its article if one is given, else from the lexicon
 *  passed in, else from a reliable ending (-o m, -a f, -ción f, -dad f). */
export function nounGender(noun: string, article?: string, lexicon?: Readonly<Record<string, 'm' | 'f'>>): 'm' | 'f' | null {
  const art = article?.toLowerCase();
  if (art && /^(el|un|este|ese|aquel|los|unos|estos|esos|aquellos|del|al|nuestro|nuestros)$/.test(art)) return 'm';
  if (art && /^(la|una|esta|esa|aquella|las|unas|estas|esas|aquellas|nuestra|nuestras)$/.test(art)) return 'f';
  const sg = isPluralWord(noun) ? singularize(noun) : noun;
  if (lexicon?.[sg]) return lexicon[sg];
  if (GENDER_EXCEPTIONS[sg]) return GENDER_EXCEPTIONS[sg];
  if (/o$/.test(sg)) return 'm';
  if (/(a|ción|sión|dad|tad|tud|umbre)$/.test(sg)) return 'f';
  return null;
}

/** Article / determiner in the other number: el > los, una > unas, mi > mis. */
export function detNumber(det: string, plural: boolean): string | null {
  const SG2PL: Record<string, string> = {
    el: 'los', la: 'las', un: 'unos', una: 'unas', este: 'estos', esta: 'estas', ese: 'esos', esa: 'esas', aquel: 'aquellos', aquella: 'aquellas',
    mi: 'mis', tu: 'tus', su: 'sus', nuestro: 'nuestros', nuestra: 'nuestras',
  };
  if (plural) return SG2PL[det] ?? (Object.values(SG2PL).includes(det) ? det : null);
  const PL2SG = Object.fromEntries(Object.entries(SG2PL).map(([a, b]) => [b, a]));
  return PL2SG[det] ?? (SG2PL[det] ? det : null);
}

/** Article / determiner in the other gender: el > la, un > una, este > esta. */
export function detGender(det: string): string | null {
  const M2F: Record<string, string> = {
    el: 'la', los: 'las', un: 'una', unos: 'unas', este: 'esta', estos: 'estas', ese: 'esa', esos: 'esas', nuestro: 'nuestra', nuestros: 'nuestras',
    aquel: 'aquella', aquellos: 'aquellas',
  };
  if (M2F[det]) return M2F[det];
  const F2M = Object.fromEntries(Object.entries(M2F).map(([a, b]) => [b, a]));
  if (F2M[det]) return F2M[det];
  if (/^(mi|mis|tu|tus|su|sus)$/.test(det)) return det;
  return null;
}

/** Object clitic for a noun phrase: el libro > lo, las llaves > las. */
export function cliticFor(gender: 'm' | 'f', plural: boolean): string {
  return (gender === 'm' ? 'lo' : 'la') + (plural ? 's' : '');
}

export function isFunctionWord(w: string): boolean { return FUNCTION.has(w.toLowerCase()); }
