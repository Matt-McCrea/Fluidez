// The session's ways out and its clock: "I need to stop", the time cap, the
// occasional "keep going", and the card order (spaced rounds, varied formats).
import { describe, expect, it } from 'vitest';
import type { LearnBlock, RecapBlock, WarmupBlock } from '../../src/compiler';
import { SessionRunner, compilePlan } from '../../src/ui/session/runner';
import { LearnQueue, RETRY_GAP, interleave } from '../../src/ui/session/order';
import { offerMore } from '../../src/ui/session/more';
import { answer, runBlock, session, world, type Walk } from './driver';
import { reviewCard } from '../../src/ui/session/cards';

const DAY = 86_400_000;
const MIN = 60_000;

describe('I need to stop', () => {
  it('ends as a minimum session: the path stays, the streak counts, what was taught is kept', async () => {
    const w = await world();
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    run.start();
    const learn = plan.blocks.find((b): b is LearnBlock => b.kind === 'learn')!;
    run.blockShown(learn);
    const first = learn.items[0].node;
    run.present(first);
    const before = structuredClone(w.ui.path);
    w.clock.t += 11 * MIN;
    const path = await run.stop();
    expect(path.unit).toBe(before.unit);
    expect(path.day).toBe(before.day);
    expect(path.coreSessions).toBe(before.coreSessions);
    expect(path.log[path.log.length - 1]).toMatchObject({ type: 'minimum', advanced: false });
    expect(w.ui.state.stats.days).toContain(w.learner.day(w.now()));
    expect(w.learner.isIntroduced(first)).toBe(true);
    expect(w.learner.isLearning(first)).toBe(false);
    // what was never shown is not introduced: it comes round again
    expect(w.learner.isIntroduced(learn.items[learn.items.length - 1].node)).toBe(false);
  });

  it('a grammar point taught before stopping still gets its drill', async () => {
    const w = await world();
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    run.start();
    const g = plan.newNodes.grammar[0];
    expect(g).toBeTruthy();
    run.present(g);
    const path = await run.stop();
    expect(path.pendingDrills.map((d) => d.node)).toContain(g);
  });
});

describe('the time cap', () => {
  it('new items the clock left out are owed, not introduced; the path still advances', async () => {
    const w = await world();
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now, { capMinutes: 1 });
    run.start();
    const learn = plan.blocks.find((b): b is LearnBlock => b.kind === 'learn')!;
    run.present(learn.items[0].node);
    w.clock.t += 2 * MIN;
    expect(run.overBudget()).toBe(true);
    const rest = learn.items.slice(1).map((i) => i.node);
    run.notTaught(rest);
    const path = await run.finish();
    expect(path.day).toBe(plan.pathAfter.day);
    for (const n of rest) {
      expect(w.learner.isIntroduced(n)).toBe(false);
      expect(path.owedNew).toContain(n);
    }
    expect(path.owedNew.slice(0, rest.length)).toEqual(rest);
  });

  it('minutes left is honest and never more than the cap allows', async () => {
    const w = await world();
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    run.start();
    expect(run.minutesLeft(0)).toBeLessThanOrEqual(plan.budget.minutes + 2);
    w.clock.t += 19 * MIN;
    expect(run.minutesLeft(0)).toBeLessThanOrEqual(3);
  });
});

describe('a few more minutes, now and then', () => {
  it('never in the first days, then at most every few days', async () => {
    const w = await world();
    const offers: boolean[] = [];
    for (let d = 0; d < 7; d++) {
      await session(w, 'right');
      offers.push(offerMore(w.learner, w.bundle, w.ui, w.now()));
      w.clock.t += DAY;
    }
    expect(offers.slice(0, 2)).toEqual([false, false]);
    for (let d = 1; d < offers.length; d++) expect(offers[d] && offers[d - 1]).toBe(false);
  });
});

describe('card order', () => {
  it('a missed item comes back a few cards later, not at the end', () => {
    const q = new LearnQueue(6);
    while (q.current?.kind === 'present') q.next();
    const at = q.pos;
    q.next(true);
    const back = q.steps.findIndex((s, i) => i > at && s.kind === 'ask' && s.i === 0);
    expect(back - at).toBe(RETRY_GAP + 1);
    expect(back).toBeLessThan(q.steps.length - 1);
  });

  it('out of time: nothing new is presented; presented items keep one ask', () => {
    const q = new LearnQueue(6);
    for (let k = 0; k < 4; k++) q.next(); // three presented, one asked
    const dropped = q.stopNew();
    expect(dropped).toEqual([3, 4, 5]);
    expect(q.steps.slice(q.pos).every((s) => s.kind === 'ask' && s.i < 3)).toBe(true);
  });

  it('interleave caps runs of one format', () => {
    const xs = ['a', 'a', 'a', 'a', 'a', 'a', 'b', 'b', 'a', 'a'];
    const order = interleave(xs, (x) => x, 3);
    let run = 0;
    order.forEach((i, k) => { run = k && xs[order[k - 1]] === xs[i] ? run + 1 : 1; if (xs.slice(0).some((x) => x !== xs[i])) expect(run).toBeLessThanOrEqual(5); });
    expect([...order].sort((a, b) => a - b)).toEqual(xs.map((_, i) => i));
    expect(order.slice(0, 4).map((i) => xs[i])).toEqual(['a', 'a', 'a', 'b']);
  });
});

describe('Before you go (the recap block)', () => {
  /** session 1 (new items), three days on, then session 2 with the first warm-up card missed */
  async function missOneThenRecap() {
    const w = await world();
    await session(w, 'right');
    w.clock.t += 3 * DAY;
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    run.start();
    const walk: Walk = { cards: [], failures: [], screens: [], advance: (ms) => { w.clock.t += ms; } };
    const warm = plan.blocks[0] as WarmupBlock;
    const missed = warm.items[0];
    let recap: RecapBlock | undefined;
    for (const b of plan.blocks) {
      if (b.kind === 'close') break;
      if (b.kind === 'recap') {
        expect(run.openRecap(b)).toBe(true);
        recap = b;
        run.blockShown(b);
        // the missed node is relearned: its card is in a (re)learning state until this re-ask
        runBlock(b, run, 'right', walk);
        continue;
      }
      if (b.kind === 'warmup') {
        run.blockShown(b);
        b.items.forEach((it, i) => run.score(it, answer(reviewCard(it, w.bundle), i === 0 ? 'wrong' : 'right')));
        continue;
      }
      if (b.kind === 'learn') run.blockShown(b); else if (b.kind === 'structuredInput' || b.kind === 'controlledOutput' || b.kind === 'communicative' || b.kind === 'cuedProduction') run.enter(b); else run.blockShown(b);
      runBlock(b, run, 'right', walk);
    }
    return { w, plan, run, recap: recap!, missed };
  }

  it('re-asks the missed card first, then the new items, and only the missed one is graded', async () => {
    const { w, plan, recap, missed } = await missOneThenRecap();
    const learn = plan.blocks.find((b): b is LearnBlock => b.kind === 'learn')!;
    expect(learn.items.length).toBeGreaterThanOrEqual(2);
    expect(recap.items[0]).toMatchObject({ kind: 'lapsed', node: missed.node });
    const news = recap.items.filter((i) => i.kind === 'new').map((i) => i.node);
    expect(news).toEqual(learn.items.map((i) => i.node).slice(0, news.length));
    expect(news.length).toBeGreaterThanOrEqual(2);
    expect(recap.items.length).toBeLessThanOrEqual(recap.capacity);
    expect(new Set(recap.items.map((i) => i.node)).size).toBe(recap.items.length);
    // the missed card was reviewed for real, with op 'recap'; the new items only have exposure events
    const log = w.learner.events().filter((e) => e.op === 'recap');
    expect(log.some((e) => e.node === missed.node && e.scored === 'review')).toBe(true);
    for (const n of news) {
      const ev = log.filter((e) => e.node === n);
      expect(ev.length).toBeGreaterThan(0);
      expect(ev.every((e) => e.scored === 'exposure')).toBe(true);
    }
    expect(w.learner.isLearning(news[0])).toBe(false);
  });
});

describe('Before you go, with nothing to ask', () => {
  it('an all-correct session with nothing new skips the recap silently', async () => {
    const w = await world();
    await session(w, 'right');
    w.clock.t += 3 * DAY;
    // session 2 (drill) is all correct; strip its new items so only correct reviews remain
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    run.start();
    const recap = plan.blocks.find((b): b is RecapBlock => b.kind === 'recap')!;
    expect(recap.items).toEqual([]);
    expect(run.openRecap(recap)).toBe(false);
    expect(recap.items).toEqual([]);
  });
});
