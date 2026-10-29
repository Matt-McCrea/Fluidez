// Simulator smoke: 60 days on the synthetic corpus, all four profiles. Fast
// enough for every `npm test`; the full 365-day run is `npm run simulate`.
import { describe, expect, test } from 'vitest';
import { buildContentIndex, buildCourse } from '../../src/compiler';
import { PROFILES } from '../../tools/sim/profiles';
import { bandRows, computeQuotas, formatReport, retentionRows } from '../../tools/sim/report';
import { simulateProfile } from '../../tools/sim/run';
import { syntheticCorpus } from '../../tools/sim/synthetic';

describe('simulator (60 days, synthetic)', () => {
  const c = syntheticCorpus({ seed: 7, maxUnits: 14 });
  const course = buildCourse(c.units, c.nodes);
  const content = buildContentIndex(c.source, course);
  const runs = Object.values(PROFILES).map((p) => simulateProfile(p, { days: 60, tier: 'standard', course, content, seed: 7 }));

  test('every profile studies, progresses, and never repeats unintentionally', () => {
    for (const r of runs) {
      expect(r.sessions.length, r.profile).toBeGreaterThan(20);
      expect(r.finalUnit, r.profile).toBeGreaterThan(0);
      expect(Object.values(r.unintendedRepeats).reduce((a, b) => a + b, 0), r.profile).toBe(0);
      expect(r.itemRepeats60, r.profile).toBe(0);
      // sessions land near the 20-minute target (minimum days pull the mean down)
      const mean = r.sessions.reduce((a, s) => a + s.estMinutes, 0) / r.sessions.length;
      expect(mean, r.profile).toBeGreaterThan(8);
      expect(mean, r.profile).toBeLessThan(26);
    }
  });

  test('profiles differ the way they should', () => {
    const by = Object.fromEntries(runs.map((r) => [r.profile, r]));
    expect(by.fast.finalUnit).toBeGreaterThanOrEqual(by.average.finalUnit);
    expect(by.average.finalUnit).toBeGreaterThanOrEqual(by.irregular.finalUnit);
    expect(by.irregular.sessions.filter((s) => s.type === 'minimum').length).toBeGreaterThanOrEqual(by.fast.sessions.filter((s) => s.type === 'minimum').length);
  });

  test('determinism: the same seed gives the same run', () => {
    const again = simulateProfile(PROFILES.average, { days: 60, tier: 'standard', course, content, seed: 7 });
    const first = runs.find((r) => r.profile === 'average')!;
    expect(JSON.stringify(again.sessions)).toBe(JSON.stringify(first.sessions));
  });

  test('report and quotas: every unit gets a quota, measured units carry their demand', () => {
    const q = computeQuotas(runs, course.units, { source: 'synthetic', days: 60, tier: 'standard', profiles: runs.map((r) => r.profile) });
    expect(Object.keys(q.units)).toEqual(course.units.map((u) => u.id));
    const u01 = q.units.u01;
    expect(u01.estimated).toBe(false);
    expect(u01.bankSentences).toBe(Math.ceil(3 * u01.maxDemand.sentences));
    expect(u01.bankSentences).toBeGreaterThan(0);
    expect(u01.chapters).toBeGreaterThanOrEqual(course.units[0].days.filter((d) => d.chapter).length);
    expect(q.perNode.lexeme.quota).toBeGreaterThan(0);
    expect(bandRows(runs).find((r) => r.profile === 'fast' && r.band === 'A1')!.sessions).toBeGreaterThan(0);
    expect(formatReport(runs, q)).toContain('UNINTENDED REPEATS');
  });
});

describe('simulator parity with the app (synthetic, 90 days)', () => {
  const c = syntheticCorpus({ seed: 11, maxUnits: 14 });
  const course = buildCourse(c.units, c.nodes);
  const content = buildContentIndex(c.source, course);
  const runs = Object.values(PROFILES).map((p) => simulateProfile(p, { days: 90, tier: 'standard', course, content, seed: 11 }));

  test('grades are Again / Hard / Good, never Easy', () => {
    for (const r of runs) {
      expect(r.gradeCounts.hard, r.profile).toBeGreaterThan(0);
      expect(r.gradeCounts.good, r.profile).toBeGreaterThan(0);
      expect(r.gradeCounts.again, r.profile).toBeGreaterThan(0);
      expect(r.gradeCounts.easy, r.profile).toBe(0);
    }
  });

  test('the recap block runs and logs op recap events', () => {
    for (const r of runs) {
      expect(r.recap.blocks, r.profile).toBeGreaterThan(0);
      expect(r.opCounts.recap ?? 0, r.profile).toBeGreaterThan(0);
    }
  });

  test('the report carries the retention fields', () => {
    const rows = retentionRows(runs);
    expect(rows.length).toBeGreaterThan(0);
    const all = rows.find((x) => x.profile === 'average' && x.band === 'all')!;
    const s = all.stats;
    expect(s.reviews).toBeGreaterThan(100);
    expect(s.firstTry).toBeGreaterThan(0.5);
    expect(s.firstTry).toBeLessThanOrEqual(s.recall);
    expect(s.meanR).toBeGreaterThan(0.5);
    expect(s.production).toBeGreaterThan(0);
    expect(s).toHaveProperty('delayed');
    expect(s).toHaveProperty('recombineN');
    expect(s).toHaveProperty('coverageN');
    expect(s).toHaveProperty('chaptersDeferred');
    const q = computeQuotas(runs, course.units, { source: 'synthetic', days: 90, tier: 'standard', profiles: runs.map((r) => r.profile) });
    const text = formatReport(runs, q);
    expect(text).toContain('Retention');
    expect(text).toContain('first-try %');
  });

  test('a placed learner reports the day-1 backlog', () => {
    const idx = Math.min(8, course.units.length - 1);
    const r = simulateProfile(PROFILES.average, { days: 20, tier: 'standard', course, content, seed: 11, placement: idx });
    expect(r.placement?.seededNodes).toBeGreaterThan(0);
    expect(r.placement?.day1.dueMinutes).toBeGreaterThanOrEqual(0);
    expect(r.sessions[0].day).toBe(1);
  });
});
