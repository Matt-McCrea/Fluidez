#!/usr/bin/env node
/* ============================================================================
 * test-arcade.js — can the games-only build actually deal a question?
 *
 *   node tools/test-arcade.js
 *
 * The arcade's whole claim is that it does not need the teaching corpus:
 * juegos/index.html loads neither data/strand-lessons.js nor data/vocab.js,
 * data/writing.js, data/apply.js or data/idioms.js, because
 * tools/build-game-index.js has already taken what the games read out of them.
 *
 * That claim is only worth anything if it is tested the hard way, so this
 * loads EXACTLY the files juegos/sw.js precaches — parsed from that file, not
 * listed again here, or the test would drift from the thing it certifies —
 * and then deals real rounds. If a generator ever stops emitting something a
 * game reads, the draw returns null here rather than in somebody's hand on a
 * train with no signal.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

let checks = 0, failures = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.error('  ✗ ' + msg); } }

// The asset list, read from the arcade's own service worker.
const swSrc = fs.readFileSync(path.join(ROOT, 'juegos/sw.js'), 'utf8');
const block = swSrc.slice(swSrc.indexOf('var ASSETS = ['), swSrc.indexOf('];', swSrc.indexOf('var ASSETS = [')));
const assets = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);
const scripts = assets.filter(f => f.endsWith('.js') && !f.endsWith('sw.js'));

ok(scripts.length > 0, 'no scripts found in juegos/sw.js ASSETS');
// The point of the exercise: these must NOT be there.
['strand-lessons', 'passages', 'writing', 'apply', 'vocab', 'idioms', 'course'].forEach(f => {
  ok(!assets.some(a => a.indexOf('data/' + f + '.js') !== -1),
     `juegos/sw.js precaches data/${f}.js — the arcade is meant not to need it`);
});

/* A DOM big enough for js/arcade.js to build its board in. Small on purpose:
 * anything it starts using that this lacks throws here rather than passing
 * quietly, which is the behaviour wanted from a shim. */
class El {
  constructor(tag, ns) {
    this.tagName = String(tag || '').toUpperCase();
    this.namespaceURI = ns || 'http://www.w3.org/1999/xhtml';
    this.children = []; this.parentNode = null;
    this._text = ''; this.className = ''; this.attrs = {};
    this.disabled = false; this.type = ''; this.hidden = false;
    this._on = {};
    const self = this;
    this.style = { setProperty(k, v) { self.attrs['style:' + k] = v; } };
    this.dataset = {};
    this.classList = {
      add(c) { if (!self.cls().includes(c)) self.className = (self.className + ' ' + c).trim(); },
      remove(c) { self.className = self.cls().filter(x => x !== c).join(' '); },
      contains(c) { return self.cls().includes(c); }
    };
  }
  cls() { return String(this.className || '').split(/\s+/).filter(Boolean); }
  get firstChild() { return this.children[0] || null; }
  appendChild(n) { n.parentNode = this; this.children.push(n); return n; }
  removeChild(n) { this.children = this.children.filter(c => c !== n); return n; }
  // In a real DOM these are the same thing, and inline SVG is built with
  // setAttribute while HTML here is built with className.
  setAttribute(k, v) { if (k === 'class') this.className = String(v); else this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k]; }
  set textContent(v) { this._text = String(v); this.children = []; }
  get textContent() {
    return this.children.length ? this.children.map(c => c.textContent).join('') : this._text;
  }
  set innerHTML(v) { this._text = String(v).replace(/<[^>]*>/g, ''); }
  addEventListener(ev, fn) { (this._on[ev] = this._on[ev] || []).push(fn); }
  dispatchEvent(e) { (this._on[e && e.type] || []).forEach(fn => fn(e)); return true; }
  click() { this.dispatchEvent({ type: 'click', stopPropagation() {}, preventDefault() {} }); }
  focus() {} scrollIntoView() {}
  all(pred, out) { out = out || []; this.children.forEach(c => { if (pred(c)) out.push(c); c.all(pred, out); }); return out; }
}

const store = {};
global.window = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
global.location = { search: '', hash: '' };
/* A history stack and window events, because the back button is navigation and
 * navigation is behaviour worth testing. */
const HIST = [];
const WINLISTENERS = {};
global.history = {
  pushState(st) { HIST.push(st); },
  back() {
    HIST.pop();
    (WINLISTENERS.popstate || []).forEach(fn => fn({ state: HIST[HIST.length - 1] || null }));
  }
};

/* The round drives itself on animation frames. A no-op that never calls back
 * runs exactly one tick and stops, which is all a navigation test needs. */
global.requestAnimationFrame = () => 1;
global.cancelAnimationFrame = () => {};

const STAGE = new El('div');
global.document = {
  documentElement: new El('html'),
  body: new El('body'),
  createElement: t => new El(t),
  createElementNS: (ns, t) => new El(t, ns),
  removeEventListener() {},
  querySelector: sel => {
    const cls = String(sel).replace(/^\./, '');
    return STAGE.all(n => n.cls().includes(cls))[0] || null;
  },
  getElementById: id => (id === 'stage-host' ? STAGE : null),
  addEventListener() {}, readyState: 'complete'
};
window.navigator = { language: 'en' };  // Node 20+ makes the global read-only

/* Load them in the order the page does. arcade.js is skipped: it is the boot,
 * it registers a service worker and mounts into a DOM, and none of that is
 * what this test is about. */
scripts.filter(f => f.indexOf('arcade.js') === -1).forEach(rel => {
  const abs = path.join(ROOT, 'juegos', rel);
  ok(fs.existsSync(abs), `juegos/sw.js lists ${rel}, which does not exist`);
  if (fs.existsSync(abs)) (0, eval)(fs.readFileSync(abs, 'utf8'));
});

const W = global.window;
ok(!!W.GAME_INDEX, 'data/game-index.js did not define window.GAME_INDEX — run tools/build-game-index.js');
ok(!W.STRAND_LESSONS, 'the corpus leaked into the arcade build');
ok(!W.VOCAB, 'data/vocab.js leaked into the arcade build');
ok(!!W.GameItems && !!W.GameScore && !!W.ENGINE, 'the games modules did not load');

/* Deal real questions at every rung, for every kind a tile can start. */
/* Escucha is gated on the device having a Spanish voice (js/speak.js), which
 * Node does not. Stand one in, because the question is whether the INDEX can
 * feed the game, not whether this machine can talk. */
W.Speak.available = function () { return true; };
const KINDS = ['translate', 'listen', 'verb', 'grammar', 'mixed'];
/* A real PRNG, seeded. A constant rng looks deterministic and is useless:
 * GameItems.next() retries a failed draw up to twelve times, and with a
 * constant it redraws the identical item every time, so any generator that
 * legitimately rejects a candidate (Escucha needs a sound-alike it can build a
 * distractor from) reports as broken. Deterministic must mean reproducible,
 * not frozen. */
let seed = 20260922;
const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
W.Profile.set('C1');                                      // widest pool
KINDS.forEach(kind => {
  let dealt = 0, scored = 0;
  for (let rung = 1; rung <= 10; rung++) {
    const it = W.GameItems.next(kind, rung, rng, {});
    if (!it) continue;
    dealt++;
    ok(!!(it.answer || it.options), `${kind} rung ${rung}: item has neither an answer nor options`);
    ok(!!it.cefr, `${kind} rung ${rung}: item carries no band, so it cannot be scored`);
    const pts = W.GameScore.award(it, 'good', 1200, 3).points;
    if (pts > 0) scored++;
  }
  ok(dealt >= 8, `${kind}: only dealt ${dealt} of 10 rungs from the precomputed index`);
  ok(scored === dealt, `${kind}: ${dealt - scored} dealt items scored zero points`);
  console.log(`  ${kind.padEnd(10)} dealt ${dealt}/10 rungs, all scored`);
});

// Grading still works without the corpus (it leans on the gloss map).
/* The synonym map is derived through Checker.meaningAlternatives, and its
 * builder returns early and silently when Checker is missing — which is how
 * js/checker.js came to be left out of the arcade in the first place. An empty
 * map costs nothing visible until a learner types a correct synonym and is
 * told they are wrong, so assert it is populated. */
ok(Object.keys(W.GameItems.index().glossesOf).length > 1000,
   'the synonym map is empty — js/checker.js is probably missing from the build');
const t = W.GameItems.next('translate', 6, rng, {});
ok(!!t && W.GameItems.grade(t, t.answer) === 'good', 'a correct answer did not grade as good');

/* ---- the three games added after the first cut --------------------------- */
{
  const byKey = k => W.Games.GAMES.filter(g => g.key === k)[0];

  const surv = byKey('supervivencia');
  ok(!!surv, 'Supervivencia is not in the games list');
  ok(surv && surv.sudden && surv.lives === 1 && !surv.secs,
     'Supervivencia must be one life with no round clock — the per-item clock is the game');

  const duo = byKey('unouotro');
  ok(!!duo, 'Uno u otro is not in the games list');
  ok(duo && duo.kind === 'contrast' && duo.secs === 60, 'Uno u otro must be a 60-second contrast round');

  /* The point of the game is that BOTH options are correct Spanish and the
   * sentence decides. So: exactly two options, the answer among them, a real
   * gap in the sentence, and a gloss to make the gap decidable. */
  let dealt = 0;
  const topics = {};
  for (let rung = 1; rung <= 10; rung++) {
    for (let k = 0; k < 6; k++) {
      const it = W.GameItems.next('contrast', rung, rng, {});
      if (!it) continue;
      dealt++;
      topics[it.topic] = (topics[it.topic] || 0) + 1;
      ok(it.options.length === 2, `contrast: ${it.options.length} options, must be two`);
      ok(it.options.indexOf(it.answer) !== -1, 'contrast: the answer is not among the options');
      ok(it.options[0] !== it.options[1], 'contrast: both options are the same word');
      ok(it.prompt.indexOf('＿＿＿') !== -1, 'contrast: the sentence has no gap');
      ok(!!it.note, 'contrast: no gloss, so the gap cannot be decided');
      ok(it.play === 'choose', 'contrast: should be a tap, not a type');
      // The answer must not be sitting in the prompt as well.
      ok(it.prompt.toLowerCase().split(/\s+/).indexOf(it.answer.toLowerCase()) === -1,
         `contrast: the answer "${it.answer}" also appears in the prompt`);
    }
  }
  ok(dealt >= 55, `Uno u otro dealt only ${dealt} of 60 attempts`);

  /* ---- the contrast must actually be a contrast -------------------------
   * At B2 this game asked for the preterite in 121 of 136 past questions,
   * because pastSwap demanded a single morphological reading and EVERY
   * regular imperfect singular has two — `tenía` is both yo and él/ella,
   * while `tuve` and `tuvo` are distinct. A binary game whose answer is
   * nearly always the same option teaches the option, not the distinction. */
  {
    const sample = (band, rung, n) => {
      W.Profile.set(band);
      W.GameItems.reset();
      const topic = {}, past = { preterito: 0, imperfecto: 0 };
      let bad = 0, persons = 0;
      for (let i = 0; i < n; i++) {
        const it = W.GameItems.next('contrast', rung, rng, {});
        if (!it) continue;
        topic[it.topic] = (topic[it.topic] || 0) + 1;
        if (it.topic !== 'lesson:preterite-imperfect') continue;
        const other = it.options.filter(o => o !== it.answer)[0];
        const A = W.ENGINE.analyzeToken(it.answer.toLowerCase())
                    .filter(a => a.tense === 'preterito' || a.tense === 'imperfecto');
        const B = W.ENGINE.analyzeToken(String(other).toLowerCase())
                    .filter(a => a.tense === 'preterito' || a.tense === 'imperfecto');
        if (!A.length || !B.length) { bad++; continue; }
        past[A[0].tense] = (past[A[0].tense] || 0) + 1;
        // Same verb, other tense: the distractor must be wrong about aspect
        // and nothing else, or it can be eliminated without thinking about it.
        if (A[0].inf !== B[0].inf) bad++;
        if (A[0].tense === B[0].tense) bad++;
        /* An explicit third-person subject in the slot before the gap must
         * not be answered with a first-person distractor — "Ella ＿＿＿ su
         * turno … yo empezaba el mío" was offered `terminé`, which reads as
         * a typo and gives the answer away. */
        const before = it.prompt.split(/\s+/)[it.prompt.split(/\s+/).indexOf('＿＿＿') - 1] || '';
        if (/^(ella|él|el)$/i.test(before.replace(/[.,;:]/g, ''))) {
          if (!B.some(x => x.person === 'él/ella')) persons++;
        }
      }
      return { topic, past, bad, persons };
    };

    [['A2', 3], ['B1', 5], ['B2', 7], ['C1', 9]].forEach(([band, rung]) => {
      const r = sample(band, rung, 400);
      const p = r.past.preterito || 0, q = r.past.imperfecto || 0;
      const share = q / Math.max(1, p + q);
      ok(share > 0.3 && share < 0.7,
         `${band}: the past contrast is ${Math.round(share * 100)}% imperfect — one option dominates`);
      ok(r.bad === 0, `${band}: ${r.bad} past questions whose two options are not the same verb in two tenses`);
      ok(r.persons === 0, `${band}: ${r.persons} questions gave a first-person distractor after an explicit él/ella`);
      // All three contrasts should keep roughly a third each.
      const total = Object.keys(r.topic).reduce((n, k) => n + r.topic[k], 0);
      ['lesson:ser-estar', 'lesson:por-para', 'lesson:preterite-imperfect'].forEach(t => {
        const sh = (r.topic[t] || 0) / Math.max(1, total);
        ok(sh > 0.2 && sh < 0.5,
           `${band}: ${t} is ${Math.round(sh * 100)}% of the round — the three contrasts should be even`);
      });
    });
    W.Profile.set('C1');
    W.GameItems.reset();
    console.log('  contrast balance checked across A2-C1');
  }
  ok(Object.keys(topics).length === 3,
     'Uno u otro is not covering all three contrasts: ' + Object.keys(topics).join(', '));

  /* The adjectives the harvest had given an article — "el casado" for
   * married, "el sagrado" for sacred — made this game ask an unanswerable
   * question. They were 2% of the pool, invisible while gender was one
   * question in five and obvious once it was a game of its own. */
  const VOC = (W.GAME_INDEX && W.GAME_INDEX.vocab) || [];
  ['el casado', 'el sagrado', 'el lujoso', 'el contaminado'].forEach(bad => {
    ok(!VOC.some(v => v.es === bad),
       `"${bad}" is back in the vocabulary — it is an adjective, and the gender game cannot ask about it`);
  });
}

/* ---- the ghost ---------------------------------------------------------- */
{
  const key = 'ghost-test';
  // A record round: 90 seconds, scoring steadily to 9,000.
  const curve = [];
  for (let t = 0; t <= 90000; t += 3000) curve.push({ t: t, s: Math.round(t / 10) });
  W.GameScore.record(key, { score: 9000, combo: 5, band: 'B1', run: 8,
                            seen: 20, right: 17, ms: 90000, curve: curve });
  ok(W.GameScore.hasGhost(key), 'a record round left no ghost to race');
  ok(W.GameScore.ghostAt(key, 0) === 0, 'the ghost does not start at zero');
  const mid = W.GameScore.ghostAt(key, 45000);
  ok(mid > 4000 && mid < 5000, `the ghost is at ${mid} halfway through a round that ended on 9,000`);
  ok(W.GameScore.ghostAt(key, 90000) === 9000, 'the ghost does not finish on the record');
  // Interpolated between stored samples, not snapped to them.
  const between = W.GameScore.ghostAt(key, 4500);
  ok(between > 300 && between < 600, `the ghost is not interpolating between samples (got ${between})`);
  ok(W.GameScore.ghostAt('never-raced', 1000) === null, 'a game with no record invented a ghost');

  /* A worse round must not overwrite the ghost — you race the best, not the
   * last, or the target walks backwards every time you have an off day. */
  W.GameScore.record(key, { score: 200, combo: 1, band: 'A1', run: 1,
                            seen: 5, right: 2, ms: 90000,
                            curve: [{ t: 0, s: 0 }, { t: 90000, s: 200 }] });
  ok(W.GameScore.ghostAt(key, 90000) === 9000, 'a worse round replaced the ghost');
}

/* ---- the board renders, and its controls do what they look like ---------
 * js/arcade.js draws the only screen this build has. A screenshot would show
 * it; this shows that it BUILDS — that every game has a tile, that a tile is
 * a play button and the numbers sit behind their own control, and that the
 * stats panel survives both a game with history and one without. */
{
  W.navigator = window.navigator;
  W.addEventListener = (ev, fn) => { (WINLISTENERS[ev] = WINLISTENERS[ev] || []).push(fn); };
  (0, eval)(fs.readFileSync(path.join(ROOT, 'js/arcade.js'), 'utf8'));

  const tiles = STAGE.all(n => n.cls().includes('arc-tile'));
  ok(tiles.length === W.Games.GAMES.length,
     `the board drew ${tiles.length} tiles for ${W.Games.GAMES.length} games`);
  ok(STAGE.all(n => n.cls().includes('arc-daily')).length === 1,
     "the board has no daily-challenge card");
  W.Games.GAMES.forEach(g => {
    ok(STAGE.textContent.indexOf(g.name) !== -1, `the board does not name "${g.name}"`);
  });
  // A game never played shows no stats control — there is nothing to show.
  ok(STAGE.all(n => n.cls().includes('arc-data')).length === 0,
     'a game with no plays is offering a stats panel');

  /* Give one game a history and redraw: the control appears, and opening it
   * renders figures rather than throwing. */
  const key = W.Games.GAMES[0].key;
  for (let i = 0; i < 12; i++) {
    W.GameScore.record(key, { score: 1000 + i * 137, combo: 4, band: 'B1', run: 6,
                              seen: 14, right: 11, ms: 90000 });
  }
  W.Shell.go();
  const data = STAGE.all(n => n.cls().includes('arc-data'));
  ok(data.length === 1, `expected one stats control after 12 rounds, got ${data.length}`);
  ok(STAGE.all(n => n.cls().includes('arc-spark')).length >= 1, 'no sparkline drawn for a played game');

  data[0].click();
  const figs = STAGE.all(n => n.cls().includes('arc-fig-v'));
  ok(figs.length >= 6, `the stats panel drew ${figs.length} figures, expected at least 6`);
  const text = STAGE.textContent;
  ok(text.indexOf('79%') !== -1, 'accuracy is not reported as 79% for 11 right of 14 over 12 rounds');
  ok(text.indexOf('Récord') !== -1 && text.indexOf('Ritmo') !== -1, 'the stats panel is missing its headings');
  // ...and back again.
  const back = STAGE.all(n => n.cls().includes('arc-back'))[0];
  ok(!!back, 'the stats panel has no way back');
  back.click();
  ok(STAGE.all(n => n.cls().includes('arc-tile')).length === W.Games.GAMES.length,
     'going back from the stats panel did not restore the board');

  /* Derived numbers must refuse to appear on thin evidence: two rounds is not
   * a trend, and printing one teaches people to distrust the screen. */
  const fresh = W.GameScore.profileOf('never-played-key');
  ok(fresh.accuracy === null && fresh.perMin === null && fresh.typical === null,
     'profileOf invented figures for a game with no history');
  /* ---- the arcade's own focus -----------------------------------------
   * A control that persists a choice and then fails to apply it looks
   * perfectly correct on screen, which is exactly how the first version of
   * this shipped for the daily session: the setting moved and the rounds did
   * not. So assert the CONSEQUENCE, not the chip. */
  {
    localStorage.removeItem('fluidez.arcade');
    W.Shell.go();
    const chip = STAGE.all(n => n.cls().includes('arc-focus'))[0];
    ok(!!chip, 'the board has no focus control');
    ok(chip.textContent.indexOf('Todo') !== -1, 'the default focus is not "Todo"');
    ok(!chip.cls().includes('on'), 'the focus chip reads as set when nothing is set');

    chip.click();
    const picks = STAGE.all(n => n.cls().includes('arc-pick'));
    ok(picks.length >= 3, `the focus picker offered ${picks.length} options`);
    ok(picks[0].textContent.indexOf('Todo') !== -1, '"Todo" is not the first option');

    // Choose a tense and check it reaches the generator, not just the store.
    const tense = picks[picks.length - 1];
    const label = tense.textContent;
    tense.click();
    const saved = JSON.parse(localStorage.getItem('fluidez.arcade') || '{}');
    ok(saved.focus && saved.focus.kind === 'tense', 'choosing a tense stored nothing');
    // The board comes back, with the chip reflecting the choice.
    const chip2 = STAGE.all(n => n.cls().includes('arc-focus'))[0];
    ok(!!chip2 && chip2.cls().includes('on'), 'the chip does not show that a focus is set');
    ok(chip2.textContent.indexOf(label.trim()) !== -1,
       `the chip says "${chip2.textContent}" after choosing "${label}"`);

    /* The consequence: an item on that topic must now be PREFERRED over one
     * that is not. GameItems.best() is what does it, and it is only reachable
     * through a draw, so draw a batch and check the topic is over-represented
     * against an unfocused control. */
    const t = saved.focus.tense;
    function share(n) {
      let on = 0, total = 0;
      for (let i = 0; i < n; i++) {
        const it = W.GameItems.next('grammar', 6, rng, {});
        if (!it) continue;
        total++;
        if (it.topic === 'tense:' + t) on++;
      }
      return total ? on / total : 0;
    }
    W.GameItems.setFocus(null);
    const without = share(200);
    W.GameItems.setFocus({ type: 'grammar', id: t, tense: t });
    const withF = share(200);
    ok(withF > without, `focus on ${t} did not raise its share of draws (${(without*100).toFixed(1)}% -> ${(withF*100).toFixed(1)}%)`);
    console.log('  focus on ' + t + ': ' + (without * 100).toFixed(1) + '% -> ' + (withF * 100).toFixed(1) + '% of grammar draws');

    // Back to neutral so the rest of the suite is unaffected.
    localStorage.removeItem('fluidez.arcade');
    W.GameItems.setFocus(null);
  }

  /* ---- the level, and the tenses you are allowed to choose ---------------
   * A browser that has never opened the full app defaults to A1, and at A1
   * Profile.tenses() is gated to what the COURSE has taught — the present
   * alone. That left the arcade's focus picker offering exactly one tense and
   * no way to change band, which in a standalone practice tool is a dead end. */
  {
    localStorage.removeItem('fluidez.arcade');
    W.Profile.set('A1');
    W.Shell.go();

    const lvl = STAGE.all(n => n.cls().includes('arc-level'));
    ok(lvl.length === 1, 'the board has no level control');
    ok(lvl[0].textContent.indexOf('A1') !== -1, 'the level control does not show the current band');

    // A1 teaches one tense; the picker must still offer the rest, separately.
    ok(W.Profile.tenses().length === 1, 'precondition: A1 should have one taught tense');
    STAGE.all(n => n.cls().includes('arc-focus'))[0].click();
    const picks = STAGE.all(n => n.cls().includes('arc-pick'));
    const tenseCount = W.ENGINE.TENSES.length;
    ok(picks.length >= tenseCount + 1,
       `the focus picker offered ${picks.length} options at A1; every tense (${tenseCount}) plus Todo should be reachable`);
    ok(STAGE.all(n => n.cls().includes('arc-group')).length === 1,
       'untaught tenses are not separated from taught ones, so the offer is not honest about where you are');

    // Changing level from the arcade must actually move the band.
    W.Shell.go();
    STAGE.all(n => n.cls().includes('arc-level'))[0].click();
    const bands = STAGE.all(n => n.cls().includes('arc-pick'));
    ok(bands.length === W.Profile.all().length, `the level picker offered ${bands.length} bands`);
    bands[3].click();                                   // B2
    ok(W.Profile.current() === 'B2', `choosing B2 left the profile at ${W.Profile.current()}`);
    ok(localStorage.getItem('fluidez.profile') === 'B2', 'the level was not persisted');
    ok(STAGE.all(n => n.cls().includes('arc-level'))[0].textContent.indexOf('B2') !== -1,
       'the board came back still showing the old level');
    ok(W.Profile.tenses().length > 10, 'B2 should unlock the full tense set');

    W.Profile.set('B1');
    localStorage.removeItem('fluidez.arcade');
  }

  /* ---- back always lands somewhere a person expects ----------------------
   * Two failures this guards. Leaving a ROUND used to render the app's own
   * games list into the arcade — a second, differently-styled list appearing
   * from nowhere — because js/games.js had only two answers for "where does a
   * round go back to" and neither was this board. And the phone's own back
   * gesture, which is the only navigation an installed full-screen app gets,
   * closed the whole app from inside a panel. */
  {
    const tileCount = W.Games.GAMES.length;
    const onBoard = () => STAGE.all(n => n.cls().includes('arc-tile')).length === tileCount;

    W.Shell.go();
    ok(onBoard(), 'precondition: not on the board');

    // Every panel: open it, press its ←, land on the board.
    const panels = [
      ['arc-focus', 'the focus picker'],
      ['arc-level', 'the level picker']
    ];
    panels.forEach(([cls, what]) => {
      const depth = HIST.length;
      STAGE.all(n => n.cls().includes(cls))[0].click();
      ok(!onBoard(), `${what} did not open`);
      ok(HIST.length === depth + 1, `${what} pushed no history entry, so the system back button would close the app`);
      STAGE.all(n => n.cls().includes('arc-back'))[0].click();
      ok(onBoard(), `the ← in ${what} did not return to the board`);
      ok(HIST.length === depth, `the ← in ${what} left an entry on the history stack`);
    });

    // Choosing inside a picker is also leaving it.
    {
      const depth = HIST.length;
      STAGE.all(n => n.cls().includes('arc-focus'))[0].click();
      STAGE.all(n => n.cls().includes('arc-pick'))[0].click();      // "Todo"
      ok(onBoard(), 'choosing a focus did not return to the board');
      ok(HIST.length === depth, 'choosing a focus stacked an entry, so back would reopen the picker');
    }

    // The system back button, from a panel.
    {
      STAGE.all(n => n.cls().includes('arc-level'))[0].click();
      ok(!onBoard(), 'the level picker did not open');
      history.back();
      ok(onBoard(), 'the system back button did not return to the board from a panel');
    }

    /* Leaving a ROUND returns to THIS board. Driven through js/games.js's own
     * exit path rather than by calling board() directly, because the seam
     * being tested lives in games.js. */
    {
      ok(typeof W.Games.setListRenderer === 'function',
         'js/games.js offers no way to say who draws the list a round returns to');
      /* Through js/games.js's OWN entry point, because that is what installs
       * backToList as the round's onExit — calling GameRound.run directly
       * would supply a different exit and test nothing. */
      let drew = 0;
      W.Games.setListRenderer(function () { drew++; W.Shell.go(); });
      W.Games.open('traduccion', null);
      const x = STAGE.all(n => n.cls().includes('g-exit'))[0];
      ok(!!x, 'the round did not start, or has no exit control');
      /* Without the seam this does not merely draw the wrong list — it runs
       * the app's renderer in a context it was never built for and throws.
       * Catch it so the suite reports the cause rather than a stack trace. */
      let threw = null;
      try { x.click(); } catch (e) { threw = e; }
      ok(!threw, 'leaving a round threw inside the app list renderer: ' + (threw && threw.message));
      ok(drew === 1, 'leaving a round did not draw the arcade board — the app list would have appeared instead');
      ok(onBoard(), 'the board did not come back after leaving a round');
      W.Games.setListRenderer(function () { W.Shell.go(); });
    }
  }

  /* ---- a blank screen is never an acceptable failure --------------------
   * This build shipped one. The root service worker's scope covers /juegos/
   * and serves cache-first, so the first load after a release can mix new
   * files (never cached) with stale ones (cached) — a new board calling
   * GameScore.profileOf against a gamescore.js that has never heard of it.
   * The exception left a dark page with nothing on it and no way to tell why.
   *
   * Simulate it by taking the function away and re-running the boot. */
  {
    const keep = W.GameScore.profileOf;
    delete W.GameScore.profileOf;
    STAGE.children.length = 0;
    (0, eval)(fs.readFileSync(path.join(ROOT, 'js/arcade.js'), 'utf8'));
    const panel = STAGE.all(n => n.cls().includes('arc-fail'));
    ok(panel.length === 1, 'a missing GameScore function left a blank screen instead of an explanation');
    ok(STAGE.textContent.indexOf('profileOf') !== -1,
       'the failure panel does not name what is missing, so it cannot be diagnosed');
    const reload = STAGE.all(n => n.tagName === 'BUTTON' &&
                                  n.textContent.indexOf('Vaciar') !== -1);
    ok(reload.length === 1, 'the failure panel offers no way out');

    W.GameScore.profileOf = keep;
    STAGE.children.length = 0;
    (0, eval)(fs.readFileSync(path.join(ROOT, 'js/arcade.js'), 'utf8'));
    ok(STAGE.all(n => n.cls().includes('arc-tile')).length === W.Games.GAMES.length,
       'the board did not come back once the missing function was restored');
  }

  console.log('  board drew ' + tiles.length + ' tiles; stats panel renders and returns');
}

console.log('\nChecks run: ' + checks);
if (failures) { console.error('\n❌ ' + failures + ' failure(s).'); process.exit(1); }
console.log('\n✅ Arcade OK — every game deals from the precomputed index, with no teaching corpus loaded.');
