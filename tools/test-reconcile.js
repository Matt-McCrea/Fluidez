#!/usr/bin/env node
/* ============================================================================
 * test-reconcile.js: a learner keeps their place when the course is re-sequenced, the catch-up queue is
 * served on practice days, and the week's Drill, Output and Review days do what they say.
 *
 *   node tools/test-reconcile.js
 *
 * Fixture: data/course.js when it is the re-sequenced course (its days carry a `kind`), else the proposal
 * at tools/reseq/out/course.proposed.js; data/lesson-aliases.js when it exists, else the proposal's copy.
 * The "old" learners are made against tools/reseq/base/course.pre-reseq.js (the course before the
 * re-sequence): everything before their day studied. docs/plan-2026-11-04/resequence.md "Reconciliation"
 * gives the numbers: old day 60, 150, 300 land at new day 67, 169, 321 with 10, 20, 25 lessons queued.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

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
function seeded(str) { let s = 0; for (const ch of String(str)) s = (s * 31 + ch.charCodeAt(0)) | 0;
  return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
global.UI = {
  seededRandom: seeded, t: (a, b) => b || a, el: (tag, cls, txt) => { const n = node(tag); n.cls = cls || ''; n.textContent = txt || ''; return n; },
  clear(h) { if (h && h.children) h.children.length = 0; }, nextBtn: () => node('button'), shuffle: a => a.slice(),
  sample: (a, n, rng) => { rng = rng || Math.random; const c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c.slice(0, n); },
  pick: (a, rng) => a[Math.floor((rng || Math.random)() * a.length)]
};

const liveCourse = /kind: '(introduce|drill|review)'/.test(read('data/course.js'));
const COURSE_FILE = liveCourse ? 'data/course.js' : 'tools/reseq/out/course.proposed.js';
const aliasFile = fs.existsSync(path.join(ROOT, 'data/lesson-aliases.js')) ? 'data/lesson-aliases.js' : 'tools/reseq/out/lesson-aliases.proposed.js';
const FILES = ['data/taxonomy.js', 'data/connectors.js', 'data/verbs.js', 'data/vocab.js', 'data/idioms.js',
  'data/grammar-docs.js', 'data/grammar.js', 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js',
  'data/strand-lessons.js', COURSE_FILE, 'data/resources.js', 'js/engine.js', 'js/lessons.js', 'js/checker.js',
  'js/srs.js', 'js/profile.js', 'js/curriculum.js', 'js/lexmatch.js', 'js/focus.js', 'js/unitcheck.js', 'js/hub.js',
  'data/graph.js', 'data/requires.js', 'data/lesson-nodes.js'];
FILES.forEach(f => (0, eval)(read(f)));
(0, eval)(read(aliasFile));
window.LESSON_ALIASES = window.LESSON_ALIASES || window.LESSON_ALIASES_PROPOSED;
(0, eval)(read('js/lib.bundle.js') + '\n;globalThis.LIB = LIB;');
(0, eval)(read('js/known.js'));
const SESSION_SRC = read('js/session.js');
console.log('fixture: ' + COURSE_FILE + ' (' + window.COURSE_DAYS.length + ' days), aliases ' + aliasFile + ' (' + Object.keys(window.LESSON_ALIASES).length + ')');

let live = null;
['Review', 'Learn', 'Comprehend', 'Apply', 'Produce'].forEach(k => {
  window['Stage' + k] = { key: k.toLowerCase(), icon: '*', run: (host, ctx, done) => { live = { key: k.toLowerCase(), ctx, done, step: ctx.step }; } };
});
let hostNode = null;
document.getElementById = () => (hostNode = hostNode || node('div'));
function reload() { live = null; hostNode = null; (0, eval)(SESSION_SRC); return window.Session; }
const prog = () => JSON.parse(store['fluidez.progress'] || '{}');
function setProg(o) { store['fluidez.progress'] = JSON.stringify(o); }
function walk(o) { return (o.children || []).reduce((a, c) => a.concat([c], walk(c)), []); }
let n = 0, fails = 0;
function ok(c, m) { n++; if (!c) { fails++; console.log('FAIL  ' + m); } else console.log('ok    ' + m); }
function finishDay() { let g = 0; while (g++ < 8 && live && store['fluidez.session']) live.done(); }

const D = window.COURSE_DAYS, B = window.COURSE_BANDS;
const OLD = (() => { const w = {}; new Function('window', read('tools/reseq/base/course.pre-reseq.js'))(w); return w; })();
function oldLearner(day) {
  const studied = {}; for (let k = 0; k < day; k++) if (OLD.COURSE_DAYS[k].lesson) studied[OLD.COURSE_DAYS[k].lesson] = 1;
  return { studied, beginnerDay: day - OLD.COURSE_BANDS[OLD.COURSE_DAYS[day].band], courseSig: 'old', band: OLD.COURSE_DAYS[day].band };
}

/* ---- 1. the three learners of the report ------------------------------------------------------ */
reload();
const S0 = window.Session;
const EXPECT = { 60: [67, 10], 150: [169, 20], 300: [321, 25] };
const canon = window.Lessons.canon;
Object.keys(EXPECT).forEach(k => {
  const o = oldLearner(+k), r = S0._reconcile({ studied: o.studied });
  ok(r.position === EXPECT[k][0], 'old day ' + k + ' lands on new day ' + EXPECT[k][0] + ' (got ' + r.position + ')');
  ok(r.catchUp.length === EXPECT[k][1], 'old day ' + k + ' queues ' + EXPECT[k][1] + ' lessons (got ' + r.catchUp.length + ')');
  const stu = new Set(Object.keys(o.studied).map(canon));
  ok(r.catchUp.every(id => !stu.has(id)), 'old day ' + k + ': nothing queued is studied');
  const at = id => D.findIndex(d => d.lesson && canon(d.lesson) === id);
  ok(r.catchUp.every(id => at(id) >= 0 && at(id) < r.position), 'old day ' + k + ': everything queued sits before the new place');
  ok(r.catchUp.every((id, i) => i === 0 || at(r.catchUp[i - 1]) < at(id)), 'old day ' + k + ': the queue is in spine order');
  const gap = D.findIndex(d => d.lesson && !stu.has(canon(d.lesson)));
  ok(r.position >= gap && r.position > 21, 'old day ' + k + ': never rewound to the first gap (' + gap + ') or the old walk (21)');
});
ok(S0._reconcile({ studied: {} }).position === 0 && S0._reconcile({ studied: {} }).catchUp.length === 0, 'a learner with nothing studied lands on day 0 with an empty queue');

/* ---- 2. through the session: A1 and A2 --------------------------------------------------------- */
[[60, 'A1'], [150, 'A2']].forEach(([old, band]) => {
  store = {}; const o = oldLearner(old);
  setProg({ studied: o.studied, beginnerDay: o.beginnerDay, courseSig: o.courseSig });
  const S = reload(); window.Profile.set(band);
  const t = S.today(), p = prog(), pos = EXPECT[old][0];
  ok(p.courseSig && p.courseSig !== 'old', 'old day ' + old + ': the course fingerprint is rewritten');
  ok(p.beginnerDay >= pos - B[band] && p.beginnerDay < pos - B[band] + 12, 'old day ' + old + ': the counter is at or just past new day ' + pos + ' (' + (B[band] + p.beginnerDay) + ')');
  ok(Array.isArray(p.catchUp) && p.catchUp.length === EXPECT[old][1], 'old day ' + old + ': progress.catchUp holds ' + EXPECT[old][1] + ' lessons');
  ok(t && t.unit, 'old day ' + old + ': Home names a unit');
  const keep = JSON.stringify(p.catchUp), bd = p.beginnerDay;
  S.today(); S.today();
  ok(JSON.stringify(prog().catchUp) === keep && prog().beginnerDay === bd, 'old day ' + old + ': reconciles once, not on every read');
  Object.keys(o.studied).forEach(id => { if (!prog().studied[id]) ok(false, 'a studied mark was dropped: ' + id); });
  const merged = Object.keys(o.studied).filter(id => window.LESSON_ALIASES[id] && window.Lessons.byId(window.LESSON_ALIASES[id]));
  ok(merged.every(id => prog().studied[window.LESSON_ALIASES[id]]), 'old day ' + old + ': studied alias sources are studied on their targets (' + merged.length + ')');
});

/* a learner with nothing studied */
store = {}; let S = reload(); window.Profile.set('A1');
S.today();
ok(!prog().beginnerDay && !(prog().catchUp || []).length, 'a brand-new learner starts at day 0 with nothing to catch up');
/* a placed learner keeps the counter placement wrote */
store = {}; setProg({ studied: oldLearner(0).studied, beginnerDay: 0 });
{
  const placeAt = D.findIndex(d => d.kind === 'review') + 2, st = {};
  for (let i = 0; i < placeAt; i++) if (D[i].lesson) st[D[i].lesson] = 1;
  setProg({ studied: st, beginnerDay: placeAt });
  S = reload(); window.Profile.set('A1'); S.today();
  ok(prog().beginnerDay >= placeAt && !(prog().catchUp || []).length, 'a placed learner (never fingerprinted) is not moved back (' + placeAt + ' to ' + prog().beginnerDay + ')');
}

/* ---- 3. the catch-up queue is served on practice days ------------------------------------------- */
store = {}; {
  const o = oldLearner(60);
  setProg({ studied: o.studied, beginnerDay: o.beginnerDay, courseSig: 'old' });
  S = reload(); window.Profile.set('A1'); S.today();
  const queue = prog().catchUp.slice();
  const servable = q => q.filter(id => window.Lessons.byId(id));
  ok(servable(queue).length >= 1, 'the queue holds ' + servable(queue).length + ' lessons that exist and ' + (queue.length - servable(queue).length) + ' still to be written');
  // park the counter on the first practice day at or after the learner's place
  let di = prog().beginnerDay; while (D[di] && !D[di].practice) di++;
  const pd = D[di];
  setProg(Object.assign(prog(), { beginnerDay: di }));
  S = reload(); window.Profile.set('A1');
  let up = S.nextUp();
  ok(up && up.lessonId === servable(queue)[0] && up.catchUp && up.kind === 'grammar', 'Next up names the catch-up lesson (' + (up && up.lessonId) + ') on a practice day');
  const c = S._build({});
  ok(c.focus.type === 'grammar' && c.focus.catchUp && c.lesson && c.lesson.id === servable(queue)[0], 'the practice day serves the first existing catch-up lesson as a lesson day');
  ok(c.focus.unit === pd.unit && (!pd.review || c.focus.review), 'the day keeps its unit' + (pd.review ? ' and its review flags' : ''));
  const t = S.today();
  ok(t.lessonTitle === c.lesson.title && t.catchUp === true, 'Home names the lesson');
  // run the session: Learn gets the lesson, finishing marks it studied and drops it from the queue
  S.startAt(di, 'diaria');
  ok(live && live.ctx.lesson && live.ctx.lesson.id === servable(queue)[0], 'the session starts on the catch-up lesson');
  finishDay();
  const p = prog();
  ok(p.studied[servable(queue)[0]] === 1, 'finishing marks the catch-up lesson studied');
  ok(p.catchUp.indexOf(servable(queue)[0]) === -1 && p.catchUp.length === queue.length - 1, 'and drops it from the queue');
  ok(p.beginnerDay === di + 1, 'the day advances');
  // a repeat of that day serves the same lesson, not the next in the queue
  S.repeatToday('diaria');
  ok(live && live.ctx.lesson && live.ctx.lesson.id === servable(queue)[0], 'repeating the day keeps its catch-up lesson');
  finishDay();
  // resume: a saved catch-up session comes back on its lesson
  setProg(Object.assign(prog(), { beginnerDay: di + 1 }));
  let nd = di + 1; while (D[nd] && !D[nd].practice) nd++;
  setProg(Object.assign(prog(), { beginnerDay: nd }));
  S = reload(); window.Profile.set('A1'); S.start('diaria');
  const second = live.ctx.lesson && live.ctx.lesson.id;
  ok(second && second === servable(queue)[1], 'the next practice day serves the next one (' + second + ')');
  S = reload(); window.Profile.set('A1'); S.resume();
  ok(live && live.ctx.lesson && live.ctx.lesson.id === second, 'a resumed catch-up session comes back on the same lesson');
  discard();
  // an empty queue: practice days behave as before
  setProg(Object.assign(prog(), { catchUp: [], beginnerDay: nd }));
  S = reload(); window.Profile.set('A1');
  const e = S._build({});
  ok(e.focus.type === 'practice' && !e.lesson && !S.today().catchUp, 'with the queue empty a practice day is a practice day');
  // quick sessions have no Learn stage and never convert
  setProg(Object.assign(prog(), { catchUp: queue, beginnerDay: nd }));
  S = reload(); window.Profile.set('A1'); S._setMode('rapido');
  ok(S._build({}).focus.type === 'practice', 'a quick session does not serve the queue');
}
function discard() { delete store['fluidez.session']; }

/* ---- 4. the shape of the week ---------------------------------------------------------------- */
if (D.some(d => d.kind)) {
  store = {}; setProg({ beginnerDay: 0 });
  const drill = D.findIndex(d => d.drill && d.band === 'A1' && d.unit !== D[0].unit);
  const K = window.Known;
  ok(drill > 0 && D[drill].kind === 'drill', 'the course has drill days (day ' + drill + ' is ' + D[drill].kind + ')');
  // the week's Introduce lesson leads the drill day's nodes
  const u = window.COURSE_UNITS[D[drill].unit];
  const intro = K.introLesson({ type: 'practice', unit: D[drill].unit }, drill);
  ok(intro && D[u.from].lesson === intro, 'the drill day finds the unit\'s Introduce lesson (' + intro + ')');
  const nodes = [...K.todayNodes({ type: 'practice', unit: D[drill].unit, drill: true }, drill)], first = [...K.introNodes({ type: 'practice', unit: D[drill].unit }, drill)];
  ok(first.length ? first.every((x, i) => nodes[i] === x) : true, 'Known.todayNodes puts the Introduce lesson\'s nodes first (' + first.length + ')');
  setProg({ beginnerDay: drill, catchUp: [], courseSig: null }); S = reload(); window.Profile.set('A1');
  let t = S.today(), c = S._build({});
  ok(c.focus.type === 'practice' && c.focus.drill && c.focus.kind === 'drill', 'a drill day carries its kind through the curriculum');
  ok(/^Drill/.test(t.lessonTitle) && (!intro || t.lessonTitle.indexOf(window.Lessons.byId(intro).title) > 0) && t.kindLabel === 'Drill', 'Home says "Drill" and the lesson it drills: ' + t.lessonTitle);
  ok(!/[—–]/.test(t.lessonTitle) && !/ - /.test(t.lessonTitle), 'no dashes in the label');
  // output and review labels
  const outP = D.findIndex(d => d.output && d.practice), out = D.findIndex(d => d.kind === 'output' && d.band === 'A1' && d.unit !== D[0].unit && !d.write), rev = D.findIndex(d => d.review && d.check && d.band === 'A1');
  [[outP, 'Output'], [rev, 'Review']].forEach(([di, word]) => {
    if (di < 0) { console.log('note: no ' + word + ' practice day in the course'); return; }
    setProg({ beginnerDay: di, catchUp: [], courseSig: null }); S = reload(); window.Profile.set('A1');
    const tt = S.today();
    ok(tt.lessonTitle === word && tt.kindLabel === word, 'a ' + word.toLowerCase() + ' practice day is labelled ' + word);
  });
  // an output day leads Produce with the unit's writing task
  if (out >= 0 && window.WRITING_TASKS.length) {
    const wt = window.WRITING_TASKS.find(w => w.type === 'write') || window.WRITING_TASKS[0], ud = D[out].unit, un = window.COURSE_UNITS[ud];
    const was = D[un.from].write; D[un.from].write = wt.id;
    setProg({ beginnerDay: out, catchUp: [], courseSig: null }); S = reload(); window.Profile.set('A1');
    const co = S._build({});
    ok(co.writeTasks[0] && co.writeTasks[0].id === wt.id && co.writeTasks[0].authored, 'an output day leads Produce with the unit\'s writing task');
    if (was === undefined) delete D[un.from].write; else D[un.from].write = was;
  }
  // a review day is the unit's last day: the Unit done card (with the unit check) shows on it
  if (rev >= 0) {
    const ru = window.COURSE_UNITS[D[rev].unit];
    ok(rev === ru.from + ru.length - 1, 'the review day is the unit\'s last day');
    setProg({ beginnerDay: rev, catchUp: [], courseSig: null }); S = reload(); window.Profile.set('A1');
    S.startAt(rev, 'diaria'); finishDay();
    ok(prog().unitsDone && prog().unitsDone[D[rev].unit], 'finishing the review day records the unit done');
    ok(walk(hostNode || node('div')).some(x => /unit-done-card/.test(x.cls || '')), 'and shows the Unit done card');
    // re-drive 4: the review day is served even when every lesson of the week is already studied
    // (it always is by then); only a unit cleared by hand or by unit check is stepped over
    const allSt = {}; D.slice(0, rev + 1).forEach(d => { if (d.lesson) allSt[d.lesson] = 1; });
    setProg({ beginnerDay: rev, catchUp: [], courseSig: null, studied: allSt }); S = reload(); window.Profile.set('A1'); S.today();
    // the counter is in this layout now (the fingerprint is written); put it on the review day
    setProg(Object.assign({}, prog(), { beginnerDay: rev, catchUp: [] })); S = reload(); window.Profile.set('A1');
    let tr = S.today();
    ok(tr.kindLabel === 'Review' && tr.lessonTitle === 'Review', 'a review day whose lessons are all studied is still served: ' + tr.lessonTitle);
    ok(window.UnitCheck.testable(ru), 'the unit check has questions to ask on that card (' + window.UnitCheck.questions(ru, Math.random).length + ')');
    window.UnitCheck.setUnit(ru, true); S = reload(); window.Profile.set('A1');
    tr = S.today();
    ok(prog().unitsCleared && prog().unitsCleared[ru.id] && (prog().beginnerDay > rev || tr.lessonTitle !== 'Review'), 'a unit cleared by hand steps over its review day: ' + tr.lessonTitle);
  }
} else console.log('note: the fixture course has no day kinds, week-shape checks skipped');

console.log('\n' + (n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
