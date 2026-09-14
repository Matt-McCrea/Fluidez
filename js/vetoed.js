/* ============================================================================
 * VETOED — "stop asking me this."
 *
 * js/lessons.js filters out the classes of bad review card we can describe:
 * questions about grammar rather than in Spanish, terminology as an answer,
 * a gap with two right answers, a morpheme to type. That catches the shapes we
 * thought of. It will never catch all of them — 2,585 cards were written by
 * hand across 798 lessons, and somewhere in there is a question that is
 * ambiguous for a reason no rule anticipated.
 *
 * The learner is the one who finds those, at the moment the card is in front
 * of them and wrong. One tap retires it for good: out of the review pool, out
 * of the error deck, out of the daily session. No streak lost, no explaining.
 *
 * This is deliberately a blunt, permanent, learner-controlled veto rather than
 * a "show it less often": a question that is broken is not broken less often.
 * ========================================================================== */
window.Vetoed = (function () {
  var KEY = 'fluidez.vetoed';

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  var hasOwn = Object.prototype.hasOwnProperty;
  function has(id) { return !!id && hasOwn.call(load(), id); }

  /* Retiring a card also drops its SRS schedule. Leaving the record behind
   * would keep it counted as "due" in every tile on the home screen while
   * never being shown, which is a worse kind of wrong than asking it. */
  function add(id) {
    if (!id) return;
    var s = load();
    s[id] = 1;
    save(s);
    try {
      var srs = JSON.parse(localStorage.getItem('fluidez.srs')) || {};
      if (hasOwn.call(srs, id)) { delete srs[id]; localStorage.setItem('fluidez.srs', JSON.stringify(srs)); }
    } catch (e) {}
    if (window.ErrorLog && window.ErrorLog.remove) window.ErrorLog.remove(id);
  }

  function remove(id) { var s = load(); delete s[id]; save(s); }
  function list() { return Object.keys(load()); }
  function count() { return list().length; }
  function clearAll() { save({}); }

  // Drop every vetoed item from a pool of {id} objects — the one call every
  // surface that builds a review pool has to make.
  function filter(pool) {
    var s = load();
    return (pool || []).filter(function (it) { return !it || !hasOwn.call(s, it.id); });
  }

  return { has: has, add: add, remove: remove, list: list, count: count, clearAll: clearAll, filter: filter };
})();
