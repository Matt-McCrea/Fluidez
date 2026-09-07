/* ============================================================================
 * PERF — a build marker and a timing log you can read on the device.
 *
 * Two rounds of "it should be faster now" were diagnosed from Node benchmarks
 * against a shimmed DOM and a fake localStorage. Both found real bugs and
 * neither fixed what the learner actually felt, because the thing being
 * measured was not the thing being used. This measures the real app on the
 * real device.
 *
 * BUILD must match CACHE_VERSION in sw.js — tools/validate-content.js checks
 * it — so the number shown in Ajustes says exactly which code is running. A
 * service worker is cache-first and its own file can sit in the HTTP cache for
 * hours, so "did my fix even reach the phone" is a real question with a real
 * answer here.
 * ========================================================================== */
window.Perf = (function () {
  var BUILD = 'v31';
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

  // Worst offenders first, with a count and the slowest time for each label.
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
