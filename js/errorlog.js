/* ============================================================================
 * ERROR LOG — your personal mistakes, captured and resurfaced.
 *
 * Whenever you miss something (reveal a cloze, get a short answer wrong, …) the
 * stage records it here. Reviewable misses also enrol into the SRS and are made
 * due today, so they come back in the daily Repasar stage — targeted review of
 * YOUR gaps, the highest-leverage practice there is. The "Tus errores" view
 * drills them on demand; the dashboard shows your worst offenders.
 *
 * Store (localStorage 'fluidez.errors'):
 *   id -> { id, front, back, kind, source, reviewable, count, lastDay }
 * ========================================================================== */
window.ErrorLog = (function () {
  var KEY = 'fluidez.errors';
  var S = window.SRS;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  // Record a miss. `e` = { id, front, back, kind, source, reviewable, hint }.
  function record(e) {
    if (!e) return;
    /* A MISS WITHOUT AN ID IS STILL A MISS. This required one, which is right
     * for the SRS — the id is its scheduling key — and wrong here, where the
     * key only has to be stable enough to file the entry under and count it.
     * Measured over 300 draws each: the contrast game carries an id on none of
     * its items and translation on half, so a whole game's mistakes were
     * dropped on the floor and "Mis fallos" could stay empty however much you
     * played. Synthesised from what the question was, and prefixed so it can
     * never collide with a real SRS id. */
    var id = e.id || ('miss:' + (e.kind || 'x') + ':' +
                      String(e.front || e.back || '').slice(0, 60));
    if (!id) return;
    var s = load();
    var prev = s[id];
    s[id] = {
      id: id, front: e.front, back: e.back, kind: e.kind || 'error',
      source: e.source || '', hint: e.hint || null,
      /* What the miss was ABOUT, as a stable key — "tense:presubj",
       * "lesson:ser-estar". `source` says which stage produced it, which is no
       * use for noticing that someone keeps getting the subjunctive wrong.
       * js/suggest.js aggregates on this to offer the right deep dive. */
      topic: e.topic || (prev && prev.topic) || null,
      // es/en when the miss was a vocabulary pair — lets "add to Palabras"
      // offer the right orientation from a weak-spots row.
      es: e.es || (prev && prev.es) || null, en: e.en || (prev && prev.en) || null,
      /* The options, when it was a question you tapped. Without them a cloze
       * or a ser/estar contrast can only be re-asked as a typed answer, and
       * "the missing word" typed into an empty box is a different and often
       * ambiguous question — por and para both fit most gaps until you see
       * that those are the two choices. */
      options: (e.options && e.options.length ? e.options.slice() : null) ||
               (prev && prev.options) || null,
      reviewable: !!e.reviewable,
      count: (prev ? prev.count : 0) + 1,
      lastDay: S ? S.today() : 0
    };
    save(s);
    if (e.reviewable && S) { S.enrol(id); S.grade(id, false); }   // due today
  }

  // Reviewable entries as review cards (fed into the Review pool + errors deck).
  function cards() {
    var s = load(), out = [];
    Object.keys(s).forEach(function (k) {
      var e = s[k];
      if (e.reviewable && !(window.Vetoed && window.Vetoed.has(e.id))) {
        out.push({ id: e.id, front: e.front, back: e.back, kind: 'error', hint: e.hint });
      }
    });
    return out;
  }

  // All entries, newest/worst first — for the errors view and the dashboard.
  function list() {
    var s = load();
    return Object.keys(s).map(function (k) { return s[k]; })
      .sort(function (a, b) { return (b.count - a.count) || (b.lastDay - a.lastDay); });
  }

  function remove(id) { var s = load(); delete s[id]; save(s); }
  function clearAll() { save({}); }
  function count() { return Object.keys(load()).length; }

  return { record: record, cards: cards, list: list, remove: remove, clearAll: clearAll, count: count };
})();
