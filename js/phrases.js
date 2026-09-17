/* ============================================================================
 * PHRASES — the keyword tables, as a live item source.
 *
 * Every lesson page opens with a table of the Spanish it is built out of, with
 * its English: 648 pages, 5,290 rows, curated by hand, level-tagged by the
 * lesson that carries them. Until now exactly one thing read them — the
 * renderer in js/views/learn.js. They were the best-structured content in the
 * app and they were decoration.
 *
 * This is the one place that turns them into items. Two consumers:
 *   js/gameitems.js   adds them to the translation/listening pool, so Traducción,
 *                     Escucha and Racha draw on the phrases the course actually
 *                     taught rather than only on example sentences
 *   js/views/review.js  carries them as `enrolledOnly` cards, so a phrase missed
 *                     in a game round comes back in Repasar tomorrow
 *
 * The id is `k:<spanish>` and is stable, which is what lets a miss in a game
 * schedule the same phrase for review — the contract the rest of the item
 * system already runs on (v:<es>:meaning, vt:<inf>:<tense>).
 *
 * WHAT IS THROWN AWAY, and why the tables can be written freely without
 * worrying about this module: a keyword row is written to be READ, so plenty
 * of rows are not things anybody types. Paradigm rows ("me / te / le"),
 * patterns ("¿Te gusta…?"), starred wrong forms ("*Yo gusto el cine") and
 * bare grammatical labels are all dropped here rather than being kept out of
 * the tables, where they earn their place.
 * ========================================================================== */
window.Phrases = (function () {
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var cache = null;

  /* Spanish somebody could be asked to produce. No slashes (a paradigm row),
   * no ellipsis (a pattern with a hole in it), no asterisk (marked as wrong),
   * no brackets (a teaching note that wandered into the Spanish column). */
  var PRODUCIBLE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ¿¡?!.,;:'’·—-]+$/;

  function usable(es) {
    if (!es) return false;
    es = String(es).trim();
    if (!PRODUCIBLE.test(es)) return false;
    if (/[/…*_(){}\[\]]/.test(es)) return false;
    if (es.indexOf('·') !== -1) return false;            // "me · te · le"
    var n = es.split(/\s+/).length;
    return n >= 1 && n <= 12;
  }

  /* "to like (literally: to please)" is a gloss plus a note. The note is worth
   * keeping — it is often the whole reason the row was written that way — but
   * it is not part of the answer, so it must not sit in the prompt. */
  function splitGloss(en) {
    var m = /^([^(]+?)\s*\(([^)]+)\)\s*$/.exec(String(en || '').trim());
    if (!m) return { en: String(en || '').trim(), note: null };
    return { en: m[1].trim(), note: m[2].trim() };
  }

  function build() {
    var out = [], seen = {};
    var lessons = window.ALL_LESSONS || window.GRAMMAR_LESSONS || [];
    lessons.forEach(function (l) {
      if (!l.keywords || !l.keywords.length) return;
      var band = BANDS.indexOf(l.cefr) === -1 ? 'B1' : l.cefr;
      l.keywords.forEach(function (k) {
        if (!k || !k.es || !k.en) return;
        var es = String(k.es).trim();
        if (!usable(es)) return;
        var key = es.toLowerCase();
        if (seen[key]) return;                 // the same phrase taught twice
        var g = splitGloss(k.en);
        if (!g.en) return;
        seen[key] = 1;
        out.push({
          id: 'k:' + es,
          es: es, en: g.en, note: g.note,
          band: band, level: l.level || 1, lesson: l.id
        });
      });
    });
    return out;
  }

  function all() {
    if (!cache) cache = build();
    return cache;
  }

  /* Only phrases from lessons this learner has actually been taught. A game
   * built on these is the strongest version of the idea — it cannot ask for
   * anything you were never shown. */
  function studied() {
    var done = {};
    try { done = (JSON.parse(localStorage.getItem('fluidez.progress')) || {}).studied || {}; } catch (e) { done = {}; }
    return all().filter(function (p) { return done[p.lesson]; });
  }

  function countByBand() {
    var o = {};
    all().forEach(function (p) { o[p.band] = (o[p.band] || 0) + 1; });
    return o;
  }

  return { all: all, studied: studied, countByBand: countByBand };
})();
