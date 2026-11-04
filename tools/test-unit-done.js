#!/usr/bin/env node
/* test-unit-done.js — the unit-done card, the weekly theme offer and theme completion.
 *   node tools/test-unit-done.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.window = global;
global.location = { search: '', hash: '' }; Object.defineProperty(global, 'navigator', { value: { language: 'en' }, configurable: true });
function node(tag) {
  const n = { tag, style: {}, children: [], cls: '', classList: { add() {}, remove() {} }, appendChild(c) { n.children.push(c); return c; },
    addEventListener(e, f) { (n.h = n.h || {})[e] = f; }, setAttribute() {}, innerHTML: '', textContent: '' };
  return n;
}
global.document = { documentElement: { style: { setProperty() {} }, dataset: {}, setAttribute() {}, classList: { add() {}, remove() {} } },
  body: { classList: { add() {}, remove() {} } }, createElement: node, getElementById: () => node(), querySelector: () => null, addEventListener() {} };
global.UI = {
  t: (a, b) => b || a, el: (tag, cls, txt) => { const n = node(tag); n.cls = cls || ''; n.textContent = txt || ''; return n; },
  clear(h) { if (h && h.children) h.children.length = 0; }, nextBtn: () => node('button'),
  shuffle: (a) => a.slice(),
  sample: (a, n) => a.slice(0, n), pick: a => a[0], seededRandom: () => Math.random
};
const FILES = ['data/taxonomy.js', 'data/connectors.js', 'data/verbs.js', 'data/vocab.js', 'data/idioms.js',
  'data/grammar-docs.js', 'data/grammar.js', 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js',
  'data/strand-lessons.js', 'data/course.js', 'data/resources.js', 'js/engine.js', 'js/lessons.js', 'js/checker.js',
  'js/srs.js', 'js/profile.js', 'js/curriculum.js', 'js/lexmatch.js', 'js/focus.js', 'js/unitcheck.js', 'js/hub.js',
  'data/graph.js', 'data/requires.js', 'data/lesson-nodes.js'];
FILES.forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/known.js'), 'utf8'));
const SRC = fs.readFileSync(path.join(ROOT, 'js/session.js'), 'utf8');
window.Profile.set('A1');
let live = null;
['Review', 'Learn', 'Comprehend', 'Apply', 'Produce'].forEach(k => {
  window['Stage' + k] = { key: k.toLowerCase(), icon: '*', run: (host, ctx, done) => { live = { key: k.toLowerCase(), ctx, done }; } };
});
let fails = 0;
function ok(c, m) { if (!c) { fails++; console.log('FAIL  ' + m); } else console.log('ok    ' + m); }
const prog = () => JSON.parse(store['fluidez.progress'] || '{}');
function walk(o) { return (o.children || []).reduce((a, c) => a.concat([c], walk(c)), []); }
function hasCard(host) { return walk(host).some(n => /unit-done-card/.test(n.cls || '')); }

// last-day-of-unit session at A1
const U = Object.values(window.COURSE_UNITS).filter(u => !u.optional && u.band === 'A1' && u.from != null).sort((a, b) => a.from - b.from);
const u1 = U[0], last = u1.from + u1.length - 1;
let hostNode;
function runDay(S, di) {
  S.startAt(di, 'diaria');
  let g = 0; while (g++ < 8 && live && store['fluidez.session']) live.done();
}
(0, eval)(SRC); let S = window.Session;
ok(S.unitOf(0) && S.unitOf(0).id === u1.id, 'unitOf(0) is the first unit');
// replace host with a capturing node
document.getElementById = () => (hostNode = hostNode || node('div'));
store['fluidez.progress'] = JSON.stringify({ beginnerDay: u1.length - 2 });
for (let di = u1.length - 2; di <= last; di++) {
  hostNode = null;
  store['fluidez.progress'] = JSON.stringify(Object.assign(prog(), { beginnerDay: di }));
  (0, eval)(SRC); S = window.Session;
  runDay(S, di);
  const card = hasCard(hostNode);
  ok(card === (di === last), 'day ' + di + (di === last ? ' (last): card shown' : ': no card'));
}
ok(prog().unitsDone && prog().unitsDone[u1.id], 'unitsDone recorded');
(0, eval)(SRC); S = window.Session; hostNode = null;
store['fluidez.progress'] = JSON.stringify(Object.assign(prog(), { beginnerDay: last }));
runDay(S, last);
ok(!hasCard(hostNode), 'the card shows once only');
ok(S.unitProgress(u1).done === u1.length, 'unitProgress reports the unit complete');

// theme list
const F = window.Focus;
store = {};
const counts = {}; window.PASSAGES.forEach(p => { if (window.LEVELS[0].levels.indexOf(p.level || 1) !== -1) counts[p.theme] = (counts[p.theme] || 0) + 1; });
const opts = F.themeOptions('A1').map(o => o.id);
ok(opts.every(id => counts[id] >= 3), 'every offered theme has 3+ passages at A1');
const few = Object.keys(counts).filter(id => counts[id] < 3).concat(window.THEMES.map(t => t.id).filter(id => !counts[id]));
ok(few.every(id => opts.indexOf(id) === -1), 'themes with fewer than 3 passages are not offered (' + few.length + ' excluded)');
ok(opts.length > 0, opts.length + ' themes offered');
const t0 = opts[0];
store['fluidez.themes'] = JSON.stringify({ ['A1:' + t0]: { done: 1 } });
ok(F.themeOptions('A1').map(o => o.id).indexOf(t0) === -1, 'a theme done at the band is excluded');
ok(F.themeOptions('A2').map(o => o.id).indexOf(t0) !== -1 || !window.PASSAGES.some(p => p.theme === t0 && window.LEVELS[1].levels.indexOf(p.level || 1) !== -1), 'but it is not excluded at another band');

// choosing a theme starts a focus of the right length
store = {};
const offer = window.Hub.themeOffer({ unitId: 'x', days: 9, band: 'A1', title: 'Next week' });
const chip = walk(offer).filter(n => /theme-chip$/.test(n.cls))[0];
chip.h.click();
ok(F.get() && F.get().of === 9 && F.get().theme === opts[0], 'choosing a theme starts a Focus of the next unit\'s length');
ok(window.Hub.themeOffer({ unitId: 'x', days: 9, band: 'A1', title: 't' }) === null, 'offer is made once per unit');
F.start(t0, 99, 'A1'); ok(F.get().of === F.MAX_DAYS, 'length is capped at Focus max');

// completing a focus with 3 themed reads marks the theme done
store = {};
const T3 = window.PASSAGES.filter(p => p.theme === opts[1] && window.LEVELS[0].levels.indexOf(p.level || 1) !== -1).slice(0, 3);
F.start(opts[1], 2, 'A1');
const started = F.get().started;
store['fluidez.progress'] = JSON.stringify({ read: { [T3[0].id]: started, [T3[1].id]: started, [T3[2].id]: started } });
F.tick();
ok(F.get() && !F.themeDone(opts[1], 'A1'), 'not done before the last session');
const o = F.get(); o.lastDay = -1; store['fluidez.focus'] = JSON.stringify(o);
F.tick();
ok(F.get() === null && F.themeDone(opts[1], 'A1'), 'full length plus 3 themed reads marks the theme done at the band');
// with only 2 reads it does not
store = {}; F.start(opts[2], 1, 'A1');
const T2 = window.PASSAGES.filter(p => p.theme === opts[2]).slice(0, 2);
store['fluidez.progress'] = JSON.stringify({ read: { [T2[0].id]: F.get().started, [T2[1].id]: F.get().started } });
F.tick();
ok(!F.themeDone(opts[2], 'A1'), 'two themed reads are not enough');
console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
