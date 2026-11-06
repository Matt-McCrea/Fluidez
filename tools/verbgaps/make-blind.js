#!/usr/bin/env node
/* ============================================================================
 * make-blind.js / score-blind — the blind judging round for the verb gaps.
 *
 *   node tools/verbgaps/make-blind.js            write tools/verbgaps/blind/part-N.json
 *   node tools/verbgaps/make-blind.js --score    compare verdicts with the key
 *
 * A judge sees only the sentence and its options: no answer, no reason, no
 * English, no tense name. Each item is answered as a learner who knows the
 * rules would answer it, and every option a native speaker would accept is
 * listed. An item is FLAGGED when the judge's pick is not the key, when more
 * than one option is acceptable, or when the judge marks it unnatural. The
 * flags go to tools/verbgaps/flagged.json for rewriting.
 *
 * Verdict files: tools/verbgaps/blind/part-N.verdicts.json, an array of
 *   { id, pick, ok: [options a native would accept], natural: true|false, note }
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '../..');
const DIR = path.join(__dirname, 'blind');
const { formIn } = require('./check-raw.js');
const PARTS = 3;

function items() {
  const raw = path.join(__dirname, 'raw');
  const out = [];
  fs.readdirSync(raw).filter(f => f.endsWith('.json')).sort().forEach(f => {
    JSON.parse(fs.readFileSync(path.join(raw, f), 'utf8')).forEach((it, i) => {
      const key = formIn(it, it.tense) || it.answer;          // the engine's form, as it fills the sentence
      const opts = [key];
      (it.confuse || []).forEach(t => { const x = formIn(it, t); if (x && opts.indexOf(x) === -1) opts.push(x); });
      out.push({ id: f.replace('.json', '') + ':' + i, q: it.q, options: opts.slice(0, 4), key: key });
    });
  });
  return out;
}
// a fixed shuffle, so the key is never in the same place and re-runs agree
function shuffled(a, seed) {
  const r = a.slice(); let s = seed;
  for (let i = r.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

if (process.argv.indexOf('--score') === -1) {
  fs.mkdirSync(DIR, { recursive: true });
  const all = shuffled(items(), 7);                       // tenses mixed, so a judge cannot pattern-match a file
  // opaque ids: the source id names the tense, which would hand the judge the answer
  const map = {};
  all.forEach((it, i) => { it.blind = 'v' + String(1000 + i); map[it.blind] = it.id; });
  fs.writeFileSync(path.join(DIR, 'map.json'), JSON.stringify(map));
  for (let p = 0; p < PARTS; p++) {
    const part = all.filter((_, i) => i % PARTS === p)
      .map((it, k) => ({ id: it.blind, q: it.q, options: shuffled(it.options, k + 11) }));
    fs.writeFileSync(path.join(DIR, `part-${p + 1}.json`), JSON.stringify(part, null, 1));
    console.log(`part-${p + 1}.json: ${part.length} items`);
  }
} else {
  const key = {}; items().forEach(it => { key[it.id] = it; });
  const map = JSON.parse(fs.readFileSync(path.join(DIR, 'map.json'), 'utf8'));
  const flagged = []; let judged = 0;
  fs.readdirSync(DIR).filter(f => /\.verdicts\.json$/.test(f)).forEach(f => {
    JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).forEach(v => {
      const src = map[v.id] || v.id, it = key[src]; if (!it) return; judged++;
      const ok = Array.isArray(v.ok) ? v.ok : [v.pick];
      const why = [];
      if (v.pick !== it.key) why.push('picked ' + v.pick);
      if (ok.length > 1) why.push('also acceptable: ' + ok.filter(o => o !== it.key).join(', '));
      if (v.natural === false) why.push('unnatural');
      if (why.length) flagged.push({ id: src, q: it.q, key: it.key, options: it.options, why: why.join('; '), note: v.note || '' });
    });
  });
  fs.writeFileSync(path.join(__dirname, 'flagged.json'), JSON.stringify(flagged, null, 1));
  const byTense = {}; flagged.forEach(f => { const t = f.id.split(':')[0]; byTense[t] = (byTense[t] || 0) + 1; });
  console.log(`${judged} judged, ${flagged.length} flagged (${Math.round(100 * flagged.length / Math.max(1, judged))}%)`, byTense);
}
