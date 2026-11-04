// Gloss resolution over real data, and the daily save cap. Run: node tools/test-gloss.js
'use strict';
const fs = require('fs'), path = require('path');
let store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.window = global;
global.document = { createElement: () => ({ style: {}, appendChild() {}, addEventListener() {}, classList: { add() {}, remove() {} } }) };
// run as classic scripts, so the bundle's top-level `var LIB` lands on the global like it does in a browser
function load(rel) { require('vm').runInThisContext(fs.readFileSync(path.join(__dirname, '..', rel), 'utf8'), { filename: rel }); }
['data/verbs.js', 'data/vocab.js', 'data/passages.js', 'js/lib.bundle.js', 'js/engine.js', 'js/gloss.js'].forEach(load);

let n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.error('  FAIL ' + m); } }
const G = window.Gloss;
ok(G && window.LIB && window.LIB.gloss, 'Gloss and LIB.gloss load');

// a verb form: lemma, meaning, person and tense
let g = G.resolve('pudimos', {});
ok(g && g.es === 'poder' && /we/.test(g.how || '') && /(past|preterite)/i.test(g.how || ''), 'pudimos -> poder, we, past: ' + JSON.stringify(g));
// a plural noun reads back to its singular
const lex = G.lexemes();
const noun = lex.find(l => /^la /.test(l.es) && !/s$/.test(l.es) && /a$/.test(l.es));
g = G.resolve(noun.es.replace(/^la /, '') + 's', {});
ok(g && g.en === noun.en, 'plural of "' + noun.es + '" resolves: ' + JSON.stringify(g));
// a glossed phrase: the passage's own note wins, and a word inside it reports the phrase
const gloss = [{ es: 'tener ganas de', en: 'to feel like' }, { es: 'hasta luego', en: 'see you later' }];
g = G.resolve('luego', { gloss, at: { line: 'Hasta luego, amigo', index: 1 } });
ok(g && g.phrase && g.phrase.en === 'see you later' || (g && g.en === 'see you later'), 'phrase note: ' + JSON.stringify(g));
g = G.resolve('ganas', { gloss: [{ es: 'ganas', en: 'desire' }] });
ok(g && g.en === 'desire', 'own single-word note first');
// a name
const text = 'Hoy vamos al parque.\nTomás: Hola, Valentina.';
const names = G.namesOf(text);
ok(names.has('tomás') && names.has('valentina'), 'names found: ' + [...names]);
g = G.resolve('Valentina', { names });
ok(g && g.name === true, 'Valentina is a name: ' + JSON.stringify(g));
ok(!names.has('hoy'), 'sentence-initial word is not a name');

// over a real passage: most words resolve
const p = window.PASSAGES.find(x => x.text.length > 150);
const toks = p.text.match(/\p{L}+/gu), nm = G.namesOf(p.text);
const hit = toks.filter(t => G.resolve(t, { gloss: p.gloss, names: nm })).length;
ok(hit / toks.length > 0.6, `passage ${p.id}: ${hit}/${toks.length} words resolve`);

// the save cap: 3 a day, keyed by day, reset by the next day
let added = 0;
window.UserWords = { addChip() { const b = { textContent: '', click() { added++; b.textContent = '✓ añadida'; } }; return b; } };
window.SRS = { today: () => 20000 };
ok(G.canSave(), 'can save at start');
ok(G.save('perro', 'dog') && G.save('gato', 'cat') && G.save('casa', 'house'), 'three saves work');
ok(!G.canSave() && !G.save('mesa', 'table'), 'fourth is refused');
ok(added === 3, 'addChip used exactly 3 times, got ' + added);
ok(JSON.parse(store['fluidez.progress']).savesToday['20000'] === 3, 'savesToday keyed by day');
window.SRS = { today: () => 20001 };
ok(G.canSave() && G.save('mesa', 'table'), 'next day resets');
ok(Object.keys(JSON.parse(store['fluidez.progress']).savesToday).join() === '20001', 'old days dropped');

console.log(bad ? `${bad} of ${n} checks FAILED` : `gloss: ${n} checks passed`);
process.exit(bad ? 1 : 0);
