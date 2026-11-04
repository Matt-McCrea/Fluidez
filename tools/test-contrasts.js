#!/usr/bin/env node
/* test-contrasts.js — js/contrasts.js against the contrast data, the graph and Known.
 *   node tools/test-contrasts.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
let fails = 0;
function ok(c, m) { if (!c) { fails++; console.log('FAIL  ' + m); } else console.log('ok    ' + m); }
const store = {};
const sb = { console, Math, JSON, Object, Array, String, Number, Set, Map, Promise, Date, isFinite, parseInt,
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
sb.window = sb;
const ctx = vm.createContext(sb);
['js/lib.bundle.js', 'data/graph.js', 'data/lesson-nodes.js', 'data/course.js', 'js/curriculum.js', 'js/known.js',
 'data/contrasts/index.js', 'data/contrasts/items.js', 'js/contrasts.js'].forEach(f => {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }); } catch (e) { console.log('load ' + f + ': ' + e.message); }
});
const C = sb.Contrasts, K = sb.Known, Cur = sb.Curriculum;
ok(C && C.ready(), 'Contrasts loads with its data (' + (sb.CONTRASTS || []).length + ' contrasts, ' + (sb.CONTRAST_ITEMS || []).length + ' items)');
function knownAt(band, day) {
  const di = (Cur && Cur.startOf ? Cur.startOf(band) : 0) + day;
  return { di, known: K.forLearner({}, di) };
}
const a1 = knownAt('A1', 20), b1 = knownAt('B1', 10);
const mA1 = C.mixable(a1.known), mB1 = C.mixable(b1.known);
console.log('mixable at A1 day 20: ' + mA1.length + (mA1.length ? ' ' + mA1.map(c => c.node).join(', ') : ''));
console.log('mixable at B1 day 10: ' + mB1.length + ' ' + mB1.map(c => c.node).join(', '));
ok(mA1.length <= mB1.length, 'no more contrasts are mixable at A1 day 20 than at B1 day 10');
const rng = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const cards = C.cardsFor(b1.known, 50, rng, { dayIndex: b1.di });
const byX = {};
cards.forEach(c => { byX[c.x] = (byX[c.x] || 0) + 1; });
ok(cards.length > 0 && cards.length <= mB1.length, 'cards come only from mixable contrasts (' + cards.length + ')');
ok(Object.values(byX).every(n => n === 1), 'at most one card per contrast per session');
ok(cards.every(c => c.id === 'x:' + sb.CONTRAST_ITEMS.find(i => 'x:' + i.id === c.id).id && c.kind === 'contrast' && Array.isArray(c.options) && c.gap), 'card shape: id, kind, options, gap');
ok(cards.every(c => !/[–—]|\s-\s/.test(c.why)), 'why carries no dashes');
// balanced across sides: draw repeatedly, marking each as met, and the two sides alternate
{
  const target = mB1.find(c => sb.CONTRAST_ITEMS.filter(i => i.x === c.node).length >= 6) || mB1[0];
  const enrolled = new Set(), sidesSeq = [];
  for (let i = 0; i < 4; i++) {
    for (const k of Object.keys(store)) delete store[k];
    const got = C.cardsFor(b1.known, 99, rng, { dayIndex: b1.di, isEnrolled: id => enrolled.has(id) }).find(c => c.x === target.node);
    if (!got) break;
    enrolled.add(got.id); sidesSeq.push(sb.CONTRAST_ITEMS.find(it => 'x:' + it.id === got.id).side);
  }
  const counts = {}; sidesSeq.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
  const vals = Object.values(counts);
  ok(sidesSeq.length >= 2 && Math.max(...vals) - Math.min(...vals) <= 1, 'sides are balanced over repeated sessions (' + JSON.stringify(counts) + ')');
}
// seen items are skipped
{
  for (const k of Object.keys(store)) delete store[k];
  const first = C.cardsFor(b1.known, 99, rng, { dayIndex: b1.di });
  C.markSeen(first);
  const again = C.cardsFor(b1.known, 99, rng, { dayIndex: b1.di });
  const seenIds = new Set(first.map(c => c.id));
  ok(again.every(c => !seenIds.has(c.id)), 'items seen in the last 14 days are skipped');
  const old = JSON.parse(store['fluidez.seen']), d = Object.keys(old).length;
  Object.keys(old).forEach(k => { old[k] -= 15; });
  store['fluidez.seen'] = JSON.stringify(old);
  ok(d > 0 && C.cardsFor(b1.known, 99, rng, { dayIndex: b1.di }).length === first.length, 'after 14 days the same contrasts are drawn again');
}
// rung order: lowest rung first
{
  for (const k of Object.keys(store)) delete store[k];
  const bad = cards.filter(c => { const it = sb.CONTRAST_ITEMS.find(i => 'x:' + i.id === c.id);
    const lows = sb.CONTRAST_ITEMS.filter(i => i.x === c.x && i.side === it.side && i.d != null && i.d <= b1.di && (i.r || []).every(r => !/^[gx]:/.test(r) || b1.known.has(r)));
    return it.rung > Math.min(...lows.map(i => i.rung)); });
  ok(bad.length === 0, 'lowest rung of the chosen side comes first');
}
ok(C.cardsFor(new Set(), 3, rng).length === 0, 'nothing known, nothing mixed');
console.log(fails ? fails + ' FAILED' : 'all passed');
process.exit(fails ? 1 : 0);
