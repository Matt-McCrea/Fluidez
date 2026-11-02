// Relámpago drawn and driven without a DOM: the screens are expanded to elements, and a learner's taps and keystrokes are
// the props the framework would call. It holds what the source scans cannot: the round has one input, a typed form
// resolves in it, "I don't know" shows the answer and waits for Next, and the end of a round shows the score and the best.
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Bundle } from '../../src/ui/data/bundle';
import { GamesStore, flashKey } from '../../src/games/store';
import { MemoryKV, UiStore } from '../../src/ui/store/ui';
import { Flash } from '../../src/ui/games/Flash';
import { openDecks } from '../../src/games/flash';
import { graphBundle, ready } from './helpers';

const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0, app: undefined as unknown }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [h.slots[i], (v: unknown) => { h.slots[i] = typeof v === 'function' ? (v as (x: unknown) => unknown)(h.slots[i]) : v; }];
  },
  useMemo: (f: () => unknown) => f(),
  useRef: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = { current: init };
    return h.slots[i];
  },
  useEffect: () => {},
}));
vi.mock('../../src/ui/context', () => ({ useApp: () => h.app }));

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
const text = (node: any): string => (node == null || typeof node === 'boolean' ? '' : typeof node !== 'object' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children));

let bundle: Bundle;
beforeAll(async () => { bundle = await graphBundle(); }, 120_000);

async function screen(deckId = 'preterito') {
  const w = await ready(bundle);
  const kv = new MemoryKV();
  const ui = await new UiStore(kv).load();
  h.app = { learner: w.learner, bundle, ui, now: () => w.clock.t, refresh: () => {} };
  h.slots = [];
  const deck = openDecks(w.learner, bundle).find((d) => d.id === deckId)!;
  const draw = () => { h.at = 0; return expand(Flash({ deck, onExit: () => {}, onPractise: () => {} })); };
  const tap = (tree: any, attr: string) => find(tree, (n) => n.props?.[attr] !== undefined && typeof n.props.onClick === 'function')[0].props.onClick();
  return { ...w, ui, draw, tap, kv };
}

describe('the ready card', () => {
  it('says how it works, what a wrong answer costs and that the schedule is untouched, and starts with one tap', async () => {
    const s = await screen();
    const tree0 = s.draw();
    const t0 = text(tree0);
    expect(t0).toMatch(/Sixty seconds/);
    expect(t0).toMatch(/takes 3 seconds off the clock/);
    expect(t0).toMatch(/review schedule and today's plan stay as they are/);
    expect(find(tree0, (n) => n.props?.['data-start'] !== undefined)).toHaveLength(1);
  });
});

describe('a round', () => {
  it('has one input; a typed form is the answer the moment it is right; "I don\'t know" shows the answer and waits for Next', async () => {
    const s = await screen();
    s.tap(s.draw(), 'data-start');
    let tree = s.draw();
    const inputs = find(tree, (n) => n.type === 'input');
    expect(inputs).toHaveLength(1);
    const score = () => text(find(s.draw(), (n) => n.props?.['data-score'] !== undefined)[0]);
    expect(score()).toMatch(/^0/);
    // the form for the cue on screen
    const game = (h.slots.find((x) => x && typeof x === 'object' && 'item' in (x as object)) ?? undefined) as any;
    expect(game.item.kind).toBe('type');
    inputs[0].props.onInput({ currentTarget: { value: game.item.answer } });
    expect(score()).toMatch(/^1/);
    // a second item: pass
    const cue = text(find(s.draw(), (n) => n.props?.class === 'prompt')[0]);
    s.tap(s.draw(), 'data-pass');
    tree = s.draw();
    expect(text(find(tree, (n) => n.props?.class === 'miss')[0])).toMatch(/^It is /);
    expect(find(tree, (n) => n.props?.['data-pass'] !== undefined)).toHaveLength(0);
    expect(game.state.paused).toBe(true);
    // the same prompt stays while the answer is read
    expect(text(find(tree, (n) => n.props?.class === 'prompt')[0])).toBe(cue);
    s.tap(tree, 'data-primary');
    expect(game.state.paused).toBe(false);
    expect(text(find(s.draw(), (n) => n.props?.class === 'miss'))).toBe('');
  });

  it('ends with the score, the best and what slipped, and Again is the primary button', async () => {
    const s = await screen();
    s.tap(s.draw(), 'data-start');
    s.draw();
    const game = (h.slots.find((x) => x && typeof x === 'object' && 'item' in (x as object))) as any;
    const input = () => find(s.draw(), (n) => n.type === 'input')[0];
    for (let i = 0; i < 4; i++) { s.clock.t += 2000; input().props.onInput({ currentTarget: { value: game.item.answer } }); }
    s.tap(s.draw(), 'data-pass');
    s.tap(s.draw(), 'data-primary');
    // the clock runs out between two answers; the next answer ends the round
    s.clock.t += 61_000;
    input().props.onInput({ currentTarget: { value: game.item.answer } });
    await new Promise((r) => setTimeout(r, 20));
    const over = s.draw();
    expect(text(find(over, (n) => n.props?.['data-score'] !== undefined)[0])).toMatch(/^4 forms right/);
    expect(text(find(over, (n) => n.props?.['data-best'] !== undefined)[0])).toBe('That is your first score here.');
    expect(find(over, (n) => n.props?.['data-missed'] !== undefined)).toHaveLength(1);
    expect(find(over, (n) => n.props?.['data-primary'] !== undefined && text(n) === 'Again')).toHaveLength(1);
    expect(find(over, (n) => n.props?.['data-practise'] !== undefined)).toHaveLength(1);
    expect((await new GamesStore(s.kv).read()).bests[flashKey('preterito')].score).toBe(4);
  });
});
