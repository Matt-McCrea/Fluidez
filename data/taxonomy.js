/* ============================================================================
 * TAXONOMY — the controlled vocabularies every piece of content tags against.
 *
 * Everything the app teaches is located by four coordinates:
 *   LEVEL   where the learner is            A1 · A2 · B1 · B2 · C1
 *   STRAND  what kind of thing it teaches   grammar · function · discourse ·
 *                                           genre · lexis
 *   THEME   what it is about (optional)     trabajo · naturaleza · politica …
 *   PCIC    the specification item it comes from
 *
 * These are ids, not prose: the validator checks every reference resolves, so
 * a typo'd theme or a stale PCIC id fails the build rather than silently
 * producing content nothing can find.
 *
 * Source of truth for levels and themes is the Plan Curricular del Instituto
 * Cervantes (harvested to spec/pcic.json; see tools/harvest/).
 * ========================================================================== */

/* ---- LEVELS ---------------------------------------------------------------
 * `levels` are the numeric gates the session already reasons in (content at or
 * below your level may appear). The existing app spends 1-5 on A1-B1; B2 and
 * C1 extend the ladder to 10.
 *
 * The per-level knobs are what used to be `PROFILES` in js/profile.js. That
 * bundle was always a level system wearing a learner-type label: `beginner`
 * was A1-with-scaffolding and `refresher` was "start at B1". What genuinely
 * survives as a separate axis is SUPPORT (below), because a rusty ex-speaker
 * and a careful learner can sit at the same level wanting different help.
 * ========================================================================== */
window.LEVELS = [
  { code: 'A1', levels: [1], label: 'A1 · Acceso',
    accent: '#2f8f5b', accent2: '#3fae70',
    passageWords: [30, 60], glossLang: 'en',
    reviewMode: 'choice', reviewDirection: 'es2en',
    applyMode: 'bank', produceStyle: 'build',
    newPerDay: 7, reviewBatchMax: 20 },

  { code: 'A2', levels: [2, 3], label: 'A2 · Plataforma',
    accent: '#2d7fb8', accent2: '#3f9ed6',
    passageWords: [60, 100], glossLang: 'en',
    reviewMode: 'graduated', reviewDirection: 'graduated',
    applyMode: 'bank', produceStyle: 'guided',
    newPerDay: 8, reviewBatchMax: 22 },

  { code: 'B1', levels: [3, 4, 5], label: 'B1 · Umbral',
    accent: '#0e7c86', accent2: '#12a0ad',
    passageWords: [100, 160], glossLang: 'en',
    reviewMode: 'type', reviewDirection: 'en2es',
    applyMode: 'type', produceStyle: 'full',
    newPerDay: 5, reviewBatchMax: 20 },

  { code: 'B2', levels: [6, 7], label: 'B2 · Avanzado',
    accent: '#8a5cd6', accent2: '#a77ce8',
    passageWords: [200, 300], glossLang: 'es',   // glossary in Spanish from here
    reviewMode: 'type', reviewDirection: 'en2es',
    applyMode: 'register', produceStyle: 'full',
    newPerDay: 6, reviewBatchMax: 24 },

  { code: 'C1', levels: [8, 9, 10], label: 'C1 · Dominio',
    accent: '#b8543f', accent2: '#d4715a',
    passageWords: [320, 450], glossLang: 'none', // no English at all
    reviewMode: 'type', reviewDirection: 'en2es',
    applyMode: 'reformular', produceStyle: 'extended',
    newPerDay: 8, reviewBatchMax: 28 }
];

/* ---- SUPPORT — orthogonal to level: how much scaffolding --------------- */
window.SUPPORT = [
  { code: 'guided',   label: 'Guided',   hintsAlways: true,  bankFallback: true,  paceRepeat: 3 },
  { code: 'standard', label: 'Standard', hintsAlways: false, bankFallback: true,  paceRepeat: 1 },
  { code: 'fast',     label: 'Fast',     hintsAlways: false, bankFallback: false, paceRepeat: 1 }
];

/* ---- STRANDS — the kinds of thing a lesson can teach --------------------
 * One per PCIC inventory. `notion` (nociones generales) and `lexis` (nociones
 * específicas) come from DIFFERENT inventories and are not the same thing: a
 * notion lesson teaches the linguistic means for a semantic category —
 * existence, quantity, space, time, quality — while lexis is topical
 * vocabulary. Conflating them left 258 syllabus units with no valid strand.
 *
 * `registerContrast` marks the strands whose whole point is the social choice
 * between forms, and whose exponents must therefore span at least two
 * registers. A notion lesson's exponents are grammatical means (haber vs
 * estar vs tener), not social ones, so it carries no such requirement.
 * `blocks` lists the lesson sections meaningful for a strand; the validator
 * rejects a genre lesson carrying `exponents`, and so on.
 * ------------------------------------------------------------------------ */
window.STRANDS = [
  { id: 'grammar',   label: 'Gramática',  inventory: 'gramatica',
    blocks: ['sections', 'contrasts', 'pitfalls', 'examples'] },
  { id: 'function',  label: 'Funciones',  inventory: 'funciones',
    blocks: ['sections', 'exponents', 'contrasts', 'pitfalls', 'examples'],
    registerContrast: true },
  { id: 'discourse', label: 'Discurso',   inventory: 'tacticas_pragmaticas',
    blocks: ['sections', 'exponents', 'pitfalls', 'examples'],
    registerContrast: true },
  { id: 'notion',    label: 'Nociones',   inventory: 'nociones_generales',
    blocks: ['sections', 'exponents', 'contrasts', 'pitfalls', 'examples'] },
  { id: 'genre',     label: 'Géneros',    inventory: 'generos_discursivos',
    blocks: ['sections', 'moves', 'model', 'checklist', 'examples'] },
  // NOT an authored lesson type. A lexis day is DERIVED from data/vocab.js by
  // js/curriculum.js — the words, their themes, levels, gender and
  // collocations all come from the harvest, so there is nothing to write.
  // Listed here so the strand vocabulary is complete; the generation brief
  // says explicitly not to author these.
  { id: 'lexis',     label: 'Léxico',     inventory: 'nociones_especificas',
    derived: true, blocks: ['words', 'collocations', 'examples'] },

  /* ---- the two strands that are NOT from the PCIC --------------------------
   * Every strand above answers "what does the inventory say a learner should
   * know?". These two answer "what does a learner do on the day?", which the
   * inventory does not model at all — and their absence is why a unit could
   * only ever be a run of explanations.
   *
   * `dialogue` opens a unit: a short exchange the learner reads BEFORE any
   * grammar, so the unit starts with Spanish being used between two people
   * rather than with a category being named. `task` closes it: no new content,
   * a thing to produce, checked against the model and checklist the genre
   * strand already renders.
   *
   * Both carry no `pcic` — they are authored for the course, not harvested —
   * which the validator permits (pcic is only required under STRICT_TAGS).
   * Neither sets registerContrast: a dialogue's lines are one conversation at
   * one register, and demanding two would make it a worse conversation. */
  { id: 'dialogue',  label: 'Diálogo',    authored: true,
    blocks: ['sections', 'exponents', 'examples'] },
  { id: 'task',      label: 'Tarea',      authored: true,
    blocks: ['sections', 'model', 'checklist', 'examples'] }
];

/* ---- REGISTER — the axis a function lesson actually teaches -------------
 * "Expresar acuerdo" at B2 is 31 exponents that differ almost entirely by
 * register, not by grammar. Without this dimension a function lesson collapses
 * into a vocabulary list.
 * ========================================================================== */
window.REGISTERS = [
  { id: 'coloquial', label: 'Coloquial', note: 'friends, family, informal speech' },
  { id: 'neutral',   label: 'Neutro',    note: 'the safe default in most situations' },
  { id: 'formal',    label: 'Formal',    note: 'work, strangers, officialdom, writing' },
  { id: 'escrito',   label: 'Escrito culto', note: 'academic and journalistic prose' }
];

/* ---- THEMES — the 20 PCIC "nociones específicas", and the themed tracks
 * a learner can grind for a week (employment, climate, religion…). `n` is the
 * PCIC section number, so content can be traced back to the inventory.
 * ========================================================================== */
window.THEMES = [
  { id: 'cuerpo',      n: 1,  es: 'Individuo: dimensión física',              en: 'Body & appearance' },
  { id: 'caracter',    n: 2,  es: 'Individuo: dimensión perceptiva y anímica', en: 'Character & feeling' },
  { id: 'identidad',   n: 3,  es: 'Identidad personal',                        en: 'Personal identity' },
  { id: 'relaciones',  n: 4,  es: 'Relaciones personales',                     en: 'Relationships' },
  { id: 'alimentacion', n: 5, es: 'Alimentación',                              en: 'Food & eating' },
  { id: 'educacion',   n: 6,  es: 'Educación',                                 en: 'Education' },
  { id: 'trabajo',     n: 7,  es: 'Trabajo',                                   en: 'Work & employment' },
  { id: 'ocio',        n: 8,  es: 'Ocio',                                      en: 'Leisure' },
  { id: 'medios',      n: 9,  es: 'Información y medios de comunicación',      en: 'Media & information' },
  { id: 'vivienda',    n: 10, es: 'Vivienda',                                  en: 'Housing' },
  { id: 'servicios',   n: 11, es: 'Servicios',                                 en: 'Services' },
  { id: 'compras',     n: 12, es: 'Compras, tiendas y establecimientos',       en: 'Shopping' },
  { id: 'salud',       n: 13, es: 'Salud e higiene',                           en: 'Health' },
  { id: 'viajes',      n: 14, es: 'Viajes, alojamiento y transporte',          en: 'Travel & transport' },
  { id: 'economia',    n: 15, es: 'Economía e industria',                      en: 'Economy & industry' },
  { id: 'ciencia',     n: 16, es: 'Ciencia y tecnología',                      en: 'Science & technology' },
  { id: 'politica',    n: 17, es: 'Gobierno, política y sociedad',             en: 'Politics & society' },
  { id: 'arte',        n: 18, es: 'Actividades artísticas',                    en: 'Arts' },
  { id: 'religion',    n: 19, es: 'Religión y filosofía',                      en: 'Religion & philosophy' },
  { id: 'naturaleza',  n: 20, es: 'Geografía y naturaleza',                    en: 'Geography & nature' }
];

/* ---- lookups -------------------------------------------------------------- */
window.TAXONOMY = (function () {
  var byCode = {}, themeById = {}, strandById = {}, levelToCefr = {};
  var _orderCache = null, _orderKey = -1;
  window.LEVELS.forEach(function (l) {
    byCode[l.code] = l;
    l.levels.forEach(function (n) { (levelToCefr[n] = levelToCefr[n] || []).push(l.code); });
  });
  window.THEMES.forEach(function (t) { themeById[t.id] = t; });
  window.STRANDS.forEach(function (s) { strandById[s.id] = s; });
  return {
    level: function (code) { return byCode[code] || null; },
    theme: function (id) { return themeById[id] || null; },
    strand: function (id) { return strandById[id] || null; },
    // a numeric gate can belong to more than one CEFR band (B1 and A2 share 3)
    cefrFor: function (n) { return levelToCefr[n] || []; },
    themeByPcicSection: function (section) {
      var n = parseInt(section, 10);
      return window.THEMES.filter(function (t) { return t.n === n; })[0] || null;
    },
    codes: function () { return window.LEVELS.map(function (l) { return l.code; }); },

    /* The order vocabulary categories are taught in.
     *
     * This used to be a hardcoded list of 24 category names duplicated in
     * js/curriculum.js and js/progress.js. When the PCIC vocabulary landed —
     * 3,599 entries filed under the 20 theme ids — the curriculum iterated the
     * old list and produced no vocab days for any of them, so almost the whole
     * lexicon was unreachable. Deriving the order from the data means a new
     * theme or category is picked up automatically.
     *
     * Order: CEFR band first (untagged legacy words count as A1, since they are
     * the beginner core), then the deliberate beginner sequence for the old
     * categories, then PCIC theme order. */
    /* Memoised: this is called once per word by js/views/review.js, and
     * recomputing an order over ~5,800 entries each time cost 793 ms per
     * render — seconds on a phone. The vocabulary only grows when the learner
     * adds a word, so the length is a sufficient cache key. */
    vocabOrder: function (vocab) {
      var key = (vocab || []).length;
      if (_orderCache && _orderKey === key) return _orderCache;
      _orderKey = key;
      _orderCache = computeVocabOrder(vocab);
      return _orderCache;
    },

    _computeVocabOrder: function (vocab) { return computeVocabOrder(vocab); }
  };

  function computeVocabOrder(vocab) {
      var LEGACY = ['greetings', 'people', 'food', 'numbers', 'time', 'colors',
        'places', 'home', 'body', 'nature', 'adjectives', 'travel', 'weather',
        'clothing', 'animals', 'questions', 'connectors', 'common', 'school',
        'health', 'shopping', 'sports', 'kitchen', 'work'];
      var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
      var stats = {};
      (vocab || []).forEach(function (w) {
        var lvl = BANDS.indexOf(w.cefr || 'A1');
        if (lvl < 0) lvl = 0;
        var st = stats[w.cat] || (stats[w.cat] = { cat: w.cat, min: 99 });
        if (lvl < st.min) st.min = lvl;
      });
      return Object.keys(stats).map(function (c) {
        var legacy = LEGACY.indexOf(c);
        var theme = themeById[c] ? themeById[c].n : 99;
        return { cat: c, min: stats[c].min, legacy: legacy === -1 ? 99 : legacy, theme: theme };
      }).sort(function (a, b) {
        return a.min - b.min || a.legacy - b.legacy || a.theme - b.theme || a.cat.localeCompare(b.cat);
    }).map(function (x) { return x.cat; });
  }
})();
