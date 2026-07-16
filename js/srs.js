/* ============================================================================
 * SRS — a small spaced-repetition scheduler (Leitner-with-easing).
 *
 * Generic and content-agnostic: it schedules any item by a stable string id.
 * Views decide what an item *is* (a vocab card, a conjugation, a grammar recall
 * prompt) and enrol it the first time it's taught/seen. Review then surfaces
 * exactly the items that are due, protecting prior learning first — the
 * highest-leverage daily activity.
 *
 * Schedule per item: { box, due(dayNumber), reps, lapses }
 *   grade good  → advance a box; interval = INTERVALS[box]; due = today+interval
 *   grade again → drop to box 0; due today (re-sees it this session)
 * Day numbers are integer days since epoch (local), so "due" is date-based.
 * ========================================================================== */
window.SRS = (function () {
  var KEY = 'fluidez.srs';
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64];   // days by box

  function today() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  function state(id) { return load()[id] || null; }
  function isEnrolled(id) { return !!state(id); }

  function enrol(id) {
    var s = load();
    if (!s[id]) { s[id] = { box: 0, due: today(), reps: 0, lapses: 0 }; save(s); }
  }

  function grade(id, good) {
    var s = load();
    var it = s[id] || { box: 0, due: today(), reps: 0, lapses: 0 };
    if (good) { it.box = Math.min(it.box + 1, INTERVALS.length - 1); }
    else { it.box = 0; it.lapses++; }
    it.reps++;
    it.due = today() + INTERVALS[it.box];
    s[id] = it; save(s);
  }

  function isDue(id) { var it = state(id); return !!it && it.due <= today(); }

  // Build a review batch from a candidate pool.
  //   pool        : [{ id, ... }]   (any objects carrying a stable `id`)
  //   maxDue      : cap on already-enrolled due items
  //   maxNew      : cap on brand-new items to introduce this session
  //   shuffleFresh: shuffle new items (default true). Pass false to introduce
  //                 them in the pool's given order (beginners: easiest-first).
  // Returns the chosen items (due first, then new); due is always shuffled.
  function batch(pool, maxDue, maxNew, shuffleFresh) {
    var due = [], fresh = [];
    pool.forEach(function (it) {
      var st = state(it.id);
      if (st) { if (st.due <= today()) due.push(it); }
      else fresh.push(it);
    });
    shuffle(due);
    if (shuffleFresh !== false) shuffle(fresh);
    return due.slice(0, maxDue == null ? due.length : maxDue)
      .concat(fresh.slice(0, maxNew == null ? 0 : maxNew));
  }

  function dueCount(pool) {
    return pool.reduce(function (n, it) { return n + (isDue(it.id) ? 1 : 0); }, 0);
  }
  function enrolledCount() { return Object.keys(load()).length; }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  return {
    enrol: enrol, grade: grade, isDue: isDue, isEnrolled: isEnrolled,
    batch: batch, dueCount: dueCount, enrolledCount: enrolledCount, today: today
  };
})();
