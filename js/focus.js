/* ============================================================================
 * FOCUS — point the next few sessions at one theme, without moving the course.
 *
 * "I have a holiday in three weeks" is the most ordinary reason an adult has
 * for wanting more Spanish, and until now the app had no way to hear it. The
 * only theme surface was Practicar por tema: a flashcard round, over in five
 * minutes, touching nothing else.
 *
 * WHAT A FOCUS DOES AND DOES NOT DO. It does not touch the lesson ladder. The
 * grammar you meet on any given day is the grammar the course says comes next,
 * in the order it says, because that order is the one thing in here that has
 * to be a sequence — you cannot usefully practise the subjunctive in a hotel
 * before you have met the subjunctive. What a focus changes is the material
 * that was never sequenced in the first place, and which the scheduler was
 * already choosing on weaker grounds:
 *
 *   new words     js/views/review.js — the daily `newPerDay` drip, previously
 *                 the whole level pool in rank or random order
 *   the passage   js/session.js — already had a theme TIER, as the fallback
 *                 for when nothing matched the day's grammar
 *   writing       js/session.js — preferAligned on grammar only
 *
 * So: same lesson, different world to meet it in. You still learn the
 * subjunctive on the day the course teaches it; you just learn it in a hotel.
 *
 * COUNTED IN SESSIONS, NOT DAYS. "The next seven lessons" is what a learner
 * means and what they can check. A calendar window would quietly burn down
 * over a week when nobody opened the app, and the focus they asked for would
 * be gone before they used it. One tick per calendar day (so two sessions on
 * a Sunday do not cost two), and the day is stored so a reinstall mid-focus
 * cannot double-tick.
 *
 * A focus is always breakable in one tap. It is a preference, not a mode, and
 * nothing in the app behaves differently other than the three choices above.
 * ========================================================================== */
window.Focus = (function () {
  var KEY = 'fluidez.focus';
  var DEFAULT_DAYS = 7;
  var MAX_DAYS = 21;         // past this it stops being a focus and is just the course

  function today() {
    if (window.SRS && window.SRS.today) return window.SRS.today();
    return Math.floor(Date.now() / 86400000);
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
  }
  function save(o) {
    try { o ? localStorage.setItem(KEY, JSON.stringify(o)) : localStorage.removeItem(KEY); } catch (e) {}
  }

  /* The live record, or null. Expires itself rather than making every caller
   * remember to check `left`. */
  function get() {
    var o = load();
    if (!o || !o.theme || !(o.left > 0)) { if (o) save(null); return null; }
    return o;
  }

  // The theme id the session should prefer, or null. The hot path — every
  // content choice in a session calls this.
  function theme() { var o = get(); return o ? o.theme : null; }

  function remaining() { var o = get(); return o ? o.left : 0; }

  function start(themeId, days) {
    if (!themeId) return false;
    var n = Math.max(1, Math.min(MAX_DAYS, days || DEFAULT_DAYS));
    save({ theme: themeId, left: n, of: n, started: today(), lastDay: null });
    return true;
  }

  function stop() { save(null); }

  /* One session's worth of focus spent. Called from the session's completion
   * card, which is the only place that knows a session actually finished —
   * starting one and backing out must not cost a day. */
  function tick() {
    var o = get();
    if (!o) return;
    var t = today();
    if (o.lastDay === t) return;              // already counted today
    o.lastDay = t;
    o.left -= 1;
    save(o.left > 0 ? o : null);
  }

  /* The learner-facing name — `short`, never the PCIC inventory heading.
   * See the note on window.THEMES in data/taxonomy.js. */
  function label() {
    var o = get();
    if (!o) return null;
    var t = window.TAXONOMY ? window.TAXONOMY.theme(o.theme) : null;
    if (!t) return o.theme;
    return window.UI ? window.UI.t(t.short || t.es, t.en) : (t.short || t.en);
  }

  /* Narrow a list of themed content to the focus, and fall back to the whole
   * list rather than to nothing. Every caller in the session is choosing
   * something it MUST produce — a passage to read, tasks to write — so an
   * empty focus-themed set has to mean "no preference today", never a blank
   * stage. This is the same bargain safeVerbs and preferAligned already make.
   *
   * `keyed` is for pools whose items carry the theme somewhere other than
   * `.theme` (the review pool builds its own item shape). */
  function narrow(arr, keyed) {
    var th = theme();
    if (!th || !arr || !arr.length) return arr;
    var get2 = keyed || function (x) { return x.theme; };
    var hit = arr.filter(function (x) { return get2(x) === th; });
    return hit.length ? hit : arr;
  }

  return { get: get, theme: theme, remaining: remaining, start: start, stop: stop,
           tick: tick, label: label, narrow: narrow,
           DEFAULT_DAYS: DEFAULT_DAYS, MAX_DAYS: MAX_DAYS };
})();
