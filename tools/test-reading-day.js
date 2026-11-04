#!/usr/bin/env node
/* ============================================================================
 * test-reading-day.js — the serial on reading days, the five-minute day, and
 * the five-minute day and success-steered new cards.
 *
 *   node tools/test-reading-day.js
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
  'data/graph.js', 'data/requires.js', 'data/lesson-nodes.js', 'data/story/index.js', 'data/story/a1.js'];
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
// Known: the real thing, with the learner's set overridable so coverage is controlled
let KNOWN = null;
const realFor = window.Known.forLearner;
window.Known.forLearner = (p, di) => KNOWN || realFor(p, di);

const dayNow = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
const bandStart = window.Curriculum.startOf('A1');
const DAYS = window.COURSE_DAYS, UNITS = window.COURSE_UNITS;
const u01 = UNITS['a1-u01'];
// independent statement of the rule
function expectedReadingDay(u) {
  const last = u.from + u.length - 1;
  if (u.length < 3) return last;
  for (let i = u.from + 2; i <= last; i++) if (DAYS[i].lesson) return i;
  return last;
}
function coverageSet(ch, share) {   // a known set covering `share` of the chapter's lemmas
  const lem = ch.lemmas, k = Math.round(lem.length * share), s = new Set();
  const small = (window.LIB && window.LIB.gloss && window.LIB.gloss.SMALL_WORDS) || {};
  const gl = new Set(); (ch.gloss || []).forEach(g => (String(g.es).toLowerCase().match(/\p{L}+/gu) || []).forEach(w => gl.add(w)));
  const free = lem.filter(l => small[l] || gl.has(l)), paid = lem.filter(l => !(small[l] || gl.has(l)));
  // the free ones count regardless; add paid ones until the share is met
  let have = free.length;
  for (const l of paid) { if (have >= k) break; s.add('l:' + l); have++; }
  return s;
}
let S, guard;
const live0 = () => live;

/* ---- 1. where the reading day falls -------------------------------------- */
store = {}; S = reload();
const want = expectedReadingDay(u01);
let hits = [];
for (let i = u01.from; i < u01.from + u01.length; i++) if (S._isReadingDay(i)) hits.push(i);
ok(hits.length === 1 && hits[0] === want, 'a1-u01 has exactly one reading day, day ' + (want - u01.from + 1) + ' of ' + u01.length);
ok(want - u01.from >= 2, 'the reading day is the third day or later');
let allUnits = Object.keys(UNITS).filter(id => !UNITS[id].optional && UNITS[id].from != null);
const bad = allUnits.filter(id => { const u = UNITS[id], h = []; for (let i = u.from; i < u.from + u.length; i++) if (S._isReadingDay(i)) h.push(i); return h.length !== 1 || h[0] !== expectedReadingDay(u); });
ok(bad.length === 0, 'every unit has exactly one reading day, as specified (' + allUnits.length + ' units' + (bad.length ? ', bad: ' + bad.slice(0, 3) : '') + ')');
const short = allUnits.filter(id => UNITS[id].length < 3);
ok(short.every(id => S._isReadingDay(UNITS[id].from + UNITS[id].length - 1)), 'units shorter than 3 days read on their last day (' + short.length + ' such)');

/* ---- 2. enough coverage: the chapter is served and marked read -------------- */
const ch1 = window.STORY_A1[0];
const rdi = want - bandStart;     // the band-relative day index the session pins
KNOWN = coverageSet(ch1, 0.95);
let c = S._build({ seed: 1, over: { di: rdi } });
ok(c.dayIndex === want, 'test pins the reading day (dayIndex ' + c.dayIndex + ')');
ok(c.chapter && c.chapter.id === 'ch001' && c.chapter.part === 0, 'reading day serves the first unread chapter');
ok(!c.gaps.some(g => g.kind && /^chapter/.test(g.kind)), 'no chapter gap logged when coverage is enough');
ok(c.chapter.coverage >= 0.85, 'coverage ' + c.chapter.coverage.toFixed(2) + ' meets the A1 target');
let off = S._build({ seed: 1, over: { di: rdi - 1 } });
ok(!off.chapter && off.passage, 'a non-reading day serves a passage');
S._markRead('ch001', ch1.parts[0].text, { part: 0, parts: ch1.parts.length });
ok(prog().chaptersRead && prog().chaptersRead.ch001 === dayNow(), 'chaptersRead is marked with the day');
ok(prog().wordsRead >= ch1.parts[0].text.split(/\s+/).filter(Boolean).length, 'wordsRead counts the part');
store['fluidez.progress'] = JSON.stringify(Object.assign(prog(), { chapterDay: 0 }));

/* ---- 3. under coverage but within 0.10: served with a gap; further: waiting -- */
const ch2 = window.STORY_A1[1];
KNOWN = coverageSet(ch2, 0.80);
const cov2 = S._build({ seed: 1, over: { di: rdi } }).chapter;
ok(cov2 && cov2.id === 'ch002' && cov2.coverage < 0.85 && cov2.coverage >= 0.75, 'ch002 at ' + (cov2 && cov2.coverage.toFixed(2)) + ' is served (within 0.10 of 0.85)');
c = S._build({ seed: 1, over: { di: rdi } });
ok(c.gaps.some(g => g.kind === 'chapter-under-coverage'), 'a chapter-under-coverage gap is logged');
KNOWN = coverageSet(ch2, 0.55);
c = S._build({ seed: 1, over: { di: rdi } });
ok(!c.chapter && c.passage, 'further below target: the day falls back to a passage');
ok(c.gaps.some(g => g.kind === 'chapter-waiting'), 'a chapter-waiting gap is logged');

/* ---- 4. parts advance across two reading days ------------------------------- */
const fake = { id: 'chT', unit: 'u01', n: 0, title: 'Two parts', band: 'A1', words: 20, lemmas: [], gloss: [],
  parts: [{ text: 'Uno dos tres.', questions: [{ q: 'q?', options: ['a', 'b', 'c'], answer: 1 }], recap: null, hook: null },
          { text: 'Cuatro cinco seis.', questions: [], recap: 'Before: uno.', hook: 'Next: siete.' }] };
window.STORY_A1.unshift(fake);
window.STORY_INDEX.unshift({ id: 'chT', unit: 'u01', band: 'A1', title: 'Two parts', words: 20, parts: 2, file: 'data/story/a1.js' });
store = {}; KNOWN = new Set();
c = S._build({ seed: 1, over: { di: rdi } });
ok(c.chapter && c.chapter.id === 'chT' && c.chapter.part === 0, 'day one serves part 1 of the chapter');
S._markRead('chT', fake.parts[0].text, { part: 0, parts: 2 });
ok(prog().chapterParts.chT === 1 && !(prog().chaptersRead || {}).chT, 'after part 1: the chapter is not yet read');
c = S._build({ seed: 1, over: { di: rdi } });
ok(!c.chapter, 'a second part is not served on the same day');
store['fluidez.progress'] = JSON.stringify(Object.assign(prog(), { chapterDay: dayNow() - 7 }));
c = S._build({ seed: 1, over: { di: rdi } });
ok(c.chapter && c.chapter.id === 'chT' && c.chapter.part === 1, 'the next reading day serves part 2');
S._markRead('chT', fake.parts[1].text, { part: 1, parts: 2 });
ok((prog().chaptersRead || {}).chT === dayNow(), 'after the last part the chapter is read');
window.STORY_A1.shift(); window.STORY_INDEX.shift();

/* ---- 4b. the real known set: a learner who has done every day to the reading day near day 60 */
store = {}; KNOWN = null; S = reload();
let r60 = bandStart + 60; while (!S._isReadingDay(r60)) r60++;
const studied60 = {}; for (let i = 0; i <= r60; i++) if (DAYS[i].lesson) studied60[DAYS[i].lesson] = 1;
const read60 = {}; for (let i = 1; i <= 10; i++) read60['ch' + String(i).padStart(3, '0')] = dayNow() - 3;
store['fluidez.progress'] = JSON.stringify({ studied: studied60, chaptersRead: read60, beginnerDay: r60 - bandStart });
c = S._build({ seed: 1, over: { di: r60 - bandStart } });
ok(c.dayIndex === r60 && c.chapter && c.chapter.id === 'ch011', 'real known set at A1 day ' + (r60 - bandStart) + ': the next unread chapter (ch011) is served');
ok(c.chapter && c.chapter.coverage >= 0.85 && !c.gaps.some(g => /^chapter/.test(g.kind)), 'its coverage ' + (c.chapter && c.chapter.coverage.toFixed(2)) + ' meets the A1 target, no gap');
const cov0 = (function () { const k = window.Known.forLearner({ studied: {} }, 0); return k.has('l:día') || k.size > 0; })();
ok(cov0, 'Known.forLearner counts lexemes (cognates and taught words) for a day-0 learner');

/* ---- 4c. a passage is gated by coverage, not by grammar nodes -------------- */
function lemmaSet(text) {
  const out = new Set();
  (String(text).match(/\p{L}+/gu) || []).forEach(t => { const a = window.ENGINE.analyzeToken(t.toLowerCase()); out.add('l:' + ((a && a[0] && a[0].inf) || t.toLowerCase())); });
  return out;
}
function covOf(p, known) {
  const lem = [...lemmaSet(p.text)].map(x => x.slice(2)), gl = new Set();
  (p.gloss || []).forEach(g => (String(g.es).toLowerCase().match(/\p{L}+/gu) || []).forEach(w => gl.add(w)));
  const small = (window.LIB && window.LIB.gloss && window.LIB.gloss.SMALL_WORDS) || {};
  return lem.filter(l => known.has('l:' + l) || gl.has(l) || small[l]).length / lem.length;
}
{
  const realPass = window.PASSAGES;
  window.Profile.set('A1'); store = {}; S = reload();
  // a level-1 passage whose grammar nodes are not taught on day 0, but whose words are all known
  const probe = realPass.filter(p => (p.level || 1) === 1 && !window.Known.allows('passage:' + p.id, realFor({ studied: {} }, 0), window.Known.todayNodes({ type: 'practice' }, 0), 'A1'))[0];
  ok(!!probe, 'there is an A1 passage the node gate would refuse on day 0 (' + (probe && probe.id) + ')');
  window.PASSAGES = [probe, Object.assign({}, probe, { id: 'zz-unknown', text: 'Zzxq wwkj ppqr vvlm nnrt kkpz.', gloss: [] })];
  KNOWN = lemmaSet(probe.text);
  c = S._build({ seed: 1, over: { di: 0 } });
  ok(c.passage && c.passage.id === probe.id, 'A1: the fully covered passage is served although its nodes are untaught');
  ok(!c.gaps.some(g => g.kind === 'ungated' && g.stage === 'comprehend'), 'A1: no node-gate fallback is logged for the passage');
  window.PASSAGES = [Object.assign({}, probe, { id: 'zz-unknown', text: 'Zzxq wwkj ppqr vvlm nnrt kkpz.', gloss: [] })];
  KNOWN = new Set();
  c = S._build({ seed: 1, over: { di: 0 } });
  ok(c.passage && c.gaps.some(g => g.kind === 'passage-waiting'), 'A1: nothing readable yet: the day still has a passage and a passage-waiting gap is logged');
  // the band's own level is preferred from B1; falling lower is logged
  window.Profile.set('B1'); store = {}; S = reload();
  const low = { id: 'zz-low', title: 'Low', level: 1, theme: 'x', tenses: ['presente'], text: 'Hola amigo. Hola mi casa.', gloss: [] };
  const mid = { id: 'zz-mid', title: 'Mid', level: 3, theme: 'x', tenses: ['presente'], text: 'Mi amigo vive en una casa grande.', gloss: [] };
  window.PASSAGES = [low, mid];
  KNOWN = new Set([...lemmaSet(low.text), ...lemmaSet(mid.text)]);
  c = S._build({ seed: 1, over: { di: 0 } });
  ok(c.passage && c.passage.id === 'zz-mid' && !c.gaps.some(g => g.kind === 'passage-below-band'), 'B1: the level-3 passage is served over the level-1 one, nothing logged');
  window.PASSAGES = [low, Object.assign({}, mid, { text: 'Zzxq wwkj ppqr vvlm nnrt kkpz.' })];
  KNOWN = lemmaSet(low.text);
  c = S._build({ seed: 1, over: { di: 0 } });
  ok(c.passage && c.passage.id === 'zz-low' && c.gaps.some(g => g.kind === 'passage-below-band'), 'B1: only a level-1 passage is readable: it is served and passage-below-band is logged');
  window.PASSAGES = realPass; window.Profile.set('A1'); KNOWN = null;
}

/* ---- 5. rapido: reviews plus one beat, counts toward the rhythm only -------- */
store = {}; KNOWN = coverageSet(ch1, 0.95); S = reload();
S.start('rapido');
ok(live.key === 'review' && live.ctx.mode === 'rapido', 'rapido opens on the due reviews');
ok(window.Session.modes()[0].labelEn === 'Five minutes' && /story/.test(window.Session.modes()[0].blurb), 'the short session is "Five minutes" and says what it holds');
finishStage();
ok(live.key === 'comprehend' && live.ctx.chapter && live.ctx.chapter.id === 'ch001', 'then ONE reading beat: the next chapter part');
ok(rec().snap.chapterId === 'ch001' && rec().snap.part === 0, 'the record keeps chapter and part');
S = reload(); S.resume();
ok(live.key === 'comprehend' && live.ctx.chapter.id === 'ch001', 'a reload resumes on the same chapter');
finishStage();
ok(rec() === null, 'rapido ends after the beat');
const pg = prog();
ok(pg.chaptersRead && pg.chaptersRead.ch001, 'the beat marked the chapter read');
ok((pg.history || []).indexOf(dayNow()) !== -1 && pg.lastDay === dayNow(), 'it counts toward the rhythm');
ok(!pg.beginnerDay && !Object.keys(pg.studied || {}).length, 'without advancing the path or studying a lesson');
// a re-read when the chapter is not readable
store = {}; KNOWN = new Set(); S = reload();
const progR = { chaptersRead: { ch001: dayNow() - 17 }, chapterDay: dayNow() - 17 };
store['fluidez.progress'] = JSON.stringify(progR);
S.start('rapido'); finishStage();
ok(live.key === 'comprehend' && live.ctx.reread && live.ctx.reread.id === 'ch001' && !live.ctx.chapter, 'no chapter allowed: a chapter read 17 days ago is re-read');
finishStage();
ok(rec() === null && !((prog().history || []).indexOf(dayNow()) === -1), 'the re-read still counts toward the rhythm');
ok(prog().wordsRead === undefined || prog().wordsRead === 0, 're-reading adds no words read');

/* ---- 5b. Five minutes after a full session: the day just done, nothing unseen marked ---- */
{
  window.Profile.set('A1'); store = {}; KNOWN = coverageSet(ch1, 0.95); S = reload();
  const d0 = dayNow();
  store['fluidez.progress'] = JSON.stringify({ beginnerDay: 4, studied: {}, lastDone: { day: d0, di: 3, lessonId: null }, chapterDay: d0 });
  S._setMode('rapido');
  c = S._build({ seed: 1 });
  ok(c.dayIndex === bandStart + 3, 'rapido after a full session works from the day just done (day ' + (c.dayIndex - bandStart) + ', not 4)');
  store['fluidez.progress'] = JSON.stringify({ beginnerDay: 4, studied: {} });
  S._build({ seed: 1 });                       // writes the course signature
  store['fluidez.progress'] = JSON.stringify(Object.assign(prog(), { beginnerDay: 4 }));
  c = S._build({ seed: 1 });
  ok(c.dayIndex === bandStart + 4, 'rapido with nothing done today builds the counter\'s day');
  S._setMode('rapido');
  const before = Object.assign({}, JSON.parse(store['fluidez.seen'] || '{}'));
  c = S._build({ seed: 1 });
  S._markSeen(c);
  const after = JSON.parse(store['fluidez.seen'] || '{}');
  ok(!Object.keys(after).some(k => /^(apply|writing|bank):/.test(k)), 'rapido marks no Apply or Produce item seen');
  S._setMode('diaria');
  const m0 = S.modes()[0];
  store = {}; S = reload();
  ok(/story/.test(S.modes()[0].blurb), 'Five minutes names the story while a chapter is waiting');
  store['fluidez.progress'] = JSON.stringify({ chaptersRead: Object.fromEntries(window.STORY_INDEX.map(e => [e.id, dayNow()])) });
  ok(S.modes()[0].blurb === 'Due reviews', 'with no chapter part and no re-read the card says Due reviews only');
}

/* ---- 6. success steers difficulty ------------------------------------------- */
const SRS = window.SRS, td = SRS.today();
function logDay(day, rightN, total) {
  const log = []; for (let i = 0; i < total; i++) log.push({ id: 'x' + i, day, ok: i < rightN, gap: null });
  store['fluidez.reviewlog'] = JSON.stringify(log);
}
const tgt = SRS.NEW_TARGET.A1;
store = {}; logDay(td - 1, 7, 10);
let pl = SRS.computePlan(5, 'A1', 8, 0);
ok(pl.steer === 'low' && pl.newCount === SRS.NEW_FLOOR, 'yesterday at 0.70: new-card target is the floor (' + pl.newCount + ')');
logDay(td - 1, 97, 100);
pl = SRS.computePlan(5, 'A1', 8, 0);
ok(pl.steer === 'high' && pl.newCount === tgt + 2 && pl.newCount <= tgt + 4, 'yesterday at 0.97: target rises by 2 (' + pl.newCount + ' from ' + tgt + ')');
logDay(td - 1, 9, 10);
pl = SRS.computePlan(5, 'A1', 8, 0);
ok(pl.steer === null && pl.newCount === tgt, 'yesterday at 0.90: nothing fires');
logDay(td - 1, 2, 5);
pl = SRS.computePlan(5, 'A1', 8, 0);
ok(pl.steer === null && pl.newCount === tgt, 'fewer than 10 reviews: nothing fires');
logDay(td - 2, 1, 20);
pl = SRS.computePlan(5, 'A1', 8, 0);
ok(pl.steer === null, 'only yesterday counts');

/* ---- placed learner: the serial starts in their own band, with a recap card ------ */
{
  (0, eval)(fs.readFileSync(path.join(ROOT, 'data/story/a2.js'), 'utf8'));
  const firstA2 = window.STORY_INDEX.filter(e => e.band === 'A2')[0];
  const a2ch = window.STORY_A2.filter(c => c.id === firstA2.id)[0];
  store = {}; window.Profile.set('A2'); S = reload();
  KNOWN = coverageSet(a2ch, 1);
  S._setMode('rapido');
  const pc = S._build({ seed: 3, over: { di: 0 } });
  ok(pc.chapter && pc.chapter.id === firstA2.id, 'a placed A2 learner with nothing read starts at the first A2 chapter (' + (pc.chapter && pc.chapter.id) + ', not ch001)');
  ok(pc.chapter && typeof pc.chapter.recapLine === 'string' && /Tom/.test(pc.chapter.recapLine) && /Bogot/.test(pc.chapter.recapLine), 'a one-line "story so far" recap precedes it, naming the cast and Bogota');
  ok(S.nextChapterEntry().id === firstA2.id, 'Session.nextChapterEntry answers the same chapter for the library');
  // once chapters are read the serial simply continues
  store['fluidez.progress'] = JSON.stringify({ chaptersRead: { [firstA2.id]: dayNow() } });
  const nx = S.nextChapterEntry();
  ok(nx && nx.id !== firstA2.id && nx.id !== 'ch001', 'after reading one, the next chapter follows (' + (nx && nx.id) + ')');
  // an A1 learner is unchanged
  store = {}; window.Profile.set('A1'); S = reload();
  ok(S.nextChapterEntry().id === 'ch001', 'an A1 learner still starts at chapter 1');
  KNOWN = null;
}

/* ---- placed C1 learner on day 1 reads a C1 passage, not a beginner text -------- */
{
  KNOWN = null;
  const studied = {}, c1 = window.COURSE_BANDS['C1'];
  window.COURSE_DAYS.forEach((d, i) => { if (i < c1 && d.lesson) studied[d.lesson] = 1; });
  store = { 'fluidez.progress': JSON.stringify({ studied }) };
  window.Profile.set('C1'); S = reload();
  const cc = S._build({ seed: 5, over: { di: 0 } });
  if (process.env.DBG) { const k = window.Known.forLearner({studied}, c1); const ps = window.PASSAGES.filter(x => (x.level||1) >= 8); console.log('lvl', cc.level, cc.lesson && cc.lesson.id, cc.lesson && cc.lesson.level, 'C1 pass', ps.length, 'known', k.size, 'band', window.Profile.params().cefr, 'bandstart', c1, JSON.stringify(window.LEVELS.map(l=>l.code))); }
  const lv = cc.passage && (cc.passage.level || 1);
  ok(cc.passage && lv >= 8 && lv <= 10, 'a placed C1 learner on day 1 gets a level 8 to 10 passage (level ' + lv + ', gaps ' + cc.gaps.map(g => g.kind).join(',') + ')');
  ok(!cc.gaps.some(g => g.kind === 'passage-below-band'), 'no passage-below-band is logged for the placed C1 learner');
  window.Profile.set('A1'); S = reload();
}

console.log('\n' + (n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
