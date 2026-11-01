// Settings. There is no DOM in this test run, so the screen itself is driven in
// a browser (e2e); what can be pinned here is the words and the wiring.
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { describeBackup } from '../../src/ui/screens/settings';

describe('the screen', () => {
  // A source scan, because there is no DOM here: it fails on the file that offered the choice.
  const src = readFileSync(new URL('../../src/ui/screens/settings.tsx', import.meta.url), 'utf8');

  test('does not let a learner choose how long the day is', () => {
    expect(src).not.toMatch(/How much each day/);
    expect(src).not.toMatch(/name="tier"/);
    expect(src).not.toMatch(/Just the essentials|The regular lesson/);
    expect(src).not.toMatch(/setSettings\(\{\s*tier|set\(\{\s*tier/);
  });

  test('still offers how much to review, a backup and a reset', () => {
    expect(src).toMatch(/How much to review/);
    expect(src).toMatch(/Save a backup/);
    expect(src).toMatch(/Restore a backup/);
    expect(src).toMatch(/Reset progress/);
  });

  test('only hands over a backup that has been proved to restore', () => {
    expect(src).toMatch(/provenBackup\(/);
    expect(src).not.toMatch(/makeBackup\(/);
  });
});

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
