#!/usr/bin/env node
/* ============================================================================
 * find-homographs.js — which words in the corpus are read as verbs but sit in
 * a noun slot (directly after an article, possessive or demonstrative)?
 *
 *   node tools/find-homographs.js
 *
 * Use it when validate-content.js reports a level violation on a word that is
 * obviously a noun. Anything listed here that is a GENUINE noun belongs in
 * NOUN_HOMOGRAPHS in tools/validate-content.js; anything that is a real verb
 * (la había comido, las pusieron) must be left out so it stays gated.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
global.window = {};
const load = rel => (0, eval)(fs.readFileSync(path.join(__dirname, '..', rel), 'utf8'));
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/passages.js', 'data/writing.js',
 'data/topics.js', 'data/apply.js', 'js/engine.js'].forEach(load);
const E = window.ENGINE;

const DETERMINERS = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'vuestro', 'vuestra', 'vuestros', 'vuestras', 'este', 'esta', 'estos', 'estas',
  'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas']);

const hits = {};
function scan(text) {
  if (!text) return;
  const t = E.tokenize(text);
  t.forEach((tk, i) => {
    if (i === 0 || !DETERMINERS.has(t[i - 1])) return;
    const a = E.analyzeToken(tk);
    if (!a.length) return;
    const h = hits[tk] = hits[tk] || { n: 0, ctx: new Set(), infs: new Set() };
    h.n++; h.ctx.add(t[i - 1] + ' ' + tk);
    a.forEach(x => h.infs.add(x.inf + ':' + x.tense));
  });
}
(window.PASSAGES || []).forEach(p => { scan(p.text); (p.questions || []).forEach(q => scan(q.q || q.line)); });
(window.WRITING_TASKS || []).forEach(w => { (w.models || []).forEach(scan); scan(w.answer); });
(window.TOPICS || []).forEach(t => t.prompts.forEach(p => (p.models || []).forEach(scan)));
(window.APPLY_ITEMS || []).forEach(a => { scan(a.text); scan(a.from); scan(a.to); });

const rows = Object.entries(hits).sort((a, b) => b[1].n - a[1].n);
console.log(rows.length + ' determiner + verb-form collisions\n');
rows.forEach(([w, h]) => console.log(
  String(h.n).padStart(4) + '  ' + w.padEnd(14) +
  [...h.ctx].slice(0, 2).join(' | ').padEnd(30) + '  ' + [...h.infs].slice(0, 3).join(', ')));
