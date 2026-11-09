/* Ṭalāqa: the Arabic script rules. Vowel marks (ḥarakāt), fading, the
 * answer checker, letter shapes and a learner transliteration.
 * Works in the browser (window.AR) and in node (module.exports). ES5. */
(function (root) {
  'use strict';

  var FATHA = 'َ', DAMMA = 'ُ', KASRA = 'ِ', SUKUN = 'ْ', SHADDA = 'ّ';
  var TAN_F = 'ً', TAN_D = 'ٌ', TAN_K = 'ٍ', DAGGER = 'ٰ', TATWEEL = 'ـ';
  var MARKS = /[ً-ٰٟ]/;          // every combining mark
  var MARKS_G = /[ً-ٰٟ]/g;
  var NONJOIN = 'اأإآٱدذرزوؤةء';                 // letters that never join to the next one
  var SUN = 'تثدذرزسشصضطظلن';

  function nfc(s) { return s.normalize ? s.normalize('NFKC') : s; }

  /* The text a learner might type or paste, made comparable: presentation
   * forms and the lam-alif ligature undone, Persian look-alikes mapped,
   * direction marks and punctuation dropped, spaces collapsed. Marks kept. */
  function normalize(s) {
    s = nfc(String(s || ''));
    s = s.replace(/ک/g, 'ك').replace(/[یے]/g, 'ي').replace(/ە/g, 'ه')
         .replace(/[​-‏‪-‮⁦-⁩﻿]/g, '')
         .replace(new RegExp(TATWEEL, 'g'), '')
         .replace(/[؟،؛«»"“”.!?,:;()\[\]\-–—…]/g, ' ')
         .replace(/\s+/g, ' ').trim();
    return s;
  }

  /* No vowel marks at all: how Arabic is written day to day. */
  function strip(s) { return normalize(s).replace(MARKS_G, ''); }

  /* Spelling slips that make a near miss, not a wrong answer: hamza seat,
   * tāʾ marbūṭa written as hāʾ, alif maqṣūra written as yāʾ. */
  function loose(s) {
    return strip(s).replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ء/g, '');
  }

  function hasMarks(s) { return MARKS.test(String(s || '')); }

  /* How much of the vowelling to show.
   *   'full'  every mark, as stored
   *   'help'  only shadda (the doubling the eye cannot guess); an authored
   *           helping form wins when the word data has one (passives, look-alikes)
   *   'bare'  none, as in a newspaper */
  function fade(s, level, helpForm) {
    if (level === 'full') return String(s || '');
    if (level === 'help') {
      if (helpForm) return helpForm;
      return String(s || '').replace(/[ً-ِْ-ٰٟ]/g, '');
    }
    return String(s || '').replace(MARKS_G, '');
  }

  /* Typed answer against the accepted forms. Vowel marks never count: the
   * learner may type them or not. Returns 'good', 'near' or 'wrong'. */
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
    if (/[أإآ]/.test(a) && !/[أإآ]/.test(t)) return 'hamza';
    if (/ة/.test(a) && !/ة/.test(t)) return 'marbuta';
    if (/ى/.test(a) && !/ى/.test(t)) return 'maqsura';
    return 'spelling';
  }

  /* ---- letter shapes --------------------------------------------------------
   * The four positions, drawn with the joining stroke (tatweel) the way a
   * learner's book shows them. A non-joining letter has the same initial and
   * isolated shape, and the same medial and final shape. */
  function joins(ch) { return NONJOIN.indexOf(ch) === -1; }
  function forms(ch) {
    var T = TATWEEL;
    if (!joins(ch)) return { alone: ch, initial: ch, medial: T + ch, final: T + ch };
    return { alone: ch, initial: ch + T, medial: T + ch + T, final: T + ch };
  }

  /* ---- transliteration -------------------------------------------------------
   * For a fully vowelled word: the learner line under new words in stage 0 and
   * A1. Word-initial hamza is not written (anā, not ʾanā). The article shows
   * as al- or, before a sun letter, as the doubled letter (ash-shams). */
  var CONS = {
    'ء': 'ʾ', 'أ': 'ʾ', 'إ': 'ʾ', 'ؤ': 'ʾ', 'ئ': 'ʾ', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'ḥ', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 'ṣ',
    'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ', 'ع': 'ʿ', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
    'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 't'
  };
  var VOW = {}; VOW[FATHA] = 'a'; VOW[KASRA] = 'i'; VOW[DAMMA] = 'u';
  VOW[TAN_F] = 'an'; VOW[TAN_K] = 'in'; VOW[TAN_D] = 'un';

  function translitWord(w) {
    // split into letters, each with its marks
    var L = [], i, c;
    w = nfc(w);
    for (i = 0; i < w.length; i++) {
      c = w.charAt(i);
      if (MARKS.test(c)) { if (L.length) L[L.length - 1].m += c; }
      else if (c !== TATWEEL) L.push({ c: c, m: '' });
    }
    var out = '', k = 0, prefix = '';
    // the article
    if (L.length > 2 && (L[0].c === 'ا' || L[0].c === 'ٱ') && L[1].c === 'ل' && L[0].m.indexOf(KASRA) === -1 && L[0].m.indexOf(DAMMA) === -1) {
      var next = L[2];
      if (SUN.indexOf(next.c) !== -1 && next.m.indexOf(SHADDA) !== -1) {
        prefix = 'a' + CONS[next.c] + '-';
        next.m = next.m.replace(SHADDA, '');
      } else prefix = 'al-';
      k = 2;
    }
    var last = '';
    for (i = k; i < L.length; i++) {
      var x = L[i], ch = x.c, m = x.m;
      var vow = '';
      for (var j = 0; j < m.length; j++) if (VOW[m.charAt(j)]) vow = VOW[m.charAt(j)];
      var dbl = m.indexOf(SHADDA) !== -1;
      var atStart = (out === '');
      if (ch === 'ا' || ch === 'ٱ') {
        if (atStart) { out += vow || (m.indexOf(SUKUN) !== -1 ? '' : 'a'); last = ''; continue; }
        if (/a$/.test(out)) { out = out.slice(0, -1) + 'ā'; }      // long ā
        else if (/an$/.test(out)) { /* the alif after tanwīn fatḥ is silent */ }
        else out += 'ā';
        continue;
      }
      if (ch === 'آ') { out += (atStart ? '' : 'ʾ') + 'ā'; continue; }
      if (ch === 'ى') { if (/a$/.test(out)) out = out.slice(0, -1) + 'ā'; else out += 'ā'; continue; }
      if ((ch === 'ي' || ch === 'و') && !vow && !dbl) {
        var longV = ch === 'ي' ? 'i' : 'u';
        if (new RegExp(longV + '$').test(out) && !/(an|in|un)$/.test(out)) { out = out.slice(0, -1) + (ch === 'ي' ? 'ī' : 'ū'); continue; }
        if (/[aā]$/.test(out)) { out += ch === 'ي' ? 'y' : 'w'; continue; }    // ay, aw, shāy
        if (m.indexOf(SUKUN) === -1 && !out) { out += CONS[ch]; continue; }
        if (m.indexOf(SUKUN) === -1) { out += (ch === 'ي' ? 'ī' : 'ū'); continue; }  // unmarked long vowel
        out += CONS[ch]; continue;
      }
      if (ch === 'ة') { out += vow ? 't' + vow : ''; if (!vow && !/a$/.test(out)) out += 'a'; continue; }
      var cons = CONS[ch];
      if (cons === undefined) { out += ch; continue; }
      if (atStart && cons === 'ʾ' && !prefix) cons = '';          // anā, not ʾanā
      out += dbl ? cons + cons : cons;
      out += vow;
      last = ch;
    }
    return prefix + out;
  }

  function translit(s) {
    return normalize(s).split(' ').map(function (w) {
      return translitWord(w).replace(/iyy$/, 'ī').replace(/uww$/, 'ū');   // pausal: ʿarabī
    }).join(' ');
  }

  /* Letters that should carry a vowel mark but do not, in a text meant to be
   * fully vowelled. Exempt: long-vowel letters (ا ى آ, and و ي after their own
   * short vowel or unmarked), the last letter of each word (pausal), the
   * article's alif and lām, and an alif after tanwīn. Returns the offenders. */
  function unvowelled(s) {
    var bad = [];
    nfc(String(s || '')).replace(/[؟،؛«»"“”.!?,:;()]/g, ' ').split(/\s+/).forEach(function (w) {
      var L = [], i, c;
      for (i = 0; i < w.length; i++) {
        c = w.charAt(i);
        if (MARKS.test(c)) { if (L.length) L[L.length - 1].m += c; }
        else if (c !== TATWEEL) L.push({ c: c, m: '' });
      }
      if (L.length < 2) return;
      var art = (L[0].c === 'ا' || L[0].c === 'ٱ') && L[1].c === 'ل' && !L[0].m ? 2 : 0;
      // a one-letter prefix (و ف ب ل ك) before the article: وَالْ بِالْ لِلْ
      if (!art && L.length > 3 && L[0].c === 'ل' && L[0].m && L[1].c === 'ل') art = 2;   // لِلْ: li + the
      if (!art && L.length > 3 && 'وفبك'.indexOf(L[0].c) !== -1 && L[0].m && L[1].c === 'ا' && L[2].c === 'ل') art = 3;
      for (i = 0; i < L.length - 1; i++) {
        var x = L[i], prev = L[i - 1];
        if (x.m) continue;
        if (i < art) continue;
        if ('اىآٱ'.indexOf(x.c) !== -1) continue;
        if ((x.c === 'و' || x.c === 'ي') && prev && /[\u064E-\u0650]/.test(prev.m)) continue;
        bad.push(w);
        return;
      }
    });
    return bad;
  }

  var AR = {
    unvowelled: unvowelled,
    normalize: normalize, strip: strip, loose: loose, hasMarks: hasMarks, fade: fade,
    check: check, slip: slip, joins: joins, forms: forms, translit: translit,
    SUN: SUN, NONJOIN: NONJOIN, MARKS: { FATHA: FATHA, DAMMA: DAMMA, KASRA: KASRA, SUKUN: SUKUN, SHADDA: SHADDA }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = AR;
  else root.AR = AR;
})(this);
