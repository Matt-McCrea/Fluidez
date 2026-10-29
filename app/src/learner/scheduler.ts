// FSRS-5 via ts-fsrs, plus the conversions between ts-fsrs Cards and the
// plain-JSON CardJSON the learner state stores.
//
// ts-fsrs 5.x defaults to FSRS-6 weights; we pin the published FSRS-5 defaults
// (19 weights, decay 0.5) until the learner has enough reviews to fit their own.
// With retention 0.9 and consecutive Good answers this gives intervals of about
// 3 → 11 → 35 → 101 days. (Retention 0.92 gives 3 → 8 → 22 → 56.)
//
// In-lesson learning steps are run by Learner, not by FSRS (learning_steps: []),
// so the day-0 retrievals never inflate stability through FSRS's short-term
// formula. A lapse goes to relearning with one 10-minute step, then ~1 day.
import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type FSRS, type Grade } from 'ts-fsrs';
import type { CardJSON, Settings } from './state';

export { Rating, State };
export type { Grade };

export const FSRS5_WEIGHTS: readonly number[] = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
  1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
  // ts-fsrs 5 takes 21 weights; FSRS-5 is w19 = 0 (no extra short-term term), decay 0.5.
  0, 0.5,
];

/** Pad a 19-weight FSRS-5 vector to the 21 ts-fsrs expects. */
function asFsrs6Vector(w: readonly number[]): number[] {
  return w.length === 19 ? [...w, 0, 0.5] : [...w];
}

export const RELEARNING_STEPS = ['10m'] as const;

export function makeScheduler(settings: Pick<Settings, 'retention' | 'maximumInterval'>, weights?: readonly number[]): FSRS {
  return fsrs(generatorParameters({
    w: asFsrs6Vector(weights ?? FSRS5_WEIGHTS),
    request_retention: settings.retention,
    maximum_interval: settings.maximumInterval,
    enable_fuzz: false,
    enable_short_term: true,
    learning_steps: [],
    relearning_steps: [...RELEARNING_STEPS],
  }));
}

export function toCard(j: CardJSON): Card {
  return {
    due: new Date(j.due),
    stability: j.stability,
    difficulty: j.difficulty,
    elapsed_days: 0,
    scheduled_days: j.scheduled_days,
    learning_steps: j.learning_steps,
    reps: j.reps,
    lapses: j.lapses,
    state: j.state as State,
    last_review: j.last_review === undefined ? undefined : new Date(j.last_review),
  };
}

export function fromCard(c: Card, keep?: Partial<CardJSON>): CardJSON {
  const out: CardJSON = {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
  };
  if (c.last_review) out.last_review = c.last_review.getTime();
  if (keep?.baseStability !== undefined) out.baseStability = keep.baseStability;
  if (keep?.lastPartialDay !== undefined) out.lastPartialDay = keep.lastPartialDay;
  if (keep?.partials !== undefined) out.partials = keep.partials;
  if (keep?.suspended) out.suspended = true;
  return out;
}

export function newCard(at: number): CardJSON {
  return fromCard(createEmptyCard(new Date(at)));
}
