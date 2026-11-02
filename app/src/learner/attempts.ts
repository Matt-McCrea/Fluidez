// The attempts log: what was typed or picked, and what became of it, for each
// answered card. Kept apart from the review events (an exposure writes one
// event per node, so text on an event would repeat up to nine times) and capped
// at the newest rows. Latency is logged and never used to grade (R17). What
// the cap would otherwise lose is kept as a rollup on the learner's state (see
// `tally`). Pure helpers only; Learner owns recording.
import type { NodeId } from '../content/schema';
import { StoredDocumentError } from './state';

/** The log's own version. A log with no version is v1. */
export const ATTEMPTS_VERSION = 1;
/** Newest rows kept. */
export const ATTEMPTS_CAP = 1000;

/** How the card ended: passed on any try, or the answer was shown. `unconfirmed` is for the verdict that cannot say, which no card gives yet. */
export type Verdict = 'right' | 'wrong' | 'unconfirmed';

export interface AttemptRow {
  at: number;
  node: NodeId;
  /** what produced the answer, as on the review event ('warmup', 'type', 'learn', ...) */
  op: string;
  /** the card's look as delivered (its type and the languages asked and answered), for telling a cloze pass from a translation pass */
  fmt: string;
  sentence?: string;
  /** what the learner gave: the first thing typed, or the option picked ('' for "I don't know") */
  given: string;
  /** the right version, when the learner was shown it */
  answer?: string;
  /** the kind of slip the checker named on the first try, as a short enum (a HintKind) */
  err?: string;
  /** the trap rule that named it, when one did */
  rule?: string;
  /** how the card ended (see Verdict). `given` is the first try, so it is the right answer only when `tries` is 1 */
  verdict?: Verdict;
  /** tries used: a 'right' on 2 is a first try that was refused and a second that passed */
  tries?: 1 | 2;
  /** the learner said "mine says the same thing" */
  claimed?: true;
  /** ms from the card appearing to the first key (typed cards): retrieval onset without thumb speed */
  firstKeyMs?: number;
  /** the build the card came from, so a content change is not read as a learning effect */
  contentRev?: string;
}

export interface AttemptLog { version: number; rows: AttemptRow[] }

export const emptyAttempts = (): AttemptLog => ({ version: ATTEMPTS_VERSION, rows: [] });

/** What the rollup holds for one kind of slip: times it was named, times it ended as a miss, and when last. */
export interface FingerprintRow { n: number; miss: number; last: number }
export type Fingerprint = Record<string, FingerprintRow>;

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

/** What the code that reads a row needs of it. */
function usable(r: unknown): r is AttemptRow {
  return isObject(r) && Number.isFinite(r.at) && typeof r.node === 'string' && typeof r.op === 'string' && typeof r.fmt === 'string' && typeof r.given === 'string';
}

/**
 * Read a stored log. A newer log throws a `newer` StoredDocumentError (the
 * caller must not write over it); one that is not a log throws `unreadable`.
 * Damaged rows are dropped one by one and the rest kept.
 */
export function readAttempts(raw: unknown): AttemptLog {
  // the version first: a newer build may have moved the rows, and that is not damage to clear away
  const version = isObject(raw) && typeof raw.version === 'number' ? raw.version : 1;
  if (version > ATTEMPTS_VERSION) throw new StoredDocumentError('newer', 'attempts', `v${version} is newer than this build (v${ATTEMPTS_VERSION})`);
  if (!isObject(raw) || !Array.isArray(raw.rows)) throw new StoredDocumentError('unreadable', 'attempts', 'not an attempts log');
  const rows = raw.rows.filter(usable);
  if (rows.length < raw.rows.length) console.warn(`fluidez: dropped ${raw.rows.length - rows.length} damaged attempt row(s)`);
  return { version: ATTEMPTS_VERSION, rows: rows.slice(-ATTEMPTS_CAP) };
}

/** Add a row, dropping the oldest past the cap. */
export function appendAttempt(log: AttemptLog, row: AttemptRow): void {
  log.rows.push(row);
  if (log.rows.length > ATTEMPTS_CAP) log.rows.splice(0, log.rows.length - ATTEMPTS_CAP);
}

/** Fold a row into the rollup: a named slip counts once, and counts as a miss when the card ended with the answer shown. */
export function tally(fp: Fingerprint, row: AttemptRow): void {
  if (!row.err) return;
  const was = Object.hasOwn(fp, row.err) ? fp[row.err] : undefined;
  const cur = isObject(was) && Number.isFinite(was.n) && Number.isFinite(was.miss) && Number.isFinite(was.last) ? was : { n: 0, miss: 0, last: 0 };
  fp[row.err] = { n: cur.n + 1, miss: cur.miss + (row.verdict === 'wrong' ? 1 : 0), last: Math.max(cur.last, row.at) };
}
