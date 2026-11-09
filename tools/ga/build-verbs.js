#!/usr/bin/env node
/* ============================================================================
 * build-verbs.js: gaeilge/data/verbs.js from BuNaMo.
 *
 *   node tools/ga/build-verbs.js
 *
 * Reads the curated list tools/ga/src/verbs.json ([verb, English]), orders it
 * by the New Corpus for Ireland frequency list, and pulls every form from
 * tools/ga/vendor/BuNaMo/verb/<verb>_verb.xml (clone github.com/michmech/BuNaMo
 * there; the vendor folder is not committed).
 *
 * Output entries: { v, en, vn (verbal noun), va (verbal adjective), r (rank),
 * b (band), f: { tense: { person: [indep, dep?, syn?] } } }, forms UNMUTATED
 * (gaeilge/js/ga-text.js applies séimhiú and urú). syn = 1 when the form is
 * synthetic, i.e. the person is inside the verb and the sentence shows no
 * pronoun. Persons follow An Caighdeán Oifigiúil:
 *   lait   me synthetic (déanaim), muid synthetic, others analytic
 *          (bí: tá mé analytic, táimid synthetic)
 *   gnathlait (bí only) bím, bímid, bíonn ...
 *   caite  muid synthetic (rinneamar), others analytic
 *   fhaist muid synthetic, others analytic
 *   coinn, gnath  me, tu, muid, siad synthetic; se, si, sibh analytic
 *   ord    tu, sibh, muid
 *   saor   the autonomous form in every tense but ord
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const VENDOR = path.join(__dirname, 'vendor');
const SRC = path.join(__dirname, 'src', 'verbs.json');
const OUT = path.join(ROOT, 'gaeilge', 'data', 'verbs.js');

function rankMap() {
  const f = path.join(VENDOR, 'irish-word-frequency', 'frequency.txt');
  const m = {};
  fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach(line => {
    const c = line.split('\t');
    if (c.length >= 2 && /^\d+$/.test(c[0]) && !(c[1] in m)) m[c[1]] = +c[0];
  });
  return m;
}

function parse(xml) {
  const forms = [];
  const re = /<(tenseForm|moodForm) default="([^"]*)" (?:tense|mood)="([^"]*)"(?: dependency="([^"]*)")? person="([^"]*)"/g;
  let m;
  while ((m = re.exec(xml))) forms.push({ w: m[2], t: m[3], dep: m[4] || 'Indep', p: m[5] });
  const vn = (/<verbalNoun default="([^"]*)"/.exec(xml) || [])[1] || null;
  const va = (/<verbalAdjective default="([^"]*)"/.exec(xml) || [])[1] || null;
  return { forms, vn, va };
}

// [our person, BuNaMo person, synthetic?]
const A = ['tu', 'se', 'si', 'sibh', 'siad'];
function analytic(list) { return list.map(p => [p, 'Base', 0]); }
const PLAN = {
  lait:   { src: 'PresCont', persons: [['me', 'Sg1', 1], ['muid', 'Pl1', 1], ['saor', 'Auto', 0]].concat(analytic(A)) },
  caite:  { src: 'Past',     persons: [['me', 'Base', 0], ['muid', 'Pl1', 1], ['saor', 'Auto', 0]].concat(analytic(A)) },
  fhaist: { src: 'Fut',      persons: [['me', 'Base', 0], ['muid', 'Pl1', 1], ['saor', 'Auto', 0]].concat(analytic(A)) },
  coinn:  { src: 'Cond',     persons: [['me', 'Sg1', 1], ['tu', 'Sg2', 1], ['muid', 'Pl1', 1], ['siad', 'Pl3', 1], ['saor', 'Auto', 0]].concat(analytic(['se', 'si', 'sibh'])) },
  gnath:  { src: 'PastCont', persons: [['me', 'Sg1', 1], ['tu', 'Sg2', 1], ['muid', 'Pl1', 1], ['siad', 'Pl3', 1], ['saor', 'Auto', 0]].concat(analytic(['se', 'si', 'sibh'])) },
  ord:    { src: 'Imper',    persons: [['tu', 'Sg2', 1], ['sibh', 'Pl2', 1], ['muid', 'Pl1', 1]] }
};
const BI_PLAN = {
  lait:      { src: 'Pres',     persons: [['me', 'Base', 0], ['muid', 'Pl1', 1], ['saor', 'Auto', 0]].concat(analytic(A)) },
  gnathlait: { src: 'PresCont', persons: [['me', 'Sg1', 1], ['muid', 'Pl1', 1], ['saor', 'Auto', 0]].concat(analytic(A)) }
};

// BuNaMo slips found in review: [verb, BuNaMo tense, person] -> corrected form
const OVERRIDES = { 'léigh|Cond|Pl1': 'léifimis' };
function find(forms, t, dep, p, v) {
  if (v && OVERRIDES[v + '|' + t + '|' + p]) return OVERRIDES[v + '|' + t + '|' + p];
  const x = forms.find(f => f.t === t && f.dep === dep && f.p === p);
  return x ? x.w : null;
}

function build() {
  const list = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const ranks = rankMap();
  const problems = [];
  const out = list.map(([v, en], i) => {
    const file = path.join(VENDOR, 'BuNaMo', 'verb', v + '_verb.xml');
    if (!fs.existsSync(file)) { problems.push(v + ': no BuNaMo file'); return null; }
    const { forms, vn, va } = parse(fs.readFileSync(file, 'utf8'));
    const plan = Object.assign({}, PLAN, v === 'bí' ? BI_PLAN : {});
    const f = {};
    Object.keys(plan).forEach(t => {
      const pl = plan[t]; f[t] = {};
      pl.persons.forEach(([p, bp, syn]) => {
        const ind = find(forms, pl.src, 'Indep', bp, v) || (pl.src === 'Imper' ? find(forms, 'Imper', 'Indep', bp) : null);
        if (!ind) { if (!(p === 'saor' && v === 'bí' && t === 'gnathlait')) problems.push(`${v} ${t} ${p}: missing ${pl.src}/${bp}`); return; }
        const dep = find(forms, pl.src, 'Dep', bp, v);
        const slot = [ind];
        if (dep && dep !== ind) slot[1] = dep;
        if (syn) { if (slot.length === 1) slot[1] = 0; slot[2] = 1; }
        f[t][p] = slot;
      });
    });
    return { v, en, vn, va, r: ranks[v] || 99999, f, _i: i };
  }).filter(Boolean);
  out.sort((a, b) => a.r - b.r || a._i - b._i);
  // bands by position: the 25 commonest are A1, then A2 to 60, B1 to 110, B2 after
  out.forEach((x, i) => { x.b = i < 25 ? 'A1' : i < 60 ? 'A2' : i < 110 ? 'B1' : 'B2'; delete x._i; });
  return { out, problems };
}

if (require.main === module) {
  const { out, problems } = build();
  if (problems.length) { console.error(problems.join('\n')); }
  const head = `/* ============================================================================
 * VERBS: GENERATED by tools/ga/build-verbs.js. Do not edit by hand.
 *
 * ${out.length} Irish verbs, commonest first, every form An Caighdeán Oifigiúil
 * uses, UNMUTATED (gaeilge/js/ga-text.js applies séimhiú and urú). Entry:
 * { v, en, vn, va, r, b, f: { tense: { person: [indep, dep or 0, synthetic] } } }.
 *
 * SOURCES. Forms: Bunachar Náisiúnta Moirfeolaíochta (BuNaMo), Copyright (c)
 * 2017 Foras na Gaeilge, github.com/michmech/BuNaMo. Order: Irish Word
 * Frequency List, Michal Boleslav Měchura, from the New Corpus for Ireland.
 * Both under the Open Database License 1.0 (opendatacommons.org/licenses/odbl/1.0/);
 * this derived table is shared under the same licence.
 * ========================================================================== */
`;
  const body = '(function (w) {\nw.GA_VERBS = [\n' + out.map(x => JSON.stringify(x)).join(',\n') + '\n];\nif (typeof module !== "undefined" && module.exports) module.exports = w.GA_VERBS;\n})(typeof window !== "undefined" ? window : globalThis);\n';
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, head + body);
  console.log(`${out.length} verbs -> ${path.relative(ROOT, OUT)}${problems.length ? ' (' + problems.length + ' problems)' : ''}`);
}
module.exports = { build };
