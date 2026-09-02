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
    newPerDay: 3, reviewBatchMax: 12 },

  { code: 'A2', levels: [2, 3], label: 'A2 · Plataforma',
    accent: '#2d7fb8', accent2: '#3f9ed6',
    passageWords: [60, 100], glossLang: 'en',
    reviewMode: 'graduated', reviewDirection: 'graduated',
    applyMode: 'bank', produceStyle: 'guided',
    newPerDay: 4, reviewBatchMax: 16 },

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

/* ---- STRANDS — the five kinds of thing a lesson can teach --------------
 * Mapped one-to-one onto the PCIC inventories they are derived from. `blocks`
 * lists the optional lesson sections that are meaningful for that strand; the
 * validator uses it to reject a genre lesson carrying `exponents`, and so on.
 * ========================================================================== */
window.STRANDS = [
  { id: 'grammar',   label: 'Gramática',  inventory: 'gramatica',
    blocks: ['sections', 'contrasts', 'pitfalls', 'examples'] },
  { id: 'function',  label: 'Funciones',  inventory: 'funciones',
    blocks: ['sections', 'exponents', 'contrasts', 'pitfalls', 'examples'] },
  { id: 'discourse', label: 'Discurso',   inventory: 'tacticas_pragmaticas',
    blocks: ['sections', 'exponents', 'pitfalls', 'examples'] },
  { id: 'genre',     label: 'Géneros',    inventory: 'generos_discursivos',
    blocks: ['sections', 'moves', 'model', 'checklist', 'examples'] },
  { id: 'lexis',     label: 'Léxico',     inventory: 'nociones_especificas',
    blocks: ['words', 'collocations', 'examples'] }
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
    codes: function () { return window.LEVELS.map(function (l) { return l.code; }); }
  };
})();
