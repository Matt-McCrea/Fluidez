// Load content/, validate it against src/content/schema.ts, and build the
// curriculum context (graph ids, unit schedule, chunks, lexemes) the
// legality and reading checks need.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { z } from 'zod';
import { BankSentence, GraphNode, Scene, StoryChapter, TeachingScript, Unit, WritingTask } from '../../src/content/schema';
import { closedClass, registerLexemes, registerNames, type ChunkSpec, type PatternSpec, type TagOptions } from '../../src/engine/tagger';
import { kindOf, type Kind } from './extract';
import type { Finding } from './findings';

export interface Loaded {
  abs: string;
  rel: string;              // relative to app/
  kind: Kind;
  raw: unknown;             // JSON as parsed (for --fix rewrites)
  data: unknown;            // zod-parsed (defaults applied) or null if invalid
  ok: boolean;
}

const SCHEMA: Partial<Record<Kind, z.ZodTypeAny>> = {
  graph: z.array(GraphNode),
  unit: Unit,
  bank: z.array(BankSentence),
  script: TeachingScript,
  story: StoryChapter,
  scene: Scene,
  writing: z.array(WritingTask),
};

export function listJson(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    if (e === '_queue' || e === 'node_modules' || e.startsWith('.')) continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...listJson(p));
    else if (e.endsWith('.json')) out.push(p);
  }
  return out.sort();
}

function zodIssues(err: z.ZodError, max = 8): Array<{ path: string; msg: string }> {
  return err.issues.slice(0, max).map((i) => ({
    path: i.path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${String(p)}`)).join('').replace(/^\./, ''),
    msg: i.message,
  }));
}

export function loadFile(abs: string, appDir: string, findings: Finding[] | null): Loaded {
  const rel = relative(appDir, abs);
  const kind = kindOf(abs);
  let raw: unknown = null;
  try { raw = JSON.parse(readFileSync(abs, 'utf8')); } catch (e) {
    findings?.push({ severity: 'error', check: 'schema', file: rel, problem: `not valid JSON: ${(e as Error).message}`, fix: 'write the whole file as one valid JSON value' });
    return { abs, rel, kind, raw: null, data: null, ok: false };
  }
  const schema = SCHEMA[kind];
  if (!schema) return { abs, rel, kind, raw, data: raw, ok: true };
  const r = schema.safeParse(raw);
  if (!r.success) {
    for (const i of zodIssues(r.error)) findings?.push({ severity: 'error', check: 'schema', file: rel, path: i.path, problem: i.msg, fix: 'match src/content/schema.ts exactly; never invent fields' });
    if (r.error.issues.length > 8) findings?.push({ severity: 'error', check: 'schema', file: rel, problem: `… ${r.error.issues.length - 8} more schema issues` });
    return { abs, rel, kind, raw, data: null, ok: false };
  }
  // file-name / id agreement
  const base = abs.split('/').pop()!.replace(/\.json$/, '');
  const d = r.data as { id?: string };
  if ((kind === 'unit' || kind === 'story') && d.id !== base) {
    findings?.push({ severity: 'error', check: 'schema', file: rel, path: 'id', problem: `id "${d.id}" does not match the file name "${base}"`, fix: `set id to "${base}"` });
  }
  return { abs, rel, kind, raw, data: r.data, ok: true };
}

/* ---- curriculum ------------------------------------------------------------ */
export interface Curriculum {
  nodes: Map<string, GraphNode>;
  graphIds: Set<string>;
  units: Unit[];
  /** session index (1-based) of each unit's days: `${unit}#${dayIdx}` -> session */
  daySession: Map<string, number>;
  unitEnd: Map<string, number>;
  unitBand: Map<string, string>;
  /** first session each node is taught in */
  taughtAt: Map<string, number>;
  /** where each node is taught, for messages */
  taughtWhere: Map<string, string>;
  chapterAt: Map<string, number>;
  sceneAt: Map<string, number>;
  scriptAt: Map<string, number>;
  chunks: ChunkSpec[];
  featureMap?: Record<string, string | null>;
  hasLexemes: boolean;
  completeBands: Set<string>;
  tagOpts: TagOptions;
}

export function buildCurriculum(files: Loaded[], contentDir: string, findings: Finding[]): Curriculum {
  const nodes = new Map<string, GraphNode>();
  for (const f of files) {
    if (f.kind !== 'graph' || !f.ok) continue;
    for (const n of f.data as GraphNode[]) nodes.set(n.id, n);
  }
  const units = files.filter((f) => f.kind === 'unit' && f.ok).map((f) => f.data as Unit).sort((a, b) => a.id.localeCompare(b.id));
  const daySession = new Map<string, number>();
  const unitEnd = new Map<string, number>();
  const unitBand = new Map<string, string>();
  const taughtAt = new Map<string, number>();
  const taughtWhere = new Map<string, string>();
  const chapterAt = new Map<string, number>();
  const sceneAt = new Map<string, number>();
  const scriptAt = new Map<string, number>();
  let s = 0;
  const teach = (id: string, at: number, where: string) => { if (!taughtAt.has(id) || taughtAt.get(id)! > at) { taughtAt.set(id, at); taughtWhere.set(id, where); } };
  for (const u of units) {
    unitBand.set(u.id, u.band);
    u.days.forEach((d, i) => {
      s++;
      daySession.set(`${u.id}#${i}`, s);
      const where = `${u.id} day ${i + 1}`;
      for (const id of [...d.focus, ...d.chunks, ...d.lexemes]) teach(id, s, where);
      for (const id of d.focus) if (!scriptAt.has(id)) scriptAt.set(id, s);
      if (d.chapter) chapterAt.set(d.chapter, s);
      if (d.scene) sceneAt.set(d.scene, s);
    });
    unitEnd.set(u.id, s);
  }
  // a lexeme met in a chunk or a reading before its card day is known from its priority
  for (const n of nodes.values()) {
    if (n.kind !== 'lexeme' || !units.length) continue;
    const t = taughtAt.get(n.id);
    if (t !== undefined && n.priority >= 1 && n.priority < t) { taughtAt.set(n.id, n.priority); taughtWhere.set(n.id, `priority ${n.priority} (carded ${taughtWhere.get(n.id)})`); }
  }
  // nodes no unit schedules fall back to their graph priority
  for (const n of nodes.values()) if (!taughtAt.has(n.id) && units.length) { taughtAt.set(n.id, Math.max(1, n.priority)); taughtWhere.set(n.id, `priority ${n.priority} (not in any unit)`); }
  const chunks: ChunkSpec[] = [...nodes.values()].filter((n) => n.kind === 'chunk' && n.es).map(chunkSpec);
  const patterns: PatternSpec[] = [...nodes.values()].filter((n) => n.kind === 'pattern').map((n) => ({ id: n.id, ...(n.match ? { match: n.match } : {}) }));
  let featureMap: Record<string, string | null> | undefined;
  const fm = join(contentDir, 'graph', '_featuremap.json');
  if (existsSync(fm)) {
    try { featureMap = JSON.parse(readFileSync(fm, 'utf8')); } catch (e) {
      findings.push({ severity: 'error', check: 'schema', file: 'content/graph/_featuremap.json', problem: `not valid JSON: ${(e as Error).message}` });
    }
  }
  let completeBands = new Set<string>();
  const cb = join(contentDir, 'units', '_complete.json');
  if (existsSync(cb)) { try { completeBands = new Set(JSON.parse(readFileSync(cb, 'utf8')) as string[]); } catch { /* ignore */ } }
  // the tagger learns the graph's lexemes and the cast's names
  registerLexemes([...nodes.values()].filter((n) => n.kind === 'lexeme').map((n) => ({ lemma: n.id.replace(/^l:/, '').replace(/#.*/, ''), pos: n.pos, gender: n.gender })));
  registerNames(castNames(units.map((u) => u.storyArc).join(' ')));
  const graphIds = new Set(nodes.keys());
  const hasLexemes = [...nodes.values()].some((n) => n.kind === 'lexeme') || units.some((u) => u.days.some((d) => d.lexemes.length));
  return {
    nodes, graphIds, units, daySession, unitEnd, unitBand, taughtAt, taughtWhere, chapterAt, sceneAt, scriptAt, chunks, featureMap,
    hasLexemes, completeBands,
    tagOpts: { graphIds, featureMap, chunks, patterns },
  };
}

/** A chunk's tagger spec: `es`, every aligned form's Spanish and every `match` surface are
 *  "/" alternatives. A two-turn form's turns are joined as the tagger's reply turns ("A — B"),
 *  so a set-up line is context, not the chunk. `match` holds bare frames ("Voy", "¿Tienes?")
 *  that are no learner-facing form but must still be recognised. */
export function chunkSpec(n: Pick<GraphNode, 'id' | 'es' | 'forms' | 'match' | 'unpacks'> & { priority?: number }): ChunkSpec {
  const alts = [n.es ?? '', ...(n.forms ?? []).map((f) => f.es), ...(n.match ?? [])].map((x) => x.replace(/\s*\n\s*/g, ' — ').trim()).filter(Boolean);
  return { id: n.id, es: [...new Set(alts)].join(' / '), ...(n.unpacks ? { unpacks: n.unpacks } : {}), ...(n.priority !== undefined ? { priority: n.priority } : {}) };
}

export function resolveTargets(args: string[], appDir: string, contentDir: string): string[] {
  if (!args.length) return listJson(contentDir);
  const out: string[] = [];
  for (const a of args) {
    let p = resolve(process.cwd(), a);
    if (!existsSync(p)) p = resolve(appDir, a);
    if (!existsSync(p)) { out.push(p); continue; }       // reported as missing
    if (statSync(p).isDirectory()) out.push(...listJson(p));
    else out.push(p);
  }
  return [...new Set(out)];
}

/** Capitalised words inside the story arcs (English prose) that are not
 *  English sentence words: the cast and places (Tomás, Vale, Don Hernando). */
const EN_STOP = new Set('the a an and but or so if when while this that these those he she it they we you i his her its their our my your in on at to of for with by from as is was are were be has had have do did not no yes then there here what who why how after before during until since because although though once each every all some one two three week day month year first last next new old'.split(' '));
export function castNames(text: string): string[] {
  const out = new Map<string, number>();
  for (const m of text.matchAll(/(?:^|(?<![.!?])\s)([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/g)) {
    const w = m[1].toLowerCase();
    if (EN_STOP.has(w) || closedClass(w)) continue;
    out.set(w, (out.get(w) ?? 0) + 1);
  }
  return [...out.keys()];
}


/** Load all of content/ and build the curriculum (for tools that only tag). */
export function loadCurriculum(appDir: string, contentDir = join(appDir, 'content')): Curriculum {
  const files = listJson(contentDir).map((p) => loadFile(p, appDir, null));
  return buildCurriculum(files, contentDir, []);
}
