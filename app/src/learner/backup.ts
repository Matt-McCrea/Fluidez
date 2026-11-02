// Backup and restore: everything a learner has, as one JSON file they keep.
//
// A backup is a map from key to the document stored under it, as stored. The
// keys come from an allowlist, `readers`: one entry per document, with the
// function that proves this build can open it. A new document (writing,
// attempts, games) is one more entry there and nowhere else. Export goes
// through the store (`exportAll`), so a store that keeps its documents some
// other way still serves it. Restore stores the raw documents and lets boot
// migrate them, but only after a dry run has migrated every one without
// writing anything, and after a `.pre-restore` copy of what is there now.
import { readAttempts } from './attempts';
import { readEvents } from './events';
import { migrate, StoredDocumentError } from './state';
import type { LearnerState } from './state';
import type { LearnerStore } from './store';

export const BACKUP_FORMAT = 'fluidez-backup';
/** The file's own layout. A new document is a new key, not a new layout: this moves only if the wrapper does. */
export const BACKUP_VERSION = 1;
/** Appended to a document's name for the copy a restore keeps of what it replaced. */
export const PRE_RESTORE = '.pre-restore';

/** Opens a stored document the way boot does: migrated, or a StoredDocumentError. */
export type DocReader = (raw: unknown) => unknown;
/** The allowlist: the documents a backup carries, and how each is opened. */
export type BackupReaders = Record<string, DocReader>;

/** The learner store's own documents. The UI store adds its own (see BACKUP_READERS in ui/store/ui.ts). */
export const LEARNER_READERS: BackupReaders = { state: migrate, events: readEvents, attempts: readAttempts };

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  formatVersion: number;
  madeAt: number;
  /** each document's own version at the time, for a quick look without opening it */
  versions: Record<string, number>;
  documents: Record<string, unknown>;
}

/** What a learner is shown about a backup before it replaces anything. */
export interface BackupSummary { madeAt: number; sessions: number }

export const NOT_A_BACKUP = 'That file isn\'t a Fluidez backup.';
export const BACKUP_NEWER = 'This backup was made by a newer version of Fluidez than this one. Update the app first, then restore it. Nothing has been changed.';
export const BACKUP_UNREADABLE = 'This backup can\'t be read, so nothing has been changed.';
export const BACKUP_NOT_MADE = 'Couldn\'t make a backup that could be restored. Your progress on this device hasn\'t been changed.';
export const BACKUP_EMPTY = 'There\'s no progress to back up yet.';
export const BACKUP_UNSUPPORTED = 'This device can\'t make or restore backups.';

/** A backup that cannot be made or used, in words for the learner. `fault` says why; nothing was written. */
export type BackupFault = 'notBackup' | 'newer' | 'unreadable' | 'empty' | 'unsupported';
export class BackupError extends Error {
  constructor(readonly fault: BackupFault, message: string, readonly detail?: string) {
    super(message);
    this.name = 'BackupError';
  }
}

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

/** Make a backup of every allowlisted document the store holds. The learner must have flushed first, so the store has everything. */
export async function makeBackup(store: LearnerStore, readers: BackupReaders, now = Date.now()): Promise<BackupFile> {
  if (!store.exportAll) throw new BackupError('unsupported', BACKUP_UNSUPPORTED);
  const documents = await store.exportAll(Object.keys(readers));
  if (documents.state === undefined) throw new BackupError('empty', BACKUP_EMPTY);
  const versions: Record<string, number> = {};
  for (const [k, d] of Object.entries(documents)) {
    const v = isObject(d) ? d.version : undefined;
    if (typeof v === 'number') versions[k] = v;
  }
  return { format: BACKUP_FORMAT, formatVersion: BACKUP_VERSION, madeAt: now, versions, documents };
}

export const backupText = (file: BackupFile): string => JSON.stringify(file);

/**
 * Make a backup and prove it can be restored: its text goes through the same
 * dry run a restore does, before anyone is told it is safe to keep. `makeBackup`
 * alone is what a screen uses when nothing else can be saved, so it hands over
 * whatever is there.
 */
export async function provenBackup(store: LearnerStore, readers: BackupReaders, now = Date.now()): Promise<BackupFile> {
  const file = await makeBackup(store, readers, now);
  try { readBackup(backupText(file), readers); } catch (e) {
    throw new BackupError('unreadable', BACKUP_NOT_MADE, e instanceof BackupError ? e.detail : (e as Error).message);
  }
  return file;
}

/** `fluidez-backup-2026-11-01.json`, by the local date it was made. */
export function backupFileName(madeAt: number): string {
  const d = new Date(madeAt);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `fluidez-backup-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
}

/** A backup that has been opened and found usable: safe to hand to restoreBackup. */
export interface ReadBackup { file: BackupFile; summary: BackupSummary }

/**
 * Open a backup file's text without writing anything. Throws a BackupError, in
 * words for the learner, unless the file is a backup this build can restore:
 * every document in it is on the allowlist and migrates cleanly. A backup from
 * a newer build is refused, including one with a document this build has never heard of.
 */
export function readBackup(text: string, readers: BackupReaders): ReadBackup {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new BackupError('notBackup', NOT_A_BACKUP, 'not JSON'); }
  if (!isObject(raw) || raw.format !== BACKUP_FORMAT || !isObject(raw.documents)) throw new BackupError('notBackup', NOT_A_BACKUP, 'no backup header');
  if (typeof raw.formatVersion === 'number' && raw.formatVersion > BACKUP_VERSION) throw new BackupError('newer', BACKUP_NEWER, `format v${raw.formatVersion}`);
  const documents = raw.documents;
  const strange = Object.keys(documents).find((k) => !Object.hasOwn(readers, k));
  if (strange !== undefined) throw new BackupError('newer', BACKUP_NEWER, `a document this build does not know: ${strange}`);
  if (documents.state === undefined) throw new BackupError('unreadable', BACKUP_UNREADABLE, 'no state');
  const opened: Record<string, unknown> = {};
  for (const [k, d] of Object.entries(documents)) {
    try { opened[k] = readers[k](d); } catch (e) {
      if (e instanceof StoredDocumentError) throw new BackupError(e.fault === 'newer' ? 'newer' : 'unreadable', e.fault === 'newer' ? BACKUP_NEWER : BACKUP_UNREADABLE, `${k}: ${e.detail}`);
      throw new BackupError('unreadable', BACKUP_UNREADABLE, `${k}: ${(e as Error).message}`);
    }
  }
  const madeAt = typeof raw.madeAt === 'number' ? raw.madeAt : 0;
  const file: BackupFile = {
    format: BACKUP_FORMAT, formatVersion: BACKUP_VERSION, madeAt, documents,
    versions: isObject(raw.versions) ? (raw.versions as Record<string, number>) : {},
  };
  return { file, summary: { madeAt, sessions: (opened.state as LearnerState).session.index } };
}

/**
 * Put a backup in place of what the store holds. The raw documents are written
 * as they are in the file and boot migrates them, so the file never has to
 * match this build's version. What is replaced is first copied to
 * `<name>.pre-restore`. `alsoRemove` names other keys to clear with them (a
 * half-finished lesson belongs to the learner that is going away). The caller
 * halts its learner and reloads next.
 */
export async function restoreBackup(store: LearnerStore, backup: ReadBackup, readers: BackupReaders, alsoRemove: readonly string[] = []): Promise<void> {
  if (!store.replaceAll) throw new BackupError('unsupported', BACKUP_UNSUPPORTED);
  await store.replaceAll([...Object.keys(readers), ...alsoRemove], backup.file.documents, PRE_RESTORE);
}

/** Hand the file to the browser as a download. Returns the name it was given. */
export function downloadBackup(file: BackupFile): string {
  const name = backupFileName(file.madeAt);
  const url = URL.createObjectURL(new Blob([backupText(file)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  return name;
}
