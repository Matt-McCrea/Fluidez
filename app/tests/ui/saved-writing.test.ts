// Everything a learner wrote was thrown away: the writing task's text went nowhere once it was compared with the
// model, and the personal sentence was checked and forgotten. It is kept now, under its own key (not in the ui
// document, which is cloned whole on every change), in backups, and nothing shows it yet. Capture only.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IdbStore, Learner } from '../../src/learner';
import { backupText, makeBackup, provenBackup, readBackup, restoreBackup, BACKUP_NEWER, BackupError } from '../../src/learner/backup';
import { Personal } from '../../src/ui/blocks/teach';
import { Writing } from '../../src/ui/blocks/writing';
import { BACKUP_READERS, MemoryKV, UiStore } from '../../src/ui/store/ui';
import { Keep, readWriting, WRITING_KEY, WRITING_VERSION, type WrittenText } from '../../src/ui/store/keep';
import { fixtureBundle } from './driver';

const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0 }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [h.slots[i], (v: unknown) => { h.slots[i] = v; }];
  },
  useMemo: (f: () => unknown) => f(),
  useRef: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = { current: init };
    return h.slots[i];
  },
  useEffect: () => {},
}));

beforeEach(() => { vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { vi.restoreAllMocks(); });

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

const bundle = fixtureBundle();
async function setup() {
  const kv = new MemoryKV();
  const ui = await new UiStore(kv).load();
  const run: any = { bundle, ui, learner: { sessionIndex: 7 }, expose: () => {}, addWords: async () => {} };
  return { kv, ui, run };
}
const saved = async (kv: MemoryKV): Promise<WrittenText[]> => ((await kv.get(WRITING_KEY)) as { entries: WrittenText[] } | undefined)?.entries ?? [];

describe('a writing task is kept when it is sent', () => {
  const TEXT = 'Hola, Vale. Soy Matt. Soy de Toronto. No soy turista.';
  const words = (t: string) => t.split(/\s+/).length;
  const block = { kind: 'writing', task: 'wt-u01-1', purpose: 'output' } as any;
  /** the screen as the framework would draw it again: hooks keep what they hold */
  const redraw = (w: Awaited<ReturnType<typeof setup>>) => { h.at = 0; return expand(Writing({ block, run: w.run, ui: w.ui, onDone: () => {} })); };
  /** the screen drawn from nothing, with `typed` in the box, and the learner pressing the send button */
  const send = (w: Awaited<ReturnType<typeof setup>>, typed = TEXT) => {
    h.slots = [typed, false, {}];
    find(redraw(w), (n) => n.props?.['data-primary'])[0].props.onClick();
  };

  it('the text, what it answered and when, in a document of its own', async () => {
    const w = await setup();
    send(w);
    await w.ui.keep.settled();
    const [e] = await saved(w.kv);
    const task = bundle.tasks.get('wt-u01-1')!;
    expect(e).toMatchObject({ kind: 'task', ref: 'wt-u01-1', prompt: task.prompt, text: TEXT, words: words(TEXT), session: 7 });
    expect(e.id).toMatch(/^task:wt-u01-1:\d+$/);
    expect(typeof e.at).toBe('number');
    expect(e.total).toBe(task.constraints.length);
    expect((await w.kv.get(WRITING_KEY) as { version: number }).version).toBe(WRITING_VERSION);
  });

  it('is not in the ui document, which is cloned whole on every change', async () => {
    const w = await setup();
    send(w);
    await w.ui.keep.settled();
    expect(JSON.stringify(w.ui.state)).not.toContain('Toronto');
    expect(JSON.stringify(await w.kv.get('ui'))).not.toContain('Toronto');
  });

  it('marking it afterwards updates that entry and adds no other', async () => {
    const w = await setup();
    send(w);
    find(redraw(w), (n) => n.props?.role === 'radio')[0].props.onClick();
    await w.ui.keep.settled();
    const entries = await saved(w.kv);
    expect(entries).toHaveLength(1);
    expect(entries[0].rubric).toEqual(['yes']);
    expect(entries[0].text).toBe(TEXT);
  });

  it('writing the same task again keeps both', async () => {
    const w = await setup();
    send(w);
    await w.ui.keep.settled();
    await new Promise((r) => setTimeout(r, 2));
    send(w, `${TEXT} Me gusta el café.`);
    await w.ui.keep.settled();
    expect((await saved(w.kv)).map((e) => e.words)).toEqual([words(TEXT), words(TEXT) + 4]);
  });
});

describe('a personal sentence is kept when it is checked', () => {
  const block = { kind: 'personal', node: 'g:ser-identity' } as any;
  const redraw = (w: Awaited<ReturnType<typeof setup>>) => { h.at = 0; return expand(Personal({ block, run: w.run, onDone: () => {}, ui: w.ui } as any)); };
  /** the screen with these in its state (value, tries, tried, sent, hint), and the learner pressing the button */
  const press = (w: Awaited<ReturnType<typeof setup>>, slots: unknown[]) => {
    h.slots = slots;
    find(redraw(w), (n) => n.props?.['data-primary'])[0].props.onClick();
  };

  it('what was written, what it was about, and how it ended', async () => {
    const w = await setup();
    press(w, ['Soy de Toronto', 1, 'Soy Toronto', null, '']);
    await w.ui.keep.settled();
    const entries = await saved(w.kv);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ kind: 'personal', ref: 'g:ser-identity', text: 'Soy de Toronto', first: 'Soy Toronto', words: 3, session: 7 });
    expect(['pass', 'shown']).toContain(entries[0].result);
    expect(entries[0].prompt.length).toBeGreaterThan(0);
  });

  it('a sentence that is right first time has no first try beside it', async () => {
    const w = await setup();
    press(w, ['Soy de Toronto', 0, '', null, '']);
    await w.ui.keep.settled();
    const [e] = await saved(w.kv);
    // the check either takes it (kept as sent) or sends it back once (kept as it stands, unfinished)
    expect(e).toMatchObject({ text: 'Soy de Toronto' });
    expect(e.first).toBeUndefined();
  });

  it('a sentence sent back once is kept as it stands, and finished when the second try goes', async () => {
    const w = await setup();
    h.slots = ['zzz qqq rrr', 0, '', null, ''];
    find(redraw(w), (n) => n.props?.['data-primary'])[0].props.onClick();
    await w.ui.keep.settled();
    expect(await saved(w.kv)).toEqual([expect.objectContaining({ text: 'zzz qqq rrr' })]);
    expect((await saved(w.kv))[0].result).toBeUndefined();
    // the learner changes it and sends it again: the same entry, now finished
    h.slots[0] = 'Yo soy de Toronto';
    find(redraw(w), (n) => n.props?.['data-primary'])[0].props.onClick();
    await w.ui.keep.settled();
    const entries = await saved(w.kv);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ text: 'Yo soy de Toronto', first: 'zzz qqq rrr' });
    expect(['pass', 'shown']).toContain(entries[0].result);
  });

  it('nothing is kept for a sentence that was only half typed', async () => {
    const w = await setup();
    press(w, ['Soy', 0, '', null, '']);
    await w.ui.keep.settled();
    expect(await saved(w.kv)).toEqual([]);
  });
});

describe('the document', () => {
  const entry = (o: Partial<WrittenText> = {}): WrittenText => ({ id: 'task:wt-u01-1:5', at: 5, kind: 'task', ref: 'wt-u01-1', prompt: 'Write.', text: 'Hola', words: 1, session: 1, ...o });

  it('goes in a backup, and comes back from one', async () => {
    const kv = new MemoryKV();
    const store = new IdbStore(kv);
    const L = await Learner.open(store);
    L.introduce('l:a', { results: [true, true, true] });
    await L.flush();
    const ui = await new UiStore(kv).load();
    await ui.keep.saveWriting(entry({ text: 'Me llamo Ana, soy de Cali.' }));
    const file = await provenBackup(store, BACKUP_READERS, 9);
    expect(Object.keys(file.documents).sort()).toEqual(['events', 'state', 'ui', 'writing']);
    expect(file.versions.writing).toBe(WRITING_VERSION);

    await store.clear();
    await ui.reset();
    expect([...kv.data.keys()]).toEqual([]);
    await restoreBackup(store, readBackup(backupText(file), BACKUP_READERS), BACKUP_READERS);
    expect(await saved(kv)).toEqual([entry({ text: 'Me llamo Ana, soy de Cali.' })]);
  });

  it('a backup whose writing a newer build wrote is refused in words; a damaged one cannot be restored', async () => {
    const kv = new MemoryKV();
    const store = new IdbStore(kv);
    const L = await Learner.open(store);
    L.introduce('l:a', { results: [true, true, true] });
    await L.flush();
    await new UiStore(kv).load();
    const file = await makeBackup(store, BACKUP_READERS, 1);
    const newer = backupText({ ...file, documents: { ...file.documents, writing: { version: WRITING_VERSION + 1, entries: [] } } });
    try { readBackup(newer, BACKUP_READERS); expect.unreachable(); } catch (e) { expect((e as BackupError).message).toBe(BACKUP_NEWER); }
    expect(() => readBackup(backupText({ ...file, documents: { ...file.documents, writing: 'rubbish' } }), BACKUP_READERS)).toThrow(BackupError);
  });

  it('drops an entry that is not one and keeps the rest', () => {
    const doc = readWriting({ version: 1, entries: [entry(), { nonsense: 1 }, null, entry({ id: 'b', text: 'Adiós' })] });
    expect(doc.entries.map((e) => e.text)).toEqual(['Hola', 'Adiós']);
  });

  it('a newer document is left alone and the save says nothing to the learner', async () => {
    const kv = new MemoryKV();
    const newer = { version: WRITING_VERSION + 1, entries: [entry()] };
    await kv.set(WRITING_KEY, newer);
    const keep = new Keep(kv);
    await expect(keep.saveWriting(entry({ id: 'x' }))).resolves.toBeUndefined();
    expect(await kv.get(WRITING_KEY)).toEqual(newer);
  });

  it('a damaged document is kept aside and the writing starts again', async () => {
    const kv = new MemoryKV();
    await kv.set(WRITING_KEY, 'rubbish');
    await new Keep(kv).saveWriting(entry());
    expect(await kv.get(`${WRITING_KEY}.quarantine`)).toBe('rubbish');
    expect(await saved(kv)).toEqual([entry()]);
  });

  it('a store that refuses one write does not stop the next, and two saves at once are both kept', async () => {
    const kv = new MemoryKV();
    const set = kv.set.bind(kv);
    let refuse = true;
    kv.set = async (k, v) => { if (refuse) { refuse = false; throw new Error('quota'); } return set(k, v); };
    const keep = new Keep(kv);
    await expect(keep.saveWriting(entry({ id: 'lost' }))).resolves.toBeUndefined();
    await Promise.all([keep.saveWriting(entry({ id: 'a' })), keep.saveWriting(entry({ id: 'b' }))]);
    expect((await saved(kv)).map((e) => e.id)).toEqual(['a', 'b']);
  });

  it('is deleted with everything else when the learner starts over', async () => {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    await ui.keep.saveWriting(entry());
    await kv.set(`${WRITING_KEY}.quarantine`, 'old');
    await ui.reset();
    expect([...kv.data.keys()]).toEqual([]);
  });
});
