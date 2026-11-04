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
