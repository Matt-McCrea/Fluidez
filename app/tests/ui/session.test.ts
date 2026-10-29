// The session player's contract with the compiler and the learner model,
// on the fixture content: scoring per item.scoring, the ledger, the path.
import { describe, expect, it, vi } from 'vitest';
import { LEDGER_KINDS, Learner, Rating } from '../../src/learner';
import type { Block, Item, LearnItem, PracticeItem, ReviewItem } from '../../src/compiler';
import { blockHeading, sessionLabel } from '../../src/ui/session/labels';
import { SessionRunner, gradeOf } from '../../src/ui/session/runner';
import { PATH_KEY, UiStore } from '../../src/ui/store/ui';
import { session, world } from './driver';

const DAY = 86_400_000;

describe('gradeOf', () => {
  it('first try Good, second try Hard, revealed Again', () => {
    expect(gradeOf({ correct: true, tries: 1 })).toBe(Rating.Good);
    expect(gradeOf({ correct: true, tries: 2 })).toBe(Rating.Hard);
    expect(gradeOf({ correct: false, tries: 2 })).toBe(Rating.Again);
    expect(gradeOf({ correct: false, tries: 1 })).toBe(Rating.Again);
  });
});

describe('scoring wiring (item.scoring)', () => {
  async function setup() {
    const w = await world();
    const plan = { sessionIndex: 1, seed: 1, blocks: [] as Block[], newNodes: { grammar: [], patterns: [], chunks: [], lexemes: [], contrasts: [] } } as any;
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    // a node with a receptive card
    w.learner.introduce('g:ser-identity', { results: [true, true, true] });
    return { ...w, run };
  }
  const review = (over: Partial<ReviewItem> = {}): ReviewItem => ({
    op: 'review', id: 'rv:u01-1', node: 'g:ser-identity', direction: 'receptive', sentence: 'u01-1', novel: true,
    scoring: 'review', credit: ['g:ser-identity'], ...over,
  });

  it("'review' with a sentence → creditSentence(credit, direction, grade, { targets, novel, ms })", async () => {
    const { learner, run } = await setup();
    const spy = vi.spyOn(learner, 'creditSentence');
    run.score(review(), { correct: true, tries: 1, ms: 3200 });
    expect(spy).toHaveBeenCalledWith(['g:ser-identity'], 'receptive', Rating.Good, expect.objectContaining({ targets: ['g:ser-identity'], novel: true, ms: 3200 }));
    expect(learner.card('g:ser-identity', 'receptive')!.reps).toBeGreaterThan(1);
  });

  it("'review' with several targets → each target gets its own full review, same grade", async () => {
    const { learner, run } = await setup();
    learner.introduce('c:soy-de', { results: [true, true, true] });
    const spy = vi.spyOn(learner, 'creditSentence');
    const before = { g: learner.card('g:ser-identity', 'receptive')!.reps, c: learner.card('c:soy-de', 'receptive')!.reps };
    run.score(review({ targets: ['g:ser-identity', 'c:soy-de'], credit: ['g:ser-identity', 'c:soy-de'] }), { correct: true, tries: 2, ms: 5000 });
    expect(spy).toHaveBeenCalledWith(['g:ser-identity', 'c:soy-de'], 'receptive', Rating.Hard, expect.objectContaining({
      targets: ['g:ser-identity', 'c:soy-de'], grades: { 'g:ser-identity': Rating.Hard, 'c:soy-de': Rating.Hard },
    }));
    expect(learner.card('g:ser-identity', 'receptive')!.reps).toBe(before.g + 1);
    expect(learner.card('c:soy-de', 'receptive')!.reps).toBe(before.c + 1);
  });

  it('bare multi-target review reviews each target; a target without a card is skipped', async () => {
    const { learner, run } = await setup();
    learner.introduce('c:soy-de', { results: [true, true, true] });
    const spy = vi.spyOn(learner, 'review');
    run.score(review({ sentence: undefined, targets: ['g:ser-identity', 'c:soy-de', 'c:me-llamo'] }), { correct: true, tries: 1, ms: 2000 });
    expect(spy.mock.calls.map((c) => c[0])).toEqual(['g:ser-identity', 'c:soy-de']);
  });

  it('receptive-only nodes are introduced without a production track', async () => {
    const w = await world();
    const plan = { sessionIndex: 1, seed: 1, blocks: [], receptiveOnly: ['l:pan'], newNodes: { grammar: [], patterns: [], chunks: [], lexemes: ['l:pan', 'l:agua'], contrasts: [] } } as any;
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    const spy = vi.spyOn(w.learner, 'introduce');
    run.present('l:pan');
    run.present('l:agua');
    run.present('l:tinto', false); // a learn item's own flag wins
    expect(spy.mock.calls.map((c) => [c[0], c[1]?.productive])).toEqual([['l:pan', false], ['l:agua', true], ['l:tinto', false]]);
  });

  it('served refs keep their review flag and reason in the ledger', async () => {
    const w = await world();
    const item = review({ reused: true });
    const plan = { sessionIndex: 1, seed: 1, blocks: [{ kind: 'warmup', part: 'warmup', deliberate: false, minutes: 1, items: [item], due: 1, carried: 0, budgetMinutes: 4, extended: false }], receptiveOnly: [], newNodes: { grammar: [], patterns: [], chunks: [], lexemes: [], contrasts: [] } } as any;
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    const spy = vi.spyOn(w.learner.ledger, 'markSeen');
    run.blockShown(plan.blocks[0]);
    expect(spy).toHaveBeenCalledWith('sentence', 'u01-1', expect.objectContaining({ deliberate: true, review: true, reason: expect.any(String) }));
  });

  it("'review' bare (no sentence) → learner.review with ms", async () => {
    const { learner, run } = await setup();
    const spy = vi.spyOn(learner, 'review');
    run.score(review({ sentence: undefined, novel: false }), { correct: false, tries: 2, ms: 9000 });
    expect(spy).toHaveBeenCalledWith('g:ser-identity', 'receptive', Rating.Again, expect.objectContaining({ ms: 9000 }));
  });

  it("'review' without a card in that direction → exposure, never a review", async () => {
    const { learner, run } = await setup();
    const rv = vi.spyOn(learner, 'review');
    const ex = vi.spyOn(learner, 'expose');
    run.score(review({ direction: 'productive' }), { correct: true, tries: 1, ms: 1000 });
    expect(rv).not.toHaveBeenCalled();
    expect(ex).toHaveBeenCalled();
  });

  it("'learning' → introduce, learningStep, completeIntroduction once done", async () => {
    const { learner, run } = await setup();
    const item: LearnItem = { op: 'learn', id: 'ln:c:me-llamo', node: 'c:me-llamo', nodeKind: 'chunk', retrievals: 4, scoring: 'learning', credit: ['c:me-llamo'] };
    const step = vi.spyOn(learner, 'learningStep');
    const done = vi.spyOn(learner, 'completeIntroduction');
    for (let i = 0; i < 3; i++) run.score(item, { correct: true, tries: 1, ms: 2000 });
    expect(step).toHaveBeenCalledTimes(3);
    expect(done).toHaveBeenCalledTimes(1);
    expect(learner.isLearning('c:me-llamo')).toBe(false);
    expect(learner.hasCard('c:me-llamo', 'receptive')).toBe(true);
    // a further learning item on the finished node is exposure, not an error
    expect(() => run.score(item, { correct: true, tries: 1, ms: 2000 })).not.toThrow();
  });

  it("'exposure' → expose(credit); 'none' → nothing", async () => {
    const { learner, run } = await setup();
    const ex = vi.spyOn(learner, 'expose');
    const p: PracticeItem = { op: 'pick', id: 'pick:u01-2', node: 'g:ser-identity', sentence: 'u01-2', direction: 'receptive', scoring: 'exposure', credit: ['g:ser-identity'] };
    run.score(p, { correct: true, tries: 1, ms: 1 });
    expect(ex).toHaveBeenCalledWith(['g:ser-identity'], expect.anything());
    ex.mockClear();
    const rv = vi.spyOn(learner, 'review');
    run.score({ ...p, scoring: 'none' } as Item, { correct: true, tries: 1, ms: 1 });
    expect(ex).not.toHaveBeenCalled();
    expect(rv).not.toHaveBeenCalled();
  });
});

describe('session flow on the fixture unit', () => {
  it('walks every lesson type, persists the path, never repeats content', async () => {
    const w = await world();
    const types: string[] = [];
    for (let day = 0; day < 7; day++) {
      const { plan, walk, pathBefore } = await session(w, 'right');
      types.push(plan.type);
      expect(walk.failures).toEqual([]);
      // the frame: warm-up first, close last
      expect(plan.blocks[0].kind).toBe('warmup');
      expect(plan.blocks[plan.blocks.length - 1].kind).toBe('close');
      // path advanced exactly as the compiler said, and was persisted under the adapter key
      expect(w.ui.path).toEqual(plan.pathAfter);
      expect(await w.kv.get(PATH_KEY)).toEqual(plan.pathAfter);
      if (plan.advancesPath) expect(w.ui.path).not.toEqual(pathBefore);
      // every new node is handed to the scheduler
      for (const n of Object.values(plan.newNodes).flat()) {
        expect(w.learner.isIntroduced(n)).toBe(true);
        expect(w.learner.isLearning(n)).toBe(false);
      }
      w.clock.t += DAY;
    }
    expect(types).toEqual(['introduce', 'drill', 'input', 'patterns', 'output', 'review', 'checkpoint']);
    for (const k of LEDGER_KINDS) expect(w.learner.ledger.unintendedRepeats(k)).toBe(0);
    expect(w.ui.state.stats.sessions).toBe(7);
    expect(w.ui.state.stats.days.length).toBe(7);

    // reload from the stores: same learner, same path
    await w.learner.flush();
    const again = await Learner.open(w.store, { now: w.now });
    const ui2 = await new UiStore(w.kv).load();
    expect(ui2.path).toEqual(w.ui.path);
    expect(again.nodes().sort()).toEqual(w.learner.nodes().sort());
    expect(again.sessionIndex).toBe(7);
  });

  it('wrong answers still complete a session, every correction has a reason, reviews get Again', async () => {
    const w = await world();
    await session(w, 'wrong');
    w.clock.t += DAY;
    const { plan, walk } = await session(w, 'wrong');
    expect(walk.failures).toEqual([]);
    for (const c of walk.cards) if (c.type !== 'read') expect(c.why.length).toBeGreaterThan(3);
    expect(plan.type).toBe('drill');
    const lapsed = w.learner.nodes().some((n) => (w.learner.card(n, 'receptive')?.lapses ?? 0) > 0 || (w.learner.card(n, 'receptive')?.stability ?? 99) < 1);
    expect(lapsed).toBe(true);
  });

  it('minimum and extended tiers render: timed recall, re-read, extra reading', async () => {
    const w = await world();
    for (let d = 0; d < 3; d++) { await session(w, 'right'); w.clock.t += DAY; }
    const min = await session(w, 'right', 'next', 'minimum');
    expect(min.plan.type).toBe('minimum');
    expect(min.plan.blocks.map((b) => b.kind)).toContain('timedRecall');
    expect(min.plan.blocks.map((b) => b.kind)).toContain('reread');
    expect([w.ui.path.unit, w.ui.path.day, w.ui.path.coreSessions]).toEqual([min.pathBefore.unit, min.pathBefore.day, min.pathBefore.coreSessions]); // a minimum session never advances
    w.clock.t += DAY;
    const ext = await session(w, 'right', 'next', 'extended');
    expect(ext.walk.failures).toEqual([]);
    expect(ext.plan.blocks.map((b) => b.kind)).toContain('extraReading');
  });

  it('leaving early keeps what was shown in the ledger and the path where it was', async () => {
    const w = await world();
    const { compilePlan } = await import('../../src/ui/session/runner');
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    run.start();
    const learn = plan.blocks.find((b) => b.kind === 'learn')!;
    run.blockShown(learn);
    run.blockShown(learn); // shown twice (re-render): recorded once
    await run.abandon();
    expect(w.ui.path).toEqual((await import('../../src/compiler')).initialPath());
    expect(w.learner.ledger.count('item')).toBeGreaterThan(0);
    expect(w.learner.ledger.unintendedRepeats('item')).toBe(0);
  });

  it('no internal block names on screen', async () => {
    const w = await world();
    const internal = /\b(warmup|learn block|teach|ruleRecall|structuredInput|controlledOutput|cuedProduction|communicative|remix block|readingCheck|extraReading|leech|reread|sceneRerun|selfCheck|timedRecall|SRS|drill|introduce)\b/i;
    for (let d = 0; d < 7; d++) {
      const { plan } = await session(w, 'right');
      expect(sessionLabel(plan, w.bundle)).not.toMatch(internal);
      for (const b of plan.blocks) {
        const h = blockHeading(b, w.bundle);
        expect(`${h.title} ${h.lead}`).not.toMatch(internal);
      }
      w.clock.t += DAY;
    }
  });
});

describe('I don\'t know on multiple choice', () => {
  const card = { type: 'mcq' as const, key: 'k', ask: 'Pick one', why: 'Because.', answer: 1, options: [{ text: 'a', lang: 'en' as const }, { text: 'b', lang: 'en' as const }] };
  it('reports a miss with one try and gently names the answer', async () => {
    const { mcqResult } = await import('../../src/ui/components/card');
    const r = mcqResult(card, 'unsure', 1234);
    expect(r.outcome).toMatchObject({ correct: false, tries: 1, ms: 1234, evidence: { picked: 'unsure' } });
    expect(r.right).toBe(false);
    expect(r.lead).toBe('No problem.');
    expect(mcqResult(card, 0, 5).lead).toBe('Not quite.');
    expect(mcqResult(card, 1, 5).outcome.correct).toBe(true);
  });
});

describe('progress by card', () => {
  it('moves up card by card and ends full with a skipped recap', async () => {
    const w = await world();
    const mk = (n: number): ReviewItem[] => Array.from({ length: n }, (_, i) => ({
      op: 'review', id: `rv:${i}`, node: 'g:ser-identity', direction: 'receptive', sentence: 'u01-1', novel: true,
      scoring: 'none', credit: [],
    }) as ReviewItem);
    const warm = { kind: 'warmup', part: 'core', deliberate: false, items: mk(3), minutes: 1 } as any;
    const lesson = { kind: 'leech', part: 'core', deliberate: false, items: mk(2), minutes: 1 } as any;
    const recap = { kind: 'recap', part: 'core', deliberate: false, items: [], capacity: 3, minutes: 1 } as any;
    const close = { kind: 'close', part: 'core', deliberate: false, minutes: 0 } as any;
    const plan = { sessionIndex: 1, seed: 1, blocks: [warm, lesson, recap, close], pathAfter: w.ui.path, newNodes: { grammar: [], patterns: [], chunks: [], lexemes: [], contrasts: [] } } as any;
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
    const frac = () => { const p = run.progress(); return (p.blocksDone + p.cardsDoneInBlock / Math.max(1, p.cardsInBlock)) / p.blocks; };
    const seen: number[] = [frac()];
    let pings = 0;
    run.onProgress(() => { pings++; });
    run.start();
    run.enter(warm);
    for (const it of warm.items) { run.score(it, { correct: true, tries: 1, ms: 1000 }); seen.push(frac()); }
    run.enter(lesson);
    seen.push(frac());
    for (const it of lesson.items) { run.score(it, { correct: true, tries: 1, ms: 1000 }); seen.push(frac()); }
    run.blockShown(recap);
    expect(run.openRecap(recap)).toBe(false);
    seen.push(frac());
    for (let i = 1; i < seen.length; i++) expect(seen[i]).toBeGreaterThanOrEqual(seen[i - 1]);
    expect(new Set(seen).size).toBeGreaterThan(5);
    expect(pings).toBe(5);
    await run.finish();
    expect(frac()).toBe(1);
    expect(run.progress().blocks).toBe(3);
  });
});

describe('the daily size is a standing preference', () => {
  it('extended reaches the compiled plan: the extended budget and extra reading', async () => {
    const w = await world();
    const { compilePlan } = await import('../../src/ui/session/runner');
    for (let d = 0; d < 3; d++) { await session(w, 'right'); w.clock.t += DAY; }
    const std = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    w.learner.setSettings({ tier: 'extended' });
    const ext = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    expect(ext.tier).toBe('extended');
    expect(ext.budget.minutes).toBeGreaterThan(std.budget.minutes);
  });

  it('minimum gives a 10-minute plan that does not advance the path; the full lesson is a one-off', async () => {
    const w = await world();
    const { compilePlan, requestFullLesson } = await import('../../src/ui/session/runner');
    for (let d = 0; d < 3; d++) { await session(w, 'right'); w.clock.t += DAY; }
    w.learner.setSettings({ tier: 'minimum' });
    const min = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    expect(min.type).toBe('minimum');
    expect(min.budget.minutes).toBe(10);
    const before = structuredClone(w.ui.path);
    await session(w, 'right');
    expect([w.ui.path.unit, w.ui.path.day, w.ui.path.coreSessions]).toEqual([before.unit, before.day, before.coreSessions]);
    requestFullLesson();
    const full = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
    expect(full.tier).toBe('standard');
    expect(w.learner.settings.tier).toBe('minimum'); // not a settings change
  });

  it('Settings carries no minutes field', async () => {
    const w = await world();
    expect('minutes' in w.learner.settings).toBe(false);
  });
});

describe('Home copy and the goal line', () => {
  it('the minimum tier line and the full-lesson offer are on Home; settings name the three sizes', async () => {
    const { readFileSync } = await import('node:fs');
    const home = readFileSync(new URL('../../src/ui/screens/home.tsx', import.meta.url), 'utf8');
    expect(home).toContain('A short one today');
    expect(home).toContain('Do the full lesson instead');
    const set = readFileSync(new URL('../../src/ui/screens/settings.tsx', import.meta.url), 'utf8');
    for (const t of ['Just the essentials', 'The regular lesson', 'plus extra reading']) expect(set).toContain(t);
  });

  it('the goal shows only when the unit fits it', async () => {
    const { goalLine } = await import('../../src/ui/session/goal');
    const u = { title: 'Food and ordering', canDo: 'I can order food and drink.' };
    expect(goalLine('travel', u)).toBe('Handy for your trip.');
    expect(goalLine('work', u)).toBeUndefined();
    expect(goalLine('me', u)).toBeUndefined();
    expect(goalLine(undefined, u)).toBeUndefined();
  });
});
