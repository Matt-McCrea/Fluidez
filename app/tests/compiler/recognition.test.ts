// A node that is recognition only (voseo, the future subjunctive, ...) is taught receptive-only and practised by reading, never
// by typing (LC1-004, LC1-005): no production card, and no drill block that asks the learner to say it.
import { describe, expect, test } from 'vitest';
import { advancePath, buildContentIndex, buildCourse, compileSession, initialPath, servedRefs, type PathState, type SessionPlan } from '../../src/compiler';
import { Learner } from '../../src/learner';
import { syntheticCorpus } from '../../tools/sim/synthetic';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

/** The synthetic course with its first grammar point marked "Recognition only", walked until it has been taught and drilled. */
function walkIt(recognition: boolean) {
  const c = syntheticCorpus({ maxUnits: 3, seed: 4 });
  const g = c.units[0].days.find((d) => d.type === 'introduce')!.focus[0];
  if (recognition) Object.assign(c.nodes.find((n) => n.id === g)!, { note: 'Recognition only (legal texts, proverbs).' });
  const course = buildCourse(c.units, c.nodes);
  const content = buildContentIndex(c.source, course);
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  let path: PathState = initialPath();
  const plans: SessionPlan[] = [];
  for (let d = 0; d < 16; d++) {
    t = T0 + d * DAY;
    const plan = compileSession({ learnerId: 'rec', learner: L, path, course, content, now: t });
    plans.push(plan);
    L.startSession(t);
    for (const n of Object.values(plan.newNodes).flat()) L.introduce(n, { results: [true, true, true], at: t, productive: !plan.receptiveOnly.includes(n) });
    for (const r of servedRefs(plan)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: t });
    for (const b of plan.blocks) if (b.kind === 'warmup') for (const it of b.items) if (L.hasCard(it.node, it.direction)) L.review(it.node, it.direction, 3, { at: t });
    path = advancePath(path, plan, true);
  }
  return { g, L, plans };
}

describe('a recognition-only grammar point', () => {
  test('is introduced receptive-only and gets no production card', () => {
    const { g, L, plans } = walkIt(true);
    const intro = plans.find((p) => p.newNodes.grammar.includes(g))!;
    expect(intro.receptiveOnly).toContain(g);
    expect(L.hasCard(g, 'receptive')).toBe(true);
    expect(L.hasCard(g, 'productive')).toBe(false);
    const { L: other } = walkIt(false);
    expect(other.hasCard(g, 'receptive')).toBe(true);
  });

  test('is drilled by reading: picks, and no block that asks for it typed, no talk about you, no freer writing', () => {
    const { g, plans } = walkIt(true);
    const drill = plans.find((p) => p.blocks.some((b) => b.kind === 'ruleRecall' && b.node === g))!;
    expect(drill).toBeDefined();
    const kinds = drill.blocks.map((b) => b.kind);
    expect(kinds).toContain('structuredInput');
    expect(kinds).not.toContain('controlledOutput');
    expect(kinds).not.toContain('communicative');
    expect(drill.blocks.some((b) => b.kind === 'writing' && b.purpose === 'freer')).toBe(false);
    for (const b of drill.blocks) if ('items' in b && b.kind !== 'learn' && b.kind !== 'teach' && b.kind !== 'warmup') {
      for (const it of b.items as Array<{ op: string; node: string }>) if (it.node === g) expect(['pick', 'comprehend', 'read'], `${it.op} on ${g}`).toContain(it.op);
    }
    // the same point, not marked, is drilled as ever
    const normal = walkIt(false);
    expect(normal.plans.find((p) => p.blocks.some((b) => b.kind === 'ruleRecall' && b.node === normal.g))!.blocks.map((b) => b.kind)).toContain('controlledOutput');
  });

  test('is not typed in a remix or a back-to-these run either', () => {
    const { g, plans } = walkIt(true);
    for (const p of plans) for (const b of p.blocks) {
      if (b.kind === 'remix' || (b.kind === 'controlledOutput' && b.remedial)) for (const it of b.items) expect(it.node, `${b.kind} on ${g}`).not.toBe(g);
    }
  });
});
