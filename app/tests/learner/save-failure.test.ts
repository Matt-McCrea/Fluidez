// A failed write must not end saving. Before: Learner.touch chained every save
// on one promise with no catch, so one rejected store.save left that promise
// rejected for good and saveQueued stuck at true: nothing else was written,
// flush() and commit() rejected for the rest of the session, and the close
// screen sat on "Saving…" while the lesson's work lived only in memory.
import { afterEach, describe, expect, test, vi } from 'vitest';
import { initialPath } from '../../src/compiler';
import { IdbStore, Learner, MemoryStore, SaveFailedError, type LearnerState, type SaveAll } from '../../src/learner';
import { MemoryKV, UiStore } from '../../src/ui/store/ui';
import { clock } from './helpers';

/** A MemoryStore whose writes refuse on demand: `failures` is how many are still to be refused (Infinity = always). */
class FlakyStore extends MemoryStore {
  failures = 0;
  attempts = 0;
  private gate() {
    this.attempts += 1;
    if (this.failures > 0) {
      this.failures -= 1;
      throw Object.assign(new Error('The quota has been exceeded.'), { name: 'QuotaExceededError' });
    }
  }
  override async save(state: LearnerState) { this.gate(); await super.save(state); }
  override async saveAll(d: SaveAll) { this.gate(); await super.saveAll(d); }
}

const RETRY = { saveRetryMs: 2 };
const onDisk = (s: MemoryStore) => s.snapshot() as LearnerState;

async function open(store = new FlakyStore()) {
  const c = clock();
  const L = await Learner.open(store, { now: c.now, ...RETRY });
  L.introduce('l:a');
  await L.flush();
  return { store, L, c };
}

afterEach(() => { vi.restoreAllMocks(); });

describe('a store that refuses one write', () => {
  test('the next save still lands: nothing is lost after the failure', async () => {
    const { store, L } = await open();
    store.failures = 1;
    L.expose(['l:a']);
    L.expose(['l:a']);
    L.expose(['l:a']);
    await L.flush();
    expect(onDisk(store).nodes['l:a'].exposures).toBe(3);
    expect(L.saveProblem).toBeUndefined();
  });

  test('flush and commit resolve, and the commit carries the path and ui documents', async () => {
    const { store, L } = await open();
    store.failures = 1;
    L.startSession();
    await expect(L.flush()).resolves.toBeUndefined();
    store.failures = 1;
    L.startSession();
    await expect(L.commit({ path: { p: 1 }, ui: { u: 1 } })).resolves.toBeUndefined();
    expect(onDisk(store).session.index).toBe(2);
    expect(store.extras.get('path')).toEqual({ p: 1 });
    expect(store.extras.get('ui')).toEqual({ u: 1 });
  });

  test('the write is retried by itself, with no further call from the learner', async () => {
    const { store, L } = await open();
    store.failures = 2;
    L.startSession();
    await vi.waitFor(() => expect(onDisk(store).session.index).toBe(1), { timeout: 2000 });
    expect(L.saveProblem).toBeUndefined();
  });
});

describe('a store that refuses every write', () => {
  test('flush gives up in a moment, with words a learner can read, and nothing is left unhandled', async () => {
    const { store, L } = await open();
    store.failures = Infinity;
    L.startSession();
    const err = await L.flush().catch((e) => e);
    expect(err).toBeInstanceOf(SaveFailedError);
    expect(err.message).toMatch(/Couldn't save/);
    expect(err.message).not.toMatch(/[–—]| - |quota/i);
    expect(L.saveProblem).toBe(err.message);
  });

  test('commit rejects the same way instead of hanging, and keeps the work to try again', async () => {
    const { store, L } = await open();
    store.failures = Infinity;
    L.startSession();
    await expect(L.commit({ path: { p: 1 }, ui: { u: 1 } })).rejects.toBeInstanceOf(SaveFailedError);
    store.failures = 0;
    await L.flush();
    expect(onDisk(store).session.index).toBe(1);
    expect(L.saveProblem).toBeUndefined();
  });

  test('the message is announced to a listener once it has failed twice, and cleared when a write lands', async () => {
    const { store, L } = await open();
    const seen: Array<string | undefined> = [];
    L.onSaveProblem(() => seen.push(L.saveProblem));
    store.failures = Infinity;
    L.startSession();
    await vi.waitFor(() => expect(L.saveProblem).toMatch(/Couldn't save/), { timeout: 2000 });
    store.failures = 0;
    await vi.waitFor(() => expect(L.saveProblem).toBeUndefined(), { timeout: 2000 });
    expect(seen.map((m) => (m ? 'problem' : 'clear'))).toEqual(['problem', 'clear']);
    expect(onDisk(store).session.index).toBe(1);
  });

  test('a failing store is not hammered: answers during the pause only mark the learner dirty', async () => {
    const c = clock();
    const store = new FlakyStore();
    const L = await Learner.open(store, { now: c.now, saveRetryMs: 60_000 });
    store.attempts = 0;
    store.failures = Infinity;
    for (let i = 0; i < 40; i++) { L.ledger.markSeen('item', `x${i}`); await Promise.resolve(); await Promise.resolve(); }
    await Promise.resolve();
    expect(store.attempts).toBeLessThanOrEqual(1);
  });
});

describe('a session commit the store refused', () => {
  /** A MemoryKV that can be switched off: every write throws while `down`. */
  class SwitchKV extends MemoryKV {
    down = false;
    override async set(k: string, v: unknown) { if (this.down) throw new Error('quota'); await super.set(k, v); }
    override async setMany(e: [string, unknown][]) { if (this.down) throw new Error('quota'); await super.setMany(e); }
  }

  test('never reaches the disk by itself: the retry saves the learner, and only a new close writes the path', async () => {
    const kv = new SwitchKV();
    const learner = await Learner.open(new IdbStore(kv), { saveRetryMs: 2 });
    const ui = await new UiStore(kv).load();
    learner.startSession();
    kv.down = true;
    await expect(ui.commitSession(learner, { ...initialPath(), coreSessions: 1 }, '2026-01-01')).rejects.toBeInstanceOf(SaveFailedError);
    expect(ui.state.stats.sessions, 'the documents went back').toBe(0);
    expect(ui.path.coreSessions).toBe(0);
    kv.down = false;
    await vi.waitFor(() => expect((kv.data.get('state') as any)?.session.index).toBe(1), { timeout: 2000 });
    expect((kv.data.get('path') as any)?.coreSessions ?? 0, 'a closed path beside a live resume point would advance the course twice').toBe(0);

    await ui.commitSession(learner, { ...initialPath(), coreSessions: 1 }, '2026-01-01');
    expect((kv.data.get('path') as any).coreSessions).toBe(1);
    expect((kv.data.get('ui') as any).stats.sessions).toBe(1);
  });
});
