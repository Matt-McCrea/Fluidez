#!/usr/bin/env node
/* ============================================================================
 * test-known.js — does node gating hold across the whole course?
 *
 *   nice node tools/test-known.js
 *
 * 1. For every course day, build the context for a learner who has done every
 *    prior day (studied seeded, empty SRS, empty ledger) and assert that no
 *    Apply, writing or passage item requires a node outside known + today
 *    (Known.allows) unless ctx.gaps records the ungated last resort.
 * 2. Count the days where fewer than half the Apply and writing items target
 *    today's nodes; print the first 20 with the lesson id; per-band tallies.
 * 3. Walk A1 days 0 to 60 as a learner who serves every day, with the exposure
 *    ledger on; no item key may repeat inside 14 days except as a recorded gap.
 * 4. Per-band supply: allowed Apply items, writing tasks and passages per day
 *    (min, median) and how many Known makes unavailable.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

let store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.window = global;
global.location = { search: '', hash: '' }; Object.defineProperty(global, 'navigator', { value: { language: 'en' }, configurable: true });
function node() { const n = { style: {}, children: [], classList: { add() {}, remove() {} }, appendChild(c) { n.children.push(c); return c; }, addEventListener() {}, setAttribute() {}, innerHTML: '', textContent: '' }; return n; }
global.document = { documentElement: { style: { setProperty() {} }, dataset: {}, setAttribute() {}, classList: { add() {}, remove() {} } },
  body: { classList: { add() {}, remove() {} } }, createElement: node, getElementById: () => node(), querySelector: () => null, addEventListener() {} };
function seeded(str) { let s = 0; for (const ch of String(str)) s = (s * 31 + ch.charCodeAt(0)) | 0;
  return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
global.UI = {
  seededRandom: seeded, t: (a, b) => b || a, el: node, clear() {}, nextBtn: () => node(),
  sample: (a, n, rng) => { rng = rng || Math.random; const c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c.slice(0, n); },
  pick: (a, rng) => a[Math.floor((rng || Math.random)() * a.length)]
};
const FILES = ['data/taxonomy.js', 'data/connectors.js', 'data/verbs.js', 'data/vocab.js', 'data/idioms.js',
  'data/grammar-docs.js', 'data/grammar.js', 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js',
  'data/strand-lessons.js', 'data/course.js', 'data/graph.js', 'data/requires.js', 'data/lesson-nodes.js', 'data/resources.js',
  'js/engine.js', 'js/lessons.js', 'js/checker.js', 'js/srs.js', 'js/profile.js', 'js/curriculum.js', 'js/lexmatch.js',
  'js/focus.js', 'js/unitcheck.js'];
FILES.forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/known.js'), 'utf8'));
/* The sentence bank (js/bankitems.js). BANK_BANDS=A1,A2 by default; NOBANK=1 measures the authored pools alone
 * (the "before" numbers); BANK_BANDS=A1,A2,B1,B2,C1 loads everything (about 27 MB, a few seconds). */
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/bankitems.js'), 'utf8'));
const BANK_ON = !process.env.NOBANK;
const BANK_BANDS = (process.env.BANK_BANDS || 'A1,A2').split(',');
if (BANK_ON) BANK_BANDS.forEach(b => {
  const t0 = Date.now();
  (0, eval)(fs.readFileSync(path.join(ROOT, 'data/bank/' + b + '.js'), 'utf8'));
  window.BankItems.install(b);
  console.log('bank ' + b + ' loaded and indexed in ' + (Date.now() - t0) + ' ms (' + window['BANK_' + b].length + ' rows)');
});
const BI = window.BankItems;
['Review', 'Learn', 'Comprehend', 'Apply', 'Produce'].forEach(k => { window['Stage' + k] = { key: k.toLowerCase(), run() {} }; });
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/session.js'), 'utf8'));
const S = window.Session, K = window.Known;

let fails = 0;
function ok(cond, msg) { if (!cond) { fails++; console.log('FAIL  ' + msg); } else console.log('ok    ' + msg); }
const median = a => { if (!a.length) return 0; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const days = window.COURSE_DAYS, bands = window.COURSE_BANDS;
const BAND_ORDER = Object.keys(bands).sort((a, b) => bands[a] - bands[b]);
const aIx = new Map(); window.APPLY_ITEMS.forEach((x, i) => aIx.set(x, i));
const aKey = x => x.key || ('apply:' + aIx.get(x)), wKey = t => t.key || ('writing:' + t.id), pKey = p => 'passage:' + p.id;
const lessonIds = days.map(d => d.lesson || null);

function setLearner(i) {
  const studied = {};
  for (let k = 0; k < i; k++) if (lessonIds[k]) studied[lessonIds[k]] = 1;
  store = {}; K.reset();
  store['fluidez.progress'] = JSON.stringify({ studied, courseSig: null });
  return studied;
}
/* a bank item targets today when its row practises or needs one of today's non-lexeme nodes (the same test as Known.targets) */
function bankHit(x, today) {
  if (!x.bankId) return false;
  const r = BI.row(x.bankId);
  return !!r && (r.t.concat(r.r)).some(n => today.has(n) && n.charAt(0) !== 'l');
}
function bandOf(i) { return days[i].band; }

/* ---- 1 + 2 + 4. every day ------------------------------------------------- */
const per = {};
const bad = [], weak = [];
let mismatch = 0, built = 0;
const sig = require('crypto');
for (let i = 0; i < days.length; i++) {
  const b = bandOf(i);
  window.Profile.set(b);
  const studied = setLearner(i);
  // pin the day: di is the band-relative index (paced bands), lessonId serves the others
  const pr = window.Profile.params();
  const over = { di: i - bands[b] };
  if (lessonIds[i]) over.lessonId = lessonIds[i];
  // the paced path rebuilds its counter when the course layout changed; pinning avoids that
  const ctx = S._build({ seed: 7, over, today: 100000 + i });
  built++;
  if (ctx.dayIndex !== i) { mismatch++; if (mismatch <= 40) console.log('   skip day ' + i + ' ' + b + ' ' + JSON.stringify(days[i]).slice(0, 80) + ' -> landed on ' + ctx.dayIndex); continue; }
  const known = K.forLearner({ studied }, i), today = ctx.nodes;
  const ungated = st => ctx.gaps.some(g => g.kind === 'ungated' && g.stage === st);
  const P = per[b] || (per[b] = { days: 0, apply: [], write: [], pass: [], unA: [], unW: [], unP: [], totA: [], totW: [], totP: [],
    weak: 0, items: 0, hit: 0, gaps: { ungated: 0, reuse: 0, 'authored-repeat': 0, 'bank-empty': 0, 'bank-unit-fallback': 0, 'bank-unloaded': 0 }, bad: 0, noToday: 0, weakNodes: 0, bank: [], bankItems: 0, bankApply: 0, bankWrite: 0, kinds: {} });
  P.days++;
  ctx.gaps.forEach(g => { P.gaps[g.kind] = (P.gaps[g.kind] || 0) + 1; });
  // violations
  const chk = (list, kf, st) => list.forEach(x => { if (x.authored) return; const okx = x.bankId ? BI.allowed(BI.row(x.bankId), known, today, b) : K.allows(kf(x), known, today, b); if (!okx && !ungated(st)) { P.bad++; bad.push(b + ' day ' + i + ' ' + kf(x)); } });
  chk(ctx.applyItems, aKey, 'apply'); chk(ctx.writeTasks, wKey, 'produce'); if (ctx.passage) chk([ctx.passage], pKey, 'comprehend');
  // alignment
  const items = ctx.applyItems.map(aKey).concat(ctx.writeTasks.map(wKey));
  const bankItems = ctx.applyItems.concat(ctx.writeTasks).filter(x => x.bankId);
  const hit = ctx.applyItems.filter(x => bankHit(x, today) || (!x.bankId && K.targets(aKey(x), today))).length + ctx.writeTasks.filter(x => bankHit(x, today) || (!x.bankId && K.targets(wKey(x), today))).length;
  P.bankItems += bankItems.length; P.bankApply += ctx.applyItems.filter(x => x.bankId).length; P.bankWrite += ctx.writeTasks.filter(x => x.bankId).length;
  bankItems.forEach(x => { P.kinds[x.bankKind] = (P.kinds[x.bankKind] || 0) + 1; });
  if (BANK_ON && BI.ready(b)) P.bank.push(BI.forNodes(today, known, { band: b }).length);
  P.items += items.length; P.hit += hit;
  if (!today.size) P.noToday++;
  if (items.length && hit * 2 < items.length) { P.weak++; if (today.size) P.weakNodes++; weak.push({ i, b, lesson: ctx.lesson ? ctx.lesson.id : (ctx.focus.type + ':' + (ctx.focus.verbs || []).join('+')), hit, n: items.length, today: today.size }); }
  // supply: items at this level, allowed vs not
  const lv = x => (x.level || 1) <= ctx.level;
  const A = window.APPLY_ITEMS.filter(lv), W = window.WRITING_TASKS.filter(lv), Ps = window.PASSAGES.filter(lv);
  const okA = A.filter(x => K.allows(aKey(x), known, today, b)).length;
  const okW = W.filter(x => K.allows(wKey(x), known, today, b)).length;
  const okP = Ps.filter(x => K.allows(pKey(x), known, today, b)).length;
  P.apply.push(okA); P.write.push(okW); P.pass.push(okP);
  P.unA.push(A.length - okA); P.unW.push(W.length - okW); P.unP.push(Ps.length - okP);
  P.totA.push(A.length); P.totW.push(W.length); P.totP.push(Ps.length);
}
console.log('\nbuilt ' + built + ' days; ' + mismatch + ' skipped (context landed on another day)');
ok(bad.length === 0, 'no served item requires a node outside known + today (' + bad.length + ' violations)');
bad.slice(0, 10).forEach(x => console.log('   ' + x));

console.log('\nALIGNMENT: days where fewer than half the Apply + writing items target today\'s nodes');
BAND_ORDER.forEach(b => { const P = per[b]; if (!P) return;
  console.log(`  ${b}: ${P.weak}/${P.days} days weak; ${P.hit}/${P.items} items target today (${(100 * P.hit / Math.max(1, P.items)).toFixed(0)}%); days with no today nodes ${P.noToday}`); });
BAND_ORDER.forEach(b => { const P = per[b]; if (!P) return;
  const share = 100 * (P.days - P.weak) / Math.max(1, P.days);
  const withNodes = P.days - P.noToday, shareN = 100 * (withNodes - P.weakNodes) / Math.max(1, withNodes);
  console.log(`  ${b}: ${share.toFixed(0)}% of days (${shareN.toFixed(0)}% of the ${withNodes} days that teach a node; a day with no node of its own cannot target one) have at least half their items on today's nodes; bank items served ${P.bankItems} (apply ${P.bankApply}, translate ${P.bankWrite}) ${JSON.stringify(P.kinds)}`);
  if (BANK_ON && BI.ready(b) && (b === 'A1' || b === 'A2')) ok(shareN >= 80, b + ': at least half the items target today on at least 80% of days that teach a node (' + shareN.toFixed(0) + '%)');
});
console.log('BANK SUPPLY per day: rows for today\'s nodes, allowed and deduped (min / median)');
BAND_ORDER.forEach(b => { const P = per[b]; if (!P || !P.bank.length) return; console.log(`  ${b}: ${Math.min(...P.bank)} / ${median(P.bank)}  over ${P.bank.length} days; days with none: ${P.bank.filter(n => !n).length}`); });
console.log('first 20 weak days:');
weak.slice(0, 20).forEach(w => console.log(`  day ${w.i} ${w.b} ${w.lesson}: ${w.hit}/${w.n} target, ${w.today} today nodes`));

console.log('\nGAPS per band (days with at least one entry counted by entry): ungated / reuse / authored-repeat / bank-empty / bank-unit-fallback / bank-unloaded');
BAND_ORDER.forEach(b => { const P = per[b]; if (P) console.log(`  ${b}: ${P.gaps.ungated} / ${P.gaps.reuse} / ${P.gaps['authored-repeat']} / ${P.gaps['bank-empty']} / ${P.gaps['bank-unit-fallback']} / ${P.gaps['bank-unloaded']}  over ${P.days} days`); });

console.log('\nSUPPLY per day, allowed at the learner\'s level (min / median)  [unavailable on average out of the level pool]');
BAND_ORDER.forEach(b => { const P = per[b]; if (!P) return;
  const avg = a => Math.round(a.reduce((x, y) => x + y, 0) / Math.max(1, a.length));
  console.log(`  ${b}: apply ${Math.min(...P.apply)} / ${median(P.apply)} [-${avg(P.unA)} of ${avg(P.totA)}]   writing ${Math.min(...P.write)} / ${median(P.write)} [-${avg(P.unW)} of ${avg(P.totW)}]   passages ${Math.min(...P.pass)} / ${median(P.pass)} [-${avg(P.unP)} of ${avg(P.totP)}]`); });
console.log('REQUIRES entries missing while measuring: ' + K.stats.missing);

/* ---- 3. A1 walk with the ledger on -------------------------------------------- */
console.log('\nLEDGER: A1 days 0 to 60, every day served');
window.Profile.set('A1'); store = {}; K.reset();
const last = new Map(); let repeats = 0, recorded = 0, served = 0;
const studied = {};
const BASE = 200000, WALK = Math.min(61, bands['A2'] || 61);
const lastGaps = [];
for (let t = 0; t < WALK; t++) {
  store['fluidez.progress'] = JSON.stringify({ studied, courseSig: null });
  const over = { di: t }; if (lessonIds[t]) over.lessonId = lessonIds[t];
  const ctx = S._build({ seed: t, over, today: BASE + t });
  const covered = new Set();
  ctx.gaps.forEach(g => { if (g.keys) g.keys.forEach(k => covered.add(k)); });
  const keys = ctx.applyItems.map(aKey).concat(ctx.writeTasks.map(wKey), ctx.passage ? [pKey(ctx.passage)] : []);
  keys.forEach(k => { served++;
    if (last.has(k) && t - last.get(k) < 14) { if (covered.has(k)) recorded++; else { repeats++; if (repeats <= 10) console.log('   repeat ' + k + ' day ' + t + ' (last ' + last.get(k) + ')'); } }
    last.set(k, t); });
  ctx.gaps.forEach(g => lastGaps.push(t + ':' + g.kind + ':' + g.stage));
  S._markSeen(ctx);
  if (lessonIds[t]) studied[lessonIds[t]] = 1;
}
console.log(`  served ${served} keys over ${WALK} days; unrecorded repeats within 14 days: ${repeats}; recorded gap reuses/authored repeats: ${recorded}`);
console.log('  gaps logged: ' + (lastGaps.length ? lastGaps.slice(0, 25).join(' ') + (lastGaps.length > 25 ? ' ... (' + lastGaps.length + ')' : '') : 'none'));
ok(repeats === 0, 'no item key repeats within a 14 day window (A1 days 0-' + (WALK - 1) + ') except recorded gaps');

console.log('\n' + (fails ? fails + ' FAILED' : 'all ok'));
process.exit(fails ? 1 : 0);
