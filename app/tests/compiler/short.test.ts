// Short days (C17): the five-minute session does not serve the same few cards, it teaches the next few words of the day,
// and short days add up to a lesson for the days that are made of words and a chapter.
import { describe, expect, test } from 'vitest';
import { advancePath, budget, compileSession, initialPath, servedRefs, type PathState, type SessionPlan } from '../../src/compiler';
import { buildContentIndex, buildCourse } from '../../src/compiler';
import type { GraphNode, Unit } from '../../src/content/schema';
import { Learner } from '../../src/learner';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { sessionLabel } from '../../src/ui/session/labels';
import type { Bundle } from '../../src/ui/data/bundle';
import { corpus, realCourse } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

const node = (id: string, kind: GraphNode['kind']): GraphNode =>
  ({ id, kind, band: 'A1', priority: 0, title: id, requires: [], contrasts: [], serves: [], pcic: [], placement: 'pcic', sources: [], variety: 'neutral' }) as GraphNode;

function setup(seed = 2) {
  const { course, content } = corpus({ seed });
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  let path: PathState = { ...initialPath(), coreSessions: budget.EARLY_SESSIONS };
  const plan = (extra: Partial<Parameters<typeof compileSession>[0]> = {}) => compileSession({ learnerId: 'short', learner: L, path, course, content, now: t, tier: 'minimum', ...extra });
  /** the session as the runner does it: start, introduce what was taught, ledger what was shown, expose what was recalled */
  const run = (p: SessionPlan, done = true) => {
    L.startSession(t);
    for (const n of Object.values(p.newNodes).flat()) L.introduce(n, { results: [true, true, true], at: t });
    for (const r of servedRefs(p)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: t });
    for (const b of p.blocks) if (b.kind === 'timedRecall') for (const it of b.items) L.expose([it.node], { at: t, event: { op: 'recall', direction: 'productive', grade: 3, tries: 1, ms: 5000 } });
    for (const b of p.blocks) if (b.kind === 'warmup') for (const it of b.items) if (L.hasCard(it.node, it.direction)) L.review(it.node, it.direction, 3, { at: t });
    if (done) path = advancePath(path, p, true);
    t += DAY;
  };
  return { course, content, L, plan, run, at: (p: PathState) => { path = p; }, path: () => path, setT: (x: number) => { t = x; } };
}

describe('the five-minute session does not serve the same few cards', () => {
  test('the timed recall goes round the recent items, and no two days in a row share one until they have', () => {
    const s = setup();
    // a learner who knows a good many items, all practised lately
    for (let i = 0; i < 70; i++) s.L.introduce(`l:known${i}`, { results: [true, true, true], at: T0 - (70 - i) * 3_600_000 });
    s.setT(T0 + 4 * DAY);
    const sets: string[][] = [];
    for (let d = 0; d < 5; d++) {
      const p = s.plan({ path: { ...initialPath(), coreSessions: budget.EARLY_SESSIONS, day: s.course.units[0].days.findIndex((d) => d.type === 'review') } });
      const recall = p.blocks.find((b) => b.kind === 'timedRecall');
      expect(recall && recall.kind === 'timedRecall').toBe(true);
      sets.push(recall && recall.kind === 'timedRecall' ? recall.items.map((i) => i.node) : []);
      s.run(p, false);
    }
    for (let k = 1; k < sets.length; k++) expect(sets[k].filter((n) => sets[k - 1].includes(n)), `day ${k} repeats day ${k - 1}`).toEqual([]);
    expect(new Set(sets.flat()).size).toBeGreaterThanOrEqual(48);
  });
});

describe('"Only five minutes?" keeps to five', () => {
  test('a slice is only taken when it fits the cap: a warm-up that fills it leaves no new words the session could not reach', () => {
    const s = setup();
    // a warm-up of about four minutes
    for (let i = 0; i < 24; i++) s.L.seedKnown(`l:due${i}`, { at: T0 - 9 * DAY, productive: false, receptive: { stability: 3, dueAt: T0 - 3_600_000 } });
    const day = s.course.units[0].days.findIndex((d) => d.type === 'input');
    const path = { ...initialPath(), coreSessions: budget.EARLY_SESSIONS, day };
    const learnt = (p: SessionPlan) => Object.values(p.newNodes).flat().length;
    const ten = s.plan({ path });
    expect(ten.blocks[0].minutes).toBeGreaterThan(3);
    expect(learnt(ten)).toBeGreaterThan(0);
    const five = s.plan({ path, capMinutes: 5 });
    expect(five.blocks[0].minutes).toBe(ten.blocks[0].minutes);
    expect(learnt(five)).toBeLessThan(learnt(ten));
    expect(five.blocks.filter((b) => b.kind === 'learn' || b.kind === 'read').reduce((a, b) => a + b.minutes, 0) + five.blocks[0].minutes + 0.5).toBeLessThanOrEqual(5.05);
  });
});

describe('short days add up to a lesson', () => {
  const inputDay = (c: ReturnType<typeof corpus>) => c.course.units[0].days.findIndex((d) => d.type === 'input');

  test('a short session on a day with new words teaches the next few of them, for real', () => {
    const s = setup();
    const day = inputDay(s);
    s.at({ ...initialPath(), coreSessions: budget.EARLY_SESSIONS, day });
    const p = s.plan();
    expect(p.type).toBe('minimum');
    const learn = p.blocks.find((b) => b.kind === 'learn');
    expect(learn && learn.kind === 'learn').toBe(true);
    const n = learn && learn.kind === 'learn' ? learn.items.length : 0;
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThanOrEqual(budget.SHORT_NEW_ITEMS);
    expect(Object.values(p.newNodes).flat()).toHaveLength(n);
    expect(p.newNodes.grammar).toEqual([]);
    expect(p.advancesPath).toBe(false);
    // five minutes, and the cap the quick session runs to
    expect(p.estimatedMinutes).toBeLessThanOrEqual(budget.MINIMUM_MINUTES);
  });

  test('an input day is finished by short sessions, its words and then its chapter, and then the path moves on', () => {
    const words = Array.from({ length: 7 }, (_, i) => node(`l:w${i}`, 'lexeme'));
    const units: Unit[] = [{
      id: 'u01', band: 'A1', title: 'u', theme: 't', canDo: 'c', storyArc: 'a',
      days: [{ type: 'input', focus: [], chunks: [], lexemes: words.map((w) => w.id), chapter: 'ch001' }, ...Array.from({ length: 5 }, () => ({ type: 'review' as const, focus: [], chunks: [], lexemes: [] }))],
    }];
    const course = buildCourse(units, words);
    const chapter = { id: 'ch001', unit: 'u01', title: 't', text: 'uno dos tres', gloss: [], hook: 'h', requires: words.map((w) => w.id), lexemes: [], questions: [1, 2].map((n) => ({ q: `q${n}`, options: ['a', 'b'], answer: 0 })) } as never;
    const content = buildContentIndex({ sentences: [], chapters: [chapter], scenes: [], writing: [], scripts: [] }, course);
    let t = T0;
    const L = Learner.fresh({ now: () => t });
    let path: PathState = { ...initialPath(), coreSessions: budget.EARLY_SESSIONS };
    const kinds: string[] = [];
    let moved = -1;
    for (let k = 0; k < 8 && moved < 0; k++) {
      const p = compileSession({ learnerId: 'short', learner: L, path, course, content, now: t, tier: 'minimum' });
      kinds.push(p.blocks.map((b) => b.kind).filter((x) => ['learn', 'read', 'timedRecall'].includes(x)).join('+') || '-');
      expect(p.estimatedMinutes, `session ${k}`).toBeLessThanOrEqual(budget.MINIMUM_MINUTES);
      L.startSession(t);
      for (const n of Object.values(p.newNodes).flat()) L.introduce(n, { results: [true, true, true], at: t });
      for (const r of servedRefs(p)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: t });
      if (p.advancesPath) { moved = k; expect(p.pathAfter.day).toBe(1); expect(p.newNodes.grammar).toEqual([]); }
      path = advancePath(path, p, true);
      t += DAY;
    }
    // 7 words, 3 a day: 3, 3, 1, and then the chapter
    expect(kinds).toEqual(['learn', 'learn', 'learn', 'read']);
    expect(moved).toBe(3);
    for (const w of words) expect(L.isIntroduced(w.id), w.id).toBe(true);
    expect(L.ledger.hasSeen('chapter', 'ch001')).toBe(true);
    expect(path.owedNew).toEqual([]);
  });

  test('the words are not owed twice: what a short day taught the full day does not teach again', () => {
    const s = setup();
    const day = inputDay(s);
    s.at({ ...initialPath(), coreSessions: budget.EARLY_SESSIONS, day });
    const first = s.plan();
    s.run(first, false);
    const taught = Object.values(first.newNodes).flat();
    const full = s.plan({ tier: 'standard' });
    for (const w of taught) expect(Object.values(full.newNodes).flat(), w).not.toContain(w);
  });

  test('a day with a grammar point to teach is not moved on by short sessions, however many', () => {
    const s = setup();
    const day = s.course.units[0].days.findIndex((d) => d.type === 'introduce');
    s.at({ ...initialPath(), coreSessions: budget.EARLY_SESSIONS, day });
    for (let k = 0; k < 8; k++) {
      const p = s.plan();
      expect(p.advancesPath).toBe(false);
      expect(p.newNodes.grammar).toEqual([]);
      expect(p.blocks.some((b) => b.kind === 'teach')).toBe(false);
      s.run(p);
      expect(s.path().day).toBe(day);
    }
  });

  test('a learner who only ever has five minutes learns words every day there are some, and the course waits at the first grammar point', () => {
    const real = realCourse(8);
    const run = simulateProfile({ ...PROFILES.average, name: 'fiveminute', minimumP: 1, skipP: 0.05 }, { days: 60, tier: 'standard', course: real.course, content: real.content, seed: 1 });
    const short = run.sessions.filter((x) => x.type === 'minimum');
    expect(short.length).toBeGreaterThan(40);
    // the day's words, three a session: u01 d0 lists 11 of them (a grammar point needs a full lesson, so the day stays)
    const taught = short.reduce((a, x) => a + x.newItems, 0);
    expect(taught).toBeGreaterThanOrEqual(8);
    expect(short.every((x) => x.estMinutes <= budget.MINIMUM_MINUTES)).toBe(true);
    expect(run.finalUnit).toBe(0);
  });
});

describe('what a short session is called', () => {
  test('by what it gives: new words, the story, or the warm-up', () => {
    const b = { title: (id: string) => id, story: [{ id: 'ch001', title: 'Hola' }], scenes: new Map() } as unknown as Bundle;
    const plan = (...kinds: string[]) => ({ type: 'minimum', blocks: kinds.map((kind) => ({ kind, chapter: 'ch001' })), unit: 'u01' }) as never;
    expect(sessionLabel(plan('warmup', 'learn', 'close'), b)).toBe('A few new words');
    expect(sessionLabel(plan('warmup', 'read', 'close'), b)).toBe('A bit of the story');
    expect(sessionLabel(plan('warmup', 'timedRecall', 'close'), b)).toBe('Quick warm-up');
  });
});
