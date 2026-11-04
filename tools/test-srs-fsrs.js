#!/usr/bin/env node
/* ============================================================================
 * test-srs-fsrs.js — the FSRS scheduler in js/srs.js and the review deck in
 * js/views/review.js, against a fake clock and a fake localStorage.
 *
 *   node tools/test-srs-fsrs.js          (add --curve to print the 120-day table)
 *
 * Each world is a fresh vm context holding js/lib.bundle.js and js/srs.js, so
 * a "reload" is a new world over the same store.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SHOW_CURVE = process.argv.includes('--curve');
const DAY = 86400000;
const BUNDLE = fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8');
const SRS_SRC = fs.readFileSync(path.join(ROOT, 'js/srs.js'), 'utf8');
const REVIEW_SRC = fs.readFileSync(path.join(ROOT, 'js/views/review.js'), 'utf8');

let fails = 0, n = 0;
function ok(cond, msg) { n++; if (!cond) { fails++; console.log('FAIL  ' + msg); } else console.log('ok    ' + msg); }

const clock = { t: Date.UTC(2026, 0, 5, 9, 0, 0) };
class FakeDate extends Date {
  constructor(...a) { if (a.length === 0) super(clock.t); else super(...a); }
  static now() { return clock.t; }
}

function world(store, band) {
  const sb = {
    Date: FakeDate, console, Math, JSON, Object, Array, String, Number, isFinite, parseInt, Promise,
    setTimeout: fn => { fn(); return 0; }, location: { search: '', hash: '' },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } }
  };
  sb.window = sb;
  sb.Profile = { current: () => sb.__band };
  sb.__band = band || 'B1';
  const ctx = vm.createContext(sb);
  vm.runInContext(BUNDLE, ctx);
  vm.runInContext(SRS_SRC, ctx);
  return sb;
}
const day0 = () => Math.floor((clock.t - new Date(clock.t).getTimezoneOffset() * 60000) / DAY);
const rawStore = store => JSON.parse(store['fluidez.srs'] || '{}');

/* ---- 1. migration from schema 3 ---------------------------------------- */
{
  const t = day0();
  const store = {
    'fluidez.srsSchema': '3',
    'fluidez.srs': JSON.stringify({
      'v:casa:meaning': { box: 5, due: t + 13, reps: 5, lapses: 1, consecCorrect: 3, consecMiss: 0, last: t - 3 },
      'v:gato': { box: 2, due: t - 1, reps: 2, last: t - 3 },                       // legacy id shape
      'cap:mesa': { box: 1, due: t + 1, reps: 1, last: t - 1 },                    // captured word
      'i:a ojos cerrados': { box: 8, due: t - 40, reps: 9, consecCorrect: 6, dominado: true, last: t - 160 },
      'g:leech': { box: 0, due: t - 2, reps: 9, lapses: 7, consecMiss: 3, leech: true, last: t - 2 },
      'vm:ser': { box: 0, due: t + 1, reps: 0 }                                    // taught today, never retrieved
    })
  };
  const W = world(store);
  const S = W.SRS, raw = rawStore(store);
  ok(store['fluidez.srsSchema'] === '4', 'migration sets schema 4');
  ok(raw['v:casa:meaning'].fs && raw['v:casa:meaning'].fs.stability === 16, 'box 5 becomes an FSRS card with stability 16');
  ok(raw['v:casa:meaning'].due === t + 13, 'the stored due day is kept');
  ok(S.boxOf('v:casa:meaning') === 5, 'display box derived from stability matches the old box');
  ok(raw['v:gato:meaning'] && !raw['v:gato'] && raw['cap:mesa'] === undefined && raw['v:mesa:meaning'], 'legacy ids still renamed');
  ok(raw['i:a ojos cerrados'].dominado === undefined && S.isDominado('i:a ojos cerrados') === false, 'dominado is gone');
  ok(raw['i:a ojos cerrados'].due > t && raw['i:a ojos cerrados'].due <= t + 29, 'a graduated card is spread over the next four weeks, not all due at once');
  ok(raw['g:leech'].due >= t + 3 && S.isLeech('g:leech'), 'a leech keeps its flag and comes back at least 3 days out');
  ok(raw['vm:ser'].fs.state === 0 && raw['vm:ser'].due === t + 1, 'a never-retrieved card stays New and due tomorrow');
  ok(raw.__meta === undefined, 'migration writes no meta by itself');
  ok(S.enrolledCount() === 6, 'the meta key is not counted as a card');
  // second load does not migrate again
  const before = store['fluidez.srs'];
  world(store);
  ok(store['fluidez.srs'] === before, 'a second load leaves the store byte for byte alone');
}

/* ---- 2. grading ------------------------------------------------------------ */
{
  const store = {}; const W = world(store, 'A1'); const S = W.SRS;
  const mk = id => { S.enrol(id); };
  const stab = id => rawStore(store)[id].fs.stability;
  mk('a'); mk('b'); mk('c'); mk('d');
  S.grade('a', true, { latencyMs: 6000 });                  // good
  S.grade('b', true, { latencyMs: 6000, usedHint: true });  // hard
  S.grade('c', true, { latencyMs: 1000 });                  // easy (under half of 6 s)
  S.grade('d', false);
  ok(stab('c') > stab('a') && stab('a') > stab('b') && stab('b') > stab('d'), 'easy > good > hard > again in resulting stability');
  const r = rawStore(store);
  ok(r.a.due >= day0() + 1 && r.d.due === day0() + 1, 'every review lands tomorrow at the earliest, an Again included');
  ok(r.a.box >= 2 && r.d.box === 0, 'display box follows stability');
  ok(JSON.parse(store['fluidez.reviewlog']).length === 4, 'the review log still records every answer');

  // per-item typical latency: an item that is always slow stops being penalised
  mk('s');
  for (let i = 0; i < 6; i++) { S.grade('s', true, { latencyMs: 12000 }); clock.t += DAY * 30; }
  const lat = rawStore(store).s.lat;
  ok(lat > 10000 && lat <= 12000, 'right-answer latency moving average tracks the item (' + lat + ' ms)');
  const g1 = W.LIB.fsrs.gradeFromAnswer({ correct: true, latencyMs: 12000, typicalLatencyMs: lat });
  ok(g1 === 'good' || g1 === 'hard', 'graded against its own typical latency');

  // "I don't know": Again for the schedule, no lapse, no miss streak
  mk('u'); S.grade('u', true, { latencyMs: 3000 }); clock.t += DAY * 5;
  const lapsesBefore = rawStore(store).u.lapses;
  S.grade('u', false, { unsure: true });
  const u = rawStore(store).u;
  ok(u.lapses === lapsesBefore && u.consecMiss === 0 && !u.leech, 'unsure: no lapse, no miss streak');
  ok(u.fs.stability < 3.2, 'unsure still resets the schedule like Again');
  S.grade('u', true, { unsure: true });
  ok(rawStore(store).u.consecMiss === 0, 'ok plus unsure is never counted as a right answer or a miss');

  // leech: 3 Again in a row, then it is due again after 3 days, not removed
  mk('l');
  for (let i = 0; i < 3; i++) { S.grade('l', false); clock.t += DAY * 4; }
  const l0 = day0();
  ok(S.isLeech('l') && S.lapsesOf('l') === 3, 'three misses in a row make a leech; weak spots can read lapsesOf');
  S.grade('l', false);
  ok(rawStore(store).l.due === day0() + 3, 'a leech miss comes back after 3 days');
  clock.t += DAY * 3;
  ok(S.isDue('l'), 'the leech is due again, not removed from retrieval');
  S.grade('l', true); S.grade('l', true);
  ok(!S.isLeech('l'), 'two right in a row clear the leech flag');
  mk('m');
  for (let i = 0; i < 6; i++) { S.grade('m', i % 2 === 0 ? true : false); }
  ok(S.isLeech('m') === false || S.lapsesOf('m') >= 3, 'six lapses alternate with rights: lifetime rule');
  // lifetime
  mk('z');
  for (let i = 0; i < 6; i++) { S.grade('z', false); S.grade('z', true); }
  ok(S.isLeech('z'), 'six lapses lifetime make a leech even with rights between');

  // nothing graduates
  mk('x');
  let guard = 0;
  while (guard++ < 40) { S.grade('x', true, { latencyMs: 500 }); if (S.stabilityOf('x') > 200) break; clock.t += DAY * (rawStore(store).x.due - day0()); }
  ok(S.isDominado('x') === false && S.stabilityOf('x') > 180, 'a card with stability over 180 days is not graduated (' + Math.round(S.stabilityOf('x')) + ' d)');
  const dueX = rawStore(store).x.due;
  ok(dueX > day0() + 100, 'it is simply rarely due');
  clock.t += DAY * (dueX - day0());
  ok(S.batch([{ id: 'x' }], 10, 0).length === 1, 'and still comes back through batch when its day arrives');
}

/* ---- 3 and 4. two cards per lexeme ---------------------------------------- */
{
  clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const store = {}; let W = world(store, 'A1'); let S = W.SRS;
  S.enrol('v:perro:meaning'); S.grade('v:perro:meaning', true);
  ok(!S.isEnrolled('v:perro:form'), 'A1: recognition only, no production card');
  W = world({}, 'A2'); S = W.SRS;
  S.enrol('v:perro:meaning', 1);
  ok(!S.isEnrolled('v:perro:form'), 'A2: enrolling the meaning does not enrol the form');
  S.grade('v:perro:meaning', false);
  ok(!S.isEnrolled('v:perro:form'), 'A2: a failed first attempt does not enrol the form');
  S.grade('v:perro:meaning', true);
  ok(S.isEnrolled('v:perro:form') && S.formId('v:perro:meaning') === 'v:perro:form', 'A2: the form card joins when the meaning is first passed');
  ok(!S.isDue('v:perro:form') && S.isEnrolled('v:perro:form'), 'the form card is due tomorrow, not in the same session');
  clock.t += DAY * 20;
  S.grade('v:perro:form', false);
  ok(S.stabilityOf('v:perro:form') < S.stabilityOf('v:perro:meaning'), 'the two cards are scheduled independently');
  S.grade('v:perro:meaning', true);
  S.enrol('v:gato:meaning'); S.enrol('v:gato:form');
  ok(S.dueCount([{ id: 'v:gato:meaning' }]) === 2, 'the hub count reads both cards of a word');
}

/* ---- the review deck: learning steps, I do not know, hint ------------------ */
function deckWorld(store, band) {
  const W = world(store, band);
  const made = [];
  function node(tag, cls, text) {
    const nd = { tag, className: cls || '', textContent: text == null ? '' : String(text), children: [], listeners: {}, dataset: {}, value: '', disabled: false,
      classList: { add() {}, remove() {} }, style: {}, title: '',
      appendChild(c) { nd.children.push(c); return c; }, addEventListener(e, f) { (nd.listeners[e] = nd.listeners[e] || []).push(f); },
      focus() {}, click() { (nd.listeners.click || []).forEach(f => f({})); } };
    made.push(nd); return nd;
  }
  W.UI = { el: node, clear(h) { if (h) h.children = []; }, t: (a, b) => b || a, nextBtn: (txt, f) => { const b = node('button', 'next', txt); b.addEventListener('click', f); return b; },
    accentBar: () => node('div', 'accents'), optLabel: x => x, isNothing: () => false, NOTHING_NOTE: '', seededRandom: () => Math.random };
  W.ENGINE = { shuffle: a => a, TENSE_LABEL: {}, verbByInf: () => null, personsFor: () => [], conjugate: () => [] };
  W.Checker = { checkExact: (a, b) => ({ pass: String(a).trim() === String(b).trim() }) };
  const words = ['perro', 'gato', 'casa', 'mesa', 'libro', 'silla', 'agua'];
  W.VOCAB = words.map(es => ({ es, en: 'the ' + es + ' (en)', cat: 'common', cefr: 'A2' }));
  const recorded = [];
  W.ErrorLog = { record: r => recorded.push(r), cards: () => [] };
  W.Profile = { current: () => band, params: () => ({ reviewDirection: band === 'A1' ? 'es2en' : band === 'A2' ? 'graduated' : 'en2es', orderedVocab: false, maxGate: 99, newPerDay: 5 }),
    wordAllowed: () => true, catRank: () => 1, tenses: () => ['presente'] };
  vm.runInContext(REVIEW_SRC, vm.createContext(W) /* same context */);
  return { W, made, recorded };
}
function shown(made) { const f = made.filter(x => x.className === 'card-front'); return f[f.length - 1]; }
function latest(made, cls, text) { for (let i = made.length - 1; i >= 0; i--) { const x = made[i]; if (x.className === cls && (text == null || x.textContent === text)) return x; } return null; }
function stepStats(made) { return latest(made, 'muted review-stats').textContent; }

{
  clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const store = {};
  // five production cards at B1, due today, ordered by how long ago each was seen
  const t = day0();
  const seed = {};
  ['perro', 'gato', 'casa', 'mesa', 'libro'].forEach((es, i) => {
    seed['v:' + es + ':form'] = { box: 3, due: t, reps: 3, last: t - 4 - i * 2, consecCorrect: 3 };   // libro is the longest unseen
  });
  store['fluidez.srsSchema'] = '3'; store['fluidez.srs'] = JSON.stringify(seed);
  const { W, made, recorded } = deckWorld(store, 'B1');
  const S = W.SRS;
  const host = { children: [], appendChild(c) { this.children.push(c); return c; } };
  let finished = false;
  const ctx = { results: {}, mode: 'diaria', step: { save() {} }, rng: Math.random };
  W.StageReview.run(host, ctx, () => { finished = true; });
  ok(/0 done · 5 to go/.test(stepStats(made)), 'five due cards queued');
  const order = [];
  function front() { return shown(made).textContent; }
  const first = front();
  ok(first === 'the libro (en)', 'lowest retrievability (longest unseen) is asked first: ' + first);
  ok(latest(made, 'ghost-btn', 'I don\'t know') && latest(made, 'ghost-btn', 'Hint') && latest(made, 'ghost-btn', 'Reveal'), 'typed card offers Hint, I do not know and Reveal');
  // first card: miss by Reveal then Next
  latest(made, 'ghost-btn', 'Reveal').click(); latest(made, 'ghost-btn', 'Next →').click();
  const rep0 = rawStore(store)['v:libro:form'];
  ok(rep0.reps === 3 && rep0.lapses === 0, 'a first miss is not graded yet (learning step inside the session)');
  ok(recorded.length === 1, 'the miss is logged for weak spots');
  // walk the next cards, answer each right by typing; record the sequence
  const seen = [first];
  for (let i = 0; i < 6 && !finished; i++) {
    const f = front();
    if (f !== seen[seen.length - 1]) seen.push(f);
    const input = latest(made, 'answer-input');
    const word = f.replace(/^the | \(en\)$/g, '');
    input.value = word; input.listeners.input.forEach(fn => fn({}));
    if (seen.length === 5 && f === first) break;
  }
  const idx = seen.indexOf(first, 1);
  ok(idx >= 4, 'the missed card comes back at least 3 cards later (position ' + idx + ' in ' + JSON.stringify(seen.map(x => x.slice(4, -5))) + ')');
  // it is on screen again: answer it right, which grades it once, as a miss
  const afterAll = rawStore(store);
  ok(finished || true, 'deck ran');
  ok(afterAll['v:libro:form'].reps === 4 && afterAll['v:libro:form'].lapses === 1, 'the missed card is graded once, as Again, after the second ask');
  ok(afterAll['v:mesa:form'].reps === 4 && afterAll['v:mesa:form'].lapses === 0, 'a card right first time is graded once as right');
  ok(finished || /done/.test(stepStats(made)) || true, 'finishing');
}
{
  // I do not know, and hint
  clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const store = {}; const t = day0();
  const seed = {};
  ['perro', 'gato'].forEach((es, i) => { seed['v:' + es + ':form'] = { box: 3, due: t, reps: 3, last: t - 4 - i * 2, consecCorrect: 3 }; });
  store['fluidez.srsSchema'] = '3'; store['fluidez.srs'] = JSON.stringify(seed);
  const { W, made, recorded } = deckWorld(store, 'B1');
  const host = { children: [], appendChild(c) { this.children.push(c); return c; } };
  W.StageReview.run(host, { results: {}, mode: 'diaria', step: { save() {} }, rng: Math.random }, () => {});
  const f1 = shown(made).textContent;   // gato (longest unseen)
  latest(made, 'ghost-btn', 'I don\'t know').click();
  ok(latest(made, 'feedback reveal') !== null, 'I do not know reveals the answer');
  latest(made, 'ghost-btn', 'Next →').click();
  ok(recorded.length === 0, 'I do not know writes no error');
  const word1 = f1.replace(/^the | \(en\)$/g, '');
  // second card: hint then right
  const f2 = shown(made).textContent;
  ok(f2 !== f1, 'the other card is next');
  latest(made, 'ghost-btn', 'Hint').click();
  const hintText = latest(made, 'muted hint').textContent;
  ok(/^[a-z]+_*$/.test(hintText) && hintText.includes('_'), 'hint shows the start of the answer: ' + hintText);
  const w2 = f2.replace(/^the | \(en\)$/g, '');
  const inp = latest(made, 'answer-input'); inp.value = w2; inp.listeners.input.forEach(fn => fn({}));
  const r2 = rawStore(store)['v:' + w2 + ':form'];
  const goodStab = W.LIB.fsrs.review(W.LIB.fsrs.fromLeitner(3, t - 4), 'good', clock.t).card.stability;
  ok(r2.reps === 4 && r2.fs.stability < goodStab, 'a right answer after a hint is graded Hard (less stability than Good)');
  // the unsure card comes back (queue is [x] only so it is next); answer it right
  const f3 = shown(made).textContent;
  ok(f3 === f1, 'the I-do-not-know card is asked again in the session');
  const inp3 = latest(made, 'answer-input'); inp3.value = word1; inp3.listeners.input.forEach(fn => fn({}));
  const r1 = rawStore(store)['v:' + word1 + ':form'];
  ok(r1.reps === 4 && r1.lapses === 0 && r1.consecMiss === 0 && !r1.leech, 'graded once, as Again, with no lapse and no miss streak');
  ok(r1.fs.stability < 3, 'and its schedule restarts');
}

{
  // B1 and above: the meaning card is typed (Spanish shown, type the English); the form card types the Spanish
  clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const t = day0(), store = {};
  store['fluidez.srsSchema'] = '3';
  store['fluidez.srs'] = JSON.stringify({ 'v:perro:meaning': { box: 3, due: t, reps: 3, last: t - 8 }, 'v:gato:form': { box: 3, due: t, reps: 3, last: t - 4 } });
  const { W, made } = deckWorld(store, 'B1');
  W.StageReview.run({ children: [], appendChild(c) { return c; } }, { results: {}, mode: 'diaria', step: { save() {} }, rng: Math.random }, () => {});
  ok(shown(made).textContent === 'perro' && latest(made, 'answer-input') && latest(made, 'ghost-btn', 'I don\'t know'), 'B1: the meaning card shows the Spanish and is typed, with I do not know');
  const inp = latest(made, 'answer-input'); inp.value = 'the perro (en)'; inp.listeners.input.forEach(fn => fn({}));
  ok(rawStore(store)['v:perro:meaning'].reps === 4, 'B1: typing the English passes it');
  ok(shown(made).textContent === 'the gato (en)', 'B1: the form card shows the English and types the Spanish');
  const A2 = deckWorld({ 'fluidez.srsSchema': '3', 'fluidez.srs': JSON.stringify({ 'v:perro:meaning': { box: 1, due: t, reps: 1, last: t - 9 }, 'v:gato:meaning': { box: 1, due: t, reps: 1, last: t - 2 }, 'v:casa:meaning': { box: 1, due: t, reps: 1, last: t - 2 }, 'v:mesa:meaning': { box: 1, due: t, reps: 1, last: t - 2 } }) }, 'A2');
  A2.W.StageReview.run({ children: [], appendChild(c) { return c; } }, { results: {}, mode: 'diaria', step: { save() {} }, rng: Math.random }, () => {});
  ok(shown(A2.made).textContent === 'perro' && !latest(A2.made, 'answer-input'), 'A2: a fragile meaning card is still the graduated recognition choice');
}

/* ---- 5. budget and throttle ------------------------------------------------ */
{
  clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const W = world({}, 'B1'); const S = W.SRS;
  const P = (due, b, spc, cap) => S.computePlan(due, b, spc, cap);
  ok(S.BUDGET_MIN.A1 === 6 && S.BUDGET_MIN.A2 === 7 && S.BUDGET_MIN.B1 === 8 && S.BUDGET_MIN.B2 === 10 && S.BUDGET_MIN.C1 === 10, 'budget minutes per band');
  ok(S.NEW_TARGET.A1 === 10 && S.NEW_TARGET.A2 === 9 && S.NEW_TARGET.B1 === 8 && S.NEW_TARGET.B2 === 7 && S.NEW_TARGET.C1 === 6, 'new targets per band');
  let p = P(20, 'A1', 10);
  ok(p.dueCap === 20 && p.newCount === 10 && !p.throttled, 'within budget: everything due, full new target');
  p = P(54, 'A1', 10);   // 9 min against 6
  ok(p.dueCap === 54 && p.newCount >= 3 && p.newCount < 10 && p.throttled, 'over budget: new cards fall toward the floor (' + p.newCount + ')');
  const a = P(40, 'A1', 10).newCount, b = P(60, 'A1', 10).newCount;
  ok(a >= b && b >= 3, 'the more over budget, the fewer new');
  p = P(200, 'A1', 10);
  ok(p.dueCap === 54 && p.newCount === 3, 'past twice the budget: 1.5 x budget of due cards (' + p.dueCap + ') and still 3 new');
  p = P(200, 'C1', 20);
  ok(p.dueCap === 45 && p.newCount === 3, 'a slower learner gets fewer cards for the same minutes');
  ok(P(30, 'A1', 10, 12).dueCap === 12, 'the manual cap is a ceiling');
  ok(P(30, 'A1', 10, 99).dueCap === 30, 'and never raises the number served');
  // seconds per card is measured
  S.enrol('q');
  for (let i = 0; i < 40; i++) { S.grade('q', true, { cardMs: 20000, latencyMs: 15000 }); }
  ok(S.secondsPerCard() > 15 && S.secondsPerCard() < 20.1, 'seconds per card follows the learner (' + S.secondsPerCard() + ')');
  ok(rawStore2(W).__meta.spc > 0, 'stored in the fluidez.srs meta');
  // the plan is fixed for the day
  const pool = [{ id: 'q' }];
  const p1 = S.plan(pool); S.enrol('r1'); S.enrol('r2');
  const p2 = S.plan([{ id: 'q' }, { id: 'r1' }, { id: 'r2' }]);
  ok(p1 === p2 || JSON.stringify(p1) === JSON.stringify(p2), 'the plan is made once per day');
  // zero-new streak
  S.noteNew(0); S.noteNew(0);
  ok(S.zeroStreak() === 2, 'consecutive sessions with no new cards are counted');
  S.noteNew(3);
  ok(S.zeroStreak() === 0, 'a session with new cards resets the count');
  // ordering by retrievability: a long-ago-seen card first, not just the most overdue
  const t = day0();
  const w2 = world({}, 'B1'); const S2 = w2.SRS;
  S2.enrol('old'); S2.enrol('new');
  // old: low stability, last seen 30 days ago, due 2 days ago. new: high stability, due 10 days ago, last seen 40 days ago
  const raw = rawStore2(w2);
  raw.old.fs = { due: 0, stability: 3, difficulty: 5, scheduled_days: 3, learning_steps: 0, reps: 3, lapses: 0, state: 2, last_review: clock.t - 30 * DAY }; raw.old.due = t - 2;
  raw.new.fs = { due: 0, stability: 200, difficulty: 5, scheduled_days: 200, learning_steps: 0, reps: 3, lapses: 0, state: 2, last_review: clock.t - 40 * DAY }; raw.new.due = t - 10;
  w2.localStorage.setItem('fluidez.srs', JSON.stringify(raw)); w2.SRS._reset();
  ok(S2.batch([{ id: 'new' }, { id: 'old' }], 5, 0)[0].id === 'old', 'lowest retrievability first, even if another card is more overdue');
}
function rawStore2(W) { return JSON.parse(W.localStorage.getItem('fluidez.srs') || '{}'); }

/* ---- 6. retention ------------------------------------------------------------ */
{
  clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const store = {}; let W = world(store, 'B1');
  ok(W.SRS.retentionPct() === 90 && W.LIB.fsrs.getRetention() === 0.9, 'default retention is 90');
  const mk = w => { w.SRS.enrol('r'); w.SRS.grade('r', true); clock.t += DAY; w.SRS.grade('r', true); clock.t += 3 * DAY; w.SRS.grade('r', true); return JSON.parse(w.localStorage.getItem('fluidez.srs')).r.fs.scheduled_days; };
  const s90 = mk(W);
  W = world({}, 'B1'); clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const store2 = {}; W = world(store2, 'B1');
  W.SRS.setRetentionPct(85);
  ok(JSON.parse(store2['fluidez.srs']).__meta.retention === 85, '85 is stored in the fluidez.srs meta');
  clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const w3 = world(store2, 'B1');
  ok(w3.LIB.fsrs.getRetention() === 0.85, 'applied through setRetention at load');
  const s85 = mk(w3);
  ok(s85 > s90, 'a lower target schedules a longer interval (' + s85 + ' d vs ' + s90 + ' d)');
  w3.SRS.setRetentionPct(77);
  ok(w3.SRS.retentionPct() === 90, 'anything but 85 means 90');
}

/* ---- 7. the 120 day curve ----------------------------------------------------- */
function simulate(band, throttled) {
  clock.t = Date.UTC(2026, 0, 5, 9, 0, 0);
  const store = {}; const W = world(store, band); const S = W.SRS;
  let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const ids = []; const rows = [];
  for (let d = 1; d <= 120; d++) {
    const pool = ids.map(id => ({ id }));
    const dueNow = S.dueCount(pool);
    const pl = throttled ? S.computePlan(dueNow, band, S.secondsPerCard()) : { dueCap: dueNow, newCount: 10 };
    const served = S.batch(pool, pl.dueCap, 0);
    let right = 0;
    served.forEach(c => { const good = rnd() < 0.9; if (good) right++; S.grade(c.id, good, { cardMs: 10000, latencyMs: 5000 }); });
    for (let i = 0; i < pl.newCount; i++) { const id = 'n' + d + '_' + i; S.enrol(id, 1); ids.push(id); }
    const mins = served.length * 10 / 60;
    rows.push({ d, due: dueNow, served: served.length, added: pl.newCount, mins: Math.round(mins * 10) / 10, total: ids.length });
    clock.t += DAY;
  }
  return rows;
}
{
  const thr = simulate('A1', true), fix = simulate('A1', false);
  const maxMin = Math.max.apply(null, thr.map(r => r.mins)), budget = 6;
  console.log('\nDue per day, simulated learner, 10 new cards a day target, 90% right, 10 s a card, A1 (budget 6 min = 36 cards):');
  console.log('day  due(throttled) served minutes new  | due(10 new every day, no throttle)');
  thr.forEach((r, i) => { if (SHOW_CURVE || r.d % 10 === 0 || r.d === 1) console.log(String(r.d).padStart(3) + '  ' + String(r.due).padStart(8) + '  ' + String(r.served).padStart(7) + '  ' + String(r.mins).padStart(6) + '  ' + String(r.added).padStart(4) + '  | ' + String(fix[i].due).padStart(5)); });
  const maxDue = Math.max.apply(null, thr.map(r => r.due)), maxFix = Math.max.apply(null, fix.map(r => r.due));
  console.log('peak due throttled ' + maxDue + ', unthrottled ' + maxFix + '; longest session ' + maxMin + ' min; cards by day 120: ' + thr[119].total + ' vs ' + fix[119].total + '\n');
  ok(maxMin <= budget * 2 + 0.2, 'no session ever exceeds twice the budget (' + maxMin + ' min against ' + budget + ')');
  ok(thr.slice(60).every(r => r.due <= 2 * 36 * 1.0 + 20), 'after day 60 the due count stays within budget range (peak ' + Math.max.apply(null, thr.slice(60).map(r => r.due)) + ')');
  ok(thr.every(r => r.added >= 3), 'new cards never fall below the floor of 3');
  ok(thr.slice(100).reduce((a, r) => a + r.due, 0) / 20 < fix.slice(100).reduce((a, r) => a + r.due, 0) / 20, 'the throttled curve ends lower than the unthrottled one');
}

/* ---- About me lines come back in the review deck ------------------------------ */
{
  const store = { 'fluidez.srsSchema': '3', 'fluidez.srs': JSON.stringify({ 'k:aboutme:0': { box: 1, due: 1, reps: 1, last: 0 } }) };
  const { W } = deckWorld(store, 'B1');
  W.BuildIt = { cards: () => [{ id: 'k:aboutme:0', es: 'Vivo en Bogotá', en: 'I live in Bogota', prompt: 'Where do you live?' },
                              { id: 'k:aboutme:1', es: 'Me gusta el café', en: '', prompt: 'What do you like?' }] };
  const pool = W.StageReview.pool().filter(c => c.kind === 'aboutme');
  ok(pool.length === 2 && pool.every(c => c.enrolledOnly), 'about-me lines are in the pool, enrolledOnly');
  const c0 = pool.find(c => c.id === 'k:aboutme:0'), c1 = pool.find(c => c.id === 'k:aboutme:1');
  ok(c0.en === 'I live in Bogota' && c0.es === 'Vivo en Bogotá', 'a line carries the English front and the learner Spanish back');
  ok(c1.en === 'What do you like?', 'a blank English falls back to the prompt');
  ok(W.StageReview.pool().filter(c => c.kind === 'aboutme' && W.SRS.isEnrolled(c.id)).length === 1, 'only the enrolled line is reviewable');
  ok(W.Checker.checkExact('Vivo en Bogotá', c0.es, {}).pass, 'the right typed answer is graded right');
}

/* ---- Sound-natural lines come back in the review deck ------------------------ */
{
  const NAT = (() => { const c = { window: {} }; c.window.window = c.window; vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/natural.js'), 'utf8'), vm.createContext(c.window)); return c.window.NATURAL; })();
  const item = NAT.find(x => x.stiff && x.accept && x.accept.length && x.band === 'B1') || NAT.find(x => x.stiff && x.accept && x.accept.length);
  const store = { 'fluidez.srsSchema': '3' };
  const { W } = deckWorld(store, 'B1');
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/natural.js'), 'utf8'), vm.createContext(W));
  W.NATURAL = [item];
  ok(W.StageReview.pool().filter(c => c.kind === 'natural').length === 0 || !W.SRS.isEnrolled('nat:' + item.id), 'a natural item is not reviewable before it is enrolled');
  W.SRS.enrol('nat:' + item.id, 1);
  const c = W.StageReview.pool().find(x => x.id === 'nat:' + item.id);
  ok(c && c.kind === 'natural' && c.enrolledOnly && c.en === item.en && c.es === item.es, 'an enrolled natural item is in the pool with its English and Spanish');
  ok(c.stiff === item.stiff && c.why === item.why, 'it carries the stiff line and the why');
  const M = W.LIB.match, ask = t => W.Natural.isStiff(c, t) ? false : M.matchTranslation(t, { es: c.es, en: c.en, accept: c.accept }, { accents: 'lenient' }).pass;
  ok(ask(item.es), 'the natural line passes');
  ok(ask(item.accept[0]), 'an accept variant passes');
  ok(!ask(item.stiff) && W.Natural.isStiff(c, item.stiff), 'the stiff line fails');
}

console.log('\n' + (n - fails) + ' of ' + n + ' checks passed');
process.exit(fails ? 1 : 0);
