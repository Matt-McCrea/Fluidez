// Persistence for the learner. The whole LearnerState is one versioned JSON
// document under one key; Learner.open() migrates whatever it loads.
import { createStore, del, get, keys, set, setMany } from 'idb-keyval';
import type { AttemptLog } from './attempts';
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
  /** The attempts log (what was typed, kept apart from the events), unvalidated, or undefined. */
  loadAttempts?(): Promise<unknown | undefined>;
  saveAttempts?(log: AttemptLog): Promise<void>;
  /** Write every provided document in ONE transaction: all land or none do. */
  saveAll?(docs: SaveAll): Promise<void>;
  /** The state's one-step backup (the document before the last save), unmigrated, or undefined. */
  loadPrevious?(): Promise<unknown | undefined>;
  /** Keep a copy of a document that could not be read, beside it. Best effort: never throws. */
  quarantine?(doc: StoredDoc, raw: unknown): Promise<void>;
  /** Keep a copy of a document as it was at `version`, before it is migrated. Written once: a copy already there is kept. */
  keepVersion?(doc: StoredDoc, version: number, raw: unknown): Promise<void>;
  /** The documents under `keys` as stored, unmigrated; a key with no document is left out. What a backup is made from. */
  exportAll?(keys: readonly string[]): Promise<Record<string, unknown>>;
  /**
   * Replace the documents under `keys` with `docs` (a key with no document in
   * `docs` is removed), in one transaction where the store has one. Each
   * document it replaces is first copied to `<name><keep>`.
   */
  replaceAll?(keys: readonly string[], docs: Record<string, unknown>, keep: string): Promise<void>;
}

/** The documents the learner store owns; the UI store keeps `path` and `ui` itself. */
export type StoredDoc = 'state' | 'events' | 'attempts';

/** The documents a session save may carry. `path` and `ui` are owned by the UI store. */
export interface SaveAll { state?: LearnerState; events?: EventLog; attempts?: AttemptLog; path?: unknown; ui?: unknown }

/** For tests and the simulator. Stores a structured clone, like IndexedDB does. */
export class MemoryStore implements LearnerStore {
  private doc: unknown | undefined;
  private previous: unknown | undefined;
  saves = 0;
  constructor(initial?: unknown) { this.doc = initial === undefined ? undefined : structuredClone(initial); }
  async load() { return this.doc === undefined ? undefined : structuredClone(this.doc); }
  async save(state: LearnerState) { this.previous = this.doc; this.doc = structuredClone(state); this.saves += 1; }
  async loadPrevious() { return this.previous === undefined ? undefined : structuredClone(this.previous); }
  /** Copies kept beside the documents, by name (`state.quarantine`, `state.v1`). */
  readonly kept = new Map<string, unknown>();
  async quarantine(doc: StoredDoc, raw: unknown) { this.kept.set(`${doc}.quarantine`, structuredClone(raw)); }
  async keepVersion(doc: StoredDoc, version: number, raw: unknown) {
    if (!this.kept.has(`${doc}.v${version}`)) this.kept.set(`${doc}.v${version}`, structuredClone(raw));
  }
  private evs: unknown | undefined;
  eventSaves = 0;
  async loadEvents() { return this.evs === undefined ? undefined : structuredClone(this.evs); }
  async saveEvents(log: EventLog) { this.evs = structuredClone(log); this.eventSaves += 1; }
  private atts: unknown | undefined;
  async loadAttempts() { return this.atts === undefined ? undefined : structuredClone(this.atts); }
  async saveAttempts(log: AttemptLog) { this.atts = structuredClone(log); }
  /** Path and ui documents written through saveAll, by key. */
  readonly extras = new Map<string, unknown>();
  async saveAll(d: SaveAll) {
    // Stage everything first, then commit: nothing is applied if a clone throws.
    const state = d.state && structuredClone(d.state);
    const events = d.events && structuredClone(d.events);
    const attempts = d.attempts && structuredClone(d.attempts);
    const path = d.path !== undefined ? structuredClone(d.path) : undefined;
    const ui = d.ui !== undefined ? structuredClone(d.ui) : undefined;
    if (state) { this.previous = this.doc; this.doc = state; this.saves += 1; }
    if (events) { this.evs = events; this.eventSaves += 1; }
    if (attempts) this.atts = attempts;
    if (path !== undefined) this.extras.set('path', path);
    if (ui !== undefined) this.extras.set('ui', ui);
  }
  async clear() { this.doc = undefined; this.previous = undefined; this.evs = undefined; this.atts = undefined; this.extras.clear(); this.kept.clear(); }
  async exportAll(keys: readonly string[]) {
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      const v = k === 'state' ? this.doc : k === 'events' ? this.evs : k === 'attempts' ? this.atts : this.extras.get(k);
      if (v !== undefined) out[k] = structuredClone(v);
    }
    return out;
  }
  async replaceAll(keys: readonly string[], docs: Record<string, unknown>, keep: string) {
    const staged = Object.fromEntries(Object.entries(docs).map(([k, v]) => [k, structuredClone(v)]));
    const now = await this.exportAll(keys);
    for (const [k, v] of Object.entries(now)) this.kept.set(`${k}${keep}`, v);
    this.previous = this.doc;
    this.doc = staged.state;
    this.evs = staged.events;
    this.atts = staged.attempts;
    for (const k of keys) if (k !== 'state' && k !== 'events' && k !== 'attempts') { if (staged[k] === undefined) this.extras.delete(k); else this.extras.set(k, staged[k]); }
  }
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
  /** Every key held. Absent: callers only know the keys they name. */
  keys?(): Promise<string[]>;
}

export const IDB_DB = 'fluidez';
export const IDB_OBJECT_STORE = 'learner';
export const IDB_KEY = 'state';
export const IDB_EVENTS_KEY = 'events';
export const IDB_ATTEMPTS_KEY = 'attempts';
export const IDB_PATH_KEY = 'path';
export const IDB_UI_KEY = 'ui';

export function idbKV(db = IDB_DB, objectStore = IDB_OBJECT_STORE): KV {
  const s = createStore(db, objectStore);
  return { get: (k) => get(k, s), set: (k, v) => set(k, v, s), del: (k) => del(k, s), setMany: (e) => setMany(e, s), keys: async () => (await keys(s)).map(String) };
}

/** The browser store. Keeps the previous document under `state.prev` as a one-step backup. */
export class IdbStore implements LearnerStore {
  constructor(readonly kv: KV = idbKV(), private readonly key = IDB_KEY, private readonly eventsKey = IDB_EVENTS_KEY, private readonly attemptsKey = IDB_ATTEMPTS_KEY) {}
  async loadEvents() { return (await this.kv.get(this.eventsKey)) ?? undefined; }
  async saveEvents(log: EventLog) { await this.kv.set(this.eventsKey, log); }
  async loadAttempts() { return (await this.kv.get(this.attemptsKey)) ?? undefined; }
  async saveAttempts(log: AttemptLog) { await this.kv.set(this.attemptsKey, log); }
  async load() {
    const doc = await this.kv.get(this.key);
    return doc ?? (await this.loadPrevious());
  }
  async loadPrevious() { return (await this.kv.get(`${this.key}.prev`)) ?? undefined; }
  private nameOf(doc: StoredDoc) { return doc === 'state' ? this.key : doc === 'events' ? this.eventsKey : this.attemptsKey; }
  async quarantine(doc: StoredDoc, raw: unknown) {
    try { await this.kv.set(`${this.nameOf(doc)}.quarantine`, raw); } catch { /* best effort */ }
  }
  async keepVersion(doc: StoredDoc, version: number, raw: unknown) {
    const name = `${this.nameOf(doc)}.v${version}`;
    if ((await this.kv.get(name)) === undefined) await this.kv.set(name, raw);
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
    if (d.attempts) entries.push([this.attemptsKey, d.attempts]);
    if (d.path !== undefined) entries.push([IDB_PATH_KEY, d.path]);
    if (d.ui !== undefined) entries.push([IDB_UI_KEY, d.ui]);
    if (!entries.length) return;
    if (this.kv.setMany) await this.kv.setMany(entries);
    else for (const [k, v] of entries) await this.kv.set(k, v);
  }
  /** Where a key's document lives: `state` and `events` under this store's own keys, anything else under its own name. */
  private nameFor(key: string) { return key === 'state' ? this.key : key === 'events' ? this.eventsKey : key === 'attempts' ? this.attemptsKey : key; }
  async exportAll(keys: readonly string[]) {
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      // load() falls back to the one-step copy, so a backup must too: progress that opens is progress that comes out
      const v = (await this.kv.get(this.nameFor(k))) ?? (k === 'state' ? await this.loadPrevious() : undefined);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  async replaceAll(keys: readonly string[], docs: Record<string, unknown>, keep: string) {
    const entries: [string, unknown][] = [];
    const gone: string[] = [];
    for (const k of keys) {
      const name = this.nameFor(k);
      const was = await this.kv.get(name);
      if (was !== undefined) entries.push([`${name}${keep}`, was]);
      if (k === 'state' && was !== undefined) entries.push([`${name}.prev`, was]);
      if (docs[k] !== undefined) entries.push([name, docs[k]]);
      else gone.push(name);
    }
    if (this.kv.setMany) await this.kv.setMany(entries);
    else for (const [k, v] of entries) await this.kv.set(k, v);
    for (const name of gone) await this.kv.del(name);
  }
  /** Everything the store holds, copies included: a reset that promises to delete progress must not keep a snapshot of it. */
  async clear() {
    const copies = ((await this.kv.keys?.()) ?? []).filter((k) => [this.key, this.eventsKey, this.attemptsKey].some((n) => k.startsWith(`${n}.`)));
    for (const k of [this.key, `${this.key}.prev`, this.eventsKey, this.attemptsKey, ...copies]) await this.kv.del(k);
  }
}
