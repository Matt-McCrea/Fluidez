#!/usr/bin/env node
/* kaikki-index.js: stream the 593 MB kaikki French dump line by line and keep
 * only what the builders need, written to vendor/index.json (gitignored).
 *   node tools/fr/kaikki-index.js        (build)    require() gives load() */
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline');
const VENDOR = path.join(__dirname, 'vendor');
const SRC = path.join(VENDOR, 'kaikki-french.jsonl'), OUT = path.join(VENDOR, 'index.json');
const KEEP_POS = new Set(['noun', 'verb', 'adj', 'adv', 'prep', 'pron', 'num', 'conj', 'det', 'article', 'intj', 'phrase', 'particle', 'postp', 'contraction']);
const BAD_FORM_TAGS = new Set(['multiword-construction', 'historic', 'table-tags', 'inflection-template', 'archaic', 'obsolete', 'dialectal', 'rare', 'dated']);
const LATIN = /^[a-zà-ÿœæ'’ -]+$/i;

function slim(d) {
  const e = { pos: d.pos, gl: (d.senses || []).slice(0, 3).map(s => (s.glosses || [])[0]).filter(Boolean),
    tags: [...new Set(((d.senses || [])[0] || {}).tags || [])] };   // first sense only: one rude sense must not sink a whole entry
  const fo = (d.senses || []).flatMap(s => (s.form_of || []).map(x => x.word));
  if (fo.length) e.of = [...new Set(fo)];
  const h = (d.head_templates || [])[0];
  if (h) { e.hn = h.name; e.h1 = h.args && h.args['1']; e.ha = h.args; e.hx = h.expansion; }
  if (d.forms && !fo.length) {
    if (d.pos === 'verb') {
      e.cf = d.forms.filter(f => f.source === 'conjugation' && f.tags && f.form && LATIN.test(f.form) && !f.tags.some(t => BAD_FORM_TAGS.has(t)))
        .map(f => [f.form, f.tags.join(',')]);
    } else {
      e.fm = d.forms.filter(f => f.tags && f.form && !f.tags.some(t => BAD_FORM_TAGS.has(t)))
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
      if (d.lang_code !== 'fr' || !d.word || !KEEP_POS.has(d.pos)) return;
      if (!LATIN.test(d.word) && !/ /.test(d.word)) return;
      (idx[d.word] = idx[d.word] || []).push(slim(d));
    });
    rl.on('close', () => { fs.writeFileSync(OUT, JSON.stringify(idx)); console.log(Object.keys(idx).length + ' words indexed'); res(idx); });
  });
}
function load() { return JSON.parse(fs.readFileSync(OUT, 'utf8')); }
module.exports = { build, load, OUT };
if (require.main === module) build();
