#!/usr/bin/env node
/* ============================================================================
 * tense-index.js — write the `tenses` field onto every passage.
 *
 *   node tools/tense-index.js            rewrite data/passages.js in place
 *   node tools/tense-index.js --check    report drift, change nothing (exit 1)
 *
 * WHY THE FIELD EXISTS. A passage's `level` integer has always stood for
 * "which tenses may appear in it" — that is the only thing the number ever
 * decided about a text. Standing for it is not the same as being it, and the
 * gap shows the moment a tense moves: flipping `preterito` to level 1 makes a
 * preterite legal in every level-1 passage, including the one a learner is
 * handed on day 3, because A1 is a single level (LEVELS gives it levels:[1])
 * and there is no "late A1" to put the past tense into.
 *
 * So the app stops reading the proxy and reads the thing itself. Each passage
 * records which tenses it actually requires; js/session.js keeps back the ones
 * whose tenses the learner has not reached. That removes a latent version of
 * the same bug at every band, not just this one.
 *
 * WHY IT IS GENERATED. Hand-written, the field would be a second opinion
 * about a text the validator already has its own opinion about, and the two
 * would drift on the first passage whose `habla` somebody read as an
 * imperative. It comes from tools/lib/tense-scan.js, which is also what
 * tools/validate-content.js gates levels with — so they cannot disagree.
 * validate-content.js re-derives the field and fails if the file is stale;
 * run this after writing passages, the way bump-cache.js is run after
 * touching a precached file.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data', 'passages.js');

global.window = {};
['data/taxonomy.js', 'data/connectors.js', 'data/strand-lessons.js', 'data/course.js',
 'data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js',
 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js', 'data/resources.js',
 'js/engine.js', 'js/lessons.js'].forEach(f =>
  (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));

const E = window.ENGINE;
const TENSE_LEVEL = {}, SEED_ORDER = {};
(window.SEED_SYLLABUS || []).forEach((s, i) => {
  SEED_ORDER[s.id] = i;
  if (E.TENSES.some(t => t.key === s.id)) TENSE_LEVEL[s.id] = s.level;
});
const scan = require('./lib/tense-scan.js')(E, TENSE_LEVEL, SEED_ORDER);

const want = {};
(window.PASSAGES || []).forEach(p => { want[p.id] = scan.tensesOf(p.text); });

/* The header line every passage record opens with:
 *     id: 'x', title: '…', level: 1, theme: 'identidad',
 * followed by an optional `tenses: [...]` line this tool owns. Rewriting the
 * file as text rather than re-serialising it keeps the hand-authored
 * formatting, the section comments and the gloss layout exactly as written —
 * a generated re-print of 6,000 lines would bury the next real diff. */
const HEADER = /^(\s*)id: '([^']+)',( title:.*?)$/;
const OURS = /^\s*tenses: \[[^\]]*\],\s*$/;

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
const out = [];
let seen = 0, changed = 0, missing = [];

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(HEADER);
  out.push(lines[i]);
  if (!m) continue;
  const [, indent, id] = m;
  if (!(id in want)) { missing.push(id); continue; }
  seen++;
  const field = `${indent}tenses: [${want[id].map(t => `'${t}'`).join(', ')}],`;
  const next = lines[i + 1];
  if (next !== undefined && OURS.test(next)) {
    if (next !== field) changed++;
    out.push(field);
    i++;                                   // consume the stale line
  } else {
    changed++;
    out.push(field);
  }
}

if (missing.length) {
  console.error('✗ header ids with no loaded passage: ' + missing.join(', '));
  process.exit(1);
}
if (seen !== (window.PASSAGES || []).length) {
  console.error(`✗ matched ${seen} headers but PASSAGES holds ${(window.PASSAGES || []).length} —` +
                ' a record is formatted differently and would be skipped silently');
  process.exit(1);
}

const check = process.argv.includes('--check');
if (!changed) { console.log(`✅ tenses up to date on all ${seen} passages.`); process.exit(0); }
if (check) {
  console.error(`✗ ${changed} passage(s) have a stale or missing \`tenses\` field.` +
                ' Run: node tools/tense-index.js');
  process.exit(1);
}
fs.writeFileSync(FILE, out.join('\n'));
console.log(`✅ wrote \`tenses\` on ${changed} of ${seen} passages.`);
