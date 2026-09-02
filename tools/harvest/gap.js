#!/usr/bin/env node
/* ============================================================================
 * gap.js — what does the PCIC say B1-C1 requires, and what do we actually have?
 *
 *   node tools/harvest/gap.js            (needs spec/pcic.json from pcic.js)
 *
 * Three reports, written to spec/gap-report.txt:
 *   1. TOPICAL LEXIS — per PCIC theme, how many words/collocations each level
 *      wants vs how many we have in data/vocab.js. This is the "can a user talk
 *      about this topic at C1" question, measured.
 *   2. GRAMMAR — PCIC grammar sections at B1/B2/C1 with no lesson in SYLLABUS.
 *   3. FUNCTIONS & DISCOURSE — the B2/C1 communicative functions and pragmatic
 *      tactics we teach nowhere, which is most of what "advanced" means.
 * ========================================================================== */
'use strict';

const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const spec = require(path.join(ROOT, 'spec', 'pcic.json'));

// load the app's data files the same way the validator does
global.window = {};
['data/vocab.js', 'data/verbs.js', 'data/idioms.js', 'data/topics.js', 'data/grammar-docs.js', 'data/grammar.js']
  .forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const VOCAB = global.window.VOCAB || [], TOPICS = global.window.TOPICS || [];

const SYLLABUS_IDS = ['presente', 'ser-estar', 'gender-articles', 'preterito', 'imperfecto',
  'preterite-imperfect', 'por-para', 'futuro', 'condicional', 'perfecto', 'presubj', 'impsubj',
  'imperativo', 'plusc', 'futperf', 'condperf', 'perfsubj', 'impneg'];

const norm = s => String(s).toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/^(el|la|los|las|un|una|unos|unas)\s+/, '').trim();

// every headword we currently teach (vocab + verbs + idioms)
const HAVE = new Set();
VOCAB.forEach(w => HAVE.add(norm(w.es)));
(global.window.VERBS || []).forEach(v => HAVE.add(norm(v.inf)));
(global.window.IDIOMS || []).forEach(i => HAVE.add(norm(i.es)));

const LEX = require('./lexis.js');
const headwords = p => LEX.headwords(p).map(norm);

const out = [];
const say = s => { out.push(s); console.log(s); };
const bar = (have, want) => {
  const pct = want ? Math.min(1, have / want) : 0, n = Math.round(pct * 24);
  return '[' + '#'.repeat(n) + '·'.repeat(24 - n) + '] ' + String(Math.round(pct * 100)).padStart(3) + '%';
};

/* ---- 1. topical lexis ---------------------------------------------------- */
say('='.repeat(96));
say('1. TOPICAL LEXIS — PCIC "nociones específicas" vs data/vocab.js');
say('='.repeat(96));
say('   Can a learner talk about this theme? PCIC headwords wanted per level,');
say('   against how many of them we already teach (any level).');
say('');

const themes = {};
spec.filter(i => i.inventory === 'nociones_especificas').forEach(i => {
  const t = i.section || '?';
  const th = themes[t] = themes[t] || { A: new Set(), B1: new Set(), B2: new Set(), C1: new Set(), C2: new Set() };
  const band = /^A/.test(i.level) ? 'A' : i.level;
  if (!th[band]) return;
  headwords(i.pattern).forEach(w => th[band].add(w));
});

const covered = set => [...set].filter(w => HAVE.has(w)).length;
say('theme'.padEnd(42) + 'A1-A2'.padStart(8) + 'B1'.padStart(7) + 'B2'.padStart(7) + 'C1'.padStart(7) +
    '   ' + 'have'.padStart(6) + '  of A1-B1');
say('-'.repeat(96));
let totWant = 0, totHave = 0;
Object.keys(themes).sort((a, b) => (parseInt(a) || 99) - (parseInt(b) || 99)).forEach(t => {
  const th = themes[t];
  const core = new Set([...th.A, ...th.B1]);              // the A1-B1 floor
  const have = covered(core);
  totWant += core.size; totHave += have;
  say(t.slice(0, 41).padEnd(42) + String(th.A.size).padStart(8) + String(th.B1.size).padStart(7) +
      String(th.B2.size).padStart(7) + String(th.C1.size).padStart(7) + '   ' +
      String(have).padStart(6) + '  ' + bar(have, core.size));
});
say('-'.repeat(96));
say('ALL THEMES'.padEnd(42) + ''.padStart(29) + String(totHave).padStart(9) + '  ' + bar(totHave, totWant) +
    '  (' + totHave + '/' + totWant + ' of the A1-B1 floor)');

/* ---- 2. grammar ---------------------------------------------------------- */
say('');
say('='.repeat(96));
say('2. GRAMMAR — PCIC sections at B1/B2/C1 with no lesson in SYLLABUS');
say('='.repeat(96));

/* Match each ITEM (not just its subsection) against the lessons we teach, using
 * the full heading path — "9. El verbo › 9.1. ... › 9.1.3. Pretérito indefinido"
 * — so a tense we already cover is not reported as a gap. Keyword matching, so
 * treat the counts as indicative, not exact. */
const LESSON_KEYWORDS = {
  presente: /9\.1\.1\. Presente|presente de indicativo/i,
  preterito: /Pretérito indefinido/i,
  imperfecto: /9\.1\.2\. Pretérito imperfecto/i,
  futuro: /Futuro imperfecto/i,
  condicional: /Condicional simple/i,
  perfecto: /Pretérito perfecto compuesto/i,
  plusc: /Pretérito pluscuamperfecto/i,
  presubj: /9\.2\.1\. Presente|presente de subjuntivo/i,
  impsubj: /9\.2\.2\. Pretérito imperfecto|imperfecto de subjuntivo/i,
  imperativo: /Imperativo/i,
  futperf: /Futuro perfecto/i, condperf: /Condicional perfecto/i,
  perfsubj: /9\.2\.3\. Pretérito perfecto/i,
  'ser-estar': /ser y estar|ser \/ estar/i,
  'gender-articles': /1\.2\. El género|3\. El artículo/i,
  'por-para': /\bpor\b.*\bpara\b/i
};
const grammarSecs = {};
let coveredItems = 0;
spec.filter(i => i.inventory === 'gramatica' && /^(B1|B2|C1)$/.test(i.level)).forEach(i => {
  const full = [i.section, i.subsection].concat(i.path).filter(Boolean).join(' › ');
  if (Object.keys(LESSON_KEYWORDS).some(id => LESSON_KEYWORDS[id].test(full))) { coveredItems++; return; }
  const key = (i.section || '?') + ' :: ' + (i.subsection || '');
  const g = grammarSecs[key] = grammarSecs[key] || { levels: new Set(), n: 0, ex: [], sub: {} };
  g.levels.add(i.level); g.n++;
  const leaf = i.path[0] || '(direct)';
  g.sub[leaf] = (g.sub[leaf] || 0) + 1;
  if (i.examples && i.examples[0] && g.ex.length < 1) g.ex.push(i.examples[0]);
});
const totalG = coveredItems + Object.values(grammarSecs).reduce((n, g) => n + g.n, 0);
say('   ' + coveredItems + ' of ' + totalG + ' B1-C1 grammar spec items are covered by a current');
say('   lesson (' + Math.round(100 * coveredItems / totalG) + '%). The rest, by subsection:');
say('');
Object.keys(grammarSecs).sort((a, b) => grammarSecs[b].n - grammarSecs[a].n).slice(0, 26).forEach(k => {
  const g = grammarSecs[k];
  say('  ' + String(g.n).padStart(4) + '  [' + [...g.levels].sort().join(',').padEnd(8) + ']  ' + k.replace(' :: ', ' › ').slice(0, 72));
  const tops = Object.keys(g.sub).sort((a, b) => g.sub[b] - g.sub[a]).slice(0, 4)
    .filter(x => x !== '(direct)').join(' · ');
  if (tops) say('        ' + tops.slice(0, 88));
  else if (g.ex[0]) say('        e.g. ' + g.ex[0].slice(0, 82));
});

/* ---- 3. functions & discourse -------------------------------------------- */
say('');
say('='.repeat(96));
say('3. FUNCTIONS & DISCOURSE at B2/C1 — what "advanced" actually means');
say('='.repeat(96));
say('   We teach tenses. These are the things a C1 speaker DOES with them, and');
say('   data/topics.js currently asks for none of them.');
say('');
const fn = {};
spec.filter(i => /^(funciones|tacticas_pragmaticas)$/.test(i.inventory) && /^(B2|C1)$/.test(i.level))
  .forEach(i => {
    const key = i.inventory + ' › ' + (i.section || '?');
    (fn[key] = fn[key] || { n: 0, subs: new Set() }).n++;
    if (i.subsection) fn[key].subs.add(i.subsection);
  });
Object.keys(fn).sort((a, b) => fn[b].n - fn[a].n).forEach(k => {
  say('  ' + String(fn[k].n).padStart(4) + '  ' + k.slice(0, 88));
  say('        ' + [...fn[k].subs].slice(0, 6).join(' · ').slice(0, 88));
});

/* ---- 4. what topics.js covers -------------------------------------------- */
say('');
say('='.repeat(96));
say('4. data/topics.js — "Hablar de…" coverage');
say('='.repeat(96));
say('  ' + TOPICS.length + ' topics, ' + TOPICS.reduce((n, t) => n + t.prompts.length, 0) + ' prompts, ' +
    'max level ' + Math.max(...TOPICS.flatMap(t => t.prompts.map(p => p.level))) +
    ' — against ' + Object.keys(themes).length + ' PCIC themes.');
const topicNames = TOPICS.map(t => t.topic.toLowerCase()).join(' | ');
say('  ' + topicNames);
say('');
say('  PCIC themes with no matching topic chip (i.e. no way to practise speaking about them):');
const MAP = { familia: /relaciones personales|identidad/i, rutina: /ocio|individuo/i, ciudad: /vivienda|geografía/i,
  trabajo: /trabajo|educación/i, comida: /alimentación/i, salud: /salud/i, vacaciones: /viajes/i, gustos: /ocio/i };
Object.keys(themes).sort((a, b) => (parseInt(a) || 99) - (parseInt(b) || 99)).forEach(t => {
  if (!Object.values(MAP).some(re => re.test(t))) say('    · ' + t);
});

fs.writeFileSync(path.join(ROOT, 'spec', 'gap-report.txt'), out.join('\n') + '\n');
console.log('\n→ spec/gap-report.txt');
