// A learner back after days away is told so on Home in one plain line: no count of days, no count of cards, no
// "behind" and no "you stopped" (R22). The line follows the plan, so it never promises a story that is not in it.
import { describe, expect, it } from 'vitest';
import { advancePath, compileSession, initialPath, type SessionPlan } from '../../src/compiler';
import { Learner } from '../../src/learner';
import { corpus } from '../compiler/helpers';
import { returnLine } from '../../src/ui/screens/home';
import { sessionLabel } from '../../src/ui/session/labels';
import type { Bundle } from '../../src/ui/data/bundle';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

/** A learner two weeks in, back after `away` days. */
function back(away: number): SessionPlan {
  const { course, content } = corpus({ seed: 2 });
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  let path = initialPath();
  for (let d = 0; d < 14; d++) {
    t = T0 + d * DAY;
    const plan = compileSession({ learnerId: 'back', learner: L, path, course, content, now: t });
    L.startSession(t);
    for (const x of Object.values(plan.newNodes).flat()) L.introduce(x, { results: [true, true, true], at: t });
    path = advancePath(path, plan, true);
  }
  t = T0 + (13 + away) * DAY;
  return compileSession({ learnerId: 'back', learner: L, path, course, content, now: t });
}

describe('the line for a returner', () => {
  it('says how today starts, in words, and promises the story only when the plan has it', () => {
    const lines = new Set<string>();
    for (const away of [8, 14, 21, 40]) {
      const plan = back(away);
      const line = returnLine(plan);
      expect(line, `${away} days away`).toBeDefined();
      lines.add(line!);
      expect(/story/.test(line!)).toBe(plan.blocks.some((b) => b.kind === 'read'));
      // no totals, no dashes, nothing that makes anyone feel behind
      expect(line).not.toMatch(/\d/);
      expect(line).not.toMatch(/[–—]| - /);
      expect(line).not.toMatch(/behind|missed|forgot|lost|stopped|days|weeks/i);
    }
    expect(lines.size).toBeGreaterThan(0);
  });

  it('is not said to anyone else', () => {
    const { course, content } = corpus({ seed: 2 });
    const L = Learner.fresh({ now: () => T0 });
    expect(returnLine(compileSession({ learnerId: 'n', learner: L, path: initialPath(), course, content, now: T0 }))).toBeUndefined();
    expect(returnLine(undefined)).toBeUndefined();
  });

  it('names the session for what it is, not as a catch-up', () => {
    const plan = back(21);
    const label = sessionLabel(plan, { title: (id: string) => id, story: [], scenes: new Map() } as unknown as Bundle);
    expect(label).toBe('A gentle start');
  });
});
