#!/usr/bin/env node
/* Gate for tools/ar/src/words/*.json (one file, or all with no argument).
 *   node tools/ar/check-words.js [file ...]
 * Prints each problem as  file: ar: problem  and exits 1 if there are any. */
'use strict';
const fs = require('fs');
const path = require('path');
const AR = require('../../arabiya/js/ar-text.js');
const DIR = path.join(__dirname, 'src', 'words');
const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => path.join(DIR, f));
const POS = ['n', 'adj', 'adv', 'prep', 'x', 'num'];
const WEAK = 'ويءأإآؤئاى';
let probs = 0, total = 0;
const seen = new Map();
for (const f of files) {
  let arr;
  try { arr = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { console.log(`${f}: not valid JSON: ${e.message}`); probs++; continue; }
  const name = path.basename(f);
  arr.forEach((w, i) => {
    total++;
    const bad = m => { probs++; console.log(`${name}: ${w.ar || '#' + i}: ${m}`); };
    if (!w.ar || !w.en || !w.th || !w.pos) return bad('needs ar, en, th, pos');
    if (POS.indexOf(w.pos) === -1) bad('pos must be one of ' + POS.join(' '));
    if ([1, 2, 3].indexOf(w.t) === -1) bad('t must be 1, 2 or 3');
    const uv = AR.unvowelled(w.ar); if (uv.length) bad('not fully vowelled: ' + uv.join(' '));
    if (w.pl) { const up = AR.unvowelled(w.pl); if (up.length) bad('plural not fully vowelled: ' + up.join(' ')); }
    if (w.pos === 'n' && ['m', 'f'].indexOf(w.g) === -1) bad('noun needs g m or f');
    if (/\s[-–—]\s|—|–/.test(w.en)) bad('dash in en');
    if (/[a-z]/i.test(w.ar)) bad('latin letters in ar');
    if (w.root) {
      const b = AR.strip(w.ar).replace(/^ال/, '');
      for (const r of w.root) if (WEAK.indexOf(r) === -1 && b.indexOf(r) === -1 && !(w.pl && AR.strip(w.pl).indexOf(r) !== -1)) { bad(`root letter ${r} not in the word`); break; }
    }
    const k = AR.strip(w.ar) + '|' + w.en;
    if (seen.has(AR.strip(w.ar))) {
      const o = seen.get(AR.strip(w.ar));
      if (o.en === w.en) bad('duplicate of ' + o.file);
    } else seen.set(AR.strip(w.ar), { en: w.en, file: name });
  });
}
console.log(`${total} words, ${probs} problems`);
process.exit(probs ? 1 : 0);
