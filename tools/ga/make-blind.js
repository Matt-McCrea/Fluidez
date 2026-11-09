#!/usr/bin/env node
/* make-blind.js: blind files for the judge pass. For each GAP kind, writes
 * tools/ga/judge/<kind>-NN.blind.json: [{ id, q, o (sorted, so position says
 * nothing), e }] in chunks, and <kind>.key.json mapping id -> answer. A judge
 * fills in tools/ga/judge/<kind>-NN.verdict.json: [{ id, pick, ok, note }];
 * tools/ga/score-blind.js compares. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
global.window = global;
const kinds = process.argv.slice(2).length ? process.argv.slice(2) : ['briathra', 'seimhiu', 'tais', 'freagair', 'forainm'];
const out = path.join(__dirname, 'judge');
kinds.forEach(k => {
  window.GA_BANK = [];
  delete require.cache[require.resolve(path.join(ROOT, 'gaeilge/data/gaps-' + k + '.js'))];
  require(path.join(ROOT, 'gaeilge/data/gaps-' + k + '.js'));
  const items = window.GA_BANK, key = {};
  const rows = items.map((x, i) => { const id = k + ':' + i; key[id] = x.a; return { id, q: x.q, o: x.o.slice().sort(), e: x.e }; });
  const N = 420;
  for (let c = 0; c * N < rows.length; c++) fs.writeFileSync(path.join(out, `${k}-${String(c + 1).padStart(2, '0')}.blind.json`), JSON.stringify(rows.slice(c * N, (c + 1) * N), null, 0).replace(/\},\{/g, '},\n{'));
  fs.writeFileSync(path.join(out, k + '.key.json'), JSON.stringify(key));
  console.log(k, rows.length, 'items in', Math.ceil(rows.length / N), 'chunks');
});
