// Append-only review event log. One event per answered outcome: a scored FSRS
// review, an in-lesson intro step, or an answered item that only counted as
// exposure. Kept apart from LearnerState (see LearnerStore.loadEvents) so the
// state document stays small. Pure helpers only; Learner owns recording.
import type { NodeId } from '../content/schema';
import type { Grade } from './scheduler';
import { DIRECTIONS, StoredDocumentError, type Direction } from './state';

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
  /**
   * The kind of slip the checker named on the learner's first try (a HintKind), and the trap rule that
   * named it. On the first event an answer writes, and on no other: one answer can write an event per node.
   * Never the text of the answer, which lives in the attempts log.
   */
  err?: string;
  rule?: string;
  /** the learner said "mine says the same thing", or the card was a transfer probe: compaction keeps these (see `keeps`) */
  claimed?: true;
  probe?: true;
}

/** What compaction keeps of dropped events: counts per node and direction. */
export interface EventSummary {
  /** events at or before this time (epoch ms) were folded in, bar the ones compaction keeps; 0 = none yet */
  upTo: number;
  counts: Record<NodeId, Record<Direction, number>>;
}

/** The log's own version, apart from the state's. A log with no version is v1 (every log written so far). */
export const EVENTS_VERSION = 1;

export interface EventLog { version?: number; events: ReviewEvent[]; summary: EventSummary }

export const emptySummary = (): EventSummary => ({ upTo: 0, counts: {} });
export const emptyLog = (): EventLog => ({ version: EVENTS_VERSION, events: [], summary: emptySummary() });

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

/** What the code that reads an event needs of it. The rest of a damaged event is not worth guessing. */
function usable(e: unknown): e is ReviewEvent {
  return isObject(e) && Number.isFinite(e.at) && typeof e.node === 'string' && DIRECTIONS.includes(e.dir as never) && Number.isFinite(e.grade);
}

/**
 * Read a stored log. A newer log throws a `newer` StoredDocumentError (the
 * caller must not write over it); one that is not a log throws `unreadable`.
 * Damaged events are dropped one by one and the rest kept.
 */
export function readEvents(raw: unknown): EventLog {
  if (!isObject(raw) || !Array.isArray(raw.events)) throw new StoredDocumentError('unreadable', 'events', 'not an event log');
  const version = typeof raw.version === 'number' ? raw.version : 1;
  if (version > EVENTS_VERSION) throw new StoredDocumentError('newer', 'events', `v${version} is newer than this build (v${EVENTS_VERSION})`);
  const events = raw.events.filter(usable);
  if (events.length < raw.events.length) console.warn(`fluidez: dropped ${raw.events.length - events.length} damaged review event(s)`);
  const sum = raw.summary;
  const summary: EventSummary = isObject(sum) && Number.isFinite(sum.upTo) && isObject(sum.counts) ? { upTo: sum.upTo as number, counts: sum.counts as EventSummary['counts'] } : emptySummary();
  return { version: EVENTS_VERSION, events, summary };
}

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

/** A miss, as Weak spots counts one: shown the answer, or right only on the retry. */
export const isMiss = (e: Pick<ReviewEvent, 'grade' | 'tries'>): boolean => e.grade === AGAIN || e.tries === 2;

/** What compaction never folds into counts: a miss, a claim and a probe cannot be worked out again from a count, and a course runs longer than a year. */
const keeps = (e: ReviewEvent): boolean => isMiss(e) || !!e.claimed || !!e.probe;

/** Drop events older than `keepDays` before `now`, folding them into per-node per-direction counts. Misses, claims and probes stay. */
export function compact(log: EventLog, keepDays: number, now = Date.now()): EventLog {
  const cutoff = now - keepDays * DAY_MS;
  const keep: ReviewEvent[] = [];
  const counts: EventSummary['counts'] = structuredClone(log.summary.counts);
  let upTo = log.summary.upTo;
  for (const e of log.events) {
    if (e.at >= cutoff || keeps(e)) { keep.push(e); continue; }
    (counts[e.node] ??= { receptive: 0, productive: 0 })[e.dir] += 1;
    upTo = Math.max(upTo, e.at);
  }
  return { version: EVENTS_VERSION, events: keep, summary: { upTo, counts } };
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
