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
['data/taxonomy.js', 'data/connectors.js', 'data/strand-lessons.js', 'data/course.js',
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
(window.SEED_SYLLABUS || window.SYLLABUS || []).forEach(s => { if (E.TENSES.some(t => t.key === s.id)) TENSE_LEVEL[s.id] = s.level; });
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
    // For function and discourse the teaching point IS the register contrast,
    // so one register is not a lesson. A notion lesson's exponents are
    // grammatical means, not social choices, and carry no such requirement.
    if (strand.registerContrast) {
      ok(regs.size >= 2, `${tag}: exponents span only one register (${[...regs]}) — a ${l.strand} lesson must contrast at least two`);
    }
  }
  if (l.moves !== undefined) {
    ok(Array.isArray(l.moves) && l.moves.length >= 2, `${tag}: genre needs >=2 moves`);
    (l.moves || []).forEach((m, i) => ok(m.h && m.html, `${tag} move[${i}]: needs h + html`));
  }
  if (l.model !== undefined) ok(l.model && l.model.text && l.model.text.length > 40, `${tag}: model text too short`);
  if (l.checklist !== undefined) ok(Array.isArray(l.checklist) && l.checklist.length >= 2, `${tag}: checklist needs >=2 items`);
  if (l.exponents) checkRegisterCoherence(l);
  // address consistency across every piece of connected prose in the lesson
  const proseBits = [];
  if (l.model && l.model.text) proseBits.push(['model', l.model.text]);
  (l.examples || []).forEach((e, i) => proseBits.push([`example[${i}]`, e.es]));
  (l.exponents || []).forEach((e, i) => proseBits.push([`exponent[${i}]`, e.es]));
  proseBits.forEach(([where, txt]) => {
    const m = addressMix(txt);
    ok(!m, `${tag} ${where}: mixes tú (${m ? m.tu.join(', ') : ''}) and vosotros (${m ? m.vos.join(', ') : ''}) address`);
  });
  if (l.words !== undefined) ok(Array.isArray(l.words) && l.words.length >= 1, `${tag}: words must be a non-empty array`);
  if (l.collocations !== undefined) ok(Array.isArray(l.collocations), `${tag}: collocations must be an array`);
}

/* ---------- address consistency -------------------------------------------
 * A text that addresses one reader as "tú" must not slip into "vosotros". The
 * A2 horoscope model read "si tienes pareja, dedicadle más tiempo" — a
 * vosotros imperative among tú forms — and no gate could see it: dedicadle is
 * a perfectly good Spanish word, so the accent linter passed it, and nothing
 * else looked at person agreement ACROSS a text.
 *
 * Only tú vs vosotros is checked. Usted takes third-person forms that are
 * identical to "he/she", so a mixture with usted cannot be told from ordinary
 * narration and would only produce noise.
 *
 * Proper nouns are skipped: "París" happens to spell a vosotros form. */
function addressMix(text) {
  if (!text) return null;
  const raw = String(text);
  // a token capitalised anywhere in the text is treated as a name, not a verb
  const caps = new Set((raw.match(/\b[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+/g) || []).map(w => w.toLowerCase()));
  const only = (tok, person) => {
    if (caps.has(tok)) return false;
    const a = E.analyzeToken(tok);
    return a.length > 0 && a.every(x => x.person === person);
  };
  const toks = E.tokenize(raw);
  const tu = [...new Set(toks.filter(t => only(t, 'tú')))];
  const vos = [...new Set(toks.filter(t => only(t, 'vosotros')))];
  return (tu.length && vos.length) ? { tu, vos } : null;
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
/* Markers that PROVE usted address. "su", "le" and "les" are deliberately
 * absent: they are third-person far more often than they are usted, so
 * including them flagged "nadie le obligó a firmar" (nobody forced HIM) and
 * "se quedaba en su casa" (at HER place) as formal. A check that fires on
 * correct content is worse than no check. */
const USTED_MARKERS = /\b(usted|ustedes|sírvase|agradecería|quisiera)\b/i;
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
  // A lesson absorbed by an A1 merge keeps its own entry in STRAND_LESSONS, but
  // its probes now live on the merged lesson and were checked there. Checking
  // the source too would flag every one of them as a duplicate id.
  if ((window.LESSON_MERGED_INTO || {})[l.id]) return;
  if (l.probes === undefined) { ok(!STRICT_TAGS, `${tag}: missing probes`); return; }
  /* A merged lesson carries every source lesson's probes — placement and the
   * skip check need them all — so its budget scales with how many it merged.
   * Only the parts that AUTHOR probes count: the generated tense lessons never
   * had any, by design, because their checks are engine-computed recall items
   * (the endings, the haber forms). Pairing one with a strand lesson would
   * otherwise demand six more hand-written probes for a table the engine
   * already owns. */
  const authors = new Set((window.STRAND_LESSONS || []).map(s => s.id));
  const parts = Math.max(1, (l.mergedFrom || [l.id]).filter(id => authors.has(id)).length);
  ok(Array.isArray(l.probes) && l.probes.length >= 3 * parts && l.probes.length <= 6 * parts,
     `${tag}: needs ${3 * parts}-${6 * parts} probes, got ${(l.probes || []).length}`);
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
  ok(lessons.length >= (window.SEED_SYLLABUS || []).length, 'syllabus ids missing lessons: got ' + lessons.length);
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
  /* A seed id still has to resolve to something teachable — but "something"
   * now includes the lesson that absorbed it. Six tenses were being formed
   * twice (once by the generated ladder lesson, once by a PCIC strand lesson
   * that also formed them), so the pairs are merged; the ladder half keeps its
   * seed entry and its level, and LESSON_MERGED_INTO says where it went. */
  const mergedInto = window.LESSON_MERGED_INTO || {};
  (window.SEED_SYLLABUS || []).forEach(s =>
    ok(ids.has(s.id) || ids.has(mergedInto[s.id]),
       `syllabus id "${s.id}" has no lesson (and was not merged into one)`));

  /* ---- the course (data/course.js) ---------------------------------------
   * The teaching order used to be a sort, which guaranteed by construction
   * that every lesson appeared once and none was unreachable. Writing the
   * order down trades that guarantee for a readable one, so it has to be
   * checked here instead: a lesson missing from COURSE is invisible to the
   * session forever, and a lesson listed twice is taught twice. */
  /* COURSE is authored as units that own their days, plus bare day entries for
   * the stretches not yet organised into units. COURSE_DAYS is that flattened
   * (data/course.js derives it), and it is what "day N of the course" means. */
  const authored = window.COURSE || [];
  const course = window.COURSE_DAYS || [];
  ok(authored.length > 0, 'course: data/course.js defines no COURSE');
  ok(course.length > 0, 'course: COURSE_DAYS is empty — the flattening failed');

  // ---- units --------------------------------------------------------------
  const unitIds = new Set();
  authored.forEach((e, i) => {
    if (!e.unit) {
      // a bare band marker, or a day not yet in a unit
      const kinds = ['lesson', 'verbs', 'practice', 'band'].filter(k => e[k] !== undefined);
      ok(kinds.length === 1, `course[${i}]: needs exactly one of lesson/verbs/practice/band, has [${kinds}]`);
      if (e.band) ok(CEFR.has(e.band), `course[${i}]: band marker names unknown band "${e.band}"`);
      return;
    }
    const tag = `unit "${e.unit}"`;
    ok(!unitIds.has(e.unit), `${tag}: duplicate unit id`); unitIds.add(e.unit);
    ok(!!e.title, `${tag}: missing title`);
    ok(!!e.goal, `${tag}: missing goal — a unit is named for what the learner can do after it`);
    ok(Array.isArray(e.canDo) && e.canDo.length >= 1, `${tag}: needs at least one canDo`);
    ok(!e.band || CEFR.has(e.band), `${tag}: unknown band "${e.band}"`);
    ok(Array.isArray(e.days) && e.days.length >= 2, `${tag}: needs at least 2 days`);
    /* A unit ends with something the learner produces. That is the whole point
     * of the unit being a unit rather than a run of lessons, so it is checked
     * rather than left to discipline. */
    /* Core units only. An optional unit is depth on a topic the learner came
     * looking for — it ends when the explaining is done, and demanding a task
     * would make every deep dive cost a piece of homework nobody asked for. */
    if (!e.optional) {
      const lastDay = (e.days || [])[(e.days || []).length - 1] || {};
      const lastId = lastDay.lesson || '';
      const lastLesson = (window.ALL_LESSONS || []).find(l => l.id === lastId);
      ok(lastLesson && lastLesson.strand === 'task',
         `${tag}: last day is "${lastId || '(not a lesson)'}", which is not a task lesson`);
    }
  });
  // Every day COURSE_DAYS produced must know which band it is in.
  course.forEach((d, i) => ok(!!d.band, `course day ${i}: no band — is there a band marker before it?`));
  /* Check against every lesson that EXISTS, not against GRAMMAR_LESSONS —
   * GRAMMAR_LESSONS *is* the course, so a lesson dropped from COURSE would
   * simply be absent from it and the omission would check out clean. */
  const allLessons = window.ALL_LESSONS || lessons;
  const allIds = new Set(allLessons.map(l => l.id));
  const placed = new Map();
  course.forEach((e, i) => {
    const kinds = ['lesson', 'verbs', 'practice'].filter(k => e[k] !== undefined);
    ok(kinds.length === 1, `course[${i}]: needs exactly one of lesson/verbs/practice, has [${kinds}]`);
    if (e.lesson) {
      ok(allIds.has(e.lesson), `course[${i}]: no such lesson "${e.lesson}"`);
      ok(!placed.has(e.lesson), `course[${i}]: "${e.lesson}" is already placed at ${placed.get(e.lesson)}`);
      placed.set(e.lesson, i);
    }
    if (e.verbs) {
      ok(Array.isArray(e.verbs) && e.verbs.length >= 1, `course[${i}]: empty verb day`);
      (e.verbs || []).forEach(inf =>
        ok(!!E.verbByInf(inf), `course[${i}]: verb day names "${inf}", which is not in data/verbs.js`));
    }
  });
  /* A lesson has to be REACHABLE, which is not the same as being on the course.
   * Requiring every lesson in COURSE forced the whole 700-lesson knowledge base
   * onto one path, so a lesson could not be authored as reference without also
   * costing a learner a day. Two ways to be reachable now:
   *   - placed in COURSE                        (the core path)
   *   - status:'reference' AND linked from at   (the shelf underneath it)
   *     least one core lesson's `deeper`
   * The guarantee is unchanged — nothing is unreachable — just widened by one
   * case. A reference lesson nothing links to is still an error, because it is
   * exactly as invisible as one missing from COURSE. */
  const deepLinked = new Set();
  allLessons.forEach(l => (l.deeper || []).forEach(id => deepLinked.add(id)));
  // A lesson inside an OPTIONAL unit is reachable through that unit, which is a
  // better route than a `deeper` link from one core lesson: the unit gives it
  // a goal, an order and neighbours, where a deeper link gives it a doorway.
  const inOptionalUnit = new Set();
  Object.values(window.COURSE_UNITS || {}).forEach(u => {
    if (u.optional) (u.lessons || []).forEach(id => inOptionalUnit.add(id));
  });
  allLessons.forEach(l => {
    if (placed.has(l.id)) {
      ok(l.status !== 'reference',
         `lesson "${l.id}" is status:'reference' but is also placed in COURSE at ${placed.get(l.id)}`);
      ok(!inOptionalUnit.has(l.id),
         `lesson "${l.id}" is on the core path AND in an optional unit — it would be taught twice`);
      return;
    }
    ok(l.status === 'reference',
       `lesson "${l.id}" is in no course entry — mark it status:'reference' or place it`);
    ok(deepLinked.has(l.id) || inOptionalUnit.has(l.id),
       `reference lesson "${l.id}" is in no optional unit and linked from no lesson's \`deeper\` — nothing could reach it`);
  });
  // An optional unit is held to the same discipline as a core one, minus the
  // task: it must say what the learner will be able to do at the end.
  authored.filter(e => e.unit && e.optional).forEach(e => {
    const tag = `optional unit "${e.unit}"`;
    ok(!!e.goal, `${tag}: missing goal`);
    ok(Array.isArray(e.canDo) && e.canDo.length >= 1, `${tag}: needs at least one canDo`);
    ok(Array.isArray(e.days) && e.days.length >= 2, `${tag}: needs at least 2 lessons`);
    (e.days || []).forEach(d => ok(!!d.lesson,
      `${tag}: every entry must be a lesson — no verb or practice days in an optional unit`));
  });
  // Every `deeper` target must exist, and must actually be reference material:
  // pointing a deep-dive at a lesson the learner is walking anyway is a no-op.
  allLessons.forEach(l => (l.deeper || []).forEach(id => {
    ok(allIds.has(id), `lesson "${l.id}": \`deeper\` names "${id}", which is not a lesson`);
    const t = allLessons.find(x => x.id === id);
    if (t) ok(t.status === 'reference',
       `lesson "${l.id}": \`deeper\` names "${id}", which is not status:'reference'`);
  }));
  // An upgrade must point BACKWARDS — a lesson cannot upgrade one taught later.
  allLessons.forEach(l => {
    if (!l.upgrades) return;
    ok(allIds.has(l.upgrades), `lesson "${l.id}": \`upgrades\` names "${l.upgrades}", which is not a lesson`);
    if (placed.has(l.id) && placed.has(l.upgrades)) {
      ok(placed.get(l.upgrades) < placed.get(l.id),
         `lesson "${l.id}" upgrades "${l.upgrades}", which the course teaches later (${placed.get(l.upgrades)} > ${placed.get(l.id)})`);
    }
  });

  // Bands are slices of the one course, so their starts must ascend and land
  // on a real entry; anything else silently truncates or overlaps a band.
  const starts = window.COURSE_BANDS || {};
  const codes = Object.keys(starts).sort((a, b) => starts[a] - starts[b]);
  ok(codes.length === (window.LEVELS || []).length,
     `course: COURSE_BANDS names ${codes.length} bands, taxonomy defines ${(window.LEVELS || []).length}`);
  codes.forEach((c, i) => {
    ok(CEFR.has(c), `course: COURSE_BANDS has unknown band "${c}"`);
    ok(Number.isInteger(starts[c]) && starts[c] >= 0 && starts[c] < course.length,
       `course: band "${c}" starts at ${starts[c]}, outside the course`);
    if (i > 0) ok(starts[c] > starts[codes[i - 1]],
       `course: band "${c}" does not start after "${codes[i - 1]}"`);
  });
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
    { const m = addressMix(p.text);
      ok(!m, `${tag}: mixes tú (${m ? m.tu.join(', ') : ''}) and vosotros (${m ? m.vos.join(', ') : ''}) address`); }
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
  const GENDERS = new Set(['m', 'f', 'c']);
  (window.VOCAB || []).forEach((w, i) => {
    ok(w.es && w.en && w.cat, `vocab[${i}]: missing es/en/cat`);
    ok(!seenV.has(w.es), `vocab duplicate "${w.es}"`); seenV.add(w.es);
    checkTags(w, `vocab[${i}] "${w.es}"`);
    if (w.gender !== undefined) {
      ok(GENDERS.has(w.gender), `vocab "${w.es}": bad gender "${w.gender}"`);
      // the article a noun is taught with must agree with its recorded gender
      const art = String(w.es).match(/^(el|la|los|las) /);
      if (art) ok((/^(el|los)$/.test(art[1]) ? 'm' : 'f') === w.gender || w.gender === 'c',
        `vocab "${w.es}": article disagrees with gender "${w.gender}"`);
    }
    if (w.collocations !== undefined) {
      ok(Array.isArray(w.collocations) && w.collocations.length >= 1 &&
         w.collocations.every(c => typeof c === 'string' && c.trim()),
        `vocab "${w.es}": collocations must be a non-empty array of strings`);
      // a comma or bracket means the PCIC notation was mis-parsed into a list
      (w.collocations || []).forEach(c => ok(!/[(),/]/.test(c),
        `vocab "${w.es}": malformed collocation "${c}"`));
    }
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

// ---------- wiring: index.html and the service worker --------------------
/* Every data and js file has to be listed as a <script> in index.html and as an
 * asset in sw.js. Nothing else checks this: the Node harnesses load modules
 * directly, so a file can be complete, valid and entirely absent from the page.
 * data/taxonomy.js, data/connectors.js and data/strand-lessons.js were all
 * missing from both — window.LEVELS was undefined in the browser, which left
 * the app with no profiles at all while every gate stayed green. */
{
  const read = f => { try { return fs.readFileSync(path.join(__dirname, '..', f), 'utf8'); } catch (e) { return ''; } };
  const html = read('index.html'), sw = read('sw.js');
  const scripts = (html.match(/src="([^"]+\.js)"/g) || []).map(m => m.slice(5, -1));

  const onDisk = [];
  ['data', 'js', 'js/views'].forEach(dir => {
    let names = [];
    try { names = fs.readdirSync(path.join(__dirname, '..', dir)); } catch (e) { return; }
    names.filter(n => n.endsWith('.js')).forEach(n => onDisk.push(dir + '/' + n));
  });

  onDisk.forEach(f => {
    ok(scripts.indexOf(f) !== -1, `index.html does not load ${f} — it will not exist in the browser`);
    ok(sw.indexOf("'./" + f + "'") !== -1, `sw.js does not cache ${f} — offline installs will miss it`);
  });

  /* The profiles were renamed from beginner/standard/refresher to A1-C1, and
   * comparisons against the old names do not error — they just quietly stop
   * matching. That silently disabled the beginner verb restriction, the paced
   * curriculum's day counter (so lessons never advanced), the roadmap's
   * beginner view and two game restrictions. Ban the strings outright. */
  {
    ['js', 'js/views'].forEach(d => {
      let names = [];
      try { names = fs.readdirSync(path.join(__dirname, '..', d)); } catch (e) { return; }
      names.filter(n => n.endsWith('.js') && d + '/' + n !== 'js/profile.js').forEach(n => {
        const src = read(d + '/' + n);
        [/'beginner'/, /'refresher'/, /"beginner"/, /"refresher"/].forEach(re => {
          ok(!re.test(src),
            `${d}/${n} compares against an old profile name (${re.source}) — profiles are A1-C1; use Profile.isPaced() or params().usesCurriculum`);
        });
      });
    });
  }

  /* "Empezar de cero" must clear every key the app writes, or a reset leaves
   * debris and the learner is not actually starting fresh. fluidez.theme is
   * deliberately kept — resetting your Spanish should not turn off dark mode. */
  {
    const used = new Set();
    ['js', 'js/views'].forEach(d => {
      let names = [];
      try { names = fs.readdirSync(path.join(__dirname, '..', d)); } catch (e) { return; }
      names.filter(n => n.endsWith('.js')).forEach(n => {
        (read(d + '/' + n).match(/'fluidez\.[a-zA-Z.]*'/g) || []).forEach(k => used.add(k.replace(/'/g, '')));
      });
    });
    // Match the KEYS array itself. Searching the whole file was vacuous: the
    // export list mentions the same keys, so a key dropped from the reset was
    // still "found" and the check silently passed.
    const settings = read('js/settings.js');
    const decl = (settings.match(/var KEYS = \[([\s\S]*?)\];/) || [])[1] || '';
    ok(!!decl, 'js/settings.js: could not find the KEYS list');
    used.forEach(k => {
      ok(decl.indexOf("'" + k + "'") !== -1,
        `js/settings.js KEYS does not include ${k} — export and reset would both miss it`);
    });
  }

  // the build marker shown in Ajustes must match the worker, or it misreports
  // which code is running — the one thing a cache-first app most needs to know
  var swv = (sw.match(/CACHE_VERSION\s*=\s*'([^']+)'/) || [])[1];
  var pv = (read('js/perf.js').match(/BUILD\s*=\s*'([^']+)'/) || [])[1];
  ok(swv && pv && swv === pv, `js/perf.js BUILD (${pv}) does not match sw.js CACHE_VERSION (${swv})`);

  // load order: a data file must come before the js that reads its global
  const order = f => scripts.indexOf(f);
  [['data/taxonomy.js', 'js/profile.js'], ['data/taxonomy.js', 'js/lessons.js'],
   ['data/connectors.js', 'js/checker.js'], ['data/strand-lessons.js', 'js/lessons.js'],
   ['data/verbs.js', 'js/engine.js']].forEach(([first, then]) => {
    if (order(first) === -1 || order(then) === -1) return;
    ok(order(first) < order(then), `index.html loads ${then} before ${first} — the global will be undefined`);
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
