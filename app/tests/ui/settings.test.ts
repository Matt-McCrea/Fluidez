// Settings. There is no DOM in this test run, so the screen itself is driven in
// a browser (e2e); what can be pinned here is the words and the wiring.
import { describe, expect, test } from 'vitest';
import { describeBackup } from '../../src/ui/screens/settings';

describe('what a learner is told before a backup replaces their progress', () => {
  const made = new Date(2026, 10, 1, 9).getTime();

  test('says when it was made and how much is in it, and that a copy of what is here is kept', () => {
    const t = describeBackup({ madeAt: made, sessions: 12 });
    expect(t).toMatch(/from .*2026/);
    expect(t).toMatch(/12 sessions/);
    expect(t).toMatch(/replaces the progress on this device/);
    expect(t).toMatch(/We keep a copy of what is here now/);
  });

  test('one session is not "1 sessions", and a backup with no date does not invent one', () => {
    expect(describeBackup({ madeAt: made, sessions: 1 })).toMatch(/1 session in it/);
    expect(describeBackup({ madeAt: 0, sessions: 3 })).toMatch(/^This backup has 3 sessions in it\./);
  });

  test('has no dashes', () => {
    expect(describeBackup({ madeAt: made, sessions: 12 })).not.toMatch(/[–—]| - /);
  });
});
