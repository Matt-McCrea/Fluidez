/* ============================================================================
 * SUGGEST — offer a deep dive at the moment it would help.
 *
 * The twelve optional units cost no day and never appear on the daily path,
 * which makes them invisible unless something surfaces them. A browsable index
 * (Profundizar) and a link from the core lesson both wait to be discovered.
 * This is the route that does not wait: the error log already records every
 * miss, so when somebody has got the same thing wrong repeatedly, the deep
 * dive that answers it is offered unprompted.
 *
 * Each miss carries a `topic` — "tense:presubj", "lesson:ser-estar" — and each
 * optional unit declares the topics it answers, in data/course.js. Matching
 * the two is the whole mechanism.
 *
 * Three rules keep it from nagging:
 *   - a THRESHOLD of misses, so one bad day does not trigger anything
 *   - one suggestion at a time, the strongest
 *   - dismissal is remembered, and a unit already studied never comes back
 * ========================================================================== */
window.Suggest = (function () {
  var KEY = 'fluidez.suggest';
  var THRESHOLD = 4;        // misses on one unit's topics before it is offered
  var RESURFACE = 30;       // days before a dismissed unit may be offered again

  function loadState() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveState(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function today() { return window.SRS ? window.SRS.today() : 0; }
  function studied() {
    try { return (JSON.parse(localStorage.getItem('fluidez.progress')) || {}).studied || {}; }
    catch (e) { return {}; }
  }

  /* Misses per optional unit, counted across all of that unit's triggers.
   * `count` is how many times the learner got that item wrong, not how many
   * distinct items — four misses of one stubborn thing is exactly the signal
   * we want, and is likelier than four different ones. */
  function scores() {
    var errs = window.ErrorLog ? window.ErrorLog.list() : [];
    var byTopic = {};
    errs.forEach(function (e) {
      if (!e.topic) return;
      byTopic[e.topic] = (byTopic[e.topic] || 0) + (e.count || 1);
    });
    var out = [];
    var units = window.COURSE_UNITS || {};
    Object.keys(units).forEach(function (k) {
      var u = units[k];
      if (!u.optional || !(u.triggers || []).length) return;
      var n = 0, hit = [];
      u.triggers.forEach(function (t) { if (byTopic[t]) { n += byTopic[t]; hit.push(t); } });
      if (n) out.push({ unit: u, score: n, topics: hit });
    });
    return out.sort(function (a, b) { return b.score - a.score; });
  }

  /* The one deep dive worth offering right now, or null. Null is the normal
   * answer and the app must look unchanged when it comes back. */
  function best() {
    var st = loadState(), done = studied(), now = today();
    var ranked = scores().filter(function (r) {
      if (r.score < THRESHOLD) return false;
      // already worked through it — every lesson in the unit is studied
      var all = (r.unit.lessons || []);
      if (all.length && all.every(function (id) { return done[id]; })) return false;
      var d = st[r.unit.id];
      if (d && d.dismissed && now - d.dismissed < RESURFACE) return false;
      return true;
    });
    return ranked.length ? ranked[0] : null;
  }

  function dismiss(unitId) {
    var st = loadState();
    st[unitId] = st[unitId] || {};
    st[unitId].dismissed = today();
    saveState(st);
  }
  function accept(unitId) {
    var st = loadState();
    st[unitId] = st[unitId] || {};
    st[unitId].opened = today();
    saveState(st);
  }

  /* A card offering the suggestion. Returns null when there is nothing to
   * offer, so callers can append unconditionally. `onOpen` is given the unit. */
  function card(onOpen) {
    var r = best();
    if (!r) return null;
    var UI = window.UI;
    var box = UI.el('div', 'suggest-card');
    box.appendChild(UI.el('div', 'suggest-eyebrow', 'Te está costando esto'));
    box.appendChild(UI.el('div', 'suggest-title', r.unit.title));
    if (r.unit.goal) box.appendChild(UI.el('div', 'suggest-goal', r.unit.goal));
    box.appendChild(UI.el('div', 'suggest-why',
      'You have missed this ' + r.score + ' times. This deep dive is ' +
      (r.unit.lessons || []).length + ' lessons and is not part of your daily path — ' +
      'take it whenever you like.'));
    var row = UI.el('div', 'row-controls');
    var go = UI.el('button', 'primary-btn', 'Ver la unidad →'); go.type = 'button';
    go.addEventListener('click', function () { accept(r.unit.id); onOpen(r.unit); });
    var no = UI.el('button', 'ghost-btn', 'Ahora no'); no.type = 'button';
    no.addEventListener('click', function () { dismiss(r.unit.id); box.remove(); });
    row.appendChild(go); row.appendChild(no);
    box.appendChild(row);
    return box;
  }

  return { best: best, card: card, scores: scores, dismiss: dismiss, accept: accept,
           THRESHOLD: THRESHOLD };
})();
