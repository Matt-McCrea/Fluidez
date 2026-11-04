// Apply feedback: the pure parts (hint lookup, accent slips, diff, requeue, grade mapping, prompts). No DOM.
// Run: node tools/test-apply-feedback.js
const fs = require('fs'), path = require('path'), assert = require('assert');
const root = path.join(__dirname, '..');
global.window = {};
const LIB = new Function(fs.readFileSync(path.join(root, 'js/lib.bundle.js'), 'utf8') + ';return LIB')();
window.LIB = LIB;
global.document = { createElement: () => ({ style: {}, appendChild() {}, addEventListener() {} }) };
new Function(fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8')).call(global);
window.ENGINE = {}; window.Checker = {}; window.SRS = null;
new Function(fs.readFileSync(path.join(root, 'js/views/apply.js'), 'utf8')).call(global);
const F = window.StageApply.fb;
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const fired = [];

// a wrong ending: yo hablas for hablo
const cloze = { type: 'cloze', text: 'Yo ___ (hablar) con ella todos los días.', inf: 'hablar', tense: 'presente', person: 'yo' };
let h = F.hintFor(cloze, 'hablas', 'hablo');
ok(h && h.matched && h.kind === 'verb-ending', 'wrong ending named'); fired.push('verb-ending: ' + h.hint);

// ser / estar swap: es for está
const se = { type: 'cloze', text: 'La casa ___ (estar) en la calle Sexta.', inf: 'estar', tense: 'presente', person: 'él/ella' };
h = F.hintFor(se, 'es', 'está');
ok(h && h.matched && h.kind === 'ser-estar', 'ser/estar swap named'); fired.push('ser-estar: ' + h.hint);

// a choice swap: por for para in a gap item
const gap = { type: 'choice', bankKind: 'gap', text: 'Este regalo es ___ ti.  «This gift is for you.»', options: ['por', 'para'], answer: 1 };
h = F.hintFor(gap, 'por', 'para');
ok(h && h.matched && h.kind === 'por-para', 'por/para named'); fired.push('por-para: ' + h.hint);

// mood: indicative for subjunctive after quiero que
const mood = { type: 'cloze', text: 'Quiero que tú ___ (venir) mañana.  «I want you to come tomorrow.»', inf: 'venir', tense: 'subjuntivo', person: 'tú' };
h = F.hintFor(mood, 'vienes', 'vengas');
ok(h && h.matched && h.kind === 'mood', 'mood swap named'); fired.push('mood (' + h.tier + '): ' + h.hint);

// the same verb and person in the other mood: the person hint is wrong, the form hint is right
window.ENGINE = { analyzeToken: (w) => ({ hables: [{ inf: 'hablar', tense: 'presubj', person: 'tú' }], hablas: [{ inf: 'hablar', tense: 'presente', person: 'tú' }] })[w] || [] };
const ind = { type: 'cloze', text: 'Tú ___ (hablar) español.', inf: 'hablar', tense: 'presente', person: 'tú' };
h = F.hintFor(ind, 'hables', 'hablas');
ok(h && h.kind === 'mood' && /Right person, wrong form: this one takes the ordinary form/.test(h.hint), 'subjunctive slip where the indicative belongs'); fired.push('mood slip: ' + h.hint);
h = F.hintFor(ind, 'hablas', 'hables');
ok(h && /this one takes the subjunctive/.test(h.hint), 'indicative slip where the subjunctive belongs');
window.ENGINE = {};
// aspect: preterite for imperfect in a habitual sentence
const asp = { type: 'cloze', text: 'Cuando era niño, yo siempre ___ (jugar) en el parque.  «When I was a kid, I always used to play in the park.»', inf: 'jugar', tense: 'imperfecto', person: 'yo' };
h = F.hintFor(asp, 'jugué', 'jugaba');
ok(h && h.matched && h.kind === 'aspect', 'aspect swap named'); fired.push('aspect (' + h.tier + '): ' + h.hint);

// an unmatched error is not named (it gets the diff)
h = F.hintFor(cloze, 'xyzzy', 'hablo');
ok(h && !h.matched, 'unnamed error is not matched');
ok(F.hintFor(cloze, 'hablo', 'hablo') === null, 'identical text has no hint');

// accent slip: comio for comió is a slip; hablo for habló is another word
const real = (w) => ({ hablo: 1, comi: 1 })[w] === 1;
ok(F.isAccentSlip('comio', 'comió', real), 'accent slip');
ok(!F.isAccentSlip('hablo', 'habló', real), 'real other word is not a slip');
ok(!F.isAccentSlip('comas', 'comió', real), 'different letters are not a slip');

// diff: additions (expected has, learner lacks) and removals
const ops = F.diffOps('hablas', 'hablo');
ok(ops.some((o) => o.op === 'del' && o.s === 'as') && ops.some((o) => o.op === 'ins' && o.s === 'o'), 'diff marks removal and addition');
ok(F.diffHtml('<b>', 'b').indexOf('&lt;') >= 0, 'diff escapes');

// grade mapping
ok(F.gradeFor('first').ok && !F.gradeFor('first').meta.usedHint, 'first time is Good');
ok(F.gradeFor('hint').ok && F.gradeFor('hint').meta.usedHint === true, 'after the hint is Hard');
ok(!F.gradeFor('miss').ok, 'wrong twice is Again');

// requeue: at least 3 items later, once
let q = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((x) => ({ id: x }));
ok(F.requeue(q, 1, q[1]) && q.map((x) => x.id).join('') === 'abcdebfg' && q[5].id === 'b' && q[5]._again, 'requeued 3 items after');
ok(!F.requeue(q, 5, q[5]), 'a repeat is not requeued again');
q = [{ id: 'a' }, { id: 'b' }]; F.requeue(q, 0, q[0]);
ok(q.length === 3 && q[2]._again, 'near the end goes to the end');

// prompts and the choice reason
ok(F.choicePrompt({ bankKind: 'read', text: '“Hablábamos mucho.”  Who is doing it?' }).q === 'Who is doing it?', 'read asks its own q');
ok(F.choicePrompt({ bankKind: 'match', text: '“I eat.”  Which sentence says this?' }).q === 'Which sentence says this?', 'match prompt');
ok(F.choicePrompt(gap).q === 'Which word goes in the gap?', 'gap prompt');
ok(F.whyWrong({ why: 'Because.' }, 'por', 'para') === 'Because.', 'own why wins');
ok(/por or para/i.test(F.whyWrong(gap, 'por', 'para')), 'trap hint when no why');
ok(F.whyWrong({ bankKind: 'read', text: 'x' }, 'a', 'b') === 'Not this one. The sentence needs b.', 'neutral line');
ok(!/[—–]| - /.test(F.whyWrong({ bankKind: 'read' }, 'a', 'b')), 'no dashes');

console.log('test-apply-feedback: ' + n + ' checks passed');
console.log('rules fired:\n  ' + fired.join('\n  '));
