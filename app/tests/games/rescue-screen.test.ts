// Rescate drawn and driven without a DOM (see screen.test.ts). The cards are the app's own CardView, which is left
// unexpanded so a test can hand it the outcome a learner's answer would give.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RescueGame } from '../../src/ui/games/Rescue';
import { RESCUE_OP } from '../../src/games/credit';
import { GAMES_KEY, type GamesDoc } from '../../src/games/store';
import { answer, world } from '../ui/driver';

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
  if (typeof node.type === 'function' && node.type.name !== 'CardView') return expand(node.type(node.props));
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

const DAY = 86_400_000;
async function screen() {
  const w = await world();
  for (const n of ['g:ser-identity', 'c:me-llamo', 'c:soy-de', 'l:café']) w.learner.introduce(n, { at: w.clock.t, results: [true, true, true] });
  w.clock.t += 6 * DAY;
  h.app = { learner: w.learner, bundle: w.bundle, ui: w.ui, now: w.now, refresh: () => {} };
  h.slots = [];
  const draw = () => { h.at = 0; return expand(RescueGame({ onExit: () => {} })); };
  return { ...w, draw };
}
const cardView = (tree: any) => find(tree, (n) => typeof n.type === 'function' && n.type.name === 'CardView')[0];
const settle = () => new Promise((r) => setTimeout(r, 20));

describe('the ready card', () => {
  it('says how many are ready, that there is no clock, and that each answer is a real review', async () => {
    const s = await screen();
    const t = text(s.draw());
    expect(t).toMatch(/4 cards are ready/);
    expect(t).toMatch(/There is no clock/);
    expect(t).toMatch(/real review/);
    expect(t).not.toMatch(/behind|overdue|late|slip|lost/i);
  });
});

describe('a rescue that ends with nothing answered', () => {
  it('does not say nothing is ready while cards are, and does not offer the same empty round again', async () => {
    const s = await screen();
    await find(s.draw(), (n) => n.props?.['data-start'] !== undefined)[0].props.onClick();
    await settle();
    find(s.draw(), (n) => n.props?.['data-stop'] !== undefined)[0].props.onClick();
    await settle();
    const over = text(s.draw());
    expect(over).toMatch(/Nothing answered, so nothing has changed/);
    expect(over).not.toMatch(/Nothing is ready/);
    expect(over).not.toMatch(/Another round/);
  });
});

describe('a rescue', () => {
  it('asks each due card once, and ends with what was saved, when the saved ones come back, and a round of its own kept', async () => {
    const s = await screen();
    find(s.draw(), (n) => n.props?.['data-start'] !== undefined)[0].props.onClick();
    await settle();
    let tree = s.draw();
    let asked = 0;
    while (cardView(tree)) {
      const cv = cardView(tree);
      expect(cv.props.pos.of).toBe(4);
      expect(cv.props.pos.n).toBe(asked + 1);
      cv.props.onDone({ ...answer(cv.props.card, asked === 0 ? 'wrong' : 'right'), ms: 5000 });
      asked++;
      tree = s.draw();
      if (asked > 10) break;
    }
    await settle();
    tree = s.draw();
    expect(asked).toBe(4);
    expect(text(find(tree, (n) => n.props?.['data-score'] !== undefined)[0])).toMatch(/^3 of 4 saved/);
    const t = text(tree);
    expect(t).toMatch(/set to come back in/);
    expect(t).toMatch(/The one you missed comes back sooner/);
    const doc = (await s.kv.get(GAMES_KEY)) as GamesDoc;
    expect(doc.rounds).toEqual([{ at: s.now(), game: 'rescue', deck: 'due', score: 3, wrong: 1 }]);
    expect(doc.bests).toEqual({});
    expect(s.learner.events().filter((e) => e.op === RESCUE_OP)).toHaveLength(4);
  });

  it('is pleased when every one was remembered, and not before', async () => {
    const s = await screen();
    find(s.draw(), (n) => n.props?.['data-start'] !== undefined)[0].props.onClick();
    await settle();
    let tree = s.draw();
    let n = 0;
    while (cardView(tree) && n++ < 10) { const cv = cardView(tree); cv.props.onDone({ ...answer(cv.props.card, 'right'), ms: 1 }); tree = s.draw(); }
    await settle();
    expect(text(find(s.draw(), (x) => x.props?.['data-remark'] !== undefined)[0])).toBe('Not one missed.');
  });

  it('has nothing to say about a best: there is none', async () => {
    const s = await screen();
    const t = text(s.draw());
    expect(t).not.toMatch(/best|score to beat|record/i);
  });
});
