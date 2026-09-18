#!/usr/bin/env node
/* ============================================================================
 * shortlist.js — the words to build a passage OUT OF.
 *
 *   node tools/shortlist.js A1 religion          one theme at one band
 *   node tools/shortlist.js A1                   every short theme at that band
 *   node tools/shortlist.js A1 religion --all    include words already used
 *
 * The rule a new passage has to meet is that it carries at least ten words of
 * its own theme (tools/variety.js). The way to meet it is not to write a text
 * and count afterwards — that is how the corpus ended up averaging 3.6 — but
 * to start from a shortlist: pull the theme's vocabulary at the band, pick a
 * dozen that could plausibly share one scene, and build the text around them.
 *
 * "Unused" means no passage already in the band uses the word. Those are the
 * valuable ones: a word that appears in four texts already is not what the
 * learner is short of. Words are listed unused-first for that reason, but the
 * used ones are printed too — a scene needs its ordinary furniture, and
 * `la casa` being used elsewhere is no reason to write around it.
 *
 * Bands widen downward on purpose: an A1 passage may use A1 words, an A2
 * passage A1 and A2.
 *
 * Where that is not enough it widens up by exactly one band, under its own
 * heading, because some themes have almost nothing at the bottom: `religion`
 * has nine A1 words and the density rule asks for ten, `economia` has none at
 * all. The glossary is the mechanism for this — an A1 passage ships an English
 * gloss precisely so it can carry a word the learner has not met — so a
 * handful of glossed A2 words in an A1 text is the design working, not a
 * breach of the band. One band, not two: a C1 word in an A1 text is not a
 * gloss, it is a different passage.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
['data/taxonomy.js', 'data/verbs.js', 'data/vocab.js', 'data/passages.js',
 'js/engine.js', 'js/lexmatch.js'].forEach(f =>
  (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const LM = window.LexMatch;

const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const BAND = n => n <= 1 ? 'A1' : n <= 3 ? 'A2' : n <= 5 ? 'B1' : n <= 7 ? 'B2' : 'C1';
const TARGET = 6;                       // passages every theme should hold per band

const band = (process.argv[2] || 'A1').toUpperCase();
const theme = process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : null;
const all = process.argv.includes('--all');
if (BANDS.indexOf(band) === -1) { console.error(`unknown band "${band}"`); process.exit(1); }

const upTo = BANDS.slice(0, BANDS.indexOf(band) + 1);
const inBand = (window.PASSAGES || []).filter(p => BAND(p.level || 1) === band);

function report(t) {
  const words = (window.VOCAB || []).filter(w => w.theme === t && upTo.indexOf(w.cefr) !== -1);
  const nextBand = BANDS[BANDS.indexOf(band) + 1];
  /* Thin at this band: offer the next one up to gloss. 25 is the count below
   * which building six distinct scenes out of the band's own words stops being
   * possible — 17 of the 20 themes were under it at A1 before the seed rows
   * were given a cefr, and ten of them still are. */
  const stretch = (words.length < 25 && nextBand)
    ? (window.VOCAB || []).filter(w => w.theme === t && w.cefr === nextBand) : [];
  const mine = inBand.filter(p => p.theme === t);
  const used = new Set();
  mine.forEach(p => { const ix = LM.index(p.text); words.forEach(w => { if (ix.has(w.es)) used.add(w.es); }); });

  const fresh = words.filter(w => !used.has(w.es));
  const seen = words.filter(w => used.has(w.es));
  console.log(`\n═══ ${band} · ${t} — ${mine.length}/${TARGET} passages` +
    (mine.length < TARGET ? `  (need ${TARGET - mine.length} more)` : '  ✓') +
    `   ${words.length} words at or below ${band}, ${fresh.length} unused`);
  const line = w => `${w.es}${w.cefr && w.cefr !== band ? ' [' + w.cefr + ']' : ''} — ${w.en}`;
  /* An empty band is exactly the case the widening below exists for —
   * `economia` has no A1 vocabulary at all — so do not return here. Say so and
   * fall through to the band above. */
  if (!words.length) console.log('  (nothing at this band at all)');
  else console.log('  UNUSED:');
  if (words.length) {
    (fresh.length ? fresh : [{ es: '(none)', en: 'every word of this theme is already in a passage here' }])
      .forEach(w => console.log('    · ' + line(w)));
  }
  if (all && seen.length) {
    console.log('  ALREADY USED HERE:');
    seen.forEach(w => console.log('    · ' + line(w)));
  } else if (seen.length) {
    console.log(`  (+ ${seen.length} already used in this band's ${t} passages — --all to list)`);
  }
  if (stretch.length) {
    const usedUp = new Set();
    mine.forEach(p => { const ix = LM.index(p.text); stretch.forEach(w => { if (ix.has(w.es)) usedUp.add(w.es); }); });
    const offer = stretch.filter(w => all || !usedUp.has(w.es));
    console.log(`  ONE BAND UP (${nextBand}) — only ${words.length} words at ${band}; gloss these:`);
    offer.slice(0, 40).forEach(w => console.log('    · ' + line(w)));
    if (offer.length > 40) console.log(`    … and ${offer.length - 40} more`);
  }
}

if (theme) {
  if (!(window.THEMES || []).some(x => x.id === theme)) { console.error(`unknown theme "${theme}"`); process.exit(1); }
  report(theme);
} else {
  const short = (window.THEMES || []).map(x => x.id)
    .map(t => ({ t, n: inBand.filter(p => p.theme === t).length }))
    .filter(x => x.n < TARGET).sort((a, b) => a.n - b.n);
  console.log(`${band}: ${short.length} of 20 themes below ${TARGET} passages; ` +
              `${short.reduce((s, x) => s + (TARGET - x.n), 0)} to write.`);
  short.forEach(x => report(x.t));
}
