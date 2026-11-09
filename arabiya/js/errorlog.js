/* ============================================================================
 * ERROR LOG: your own mistakes, kept and resurfaced (talaqa.errors).
 *   id -> { id, front, back, kind, source, topic, options, count, ok, lastDay }
 * A miss files an entry; three right answers in a row clear it.
 * ========================================================================== */
window.ErrorLog = (function () {
  var KEY = 'talaqa.errors';
  var S = window.SRS;
  var RECOVER = 3;                 // right answers in a row before a mistake stops being one

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  // The key an entry is filed under; record() and credit() must agree on it.
  function keyFor(e) {
    if (!e) return null;
    return e.id || ('miss:' + (e.kind || 'x') + ':' + String(e.front || e.back || '').slice(0, 60));
  }

  function credit(e) {
    var id = keyFor(e);
    if (!id) return;
    var s = load();
    var it = s[id];
    if (!it) return;
    it.ok = (it.ok || 0) + 1;
    if (it.ok >= RECOVER) delete s[id]; else s[id] = it;
    save(s);
  }

  // e = { id, front, back, kind, source, topic, options, ga, en }
  function record(e) {
    if (!e) return;
    var id = keyFor(e);
    if (!id) return;
    var s = load();
    var prev = s[id];
    s[id] = {
      id: id, front: e.front, back: e.back, kind: e.kind || 'error',
      source: e.source || '',
      topic: e.topic || (prev && prev.topic) || null,
      ga: e.ga || (prev && prev.ga) || null, en: e.en || (prev && prev.en) || null,
      // the options it was tapped from, so a gap is re-asked as the same choice
      options: (e.options && e.options.length ? e.options.slice() : null) || (prev && prev.options) || null,
      cefr: e.cefr || (prev && prev.cefr) || null,
      count: (prev ? prev.count : 0) + 1,
      ok: 0,
      lastDay: S ? S.today() : 0
    };
    save(s);
  }

  // All entries, worst and newest first.
  function list() {
    var s = load();
    return Object.keys(s).map(function (k) { return s[k]; })
      .sort(function (a, b) { return (b.count - a.count) || (b.lastDay - a.lastDay); });
  }
  function remove(id) { var s = load(); delete s[id]; save(s); }
  function clearAll() { save({}); }
  function count() { return Object.keys(load()).length; }

  return { record: record, credit: credit, keyFor: keyFor, RECOVER: RECOVER, list: list,
    remove: remove, clearAll: clearAll, count: count };
})();
