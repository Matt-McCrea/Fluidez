/* ============================================================================
 * SRS — a small spaced-repetition scheduler (Leitner-with-easing), extended
 * with graduation, leech handling, a hard session cap and per-(item,aspect)
 * ids so review stays useful as the corpus grows instead of being swallowed
 * by "everything due".
 *
 * Generic and content-agnostic: it schedules any item by a stable string id.
 * Views decide what an item *is* (a vocab card, a conjugation, a grammar recall
 * prompt) and enrol it the first time it's taught/seen. Review then surfaces
 * exactly the items that are due, protecting prior learning first — the
 * highest-leverage daily activity.
 *
 * Schedule per item: { box, due(dayNumber), reps, lapses, consecCorrect,
 * consecMiss, dominado, leech }
 *   grade good  → advance a box; interval = INTERVALS[box]; due = today+interval
 *   grade again → drop to box 0 (or a reduced box if it had graduated)
 * Day numbers are integer days since epoch (local), so "due" is date-based.
 *
 * ---- graduation ----
 * An item that reaches box 8 (120-day interval) with 4 consecutive correct
 * grades becomes `dominado` and leaves the normal due pool entirely — it's
 * the single biggest lever against basics crowding the queue as the corpus
 * grows. Graduated items are still sampled, at ~5% of a session's review
 * slots, as spot-checks (same card, same grading); a miss demotes the item
 * back to active life with a reduced interval rather than a full reset.
 *
 * ---- leeches ----
 * An item missed 6 times lifetime or 3 times in a row is a leech: repeated
 * failure means the teaching didn't land, not that it needs more testing.
 * Leeches are pulled out of the normal due pool (never auto-surfaced in
 * Repasar) and are only reachable through Puntos débiles / Tus errores,
 * where the existing error log already routes misses. Two grades in a row
 * clears the flag.
 *
 * ---- ids ----
 * Vocab used to be scheduled as a single `v:<es>` id (meaning only). It now
 * tracks meaning and gender-article as separate aspects: `v:<es>:meaning`
 * and (once that aspect is introduced) `v:<es>:gender`. A one-time migration
 * below renames existing `v:<es>` records to `v:<es>:meaning` so no history
 * is lost. Verbs get a new, separate aspect — `vt:<inf>:<tense>` — scheduling
 * conjugation-in-context (previously not scheduled at all); verb *meaning*
 * keeps its existing `vm:<inf>` id. Grammar stays concept-level, unchanged.
 * ========================================================================== */
window.SRS = (function () {
  var KEY = 'fluidez.srs';
  var SCHEMA_KEY = 'fluidez.srsSchema';
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64, 120, 180];   // days by box
  var GRAD_BOX = 8;          // index where the interval first reaches 120 days
  var GRAD_STREAK = 4;       // consecutive correct required, alongside GRAD_BOX
  var LEECH_LIFETIME = 6;
  var LEECH_STREAK = 3;
  var LEECH_RECOVER = 2;     // consecutive correct that clears a leech flag
  var SPOT_CHECK_RATE = 0.05;

  function today() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000); }

  function fillDefaults(it) {
    it = it || {};
    return {
      box: it.box || 0, due: it.due != null ? it.due : today(),
      reps: it.reps || 0, lapses: it.lapses || 0,
      consecCorrect: it.consecCorrect || 0, consecMiss: it.consecMiss || 0,
      dominado: !!it.dominado, leech: !!it.leech
    };
  }

  // One-time, additive migration, run until the stored schema marker is current:
  //   v2 — rename the old single vocab id (`v:<es>`) to the meaning-aspect id
  //        (`v:<es>:meaning`), and backfill the new streak/graduation fields.
  //   v3 — rename legacy captured-word ids (`cap:<es>`) to the same unified
  //        vocab id (`v:<es>:meaning`) now that user words merge into VOCAB,
  //        so a captured word's review history carries over intact.
  // If both an old and a renamed id exist, the more-progressed (higher box)
  // record wins so no streak is lost. Every other id shape is untouched.
  var SCHEMA_CURRENT = '3';
  function migrate(s) {
    var done = null;
    try { done = localStorage.getItem(SCHEMA_KEY); } catch (e) {}
    if (done === SCHEMA_CURRENT) return s;
    var out = {};
    function place(id, rec) {
      rec = fillDefaults(rec);
      if (!out[id] || (rec.box || 0) > (out[id].box || 0)) out[id] = rec;
    }
    Object.keys(s).forEach(function (id) {
      var newId = id;
      if (/^cap:/.test(id)) newId = 'v:' + id.slice(4) + ':meaning';
      else if (/^v:/.test(id) && !/:(meaning|gender)$/.test(id)) newId = id + ':meaning';
      place(newId, s[id]);
    });
    save(out);
    try { localStorage.setItem(SCHEMA_KEY, SCHEMA_CURRENT); } catch (e) {}
    return out;
  }

  function load() {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { s = {}; }
    return migrate(s);
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  function state(id) { return load()[id] || null; }
  function isEnrolled(id) { return !!state(id); }

  function enrol(id) {
    var s = load();
    if (!s[id]) { s[id] = fillDefaults(); save(s); }
  }

  function grade(id, good) {
    var s = load();
    var it = s[id] || fillDefaults();
    it.reps++;
    if (good) {
      it.consecCorrect++; it.consecMiss = 0;
      it.box = Math.min(it.box + 1, INTERVALS.length - 1);
      if (!it.dominado && it.box >= GRAD_BOX && it.consecCorrect >= GRAD_STREAK) it.dominado = true;
      if (it.leech && it.consecCorrect >= LEECH_RECOVER) it.leech = false;
    } else {
      it.lapses++; it.consecMiss++; it.consecCorrect = 0;
      if (it.dominado) { it.dominado = false; it.box = Math.max(0, it.box - 4); }
      else { it.box = 0; }
      if (it.lapses >= LEECH_LIFETIME || it.consecMiss >= LEECH_STREAK) it.leech = true;
    }
    it.due = today() + INTERVALS[it.box];
    s[id] = it; save(s);
  }

  // Due for normal review — never true for a graduated (spot-checked
  // separately) or leeched (routed to Puntos débiles) item.
  function isDue(id) { var it = state(id); return !!it && !it.dominado && !it.leech && it.due <= today(); }
  function boxOf(id) { var it = state(id); return it ? it.box : 0; }   // 0 = new / fragile
  function isDominado(id) { var it = state(id); return !!it && it.dominado; }
  function isLeech(id) { var it = state(id); return !!it && it.leech; }

  function rescheduleJitter(id, s) {
    var it = s[id]; if (!it) return;
    it.due = today() + 1 + Math.floor(Math.random() * 3);   // +1..+3 days
    s[id] = it;
  }

  // Build a review batch from a candidate pool.
  //   pool        : [{ id, ... }]   (any objects carrying a stable `id`)
  //   maxDue      : cap on already-enrolled due items — the hard session cap.
  //                 When more are due than fit, the highest-priority ones
  //                 (most overdue, then weakest box) are chosen and the
  //                 overflow is rescheduled a few days out with jitter,
  //                 rather than piling into tomorrow's backlog.
  //   maxNew      : cap on brand-new items to introduce this session
  //   shuffleFresh: shuffle new items (default true). Pass false to introduce
  //                 them in the pool's given order (beginners: easiest-first).
  // Returns the chosen items (due + graduated spot-checks, then new).
  function batch(pool, maxDue, maxNew, shuffleFresh) {
    var s = load();
    var due = [], fresh = [], grad = [];
    pool.forEach(function (it) {
      var st = s[it.id];
      if (st) {
        if (st.leech) return;                    // pulled from automatic rotation
        if (st.dominado) grad.push(it);
        else if (st.due <= today()) due.push(it);
      } else fresh.push(it);
    });
    due.sort(function (a, b) {
      var sa = s[a.id], sb = s[b.id];
      var oa = today() - sa.due, ob = today() - sb.due;
      if (oa !== ob) return ob - oa;              // most overdue first
      return sa.box - sb.box;                     // then weakest ease
    });
    var cap = maxDue == null ? due.length : maxDue;
    var chosen = due.slice(0, cap);
    var overflow = due.slice(cap);
    if (overflow.length) {
      overflow.forEach(function (it) { rescheduleJitter(it.id, s); });
      save(s);
    }
    shuffle(grad);
    var spotChecks = grad.slice(0, Math.max(0, Math.round(cap * SPOT_CHECK_RATE)));
    if (shuffleFresh !== false) shuffle(fresh);
    var freshChosen = fresh.slice(0, maxNew == null ? 0 : maxNew);
    return shuffle(chosen.concat(spotChecks)).concat(freshChosen);
  }

  // Read-only priority ordering (most overdue, then weakest ease) over a pool,
  // with no side effects — no jitter reschedule, no state change. Used by the
  // on-demand content selectors (Practicar) to pull a SUBSET of due items into
  // a mixed round without disturbing the real due schedule that the once-daily
  // Repasar stage (batch(), above) relies on.
  function duePriority(pool, n) {
    var s = load();
    var due = pool.filter(function (it) { var st = s[it.id]; return st && !st.leech && !st.dominado && st.due <= today(); });
    due.sort(function (a, b) {
      var sa = s[a.id], sb = s[b.id];
      var oa = today() - sa.due, ob = today() - sb.due;
      if (oa !== ob) return ob - oa;
      return sa.box - sb.box;
    });
    return n == null ? due : due.slice(0, n);
  }

  // Never-enrolled items from a pool — the "brand new" half of a Stretch bucket.
  function freshItems(pool, n, doShuffle) {
    var s = load();
    var fresh = pool.filter(function (it) { return !s[it.id]; });
    if (doShuffle !== false) shuffle(fresh);
    return n == null ? fresh : fresh.slice(0, n);
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
    enrol: enrol, grade: grade, isDue: isDue, isEnrolled: isEnrolled, boxOf: boxOf,
    isDominado: isDominado, isLeech: isLeech,
    batch: batch, duePriority: duePriority, freshItems: freshItems,
    dueCount: dueCount, enrolledCount: enrolledCount, today: today
  };
})();
