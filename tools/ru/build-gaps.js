#!/usr/bin/env node
/* Svobodno gap banks into russkiy/data/gaps-<kind>.js (window.RU_BANK), gated.
 *   node tools/ru/build-gaps.js            all kinds
 *   node tools/ru/build-gaps.js --check    gate only, write nothing
 *
 * Bank item, as in Ṭalāqa: { k, q (sentence with ___), c (cue), a (answer), o (4 options,
 * a among them), e (English), w (why), b (band), t, v, p }.
 *
 * Authored frames (the answer is never typed by hand; it is computed):
 *   src/glagoly/*.json, src/vid/*.json, src/dvizhenie/*.json:
 *     { q, v (infinitive, no stress), t: pres|past|fut|imp, p: ya|ty|on|ona|ono|my|vy|oni,
 *       g?: m|f (for ya/ty in the past), e, b, w? }
 *   src/padezhi/*.json: { q, n (noun, nominative, no stress), c: nom|gen|dat|acc|inst|prep,
 *       num?: sg|pl, e, b, w? }
 * Generated: chisla (a number and a noun: 1 рубль, 2 рубля, 5 рублей) from src/chisla.json. */
'use strict';
const fs = require('fs');
const path = require('path');
const RU = require('../../russkiy/js/ru-text.js');
const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(__dirname, 'src');
const CHECK = process.argv.includes('--check');

const VERBS = require(path.join(ROOT, 'russkiy/data/verbs.js'));
const VB = {}; VERBS.forEach(v => { VB[RU.strip(v.inf)] = v; });
let NOUNS = {};
try { NOUNS = require(path.join(ROOT, 'russkiy/data/nouns.js')); } catch (e) {}
let NFIX = {};
try { NFIX = JSON.parse(fs.readFileSync(path.join(SRC, 'noun-fix.json'), 'utf8')); } catch (e) {}

const PERSON = { ya: 0, ty: 1, on: 2, ona: 2, ono: 2, my: 3, vy: 4, oni: 5 };
const PLABEL = { ya: 'I', ty: 'you', on: 'he', ona: 'she', ono: 'it', my: 'we', vy: 'you (polite, plural)', oni: 'they' };
const BUDU = ['бу́ду', 'бу́дешь', 'бу́дет', 'бу́дем', 'бу́дете', 'бу́дут'];
const TNAME = { pres: 'present', past: 'past', fut: 'future', imp: 'order' };

function genderOf(f) {
  if (f.p === 'on') return 'm'; if (f.p === 'ona') return 'f'; if (f.p === 'ono') return 'n';
  if (f.p === 'my' || f.p === 'vy' || f.p === 'oni') return 'pl';
  return f.g || 'm';
}
/* The form of verb v for tense t and person p ('' when there is none). */
function form(v, t, p, g) {
  const i = PERSON[p];
  if (t === 'pres') return v.asp === 'i' && v.pres ? v.pres[i] : '';
  if (t === 'past') return v.past[g] || '';
  if (t === 'fut') return v.asp === 'p' ? v.fut[i] : (RU.strip(v.inf) === 'быть' ? v.fut[i] : BUDU[i] + ' ' + v.inf);
  if (t === 'imp') return p === 'ty' ? v.imp.sg : p === 'vy' ? v.imp.pl : '';
  return '';
}
function otherG(g) { return ['m', 'f', 'pl', 'n'].filter(x => x !== g); }
function uniq(list, a) {
  const seen = new Set([RU.strip(a)]), out = [];
  list.forEach(x => { if (x && !seen.has(RU.strip(x))) { seen.add(RU.strip(x)); out.push(x); } });
  return out;
}
function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function shuffle(a, r) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const MOTION_FAMILY = { 'идти': 'ходить', 'ходить': 'идти', 'ехать': 'ездить', 'ездить': 'ехать', 'лететь': 'летать', 'летать': 'лететь',
  'плыть': 'плавать', 'плавать': 'плыть', 'бежать': 'бегать', 'бегать': 'бежать', 'нести': 'носить', 'носить': 'нести',
  'вести': 'водить', 'водить': 'вести', 'везти': 'возить', 'возить': 'везти' };
const FOOT_RIDE = { 'идти': 'ехать', 'ехать': 'идти', 'ходить': 'ездить', 'ездить': 'ходить', 'пойти': 'поехать', 'поехать': 'пойти',
  'прийти': 'приехать', 'приехать': 'прийти', 'приходить': 'приезжать', 'приезжать': 'приходить', 'уйти': 'уехать', 'уехать': 'уйти',
  'уходить': 'уезжать', 'уезжать': 'уходить' };

let errs = 0;
const bad = (where, m) => { errs++; console.log(where + ': ' + m); };
function frames(dir) {
  const d = path.join(SRC, dir);
  if (!fs.existsSync(d)) return [];
  const out = [];
  fs.readdirSync(d).filter(f => f.endsWith('.json')).sort().forEach(f => {
    JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')).forEach((x, i) => { x._at = dir + '/' + f + '#' + i; out.push(x); });
  });
  return out;
}
function common(f, kind) {
  const q = RU.fromApostrophe(f.q);
  if ((q.match(/___/g) || []).length !== 1) { bad(f._at, 'needs exactly one ___'); return null; }
  const un = RU.unstressed(q.replace('___', ' ')); if (un.length) { bad(f._at, 'no stress on ' + un.join(' ')); return null; }
  if (!f.e || !f.b) { bad(f._at, 'needs e and b'); return null; }
  if (/[–—]|\s-\s/.test(f.e + (f.w || ''))) { bad(f._at, 'dash'); return null; }
  if (/'/.test(q)) { bad(f._at, 'stray apostrophe'); return null; }
  return q;
}

/* ---- verbs: Глаголы, Вид, Движение ----------------------------------------------- */
function verbItem(f, kind) {
  const q = common(f, kind); if (!q) return null;
  const v = VB[f.v]; if (!v) { bad(f._at, 'verb not in verbs.js: ' + f.v); return null; }
  if (!(f.p in PERSON)) { bad(f._at, 'bad person ' + f.p); return null; }
  const g = genderOf(f), a = form(v, f.t, f.p, g);
  if (!a) { bad(f._at, f.v + ' has no ' + f.t + ' for ' + f.p); return null; }
  const others = [];
  const add = (vv, t, p, gg) => { if (vv) others.push(form(vv, t, p, gg || genderOf({ p, g }))); };
  const partner = v.pair ? VB[v.pair] : null;
  const alt = p => ({ ya: 'ty', ty: 'ya', on: 'oni', ona: 'oni', ono: 'oni', my: 'oni', vy: 'ty', oni: 'on' })[p];
  if (kind === 'vid') {
    if (!partner) { bad(f._at, f.v + ' has no aspect partner'); return null; }
    const pt = f.t === 'pres' ? 'fut' : f.t;          // a perfective has no present: its nearest form is the future
    add(partner, pt, f.p, g);
    if (f.t === 'past') { otherG(g).forEach(gg => { add(v, 'past', f.p, gg); add(partner, 'past', f.p, gg); }); }
    else { add(v, f.t, alt(f.p)); add(partner, pt, alt(f.p)); }
  } else if (kind === 'dvizhenie') {
    add(VB[MOTION_FAMILY[f.v]], f.t, f.p); add(VB[FOOT_RIDE[f.v]], f.t, f.p);
    add(v, f.t === 'past' ? 'pres' : 'past', f.p);
    if (f.t === 'past') otherG(g).forEach(gg => add(v, 'past', f.p, gg)); else add(v, f.t, alt(f.p));
    if (partner) add(partner, f.t === 'pres' ? 'fut' : f.t, f.p);
  } else {
    ['pres', 'past', 'fut'].filter(t => t !== f.t).forEach(t => add(v, t, f.p));
    if (f.t === 'past') otherG(g).forEach(gg => add(v, 'past', f.p, gg));
    else { add(v, f.t, alt(f.p)); add(v, f.t, f.p === 'my' ? 'vy' : 'my'); }
    if (f.t === 'pres' && partner) add(partner, 'fut', f.p);
    if (f.t === 'imp') { add(v, 'imp', f.p === 'ty' ? 'vy' : 'ty'); add(v, 'pres', 'ty'); }
  }
  const wrong = uniq(others, a);
  if (wrong.length < 3) { bad(f._at, 'only ' + wrong.length + ' distinct wrong options'); return null; }
  const r = rng(hash(f.q + f.v));
  const pickW = kind === 'vid' ? wrong.slice(0, 3) : shuffle(wrong.slice(), r).slice(0, 3);
  const o = shuffle([a].concat(pickW), r);
  const gloss = (v.en || '').split(',')[0].replace(/\s*\(.*$/, '');
  const c = kind === 'vid' ? gloss + ' · ' + PLABEL[f.p] + ' · ' + TNAME[f.t]
          : kind === 'dvizhenie' ? PLABEL[f.p]
          : gloss + ' · ' + PLABEL[f.p];
  return { k: kind, q, c, a, o, e: f.e, w: f.w ? RU.fromApostrophe(f.w) : defaultWhy(kind, f, v), b: f.b, t: f.t, v: v.inf, p: f.p };
}
function defaultWhy(kind, f, v) {
  if (kind === 'vid') return v.asp === 'p' ? 'Perfective: one finished action, with a result.' : 'Imperfective: an action in progress, repeated, or just named.';
  if (kind === 'dvizhenie') return v.motion === 'uni' ? 'One trip in one direction, under way.' : v.motion === 'multi' ? 'Round trips, habits, or moving about.' : 'A prefix gives the direction.';
  return { pres: 'Present: now, or as a habit.', past: 'Past: the ending agrees with who did it (m, f, n, plural).', fut: 'Future.', imp: 'An order or a request.' }[f.t];
}

/* ---- nouns: Падежи ------------------------------------------------------------------ */
const CASES = ['nom', 'gen', 'dat', 'acc', 'inst', 'prep'];
const CNAME = { nom: 'nominative', gen: 'genitive', dat: 'dative', acc: 'accusative', inst: 'instrumental', prep: 'prepositional' };
function nounForms(n) {
  const t = NOUNS[n], fx = NFIX[n] || {};
  if (!t) return null;
  const fa = x => x ? RU.fromApostrophe(x) : x;
  return { sg: CASES.map((c, i) => fa(fx.sg && fx.sg[i]) || t.sg[i]), pl: CASES.map((c, i) => fa(fx.pl && fx.pl[i]) || t.pl[i]) };
}
function caseItem(f) {
  const q = common(f, 'padezhi'); if (!q) return null;
  const F = nounForms(f.n); if (!F) { bad(f._at, 'noun not in nouns.js: ' + f.n); return null; }
  const num = f.num || 'sg', ix = CASES.indexOf(f.c);
  if (ix < 0) { bad(f._at, 'bad case ' + f.c); return null; }
  const a = F[num][ix];
  if (!a) { bad(f._at, f.n + ' has no ' + num + ' ' + f.c); return null; }
  const wrong = uniq(F[num].concat(F[num === 'sg' ? 'pl' : 'sg']), a);
  if (wrong.length < 3) { bad(f._at, 'only ' + wrong.length + ' distinct wrong options'); return null; }
  const r = rng(hash(f.q + f.n));
  const o = shuffle([a].concat(shuffle(wrong.slice(0, 5), r).slice(0, 3)), r);
  return { k: 'padezhi', q, c: F.sg[0] + (num === 'pl' ? ' · plural' : ''), a, o, e: f.e, w: f.w ? RU.fromApostrophe(f.w) : 'The ' + CNAME[f.c] + ' case.', b: f.b, t: f.c, v: F.sg[0], p: num };
}

/* ---- numbers: Числа (generated) ------------------------------------------------------- */
function numberForm(n) {
  const d = n % 10, dd = n % 100;
  if (dd >= 11 && dd <= 14) return 2;
  if (d === 1) return 0; if (d >= 2 && d <= 4) return 1; return 2;
}
function chisla() {
  let C; try { C = JSON.parse(fs.readFileSync(path.join(SRC, 'chisla.json'), 'utf8')); } catch (e) { return []; }
  const out = [], NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 20, 21, 22, 24, 25, 30, 31, 33, 40, 41, 45, 50, 52, 100, 101, 103];
  const sets = C.nouns.map(x => [x, C.frames]).concat((C.time || []).map(x => [x, C.time_frames.concat(x.f[0] === 'год' && C.age ? [C.age] : [])]));
  sets.forEach(([x, FR], k) => {
    const forms = x.f.map(RU.fromApostrophe);
    if (forms.some(f => RU.unstressed(f).length)) { bad('chisla ' + x.f[0], 'no stress'); return; }
    if (new Set(forms.map(RU.strip)).size !== 3) { bad('chisla ' + x.f[0], 'the three forms must differ'); return; }
    const r = rng(hash(x.f[0]));
    shuffle(NUMS.slice(), r).slice(0, 8).forEach(n => {
      const fi = numberForm(n), frame = FR[(k + n) % FR.length];
      const a = forms[fi], en = n + ' ' + (n === 1 ? x.en[0] : x.en[1]);
      const extra = x.x ? RU.fromApostrophe(x.x) : null;   // a fourth option (the nominative plural)
      const o = shuffle(forms.concat(extra && RU.strip(extra) !== RU.strip(a) && forms.every(f => RU.strip(f) !== RU.strip(extra)) ? [extra] : []), r);
      out.push({ k: 'chisla', q: RU.fromApostrophe(frame.q).replace('{n}', String(n)), c: forms[0], a, o,
        e: (frame.e.charAt(0) === '{' ? en.charAt(0).toUpperCase() + en.slice(1) + frame.e.slice(3) : frame.e.replace('{x}', en)), w: ['After 1 (21, 31...): the nominative singular.', 'After 2, 3, 4 (22, 33...): the genitive singular.', 'After 5 to 20, and 25, 30...: the genitive plural.'][fi],
        b: n < 11 ? 'A1' : 'A2', t: String(fi), v: forms[0], p: String(n) });
    });
  });
  return out;
}

/* ---- build ---------------------------------------------------------------------------- */
const KINDS = {
  glagoly: () => frames('glagoly').map(f => verbItem(f, 'glagoly')),
  vid: () => frames('vid').map(f => verbItem(f, 'vid')),
  dvizhenie: () => frames('dvizhenie').map(f => verbItem(f, 'dvizhenie')),
  padezhi: () => frames('padezhi').map(caseItem),
  chisla: chisla
};
const built = {};
Object.keys(KINDS).forEach(k => {
  const seen = new Set();
  built[k] = KINDS[k]().filter(Boolean).filter(x => {
    if (x.o.length < 3 || x.o.indexOf(x.a) === -1) { bad(k + ' ' + x.q, 'answer not among options'); return false; }
    const key = x.q + '|' + x.a; if (seen.has(key)) return false; seen.add(key); return true;
  });
});
Object.keys(built).forEach(k => console.log(k + ': ' + built[k].length));
if (errs) { console.log(errs + ' errors' + (CHECK ? '' : ', nothing written')); process.exit(1); }
if (CHECK) process.exit(0);
Object.keys(built).forEach(k => {
  const file = path.join(ROOT, 'russkiy/data', 'gaps-' + k + '.js');
  if (!built[k].length && fs.existsSync(file)) return;    // never overwrite a bank with an empty one
  fs.writeFileSync(file, '/* Svobodno ' + k + ' bank: generated by tools/ru/build-gaps.js. Do not edit. */\n' +
    '(window.RU_BANK = window.RU_BANK || []).push.apply(window.RU_BANK, ' + JSON.stringify(built[k]) + ');\n');
});
