#!/usr/bin/env node
/* ============================================================================
 * test-report.js — the end-of-session report, driven for real.
 *
 *   node tools/test-report.js
 *
 * js/report.js is the one module that makes a CLAIM ABOUT THE LEARNER — "your
 * recall is up nine points" — and a wrong claim there is worse than a blank
 * screen: it either flatters somebody who is forgetting, or tells somebody who
 * is improving that they are not. Nothing else in the app can catch it. The
 * validator proves the file is loaded and the gates below it prove the content
 * is sound; neither runs this arithmetic, and neither opens the dialog.
 *
 * So this drives the module against the same DOM shim tools/test-essay.js uses
 * (a shim, not a reimplementation — a test that reimplements the thing under
 * test measures the reimplementation), and checks the three things that can
 * actually go wrong:
 *
 *   1. the arithmetic — up, down and steady, against a POOLED baseline
 *   2. the bookkeeping — one sample per day, today never in its own baseline,
 *      and a sample too small to mean anything never recorded at all
 *   3. the dialog — the text is in something copyable, the buttons are there,
 *      and every way out of it removes it from the page
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

/* ---- the smallest DOM this module uses ----------------------------------- */
class Node {
  constructor(tag) {
    this.tagName = String(tag || '').toUpperCase();
    this.children = []; this.parentNode = null;
    this._text = ''; this._html = ''; this.className = '';
    this.style = { setProperty() {} }; this.dataset = {};
    this.hidden = false; this.disabled = false; this.value = '';
    this.type = ''; this.readOnly = false; this.spellcheck = false;
    this.contentEditable = 'false'; this.id = '';
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
  removeEventListener(ev, fn) { this._on[ev] = (this._on[ev] || []).filter(f => f !== fn); }
  dispatchEvent(e) { (this._on[e && e.type] || []).forEach(fn => fn(e)); return true; }
  focus() {} select() {} setSelectionRange() {}
  setAttribute(k, v) { this['attr_' + k] = v; }
  getAttribute(k) { return this['attr_' + k]; }
  click() { this.dispatchEvent({ type: 'click', target: this, preventDefault() {} }); }
  all(pred, out) { out = out || []; this.children.forEach(c => { if (pred(c)) out.push(c); c.all(pred, out); }); return out; }
}
function stripTags(s) { return String(s || '').replace(/<[^>]*>/g, ''); }

const docListeners = {};
global.document = {
  createElement: t => new Node(t),
  createRange: () => ({ selectNodeContents() {} }),
  execCommand: () => true,
  documentElement: new Node('html'),
  body: new Node('body'),
  activeElement: null,
  querySelector: () => null,
  getElementById: () => null,
  addEventListener(ev, fn) { (docListeners[ev] = docListeners[ev] || []).push(fn); },
  removeEventListener(ev, fn) { docListeners[ev] = (docListeners[ev] || []).filter(f => f !== fn); }
};
function press(key) { (docListeners.keydown || []).slice().forEach(fn => fn({ key, preventDefault() {} })); }

const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
let copied = null, shared = null;
/* Node 21+ defines navigator as a getter-only global, so it cannot be assigned
 * the way document and localStorage can — it has to be redefined. */
Object.defineProperty(global, 'navigator', {
  configurable: true, writable: true,
  value: {
    /* A synchronous thenable, not Promise.resolve(): the assertions below run
     * in the same tick as the click, and a real promise would settle after
     * them — the test would pass whatever the button did. */
    clipboard: { writeText: t => { copied = t; return { then: res => { res(); } }; } },
    share: p => { shared = p; return Promise.resolve(); }
  }
});
global.window = { localStorage: global.localStorage, getSelection: () => ({ removeAllRanges() {}, addRange() {} }) };
/* Timers are queued, never fired on their own: the "Copied ✓" label has to
 * still be there when we look at it, and showAfter's delay is a thing the
 * tests below drive on purpose. */
const timers = [];
global.setTimeout = fn => { timers.push(fn); return timers.length; };
function fireTimers() { timers.splice(0).forEach(fn => fn()); }

['data/taxonomy.js', 'js/ui.js', 'js/report.js']
  .forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));

const R = window.Report;
let checks = 0, failures = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.error('  ✗ ' + msg); } }

const DAY = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
function reset(recall) {
  store['fluidez.progress'] = JSON.stringify(recall ? { recall } : {});
  R.close();
}
// A history of `n` sessions, each `s` seen and `c` right, ending yesterday.
function past(n, s, c) {
  const out = []; for (let i = n; i >= 1; i--) out.push({ d: DAY() - i, s, c });
  return out;
}
function prog() { return JSON.parse(store['fluidez.progress'] || '{}'); }

/* ---- 1. the arithmetic ---------------------------------------------------- */
{
  reset();
  let t = R.trend('review', 20, 15);
  ok(t.today === 75, 'first session: 15/20 must be 75%');
  ok(t.avg === null && t.delta === null, 'first session must have no baseline to compare against');

  // 60% for five sessions, then 80% today — a real improvement.
  reset({ review: past(5, 10, 6) });
  t = R.trend('review', 10, 8);
  ok(t.avg === 60, `baseline over five 6/10 sessions must be 60%, got ${t.avg}`);
  ok(t.delta === 20, `80% against a 60% baseline must be +20, got ${t.delta}`);

  reset({ review: past(5, 10, 9) });
  t = R.trend('review', 10, 5);
  ok(t.delta === -40, `50% against a 90% baseline must be -40, got ${t.delta}`);

  reset({ review: past(5, 10, 8) });
  t = R.trend('review', 10, 8);
  ok(t.delta === 0, 'an unchanged score must read as no movement');

  /* POOLED, not a mean of percentages. Four sessions of 1/1 and one of 5/20
   * average 85% as percentages and 36% pooled; the learner answered 9 of 24.
   * The mean-of-percentages reading would call a 50% day a collapse. */
  reset({ review: [{ d: DAY() - 5, s: 1, c: 1 }, { d: DAY() - 4, s: 1, c: 1 },
                   { d: DAY() - 3, s: 1, c: 1 }, { d: DAY() - 2, s: 1, c: 1 },
                   { d: DAY() - 1, s: 20, c: 5 }] });
  t = R.trend('review', 10, 5);
  ok(t.avg === 38, `baseline must pool 9 of 24 into 38%, got ${t.avg}`);

  // Only the last WINDOW sessions count — an ancient bad run must age out.
  reset({ review: past(9, 10, 2).map((x, i) => i < 4 ? { d: x.d, s: 10, c: 2 } : { d: x.d, s: 10, c: 8 }) });
  t = R.trend('review', 10, 8);
  ok(t.avg === 80, `only the five most recent sessions may set the baseline, got ${t.avg}`);
}

/* ---- 2. the wording ------------------------------------------------------- */
{
  const line = (history, seen, correct) => {
    reset(history ? { review: history } : {});
    R.trend('review', seen, correct);          // records, so build() sees it as today's
    reset(history ? { review: history } : {});
    return R.build({ results: { review: { seen, correct } } });
  };
  ok(/First one recorded/.test(line(null, 20, 15)), 'a first score must say so rather than compare');
  ok(/20 points up/.test(line(past(5, 10, 6), 10, 8)), 'a 20-point rise must be reported as a rise');
  ok(/40 points down/.test(line(past(5, 10, 9), 10, 5)), 'a 40-point fall must be reported as a fall');
  ok(/About the same as/.test(line(past(5, 10, 8), 10, 8)), 'no movement must read as steady, not as a rise');
  /* The threshold exists because review decks are not the same size every day:
   * one card of difference in a ten-card deck is ten points and means nothing. */
  ok(/About the same as/.test(line(past(5, 40, 30), 40, 31)), 'a one-card difference must not be called improvement');
  // A bad day must not be scolded — the day somebody is told off is the day they stop.
  const bad = line(past(5, 10, 9), 10, 4);
  ok(/come back tomorrow/.test(bad), 'a fall must say what happens next rather than pass judgement');
  ok(!/collapse|disaster|slipped|worse/i.test(bad), 'a fall must not be described as a failure: ' + bad);
}

/* ---- 3. the bookkeeping --------------------------------------------------- */
{
  // One sample per day, and the FIRST one wins: "Hacerla otra vez" re-asks
  // cards whose answers were shown minutes ago and would fake a rising trend.
  reset({ review: past(3, 10, 6) });
  R.trend('review', 10, 6);
  R.trend('review', 10, 10);
  const arr = prog().recall.review;
  ok(arr.length === 4, `a second run on the same day must not add a second sample (got ${arr.length})`);
  ok(arr[arr.length - 1].c === 6, 'the first score of the day is the one that is kept');

  // Today is never part of its own baseline — reopening must not move the delta.
  reset({ review: past(5, 10, 6) });
  const first = R.trend('review', 10, 8).delta;
  const again = R.trend('review', 10, 8).delta;
  ok(first === again && first === 20,
     `reopening the report must report the same delta (${first} then ${again})`);

  // Too small to mean anything: shown, never recorded, never compared.
  reset({ review: past(3, 10, 6) });
  const tiny = R.trend('review', 2, 1);
  ok(tiny.counted === false, 'a two-card review must be marked as not counted');
  ok(prog().recall.review.length === 3, 'a sample below the floor must not be recorded');
  ok(tiny.today === 50, 'a sample below the floor is still shown truthfully');
  const tinyTxt = R.build({ results: { review: { seen: 2, correct: 1 } } });
  ok(/doesn't say much/.test(tinyTxt) && !/recent average/.test(tinyTxt),
     'a sample below the floor must be reported and not interpreted:\n' + tinyTxt);

  // The quick check is its own series — same-day recall of new material is a
  // different question from "did last week stick", and pooling them is noise.
  reset({ review: past(3, 10, 9) });
  R.trend('check', 5, 2);
  ok(prog().recall.check.length === 1, 'the quick check must record into its own series');
  ok(prog().recall.review.length === 3, 'the quick check must not touch the review series');

  // The history cannot grow without bound on a device with no server.
  const many = []; for (let i = 60; i >= 1; i--) many.push({ d: DAY() - i, s: 10, c: 7 });
  reset({ review: many });
  R.trend('review', 10, 7);
  ok(prog().recall.review.length <= 30, `recall history must stay capped, got ${prog().recall.review.length}`);

  // It lives inside fluidez.progress, so export/import/reset already carry it.
  ok(Object.keys(store).length === 1 && store['fluidez.progress'],
     'the report must not invent a localStorage key of its own: ' + Object.keys(store).join(', '));
}

/* ---- 4. the text ---------------------------------------------------------- */
{
  reset();
  const txt = R.build({
    dateLabel: 'Saturday, 27 September',
    band: 'B1',
    dayNumber: 143,
    unit: { title: 'Contar lo que pasó', day: 4, of: 8 },
    lessonTitle: 'El pretérito indefinido',
    lessonCanDo: 'say what happened and when',
    passage: { title: 'Una tarde en el mercado', theme: 'identidad' },
    results: {
      review: { seen: 20, correct: 17 },
      learn: { total: 5, correct: 4 },
      comprehend: { correct: 3, total: 4 },
      apply: { correct: 5, total: 6 },
      produce: { done: 2, total: 2 }
    },
    rhythm: { days30: 22 }
  });
  const must = ['Saturday, 27 September', 'B1', 'day 143', 'Contar lo que pasó', 'day 4 of 8',
    'El pretérito indefinido', 'say what happened and when', 'Una tarde en el mercado',
    'Personal identity', '3 of 4 questions right', 'Grammar in context: 5 of 6',
    'Wrote 2 things', '22 of the last 30 days', 'Fluidez'];
  must.forEach(m => ok(txt.indexOf(m) !== -1, `the summary must mention "${m}"`));
  ok(/Recall: 17 of 20 \(85%\)/.test(txt), 'the summary must give the recall figure in full');
  /* One trend claim per message. The quick check is asked about material met
   * minutes ago and moves with today's difficulty; printed as a second verdict
   * beside the recall line it contradicts it about half the time. */
  ok(/Quick check on today's lesson: 4 of 5/.test(txt), 'the summary must give the quick-check score');
  ok(!/quick check[^\n]*average/i.test(txt),
     'the quick check must not carry its own trend line beside the recall one');
  ok((txt.match(/recent average|First one recorded/g) || []).length <= 1,
     'a summary must make at most one claim about a trend');

  // …but on an on-demand lesson there is no Repasar stage, and then it is the
  // only measure there is, so it gets the trend.
  reset({ check: past(5, 5, 5) });
  const lesson = R.build({ lessonTitle: 'El pretérito', results: { learn: { total: 5, correct: 3 } } });
  ok(/recent average/.test(lesson), 'with no review stage the quick check must carry the trend');
  /* The "all told" figure pools the four graded stages (17+4+3+5 of 20+5+4+6)
   * and must never be mistaken for the recall figure above it. */
  ok(/Overall: 29 of 35 right today \(83%\)/.test(txt), 'the overall figure must pool every graded stage');

  // A rapido session has no lesson, no passage and no writing — and no blanks.
  reset();
  const thin = R.build({ band: 'A2', results: { review: { seen: 8, correct: 6 } } });
  ok(thin.indexOf('undefined') === -1 && thin.indexOf('null') === -1,
     'a review-only session must not print undefined/null: ' + thin);
  // Every section opens with a blank line, so a session missing most of them
  // used to start with a hole three lines deep.
  ok(!/\n\n\n/.test(thin), 'a session with no lesson or passage must not leave a gap:\n' + thin);
  ok(/Recall: 6 of 8/.test(thin), 'a review-only session must still report its recall');

  /* The whole point of this block of text is that a person reads it. An em
   * dash is the tell that a machine wrote it, and none of the copy uses one. */
  reset({ review: past(5, 10, 6) });
  [R.build({ dateLabel: 'Saturday, 27 September', band: 'B1', dayNumber: 12,
             unit: { title: 'Contar lo que pasó', day: 2, of: 8 },
             lessonTitle: 'El pretérito', lessonCanDo: 'say what happened',
             passage: { title: 'Una tarde', theme: 'ocio' },
             results: { review: { seen: 10, correct: 9 }, learn: { total: 4, correct: 2 },
                        comprehend: { correct: 3, total: 4 }, apply: { correct: 4, total: 6 },
                        produce: { done: 1, total: 1 } }, rhythm: { days30: 9 } }),
   R.build({ results: { review: { seen: 10, correct: 2 } } }),
   R.build({ results: { review: { seen: 2, correct: 1 } } }),
   R.build({ results: {} })].forEach(t => ok(t.indexOf('\u2014') === -1,
     'the summary must not use an em dash:\n' + t));

  // A session where nothing was graded still produces something sendable.
  reset();
  const empty = R.build({ results: {} });
  ok(empty.indexOf('Fluidez') !== -1 && empty.length > 20, 'an ungraded session must still produce a message');

  // The cheer is picked by the day, so reopening hands back the same message.
  reset();
  ok(R.build({ results: {} }) === R.build({ results: {} }), 'the same session must produce the same text twice');
}

/* ---- 5. the dialog -------------------------------------------------------- */
{
  reset();
  const data = { band: 'B1', lessonTitle: 'El pretérito', results: { review: { seen: 10, correct: 7 } } };
  const text = R.show(data);
  const back = document.body.children[document.body.children.length - 1];
  ok(back && back.classList.contains('fz-modal-back'), 'show() must put a backdrop on the page');

  const box = back.all(n => n.classList.contains('fz-modal'))[0];
  ok(!!box, 'the backdrop must contain the dialog');
  ok(box.getAttribute('role') === 'dialog' && box.getAttribute('aria-modal') === 'true',
     'the dialog must announce itself as a modal dialog');
  ok(/Matthew/.test(box.textContent), 'the dialog must be titled for the person it is sent to');

  /* A readonly TEXTAREA, not a <pre>: the clipboard API is unavailable over
   * file:// and refusable inside an installed app, and a textarea can still be
   * selected and long-press copied when it fails. */
  const area = box.all(n => n.tagName === 'TEXTAREA')[0];
  ok(!!area, 'the summary must sit in a textarea so it is selectable when the clipboard is refused');
  ok(area.readOnly === true, 'the summary must not be editable');
  ok(area.value === text, 'the textarea must hold exactly the text show() returned');

  const btns = box.all(n => n.tagName === 'BUTTON');
  const copy = btns.filter(b => /Copy|Copiar/.test(stripTags(b.textContent)) && !/Long/.test(stripTags(b.textContent)))[0];
  ok(!!copy, 'the dialog needs a copy button');
  copied = null; copy.click();
  ok(copied === text, 'the copy button must put the summary on the clipboard');
  ok(/Copied|Copiado/.test(stripTags(copy.textContent)), 'the copy button must confirm it copied');

  const shareB = btns.filter(b => /Send|Enviar/.test(stripTags(b.textContent)))[0];
  ok(!!shareB, 'the dialog must offer the share sheet where the device has one');
  shared = null; shareB.click();
  ok(shared && shared.text === text, 'the share sheet must be handed the summary');

  // Every way out: Escape, the ✕, "Maybe later", and the backdrop itself.
  press('Escape');
  ok(document.body.children.indexOf(back) === -1, 'Escape must remove the dialog');
  ok((docListeners.keydown || []).length === 0, 'closing must unhook its key listener');

  /* Spanish labels: UI.t falls back to the Spanish when Profile has not
   * loaded, which is exactly what this harness is — see js/ui.js. */
  ['✕', 'Ahora no'].forEach(label => {
    R.show(data);
    const b = document.body.children[document.body.children.length - 1];
    const btn = b.all(n => n.tagName === 'BUTTON' && stripTags(n.textContent).indexOf(label) !== -1)[0];
    if (!btn) { ok(false, `the dialog has no "${label}" control`); return; }
    btn.click();
    ok(document.body.children.indexOf(b) === -1, `"${label}" must remove the dialog`);
  });

  // The backdrop dismisses; a click that started inside the text must not.
  R.show(data);
  const b2 = document.body.children[document.body.children.length - 1];
  b2.dispatchEvent({ type: 'click', target: b2.all(n => n.tagName === 'TEXTAREA')[0] });
  ok(document.body.children.indexOf(b2) !== -1, 'clicking the summary itself must not close the dialog');
  b2.dispatchEvent({ type: 'click', target: b2 });
  ok(document.body.children.indexOf(b2) === -1, 'clicking the backdrop must close the dialog');

  // Two sessions finished back to back must not stack two dialogs.
  R.show(data); R.show(data);
  const open = document.body.children.filter(n => n.classList.contains('fz-modal-back'));
  ok(open.length === 1, `only one dialog may be open at a time, found ${open.length}`);
  R.close();
  ok(document.body.children.filter(n => n.classList.contains('fz-modal-back')).length === 0,
     'close() must leave nothing behind');

  /* The auto-open is on a delay, and the delay is long enough to leave the
   * screen. A dialog about the session you just finished, opening by itself
   * over the home screen, is a bug and not a reminder. */
  timers.length = 0;
  const card = new Node('div');
  const stage = new Node('div');
  stage.appendChild(card);
  document.getElementById = () => stage;

  R.showAfter(data, card);
  fireTimers();
  ok(document.body.children.filter(n => n.classList.contains('fz-modal-back')).length === 1,
     'showAfter must open the dialog while the completion card is still on screen');
  R.close();

  // Shell.closeOverlay HIDES the overlay rather than emptying it, so the card
  // still has a parent — being hidden is the test that answers the question.
  stage.classList.add('hidden');
  R.showAfter(data, card);
  fireTimers();
  ok(document.body.children.filter(n => n.classList.contains('fz-modal-back')).length === 0,
     'showAfter must not open over the home screen once the session is left');
  stage.classList.remove('hidden');

  // …and not at all if the card itself was cleared away underneath it.
  stage.removeChild(card);
  R.showAfter(data, card);
  fireTimers();
  ok(document.body.children.filter(n => n.classList.contains('fz-modal-back')).length === 0,
     'showAfter must not open once its own card has been cleared');
  document.getElementById = () => null;
}

/* ---- 6. the call sites still call it -------------------------------------- */
/* The dialog can be perfect and never open. Both finishers have to reach it,
 * and both have to offer the way back once it is dismissed — see the comment
 * in js/report.js about dismissing not meaning losing. */
{
  ['js/session.js', 'js/lessonrun.js'].forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    ok(/if \(window\.Report\)/.test(src), `${f} must guard on window.Report before using it`);
    ok(/Report\.showAfter\(/.test(src), `${f} must open the report when it finishes`);
    ok(/Report\.show\(/.test(src), `${f} must offer a button to reopen the report once dismissed`);
  });
  // The quick-check score is what the 'check' series is made of; if the learn
  // stage stops reporting it, the series silently becomes empty forever.
  const learn = fs.readFileSync(path.join(ROOT, 'js/views/learn.js'), 'utf8');
  ok(/ctx\.results\.learn\s*=/.test(learn), 'js/views/learn.js must record the quick-check score');
}

console.log('\nChecks run: ' + checks);
if (failures) { console.error('\n❌ ' + failures + ' failure(s).'); process.exit(1); }
console.log('\n✅ Report OK — arithmetic, bookkeeping, text and dialog all driven.');
