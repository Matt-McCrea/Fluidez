#!/usr/bin/env node
/* Blind-judge packs: every item of a kind without its answer, in chunks.
 *   node tools/ar/make-blind.js afal 700    -> tools/ar/judge/afal-1.json, afal-2.json ...
 * A judge writes afal-N.picks.json: [{id, pick, flag?}] (pick = the option text,
 * flag = a short note when the Arabic is wrong or unnatural). Then score-blind.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const kind = process.argv[2] || 'afal', size = +(process.argv[3] || 700);
global.window = {};
require(path.join(__dirname, '..', '..', 'arabiya', 'data', `gaps-${kind}.js`));
const items = window.AR_BANK.filter(x => x.k === kind);
const dir = path.join(__dirname, 'judge'); fs.mkdirSync(dir, { recursive: true });
for (let i = 0, n = 1; i < items.length; i += size, n++) {
  const chunk = items.slice(i, i + size).map((x, j) => ({ id: i + j, q: x.q, c: x.c, e: x.e, o: x.o }));
  fs.writeFileSync(path.join(dir, `${kind}-${n}.json`), JSON.stringify(chunk, null, 0).replace(/\},\{/g, '},\n{'));
  console.log(`${kind}-${n}.json: ${chunk.length}`);
}
