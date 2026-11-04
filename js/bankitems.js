/* ============================================================================
 * BANKITEMS — the sentence bank as the practice supply.
 *
 * data/bank/<BAND>.js (A1 to C1, 4 to 6 MB each, NOT in index.html) defines
 * window.BANK_<BAND>, an array of rows
 *   {id, es, en, a: accept[], r: requires[], t: targets[], f: [start,end]|null,
 *    k: kind, th: theme, d: legalDay}
 * `t` names the nodes the row practises, `f` is the character span in `es` of
 * the practised form. This file loads a band on demand and turns rows into
 * the item shapes the existing stages already render:
 *
 *   cloze(row)        Apply cloze   {type:'cloze', text:"... ___ (inf) ...", inf, tense, person, en}
 *   gap(row)          Apply choice  {type:'choice', focus, text, options, answer, why:'', en}
 *   readAndPick(row)  Apply choice  structured input: read the form, say who or when
 *   translate(row)    Produce task  {type:'translate', prompt, es, accept, models}
 *
 * Every item carries `key: 'bank:<id>'` (the exposure ledger key) and `bankId`
 * and `bankKind`, so a saved session can rebuild it (make(kind, row)).
 *
 * Gating uses Known.allows exactly: the row's requires are put under a scratch
 * key in window.REQUIRES for the length of one call.
 * ========================================================================== */
window.BankItems = (function () {
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var E = function () { return window.ENGINE; };

  /* ---- loading ------------------------------------------------------------ */
  var rowsOf = {}, indexed = {}, waiters = {}, failed = {};
  var byNode = Object.create(null), byReq = Object.create(null), byId = Object.create(null), esSeen = Object.create(null);

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function index(band) {
    if (indexed[band]) return;
    var rows = window['BANK_' + band];
    if (!rows) return;
    indexed[band] = true; rowsOf[band] = rows;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      byId[r.id] = r;
      esSeen[norm(r.es)] = 1;
      var t = r.t || [];
      for (var j = 0; j < t.length; j++) {
        if (t[j].charAt(0) === 'l') continue;             // lexeme nodes are not what a day targets
        (byNode[t[j]] || (byNode[t[j]] = [])).push(r);
      }
      var q = r.r || [];                                 // a row that merely needs the node still uses it
      for (var m = 0; m < q.length; m++) {
        if (q[m].charAt(0) === 'l' || t.indexOf(q[m]) !== -1) continue;
        (byReq[q[m]] || (byReq[q[m]] = [])).push(r);
      }
    }
  }
  function needs(band) {
    var i = BANDS.indexOf(band);
    if (i < 0) return [];
    return i > 0 ? [BANDS[i - 1], band] : [band];
  }
  function loadOne(band, cb) {
    if (window['BANK_' + band]) { index(band); cb(true); return; }
    if (typeof document === 'undefined' || !document.createElement || !document.head) { cb(false); return; }
    if (!waiters[band]) {
      waiters[band] = [];
      var s = document.createElement('script');
      s.src = 'data/bank/' + band + '.js';
      s.onload = function () {
        var ok = !!window['BANK_' + band];
        if (ok) index(band); else failed[band] = 1;
        var w = waiters[band]; delete waiters[band]; w.forEach(function (f) { f(ok); });
      };
      s.onerror = function () {
        failed[band] = 1;
        var w = waiters[band]; delete waiters[band]; w.forEach(function (f) { f(false); });
      };
      document.head.appendChild(s);
    }
    waiters[band].push(cb);
  }
  /* Load the band and the one below it (so early nodes keep supply). cb(ok). */
  function load(band, cb) {
    var list = needs(band), left = list.length, all = true;
    cb = cb || function () {};
    if (!left) { cb(false); return; }
    list.forEach(function (b) {
      loadOne(b, function (ok) { if (!ok) all = false; if (--left === 0) cb(all); });
    });
  }
  function ready(band) { return needs(band).length > 0 && needs(band).every(function (b) { return !!indexed[b]; }); }
  /* tests and preloaded pages: index whatever BANK_<band> globals exist */
  function install(band) { index(band); }
  function row(id) { return byId[id] || null; }

  /* ---- gating ------------------------------------------------------------- */
  function allowed(r, known, today, band) {
    var Kn = window.Known, R = window.REQUIRES;
    if (!Kn || !R) return true;
    var prev = R['bank:scratch'];
    R['bank:scratch'] = { r: r.r || [] };
    var ok = Kn.allows('bank:scratch', known, today, band);
    if (prev) R['bank:scratch'] = prev; else delete R['bank:scratch'];
    return ok;
  }
  function hitsOf(r, today) {
    var n = 0, t = r.t || [];
    for (var i = 0; i < t.length; i++) if (today.has(t[i]) && t[i].charAt(0) !== 'l') n++;
    return n;
  }
  /* Rows that practise today's nodes, are allowed, and were not served in the
   * last 14 days (opts.recent(key) answers that from the ledger). Deduped by
   * normalised Spanish, most targeted nodes first. */
  function forNodes(today, known, opts) {
    opts = opts || {};
    var out = [], seenEs = Object.create(null), seenRow = Object.create(null);
    out.primary = 0;
    if (!today || !today.size) return out;
    function tier(index) {
      var tierRows = [];
      today.forEach(function (n) {
        var list = index[n];
        if (!list) return;
        for (var i = 0; i < list.length; i++) {
          var r = list[i];
          if (seenRow[r.id]) continue;
          seenRow[r.id] = 1;
          if (opts.recent && opts.recent('bank:' + r.id)) continue;
          var k = norm(r.es);
          if (seenEs[k]) continue;
          if (!allowed(r, known, today, opts.band)) continue;
          seenEs[k] = 1;
          tierRows.push(r);
        }
      });
      return tierRows;
    }
    out = tier(byNode);
    out.sort(function (a, b) { return hitsOf(b, today) - hitsOf(a, today); });
    out.primary = out.length;
    /* rows that practise some other node but need one of today's come second */
    var second = tier(byReq);
    for (var s2 = 0; s2 < second.length; s2++) out.push(second[s2]);
    return out;
  }

  /* ---- spans -------------------------------------------------------------- */
  function spanOf(r) {
    if (!r || !r.f || r.f.length !== 2) return null;
    var s = r.es.slice(r.f[0], r.f[1]);
    if (!s || /\s/.test(s) || !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/.test(s)) return null;
    return s;
  }
  // dialogue rows hold two lines; a card shows them on one
  function flat(s) { return String(s || '').replace(/\s*\n\s*/g, ' ');}
  function blanked(r) { return flat(r.es.slice(0, r.f[0]) + '___' + r.es.slice(r.f[1])); }
  function cap(s, like) { return /^[A-ZÁÉÍÓÚÑ]/.test(like) ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* The verb readings of a span that the engine reproduces exactly. */
  function readings(span) {
    var En = E();
    if (!En || !span) return [];
    var low = span.toLowerCase(), out = [], seen = {};
    var list;
    try { list = En.analyzeToken(low) || []; } catch (e) { return []; }
    list.forEach(function (a) {
      var k = a.inf + '|' + a.tense + '|' + a.person;
      if (seen[k]) return;
      var v = En.verbByInf(a.inf);
      if (!v) return;
      var idx = En.personsFor(a.tense).indexOf(a.person), form;
      if (idx < 0) return;
      try { form = En.conjugate(v, a.tense)[idx]; } catch (e) { return; }
      if (!form || form.toLowerCase() !== low) return;
      seen[k] = 1; out.push({ inf: a.inf, tense: a.tense, person: a.person, v: v });
    });
    return out;
  }
  function distinct(list, key) {
    var s = {}; list.forEach(function (x) { s[x[key]] = 1; }); return Object.keys(s);
  }

  /* ---- is the focus span really a verb? ------------------------------------
   * A noun slot ("el ___ (desarrollar) urbano", "la notaría") must never become a
   * verb item. Reject a span after a determiner, possessive or demonstrative, a
   * span that is a VOCAB noun headword, and a reading whose infinitive is itself
   * a VOCAB noun (the engine reads "notaría" as the conditional of notar). */
  var DET_BEFORE = /(^|\s)(el|la|los|las|un|una|unos|unas|mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras|este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|aquellos|aquellas|del|al)\s*$/i;
  var nounSet = null;
  function nouns() {
    if (nounSet && nounSet.n === (window.VOCAB || []).length) return nounSet.set;
    var set = Object.create(null);
    (window.VOCAB || []).forEach(function (w) {
      var es = String(w.es || '').toLowerCase().trim();
      var m = /^(el|la|los|las|un|una)\s+([^\s,\/(]+)$/.exec(es);
      if (m) set[m[2]] = 1;
      else if (w.gender && /^[^\s]+$/.test(es)) set[es] = 1;
    });
    nounSet = { n: (window.VOCAB || []).length, set: set };
    return set;
  }
  function verbSpan(r, span) {
    if (DET_BEFORE.test(r.es.slice(0, r.f[0]))) return false;
    var low = span.toLowerCase(), N = nouns();
    if (N[low]) return false;
    var En = E(), list;
    try { list = En.analyzeToken(low) || []; } catch (e) { return false; }
    if (!list.length) return false;
    return list.some(function (a) { return !N[String(a.inf).toLowerCase()]; });
  }

  /* ---- cloze -------------------------------------------------------------- */
  function cloze(r) {
    var span = spanOf(r);
    if (!span || !verbSpan(r, span)) return null;
    var rd = readings(span);
    if (!rd.length || distinct(rd, 'inf').length !== 1) return null;
    var pick = rd.filter(function (x) { return x.tense === 'presente'; })[0] || rd[0];
    if (pick.tense === 'imperativo' || pick.tense === 'impneg') return null;
    /* One form, several persons (vaya is yo and él/ella/usted): the subject in
     * the row decides, then the English; failing both the person is left unnamed. */
    var same = rd.filter(function (x) { return x.tense === pick.tense && x.person !== 'vosotros'; });
    var personKnown = true;
    if (distinct(same, 'person').length > 1) {
      var want = subjectPerson(r, span);
      var hit = want && same.filter(function (x) { return x.person === want; })[0];
      if (hit) pick = hit; else { personKnown = false; pick = same[0] || pick; }
    }
    /* No time word to lean on, so the English rides along: it fixes person and tense. */
    return { type: 'cloze', level: 1, text: blanked(r).replace('___', '___ (' + pick.inf + ')') + '  «' + flat(r.en) + '»',
             inf: pick.inf, tense: pick.tense, person: pick.person, personKnown: personKnown, en: flat(r.en),
             key: 'bank:' + r.id, bankId: r.id, bankKind: 'cloze', nodes: r.t };
  }
  var SUBJ = { yo: 'yo', tú: 'tú', él: 'él/ella', ella: 'él/ella', usted: 'él/ella', nosotros: 'nosotros', nosotras: 'nosotros',
               ellos: 'ellos', ellas: 'ellos', ustedes: 'ellos' };
  var SUBJ_SKIP = { no: 1, ya: 1, siempre: 1, nunca: 1, también: 1, solo: 1, sólo: 1 };
  function subjectPerson(r, span) {
    var before = String(r.es || '').slice(0, r.f ? r.f[0] : 0).replace(/[¿¡?!.,;:"“”()]/g, ' ').split(/\s+/).filter(Boolean);
    var k = before.length - 1;
    while (k >= 0 && SUBJ_SKIP[before[k].toLowerCase()]) k--;
    if (k >= 0) {
      var w = before[k], low = w.toLowerCase();
      if (SUBJ[low]) return SUBJ[low];
      if (k > 0 && /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(w)) return 'él/ella';
    }
    var en = String(r.en || '').trim().replace(/^[^A-Za-z]+/, '');
    if (/^I\b/.test(en)) return 'yo';
    if (/^(He|She)\b/.test(en)) return 'él/ella';
    if (/^We\b/.test(en)) return 'nosotros';
    if (/^They\b/.test(en)) return 'ellos';
    if (/^You\b/.test(en)) return null;     // tú, usted or ustedes: the English cannot say
    return null;
  }

  /* ---- gap (choice on a small word) ---------------------------------------- */
  var ART_DEF = ['el', 'la', 'los', 'las'], ART_INDEF = ['un', 'una', 'unos', 'unas'];
  var PREP_NEAR = {
    por: ['para', 'de', 'en'], para: ['por', 'a', 'de'], a: ['en', 'de', 'para'], de: ['a', 'en', 'desde'],
    en: ['a', 'de', 'sobre'], con: ['sin', 'de', 'en'], sin: ['con', 'de', 'en'], sobre: ['en', 'de', 'entre'],
    entre: ['en', 'de', 'sobre'], hasta: ['desde', 'a', 'para'], desde: ['hasta', 'de', 'en']
  };
  var CLITIC_REFL = ['me', 'te', 'se', 'nos'], CLITIC_DO = ['lo', 'la', 'los', 'las'], CLITIC_IO = ['le', 'les'];
  var N_ARTICLE = ['g:gender-articles', 'g:article-uses'];
  var N_OBJECT = ['g:direct-objects', 'g:object-pronoun-position', 'g:double-pronouns', 'g:indirect-objects', 'g:commands-with-pronouns'];
  function hasAny(r, list) { return (r.r || []).some(function (x) { return list.indexOf(x) !== -1; }); }

  function words(s) { return String(s || '').split(/\s+/).filter(Boolean).length; }
  function shuffle(a, rng) {
    var c = a.slice();
    for (var i = c.length - 1; i > 0; i--) { var j = Math.floor((rng || Math.random)() * (i + 1)); var t = c[i]; c[i] = c[j]; c[j] = t; }
    return c;
  }
  function pickN(list, n, rng) { return shuffle(list, rng).slice(0, n); }

  function gapKind(r, span) {
    var low = span.toLowerCase(), En = E();
    if (ART_DEF.indexOf(low) !== -1 || ART_INDEF.indexOf(low) !== -1) {
      if (low === 'la' || low === 'las' || low === 'los') {
        if (hasAny(r, N_OBJECT) && !hasAny(r, N_ARTICLE)) return { kind: 'clitic', set: CLITIC_DO };
        if (!hasAny(r, N_ARTICLE) || hasAny(r, N_OBJECT)) return null;
      }
      return { kind: 'article', set: ART_DEF.indexOf(low) !== -1 ? ART_DEF : ART_INDEF };
    }
    if (low === 'lo') return hasAny(r, N_OBJECT) ? { kind: 'clitic', set: CLITIC_DO } : null;
    if (CLITIC_REFL.indexOf(low) !== -1) return { kind: 'clitic', set: CLITIC_REFL };
    if (low === 'le' || low === 'les') return { kind: 'clitic', set: CLITIC_IO };
    if (PREP_NEAR[low]) return { kind: low === 'por' || low === 'para' ? 'porpara' : 'prep', near: PREP_NEAR[low] };
    var rd = readings(span);
    if (rd.length && rd.every(function (x) { return x.inf === 'ser' || x.inf === 'estar'; }) && En) {
      return { kind: 'serestar', rd: rd[0] };
    }
    return null;
  }

  /* A distractor that turns the sentence into another sentence the bank holds
   * is not wrong, only different: drop it. */
  function usable(r, opt) {
    return !esSeen[norm(r.es.slice(0, r.f[0]) + opt + r.es.slice(r.f[1]))];
  }

  function gap(r, rng) {
    var span = spanOf(r);
    if (!span) return null;
    var gk = gapKind(r, span);
    if (!gk) return null;
    var low = span.toLowerCase(), pool, focus;
    if (gk.kind === 'article') { pool = gk.set.filter(function (x) { return x !== low; }); focus = 'gr-articulo-definido-distribucion-a2'; }
    else if (gk.kind === 'clitic') { pool = gk.set.filter(function (x) { return x !== low; }); focus = 'gr-pronombres-atonos-a2'; }
    else if (gk.kind === 'prep' || gk.kind === 'porpara') {
      pool = gk.near.slice(); focus = gk.kind === 'porpara' ? 'por-para' : 'bank-preposition';
    } else {
      var En = E(), rd = gk.rd, other = rd.inf === 'ser' ? 'estar' : 'ser', ov = En.verbByInf(other), set = [];
      var idx = En.personsFor(rd.tense).indexOf(rd.person);
      try {
        var of = En.conjugate(ov, rd.tense)[idx];
        if (of) set.push(of.toLowerCase());
        var same = En.conjugate(rd.v, rd.tense).filter(function (f, i) { return i !== idx && f && f.indexOf(' ') === -1 && En.personsFor(rd.tense)[i] !== 'vosotros'; });
        if (same.length) set.push(same[Math.min(same.length - 1, (idx + 2) % same.length)].toLowerCase());
      } catch (e) { return null; }
      pool = set.filter(function (x) { return x !== low; }); focus = 'ser-estar';
    }
    pool = pool.filter(function (x) { return usable(r, cap(x, span)); });
    if (pool.length < 1) return null;
    var distract = gk.kind === 'serestar' ? pool.slice(0, 2) : pickN(pool, Math.min(3, pool.length), rng);
    if (distract.length < 1) return null;
    var opts = shuffle([low].concat(distract), rng).map(function (x) { return cap(x, span); });
    return { type: 'choice', level: 1, focus: focus, text: blanked(r) + '  «' + flat(r.en) + '»', options: opts, answer: opts.indexOf(span),
             why: '', en: flat(r.en), key: 'bank:' + r.id, bankId: r.id, bankKind: 'gap', nodes: r.t };
  }

  /* ---- structured input: read the form, say who or when ------------------------ */
  var WHO = {
    'yo': 'I', 'tú': 'you (tú)', 'él/ella': 'he, she or you (usted)', 'nosotros': 'we',
    'ellos': 'they or you all (ustedes)'
  };
  var WHEN = {
    presente: 'Now, or as a habit', preterito: 'Done and finished in the past', imperfecto: 'Past, ongoing or habitual',
    futuro: 'In the future', condicional: 'Would', perfecto: 'Has or have done'
  };
  /* A finite verb elsewhere in the sentence (so "who is doing it?" could be about either). */
  var FINITE = { presente: 1, preterito: 1, imperfecto: 1, futuro: 1, condicional: 1, perfecto: 1, presubj: 1, impsubj: 1 };
  function otherFinite(r) {
    var En = E(), rest = (r.es.slice(0, r.f[0]) + ' ' + r.es.slice(r.f[1])).toLowerCase().split(/[^a-záéíóúüñ]+/).filter(Boolean), n = 0;
    if (!En) return 0;
    rest.forEach(function (w) {
      var list;
      try { list = En.analyzeToken(w) || []; } catch (e) { return; }
      var hit = list.some(function (a) {
        if (!FINITE[a.tense] || !a.accentExact) return false;
        var v = En.verbByInf(a.inf);
        return !!v && !(window.VOCAB || []).some(function (x) { return !x.v && String(x.es || '').toLowerCase() === w && x.gender; });
      });
      if (hit && !/^(que|se|me|te|le|la|lo|las|los|nos|a|y|o|e|u|de|en|no|si|es|un|una)$/.test(w)) n++;
    });
    return n;
  }
  function readAndPick(r, rng) {
    var span = spanOf(r);
    if (!span || !verbSpan(r, span)) return null;
    /* Two finite verbs: the question is about one of them, so the prompt marks it with *stars* (the Apply renderer bolds them). */
    var marked = otherFinite(r) > 0 ? r.es.slice(0, r.f[0]) + '*' + r.es.slice(r.f[0], r.f[1]) + '*' + r.es.slice(r.f[1]) : null;
    if (marked && (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/.test(span) || r.es.indexOf('*') >= 0)) return null;
    var rd = readings(span).filter(function (x) { return x.tense !== 'imperativo' && x.tense !== 'impneg'; });
    if (!rd.length) return null;
    var persons = distinct(rd, 'person'), tenses = distinct(rd, 'tense');
    var who = persons.length === 1 && WHO[persons[0]], when = tenses.length === 1 && WHEN[tenses[0]];
    var useWhen = when && (tenses[0] !== 'presente' || !who);
    var labels, right, q;
    if (useWhen) {
      right = WHEN[tenses[0]]; q = 'When is it?';
      labels = Object.keys(WHEN).filter(function (k) { return k !== tenses[0]; }).map(function (k) { return WHEN[k]; });
    } else if (who) {
      right = WHO[persons[0]]; q = 'Who is doing it?';
      labels = Object.keys(WHO).filter(function (k) { return k !== persons[0]; }).map(function (k) { return WHO[k]; });
      /* él/ella and ellos cover usted and ustedes, so 'you (tú)' stays a fair distractor only for non-tú forms */
    } else return null;
    var opts = shuffle([right].concat(pickN(labels, 3, rng)), rng);
    return { type: 'choice', level: 1, focus: 'bank-read', text: '“' + flat(marked || r.es) + '”  ' + q, options: opts,
             answer: opts.indexOf(right), why: '', en: flat(r.en),
             key: 'bank:' + r.id, bankId: r.id, bankKind: 'read', nodes: r.t };
  }

  /* ---- translate ------------------------------------------------------------- */
  function translate(r) {
    var acc = r.a || [];
    try { if (window.LIB && window.LIB.match && window.LIB.match.expandAcceptList) acc = window.LIB.match.expandAcceptList(acc); } catch (e) { acc = r.a || []; }
    return { id: 'bank:' + r.id, key: 'bank:' + r.id, type: 'translate', level: 1, theme: r.th, prompt: r.en, es: r.es,
             accept: acc, models: [r.es], constraints: [], bankId: r.id, bankKind: 'translate', nodes: r.t };
  }

  /* Produce warm-up: put the words of the row in order (the 'build' schema). */
  function build(r) {
    var n = words(r.es);
    if (n < 3 || n > 9 || /\n/.test(r.es)) return null;
    return { id: 'bank:' + r.id, key: 'bank:' + r.id, type: 'build', level: 1, theme: r.th, en: r.en, answer: r.es,
             bankId: r.id, bankKind: 'build', nodes: r.t };
  }

  /* Last resort for a row with no usable span: which of three sentences says
   * this? The other two are bank sentences for the same node, so the learner
   * has to read all three. */
  function matchSentence(r, rng) {
    var node = (r.t || []).filter(function (x) { return x.charAt(0) !== 'l'; })[0];
    var pool = (node && byNode[node]) || [];
    if (pool.length < 3) return null;
    var mine = norm(r.es), seen = {}, alt = [];
    seen[mine] = 1;
    var start = Math.floor((rng || Math.random)() * pool.length);
    for (var i = 0; i < pool.length && alt.length < 2; i++) {
      var o = pool[(start + i) % pool.length], k = norm(o.es);
      if (seen[k] || words(o.es) > 14 || o.en === r.en) continue;
      seen[k] = 1; alt.push(o.es);
    }
    if (alt.length < 2) return null;
    var opts = shuffle([flat(r.es)].concat(alt.map(flat)), rng);
    return { type: 'choice', level: 1, focus: 'bank-read', text: '“' + flat(r.en) + '”  Which sentence says this?', options: opts,
             answer: opts.indexOf(flat(r.es)), why: '', en: flat(r.en), key: 'bank:' + r.id, bankId: r.id, bankKind: 'match', nodes: r.t };
  }

  /* Rebuild an item from a saved session: kind and row id are enough, the
   * distractors are drawn again (the learner has not seen them yet when the
   * session is restored at a card they have not reached; at one they have, the
   * card is simply shown again with the same correct answer). */
  function make(kind, r, rng) {
    if (!r) return null;
    if (kind === 'cloze') return cloze(r);
    if (kind === 'gap') return gap(r, rng);
    if (kind === 'read') return readAndPick(r, rng);
    if (kind === 'translate') return translate(r);
    if (kind === 'build') return build(r);
    if (kind === 'match') return matchSentence(r, rng);
    return null;
  }

  return { load: load, ready: ready, install: install, row: row, forNodes: forNodes, allowed: allowed,
           cloze: cloze, gap: gap, readAndPick: readAndPick, translate: translate, build: build, matchSentence: matchSentence, make: make,
           norm: norm, words: words, hitsOf: hitsOf,
           count: function () { return Object.keys(byId).length; } };
})();
