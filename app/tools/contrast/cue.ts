// The ways a learner can pass a contrast deck without the contrast: a cue table (the words beside the gap
// decide it) and always the commoner answer. Each is scored as the expected share right on the item it is
// held out from, trained on the rest of its deck (leave one out), at the base rates the deck has.
import type { ContrastItem } from '../../src/content/schema';

const flat = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const words = (t: string) => flat(t).match(/[\p{L}\p{N}]+/gu) ?? [];

/** The words beside the gap: the one before it and the one after it. */
export function cueOf(it: Pick<ContrastItem, 'es' | 'gap'>): { before: string; after: string } {
  return { before: words(it.es.slice(0, it.gap[0])).pop() ?? '^', after: words(it.es.slice(it.gap[1]))[0] ?? '$' };
}

type Count = Map<string, number>;
const bump = (m: Map<string, Count>, k: string, answer: string) => {
  const c = m.get(k) ?? new Map<string, number>();
  c.set(answer, (c.get(answer) ?? 0) + 1);
  m.set(k, c);
};
const answerOf = (it: ContrastItem) => it.options[it.answer].toLowerCase();
/** The sentence with its gap left blank: a twin (the same sentence the other way) has the same frame. */
const frameOf = (it: Pick<ContrastItem, 'es' | 'gap'>) => `${it.es.slice(0, it.gap[0])}___${it.es.slice(it.gap[1])}`.toLowerCase();
/** The options as a set: which two words the item sets against each other. */
const setOf = (it: ContrastItem) => [...it.options].map((o) => o.toLowerCase()).sort().join('|');

/** The share of `pick` (the options a strategy would tap, uniformly) that is the answer. */
const share = (tap: string[], it: ContrastItem) => (tap.includes(answerOf(it)) ? 1 / tap.length : 0);

/** Of the options, those with the highest count in `c` (all of them when none has been seen). */
function best(options: string[], c: Count | undefined): string[] {
  const n = options.map((o) => c?.get(o) ?? 0);
  const top = Math.max(...n);
  return top > 0 ? options.filter((_, i) => n[i] === top) : options;
}

export interface Scores {
  n: number;
  cue: number;
  commoner: number;
  /** the share of each item a strategy gets right, in the deck's order: the items a cue table passes are the ones to look at */
  byItem: { cue: number[]; commoner: number[] };
}

/** What the Cue Test allows (audit R10): a cue table at most 65%, always the commoner answer at most 55%. */
export const CUE_LIMIT = 0.65;
export const COMMONER_LIMIT = 0.55;

/**
 * The cue table is held out one item at a time, with its twins: it keys on the pair of words beside the gap, then on each word
 * alone, then falls back on the commoner answer of the pair of options. "Always the commoner answer" is the base
 * rate of the deck itself (the word that is the answer most often for that pair of options), which leaving an item
 * out would turn against a balanced deck.
 */
export function score(deck: ContrastItem[]): Scores {
  let cue = 0, commoner = 0;
  const byItem = { cue: [] as number[], commoner: [] as number[] };
  const rate = new Map<string, Count>();
  for (const r of deck) bump(rate, setOf(r), answerOf(r));
  // a pair asked once has no word to lean on, and counting its one answer would hand the item its own answer: there the strategy is
  // the commoner side of the contrast ("always the perfect"), which is all a learner could lean on in a deck where the words change
  const sides = new Map<string, number>();
  for (const r of deck) sides.set(r.side, (sides.get(r.side) ?? 0) + 1);
  const topSide = [...sides].reduce<[string, number]>((a, b) => (b[1] > a[1] ? b : a), ['', 0])[0];
  const leanOn = (it: ContrastItem): string[] => {
    const seen = rate.get(setOf(it))!;
    if ([...seen.values()].reduce((a, b) => a + b, 0) > 1) return best(it.options.map((o) => o.toLowerCase()), seen);
    const answer = answerOf(it);
    return it.side === topSide ? [answer] : it.options.map((o) => o.toLowerCase()).filter((o) => o !== answer);
  };
  deck.forEach((it, i) => {
    // a twin of the item (the same frame, the other word) is left out too: it holds the same cue with the other answer, which would
    // turn the table against itself and say nothing about whether the cue decides
    const rest = deck.filter((r, j) => j !== i && frameOf(r) !== frameOf(it));
    const both = new Map<string, Count>(), before = new Map<string, Count>(), after = new Map<string, Count>();
    for (const r of rest) {
      const c = cueOf(r);
      bump(both, `${c.before}|${c.after}`, answerOf(r));
      bump(before, c.before, answerOf(r));
      bump(after, c.after, answerOf(r));
    }
    const options = it.options.map((o) => o.toLowerCase());
    const c = cueOf(it);
    const beside = [both.get(`${c.before}|${c.after}`), before.get(c.before), after.get(c.after)].reduce<string[]>(
      (found, counts) => (found.length < options.length ? found : best(options, counts)), options);
    const lean = leanOn(it);
    const tap = beside.length < options.length ? beside : lean;
    const a = share(tap, it), b = share(lean, it);
    byItem.cue.push(a); byItem.commoner.push(b);
    cue += a; commoner += b;
  });
  return { n: deck.length, cue: cue / Math.max(1, deck.length), commoner: commoner / Math.max(1, deck.length), byItem };
}

/**
 * Where a deck of choices leans: each pair of options asked more than once, how often it is asked and how often its commoner answer is the
 * right one. `score` holds a deck to the Cue Test as a whole; this is the plain count, pair by pair, for any deck a learner taps through:
 * a pair whose answer never changes is passed by tapping that word.
 */
export function leaning(deck: ContrastItem[]): Array<{ pair: string; n: number; top: number }> {
  const pairs = new Map<string, Count>();
  for (const r of deck) bump(pairs, setOf(r), answerOf(r));
  return [...pairs].map(([pair, c]) => ({ pair, n: [...c.values()].reduce((a, b) => a + b, 0), top: Math.max(...c.values()) })).filter((p) => p.n > 1);
}

/** Scores pooled over decks, each scored within itself and weighted by its items. */
export function pooled(decks: ContrastItem[][]): Omit<Scores, 'byItem'> {
  const all = decks.map(score);
  const n = all.reduce((a, s) => a + s.n, 0);
  return { n, cue: all.reduce((a, s) => a + s.cue * s.n, 0) / Math.max(1, n), commoner: all.reduce((a, s) => a + s.commoner * s.n, 0) / Math.max(1, n) };
}
