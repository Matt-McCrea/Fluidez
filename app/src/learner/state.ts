// The learner's whole state as one plain-JSON document. Nothing here holds a
// Date or a class instance: timestamps are epoch milliseconds, so the state
// survives JSON, structuredClone and IndexedDB unchanged. The Learner class
// (learner.ts) is the only code that mutates it; LearnerStore persists it.
import type { NodeId } from '../content/schema';
import type { Fingerprint } from './attempts';
import { newCard } from './scheduler';

export const STATE_VERSION = 2;

export type Direction = 'receptive' | 'productive';
export const DIRECTIONS: readonly Direction[] = ['receptive', 'productive'];

/** ts-fsrs Card, flattened to JSON. */
export interface CardJSON {
  due: number;
  stability: number;
  difficulty: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;              // ts-fsrs State enum: 0 New, 1 Learning, 2 Review, 3 Relearning
  last_review?: number;
  // Fluidez bookkeeping, not part of FSRS:
  baseStability?: number;     // stability right after the last *full* review (caps partial credit)
  lastPartialDay?: string;    // day key of the last partial credit (one per day)
  partials?: number;          // partial credits received, lifetime
  /**
   * Suspended cards are never due and get no partial credit. Set on the
   * receptive card once the node is learned (production subsumes recognition,
   * see Learner.maintain). A review of a suspended card still updates it.
   */
  suspended?: boolean;
}

export interface LearningStep { at: number; correct: boolean; ms?: number }

export interface NodeRecord {
  id: NodeId;
  introducedAt: number;
  introDay: string;           // local day key of introduction (see dayKey)
  /** Present while the node is being taught in-lesson, before FSRS owns it. */
  learning?: { steps: LearningStep[] };
  receptive?: CardJSON;
  productive?: CardJSON;      // absent until unlocked
  productiveUnlockedAt?: number;
  /**
   * Whether this node ever gets a production (en→es) card. Decided once, at
   * introduce time, by `productivePolicy` (the caller passes it); absent in
   * older documents = true. This is the plan's node-level `productive` flag,
   * named apart from the `productive` card field above.
   */
  productiveTrack?: boolean;
  novelPasses: number;        // passed reviews flagged novel (recombination)
  exposures: number;          // reading / context encounters, never scored
  lastExposedAt?: number;
  /** Output ladder position: 0 choose, 1 type, 2 transform, 3 recombine. Absent = 0. */
  rung?: 0 | 1 | 2 | 3;
  /** Consecutive first-try passes at the current rung. */
  rungStreak?: number;
}

export type LedgerKind = 'chapter' | 'reading' | 'scene' | 'item' | 'sentence';
export const LEDGER_KINDS: readonly LedgerKind[] = ['chapter', 'reading', 'scene', 'item', 'sentence'];

/**
 * One showing. `review`: shown as an SRS review context (warm-up). `reason`
 * labels a deliberate re-show (e.g. 'review-context-120d').
 */
export interface LedgerView { at: number; deliberate: boolean; review?: boolean; reason?: string }
export interface LedgerEntry { first: number; last: number; views: LedgerView[] }

export interface TimingStats { count: number; totalMs: number }

export type Tier = 'minimum' | 'standard' | 'extended';

export interface Settings {
  /**
   * The lesson size the compiler is asked for; session minutes come from this and the band
   * (compiler/budget.ts). Not a learner's choice: a stored value is read back as 'standard' (see migrate),
   * and only a session that asks for less (the five minute one) passes another.
   */
  tier: Tier;
  retention: number;          // FSRS target retention
  maximumInterval: number;    // days; caps maintenance gaps
  rolloverHour: number;       // local hour when "today" becomes "tomorrow"
}

export interface LearnerState {
  version: number;
  createdAt: number;
  settings: Settings;
  nodes: Record<NodeId, NodeRecord>;
  ledger: Record<LedgerKind, Record<string, LedgerEntry>>;
  session: { index: number; lastStartedAt?: number; lastDay?: string };
  timing: Record<Direction, TimingStats>;
  /** Fitted FSRS weights once enough reviews exist; undefined = FSRS-5 defaults. */
  weights?: number[];
  /**
   * The kinds of slip the checker has named, counted (see attempts.ts). A rollup, so it outlives the
   * capped attempts log. Additive: absent until the first named slip, and a build that does not know
   * it carries it through a save untouched.
   */
  fingerprint?: Fingerprint;
}

export const DEFAULT_SETTINGS: Settings = {
  tier: 'standard',
  retention: 0.9,
  maximumInterval: 365,
  rolloverHour: 4,
};

export function emptyState(now = Date.now()): LearnerState {
  return {
    version: STATE_VERSION,
    createdAt: now,
    settings: { ...DEFAULT_SETTINGS },
    nodes: {},
    ledger: { chapter: {}, reading: {}, scene: {}, item: {}, sentence: {} },
    session: { index: 0 },
    timing: { receptive: { count: 0, totalMs: 0 }, productive: { count: 0, totalMs: 0 } },
  };
}

/**
 * Migration hook. MIGRATIONS[n] turns a version-n state into version n+1.
 * To change the shape: bump STATE_VERSION, add MIGRATIONS[old], add a test.
 * Never edit an existing migration once a build that ran it has shipped.
 */
export const MIGRATIONS: Record<number, (s: any) => any> = {
  // 0 = pre-versioned dev builds: same shape, version field missing.
  0: (s) => ({ ...s, version: 1 }),
  // 1 -> 2: the review event log lives outside this document; nothing to reshape.
  1: (s) => ({ ...s, version: 2 }),
};

/**
 * A saved document this build cannot use, in words for the learner. `newer`: a
 * later version of the app wrote it, so it is left exactly as it is. `unreadable`:
 * it is damaged. `key` names the document ('state', 'events', 'path', 'ui').
 */
export type DocumentFault = 'newer' | 'unreadable';
export const NEWER_DOCUMENT = 'Your progress was saved by a newer version of Fluidez than this one. We haven\'t touched it. Close the app and open it again to get the newest version.';
export const UNREADABLE_DOCUMENT = 'Your saved progress can\'t be read. We haven\'t deleted anything.';
export class StoredDocumentError extends Error {
  constructor(readonly fault: DocumentFault, readonly key: string, readonly detail?: string) {
    super(fault === 'newer' ? NEWER_DOCUMENT : UNREADABLE_DOCUMENT);
    this.name = 'StoredDocumentError';
  }
}

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

/** The first thing wrong with what holds a migrated state together, or undefined. Nothing can be read without these. */
function containerProblem(s: any): string | undefined {
  if (!isObject(s.settings)) return 'settings is not an object';
  if (!isObject(s.nodes)) return 'nodes is not an object';
  if (!isObject(s.ledger) || LEDGER_KINDS.some((k) => !isObject(s.ledger[k]))) return 'ledger is not a table per kind';
  if (!isObject(s.session) || typeof s.session.index !== 'number') return 'session has no index';
  if (!isObject(s.timing) || DIRECTIONS.some((d) => !isObject(s.timing[d]))) return 'timing is not a total per direction';
  return undefined;
}

const cardDamaged = (c: unknown): boolean => !isObject(c) || !Number.isFinite(c.due) || !Number.isFinite(c.stability) || !Number.isFinite(c.state);

/** The first thing wrong with a migrated state that would break the code that reads it, or undefined. A small hand-written guard, not a schema. */
function stateProblem(s: any): string | undefined {
  const problem = containerProblem(s);
  if (problem) return problem;
  for (const [id, r] of Object.entries<any>(s.nodes)) {
    if (!isObject(r)) return `node ${id} is not an object`;
    for (const d of DIRECTIONS) if (r[d] !== undefined && cardDamaged(r[d])) return `node ${id} has a damaged ${d} card`;
  }
  return undefined;
}

/**
 * Upgrade a stored state to this build's version. Throws a StoredDocumentError:
 * `newer` when a later build wrote it (nothing is guessed, the caller must not
 * write over it), `unreadable` when it is not a state at all.
 */
export function migrate(raw: unknown): LearnerState {
  const s = upgrade(raw);
  const problem = stateProblem(s);
  if (problem) throw new StoredDocumentError('unreadable', 'state', problem);
  return s;
}

/**
 * The last resort, when a state is damaged and no clean copy is left. A value a
 * bug wrote into one card is in every save after it, the one-step backup too,
 * and one card must not cost a learner the rest. A damaged card starts again as
 * a new card, a node that is not a node is dropped, and everything else is kept.
 * Throws as `migrate` does when what holds the document together is gone. The
 * caller must keep the damaged document aside first.
 */
export function salvage(raw: unknown): LearnerState {
  const s = upgrade(raw);
  const problem = containerProblem(s);
  if (problem) throw new StoredDocumentError('unreadable', 'state', problem);
  for (const [id, r] of Object.entries<any>(s.nodes)) {
    if (!isObject(r)) { delete s.nodes[id]; continue; }
    for (const d of DIRECTIONS) {
      if (r[d] === undefined || !cardDamaged(r[d])) continue;
      const suspended = (r[d] as { suspended?: unknown } | null)?.suspended === true;
      r[d] = { ...newCard(Number.isFinite(r.introducedAt) ? r.introducedAt as number : Date.now()), ...(suspended ? { suspended } : {}) };
    }
  }
  return s;
}

function upgrade(raw: unknown): any {
  if (!isObject(raw)) throw new StoredDocumentError('unreadable', 'state', 'not an object');
  let s: any = structuredClone(raw);
  let v: number = typeof s.version === 'number' ? s.version : 0;
  if (v > STATE_VERSION) throw new StoredDocumentError('newer', 'state', `v${v} is newer than this build (v${STATE_VERSION})`);
  try {
    while (v < STATE_VERSION) {
      const step = MIGRATIONS[v];
      if (!step) throw new Error(`no migration from v${v}`);
      s = step(s);
      v = s.version;
    }
    // Fill anything a partial/older document lacks, without dropping what it has.
    // (A container that is there but not an object would be quietly spread into a good-looking one.)
    for (const k of ['settings', 'nodes', 'ledger', 'session', 'timing']) if (s[k] !== undefined && !isObject(s[k])) throw new Error(`${k} is not an object`);
    const base = emptyState(s.createdAt ?? Date.now());
    s.settings = { ...base.settings, ...(s.settings ?? {}) };
    delete s.settings.minutes; // retired: session minutes come from band and tier
    // retired as a choice: learners do not pick the length of the day. A tier an earlier build saved from
    // its Settings screen stays in the document but is ignored, so nobody is held to a short day with no way back.
    s.settings.tier = DEFAULT_SETTINGS.tier;
    s.nodes ??= {};
    s.ledger = { ...base.ledger, ...(s.ledger ?? {}) };
    s.session = { ...base.session, ...(s.session ?? {}) };
    s.timing = { ...base.timing, ...(s.timing ?? {}) };
    s.createdAt ??= base.createdAt;
  } catch (e) {
    throw new StoredDocumentError('unreadable', 'state', (e as Error).message);
  }
  return s;
}

/** Local calendar day, shifted so that 01:00 still counts as "yesterday". */
export function dayKey(at: number, rolloverHour = DEFAULT_SETTINGS.rolloverHour): string {
  const d = new Date(at - rolloverHour * 3_600_000);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
