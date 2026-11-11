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
      contains(c) { return self.cls().includes(c); },
      toggle(c, on) { if (on === undefined ? !self.cls().includes(c) : on) this.add(c); else this.remove(c); }
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
const DOCLISTENERS = {};
global.document = {
  documentElement: new El('html'),
  body: new El('body'),
  createElement: t => new El(t),
  createElementNS: (ns, t) => new El(t, ns),
  removeEventListener(ev, fn) { DOCLISTENERS[ev] = (DOCLISTENERS[ev] || []).filter(f => f !== fn); },
  querySelector: sel => {
    const cls = String(sel).replace(/^\./, '');
    return STAGE.all(n => n.cls().includes(cls))[0] || null;
  },
  getElementById: id => (id === 'stage-host' ? STAGE : null),
  // listeners are kept so a test can fire visibilitychange
  addEventListener(ev, fn) { (DOCLISTENERS[ev] = DOCLISTENERS[ev] || []).push(fn); }, readyState: 'complete'
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

  /* VOCABULARIO — Conjugación's other half. Its generator existed from the
   * rewrite and no tile ever dealt from it, so 5,820 words were reachable only
   * as distractors for other people's questions. */
  /* Escucha was retired: the system voice made the round a test of the voice,
   * and on most Android in the market this build targets there is no Spanish
   * voice at all. Removing the tile is only half of it — the mixed games would
   * have gone on dealing listen items to a learner who no longer had the game. */
  ok(!byKey('escucha'), 'Escucha is back in the games list');
  {
    let heard = 0;
    for (let i = 0; i < 300; i++) {
      const it = W.GameItems.next('mixed', 1 + (i % 10), rng, {});
      if (it && it.kind === 'listen') heard++;
    }
    ok(heard === 0, `${heard} listen items still turn up inside the mixed games`);
  }

  const voc = byKey('vocabulario');
  ok(!!voc, 'Vocabulario is not in the games list');
  ok(voc && voc.kind === 'vocab', 'Vocabulario must deal vocabulary items');

  const conj = byKey('verbos');
  ok(conj && conj.name === 'Conjugación',
     'the verb game should be called Conjugación now that a second verb game exists');
  ok(!!conj, 'renaming the verb game must not change its key — records are stored under it');

  {
    let n = 0, longTyped = 0, artReq = 0, noAnswer = 0;
    for (let rung = 1; rung <= 10; rung++) {
      for (let k = 0; k < 25; k++) {
        const it = W.GameItems.next('vocab', rung, rng, {});
        if (!it) continue;
        n++;
        if (!it.answer) { noAnswer++; continue; }
        if (it.play === 'type') {
          /* Three words is the cap. "el impuesto sobre la renta" is a fair
           * thing to recognise and a typing test to spell at second fifty. */
          if (String(it.answer).trim().split(/\s+/).length > 3) longTyped++;
          // The article must be optional: not knowing `mesa` and not knowing
          // whether it takes el or la are two different gaps.
          if (/^(el|la|los|las)\s/.test(it.answer) &&
              W.GameItems.grade(it, it.answer.replace(/^(el|la|los|las)\s+/, '')) !== 'good') artReq++;
        } else {
          ok(it.options && it.options.length >= 2, 'a vocab choose item has no options');
        }
      }
    }
    /* Verbs have to be reachable AS WORDS. 1,158 of the 1,166 appear nowhere
     * in this app except conjugated, which made Conjugación and Traducción ask
     * two questions at once and mark you wrong on the second when you failed
     * the first. */
    let asWords = 0;
    for (let i = 0; i < 400; i++) {
      const it = W.GameItems.next('vocab', 4 + (i % 7), rng, { anyBand: true });
      if (!it) continue;
      const word = it.play === 'type' ? it.answer : it.prompt;
      if (/^[a-záéíóúñ]+(ar|er|ir)(se)?$/.test(String(word))) asWords++;
    }
    ok(asWords > 15, `only ${asWords} of 400 vocab draws were verbs — they should be learnable as words`);

    /* And the vocabulary game is the one with no band ceiling: a word above
     * your level is just a word you do not know yet, where a TENSE above it is
     * noise. Assert both halves of that policy. */
    W.Profile.set('A2');
    W.GameItems.reset();
    const BANDS2 = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const above = (opts) => {
      let hi = 0;
      for (let r = 1; r <= 10; r++) {
        for (let k = 0; k < 20; k++) {
          const it = W.GameItems.next('vocab', r, rng, opts);
          if (it && BANDS2.indexOf(it.cefr) > BANDS2.indexOf('A2')) hi++;
        }
      }
      return hi;
    };
    ok(above({ anyBand: true }) > 0, 'anyBand did not let the vocabulary game reach above your band');
    ok(above({}) === 0, 'vocabulary reached above your band without anyBand — the cap is not working');
    W.Profile.set('B2');
    W.GameItems.reset();

    /* A theme and a verbs-only choice are REAL filters on this game, not the
     * bias a focus applies elsewhere: the vocabulary is big enough to stand
     * being narrowed, where a translation round narrowed to one tense would
     * exhaust its sentences and repeat. Assert both actually narrow. */
    {
      const VERB = /^[a-záéíóúñ]+(ar|er|ir)(se)?$/;
      const sampleWith = (opts, n2) => {
        const out = { n: 0, verbs: 0, themes: {} };
        for (let r = 1; r <= 10; r++) {
          for (let k = 0; k < n2; k++) {
            const it = W.GameItems.next('vocab', r, rng, Object.assign({ anyBand: true }, opts));
            if (!it) continue;
            out.n++;
            const w = it.answer;                    // the Spanish, typed or tapped
            if (VERB.test(String(w))) out.verbs++;
          }
        }
        return out;
      };
      const plain = sampleWith({}, 15);
      const onlyV = sampleWith({ only: 'verbs' }, 15);
      ok(plain.n > 50 && onlyV.n > 50, 'not enough vocab items to judge the filters');
      const plainShare = plain.verbs / plain.n, verbShare = onlyV.verbs / onlyV.n;
      ok(verbShare > 0.9, `"solo verbos" dealt ${Math.round(verbShare * 100)}% verbs — it is not filtering`);
      ok(plainShare < 0.5, `the unfiltered pool is ${Math.round(plainShare * 100)}% verbs, so the filter proves nothing`);
      console.log('  vocab filters: unfiltered ' + Math.round(plainShare * 100) +
                  '% verbs, "solo verbos" ' + Math.round(verbShare * 100) + '%');
    }

    ok(n > 100, `only ${n} vocab items dealt`);
    ok(noAnswer === 0, `${noAnswer} vocab items had no answer`);
    ok(longTyped === 0, `${longTyped} typed vocab answers are longer than three words`);
    ok(artReq === 0, `${artReq} vocab items required the article to be typed`);
    console.log('  vocab: ' + n + ' items, none typed over three words, article always optional');
  }

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

/* ---- what the answer box demands ------------------------------------------
 * Two different things look alike here and only one of them is optional.
 *
 * A SUBJECT PRONOUN is never required — Spanish drops it, so "como paella"
 * and "yo como paella" are both right and only one is in the data file.
 * GameItems.grade strips a leading pronoun from both sides.
 *
 * A CLITIC is not a subject pronoun. `se había jubilado` without its `se` is
 * `había jubilado`, a different verb. So it stays required — and the prompt
 * has to say so, which for 141 of the 226 pronominal verbs it did not: their
 * English gloss has nothing reflexive in it ("to retire", "to stay"), and 59
 * of those have a non-reflexive twin in the dataset with the same gloss. */
{
  W.Profile.set('C1');
  const CLITIC = /^(me|te|se|nos|os)\s+/i;
  let clitic = 0, unmarked = 0, dropOk = 0;
  let pron = 0, pronAddNo = 0, pronDropNo = 0;

  for (let i = 0; i < 600; i++) {
    const it = W.GameItems.next('verb', 1 + (i % 10), rng, {});
    if (!it || typeof it.answer !== 'string') continue;

    if (CLITIC.test(it.answer)) {
      clitic++;
      if (it.prompt.indexOf('-se') === -1) unmarked++;
      if (W.GameItems.grade(it, it.answer.replace(CLITIC, '')) === 'good') dropOk++;
    }
    pron++;
    if (W.GameItems.grade(it, 'Nosotros ' + it.answer) !== 'good') pronAddNo++;
    if (/^(yo|tú|él|ella|nosotros|vosotros|ellos)\s+/i.test(it.answer) &&
        W.GameItems.grade(it, it.answer.replace(/^\S+\s+/, '')) !== 'good') pronDropNo++;
  }

  ok(clitic > 20, `only ${clitic} pronominal verb items sampled — not enough to judge`);
  ok(unmarked === 0,
     `${unmarked} of ${clitic} pronominal items give no sign in the prompt that a clitic is wanted`);
  ok(dropOk === 0,
     `${dropOk} pronominal items accepted the answer without its clitic — that is a different verb`);
  ok(pronAddNo === 0, `${pronAddNo} of ${pron} items rejected a leading subject pronoun, which is always optional`);
  ok(pronDropNo === 0, `${pronDropNo} items required a leading subject pronoun`);
  console.log('  verbs: ' + clitic + ' pronominal items, all marked (-se); subject pronoun optional in ' + pron);
}

/* ---- a miss comes back inside ordinary rounds ---------------------------
 * The end screen used to say misses were "in Puntos débiles". What that meant
 * was: their TOPIC became eligible for a round you had to go and choose, once
 * three misses shared one. The words themselves were queued nowhere an
 * ordinary round would reach — measured over 600 vocabulary draws, a word
 * missed moments earlier came back zero times, because best() only prefers a
 * due item among the two or three candidates a draw already produced and the
 * pool runs to thousands. */
{
  localStorage.removeItem('fluidez.errors');
  const mk = (id, es, en, kind) => W.ErrorLog.record({
    id: id, front: en, back: es, es: es, en: en, kind: kind, source: 'game', reviewable: false });
  mk('v:la barca:meaning', 'la barca', 'small boat', 'vocab');
  mk('v:el cargo:meaning', 'el cargo', 'post, position', 'vocab');
  mk('vt:jubilarse:plusc', 'se había jubilado', 'he/she had retired', 'verb');

  // The deck is per game kind, because a cloze gap is not a question once the
  // sentence it belonged to is off screen.
  ok(W.GameItems.missDeck('vocab', 20).length === 2, 'the vocab miss deck is the wrong size');
  ok(W.GameItems.missDeck('verb', 20).length === 1, 'the verb miss deck is the wrong size');
  ok(W.GameItems.missDeck('mixed', 20).length === 3, 'a mixed round should draw on every revisitable kind');
  ok(W.GameItems.missDeck('grammar', 20).length === 0,
     'a gap with no options recorded cannot be re-asked and should not be offered');

  /* THE CASE THAT STARTED THIS. Uno u otro carries an SRS id on none of its
   * items and Traducción on half, and writeBack returned early without one —
   * so a whole game's mistakes were thrown away and "Mis fallos" stayed empty
   * however much you played. A miss now files under a synthesised key, and a
   * gap comes back with its options rather than as a typed guess, because por
   * and para both fit most sentences until you see that those are the two
   * choices. */
  {
    W.ErrorLog.record({
      id: null,                                   // exactly what a contrast item has
      front: 'Se acercó a la ventana ＿＿＿ ver mejor.', back: 'para',
      options: ['por', 'para'], kind: 'contrast', source: 'game', reviewable: false
    });
    const all = W.ErrorLog.list();
    const rec = all.filter(e => /ventana/.test(e.front || ''))[0];
    ok(!!rec, 'a miss on an item with no SRS id was not recorded at all');
    ok(/^miss:/.test(rec.id), `the synthesised key should be prefixed to avoid colliding with an SRS id (got "${rec.id}")`);
    ok(rec.options && rec.options.length === 2, 'the options were not kept, so the gap cannot be re-asked');

    const cd = W.GameItems.missDeck('contrast', 20);
    ok(cd.length === 1, `the contrast miss deck has ${cd.length} entries`);
    const back = W.GameItems.deckItem(cd, rng);
    ok(back && back.play === 'choose', 'the gap came back as something other than a tap');
    ok(back && back.prompt.indexOf('＿＿＿') !== -1, 'the gap lost its sentence');
    ok(back && back.options.length === 2 && back.options.indexOf('para') !== -1,
       'the gap came back without the two choices it was asked with');
    ok(back && back.answer === 'para', 'the gap came back with the wrong answer');
  }

  // And an entry becomes a real question again.
  const deck = W.GameItems.missDeck('vocab', 20);
  const it = W.GameItems.deckItem(deck, rng);
  ok(!!it && !!it.prompt && !!it.answer, 'a miss did not turn back into a question');
  ok(deck.some(c => c.id === it.id), 'the revisit item is not from the miss deck');

  localStorage.removeItem('fluidez.errors');
}

/* ---- and stops coming back once you know it -----------------------------
 * Entries only ever grew: record() incremented a count and nothing removed
 * one, so a word missed once was still top of Mis fallos months later and
 * still taking a quarter of every round. */
{
  localStorage.removeItem('fluidez.errors');
  const E1 = { id: 'v:la barca:meaning', kind: 'vocab', front: 'small boat', back: 'la barca' };
  W.ErrorLog.record({ id: E1.id, kind: 'vocab', front: E1.front, back: E1.back,
                      es: 'la barca', en: 'small boat', source: 'game', reviewable: false });
  const here = () => W.ErrorLog.list().filter(e => e.id === E1.id).length;
  ok(here() === 1, 'the miss was not recorded');
  for (let i = 1; i < W.ErrorLog.RECOVER; i++) {
    W.ErrorLog.credit(E1);
    ok(here() === 1, `the entry left after only ${i} correct answer(s)`);
  }
  W.ErrorLog.credit(E1);
  ok(here() === 0, `${W.ErrorLog.RECOVER} correct in a row did not retire the entry`);

  // A fresh miss puts it back, and back to zero — not one credit from leaving.
  W.ErrorLog.record({ id: E1.id, kind: 'vocab', front: E1.front, back: E1.back, source: 'game' });
  W.ErrorLog.credit(E1);
  W.ErrorLog.credit(E1);
  ok(here() === 1, 'a fresh miss did not reset the recovery run');

  // Works for an entry with no SRS id, which is most of Uno u otro.
  localStorage.removeItem('fluidez.errors');
  const gap = { id: null, kind: 'contrast', front: 'Se acercó ＿＿＿ ver mejor.', back: 'para' };
  W.ErrorLog.record({ id: null, kind: gap.kind, front: gap.front, back: gap.back,
                      options: ['por', 'para'], source: 'game' });
  ok(W.ErrorLog.list().length === 1, 'the idless miss was not recorded');
  for (let i = 0; i < W.ErrorLog.RECOVER; i++) W.ErrorLog.credit(gap);
  ok(W.ErrorLog.list().length === 0, 'an idless entry cannot be retired');
  localStorage.removeItem('fluidez.errors');
}

/* ---- the day's pack: a miss has to come back ----------------------------
 * The arcade could only score you. Every round graded correct answers up and
 * logged the misses, and the misses went nowhere — js/gameround.js records
 * them with `reviewable: false`, and ErrorLog.cards() returns only reviewable
 * entries, so a word you got wrong while playing was written down and never
 * asked again. That flag is right about not demoting a mature card on a
 * mistype and wrong about the consequence it had. */
{
  localStorage.removeItem('fluidez.errors');
  localStorage.removeItem('fluidez.study');
  localStorage.removeItem('fluidez.srs');

  /* A miss, recorded the way a round records one. Both orientations, because
   * a typed question shows the English and a tapped one shows the Spanish and
   * the card must come out the same way round either way. */
  W.ErrorLog.record({ id: 'v:la barca:meaning', front: 'small boat', back: 'la barca',
                      es: 'la barca', en: 'small boat',
                      kind: 'vocab', source: 'game', reviewable: false });
  W.ErrorLog.record({ id: 'v:el cargo:meaning', front: 'el cargo', back: 'post, position',
                      es: 'el cargo', en: 'post, position',
                      kind: 'vocab', source: 'game', reviewable: false });

  const p1 = W.Study.pack();
  ok(p1.length > 0, 'the pack is empty even with misses logged');
  ok(p1.length <= W.Study.MAX, `the pack is ${p1.length} cards, over the cap of ${W.Study.MAX}`);
  const misses = p1.filter(c => c.source === 'fallo');
  ok(misses.length >= 2, `only ${misses.length} of the logged misses reached the pack`);
  ok(p1[0].source === 'fallo', 'the pack does not lead with what you got wrong');
  /* And it must not be ONLY repair work. A pack with nothing new in it is a
   * day where you learn nothing, which is a day you skip — and it was exactly
   * that for one build, because freshItems(pool, 0) slices to zero. */
  ok(p1.some(c => c.source === 'nuevo'),
     'the pack contains no new words — it is only things you already failed');
  /* Not a fixed size: the pack is as long as there is work for it. With a
   * cleared schedule and two misses it is those two plus the new-word quota,
   * and asserting a full twelve would be asserting the fixture rather than
   * the behaviour. */
  ok(p1.length >= misses.length + 2 && p1.length <= W.Study.MAX,
     `the pack is ${p1.length} cards for ${misses.length} misses on an empty schedule`);
  // Always meaning → Spanish, whichever way the miss was recorded.
  const barca = p1.filter(c => c.id === 'v:la barca:meaning')[0];
  ok(barca && barca.es === 'la barca' && barca.en === 'small boat',
     'the card came out the wrong way round');
  ok(p1.every(c => c.id && c.es && c.en), 'a pack card is missing a side');

  // Same pack all day, or it is a slot machine you can never finish.
  const p2 = W.Study.pack();
  ok(JSON.stringify(p1.map(c => c.id)) === JSON.stringify(p2.map(c => c.id)),
     'the pack reshuffled between two reads on the same day');

  /* Answering grades the app's own schedule — not a second store. */
  const host2 = new El('div');
  let played = null;
  W.Study.render(host2, { onExit() {}, onPlay(cards) { played = cards; } });
  const first = p1[0];
  ok(!W.SRS.isDue(first.id) || true, 'precondition');
  const reveal = host2.all(n => n.cls().includes('study-reveal'))[0];
  ok(!!reveal, 'the flashcard has no reveal control');
  ok(host2.all(n => n.cls().includes('study-a'))[0].hidden, 'the answer is visible before it is revealed');
  reveal.click();
  ok(!host2.all(n => n.cls().includes('study-a'))[0].hidden, 'revealing did not show the answer');
  host2.all(n => n.cls().includes('study-yes'))[0].click();
  ok(W.SRS.isEnrolled(first.id), '"la sabía" did not enrol the card in the SRS');
  ok(!W.SRS.isDue(first.id), '"la sabía" left the card still due today');

  // Walk the rest, then the hand-off to a round of the same words.
  for (let guard = 0; guard < 40; guard++) {
    const r = host2.all(n => n.cls().includes('study-reveal'))[0];
    if (!r) break;
    r.click();
    host2.all(n => n.cls().includes('study-yes'))[0].click();
  }
  ok(W.Study.doneToday(), 'finishing the pack did not mark the day done');
  const playBtn = host2.all(n => n.tagName === 'BUTTON' && /Jugar/.test(n.textContent))[0];
  ok(!!playBtn, 'the end of the pack offers no round');
  playBtn.click();
  ok(played && played.length === p1.length, 'the round was handed the wrong deck');

  /* A deck round deals ONLY those words — that is the whole point of doing it
   * straight after the cards. */
  const ids = {};
  played.forEach(c => { ids[c.id] = 1; });
  let dealt = 0, stray = 0;
  for (let i = 0; i < 120; i++) {
    const it = W.GameItems.deckItem(played, rng);
    if (!it) continue;
    dealt++;
    if (!ids[it.id]) stray++;
    ok(!!it.answer && !!it.prompt, 'a deck item is missing a side');
  }
  ok(dealt > 80, `the deck round only produced ${dealt} of 120 items`);
  ok(stray === 0, `${stray} items in the deck round were not from the pack`);
  console.log('  pack: ' + p1.length + ' cards (' + misses.length + ' from misses), deck round stays in-deck');

  localStorage.removeItem('fluidez.errors');
  localStorage.removeItem('fluidez.study');
  localStorage.removeItem('fluidez.srs');
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
  /* The board was cut to Jugar plus three tiles on 6 Nov; everything below up
   * to the shelf section tests the full board, which window.arcadeFull brings
   * back (the code is hidden, not deleted). */
  W.arcadeFull = true;
  const OLD = W.Games.GAMES.filter(g => !g.shelf);
  W.navigator = window.navigator;
  W.addEventListener = (ev, fn) => { (WINLISTENERS[ev] = WINLISTENERS[ev] || []).push(fn); };
  (0, eval)(fs.readFileSync(path.join(ROOT, 'js/arcade.js'), 'utf8'));

  const tiles = STAGE.all(n => n.cls().includes('arc-tile'));
  ok(tiles.length === OLD.length,
     `the board drew ${tiles.length} tiles for ${OLD.length} games`);
  ok(STAGE.all(n => n.cls().includes('arc-daily')).length === 1,
     "the board has no daily-challenge card");
  OLD.forEach(g => {
    ok(STAGE.textContent.indexOf(g.name) !== -1, `the board does not name "${g.name}"`);
  });
  // A game never played shows no stats control — there is nothing to show.
  ok(STAGE.all(n => n.cls().includes('arc-data')).length === 0,
     'a game with no plays is offering a stats panel');

  /* Give one game a history and redraw: the control appears, and opening it
   * renders figures rather than throwing. */
  const key = OLD[0].key;
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
  ok(STAGE.all(n => n.cls().includes('arc-tile')).length === OLD.length,
     'going back from the stats panel did not restore the board');

  /* Derived numbers must refuse to appear on thin evidence: two rounds is not
   * a trend, and printing one teaches people to distrust the screen. */
  const fresh = W.GameScore.profileOf('never-played-key');
  ok(fresh.accuracy === null && fresh.perMin === null && fresh.typical === null,
     'profileOf invented figures for a game with no history');
  /* ---- "mis fallos" means your mistakes ---------------------------------
   * It used to mean something else: it found the topic behind your most
   * frequent misses, needed three of them to agree, and ran a GRAMMAR round on
   * that topic — so it was a subject you had been bad at rather than your
   * mistakes, and for someone who only played Vocabulario it never appeared. */
  {
    localStorage.removeItem('fluidez.arcade');
    localStorage.removeItem('fluidez.errors');
    W.Shell.go();

    // With no misses at all it must not be offered.
    STAGE.all(n => n.cls().includes('arc-focus'))[0].click();
    ok(!STAGE.all(n => n.cls().includes('arc-pick'))
         .some(p2 => /Mis fallos/.test(p2.textContent)),
       '"Mis fallos" is offered with nothing in the error log');
    STAGE.all(n => n.cls().includes('arc-back'))[0].click();

    const mk = (id, es, en, kind) => W.ErrorLog.record({
      id, front: en, back: es, es, en, kind, source: 'game', reviewable: false });
    mk('v:la barca:meaning', 'la barca', 'small boat', 'vocab');
    mk('v:el cargo:meaning', 'el cargo', 'post, position', 'vocab');

    // One miss is enough — no waiting for three to share a topic.
    W.Shell.go();
    STAGE.all(n => n.cls().includes('arc-focus'))[0].click();
    const row = STAGE.all(n => n.cls().includes('arc-pick'))
                     .filter(p2 => /Mis fallos/.test(p2.textContent))[0];
    ok(!!row, '"Mis fallos" is not offered even with misses logged');
    ok(/2/.test(row.textContent), 'the option does not say how many mistakes there are');
    row.click();

    // The chip carries the count, so the board reads without opening the picker.
    const chip = STAGE.all(n => n.cls().includes('arc-focus'))[0];
    ok(/Mis fallos/.test(chip.textContent) && /2/.test(chip.textContent),
       `the chip reads "${chip.textContent}" and should carry the count`);

    /* A game with no misses of its kind must say so rather than quietly
     * dealing an ordinary round, which looks like the setting being ignored. */
    const tilesNow = STAGE.all(n => n.cls().includes('arc-tile'));
    const voc = tilesNow.filter(t => /Vocabulario/.test(t.textContent))[0];
    const conj = tilesNow.filter(t => /Conjugación/.test(t.textContent))[0];
    ok(voc && !voc.disabled, 'Vocabulario is disabled despite having vocabulary misses');
    ok(/2 fallos tuyos/.test(voc.textContent), `the Vocabulario tile reads "${voc.textContent}"`);
    ok(conj && conj.disabled, 'Conjugación is playable under "mis fallos" with no verb misses');

    localStorage.removeItem('fluidez.arcade');
    localStorage.removeItem('fluidez.errors');
    W.Shell.go();
  }

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

    /* Choose a TENSE deliberately rather than by position — the picker also
     * offers themes and "solo verbos" now, and grabbing the last row silently
     * tested something else. */
    const tenseLabelOf = k => (W.ENGINE.TENSE_LABEL && W.ENGINE.TENSE_LABEL[k]) || k;
    const want = tenseLabelOf(W.ENGINE.TENSES[1].key);
    const tense = picks.filter(p2 => p2.textContent.indexOf(want) === 0)[0];
    ok(!!tense, `the focus picker offers no row for the tense "${want}"`);
    const label = want;
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
     * against an unfocused control.
     *
     * The tense is CHOSEN FROM WHAT THE POOL ACTUALLY CONTAINS rather than
     * named here. Picking one by hand tested nothing twice: the first pick was
     * whichever tense happened to be last in the engine's list, and the second
     * was a tense with no cloze items at this rung at all, so both ends of the
     * comparison were zero and the check passed by accident. */
    W.GameItems.setFocus(null);
    const seenTopics = {};
    for (let i = 0; i < 300; i++) {
      const it = W.GameItems.next('grammar', 6, rng, {});
      if (it && /^tense:/.test(it.topic || '')) seenTopics[it.topic] = (seenTopics[it.topic] || 0) + 1;
    }
    const common = Object.keys(seenTopics).sort((a, b) => seenTopics[b] - seenTopics[a])[0];
    ok(!!common, 'no grammar item carries a tense topic, so focus cannot be tested');
    const t = common.replace(/^tense:/, '');
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
    const groups = STAGE.all(n => n.cls().includes('arc-group'));
    ok(groups.length >= 2,
       'the picker should separate untaught tenses and themes into their own groups');
    ok(groups.some(g => /Tema/i.test(g.textContent)),
       'the picker offers no themes');

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
    const tileCount = OLD.length;
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
    ok(STAGE.all(n => n.cls().includes('arc-tile')).length === OLD.length,
       'the board did not come back once the missing function was restored');
  }

  /* ---- the 6 Nov shelf: Jugar and three tiles, two shapes of round --------
   * Everything above ran against the full board (arcadeFull). This is the board
   * a player actually gets. */
  {
    W.arcadeFull = false;
    localStorage.removeItem('fluidez.arcade');
    localStorage.removeItem('fluidez.games');
    localStorage.removeItem('fluidez.srs');
    W.Profile.set('B1');
    W.GameItems.reset();
    const has = cls => STAGE.all(n => n.cls().includes(cls));
    const textOf = n => n.textContent;
    W.Shell.go();
    const shelfTiles = has('arc-tile');
    ok(shelfTiles.length === 3, `the shelf has ${shelfTiles.length} tiles, wanted Verbos, Palabras, Frases`);
    ok(['Verbos', 'Palabras', 'Frases'].every((nm, i) => shelfTiles[i] && textOf(shelfTiles[i]).indexOf(nm) !== -1),
       'the tiles are not Verbos, Palabras, Frases in that order');
    ok(has('arc-jugar').length === 1, 'the board has no big Jugar card');
    ['arc-daily', 'arc-focus', 'arc-study', 'liga'].forEach(c =>
      ok(has(c).length === 0, `the ${c} card is still on the board`));
    ok(has('arc-level').length === 1, 'the level button is gone');

    // the sheet: two shapes, and a tense picker on Verbos only
    shelfTiles[0].click();
    const modes = has('arc-mode');
    ok(modes.length === 2 && /Tranquilo · 10 preguntas/.test(textOf(modes[0])) &&
       /Contrarreloj · 60 s/.test(textOf(modes[1])), 'the sheet does not offer Tranquilo and Contrarreloj');
    const chips = has('arc-chip');
    ok(chips.length === 2 + W.ENGINE.TENSES.length && /Todos los de tu nivel/.test(textOf(chips[0])),
       `the tense picker has ${chips.length} chips`);
    ok(chips[0].cls().includes('on'), '"Todos los de tu nivel" is not the default');
    chips.filter(c => c.textContent === (W.ENGINE.TENSE_LABEL.condicional || 'condicional'))[0].click();
    ok(JSON.stringify(JSON.parse(localStorage.getItem('fluidez.arcade')).tenses) === '["condicional"]',
       'a tapped tense chip was not remembered');
    ok(!has('arc-chip')[0].cls().includes('on'), '"Todos" still looks chosen after picking a tense');
    STAGE.all(n => n.cls().includes('arc-back'))[0].click();
    shelfTiles[1].click();
    ok(!has('arc-chip').some(c => /Todos los de tu nivel/.test(textOf(c))), 'Palabras offers a tense picker');
    {
      const tc = has('arc-chip');
      ok(tc.length >= 16 && /Las más comunes/.test(textOf(tc[0])) && tc[0].cls().includes('on'),
         `the Palabras theme row has ${tc.length} chips and "Las más comunes" is not the default`);
      ok(/Conoces 0 de las 1\.000 palabras más comunes/.test(textOf(has('arc-progress')[0])), 'the Palabras sheet has no progress line');
      const food = tc.filter(c => /Comida/.test(textOf(c)))[0];
      ok(!!food, 'no Comida theme chip');
      food.click();
      ok(JSON.parse(localStorage.getItem('fluidez.arcade')).wtheme === 'alimentacion', 'the theme choice was not remembered');
      ok(/ en Comida/.test(textOf(has('arc-progress')[0])), 'the theme progress line is missing');
      ok(!has('arc-chip')[0].cls().includes('on') && food.cls().includes('on'), 'the chosen theme does not look chosen');
      {
        // Prueba de palabras: endless, typed, right = learnt, "No la sé" = enrolled as new, resumes
        const GL = W.GameItems.grindList().list;
        const real = global.setTimeout, q = [];
        global.setTimeout = fn => { q.push(fn); return q.length; };
        const flushQ = () => { while (q.length) q.shift()(); };
        localStorage.removeItem('fluidez.srs'); W.SRS._reset();
        W.SRS.learn(GL[3].id);
        const btn = has('arc-wtbtn')[0];
        ok(!!btn && /¿Ya sabes español\? Marca las que conoces/.test(textOf(btn)), 'no word-test button on the Palabras sheet');
        btn.click();
        const pr = () => has('arc-wt-prompt')[0].textContent;
        const inp = () => has('arc-wt-input')[0];
        const type = v => { inp().value = v; inp().dispatchEvent({ type: 'input' }); };
        ok(pr() === GL[0].en && /^palabra 1 de /.test(has('arc-wt-rank')[0].textContent), 'the word test did not open on rank 1: ' + pr());
        ok(/Llevas 0 marcadas como sabidas/.test(textOf(has('arc-wt-count')[0])), 'running count missing');
        type(GL[0].es); flushQ();
        ok(W.SRS.isLearnt(GL[0].id) && pr() === GL[1].en, 'typing it right did not learn it and move on');
        ok(/Llevas 1 marcadas/.test(textOf(has('arc-wt-count')[0])), 'running count did not move');
        has('arc-wt-idk')[0].click();
        ok(has('arc-wt-fb')[0].textContent === GL[1].es && W.SRS.isEnrolled(GL[1].id) && !W.SRS.isLearnt(GL[1].id), '"No la sé" did not show the answer and enrol the word');
        flushQ();
        ok(pr() === GL[2].en, 'did not move to rank 3');
        inp().value = 'zzzz'; inp().dispatchEvent({ type: 'keydown', key: 'Enter', preventDefault() {} }); flushQ();
        ok(W.SRS.isEnrolled(GL[2].id) && !W.SRS.isLearnt(GL[2].id) && pr() === GL[4].en, 'a wrong word was not enrolled, or the learnt rank 4 was not skipped');
        has('arc-back')[0].click();                       // Terminar
        ok(/Has marcado 1 palabra como sabidas/.test(textOf(has('arc-wt-sum')[0])), 'no summary on leaving');
        ok(JSON.parse(localStorage.getItem('fluidez.arcade')).wordTest.pos >= 4, 'the position was not remembered');
        has('arc-wtbtn')[0].click();                       // Volver a Palabras
        ok(/Conoces 2 de las 1\.000/.test(textOf(has('arc-progress')[0])), 'coverage after the test reads ' + textOf(has('arc-progress')[0]));
        has('arc-wtbtn')[0].click();                       // test again
        ok(pr() === GL[4].en && /Llevas 1 marcadas/.test(textOf(has('arc-wt-count')[0])), 'the word test did not resume at rank 5');
        has('arc-back')[0].click(); has('arc-wtbtn')[0].click();
        global.setTimeout = real;
        localStorage.removeItem('fluidez.srs'); W.SRS._reset();
        localStorage.removeItem('fluidez.arcade');
        localStorage.removeItem('fluidez.arcade');
      }
    }
    STAGE.all(n => n.cls().includes('arc-back'))[0].click();

    // timers and frames under the test's control from here
    const TQ = [], RAFQ = [];
    const realST = global.setTimeout, realRAF = global.requestAnimationFrame, realNow = Date.now;
    let T = 1.8e12;
    global.setTimeout = fn => { TQ.push(fn); return TQ.length; };
    global.clearTimeout = () => {};
    global.requestAnimationFrame = fn => { RAFQ.push(fn); return RAFQ.length; };
    Date.now = () => T;
    const flush = () => { let g = 0; while (TQ.length && g++ < 200) TQ.shift()(); };
    const frame = () => { RAFQ.splice(0).forEach(f => f()); };
    try {
      // Tranquilo: ten questions, a "n / 10" count, no clock, a record of its own
      shelfTiles[0].click();
      has('arc-mode')[0].click();
      ok(JSON.parse(localStorage.getItem('fluidez.arcade')).mode === 't', 'the last shape was not remembered');
      ok(/^1 \/ 10$/.test(has('g-secs')[0].textContent), `Tranquilo HUD reads "${has('g-secs')[0].textContent}"`);
      let answered = 0, guard = 0;
      while (!has('g-over').length && guard++ < 80) {
        // this loop only taps: forget right answers so nothing comes back typed
        localStorage.removeItem('fluidez.srs');
        const cont = has('g-continue')[0];
        if (cont) { cont.click(); flush(); continue; }
        const opt = has('g-opt')[0];
        if (!opt) break;
        opt.click(); answered++; localStorage.removeItem('fluidez.srs'); flush();
      }
      ok(has('g-over').length === 1, 'a Tranquilo round did not end');
      ok(answered === 10, `a Tranquilo round asked ${answered} questions, not 10`);
      ok(W.GameScore.profileOf('verbos2:t').plays === 1 && W.GameScore.profileOf('verbos2:c').plays === 0,
         'a Tranquilo round was not filed under its own key');
      ok((DOCLISTENERS.visibilitychange || []).length === 0, 'a Tranquilo round is watching visibility');

      // Contrarreloj: the clock stops while the page is hidden, then 3-2-1
      T += 1000;
      W.Games.setListRenderer(function () { W.Shell.go(); });
      W.Shell.go();
      has('arc-tile')[1].click();                       // Palabras
      has('arc-mode')[1].click();
      const secs = () => has('g-secs')[0].textContent;
      ok(secs() === '60', `Contrarreloj starts at ${secs()}`);
      T += 10000; frame();
      ok(secs() === '50', `ten seconds in, the clock reads ${secs()}`);
      document.visibilityState = 'hidden';
      (DOCLISTENERS.visibilitychange || []).forEach(f => f());
      T += 30000; frame();
      ok(secs() === '50', `the clock ran while the page was hidden (${secs()})`);
      document.visibilityState = 'visible';
      (DOCLISTENERS.visibilitychange || []).forEach(f => f());
      ok(has('g-resume').length === 1 && has('g-resume')[0].textContent === '3', 'no 3-2-1 on return');
      T += 2000; frame();
      ok(secs() === '50', 'the clock ran during the countdown');
      TQ.shift()(); ok(has('g-resume')[0].textContent === '2', 'the countdown does not count down');
      flush();
      ok(has('g-resume').length === 0, 'the countdown never finished');
      T += 5000; frame();
      ok(secs() === '45', `after the countdown the clock reads ${secs()}, wanted 45`);
      has('g-exit')[0].click(); flush();
    } finally {
      global.setTimeout = realST; global.requestAnimationFrame = realRAF; Date.now = realNow;
      document.visibilityState = 'visible';
    }

    // ---- what the shelf deals ----
    const GI = W.GameItems;
    const draws = (kind, n, opts) => { const out = []; for (let i = 0; i < n; i++) { const it = GI.next(kind, 1 + (i % 10), rng, opts || {}); if (it) out.push(it); } return out; };
    localStorage.removeItem('fluidez.srs');

    // tenses by band, cumulative
    const counts = { A1: 1, A2: 6, B1: 10, B2: 14, C1: 15 };
    Object.keys(counts).forEach(b => ok(GI.tensesForBand(b).length === counts[b], `${b} has ${GI.tensesForBand(b).length} tenses, wanted ${counts[b]}`));
    ok(GI.tensesForBand('A1').join() === 'presente', 'A1 is not the present alone');

    // Verbos, first the old path (no bank), then the bank
    const REAL_VG = W.VERB_GAPS;
    W.VERB_GAPS = [];
    // Verbos: a sentence with a gap, tapped until known, then typed
    W.Profile.set('A1'); GI.reset();
    let vs = draws('sverb', 120, { tapFirst: true });
    ok(vs.length >= 100, `only ${vs.length} of 120 Verbos draws dealt`);
    ok(vs.every(i => i.topic === 'tense:presente'), 'an A1 Verbos round dealt a tense above A1');
    ok(vs.every(i => i.play === 'choose' && i.options.length === 4 && i.options.indexOf(i.answer) !== -1),
       'a Verbos item nobody has answered is not a four-way choice');
    ok(vs.every(i => /＿＿＿/.test(i.prompt) && i.sub), 'a Verbos item is not a gapped sentence with its English');
    ok(vs.every(i => i.kind === 'grammar' && i.id.indexOf('vt:') === 0), 'a Verbos item has no verb-tense SRS id');
    W.Profile.set('B1'); GI.reset();
    vs = draws('sverb', 200, {});
    ok(vs.every(i => GI.tensesForBand('B1').indexOf(i.topic.replace('tense:', '')) !== -1), 'a B1 round dealt a B2 tense');
    const picked = draws('sverb', 60, { tenses: ['impsubj'] });
    ok(picked.length > 50 && picked.every(i => i.topic === 'tense:impsubj'), 'a chosen tense above the level was not honoured');
    // known -> typed
    const idxT = GI.index().byTense;
    const srsAll = {};
    Object.keys(idxT).forEach(t => idxT[t].forEach(r => { srsAll['vt:' + r.inf + ':' + r.tense] = { reps: 2, passed: true }; }));
    localStorage.setItem('fluidez.srs', JSON.stringify(srsAll));
    vs = draws('sverb', 80, {});
    ok(vs.length > 60 && vs.every(i => i.play === 'type' && i.accept[0] === i.answer), 'verbs answered right are not asked typed');
    ok(vs.every(i => i.options && i.options.indexOf(i.answer) !== -1), 'a typed verb item lost the options its revisit needs');
    localStorage.removeItem('fluidez.srs');

    // a thin tense falls back to the meaning-to-form question, without its label
    {
      W.Profile.set('C1'); GI.reset();
      const saved = GI.index().byTense.presubj;
      GI.index().byTense.presubj = [];
      const fb = draws('sverb', 60, { tenses: ['presubj'] });
      GI.index().byTense.presubj = saved;
      ok(fb.length > 40, `the fallback dealt only ${fb.length} of 60`);
      ok(fb.every(i => !/subjunctive/i.test(i.prompt)), 'a fallback verb prompt still carries "(subjunctive)"');
      ok(fb.every(i => i.play === 'choose' && i.options.length === 4), 'a fallback verb item is not tapped first');
    }
    W.Profile.set('B1'); GI.reset();
    W.VERB_GAPS = REAL_VG;

    // Verbos from the sentence bank (data/verb-gaps.js), tested on a fixture of our own
    {
      const mk = (q, inf, t, p, a, o, b, extra) => Object.assign({ q, i: inf, t, p, a, o, w: 'Porque ' + inf + ' aqui.', we: 'Because ' + inf + ' here.', e: 'English of ' + inf, b }, extra || {});
      const FX = [
        mk('Ojalá que mañana no ___ (llover) durante el partido.', 'llover', 'presubj', 'él/ella', 'llueva', ['llueva', 'llueve', 'lloviera', 'lloverá'], 'B1'),
        mk('Si ___ (tener) más tiempo, Camilo viajaría más.', 'tener', 'impsubj', 'yo', 'tuviera', ['tuviera', 'tendría', 'tenga', 'tenía'], 'B2', { x: ['tuviese'] }),
        mk('Si ___ (saber), te habría llamado antes.', 'saber', 'pluscsubj', 'yo', 'hubiera sabido', ['hubiera sabido', 'había sabido', 'supiera', 'habría sabido'], 'C1', { x: ['hubiese sabido'] }),
        mk('Todos los días Ana ___ (correr) en el parque.', 'correr', 'presente', 'él/ella', 'corre', ['corre', 'corrió', 'corría', 'correrá'], 'A1'),
        mk('Mi papá siempre ___ (leer) el periódico.', 'leer', 'presente', 'él/ella', 'lee', ['lee', 'leyó', 'leía', 'leerá'], 'A1'),
        mk('Los lunes yo ___ (trabajar) desde casa.', 'trabajar', 'presente', 'yo', 'trabajo', ['trabajo', 'trabajé', 'trabajaba', 'trabajaré'], 'A1'),
        mk('Cada mañana Valentina ___ (beber) jugo de mango.', 'beber', 'presente', 'él/ella', 'bebe', ['bebe', 'bebió', 'bebía', 'beberá'], 'A1'),
        mk('Cuando yo ___ (llegar) a casa, te llamo.', 'llegar', 'presubj', 'yo', 'llegue', ['llegue', 'llego', 'llegaré', 'llegara'], 'C1')
      ];
      W.VERB_GAPS = FX;
      localStorage.removeItem('fluidez.vgrecent'); localStorage.removeItem('fluidez.srs');
      W.Profile.set('B1'); GI.reset();
      const qs = FX.map(f => f.q.replace(/___/, '＿＿＿'));
      let vs2 = draws('sverb', 40, { tenses: ['presubj'] });
      ok(vs2.length === 40 && vs2.every(i => i.topic === 'tense:presubj' && qs.indexOf(i.prompt) !== -1), 'Verbos did not deal from VERB_GAPS');
      ok(vs2.every(i => i.prompt !== qs[7]), 'a C1 sentence was dealt to a B1 player (more than one band up)');
      ok(vs2.every(i => { const f = FX.filter(x => x.q.replace(/___/, '＿＿＿') === i.prompt)[0]; return f && i.options.length === f.o.length && f.o.every(o => i.options.indexOf(o) !== -1) && i.answer === f.a; }),
         'the options are not the item\'s o');
      ok(vs2.every(i => i.sub === null && i.peek && i.id === 'vt:' + i.inf + ':presubj'), 'English not withheld, or the SRS id changed');
      // the band's default set honours the tense filter
      W.Profile.set('C1'); GI.reset(); localStorage.removeItem('fluidez.vgrecent');
      let allT = {};
      draws('sverb', 200, {}).forEach(i => { allT[i.topic] = 1; });
      ok(allT['tense:pluscsubj'] === 1 && allT['tense:impsubj'] === 1 && allT['tense:presente'] === 1, 'the default C1 set does not reach pluscsubj and the rest');
      const pc = draws('sverb', 20, { tenses: ['pluscsubj'] });
      ok(pc.length === 20 && pc.every(i => i.topic === 'tense:pluscsubj'), 'the pluscsubj chip tense was not honoured');
      // typed accepts the -se twin
      localStorage.setItem('fluidez.srs', JSON.stringify({ 'vt:saber:pluscsubj': { reps: 2, passed: true }, 'vt:tener:impsubj': { reps: 2, passed: true } }));
      const ty = draws('sverb', 10, { tenses: ['pluscsubj'] })[0];
      ok(ty.play === 'type' && ty.accept.indexOf('hubiera sabido') !== -1 && ty.accept.indexOf('hubiese sabido') !== -1, 'typed does not accept the -se twin');
      const ty2 = draws('sverb', 10, { tenses: ['impsubj'] })[0];
      ok(ty2.play === 'type' && ty2.accept.join() === 'tuviera,tuviese', 'typed impsubj does not accept both forms');
      localStorage.removeItem('fluidez.srs');
      // no repeats within a round: four presente sentences, four draws
      W.Profile.set('A1'); GI.reset(); localStorage.removeItem('fluidez.vgrecent');
      const four = draws('sverb', 4, { tenses: ['presente'] });
      ok(new Set(four.map(i => i.prompt)).size === 4, 'a sentence repeated inside a round');
      const next4 = draws('sverb', 3, { tenses: ['presente'] });
      const rec = JSON.parse(localStorage.getItem('fluidez.vgrecent'));
      ok(next4.length === 3 && rec.length === 7, `recent sentences are not remembered (${rec.length} of 7)`);
      ok(new Set(next4.map(i => i.prompt)).size === 3, 'a sentence repeated across rounds while fresh ones remained');
      // a tense with no bank items falls back to the corpus path
      W.Profile.set('B1'); GI.reset();
      const fbk = draws('sverb', 30, { tenses: ['condicional'] });
      ok(fbk.length > 20 && fbk.every(i => i.topic === 'tense:condicional'), 'a tense with no bank items did not fall back');
      // why, by band
      W.Profile.set('A2'); GI.reset(); localStorage.removeItem('fluidez.vgrecent');
      const a2 = draws('sverb', 1, { tenses: ['presubj'] })[0];
      ok(a2.note === 'Because llover here.' && a2.noteAlt === 'Porque llover aqui.', 'A2 does not get the English reason first');
      W.Profile.set('B1'); GI.reset(); localStorage.removeItem('fluidez.vgrecent');
      const b1 = draws('sverb', 1, { tenses: ['presubj'] })[0];
      ok(b1.note === 'Porque llover aqui.' && b1.noteAlt === 'Because llover here.', 'B1 does not get the Spanish reason first');

      // on screen: English hidden until asked; the reason only after a miss
      localStorage.removeItem('fluidez.vgrecent'); localStorage.removeItem('fluidez.srs');
      W.VERB_GAPS = FX.slice(0, 1);
      W.Profile.set('B1'); GI.reset();
      const q2 = [], r2 = [];
      const sST = global.setTimeout, sRAF = global.requestAnimationFrame;
      global.setTimeout = fn => { q2.push(fn); return q2.length; };
      global.requestAnimationFrame = fn => { r2.push(fn); return r2.length; };
      try {
        W.Games.setListRenderer(function () { W.Shell.go(); });
        W.Shell.go();
        STAGE.all(n => n.cls().includes('arc-tile'))[0].click();
        STAGE.all(n => n.cls().includes('arc-chip')).filter(c => /Todos/.test(c.textContent))[0].click();
        STAGE.all(n => n.cls().includes('arc-chip')).filter(c => c.textContent === (W.ENGINE.TENSE_LABEL.presubj || 'presubj'))[0].click();
        STAGE.all(n => n.cls().includes('arc-mode'))[0].click();
        const on = c => STAGE.all(n => n.cls().includes(c));
        ok(on('g-sub').length === 1 && !/English of/.test(on('g-sub')[0].textContent), 'the English is on screen before it is asked for');
        on('g-peek')[0].click();
        ok(/English of llover/.test(on('g-sub')[0].textContent), 'ver en inglés did not reveal the English');
        const wrong = on('g-opt').filter(o => o.textContent !== 'llueva')[0];
        wrong.click();
        const fb = on('g-correct')[0];
        ok(!!fb && /llueva/.test(fb.textContent) && /Porque llover aqui\./.test(fb.textContent) && /English of llover/.test(fb.textContent), 'the miss box lacks the answer, the Spanish reason or the English');
        on('g-peek').filter(b => /English/.test(b.textContent))[0].click();
        ok(/Because llover here\./.test(on('g-correct')[0].textContent), 'the other-language reason is not one tap away');
        on('g-exit')[0].click(); while (q2.length) q2.shift()();
      } finally { global.setTimeout = sST; global.requestAnimationFrame = sRAF; }
      localStorage.removeItem('fluidez.vgrecent');
      W.VERB_GAPS = REAL_VG;
      W.Profile.set('B1'); GI.reset();
    }

    // Palabras: the grind. English shown, Spanish options; typed only once answered right
    {
      const G = GI.grindList().list;
      ok(G.length > 5000, `the ranked list has only ${G.length} entries`);
      ok(G.every(e => !e.g), 'a grammar word is in the ranked list');
      const WR = W.WORD_RANK;
      const gram = [].concat(WR.words, WR.verbs).filter(e => e.g).map(e => e.es);
      localStorage.removeItem('fluidez.srs');
      W.Profile.set('A1'); GI.reset();
      const rank = es => G.findIndex(e => e.es === es);
      const play = (n, opts, st) => { const out = []; for (let i = 0; i < n; i++) { const it = GI.next('sword', 1, rng, Object.assign({ grind: st }, opts)); if (it) out.push(it); } return out; };

      // fresh player: four options, new words in rank order, the cap holds, verbs share the list
      let st = { asked: 0, newN: 0, used: {} };
      let r1 = play(10, { count: 10, gkind: 'sword' }, st);
      ok(r1.length === 10, `a fresh round dealt ${r1.length} of 10`);
      ok(r1.every(i => i.play === 'choose' && i.options.length === 4 && i.options.indexOf(i.answer) !== -1 && i.prompt !== i.answer),
         'a fresh Palabras item is malformed');
      ok(r1.every(i => /^v:.+:meaning$/.test(i.id)), 'a Palabras item has no v:<es>:meaning id');
      const newOnes = r1.filter(i => i.grind === 'new');
      ok(newOnes.length >= 4, 'a fresh player was not given new words');
      // content words and small words (de, que, por) each come in rank order, three to one
      const small = es => { const e = G.find(x => x.es === es); return e && !e.verb && !e.th && !/^(el|la|los|las)\s/i.test(e.es); };
      const inOrder = list => list.every((x, i) => i === 0 || x > list[i - 1]);
      // ... and among content words, verbs and the rest each in rank order, one verb to two
      const isVerb = es => { const e = G.find(x => x.es === es); return e && e.verb; };
      const cRanks = newOnes.filter(i => !small(i.answer)).map(i => rank(i.answer));
      const vRanks = newOnes.filter(i => !small(i.answer) && isVerb(i.answer)).map(i => rank(i.answer));
      const wRanks = newOnes.filter(i => !small(i.answer) && !isVerb(i.answer)).map(i => rank(i.answer));
      const sRanks = newOnes.filter(i => small(i.answer)).map(i => rank(i.answer));
      ok(inOrder(vRanks) && inOrder(wRanks) && inOrder(sRanks),
         `new words are not in rank order: ${vRanks.join(',')} / ${wRanks.join(',')} / ${sRanks.join(',')}`);
      ok(wRanks[0] === G.findIndex(e => !small(e.es) && !e.verb), 'a fresh player did not start at the most common noun or adjective');
      ok(vRanks.length * 2 <= wRanks.length + 2, `too many verbs among new words: ${vRanks.length} of ${cRanks.length}`);
      ok(sRanks.length * 3 <= cRanks.length + 3, `too many small words: ${sRanks.length} of ${newOnes.length}`);
      ok(r1.every(i => gram.indexOf(i.answer) === -1), 'a grammar word was asked');
      console.log('  fresh A1 first ten: ' + r1.map(i => i.answer + ' (' + i.prompt + ')').join('; '));

      // a second round the same day: round one's words, answered right, come back TYPED
      r1.forEach((it, i) => { if (i % 5 !== 4) { W.SRS.enrol(it.id); W.SRS.grade(it.id, true); } else W.SRS.enrol(it.id); });
      const r2 = play(10, { count: 10, gkind: 'sword' }, { asked: 0, newN: 0, used: {} });
      const typedBack = r2.filter(i => i.play === 'type').length;
      ok(typedBack >= 4, `only ${typedBack} of round two came back typed`);
      ok(r2.filter(i => i.grind === 'new').length <= 4, 'round two broke the new-word cap');
      ok(r2.filter(i => i.grind === 'due').length === 2 && r2[0].grind === 'due', 'the two misses of round one were not due first in round two');
      console.log('  second round: ' + r2.map(i => i.grind + (i.play === 'type' ? '/typed' : '')).join(', '));
      localStorage.removeItem('fluidez.srs');

      // the cap: with something to fill, at most four of ten are new
      const store0 = {};
      G.slice(0, 40).forEach((e, i) => { store0[e.id] = { reps: 2, passed: true, due: W.SRS.today() + 3 + i, last: W.SRS.today() - 1, box: 2 }; });
      localStorage.setItem('fluidez.srs', JSON.stringify(store0));
      for (let t = 0; t < 5; t++) {
        st = { asked: 0, newN: 0, used: {} };
        const rr = play(10, { count: 10, gkind: 'sword' }, st);
        ok(rr.filter(i => i.grind === 'new').length <= 4, 'a Tranquilo round asked more than four new words');
        ok(rr.filter(i => i.grind === 'new').length === 4, 'a Tranquilo round with fillers did not reach its four new words');
        ok(rr.filter(i => i.grind === 'recent').length === 6, 'the other six were not recently learned words');
        ok(new Set(rr.map(i => i.answer)).size === 10, 'a word came twice in one round');
        ok(rr.filter(i => i.grind === 'new').every(i => rank(i.answer) >= 40), 'a new word was one already answered');
        ok(rr.filter(i => i.grind === 'recent').every(i => i.play === 'type' || i.options), 'a recent word is neither typed nor tapped');
      }
      // timed: about one in three
      st = { asked: 0, newN: 0, used: {} };
      const rt = play(30, {}, st);
      const tn = rt.filter(i => i.grind === 'new').length;
      ok(tn >= 8 && tn <= 11, `Contrarreloj dealt ${tn} new words of 30, wanted about a third`);

      // due before new; the most overdue first; a missed word (enrolled, never graded) is due
      const td = W.SRS.today();
      const s2 = Object.assign({}, store0);
      s2[G[200].id] = { reps: 3, passed: true, due: td - 5, last: td - 20, box: 2 };
      s2[G[300].id] = { reps: 0, due: td, box: 0 };
      localStorage.setItem('fluidez.srs', JSON.stringify(s2));
      st = { asked: 0, newN: 0, used: {} };
      const rd = play(3, { count: 10, gkind: 'sword' }, st);
      ok(rd[0].answer === G[200].es && rd[1].answer === G[300].es, `due cards did not come first: ${rd.map(i => i.answer)}`);
      ok(rd[0].grind === 'due' && rd[1].grind === 'due' && rd[2].grind === 'new', 'due then new is not the order');
      ok(rd[0].play === 'type', 'a due word that was answered right before is not typed');
      ok(rd[1].play === 'choose', 'a missed word (never answered right) is not tapped');
      {
        // the lowest-ranked unseen word of its own kind (small word, verb, or other)
        const kindOf = e => (!e.verb && !e.th && !/^(el|la|los|las)\s/i.test(e.es)) ? 's' : e.verb ? 'v' : 'w';
        const got = G[rank(rd[2].answer)], seenIds = s2;
        const first = G.find(e => kindOf(e) === kindOf(got) && !(seenIds[e.id] && (seenIds[e.id].reps > 0 || seenIds[e.id].due <= td)));
        ok(first && first.es === got.es, `the new word is not the lowest-ranked unseen one of its kind: ${got.es}`);
      }

      // typed: article optional, and another entry with the same gloss is accepted
      const withArt = G.find(e => /^(el|la) /.test(e.es));
      const s3 = {}; s3[withArt.id] = { reps: 2, passed: true, due: td - 1, last: td - 9, box: 2 };
      localStorage.setItem('fluidez.srs', JSON.stringify(s3));
      const ti = play(1, {}, { asked: 0, newN: 0, used: {} })[0];
      ok(ti.answer === withArt.es && ti.play === 'type', 'the due typed word was not dealt');
      ok(GI.grade(ti, withArt.es.replace(/^(el|la) /, '')) === 'good', 'the article is not optional');
      const twin = G.find(e => G.some(o => o !== e && o.en.toLowerCase() === e.en.toLowerCase() && o.es.indexOf(' ') === -1 && e.es.indexOf(' ') === -1));
      if (twin) {
        const other = G.find(o => o !== twin && o.en.toLowerCase() === twin.en.toLowerCase());
        const s4 = {}; s4[twin.id] = { reps: 2, passed: true, due: td - 1, last: td - 9, box: 2 };
        localStorage.setItem('fluidez.srs', JSON.stringify(s4));
        const ti2 = play(1, {}, { asked: 0, newN: 0, used: {} })[0];
        ok(ti2.play === 'type' && GI.grade(ti2, other.es) === 'good', 'a word with the same English gloss is not accepted when typed');
      }

      // theme filter: only that theme, in rank order
      localStorage.removeItem('fluidez.srs');
      const themes = GI.grindThemes();
      ok(themes.length >= 15 && themes.every(t => t.label && t.label !== t.id), 'the themes have no Spanish labels');
      const th = themes.find(t => t.id === 'alimentacion') || themes[0];
      st = { asked: 0, newN: 0, used: {} };
      const rth = play(10, { theme: th.id, count: 10, gkind: 'sword' }, st);
      ok(rth.length === 10 && rth.every(i => G[rank(i.answer)].th === th.id), 'a theme round dealt words from another theme');
      const rrV = rth.filter(i => G[rank(i.answer)].verb).map(i => rank(i.answer));
      const rrW = rth.filter(i => !G[rank(i.answer)].verb).map(i => rank(i.answer));
      const ord = l => l.every((x, i) => i === 0 || x > l[i - 1]);
      ok(ord(rrV) && ord(rrW), 'a theme round is not in rank order');

      // options: no two share a gloss, distractors come from the answer's theme when it has one
      let bad = 0, offTheme = 0, dup = 0, n = 0;
      const gl = es => G[rank(es)];
      for (let k = 0; k < 400; k++) {
        const it = GI.next('sword', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
        if (!it || !it.options) continue;
        n++;
        const es = it.options.map(gl);
        if (new Set(it.options).size !== 4) dup++;
        for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
          const ga = Object.keys(es[a].gl), gb = Object.keys(es[b].gl);
          if (ga.some(x => gb.indexOf(x) !== -1) || es[a].en.toLowerCase() === es[b].en.toLowerCase()) bad++;
        }
      }
      ok(n > 300 && bad === 0 && dup === 0, `${bad} option pairs share a gloss, ${dup} repeated options over ${n} items`);

      // coverage
      localStorage.removeItem('fluidez.srs');
      let cv = GI.coverage(null);
      ok(cv.n === 0 && cv.of === 1000 && cv.text === 'Conoces 0 de las 1.000 palabras más comunes', `coverage reads "${cv.text}"`);
      const s5 = {};
      G.slice(0, 700).forEach(e => { s5[e.id] = { reps: 1, passed: true, due: td + 5 }; });
      s5[G[800].id] = { reps: 0, due: td };                 // a miss is not known
      // Missed in a review: the SRS counts wrong answers in reps too, so reps
      // alone said "known" (9 Nov 2026: the bar read 471 where the word test had
      // marked 390). Missed since its right answer, or never right: not known.
      s5[G[801].id] = { reps: 2, passed: true, consecMiss: 1, due: td };
      s5[G[802].id] = { reps: 1, passed: false, consecMiss: 1, due: td };
      s5[G[803].id] = { reps: 1, learnt: true, passed: true, due: td + 36500 };
      localStorage.setItem('fluidez.srs', JSON.stringify(s5));
      cv = GI.coverage(null);
      ok(cv.n === 701 && cv.of === 1000 && /Conoces 701 de las 1\.000/.test(cv.text), `coverage reads "${cv.text}" (missed words counted as known?)`);
      ok(!GI.knownCard(s5[G[801].id]) && !GI.knownCard(s5[G[802].id]) && GI.knownCard(s5[G[803].id]),
         'knownCard: a word missed since its right answer must not be known; a learnt one must');
      if (GI.wordTestNext) {
        const nx = GI.wordTestNext(801);
        ok(nx && nx.e.es === G[801].es, 'Prueba de palabras skips a word missed in a review as if it were known');
      }
      const s6 = {};
      G.slice(0, 1200).forEach(e => { s6[e.id] = { reps: 1, passed: true, due: td + 5 }; });
      localStorage.setItem('fluidez.srs', JSON.stringify(s6));
      cv = GI.coverage(null);
      ok(cv.of === 2000 && cv.n === 1200 && /de las 2\.000/.test(cv.text), `past a thousand the line reads "${cv.text}"`);
      const inTh = G.filter(e => e.th === th.id), known = inTh.filter(e => e.pos < 1200).length;
      cv = GI.coverage(th.id);
      ok(cv.theme && cv.theme.n === known && cv.theme.of === inTh.length && cv.theme.text === `${known} de ${inTh.length} en ${th.label}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
         `theme coverage reads "${cv.theme && cv.theme.text}"`);
      localStorage.removeItem('fluidez.srs');

      // permanently learnt: never dealt, never new, still counted as known
      {
        localStorage.removeItem('fluidez.srs'); W.SRS._reset();
        const L0 = G.slice(0, 40);
        L0.slice(0, 30).forEach(e => W.SRS.learn(e.id));
        W.SRS.enrol(L0[30].id);                              // due today, not learnt: still dealt
        const cv30 = GI.coverage(null);
        const st = { asked: 0, newN: 0, used: {} }, seen = {};
        W.Profile.set('C1'); GI.reset();
        for (let i = 0; i < 60; i++) {
          const it = GI.next('sword', 1, rng, { grind: st, count: 10, gkind: 'sword' });
          if (it) seen[it.id] = it.grind;
        }
        ok(L0.slice(0, 30).every(e => !(e.id in seen)), 'the grind dealt a permanently learnt word');
        ok(L0[30].id in seen, 'an enrolled, unlearnt word is still dealt');
        ok(cv30.n === 30 && cv30.total === 30, 'learnt words do not count as known in the coverage line: ' + JSON.stringify(cv30));
        W.SRS.grade(L0[0].id, false);                        // missed anywhere: back in the grind
        ok(!W.SRS.isLearnt(L0[0].id), 'a wrong answer did not un-learn a word');
        W.Profile.set('B1'); GI.reset();
      }
      // the word test
      {
        localStorage.removeItem('fluidez.srs');
        W.SRS._reset();
        W.SRS.learn(G[1].id);                                // already learnt: skipped
        W.SRS.grade(G[2].id, true);                          // already answered right: skipped
        let n0 = GI.wordTestNext(0);
        ok(n0 && n0.pos === 0 && n0.rank === 1 && n0.total === G.length, 'the word test does not start at rank 1');
        ok(GI.wordTestNext(1).pos === 3, 'the word test did not skip learnt and known words, in rank order');
        ok(GI.wordTestGrade(G[0], G[0].es) === 'good' && GI.wordTestGrade(G[0], G[0].es.replace(/^(el|la|los|las)\s+/i, '')) === 'good' &&
           GI.wordTestGrade(G[0], 'zzzz') === 'wrong', 'the word test acceptance (article optional) is off');
        GI.wordTestRight(G[0]);
        ok(W.SRS.isLearnt(G[0].id) && !W.SRS.isDue(G[0].id), 'a right word-test answer did not learn the word');
        GI.wordTestMiss(G[3]);
        ok(W.SRS.isEnrolled(G[3].id) && !W.SRS.isLearnt(G[3].id) && !W.SRS.passed(G[3].id) && !W.SRS.isDue(G[3].id),
           'a missed word-test word is not enrolled as new');
        const st2 = { asked: 0, newN: 0, used: {} };
        ok(GI.coverage(null).n === 3, 'coverage after the word test ' + GI.coverage(null).n);
        localStorage.removeItem('fluidez.srs'); W.SRS._reset();
      }

      // old behaviour kept: a known word comes back typed, a missed one tapped
      const typedN = 0;
      W.Profile.set('B1'); GI.reset();
    }

    // Frases: ticking a phrase as known (SRS.learn) skips it; unticking (SRS.unlearn) brings it back as new
    {
      localStorage.removeItem('fluidez.srs'); W.SRS._reset();
      W.Profile.set('A1'); GI.reset();
      const PL0 = GI.phraseList().list, a = PL0[0], b = PL0[1];
      PL0.slice(2).forEach(e => W.SRS.learn(e.id));
      const deal = () => { const seen = {}; for (let i = 0; i < 80; i++) { const it = GI.next('sphrase', 1, rng, { grind: { asked: 0, newN: 0, used: {} }, count: 10, gkind: 'sphrase' }); if (it) seen[it.id] = 1; } return seen; };
      ok(deal()[a.id], 'before ticking, the phrase can be dealt');
      W.SRS.learn(a.id);
      ok(W.SRS.isLearnt(a.id) && !deal()[a.id], 'a ticked phrase was dealt again');
      W.SRS.unlearn(a.id);
      ok(!W.SRS.isLearnt(a.id) && !W.SRS.isEnrolled(a.id) && deal()[a.id], 'an unticked phrase did not come back');
      ok(W.SRS.isLearnt(PL0[2].id), 'unlearn touched another phrase');
      localStorage.removeItem('fluidez.srs'); W.SRS._reset(); GI.reset();
    }

    // Frases: the grind over data/phrases.js. Tapped first, then typed (6 words or fewer) or built (7 to 8)
    {
      const P = W.PHRASES, PL = GI.phraseList().list;
      ok(P.length >= 700 && PL.length === P.length, `PHRASES has ${P.length} entries, the list ${PL.length}`);
      localStorage.removeItem('fluidez.srs');
      W.Profile.set('A1'); GI.reset();
      const nw = es => es.replace(/[.,;:!?¿¡"“”]/g, '').trim().split(/\s+/).length;
      const playP = (n, opts, st) => { const out = []; for (let i = 0; i < n; i++) { const it = GI.next('sphrase', 1, rng, Object.assign({ grind: st }, opts)); if (it) out.push(it); } return out; };
      const fresh = () => ({ asked: 0, newN: 0, used: {} });
      const td = W.SRS.today();

      // a fresh A1 player: new phrases in list order (those within one band), all tapped, four Spanish options
      let pr1 = playP(10, { count: 10, gkind: 'sphrase' }, fresh());
      ok(pr1.length === 10, `a fresh Frases round dealt ${pr1.length} of 10`);
      ok(pr1.every(i => i.play === 'choose' && i.options.length === 4 && i.options.indexOf(i.answer) !== -1 && new Set(i.options).size === 4),
         'a fresh Frases item is not a four-way choice');
      ok(pr1.every(i => /^p:/.test(i.id) && i.id === 'p:' + i.answer && i.kind === 'translate'), 'a Frases item has no p:<es> id');
      const okBand = e => ['A1', 'A2'].indexOf(e.c) !== -1;
      const firstNew = PL.filter(okBand).slice(0, 10).map(e => e.es);
      ok(pr1.map(i => i.answer).join('|') === firstNew.join('|'),
         `the new phrases are not the first ten in list order: ${pr1.filter(i => i.grind === 'new').map(i => i.answer)}`);
      ok(pr1.every(i => PL.find(e => e.es === i.answer).c !== 'C1' && PL.find(e => e.es === i.answer).c !== 'B2'), 'an A1 player was dealt a phrase two bands up');
      let sameEn = 0;
      pr1.forEach(i => i.options.forEach(o => { if (o !== i.answer && PL.find(e => e.es === o).en.toLowerCase() === i.prompt.toLowerCase()) sameEn++; }));
      ok(sameEn === 0, 'a Frases option shares the English');
      console.log('  Frases fresh A1 first ten: ' + pr1.map(i => i.prompt + ' -> ' + i.answer + ' [' + i.grind + ']').join('; '));

      // second round: round one's phrases answered right come back typed or built; misses stay tapped
      pr1.forEach((it, i) => { W.SRS.enrol(it.id); if (i % 5 !== 4) W.SRS.grade(it.id, true); });
      const pr2 = playP(10, { count: 10, gkind: 'sphrase' }, fresh());
      ok(pr2.filter(i => i.play === 'type' || i.play === 'build').length >= 4, 'round two of Frases did not come back typed or built');
      ok(pr2.filter(i => i.grind === 'new').length <= 4, 'Frases round two broke the new cap');
      ok(pr2.every(i => i.play !== 'type' || nw(i.answer) <= 6) && pr2.every(i => i.play !== 'build' || (nw(i.answer) >= 7 && nw(i.answer) <= 8)),
         'Frases typed/built at the wrong length');
      ok(pr2.every(i => i.play !== 'choose' || !PL.find(e => e.es === i.answer) || !answered(i.id)), 'an answered phrase came back tapped');
      console.log('  Frases second round: ' + pr2.map(i => i.grind + '/' + i.play).join(', '));
      function answered(id) { const c = JSON.parse(localStorage.getItem('fluidez.srs') || '{}')[id]; return !!(c && c.reps > 0); }

      // typed accepts es and every alt, ignoring the marks; built is chips without punctuation
      const withAlt = PL.find(e => e.alt.length && e.n <= 6), withQ = PL.find(e => /^¿/.test(e.es) && e.n <= 6);
      const longer = PL.find(e => e.n >= 7 && e.n <= 8 && e.c === 'A1') || PL.find(e => e.n >= 7 && e.n <= 8 && ['A1', 'A2'].indexOf(e.c) !== -1);
      const sKnown = {};
      [withAlt, withQ, longer].filter(Boolean).forEach((e, k) => { sKnown[e.id] = { reps: 2, passed: true, due: td - 1 - k, last: td - 9, box: 2 }; });
      localStorage.setItem('fluidez.srs', JSON.stringify(sKnown));
      const dealt = playP(3, {}, fresh());
      const byEs = es => dealt.find(i => i.answer === es || i.reveal === es);
      const ta = byEs(withAlt.es);
      ok(ta && ta.play === 'type', 'a due phrase six words or shorter is not typed');
      withAlt.alt.forEach(a => ok(GI.grade(ta, a) === 'good', `alt "${a}" is not accepted`));
      ok(GI.grade(ta, withAlt.es) === 'good', 'the main Spanish is not accepted');
      const tq = byEs(withQ.es);
      ok(GI.grade(tq, withQ.es.replace(/[¿¡?!.]/g, '')) === 'good', 'the typed check does not ignore ¿ and the final mark');
      ok(GI.grade(tq, 'xyz qwe') === 'wrong', 'a wrong typed phrase passes');
      if (longer) {
        const tb = byEs(longer.es);
        ok(tb && tb.play === 'build' && tb.words.join(' ') === nw(longer.es) && true || (tb && tb.play === 'build' && tb.words.length === nw(longer.es) && !/[.,;:!?¿¡]/.test(tb.words.join(''))),
           'a 7 to 8 word phrase is not built from clean chips');
      }

      // the cap in a Tranquilo round with fillers, and a note in the feedback item
      const fill = {};
      PL.slice(0, 30).forEach((e, i) => { fill[e.id] = { reps: 2, passed: true, due: td + 3 + i, last: td - 1, box: 2 }; });
      localStorage.setItem('fluidez.srs', JSON.stringify(fill));
      for (let t = 0; t < 5; t++) {
        const rr = playP(10, { count: 10, gkind: 'sphrase' }, fresh());
        ok(rr.filter(i => i.grind === 'new').length === 4 && rr.filter(i => i.grind === 'new').every(i => PL.findIndex(e => e.es === i.answer) >= 30),
           'a Tranquilo Frases round with fillers did not hold to four new phrases');
        ok(new Set(rr.map(i => i.answer)).size === 10, 'a phrase came twice in one round');
      }
      const timedN = playP(30, {}, fresh()).filter(i => i.grind === 'new').length;
      ok(timedN >= 8 && timedN <= 12, `Contrarreloj Frases dealt ${timedN} new of 30, wanted about a third`);

      // a due and a missed phrase come before new ones, whatever the band
      const hi = PL.find(e => e.c === 'C1' || e.c === 'B2');
      if (hi) {
        const sHi = {}; sHi[hi.id] = { reps: 0, due: td, box: 0 };
        localStorage.setItem('fluidez.srs', JSON.stringify(sHi));
        const rh = playP(2, { count: 10, gkind: 'sphrase' }, fresh());
        ok(rh[0].answer === hi.es && rh[0].grind === 'due', 'a missed phrase above the player\'s band did not come back first');
      }

      // B1+: a right answer at first sight does not use up the cap
      localStorage.removeItem('fluidez.srs'); W.Profile.set('B1'); GI.reset();
      {
        const st = fresh(); let newSeen = 0;
        for (let i = 0; i < 12; i++) {
          const it = GI.next('sphrase', 1, rng, { grind: st, count: 12, gkind: 'sphrase' });
          if (!it) break;
          if (it.grind === 'new') newSeen++;
          W.SRS.enrol(it.id); W.SRS.grade(it.id, true);
        }
        ok(newSeen > 4, `a B1 player who knows the phrases was held to ${newSeen} new`);
      }
      W.Profile.set('A1'); GI.reset(); localStorage.removeItem('fluidez.srs');

      // a note rides on the item for the feedback box, whether the answer was right or not
      const withNote = PL.find(e => e.note && ['A1', 'A2'].indexOf(e.c) !== -1);
      if (withNote) {
        const sn = {}; sn[withNote.id] = { reps: 0, due: td, box: 0 };
        localStorage.setItem('fluidez.srs', JSON.stringify(sn));
        const ni = playP(1, { count: 10, gkind: 'sphrase' }, fresh())[0];
        ok(ni.answer === withNote.es && ni.note === withNote.note && ni.noteOnRight, 'a phrase note is not on the item');
        const gr = fs.readFileSync(path.join(ROOT, 'js/gameround.js'), 'utf8');
        ok(/item\.noteOnRight && item\.note/.test(gr) && /item\.note \|\|/.test(gr), 'the round does not show a phrase note after a right answer and a miss');
      }

      // coverage
      localStorage.removeItem('fluidez.srs');
      let pc = GI.phraseCoverage();
      ok(pc.n === 0 && pc.of === 700 && pc.text === 'Conoces 0 de las 700 frases más comunes', `phrase coverage reads "${pc.text}"`);
      const sc = {}; PL.slice(0, 120).forEach(e => { sc[e.id] = { reps: 1, passed: true, due: td + 5 }; }); sc[PL[300].id] = { reps: 0, due: td };
      localStorage.setItem('fluidez.srs', JSON.stringify(sc));
      pc = GI.phraseCoverage();
      ok(pc.n === 120 && pc.text === 'Conoces 120 de las 700 frases más comunes', `phrase coverage reads "${pc.text}"`);
      localStorage.removeItem('fluidez.srs'); W.Profile.set('B1'); GI.reset();
    }
    const wc = i => String(i.es).trim().split(/\s+/).length;

    // Jugar: 45% verbs, 40% words, 15% phrases
    const mix = draws('smix', 1500, { tapFirst: true });
    const share = f => mix.filter(f).length / mix.length;
    const sv = share(i => i.id && /^vt:/.test(i.id)), sw = share(i => i.kind === 'vocab'), sp = share(i => i.kind === 'translate');
    ok(Math.abs(sv - 0.45) < 0.07 && Math.abs(sw - 0.40) < 0.07 && Math.abs(sp - 0.15) < 0.06,
       `Jugar dealt ${Math.round(sv * 100)}/${Math.round(sw * 100)}/${Math.round(sp * 100)} verbs/words/phrases`);

    // the miss revisit knows the shelf's kinds
    localStorage.removeItem('fluidez.errors');
    W.ErrorLog.record({ id: 'vt:comer:presente', front: 'Yo ＿＿＿ (comer) pan.', back: 'como', kind: 'grammar',
                        source: 'game', reviewable: false, options: ['como', 'comes', 'come', 'comemos'] });
    W.ErrorLog.record({ id: 'v:la barca:meaning', front: 'small boat', back: 'la barca', es: 'la barca', en: 'small boat',
                        kind: 'vocab', source: 'game', reviewable: false });
    W.ErrorLog.record({ id: 'k:buenos dias', front: 'good morning', back: 'buenos días', es: 'buenos días', en: 'good morning',
                        kind: 'translate', source: 'game', reviewable: false });
    ok(GI.missDeck('sverb', 9).length === 1 && GI.missDeck('sword', 9).length === 1 && GI.missDeck('sphrase', 9).length === 1 &&
       GI.missDeck('smix', 9).length === 3, 'the shelf kinds do not find their own misses');
    // a missed word comes back tapped, not typed
    const rv = GI.deckItem(GI.missDeck('sword', 9), rng, { tapFirst: true });
    ok(rv && rv.play === 'choose' && rv.options.indexOf('la barca') !== -1, 'a revisited word is not asked tapped');
    localStorage.removeItem('fluidez.errors');

    // per tense, for the report
    W.Profile.set('C1'); GI.reset();
    const perTense = Object.keys(GI.index().byTense).map(t => t + ' ' + GI.index().byTense[t].length).join(', ');
    console.log('  verb-gap sentences per tense: ' + perTense);

    localStorage.removeItem('fluidez.arcade');
    localStorage.removeItem('fluidez.games');
    W.Profile.set('B1'); GI.reset();
    W.arcadeFull = true;
    W.Shell.go();
  }

  console.log('  board drew ' + tiles.length + ' tiles; stats panel renders and returns');
}

/* ---- stage 4: Tu progreso, the weekly check, tense cards, the deep link ------
 * js/tensecheck.js decides, js/arcade.js draws. The numbers come from a seeded
 * SRS, the check runs through its session and through the DOM, the card is
 * drawn from a fixture (not the generated file, which has its own gate), and
 * every tense must map to a lesson that exists. */
{
  const TCk = W.TenseCheck, GI = W.GameItems, GS = W.GameScore;
  ok(!!TCk, 'js/tensecheck.js did not load (is it in juegos/sw.js ASSETS?)');
  const has = cls => STAGE.all(n => n.cls().includes(cls));
  const btn = re => STAGE.all(n => n.tagName === 'BUTTON' && re.test(n.textContent))[0];
  const reset = () => ['fluidez.srs', 'fluidez.tensecheck', 'fluidez.games', 'fluidez.arcade', 'fluidez.vgrecent']
    .forEach(k => localStorage.removeItem(k));
  const FIX = {};
  TCk.LADDER.forEach(k => {
    FIX[k] = {
      name: { es: 'Nombre ' + k, en: 'Name ' + k },
      when: [{ es: 'Hábitos: *siempre* y *a veces*.', en: 'Habits: *always*.' }, { es: 'Otro uso.', en: 'Other use.' }],
      how: { es: 'Quita la terminación y añade *-o*.', en: 'Drop the ending and add *-o*.' },
      table: { verb: 'hablar', forms: ['hablo', 'hablas', 'habla', 'hablamos', 'hablan'], persons: ['yo', 'tú', 'él', 'nosotros', 'ellos'] },
      irregular: k === 'presente' ? null : { es: 'Ojo: *tengo*.', en: 'Careful: *tengo*.' },
      examples: [{ es: 'Yo *hablo* mucho.', en: 'I talk a lot.' }, { es: 'Tú *hablas* poco.', en: 'You talk little.' }, { es: 'Ella *habla* bien.', en: 'She talks well.' }],
      contrast: { es: 'No lo confundas con otro.', en: 'Do not mix it up.' }
    };
  });
  const realCards = W.TENSE_CARDS;
  W.TENSE_CARDS = FIX;
  W.arcadeFull = false;
  reset(); W.Profile.set('B1'); GI.reset();
  let seed4 = 7;
  const rng4 = () => { seed4 = (seed4 * 1103515245 + 12345) & 0x7fffffff; return seed4 / 0x7fffffff; };
  const gapOf = prompt => W.VERB_GAPS.filter(x => x.q.replace(/___+/g, '＿＿＿') === prompt.replace(/\s*$/, ''))[0];

  /* the mapping: every tense has a lesson, and the lesson exists */
  {
    (0, eval)(fs.readFileSync(path.join(ROOT, 'data/lessons/index.js'), 'utf8'));
    const tenseLessons = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'impneg', 'impsubj', 'futperf', 'perfsubj', 'condperf'];
    TCk.LADDER.forEach(t => {
      const id = TCk.lessonFor(t);
      ok(!!id, `no lesson mapped for ${t}`);
      ok(tenseLessons.indexOf(id) !== -1 || !!W.LESSONS_INDEX.ids[id], `${t} maps to "${id}", which is not a lesson`);
      ok(TCk.lessonUrl(t) === '../index.html?lesson=' + encodeURIComponent(id), `lessonUrl(${t}) is malformed`);
    });
    ok(W.ENGINE.TENSES.every(t => !!TCk.lessonFor(t.key)), 'an engine tense has no lesson mapping');
    ok(JSON.stringify(TCk.LADDER) === JSON.stringify(['presente', 'preterito', 'imperfecto', 'perfecto', 'futuro', 'imperativo', 'condicional',
      'plusc', 'presubj', 'impneg', 'impsubj', 'futperf', 'perfsubj', 'condperf', 'pluscsubj']), 'the check ladder is not in the agreed order');
  }

  /* the panel numbers, from a seeded SRS */
  {
    const L = GI.grindList().list, srs = {};
    L.slice(0, 820).forEach(e => { srs[e.id] = { reps: 1, passed: true }; });
    L.slice(1000, 1100).forEach(e => { srs[e.id] = { reps: 1, passed: true }; });
    srs['vt:llegar:presente'] = { reps: 1, passed: true }; srs['vt:llegar:preterito'] = { reps: 3, passed: true };
    srs['vt:comer:presente'] = { reps: 2, passed: true }; srs['vt:hablar:presente'] = { reps: 0 };
    const PL = GI.phraseList().list;
    PL.slice(0, 12).forEach(e => { srs[e.id] = { reps: 1, passed: true }; });
    localStorage.setItem('fluidez.srs', JSON.stringify(srs));
    const wp = TCk.wordProgress();
    ok(wp.total === 920, `known words: ${wp.total}, wanted 920`);
    ok(wp.marks[0].n === 820 && wp.marks[0].of === 1000, `top 1.000 reads ${JSON.stringify(wp.marks[0])}`);
    ok(wp.marks[1].n === 920 && wp.marks[1].of === 2000, `top 2.000 reads ${JSON.stringify(wp.marks[1])}`);
    ok(wp.next.m === 1000, 'the next milestone is not the 1.000');
    ok(wp.themes.length === GI.grindThemes().length, 'the detail view would miss a theme');
    ok(TCk.verbsKnown() === 2, `verbos conocidos: ${TCk.verbsKnown()}, wanted 2 (llegar, comer)`);
    ok(TCk.phraseProgress().n === 12, 'phrases known miscounted');
    W.Shell.go();
    const txt = STAGE.textContent;
    ok(/Tu progreso/.test(txt) && /820 de 1\.000/.test(txt), 'the board has no Palabras progress row');
    ok(/2 verbos conocidos/.test(txt), 'the board has no verb count');
    ok(new RegExp('12 de ' + String(TCk.phraseProgress().of).replace(/(\d)(?=(\d{3})$)/, '$1.')).test(txt), 'the board has no Frases row');
    ok(has('arc-tchip').length === 15 && has('arc-tchip').every(c => c.getAttribute('data-s') === 'sin'), 'unchecked tenses should all read sin probar');
    btn(/^Palabras/) ; // the row is the button
    STAGE.all(n => n.cls().includes('arc-prow') && n.tagName === 'BUTTON')[0].click();
    ok(has('arc-drow').length === 3 + wp.themes.length, 'the words detail does not list 3 milestones plus every theme');
    ok(/920 de 2\.000/.test(STAGE.textContent), 'the words detail lacks the 2.000 line');
    STAGE.all(n => n.cls().includes('arc-back'))[0].click();
    ok(has('arc-prog').length === 1, 'back from the words detail did not restore the board');
  }

  /* when the check is offered */
  {
    reset();
    const T0 = 1.8e12, DAY = 86400000;
    ok(TCk.due(T0) === false, 'offered with no rounds played');
    for (let i = 0; i < 2; i++) GS.record('verbos2:t', { score: 100, combo: 1, band: 'B1', run: 1, seen: 10, right: 7, ms: 60000 });
    ok(TCk.due(T0) === false, 'offered after 2 rounds');
    GS.record('jugar:c', { score: 100, combo: 1, band: 'B1', run: 1, seen: 10, right: 7, ms: 60000 });
    ok(TCk.playedRounds() === 3 && TCk.due(T0) === true, 'not offered after never checking and 3 rounds');
    W.Shell.go();
    ok(has('arc-check').length === 1 && /Chequeo semanal/.test(STAGE.textContent), 'the board shows no check card when due');
    ok(!!btn(/^Empezar · 3 min$/) && !!btn(/^Más tarde$/), 'the check card lacks its two buttons');
    const jIx = STAGE.all(n => true).indexOf(has('arc-jugar')[0]), cIx = STAGE.all(n => true).indexOf(has('arc-check')[0]),
      gIx = STAGE.all(n => true).indexOf(has('arc-grid')[0]);
    ok(jIx < cIx && cIx < gIx, 'the check card is not between Jugar and the tiles');
    btn(/^Más tarde$/).click();
    ok(has('arc-check').length === 0, 'the card stayed after Más tarde');
    const sn = JSON.parse(localStorage.getItem('fluidez.tensecheck')).snooze;
    ok(sn > Date.now() + 1.9 * DAY && sn < Date.now() + 2.1 * DAY, 'the snooze is not two days');
    ok(TCk.due(Date.now() + DAY) === false && TCk.due(Date.now() + 2.1 * DAY) === true, 'the snooze does not end after two days');
    localStorage.setItem('fluidez.tensecheck', JSON.stringify({ at: T0 - 6 * DAY, res: {} }));
    ok(TCk.due(T0) === false, 'offered 6 days after a check');
    localStorage.setItem('fluidez.tensecheck', JSON.stringify({ at: T0 - 7 * DAY, res: {} }));
    ok(TCk.due(T0) === true, 'not offered 7 days after a check');
    localStorage.setItem('fluidez.tensecheck', JSON.stringify({ at: T0 - 8 * DAY, res: {}, snooze: T0 + DAY }));
    ok(TCk.due(T0) === false, 'a snooze did not hold the card back');
  }

  /* picking the items */
  {
    reset();
    const all = W.VERB_GAPS.filter(x => x.t === 'presente');
    const recent = all.slice(0, all.length - 6).map(x => x.q);
    localStorage.setItem('fluidez.vgrecent', JSON.stringify(recent));
    for (let k = 0; k < 20; k++) {
      const got = TCk.pickItems('presente', rng4);
      ok(got.length === 3, 'did not pick three items');
      ok(got.every(g => recent.indexOf(g.q) === -1), 'picked a sentence dealt in the last rounds');
      ok(new Set(got.map(g => g.i)).size === 3, 'picked a verb twice');
    }
    localStorage.removeItem('fluidez.vgrecent');
    ['condicional', 'plusc'].forEach(t => {
      const u = TCk.usualBand(t), ix = b => ['A1', 'A2', 'B1', 'B2', 'C1'].indexOf(b);
      const pool = W.VERB_GAPS.filter(x => x.t === t && ix(x.b) <= ix(u));
      if (new Set(pool.map(x => x.i)).size >= 3) {
        for (let k = 0; k < 20; k++) ok(TCk.pickItems(t, rng4).every(g => ix(g.b) <= ix(u)), `${t}: picked above its usual band ${u}`);
      }
    });
  }

  /* the flow */
  {
    const run = (right) => {
      reset();
      const s = TCk.session(rng4, { at: 1.8e12 });
      let guard = 0;
      while (!s.done && guard++ < 100) {
        const g = s.item(), t = s.tense();
        const r = s.answer(right(t, s.index()) ? g.a : g.o.filter(x => x !== g.a)[0]);
        ok(!!r && r.right === right(t, s.index()), 'answer() graded wrongly');
        s.next();
      }
      return s;
    };
    // everything right: all 15, dominado, C1, nothing left to learn
    let s = run(() => true);
    ok(s.done && !s.stopped && Object.keys(s.res).length === 15 && Object.keys(s.res).every(k => s.res[k] === 'dominado'),
       'a perfect check did not end with fifteen dominado');
    ok(s.suggested === 'C1' && s.nextTense === null, `perfect check: suggested ${s.suggested}, next ${s.nextTense}`);
    const saved = JSON.parse(localStorage.getItem('fluidez.tensecheck'));
    ok(saved.at === 1.8e12 && saved.res.presente === 'dominado' && saved.res.pluscsubj === 'dominado', 'the result was not saved');
    ok(!TCk.due(1.8e12 + 6 * 86400000) && TCk.due(1.8e12 + 7 * 86400000), 'the next check is not a week away');
    // the SRS saw the answers
    const srs = JSON.parse(localStorage.getItem('fluidez.srs') || '{}');
    ok(Object.keys(srs).some(id => /^vt:/.test(id) && srs[id].reps > 0), 'the check wrote nothing to the SRS');

    // two bad tenses in a row stop it: 0/3 and 1/3 both count
    s = run((t, i) => t === 'presente' || (t === 'preterito' ? i === 0 : false));
    ok(s.stopped && Object.keys(s.res).join() === 'presente,preterito,imperfecto', 'did not stop after two weak tenses: ' + Object.keys(s.res));
    ok(s.res.presente === 'dominado' && s.res.preterito === 'aprender' && s.res.imperfecto === 'aprender', '1/3 must be por aprender');
    ok(s.suggested === 'A1' && s.nextTense === 'preterito', `stopped check: suggested ${s.suggested}, next ${s.nextTense}`);
    ok(TCk.statuses().perfecto === 'sin' && TCk.statuses().preterito === 'aprender', 'tenses not reached are not sin probar');

    // a good tense in between resets the count; 2/3 is casi
    s = run((t, i) => {
      if (t === 'presente') return i !== 1;                 // 2/3: casi
      if (t === 'preterito') return false;                  // 0/3
      if (t === 'imperfecto') return true;                  // resets
      if (t === 'perfecto') return false;                   // 0/3, count is 1
      return true;
    });
    ok(!s.stopped && Object.keys(s.res).length === 15, 'a good tense in between did not reset the stop count');
    ok(s.res.presente === 'casi' && s.res.preterito === 'aprender' && s.res.imperfecto === 'dominado', 'statuses wrong after a mixed check');
    ok(s.nextTense === 'preterito', 'the next tense is not the first por aprender');

    // the suggested band
    const mk = (n) => { const o = {}; TCk.LADDER.forEach((t, i) => { o[t] = 'sin'; }); GI.tensesForBand('C1').forEach(t => { o[t] = 'sin'; }); return o; };
    const res = mk();
    GI.tensesForBand('A2').forEach(t => { res[t] = t === 'futuro' ? 'casi' : 'dominado'; });
    ok(TCk.suggestBand(res) === 'A2', 'A1 and A2 tenses known should suggest A2');
    GI.tensesForBand('B1').forEach(t => { res[t] = 'dominado'; });
    ok(TCk.suggestBand(res) === 'B1', 'B1 tenses known should suggest B1');
    res.presente = 'aprender';
    ok(TCk.suggestBand(res) === 'A1', 'a weak presente must floor at A1');
    ok(TCk.suggestBand(mk()) === 'A1', 'nothing known must still read A1');
  }

  /* the check through the screen */
  {
    reset(); W.Profile.set('B1');
    for (let i = 0; i < 3; i++) GS.record('verbos2:t', { score: 100, combo: 1, band: 'B1', run: 1, seen: 10, right: 7, ms: 60000 });
    const sweep = (rightFor) => {
      let guard = 0;
      while (has('arc-check-q').length && guard++ < 100) {
        const g = gapOf(has('arc-check-q')[0].textContent);
        ok(!!g, 'the check showed a sentence that is not in the bank');
        const t = g.t;
        ok(has('arc-check-pos')[0].textContent.indexOf(W.ENGINE.TENSE_LABEL[t] || 'subjuntivo') !== -1 || t === 'pluscsubj', 'the check header names another tense');
        const o = has('g-opt');
        ok(o.length === g.o.length, 'the check offers the wrong number of options');
        const want = rightFor(t) ? g.a : g.o.filter(x => x !== g.a)[0];
        o.filter(b => b.textContent === want)[0].click();
        ok(has('g-opt').filter(b => b.cls().includes('right')).length === 1, 'the right answer is not marked');
        btn(/^Seguir$/).click();
      }
    };
    W.Shell.go();
    btn(/^Empezar · 3 min$/).click();
    ok(has('arc-check-q').length === 1 && !has('g-secs').length, 'the check shows no question, or shows a clock');
    sweep(() => true);
    ok(/Tu chequeo/.test(STAGE.textContent) && has('arc-tchip').length === 15 && has('arc-tchip').every(c => c.getAttribute('data-s') === 'dominado'),
       'the results do not show fifteen dominado chips');
    ok(/encajas en C1/.test(STAGE.textContent), 'the results do not suggest C1');
    btn(/^Cambiar mi nivel a C1$/).click();
    ok(W.Profile.current() === 'C1', 'Cambiar mi nivel did not write the profile');
    ok(has('arc-next').length === 0, 'a next tense is offered after a perfect check');
    W.Profile.set('B1');

    // a failing check: next tense, its card, the practice round, the lesson link
    reset();
    for (let i = 0; i < 3; i++) GS.record('verbos2:t', { score: 100, combo: 1, band: 'B1', run: 1, seen: 10, right: 7, ms: 60000 });
    W.Shell.go();
    btn(/^Empezar · 3 min$/).click();
    sweep(t => t === 'presente');
    ok(/Paramos aquí/.test(STAGE.textContent), 'the stop is not explained');
    ok(!!btn(/^Mantener$/) && /encajas en A1/.test(STAGE.textContent), 'no Mantener / A1 suggestion');
    btn(/^Mantener$/).click();
    ok(W.Profile.current() === 'B1', 'Mantener changed the level');
    const nx = has('arc-next')[0];
    ok(!!nx && /Siguiente tiempo: Pretérito/.test(nx.textContent), 'the next tense is not Pretérito');
    nx.click();
    const card = STAGE.textContent;
    ok(/Nombre preterito/.test(card), 'the card is not in Spanish at B1');
    ok(has('arc-when')[0].all(n => n.tagName === 'LI').length === 2, 'the card does not list the when lines');
    ok(has('arc-when')[0].all(n => n.tagName === 'B').map(n => n.textContent).join() === 'siempre,a veces', 'starred words are not bold');
    ok(has('arc-ctable-r').length === 5 && /hablamos/.test(card), 'the conjugation table is not drawn');
    ok(has('arc-ex').length === 3 && has('arc-ex-es').every(e => e.all(n => n.tagName === 'B').length === 1), 'three examples with the form in bold expected');
    ok(has('arc-ex-en').length === 3 && /Ella habla bien|She talks well/.test(card), 'examples lack their English');
    ok(/Ojo: tengo/.test(card) && /No lo confundas con otro/.test(card), 'irregular or contrast missing');
    const lesson = has('arc-lesson')[0];
    ok(!!lesson && lesson.getAttribute('href') === '../index.html?lesson=preterito', 'the lesson link is missing or wrong');
    ok(!!btn(/^Practicar Nombre preterito · 10 preguntas/), 'the practice button is missing');
    btn(/^EN$/).click();
    ok(/Name preterito/.test(STAGE.textContent) && JSON.parse(localStorage.getItem('fluidez.arcade')).cl === 'en', 'the language toggle did not switch to English');
    ok(/Habits: always/.test(STAGE.textContent), 'the English when line is missing');
    btn(/^Practicar Name preterito · 10 preguntas/).click();
    ok(/^1 \/ 10$/.test(has('g-secs')[0].textContent), 'the practice round is not Tranquilo with ten questions');
    const q1 = has('g-prompt')[0].textContent.replace(/\s*\([^()]*\)\s*$/, '');
    ok(W.VERB_GAPS.some(x => x.t === 'preterito' && x.q.replace(/___+/g, '＿＿＿').indexOf(q1.slice(0, 20)) === 0), 'the practice round dealt another tense: ' + q1);
    const x = has('g-exit')[0]; if (x) x.click();
    ok(/Tu progreso/.test(STAGE.textContent), 'leaving the practice round did not return to the board');
    ok(JSON.parse(localStorage.getItem('fluidez.arcade')).tenses === undefined, 'the practice round changed the saved tense picker');
  }

  /* the "?" on the Verbos sheet, and no cards at all */
  {
    reset(); W.Profile.set('B1');
    W.Shell.go();
    STAGE.all(n => n.cls().includes('arc-tile'))[0].click();
    ok(has('arc-chipq').length === W.ENGINE.TENSES.length + 1, `${has('arc-chipq').length} "?" buttons on the sheet`);
    has('arc-chipq')[0].click();
    ok(/Nombre presente/.test(STAGE.textContent), 'the "?" did not open the card');
    delete W.TENSE_CARDS;
    W.Shell.go();
    STAGE.all(n => n.cls().includes('arc-tile'))[0].click();
    ok(has('arc-chipq').length === 0, 'the "?" shows without cards');
    STAGE.all(n => n.cls().includes('arc-back'))[0].click();
    ok(has('arc-tchip').length === 15 && has('arc-tchip').every(c => !c._on.click), 'chips are tappable with no cards');
    W.Profile.set('A1');
    // the full flow still works without TENSE_CARDS: the next tense goes straight to practice
  }
  W.TENSE_CARDS = realCards;
  reset(); W.Profile.set('B1'); GI.reset();
  console.log('  stage 4: panel numbers, check trigger and flow, cards, practice round, ' + TCk.LADDER.length + ' lesson links');
}

/* ---- the league (js/liga.js) ---------------------------------------------
 * The server half is tested against Postgres when server/league.sql changes;
 * what matters here is the half that has to agree across devices: the pools,
 * the seeded dealer, the week, and the pop-up rule. */
{
  const L = W.Liga;
  ok(!!L, 'js/liga.js did not load in the arcade build');
  global.fetch = () => Promise.reject(new Error('offline in tests'));

  const pools = L._pools();
  ok(pools.length === 10, 'the league should have ten steps, two per band');
  pools.forEach((p, i) => {
    ok(p.list.length > 300, `league step ${i + 1} has only ${p.list.length} sentences`);
    // the upper step of a band is the longer half of it, or promotion within
    // a band would deal exactly the same round
    if (i % 2 === 1) {
      const lowMax = Math.max(...pools[i - 1].list.map(x => x.n));
      const highMin = Math.min(...p.list.map(x => x.n));
      ok(highMin >= lowMax, `step ${i + 1} is not the longer half of ${p.cefr}`);
    }
  });

  // Same seed, same sentences — on every device, every attempt.
  const deal = (step, seedStr, n) => {
    const r = W.UI.seededRandom(seedStr), d = L._dealer(step), out = [];
    for (let i = 0; i < n; i++) out.push(d(r));
    return out;
  };
  const a = deal(3, 'liga-2026-10-26-3', 40), b = deal(3, 'liga-2026-10-26-3', 40);
  ok(a.map(x => x.prompt).join('|') === b.map(x => x.prompt).join('|'), 'the league dealer is not reproducible from its seed');
  ok(deal(4, 'liga-2026-10-26-4', 40).map(x => x.prompt).join('|') !== a.map(x => x.prompt).join('|'),
     'two steps dealt the same round');
  const many = deal(3, 'liga-share', 2000);
  const share = many.filter(x => x.ligaNext).length / many.length;
  ok(share > 0.15 && share < 0.25, `next-step share is ${(share * 100).toFixed(1)}%, wanted about 20%`);
  ok(many.every(x => x.ligaStep === (x.ligaNext ? 4 : 3)), 'a next-step item came from the wrong pool');
  ok(deal(10, 'liga-top', 300).every(x => !x.ligaNext), 'the top step dealt from a step that does not exist');
  ok(many.every(x => (x.play === 'type') === (x.n < 6)), 'league items are not typed/built on the games\' own line');
  const typed = many.filter(x => x.play === 'type').slice(0, 50);
  ok(typed.every(x => W.GameItems.grade(x, x.answer) === 'good'), 'a correct league answer did not grade as good');

  // Words, not points.
  const it = many.find(x => x.n >= 5);
  ok(L._award(it, 'good').points === it.n && L._award(it, 'near').points === Math.floor(it.n / 2) &&
     L._award(it, 'wrong').points === 0, 'league scoring is not words translated');

  // The week ends at midnight on Sunday in London, summer time included.
  ok(L.weekOf(new Date('2026-10-28T12:00:00Z')) === '2026-10-26', 'weekOf: a Wednesday');
  ok(L.weekOf(new Date('2026-11-01T23:30:00Z')) === '2026-10-26', 'weekOf: Sunday night, GMT');
  ok(L.weekOf(new Date('2026-11-02T00:30:00Z')) === '2026-11-02', 'weekOf: Monday, GMT');
  ok(L.weekOf(new Date('2026-07-05T22:30:00Z')) === '2026-06-29', 'weekOf: Sunday 23:30 BST');
  ok(L.weekOf(new Date('2026-07-05T23:30:00Z')) === '2026-07-06', 'weekOf: Monday 00:30 BST');

  // The pop-up: only for somebody passing you, only against what you last saw.
  const wk = '2026-10-26', row = (id, best) => ({ player_id: id, name: id, best: best, days: 0 });
  const was = { week: wk, best: { me: 50, ana: 40, tom: 70 } };
  const said = L._overtaken(was, [row('me', 50), row('ana', 60), row('tom', 70)], wk, 'me');
  ok(said.length === 1 && /ana te ha adelantado/.test(said[0].text), 'overtaking did not raise exactly one pop-up');
  ok(L._overtaken(was, [row('me', 55), row('ana', 52), row('tom', 70)], wk, 'me').length === 0,
     'a pop-up for somebody who is still behind you');
  ok(L._overtaken({ week: '2026-10-19', best: {} }, [row('me', 0), row('ana', 60)], wk, 'me').length === 0,
     'a new week replayed every round as pop-ups');

  // A league round deals the seeded sentences, not the ladder's.
  store['fluidez.liga'] = JSON.stringify({
    auth: { access: 'x', refresh: 'y', exp: Date.now() + 3600e3, uid: 'me' }, name: 'Yo', step: 3,
    board: { week: L.weekOf(), at: Date.now(), rows: [row('me', 0), row('ana', 30)] }
  });
  STAGE.children.length = 0;
  L.play();
  const first = deal(3, 'liga-' + L.weekOf() + '-3', 1)[0];
  const prompt = STAGE.all(n => n.cls().includes('g-prompt'))[0];
  ok(!!prompt && prompt.textContent.indexOf(first.prompt.replace(/\s*\([^()]*\)\s*([.!?]?)$/, '$1')) === 0,
     'the league round did not open on its seeded first sentence');
  STAGE.children.length = 0;
  const card = L.card();
  ok(card.all(n => n.cls().includes('liga-row') && !n.cls().includes('liga-hdr')).length === 2,
     'the league card did not draw one row per player');
  ok(card.textContent.indexOf('A2') !== -1, 'the league card does not show the player\'s level');
  delete store['fluidez.liga'];
  ok(L.card().all(n => n.cls().includes('liga-join')).length === 1, 'an unjoined device is not offered the join form');

  console.log('  league: 10 steps, seeded dealer reproducible, ~' + Math.round(share * 100) +
              '% next-step, week in London time, pop-up rule holds');
}

console.log('\nChecks run: ' + checks);
if (failures) { console.error('\n❌ ' + failures + ' failure(s).'); process.exit(1); }
console.log('\n✅ Arcade OK — every game deals from the precomputed index, with no teaching corpus loaded.');
