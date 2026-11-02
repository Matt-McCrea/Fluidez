// F7: a miss on a target comes back. Later in the session, in "Before you go", in a sentence the learner has not seen; and next
// session, in a short run at the start, in another fresh one. Free-form misses (talk about you) are signal only and queue nothing.
import { describe, expect, it } from 'vitest';
import type { Item, PracticeItem, ReviewItem } from '../../src/compiler';
import { compilePlan } from '../../src/ui/session/runner';
import { missRetest } from '../../src/ui/session/attempt';
import { planRecap } from '../../src/ui/session/recap';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { corpus } from '../compiler/helpers';
import { session, world } from './driver';

const practice = (op: PracticeItem['op'], node = 'g:ser-identity', extra: Partial<PracticeItem> = {}): PracticeItem =>
  ({ op, id: `${op}:u01-1`, node, sentence: 'u01-1', direction: 'productive', scoring: 'exposure', credit: [node], ...extra }) as PracticeItem;

describe('the attempt seam names a miss that comes back', () => {
  it('a missed practice item on a target, with its sentence, comes back; the node, the way round and the sentence it was missed in are kept', () => {
    for (const op of ['pick', 'choose', 'type', 'transform', 'recombine', 'translate', 'gap'] as const) {
      expect(missRetest(practice(op), { correct: false }), op).toEqual({ node: 'g:ser-identity', direction: 'productive', sentence: 'u01-1' });
    }
    expect(missRetest(practice('pick', 'g:x', { direction: 'receptive' }), { correct: false })).toMatchObject({ node: 'g:x', direction: 'receptive' });
  });

  it('a right answer, a card that asked for no answer, a warm-up review, a free-form answer and a reading check queue nothing', () => {
    expect(missRetest(practice('type'), { correct: true })).toBeUndefined();
    expect(missRetest(practice('type'), { correct: false, exposure: true })).toBeUndefined();
    expect(missRetest({ ...practice('type'), op: 'review' } as unknown as Item, { correct: false })).toBeUndefined();
    // "Answer for yourself": a free-form miss is signal only, and training goes by form
    expect(missRetest(practice('respond'), { correct: false })).toBeUndefined();
    expect(missRetest(practice('comprehend'), { correct: false })).toBeUndefined();
    expect(missRetest({ ...practice('type'), sentence: undefined } as unknown as Item, { correct: false })).toBeUndefined();
    void ({} as ReviewItem);
  });
});

describe('a miss in a drill comes back', () => {
  /** Sessions as the app plays them until the next one is a drill. */
  async function toDrill() {
    const w = await world();
    for (let d = 0; d < 6; d++) {
      const next = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
      if (next.type === 'drill') return w;
      await session(w, 'right');
      w.clock.t += 86_400_000;
    }
    throw new Error('no drill day');
  }

  it('later in the session: "Before you go" asks the target again in a sentence not seen today', async () => {
    const w = await toDrill();
    const s = await session(w, 'wrong');
    const missed = new Set(s.run.retests.map((r) => r.node));
    expect(missed.size).toBeGreaterThan(0);
    const recap = s.plan.blocks.find((b) => b.kind === 'recap');
    if (!recap || recap.kind !== 'recap') throw new Error('no recap');
    const again = recap.items.filter((i) => i.kind === 'miss');
    expect(again.length, 'nothing missed came back in the recap').toBeGreaterThan(0);
    for (const it of again) {
      expect(missed.has(it.node)).toBe(true);
      const was = s.run.retests.find((r) => r.node === it.node)!.sentence;
      expect(it.sentence, `${it.node} is asked in the sentence it was missed in`).not.toBe(was);
      expect(it.reused).toBeFalsy();
    }
  });

  it('next session: the target is on the list, and the session opens with a short run over it in a fresh sentence', async () => {
    const w = await toDrill();
    const s = await session(w, 'wrong');
    const marked = (w.ui.path.remediate ?? []).filter((e) => e.reason === 'miss').map((e) => e.node);
    expect(marked.length).toBeGreaterThan(0);
    expect(marked.length).toBeLessThanOrEqual(6);
    w.clock.t += 86_400_000;
    const next = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const back = next.blocks.find((b) => b.kind === 'controlledOutput' && b.remedial);
    expect(back && back.kind === 'controlledOutput', 'no run over what was missed').toBe(true);
    if (!back || back.kind !== 'controlledOutput') return;
    expect(back.items.length).toBeLessThanOrEqual(3);
    expect(next.blocks.findIndex((b) => b === back)).toBeLessThanOrEqual(2);
    for (const it of back.items) {
      expect(marked, it.node).toContain(it.node);
      expect(w.learner.ledger.hasSeen('sentence', it.sentence), `${it.sentence} was seen`).toBe(false);
    }
    // it is a run, not a habit: served once, the mark goes on to the drills and remixes only
    expect(next.pathAfter.remediate.filter((e) => e.reason === 'miss' && marked.includes(e.node)).every((e) => (e.served ?? 0) >= 1)).toBe(true);
    void s;
  });
});

describe('planRecap', () => {
  it('asks a retest in another sentence or not at all', async () => {
    const w = await world();
    await session(w, 'right');
    const node = [...w.learner.nodes()].find((n) => (w.bundle.index.byTarget.get(n) ?? []).length > 1)!;
    const rows = w.bundle.index.byTarget.get(node)!;
    const out = planRecap({ learner: w.learner, bundle: w.bundle, capacity: 4, lapses: [], retests: [{ node, direction: 'receptive', sentence: rows[0] }], newItems: [], steps: new Map() });
    for (const it of out) { expect(it.kind).toBe('miss'); expect(it.sentence).not.toBe(rows[0]); }
    // nothing fresh to ask it in: not asked again in the sentence it was just shown the answer to
    for (const id of rows) w.learner.ledger.markSeen('sentence', id, { at: w.now() });
    const none = planRecap({ learner: w.learner, bundle: w.bundle, capacity: 4, lapses: [], retests: [{ node, direction: 'receptive', sentence: rows[0] }], newItems: [], steps: new Map() });
    expect(none).toEqual([]);
  });
});

describe('the simulator plays it the way the app does', () => {
  it('practice misses are queued through the same seam, re-asked in the recap and opened on next session, and no rule is broken', () => {
    const c = corpus({ seed: 3 });
    const run = simulateProfile({ ...PROFILES.forgetful, secs: 20 }, { days: 90, tier: 'standard', course: c.course, content: c.content, seed: 3 });
    expect(run.misses.queued).toBeGreaterThan(5);
    expect(run.misses.recap).toBeGreaterThan(0);
    expect(run.misses.opened).toBeGreaterThan(0);
    expect(Object.values(run.unintendedRepeats).reduce((a, b) => a + b, 0)).toBe(0);
    expect(run.itemRepeats60).toBe(0);
  });
});
