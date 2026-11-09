/* ============================================================================
 * GA CHECK: the logic behind the progress panel and the weekly check (ported from
 * Fluidez js/tensecheck.js). No DOM here: ga-arcade.js draws, this decides.
 *
 *   PROGRESS  how much the shared SRS says you know.
 *   CHECK     once a week: three tapped sentences per UNIT (a verb tense or a
 *             grammar topic), easiest first, no clock and no score. It stops when
 *             two units in a row go badly, then offers the next card to read.
 *   UNITS     the ladder: briathra tenses and the grammar topics of the banks.
 *
 * Storage: liofa.check = { at, res: { unit: status }, snooze }. Answers go to the
 * SRS as ordinary taps.
 * ========================================================================== */
window.GACheck = (function () {
  var KEY = 'liofa.check';
  var DAY = 86400000;
  var BANDS = window.GACore.BANDS;
  var STATUS_LABEL = { dominado: 'got it', casi: 'nearly', aprender: 'to learn', sin: 'not tried' };

  /* unit id -> { k: bank kind, t: topic filter or null for the whole kind, card: GA_CARDS key,
   * label: {ga, en} }. The order here is the order of the ladder inside a band. */
  var UNITS = [
    { id: 'lait',    k: 'briathra', t: 'lait',      card: 'lait',    label: { ga: 'Láithreach', en: 'Present' } },
    { id: 'caite',   k: 'briathra', t: 'caite',     card: 'caite',   label: { ga: 'Caite', en: 'Past' } },
    { id: 'fhaist',  k: 'briathra', t: 'fhaist',    card: 'fhaist',  label: { ga: 'Fáistineach', en: 'Future' } },
    { id: 'coinn',   k: 'briathra', t: 'coinn',     card: 'coinn',   label: { ga: 'Coinníollach', en: 'Conditional' } },
    { id: 'gnath',   k: 'briathra', t: 'gnath',     card: 'gnath',   label: { ga: 'Gnáthchaite', en: 'Past habitual' } },
    { id: 'gnathlait', k: 'briathra', t: 'gnathlait', card: 'gnathlait', label: { ga: 'Gnáthláithreach', en: 'Habitual present' } },
    { id: 'ord',     k: 'briathra', t: 'ord',       card: 'ord',     label: { ga: 'Ordaitheach', en: 'Imperative' } },
    { id: 'saor',    k: 'briathra', t: 'saor',      card: 'saor',    label: { ga: 'An briathar saor', en: 'Autonomous' } },
    { id: 'ag',      k: 'briathra', t: 'ag',        card: 'ag',      label: { ga: 'Ag + ainm briathartha', en: 'ag + verbal noun' } },
    { id: 'tais:ta', k: 'tais', t: 'ta',  card: 'copail', label: { ga: 'An briathar bí', en: 'The verb bí' } },
    { id: 'tais:is', k: 'tais', t: 'is',  card: 'copail', label: { ga: 'An chopail', en: 'The copula' } },
    { id: 'tais:ba', k: 'tais', t: 'ba',  card: 'copail', label: { ga: 'Ba', en: 'Ba (copula, past)' } },
    { id: 'tais:ea', k: 'tais', t: 'ea',  card: 'copail', label: { ga: 'Is ea / ní hea', en: 'Is ea / ní hea' } },
    { id: 'tais:mo', k: 'tais', t: 'mo',  card: 'copail', label: { ga: 'I mo + ainmfhocal', en: 'i mo + noun' } },
    { id: 'forainm', k: 'forainm', t: null, card: 'forainm', label: { ga: 'Forainmneacha', en: 'Prepositional pronouns' } },
    { id: 'seimhiu:poss', k: 'seimhiu', t: 'poss', card: 'seimhiu', label: { ga: 'Aidiachtaí sealbhacha', en: 'Possessives' } },
    { id: 'seimhiu:art',  k: 'seimhiu', t: 'art',  card: 'prefix',  label: { ga: 'An t-alt', en: 'The article' } },
    { id: 'seimhiu:prep', k: 'seimhiu', t: 'prep', card: 'seimhiu', label: { ga: 'Réamhfhocail', en: 'Prepositions' } },
    { id: 'seimhiu:verb', k: 'seimhiu', t: 'verb', card: 'dep',     label: { ga: 'Míreanna briathartha', en: 'Verb particles' } },
    { id: 'seimhiu:num',  k: 'seimhiu', t: 'num',  card: 'uimhreacha', label: { ga: 'Uimhreacha', en: 'Numbers' } },
    { id: 'seimhiu:adj',  k: 'seimhiu', t: 'adj',  card: 'seimhiu', label: { ga: 'Aidiachtaí', en: 'Adjectives' } },
    { id: 'seimhiu:h',    k: 'seimhiu', t: 'h',    card: 'prefix',  label: { ga: 'Réimír h', en: 'h-prefix' } },
    { id: 'freagair:bi',   k: 'freagair', t: 'bi',   card: 'freagair', label: { ga: 'Freagair: bí', en: 'Answering: bí' } },
    { id: 'freagair:verb', k: 'freagair', t: 'verb', card: 'freagair', label: { ga: 'Freagair: briathra', en: 'Answering: verbs' } },
    { id: 'freagair:cop',  k: 'freagair', t: 'cop',  card: 'freagair', label: { ga: 'Freagair: an chopail', en: 'Answering: the copula' } }
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
  function GI() { return window.GAItems; }
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

  var GAME_KEYS = ['imir', 'briathra', 'focail', 'frasai', 'seimhiu', 'forainm', 'tais', 'freagair'];
  function playedRounds() {
    var GS = window.GameScore, n = 0;
    if (!GS || !GS.stats) return 0;
    GAME_KEYS.forEach(function (k) {
      [k, k + ':t', k + ':c'].forEach(function (key) { try { n += (GS.stats(key).plays || 0); } catch (e) {} });
    });
    return n;
  }
  /* 7+ days since the last check, or never checked and 3 rounds played; "Later"
   * holds it back two days. `at` lets a test pass the clock. */
  function due(at) {
    var t = at == null ? now() : at, s = load();
    if (!ladder().length) return false;
    if (s.snooze && t < s.snooze) return false;
    if (s.at) return t - s.at >= 7 * DAY;
    return playedRounds() >= 3;
  }
  function snooze(at) { var s = load(); s.snooze = (at == null ? now() : at) + 2 * DAY; save(s); }

  // ---- grading a unit ------------------------------------------------------------
  function statusOf(right, n) {
    var miss = n - right;
    return miss <= 0 ? 'dominado' : miss === 1 ? 'casi' : 'aprender';
  }
  function recentQs() {
    try { var r = JSON.parse(localStorage.getItem('liofa.recent')); return Array.isArray(r) ? r : []; } catch (e) { return []; }
  }
  /* Three items for a unit: at or below its usual band first, none dealt lately,
   * different verbs for briathra. Short of that it widens rather than testing with fewer. */
  function pickItems(u, rng, n) {
    rng = rng || Math.random; n = n || 3;
    var all = unitRows(u);
    if (!all.length) return [];
    var recent = recentQs(), ub = Math.max(unitBand(u), playerIx());
    function shuffle(a) { return window.GACore.shuffle(a, rng); }
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
      return { right: ok, answer: g.a, why: g.w || null, whyGa: g.wg || null, peek: g.e || null };
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
