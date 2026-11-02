// A learner's growth had no history. A read left no trace beyond the first time it took, and the numbers on the
// Progress screen were only ever the numbers of today. Now every read leaves a row (words, seconds, taps, first
// read or reread) and each month keeps the numbers Progress shows, in a document of its own. Capture only.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IdbStore, Learner } from '../../src/learner';
import { backupText, provenBackup, readBackup, restoreBackup, BackupError } from '../../src/learner/backup';
import { ReadChapter, Reader } from '../../src/ui/blocks/read';
import { progressNumbers, type ProgressNumbers } from '../../src/ui/session/numbers';
import { Keep, HISTORY_KEY, HISTORY_VERSION, READS_CAP, readHistory, type MonthRow, type ReadRow } from '../../src/ui/store/keep';
import { BACKUP_READERS, MemoryKV, UiStore } from '../../src/ui/store/ui';
import { session, world } from './driver';

const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0 }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [h.slots[i], (v: unknown) => { h.slots[i] = typeof v === 'function' ? (v as (x: unknown) => unknown)(h.slots[i]) : v; }];
  },
  useRef: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = { current: init };
    return h.slots[i];
  },
  useMemo: (f: () => unknown) => f(),
  useEffect: () => {},
}));

beforeEach(() => { vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { vi.restoreAllMocks(); });

const DAY = 86_400_000;
const history = async (kv: MemoryKV) => (await kv.get(HISTORY_KEY)) as { version: number; reads: ReadRow[]; months: MonthRow[] } | undefined;
/** a month's numbers, with only the ones a test cares about */
const nums = (o: Partial<ProgressNumbers>) => o as ProgressNumbers;
const read = (o: Partial<ReadRow> = {}): ReadRow => ({ at: 5, chapter: 'ch001', words: 120, seconds: 80, taps: 3, first: true, ...o });

const expand = (node: any): any => {
  if (node == null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(expand);
  if (typeof node.type === 'function') return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props?.children) } };
};
const find = (node: any, pred: (n: any) => boolean, out: any[] = []): any[] => {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n) => find(n, pred, out)); return out; }
  if (pred(node)) out.push(node);
  find(node.props?.children, pred, out);
  return out;
};

describe('every read leaves a row', () => {
  // a chapter of two sentences and no questions, so a first read is one part and a reread is one screen
  const chapter = { id: 'ch-x', title: 'Hola', text: 'Tomás llega a Bogotá. Vale lo espera.', lexemes: [], questions: [], rereadQuestions: [] } as any;
  const bundle: any = { chapters: new Map([['ch-x', chapter]]), index: { chapterById: new Map() }, englishOf: () => undefined, gloss: () => undefined };
  const clock = { t: 1000 };
  beforeEach(() => { vi.spyOn(performance, 'now').mockImplementation(() => clock.t); clock.t = 1000; });

  async function reading(kind: 'read' | 'reread') {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    const run: any = { bundle, ui, learner: { sessionIndex: 4 }, expose: () => {}, addWords: async () => {}, reads: new Map(), now: () => 0 };
    const block = { kind, chapter: 'ch-x', purpose: 'minimum', timed: false } as any;
    h.slots = [];
    const draw = () => { h.at = 0; return expand(ReadChapter({ block, run, ui, onDone: () => {} })); };
    return { kv, ui, draw };
  }
  const tapWords = (tree: any, n: number) => {
    const words = find(tree, (x) => x.type === 'button' && x.props?.class?.startsWith?.('w'));
    for (let i = 0; i < n; i++) words[i].props.onClick();
  };
  const finish = (tree: any) => find(tree, (x) => x.props?.['data-primary'])[0].props.onClick();

  it('a first read: its words, the seconds it took, the words tapped, and that it was the first', async () => {
    const r = await reading('read');
    let t = r.draw();
    tapWords(t, 2);
    clock.t = 1000 + 42_000;
    t = r.draw();
    finish(t);
    await r.ui.keep.settled();
    expect((await history(r.kv))!.reads).toEqual([{ at: expect.any(Number), chapter: 'ch-x', words: 7, seconds: 42, taps: 2, first: true }]);
  });

  it('a reread is a row too, and says so', async () => {
    const r = await reading('reread');
    let t = r.draw();
    tapWords(t, 1);
    clock.t = 1000 + 25_000;
    t = r.draw();
    finish(t);
    await r.ui.keep.settled();
    expect((await history(r.kv))!.reads).toEqual([{ at: expect.any(Number), chapter: 'ch-x', words: 7, seconds: 25, taps: 1, first: false }]);
  });

  it('a read with no taps has none', async () => {
    const r = await reading('reread');
    r.draw();
    clock.t = 1000 + 10_000;
    finish(r.draw());
    await r.ui.keep.settled();
    expect((await history(r.kv))!.reads[0]).toMatchObject({ taps: 0, seconds: 10 });
  });

  it('the reader hands the taps to whoever opened it', () => {
    let got: [number, number] | undefined;
    h.slots = [];
    const draw = () => { h.at = 0; return expand(Reader({ chapter, bundle, ui: { state: { saved: [] } } as any, onFinish: (s: number, t: number) => { got = [s, t]; } })); };
    let t = draw();
    tapWords(t, 3);
    clock.t = 1000 + 9_000;
    t = draw();
    finish(t);
    expect(got).toEqual([9, 3]);
  });
});

describe('the document', () => {
  it('keeps the newest reads up to a cap', async () => {
    const kv = new MemoryKV();
    await kv.set(HISTORY_KEY, { version: HISTORY_VERSION, reads: Array.from({ length: READS_CAP }, (_, i) => read({ at: i, chapter: `c${i}` })), months: [] });
    const keep = new Keep(kv);
    await keep.addRead(read({ at: READS_CAP, chapter: 'newest' }));
    const reads = (await history(kv))!.reads;
    expect(reads).toHaveLength(READS_CAP);
    expect(reads[0].chapter).toBe('c1');
    expect(reads.at(-1)!.chapter).toBe('newest');
  });

  it('one row a month: a later snapshot in the same month replaces the earlier, a new month adds one', async () => {
    const kv = new MemoryKV();
    const keep = new Keep(kv);
    await keep.snapshotMonth('2026-10', 100, nums({ learned: 1 }));
    await keep.snapshotMonth('2026-10', 200, nums({ learned: 4 }));
    await keep.snapshotMonth('2026-11', 300, nums({ learned: 9 }));
    expect((await history(kv))!.months.map((m) => [m.month, m.at, m.learned])).toEqual([['2026-10', 200, 4], ['2026-11', 300, 9]]);
  });

  it('reads and months share the document without touching each other', async () => {
    const kv = new MemoryKV();
    const keep = new Keep(kv);
    await keep.addRead(read());
    await keep.snapshotMonth('2026-10', 100, nums({ learned: 2 }));
    await keep.addRead(read({ at: 6 }));
    const doc = (await history(kv))!;
    expect(doc.reads).toHaveLength(2);
    expect(doc.months).toHaveLength(1);
    expect(doc.version).toBe(HISTORY_VERSION);
  });

  it('is read tolerantly: damaged rows dropped, a newer one refused, one that is not a document refused', () => {
    const doc = readHistory({ version: 1, reads: [read(), { nonsense: 1 }], months: [{ month: '2026-10', at: 1, learned: 1 }, null] });
    expect(doc.reads).toHaveLength(1);
    expect(doc.months).toHaveLength(1);
    expect(() => readHistory({ version: HISTORY_VERSION + 1, reads: [], months: [] })).toThrow(expect.objectContaining({ fault: 'newer' }));
    expect(() => readHistory('rubbish')).toThrow(expect.objectContaining({ fault: 'unreadable' }));
  });

  it('goes in a backup and comes back, and goes when the learner starts over', async () => {
    const kv = new MemoryKV();
    const store = new IdbStore(kv);
    const L = await Learner.open(store);
    L.introduce('l:a', { results: [true, true, true] });
    await L.flush();
    const ui = await new UiStore(kv).load();
    await ui.keep.addRead(read({ words: 321 }));
    await ui.keep.snapshotMonth('2026-10', 100, nums({ learned: 7 }));
    const file = await provenBackup(store, BACKUP_READERS, 1);
    expect(Object.keys(file.documents).sort()).toEqual(['events', 'history', 'state', 'ui']);
    await store.clear();
    await ui.reset();
    expect([...kv.data.keys()]).toEqual([]);
    await restoreBackup(store, readBackup(backupText(file), BACKUP_READERS), BACKUP_READERS);
    const back = (await history(kv))!;
    expect(back.reads[0].words).toBe(321);
    expect(back.months[0].learned).toBe(7);
    expect(() => readBackup(backupText({ ...file, documents: { ...file.documents, history: 'rubbish' } }), BACKUP_READERS)).toThrow(BackupError);
  });
});

describe('each month keeps the numbers Progress shows', () => {
  it('a finished session leaves this month\'s row, and it is the numbers of that moment', async () => {
    const w = await world();
    await session(w, 'right');
    await w.ui.keep.settled();
    const doc = (await history(w.kv))!;
    expect(doc.months).toHaveLength(1);
    const month = w.learner.day(w.now()).slice(0, 7);
    const want = progressNumbers({ learner: w.learner, ui: w.ui, bundle: w.bundle, now: w.now() });
    expect(doc.months[0]).toEqual(JSON.parse(JSON.stringify({ month, at: w.now(), ...want })));
    expect(doc.months[0].sessions).toBe(1);
    expect(doc.months[0].learned + doc.months[0].learning).toBeGreaterThan(0);
  });

  it('a second session the same month refreshes that row; one a month on adds the next', async () => {
    const w = await world();
    await session(w, 'right');
    w.clock.t += 2 * DAY;
    await session(w, 'right');
    await w.ui.keep.settled();
    const first = (await history(w.kv))!.months;
    expect(first).toHaveLength(1);
    expect(first[0].sessions).toBe(2);
    w.clock.t += 40 * DAY;
    await session(w, 'right');
    await w.ui.keep.settled();
    const months = (await history(w.kv))!.months;
    expect(months.map((m) => m.sessions)).toEqual([2, 3]);
    expect(months[0].month < months[1].month).toBe(true);
  });

  it('a store that refuses it does not stop the session from closing', async () => {
    const w = await world();
    const set = w.kv.set.bind(w.kv);
    w.kv.set = async (k, v) => { if (k === HISTORY_KEY) throw new Error('quota'); return set(k, v); };
    const r = await session(w, 'right');
    expect(r.run.finished).toBe(true);
    expect(w.ui.state.stats.sessions).toBe(1);
  });
});
