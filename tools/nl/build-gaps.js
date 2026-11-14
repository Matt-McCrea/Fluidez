#!/usr/bin/env node
/* ============================================================================
 * build-gaps.js: the GAP banks for Vlot's grammar tiles.
 *
 *   node tools/nl/build-gaps.js            build every kind
 *   node tools/nl/build-gaps.js ww mv      some kinds
 *   node tools/nl/build-gaps.js --report   print every rejection
 *
 * Sources: tools/nl/src/<kind>/*.json (frame shapes: docs/vlot-spec.md, "Sources
 * for the gap banks"). Output: nederlands/data/gaps-<kind>.js, pushing into
 * window.NL_BANK. A kind with no frame files keeps its placeholder file.
 * Rules shared with the test live in tools/nl/gaps-lib.js.
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./gaps-lib.js');
const ROOT = path.join(__dirname, '..', '..');
const { NL, byV, uniq, cap } = L;
const KINDS = ['ww', 'dehet', 'volg', 'geen', 'mv'];

function shuffleSeed(arr, seed) {
  const a = arr.slice(); let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const pick = (a, n) => a.slice(0, n);

/* ---- ww ---------------------------------------------------------------------- */
const TENSE_NEAR = { ott: ['ovt', 'vtt'], ovt: ['ott', 'vtt'], vtt: ['ovt', 'ott'], imp: ['ott', 'ovt'], hz: [], toek: [], cond: [] };
function ww(it, why) {
  const v = byV[it.v];
  if (!v) return why('verb "' + it.v + '" not in verbs.js');
  if (L.TOPICS.ww.indexOf(it.t) === -1) return why('tense ' + it.t);
  if (!it.p && it.t !== 'imp' && it.t !== 'vtt') return why('no person p');
  const op = L.wwOpts(it);
  const a = L.wwAnswer(it);
  if (!a) return why(`NL.form gives nothing for ${it.v} ${it.t} ${it.p}`);
  if (it.a && it.a !== a && !(/^___/.test(it.q) && it.a.toLowerCase() === a)) return why(`authored a "${it.a}" but NL.form gives "${a}"`);
  const p = it.p || 'ik';
  const x = [];
  if (p === 'u' && (it.t === 'ott' || it.t === 'hz' && it.tt !== 'ovt' || it.t === 'toek')) {
    const j = NL.form(it.v, it.t, 'jij', op); if (j && j !== a) x.push(j);
  }
  // jij/u with zullen, kunnen, willen: zal, kan, wil are standard too (je zal, u kan, wil jij)
  if ((p === 'jij' || p === 'u') && ((it.t === 'ott' && ['zullen', 'kunnen', 'willen'].indexOf(it.v) !== -1) || (it.t === 'toek' && it.v !== 'gaan'))) {
    const h = NL.form(it.t === 'toek' ? 'zullen' : it.v, 'ott', 'hij', {}); if (h && h !== a) x.push(h);
  }
  // houden: ik hou is as common as ik houd
  if ((it.t === 'ott' || it.t === 'imp') && /houd$/.test(a)) x.push(a.slice(0, -1));
  if (it.t === 'ott' && p === 'ik') {
    const stem = v.f.inf.replace(/e?n$/, '');
    if (stem !== a && stem === a + 'd' && !it.sep) x.push(stem);
  }
  if (it.t === 'hz' && v.aux === 'hz' && !it.aux) { const h = NL.form(it.v, 'hz', p, Object.assign({}, op, { aux: 'h' })); if (h && h !== a) x.push(h); }
  // distractors, best first
  const f = (t2, p2, o2) => NL.form(it.v, t2, p2, Object.assign({}, op, o2 || {}));
  const c = [];
  const swapDT = w => /dt$/.test(w) ? w.slice(0, -1) : /t$/.test(w) ? w.slice(0, -1) + 'd' : /d$/.test(w) ? w + 't' : null;
  const real = L.realForms(it);
  if (it.t === 'hz') {
    ['h', 'z'].forEach(au => ['ott', 'ovt'].forEach(tt => { const w = NL.form(it.v, 'hz', p, { aux: au, tt, inv: it.inv }); if (w) c.push(w); }));
    ['h', 'z'].forEach(au => ['wij', 'hij', 'ik'].forEach(pp => { const w = NL.form(it.v, 'hz', pp, { aux: au, tt: it.tt, inv: it.inv }); if (w) c.push(w); }));
  } else {
    const tw = swapDT(a); if (tw && real.indexOf(tw) !== -1) c.push(tw);
    if (it.t === 'ott' && p === 'jij') { const j = f('ott', 'jij', { inv: !it.inv }); if (j) c.push(j); }
    (TENSE_NEAR[it.t] || []).forEach(t2 => { const w = f(t2, p); if (w) c.push(w); });
    if (it.t === 'toek' || it.t === 'cond') { const w = f(it.t === 'toek' ? 'cond' : 'toek', p); if (w) c.push(w); }
    ['wij', 'hij', 'ik', 'jij'].forEach(pp => { const w = f(it.t === 'vtt' ? 'ott' : it.t, pp); if (w) c.push(w); });
    if (it.t === 'toek' || it.t === 'cond') ['wij', 'hij', 'ik'].forEach(pp => { const w = f(it.t === 'toek' ? 'cond' : 'toek', pp); if (w) c.push(w); });
    if (it.t !== 'toek' && it.t !== 'cond') { const w = f('ott', 'wij'); if (w) c.push(w); c.push(v.f.inf); }
  }
  const ban = [a].concat(x);
  const d = uniq(c).filter(w => ban.indexOf(w) === -1 && real.indexOf(w) !== -1);
  let o = [a].concat(pick(d, 3));
  if (o.length < 3) return why('fewer than 3 distinct options');
  if (it.o) {
    if (!it.o.every(z => real.indexOf(/^___/.test(it.q) ? z.charAt(0).toLowerCase() + z.slice(1) : z) !== -1)) return why('authored options are not real forms');
    o = it.o;
  }
  const out = { k: 'ww', q: it.q, a, x: uniq(x.concat(it.x || [])), o, e: it.e, w: it.w, wn: it.wn, b: it.b, t: it.t, v: it.v, p: it.p, inv: it.inv ? true : undefined, sub: it.sub ? true : undefined, tt: it.tt, aux: it.aux };
  if (!out.w) { const tpl = L.wwTemplate(it, a, v); out.w = tpl.w; out.wn = out.wn || tpl.wn; }
  return out;
}

/* ---- dehet ------------------------------------------------------------------------- */
const DEHET_OPTS = { art: ['de', 'het'], dem: ['deze', 'dit', 'die', 'dat'], adj: null, rel: ['die', 'dat'] };
function dehet(it, why) {
  if (it.t === 'bez') {
    if (!it.a || !Array.isArray(it.o)) return why('bez needs authored a and o');
    return { k: 'dehet', q: it.q, a: it.a, x: it.x, o: it.o, e: it.e, w: it.w, wn: it.wn, b: it.b, t: 'bez' };
  }
  if (!DEHET_OPTS.hasOwnProperty(it.t)) return why('topic ' + it.t);
  if (!it.n) return why('no noun n');
  const w = L.noun(it.n);
  const r = L.dehetAnswer(it);
  if (r.err) return why(r.err);
  let a = r.a;
  if (it.a && it.a.toLowerCase() !== a) return why(`authored a "${it.a}" but words.js gives "${a}"`);
  let o = it.t === 'adj' ? [L.adjective(it.adj).nl, L.adjective(it.adj).ae] : DEHET_OPTS[it.t].slice();
  if (it.o) o = it.o;
  const pl = L.isPlural(it, w);
  const out = { k: 'dehet', q: it.q, a, x: uniq(r.x.concat(it.x || [])), o, e: it.e, w: it.w, wn: it.wn, b: it.b, t: it.t, n: it.n, adj: it.adj, pl: pl ? 1 : undefined };
  if (!out.w) { const tpl = L.dehetTemplate(it, a, w); out.w = tpl.w; out.wn = out.wn || tpl.wn; }
  return out;
}

/* ---- mv ------------------------------------------------------------------------------ */
function mv(it, why) {
  if (L.TOPICS.mv.indexOf(it.t) === -1) return why('topic ' + it.t);
  if (!it.n) return why('no noun n');
  const w = L.noun(it.n);
  const r = L.mvAnswer(it);
  if (r.err) return why(r.err);
  const a = r.a;
  if (it.a && it.a.toLowerCase() !== a) return why(`authored a "${it.a}" but words.js gives "${a}"`);
  const x = it.x || [];
  const wrong = L.mvWrong(it, a, x);
  let o = [a].concat(pick(wrong, 3));
  if (it.o) o = it.o;
  if (o.length < 3) return why('fewer than 3 wrong spellings');
  const out = { k: 'mv', q: it.q, a, x: x.length ? x : undefined, o, e: it.e, w: it.w, wn: it.wn, b: it.b, t: it.t, n: it.n };
  if (!out.w) { const tpl = L.mvTemplate(it, a, w); out.w = tpl.w; out.wn = out.wn || tpl.wn; }
  return out;
}

/* ---- authored: volg, geen ------------------------------------------------------------- */
function authored(kind) {
  return function (it, why) {
    if (!it.a || !Array.isArray(it.o)) return why('needs a and o');
    if (!it.t) return why('no topic t');
    return { k: kind, q: it.q, a: it.a, x: it.x, o: it.o, e: it.e, w: it.w || L.FALLBACK[it.t], wn: it.wn, b: it.b, t: it.t };
  };
}
const MAKERS = { ww, dehet, volg: authored('volg'), geen: authored('geen'), mv };

const DROP = (function () {
  const f = path.join(__dirname, 'src', 'drop.json');
  return fs.existsSync(f) ? new Set(JSON.parse(fs.readFileSync(f, 'utf8')).map(d => typeof d === 'string' ? d : d.q)) : new Set();
})();
function frameFiles(kind) {
  const dir = path.join(__dirname, 'src', kind);
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => path.join(dir, f)) : [];
}
function buildKind(kind) {
  const out = [], rejected = [], seen = new Set();
  frameFiles(kind).forEach(file => {
    const f = path.basename(file);
    let arr;
    try { arr = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { rejected.push(`${f}: bad JSON ${e.message}`); return; }
    arr.forEach((it, i) => {
      if (DROP.has(it.q)) return;
      let msg = null;
      const why = m => { msg = m; return null; };
      const r = MAKERS[kind](it, why);
      if (r) ['w', 'wn'].forEach(k => { if (r[k]) r[k] = r[k].charAt(0).toUpperCase() + r[k].slice(1); });
      if (!r) { rejected.push(`${f}#${i} ${it.q}: ${msg}`); return; }
      if (/^___/.test(r.q)) {            // gap opens the sentence: capitalise answer, options, alternatives
        r.a = cap(r.a); r.o = r.o.map(cap); if (r.x) r.x = r.x.map(cap);
      }
      Object.keys(r).forEach(k => (r[k] === undefined || (Array.isArray(r[k]) && !r[k].length && k === 'x')) && delete r[k]);
      const g = L.gate(r);
      if (g) { rejected.push(`${f}#${i} ${it.q}: ${g}`); return; }
      if (seen.has(r.q)) { rejected.push(`${f}#${i} duplicate: ${r.q}`); return; }
      seen.add(r.q);
      out.push(r);
    });
  });
  return { out, rejected };
}

function write(kind, out) {
  const file = path.join(ROOT, 'nederlands', 'data', 'gaps-' + kind + '.js');
  const head = `/* GENERATED by tools/nl/build-gaps.js from tools/nl/src/${kind}/. Do not edit.
 * ${out.length} items. Shape: docs/vlot-spec.md (The GAP banks). */\n`;
  const body = '(function (w) {\nvar B = w.NL_BANK = w.NL_BANK || [];\nvar items = [\n' +
    out.map(x => JSON.stringify(x)).join(',\n') +
    '\n];\nfor (var i = 0; i < items.length; i++) B.push(items[i]);\nif (typeof module !== "undefined" && module.exports) module.exports = items;\n})(typeof window !== "undefined" ? window : globalThis);\n';
  fs.writeFileSync(file, head + body);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const kinds = args.filter(a => !a.startsWith('--'));
  (kinds.length ? kinds : KINDS).forEach(kind => {
    const { out, rejected } = buildKind(kind);
    if (!frameFiles(kind).length) { console.log(`${kind}: no frames yet, placeholder kept`); return; }
    write(kind, out);
    const tally = k => { const m = {}; out.forEach(x => { m[x[k]] = (m[x[k]] || 0) + 1; }); return JSON.stringify(m); };
    console.log(`${kind}: ${out.length} kept, ${rejected.length} rejected  ${tally('b')}  ${tally('t')}`);
    rejected.forEach(r => console.log('  ✗ ' + r));
  });
}
module.exports = { buildKind, MAKERS };
