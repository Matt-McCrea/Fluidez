/* ============================================================================
 * NL-TEXT: Dutch text rules for Vlot: the forgiving comparison a typed answer
 * is graded with, and NL.form, the verb form that fills a gap.
 *
 * Runs in the browser (window.NL) and in node (require), because the build
 * scripts use the SAME rules to compute the right answer for every gapped
 * sentence. Same check API as GA in the Irish app (check, fold, bare), so the game
 * code ports by name.
 *
 * Standard: Het Groene Boekje (2015), spoken ABN. Forms come from
 * nederlands/data/verbs.js (window.NL_VERBS).
 * ========================================================================== */
(function (root) {
  'use strict';

  /* ---- comparison ----------------------------------------------------------
   * fold(): lower case, ij ligature as ij, one apostrophe, one space, punctuation
   * gone. bare(): fold and also strip accents and the diaeresis, for the near
   * miss (een for één, ideeen for ideeën, cafe for café). A d/t slip (word for
   * wordt) is a different word and is WRONG: that is the trap being taught. */
  function fold(s) {
    return String(s == null ? '' : s)
      .normalize('NFC')
      .replace(/ĳ/g, 'ij').replace(/Ĳ/g, 'IJ')
      .replace(/[’‘`´ʼ]/g, "'")
      .replace(/[.,;:!?¿¡"“”„«»()…]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim().toLowerCase();
  }
  function bare(s) {
    return fold(s).normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
  }
  /* check(input, accepted[]) -> 'good' | 'near' | 'wrong'. */
  function check(input, accepted) {
    var f = fold(input);
    if (!f) return 'wrong';
    var list = (accepted || []).map(fold);
    if (list.indexOf(f) !== -1) return 'good';
    var b = bare(input);
    for (var i = 0; i < list.length; i++) if (bare(list[i]) === b) return 'near';
    return 'wrong';
  }

  /* ---- verbs ---------------------------------------------------------------- */
  var TABLE = null, INDEX = null;
  function setVerbs(t) { TABLE = t; INDEX = null; }
  function table(t) {
    var tb = t || TABLE || (typeof window !== 'undefined' && window.NL_VERBS) || null;
    if (!tb && typeof require === 'function') {
      try { tb = require('../data/verbs.js'); } catch (e) { tb = null; }
    }
    return tb || [];
  }
  /* verb(inf, table?) -> the entry, or null. */
  function verb(inf, t) {
    if (inf && typeof inf === 'object') return inf;
    var tb = table(t);
    if (t) { for (var i = 0; i < tb.length; i++) if (tb[i].v === inf) return tb[i]; return null; }
    if (!INDEX || INDEX.src !== tb) { INDEX = { src: tb, m: {} }; tb.forEach(function (x) { INDEX.m[x.v] = x; }); }
    return INDEX.m[inf] || null;
  }

  /* persons: ik jij u hij wij jullie zij (plural). Spoken short forms and the
   * singular she/it are folded in: je, ze (plural), we, zij1 / zijsg / hij / het. */
  var PERSON = { ik: 'ik', jij: 'jij', je: 'jij', u: 'u', hij: 'hij', zijsg: 'hij', zij1: 'hij', het: 'hij', zij_sg: 'hij',
    wij: 'wij', we: 'wij', jullie: 'jullie', zij: 'zij', ze: 'zij' };
  var PL = { wij: 1, jullie: 1, zij: 1 };

  /* Strip the separable prefix off a joined form for a main clause: opbelt ->
   * belt, wegga -> ga, aanbied -> bied. */
  function splitSep(v, w) {
    if (v.sep && w && w.indexOf(v.sep) === 0 && w.length > v.sep.length) return w.slice(v.sep.length);
    return w;
  }
  function presentSlot(v, p, inv) {
    var o = v.f.ott;
    if (p === 'jij' && inv) return o.jinv;
    return o[p];
  }
  /* form(verb, tense, person, opts) -> the gap word, or null.
   *   ott  present                      ovt  simple past (werkte / werkten)
   *   vtt  perfect: the participle (the auxiliary is written in the sentence)
   *   hz   the auxiliary hebben/zijn for this verb; opts.tt 'ott'|'ovt' (default
   *        ott); opts.aux 'h'|'z' picks one for a verb that takes either
   *        (default z for hz verbs)
   *   toek future: the zullen form       cond  zou / zouden
   *   imp  imperative: person is ignored (jij / u; wij gives the hij form of
   *        'laten we', ignored too)
   * opts.inv: jij/je after the verb (werk jij).  opts.sub: subordinate clause,
   * a separable verb stays joined (dat hij opbelt). In a main clause the gap is
   * the verb part only (Hij belt me morgen op: belt). */
  function form(vb, t, person, opts) {
    opts = opts || {};
    var v = verb(vb); if (!v || !v.f) return null;
    var p = PERSON[person]; if (!p && t !== 'imp' && t !== 'vtt') return null;
    var main = !opts.sub;
    switch (t) {
      case 'ott': {
        var w = presentSlot(v, p, opts.inv); if (!w) return null;
        return main ? splitSep(v, w) : w;
      }
      case 'ovt': {
        var o = v.f.ovt[PL[p] ? 'pl' : 'sg']; if (!o) return null;
        return main ? splitSep(v, o) : o;
      }
      case 'vtt': return v.f.vd || null;
      case 'imp': return main ? splitSep(v, v.f.imp) : v.f.imp;
      case 'toek': { if (v && v.v === 'gaan') return form(v, 'ott', person, { inv: opts.inv }); var z = verb('zullen'); return z ? form(z, 'ott', person, { inv: opts.inv }) : null; }
      case 'cond': { var z2 = verb('zullen'); return z2 ? form(z2, 'ovt', person, { inv: opts.inv }) : null; }
      case 'hz': {
        var aux = v.aux === 'hz' ? (opts.aux === 'h' ? 'h' : 'z') : (opts.aux || v.aux);
        var a = verb(aux === 'z' ? 'zijn' : 'hebben'); if (!a) return null;
        return form(a, opts.tt === 'ovt' ? 'ovt' : 'ott', person, { inv: opts.inv });
      }
    }
    return null;
  }

  var NL = {
    fold: fold, bare: bare, check: check,
    form: form, verb: verb, setVerbs: setVerbs, splitSep: splitSep, PERSON: PERSON
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = NL;
  else root.NL = NL;
})(typeof window !== 'undefined' ? window : this);
