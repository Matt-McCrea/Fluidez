import { describe, expect, test } from 'vitest';
import {
  compact, delayedAccuracy, IdbStore, Learner, MemoryStore, migrate, productionShare, Rating, STATE_VERSION,
  type KV, type ReviewEvent,
} from '../../src/learner';
import { clock, DAY } from './helpers';

function mapKV(): KV & { map: Map<string, unknown> } {
  const map = new Map<string, unknown>();
  return {
    map,
    async get(k) { return map.has(k) ? structuredClone(map.get(k)) : undefined; },
    async set(k, v) { map.set(k, structuredClone(v)); },
    async del(k) { map.delete(k); },
  };
}

const ev = (o: Partial<ReviewEvent>): ReviewEvent => ({
  at: 0, node: 'l:a', dir: 'receptive', grade: Rating.Good, op: 'warmup', tries: 1, novel: false, session: 1, scored: 'review', ...o,
});

describe('review event log', () => {
  test('a graded review produces one event with r set', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.startSession();
    L.introduce('l:a', { results: [true, true, true] });
    expect(L.events().filter((e) => e.scored === 'review')).toHaveLength(0);
    c.advance(3 * DAY);
    L.review('l:a', 'receptive', Rating.Good, { ms: 2500, op: 'warmup', tries: 1, novel: true, sentence: 's1' });
    const rev = L.events().filter((e) => e.scored === 'review');
    expect(rev).toHaveLength(1);
    expect(rev[0]).toMatchObject({ node: 'l:a', dir: 'receptive', grade: Rating.Good, ms: 2500, op: 'warmup', tries: 1, novel: true, sentence: 's1', session: 1, at: c.now() });
    expect(rev[0].r).toBeGreaterThan(0);
    expect(rev[0].r).toBeLessThanOrEqual(1);
  });

  test('creditSentence logs one event per target and none for partial credit', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.introduce('l:a', { results: [true, true, true] });
    L.introduce('l:b', { results: [true, true, true] });
    c.advance(5 * DAY);
    L.creditSentence(['l:a', 'l:b'], 'receptive', Rating.Good, { target: 'l:a', op: 'choose', tries: 2 });
    const rev = L.events().filter((e) => e.scored === 'review');
    expect(rev.map((e) => e.node)).toEqual(['l:a']);
    expect(rev[0]).toMatchObject({ op: 'choose', tries: 2 });
  });

  test('an in-lesson step is an intro event', () => {
    const L = Learner.fresh();
    L.introduce('l:a');
    L.learningStep('l:a', true, { ms: 900 });
    L.learningStep('l:a', false);
    const evs = L.events();
    expect(evs.map((e) => e.scored)).toEqual(['intro', 'intro']);
    expect(evs.map((e) => e.grade)).toEqual([Rating.Good, Rating.Again]);
    expect(evs[0].op).toBe('learn');
  });

  test('exposure logs an event only for answered items', () => {
    const L = Learner.fresh();
    L.introduce('l:a', { results: [true, true, true] });
    const before = L.events().length;
    L.expose(['l:a']);
    expect(L.events()).toHaveLength(before);
    L.expose(['l:a', 'l:zz'], { event: { op: 'pick', direction: 'receptive', grade: Rating.Hard, tries: 2 } });
    const evs = L.events().filter((e) => e.scored === 'exposure');
    expect(L.events()).toHaveLength(before + 1);
    expect(evs).toHaveLength(1);
    expect(evs[0]).toMatchObject({ scored: 'exposure', op: 'pick', grade: Rating.Hard, tries: 2, node: 'l:a' });
  });

  test('delayedAccuracy and productionShare', () => {
    const events = [
      ev({ at: 0, scored: 'intro' }),
      ev({ at: 1 * DAY, grade: Rating.Again }),                 // too young
      ev({ at: 8 * DAY }),                                      // ok
      ev({ at: 9 * DAY, grade: Rating.Again, dir: 'productive' }),
      ev({ at: 10 * DAY, grade: Rating.Hard, dir: 'productive' }),
      ev({ at: 10 * DAY, scored: 'exposure', grade: Rating.Again }),
    ];
    expect(delayedAccuracy(events)).toBeCloseTo(2 / 3);
    expect(delayedAccuracy(events, { since: 9 * DAY })).toBeCloseTo(1 / 2);
    expect(delayedAccuracy(events, { minAgeDays: 30 })).toBeUndefined();
    expect(delayedAccuracy(events, { introducedAt: () => -20 * DAY })).toBeCloseTo(2 / 4);
    expect(productionShare(events)).toBeCloseTo(2 / 4);
    expect(productionShare(events, 9 * DAY)).toBe(1);
    expect(productionShare([])).toBeUndefined();
  });

  test('compact keeps recent events and counts the rest', () => {
    const now = 500 * DAY;
    const log = { events: [ev({ at: 10 * DAY }), ev({ at: 20 * DAY, dir: 'productive' }), ev({ at: 480 * DAY })], summary: { upTo: 0, counts: {} } };
    const out = compact(log, 365, now);
    expect(out.events).toHaveLength(1);
    expect(out.summary.counts['l:a']).toEqual({ receptive: 1, productive: 1 });
    expect(compact(out, 365, now + 400 * DAY).summary.counts['l:a']).toEqual({ receptive: 2, productive: 1 });
  });

  test('persistence round-trip through the stores', async () => {
    for (const mk of [() => new MemoryStore(), () => new IdbStore(mapKV())]) {
      const store = mk();
      const c = clock();
      const L = await Learner.open(store, { now: c.now });
      L.introduce('l:a', { results: [true, true, true] });
      c.advance(4 * DAY);
      L.review('l:a', 'receptive', Rating.Good, { op: 'warmup' });
      await L.flush();
      const M = await Learner.open(store, { now: c.now });
      expect(M.events()).toEqual(L.events());
      expect(M.events().length).toBe(4);
      expect(JSON.stringify(M.toJSON())).not.toContain('"events"');
    }
    const kv = mapKV();
    const L = await Learner.open(new IdbStore(kv));
    L.introduce('l:a');
    L.learningStep('l:a', true);
    await L.flush();
    expect(kv.map.has('events')).toBe(true);
  });

  test('a version-1 state still loads', async () => {
    const v1 = { ...Learner.fresh().toJSON(), version: 1 };
    expect(migrate(v1).version).toBe(STATE_VERSION);
    const store = new MemoryStore(v1);
    const L = await Learner.open(store);
    expect(L.toJSON().version).toBe(STATE_VERSION);
    expect(L.events()).toEqual([]);
  });
});
