#!/usr/bin/env node
/* ============================================================================
 * todo.js — what is still to be written.
 *
 *   node tools/todo.js              summary by level and strand
 *   node tools/todo.js B1           the outstanding units for one level
 *   node tools/todo.js B1 function  ...and one strand
 *   node tools/todo.js --practice   the passage/apply/writing gap
 *
 * WHY: the syllabus unit ids (func-a1-identificar) and the lesson ids someone
 * writes (fn-identificar-a1) do not match, so there was no way to tell which
 * of the 1,071 units were done. "Work through the syllabus in order" then
 * means starting again at A1 every time. This matches the two up through the
 * PCIC ids each written lesson records, and prints only what is left.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
['data/taxonomy.js', 'data/strand-lessons.js', 'data/passages.js', 'data/apply.js', 'data/writing.js']
  .forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));

const spec = require(path.join(ROOT, 'spec', 'pcic.json'));
const syl = require(path.join(ROOT, 'spec', 'syllabus-draft.json'));

/* A written lesson records the PCIC ids it teaches. Resolve those back to the
 * inventory subsection they came from — that is what identifies a syllabus
 * unit, whatever the author called the lesson. */
const specById = new Map();
spec.forEach(i => specById.set(i.id, i));
/* A unit is a section > subsection > leaf triple, matching how syllabus.js
 * clustered them. Matching on the subsection alone was too coarse: one lesson
 * on the present tense would mark every tense in "9.1 Tiempos verbales" done. */
const unitKey = (inventory, section, subsection, leaf) =>
  [inventory, section || '', subsection || '', leaf || ''].join('||');

const written = new Map();                       // unit key -> [lesson ids]
(window.STRAND_LESSONS || []).forEach(l => {
  (l.pcic || []).forEach(id => {
    const it = specById.get(id);
    if (!it) return;
    const k = unitKey(it.inventory, it.section, it.subsection, it.path[0]);
    if (!written.has(k)) written.set(k, new Set());
    written.get(k).add(l.id);
  });
});

const INV = { grammar: 'gramatica', notion: 'nociones_generales', function: 'funciones',
              discourse: 'tacticas_pragmaticas', genre: 'generos_discursivos' };

const units = syl.lessons
  .filter(u => INV[u.type])
  .map(u => {
    const k = unitKey(INV[u.type], u.source.section, u.source.subsection, u.source.leaf);
    return Object.assign({}, u, { key: k, done: written.has(k) });
  });

const arg = process.argv.slice(2);
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const STRANDS = ['grammar', 'notion', 'function', 'discourse', 'genre'];

if (arg[0] === '--practice') {
  const band = n => n <= 1 ? 'A1' : n <= 3 ? 'A2' : n <= 5 ? 'B1' : n <= 7 ? 'B2' : 'C1';
  const TARGET = { passages: { A2: 62, B1: 81, B2: 80, C1: 80 },
                   apply: { B1: 141, B2: 120, C1: 120 },
                   writing: { B1: 78, B2: 80, C1: 80 } };
  console.log('PRACTICE MATERIAL — have / target\n');
  [['passages', window.PASSAGES], ['apply', window.APPLY_ITEMS], ['writing', window.WRITING_TASKS]]
    .forEach(([name, arr]) => {
      const have = {};
      (arr || []).forEach(x => { const b = band(x.level || 1); have[b] = (have[b] || 0) + 1; });
      console.log('  ' + name.padEnd(9) + LEVELS.map(l => {
        const h = have[l] || 0, t = (TARGET[name] || {})[l];
        return l + ' ' + String(h).padStart(3) + (t ? '/' + t : '    ');
      }).join('   '));
    });
  console.log('\n  A1 is complete. Targets are floors: below them a level repeats');
  console.log('  itself inside a few weeks.');
  process.exit(0);
}

const level = arg.find(a => LEVELS.indexOf(a.toUpperCase()) >= 0);
const strand = arg.find(a => STRANDS.indexOf(a) >= 0);

if (!level) {
  console.log('OUTSTANDING LESSONS — units with no lesson recording their PCIC ids\n');
  console.log('  level  ' + STRANDS.map(s => s.slice(0, 8).padStart(9)).join('') + '     total');
  let grand = 0;
  LEVELS.forEach(l => {
    const row = STRANDS.map(s => units.filter(u => u.cefr === l && u.type === s && !u.done).length);
    const t = row.reduce((a, b) => a + b, 0); grand += t;
    console.log('   ' + l.padEnd(7) + row.map(n => String(n).padStart(9)).join('') + String(t).padStart(10));
  });
  console.log('\n  TOTAL OUTSTANDING: ' + grand + ' of ' + units.length + ' units');
  console.log('\n  node tools/todo.js B1 function     lists them');
  console.log('  node tools/todo.js --practice      the passage/apply/writing gap');
  process.exit(0);
}

const list = units.filter(u => u.cefr === level.toUpperCase() && !u.done &&
                               (!strand || u.type === strand));
console.log(`${list.length} outstanding ${strand || ''} units at ${level.toUpperCase()}\n`);
list.forEach(u => {
  console.log('  seq ' + String(u.seq).padStart(4) + '  ' + u.type.padEnd(10) + u.title.slice(0, 46));
  console.log('        ' + (u.source.section || '') + ' › ' + (u.source.subsection || ''));
  console.log('        teaches ' + u.teaches + ' spec points' +
              (u.examples && u.examples.length ? '  e.g. ' + u.examples[0].slice(0, 60) : ''));
});
