// Uno u otro: a choice of two on the contrast store (audit R23, R10). What is held: only a contrast the learner has
// reached opens a deck; a deck is balanced in every stretch of the deal and in the place of the right option; a contrast
// earlier text decides has no clock; a round is exposure and moves no card; a best is kept per deck; and blind tapping,
// a cue table and always the commoner answer all lose to knowing.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { ContrastFile } from '../../src/content/schema';
import { rng } from '../../src/exercises/rng';
import { Rating } from '../../src/learner';
import { unoReaction } from '../../src/games/reactions';
import { GamesStore, unoKey } from '../../src/games/store';
import { balancedDeck, dealOrder, fairDeck, openUnoDecks, pairOf, UnoGame, UNTIMED_ITEMS, type UnoDeck } from '../../src/games/uno';
import { knownSet } from '../../src/compiler';
import { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { MemoryKV } from '../../src/ui/store/ui';
import { chance, first, longest, mean, shortest } from '../ui/guess-play';
import { learnerAt, own, T0 } from './helpers';

const DIR = join(__dirname, '../../content/contrasts');
let bundle: Bundle;
let allIds: string[];
beforeAll(async () => {
  const { units, nodes } = await new ContentLoader().core();
  const contrasts = readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => ContrastFile.parse(JSON.parse(readFileSync(join(DIR, f), 'utf8'))));
  bundle = new Bundle(units, nodes, { sentences: [], chapters: [], scenes: [], writing: [], scripts: [], contrasts });
  allIds = [...bundle.course.nodes.keys()];
}, 120_000);

/** A learner who owns everything in the course except the contrasts named, so a contrast is reached only if it is let in. */
async function learnerWith(reached: readonly string[]) {
  const clock = { t: T0 };
  const learner = await learnerAt(clock);
  for (const id of allIds) if (bundle.node(id)?.kind !== 'contrast' || reached.includes(id)) own(learner, id);
  return { learner, clock };
}
const everything = async () => learnerWith(allIds.filter((id) => bundle.node(id)?.kind === 'contrast'));

const cards = async (deck: UnoDeck) => {
  const { learner } = await everything();
  const g = new UnoGame({ learner, bundle, rng: rng(`t:${deck.id}`), now: () => T0, deck });
  return g;
};

describe('which decks are open', () => {
  it('none for a learner who has reached no contrast, and only the contrast reached for one who has', async () => {
    expect(openUnoDecks((await learnerWith([])).learner, bundle)).toEqual([]);
    const all = openUnoDecks((await everything()).learner, bundle);
    expect(all.length).toBeGreaterThan(5);
    const one = all[0].id;
    expect(openUnoDecks((await learnerWith([one])).learner, bundle).map((d) => d.id)).toEqual([one]);
  });

  it('never a near-synonym, and no clock on a contrast earlier text decides', async () => {
    const all = openUnoDecks((await everything()).learner, bundle);
    for (const d of all) {
      const decides = bundle.contrasts.get(d.id)!.decides;
      expect(decides, d.id).not.toBe('synonym');
      expect(d.timed, d.id).toBe(decides !== 'discourse');
    }
    expect(all.some((d) => !d.timed)).toBe(true);
    expect(all.some((d) => d.timed)).toBe(true);
  });
});

describe('a deck is balanced', () => {
  it('has every side the right answer equally often, in every stretch of the deal, and either place equally often', async () => {
    const { learner } = await everything();
    const known = knownSet(learner, bundle.course);
    for (const d of openUnoDecks(learner, bundle)) {
      const deck = balancedDeck(bundle, d.id, known);
      const word = (i: (typeof deck)[number]) => `${pairOf(i)}>${i.options[i.answer].toLowerCase()}`;
      const pairs = new Set(deck.map(pairOf));
      for (const pair of pairs) {
        const words = new Set(deck.filter((i) => pairOf(i) === pair).map(word));
        expect(words.size, d.id).toBe(2);
        const counts = [...words].map((w) => deck.filter((i) => word(i) === w).length);
        expect(counts[0], `${d.id} ${pair}`).toBe(counts[1]);
      }
      const order = dealOrder(deck, rng(d.id));
      for (let n = 2; n <= order.length; n += 2) {
        for (const pair of pairs) {
          const seen = order.slice(0, n).filter((i) => pairOf(i) === pair);
          const per = [...new Set(seen.map(word))].map((w) => seen.filter((i) => word(i) === w).length);
          expect(per.length === 0 || (per.length === 2 && per[0] === per[1]), `${d.id} ${pair} first ${n}`).toBe(true);
        }
      }
      const g = new UnoGame({ learner, bundle, rng: rng(d.id), now: () => T0, deck: d });
      let at0 = 0, n = 0;
      while (!g.over && n < 40) { at0 += g.item!.card.answer === 0 ? 1 : 0; n++; g.pass(); g.resume(); }
      expect(n % 2, d.id).toBe(0);
      expect(at0, d.id).toBe(n / 2);
    }
  });
});

describe('a round is exposure', () => {
  it('moves no card and writes events under its own name, with no time', async () => {
    const { learner, clock } = await everything();
    const deck = openUnoDecks(learner, bundle).find((d) => !d.timed)!;
    const before = JSON.stringify(Object.fromEntries(Object.entries(learner.toJSON().nodes).map(([id, n]) => [id, { r: n.receptive, p: n.productive }])));
    const events = learner.events().length;
    const g = new UnoGame({ learner, bundle, rng: rng('x'), now: () => clock.t, deck });
    for (let i = 0; i < UNTIMED_ITEMS && !g.over; i++) { if (i % 3) g.choose(g.item!.card.answer); else g.choose(1 - g.item!.card.answer); if (g.correction) g.resume(); }
    const after = JSON.stringify(Object.fromEntries(Object.entries(learner.toJSON().nodes).map(([id, n]) => [id, { r: n.receptive, p: n.productive }])));
    expect(after).toBe(before);
    const written = learner.events().slice(events);
    expect(written.length).toBe(UNTIMED_ITEMS);
    expect(written.every((e) => e.op === 'uno' && e.scored === 'exposure' && e.ms === undefined)).toBe(true);
    expect(written.some((e) => e.grade === Rating.Again)).toBe(true);
  });

  it('has no clock on a contrast earlier text decides: an hour passes and the round goes on', async () => {
    const { learner, clock } = await everything();
    const deck = openUnoDecks(learner, bundle).find((d) => !d.timed)!;
    const g = new UnoGame({ learner, bundle, rng: rng('y'), now: () => clock.t, deck });
    clock.t += 3_600_000;
    g.tick();
    expect(g.over).toBe(false);
    expect(g.choose(g.item!.card.answer)).toBe(true);
    expect(g.right).toBe(1);
  });

  it('keeps a best per deck in the games document, and only a better one replaces it', async () => {
    const { learner, clock } = await everything();
    const decks = openUnoDecks(learner, bundle);
    const games = new GamesStore(new MemoryKV());
    const play = async (deck: UnoDeck, knows: boolean) => {
      const g = new UnoGame({ learner, bundle, rng: rng(`b:${clock.t}`), now: () => clock.t, deck });
      for (let i = 0; i < 8 && !g.over; i++) { clock.t += 1000; if (knows) g.choose(g.item!.card.answer); else g.pass(); if (g.correction) g.resume(); }
      clock.t += 70_000;
      return g.finish(games);
    };
    const a = decks[0], b = decks[1];
    const r1 = await play(a, true);
    expect(r1!.best.isBest).toBe(true);
    await play(b, true);
    const r3 = await play(a, false);
    expect(r3).toBeDefined();
    const doc = await games.read();
    expect(doc.bests[unoKey(a.id)].score).toBe(r1!.score);
    expect(doc.bests[unoKey(b.id)]).toBeDefined();
    expect(doc.rounds.filter((r) => r.game === 'uno').length).toBe(3);
  });
});

describe('blind tapping and a cue table lose to knowledge', () => {
  const dealt = async () => {
    const { learner } = await everything();
    const out = [];
    for (const d of openUnoDecks(learner, bundle)) {
      const g = new UnoGame({ learner, bundle, rng: rng(`d:${d.id}`), now: () => T0, deck: d });
      for (let i = 0; i < d.size * 2; i++) { out.push(g.item!.card); g.pass(); g.resume(); }
    }
    return out;
  };

  for (const [label, play] of [['the longest option', longest], ['the shortest option', shortest], ['the first option', first]] as const) {
    it(`tapping ${label} scores near chance`, async () => {
      const c = await dealt();
      expect(c.length).toBeGreaterThan(300);
      expect(mean(c.map(play))).toBeLessThanOrEqual(mean(c.map(chance)) + 0.08);
    });
  }

  it('every open deck loses to a cue table and to always the commoner answer', async () => {
    const { learner } = await everything();
    const known = knownSet(learner, bundle.course);
    for (const d of openUnoDecks(learner, bundle)) expect(fairDeck(balancedDeck(bundle, d.id, known)), d.id).toBe(true);
  });

  it('someone who knows beats someone who guesses, who beats someone who passes, in a round with no clock', async () => {
    const { learner, clock } = await everything();
    const deck = openUnoDecks(learner, bundle).find((d) => !d.timed)!;
    const r = rng('guess');
    const score = (how: 'know' | 'guess' | 'pass', seed: number) => {
      const g = new UnoGame({ learner, bundle, rng: rng(`s${seed}`), now: () => clock.t, deck });
      while (!g.over) {
        if (how === 'know') g.choose(g.item!.card.answer); else if (how === 'guess') g.choose(r() < 0.5 ? 0 : 1); else g.pass();
        if (g.correction) g.resume();
      }
      return g.right;
    };
    const seeds = Array.from({ length: 40 }, (_, i) => i);
    const know = mean(seeds.map((s) => score('know', s))), guess = mean(seeds.map((s) => score('guess', s))), pass = mean(seeds.map((s) => score('pass', s)));
    expect(know).toBe(UNTIMED_ITEMS);
    expect(guess).toBeLessThan(UNTIMED_ITEMS * 0.65);
    expect(pass).toBe(0);
  });

  it('on the clock a guesser loses to a knower and to someone who passes what they do not know', async () => {
    const { learner, clock } = await everything();
    const deck = openUnoDecks(learner, bundle).find((d) => d.timed)!;
    const r = rng('timed');
    const play = (how: 'know' | 'guess' | 'half', seed: number) => {
      clock.t = T0;
      const g = new UnoGame({ learner, bundle, rng: rng(`c${seed}`), now: () => clock.t, deck });
      let i = 0;
      while (!g.over) {
        clock.t += 2000; g.tick();
        if (g.over) break;
        const knows = how === 'know' || (how === 'half' && i++ % 2 === 0);
        if (knows) g.choose(g.item!.card.answer); else if (how === 'guess') g.choose(r() < 0.5 ? 0 : 1); else g.pass();
        if (g.correction) g.resume();
      }
      return g.right;
    };
    const seeds = Array.from({ length: 30 }, (_, i) => i);
    const know = mean(seeds.map((s) => play('know', s))), guess = mean(seeds.map((s) => play('guess', s))), half = mean(seeds.map((s) => play('half', s)));
    expect(know).toBeGreaterThan(guess);
    expect(half).toBeGreaterThan(guess * 0.9);
  });
});

describe('what it says at the end', () => {
  const base = { deck: 'x:y', timed: true, score: 8, wrong: 0, skipped: 0, best: { isBest: false }, missed: [], before: [] as number[] };
  it('is a fact about the round, without dashes', () => {
    const lines = [
      unoReaction({ ...base }, undefined).remark,
      unoReaction({ ...base, skipped: 2 }, undefined).remark,
      unoReaction({ ...base, wrong: 3, score: 3 }, undefined).remark,
      unoReaction({ ...base, wrong: 1, score: 3, slipped: { word: 'por', times: 2 } }, undefined).remark,
    ];
    expect(lines).toEqual([
      'Not one wrong.',
      'Nothing wrong, and you passed on 2 instead of guessing.',
      'The 3 wrong answers took 21 seconds off the clock. Passing on them would have taken 4.5 seconds.',
      'por slipped twice.',
    ]);
    for (const l of lines) expect(l).not.toMatch(/[-–—]/);
  });
  it('says nothing when there is nothing specific to say', () => {
    expect(unoReaction({ ...base, wrong: 1, score: 3 }, undefined)).toEqual({});
  });
});
