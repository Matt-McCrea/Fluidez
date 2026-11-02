// De corrido drawn and driven without a DOM (see screen.test.ts): the ready card, the text with nothing to tap in it,
// the questions, and the end, for a run that counts, one that misses a question and one that goes through at a pace nobody reads at.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Reread } from '../../src/ui/games/Corrido';
import { rng } from '../../src/exercises/rng';
import { pickReading, type Question } from '../../src/games/reading';
import { GAMES_KEY, rereadKey, type GamesDoc } from '../../src/games/store';
import { StoryChapter } from '../../src/content/schema';
import { world } from '../ui/driver';

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
  if (typeof node.type === 'function' && node.type.name !== 'CardRun') return expand(node.type(node.props));
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
const settle = () => new Promise((r) => setTimeout(r, 20));

const DAY = 86_400_000;
const FAIR = (n: number): Question => ({ q: 'What happened?', options: ['Nothing at all happened', 'Vale arrived', 'Simón spoke very quickly all day', 'Hernando left'], answer: n % 2 === 0 ? 1 : 3 });
const WORDS = Array.from({ length: 280 }, (_, i) => `palabra${i % 9}`).join(' ') + '.';

async function screen(best?: number, last?: number) {
  const w = await world();
  w.clock.t += 100 * DAY;
  w.learner.introduce('l:café', { at: w.clock.t - 40 * DAY, results: [true, true, true] });
  const chapter = StoryChapter.parse({ id: 'ch850', unit: 'u01', title: 'Una mañana', text: WORDS, questions: [FAIR(0), FAIR(1), FAIR(2)], hook: 'x', lexemes: ['l:café'] });
  w.bundle.chapters.set(chapter.id, chapter);
  w.learner.ledger.markSeen('chapter', chapter.id, { at: w.clock.t - 30 * DAY });
  const pick = (await pickReading({ learner: w.learner, bundle: w.bundle, doc: { reading: [] }, rng: rng('s'), now: w.now }))!;
  h.app = { learner: w.learner, bundle: w.bundle, ui: w.ui, now: w.now, refresh: () => {} };
  h.slots = [];
  const draw = () => { h.at = 0; return expand(Reread({ pick, best, last, onAnother: () => {}, onExit: () => {} })); };
  const tap = (tree: any, attr: string) => find(tree, (n) => n.props?.[attr] !== undefined && typeof n.props.onClick === 'function')[0].props.onClick();
  /** read for `secs`, then answer the check with `rights` right */
  const run = async (secs: number, rights: number) => {
    tap(draw(), 'data-start');
    w.clock.t += secs * 1000;
    tap(draw(), 'data-primary');
    const check = find(draw(), (n) => typeof n.type === 'function' && n.type.name === 'CardRun')[0];
    check.props.cards.forEach((_c: unknown, i: number) => check.props.onAnswer(i, { correct: i < rights, tries: 1, ms: 1000 }));
    check.props.onDone();
    await settle();
    return draw();
  };
  return { ...w, pick, draw, tap, run };
}

describe('the ready card', () => {
  it('names the chapter, says how long it is and what the check is, and shows the best on a chapter like this once there is one', async () => {
    const s = await screen(131);
    const t = text(s.draw());
    expect(t).toMatch(/Una mañana/);
    expect(t).toMatch(/280 words/);
    expect(t).toMatch(/answer 3 questions with the text gone/);
    expect(t).toMatch(/131 words a minute is your best on a chapter like this/);
    expect(text(find((await screen()).draw(), (n) => n.props?.['data-best'] !== undefined)[0])).toMatch(/No pace kept/);
  });
});

describe('the text', () => {
  it('has nothing in it to tap and no English behind it', async () => {
    const s = await screen();
    s.tap(s.draw(), 'data-start');
    const tree = s.draw();
    const article = find(tree, (n) => n.type === 'article')[0];
    expect(find(article, (n) => n.type === 'button')).toEqual([]);
    expect(text(article)).toContain('palabra0');
    expect(find(tree, (n) => n.props?.['data-primary'] !== undefined)).toHaveLength(1);
  });
});

describe('a reading', () => {
  it('that counts: the pace kept, the best set, the words counted as seen, and what was asked of the text gone', async () => {
    const s = await screen();
    const seen = s.learner.node('l:café')!.exposures;
    const over = await s.run(140, 3);
    expect(text(find(over, (n) => n.props?.['data-score'] !== undefined)[0])).toBe('120 words a minute, 3 of 3 questions right');
    expect(text(find(over, (n) => n.props?.['data-best'] !== undefined)[0])).toBe('That is your first score here.');
    const doc = (await s.kv.get(GAMES_KEY)) as GamesDoc;
    expect(doc.reading).toEqual([{ at: s.now(), chapter: 'ch850', band: 'A1', words: 280, secs: 140, wpm: 120, right: 3, of: 3, counted: true }]);
    expect(doc.bests[rereadKey('A1')].score).toBe(120);
    expect(s.learner.node('l:café')!.exposures).toBe(seen + 1);
    expect(s.learner.events().filter((e) => e.scored === 'review' && e.at >= s.now())).toEqual([]);
  });

  it('faster than the last time says by how much, and a slower one says nothing about it', async () => {
    const fast = await screen(undefined, 100);
    const over = await fast.run(140, 3);
    expect(text(find(over, (n) => n.props?.['data-remark'] !== undefined)[0])).toBe('20 words a minute faster than the last time.');
    const slow = await screen(undefined, 150);
    expect(find(await slow.run(140, 3), (n) => n.props?.['data-remark'] !== undefined)).toHaveLength(0);
  });

  it('with a question missed: the pace is logged, nothing is set and nothing is counted, and it says why', async () => {
    const s = await screen();
    const seen = s.learner.node('l:café')!.exposures;
    const over = await s.run(140, 2);
    expect(text(find(over, (n) => n.props?.['data-nocount'] !== undefined)[0])).toBe('It does not count: a reading counts when every question is right.');
    expect(find(over, (n) => n.props?.['data-best'] !== undefined)).toHaveLength(0);
    const doc = (await s.kv.get(GAMES_KEY)) as GamesDoc;
    expect(doc.reading[0]).toMatchObject({ wpm: 120, right: 2, of: 3, counted: false });
    expect(doc.bests).toEqual({});
    expect(s.learner.node('l:café')!.exposures).toBe(seen);
  });

  it('at a pace nobody reads at: logged, and not counted whatever the answers', async () => {
    const s = await screen();
    const over = await s.run(20, 3);
    expect(text(find(over, (n) => n.props?.['data-nocount'] !== undefined)[0])).toBe('That is faster than a text can be read: more than 400 words a minute. It does not count.');
    const doc = (await s.kv.get(GAMES_KEY)) as GamesDoc;
    expect(doc.reading[0]).toMatchObject({ wpm: 840, right: 3, counted: false });
    expect(doc.bests).toEqual({});
  });
});
