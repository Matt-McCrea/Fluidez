// Finding the place two sentences differ: the pivot of a contrast. Two sentences that say the same thing
// with one word changed (Lo hice para ti. / Lo hice por ti.) differ in a small span, and that span is what
// the contrast decides. Pure and deterministic; the derive tool and its tests share it.

export interface Word { norm: string; start: number; end: number }

/** The words of a sentence with where they sit (punctuation is not a word). Compared lower case, accents kept: sé and se differ. */
export function wordsOf(s: string): Word[] {
  const out: Word[] = [];
  for (const m of s.matchAll(/[\p{L}\p{N}]+/gu)) out.push({ norm: m[0].toLowerCase(), start: m.index!, end: m.index! + m[0].length });
  return out;
}

export interface Pivot {
  /** where the span sits in each sentence (character offsets) */
  a: [number, number];
  b: [number, number];
  /** the span as written in each */
  ta: string;
  tb: string;
  /** words in the longer span: 1 for por/para, 2 for lo siento/perdón */
  size: number;
}

/**
 * The one span in which `a` and `b` differ: what is left when the words they begin and end with alike are taken away.
 * Undefined when they share no words, when one is inside the other, or when the span is longer than `max` words in
 * either (two sentences that merely resemble each other are not a pair).
 */
export function pivotOf(a: string, b: string, max = 3): Pivot | undefined {
  const wa = wordsOf(a), wb = wordsOf(b);
  let p = 0;
  while (p < wa.length && p < wb.length && wa[p].norm === wb[p].norm) p++;
  let s = 0;
  while (s < wa.length - p && s < wb.length - p && wa[wa.length - 1 - s].norm === wb[wb.length - 1 - s].norm) s++;
  const ia = wa.slice(p, wa.length - s), ib = wb.slice(p, wb.length - s);
  if (!ia.length || !ib.length || ia.length > max || ib.length > max || p + s < 1) return undefined;
  const span = (w: Word[], xs: Word[], text: string): [[number, number], string] => {
    const r: [number, number] = [xs[0].start, xs[xs.length - 1].end];
    return [r, text.slice(r[0], r[1])];
  };
  const [ra, ta] = span(wa, ia, a), [rb, tb] = span(wb, ib, b);
  if (ta.toLowerCase() === tb.toLowerCase()) return undefined;
  return { a: ra, b: rb, ta, tb, size: Math.max(ia.length, ib.length) };
}

/** A sentence without its markdown stresses and surrounding space. */
export const plain = (s: string): string => s.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

/** A sentence as a key: lower case, no stresses, no punctuation at its ends. */
export const keyOf = (s: string): string => plain(s).toLowerCase().replace(/^[\s¿¡"'“”]+|[\s.!?"'“”]+$/g, '');

/** The first letter of `w` in the case of `like`'s first letter. */
export const caseLike = (w: string, like: string): string =>
  /^\p{Lu}/u.test(like) ? w.charAt(0).toUpperCase() + w.slice(1) : w.charAt(0).toLowerCase() + w.slice(1);
