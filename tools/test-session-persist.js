#!/usr/bin/env node
/* ============================================================================
 * test-session-persist.js — does a session survive a reload, and does the day
 * only count once the session is finished?
 *
 *   node tools/test-session-persist.js
 *
 * Loads the app's own data and js/session.js (re-evaluated for each "reload")
 * against a fake localStorage and a stub DOM. The five stage views are
 * replaced by stubs that record what they were handed and wait to be told to
 * finish, so the test drives stage and step positions directly.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

let store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.window = global;
global.location = { search: '', hash: '' }; Object.defineProperty(global, 'navigator', { value: { language: 'en' }, configurable: true });
function node() {
  const n = { style: {}, children: [], classList: { add() {}, remove() {} }, appendChild(c) { n.children.push(c); return c; },
              addEventListener() {}, setAttribute() {}, innerHTML: '', textContent: '' };
  return n;
}
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
  'data/strand-lessons.js', 'data/course.js', 'data/resources.js', 'js/engine.js', 'js/lessons.js', 'js/checker.js',
  'js/srs.js', 'js/profile.js', 'js/curriculum.js', 'js/lexmatch.js', 'js/focus.js', 'js/unitcheck.js',
  'data/graph.js', 'data/requires.js', 'data/lesson-nodes.js'];
FILES.forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
// node gating (js/known.js) needs the library bundle's graph functions
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/known.js'), 'utf8'));
const SESSION_SRC = fs.readFileSync(path.join(ROOT, 'js/session.js'), 'utf8');
window.Profile.set('A1');

// stage stubs: remember the live run so the test can finish it
let live = null;
['Review', 'Learn', 'Comprehend', 'Apply', 'Produce'].forEach(k => {
  window['Stage' + k] = { key: k.toLowerCase(), icon: '*', run: (host, ctx, done) => { live = { key: k.toLowerCase(), ctx, done, step: ctx.step }; } };
});
function reload() { live = null; (0, eval)(SESSION_SRC); return window.Session; }
const prog = () => JSON.parse(store['fluidez.progress'] || '{}');
const rec = () => (store['fluidez.session'] ? JSON.parse(store['fluidez.session']) : null);

let fails = 0, n = 0;
function ok(cond, msg) { n++; if (!cond) { fails++; console.log('FAIL  ' + msg); } else console.log('ok    ' + msg); }
function finishStage() { const d = live.done; d(); }

/* ---- 1. save after a step, studied not set until completion --------------- */
reload();
let S = window.Session;
ok(!S.isActive(), 'fresh install: no session active');
S.start('diaria');
ok(rec() && rec().stageIdx === 0 && rec().mode === 'diaria', 'start writes a record at stage 0');
const lessonId = live.ctx.lesson && live.ctx.lesson.id;
ok(!!lessonId, 'day 1 is a grammar lesson (' + lessonId + ')');
finishStage(); ok(live.key === 'learn' && rec().stageIdx === 1, 'finishing a stage saves the next one');
finishStage(); ok(live.key === 'comprehend', 'learn finished');
ok(!(prog().studied || {})[lessonId] && !prog().beginnerDay, 'after Learn: lesson NOT studied, day NOT advanced');
finishStage(); ok(live.key === 'apply', 'at apply');
ok(!(prog().studied || {})[lessonId], 'still not studied at apply');
live.step.save(2, { correct: 1 });
ok(rec().stageIdx === 3 && rec().stepIdx === 2 && rec().answers.apply.correct === 1, 'step save persists stage, step and answers');
ok(rec().snap.lessonId === lessonId && Array.isArray(rec().snap.applyIx), 'record keeps lesson id and chosen item ids');
const before = { passage: live.ctx.passage && live.ctx.passage.id, apply: rec().snap.applyIx.join(','), writes: rec().snap.writeIds.join(',') };

/* ---- 2. reload resumes the same lesson, stage and step ---------------------- */
S = reload();
ok(S.isActive() && S.hasSavedSession(), 'after reload: a session is pending');
ok(S.mode().key === 'diaria', 'mode comes back from the record');
S.resume();
ok(live && live.key === 'apply', 'resume lands on the saved stage');
ok(live.ctx.lesson.id === lessonId, 'resume rebuilds the same lesson');
ok((live.ctx.passage && live.ctx.passage.id) === before.passage, 'resume rebuilds the same passage');
ok(live.step.at === 2 && live.step.extra.correct === 1, 'resume hands the stage its step and answers');
const ai = window.APPLY_ITEMS;
ok(live.ctx.applyItems.map(x => ai.indexOf(x)).join(',') === before.apply, 'same apply items in the same order');
ok(live.ctx.writeTasks.map(t => t.id).join(',') === before.writes, 'same writing tasks in the same order');

/* ---- 3. a record from a previous day is discarded -------------------------- */
const old = rec(); old.startedDay -= 1; store['fluidez.session'] = JSON.stringify(old);
S = reload();
ok(!S.isActive() && !S.hasSavedSession(), 'yesterday\'s record is not active');
ok(rec() === null, 'yesterday\'s record is removed');

/* ---- 4. completion clears the record and only then marks studied ------------ */
S.start('diaria');
const todaysLesson = live.ctx.lesson.id, origPassage = live.ctx.passage && live.ctx.passage.id;
let guard = 0; while (guard++ < 10 && live && !(prog().studied || {})[todaysLesson]) { const k = live.key; finishStage(); if (k === 'produce') break; }
ok(rec() === null, 'completion clears the session record');
ok((prog().studied || {})[todaysLesson] === 1, 'completion marks the lesson studied');
ok(prog().beginnerDay === 1, 'completion advances the day by one');
const hist1 = (prog().history || []).length, total1 = prog().total;

/* ---- 5. do it again repeats today, counted nowhere -------------------------- */
S.repeatToday('diaria');
ok(live.key === 'review' && live.ctx.lesson.id === todaysLesson, 'repeat serves today\'s lesson, not tomorrow\'s');
ok(live.ctx.repeat === true, 'repeat is marked');
const passage1 = live.ctx.passage && live.ctx.passage.id;
ok(passage1 === origPassage, 'repeat uses the same passage as the session it repeats');
guard = 0; while (guard++ < 10 && live && rec()) { finishStage(); }
ok(prog().beginnerDay === 1 && (prog().history || []).length === hist1 && prog().total === total1, 'repeat does not advance the day or double-count history/total');
ok(rec() === null, 'repeat completion clears the record too');

/* ---- 6. next up names the lesson it starts ---------------------------------- */
const up = S.nextUp();
ok(up && up.di === prog().beginnerDay, 'nextUp names the day the counter points at (no off-by-one)');
S.startAt(up.di, 'diaria');
if (up.kind === 'grammar') ok(live.ctx.lesson && live.ctx.lesson.id === up.lessonId, 'startAt opens exactly the lesson nextUp named');
else ok(live.ctx.focus === up.focus || live.ctx.focus.type === up.kind, 'startAt opens the day nextUp named');

/* ---- 7. quick modes never mark a lesson studied ----------------------------- */
store = {}; S = reload();
S.start('rapido'); const rl = live.ctx.lesson && live.ctx.lesson.id;
guard = 0; while (guard++ < 5 && live && rec()) finishStage();
ok(!(prog().studied || {})[rl] && !prog().beginnerDay, 'rapido completion: not studied, day not advanced');
S.start('corto'); const cl = live.ctx.lesson && live.ctx.lesson.id;
guard = 0; while (guard++ < 5 && live && rec()) finishStage();
ok(!(prog().studied || {})[cl] && !prog().beginnerDay, 'corto completion: not studied, day not advanced');

/* ---- 8. skip clears the saved session ---------------------------------------- */
store = {}; S = reload(); S.start('diaria');
ok(!!rec(), 'session saved before skip');
S.skipLesson();
ok(rec() === null || !S.isActive(), 'skip discards the saved session');

/* ---- 9. no monotony runs ----------------------------------------------------- */
const shape = x => x.t;
const mk = s => s.split('').map(t => ({ t }));
function maxRun(a) { let m = 0, r = 0, l = null; a.forEach(x => { r = x.t === l ? r + 1 : 1; l = x.t; m = Math.max(m, r); }); return m; }
const rot = S.breakRuns(mk('aaaaaaaabbc'), shape, 4);
ok(rot.length === 11 && maxRun(rot) <= 4, 'breakRuns caps a run of eight at four when other shapes exist');
ok(S.breakRuns(mk('aabb'), shape, 4).map(shape).join('') === 'aabb', 'breakRuns leaves short runs in order');
ok(S.breakRuns(mk('aaaaaa'), shape, 4).length === 6, 'breakRuns keeps every card when nothing else can rotate in');
let worst = 0;
for (let i = 0; i < 40; i++) { S.start('larga'); worst = Math.max(worst, maxRun(live.ctx.applyItems.map(x => ({ t: x.type }))), maxRun(live.ctx.writeTasks.map(x => ({ t: x.type })))); }
ok(worst <= 4, 'long sessions: longest run of one shape is ' + worst);

/* ---- 10. a lesson that lives in a band file the learner has not loaded ---------
 * Ten A1 course days carry lessons from data/lessons/a2.js. With only the A1 file loaded and a stub
 * loader standing in for Lessons.ensureLesson, the day must be built WITH its lesson; when the loader
 * fails, the day runs as a practice day and says so in ctx.gaps. */
{
  const saved = { SL: window.STRAND_LESSONS, L: window.Lessons, GL: window.GRAMMAR_LESSONS, AL: window.ALL_LESSONS };
  delete window.STRAND_LESSONS; delete window.STRAND_LESSONS_A1; delete window.STRAND_LESSONS_A2;
  ['data/lessons/index.js', 'data/lessons/a1.js', 'js/lessons.js'].forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  let real = window.Lessons;
  const dayz = window.COURSE_DAYS, ixs = [];
  dayz.forEach((d, i) => { if (d.band === 'A1' && d.lesson && window.LESSONS_INDEX.ids[d.lesson] === 'A2') ixs.push(i); });
  ok(ixs.length >= 1, 'some A1 course days carry A2 lessons (' + ixs.length + ')');
  const probe = ixs[0];
  ok(!!probe && !real.bandOf || real.bandOf(dayz[probe].lesson) === 'A2', 'bandOf answers from the index map (' + dayz[probe].lesson + ' is A2)');
  const have = id => (window.GRAMMAR_LESSONS || []).some(l => l.id === id);
  ok(!have(dayz[probe].lesson), 'with only the A1 file loaded the A2 lesson is absent');
  window.Profile.set('A1');
  let loaded = false;
  const stub = good => Object.assign({}, real, { ensureLesson: (id, cb) => {
    if (good && !loaded) { loaded = true; (0, eval)(fs.readFileSync(path.join(ROOT, 'data/lessons/a2.js'), 'utf8')); real.rebuild(); }
    cb(good);
  } });
  let allIn = true;
  ixs.forEach(i => {
    store = {}; loaded = false; window.Lessons = stub(true);
    reload(); live = null; window.Session.startAt(i, 'diaria');
    if (!(live && live.ctx.lesson && live.ctx.lesson.id === dayz[i].lesson)) { allIn = false; console.log('   day ' + i + ' ' + dayz[i].lesson + ' has no lesson'); }
  });
  ok(allIn, 'every one of those days builds with its lesson once the stub loader has fetched the band');
  // the loader failing (offline): a practice day with a note, and the miss logged
  delete window.STRAND_LESSONS_A2; delete window.STRAND_LESSONS;
  (0, eval)(fs.readFileSync(path.join(ROOT, 'js/lessons.js'), 'utf8')); real = window.Lessons;     // a fresh loader that has only A1
  store = {}; window.Lessons = stub(false);
  reload(); live = null; window.Session.startAt(probe, 'diaria');
  ok(live && !live.ctx.lesson && live.ctx.focus.type === 'practice' && !!live.ctx.focus.note, 'loader failure: the day runs as a practice day with a one-line note');
  ok(live && live.ctx.gaps.some(g => g.kind === 'lesson-unloaded'), 'loader failure: ctx.gaps carries {kind:"lesson-unloaded"}');
  window.Lessons = saved.L;
}

console.log('\n' + (n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
