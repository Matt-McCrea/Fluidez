// Stage 1b checks: accent-sensitive passage matching, dash rendering, adjective display.
// Run: node tools/test-stage1b.js
const fs = require('fs'), path = require('path'), assert = require('assert');
global.window = {};
for (const f of ['js/lexmatch.js', 'data/vocab.js', 'data/apply.js']) {
  new Function(fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).call(global);
}
const LM = window.LexMatch;
let n = 0; const ok = (c, m) => { assert(c, m); n++; };

// carné must not yield carne
ok(!LM.index('Necesito mi carné para entrar.').has('la carne'), 'carné matched carne');
ok(LM.index('Me gusta la carne con arroz.').has('la carne'), 'carne not found in own text');
ok(LM.index('Compré dos carnes.').has('la carne'), 'plural carnes not found');
ok(!LM.index('Mi carne es buena.').has('el carné'), 'carne matched carné');
ok(LM.index('Tengo el carné.').has('el carné'), 'carné not found');

// adjectives lose their article for display; nouns keep theirs
ok(LM.shown('el simpático') === 'simpático', 'simpático');
ok(LM.shown('el primer') === 'primer', 'primer');
ok(LM.shown('la carne') === 'la carne', 'noun kept');
ok(window.VOCAB_ADJECTIVES.every(a => window.VOCAB.some(w => w.es === a)), 'listed adjective missing from VOCAB');

// UI dash helper (pure parts, loaded with a stub document)
global.document = { createElement: () => ({ style: {}, appendChild() {}, addEventListener() {} }) };
new Function(fs.readFileSync(path.join(__dirname, '..', 'js/ui.js'), 'utf8')).call(global);
const UI = window.UI;
ok(UI.optLabel('—') === '(nothing)' && UI.optLabel('-') === '(nothing)' && UI.optLabel('que') === 'que', 'optLabel');
ok(UI.isNothing('—') && !UI.isNothing('a'), 'isNothing');
const dashItems = window.APPLY_ITEMS.filter(i => i.type === 'choice' && i.options.some(UI.isNothing));
ok(dashItems.length >= 2, 'expected dash choice items');
console.log('stage1b: ' + n + ' checks passed');
