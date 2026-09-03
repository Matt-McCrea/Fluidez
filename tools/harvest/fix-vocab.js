#!/usr/bin/env node
/* ============================================================================
 * fix-vocab.js — restore what the vocabulary generation dropped.
 *
 *   node tools/harvest/fix-vocab.js [--write]
 *
 * Two defects, both from the schema rather than from the writing:
 *
 * 1. COLLOCATIONS. build-vocab.js derives ~2,100 of them from the PCIC's "~"
 *    notation, and none reached data/vocab.js because the schema had no field
 *    for them. Collocation IS the unit of advanced vocabulary — "desempeñar un
 *    cargo directivo" is one item to learn, not three words — so losing them
 *    guts the B2/C1 half of the lexicon.
 *
 * 2. ARTICLES. data/vocab.js says nouns carry their article "so gender is
 *    learned with the word", but 368 generated nouns have none. Where the
 *    derivation resolved gender, the article is restored.
 *
 * Only singular nouns with resolved gender are touched: a plural would need
 * los/las and the derivation does not distinguish reliably, so those are left
 * alone and reported. Prints a summary; pass --write to apply.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const WRITE = process.argv.indexOf('--write') !== -1;

const queue = require(path.join(ROOT, 'spec', 'vocab-queue.json'));
const byEs = new Map();
queue.entries.forEach(e => byEs.set(e.es, e));

const file = path.join(ROOT, 'data', 'vocab.js');
const lines = fs.readFileSync(file, 'utf8').split('\n');

const strip = s => String(s).replace(/^(el|la|los|las) /, '');
const hasArticle = s => /^(el|la|los|las) /.test(s);
// nouns that end in -s in the singular (crisis, análisis) must not be pluralised
const singularS = /(sis|tis|us)$/;

const existing = new Set();
lines.forEach(l => { const m = l.match(/^\{es:'([^']+)'/); if (m) existing.add(m[1]); });

let addedColl = 0, addedArt = 0, skippedPlural = 0, skippedDup = 0, noGender = 0;
const out = lines.map(line => {
  const m = line.match(/^\{es:'([^']+)'/);
  if (!m || line.indexOf('cefr:') === -1) return line;
  let obj;
  try { obj = eval('(' + line.replace(/,\s*$/, '') + ')'); } catch (e) { return line; }
  const q = byEs.get(strip(obj.es)) || byEs.get(obj.es);
  if (!q) return line;

  // refresh rather than only fill, so a corrected derivation replaces a stale one
  const want = (q.collocations || []).slice(0, 6);
  const have = obj.collocations || [];
  if (want.join('|') !== have.join('|')) {
    if (want.length) obj.collocations = want; else delete obj.collocations;
    addedColl++;
  }
  if (q.pos === 'noun' && !hasArticle(obj.es)) {
    if (!q.gender || q.gender === 'c') noGender++;
    else if (/s$/.test(obj.es) && !singularS.test(obj.es)) skippedPlural++;
    else {
      const art = q.gender === 'm' ? 'el ' : 'la ';
      if (existing.has(art + obj.es)) skippedDup++;
      else { existing.add(art + obj.es); obj.es = art + obj.es; obj.gender = q.gender; addedArt++; }
    }
  } else if (q.pos === 'noun' && hasArticle(obj.es) && !obj.gender) {
    obj.gender = /^(el|los) /.test(obj.es) ? 'm' : 'f';
  }

  const q2 = s => "'" + String(s).replace(/'/g, "\\'") + "'";
  let s = '{es:' + q2(obj.es) + ', en:' + q2(obj.en) + ', cat:' + q2(obj.cat) +
          ', cefr:' + q2(obj.cefr) + ', theme:' + q2(obj.theme);
  if (obj.gender) s += ', gender:' + q2(obj.gender);
  s += ', pcic:' + JSON.stringify(obj.pcic);
  if (obj.collocations) s += ', collocations:' + JSON.stringify(obj.collocations);
  return s + '},';
});

console.log(`collocation sets written/refreshed : ${addedColl}`);
console.log(`articles added        : ${addedArt}`);
console.log(`left alone — plural   : ${skippedPlural}`);
console.log(`left alone — no gender: ${noGender}`);
console.log(`left alone — would duplicate an existing entry: ${skippedDup}`);
if (WRITE) { fs.writeFileSync(file, out.join('\n')); console.log('\n→ data/vocab.js written'); }
else console.log('\n(dry run — pass --write to apply)');
