// Structured input ("Read carefully: the small words matter") is meant to make the learner look at the form. For a
// sentence that cannot carry a minimal pair it used to fall back to a meaning question whose wrong options were other
// sentences of the unit: 84% of the block at u45 (audit F8, 03-acquisition P4), passed by one known word, with a
// reason line naming another sentence. It now asks what the node's script wrote for exactly its point, or types the
// sentence, and never a meaning question among strangers.
import { beforeAll, describe, expect, it } from 'vitest';
import type { PracticeItem } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import type { Card } from '../../src/ui/session/cards';
import { givesAwayByLength } from '../../src/exercises/neighbours';
import { choiceCardsAt } from './guess-world';

const picks: Array<{ item: PracticeItem; card: Card; b: Bundle }> = [];
beforeAll(async () => {
  for (const unit of [8, 20, 32, 45, 58]) {
    const r = await choiceCardsAt(unit, 4);
    for (const p of r.picks) picks.push({ ...p, b: r.bundle });
  }
}, 600_000);

const fellBack = () => picks.filter((p) => !(p.card.type === 'mcq' && p.card.feature));

describe('structured input that cannot make a minimal pair', () => {
  it('has some to look at', () => {
    expect(picks.length).toBeGreaterThan(40);
    expect(fellBack().length).toBeGreaterThan(10);
  });

  it('is never a meaning question among other sentences', () => {
    const meaning = fellBack().filter((p) => p.card.ask.startsWith('Read and pick. '));
    expect(meaning.map((p) => `${p.item.id}: ${p.card.prompt?.text}`)).toEqual([]);
  });

  it('is what the node\'s script wrote for its point, or a typed card', () => {
    for (const { item, card, b } of fellBack()) {
      if (card.type === 'type') continue;
      expect(card.type, item.id).toBe('mcq');
      const written = b.scripts.get(item.node)?.readAndPick.some((rp) => rp.options.join('|') === (card as { options: Array<{ text: string }> }).options.map((o) => o.text).join('|'));
      expect(written, `${item.id}: ${card.prompt?.text}`).toBe(true);
    }
  });

  it('never gives itself away by length when the script has one that does not', () => {
    for (const { item, card, b } of fellBack()) {
      const script = b.scripts.get(item.node);
      if (card.type !== 'mcq' || !script) continue;
      const fair = script.readAndPick.some((rp) => !givesAwayByLength(rp.options, rp.answer));
      if (fair) expect(givesAwayByLength(card.options.map((o) => o.text), card.answer), `${item.id}: ${card.options.map((o) => o.text).join(' | ')}`).toBe(false);
    }
  });

  it('shows a reason that is about the card on screen', () => {
    for (const { item, card } of fellBack()) {
      if (card.type !== 'mcq') continue;
      expect(card.why.includes(card.prompt?.text ?? '\u0000'), `${item.id}: ${card.why}`).toBe(true);
    }
  });
});
