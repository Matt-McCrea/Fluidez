import { describe, expect, test } from 'vitest';
import {
  Learner, Rating, State, LEARNED_STABILITY_DAYS, PARTIAL_TOTAL_CAP, type Grade,
} from '../../src/learner';
import { clock, day, DAY, rng, SEEDS } from './helpers';

const GRADES: Grade[] = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy];

function introduced(c = clock(), id = 'l:casa') {
  const L = Learner.fresh({ now: c.now });
  L.introduce(id, { results: [true, true, true] });
  return L;
}

describe('in-lesson learning', () => {
  test('steps report done at 3 with the last two right, and stop at 5', () => {
    const L = Learner.fresh({ now: clock().now });
    L.introduce('l:a');
    expect(L.learningStep('l:a', true).done).toBe(false);
    expect(L.learningStep('l:a', true).done).toBe(false);
    expect(L.learningStep('l:a', true).done).toBe(true);
    L.introduce('l:b');
    for (const ok of [false, true, false, true]) expect(L.learningStep('l:b', ok).done).toBe(false);
    expect(L.learningStep('l:b', false).done).toBe(true);
  });

  test('no card exists until the introduction completes; then FSRS owns it', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.introduce('l:a');
    expect(L.hasCard('l:a', 'receptive')).toBe(false);
    expect(() => L.review('l:a', 'receptive', Rating.Good)).toThrow();
    for (let i = 0; i < 3; i++) L.learningStep('l:a', true);
    const r = L.completeIntroduction('l:a');
    expect(L.isLearning('l:a')).toBe(false);
    expect(r.intervalDays).toBeGreaterThanOrEqual(2);
    expect(r.intervalDays).toBeLessThanOrEqual(4);
  });

  test('a shaky introduction schedules sooner than a clean one', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    const clean = L.introduce('l:a', { results: [true, true, true] });
    const shaky = L.introduce('l:b', { results: [false, true, true, true] });
    const failed = L.introduce('l:c', { results: [true, false] });
    expect(shaky.receptive!.due).toBeLessThan(clean.receptive!.due);
    expect(failed.receptive!.due).toBeLessThanOrEqual(shaky.receptive!.due);
  });
});

describe('productive unlock rule', () => {
  test('property: productive unlocks exactly at the first passing receptive review on a later day', () => {
    for (const seed of SEEDS) {
      const r = rng(seed);
      const c = clock(day(0, 9));
      const L = introduced(c);
      let expectUnlocked = false;
      for (let i = 0; i < 12; i++) {
        c.advance(r.int(0, 3) * DAY + r.int(0, 6) * 3_600_000);
        const g = r.pick(GRADES);
        const laterDay = L.day() > L.node('l:casa')!.introDay;
        if (!L.isProductiveUnlocked('l:casa')) expect(() => L.review('l:casa', 'productive', Rating.Good)).toThrow(/locked/);
        const res = L.review('l:casa', 'receptive', g);
        const shouldUnlockNow: boolean = !expectUnlocked && laterDay && g !== Rating.Again;
        expect(res.unlockedProductive).toBe(shouldUnlockNow);
        expectUnlocked ||= shouldUnlockNow;
        expect(L.isProductiveUnlocked('l:casa')).toBe(expectUnlocked);
      }
    }
  });

  test('same-day receptive reviews never unlock, even after the rollover hour is not reached', () => {
    const c = clock(day(0, 22));
    const L = introduced(c);
    c.set(day(1, 2)); // 02:00 next calendar day is still "today" with a 04:00 rollover
    expect(L.review('l:casa', 'receptive', Rating.Good).unlockedProductive).toBe(false);
    c.set(day(1, 5));
    expect(L.review('l:casa', 'receptive', Rating.Good).unlockedProductive).toBe(true);
  });

  test('partial credit and exposure never unlock', () => {
    const c = clock();
    const L = introduced(c);
    L.introduce('l:mesa', { results: [true, true, true] });
    c.set(day(4));
    L.review('l:mesa', 'receptive', Rating.Good); // unlocks mesa only
    L.creditSentence(['l:mesa', 'l:casa'], 'receptive', Rating.Good, { target: 'l:mesa' });
    L.expose(['l:casa']);
    expect(L.isProductiveUnlocked('l:casa')).toBe(false);
    expect(L.isProductiveUnlocked('l:mesa')).toBe(true);
  });
});

describe('intervals for consecutive Good answers', () => {
  // FSRS-5 defaults at 90% retention: 3 → 11 → 35 → 101 days. The plan's table
  // (≈3 → 8–10 → 25 → 70) is the same shape; FSRS refits per learner later.
  test('roughly 3d → ~10d → ~30d → ~70–100d, each gap 2.5–4× the last', () => {
    const c = clock();
    const L = introduced(c);
    const gaps = [L.card('l:casa', 'receptive')!.scheduled_days];
    for (let i = 0; i < 3; i++) {
      c.set(L.card('l:casa', 'receptive')!.due);
      gaps.push(L.review('l:casa', 'receptive', Rating.Good).intervalDays);
    }
    expect(gaps[0]).toBeGreaterThanOrEqual(2); expect(gaps[0]).toBeLessThanOrEqual(4);
    expect(gaps[1]).toBeGreaterThanOrEqual(7); expect(gaps[1]).toBeLessThanOrEqual(13);
    expect(gaps[2]).toBeGreaterThanOrEqual(20); expect(gaps[2]).toBeLessThanOrEqual(40);
    expect(gaps[3]).toBeGreaterThanOrEqual(55); expect(gaps[3]).toBeLessThanOrEqual(110);
    for (let i = 1; i < gaps.length; i++) {
      expect(gaps[i] / gaps[i - 1]).toBeGreaterThan(2.3);
      expect(gaps[i] / gaps[i - 1]).toBeLessThan(4);
    }
  });

  test('a higher target retention shortens the gaps', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.setSettings({ retention: 0.92 });
    L.introduce('l:a', { results: [true, true, true] });
    L.introduce('l:b', { results: [true, true, true] });
    const gaps = (id: string) => {
      const g: number[] = [];
      for (let i = 0; i < 3; i++) { c.set(L.card(id, 'receptive')!.due); g.push(L.review(id, 'receptive', Rating.Good).intervalDays); }
      return g;
    };
    const at92 = gaps('l:a');
    L.setSettings({ retention: 0.9 });
    c.set(day(0));
    const at90 = gaps('l:b');
    at92.forEach((g, i) => expect(g).toBeLessThan(at90[i]));
  });

  test('a lapse goes to relearning with one short step, then about a day', () => {
    const c = clock();
    const L = introduced(c);
    c.set(day(3)); L.review('l:casa', 'receptive', Rating.Good);
    c.set(day(14));
    const lapse = L.review('l:casa', 'receptive', Rating.Again);
    const card = L.card('l:casa', 'receptive')!;
    expect(card.state).toBe(State.Relearning);
    expect(card.lapses).toBe(1);
    expect(lapse.due - c.now()).toBeLessThanOrEqual(15 * 60_000);
    c.set(lapse.due);
    const back = L.review('l:casa', 'receptive', Rating.Good);
    expect(L.card('l:casa', 'receptive')!.state).toBe(State.Review);
    expect(back.intervalDays).toBeGreaterThanOrEqual(1);
    expect(back.intervalDays).toBeLessThanOrEqual(3);
  });

  test('maintenance intervals are capped by settings.maximumInterval', () => {
    const c = clock();
    const L = introduced(c);
    for (let i = 0; i < 12; i++) { c.set(L.card('l:casa', 'receptive')!.due); L.review('l:casa', 'receptive', Rating.Easy); }
    expect(L.card('l:casa', 'receptive')!.scheduled_days).toBeLessThanOrEqual(365);
  });
});

describe('graduation', () => {
  test('property: isLearned ⇔ productive stability ≥ 60 and ≥ 1 novel pass', () => {
    for (const seed of SEEDS) {
      const r = rng(seed);
      const c = clock();
      const L = introduced(c);
      c.set(day(3)); L.review('l:casa', 'receptive', Rating.Good);
      let novelPasses = 0;
      for (let i = 0; i < 25; i++) {
        const dir = r.bool(0.6) ? 'productive' : 'receptive';
        c.set(Math.max(c.now() + 3_600_000, L.card('l:casa', dir)!.due + r.int(-2, 5) * DAY));
        const g = r.pick([Rating.Again, Rating.Hard, Rating.Good, Rating.Good, Rating.Good, Rating.Easy] as Grade[]);
        const novel = r.bool(0.2);
        L.review('l:casa', dir, g, { novel });
        if (novel && g !== Rating.Again) novelPasses++;
        const ps = L.card('l:casa', 'productive')!.stability;
        expect(L.isLearned('l:casa')).toBe(ps >= LEARNED_STABILITY_DAYS && novelPasses >= 1);
      }
    }
  });

  test('a typical all-Good learner graduates in 2–3 months after 8–12 scored reviews', () => {
    const c = clock();
    const L = introduced(c);
    let reviews = 0;
    let novelDone = false;
    while (!L.isLearned('l:casa') && c.now() < day(365)) {
      const due = L.due(Number.MAX_SAFE_INTEGER).filter((d) => d.node === 'l:casa').sort((a, b) => a.due - b.due)[0];
      c.set(Math.max(due.due, c.now()));
      const novel: boolean = due.direction === 'productive' && !novelDone && L.card('l:casa', 'productive')!.reps >= 2;
      L.review('l:casa', due.direction, Rating.Good, { novel });
      novelDone ||= novel;
      reviews++;
    }
    const days = (c.now() - day(0)) / DAY;
    expect(L.isLearned('l:casa')).toBe(true);
    expect(days).toBeGreaterThanOrEqual(40);
    expect(days).toBeLessThanOrEqual(100);
    expect(reviews).toBeGreaterThanOrEqual(7);
    expect(reviews).toBeLessThanOrEqual(12);
    // Learned items stay scheduled.
    expect(L.card('l:casa', 'productive')!.due).toBeGreaterThan(c.now());
  });

  test('without a novel pass, high stability alone does not graduate', () => {
    const c = clock();
    const L = introduced(c);
    c.set(day(3)); L.review('l:casa', 'receptive', Rating.Good);
    for (let i = 0; i < 6; i++) { c.set(L.card('l:casa', 'productive')!.due); L.review('l:casa', 'productive', Rating.Good); }
    expect(L.card('l:casa', 'productive')!.stability).toBeGreaterThan(LEARNED_STABILITY_DAYS);
    expect(L.isLearned('l:casa')).toBe(false);
    c.advance(DAY); L.review('l:casa', 'productive', Rating.Again, { novel: true });
    expect(L.isLearned('l:casa')).toBe(false); // a failed recombination is not a pass
  });
});

describe('implicit sentence credit', () => {
  function threeWords(c: ReturnType<typeof clock>) {
    const L = Learner.fresh({ now: c.now });
    for (const w of ['l:a', 'l:b', 'l:c']) L.introduce(w, { results: [true, true, true] });
    c.set(day(3));
    for (const w of ['l:a', 'l:b', 'l:c']) L.review(w, 'receptive', Rating.Good);
    return L;
  }

  test('the target gets a full review; the others a bounded partial credit', () => {
    const c = clock();
    const L = threeWords(c);
    c.set(day(12));
    const before = L.card('l:b', 'receptive')!;
    const res = L.creditSentence(['l:a', 'l:b', 'l:c'], 'receptive', Rating.Good, { target: 'l:a' });
    expect(res.target?.node).toBe('l:a');
    expect(L.card('l:a', 'receptive')!.reps).toBe(3);
    const after = L.card('l:b', 'receptive')!;
    expect(after.reps).toBe(before.reps);
    expect(after.last_review).toBe(before.last_review);
    expect(after.stability).toBeGreaterThan(before.stability);
    expect(after.stability).toBeLessThanOrEqual(before.stability * 1.2 + 1e-9);
  });

  test('property: partial credit can never stretch stability past 1.5× the last full review', () => {
    for (const seed of SEEDS) {
      const r = rng(seed);
      const c = clock();
      const L = threeWords(c);
      const base = L.card('l:c', 'receptive')!.stability;
      for (let i = 0; i < 60; i++) {
        c.advance(r.int(1, 30) * 3_600_000);
        L.creditSentence(['l:a', 'l:b', 'l:c'], 'receptive', r.pick(GRADES), { target: r.pick(['l:a', 'l:b']) });
        expect(L.card('l:c', 'receptive')!.stability).toBeLessThanOrEqual(base * PARTIAL_TOTAL_CAP + 1e-9);
        expect(L.card('l:c', 'receptive')!.reps).toBe(2);
      }
    }
  });

  test('a failed sentence does not penalise the non-targets', () => {
    const c = clock();
    const L = threeWords(c);
    c.set(day(9));
    const b = L.card('l:b', 'receptive')!;
    L.creditSentence(['l:a', 'l:b'], 'receptive', Rating.Again);
    expect(L.card('l:b', 'receptive')).toEqual(b);
    expect(L.card('l:a', 'receptive')!.lapses).toBe(1);
  });

  test('at most one partial credit per node per day', () => {
    const c = clock();
    const L = threeWords(c);
    c.set(day(10, 9));
    L.creditSentence(['l:a', 'l:b'], 'receptive', Rating.Good);
    const once = L.card('l:b', 'receptive')!.stability;
    c.set(day(10, 18));
    L.creditSentence(['l:c', 'l:b'], 'receptive', Rating.Good);
    expect(L.card('l:b', 'receptive')!.stability).toBe(once);
  });
});

describe('reading exposure', () => {
  test('property: expose() never changes any card or the due list', () => {
    for (const seed of SEEDS) {
      const r = rng(seed);
      const c = clock();
      const L = Learner.fresh({ now: c.now });
      const ids = Array.from({ length: 8 }, (_, i) => `l:w${i}`);
      for (const id of ids) if (r.bool(0.7)) L.introduce(id, { results: [true, true, true] });
      c.set(day(r.int(1, 10)));
      for (const id of ids) if (L.hasCard(id, 'receptive') && r.bool()) L.review(id, 'receptive', r.pick(GRADES));
      const cards = JSON.stringify(Object.fromEntries(ids.map((id) => [id, [L.card(id, 'receptive'), L.card(id, 'productive')]])));
      const due = L.due(day(400));
      const exposures = ids.map((id) => L.node(id)?.exposures ?? 0);
      let added = ids.map(() => 0);
      for (let i = 0; i < 30; i++) {
        c.advance(r.int(0, 48) * 3_600_000);
        const chosen = ids.filter(() => r.bool(0.4));
        L.expose(chosen);
        for (const id of chosen) if (L.isIntroduced(id)) added[ids.indexOf(id)]++;
      }
      expect(JSON.stringify(Object.fromEntries(ids.map((id) => [id, [L.card(id, 'receptive'), L.card(id, 'productive')]])))).toBe(cards);
      expect(L.due(day(400))).toEqual(due);
      ids.forEach((id, i) => expect(L.node(id)?.exposures ?? 0).toBe(exposures[i] + added[i]));
      expect(ids.every((id) => !L.isIntroduced(id) || L.node(id)!.introducedAt <= day(0))).toBe(true);
    }
  });
});

describe('timing', () => {
  test('seconds per review starts at the prior and converges on measured time', () => {
    const c = clock();
    const L = introduced(c);
    expect(L.secondsPerReview()).toBe(10);
    c.set(day(3));
    for (let i = 0; i < 200; i++) L.review('l:casa', 'receptive', Rating.Good, { ms: 6000, at: day(3) + i * 1000 });
    expect(L.secondsPerReview()).toBeGreaterThan(6);
    expect(L.secondsPerReview()).toBeLessThan(6.3);
    L.review('l:casa', 'receptive', Rating.Good, { ms: 3_600_000 }); // left the tab open: clamped to 60 s
    expect(L.secondsPerReview()).toBeLessThan(6.6);
  });
});
