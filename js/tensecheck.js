/* ============================================================================
 * TENSE CHECK — the logic behind the arcade's progress panel, the weekly check
 * and the tense cards. No DOM here: js/arcade.js draws, this decides, and the
 * tests drive it directly.
 *
 *   PROGRESS  how much of the common Spanish the shared SRS says you know.
 *   CHECK     once a week: three tapped sentences per tense, in ladder order,
 *             no clock and no score. It stops when two tenses in a row go
 *             badly, because asking a B1 question of someone who has just
 *             missed the preterite twice is a test of patience.
 *   MAP       tense key -> the grammar lesson in the full app that teaches it.
 *
 * Storage: fluidez.tensecheck = { at, res: {tense: status}, snooze }, listed in
 * js/settings.js KEYS. Grades go to the SRS as ordinary answers (vt:<inf>:<t>).
 * ========================================================================== */
window.TenseCheck = (function () {
  var KEY = 'fluidez.tensecheck';
  var DAY = 86400000;
  var LADDER = ['presente', 'preterito', 'imperfecto', 'perfecto', 'futuro', 'imperativo',
    'condicional', 'plusc', 'presubj', 'impneg', 'impsubj', 'futperf', 'perfsubj', 'condperf', 'pluscsubj'];
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var STATUS_LABEL = { dominado: 'dominado', casi: 'casi', aprender: 'por aprender', sin: 'sin probar' };

  /* The grammar lesson in the full app (index.html?lesson=<id>) for each tense.
   * presente..condperf with a lesson of their own id are the generated tense
   * lessons; the five others fall back to the strand lesson that teaches the
   * tense (js/lessonrun.js resolves both through lessonById). */
  var LESSON = {
    presente: 'presente', preterito: 'preterito', imperfecto: 'imperfecto',
    perfecto: 'gr-preterito-perfecto-a2', futuro: 'futuro',
    imperativo: 'gr-imperativo-forma-a2', condicional: 'condicional',
    plusc: 'gr-pluscuamperfecto-b1', presubj: 'gr-presente-subjuntivo-b1',
    impneg: 'impneg', impsubj: 'impsubj', futperf: 'futperf',
    perfsubj: 'perfsubj', condperf: 'condperf', pluscsubj: 'gr-pluscuamsubj-b2'
  };
  function lessonFor(tense) { return LESSON[tense] || null; }
  function lessonUrl(tense) {
    var id = lessonFor(tense);
    return id ? '../index.html?lesson=' + encodeURIComponent(id) : null;
  }

  function now() { return Date.now(); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function srsStore() { try { return JSON.parse(localStorage.getItem('fluidez.srs')) || {}; } catch (e) { return {}; } }
  function GI() { return window.GameItems; }

  /* ---- progress ---------------------------------------------------------- */
  function thousands(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  /* Words: known count inside each milestone, plus every theme. A card is
   * known once it has a right answer, the same test the games use. */
  function wordProgress() {
    var G = GI() && GI().grindList ? GI().grindList() : { list: [], byTheme: {} };
    var store = srsStore(), L = G.list;
    function known(e) { var c = store[e.id]; return !!(c && typeof c === 'object' && c.reps > 0); }
    var total = 0;
    L.forEach(function (e) { if (known(e)) total++; });
    var marks = [1000, 2000, 5000].map(function (m) {
      var of = Math.min(m, L.length), n = 0;
      for (var i = 0; i < of; i++) if (known(L[i])) n++;
      return { m: m, n: n, of: of };
    });
    var next = marks.filter(function (x) { return x.n < x.of; })[0] || marks[marks.length - 1];
    var themes = Object.keys(G.byTheme || {}).map(function (id) {
      var arr = G.byTheme[id], n = 0;
      arr.forEach(function (e) { if (known(e)) n++; });
      return { id: id, n: n, of: arr.length };
    });
    return { total: total, marks: marks, next: next, themes: themes };
  }

  /* Verbs: distinct infinitives with a vt: card answered right once. */
  function verbsKnown() {
    var store = srsStore(), seen = {}, n = 0;
    Object.keys(store).forEach(function (id) {
      if (id.indexOf('vt:') !== 0) return;
      var c = store[id];
      if (!(c && typeof c === 'object' && c.reps > 0)) return;
      var inf = id.split(':')[1];
      if (inf && !seen[inf]) { seen[inf] = 1; n++; }
    });
    return n;
  }
  function phraseProgress() {
    var pc = GI() && GI().phraseCoverage ? GI().phraseCoverage() : { n: 0, of: 0 };
    return { n: pc.n, of: pc.of };
  }
  function progress() {
    return { words: wordProgress(), verbs: verbsKnown(), phrases: phraseProgress(), tenses: statuses() };
  }

  /* ---- the stored check ---------------------------------------------------- */
  function statuses() {
    var r = load().res || {}, out = {};
    LADDER.forEach(function (t) { out[t] = r[t] || 'sin'; });
    return out;
  }
  function lastCheckAt() { return load().at || 0; }
  function playedRounds() {
    var GS = window.GameScore, G = window.Games, n = 0;
    if (!GS || !GS.stats || !G) return 0;
    G.GAMES.filter(function (g) { return g.shelf; }).forEach(function (g) {
      [g.key, g.key + ':t', g.key + ':c'].forEach(function (k) {
        try { n += (GS.stats(k).plays || 0); } catch (e) {}
      });
    });
    return n;
  }
  /* 7+ days since the last check, or never checked and 3 rounds played; a
   * "Más tarde" holds it back for two days. `at` lets a test pass the clock. */
  function due(at) {
    var t = at == null ? now() : at, s = load();
    if (s.snooze && t < s.snooze) return false;
    if (s.at) return t - s.at >= 7 * DAY;
    return playedRounds() >= 3;
  }
  function snooze(at) { var s = load(); s.snooze = (at == null ? now() : at) + 2 * DAY; save(s); }

  /* ---- grading a tense ------------------------------------------------------ */
  function statusOf(right, n) {
    var miss = n - right;
    return miss <= 0 ? 'dominado' : miss === 1 ? 'casi' : 'aprender';
  }
  function bandIx(b) { var i = BANDS.indexOf(b); return i < 0 ? 0 : i; }
  function usualBand(tense) {
    for (var i = 0; i < BANDS.length; i++) {
      if (GI().tensesForBand(BANDS[i]).indexOf(tense) !== -1) return BANDS[i];
    }
    return 'C1';
  }
  function recentQs() {
    try { var r = JSON.parse(localStorage.getItem('fluidez.vgrecent')); return Array.isArray(r) ? r : []; } catch (e) { return []; }
  }
  /* Three items for a tense: at or below the tense's usual band first, none
   * dealt in recent rounds, three different verbs. Short of that it widens
   * (recent ones, higher bands) rather than testing a tense with fewer. */
  function pickItems(tense, rng, n) {
    rng = rng || Math.random; n = n || 3;
    var all = (window.VERB_GAPS || []).filter(function (x) { return x.t === tense; });
    if (!all.length) return [];
    var recent = recentQs(), ub = bandIx(usualBand(tense));
    function shuffle(a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
    var tiers = [
      all.filter(function (x) { return bandIx(x.b) <= ub && recent.indexOf(x.q) === -1; }),
      all.filter(function (x) { return recent.indexOf(x.q) === -1; }),
      all
    ];
    var out = [], infs = {};
    tiers.forEach(function (tier) {
      shuffle(tier).forEach(function (x) {
        if (out.length >= n || infs[x.i] || out.indexOf(x) !== -1) return;
        infs[x.i] = 1; out.push(x);
      });
    });
    // fewer than n different verbs exist: allow repeats of a verb before giving up
    tiers.forEach(function (tier) {
      shuffle(tier).forEach(function (x) { if (out.length < n && out.indexOf(x) === -1) out.push(x); });
    });
    return out;
  }

  function gradeSrs(g, right) {
    var S = window.SRS, id = 'vt:' + g.i + ':' + g.t;
    if (!S) return;
    try {
      S.enrol(id);
      if (right) S.grade(id, true);
    } catch (e) {}
  }

  /* ---- the session ------------------------------------------------------------
   * s.item() is the current question, s.answer(choice) grades it, s.next()
   * moves on; when a tense's items are done its status is recorded, and the run
   * ends at the end of the ladder or after two weak tenses in a row. */
  function session(rng, opts) {
    opts = opts || {};
    var ladder = (opts.ladder || LADDER).filter(function (t) {
      return (window.VERB_GAPS || []).some(function (x) { return x.t === t; });
    });
    var s = { res: {}, score: {}, done: false, stopped: false }, ti = -1, items = [], ii = 0, right = 0, weak = 0, answered = null;

    function startTense() {
      while (++ti < ladder.length) {
        items = pickItems(ladder[ti], rng, 3);
        if (items.length) { ii = 0; right = 0; return true; }
      }
      return false;
    }
    function finish() {
      s.done = true; s.at = opts.at == null ? now() : opts.at;
      var st = load();
      st.at = s.at; st.res = {}; LADDER.forEach(function (t) { if (s.res[t]) st.res[t] = s.res[t]; });
      st.snooze = 0;
      save(st);
      s.suggested = suggestBand(s.res);
      s.nextTense = nextTense(s.res);
    }
    s.tense = function () { return ladder[ti] || null; };
    s.index = function () { return ii; };
    s.count = function () { return items.length; };
    s.step = function () { return ti; };
    s.steps = function () { return ladder.length; };
    s.item = function () { return s.done ? null : items[ii] || null; };
    s.answer = function (choice) {
      var g = items[ii];
      if (!g || answered !== null) return null;
      var ok = String(choice) === g.a || (g.x || []).indexOf(String(choice)) !== -1;
      answered = ok;
      if (ok) right++;
      gradeSrs(g, ok);
      return { right: ok, answer: g.a, why: g.w || null, whyEn: g.we || null };
    };
    s.next = function () {
      if (s.done || answered === null) return s.done;
      answered = null; ii++;
      if (ii < items.length) return false;
      var t = ladder[ti], n = items.length;
      s.res[t] = statusOf(right, n); s.score[t] = right + '/' + n;
      weak = (n - right) >= 2 ? weak + 1 : 0;
      if (weak >= 2) { s.stopped = true; finish(); return true; }
      if (!startTense()) { finish(); return true; }
      return false;
    };
    if (!startTense()) finish();
    return s;
  }

  /* The highest band whose tenses (cumulative) are all dominado or casi. */
  function suggestBand(res) {
    var best = 'A1';
    for (var i = 0; i < BANDS.length; i++) {
      var ts = GI().tensesForBand(BANDS[i]);
      var okAll = ts.every(function (t) { return res[t] === 'dominado' || res[t] === 'casi'; });
      if (!okAll) break;
      best = BANDS[i];
    }
    return best;
  }
  /* The first tense to learn: por aprender, else (after a stop) sin probar. */
  function nextTense(res) {
    var i, t;
    for (i = 0; i < LADDER.length; i++) { t = LADDER[i]; if (res[t] === 'aprender') return t; }
    for (i = 0; i < LADDER.length; i++) { t = LADDER[i]; if (!res[t] || res[t] === 'sin') return t; }
    return null;
  }

  return {
    KEY: KEY, LADDER: LADDER, BANDS: BANDS, STATUS_LABEL: STATUS_LABEL, LESSON: LESSON,
    lessonFor: lessonFor, lessonUrl: lessonUrl,
    progress: progress, wordProgress: wordProgress, verbsKnown: verbsKnown, phraseProgress: phraseProgress,
    thousands: thousands,
    statuses: statuses, lastCheckAt: lastCheckAt, playedRounds: playedRounds, due: due, snooze: snooze,
    statusOf: statusOf, pickItems: pickItems, session: session, suggestBand: suggestBand, nextTense: nextTense,
    usualBand: usualBand
  };
})();
