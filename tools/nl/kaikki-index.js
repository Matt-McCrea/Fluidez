#!/usr/bin/env node
/* kaikki-index.js: stream the 257 MB kaikki Dutch dump line by line and keep
 * only what the builders need, written to vendor/index.json (gitignored).
 *   node tools/nl/kaikki-index.js        (build)    require() gives load() */
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline');
const VENDOR = path.join(__dirname, 'vendor');
const SRC = path.join(VENDOR, 'kaikki-dutch.jsonl'), OUT = path.join(VENDOR, 'index.json');
const BAD_TAGS = new Set(['Flanders', 'archaic', 'subjunctive', 'majestic', 'obsolete', 'dialectal', 'Belgium', 'Suriname', 'rare', 'dated']);

function slim(d) {
  const s0 = (d.senses || [])[0] || {};
  const e = { pos: d.pos, gl: (d.senses || []).slice(0, 3).map(s => (s.glosses || [])[0]).filter(Boolean),
    tags: [...new Set((d.senses || []).flatMap(s => s.tags || []))] };
  const fo = (d.senses || []).flatMap(s => (s.form_of || []).map(x => x.word));
  if (fo.length) e.of = [...new Set(fo)];
  const h = (d.head_templates || [])[0];
  if (h) { e.hn = h.name; e.h1 = h.args && h.args['1']; e.hx = h.expansion; }
  if (d.forms) {
    if (d.pos === 'verb') {
      e.cf = d.forms.filter(f => f.source === 'conjugation' && f.tags && !f.tags.some(t => BAD_TAGS.has(t)))
        .map(f => [f.form, f.tags.join(',')]);
      const tt = d.forms.find(f => f.tags && f.tags.indexOf('table-tags') !== -1);
      if (tt) e.table = tt.form;
      const cls = d.forms.find(f => /^\d+ class$/.test(f.form)); if (cls) e.cls = cls.form;
    } else {
      e.fm = d.forms.filter(f => f.tags && !f.tags.some(t => BAD_TAGS.has(t) || t === 'table-tags' || t === 'inflection-template'))
        .map(f => [f.form, f.tags.join(',')]);
    }
  }
  return e;
}
function build() {
  return new Promise(res => {
    const idx = {};
    const rl = readline.createInterface({ input: fs.createReadStream(SRC) });
    rl.on('line', l => {
      let d; try { d = JSON.parse(l); } catch (e) { return; }
      if (d.lang_code !== 'nl' || !d.word) return;
      (idx[d.word] = idx[d.word] || []).push(slim(d));
    });
    rl.on('close', () => { fs.writeFileSync(OUT, JSON.stringify(idx)); console.log(Object.keys(idx).length + ' words indexed'); res(idx); });
  });
}
function load() { return JSON.parse(fs.readFileSync(OUT, 'utf8')); }
module.exports = { build, load, OUT };
if (require.main === module) build();
