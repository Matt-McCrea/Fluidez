#!/usr/bin/env node
/* Every text Ṭalāqa can play, as JSON lines {text, v, kind, slow}, for
 * tools/ar/build-audio.py. Letters and stage 0 first (they are precached). */
'use strict';
const path = require('path');
const fs = require('fs');
const D = path.join(__dirname, '..', '..', 'arabiya', 'data');
const load = f => { const p = path.join(D, f); if (!fs.existsSync(p) || /PLACEHOLDER/.test(fs.readFileSync(p, 'utf8').slice(0, 60))) return null; delete require.cache[p]; return require(p); };
const out = new Map();
const add = (text, v, kind, slow) => { if (!text) return; const k = text + '|' + v; if (!out.has(k)) out.set(k, { text, v, kind, slow: !!slow }); };

const L = load('letters.js');
if (L) {
  const VOW = ['َ', 'ِ', 'ُ'];
  L.AR_LETTERS.forEach(l => {
    add(l.nm, 'msa', 'letter', true);
    if (['marbuta', 'maqsura', 'alif'].indexOf(l.id) === -1) {
      const base = l.id === 'hamza' ? 'أ' : l.ch;
      VOW.forEach(m => add(base + m, 'msa', 'letter', true));
    }
  });
  ['بَا', 'بِي', 'بُو', 'تَا', 'تِي', 'تُو', 'نَا', 'نِي', 'نُو'].forEach(s => add(s, 'msa', 'letter', true));
  L.AR_LESSONS.forEach(les => les.words.forEach(w => add(w.ar, 'msa', 'letter', true)));
}
const W = load('words.js'); if (W && !/PLACEHOLDER/.test(fs.readFileSync(path.join(D, 'words.js'), 'utf8').slice(0, 40))) W.forEach(w => add(w.ar, 'msa', 'word'));
const P = load('phrases.js'); if (P && !/PLACEHOLDER/.test(fs.readFileSync(path.join(D, 'phrases.js'), 'utf8').slice(0, 40))) P.forEach(p => {
  add(p.msa, 'msa', 'phrase'); add(p.lev, 'lev', 'phrase'); add(p.egy, 'egy', 'phrase');
});
for (const x of out.values()) process.stdout.write(JSON.stringify(x) + '\n');
