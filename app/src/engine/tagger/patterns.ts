/* ============================================================================
 * PATTERN SPECS — how a pattern node's `match` strings find its construction.
 *
 * A pattern is a construction, not a sentence: p:siento-llegar-tarde is
 * "sentir + infinitive" (Siento llamar tan tarde, Siento no saber tu nombre),
 * not the words "siento llegar tarde". A `match` string is a small spec,
 * matched token by token against the tagged words of one clause:
 *
 *   razón          a word, accents and case ignored (but sí ≠ si, él ≠ el,
 *                  más ≠ mas … : a diacritic pair written with its accent
 *                  matches only that word)
 *   {tener}        any form of the lemma (tengo, tuvo, tener, teniendo);
 *                  works for nouns/adjectives too ({bueno}: buena, buenos)
 *   {quedar:pret}  …in one tense: pres pret imp fut cond subj (any
 *                  subjunctive) presubj impsubj cmd inf ger part fin (finite)
 *   {inf} {ger} {part}  an infinitive (llegar, vernos), gerund, participle
 *   {verb}         a finite verb; {subj} a subjunctive one; {cmd} a command
 *   {num}          a number word or digits (siete, 25, veintitrés)
 *   {noun} {adj} {adv} {name} {pron} {det} {poss} {dem} {prep} {cl} (clitic)
 *   {np}           a short noun phrase: [det|poss|dem|num|quant]{0,2} then 1–3
 *                  nouns/adjectives/names, or a strong pronoun (él, usted)
 *   {day} {month}  a weekday, a month name
 *   {*}            any one word; {...} 0–3 words; {...5} 0–5 words
 *   (a|b c|{inf})  alternatives (each a sequence); `?` after a token or
 *                  group makes it optional: (el|la|las|los)? {np}?
 *   ^  $           the clause starts / ends here
 *   ,              a comma (otherwise punctuation ends the match)
 *   !x             zero-width: the next word is not x ({quedar} en !{inf} — a place)
 *
 *   p:siento-llegar-tarde  "{sentir} no? {inf}", "(perdón|disculpa|disculpe) por {np}"
 *   p:desde-hasta          "desde {...} hasta"
 *   p:quedar-en            "{quedar} en {inf}", "{quedar} en que", "en qué {quedar}"
 *                          — "queda en el centro" (a place) is none of these.
 *
 * Opening marks (¿ ¡ « " —) are transparent; any other punctuation ends a
 * match unless the spec has "," there. A string with none of the spec
 * syntax ({ } ( ) | ? ^ $) is a LEGACY literal: words in order, a
 * capitalised word, a digit or a quoted word is a slot, and a word also
 * matches a token whose lemma it is (kept for the old match strings).
 *
 * Speed: every spec lists the words/lemmas it cannot match without; a
 * pattern is tried on a sentence only when all of them are in it.
 * ========================================================================== */
import { deaccent } from '../ortho';
import type { Word } from './types';

const fold = (s: string) => deaccent(s.toLowerCase()).replace(/ñ/g, 'n');
/** Words told apart only by their accent. */
const TILDE = new Set(['él', 'tú', 'mí', 'sí', 'sé', 'té', 'dé', 'más', 'qué', 'cómo', 'dónde', 'cuándo', 'quién', 'quiénes', 'cuánto', 'cuánta', 'cuántos', 'cuántas', 'cuál', 'cuáles', 'aún', 'sólo']);
const TILDE_FOLD = new Set([...TILDE].map(fold));
const bare = (l: string) => (/[aei]rse$/.test(l) || l === 'irse' ? l.slice(0, -2) : l);

type Tok =
  | { t: 'lit'; v: string; exact?: string }            // folded word; exact: accent-exact lowercase when a diacritic pair
  | { t: 'lemma'; v: string; tense?: string }
  | { t: 'cls'; v: string }
  | { t: 'gap'; max: number }
  | { t: 'comma' }
  | { t: 'start' } | { t: 'end' }
  | { t: 'grp'; alts: Seq[] };
type Item = Tok & { opt?: boolean; neg?: boolean };
type Seq = Item[];

const CLASSES = new Set(['inf', 'ger', 'part', 'verb', 'subj', 'cmd', 'num', 'noun', 'adj', 'adv', 'name', 'pron', 'det', 'poss', 'dem', 'prep', 'cl', 'np', '*', 'quant', 'int', 'conj', 'day', 'month']);
const DAYS = new Set('lunes martes miercoles jueves viernes sabado domingo'.split(' '));
const MONTHS = new Set('enero febrero marzo abril mayo junio julio agosto septiembre setiembre octubre noviembre diciembre'.split(' '));
const TENSES: Record<string, (w: Word) => boolean> = {
  pres: (w) => w.pos === 'verb' && w.tense === 'presente',
  pret: (w) => w.pos === 'verb' && w.tense === 'preterito',
  imp: (w) => w.pos === 'verb' && w.tense === 'imperfecto',
  fut: (w) => w.pos === 'verb' && w.tense === 'futuro',
  cond: (w) => w.pos === 'verb' && w.tense === 'condicional',
  subj: (w) => w.pos === 'verb' && /subj/.test(w.tense ?? ''),
  presubj: (w) => w.pos === 'verb' && w.tense === 'presubj',
  impsubj: (w) => w.pos === 'verb' && /^impsubj/.test(w.tense ?? ''),
  cmd: (w) => w.pos === 'verb' && w.tense === 'cmd',
  fin: (w) => w.pos === 'verb',
  inf: (w) => w.pos === 'inf',
  ger: (w) => w.pos === 'ger',
  part: (w) => w.pos === 'part',
};

/** Does this match string use the spec syntax (else it is a legacy literal)? */
export const isSpec = (m: string) => /[{}()|?^$,]|![{(A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(m);

export class SpecError extends Error {}

/** Parse one spec string. Throws SpecError on bad syntax. */
export function parseSpec(src: string): Seq {
  const toks = src.match(/!?\{[^}]*\}\??|!?\(|\)\??|\||\^|\$|,|!?[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+\??|!?\d+\??/g) ?? [];
  const rest = src.replace(/!?\{[^}]*\}\??|!?\(|\)\??|\||\^|\$|,|!?[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+\??|!?\d+\??/g, '').replace(/\s/g, '');
  if (rest) throw new SpecError(`spec "${src}": unexpected "${rest}"`);
  let k = 0;
  const seq = (depth: number): Seq[] => {
    const alts: Seq[] = [[]];
    while (k < toks.length) {
      let raw = toks[k++];
      const neg = raw[0] === '!';
      if (neg) raw = raw.slice(1);
      if (raw === '|') { alts.push([]); continue; }
      if (raw === ')' || raw === ')?') {
        if (!depth) throw new SpecError(`spec "${src}": unbalanced ")"`);
        k--; return alts;
      }
      const cur = alts[alts.length - 1];
      if (raw === '(') {
        const inner = seq(depth + 1);
        const close = toks[k++];
        if (close !== ')' && close !== ')?') throw new SpecError(`spec "${src}": unclosed "("`);
        cur.push({ t: 'grp', alts: inner, ...(close === ')?' ? { opt: true } : {}), ...(neg ? { neg: true } : {}) });
        continue;
      }
      if (raw === '^') { cur.push({ t: 'start' }); continue; }
      if (raw === '$') { cur.push({ t: 'end' }); continue; }
      if (raw === ',') { cur.push({ t: 'comma' }); continue; }
      const opt = raw.endsWith('?');
      const body = opt ? raw.slice(0, -1) : raw;
      if (body[0] === '{') {
        const inner = body.slice(1, -1).trim();
        let it: Item;
        const gap = inner.match(/^\.\.\.(\d*)$/) || inner.match(/^…(\d*)$/);
        if (gap) it = { t: 'gap', max: gap[1] ? +gap[1] : 3 };
        else if (CLASSES.has(inner)) it = { t: 'cls', v: inner };
        else {
          const [l, tense] = inner.split(':');
          if (!/^[a-záéíóúüñ]+$/.test(l)) throw new SpecError(`spec "${src}": bad token {${inner}}`);
          if (tense && !TENSES[tense]) throw new SpecError(`spec "${src}": unknown tense "${tense}" in {${inner}}`);
          it = { t: 'lemma', v: fold(bare(l)), ...(tense ? { tense } : {}) };
        }
        if (opt) it.opt = true;
        if (neg) it.neg = true;
        cur.push(it);
        continue;
      }
      const lw = body.toLowerCase();
      const it: Item = { t: 'lit', v: fold(lw), ...(TILDE.has(lw) || TILDE_FOLD.has(lw) ? { exact: lw } : {}) };
      if (opt) it.opt = true;
      if (neg) it.neg = true;
      cur.push(it);
    }
    return alts;
  };
  const alts = seq(0);
  if (k < toks.length) throw new SpecError(`spec "${src}": unbalanced ")"`);
  const top: Seq = alts.length === 1 ? alts[0] : [{ t: 'grp', alts }];
  if (!top.some((x) => !x.opt && !x.neg && x.t !== 'start' && x.t !== 'end' && x.t !== 'comma' && x.t !== 'gap')) throw new SpecError(`spec "${src}": matches nothing`);
  return top;
}

/** Words / lemmas a sequence cannot match without (for the cheap pre-filter). Each entry: any of. */
function anchors(seq: Seq): string[][] {
  const out: string[][] = [];
  for (const it of seq) {
    if (it.opt || it.neg) continue;
    if (it.t === 'lit') out.push(['w:' + it.v]);
    else if (it.t === 'lemma') out.push(['l:' + it.v]);
    else if (it.t === 'grp') {
      // a group anchors on the union of each alternative's first anchor, if every alternative has one
      const firsts = it.alts.map((a) => anchors(a)[0]);
      if (firsts.every(Boolean)) out.push([...new Set(firsts.flat())]);
    }
  }
  return out;
}

export interface CompiledSpec { seq: Seq; need: string[][] }
export function compileSpec(src: string): CompiledSpec {
  const seq = parseSpec(src);
  return { seq, need: anchors(seq) };
}

/* ---- matching ----------------------------------------------------------------- */
const TRANSPARENT = new Set(['¿', '¡', '«', '»', '"', '“', '”', '—', '–', '-', '(', ')']);
const NP_PRE = new Set(['det', 'poss', 'dem', 'num', 'quant']);
const NP_HEAD = new Set(['noun', 'adj', 'x', 'propn', 'num', 'part', 'unknown']);
const STRONG_PRON = new Set(['él', 'ella', 'ellos', 'ellas', 'usted', 'ustedes', 'yo', 'tú', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'mí', 'ti', 'esto', 'eso', 'aquello', 'algo', 'nada', 'alguien', 'nadie', 'todo']);

/** The sentence as the matcher sees it: words and blocking punctuation (openers dropped). */
export type MToks = Array<Word & { f: string; fl: string }>;
export function matchTokens(words: Word[]): MToks {
  const out: MToks = [];
  for (const w of words) {
    if (w.punct && TRANSPARENT.has(w.w)) continue;
    out.push({ ...w, f: fold(w.w), fl: fold(bare(w.lemma || w.w)) });
  }
  return out;
}
/** The anchor keys a sentence has (its folded words and lemmas). */
export function sentenceKeys(ms: MToks): Set<string> {
  const s = new Set<string>();
  for (const w of ms) if (!w.punct) { s.add('w:' + w.f); s.add('l:' + w.fl); s.add('l:' + fold(w.w)); }
  return s;
}
export function hasAnchors(spec: CompiledSpec, keys: Set<string>): boolean {
  return spec.need.every((any) => any.some((k) => keys.has(k)));
}

function isNum(w: Word): boolean { return w.pos === 'num' || /^\d/.test(w.w); }
function clsMatch(c: string, w: Word): boolean {
  switch (c) {
    case '*': return true;
    case 'inf': return w.pos === 'inf';
    case 'ger': return w.pos === 'ger';
    case 'part': return w.pos === 'part';
    case 'verb': return w.pos === 'verb';
    case 'subj': return w.pos === 'verb' && /subj/.test(w.tense ?? '');
    case 'cmd': return w.pos === 'verb' && w.tense === 'cmd';
    case 'num': return isNum(w);
    case 'noun': return w.pos === 'noun' || w.pos === 'x';
    case 'adj': return w.pos === 'adj' || w.pos === 'part' || w.pos === 'x';
    case 'adv': return w.pos === 'adv';
    case 'name': return w.pos === 'propn';
    case 'pron': return w.pos === 'pron';
    case 'det': return w.pos === 'det';
    case 'poss': return w.pos === 'poss';
    case 'dem': return w.pos === 'dem';
    case 'prep': return w.pos === 'prep';
    case 'cl': return w.pos === 'clitic';
    case 'quant': return w.pos === 'quant';
    case 'int': return w.pos === 'int';
    case 'conj': return w.pos === 'conj';
    case 'day': return DAYS.has(fold(w.w));
    case 'month': return MONTHS.has(fold(w.w));
    default: return false;
  }
}

/** All end positions of `it` matched at k (one token, a run, or nothing for an optional). */
function stepEnds(ms: MToks, it: Item, k: number): number[] {
  // !x: zero-width, the next word is not x (or there is none)
  if (it.neg) return stepEnds(ms, { ...it, neg: false, opt: false }, k).some((e) => e > k) ? [] : [k];
  const ends: number[] = [];
  if (it.opt) ends.push(k);
  const w = ms[k];
  switch (it.t) {
    case 'start': return (k === 0 || ms[k - 1].punct) ? [k] : [];
    case 'end': return (k >= ms.length || ms[k].punct) ? [k] : [];
    case 'comma': if (w && w.punct && w.w === ',') ends.push(k + 1); return ends;
    case 'gap': { ends.push(k); for (let j = k; j < ms.length && j - k < it.max && !ms[j].punct; j++) ends.push(j + 1); return ends; }
    case 'grp': { for (const alt of it.alts) for (const e of seqEnds(ms, alt, 0, k)) ends.push(e); return ends; }
    default: break;
  }
  if (!w || w.punct) return ends;
  if (it.t === 'lit') { if (w.f === it.v && (!it.exact || w.w === it.exact || (!TILDE.has(w.w) && !TILDE.has(it.exact)))) ends.push(k + 1); return ends; }
  if (it.t === 'lemma') {
    if ((w.fl === it.v || (w.pos !== 'verb' && w.pos !== 'inf' && w.pos !== 'ger' && w.pos !== 'part' && w.f === it.v)) && (!it.tense || TENSES[it.tense](w))) ends.push(k + 1);
    return ends;
  }
  // classes
  if (it.v === 'np') {
    if (w.pos === 'pron' && STRONG_PRON.has(w.w)) ends.push(k + 1);
    if (w.pos === 'propn') { let j = k; while (j < ms.length && !ms[j].punct && ms[j].pos === 'propn') j++; ends.push(j); }
    // [det|poss|dem|num|quant]{0,2} then 1–3 heads ("las ocho": a number after a determiner is the head)
    for (let pre = 0; pre <= 2; pre++) {
      if (pre > 0 && (k + pre - 1 >= ms.length || ms[k + pre - 1].punct || !NP_PRE.has(ms[k + pre - 1].pos))) break;
      let j = k + pre, n = 0;
      while (j < ms.length && !ms[j].punct && NP_HEAD.has(ms[j].pos) && n < 3) { j++; n++; ends.push(j); }
    }
    return [...new Set(ends)];
  }
  if (clsMatch(it.v, w)) ends.push(k + 1);
  return ends;
}
/** End positions of seq[m..] starting at k. */
function seqEnds(ms: MToks, seq: Seq, m: number, k: number): number[] {
  if (m === seq.length) return [k];
  const out: number[] = [];
  for (const e of stepEnds(ms, seq[m], k)) for (const r of seqEnds(ms, seq, m + 1, e)) out.push(r);
  return out;
}
/** First match of a spec in the sentence: [start, end) in ms, or null. */
export function findSpec(ms: MToks, spec: CompiledSpec): [number, number] | null {
  for (let k = 0; k < ms.length; k++) {
    const ends = seqEnds(ms, spec.seq, 0, k).filter((e) => e > k);
    if (ends.length) {
      // the span: from the first word to the furthest end, trimming punctuation and empty slots
      let a = k; while (a < ms.length && ms[a].punct) a++;
      let b = Math.max(...ends) - 1; while (b > a && ms[b].punct) b--;
      if (a <= b) return [a, b];
    }
  }
  return null;
}
