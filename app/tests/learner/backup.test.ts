// Backup and restore. Before: progress lived in one browser store with no way
// out (no Blob, no download, nothing in Settings). The round trip below is the
// promise: export, wipe, restore, and the learner is the same one, on every
// real saved document the golden fixtures hold.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { initialPath } from '../../src/compiler';
import {
  BACKUP_FORMAT, BACKUP_NEWER, BACKUP_UNREADABLE, backupFileName, backupText, BackupError, makeBackup, NOT_A_BACKUP, PRE_RESTORE,
  readBackup, restoreBackup, type BackupFile, type BackupReaders,
} from '../../src/learner/backup';
import { IdbStore, Learner, MemoryStore, STATE_VERSION, type LearnerState } from '../../src/learner';
import { BACKUP_READERS, emptyUi, MemoryKV, SESSION_KEY, UiStore } from '../../src/ui/store/ui';
import { clock } from './helpers';

const DIR = fileURLToPath(new URL('../golden/', import.meta.url));
const NAMES = ['live-ee6aaec', 'head-early', 'head-mid-session', 'head-placed'];
interface Golden { madeAt: number; kv: Record<string, unknown> }
const golden = (name: string): Golden => JSON.parse(readFileSync(`${DIR}${name}.json`, 'utf8'));

const kvOf = (g: Golden) => { const kv = new MemoryKV(); for (const [k, v] of Object.entries(g.kv)) kv.data.set(k, structuredClone(v)); return kv; };
/** Boot the way the app does, minus the content: open the learner, load the UI store, reconcile. */
async function boot(kv: MemoryKV, now: number) {
  const store = new IdbStore(kv);
  const learner = await Learner.open(store, { now: () => now });
  const ui = await new UiStore(kv).load();
  await ui.reconcile(learner.sessionIndex);
  return { store, learner, ui };
}
const look = (b: Awaited<ReturnType<typeof boot>>) => ({ state: b.learner.toJSON(), events: b.learner.events(), summary: b.learner.eventSummary(), ui: b.ui.state, path: b.ui.path });
const snapshot = (kv: MemoryKV) => JSON.parse(JSON.stringify([...kv.data.entries()].sort(([a], [b]) => a.localeCompare(b))));

beforeEach(() => { vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { vi.restoreAllMocks(); });

describe.each(NAMES)('golden learner %s', (name) => {
  const g = golden(name);

  test('export, wipe, restore: the same learner comes back', async () => {
    const kv = kvOf(g);
    const a = await boot(kv, g.madeAt);
    await a.learner.flush();
    const was = look(a);

    const file = await makeBackup(a.store, BACKUP_READERS, g.madeAt);
    const text = backupText(file);
    expect(Object.keys(file.documents).sort()).toEqual(['events', 'path', 'state', 'ui']);
    expect(file.versions).toMatchObject({ state: STATE_VERSION });

    await a.store.clear();
    await a.ui.reset();
    expect([...kv.data.keys()]).toEqual([]);

    await restoreBackup(a.store, readBackup(text, BACKUP_READERS), BACKUP_READERS, [SESSION_KEY]);
    const b = await boot(kv, g.madeAt);
    expect(look(b)).toEqual(was);
    expect(b.learner.toJSON().nodes).toEqual(was.state.nodes);
  });

  test('a new device gets the same learner from the file', async () => {
    const a = await boot(kvOf(g), g.madeAt);
    const text = backupText(await makeBackup(a.store, BACKUP_READERS, g.madeAt));
    const fresh = new MemoryKV();
    await restoreBackup(new IdbStore(fresh), readBackup(text, BACKUP_READERS), BACKUP_READERS);
    expect(look(await boot(fresh, g.madeAt))).toEqual(look(a));
  });

  test('documents stored at an older version are restored raw and migrated by boot, never by the restore', async () => {
    const raw = kvOf(g);
    const file = await makeBackup(new IdbStore(raw), BACKUP_READERS, g.madeAt);
    expect(file.documents.state).toEqual(g.kv.state);
    expect(file.documents.ui).toEqual(g.kv.ui);
    const fresh = new MemoryKV();
    await restoreBackup(new IdbStore(fresh), readBackup(backupText(file), BACKUP_READERS), BACKUP_READERS);
    expect(fresh.data.get('ui')).toEqual(g.kv.ui);
    expect(look(await boot(fresh, g.madeAt))).toEqual(look(await boot(kvOf(g), g.madeAt)));
  });
});

describe('restoring', () => {
  const g = golden('head-early');
  const textOf = async () => backupText(await makeBackup(new IdbStore(kvOf(g)), BACKUP_READERS, g.madeAt));
  const other = async () => {
    const kv = new MemoryKV();
    const L = await Learner.open(new IdbStore(kv));
    L.introduce('l:mine', { results: [true, true, true] });
    await L.flush();
    await kv.set('ui', { ...emptyUi('someone-else'), onboarded: true });
    await kv.set('path', { ...initialPath(), unit: 3 });
    await kv.set('session', { version: 1, learnerId: 'someone-else' });
    return { kv, store: new IdbStore(kv) };
  };

  test('keeps a .pre-restore copy of everything it replaces, and clears the half-finished lesson', async () => {
    const { kv, store } = await other();
    const before = snapshot(kv);
    const was = Object.fromEntries(['state', 'events', 'path', 'ui', 'session'].map((k) => [k, kv.data.get(k)]));
    await restoreBackup(store, readBackup(await textOf(), BACKUP_READERS), BACKUP_READERS, [SESSION_KEY]);
    for (const [k, v] of Object.entries(was)) if (v !== undefined) expect(kv.data.get(`${k}${PRE_RESTORE}`), k).toEqual(v);
    expect(kv.data.get('state')).toEqual(g.kv.state);
    expect(kv.data.has('session')).toBe(false);
    expect(snapshot(kv)).not.toEqual(before);
  });

  test('a document the file does not have is removed, after its copy is kept', async () => {
    const { kv, store } = await other();
    await kv.set('events', { events: [], summary: { upTo: 0, counts: {} } });
    const file = await makeBackup(new IdbStore(kvOf(g)), BACKUP_READERS, g.madeAt);
    delete file.documents.events;
    await restoreBackup(store, readBackup(backupText(file), BACKUP_READERS), BACKUP_READERS);
    expect(kv.data.has('events')).toBe(false);
    expect(kv.data.has(`events${PRE_RESTORE}`)).toBe(true);
  });

  test('a learner that is halted cannot save over what was restored', async () => {
    const { kv, store } = await other();
    const L = await Learner.open(store);
    await restoreBackup(store, readBackup(await textOf(), BACKUP_READERS), BACKUP_READERS);
    L.halt();
    L.startSession();
    L.ledger.markSeen('item', 'x');
    await L.flush();
    await expect(L.commit({ path: { p: 1 }, ui: { u: 1 } })).resolves.toBeUndefined();
    expect(kv.data.get('state')).toEqual(g.kv.state);
    expect(kv.data.get('path')).toEqual(g.kv.path);
  });

  test('the same on a MemoryStore, which keeps its copies in memory', async () => {
    const store = new MemoryStore();
    const L = await Learner.open(store);
    L.introduce('l:a', { results: [true, true, true] });
    await L.flush();
    const old = (await store.exportAll(['state', 'ui']));
    await store.replaceAll(['state', 'events', 'ui'], { state: g.kv.state, ui: { version: 3 } }, PRE_RESTORE);
    expect(store.kept.get(`state${PRE_RESTORE}`)).toEqual(old.state);
    expect(await store.load()).toEqual(g.kv.state);
    expect(store.extras.get('ui')).toEqual({ version: 3 });
  });
});

describe('a file that cannot be restored', () => {
  const g = golden('head-early');
  const good = async (): Promise<BackupFile> => structuredClone(await makeBackup(new IdbStore(kvOf(g)), BACKUP_READERS, g.madeAt));
  /** run `readBackup` on the text and say what it refused with */
  const refused = (text: string, readers: BackupReaders = BACKUP_READERS) => {
    try { readBackup(text, readers); } catch (e) { expect(e).toBeInstanceOf(BackupError); return e as BackupError; }
    throw new Error('the backup was accepted');
  };

  test('text that is not a backup', () => {
    for (const text of ['', 'not json', '[]', '{}', JSON.stringify({ format: 'something-else', documents: {} }), JSON.stringify({ format: BACKUP_FORMAT })]) {
      const e = refused(text);
      expect(e.fault).toBe('notBackup');
      expect(e.message).toBe(NOT_A_BACKUP);
    }
  });

  test('a backup from a newer build is refused in words, whatever makes it newer', async () => {
    const wrapper = { ...(await good()), formatVersion: 2 };
    const state = await good(); (state.documents.state as LearnerState).version = STATE_VERSION + 1;
    const path = await good(); (path.documents.path as { version: number }).version = 99;
    const events = await good(); (events.documents.events as { version: number }).version = 99;
    const extra = await good(); extra.documents.attempts = { anything: 1 };
    for (const file of [wrapper, state, path, events, extra]) {
      const e = refused(backupText(file));
      expect(e.fault).toBe('newer');
      expect(e.message).toBe(BACKUP_NEWER);
      expect(e.message).not.toMatch(/[–—]| - /);
    }
  });

  test('a backup with a damaged document, or none for the learner, is unreadable', async () => {
    const nodes = await good(); (nodes.documents.state as { nodes: unknown }).nodes = 'oops';
    const ui = await good(); (ui.documents.ui as { saved: unknown }).saved = 'oops';
    const none = await good(); delete none.documents.state;
    for (const file of [nodes, ui, none]) {
      const e = refused(backupText(file));
      expect(e.fault).toBe('unreadable');
      expect(e.message).toBe(BACKUP_UNREADABLE);
    }
  });

  test('is found out before anything is written: the store is exactly as it was', async () => {
    const kv = kvOf(g);
    const before = snapshot(kv);
    const bad = await good(); (bad.documents.path as { version: number }).version = 99;
    expect(() => readBackup(backupText(bad), BACKUP_READERS)).toThrow(BackupError);
    expect(snapshot(kv)).toEqual(before);
  });

  test('a store that cannot export or replace says so', async () => {
    const bare = { load: async () => undefined, save: async () => {}, clear: async () => {} };
    await expect(makeBackup(bare, BACKUP_READERS)).rejects.toMatchObject({ fault: 'unsupported' });
    await expect(restoreBackup(bare, readBackup(backupText(await good()), BACKUP_READERS), BACKUP_READERS)).rejects.toMatchObject({ fault: 'unsupported' });
  });

  test('a learner with nothing saved has nothing to back up', async () => {
    await expect(makeBackup(new IdbStore(new MemoryKV()), BACKUP_READERS)).rejects.toMatchObject({ fault: 'empty', message: expect.stringMatching(/no progress/) });
  });
});

describe('the allowlist', () => {
  const g = golden('head-early');

  test('carries only the keys it names: not the one-step backup, the half-finished lesson, or quarantine', async () => {
    const kv = kvOf(g);
    await kv.set('state.quarantine', { old: 1 });
    await kv.set('state.v1', { old: 2 });
    await kv.set('elsewhere', { secret: true });
    const file = await makeBackup(new IdbStore(kv), BACKUP_READERS);
    expect(Object.keys(file.documents).sort()).toEqual(['events', 'path', 'state', 'ui']);
    expect(JSON.stringify(file)).not.toMatch(/secret/);
  });

  test('a new document is one more reader, and rides along both ways', async () => {
    const readers: BackupReaders = { ...BACKUP_READERS, attempts: (raw) => raw };
    const kv = kvOf(g);
    await kv.set('attempts', { version: 1, list: [1, 2, 3] });
    const file = await makeBackup(new IdbStore(kv), readers);
    expect(file.documents.attempts).toEqual({ version: 1, list: [1, 2, 3] });
    const fresh = new MemoryKV();
    await restoreBackup(new IdbStore(fresh), readBackup(backupText(file), readers), readers);
    expect(fresh.data.get('attempts')).toEqual({ version: 1, list: [1, 2, 3] });
    // and a build that has not heard of it refuses the file instead of dropping the document
    expect(() => readBackup(backupText(file), BACKUP_READERS)).toThrow(expect.objectContaining({ fault: 'newer' }));
  });
});

describe('the file', () => {
  test('is named by the day it was made, in the learner\'s own time', () => {
    expect(backupFileName(new Date(2026, 10, 1, 9, 30).getTime())).toBe('fluidez-backup-2026-11-01.json');
    expect(backupFileName(new Date(2026, 0, 5, 23, 59).getTime())).toBe('fluidez-backup-2026-01-05.json');
  });

  test('says how many sessions and when, so a learner can tell which backup it is', async () => {
    const g = golden('head-early');
    const made = new Date(2026, 9, 1).getTime();
    const { summary } = readBackup(backupText(await makeBackup(new IdbStore(kvOf(g)), BACKUP_READERS, made)), BACKUP_READERS);
    expect(summary).toEqual({ madeAt: made, sessions: (g.kv.state as LearnerState).session.index });
  });

  test('survives JSON exactly: what comes out of text is what went in', async () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.introduce('l:a', { results: [true, false, true, true] });
    const store = new MemoryStore(L.toJSON());
    const file = await makeBackup(store, { state: BACKUP_READERS.state }, c.now());
    expect(JSON.parse(backupText(file))).toEqual(file);
  });
});
