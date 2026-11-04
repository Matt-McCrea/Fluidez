// Noun slots never become verb items. Run: node tools/test-bankitems-nouns.js
const fs = require('fs'), path = require('path'), assert = require('assert');
const root = path.join(__dirname, '..');
global.window = {};
for (const f of ['js/lib.bundle.js', 'data/verbs.js', 'js/engine.js', 'data/vocab.js', 'js/bankitems.js']) {
  new Function(fs.readFileSync(path.join(root, f), 'utf8')).call(global);
}
if (window.LIB === undefined && typeof LIB !== 'undefined') window.LIB = LIB;
const B = window.BankItems;
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const row = (es, span, id) => { const i = es.indexOf(span); return { id, es, en: 'x', a: [], r: [], t: [], f: [i, i + span.length], k: 's', th: 't', d: 0 }; };
const noun = row('El desarrollo urbano crece.', 'desarrollo', 't1');
ok(B.make('cloze', noun) === null, 'el desarrollo urbano became a cloze');
ok(B.make('read', noun) === null && B.readAndPick(noun) === null, 'el desarrollo became read and pick');
const not = row('Fuimos a la notaría ayer.', 'notaría', 't2');
ok(B.cloze(not) === null && B.readAndPick(not) === null, 'notaría became an item');
const verb = row('Ella trabaja en una oficina.', 'trabaja', 't3');
ok(B.cloze(verb) && B.cloze(verb).inf === 'trabajar', 'a real verb span stopped working');
console.log('bankitems nouns: ' + n + ' checks passed');
