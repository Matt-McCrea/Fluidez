// The content migration table: what became of an id that was shipped and is not
// in the course under that name any more. Append-only, like the learner's
// MIGRATIONS: `content/_migrations/NNNN.json`, numbered from 1 with no gaps, and
// a file that has shipped is never edited (a correction is a new file). The
// highest number is the content version. `reconcile` (learner/reconcile.ts)
// brings a learner's documents forward through every file past the version they
// were last settled at; the gate (tools/gate/continuity.ts) fails an id that
// vanished from the content with no entry here.
import { z } from 'zod';
import { DayKey } from './schema';

/** What happened to ids of one kind: `rename` old to new (the learner's records follow), `remove` for good (the records are kept apart, never deleted). */
export const IdMoves = z.strictObject({
  rename: z.record(z.string(), z.string()).optional(),
  remove: z.array(z.string()).optional(),
});
export type IdMoves = z.infer<typeof IdMoves>;

export const MOVE_KINDS = ['nodes', 'rows', 'chapters', 'scenes', 'tasks'] as const;
export type MoveKind = (typeof MOVE_KINDS)[number];

export const ContentMigration = z.strictObject({
  id: z.number().int().positive(),
  /** why, for the next person who reads the table */
  note: z.string(),
  /** graph node ids */
  nodes: IdMoves.optional(),
  /** bank sentence ids */
  rows: IdMoves.optional(),
  chapters: IdMoves.optional(),
  scenes: IdMoves.optional(),
  /** writing task ids */
  tasks: IdMoves.optional(),
  /** a day key that became another (it moved on under a new key), or null (the day is gone). A day that only moved, keeping its key, needs no entry. */
  days: z.record(DayKey, DayKey.nullable()).optional(),
});
export type ContentMigration = z.infer<typeof ContentMigration>;

/**
 * Where every day stood in the last build that kept a learner's place as two
 * integers. Those integers mean nothing without the course they were counted
 * in, so this is that course, and it is never regenerated: a path saved
 * before day keys is read against it.
 */
export const LegacyPath = z.strictObject({
  format: z.literal(1),
  about: z.string().optional(),
  /** unit id to its day keys, in order; the units sorted by id are the integers' units */
  units: z.record(z.string(), z.array(DayKey)),
});
export type LegacyPath = z.infer<typeof LegacyPath>;

/** What the build knows of the course's past. */
export interface ContentHistory {
  migrations: ContentMigration[];
  legacy?: LegacyPath;
  /** files that could not be used, and why */
  problems: string[];
}

export const noHistory = (): ContentHistory => ({ migrations: [], problems: [] });

/** The content version this table brings a learner to: its highest number, 0 for an empty table. */
export const contentVersionOf = (migrations: readonly Pick<ContentMigration, 'id'>[]): number => migrations.reduce((a, m) => Math.max(a, m.id), 0);

/** The moves a migration makes of one kind of id, both lists always present. */
export function movesOf(m: ContentMigration, kind: MoveKind): { rename: Record<string, string>; remove: string[] } {
  const x = m[kind];
  return { rename: x?.rename ?? {}, remove: x?.remove ?? [] };
}

/**
 * Open the table from the files as loaded. The chain is only as long as it is
 * whole: a file that does not parse, or a number that is missing, ends it there
 * and is reported, so a learner is never taken past a step that was not read.
 */
export function readContentHistory(files: { migrations: unknown[]; legacy?: unknown }): ContentHistory {
  const problems: string[] = [];
  const parsed: ContentMigration[] = [];
  for (const raw of files.migrations) {
    const r = ContentMigration.safeParse(raw);
    if (r.success) parsed.push(r.data);
    else problems.push(`a content migration does not parse: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
  }
  parsed.sort((a, b) => a.id - b.id);
  const migrations: ContentMigration[] = [];
  for (const m of parsed) {
    if (m.id !== migrations.length + 1) { problems.push(`content migration ${migrations.length + 1} is missing (found ${m.id}); the chain ends at ${migrations.length}`); break; }
    migrations.push(m);
  }
  let legacy: LegacyPath | undefined;
  if (files.legacy !== undefined) {
    const r = LegacyPath.safeParse(files.legacy);
    if (r.success) legacy = r.data; else problems.push(`the shipped path does not parse: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
  }
  return { migrations, legacy, problems };
}
