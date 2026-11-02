// The Guess Test and the Cue Test for the contrasts' own items (audit F3, R10), as real tests. A forced choice
// that someone who cannot read Spanish can pass is not practice: tapping the longest option, the shortest or the
// first must score what chance scores, over every choice card the store makes. And a deck for a contrast that a
// meaning or earlier text decides must not be passed by a cue table of the words beside the gap (at most 65%) or
// by always saying the commoner answer (at most 55%): a deck can pass every other test and still reward the wrong thing.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ContrastFile, type ContrastDecides, type ContrastItem } from '../../src/content/schema';
import { contrastCard, contrastForm } from '../../src/ui/session/contrast-card';
import type { McqCard } from '../../src/ui/session/cards';
import { chance, first, longest, mean, sameWords, shortest } from '../ui/guess-play';
import { COMMONER_LIMIT, CUE_LIMIT, pooled, score } from '../../tools/contrast/cue';

const DIR = join(__dirname, '../../content/contrasts');
const files: ContrastFile[] = readdirSync(DIR).filter((f) => f.endsWith('.json')).sort().map((f) => ContrastFile.parse(JSON.parse(readFileSync(join(DIR, f), 'utf8'))));
const of = (...d: ContrastDecides[]) => files.filter((f) => d.includes(f.decides));

/** How far above chance a strategy may score. About three standard errors over the cards sampled. */
const NEAR = 0.08;

/** Every choice card the app makes from the store: a review of recognition for a contrast a choice can test. */
const choices = (): McqCard[] =>
  of('local', 'meaning').flatMap((f) => f.items.map((it, k) => contrastCard(it, f.decides, { key: `t:${k}:${it.id}`, form: contrastForm(f.decides, 'receptive') })).filter((c): c is McqCard => c.type === 'mcq'));

describe('the Guess Test: a choice card the store makes is not passed by reading nothing', () => {
  it('has a good many choice cards to say anything', () => {
    expect(choices().length).toBeGreaterThan(500);
  });

  for (const [label, play] of [['the longest option', longest], ['the shortest option', shortest], ['the first option', first]] as const) {
    it(`tapping ${label} scores near chance`, () => {
      const cards = choices();
      const got = mean(cards.map(play));
      const base = mean(cards.map(chance));
      expect(got, `${label}: ${got.toFixed(3)} against chance ${base.toFixed(3)} on ${cards.length} cards`).toBeLessThanOrEqual(base + NEAR);
    });
  }

  it('tapping the option that shares the most words with the prompt scores near chance', () => {
    const cards = choices().filter((c) => sameWords(c) !== null);
    const got = mean(cards.map((c) => sameWords(c)!));
    const base = mean(cards.map(chance));
    expect(got, `shared words: ${got.toFixed(3)} against chance ${base.toFixed(3)} on ${cards.length} cards`).toBeLessThanOrEqual(base + NEAR);
  });

  it('puts the right option in every place, not in one', () => {
    const cards = choices();
    for (let place = 0; place < 2; place++) {
      const at = mean(cards.filter((c) => c.options.length === 2).map((c) => (c.answer === place ? 1 : 0)));
      expect(at, `option ${place}`).toBeGreaterThan(0.4);
      expect(at, `option ${place}`).toBeLessThan(0.6);
    }
  });

  it('a card never gives the right option away by being the only one that is not Spanish', () => {
    for (const c of choices()) expect(new Set(c.options.map((o) => o.lang)).size, c.key).toBe(1);
  });
});

describe('the Cue Test: a deck of meaning or earlier text is not passed by the words beside the gap, or by the commoner answer', () => {
  for (const d of ['meaning', 'discourse'] as const) {
    it(`the ${d} decks together: a cue table scores at most 65%, always the commoner answer at most 55%`, () => {
      const decks = of(d).map((f) => f.items).filter((items) => items.length >= 4);
      const s = pooled(decks);
      expect(s.n, `${d} items`).toBeGreaterThan(20);
      expect(s.cue, `cue table ${s.cue.toFixed(3)} over ${s.n} items`).toBeLessThanOrEqual(CUE_LIMIT);
      expect(s.commoner, `commoner ${s.commoner.toFixed(3)} over ${s.n} items`).toBeLessThanOrEqual(COMMONER_LIMIT);
    });

    it(`each ${d} deck of 20 or more passes by itself`, () => {
      for (const f of of(d)) {
        if (f.items.length < 20) continue;
        const s = score(f.items);
        expect(s.cue, `${f.node} cue ${s.cue.toFixed(3)} over ${s.n}`).toBeLessThanOrEqual(CUE_LIMIT);
        expect(s.commoner, `${f.node} commoner ${s.commoner.toFixed(3)} over ${s.n}`).toBeLessThanOrEqual(COMMONER_LIMIT);
      }
    });
  }

  it('the test can fail: a deck where the words beside the gap always give the answer, or one answer always comes, is caught', () => {
    const row = (i: number, es: string, gap: [number, number], options: string[]): ContrastItem => ({ id: `x:t#${i}`, node: 'x:t', side: 'g:a', rung: 1, en: 'e', why: 'w', requires: [], es, gap, options, answer: 0 });
    // "gracias por todo" and "es para ti" in a different frame each time: the cue alone gives the answer
    const cued = Array.from({ length: 16 }, (_, i) => (i % 2 ? row(i, `Vale ${i}, gracias por todo`, [`Vale ${i}, gracias `.length, `Vale ${i}, gracias por`.length], ['por', 'para'])
      : row(i, `Vale ${i}, es para ti`, [`Vale ${i}, es `.length, `Vale ${i}, es para`.length], ['para', 'por'])));
    expect(score(cued).cue).toBeGreaterThan(0.9);
    // the same word is the answer every time
    const same = Array.from({ length: 12 }, (_, i) => row(i, `Frase ${i} uno por dos${'x'.repeat(i)}`, [`Frase ${i} uno `.length, `Frase ${i} uno por`.length], ['por', 'para']));
    expect(score(same).commoner).toBeGreaterThan(0.9);
  });
});
