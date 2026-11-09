/* ============================================================================
 * SRS: the spaced-repetition scheduler (liofa.srs). Generic: any item by a
 * stable string id. Ported from Fluidez js/srs.js with the Leitner boxes only
 * (no FSRS bundle) and none of the daily-plan machinery, which Líofa has no use for.
 *
 * Record: { box 0..9, due (day number), reps, lapses, consecCorrect,
 * consecMiss, leech, passed, last (day), learnt?, learntAt? }.
 * reps counts EVERY review, wrong ones too: "known" is learnt, or passed and
 * not missed since (see GAItems.knownCard), never reps > 0.
 *
 * ---- permanently learnt (the owner's rule) ----
 * A record with `learnt: true` never falls due again. An item becomes learnt when
 *   (a) it is answered right by TYPING the first time the learner ever sees it
 *       (grade(id, true, { typed: true }); a caller that enrolled the card first
 *       also passes fresh: true). A right TAP never does it; or
 *   (b) it is answered right at a review 180 days or more after its previous
 *       review, however it was answered; or
 *   (c) learn(id) is called (the word test).
 * A learnt item answered wrong ANYWHERE loses the flag and schedules normally.
 * ========================================================================== */
window.SRS = (function () {
  var KEY = 'liofa.srs';
  var META = '__meta';
  var DAY = 86400000;
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64, 120, 180];
  var LEARNT_GAP = 180;       // days between two reviews that make a right answer permanent
  var LEARNT_DUE = 36500;     // a learnt record's stored due day: about a century out
  var LEECH_LIFETIME = 6, LEECH_STREAK = 3, LEECH_RECOVER = 2, LEECH_DAYS = 3;

  function today() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY); }

  function fillDefaults(it) {
    it = it || {};
    var o = {
      box: it.box || 0, due: it.due != null ? it.due : today(),
      reps: it.reps || 0, lapses: it.lapses || 0,
      consecCorrect: it.consecCorrect || 0, consecMiss: it.consecMiss || 0,
      leech: !!it.leech, passed: !!it.passed || (it.box || 0) > 0, last: it.last
    };
    if (it.learnt) { o.learnt = true; o.learntAt = it.learntAt; }
    return o;
  }

  // The parsed store is held in memory and written through; another tab drops it.
  var _cache = null;
  function load() {
    if (_cache) return _cache;
    try { _cache = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { _cache = {}; }
    return _cache;
  }
  function save(s) {
    _cache = s;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('storage', function (e) { if (!e || !e.key || e.key === KEY) _cache = null; });
  }

  function state(id) { return id === META ? null : (load()[id] || null); }
  function isEnrolled(id) { return !!state(id); }

  /* enrol(id, delayDays): due today, or that many days from now. */
  function enrol(id, delayDays) {
    var s = load();
    if (id !== META && !s[id]) {
      var it = fillDefaults();
      if (delayDays > 0) it.due = today() + delayDays;
      s[id] = it;
      save(s);
    }
  }

  /* Every answer, as {id, day, ok, gap}; capped, oldest dropped. */
  var LOG_KEY = 'liofa.reviewlog', LOG_CAP = 2000;
  function logReview(id, ok, prevLast) {
    try {
      var log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      if (!Array.isArray(log)) log = [];
      var d = today();
      log.push({ id: id, day: d, ok: !!ok, gap: prevLast == null ? null : d - prevLast });
      if (log.length > LOG_CAP) log = log.slice(log.length - LOG_CAP);
      localStorage.setItem(LOG_KEY, JSON.stringify(log));
    } catch (e) { /* storage full or blocked: the log is a nicety */ }
  }

  /* grade(id, ok, meta): meta = { typed, fresh, unsure }. */
  function grade(id, ok, m) {
    if (id === META) return;
    m = m || {};
    var s = load();
    var it = s[id] || fillDefaults();
    ok = !!ok;
    var unsure = !!m.unsure;
    var td = today();
    var prevLast = it.reps > 0 ? it.last : null;
    var existed = !!s[id];
    var wasLearnt = !!it.learnt;
    var right = ok && !unsure;
    // rule (b): days since the previous review
    var elapsed = (it.reps > 0 && it.last != null) ? td - it.last : null;
    // rule (a): typed right at first sight; `fresh` overrides "no record yet" for callers that enrol first
    var firstSight = m.fresh != null ? !!m.fresh : !existed;
    var makeLearnt = right && ((m.typed && firstSight) || (elapsed != null && elapsed >= LEARNT_GAP));
    it.reps++;
    if (wasLearnt && !right) { delete it.learnt; delete it.learntAt; }
    if (right) {
      it.consecCorrect++; it.consecMiss = 0;
      if (it.leech && it.consecCorrect >= LEECH_RECOVER) it.leech = false;
    } else if (!unsure) {
      it.lapses++; it.consecMiss++; it.consecCorrect = 0;
      if (it.lapses >= LEECH_LIFETIME || it.consecMiss >= LEECH_STREAK) it.leech = true;
    } else {
      it.consecCorrect = 0;
    }
    if (right) it.passed = true;
    it.box = right ? Math.min(it.box + 1, INTERVALS.length - 1) : 0;
    it.due = td + Math.max(1, INTERVALS[it.box]);        // a review always moves a card to tomorrow at the earliest
    if (it.leech && !right) it.due = Math.max(it.due, td + LEECH_DAYS);
    it.last = td;
    if (makeLearnt || (wasLearnt && right)) {
      it.learnt = true; it.learntAt = (makeLearnt || it.learntAt == null) ? td : it.learntAt;
      it.leech = false; it.due = td + LEARNT_DUE; it.box = Math.max(it.box, 9);
    }
    s[id] = it;
    save(s);
    logReview(id, right, prevLast);
  }

  function isDue(id) { var it = state(id); return !!it && !it.learnt && it.due <= today(); }
  function isLearnt(id) { var it = state(id); return !!it && !!it.learnt; }
  /* learn(id): permanently learnt from now on (creating the record when there is none). */
  function learn(id) {
    if (id === META) return;
    var s = load(), td = today();
    var it = s[id] || fillDefaults();
    if (!it.reps) it.reps = 1;
    it.passed = true; it.leech = false; it.consecMiss = 0; it.consecCorrect = Math.max(1, it.consecCorrect || 0);
    it.last = td; it.learnt = true; it.learntAt = td; it.due = td + LEARNT_DUE; it.box = Math.max(it.box || 0, 9);
    s[id] = it; save(s);
  }
  function boxOf(id) { var it = state(id); return it ? it.box : 0; }
  function isLeech(id) { var it = state(id); return !!it && it.leech; }
  function lapsesOf(id) { var it = state(id); return it ? it.lapses : 0; }
  function passed(id) { var it = state(id); return !!it && it.passed; }
  function enrolledCount() { return Object.keys(load()).filter(function (k) { return k !== META; }).length; }

  return {
    enrol: enrol, grade: grade, isDue: isDue, isEnrolled: isEnrolled, isLearnt: isLearnt, learn: learn,
    state: state, boxOf: boxOf, isLeech: isLeech, lapsesOf: lapsesOf, passed: passed,
    enrolledCount: enrolledCount, today: today, reviewLogKey: LOG_KEY, KEY: KEY,
    _reset: function () { _cache = null; }
  };
})();
