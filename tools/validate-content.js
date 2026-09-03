/* ============================================================================
 * CONTENT GATE — run:  node tools/validate-content.js
 *
 * Machine-verifies EVERY piece of authored content so that generated content
 * (e.g. from a cheaper model) either passes or bounces — no trust required:
 *
 *   lessons   : syllabus ids resolve, unique ids, recall items well-formed
 *   passages  : question shapes, MCQ answer indices, translate lines appear in
 *               the text, and NO verb form above the passage's level
 *   apply     : cloze refs exist (verb/tense/person), engine computes the
 *               answer, item level covers the tense's syllabus level
 *   writing   : constraint specs valid, model answers satisfy their OWN
 *               constraints, task level covers every constrained tense
 *   vocab/idioms : well-formed, no duplicates
 *
 * Exit code 1 on any failure (CI-friendly).
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
global.window = {};
function load(rel) { (0, eval)(fs.readFileSync(path.join(__dirname, '..', rel), 'utf8')); }
['data/taxonomy.js', 'data/connectors.js', 'data/strand-lessons.js',
 'data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js',
 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js', 'data/resources.js',
 'js/engine.js', 'js/lessons.js', 'js/checker.js'].forEach(load);

const E = window.ENGINE, C = window.Checker;
let errors = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { errors++; console.error('  ✗ ' + msg); } }

/* ---------- noun/verb homographs -------------------------------------------
 * The morphological index maps every conjugated form back to its verb, which
 * means a noun that happens to spell like one is read as a verb: "la vista"
 * (the view) analyses as vestirse's subjunctive, failing a level-1 passage.
 * As the corpus grows past B1 this collides constantly — la cuenta, el sueño,
 * la muestra, el vuelo, la llamada.
 *
 * The exemption deliberately requires BOTH conditions:
 *   1. the word is on this list of genuine, common noun homographs, AND
 *   2. it is directly preceded by an article, possessive or demonstrative.
 * Neither alone is safe. A determiner does not imply a noun — "todos dicen",
 * "la había comido", "las pusieron" and "esas son" are all real verbs, and
 * clitic la/los/las sit in front of verbs exactly where an article would.
 * Requiring the word to be a known noun keeps those gated.
 *
 * Extend the list as new content introduces collisions; never widen the
 * determiner set to quantifiers (todo/mucho/poco/cada), which freely precede
 * verbs. Run tools/find-homographs.js to see what the corpus is hitting. */
const NOUN_HOMOGRAPHS = new Set([
  // observed in the current corpus
  'trabajo', 'cena', 'cambio', 'viaje', 'río', 'ayuda', 'parte', 'partes',
  'cocina', 'estudio', 'desayuno', 'vista', 'recibo', 'camino', 'compra',
  'diseño', 'pregunta', 'preguntas', 'gasto', 'programa', 'programas',
  'contrato', 'negocio', 'traje', 'ducha', 'recuerdo', 'baño', 'firma',
  'paso', 'cuenta', 'gusto', 'metas', 'despido',
  // high-frequency collisions expected as content moves into B1-C1
  'sueño', 'vuelo', 'muestra', 'paseo', 'llamada', 'visita', 'respuesta',
  'comida', 'bebida', 'salida', 'entrada', 'parada', 'llegada', 'subida',
  'bajada', 'apoyo', 'duda', 'falta', 'juego', 'lucha', 'marcha', 'nota',
  'pena', 'prueba', 'regalo', 'reserva', 'saludo', 'vuelta', 'reparto',
  'aumento', 'ahorro', 'consumo', 'reforma', 'demanda', 'oferta', 'reparo',
  'peso', 'gobierno', 'mando', 'cargo', 'encuentro', 'fomento', 'rechazo',
  // surfaced when the verb set grew from 200 to 460: more verbs means more
  // nouns shadowed by a conjugated form. Run tools/find-homographs.js after
  // any verb addition and add the genuine nouns here.
  'soluciones', 'funciones', 'proyecto', 'casa', 'regalo', 'centro', 'queja',
  'proceso', 'marca', 'medio', 'medios', 'género', 'artículo', 'artículos',
  'público', 'práctico', 'práctica', 'ópera', 'ampliación', 'reserva',
  'estudios', 'contratos', 'programas', 'negocios', 'cambios', 'viajes',
  // surfaced adding spec/verb-queue.json's B1-C1 batch (coser, nevar,
  // alegrarse, informar): their subjunctive forms shadow everyday nouns.
  'cosa', 'cosas', 'nieve', 'alegre', 'informe',
  // same batch, second pass (temer, moler, tramitar): more everyday nouns
  // shadowed.
  'tema', 'muela', 'trámite'
]);
const DETERMINERS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'mi', 'mis', 'tu', 'tus', 'su', 'sus',
  'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'vuestro', 'vuestra', 'vuestros', 'vuestras',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
  'aquel', 'aquella', 'aquellos', 'aquellas',
  // genuine determiner contractions (de+el, a+el) — not quantifiers, so this
  // does not touch the "never widen to todo/mucho/poco/cada" guidance below.
  'del', 'al'
]);
// A few genuine noun readings that neither determiner-adjacency nor the
// finite-verb-object heuristic below catches: a quantifier ("cada cosa"),
// an intervening adjective ("pequeñas cosas"), or a determiner-less mass
// noun after a verb of occurrence ("caer nieve", like "hacer sol"). Exact
// two-token phrases only, not a general rule — widening DETERMINERS to
// quantifiers would gate real verbs ("todos dicen", "cada vez que compra").
const SAFE_NOUN_PHRASES = new Set([
  'cada cosa', 'pequeñas cosas', 'caer nieve', 'cada trámite', 'tanto trámite'
]);
function isNounHere(toks, i) {
  if (!NOUN_HOMOGRAPHS.has(toks[i]) || i < 1) return false;
  var prev = toks[i - 1];
  if (DETERMINERS.has(prev)) return true;
  if (SAFE_NOUN_PHRASES.has(prev + ' ' + toks[i])) return true;
  // Bare plurals take no article ("negocia soluciones justas"), so also accept
  // the object position: directly after a finite verb. Spanish does not put two
  // conjugated verbs side by side without a conjunction, so a word there is a
  // noun. Membership of NOUN_HOMOGRAPHS still does the real gating — "la había
  // comido" is untouched because "comido" is not on that list.
  var pa = E.analyzeToken(prev) || [];
  return pa.some(function (a) { return a.tense !== 'imperativo'; });
}

// tense key -> syllabus level (concept lessons don't gate tenses)
const TENSE_LEVEL = {};
(window.SYLLABUS || []).forEach(s => { if (E.TENSES.some(t => t.key === s.id)) TENSE_LEVEL[s.id] = s.level; });
const VALID_TENSES = new Set(E.TENSES.map(t => t.key));
const strip = h => String(h).replace(/<[^>]+>/g, '');

/* ---------- taxonomy: every tag must resolve ------------------------------
 * Content is located by level + strand + theme + the PCIC id it teaches
 * (see data/taxonomy.js). A typo'd theme or a stale spec id must fail the
 * build, not silently produce content that no track or lesson can find.
 *
 * MAX_LEVEL is 10, not 5: A1-B1 keeps gates 1-5, B2 takes 6-7, C1 takes 8-10.
 *
 * Tags are OPTIONAL while the corpus is migrated from the pre-syllabus
 * content, and validated whenever present. Coverage is reported at the end;
 * set STRICT_TAGS=1 once generation has caught up, and missing tags become
 * errors. */
const MAX_LEVEL = 10;
const STRICT_TAGS = process.env.STRICT_TAGS === '1';
const CEFR = new Set((window.LEVELS || []).map(l => l.code));
const THEME_IDS = new Set((window.THEMES || []).map(t => t.id));
const STRAND_IDS = new Set((window.STRANDS || []).map(t => t.id));
const REGISTER_IDS = new Set((window.REGISTERS || []).map(r => r.id));
const CONNECTOR_IDS = new Set((window.CONNECTORS || []).map(c => c.id));
const tagStats = { seen: 0, cefr: 0, theme: 0, pcic: 0, strand: 0 };

function checkTags(o, tag) {
  tagStats.seen++;
  if (o.cefr !== undefined) { ok(CEFR.has(o.cefr), `${tag}: unknown cefr "${o.cefr}"`); tagStats.cefr++; }
  else ok(!STRICT_TAGS, `${tag}: missing cefr`);
  if (o.theme !== undefined && o.theme !== null) { ok(THEME_IDS.has(o.theme), `${tag}: unknown theme "${o.theme}"`); tagStats.theme++; }
  if (o.strand !== undefined) { ok(STRAND_IDS.has(o.strand), `${tag}: unknown strand "${o.strand}"`); tagStats.strand++; }
  if (o.pcic !== undefined) {
    ok(Array.isArray(o.pcic) && o.pcic.length >= 1 && o.pcic.every(x => typeof x === 'string' && x.includes(':')),
       `${tag}: pcic must be a non-empty array of spec ids`);
    tagStats.pcic++;
  } else ok(!STRICT_TAGS, `${tag}: missing pcic`);
  // a level gate and a CEFR band must not contradict each other
  if (o.cefr && Number.isInteger(o.level)) {
    const band = (window.LEVELS || []).filter(l => l.code === o.cefr)[0];
    ok(!band || band.levels.indexOf(o.level) !== -1,
       `${tag}: level ${o.level} is not one of ${o.cefr}'s gates [${band ? band.levels : ''}]`);
  }
}

/* Strand-specific lesson blocks. A function lesson carries `exponents` (the
 * ways to perform the act, differentiated by REGISTER — without that axis a
 * function lesson collapses into a vocabulary list); a genre lesson carries
 * the rhetorical `moves` of the text and a `model` of it. data/taxonomy.js
 * declares which blocks each strand may use, and anything else is rejected so
 * a generator cannot invent a shape the renderer will not draw. */
function checkStrandBlocks(l) {
  const tag = `lesson "${l.id}"`;
  const strand = (window.STRANDS || []).filter(x => x.id === l.strand)[0];
  if (!strand) return;                                  // unknown strand already reported
  const ALL = ['sections', 'contrasts', 'pitfalls', 'examples', 'exponents', 'moves', 'model', 'checklist', 'words', 'collocations'];
  ALL.forEach(b => {
    if (l[b] === undefined) return;
    ok(strand.blocks.indexOf(b) !== -1, `${tag}: block "${b}" is not valid for strand "${l.strand}"`);
  });

  if (strand.blocks.indexOf('exponents') !== -1) {
    ok(Array.isArray(l.exponents) && l.exponents.length >= 3, `${tag}: needs >=3 exponents`);
    const regs = new Set();
    (l.exponents || []).forEach((e, i) => {
      const et = `${tag} exponent[${i}]`;
      ok(!!e.es, `${et}: missing es`);
      ok(!!e.en, `${et}: missing en`);
      ok(REGISTER_IDS.has(e.register), `${et}: unknown register "${e.register}"`);
      regs.add(e.register);
    });
    // the teaching point IS the register contrast, so one register is not a lesson
    ok(regs.size >= 2, `${tag}: exponents span only one register (${[...regs]}) — a function lesson must contrast at least two`);
  }
  if (l.moves !== undefined) {
    ok(Array.isArray(l.moves) && l.moves.length >= 2, `${tag}: genre needs >=2 moves`);
    (l.moves || []).forEach((m, i) => ok(m.h && m.html, `${tag} move[${i}]: needs h + html`));
  }
  if (l.model !== undefined) ok(l.model && l.model.text && l.model.text.length > 40, `${tag}: model text too short`);
  if (l.checklist !== undefined) ok(Array.isArray(l.checklist) && l.checklist.length >= 2, `${tag}: checklist needs >=2 items`);
  if (l.exponents) checkRegisterCoherence(l);
  if (l.words !== undefined) ok(Array.isArray(l.words) && l.words.length >= 1, `${tag}: words must be a non-empty array`);
  if (l.collocations !== undefined) ok(Array.isArray(l.collocations), `${tag}: collocations must be an array`);
}

/* ---------- register coherence -------------------------------------------
 * The register label on an exponent is the whole teaching point of a function
 * lesson, and the PCIC does not supply it (only 38 of 19,770 spec items carry
 * an explicit register annotation). So it is authored — which means it must be
 * FALSIFIABLE rather than merely reviewed, because a reviewer who reads the
 * label and the Spanish together will simply believe it.
 *
 * Spanish makes part of this mechanical: the form of address is a hard signal.
 * An exponent that calls its listener "tú" is not formal, whatever it claims,
 * and one that says "usted" is not colloquial. These rules do not certify that
 * a label is right; they catch the labels that are provably wrong, which is
 * the class of error that actually matters.
 *
 * The second check is consistency: the same exponent tagged two ways in two
 * lessons means at least one is wrong, and finding that needs no judgement. */
const TU_MARKERS = /\b(tú|te|ti|tu|tus|contigo|vosotros|os|vuestro|vuestra)\b/i;
const USTED_MARKERS = /\b(usted|ustedes|su|sus|le|les|suyo|sírvase|ruego|agradecería|quisiera)\b/i;
const COLLOQUIAL_TELLS = /\b(tío|tía|vale|o sea|hombre|mujer|venga|joder|guay|pues sí|qué va|ni de coña)\b/i;
const FORMAL_TELLS = /\b(estimado|atentamente|le ruego|me dirijo|expuesto|cordialmente|sírvase|no obstante|por cuanto)\b/i;
const exponentRegister = new Map();

function checkRegisterCoherence(l) {
  const tag = `lesson "${l.id}"`;
  (l.exponents || []).forEach((e, i) => {
    const et = `${tag} exponent[${i}] “${(e.es || '').slice(0, 40)}”`;
    const es = e.es || '';

    if (e.register === 'formal' || e.register === 'escrito') {
      ok(!TU_MARKERS.test(es), `${et}: labelled ${e.register} but addresses the listener as tú/vosotros`);
      ok(!COLLOQUIAL_TELLS.test(es), `${et}: labelled ${e.register} but uses a colloquial marker`);
    }
    if (e.register === 'coloquial') {
      ok(!USTED_MARKERS.test(es) || TU_MARKERS.test(es),
         `${et}: labelled coloquial but uses usted/su forms`);
      ok(!FORMAL_TELLS.test(es), `${et}: labelled coloquial but uses a formal formula`);
    }
    // an exponent offering both address forms should be split into two
    ok(!(TU_MARKERS.test(es) && USTED_MARKERS.test(es) && e.register !== 'neutral'),
       `${et}: mixes tú and usted forms — split it into one exponent per register`);

    // cross-lesson consistency: the same wording cannot be two registers
    const key = es.toLowerCase().replace(/[^a-záéíóúñü ]/g, '').trim();
    if (key) {
      const prev = exponentRegister.get(key);
      ok(!prev || prev.reg === e.register,
         `${et}: register "${e.register}" contradicts "${prev && prev.reg}" for the same exponent in ${prev && prev.where}`);
      if (!prev) exponentRegister.set(key, { reg: e.register, where: l.id });
    }
  });
}

/* probes — 3-5 items testing exactly what a lesson teaches. One artefact doing
 * three jobs: placement, the pre-lesson skip check, and the mastery gate. */
const probeIds = new Set(), probedLessons = new Set();
function checkProbes(l, tag) {
  // strand lessons are reachable twice (directly, and via GRAMMAR_LESSONS once
  // js/lessons.js merges them) — check each lesson's probes once only
  if (probedLessons.has(l.id)) return;
  probedLessons.add(l.id);
  if (l.probes === undefined) { ok(!STRICT_TAGS, `${tag}: missing probes`); return; }
  ok(Array.isArray(l.probes) && l.probes.length >= 3 && l.probes.length <= 6,
     `${tag}: needs 3-6 probes, got ${(l.probes || []).length}`);
  (l.probes || []).forEach((pr, i) => {
    const pt = `${tag} probe[${i}]`;
    ok(/^p:/.test(pr.id || ''), `${pt}: id must start with "p:"`);
    ok(!probeIds.has(pr.id), `${pt}: duplicate probe id "${pr.id}"`); probeIds.add(pr.id);
    if (pr.kind === 'recall') ok(pr.front && pr.back, `${pt}: recall needs front/back`);
    else if (pr.kind === 'mcq') {
      ok(pr.q && Array.isArray(pr.options) && pr.options.length >= 2 && pr.options.length <= 4, `${pt}: bad options`);
      ok(Number.isInteger(pr.answer) && pr.answer >= 0 && pr.answer < (pr.options || []).length, `${pt}: bad answer index`);
    } else if (pr.kind === 'cloze') {
      ok(pr.text && pr.text.indexOf('___') !== -1, `${pt}: cloze needs ___ in text`);
      ok(Array.isArray(pr.accept) && pr.accept.length >= 1, `${pt}: cloze needs accept list`);
    } else ok(false, `${pt}: unknown probe kind "${pr.kind}"`);
  });
}

// ---------- lessons & syllabus ----------------------------------------------
{
  const lessons = window.GRAMMAR_LESSONS || [];
  ok(lessons.length >= (window.SYLLABUS || []).length, 'syllabus ids missing lessons: got ' + lessons.length);
  const ids = new Set(), recallIds = new Set();
  lessons.forEach(l => {
    ok(!ids.has(l.id), `lesson duplicate id "${l.id}"`); ids.add(l.id);
    ok(l.title && l.summary, `lesson "${l.id}": missing title/summary`);
    ok(l.level >= 1 && l.level <= MAX_LEVEL, `lesson "${l.id}": bad level ${l.level}`);
    checkTags(l, `lesson "${l.id}"`);
    checkProbes(l, `lesson "${l.id}"`);
    if (l.strand && l.strand !== 'grammar') checkStrandBlocks(l);
    ok((l.sections || []).length >= 1, `lesson "${l.id}": no sections`);
    ok((l.examples || []).length >= 1, `lesson "${l.id}": no examples`);
    (l.recall || []).forEach(r => {
      // "g:" = a grammar lesson's own recall point; "p:" = derived from a
      // strand lesson's probes (js/lessons.js withRecall). Both enrol into SRS.
      ok(/^[gp]:/.test(r.id), `recall "${r.id}" (lesson ${l.id}): id must start with "g:" or "p:"`);
      ok(!recallIds.has(r.id), `recall duplicate id "${r.id}"`); recallIds.add(r.id);
      ok(r.front && r.back, `recall "${r.id}": missing front/back`);
    });
  });
  (window.SYLLABUS || []).forEach(s =>
    ok(ids.has(s.id), `syllabus id "${s.id}" has no lesson`));
}

// ---------- passages ---------------------------------------------------------
{
  const seen = new Set();
  (window.PASSAGES || []).forEach(p => {
    const tag = `passage "${p.id}"`;
    ok(!seen.has(p.id), `${tag}: duplicate id`); seen.add(p.id);
    ok(p.level >= 1 && p.level <= MAX_LEVEL, `${tag}: bad level ${p.level}`);
    checkTags(p, tag);
    ok(p.title && p.text && E.tokenize(p.text).length >= 25, `${tag}: text too short/missing`);
    (p.gloss || []).forEach(g => ok(g.es && g.en, `${tag}: bad gloss entry`));
    ok((p.questions || []).length >= 2, `${tag}: needs >=2 questions`);
    (p.questions || []).forEach((q, i) => {
      const qt = `${tag} q[${i}]`;
      if (q.type === 'mcq') {
        ok(q.q && Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 4, `${qt}: bad options`);
        ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < (q.options || []).length, `${qt}: bad answer index`);
      } else if (q.type === 'short') {
        ok(q.q && Array.isArray(q.accept) && q.accept.length >= 1 && q.accept.every(a => a && typeof a === 'string'), `${qt}: bad accept list`);
      } else if (q.type === 'translate') {
        ok(q.line && p.text.indexOf(q.line) !== -1, `${qt}: line not found verbatim in text`);
        ok(q.model, `${qt}: missing model`);
      } else ok(false, `${qt}: unknown type "${q.type}"`);
    });
    // level gate: every recognized verb form must be usable at this level
    const ptoks = E.tokenize(p.text);
    ptoks.forEach((tok, ti) => {
      const analyses = E.analyzeToken(tok);
      if (!analyses.length) return;
      if (isNounHere(ptoks, ti)) return;      // "la vista" is the noun, not vestir

      const minLevel = Math.min(...analyses.map(a => TENSE_LEVEL[a.tense] || 1));
      ok(minLevel <= p.level, `${tag}: verb "${tok}" needs level ${minLevel} ` +
        `(${analyses.map(a => a.tense).join('/')}) but passage is level ${p.level}`);
    });
  });
}

// ---------- apply items ------------------------------------------------------
{
  (window.APPLY_ITEMS || []).forEach((it, i) => {
    const tag = `apply[${i}] (${it.type})`;
    ok(it.level >= 1 && it.level <= MAX_LEVEL, `${tag}: bad level ${it.level}`);
    checkTags(it, tag);
    ok(it.en, `${tag}: missing en gloss`);
    if (it.type === 'cloze') {
      ok(it.text && it.text.indexOf('___') !== -1, `${tag}: text needs ___`);
      const v = E.verbByInf(it.inf);
      ok(v, `${tag}: verb "${it.inf}" not in dataset`);
      ok(VALID_TENSES.has(it.tense), `${tag}: bad tense "${it.tense}"`);
      const pi = v && E.personsFor(it.tense).indexOf(it.person);
      ok(pi >= 0, `${tag}: person "${it.person}" invalid for ${it.tense}`);
      if (v && pi >= 0) {
        const ans = E.conjugate(v, it.tense)[pi];
        ok(ans && !/undefined/.test(ans), `${tag}: engine could not compute answer`);
      }
      ok((TENSE_LEVEL[it.tense] || 1) <= it.level, `${tag}: tense ${it.tense} is level ${TENSE_LEVEL[it.tense]}, item is ${it.level}`);
    } else if (it.type === 'transform') {
      ok(it.instruction && it.from && it.to, `${tag}: missing instruction/from/to`);
      const a = E.analyzeSentence(it.to || '');
      ok(a.verbs.length + a.compounds.length >= 1, `${tag}: target has no recognizable verb`);
    } else ok(false, `${tag}: unknown type`);
  });
}

// ---------- writing tasks ----------------------------------------------------
{
  const CONSTRAINT_TYPES = new Set(['connectorFrom', 'avoidsAny', 'avoidsPerson',
    'subjunctiveAfter', 'cliticCluster', 'sePassive', 'distinctTenses', 'minSentences',
    'verbForm', 'verbFormAny', 'anyVerbInTense', 'person',
    'infinitiveUsed', 'verbType', 'containsWord', 'containsAny', 'minWords', 'maxWords',
    'question', 'negation', 'regex']);
  const seen = new Set();
  (window.WRITING_TASKS || []).forEach(t => {
    const tag = `writing "${t.id}"`;
    ok(!seen.has(t.id), `${tag}: duplicate id`); seen.add(t.id);
    ok(t.level >= 1 && t.level <= MAX_LEVEL, `${tag}: bad level ${t.level}`);
    checkTags(t, tag);
    if (t.type === 'build') {
      ok(t.en && t.answer && t.answer.split(' ').length >= 3, `${tag}: build needs en + answer of >=3 words`);
      return;
    }
    ok(t.type === 'translate' || t.type === 'write' || t.type === 'paragraph', `${tag}: unknown type "${t.type}"`);
    ok(t.prompt, `${tag}: missing prompt`);
    ok((t.constraints || []).length >= 1, `${tag}: needs >=1 constraint`);
    ok((t.models || []).length >= 1, `${tag}: needs >=1 model`);
    (t.constraints || []).forEach((c, i) => {
      const ct = `${tag} constraint[${i}] (${c.type})`;
      ok(CONSTRAINT_TYPES.has(c.type), `${ct}: unknown constraint type`);
      if (c.inf) ok(!!E.verbByInf(c.inf), `${ct}: verb "${c.inf}" not in dataset`);
      if (c.tense) {
        ok(VALID_TENSES.has(c.tense), `${ct}: bad tense "${c.tense}"`);
        ok((TENSE_LEVEL[c.tense] || 1) <= t.level, `${ct}: tense ${c.tense} is level ${TENSE_LEVEL[c.tense]}, task is ${t.level}`);
      }
      if (c.person) ok(E.PERSONS.indexOf(c.person) !== -1 || E.IMP_PERSONS.indexOf(c.person) !== -1, `${ct}: bad person "${c.person}"`);
      if (c.type === 'containsWord') ok(!!c.word, `${ct}: missing word`);
      if (c.type === 'containsAny') ok(Array.isArray(c.words) && c.words.length >= 2, `${ct}: needs >=2 words`);
      if (c.type === 'minWords' || c.type === 'maxWords') ok(Number.isInteger(c.n) && c.n > 0, `${ct}: bad n`);
      if (c.type === 'connectorFrom') ok(CONNECTOR_IDS.has(c.class), `${ct}: unknown connector class "${c.class}"`);
      if (c.type === 'avoidsAny') ok(Array.isArray(c.words) && c.words.length >= 1, `${ct}: needs words`);
      if (c.type === 'avoidsPerson') ok(!!c.person, `${ct}: missing person`);
      if (c.type === 'subjunctiveAfter') ok(!!c.trigger, `${ct}: missing trigger`);
      if (c.type === 'distinctTenses' || c.type === 'minSentences') ok(Number.isInteger(c.n) && c.n > 0, `${ct}: bad n`);
      if (c.type === 'regex') { try { new RegExp(c.pattern, c.flags || 'i'); ok(true, ''); } catch (e) { ok(false, `${ct}: regex does not compile`); } }
    });
    (t.models || []).forEach(m => {
      const r = C.checkWriting(t, m);
      ok(r.allPass, `${tag}: model "${m}" fails its own constraints ` +
        `(${r.results.filter(x => !x.pass).map(x => strip(x.label)).join('; ')})`);
    });
  });
}

// ---------- vocab & idioms ---------------------------------------------------
{
  const seenV = new Set();
  (window.VOCAB || []).forEach((w, i) => {
    ok(w.es && w.en && w.cat, `vocab[${i}]: missing es/en/cat`);
    ok(!seenV.has(w.es), `vocab duplicate "${w.es}"`); seenV.add(w.es);
  });
  const seenI = new Set();
  (window.IDIOMS || []).forEach((x, i) => {
    ok(x.es && x.en, `idiom[${i}]: missing es/en`);
    ok(!seenI.has(x.es), `idiom duplicate "${x.es}"`); seenI.add(x.es);
  });
}

// ---------- topics ("talk about X") — each has leveled prompts ---------------
{
  const seen = new Set();
  (window.TOPICS || []).forEach(t => {
    const tag = `topic "${t.id}"`;
    ok(!seen.has(t.id), `${tag}: duplicate id`); seen.add(t.id);
    ok(t.topic && Array.isArray(t.prompts) && t.prompts.length >= 1, `${tag}: needs topic + prompts[]`);
    (t.prompts || []).forEach((pr, pi) => {
      const ptag = `${tag} prompt[${pi}]`;
      ok(pr.prompt && pr.level >= 1 && pr.level <= MAX_LEVEL, `${ptag}: needs prompt + valid level`);
      ok((pr.constraints || []).length >= 1, `${ptag}: needs >=1 constraint`);
      ok((pr.models || []).length >= 1, `${ptag}: needs >=1 model`);
      (pr.constraints || []).forEach(c => {
        if (c.tense) {
          ok(VALID_TENSES.has(c.tense), `${ptag}: bad tense "${c.tense}"`);
          ok((TENSE_LEVEL[c.tense] || 1) <= pr.level, `${ptag}: tense ${c.tense} is level ${TENSE_LEVEL[c.tense]}, prompt is ${pr.level}`);
        }
        if (c.inf) ok(!!E.verbByInf(c.inf), `${ptag}: verb "${c.inf}" not in dataset`);
      });
      (pr.models || []).forEach(m => {
        const r = C.checkWriting(pr, m);
        ok(r.allPass, `${ptag}: model "${m}" fails its own constraints ` +
          `(${r.results.filter(x => !x.pass).map(x => strip(x.label)).join('; ')})`);
      });
    });
  });
}

// ---------- strand lessons (function / discourse / genre) -------------------
{
  const ids = new Set();
  (window.STRAND_LESSONS || []).forEach(l => {
    const tag = `strand lesson "${l.id}"`;
    ok(!!l.id && !ids.has(l.id), `${tag}: missing or duplicate id`); ids.add(l.id);
    ok(!!l.title && !!l.summary, `${tag}: missing title/summary`);
    ok(l.level >= 1 && l.level <= MAX_LEVEL, `${tag}: bad level ${l.level}`);
    ok(STRAND_IDS.has(l.strand), `${tag}: unknown strand "${l.strand}"`);
    ok((l.sections || []).length >= 1, `${tag}: no sections`);
    ok((l.examples || []).length >= 1, `${tag}: no examples`);
    checkTags(l, tag);
    checkProbes(l, tag);
    checkStrandBlocks(l);
  });
}

// ---------- resources -------------------------------------------------------
{
  (window.RESOURCES || []).forEach((g, i) => {
    ok(g.category && Array.isArray(g.items) && g.items.length >= 1, `resources[${i}]: needs category + items`);
    (g.items || []).forEach((it, j) => ok(it.label && /^https?:\/\//.test(it.url || ''),
      `resources[${i}].items[${j}]: needs label + http(s) url`));
  });
}

console.log(`\nLessons: ${(window.GRAMMAR_LESSONS || []).length}+${(window.STRAND_LESSONS || []).length}  Passages: ${(window.PASSAGES || []).length}` +
  `  Apply: ${(window.APPLY_ITEMS || []).length}  Writing: ${(window.WRITING_TASKS || []).length}`);
console.log(`Checks run: ${checks}`);
{
  const pct = n => tagStats.seen ? Math.round(100 * n / tagStats.seen) + '%' : '—';
  console.log(`Tag coverage over ${tagStats.seen} tagged-eligible items` +
    (STRICT_TAGS ? ' [STRICT]' : ' [migrating — set STRICT_TAGS=1 to enforce]') + ':');
  console.log(`  cefr ${pct(tagStats.cefr).padStart(4)}   pcic ${pct(tagStats.pcic).padStart(4)}` +
    `   theme ${pct(tagStats.theme).padStart(4)}   strand ${pct(tagStats.strand).padStart(4)}`);
}
if (errors) { console.error(`\n❌ ${errors} problem(s) found.`); process.exit(1); }
console.log('\n✅ All content valid.');
