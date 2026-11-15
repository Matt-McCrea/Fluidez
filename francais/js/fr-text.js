/* ============================================================================
 * FR-TEXT: French text rules for Couramment: the forgiving comparison a typed
 * answer is graded with, and FR.form, the verb form that fills a gap.
 *
 * Runs in the browser (window.FR) and in node (require), because the build
 * scripts use the SAME rules to compute the right answer for every gapped
 * sentence. Same check API as NL in Vlot (check, fold, bare), so the game code
 * ports by name.
 *
 * Forms come from francais/data/verbs.js (window.FR_VERBS); the trap list for
 * check() is every surface form in that table and in francais/data/words.js
 * (window.FR_WORDS).
 * ========================================================================== */
(function (root) {
  'use strict';

  /* ---- comparison ----------------------------------------------------------
   * fold(): lower case, oe/ae ligatures spelled out, one apostrophe (and no
   * space after it), hyphens kept, one space, punctuation gone. bare(): fold and
   * also strip accents and the cedilla, for the near miss (ecole for école).
   * check(): 'good' | 'near' | 'wrong'. An accent-only slip is near, UNLESS the
   * slip spells another form or option (mange for mangé, a for à, ou for où):
   * that is the trap, and it is WRONG. The traps are the surface forms of the
   * loaded verbs and words, plus opts.others (extra strings) or opts.verb. */
  function fold(s) {
    return String(s == null ? '' : s)
      .normalize('NFC')
      .replace(/œ/g, 'oe').replace(/Œ/g, 'OE').replace(/æ/g, 'ae').replace(/Æ/g, 'AE')
      .replace(/[’‘`´ʼ′]/g, "'")
      .replace(/[‐‑‒–—]/g, '-')
      .replace(/[  ]/g, ' ')
      .replace(/[.,;:!?¿¡"“”„«»()…]/g, ' ')
      .replace(/'\s+/g, "'")
      .replace(/\s+/g, ' ')
      .trim().toLowerCase();
  }
  function bare(s) {
    return fold(s).normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
  }

  var TABLE = null, INDEX = null, TRAPS = null, TRAPSRC = null;
  function setVerbs(t) { TABLE = t; INDEX = null; TRAPS = null; }
  function table(t) {
    var tb = t || TABLE || (typeof window !== 'undefined' && window.FR_VERBS) || null;
    if (!tb && typeof require === 'function') {
      try { tb = require('../data/verbs.js'); } catch (e) { tb = null; }
    }
    return tb || [];
  }
  function words() {
    var w = (typeof window !== 'undefined' && window.FR_WORDS) || null;
    if (!w && typeof require === 'function') {
      try { w = require('../data/words.js'); } catch (e) { w = null; }
    }
    return w || [];
  }
  function allForms(v) {
    var out = [], f = v.f || {};
    Object.keys(f).forEach(function (k) {
      var x = f[k];
      if (typeof x === 'string') out.push(x);
      else if (x && typeof x === 'object') Object.keys(x).forEach(function (p) { if (typeof x[p] === 'string') out.push(x[p]); });
    });
    if (f.pp) { out.push(f.pp + 'e', f.pp + 's', f.pp + 'es'); }
    return out;
  }
  function traps() {
    var tb = table(), ws = words();
    if (TRAPS && TRAPSRC === tb) return TRAPS;
    var m = {};
    tb.forEach(function (v) { allForms(v).forEach(function (x) { m[fold(x)] = 1; }); });
    ws.forEach(function (w) {
      [w.fr, w.pl, w.fem, w.mpl, w.fpl].forEach(function (x) { if (x) m[fold(x)] = 1; });
    });
    TRAPS = m; TRAPSRC = tb;
    return m;
  }
  function check(input, accepted, opts) {
    var f = fold(input);
    if (!f) return 'wrong';
    var list = (accepted || []).map(fold);
    if (list.indexOf(f) !== -1) return 'good';
    var b = bare(input), near = false;
    for (var i = 0; i < list.length; i++) if (bare(list[i]) === b) { near = true; break; }
    if (!near) return 'wrong';
    // an accent slip that spells another real form or option is the trap
    var t = traps();
    if (t[f]) return 'wrong';
    var extra = (opts && opts.others) || [];
    for (var j = 0; j < extra.length; j++) if (fold(extra[j]) === f) return 'wrong';
    if (opts && opts.verb) {
      var v = verb(opts.verb);
      if (v) { var af = allForms(v); for (var k = 0; k < af.length; k++) if (fold(af[k]) === f) return 'wrong'; }
    }
    return 'near';
  }

  /* ---- verbs ---------------------------------------------------------------- */
  /* verb(inf, table?) -> the entry, or null. */
  function verb(inf, t) {
    if (inf && typeof inf === 'object') return inf;
    var tb = table(t);
    if (t) { for (var i = 0; i < tb.length; i++) if (tb[i].v === inf) return tb[i]; return null; }
    if (!INDEX || INDEX.src !== tb) { INDEX = { src: tb, m: {} }; tb.forEach(function (x) { INDEX.m[x.v] = x; }); }
    return INDEX.m[inf] || null;
  }

  /* persons: je tu il nous vous ils. elle and on count as il, elles as ils. */
  var PERSON = { je: 'je', j: 'je', "j'": 'je', tu: 'tu', il: 'il', elle: 'il', on: 'il', nous: 'nous', vous: 'vous', ils: 'ils', elles: 'ils' };

  /* the participle with agreement: 'f' (e), 'mp' (s), 'fp' (es). */
  function agreeing(pp, agree) {
    if (!pp || !agree || agree === 'm' || agree === 'ms') return pp;
    var fem = /e$/.test(pp) ? pp : pp + 'e';
    if (agree === 'f') return fem;
    if (agree === 'mp') return /[sx]$/.test(pp) ? pp : pp + 's';
    if (agree === 'fp') return fem + 's';
    return pp;
  }

  /* form(verb, tense, person, opts) -> the gap word, or null.
   *   pres imp fut cond subj   the simple tense for this person
   *   imper                    tu / nous / vous only (null for the rest)
   *   pc  pqp                  the participle (the auxiliary is written in the sentence);
   *                            opts.agree 'f' | 'mp' | 'fp' adds the agreement
   *   ae                       the auxiliary avoir/etre for this verb in the compound
   *                            tense; opts.tt 'pres' | 'imp' (default pres); opts.aux
   *                            'a' | 'e' picks one for a verb that takes either (ae);
   *                            default e for ae verbs; pronominal verbs always e
   *   fp                       futur proche: the present of aller
   * Elision is not part of the form: a frame writes j'___ only where it must. */
  function form(vb, t, person, opts) {
    opts = opts || {};
    var v = verb(vb); if (!v || !v.f) return null;
    var p = PERSON[person];
    switch (t) {
      case 'pres': case 'imp': case 'fut': case 'cond': case 'subj':
        return p && v.f[t] && v.f[t][p] || null;
      case 'imper':
        return p && v.f.imper && v.f.imper[p] || null;
      case 'pc': case 'pqp':
        return agreeing(v.f.pp, opts.agree) || null;
      case 'ae': {
        if (!p) return null;
        var aux = v.pron ? 'e' : v.aux === 'ae' ? (opts.aux === 'a' ? 'a' : 'e') : (opts.aux || v.aux);
        var a = verb(aux === 'e' ? 'être' : 'avoir'); if (!a) return null;
        return form(a, opts.tt === 'imp' ? 'imp' : 'pres', person);
      }
      case 'fp': {
        if (!p) return null;
        var al = verb('aller'); return al ? form(al, 'pres', person) : null;
      }
    }
    return null;
  }

  var FR = {
    fold: fold, bare: bare, check: check,
    form: form, verb: verb, setVerbs: setVerbs, agreeing: agreeing, PERSON: PERSON
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = FR;
  else root.FR = FR;
})(typeof window !== 'undefined' ? window : this);
