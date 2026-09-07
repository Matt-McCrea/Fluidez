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

  // A beginner's tense set is NOT a fixed list — it's exactly the tenses
  // their daily curriculum has actually taught so far (see
  // introducedTenseKeys() below), so every quiz/game they meet stays at
  // their level as they progress. 'presente' is the day-one fallback,
  // before their first grammar lesson has landed. Everyone else works with
  // the full ordered list.
  function fullTenseSet() { return (window.ENGINE ? window.ENGINE.TENSES : []).map(function (t) { return t.key; }); }

  /* ---- the levels -----------------------------------------------------------
   * One profile per CEFR level, generated from window.LEVELS (data/taxonomy.js)
   * so the pacing knobs and the level ladder cannot drift apart.
   *
   * This replaces the old beginner/standard/refresher trio, which was a level
   * system wearing a learner-type label: "beginner" was A1 with scaffolding and
   * "refresher" was "start further up". What genuinely varies independently is
   * SUPPORT (how much scaffolding), which stays a separate axis.
   * ------------------------------------------------------------------------ */
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  // taught explicitly in the first lessons, so fair game from the start
  var EARLY_IRREGULARS = { ser: 1, estar: 1, tener: 1, ir: 1, haber: 1, hacer: 1, irse: 1 };

  function buildProfiles() {
    var out = {};
    (window.LEVELS || []).forEach(function (L, i) {
      var maxGate = L.levels[L.levels.length - 1];
      var early = i <= 1;                       // A1/A2 follow the paced curriculum
      out[L.code] = {
        name: L.code, label: L.label, cefr: L.code,
        gates: L.levels.slice(), maxGate: maxGate,
        accent: L.accent, accent2: L.accent2,
        passageWords: L.passageWords, glossLang: L.glossLang,
        newPerDay: L.newPerDay, reviewBatchMax: L.reviewBatchMax,
        reviewDirection: L.reviewDirection, reviewMode: L.reviewMode,
        // js/views/apply.js knows 'wordbank'; 'register' and 'reformular' are
        // B2/C1 modes whose views do not exist yet, so they type for now.
        applyMode: L.applyMode === 'bank' ? 'wordbank' : 'type',
        applyModeTarget: L.applyMode,
        produceStyle: L.produceStyle === 'extended' ? 'full' : L.produceStyle,
        produceStyleTarget: L.produceStyle,
        // vocabulary is gated by CEFR now, not by a category whitelist
        orderedVocab: early, vocabCats: null, maxCefr: L.code,
        syllabusPace: L.code === 'A1' ? 3 : 1,
        unlockAll: false,
        usesCurriculum: early,
        bucketRatios: early ? { due: 0.65, focus: 0.25, stretch: 0.10 }
                            : { due: 0.50, focus: 0.30, stretch: 0.20 },
        tenses: early ? introducedTenseKeys : fullTenseSet,
        defaultGameMode: 'tranquilo',
        selectors: early ? ['inteligente', 'tema', 'siguiente']
                         : ['inteligente', 'tema', 'gramatica', 'debiles', 'siguiente'],
        cualPairs: early ? ['ser-estar']
                         : ['ser-estar', 'por-para', 'preterite-imperfect', 'subj']
      };
    });
    return out;
  }

  var PROFILES = buildProfiles();

  // Old links and saved settings (?p=beginner, localStorage) still resolve.
  var LEGACY = { beginner: 'A1', standard: 'B1', refresher: 'B2' };

  function canon(v) {
    if (!v) return null;
    var up = String(v).toUpperCase();
    if (PROFILES[up]) return up;
    return LEGACY[String(v).toLowerCase()] || null;
  }

  function resolve() {
    var m = (location.search.match(/[?&]p=([a-zA-Z0-9]+)/) || [])[1];
    var c = canon(m);
    if (c) { try { localStorage.setItem(KEY, c); } catch (e) {} return c; }
    try { c = canon(localStorage.getItem(KEY)); if (c) return c; } catch (e) {}
    return 'A1';
  }

  // Paint the level's accent on the document so the whole app is colour-coded
  // by where you are. The palette lives with the levels in data/taxonomy.js.
  function applyTheme(code) {
    var p = PROFILES[code]; if (!p || typeof document === 'undefined') return;
    var r = document.documentElement;
    r.setAttribute('data-level', code);
    if (r.style && r.style.setProperty) {
      r.style.setProperty('--accent', p.accent);
      r.style.setProperty('--accent-2', p.accent2);
    }
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

  // The tenses a beginner has actually been taught so far, in the order the
  // daily session sets prog.studied[<tenseKey>] for a grammar-focus day
  // (true for both the automatic curriculum pace and any on-demand
  // LessonRun). A completely fresh profile (day one, before its first
  // grammar lesson) falls back to just 'presente' — the one thing that's
  // unconditionally lesson #1 for every mode — rather than an empty list,
  // which would leave every conjugation game with nothing to show.
  function introducedTenseKeys() {
    var prog = loadProg(), studied = prog.studied || {}, out = [];
    Object.keys(studied).forEach(function (id) {
      if (window.ENGINE && window.ENGINE.TENSE_LABEL[id]) out.push(id);
    });
    return out.length ? out : ['presente'];
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
    set: function (name) {
      var c = canon(name); if (!c) return;
      current = c; applyTheme(c);
      try { localStorage.setItem(KEY, c); } catch (e) {}
    },
    applyTheme: function () { applyTheme(current); },
    catAllowed: function (cat) { var c = PROFILES[current].vocabCats; return !c || c.indexOf(cat) !== -1; },
    // Ordering falls back to the derived category order (data/taxonomy.js) so
    // the PCIC themes sort sensibly instead of all landing on 999.
    catRank: function (cat) {
      var c = PROFILES[current].vocabCats;
      var i = c ? c.indexOf(cat) : -1;
      if (i !== -1) return i;
      var order = window.TAXONOMY ? window.TAXONOMY.vocabOrder(window.VOCAB || []) : [];
      var j = order.indexOf(cat);
      return j === -1 ? 999 : (c ? c.length : 0) + j;
    },
    /* Gate a WORD rather than its category.
     *
     * `vocabCats` is a whitelist of the original 24 category names, so once the
     * PCIC vocabulary arrived under theme ids it excluded all ~3,600 of them —
     * a beginner would never have met a single word of the real syllabus. A
     * word that carries a CEFR level is judged on that instead; legacy words
     * with no level keep the old category behaviour. */
    wordAllowed: function (w) {
      if (!w) return false;
      if (w.userWord) return true;
      var p = PROFILES[current];
      if (w.cefr && p.maxCefr) {
        var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  // taught explicitly in the first lessons, so fair game from the start
  var EARLY_IRREGULARS = { ser: 1, estar: 1, tener: 1, ir: 1, haber: 1, hacer: 1, irse: 1 };
        return BANDS.indexOf(w.cefr) <= BANDS.indexOf(p.maxCefr);
      }
      if (w.cefr) return true;
      var c = p.vocabCats;
      return !c || c.indexOf(w.cat) !== -1;
    },
    reviewCap: function () { return capFor(current); },
    capFor: capFor,
    setCap: function (name, n) { if (!PROFILES[name]) return; var o = loadCaps(); o[name] = Math.max(1, Math.round(n)); saveCaps(o); },
    tenses: function () { return PROFILES[current].tenses(); },
    selectorVisible: function (key) { return PROFILES[current].selectors.indexOf(key) !== -1; },
    conjugableVerbs: function () {
      var all = window.VERBS || [];
      // was `current !== 'beginner'`, which stopped matching anything when the
      // profiles became A1-C1 — the restriction had been silently dead
      if (!PROFILES[current] || !PROFILES[current].usesCurriculum) return all;
      var set = introducedVerbInfs();
      return all.filter(function (v) { return set[v.inf]; });
    },

    /* Can a learner at this level be ASKED to produce this verb in this tense?
     *
     * At A1 a translation task on "I sleep eight hours" demands "duermo", and
     * a learner three days into the present tense will write "dormo" and be
     * marked wrong for a stem change nobody has taught them. The essential
     * irregulars are exempt because the first lessons teach them explicitly:
     * ser and estar have a lesson of their own, and tener/ir/haber/hacer are
     * unavoidable from day one. */
    verbOkAt: function (inf, tense) {
      var p = PROFILES[current];
      if (!p || !p.usesCurriculum) return true;          // B1 and above: no restriction
      if (EARLY_IRREGULARS[inf]) return true;
      var E = window.ENGINE;
      if (!E) return true;
      return !E.isIrregularIn(E.verbByInf(inf), tense || 'presente');
    }
  };
})();
