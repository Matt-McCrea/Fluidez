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
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js',
 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js', 'data/resources.js',
 'js/engine.js', 'js/lessons.js', 'js/checker.js'].forEach(load);

const E = window.ENGINE, C = window.Checker;
let errors = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { errors++; console.error('  ✗ ' + msg); } }

// tense key -> syllabus level (concept lessons don't gate tenses)
const TENSE_LEVEL = {};
(window.SYLLABUS || []).forEach(s => { if (E.TENSES.some(t => t.key === s.id)) TENSE_LEVEL[s.id] = s.level; });
const VALID_TENSES = new Set(E.TENSES.map(t => t.key));
const strip = h => String(h).replace(/<[^>]+>/g, '');

// ---------- lessons & syllabus ----------------------------------------------
{
  const lessons = window.GRAMMAR_LESSONS || [];
  ok(lessons.length >= (window.SYLLABUS || []).length, 'syllabus ids missing lessons: got ' + lessons.length);
  const ids = new Set(), recallIds = new Set();
  lessons.forEach(l => {
    ok(!ids.has(l.id), `lesson duplicate id "${l.id}"`); ids.add(l.id);
    ok(l.title && l.summary, `lesson "${l.id}": missing title/summary`);
    ok(l.level >= 1 && l.level <= 5, `lesson "${l.id}": bad level ${l.level}`);
    ok((l.sections || []).length >= 1, `lesson "${l.id}": no sections`);
    ok((l.examples || []).length >= 1, `lesson "${l.id}": no examples`);
    (l.recall || []).forEach(r => {
      ok(/^g:/.test(r.id), `recall "${r.id}" (lesson ${l.id}): id must start with "g:"`);
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
    ok(p.level >= 1 && p.level <= 5, `${tag}: bad level ${p.level}`);
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
    E.tokenize(p.text).forEach(tok => {
      const analyses = E.analyzeToken(tok);
      if (!analyses.length) return;
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
    ok(it.level >= 1 && it.level <= 5, `${tag}: bad level ${it.level}`);
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
  const CONSTRAINT_TYPES = new Set(['verbForm', 'verbFormAny', 'anyVerbInTense', 'person',
    'infinitiveUsed', 'verbType', 'containsWord', 'containsAny', 'minWords', 'maxWords',
    'question', 'negation', 'regex']);
  const seen = new Set();
  (window.WRITING_TASKS || []).forEach(t => {
    const tag = `writing "${t.id}"`;
    ok(!seen.has(t.id), `${tag}: duplicate id`); seen.add(t.id);
    ok(t.level >= 1 && t.level <= 5, `${tag}: bad level ${t.level}`);
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
      ok(pr.prompt && pr.level >= 1 && pr.level <= 5, `${ptag}: needs prompt + valid level`);
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

// ---------- resources -------------------------------------------------------
{
  (window.RESOURCES || []).forEach((g, i) => {
    ok(g.category && Array.isArray(g.items) && g.items.length >= 1, `resources[${i}]: needs category + items`);
    (g.items || []).forEach((it, j) => ok(it.label && /^https?:\/\//.test(it.url || ''),
      `resources[${i}].items[${j}]: needs label + http(s) url`));
  });
}

console.log(`\nLessons: ${(window.GRAMMAR_LESSONS || []).length}  Passages: ${(window.PASSAGES || []).length}` +
  `  Apply: ${(window.APPLY_ITEMS || []).length}  Writing: ${(window.WRITING_TASKS || []).length}`);
console.log(`Checks run: ${checks}`);
if (errors) { console.error(`\n❌ ${errors} problem(s) found.`); process.exit(1); }
console.log('\n✅ All content valid.');
