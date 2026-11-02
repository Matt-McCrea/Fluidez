// R9: "Mine says the same thing". After the right version is shown on a card that asked for a whole sentence, a learner at A2 or above
// may say theirs means the same. The app cannot tell, so it takes the cheapest honest path: graded through the lenient path (Hard,
// never Good), a fresh sentence queued for the same target, the claim logged for the accept list. It is never a novel pass, a rung
// climb, a right first time or an entry in Weak spots.
import { describe, expect, it } from 'vitest';
import type { Item, PracticeItem } from '../../src/compiler';
import { rng } from '../../src/exercises/rng';
import { RESCUE_OP } from '../../src/games/credit';
import { Rescue } from '../../src/games/rescue';
import type { GraphNode } from '../../src/content/schema';
import { Rating, type ReviewEvent } from '../../src/learner';
import { compact, delayedAccuracy } from '../../src/learner/events';
import { recentMisses, weakSpots } from '../../src/learner/weak';
import { claimOffered, typedOutcome } from '../../src/ui/components/card';
import { gradeOf, missRetest, type Outcome, type Retest } from '../../src/ui/session/attempt';
import { practiceCard, reviewCard, type Card, type Check, type TypeCard } from '../../src/ui/session/cards';
import { Freeplay, claimBand } from '../../src/ui/session/freeplay';
import { SessionRunner, compilePlan } from '../../src/ui/session/runner';
import { session, world } from './driver';

const shown: Check = { pass: false, hint: 'Right words, different order: check where each one goes.', hintKind: 'word-order', answer: 'Mañana te llamo.' };
const base = { passed: false, tries: 2, ms: 9000, value: 'Te llamo mañana', first: 'Llamo te mañana', result: shown, firstCheck: shown };

describe('when it is offered', () => {
  const card = { claim: true as const };
  it('on a whole-sentence card, after something was typed, from A2 up', () => {
    expect(claimOffered({ card, allowed: true, typed: 'Te llamo mañana', result: shown })).toBe(true);
  });
  it('not at A1, not on a card for a word or a gap, not with nothing typed', () => {
    expect(claimOffered({ card, allowed: false, typed: 'Te llamo mañana', result: shown })).toBe(false);
    expect(claimOffered({ card: {}, allowed: true, typed: 'Te llamo mañana', result: shown })).toBe(false);
    expect(claimOffered({ card, allowed: true, typed: '  ', result: shown })).toBe(false);
    expect(claimOffered({ card, allowed: true, typed: 'Te llamo mañana', result: null })).toBe(false);
  });
  it('never when a named trap fired, and not for a fragment', () => {
    expect(claimOffered({ card, allowed: true, typed: 'Soy aburrido', result: { ...shown, hintKind: 'ser-estar', rule: 'ser-estar-locked' } })).toBe(false);
    expect(claimOffered({ card, allowed: true, typed: 'no sé', result: { ...shown, hintKind: 'fragment' } })).toBe(false);
  });
  it('the cards that ask for a sentence are marked, and the ones that ask for a gap or a word are not', async () => {
    const w = await world();
    const seen: Card[] = [];
    for (let d = 0; d < 8; d++) {
      const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
      for (const b of plan.blocks) {
        if (b.kind === 'controlledOutput' || b.kind === 'remix' || b.kind === 'cuedProduction') for (const it of b.items) seen.push(practiceCard(it, w.bundle, plan.seed));
        if (b.kind === 'warmup') for (const it of b.items) seen.push(reviewCard(it, w.bundle));
      }
      await session(w, 'right');
      w.clock.t += 86_400_000;
    }
    const typed = seen.filter((c): c is TypeCard => c.type === 'type');
    const claimable = typed.filter((c) => c.claim), others = typed.filter((c) => !c.claim);
    expect(claimable.length).toBeGreaterThan(0);
    expect(others.length).toBeGreaterThan(0);
    // a sentence is typed in Spanish; a gap's prompt is a sentence with ___ in it, and a word is no sentence
    for (const c of claimable) expect(c.answerLang).toBe('es');
    for (const c of others) expect(c.ask).not.toBe('Change the sentence');
  });
});

describe('what a claim reports', () => {
  it('is a lenient pass: Hard, with the claim, the right version and the text it was about', () => {
    const o = typedOutcome({ ...base, claimed: true });
    expect(o).toMatchObject({ correct: true, lenient: true, claimed: true, tries: 2, given: 'Te llamo mañana', shown: 'Mañana te llamo.', err: 'word-order' });
    expect(gradeOf(o)).toBe(Rating.Hard);
  });
  it('is never Good, whatever the number of tries', () => {
    for (const tries of [1, 2]) expect(gradeOf(typedOutcome({ ...base, tries, claimed: true }))).not.toBe(Rating.Good);
  });
  it('without the claim, the same card is a miss as before', () => {
    const o = typedOutcome(base);
    expect(o).toMatchObject({ correct: false, given: 'Llamo te mañana', shown: 'Mañana te llamo.' });
    expect(o.claimed).toBeUndefined();
    expect(gradeOf(o)).toBe(Rating.Again);
  });
});

describe('a fresh sentence is queued', () => {
  type Asked = Parameters<typeof missRetest>[0];
  const item = { op: 'type', node: 'g:future-promises', sentence: 'u20-0001', direction: 'productive' } as Asked;
  const claimed = typedOutcome({ ...base, claimed: true });
  it('for a practice item, like a miss', () => {
    expect(missRetest(item, claimed)).toEqual({ node: 'g:future-promises', direction: 'productive', sentence: 'u20-0001' });
  });
  it('for a warm-up review as well, which has no lapse to bring it back', () => {
    expect(missRetest({ ...item, op: 'review' } as Asked, claimed)).toMatchObject({ node: 'g:future-promises' });
    expect(missRetest({ ...item, op: 'review' } as Asked, { correct: false })).toBeUndefined();
  });
  it('not for a right answer, and not for a card that asked for nothing', () => {
    expect(missRetest(item, { correct: true })).toBeUndefined();
    expect(missRetest(item, { ...claimed, exposure: true })).toBeUndefined();
  });
});

describe('through the runner', () => {
  /** A practice item on a sentence for a node the learner has a card for, in the dealt direction, scored as a review. */
  async function warmItem() {
    const w = await world();
    for (let d = 0; d < 12; d++) {
      const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
      const found = plan.blocks.flatMap((b) => ('items' in b ? (b.items as Item[]) : [])).find((it): it is PracticeItem =>
        'sentence' in it && !!it.sentence && 'direction' in it && w.learner.hasCard(it.node, it.direction) && ['translate', 'type', 'transform', 'recombine'].includes(it.op));
      if (found) {
        const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
        run.start();
        return { w, run, item: { ...found, scoring: 'review', credit: [found.node] } as PracticeItem };
      }
      await session(w, 'right');
      w.clock.t += 86_400_000;
    }
    throw new Error('no item that asks for a sentence');
  }
  const claim = (item: PracticeItem, tries: 1 | 2 = 2): Outcome => ({
    correct: true, lenient: true, claimed: true, tries, ms: 9000, given: 'Te llamo mañana', shown: 'Mañana te llamo.', err: 'word-order', fmt: 'type:en>es',
  });

  it('is Hard, flagged on its events, logged in the attempts log, and queues the target', async () => {
    const { w, run, item } = await warmItem();
    run.score(item, claim(item));
    const events = w.learner.events().filter((e) => e.sentence === item.sentence && e.at === w.now());
    expect(events.length).toBeGreaterThan(0);
    for (const e of events) { expect(e.claimed, e.node).toBe(true); expect(e.grade, e.node).toBe(Rating.Hard); expect(e.novel, e.node).toBe(false); }
    const row = w.learner.attempts().find((r) => r.claimed && r.sentence === item.sentence);
    expect(row).toMatchObject({ claimed: true, verdict: 'unconfirmed', given: 'Te llamo mañana', answer: 'Mañana te llamo.', tries: 2, node: item.node });
    expect(run.retests.some((r) => r.node === item.node)).toBe(true);
    expect((w.ui.path.remediate ?? []).some((e) => e.node === item.node)).toBe(true);
  });

  it('counts for nothing the learner is credited with: no right answer, no first try, no novel pass, no rung', async () => {
    const { w, run, item } = await warmItem();
    const before = { novel: w.learner.node(item.node)?.novelPasses, rung: w.learner.node(item.node)?.rung, scored: run.tally.scored, correct: run.tally.correct, firstTry: run.tally.firstTry };
    run.score(item, claim(item, 1));
    const after = { novel: w.learner.node(item.node)?.novelPasses, rung: w.learner.node(item.node)?.rung, scored: run.tally.scored, correct: run.tally.correct, firstTry: run.tally.firstTry };
    expect(after.novel).toBe(before.novel);
    expect(after.rung).toBe(before.rung);
    expect(after.scored).toBe(before.scored + 1);
    expect(after.correct).toBe(before.correct);
    expect(after.firstTry).toBe(before.firstTry);
  });
});

describe('Weak spots leave a claim out', () => {
  const NOW = Date.UTC(2026, 10, 2);
  const DAY = 86_400_000;
  const node = { id: 'p:ir-a', kind: 'pattern', title: 'Going to' } as GraphNode;
  const look = (id: string) => (id === node.id ? node : undefined);
  const ev = (miss: boolean, claimed = false): ReviewEvent => ({
    at: NOW - DAY, node: node.id, dir: 'productive', grade: miss ? Rating.Again : Rating.Hard, op: 'type', tries: 2, novel: false, session: 1, scored: 'exposure', ...(claimed ? { claimed: true as const } : {}),
  });
  it('as a miss, though it was a second try, and as an attempt', () => {
    const claims = Array.from({ length: 6 }, () => ev(false, true));
    expect(weakSpots(claims, look, { now: NOW })).toEqual([]);
    expect(recentMisses(claims, look, { now: NOW })).toEqual([]);
    // the same events, not claims, are a weak spot: this is what the flag changes
    expect(weakSpots(claims.map((e) => ({ ...e, claimed: undefined })), look, { now: NOW })).toHaveLength(1);
  });
  it('and the misses beside it still count as attempts and as misses', () => {
    const mixed = [...Array.from({ length: 4 }, () => ev(true)), ...Array.from({ length: 6 }, () => ev(false, true))];
    expect(weakSpots(mixed, look, { now: NOW })[0]).toMatchObject({ misses: 4, attempts: 4 });
  });
  it('is no proof for the retention measure, and compaction keeps it', () => {
    const old = { ...ev(false, true), at: NOW - 200 * DAY, scored: 'review' as const };
    const plain = { ...ev(false), at: NOW - 100 * DAY, scored: 'review' as const };
    expect(delayedAccuracy([old, plain], { minAgeDays: 0 })).toBe(1);
    expect(delayedAccuracy([old], { minAgeDays: 0 })).toBeUndefined();
    expect(compact({ events: [old], summary: { upTo: 0, counts: {} } }, 90, NOW).events).toHaveLength(1);
  });
});

describe('in a quick review and in Rescate', () => {
  const DAY = 86_400_000;
  /** Four nodes the learner owns in both directions, all due: a productive one is a sentence to say. */
  async function due() {
    const w = await world();
    const at = w.clock.t - 30 * DAY;
    for (const n of ['g:ser-identity', 'c:me-llamo', 'c:soy-de', 'l:café']) {
      w.learner.seedKnown(n, { at, productive: true, receptive: { stability: 5, dueAt: at + 5 * DAY }, productiveCard: { stability: 5, dueAt: at + 5 * DAY } });
    }
    return w;
  }
  const deps = (w: Awaited<ReturnType<typeof due>>, retest?: (r: Retest) => void) => ({ learner: w.learner, bundle: w.bundle, now: w.now, rng: rng('claim'), ...(retest ? { retest } : {}) });
  const said = (tries: 1 | 2 = 2): Outcome => ({
    correct: true, lenient: true, claimed: true, tries, ms: 9000, given: 'Me llamo Ana', shown: 'Me llamo Tomás.', fmt: 'type:en>es',
  });

  it('a claim is Hard, flagged, never a novel pass, and the sentence comes back through the retest', async () => {
    const w = await due();
    const retests: Retest[] = [];
    const run = new Freeplay({ kind: 'quickReview' }, deps(w, (r) => retests.push(r)));
    const card = run.next()!;
    expect(card.type === 'type' && card.claim).toBe(true);
    const node = run.reviewing!.node;
    run.answer(said());
    const ev = w.learner.events().filter((e) => e.node === node && e.op === 'quick');
    expect(ev).toHaveLength(1);
    expect(ev[0]).toMatchObject({ grade: Rating.Hard, claimed: true, novel: false, scored: 'review' });
    expect(retests).toEqual([{ node, direction: 'productive', sentence: expect.any(String) }]);
    expect(w.learner.attempts().find((r) => r.node === node)).toMatchObject({ claimed: true, verdict: 'unconfirmed', given: 'Me llamo Ana' });
  });

  it('is not a right answer on the score: not right first time, not right on the second try', async () => {
    for (const tries of [1, 2] as const) {
      const w = await due();
      const run = new Freeplay({ kind: 'quickReview' }, deps(w));
      run.next();
      run.answer(said(tries));
      expect(run.answered).toBe(1);
      expect(run.right).toBe(0);
      expect(run.retried).toBe(0);
    }
  });

  it('a right answer and a miss queue nothing: a lapse brings a miss back, and a hit needs no retest', async () => {
    const w = await due();
    const retests: Retest[] = [];
    const run = new Freeplay({ kind: 'quickReview' }, deps(w, (r) => retests.push(r)));
    run.next();
    run.answer({ correct: true, tries: 1, ms: 5000 });
    run.next();
    run.answer({ correct: false, tries: 2, ms: 5000 });
    expect(retests).toEqual([]);
  });

  it('Rescate takes the same claim: a real review of a due card, Hard, flagged, and neither saved nor missed', async () => {
    const w = await due();
    const retests: Retest[] = [];
    const r = new Rescue({ ...deps(w, (x) => retests.push(x)), finished: 0 });
    const first = r.next()!;
    const node = w.learner.due(w.now())[0].node;
    expect(first.type === 'type' && first.claim).toBe(true);
    r.answer(said());
    const ev = w.learner.events().filter((e) => e.op === RESCUE_OP);
    expect(ev).toHaveLength(1);
    expect(ev[0]).toMatchObject({ node, grade: Rating.Hard, claimed: true, novel: false });
    expect(retests).toHaveLength(1);
    while (r.next()) r.answer({ correct: true, tries: 1, ms: 1 });
    const res = r.result();
    expect(res).toMatchObject({ saved: 3, of: 3, missed: 0, claimed: 1 });
  });

  it('a round of nothing but claims is not a round of nothing answered', async () => {
    const w = await due();
    const r = new Rescue({ ...deps(w), finished: 0 });
    while (r.next()) r.answer(said());
    expect(r.result()).toMatchObject({ saved: 0, of: 0, missed: 0, claimed: 4 });
  });
});

describe('who is offered it', () => {
  const course = { units: [{ band: 'A1' }, { band: 'A2' }, { band: 'B1' }] } as Parameters<typeof claimBand>[0];
  it('from A2 up, by where the learner is on the course', () => {
    expect(claimBand(course, { unit: 0 })).toBe(false);
    expect(claimBand(course, { unit: 1 })).toBe(true);
    expect(claimBand(course, { unit: 2 })).toBe(true);
  });
});
