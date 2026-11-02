// Rescate: a short round on the cards that are due, graded for real. It is a quick
// review (ui/session/freeplay.ts) with three things taken away: the cards that are
// not due, the clock, and any time on an answer. What is left is a few minutes of the
// retrieval the schedule asks for, with a beginning and an end.
//
// Every answer is a real review, in the card's own direction, hit or miss, through
// credit.ts. There is no score to beat: this is not a race, and a learner with
// nothing due has nothing to play.
import { rng } from '../exercises/rng';
import type { Learner } from '../learner';
import type { Bundle } from '../ui/data/bundle';
import type { Card } from '../ui/session/cards';
import { Freeplay, rescueCards } from '../ui/session/freeplay';
import type { Outcome, Retest } from '../ui/session/attempt';

const DAY_MS = 86_400_000;

/** Most cards in one rescue: a few minutes, not a backlog. */
export const RESCUE_MAX = 12;
/** Fewer due than this and there is no round to play: they wait for the next lesson's warm-up. */
export const RESCUE_MIN = 3;

/** How many cards could be rescued now: due and askable, one for each node. */
export function rescueCount(learner: Learner, at: number): number {
  return new Set(rescueCards(learner, at).map((c) => c.node)).size;
}

/** Content a rescue needs: the units up to the learner's current one, as a quick review loads them. */
export async function bringRescue(bundle: Bundle, unit: number): Promise<void> {
  await bundle.ensureUnits({ to: Math.min(unit, Math.max(0, bundle.course.units.length - 1)) });
}

export interface RescueDeps {
  learner: Learner; bundle: Bundle; now: () => number; finished?: number;
  /** where a card the learner said "mine says the same thing" to is queued to come back in a new sentence */
  retest?: (r: Retest) => void;
}

/** What a rescue came to. */
export interface RescueResult {
  /** cards remembered (on either try) and cards asked; a claim of "mine says the same thing" is neither, for the app could not tell */
  saved: number;
  of: number;
  /** cards the learner said theirs was the same on: reviewed as Hard, and back in a new sentence */
  claimed: number;
  /** the ones that were not, which come back sooner */
  missed: number;
  /** when the saved ones are set to come round again, in whole days from now: the nearest and the furthest */
  within?: { from: number; to: number };
  /** cards still due after this round */
  stillDue: number;
}

export class Rescue {
  private readonly run: Freeplay;
  /** the cards asked, to say when they come round again */
  private readonly asked: Array<{ node: string; dir: 'receptive' | 'productive'; correct: boolean; claimed: boolean }> = [];
  private current?: { node: string; dir: 'receptive' | 'productive' };

  constructor(private readonly d: RescueDeps) {
    this.run = new Freeplay({ kind: 'quickReview' }, {
      learner: d.learner, bundle: d.bundle, now: d.now, finished: d.finished, rng: rng(`rescue:${d.learner.sessionIndex}:${d.now()}`), rescue: { max: RESCUE_MAX }, retest: d.retest,
    });
  }

  /** Cards lined up, most at risk first. */
  get total(): number { return this.run.total ?? 0; }
  get answered(): number { return this.run.answered; }

  next(): Card | undefined {
    const c = this.run.next();
    this.current = this.run.reviewing ? { node: this.run.reviewing.node, dir: this.run.reviewing.direction } : undefined;
    return c;
  }

  answer(o: Outcome): void {
    this.run.answer(o);
    if (this.current && !o.exposure) this.asked.push({ ...this.current, correct: o.correct, claimed: !!o.claimed });
    this.current = undefined;
  }

  result(): RescueResult {
    const at = this.d.now();
    const proved = this.asked.filter((a) => !a.claimed);
    const saved = proved.filter((a) => a.correct);
    const days = saved.flatMap((a) => { const c = this.d.learner.card(a.node, a.dir); return c ? [Math.max(1, Math.round((c.due - at) / DAY_MS))] : []; });
    return {
      saved: saved.length, of: proved.length, missed: proved.length - saved.length, claimed: this.asked.length - proved.length,
      ...(days.length ? { within: { from: Math.min(...days), to: Math.max(...days) } } : {}),
      stillDue: rescueCount(this.d.learner, at),
    };
  }
}
