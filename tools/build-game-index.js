#!/usr/bin/env node
/* ============================================================================
 * build-game-index.js — precompute the games' question bank.
 *
 *   node tools/build-game-index.js          write data/game-index.js
 *   node tools/build-game-index.js --check   exit 1 if it is stale
 *
 * WHY. GameItems.buildIndex() reads the teaching corpus to find questions: 798
 * strand lessons for their examples, exponents, contrasts and probes, the
 * translation tasks for their models, the cloze items, the idioms. That is
 * correct inside the full app, which is carrying those files for the lessons
 * anyway. It is ruinous for an arcade that wants to open in two seconds: the
 * three files it reads are 3.4 MB, 273 KB and 160 KB, and none of them is
 * needed for anything else a game does.
 *
 * So the walk happens here, once, and ships as data. A build that includes
 * data/game-index.js can drop data/strand-lessons.js, data/writing.js and
 * data/apply.js entirely and still deal every question the games have ever
 * dealt.
 *
 * THE ONE RULE THIS FILE OBEYS: it does not know how to build an index. It
 * loads js/gameitems.js and calls it, then serialises what came back. A
 * generator that reimplemented the extraction would be correct exactly until
 * somebody changed a bonus or a filter in gameitems.js, and then it would be
 * quietly wrong in a way no gate could see — the app and the arcade would be
 * dealing different questions from the same repository.
 *
 * WHAT IS NOT SHIPPED. Everything derivable from data/vocab.js and
 * data/verbs.js — the vocabulary buckets, themes, genders, the word list and
 * the gloss map — because the arcade loads those two files regardless (the
 * Verbos game conjugates, and distractors have to be real words). Likewise
 * byEnglish and byTense, which gameitems.js rebuilds in one pass from the
 * pairs and grammar it is given. Shipping them would roughly double the file
 * to save a few milliseconds.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/game-index.js');
const check = process.argv.indexOf('--check') !== -1;

/* The app's own modules, against the smallest shims they will accept. Load
 * order matters exactly as it does in index.html. */
const store = {};
global.window = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
global.location = { search: '', hash: '' };
global.document = {
  documentElement: { style: { setProperty() {} }, dataset: {}, setAttribute() {}, classList: { add() {}, remove() {} } },
  body: { classList: { add() {}, remove() {} } },
  createElement: () => ({ style: {}, classList: { add() {}, remove() {} }, appendChild() {}, setAttribute() {} }),
  querySelector: () => null,
  addEventListener() {}
};

[ 'data/taxonomy.js', 'data/connectors.js', 'data/rubrics.js', 'data/verbs.js',
  'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js',
  'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js',
  'data/strand-lessons.js', 'data/course.js',
  'js/ui.js', 'js/engine.js', 'js/lessons.js', 'js/checker.js', 'js/srs.js',
  'js/profile.js', 'js/curriculum.js', 'js/lexmatch.js', 'js/phrases.js',
  'js/gamescore.js', 'js/gameitems.js'
].forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));

const idx = window.GameItems.index();
const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];

/* Only the two halves that come from the teaching corpus. Sorted by band so
 * the output is stable: a generator whose output reorders on every run turns
 * every rebuild into a large diff and makes a --check gate meaningless. */
const payload = { pairs: {}, grammar: {}, vocab: [] };
BANDS.forEach(b => {
  payload.pairs[b] = idx.pairs[b] || [];
  payload.grammar[b] = idx.grammar[b] || [];
});

/* A lean vocabulary, because the arcade needs the WORDS and none of the
 * scholarship attached to them. js/gameitems.js reads exactly four fields off
 * a VOCAB row — es, en, cefr and theme (falling back to cat) — while the file
 * also carries a PCIC specification id on 5,427 of 5,822 rows and collocations
 * on 410. Those are what make the vocabulary teachable and they are 366 KB the
 * games never look at. `cat` is kept because js/profile.js orders categories
 * with it. Checked by reading the call sites, not by assuming. */
payload.vocab = (window.VOCAB || []).map(w => {
  const o = { es: w.es, en: w.en };
  if (w.cefr) o.cefr = w.cefr;
  if (w.cat) o.cat = w.cat;
  if (w.theme) o.theme = w.theme;
  return o;
});

const counts = BANDS.map(b => `${b} ${payload.pairs[b].length}/${payload.grammar[b].length}`).join('  ');
const totalPairs = BANDS.reduce((n, b) => n + payload.pairs[b].length, 0);
const totalGram = BANDS.reduce((n, b) => n + payload.grammar[b].length, 0);

/* Null and zero fields are dropped from the serialisation. Every consumer
 * reads them as `p.bonus || 0`, `p.id || null` or through filter(Boolean), so
 * a missing key and a null key are indistinguishable at runtime — and the
 * padding was 240 KB of the file, which is most of a second on a slow phone.
 * Verified against js/gameitems.js, js/gameround.js and js/gamescore.js
 * before it was turned on; if a consumer ever starts distinguishing the two,
 * this is the line that has to go. */
function lean(_k, v) {
  if (v === null || v === undefined) return undefined;
  if (v === 0 && _k === 'bonus') return undefined;
  return v;
}

const body =
`/* ============================================================================
 * GAME INDEX — GENERATED. Do not edit by hand.
 *
 *   node tools/build-game-index.js
 *
 * The questions the games deal, extracted from the teaching corpus so that a
 * games-only build does not have to load it. Present => js/gameitems.js uses
 * this instead of walking data/strand-lessons.js, data/writing.js and
 * data/apply.js; absent => it walks them exactly as before.
 *
 * ${totalPairs} translation/listening pairs, ${totalGram} grammar questions,
 * ${payload.vocab.length} vocabulary rows (es/en/cefr/cat/theme only).
 * Per band (pairs/grammar): ${counts}
 * ========================================================================== */
window.GAME_INDEX = ${JSON.stringify(payload, lean)};
`;

if (check) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (current === body) { console.log('✅ data/game-index.js is up to date.'); process.exit(0); }
  console.error('❌ data/game-index.js is stale. Run: node tools/build-game-index.js');
  process.exit(1);
}

fs.writeFileSync(OUT, body);
console.log(`wrote data/game-index.js — ${totalPairs} pairs, ${totalGram} grammar questions, ` +
            `${payload.vocab.length} words, ${Math.round(body.length / 1024)} KB`);
console.log('  per band (pairs/grammar): ' + counts);
