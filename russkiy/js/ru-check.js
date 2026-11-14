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
   * first (stable inside a band), and none above the learner's band.
   * opts.all keeps every band. */
  function ladder(opts) {
    var cap = playerIx();
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
    // the learner's own level by default; opts.all is the optional run through everything
    var lad = opts.ladder || ladder(opts.all ? { all: true } : null);
    var s = { res: {}, score: {}, done: false, stopped: false, allRun: !!opts.all }, ti = -1, items = [], ii = 0, right = 0, weak = 0, answered = null;

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
      // units this run did not reach keep what an earlier check found
      var old = st.res || {};
      st.at = s.at; st.res = {};
      UNITS.forEach(function (u) { var v = s.res[u.id] || old[u.id]; if (v) st.res[u.id] = v; });
      s.all = st.res;
      st.snooze = 0;
      save(st);
      s.suggested = suggestBand(st.res);          // over every band, so untried units above hold it back
      s.nextUnit = nextUnit(st.res, ladder({ all: true }));   // may point past the learner's band
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
      // two misses in a unit end the check there: no third question, no more units
      var miss = ii - right;
      if (ii < items.length && miss < 2) return false;
      var u = lad[ti], n = ii;
      s.res[u.id] = miss >= 2 ? 'aprender' : statusOf(right, n); s.score[u.id] = right + '/' + n;
      if (miss >= 2) { s.stopped = true; s.stopAt = u.id; finish(); return true; }
      if (!startUnit()) { finish(); return true; }
      return false;
    };
    if (!startUnit()) finish();
    return s;
  }

  /* ---- moving up on its own ----------------------------------------------------
   * A learner moves up a band once every unit with sentences at their band has
   * NEED right answers on those sentences (rounds and checks alike: the SRS keeps reps and lapses per
   * item, and a unit's items are graded under GAItems.gapId(row)) and the last
   * check did not find one of them weak. "Stay" holds them for a week. */
  var NEED = 100;
  function srsStore() {
    var k = window.SRS && window.SRS.KEY;
    try { return (k && JSON.parse(localStorage.getItem(k))) || {}; } catch (e) { return {}; }
  }
  /* Right answers in a unit, counting only its rows at band index bi (all rows
   * when bi is null). Units spread over every band, so a level is measured on
   * its own sentences, not on a unit's easiest ones. */
  function rowsAt(u, bi) {
    return unitRows(u).filter(function (g) { return bi == null || bandIx(g.b) === bi; });
  }
  function correctIn(u, bi) {
    var s = srsStore(), n = 0;
    rowsAt(u, bi).forEach(function (g) {
      var c = s[GI().gapId(g)];
      if (c) n += Math.max(0, (c.reps || 0) - (c.lapses || 0));
    });
    return n;
  }
  /* The units a band is measured on: those with three or more rows at it. */
  function newUnitsOf(band) {
    var i = BANDS.indexOf(band);
    return i < 0 ? [] : UNITS.filter(function (u) { return rowsAt(u, i).length >= 3; });
  }
  /* What a unit needs at a band: NEED, or three right per row when it has few. */
  function needFor(u, bi) { return Math.min(NEED, 3 * rowsAt(u, bi).length); }
  /* The band to move up to now, or null. `at` lets a test pass the clock. */
  function moveUp(at) {
    var t = at == null ? now() : at;
    var cur = window.Profile ? window.Profile.current() : 'A1', i = BANDS.indexOf(cur);
    if (i < 0 || i >= BANDS.length - 1 || !GI()) return null;
    var st = load();
    if (st.hold && st.hold.band === cur && t < st.hold.until) return null;
    var res = st.res || {}, us = newUnitsOf(cur);
    if (!us.length) return null;                       // nothing to measure: never move up on it
    var ok = us.every(function (u) { return correctIn(u, i) >= needFor(u, i) && res[u.id] !== 'aprender'; });
    return ok ? BANDS[i + 1] : null;
  }
  function hold(band, at) {
    var st = load(); st.hold = { band: band, until: (at == null ? now() : at) + 7 * DAY }; save(st);
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
    suggestBand: suggestBand, nextUnit: nextUnit,
    NEED: NEED, correctIn: correctIn, newUnitsOf: newUnitsOf, moveUp: moveUp, hold: hold, needFor: needFor
  };
})();
