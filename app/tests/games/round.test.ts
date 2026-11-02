// The clock of a timed round. Pure: time is handed in, so every case here runs at any speed.
import { describe, expect, it } from 'vitest';
import { ROUND_SECONDS, scoreOf, secondsLeft, SKIP_SECONDS, startRound, step, WRONG_SECONDS } from '../../src/games/round';

describe('the clock', () => {
  it('starts at sixty seconds and runs', () => {
    const s = startRound(1000);
    expect(secondsLeft(s)).toBe(ROUND_SECONDS);
    expect(secondsLeft(step(s, { t: 'tick', at: 11_000 }))).toBe(50);
  });

  it('a right answer scores one and the clock goes on', () => {
    const s = step(step(startRound(0), { t: 'right', at: 2000 }), { t: 'right', at: 4000 });
    expect(scoreOf(s)).toBe(2);
    expect(s.paused).toBe(false);
    expect(secondsLeft(s)).toBe(56);
  });

  it('a wrong answer takes time at once, then stops the clock while the correction is read', () => {
    let s = step(startRound(0), { t: 'wrong', at: 2000, kind: 'choose' });
    expect(s).toMatchObject({ wrong: 1, paused: true });
    expect(secondsLeft(s)).toBe(51);
    s = step(s, { t: 'tick', at: 40_000 });
    expect(secondsLeft(s)).toBe(51);
    s = step(s, { t: 'resume', at: 40_000 });
    expect(secondsLeft(step(s, { t: 'tick', at: 45_000 }))).toBe(46);
  });

  it('a miss on a tap costs more than a miss on a typed form, and passing costs less than either', () => {
    expect(WRONG_SECONDS.choose).toBeGreaterThan(WRONG_SECONDS.type);
    expect(SKIP_SECONDS).toBeLessThan(WRONG_SECONDS.type);
    const typed = step(startRound(0), { t: 'wrong', at: 0, kind: 'type' });
    const passed = step(startRound(0), { t: 'skip', at: 0 });
    expect(secondsLeft(typed)).toBe(57);
    expect(secondsLeft(passed)).toBe(59);
    expect(passed).toMatchObject({ skipped: 1, paused: true });
  });

  it('there is no bonus for a run of rights', () => {
    let s = startRound(0);
    for (let i = 1; i <= 20; i++) s = step(s, { t: 'right', at: 0 });
    expect(secondsLeft(s)).toBe(60);
  });

  it('is over at zero, whether the clock or a penalty brought it there, and nothing after that scores', () => {
    const late = step(startRound(0), { t: 'right', at: 61_000 });
    expect(late.over).toBe(true);
    expect(scoreOf(late)).toBe(0);
    const penalty = step(startRound(0), { t: 'wrong', at: 58_000, kind: 'choose' });
    expect(penalty.over).toBe(true);
    expect(penalty.left).toBe(0);
    expect(scoreOf(step(penalty, { t: 'right', at: 58_500 }))).toBe(0);
    expect(step(penalty, { t: 'tick', at: 99_999 })).toBe(penalty);
  });

  it('never runs backwards: a time earlier than the last mark moves nothing', () => {
    const s = step(startRound(5000), { t: 'tick', at: 1000 });
    expect(s.left).toBe(ROUND_SECONDS * 1000);
    expect(s.at).toBe(5000);
  });
});
