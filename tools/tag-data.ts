// Tags all of the ORIGINAL app's content with the ported tagger and writes sidecar data files:
//   data/graph.js, data/requires.js, data/lesson-nodes.js, docs/plan-2026-11-04/tagging-report.md
// Hand rulings in tools/lesson-nodes.overrides.json replace the derived teaches of a lesson (how "override", confidence 1).
// Run:  nice npx tsx tools/tag-data.ts
// data/requires.js stays the whole-corpus file node tools read; at the end the splitter (tools/split-data.ts) writes the
// per-band files the browser loads (data/requires/<band>.js), so the two never drift.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import vm from 'node:vm';
import { castNames, loadGraph, nodesByKind, tagOptions, type GraphNode } from '../lib/graph';
import { writeSplit } from './split-data';
import { tagRow, type TagRow, type TaggedRow } from '../lib/tagger/tagAll';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const t0 = Date.now();

/* ---------- graph ---------- */
const gdir = join(ROOT, 'app/content/graph');
const files = readdirSync(gdir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort();
const raw: GraphNode[][] = files.map((f) => JSON.parse(readFileSync(join(gdir, f), 'utf8')));
const graph = loadGraph(raw);
const udir = join(ROOT, 'app/content/units');
const arcs = readdirSync(udir).filter((f) => /^u\d+\.json$/.test(f)).sort()
  .map((f) => (JSON.parse(readFileSync(join(udir, f), 'utf8')).storyArc as string) ?? '').join(' ');
const opts = tagOptions(graph, { names: castNames(arcs) });

/* ---------- old content ---------- */
const ctx: any = { window: {}, console };
vm.createContext(ctx);
for (const f of ['data/taxonomy.js', 'data/connectors.js', 'data/rubrics.js', 'data/strand-lessons.js', 'data/course.js', 'data/verbs.js',
  'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js', 'data/passages.js', 'data/apply.js', 'data/writing.js',
  'data/topics.js', 'js/engine.js', 'js/lessons.js']) vm.runInContext(readFileSync(join(ROOT, f), 'utf8'), ctx, { filename: f });
const W = ctx.window;
const E = W.ENGINE;

/* ---------- rows ---------- */
type Group = { key: string; type: string; rows: TagRow[]; firstOnlyFocus?: boolean };
const groups: Group[] = [];
const add = (key: string, type: string, strings: Array<string | undefined | null>) => {
  const rows = strings.filter((s): s is string => !!s && !!s.trim()).map((es, i) => ({ id: `${key}#${i}`, es }));
  groups.push({ key, type, rows });
};
const clean = (s: string) => s.replace(/<[^>]+>/g, '');
const notes: string[] = [];

for (const p of W.PASSAGES) add(`passage:${p.id}`, 'passage', [p.text]);

W.APPLY_ITEMS.forEach((it: any, i: number) => {
  const key = `apply:${i}`;
  if (it.type === 'cloze') {
    const v = E.verbByInf(it.inf); const pi = E.personsFor(it.tense).indexOf(it.person);
    const ans = v && pi >= 0 ? E.conjugate(v, it.tense)[pi] : null;
    if (!ans) { notes.push(`${key}: engine could not compute cloze answer`); add(key, 'apply', [it.en && null]); return; }
    add(key, 'apply', [it.text.replace('___', ans).replace(/\s*\([^)]*\)/g, '')]);
  } else if (it.type === 'transform') add(key, 'apply', [it.from, it.to]);
  else if (it.type === 'choice') add(key, 'apply', [it.text.replace('___', it.options[it.answer])]);
  else add(key, 'apply', [it.text]);
});

for (const w of W.WRITING_TASKS) add(`writing:${w.id}`, 'writing', w.models?.length ? w.models : [w.answer]);
W.IDIOMS.forEach((d: any, i: number) => add(`idiom:${i}`, 'idiom', [d.es]));
for (const t of W.TOPICS) t.prompts.forEach((p: any, n: number) => add(`topic:${t.id}:${n}`, 'topic', p.models));

/* lessons: every example set. Row keys are per example; the lesson union is computed after tagging. */
const lessonRowKeys = new Map<string, string[]>();
const lessonExamples = new Map<string, number>();
const probeAnswer = (p: any): string | null => {
  if (p.kind !== 'cloze' || !p.text) return null;
  const a = Array.isArray(p.accept) ? p.accept[0] : p.accept ?? p.answer;
  return a ? p.text.replace('___', String(a)).replace(/\s*\([^)]*\)/g, '') : null;
};
const lessons: any[] = W.GRAMMAR_LESSONS;
for (const l of lessons) {
  const keys: string[] = [];
  (l.examples ?? []).forEach((e: any, n: number) => { const k = `lesson:${l.id}:ex:${n}`; add(k, 'lesson-ex', [e.es]); keys.push(k); });
  lessonExamples.set(l.id, (l.examples ?? []).length);
  const other: Array<string | null> = [
    ...(l.exponents ?? []).map((e: any) => e.es), ...(l.contrasts ?? []).map((e: any) => e.es),
    ...(l.moment ?? []).map((e: any) => e.es), ...(l.probes ?? []).map(probeAnswer),
    ...(l.recall ?? []).map((r: any) => (r.probe ? probeAnswer(r.probe) : null)),
  ];
  const k = `lesson:${l.id}:other`; add(k, 'lesson-other', other.map((s) => (s ? clean(s) : s))); keys.push(k);
  lessonRowKeys.set(l.id, keys);
}

/* ---------- tag ---------- */
const tagged = new Map<string, TaggedRow[]>();
let nRows = 0, nLow = 0;
const reasons = new Map<string, number>();
const typeStats = new Map<string, { items: number; rows: number; low: number; nolex: number }>();
for (const g of groups) {
  const out = g.rows.map((r) => tagRow(r, opts));
  tagged.set(g.key, out);
  const s = typeStats.get(g.type) ?? { items: 0, rows: 0, low: 0, nolex: 0 };
  s.items++; s.rows += out.length;
  for (const r of out) {
    nRows++; if (r.confidence === 'low') { nLow++; s.low++; }
    for (const x of new Set(r.lowReasons)) reasons.set(x.replace(/"[^"]*"/g, '"…"').replace(/\b\d+\b/g, 'N'), (reasons.get(x.replace(/"[^"]*"/g, '"…"').replace(/\b\d+\b/g, 'N')) ?? 0) + 1);
  }
  typeStats.set(g.type, s);
}

/* ---------- requires.js ---------- */
type Entry = { r: string[]; f: [number, number] | null; c: 'high' | 'low' };
const REQ: Record<string, Entry> = {};
const union = (rows: TaggedRow[]): Entry => ({
  r: [...new Set(rows.flatMap((x) => x.requires))].sort(),
  f: rows[0]?.focus ? (rows[0].focus.span as [number, number]) : null,
  c: rows.every((x) => x.confidence === 'high') ? 'high' : 'low',
});
for (const g of groups) {
  if (g.type === 'lesson-other') continue;
  const rows = tagged.get(g.key)!;
  if (g.type === 'lesson-ex') { REQ[g.key] = union(rows); continue; }
  REQ[g.key] = union(rows);
}
for (const l of lessons) {
  const rows = lessonRowKeys.get(l.id)!.flatMap((k) => tagged.get(k)!);
  REQ[`lesson:${l.id}`] = union(rows);
}
const sortedKeys = Object.keys(REQ).sort();
const lines = sortedKeys.map((k) => `${JSON.stringify(k)}:${JSON.stringify(REQ[k])}`);
writeFileSync(join(ROOT, 'data/requires.js'),
  `/* GENERATED by tools/tag-data.ts. Do not edit. Content id -> graph nodes it requires (r), focus span in the row text (f), confidence (c). */\nwindow.REQUIRES = {\n${lines.join(',\n')}\n};\n`);

/* ---------- lesson-nodes.js ---------- */
const TENSE_NODE: Record<string, string> = {
  presente: 'g:present-ar', preterito: 'g:preterite-ar', perfecto: 'g:perfecto-experience', imperfecto: 'g:imperfect-states',
  imperativo: 'g:commands-tu', presubj: 'g:subj-wanting', futuro: 'g:future-promises', condicional: 'g:conditional',
  plusc: 'g:pluperfect', impsubj: 'g:imperfect-subj', futperf: 'g:future-perfect', condperf: 'g:conditional-perfect', perfsubj: 'g:subj-perfect',
};
for (const [t, n] of Object.entries(TENSE_NODE)) if (!graph.ids.has(n)) throw new Error(`tense map: ${n} missing`);
const pcicIndex = new Map<string, string[]>();
for (const n of graph.nodes.values()) if (n.kind !== 'lexeme') for (const c of (n.pcic as string[] | undefined) ?? []) { const a = pcicIndex.get(c) ?? []; a.push(n.id); pcicIndex.set(c, a); }
const byId = new Map<string, any>(lessons.map((l) => [l.id, l]));
const taught = new Set<string>();
const LN: Record<string, { teaches: string[]; uses: string[]; confidence: number; how: string }> = {};
const method = { pcic: 0, 'new-in-order': 0, frequency: 0, tense: 0, none: 0 };
const detail: Array<{ id: string; title: string; summary: string; how: string; confidence: number; teaches: string[]; strand?: string }> = [];
const rowNodes = new Map<string, string[]>();
const seen = new Set<string>();
for (const d of W.COURSE_DAYS) {
  const id = d.lesson as string | undefined;
  if (!id || seen.has(id) || !byId.has(id)) continue;
  seen.add(id);
  const l = byId.get(id);
  const rowReqs: string[][] = lessonRowKeys.get(id)!.flatMap((k) => tagged.get(k)!).map((r) => r.requires);
  const count = new Map<string, number>();
  for (const rr of rowReqs) for (const n of rr) count.set(n, (count.get(n) ?? 0) + 1);
  let teaches: string[] = []; let how = 'frequency'; let conf = 0.2;
  if (l.tense && TENSE_NODE[l.tense]) { teaches = [TENSE_NODE[l.tense]]; how = 'pcic'; conf = 0.95; method.tense++; }
  else {
    const hit = new Map<string, number>();
    for (const c of (l.pcic as string[] | undefined) ?? []) for (const n of pcicIndex.get(c) ?? []) hit.set(n, (hit.get(n) ?? 0) + 1);
    if (hit.size) {
      teaches = [...hit].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 3).map((x) => x[0]);
      const top = Math.max(...hit.values()); const total = (l.pcic as string[]).length;
      how = 'pcic'; conf = Math.min(0.9, 0.6 + 0.3 * (top / total)); method.pcic++;
    } else {
      const fresh = [...count].filter(([n]) => !n.startsWith('l:') && !taught.has(n));
      if (fresh.length) {
        fresh.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        teaches = fresh.slice(0, 3).map((x) => x[0]); how = 'new-in-order';
        conf = Math.min(0.6, 0.25 + 0.35 * (fresh[0][1] / Math.max(1, rowReqs.length))); method['new-in-order']++;
      } else {
        const all = [...count].filter(([n]) => !n.startsWith('l:')).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        teaches = all.slice(0, 3).map((x) => x[0]); how = 'frequency'; conf = teaches.length ? 0.2 : 0.05;
        if (teaches.length) method.frequency++; else method.none++;
      }
    }
  }
  teaches.forEach((n) => taught.add(n));
  rowNodes.set(id, [...count.keys()]);
  const uses = [...count.keys()].filter((n) => !teaches.includes(n)).sort();
  LN[id] = { teaches, uses, confidence: Math.round(conf * 100) / 100, how };
  detail.push({ id, title: l.title, summary: String(l.summary ?? '').replace(/<[^>]+>/g, '').split(/(?<=[.!?])\s/)[0], how, confidence: LN[id].confidence, teaches, strand: l.strand });
}
/* overrides: applied after derivation, so they do not change what later lessons derive. uses = the lesson's row nodes minus what it teaches. */
const OVR = join(ROOT, 'tools/lesson-nodes.overrides.json');
const overrides: Record<string, { teaches: string[]; note?: string }> = existsSync(OVR) ? JSON.parse(readFileSync(OVR, 'utf8')) : {};
let nOverride = 0;
for (const [id, o] of Object.entries(overrides)) {
  if (!LN[id]) throw new Error(`override: ${id} is not a lesson in course order`);
  for (const n of o.teaches) if (!graph.ids.has(n)) throw new Error(`override ${id}: ${n} is not in the graph`);
  const teaches = [...new Set(o.teaches)];
  LN[id] = { teaches, uses: rowNodes.get(id)!.filter((n) => !teaches.includes(n)).sort(), confidence: 1, how: 'override' };
  const d = detail.find((x) => x.id === id)!; d.how = 'override'; d.confidence = 1; d.teaches = teaches;
  nOverride++;
}
writeFileSync(join(ROOT, 'data/lesson-nodes.js'),
  `/* GENERATED by tools/tag-data.ts. Do not edit. Lesson id -> graph nodes it teaches / uses, in course order. */\nwindow.LESSON_NODES = {\n${Object.entries(LN).map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(',\n')}\n};\n`);

/* ---------- graph.js ---------- */
const KEEP = ['id', 'kind', 'band', 'priority', 'pcic', 'forms', 'tags', 'requires', 'contrasts', 'unpacks', 'serves', 'title', 'label', 'es', 'en'];
const nodes = [...graph.nodes.values()].map((n) => {
  const o: Record<string, unknown> = {};
  for (const k of KEEP) { const v = (n as any)[k]; if (v === undefined || (Array.isArray(v) && !v.length)) continue; o[k] = v; }
  if (n.kind === 'lexeme') delete o.forms;
  return o;
});
const gjs = `/* GENERATED by tools/tag-data.ts from app/content/graph. Edges are the requires / contrasts / serves lists on each node. */\nwindow.GRAPH = {nodes:[\n${nodes.map((n) => JSON.stringify(n)).join(',\n')}\n]};\n`;
writeFileSync(join(ROOT, 'data/graph.js'), gjs);

/* ---------- report ---------- */
const pct = (a: number, b: number) => (b ? ((100 * a) / b).toFixed(1) : '0') + '%';
const md: string[] = [];
md.push('# Tagging report (Stage 1)', '', `Generated by \`tools/tag-data.ts\`. Graph: ${graph.nodes.size} nodes.`, '');
md.push('## Counts per content type', '', '| type | items | rows tagged | low-confidence rows |', '|---|---|---|---|');
for (const [t, s] of typeStats) md.push(`| ${t} | ${s.items} | ${s.rows} | ${s.low} (${pct(s.low, s.rows)}) |`);
md.push('', `Total rows ${nRows}, low-confidence ${nLow} (${pct(nLow, nRows)}). requires.js keys: ${sortedKeys.length}.`, '');
const reqLow = sortedKeys.filter((k) => REQ[k].c === 'low').length;
md.push(`Entries (not rows) marked low: ${reqLow} of ${sortedKeys.length} (${pct(reqLow, sortedKeys.length)}).`, '');
md.push('## Top low-confidence reasons (rows)', '');
[...reasons].sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([r, n]) => md.push(`- ${n} x ${r}`));
md.push('', '## Lesson mapping method', '', `Lessons mapped: ${detail.length}.`, '');
md.push(`- pcic codes: ${method.pcic}`, `- tense lessons (tense key map): ${method.tense}`, `- new-in-order: ${method['new-in-order']}`, `- frequency fallback: ${method.frequency}`, `- nothing found: ${method.none}`, '');
md.push(`Overrides from tools/lesson-nodes.overrides.json applied after derivation: ${nOverride} (how "override", confidence 1). The counts above are what derivation chose before them.`, '');
md.push('Tense key mapping used: ' + Object.entries(TENSE_NODE).map(([t, n]) => `${t} -> ${n}`).join(', '), '');
md.push('## 40 lowest-confidence lesson mappings', '', '| lesson | title | how | conf | summary (first sentence) | proposed nodes |', '|---|---|---|---|---|---|');
detail.slice().sort((a, b) => a.confidence - b.confidence || a.id.localeCompare(b.id)).slice(0, 40)
  .forEach((d) => md.push(`| ${d.id} | ${d.title.replace(/\|/g, '/')} | ${d.how} | ${d.confidence} | ${d.summary.replace(/\|/g, '/')} | ${d.teaches.join(', ') || '(none)'} |`));
const taughtAll = new Set<string>(); for (const v of Object.values(LN)) v.teaches.forEach((n) => taughtAll.add(n));
const untaught = [...graph.nodes.values()].filter((n) => n.kind === 'grammar' && !taughtAll.has(n.id)).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
const untaughtAny = [...graph.nodes.values()].filter((n) => n.kind !== 'lexeme' && n.kind !== 'cando' && !taughtAll.has(n.id)).length;
md.push('', `## Nodes no old lesson teaches`, '', `Non-lexeme, non-cando nodes with no teaching lesson: ${untaughtAny}. Grammar nodes only: ${untaught.length} of ${nodesByKind(graph, 'grammar').length}. First 20 grammar nodes by priority:`, '');
untaught.slice(0, 20).forEach((n) => md.push(`- ${n.id} (${n.band}, p${n.priority}) ${n.title}`));
if (notes.length) md.push('', '## Did not tag cleanly', '', ...notes.map((n) => `- ${n}`));
/* a hand-written "## Review of the map" section, and everything after it, survives regeneration */
const REPORT = join(ROOT, 'docs/plan-2026-11-04/tagging-report.md');
const prev = existsSync(REPORT) ? readFileSync(REPORT, 'utf8') : '';
const keep = prev.indexOf('\n## Review of the map');
writeFileSync(REPORT, md.join('\n') + '\n' + (keep >= 0 ? prev.slice(keep) : ''));

const mem = process.memoryUsage();
console.log(JSON.stringify({ secs: (Date.now() - t0) / 1000, rssMB: Math.round(mem.rss / 1e6), groups: groups.length, rows: nRows, low: nLow, reqKeys: sortedKeys.length, lessons: detail.length, method, overrides: nOverride, graphBytes: gjs.length, notes: notes.length }));

writeSplit();
console.log('split data/lessons and data/requires by band');
