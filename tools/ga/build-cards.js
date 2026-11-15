#!/usr/bin/env node
/* build-cards.js: gaeilge/data/cards.js (window.GA_CARDS, the little pages)
 * from tools/ga/src/cards.json. Shape: docs/liofa-spec.md. Fails on a dash in
 * any text or a card missing a part. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const cards = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'cards.json'), 'utf8'));
const bad = [];
Object.keys(cards).forEach(k => {
  const c = cards[k];
  ['name', 'when', 'how', 'table', 'ex'].forEach(f => { if (!c[f]) bad.push(k + ': no ' + f); });
  JSON.stringify(c).replace(/[–—]|\s-\s/g, m => { bad.push(k + ': dash'); return m; });
  (c.ex || []).forEach(e => { if (!e.ga || !e.en) bad.push(k + ': example needs ga and en'); });
});
/* A card's `irr` ({tense, verbs}) becomes tabs of full tables at its foot, one
 * per irregular verb, built from verbs.js through ga-text.js's own mutation
 * rules, so the tabs say exactly what the drills accept. */
const GA = require(path.join(ROOT, 'gaeilge', 'js', 'ga-text.js'));
const VERBS = require(path.join(ROOT, 'gaeilge', 'data', 'verbs.js'));
const PRO = { me: 'mé', tu: 'tú', se: 'sé', si: 'sí', muid: 'muid', sibh: 'sibh', siad: 'siad' };
const PERS = [['mé', 'me'], ['tú', 'tu'], ['sé / sí', 'se'], ['muid', 'muid'], ['sibh', 'sibh'], ['siad', 'siad']];
function irrTable(k, v, t) {
  const need = x => { if (!x) bad.push(k + ': no ' + t + ' form for ' + v.v); return x || ''; };
  const word = (part, p) => { const f = need(GA.formAfter(part, v, t, p)); return v.f[t][p][2] ? f : f + ' ' + PRO[p]; };
  if (t === 'ord') return { head: ['', ''], rows: [['one person', need(GA.formAfter('', v, t, 'tu'))], ['more than one', need(GA.formAfter('', v, t, 'sibh'))], ["let's", need(GA.formAfter('', v, t, 'muid'))], ["don't", 'ná ' + need(GA.formAfter('ná', v, t, 'tu'))]] };
  if (t === 'saor') {
    const s = tt => need(GA.formAfter('', v, tt, 'saor'));
    return { head: ['', ''], rows: [['present', s('lait')], ['past', s('caite')], ['future', s('fhaist')], ['conditional', s('coinn')], ['not (past)', GA.particleWord('ní', v, 'caite') + ' ' + need(GA.formAfter('ní', v, 'caite', 'saor'))]] };
  }
  const rows = PERS.map(([l, p]) => [l, word('', p)]);
  const neg = GA.particleWord('ní', v, t);
  rows.push(['not', v.v === 'bí' && t === 'lait' ? word('ní', 'me') : neg + ' ' + word('ní', 'me')]);
  if (t === 'coinn') rows.push(['if', 'dá ' + word('dá', 'me')]);
  else rows.push(['question', GA.particleWord('an', v, t) + ' ' + word('an', 'tu') + '?']);
  return { head: ['', ''], rows: rows };
}
/* The four-type tense tables: ól, bris, ceannaigh, imigh side by side. A cell is
 * the verb form only; "[x]" marks what changed from the root (the initial
 * mutation and the ending), which the card renderer shows as coloured bold. */
const TYPES = [['ól', '1st, broad'], ['bris', '1st, slender'], ['ceannaigh', '2nd, broad'], ['imigh', '2nd, slender']];
const MUT = ['g', 'm', 'n', 'b', 'd', 'h', 'bh', 'ng', 'bp', 'gc', 'nd', 'mb', 'dt', 'n-', 'bhf', 't', 'ts'];
function mark(root, form) {
  let pre = '', rest = form;
  if (rest.startsWith("d'")) { pre = "[d']"; rest = rest.slice(2); }
  let r0 = root.charAt(0); const low = x => x.toLowerCase();
  if (rest.charAt(0) === r0 && rest !== root.slice(0, rest.length) && low(rest.charAt(1)) === 'h' && root.charAt(1) !== 'h') {
    pre += r0 + '[h]'; rest = rest.slice(2); root = root.slice(1);
  } else if (rest.charAt(0) !== r0) {
    for (let n = 1; n <= 3; n++) {
      if (MUT.includes(rest.slice(0, n)) && rest.slice(n).startsWith(root.slice(0, 2))) { pre += '[' + rest.slice(0, n) + ']'; rest = rest.slice(n); break; }
    }
  }
  let i = 0;
  while (i < rest.length && i < root.length && rest[i] === root[i]) i++;
  const stem = rest.slice(0, i), end = rest.slice(i);
  return pre + stem + (end ? '[' + end + ']' : '');
}
const FOUR = ['lait', 'caite', 'fhaist', 'coinn', 'gnath', 'ord'];
function fourTable(k, t, types) {
  types = types || TYPES;
  const vs = types.map(([inf]) => VERBS.find(x => x.v === inf));
  const get = (part, p) => vs.map(v => {
    const f = GA.formAfter(part, v, t, p);
    if (!f) { bad.push(k + ': no ' + t + ' ' + p + ' for ' + v.v); return ''; }
    return mark(v.v, f);
  });
  const head = [''].concat(vs.map((v, i) => v.v + ' (' + v.en.split(',')[0] + ')\n' + types[i][1]));
  const rows = [];
  if (t === 'ord') {
    rows.push(['tú'].concat(get('', 'tu')), ['sibh'].concat(get('', 'sibh')), ['muid'].concat(get('', 'muid')));
    rows.push(['ná'].concat(get('ná', 'tu').map((f, i) => 'ná ' + f)));
    return { head, rows };
  }
  [['mé', 'me'], ['tú', 'tu'], ['sé / sí', 'se'], ['muid', 'muid'], ['sibh', 'sibh'], ['siad', 'siad'], ['saor', 'saor']]
    .forEach(([l, p]) => rows.push([l].concat(get('', p))));
  const pw = x => vs.map(v => GA.particleWord(x, v, t));
  const withP = (x) => { const w = pw(x), f = get(x, 'tu'); return f.map((c, i) => w[i] + ' ' + c); };
  rows.push(['not'].concat(withP('ní')), ['question'].concat(withP('an').map(x => x + '?')));
  return { head, rows };
}
// two tables of three columns, as readable as the Spanish ones: the 1st
// conjugation (ól broad, bris slender), then the 2nd (ceannaigh, imigh)
FOUR.forEach(t => { if (!cards[t]) return;
  const a = fourTable(t, t, TYPES.slice(0, 2)), b = fourTable(t, t, TYPES.slice(2));
  cards[t].table = a;
  cards[t].tables = [{ title: { en: '1st conjugation: one syllable roots', ga: 'An chéad réimniú' }, head: a.head, rows: a.rows },
                     { title: { en: '2nd conjugation: roots in -igh and longer', ga: 'An dara réimniú' }, head: b.head, rows: b.rows }];
});
Object.keys(cards).forEach(k => {
  const c = cards[k], spec = c.irr;
  if (!spec) return;
  c.irr = spec.verbs.map(inf => {
    const v = VERBS.find(x => x.v === inf);
    if (!v || !v.f[spec.tense === 'saor' ? 'caite' : spec.tense]) { bad.push(k + ': no verb ' + inf); return null; }
    return Object.assign({ v: inf, en: v.en }, irrTable(k, v, spec.tense));
  }).filter(Boolean);
});
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
const out = `/* GENERATED by tools/ga/build-cards.js from tools/ga/src/cards.json. Do not edit.
 * ${Object.keys(cards).length} cards. */
(function (w) {
w.GA_CARDS = ${JSON.stringify(cards, null, 1)};
if (typeof module !== "undefined" && module.exports) module.exports = w.GA_CARDS;
})(typeof window !== "undefined" ? window : globalThis);
`;
fs.writeFileSync(path.join(ROOT, 'gaeilge', 'data', 'cards.js'), out);
console.log(Object.keys(cards).length + ' cards -> gaeilge/data/cards.js');
