// Seeded PRNG + clock helpers for property-style tests (no fast-check dependency).
export function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: <T>(xs: readonly T[]) => xs[Math.floor(next() * xs.length)],
    bool: (p = 0.5) => next() < p,
  };
}

export const DAY = 86_400_000;
/** Noon local time on 2026-01-05 + n days: far from the 04:00 rollover. */
export const day = (n: number, hour = 12) => new Date(2026, 0, 5 + n, hour).getTime();

export function clock(start = day(0)) {
  let t = start;
  return { now: () => t, set: (v: number) => { t = v; }, advance: (ms: number) => { t += ms; } };
}

export const SEEDS = Array.from({ length: 40 }, (_, i) => i * 7919 + 1);
