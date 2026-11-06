#!/usr/bin/env node
// Builds data/tense-cards.js (window.TENSE_CARDS) from tools/tensecards/cards.json.
// Every table, every *starred* example form and every listed check is verified
// against the app's conjugation engine; any mismatch or format problem fails.
//   node tools/tensecards/build.js           write data/tense-cards.js
//   node tools/tensecards/build.js --check   exit 1 if the output is stale or invalid
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(__dirname, 'cards.json');
const OUT = path.join(ROOT, 'data', 'tense-cards.js');

global.window = global;
require(path.join(ROOT, 'data', 'verbs.js'));
require(path.join(ROOT, 'js', 'engine.js'));
const E = window.ENGINE;

const KEYS = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'perfecto', 'plusc',
  'futperf', 'condperf', 'presubj', 'impsubj', 'perfsubj', 'pluscsubj', 'imperativo', 'impneg'];
const IMP = { imperativo: 1, impneg: 1 };
// Engine arrays include vosotros: index 4 for the six-person tenses, 3 for imperatives.
const PERSONS = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'ellos/ustedes'];
const PIDX = { 'yo': 0, 'tú': 1, 'él/ella/usted': 2, 'nosotros': 3, 'ellos/ustedes': 5 };
const IMP_PERSONS = ['tú', 'usted', 'nosotros', 'ustedes'];
const IMP_PIDX = { 'tú': 0, 'usted': 1, 'nosotros': 2, 'ustedes': 4 };

const errors = [];
const err = (k, m) => errors.push(k + ': ' + m);

function forms(inf, tense) {
  const v = E.verbByInf(inf);
  if (!v) throw new Error('engine does not know ' + inf);
  if (tense === 'pluscsubj') {
    const h = E.conjugate(E.verbByInf('haber'), 'impsubj');
    const p = E.participle(v);
    return h.map(x => x + ' ' + p);
  }
  return E.conjugate(v, tense);
}
function formFor(inf, tense, person) {
  const map = IMP[tense] ? IMP_PIDX : PIDX;
  if (!(person in map)) throw new Error('bad person "' + person + '" for ' + tense);
  return forms(inf, tense)[map[person]];
}
function safe(k, fn) { try { fn(); } catch (e) { err(k, e.message); } }

const DASH = /[-‐-―−﹘﹣－]/;
const VOS = /\bvosotr[oa]s\b|(^|[^\p{L}])os([^\p{L}]|$)/iu;
function pair(k, label, o) {
  if (!o || typeof o.es !== 'string' || typeof o.en !== 'string' || !o.es.trim() || !o.en.trim()) {
    err(k, label + ' needs non-empty es and en'); return;
  }
  for (const lang of ['es', 'en']) {
    if (DASH.test(o[lang])) err(k, label + '.' + lang + ' has a dash: ' + o[lang]);
    if (lang === 'es' && VOS.test(o[lang])) err(k, label + '.es mentions vosotros/os: ' + o[lang]);
    if (/vosotros/i.test(o[lang])) err(k, label + '.' + lang + ' mentions vosotros');
  }
}
const stars = s => (s.match(/\*[^*]+\*/g) || []).map(x => x.slice(1, -1));

const cards = JSON.parse(fs.readFileSync(SRC, 'utf8'));
for (const k of Object.keys(cards)) if (!KEYS.includes(k)) err(k, 'unknown key');
const out = {};
for (const k of KEYS) {
  const c = cards[k];
  if (!c) { err(k, 'missing card'); continue; }
  pair(k, 'name', c.name);
  pair(k, 'how', c.how);
  pair(k, 'contrast', c.contrast);
  if (c.irregular !== null) pair(k, 'irregular', c.irregular);

  if (!Array.isArray(c.when) || c.when.length < 3 || c.when.length > 5) err(k, 'when needs 3 to 5 lines');
  (c.when || []).forEach((w, i) => {
    pair(k, 'when[' + i + ']', w);
    if (w && (!stars(w.es || '').length || !stars(w.en || '').length)) err(k, 'when[' + i + '] needs *starred* triggers in es and en');
  });

  const t = c.table || {};
  const wantP = IMP[k] ? IMP_PERSONS : PERSONS;
  if (JSON.stringify(t.persons) !== JSON.stringify(wantP)) err(k, 'table.persons must be ' + wantP.join(', '));
  safe(k, () => {
    const exp = wantP.map(p => formFor(t.verb, k, p));
    if (JSON.stringify(t.forms) !== JSON.stringify(exp)) err(k, 'table ' + JSON.stringify(t.forms) + ' != engine ' + JSON.stringify(exp));
  });

  if (!Array.isArray(c.examples) || c.examples.length !== 3) err(k, 'needs exactly 3 examples');
  (c.examples || []).forEach((x, i) => {
    const lbl = 'examples[' + i + ']';
    pair(k, lbl, x);
    if (!x || typeof x.es !== 'string') return;
    const s = stars(x.es);
    if (s.length !== 1) { err(k, lbl + ' needs exactly one *starred* form: ' + x.es); return; }
    if (/\*/.test(x.en || '')) err(k, lbl + '.en must not have asterisks');
    const words = x.es.replace(/\*/g, '').split(/\s+/).filter(Boolean).length;
    if (words < 5 || words > 12) err(k, lbl + ' has ' + words + ' words (5 to 12): ' + x.es);
    safe(k, () => {
      const f = formFor(x.verb, k, x.person);
      if (s[0].toLowerCase() !== f.toLowerCase()) err(k, lbl + ' *' + s[0] + '* != engine ' + f + ' (' + x.verb + ', ' + x.person + ')');
    });
  });

  (c.checks || []).forEach(([inf, tense, person, form]) => safe(k, () => {
    const f = formFor(inf, tense, person);
    if (f !== form) err(k, 'check ' + inf + ' ' + tense + ' ' + person + ': ' + form + ' != engine ' + f);
  }));

  out[k] = {
    name: c.name,
    when: c.when,
    how: c.how,
    table: { verb: t.verb, forms: t.forms, persons: t.persons },
    irregular: c.irregular,
    examples: (c.examples || []).map(x => ({ es: x.es, en: x.en })),
    contrast: c.contrast
  };
}

if (errors.length) {
  console.error('tense cards: ' + errors.length + ' problem(s)\n  ' + errors.join('\n  '));
  process.exit(1);
}

const body = '// Generated by tools/tensecards/build.js from tools/tensecards/cards.json. Do not edit.\n' +
  'window.TENSE_CARDS = ' + JSON.stringify(out, null, 2) + ';\n';
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== body) { console.error('data/tense-cards.js is stale: run node tools/tensecards/build.js'); process.exit(1); }
  console.log('tense cards: ' + KEYS.length + ' cards verified, output up to date');
} else {
  fs.writeFileSync(OUT, body);
  console.log('tense cards: ' + KEYS.length + ' cards verified, wrote data/tense-cards.js');
}
