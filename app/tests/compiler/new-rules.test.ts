// The 29 Oct rules on the compiler side: budgets by band and tier,
// multi-target review items, review-context reuse after 120 days, and the
// production-card policy on new nodes.
import { describe, expect, test } from 'vitest';
import type { BankSentence, GraphNode, Unit } from '../../src/content/schema';
import {
  budget, reviewTargets, buildContentIndex, buildCourse, canDoAnother, compileSession, initialPath, servedRefs,
  type CompileInput, type PathState,
} from '../../src/compiler';
import { Learner, Rating, State } from '../../src/learner';
import { PROFILES } from '../../tools/sim/profiles';
import { syntheticCorpus } from '../../tools/sim/synthetic';
import { ALL_CHECKS, checkSpacing, corpus, walk } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

function node(id: string, kind: GraphNode['kind'], extra: Partial<GraphNode> = {}): GraphNode {
  return { id, kind, band: 'A1', priority: 0, title: id, requires: [], contrasts: [], serves: [], pcic: [], placement: 'pcic', sources: [], variety: 'neutral', ...extra } as GraphNode;
}
function sentence(id: string, targets: string[], requires: string[]): BankSentence {
  return { id, es: `frase ${id}.`, en: id, accept: [], acceptEn: [], requires, lexemes: [], targets, unit: 'u01', source: 'gen' } as BankSentence;
}

/** A one-unit course and a hand-made bank; the learner already knows l:a, l:b, l:c, l:d. */
function tiny(sentences: BankSentence[]) {
  const words = ['l:a', 'l:b', 'l:c', 'l:d'];
  const units: Unit[] = [{
    id: 'u01', band: 'A1', title: 'u', theme: 't', canDo: 'c', storyArc: 'a',
    quota: { bankSentences: 0, chapters: 0, scenes: 0, writingTasks: 0 },
    days: Array.from({ length: 7 }, () => ({ type: 'review' as const, focus: [], chunks: [], lexemes: [] })),
  }];
  const course = buildCourse(units, words.map((w) => node(w, 'lexeme')));
  const content = buildContentIndex({ sentences, chapters: [], scenes: [], writing: [], scripts: [] }, course);
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  for (const w of words) L.introduce(w, { results: [true, true, true], at: T0 });
  const input = (extra: Partial<CompileInput> = {}): CompileInput => ({ learnerId: 'x', learner: L, path: initialPath(), course, content, now: t, ...extra });
  return { L, input, setT: (x: number) => { t = x; } };
}

describe('budgets by band and tier', () => {
  const c = syntheticCorpus({ seed: 3 });
  const course = buildCourse(c.units, c.nodes);
  const content = buildContentIndex(c.source, course);
  const firstOf = (band: string) => course.units.findIndex((u) => u.band === band);

  test('standard session and warm-up minutes follow the band; extended adds core minutes; minimum is 10', () => {
    for (const band of ['A1', 'A2', 'B1', 'B2', 'C1'] as const) {
      const path: PathState = { ...initialPath(), unit: firstOf(band) };
      const L = Learner.fresh({ now: () => T0 });
      const plan = (tier: 'minimum' | 'standard' | 'extended') => compileSession({ learnerId: 'b', learner: L, path, course, content, now: T0, tier });
      const std = plan('standard');
      expect(std.budget.band).toBe(band);
      expect(std.budget.minutes).toBe(budget.SESSION_MINUTES[band]);
      expect(std.budget.reviewMinutes).toBe(budget.BAND_WARMUP_MINUTES[band]);
      const ext = plan('extended');
      expect(ext.budget.minutes).toBe(budget.SESSION_MINUTES[band] + budget.EXTENDED_EXTRA_MINUTES);
      expect(ext.budget.reviewMinutes).toBe(budget.BAND_WARMUP_MINUTES[band] + budget.EXTENDED_EXTRA_MINUTES);
      expect(ext.newNodes.grammar.length).toBeLessThanOrEqual(1);
      const min = plan('minimum');
      expect(min.budget.minutes).toBe(budget.MINIMUM_MINUTES);
      expect(min.budget.reviewMinutes).toBe(budget.MINIMUM_WARMUP_MINUTES);
    }
    expect(budget.SESSION_MINUTES).toEqual({ A1: 20, A2: 22, B1: 25, B2: 28, C1: 30 });
    expect(budget.MINIMUM_MINUTES).toBe(10);
    expect(budget.EXTENDED_EXTRA_MINUTES).toBe(15);
  });

  test('a backlog that fits the extended tier\'s extra minutes does not throttle it, but throttles standard', () => {
    const { L, input, setT } = tiny([]);
    for (let i = 0; i < 60; i++) L.introduce(`l:n${i}`, { results: [true, true, true], at: T0 });
    setT(T0 + 20 * DAY);
    const std = compileSession(input({ tier: 'standard' }));
    const ext = compileSession(input({ tier: 'extended' }));
    expect(std.budget.dueMinutes).toBeGreaterThan(budget.BAND_WARMUP_MINUTES.A1);
    expect(std.budget.throttled).toBe(true);
    expect(ext.budget.throttled).toBe(false);
    const w = ext.blocks[0];
    if (w.kind !== 'warmup') throw new Error('warmup first');
    expect(w.carried).toBe(0);
  });
});

describe('sibling burying', () => {
  const warm = (p: ReturnType<typeof compileSession>) => {
    const w = p.blocks[0];
    if (w.kind !== 'warmup') throw new Error('warmup first');
    return w;
  };

  test('both cards of a node due: productive is served, receptive stays due and is carried', () => {
    const { L, input, setT } = tiny([sentence('s-a', ['l:a'], ['l:a'])]);
    L.review('l:a', 'receptive', Rating.Good, { at: T0 + DAY }); // unlocks the production card
    setT(T0 + 30 * DAY);
    const both = L.due(T0 + 30 * DAY).filter((d) => d.node === 'l:a');
    expect(both.map((d) => d.direction).sort()).toEqual(['productive', 'receptive']);
    const plan = compileSession(input());
    const w = warm(plan);
    const a = w.items.filter((it) => reviewTargets(it).includes('l:a'));
    expect(a).toHaveLength(1);
    expect(a[0].direction).toBe('productive');
    expect(w.carried).toBeGreaterThanOrEqual(1);
    expect(w.carried + w.covered).toBe(w.due);
    // nothing rescheduled: the receptive card is still due
    expect(L.due(T0 + 30 * DAY).some((d) => d.node === 'l:a' && d.direction === 'receptive')).toBe(true);
  });

  test('productive in Learning while receptive is in Review: receptive is kept', () => {
    const { L, input, setT } = tiny([sentence('s-a', ['l:a'], ['l:a'])]);
    L.review('l:a', 'receptive', Rating.Good, { at: T0 + DAY }); // unlocks the production card
    setT(T0 + 30 * DAY);
    const due = L.due(T0 + 30 * DAY);
    const r = due.find((d) => d.node === 'l:a' && d.direction === 'receptive')!;
    const p = due.find((d) => d.node === 'l:a' && d.direction === 'productive')!;
    const forced = [...due.filter((d) => d.node !== 'l:a'), { ...r, state: State.Review }, { ...p, state: State.Learning }];
    const real = L.due.bind(L);
    L.due = (at?: number, dir?: any) => (dir ? real(at, dir) : (at === undefined ? real(at) : forced));
    const w = warm(compileSession(input()));
    const a = w.items.filter((it) => reviewTargets(it).includes('l:a'));
    expect(a).toHaveLength(1);
    expect(a[0].direction).toBe('receptive');
  });
});

describe('multi-target review items', () => {
  test('a sentence holding three due nodes is preferred and reviews all three at 1.4× a single', () => {
    const { input, setT } = tiny([
      sentence('s-a1', ['l:a'], ['l:a']),
      sentence('s-a2', ['l:a'], ['l:a', 'l:d']),
      sentence('s-abc', ['l:a'], ['l:a', 'l:b', 'l:c']),
      sentence('s-b', ['l:b'], ['l:b']),
      sentence('s-d', ['l:d'], ['l:d']),
    ]);
    setT(T0 + 10 * DAY);
    const plan = compileSession(input());
    const w = plan.blocks[0];
    if (w.kind !== 'warmup') throw new Error('warmup first');
    expect(w.due).toBe(4);
    const abc = w.items.find((it) => it.sentence === 's-abc');
    expect(abc).toBeDefined();
    expect([...abc!.targets!].sort()).toEqual(['l:a', 'l:b', 'l:c']);
    expect(w.covered).toBe(4);
    expect(w.items).toHaveLength(2);
    // cost: one multi item (1.4) + one single (1)
    expect(plan.budget.dueMinutes).toBeCloseTo((budget.MULTI_REVIEW_COST + 1) * plan.budget.secondsPerReview / 60, 6);
    expect(w.items.flatMap((it) => it.targets!).sort()).toEqual(['l:a', 'l:b', 'l:c', 'l:d']);
  });

  test('never more than MULTI_REVIEW_MAX targets, even when a sentence holds more due nodes', () => {
    const { input, setT } = tiny([sentence('s-all', ['l:a'], ['l:a', 'l:b', 'l:c', 'l:d'])]);
    setT(T0 + 10 * DAY);
    const w = compileSession(input()).blocks[0];
    if (w.kind !== 'warmup') throw new Error('warmup first');
    expect(w.items[0].targets).toHaveLength(budget.MULTI_REVIEW_MAX);
    expect(w.covered).toBe(4);
    expect(w.items.filter((it) => !it.sentence)).toHaveLength(1); // the 4th: bare, last resort
  });

  test('canDoAnother with the content index uses the grouped cost', () => {
    const { L, input, setT } = tiny([sentence('s-abc', ['l:a'], ['l:a', 'l:b', 'l:c']), sentence('s-d', ['l:d'], ['l:d'])]);
    for (let i = 0; i < 40; i++) L.introduce(`l:n${i}`, { results: [true, true, true], at: T0 });
    setT(T0 + 10 * DAY);
    const i = input();
    const grouped = compileSession(i).budget.dueMinutes;
    const single = L.due(i.now).length * L.secondsPerReview() / 60;
    expect(grouped).toBeLessThan(single);
    expect(canDoAnother({ ...i, content: i.content })).toBe(grouped <= budget.BAND_WARMUP_MINUTES.A1);
  });
});

describe('review-context reuse', () => {
  /** l:a's only sentence was shown once as a review context on day 3. */
  function shown(asReview: boolean) {
    const s = tiny([sentence('s-a', ['l:a'], ['l:a'])]);
    s.setT(T0 + 3 * DAY);
    s.L.ledger.markSeen('sentence', 's-a', { at: T0 + 3 * DAY, review: asReview || undefined });
    s.L.review('l:a', 'receptive', Rating.Good, { at: T0 + 3 * DAY });
    return s;
  }
  const itemFor = (plan: ReturnType<typeof compileSession>) => {
    const w = plan.blocks[0];
    if (w.kind !== 'warmup') throw new Error('warmup first');
    return w.items.find((it) => it.targets!.includes('l:a'));
  };

  test('not before 120 days: bare card (logged); from 120 days: re-served, deliberate and labelled', () => {
    const s = shown(true);
    s.setT(T0 + (3 + 119) * DAY);
    const early = compileSession(s.input());
    expect(itemFor(early)?.sentence).toBeUndefined();
    expect(early.diagnostics.some((d) => d.code === 'bareReview' && d.node === 'l:a')).toBe(true);

    s.setT(T0 + (3 + 121) * DAY);
    const late = compileSession(s.input());
    const it = itemFor(late)!;
    expect(it.sentence).toBe('s-a');
    expect(it.reused).toBe(true);
    expect(it.novel).toBe(false);
    const refs = servedRefs(late).filter((r) => r.id === 's-a' || r.id === it.id);
    expect(refs).toHaveLength(2);
    for (const r of refs) expect(r).toMatchObject({ deliberate: true, review: true, reason: budget.REVIEW_REUSE_REASON });
  });

  test('a sentence ever shown outside a review (example, drill, reading) is never reused', () => {
    const s = shown(false);
    s.setT(T0 + 400 * DAY);
    const plan = compileSession(s.input());
    expect(itemFor(plan)?.sentence).toBeUndefined();
  });

  test('an unseen sentence is preferred while the node still needs its first recombination pass', () => {
    const s = tiny([sentence('s-a', ['l:a'], ['l:a']), sentence('s-a2', ['l:a'], ['l:a'])]);
    s.L.ledger.markSeen('sentence', 's-a', { at: T0 + 3 * DAY, review: true });
    s.setT(T0 + 200 * DAY);
    expect(s.L.node('l:a')!.novelPasses).toBe(0);
    expect(itemFor(compileSession(s.input()))).toMatchObject({ sentence: 's-a2', novel: true });
    s.L.review('l:a', 'receptive', Rating.Good, { novel: true, at: T0 + 200 * DAY });
    s.setT(T0 + 400 * DAY);
    // with a pass on record, the old review context is used and the unseen one is saved
    expect(itemFor(compileSession(s.input()))).toMatchObject({ sentence: 's-a', reused: true });
  });

  test('property: a 300-day walk reuses review contexts and keeps every rule (no unintended repeats)', () => {
    for (const seed of [2, 5]) {
      let reusedRefs = 0;
      const { plans, run } = walk({
        seed, profile: PROFILES.average, days: 300, corpus: corpus({ seed, supply: 0.6 }),
        check: (s) => {
          for (const c of ALL_CHECKS) c(s);
          reusedRefs += servedRefs(s.plan).filter((r) => r.reason === budget.REVIEW_REUSE_REASON).length;
        },
      });
      checkSpacing(plans);
      expect(reusedRefs).toBeGreaterThan(0);
      expect(run.reviewItems.reused).toBeGreaterThan(0);
      expect(Object.values(run.unintendedRepeats).reduce((a, b) => a + b, 0)).toBe(0);
      expect(run.itemRepeats60).toBe(0);
      expect(run.reviewItems.multi).toBeGreaterThan(0);
    }
  }, 30_000);
});

describe('production-card policy on new nodes', () => {
  test('B2 lexemes without a rank come in receptive-only; a ranked one (≤ 3000) stays productive; chunks always productive', () => {
    const c = syntheticCorpus({ seed: 4 });
    const ui = c.units.findIndex((u) => u.band === 'B2');
    const di = c.units[ui].days.findIndex((d) => d.lexemes.length >= 2);
    const ranked = c.units[ui].days[di].lexemes[0];
    const nodes = c.nodes.map((n) => (n.id === ranked ? { ...n, freqRank: 1200 } : n));
    const course = buildCourse(c.units, nodes);
    const content = buildContentIndex(c.source, course);
    const L = Learner.fresh({ now: () => T0 });
    const plan = compileSession({ learnerId: 'p', learner: L, path: { ...initialPath(), unit: ui, day: di }, course, content, now: T0 });
    expect(plan.newNodes.lexemes).toContain(ranked);
    expect(plan.receptiveOnly).not.toContain(ranked);
    for (const id of plan.newNodes.lexemes.filter((x) => x !== ranked)) expect(plan.receptiveOnly).toContain(id);
    for (const id of [...plan.newNodes.chunks, ...plan.newNodes.patterns, ...plan.newNodes.grammar]) expect(plan.receptiveOnly).not.toContain(id);
    const a1 = compileSession({ learnerId: 'p', learner: L, path: initialPath(), course, content, now: T0 });
    expect(a1.receptiveOnly).toEqual([]);
  });
});

describe('Before you go (recap block)', () => {
  test('every non-minimum plan ends its core with a recap placeholder before close; minimum has none', () => {
    const { L, input } = tiny([]);
    for (const tier of ['standard', 'extended', 'minimum'] as const) {
      const plan = compileSession(input({ tier }));
      const kinds = plan.blocks.map((b) => b.kind);
      expect(kinds[kinds.length - 1]).toBe('close');
      if (tier === 'minimum') { expect(kinds).not.toContain('recap'); continue; }
      const recap = plan.blocks[plan.blocks.length - 2];
      expect(recap).toMatchObject({ kind: 'recap', part: 'core', deliberate: true, items: [] });
      expect((recap as { capacity: number }).capacity).toBeLessThanOrEqual(budget.COUNTS.recapCards);
      expect(plan.estimatedMinutes).toBeLessThanOrEqual(plan.budget.minutes + 1e-9);
    }
    void L;
  });
});
