/* Node test for the writing checker. Run: node tools/test-checker.js
 * Loads the browser data + engine + checker (which assign to window), then
 * asserts constraint evaluation on hand-written good/bad sentences. Also, once
 * content exists, asserts every authored writing task's model answers satisfy
 * their own constraints (catches self-inconsistent tasks). */
'use strict';
const fs = require('fs'), path = require('path');
global.window = {};
function load(rel) { (0, eval)(fs.readFileSync(path.join(__dirname, '..', rel), 'utf8')); }
// data/connectors.js is required by the connectorFrom constraint: without it
// window.CONNECTORS is undefined and every model answer using that constraint
// fails its own self-check, which made the constraint unusable.
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js',
 'js/engine.js', 'js/checker.js'].forEach(load);

const C = window.Checker;
let errors = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { errors++; console.error('  ✗ ' + msg); } }

// A constraint passes/fails as expected on a given sentence.
function constraintIs(spec, sentence, expected) {
  const r = C.checkWriting({ constraints: [spec] }, sentence);
  ok(r.results[0].pass === expected,
     `[${expected ? 'expected PASS' : 'expected FAIL'}] ${spec.type} on "${sentence}" ` +
     `(got ${r.results[0].pass}; label="${r.results[0].label.replace(/<[^>]+>/g, '')}"` +
     (r.results[0].detail ? `; detail="${r.results[0].detail}"` : '') + ')');
}

// --- verbForm: exact conjugation required -----------------------------------
constraintIs({ type: 'verbForm', inf: 'comer', tense: 'preterito', person: 'yo' }, 'Ayer comí paella', true);
constraintIs({ type: 'verbForm', inf: 'comer', tense: 'preterito', person: 'yo' }, 'Ayer como paella', false);
constraintIs({ type: 'verbForm', inf: 'comer', tense: 'preterito', person: 'yo' }, 'Ayer comio paella', false); // wrong person + accent
constraintIs({ type: 'verbForm', inf: 'hablar', tense: 'presente', person: 'nosotros' }, 'Hablamos español', true);

// accent near-miss gives a helpful detail but does NOT pass
{
  const r = C.checkWriting({ constraints: [{ type: 'verbForm', inf: 'comer', tense: 'preterito', person: 'él/ella' }] }, 'Ella comio rápido');
  ok(r.results[0].pass === false && /accent/i.test(r.results[0].detail), 'accent near-miss should fail with an accent hint');
}

// --- anyVerbInTense ---------------------------------------------------------
constraintIs({ type: 'anyVerbInTense', tense: 'preterito' }, 'Ayer fui al mercado y compré fruta', true);
constraintIs({ type: 'anyVerbInTense', tense: 'preterito' }, 'Hoy voy al mercado', false);
constraintIs({ type: 'anyVerbInTense', tense: 'presubj' }, 'Quiero que vengas mañana', true);
constraintIs({ type: 'anyVerbInTense', tense: 'imperfecto' }, 'Cuando era niño vivía en Madrid', true);

// --- compound tense detection ----------------------------------------------
constraintIs({ type: 'anyVerbInTense', tense: 'perfecto' }, 'He comido mucho hoy', true);
constraintIs({ type: 'anyVerbInTense', tense: 'perfecto' }, 'Como mucho hoy', false);

// --- person -----------------------------------------------------------------
constraintIs({ type: 'person', person: 'nosotros' }, 'Vivimos en España', true);
constraintIs({ type: 'person', person: 'nosotros' }, 'Vivo en España', false);

// --- infinitiveUsed / verbType ---------------------------------------------
constraintIs({ type: 'infinitiveUsed', inf: 'querer' }, 'Quiero un café', true);
constraintIs({ type: 'infinitiveUsed', inf: 'querer' }, 'Necesito un café', false);
constraintIs({ type: 'verbType', ending: 'ir' }, 'Vivo aquí', true);
constraintIs({ type: 'verbType', ending: 'ir' }, 'Hablo aquí', false);

// --- word / phrase / any ----------------------------------------------------
constraintIs({ type: 'containsWord', word: 'ayer' }, 'Ayer comí paella', true);
constraintIs({ type: 'containsWord', word: 'todos los días' }, 'Estudio todos los dias', true); // accent-insensitive phrase
constraintIs({ type: 'containsAny', words: ['pero', 'aunque', 'porque'] }, 'Fui porque tenía hambre', true);
constraintIs({ type: 'containsAny', words: ['pero', 'aunque'] }, 'Fui a casa', false);

// --- structural -------------------------------------------------------------
constraintIs({ type: 'minWords', n: 5 }, 'Uno dos tres', false);
constraintIs({ type: 'minWords', n: 3 }, 'Uno dos tres', true);
constraintIs({ type: 'question' }, '¿Qué hora es?', true);
constraintIs({ type: 'question' }, 'Es la una', false);
constraintIs({ type: 'negation' }, 'No quiero nada', true);
constraintIs({ type: 'negation' }, 'Quiero todo', false);

// --- multi-constraint task: all must pass -----------------------------------
{
  const task = { constraints: [
    { type: 'anyVerbInTense', tense: 'preterito' },
    { type: 'person', person: 'yo' },
    { type: 'containsWord', word: 'ayer' }
  ] };
  ok(C.checkWriting(task, 'Ayer comí en un restaurante').allPass === true, 'good sentence should satisfy all constraints');
  ok(C.checkWriting(task, 'Hoy como en un restaurante').allPass === false, 'wrong-tense sentence should not satisfy all');
}

// --- paragraph task: constraints span multiple sentences --------------------
{
  const para = { type: 'paragraph', constraints: [
    { type: 'anyVerbInTense', tense: 'preterito' },
    { type: 'anyVerbInTense', tense: 'imperfecto' },
    { type: 'containsAny', words: ['porque', 'pero', 'y'] },
    { type: 'minWords', n: 20 }
  ] };
  const good = 'Ayer fui al mercado y compré fruta. Hacía mucho calor, pero estaba contento porque encontré todo lo que necesitaba para la cena de esta noche.';
  ok(C.checkWriting(para, good).allPass === true, 'well-formed paragraph should satisfy all constraints');
  ok(C.checkWriting(para, 'Hoy voy al mercado.').allPass === false, 'a short present-only text should not satisfy the paragraph constraints');
}

// --- checkExact (cloze / transforms) ---------------------------------------
ok(C.checkExact('comí', 'comí').pass === true, 'exact match passes');
ok(C.checkExact('comi', 'comí').pass === false && C.checkExact('comi', 'comí').near === true, 'accent-missing is a near miss');
ok(C.checkExact('  Comí ', ['fui', 'comí']).pass === true, 'trims/lowercases and accepts a list');

/* --- answerForms: the answer as a person would type it ---------------------
 *
 * These are the forms a learner can be marked RIGHT for, so the interesting
 * assertions are the NEGATIVE ones. Every rule here was narrowed after a
 * first version accepted something nobody should pass on. */
{
  const forms = b => C.answerForms(b).map(x => x.toLowerCase());
  const takes = (b, x, why) => ok(forms(b).indexOf(x.toLowerCase()) !== -1,
    `answerForms("${b}") should accept "${x}" — ${why}`);
  const refuses = (b, x, why) => ok(forms(b).indexOf(x.toLowerCase()) === -1,
    `answerForms("${b}") must NOT accept "${x}" — ${why}`);

  // an optional suffix written into the word
  takes('quizá(s)', 'quizá', 'the bracket means the s is optional');
  takes('quizá(s)', 'quizás', 'and the long form is equally right');
  refuses('quizá(s)', 's', 'the bracket contents are a suffix, not an answer');

  // a bracketed aside is metadata
  takes('apellido (surname)', 'apellido', 'the gloss is for the reader, not the box');
  takes('accent (tilde)', 'tilde', 'a one-word aside is the same answer in Spanish');
  refuses('(Le saluda) atentamente,', 'le saluda',
    'a multi-word aside is half a phrase, and half the phrase is not the closing');
  takes('(Le saluda) atentamente,', 'atentamente', 'the closing itself');

  // a slash separating two whole answers
  takes('encantado / encantada', 'encantado', 'either gender is the right set phrase');
  takes('encantado / encantada', 'encantada', 'and so is the other');
  takes('libre/ocupado', 'libre', 'an unspaced slash in a single token is still two answers');
  takes('de repente / de pronto', 'de pronto', 'a two-word part is short enough to be an answer');

  // ...and a slash that is just punctuation inside one answer
  refuses('¿Has aprendido/estudiado...?', 'estudiado...?', 'that is a fragment, not an answer');
  refuses('¿Has aprendido/estudiado...?', '¿has aprendido', 'and so is the other half');
  refuses('ser bueno para/en', 'en', 'a preposition alone answers nothing');
  refuses('Logros o fracasos ambiciosos/competitivos', 'competitivos', 'an adjective alone is not the category');

  // a plain answer is left exactly as it is — nothing here may loosen a drill
  ok(C.answerForms('comí').length === 1, 'a plain answer derives no alternatives');
  ok(C.answerForms('habría hablado').length === 1, 'nor does a plain two-word answer');
  ok(C.answerForms('').length === 0, 'an empty answer derives nothing');

  // and the forms actually reach checkExact through `also`
  ok(C.checkExact('quizás', 'quizá(s)', { also: C.answerForms('quizá(s)') }).pass === true,
     'checkExact accepts a derived form when it is passed as `also`');
  ok(C.checkExact('quizás', 'quizá(s)').pass === false,
     'and still refuses it when it is not — nothing is loosened globally');
}

// --- authored writing tasks (if present) are self-consistent ----------------
try {
  load('data/writing.js');
  const W = window.WRITING_TASKS || [];
  W.forEach((t) => {
    (t.models || []).forEach((m) => {
      const r = C.checkWriting(t, m);
      ok(r.allPass, `writing task "${t.id}": model answer "${m}" fails its own constraints ` +
        `(${r.results.filter(x => !x.pass).map(x => x.label.replace(/<[^>]+>/g, '')).join('; ')})`);
    });
  });
  console.log(`\nWriting tasks checked: ${W.length}`);
} catch (e) { console.log('\n(no data/writing.js yet — skipping model self-check)'); }

console.log(`Checks run: ${checks}`);
if (errors) { console.error(`\n❌ ${errors} problem(s).`); process.exit(1); }
console.log('\n✅ Checker OK.');
