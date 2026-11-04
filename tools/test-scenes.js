/* Node test for js/scenes.js. Run: node tools/test-scenes.js
 * pick respects review, legal day, known nodes and the 30 day ledger; turns
 * follow `next`; grade accepts an accept line and a constraint-passing line and
 * rejects an empty one. */
'use strict';
const fs = require('fs'), path = require('path');
global.window = {};
function load(rel) { (0, eval)(fs.readFileSync(path.join(__dirname, '..', rel), 'utf8')); }
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'js/engine.js', 'js/checker.js',
 'js/lib.bundle.js', 'js/scenes.js', 'data/scenes/a1.js'].forEach(load);
const S = window.Scenes;
let errors = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { errors++; console.error('  x ' + m); } }

// pick: a stub Known so the rule is exercised without the whole graph
window.REQUIRES = {};
window.Known = { allows(key, known) { return window.REQUIRES[key].r.every(id => known.has(id)); } };
const mk = (id, o) => Object.assign({ id, band: 'T', title: id, brief: '', turns: [], r: [], d: 5 }, o);
window.SCENES_T = [
  mk('rev', { review: true }),
  mk('never', { d: null }),
  mk('future', { d: 50 }),
  mk('needs', { r: ['g:x1'] }),
  mk('lex', { r: ['l:hola'] }),
  mk('today', { r: ['g:x2'], d: 3 }),
  mk('old', { d: 1 })
];
const known = new Set(['g:x2']);
const names = [];
let seen = {};
for (let i = 0; i < 7; i++) {
  const p = S.pick(known, 10, 'T', seen, { today: new Set(['g:x2']), day: 100 });
  if (!p) break;
  names.push(p.id); seen['scene:' + p.id] = 100;
}
ok(names[0] === 'today', 'prefers scenes using today\'s nodes: ' + names);
ok(names.indexOf('rev') < 0 && names.indexOf('never') < 0, 'review and null-day scenes never picked');
ok(names.indexOf('future') < 0, 'a scene after today is not picked');
ok(names.indexOf('needs') < 0, 'a scene with an unknown g: node is not picked');
ok(names.indexOf('lex') >= 0 && names.indexOf('old') >= 0, 'lexeme requires do not block');
ok(S.pick(known, 10, 'T', seen, { day: 120 }) === null, 'nothing within 30 days of the ledger');
ok(S.pick(known, 10, 'T', seen, { day: 131 }) !== null, 'served again after 30 days');
ok(S.pick(new Set(['g:x1', 'g:x2']), 10, 'T', {}, { day: 1 }) !== null && S.pick(new Set(['g:x1']), 0, 'T', {}, { day: 1 }) === null, 'legal day gates');

// turns follow next
const sc = { turns: [{ id: 'a', next: 'c' }, { id: 'b', next: null }, { id: 'c', next: 'b' }] };
ok(S.turns(sc).map(t => t.id).join('') === 'acb', 'walk follows next');
ok(S.turns({ turns: [{ id: 'a', next: 'a' }] }).length === 1, 'a loop ends');

// real data: every playable scene walks to its end, grade accepts its own accepts
const real = window.SCENES_A1;
ok(real.length > 0, 'A1 scenes loaded');
real.filter(s => !s.review).forEach(s => {
  const ts = S.turns(s);
  ok(ts.length === s.turns.length, s.id + ': every turn reachable via next');
});
const t1 = real.filter(s => !s.review)[0].turns[0];
ok(S.grade(t1, t1.accept[0]).pass === true, 'an accept line passes');
ok(S.grade(t1, '').pass === false && S.grade(t1, '   ').pass === false, 'empty is rejected');
ok(S.grade(t1, 'zzz qqq').pass === false, 'nonsense is rejected');
const ct = { intent: 'Say you eat', accept: ['Yo como arroz.'], require: [{ type: 'verbFormAny', inf: 'beber', tense: 'presente' }] };
ok(S.grade(ct, 'Bebo agua con hielo').pass === true, 'a constraint-passing line passes');
ok(S.grade(ct, 'Agua con hielo').pass === false, 'a constraint-failing, non-matching line fails');

// shouldPlay
ok(S.shouldPlay({ practice: true }, 5, null) && S.shouldPlay({ lesson: 'task-x' }, 5, null), 'practice and task days');
ok(S.shouldPlay({ lesson: 'l' }, 13, { from: 10 }) && !S.shouldPlay({ lesson: 'l' }, 12, { from: 10 }), 'every fourth lesson day');

console.log('Checks run: ' + checks);
if (errors) { console.error(errors + ' problem(s).'); process.exit(1); }
console.log('Scenes OK.');
