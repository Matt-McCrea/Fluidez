/* ============================================================================
 * RU CHECK: the logic behind the progress panel and the weekly check (ported from
 * Fluidez js/tensecheck.js). No DOM here: ru-arcade.js draws, this decides.
 *
 *   PROGRESS  how much the shared SRS says you know.
 *   CHECK     once a week: three tapped sentences per UNIT (a verb tense or a
 *             grammar topic), easiest first, no clock and no score. It stops when
 *             two units in a row go badly, then offers the next card to read.
 *   UNITS     the ladder: afal tenses and the grammar topics of the banks.
 *
 * Storage: svobodno.check = { at, res: { unit: status }, snooze }. Answers go to the
 * SRS as ordinary taps.
 * ========================================================================== */
window.RUCheck = (function () {
  var KEY = 'svobodno.check';
  var DAY = 86400000;
  var BANDS = window.RUCore.BANDS;
  var STATUS_LABEL = { dominado: 'got it', casi: 'nearly', aprender: 'to learn', sin: 'not tried' };

  /* unit id -> { k: bank kind, t: topic filter or null for the whole kind, card: RU_CARDS key,
   * label: {ru, en} }. The order here is the order of the ladder inside a band. */
  var UNITS = [
    { id: 'pres', k: 'glagoly', t: 'pres', card: 'pres', label: { ru: 'Настоя́щее', en: 'Present' } },
    { id: 'past', k: 'glagoly', t: 'past', card: 'past', label: { ru: 'Проше́дшее', en: 'Past' } },
    { id: 'fut',  k: 'glagoly', t: 'fut',  card: 'fut',  label: { ru: 'Бу́дущее', en: 'Future' } },
    { id: 'imp',  k: 'glagoly', t: 'imp',  card: 'imp',  label: { ru: 'Повели́тельное', en: 'Commands' } },
    { id: 'padezhi',   k: 'padezhi',   t: null, card: 'padezhi',   label: { ru: 'Падежи́', en: 'Cases' } },
    { id: 'vid',       k: 'vid',       t: null, card: 'vid',       label: { ru: 'Вид', en: 'Aspect' } },
    { id: 'dvizhenie', k: 'dvizhenie', t: null, card: 'dvizhenie', label: { ru: 'Движе́ние', en: 'Going' } },
    { id: 'chisla',    k: 'chisla',    t: null, card: 'chisla',    label: { ru: 'Числа́', en: 'Numbers' } }
  ];
  function unitById(id) { return UNITS.filter(function (u) { return u.id === id; })[0] || null; }
  // a card key for any (kind, topic) pair, for the "read the card" link on a practice round
  function cardFor(kind, t) {
    for (var i = 0; i < UNITS.length; i++) if (UNITS[i].k === kind && (UNITS[i].t === t || t == null)) return UNITS[i].card;
    return null;
  }

  function now() { return Date.now(); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function GI() { return window.RUItems; }
  function bandIx(b) { var i = BANDS.indexOf(b); return i < 0 ? 0 : i; }
  function playerIx() { return bandIx(window.Profile ? window.Profile.current() : 'A1'); }

  function unitRows(u) {
    return GI().bank(u.k).filter(function (g) { return u.t == null || g.t === u.t; });
  }
  function unitBand(u) {
    var rows = unitRows(u), best = null;
    rows.forEach(function (g) { var i = bandIx(g.b); if (best === null || i < best) best = i; });
    return best === null ? 0 : best;
  }

  /* The ladder for this learner: units with at least three sentences, easiest band
   * first (stable inside a band), and not more than a band above the learner's.
   * opts.all keeps every band. */
  function ladder(opts) {
    var cap = playerIx() + 1;
    var out = UNITS.filter(function (u) { return unitRows(u).length >= 3; })
      .map(function (u, i) { return { u: u, b: unitBand(u), i: i }; })
      .filter(function (x) { return (opts && opts.all) || x.b <= cap; });
    out.sort(function (a, b) { return a.b - b.b || a.i - b.i; });
    return out.map(function (x) { return x.u; });
  }

  // ---- progress ---------------------------------------------------------------
  function statuses() {
    var r = load().res || {}, out = {};
    UNITS.forEach(function (u) { out[u.id] = r[u.id] || 'sin'; });
    return out;
  }
  function lastCheckAt() { return load().at || 0; }
  function progress() {
    return { words: GI().coverage(null), phrases: GI().phraseCoverage(), verbs: GI().verbsKnown(), units: statuses() };
  }

  var GAME_KEYS = ['igrat', 'glagoly', 'slova', 'frazy', 'padezhi', 'vid', 'dvizhenie', 'chisla'];
  function playedRounds() {
    var GS = window.GameScore, n = 0;
    if (!GS || !GS.stats) return 0;
    GAME_KEYS.forEach(function (k) {
      [k, k + ':t', k + ':c'].forEach(function (key) { try { n += (GS.stats(key).plays || 0); } catch (e) {} });
    });
    return n;
  }
  /* 7+ days since the last check, or never checked and 3 rounds played; "Later"
   * holds it back a day. `at` lets a test pass the clock. */
  function due(at) {
    var t = at == null ? now() : at, s = load();
    if (!ladder().length) return false;
    if (s.snooze && t < s.snooze) return false;
    if (s.at) return t - s.at >= 7 * DAY;
    // never checked: after 3 rounds, or a week after the app was first opened,
    // whichever comes first (someone who only does phrases still gets one)
    if (!s.first) { s.first = t; save(s); }
    return playedRounds() >= 3 || t - s.first >= 7 * DAY;
  }
  function snooze(at) { var s = load(); s.snooze = (at == null ? now() : at) + DAY; save(s); }

  // ---- grading a unit ------------------------------------------------------------
  function statusOf(right, n) {
    var miss = n - right;
    return miss <= 0 ? 'dominado' : miss === 1 ? 'casi' : 'aprender';
  }
  function recentQs() {
    try { var r = JSON.parse(localStorage.getItem('svobodno.recent')); return Array.isArray(r) ? r : []; } catch (e) { return []; }
  }
  /* Three items for a unit: at or below its usual band first, none dealt lately,
   * different verbs for afal. Short of that it widens rather than testing with fewer. */
  function pickItems(u, rng, n) {
    rng = rng || Math.random; n = n || 3;
    var all = unitRows(u);
    if (!all.length) return [];
    var recent = recentQs(), ub = Math.max(unitBand(u), playerIx());
    function shuffle(a) { return window.RUCore.shuffle(a, rng); }
    var tiers = [
      all.filter(function (x) { return bandIx(x.b) <= ub && recent.indexOf(x.q) === -1; }),
      all.filter(function (x) { return recent.indexOf(x.q) === -1; }),
      all
    ];
    var out = [], seen = {};
    function key(x) { return x.v || x.q; }
    tiers.forEach(function (tier) {
      shuffle(tier).forEach(function (x) {
        if (out.length >= n || seen[key(x)] || out.indexOf(x) !== -1) return;
        seen[key(x)] = 1; out.push(x);
      });
    });
    tiers.forEach(function (tier) {
      shuffle(tier).forEach(function (x) { if (out.length < n && out.indexOf(x) === -1) out.push(x); });
    });
    return out;
  }
  function gradeSrs(g, right) {
    var S = window.SRS, id = GI().gapId(g);
    if (!S) return;
    try { S.enrol(id); if (right) S.grade(id, true); } catch (e) {}
  }

  /* ---- the session ------------------------------------------------------------------
   * s.item() is the current bank row, s.answer(choice) grades it, s.next() moves
   * on; when a unit's items are done its status is recorded, and the run ends at
   * the end of the ladder or after two weak units in a row. */
  function session(rng, opts) {
    opts = opts || {};
    var lad = opts.ladder || ladder();
    var s = { res: {}, score: {}, done: false, stopped: false }, ti = -1, items = [], ii = 0, right = 0, weak = 0, answered = null;

    function startUnit() {
      while (++ti < lad.length) {
        items = pickItems(lad[ti], rng, 3);
        if (items.length) { ii = 0; right = 0; return true; }
      }
      return false;
    }
    function finish() {
      s.done = true; s.at = opts.at == null ? now() : opts.at;
      var st = load();
      st.at = s.at; st.res = {};
      UNITS.forEach(function (u) { if (s.res[u.id]) st.res[u.id] = s.res[u.id]; });
      st.snooze = 0;
      save(st);
      s.suggested = suggestBand(s.res, lad);
      s.nextUnit = nextUnit(s.res, lad);
    }
    s.unit = function () { return lad[ti] || null; };
    s.index = function () { return ii; };
    s.count = function () { return items.length; };
    s.step = function () { return ti; };
    s.steps = function () { return lad.length; };
    s.item = function () { return s.done ? null : items[ii] || null; };
    s.answer = function (choice) {
      var g = items[ii];
      if (!g || answered !== null) return null;
      var ok = String(choice) === g.a || (g.x || []).indexOf(String(choice)) !== -1;
      answered = ok;
      if (ok) right++;
      gradeSrs(g, ok);
      return { right: ok, answer: g.a, why: g.w || null, peek: g.e || null };
    };
    s.next = function () {
      if (s.done || answered === null) return s.done;
      answered = null; ii++;
      if (ii < items.length) return false;
      var u = lad[ti], n = items.length;
      s.res[u.id] = statusOf(right, n); s.score[u.id] = right + '/' + n;
      weak = (n - right) >= 2 ? weak + 1 : 0;
      if (weak >= 2) { s.stopped = true; finish(); return true; }
      if (!startUnit()) { finish(); return true; }
      return false;
    };
    if (!startUnit()) finish();
    return s;
  }

  /* The highest band whose units (cumulative, those on the ladder) are all dominado or casi. */
  function suggestBand(res, lad) {
    lad = lad || ladder({ all: true });
    var best = 'A1';
    for (var i = 0; i < BANDS.length; i++) {
      var ok = lad.every(function (u) {
        return unitBand(u) > i || res[u.id] === 'dominado' || res[u.id] === 'casi';
      });
      if (!ok) break;
      best = BANDS[i];
    }
    return best;
  }
  /* The first unit to learn: por aprender, else (after a stop) not tried. */
  function nextUnit(res, lad) {
    lad = lad || ladder();
    var i;
    for (i = 0; i < lad.length; i++) if (res[lad[i].id] === 'aprender') return lad[i];
    for (i = 0; i < lad.length; i++) if (!res[lad[i].id] || res[lad[i].id] === 'sin') return lad[i];
    return null;
  }

  return {
    KEY: KEY, UNITS: UNITS, BANDS: BANDS, STATUS_LABEL: STATUS_LABEL, GAME_KEYS: GAME_KEYS,
    unitById: unitById, cardFor: cardFor, ladder: ladder, unitBand: unitBand,
    progress: progress, statuses: statuses, lastCheckAt: lastCheckAt, playedRounds: playedRounds,
    due: due, snooze: snooze, statusOf: statusOf, pickItems: pickItems, session: session,
    suggestBand: suggestBand, nextUnit: nextUnit
  };
})();
