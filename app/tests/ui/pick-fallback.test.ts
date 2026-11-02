// Structured input ("Read carefully: the small words matter") is meant to make the learner look at the form. For a
// sentence that cannot carry a minimal pair it used to fall back to a meaning question whose wrong options were other
// sentences of the unit: 84% of the block at u45 (audit F8, 03-acquisition P4), passed by one known word, with a
// reason line naming another sentence. It now asks what the node's script wrote for exactly its point, or types the
// sentence, and never a meaning question among strangers.
import { beforeAll, describe, expect, it } from 'vitest';
import { practiceCard } from '../../src/ui/session/cards';
import type { PracticeItem } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import type { Card } from '../../src/ui/session/cards';
import type { Learner } from '../../src/learner';
import { givesAwayByLength, givesAwayByTag } from '../../src/exercises/neighbours';
import { choiceCardsAt } from './guess-world';

interface Pick { item: PracticeItem; card: Card; b: Bundle; learner: Learner; unit: number; block: number; day: number; taught: ReadonlySet<string> }
const picks: Pick[] = [];
beforeAll(async () => {
  for (const unit of [8, 20, 32, 45, 58]) {
    const r = await choiceCardsAt(unit, 4);
    for (const p of r.picks) picks.push({ ...p, b: r.bundle, learner: r.learner, unit });
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

  it('never gives itself away by its length or a lone tag', () => {
    for (const { item, card } of fellBack()) {
      if (card.type !== 'mcq') continue;
      const options = card.options.map((o) => o.text);
      expect(givesAwayByLength(options, card.answer), `${item.id}: ${options.join(' | ')}`).toBe(false);
      expect(givesAwayByTag(options, card.answer), `${item.id}: ${options.join(' | ')}`).toBe(false);
    }
  });

  it('never asks the same question twice in a block, or one the same session\'s lesson asks', () => {
    const shown = new Map<string, number>();
    for (const { item, card, unit, day, block, taught, b } of fellBack()) {
      if (card.type !== 'mcq') continue;
      const k = `${unit}/${day}/${block}/${item.node}/${card.prompt?.text}`;
      shown.set(k, (shown.get(k) ?? 0) + 1);
      const inLesson = b.scripts.get(item.node)!.readAndPick.findIndex((rp) => rp.es === card.prompt?.text);
      expect(taught.has(`sc:${item.node}:rp:${inLesson}`), `${item.id}: the lesson just asked "${card.prompt?.text}"`).toBe(false);
    }
    expect([...shown].filter(([, n]) => n > 1)).toEqual([]);
  });

  it('never asks a learner to say a sentence that needs a recognition-only point, when the picks run out', () => {
    const b = picks[picks.length - 1].b;      // the bundle furthest on: recognition-only points come late
    const rows = [...b.index.sentences.values()].filter((s) => s.readOnly && b.sentence(s.id));
    expect(rows.length).toBeGreaterThan(50);
    const seen = { typed: 0, shown: 0 };
    for (const ref of rows) {
      const node = ref.targets[0] ?? ref.requires[0];
      const taken = new Set((b.scripts.get(node)?.readAndPick ?? []).map((_, i) => `sc:${node}:rp:${i}`));
      const item: PracticeItem = { op: 'pick', id: `pick:${ref.id}`, node, sentence: ref.id, direction: 'receptive', scoring: 'exposure', credit: [node] };
      const c = practiceCard(item, b, 1, undefined, taken);
      if (c.type === 'mcq') continue;       // a minimal pair of its own
      seen[c.type === 'type' ? 'typed' : 'shown']++;
      if (c.type === 'type') expect(c.answerLang, `${ref.id}: ${c.prompt?.text}`).toBe('en');
    }
    expect(seen.typed).toBeGreaterThan(20);
  }, 120_000);

  it('types the sentence when a block has used up its script', () => {
    const b = picks[0].b;
    const { item } = fellBack().find((p) => p.card.fromScript && !b.index.sentences.get(p.item.sentence)?.readOnly)!;
    const taken = new Set(b.scripts.get(item.node)!.readAndPick.map((_, i) => `sc:${item.node}:rp:${i}`));
    const c = practiceCard(item, b, 1, undefined, taken);
    expect(c.type).toBe('type');
    expect(c.fromScript).toBeUndefined();
  });

  it('counts what the card showed, not the sentence it stood in for', () => {
    const script = fellBack().filter((p) => p.card.fromScript);
    expect(script.length).toBeGreaterThan(10);
    for (const { item, card, learner } of script) {
      const f = card.fromScript!;
      expect(f.item.credit, item.id).toEqual([item.node]);
      expect(f.item.sentence).toBe('');
      expect(f.served).toMatch(/^sc:.*:rp:\d+$/);
      expect(learner.ledger.hasSeen('item', f.served), `${item.id}: the script item is ledgered`).toBe(true);
    }
    // the sentences stood in for were not shown, so they are still there to be met for the first time
    const unseen = script.filter((p) => !p.learner.ledger.hasSeen('sentence', p.item.sentence));
    expect(unseen.length).toBeGreaterThan(script.length / 2);
  });

  it('shows a reason that is about the card on screen', () => {
    for (const { item, card } of fellBack()) {
      if (card.type !== 'mcq') continue;
      expect(card.why.includes(card.prompt?.text ?? '\u0000'), `${item.id}: ${card.why}`).toBe(true);
    }
  });
});
