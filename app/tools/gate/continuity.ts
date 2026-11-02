// What the course has shipped, and whether anything shipped has gone. A learner's
// saved documents name nodes, bank rows, chapters, scenes, writing tasks and days
// by id, so an id that disappears from content/ without a word strands whoever holds
// it. `content/_shipped/ids.json` is every id any build has carried (it only ever
// grows: `npm run shipped`), and each one must still be in content/ or have an entry
// in `content/_migrations/` saying what became of it.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { dayKeyOf } from '../../src/content/days';
import { ContentMigration, LegacyPath, MOVE_KINDS, movesOf, type MoveKind } from '../../src/content/migrations';
import type { BankSentence, GraphNode, Scene, StoryChapter, Unit, WritingTask } from '../../src/content/schema';
import type { Finding } from './findings';
import type { Loaded } from './load';

export const SHIPPED_DIR = '_shipped';
export const MIGRATIONS_DIR = '_migrations';

/** Every id the learner's documents can name, by kind. `days` are the unit days' keys. */
export interface CourseIds {
  nodes: string[];
  days: string[];
  rows: string[];
  chapters: string[];
  scenes: string[];
  tasks: string[];
}
export type IdKind = keyof CourseIds;
export const ID_KINDS: readonly IdKind[] = ['nodes', 'days', 'rows', 'chapters', 'scenes', 'tasks'];

export const emptyIds = (): CourseIds => ({ nodes: [], days: [], rows: [], chapters: [], scenes: [], tasks: [] });

/** The ids in the content files that loaded. A file that failed its schema is the schema check's to report, not this one's. */
export function idsOfLoaded(files: readonly Loaded[]): CourseIds {
  const out = emptyIds();
  for (const f of files) {
    if (!f.ok) continue;
    switch (f.kind) {
      case 'graph': for (const n of f.data as GraphNode[]) out.nodes.push(n.id); break;
      case 'unit': { const u = f.data as Unit; u.days.forEach((_, i) => out.days.push(dayKeyOf(u, i))); break; }
      case 'bank': for (const b of f.data as BankSentence[]) out.rows.push(b.id); break;
      case 'story': out.chapters.push((f.data as StoryChapter).id); break;
      case 'scene': out.scenes.push((f.data as Scene).id); break;
      case 'writing': for (const t of f.data as WritingTask[]) out.tasks.push(t.id); break;
      default: break;
    }
  }
  return out;
}

// ---------------------------------------------------------------- the shipped file

/** Row ids are `<prefix><number>` nearly always, thousands in a row: stored as ranges per prefix and width. */
type RowRanges = Record<string, string>;
export interface ShippedIds {
  format: 1;
  about: string;
  nodes: string[];
  days: string[];
  chapters: string[];
  scenes: string[];
  tasks: string[];
  /** `"<prefix>|<digits>"` to ranges, `"1-1020,1030"`; ids with no number on the end are in `rowsOther` */
  rows: RowRanges;
  rowsOther: string[];
}

export const SHIPPED_ABOUT = 'Every id any build of the course has carried. It only grows (npm run shipped). The gate fails an id that is in here, is not in content/, and has no entry in content/_migrations/.';

export function packRows(ids: Iterable<string>): { rows: RowRanges; rowsOther: string[] } {
  const groups = new Map<string, number[]>();
  const other: string[] = [];
  for (const id of ids) {
    const m = /^(.*?)(\d+)$/.exec(id);
    if (!m) { other.push(id); continue; }
    const k = `${m[1]}|${m[2].length}`;
    const g = groups.get(k);
    if (g) g.push(Number(m[2])); else groups.set(k, [Number(m[2])]);
  }
  const rows: RowRanges = {};
  for (const k of [...groups.keys()].sort()) {
    const ns = [...new Set(groups.get(k)!)].sort((a, b) => a - b);
    const runs: string[] = [];
    for (let i = 0; i < ns.length;) {
      let j = i;
      while (j + 1 < ns.length && ns[j + 1] === ns[j] + 1) j++;
      runs.push(j > i ? `${ns[i]}-${ns[j]}` : `${ns[i]}`);
      i = j + 1;
    }
    rows[k] = runs.join(',');
  }
  return { rows, rowsOther: [...new Set(other)].sort() };
}

export function unpackRows(s: Pick<ShippedIds, 'rows' | 'rowsOther'>): string[] {
  const out = [...s.rowsOther];
  for (const [k, runs] of Object.entries(s.rows)) {
    const at = k.lastIndexOf('|');
    const prefix = k.slice(0, at);
    const width = Number(k.slice(at + 1));
    for (const run of runs.split(',')) {
      const [a, b] = run.split('-').map(Number);
      for (let n = a; n <= (b ?? a); n++) out.push(prefix + String(n).padStart(width, '0'));
    }
  }
  return out;
}

export function packShipped(ids: CourseIds): ShippedIds {
  const sorted = (a: Iterable<string>) => [...new Set(a)].sort();
  return {
    format: 1, about: SHIPPED_ABOUT,
    nodes: sorted(ids.nodes), days: sorted(ids.days), chapters: sorted(ids.chapters), scenes: sorted(ids.scenes), tasks: sorted(ids.tasks),
    ...packRows(ids.rows),
  };
}

export function unpackShipped(s: ShippedIds): CourseIds {
  return { nodes: s.nodes, days: s.days, rows: unpackRows(s), chapters: s.chapters, scenes: s.scenes, tasks: s.tasks };
}

/** The ids that ever shipped, or undefined when no snapshot has been made. */
export function readShippedIds(contentDir: string): ShippedIds | undefined {
  const p = join(contentDir, SHIPPED_DIR, 'ids.json');
  return existsSync(p) ? (JSON.parse(readFileSync(p, 'utf8')) as ShippedIds) : undefined;
}

export function readLegacyPath(contentDir: string): LegacyPath | undefined {
  const p = join(contentDir, SHIPPED_DIR, 'path.json');
  return existsSync(p) ? LegacyPath.parse(JSON.parse(readFileSync(p, 'utf8'))) : undefined;
}

// ---------------------------------------------------------------- the migration files

export interface MigrationFile { file: string; raw: unknown; parsed?: ContentMigration; error?: string }

export function readMigrationFiles(contentDir: string): MigrationFile[] {
  const dir = join(contentDir, MIGRATIONS_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const file = `content/${MIGRATIONS_DIR}/${f}`;
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch (e) { return { file, raw: null, error: `not valid JSON: ${(e as Error).message}` }; }
    const r = ContentMigration.safeParse(raw);
    return r.success ? { file, raw, parsed: r.data } : { file, raw, error: `${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}` };
  });
}

// ---------------------------------------------------------------- the check

const KIND_NAME: Record<IdKind, string> = { nodes: 'node', days: 'day', rows: 'bank row', chapters: 'chapter', scenes: 'scene', tasks: 'writing task' };
const MOVE_OF: Record<Exclude<IdKind, 'days'>, MoveKind> = { nodes: 'nodes', rows: 'rows', chapters: 'chapters', scenes: 'scenes', tasks: 'tasks' };

const err = (file: string, problem: string, fix?: string): Finding => ({ severity: 'error', check: 'continuity', file, problem, fix });

/**
 * Findings for the course's continuity: every day has a key and the keys are unique; the
 * migration table is whole (numbered 1.. in order, each file parsing); no id that shipped has
 * vanished without an entry; no id an entry retired has come back; every rename lands on an id
 * that exists. `shipped` absent (no snapshot yet) skips the vanished check and says so.
 */
export function checkContinuity(opts: {
  current: CourseIds;
  units: readonly Unit[];
  shipped?: CourseIds;
  legacy?: LegacyPath;
  migrations: readonly MigrationFile[];
}): Finding[] {
  const out: Finding[] = [];
  const { current, shipped, legacy } = opts;

  // day keys
  const seen = new Map<string, string>();
  for (const u of opts.units) {
    u.days.forEach((d, i) => {
      const where = `content/units/${u.id}.json`;
      if (!d.key) { out.push(err(where, `day ${i} has no key`, `give it "key": "${u.id}-d${i}" (or run npm run shipped -- keys)`)); return; }
      const first = seen.get(d.key);
      if (first) out.push(err(where, `day ${i} has the key ${d.key}, which ${first} has too`, 'a key names one day for good; give this one the next number its unit has not used'));
      else seen.set(d.key, `${u.id} day ${i}`);
    });
  }

  // the table
  const files = opts.migrations;
  files.forEach((f) => { if (f.error) out.push(err(f.file, f.error, 'match src/content/migrations.ts exactly')); });
  files.forEach((f, i) => {
    if (!f.parsed) return;
    const want = i + 1;
    if (f.parsed.id !== want || !f.file.endsWith(`/${String(want).padStart(4, '0')}.json`)) {
      out.push(err(f.file, `the table must be numbered 1, 2, 3 with no gaps, and each file named for its id: this is entry ${f.parsed.id} in position ${want}`, `rename it ${String(want).padStart(4, '0')}.json and set "id": ${want}`));
    }
  });
  const table = files.flatMap((f) => (f.parsed ? [{ m: f.parsed, file: f.file }] : []));

  const has = (kind: IdKind): Set<string> => new Set(current[kind]);
  const exists = Object.fromEntries(ID_KINDS.map((k) => [k, has(k)])) as Record<IdKind, Set<string>>;
  const retired = (kind: IdKind): Map<string, { migration: number; to?: string }> => {
    const m = new Map<string, { migration: number; to?: string }>();
    for (const { m: x } of table) {
      if (kind === 'days') {
        for (const [from, to] of Object.entries(x.days ?? {})) m.set(from, { migration: x.id, ...(to ? { to } : {}) });
      } else {
        const mv = movesOf(x, MOVE_OF[kind]);
        for (const [from, to] of Object.entries(mv.rename)) m.set(from, { migration: x.id, to });
        for (const from of mv.remove) m.set(from, { migration: x.id });
      }
    }
    return m;
  };

  for (const kind of ID_KINDS) {
    const gone = retired(kind);
    for (const [from, g] of gone) {
      if (exists[kind].has(from)) out.push(err(`content/${MIGRATIONS_DIR}/${String(g.migration).padStart(4, '0')}.json`, `${KIND_NAME[kind]} ${from} was retired here and is back in the content`, 'a retired id is never used again: give the new thing a new id, or remove the entry'));
      if (g.to && !exists[kind].has(g.to) && !gone.has(g.to)) out.push(err(`content/${MIGRATIONS_DIR}/${String(g.migration).padStart(4, '0')}.json`, `${KIND_NAME[kind]} ${from} is renamed to ${g.to}, which is not in the content`, 'rename to an id that exists'));
    }
    if (shipped) {
      const vanished = shipped[kind].filter((id) => !exists[kind].has(id) && !gone.has(id));
      if (vanished.length) {
        const eg = vanished.slice(0, 6).join(', ');
        const more = vanished.length > 6 ? `, and ${vanished.length - 6} more` : '';
        out.push(err('', `${vanished.length} ${KIND_NAME[kind]} id(s) shipped and are gone with no content migration: ${eg}${more}`,
          kind === 'days' ? 'add a content migration mapping each key in "days" to the key it became, or to null' : `add a content migration (content/_migrations/NNNN.json) with {"${MOVE_OF[kind]}": {"rename": {"old": "new"}}} or {"remove": ["old"]}`));
      }
    }
  }

  if (legacy) {
    const gone = retired('days');
    const lost = Object.values(legacy.units).flat().filter((k) => !exists.days.has(k) && !gone.has(k));
    if (lost.length) out.push(err('content/_shipped/path.json', `${lost.length} day key(s) in the shipped path are gone with no content migration: ${lost.slice(0, 6).join(', ')}`, 'map each in a content migration\'s "days"'));
  }
  return out;
}
