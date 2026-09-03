#!/usr/bin/env node
/* ============================================================================
 * variety.js — is the practice material varied enough to be worth having?
 *
 *   node tools/variety.js            all levels
 *   node tools/variety.js B1
 *
 * The gates check that content is CORRECT. They cannot see that 81 passages
 * are the same passage: the B1 batch was correct Spanish, correctly tagged by
 * level, and 78% of it contained "Antes de …", 49% "espera que", 19% all three
 * of the same frames. Topics varied; sentence architecture did not. A learner
 * meets the frame, not the language.
 *
 * This reports, per level: over-used syntactic frames, passage length against
 * the target for the band, theme-tag coverage, and how much of the verb
 * dataset the material actually reaches. Not a hard gate — the thresholds are
 * judgement, not truth — but run it before calling a batch done.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
['data/taxonomy.js', 'data/verbs.js', 'data/vocab.js', 'data/passages.js',
 'data/apply.js', 'data/writing.js', 'js/engine.js'].forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const E = window.ENGINE;

const BAND = n => n <= 1 ? 'A1' : n <= 3 ? 'A2' : n <= 5 ? 'B1' : n <= 7 ? 'B2' : 'C1';
const LEN = { A1: [30, 60], A2: [60, 100], B1: [100, 160], B2: [200, 300], C1: [320, 450] };

/* Frames worth watching: each is a scaffold a generator reaches for when it is
 * building a text around a grammar point rather than around something to say. */
const FRAMES = [
  ['antes de', /\bantes de\b/i], ['al principio', /\bal principio\b/i],
  ['dudaba/dudaban que', /\bdudaba[n]? que\b/i], ['espera(n) que', /\bespera[n]? que\b/i],
  ['es ADJ que', /\bes (increíble|maravilloso|evidente|una pena|normal|lógico|natural|curioso|sorprendente|fantástico|estupendo|raro|triste|importante) que\b/i],
  ['para cuando', /\bpara cuando\b/i], ['desde que', /\bdesde que\b/i],
  ['lo que más', /\blo que más\b/i], ['cada vez que', /\bcada vez que\b/i],
];
const THRESHOLD = 0.25;                      // a frame in more than a quarter is over-used

const only = (process.argv[2] || '').toUpperCase();
const bands = ['A1', 'A2', 'B1', 'B2', 'C1'].filter(b => !only || b === only);

let flagged = 0;
bands.forEach(b => {
  const ps = (window.PASSAGES || []).filter(p => BAND(p.level || 1) === b);
  const ap = (window.APPLY_ITEMS || []).filter(x => BAND(x.level || 1) === b);
  const wr = (window.WRITING_TASKS || []).filter(x => BAND(x.level || 1) === b);
  if (!ps.length && !ap.length && !wr.length) return;

  console.log(`\n═══ ${b} — ${ps.length} passages, ${ap.length} apply, ${wr.length} writing`);

  if (ps.length) {
    const over = FRAMES.map(([label, re]) => [label, ps.filter(p => re.test(p.text)).length])
      .filter(([, n]) => n / ps.length > THRESHOLD)
      .sort((a, c) => c[1] - a[1]);
    if (over.length) {
      flagged++;
      console.log('  ⚠ over-used frames: ' + over.map(([l, n]) =>
        `"${l}" ${Math.round(100 * n / ps.length)}%`).join('   '));
    } else console.log('  ✓ no frame in more than ' + (THRESHOLD * 100) + '% of passages');

    const wc = ps.map(p => E.tokenize(p.text).length);
    const [lo, hi] = LEN[b];
    const outside = wc.filter(n => n < lo || n > hi).length;
    const mean = Math.round(wc.reduce((a, c) => a + c, 0) / wc.length);
    if (outside / ps.length > 0.25) {
      flagged++;
      console.log(`  ⚠ length: mean ${mean} words, target ${lo}-${hi}; ${outside} of ${ps.length} outside`);
    } else console.log(`  ✓ length: mean ${mean} words, target ${lo}-${hi}`);

    const themed = ps.filter(p => p.theme).length;
    if (themed < ps.length) {
      flagged++;
      console.log(`  ⚠ theme tags: ${themed}/${ps.length} — untagged passages cannot appear in a themed track`);
    } else console.log('  ✓ every passage carries a theme');

    const used = new Set();
    ps.forEach(p => E.tokenize(p.text).forEach(t => E.analyzeToken(t).forEach(a => used.add(a.inf))));
    console.log(`  · passages reach ${used.size} distinct verbs`);
  }

  if (ap.length) {
    const infs = new Set(ap.map(x => x.inf).filter(Boolean));
    const ratio = infs.size / ap.length;
    if (ratio < 0.5) {
      flagged++;
      console.log(`  ⚠ apply items drill only ${infs.size} distinct verbs across ${ap.length} items`);
    } else console.log(`  ✓ apply items drill ${infs.size} distinct verbs`);
  }
});

console.log(flagged ? `\n${flagged} thing(s) to look at before calling this done.`
                    : '\nNothing flagged.');
