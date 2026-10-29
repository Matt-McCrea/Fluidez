// Persistence for the learner. The whole LearnerState is one versioned JSON
// document under one key; Learner.open() migrates whatever it loads.
import { createStore, del, get, set, setMany } from 'idb-keyval';
import type { EventLog } from './events';
import type { LearnerState } from './state';

export interface LearnerStore {
  /** The stored document, unmigrated, or undefined if there is none. */
  load(): Promise<unknown | undefined>;
  save(state: LearnerState): Promise<void>;
  clear(): Promise<void>;
  /** The review event log (kept apart from the state document), unvalidated, or undefined. */
  loadEvents?(): Promise<unknown | undefined>;
  saveEvents?(log: EventLog): Promise<void>;
  /** Write every provided document in ONE transaction: all land or none do. */
  saveAll?(docs: SaveAll): Promise<void>;
}

/** The documents a session save may carry. `path` and `ui` are owned by the UI store. */
export interface SaveAll { state?: LearnerState; events?: EventLog; path?: unknown; ui?: unknown }

/** For tests and the simulator. Stores a structured clone, like IndexedDB does. */
export class MemoryStore implements LearnerStore {
  private doc: unknown | undefined;
  saves = 0;
  constructor(initial?: unknown) { this.doc = initial === undefined ? undefined : structuredClone(initial); }
  async load() { return this.doc === undefined ? undefined : structuredClone(this.doc); }
  async save(state: LearnerState) { this.doc = structuredClone(state); this.saves += 1; }
  private evs: unknown | undefined;
  eventSaves = 0;
  async loadEvents() { return this.evs === undefined ? undefined : structuredClone(this.evs); }
  async saveEvents(log: EventLog) { this.evs = structuredClone(log); this.eventSaves += 1; }
  /** Path and ui documents written through saveAll, by key. */
  readonly extras = new Map<string, unknown>();
  async saveAll(d: SaveAll) {
    // Stage everything first, then commit: nothing is applied if a clone throws.
    const state = d.state && structuredClone(d.state);
    const events = d.events && structuredClone(d.events);
    const path = d.path !== undefined ? structuredClone(d.path) : undefined;
    const ui = d.ui !== undefined ? structuredClone(d.ui) : undefined;
    if (state) { this.doc = state; this.saves += 1; }
    if (events) { this.evs = events; this.eventSaves += 1; }
    if (path !== undefined) this.extras.set('path', path);
    if (ui !== undefined) this.extras.set('ui', ui);
  }
  async clear() { this.doc = undefined; this.evs = undefined; this.extras.clear(); }
  /** What a JSON export of the stored document would contain. */
  snapshot(): unknown { return this.doc === undefined ? undefined : JSON.parse(JSON.stringify(this.doc)); }
}

/** The minimal key-value surface IdbStore needs; idb-keyval by default. */
export interface KV {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  /** Atomic multi-key write (one transaction). Absent: callers fall back to sequential sets. */
  setMany?(entries: [string, unknown][]): Promise<void>;
}

export const IDB_DB = 'fluidez';
export const IDB_OBJECT_STORE = 'learner';
export const IDB_KEY = 'state';
export const IDB_EVENTS_KEY = 'events';
export const IDB_PATH_KEY = 'path';
export const IDB_UI_KEY = 'ui';

export function idbKV(db = IDB_DB, objectStore = IDB_OBJECT_STORE): KV {
  const s = createStore(db, objectStore);
  return { get: (k) => get(k, s), set: (k, v) => set(k, v, s), del: (k) => del(k, s), setMany: (e) => setMany(e, s) };
}

/** The browser store. Keeps the previous document under `state.prev` as a one-step backup. */
export class IdbStore implements LearnerStore {
  constructor(readonly kv: KV = idbKV(), private readonly key = IDB_KEY, private readonly eventsKey = IDB_EVENTS_KEY) {}
  async loadEvents() { return (await this.kv.get(this.eventsKey)) ?? undefined; }
  async saveEvents(log: EventLog) { await this.kv.set(this.eventsKey, log); }
  async load() {
    const doc = await this.kv.get(this.key);
    return doc ?? (await this.kv.get(`${this.key}.prev`)) ?? undefined;
  }
  async save(state: LearnerState) {
    const prev = await this.kv.get(this.key);
    if (prev !== undefined) await this.kv.set(`${this.key}.prev`, prev);
    await this.kv.set(this.key, state);
  }
  /** One transaction for every provided document; the state's one-step backup is written in the same transaction. */
  async saveAll(d: SaveAll) {
    const entries: [string, unknown][] = [];
    if (d.state) {
      const prev = await this.kv.get(this.key);
      if (prev !== undefined) entries.push([`${this.key}.prev`, prev]);
      entries.push([this.key, d.state]);
    }
    if (d.events) entries.push([this.eventsKey, d.events]);
    if (d.path !== undefined) entries.push([IDB_PATH_KEY, d.path]);
    if (d.ui !== undefined) entries.push([IDB_UI_KEY, d.ui]);
    if (!entries.length) return;
    if (this.kv.setMany) await this.kv.setMany(entries);
    else for (const [k, v] of entries) await this.kv.set(k, v);
  }
  async clear() { await this.kv.del(this.key); await this.kv.del(`${this.key}.prev`); await this.kv.del(this.eventsKey); }
}
