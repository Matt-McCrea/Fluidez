import { describe, expect, test } from 'vitest';
import {
  IdbStore, Learner, LEDGER_KINDS, MemoryStore, migrate, Rating, STATE_VERSION,
  type KV, type LedgerKind, type Grade,
} from '../../src/learner';
import { clock, day, DAY, rng, SEEDS } from './helpers';

/** A Map-backed KV that structured-clones like IndexedDB. */
function mapKV(): KV & { map: Map<string, unknown> } {
  const map = new Map<string, unknown>();
  return {
    map,
    async get(k) { return map.has(k) ? structuredClone(map.get(k)) : undefined; },
    async set(k, v) { map.set(k, structuredClone(v)); },
    async del(k) { map.delete(k); },
  };
}

/** Drive a learner through a random but legal history. */
function randomHistory(L: Learner, c: ReturnType<typeof clock>, seed: number) {
  const r = rng(seed);
  const ids = Array.from({ length: 10 }, (_, i) => `${r.pick(['l', 'g', 'c', 'p'])}:n${i}`);
  for (let t = 0; t < 80; t++) {
    c.advance(r.int(0, 30) * 3_600_000);
    const id = r.pick(ids);
    const op = r.int(0, 6);
    if (op === 0 && !L.isIntroduced(id)) L.introduce(id, { results: [r.bool(0.8), true, true] });
    else if (op === 1 && L.hasCard(id, 'receptive')) L.review(id, 'receptive', r.pick([1, 2, 3, 3, 4]) as Grade, { ms: r.int(1000, 20000), novel: r.bool(0.1) });
    else if (op === 2 && L.hasCard(id, 'productive')) L.review(id, 'productive', r.pick([1, 3, 3, 4]) as Grade, { ms: r.int(1000, 20000), novel: r.bool(0.2) });
    else if (op === 3) L.creditSentence(ids.filter(() => r.bool(0.3)), r.pick(['receptive', 'productive'] as const), r.pick([1, 3, 4]) as Grade);
    else if (op === 4) L.expose(ids.filter(() => r.bool(0.3)));
    else if (op === 5) L.ledger.markSeen(r.pick(LEDGER_KINDS), `id${r.int(0, 40)}`, { deliberate: r.bool(0.1) });
    else L.startSession();
  }
}

describe('exposure ledger', () => {
  test('property: never loses an entry across saves, reloads and JSON round-trips', async () => {
    for (const seed of SEEDS.slice(0, 15)) {
      const r = rng(seed);
      const c = clock();
      let store = new MemoryStore();
      let L = await Learner.open(store, { now: c.now });
      const expected = new Map<string, number>(); // `${kind}|${id}` -> views
      for (let i = 0; i < 150; i++) {
        c.advance(r.int(1, 600) * 60_000);
        const kind = r.pick(LEDGER_KINDS);
        const id = `${kind}-${r.int(0, 60)}`;
        L.ledger.markSeen(kind, id, { deliberate: r.bool(0.1) });
        expected.set(`${kind}|${id}`, (expected.get(`${kind}|${id}`) ?? 0) + 1);
        if (r.bool(0.1)) { await L.flush(); L = await Learner.open(store, { now: c.now }); }
        if (r.bool(0.05)) { // export → import into a fresh store
          store = new MemoryStore(JSON.parse(JSON.stringify(L.toJSON())));
          L = await Learner.open(store, { now: c.now });
        }
      }
      for (const [k, n] of expected) {
        const [kind, id] = k.split('|') as [LedgerKind, string];
        expect(L.ledger.hasSeen(kind, id)).toBe(true);
        expect(L.ledger.views(kind, id).length).toBe(n);
      }
      const total = LEDGER_KINDS.reduce((a, k) => a + L.ledger.count(k), 0);
      expect(total).toBe(expected.size);
    }
  });

  test('unseen / lastSeen / deliberate flags', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.ledger.markSeen('chapter', 'ch001');
    c.advance(DAY);
    L.ledger.markSeen('sentence', 'u01-3');
    c.advance(14 * DAY);
    L.ledger.markSeen('chapter', 'ch001', { deliberate: true });
    expect(L.ledger.unseen('chapter', ['ch001', 'ch002', 'ch003'])).toEqual(['ch002', 'ch003']);
    expect(L.ledger.unseen('sentence', ['u01-3', 'u01-4'])).toEqual(['u01-4']);
    expect(L.ledger.lastSeen('chapter', 'ch001')!.getTime()).toBe(c.now());
    expect(L.ledger.firstSeen('chapter', 'ch001')!.getTime()).toBe(day(0));
    expect(L.ledger.lastSeen('scene', 'nope')).toBeUndefined();
    expect(L.ledger.hasSeen('item', 'ch001')).toBe(false); // kinds are separate namespaces
    expect(L.ledger.unintendedRepeats('chapter')).toBe(0);
    L.ledger.markSeen('chapter', 'ch001');
    expect(L.ledger.unintendedRepeats('chapter')).toBe(1);
    expect(L.ledger.seenBetween('sentence', day(0), day(2))).toEqual(['u01-3']);
  });
});

describe('serialisation', () => {
  test('property: JSON round-trip preserves state and future behaviour', () => {
    for (const seed of SEEDS) {
      const c = clock();
      const L = Learner.fresh({ now: c.now });
      randomHistory(L, c, seed);
      const json = JSON.parse(JSON.stringify(L.toJSON()));
      const M = Learner.fromJSON(json, { now: c.now });
      expect(M.toJSON()).toEqual(L.toJSON());
      // Same next step from both.
      c.advance(5 * DAY);
      for (const d of L.due()) {
        const a = L.review(d.node, d.direction, Rating.Good);
        const b = M.review(d.node, d.direction, Rating.Good);
        expect(b).toEqual(a);
      }
      expect(M.secondsPerReview()).toBe(L.secondsPerReview());
      expect(M.nodes().map((n) => M.isLearned(n))).toEqual(L.nodes().map((n) => L.isLearned(n)));
    }
  });

  test('IdbStore round-trips through a structured-clone KV and keeps a backup', async () => {
    const kv = mapKV();
    const c = clock();
    const L = await Learner.open(new IdbStore(kv), { now: c.now });
    randomHistory(L, c, 42);
    L.setSettings({ tier: 'extended', minutes: 35 });
    await L.flush();
    const M = await Learner.open(new IdbStore(kv), { now: c.now });
    expect(M.toJSON()).toEqual(L.toJSON());
    expect(M.settings.minutes).toBe(35);
    expect(kv.map.has('state.prev')).toBe(true);
    kv.map.delete('state'); // a torn write falls back to the previous document
    const N = await Learner.open(new IdbStore(kv), { now: c.now });
    expect(N.toJSON().version).toBe(STATE_VERSION);
  });

  test('saves are coalesced and flush() writes the latest state', async () => {
    const store = new MemoryStore();
    const c = clock();
    const L = await Learner.open(store, { now: c.now });
    const before = store.saves;
    for (let i = 0; i < 50; i++) L.ledger.markSeen('item', `x${i}`);
    await L.flush();
    expect(store.saves - before).toBeLessThanOrEqual(2);
    expect((store.snapshot() as any).ledger.item.x49).toBeDefined();
  });

  test('migration: an unversioned (v0) document upgrades without losing data', async () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    randomHistory(L, c, 7);
    const v0: any = L.toJSON();
    delete v0.version;
    delete v0.timing;
    const store = new MemoryStore(v0);
    const M = await Learner.open(store, { now: c.now });
    expect(M.toJSON().version).toBe(STATE_VERSION);
    expect(M.toJSON().ledger).toEqual(L.toJSON().ledger);
    expect(M.toJSON().nodes).toEqual(L.toJSON().nodes);
    expect((store.snapshot() as any).version).toBe(STATE_VERSION); // migrated doc was persisted
    expect(() => migrate({ ...L.toJSON(), version: STATE_VERSION + 1 })).toThrow(/newer/);
  });

  test('session index and settings persist', async () => {
    const store = new MemoryStore();
    const c = clock();
    const L = await Learner.open(store, { now: c.now });
    L.startSession(); c.advance(DAY); L.startSession();
    L.setSettings({ tier: 'minimum', minutes: 10, retention: 0.92 });
    await L.flush();
    const M = await Learner.open(store, { now: c.now });
    expect(M.sessionIndex).toBe(2);
    expect(M.settings).toMatchObject({ tier: 'minimum', minutes: 10, retention: 0.92 });
    expect(() => M.setSettings({ retention: 1.5 })).toThrow();
  });
});

describe('saveAll is one transaction', () => {
  /** A KV whose setMany is atomic (stages, then commits) and can be told to fail on a key. */
  function txKV(failKey?: string) {
    const kv = mapKV();
    return Object.assign(kv, {
      async setMany(entries: [string, unknown][]) {
        const staged = new Map(kv.map);
        for (const [k, v] of entries) {
          if (k === failKey) throw new Error('write failed');
          staged.set(k, structuredClone(v));
        }
        kv.map.clear();
        for (const [k, v] of staged) kv.map.set(k, v);
      },
    });
  }
  const state = (n: number) => { const s = Learner.fresh().toJSON(); s.session.index = n; return s; };

  test('writes every provided document', async () => {
    const kv = txKV();
    await new IdbStore(kv).saveAll({ state: state(4), events: { events: [], summary: { upTo: 0, counts: {} } }, path: { p: 1 }, ui: { u: 1 } });
    expect([...kv.map.keys()].sort()).toEqual(['events', 'path', 'state', 'ui']);
  });

  test('a failing later write leaves the earlier keys untouched', async () => {
    const kv = txKV('ui');
    const store = new IdbStore(kv);
    await store.saveAll({ state: state(1), path: { p: 'old' } });
    await expect(store.saveAll({ state: state(2), path: { p: 'new' }, ui: { u: 1 } })).rejects.toThrow();
    expect((kv.map.get('state') as any).session.index).toBe(1);
    expect(kv.map.get('path')).toEqual({ p: 'old' });
    expect(kv.map.has('ui')).toBe(false);
  });

  test('Learner.commit failure keeps the learner dirty so a later flush retries', async () => {
    const kv = txKV('ui');
    const store = new IdbStore(kv);
    const L = await Learner.open(store);
    L.startSession();
    await expect(L.commit({ path: { p: 1 }, ui: { u: 1 } })).rejects.toThrow();
    expect(kv.map.has('path')).toBe(false);
    await L.flush();
    expect((kv.map.get('state') as any).session.index).toBe(1);
  });

  test('MemoryStore implements saveAll', async () => {
    const m = new MemoryStore();
    await m.saveAll({ state: state(3), path: { p: 1 } });
    expect((m.snapshot() as any).session.index).toBe(3);
    expect(m.extras.get('path')).toEqual({ p: 1 });
  });
});
