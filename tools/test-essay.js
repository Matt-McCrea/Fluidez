#!/usr/bin/env node
/* ============================================================================
 * test-essay.js — does the essay screen actually work, end to end?
 *
 *   node tools/test-essay.js
 *
 * tools/test-checker.js proves every model satisfies its own constraints, and
 * tools/validate-content.js proves the data is shaped right. Neither runs the
 * SCREEN, and the essay screen is where all the new behaviour is: four phases,
 * a button that must stay disabled until the mechanics pass, a rubric that
 * only appears after the model, and a save that has to reach the journal with
 * its self-mark attached.
 *
 * So this drives js/essay.js for real, the way tools/measure-overlap.js drives
 * the session — against a DOM shim rather than a reimplementation, because a
 * test that reimplements the thing under test measures the reimplementation.
 * The shim below is the smallest DOM that js/ui.js and js/essay.js actually
 * touch; anything they start using that it lacks will throw here rather than
 * pass quietly, which is the behaviour we want from a shim.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

/* ---- the smallest DOM these modules use ---------------------------------- */
class Node {
  constructor(tag) {
    this.tagName = String(tag || '').toUpperCase();
    this.children = []; this.parentNode = null;
    this._text = ''; this._html = ''; this.className = '';
    this.style = { setProperty() {} }; this.dataset = {};
    this.hidden = false; this.disabled = false; this.value = '';
    this.type = ''; this.checked = false; this.rows = 0; this.spellcheck = false;
    this.placeholder = ''; this.selectionStart = 0; this.selectionEnd = 0;
    this._on = {};
    const self = this;
    this.classList = {
      add(c) { if (!self._classes().includes(c)) self.className = (self.className + ' ' + c).trim(); },
      remove(c) { self.className = self._classes().filter(x => x !== c).join(' '); },
      contains(c) { return self._classes().includes(c); }
    };
  }
  _classes() { return String(this.className || '').split(/\s+/).filter(Boolean); }
  get firstChild() { return this.children[0] || null; }
  appendChild(n) { n.parentNode = this; this.children.push(n); return n; }
  removeChild(n) { this.children = this.children.filter(c => c !== n); n.parentNode = null; return n; }
  set innerHTML(v) { this._html = String(v); }
  get innerHTML() { return this._html; }
  set textContent(v) { this._text = String(v); this.children = []; }
  get textContent() {
    if (this.children.length) return this.children.map(c => c.textContent).join('');
    return this._text || stripTags(this._html);
  }
  addEventListener(ev, fn) { (this._on[ev] = this._on[ev] || []).push(fn); }
  dispatchEvent(e) { (this._on[e && e.type] || []).forEach(fn => fn(e)); return true; }
  focus() {}
  scrollIntoView() {}
  setAttribute(k, v) { this['attr_' + k] = v; }
  getAttribute(k) { return this['attr_' + k]; }
  click() { this.dispatchEvent({ type: 'click', preventDefault() {} }); }
  input() { this.dispatchEvent({ type: 'input', preventDefault() {} }); }
  change() { this.dispatchEvent({ type: 'change', preventDefault() {} }); }
  // depth-first walk, so assertions can ask "is there a button saying X?"
  all(pred, out) { out = out || []; this.children.forEach(c => { if (pred(c)) out.push(c); c.all(pred, out); }); return out; }
}
function stripTags(s) { return String(s || '').replace(/<[^>]*>/g, ''); }

global.Event = class { constructor(t) { this.type = t; } };
global.document = {
  createElement: t => new Node(t),
  documentElement: new Node('html'),
  body: new Node('body'),
  querySelector: () => null,
  getElementById: () => null,
  addEventListener() {}
};
const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
global.window = { localStorage: global.localStorage, speechSynthesis: null };

['data/taxonomy.js', 'data/connectors.js', 'data/rubrics.js', 'data/verbs.js', 'data/vocab.js',
 'data/idioms.js', 'data/writing.js', 'js/engine.js', 'js/checker.js', 'js/ui.js',
 'js/write.js', 'js/essay.js'].forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));

let checks = 0, failures = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.error('  ✗ ' + msg); } }
function findBtn(root, text) {
  return root.all(n => n.tagName === 'BUTTON' && stripTags(n.textContent).indexOf(text) !== -1)[0] || null;
}

const essays = window.WRITING_TASKS.filter(t => t.type === 'essay');
ok(essays.length > 0, 'no essay tasks to test');

/* ---- 1. the four phases, driven ------------------------------------------ */
essays.forEach(task => {
  const host = new Node('div');
  let doneCalled = false;
  window.Essay.mount(host, task, { onDone: () => { doneCalled = true; } });
  const tag = `essay "${task.id}"`;

  // PLAN: the brief is on screen and there is no box yet.
  ok(host.all(n => n.tagName === 'TEXTAREA').length === 0, `${tag}: plan phase must not show a textarea`);
  ok(host.textContent.indexOf(task.brief.slice(0, 24)) !== -1, `${tag}: plan phase must show the brief`);
  const start = findBtn(host, 'Empezar') || findBtn(host, 'Start');
  ok(!!start, `${tag}: plan phase needs a start button`);
  start.click();

  // DRAFT: the box exists; the model button is locked until mechanics pass.
  const ta = host.all(n => n.tagName === 'TEXTAREA')[0];
  ok(!!ta, `${tag}: draft phase needs a textarea`);
  const modelB = host.all(n => n.tagName === 'BUTTON' && /modelo|model/i.test(stripTags(n.textContent)))[0];
  ok(!!modelB, `${tag}: draft phase needs a model button`);
  ok(modelB.disabled, `${tag}: model button must start disabled`);

  ta.value = 'Hola. Esto es muy corto.';
  ta.input();
  ok(modelB.disabled, `${tag}: model button must stay disabled while constraints fail`);

  ta.value = task.models[0];
  ta.input();
  ok(!modelB.disabled, `${tag}: model button must unlock once every constraint passes`);

  // MODEL: shown, and the draft survives it.
  modelB.click();
  ok(host.all(n => n.classList.contains('essay-model')).length >= 1, `${tag}: model text must appear`);
  ok(host.all(n => n.tagName === 'TEXTAREA')[0].value === task.models[0],
     `${tag}: the draft must survive the model phase`);

  // MARK: the rubric appears only now, with one checkbox per ask.
  ok(host.all(n => n.classList.contains('rubric-ask')).length === 0,
     `${tag}: the rubric must not be visible before the model`);
  modelB.click();
  const rubric = window.Essay.rubricById(task.rubric);
  const askCount = rubric.dims.reduce((n, d) => n + d.asks.length, 0);
  const boxes = host.all(n => n.tagName === 'INPUT' && n.type === 'checkbox');
  ok(boxes.length === askCount, `${tag}: expected ${askCount} rubric checkboxes, got ${boxes.length}`);

  // Every unticked ask shows its repair; ticking hides it.
  const fixes = host.all(n => n.classList.contains('rubric-fix'));
  ok(fixes.length === askCount && fixes.every(f => !f.hidden),
     `${tag}: every unanswered question must show its fix`);
  boxes.forEach(b => { b.checked = true; b.change(); });
  ok(host.all(n => n.classList.contains('rubric-fix')).every(f => f.hidden),
     `${tag}: a ticked question must hide its fix`);

  // REVISE must exist and must NOT end the task.
  const revise = findBtn(host, 'Revisar') || findBtn(host, 'Revise');
  ok(!!revise, `${tag}: the rubric needs a revise button`);
  revise.click();
  ok(!doneCalled, `${tag}: revising must not finish the task`);

  // SAVE: reaches the journal, carrying the self-mark.
  const before = JSON.parse(localStorage.getItem('fluidez.journal') || '[]').length;
  const save = findBtn(host, 'Guardar') || findBtn(host, 'Save');
  ok(!!save, `${tag}: the rubric needs a save button`);
  save.click();
  const after = JSON.parse(localStorage.getItem('fluidez.journal') || '[]');
  ok(after.length === before + 1, `${tag}: saving must add exactly one journal entry`);
  const entry = after[after.length - 1];
  ok(entry && entry.marks && entry.marks.rubric === task.rubric,
     `${tag}: the journal entry must carry the rubric id`);
  ok(entry && entry.marks && entry.marks.yes === askCount && entry.marks.total === askCount,
     `${tag}: the self-mark must record ${askCount}/${askCount}`);
  ok(doneCalled, `${tag}: saving must finish the task`);
});

/* ---- 2. the constraint that makes an essay an essay ----------------------- */
/* connectorFrom with a floor is the whole point of the batch: without the
 * floor "pero" satisfies a C1 contraargumentativo. Assert the floor BITES on
 * every essay rather than trusting that it was authored correctly. */
const C = window.Checker;
essays.forEach(task => {
  (task.constraints || []).filter(c => c.type === 'connectorFrom').forEach(c => {
    const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const klass = window.CONNECTORS.filter(k => k.id === c.class)[0];
    const below = klass.items.filter(it => BANDS.indexOf(it.level || 'B1') < BANDS.indexOf(c.minLevel));
    if (!below.length) return;                  // nothing cheaper exists to try
    const cheap = below.map(it => it.es).join(', ');
    const r = C.checkWriting({ constraints: [c] }, cheap);
    ok(!r.results[0].pass,
      `essay "${task.id}": ${c.class} at ${c.minLevel} is satisfied by cheaper markers (${cheap})`);
  });
});

/* ---- 3. does the SESSION actually serve them? ----------------------------
 * This section exists because the first wiring of essay days served zero
 * essays over 28 B2 sessions and 28 C1 sessions, and every other check in
 * this file was green while it did. The cause was a misreading of `dayIndex`:
 * at B1 and above it is not a day counter, it is the course position of the
 * learner's next UNSTUDIED lesson, so it does not move for a learner who
 * completes nothing — and a test that never completed a lesson never moved
 * it. The data was perfect and the screen was perfect and the feature was
 * unreachable. So: walk a learner who finishes a lesson each session, which
 * is the only condition under which the cadence means anything. */
{
  const SESSION_FILES = ['data/grammar-docs.js', 'data/grammar.js', 'data/passages.js',
    'data/apply.js', 'data/topics.js', 'data/strand-lessons.js', 'data/course.js',
    'data/resources.js', 'js/lessons.js', 'js/srs.js', 'js/profile.js', 'js/curriculum.js',
    'js/lexmatch.js', 'js/focus.js', 'js/unitcheck.js', 'js/session.js'];
  global.location = { search: '', hash: '' };
  // Node 20+ defines navigator as a getter-only global, so it cannot be
  // replaced — define it on the shim window the modules actually read.
  window.location = global.location;
  window.navigator = { language: 'en' };
  SESSION_FILES.forEach(f => {
    let src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (f === 'js/session.js') {
      src = src.replace('  return {\n    start: start,', '  window.__buildContext = buildContext;\n  return {\n    start: start,');
    }
    (0, eval)(src);
  });

  function walk(band, sessions) {
    window.Profile.set(band);
    const studied = {};
    let served = 0, seen = new Set(), sizes = [];
    for (let n = 0; n < sessions; n++) {
      localStorage.setItem('fluidez.progress', JSON.stringify({ studied: studied, history: [], lastDay: null }));
      let ctx;
      try { ctx = window.__buildContext('diaria'); } catch (e) { break; }
      const tasks = ctx.writeTasks || [];
      const es = tasks.filter(t => t.type === 'essay');
      if (es.length) { served++; es.forEach(e => seen.add(e.id)); }
      sizes.push(tasks.length);
      if (!ctx.lesson) break;
      studied[ctx.lesson.id] = 1;
    }
    return { served: served, distinct: seen.size, max: Math.max.apply(null, sizes) };
  }

  /* ---- the produce stage's SHAPE, band by band -------------------------
   * Not about essays, but it rides on the same walk and there was nowhere
   * else that ran the session. A2 served no free writing at all for the life
   * of the band — 81 sessions of build-and-translate — because the produce
   * stage branched on one of the four `produceStyle` values the taxonomy
   * declares. Nothing failed; a whole skill was simply never asked for. Every
   * band now states what it must serve, so the next value added to that table
   * cannot go unhandled in silence. */
  const SHAPE = {
    A1: { must: ['build', 'translate', 'write'], mustNot: ['paragraph', 'essay'] },
    A2: { must: ['build', 'translate', 'write', 'paragraph'], mustNot: ['essay'] },
    B1: { must: ['build', 'translate', 'write', 'paragraph'], mustNot: ['essay'] },
    B2: { must: ['build', 'translate', 'write', 'paragraph', 'essay'], mustNot: [] },
    C1: { must: ['build', 'translate', 'write', 'paragraph', 'essay'], mustNot: [] }
  };
  Object.keys(SHAPE).forEach(band => {
    const seen = {};
    window.Profile.set(band);
    const studied = {};
    for (let n = 0; n < 60; n++) {
      localStorage.setItem('fluidez.progress', JSON.stringify({ studied: studied, history: [], lastDay: null, beginnerDay: n }));
      let ctx;
      try { ctx = window.__buildContext('diaria'); } catch (e) { break; }
      (ctx.writeTasks || []).forEach(t => { seen[t.type] = (seen[t.type] || 0) + 1; });
      if (ctx.lesson) studied[ctx.lesson.id] = 1;
    }
    SHAPE[band].must.forEach(ty => ok(seen[ty] > 0,
      `${band}: produce stage never served a "${ty}" task in 60 sessions`));
    SHAPE[band].mustNot.forEach(ty => ok(!seen[ty],
      `${band}: produce stage served "${ty}", which is above this band`));
  });

  const b2 = walk('B2', 42), c1 = walk('C1', 42), b1 = walk('B1', 30);
  ok(b2.served >= 3 && b2.served <= 9, `B2: expected roughly weekly essays over 42 sessions, got ${b2.served}`);
  ok(c1.served >= 3 && c1.served <= 9, `C1: expected roughly weekly essays over 42 sessions, got ${c1.served}`);
  ok(b1.served === 0, `B1: must never be served an essay, got ${b1.served}`);
  ok(c1.distinct >= 3, `C1: essays must rotate, got ${c1.distinct} distinct over ${c1.served} servings`);
  /* An essay REPLACES the day's short writing rather than being appended to
   * it — the produce stage must not grow on an essay day, or every B2 session
   * becomes forty minutes and the learner stops opening the app. */
  ok(b2.max <= 5 && c1.max <= 5, `produce stage grew on essay days (B2 max ${b2.max}, C1 max ${c1.max})`);
  console.log('  session cadence — B2: ' + b2.served + '/42 sessions, C1: ' + c1.served +
              '/42 (' + c1.distinct + ' distinct), B1: ' + b1.served + '/30');
}

console.log('\nChecks run: ' + checks);
if (failures) { console.error('\n❌ ' + failures + ' failure(s).'); process.exit(1); }
console.log('\n✅ Essay flow OK — ' + essays.length + ' essays driven through plan · draft · model · mark · save.');
