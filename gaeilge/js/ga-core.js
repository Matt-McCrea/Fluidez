/* ============================================================================
 * GA CORE: the few shared helpers the copied Fluidez modules used to take from
 * the Spanish ENGINE, Checker and Profile. Also the learner's band
 * (`liofa.profile`). No speech, no network.
 * ========================================================================== */
window.GACore = (function () {
  var BANDS = ['A1', 'A2', 'B1', 'B2'];

  function shuffle(a, rng) {
    rng = rng || Math.random;
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // lower case, fada gone: for comparing, never for showing
  function deaccent(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/[áéíóú]/g, function (c) {
      return { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' }[c];
    });
  }
  function bandIndex(b) { var i = BANDS.indexOf(b); return i < 0 ? 0 : i; }

  return { BANDS: BANDS, shuffle: shuffle, deaccent: deaccent, bandIndex: bandIndex };
})();

window.Profile = (function () {
  var KEY = 'liofa.profile';
  var BANDS = window.GACore.BANDS;
  var EN = { A1: 'beginner', A2: 'elementary', B1: 'intermediate', B2: 'upper intermediate' };
  var LABEL = { A1: 'A1 · ' + EN.A1, A2: 'A2 · ' + EN.A2, B1: 'B1 · ' + EN.B1, B2: 'B2 · ' + EN.B2 };
  var mem = null;

  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { mem = {}; }
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem || {})); } catch (e) {} }

  function current() { var b = load().band; return BANDS.indexOf(b) === -1 ? 'A1' : b; }
  function set(b) {
    if (BANDS.indexOf(b) === -1) return;
    load().band = b; save();
  }
  function placed() { return !!load().placed; }
  function markPlaced() { load().placed = true; save(); }
  function all() { return BANDS.map(function (b) { return { name: b, label: LABEL[b], en: EN[b] }; }); }
  function params() { return { cefr: current() }; }
  /* Headings and notes in English until B1, Irish after. */
  function term(ga, en) { return window.GACore.bandIndex(current()) >= 2 ? ga : en; }
  function _reset() { mem = null; }

  return { current: current, set: set, placed: placed, markPlaced: markPlaced, all: all,
    params: params, term: term, _reset: _reset };
})();
