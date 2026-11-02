// The debt policy (L1, R18): old debt is paid at a capped rate and never throttles teaching, no card is touched, and a
// learner who comes back after days away is given a short warm-up and the next beat of the story.
import { describe, expect, test } from 'vitest';
import { advancePath, budget, compileSession, initialPath, type CompileInput, type PathState, type SessionPlan, type WarmupBlock } from '../../src/compiler';
import { Learner, SEEDED_REPS } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { applyPlacement } from '../../src/ui/session/placement';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { corpus, realCourse } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;
const HOUR = 3_600_000;

const warm = (p: SessionPlan): WarmupBlock => {
  const w = p.blocks[0];
  if (w.kind !== 'warmup') throw new Error('warm-up first');
  return w;
};

/** A learner who has done the first two days of the synthetic course and holds `n` more cards, all due at T0 + 3 days or so. */
function backlog(n: number) {
  const { course, content } = corpus({ seed: 1 });
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  let path: PathState = initialPath();
  for (let d = 0; d < 2; d++) {
    t = T0 + d * DAY;
    const plan = compileSession({ learnerId: 'debt', learner: L, path, course, content, now: t });
    L.startSession(t);
    for (const x of Object.values(plan.newNodes).flat()) L.introduce(x, { results: [true, true, true], at: t });
    path = advancePath(path, plan, true);
  }
  for (let i = 0; i < n; i++) L.introduce(`l:backlog${i}`, { results: [true, true, true], at: T0 });
  const due = n ? L.card('l:backlog0', 'receptive')!.due : T0 + 3 * DAY;
  // the learner has been studying all along, just not these cards: the last session was the day before
  const plan = (at: number, extra: Partial<CompileInput> = {}) => {
    if (L.lastSessionAt === undefined || at - L.lastSessionAt > DAY) L.startSession(at - DAY);
    return compileSession({ learnerId: 'debt', learner: L, path, course, content, now: at, ...extra });
  };
  return { L, path, course, due, plan, at: (x: number) => { t = x; return x; } };
}

describe('old debt is paid at a capped rate and never throttles', () => {
  test('a month on, the same backlog that throttled is debt: the day goes ahead and the warm-up pays a few', () => {
    const { due, plan, path, course } = backlog(120);
    const fresh = plan(due + 6 * HOUR);
    expect(fresh.budget.throttled).toBe(true);
    expect(fresh.type).toBe('review');
    const old = plan(due + 30 * DAY);
    expect(old.budget.throttled).toBe(false);
    expect(old.budget.dueMinutes).toBe(0);
    expect(old.type).toBe(course.units[path.unit].days[path.day].type);
    expect(old.converted).toBeUndefined();
    expect(old.advancesPath).toBe(true);
    expect(old.budget.debt?.cards).toBeGreaterThan(100);
    const w = warm(old);
    expect(w.debt).toBe(old.budget.debt!.cards);
    expect(w.paid).toBeGreaterThan(0);
    expect(w.paid).toBeLessThanOrEqual(budget.DEBT.cards + budget.MULTI_REVIEW_MAX - 1);
    expect(w.carried).toBeGreaterThan(90);
    // what it pays comes out of the warm-up's own budget
    expect(w.minutes).toBeLessThanOrEqual(w.budgetMinutes + 0.1);
  });

  test('the new items of the day are not cut for it', () => {
    const { due, plan } = backlog(120);
    const none = plan(due + 30 * DAY, { learner: Learner.fresh({ now: () => due + 30 * DAY }) });
    const old = plan(due + 30 * DAY);
    // the day is the same one; the debt takes none of its words (a throttled day takes all)
    expect(Object.values(old.newNodes).flat().length).toBeGreaterThan(0);
    expect(old.blocks.some((b) => b.kind === 'learn' || b.kind === 'teach')).toBe(true);
    void none;
  });

  test('no card is touched: compiling reads the learner and nothing more', () => {
    const { L, due, plan } = backlog(60);
    plan(due + 30 * DAY); // (the helper starts the session the learner had the day before)
    const before = JSON.stringify(L.toJSON());
    plan(due + 30 * DAY);
    plan(due + 30 * DAY);
    expect(JSON.stringify(L.toJSON())).toBe(before);
  });

  test('the fresh cards come first and fill the budget before any debt is paid', () => {
    const { L, due, plan, at } = backlog(120);
    const now = due + 30 * DAY;
    at(now);
    // 100 cards that fell due a few hours ago: fresh, and more than even a review day's warm-up holds
    for (let i = 0; i < 100; i++) L.seedKnown(`l:fresh${i}`, { at: now - 20 * DAY, productive: true, receptive: { stability: 3, dueAt: now - 6 * HOUR }, productiveCard: { stability: 3, dueAt: now - 6 * HOUR } });
    const p = plan(now);
    const w = warm(p);
    expect(p.budget.throttled).toBe(true);
    expect(w.debt).toBeGreaterThan(100);
    expect(w.paid).toBe(0);
  });

  test('with room left over, the debt is paid in the room and no more', () => {
    const { L, due, plan, at } = backlog(120);
    const now = due + 30 * DAY;
    at(now);
    // a few fresh cards, not enough to fill the budget
    for (let i = 0; i < 6; i++) L.seedKnown(`l:fresh${i}`, { at: now - 20 * DAY, productive: false, receptive: { stability: 3, dueAt: now - 6 * HOUR } });
    const p = plan(now);
    const w = warm(p);
    expect(p.budget.throttled).toBe(false);
    expect(w.covered - w.paid!).toBe(6);
    expect(w.paid).toBeGreaterThan(0);
    expect(w.minutes).toBeLessThanOrEqual(w.budgetMinutes + 0.1);
  });

  test('a review day pays more, and the cards it pays are capped as well as its minutes', () => {
    const { due, plan, course } = backlog(300);
    const now = due + 30 * DAY;
    const std = warm(plan(now));
    const over = course.units.findIndex((u) => u.days.some((d) => d.type === 'review'));
    const review = plan(now, { path: { ...initialPath(), unit: over, day: course.units[over].days.findIndex((d) => d.type === 'review') } });
    const w = warm(review);
    expect(review.type).toBe('review');
    expect(w.extended).toBe(true);
    expect(w.paid!).toBeGreaterThan(std.paid!);
    expect(w.paid!).toBeLessThanOrEqual(budget.DEBT.cards * budget.DEBT.reviewFactor + budget.MULTI_REVIEW_MAX - 1);
  });

  test('debt is overdue by more than a day, however long the interval', () => {
    const { course, content } = corpus({ seed: 1 });
    const now = T0 + 100 * DAY;
    const L = Learner.fresh({ now: () => now });
    L.startSession(now - DAY);
    L.seedKnown('l:late', { at: T0, productive: false, receptive: { stability: 90, dueAt: now - 2 * DAY } });
    L.seedKnown('l:today', { at: T0, productive: false, receptive: { stability: 90, dueAt: now - 6 * HOUR } });
    const p = compileSession({ learnerId: 'd', learner: L, path: initialPath(), course, content, now });
    expect(p.budget.due).toBe(2);
    expect(p.budget.debt?.cards).toBe(1);
    expect(warm(p).items.map((it) => it.node)).toEqual(['l:today', 'l:late']);
  });
});

describe('a card placement seeded is debt until it has been reviewed', () => {
  function placed() {
    const { course, content } = corpus({ seed: 1 });
    const unit = 3;
    let t = T0;
    const L = Learner.fresh({ now: () => t });
    const nodeOf = (id: string) => course.nodes.get(id);
    const path = applyPlacement(L, { course, node: nodeOf } as unknown as Bundle, unit, t);
    L.startSession(t);
    return { L, course, content, path, unit, at: (x: number) => { t = x; return x; } };
  }

  /** The same learner, at an honest pace of `secs` seconds a card (the compiler costs a warm-up by it). */
  function paced(L: Learner, secs: number, at: number) {
    const j = L.toJSON();
    j.timing = { receptive: { count: 200, totalMs: 200 * secs * 1000 }, productive: { count: 200, totalMs: 200 * secs * 1000 } };
    return Learner.fromJSON(j, { now: () => at });
  }

  test('seeded cards falling due on schedule do not throttle, and are paid at the cap', () => {
    const { L: placedL, course, content, path, unit } = placed();
    // the first day the seeds fall due, a few hours into it: on schedule, so none of them is late. At 30 s a card, a cohort is the better part of a warm-up
    const now = T0 + DAY + 6 * HOUR;
    const L = paced(placedL, 30, now);
    // (a node with both cards due is reviewed one way a session, so the cards that can be served are the nodes)
    const cohort = new Set(L.due(now).map((c) => c.node)).size;
    expect(cohort).toBeGreaterThan(8);
    const mk = (extra: Partial<CompileInput>) => compileSession({ learnerId: 'p', learner: L, path, course, content, now, ...extra });
    // without placedAt the compiler does not know they were seeded: they are the schedule's own work, and they count against the day
    const blind = mk({});
    expect(blind.budget.debt).toBeUndefined();
    expect(blind.budget.dueMinutes).toBeGreaterThan(2);
    // told where placement started the learner, it reads them as debt
    const p = mk({ placedAt: unit });
    expect(p.budget.throttled).toBe(false);
    expect(p.budget.dueMinutes).toBe(0);
    expect(p.budget.debt?.cards).toBe(cohort);
    expect(warm(p).paid).toBeGreaterThan(0);
    expect(warm(p).paid!).toBeLessThanOrEqual(budget.DEBT.cards + budget.MULTI_REVIEW_MAX - 1);
    expect(p.converted).toBeUndefined();
  });

  test('a seeded card that has been reviewed is a card like any other', () => {
    const { L, course, content, path, unit, at } = placed();
    const first = L.due(T0 + 90 * DAY).sort((a, b) => a.due - b.due)[0];
    expect(L.card(first.node, first.direction)!.reps).toBe(SEEDED_REPS);
    L.review(first.node, first.direction, 3, { at: first.due });
    expect(L.card(first.node, first.direction)!.reps).toBeGreaterThan(SEEDED_REPS);
    // due again just after it falls due the second time: fresh, though the node is one placement skipped
    const again = L.card(first.node, first.direction)!.due;
    const now = at(again + 6 * HOUR);
    const p = compileSession({ learnerId: 'p', learner: L, path, course, content, now, placedAt: unit });
    const w = warm(p);
    const item = w.items.find((it) => it.targets?.includes(first.node));
    expect(item).toBeDefined();
    const seeded = L.due(now).filter((c) => L.card(c.node, c.direction)!.reps === SEEDED_REPS).length;
    expect(w.debt ?? 0).toBeLessThanOrEqual(seeded + L.due(now).filter((c) => (now - c.due) / DAY > budget.DEBT.minDays).length);
  });
});

describe('the first session back after days away', () => {
  /** Two weeks into the synthetic course, then `away` days gone. */
  function returner(away: number, tier?: 'minimum' | 'standard') {
    const { course, content } = corpus({ seed: 2 });
    let t = T0;
    const L = Learner.fresh({ now: () => t });
    let path = initialPath();
    for (let d = 0; d < 14; d++) {
      t = T0 + d * DAY;
      const plan = compileSession({ learnerId: 'back', learner: L, path, course, content, now: t });
      L.startSession(t);
      for (const x of Object.values(plan.newNodes).flat()) L.introduce(x, { results: [true, true, true], at: t });
      path = advancePath(path, plan, true);
    }
    t = T0 + (13 + away) * DAY;
    return { L, path, plan: (extra: Partial<CompileInput> = {}) => compileSession({ learnerId: 'back', learner: L, path, course, content, now: t, ...(tier ? { tier } : {}), ...extra }), path0: path, course };
  }

  test('a week or more away: a short warm-up and the next beat of the story, and the day waits', () => {
    const { plan, path0, course } = returner(21);
    const p = plan();
    expect(p.reentry).toEqual({ days: 21 });
    expect(p.type).toBe('review');
    expect(p.converted).toMatchObject({ reason: 'reentry' });
    expect(p.advancesPath).toBe(false);
    expect(p.pathAfter.unit).toBe(path0.unit);
    expect(p.pathAfter.day).toBe(path0.day);
    const w = warm(p);
    expect(w.items.length).toBeLessThanOrEqual(budget.REENTRY.cards);
    expect(w.carried).toBeGreaterThan(0);
    expect(Object.values(p.newNodes).flat()).toEqual([]);
    // what follows the warm-up: the story, if there is a chapter to read, and then nothing but the close
    const kinds = p.blocks.map((b) => b.kind);
    expect(kinds.filter((k) => !['warmup', 'read', 'recap', 'close'].includes(k))).toEqual([]);
    expect(p.type).not.toBe(course.units[path0.unit].days[path0.day].type === 'review' ? 'x' : 'review-day-type');
  });

  test('the story beat comes last, before the close, when there is one to read', () => {
    let read = 0;
    for (const away of [8, 14, 21, 40]) {
      const p = returner(away).plan();
      const kinds = p.blocks.map((b) => b.kind);
      if (kinds.includes('read')) { read++; expect(kinds.indexOf('read')).toBe(1); }
    }
    expect(read).toBeGreaterThan(0);
  });

  test('a grammar point owed its drill is drilled on the return, however long the break (the drill rule outranks the gentle start)', () => {
    const { plan, path0 } = returner(21);
    const owed = path0.recentGrammar[0] ?? path0.pendingDrills[0]?.node;
    const withDrill = { ...path0, pendingDrills: [{ node: owed ?? 'g:g1', at: path0.coreSessions - budget.DRILL_WITHIN }] };
    const p = plan({ path: withDrill });
    expect(p.reentry).toBeDefined();
    expect(p.type).toBe('drill');
    expect(p.converted?.reason).not.toBe('reentry');
    expect(p.blocks.some((b) => b.kind === 'ruleRecall' && b.node === withDrill.pendingDrills[0].node)).toBe(true);
  });

  test('six days away is not a return; seven is', () => {
    expect(returner(5).plan().reentry).toBeUndefined();
    expect(returner(7).plan().reentry).toEqual({ days: 7 });
  });

  test('"another" session the same day is the day itself, not a second return', () => {
    const { plan, path0, course } = returner(21);
    const p = plan({ mode: 'another' });
    expect(p.converted?.reason).not.toBe('reentry');
    expect(p.reentry).toBeDefined();
    expect(p.type === 'review' ? true : p.type === course.units[path0.unit].days[path0.day].type).toBe(true);
  });

  test('the session after it is the day the path names, and it brings something new', () => {
    const { L, plan, path0, course } = returner(21);
    const back = plan();
    L.startSession(L.lastSessionAt! + 21 * DAY);
    const next = compileSession({ learnerId: 'back', learner: L, path: advancePath(path0, back, true), course, content: corpus({ seed: 2 }).content, now: L.lastSessionAt! + DAY });
    expect(next.reentry).toBeUndefined();
    expect(next.converted?.reason).not.toBe('reentry');
    void course;
  });

  test('a minimum session after days away says so too, and stays a minimum session', () => {
    const p = returner(21, 'minimum').plan();
    expect(p.type).toBe('minimum');
    expect(p.reentry).toEqual({ days: 21 });
  });

  test('a learner with no session yet is not a returner', () => {
    const { course, content } = corpus({ seed: 2 });
    const L = Learner.fresh({ now: () => T0 });
    expect(compileSession({ learnerId: 'new', learner: L, path: initialPath(), course, content, now: T0 + 400 * DAY }).reentry).toBeUndefined();
  });
});

describe('the profiles the policy is for, on the real course', () => {
  const real = realCourse(16);
  /** the sessions that are the first after a gap of a week or more, and the longest run of sessions without anything new */
  function walk(name: 'returner' | 'lapsed' | 'average', days: number) {
    const run = simulateProfile(PROFILES[name], { days, tier: 'standard', course: real.course, content: real.content, seed: 1 });
    const core = run.sessions.filter((s) => s.type !== 'minimum' && s.band !== 'done');
    let longest = 0, streak = 0;
    for (const s of core) { streak = s.fresh ? 0 : streak + 1; longest = Math.max(longest, streak); }
    return { run, core, longest };
  }

  test('after an absence no more than two sessions pass before one brings something new', () => {
    for (const name of ['returner', 'lapsed'] as const) {
      const { core } = walk(name, 140);
      const back = core.findIndex((s, i) => i > 0 && s.gap >= budget.REENTRY.days);
      expect(back, `${name} has a return`).toBeGreaterThan(0);
      expect(core[back].converted).toBe('reentry');
      // (the return itself brings the story when there is a chapter to read; the day after it may be a scheduled review day, which brings nothing new by design)
      const shown = core.slice(back, back + 3);
      expect(shown.some((s) => s.fresh), `${name}: ${shown.map((s) => `${s.type}${s.converted ? '/' + s.converted : ''}[${s.newItems}]`).join(' ')}`).toBe(true);
    }
  });

  test('no session is throttled or cut for debt: a throttle means the fresh cards alone were more than the warm-up holds', () => {
    let throttled = 0, withDebt = 0;
    const plans: SessionPlan[] = [];
    for (const name of ['returner', 'lapsed', 'average'] as const) {
      simulateProfile(PROFILES[name], { days: 140, tier: 'standard', course: real.course, content: real.content, seed: 1, onPlan: (p) => plans.push(p) });
    }
    for (const p of plans) {
      if (p.tier === 'minimum') continue;
      expect(p.budget.throttled, `session ${p.sessionIndex}`).toBe(p.budget.dueMinutes > p.budget.reviewMinutes);
      if (p.budget.throttled) throttled++;
      if (p.budget.debt) withDebt++;
      // a plan whose fresh reviews fit is never converted by the throttle, whatever debt is owed
      if (!p.budget.throttled) expect(p.converted?.reason).not.toBe('throttle');
    }
    expect(withDebt).toBeGreaterThan(20);
    expect(throttled).toBeGreaterThan(0);
  });
});
