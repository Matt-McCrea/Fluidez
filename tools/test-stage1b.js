// Stage 1b checks: accent-sensitive passage matching, dash rendering, adjective display.
// Run: node tools/test-stage1b.js
const fs = require('fs'), path = require('path'), assert = require('assert');
global.window = {};
for (const f of ['js/lexmatch.js', 'data/vocab.js', 'data/apply.js']) {
  new Function(fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).call(global);
}
const LM = window.LexMatch;
let n = 0; const ok = (c, m) => { assert(c, m); n++; };

// carné must not yield carne
ok(!LM.index('Necesito mi carné para entrar.').has('la carne'), 'carné matched carne');
ok(LM.index('Me gusta la carne con arroz.').has('la carne'), 'carne not found in own text');
ok(LM.index('Compré dos carnes.').has('la carne'), 'plural carnes not found');
ok(!LM.index('Mi carne es buena.').has('el carné'), 'carne matched carné');
ok(LM.index('Tengo el carné.').has('el carné'), 'carné not found');

// adjectives lose their article for display; nouns keep theirs
ok(LM.shown('el simpático') === 'simpático', 'simpático');
ok(LM.shown('el primer') === 'primer', 'primer');
ok(LM.shown('la carne') === 'la carne', 'noun kept');
ok(window.VOCAB_ADJECTIVES.every(a => window.VOCAB.some(w => w.es === a)), 'listed adjective missing from VOCAB');

// the day's new-word draw never has more than two from one category
{
  const vm = require('vm'), R = path.join(__dirname, '..');
  const store = {};
  const sb = { console, Math, JSON, Object, Array, String, Number, isFinite, parseInt, Promise, setTimeout: f => { f(); return 0; },
    location: { search: '', hash: '' },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
  sb.window = sb;
  const order = ['greetings', 'people', 'food', 'numbers', 'time', 'colours'];
  sb.Profile = { current: () => 'A1', params: () => ({ orderedVocab: true, newPerDay: 9, maxGate: 99 }), wordAllowed: () => true,
    catRank: c => { const i = order.indexOf(c); return i < 0 ? 500 : i; }, tenses: () => ['presente'] };
  sb.UI = {}; sb.ENGINE = { shuffle: a => a }; sb.Checker = {}; sb.ErrorLog = { cards: () => [] };
  const ctx = vm.createContext(sb);
  for (const f of ['js/lib.bundle.js', 'js/srs.js', 'data/vocab.js']) vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(R, 'js/views/review.js'), 'utf8'), ctx);
  const SR = sb.StageReview;
  let days = 0, maxSeen = 0;
  for (let d = 0; d < 12; d++) {
    const fresh = SR.newToday({ mode: 'diaria', rng: Math.random });
    fresh.forEach(c => sb.SRS.enrol(c.id));
    const per = {};
    fresh.forEach(c => { const k = c.cat || c.theme; if (k) per[k] = (per[k] || 0) + 1; });
    const m = Math.max(0, ...Object.values(per));
    maxSeen = Math.max(maxSeen, m); days += fresh.length ? 1 : 0;
    ok(m <= 2, 'day ' + d + ' draws at most two words from one category (max ' + m + ')');
  }
  ok(days > 0, 'the draw produced words on at least one day');

  // the lesson's keyword table comes first, whatever the vocabulary order says
  for (const k of Object.keys(store)) delete store[k];
  sb.SRS._reset();
  const late = [], cats = new Set();
  sb.VOCAB.filter(w => (w.cefr || 'A1') === 'A1' && w.es && !/\s/.test(w.es) && order.indexOf(w.cat) < 0).forEach(w => { if (late.length < 3 && !cats.has(w.cat)) { cats.add(w.cat); late.push(w); } });
  const out = SR.newToday({ mode: 'diaria', rng: Math.random, lesson: { keywords: late.map(w => ({ es: w.es, en: w.en })) } });
  const names = out.slice(0, late.length).map(c => c.es).sort().join('|');
  ok(late.length === 3 && names === late.map(w => w.es).sort().join('|'), 'New today draws the lesson keywords first (' + names + ')');
}

// the review deck (playtest 5 Nov 2026): the Settings cap is the ceiling, ordinary vocabulary is the bulk,
// concept cards at most a third of the cap and spread through it
{
  const vm = require('vm'), R = path.join(__dirname, '..');
  const store = {};
  const sb = { console, Math, JSON, Object, Array, String, Number, isFinite, parseInt, Promise, setTimeout: f => { f(); return 0; },
    location: { search: '', hash: '' },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
  sb.window = sb;
  sb.Profile = { current: () => 'B1', params: () => ({ orderedVocab: false, newPerDay: 8, maxGate: 99 }), wordAllowed: () => true,
    catRank: () => 0, tenses: () => ['presente'], capFor: () => 20 };
  sb.UI = {}; sb.ENGINE = { shuffle: a => a }; sb.Checker = {}; sb.ErrorLog = { cards: () => [] };
  const ctx = vm.createContext(sb);
  for (const f of ['js/lib.bundle.js', 'js/srs.js']) vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(R, 'js/views/review.js'), 'utf8'), ctx);
  const SR = sb.StageReview;
  const V = n => Array.from({ length: n }, (_, i) => ({ id: 'v' + i, kind: 'vocab' }));
  const O = n => Array.from({ length: n }, (_, i) => ({ id: 'g' + i, kind: 'grammar' }));
  let d = SR._mixDeck(V(60), O(30), 20);
  const nO = d.filter(c => c.kind !== 'vocab').length;
  ok(d.length === 20, 'the deck stops at the cap (' + d.length + ')');
  ok(nO === 7, 'concept cards take a third of the cap when words are plentiful (' + nO + ')');
  let run = 0, worst = 0; d.forEach(c => { run = c.kind !== 'vocab' ? run + 1 : 0; worst = Math.max(worst, run); });
  ok(worst === 1, 'and are spread through the words, never two in a row');
  d = SR._mixDeck(V(5), O(30), 20);
  ok(d.length === 20 && d.filter(c => c.kind === 'vocab').length === 5, 'with few words due, concept cards fill the rest');
  d = SR._mixDeck(V(40), O(2), 20);
  ok(d.length === 20 && d.filter(c => c.kind !== 'vocab').length === 2, 'with few concept cards due, words fill the rest');
  const pl = SR._planFor({});
  ok(pl.dueCap <= 20, 'the plan never serves more due cards than the cap Settings shows (' + pl.dueCap + ')');
}

// the English article that matches the Spanish one is accepted on a meaning card
{
  const W = { };
  const sb2 = { console, Math, JSON, Object, Array, String, Number, RegExp, isFinite, parseInt };
  sb2.window = sb2;
  const vm = require('vm'), R = path.join(__dirname, '..'), c2 = vm.createContext(sb2);
  for (const f of ['js/engine.js', 'js/checker.js']) vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), c2);
  const C = sb2.Checker, m = (i, a, f) => C.checkExact(i, a, { meaning: true, from: f }).pass;
  ok(m('the house', 'house', 'la casa') && m('The books', 'books', 'los libros') && m('the problem', 'problem', 'el problema'), 'the for el, la, los');
  ok(m('a dog', 'dog', 'un perro') && m('an apple', 'apple', 'una manzana') && m('some friends', 'friends', 'unos amigos'), 'a, an, some for un, una, unos');
  ok(!m('the dog', 'dog', 'un perro') && !m('the house', 'house', 'casa'), 'not an article the Spanish did not have');
  ok(m('house', 'house', 'la casa') && m('the house', 'the house', 'la casa'), 'without the article still passes');
  ok(!m('the hose', 'house', 'la casa'), 'a wrong word with the article is still wrong');
}

// UI dash helper (pure parts, loaded with a stub document)
window.Profile = { current: () => 'A1', term: (es, en) => en };
global.document = { createElement: () => ({ style: {}, appendChild() {}, addEventListener() {} }) };
new Function(fs.readFileSync(path.join(__dirname, '..', 'js/ui.js'), 'utf8')).call(global);
const UI = window.UI;
ok(UI.optLabel('—') === '(nothing)' && UI.optLabel('-') === '(nothing)' && UI.optLabel('que') === 'que', 'optLabel');
ok(UI.isNothing('—') && !UI.isNothing('a'), 'isNothing');
const dashItems = window.APPLY_ITEMS.filter(i => i.type === 'choice' && i.options.some(UI.isNothing));
ok(dashItems.length >= 2, 'expected dash choice items');

console.log('stage1b: ' + n + ' checks passed');
