// Property tests: every plan the simulator compiles, over seeded random
// learners (skips, breaks, minimum days, doubles, forgetting) and seeded
// synthetic content, satisfies every compiler rule.
import { describe, expect, test } from 'vitest';
import { PROFILES } from '../../tools/sim/profiles';
import { ALL_CHECKS, checkSpacing, corpus, SEEDS, walk } from './helpers';

describe('compiler rules hold on every compiled plan', () => {
  for (const profile of ['irregular', 'forgetful', 'fast'] as const) {
    test(`${profile}: frame, minimum, budgets, contrasts, gate, no repeats, reviews, throttle, spacing`, () => {
      let plans = 0, intros = 0, minimum = 0, throttled = 0, another = 0;
      for (const seed of SEEDS.slice(0, profile === 'irregular' ? 8 : 4)) {
        const { plans: ps, run } = walk({ seed, profile: PROFILES[profile], days: 70, check: (s) => { for (const c of ALL_CHECKS) c(s); } });
        intros += checkSpacing(ps);
        plans += ps.length;
        minimum += ps.filter((p) => p.plan.tier === 'minimum').length;
        throttled += ps.filter((p) => p.plan.converted?.reason === 'throttle').length;
        another += ps.filter((p) => p.plan.mode === 'another').length;
        expect(Object.values(run.unintendedRepeats).reduce((a, b) => a + b, 0)).toBe(0);
        expect(run.itemRepeats60).toBe(0);
      }
      // the walks actually exercised the rules
      expect(plans).toBeGreaterThan(100);
      expect(intros).toBeGreaterThan(5);
      if (profile === 'irregular') expect(minimum).toBeGreaterThan(5);
      if (profile === 'forgetful') expect(throttled).toBeGreaterThan(0);
      if (profile === 'fast') expect(another).toBeGreaterThan(5);
    });
  }

  test('extended tier: same rules, plus extra reading', () => {
    let extra = 0;
    for (const seed of SEEDS.slice(0, 3)) {
      const { plans } = walk({ seed, profile: PROFILES.average, tier: 'extended', days: 40, check: (s) => { for (const c of ALL_CHECKS) c(s); } });
      checkSpacing(plans);
      extra += plans.filter((p) => p.plan.blocks.some((b) => b.kind === 'extraReading')).length;
    }
    expect(extra).toBeGreaterThan(0);
  });

  test('starved content: still no repeats and no ungated content; shortages are logged and sessions convert', () => {
    let shortages = 0, conversions = 0;
    for (const seed of SEEDS.slice(0, 4)) {
      const c = corpus({ seed, supply: 0.08 });
      // drop most scenes and tasks too
      for (const id of [...c.content.scenes.keys()].filter((_, i) => i % 3)) c.content.scenes.delete(id);
      for (const id of [...c.content.tasks.keys()].filter((_, i) => i % 3)) c.content.tasks.delete(id);
      const { plans, run } = walk({ seed, corpus: c, profile: PROFILES.average, days: 60, check: (s) => { for (const ch of ALL_CHECKS) ch(s); } });
      checkSpacing(plans);
      shortages += plans.reduce((a, p) => a + p.plan.diagnostics.filter((d) => d.code === 'shortage' || d.code === 'bareReview').length, 0);
      conversions += plans.filter((p) => p.plan.converted?.reason === 'shortage').length;
      expect(Object.values(run.unintendedRepeats).reduce((a, b) => a + b, 0)).toBe(0);
    }
    expect(shortages).toBeGreaterThan(0);
    expect(conversions).toBeGreaterThan(0);
  });
});
