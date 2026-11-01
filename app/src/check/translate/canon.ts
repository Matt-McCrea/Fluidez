/* ============================================================================
 * CANONICAL FORM of a Spanish sentence, for translation matching.
 *
 * Two answers that differ only in things Spanish leaves free must meet in
 * the same canonical form; two that differ in anything else must not.
 *
 * FREE (normalised away):
 *  - case, punctuation, ¿ ¡, spacing;
 *  - the subject pronoun: "Yo como" = "Como". Removed, but RECORDED, so a
 *    pronoun that contradicts the English ("Él come" for "She eats") still
 *    fails (see pronounsAllowed in match.ts);
 *  - pronoun position with a verb that lets it climb: "Voy a verlo" =
 *    "Lo voy a ver", "Estoy leyéndolo" = "Lo estoy leyendo". Only with the
 *    CLIMBING verbs (querer, poder, ir a, estar + gerund…): "Odio hacerlo"
 *    has no "lo odio hacer". Commands are never touched: "Dámelo" and "Me lo
 *    das" are different sentences;
 *  - the position of a few adverbials (ya, también, siempre, hoy, ayer,
 *    mañana, anoche, ahora, todavía, normalmente, a veces, todos los días,
 *    esta noche…): sentence-initial, just before the verb group, just after
 *    it, or sentence-final. Never inside a noun phrase, never after a
 *    preposition ("el pan de ayer" keeps its ayer).
 *  - the pronoun in front of gustar and its kin: "A mí me gusta" = "Me gusta"
 *    (recorded like a subject pronoun, so "A él" still fails for "She likes");
 *  - the subject of a yes/no question (questionOrders, used by match.ts as
 *    accepted variants): "¿Simón habla inglés?" = "¿Habla Simón inglés?" =
 *    "¿Habla inglés Simón?". After a question word the verb comes first:
 *    "¿Qué quiere Vale?", never "¿Qué Vale quiere?".
 * NOT FREE: everything else, accents included (an accent-only difference
 * is reported as `near`, not as a pass).
 * ========================================================================== */
import { analyzeToken, deaccent } from '../../engine';
import type { Analysis, Person } from '../../engine';
import { CLIMBING } from '../../exercises/reinflect';
import {
  CLITICS, DETERMINERS, EXPERIENCER, PREPOSITIONS, SUBJECT_PRONOUNS, gerundOf, isInfinitive, participleOf, splitEnclitic, toToks, verbReadings, words,
  type Tok,
} from '../../exercises/spanish';

export interface CanonTok {
  /** The comparison key. */
  t: string;
  /** The original spelling when the token was rewritten (an enclitic form). */
  src?: string;
  /** A figure spelled in words, as it was written: digits agree with any spelling, but doscientos is not doscientas. */
  form?: string;
}

/** A subject pronoun written in front of gustar and its kin ("Yo me gusta",
 *  "Ella le gusta el café"). It is dropped like any subject pronoun, but with
 *  these verbs it can be a mistake the dropping would hide. */
export interface ExperiencerSlip {
  pron: string;
  /** Its person cannot be the subject of that verb: "yo me gusta". */
  mismatch: boolean;
  /** The verb is one where English makes the person the subject (like, love). */
  like: boolean;
}

export interface Canon {
  toks: CanonTok[];
  /** Subject pronouns removed, as written (accents kept). */
  pronouns: string[];
  /** Pronouns dropped in front of gustar and its kin, to be judged against the English. */
  experiencer: ExperiencerSlip[];
  /** Movable adverbials removed, with the slot each sat in. */
  advs: Array<{ t: string; slot: number; legal: boolean }>;
  /** Accent slips found while canonicalising ("el come" for "él come"). */
  accentSlips: number;
}

const MOVABLE_ONE = new Set(['ya', 'también', 'siempre', 'hoy', 'ayer', 'mañana', 'anoche', 'ahora', 'todavía', 'normalmente', 'generalmente', 'luego']);
const MOVABLE_MULTI: readonly string[][] = [
  ['a', 'veces'], ['todos', 'los', 'días'], ['todas', 'las', 'semanas'], ['esta', 'noche'], ['esta', 'mañana'], ['esta', 'tarde'],
  ['el', 'fin', 'de', 'semana'], ['la', 'semana', 'pasada'], ['el', 'año', 'pasado'], ['por', 'la', 'mañana'], ['por', 'la', 'tarde'], ['por', 'la', 'noche'],
  ['en', 'la', 'mañana'], ['en', 'la', 'tarde'], ['en', 'la', 'noche'],
];

/** Any exact reading, the non-target varieties included: "Vosotros habláis"
 *  must drop its pronoun just like "Ustedes hablan". */
const isFinite = (w: string) => analyzeToken(w).some((a) => a.accentExact && !a.clitics);

function finiteIndex(ts: readonly string[]): number {
  for (let i = 0; i < ts.length; i++) {
    const prev = ts[i - 1];
    if (prev && (DETERMINERS.has(prev) || PREPOSITIONS.has(prev)) && !/^(la|las|los|lo)$/.test(prev)) continue;
    if (/^(para|como|entre|sobre|nada|bajo)$/.test(ts[i])) continue;
    if (isFinite(ts[i])) return i;
  }
  return -1;
}

/** [start, end) of the verb group: no + clitics + finite verb + (a|de|que)? + infinitive/gerund/participle. */
function verbGroup(ts: readonly string[]): [number, number] | null {
  const v = finiteIndex(ts);
  if (v < 0) return null;
  let a = v;
  while (a > 0 && (CLITICS.has(ts[a - 1]) || ts[a - 1] === 'no')) a--;
  let b = v + 1;
  const haber = verbReadings(ts[v]).some((a) => a.inf === 'haber');
  const nonFinite = (w: string) => isInfinitive(w) || !!gerundOf(w) || !!splitEnclitic(w);
  for (let k = 0; k < 3 && b < ts.length; k++) {
    const w = ts[b];
    if (/^(a|de|que)$/.test(w) && b + 1 < ts.length && nonFinite(ts[b + 1])) { b += 2; continue; }
    if (nonFinite(w) || (haber && k === 0 && participleOf(w))) { b++; continue; }
    break;
  }
  return [a, b];
}

// ---- figures: digits and number words are one token -----------------------------

type Place = 'u' | 't' | 'd' | 'h' | 'm' | 'M';
/** Number words by place: units, teens and twenties, tens, hundreds, mil, millón. */
const NUMBER_WORDS: Readonly<Record<string, [Place, number]>> = {
  cero: ['u', 0], dos: ['u', 2], tres: ['u', 3], cuatro: ['u', 4], cinco: ['u', 5], seis: ['u', 6], siete: ['u', 7], ocho: ['u', 8], nueve: ['u', 9],
  diez: ['t', 10], once: ['t', 11], doce: ['t', 12], trece: ['t', 13], catorce: ['t', 14], quince: ['t', 15], dieciséis: ['t', 16], diecisiete: ['t', 17],
  dieciocho: ['t', 18], diecinueve: ['t', 19], veinte: ['t', 20], veintiuno: ['t', 21], veintiún: ['t', 21], veintiuna: ['t', 21], veintidós: ['t', 22],
  veintitrés: ['t', 23], veinticuatro: ['t', 24], veinticinco: ['t', 25], veintiséis: ['t', 26], veintisiete: ['t', 27], veintiocho: ['t', 28],
  veintinueve: ['t', 29],
  treinta: ['d', 30], cuarenta: ['d', 40], cincuenta: ['d', 50], sesenta: ['d', 60], setenta: ['d', 70], ochenta: ['d', 80], noventa: ['d', 90],
  cien: ['h', 100], ciento: ['h', 100], doscientos: ['h', 200], doscientas: ['h', 200], trescientos: ['h', 300], trescientas: ['h', 300],
  cuatrocientos: ['h', 400], cuatrocientas: ['h', 400], quinientos: ['h', 500], quinientas: ['h', 500], seiscientos: ['h', 600], seiscientas: ['h', 600],
  setecientos: ['h', 700], setecientas: ['h', 700], ochocientos: ['h', 800], ochocientas: ['h', 800], novecientos: ['h', 900], novecientas: ['h', 900],
  mil: ['m', 1000], millón: ['M', 1e6], millones: ['M', 1e6],
};
/** The number words an English keyboard types without their accent. */
const NUMBER_WORDS_PLAIN: Readonly<Record<string, string>> = {
  dieciseis: 'dieciséis', veintiun: 'veintiún', veintidos: 'veintidós', veintitres: 'veintitrés', veintiseis: 'veintiséis', millon: 'millón',
};
/** What may follow what inside one number: "dos mil veinte", "treinta y cinco". */
const NUMBER_NEXT: Readonly<Record<Place, string>> = { h: 'utdmM', d: 'mM', u: 'mM', t: 'mM', m: 'hutdM', M: 'hutdm' };
/** un / uno / una are a number only inside one: "treinta y un", "ciento una", "un millón". */
const ONE = /^(un|uno|una)$/;

/** The words and figures of a text, in order. A figure is ONE token, spelled
 *  in digits however it was written ("5", "cinco", "1.000", "mil" all agree),
 *  so a figure keeps its place ('el 70 % prefiere' is not 'el prefiere').
 *  `stops` lists the tokens a sentence ends on ("¿Debo hablar yo?\nNo me parece"). */
function figures(text: string): { toks: string[]; stops: Set<number>; slips: number; forms: Map<number, string> } {
  const raw: string[] = [];
  const rawStops = new Set<number>();
  /** Words that came from a % sign, which is no more a spelling than a digit is. */
  const fromSign = new Set<number>();
  const lower = text.toLowerCase();
  const found = [...lower.matchAll(/\d+(?:[.,]\d+)*(?:\s*%)?|[a-záéíóúñü]+/g)];
  found.forEach((m, k) => {
    if (/^\d/.test(m[0])) {
      const d = m[0].replace(/\s*%$/, '');
      raw.push(/^\d{1,3}([.,]\d{3})+$/.test(d) ? d.replace(/[.,]/g, '') : d.replace(',', '.'));
      if (m[0].endsWith('%')) { raw.push('por', 'ciento'); fromSign.add(raw.length - 1); }
    } else raw.push(m[0]);
    const gap = lower.slice(m.index! + m[0].length, found[k + 1]?.index ?? lower.length);
    if (/[.?!;:\n…¿¡]/.test(gap)) rawStops.add(raw.length - 1);
  });

  const toks: string[] = [];
  const stops = new Set<number>();
  const forms = new Map<number, string>();
  let slips = 0;
  for (let i = 0; i < raw.length;) {
    let total = 0, cur = 0, prev: Place | null = null, n = 0, viaY = false, inWords = true;
    const spelled: string[] = [];
    let j = i;
    for (; j < raw.length; j++) {
      if (j > i && rawStops.has(j - 1)) break;
      const w = raw[j];
      const plain = NUMBER_WORDS_PLAIN[w];
      const nw = NUMBER_WORDS[plain ?? w];
      if (/^\d/.test(w)) {
        if (prev) break;
        cur = Number(w); prev = 'u'; n++; inWords = false;
        // only a multiplier may follow a figure written in digits
        if (!/^(mil|mill[oó]n|millones)$/.test(raw[j + 1] ?? '')) { j++; break; }
        continue;
      }
      let place: Place, value: number;
      if (nw) [place, value] = nw;
      else if (ONE.test(w) && (prev ? 'hdmM'.includes(prev) : /^mill[oó]n$/.test(raw[j + 1] ?? ''))) { place = 'u'; value = 1; }
      else if (w === 'y' && prev === 'd' && !viaY && (NUMBER_WORDS[raw[j + 1]]?.[0] === 'u' || ONE.test(raw[j + 1] ?? ''))) { viaY = true; spelled.push(w); continue; }
      else break;
      if (prev && !(viaY ? place === 'u' : NUMBER_NEXT[prev].includes(place))) break;
      viaY = false;
      if (place === 'm') { total += (cur || 1) * 1000; cur = 0; }
      else if (place === 'M') { total = (total + cur || 1) * 1e6; cur = 0; }
      else cur += value;
      if (plain) slips++;
      if (fromSign.has(j)) inWords = false;
      spelled.push(plain ?? w);
      prev = place; n++;
    }
    const end = n ? j : i + 1;
    toks.push(n ? String(total + cur) : raw[i]);
    if (n && inWords) forms.set(toks.length - 1, spelled.join(' '));
    if (rawStops.has(end - 1)) stops.add(toks.length - 1);
    i = end;
  }
  return { toks, stops, slips, forms };
}

// ---- gustar and its kin: the person is the clitic -----------------------------

/** The persons a clitic names when the subject is that same person (me gusto, te quedas). */
const OWN_CLITIC: Readonly<Record<string, readonly Person[]>> = {
  me: ['yo'], te: ['tú'], nos: ['nosotros'], os: ['vosotros'], se: ['él/ella', 'ellos'],
};
/** Verbs where English makes the person the subject: "I like", "I love", "I care". */
const LIKE_VERBS = new Set(['gustar', 'encantar', 'fascinar', 'interesar', 'importar']);
/** What follows "a" in "a mí me gusta": the subject pronoun it stands for, and the clitic that doubles it. */
const A_PRONOUN: Readonly<Record<string, readonly [string, string]>> = {
  'mí': ['yo', 'me'], ti: ['tú', 'te'], 'él': ['él', 'le'], ella: ['ella', 'le'], usted: ['usted', 'le'],
  nosotros: ['nosotros', 'nos'], nosotras: ['nosotras', 'nos'], ellos: ['ellos', 'les'], ellas: ['ellas', 'les'], ustedes: ['ustedes', 'les'],
};
/** What may stand between the pronoun and the clitic: "yo también me gusta", "a mí tampoco me gusta". */
const BEFORE_CLITIC = (w: string) => /^(no|nunca|tampoco|sí)$/.test(w) || MOVABLE_ONE.has(w) || w.includes('_');

/** What follows ts[i] is [no, también...] clitic + a verb read as gustar and
 *  kin, in the same sentence: the clitic and those readings. */
function experiencerFrame(ts: readonly CanonTok[], i: number, stops: ReadonlySet<CanonTok>): { clitic: string; readings: Analysis[] } | null {
  let k = i + 1;
  if (stops.has(ts[i])) return null;
  while (ts[k] && BEFORE_CLITIC(ts[k].t)) { if (stops.has(ts[k])) return null; k++; }
  const clitic = ts[k]?.t, verb = ts[k + 1]?.t;
  if (!clitic || !verb || stops.has(ts[k]) || !(OWN_CLITIC[clitic] || /^(le|les)$/.test(clitic))) return null;
  const readings = verbReadings(verb).filter((a) => a.tense !== 'imperativo' && EXPERIENCER.has(a.inf.replace(/se$/, '')));
  return readings.length ? { clitic, readings } : null;
}

/** A verb of that person typed without its accent ("sabias", "comio"): a
 *  reading only if no accented form of any verb spells the token as typed.
 *  For él that is the -ía and -ió endings alone: "el jugo" (jugó) and "el
 *  centro" (centró) are nouns. */
function accentlessVerb(w: string, person: Person): boolean {
  if (person !== 'tú' && !/i[ao]$/.test(w)) return false;
  const rs = analyzeToken(w).filter((a) => a.target && !a.clitics);
  const fits = (a: Analysis) => a.person === person && (person === 'tú' ? !/subj|imperativo|impneg/.test(a.tense) : /^(imperfecto|condicional|preterito)$/.test(a.tense));
  return !rs.some((a) => a.accentExact) && rs.some(fits);
}

/** Canonicalise one Spanish answer. */
export function canon(text: string): Canon {
  const fig = figures(text);
  let ts = fig.toks;
  let accentSlips = fig.slips;

  // 1. multi-word adverbials become one token
  const joined: string[] = [];
  const joinedStops = new Set<number>();
  const joinedForms = new Map<number, string>();
  for (let i = 0; i < ts.length; i++) {
    const m = MOVABLE_MULTI.find((p) => p.every((w, k) => ts[i + k] === w));
    if (m && !(i > 0 && /^(de|desde|hasta|para)$/.test(ts[i - 1]))) { joined.push(m.join('_')); i += m.length - 1; } else joined.push(ts[i]);
    if (fig.stops.has(i)) joinedStops.add(joined.length - 1);
    const form = fig.forms.get(i);
    if (form) joinedForms.set(joined.length - 1, form);
  }
  ts = joined;

  // 2. climbing clitics move in front of the finite verb
  const out: CanonTok[] = ts.map((t, i) => (joinedForms.has(i) ? { t, form: joinedForms.get(i) } : { t }));
  /** The tokens a sentence ends on: gustar and kin do not reach across one. */
  const stops = new Set<CanonTok>(out.filter((_, i) => joinedStops.has(i)));
  for (let i = 0; i < out.length; i++) {
    const sp = splitEnclitic(out[i].t);
    if (!sp) continue;
    let j = i - 1;
    if (j >= 0 && /^(a|de|que)$/.test(out[j].t)) j--;
    if (j < 0) continue;
    const gov = verbReadings(out[j].t).filter((a) => CLIMBING.has(a.inf.replace(/se$/, '')));
    if (!gov.length) continue;
    // estar/seguir take a gerund, the rest an infinitive
    const takes = gov.some((a) => /^(estar|seguir)$/.test(a.inf)) ? 'ger' : 'inf';
    if (sp.kind !== takes) continue;
    const src = out[i].t;
    const was = out[i];
    out[i] = { t: sp.base, src };
    if (stops.has(was)) stops.add(out[i]);
    out.splice(j, 0, ...sp.clitics.map((c) => ({ t: c })));
    i += sp.clitics.length;
  }

  // 2b. "a mí me gusta": the pronoun in front of gustar and its kin is optional
  const pronouns: string[] = [];
  for (let i = 1; i + 1 < out.length; i++) {
    const to = A_PRONOUN[out[i].t];
    if (!to || out[i - 1].t !== 'a' || experiencerFrame(out, i, stops)?.clitic !== to[1]) continue;
    out.splice(i - 1, 2);
    pronouns.push(to[0]);
    i--;
  }

  // 3. subject pronouns come out (before or right after a finite verb)
  const experiencer: ExperiencerSlip[] = [];
  const kept: CanonTok[] = [];
  for (let i = 0; i < out.length; i++) {
    const w = out[i].t;
    const prev = out[i - 1]?.t, next = out[i + 1]?.t;
    let pron: string | null = null;
    if (SUBJECT_PRONOUNS[w] !== undefined) pron = w;
    let loose = false;
    // "el come", "tu hablas": the pronoun without its accent, before a verb that agrees
    // (or one that lost its own accent too: "tu sabias")
    if ((w === 'el' || w === 'tu') && next && !/^(trabajo|cocina|cena|camino|baile|estudio|casa|cuenta|cambio|programa|paso|pago|canta|llama|firma|ayuda|compra|cobra|prueba|muestra|debate|guía|cura|vino|cable|homenaje|cupo|dominó)$/.test(next)) {
      const person = w === 'el' ? 'él/ella' : 'tú';
      const exact = verbReadings(next).some((a) => a.person === person && !/subj|imperativo|impneg/.test(a.tense));
      // "Pagué el envio", "El envio llegó": a verb beside it leaves this one the noun, and el its article
      const noun = w === 'el' && ((!!prev && isFinite(prev)) || (!!out[i + 2] && isFinite(out[i + 2].t)));
      loose = !exact && !noun && accentlessVerb(next, person);
      if (exact || loose) {
        pron = w === 'el' ? 'él' : 'tú';
        accentSlips++;
      }
    }
    if (pron && !(prev && (PREPOSITIONS.has(prev) || /^(que|como|más|menos|y|o|ni)$/.test(prev)))) {
      const nextIsVerbish = next && (loose || isFinite(next) || CLITICS.has(next) || next === 'no' || MOVABLE_ONE.has(next) || next.includes('_'));
      const prevIsVerb = prev && isFinite(prev);
      if (nextIsVerbish || prevIsVerb) {
        pronouns.push(pron);
        const frame = prevIsVerb ? null : experiencerFrame(out, i, stops);
        if (frame) {
          const person = SUBJECT_PRONOUNS[pron];
          const agrees = frame.readings.some((a) => a.person === person);
          // me gusto, te quedas: the same person twice is the verb turned on itself, not a mistake
          if (!(agrees && OWN_CLITIC[frame.clitic]?.includes(person))) {
            experiencer.push({ pron, mismatch: !agrees, like: frame.readings.some((a) => LIKE_VERBS.has(a.inf.replace(/se$/, ''))) });
          }
        }
        continue;
      }
    }
    kept.push(out[i]);
  }

  // 4. movable adverbials come out, with their slot
  const advs: Canon['advs'] = [];
  const rest: CanonTok[] = [];
  for (let i = 0; i < kept.length; i++) {
    const k = kept[i];
    const prev = kept[i - 1]?.t;
    const movable = (MOVABLE_ONE.has(k.t) || k.t.includes('_')) && !(prev && (PREPOSITIONS.has(prev) || DETERMINERS.has(prev)));
    if (movable) advs.push({ t: k.t, slot: rest.length, legal: false });
    else rest.push(k);
  }
  const vg = verbGroup(rest.map((r) => r.t));
  const legal = new Set([0, rest.length]);
  if (vg) { legal.add(vg[0]); legal.add(vg[1]); }
  for (const a of advs) a.legal = legal.has(a.slot);
  return { toks: rest, pronouns, experiencer, advs, accentSlips };
}

export const key = (c: Canon) => c.toks.map((t) => t.t).join(' ');
export const keyDeaccent = (c: Canon) => deaccent(key(c));
export const advKey = (c: Canon) => c.advs.map((a) => a.t).sort().join(' ');

// ---- subject position in yes/no questions ------------------------------------------

/** Words that open a wh-question (alone or after a preposition: "¿De dónde…?", "¿Con quién…?"). */
const WH = new Set(['qué', 'quién', 'quiénes', 'dónde', 'adónde', 'cuándo', 'cómo', 'cuál', 'cuáles', 'cuánto', 'cuánta', 'cuántos', 'cuántas']);
/** Capitalised only because they open the question: never a subject. */
const NOT_SUBJECT = new Set([
  'aquí', 'allí', 'ahí', 'acá', 'allá', 'así', 'bien', 'mal', 'muy', 'más', 'menos', 'tampoco', 'nunca', 'entonces', 'pues', 'oye', 'mira',
  'sí', 'no', 'y', 'o', 'pero', 'que', 'si', 'cuando', 'como', 'todo', 'nada', 'algo', 'alguien', 'nadie',
]);
const cap1 = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/**
 * The other orders a yes/no question allows for its subject: before the verb
 * group, right after the finite verb, after the verb group, or at the end.
 * The subject is a name (or a run of names) or, before the verb, a short
 * determiner + noun phrase ("¿Tu hermano vive aquí?"). Subject pronouns are
 * already free (canon). Wh-questions get nothing: the verb stays before the
 * subject there. Returns rendered sentences, the input itself excluded.
 */
export function questionOrders(es: string): string[] {
  const all = toToks(es);
  const q = all.findIndex((t) => t.pre.includes('¿'));
  if (q < 0) return [];
  const e = all.findIndex((t, i) => i >= q && t.post.includes('?'));
  if (e < 0 || e - q < 1) return [];
  const seg = all.slice(q, e + 1);
  const lw = seg.map((t) => t.core.toLowerCase());
  if (WH.has(lw[0]) || (PREPOSITIONS.has(lw[0]) && WH.has(lw[1]))) return [];
  // inner punctuation (a vocative, a comma, quotes): leave the question alone
  if (seg.some((t, i) => (i > 0 && t.pre) || (i < seg.length - 1 && t.post))) return [];
  const capd = (i: number) => /^\p{Lu}/u.test(seg[i]?.core ?? '');
  const plain = (w: string) => !SUBJECT_PRONOUNS[w] && !DETERMINERS.has(w) && !PREPOSITIONS.has(w) && !CLITICS.has(w)
    && !NOT_SUBJECT.has(w) && !MOVABLE_ONE.has(w) && !WH.has(w);
  /** A name mid-question: capitalised where nothing forces a capital. */
  const nameMid = (i: number) => i > 0 && capd(i) && plain(lw[i]);
  const verbish = (i: number) => i < lw.length && (isFinite(lw[i]) || CLITICS.has(lw[i]) || lw[i] === 'no');

  let span: [number, number] | null = null;   // the subject, in seg
  let group: [number, number] | null = null;  // the verb group, in seg
  let finite = -1;
  // 1. a subject before the verb
  let s1 = -1;
  if (capd(0) && plain(lw[0]) && (!isFinite(lw[0]) || isFinite(lw[1] ?? ''))) {
    // "¿Simón habla…", "¿Vale está…" (two finite readings in a row: the first is a name)
    s1 = 1;
    while (s1 < 3 && nameMid(s1)) s1++;
  } else if (DETERMINERS.has(lw[0])) {
    // "¿Tu hermano vive aquí?": determiner + one or two words, then the verb
    for (let i = 2; i <= 3; i++) {
      if (verbish(i) && !verbish(i - 1)) { s1 = i; break; }
      if (PREPOSITIONS.has(lw[i - 1]) || isFinite(lw[i - 1] ?? '')) break;
    }
  }
  if (s1 > 0 && verbish(s1)) {
    const vg = verbGroup(lw.slice(s1));
    if (vg && vg[0] === 0) {
      span = [0, s1];
      group = [s1, s1 + vg[1]];
      finite = s1 + finiteIndex(lw.slice(s1));
    }
  }
  // 2. verb first, a name after it
  if (!span && verbish(0)) {
    const vg = verbGroup(lw);
    const v = finiteIndex(lw);
    const third = v >= 0 && verbReadings(lw[v]).some((a) => a.person === 'él/ella' || a.person === 'ellos');
    if (vg && vg[0] === 0 && third) {
      for (let k = vg[1]; k < lw.length; k++) {
        if (!nameMid(k) || PREPOSITIONS.has(lw[k - 1])) continue;
        let k2 = k + 1;
        while (k2 < lw.length && k2 - k < 3 && nameMid(k2)) k2++;
        span = [k, k2];
        group = vg;
        finite = v;
        break;
      }
    }
  }
  if (!span || !group || finite < 0) return [];

  // the question without its subject, and where the subject may go back in
  const isName = (i: number) => i >= span![0] && i < span![1] && (i > 0 || capd(0)) && !DETERMINERS.has(lw[i]);
  const bare: Tok[] = seg.map((t, i) => ({ pre: '', core: i === 0 && !isName(0) ? t.core.toLowerCase() : t.core, post: '' }));
  const subj = bare.slice(span[0], span[1]);
  const rest = bare.filter((_, i) => i < span![0] || i >= span![1]);
  const shift = (i: number) => (i >= span![1] ? i - (span![1] - span![0]) : i);
  // the verb group again without the subject in it: "¿Puede Simón venir?" -> puede venir
  const rl = rest.map((t) => t.core.toLowerCase());
  const rg = verbGroup(rl);
  const slots = new Set([0, shift(finite) + 1, rg ? rg[1] : shift(group[1] - 1) + 1, rest.length]);
  const here = span[0] === 0 ? 0 : shift(span[0]);
  const out: string[] = [];
  for (const at of slots) {
    if (at === here) continue;
    const ts = [...rest.slice(0, at), ...subj, ...rest.slice(at)].map((t) => ({ ...t }));
    if (q === 0 || /[.!?…]$/.test(all[q - 1].post)) ts[0].core = cap1(ts[0].core);
    ts[0].pre = seg[0].pre;
    ts[ts.length - 1].post = seg[seg.length - 1].post;
    const whole = [...all.slice(0, q), ...ts, ...all.slice(e + 1)];
    out.push(whole.map((t) => t.pre + t.core + t.post).join(' '));
  }
  return out;
}
