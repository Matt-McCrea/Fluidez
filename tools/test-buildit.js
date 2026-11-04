/* Node test for js/buildit.js. Run: node tools/test-buildit.js
 * Chains have 3 steps with distinct Spanish; every verb change is one the engine
 * confirms (analyzeToken reads the new form as the expected tense and person) and
 * its English is enPhrase's; negation adds "no" and a not in the English; the
 * pronoun change moves the article phrase to lo/la before the verb; the about-me
 * store round-trips, dedupes by unit day and enrols a card; the constraint is
 * built from the unit's node. */
'use strict';
const fs = require('fs'), path = require('path');
const store = {};
global.window = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
function load(rel) { (0, eval)(fs.readFileSync(path.join(__dirname, '..', rel), 'utf8')); }
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'js/engine.js', 'js/checker.js', 'js/bankitems.js', 'js/buildit.js'].forEach(load);
const E = window.ENGINE, B = window.BuildIt;
let errors = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { errors++; console.error('  x ' + m); } }

// fixture: graph, bank and a known set
window.GRAPH = { nodes: [
  { id: 'g:t1', kind: 'grammar', band: 'A1', title: 't1' },
  { id: 'g:preterite-ar', kind: 'grammar', band: 'A1', title: 'pret' },
  { id: 'l:café', kind: 'lexeme', band: 'A1', es: 'el café', en: 'coffee' },
  { id: 'l:pan', kind: 'lexeme', band: 'A1', es: 'el pan', en: 'bread' },
  { id: 'c:me-llamo', kind: 'chunk', band: 'A1', es: 'Me llamo', en: 'My name is', forms: [{ es: 'Me llamo', en: 'My name is' }, { es: 'Soy', en: 'I am' }] }
] };
const row = (id, es, en, f) => ({ id, es, en, a: [], r: [], t: ['g:t1'], f, k: 'statement', th: 'x', d: 0 });
window.BANK_A1 = [
  row('f1', 'Quiero el café.', 'I want the coffee.', [0, 6]),
  row('f2', 'Compro el pan hoy.', 'I buy the bread today.', [0, 6]),
  row('f3', 'Estudio español ahora.', 'I study Spanish now.', [0, 7]),
  row('f4', 'Comemos pan.', 'We eat bread.', [0, 7]),
  row('f5', 'Estudio mucho español.', 'I study a lot of Spanish.', [0, 7]),
  row('f6', 'Hola, soy Ana.', 'Hi, I am Ana.', [6, 9]),
  row('f7', 'Compro pan y como queso.', 'I buy bread and I eat cheese.', [0, 6])
];
window.BankItems.install('A1');
const known = new Set(['g:t1', 'g:preterite-ar', 'l:café', 'l:pan']);
const today = new Set(['g:t1']);

function rngOf(seed) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
const PERSONS = E.personsFor('presente');
function readsAs(token, inf, tense, idx) {
  return (E.analyzeToken(token.toLowerCase()) || []).some(a => a.inf === inf && a.tense === tense && PERSONS.indexOf(a.person) === idx);
}

const kinds = {};
let chains = 0, example = [];
for (let seed = 1; seed <= 60; seed++) {
  const out = B.prompts(known, today, 3, rngOf(seed), { band: 'A1' });
  out.forEach(ch => {
    chains++;
    ok(ch.steps.length === 3, 'chain has 3 steps');
    const es = ch.steps.map(s => s.es);
    ok(new Set(es).size === 3, 'steps are distinct: ' + es.join(' | '));
    ok(ch.steps[0].change === null && ch.steps[1].change && ch.steps[2].change, 'step 1 is the row, 2 and 3 carry a change');
    ok(ch.steps.every(s => s.en && s.es && Array.isArray(s.from) && s.from.length), 'every step has en, es, from');
    if (example.length < 2 && seed % 7 === 0) example.push(ch);
    const base = window.BANK_A1.filter(r => r.id === ch.rowId)[0];
    ok(base && base.es === es[0], 'step 1 is the bank row');
    ok(es[0].split(/\s+/).length >= 3 && es[0].split(/\s+/).length <= 6, 'row is 3 to 6 words');
    // walk the changes
    const inf = (E.analyzeToken(es[0].split(/\s+/)[0].toLowerCase().replace(/[^a-zñáéíóú]/g, '')).filter(a => a.tense === 'presente')[0] || {}).inf;
    ok(!!inf, 'the base verb reads as a present form');
    for (let k = 1; k < 3; k++) {
      const s = ch.steps[k];
      kinds[s.change] = (kinds[s.change] || 0) + 1;
      const words = s.es.replace(/[.!]$/, '').split(/\s+/).map(w => w.toLowerCase());
      if (s.change === 'person') {
        const form = s.form;
        const tense = /(é|aste|ó|amos|aron|ió|iste|imos|ieron)$/.test(form) && !readsAs(form, inf, 'presente', PERSONS.findIndex((p, i) => readsAs(form, inf, 'presente', i))) ? 'preterito' : 'presente';
        let found = false;
        PERSONS.forEach((p, i) => { if (readsAs(form, inf, tense, i)) { found = true; const ph = E.enPhrase(E.verbByInf(inf), tense, i).text.toLowerCase(), neg = ch.steps.slice(0, k + 1).some(x => x.change === 'neg');
          // after a negation the phrase is subject + don't + base, so the subject is what enPhrase fixes
          ok(neg ? s.en.toLowerCase().indexOf(ph.split(' ')[0]) === 0 : s.en.toLowerCase().indexOf(ph) === 0, 'person English is enPhrase: ' + s.en + ' / ' + ph); } });
        ok(found && words.indexOf(form.toLowerCase()) >= 0, 'engine confirms the person form ' + form);
      } else if (s.change === 'tense') {
        ok(readsAs(s.form, inf, 'preterito', PERSONS.findIndex((p, i) => readsAs(s.form, inf, 'preterito', i))), 'engine confirms the preterite ' + s.form);
      } else if (s.change === 'neg') {
        ok(words.indexOf('no') >= 0, 'negation adds no: ' + s.es);
        ok(/(\bnot\b|n't\b)/.test(s.en), 'negation English has a not: ' + s.en);
        ok(words.indexOf(s.form.toLowerCase()) === words.indexOf('no') + 1 || words.indexOf(s.form.toLowerCase()) === words.indexOf('no') + 2, 'no sits before the verb');
      } else if (s.change === 'pronoun') {
        ok(/\b(lo|la|los|las)\b/i.test(s.es) && !/\b(el|un) (café|pan)\b/.test(s.es), 'noun phrase became a clitic: ' + s.es);
        ok(/\b(it|them)\b/.test(s.en), 'pronoun English says it or them: ' + s.en);
      }
    }
  });
}
ok(chains > 20, 'chains were built: ' + chains);
['person', 'neg'].forEach(k => ok(kinds[k] > 0, 'change seen: ' + k));
ok(kinds.tense > 0, 'tense change seen (preterite-ar known)');
ok(kinds.pronoun > 0, 'pronoun change seen');
// rows with a second verb, a comma, or a clash are never built
const all = []; for (let s = 1; s < 30; s++) B.prompts(known, today, 3, rngOf(s), { band: 'A1' }).forEach(c => all.push(c.rowId));
ok(all.indexOf('f6') < 0 && all.indexOf('f7') < 0, 'a stated subject or a second verb excludes the row');
// the tense change needs the preterite lesson known
const none = new Set(['g:t1', 'l:café', 'l:pan']);
let sawTense = false; for (let s = 1; s < 40; s++) B.prompts(none, today, 3, rngOf(s), { band: 'A1' }).forEach(c => c.steps.forEach(st => { if (st.change === 'tense') sawTense = true; }));
ok(!sawTense, 'no tense change before the preterite is known');
// the lead line
ok(B.lead({ from: ['quiero', 'comer'] }) === 'You know *quiero* and *comer*.', 'lead line: ' + B.lead({ from: ['quiero', 'comer'] }));

// about-me store
const enrolled = [];
window.SRS = { enrol: id => enrolled.push(id) };
ok(B.count() === 0, 'empty script');
const n0 = B.add({ unit: 'a1-u02', es: 'Suelo almorzar en casa.', en: 'I usually eat lunch at home.', p: 'where you eat lunch', day: 7 });
const n1 = B.add({ unit: 'a1-u02', es: 'Otra', en: '', day: 11 });
ok(n0 === 0 && n1 === 1, 'lines are indexed in order');
ok(B.add({ unit: 'a1-u02', es: 'Repetida', en: '', day: 7 }) === 0 && B.count() === 2, 'one line per unit day');
ok(enrolled.join() === 'k:aboutme:0,k:aboutme:1', 'cards enrolled: ' + enrolled);
ok(JSON.parse(store['fluidez.aboutme'])[0].es === 'Suelo almorzar en casa.', 'stored in fluidez.aboutme');
ok(B.edit(0, 'Suelo almorzar con mi familia.', 'I usually eat lunch with my family.') && B.load()[0].en.indexOf('family') > 0, 'edit round-trips');
ok(!B.edit(0, '   '), 'an empty edit is refused');
const cs = B.cards();
ok(cs[0].id === 'k:aboutme:0' && cs[0].front === 'I usually eat lunch with my family.' && cs[0].back === 'Suelo almorzar con mi familia.', 'card: english front, own Spanish back');
ok(cs[1].front === 'A true line about you', 'blank English falls back to a prompt');
ok(B.has('a1-u02', 7) && !B.has('a1-u03', 7), 'has');

// constraint from the unit's node
let c = B.constraint(new Set(['g:t1', 'c:me-llamo']));
ok(c.constraints[0].type === 'containsAny' && /me llamo/.test(c.text), 'chunk -> containsAny: ' + c.text);
ok(window.Checker.checkWriting({ type: 'scene', constraints: c.constraints }, 'Me llamo Ana y vivo aqui.').allPass, 'checker passes a line with the chunk');
ok(!window.Checker.checkWriting({ type: 'scene', constraints: c.constraints }, 'Vivo aqui.').allPass, 'checker fails a line without it');
c = B.constraint(new Set(['g:preterite-ar']));
ok(c.constraints[0].type === 'anyVerbInTense' && c.constraints[0].tense === 'preterito', 'tense lesson -> anyVerbInTense');
ok(window.Checker.checkWriting({ type: 'scene', constraints: c.constraints }, 'Ayer hablé con mi madre.').allPass, 'checker passes a preterite line');
c = B.constraint(new Set(['g:t1']));
ok(c.constraints[0].type === 'minWords' && c.constraints[0].n === 6, 'otherwise six words');

console.log('example chains:');
example.forEach(ch => console.log(JSON.stringify(ch.steps.map(s => ({ change: s.change, es: s.es, en: s.en, from: s.from })), null, 1)));
console.log(errors ? errors + ' failure(s) in ' + checks + ' checks' : 'ok: ' + checks + ' checks');
process.exit(errors ? 1 : 0);
