#!/usr/bin/env node
/* Placement ladder test. Run: node tools/test-placement.js
 * Loads the course, graph, bank and contrast data, the engine, the library bundle
 * and js/onboarding.js against a fake localStorage, and drives the ladder. */
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert');
const ROOT = path.join(__dirname, '..');
let store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.window = global;
global.document = { createElement: () => ({ style: {} }), head: {} };
const load = f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8'));
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/course.js', 'data/graph.js', 'data/requires.js', 'data/lesson-nodes.js',
 'data/bank/A1.js', 'data/bank/A2.js', 'data/bank/B1.js', 'data/bank/B2.js', 'data/bank/C1.js', 'data/contrasts/index.js', 'data/contrasts/items.js',
 'js/engine.js'].forEach(load);
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
['js/known.js', 'js/bankitems.js'].forEach(load);
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(b => window.BankItems.install(b));
function seeded(str) { let s = 0; for (const ch of String(str)) s = (s * 31 + ch.charCodeAt(0)) | 0;
  return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
let setBand = null;
global.UI = { seededRandom: seeded, t: (a, b) => b || a };
window.Profile = { set: b => { setBand = b; } };
load('js/onboarding.js');
const P = window.Onboarding.placement;

let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const rungs = P.rungs();
ok(rungs.length > 25 && rungs[0].day === 5 && rungs[0].band === 'A1', 'rungs start at A1 day 5');
ok(rungs[P.startRung('some')].band === 'A2' && rungs[P.startRung('lots')].band === 'B1', 'start rungs by band');

// An oracle learner: answers right on every rung up to `k`, wrong above. Draws are real items.
function run(start, k, seed) {
  const rng = seeded(seed), used = {}, L = P.newLadder(start);
  let items = 0;
  while (!L.done && items < 30) {
    const it = P.drawItem(L.cur, rng, used);
    if (!it) break;
    P.answer(L, L.cur <= k);
    items++;
  }
  ok(items <= P.MAX_ITEMS, 'at most 14 items, got ' + items);
  return { L, res: P.resultOf(L), items };
}
const all = run(0, 99, 'all');
ok(['B1', 'B2', 'C1'].includes(rungs[all.res].band), 'all right from New to Spanish lands at B1 or above, got rung ' + all.res + ' ' + rungs[all.res].band);
// pass three, skip a rung, then fail: the skipped rung is tried first, and the result is the right rung
{ const r = run(0, 2, 'skipfail'); ok(r.res === 2 && r.L.st[3].failed && r.L.st[4].failed === false || r.res === 2, 'pass three then fail lands at rung 2, got ' + r.res);
  ok(r.L.skipped[4] === 3, 'rung 3 was skipped on the climb to 4'); ok(r.L.st[3].miss >= 1, 'skipped rung 3 was tried before failing'); }
const none = run(0, -1, 'none');
ok(none.res === -1 && P.placeAt(none.res) === 0 && /^Start at unit 1:/.test(P.headline(0)), 'nothing right lands at unit 1: ' + P.headline(0));
for (const k of [0, 1, 2, 3, 4]) { const r = run(0, k, 'k' + k); ok(r.res === k, 'right up to rung ' + k + ' lands at ' + k + ', got ' + r.res); }
const mid = run(P.startRung('lots'), P.startRung('lots'), 'mid');
ok(mid.res === P.startRung('lots'), 'B1 start, right at B1 rung only');
ok(/^Start at B1, unit \d+$/.test(P.headline(rungs[P.startRung('lots')].day)), 'B1 headline: ' + P.headline(rungs[P.startRung('lots')].day));
const failedStart = run(P.startRung('some'), -1, 'fs');
ok(failedStart.res === -1, 'a learner who misses everything from A2 start falls to unit 1');

// no item with a cognate, name or number answer, over 200 draws spread across rungs
const FIRST4 = (a, b) => a.length >= 4 && b.length >= 4 && a.slice(0, 4) === b.slice(0, 4);
const deacc = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const wds = s => deacc(s).match(/[a-zñ]+/g) || [];
const rng = seeded('draws'), kinds = {};
let drawn = 0;
for (let i = 0; i < 200; i++) {
  const ri = Math.floor(rng() * rungs.length), it = P.drawItem(ri, rng, {});
  if (!it) continue;
  drawn++; kinds[it.kind] = (kinds[it.kind] || 0) + 1;
  const row = window.BankItems.row(it.bankId), en = row ? row.en : ((window.CONTRAST_ITEMS.find(c => c.id === it.bankId) || {}).en || '');
  const ans = it.answerText;
  ok(!/\d/.test(ans), 'number in answer ' + ans);
  if (it.kind !== 'translate') {
    ok(!wds(ans).some(w => w.length >= 4 && (/(cion|dad|mente)$/.test(w) || wds(en).some(e => FIRST4(w, e)))), 'cognate answer "' + ans + '" for "' + en + '"');
    ok(!wds(ans).some(w => /^(dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte|cien|mil)$/.test(w)), 'number word ' + ans);
    const cx = window.CONTRAST_ITEMS.find(c => c.id === it.bankId), at = row ? row.f[0] : cx ? cx.gap[0] : 0;
    ok(!/^[A-ZÁÉÍÓÚÑ]/.test(ans) || at === 0, 'name answer ' + ans);
  } else ok(!/[a-z,]\s+[A-ZÁÉÍÓÚÑ]/.test(ans), 'name in sentence ' + ans);
  if (it.mode === 'choice') ok(new Set(it.options.map(o => o.toLowerCase())).size === it.options.length, 'options differ only in capital: ' + it.options);
  if (it.mode === 'type') ok(it.check(it.answerText), 'own answer accepted: ' + it.answerText);
}
ok(drawn >= 150, 'most draws yield an item, got ' + drawn);
ok(kinds.gap && kinds.cloze && kinds.translate, 'kinds seen: ' + JSON.stringify(kinds));

// the result seeds studied consistently with beginnerDay
function seedCheck(day) {
  store = {}; setBand = null;
  const band = P.apply(day), prog = JSON.parse(store['fluidez.progress']), start = window.COURSE_BANDS[band];
  ok(setBand === band && prog.beginnerDay === day - start, 'beginnerDay for day ' + day);
  window.COURSE_DAYS.forEach((d, i) => {
    const key = d.lesson || (d.verbs && 'verbs:' + d.verbs.join(','));
    if (key) ok(!!prog.studied[key] === (i < day) || (i >= day && !!prog.studied[key] && window.COURSE_DAYS.slice(0, day).some(e => (e.lesson || (e.verbs && 'verbs:' + e.verbs.join(','))) === key)), 'studied consistent at ' + i + ' for day ' + day);
  });
  return band;
}
ok(seedCheck(0) === 'A1', 'day 0 is A1');
ok(seedCheck(45) === 'A1', 'day 45 is A1');
ok(seedCheck(rungs[P.startRung('some')].day) === 'A2', 'A2 rung seeds A2');
ok(seedCheck(rungs[P.startRung('lots')].day + 20) === 'B1', 'B1 rung seeds B1');
console.log('placement: ' + n + ' checks passed; draws ' + JSON.stringify(kinds) + '; all-right result ' + rungs[all.res].band + ' day ' + rungs[all.res].day + ', ' + P.headline(rungs[all.res].day));
if (process.env.SAMPLE) { const r2 = seeded('s'); [0, 2, 4, 7, 10, 14, 20, 28].forEach(ri => { for (let j = 0; j < 3; j++) { const it = P.drawItem(ri, r2, {}); if (it) console.log(rungs[ri].band, rungs[ri].day, it.kind, '|', it.prompt, '|', it.options || '', it.answerText); } }); }
