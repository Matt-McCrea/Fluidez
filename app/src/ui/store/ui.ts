// The UI's own persistence, beside the learner document. LearnerState has no
// slot for the course path, so the path lives under its own key ("path") in
// the same IndexedDB object store as the learner ("state"); the profile and
// the learner-facing tallies (sessions, words read/written, practice days,
// saved words, can-do self-checks) live under "ui". Both are plain JSON.
import { initialPath, type PathState } from '../../compiler';
import { idbKV, type KV } from '../../learner';

export const PATH_KEY = 'path';
export const UI_KEY = 'ui';

export type Goal = 'travel' | 'work' | 'people' | 'me';

export interface SavedWord { es: string; en: string; at: number; chapter?: string }
export interface CanDoMark { unit: string; canDo: string; feel: 'yes' | 'mostly' | 'notyet'; at: number }

export interface UiState {
  version: 1;
  learnerId: string;
  onboarded: boolean;
  goal?: Goal;
  /** unit index the placement chose (0 = from zero) */
  placedAt?: number;
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
}

export function emptyUi(learnerId = newId()): UiState {
  return {
    version: 1, learnerId, onboarded: false,
    stats: { sessions: 0, wordsRead: 0, wordsWritten: 0, days: [], today: 0 },
    saved: [], canDos: [], readSeconds: {},
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
}

export class UiStore {
  state: UiState = emptyUi();
  path: PathState = initialPath();
  private listeners = new Set<() => void>();

  constructor(readonly kv: KV = idbKV()) {}

  async load(): Promise<this> {
    const [ui, path] = await Promise.all([this.kv.get(UI_KEY), this.kv.get(PATH_KEY)]);
    if (ui && typeof ui === 'object' && (ui as UiState).version === 1) {
      const base = emptyUi((ui as UiState).learnerId);
      this.state = { ...base, ...(ui as UiState), stats: { ...base.stats, ...(ui as UiState).stats } };
    } else {
      this.state = emptyUi();
      await this.kv.set(UI_KEY, this.state);
    }
    if (path && typeof path === 'object' && (path as PathState).version === 1) this.path = path as PathState;
    return this;
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
