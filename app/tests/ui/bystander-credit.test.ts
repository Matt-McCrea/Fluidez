// F12: Weak spots charged every node in a sentence. An answered item named its
// sentence's nodes in `credit` and the runner logged a graded event for each, so
// a por/para slip in a sentence that also used the preterite put a miss on the
// preterite ("Preterite, missed 15 of 15" with its preterites right). The target
// is graded; the rest are exposure: counted as seen, with no event of their own.
import { describe, expect, test } from 'vitest';
import type { PracticeItem, RecapItem, ReviewItem } from '../../src/compiler';
import { Rating } from '../../src/learner';
import { weakSpots } from '../../src/learner/weak';
import { SessionRunner, compilePlan } from '../../src/ui/session/runner';
import { world } from './driver';

const TARGET = 'g:ser-identity';
const BYSTANDERS = ['p:ser-profession-no-article', 'c:soy-de'];
const miss = { correct: false, tries: 2, ms: 5000 };

async function setup() {
  const w = await world();
  const at = w.now();
  for (const n of [TARGET, ...BYSTANDERS]) w.learner.introduce(n, { at, results: [true, true, true] });
  const plan = compilePlan(w.learner, w.bundle, w.ui, { mode: 'next', now: w.now() });
  const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
  run.start();
  const credit = [TARGET, ...BYSTANDERS];
  const eventsFor = (node: string) => w.learner.events().filter((e) => e.node === node && e.scored === 'exposure');
  const exposures = (node: string) => (w.learner.toJSON().nodes[node]?.exposures ?? 0);
  return { w, run, credit, eventsFor, exposures };
}

/** What every site must do: one graded event, on the target; the bystanders counted as seen. */
function expectTargetOnly(s: Awaited<ReturnType<typeof setup>>, before: Record<string, number>) {
  expect(s.eventsFor(TARGET)).toHaveLength(1);
  expect(s.eventsFor(TARGET)[0].grade).toBe(Rating.Again);
  for (const b of BYSTANDERS) {
    expect(s.eventsFor(b), `${b} must not be charged`).toHaveLength(0);
    expect(s.exposures(b), `${b} is still exposure`).toBe(before[b] + 1);
  }
}

describe('a pick asked from the script in the place of the plan\'s sentence', () => {
  // the sentence never reached the screen, so the words in it were neither read nor recalled
  test('moves the target on and leaves the sentence\'s other words alone', async () => {
    const s = await setup();
    const later = s.w.now() + 30 * 86_400_000;
    for (const n of [TARGET, ...BYSTANDERS]) s.w.learner.review(n, 'receptive', Rating.Good, { at: s.w.now() + 86_400_000 });
    s.w.clock.t = later;
    const stability = (n: string) => s.w.learner.toJSON().nodes[n]?.receptive?.stability ?? 0;
    const before = Object.fromEntries([TARGET, ...BYSTANDERS].map((n) => [n, stability(n)]));
    const asPlanned: PracticeItem = { op: 'pick', id: 'pick:u01-2', node: TARGET, sentence: 'u01-2', direction: 'receptive', scoring: 'review', credit: s.credit };
    const right = { correct: true, tries: 1, ms: 4000 };
    s.run.score({ ...asPlanned, sentence: '', credit: [TARGET] }, right);
    expect(stability(TARGET)).toBeGreaterThan(before[TARGET]);
    for (const b of BYSTANDERS) expect(stability(b), `${b} was not on screen`).toBe(before[b]);
    // as planned, the same answer would have moved them
    s.run.score({ ...asPlanned, node: BYSTANDERS[0], credit: [BYSTANDERS[0], BYSTANDERS[1]] }, right);
    expect(stability(BYSTANDERS[1])).toBeGreaterThan(before[BYSTANDERS[1]]);
  });

  test('comes back when it is missed, and does not name a sentence that was not shown', async () => {
    const s = await setup();
    const item: PracticeItem = { op: 'pick', id: 'pick:u01-2', node: TARGET, sentence: '', direction: 'receptive', scoring: 'exposure', credit: [TARGET] };
    s.run.score(item, miss);
    expect(s.run.retests.map((r) => r.node)).toEqual([TARGET]);
    expect(s.run.misses.map((m) => m.sentence)).toEqual([undefined]);
  });
});

describe('an answered sentence grades its target and only its target', () => {
  test('practice that is exposure (the form and free-form drills)', async () => {
    const s = await setup();
    const before = Object.fromEntries(BYSTANDERS.map((b) => [b, s.exposures(b)]));
    const item = { op: 'type', id: 'pr:u01-2:type', node: TARGET, sentence: 'u01-2', direction: 'productive', scoring: 'exposure', credit: s.credit } as PracticeItem;
    s.run.score(item, miss);
    expectTargetOnly(s, before);
  });

  test('a review whose target has no card in that direction yet', async () => {
    const s = await setup();
    expect(s.w.learner.hasCard(TARGET, 'productive')).toBe(false);
    const before = Object.fromEntries(BYSTANDERS.map((b) => [b, s.exposures(b)]));
    const item = { op: 'review', id: 'rv:x', node: TARGET, targets: [TARGET], direction: 'productive', novel: false, scoring: 'review', credit: s.credit, sentence: 'u01-2' } as ReviewItem;
    s.run.score(item, miss);
    expectTargetOnly(s, before);
  });

  test('an in-lesson step on a node whose introduction is over', async () => {
    const s = await setup();
    const before = Object.fromEntries(BYSTANDERS.map((b) => [b, s.exposures(b)]));
    s.run.learningStep(TARGET, miss, s.credit, true, 'learn');
    expectTargetOnly(s, before);
  });

  test('a new item in "Before you go"', async () => {
    const s = await setup();
    const before = Object.fromEntries(BYSTANDERS.map((b) => [b, s.exposures(b)]));
    s.run.scoreRecap({ kind: 'new', node: TARGET, direction: 'receptive', credit: s.credit } as RecapItem, miss);
    expectTargetOnly(s, before);
  });

  test('so Weak spots no longer charge the bystanders for the target\'s misses', async () => {
    const s = await setup();
    const item = { op: 'type', id: 'pr:u01-2:type', node: TARGET, sentence: 'u01-2', direction: 'productive', scoring: 'exposure', credit: s.credit } as PracticeItem;
    for (let i = 0; i < 4; i++) s.run.score({ ...item, id: `${item.id}:${i}` }, miss);
    const spots = weakSpots(s.w.learner.events(), (id) => s.w.bundle.node(id), { now: s.w.now() });
    const charged = spots.flatMap((sp) => sp.nodes);
    expect(charged).toContain(TARGET);
    for (const b of BYSTANDERS) expect(charged).not.toContain(b);
  });
});
