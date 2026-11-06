#!/usr/bin/env node
/* ============================================================================
 * build-phrases.js — the Frases bank, compiled for the arcade.
 *
 *   node tools/build-phrases.js           write data/phrases.js
 *   node tools/build-phrases.js --check   exit 1 if data/phrases.js is stale
 *
 * SOURCE. tools/phrases/phrases.json, itself built from tools/phrases/src/*.txt
 * by `node tools/phrases/build.js` and checked by tools/phrases/check.js. The
 * order there is the order of play: tier, then usefulness.
 *
 * WHAT IT WRITES. window.PHRASES = [ { es, en, alt?, th, b, t, n? } ]:
 *   es the Spanish, en the English, alt other accepted Spanish (omitted when
 *   empty), th the theme, b the band, t the tier (1 to 3), n a short note shown
 *   after the answer (omitted when absent).
 * Only the arcade loads the file (juegos/index.html); the main app does not.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(__dirname, 'phrases/phrases.json');
const OUT = path.join(ROOT, 'data/phrases.js');

const bank = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const rows = bank.map(p => {
  const o = { es: p.es, en: p.en };
  if (p.alt && p.alt.length) o.alt = p.alt;
  o.th = p.th; o.b = p.b; o.t = p.tier;
  if (p.note) o.n = p.note;
  return '  ' + JSON.stringify(o);
});
const text = `/* ============================================================================
 * PHRASES — GENERATED. Do not edit by hand.
 *
 *   node tools/build-phrases.js
 *
 * The most common everyday Spanish phrases and short sentences, for Frases in
 * the Juegos arcade (and the phrase share of Jugar), in the order of play: tier,
 * then usefulness. Entries are { es, en, alt (other accepted Spanish, absent
 * when none), th (theme), b (cefr band), t (tier 1 to 3), n (note, absent when
 * none) }. Latin American (Colombian) Spanish.
 *
 * SOURCE. tools/phrases/src/*.txt, built into tools/phrases/phrases.json by
 * tools/phrases/build.js. ${bank.length} phrases.
 * ========================================================================== */
window.PHRASES = [
${rows.join(',\n')}
];
`;
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== text) { console.error('data/phrases.js is stale: run node tools/build-phrases.js'); process.exit(1); }
  console.log('data/phrases.js is current (' + bank.length + ' phrases)');
} else {
  fs.writeFileSync(OUT, text);
  console.log('wrote data/phrases.js: ' + bank.length + ' phrases');
}
