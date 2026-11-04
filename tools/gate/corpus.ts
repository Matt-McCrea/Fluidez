// Corpus-wide checks: near-duplicates and template-frame overuse (ported from app/tools/gate/corpus.ts).
import { deaccent } from '../../lib/engine';
import { clip, type Finding } from './findings';

export const DUP_ERROR = 0.6;
const CAP = 200;
const MIN_TOKENS = 5;

export const normTokens = (s: string) => deaccent(s.toLowerCase()).replace(/[^a-zñü0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
export function shingles(toks: string[], n = 4): Set<string> {
  const out = new Set<string>();
  if (toks.length < n) { out.add(toks.join(' ')); return out; }
  for (let i = 0; i + n <= toks.length; i++) out.add(toks.slice(i, i + n).join(' '));
  return out;
}
export function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

export interface DupItem { file: string; path: string; text: string }

/** Near-duplicate passages: token 4-gram Jaccard above the threshold. Shingles shared by more than CAP items are not evidence. */
export function nearDuplicates(items: readonly DupItem[], check = 'dupe', threshold = DUP_ERROR): Finding[] {
  const out: Finding[] = [];
  const sh = items.map((it) => { const t = normTokens(it.text); return t.length >= MIN_TOKENS ? shingles(t) : new Set<string>(); });
  const index = new Map<string, number[]>();
  sh.forEach((s, i) => { for (const g of s) { const l = index.get(g); if (l) l.push(i); else index.set(g, [i]); } });
  for (let i = 0; i < items.length; i++) {
    const cands = new Set<number>();
    for (const g of sh[i]) { const l = index.get(g)!; if (l.length > CAP) continue; for (const j of l) if (j > i) cands.add(j); }
    for (const j of cands) {
      const J = jaccard(sh[i], sh[j]);
      if (J <= threshold) continue;
      out.push({ severity: 'error', check, file: items[j].file, path: items[j].path, problem: `near-duplicate (${J.toFixed(2)}) of ${items[i].path}: "${clip(items[j].text, 45)}" ~ "${clip(items[i].text, 45)}"`, fix: 'change the situation and the sentence frame, not one word' });
    }
  }
  return out;
}

/** Exact duplicates by normalised text (3+ tokens). */
export function exactDuplicates(items: Iterable<DupItem>, check = 'dupe'): Finding[] {
  const seen = new Map<string, DupItem>();
  const out: Finding[] = [];
  for (const it of items) {
    const toks = normTokens(it.text);
    if (toks.length < 3) continue;
    const k = toks.join(' ');
    const first = seen.get(k);
    if (first) out.push({ severity: 'error', check, file: it.file, path: it.path, problem: `exact duplicate of ${first.path} "${clip(it.text, 50)}"`, fix: 'write a new item; every cue must be new to the learner' });
    else seen.set(k, it);
  }
  return out;
}

export const FRAMES: Array<[string, RegExp]> = [
  ['antes de', /\bantes de\b/], ['al principio', /\bal principio\b/], ['dudaba(n) que', /\bdudaba[n]? que\b/],
  ['espera(n) que', /\bespera[n]? que\b/], ['es ADJ que', /\bes (increible|maravilloso|evidente|una pena|normal|logico|natural|curioso|sorprendente|fantastico|estupendo|raro|triste|importante|necesario|posible) que\b/],
  ['para cuando', /\bpara cuando\b/], ['desde que', /\bdesde que\b/], ['lo que mas', /\blo que mas\b/], ['cada vez que', /\bcada vez que\b/],
  ['me gusta(n)', /\bme gustan?\b/], ['mi hermano/a', /\bmi herman[oa]\b/], ['todos los dias', /\btodos los dias\b/],
  ['de repente', /\bde repente\b/], ['por eso', /\bpor eso\b/], ['sin embargo', /\bsin embargo\b/], ['tengo que', /\btengo que\b/],
  ['voy a', /\bvoy a\b/], ['quiero que', /\bquiero que\b/], ['ojala', /\bojala\b/], ['si tuviera', /\bsi tuviera\b/],
];
export const FRAME_SHARE = 0.25;
export const MIN_GROUP_ITEMS = 12;

/** Frames and two-word openers used by more than a quarter of one group's items (a level of passages, a level of Apply items). */
export function frameOveruse(group: string, file: string, texts: readonly string[], severity: 'error' | 'warning' = 'warning'): Finding[] {
  const out: Finding[] = [];
  if (texts.length < MIN_GROUP_ITEMS) return out;
  const toks = texts.map(normTokens);
  const joined = toks.map((t) => t.join(' '));
  for (const [name, re] of FRAMES) {
    const n = joined.filter((t) => re.test(t)).length;
    if (n / texts.length > FRAME_SHARE) out.push({ severity, check: 'frames', file, path: group, problem: `${group}: frame "${name}" in ${n}/${texts.length} items (>${FRAME_SHARE * 100}%)`, fix: 'vary the sentence architecture, not just the nouns' });
  }
  const openers = new Map<string, number>();
  for (const t of toks) if (t.length >= 3) { const k = t.slice(0, 2).join(' '); openers.set(k, (openers.get(k) ?? 0) + 1); }
  for (const [k, n] of openers) if (n / texts.length > FRAME_SHARE) out.push({ severity, check: 'frames', file, path: group, problem: `${group}: ${n}/${texts.length} items open with "${k} …"`, fix: 'vary how items start' });
  return out;
}
