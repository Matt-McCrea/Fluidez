// What a learner makes is kept in documents of its own, apart from the ui
// document: `ui.update` clones that one whole on every change, and text only
// grows. Each document is read, changed and written back on demand, one at a
// time, so nothing is held in memory between uses. This is capture: no screen
// reads these yet, and a learner's backup carries them (see BACKUP_READERS).
//
// Keeping must never cost a lesson. A document a newer build wrote is left
// alone, a damaged one is put aside and started again, and a store that
// refuses a write is reported on the console and carried on from.
import { StoredDocumentError, type KV } from '../../learner';
import type { ProgressNumbers } from '../session/numbers';
import type { RubricAnswer } from './ui';

export const WRITING_KEY = 'writing';
export const WRITING_VERSION = 1;

/** One thing the learner wrote. */
export interface WrittenText {
  /** one per time written: `<kind>:<ref>:<at>`; saving it again updates it */
  id: string;
  at: number;
  /** a writing task, or the personal sentence that closes a lesson */
  kind: 'task' | 'personal';
  /** the task id, or the node the personal sentence was about */
  ref: string;
  /** what the learner was asked */
  prompt: string;
  /** what they wrote; for a personal sentence, the latest try */
  text: string;
  words: number;
  /** learner session index at the time */
  session: number;
  /** personal sentence: the first try, when the check sent it back and the learner changed it */
  first?: string;
  /** personal sentence: how it ended. Absent while it is still being tried */
  result?: 'pass' | 'shown';
  /** task: the learner's own marks, and the checklist items met of those set */
  rubric?: RubricAnswer[];
  met?: number;
  total?: number;
}

export interface SavedWriting { version: number; entries: WrittenText[] }
export const emptyWriting = (): SavedWriting => ({ version: WRITING_VERSION, entries: [] });

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

const usableText = (e: unknown): e is WrittenText =>
  isObject(e) && typeof e.id === 'string' && Number.isFinite(e.at) && (e.kind === 'task' || e.kind === 'personal') && typeof e.text === 'string';

/** Open a stored writing document the way boot opens the others: a newer one throws `newer`, one that is not a document throws `unreadable`, a damaged entry is dropped. */
export function readWriting(raw: unknown): SavedWriting {
  // the version first: a newer build may have moved the entries, and that is not damage to clear away
  const version = isObject(raw) && typeof raw.version === 'number' ? raw.version : 1;
  if (version > WRITING_VERSION) throw new StoredDocumentError('newer', WRITING_KEY, `v${version} is newer than this build (v${WRITING_VERSION})`);
  if (!isObject(raw) || !Array.isArray(raw.entries)) throw new StoredDocumentError('unreadable', WRITING_KEY, 'not a writing document');
  const entries = raw.entries.filter(usableText);
  if (entries.length < raw.entries.length) console.warn(`fluidez: dropped ${raw.entries.length - entries.length} damaged piece(s) of saved writing`);
  return { version: WRITING_VERSION, entries };
}

// ---------------------------------------------------------------- reads and months

export const HISTORY_KEY = 'history';
export const HISTORY_VERSION = 1;
/** Newest reads kept: a course has about a thousand, so this is every read of one with room to spare. */
export const READS_CAP = 3000;

/** One read of a chapter, in a lesson or from the Story screen. */
export interface ReadRow {
  at: number;
  chapter: string;
  words: number;
  /** seconds from opening it to saying it was read (for a first read, the time spent on the text, not on its questions) */
  seconds: number;
  /** words tapped for their meaning */
  taps: number;
  /** the first time the learner read it, or a reread */
  first: boolean;
}

/** The numbers Progress showed in a month, as of the last session of it. */
export interface MonthRow extends ProgressNumbers { /** `YYYY-MM`, in the learner's own days */ month: string; at: number }

export interface History { version: number; reads: ReadRow[]; months: MonthRow[] }
export const emptyHistory = (): History => ({ version: HISTORY_VERSION, reads: [], months: [] });

const usableRead = (r: unknown): r is ReadRow =>
  isObject(r) && Number.isFinite(r.at) && typeof r.chapter === 'string' && Number.isFinite(r.words) && Number.isFinite(r.seconds);
const usableMonth = (m: unknown): m is MonthRow => isObject(m) && typeof m.month === 'string' && Number.isFinite(m.at);

/** Open a stored history the way boot opens the others (see `readWriting`). */
export function readHistory(raw: unknown): History {
  const version = isObject(raw) && typeof raw.version === 'number' ? raw.version : 1;
  if (version > HISTORY_VERSION) throw new StoredDocumentError('newer', HISTORY_KEY, `v${version} is newer than this build (v${HISTORY_VERSION})`);
  if (!isObject(raw) || !Array.isArray(raw.reads) || !Array.isArray(raw.months)) throw new StoredDocumentError('unreadable', HISTORY_KEY, 'not a history document');
  const reads = raw.reads.filter(usableRead);
  const months = raw.months.filter(usableMonth);
  if (reads.length < raw.reads.length || months.length < raw.months.length) console.warn('fluidez: dropped damaged rows from the history');
  return { version: HISTORY_VERSION, reads: reads.slice(-READS_CAP), months };
}

export class Keep {
  /** every change runs on this chain, and no job on it rejects, so one refused write cannot end keeping */
  private chain: Promise<void> = Promise.resolve();

  constructor(private readonly kv: KV) {}

  /** Resolves once everything asked for so far has been written (or has failed and been reported). */
  settled(): Promise<void> { return this.chain; }

  private run(what: string, job: () => Promise<void>): Promise<void> {
    this.chain = this.chain.then(job).catch((e) => { console.warn(`fluidez: could not keep ${what}`, e); });
    return this.chain;
  }

  /** The stored document, or a new one. A damaged one is copied to `<key>.quarantine` first; a newer one throws, to be left exactly as it is. */
  private async open<T>(key: string, read: (raw: unknown) => T, empty: () => T): Promise<T> {
    const raw = await this.kv.get(key);
    if (raw === undefined || raw === null) return empty();
    try { return read(raw); } catch (e) {
      if (!(e instanceof StoredDocumentError) || e.fault === 'newer') throw e;
      console.warn(`fluidez: ${key} could not be read (${e.detail}); starting it again`);
      try { await this.kv.set(`${key}.quarantine`, raw); } catch { /* best effort */ }
      return empty();
    }
  }

  /** A damaged document is put aside and started again at boot, as the learner's are: a backup has to open every document, so one left lying refuses them all. */
  tidy(): Promise<void> {
    const heal = async <T>(key: string, read: (raw: unknown) => T, empty: () => T) => {
      const raw = await this.kv.get(key);
      if (raw === undefined || raw === null) return;
      try { read(raw); } catch (e) {
        if (e instanceof StoredDocumentError && e.fault === 'unreadable') await this.kv.set(key, await this.open(key, read, empty));
      }
    };
    return this.run('its documents in order', async () => {
      await heal(WRITING_KEY, readWriting, emptyWriting);
      await heal(HISTORY_KEY, readHistory, emptyHistory);
    });
  }

  /** Keep a piece of writing, or bring the one with this id up to date (it keeps the time it was first written). */
  saveWriting(entry: WrittenText): Promise<void> {
    return this.run('what was written', async () => {
      const doc = await this.open(WRITING_KEY, readWriting, emptyWriting);
      const i = doc.entries.findIndex((e) => e.id === entry.id);
      if (i >= 0) doc.entries[i] = { ...doc.entries[i], ...entry, at: doc.entries[i].at };
      else doc.entries.push(entry);
      await this.kv.set(WRITING_KEY, doc);
    });
  }

  /** Keep one read of a chapter. */
  addRead(row: ReadRow): Promise<void> {
    return this.run('a read', async () => {
      const doc = await this.open(HISTORY_KEY, readHistory, emptyHistory);
      doc.reads.push(row);
      if (doc.reads.length > READS_CAP) doc.reads.splice(0, doc.reads.length - READS_CAP);
      await this.kv.set(HISTORY_KEY, doc);
    });
  }

  /** Keep the month's numbers. One row a month: the next session of the same month replaces it, so the last session of a month leaves that month's. */
  snapshotMonth(month: string, at: number, numbers: ProgressNumbers): Promise<void> {
    return this.run('the month\'s numbers', async () => {
      const doc = await this.open(HISTORY_KEY, readHistory, emptyHistory);
      const row: MonthRow = { ...numbers, month, at };
      const i = doc.months.findIndex((m) => m.month === month);
      if (i >= 0) doc.months[i] = row; else doc.months.push(row);
      await this.kv.set(HISTORY_KEY, doc);
    });
  }

  /** Change part of a piece already kept (the marks a learner gives their own writing). One that was never kept is not made up. */
  amendWriting(id: string, patch: Partial<Omit<WrittenText, 'id'>>): Promise<void> {
    return this.run('what was written', async () => {
      const doc = await this.open(WRITING_KEY, readWriting, emptyWriting);
      const at = doc.entries.findIndex((e) => e.id === id);
      if (at < 0) return;
      doc.entries[at] = { ...doc.entries[at], ...patch };
      await this.kv.set(WRITING_KEY, doc);
    });
  }
}
