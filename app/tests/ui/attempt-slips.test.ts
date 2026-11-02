// The attempts log and the fingerprint keep the kind of slip the checker named. A hand-written check can say
// anything, so these go through the checks the cards really use, over the bank: the kinds used to be dropped on
// their way to the card, on every gap, transform and recombine card, and on every accent a card forgave.
import { describe, expect, it } from 'vitest';
import { checkItem } from '../../src/exercises';
import { typedOutcome } from '../../src/ui/components/card';
import { learnRetrieval, practiceCard, scriptCard, sentenceCheck, type Check } from '../../src/ui/session/cards';
import { fixtureBundle } from './driver';

const b = fixtureBundle();
const errOf = (c: Check, typed: string) => typedOutcome({ passed: c.pass, tries: 1, ms: 1000, value: typed, first: typed, result: c, firstCheck: c }).err;
const typedCards = () => b.bank.flatMap((s) => (['type', 'transform', 'recombine'] as const).map((op) => (
  practiceCard({ op, id: `s:${s.id}:${op}`, node: 'l:x', sentence: s.id, direction: 'productive', scoring: 'review', credit: [] } as never, b, 7)
))).filter((c) => c.type === 'type');
const plain = (s: string) => s.replace(/[áéíóú]/g, (c) => 'aeiou'['áéíóú'.indexOf(c)]);

describe('what a practice card names', () => {
  it('a right answer names nothing', () => {
    const cards = typedCards();
    expect(cards.length).toBeGreaterThan(50);
    for (const card of cards) {
      const answer = card.check('\u0000').answer;
      expect(errOf(card.check(answer), answer), answer).toBeUndefined();
    }
  });

  it('a slip the card has a hint for has a name', () => {
    let hinted = 0;
    for (const card of typedCards()) {
      const words = card.check('\u0000').answer.split(' ');
      const at = words.findIndex((w) => w.length >= 3);
      if (words.length < 2 || at < 0) continue;
      words[at] = words[at].replace(/.$/, words[at].endsWith('o') ? 'a' : 'o');
      const typed = words.join(' ');
      const c = card.check(typed);
      if (c.pass || !c.hint) continue;
      hinted++;
      expect(errOf(c, typed), `"${typed}": ${c.hint}`).toBeTruthy();
    }
    expect(hinted).toBeGreaterThan(50);
  });

  it('an accent the card forgave was still slipped: on a sentence, a gap, a transform and a script card', () => {
    const c = sentenceCheck({ es: 'Yo tomo café aquí.', en: 'I drink coffee here.', accept: [] })('Yo tomo cafe aqui.');
    expect(c.pass).toBe(true);
    expect(errOf(c, 'Yo tomo cafe aqui.')).toBe('accents');

    let forgiven = 0;
    for (const card of typedCards()) {
      const answer = card.check('\u0000').answer, typed = plain(answer);
      const r = typed === answer ? undefined : card.check(typed);
      if (!r?.pass) continue;
      forgiven++;
      expect(errOf(r, typed), typed).toBe('accents');
    }
    expect(forgiven).toBeGreaterThan(10);

    const script = { yourTurn: [{ prompt: 'Translate: I live here.', answer: 'Vivo aquí.', accept: [], why: 'because' }] } as never;
    const card = scriptCard({ op: 'yourTurn', id: 'y0', node: 'g:x', index: 0, scoring: 'learning', credit: [] } as never, script);
    if (card?.type !== 'type') throw new Error('a yourTurn item is typed');
    expect(card.check('Vivo aqui.').pass).toBe(true);
    expect(errOf(card.check('Vivo aqui.'), 'Vivo aqui.')).toBe('accents');
  });
});

describe('a typed meaning, in English', () => {
  it('a typo is a spelling slip: English has no accents to miss', () => {
    const item = { id: 'i', generator: 'translate', nodes: [], kind: 'translate', dir: 'es-en', prompt: 'la casa', answer: 'the house', accept: [] } as never;
    const typo = checkItem(item, 'the housz');
    expect(typo).toMatchObject({ pass: false, near: true });
    expect(errOf({ ...typo, answer: typo.answer }, 'the housz')).toBe('spelling');

    let typed = 0;
    for (const node of b.course.nodes.values()) {
      const learn = { op: 'learn', id: `ln:${node.id}`, node: node.id, nodeKind: node.kind, retrievals: 4, productive: true, scoring: 'learning', credit: [node.id] } as never;
      for (const round of [0, 1, 2, 3, 4]) {
        const card = learnRetrieval(learn, b, round);
        if (card.type !== 'type' || card.answerLang !== 'en') continue;
        const answer = card.check('\u0000').answer;
        if (!/^[a-z]{5,}$/.test(answer)) continue;
        const c = card.check(`${answer.slice(0, -1)}z`);
        if (!c.near) continue;
        typed++;
        expect(errOf(c, 'x')).toBe('spelling');
      }
    }
    expect(typed).toBeGreaterThan(0);
  });
});
