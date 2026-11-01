// Closing a session writes the path, the tally and the learner in one go. When
// the store refuses that write the lesson is not over: finish() and stop() used
// to mark themselves finished first, so a second try did nothing and the screen
// stayed on "Saving…". Here the store refuses, the call rejects, the learner is
// left able to try again, and the session counts once however many tries it took.
import { describe, expect, it, vi } from 'vitest';
import { IdbStore, Learner, MemoryStore } from '../../src/learner';
import { SessionRunner, compilePlan } from '../../src/ui/session/runner';
import { MemoryKV, PATH_KEY, SESSION_KEY, UiStore, type SavedSession } from '../../src/ui/store/ui';
import type { Bundle } from '../../src/ui/data/bundle';
import { fixtureBundle } from './driver';

// The screen is driven one render at a time with hooks that keep their values
// between renders (there is no DOM); effects do not run.
const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0, ctx: undefined as unknown }));
vi.mock('preact/hooks', () => {
  const slot = (init: () => unknown) => { const i = h.at++; if (!(i in h.slots)) h.slots[i] = init(); return i; };
  return {
    useState: (init: unknown) => {
      const i = slot(() => (typeof init === 'function' ? (init as () => unknown)() : init));
      return [h.slots[i], (v: unknown) => { h.slots[i] = typeof v === 'function' ? (v as (x: unknown) => unknown)(h.slots[i]) : v; }];
    },
    useRef: (v: unknown) => h.slots[slot(() => ({ current: v }))],
    useMemo: (f: () => unknown) => h.slots[slot(f)],
    useContext: () => h.ctx,
    useEffect: () => {},
  };
});

/** A store that refuses its next `refusing` multi-document writes, as a full disk does. */
class FlakyKV extends MemoryKV {
  refusing = 0;
  /** while true, every write is refused */
  full = false;
  override async setMany(entries: [string, unknown][]) {
    if (this.refusing > 0) { this.refusing--; throw new Error('The disk is full'); }
    return super.setMany(entries);
  }
  override async set(k: string, v: unknown) {
    if (this.full) throw new Error('The disk is full');
    return super.set(k, v);
  }
}

/** shared: the learner and the UI documents live in one key-value store, as they do in the browser. */
async function world(shared: boolean) {
  const clock = { t: new Date(2026, 9, 1, 18).getTime() };
  const now = () => clock.t;
  const kv = new FlakyKV();
  const learner = await Learner.open(shared ? new IdbStore(kv) : new MemoryStore(), { now });
  const ui = await new UiStore(kv).load();
  await ui.update((s) => { s.onboarded = true; });
  const bundle = fixtureBundle();
  const plan = compilePlan(learner, bundle, ui, { now: now() });
  const run = new SessionRunner(learner, bundle, ui, plan, now);
  run.start();
  const saved: SavedSession = {
    version: 1, learnerId: ui.state.learnerId, sessionIndex: learner.sessionIndex, mode: 'next', tier: plan.tier, capMinutes: 20,
    startedAt: now(), elapsedMs: 0, savedAt: now(), plan, block: plan.blocks.map((b) => b.kind).lastIndexOf('close') - 1, cursor: {}, runner: run.snapshot(),
  };
  await ui.saveSession(saved);
  return { kv, learner, ui, run, saved, bundle, now };
}

/** What a fresh boot would read back. */
const stored = async (kv: MemoryKV) => { const ui = await new UiStore(kv).load(); return { sessions: ui.state.stats.sessions, core: ui.path.coreSessions }; };

describe.each([['one store for everything', true], ['the learner apart', false]])('a refused write at the end of a lesson (%s)', (_, shared) => {
  it('finish() rejects, is not finished, and works when tried again; the session counts once', async () => {
    const w = await world(shared);
    w.kv.refusing = 1;
    await expect(w.run.finish()).rejects.toThrow('The disk is full');
    expect(w.run.finished).toBe(false);
    expect(w.kv.data.has(SESSION_KEY), 'the resume point stays until the close is saved').toBe(true);

    await w.run.finish();
    expect(w.run.finished).toBe(true);
    expect(w.kv.data.has(SESSION_KEY)).toBe(false);
    expect(w.ui.state.stats.sessions).toBe(1);
    expect(await stored(w.kv)).toEqual({ sessions: 1, core: 1 });
  });

  it('two refusals in a row still count the session once', async () => {
    const w = await world(shared);
    w.kv.refusing = 2;
    await expect(w.run.finish()).rejects.toThrow();
    await expect(w.run.finish()).rejects.toThrow();
    await w.run.finish();
    expect(w.ui.state.stats.sessions).toBe(1);
    expect(await stored(w.kv)).toEqual({ sessions: 1, core: 1 });
  });

  it('stop() is the same: rejects, can be tried again, counts once and does not advance the course', async () => {
    const w = await world(shared);
    const day = w.ui.path.day, unit = w.ui.path.unit;
    w.kv.refusing = 1;
    await expect(w.run.stop()).rejects.toThrow('The disk is full');
    expect(w.run.finished).toBe(false);

    await w.run.stop();
    expect(w.run.finished).toBe(true);
    expect(w.run.stopped).toBe(true);
    expect(w.ui.state.stats.sessions).toBe(1);
    expect(w.ui.path).toMatchObject({ day, unit });
    expect((await stored(w.kv)).sessions).toBe(1);
    expect(w.kv.data.has(PATH_KEY)).toBe(true);
  });

  it('a close that was saved the first time is unchanged: a second call is a no-op', async () => {
    const w = await world(shared);
    await w.run.finish();
    await w.run.finish();
    expect(w.ui.state.stats.sessions).toBe(1);
  });
});

/**
 * One screen, one render at a time: the component is called down to its own
 * elements, so the blocks and buttons it hands out stay unexpanded and can be
 * pressed. State lives in `h.slots` between renders.
 */
function drive(w: { learner: Learner; ui: UiStore; bundle: Bundle; now: () => number }, screen: (props: any) => any, props: object) {
  vi.stubGlobal('window', globalThis);   // the screens clear their timers through window
  const refresh = vi.fn();
  h.slots = [];
  h.ctx = { learner: w.learner, ui: w.ui, bundle: w.bundle, now: w.now, refresh, learnerStore: w.learner.backing, loader: undefined, reloadBundle: async () => {}, resetAll: async () => {} };
  const draw = () => { h.at = 0; return screen(props) as any; };
  const find = (node: any, pred: (n: any) => boolean, out: any[] = []): any[] => {
    if (node == null || typeof node !== 'object') return out;
    if (Array.isArray(node)) { node.forEach((n) => find(n, pred, out)); return out; }
    if (pred(node)) out.push(node);
    find(node.props?.children, pred, out);
    return out;
  };
  const text = (node: any): string => (node == null || typeof node === 'boolean' ? '' : typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children));
  /** press the one element on screen that matches */
  const press = (pred: (n: any) => boolean, handler = 'onClick') => {
    const hit = find(draw(), pred);
    expect(hit, 'one such element is on screen').toHaveLength(1);
    hit[0].props[handler]();
  };
  const settle = () => new Promise<void>((r) => setTimeout(r, 0));
  return { refresh, draw, find, text, press, settle };
}

describe('the session screen when the close is refused', () => {
  async function open(shared: boolean) {
    const w = await world(shared);
    const { Session } = await import('../../src/ui/screens/session');
    const onExit = vi.fn();
    return { ...w, onExit, ...drive(w, Session, { mode: 'next', resume: w.saved, onExit, onAnother: () => {} }) };
  }

  it.each([['one store for everything', true], ['the learner apart', false]])('the last block ends in a way to try again, not a screen stuck on Saving (%s)', async (_, shared) => {
    const w = await open(shared);
    w.kv.refusing = 1;
    w.press((n) => typeof n.props?.onDone === 'function' && n.props.run, 'onDone');
    await w.settle();
    let tree = w.draw();
    expect(w.text(tree)).not.toContain('Saving');
    expect(w.find(tree, (n) => n.props?.title === "That didn't save"), 'the screen says it did not save').toHaveLength(1);
    expect(w.text(tree)).toContain('The disk is full');
    expect(w.ui.state.stats.sessions).toBe(0);

    w.press((n) => n.props?.label === 'Try again');
    await w.settle();
    tree = w.draw();
    expect(w.find(tree, (n) => n.props?.title === "That didn't save")).toHaveLength(0);
    expect(w.find(tree, (n) => n.props?.block?.kind === 'close'), 'the close screen is open').toHaveLength(1);
    expect(w.ui.state.stats.sessions).toBe(1);
    expect(await stored(w.kv)).toEqual({ sessions: 1, core: 1 });
  });

  it('leaving still leaves when the store refuses the resume point', async () => {
    const w = await open(true);
    w.press((n) => n.props?.['aria-label'] === 'Leave this session');
    w.kv.full = true;
    w.press((n) => n.props?.['data-leave'] !== undefined);
    await w.settle();
    expect(w.onExit).toHaveBeenCalledTimes(1);
  });
});

describe('the other screens that wait for a save', () => {
  it('onboarding goes on to Home when the store refuses what it wrote', async () => {
    const w = await world(true);
    const { Onboarding } = await import('../../src/ui/screens/onboarding');
    const onDone = vi.fn();
    const d = drive(w, Onboarding, { onDone });
    d.press((n) => n.props?.label === 'Get started');
    d.press((n) => n.props?.['aria-label'] === 'Personal interest');
    d.press((n) => n.props?.['data-primary'] !== undefined);
    w.kv.full = true;
    d.press((n) => n.props?.['data-zero'] !== undefined);
    await d.settle();
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(w.ui.state.onboarded).toBe(true);
  });

  it('finishing a re-read goes back to the chapters when the store refuses the tally', async () => {
    const w = await world(true);
    const { Story } = await import('../../src/ui/screens/story');
    const chapter = w.bundle.index.chapters[0];
    w.learner.ledger.markSeen('chapter', chapter.id, { deliberate: false, at: w.now() });
    const d = drive(w, Story, {});
    d.press((n) => n.type === 'button' && n.props?.class === 'row');
    expect(d.find(d.draw(), (n) => n.props?.finishLabel === 'Done'), 'the chapter is open').toHaveLength(1);
    w.kv.full = true;
    d.press((n) => n.props?.finishLabel === 'Done', 'onFinish');
    await d.settle();
    expect(d.find(d.draw(), (n) => n.props?.finishLabel === 'Done'), 'back on the list of chapters').toHaveLength(0);
  });
});
