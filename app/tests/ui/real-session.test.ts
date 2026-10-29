// A fresh learner's first three sessions on the real course: each one fits
// its minutes (measured the way a learner on a phone spends them), no format
// runs on for long, and session 1 teaches at most 8 new words and phrases.
import { beforeAll, describe, expect, it } from 'vitest';
import { budget } from '../../src/compiler';
import { Learner, MemoryStore } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { MemoryKV, UiStore } from '../../src/ui/store/ui';
import { session } from './driver';

const DAY = 86_400_000;
/** most screens in a row that may share one format */
const MAX_RUN = 6;
/** a block that has started is finished; this much past the minutes is tolerated */
const GRACE_MINUTES = 3;

let bundle: Bundle;
beforeAll(async () => { bundle = await new ContentLoader().load({ band: 'A1' }); }, 60_000);

async function fresh() {
  const clock = { t: new Date(2026, 9, 1, 18).getTime() };
  const now = () => clock.t;
  const kv = new MemoryKV();
  const store = new MemoryStore();
  const learner = await Learner.open(store, { now });
  const ui = await new UiStore(kv).load();
  await ui.update((s) => { s.onboarded = true; });
  return { clock, now, kv, store, learner, ui, bundle };
}

function longestRun(screens: string[]): { n: number; at: string } {
  let best = { n: 0, at: '' };
  let n = 0;
  screens.forEach((s, i) => {
    n = i && screens[i - 1] === s ? n + 1 : 1;
    if (n > best.n) best = { n, at: s };
  });
  return best;
}

describe('a fresh learner, sessions 1 to 3, real content', () => {
  for (const mood of ['right', 'wrong'] as const) {
    it(`answering ${mood}: within budget, varied, a gentle first day`, async () => {
      const w = await fresh();
      for (let k = 1; k <= 3; k++) {
        const r = await session(w, mood);
        const label = `session ${k} (${r.plan.type})`;
        expect(r.walk.failures, label).toEqual([]);
        // the plan fits, and so does the session as played
        expect(r.plan.estimatedMinutes, `${label} plan`).toBeLessThanOrEqual(r.plan.budget.minutes);
        expect(r.minutes, `${label} played`).toBeLessThanOrEqual(r.plan.budget.minutes + GRACE_MINUTES);
        // format variety
        const run = longestRun(r.walk.screens);
        expect(run.n, `${label}: ${run.n} × ${run.at} in a row`).toBeLessThanOrEqual(MAX_RUN);
        if (k === 1) {
          const learnPool = r.plan.newNodes.chunks.length + r.plan.newNodes.lexemes.length + r.plan.newNodes.patterns.length + r.plan.newNodes.contrasts.length;
          expect(learnPool, label).toBeLessThanOrEqual(budget.EARLY_NEW_ITEMS_MAX);
        }
        w.clock.t += DAY;
      }
    }, 60_000);
  }
});
