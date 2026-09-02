#!/usr/bin/env node
/* ============================================================================
 * lint-spanish.js — catch accent errors in authored or generated Spanish.
 *
 *   node tools/lint-spanish.js            all content
 *   node tools/lint-spanish.js strand     just data/strand-lessons.js
 *
 * WHY: validate-content.js verifies conjugations wherever the ENGINE computes
 * the answer (cloze, transforms, constraint targets), but the prose — passage
 * text, lesson sections, exponents, model answers — is never checked, and a
 * dropped accent is the single most common thing a fast model gets wrong in
 * Spanish. `razon`, `comi`, `esta` for `está`: all invisible to every gate.
 *
 * HOW: build a lexicon of Spanish we know is correct —
 *   · every form the engine can conjugate for all 200 verbs   (~7,800)
 *   · authored vocab, idioms and connectors                   (~500)
 *   · the PCIC's own patterns and 11,834 worked examples       (~19,000)
 * — about 27,000 word forms. Then, for every token in the content:
 *
 *   ACCENT ERROR (high confidence): deaccenting the word matches a form the
 *     ENGINE generates, and the word itself is not a valid form. "comi" ->
 *     "comí". This is adjudicated ONLY against the engine's own paradigms,
 *     never against the corpus lexicon, because Spanish is full of minimal
 *     accent pairs that are both correct — hablo/habló, esta/está,
 *     publico/publicó/público. Deciding between them needs the COMPLETE
 *     paradigm, which we have for the 200 verbs in data/verbs.js and nowhere
 *     else. (Judging "comunicó" against a corpus that happened to contain only
 *     "comunico" reports a correct word as an error.)
 *
 *   UNKNOWN (low confidence): not in the lexicon at all. Mostly legitimate —
 *     plurals and derived forms the lexicon happens not to contain — so this
 *     is a REVIEW LIST, not an error. About 1.8% of tokens on known-good text.
 *
 * Exits 1 only on accent errors, so it is safe to run as a gate.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
const load = f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8'));
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'data/taxonomy.js',
 'data/passages.js', 'data/writing.js', 'data/topics.js', 'data/apply.js',
 'data/strand-lessons.js', 'js/engine.js'].forEach(load);
const E = window.ENGINE;

const deac = s => E.deaccent(String(s).toLowerCase());

/* ---- the lexicon --------------------------------------------------------- */
const lex = new Set();               // everything we have seen: the unknown-word filter
const engineDeac = new Map();        // deaccented -> correct spellings, ENGINE ONLY
function learn(text) { E.tokenize(text || '').forEach(w => lex.add(w)); }
function learnEngine(text) {
  E.tokenize(text || '').forEach(w => {
    lex.add(w);
    const d = deac(w);
    if (!engineDeac.has(d)) engineDeac.set(d, new Set());
    engineDeac.get(d).add(w);
  });
}
(window.VERBS || []).forEach(v => {
  E.TENSES.forEach(t => { try { E.conjugate(v, t.key).forEach(learnEngine); } catch (e) { /* tense n/a */ } });
  learnEngine(v.inf);
});
(window.VOCAB || []).forEach(w => learn(w.es));
(window.IDIOMS || []).forEach(i => learn(i.es));
(window.CONNECTORS || []).forEach(c => c.items.forEach(i => learn(i.es)));
try {
  require(path.join(ROOT, 'spec', 'pcic.json')).forEach(i => { learn(i.pattern); (i.examples || []).forEach(learn); });
} catch (e) { console.error('  (spec/pcic.json not found — lexicon is smaller; run tools/harvest/pcic.js)'); }

/* ---- gather the Spanish in the corpus ------------------------------------ */
const only = process.argv[2];
const texts = [];                                  // [{where, text}]
const push = (where, text) => { if (text) texts.push({ where, text: String(text) }); };

if (!only || only === 'passages') (window.PASSAGES || []).forEach(p => {
  push(`passage ${p.id}`, p.text);
  (p.questions || []).forEach((q, i) => { push(`passage ${p.id} q[${i}]`, q.q); push(`passage ${p.id} q[${i}]`, q.line); });
});
if (!only || only === 'writing') (window.WRITING_TASKS || []).forEach(t => {
  (t.models || []).forEach((m, i) => push(`writing ${t.id} model[${i}]`, m));
  push(`writing ${t.id}`, t.answer);
});
if (!only || only === 'apply') (window.APPLY_ITEMS || []).forEach((a, i) => {
  push(`apply[${i}]`, a.text); push(`apply[${i}]`, a.from); push(`apply[${i}]`, a.to);
});
if (!only || only === 'strand') (window.STRAND_LESSONS || []).forEach(l => {
  (l.exponents || []).forEach((e, i) => push(`${l.id} exponent[${i}]`, e.es));
  (l.examples || []).forEach((e, i) => push(`${l.id} example[${i}]`, e.es));
  (l.contrasts || []).forEach((c, i) => push(`${l.id} contrast[${i}]`, c.es));
  if (l.model) push(`${l.id} model`, l.model.text);
  (l.probes || []).forEach(p => { push(`${l.id} ${p.id}`, p.text); push(`${l.id} ${p.id}`, p.q); });
});

/* ---- lint ---------------------------------------------------------------- */
const accentErrors = [], unknown = new Map();
let tokens = 0;
texts.forEach(({ where, text }) => {
  E.tokenize(text).forEach(w => {
    tokens++;
    if (lex.has(w)) return;
    const cands = engineDeac.get(deac(w));
    if (cands && cands.size) accentErrors.push({ where, got: w, expected: [...cands].join(' / ') });
    else {
      if (!unknown.has(w)) unknown.set(w, { n: 0, where });
      unknown.get(w).n++;
    }
  });
});

console.log(`lexicon ${lex.size} forms (${engineDeac.size} engine-adjudicated) · checked ${tokens} tokens in ${texts.length} strings\n`);
if (accentErrors.length) {
  console.log(`ACCENT ERRORS (${accentErrors.length}):`);
  accentErrors.forEach(e => console.log(`  ✗ ${e.where}: "${e.got}" — should be "${e.expected}"`));
  console.log('');
}
const u = [...unknown.entries()].sort((a, b) => b[1].n - a[1].n);
console.log(`UNKNOWN WORDS (${u.length} distinct, ${(100 * u.reduce((n, [, v]) => n + v.n, 0) / tokens).toFixed(2)}% of tokens) — review list, not errors:`);
u.slice(0, 40).forEach(([w, v]) => console.log(`    ${String(v.n).padStart(3)}  ${w.padEnd(20)} ${v.where}`));
if (u.length > 40) console.log(`    … and ${u.length - 40} more`);

if (accentErrors.length) { console.error(`\n❌ ${accentErrors.length} accent error(s).`); process.exit(1); }
console.log('\n✅ No accent errors.');
