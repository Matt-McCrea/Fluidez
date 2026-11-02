// What happens to a learner whose saved documents are newer than this build, or
// damaged. Before: Learner.open threw the raw "learner state v3 is newer than
// this build (v2)" into a screen whose only button was "Try again", a damaged
// state never tried its one-step backup, a damaged event log was cast without a
// look, and a migration overwrote the only copy of the old document.
import { afterEach, describe, expect, test, vi } from 'vitest';
import { initialPath } from '../../src/compiler';
import {
  EVENTS_VERSION, IdbStore, Learner, MemoryStore, migrate, NEWER_DOCUMENT, Rating, State, STATE_VERSION, StoredDocumentError, UNREADABLE_DOCUMENT,
  type LearnerState,
} from '../../src/learner';
import { provenBackup } from '../../src/learner/backup';
import { BACKUP_READERS, emptyUi, MemoryKV, migratePath, migrateUi, PATH_KEY, UI_KEY, UI_VERSION, UiStore } from '../../src/ui/store/ui';
import { clock } from './helpers';

afterEach(() => { vi.restoreAllMocks(); });

const state = (patch: Record<string, unknown> = {}) => ({ ...Learner.fresh({ now: clock().now }).toJSON(), ...patch });
/** a state with one node, so that "which copy was used" is visible */
const withNode = (id: string) => {
  const L = Learner.fresh({ now: clock().now });
  L.introduce(id);
  return L.toJSON();
};
const fault = async (p: Promise<unknown>) => { const e = await p.then(() => undefined, (x) => x); expect(e).toBeInstanceOf(StoredDocumentError); return e as StoredDocumentError; };

/** a KV that remembers the order of its writes */
class LoggedKV extends MemoryKV {
  writes: string[] = [];
  override async set(k: string, v: unknown) { this.writes.push(k); await super.set(k, v); }
  override async setMany(e: [string, unknown][]) { for (const [k] of e) this.writes.push(k); await super.setMany(e); }
}

describe('a state a newer build wrote', () => {
  const newer = { ...state(), version: STATE_VERSION + 1, fromTheFuture: { keep: 'me' } };

  test('is refused in words a learner can read, and left exactly as it was', async () => {
    const kv = new LoggedKV();
    await kv.set('state', newer);
    await kv.set('state.prev', withNode('l:good'));
    await kv.set('events', { events: [], summary: { upTo: 0, counts: {} } });
    kv.writes = [];
    const e = await fault(Learner.open(new IdbStore(kv)));
    expect(e.fault).toBe('newer');
    expect(e.message).toBe(NEWER_DOCUMENT);
    expect(e.message).toMatch(/newer version of Fluidez/);
    expect(e.message).not.toMatch(/[–—]| - /);
    expect(kv.data.get('state')).toEqual(newer);
    expect(kv.writes).toEqual([]);
  });

  test('does not fall back to the older copy beside it, which would be saved over it', async () => {
    const kv = new MemoryKV();
    await kv.set('state', newer);
    await kv.set('state.prev', withNode('l:good'));
    await expect(Learner.open(new IdbStore(kv))).rejects.toMatchObject({ fault: 'newer' });
    expect(kv.data.has('state.quarantine')).toBe(false);
    expect((kv.data.get('state.prev') as LearnerState).nodes['l:good']).toBeDefined();
  });

  test('migrate says the same thing', async () => {
    const { migrate } = await import('../../src/learner');
    expect(() => migrate(newer)).toThrow(/newer/);
  });

  test('a newer event log is refused too, and not written over', async () => {
    const kv = new LoggedKV();
    await kv.set('state', state());
    const future = { version: EVENTS_VERSION + 1, events: [], summary: { upTo: 0, counts: {} }, extra: 1 };
    await kv.set('events', future);
    kv.writes = [];
    expect((await fault(Learner.open(new IdbStore(kv)))).fault).toBe('newer');
    expect(kv.data.get('events')).toEqual(future);
    expect(kv.writes).toEqual([]);
  });

  test('newer ui and path documents say it in the same words', async () => {
    const kv = new MemoryKV();
    await kv.set(UI_KEY, { ...emptyUi('future'), version: 99 });
    expect((await fault(new UiStore(kv).load())).message).toBe(NEWER_DOCUMENT);
    const kv2 = new MemoryKV();
    await kv2.set(PATH_KEY, { ...initialPath(), version: 99 });
    expect((await fault(new UiStore(kv2).load())).fault).toBe('newer');
    expect((await kv2.get(PATH_KEY) as { version: number }).version).toBe(99);
  });
});

describe('a state that is damaged', () => {
  test('falls back to the copy from before the last save, keeps the damaged one aside, and heals the store', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const kv = new MemoryKV();
    const damaged = { ...state(), nodes: 'oops' };
    await kv.set('state', damaged);
    await kv.set('state.prev', withNode('l:good'));
    const L = await Learner.open(new IdbStore(kv));
    expect(L.nodes()).toEqual(['l:good']);
    expect(kv.data.get('state.quarantine')).toEqual(damaged);
    expect(Object.keys((kv.data.get('state') as LearnerState).nodes)).toEqual(['l:good']);
  });

  test('a card with no due date is damage, not something to schedule', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const bad = withNode('l:a');
    bad.nodes['l:a'].receptive = { stability: 3 } as never;
    const kv = new MemoryKV();
    await kv.set('state', bad);
    await kv.set('state.prev', withNode('l:good'));
    expect((await Learner.open(new IdbStore(kv))).nodes()).toEqual(['l:good']);
  });

  test('with no usable copy it says so, and deletes nothing', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const kv = new MemoryKV();
    const damaged = { ...state(), session: 'x' };
    await kv.set('state', damaged);
    await kv.set('state.prev', 'also damaged');
    const e = await fault(Learner.open(new IdbStore(kv)));
    expect(e.fault).toBe('unreadable');
    expect(e.message).toBe(UNREADABLE_DOCUMENT);
    expect(e.message).not.toMatch(/[–—]| - /);
    expect(kv.data.get('state')).toEqual(damaged);
    expect(kv.data.get('state.prev')).toBe('also damaged');
    expect(kv.data.get('state.quarantine')).toEqual(damaged);
  });

  test('something that is not a document at all is unreadable', async () => {
    for (const junk of ['text', 42, [1, 2], null]) {
      if (junk === null) continue; // an absent document is a fresh start, not damage
      const kv = new MemoryKV();
      await kv.set('state', junk);
      expect((await fault(Learner.open(new IdbStore(kv)))).fault).toBe('unreadable');
    }
  });

});

// Before: a bad value in one card was in the state and in its one-step backup
// (a value a bug writes stays in every later save), so boot refused the whole
// learner, for good: no fallback, no Start over, and a backup of it would be
// refused too. Each of these documents opened before the guard was added.
describe('damage that reached every copy', () => {
  const twoCards = () => {
    const L = Learner.fresh({ now: clock().now });
    L.introduce('l:bad', { results: [true, true, true] });
    L.introduce('l:good', { results: [true, true, true] });
    L.startSession();
    return L.toJSON();
  };
  const spoiled = () => { const s = twoCards(); s.nodes['l:bad'].receptive!.stability = Number.NaN; return s; };
  const kvWith = async (state: unknown, prev?: unknown) => {
    const kv = new MemoryKV();
    await kv.set('state', state);
    if (prev !== undefined) await kv.set('state.prev', prev);
    return kv;
  };

  test('costs the damaged card, not the learner', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const kv = await kvWith(spoiled(), spoiled());
    const L = await Learner.open(new IdbStore(kv));
    expect(L.sessionIndex).toBe(1);
    expect(L.nodes().sort()).toEqual(['l:bad', 'l:good']);
    expect(L.card('l:good', 'receptive')).toEqual(twoCards().nodes['l:good'].receptive);
    expect(L.card('l:bad', 'receptive')).toMatchObject({ state: State.New, reps: 0, stability: 0 });
  });

  test('the card that started again can be reviewed', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const L = await Learner.open(new IdbStore(await kvWith(spoiled(), spoiled())));
    const at = Date.now();
    expect(L.due(at).map((d) => d.node)).toContain('l:bad');
    expect(L.review('l:bad', 'receptive', Rating.Good, { at }).stability).toBeGreaterThan(0);
  });

  test('the damaged document is kept aside, and the store is clean afterwards', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const kv = await kvWith(spoiled(), spoiled());
    await Learner.open(new IdbStore(kv));
    expect((kv.data.get('state.quarantine') as LearnerState).nodes['l:bad'].receptive!.stability).toBeNaN();
    expect(() => migrate(kv.data.get('state'))).not.toThrow();
  });

  test('a clean copy is still preferred: the card is worth more than the last save', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const L = await Learner.open(new IdbStore(await kvWith(spoiled(), twoCards())));
    expect(L.card('l:bad', 'receptive')!.state).toBe(State.Review);
  });

  test('a damaged state with a salvageable copy beside it opens from the copy', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const L = await Learner.open(new IdbStore(await kvWith({ ...state(), nodes: 'gone' }, spoiled())));
    expect(L.nodes().sort()).toEqual(['l:bad', 'l:good']);
  });

  test('a suspended card stays suspended, a null card starts again, and something that is not a node goes', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const s = spoiled() as any;
    s.nodes['l:bad'].receptive.suspended = true;
    s.nodes['l:good'].productive = null;
    s.nodes['l:junk'] = 'not a node';
    const L = await Learner.open(new IdbStore(await kvWith(s)));
    expect(L.isSuspended('l:bad', 'receptive')).toBe(true);
    expect(L.card('l:good', 'productive')!.state).toBe(State.New);
    expect(L.nodes()).not.toContain('l:junk');
  });

  test('a newer copy beside a damaged state is still refused, and written over by nothing', async () => {
    const kv = await kvWith(spoiled(), { ...state(), version: STATE_VERSION + 1 });
    expect((await fault(Learner.open(new IdbStore(kv)))).fault).toBe('newer');
    expect((kv.data.get('state') as LearnerState).nodes['l:bad'].receptive!.stability).toBeNaN();
  });

  test('what is left can be backed up, so the learner is never stranded with a file that will not restore', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const kv = await kvWith(spoiled(), spoiled());
    const store = new IdbStore(kv);
    await Learner.open(store);
    await new UiStore(kv).load();
    await expect(provenBackup(store, BACKUP_READERS)).resolves.toBeTruthy();
  });
});

describe('damaged ui and path documents', () => {
  test('a list or table that is the wrong shape starts empty, the rest is kept, and the damaged copy is aside', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const kv = new MemoryKV();
    const base = emptyUi('mine');
    const damaged = { ...base, onboarded: true, saved: 'nope', bests: null, canDos: [{ unit: 'u1', canDo: 'x', feel: 'yes', at: 1 }], stats: { ...base.stats, sessions: 40, days: 'nope' } };
    await kv.set(UI_KEY, damaged);
    const ui = await new UiStore(kv).load();
    expect(ui.state).toMatchObject({ learnerId: 'mine', onboarded: true, saved: [], bests: {}, canDos: damaged.canDos, stats: { sessions: 40, days: [] } });
    expect(await kv.get(`${UI_KEY}.quarantine`)).toEqual(damaged);
    expect(() => migrateUi(kv.data.get(UI_KEY))).not.toThrow();
  });

  test('a path keeps its position when a list in it is damaged', async () => {
    const kv = new MemoryKV();
    const damaged = { ...initialPath(), unit: 7, day: 2, coreSessions: 90, log: 'nope' };
    await kv.set(PATH_KEY, damaged);
    const ui = await new UiStore(kv).load();
    expect(ui.path).toMatchObject({ unit: 7, day: 2, coreSessions: 90, log: [] });
    expect(await kv.get(`${PATH_KEY}.quarantine`)).toEqual(damaged);
    expect(() => migratePath(kv.data.get(PATH_KEY))).not.toThrow();
  });

  test('a path with no position is refused: a learner is told, not silently sent back to the start', async () => {
    const kv = new MemoryKV();
    const damaged = { ...initialPath(), unit: 'nope' };
    await kv.set(PATH_KEY, damaged);
    const e = await fault(new UiStore(kv).load());
    expect(e.fault).toBe('unreadable');
    expect(e.message).toBe(UNREADABLE_DOCUMENT);
    expect(kv.data.get(PATH_KEY)).toEqual(damaged);
    expect(await kv.get(`${PATH_KEY}.quarantine`)).toEqual(damaged);
  });

  test('something that is not a ui document is refused, not taken for a new learner', async () => {
    const kv = new MemoryKV();
    await kv.set(UI_KEY, 'nope');
    expect((await fault(new UiStore(kv).load())).fault).toBe('unreadable');
    expect(kv.data.get(UI_KEY)).toBe('nope');
    expect(await kv.get(`${UI_KEY}.quarantine`)).toBe('nope');
  });
});

describe('a store that refuses the writes boot makes', () => {
  class Refusing extends MemoryKV {
    refuse = false;
    override async set(k: string, v: unknown) { if (this.refuse) throw new Error('quota'); await super.set(k, v); }
  }

  test('does not keep a readable learner out: the ui store opens, and the next save writes the migrated document', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const kv = new Refusing();
    await kv.set(UI_KEY, { ...emptyUi('mine'), version: UI_VERSION - 1 });
    kv.refuse = true;
    const ui = await new UiStore(kv).load();
    expect(ui.state).toMatchObject({ learnerId: 'mine', version: UI_VERSION });
    kv.refuse = false;
    await ui.update((s) => { s.onboarded = true; });
    expect((kv.data.get(UI_KEY) as { version: number }).version).toBe(UI_VERSION);
  });

  test('a repair of the path that is refused does not stop the boot either', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const kv = new Refusing();
    await kv.set(PATH_KEY, { ...initialPath(), log: [{ learnerSession: 9, type: 'review', advanced: true }] });
    const ui = await new UiStore(kv).load();
    kv.refuse = true;
    await expect(ui.reconcile(1)).resolves.toBe(true);
    expect(ui.path.log).toEqual([]);
  });
});

describe('an event log', () => {
  const ev = (node: string) => ({ at: 1_790_000_000_000, node, dir: 'receptive', grade: 3, op: 'warmup', tries: 1, novel: false, session: 1, scored: 'review' });

  test('keeps the events it can use and drops the ones it cannot, and says what version it is when written', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const c = clock(1_790_000_000_000);
    const store = new MemoryStore(state());
    await store.saveEvents({ events: [ev('l:a'), { node: 'l:b' }, 'junk', ev('l:c')] as never, summary: { upTo: 0, counts: {} } });
    const L = await Learner.open(store, { now: c.now });
    expect(L.events().map((e) => e.node)).toEqual(['l:a', 'l:c']);
    L.introduce('l:a', { results: [true, true, true] });
    L.review('l:a', 'receptive', 3, {});
    await L.flush();
    expect(((await store.loadEvents()) as { version: number }).version).toBe(EVENTS_VERSION);
  });

  test('that is not a log is kept aside and the learner opens with an empty one', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const store = new MemoryStore(state());
    await store.saveEvents('rubbish' as never);
    const L = await Learner.open(store);
    expect(L.events()).toEqual([]);
    expect(store.kept.get('events.quarantine')).toBe('rubbish');
    // and it takes the damaged one's place, so nothing downstream copies the damage
    expect(await store.loadEvents()).toMatchObject({ events: [] });
  });
});

describe('a copy before the first migration of a version', () => {
  const v1 = () => ({ ...withNode('l:old'), version: 1 });

  test('is kept once, as it was, before the migrated state is written', async () => {
    const kv = new LoggedKV();
    const old = v1();
    await kv.set('state', old);
    kv.writes = [];
    const L = await Learner.open(new IdbStore(kv));
    expect(L.toJSON().version).toBe(STATE_VERSION);
    expect(kv.data.get('state.v1')).toEqual(old);
    expect(kv.writes.indexOf('state.v1')).toBeGreaterThanOrEqual(0);
    expect(kv.writes.indexOf('state.v1')).toBeLessThan(kv.writes.indexOf('state'));
  });

  test('an unversioned document is v0, and a copy already there is not replaced', async () => {
    const kv = new MemoryKV();
    const { version, ...bare } = v1();
    await kv.set('state', bare);
    await Learner.open(new IdbStore(kv));
    expect(kv.data.get('state.v0')).toEqual(bare);
    // the same version arrives again (a rolled-back build, a restore): the first copy is the one worth keeping
    await kv.set('state', { ...bare, extra: 'later' });
    await Learner.open(new IdbStore(kv));
    expect(kv.data.get('state.v0')).toEqual(bare);
  });

  test('a document already at this version makes no copy', async () => {
    const kv = new MemoryKV();
    await kv.set('state', withNode('l:now'));
    await Learner.open(new IdbStore(kv));
    expect([...kv.data.keys()].filter((k) => /\.v\d+$/.test(k))).toEqual([]);
  });

  test('ui and path documents are copied the same way', async () => {
    const kv = new LoggedKV();
    const ui = { ...emptyUi('mine'), version: 1 };
    const path = { ...initialPath(), version: 1 };
    await kv.set(UI_KEY, ui);
    await kv.set(PATH_KEY, path);
    kv.writes = [];
    await new UiStore(kv).load();
    expect(kv.data.get('ui.v1')).toEqual(ui);
    expect(kv.data.get('path.v1')).toEqual(path);
    expect(kv.writes.indexOf('ui.v1')).toBeLessThan(kv.writes.indexOf('ui'));
    expect(kv.writes.indexOf('path.v1')).toBeLessThan(kv.writes.indexOf('path'));
  });

  test('Start over takes the copies with it', async () => {
    const kv = new MemoryKV();
    await kv.set('state', v1());
    await kv.set('state.quarantine', { old: true });
    await kv.set(UI_KEY, { ...emptyUi('mine'), version: 1 });
    const store = new IdbStore(kv);
    await Learner.open(store);
    const ui = await new UiStore(kv).load();
    expect([...kv.data.keys()].filter((k) => k.includes('.v1')).length).toBeGreaterThan(1);
    await store.clear();
    await ui.reset();
    expect([...kv.data.keys()]).toEqual([]);
  });
});
