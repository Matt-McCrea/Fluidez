// The close of a scene says what the checks showed. "They understood you" after
// five "no sé" was the report's F15: no reply had landed, first time or after.
import { describe, expect, it } from 'vitest';
import { checkTurn, sceneVerdict, type TurnOutcome } from '../../src/ui/session/scene';
import { fixtureBundle } from './driver';

const first = (n: number): TurnOutcome[] => Array.from({ length: n }, () => ({ first: true }));
const missed = (n: number): TurnOutcome[] => Array.from({ length: n }, () => ({ first: false, second: false }));
const fixed = (n: number): TurnOutcome[] => Array.from({ length: n }, () => ({ first: false, second: true }));

describe('sceneVerdict', () => {
  it('every reply first time: they understood you', () => {
    expect(sceneVerdict(first(5))).toBe('They understood you. All 5 replies landed first time.');
    expect(sceneVerdict(first(1))).toBe('They understood you. That reply landed first time.');
  });

  it('some fixed on the second go, none missed: they understood you in the end', () => {
    expect(sceneVerdict([...first(3), ...fixed(2)])).toBe('They understood you. 3 of 5 landed first time, and the other 2 after one fix.');
  });

  it('five no sé: nothing landed, and nothing was fixed', () => {
    const v = sceneVerdict(missed(5));
    expect(v).toBe('None of the 5 replies landed this time. Look at how they could go, then try the scene again.');
    expect(v).not.toMatch(/understood you|fixed/);
  });

  it('a mix says how many did not land', () => {
    const v = sceneVerdict([...first(2), ...fixed(1), ...missed(2)]);
    expect(v).toBe("3 of 5 replies landed, 2 of them first time. The other 2 didn't, so this one is worth another go.");
    expect(v).not.toMatch(/understood you/);
  });

  it('a first reply that was missed and never retried is a miss', () => {
    expect(sceneVerdict([{ first: false }, { first: true }])).toMatch(/^1 of 2 replies landed, 1 of them first time/);
  });

  it('never a dash, and nothing for an empty scene', () => {
    for (const n of [1, 2, 5]) for (const mk of [first, missed, fixed]) expect(sceneVerdict(mk(n))).not.toMatch(/[—–]|\s-\s/);
    expect(sceneVerdict([])).toBe('');
  });
});

describe('a turn that is not an answer', () => {
  const b = fixtureBundle();
  const hello = b.scenes.get('sc-u01-a')!.turns[0];
  it('"no sé" does not land on a greeting', () => {
    expect(checkTurn(hello, 'no sé').pass).toBe(false);
    expect(checkTurn(hello, 'No sé.').pass).toBe(false);
  });
});
