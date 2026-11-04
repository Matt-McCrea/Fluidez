/* ============================================================================
 * FSRS for a vanilla app: a thin wrapper over ts-fsrs, with the parameters the
 * rebuild pinned (app/src/learner/scheduler.ts).
 *
 *   - FSRS-5 published default weights (19, padded to the 21 ts-fsrs 5 takes,
 *     decay 0.5) rather than ts-fsrs's FSRS-6 defaults;
 *   - no fuzz, so intervals are deterministic and testable;
 *   - no learning steps: the lesson runs its own in-session repeats, so a
 *     first Good goes straight to review; a lapse has one 10-minute step;
 *   - maximum interval 365 days, retention 0.90 by default (0.85 to 0.90).
 *
 * Cards are plain JSON (due as epoch milliseconds), safe for localStorage.
 *
 *   let c = createCard(now);
 *   const r = review(c, 'good', now);   // r.card, r.intervalDays, r.due
 *   retrievability(r.card, later);       // 0..1
 * ========================================================================== */
import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type FSRS, type Grade as TsGrade } from 'ts-fsrs';

export type GradeName = 'again' | 'hard' | 'good' | 'easy';
export type Grade = GradeName | 1 | 2 | 3 | 4;

/** A card as plain JSON. `due` and `last_review` are epoch milliseconds. */
export interface CardJSON {
  due: number;
  stability: number;
  difficulty: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  /** 0 New, 1 Learning, 2 Review, 3 Relearning (ts-fsrs State). */
  state: number;
  last_review?: number;
}

export interface ReviewResult {
  card: CardJSON;
  /** Days until due, as FSRS scheduled it (0 for a same-day relearning step; use `due` for the exact time). */
  intervalDays: number;
  due: number;
}

export const FSRS5_WEIGHTS: readonly number[] = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
  1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
  0, 0.5,
];
export const RELEARNING_STEPS = ['10m'] as const;
export const MAXIMUM_INTERVAL = 365;
export const DEFAULT_RETENTION = 0.9;
export const MIN_RETENTION = 0.85;
export const MAX_RETENTION = 0.9;
/** The old app's Leitner box intervals in days (js/srs.js). */
export const LEITNER_INTERVALS: readonly number[] = [0, 1, 2, 4, 8, 16, 32, 64, 120, 180];
/** Used when a card has no typical latency of its own yet. */
export const DEFAULT_TYPICAL_LATENCY_MS = 6000;

const DAY = 86400000;

function build(retention: number): FSRS {
  return fsrs(generatorParameters({
    w: [...FSRS5_WEIGHTS],
    request_retention: retention,
    maximum_interval: MAXIMUM_INTERVAL,
    enable_fuzz: false,
    enable_short_term: true,
    learning_steps: [],
    relearning_steps: [...RELEARNING_STEPS],
  }));
}

let retention = DEFAULT_RETENTION;
let scheduler = build(retention);

/** Target retention, clamped to 0.85..0.90. Returns the value in force. */
export function setRetention(r: number): number {
  if (!Number.isFinite(r)) throw new RangeError(`retention must be a number, got ${r}`);
  retention = Math.min(MAX_RETENTION, Math.max(MIN_RETENTION, r));
  scheduler = build(retention);
  return retention;
}
export function getRetention(): number { return retention; }

function toCard(j: CardJSON): Card {
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

function fromCard(c: Card): CardJSON {
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
  return out;
}

const RATING: Record<GradeName, TsGrade> = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good, easy: Rating.Easy };

function toRating(g: Grade): TsGrade {
  if (typeof g === 'number') {
    if (g >= 1 && g <= 4 && Number.isInteger(g)) return g as TsGrade;
    throw new RangeError(`bad grade ${g}`);
  }
  const r = RATING[g];
  if (!r) throw new RangeError(`bad grade ${String(g)}`);
  return r;
}

/** A brand-new card, due now. */
export function createCard(now: number | Date = Date.now()): CardJSON {
  return fromCard(createEmptyCard(new Date(now)));
}

/** Apply one review. Does not mutate `card`. */
export function review(card: CardJSON, grade: Grade, now: number | Date = Date.now()): ReviewResult {
  const at = new Date(now);
  const next = scheduler.next(toCard(card), at, toRating(grade)).card;
  // ts-fsrs lets Easy exceed the maximum interval by a day or two; hold the line
  if (next.state === State.Review && next.scheduled_days > MAXIMUM_INTERVAL) {
    next.scheduled_days = MAXIMUM_INTERVAL;
    next.due = new Date(at.getTime() + MAXIMUM_INTERVAL * DAY);
  }
  const out = fromCard(next);
  return { card: out, intervalDays: out.scheduled_days, due: out.due };
}

/** Probability of recalling the card at `now`: 1 just after a review, falling with time; 0 for a card never reviewed. */
export function retrievability(card: CardJSON, now: number | Date = Date.now()): number {
  if (card.state === State.New || card.last_review === undefined) return 0;
  return scheduler.get_retrievability(toCard(card), new Date(now), false);
}

export interface AnswerSignal {
  correct: boolean;
  usedHint?: boolean;
  latencyMs?: number;
  unsure?: boolean;
  /** This card's typical correct latency; DEFAULT_TYPICAL_LATENCY_MS when unknown. */
  typicalLatencyMs?: number;
}

/**
 * Wrong or unsure: again. Right after a hint, or slower than typical: hard.
 * Right and no slower than typical: good. Right and under half the typical
 * time: easy.
 */
export function gradeFromAnswer(a: AnswerSignal): GradeName {
  if (!a.correct || a.unsure) return 'again';
  if (a.usedHint) return 'hard';
  if (a.latencyMs === undefined || !Number.isFinite(a.latencyMs)) return 'good';
  const typical = a.typicalLatencyMs && a.typicalLatencyMs > 0 ? a.typicalLatencyMs : DEFAULT_TYPICAL_LATENCY_MS;
  if (a.latencyMs < typical * 0.5) return 'easy';
  if (a.latencyMs <= typical) return 'good';
  return 'hard';
}

/**
 * Seed an FSRS card from the old app's Leitner state. `box` is 0..9 and
 * `lastReviewDay` is the old app's day number (local days since the epoch, as
 * js/srs.js today() counts). The box's interval becomes the stability, the
 * card is due that many days after the last review, and difficulty starts at
 * the value a first Good gives. Box 0 (never passed) is a new card.
 */
export function fromLeitner(box: number, lastReviewDay: number): CardJSON {
  const b = Math.min(LEITNER_INTERVALS.length - 1, Math.max(0, Math.trunc(box) || 0));
  // local midnight of that day number
  const last = lastReviewDay * DAY + new Date(lastReviewDay * DAY).getTimezoneOffset() * 60000;
  if (b === 0) return createCard(last);
  const days = LEITNER_INTERVALS[b];
  const difficulty = scheduler.next(createEmptyCard(new Date(last)), new Date(last), Rating.Good).card.difficulty;
  return {
    due: last + days * DAY,
    stability: days,
    difficulty,
    scheduled_days: days,
    learning_steps: 0,
    reps: b,
    lapses: 0,
    state: State.Review,
    last_review: last,
  };
}
