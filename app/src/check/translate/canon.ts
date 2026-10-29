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
 *  - the subject of a yes/no question (questionOrders, used by match.ts as
 *    accepted variants): "¿Simón habla inglés?" = "¿Habla Simón inglés?" =
 *    "¿Habla inglés Simón?". After a question word the verb comes first:
 *    "¿Qué quiere Vale?", never "¿Qué Vale quiere?".
 * NOT FREE: everything else, accents included (an accent-only difference
 * is reported as `near`, not as a pass).
 * ========================================================================== */
import { analyzeToken, deaccent } from '../../engine';
import { CLIMBING } from '../../exercises/reinflect';
import {
  CLITICS, DETERMINERS, PREPOSITIONS, SUBJECT_PRONOUNS, gerundOf, isInfinitive, participleOf, splitEnclitic, toToks, verbReadings, words,
  type Tok,
} from '../../exercises/spanish';

export interface CanonTok {
  /** The comparison key. */
  t: string;
  /** The original spelling when the token was rewritten (an enclitic form). */
  src?: string;
}

export interface Canon {
  toks: CanonTok[];
  /** Subject pronouns removed, as written (accents kept). */
  pronouns: string[];
  /** Movable adverbials removed, with the slot each sat in. */
  advs: Array<{ t: string; slot: number; legal: boolean }>;
  /** Accent slips found while canonicalising ("el come" for "él come"). */
  accentSlips: number;
}

const MOVABLE_ONE = new Set(['ya', 'también', 'siempre', 'hoy', 'ayer', 'mañana', 'anoche', 'ahora', 'todavía', 'normalmente', 'generalmente', 'luego']);
const MOVABLE_MULTI: readonly string[][] = [
  ['a', 'veces'], ['todos', 'los', 'días'], ['todas', 'las', 'semanas'], ['esta', 'noche'], ['esta', 'mañana'], ['esta', 'tarde'],
  ['el', 'fin', 'de', 'semana'], ['la', 'semana', 'pasada'], ['el', 'año', 'pasado'], ['por', 'la', 'mañana'], ['por', 'la', 'tarde'], ['por', 'la', 'noche'],
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

/** Canonicalise one Spanish answer. */
export function canon(text: string): Canon {
  let ts = words(text);
  let accentSlips = 0;

  // 1. multi-word adverbials become one token
  const joined: string[] = [];
  for (let i = 0; i < ts.length; i++) {
    const m = MOVABLE_MULTI.find((p) => p.every((w, k) => ts[i + k] === w));
    if (m && !(i > 0 && /^(de|desde|hasta|para)$/.test(ts[i - 1]))) { joined.push(m.join('_')); i += m.length - 1; } else joined.push(ts[i]);
  }
  ts = joined;

  // 2. climbing clitics move in front of the finite verb
  const out: CanonTok[] = ts.map((t) => ({ t }));
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
    out[i] = { t: sp.base, src };
    out.splice(j, 0, ...sp.clitics.map((c) => ({ t: c })));
    i += sp.clitics.length;
  }

  // 3. subject pronouns come out (before or right after a finite verb)
  const pronouns: string[] = [];
  const kept: CanonTok[] = [];
  for (let i = 0; i < out.length; i++) {
    const w = out[i].t;
    const prev = out[i - 1]?.t, next = out[i + 1]?.t;
    let pron: string | null = null;
    if (SUBJECT_PRONOUNS[w] !== undefined) pron = w;
    // "el come", "tu hablas": the pronoun without its accent, before a verb that agrees
    else if ((w === 'el' || w === 'tu') && next && verbReadings(next).some((a) => a.person === (w === 'el' ? 'él/ella' : 'tú')) && !/^(trabajo|cocina|cena|camino|baile|estudio)$/.test(next)) {
      pron = w === 'el' ? 'él' : 'tú';
      accentSlips++;
    }
    if (pron && !(prev && (PREPOSITIONS.has(prev) || /^(que|como|más|menos|y|o|ni)$/.test(prev)))) {
      const nextIsVerbish = next && (isFinite(next) || CLITICS.has(next) || next === 'no' || MOVABLE_ONE.has(next) || next.includes('_'));
      const prevIsVerb = prev && isFinite(prev);
      if (nextIsVerbish || prevIsVerb) { pronouns.push(pron); continue; }
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
  return { toks: rest, pronouns, advs, accentSlips };
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
