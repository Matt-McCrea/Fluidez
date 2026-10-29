// Append-only review event log. One event per answered outcome: a scored FSRS
// review, an in-lesson intro step, or an answered item that only counted as
// exposure. Kept apart from LearnerState (see LearnerStore.loadEvents) so the
// state document stays small. Pure helpers only; Learner owns recording.
import type { NodeId } from '../content/schema';
import type { Grade } from './scheduler';
import type { Direction } from './state';

export interface ReviewEvent {
  at: number;                 // epoch ms
  node: NodeId;
  dir: Direction;
  grade: Grade;
  ms?: number;                // time to answer
  sentence?: string;          // bank sentence id if any
  op: string;                 // 'warmup' | 'learn' | a PracticeOp | 'scene' | 'recall' | other
  tries: 1 | 2;
  novel: boolean;
  session: number;            // learner session index at the time
  r?: number;                 // FSRS retrievability just before the rating (undefined for a first review)
  scored: 'review' | 'exposure' | 'intro';
}

/** What compaction keeps of dropped events: counts per node and direction. */
export interface EventSummary {
  /** events at or before this time (epoch ms) were folded in; 0 = none yet */
  upTo: number;
  counts: Record<NodeId, Record<Direction, number>>;
}

export interface EventLog { events: ReviewEvent[]; summary: EventSummary }

export const emptySummary = (): EventSummary => ({ upTo: 0, counts: {} });
export const emptyLog = (): EventLog => ({ events: [], summary: emptySummary() });

const DAY_MS = 86_400_000;
const AGAIN = 1;

/**
 * Share of delayed scored reviews that were not Again. "Delayed" = the node was
 * introduced at least `minAgeDays` before the event. Introduction time comes
 * from `introducedAt` if given, else the node's earliest event in the list.
 * Returns undefined when there are no such reviews.
 */
export function delayedAccuracy(
  events: readonly ReviewEvent[],
  opts: { minAgeDays?: number; since?: number; introducedAt?: (node: NodeId) => number | undefined } = {},
): number | undefined {
  const minAge = (opts.minAgeDays ?? 7) * DAY_MS;
  const first = new Map<NodeId, number>();
  for (const e of events) { const f = first.get(e.node); if (f === undefined || e.at < f) first.set(e.node, e.at); }
  let n = 0, ok = 0;
  for (const e of events) {
    if (e.scored !== 'review') continue;
    if (opts.since !== undefined && e.at < opts.since) continue;
    const intro = opts.introducedAt?.(e.node) ?? first.get(e.node);
    if (intro === undefined || e.at - intro < minAge) continue;
    n += 1;
    if (e.grade !== AGAIN) ok += 1;
  }
  return n ? ok / n : undefined;
}

/** Share of scored reviews that were productive (en to es). undefined when there are none. */
export function productionShare(events: readonly ReviewEvent[], since?: number): number | undefined {
  let n = 0, p = 0;
  for (const e of events) {
    if (e.scored !== 'review' || (since !== undefined && e.at < since)) continue;
    n += 1;
    if (e.dir === 'productive') p += 1;
  }
  return n ? p / n : undefined;
}

/** Drop events older than `keepDays` before `now`, folding them into per-node per-direction counts. */
export function compact(log: EventLog, keepDays: number, now = Date.now()): EventLog {
  const cutoff = now - keepDays * DAY_MS;
  const keep: ReviewEvent[] = [];
  const counts: EventSummary['counts'] = structuredClone(log.summary.counts);
  let upTo = log.summary.upTo;
  for (const e of log.events) {
    if (e.at >= cutoff) { keep.push(e); continue; }
    (counts[e.node] ??= { receptive: 0, productive: 0 })[e.dir] += 1;
    upTo = Math.max(upTo, e.at);
  }
  return { events: keep, summary: { upTo, counts } };
}

/** Like delayedAccuracy but with the count: how many delayed scored reviews, and how many were not Again. */
export function delayedCounts(
  events: readonly ReviewEvent[],
  opts: { minAgeDays?: number; since?: number; introducedAt?: (node: NodeId) => number | undefined } = {},
): { n: number; ok: number } {
  const minAge = (opts.minAgeDays ?? 7) * DAY_MS;
  const first = new Map<NodeId, number>();
  for (const e of events) { const f = first.get(e.node); if (f === undefined || e.at < f) first.set(e.node, e.at); }
  let n = 0, ok = 0;
  for (const e of events) {
    if (e.scored !== 'review') continue;
    if (opts.since !== undefined && e.at < opts.since) continue;
    const intro = opts.introducedAt?.(e.node) ?? first.get(e.node);
    if (intro === undefined || e.at - intro < minAge) continue;
    n += 1;
    if (e.grade !== AGAIN) ok += 1;
  }
  return { n, ok };
}

/** Productive and total scored reviews since a time. */
export function productionCounts(events: readonly ReviewEvent[], since?: number): { n: number; productive: number } {
  let n = 0, productive = 0;
  for (const e of events) {
    if (e.scored !== 'review' || (since !== undefined && e.at < since)) continue;
    n += 1;
    if (e.dir === 'productive') productive += 1;
  }
  return { n, productive };
}
