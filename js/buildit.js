/* ============================================================================
 * BUILDIT — "build it from what you know", and the learner's own script.
 *
 * Build-it chains (Language Transfer's method, evidence note section 4): one
 * short bank row the learner can fully read, then the same sentence with one
 * change at a time, each change one the engine can make and check. Every
 * step's Spanish is generated here, never authored:
 *
 *   person    the verb span re-conjugated for another person (ENGINE.conjugate),
 *             English from ENGINE.enPhrase
 *   tense     the preterite, only when its lesson is known and the row carries
 *             no time word that would clash; English from enPhrase
 *   neg       "no" before the verb (present only: do/does not + the base form)
 *   pronoun   a noun phrase after the verb (article + a lexeme the graph knows)
 *             becomes lo, la, los, las before the verb; English "it" or "them"
 *
 *   prompts(known, todayNodes, n, rng[, opts]) -> [{steps:[{en, es, accept, from, change}]}]
 *   aboutMe store: load, add, edit, cards, constraint (see below)
 *
 * The about-me script is a document in localStorage 'fluidez.aboutme', an
 * array of lines {unit, es, en, p, day}. Line n is a review card
 * 'k:aboutme:<n>' (front: the English, or the prompt when the English was left
 * blank; back: the learner's own Spanish), enrolled through SRS.enrol.
 * ========================================================================== */
window.BuildIt = (function () {
  var E = function () { return window.ENGINE; };
  var KEY = 'fluidez.aboutme';
  var PERSON_IDX = [0, 1, 2, 3, 5];            // yo, tu, el, nosotros, ellos (no vosotros)
  var PRONOUN_ES = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  var TENSE_LESSON = { ar: /^g:preterite-ar$/, er: /^g:preterite-er-ir$/ };   // by verb type; ir is left out (many irregular)
  var TIME_WORDS = /\b(ahora|hoy|siempre|ma[nñ]ana|ayer|todos|todas|cada|despu[eé]s|luego|esta|este|ya|nunca|a veces|ahorita|pronto)\b/i;
  var CLITIC = /(^|\s)(me|te|se|nos|le|les|lo|la|los|las|mi|mis|tu|tus|su|sus)(\s|$|[.,!?])/i;

  function shuffle(a, rng) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function words(s) { return String(s || '').trim().split(/\s+/).filter(Boolean); }
  function lc1(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---- the verb span of a row ------------------------------------------- */
  function spanOf(r) {
    if (!r.f || r.f.length !== 2) return null;
    var s = r.es.slice(r.f[0], r.f[1]);
    return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/.test(s) ? s : null;
  }
  /* The one verb reading of the span that the engine reproduces exactly. */
  function reading(span) {
    var En = E(), low = span.toLowerCase(), found = null, list;
    try { list = En.analyzeToken(low) || []; } catch (e) { return null; }
    for (var i = 0; i < list.length; i++) {
      var a = list[i], v = En.verbByInf(a.inf);
      if (!v || a.tense !== 'presente') continue;
      var idx = En.personsFor(a.tense).indexOf(a.person);
      if (idx < 0) continue;
      var form;
      try { form = En.conjugate(v, a.tense)[idx]; } catch (e) { continue; }
      if (!form || form.toLowerCase() !== low) continue;
      if (found && (found.inf !== a.inf || found.idx !== idx)) return null;   // ambiguous
      found = { v: v, inf: a.inf, tense: a.tense, idx: idx };
    }
    return found;
  }
  /* The row's English must contain the engine's English for the original verb
   * form; that stretch is what each change rewrites. */
  function enStretch(en, ph) {
    var variants = [ph];
    if (/^he\/she /.test(ph)) variants.push(ph.replace('he/she', 'he'), ph.replace('he/she', 'she'));
    for (var i = 0; i < variants.length; i++) {
      var at = en.toLowerCase().indexOf(variants[i].toLowerCase());
      if (at >= 0 && en.toLowerCase().indexOf(variants[i].toLowerCase(), at + 1) < 0) return { at: at, len: variants[i].length };
    }
    return null;
  }

  /* ---- noun phrases the graph knows ------------------------------------- */
  var lexCache = null;
  function lexemes() {
    if (lexCache) return lexCache;
    lexCache = {};
    var nodes = (window.GRAPH && window.GRAPH.nodes) || [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.id.charAt(0) !== 'l' || !n.es || !n.en) continue;
      var m = /^(el|la|los|las) (\S+)$/.exec(n.es);
      if (m) lexCache[m[2].toLowerCase()] = { art: m[1], en: n.en.split(/[,;\/(]/)[0].trim().toLowerCase() };
    }
    return lexCache;
  }
  /* "Quiero el café." -> {np: 'el café', clitic: 'lo', enNp: 'the coffee'} when the
   * noun phrase closes the sentence right after the verb span. */
  function nounPhrase(r, f1, row) {
    var post = r.es.slice(f1), m = /^\s+(el|la|los|las|un|una|unos|unas)\s+(\S+?)([.!]?)$/i.exec(post);
    if (!m) return null;
    var lex = lexemes()[m[2].toLowerCase()];
    if (!lex) return null;
    var art = m[1].toLowerCase();
    var clitic = { el: 'lo', un: 'lo', la: 'la', una: 'la', los: 'los', unos: 'los', las: 'las', unas: 'las' }[art];
    var plural = /^(los|las|unos|unas)$/.test(art);
    var en = r.en.replace(/[.!]$/, ''), low = en.toLowerCase(), noun = lex.en;
    var tries = ['the ' + noun, 'a ' + noun, 'an ' + noun, 'some ' + noun, noun];
    for (var i = 0; i < tries.length; i++) {
      var at = low.lastIndexOf(tries[i]);
      if (at >= 0 && at + tries[i].length === low.length && (at === 0 || low.charAt(at - 1) === ' '))
        return { clitic: clitic, tail: m[3] || '', enAt: at, enLen: tries[i].length, enNew: plural ? 'them' : 'it' };
    }
    return null;
  }

  /* ---- one change applied to a state ------------------------------------ */
  function render(row, base, st) {
    var En = E(), span = base.span, f0 = row.f[0], f1 = row.f[1];
    var form = En.conjugate(base.v, st.tense)[st.idx];
    var pre = row.es.slice(0, f0), post = row.es.slice(f1);
    if (st.pron) post = base.np.tail;
    var es = pre + (st.neg ? 'no ' : '') + (st.pron ? base.np.clitic + ' ' : '') + form + post;
    if (f0 === 0 && (st.neg || st.pron || st.idx !== base.idx0 || st.tense !== 'presente')) es = cap(es);
    // English
    var ph = En.enPhrase(base.v, st.tense, st.idx).text, enVerb = ph;
    if (st.neg) {
      var parts = ph.split(' '), subj = parts[0];
      var b = En.enPhrase(base.v, 'presente', 0).text;
      if (/^I (am|have to|can|must|should)\b/.test(b) || /^I am\b/.test(b)) {
        enVerb = ph.replace(/^(\S+ (?:am|are|is|can|must|should))\b/, '$1 not');
      } else {
        var baseForm = b.replace(/^I /, '');
        enVerb = subj + (/^(he\/she|he|she)$/.test(subj) ? " doesn't " : " don't ") + baseForm;
      }
    }
    var en = base.en.slice(0, base.stretch.at) + enVerb + base.en.slice(base.stretch.at + base.stretch.len);
    if (st.pron) {
      var q = base.np, off = enVerb.length - base.stretch.len;
      en = en.slice(0, q.enAt + off) + q.enNew + en.slice(q.enAt + q.enLen + off);
    }
    if (!/[.!?]$/.test(en)) en += base.enEnd;
    return { es: es, en: cap(en), form: form };
  }

  /* ---- chains ------------------------------------------------------------ */
  function baseOf(r, known) {
    if (r.es.indexOf('\n') >= 0 || /[¿?]/.test(r.es) || /[(\n]/.test(r.en)) return null;
    var n = words(r.es).length;
    if (n < 3 || n > 6) return null;
    /* one clause, verb first (the subject is dropped, so a person change cannot clash
     * with a stated subject), no negation yet, no clitic glued to an infinitive */
    if (r.f && r.f[0] !== 0) return null;
    if (/[,;:]/.test(r.es) || /(^|\s)no\s/i.test(r.es) || /\w(r|rse)(me|te|lo|la|los|las|nos|se|le|les)(\s|[.!]|$)/i.test(r.es)) return null;
    var span = spanOf(r);
    if (!span) return null;
    var rd = reading(span);
    if (!rd) return null;
    /* a second finite verb in the row would be left behind by a person change */
    var others = words(r.es.slice(r.f[1])), En0 = E();
    for (var o = 0; o < others.length; o++) {
      var tk = others[o].toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
      var an = tk ? (En0.analyzeToken(tk) || []) : [];
      for (var q = 0; q < an.length; q++) if (an[q].tense === 'presente') return null;
    }
    var rest = r.es.slice(0, r.f[0]) + ' ' + r.es.slice(r.f[1]);
    if (CLITIC.test(rest)) return null;
    var en = r.en.replace(/[.!]$/, ''), enEnd = (r.en.match(/[.!]$/) || ['.'])[0];
    var ph = E().enPhrase(rd.v, rd.tense, rd.idx).text;
    var st = enStretch(en, ph);
    if (!st || st.at !== 0) return null;               // the verb opens the English too
    var base = { span: span, v: rd.v, inf: rd.inf, idx0: rd.idx, en: en, enEnd: enEnd, stretch: st, tenses: [], np: null };
    if (!TIME_WORDS.test(r.es) && known && !(rd.v.forms && rd.v.forms.preterito) && rd.v.type !== 'ir') {
      var lesson = TENSE_LESSON[rd.v.type], ok = false;
      if (lesson) known.forEach(function (id) { if (lesson.test(id)) ok = true; });
      if (ok) base.tenses.push('preterito');
    }
    try { base.np = nounPhrase(r, r.f[1], r); } catch (e) { base.np = null; }
    return base;
  }

  function chainFor(r, base, known, rng) {
    var En = E(), changes = [], step1 = { en: r.en, es: r.es, accept: (r.a || []).slice(), from: [], change: null };
    var persons = shuffle(PERSON_IDX.filter(function (i) { return i !== base.idx0; }), rng);
    changes.push('person');
    if (base.tenses.length) changes.push('tense');
    changes.push('neg');
    if (base.np) changes.push('pronoun');
    changes = shuffle(changes, rng);
    // person (or tense) first reads most naturally when neg/pronoun come last
    var order = changes.slice(0, 2);
    /* negation is built for the present only, so it never pairs with a tense change */
    if (order.indexOf('tense') >= 0 && order.indexOf('neg') >= 0) order[order.indexOf('tense')] = changes[2] || 'person';
    if (order[0] === order[1]) return null;
    var st = { idx: base.idx0, tense: 'presente', neg: false, pron: false };
    var keep = words(r.es).filter(function (w) { return w.length > 0; }).slice(0, 4).map(function (w) { return w.replace(/[.,!]/g, ''); });
    step1.from = keep;
    var steps = [step1], prev = r.es;
    for (var k = 0; k < 2; k++) {
      var ch = order[k], extra = [];
      if (ch === 'person') { st.idx = persons[0]; extra = [PRONOUN_ES[st.idx]]; }
      else if (ch === 'tense') { st.tense = base.tenses[0]; extra = [En.conjugate(base.v, 'presente')[st.idx]]; }
      else if (ch === 'neg') { if (st.tense !== 'presente') { st.tense = 'presente'; } st.neg = true; extra = ['no']; }
      if (ch === 'pronoun') { st.pron = true; extra = [base.np.clitic]; }
      var out = render(r, base, st);
      steps.push({ en: out.en, es: out.es, accept: [], from: [prev].concat(extra), change: ch, form: out.form });
      prev = out.es;
    }
    var seen = {};
    for (var i = 0; i < steps.length; i++) { if (seen[steps[i].es]) return null; seen[steps[i].es] = 1; }
    return { steps: steps, rowId: r.id };
  }

  function prompts(known, todayNodes, n, rng, opts) {
    var BI = window.BankItems, En = E();
    opts = opts || {};
    rng = rng || Math.random;
    if (!BI || !En || !todayNodes || !todayNodes.size) return [];
    var rows;
    try { rows = BI.forNodes(todayNodes, known, { band: opts.band }) || []; } catch (e) { return []; }
    var out = [], used = {};
    var primary = shuffle(rows.slice(0, rows.primary != null ? rows.primary : rows.length), rng);
    var second = shuffle(rows.slice(rows.primary != null ? rows.primary : rows.length), rng);
    var pool = primary.concat(second), tries = 0;
    for (var i = 0; i < pool.length && out.length < n && tries < 4000; i++, tries++) {
      var r = pool[i], base = baseOf(r, known);
      if (!base || used[base.inf]) continue;
      var ch = chainFor(r, base, known, rng);
      if (ch) { out.push(ch); used[base.inf] = 1; }
    }
    return out;
  }

  /* "You know quiero and comer. Say: I want to eat now." */
  function lead(step) {
    var f = (step.from || []).filter(Boolean).map(function (x) { return '*' + x + '*'; });
    var txt = f.length === 0 ? '' : 'You know ' + (f.length === 1 ? f[0] : f.slice(0, -1).join(', ') + ' and ' + f[f.length - 1]) + '.';
    return txt;
  }

  /* ---- the about-me script ---------------------------------------------- */
  function load() {
    try { var a = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function cardId(n) { return 'k:aboutme:' + n; }
  /* Add a line; returns its index. One line per unit day. */
  function add(line) {
    var a = load();
    for (var i = 0; i < a.length; i++) if (a[i].unit === line.unit && a[i].day === line.day) return i;
    a.push({ unit: line.unit || '', es: String(line.es || '').trim(), en: String(line.en || '').trim(), p: String(line.p || ''), day: line.day == null ? 0 : line.day });
    save(a);
    var n = a.length - 1;
    if (window.SRS && window.SRS.enrol) window.SRS.enrol(cardId(n));
    return n;
  }
  function edit(n, es, en) {
    var a = load();
    if (!a[n]) return false;
    var t = String(es || '').trim();
    if (!t) return false;
    a[n].es = t; a[n].en = String(en == null ? a[n].en : en).trim();
    save(a);
    return true;
  }
  function has(unit, day) {
    return load().some(function (l) { return l.unit === unit && l.day === day; });
  }
  function cards() {
    return load().map(function (l, n) {
      return { id: cardId(n), front: l.en || l.p || 'A true line about you', back: l.es, kind: 'aboutme', hint: null };
    });
  }
  function count() { return load().length; }

  /* The unit's point as a prompt and a checker constraint. `nodes` is the day's
   * node set (or any iterable of ids). A short chunk -> include it; a tense
   * lesson -> a verb in that tense; otherwise six words or more. */
  var TENSE_OF = [[/preterite/, 'preterito', 'the preterite'], [/imperfect/, 'imperfecto', 'the imperfect'],
    [/future/, 'futuro', 'the future'], [/conditional/, 'condicional', 'the conditional'], [/present/, 'presente', 'the present']];
  function constraint(nodes) {
    var ids = [], graph = (window.GRAPH && window.GRAPH.nodes) || [];
    if (nodes && nodes.forEach) nodes.forEach(function (id) { ids.push(id); });
    var by = {};
    graph.forEach(function (n) { by[n.id] = n; });
    for (var i = 0; i < ids.length; i++) {
      if (ids[i].charAt(0) !== 'c' || !by[ids[i]]) continue;
      var forms = (by[ids[i]].forms || [{ es: by[ids[i]].es }]).map(function (f) { return String(f.es || '').replace(/[¿?¡!.,]/g, '').trim(); })
        .filter(function (s) { return s && words(s).length <= 3; });
      if (forms.length) {
        var show = forms[0].toLowerCase();
        return { constraints: [{ type: 'containsAny', words: forms.map(function (s) { return s.toLowerCase(); }), hint: show }],
          text: 'using *' + show + '*' };
      }
    }
    for (var j = 0; j < ids.length; j++) {
      if (ids[j].charAt(0) !== 'g') continue;
      for (var k = 0; k < TENSE_OF.length; k++) {
        if (TENSE_OF[k][0].test(ids[j])) return { constraints: [{ type: 'anyVerbInTense', tense: TENSE_OF[k][1] }], text: 'with a verb in ' + TENSE_OF[k][2] };
      }
    }
    return { constraints: [{ type: 'minWords', n: 6 }], text: 'in six words or more' };
  }

  return { prompts: prompts, lead: lead, load: load, add: add, edit: edit, has: has, cards: cards, count: count,
    constraint: constraint, cardId: cardId, KEY: KEY };
})();
