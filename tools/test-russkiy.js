#!/usr/bin/env node
/* Svobodno: the text rules (russkiy/js/ru-text.js) and the data gates.
 *   node tools/test-russkiy.js */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const RU = require(path.join(ROOT, 'russkiy/js/ru-text.js'));
let pass = 0, fail = 0;
function eq(a, b, what) { if (a === b) pass++; else { fail++; console.log('FAIL ' + what + ': got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b)); } }
function ok(c, what) { if (c) pass++; else { fail++; console.log('FAIL ' + what); } }
const A = s => RU.fromApostrophe(s);

// transliteration: what the word sounds like
[["хорошо'", 'kharashó'], ["молоко'", 'malakó'], ["язы'к", 'yizýk'], ["вре'мя", 'vrémya'], ["телефо'н", 'tilifón'],
 ["кра'сного", 'krásnava'], ['хлеб', 'khlep'], ["вто'рник", 'ftórnik'], ["сде'лать", 'zdélatʹ'], ["вокза'л", 'vagzál'],
 ["учи'ться", 'uchítsa'], ['жизнь', 'zhyznʹ'], ["часы'", 'chisý'], ["семья'", 'simyá'], ['ещё', 'yishchó'], ['счёт', 'shchot'],
 ["пожа'луйста", 'pazhálsta'], ["Пожа'луйста", 'Pazhálsta'], ['что', 'shto'], ["До свида'ния", 'Da svidániya'],
 ["я не понима'ю", 'ya ni panimáyu'], ["большо'е", 'balʹshóye'], ['чёрный', 'chórnyy'], ['моё', 'mayó'], ["Москва'", 'Maskvá']
].forEach(([ru, tr]) => eq(RU.translit(A(ru)), tr, 'translit ' + ru));

// checking typed answers: stress and ё never count; small slips are near misses
eq(RU.check('хорошо', [A("хорошо'")]), 'good', 'stress ignored');
eq(RU.check('Хорошо!', [A("хорошо'")]), 'good', 'case and punctuation ignored');
eq(RU.check('еще', ['ещё']), 'good', 'е for ё');
eq(RU.check('ещe', ['ещё']), 'good', 'Latin e typed by mistake');
eq(RU.check('мат', ['мать']), 'near', 'soft sign left out');
eq(RU.check('шесть', ['щесть']), 'near', 'ш for щ');
eq(RU.check('мои', ['мой']), 'near', 'и for й');
eq(RU.check('дом', ['кот']), 'wrong', 'wrong word');
eq(RU.check('', ['кот']), 'wrong', 'empty');
eq(RU.slip('мат', 'мать'), 'sign', 'slip: sign');
eq(RU.fade(A("молоко'"), 'bare'), 'молоко', 'fade bare drops stress');
eq(RU.fade(A("молоко'"), 'full'), A("молоко'"), 'fade full keeps it');
eq(RU.unstressed(A("Как дела', хорошо?")).join(), 'хорошо', 'unstressed finds the bare word');
eq(RU.unstressed('ёж и кот').length, 0, 'monosyllables and ё need no mark');

// letters: all 33, each lesson word only uses letters taught by then, every word stressed
const { RU_LETTERS: L, RU_LESSONS: LS } = require(path.join(ROOT, 'russkiy/data/letters.js'));
eq(new Set(L.map(l => l.ch)).size, 33, 'thirty-three letters');
ok(RU.ALPHABET.split('').every(c => L.some(l => l.ch === c)), 'every letter in a lesson');
LS.forEach(s => {
  const known = new Set(L.filter(l => l.lesson <= s.n).map(l => l.ch));
  s.words.forEach(w => {
    ok([...RU.strip(w.ru)].every(c => c === ' ' || known.has(c)), 'lesson ' + s.n + ' ' + w.ru + ' uses only letters taught');
    eq(RU.unstressed(w.ru).length, 0, 'lesson ' + s.n + ' ' + w.ru + ' stressed');
  });
});

// data files that exist: no dashes in learner prose, stress everywhere
function load(f) { const p = path.join(ROOT, 'russkiy/data', f); return fs.existsSync(p) ? require(p) : null; }
const P = load('phrases.js');
if (P) P.forEach(p => {
  eq(RU.unstressed(p.ru).length, 0, 'phrase ' + p.id + ' stressed');
  ok(!/[–—]|\s-\s/.test(p.en + (p.n || '') + p.tr), 'phrase ' + p.id + ' no dash');
});
const SP = load('speak.js');
if (SP && P) SP.forEach(k => k.ids.concat(k.dialogue.map(d => d.id)).forEach(id => ok(P.some(p => p.id === id), 'pack ' + k.n + ' ' + id)));
const V = load('verbs.js');
if (V) V.forEach(v => {
  const forms = [v.inf].concat(v.pres || v.fut).concat([v.past.m, v.past.f, v.past.n, v.past.pl]).filter(Boolean);
  ok(forms.every(f => !RU.unstressed(f).length), 'verb ' + v.inf + ' stressed');
  if (v.pair) ok(V.some(o => RU.strip(o.inf) === v.pair), 'verb ' + v.inf + ' partner ' + v.pair + ' present');
});
const W = load('words.js');
if (W) W.forEach(w => { ok(!RU.unstressed(w.ru).length, 'word ' + w.ru + ' stressed'); ok(!/[–—]/.test(w.en), 'word ' + w.ru + ' no dash'); });

console.log(pass + ' passed' + (fail ? ', ' + fail + ' FAILED' : ''));
process.exit(fail ? 1 : 0);
