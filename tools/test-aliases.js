#!/usr/bin/env node
/* ============================================================================
 * test-aliases.js: lesson aliases (data/lesson-aliases.js, window.LESSON_ALIASES) and the un-merge.
 *
 *   node tools/test-aliases.js
 *
 * A lesson the re-sequenced course merged into another resolves to its target wherever a lesson id is
 * looked up (Lessons.canon / byId), counts as studied through the target, writes the target when marked,
 * and is cleared with it. With no LESSON_ALIASES loaded everything is the identity (the old behaviour).
 * nt-frecuencia-a1 is no longer merged into nt-referencias-generales-a1, and no merge group has two
 * members on the path.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.window = global;
const FILES = ['data/taxonomy.js', 'data/connectors.js', 'data/verbs.js', 'data/vocab.js', 'data/idioms.js',
  'data/grammar-docs.js', 'data/grammar.js', 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js',
  'data/strand-lessons.js', 'data/course.js', 'js/engine.js', 'js/lessons.js'];
FILES.forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));

let n = 0, fails = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL  ' + m); } }
const L = window.Lessons;

/* the alias table: the real data file when it exists, else the proposal's copy */
function loadAliases() {
  for (const f of ['data/lesson-aliases.js', 'tools/reseq/out/lesson-aliases.proposed.js']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    const w = {}; new Function('window', fs.readFileSync(p, 'utf8'))(w);
    return { file: f, table: w.LESSON_ALIASES || w.LESSON_ALIASES_PROPOSED };
  }
  return null;
}
function pathLessons(file) {
  const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, file), 'utf8'))(w);
  return new Set((w.COURSE_DAYS || []).filter(d => d.lesson).map(d => d.lesson));
}

/* ---- 1. no table: the identity -------------------------------------------- */
delete window.LESSON_ALIASES;
ok(L.canon('gr-numerales-a1') === 'gr-numerales-a1' && !L.isAlias('gr-numerales-a1'), 'no table: canon is the identity');
ok(L.isStudied({ a: 1 }, 'a') && !L.isStudied({ a: 1 }, 'b'), 'no table: isStudied is a plain lookup');
const plain = { x: 1 }; ok(L.normalizeStudied(plain) === false && Object.keys(plain).join() === 'x', 'no table: normalizeStudied changes nothing');

/* ---- 2. a table -------------------------------------------------------------- */
const A = loadAliases();
ok(!!A && A.table && Object.keys(A.table).length > 50, 'an alias table is available (' + (A && A.file) + ')');
window.LESSON_ALIASES = A.table;
const pairs = Object.keys(A.table).filter(k => L.byId(A.table[k]));
ok(pairs.length > 0, 'some alias targets are real lessons (' + pairs.length + ' of ' + Object.keys(A.table).length + ')');
const src = pairs[0], tgt = A.table[src];
ok(L.canon(src) === tgt && L.isAlias(src) && !L.isAlias(tgt), 'canon resolves ' + src + ' to ' + tgt);
ok(L.byId(src) && L.byId(src).id === tgt && L.lessonById(src) === L.byId(tgt), 'byId resolves a merged id to the target lesson');
ok(L.byId('no-such-lesson') === null, 'byId of an unknown id is null');
ok(L.idsOf(tgt)[0] === tgt && L.idsOf(tgt).indexOf(src) > 0 && L.idsOf(src)[0] === tgt, 'idsOf lists the target first, then what merged into it');
// a target with several sources (gender-articles takes two)
const multi = Object.keys(A.table).map(k => A.table[k]).filter((t, i, a) => a.indexOf(t) !== i)[0];
ok(!!multi && L.idsOf(multi).length >= 3, 'a target with two sources lists both (' + multi + ')');
ok(L.aliasSources().length === Object.keys(A.table).length, 'aliasSources has every entry');

// a chain resolves to the last target
window.LESSON_ALIASES = Object.assign({}, A.table, { 'zz-a': 'zz-b', 'zz-b': 'zz-c' });
ok(L.canon('zz-a') === 'zz-c', 'a chain of merges resolves to the last target');
window.LESSON_ALIASES = Object.assign({}, A.table, { 'zz-loop': 'zz-loop' });
ok(L.canon('zz-loop') === 'zz-loop', 'a self alias is ignored');
window.LESSON_ALIASES = A.table;

/* ---- 3. studied -------------------------------------------------------------- */
ok(L.isStudied({ [src]: 1 }, tgt), 'a studied alias source counts the target studied');
ok(L.isStudied({ [tgt]: 1 }, src), 'a studied target counts a merged id studied');
ok(!L.isStudied({}, tgt), 'nothing studied: not studied');
const st = { [src]: 1, other: 1 };
ok(L.normalizeStudied(st) === true && st[tgt] === 1 && st[src] === 1 && st.other === 1, 'normalizeStudied copies the mark to the target and keeps the source key');
ok(L.normalizeStudied(st) === false, 'normalizeStudied is idempotent');
const mk = {}; L.markStudied(mk, src);
ok(mk[tgt] === 1 && !(src in mk), 'marking a merged id writes the target');
const both = { [src]: 1, [tgt]: 1 }; L.unmarkStudied(both, tgt);
ok(!L.isStudied(both, tgt) && !L.isStudied(both, src), 'un-marking clears the target and what merged into it');

/* ---- 4. the stored map and the unit check ----------------------------------- */
store['fluidez.progress'] = JSON.stringify({ studied: { [src]: 1 } });
const UI = { t: (a, b) => b || a, shuffle: a => a.slice(), el: () => ({}) };
window.UI = UI;
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/unitcheck.js'), 'utf8'));
const day = window.COURSE_DAYS.findIndex(d => d.lesson === tgt);
if (day >= 0) {
  const unit = window.COURSE_UNITS[window.COURSE_DAYS[day].unit];
  const before = window.UnitCheck.doneCount(unit);
  ok(before >= 1, 'UnitCheck counts a studied alias source toward its target\'s unit');
  window.UnitCheck.setUnit(unit, false);
  const after = JSON.parse(store['fluidez.progress']).studied;
  ok(!after[src] && !after[tgt], 'UnitCheck un-marking a unit clears the merged source as well');
  window.UnitCheck.setUnit(unit, true);
  ok(JSON.parse(store['fluidez.progress']).studied[tgt] === 1, 'UnitCheck marking a unit writes the targets');
} else console.log('note: ' + tgt + ' is not on the active course, unit check part skipped');

/* ---- 5. the un-merge --------------------------------------------------------- */
const all = {}; (window.ALL_LESSONS || []).forEach(l => { all[l.id] = l; });
ok(all['nt-referencias-generales-a1'] && all['nt-frecuencia-a1'], 'both lessons exist');
ok(!(all['nt-referencias-generales-a1'].mergedFrom || []).includes('nt-frecuencia-a1'), 'nt-referencias-generales-a1 no longer carries nt-frecuencia-a1');
ok((all['nt-frecuencia-a1'].mergedFrom || []).length === 0 || all['nt-frecuencia-a1'].mergedFrom[0] === 'nt-frecuencia-a1', 'nt-frecuencia-a1 is a lesson of its own');
ok(!window.LESSON_MERGE_GROUPS.some(g => g.includes('nt-frecuencia-a1')), 'no merge group names nt-frecuencia-a1');
for (const f of ['data/course.js', 'tools/reseq/out/course.proposed.js']) {
  if (!fs.existsSync(path.join(ROOT, f))) continue;
  const onPath = pathLessons(f);
  const twice = window.LESSON_MERGE_GROUPS.filter(g => g.filter(id => onPath.has(id)).length > 1);
  ok(twice.length === 0, f + ': no merge group has two members on the path' + (twice.length ? ' (' + twice.map(g => g.join('+')).join('; ') + ')' : ''));
}

console.log(fails ? '\n' + fails + ' FAILED of ' + n : '\n' + n + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
