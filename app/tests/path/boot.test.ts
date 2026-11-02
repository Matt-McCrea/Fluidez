// Boot settles a learner against the course: what it writes, what it keeps, what it drops, and that
// it is quiet when there is nothing to do. A small course served through ContentLoader, with a content
// history, over documents shaped as the live site wrote them (path v2, saved lesson v1).
import { describe, expect, it, vi } from 'vitest';
import { initialPath } from '../../src/compiler';
import { ContentMigration } from '../../src/content/migrations';
import { IdbStore, type KV, type LearnerState } from '../../src/learner';
import { boot } from '../../src/ui/app';
import { ContentLoader, type ContentFiles } from '../../src/ui/data/loader';
import { MemoryKV, PATH_KEY, SESSION_KEY, UI_KEY, emptyUi, type SavedSession } from '../../src/ui/store/ui';

const AT = Date.UTC(2026, 9, 1, 18);
const nodeDoc = (id: string) => ({ id, kind: ({ g: 'grammar', c: 'chunk', l: 'lexeme' } as const)[id[0] as 'g'], band: 'A1', priority: 1, title: id });
const days = (u: string, lists: Array<{ focus?: string[]; lexemes?: string[] }>) => lists.map((l, i) => ({ key: `${u}-d${i}`, type: 'drill', focus: l.focus ?? [], chunks: [], lexemes: l.lexemes ?? [] }));
const unitDoc = (id: string, lists: Array<{ focus?: string[]; lexemes?: string[] }>) => ({ id, band: 'A1', title: id, theme: 't', canDo: 'c', storyArc: 's', days: days(id, lists) });

const NODES = ['g:x', 'g:y', 'l:a', 'l:b', 'l:c', 'l:aa'].map(nodeDoc);
/** the unit, teaching `first` on its first day (the learner has l:a, or l:aa once a migration renames it) */
const u1 = (first: string) => unitDoc('u01', [{ focus: ['g:x'], lexemes: [first] }, { lexemes: ['l:b'] }, { focus: ['g:y'] }, { lexemes: ['l:c'] }, {}, {}, {}]);
const U1 = u1('l:a');

function files(over: { history?: ContentFiles['history']; units?: unknown[] } = {}): ContentFiles {
  const one = (d: unknown) => async () => d;
  return {
    graph: { '/content/graph/all.json': one(NODES) },
    units: Object.fromEntries((over.units ?? [U1]).map((u) => [`/content/units/${(u as { id: string }).id}.json`, one(u)])),
    bank: {}, scripts: {}, story: {}, scenes: {}, writing: {},
    history: over.history ?? { migrations: {} },
  };
}
const rename = (n: number, from: string, to: string) => ContentMigration.parse({ id: n, note: 't', nodes: { rename: { [from]: to } } });

/** A learner as the live site stored one: state v2, path v2 (no keys), ui, and perhaps a lesson v1. */
async function stored(opts: { learning?: string[]; known?: string[]; session?: (state: LearnerState) => SavedSession | undefined; path?: Record<string, unknown> } = {}) {
  const kv = new MemoryKV();
  const store = new IdbStore(kv);
  const { Learner } = await import('../../src/learner');
  const l = await Learner.open(store, { now: () => AT });
  for (const id of opts.known ?? ['g:x', 'l:a', 'l:b']) l.introduce(id, { results: [true, true, true] });
  for (const id of opts.learning ?? []) l.introduce(id);
  l.startSession(AT);
  await l.flush();
  await kv.set(UI_KEY, { ...emptyUi('learner-1'), onboarded: true });
  await kv.set(PATH_KEY, { ...initialPath(), version: 2, unit: 0, day: 2, coreSessions: 2, ...opts.path });
  const session = opts.session?.(l.toJSON());
  if (session) await kv.set(SESSION_KEY, session);
  return { kv, learner: l };
}

const lesson = (naming: string[]): ((s: LearnerState) => SavedSession) => () => ({
  version: 1, learnerId: 'learner-1', sessionIndex: 1, mode: 'next', capMinutes: 20, startedAt: AT, elapsedMs: 0, savedAt: AT,
  plan: { sessionIndex: 1, seed: 1, tier: 'standard', mode: 'next', type: 'drill', unit: 'u01', day: 2, advancesPath: true, blocks: [{ kind: 'learn', minutes: 1, items: naming.map((n) => ({ node: n, id: `ln:${n}` })) }] } as never,
  block: 0, cursor: {}, runner: { entered: [], skipped: [], presented: [], notPresented: [], lapses: [], learnSteps: [], learnMisses: [], typedOk: [], cardsDone: [], tally: { scored: 0, correct: 0, firstTry: 0 }, scenes: [], reads: [], marked: [], startedAt: AT },
});

describe('boot over a learner the live site stored', () => {
  it('gives the path its keys and the content version, writes them back, and keeps the copy it was', async () => {
    const { kv } = await stored();
    const w = await boot({ kv, loader: new ContentLoader(files()), now: () => AT, fixtures: false });
    expect(w.ui.path).toMatchObject({ version: 3, unit: 0, day: 2, unitId: 'u01', dayKey: 'u01-d2', contentVersion: 0 });
    expect(kv.data.get(PATH_KEY)).toMatchObject({ version: 3, unitId: 'u01', dayKey: 'u01-d2' });
    expect((kv.data.get('path.v2') as { version: number }).version).toBe(2);
  });

  it('renames what a migration renamed, in the stored documents as well as in memory', async () => {
    const { kv } = await stored({ path: { owedNew: ['l:a'] } });
    const history = { migrations: { '/content/_migrations/0001.json': rename(1, 'l:a', 'l:aa') } };
    const w = await boot({ kv, loader: new ContentLoader(files({ history, units: [u1('l:aa')] })), now: () => AT, fixtures: false });
    expect(w.learner.isIntroduced('l:a')).toBe(false);
    expect(w.learner.isIntroduced('l:aa')).toBe(true);
    expect(w.ui.path).toMatchObject({ owedNew: ['l:aa'], contentVersion: 1 });
    const state = kv.data.get('state') as LearnerState;
    expect(Object.keys(state.nodes).sort()).toEqual(['g:x', 'l:aa', 'l:b']);
    expect(kv.data.get(PATH_KEY)).toMatchObject({ owedNew: ['l:aa'], contentVersion: 1 });
    expect((kv.data.get('events') as { events: Array<{ node: string }> }).events.every((e) => e.node !== 'l:a')).toBe(true);
  });

  it('keeps the documents it rewrote as they were, once, and not the ones it only named', async () => {
    const { kv } = await stored({ path: { owedNew: ['l:a'] } });
    const was = structuredClone(kv.data.get('state'));
    const wasEvents = structuredClone(kv.data.get('events'));
    const history = { migrations: { '/content/_migrations/0001.json': rename(1, 'l:a', 'l:aa') } };
    await boot({ kv, loader: new ContentLoader(files({ history, units: [u1('l:aa')] })), now: () => AT, fixtures: false });
    expect(kv.data.get('state.pre-content-0')).toEqual(was);
    expect(kv.data.get('events.pre-content-0')).toEqual(wasEvents);
    expect(kv.data.has('attempts.pre-content-0')).toBe(false);
    // a settling that only gave the path its keys leaves no copy
    const plain = await stored();
    await boot({ kv: plain.kv, loader: new ContentLoader(files()), now: () => AT, fixtures: false });
    expect([...plain.kv.data.keys()].filter((k) => k.includes('pre-content'))).toEqual([]);
  });

  it('is quiet the second time: nothing is written', async () => {
    const { kv } = await stored();
    const loader = new ContentLoader(files());
    await boot({ kv, loader, now: () => AT, fixtures: false });
    const sets: string[] = [];
    const watched: KV = { get: (k) => kv.get(k), set: async (k, v) => { sets.push(k); await kv.set(k, v); }, del: (k) => kv.del(k), setMany: async (e) => { sets.push(...e.map(([k]) => k)); await kv.setMany(e); }, keys: () => kv.keys() };
    await boot({ kv: watched, loader: new ContentLoader(files()), now: () => AT, fixtures: false });
    expect(sets).toEqual([]);
  });

  it('keeps a lesson the course has not moved under, and stamps it', async () => {
    const { kv } = await stored({ session: lesson(['l:b']), known: ['g:x', 'l:a'], learning: ['l:b'] });
    const w = await boot({ kv, loader: new ContentLoader(files()), now: () => AT + 60_000, fixtures: false });
    expect(w.ui.session).toMatchObject({ version: 2, contentVersion: 0, dayKey: 'u01-d2' });
    expect(kv.data.get(SESSION_KEY)).toMatchObject({ version: 2, dayKey: 'u01-d2' });
    expect(w.learner.isLearning('l:b')).toBe(true);
  });

  it('drops a lesson that names what moved, after handing on the nodes it had begun', async () => {
    const { kv } = await stored({ session: lesson(['l:a', 'l:b']), known: ['g:x', 'l:a'], learning: ['l:b'] });
    const history = { migrations: { '/content/_migrations/0001.json': rename(1, 'l:a', 'l:aa') } };
    const w = await boot({ kv, loader: new ContentLoader(files({ history, units: [u1('l:aa')] })), now: () => AT + 60_000, fixtures: false });
    expect(w.ui.session).toBeUndefined();
    expect(kv.data.has(SESSION_KEY)).toBe(false);
    // l:b was mid-lesson: it now has a card, so it comes back for review instead of vanishing
    expect(w.learner.isLearning('l:b')).toBe(false);
    expect(w.learner.hasCard('l:b', 'receptive')).toBe(true);
    expect((kv.data.get('state') as LearnerState).nodes['l:b'].learning).toBeUndefined();
  });

  it('drops a lesson planned for a day that is not where it was', async () => {
    const moved = u1('l:a');
    moved.days.unshift({ key: 'u01-d9', type: 'drill', focus: [], chunks: [], lexemes: [] });
    const legacy = { format: 1, units: { u01: moved.days.slice(1).map((d) => d.key) } };
    const { kv } = await stored({ session: lesson(['l:b']) });
    const w = await boot({ kv, loader: new ContentLoader(files({ units: [moved], history: { migrations: {}, legacy } })), now: () => AT + 60_000, fixtures: false });
    expect(w.ui.session).toBeUndefined();
    // the learner stayed on their day, which is now one later
    expect(w.ui.path).toMatchObject({ unit: 0, day: 3, dayKey: 'u01-d2' });
  });

  it('settles nothing against a course that did not load', async () => {
    const { kv } = await stored({ path: { owedNew: ['l:gone'] } });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const broken = files();
    broken.graph = { '/content/graph/all.json': async () => { throw new Error('offline'); } };
    const w = await boot({ kv, loader: new ContentLoader(broken), now: () => AT, fixtures: false });
    warn.mockRestore();
    expect(w.ui.path.owedNew).toEqual(['l:gone']);
    expect(w.ui.path.dayKey).toBeUndefined();
  });

  it('keeps a learner who moved on while the course could not be read where they got to', async () => {
    const { kv } = await stored();
    await boot({ kv, loader: new ContentLoader(files()), now: () => AT, fixtures: false });
    expect(kv.data.get(PATH_KEY)).toMatchObject({ day: 2, dayKey: 'u01-d2' });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const broken = files();
    broken.graph = { '/content/graph/all.json': async () => { throw new Error('offline'); } };
    const offline = await boot({ kv, loader: new ContentLoader(broken), now: () => AT, fixtures: false });
    warn.mockRestore();
    // two lessons finish on this start: nothing can name the day they land on
    await offline.ui.setPath({ ...offline.ui.path, day: 3 });
    await offline.ui.setPath({ ...offline.ui.path, day: 4 });
    const w = await boot({ kv, loader: new ContentLoader(files()), now: () => AT, fixtures: false });
    expect(w.ui.path).toMatchObject({ unit: 0, day: 4, dayKey: 'u01-d4' });
  });

  it('keeps a learner it cannot work out, as they were, rather than out of the app', async () => {
    const { kv } = await stored({ path: { pendingDrills: [null] } });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const w = await boot({ kv, loader: new ContentLoader(files()), now: () => AT, fixtures: false });
    expect(error).toHaveBeenCalledTimes(1);
    error.mockRestore();
    expect(w.ui.path).toMatchObject({ unit: 0, day: 2 });
    expect(w.ui.path.dayKey).toBeUndefined();
    expect(w.ui.contentVersion).toBe(0);
  });

  it('names nothing against a course that does not look like the learner\'s', async () => {
    const known = Array.from({ length: 30 }, (_, i) => `l:other${i}`);
    const { kv } = await stored({ known, path: { unit: 0, day: 2, unitId: 'u09', dayKey: 'u09-d2', contentVersion: 3 } });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const w = await boot({ kv, loader: new ContentLoader(files()), now: () => AT, fixtures: false });
    warn.mockRestore();
    expect(kv.data.get(PATH_KEY)).toMatchObject({ dayKey: 'u09-d2', contentVersion: 3, version: 3 });
    expect(Object.keys((kv.data.get('state') as LearnerState).nodes)).toEqual(known);
    await w.ui.setPath({ ...w.ui.path, remediate: [] });
    expect(kv.data.get(PATH_KEY)).toMatchObject({ dayKey: 'u09-d2', contentVersion: 3 });
  });

  it('keeps the path as it was when settling moves the learner or changes what they are owed', async () => {
    const moved = u1('l:a');
    moved.days.unshift({ key: 'u01-d9', type: 'drill', focus: [], chunks: [], lexemes: [] });
    const legacy = { format: 1, units: { u01: moved.days.slice(1).map((d) => d.key) } };
    const { kv } = await stored();
    const w = await boot({ kv, loader: new ContentLoader(files({ units: [moved], history: { migrations: {}, legacy } })), now: () => AT, fixtures: false });
    expect(w.ui.path).toMatchObject({ day: 3 });
    expect(kv.data.get('path.pre-content-0')).toMatchObject({ unit: 0, day: 2 });
  });
});
