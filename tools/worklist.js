#!/usr/bin/env node
/* ============================================================================
 * worklist.js — generate WORKLIST.md, the explicit list of everything to write.
 *
 *   node tools/worklist.js            print a summary of what it would write
 *   node tools/worklist.js --write    create WORKLIST.md (refuses to overwrite)
 *   node tools/worklist.js --force    overwrite, losing any ticks
 *
 * WHY THIS EXISTS: progress was being INFERRED, by resolving the PCIC ids a
 * lesson cites back to syllabus units. That inference was wrong three times in
 * three different ways, always optimistically, because the syllabus chopped the
 * inventory more finely than lessons are actually written: "Expresar acuerdo"
 * at B2 is one lesson, and syllabus.js made four units of it, so writing it
 * left three "outstanding".
 *
 * A list you tick cannot drift. WORKLIST.md is generated ONCE and then
 * hand-maintained: tick a line when the work is done. It is the record, not a
 * derived view, so nothing recomputes it behind your back.
 *
 * A work item is one (level, strand, subsection) — which is what a lesson is.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'WORKLIST.md');
global.window = {};
['data/taxonomy.js', 'data/strand-lessons.js', 'data/passages.js', 'data/apply.js', 'data/writing.js']
  .forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const spec = require(path.join(ROOT, 'spec', 'pcic.json'));
const syl = require(path.join(ROOT, 'spec', 'syllabus-draft.json'));

const INV = { grammar: 'gramatica', notion: 'nociones_generales', function: 'funciones',
              discourse: 'tacticas_pragmaticas', genre: 'generos_discursivos' };
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const STRANDS = ['grammar', 'notion', 'function', 'discourse', 'genre'];

/* ---- merge the syllabus's leaf units into lesson-sized items ------------- */
const items = new Map();
syl.lessons.forEach(u => {
  if (!INV[u.type] || LEVELS.indexOf(u.cefr) < 0) return;
  const key = [u.cefr, u.type, u.source.section || '', u.source.subsection || ''].join('||');
  let e = items.get(key);
  if (!e) {
    e = { key, cefr: u.cefr, strand: u.type, section: u.source.section || '',
          subsection: u.source.subsection || '', teaches: 0, seq: u.seq,
          title: (u.source.subsection || u.title).replace(/^[\d.]+\s*/, ''), examples: [] };
    items.set(key, e);
  }
  e.teaches += u.teaches;
  if (u.seq < e.seq) e.seq = u.seq;
  (u.examples || []).forEach(x => { if (e.examples.length < 1) e.examples.push(x); });
});

/* ---- best-effort first tick from what is already written ----------------- */
const byId = new Map();
spec.forEach(i => byId.set(i.id, i));
const done = new Set(), lessonFor = new Map();
(window.STRAND_LESSONS || []).forEach(l => {
  (l.pcic || []).forEach(id => {
    const it = byId.get(id);
    if (!it) return;
    const key = [it.level, l.strand, it.section || '', it.subsection || ''].join('||');
    done.add(key);
    if (!lessonFor.has(key)) lessonFor.set(key, l.id);
  });
});

const all = [...items.values()].sort((a, b) =>
  LEVELS.indexOf(a.cefr) - LEVELS.indexOf(b.cefr) ||
  STRANDS.indexOf(a.strand) - STRANDS.indexOf(b.strand) || a.seq - b.seq);

/* ---- practice material, as explicit batches of ten ----------------------- */
const BAND = n => n <= 1 ? 'A1' : n <= 3 ? 'A2' : n <= 5 ? 'B1' : n <= 7 ? 'B2' : 'C1';
const TARGET = {
  passages: { A1: 87, A2: 62, B1: 81, B2: 80, C1: 80 },
  apply:    { A1: 118, A2: 163, B1: 141, B2: 120, C1: 120 },
  writing:  { A1: 156, A2: 91, B1: 78, B2: 80, C1: 80 }
};
const HAVE = { passages: {}, apply: {}, writing: {} };
[['passages', window.PASSAGES], ['apply', window.APPLY_ITEMS], ['writing', window.WRITING_TASKS]]
  .forEach(([n, arr]) => (arr || []).forEach(x => {
    const b = BAND(x.level || 1); HAVE[n][b] = (HAVE[n][b] || 0) + 1;
  }));

/* ---- render -------------------------------------------------------------- */
const L = [];
L.push('# Fluidez worklist');
L.push('');
L.push('Every lesson and every batch of practice material still to write. **Tick a line');
L.push('when the work is committed.** This file is the record — nothing recomputes it,');
L.push('so it cannot drift the way the inferred counts did.');
L.push('');
L.push('One lesson item = one (level, strand, subsection) from the Plan Curricular.');
L.push('`pts` is how many specification points it has to teach; the source column is');
L.push('where to find them in `spec/pcic.json`.');
L.push('');
L.push('Regenerate only with `node tools/worklist.js --force`, which loses all ticks.');
L.push('');

let ticked = 0;
LEVELS.forEach(lv => {
  const mine = all.filter(i => i.cefr === lv);
  const t = mine.filter(i => done.has(i.key)).length;
  ticked += t;
  L.push(`## ${lv} — lessons (${t}/${mine.length} done)`);
  L.push('');
  STRANDS.forEach(st => {
    const rows = mine.filter(i => i.strand === st);
    if (!rows.length) return;
    L.push(`### ${lv} · ${st} (${rows.filter(i => done.has(i.key)).length}/${rows.length})`);
    rows.forEach(i => {
      const mark = done.has(i.key) ? 'x' : ' ';
      const who = done.has(i.key) ? `  — ${lessonFor.get(i.key)}` : '';
      L.push(`- [${mark}] **${i.title.slice(0, 58)}** · ${i.teaches} pts · ` +
             `\`${INV[st]} ${lv} § ${i.subsection.slice(0, 34)}\`${who}`);
    });
    L.push('');
  });
});

L.push('## Practice material');
L.push('');
L.push('Passages carry a `theme` and a level-appropriate glossary: English to B1,');
L.push('a **Spanish definition** at B2, **none** at C1. Lengths: A1 30–60, A2 60–100,');
L.push('B1 100–160, B2 200–300, C1 320–450 words.');
L.push('');
['passages', 'apply', 'writing'].forEach(kind => {
  L.push(`### ${kind}`);
  LEVELS.forEach(lv => {
    const have = HAVE[kind][lv] || 0, want = TARGET[kind][lv] || 0;
    if (have >= want) { L.push(`- [x] ${lv} — ${have}/${want}`); return; }
    const short = want - have;
    for (let n = 0; n < short; n += 10) {
      const size = Math.min(10, short - n);
      L.push(`- [ ] ${lv} — batch of ${size} (${have + n}/${want} written)`);
    }
  });
  L.push('');
});

const text = L.join('\n') + '\n';
const force = process.argv.includes('--force');
const write = process.argv.includes('--write') || force;

console.log(`${all.length} lesson items (${ticked} already written, ${all.length - ticked} to go)`);
LEVELS.forEach(lv => {
  const mine = all.filter(i => i.cefr === lv);
  console.log('  ' + lv + '  ' + String(mine.filter(i => done.has(i.key)).length).padStart(3) +
              ' / ' + String(mine.length).padStart(3));
});
const batches = L.filter(l => /^- \[ \] [A-C]\d — batch/.test(l)).length;
console.log(`${batches} practice-material batches outstanding`);

if (!write) { console.log('\n(dry run — pass --write to create WORKLIST.md)'); process.exit(0); }
if (fs.existsSync(OUT) && !force) {
  console.error('\nWORKLIST.md exists. It is hand-maintained; --force to overwrite and lose ticks.');
  process.exit(1);
}
fs.writeFileSync(OUT, text);
console.log('\n→ WORKLIST.md');
