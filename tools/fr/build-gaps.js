#!/usr/bin/env node
/* ============================================================================
 * build-gaps.js: the GAP banks for Couramment's grammar tiles.
 *
 *   node tools/fr/build-gaps.js            build every kind
 *   node tools/fr/build-gaps.js vb genre   some kinds
 *
 * Sources: tools/fr/src/<kind>/*.json (frame shapes: docs/couramment-spec.md,
 * Frames). Output: francais/data/gaps-<kind>.js, pushing into window.FR_BANK.
 * tools/fr/src/drop.json (array of q) drops frames. Rules shared with the
 * test live in tools/fr/gaps-lib.js.
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./gaps-lib.js');
const ROOT = path.join(__dirname, '..', '..');
const { FR, byV, uniq, cap, low } = L;
const KINDS = ['vb', 'genre', 'pron', 'neg', 'prep'];
const pick = (a, n) => a.slice(0, n);

/* ---- vb ---------------------------------------------------------------------- */
function vb(it, why) {
  const v = byV[it.v];
  if (!v) return why('verb "' + it.v + '" not in verbs.js');
  if (L.TOPICS.vb.indexOf(it.t) === -1) return why('tense ' + it.t);
  if (!it.p) return why('no person p');
  const op = L.vbOpts(it);
  const a = L.vbAnswer(it);
  if (!a) return why(`FR.form gives nothing for ${it.v} ${it.t} ${it.p}`);
  if (it.a && it.a !== a && !(/^___/.test(it.q) && low(it.a) === a)) return why(`authored a "${it.a}" but FR.form gives "${a}"`);
  const p = FR.PERSON[it.p];
  const x = L.vbAlt(it, a);
  const f = (t2, p2, o2) => FR.form(it.v, t2, p2, Object.assign({}, op, o2 || {}));
  const real = L.realForms(it);
  const inf = it.v.replace(/^(se |s')/, '');
  const pp = v.f.pp;
  const c = [];
  const others = t2 => L.PN[p].forEach(pp2 => c.push(f(t2, pp2)));
  switch (it.t) {
    case 'pres': c.push(f('subj', p), f('imp', p)); others('pres'); c.push(inf, pp); break;
    case 'imp': c.push(pp, f('pres', p), f('cond', p)); others('imp'); c.push(inf); break;
    case 'fut': c.push(f('cond', p), f('imp', p)); others('fut'); c.push(inf); break;   // never the present: with a time word it is often right too
    case 'cond': c.push(f('fut', p), f('imp', p)); others('cond'); c.push(f('pres', p)); break;
    case 'subj': c.push(f('pres', p)); others('subj'); c.push(f('imp', p), inf); break;
    case 'imper': c.push(f('pres', p), inf, pp); ['tu', 'nous', 'vous'].forEach(q2 => c.push(f('imper', q2))); c.push(f('subj', p)); break;
    case 'pc': case 'pqp':
      ['m', 'f', 'mp', 'fp'].forEach(g => c.push(FR.agreeing(pp, g)));
      c.push(inf, f('imp', p), f('pres', p)); break;
    case 'ae': {
      const au = v.pron ? 'être' : null;
      const mine = FR.form(au || (a === 'a' || /^(ai|as|a|avons|avez|ont|avais|avait|avions|aviez|avaient)$/.test(a) ? 'avoir' : 'être'), 'pres', p) && null;
      void mine;
      const A = byV['avoir'], E = byV['être'];
      const mineIsA = /^(ai|as|a|avons|avez|ont|avais|avait|avions|aviez|avaient)$/.test(a);
      const same = mineIsA ? A : E, other = mineIsA ? E : A;
      const tt = it.tt === 'imp' ? 'imp' : 'pres', tt2 = tt === 'imp' ? 'pres' : 'imp';
      c.push(FR.form(other, tt, it.p), FR.form(same, tt2, it.p), FR.form(other, tt2, it.p));
      L.PN[p].forEach(q2 => c.push(FR.form(same, tt, q2)));
      L.PN[p].forEach(q2 => c.push(FR.form(other, tt, q2)));
      break;
    }
    case 'fp': {
      const al = byV['aller'];
      c.push(FR.form(al, 'fut', p), FR.form(al, 'imp', p)); L.PN[p].forEach(q2 => c.push(FR.form(al, 'pres', q2))); c.push('aller');
      break;
    }
  }
  const elide = /(^|[\s(])[a-zA-Z]'___/.test(it.q);
  const ban = [a].concat(x);
  const d = uniq(c).filter(w => ban.indexOf(w) === -1 && real.indexOf(w) !== -1 && (!elide || L.startsVowel(w)));
  const o = [a].concat(pick(d, 3));
  if (o.length < 3) return why('fewer than 3 distinct options');
  const out = { k: 'vb', q: it.q, a, x: x.length ? x : undefined, o, e: it.e, w: it.w, wf: it.wf, b: it.b, t: it.t, v: it.v, p: it.p, tt: it.tt, aux: it.aux, agree: it.agree };
  if (!out.w) { const tpl = L.vbTemplate(it, a, v); out.w = tpl.w; out.wf = out.wf || tpl.wf; }
  return out;
}

/* ---- genre ------------------------------------------------------------------------- */
function genre(it, why) {
  if (L.TOPICS.genre.indexOf(it.t) === -1) return why('topic ' + it.t);
  if (!it.n) return why('no noun n');
  const w = L.noun(it.n);
  const r = L.genreAnswers(it);
  if (r.err) return why(r.err);
  if (!it.a) return why('no authored a');
  const lcq = /^___/.test(it.q);
  const aa = lcq ? low(it.a) : it.a;
  if (r.a.indexOf(aa.toLowerCase()) === -1 && r.a.indexOf(aa) === -1) return why(`authored a "${it.a}" but words.js gives "${r.a.join('/')}"`);
  const a = r.a.indexOf(aa) !== -1 ? aa : aa.toLowerCase();
  let o = L.genreOptions(it, a);
  if (it.t === 'adj') o = L.uniq(o);
  const out = { k: 'genre', q: it.q, a, x: it.x, o: pick(o, 4), e: it.e, w: it.w, wf: it.wf, b: it.b, t: it.t, n: it.n, adj: it.adj, p: it.p, pl: r.pl ? 1 : undefined };
  if (!out.w) { const tpl = L.genreTemplate(it, a, w, r.pl, r.vow); out.w = tpl.w; out.wf = out.wf || tpl.wf; }
  return out;
}

/* ---- authored: pron, neg, prep --------------------------------------------------------- */
function authored(kind) {
  return function (it, why) {
    if (!it.a || !Array.isArray(it.o)) return why('needs a and o');
    if (!it.t) return why('no topic t');
    let w = it.w, wf = it.wf;
    if (!w) return why('no w (authored kinds need their own)');
    return { k: kind, q: it.q, a: it.a, x: it.x, o: it.o, e: it.e, w, wf, b: it.b, t: it.t };
  };
}
const MAKERS = { vb, genre, pron: authored('pron'), neg: authored('neg'), prep: authored('prep') };

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
      if (!r) { rejected.push(`${f}#${i} ${it.q}: ${msg}`); return; }
      ['w', 'wf'].forEach(k => { if (r[k]) r[k] = r[k].charAt(0).toUpperCase() + r[k].slice(1); });
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
  const file = path.join(ROOT, 'francais', 'data', 'gaps-' + kind + '.js');
  const head = `/* GENERATED by tools/fr/build-gaps.js from tools/fr/src/${kind}/. Do not edit.
 * ${out.length} items. Shape: docs/couramment-spec.md (The GAP banks). */\n`;
  const body = '(function (w) {\nvar B = w.FR_BANK = w.FR_BANK || [];\nvar items = [\n' +
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
