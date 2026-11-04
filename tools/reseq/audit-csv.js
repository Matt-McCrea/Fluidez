/* ============================================================================
 * RESEQUENCING AUDIT — run:  node tools/reseq/audit-csv.js
 *
 * Phase 0 of the restructure in docs/research (SEQ = "Fluidez Spanish course
 * sequencing.md"). Reads the "Full lesson table" CSV, the new-lesson table and
 * the unit tables straight out of SEQ — nothing is retyped here, so if SEQ is
 * revised this re-checks the revision — and holds them against the app as
 * data/course.js and js/lessons.js build it today.
 *
 * Writes nothing. Exit code 1 if any check fails.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const { ROOT, loadApp, loadCsv } = require('./load.js');

const W = loadApp(), rows = loadCsv();
const md = fs.readFileSync(path.join(ROOT, 'docs/research/Fluidez Spanish course sequencing.md'), 'utf8');
let fails = 0;
function check(cond, msg) { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) fails++; }
const isDay = v => /^\d+$/.test(v);

/* ---- SEQ's own tables ---------------------------------------------------- */
const NEW = {};   // id -> day
md.split('## Seventeen new lessons')[1].split('\n## ')[0].split('\n')
  .forEach(l => { const m = l.match(/^\| ([a-z0-9-]+) \| .*? \| (\d+) \|/); if (m) NEW[m[1]] = +m[2]; });
const UNITS = [];  // { id, from, to, lessons, verbDays, otherDays }
md.split('\n').forEach(l => {
  let m = l.match(/^\| ([ab][12]-n\d\d) \| .*? \| (\d+)–(\d+) \| .*? \| (\d+) \| (.*?) \| (\d+) \|$/);
  if (m) return UNITS.push({ id: m[1], from: +m[2], to: +m[3], lessons: +m[4],
    verbDays: m[5].trim() === '—' ? [] : m[5].split(',').map(s => +s.trim().split(' ')[0]), other: [+m[6]] });
  m = l.match(/^\| (b1-n\d\d) \| .*? \| (\d+)–(\d+) \| (\d+) \| (\d+) \| (\d+) \+ (\d+) \|$/);
  if (m) UNITS.push({ id: m[1], from: +m[2], to: +m[3], lessons: +m[4], verbDays: +m[5], other: +m[6] + +m[7] });
});

/* ---- 1. totals against what SEQ states ---------------------------------- */
console.log('\nTotals (SEQ states: 674 ids; 295 keep, 146 move, 96 merge, 6 split, 125 optional, 6 cut)');
const by = {}; rows.forEach(r => { by[r.action] = (by[r.action] || 0) + 1; });
const want = { keep: 295, move: 146, merge: 96, split: 6, 'make optional': 125, cut: 6 };
check(rows.length === 674, `ids: ${rows.length}`);
Object.keys(want).forEach(a => check(by[a] === want[a], `${a}: ${by[a]}`));
check(Object.keys(NEW).length === 17, `new lessons parsed from SEQ: ${Object.keys(NEW).length}`);

/* ---- 2. ids against the app --------------------------------------------- */
console.log('\nIds');
const app = new Set(W.ALL_LESSONS.map(l => l.id)), csv = new Set(rows.map(r => r.lesson_id));
const missing = [...csv].filter(i => !app.has(i)), extra = [...app].filter(i => !csv.has(i));
check(csv.size === rows.length, 'no duplicate ids in the CSV');
check(!missing.length, `CSV ids missing from the app: ${missing.join(', ') || 'none'}`);
check(!extra.length, `app ids missing from the CSV: ${extra.join(', ') || 'none'}`);
const clash = Object.keys(NEW).filter(i => app.has(i));
check(!clash.length, `new-lesson ids not already taken: ${clash.join(', ') || 'none'}`);

/* ---- 3. structural integrity -------------------------------------------- */
console.log('\nMerges, splits, cuts');
const row = Object.fromEntries(rows.map(r => [r.lesson_id, r]));
const badMerge = rows.filter(r => r.action === 'merge').filter(r => {
  const t = row[r.target];
  if (!t) return !(r.target in NEW) || String(NEW[r.target]) !== r.new_day;
  return t.action === 'merge' || t.action === 'cut' || t.new_day !== r.new_day;
});
check(!badMerge.length, `every merge target exists, survives, and sits where the merge says (${badMerge.map(r => r.lesson_id).join(', ') || 'ok'})`);
const badSplit = rows.filter(r => r.action === 'split').filter(r => {
  const parts = r.target.split(' + ');
  return parts[0] !== r.lesson_id || parts.slice(1).some(p => !(p in NEW));
});
check(!badSplit.length, `every split keeps its own id and names new parts (${badSplit.map(r => r.lesson_id).join(', ') || 'ok'})`);
const optDay = rows.filter(r => (r.action === 'make optional' || r.action === 'cut') && isDay(r.new_day));
check(!optDay.length, 'no optional or cut lesson carries a path position');

/* ---- 4. old_day is the live course -------------------------------------- */
console.log('\nold_day against data/course.js');
const pos = {}; W.COURSE_DAYS.forEach((d, i) => { if (d.lesson) pos[d.lesson] = i; });
const drift = rows.filter(r => r.source === 'inv2' && String(pos[r.lesson_id]) !== r.old_day);
check(W.COURSE_DAYS.length === 663, `current path length: ${W.COURSE_DAYS.length} (SEQ: 663)`);
check(!drift.length, `old_day matches today's position for every path lesson (${drift.length} drift)`);

/* ---- 5. the new path ---------------------------------------------------- */
console.log('\nNew path (SEQ: 537 days = 399 lessons + 28 verb days + 110 practice/review/writing)');
const at = {};
const collide = [];
rows.filter(r => isDay(r.new_day) && r.action !== 'merge')
  .concat(Object.entries(NEW).map(([id, d]) => ({ lesson_id: id, new_day: String(d), new_unit: null })))
  .forEach(r => { const d = +r.new_day; if (at[d]) collide.push(d); at[d] = r; });
const nLessons = Object.keys(at).length;
check(!collide.length, `no two lessons on one position (${collide.join(', ') || 'none'})`);
check(nLessons === 399, `path lessons: ${nLessons}`);
let verb = 0, other = 0, unitIssues = [];
UNITS.forEach(u => {
  const ls = []; for (let d = u.from; d <= u.to; d++) if (at[d]) ls.push(d);
  const v = Array.isArray(u.verbDays) ? u.verbDays.length : u.verbDays;
  const o = Array.isArray(u.other) ? u.other.length : u.other;
  verb += v; other += o;
  if (ls.length !== u.lessons) unitIssues.push(`${u.id}: ${ls.length} lessons, SEQ says ${u.lessons}`);
  if (u.to - u.from + 1 !== ls.length + v + o) unitIssues.push(`${u.id}: length does not add up`);
  if (Array.isArray(u.verbDays)) u.verbDays.concat(u.other).forEach(d => { if (at[d]) unitIssues.push(`${u.id}: day ${d} is both a lesson and a verb/practice day`); });
  ls.forEach(d => { const un = at[d].new_unit; if (un && !un.startsWith(u.id)) unitIssues.push(`${at[d].lesson_id}: unit column says ${un}`); });
});
// B2 and C1 are tabled in aggregate: 11 and 8 units with 1 review + 2 writing days each.
const fill = (f, t) => { let n = 0; for (let d = f; d <= t; d++) if (at[d]) n++; return t - f + 1 - n; };
other += fill(329, 440) + fill(441, 536);
check(!unitIssues.length, `A1–B1 unit tables reconcile (${unitIssues.join('; ') || 'ok'})`);
check(fill(329, 440) === 33 && fill(441, 536) === 24, `B2/C1 non-lesson days: ${fill(329, 440)} and ${fill(441, 536)} (11×3, 8×3)`);
check(verb === 28, `verb days: ${verb}`);
check(other === 110, `practice/review/writing days: ${other}`);
check(Math.max(...Object.keys(at).map(Number)) === 536 && nLessons + verb + other === 537, `path length: ${nLessons + verb + other}`);

/* ---- 6. verb sets ------------------------------------------------------- */
console.log('\nVerb days');
const sets = W.COURSE_DAYS.filter(d => d.verbs).map(d => d.verbs[0]);
const named = (md.match(/\d+ \(([a-záéíóú]+)…\)/g) || []).map(s => s.match(/\(([a-záéíóú]+)/)[1]);
const unnamed = sets.filter(v => !named.includes(v));
check(named.every(v => sets.includes(v)), `every set SEQ names exists (${named.length} named)`);
console.log(`  · sets SEQ leaves to B1 without naming a day: ${unnamed.join(', ')}`);

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks pass');
process.exit(fails ? 1 : 0);
