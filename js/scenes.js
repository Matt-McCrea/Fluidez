/* ============================================================================
 * SCENES — scripted dialogues played at the end of Produce.
 *
 * data/scenes/<band>.js (loaded on demand, NOT in index.html) defines
 * window.SCENES_<BAND>, scenes
 *   {id, unit, band, title, brief, turns:[{id, npc, npcEn, intent, accept[],
 *    require[], focus, next}], r: requires, d: legalDay, review?: true}
 *
 *   load(band, cb)                           inject the band file, cb(ok)
 *   pick(known, di, band, seen, opts)        one playable scene, or null
 *   turns(scene)                             the turns in play order (next links)
 *   grade(turn, text)                        {pass, via, hint} for one learner line
 *   shouldPlay(entry, di, unit)              is today a scene day?
 *
 * pick falls back to the band below when the band has nothing playable (if that file is loaded).
 * Playable: not marked review, d set and at or before today, every g: and x:
 * in r known (Known.allows on a scratch key), not served in 30 days (the
 * fluidez.seen key 'scene:<id>'). Scenes that use today's nodes come first.
 * ========================================================================== */
window.Scenes = (function () {
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var SEEN_DAYS = 30;
  var waiters = {};

  function load(band, cb) {
    cb = cb || function () {};
    if (window['SCENES_' + band]) { cb(true); return; }
    if (typeof document === 'undefined' || !document.createElement || !document.head) { cb(false); return; }
    if (!waiters[band]) {
      waiters[band] = [];
      var s = document.createElement('script');
      s.src = 'data/scenes/' + String(band).toLowerCase() + '.js';
      var fin = function (ok) { var w = waiters[band]; delete waiters[band]; w.forEach(function (f) { f(ok); }); };
      s.onload = function () { fin(!!window['SCENES_' + band]); };
      s.onerror = function () { fin(false); };
      document.head.appendChild(s);
    }
    waiters[band].push(cb);
  }

  function allowed(sc, known, today, band) {
    var Kn = window.Known, R = window.REQUIRES;
    if (!Kn || !R || !known) return true;
    var prev = R['scene:scratch'];
    R['scene:scratch'] = { r: (sc.r || []).filter(function (id) { return /^[gx]:/.test(id); }) };
    var ok = Kn.allows('scene:scratch', known, today, band);
    if (prev) R['scene:scratch'] = prev; else delete R['scene:scratch'];
    return ok;
  }
  function overlap(sc, today) {
    var n = 0;
    if (today) (sc.r || []).forEach(function (id) { if (today.has(id) && id.charAt(0) !== 'l') n++; });
    return n;
  }

  /* opts: { today: Set of today's nodes, day: day number for the ledger } */
  function pickIn(known, di, band, seen, opts) {
    var all = window['SCENES_' + band] || [];
    var day = opts.day != null ? opts.day : Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    seen = seen || {};
    var out = [];
    all.forEach(function (sc, i) {
      if (sc.review || sc.d == null) return;
      if (di != null && sc.d > di) return;
      var last = seen['scene:' + sc.id];
      if (last != null && day - last < SEEN_DAYS) return;
      if (!allowed(sc, known, opts.today, band)) return;
      out.push({ sc: sc, o: overlap(sc, opts.today), i: i });
    });
    out.sort(function (a, b) { return (b.o - a.o) || (b.sc.d - a.sc.d) || (a.i - b.i); });
    return out.length ? out[0].sc : null;
  }
  /* The learner's band first; when it has nothing playable, the band below (only if its file is already
   * loaded: pick stays synchronous). Returns null at once when neither has a scene. */
  function pick(known, di, band, seen, opts) {
    opts = opts || {};
    var sc = pickIn(known, di, band, seen, opts);
    if (sc) return sc;
    var k = BANDS.indexOf(band);
    return k > 0 ? pickIn(known, di, BANDS[k - 1], seen, opts) : null;
  }

  function find(id) {
    for (var b = 0; b < BANDS.length; b++) {
      var list = window['SCENES_' + BANDS[b]] || [];
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    }
    return null;
  }

  function turns(scene) {
    var by = {}, out = [], seen = {};
    (scene.turns || []).forEach(function (t) { by[t.id] = t; });
    var t = (scene.turns || [])[0];
    while (t && !seen[t.id]) { seen[t.id] = 1; out.push(t); t = t.next ? by[t.next] : null; }
    return out;
  }

  /* A line passes when the matcher accepts it against the turn's accept list,
   * or when it has constraints and every one passes. */
  function grade(turn, text) {
    text = String(text || '').trim();
    if (!text) return { pass: false, via: null, hint: '' };
    var C = window.Checker, M = window.LIB && window.LIB.match;
    var acc = turn.accept || [], req = turn.require || [];
    if (req.length && C) {
      var res = C.checkWriting({ type: 'scene', constraints: req }, text);
      var known = res.results.every(function (r) { return !/^unknown constraint/.test(r.label || ''); });
      if (known && res.results.every(function (r) { return r.pass; })) return { pass: true, via: 'constraints', hint: '' };
    }
    var hint = '';
    if (M && acc.length) {
      var r = M.matchTranslation(text, { es: acc[0], en: turn.intent || '', accept: acc }, { accents: 'lenient' });
      if (r.pass) return { pass: true, via: 'match', hint: r.note || '' };
      hint = r.hint || '';
    }
    return { pass: false, via: null, hint: hint };
  }

  /* A scene day: a task day, a practice day, or every fourth lesson day of the unit. */
  function shouldPlay(entry, di, unit) {
    if (!entry) return false;
    if (entry.practice) return true;
    if (entry.lesson && /^task-/.test(entry.lesson)) return true;
    if (!entry.lesson) return false;
    var from = unit && unit.from != null ? unit.from : null;
    if (from == null || di == null) return false;
    return (di - from + 1) % 4 === 0;
  }

  return { load: load, pick: pick, find: find, turns: turns, grade: grade, shouldPlay: shouldPlay, SEEN_DAYS: SEEN_DAYS };
})();
