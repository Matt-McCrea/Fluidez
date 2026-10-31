// Session resume: a half-run session, saved and reopened from the same stores,
// must finish exactly as a straight run would.
import { describe, expect, it } from 'vitest';
import { Learner } from '../../src/learner';
import { SessionRunner, compilePlan, softBlock, truncatable } from '../../src/ui/session/runner';
import { UiStore, type SavedSession } from '../../src/ui/store/ui';
import { runBlock, world, type Walk } from './driver';

type World = Awaited<ReturnType<typeof world>>;

/** Run blocks [from, to) the way driver.session() does. */
function play(w: World, run: SessionRunner, from: number, to: number, walk: Walk) {
  const blocks = run.plan.blocks;
  for (let i = from; i < Math.min(to, blocks.length); i++) {
    const b = blocks[i];
    if (b.kind === 'close') break;
    if (softBlock(b) && run.overBudget()) { run.skip(b); continue; }
    if (b.kind === 'recap' && !run.openRecap(b)) continue;
    if (truncatable(b)) run.enter(b); else run.blockShown(b);
    runBlock(b, run, 'right', walk);
    if (!['warmup', 'leech', 'learn', 'teach', 'structuredInput', 'controlledOutput', 'cuedProduction', 'communicative', 'remix', 'readingCheck', 'extraReading', 'timedRecall', 'recap'].includes(b.kind)) w.clock.t += b.minutes * 60_000;
  }
}
/** Two worlds that compile the same plan: the seed comes from the learner id. */
const sameLearner = async (w: World) => { await w.ui.update((s) => { s.learnerId = 'resume-test'; }); return w; };
const newWalk = (w: World): Walk => ({ cards: [], failures: [], screens: [], advance: (ms) => { w.clock.t += ms; } });

function savedFrom(w: World, run: SessionRunner, block: number): SavedSession {
  const elapsedMs = run.elapsed() * 60_000;
  return {
    version: 1, learnerId: w.ui.state.learnerId, sessionIndex: w.learner.sessionIndex, mode: 'next', capMinutes: run.capMinutes,
    startedAt: w.now() - elapsedMs, elapsedMs, savedAt: w.now(), plan: run.plan, block, cursor: {}, runner: run.snapshot(),
  };
}

const ledgerViews = (w: World) => {
  const out: Record<string, number> = {};
  const l = w.learner.toJSON().ledger as Record<string, Record<string, { views: unknown[] }>>;
  for (const kind of Object.keys(l)) for (const [id, e] of Object.entries(l[kind])) out[`${kind}:${id}`] = e.views.length;
  return out;
};

describe('session resume', () => {
  it('finishes the same as a straight run, without a second startSession or a double ledger view', async () => {
    // straight
    const a = await sameLearner(await world());
    const planA = compilePlan(a.learner, a.bundle, a.ui, { now: a.now() });
    const runA = new SessionRunner(a.learner, a.bundle, a.ui, planA, a.now);
    runA.start();
    play(a, runA, 0, 99, newWalk(a));
    await runA.finish();

    // interrupted after two blocks
    const b = await sameLearner(await world());
    const planB = compilePlan(b.learner, b.bundle, b.ui, { now: b.now() });
    expect(planB.blocks.length).toBeGreaterThan(3);
    const runB = new SessionRunner(b.learner, b.bundle, b.ui, planB, b.now);
    runB.start();
    const index = b.learner.sessionIndex;
    play(b, runB, 0, 2, newWalk(b));
    const scoredBefore = runB.tally.scored;
    await b.ui.saveSession(savedFrom(b, runB, 2));
    await b.learner.flush();

    // a new page load from the same stores
    const learner = await Learner.open(b.store, { now: b.now });
    const ui = await new UiStore(b.kv).load();
    expect(ui.session?.block).toBe(2);
    const resumed = SessionRunner.resume(learner, b.bundle, ui, ui.session!, b.now);
    expect(learner.sessionIndex).toBe(index);
    expect(resumed.tally.scored).toBe(scoredBefore);
    expect(resumed.elapsed()).toBeCloseTo(runB.elapsed(), 5);
    const w2 = { ...b, learner, ui } as World;
    play(w2, resumed, 2, 99, newWalk(w2));
    await resumed.finish();

    expect(learner.sessionIndex).toBe(index);
    expect(ui.path).toEqual(a.ui.path);
    expect(ledgerViews(w2)).toEqual(ledgerViews(a));
    for (const n of Object.values(ledgerViews(w2))) expect(n).toBe(1);
    expect(resumed.tally).toEqual(runA.tally);
    expect(ui.session).toBeUndefined();
    expect(await b.kv.get('session')).toBeUndefined();
  });

  it('a two-hour gap does not put the resumed session over budget', async () => {
    const w = await world();
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    run.start();
    play(w, run, 0, 1, newWalk(w));
    const saved = savedFrom(w, run, 1);
    w.clock.t += 2 * 3_600_000;
    const again = SessionRunner.resume(w.learner, w.bundle, w.ui, saved, w.now);
    expect(again.elapsed()).toBeCloseTo(saved.elapsedMs / 60_000, 5);
    expect(again.overBudget()).toBe(false);
  });
});
