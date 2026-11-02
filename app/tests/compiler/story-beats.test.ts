// A chapter long enough is read over several sessions, a beat a day: the story reaches days that have no chapter of their own.
import { describe, expect, test } from 'vitest';
import { servedRefs, type ReadBlock, type SessionPlan } from '../../src/compiler';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { realCourse } from './helpers';

describe('the real course, read in beats', () => {
  const real = realCourse(3);
  const plans: SessionPlan[] = [];
  simulateProfile(PROFILES.average, { days: 60, tier: 'standard', course: real.course, content: real.content, seed: 1, onPlan: (p) => plans.push(p) });
  const beats = plans.flatMap((p) => p.blocks.filter((b): b is ReadBlock => b.kind === 'read' && !!b.beat).map((b) => ({ p, b })));

  test('a beat is a minute or so, and the beats of one chapter come in order, each once', () => {
    const seen = new Map<string, number>();
    for (const { b } of beats) {
      expect(b.minutes).toBeLessThanOrEqual(2);
      const next = seen.get(b.chapter) ?? 0;
      expect(b.beat!.ix).toBe(next);
      seen.set(b.chapter, next + 1);
    }
  });

  test('the chapter is seen with its last beat and not before', () => {
    for (const { p, b } of beats) {
      const refs = servedRefs({ ...p, blocks: [b] });
      expect(refs.some((r) => r.kind === 'chapter')).toBe(b.beat!.ix === b.beat!.of - 1);
      expect(refs.some((r) => r.kind === 'reading')).toBe(true);
    }
  });
});
