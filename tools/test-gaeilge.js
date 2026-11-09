#!/usr/bin/env node
/* Tests for Líofa (gaeilge/): the mutation rules, the verb particles, the
 * answer checker, and every content bank's answers recomputed.
 *   node tools/test-gaeilge.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const GA = require(path.join(ROOT, 'gaeilge/js/ga-text.js'));
const V = require(path.join(ROOT, 'gaeilge/data/verbs.js'));

let fails = 0, passes = 0;
function eq(got, want, what) {
  if (got === want) { passes++; return; }
  fails++; console.log(`FAIL ${what}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
}

// ---- séimhiú, urú, prefixes ----------------------------------------------
[['cara', 'chara'], ['bord', 'bhord'], ['Baile', 'Bhaile'], ['sráid', 'shráid'], ['slán', 'shlán'],
 ['scoil', 'scoil'], ['spórt', 'spórt'], ['stáisiún', 'stáisiún'], ['smál', 'smál'],
 ['athair', 'athair'], ['leabhar', 'leabhar'], ['chara', 'chara'], ['fear', 'fhear'], ['madra', 'mhadra']]
  .forEach(([a, b]) => eq(GA.lenite(a), b, 'lenite ' + a));
eq(GA.lenite('doras', { noDental: true }), 'doras', 'dental rule');
[['bord', 'mbord'], ['cara', 'gcara'], ['doras', 'ndoras'], ['fear', 'bhfear'], ['gort', 'ngort'],
 ['páiste', 'bpáiste'], ['teach', 'dteach'], ['athair', 'n-athair'], ['Éirinn', 'nÉirinn'],
 ['Gaillimh', 'nGaillimh'], ['Baile', 'mBaile'], ['Corcaigh', 'gCorcaigh'], ['leabhar', 'leabhar'], ['sráid', 'sráid']]
  .forEach(([a, b]) => eq(GA.eclipse(a), b, 'eclipse ' + a));
eq(GA.tPrefix('uisce'), 't-uisce', 't- uisce'); eq(GA.tPrefix('Athair'), 'tAthair', 't capital');
eq(GA.tsPrefix('sráid'), 'tsráid', 'ts'); eq(GA.tsPrefix('scoil'), 'scoil', 'ts sc');
eq(GA.hPrefix('athair'), 'hathair', 'h');
[['chara', 'cara'], ['gcara', 'cara'], ['n-athair', 'athair'], ['nGaillimh', 'Gaillimh'], ['bhfear', 'fear'],
 ['tsráid', 'sráid'], ['t-uisce', 'uisce'], ["d'fhan", 'fan'], ["d'ól", 'ól']]
  .forEach(([a, b]) => eq(GA.demutate(a), b, 'demutate ' + a));

// ---- verb particles --------------------------------------------------------
const by = v => V.find(x => x.v === v);
[['', 'feic', 'caite', 'me', 'chonaic'], ['ní', 'feic', 'caite', 'me', 'fhaca'], ['an', 'feic', 'caite', 'tu', 'bhfaca'],
 ['ní', 'faigh', 'caite', 'se', 'bhfuair'], ['an', 'téigh', 'caite', 'si', 'ndeachaigh'], ['', 'téigh', 'caite', 'me', 'chuaigh'],
 ['ní', 'bí', 'lait', 'me', 'níl'], ['an', 'bí', 'lait', 'tu', 'bhfuil'], ['', 'bí', 'caite', 'me', 'bhí'],
 ['ní', 'bí', 'caite', 'me', 'raibh'], ['', 'ól', 'caite', 'me', "d'ól"], ['ní', 'ól', 'caite', 'me', 'ól'],
 ['', 'fan', 'caite', 'me', "d'fhan"], ['', 'ceannaigh', 'coinn', 'me', 'cheannóinn'], ['dá', 'bí', 'coinn', 'me', 'mbeinn'],
 ['dá', 'ól', 'coinn', 'me', 'n-ólfainn'], ['nach', 'ól', 'lait', 'se', 'n-ólann'], ['an', 'ól', 'lait', 'se', 'ólann'],
 ['ní', 'abair', 'caite', 'se', 'dúirt'], ['ní', 'faigh', 'fhaist', 'me', 'bhfaighidh'],
 ['', 'déan', 'caite', 'muid', 'rinneamar'], ['ní', 'déan', 'caite', 'muid', 'dhearnamar'], ['má', 'bí', 'gnathlait', 'tu', 'bhíonn'],
 ['ná', 'ól', 'ord', 'tu', 'hól'], ['', 'ceannaigh', 'caite', 'saor', 'ceannaíodh'], ['', 'tar', 'caite', 'me', 'tháinig'],
 ['ní', 'tar', 'caite', 'me', 'tháinig'], ['', 'ith', 'caite', 'me', "d'ith"], ['', 'bí', 'coinn', 'tu', 'bheifeá']]
  .forEach(([p, v, t, pe, want]) => eq(GA.formAfter(p, by(v), t, pe), want, `${p || '∅'} ${v} ${t} ${pe}`));
eq(GA.particleWord('ní', by('ól'), 'caite'), 'níor', 'níor');
eq(GA.formAfter('', by('faigh'), 'fhaist', 'me'), 'gheobhaidh', 'gheobhaidh');
eq(GA.formAfter('', by('faigh'), 'fhaist', 'saor'), 'gheofar', 'gheofar');
eq(GA.formAfter('a', by('faigh'), 'fhaist', 'se'), 'gheobhaidh', 'a gheobhaidh');
eq(by('léigh').f.coinn.muid[0], 'léifimis', 'léifimis override');
eq(GA.particleWord('an', by('feic'), 'caite'), 'an', 'an (irregular)');

// ---- checker ---------------------------------------------------------------
eq(GA.check('chonaic', ['chonaic']), 'good', 'exact');
eq(GA.check('Chonaic.', ['chonaic']), 'good', 'case and stop');
eq(GA.check('dfhan', ["d'fhan"]), 'wrong', 'apostrophe missing is wrong');
eq(GA.check('d’fhan', ["d'fhan"]), 'good', 'curly apostrophe');
eq(GA.check('ta', ['tá']), 'near', 'fada slip');
eq(GA.check('nolann', ['n-ólann']), 'near', 'hyphen + fada slip');
eq(GA.check('chara', ['cara']), 'wrong', 'wrong mutation');

// ---- data hygiene ------------------------------------------------------------
eq(V.length >= 150, true, 'verb count');
V.forEach(x => ['lait', 'caite', 'fhaist', 'coinn', 'gnath', 'ord'].forEach(t => {
  if (!x.f[t] || !Object.keys(x.f[t]).length) eq(t, null, x.v + ' has ' + t);
}));
(function noSpanishKeys(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return noSpanishKeys(p);
    if (/\.(js|html)$/.test(d.name) && /['"]fluidez\./.test(fs.readFileSync(p, 'utf8'))) eq(p, null, 'fluidez. storage key in');
  });
})(path.join(ROOT, 'gaeilge'));

// ---- banks: every answer recomputed (added as the banks land) ---------------
const banks = path.join(__dirname, 'ga', 'checks');
if (fs.existsSync(banks)) fs.readdirSync(banks).filter(f => f.endsWith('.js')).sort().forEach(f => {
  const r = require(path.join(banks, f))({ GA, V, eq });
  if (r) console.log(`  ${f}: ${r}`);
});

console.log(`${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
