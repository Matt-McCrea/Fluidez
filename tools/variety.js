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
 'data/apply.js', 'data/writing.js', 'js/engine.js', 'js/lexmatch.js'].forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const E = window.ENGINE, LM = window.LexMatch;

/* ---- theme density -------------------------------------------------------
 * The rule this enforces: a passage must carry at least ten words from its
 * OWN theme's vocabulary. It exists because the two halves of the session
 * were chosen independently of each other — measured over a themed week,
 * 7 of the 336 words a learner was taught appeared in the reading that taught
 * them, and the average passage shared only 3.6 words with its own theme.
 * A text on `vivienda` that happens to mention a flat teaches nothing about
 * housing; one built out of twelve housing words is the lesson.
 *
 * Write the passage FROM a shortlist — pull the theme's vocabulary at the
 * band, pick twelve that belong in one scene, build the text around them —
 * rather than writing it and hoping.
 *
 * Counted with js/lexmatch.js, the same matcher js/views/review.js picks the
 * day's new words with. Deliberately not a second implementation: if the app
 * and this check ever disagreed, the app would teach words on the promise
 * that they appear in today's reading, where they do not.
 *
 * BASELINE. The 393 passages that predate the rule mostly do not meet it and
 * cannot all be rewritten, so they are listed in tools/density-baseline.json
 * and reported but not failed. Anything not on that list — which is
 * everything written from here on — fails the run. Removing an id from the
 * baseline is how a rewritten passage opts in. */
const DENSITY_MIN = 10;
const BASELINE = new Set(require('./density-baseline.json').ids);
const themeWords = {};
(window.VOCAB || []).forEach(w => { if (w.theme) (themeWords[w.theme] = themeWords[w.theme] || []).push(w); });
const density = p => (p.theme && LM) ? LM.countIn(p.text, themeWords[p.theme] || []) : 0;

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

let flagged = 0, failed = false;
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

    // theme density — the one rule here that is a gate rather than a judgement
    const dens = ps.map(p => ({ p, n: density(p) }));
    const dmean = (dens.reduce((a, c) => a + c.n, 0) / dens.length).toFixed(1);
    const thin = dens.filter(d => d.n < DENSITY_MIN && !BASELINE.has(d.p.id));
    const grandfathered = dens.filter(d => d.n < DENSITY_MIN && BASELINE.has(d.p.id)).length;
    if (thin.length) {
      failed = true;
      console.log(`  ✗ theme density: ${thin.length} passage(s) carry fewer than ${DENSITY_MIN}` +
                  ` words of their own theme (mean ${dmean})`);
      thin.sort((a, c) => a.n - c.n).slice(0, 20).forEach(d =>
        console.log(`      ${String(d.n).padStart(2)}  ${d.p.id}  (${d.p.theme})`));
      if (thin.length > 20) console.log(`      … and ${thin.length - 20} more`);
    } else {
      console.log(`  ✓ theme density: mean ${dmean} words of own theme, none below ${DENSITY_MIN}` +
                  (grandfathered ? ` (${grandfathered} pre-rule passages not counted)` : ''));
    }
    if (process.argv.includes('--density')) {
      dens.sort((a, c) => c.n - a.n).forEach(d =>
        console.log(`      ${String(d.n).padStart(2)}  ${d.p.id}  (${d.p.theme || 'no theme'})` +
                    (BASELINE.has(d.p.id) ? '  [pre-rule]' : '')));
    }
  }

  /* Verb variety is measured over the items that ARE verb drills. A `choice`
   * item picks between ser/estar or por/para and names no verb of its own, so
   * counting it in the denominator made the band look like it had lost verb
   * variety the moment those items were added — the metric measuring its own
   * blind spot rather than the content. */
  const apVerbs = ap.filter(x => x.type !== 'choice');
  if (apVerbs.length) {
    const infs = new Set(apVerbs.map(x => x.inf).filter(Boolean));
    const ratio = infs.size / apVerbs.length;
    if (ratio < 0.5) {
      flagged++;
      console.log(`  ⚠ apply items drill only ${infs.size} distinct verbs across ${apVerbs.length} verb items`);
    } else console.log(`  ✓ apply items drill ${infs.size} distinct verbs`);
    const nChoice = ap.length - apVerbs.length;
    if (nChoice) console.log(`  · ${nChoice} choice items drill contrasts rather than conjugation`);
  }
});

console.log(flagged ? `\n${flagged} thing(s) to look at before calling this done.`
                    : '\nNothing flagged.');
/* The frame/length/verb thresholds are judgement and only ever advise. Theme
 * density is a rule with a number in it, so it sets the exit code. */
if (failed) { console.log('Theme density is a gate, not a suggestion — fix before committing.'); process.exit(1); }
