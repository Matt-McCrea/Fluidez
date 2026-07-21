/* ============================================================================
 * PROFILE — one app, tuned for different learners.
 *
 * A profile is a bundle of knobs the session reads to pace and pitch the day:
 *   standard   — the balanced default (production-oriented).
 *   beginner   — recognition-first, heavy support: Spanish→English multiple
 *                choice, word-bank cloze, vocab introduced easiest-first and
 *                gated to everyday categories, grammar taught slowly (a lesson
 *                repeats before it advances), guided (not open) production,
 *                conjugation quizzes/games restricted to verbs actually met
 *                so far (conjugableVerbs()) — plain vocab flashcards/quizzes
 *                are exempt, since meeting a verb's meaning there is fine.
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

  // Reduced tense set for a true beginner (present + the two core pasts);
  // everyone else works with the full ordered list. Shared by the
  // Conjugación rápida game and the Conjugación drill in Practicar so
  // neither has to keep its own copy.
  var CORE_TENSES = ['presente', 'preterito', 'imperfecto'];
  function fullTenseSet() { return (window.ENGINE ? window.ENGINE.TENSES : []).map(function (t) { return t.key; }); }

  var PROFILES = {
    standard: {
      name: 'standard', label: 'Standard',
      newPerDay: 4, reviewBatchMax: 20,
      reviewDirection: 'en2es', reviewMode: 'type',
      orderedVocab: false, vocabCats: null,
      syllabusPace: 1, unlockAll: false,
      applyMode: 'type', produceStyle: 'full',
      // Phase 3's Due/Focus/Stretch mix for on-demand practice rounds.
      bucketRatios: { due: 0.50, focus: 0.30, stretch: 0.20 },
      tenses: function () { return fullTenseSet(); },
      defaultGameMode: 'tranquilo',
      selectors: ['inteligente', 'tema', 'gramatica', 'debiles', 'siguiente'],
      cualPairs: ['ser-estar', 'por-para', 'preterite-imperfect', 'subj']
    },
    beginner: {
      name: 'beginner', label: 'Beginner',
      newPerDay: 3, reviewBatchMax: 12,
      // graduated: new words come as ES→EN recognition (multiple choice), then
      // flip to EN→ES production (typed) once they've stuck (SRS box ≥ 2).
      reviewDirection: 'graduated', reviewMode: 'choice',
      orderedVocab: true, vocabCats: BEGINNER_CATS,
      syllabusPace: 3, unlockAll: false,
      applyMode: 'wordbank', produceStyle: 'guided',
      bucketRatios: { due: 0.65, focus: 0.25, stretch: 0.10 },
      tenses: function () { return CORE_TENSES; },
      defaultGameMode: 'tranquilo',
      // Gramática and Puntos débiles are noise before there's enough data to
      // fill them; article drills (Opción múltiple) and ser/estar stay in.
      selectors: ['inteligente', 'tema', 'siguiente'],
      cualPairs: ['ser-estar']
    },
    refresher: {
      name: 'refresher', label: 'Refresher',
      newPerDay: 12, reviewBatchMax: 30,
      reviewDirection: 'en2es', reviewMode: 'type',
      orderedVocab: false, vocabCats: null,
      syllabusPace: 1, unlockAll: true,
      applyMode: 'type', produceStyle: 'full',
      bucketRatios: { due: 0.40, focus: 0.30, stretch: 0.30 },
      tenses: function () { return fullTenseSet(); },
      defaultGameMode: 'tranquilo',
      selectors: ['inteligente', 'tema', 'gramatica', 'debiles', 'siguiente'],
      cualPairs: ['ser-estar', 'por-para', 'preterite-imperfect', 'subj']
    }
  };

  function resolve() {
    var m = (location.search.match(/[?&]p=([a-z]+)/) || [])[1];
    if (m && PROFILES[m]) { try { localStorage.setItem(KEY, m); } catch (e) {} return m; }
    try { var s = localStorage.getItem(KEY); if (s && PROFILES[s]) return s; } catch (e) {}
    return 'standard';
  }

  var current = resolve();

  // ---- beginner: restrict CONJUGATION content to verbs actually met -------
  // Seeing a verb once (its meaning, in a vocab flashcard/quiz) isn't enough
  // to expect someone to conjugate it — that's a different, harder skill.
  // conjugableVerbs() is what every conjugation-drilling surface (games,
  // Practicar's Conjugación drill, the Gramática/Repaso pools) should
  // iterate INSTEAD of window.VERBS directly; plain vocabulary flashcards/
  // quizzes (meeting a verb's MEANING) are deliberately exempt and keep
  // reading window.VERBS as before.
  function loadProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }
  function introducedVerbInfs() {
    var prog = loadProg(), set = {};
    if (window.Curriculum) {
      var seq = window.Curriculum.seq(), day = prog.beginnerDay || 0;
      for (var i = 0; i < Math.min(day, seq.length); i++) {
        if (seq[i].type === 'verbs') seq[i].verbs.forEach(function (inf) { set[inf] = 1; });
      }
    }
    var studied = prog.studied || {};
    Object.keys(studied).forEach(function (key) {
      if (key.indexOf('verbs:') === 0) key.slice(6).split(',').forEach(function (inf) { set[inf] = 1; });
    });
    return set;
  }

  // Session review cap per mode is adjustable in Ajustes — an override here
  // takes precedence over the PROFILES default above.
  var CAPKEY = 'fluidez.caps';
  function loadCaps() { try { return JSON.parse(localStorage.getItem(CAPKEY)) || {}; } catch (e) { return {}; } }
  function saveCaps(o) { try { localStorage.setItem(CAPKEY, JSON.stringify(o)); } catch (e) {} }
  function capFor(name) { var o = loadCaps(); return (PROFILES[name] && o[name] != null) ? o[name] : (PROFILES[name] ? PROFILES[name].reviewBatchMax : 0); }

  return {
    params: function () { return PROFILES[current]; },
    current: function () { return current; },
    all: function () { return Object.keys(PROFILES).map(function (k) { return PROFILES[k]; }); },
    set: function (name) { if (PROFILES[name]) { current = name; try { localStorage.setItem(KEY, name); } catch (e) {} } },
    catAllowed: function (cat) { var c = PROFILES[current].vocabCats; return !c || c.indexOf(cat) !== -1; },
    catRank: function (cat) { var c = PROFILES[current].vocabCats; var i = c ? c.indexOf(cat) : -1; return i === -1 ? 999 : i; },
    reviewCap: function () { return capFor(current); },
    capFor: capFor,
    setCap: function (name, n) { if (!PROFILES[name]) return; var o = loadCaps(); o[name] = Math.max(1, Math.round(n)); saveCaps(o); },
    tenses: function () { return PROFILES[current].tenses(); },
    selectorVisible: function (key) { return PROFILES[current].selectors.indexOf(key) !== -1; },
    conjugableVerbs: function () {
      var all = window.VERBS || [];
      if (current !== 'beginner') return all;
      var set = introducedVerbInfs();
      return all.filter(function (v) { return set[v.inf]; });
    }
  };
})();
