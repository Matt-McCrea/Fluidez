// Focused compiler tests: determinism, seeding, path advance, "another",
// minimum sessions, the backlog throttle and shortages.
import { describe, expect, test } from 'vitest';
import {
  advancePath, canDoAnother, compileSession, initialPath, servedRefs, sessionSeed, budget,
  type CompileInput, type PathState,
} from '../../src/compiler';
import { Learner } from '../../src/learner';
import { corpus } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

function setup(seed = 1) {
  const { course, content } = corpus({ seed });
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  const input = (path: PathState, extra: Partial<CompileInput> = {}): CompileInput =>
    ({ learnerId: 'learner-a', learner: L, path, course, content, now: t, ...extra });
  /** run a plan the way the UI does: start, mark served, introduce new nodes, review warm-up Good */
  const run = (plan: ReturnType<typeof compileSession>) => {
    L.startSession(t);
    for (const n of Object.values(plan.newNodes).flat()) L.introduce(n, { results: [true, true, true], at: t });
    for (const r of servedRefs(plan)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: t });
    for (const b of plan.blocks) if (b.kind === 'warmup') for (const it of b.items) if (L.hasCard(it.node, it.direction)) L.review(it.node, it.direction, 3, { at: t });
  };
  return { course, content, L, input, run, setT: (x: number) => { t = x; }, now: () => t };
}

describe('determinism', () => {
  test('same input → identical plan; a different learner id → a different seed', () => {
    const s = setup();
    const p = initialPath();
    const a = compileSession(s.input(p));
    const b = compileSession(s.input(p));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    const c = compileSession(s.input(p, { learnerId: 'learner-b' }));
    expect(c.seed).not.toBe(a.seed);
    expect(a.seed).toBe(sessionSeed('learner-a', 1));
  });

  test('the seed follows the session index, not the lesson: re-compiling the same day later reshuffles', () => {
    const s = setup();
    const p = initialPath();
    const a = compileSession(s.input(p));
    s.L.startSession(); // a session happened (abandoned): the same path day again
    const b = compileSession(s.input(p));
    expect(b.unit).toBe(a.unit);
    expect(b.day).toBe(a.day);
    expect(b.seed).toBe(sessionSeed('learner-a', 2));
    expect(b.seed).not.toBe(a.seed);
  });

  test('compileSession never mutates the learner or the path', () => {
    const s = setup();
    let path = initialPath();
    for (let d = 0; d < 6; d++) {
      s.setT(T0 + d * DAY);
      const before = JSON.stringify(s.L.toJSON());
      const pathBefore = JSON.stringify(path);
      const plan = compileSession(s.input(path));
      expect(JSON.stringify(s.L.toJSON())).toBe(before);
      expect(JSON.stringify(path)).toBe(pathBefore);
      s.run(plan);
      path = advancePath(path, plan, true);
    }
  });
});

describe('path', () => {
  test('advances only when a non-minimum core completes; an abandoned session changes nothing', () => {
    const s = setup();
    const p0 = initialPath();
    const plan = compileSession(s.input(p0));
    expect(plan.advancesPath).toBe(true);
    expect(advancePath(p0, plan, false)).toBe(p0);
    const p1 = advancePath(p0, plan, true);
    expect([p1.unit, p1.day]).toEqual([0, 1]);
    expect(p1.coreSessions).toBe(1);
    const min = compileSession(s.input(p1, { tier: 'minimum' }));
    const p2 = advancePath(p1, min, true);
    expect([p2.unit, p2.day, p2.coreSessions]).toEqual([0, 1, 1]);
  });

  test('"another" compiles the next path day when the review budget allows', () => {
    const s = setup();
    let path = initialPath();
    const first = compileSession(s.input(path));
    s.run(first);
    path = advancePath(path, first, true);
    s.setT(s.now() + 40 * 60_000);
    expect(canDoAnother(s.input(path))).toBe(true);
    const second = compileSession(s.input(path, { mode: 'another' }));
    expect(second.mode).toBe('another');
    expect(second.day).toBe(1);
    expect(second.type).toBe(s.course.units[0].days[1].type);
    expect(second.blocks[0].kind).toBe('warmup');
  });

  test('the first introduce is drilled next, and the intro is recorded as pending until then', () => {
    const s = setup();
    let path = initialPath();
    const intro = compileSession(s.input(path));
    expect(intro.type).toBe('introduce');
    expect(intro.newNodes.grammar).toHaveLength(1);
    expect(intro.pathAfter.pendingDrills.map((p) => p.node)).toEqual(intro.newNodes.grammar);
    s.run(intro);
    path = advancePath(path, intro, true);
    s.setT(T0 + DAY);
    const drill = compileSession(s.input(path));
    expect(drill.type).toBe('drill');
    expect(drill.blocks.some((b) => b.kind === 'ruleRecall' && b.node === intro.newNodes.grammar[0])).toBe(true);
    expect(drill.pathAfter.pendingDrills).toEqual([]);
  });
});

describe('backlog throttle', () => {
  /** A learner with a big pile of due cards, standing on an input day. */
  function backlog() {
    const s = setup();
    let path = initialPath();
    for (let d = 0; d < 2; d++) { // introduce + drill
      s.setT(T0 + d * DAY);
      const plan = compileSession(s.input(path));
      s.run(plan);
      path = advancePath(path, plan, true);
    }
    expect(s.course.units[0].days[path.day].type).toBe('input');
    for (let i = 0; i < 120; i++) s.L.introduce(`l:backlog${i}`, { results: [true, true, true], at: T0 });
    s.setT(T0 + 30 * DAY);
    return { s, path };
  }

  test('an input day with a backlog becomes review, cuts all new items, never trims reviews, does not advance', () => {
    const { s, path } = backlog();
    const plan = compileSession(s.input(path));
    expect(plan.budget.throttled).toBe(true);
    expect(plan.type).toBe('review');
    expect(plan.converted).toMatchObject({ from: 'input', to: 'review', reason: 'throttle' });
    expect(plan.advancesPath).toBe(false);
    expect(Object.values(plan.newNodes).flat()).toEqual([]);
    const w = plan.blocks[0];
    if (w.kind !== 'warmup') throw new Error('warmup first');
    // the whole session goes to reviews, far over the band's warm-up budget
    expect(w.minutes).toBeGreaterThan(budget.warmupMinutes('standard', plan.budget.band) * 2);
    expect(w.carried + w.covered).toBe(plan.budget.due);
    expect(w.covered).toBe(w.items.reduce((a, it) => a + it.targets!.length, 0));
    expect(plan.pathAfter.day).toBe(path.day);
    expect(canDoAnother(s.input(path))).toBe(false);
    expect(compileSession(s.input(path, { mode: 'another' })).type).toBe('review');
  });

  test('a minimum session on a backlog: warm-up + re-read + timed recall only, no new items', () => {
    const { s, path } = backlog();
    const plan = compileSession(s.input(path, { tier: 'minimum' }));
    expect(plan.type).toBe('minimum');
    expect(plan.blocks.map((b) => b.kind).filter((k) => !['warmup', 'reread', 'timedRecall', 'close'].includes(k))).toEqual([]);
    expect(plan.blocks.some((b) => b.kind === 'timedRecall')).toBe(true);
    expect(Object.values(plan.newNodes).flat()).toEqual([]);
  });
});

describe('shortage', () => {
  test('a missing chapter is a logged shortage, never a substitute text, and the reading slot converts to review', () => {
    const s = setup();
    let path = initialPath();
    for (let d = 0; d < 2; d++) {
      s.setT(T0 + d * DAY);
      const plan = compileSession(s.input(path));
      s.run(plan);
      path = advancePath(path, plan, true);
    }
    const inputDay = s.course.units[0].days[path.day];
    const content = { ...s.content, chapters: s.content.chapters.filter((c) => c.id !== inputDay.chapter), chapterById: new Map(s.content.chapterById) };
    content.chapterById.delete(inputDay.chapter!);
    s.setT(T0 + 2 * DAY);
    const plan = compileSession({ ...s.input(path), content });
    expect(plan.blocks.some((b) => b.kind === 'read')).toBe(false);
    expect(plan.diagnostics.some((d) => d.code === 'shortage' && d.what === 'chapter')).toBe(true);
    expect(plan.converted).toMatchObject({ from: 'input', to: 'review', reason: 'shortage' });
    expect(plan.blocks.some((b) => b.kind === 'remix')).toBe(true);
  });

  test('when no unseen gated sentence is left, a review is served bare (logged), never in a seen sentence', () => {
    const s = setup();
    s.L.introduce('g:g1', { results: [true, true, true], at: T0 });
    // mark every sentence containing g:g1 as seen
    for (const id of [...(s.content.byTarget.get('g:g1') ?? []), ...(s.content.byRequire.get('g:g1') ?? [])]) s.L.ledger.markSeen('sentence', id, { at: T0 });
    s.setT(T0 + 10 * DAY);
    const plan = compileSession(s.input(initialPath()));
    const w = plan.blocks[0];
    if (w.kind !== 'warmup') throw new Error('warmup first');
    const item = w.items.find((i) => i.node === 'g:g1');
    expect(item?.sentence).toBeUndefined();
    expect(plan.diagnostics.some((d) => d.code === 'bareReview' && d.node === 'g:g1')).toBe(true);
    expect(servedRefs(plan).some((r) => r.id === item?.id)).toBe(false);
  });
});
