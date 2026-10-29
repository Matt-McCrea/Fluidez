// Per-day bank supply report.
//   npx tsx tools/supply/day-supply.ts [--from u01] [--to u21] [--full] [--jobs]
// Prints a table of every (unit, day, node) with the rows the compiler could serve that day,
// flags the ones under the minimums, and writes content/_reports/day-supply.json.
// --full prints every unit's table (default: u01 to u03 in full, a summary for the rest).
// --jobs also writes content/_queue/pending-bank-topup.jsonl (one banktop-uNN job per unit).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BankSentence, Scene, WritingTask } from '../../src/content/schema';
import { listJson, loadCurriculum, loadFile, type Curriculum } from '../gate/load';
import { computeDaySupply, computeSceneSupply, computeWritingSupply, isQuestion, MIN, MIN_TASKS, TARGET_TASKS, usableAt, type DaySupplyReport } from './day-supply-core';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const from = opt('--from', 'u01'), to = opt('--to', 'u21');

const cur = loadCurriculum(APP);
const rows: BankSentence[] = listJson(join(APP, 'content', 'bank')).flatMap((p) => { const f = loadFile(p, APP, null); return f.ok ? (f.data as BankSentence[]) : []; });
const inRange = new Set(cur.units.map((u) => u.id).filter((id) => id >= from && id <= to));
const rep: DaySupplyReport = computeDaySupply(cur, rows, { units: inRange });

const tasks: WritingTask[] = listJson(join(APP, 'content', 'writing')).flatMap((p) => { const f = loadFile(p, APP, null); return f.ok ? (f.data as WritingTask[]) : []; });
const scenes: Scene[] = listJson(join(APP, 'content', 'scenes')).flatMap((p) => { const f = loadFile(p, APP, null); return f.ok ? [f.data as Scene] : []; });
const writing = computeWritingSupply(cur, tasks, { units: inRange });
const sceneSup = computeSceneSupply(cur, scenes, { units: inRange });

writeFileSync(join(APP, 'content/_reports/day-supply.json'), JSON.stringify({ minimums: { ...MIN, writingTasks: MIN_TASKS, writingTarget: TARGET_TASKS, scenes: 1 }, rows: rows.length, ...rep, writing, scenes: sceneSup }, null, 2) + '\n');

const pad = (s: string | number, n: number) => String(s).padEnd(n);
const line = (...c: Array<string | number>) => [4, 4, 11, 28, 7, 7, 5, 5].map((w, i) => pad(c[i] ?? '', w)).join(' ');
const fullUnits = args.includes('--full') ? inRange : new Set([...inRange].filter((u) => u <= 'u03'));
console.log(line('unit', 'day', 'type', 'node', 'usable', 'strict', 'qs', 'min') + 'flag');
for (const d of rep.days) {
  if (!fullUnits.has(d.unit)) continue;
  for (const n of d.nodes) {
    const flags = [n.short ? `SHORT ${n.min - n.usable}` : '', n.shortQuestions ? `QS ${n.minQuestions - n.questions}` : ''].filter(Boolean).join(' ');
    console.log(line(d.unit, d.day, d.type, n.node, n.usable, n.usableStrict, n.questions, n.min) + flags);
  }
}
console.log('\nunit-wide (usable by the node\'s drill day, min ' + MIN.unitByDrill + ')');
for (const n of rep.unitNodes) if (fullUnits.has(n.unit)) console.log(line(n.unit, n.drillDay, 'unit', n.node, n.usable, '', '', n.min) + (n.short ? `SHORT ${n.min - n.usable}` : ''));
console.log('\nremix-usable rows per day (rows with a grammar target):');
for (const u of fullUnits) console.log(u, rep.days.filter((d) => d.unit === u).map((d) => d.remixUsable).join(' '));
console.log('untargetable (no bank row targets them, skipped):', rep.untargetable.join(' ') || 'none');

/* ---- per (unit, node) shortfall ---------------------------------------------- */
interface Short { unit: string; node: string; firstDay: number; firstSession: number; rowsMissing: number; qsMissing: number; unitMissing: number; drillDay: number; drillSession: number }
const shorts: Short[] = [];
for (const u of cur.units) {
  if (!inRange.has(u.id)) continue;
  const nodes = new Set<string>();
  for (const d of rep.days) if (d.unit === u.id) for (const n of d.nodes) nodes.add(n.node);
  for (const node of nodes) {
    const di = u.days.findIndex((d) => d.focus.includes(node));
    const firstSession = cur.daySession.get(`${u.id}#${di}`)!;
    const mine = rows.filter((b) => b.targets.includes(node));
    const ok = mine.filter((b) => usableAt(cur, b, firstSession));
    const rowsMissing = Math.max(0, MIN.firstDayRows - ok.length);
    const qsMissing = Math.max(0, MIN.firstDayQuestions - ok.filter(isQuestion).length);
    const un = rep.unitNodes.find((x) => x.unit === u.id && x.node === node);
    const unitMissing = un ? Math.max(0, un.min - un.usable) : 0;
    const flagged = rep.days.some((d) => d.unit === u.id && d.nodes.some((n) => n.node === node && (n.short || n.shortQuestions)));
    // the first-day rule is the top-up target; a node flagged only by the day minima still gets it
    if (flagged || unitMissing > 0) shorts.push({ unit: u.id, node, firstDay: di + 1, firstSession, rowsMissing, qsMissing, unitMissing, drillDay: un?.drillDay ?? 0, drillSession: un?.session ?? 0 });
  }
}
console.log('\nsummary by unit (nodes under minimum, rows missing at first day / questions / unit-wide):');
const unitsList = [...inRange];
let totNodes = 0, totRows = 0;
for (const u of unitsList) {
  const s = shorts.filter((x) => x.unit === u);
  const rm = s.reduce((a, x) => a + Math.max(x.rowsMissing, x.unitMissing, x.qsMissing), 0);
  totNodes += s.length; totRows += rm;
  if (u > 'u03') console.log(u, `${s.length} nodes short, ${rm} rows missing`);
}
const later = shorts.filter((x) => x.unit > 'u03');
console.log(`u04 to ${to}: ${later.length} (unit, node) pairs short, ${later.reduce((a, x) => a + Math.max(x.rowsMissing, x.unitMissing, x.qsMissing), 0)} rows missing in total; all units: ${totNodes} pairs, ${totRows} rows`);

// the stricter view: lexemes count only when a unit day carries them (priority-only words are never introduced by the compiler)
const strictPairs = new Map<string, number>();
for (const d of rep.days) for (const n of d.nodes) if (n.usableStrict < n.min) strictPairs.set(`${d.unit} ${n.node}`, Math.max(strictPairs.get(`${d.unit} ${n.node}`) ?? 0, n.min - n.usableStrict));
const sl = [...strictPairs].filter(([k]) => k.slice(0, 3) > 'u03');
console.log(`strict view (day-listed lexemes only), u04 to ${to}: ${sl.length} (unit, node) pairs under their day minimum, ${sl.reduce((a, [, v]) => a + v, 0)} rows missing (largest gap per node); u01 to u03: ${strictPairs.size - sl.length} pairs`);

/* ---- writing and scenes ---------------------------------------------------------- */
console.log(`\nwriting: tasks focused on each grammar node usable by its drill day (min ${MIN_TASKS}, prompt asks ${TARGET_TASKS})`);
console.log(line('unit', 'day', 'type', 'node', 'usable', 'total', '', 'min') + 'flag');
for (const w of writing) if (fullUnits.has(w.unit)) console.log(line(w.unit, w.day, w.type, w.node, w.usable, w.total, '', w.min) + (w.short ? `SHORT ${w.min - w.usable}` : ''));
console.log(`\nscenes: output days (min 1 usable scene)`);
console.log(line('unit', 'day', 'named', 'usable scenes', 'spare', 'total', '', '') + 'flag');
for (const s of sceneSup) if (fullUnits.has(s.unit)) console.log(line(s.unit, s.day, s.named ?? '-', `${s.usable.length}${s.named ? (s.namedUsable ? ' (named ok)' : ' (named late)') : ''}`, s.spareUsable.length, s.total, '', 1) + (s.short ? 'SHORT 1' : ''));
const wShort = writing.filter((w) => w.short), sShort = sceneSup.filter((s) => s.short);
const wLater = wShort.filter((w) => w.unit > 'u03'), sLater = sShort.filter((s) => s.unit > 'u03');
console.log(`\nwriting short: u01 to u03 ${wShort.length - wLater.length} nodes; u04 to ${to}: ${wLater.length} nodes in ${new Set(wLater.map((w) => w.unit)).size} units. scenes short: u01 to u03 ${sShort.length - sLater.length} output days; u04 to ${to}: ${sLater.length} output days`);
for (const u of inRange) if (u > 'u03') { const a = wShort.filter((w) => w.unit === u).length, b = sShort.filter((s) => s.unit === u).length; if (a || b) console.log(u, `writing ${a} nodes short, scenes ${b} output days short`); }

if (args.includes('--jobs')) writeJobs(shorts);
if (args.includes('--writing-scene-jobs')) writeWritingSceneJobs(wShort, sShort);

/* ---- top-up jobs --------------------------------------------------------------- */
function writeJobs(all: Short[]): void {
  const template = readFileSync(join(APP, 'tools/burn/prompts/bank.md'), 'utf8');
  const jobsPrio = new Map<string, number>();
  for (const l of readFileSync(join(APP, 'content/_queue/jobs.jsonl'), 'utf8').split('\n')) {
    if (!l.trim()) continue;
    const j = JSON.parse(l);
    if (j.kind === 'review') jobsPrio.set(j.unit, j.priority);
  }
  const out: string[] = [];
  for (const u of cur.units) {
    const s = all.filter((x) => x.unit === u.id);
    if (!s.length || !inRange.has(u.id)) continue;
    const bankFile = join(APP, 'content/bank', u.id + '.json');
    const existing: BankSentence[] = existsSync(bankFile) ? JSON.parse(readFileSync(bankFile, 'utf8')) : [];
    const maxN = existing.reduce((m, b) => Math.max(m, Number(/-(\d+)$/.exec(b.id)?.[1] ?? 0)), 0);
    const base = fill(template, u.id, `/tmp/fluidez-burn/banktop-${u.id}`) + `\n\nTarget size for this unit: topped up, not rewritten (see below).`;
    const para = topUpParagraph(cur, u.id, s, existing.length, maxN);
    out.push(JSON.stringify({
      id: `banktop-${u.id}`, kind: 'bank', unit: u.id, band: u.band, priority: (jobsPrio.get(u.id) ?? 0) + 1, deps: [], status: 'pending', attempts: 0, model: 'sonnet',
      prompt: base + '\n\n' + para, outputs: [`content/bank/${u.id}.json`],
    }));
    if (para.length > 6000) console.log(`warning: ${u.id} top-up paragraph is ${para.length} chars`);
  }
  mkdirSync(join(APP, 'content/_queue'), { recursive: true });
  writeFileSync(join(APP, 'content/_queue/pending-bank-topup.jsonl'), out.join('\n') + (out.length ? '\n' : ''));
  console.log(`wrote ${out.length} banktop jobs to content/_queue/pending-bank-topup.jsonl`);
}

function fill(t: string, unit: string, scratch: string): string {
  const vars = { UNIT: unit, APP, SCRATCH: scratch };
  for (const [k, v] of Object.entries(vars)) t = t.split(`{${k}}`).join(v);
  return `Inputs for this job (already filled in below):\n${Object.entries(vars).map(([k, v]) => `- ${k} = ${v}`).join('\n')}\n\n${t}`;
}

function topUpParagraph(c: Curriculum, unit: string, s: Short[], count: number, maxN: number): string {
  const u = c.units.find((x) => x.id === unit)!;
  const lines: string[] = [];
  lines.push(`## This job: top up`);
  lines.push(`content/bank/${unit}.json already has ${count} rows (last id number ${maxN}). Do NOT rewrite or reorder them. Read the file, then APPEND new rows with fresh ids continuing the numbering (${unit}-${String(maxN + 1).padStart(4, '0')} onwards), and write the whole array back with the old rows unchanged. The gate's dupe check compares against the existing rows. Every appended row must still pass the section 4 quality bar, the section 3 kind mix (about a fifth questions), and the legality gate at the end of ${unit}.`);
  lines.push(`The compiler serves a row on a day only if everything it requires is taught by that day, so the rows below must be legal EARLY. For each node, the rows must use only: the grammar, patterns and chunks listed ${unit === 'u01' ? '' : '(plus everything taught in every earlier unit)'}, and lexemes taught by that day (probe with chk.ts at the given session number, with the node itself allowed). Set targets to include the node.`);
  const dayIds = (n: number) => {
    const ids = new Set<string>();
    u.days.slice(0, n).forEach((d) => [...d.focus, ...d.chunks].forEach((x) => ids.add(x)));
    return [...ids].map((x) => x.replace(/^([gpcx]):/, '$1:'));
  };
  for (const x of s) {
    const need = Math.max(x.rowsMissing, x.unitMissing, x.qsMissing, 1);
    const ids = dayIds(x.firstDay);
    const gp = ids.filter((i) => /^[gpx]:/.test(i)).join(' ');
    const ch = ids.filter((i) => i.startsWith('c:')).map((i) => i.slice(2)).join(' ');
    const lexN = u.days.slice(0, x.firstDay).reduce((a, d) => a + d.lexemes.length, 0);
    const unitNote = x.unitMissing > 0 ? ` Also ${x.unitMissing} more rows usable by day ${x.drillDay} (session ${x.drillSession}); rows legal on the first day count toward this too.` : '';
    lines.push(`- ${x.node}: first day is day ${x.firstDay} of ${unit} (session ${x.firstSession}). Write ${need} row${need === 1 ? '' : 's'} legal by that day${x.qsMissing ? `, at least ${x.qsMissing} of them questions` : ''}.${unitNote} Allowed this unit: ${gp || 'no new grammar'}; chunks c:${ch || 'none'}; plus the ${lexN} lexemes of days 1 to ${x.firstDay} (see content/units/${unit}.json) and everything taught in earlier units.`);
  }
  return lines.join('\n');
}

/* ---- writing and scene top-up jobs -------------------------------------------------- */
function allowedUpTo(unit: string, day: number): string {
  const u = cur.units.find((x) => x.id === unit)!;
  const ids = new Set<string>();
  u.days.slice(0, day).forEach((d) => [...d.focus, ...d.chunks].forEach((x) => ids.add(x)));
  const all = [...ids];
  const gp = all.filter((i) => /^[gpx]:/.test(i)).map((i) => i.slice(2)).join(' ');
  const ch = all.filter((i) => i.startsWith('c:')).map((i) => i.slice(2)).join(' ');
  const lexN = u.days.slice(0, day).reduce((a, d) => a + d.lexemes.length, 0);
  return `grammar/patterns ${gp || 'none new'}; chunks ${ch || 'none'}; the ${lexN} lexemes of days 1 to ${day}; and everything taught in earlier units`;
}

function writeWritingSceneJobs(ws: typeof writing, ss: typeof sceneSup): void {
  const wTemplate = readFileSync(join(APP, 'tools/burn/prompts/writing.md'), 'utf8');
  const sTemplate = readFileSync(join(APP, 'tools/burn/prompts/scenes.md'), 'utf8');
  const prio = new Map<string, number>();
  for (const l of readFileSync(join(APP, 'content/_queue/jobs.jsonl'), 'utf8').split('\n')) {
    if (!l.trim()) continue;
    const j = JSON.parse(l);
    if (j.kind === 'review') prio.set(j.unit, j.priority);
  }
  const out: string[] = [];
  for (const u of cur.units) {
    if (!inRange.has(u.id)) continue;
    const base = { unit: u.id, band: u.band, priority: (prio.get(u.id) ?? 0) + 1, deps: [] as string[], status: 'pending', attempts: 0 };
    const w = ws.filter((x) => x.unit === u.id);
    if (w.length) {
      const file = join(APP, 'content/writing', u.id + '.json');
      const existing: WritingTask[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];
      const maxN = existing.reduce((m, t) => Math.max(m, Number(/-(\d+)$/.exec(t.id)?.[1] ?? 0)), 0);
      const lines = [`## This job: top up`,
        `content/writing/${u.id}.json already has ${existing.length} tasks (last id number ${maxN}). Do NOT rewrite or reorder them. Read the file, then APPEND new tasks with fresh ids continuing the numbering (w-${u.id}-${String(maxN + 1).padStart(2, '0')} onwards), and write the whole array back with the old tasks unchanged. COUNT does not apply: write exactly the tasks below. The compiler serves a task on a node's drill day only when its model requires nothing taught after that day, so each task's constraints and model must use only what is taught up to the named day (probe the model with the wr.ts snippet and check \`requires\` against the day).`];
      for (const x of w) {
        const need = TARGET_TASKS - x.usable;
        lines.push(`- ${x.node}: drill day is day ${x.day} of ${u.id} (session ${x.session}); ${x.usable} usable of ${x.total} focused. Write ${need} task${need === 1 ? '' : 's'} with focus ${x.node}, constraints and model using only: ${allowedUpTo(u.id, x.day)}.`);
      }
      out.push(JSON.stringify({ id: `writetop-${u.id}`, kind: 'writing', ...base, model: 'sonnet', prompt: fill(wTemplate, u.id, `/tmp/fluidez-burn/writetop-${u.id}`).replace('- APP =', `- COUNT = ${w.reduce((a, x) => a + TARGET_TASKS - x.usable, 0)}\n- APP =`) + '\n\n' + lines.join('\n'), outputs: [`content/writing/${u.id}.json`] }));
    }
    const s = ss.filter((x) => x.unit === u.id);
    if (s.length) {
      const files = scenes.filter((x) => x.unit === u.id).map((x) => x.id);
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      const next = letters[files.length] ?? 'z';
      const newIds = [`sc-${u.id}-${next}`];
      const lines = [`## This job: top up`,
        `The unit already has scenes ${files.join(' ') || 'none'} in content/scenes/. Do NOT rewrite or edit them. APPEND by writing NEW scene files with fresh ids (starting at ${newIds[0]}, continuing the letters), one file each. SCENES for this job is just the new ids. Ignore the quota count. Each new scene must be legal by the day stated below (NPC lines and every accept).`];
      for (const x of s) lines.push(`- Output day ${x.day} of ${u.id} (session ${x.session}), named scene ${x.named ?? 'none'}${x.named ? (x.namedUsable ? ' (usable)' : ' (requires something taught later; do not edit it)') : ''}; usable scenes now: ${x.usable.length}. Write 1 non-spare scene${x.named && !x.namedUsable ? ` (it will be wired in as the day's scene by hand)` : ''} using only: ${allowedUpTo(u.id, x.day)}.`);
      out.push(JSON.stringify({ id: `scenetop-${u.id}`, kind: 'scenes', ...base, model: 'opus', prompt: fill(sTemplate, u.id, `/tmp/fluidez-burn/scenetop-${u.id}`).replace(/- SCENES = .*\n/, '') .replace('- APP =', `- SCENES = ${newIds.join(' ')}\n- APP =`) + '\n\n' + lines.join('\n'), outputs: newIds.map((i) => `content/scenes/${i}.json`) }));
    }
  }
  writeFileSync(join(APP, 'content/_queue/pending-writing-scene-topup.jsonl'), out.join('\n') + (out.length ? '\n' : ''));
  console.log(`wrote ${out.length} writetop/scenetop jobs to content/_queue/pending-writing-scene-topup.jsonl`);
}
