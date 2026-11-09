#!/usr/bin/env node
/* ============================================================================
 * build-gaps.js: the GAP banks for Líofa's grammar tiles.
 *
 *   node tools/ga/build-gaps.js            build every kind
 *   node tools/ga/build-gaps.js briathra   one kind
 *   node tools/ga/build-gaps.js --report   counts and every rejected item
 *
 * Sources: tools/ga/src/<kind>/*.json, each an array of authored items (shape
 * per kind below). Output: gaeilge/data/gaps-<kind>.js, pushing into
 * window.GA_BANK (docs/liofa-spec.md). The answer is COMPUTED wherever the
 * rules can compute it, so an author writes the sentence and the tags and the
 * build decides the form; an authored `a` that disagrees is rejected.
 *
 * briathra  { q, v, t, p, pt, tt?, e, w, wg?, b }   q has "___ (verb)", or
 *           "___ (verb, mé)" when the form is synthetic, "___ (verb, saor)" for saor
 * forainm   { q, prep, p, e, w, wg?, b }            q has "___ (prep + pronoun)"
 * freagair  { q, v?, t?, p?, pol, a?, o?, e, w?, b } question; yes/no echo
 * tais      { q, a, o, e, w, wg?, b, t }            authored answers
 * seimhiu   { q, base, r, e, w, wg?, b, t }         q has "___ (base)"; r = len ecl t ts h none
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const GA = require(path.join(ROOT, 'gaeilge/js/ga-text.js'));
const VERBS = require(path.join(ROOT, 'gaeilge/data/verbs.js'));
const byV = {}; VERBS.forEach(v => { byV[v.v] = v; });

const KINDS = ['briathra', 'forainm', 'freagair', 'tais', 'seimhiu'];
const BANDS = ['A1', 'A2', 'B1', 'B2'];
const TENSES = ['lait', 'gnathlait', 'caite', 'fhaist', 'coinn', 'gnath', 'ord'];
const PERSONS = ['me', 'tu', 'se', 'si', 'muid', 'sibh', 'siad', 'saor'];
const PRON = { me: 'mé', tu: 'tú', se: 'sé', si: 'sí', sibh: 'sibh', siad: 'siad', muid: 'muid' };

const PREP = {
  ag: ['agam', 'agat', 'aige', 'aici', 'againn', 'agaibh', 'acu'],
  ar: ['orm', 'ort', 'air', 'uirthi', 'orainn', 'oraibh', 'orthu'],
  le: ['liom', 'leat', 'leis', 'léi', 'linn', 'libh', 'leo'],
  do: ['dom', 'duit', 'dó', 'di', 'dúinn', 'daoibh', 'dóibh'],
  'ó': ['uaim', 'uait', 'uaidh', 'uaithi', 'uainn', 'uaibh', 'uathu'],
  chuig: ['chugam', 'chugat', 'chuige', 'chuici', 'chugainn', 'chugaibh', 'chucu'],
  as: ['asam', 'asat', 'as', 'aisti', 'asainn', 'asaibh', 'astu'],
  de: ['díom', 'díot', 'de', 'di', 'dínn', 'díbh', 'díobh'],
  faoi: ['fúm', 'fút', 'faoi', 'fúithi', 'fúinn', 'fúibh', 'fúthu'],
  i: ['ionam', 'ionat', 'ann', 'inti', 'ionainn', 'ionaibh', 'iontu'],
  roimh: ['romham', 'romhat', 'roimhe', 'roimpi', 'romhainn', 'romhaibh', 'rompu'],
  thar: ['tharam', 'tharat', 'thairis', 'thairsti', 'tharainn', 'tharaibh', 'tharstu'],
  'trí': ['tríom', 'tríot', 'tríd', 'tríthi', 'trínn', 'tríbh', 'tríothu'],
  um: ['umam', 'umat', 'uime', 'uimpi', 'umainn', 'umaibh', 'umpu']
};
const PREP_PERSONS = ['me', 'tu', 'se', 'si', 'muid', 'sibh', 'siad'];

function words(s) { return String(s).replace(/[.,;:!?"“”]/g, ' ').trim().split(/\s+/).filter(Boolean); }
function uniq(a) { return a.filter((x, i) => x && a.indexOf(x) === i); }
function shuffleSeed(arr, seed) {
  const a = arr.slice(); let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ---- common checks ------------------------------------------------------- */
function common(it, why) {
  if (typeof it.q !== 'string' || (it.q.match(/___/g) || []).length !== 1) return why('one ___ gap');
  if (BANDS.indexOf(it.b) === -1) return why('band ' + it.b);
  if (!it.e) return why('no English');
  for (const f of ['q', 'e', 'w', 'wg']) if (it[f] && /[–—]|\s-\s/.test(it[f])) return why('dash in ' + f);
  if (it.w && it.w.length > 110) return why('why over 110 chars');
  const n = words(it.q.replace(/\([^)]*\)/g, '')).length;
  if (n < 2 || n > 13) return why('q is ' + n + ' words');
  return true;
}

/* ---- briathra -------------------------------------------------------------
 * The word right before the gap must be the particle (níor for a regular past
 * ní, and so on); the pronoun follows the gap for an analytic form and must
 * not for a synthetic one. Options: the same particle and person in the
 * tenses a learner confuses, plus the no-particle form when there is a
 * particle (chonaic for fhaca), all real Irish. */
const CONFUSE = {
  lait: ['caite', 'fhaist', 'gnath'], gnathlait: ['lait', 'caite', 'gnath'], caite: ['lait', 'fhaist', 'gnath', 'coinn'],
  fhaist: ['lait', 'caite', 'coinn'], coinn: ['fhaist', 'gnath', 'caite'], gnath: ['caite', 'coinn', 'lait'], ord: ['lait', 'fhaist']
};
function briathra(it, why) {
  const verb = byV[it.v];
  if (!verb) return why('unknown verb ' + it.v);
  const t = it.t === 'saor' || it.t === 'ag' ? it.tt : it.t;
  if (it.t === 'ag') return agItem(it, verb, why);
  if (TENSES.indexOf(t) === -1) return why('tense ' + it.t);
  if (PERSONS.indexOf(it.p) === -1) return why('person ' + it.p);
  if (it.t === 'saor' && it.p !== 'saor') return why('saor item with person ' + it.p);
  const pt = it.pt || '';
  const a = GA.formAfter(pt, verb, t, it.p);
  if (!a) return why(`no form for ${pt || '∅'} ${it.v} ${t} ${it.p}`);
  if (it.a && it.a !== a) return why(`authored a "${it.a}" but the rules give "${a}"`);
  const slot0 = verb.f[t][it.p];
  const needP = it.p === 'saor' ? 'saor' : (slot0[2] && !(t === 'ord' && it.p === 'tu')) ? PRON[it.p] : null;
  const cue = '___ (' + it.v + (needP ? ', ' + needP : '') + ')';
  if (it.q.indexOf(cue) === -1) return why('cue must be "' + cue + '"');
  const toks = words(it.q.replace(/\([^)]*\)/g, ''));
  const gi = toks.indexOf('___');
  if (pt) {
    const want = GA.particleWord(pt, verb, t);
    const before = (toks[gi - 1] || '').toLowerCase();
    const multi = { 'nuair a': 'a', 'cé a': 'a', 'cad a': 'a', 'cá': null };
    if (before !== want && !(pt === 'a' && before === 'a')) return why(`word before gap is "${before}", want "${want}"`);
  }
  const slot = verb.f[t][it.p];
  const syn = !!slot[2];
  const after = (toks[gi + 1] || '').toLowerCase();
  const pr = PRON[it.p];
  if (t !== 'ord' && it.p !== 'saor') {
    if (syn && after === pr) return why('synthetic form, but the pronoun follows the gap');
    if (!syn && after !== pr && !(it.p === 'se' || it.p === 'si' || it.p === 'siad') ) return why(`analytic form needs "${pr}" after the gap`);
  }
  // options: an analytic slot borrows the base (sé) form of the other tenses,
  // so no option gives itself away by carrying a person the sentence already has
  const dp = (t2) => {
    if (!verb.f[t2]) return null;
    let pp = it.p;
    if (!syn && it.p !== 'saor' && t !== 'ord') pp = 'se';
    if (!verb.f[t2][pp] || (syn && !verb.f[t2][pp][2] && t2 !== t)) return null;
    return GA.formAfter(pt, verb, t2, pp) || null;
  };
  let opts = [a];
  (CONFUSE[t] || []).forEach(t2 => { const f = dp(t2); if (f) opts.push(f); });
  if (pt && pt !== 'a') opts.push(GA.formAfter('', verb, t, it.p));
  opts = uniq(opts).filter(o => o !== null);
  if (opts.length < 4) TENSES.forEach(t2 => { if (opts.length < 4) { const f = dp(t2); if (f && opts.indexOf(f) === -1) opts.push(f); } });
  if (opts.length < 4) TENSES.forEach(t2 => { if (opts.length < 4 && verb.f[t2] && verb.f[t2].se && t2 !== 'ord') { const f = GA.formAfter(pt, verb, t2, 'se') || GA.formAfter('', verb, t2, 'se'); if (f && opts.indexOf(f) === -1) opts.push(f); } });
  if (opts.length < 4) return why('fewer than 4 distinct options');
  const o = [a].concat(shuffleSeed(opts.slice(1), it.q).slice(0, 3));
  const x = [];
  if (it.p === 'muid' && !it.pt && t === 'caite') x.push(GA.formAfter('', verb, t, 'se') + ' muid');
  return { k: 'briathra', q: it.q, a, x: x.length ? x : undefined, o, e: it.e, w: it.w, wg: it.wg, b: it.b,
           t: it.t, tt: it.t === 'saor' ? t : undefined, v: it.v, p: it.p, pt: pt || undefined };
}
// ag + verbal noun: "Tá sí ag ___ (ól) tae." -> "ól"; "Bhí siad ag ___ (imir) peil." -> "imirt".
// Options: the verbal noun and finite forms of the same verb, all real words.
function agItem(it, verb, why) {
  if (!verb.vn) return why('no verbal noun');
  if (!new RegExp('ag ___ \\(' + it.v + '\\)').test(it.q)) return why('cue must be "ag ___ (' + it.v + ')"');
  const a = verb.vn;
  const pool = [GA.formAfter('', verb, 'lait', 'se'), verb.v, verb.f.caite && verb.f.caite.se ? GA.formAfter('', verb, 'caite', 'se') : null,
                GA.formAfter('', verb, 'fhaist', 'se'), verb.va];
  const o = uniq([a].concat(shuffleSeed(uniq(pool).filter(z => z && z !== a), it.q))).slice(0, 4);
  if (o.length < 4) return why('ag options');
  return { k: 'briathra', q: it.q, a, o, e: it.e, w: it.w, wg: it.wg, b: it.b, t: 'ag', v: it.v };
}

/* ---- forainm ----------------------------------------------------------------- */
function forainm(it, why) {
  const tab = PREP[it.prep];
  if (!tab) return why('preposition ' + it.prep);
  const pi = PREP_PERSONS.indexOf(it.p);
  if (pi === -1) return why('person ' + it.p);
  const a = tab[pi];
  if (it.a && it.a !== a) return why(`authored a "${it.a}", table says "${a}"`);
  if (!new RegExp('___ \\(' + it.prep + ' \\+ ').test(it.q)) return why('cue must be "___ (' + it.prep + ' + pronoun)"');
  // distractors: same preposition other persons (2), same person other preposition (1)
  const same = shuffleSeed(tab.filter((x, i) => i !== pi && x !== a), it.q).slice(0, 2);
  const others = Object.keys(PREP).filter(k => k !== it.prep).map(k => PREP[k][pi]).filter(x => x !== a && same.indexOf(x) === -1);
  const o = [a].concat(same, shuffleSeed(others, it.q + '!').slice(0, 1));
  if (uniq(o).length !== 4) return why('forainm options');
  return { k: 'forainm', q: it.q, a, o, e: it.e, w: it.w, wg: it.wg, b: it.b, t: it.prep };
}

/* ---- freagair --------------------------------------------------------------
 * Yes/no by echoing the verb. The asked person becomes the answerer: tu -> me,
 * sibh -> muid, others stay. Authors give q (the question, which the gate also
 * checks against the rules), v, t, p, pol; or a/o directly for copula items. */
const ANSWERER = { tu: 'me', sibh: 'muid' };
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function freagair(it, why) {
  if (it.pol !== 'yes' && it.pol !== 'no') return why('pol yes/no');
  if (!/\(yes\)$|\(no\)$/.test(it.q)) return why('q must end "(yes)" or "(no)"');
  if (it.a && it.o) {
    if (it.o.indexOf(it.a) === -1 || uniq(it.o).length !== 4) return why('authored options');
    return { k: 'freagair', q: it.q, a: it.a, x: it.x, o: it.o, e: it.e, w: it.w, wg: it.wg, b: it.b, t: it.t || 'cop' };
  }
  const verb = byV[it.v];
  if (!verb) return why('unknown verb ' + it.v);
  const t = it.t, ap = ANSWERER[it.p] || it.p;
  if (!verb.f[t] || !verb.f[t][it.p] || !verb.f[t][ap]) return why('no form');
  // check the question's own verb word
  const qv = GA.formAfter('an', verb, t, it.p), qw = GA.particleWord('an', verb, t);
  const qlow = it.q.toLowerCase();
  if (qlow.indexOf((qw + ' ' + qv).toLowerCase()) === -1) return why(`question should contain "${qw} ${qv}"`);
  const yes = cap(GA.formAfter('', verb, t, ap));
  const noW = GA.formAfter('ní', verb, t, ap);
  const no = noW === 'níl' ? 'Níl' : cap(GA.particleWord('ní', verb, t)) + ' ' + noW;
  const a = it.pol === 'yes' ? yes : no;
  const syn = !!verb.f[t][ap][2];
  const x = syn || ap === 'saor' ? [] : [a + ' ' + PRON[ap]];
  // the analytic "muid" form the Caighdeán also allows: Tá muid, Rinne muid, Ní raibh muid
  if (syn && ap === 'muid' && verb.f[t].se) {
    const base = it.pol === 'yes' ? cap(GA.formAfter('', verb, t, 'se')) :
      (GA.formAfter('ní', verb, t, 'se') === 'níl' ? 'Níl' : cap(GA.particleWord('ní', verb, t)) + ' ' + GA.formAfter('ní', verb, t, 'se'));
    x.push(base + ' muid');
  }
  // distractors: the other polarity is NOT one (the cue decides); wrong tense, wrong person
  const pool = [];
  (CONFUSE[t] || []).forEach(t2 => {
    if (!verb.f[t2] || !verb.f[t2][ap]) return;
    if (it.pol === 'yes') pool.push(cap(GA.formAfter('', verb, t2, ap)));
    else { const w2 = GA.formAfter('ní', verb, t2, ap); if (w2) pool.push(w2 === 'níl' ? 'Níl' : cap(GA.particleWord('ní', verb, t2)) + ' ' + w2); }
  });
  const op = it.p === ap ? null : it.p;
  if (op && verb.f[t][op]) pool.push(it.pol === 'yes' ? cap(GA.formAfter('', verb, t, op)) : null);
  const opts = uniq([a].concat(shuffleSeed(uniq(pool).filter(z => z && z !== a), it.q))).slice(0, 4);
  if (opts.length < 4) return why('freagair options');
  return { k: 'freagair', q: it.q, a, x: x.length ? x : undefined, o: opts, e: it.e, w: it.w, wg: it.wg, b: it.b, t: it.v === 'bí' ? 'bi' : 'verb', v: it.v };
}

/* ---- authored kinds ---------------------------------------------------------- */
function authored(kind) {
  return function (it, why) {
    if (!it.a || !Array.isArray(it.o) || it.o.length !== 4 || uniq(it.o).length !== 4) return why('needs a and 4 distinct o');
    if (it.o.indexOf(it.a) === -1) return why('a not in o');
    if (!it.t) return why('no topic t');
    return { k: kind, q: it.q, a: it.a, x: it.x, o: it.o, e: it.e, w: it.w, wg: it.wg, b: it.b, t: it.t };
  };
}
/* ---- seimhiu -----------------------------------------------------------------
 * Authored: { q: "Chuir sí an cupán ar an ___ (bord).", base: "bord", r, e, w, b, t }
 * with r one of len, ecl, t, ts, h, none. The answer is the rule applied to
 * the base; the options are the word's other shapes. Where the word before the
 * gap is a trigger this file knows, the rule is worked out independently
 * (using the noun's gender from BuNaMo) and must agree. */
const RULES = {
  len: w => GA.lenite(w), ecl: w => GA.eclipse(w), t: w => GA.tPrefix(w), ts: w => GA.tsPrefix(w),
  h: w => GA.hPrefix(w), none: w => w
};
const NOUN_G = (function () {
  const dir = path.join(__dirname, 'vendor', 'BuNaMo', 'noun'), m = {};
  if (!fs.existsSync(dir)) return m;
  fs.readdirSync(dir).forEach(f => { const x = /^(.+?)_(masc|fem)\d*(?:_[^.]*)?\.xml$/.exec(f); if (x) (m[x[1]] = m[x[1]] || new Set()).add(x[2] === 'fem' ? 'f' : 'm'); });
  return m;
})();
function genderOf(w) { const g = NOUN_G[w]; return g && g.size === 1 ? [...g][0] : null; }
const LEN_PREP = ['ar', 'de', 'do', 'faoi', 'ó', 'roimh', 'thar', 'trí', 'um', 'mar'];
const ART_PREP = ['ar', 'ag', 'le', 'leis', 'ó', 'faoi', 'roimh', 'thar', 'tríd', 'chuig', 'as', 'um', 'go', 'idir'];
const LEN_NUM = ['aon', 'dhá', 'trí', 'ceithre', 'cúig', 'sé'], ECL_NUM = ['seacht', 'ocht', 'naoi', 'deich'];
const DENTAL = /^[dtsDTS]/;
function expected(prev2, prev, base, cue) {
  const v = GA.isVowel(base.charAt(0)), g = genderOf(base.toLowerCase()) || genderOf(base);
  const sOK = /^s[aeiouáéíóúlnr]/i.test(base);
  if (prev === 'mo' || prev === 'do') return v || /^f[aeiouáéíóú]/i.test(base) ? null : 'len';
  if (prev === 'ár' || prev === 'bhur') return 'ecl';
  if (prev === 'i') return v ? null : 'ecl';
  if (prev === 'a') {
    if (/\bhis\b/.test(cue)) return 'len';
    if (/\bher\b/.test(cue)) return v ? 'h' : 'none';
    if (/\btheir\b/.test(cue)) return 'ecl';
    return null;
  }
  if (LEN_NUM.indexOf(prev) !== -1) return (prev === 'aon' && DENTAL.test(base)) ? 'none' : 'len';
  if (ECL_NUM.indexOf(prev) !== -1) return 'ecl';
  if (prev === 'sa' || prev === 'den' || prev === 'don') {
    if (/^[dt]/i.test(base)) return 'none';
    if (/^s/i.test(base)) return g === 'f' && sOK ? 'ts' : 'none';
    return v ? null : 'len';
  }
  if (prev === 'an' && ART_PREP.indexOf(prev2) !== -1) {
    if (/^[dt]/i.test(base) || v) return 'none';
    if (/^s/i.test(base)) return g === 'f' && sOK ? 'ts' : g ? 'none' : null;
    return 'ecl';
  }
  if (prev === 'an' && !g) return null;
  if (prev === 'an') {
    if (g === 'm') return v ? 't' : 'none';
    if (/^[dt]/i.test(base)) return 'none';
    if (/^s/i.test(base)) return sOK ? 'ts' : 'none';
    return v ? 'none' : 'len';
  }
  if (prev === 'na') return v ? 'h' : null;
  if (LEN_PREP.indexOf(prev) !== -1) return v ? 'none' : 'len';
  if (prev === 'go' || prev === 'le' || prev === 'ná' || prev === 'dé') return v ? 'h' : null;
  return null;
}
function seimhiu(it, why) {
  if (!it.base || !RULES[it.r]) return why('needs base and r (len ecl t ts h none)');
  if (!it.t) return why('no topic t');
  const m = /___ \(([^)]*)\)/.exec(it.q);
  if (!m || m[1].split(',')[0].trim() !== it.base) return why('cue must start with the base: "___ (' + it.base + ')"');
  const a = RULES[it.r](it.base);
  if (it.r !== 'none' && a === it.base) return why(`rule ${it.r} does not change "${it.base}"`);
  if (it.a && it.a !== a) return why(`authored a "${it.a}", rule gives "${a}"`);
  const toks = words(it.q.replace(/\([^)]*\)/g, '')).map(x => x.toLowerCase());
  const gi = toks.indexOf('___');
  const exp = expected(toks[gi - 2], toks[gi - 1], it.base, m[1]);
  if (exp && exp !== it.r) return why(`after "${toks[gi - 1]}" the rule is ${exp}, not ${it.r}`);
  const o = uniq([a].concat(shuffleSeed(GA.shapes(it.base).filter(x => x !== a), it.q))).slice(0, 4);
  if (o.length < 3) return why('fewer than 3 shapes (choose a word that mutates)');
  return { k: 'seimhiu', q: it.q, a, o, e: it.e, w: it.w, wg: it.wg, b: it.b, t: it.t, base: it.base, r: it.r };
}
const MAKERS = { briathra, forainm, freagair, tais: authored('tais'), seimhiu };

function buildKind(kind) {
  const dir = path.join(__dirname, 'src', kind);
  const out = [], rejected = [], seen = new Set();
  if (!fs.existsSync(dir)) return { out, rejected };
  fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().forEach(f => {
    let arr;
    try { arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { rejected.push(`${f}: bad JSON ${e.message}`); return; }
    arr.forEach((it, i) => {
      let msg = null;
      const why = m => { msg = m; return null; };
      const okc = common(it, why);
      const r = okc === true ? MAKERS[kind](it, why) : null;
      if (!r) { rejected.push(`${f}#${i} ${it.q}: ${msg}`); return; }
      if (seen.has(r.q)) { rejected.push(`${f}#${i} duplicate: ${r.q}`); return; }
      seen.add(r.q);
      Object.keys(r).forEach(k => r[k] === undefined && delete r[k]);
      out.push(r);
    });
  });
  return { out, rejected };
}

function write(kind, out) {
  const file = path.join(ROOT, 'gaeilge', 'data', 'gaps-' + kind + '.js');
  const head = `/* GENERATED by tools/ga/build-gaps.js from tools/ga/src/${kind}/. Do not edit.
 * ${out.length} items. Shape: docs/liofa-spec.md (GAP banks). Verb forms derived from
 * BuNaMo (c) 2017 Foras na Gaeilge, ODbL 1.0. */\n`;
  const body = '(function (w) {\nvar B = w.GA_BANK = w.GA_BANK || [];\nvar items = [\n' +
    out.map(x => JSON.stringify(x)).join(',\n') +
    '\n];\nfor (var i = 0; i < items.length; i++) B.push(items[i]);\nif (typeof module !== "undefined" && module.exports) module.exports = items;\n})(typeof window !== "undefined" ? window : globalThis);\n';
  fs.writeFileSync(file, head + body);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const report = args.indexOf('--report') !== -1;
  const kinds = args.filter(a => !a.startsWith('--'));
  let bad = 0;
  (kinds.length ? kinds : KINDS).forEach(kind => {
    const { out, rejected } = buildKind(kind);
    if (fs.existsSync(path.join(__dirname, 'src', kind))) write(kind, out);
    const byB = {}; out.forEach(x => { byB[x.b] = (byB[x.b] || 0) + 1; });
    const byT = {}; out.forEach(x => { byT[x.t] = (byT[x.t] || 0) + 1; });
    console.log(`${kind}: ${out.length} kept, ${rejected.length} rejected  ${JSON.stringify(byB)}  ${JSON.stringify(byT)}`);
    if (report || rejected.length < 40) rejected.forEach(r => console.log('  ✗ ' + r));
    bad += rejected.length;
  });
}
module.exports = { buildKind, PREP, PREP_PERSONS, MAKERS };
