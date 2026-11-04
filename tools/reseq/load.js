/* Shared loader for the resequencing tools: the app's data as the content gate
 * sees it, plus the "Full lesson table" CSV parsed out of SEQ. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const SEQ = path.join(ROOT, 'docs/research/Fluidez Spanish course sequencing.md');

function loadApp() {
  global.window = {};
  ['data/taxonomy.js', 'data/connectors.js', 'data/rubrics.js', 'data/strand-lessons.js', 'data/course.js',
   'data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js',
   'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js', 'data/resources.js',
   'js/engine.js', 'js/lessons.js']
    .forEach(rel => (0, eval)(fs.readFileSync(path.join(ROOT, rel), 'utf8')));
  return global.window;
}

// RFC-4180-enough: quoted fields may hold commas; no embedded newlines in SEQ.
function parseLine(line) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur); return out;
}

function loadCsv() {
  const md = fs.readFileSync(SEQ, 'utf8');
  const m = md.match(/```csv\n([\s\S]*?)```/);
  if (!m) throw new Error('no csv block in SEQ');
  const lines = m[1].trim().split('\n');
  const head = parseLine(lines[0]);
  return lines.slice(1).map((l, i) => {
    const f = parseLine(l), r = { _line: i + 2 };
    if (f.length !== head.length) r._badWidth = f.length;
    head.forEach((h, j) => { r[h] = f[j]; });
    return r;
  });
}

module.exports = { ROOT, loadApp, loadCsv };
