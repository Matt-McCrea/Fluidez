#!/usr/bin/env node
/* bump-cache.js: Vlot's service worker version, DERIVED from the bytes of
 * every file nederlands/sw.js precaches, written into sw.js (CACHE_VERSION) and
 * js/perf.js (BUILD) when they exist. Cache name is vlot-<ver>.
 * Run after any change under nederlands/.   node tools/nl/bump-cache.js [--check]
 * Does nothing (exit 0) while nederlands/sw.js has not been written yet. */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const G = path.join(__dirname, '..', '..', 'nederlands');
const SW = path.join(G, 'sw.js');
function version() {
  const sw = fs.readFileSync(SW, 'utf8');
  const start = sw.indexOf('var ASSETS = [');
  if (start === -1) return null;
  const block = sw.slice(start, sw.indexOf('];', start));
  const files = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]).filter(f => f !== './' && !f.endsWith('sw.js') && !f.endsWith('perf.js'));
  const h = crypto.createHash('sha1');
  files.forEach(f => { const p = path.join(G, f); h.update(f); if (fs.existsSync(p)) h.update(fs.readFileSync(p)); });
  return 'v' + h.digest('hex').slice(0, 8);
}
function current() {
  if (!fs.existsSync(SW)) return null;
  return (/var CACHE_VERSION = '([^']+)'/.exec(fs.readFileSync(SW, 'utf8')) || [])[1] || null;
}
if (require.main === module) {
  if (!fs.existsSync(SW)) { console.log('nederlands/sw.js not written yet, nothing to bump'); process.exit(0); }
  const v = version();
  if (!v) { console.log('no ASSETS list in nederlands/sw.js, nothing to bump'); process.exit(0); }
  if (process.argv.includes('--check')) { console.log(current() === v ? 'fresh' : 'STALE ' + current() + ' -> ' + v); process.exit(current() === v ? 0 : 1); }
  for (const [f, re, rep] of [['sw.js', /var CACHE_VERSION = '[^']*'/, `var CACHE_VERSION = '${v}'`], ['js/perf.js', /var BUILD = '[^']*'/, `var BUILD = '${v}'`]]) {
    const p = path.join(G, f);
    if (fs.existsSync(p)) fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(re, rep));
  }
  console.log('cache version vlot-' + v);
}
module.exports = { version, current };
