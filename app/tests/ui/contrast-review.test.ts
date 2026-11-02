// A contrast has no sentence of its own, so its review is one of its script's items, and so is the review of any
// node with no pair to ask about once its sentences are used. None is a card that only shows (a read card is never
// graded, so a node reviewed with one stays due for ever) (F2).
import { beforeAll, describe, expect, it } from 'vitest';
import type { ReviewItem } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { reviewCard } from '../../src/ui/session/cards';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ band: 'A1', lookahead: false }); }, 60_000);

const contrasts = () => [...b.course.nodes.values()].filter((n) => n.kind === 'contrast');
const review = (node: string, direction: 'receptive' | 'productive', script?: ReviewItem['script'], contrast?: string): ReviewItem => ({
  op: 'review', id: `rv:${contrast ?? node}:${direction}:${script ? `${script.op}${script.index}` : 'bare'}`, node, targets: [node], direction,
  ...(script ? { script } : {}), ...(contrast ? { contrast } : {}), novel: false, scoring: 'review', credit: [node],
});

describe('the review of a contrast, and of a node with nothing to ask', () => {
  it('is never a read card, for any of them, either way round, whether or not the plan names the item', async () => {
    const all = contrasts();
    expect(all.length).toBe(94);
    // the nodes with no aligned pair: 7 contrasts, 5 grammar points and 31 patterns
    const unaskable = [...b.course.nodes.values()].filter((n) => n.kind !== 'cando' && !b.segments(n.id).length);
    expect(unaskable.length).toBeGreaterThanOrEqual(43);
    const reads: string[] = [];
    const nodes = [...new Map([...all, ...unaskable].map((x) => [x.id, x])).values()];
    // what prepare() fetches for a due node with nothing to ask
    await Promise.all(nodes.map((n) => b.scriptFor(n.id)));
    for (const n of nodes) {
      const script = b.scripts.get(n.id);
      expect(script, `${n.id} has a script`).toBeDefined();
      for (const direction of ['receptive', 'productive'] as const) {
        // the item the plan names, every one of them
        for (let i = 0; i < script!.readAndPick.length; i++) if (reviewCard(review(n.id, direction, { op: 'readAndPick', index: i }), b).type === 'read') reads.push(`${n.id} rp${i}`);
        for (let i = 0; i < script!.yourTurn.length; i++) if (reviewCard(review(n.id, direction, { op: 'yourTurn', index: i }), b).type === 'read') reads.push(`${n.id} yt${i}`);
        // nothing named (the recap, free practice)
        if (reviewCard(review(n.id, direction), b).type === 'read') reads.push(`${n.id} ${direction} bare`);
      }
    }
    expect(reads).toEqual([]);
  });

  it('asks the item the plan names: read-and-pick as a pick, your-turn as a typed answer', () => {
    const n = contrasts().find((x) => b.scripts.get(x.id)!.readAndPick.length > 2 && b.scripts.get(x.id)!.yourTurn.length > 2)!;
    const script = b.scripts.get(n.id)!;
    const pick = reviewCard(review(n.id, 'receptive', { op: 'readAndPick', index: 2 }), b);
    expect(pick.type).toBe('mcq');
    expect((pick as { prompt: { text: string } }).prompt.text).toBe(script.readAndPick[2].es);
    const typed = reviewCard(review(n.id, 'productive', { op: 'yourTurn', index: 1 }), b);
    expect(typed.type).toBe('type');
    expect(typed.key).toContain(n.id);
  });
});

describe('the review of a contrast with items of its own (F3)', () => {
  const some = (node: string) => b.contrastItems(node);

  it('asks the item the plan names, as a choice for recognition and a typed gap for production', () => {
    const it = some('x:lo-le')[1];
    const pick = reviewCard(review('x:lo-le', 'receptive', undefined, it.id), b);
    expect(pick.type).toBe('mcq');
    expect(pick.prompt?.text).toBe(`${it.es.slice(0, it.gap[0])}___${it.es.slice(it.gap[1])}`);
    const typed = reviewCard(review('x:lo-le', 'productive', undefined, it.id), b);
    expect(typed.type).toBe('type');
    expect(typed.key).toContain(it.id);
    if (typed.type === 'type') expect(typed.check(it.es.slice(...it.gap)).pass).toBe(true);
  });

  it('asks aspect typed from the English, whichever card is due', () => {
    const it = some('x:pret-imp')[0];
    for (const direction of ['receptive', 'productive'] as const) {
      const c = reviewCard(review('x:pret-imp', direction, undefined, it.id), b);
      expect(c.type).toBe('type');
      expect(c.prompt?.text).toBe(it.en);
    }
  });

  it('shows only an item somebody who knows what the learner has been taught named: a review that names none is asked with the script', () => {
    const c = reviewCard(review('x:por-para', 'receptive'), b);
    const script = b.scripts.get('x:por-para')!;
    expect(c.type).toBe('mcq');
    expect(script.readAndPick.map((r) => r.es)).toContain(c.prompt?.text);
  });

  it('a plan that named a script item stands, and an item the bundle does not have falls back to the script', () => {
    const named = reviewCard(review('x:por-para', 'receptive', { op: 'readAndPick', index: 2 }), b);
    expect((named as { prompt: { text: string } }).prompt.text).toBe(b.scripts.get('x:por-para')!.readAndPick[2].es);
    const gone = reviewCard(review('x:por-para', 'receptive', { op: 'readAndPick', index: 2 }, 'x:por-para#nobody-wrote-this'), b);
    expect(gone.type).not.toBe('read');
    expect((gone as { prompt: { text: string } }).prompt.text).toBe(b.scripts.get('x:por-para')!.readAndPick[2].es);
  });

  it('is never a read card, for any contrast with items, either way round', () => {
    for (const n of contrasts()) {
      for (const direction of ['receptive', 'productive'] as const) {
        for (const it of some(n.id)) expect(reviewCard(review(n.id, direction, undefined, it.id), b).type, it.id).not.toBe('read');
        expect(reviewCard(review(n.id, direction), b).type, `${n.id} ${direction} bare`).not.toBe('read');
      }
    }
  });
});
