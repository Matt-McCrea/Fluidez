#!/usr/bin/env node
/* ============================================================================
 * check-raw.js — the mechanical checks on a verb-gap source file.
 *
 *   node tools/verbgaps/check-raw.js tools/verbgaps/raw/presubj.json [...]
 *
 * Everything the app's engine can decide: the answer is the form the engine
 * conjugates for that verb, tense and person; every `confuse` tense gives a
 * DIFFERENT form in the same person (so the wrong options are real and
 * distinct); one gap; the infinitive in brackets; no vosotros; the length and
 * dash rules of docs/verb-gaps-spec.md. Whether the sentence DECIDES the
 * answer is not mechanical: blind judges do that afterwards.
 * Exits 1 when any item fails, printing each failure.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '../..');
global.window = global;
require(path.join(ROOT, 'data/verbs.js'));
require(path.join(ROOT, 'js/engine.js'));
const E = window.ENGINE;

const TENSES = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'perfecto', 'plusc', 'futperf',
  'condperf', 'presubj', 'impsubj', 'perfsubj', 'pluscsubj', 'imperativo', 'impneg'];
const PERSON_IX = { 'yo': 0, 'tú': 1, 'él/ella': 2, 'usted': 2, 'nosotros': 3, 'ellos': 5, 'ustedes': 5 };
const IMP_IX = { 'tú': 0, 'usted': 1, 'nosotros': 2, 'ustedes': 4 };
const TENSE_WORDS = /subjuntivo|indicativo|condicional|imperativo|pret[ée]rito|imperfecto|pluscuamperfecto|futuro perfecto|\(subj/i;

function verb(inf) {
  return E.verbByInf(inf) || (/se$/.test(inf) ? E.verbByInf(inf.slice(0, -2)) : null);
}
/* The form for a tense and person, or null. pluscsubj is not one of the
 * engine's tenses: it is haber's imperfect subjunctive plus the participle. */
function form(inf, tense, person) {
  const v = verb(inf);
  if (!v) return null;
  if (tense === 'imperativo' || tense === 'impneg') {
    const i = IMP_IX[person];
    return i == null ? null : (E.conjugate(v, tense) || [])[i] || null;
  }
  const i = PERSON_IX[person];
  if (i == null) return null;
  if (tense === 'pluscsubj') {
    const hab = E.conjugate(E.verbByInf('haber'), 'impsubj')[i];
    return hab ? hab + ' ' + E.participle(v) : null;
  }
  return (E.conjugate(v, tense) || [])[i] || null;
}
/* The form as it fills THIS sentence. A reflexive verb's engine form carries
 * its pronoun (se casó, me había casado); when the sentence already has that
 * pronoun right before the gap ("mi hermano ya se ___ (casar)"), the gap holds
 * the rest, or the sentence would read "se se casó". */
function formIn(it, tense) {
  const f = form(it.inf, tense, it.person);
  if (!f) return f;
  const before = String(it.q || '').split('___')[0].trim().split(/\s+/).pop().toLowerCase();
  const m = /^(me|te|se|nos|os)\s+(.+)$/.exec(f);
  return m && m[1] === before ? m[2] : f;
}
// -ra imperfect subjunctive and its -se twin (hiciera / hiciese, hubiera / hubiese)
function seTwin(f) { return String(f).replace(/(ie|a)ra(s|mos|n)?\b/, '$1se$2').replace(/éramos\b/, 'ésemos').replace(/áramos\b/, 'ásemos'); }

function checkItem(it, i, file) {
  const errs = [];
  const at = `${path.basename(file)}#${i} "${String(it.q || '').slice(0, 60)}"`;
  const need = ['q', 'inf', 'tense', 'person', 'answer', 'confuse', 'why_es', 'why_en', 'en', 'band', 'use'];
  need.forEach(k => { if (it[k] == null || it[k] === '') errs.push('missing ' + k); });
  if (errs.length) return errs.map(e => at + ': ' + e);
  if (TENSES.indexOf(it.tense) === -1) errs.push('unknown tense ' + it.tense);
  if (/vosotr|vuestr/i.test(it.q) || it.person === 'vosotros') errs.push('vosotros');
  const gaps = (it.q.match(/___/g) || []).length;
  if (gaps !== 1) errs.push(gaps + ' gaps');
  if (!new RegExp('___ \\(' + it.inf.replace(/se$/, '(se)?') + '\\)').test(it.q)) errs.push('the gap is not followed by " (' + it.inf + ')"');
  if (/[‐-―]|\s-\s|--/.test(it.q + it.en + it.why_es + it.why_en)) errs.push('dash');
  if (TENSE_WORDS.test(it.q)) errs.push('a tense name in the sentence');
  const n = it.q.replace(/\([^)]*\)/, '').replace(/___/, 'x').trim().split(/\s+/).length;
  if (n < 5 || n > 14) errs.push(n + ' words');
  if (String(it.why_es).length > 110 || String(it.why_en).length > 110) errs.push('why over 110 characters');
  if (!/^(A1|A2|B1|B2|C1)$/.test(it.band)) errs.push('band ' + it.band);
  const right = formIn(it, it.tense);
  if (!right) errs.push('the engine cannot conjugate ' + it.inf + ' / ' + it.tense + ' / ' + it.person);
  else if (it.answer !== right && it.answer !== seTwin(right)) errs.push(`answer "${it.answer}" but the engine says "${right}"`);
  if (!Array.isArray(it.confuse) || it.confuse.length < 2) errs.push('confuse needs 2 to 4 tenses');
  else {
    const seen = [right];
    it.confuse.forEach(t => {
      if (t === it.tense) { errs.push('confuse lists the answer tense'); return; }
      const f = formIn(it, t);
      if (!f) return;                                   // a tense with no form for this person is skipped by the game
      if (seen.indexOf(f) !== -1) errs.push(`confuse ${t} gives "${f}", the same as another option`);
      seen.push(f);
    });
    const wrong = seen.slice(1).filter(f => (it.also || []).indexOf(f) === -1);
    if (wrong.length < 2) errs.push('fewer than two distinct wrong options (after leaving out `also`)');
  }
  return errs.map(e => at + ': ' + e);
}

if (require.main === module) {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('usage: node tools/verbgaps/check-raw.js <file.json> [...]'); process.exit(2); }
  let bad = 0, total = 0;
  files.forEach(f => {
    let list;
    try { list = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { console.error(f + ': not valid JSON: ' + e.message); bad++; return; }
    list.forEach((it, i) => { if (it.drop) return; total++; const e = checkItem(it, i, f); if (e.length) { bad++; e.forEach(x => console.error('  ✗ ' + x)); } });
  });
  console.log(bad ? `❌ ${bad} of ${total} items fail` : `✅ ${total} items pass the mechanical checks`);
  process.exit(bad ? 1 : 0);
}
module.exports = { form, formIn, seTwin, checkItem, TENSES };
