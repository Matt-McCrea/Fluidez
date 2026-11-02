// The shelf shows what is open and nothing else: no locked outlines, no list of what is coming, and no shelf at all for
// a learner who owns nothing yet. Its tiles carry the best, because that is what decides whether to play. There is no
// DOM in this run, so the screens are held to their wiring by what their source says.
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { WORDS_DECK } from '../../src/games/flash';
import { loadShelf, shelfIsEmpty } from '../../src/games/shelf';
import { flashKey } from '../../src/games/store';
import type { Bundle } from '../../src/ui/data/bundle';
import { MemoryKV, UiStore } from '../../src/ui/store/ui';
import { world } from '../ui/driver';
import { graphBundle, learnerAt, ready, T0 } from './helpers';

let bundle: Bundle;
beforeAll(async () => { bundle = await graphBundle(); }, 120_000);

const src = (p: string) => readFileSync(new URL(`../../src/${p}`, import.meta.url), 'utf8');

describe('the shelf', () => {
  it('is empty for a learner who owns nothing yet, and then it is not drawn at all', async () => {
    const learner = await learnerAt({ t: T0 });
    const ui = await new UiStore(new MemoryKV()).load();
    const shelf = await loadShelf({ learner, bundle, ui, now: () => T0 });
    expect(shelf.flash).toEqual([]);
    expect(shelfIsEmpty(shelf)).toBe(true);
    expect(src('ui/games/Board.tsx')).toMatch(/shelfIsEmpty\(shelf\)\) return null/);
  });

  it('lists the decks that are open, each with its best once there is one', async () => {
    const { learner } = await ready(bundle);
    const ui = await new UiStore(new MemoryKV()).load();
    const before = await loadShelf({ learner, bundle, ui, now: () => T0 });
    expect(before.flash.map((t) => [t.deck.id, t.best])).toEqual([['preterito', undefined], [WORDS_DECK, undefined]]);
    await ui.games.finishRound({ at: T0, game: 'flash', deck: 'preterito', score: 11 }, flashKey('preterito'));
    const after = await loadShelf({ learner, bundle, ui, now: () => T0 });
    expect(after.flash.map((t) => [t.deck.id, t.best])).toEqual([['preterito', 11], [WORDS_DECK, undefined]]);
    expect(shelfIsEmpty(after)).toBe(false);
  });

  it('does not list a game it cannot deal: a best in a deck that is no longer open shows nothing', async () => {
    const { learner } = await ready(bundle, { right: 8 });
    const ui = await new UiStore(new MemoryKV()).load();
    await ui.games.finishRound({ at: T0, game: 'flash', deck: 'preterito', score: 11 }, flashKey('preterito'));
    const shelf = await loadShelf({ learner, bundle, ui, now: () => T0 });
    expect(shelf.flash.map((t) => t.deck.id)).toEqual([WORDS_DECK]);
  });
});

describe('the rescue on the shelf', () => {
  const DAY = 86_400_000;
  async function due(days: number, nodes = ['g:ser-identity', 'c:me-llamo', 'c:soy-de', 'l:café']) {
    const w = await world();
    for (const n of nodes) w.learner.introduce(n, { at: w.clock.t, results: [true, true, true] });
    w.clock.t += days * DAY;
    return w;
  }

  it('is offered when enough is due for a round, with how many are ready and how many a round takes', async () => {
    const w = await due(6);
    const shelf = await loadShelf({ learner: w.learner, bundle: w.bundle, ui: w.ui, now: w.now });
    expect(shelf.rescue).toEqual({ count: 4, asks: 4 });
    expect(shelfIsEmpty(shelf)).toBe(false);
  });

  it('is not offered with nothing due, or with fewer than a round', async () => {
    const none = await due(0);
    expect((await loadShelf({ learner: none.learner, bundle: none.bundle, ui: none.ui, now: none.now })).rescue).toBeUndefined();
    const w = await due(6, ['l:café', 'c:soy-de']);
    const shelf = await loadShelf({ learner: w.learner, bundle: w.bundle, ui: w.ui, now: w.now });
    expect(shelf.rescue).toBeUndefined();
  });
});

describe('De corrido on the shelf', () => {
  const DAY = 86_400_000;
  it('is offered once a chapter was first read a week ago, and not before', async () => {
    const w = await world();
    w.clock.t += 100 * DAY;
    const shelf = () => loadShelf({ learner: w.learner, bundle: w.bundle, ui: w.ui, now: w.now });
    expect((await shelf()).reread).toBeUndefined();
    w.learner.ledger.markSeen('chapter', 'ch001', { at: w.now() - 3 * DAY });
    expect((await shelf()).reread).toBeUndefined();
    w.learner.ledger.markSeen('chapter', 'ch002', { at: w.now() - 9 * DAY });
    const open = await shelf();
    expect(open.reread).toBe(1);
    expect(shelfIsEmpty(open)).toBe(false);
  });

  it('rests for a month after a reading, counted or not', async () => {
    const w = await world();
    w.clock.t += 100 * DAY;
    w.learner.ledger.markSeen('chapter', 'ch002', { at: w.now() - 90 * DAY });
    await w.ui.games.addReading({ at: w.now() - 2 * DAY, chapter: 'ch002', band: 'A1', words: 100, secs: 50, wpm: 120, right: 1, of: 2, counted: false });
    expect((await loadShelf({ learner: w.learner, bundle: w.bundle, ui: w.ui, now: w.now })).reread).toBeUndefined();
  });
});

describe('what the screens are', () => {
  it('the practice screen offers the games, and the shelf is the only way in', () => {
    expect(src('ui/screens/practice.tsx')).toMatch(/<Board onPlay=\{onPlay\}/);
    expect(src('ui/screens/practice.tsx')).toMatch(/<Play choice=\{playing\}/);
  });

  it('Settings stays a tab and no Play tab is added (the owner decides that)', () => {
    const app = src('ui/app.tsx');
    expect(app).toMatch(/\['home', 'story', 'reference', 'progress', 'settings'\]/);
    expect(app).not.toMatch(/'play'/);
  });

  it('shows nothing locked, nothing to unlock and nothing coming', () => {
    for (const f of ['ui/games/Board.tsx', 'ui/games/Flash.tsx', 'ui/games/Play.tsx', 'ui/games/Rescue.tsx', 'ui/games/Corrido.tsx']) {
      const code = src(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code, f).not.toMatch(/locked|unlock|coming soon|opens when|after your first/i);
    }
  });

  it('a round starts in the tap that asked for it, and its one input is never taken off the page', () => {
    const f = src('ui/games/Flash.tsx');
    const begin = f.slice(f.indexOf('const begin = () => {'), f.indexOf('const over = '));
    expect(begin).not.toMatch(/await|\.then\(/);
    const round = f.slice(f.indexOf('function Round('), f.indexOf('function Over('));
    // a key that changes puts the card back on the page, and the keyboard goes with the input
    expect(round).not.toMatch(/<(section|main|AnswerField)[^>]*\bkey=/);
    expect(round.match(/<AnswerField/g)).toHaveLength(1);
  });
});
