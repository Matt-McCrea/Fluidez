/* ============================================================================
 * PERF: a build marker and a timing log. BUILD must equal CACHE_VERSION in
 * sw.js (tools/test-gaeilge-app.js checks), so the screen says which code runs.
 * ========================================================================== */
window.Perf = (function () {
  var BUILD = 'lfedcf48b';
  var LIMIT = 40;
  var log = [];
  var now = (typeof performance !== 'undefined' && performance.now)
    ? function () { return performance.now(); }
    : function () { return Date.now(); };

  // Time fn, record it, return its value. Never swallows an exception.
  function mark(label, fn) {
    var t = now();
    try { return fn(); }
    finally {
      var ms = Math.round(now() - t);
      log.unshift({ label: label, ms: ms });
      if (log.length > LIMIT) log.pop();
      if (ms >= 400 && typeof console !== 'undefined' && console.warn) {
        console.warn('[perf] ' + label + ' took ' + ms + ' ms');
      }
    }
  }
  function summary() {
    var by = {};
    log.forEach(function (e) {
      var s = by[e.label] || (by[e.label] = { label: e.label, n: 0, max: 0, total: 0 });
      s.n++; s.total += e.ms; if (e.ms > s.max) s.max = e.ms;
    });
    return Object.keys(by).map(function (k) { return by[k]; })
      .sort(function (a, b) { return b.max - a.max; });
  }
  return { BUILD: BUILD, mark: mark, log: function () { return log.slice(); }, summary: summary };
})();
