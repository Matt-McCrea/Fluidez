// A contrast item is shown only when somebody who knows what the learner has been taught names it: the plan for the
// warm-up, the recap for a lapse, free practice for a quick review. A review that names none is asked with the script.
import { beforeAll, describe, expect, it } from 'vitest';
import { knownSet } from '../../src/compiler';
import { rng } from '../../src/exercises/rng';
import { Learner, MemoryStore } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { Freeplay } from '../../src/ui/session/freeplay';
import { applyPlacement } from '../../src/ui/session/placement';
import { planRecap, recapCard } from '../../src/ui/session/recap';
import { blanked, eligibleContrast } from '../../src/ui/session/contrast-card';

const T = new Date(2026, 9, 1, 18).getTime();
const DAY = 86_400_000;
let bundle: Bundle;
beforeAll(async () => { bundle = await new ContentLoader().load({ unit: 0 }); }, 120_000);
const unitOf = (node: string) => bundle.course.unitStart.filter((s) => s <= bundle.course.teachPos.get(node)!).length - 1;
async function learnerAt(unit: number): Promise<Learner> {
  const learner = await Learner.open(new MemoryStore(), { now: () => T });
  applyPlacement(learner, bundle, unit, T);
  return learner;
}
const recap = (learner: Learner, lapses: Array<{ node: string; direction: 'receptive' | 'productive'; contrast?: string }>) =>
  planRecap({ learner, bundle, capacity: 5, lapses, newItems: [], steps: new Map() });

describe('a lapse on a contrast, in "Before you go"', () => {
  it('asks another item of its own than the one missed, one the learner can be shown', async () => {
    const x = 'x:ser-estar-adj';
    const learner = await learnerAt(unitOf(x) + 1);
    const known = knownSet(learner, bundle.course);
    const items = eligibleContrast(bundle, x, known);
    expect(items.length).toBeGreaterThan(3);
    // whichever it was: one missed item could miss the rule by luck
    for (const { id: missed } of items) {
      const [it] = recap(learner, [{ node: x, direction: 'productive', contrast: missed }]);
      expect(it.kind).toBe('lapsed');
      expect(it.contrast).toBeDefined();
      expect(it.contrast).not.toBe(missed);
      expect(items.map((i) => i.id)).toContain(it.contrast);
      const card = recapCard(it, bundle);
      expect(card.type).not.toBe('read');
      expect(card.key).toBe(it.id);
    }
  });

  it('never names an item the learner cannot be shown: one that needs a word not yet taught waits', async () => {
    // placed before the course teaches the words of x:medir-caber's items
    const x = 'x:medir-caber';
    const learner = await learnerAt(unitOf(x));
    learner.seedKnown(x, { at: T, productive: true, receptive: { stability: 3, dueAt: T + DAY }, productiveCard: { stability: 3, dueAt: T + DAY } });
    const known = knownSet(learner, bundle.course);
    const shown = new Set(eligibleContrast(bundle, x, known).map((i) => i.id));
    expect(bundle.contrastItems(x).some((i) => !shown.has(i.id))).toBe(true);
    for (const direction of ['receptive', 'productive'] as const) {
      const [it] = recap(learner, [{ node: x, direction }]);
      if (it.contrast) expect(shown.has(it.contrast)).toBe(true);
    }
  });

  it('is asked with the script when the contrast has no other item to show', async () => {
    const x = 'x:medir-caber';
    const learner = await learnerAt(unitOf(x));
    learner.seedKnown(x, { at: T, productive: true, receptive: { stability: 3, dueAt: T + DAY }, productiveCard: { stability: 3, dueAt: T + DAY } });
    const none = eligibleContrast(bundle, x, knownSet(learner, bundle.course));
    expect(none).toEqual([]);
    const [it] = recap(learner, [{ node: x, direction: 'productive' }]);
    expect(it.contrast).toBeUndefined();
    const card = recapCard(it, bundle);
    expect(card.type).not.toBe('read');
  });
});

describe('a quick review of a contrast', () => {
  it('asks one of its own items the learner can be shown, and goes round them', async () => {
    const x = 'x:lo-le';
    // a learner who has the contrast and what its items need, and nothing else to review
    const learner = await Learner.open(new MemoryStore(), { now: () => T });
    const need = new Set(bundle.contrastItems(x).flatMap((i) => i.requires).filter((n) => bundle.course.nodes.has(n)));
    for (const n of need) learner.seedKnown(n, { at: T, productive: false, receptive: { stability: 300, dueAt: T + 400 * DAY } });
    learner.seedKnown(x, { at: T, productive: true, receptive: { stability: 3, dueAt: T + DAY }, productiveCard: { stability: 3, dueAt: T + DAY } });
    const items = new Set(eligibleContrast(bundle, x, knownSet(learner, bundle.course)).map((i) => i.id));
    expect(items.size).toBeGreaterThan(5);
    // a cue contrast asked for production is a typed gap: its prompt is the sentence with the blank
    const byPrompt = new Map(bundle.contrastItems(x).map((i) => [blanked(i), i.id]));
    const asked: string[] = [];
    for (let r = 0; r < 3; r++) {
      const fp = new Freeplay({ kind: 'quickReview' }, { learner, bundle, now: () => T + 30 * DAY, rng: rng(`q${r}`) });
      for (let c = fp.next(); c; c = fp.next()) {
        if (c.key.includes(x)) asked.push(byPrompt.get(c.prompt?.text ?? '') ?? `not an item: ${c.prompt?.text}`);
        fp.answer({ correct: true, tries: 1, ms: 900 });
      }
    }
    expect(asked.length).toBeGreaterThan(0);
    expect(asked.filter((id) => !items.has(id))).toEqual([]);
  }, 120_000);
});
