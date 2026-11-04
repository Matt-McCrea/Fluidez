/* ============================================================================
 * CONTRASTS — review cards for the contrast store (data/contrasts/*.js).
 *
 * A contrast (ser/estar, por/para, preterite/imperfect...) is only ever mixed
 * into review once BOTH sides are known: each side is taught alone first, and
 * the mix comes in later sessions, never inside one session's teaching.
 *
 *   load(cb)                    injects data/contrasts/index.js and items.js once
 *   mixable(known)              contrasts whose every side node is in `known`
 *   cardsFor(known, n, rng, o)  up to n review cards, one per contrast, balanced
 *                               across sides, lowest rung first, 14-day ledger
 *   cardOf(item)                the card shape for one item (also for due items)
 *
 * Loaded on demand by js/views/review.js (script injection), like the story
 * bands in js/library.js; it is not listed in index.html.
 * ========================================================================== */
window.Contrasts = (function () {
  var FILES = ['data/contrasts/index.js', 'data/contrasts/items.js'];
  var SEEN_KEY = 'fluidez.seen', SEEN_DAYS = 14;
  var loading = null;

  function inject(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('offline')); };
      document.head.appendChild(s);
    });
  }
  function ready() { return !!(window.CONTRASTS && window.CONTRAST_ITEMS); }
  function load(cb) {
    cb = cb || function () {};
    if (ready()) { cb(true); return; }
    if (typeof document === 'undefined') { cb(false); return; }
    if (!loading) {
      loading = Promise.all(FILES.map(inject)).then(function () { return ready(); },
        function () { loading = null; return false; });
    }
    loading.then(cb);
  }

  function sideIds(c) {
    var out = (c.sides || []).map(function (s) { return s.id; });
    var g = window.GRAPH && window.GRAPH.nodes;
    if (g) {
      var n = null;
      for (var i = 0; i < g.length; i++) if (g[i].id === c.node) { n = g[i]; break; }
      ((n && n.contrasts) || []).forEach(function (id) { if (out.indexOf(id) === -1) out.push(id); });
    }
    return out;
  }
  function mixable(known) {
    if (!ready() || !known) return [];
    return window.CONTRASTS.filter(function (c) {
      var ids = sideIds(c);
      return ids.length >= 2 && ids.every(function (id) { return known.has(id); });
    });
  }

  function loadSeen() { try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { return {}; } }
  function today() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000); }
  function markSeen(cards) {
    try {
      var seen = loadSeen(), d = today();
      cards.forEach(function (c) { seen[c.id] = d; });
      localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    } catch (e) {}
  }

  /* "none of the teaching nodes is unmet": g: and x: requires must be known,
   * anything else (lexemes, patterns, chunks) does not block. */
  function legal(it, known, dayIndex) {
    if (it.d == null) return false;
    if (dayIndex != null && dayIndex >= 0 && it.d > dayIndex) return false;
    return (it.r || []).every(function (id) { return !/^[gx]:/.test(id) || known.has(id); });
  }
  function clean(s) { return String(s || '').replace(/\s*[–—]\s*/g, ', ').replace(/\s+-\s+/g, ', '); }
  function cardOf(it) {
    return { id: 'x:' + it.id, kind: 'contrast', es: it.es, en: it.en, gap: it.gap,
             options: it.options, answer: it.answer, why: clean(it.why), x: it.x };
  }

  var _byContrast = null, _src = null;
  function itemsBy() {
    if (_src !== window.CONTRAST_ITEMS) {
      _src = window.CONTRAST_ITEMS; _byContrast = {};
      _src.forEach(function (it) { (_byContrast[it.x] = _byContrast[it.x] || []).push(it); });
    }
    return _byContrast;
  }
  function itemById(id) {      // id is the card id, 'x:' + item.id
    if (!ready()) return null;
    var raw = String(id).slice(2);
    var by = itemsBy(), x = raw.split('#')[0], list = by[x] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === raw) return list[i];
    return null;
  }
  function pick(arr, rng) { return arr[Math.floor((rng || Math.random)() * arr.length)]; }

  /* opts: { dayIndex, isEnrolled(id), passed(id) }. Items already enrolled are
   * scheduled by FSRS and come back through the pool, so only fresh ones are drawn. */
  function cardsFor(known, n, rng, opts) {
    opts = opts || {};
    var out = [];
    if (!ready() || !known || n <= 0) return out;
    var seen = loadSeen(), td = today(), by = itemsBy();
    var order = mixable(known).slice();
    // shuffle contrasts so a few do not hog the weekly slot
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor((rng || Math.random)() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t;
    }
    for (var k = 0; k < order.length && out.length < n; k++) {
      var c = order[k], items = by[c.node] || by[c.id] || [];
      var fresh = items.filter(function (it) {
        var id = 'x:' + it.id, s = seen[id];
        if (s != null && td - s >= 0 && td - s < SEEN_DAYS) return false;
        if (opts.isEnrolled && opts.isEnrolled(id)) return false;
        return legal(it, known, opts.dayIndex);
      });
      if (!fresh.length) continue;
      // balance: the side with fewer items already met goes first
      var met = {};
      items.forEach(function (it) {
        var id = 'x:' + it.id;
        if (seen[id] != null || (opts.isEnrolled && opts.isEnrolled(id))) met[it.side] = (met[it.side] || 0) + 1;
      });
      var sides = {};
      fresh.forEach(function (it) { sides[it.side] = 1; });
      var names = Object.keys(sides).sort(function (a, b) { return (met[a] || 0) - (met[b] || 0); });
      var lowest = names.filter(function (s) { return (met[s] || 0) === (met[names[0]] || 0); });
      var side = pick(lowest, rng);
      var cand = fresh.filter(function (it) { return it.side === side; });
      var r0 = Math.min.apply(null, cand.map(function (it) { return it.rung; }));
      out.push(cardOf(pick(cand.filter(function (it) { return it.rung === r0; }), rng)));
    }
    return out;
  }

  return { load: load, ready: ready, mixable: mixable, cardsFor: cardsFor, cardOf: cardOf,
           itemById: itemById, markSeen: markSeen, SEEN_DAYS: SEEN_DAYS };
})();
