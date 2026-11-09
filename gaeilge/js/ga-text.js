/* ============================================================================
 * GA-TEXT — Irish text rules for Líofa: initial mutations, the verb particles,
 * and the forgiving comparison a typed answer is graded with.
 *
 * Runs in the browser (window.GA) and in node (require), because the build
 * scripts in tools/ga/ use the SAME rules to compute the right answer for every
 * gapped sentence. A sentence author writes "Ní ___ (feic) mé é inné." and tags
 * it {v:'feic', t:'caite', p:'me'}; the gate asks formAfter('ní', ...) and gets
 * "fhaca". If the two ever disagree, the sentence is wrong or this file is, and
 * either way nothing ships until a person looks.
 *
 * Standard: An Caighdeán Oifigiúil (2017). Forms come from BuNaMo
 * (gaeilge/data/verbs.js), which stores them UNMUTATED; mutation is applied
 * here, as Gramadán does.
 * ========================================================================== */
(function (root) {
  'use strict';

  var VOWELS = 'aeiouáéíóúAEIOUÁÉÍÓÚ';
  function isVowel(c) { return !!c && VOWELS.indexOf(c) !== -1; }
  function isUpper(c) { return !!c && c !== c.toLowerCase(); }

  /* ---- séimhiú (lenition) -------------------------------------------------
   * b c d f g m p t take an h; s does too before a vowel or l n r. Never sc sp
   * st sm, never a vowel, l n r h, never a word already lenited. `noDental`
   * is the "dentals stay" rule after a word ending in d n t s l (an chéad
   * duine, aon doras, an tseachtain is a t-prefix, not this). */
  function lenite(w, opts) {
    if (!w) return w;
    var a = w.charAt(0), b = w.charAt(1);
    var lo = a.toLowerCase(), b2 = b.toLowerCase();
    if (b2 === 'h') return w;
    if (opts && opts.noDental && 'dts'.indexOf(lo) !== -1) return w;
    if ('bcdfgmpt'.indexOf(lo) !== -1) return a + (isUpper(b) ? 'H' : 'h') + w.slice(1);
    if (lo === 's' && (isVowel(b) || 'lnrLNR'.indexOf(b) !== -1)) return a + (isUpper(b) ? 'H' : 'h') + w.slice(1);
    return w;
  }
  function isLenited(w) { return !!w && w.charAt(1).toLowerCase() === 'h' && 'bcdfgmpts'.indexOf(w.charAt(0).toLowerCase()) !== -1; }

  /* ---- urú (eclipsis) -----------------------------------------------------
   * mb gc nd bhf ng bp dt, and n- before a vowel: n-ól, but nÉirinn (no hyphen
   * before a capital). The prefix is always lower case: i nGaillimh. */
  var ECL = { b: 'm', c: 'g', d: 'n', f: 'bh', g: 'n', p: 'b', t: 'd' };
  function eclipse(w, opts) {
    if (!w) return w;
    var a = w.charAt(0), lo = a.toLowerCase();
    if (isEclipsed(w)) return w;
    if (ECL[lo]) return ECL[lo] + w;
    if (isVowel(a)) {
      if (opts && opts.noVowel) return w;
      return isUpper(a) ? 'n' + w : 'n-' + w;
    }
    return w;
  }
  function isEclipsed(w) {
    return /^(m[bB]|g[cC]|n[dD]|bh[fF]|n[gG]|b[pP]|d[tT]|n-[aeiouáéíóú]|n[AEIOUÁÉÍÓÚ])/.test(w || '');
  }

  /* ---- the prefixes --------------------------------------------------------
   * t- before a vowel after the article on a masculine singular noun (an
   * t-uisce, an tAthair); t before s + vowel/l/n/r on a feminine one (an
   * tsráid, an tseachtain). h before a vowel after a (her), le, go, na, ná... */
  function tPrefix(w) {
    if (!w) return w;
    var a = w.charAt(0);
    if (isVowel(a)) return isUpper(a) ? 't' + w : 't-' + w;
    return w;
  }
  function tsPrefix(w) {
    if (!w) return w;
    var a = w.charAt(0), b = w.charAt(1);
    if (a.toLowerCase() === 's' && (isVowel(b) || 'lnrLNR'.indexOf(b) !== -1)) return 't' + w;
    return w;
  }
  function hPrefix(w) {
    if (!w) return w;
    var a = w.charAt(0);
    return isVowel(a) ? 'h' + w : w;
  }

  /* The bare word under any initial mutation: chara -> cara, gcara -> cara,
   * n-uisce -> uisce, tsráid -> sráid, hathair -> athair. Used to build
   * distractors and to recognise "you typed the right word, wrong mutation". */
  function demutate(w) {
    if (!w) return w;
    var m;
    if ((m = /^d'(.*)$/.exec(w))) return demutate(m[1]);
    if ((m = /^n-(.*)$/.exec(w)) || (m = /^t-(.*)$/.exec(w))) return m[1];
    if (/^n[AEIOUÁÉÍÓÚ]/.test(w) || /^t[AEIOUÁÉÍÓÚ]/.test(w)) return w.slice(1);
    if (/^bhf/i.test(w)) return w.slice(2);
    if (/^(mb|gc|nd|bp|dt)/i.test(w)) return w.slice(1);
    if (/^ng[aeiouáéíóúlr]/i.test(w)) return w.slice(1);
    if (/^ts[aeiouáéíóúlnr]/i.test(w)) return w.slice(1);
    if (/^h[aeiouáéíóú]/i.test(w)) return w.slice(1);
    if (isLenited(w)) return w.charAt(0) + w.slice(2);
    return w;
  }
  /* The four shapes a word can take at the front: for a mutation question's
   * options. Duplicates removed (a word starting with l has only itself). */
  function shapes(w) {
    var b = demutate(w);
    var out = [b, lenite(b), eclipse(b), isVowel(b.charAt(0)) ? hPrefix(b) : tsPrefix(b)];
    if (isVowel(b.charAt(0))) out.push(tPrefix(b));
    return out.filter(function (x, i) { return out.indexOf(x) === i; });
  }

  /* ---- verb forms ----------------------------------------------------------
   * A verb entry in data/verbs.js: { v, en, vn, va, irr, f: { tense: { person:
   * [indep, dep] } } } with BuNaMo's unmutated forms; dep omitted when it is
   * the same as indep. Persons: me tu se si muid sibh siad saor. Each value is
   * the WORD that fills the gap: synthetic where the Caighdeán uses one (the
   * pronoun is then inside it), else the base form (the pronoun stays in the
   * sentence). Tenses: lait (present), gnathlait (bí's habitual present only),
   * caite, fhaist, coinn, gnath (past habitual), ord (imperative). */
  var PAST_LIKE = { caite: 1, coinn: 1, gnath: 1 };
  var NI_PAST = { 'bí': 1, 'feic': 1, 'déan': 1, 'faigh': 1, 'téigh': 1, 'abair': 1 };
  var SAOR_PAST_LENITED = { 'bí': 1, 'feic': 1, 'clois': 1, 'téigh': 1, 'tar': 1, 'déan': 0 };

  function slot(verb, t, p) {
    var tt = verb && verb.f && verb.f[t];
    var s = tt && tt[p];
    if (!s) return null;
    return { ind: s[0], dep: s[1] || s[0] };
  }

  /* The prefix d' before a vowel or f + vowel/l/r in the past, conditional and
   * past habitual: d'ól, d'fhan, d'fhreagair. */
  function dPast(w) {
    var a = w.charAt(0).toLowerCase();
    if (isVowel(a)) return "d'" + w;
    if (a === 'f') { var l = lenite(w); if (l !== w) return "d'" + l; }
    return null;
  }
  // abair never takes séimhiú at all; faigh's fuair resists it; ith only d'.
  function indepPast(verb, w, t, p) {
    if (verb.v === 'abair') return w;
    if (t === 'caite' && verb.v === 'faigh') return w;
    if (t === 'caite' && p === 'saor' && !SAOR_PAST_LENITED[verb.v]) return w;   // tógadh, óladh, rinneadh
    return dPast(w) || lenite(w);
  }

  /* formAfter(particle, verb, tense, person) -> the gap word, or null when the
   * combination is not one this app writes. Particles:
   *   ''      no particle (statement)
   *   'ní'    negative (ní / níor)            'an'   question (an / ar)
   *   'go'    that (go / gur)                 'nach' that not / is it not
   *   'má'    if (real)                       'dá'   if (unreal, conditional)
   *   'a'     direct relative, nuair a, cé a  'ná'   negative command
   * The particle itself is not in the answer: it is in the sentence. For the
   * regular past, ní/an/go/nach become níor/ar/gur/nár in the SENTENCE, and the
   * gate checks that; here only the verb word is produced. */
  function formAfter(part, verb, t, p) {
    var s = slot(verb, t, p);
    if (!s) return null;
    var v = verb.v, ind = s.ind, dep = s.dep;
    part = part || '';

    if (t === 'ord') {
      if (part === '') return ind;
      if (part === 'ná') return hPrefix(ind);
      return null;
    }

    if (part === '') {
      if (PAST_LIKE[t]) return indepPast(verb, ind, t, p);
      if (v === 'faigh' && t === 'fhaist') return lenite(ind);   // gheobhaidh, gheofar
      return ind;                                   // tá, déanann, rachaidh
    }

    if (part === 'a' || part === 'má') {
      if (v === 'bí' && t === 'lait') return part === 'má' ? 'tá' : null;  // má tá; relative is "atá"
      if (v === 'abair') return ind;                // má deir, a dúirt
      if (PAST_LIKE[t]) return indepPast(verb, ind, t, p);
      if (part === 'má' && t === 'fhaist') return null;   // má + future is not Irish
      return lenite(ind);                           // a bhíonn, má fheiceann, a dhéanfaidh
    }

    if (part === 'dá') {
      if (t !== 'coinn' && t !== 'gnath') return null;
      return eclipse(dep);                          // dá mbeinn, dá bhfaighinn, dá n-ólfainn
    }

    var neg = part === 'ní';
    var vowelN = part === 'go' || part === 'nach';   // go n-ólann, but an ólann

    if (v === 'bí' && t === 'lait') {
      if (neg) return p === 'muid' ? 'nílimid' : 'níl';   // ní + fuil
      return eclipse(dep);                          // bhfuil, bhfuilimid
    }

    if (t === 'caite' && !NI_PAST[v]) {
      // níor / ar / gur / nár + séimhiú on the independent root, no d'
      if (p === 'saor' && !SAOR_PAST_LENITED[v]) return ind;   // níor tógadh
      return lenite(ind);
    }

    if (neg) {
      if (v === 'abair') return dep;                // ní dúirt, ní deir
      if (v === 'faigh' && (t === 'caite' || t === 'fhaist' || t === 'coinn')) return eclipse(dep);  // ní bhfuair
      return lenite(dep);                           // ní fhaca, ní dhearna, ní raibh
    }
    return eclipse(dep, { noVowel: !vowelN });     // an bhfaca, go ndearna, an ólann, nach n-ólann
  }

  /* Which particle word the sentence must show before the gap, for the gate:
   * the regular past swaps ní/an/go/nach for níor/ar/gur/nár. */
  function particleWord(part, verb, t) {
    if (t === 'caite' && !NI_PAST[verb.v]) {
      return { 'ní': 'níor', 'an': 'ar', 'go': 'gur', 'nach': 'nár' }[part] || part;
    }
    return part;
  }

  /* ---- comparison ----------------------------------------------------------
   * fold(): lower case, one apostrophe, one space, trailing punctuation gone.
   * bare(): fold and also strip the fada, for the "beagnach" near miss. A
   * hyphen slip in n-/t- (nathair vs n-athair) is a near miss too, never a
   * pass: the hyphen is part of the spelling. */
  function fold(s) {
    return String(s == null ? '' : s)
      .replace(/[’‘`´]/g, "'")
      .replace(/[.,;:!?¿¡"“”«»()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim().toLowerCase();
  }
  var FADA = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
  function bare(s) { return fold(s).replace(/[áéíóú]/g, function (c) { return FADA[c]; }); }
  function noHyphen(s) { return s.replace(/\b([nt])-(?=[aeiouáéíóú])/g, '$1'); }

  /* check(input, accepted[]) -> 'good' | 'near' | 'wrong'. */
  function check(input, accepted) {
    var f = fold(input);
    if (!f) return 'wrong';
    var list = (accepted || []).map(fold);
    if (list.indexOf(f) !== -1) return 'good';
    var b = bare(input), nh = noHyphen(b);
    for (var i = 0; i < list.length; i++) {
      var lb = bare(list[i]);
      if (lb === b || noHyphen(lb) === nh) return 'near';
    }
    return 'wrong';
  }

  var GA = {
    lenite: lenite, eclipse: eclipse, tPrefix: tPrefix, tsPrefix: tsPrefix, hPrefix: hPrefix,
    isLenited: isLenited, isEclipsed: isEclipsed, demutate: demutate, shapes: shapes, isVowel: isVowel,
    formAfter: formAfter, particleWord: particleWord, slot: slot,
    fold: fold, bare: bare, check: check,
    NI_PAST: NI_PAST
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = GA;
  else root.GA = GA;
})(typeof window !== 'undefined' ? window : this);
