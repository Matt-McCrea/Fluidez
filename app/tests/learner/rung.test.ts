import { describe, expect, test } from 'vitest';
import { Learner } from '../../src/learner';

function fresh(ids: string[]) {
  const L = Learner.fresh({ now: () => 1_700_000_000_000 });
  for (const id of ids) L.introduce(id, { results: [true, true, true] });
  return L;
}

describe('the output ladder rung', () => {
  test('a node starts at rung 0 with no streak; unknown nodes are ignored', () => {
    const L = fresh(['g:a']);
    expect(L.rung('g:a')).toBe(0);
    expect(L.rungStreak('g:a')).toBe(0);
    L.stepRung('g:none', 'pass');
    expect(L.rung('g:none')).toBe(0);
  });

  test('two first-try passes climb one rung and reset the streak', () => {
    const L = fresh(['g:a']);
    L.stepRung('g:a', 'pass');
    expect([L.rung('g:a'), L.rungStreak('g:a')]).toEqual([0, 1]);
    L.stepRung('g:a', 'pass');
    expect([L.rung('g:a'), L.rungStreak('g:a')]).toEqual([1, 0]);
  });

  test('a pass on the retry keeps the rung and resets the streak', () => {
    const L = fresh(['g:a']);
    L.stepRung('g:a', 'pass');
    L.stepRung('g:a', 'retry');
    expect([L.rung('g:a'), L.rungStreak('g:a')]).toEqual([0, 0]);
  });

  test('a miss drops one rung (floor 0) and resets the streak', () => {
    const L = fresh(['g:a']);
    for (let i = 0; i < 4; i++) L.stepRung('g:a', 'pass');
    expect(L.rung('g:a')).toBe(2);
    L.stepRung('g:a', 'pass');
    L.stepRung('g:a', 'miss');
    expect([L.rung('g:a'), L.rungStreak('g:a')]).toEqual([1, 0]);
    L.stepRung('g:a', 'miss');
    L.stepRung('g:a', 'miss');
    expect(L.rung('g:a')).toBe(0);
  });

  test('grammar caps at rung 3, lexemes at rung 1', () => {
    const L = fresh(['g:a', 'l:b', 'c:c', 'p:d']);
    for (const id of ['g:a', 'l:b', 'c:c', 'p:d']) for (let i = 0; i < 12; i++) L.stepRung(id, 'pass');
    expect(L.rung('g:a')).toBe(3);
    expect(L.rung('c:c')).toBe(3);
    expect(L.rung('p:d')).toBe(3);
    expect(L.rung('l:b')).toBe(1);
  });

  test('persists with the state', () => {
    const L = fresh(['g:a']);
    L.stepRung('g:a', 'pass');
    L.stepRung('g:a', 'pass');
    L.stepRung('g:a', 'pass');
    const L2 = Learner.fromJSON(JSON.parse(JSON.stringify(L.toJSON())));
    expect([L2.rung('g:a'), L2.rungStreak('g:a')]).toEqual([1, 1]);
  });
});
