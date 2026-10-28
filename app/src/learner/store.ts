// Persistence for the learner. The whole LearnerState is one versioned JSON
// document under one key; Learner.open() migrates whatever it loads.
import { createStore, del, get, set } from 'idb-keyval';
import type { LearnerState } from './state';

export interface LearnerStore {
  /** The stored document, unmigrated, or undefined if there is none. */
  load(): Promise<unknown | undefined>;
  save(state: LearnerState): Promise<void>;
  clear(): Promise<void>;
}

/** For tests and the simulator. Stores a structured clone, like IndexedDB does. */
export class MemoryStore implements LearnerStore {
  private doc: unknown | undefined;
  saves = 0;
  constructor(initial?: unknown) { this.doc = initial === undefined ? undefined : structuredClone(initial); }
  async load() { return this.doc === undefined ? undefined : structuredClone(this.doc); }
  async save(state: LearnerState) { this.doc = structuredClone(state); this.saves += 1; }
  async clear() { this.doc = undefined; }
  /** What a JSON export of the stored document would contain. */
  snapshot(): unknown { return this.doc === undefined ? undefined : JSON.parse(JSON.stringify(this.doc)); }
}

/** The minimal key-value surface IdbStore needs; idb-keyval by default. */
export interface KV {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
}

export const IDB_DB = 'fluidez';
export const IDB_OBJECT_STORE = 'learner';
export const IDB_KEY = 'state';

export function idbKV(db = IDB_DB, objectStore = IDB_OBJECT_STORE): KV {
  const s = createStore(db, objectStore);
  return { get: (k) => get(k, s), set: (k, v) => set(k, v, s), del: (k) => del(k, s) };
}

/** The browser store. Keeps the previous document under `state.prev` as a one-step backup. */
export class IdbStore implements LearnerStore {
  constructor(private readonly kv: KV = idbKV(), private readonly key = IDB_KEY) {}
  async load() {
    const doc = await this.kv.get(this.key);
    return doc ?? (await this.kv.get(`${this.key}.prev`)) ?? undefined;
  }
  async save(state: LearnerState) {
    const prev = await this.kv.get(this.key);
    if (prev !== undefined) await this.kv.set(`${this.key}.prev`, prev);
    await this.kv.set(this.key, state);
  }
  async clear() { await this.kv.del(this.key); await this.kv.del(`${this.key}.prev`); }
}
