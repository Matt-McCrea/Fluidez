// The UI's own persistence, beside the learner document. LearnerState has no
// slot for the course path, so the path lives under its own key ("path") in
// the same IndexedDB object store as the learner ("state"); the profile and
// the learner-facing tallies (sessions, words read/written, practice days,
// saved words, can-do self-checks) live under "ui". Both are plain JSON.
import { initialPath, type PathState } from '../../compiler';
import { idbKV, type KV, type Learner } from '../../learner';

export const PATH_KEY = 'path';
export const UI_KEY = 'ui';
export const UI_VERSION = 2;
export const PATH_VERSION = 2;

export type Goal = 'travel' | 'work' | 'people' | 'me';

export interface SavedWord { es: string; en: string; at: number; chapter?: string }
export interface CanDoMark { unit: string; canDo: string; feel: 'yes' | 'mostly' | 'notyet'; at: number }

export type RubricAnswer = 'yes' | 'mostly' | 'notyet';
/** The learner's own marks on one finished writing task. */
export interface WritingMark { at: number; rubric: RubricAnswer[]; words: number; met: number; of: number }

export interface UiState {
  version: 2;
  learnerId: string;
  onboarded: boolean;
  goal?: Goal;
  /** unit index the placement chose (0 = from zero) */
  placedAt?: number;
  /** day key the close screen last suggested a few more minutes */
  moreOfferedOn?: string;
  stats: {
    sessions: number;
    wordsRead: number;
    wordsWritten: number;
    /** local day keys (learner.day()) with at least one finished session, sorted */
    days: string[];
    /** day key of the last finished session, and how many finished that day */
    lastDay?: string;
    today: number;
  };
  saved: SavedWord[];
  canDos: CanDoMark[];
  /** first-read seconds per chapter, so a fluency re-read can show "beat your first time" */
  readSeconds: Record<string, number>;
  /** the last finished attempt per writing task: self-rubric, words, checklist items met */
  writing: Record<string, WritingMark>;
  /** personal bests in free practice, by spec key (right first time in one timed run) */
  bests: Record<string, number>;
}

export function emptyUi(learnerId = newId()): UiState {
  return {
    version: UI_VERSION, learnerId, onboarded: false,
    stats: { sessions: 0, wordsRead: 0, wordsWritten: 0, days: [], today: 0 },
    saved: [], canDos: [], readSeconds: {}, writing: {}, bests: {},
  };
}

function newId(): string {
  try { return globalThis.crypto.randomUUID(); } catch { return `l-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
}

/** In-memory KV for tests. */
export class MemoryKV implements KV {
  readonly data = new Map<string, unknown>();
  async get(k: string) { const v = this.data.get(k); return v === undefined ? undefined : structuredClone(v); }
  async set(k: string, v: unknown) { this.data.set(k, structuredClone(v)); }
  async del(k: string) { this.data.delete(k); }
  async setMany(entries: [string, unknown][]) {
    const staged = entries.map(([k, v]) => [k, structuredClone(v)] as const);
    for (const [k, v] of staged) this.data.set(k, v);
  }
}

/**
 * Migration tables, same policy as the learner state: MIGRATIONS[n] turns a
 * version-n document into n+1; a version newer than this build throws; a
 * document with no version is v0. Never edit a shipped migration.
 */
export const UI_MIGRATIONS: Record<number, (s: any) => any> = {
  0: (s) => ({ ...s, version: 1 }),
  // 1 -> 2: no-op, introduces the mechanism.
  1: (s) => ({ ...s, version: 2 }),
};
export const PATH_MIGRATIONS: Record<number, (s: any) => any> = {
  0: (s) => ({ ...s, version: 1 }),
  1: (s) => ({ ...s, version: 2 }),
};

function upgrade(raw: unknown, name: string, latest: number, table: Record<number, (s: any) => any>): any {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error(`${name}: not an object`);
  let s: any = structuredClone(raw);
  let v: number = typeof s.version === 'number' ? s.version : 0;
  if (v > latest) throw new Error(`${name} v${v} is newer than this build (v${latest})`);
  while (v < latest) {
    const step = table[v];
    if (!step) throw new Error(`${name}: no migration from v${v}`);
    s = step(s);
    v = s.version;
  }
  return s;
}

/** Upgrade a stored ui document. Keeps the learnerId it has; only a document with none gets a new one. */
export function migrateUi(raw: unknown): UiState {
  const s = upgrade(raw, 'ui state', UI_VERSION, UI_MIGRATIONS);
  const base = emptyUi(typeof s.learnerId === 'string' && s.learnerId ? s.learnerId : undefined);
  return { ...base, ...s, stats: { ...base.stats, ...(s.stats ?? {}) } };
}

export function migratePath(raw: unknown): PathState {
  const s = upgrade(raw, 'path state', PATH_VERSION, PATH_MIGRATIONS);
  return { ...initialPath(), ...s };
}

export class UiStore {
  state: UiState = emptyUi();
  path: PathState = initialPath();
  private listeners = new Set<() => void>();

  constructor(readonly kv: KV = idbKV()) {}

  /**
   * Load and migrate. A missing document is a fresh start; a document that
   * cannot be migrated (newer version, malformed) is copied to `<key>.quarantine`
   * and the load throws, so a learner is never silently replaced by a new one.
   */
  async load(): Promise<this> {
    const [ui, path] = await Promise.all([this.kv.get(UI_KEY), this.kv.get(PATH_KEY)]);
    if (ui === undefined || ui === null) {
      this.state = emptyUi();
      await this.kv.set(UI_KEY, this.state);
    } else {
      try { this.state = migrateUi(ui); } catch (e) { await this.quarantine(UI_KEY, ui); throw e; }
      if ((ui as any).version !== UI_VERSION) await this.kv.set(UI_KEY, this.state);
    }
    if (path !== undefined && path !== null) {
      try { this.path = migratePath(path); } catch (e) { await this.quarantine(PATH_KEY, path); throw e; }
      if ((path as any).version !== PATH_VERSION) await this.kv.set(PATH_KEY, this.path);
    }
    return this;
  }

  private async quarantine(key: string, raw: unknown): Promise<void> {
    try { await this.kv.set(`${key}.quarantine`, raw); } catch { /* best effort */ }
  }

  /**
   * Half-save repair. The learner state is the memory model and wins. Session
   * saves are one transaction now, so a mismatch means an older build (or a
   * crash between its two writes). Rule: every path log entry with
   * learnerSession > the learner's session index describes a session the
   * learner never recorded; drop those entries and take back the core
   * sessions they counted. The unit/day position is left alone (it cannot be
   * rewound exactly). A path that is merely behind the learner is only
   * reported. Returns true if the path was changed (and saved).
   */
  async reconcile(learnerSession: number): Promise<boolean> {
    const log = this.path.log;
    const keep = log.filter((e) => e.learnerSession <= learnerSession);
    if (keep.length === log.length) {
      const last = log[log.length - 1];
      if (last && last.learnerSession < learnerSession) console.warn(`fluidez: path log ends at session ${last.learnerSession}, learner is at ${learnerSession}`);
      return false;
    }
    const dropped = log.filter((e) => e.learnerSession > learnerSession);
    const core = dropped.filter((e) => e.coreSession !== undefined).length;
    console.warn(`fluidez: path was ahead of the learner (${dropped.length} session(s) past ${learnerSession}); trimming to the learner`);
    this.path = { ...this.path, log: keep, coreSessions: Math.max(0, this.path.coreSessions - core) };
    this.emit();
    await this.kv.set(PATH_KEY, this.path);
    return true;
  }

  /**
   * The end-of-session save: the new path, the session tally and the learner
   * state with its event log, in one transaction when the learner store shares
   * this KV (the browser), otherwise path and ui in one write and then the learner.
   */
  async commitSession(learner: Learner, path: PathState, day: string): Promise<void> {
    this.path = structuredClone(path);
    const next = structuredClone(this.state);
    next.stats.sessions += 1;
    if (!next.stats.days.includes(day)) next.stats.days = [...next.stats.days, day].sort();
    next.stats.today = next.stats.lastDay === day ? next.stats.today + 1 : 1;
    next.stats.lastDay = day;
    this.state = next;
    this.emit();
    const shared = (learner.backing as { kv?: KV } | null)?.kv === this.kv;
    if (shared) await learner.commit({ path: this.path, ui: this.state });
    else {
      await this.writeBoth();
      await learner.flush();
    }
  }

  private async writeBoth(): Promise<void> {
    const entries: [string, unknown][] = [[PATH_KEY, this.path], [UI_KEY, this.state]];
    if (this.kv.setMany) await this.kv.setMany(entries);
    else for (const [k, v] of entries) await this.kv.set(k, v);
  }

  subscribe(fn: () => void): () => void { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  private emit() { for (const f of this.listeners) f(); }

  async update(fn: (s: UiState) => void): Promise<void> {
    const next = structuredClone(this.state);
    fn(next);
    this.state = next;
    this.emit();
    await this.kv.set(UI_KEY, this.state);
  }

  async setPath(p: PathState): Promise<void> {
    this.path = structuredClone(p);
    this.emit();
    await this.kv.set(PATH_KEY, this.path);
  }

  /** Record a finished session on `day` (a learner.day() key). */
  async sessionFinished(day: string): Promise<void> {
    await this.update((s) => {
      s.stats.sessions += 1;
      if (!s.stats.days.includes(day)) s.stats.days = [...s.stats.days, day].sort();
      s.stats.today = s.stats.lastDay === day ? s.stats.today + 1 : 1;
      s.stats.lastDay = day;
    });
  }

  /** Everything, gone: learner, path and UI state. */
  async reset(extraKeys: string[] = []): Promise<void> {
    for (const k of [UI_KEY, PATH_KEY, ...extraKeys]) await this.kv.del(k);
    this.state = emptyUi();
    this.path = initialPath();
    this.emit();
  }
}

/** Days practised in a row, ending today or yesterday (a streak is only broken by a full missed day). */
export function streak(days: readonly string[], today: string): number {
  if (!days.length) return 0;
  const set = new Set(days);
  const prev = (k: string) => {
    const [y, m, d] = k.split('-').map(Number);
    const t = new Date(y, m - 1, d - 1);
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  };
  let cur = set.has(today) ? today : prev(today);
  let n = 0;
  while (set.has(cur)) { n++; cur = prev(cur); }
  return n;
}
