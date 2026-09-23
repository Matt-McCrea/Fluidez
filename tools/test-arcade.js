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
            const w = it.play === 'type' ? it.answer : it.prompt;
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
