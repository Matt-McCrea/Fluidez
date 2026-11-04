/* ============================================================================
 * BANDS BOOT — a classic (parser-blocking) script, run before the deferred
 * ones. index.html loads the A1 lessons and requires itself; this adds the
 * bands from A2 up to the learner's own, so the first render already has the
 * lessons and the gating rows the course needs. Higher bands are fetched later
 * by Lessons.ensureBand (js/lessons.js).
 *
 * document.write is used on purpose: scripts written here join the deferred
 * queue in order, ahead of js/lessons.js, so nothing has to wait on a callback
 * and DOMContentLoaded still fires only after they have run. If anything is
 * missing it does nothing and the learner gets A1, which is the safe floor.
 *
 * The profile is read the way js/profile.js reads it: ?p= first, then
 * localStorage 'fluidez.profile', old names mapped to their band.
 * ========================================================================== */
(function () {
  try {
    var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'], LEGACY = { beginner: 'A1', standard: 'B1', refresher: 'B2' };
    function canon(v) {
      if (!v) return null;
      var up = String(v).toUpperCase();
      return BANDS.indexOf(up) !== -1 ? up : (LEGACY[String(v).toLowerCase()] || null);
    }
    var m = (location.search.match(/[?&]p=([a-zA-Z0-9]+)/) || [])[1];
    var band = canon(m);
    if (!band) { try { band = canon(localStorage.getItem('fluidez.profile')); } catch (e) {} }
    var n = BANDS.indexOf(band || 'A1');
    for (var i = 1; i <= n; i++) {
      var b = BANDS[i].toLowerCase();
      document.write('<script defer src="data/lessons/' + b + '.js"><\/script>' +
                     '<script defer src="data/requires/' + b + '.js"><\/script>');
    }
  } catch (e) { /* A1 only */ }
})();
