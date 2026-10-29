// Minute budgets and per-item time estimates. Design heuristics from
// BLUEPRINT "Anatomy of the daily lesson" (20-minute lesson, A1–B1); the
// simulator reports how plans built from them actually land.
import type { Band, LessonType } from '../content/schema';
import type { Tier } from '../learner';

// ---------------------------------------------------------------- session & review budgets
//
// Defaults decided 29 Oct 2026 (coordinator), after the simulator showed a flat
// 4.5-minute warm-up cannot carry the unit map's intake (average A1 = 211 days).
// Every value below is config: the simulator's report says how plans built from
// them land. Changes made while tuning are listed in TUNING_LOG at the end.

/** Standard-tier session length in minutes, by the band of the unit being studied. */
export const SESSION_MINUTES: Record<Band, number> = { A1: 20, A2: 22, B1: 25, B2: 28, C1: 30 };

/**
 * Standard-tier SRS warm-up budget in minutes, by band (part of the session
 * minutes above). Coordinator default A1 6 / A2 6 / B1 7 / B2 8 / C1 8; tuned
 * +1 per band (see TUNING_LOG): the core's planned content already ends under
 * the session minutes in A1–B1, so the extra warm-up minute comes out of slack.
 */
export const BAND_WARMUP_MINUTES: Record<Band, number> = { A1: 7, A2: 7, B1: 8, B2: 9, C1: 9 };

/** Minimum tier: a 10-minute streak saver (warm-up + re-read + timed recall, nothing new). */
export const MINIMUM_MINUTES = 10;
export const MINIMUM_WARMUP_MINUTES = 5;

/**
 * Extended tier: the standard session plus this many CORE minutes. No extra
 * new grammar (the one-grammar-point rule is unchanged). The extra minutes go,
 * in order, to due reviews beyond the warm-up budget (so a backlog that fits in
 * them does not convert the day), then to extra reading from the unit bank.
 */
export const EXTENDED_EXTRA_MINUTES = 15;
/** Cap on extended-tier extra-reading sentences per session (bounds bank demand). */
export const EXTRA_READING_MAX = 24;

/** Band used once the course is finished (maintenance sessions). */
export const DONE_BAND: Band = 'C1';

export function sessionMinutes(tier: Tier, band: Band): number {
  if (tier === 'minimum') return MINIMUM_MINUTES;
  return SESSION_MINUTES[band] + (tier === 'extended' ? EXTENDED_EXTRA_MINUTES : 0);
}

/** The warm-up's review budget in minutes (what the warm-up block is planned to). */
export function warmupMinutes(tier: Tier, band: Band): number {
  return tier === 'minimum' ? MINIMUM_WARMUP_MINUTES : BAND_WARMUP_MINUTES[band];
}

/**
 * The backlog-throttle threshold in minutes: due reviews above it throttle the
 * session. Extended learners may spend their extra core minutes on reviews.
 */
export function throttleMinutes(tier: Tier, band: Band): number {
  return warmupMinutes(tier, band) + (tier === 'extended' ? EXTENDED_EXTRA_MINUTES : 0);
}

/** Review day: the extended SRS block = warm-up + this many minutes. Checkpoint: warm-up × this factor. */
export const REVIEW_DAY_EXTRA_MINUTES = 4;
export const CHECKPOINT_WARMUP_FACTOR = 0.75;

// ---------------------------------------------------------------- reviews

/**
 * Multi-item sentence reviews (the research doc's "one sentence retrieves 3–5
 * known words"): one review item may target up to MULTI_REVIEW_MAX due nodes
 * (same direction) when one usable sentence contains them all. Each target
 * gets a full review. A multi-target item costs MULTI_REVIEW_COST × a single
 * review's time (learner.secondsPerReview), whatever its target count.
 */
export const MULTI_REVIEW_MAX = 3;
export const MULTI_REVIEW_COST = 1.4;
/** Candidate sentences examined per due card when grouping (bounds compile time). */
export const MULTI_REVIEW_SCAN = 80;

/**
 * Review-context reuse: a bank sentence only ever shown as an SRS review
 * context may be served as a review context again after this many days
 * (labelled deliberate, reason REVIEW_REUSE_REASON). Unseen sentences are
 * still preferred while a target needs its first recombination pass.
 */
export const REVIEW_REUSE_DAYS = 120;
export const REVIEW_REUSE_REASON = 'review-context-120d';

/** Throttle: due minutes > budget. Severe: > SEVERE_FACTOR × budget (introduce days convert too). */
export const SEVERE_FACTOR = 2;

/** A throttled, non-converted session may let the warm-up run this much over budget (taken from cut new items). */
export const THROTTLED_WARMUP_FACTOR = 1.5;

/** New-item caps per lesson type (A1–A2 BLUEPRINT table). Chunks have their own budget. */
export const LEXEME_CAP: Record<LessonType, number> = {
  introduce: 6, drill: 4, input: 16, patterns: 6, output: 0, review: 0, checkpoint: 0,
};
export const CHUNK_CAP = 5;
/**
 * The first-week ramp: in a learner's first EARLY_SESSIONS core sessions the
 * learn pool takes at most EARLY_NEW_ITEMS_MAX new items, all kinds together.
 * Unit 1's survival kit lists 11 per day; 11 items at 3–5 retrievals each is a
 * 50-card run on day one. The rest are owed and repaid first next time.
 * Later sessions are bounded by the session minutes instead (fitToBudget).
 */
export const EARLY_SESSIONS = 3;
export const EARLY_NEW_ITEMS_MAX = 8;
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
  learn: 55,            // present + 3–5 interleaved retrievals (pick the meaning, pick the Spanish, type it): measured in the player, not 35
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

/**
 * Every parameter change made while tuning against the simulator, newest
 * last (also printed into content/_reports/sim-summary.md).
 */
export const TUNING_LOG: readonly string[] = [
  '2026-10-29 coordinator defaults: session minutes A1 20 / A2 22 / B1 25 / B2 28 / C1 30; warm-up A1 6 / A2 6 / B1 7 / B2 8 / C1 8; minimum 10; extended +15 core; multi-item reviews (≤ 3, cost 1.4×); review-context reuse after 120 d; production cards by policy; recognition-only maintenance. Result (seed 1, standard): average A1 176 d (was 211), B2 throttle 12.8% (was 51.7%); fast A1 116 d.',
  '2026-10-29 canDoAnother costs due reviews the way the warm-up will (multi-target groups) when given the content index, instead of one review per due card; "another" is offered exactly when it would not throttle.',
  '2026-10-29 BAND_WARMUP_MINUTES +1 per band → A1 7 / A2 7 / B1 8 / B2 9 / C1 9. 3-seed means, standard tier: average throttle A1 9→6%, A2 18→10%, B1 16→13%, B2 11→7%, C1 17→10%; fast A1 114→108 d with 0% throttle (target ≤ ~112 met). Average A1 stays ~160–172 d: see the summary, it is attendance-bound, not review-bound.',
  '2026-10-29 tried and rejected: MULTI_REVIEW_SCAN 80→250 (targets/item +0.05, calendar change within seed noise, compile cost ×2.5); B2/C1 warm-up 10–12. Forgetful B2 throttle (2 seeds) 31% at 9 min, 25% at 10, 24.5% at 11, 17% at 12; the average profile is already ~5% at 9 and gains nothing. Kept 9: a 10–12 min warm-up turns the 28-min B2 session into a 16–18 min core for every learner to help only the forgetful one.',
  '2026-10-29 simulator: synthetic supply 2× (32 sentences per lexeme) for the quota run, so measured demand is not capped by the synthetic bank (bare reviews 0–4 instead of hundreds for forgetful).',
  '2026-10-29 playtest: SECONDS.learn 35→55 (what the player really takes); first-week ramp: at most 8 new items per session in the first 3 core sessions (day 1 listed 11); a plan over its session minutes drops new items from the end of the learn pool (owed, never lost) until it fits.',
];
