// The 29 Oct rules on the learner side: the production-card policy,
// multi-target sentence reviews, recognition-only maintenance and the
// ledger's review-context reuse.
import { describe, expect, test } from 'vitest';
import {
  Learner, Rating, LEARNED_STABILITY_DAYS, MAINTENANCE_MAX_INTERVAL_DAYS, productivePolicy, type Grade,
} from '../../src/learner';
import { clock, day, DAY, rng, SEEDS } from './helpers';

const GRADES: Grade[] = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy];

describe('production-card policy', () => {
  test('grammar, pattern, chunk, contrast always productive; lexemes by frequency, else by band', () => {
    for (const kind of ['grammar', 'pattern', 'chunk', 'contrast'] as const) {
      for (const band of ['A1', 'B2', 'C1'] as const) expect(productivePolicy({ kind, band, freqRank: 9000 })).toBe(true);
    }
    expect(productivePolicy({ kind: 'lexeme', band: 'C1', freqRank: 3000 })).toBe(true);
    expect(productivePolicy({ kind: 'lexeme', band: 'A1', freqRank: 3001 })).toBe(false);
    for (const band of ['A1', 'A2', 'B1'] as const) expect(productivePolicy({ kind: 'lexeme', band })).toBe(true);
    for (const band of ['B2', 'C1'] as const) expect(productivePolicy({ kind: 'lexeme', band })).toBe(false);
    expect(productivePolicy({ kind: 'cando', band: 'A1' })).toBe(false);
  });

  test('property: a receptive-only node never gets a production card; a productive one still unlocks as before', () => {
    for (const seed of SEEDS) {
      const r = rng(seed);
      const c = clock(day(0, 9));
      const L = Learner.fresh({ now: c.now });
      L.introduce('l:raro', { results: [true, true, true], productive: false });
      L.introduce('l:casa', { results: [true, true, true] });
      expect(L.hasProductiveTrack('l:raro')).toBe(false);
      expect(L.hasProductiveTrack('l:casa')).toBe(true);
      for (let i = 0; i < 15; i++) {
        c.advance(r.int(1, 20) * DAY);
        const g = r.pick(GRADES);
        expect(L.review('l:raro', 'receptive', g).unlockedProductive).toBe(false);
        L.review('l:casa', 'receptive', g);
        expect(L.isProductiveUnlocked('l:raro')).toBe(false);
        expect(L.due(c.now() + 400 * DAY).some((d) => d.node === 'l:raro' && d.direction === 'productive')).toBe(false);
      }
      expect(L.isProductiveUnlocked('l:casa')).toBe(true);
    }
  });

  test('the flag is decided once: re-introducing does not change it, and it survives JSON', () => {
    const L = Learner.fresh({ now: clock().now });
    L.introduce('l:raro', { results: [true, true, true], productive: false });
    L.introduce('l:raro', { productive: true });
    expect(L.hasProductiveTrack('l:raro')).toBe(false);
    expect(Learner.fromJSON(JSON.parse(JSON.stringify(L.toJSON()))).hasProductiveTrack('l:raro')).toBe(false);
    // older documents without the flag: productive
    const doc = L.toJSON();
    delete doc.nodes['l:raro'].productiveTrack;
    expect(Learner.fromJSON(doc).hasProductiveTrack('l:raro')).toBe(true);
  });
});

describe('multi-target sentence reviews', () => {
  function words(c: ReturnType<typeof clock>, ids = ['l:a', 'l:b', 'l:c', 'l:d']) {
    const L = Learner.fresh({ now: c.now });
    for (const w of ids) L.introduce(w, { results: [true, true, true] });
    c.set(day(3));
    for (const w of ids) L.review(w, 'receptive', Rating.Good);
    return L;
  }

  test('every target gets a full review with its own grade; non-targets get partial credit when all passed', () => {
    const c = clock();
    const L = words(c);
    c.set(day(14));
    const before = { b: L.card('l:b', 'receptive')!, d: L.card('l:d', 'receptive')! };
    const res = L.creditSentence(['l:a', 'l:b', 'l:c', 'l:d'], 'receptive', Rating.Good, {
      targets: ['l:a', 'l:b', 'l:c'], grades: { 'l:c': Rating.Easy }, novel: true, ms: 9000,
    });
    expect(res.targets.map((t) => t.node)).toEqual(['l:a', 'l:b', 'l:c']);
    expect(res.target?.node).toBe('l:a');
    expect(res.targets.map((t) => t.grade)).toEqual([Rating.Good, Rating.Good, Rating.Easy]);
    for (const id of ['l:a', 'l:b', 'l:c']) {
      expect(L.card(id, 'receptive')!.reps).toBe(3);
      expect(L.node(id)!.novelPasses).toBe(1);
    }
    expect(L.card('l:b', 'receptive')!.last_review).toBe(c.now());
    expect(L.card('l:b', 'receptive')!.last_review).not.toBe(before.b.last_review);
    // the non-target: partial credit only
    const d = L.card('l:d', 'receptive')!;
    expect(d.reps).toBe(before.d.reps);
    expect(d.last_review).toBe(before.d.last_review);
    expect(d.stability).toBeGreaterThan(before.d.stability);
    // the item was answered once: one timing sample
    expect(L.toJSON().timing.receptive.count).toBe(1);
  });

  test('one failed target: it lapses, the others still pass, and no non-target gets partial credit', () => {
    const c = clock();
    const L = words(c);
    c.set(day(14));
    const d = L.card('l:d', 'receptive')!;
    L.creditSentence(['l:a', 'l:b', 'l:d'], 'receptive', Rating.Good, { targets: ['l:a', 'l:b'], grades: { 'l:b': Rating.Again } });
    expect(L.card('l:b', 'receptive')!.lapses).toBe(1);
    expect(L.card('l:a', 'receptive')!.lapses).toBe(0);
    expect(L.card('l:a', 'receptive')!.reps).toBe(3);
    expect(L.card('l:d', 'receptive')).toEqual(d);
  });

  test('targets without a card in that direction are skipped, never created', () => {
    const c = clock();
    const L = words(c);
    c.set(day(14));
    const res = L.creditSentence(['l:a', 'l:x'], 'productive', Rating.Good, { targets: ['l:x', 'l:a'] });
    expect(res.targets.map((t) => t.node)).toEqual(['l:a']);
    expect(L.isIntroduced('l:x')).toBe(false);
  });
});

describe('recognition-only maintenance', () => {
  /** Drive l:casa to learned with all-Good answers (one novel productive pass). */
  function graduate(L: Learner, c: ReturnType<typeof clock>) {
    let novelDone = false;
    while (!L.isLearned('l:casa') && c.now() < day(400)) {
      const due = L.due(Number.MAX_SAFE_INTEGER).filter((d) => d.node === 'l:casa').sort((a, b) => a.due - b.due)[0];
      c.set(Math.max(due.due, c.now()));
      const novel: boolean = due.direction === 'productive' && !novelDone;
      L.review('l:casa', due.direction, Rating.Good, { novel });
      novelDone ||= novel;
    }
  }

  test('once learned, the receptive card is suspended: never due, no partial credit, kept in state', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.introduce('l:casa', { results: [true, true, true] });
    L.introduce('l:mesa', { results: [true, true, true] });
    expect(L.isSuspended('l:casa', 'receptive')).toBe(false);
    graduate(L, c);
    expect(L.isLearned('l:casa')).toBe(true);
    expect(L.isSuspended('l:casa', 'receptive')).toBe(true);
    expect(L.card('l:casa', 'receptive')).toBeDefined();
    expect(L.due(Number.MAX_SAFE_INTEGER).filter((d) => d.node === 'l:casa').map((d) => d.direction)).toEqual(['productive']);
    const rec = L.card('l:casa', 'receptive')!;
    c.advance(30 * DAY);
    if (L.hasCard('l:mesa', 'receptive')) L.creditSentence(['l:mesa', 'l:casa'], 'receptive', Rating.Good, { target: 'l:mesa' });
    expect(L.card('l:casa', 'receptive')).toEqual(rec);
    // stays suspended across a productive lapse (the productive card relearns)
    c.set(L.card('l:casa', 'productive')!.due);
    L.review('l:casa', 'productive', Rating.Again);
    expect(L.isSuspended('l:casa', 'receptive')).toBe(true);
  });

  test('the learned productive card may grow to 365 d even when settings cap other cards lower', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.setSettings({ maximumInterval: 120 });
    L.introduce('l:casa', { results: [true, true, true] });
    L.introduce('l:otro', { results: [true, true, true] });
    graduate(L, c);
    expect(L.card('l:casa', 'productive')!.stability).toBeGreaterThanOrEqual(LEARNED_STABILITY_DAYS);
    let maxProd = 0;
    for (let i = 0; i < 12; i++) {
      c.set(L.card('l:casa', 'productive')!.due);
      maxProd = Math.max(maxProd, L.review('l:casa', 'productive', Rating.Easy).intervalDays);
    }
    expect(maxProd).toBeGreaterThan(120);
    expect(maxProd).toBeLessThanOrEqual(MAINTENANCE_MAX_INTERVAL_DAYS);
    // an unlearned card keeps the settings cap
    let maxOther = 0;
    for (let i = 0; i < 12; i++) {
      c.set(Math.max(c.now(), L.card('l:otro', 'receptive')!.due));
      maxOther = Math.max(maxOther, L.review('l:otro', 'receptive', Rating.Easy).intervalDays);
    }
    expect(L.isLearned('l:otro')).toBe(false);
    expect(maxOther).toBeLessThanOrEqual(120);
  });

  test('a receptive-only node is learned on its receptive card and is never suspended', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.introduce('l:raro', { results: [true, true, true], productive: false });
    for (let i = 0; i < 8 && !L.isLearned('l:raro'); i++) {
      c.set(L.card('l:raro', 'receptive')!.due);
      L.review('l:raro', 'receptive', Rating.Good, { novel: i === 1 });
    }
    expect(L.isLearned('l:raro')).toBe(true);
    expect(L.card('l:raro', 'receptive')!.stability).toBeGreaterThanOrEqual(LEARNED_STABILITY_DAYS);
    expect(L.isSuspended('l:raro', 'receptive')).toBe(false);
    expect(L.due(Number.MAX_SAFE_INTEGER).some((d) => d.node === 'l:raro')).toBe(true);
  });
});

describe('ledger: review-context reuse', () => {
  test('reusable only if every showing was a review context, the last ≥ minDays ago', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.ledger.markSeen('sentence', 's1', { review: true });
    L.ledger.markSeen('sentence', 's2');                       // an example / drill use
    L.ledger.markSeen('sentence', 's3', { review: true });
    expect(L.ledger.reviewReusable('s1', c.now() + 119 * DAY, 120)).toBe(false);
    expect(L.ledger.reviewReusable('s1', c.now() + 120 * DAY, 120)).toBe(true);
    expect(L.ledger.reviewReusable('s2', c.now() + 500 * DAY, 120)).toBe(false);
    expect(L.ledger.reviewReusable('never', c.now() + 500 * DAY, 120)).toBe(false);
    // a reuse is deliberate and labelled: not an unintended repeat, and it restarts the clock
    c.advance(130 * DAY);
    L.ledger.markSeen('sentence', 's3', { review: true, deliberate: true, reason: 'review-context-120d' });
    expect(L.ledger.views('sentence', 's3')[1]).toMatchObject({ deliberate: true, review: true, reason: 'review-context-120d' });
    expect(L.ledger.unintendedRepeats('sentence')).toBe(0);
    expect(L.ledger.reviewReusable('s3', c.now() + 60 * DAY, 120)).toBe(false);
    // an unlabelled re-show still counts
    L.ledger.markSeen('sentence', 's1', { review: true });
    expect(L.ledger.unintendedRepeats('sentence')).toBe(1);
  });
});
