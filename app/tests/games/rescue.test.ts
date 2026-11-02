// Rescate: due cards, no clock, real grades. It is the quick review with the cards that are not due taken out, so the
// properties a review has to keep (a miss lapses, a hit waits longer, one direction for each node, a card that only
// shows is not graded) are held here as they are for the warm-up; and what a game must not do (put a time on an answer,
// touch a card that is not due) is held beside them.
import { describe, expect, it } from 'vitest';
import { rng } from '../../src/exercises/rng';
import { Rating } from '../../src/learner';
import { RESCUE_OP } from '../../src/games/credit';
import { RESCUE_MAX, RESCUE_MIN, Rescue, rescueCount } from '../../src/games/rescue';
import { Freeplay } from '../../src/ui/session/freeplay';
import { answer, world } from '../ui/driver';

const DAY = 86_400_000;

async function seeded() {
  const w = await world();
  const { learner, clock } = w;
  for (const n of ['g:ser-identity', 'c:me-llamo', 'c:soy-de', 'l:café']) learner.introduce(n, { at: clock.t, results: [true, true, true], ms: [4000, 4000, 4000] });
  return w;
}
const dueAfter = async (days = 6) => { const w = await seeded(); w.clock.t += days * DAY; return w; };
const rescue = (w: Awaited<ReturnType<typeof seeded>>) => new Rescue({ learner: w.learner, bundle: w.bundle, now: w.now });

describe('what a rescue asks', () => {
  it('only cards that are due, where a quick review also asks the ones that are not', async () => {
    const w = await dueAfter();
    w.learner.introduce('l:agua', { at: w.clock.t, results: [true, true, true] });
    const dueNodes = new Set(w.learner.due(w.now()).map((c) => c.node));
    expect(dueNodes.has('l:agua')).toBe(false);
    const quick = new Freeplay({ kind: 'quickReview' }, { learner: w.learner, bundle: w.bundle, now: w.now, rng: rng('q') });
    const r = rescue(w);
    expect(quick.total).toBeGreaterThan(r.total);
    expect(r.total).toBe(dueNodes.size);
    const asked: string[] = [];
    let c;
    while ((c = r.next())) { asked.push(c.key.split(':').slice(2, -1).join(':')); r.answer(answer(c, 'right')); }
    expect(new Set(asked)).toEqual(dueNodes);
  });

  it('a few minutes and no more: at most the cap, most at risk first', async () => {
    const w = await dueAfter();
    const run = new Freeplay({ kind: 'quickReview' }, { learner: w.learner, bundle: w.bundle, now: w.now, rng: rng('q'), rescue: { max: 2 } });
    expect(run.total).toBe(2);
    const order = w.learner.due(w.now()).map((c) => c.node);
    const first = run.next()!;
    expect(first.key.split(':').slice(2, -1).join(':')).toBe(order[0]);
    expect(RESCUE_MAX).toBeLessThanOrEqual(12);
  });

  it('counts the nodes with something due, and a round is worth offering from three', async () => {
    const w = await seeded();
    expect(rescueCount(w.learner, w.now())).toBe(0);
    w.clock.t += 6 * DAY;
    expect(rescueCount(w.learner, w.now())).toBe(new Set(w.learner.due(w.now()).map((c) => c.node)).size);
    expect(rescueCount(w.learner, w.now())).toBeGreaterThanOrEqual(RESCUE_MIN);
  });

  it('a card that only shows is not a review: it is passed over and stays due', async () => {
    const w = await dueAfter();
    w.learner.introduce('l:sinpar', { at: w.clock.t - 7 * DAY, results: [true, true, true] });
    const stays = w.learner.due(w.now()).some((c) => c.node === 'l:sinpar');
    expect(stays).toBe(true);
    const r = rescue(w);
    const lined = r.total;
    let c, asked = 0;
    while ((c = r.next())) {
      expect(c.type).not.toBe('read');
      r.answer(answer(c, 'right'));
      asked++;
    }
    expect(lined).toBeGreaterThan(asked);
    expect(w.learner.due(w.now()).some((x) => x.node === 'l:sinpar')).toBe(true);
    expect(w.learner.events().some((e) => e.node === 'l:sinpar' && e.op === RESCUE_OP)).toBe(false);
  });
});

describe('the other side of a card', () => {
  // both sides of a node come due in a backlog; the first round answers one, and "Another round" is a tap away
  async function bothDue() {
    const w = await world();
    for (const n of ['g:ser-identity', 'c:me-llamo', 'c:soy-de', 'l:café']) {
      w.learner.seedKnown(n, { at: w.clock.t - 7 * DAY, productive: true, receptive: { stability: 6, dueAt: w.clock.t - DAY }, productiveCard: { stability: 6, dueAt: w.clock.t - DAY } });
    }
    return w;
  }
  const play = (w: Awaited<ReturnType<typeof bothDue>>) => {
    const r = rescue(w);
    let c, n = 0;
    while ((c = r.next())) { r.answer(answer(c, 'right')); n++; }
    return { r, n };
  };

  it('is not asked in the round after: it has just been on screen, so a Good on it would be stability earned by reading', async () => {
    const w = await bothDue();
    const before = w.learner.card('l:café', 'receptive')!;
    expect(play(w).n).toBe(4);
    expect(rescueCount(w.learner, w.now())).toBe(0);
    w.clock.t += 30_000;
    expect(play(w).n).toBe(0);
    expect(w.learner.card('l:café', 'receptive')).toEqual(before);
    expect(w.learner.events().filter((e) => e.op === RESCUE_OP).map((e) => e.dir)).toEqual(['productive', 'productive', 'productive', 'productive']);
  });

  it('says none is left, so a round ends on Done and not on another round of the same words', async () => {
    const w = await bothDue();
    expect(play(w).r.result().stillDue).toBe(0);
  });

  it('is there again the next day, when the answer has gone', async () => {
    const w = await bothDue();
    play(w);
    w.clock.t += DAY;
    expect(rescueCount(w.learner, w.now())).toBe(4);
    expect(play(w).n).toBe(4);
    expect(w.learner.card('l:café', 'receptive')!.stability).toBeGreaterThan(6);
  });

  it('a card unlocked by a hit is not due the moment it exists: the Spanish was on screen a second ago', async () => {
    const w = await world();
    w.learner.seedKnown('l:café', { at: w.clock.t - 7 * DAY, productive: true, receptive: { stability: 6, dueAt: w.clock.t - DAY }, productiveCard: null });
    w.learner.seedKnown('c:me-llamo', { at: w.clock.t - 7 * DAY, productive: true, receptive: { stability: 6, dueAt: w.clock.t - DAY }, productiveCard: null });
    w.learner.seedKnown('c:soy-de', { at: w.clock.t - 7 * DAY, productive: true, receptive: { stability: 6, dueAt: w.clock.t - DAY }, productiveCard: null });
    play(w);
    expect(w.learner.hasCard('l:café', 'productive')).toBe(true);
    expect(rescueCount(w.learner, w.now())).toBe(0);
  });

  it('a relapse in the same direction still comes round: that is the card asking again, not the other side', async () => {
    const w = await bothDue();
    const r = rescue(w);
    let c;
    while ((c = r.next())) r.answer(answer(c, 'wrong'));
    expect(w.learner.card('l:café', 'productive')!.lapses).toBeGreaterThan(0);
    w.clock.t += 3_600_000;
    const again = rescue(w);
    const first = again.next();
    expect(first!.key).toMatch(/:productive$/);
  });
});

describe('what a rescue does to the schedule', () => {
  it('a hit waits longer, a miss lapses, a retry is Hard: real reviews, each one event of op rescue', async () => {
    const w = await dueAfter();
    const r = rescue(w);
    const before = new Map(w.learner.due(w.now()).map((c) => [`${c.node}:${c.direction}`, w.learner.card(c.node, c.direction)!]));
    const moods = [{ correct: true, tries: 1 }, { correct: false, tries: 2 }, { correct: true, tries: 2 }, { correct: true, tries: 1 }];
    const shown: Array<{ node: string; dir: string }> = [];
    let c, i = 0;
    while ((c = r.next())) {
      shown.push({ node: r['current']!.node, dir: r['current']!.dir });
      r.answer({ ...moods[i++ % moods.length], ms: 800, fmt: 'x' });
    }
    const reviews = w.learner.events().filter((e) => e.op === RESCUE_OP);
    expect(reviews).toHaveLength(shown.length);
    expect(reviews.every((e) => e.scored === 'review' && e.ms === undefined)).toBe(true);
    expect(reviews.map((e) => e.grade)).toEqual(shown.map((_, k) => (moods[k % 4].correct ? (moods[k % 4].tries === 1 ? Rating.Good : Rating.Hard) : Rating.Again)));
    reviews.forEach((e, k) => {
      const was = before.get(`${e.node}:${e.dir}`)!;
      const now = w.learner.card(e.node, e.dir)!;
      if (e.grade === Rating.Again) expect(now.lapses).toBeGreaterThan(was.lapses);
      else expect(now.due).toBeGreaterThan(w.now());
      void k;
    });
  });

  it('puts no time on an answer: the timing and the seconds a review takes are as they were', async () => {
    const w = await dueAfter();
    const timing = JSON.stringify(w.learner.toJSON().timing);
    const spr = w.learner.secondsPerReview();
    const r = rescue(w);
    let c;
    while ((c = r.next())) r.answer({ ...answer(c, 'right'), ms: 123_456 });
    expect(r.answered).toBeGreaterThan(0);
    expect(JSON.stringify(w.learner.toJSON().timing)).toBe(timing);
    expect(w.learner.secondsPerReview()).toBe(spr);
  });

  it('leaves a card that is not due exactly as it was', async () => {
    const w = await dueAfter();
    w.learner.introduce('l:agua', { at: w.clock.t, results: [true, true, true] });
    const card = JSON.stringify(w.learner.card('l:agua', 'receptive'));
    const r = rescue(w);
    let c;
    while ((c = r.next())) r.answer(answer(c, 'wrong'));
    expect(JSON.stringify(w.learner.card('l:agua', 'receptive'))).toBe(card);
  });

  it('writes a row in the attempts log for each answer, as the warm-up does, and one event of rescue for each', async () => {
    const w = await dueAfter();
    const r = rescue(w);
    let c;
    while ((c = r.next())) r.answer(answer(c, 'right'));
    const rows = w.learner.attempts().filter((a) => a.op === RESCUE_OP);
    expect(rows).toHaveLength(r.answered);
    expect(rows.every((a) => a.verdict === 'right' && a.fmt !== undefined)).toBe(true);
    expect(w.learner.events().filter((e) => e.op === RESCUE_OP)).toHaveLength(r.answered);
  });
});

describe('what a rescue says it came to', () => {
  it('cards saved of cards asked, the ones that will be back, and when the saved ones are due again', async () => {
    const w = await dueAfter();
    const r = rescue(w);
    let c, k = 0;
    while ((c = r.next())) r.answer({ ...answer(c, k++ === 0 ? 'wrong' : 'right') });
    const res = r.result();
    expect(res.of).toBe(r.answered);
    expect(res.saved).toBe(res.of - 1);
    expect(res.missed).toBe(1);
    expect(res.within!.from).toBeGreaterThanOrEqual(1);
    expect(res.within!.to).toBeGreaterThanOrEqual(res.within!.from);
    expect(res.stillDue).toBe(rescueCount(w.learner, w.now()));
  });

  it('says nothing about days when nothing was saved', async () => {
    const w = await dueAfter();
    const r = rescue(w);
    let c;
    while ((c = r.next())) r.answer(answer(c, 'wrong'));
    expect(r.result().within).toBeUndefined();
    expect(r.result().saved).toBe(0);
  });
});
