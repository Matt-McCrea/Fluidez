#!/usr/bin/env node
/* score-blind.js: compares judge verdicts with the key. Prints every item the
 * judge picked differently or marked not ok, with its note. */
'use strict';
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'judge');
const keys = {};
fs.readdirSync(dir).filter(f => f.endsWith('.key.json')).forEach(f => Object.assign(keys, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))));
const blind = {};
fs.readdirSync(dir).filter(f => f.endsWith('.blind.json')).forEach(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).forEach(r => { blind[r.id] = r; }));
let n = 0, agree = 0; const flags = [];
fs.readdirSync(dir).filter(f => f.endsWith('.verdict.json')).sort().forEach(f => {
  JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).forEach(v => {
    n++;
    const want = keys[v.id], same = v.pick === want;
    if (same) agree++;
    if (!same || v.ok === false) flags.push({ id: v.id, q: (blind[v.id] || {}).q, key: want, pick: v.pick, note: v.note || '' });
  });
});
console.log(`${n} judged, ${agree} agree (${n ? Math.round(100 * agree / n) : 0}%), ${flags.length} flagged`);
if (process.argv.indexOf('--json') !== -1) fs.writeFileSync(path.join(dir, 'flags.json'), JSON.stringify(flags, null, 1));
else flags.forEach(x => console.log(`${x.id}  ${x.q}\n   key ${x.key} | judge ${x.pick}  ${x.note}`));
