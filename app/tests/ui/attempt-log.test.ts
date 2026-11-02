// Every answered card is written to the attempts log once, whichever door it came in by, and the slip the
// checker named rides on the first event it wrote and no other. Grading is untouched: attempt-seam.test.ts
// holds that, and the last test here holds that the time to the first key never reaches a grade.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Block, LearnItem, PracticeItem, RecapItem, ReviewItem } from '../../src/compiler';
import { Rating } from '../../src/learner';
import { rng } from '../../src/exercises/rng';
import { gradeOf, type Outcome } from '../../src/ui/session/attempt';
import { Freeplay } from '../../src/ui/session/freeplay';
import { SessionRunner } from '../../src/ui/session/runner';
import { logComprehension } from '../../src/ui/blocks/read';
import { world } from './driver';

const DAY = 86_400_000;
// the build's own revision is not what these tests are about
beforeEach(() => { vi.stubEnv('VITE_CONTENT_REV', ''); });
afterEach(() => { vi.unstubAllEnvs(); });

async function setup() {
  const w = await world();
  const plan = { sessionIndex: 1, seed: 1, blocks: [] as Block[], receptiveOnly: [], newNodes: { grammar: [], patterns: [], chunks: [], lexemes: [], contrasts: [] } } as any;
  const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
  w.learner.introduce('g:ser-identity', { results: [true, true, true] });
  w.learner.introduce('c:soy-de', { results: [true, true, true] });
  w.clock.t += 6 * DAY;
  return { ...w, run };
}
const review = (over: Partial<ReviewItem> = {}): ReviewItem => ({
  op: 'review', id: 'rv:u01-1', node: 'g:ser-identity', direction: 'receptive', sentence: 'u01-1', novel: true,
  scoring: 'review', credit: ['g:ser-identity'], ...over,
});
const typedMiss: Outcome = {
  correct: false, tries: 2, ms: 9000, fmt: 'type:en>es', given: 'yo es de Cali', shown: 'yo soy de Cali', firstKeyMs: 2400, err: 'ser-estar', rule: 'ser-soy',
  evidence: { input: 'yo estoy de Cali', answer: 'yo soy de Cali' },
};

describe('the session runner logs each answer once', () => {
  it('a scored review: one row with what the card reported, and the slip on the first event', async () => {
    const { learner, run } = await setup();
    run.score(review(), typedMiss);
    const rows = learner.attempts();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      at: expect.any(Number), node: 'g:ser-identity', op: 'warmup', fmt: 'type:en>es', sentence: 'u01-1', given: 'yo es de Cali', answer: 'yo soy de Cali',
      err: 'ser-estar', rule: 'ser-soy', verdict: 'wrong', tries: 2, firstKeyMs: 2400,
    });
    expect(learner.events().at(-1)).toMatchObject({ node: 'g:ser-identity', op: 'warmup', err: 'ser-estar', rule: 'ser-soy' });
    expect(learner.toJSON().fingerprint).toEqual({ 'ser-estar': { n: 1, miss: 1, last: rows[0].at } });
  });

  it('several targets in one sentence are one answer: one row, and only the first target\'s event names the slip', async () => {
    const { learner, run } = await setup();
    run.score(review({ targets: ['g:ser-identity', 'c:soy-de'], credit: ['g:ser-identity', 'c:soy-de'] }), typedMiss);
    expect(learner.attempts()).toHaveLength(1);
    const reviews = learner.events().filter((e) => e.scored === 'review');
    expect(reviews).toHaveLength(2);
    expect(reviews.map((e) => e.err)).toEqual(['ser-estar', undefined]);
  });

  it('the text of the answer is on the row and nowhere on an event', async () => {
    const { learner, run } = await setup();
    run.score(review(), typedMiss);
    expect(JSON.stringify(learner.events())).not.toMatch(/yo es de Cali|yo soy de Cali/);
  });

  it('a pass on the retry keeps the first try and the slip, and shows no right version', async () => {
    const { learner, run } = await setup();
    run.score(review(), { correct: true, tries: 2, ms: 7000, fmt: 'type:en>es', given: 'yo es de Cali', err: 'ser-estar' });
    expect(learner.attempts()[0]).toMatchObject({ given: 'yo es de Cali', err: 'ser-estar', verdict: 'right', tries: 2 });
    expect(learner.attempts()[0].answer).toBeUndefined();
    expect(learner.toJSON().fingerprint).toEqual({ 'ser-estar': { n: 1, miss: 0, last: learner.attempts()[0].at } });
  });

  it('a wrong pick on options that differ in one feature names that feature, in the checker\'s words', async () => {
    const { learner, run } = await setup();
    run.score(review(), { correct: false, tries: 1, ms: 3000, fmt: 'mcq:es>en', given: 'I spoke', shown: 'I speak', evidence: { picked: 1, feature: 'copula' } });
    run.score(review({ id: 'rv:2' }), { correct: false, tries: 1, ms: 3000, fmt: 'mcq:es>en', given: '', shown: 'I speak', evidence: { picked: 'unsure', feature: 'copula' } });
    expect(learner.attempts().map((r) => r.err)).toEqual(['ser-estar', undefined]);
  });

  it('a card that asked for no answer is not an answer: no row', async () => {
    const { learner, run } = await setup();
    run.score(review(), { correct: true, tries: 1, ms: 900, exposure: true, fmt: 'read' });
    expect(learner.attempts()).toEqual([]);
  });

  it('a lesson step is one row, whether the teach screen calls it or the item scoring does', async () => {
    const { learner, run } = await setup();
    run.learningStep('l:pan', { correct: true, tries: 1, ms: 2000, fmt: 'mcq:es>en', given: 'bread' }, ['l:pan'], true, 'learn');
    expect(learner.attempts().map((r) => [r.node, r.op, r.given])).toEqual([['l:pan', 'learn', 'bread']]);
    const item: LearnItem = { op: 'learn', id: 'ln:l:agua', scoring: 'learning', credit: ['l:agua'], node: 'l:agua', nodeKind: 'lexeme', retrievals: 3 };
    run.score(item, { correct: false, tries: 1, ms: 2000, fmt: 'mcq:es>en', given: 'wine', shown: 'water' });
    expect(learner.attempts().map((r) => r.node)).toEqual(['l:pan', 'l:agua']);
  });

  it('"Before you go" answers are rows too', async () => {
    const { learner, run } = await setup();
    const item: RecapItem = { id: 'recap:g:ser-identity:receptive', kind: 'lapsed', node: 'g:ser-identity', direction: 'receptive', sentence: 'u01-1', credit: ['g:ser-identity'] } as RecapItem;
    run.scoreRecap(item, { correct: true, tries: 1, ms: 2000, fmt: 'type:es>en', given: 'I am from Cali' });
    expect(learner.attempts()[0]).toMatchObject({ node: 'g:ser-identity', op: 'recap', sentence: 'u01-1', given: 'I am from Cali', verdict: 'right' });
  });

  it('a practice item that only counts as exposure is still an answer', async () => {
    const { learner, run } = await setup();
    const item: PracticeItem = { op: 'choose', id: 'x1', scoring: 'exposure', credit: ['g:ser-identity'], node: 'g:ser-identity', sentence: 'u01-1', direction: 'productive' };
    run.score(item, { correct: true, tries: 1, ms: 2000, fmt: 'mcq:es>es', given: 'soy' });
    expect(learner.attempts()[0]).toMatchObject({ op: 'choose', fmt: 'mcq:es>es', given: 'soy', verdict: 'right' });
  });

  it('a comprehension question logs its answer, keyed on the first word of the chapter it used, and says which question', async () => {
    const { learner, run } = await setup();
    const q = { q: 'Where is the café?', options: ['The café', 'The park'], answer: 0 };
    const chapter = { id: 'ch-x', lexemes: ['l:café'], questions: [q], rereadQuestions: [] } as any;
    expect(run.bundle.node('l:café')?.es, 'the fixture holds this word').toBeTruthy();
    const ids = logComprehension(run, chapter, q, { correct: false, tries: 1, ms: 4000, fmt: 'mcq:en>en', given: 'The park', shown: 'The café' });
    expect(ids).toEqual(['l:café']);
    expect(learner.attempts()).toEqual([expect.objectContaining({ node: 'l:café', op: 'comprehend', sentence: 'ch-x:q0', given: 'The park', answer: 'The café', verdict: 'wrong' })]);
  });

  // 413 of the course's 977 first-read questions and 384 of its 655 reread questions use none of the chapter's words
  it('a question that uses none of the chapter\'s words is still an answer: its row goes under the chapter', async () => {
    const { learner, run } = await setup();
    const first = { q: 'Who spoke?', options: ['Vale', 'Tomás'], answer: 1 }, again = { q: 'Who left?', options: ['Vale', 'Rosa'], answer: 1 };
    const chapter = { id: 'ch-x', lexemes: ['l:café'], questions: [first], rereadQuestions: [again] } as any;
    expect(logComprehension(run, chapter, first, { correct: true, tries: 1, ms: 900, given: 'Tomás' })).toEqual([]);
    logComprehension(run, chapter, again, { correct: false, tries: 1, ms: 900, given: 'Vale', shown: 'Rosa' });
    expect(learner.attempts().map((r) => [r.node, r.sentence, r.given, r.verdict])).toEqual([['ch-x', 'ch-x:q0', 'Tomás', 'right'], ['ch-x', 'ch-x:r0', 'Vale', 'wrong']]);
  });
});

describe('free practice logs each answer once', () => {
  async function seeded() {
    const w = await world();
    for (const n of ['g:ser-identity', 'c:me-llamo', 'c:soy-de', 'l:café']) w.learner.introduce(n, { at: w.clock.t, results: [true, true, true] });
    return w;
  }
  const deps = (w: Awaited<ReturnType<typeof world>>) => ({ learner: w.learner, bundle: w.bundle, now: w.now, rng: rng('x') });

  it('quick review, with the op the event carries', async () => {
    const w = await seeded();
    w.clock.t += 6 * DAY;
    const fp = new Freeplay({ kind: 'quickReview' }, deps(w));
    fp.next();
    fp.answer({ correct: false, tries: 2, ms: 5000, fmt: 'type:en>es', given: 'la casa', shown: 'el café', err: 'article' });
    expect(w.learner.attempts()).toHaveLength(1);
    expect(w.learner.attempts()[0]).toMatchObject({ op: 'quick', given: 'la casa', answer: 'el café', err: 'article', verdict: 'wrong' });
    expect(w.learner.events().filter((e) => e.op === 'quick')[0].err).toBe('article');
  });

  it('translation and verb grinds, and a card shown but not answered is nothing', async () => {
    const w = await seeded();
    w.learner.introduce('l:ser', { at: w.clock.t, results: [true, true, true] });
    const tr = new Freeplay({ kind: 'translate' }, deps(w));
    tr.next();
    tr.answer({ correct: true, tries: 1, ms: 4000, fmt: 'type:en>es', given: 'me llamo Ana', err: undefined });
    const cj = new Freeplay({ kind: 'conjugate', verbs: ['ser'], tenses: ['presente'] }, deps(w));
    cj.next();
    cj.answer({ correct: true, tries: 1, ms: 2000, fmt: 'type:en>es', given: 'soy' });
    cj.next();
    cj.answer({ correct: true, tries: 1, ms: 500, exposure: true });
    expect(w.learner.attempts().map((r) => [r.op, r.node, r.given])).toEqual([['grind', expect.any(String), 'me llamo Ana'], ['grind', 'l:ser', 'soy']]);
  });

  it('a verb drill that credits nothing, the tense untaught and the verb unmet, is still an answer', async () => {
    const w = await world();
    const cj = new Freeplay({ kind: 'conjugate', verbs: ['comer'], tenses: ['presente'] }, deps(w));
    cj.next();
    cj.answer({ correct: false, tries: 2, ms: 2000, fmt: 'type:en>es', given: 'como', shown: 'comes' });
    expect(w.learner.attempts().map((r) => [r.op, r.node, r.given, r.answer])).toEqual([['grind', 'l:comer', 'como', 'comes']]);
    expect(w.learner.events(), 'nothing to credit, nothing written').toEqual([]);
  });
});

describe('the build the answer came from', () => {
  it('rides on the row when the build knows it', async () => {
    vi.stubEnv('VITE_CONTENT_REV', 'c470746');
    const { learner, run } = await setup();
    run.score(review(), typedMiss);
    expect(learner.attempts()[0].contentRev).toBe('c470746');
  });

  it('is left off when it does not', async () => {
    vi.stubEnv('VITE_CONTENT_REV', '');
    const { learner, run } = await setup();
    run.score(review(), typedMiss);
    expect(Object.keys(learner.attempts()[0])).not.toContain('contentRev');
  });
});

describe('latency is logged and never graded (R17)', () => {
  it('the same answer, however long it took to start, is the same grade', () => {
    for (const o of [{ correct: true, tries: 1 }, { correct: true, tries: 2 }, { correct: false, tries: 2 }]) {
      const grades = [0, 400, 2400, 90_000].map((firstKeyMs) => gradeOf({ ...o, firstKeyMs, ms: firstKeyMs * 3 } as Outcome));
      expect(new Set(grades).size).toBe(1);
    }
    expect(gradeOf({ correct: true, tries: 1, firstKeyMs: 99_999 } as Outcome)).toBe(Rating.Good);
  });

  it('a slow first key leaves the learner\'s memory exactly where a fast one does', async () => {
    const run = async (firstKeyMs: number) => {
      const { learner, run } = await setup();
      run.score(review(), { ...typedMiss, firstKeyMs, err: undefined, rule: undefined });
      return JSON.stringify([learner.node('g:ser-identity'), learner.events().map((e) => [e.grade, e.tries, e.ms])]);
    };
    expect(await run(200)).toBe(await run(40_000));
  });
});
