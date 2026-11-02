// The ways a learner can pass a choice card without the Spanish: tap the longest option, tap the first, tap
// the option that has the name in the prompt, tap the one option that stands out. Each is scored as the
// expected share right (a tie among k options is 1/k), so the result needs no coin to flip.
import type { McqCard } from '../../src/ui/session/cards';

const letters = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** The share of a card a strategy gets right, given the options it would tap (uniformly). */
const share = (tapped: number[], answer: number) => (tapped.includes(answer) ? 1 / tapped.length : 0);
const argbest = (xs: number[], better: (a: number, b: number) => boolean) => {
  const best = xs.reduce((m, x) => (better(x, m) ? x : m));
  return xs.flatMap((x, i) => (x === best ? [i] : []));
};

export const longest = (c: McqCard) => share(argbest(c.options.map((o) => o.text.length), (a, b) => a > b), c.answer);
export const shortest = (c: McqCard) => share(argbest(c.options.map((o) => o.text.length), (a, b) => a < b), c.answer);
export const first = (c: McqCard) => (c.answer === 0 ? 1 : 0);
export const chance = (c: McqCard) => 1 / c.options.length;

/** What a learner sees as a name: a word with a capital that is not starting a sentence, or one the bank knows as a name. Without accents. */
export function namesIn(text: string, names: ReadonlySet<string>): Set<string> {
  const out = new Set<string>();
  for (const m of text.matchAll(/\p{Lu}\p{L}*/gu)) {
    const w = m[0].toLowerCase();
    const opens = /(^|[.?!¿¡…:\n]\s*)$/.test(text.slice(0, m.index));
    if (w !== 'i' && (names.has(w) || !opens)) out.add(letters(w));
  }
  return out;
}

/** Tap the option that holds a name the prompt holds; null when the prompt has no name to match. */
export function nameMatch(c: McqCard, names: ReadonlySet<string>): number | null {
  const want = namesIn(c.prompt?.text ?? '', names);
  if (!want.size) return null;
  const hit = c.options.flatMap((o, i) => ([...namesIn(o.text, names)].some((n) => want.has(n)) ? [i] : []));
  return hit.length ? share(hit, c.answer) : 1 / c.options.length;
}

/** The answer is the one option that stands out: the only one with a name, the only one without, or the only one with a "(polite)" tag. */
export function standsOut(c: McqCard, names: ReadonlySet<string>): 'name' | 'tag' | null {
  const holds: Array<(t: string) => boolean> = [(t) => namesIn(t, names).size > 0, (t) => /\([^)]*\)\s*$/.test(t)];
  for (const [k, has] of holds.entries()) {
    const marks = c.options.map((o) => has(o.text));
    const n = marks.filter(Boolean).length;
    if (c.options.length > 2 && ((n === 1 && marks[c.answer]) || (n === c.options.length - 1 && !marks[c.answer]))) return k === 0 ? 'name' : 'tag';
  }
  return null;
}

export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
export { letters };
