// Quick placement. A pluggable probe source hands out 10–15 read-and-pick
// items, each tagged with the unit it belongs to; the learner's answers pick
// a starting unit. The default source draws bank sentences across the units
// that have content. A better probe (adaptive, can-do based) can replace it
// without touching the screens.
import { initialPath, type PathState } from '../../compiler';
import type { NodeId } from '../../content/schema';
import { rng, shuffle } from '../../exercises';
import type { Learner } from '../../learner';
import type { Bundle } from '../data/bundle';

export interface ProbeItem {
  id: string;
  /** index into course.units */
  unit: number;
  es: string;
  options: string[];
  answer: number;
}

export interface ProbeSource {
  items(max: number): ProbeItem[];
}

/** Sentences from up to 5 levels of the course (3 each), easiest first. */
export function contentProbe(b: Bundle, seed = 'placement'): ProbeSource {
  return {
    items(max: number) {
      const r = rng(seed);
      const units = b.course.units
        .map((u, i) => ({ i, ids: b.index.byUnit.get(u.id) ?? [] }))
        .filter((u) => u.ids.length >= 3);
      if (!units.length) return [];
      const levels = Math.min(5, units.length, Math.max(1, Math.floor(max / 3)));
      const picks = Array.from({ length: levels }, (_, k) => units[Math.round((k * (units.length - 1)) / Math.max(1, levels - 1))]);
      const out: ProbeItem[] = [];
      for (const u of picks) {
        for (const id of shuffle([...u.ids], r).slice(0, 3)) {
          const s = b.sentences.get(id);
          if (!s) continue;
          const wrong = shuffle(b.bank.filter((x) => x.en !== s.en), r).slice(0, 2).map((x) => x.en);
          const options = shuffle([s.en, ...wrong], r);
          out.push({ id: `pl:${id}`, unit: u.i, es: s.es, options, answer: options.indexOf(s.en) });
        }
      }
      return out.slice(0, max);
    },
  };
}

/**
 * The starting unit: walk the levels easiest first; the learner starts at the
 * first level where they got fewer than 2 of 3 (or the last level they
 * passed + 1, capped to the course).
 */
export function placeFrom(items: ProbeItem[], correct: boolean[], units: number): number {
  const byUnit = new Map<number, { right: number; total: number }>();
  items.forEach((it, i) => {
    const e = byUnit.get(it.unit) ?? { right: 0, total: 0 };
    e.total++;
    if (correct[i]) e.right++;
    byUnit.set(it.unit, e);
  });
  let start = 0;
  for (const [unit, e] of [...byUnit].sort((a, b) => a[0] - b[0])) {
    if (e.right / e.total < 2 / 3) return start;
    start = Math.min(units - 1, unit + 1);
  }
  return start;
}

/**
 * Start the learner at `unit`. The nodes of the units skipped are introduced
 * as already known ("prove it and skip"), so content gating works from there.
 * Returns the path to persist.
 */
export function applyPlacement(learner: Learner, b: Bundle, unit: number): PathState {
  const path = initialPath();
  if (unit <= 0) return path;
  path.unit = Math.min(unit, b.course.units.length);
  const skipped = new Set<NodeId>();
  for (const u of b.course.units.slice(0, path.unit)) {
    for (const d of u.days) for (const n of [...d.focus, ...d.chunks, ...d.lexemes]) skipped.add(n);
  }
  for (const n of skipped) {
    if (b.node(n)?.kind === 'cando') continue;
    learner.introduce(n, { results: [true, true, true] });
  }
  return path;
}
