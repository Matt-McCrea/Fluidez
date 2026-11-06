#!/usr/bin/env node
/* ============================================================================
 * build-verb-gaps.js — the Verbos sentence bank, compiled for the arcade.
 *
 *   node tools/build-verb-gaps.js           write data/verb-gaps.js
 *   node tools/build-verb-gaps.js --check   exit 1 if data/verb-gaps.js is stale
 *
 * SOURCES. tools/verbgaps/raw/<tense>.json (one file per tense, written by
 * hand or by batch generation; format and rules in docs/verb-gaps-spec.md) and,
 * if present, tools/verbgaps/judged.json: the verdicts of the blind-judge review,
 *   { "<q>": { "drop": true } | { "replace": { ...fields } } }.
 *
 * THE CHECKS. Every item goes through checkItem (tools/verbgaps/check-raw.js):
 * the answer is the engine's own form, every `confuse` tense gives a different
 * form, one gap, no vosotros, length, no dashes, no tense names, why under 110
 * characters. A failing item is DROPPED and listed, never patched. Exact and
 * near duplicates (the same sentence once the gap is ignored) are dropped too,
 * the first one wins.
 *
 * WHAT IT WRITES. window.VERB_GAPS = [ { q, i, t, p, a, o, x?, w, we, e, b } ]:
 *   q sentence with ___ and "(infinitive)", i infinitive, t tense, p person,
 *   a answer, o the options (answer plus the same person's forms of the
 *   `confuse` tenses, at most 4), x extra accepted forms when typed (the -se
 *   twin of the imperfect subjunctive), w / we the reason in Spanish / English,
 *   e the English sentence, b the band. The `use` note is not shipped.
 * Items are ordered by tense, then by source order, so a rebuild is stable.
 * It also writes tools/verbgaps/report.md (counts per tense and band).
 * Only the arcade loads the file (juegos/index.html); the main app does not.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const { form, formIn, seTwin, checkItem, TENSES } = require('./verbgaps/check-raw.js');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/verb-gaps.js');
const REPORT = path.join(ROOT, 'tools/verbgaps/report.md');
const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const ri = process.argv.indexOf('--raw');
const RAW_DIR = ri !== -1 ? path.resolve(process.argv[ri + 1]) : path.join(ROOT, 'tools/verbgaps/raw');
const CHECK = process.argv.indexOf('--check') !== -1;

function norm(q) {
  return q.replace(/___\s*\([^)]*\)/, '_').toLowerCase().replace(/[^a-zñáéíóúü_\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function build() {
  const files = fs.existsSync(RAW_DIR) ? fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.json')).sort() : [];
  const judged = fs.existsSync(path.join(ROOT, 'tools/verbgaps/judged.json'))
    ? JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/verbgaps/judged.json'), 'utf8')) : {};
  const drops = [], seen = new Map(), items = [];
  let read = 0;
  files.forEach(f => {
    let list;
    try { list = JSON.parse(fs.readFileSync(path.join(RAW_DIR, f), 'utf8')); }
    catch (e) { drops.push(`${f}: not valid JSON (${e.message}), whole file skipped`); return; }
    if (!Array.isArray(list)) { drops.push(`${f}: not an array, skipped`); return; }
    list.forEach((raw, i) => {
      read++;
      let it = raw;
      const at = `${f}#${i}`;
      const j = it && judged[it.q];
      if ((j && j.drop) || (it && it.drop)) { drops.push(`${at}: dropped by review`); return; }
      if (j && j.replace) it = Object.assign({}, it, j.replace);
      const errs = checkItem(it, i, f);
      if (errs.length) { errs.forEach(e => drops.push(e.replace(/^[^:]*#\d+ "[^"]*": /, at + ': '))); return; }
      const k = norm(it.q);
      if (seen.has(k)) { drops.push(`${at}: duplicate of ${seen.get(k)}: "${it.q.slice(0, 60)}"`); return; }
      seen.set(k, at);
      const right = formIn(it, it.tense);
      const opts = [right];
      /* `also`: forms a native would ALSO say here (the blind review found
       * them: the Latin American preterite after alguna vez, ojalá with
       * either subjunctive). They are never offered as a wrong option, and
       * typed they count as right. */
      const also = (it.also || []).filter(Boolean);
      it.confuse.forEach(t => {
        const g = formIn(it, t);
        if (g && opts.indexOf(g) === -1 && also.indexOf(g) === -1 && opts.length < 4) opts.push(g);
      });
      const out = { q: it.q, i: it.inf, t: it.tense, p: it.person, a: right, o: opts };
      const x = also.slice();
      if (it.tense === 'impsubj' || it.tense === 'pluscsubj') {
        const tw = seTwin(right);
        if (tw !== right) x.push(tw);
      }
      if (x.length) out.x = x.filter((f, n) => x.indexOf(f) === n);
      out.w = it.why_es; out.we = it.why_en; out.e = it.en; out.b = it.band;
      items.push(out);
    });
  });
  const order = t => TENSES.indexOf(t);
  items.forEach((x, n) => { x._n = n; });
  items.sort((a, b) => order(a.t) - order(b.t) || a._n - b._n);
  items.forEach(x => { delete x._n; });
  return { items, drops, read, files };
}

function counts(items) {
  const rows = TENSES.map(t => {
    const r = { t, n: 0 }; BANDS.forEach(b => { r[b] = 0; });
    items.forEach(x => { if (x.t === t) { r.n++; r[x.b]++; } });
    return r;
  });
  return rows;
}

function render(items) {
  const head = `/* ============================================================================
 * VERB GAPS — GENERATED. Do not edit by hand.
 *
 *   node tools/build-verb-gaps.js
 *
 * The Verbos sentence bank for the Juegos arcade: a Spanish sentence with one
 * verb form missing, whose trigger alone decides the answer. Keys: q sentence
 * ("___ (infinitive)"), i infinitive, t tense, p person, a answer, o options
 * (the answer plus the same person's forms of tenses a learner confuses it
 * with, at most 4), x extra accepted forms when typed, w / we why in Spanish
 * and English, e the English sentence, b band.
 *
 * SOURCES. tools/verbgaps/raw/*.json (format and rules: docs/verb-gaps-spec.md),
 * tools/verbgaps/judged.json when present (the blind-judge verdicts).
 * CHECKS. tools/verbgaps/check-raw.js: the engine's own form is the answer,
 * the confusions are real and distinct, one gap, no vosotros, 5 to 14 words,
 * no dashes, no tense names, why under 110 characters; failing items are
 * dropped, duplicates too. npm run gate then lints the sentences.
 * REBUILD. node tools/build-verb-gaps.js (tools/validate-content.js fails
 * when this file is stale). ${items.length} items.
 * ========================================================================== */
`;
  return head + 'window.VERB_GAPS = [\n' + items.map(x => JSON.stringify(x)).join(',\n') + '\n];\n';
}

function reportMd(items, drops, read, files) {
  const rows = counts(items);
  const L = ['# Verb gaps report', '', `Generated by tools/build-verb-gaps.js from ${files.length} raw files (${read} items read): ${items.length} kept, ${drops.length} dropped.`, '',
    '| tense | total | ' + BANDS.join(' | ') + ' |', '|---|---|' + BANDS.map(() => '---').join('|') + '|'];
  rows.forEach(r => L.push(`| ${r.t} | ${r.n} | ${BANDS.map(b => r[b]).join(' | ')} |`));
  L.push(`| all | ${items.length} | ${BANDS.map(b => items.filter(x => x.b === b).length).join(' | ')} |`, '', '## Drops', '');
  if (!drops.length) L.push('None.');
  drops.forEach(d => L.push('- ' + d));
  return L.join('\n') + '\n';
}

const { items, drops, read, files } = build();
const src = render(items);
if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== src) { console.error('data/verb-gaps.js is stale. Run: node tools/build-verb-gaps.js'); process.exit(1); }
  console.log(`✅ data/verb-gaps.js is current (${items.length} items)`);
  process.exit(0);
}
fs.writeFileSync(OUT, src);
fs.writeFileSync(REPORT, reportMd(items, drops, read, files));
console.log(`${files.length} raw files, ${read} items read, ${items.length} kept, ${drops.length} dropped`);
counts(items).forEach(r => { if (r.n) console.log(`  ${r.t.padEnd(12)} ${String(r.n).padStart(4)}   ` + BANDS.map(b => `${b} ${r[b]}`).join('  ')); });
drops.slice(0, 40).forEach(d => console.log('  drop ' + d));
if (drops.length > 40) console.log(`  ... and ${drops.length - 40} more drops (tools/verbgaps/report.md)`);
