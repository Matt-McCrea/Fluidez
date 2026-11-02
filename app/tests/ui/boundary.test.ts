// The shell had no error boundary: a screen that threw while drawing left a
// blank page with no way out, and the boot failure screen offered only "Try
// again". Components are called without a DOM here (hooks keep their values
// between renders; effects do not run).
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary, SaveBackup, Trouble, bootTrouble } from '../../src/ui/app';
import { IdbStore, StoredDocumentError } from '../../src/learner';
import { MemoryKV } from '../../src/ui/store/ui';

const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0 }));
const download = vi.hoisted(() => vi.fn((_file: unknown) => 'fluidez-backup-test.json'));
// There is no browser to hand a file to; what is handed over is what matters.
vi.mock('../../src/learner/backup', async (orig) => ({ ...(await orig<typeof import('../../src/learner/backup')>()), downloadBackup: download }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [h.slots[i], (v: unknown) => { h.slots[i] = typeof v === 'function' ? (v as (x: unknown) => unknown)(h.slots[i]) : v; }];
  },
  useEffect: () => {},
}));

function find(node: any, pred: (n: any) => boolean, out: any[] = []): any[] {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n) => find(n, pred, out)); return out; }
  if (pred(node)) out.push(node);
  find(node.props?.children, pred, out);
  return out;
}
const text = (node: any): string => (node == null || typeof node === 'boolean' ? '' : typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children));

describe('the boundary around a screen', () => {
  const boundary = (onHome = vi.fn()) => {
    const b = new ErrorBoundary({ onHome, children: 'the screen' });
    b.setState = vi.fn();
    return { b, onHome };
  };

  it('draws the screen while nothing has gone wrong', () => {
    expect(boundary().b.render()).toBe('the screen');
  });

  it('turns a throw into a state, and the state into a way out', () => {
    const { b, onHome } = boundary();
    b.state = ErrorBoundary.getDerivedStateFromError(new Error('boom'));
    const tree: any = b.render();
    expect(tree.type).toBe(Trouble);
    expect(tree.props.detail).toBe('boom');
    const buttons = find(tree, (n) => n.type === 'button');
    expect(buttons.map((n) => n.props['data-home'] !== undefined ? 'home' : 'reload')).toEqual(['home', 'reload']);
    buttons[0].props.onClick();
    expect(onHome).toHaveBeenCalledTimes(1);
    expect(b.setState).toHaveBeenCalledWith({ error: undefined });
  });

  it('keeps a thrown string or object readable', () => {
    expect(ErrorBoundary.getDerivedStateFromError('plain').error?.message).toBe('plain');
  });

  it('is what the shell wraps every screen in, tabs included', async () => {
    const { App } = await import('../../src/ui/app');
    const ctx = { ui: { state: { onboarded: true }, subscribe: () => () => {}, path: { unit: 0 } }, learner: {}, bundle: {}, now: Date.now, refresh() {}, reloadBundle: async () => {} };
    h.slots = [ctx];   // the first state in App is the booted context
    h.at = 0;
    const tree = App({}) as any;
    const wrapped = find(tree, (n) => n.type === ErrorBoundary);
    expect(wrapped).toHaveLength(1);
    expect(find(wrapped[0], (n) => n.type === 'nav'), 'the tabs are inside it, so a throwing tab screen cannot strand the learner').toHaveLength(1);
  });
});

describe('the boot failure screen', () => {
  it('reads a newer document from the error itself, and anything else as it is', () => {
    const newer = new StoredDocumentError('newer', 'state', 'v9 is newer than this build (v3)');
    expect(bootTrouble(newer)).toEqual({ message: newer.message, newer: true });
    const damaged = new StoredDocumentError('unreadable', 'state', 'not an object');
    expect(bootTrouble(damaged)).toEqual({ message: damaged.message, newer: false });
    expect(bootTrouble(new Error('offline'))).toEqual({ message: 'offline', newer: false });
    expect(bootTrouble('plain')).toEqual({ message: 'plain', newer: false });
  });

  it('does not take any error that happens to carry a fault for a newer document', () => {
    expect(bootTrouble(Object.assign(new Error('something else'), { fault: 'newer' }))).toEqual({ message: 'something else', newer: false });
  });

  it('says what happened and shows the ways out it is given', () => {
    const tree: any = Trouble({ message: 'It broke.', children: 'out' });
    expect(text(tree)).toContain('Something went wrong');
    expect(text(tree)).toContain('It broke.');
    expect(text(tree)).toContain('out');
  });
});

// Both failure screens used to offer only Reload or Try again, so a learner whose
// state would not open, or whose screen would not draw, had no way to take their
// progress with them. The backup here is makeBackup's, which does not run the
// dry run: a damaged state is exactly when it is needed.
describe('getting progress out when nothing else works', () => {
  const kvWith = (docs: Record<string, unknown>) => { const kv = new MemoryKV(); for (const [k, v] of Object.entries(docs)) kv.data.set(k, structuredClone(v)); return kv; };
  const click = async (source: Parameters<typeof SaveBackup>[0]['source']) => {
    h.slots = []; h.at = 0;
    await find(SaveBackup({ source }), (n) => n.type === 'button')[0].props.onClick();
    h.at = 0;   // draw it again, as the framework would, to read what it now says
    return text(SaveBackup({ source }));
  };

  it('the boundary and the boot failure screen both carry the way to do it', () => {
    const source = { store: new IdbStore(new MemoryKV()) };
    const b = new ErrorBoundary({ onHome: vi.fn(), backup: source, children: 'screen' });
    b.setState = vi.fn();
    b.state = ErrorBoundary.getDerivedStateFromError(new Error('boom'));
    expect((b.render() as any).props.backup).toBe(source);
    expect(find(Trouble({ message: 'It broke.', backup: source, children: 'out' }), (n) => n.type === SaveBackup)).toHaveLength(1);
    expect(find(Trouble({ message: 'It broke.', children: 'out' }), (n) => n.type === SaveBackup)).toHaveLength(0);
  });

  it('the boot failure screen in the shell offers it, built on the store the failed boot used', async () => {
    const { App } = await import('../../src/ui/app');
    const store = new IdbStore(new MemoryKV());
    h.slots = [null, { message: 'Your saved progress can\'t be read.', newer: false, backup: { store } }];
    h.at = 0;
    const tree = App({ opts: { learnerStore: store } }) as any;
    const found = find(tree, (n) => n.type === Trouble);
    expect(found).toHaveLength(1);
    expect(found[0].props.backup.store).toBe(store);
  });

  it('hands over a damaged state as it is, where the proved backup in Settings would refuse', async () => {
    download.mockClear();
    const damaged = { version: 3, nodes: 'not a table' };
    const note = await click({ store: new IdbStore(kvWith({ state: damaged, events: 'rubbish' })), now: () => 1_700_000_000_000 });
    expect(download).toHaveBeenCalledTimes(1);
    const file: any = download.mock.calls[0][0];
    expect(file.documents.state).toEqual(damaged);
    expect(file.documents.events).toBe('rubbish');
    expect(note).toContain('fluidez-backup-test.json');
    expect(note).not.toMatch(/[–—]| - /);
  });

  it('says so in words when there is nothing to back up, and downloads nothing', async () => {
    download.mockClear();
    const note = await click({ store: new IdbStore(new MemoryKV()) });
    expect(download).not.toHaveBeenCalled();
    expect(note).toContain('There\'s no progress to back up yet.');
  });

  it('a store that will not even be read still ends in a sentence, not a thrown error', async () => {
    const kv = new MemoryKV();
    kv.get = async () => { throw new Error('IndexedDB is not available'); };
    const note = await click({ store: new IdbStore(kv) });
    expect(note).toContain('Couldn\'t make a backup just now.');
  });

  it('runs the flush first, and says if the latest answers could not be saved', async () => {
    download.mockClear();
    const order: string[] = [];
    const flush = vi.fn(async () => { order.push('flush'); throw new Error('write refused'); });
    download.mockImplementationOnce(() => { order.push('download'); return 'fluidez-backup-test.json'; });
    const note = await click({ store: new IdbStore(kvWith({ state: { version: 3 } })), flush });
    expect(order).toEqual(['flush', 'download']);
    expect(note).toMatch(/latest answers/);
  });
});
