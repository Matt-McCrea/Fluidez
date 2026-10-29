// Curriculum validator: what the gate skips because it checks content against the schedule,
// not the schedule against itself.
//
//   npx tsx tools/curriculum/validate.ts                  report
//   npx tsx tools/curriculum/validate.ts --fix-priorities set priority to the first focus session where they disagree
//
// Rules (errors fail the run, warnings are reported):
//   schema       zod on the six graph files (lexemes.json included) and on every unit (error)
//   ids          unique node ids; every `requires` exists (error)
//   refs         every UnitDay focus / chunks / lexemes id is in the graph; every chapter and scene id is on disk (error)
//   priority     a node's priority is not earlier than anything it requires (error)
//   order        a node's first focus/chunks day is not before the first day of anything it requires (error)
//   caps         per-day caps from src/compiler/budget.ts: LEXEME_CAP by day type, CHUNK_CAP, PATTERN_CAP,
//                and PATTERNS_DAY_CAP on a patterns day (warning, with the overflow count)
//   first-focus  a focus or chunk node's priority equals the (global, 1-based) session of the first day that
//                lists it (warning; --fix-priorities rewrites it)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { z } from 'zod';
import { CHUNK_CAP, LEXEME_CAP, PATTERNS_DAY_CAP, PATTERN_CAP } from '../../src/compiler/budget';
import { GraphNode, Unit } from '../../src/content/schema';

export interface Issue { severity: 'error' | 'warning'; rule: string; where: string; message: string }
export interface Course {
  nodes: GraphNode[];
  units: Unit[];
  chapters: Set<string>;
  scenes: Set<string>;
}

/** Pure validation of an in-memory course (graph nodes already parsed). */
export function validateCourse(c: Course): { issues: Issue[]; priorityFixes: Array<{ id: string; from: number; to: number }> } {
  const issues: Issue[] = [];
  const add = (severity: Issue['severity'], rule: string, where: string, message: string) => issues.push({ severity, rule, where, message });
  const byId = new Map<string, GraphNode>();
  for (const n of c.nodes) {
    if (byId.has(n.id)) add('error', 'ids', n.id, 'duplicate node id');
    byId.set(n.id, n);
  }
  for (const n of c.nodes) for (const r of n.requires) if (!byId.has(r)) add('error', 'ids', n.id, `requires missing node ${r}`);

  // priority is not earlier than anything required (a can-do may share its requirement's session)
  for (const n of c.nodes) for (const r of n.requires) {
    const q = byId.get(r);
    if (q && (q.priority > n.priority || (q.priority === n.priority && n.kind !== 'cando'))) {
      add('error', 'priority', n.id, `priority ${n.priority} is not after required ${r} (priority ${q.priority})`);
    }
  }

  // schedule: global 1-based sessions
  const firstTaught = new Map<string, { s: number; where: string }>();   // any of focus / chunks / lexemes
  const firstPlaced = new Map<string, { s: number; where: string }>();   // focus / chunks only
  let s = 0;
  for (const u of c.units) {
    u.days.forEach((d, i) => {
      s++;
      const where = `${u.id} day ${i + 1}`;
      for (const [field, ids] of [['focus', d.focus], ['chunks', d.chunks], ['lexemes', d.lexemes]] as const) {
        for (const id of ids) {
          if (!byId.has(id)) { add('error', 'refs', where, `${field} ${id} is not in the graph`); continue; }
          if (!firstTaught.has(id)) firstTaught.set(id, { s, where });
          if (field !== 'lexemes' && !firstPlaced.has(id)) firstPlaced.set(id, { s, where });
        }
      }
      if (d.chapter && !c.chapters.has(d.chapter)) add('warning', 'refs', where, `chapter ${d.chapter} has no file in content/story`);
      if (d.scene && !c.scenes.has(d.scene)) add('warning', 'refs', where, `scene ${d.scene} has no file in content/scenes`);
      // caps
      const kind = (id: string) => byId.get(id)?.kind;
      const lexCap = LEXEME_CAP[d.type];
      if (d.lexemes.length > lexCap) add('warning', 'caps', where, `${d.lexemes.length} lexemes on a ${d.type} day, cap ${lexCap} (over by ${d.lexemes.length - lexCap})`);
      if (d.chunks.length > CHUNK_CAP) add('warning', 'caps', where, `${d.chunks.length} chunks, cap ${CHUNK_CAP} (over by ${d.chunks.length - CHUNK_CAP})`);
      const pats = d.focus.filter((id) => kind(id) === 'pattern').length;
      const patCap = d.type === 'patterns' ? PATTERNS_DAY_CAP : PATTERN_CAP;
      if (pats > patCap) add('warning', 'caps', where, `${pats} patterns on a ${d.type} day, cap ${patCap} (over by ${pats - patCap})`);
    });
  }

  // a node is placed no earlier than what it requires
  for (const [id, at] of firstPlaced) {
    for (const r of byId.get(id)!.requires) {
      const q = firstTaught.get(r);
      if (q && q.s > at.s) add('error', 'order', `${id} (${at.where})`, `first placed before its requirement ${r}, first taught ${q.where}`);
    }
  }

  // priority against the first day that lists the node
  const priorityFixes: Array<{ id: string; from: number; to: number }> = [];
  for (const [id, at] of firstPlaced) {
    const n = byId.get(id)!;
    if (n.priority !== at.s) {
      priorityFixes.push({ id, from: n.priority, to: at.s });
      add('warning', 'first-focus', id, `priority ${n.priority}, first listed ${at.where} (session ${at.s})`);
    }
  }
  return { issues, priorityFixes };
}

/* ---- CLI ------------------------------------------------------------------- */
const GRAPH_FILES = ['grammar', 'patterns', 'chunks', 'contrasts', 'candos', 'lexemes'];

export function loadCourse(content: string): { course: Course; issues: Issue[]; graphRaw: Record<string, Array<Record<string, unknown>>> } {
  const issues: Issue[] = [];
  const nodes: GraphNode[] = [];
  const graphRaw: Record<string, Array<Record<string, unknown>>> = {};
  for (const f of GRAPH_FILES) {
    const raw = JSON.parse(fs.readFileSync(path.join(content, 'graph', f + '.json'), 'utf8')) as Array<Record<string, unknown>>;
    graphRaw[f] = raw;
    const r = z.array(GraphNode).safeParse(raw);
    if (!r.success) { issues.push({ severity: 'error', rule: 'schema', where: `graph/${f}.json`, message: `${r.error.issues.length} zod issue(s); first: ${r.error.issues[0].path.join('.')} ${r.error.issues[0].message}` }); continue; }
    nodes.push(...r.data);
  }
  const units: Unit[] = [];
  const dir = path.join(content, 'units');
  for (const f of fs.readdirSync(dir).filter((x) => /^u\d{2}\.json$/.test(x)).sort()) {
    const r = Unit.safeParse(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
    if (!r.success) issues.push({ severity: 'error', rule: 'schema', where: `units/${f}`, message: `${r.error.issues[0].path.join('.')} ${r.error.issues[0].message}` });
    else units.push(r.data);
  }
  const ids = (sub: string) => new Set(fs.existsSync(path.join(content, sub)) ? fs.readdirSync(path.join(content, sub)).filter((x) => x.endsWith('.json')).map((x) => x.replace(/\.json$/, '')) : []);
  return { course: { nodes, units, chapters: ids('story'), scenes: ids('scenes') }, issues, graphRaw };
}

function main(): void {
  const content = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../content');
  const fix = process.argv.includes('--fix-priorities');
  const { course, issues: loadIssues, graphRaw } = loadCourse(content);
  const { issues, priorityFixes } = validateCourse(course);
  const all = [...loadIssues, ...issues];
  if (fix) {
    const want = new Map(priorityFixes.map((p) => [p.id, p.to]));
    let n = 0;
    for (const [f, rows] of Object.entries(graphRaw)) {
      let changed = false;
      for (const row of rows) if (want.has(row.id as string)) { row.priority = want.get(row.id as string)!; changed = true; n++; }
      if (changed) fs.writeFileSync(path.join(content, 'graph', f + '.json'), JSON.stringify(rows, null, 1) + '\n');
    }
    console.log(`priorities rewritten: ${n}`);
    return;
  }
  for (const i of all) console.log(`${i.severity === 'error' ? 'error' : 'warn '} [${i.rule}] ${i.where}: ${i.message}`);
  const errors = all.filter((i) => i.severity === 'error').length;
  const by = new Map<string, number>();
  for (const i of all) by.set(`${i.severity}:${i.rule}`, (by.get(`${i.severity}:${i.rule}`) ?? 0) + 1);
  console.log(`nodes ${course.nodes.length}, units ${course.units.length}; ` + [...by].map(([k, v]) => `${k} ${v}`).join(', '));
  console.log(`validate: ${errors ? 'FAIL' : 'PASS'} (${errors} error(s), ${all.length - errors} warning(s))`);
  process.exit(errors ? 1 : 0);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
