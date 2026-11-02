// Blind tapping must lose to knowledge (R23, and the Guess Test turned on the games). A round is played by people who
// do not know the answers, in every way one can not know them, against people who do. Each plays the real game, the real
// deal and the real clock; time is a number handed in. What is held:
//   the score is a count of rights, so someone who cannot read Spanish must not beat someone who can;
//   no habit of tapping (the longest option, the shortest, the first) gets near chance-plus-a-little on what is dealt;
//   and a penalty makes guessing worse than passing: the same person scores more by saying "I don't know".
import { beforeAll, describe, expect, it } from 'vitest';
import { rng, type Rng } from '../../src/exercises/rng';
import { FlashGame, openDecks, type FlashDeck } from '../../src/games/flash';
import type { McqCard } from '../../src/ui/session/cards';
import type { Bundle } from '../../src/ui/data/bundle';
import { chance, first as tapFirst, longest as tapLongest, mean as share, shortest as tapShortest } from '../ui/guess-play';
import { graphBundle, ready, T0 } from './helpers';

let bundle: Bundle;
beforeAll(async () => { bundle = await graphBundle(); }, 120_000);

interface Player {
  name: string;
  /** chance of knowing the item in front of them */
  know: number;
  /** what they do with one they do not know */
  unknown: 'guess' | 'pass' | ((card: McqCard) => number);
  /** seconds to look at an item, and to answer it */
  read: number;
  answer: number;
}

const world = () => ready(bundle, { words: 80 });

/** One round of the real game played by `p`; returns rights. */
function playRound(game: FlashGame, clock: { t: number }, p: Player, r: Rng): number {
  const dealt: McqCard[] = [];
  while (!game.over) {
    const it = game.item!;
    clock.t += p.read * 1000;
    if (game.tick().over) break;
    const knows = r() < p.know;
    clock.t += (knows || p.unknown === 'guess' || typeof p.unknown === 'function' ? p.answer : 0.5) * 1000;
    if (it.kind === 'choose') {
      const card = it.card as McqCard;
      dealt.push(card);
      if (knows) game.choose(card.answer);
      else if (p.unknown === 'pass') game.pass();
      else if (p.unknown === 'guess') game.choose(Math.floor(r() * card.options.length));
      else game.choose(p.unknown(card));
    } else if (knows) game.typed(it.answer);
    else if (p.unknown === 'pass') game.pass();
    else game.submit('zzz');
    if (game.state.paused) game.resume();
  }
  return game.state.right;
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

async function scores(deck: string, players: Player[], rounds: number): Promise<Record<string, number>> {
  const w = await world();
  const d = openDecks(w.learner, bundle).find((x) => x.id === deck) as FlashDeck;
  const out: Record<string, number> = {};
  for (const p of players) {
    const rs: number[] = [];
    for (let i = 0; i < rounds; i++) {
      w.clock.t = T0;
      const r = rng(`${p.name}:${i}`);
      const game = new FlashGame({ learner: w.learner, bundle, rng: rng(`deal:${p.name}:${i}`), now: () => w.clock.t, deck: d });
      rs.push(playRound(game, w.clock, p, r));
    }
    out[p.name] = mean(rs);
  }
  return out;
}

const longest = (c: McqCard) => c.options.reduce((best, o, i) => (o.text.length > c.options[best].text.length ? i : best), 0);
const shortest = (c: McqCard) => c.options.reduce((best, o, i) => (o.text.length < c.options[best].text.length ? i : best), 0);
const first = () => 0;

describe('tapping among four words', () => {
  const players: Player[] = [
    { name: 'careful', know: 0.9, unknown: 'guess', read: 0.8, answer: 2.2 },
    { name: 'quick', know: 0.9, unknown: 'guess', read: 0.6, answer: 1.2 },
    { name: 'half, guessing', know: 0.5, unknown: 'guess', read: 0.8, answer: 2.2 },
    { name: 'half, passing', know: 0.5, unknown: 'pass', read: 0.8, answer: 2.2 },
    { name: 'blind', know: 0, unknown: 'guess', read: 0.1, answer: 0.3 },
    { name: 'blind, slowly', know: 0, unknown: 'guess', read: 0.5, answer: 0.8 },
    { name: 'the longest', know: 0, unknown: longest, read: 0.1, answer: 0.3 },
    { name: 'the shortest', know: 0, unknown: shortest, read: 0.1, answer: 0.3 },
    { name: 'the first', know: 0, unknown: first, read: 0.1, answer: 0.3 },
  ];
  let got: Record<string, number>;
  beforeAll(async () => { got = await scores('palabras', players, 24); }, 300_000);

  it('knowing beats not knowing by a wide margin', () => {
    for (const blind of ['blind', 'blind, slowly', 'the longest', 'the shortest', 'the first']) {
      expect(got[blind], `${blind} ${got[blind]} against half ${got['half, guessing']}`).toBeLessThan(got['half, guessing']);
      expect(got[blind], blind).toBeLessThan(got.careful / 2);
    }
  });

  it('a quicker knower scores more, and the careful one is not left behind by someone who taps at random', () => {
    expect(got.quick).toBeGreaterThan(got.careful);
    expect(got.careful).toBeGreaterThan(3 * got.blind);
  });

  it('guessing is worse than saying "I don\'t know": the same person scores more passing than guessing', () => {
    expect(got['half, passing']).toBeGreaterThan(got['half, guessing']);
  });
});

describe('the words that are dealt', () => {
  it('give nothing away to a habit of tapping: the longest option, the shortest and the first are right about as often as chance', async () => {
    const w = await world();
    const deck = openDecks(w.learner, bundle).find((x) => x.id === 'palabras') as FlashDeck;
    const cards: McqCard[] = [];
    for (let i = 0; i < 12; i++) {
      const game = new FlashGame({ learner: w.learner, bundle, rng: rng(`cards:${i}`), now: () => w.clock.t, deck });
      for (let k = 0; k < 40; k++) { const it = game.item!; cards.push(it.card as McqCard); game.choose((it.card as McqCard).answer); }
    }
    expect(cards.length).toBeGreaterThan(400);
    const base = share(cards.map(chance));
    for (const [label, play] of [['the longest option', tapLongest], ['the shortest option', tapShortest], ['the first option', tapFirst]] as const) {
      const got = share(cards.map(play));
      expect(got, `${label}: ${got.toFixed(3)} against chance ${base.toFixed(3)}`).toBeLessThanOrEqual(base + 0.08);
    }
  });
});

describe('typing a form', () => {
  const players: Player[] = [
    { name: 'careful', know: 0.9, unknown: 'guess', read: 0.8, answer: 3.5 },
    { name: 'half, guessing', know: 0.5, unknown: 'guess', read: 0.8, answer: 3.5 },
    { name: 'half, passing', know: 0.5, unknown: 'pass', read: 0.8, answer: 3.5 },
    { name: 'mashing', know: 0, unknown: 'guess', read: 0.2, answer: 0.8 },
  ];
  let got: Record<string, number>;
  beforeAll(async () => { got = await scores('preterito', players, 24); }, 300_000);

  it('typing nonsense scores nothing, and knowing scores', () => {
    expect(got.mashing).toBe(0);
    expect(got.careful).toBeGreaterThan(8);
  });

  it('guessing is worse than saying "I don\'t know"', () => {
    expect(got['half, passing']).toBeGreaterThan(got['half, guessing']);
  });
});
