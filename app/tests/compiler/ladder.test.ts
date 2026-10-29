// The choose, type, transform ladder in the compiled practice blocks: the op
// for a node comes from its rung, translate is mixed in from rung 1, and a
// streak of 1 adds a probe at the next rung as the last item.
import { describe, expect, test } from 'vitest';
import { compileSession, initialPath, servedRefs, type CompileInput, type PracticeBlock } from '../../src/compiler';
import { Learner } from '../../src/learner';
import { corpus } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

/** Walk days until a plan has a controlled-output block on a known grammar node; return how to recompile it. */
function find() {
  const { course, content } = corpus({ seed: 3 });
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  let path = initialPath();
  const input = (): CompileInput => ({ learnerId: 'learner-a', learner: L, path, course, content, now: t });
  for (let d = 0; d < 40; d++) {
    t = T0 + d * DAY;
    const pathAt = path;
    const plan = compileSession(input());
    L.startSession(t);
    for (const n of Object.values(plan.newNodes).flat()) L.introduce(n, { results: [true, true, true], at: t });
    for (const r of servedRefs(plan)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: t });
    path = plan.pathAfter;
    const co = plan.blocks.find((b): b is PracticeBlock => b.kind === 'controlledOutput' && !!b.focus && L.isIntroduced(b.focus) && b.items.filter((i) => i.node === b.focus).length >= 5);
    if (co) {
      // the same day again (the session was only served, not advanced): the block is the same shape
      return { L, focus: co.focus!, plan, input: () => ({ ...input(), path: pathAt }) };
    }
  }
  throw new Error('no controlled output block found');
}

function latest(plan: ReturnType<typeof compileSession>, focus: string) {
  const co = plan.blocks.find((b): b is PracticeBlock => b.kind === 'controlledOutput' && b.focus === focus);
  return co ? co.items.filter((i) => i.node === focus) : [];
}

describe('ladder ops by rung', () => {
  test('a node at rung 0 gets choose items, with a type probe at streak 1', () => {
    const s = find();
    // the first plan was compiled at rung 0
    const a = latest(s.plan, s.focus);
    expect(a.length).toBeGreaterThanOrEqual(5);
    expect(a.every((i) => i.op === 'choose')).toBe(true);
    s.L.stepRung(s.focus, 'pass');
    const p = compileSession(s.input());
    const co = p.blocks.find((b): b is PracticeBlock => b.kind === 'controlledOutput' && b.focus === s.focus);
    expect(co).toBeTruthy();
    const mine = co!.items.filter((i) => i.node === s.focus);
    expect(mine[mine.length - 1].op).toBe('type');
    expect(mine.slice(0, -1).every((i) => i.op === 'choose')).toBe(true);
  });

  test('a node at rung 2 gets transform items with a translate share', () => {
    const s = find();
    for (let i = 0; i < 4; i++) s.L.stepRung(s.focus, 'pass');
    expect(s.L.rung(s.focus)).toBe(2);
    const p = compileSession(s.input());
    const mine = latest(p, s.focus);
    expect(mine.length).toBeGreaterThanOrEqual(5);
    const ops = mine.map((i) => i.op);
    expect(ops.every((o) => o === 'transform' || o === 'translate')).toBe(true);
    expect(ops.filter((o) => o === 'translate').length).toBe(Math.floor(ops.length / 4));
    expect(ops.filter((o) => o === 'transform').length).toBeGreaterThan(0);
  });

  test('deterministic for a given rung', () => {
    const s = find();
    s.L.stepRung(s.focus, 'pass');
    s.L.stepRung(s.focus, 'pass');
    expect(JSON.stringify(compileSession(s.input()))).toBe(JSON.stringify(compileSession(s.input())));
  });
});
