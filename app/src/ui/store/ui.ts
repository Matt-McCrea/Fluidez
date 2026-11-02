// The UI's own persistence, beside the learner document. LearnerState has no
// slot for the course path, so the path lives under its own key ("path") in
// the same IndexedDB object store as the learner ("state"); the profile and
// the learner-facing tallies (sessions, words read/written, practice days,
// saved words, can-do self-checks) live under "ui". Both are plain JSON.
import { initialPath, type Mode, type PathState, type SessionPlan } from '../../compiler';
import { idbKV, StoredDocumentError, type KV, type Learner, type Tier } from '../../learner';
import { LEARNER_READERS, type BackupReaders } from '../../learner/backup';
import type { LearnQueueJSON } from '../session/order';
import type { RunnerSnapshot } from '../session/runner';
import { Keep, readWriting, WRITING_KEY } from './keep';

export const PATH_KEY = 'path';
export const UI_KEY = 'ui';
export const SESSION_KEY = 'session';
export const UI_VERSION = 3;
export const PATH_VERSION = 2;

export type Goal = 'travel' | 'work' | 'people' | 'me';

export interface SavedWord { es: string; en: string; at: number; chapter?: string }
export interface CanDoMark { unit: string; canDo: string; feel: 'yes' | 'mostly' | 'notyet'; at: number }

export type RubricAnswer = 'yes' | 'mostly' | 'notyet';
/** The learner's own marks on one finished writing task. */
export interface WritingMark { at: number; rubric: RubricAnswer[]; words: number; met: number; of: number }

/** One finished checkpoint: when, and right-first-time per finished unit. */
export interface CheckpointResult { at: number; byUnit: Record<string, { right: number; total: number }> }

export interface UiState {
  version: 3;
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
    /** day key of the last "only five minutes" session: it keeps the streak but not the day's lesson */
    quickToday?: string;
  };
  saved: SavedWord[];
  canDos: CanDoMark[];
  /** first-read seconds per chapter, so a fluency re-read can show "beat your first time" */
  readSeconds: Record<string, number>;
  /** the last finished attempt per writing task: self-rubric, words, checklist items met */
  writing: Record<string, WritingMark>;
  /** personal bests in free practice, by spec key (right first time in one timed run) */
  bests: Record<string, number>;
  /** words read and written per local day, the last 14 days kept (the week's totals come from here) */
  weekly: Record<string, { read: number; written: number }>;
  /** results of the any-time checkpoint, oldest first */
  checkpoints: CheckpointResult[];
  /** days off the streak can absorb; one is earned per 7 days in a row, at most 2 held */
  freezes: number;
  /** day key a freeze was last used (the day of the session that followed the missed day) */
  freezeUsedOn?: string;
  /** missed days a freeze covered; they bridge the streak without counting as practice */
  frozenDays: string[];
  /** practice days in the current run, counting toward the next freeze */
  streakRun: number;
}

export const MAX_FREEZES = 2;
export const FREEZE_EVERY = 7;

export function emptyUi(learnerId = newId()): UiState {
  return {
    version: UI_VERSION, learnerId, onboarded: false,
    stats: { sessions: 0, wordsRead: 0, wordsWritten: 0, days: [], today: 0 },
    saved: [], canDos: [], readSeconds: {}, writing: {}, bests: {},
    weekly: {}, checkpoints: [], freezes: 1, frozenDays: [], streakRun: 0,
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
  async keys() { return [...this.data.keys()]; }
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
  // 2 -> 3: checkpoint results.
  2: (s) => ({ ...s, version: 3, checkpoints: [] }),
};
export const PATH_MIGRATIONS: Record<number, (s: any) => any> = {
  0: (s) => ({ ...s, version: 1 }),
  1: (s) => ({ ...s, version: 2 }),
};

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

function upgrade(raw: unknown, name: string, latest: number, table: Record<number, (s: any) => any>): any {
  if (!isObject(raw)) throw new StoredDocumentError('unreadable', name, 'not an object');
  let s: any = structuredClone(raw);
  let v: number = typeof s.version === 'number' ? s.version : 0;
  if (v > latest) throw new StoredDocumentError('newer', name, `v${v} is newer than this build (v${latest})`);
  try {
    while (v < latest) {
      const step = table[v];
      if (!step) throw new Error(`no migration from v${v}`);
      s = step(s);
      v = s.version;
    }
  } catch (e) {
    throw new StoredDocumentError('unreadable', name, (e as Error).message);
  }
  return s;
}

/** The lists and tables the screens walk: if one is not one, the document is damaged. */
const UI_LISTS = ['saved', 'canDos', 'checkpoints', 'frozenDays'] as const;
const UI_TABLES = ['readSeconds', 'writing', 'bests', 'weekly'] as const;
const PATH_LISTS = ['owedNew', 'owedGrammar', 'pendingDrills', 'recentGrammar', 'remediate', 'log'] as const;

const openUi = (s: any, base: UiState): UiState => ({ ...base, ...s, stats: { ...base.stats, ...(isObject(s.stats) ? s.stats : {}) } });
const idOf = (s: any): string | undefined => (typeof s.learnerId === 'string' && s.learnerId ? s.learnerId : undefined);

/** Upgrade a stored ui document. Keeps the learnerId it has; only a document with none gets a new one. */
export function migrateUi(raw: unknown): UiState {
  const s = upgrade(raw, 'ui', UI_VERSION, UI_MIGRATIONS);
  const ui = openUi(s, emptyUi(idOf(s)));
  const bad = UI_LISTS.find((k) => !Array.isArray(ui[k])) ?? UI_TABLES.find((k) => !isObject(ui[k])) ?? (Array.isArray(ui.stats.days) ? undefined : 'stats.days');
  if (bad) throw new StoredDocumentError('unreadable', 'ui', `${bad} is the wrong shape`);
  return ui;
}

/**
 * Boot's reader for a ui document `migrateUi` refused. There is no older copy of
 * this document, and a tally must not keep a learner out of the state beside
 * it: a list or table that is the wrong shape starts empty and the rest is
 * kept. What throws here (a newer document, one that is not a document) is
 * refused for good. The caller keeps the damaged document aside first.
 */
export function salvageUi(raw: unknown): UiState {
  const s = upgrade(raw, 'ui', UI_VERSION, UI_MIGRATIONS);
  const base = emptyUi(idOf(s));
  const ui: any = openUi(s, base);
  for (const k of UI_LISTS) if (!Array.isArray(ui[k])) ui[k] = base[k];
  for (const k of UI_TABLES) if (!isObject(ui[k])) ui[k] = base[k];
  if (!Array.isArray(ui.stats.days)) ui.stats.days = base.stats.days;
  return ui;
}

const positionOk = (p: PathState) => Number.isFinite(p.unit) && Number.isFinite(p.day) && Number.isFinite(p.coreSessions);

export function migratePath(raw: unknown): PathState {
  const s = upgrade(raw, 'path', PATH_VERSION, PATH_MIGRATIONS);
  const path: PathState = { ...initialPath(), ...s };
  const bad = PATH_LISTS.find((k) => !Array.isArray(path[k])) ?? (positionOk(path) ? undefined : 'position');
  if (bad) throw new StoredDocumentError('unreadable', 'path', `${bad} is the wrong shape`);
  return path;
}

/**
 * As `salvageUi`, for the path. Its lists can start empty. Its position cannot
 * be guessed: a learner silently sent back to the start is worse than being told.
 */
export function salvagePath(raw: unknown): PathState {
  const s = upgrade(raw, 'path', PATH_VERSION, PATH_MIGRATIONS);
  const base = initialPath();
  const path: any = { ...base, ...s };
  for (const k of PATH_LISTS) if (!Array.isArray(path[k])) path[k] = base[k];
  if (!positionOk(path)) throw new StoredDocumentError('unreadable', 'path', 'position is the wrong shape');
  return path;
}

/**
 * The documents a backup carries: the learner's and the UI's, each with the
 * reader that opens it the way boot does. The allowlist is these keys. A new
 * document (games) is one more entry here.
 */
export const BACKUP_READERS: BackupReaders = { ...LEARNER_READERS, [PATH_KEY]: migratePath, [UI_KEY]: migrateUi, [WRITING_KEY]: readWriting };

/** Where a half-finished session stands: enough to open the same plan at the same card. Lives under its own key, outside UiState. */
export interface SavedSession {
  version: 1;
  learnerId: string;
  sessionIndex: number;
  mode: Mode;
  tier?: Tier;
  capMinutes: number;
  startedAt: number;
  elapsedMs: number;
  savedAt: number;
  plan: SessionPlan;
  block: number;
  cursor: { card?: number; phase?: number; learn?: LearnQueueJSON };
  runner: RunnerSnapshot;
}

/** A saved session is worth picking up on the same day, within a few hours, for this learner, if the learner has not moved on. */
export const RESUME_WINDOW_MS = 3 * 3_600_000;
export function isResumable(saved: SavedSession | undefined, learner: Pick<Learner, 'sessionIndex' | 'day'>, now: number, learnerId: string): saved is SavedSession {
  if (!saved || saved.version !== 1) return false;
  if (saved.learnerId !== learnerId) return false;
  if (saved.sessionIndex !== learner.sessionIndex) return false;
  if (learner.day(saved.savedAt) !== learner.day(now)) return false;
  const age = now - saved.savedAt;
  return age >= 0 && age < RESUME_WINDOW_MS;
}

export class UiStore {
  state: UiState = emptyUi();
  session?: SavedSession;
  path: PathState = initialPath();
  private listeners = new Set<() => void>();
  /** what the learner makes, kept in documents of their own (see keep.ts) */
  readonly keep: Keep;

  constructor(readonly kv: KV = idbKV()) { this.keep = new Keep(kv); }

  /**
   * Load and migrate. A missing document is a fresh start; a document that
   * cannot be migrated (newer version, malformed) is copied to `<key>.quarantine`
   * first. A list or table in it that is the wrong shape then starts empty; a
   * document with more wrong than that throws a StoredDocumentError, so a learner
   * is never silently replaced by a new one and the document itself is never
   * written over. Before a document is migrated, it is copied once to
   * `<key>.v<its version>`.
   */
  async load(): Promise<this> {
    const [ui, path, session] = await Promise.all([this.kv.get(UI_KEY), this.kv.get(PATH_KEY), this.kv.get(SESSION_KEY)]);
    this.session = session && typeof session === 'object' && (session as SavedSession).version === 1 ? (session as SavedSession) : undefined;
    if (ui === undefined || ui === null) {
      this.state = emptyUi();
      await this.writeBack(UI_KEY, this.state);
    } else {
      let healed = false;
      try { this.state = migrateUi(ui); } catch {
        await this.quarantine(UI_KEY, ui);
        this.state = salvageUi(ui);
        healed = true;
      }
      if (healed) await this.writeBack(UI_KEY, this.state);
      else if ((ui as any).version !== UI_VERSION) { await this.keepVersion(UI_KEY, ui); await this.writeBack(UI_KEY, this.state); }
    }
    if (path !== undefined && path !== null) {
      let healed = false;
      try { this.path = migratePath(path); } catch {
        await this.quarantine(PATH_KEY, path);
        this.path = salvagePath(path);
        healed = true;
      }
      if (healed) await this.writeBack(PATH_KEY, this.path);
      else if ((path as any).version !== PATH_VERSION) { await this.keepVersion(PATH_KEY, path); await this.writeBack(PATH_KEY, this.path); }
    }
    return this;
  }

  /** Put a document opened with changes back. A refused write must not keep a readable learner out: the next save writes it. */
  private async writeBack(key: string, doc: unknown): Promise<void> {
    try { await this.kv.set(key, doc); } catch (e) { console.warn(`fluidez: could not write ${key} back`, e); }
  }

  async saveSession(s: SavedSession): Promise<void> {
    this.session = s;
    await this.kv.set(SESSION_KEY, s);
  }

  async clearSession(): Promise<void> {
    if (!this.session) return;
    this.session = undefined;
    this.emit();
    await this.kv.del(SESSION_KEY);
  }

  private async quarantine(key: string, raw: unknown): Promise<void> {
    try { await this.kv.set(`${key}.quarantine`, raw); } catch { /* best effort */ }
  }

  /** Copy a document as it was, once per version, before it is migrated. Best effort: a copy that cannot be kept does not stop the migration. */
  private async keepVersion(key: string, raw: unknown): Promise<void> {
    const v = (raw as { version?: unknown }).version;
    const name = `${key}.v${typeof v === 'number' ? v : 0}`;
    try { if ((await this.kv.get(name)) === undefined) await this.kv.set(name, raw); } catch (e) { console.warn(`fluidez: could not keep a copy of ${key} before migrating it`, e); }
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
    await this.writeBack(PATH_KEY, this.path);
    return true;
  }

  /**
   * The end-of-session save: the new path, the session tally and the learner
   * state with its event log, in one transaction when the learner store shares
   * this KV (the browser), otherwise path and ui in one write and then the learner.
   */
  async commitSession(learner: Learner, path: PathState, day: string, opts: { quick?: boolean } = {}): Promise<void> {
    const before = { path: this.path, state: this.state };
    this.path = structuredClone(path);
    const next = structuredClone(this.state);
    applyStreak(next, day);
    next.stats.sessions += 1;
    if (opts.quick) next.stats.quickToday = day;
    else {
      next.stats.today = next.stats.lastDay === day ? next.stats.today + 1 : 1;
      next.stats.lastDay = day;
    }
    this.state = next;
    this.emit();
    const shared = (learner.backing as { kv?: KV } | null)?.kv === this.kv;
    try {
      if (shared) await learner.commit({ path: this.path, ui: this.state });
      else {
        await this.writeBoth();
        await learner.flush();
      }
    } catch (e) {
      // refused: the close did not happen, so the documents go back. The resume
      // point stays, the learner keeps retrying its own document, and trying the
      // close again counts it once. A closed path must never reach the disk on
      // its own: beside a live resume point it would advance the course twice.
      this.path = before.path;
      this.state = before.state;
      this.emit();
      throw e;
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
    const read = next.stats.wordsRead, written = next.stats.wordsWritten;
    fn(next);
    const dr = next.stats.wordsRead - read, dw = next.stats.wordsWritten - written;
    if (dr > 0 || dw > 0) addDatedWords(next, localDayKey(Date.now()), Math.max(0, dr), Math.max(0, dw));
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
      applyStreak(s, day);
      s.stats.sessions += 1;
      s.stats.today = s.stats.lastDay === day ? s.stats.today + 1 : 1;
      s.stats.lastDay = day;
    });
  }

  /** Everything, gone: learner, path and UI state. */
  async reset(extraKeys: string[] = []): Promise<void> {
    // the copies kept beside the documents (quarantine, version snapshots) go too: this promises everything is deleted
    const own = [UI_KEY, PATH_KEY, SESSION_KEY, WRITING_KEY];
    const copies = ((await this.kv.keys?.()) ?? []).filter((k) => own.some((n) => k.startsWith(`${n}.`)));
    for (const k of [...own, ...extraKeys, ...copies]) await this.kv.del(k);
    this.session = undefined;
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

const pad = (n: number) => String(n).padStart(2, '0');
export const localDayKey = (at: number): string => { const t = new Date(at); return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`; };
const dayNum = (k: string): number => { const [y, m, d] = k.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86_400_000); };

/** Add words to a day's bucket in place; buckets older than 14 days are dropped. */
function addDatedWords(s: UiState, day: string, read: number, written: number): void {
  const w = (s.weekly ??= {});
  const cur = w[day] ?? { read: 0, written: 0 };
  w[day] = { read: cur.read + read, written: cur.written + written };
  for (const k of Object.keys(w)) if (dayNum(day) - dayNum(k) > 14) delete w[k];
}

/**
 * Record a finished session on `today` in the streak fields (days, frozenDays,
 * freezes, freezeUsedOn, streakRun), in place; returns the same object. A gap
 * of missed days no longer than the freezes held is bridged and the freezes are
 * used up; a longer gap starts the run again. One freeze is earned each time
 * the run reaches a multiple of 7 days, up to 2 held. Reviews are never
 * touched. A second session on the same day changes nothing.
 */
export function applyStreak<T extends Pick<UiState, 'freezes' | 'freezeUsedOn' | 'frozenDays' | 'streakRun'> & { stats: { days: string[] } }>(ui: T, today: string): T {
  ui.freezes = typeof ui.freezes === 'number' ? ui.freezes : 1;
  ui.frozenDays ??= [];
  ui.streakRun ??= 0;
  const days = ui.stats.days;
  if (days.includes(today)) return ui;
  const last = days.length ? days[days.length - 1] : undefined;
  const gap = last === undefined ? 0 : dayNum(today) - dayNum(last) - 1;
  if (last === undefined || gap < 0) ui.streakRun = 1;
  else if (gap === 0) ui.streakRun += 1;
  else if (gap <= ui.freezes) {
    ui.freezes -= gap;
    ui.freezeUsedOn = today;
    for (let i = 1; i <= gap; i++) ui.frozenDays = [...ui.frozenDays, dayKeyFromNum(dayNum(last) + i)];
    ui.streakRun += 1;
  } else ui.streakRun = 1;
  if (ui.streakRun > 0 && ui.streakRun % FREEZE_EVERY === 0) ui.freezes = Math.min(MAX_FREEZES, ui.freezes + 1);
  ui.stats.days = [...days, today].sort();
  if (ui.frozenDays.length > 30) ui.frozenDays = ui.frozenDays.slice(-30);
  return ui;
}

function dayKeyFromNum(n: number): string {
  const t = new Date(n * 86_400_000);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/**
 * What Home shows about the streak on `today`: the length (a day covered by a
 * freeze bridges but does not count), whether a freeze kept it going, and
 * whether a day off is waiting to be covered by one.
 */
export function streakStatus(ui: Pick<UiState, 'freezes' | 'freezeUsedOn' | 'frozenDays'> & { stats: { days: string[] } }, today: string): { days: number; keptWithDayOff: boolean; freezes: number } {
  const frozen = new Set(ui.frozenDays ?? []);
  const set = new Set(ui.stats.days);
  const last = ui.stats.days[ui.stats.days.length - 1];
  const freezes = typeof ui.freezes === 'number' ? ui.freezes : 1;
  let cur = today;
  if (!set.has(cur)) cur = dayKeyFromNum(dayNum(today) - 1);
  // missed days not yet absorbed: a freeze will cover them when the next session finishes
  if (last !== undefined && !set.has(today)) {
    const gap = dayNum(today) - dayNum(last) - 1;
    if (gap >= 1 && gap <= freezes) cur = last;
  }
  let n = 0;
  for (;;) {
    if (set.has(cur)) n++;
    else if (!frozen.has(cur)) break;
    cur = dayKeyFromNum(dayNum(cur) - 1);
  }
  return { days: n, keptWithDayOff: ui.freezeUsedOn === today, freezes };
}
