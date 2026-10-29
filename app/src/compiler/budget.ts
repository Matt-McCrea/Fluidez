// Minute budgets and per-item time estimates. Design heuristics from
// BLUEPRINT "Anatomy of the daily lesson" (20-minute lesson, A1–B1); the
// simulator reports how plans built from them actually land.
import type { LessonType } from '../content/schema';
import type { Tier } from '../learner';

/** Session length in minutes by tier (standard uses settings.minutes). */
export const TIER_MINUTES: Record<Tier, number> = { minimum: 10, standard: 20, extended: 40 };

/** The SRS warm-up budget in minutes ("constant 4–5 min"), by tier. */
export const WARMUP_MINUTES: Record<Tier, number> = { minimum: 5, standard: 4.5, extended: 8 };

/** Review day: the extended SRS block. Checkpoint: shortened. */
export const REVIEW_DAY_MINUTES: Record<Tier, number> = { minimum: 5, standard: 8, extended: 12 };
export const CHECKPOINT_WARMUP_MINUTES = 3.5;

/** Throttle: due minutes > budget. Severe: > SEVERE_FACTOR × budget (introduce days convert too). */
export const SEVERE_FACTOR = 2;

/** A throttled, non-converted session may let the warm-up run this much over budget (taken from cut new items). */
export const THROTTLED_WARMUP_FACTOR = 1.5;

/** New-item caps per lesson type (A1–A2 BLUEPRINT table). Chunks have their own budget. */
export const LEXEME_CAP: Record<LessonType, number> = {
  introduce: 6, drill: 4, input: 16, patterns: 6, output: 0, review: 0, checkpoint: 0,
};
export const CHUNK_CAP = 5;
/** Patterns per session: on a Patterns day up to PATTERNS_DAY_CAP (the first PATTERNS_TAUGHT get a light script lesson, the rest join the learn pool). */
export const PATTERN_CAP = 4;
export const PATTERNS_DAY_CAP = 8;
export const PATTERNS_TAUGHT = 3;
export const CONTRAST_CAP = 1;
/**
 * Owed items (cut by an earlier throttle or over a day's cap) are repaid
 * first, and also on days that teach nothing new themselves (output, review,
 * checkpoint, forced drills) when the backlog allows, at most this many.
 */
export const REPAY_CAP = { lexeme: 6, chunk: 3, pattern: 2, contrast: 1 } as const;

/** Seconds per item, by op. Reviews use learner.secondsPerReview() instead. */
export const SECONDS = {
  learn: 35,            // example + 3–5 interleaved retrievals
  hook: 30,
  examples: 60,
  rule: 90,
  readAndPick: 12,
  yourTurn: 25,
  pick: 15,
  choose: 18,
  type: 25,
  transform: 30,
  translate: 35,
  respond: 45,
  gap: 20,
  comprehend: 30,
  read: 15,
  ruleRecall: 60,
  personal: 90,
  selfCheck: 90,
  close: 30,
  recall: 10,
} as const;

/** Counts per block (standard tier). */
export const COUNTS = {
  structuredInput: 9,       // 8–10
  controlledOutput: 11,     // 10–12
  latestShare: 0.6,         // interleaved: ~60% latest, ~40% older
  communicative: 4,
  cuedPerLexeme: 1,
  cuedMax: 8,
  remix: 12,                // 12–15
  leech: 6,                 // 5–10
  leechMinLapses: 2,
  readingCheck: 8,
  extraReading: 10,
  timedRecallSeconds: 120,
  patternsInput: 6,
  patternsOutput: 8,
  introduceInput: 0,        // the script's readAndPick is the structured input
} as const;

/** Days back for the review-day "notice it's easy now" re-read (first read 14–21 days ago; widened if empty). */
export const REREAD_WINDOW_DAYS: [number, number] = [14, 21];
export const REREAD_WIDE_DAYS: [number, number] = [7, 35];
/** Remix draws grammar introduced within this many days (≈ the last 2–4 units). */
export const REMIX_WINDOW_DAYS = 28;
/** Checkpoint reading uses nodes introduced 14–28 days ago. */
export const CHECKPOINT_WINDOW_DAYS: [number, number] = [14, 28];
/** Drill must follow an introduce within this many core sessions. */
export const DRILL_WITHIN = 3;
