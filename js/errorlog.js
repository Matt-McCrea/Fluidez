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
    if (!e || !e.id) return;
    var s = load();
    var prev = s[e.id];
    s[e.id] = {
      id: e.id, front: e.front, back: e.back, kind: e.kind || 'error',
      source: e.source || '', hint: e.hint || null,
      // es/en when the miss was a vocabulary pair — lets "add to Palabras"
      // offer the right orientation from a weak-spots row.
      es: e.es || (prev && prev.es) || null, en: e.en || (prev && prev.en) || null,
      reviewable: !!e.reviewable,
      count: (prev ? prev.count : 0) + 1,
      lastDay: S ? S.today() : 0
    };
    save(s);
    if (e.reviewable && S) { S.enrol(e.id); S.grade(e.id, false); }   // due today
  }

  // Reviewable entries as review cards (fed into the Review pool + errors deck).
  function cards() {
    var s = load(), out = [];
    Object.keys(s).forEach(function (k) {
      var e = s[k];
      if (e.reviewable) out.push({ id: e.id, front: e.front, back: e.back, kind: 'error', hint: e.hint });
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
