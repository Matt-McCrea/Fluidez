#!/usr/bin/env node
/* ============================================================================
 * samples.js — pull the Plan Curricular's own sample TEXTS out of the harvest.
 *
 *   node tools/harvest/samples.js     -> spec/genre-samples.json
 *
 * The "géneros discursivos" inventory does not only list genres, it prints
 * worked examples OF them: 148 passages of real, edited Spanish showing what a
 * description, a narration, an argument or a phone conversation actually looks
 * like at each level. They were harvested with everything else and then never
 * used.
 *
 * That omission is the likely root of the formulaic B1 passages. Asked to write
 * a B1 text with no model of one, a generator builds a template around the
 * level's headline grammar — hence "Antes de X, había Y" in 49 of 81. These
 * samples are the model it was missing.
 *
 * USE THEM AS MODELS, NOT AS CONTENT. They are short illustrative excerpts
 * inside a reference work and some are quoted from published authors: fine to
 * read and imitate, not to ship verbatim as app passages.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const spec = require(path.join(ROOT, 'spec', 'pcic.json'));

const MIN_WORDS = 25;
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const out = [];
spec.forEach(i => {
  if (LEVELS.indexOf(i.level) < 0) return;
  (i.examples || []).forEach(e => {
    const text = String(e).trim();
    const words = text.split(/\s+/).length;
    if (words < MIN_WORDS) return;
    out.push({
      cefr: i.level,
      words,
      inventory: i.inventory,
      genre: i.subsection || i.section || null,
      // the path is where the useful label lives: "Macrofunción descriptiva",
      // "Proceso prototípico", "Conversación transaccional telefónica"
      kind: (i.path || []).join(' › ') || i.pattern || null,
      text
    });
  });
});

out.sort((a, b) => LEVELS.indexOf(a.cefr) - LEVELS.indexOf(b.cefr) || a.words - b.words);

const byLevel = {}, byKind = {};
out.forEach(s => {
  byLevel[s.cefr] = (byLevel[s.cefr] || 0) + 1;
  const k = (s.genre || '').replace(/^[\d.]+\s*/, '').slice(0, 44);
  byKind[k] = (byKind[k] || 0) + 1;
});

fs.writeFileSync(path.join(ROOT, 'spec', 'genre-samples.json'), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  note: 'Sample texts printed by the Plan Curricular to illustrate its genres. MODELS for register, structure and length — do not ship verbatim.',
  count: out.length, samples: out
}, null, 1));

console.log(`${out.length} sample texts of ${MIN_WORDS}+ words\n`);
console.log('by level:  ' + LEVELS.map(l => l + ' ' + (byLevel[l] || 0)).join('   '));
const lens = {};
LEVELS.forEach(l => {
  const w = out.filter(s => s.cefr === l).map(s => s.words);
  if (w.length) lens[l] = Math.round(w.reduce((a, b) => a + b, 0) / w.length);
});
console.log('mean words:' + LEVELS.map(l => ' ' + l + ' ' + (lens[l] || '-')).join('  '));
console.log('\ncommonest genres:');
Object.entries(byKind).sort((a, b) => b[1] - a[1]).slice(0, 10)
  .forEach(([k, n]) => console.log('   ' + String(n).padStart(4) + '  ' + k));
console.log('\n→ spec/genre-samples.json');
