#!/usr/bin/env node
/* ============================================================================
 * gen-assets.js — write the ASSETS array in sw.js from index.html.
 *   node tools/gen-assets.js            rewrite sw.js
 *   node tools/gen-assets.js --check    exit 1 if sw.js differs
 *
 * The precache list used to be kept by hand and mirrored every <script> and
 * <link> in index.html; a forgotten line meant a file that worked online and
 * failed offline. It is now derived: the page itself, the manifest, every
 * stylesheet and icon link, every script with a src (in page order), the
 * icons/ folder. Files the page loads on demand (data/lessons/<band>.js,
 * data/requires/<band>.js, data/bank, data/story, data/scenes, data/contrasts)
 * are not listed: sw.js caches them on first use (see its data/ branch).
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

function list() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const out = ['./', './index.html'];
  const add = f => { f = './' + f.replace(/^\.\//, ''); if (!/^\.\/(https?:|\/)/.test(f) && out.indexOf(f) === -1) out.push(f); };
  const attr = (tag, name) => (tag.match(new RegExp('\\b' + name + '="([^"]*)"')) || [])[1];
  (html.match(/<link\b[^>]*>/g) || []).forEach(t => {
    const rel = attr(t, 'rel'), href = attr(t, 'href');
    if (href && /^(manifest|stylesheet|apple-touch-icon|icon)$/.test(rel || '')) add(href);
  });
  try {
    fs.readdirSync(path.join(ROOT, 'icons')).filter(n => /\.(png|svg|ico)$/.test(n)).sort().forEach(n => add('icons/' + n));
  } catch (e) {}
  // the manifest names its own icons; take them if the folder listing missed any
  try {
    const mf = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
    (mf.icons || []).forEach(i => i.src && add(i.src));
  } catch (e) {}
  (html.match(/<script\b[^>]*>/g) || []).forEach(t => { const s = attr(t, 'src'); if (s) add(s); });
  return out;
}

function render(files) {
  return 'var ASSETS = [\n' + files.map(f => "  '" + f + "'").join(',\n') + '\n];';
}

function apply(src, files) {
  const a = src.indexOf('var ASSETS = ['), b = src.indexOf('];', a);
  if (a === -1 || b === -1) throw new Error('sw.js has no "var ASSETS = [ ... ];" block');
  return src.slice(0, a) + render(files) + src.slice(b + 2);
}

function run(check) {
  const swPath = path.join(ROOT, 'sw.js');
  const cur = fs.readFileSync(swPath, 'utf8'), next = apply(cur, list());
  if (cur === next) return true;
  if (!check) fs.writeFileSync(swPath, next);
  return false;
}

module.exports = { list, run };

if (require.main === module) {
  const check = process.argv.includes('--check');
  const same = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8') === apply(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), list());
  if (check) { if (!same) { console.error('sw.js ASSETS is out of date. Run: node tools/gen-assets.js'); process.exit(1); } console.log('sw.js ASSETS is up to date.'); }
  else { run(false); console.log('sw.js ASSETS: ' + list().length + ' files' + (same ? ' (unchanged)' : ' (rewritten)')); }
}
