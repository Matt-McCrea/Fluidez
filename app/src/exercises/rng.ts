// Seeded randomness. Generators are pure: the same (input, seed) gives the
// same items in the same order. The seed only ever chooses and shuffles; it
// never enters an item id, so a reshuffled item is still the same item.

/** 32-bit FNV-1a: a stable number from a string. */
export function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export type Rng = () => number;

/** mulberry32 */
export function rng(seed: number | string): Rng {
  let a = typeof seed === 'string' ? hash32(seed) : seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(xs: readonly T[], r: Rng): T[] {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pick<T>(xs: readonly T[], r: Rng): T {
  return xs[Math.floor(r() * xs.length)];
}

/** Options shuffled with the right answer tracked. */
export function shuffled(correct: string, distractors: readonly string[], r: Rng): { options: string[]; answer: number } {
  const options = shuffle([correct, ...distractors], r);
  return { options, answer: options.indexOf(correct) };
}

/** The stable item id: generator | sentence | transformation. */
export function itemId(generator: string, sentenceId: string, transformation: string): string {
  return `${generator}|${sentenceId}|${transformation}`;
}
