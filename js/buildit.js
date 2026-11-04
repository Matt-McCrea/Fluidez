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
  /* The one verb reading of the span that the engine reproduces exactly, in
   * any tense the learner knows: present, preterite, imperfect, and the present
   * subjunctive when a trigger stands before the verb. */
  var READ_TENSES = { presente: 1, preterito: 1, imperfecto: 1, presubj: 1 };
  function reading(span, trigger) {
    var En = E(), low = span.toLowerCase(), found = null, list;
    try { list = En.analyzeToken(low) || []; } catch (e) { return null; }
    for (var i = 0; i < list.length; i++) {
      var a = list[i], v = En.verbByInf(a.inf);
      if (!v || !READ_TENSES[a.tense] || (a.tense === 'presubj' && !trigger)) continue;
      var idx = En.personsFor(a.tense).indexOf(a.person);
      if (idx < 0) continue;
      var form;
      try { form = En.conjugate(v, a.tense)[idx]; } catch (e) { continue; }
      if (!form || form.toLowerCase() !== low) continue;
      if (found && (found.inf !== a.inf || found.idx !== idx || found.tense !== a.tense)) return null;   // ambiguous
      found = { v: v, inf: a.inf, tense: a.tense, idx: idx };
    }
    return found;
  }
  /* "Voy a cocinar el domingo": the plan form. The span the bank marks may be only *Voy* or all of *Voy a comer*;
   * either way the part a person change rewrites is the form of *ir* alone, and the English is "I'm going to". */
  var IR_FORM = { voy: 1, vas: 1, va: 1, vamos: 1, van: 1 };
  var GOING = { 0: ["I'm going to", "I'm not going to", ["i'm going to", 'i am going to']],
    1: ["you're going to", "you're not going to", ["you're going to", 'you are going to']],
    2: ['he/she is going to', 'he/she is not going to', ["he's going to", "she's going to", 'he is going to', 'she is going to']],
    3: ["we're going to", "we're not going to", ["we're going to", 'we are going to']],
    5: ["they're going to", "they're not going to", ["they're going to", 'they are going to']] };
  function periOf(r) {
    if (!r.f || r.f.length !== 2 || r.f[0] !== 0) return null;
    var m = /^([A-Za-zÁÉÍÓÚáéíóú]+) a ([a-záéíóúñ]+)(?=[\s.!]|$)/.exec(r.es);
    if (!m || !IR_FORM[m[1].toLowerCase()] || !/(ar|er|ir|ír)$/.test(m[2])) return null;
    var len = m[1].length, span = r.es.slice(0, r.f[1]);
    if (span.length !== len && span !== m[0]) return null;      // the marked span is the form, or the form and its infinitive
    return len;
  }
  function enStretchPeri(en, idx) {
    var vs = GOING[idx] && GOING[idx][2], low = en.toLowerCase().replace(/\u2019/g, "'");
    for (var i = 0; vs && i < vs.length; i++) {
      if (low.indexOf(vs[i]) === 0) return { at: 0, len: vs[i].length };
    }
    return null;
  }
  var TRIGGER = /\b(que|ojal[aá]|quiz[aá]s?|tal vez)\b/i;

  /* The row's English must contain the engine's English for the original verb
   * form; that stretch is what each change rewrites. */
  function enStretch(en, ph) {
    var variants = [ph];
    if (/^he\/she /.test(ph)) variants.push(ph.replace('he/she', 'he'), ph.replace('he/she', 'she'));
    /* the sentence may contract be: "We're from Cali" for "we are" */
    var cm = /^(I|you|he\/she|we|they) (am|are|is)\b/.exec(ph);
    if (cm) {
      var subs = cm[1] === 'he/she' ? ['he', 'she'] : [cm[1]], suf = { am: "'m", are: "'re", is: "'s" }[cm[2]], tail = ph.slice(cm[0].length);
      subs.forEach(function (sj) { variants.push(sj + suf + tail, sj + '\u2019' + suf.slice(1) + tail); });
    }
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

  // enPhrase marks ser and estar senses in brackets ("I am (state)"); the sentence does not
  function enP(v, tense, idx) { return E().enPhrase(v, tense, idx).text.replace(/\s*\([^)]*\)/g, ''); }

  /* ---- one change applied to a state ------------------------------------ */
  function render(row, base, st) {
    var En = E(), span = base.span, f0 = row.f[0], f1 = row.f[1];
    var form = En.conjugate(base.v, st.tense)[st.idx];
    var pre = row.es.slice(0, f0), post = row.es.slice(f1);
    if (st.pron) post = base.np.tail;
    if (st.swap) post = ' ' + st.swap.es + base.swapEnd;
    var es = pre + (st.neg ? 'no ' : '') + (st.pron ? base.np.clitic + ' ' : '') + form + post;
    if (f0 === 0 && (st.neg || st.pron || st.swap || st.idx !== base.idx0 || st.tense !== base.tense0)) es = cap(es);
    // English
    var ph = base.peri ? GOING[st.idx][0] : enP(base.v, st.tense, st.idx), enVerb = ph;
    if (base.peri) {
      if (st.neg) enVerb = GOING[st.idx][1];
    } else if (st.neg) {
      var parts = ph.split(' '), subj = parts[0];
      var b = enP(base.v, 'presente', 0);
      if (/^I (am|have to|can|must|should)\b/.test(b) || /^I am\b/.test(b)) {
        enVerb = ph.replace(/^(\S+ (?:am|are|is|was|were|can|must|should))\b/, '$1 not');
      } else if (st.tense === 'preterito') {
        enVerb = subj + " didn't " + b.replace(/^I /, '');
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
    if (st.swap) {
      var offS = enVerb.length - base.stretch.len, sw = base.swapAt;
      en = en.slice(0, sw.at + offS) + st.swap.en + en.slice(sw.at + sw.len + offS);
    }
    if (!/[.!?]$/.test(en)) en += base.enEnd;
    return { es: es, en: cap(en), form: form };
  }

  /* ---- chains ------------------------------------------------------------ */
  function baseOf(r, known) {
    var peri = periOf(r);
    if (peri) { var pr = {}; for (var pk in r) pr[pk] = r[pk]; pr.f = [0, peri]; r = pr; }
    if (r.es.indexOf('\n') >= 0 || /[¿?]/.test(r.es) || /[(\n]/.test(r.en)) return null;
    var n = words(r.es).length;
    if (n < 3 || n > 6) return null;
    if (!r.f) return null;
    var span = spanOf(r);
    if (!span) return null;
    var pre = r.es.slice(0, r.f[0]);
    var trig = r.f[0] > 0 && TRIGGER.test(pre) && words(pre).length <= 3;
    /* one clause, verb first (the subject is dropped, so a person change cannot clash
     * with a stated subject), except after a subjunctive trigger; no negation yet,
     * no clitic glued to an infinitive */
    if (r.f[0] !== 0 && !trig) return null;
    if (/[,;:]/.test(r.es) || /(^|\s)no\s/i.test(r.es) || /\w(r|rse)(me|te|lo|la|los|las|nos|se|le|les)(\s|[.!]|$)/i.test(r.es)) return null;
    var rd = reading(span, trig);
    if (!rd) return null;
    /* a second finite verb in the row would be left behind by a person change */
    var others = words(r.es.slice(r.f[1])), En0 = E();
    for (var o = peri ? 2 : 0; o < others.length && rd.inf !== 'ser' && rd.inf !== 'estar'; o++) {   // (the plan form's own *a* and infinitive are skipped)   // (casa is not casar after estoy en)
      var tk = others[o].toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
      var an = tk ? (En0.analyzeToken(tk) || []) : [];
      for (var q = 0; q < an.length; q++) if (an[q].tense === 'presente') return null;
    }
    var rest = pre + ' ' + r.es.slice(r.f[1]);
    if (CLITIC.test(rest)) return null;
    var en = r.en.replace(/[.!]$/, ''), enEnd = (r.en.match(/[.!]$/) || ['.'])[0];
    if (peri && (rd.inf !== 'ir' || rd.tense !== 'presente')) return null;
    var ph = peri ? (GOING[rd.idx] || [''])[0] : enP(rd.v, rd.tense, rd.idx);
    var st = peri ? enStretchPeri(en, rd.idx) : enStretch(en, ph);
    if (!st || (st.at !== 0 && !trig)) return null;               // the verb opens the English too
    var base = { span: span, v: rd.v, inf: rd.inf, idx0: rd.idx, tense0: rd.tense, en: en, enEnd: enEnd, stretch: st, tenses: [], np: null,
                 form0: span.toLowerCase(), peri: !!peri, row: r };
    if (rd.tense === 'presente' && !TIME_WORDS.test(r.es) && known && !(rd.v.forms && rd.v.forms.preterito) && rd.v.type !== 'ir') {
      var lesson = TENSE_LESSON[rd.v.type], ok = false;
      if (lesson) known.forEach(function (id) { if (lesson.test(id)) ok = true; });
      if (ok) base.tenses.push('preterito');
    }
    try { base.np = nounPhrase(r, r.f[1], r); } catch (e) { base.np = null; }
    return base;
  }

  /* ---- ser and estar: swap the adjective or the place ---------------------- */
  var PLACES = [['en casa', ['at home']], ['en el trabajo', ['at work']], ['en la oficina', ['at the office', 'in the office']],
    ['en la escuela', ['at school']], ['en el parque', ['at the park', 'in the park']], ['aquí', ['here']], ['en el café', ['at the café', 'in the café']]];
  var ADJ_O = [['cansad', 'tired'], ['ocupad', 'busy'], ['list', 'ready'], ['enferm', 'sick'], ['aburrid', 'bored']];
  var ADJ_E = [['content', 'happy'], ['trist', 'sad']];
  function swapsOf(r, base) {
    if (base.inf !== 'ser' && base.inf !== 'estar') return null;
    if (base.tense0 !== 'presente' && base.tense0 !== 'preterito' && base.tense0 !== 'imperfecto') return null;
    var tail = r.es.slice(r.f[1]).replace(/[.!]$/, '').trim(), end = (r.es.match(/[.!]$/) || [''])[0];
    var enl = base.en.toLowerCase(), i, k;
    for (i = 0; i < PLACES.length; i++) {
      if (PLACES[i][0] !== tail.toLowerCase()) continue;
      for (k = 0; k < PLACES[i][1].length; k++) {
        var v = PLACES[i][1][k];
        if (enl.slice(-v.length) === v && enl.length > v.length) {
          var others = PLACES.filter(function (x, j) { return j !== i; }).map(function (x) { return { es: x[0], en: x[1][0] }; });
          return { at: base.en.length - v.length, len: v.length, end: end, others: others, person: true };
        }
      }
      return null;
    }
    var m = /^(.+?)(os|as|o|a|e)$/.exec(tail.toLowerCase());
    if (!m) return null;
    var table = m[2] === 'e' ? ADJ_E : ADJ_O, self = -1;
    for (i = 0; i < table.length; i++) if (table[i][0] === m[1]) self = i;
    if (self < 0) return null;
    var enAdj = table[self][1];
    if (enl.slice(-enAdj.length) !== enAdj || enl.length === enAdj.length) return null;
    var list = table.filter(function (x, j) { return j !== self; }).map(function (x) { return { es: x[0] + m[2], en: x[1] }; });
    return { at: base.en.length - enAdj.length, len: enAdj.length, end: end, others: list, person: false };
  }

  function chainFor(r, base, known, rng) {
    if (base.row) r = base.row;
    var En = E(), changes = [], step1 = { en: r.en, es: r.es, accept: (r.a || []).slice(), from: [], change: null };
    var sw = base.swaps;
    var persons = shuffle(PERSON_IDX.filter(function (i) { return i !== base.idx0; }), rng);
    if (sw) {
      var cand = shuffle(sw.others, rng);
      if (cand.length < 2 && !sw.person) return null;
      changes = sw.person && cand.length ? shuffle(['person', 'swap', 'swap'], rng).slice(0, 2) : ['swap', 'swap'];
      if (cand.length < 2) changes = ['swap', 'person'];
      if (!sw.person) changes = ['swap', 'swap'];
    } else {
      changes.push('person');
      if (base.tenses.length) changes.push('tense');
      if (base.tense0 === 'presente' || base.tense0 === 'preterito') changes.push('neg');
      if (base.np) changes.push('pronoun');
      changes = shuffle(changes, rng);
    }
    // person (or tense) first reads most naturally when neg/pronoun come last
    var order = changes.slice(0, 2);
    /* negation is built for the present and preterite only, so it never pairs with a tense change */
    if (!sw && order.indexOf('tense') >= 0 && order.indexOf('neg') >= 0) order[order.indexOf('tense')] = changes[2] || 'person';
    if (!sw && order[0] === order[1]) return null;
    if (order.length < 2) return null;
    var st = { idx: base.idx0, tense: base.tense0, neg: false, pron: false, swap: null };
    if (sw) { base.swapAt = { at: sw.at, len: sw.len }; base.swapEnd = sw.end; }
    step1.from = reused(r.es, r.es, [base.form0]);
    var steps = [step1], prev = r.es, swapAt = 0;
    for (var k = 0; k < 2; k++) {
      var ch = order[k], extra = [];
      if (ch === 'person') { st.idx = persons[0]; }
      else if (ch === 'tense') { st.tense = base.tenses[0]; }
      else if (ch === 'neg') { if (st.tense !== 'presente' && st.tense !== 'preterito') st.tense = base.tense0; st.neg = true; extra = ['no']; }
      else if (ch === 'swap') { st.swap = shuffle(sw.others, rng)[swapAt++ % sw.others.length]; if (k === 1 && steps[1].swapEs === st.swap.es) st.swap = sw.others.filter(function (x) { return x.es !== steps[1].swapEs; })[0] || st.swap; }
      if (ch === 'pronoun') { st.pron = true; extra = [base.np.clitic]; }
      var out = render(r, base, st);
      if (ch === 'person' || ch === 'tense') extra = [out.form];
      if (ch === 'swap') extra = [out.form];
      var stp = { en: out.en, es: out.es, accept: [], from: reused(prev, out.es, extra), change: ch, form: out.form };
      if (ch === 'swap') stp.swapEs = st.swap.es;
      steps.push(stp);
      prev = out.es;
    }
    var seen = {};
    for (var i = 0; i < steps.length; i++) { if (seen[steps[i].es]) return null; seen[steps[i].es] = 1; }
    return { steps: steps, rowId: r.id };
  }

  /* The words a step really reuses: the new form or little word it turns on, then
   * at most one content word that survives from the sentence before. Never a whole
   * sentence, never a conjunction, article or preposition. */
  var STOP = /^(y|e|o|u|pero|que|si|ni|pues|el|la|los|las|un|una|unos|unas|de|del|a|al|en|con|por|para|sin|me|te|se|nos|lo|le|les|no|mi|tu|su)$/;
  function bareWord(w) { return String(w || '').toLowerCase().replace(/[^a-záéíóúüñ]/g, ''); }
  function reused(prevEs, newEs, extra) {
    var out = [];
    (extra || []).forEach(function (x) { if (x && words(x).length === 1 && out.indexOf(x) < 0) out.push(x); });
    var inNew = {};
    words(newEs).forEach(function (w) { inNew[bareWord(w)] = 1; });
    var cand = words(prevEs).map(bareWord).filter(function (w) { return w && inNew[w] && !STOP.test(w) && w.length > 2 && out.indexOf(w) < 0; });
    if (cand.length) out.push(cand[cand.length - 1]);
    if (!out.length) { var any = words(newEs).map(bareWord).filter(function (w) { return w && !STOP.test(w); }); if (any.length) out.push(any[0]); }
    return out.slice(0, 2);
  }

  function dayVerbs(todayNodes, opts) {
    var En = E(), out = {};
    (opts.verbs || []).forEach(function (v) { out[v] = 1; });
    todayNodes.forEach(function (id) {
      if (id.charAt(0) !== 'l') return;
      var inf = id.slice(2);
      try { if (/(ar|er|ir|ír)$/.test(inf) && En.verbByInf(inf)) out[inf] = 1; } catch (e) {}
    });
    var lid = opts.lessonId, L = lid && (window.ALL_LESSONS || []).filter(function (x) { return x.id === lid; })[0];
    if (L) (L.keywords || []).forEach(function (k) {
      var w = bareWord(String(k && k.es || '').split(/\s+/)[0]);
      if (!w) return;
      try { (En.analyzeToken(w) || []).forEach(function (a) { out[a.inf] = 1; }); } catch (e) {}
    });
    return out;
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
    var dv = {}, serEstar = false;
    try { dv = dayVerbs(todayNodes, opts); } catch (e) { dv = {}; }
    todayNodes.forEach(function (id) { if (/^g:(.*[-:])?(ser|estar)([-:]|$)/.test(id)) serEstar = true; });
    function verbOf(r) { var sp = spanOf(r); if (!sp) return ''; try { return ((En.analyzeToken(sp.toLowerCase()) || [])[0] || {}).inf || ''; } catch (e) { return ''; } }
    function prefer(list) {
      var mine = list.filter(function (r) { return dv[verbOf(r)]; });
      return mine.concat(list.filter(function (r) { return !dv[verbOf(r)]; }));
    }
    var pool = prefer(primary).concat(prefer(second)), tries = 0;
    for (var i = 0; i < pool.length && out.length < n && tries < 4000; i++, tries++) {
      var r = pool[i], base = baseOf(r, known);
      if (!base || used[base.inf]) continue;
      if (serEstar) { base.swaps = swapsOf(r, base); if (!base.swaps) continue; }
      var ch = chainFor(r, base, known, rng);
      if (ch) { out.push(ch); used[base.inf] = 1; }
    }
    if (serEstar && !out.length) {                   // no swappable row today: build the ordinary chain
      for (var i2 = 0; i2 < pool.length && out.length < n; i2++) {
        var r2 = pool[i2], b2 = baseOf(r2, known);
        if (!b2 || used[b2.inf]) continue;
        var c2 = chainFor(r2, b2, known, rng);
        if (c2) { out.push(c2); used[b2.inf] = 1; }
      }
    }
    return out;
  }

  /* "You know *necesitamos* and *pan*." Only single words the step reuses. */
  function tr(es, en) { return (window.UI && window.UI.t) ? window.UI.t(es, en) : en; }
  function lead(step) {
    var f = (step.from || []).filter(function (x) { return x && words(x).length === 1 && !STOP.test(bareWord(x)) || x === 'no' || (x && /^(lo|la|los|las)$/.test(x)); })
      .map(function (x) { return '*' + x + '*'; });
    var txt = f.length === 0 ? '' : tr('Ya sabes ', 'You know ') + (f.length === 1 ? f[0] : f.slice(0, -1).join(', ') + tr(' y ', ' and ') + f[f.length - 1]) + '.';
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
    if (isDuplicate(line.es)) return -1;               // the same line is not added twice
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
  /* The can-do of the lesson that teaches most of these nodes, "say where you are from". */
  function canDoFor(ids) {
    var LN = window.LESSON_NODES || {}, best = null, bestN = 0, set = {};
    ids.forEach(function (id) { set[id] = 1; });
    for (var k in LN) {
      var n = 0; ((LN[k] && LN[k].teaches) || []).forEach(function (id) { if (set[id]) n++; });
      if (n > bestN) { bestN = n; best = k; }
    }
    var L = best && (window.ALL_LESSONS || []).filter(function (x) { return x.id === best; })[0];
    return L && L.canDo ? String(L.canDo).replace(/[.\s]+$/, '') : '';
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim(); }
  /* A line already in the script (same words, ignoring marks and case). */
  function isDuplicate(es) {
    var t = norm(es);
    return !!t && load().some(function (l) { return norm(l.es) === t; });
  }
  function dupMsg() { return tr('Esa ya está en tu guion.', 'That one is already in your script.'); }
  function constraint(nodes, opts) {
    var spec = constraintBase(nodes);
    /* The day's script knows the point its lesson teaches: its personal-sentence checklist replaces the node guess. */
    if (opts && opts.constraints && opts.constraints.length) spec = { constraints: opts.constraints.map(function (c) { var o = {}; for (var k in c) o[k] = c[k]; return o; }), text: 'with today\'s point' };
    var cd = (opts && opts.canDo) || (nodes && nodes.forEach ? canDoFor(Array.from(nodes)) : '');
    if (cd) {
      cd = cd.replace(/[.\s]+$/, '');
      spec.prompt = 'Write one true line for your script: ' + cd.charAt(0).toLowerCase() + cd.slice(1) + '.';
      if (spec.constraints[0] && spec.constraints[0].type === 'minWords') { spec.constraints[0].n = 3; spec.text = 'in your own words'; }
    } else spec.prompt = 'Write one true line for your script: say something about you ' + spec.text + '.';
    return spec;
  }
  function constraintBase(nodes) {
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
    constraint: constraint, isDuplicate: isDuplicate, get DUP_MSG() { return dupMsg(); }, cardId: cardId, KEY: KEY };
})();
