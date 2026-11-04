// Shared inputs for the Stage 6 re-sequence tools (build.ts, simulate.ts, reconcile.ts).
// Reads the app's data in a vm (as tools/tag-data.ts does), SEQ's tables (through load.js, which
// audit-csv.js also uses), the skill graph, LESSON_NODES, REQUIRES and, on demand, the bank.
// Nothing here writes.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import vm from 'node:vm';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
const SEQ_PATH = join(ROOT, 'docs/research/Fluidez Spanish course sequencing.md');

export function runFiles(files: string[], ctx: any = { window: {}, console }): any {
  vm.createContext(ctx);
  for (const f of files) vm.runInContext(readFileSync(join(ROOT, f), 'utf8'), ctx, { filename: f });
  return ctx.window;
}

/** The app as the gate sees it: lessons, the live course, the skill graph, what each lesson teaches, what each item requires. */
export function loadApp(): any {
  return runFiles(['data/taxonomy.js', 'data/connectors.js', 'data/rubrics.js', 'data/strand-lessons.js', 'data/course.js',
    'data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js', 'data/passages.js',
    'data/apply.js', 'data/writing.js', 'data/topics.js', 'js/engine.js', 'js/lessons.js',
    'data/graph.js', 'data/lesson-nodes.js', 'data/requires.js']);
}

/** A course file (data/course.js or tools/reseq/out/course.proposed.js) on its own: COURSE, COURSE_DAYS, COURSE_UNITS, COURSE_BANDS. */
export function loadCourse(file: string): any { return runFiles([file]); }

export const BANK_BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
export type BankRow = { id: string; es: string; r: string[]; t: string[]; d: number };
/** Every bank row (about 72k), all bands: the band a row was filed under came from the old spine. */
export function loadBank(): BankRow[] {
  const out: BankRow[] = [];
  for (const b of BANK_BANDS) {
    const W = runFiles([`data/bank/${b}.js`]);
    for (const r of W['BANK_' + b] as any[]) out.push({ id: r.id, es: r.es, r: r.r || [], t: r.t || [], d: r.d });
  }
  return out;
}

/* ---------- SEQ ---------- */
export type SeqRow = { lesson_id: string; action: string; new_day: string; new_unit: string; reason: string; target: string; old_day: string; source: string };
export type SeqUnit = { id: string; band: string; theme: string; from: number; to: number; goal: string; verbDays: number[]; verbHeads: string[]; practice: number[]; verbCount: number };

export function loadSeq() {
  const md = readFileSync(SEQ_PATH, 'utf8');
  const rows: SeqRow[] = require('./load.js').loadCsv();
  const NEW: Record<string, { day: number; title: string; purpose: string }> = {};
  md.split('## Seventeen new lessons')[1].split('\n## ')[0].split('\n').forEach((l) => {
    const m = l.match(/^\| ([a-z0-9-]+) \| (.*?) \| (\d+) \| (.*?) \|$/);
    if (m) NEW[m[1]] = { title: m[2], day: +m[3], purpose: m[4] };
  });
  const units: SeqUnit[] = [];
  md.split('\n').forEach((l) => {
    let m = l.match(/^\| ([ab][12]-n\d\d) \| (.*?) \| (\d+)–(\d+) \| (.*?) \| (\d+) \| (.*?) \| (\d+) \|$/);
    if (m) {
      const vd = m[7].trim() === '—' ? [] : m[7].split(',').map((s) => s.trim());
      units.push({ id: m[1], band: m[1].slice(0, 2).toUpperCase(), theme: m[2], from: +m[3], to: +m[4], goal: m[5],
        verbDays: vd.map((s) => +s.split(' ')[0]), verbHeads: vd.map((s) => (s.match(/\(([a-záéíóú]+)/) || [])[1] || ''),
        practice: [+m[8]], verbCount: vd.length });
      return;
    }
    m = l.match(/^\| (b1-n\d\d) \| (.*?) \| (\d+)–(\d+) \| (\d+) \| (\d+) \| (\d+) \+ (\d+) \|$/);
    if (m) units.push({ id: m[1], band: 'B1', theme: m[2].replace(/\s*\(.*\)$/, ''), from: +m[3], to: +m[4], goal: '',
      verbDays: [], verbHeads: [], practice: [], verbCount: +m[6] });
  });
  return { md, rows, NEW, units };
}

/* ---------- kinds ---------- */
const TENSE_IDS = new Set(['presente', 'ser-estar', 'gender-articles', 'preterito', 'imperfecto', 'preterite-imperfect', 'por-para',
  'futuro', 'condicional', 'impsubj', 'futperf', 'condperf', 'perfsubj', 'impneg']);
/** grammar: a grammar-strand lesson, a tense or concept lesson, or a gr- stub. Everything else that is not a task is input. */
export function lessonKind(id: string): 'grammar' | 'task' | 'input' {
  if (id.startsWith('task-')) return 'task';
  if (TENSE_IDS.has(id) || id.startsWith('gr-')) return 'grammar';
  return 'input';
}
export const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
