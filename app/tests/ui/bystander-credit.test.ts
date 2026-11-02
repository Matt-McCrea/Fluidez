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
