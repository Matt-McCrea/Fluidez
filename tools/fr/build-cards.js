#!/usr/bin/env node
/* build-cards.js: francais/data/cards.js (window.FR_CARDS, the little pages)
 * from tools/fr/src/cards.json. Shape: docs/couramment-spec.md. The tense
 * tables (parler, finir, prendre side by side; aller in place of prendre for
 * the compound tenses) and the strong-verb tabs are built from
 * francais/data/verbs.js, so they say exactly what the drills accept. In a
 * table cell "[x]" marks what changes (the ending, the auxiliary), which the
 * card renderer shows as coloured bold. Fails on a dash in any text or a card
 * missing a part. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const cards = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'cards.json'), 'utf8'));
const VERBS = require(path.join(ROOT, 'francais', 'data', 'verbs.js'));
const TENSES = 'pres imp fut cond subj imper pc ae pqp fp'.split(' ');
const GRAMMAR = 'groupes accord pronominaux genre partitif adj pronoms y-en negation prepositions subjonctif nombres'.split(' ');
const KEYS = TENSES.concat(GRAMMAR);
const bad = [];
const verb = v => { const x = VERBS.find(y => y.v === v); if (!x) bad.push('no verb ' + v + ' in verbs.js'); return x; };

const PERS = [['je', 'je'], ['tu', 'tu'], ['il / elle', 'il'], ['nous', 'nous'], ['vous', 'vous'], ['ils / elles', 'ils']];
const SUBJ = { je: 'que je', tu: 'que tu', il: "qu'il", nous: 'que nous', vous: 'que vous', ils: "qu'ils" };
const VOWEL = /^[aeiouyéèêâîôûh]/i;
const unmark = s => s.replace(/[\[\]]/g, '');
const je = f => VOWEL.test(unmark(f)) ? "j'" + f : 'je ' + f;
const que = (p, f) => p === 'je' ? (VOWEL.test(unmark(f)) ? "que j'" + f : 'que je ' + f) : SUBJ[p] + ' ' + f;
const ne = f => (VOWEL.test(unmark(f)) ? "n'" : 'ne ') + f;
const pro = (p, f) => p === 'je' ? je(f) : p + ' ' + f;

/* The stem a tense builds on; the form's part after it is the ending, marked. */
function stem(v, t) {
  const inf = v.f.inf || v.v;
  if (t === 'fut' || t === 'cond') return inf.replace(/re$/, 'r');
  if (t === 'imp') return v.f.pres.nous.replace(/ons$/, '');
  if (t === 'subj') return v.f.pres.ils.replace(/ent$/, '');
  return inf.slice(0, -2);
}
function mark(st, form) {
  let i = 0;
  while (i < form.length && i < st.length && form[i] === st[i]) i++;
  return form.slice(0, i) + (i < form.length ? '[' + form.slice(i) + ']' : '');
}
const head = vs => [''].concat(vs.map(v => v.v + ' (' + v.en.split(',')[0] + ')'));
const AV = () => verb('avoir'), ET = () => verb('être'), AL = () => verb('aller');
const gend = { je: '(e)', tu: '(e)', il: '(e)', nous: '(e)s', vous: '(e)s', ils: '(e)s' };
// passé composé or plus-que-parfait: auxiliary (marked) + participle, agreement marked with être
function compound(v, tt, p, mk) {
  const aux = (v.aux === 'e' ? ET() : AV()).f[tt][p];
  const pp = v.f.pp + (v.aux === 'e' ? (mk ? '[' + gend[p] + ']' : gend[p]) : '');
  return (mk ? '[' + aux + ']' : aux) + ' ' + pp;
}
function negCompound(v, tt, p) { const s = compound(v, tt, p, true), i = s.indexOf(' '); return pro(p, ne(s.slice(0, i))) + ' pas' + s.slice(i); }

function tenseTable(t) {
  if (t === 'pc' || t === 'pqp') {
    const tt = t === 'pc' ? 'pres' : 'imp', vs = ['parler', 'finir', 'aller'].map(verb);
    const rows = PERS.map(([l, p]) => [l].concat(vs.map(v => pro(p, compound(v, tt, p, true)))));
    rows.push(['not'].concat(vs.map(v => negCompound(v, tt, 'je'))));
    rows.push(['question'].concat(vs.map(v => 'est-ce que tu ' + compound(v, tt, 'tu', true) + ' ?')));
    return { head: head(vs), rows };
  }
  const vs = ['parler', 'finir', 'prendre'].map(verb);
  if (t === 'fp') {
    const rows = PERS.map(([l, p]) => [l].concat(vs.map(v => '[' + AL().f.pres[p] + '] ' + v.v)));
    rows.push(['not'].concat(vs.map(v => 'je ne [vais] pas ' + v.v)));
    rows.push(['question'].concat(vs.map(v => 'est-ce que tu [vas] ' + v.v + ' ?')));
    return { head: head(vs), rows };
  }
  const f = (v, p) => mark(stem(v, t), v.f[t][p]);
  if (t === 'imper') {
    const rows = [['tu', 'tu'], ['nous', 'nous'], ['vous', 'vous']].map(([l, p]) => [l].concat(vs.map(v => f(v, p) + ' !')));
    rows.push(['not'].concat(vs.map(v => ne(f(v, 'tu')) + ' pas !')));
    return { head: head(vs), rows };
  }
  if (t === 'subj') {
    const rows = PERS.map(([l, p]) => [SUBJ[p] + (p === 'il' ? ' / elle' : p === 'ils' ? ' / elles' : '')].concat(vs.map(v => f(v, p))));
    rows.push(['not'].concat(vs.map(v => que('je', ne(f(v, 'je')) + ' pas'))));
    return { head: head(vs), rows };
  }
  const rows = PERS.map(([l, p]) => [l].concat(vs.map(v => f(v, p))));
  rows.push(['not'].concat(vs.map(v => 'je ' + ne(f(v, 'je')) + ' pas')));
  rows.push(['question'].concat(vs.map(v => 'est-ce que tu ' + f(v, 'tu') + ' ?')));
  return { head: head(vs), rows };
}

/* A strong verb's tab: the whole tense, pronoun in each cell, English labels. */
const EN = [['I', 'je'], ['you', 'tu'], ['he / she', 'il'], ['we', 'nous'], ['you (plural, polite)', 'vous'], ['they', 'ils']];
function irrTable(k, v, t) {
  const need = x => { if (!x) bad.push(k + ': no ' + t + ' form for ' + v.v); return x || ''; };
  if (t === 'imper') {
    if (!v.f.imper) { bad.push(k + ': no imper for ' + v.v); return null; }
    return { head: ['', ''], rows: [['to one person', need(v.f.imper.tu) + ' !'], ["let's", need(v.f.imper.nous) + ' !'], ['to more than one, polite', need(v.f.imper.vous) + ' !'], ["don't", ne(need(v.f.imper.tu)) + ' pas !']] };
  }
  if (t === 'pc') {
    const rows = EN.map(([l, p]) => [l, pro(p, compound(v, 'pres', p, false))]);
    rows.push(['not', negCompound(v, 'pres', 'je').replace(/[\[\]]/g, '')]);
    return { head: ['', ''], rows };
  }
  const f = p => need(v.f[t] && v.f[t][p]);
  if (t === 'subj') {
    const rows = EN.map(([l, p]) => [l, que(p, f(p))]);
    rows.push(['not', que('je', ne(f('je')) + ' pas')]);
    return { head: ['', ''], rows };
  }
  const rows = EN.map(([l, p]) => [l, pro(p, f(p))]);
  rows.push(['not', 'je ' + ne(f('je')) + ' pas']);
  return { head: ['', ''], rows };
}

KEYS.forEach(k => { if (!cards[k]) bad.push(k + ': missing'); });
Object.keys(cards).forEach(k => {
  const c = cards[k];
  if (KEYS.indexOf(k) < 0) bad.push(k + ': unknown key');
  c.topic = k;
  c.kind = TENSES.indexOf(k) >= 0 ? 'tense' : 'grammar';
  if (c.kind === 'tense' && k !== 'ae') c.table = tenseTable(k);
  const spec = c.irr;
  if (spec) {
    c.irr = spec.verbs.map(inf => {
      const v = verb(inf);
      const t = v && irrTable(k, v, spec.tense);
      return t ? Object.assign({ v: inf, en: v.en.split(',')[0] }, t) : null;
    }).filter(Boolean);
  }
});
Object.keys(cards).forEach(k => {
  const c = cards[k];
  ['name', 'when', 'how', 'table', 'ex', 'tip'].forEach(f => { if (!c[f]) bad.push(k + ': no ' + f); });
  JSON.stringify(c).replace(/[–—]|\s-\s/g, m => { bad.push(k + ': dash'); return m; });
  [c.name, c.how, c.tip].concat(c.when || []).forEach(x => { if (x && (!x.fr || !x.en)) bad.push(k + ': text needs fr and en'); });
  if (!c.when || c.when.length < 2 || c.when.length > 4) bad.push(k + ': when needs 2 to 4');
  if (!c.ex || c.ex.length !== 3) bad.push(k + ': needs three examples');
  (c.ex || []).forEach(e => { if (!e.fr || !e.en) bad.push(k + ': example needs fr and en'); });
  [c.table].concat(c.irr || []).forEach((t, n) => {
    (t && t.rows || []).forEach((r, i) => { if (!t.head || r.length !== t.head.length) bad.push(k + ': table ' + n + ' row ' + i + ' width'); });
  });
});
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
const out = `/* GENERATED by tools/fr/build-cards.js from tools/fr/src/cards.json. Do not edit.
 * ${Object.keys(cards).length} cards. */
(function (w) {
w.FR_CARDS = ${JSON.stringify(cards, null, 1)};
if (typeof module !== "undefined" && module.exports) module.exports = w.FR_CARDS;
})(typeof window !== "undefined" ? window : globalThis);
`;
fs.writeFileSync(path.join(ROOT, 'francais', 'data', 'cards.js'), out);
console.log(Object.keys(cards).length + ' cards -> francais/data/cards.js');
