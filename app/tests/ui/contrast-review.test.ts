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
const review = (node: string, direction: 'receptive' | 'productive', script?: ReviewItem['script']): ReviewItem => ({
  op: 'review', id: `rv:${node}:${direction}:${script ? `${script.op}${script.index}` : 'bare'}`, node, targets: [node], direction,
  ...(script ? { script } : {}), novel: false, scoring: 'review', credit: [node],
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
