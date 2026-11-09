/* ============================================================================
 * AR CORE: the few shared helpers every module takes (shuffle, bands), the
 * learner's band (`talaqa.profile`) and the display preferences
 * (`talaqa.prefs`: vowels auto|full|bare, autoplay). Also the vowel level
 * rules: which AR.fade level a word or a sentence gets. No network.
 * ========================================================================== */
window.ARCore = (function () {
  var BANDS = ['A1', 'A2', 'B1', 'B2'];

  function shuffle(a, rng) {
    rng = rng || Math.random;
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function bandIndex(b) { var i = BANDS.indexOf(b); return i < 0 ? 0 : i; }

  /* ---- preferences ---- */
  var PKEY = 'talaqa.prefs';
  function prefsAll() { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; } }
  function pref(k, d) { var p = prefsAll(); return p[k] === undefined ? d : p[k]; }
  function setPref(k, v) {
    var p = prefsAll(); p[k] = v;
    try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {}
  }
  function vowelsPref() { var v = pref('vowels', 'auto'); return v === 'full' || v === 'bare' ? v : 'auto'; }
  function autoplay() { return pref('autoplay', true) !== false; }

  /* ---- vowel levels (spec: Script, direction, font) ---- */
  function stateOf(id) { return window.SRS && window.SRS.state ? window.SRS.state(id) : null; }
  /* right answers so far: every review counts in reps, wrong ones in lapses */
  function rightsOf(id) {
    var s = stateOf(id);
    return s ? Math.max(0, (s.reps || 0) - (s.lapses || 0)) : 0;
  }
  /* Words: full while new, help after 2 right answers, bare once learnt. */
  function wordLevel(id) {
    var v = vowelsPref();
    if (v !== 'auto') return v;
    var s = stateOf(id);
    if (s && s.learnt) return 'bare';
    return rightsOf(id) >= 2 ? 'help' : 'full';
  }
  /* Sentences: A1 full, A2 help, B1 and B2 bare. */
  function sentenceLevel(band) {
    var v = vowelsPref();
    if (v !== 'auto') return v;
    var i = bandIndex(band);
    return i === 0 ? 'full' : i === 1 ? 'help' : 'bare';
  }
  /* Transliteration under a word: A1 words until their second right answer. */
  function showTranslit(id, band) {
    return bandIndex(band) === 0 && rightsOf(id) < 2 && !(stateOf(id) && stateOf(id).learnt);
  }

  return { BANDS: BANDS, shuffle: shuffle, bandIndex: bandIndex, pref: pref, setPref: setPref,
    vowelsPref: vowelsPref, autoplay: autoplay, wordLevel: wordLevel, sentenceLevel: sentenceLevel,
    rightsOf: rightsOf, showTranslit: showTranslit };
})();

window.Profile = (function () {
  var KEY = 'talaqa.profile';
  var BANDS = window.ARCore.BANDS;
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
  function _reset() { mem = null; }

  return { current: current, set: set, placed: placed, markPlaced: markPlaced, all: all, _reset: _reset };
})();
