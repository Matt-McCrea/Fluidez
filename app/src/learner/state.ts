// The learner's whole state as one plain-JSON document. Nothing here holds a
// Date or a class instance: timestamps are epoch milliseconds, so the state
// survives JSON, structuredClone and IndexedDB unchanged. The Learner class
// (learner.ts) is the only code that mutates it; LearnerStore persists it.
import type { NodeId } from '../content/schema';

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
  /** the standing daily lesson size; session minutes come from this and the band (compiler/budget.ts) */
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

export function migrate(raw: unknown): LearnerState {
  if (!raw || typeof raw !== 'object') throw new Error('learner state: not an object');
  let s: any = structuredClone(raw);
  let v: number = typeof s.version === 'number' ? s.version : 0;
  if (v > STATE_VERSION) throw new Error(`learner state v${v} is newer than this build (v${STATE_VERSION})`);
  while (v < STATE_VERSION) {
    const step = MIGRATIONS[v];
    if (!step) throw new Error(`learner state: no migration from v${v}`);
    s = step(s);
    v = s.version;
  }
  // Fill anything a partial/older document lacks, without dropping what it has.
  const base = emptyState(s.createdAt ?? Date.now());
  s.settings = { ...base.settings, ...(s.settings ?? {}) };
  delete s.settings.minutes; // retired: session minutes come from band and tier
  s.nodes ??= {};
  s.ledger = { ...base.ledger, ...(s.ledger ?? {}) };
  s.session = { ...base.session, ...(s.session ?? {}) };
  s.timing = { ...base.timing, ...(s.timing ?? {}) };
  s.createdAt ??= base.createdAt;
  return s as LearnerState;
}

/** Local calendar day, shifted so that 01:00 still counts as "yesterday". */
export function dayKey(at: number, rolloverHour = DEFAULT_SETTINGS.rolloverHour): string {
  const d = new Date(at - rolloverHour * 3_600_000);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
