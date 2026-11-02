// Relámpago: what is open, what is dealt, how a round runs, and what it does to the learner (nothing to a card, nothing to
// the clock the lessons are budgeted by). The real course's graph supplies the words; the learner owns what the test says.
import { beforeAll, describe, expect, it } from 'vitest';
import { rng } from '../../src/exercises/rng';
import { FLASH_OP } from '../../src/games/credit';
import {
  armedTenses, calmRecord, FlashGame, MIN_VERBS, MIN_WORDS, openDecks, ownedVerbs, ownedWords, owns, weightOf, WORDS_DECK, type FlashDeck,
} from '../../src/games/flash';
import { flashKey, GamesStore } from '../../src/games/store';
import { MemoryKV } from '../../src/ui/store/ui';
import type { Bundle } from '../../src/ui/data/bundle';
import { calmAttempts, graphBundle, learnerAt, own, ready as readyLearner, T0, TENSE_NODE, VERBS } from './helpers';

let bundle: Bundle;
beforeAll(async () => { bundle = await graphBundle(); }, 120_000);

const ready = (over: { words?: number; right?: number } = {}) => readyLearner(bundle, over);

describe('what is open', () => {
  it('nothing, for a learner who has only just been taught things', async () => {
    const clock = { t: T0 };
    const learner = await learnerAt(clock);
    for (const v of VERBS) learner.introduce(`l:${v}`, { at: T0, results: [true, true, true] });
    learner.introduce(TENSE_NODE, { at: T0, results: [true, true, true] });
    calmAttempts(learner, TENSE_NODE, 10);
    expect(ownedVerbs(learner)).toEqual([]);
    expect(openDecks(learner, bundle)).toEqual([]);
  });

  it('a card remembered after a wait is owned, one lapsed or still being learned is not', async () => {
    const { learner } = await ready();
    expect(owns(learner, 'l:hablar')).toBe(true);
    learner.introduce('l:nuevo', { at: T0 });
    expect(owns(learner, 'l:nuevo')).toBe(false);
    expect(owns(learner, 'l:nunca')).toBe(false);
  });

  it('a forms deck needs six owned verbs and a tense answered well with no clock; a words deck needs twelve owned words', async () => {
    const { learner } = await ready();
    const decks = openDecks(learner, bundle);
    expect(decks.map((d) => [d.id, d.kind])).toEqual([['preterito', 'forms'], [WORDS_DECK, 'words']]);
    // the eight verbs are words too: a words deck counts them, and is one short of twelve here
    const base = (await ready({ words: 0 })).learner;
    const few = await ready({ words: MIN_WORDS - 1 - ownedWords(base, bundle).length });
    expect(ownedWords(few.learner, bundle)).toHaveLength(MIN_WORDS - 1);
    expect(openDecks(few.learner, bundle).map((d) => d.id)).toEqual(['preterito']);
    expect(ownedVerbs(learner).length).toBeGreaterThanOrEqual(MIN_VERBS);
  });

  it('a tense is dealt at nine of the last ten, and not at eight', async () => {
    const nine = await ready({ right: 9 });
    expect(armedTenses(nine.learner, nine.learner.events())).toEqual(['preterito']);
    const eight = await ready({ right: 8 });
    expect(armedTenses(eight.learner, eight.learner.events())).toEqual([]);
  });

  it('a speed round is not a calm attempt: ten of them, hit or miss, arm nothing and disarm nothing', async () => {
    const eight = await ready({ right: 8 });
    for (let i = 0; i < 10; i++) eight.learner.expose([TENSE_NODE], { at: T0 + i, event: { op: FLASH_OP, grade: 3, tries: 1 } });
    expect(armedTenses(eight.learner, eight.learner.events())).toEqual([]);
    const nine = await ready({ right: 9 });
    for (let i = 0; i < 10; i++) nine.learner.expose([TENSE_NODE], { at: T0 + i, event: { op: FLASH_OP, grade: 1, tries: 2 } });
    expect(armedTenses(nine.learner, nine.learner.events())).toEqual(['preterito']);
    expect(calmRecord(nine.learner.events(), TENSE_NODE)).toEqual({ n: 10, right: 9 });
  });
});

describe('what is dealt', () => {
  const deckOf = (learner: Awaited<ReturnType<typeof ready>>['learner'], id: string): FlashDeck => openDecks(learner, bundle).find((d) => d.id === id)!;

  it('forms only of verbs the learner owns, in the deck\'s tense, and the same seed gives the same deal', async () => {
    const { clock, learner } = await ready();
    const seen = (seed: string) => {
      const g = new FlashGame({ learner, bundle, rng: rng(seed), now: () => clock.t, deck: deckOf(learner, 'preterito') });
      const ids: string[] = [];
      for (let i = 0; i < 40; i++) { ids.push(g.item!.id); g.typed(g.item!.answer); }
      return ids;
    };
    const a = seen('one');
    expect(a).toEqual(seen('one'));
    expect(a).not.toEqual(seen('two'));
    for (const id of a) {
      const [inf, tense] = id.split('|');
      expect(VERBS).toContain(inf);
      expect(tense).toBe('preterito');
    }
  });

  it('never the same question twice in a row', async () => {
    const { clock, learner } = await ready();
    const g = new FlashGame({ learner, bundle, rng: rng('x'), now: () => clock.t, deck: deckOf(learner, 'preterito') });
    let last = '';
    for (let i = 0; i < 60; i++) { expect(g.item!.id).not.toBe(last); last = g.item!.id; g.typed(g.item!.answer); }
  });

  it('the forms that slip come up more often, never more than four times as often', async () => {
    expect(weightOf(undefined)).toBe(1);
    expect(weightOf({ n: 2, miss: 2 })).toBe(1);
    expect(weightOf({ n: 10, miss: 10 })).toBe(4);
    const { clock, learner } = await ready();
    const g = new FlashGame({ learner, bundle, rng: rng('w'), now: () => clock.t, deck: deckOf(learner, 'preterito'), cells: { 'preterito|ellos': { n: 20, miss: 20 } } });
    let ellos = 0;
    for (let i = 0; i < 400; i++) { if (g.item!.cell === 'preterito|ellos') ellos++; g.typed(g.item!.answer); }
    expect(ellos / 400).toBeGreaterThan(0.38);
    expect(ellos / 400).toBeLessThan(0.62);
  });

  it('words only the learner owns, each once before any comes round again, as a choice of four', async () => {
    const { clock, learner } = await ready();
    const owned = new Set(ownedWords(learner, bundle));
    const g = new FlashGame({ learner, bundle, rng: rng('words'), now: () => clock.t, deck: deckOf(learner, WORDS_DECK) });
    const targets: string[] = [];
    for (let i = 0; i < 20; i++) {
      const it = g.item!;
      expect(it.kind).toBe('choose');
      expect((it.card as { options: unknown[] }).options).toHaveLength(4);
      targets.push(it.target);
      expect(g.choose((it.card as { answer: number }).answer)).toBe(true);
    }
    for (const t of targets) expect(owned.has(t)).toBe(true);
    expect(new Set(targets).size).toBeGreaterThanOrEqual(owned.size >= 20 ? 19 : owned.size);
  });
});

describe('a round', () => {
  const start = async (id = 'preterito', seed = 'r') => {
    const w = await ready();
    const deck = openDecks(w.learner, bundle).find((d) => d.id === id)!;
    const game = new FlashGame({ learner: w.learner, bundle, rng: rng(seed), now: () => w.clock.t, deck });
    return { ...w, game, deck };
  };

  it('a typed form is the answer the moment it is right, with no Enter', async () => {
    const { game } = await start();
    const first = game.item!;
    expect(game.typed(first.answer.slice(0, 2))).toBe(false);
    expect(game.typed(first.answer)).toBe(true);
    expect(game.state.right).toBe(1);
    expect(game.item!.key).not.toBe(first.key);
    expect(game.state.paused).toBe(false);
  });

  it('a wrong answer takes three seconds, shows the right one and stops the clock until it is read', async () => {
    const { game, clock } = await start();
    const answer = game.item!.answer;
    clock.t += 2000;
    expect(game.submit('zzz')).toBe('wrong');
    expect(game.state).toMatchObject({ wrong: 1, paused: true });
    expect(game.left).toBe(55);
    expect(game.correction).toMatchObject({ how: 'wrong', answer, given: 'zzz' });
    clock.t += 30_000;
    game.tick();
    expect(game.left).toBe(55);
    game.resume();
    expect(game.correction).toBeUndefined();
    clock.t += 5000;
    game.tick();
    expect(game.left).toBe(50);
  });

  it('an accent slip is told so and costs nothing', async () => {
    const { game } = await start();
    while (!/[áéíóúñ]/.test(game.item!.answer)) game.typed(game.item!.answer);
    const answer = game.item!.answer;
    const plain = answer.normalize('NFD').replace(/\p{M}/gu, '');
    expect(game.submit(plain)).toBe('near');
    expect(game.hint).toBe('Check the accents.');
    expect(game.state.wrong).toBe(0);
    expect(game.state.paused).toBe(false);
    expect(game.typed(answer)).toBe(true);
    expect(game.hint).toBeUndefined();
  });

  it('nothing typed is not an answer', async () => {
    const { game } = await start();
    expect(game.submit('  ')).toBe('empty');
    expect(game.state.wrong + game.state.right + game.state.skipped).toBe(0);
  });

  it('"I don\'t know" costs a second and a half, less than a wrong answer, and shows the answer', async () => {
    const { game } = await start();
    const answer = game.item!.answer;
    game.pass();
    expect(game.state).toMatchObject({ skipped: 1, wrong: 0, paused: true });
    expect(game.left).toBe(59);
    expect(game.correction).toMatchObject({ how: 'skip', answer });
  });

  it('a tap among four: right goes on at once, wrong costs seven seconds and shows the word', async () => {
    const { game } = await start(WORDS_DECK);
    const card = game.item!.card as { answer: number };
    expect(game.choose((card.answer + 1) % 4)).toBe(false);
    expect(game.left).toBe(53);
    expect(game.correction).toMatchObject({ how: 'wrong', picked: (card.answer + 1) % 4 });
    game.resume();
    const next = game.item!.card as { answer: number };
    expect(game.choose(next.answer)).toBe(true);
    expect(game.state).toMatchObject({ right: 1, wrong: 1 });
  });

  it('ends when the sixty seconds are up, and nothing after that is an answer', async () => {
    const { game, clock, learner } = await start();
    clock.t += 61_000;
    expect(game.tick().over).toBe(true);
    const events = learner.events().length;
    expect(game.typed(game.item!.answer)).toBe(false);
    expect(game.submit('zzz')).toBe('ignored');
    expect(learner.events()).toHaveLength(events);
    expect(game.state.right).toBe(0);
  });

  it('leaves every card and the time a review takes exactly as they were, and writes one exposure event on the target of each answer', async () => {
    const { game, clock, learner } = await start();
    const cards = () => JSON.stringify(Object.fromEntries(Object.entries(learner.toJSON().nodes).map(([id, n]) => [id, [n.receptive, n.productive]])));
    const before = { cards: cards(), timing: JSON.stringify(learner.toJSON().timing), spr: learner.secondsPerReview(), events: learner.events().length };
    for (let i = 0; i < 6; i++) { clock.t += 1500; game.typed(game.item!.answer); }
    game.submit('zzz'); game.resume();
    game.pass(); game.resume();
    expect(cards()).toBe(before.cards);
    expect(JSON.stringify(learner.toJSON().timing)).toBe(before.timing);
    expect(learner.secondsPerReview()).toBe(before.spr);
    const fresh = learner.events().slice(before.events);
    expect(fresh).toHaveLength(8);
    expect(fresh.every((e) => e.op === FLASH_OP && e.scored === 'exposure' && e.ms === undefined && e.node === TENSE_NODE)).toBe(true);
    expect(fresh.filter((e) => e.grade === 1)).toHaveLength(2);
  });

  it('is kept once, as the best of its own deck, and a lower one later is not', async () => {
    const { game, clock, deck } = await start();
    const games = new GamesStore(new MemoryKV());
    for (let i = 0; i < 9; i++) { clock.t += 2000; game.typed(game.item!.answer); }
    game.submit('zzz');
    const a = await game.finish(games);
    const b = await game.finish(games);
    expect(b).toBe(a);
    expect(a).toMatchObject({ deck: 'preterito', score: 9, wrong: 1, skipped: 0, best: { isBest: true } });
    expect(a!.missed).toHaveLength(1);
    const doc = await games.read();
    expect(doc.rounds).toHaveLength(1);
    expect(doc.bests[flashKey(deck.id)].score).toBe(9);
    const w2 = await start('preterito', 'again');
    w2.clock.t += 2000; w2.game.typed(w2.game.item!.answer);
    const lower = await w2.game.finish(games);
    expect(lower!.best).toEqual({ was: 9, isBest: false });
  });

  it('a round with no answer in it is not kept', async () => {
    const { game } = await start();
    const games = new GamesStore(new MemoryKV());
    expect(await game.finish(games)).toBeUndefined();
    expect((await games.read()).rounds).toEqual([]);
  });

  it('a deck\'s best does not move when the learner comes to own more verbs', async () => {
    const w = await ready();
    const games = new GamesStore(new MemoryKV());
    const deck = openDecks(w.learner, bundle).find((d) => d.id === 'preterito')!;
    const g = new FlashGame({ learner: w.learner, bundle, rng: rng('k'), now: () => w.clock.t, deck });
    w.clock.t += 2000; g.typed(g.item!.answer);
    await g.finish(games);
    own(w.learner, 'l:escribir'); own(w.learner, 'l:abrir');
    expect(openDecks(w.learner, bundle).map((d) => d.id)).toContain('preterito');
    expect((await games.read()).bests[flashKey('preterito')].score).toBe(1);
  });

  it('a form missed more than once in a round is named, with the answers to what slipped', async () => {
    const { game } = await start();
    const games = new GamesStore(new MemoryKV());
    const asked: string[] = [];
    for (let i = 0; i < 6; i++) { asked.push(game.item!.answer); game.submit('zzz'); game.resume(); }
    const r = await game.finish(games);
    expect(r!.slipped).toMatchObject({ times: expect.any(Number) });
    expect(r!.slipped!.times).toBeGreaterThanOrEqual(2);
    expect(r!.slipped!.cell).toMatch(/^preterito\|/);
    expect(r!.missed.length).toBeLessThanOrEqual(5);
    for (const m of r!.missed) expect(asked).toContain(m.answer);
    // what slipped is added to the count of how often each form is missed, to be dealt more often
    const cells = (await games.read()).cells;
    expect(Object.values(cells).reduce((a, c) => a + c.miss, 0)).toBe(6);
  });
});
