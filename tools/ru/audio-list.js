#!/usr/bin/env node
/* Every text Svobodno can play, as JSON lines {text, v, kind, slow}, for
 * tools/ru/build-audio.py. Letters and stage 0 first (they are precached). */
'use strict';
const path = require('path');
const fs = require('fs');
const D = path.join(__dirname, '..', '..', 'russkiy', 'data');
const load = f => { const p = path.join(D, f); if (!fs.existsSync(p)) return null; delete require.cache[p]; return require(p); };
const out = new Map();
const add = (text, kind, slow) => { if (!text) return; const k = text + '|ru'; if (!out.has(k)) out.set(k, { text, v: 'ru', kind, slow: !!slow }); };

const L = load('letters.js');
if (L) {
  L.RU_LETTERS.forEach(l => add(l.nm, 'letter', true));
  L.RU_LESSONS.forEach(les => les.words.forEach(w => add(w.ru, 'letter', true)));
}
const W = load('words.js'); if (W) W.forEach(w => add(w.ru, 'word'));
const P = load('phrases.js'); if (P) P.forEach(p => add(p.ru, 'phrase'));
// gap sentences, read whole with the answer in place
global.window = global.window || {};
['glagoly', 'vid', 'dvizhenie', 'padezhi'].forEach(k => {
  const f = path.join(D, `gaps-${k}.js`);
  if (!fs.existsSync(f)) return;
  window.RU_BANK = []; delete require.cache[f]; require(f);
  window.RU_BANK.forEach(g => add(g.q.replace(/___+/, g.a), 'sentence'));
});
for (const x of out.values()) process.stdout.write(JSON.stringify(x) + '\n');
