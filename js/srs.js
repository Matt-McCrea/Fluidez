/* ============================================================================
 * SRS — the spaced-repetition scheduler. Every item keeps an FSRS card
 * (window.LIB.fsrs, stored as `fs`), graded from how the learner actually
 * answered: right or wrong, hint used, speed against that item's own typical
 * speed, "I don't know". A card whose stability passes 180 days is simply
 * rarely due. The one way out of retrieval is PERMANENTLY LEARNT (below).
 *
 * Generic and content-agnostic: it schedules any item by a stable string id.
 * Views decide what an item *is* and enrol it the first time it is taught.
 *
 * Record per item: { fs (FSRS card JSON, due and last_review in epoch ms),
 * due (day number, derived from fs.due, never earlier than tomorrow after a
 * review), box (0..9, DERIVED from stability by the old interval table, for
 * the progress chart only), reps, lapses, consecCorrect, consecMiss, leech,
 * passed, lat (moving average of this item's right-answer latency, ms),
 * last (day) }. Day numbers are integer local days since the epoch.
 *
 * Meta (retention choice, seconds per card, today's plan, the zero-new
 * streak) lives in the same store under the reserved key "__meta".
 *
 * ---- permanently learnt (owner's decision, 6 Nov 2026) ----
 * Matthew is against eternal reviews: an item the player demonstrably owns
 * must stop coming back. A record carries `learnt: true` and `learntAt` (day)
 * and never falls due again, in the arcade or the main app (they share this
 * store). It is a NEW field; the old `dominado` stays dead (v4 dropped it).
 * An item becomes learnt when
 *   (a) it is answered right by TYPING the first time the player ever sees it
 *       (no card existed before): grade(id, true, { typed: true }), where a
 *       caller that enrolled the card first also passes fresh: true. A right
 *       TAP never does it, since a tap can be process of elimination; or
 *   (b) it is answered right at a review that came 180 days or more after its
 *       previous review (FSRS elapsed time), whatever the way of answering; or
 *   (c) learn(id) is called (the word test, which is rule (a) by definition).
 * A learnt item answered wrong (or "I don't know") ANYWHERE loses the flag and
 * goes back to normal scheduling with an ordinary lapse. Learnt items still
 * count as known everywhere progress is shown (reps > 0, passed). Their stored
 * `due` is pushed far out so a reader that only looks at `due` skips them too.
 *
 * ---- leeches ----
 * Missed 6 times lifetime or 3 times in a row. A leech is not removed: it is
 * due again 3 days after the miss. Two right answers in a row clear the flag.
 * "I don't know" is an Again for the schedule but never counts toward either.
 *
 * ---- ids ----
 * Vocab: `v:<es>:meaning` (recognition) and, from A2, `v:<es>:form` (type the
 * Spanish), enrolled when the meaning card is first passed. Verbs:
 * `vm:<inf>` meaning and `vt:<inf>:<tense>`. Grammar stays concept-level.
 *
 * ---- schema ----
 * '3' to '4': each record gets fs = fromLeitner(box, last || today), keeping
 * its stored due day. Records that used to sit outside the due pool
 * (dominado, leech) are spread over the next weeks instead of all falling due
 * at once. Without the library bundle the old Leitner rules still run.
 * ========================================================================== */
window.SRS = (function () {
  var KEY = 'fluidez.srs';
  var SCHEMA_KEY = 'fluidez.srsSchema';
  var META = '__meta';
  var DAY = 86400000;
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64, 120, 180];   // old box table, now only a display scale
  var LEARNT_GAP = 180;       // days between two reviews that make a right answer permanent
  var LEARNT_DUE = 36500;     // a learnt record's stored due day: about a century out
  var LEECH_LIFETIME = 6;
  var LEECH_STREAK = 3;
  var LEECH_RECOVER = 2;     // consecutive correct that clears a leech flag
  var LEECH_DAYS = 3;        // a leech comes back this many days after the miss
  var DEFAULT_SPC = 10;      // seconds per card until measured
  var DEFAULT_LATENCY = 6000;

  // minutes of review per session, and new cards per day, by band
  var BUDGET_MIN = { A1: 6, A2: 7, B1: 8, B2: 10, C1: 10 };
  var NEW_TARGET = { A1: 10, A2: 9, B1: 8, B2: 7, C1: 6 };
  var NEW_FLOOR = 3;

  function fsrs() { return (window.LIB && window.LIB.fsrs) || null; }
  function nowMs() { return Date.now(); }
  function today() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY); }
  function dayOfMs(ms) { return Math.floor((ms - new Date(ms).getTimezoneOffset() * 60000) / DAY); }
  function midnightMs(day) { return day * DAY + new Date(day * DAY).getTimezoneOffset() * 60000; }
  function hash(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }
  function band() { try { return (window.Profile && window.Profile.current && window.Profile.current()) || 'A1'; } catch (e) { return 'A1'; } }

  function fillDefaults(it) {
    it = it || {};
    var o = {
      box: it.box || 0, due: it.due != null ? it.due : today(),
      reps: it.reps || 0, lapses: it.lapses || 0,
      consecCorrect: it.consecCorrect || 0, consecMiss: it.consecMiss || 0,
      leech: !!it.leech, passed: !!it.passed || (it.box || 0) > 0,
      last: it.last, lat: it.lat, fs: it.fs
    };
    if (it.learnt) { o.learnt = true; o.learntAt = it.learntAt; }
    return o;
  }

  // stability in days to the old ten boxes: the largest box whose interval fits
  function boxFromCard(c) {
    if (!c || c.state === 0 || c.last_review === undefined) return 0;
    var b = 0;
    for (var i = 0; i < INTERVALS.length; i++) if (INTERVALS[i] <= c.stability) b = i;
    return b;
  }
  function ensureFs(it) {
    var F = fsrs();
    if (!F || it.fs) return;
    it.fs = F.fromLeitner(it.box || 0, it.last != null ? it.last : (it.due != null ? Math.min(it.due, today()) : today()));
    it.fs.due = midnightMs(it.due != null ? it.due : today());
  }

  // One-time, additive migration, run until the stored schema marker is current:
  //   v2 — rename the old single vocab id (`v:<es>`) to `v:<es>:meaning`.
  //   v3 — rename legacy captured-word ids (`cap:<es>`) to the same id.
  //   v4 — give every record an FSRS card seeded from its Leitner box and last
  //        review day, keeping the stored due day, and drop `dominado`.
  // If both an old and a renamed id exist, the more-progressed (higher box)
  // record wins so no streak is lost. Every other id shape is untouched.
  var SCHEMA_CURRENT = '4';
  function migrate(s) {
    var done = null;
    try { done = localStorage.getItem(SCHEMA_KEY); } catch (e) {}
    if (done === SCHEMA_CURRENT) return s;
    var F = fsrs();
    var t = today();
    var out = {};
    function place(id, rec) {
      if (id === META) { out[id] = rec; return; }
      var wasOut = !!(rec && (rec.dominado || rec.leech));
      rec = fillDefaults(rec);
      if (wasOut && rec.due <= t) {            // used to be outside the due pool: do not release them all at once
        rec.due = t + (rec.leech ? LEECH_DAYS : 1) + hash(id) % 28;
      }
      if (!out[id] || (rec.box || 0) > (out[id].box || 0)) out[id] = rec;
    }
    Object.keys(s).forEach(function (id) {
      var newId = id;
      if (/^cap:/.test(id)) newId = 'v:' + id.slice(4) + ':meaning';
      else if (/^v:/.test(id) && !/:(meaning|gender|form)$/.test(id)) newId = id + ':meaning';
      place(newId, s[id]);
    });
    if (F) {
      Object.keys(out).forEach(function (id) {
        if (id === META) return;
        var it = out[id];
        if (it.fs) return;
        var last = it.last != null ? it.last : t;
        it.fs = F.fromLeitner(it.box || 0, last);
        it.fs.due = midnightMs(it.due);
        it.box = boxFromCard(it.fs);
      });
    }
    // without the bundle the records stay Leitner and are upgraded lazily
    save(out);
    if (F) { try { localStorage.setItem(SCHEMA_KEY, SCHEMA_CURRENT); } catch (e) {} }
    return out;
  }

  /* The parsed state is held in memory. load() used to hit localStorage and
   * JSON.parse on EVERY call, and state()/isEnrolled() call load() — so
   * Hub.reviewPool(), which asks isEnrolled once per recall item across every
   * lesson, made ~3,000 parses and ~6,000 storage reads per render.
   *
   * The cache is written through by save(), and dropped if another tab changes
   * the store, so it cannot go stale. */
  var _cache = null;

  function load() {
    if (_cache) return _cache;
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { s = {}; }
    _cache = migrate(s);
    return _cache;
  }
  function save(s) {
    _cache = s;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  // another tab (or a data import) wrote the store — drop the cache
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('storage', function (e) {
      if (!e || !e.key || e.key === KEY || e.key === SCHEMA_KEY) _cache = null;
    });
  }

  function state(id) { return id === META ? null : (load()[id] || null); }
  function isEnrolled(id) { return !!state(id); }

  /* ---- meta: retention, pace, today's plan ------------------------------- */
  function meta() { var s = load(); return s[META] || {}; }
  function setMeta(patch) {
    var s = load(); var m = s[META] || {};
    Object.keys(patch).forEach(function (k) { m[k] = patch[k]; });
    s[META] = m; save(s);
  }
  function retentionPct() { var r = meta().retention; return r === 85 ? 85 : 90; }
  function applyRetention() { var F = fsrs(); if (F) F.setRetention(retentionPct() / 100); }
  function setRetentionPct(p) { setMeta({ retention: p === 85 ? 85 : 90 }); applyRetention(); }
  function secondsPerCard() { var v = meta().spc; return v > 0 ? v : DEFAULT_SPC; }

  /* `delayDays` (optional) enrols the item as due that many days from now
   * instead of today: a card taught today first comes up for review
   * tomorrow, never in the same day's review stage. */
  function enrol(id, delayDays) {
    var s = load();
    if (id !== META && !s[id]) {
      var it = fillDefaults();
      if (delayDays > 0) it.due = today() + delayDays;
      var F = fsrs();
      if (F) { it.fs = F.createCard(nowMs()); it.fs.due = midnightMs(it.due); }
      s[id] = it;
      save(s);
    }
  }

  /* Every answer, as {id, day, ok, gap}: gap is the days since the previous
   * review of that item (null when there was none). Capped, oldest dropped.
   * Progress reads "remembered after a week" off it. */
  var LOG_KEY = 'fluidez.reviewlog', LOG_CAP = 2000;
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

  function formId(id) { return /^v:.+:meaning$/.test(id) ? id.replace(/:meaning$/, ':form') : null; }

  /* grade(id, ok, meta): meta = { usedHint, latencyMs, unsure, cardMs }.
   * The FSRS grade comes from gradeFromAnswer against the item's own typical
   * latency. Callers that pass no meta get a plain Good or Again. */
  function grade(id, ok, m) {
    if (id === META) return;
    m = m || {};
    var s = load();
    var it = s[id] || fillDefaults();
    ok = !!ok;
    var unsure = !!m.unsure;
    var t = nowMs(), td = today();
    // Only an item that had been reviewed before has a gap; a first answer has none.
    var prevLast = it.reps > 0 ? it.last : null;
    var existed = !!s[id];
    var wasLearnt = !!it.learnt;
    var F = fsrs();
    var right = ok && !unsure;
    /* rule (b): elapsed time since the previous review, from the FSRS card when it has one */
    var elapsed = null;
    if (it.reps > 0) {
      if (it.fs && it.fs.last_review !== undefined && it.fs.last_review !== null) elapsed = (t - it.fs.last_review) / DAY;
      else if (it.last != null) elapsed = td - it.last;
    }
    /* rule (a): typed right, first time ever seen. `fresh` overrides "no record yet" for callers that enrol first. */
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
      it.consecCorrect = 0;                       // not remembered, but no penalty streak
    }
    if (right) it.passed = true;
    if (F) {
      ensureFs(it);
      var g = F.gradeFromAnswer({ correct: ok, usedHint: !!m.usedHint, latencyMs: m.latencyMs, unsure: unsure,
                                  typicalLatencyMs: it.lat || DEFAULT_LATENCY });
      var res = F.review(it.fs, g, t);
      it.fs = res.card;
      var dueDay = Math.max(dayOfMs(it.fs.due), td + 1);     // a review always moves a card to tomorrow at the earliest
      if (it.leech && !right) {
        dueDay = Math.max(dueDay, td + LEECH_DAYS);
        it.fs.due = Math.max(it.fs.due, midnightMs(dueDay));
      }
      it.due = dueDay;
      it.box = boxFromCard(it.fs);
      if (right && isFinite(m.latencyMs) && m.latencyMs > 0) {
        var lat = Math.min(60000, Math.max(300, m.latencyMs));
        it.lat = it.lat ? Math.round(it.lat * 0.7 + lat * 0.3) : Math.round(lat);
      }
    } else {
      it.box = right ? Math.min(it.box + 1, INTERVALS.length - 1) : 0;
      it.due = td + INTERVALS[it.box];
    }
    it.last = td;
    if (makeLearnt || (wasLearnt && right)) {
      it.learnt = true; it.learntAt = (makeLearnt || it.learntAt == null) ? td : it.learntAt;
      it.leech = false; it.due = td + LEARNT_DUE; it.box = Math.max(it.box, 9);
      if (it.fs) it.fs.due = midnightMs(it.due);
    }
    s[id] = it;
    var cm = m.cardMs != null ? m.cardMs : m.latencyMs;
    if (isFinite(cm) && cm > 0) {
      var mm = s[META] || {};
      var sec = Math.min(60, Math.max(2, cm / 1000));
      mm.spc = Math.round(((mm.spc > 0 ? mm.spc : DEFAULT_SPC) * 0.9 + sec * 0.1) * 100) / 100;
      s[META] = mm;
    }
    save(s);
    logReview(id, right, prevLast);
    /* A word is one card that asks for the Spanish (js/views/review.js pool): no second card is enrolled
     * when the first is passed any more. */
  }

  // Due for normal review. A leech is simply due again later, like anything else.
  function isDue(id) { var it = state(id); return !!it && !it.learnt && it.due <= today(); }
  function isLearnt(id) { var it = state(id); return !!it && !!it.learnt; }
  /* learn(id): the item is permanently learnt from now on (creating its record when there is none). */
  function learn(id) {
    if (id === META) return;
    var s = load(), td = today();
    var it = s[id] || fillDefaults();
    if (!it.reps) it.reps = 1;
    it.passed = true; it.leech = false; it.consecMiss = 0; it.consecCorrect = Math.max(1, it.consecCorrect || 0);
    it.last = td; it.learnt = true; it.learntAt = td; it.due = td + LEARNT_DUE; it.box = Math.max(it.box || 0, 9);
    var F = fsrs();
    if (F && !it.fs) { ensureFs(it); }
    if (it.fs) it.fs.due = midnightMs(it.due);
    s[id] = it; save(s);
  }
  /* unlearn(id): drop the record entirely, so the item comes back as new (ticking a phrase by mistake). */
  function unlearn(id) {
    if (id === META) return;
    var s = load();
    if (s[id]) { delete s[id]; save(s); }
  }
  function boxOf(id) { var it = state(id); return it ? it.box : 0; }   // 0 = new / fragile; derived from stability
  function isDominado() { return false; }                              // retired for good; see learnt
  function isLeech(id) { var it = state(id); return !!it && it.leech; }
  function lapsesOf(id) { var it = state(id); return it ? it.lapses : 0; }
  function passed(id) { var it = state(id); return !!it && it.passed; }
  function stabilityOf(id) { var it = state(id); return it && it.fs ? it.fs.stability : 0; }

  // lowest chance of recalling first, then the most overdue
  function orderDue(list, s) {
    var F = fsrs(), t = nowMs(), td = today();
    var keyed = list.map(function (it) {
      var st = s[it.id];
      return { it: it, r: F && st.fs ? F.retrievability(st.fs, t) : 0, o: td - st.due, b: st.box };
    });
    keyed.sort(function (a, b) {
      if (a.r !== b.r) return a.r - b.r;
      if (a.o !== b.o) return b.o - a.o;
      return a.b - b.b;
    });
    return keyed.map(function (k) { return k.it; });
  }

  // Build a review batch from a candidate pool.
  //   pool        : [{ id, ... }]   (any objects carrying a stable `id`)
  //   maxDue      : cap on already-enrolled due items for the session. The
  //                 ones with the lowest retrievability are served first; the
  //                 rest simply stay due (they are only more overdue tomorrow).
  //   maxNew      : cap on brand-new items to introduce this session
  //   shuffleFresh: shuffle new items (default true). Pass false to introduce
  //                 them in the pool's given order (beginners: easiest-first).
  // Returns the chosen due items in priority order, then the new ones.
  /* `freshPrefer` (optional) orders the NEW items so ones it likes come first.
   * It cannot be done at the call site: fresh is shuffled here for everyone
   * but the paced beginner, so any order imposed beforehand is thrown away.
   *
   * It returns a SCORE, higher first — a boolean works unchanged, since true
   * and false coerce to 1 and 0. Ordering rather than filtering, because it is
   * a preference: when the preferred set runs short the batch still fills to
   * maxNew instead of quietly shrinking the day's intake. The sort carries an
   * explicit index tiebreak so it is stable on any engine, which is what keeps
   * the paced beginner's rank order intact inside each score tier. */
  function batch(pool, maxDue, maxNew, shuffleFresh, freshPrefer, rng) {
    var s = load();
    var due = [], fresh = [];
    pool.forEach(function (it) {
      var st = s[it.id];
      if (st) { if (!st.learnt && st.due <= today()) due.push(it); }
      else fresh.push(it);
    });
    due = orderDue(due, s);
    var cap = maxDue == null ? due.length : maxDue;
    var chosen = due.slice(0, cap);
    if (shuffleFresh !== false) shuffle(fresh, rng);
    if (freshPrefer) {
      fresh = fresh.map(function (it, i) { return { it: it, s: Number(freshPrefer(it)) || 0, i: i }; })
                   .sort(function (a, b) { return b.s - a.s || a.i - b.i; })
                   .map(function (x) { return x.it; });
    }
    var freshChosen = fresh.slice(0, maxNew == null ? 0 : maxNew);
    return chosen.concat(freshChosen);
  }

  /* ---- the daily plan: budget and throttle --------------------------------
   * Review is budgeted in minutes, not cards. The learner's own seconds per
   * card (a moving average of how long cards actually took) turns the due
   * count into minutes. Within budget, the full new-card target is taught.
   * Over budget, new cards shrink toward a floor of 3 so the backlog cannot
   * grow; past twice the budget only 1.5 times the budget is served and still
   * 3 new. `manualCap` (the Settings number, the band's default until changed) is a
   * ceiling on the due cards only. The plan is fixed for the day once made. */
  /* SUCCESS STEERS DIFFICULTY. Yesterday's right share, read off the review
   * log (needs at least 10 reviews that day): under 0.80 the day's new-card
   * target drops to the floor; over 0.95 it rises by 2, never past target + 4.
   * `steer` in the plan names the rule that fired. */
  function yesterdayShare() {
    try {
      var log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]'), y = today() - 1, n = 0, r = 0;
      if (!Array.isArray(log)) return null;
      log.forEach(function (e) { if (e && e.day === y) { n++; if (e.ok) r++; } });
      return n >= 10 ? r / n : null;
    } catch (e) { return null; }
  }
  function computePlan(dueN, b, spc, manualCap, share, yDue) {
    var budget = BUDGET_MIN[b] || BUDGET_MIN.A1, base = NEW_TARGET[b] || NEW_TARGET.A1, target = base;
    if (share === undefined) share = yesterdayShare();
    var steer = null;
    if (share != null && share < 0.80) steer = 'low';
    else if (share != null && share > 0.95) { steer = 'high'; target = Math.min(base + 2, base + 4); }
    var dueMin = dueN * spc / 60;
    var dueCap, newCount;
    if (dueMin <= budget) { dueCap = dueN; newCount = target; }
    else if (dueMin <= 2 * budget) {
      dueCap = dueN;
      newCount = Math.max(NEW_FLOOR, Math.min(target, Math.round(target * (2 * budget - dueMin) / budget)));
    } else {
      dueCap = Math.max(1, Math.floor(1.5 * budget * 60 / spc));
      newCount = NEW_FLOOR;
    }
    /* Yesterday's backlog counts too: when yesterday's due count went past the budget's cards, today's new target
     * shrinks toward the floor (to the floor at twice the budget), so the backlog does not climb day on day. */
    var budgetCards = budget * 60 / spc;
    if (yDue != null && yDue > budgetCards) {
      var f = Math.max(0, (2 * budgetCards - yDue) / budgetCards);
      newCount = Math.min(newCount, Math.max(NEW_FLOOR, Math.round(target * f)));
    }
    if (steer === 'low') newCount = NEW_FLOOR;
    if (manualCap > 0) dueCap = Math.min(dueCap, manualCap);
    return { band: b, budgetMin: budget, spc: spc, dueN: dueN, dueMin: Math.round(dueMin * 10) / 10,
             dueCap: dueCap, newCount: newCount, throttled: newCount < base, steer: steer,
             yesterdayShare: share == null ? null : Math.round(share * 100) / 100 };
  }
  function dueIn(pool) {
    var s = load(), td = today(), n = 0;
    pool.forEach(function (it) { var st = s[it.id]; if (st && !st.learnt && st.due <= td) n++; });
    return n;
  }
  function plan(pool, opts) {
    opts = opts || {};
    var m = meta(), td = today();
    if (!opts.fresh && m.plan && m.plan.day === td && m.plan.band === (opts.band || band())) return m.plan;
    var hist = meta().dueHist || {}, yDue = hist[td - 1] != null ? hist[td - 1] : null;
    var p = computePlan(dueIn(pool), opts.band || band(), secondsPerCard(), opts.manualCap, undefined, yDue);
    p.day = td;
    hist[td] = p.dueN;
    Object.keys(hist).forEach(function (k) { if (td - Number(k) > 3) delete hist[k]; });
    setMeta({ plan: p, dueHist: hist });
    return p;
  }
  // Called once per session with how many new cards it taught: counts the run of zero-new sessions.
  function noteNew(n) { setMeta({ zeroStreak: n > 0 ? 0 : (meta().zeroStreak || 0) + 1 }); }
  function zeroStreak() { return meta().zeroStreak || 0; }

  // Read-only priority ordering over a pool, with no side effects. Used by the
  // on-demand content selectors (Practicar) to pull a SUBSET of due items into
  // a mixed round without disturbing the schedule. Leeches are left to the
  // weak-spot buckets.
  function duePriority(pool, n) {
    var s = load();
    var due = pool.filter(function (it) { var st = s[it.id]; return st && !st.leech && !st.learnt && st.due <= today(); });
    due = orderDue(due, s);
    return n == null ? due : due.slice(0, n);
  }

  // Never-enrolled items from a pool — the "brand new" half of a Stretch bucket.
  function freshItems(pool, n, doShuffle) {
    var s = load();
    var fresh = pool.filter(function (it) { return !s[it.id]; });
    if (doShuffle !== false) shuffle(fresh);
    return n == null ? fresh : fresh.slice(0, n);
  }

  // A word counts once for each of its two cards, so the hub's pool of meaning
  // ids reads the production card too.
  function dueCount(pool) {
    return pool.reduce(function (n, it) {
      /* a word is one card: its form card when that was enrolled (it carries the word's production memory), else its first card */
      var f = formId(it.id);
      return n + ((f && isEnrolled(f)) ? (isDue(f) ? 1 : 0) : (isDue(it.id) ? 1 : 0));
    }, 0);
  }
  function enrolledCount() { return Object.keys(load()).filter(function (k) { return k !== META; }).length; }

  function shuffle(a, rng) {
    rng = rng || Math.random;
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // retention is applied as soon as the store is readable
  try { load(); applyRetention(); } catch (e) {}

  return {
    enrol: enrol, grade: grade, reviewLogKey: LOG_KEY, isDue: isDue, isEnrolled: isEnrolled, boxOf: boxOf,
    isDominado: isDominado, isLearnt: isLearnt, learn: learn, unlearn: unlearn, isLeech: isLeech, lapsesOf: lapsesOf, passed: passed, stabilityOf: stabilityOf,
    batch: batch, duePriority: duePriority, freshItems: freshItems,
    dueCount: dueCount, enrolledCount: enrolledCount, today: today,
    plan: plan, computePlan: computePlan, noteNew: noteNew, zeroStreak: zeroStreak, secondsPerCard: secondsPerCard,
    retentionPct: retentionPct, setRetentionPct: setRetentionPct, formId: formId,
    BUDGET_MIN: BUDGET_MIN, NEW_TARGET: NEW_TARGET, NEW_FLOOR: NEW_FLOOR,
    _reset: function () { _cache = null; applyRetention(); }
  };
})();
