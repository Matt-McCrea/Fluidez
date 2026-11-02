// An interrupted lesson must not lose what it presented. Opening a lesson
// used to mark its grammar point introduced with no card, so the compiler took
// it for known: never reviewed, never taught again. Here a real session (u07
// day 0) is abandoned at every block, then the next day is compiled.
import { beforeAll, describe, expect, it } from 'vitest';
import type { Block, LearnBlock, SessionPlan, TeachBlock } from '../../src/compiler';
import { Learner, MemoryStore } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { applyPlacement } from '../../src/ui/session/placement';
import { SessionRunner, compilePlan, sweepIntroductions, truncatable } from '../../src/ui/session/runner';
import { teachOrder } from '../../src/ui/session/order';
import { MemoryKV, UiStore, type SavedSession } from '../../src/ui/store/ui';
import { runBlock, type Walk } from './driver';

const DAY = 86_400_000;
const HOUR = 3_600_000;
const GRAMMAR = 'g:hay-vs-esta';

let bundle: Bundle;
beforeAll(async () => { bundle = await new ContentLoader().load({ band: 'A1' }); }, 120_000);

/** a learner placed at u07, so day 0 of the unit is the next lesson */
async function atU07() {
  const clock = { t: new Date(2026, 9, 1, 18).getTime() };
  const now = () => clock.t;
  const store = new MemoryStore();
  const learner = await Learner.open(store, { now });
  const ui = await new UiStore(new MemoryKV()).load();
  await ui.update((s) => { s.onboarded = true; s.learnerId = 'abandon-test'; });
  await ui.setPath(applyPlacement(learner, bundle, 6, now()));
  return { clock, now, learner, ui, bundle };
}
type World = Awaited<ReturnType<typeof atU07>>;

const newNodes = (p: SessionPlan) => Object.values(p.newNodes).flat();
const walk = (w: World): Walk => ({ cards: [], failures: [], screens: [], advance: (ms) => { w.clock.t += ms; } });
const ok = { correct: true, tries: 1, ms: 5000 } as const;

/** How far into a block the learner got before leaving. */
type Depth = 'opened' | 'practised';

/** Open block `b` the way its component does, and stop part way: a presentation shown, or one answer given. */
function openPartly(run: SessionRunner, b: Block, depth: Depth): void {
  if (truncatable(b)) run.enter(b); else run.blockShown(b);
  if (b.kind === 'learn') {
    const first = (b as LearnBlock).items[0];
    if (!first) return;
    run.present(first.node, first.productive);
    if (depth === 'practised') run.learningStep(first.node, ok, first.credit, first.productive, 'learn');
  } else if (b.kind === 'teach') {
    const t = b as TeachBlock;
    run.present(t.node);
    if (depth === 'practised') {
      const { first, mixed } = teachOrder(t.items);
      first.forEach((it) => run.score(it, ok));
      if (mixed[0]) run.score(mixed[0], ok);
    }
  }
}

/** Play blocks before `at` through, open block `at` part way, then leave. */
async function leaveAt(w: World, at: number, depth: Depth, keepSaved = false) {
  const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
  const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
  run.start();
  const wk = walk(w);
  for (let i = 0; i < at; i++) {
    const b = plan.blocks[i];
    if (run.skippable(b) && run.overBudget()) { run.skip(b); continue; }
    if (b.kind === 'recap' && !run.openRecap(b)) continue;
    if (truncatable(b)) run.enter(b); else run.blockShown(b);
    runBlock(b, run, 'right', wk);
  }
  openPartly(run, plan.blocks[at], depth);
  await run.abandon({ keepSaved });
  return { plan, run };
}

const saved = (w: World, run: SessionRunner, block: number): SavedSession => ({
  version: 1, learnerId: w.ui.state.learnerId, sessionIndex: w.learner.sessionIndex, mode: 'next', capMinutes: run.capMinutes,
  startedAt: w.now(), elapsedMs: 0, savedAt: w.now(), plan: run.plan, block, cursor: {}, runner: run.snapshot(),
});

describe('an interrupted lesson (real content, u07 day 0)', () => {
  it('the reproduction: the teach block is opened, the learner leaves, the next day teaches it again', async () => {
    const w = await atU07();
    const { plan } = await leaveAt(w, 2, 'opened');
    expect(plan.blocks[2]).toMatchObject({ kind: 'teach', node: GRAMMAR });
    w.clock.t += DAY;
    const next = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    expect(w.learner.isLearning(GRAMMAR)).toBe(false);
    expect(next.blocks.some((b) => b.kind === 'teach' && b.node === GRAMMAR)).toBe(true);
    expect(next.newNodes.grammar).toEqual([GRAMMAR]);
  });

  const day0 = async () => (await leaveAt(await atU07(), 0, 'opened')).plan;
  it('has the blocks the reproduction needs', async () => {
    const plan = await day0();
    expect(plan.blocks.map((b) => b.kind)).toEqual(['warmup', 'learn', 'teach', 'read', 'personal', 'recap', 'close']);
  });

  for (const depth of ['opened', 'practised'] as const) {
    for (let at = 0; at < 7; at++) {
      it(`left ${depth} at block ${at}: every new node has a card or comes round again, none is stuck in learning`, async () => {
        const w = await atU07();
        const { plan } = await leaveAt(w, at, depth);
        w.clock.t += DAY;
        const next = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
        // taught again, or owed by the plan that cut it: never dropped
        const again = new Set([...newNodes(next), ...next.pathAfter.owedNew, ...next.pathAfter.owedGrammar]);
        for (const id of w.learner.nodes()) expect(w.learner.isLearning(id), `${id} is introduced and still in its lesson`).toBe(false);
        for (const n of newNodes(plan)) {
          const hasCard = w.learner.hasCard(n, 'receptive') || w.learner.hasCard(n, 'productive');
          expect(hasCard || (!w.learner.isIntroduced(n) && again.has(n)), `${n}: card ${hasCard}, introduced ${w.learner.isIntroduced(n)}, taught again or owed ${again.has(n)}`).toBe(true);
        }
        // the path never moved, so the same day is on offer
        expect(next.unit).toBe(plan.unit);
        expect(next.day).toBe(plan.day);
      });
    }
  }

  it('a node that was practised is handed to the scheduler, rated from the steps it had', async () => {
    const w = await atU07();
    const { plan } = await leaveAt(w, 2, 'practised');
    w.clock.t += DAY;
    compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    expect(plan.blocks[2]).toMatchObject({ kind: 'teach', node: GRAMMAR });
    expect(w.learner.hasCard(GRAMMAR, 'receptive')).toBe(true);
    expect(w.learner.isLearning(GRAMMAR)).toBe(false);
  });

  it('a saved session survives a week and keeps its nodes mid-lesson', async () => {
    const w = await atU07();
    const { run } = await leaveAt(w, 2, 'practised', true);
    await w.ui.saveSession(saved(w, run, 2));
    expect(w.learner.isLearning(GRAMMAR)).toBe(true);
    w.clock.t += HOUR;
    compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    expect(w.learner.isLearning(GRAMMAR), 'inside the resume window the lesson is still open').toBe(true);
    w.clock.t += 7 * 24 * HOUR;
    compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    expect(w.learner.isLearning(GRAMMAR), 'a lesson survives midnight and a week while the learner has not moved on').toBe(true);
  });

  it('resuming a half-run session finishes it as a straight run would', async () => {
    const w = await atU07();
    const { plan, run } = await leaveAt(w, 2, 'practised', true);
    const snap = saved(w, run, 2);
    const again = SessionRunner.resume(w.learner, w.bundle, w.ui, snap, w.now);
    const wk = walk(w);
    for (let i = 2; i < plan.blocks.length; i++) {
      const b = plan.blocks[i];
      if (b.kind === 'close') break;
      if (b.kind === 'recap' && !again.openRecap(b)) continue;
      if (truncatable(b)) again.enter(b); else again.blockShown(b);
      runBlock(b, again, 'right', wk);
    }
    await again.finish();
    for (const n of newNodes(plan)) {
      expect(w.learner.isIntroduced(n), n).toBe(true);
      expect(w.learner.isLearning(n), n).toBe(false);
    }
  });

  it('sweeping twice changes nothing the second time', async () => {
    const w = await atU07();
    await leaveAt(w, 2, 'practised', true);
    expect(sweepIntroductions(w.learner, w.now())).toEqual([GRAMMAR]);
    expect(sweepIntroductions(w.learner, w.now())).toEqual([]);
  });
});
