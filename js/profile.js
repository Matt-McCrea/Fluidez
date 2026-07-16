/* ============================================================================
 * PROFILE — one app, tuned for different learners.
 *
 * A profile is a bundle of knobs the session reads to pace and pitch the day:
 *   standard   — the balanced default (production-oriented).
 *   beginner   — recognition-first, heavy support: Spanish→English multiple
 *                choice, word-bank cloze, vocab introduced easiest-first and
 *                gated to everyday categories, grammar taught slowly (a lesson
 *                repeats before it advances), guided (not open) production.
 *   refresher  — for rusty ex-speakers: everything unlocked from day one,
 *                bigger review batches, typed production, paragraphs & free
 *                writing to the fore.
 *
 * Resolution order: URL ?p=<name> (also persists it) → localStorage → standard.
 * So each person can have a dedicated link (…/?p=beginner) or switch on the hub.
 * ========================================================================== */
window.Profile = (function () {
  var KEY = 'fluidez.profile';

  // Everyday categories a true beginner meets first — order matters (they are
  // introduced in this sequence). Advanced categories (finance, bureaucracy,
  // career, society, technology, professions) are gated out for beginners.
  var BEGINNER_CATS = ['greetings', 'people', 'food', 'numbers', 'time', 'colors',
    'places', 'home', 'body', 'nature', 'adjectives', 'travel', 'weather',
    'clothing', 'animals', 'questions', 'connectors', 'common', 'school',
    'health', 'shopping', 'sports', 'kitchen', 'work'];

  var PROFILES = {
    standard: {
      name: 'standard', label: 'Standard',
      newPerDay: 4, reviewBatchMax: 12,
      reviewDirection: 'en2es', reviewMode: 'type',
      orderedVocab: false, vocabCats: null,
      syllabusPace: 1, unlockAll: false,
      applyMode: 'type', produceStyle: 'full'
    },
    beginner: {
      name: 'beginner', label: 'Beginner',
      newPerDay: 3, reviewBatchMax: 10,
      reviewDirection: 'es2en', reviewMode: 'choice',
      orderedVocab: true, vocabCats: BEGINNER_CATS,
      syllabusPace: 3, unlockAll: false,
      applyMode: 'wordbank', produceStyle: 'guided'
    },
    refresher: {
      name: 'refresher', label: 'Refresher',
      newPerDay: 12, reviewBatchMax: 16,
      reviewDirection: 'en2es', reviewMode: 'type',
      orderedVocab: false, vocabCats: null,
      syllabusPace: 1, unlockAll: true,
      applyMode: 'type', produceStyle: 'full'
    }
  };

  function resolve() {
    var m = (location.search.match(/[?&]p=([a-z]+)/) || [])[1];
    if (m && PROFILES[m]) { try { localStorage.setItem(KEY, m); } catch (e) {} return m; }
    try { var s = localStorage.getItem(KEY); if (s && PROFILES[s]) return s; } catch (e) {}
    return 'standard';
  }

  var current = resolve();

  return {
    params: function () { return PROFILES[current]; },
    current: function () { return current; },
    all: function () { return Object.keys(PROFILES).map(function (k) { return PROFILES[k]; }); },
    set: function (name) { if (PROFILES[name]) { current = name; try { localStorage.setItem(KEY, name); } catch (e) {} } },
    catAllowed: function (cat) { var c = PROFILES[current].vocabCats; return !c || c.indexOf(cat) !== -1; },
    catRank: function (cat) { var c = PROFILES[current].vocabCats; var i = c ? c.indexOf(cat) : -1; return i === -1 ? 999 : i; }
  };
})();
