/* Svobodno: the Russian text rules. Stress marks (the acute, U+0301, written
 * after the stressed vowel), fading, the answer checker and a phonetic learner
 * transliteration that says what the word sounds like (хорошо́ → kharashó).
 * Works in the browser (window.RU) and in node (module.exports). ES5. */
(function (root) {
  'use strict';

  var ACUTE = '́', GRAVE = '̀';
  var VOWELS = 'аеёиоуыэюя';
  var VOICED = { 'б': 'п', 'в': 'ф', 'г': 'к', 'д': 'т', 'ж': 'ш', 'з': 'с' };
  var VOICELESS = { 'п': 'б', 'ф': 'в', 'к': 'г', 'т': 'д', 'ш': 'ж', 'с': 'з' };
  var DEVOICERS = 'пфктшсхцчщ';           // voiceless: a voiced consonant before one loses its voice
  var VOICERS = 'бгджз';                   // voiced (not в): a voiceless one before one gains voice

  function nfc(s) { return s.normalize ? s.normalize('NFC') : s; }
  function isVowel(c) { return VOWELS.indexOf(c) !== -1; }

  /* OpenRussian writes stress as an apostrophe after the vowel (сказа'ть). */
  function fromApostrophe(s) { return String(s || '').replace(/([аеёиоуыэюяАЕЁИОУЫЭЮЯ])'/g, '$1' + ACUTE); }

  /* What a learner might type or paste, made comparable: Latin look-alikes
   * mapped back, punctuation dropped, spaces collapsed. Stress marks kept. */
  function normalize(s) {
    s = nfc(String(s || '')).replace(/­|[​-‏﻿]/g, '');
    // a decomposed й or ё (и + breve, е + diaeresis) composes under NFC; Latin twins typed by mistake
    s = s.replace(/[aA]/g, function (c) { return c === 'a' ? 'а' : 'А'; })
         .replace(/[eE]/g, function (c) { return c === 'e' ? 'е' : 'Е'; })
         .replace(/[oO]/g, function (c) { return c === 'o' ? 'о' : 'О'; })
         .replace(/[cC]/g, function (c) { return c === 'c' ? 'с' : 'С'; })
         .replace(/p/g, 'р').replace(/x/g, 'х').replace(/y/g, 'у');
    s = s.replace(/[«»"“”„.!?,:;()\[\]\-–—…]/g, ' ').replace(/\s+/g, ' ').trim();
    return s;
  }

  /* No stress marks, lower case, ё written as е (as most Russians write it). */
  function strip(s) {
    return normalize(s).replace(new RegExp('[' + ACUTE + GRAVE + ']', 'g'), '').toLowerCase().replace(/ё/g, 'е');
  }

  /* Spelling slips that make a near miss: й for и, щ for ш, э for е, a soft
   * or hard sign left out or swapped. */
  function loose(s) {
    return strip(s).replace(/й/g, 'и').replace(/щ/g, 'ш').replace(/э/g, 'е').replace(/[ьъ]/g, '');
  }

  function hasMarks(s) { return String(s || '').indexOf(ACUTE) !== -1; }

  /* How much help to show. 'full': stress marks as stored. 'help' and 'bare':
   * none, as in a book for adults (ё stays: it marks its own stress). */
  function fade(s, level) {
    if (level === 'full') return String(s || '');
    return String(s || '').replace(new RegExp('[' + ACUTE + GRAVE + ']', 'g'), '');
  }

  /* Typed answer against the accepted forms. Stress marks and ё never count.
   * Returns 'good', 'near' or 'wrong'. */
  function check(input, accepted) {
    var a = [].concat(accepted || []).filter(Boolean);
    var t = strip(input);
    if (!t) return 'wrong';
    var i;
    for (i = 0; i < a.length; i++) if (strip(a[i]) === t) return 'good';
    var tl = loose(input);
    for (i = 0; i < a.length; i++) if (loose(a[i]) === tl) return 'near';
    return 'wrong';
  }

  /* What kind of slip a near miss was, for the note under the answer. */
  function slip(input, answer) {
    var t = strip(input), a = strip(answer);
    if (/[ьъ]/.test(a) && a.replace(/[ьъ]/g, '') === t.replace(/[ьъ]/g, '')) return 'sign';
    if (/й/.test(a) !== /й/.test(t)) return 'kratkoe';
    if (/щ/.test(a) !== /щ/.test(t)) return 'shch';
    if (/э/.test(a) !== /э/.test(t)) return 'e';
    return 'spelling';
  }

  /* ---- the stressed vowel of a word ----------------------------------------
   * The vowel before an acute, or ё, or the only vowel. -1 when unknown. */
  function vowelsOf(w) { var v = [], i; for (i = 0; i < w.length; i++) if (isVowel(w.charAt(i))) v.push(i); return v; }
  function stressOf(w) {
    var i = w.indexOf(ACUTE);
    if (i > 0) return i - 1;
    i = w.indexOf('ё');
    if (i !== -1) return i;
    var v = vowelsOf(w);
    return v.length === 1 ? v[0] : -1;
  }

  /* Polysyllabic words with no stress shown: the gate for learner text. */
  function unstressed(s) {
    var bad = [];
    nfc(String(s || '')).replace(/[«»"“”„.!?,:;()\[\]–—…]/g, ' ').split(/[\s\-]+/).forEach(function (w) {
      var lw = w.toLowerCase();
      if (vowelsOf(lw).length < 2) return;
      if (lw.indexOf(ACUTE) === -1 && lw.indexOf(GRAVE) === -1 && lw.indexOf('ё') === -1) bad.push(w);
    });
    return bad;
  }

  /* ---- transliteration -----------------------------------------------------
   * A spelling for saying the word, not for scholars: unstressed о is a,
   * unstressed е and я after a consonant are i, a final or pre-voiceless
   * voiced consonant loses its voice, -ться is tsa, -ого is -ova. The stressed
   * vowel carries an acute in words of more than one syllable. */
  var WORDS = {
    'что': 'shto', 'чтобы': 'shtóby', 'конечно': 'kanyéshna', 'скучно': 'skúshna',
    'сегодня': 'sivódnya', 'его': 'yivó', 'ничего': 'nichivó', 'здравствуй': 'zdrástvuy',
    'здравствуйте': 'zdrástvuytye', 'солнце': 'sóntse', 'чувство': 'chústva', 'пожалуйста': 'pazhálsta',
    'счастье': 'shchástye', 'сейчас': 'sichás', 'лестница': 'lyésnitsa', 'праздник': 'práznik'
  };
  var C = { 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ж': 'zh', 'з': 'z', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch' };
  var ACC = { 'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú', 'y': 'ý' };
  function accent(v) { return v.replace(/[aeiouy](?!.*[aeiouy])/, function (c) { return ACC[c]; }); }

  function translitWord(raw) {
    var lw = nfc(raw).toLowerCase();
    var bare = lw.replace(new RegExp('[' + ACUTE + GRAVE + ']', 'g'), '');
    var cap = function (t) { return raw.charAt(0) !== raw.charAt(0).toLowerCase() ? t.charAt(0).toUpperCase() + t.slice(1) : t; };
    if (WORDS[bare.replace(/ё/g, 'е')]) return cap(WORDS[bare.replace(/ё/g, 'е')]);
    // сч and зч are said щ: счёт shchot, мужчина mushchína
    lw = lw.replace(/[сзж]ч/g, 'щ');
    var st = stressOf(lw);
    // work on the bare letters, remembering which one is stressed
    var L = [], i, c;
    for (i = 0; i < lw.length; i++) {
      c = lw.charAt(i);
      if (c === ACUTE || c === GRAVE) continue;
      L.push({ c: c, s: i === st });
    }
    var w = L.map(function (x) { return x.c; }).join('');
    var polysyll = vowelsOf(w).length > 1, known = st !== -1;
    // -ться / -тся
    if (/ть?ся$/.test(w)) { L.splice(L.length - (/ться$/.test(w) ? 4 : 3), 4, { c: 'ц', s: false }, { c: 'а', s: false }); }
    // -ого / -его (adjective and pronoun endings): г is said v
    w = L.map(function (x) { return x.c; }).join('');
    if (/[оеё]го$/.test(w) && L.length > 3) L[L.length - 2].c = 'в';
    // voice assimilation, right to left, then final devoicing
    for (i = L.length - 1; i >= 0; i--) {
      c = L[i].c;
      var next = null, j = i + 1;
      while (j < L.length && (L[j].c === 'ь' || L[j].c === 'ъ')) j++;
      next = j < L.length ? L[j].c : null;
      if (VOICED[c] && (next === null || DEVOICERS.indexOf(next) !== -1)) L[i].c = VOICED[c];
      else if (VOICELESS[c] && next && VOICERS.indexOf(next) !== -1) L[i].c = VOICELESS[c];
    }
    var out = '', prev = null, k;
    for (k = 0; k < L.length; k++) {
      var x = L[k], ch = x.c, last = k === L.length - 1;
      var afterCons = prev && !isVowel(prev) && prev !== 'ь' && prev !== 'ъ';
      var hard = prev === 'ж' || prev === 'ш' || prev === 'ц';
      var hush = prev === 'ч' || prev === 'щ';
      var red = known && polysyll && !x.s;          // reduced: unstressed in a word whose stress is known
      var v = null;
      switch (ch) {
        case 'а': v = red && hush ? 'i' : 'a'; break;
        case 'о': v = red ? 'a' : 'o'; break;
        case 'у': v = 'u'; break;
        case 'ы': v = 'y'; break;
        case 'э': v = 'e'; break;
        case 'и': v = hard ? 'y' : (prev === 'ь' ? 'yi' : 'i'); break;
        case 'е': v = afterCons ? (hard ? (red ? 'y' : 'e') : (red ? 'i' : 'e')) : (red ? (last ? 'ye' : 'yi') : 'ye'); break;
        case 'ё': v = afterCons ? (hard || hush ? 'o' : 'yo') : 'yo'; break;
        case 'ю': v = 'yu'; break;
        case 'я': v = afterCons ? (red && !last ? 'i' : 'ya') : (red && !last ? 'yi' : 'ya'); break;
      }
      if (v !== null) {
        out += x.s && polysyll ? accent(v) : v;
      } else if (ch === 'ь') {
        out += (k + 1 < L.length && isVowel(L[k + 1].c)) ? '' : 'ʹ';
      } else if (ch === 'ъ') {
        out += '';
      } else out += C[ch] != null ? C[ch] : ch;
      prev = ch;
    }
    // ё after a consonant reads as "yo" for the eye; after ь and a vowel the y is already the letter's own
    out = out.replace(/ʹ$/, 'ʹ');
    return cap(out);
  }

  /* Little words said as part of the next one, so their vowel is reduced too. */
  var PROCLITIC = { 'до': 'da', 'по': 'pa', 'со': 'sa', 'во': 'va', 'ко': 'ka', 'о': 'a', 'об': 'ab', 'обо': 'aba', 'от': 'at', 'не': 'ni' };
  function translit(s) {
    var parts = nfc(String(s || '')).split(/(\s+|[«»"“”„.!?,:;()\[\]–—…\-])/);
    return parts.map(function (p, i) {
      if (!/[а-яё]/i.test(p)) return p;
      var lw = p.toLowerCase(), pro = PROCLITIC[lw];
      if (pro && parts[i + 1] && /^\s+$/.test(parts[i + 1]) && parts[i + 2] && /[а-яё]/i.test(parts[i + 2])) {
        return p.charAt(0) !== lw.charAt(0) ? pro.charAt(0).toUpperCase() + pro.slice(1) : pro;
      }
      return translitWord(p);
    }).join('');
  }

  /* The thirty-three letters, in alphabet order. */
  var ALPHABET = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

  var RU = {
    ACUTE: ACUTE, ALPHABET: ALPHABET,
    normalize: normalize, strip: strip, loose: loose, hasMarks: hasMarks, fade: fade,
    check: check, slip: slip, translit: translit, stressOf: stressOf, unstressed: unstressed,
    fromApostrophe: fromApostrophe
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = RU;
  else root.RU = RU;
})(this);
