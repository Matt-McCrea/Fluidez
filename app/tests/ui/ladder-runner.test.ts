// The runner moves a node's ladder rung after every choose/type/transform item.
import { describe, expect, test } from 'vitest';
import type { PracticeItem } from '../../src/compiler';
import { SessionRunner, compilePlan } from '../../src/ui/session/runner';
import { session, world } from './driver';

async function setup() {
  const w = await world();
  // play sessions until a plan carries a controlled-output item on an introduced node
  for (let i = 0; i < 12; i++) {
    const { plan } = await session(w, 'right');
    w.clock.t += 86_400_000;
    const next = compilePlan(w.learner, w.bundle, w.ui, { mode: 'next', now: w.now() });
    const it = next.blocks.flatMap((b) => ('items' in b ? (b.items as unknown[]) : []))
      .find((x): x is PracticeItem => !!x && typeof x === 'object' && ['choose', 'type', 'transform'].includes((x as PracticeItem).op) && w.learner.isIntroduced((x as PracticeItem).node));
    if (it) {
      const run = new SessionRunner(w.learner, w.bundle, w.ui, next, w.now);
      run.start();
      return { w, run, item: it };
    }
    void plan;
  }
  throw new Error('no ladder item found');
}
const ok = { correct: true, tries: 1, ms: 3000 };

describe('ladder in the runner', () => {
  test('two first-try passes climb the node', async () => {
    const { w, run, item } = await setup();
    const before = w.learner.rung(item.node);
    run.score(item, ok);
    expect(w.learner.rungStreak(item.node)).toBe(1);
    run.score(item, ok);
    const lex = item.node[0] === 'l';
    expect(w.learner.rung(item.node)).toBe(Math.min(before + 1, lex ? 1 : 3));
  });

  test('a pass on the retry keeps the rung; a miss descends', async () => {
    const { w, run, item } = await setup();
    run.score(item, ok);
    run.score(item, ok);
    const up = w.learner.rung(item.node);
    run.score(item, { correct: true, tries: 2, ms: 6000 });
    expect(w.learner.rung(item.node)).toBe(up);
    run.score(item, { correct: false, tries: 2, ms: 6000 });
    expect(w.learner.rung(item.node)).toBe(Math.max(0, up - 1));
    expect(w.learner.rungStreak(item.node)).toBe(0);
  });
});
