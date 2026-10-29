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
 * NOT FREE: everything else, accents included (an accent-only difference
 * is reported as `near`, not as a pass).
 * ========================================================================== */
import { analyzeToken, deaccent } from '../../engine';
import { CLIMBING } from '../../exercises/reinflect';
import {
  CLITICS, DETERMINERS, PREPOSITIONS, SUBJECT_PRONOUNS, gerundOf, isInfinitive, participleOf, splitEnclitic, verbReadings, words,
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
