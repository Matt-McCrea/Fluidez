#!/usr/bin/env node
/* Compare a judge's picks with the computed answers, and list the flags.
 *   node tools/ar/score-blind.js afal */
'use strict';
const fs = require('fs');
const path = require('path');
const kind = process.argv[2] || 'afal';
global.window = {};
require(path.join(__dirname, '..', '..', 'arabiya', 'data', `gaps-${kind}.js`));
const items = window.AR_BANK.filter(x => x.k === kind);
const dir = path.join(__dirname, 'judge');
let n = 0, agree = 0;
const diffs = [], flags = [];
fs.readdirSync(dir).filter(f => f.startsWith(kind + '-') && f.endsWith('.picks.json')).forEach(f => {
  JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).forEach(p => {
    const x = items[p.id]; if (!x) return;
    n++;
    if (p.pick === x.a) agree++; else diffs.push(`#${p.id} ${x.q}  [${x.c}]  answer ${x.a}, judge ${p.pick}`);
    if (p.flag) flags.push(`#${p.id} ${x.q}  [${x.a}]  ${p.flag}`);
  });
});
console.log(`${kind}: ${agree} of ${n} picks agree; ${diffs.length} differ; ${flags.length} flagged`);
diffs.forEach(d => console.log('DIFF ' + d));
flags.forEach(d => console.log('FLAG ' + d));
