#!/usr/bin/env node
/* ============================================================================
 * bump-cache.js — derive the service worker's CACHE_VERSION from the files it
 * actually caches.  Run:  node tools/bump-cache.js
 *
 * WHY THIS EXISTS. sw.js precaches every asset and serves from that cache, so
 * an installed copy of the app keeps showing the old files until CACHE_VERSION
 * changes. The instruction at the top of sw.js — "bump CACHE_VERSION on every
 * deploy that changes a cached file" — is a human step, and it failed exactly
 * the way human steps fail: nine cached files changed across four commits
 * while the version sat still, so the work was pushed, live, and invisible.
 * Every gate passed, because the only check was that sw.js and perf.js agreed
 * with each other — and they did. They were agreeing on a stale number.
 *
 * So the version is now a hash of the content, and forgetting is not possible:
 * change any precached file and the version no longer matches, which
 * validate-content.js reports as a failure.
 *
 * The two files that CARRY the version are hashed with it blanked out, or the
 * hash would depend on itself and never settle.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SW = path.join(ROOT, 'sw.js');
const PERF = path.join(ROOT, 'js', 'perf.js');

const VERSION_RE = /CACHE_VERSION\s*=\s*'([^']+)'/;
const BUILD_RE = /BUILD\s*=\s*'([^']+)'/;

// The precache list, read from sw.js itself so the two can never drift.
function assets() {
  const src = fs.readFileSync(SW, 'utf8');
  const block = src.slice(src.indexOf('var ASSETS = ['), src.indexOf('];', src.indexOf('var ASSETS = [')));
  return [...block.matchAll(/'\.\/([^']*)'/g)].map(m => m[1]).filter(Boolean);
}

/* Blank the version out of the two files that carry it: hashing them as-is
 * would make the hash an input to itself. */
function normalise(rel, text) {
  if (rel === 'js/perf.js') return text.replace(BUILD_RE, "BUILD = 'X'");
  return text;
}

function hash() {
  const h = crypto.createHash('sha1');
  for (const rel of assets().sort()) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;          // reported separately by the validator
    h.update(rel + '\0');
    h.update(normalise(rel, fs.readFileSync(abs, 'utf8')));
  }
  return 'c' + h.digest('hex').slice(0, 8);
}

function current() {
  return (fs.readFileSync(SW, 'utf8').match(VERSION_RE) || [])[1];
}

function write(v) {
  fs.writeFileSync(SW, fs.readFileSync(SW, 'utf8').replace(VERSION_RE, `CACHE_VERSION = '${v}'`));
  fs.writeFileSync(PERF, fs.readFileSync(PERF, 'utf8').replace(BUILD_RE, `BUILD = '${v}'`));
}

module.exports = { hash, current, assets };

if (require.main === module) {
  const want = hash(), have = current();
  if (want === have) { console.log('cache version already current: ' + have); process.exit(0); }
  write(want);
  console.log('cache version ' + have + ' → ' + want);
  console.log('installed copies of the app will now fetch the new files.');
}
