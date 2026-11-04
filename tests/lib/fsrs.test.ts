import { afterEach, describe, expect, test } from 'vitest';
import {
  createCard, review, retrievability, setRetention, getRetention, gradeFromAnswer, fromLeitner,
  LEITNER_INTERVALS, MAXIMUM_INTERVAL, type CardJSON,
} from '../../lib/fsrs';

const DAY = 86400000;
const T0 = Date.UTC(2026, 0, 5, 12);

/** Review on the day it falls due, n times. */
function run(grades: Array<'again' | 'hard' | 'good' | 'easy'>, start = createCard(T0)) {
  let c = start, now = T0;
  const out: number[] = [];
  for (const g of grades) {
    const r = review(c, g, now);
    out.push(r.intervalDays);
    c = r.card;
    now = r.due;
  }
  return { c, out, now };
}

afterEach(() => { setRetention(0.9); });

describe('createCard', () => {
  test('is new, due now, and plain JSON', () => {
    const c = createCard(T0);
    expect(c.state).toBe(0);
    expect(c.due).toBe(T0);
    expect(c.reps).toBe(0);
    expect(JSON.parse(JSON.stringify(c))).toEqual(c);
  });
});

describe('review', () => {
  test('returns the next card and interval, and leaves the input alone', () => {
    const c = createCard(T0);
    const snap = JSON.stringify(c);
    const r = review(c, 'good', T0);
    expect(JSON.stringify(c)).toBe(snap);
    expect(r.card.state).toBe(2);
    expect(r.card.reps).toBe(1);
    expect(r.intervalDays).toBeGreaterThanOrEqual(1);
    expect(r.due).toBe(r.card.due);
    expect(r.due).toBe(T0 + r.intervalDays * DAY);
  });
  test('intervals grow after successive Good answers (about 3, 11, 35 at 0.90)', () => {
    const { out } = run(['good', 'good', 'good', 'good']);
    for (let i = 1; i < out.length; i++) expect(out[i]).toBeGreaterThan(out[i - 1]);
    expect(out.slice(0, 3)).toEqual([3, 11, 35]);
  });
  test('Easy grows faster than Good, Hard slower', () => {
    const base = run(['good', 'good']).c, now = run(['good', 'good']).now;
    const e = review(base, 'easy', now).intervalDays, g = review(base, 'good', now).intervalDays, h = review(base, 'hard', now).intervalDays;
    expect(e).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(h);
  });
  test('Again shrinks the interval and counts a lapse', () => {
    const { c, now, out } = run(['good', 'good', 'good']);
    const lapse = review(c, 'again', now);
    expect(lapse.card.lapses).toBe(1);
    expect(lapse.card.state).toBe(3);
    expect(lapse.card.stability).toBeLessThan(c.stability);
    expect(lapse.intervalDays).toBeLessThan(out[2]);
    expect(lapse.due - now).toBe(10 * 60 * 1000);
  });
  test('after a lapse the next interval is short, then grows again', () => {
    const { c, now, out } = run(['good', 'good', 'good']);
    const lapse = review(c, 'again', now);
    const back = review(lapse.card, 'good', lapse.due);
    expect(back.intervalDays).toBeLessThan(out[2]);
    const next = review(back.card, 'good', back.due);
    expect(next.intervalDays).toBeGreaterThan(back.intervalDays);
  });
  test('numeric ratings work and bad ones throw', () => {
    expect(review(createCard(T0), 3, T0).card.reps).toBe(1);
    expect(() => review(createCard(T0), 5 as never, T0)).toThrow(RangeError);
    expect(() => review(createCard(T0), 'meh' as never, T0)).toThrow(RangeError);
  });
  test('is deterministic (no fuzz)', () => {
    expect(run(['good', 'good', 'good']).out).toEqual(run(['good', 'good', 'good']).out);
  });
  test('never exceeds the maximum interval', () => {
    const { out } = run(Array(14).fill('easy'));
    expect(Math.max(...out)).toBeLessThanOrEqual(MAXIMUM_INTERVAL);
  });
});

describe('retrievability', () => {
  test('is 0 for a new card', () => {
    expect(retrievability(createCard(T0), T0)).toBe(0);
  });
  test('is about 1 just after a review and falls with time', () => {
    const r = review(createCard(T0), 'good', T0);
    const r0 = retrievability(r.card, T0);
    const r5 = retrievability(r.card, T0 + 5 * DAY);
    const r30 = retrievability(r.card, T0 + 30 * DAY);
    expect(r0).toBeCloseTo(1, 5);
    expect(r5).toBeLessThan(r0);
    expect(r30).toBeLessThan(r5);
  });
  test('equals the target retention on the due day', () => {
    const r = review(createCard(T0), 'good', T0);
    expect(retrievability(r.card, r.due)).toBeCloseTo(0.9, 1);
  });
});

describe('setRetention', () => {
  test('a higher retention gives shorter intervals', () => {
    const at = (r: number) => { setRetention(r); return run(['good', 'good', 'good']).out; };
    const low = at(0.85), high = at(0.9);
    expect(low[2]).toBeGreaterThan(high[2]);
  });
  test('clamps to 0.85..0.90 and reports the value in force', () => {
    expect(setRetention(0.5)).toBe(0.85);
    expect(setRetention(0.99)).toBe(0.9);
    expect(setRetention(0.87)).toBe(0.87);
    expect(getRetention()).toBe(0.87);
    expect(() => setRetention(NaN)).toThrow(RangeError);
  });
});

describe('gradeFromAnswer', () => {
  test('wrong or unsure is again', () => {
    expect(gradeFromAnswer({ correct: false })).toBe('again');
    expect(gradeFromAnswer({ correct: false, usedHint: true, latencyMs: 100 })).toBe('again');
    expect(gradeFromAnswer({ correct: true, unsure: true, latencyMs: 100 })).toBe('again');
  });
  test('right after a hint is hard, however fast', () => {
    expect(gradeFromAnswer({ correct: true, usedHint: true, latencyMs: 100 })).toBe('hard');
  });
  test('right and within typical is good', () => {
    expect(gradeFromAnswer({ correct: true, latencyMs: 4000, typicalLatencyMs: 4000 })).toBe('good');
    expect(gradeFromAnswer({ correct: true, latencyMs: 3000, typicalLatencyMs: 4000 })).toBe('good');
    expect(gradeFromAnswer({ correct: true })).toBe('good');
  });
  test('clearly faster than typical is easy', () => {
    expect(gradeFromAnswer({ correct: true, latencyMs: 1500, typicalLatencyMs: 4000 })).toBe('easy');
  });
  test('right but slower than typical is hard', () => {
    expect(gradeFromAnswer({ correct: true, latencyMs: 9000, typicalLatencyMs: 4000 })).toBe('hard');
  });
  test('a default typical latency applies when the card has none', () => {
    expect(gradeFromAnswer({ correct: true, latencyMs: 1000 })).toBe('easy');
    expect(gradeFromAnswer({ correct: true, latencyMs: 5000 })).toBe('good');
    expect(gradeFromAnswer({ correct: true, latencyMs: 20000 })).toBe('hard');
  });
});

describe('fromLeitner', () => {
  const day = 20500;
  const local = (d: number) => d * DAY + new Date(d * DAY).getTimezoneOffset() * 60000;
  test('box 0 is a new card', () => {
    expect(fromLeitner(0, day).state).toBe(0);
  });
  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9])('box %i: stability is the interval and the card is due that many days on', (box) => {
    const c = fromLeitner(box, day);
    expect(c.stability).toBe(LEITNER_INTERVALS[box]);
    expect(c.state).toBe(2);
    expect(c.last_review).toBe(local(day));
    expect(c.due).toBe(local(day) + LEITNER_INTERVALS[box] * DAY);
    expect(c.difficulty).toBeGreaterThan(1);
    expect(c.difficulty).toBeLessThan(10);
  });
  test('clamps an out-of-range box', () => {
    expect(fromLeitner(99, day).stability).toBe(180);
    expect(fromLeitner(-3, day).state).toBe(0);
  });
  test('a seeded card reviews on: Good grows it, Again lapses it, and retrievability is 0.9 at the interval', () => {
    const c: CardJSON = fromLeitner(5, day);
    expect(retrievability(c, c.due)).toBeCloseTo(0.9, 1);
    const good = review(c, 'good', c.due);
    expect(good.intervalDays).toBeGreaterThan(16);
    const bad = review(c, 'again', c.due);
    expect(bad.card.lapses).toBe(1);
    expect(bad.card.stability).toBeLessThan(16);
  });
});
