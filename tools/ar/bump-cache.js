#!/usr/bin/env node
/* bump-cache.js: Ṭalāqa's service worker version, DERIVED from the bytes of
 * every file arabiya/sw.js precaches, written into sw.js (CACHE_VERSION) and
 * js/perf.js (BUILD). Run after any change under arabiya/; tools/test-arabiya.js
 * fails while it is stale, because an unchanged version means installed phones
 * never see the change.   node tools/ar/bump-cache.js [--check] */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const G = path.join(__dirname, '..', '..', 'arabiya');
function version() {
  const sw = fs.readFileSync(path.join(G, 'sw.js'), 'utf8');
  const block = sw.slice(sw.indexOf('var ASSETS = ['), sw.indexOf('];', sw.indexOf('var ASSETS = [')));
  const files = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]).filter(f => f !== './' && !f.endsWith('sw.js') && !f.endsWith('perf.js'));
  const h = crypto.createHash('sha1');
  files.forEach(f => { h.update(f); h.update(fs.readFileSync(path.join(G, f))); });
  return 't' + h.digest('hex').slice(0, 8);
}
function current() { return (/var CACHE_VERSION = '([^']+)'/.exec(fs.readFileSync(path.join(G, 'sw.js'), 'utf8')) || [])[1]; }
if (require.main === module) {
  const v = version();
  if (process.argv.includes('--check')) { console.log(current() === v ? 'fresh' : 'STALE ' + current() + ' -> ' + v); process.exit(current() === v ? 0 : 1); }
  for (const [f, re, rep] of [['sw.js', /var CACHE_VERSION = '[^']+'/, `var CACHE_VERSION = '${v}'`], ['js/perf.js', /var BUILD = '[^']+'/, `var BUILD = '${v}'`]]) {
    const p = path.join(G, f); fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(re, rep));
  }
  console.log('cache version ' + v);
}
module.exports = { version, current };
