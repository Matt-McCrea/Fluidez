#!/usr/bin/env node
/* Tests for Ṭalāqa (arabiya/): the script rules, the checker, the data.
 *   node tools/test-arabiya.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const AR = require(path.join(ROOT, 'arabiya/js/ar-text.js'));

let fails = 0, passes = 0;
function eq(got, want, what) {
  if (got === want) { passes++; return; }
  fails++; console.log(`FAIL ${what}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
}

// ---- stripping and fading ----------------------------------------------------
eq(AR.strip('كَتَبَ'), 'كتب', 'strip');
eq(AR.strip('مُعَلِّمٌ'), 'معلم', 'strip shadda and tanwin');
eq(AR.strip('ﻻ'), 'لا', 'lam-alif ligature');
eq(AR.strip('کتاب'), 'كتاب', 'Persian kaf');
eq(AR.strip('كيف حالك؟'), 'كيف حالك', 'question mark');
eq(AR.strip('كـتـاب'), 'كتاب', 'tatweel');
eq(AR.fade('مُعَلِّم', 'help'), 'معلّم', 'help keeps shadda');
eq(AR.fade('كُتِبَ', 'help', 'كُتِب'), 'كُتِب', 'help form wins');
eq(AR.fade('كَتَبَ', 'full'), 'كَتَبَ', 'full');
eq(AR.fade('كَتَبَ', 'bare'), 'كتب', 'bare');

// ---- checker -------------------------------------------------------------------
eq(AR.check('كتب', ['كَتَبَ']), 'good', 'vowels optional');
eq(AR.check('كَتَبَ', ['كتب']), 'good', 'vowels typed');
eq(AR.check('كُتُب', ['كَتَبَ']), 'good', 'wrong vowels never count');
eq(AR.check('مدرسه', ['مَدْرَسَة']), 'near', 'ta marbuta as ha');
eq(AR.check('اكل', ['أَكَلَ']), 'near', 'hamza seat missing');
eq(AR.check('مستشفي', ['مُسْتَشْفَى']), 'near', 'alif maqsura as ya');
eq(AR.check('بيت', ['بَاب']), 'wrong', 'wrong word');
eq(AR.check('', ['بَاب']), 'wrong', 'empty');
eq(AR.slip('مدرسه', 'مَدْرَسَة'), 'marbuta', 'slip marbuta');
eq(AR.slip('اكل', 'أَكَلَ'), 'hamza', 'slip hamza');

// ---- shapes --------------------------------------------------------------------
eq(AR.forms('ب').initial, 'بـ', 'b initial');
eq(AR.forms('ب').medial, 'ـبـ', 'b medial');
eq(AR.forms('د').initial, 'د', 'd does not join');
eq(AR.forms('ر').medial, 'ـر', 'r medial');
eq(AR.joins('و'), false, 'waw non-joiner');

// ---- transliteration -------------------------------------------------------------
[['كِتَاب', 'kitāb'], ['مَدْرَسَة', 'madrasa'], ['الشَّمْس', 'ash-shams'], ['الْقَمَر', 'al-qamar'],
 ['بَيْت', 'bayt'], ['يَوْم', 'yawm'], ['كَبِير', 'kabīr'], ['مُعَلِّم', 'muʿallim'], ['أَنَا', 'anā'],
 ['شُكْرًا', 'shukran'], ['يَقُولُونَ', 'yaqūlūna'], ['اِسْتَخْدَمَ', 'istakhdama'], ['سُورِيَّة', 'sūriyya'],
 ['مُسْتَشْفَى', 'mustashfā'], ['قُرْآن', 'qurʾān'], ['سَأَلَ', 'saʾala'], ['بَاب', 'bāb'],
 ['الْبَيْت', 'al-bayt'], ['النُّور', 'an-nūr'], ['مَاء', 'māʾ'], ['أُمّ', 'umm'], ['شَاي', 'shāy'], ['عَرَبِيّ', 'ʿarabī']]
  .forEach(([a, b]) => eq(AR.translit(a), b, 'translit ' + a));

// ---- data hygiene (as the data lands) ---------------------------------------------
(function noOtherKeys(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return noOtherKeys(p);
    if (/\.(js|html)$/.test(d.name) && /['"](fluidez|liofa)\./.test(fs.readFileSync(p, 'utf8'))) eq(p, null, 'foreign storage key in');
  });
})(path.join(ROOT, 'arabiya'));

const checks = path.join(__dirname, 'ar', 'checks');
if (fs.existsSync(checks)) fs.readdirSync(checks).filter(f => f.endsWith('.js')).sort().forEach(f => {
  const r = require(path.join(checks, f))({ AR, eq, ROOT });
  if (r) console.log(`  ${f}: ${r}`);
});

console.log(`${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
