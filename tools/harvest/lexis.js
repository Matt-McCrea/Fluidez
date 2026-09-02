/* ============================================================================
 * lexis.js — turn a PCIC "nociones específicas" entry into headwords.
 *
 * The inventory is written in a compressed notation that has to be expanded
 * before any of it can become vocabulary:
 *
 *   "asalariado, operario"                    -> two headwords
 *   "pluralidad/diversidad/identidad"         -> three headwords
 *   "(con)federación"                         -> confederación, federación
 *   "trabajador ~ de la construcción"         -> headword + a collocation
 *   "el bolso [España] / la bolsa [México]"   -> regional variants, notes dropped
 *
 * The "~" is the important one: it marks a COLLOCATION, which is what advanced
 * vocabulary actually consists of. `collocations()` keeps those intact rather
 * than flattening them to their headword.
 * ========================================================================== */
'use strict';

const ARTICLES = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'al', 'del', 'de', 'a']);

const stripNotes = s => String(s)
  .replace(/\[[^\]]*\]/g, ' ')            // [España], [Hispanoamérica]
  .replace(/\([^)]*\)/g, m => m)          // parentheses handled below
  .replace(/\s+/g, ' ').trim();

/* "(con)federación" -> ["confederación", "federación"]; otherwise strips a
 * trailing gloss in parentheses. */
function expandParens(w) {
  const m = w.match(/^\(([^)]+)\)(\S+)$/);
  if (m) return [m[1] + m[2], m[2]];
  return [w.replace(/\s*\([^)]*\)/g, '').trim()];
}

function clean(w) {
  let c = w.toLowerCase().replace(/\//g, ' ').replace(/\s+/g, ' ')
    .replace(/^[¿¡"'\s]+|[.,;:!?"'\s]+$/g, '').trim();
  // "el / la guía" collapses to "el la guía" — strip the stacked articles
  let prev;
  do { prev = c; c = c.replace(/^(el|la|los|las|un|una|unos|unas)\s+/, ''); } while (c !== prev);
  return c.trim();
}

/* Every headword in one spec entry. */
function headwords(pattern) {
  const head = String(pattern).split('~')[0];       // drop the collocation tail
  const out = [];
  stripNotes(head).split(/[;,]/).forEach(chunk => {
    // a "/" separates alternatives ONLY when both sides are real words —
    // "el / la guía" is one noun with two articles, not two headwords
    const parts = chunk.split('/').map(s => s.trim()).filter(Boolean);
    const alts = parts.length > 1 && parts.every(p => !ARTICLES.has(clean(p)) && clean(p).length > 2)
      ? parts : [chunk];
    alts.forEach(a => expandParens(a.trim()).forEach(w => {
      const c = clean(w);
      if (c && c.length > 1 && c.split(/\s+/).length <= 4 && !ARTICLES.has(c)) out.push(c);
    }));
  });
  return [...new Set(out)];
}

/* Collocations, kept whole: "ocupar ~ un cargo/un puesto" -> ["ocupar un cargo",
 * "ocupar un puesto"]. Returns [] for entries that are plain headwords. */
function collocations(pattern) {
  const p = String(pattern);
  if (p.indexOf('~') < 0) return [];
  const segs = stripNotes(p).split('~').map(s => s.trim()).filter(Boolean);
  if (segs.length < 2) return [];
  let combos = [segs[0]];
  segs.slice(1).forEach(seg => {
    const alts = seg.split('/').map(s => s.trim()).filter(Boolean);
    const next = [];
    combos.forEach(c => alts.forEach(a => next.push((c + ' ' + a).replace(/\s+/g, ' ').trim())));
    combos = next.slice(0, 12);                     // guard against a blow-up
  });
  return [...new Set(combos.filter(c => c.split(/\s+/).length <= 6))];
}

module.exports = { headwords, collocations };
