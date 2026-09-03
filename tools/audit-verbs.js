#!/usr/bin/env node
/* ============================================================================
 * audit-verbs.js — check every verb's paradigm against real Spanish.
 *
 *   node tools/audit-verbs.js
 *
 * WHY: the conjugation engine is the authority every other gate trusts. A verb
 * filed in the wrong class — a stem-changer added as regular, say — makes the
 * engine confidently wrong, and validate-content.js will happily certify a
 * cloze whose "correct" answer is not Spanish. That is how "actualizé" reached
 * production.
 *
 * HOW: the Plan Curricular ships 11,834 example sentences of real, edited
 * Spanish. For each verb, build the paradigm it WOULD have under each possible
 * classification — regular, e>ie, o>ue, e>i, and the -iar/-uar accent classes —
 * and count how many corpus word-forms each one explains. If a class other than
 * the one we filed explains strictly more real Spanish, the verb is misfiled.
 *
 * Scoring whole paradigms rather than hunting look-alike tokens is what makes
 * this precise: a derived noun (dormitorio, producto, comentario) belongs to no
 * paradigm and so is silently ignored, instead of drowning the report.
 *
 * This is the gate that makes it safe for a fast model to add verbs in bulk:
 * misfiling one is caught by evidence rather than by review.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
['data/verbs.js', 'js/engine.js'].forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const E = window.ENGINE;
let spec;
try { spec = require(path.join(ROOT, 'spec', 'pcic.json')); }
catch (e) { console.error('spec/pcic.json not found — run tools/harvest/pcic.js first.'); process.exit(0); }


const corpus = new Map();
spec.forEach(i => (i.examples || []).forEach(ex =>
  E.tokenize(ex).forEach(w => corpus.set(w, (corpus.get(w) || 0) + 1))));

const CLASSES = [undefined, 'ie', 'ue', 'i', 'í', 'ú'];
const label = c => c === undefined ? 'regular' : c;
// Compound tenses are haber + participle, so every verb's paradigm contains
// "he, has, ha…" — forms the corpus is saturated with. Counting those swamps
// the signal, so score the simple tenses only.
const SIMPLE = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'presubj', 'impsubj', 'imperativo'];

function formsOf(v, c) {
  const probe = { inf: v.inf, en: v.en, type: v.type, stem: c, like: v.like, forms: v.forms };
  const out = new Set();
  SIMPLE.forEach(t => {
    try { E.conjugate(probe, t).forEach(f => f.split(' ').forEach(w => { if (w !== 'no') out.add(w); })); } catch (e) {}
  });
  try { out.add(E.gerund(probe)); out.add(E.participle(probe)); } catch (e) {}
  return out;
}
/* Forms that ANOTHER verb in the dataset already produces are not evidence
 * about this one: "cuento" is contar's, not cantar's, and would otherwise
 * make cantar look like an o>ue verb. */
const OTHERS = new Map();
window.VERBS.forEach(v => formsOf(v, v.stem).forEach(w => {
  if (!OTHERS.has(w)) OTHERS.set(w, new Set());
  OTHERS.get(w).add(v.inf);
}));
// Corpus words that exactly spell a WRONG hypothetical stem-class form of a
// specific verb but are actually an unrelated common word (an adjective, a
// noun) — not evidence about that verb's real class. "cortar" is genuinely
// regular; the corpus's "cierto" (certain) only LOOKS like its hypothetical
// e>ie yo-form. Scoped to the exact (verb, word) pair, never blanket, so it
// can never hide real evidence about some OTHER verb — "herido" is
// genuinely herir's participle, once herir is in the dataset; this only
// blinds heredar's own audit to that coincidence.
const FALSE_EVIDENCE = new Map([
  ['cortar', new Set(['cierto', 'ciertas', 'cierta'])],
  ['cortarse', new Set(['cierto', 'ciertas', 'cierta'])],
  ['pintar', new Set(['puente', 'puentes'])],
  ['pintarse', new Set(['puente', 'puentes'])],
  ['portarse', new Set(['puerto', 'puertas', 'puerta'])],
  ['heredar', new Set(['herido', 'heridas', 'herida'])],
  ['pudrirse', new Set(['piedra', 'piedras'])],
  ['partir', new Set(['puerto', 'puertas', 'puerta'])],
  ['partirse', new Set(['puerto', 'puertas', 'puerta'])],
  ['frotar', new Set(['frito', 'fritas'])],
  ['desertar', new Set(['desierto', 'desierta'])]
]);
function evidenceFor(set, inf) {
  return [...set].filter(w => {
    if (!corpus.has(w)) return false;
    if (FALSE_EVIDENCE.has(inf) && FALSE_EVIDENCE.get(inf).has(w)) return false;
    const owners = OTHERS.get(w);
    return !owners || (owners.size === 1 && owners.has(inf));
  });
}
const support = (set, inf) => evidenceFor(set, inf).reduce((n, w) => n + corpus.get(w), 0);

const findings = [];
window.VERBS.forEach(v => {
  if (v.forms && Object.keys(v.forms).length >= 3) return;   // fully hand-specified
  const filedForms = formsOf(v, v.stem);
  CLASSES.forEach(c => {
    if (c === v.stem) return;
    const candForms = formsOf(v, c);
    // only the forms the two classifications DISAGREE about carry evidence
    const onlyFiled = new Set([...filedForms].filter(w => !candForms.has(w)));
    const onlyCand = new Set([...candForms].filter(w => !filedForms.has(w)));
    if (!onlyCand.size) return;
    const fs = support(onlyFiled, v.inf), cs = support(onlyCand, v.inf);
    const ev = evidenceFor(onlyCand, v.inf);
    // Two distinct forms, and nothing at all supporting how it is filed: that is
    // a misfiling. One stray form is usually a homograph (cine, solo, cierto),
    // so those are reported for review rather than failing the build.
    if (cs > fs && ev.length >= 2) {
      findings.push({ inf: v.inf, filed: label(v.stem), fs, better: label(c), cs,
        hard: fs === 0, evidence: ev.slice(0, 4).join(' ') });
    }
  });
});

console.log(`${window.VERBS.length} verbs · ${corpus.size} distinct corpus tokens\n`);
if (!findings.length) {
  console.log('✅ No verb is contradicted by the corpus.');
  process.exit(0);
}
const hard = findings.filter(f => f.hard), soft = findings.filter(f => !f.hard);
if (hard.length) {
  console.log(`MISFILED (${hard.length}) — nothing supports how these are filed:`);
  hard.forEach(f => console.log(`  ✗ ${f.inf.padEnd(15)} filed "${f.filed}" — corpus shows "${f.better}":  ${f.evidence}`));
  console.log('');
}
if (soft.length) {
  console.log(`REVIEW (${soft.length}) — both classes have some support, probably homographs:`);
  soft.forEach(f => console.log(`    ${f.inf.padEnd(15)} filed "${f.filed}" (${f.fs}) vs "${f.better}" (${f.cs}):  ${f.evidence}`));
  console.log('');
}
if (hard.length) { console.error(`❌ ${hard.length} misfiled verb(s).`); process.exit(1); }
console.log('✅ No verb is contradicted outright by the corpus.');
