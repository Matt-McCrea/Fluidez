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
const PERF = path.join(ROOT, 'js', 'perf.js');

const VERSION_RE = /CACHE_VERSION\s*=\s*'([^']+)'/;
const BUILD_RE = /BUILD\s*=\s*'([^']+)'/;

/* TWO WORKERS. The arcade (juegos/) is a separate installable build with its
 * own service worker, because two workers cannot control one scope. It has
 * exactly the same staleness problem as the root one and no reason to solve it
 * differently, so both are handled here. The prefix keeps the two versions
 * visibly distinct in devtools — 'c…' is the app, 'j…' the arcade. */
const TARGETS = [
  { sw: 'sw.js',        prefix: 'c', carriesBuild: true },
  { sw: 'juegos/sw.js', prefix: 'j', carriesBuild: false }
];

/* The precache list, read from the worker itself so the two can never drift.
 * Paths are relative to the WORKER, not the root — the arcade reaches up to
 * ../data and ../js — so they are resolved before being hashed. */
function assets(swRel) {
  const abs = path.join(ROOT, swRel || 'sw.js');
  const src = fs.readFileSync(abs, 'utf8');
  const block = src.slice(src.indexOf('var ASSETS = ['), src.indexOf('];', src.indexOf('var ASSETS = [')));
  const dir = path.dirname(abs);
  return [...block.matchAll(/'([^']+)'/g)]
    .map(m => m[1])
    .filter(f => !f.endsWith('/'))              // './' is the page, not a file
    .map(f => path.relative(ROOT, path.resolve(dir, f)))
    .filter(f => f && !f.startsWith('..'));
}

/* Blank the version out of the two files that carry it: hashing them as-is
 * would make the hash an input to itself. */
function normalise(rel, text) {
  if (rel === 'js/perf.js') return text.replace(BUILD_RE, "BUILD = 'X'");
  return text;
}

function target(swRel) {
  return TARGETS.filter(t => t.sw === (swRel || 'sw.js'))[0] || TARGETS[0];
}

function hash(swRel) {
  const t = target(swRel);
  const h = crypto.createHash('sha1');
  for (const rel of assets(t.sw).sort()) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;          // reported separately by the validator
    h.update(rel + '\0');
    h.update(normalise(rel, fs.readFileSync(abs, 'utf8')));
  }
  return t.prefix + h.digest('hex').slice(0, 8);
}

function current(swRel) {
  const t = target(swRel);
  return (fs.readFileSync(path.join(ROOT, t.sw), 'utf8').match(VERSION_RE) || [])[1];
}

function write(swRel, v) {
  const t = target(swRel);
  const abs = path.join(ROOT, t.sw);
  fs.writeFileSync(abs, fs.readFileSync(abs, 'utf8').replace(VERSION_RE, `CACHE_VERSION = '${v}'`));
  // Only the root worker's version is mirrored into the build marker Ajustes
  // shows; the arcade has no settings screen to show one in.
  if (t.carriesBuild) fs.writeFileSync(PERF, fs.readFileSync(PERF, 'utf8').replace(BUILD_RE, `BUILD = '${v}'`));
}

module.exports = { hash, current, assets, TARGETS };

if (require.main === module) {
  let changed = 0;
  TARGETS.forEach(t => {
    if (!fs.existsSync(path.join(ROOT, t.sw))) return;
    const want = hash(t.sw), have = current(t.sw);
    if (want === have) { console.log(t.sw + ': already current (' + have + ')'); return; }
    write(t.sw, want);
    changed++;
    console.log(t.sw + ': ' + have + ' → ' + want);
  });
  if (changed) console.log('installed copies will now fetch the new files.');
}
