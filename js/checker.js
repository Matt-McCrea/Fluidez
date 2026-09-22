/* ============================================================================
 * CHECKER — automated verification of written Spanish.
 *
 * The pedagogical core of Fluidez. Because the engine can conjugate every verb
 * and analyse any surface form back to its verb/tense/person, we can check a
 * learner's free-written sentence against declarative CONSTRAINTS such as
 * "contains the correct nosotros preterite of comer" or "uses any -ir verb in
 * the subjunctive" — and give a live, specific checklist instead of a single
 * right/wrong. A reveal-the-model option covers the naturalness that
 * constraints can't (self-comparison = Swain's "noticing the gap").
 *
 * Constraints are plain-object specs (easy to author in data files):
 *   { type:'verbForm', inf:'comer', tense:'preterito', person:'nosotros' }
 *   { type:'anyVerbInTense', tense:'preterito' }
 *   { type:'person', person:'nosotros' }
 *   { type:'infinitiveUsed', inf:'querer' }
 *   { type:'containsWord', word:'ayer' }
 *   { type:'containsAny', words:['pero','aunque','porque'] }
 *   { type:'minWords', n:6 } | { type:'maxWords', n:20 }
 *   { type:'question' } | { type:'negation' }
 *   { type:'regex', pattern:'\\bque\\b', label:'uses “que”' }
 *
 * B2/C1 content asserts things the list above cannot express, so:
 *   { type:'connectorFrom', class:'contraargumentativo', n:1, minLevel:'C1' }
 *   { type:'avoidsAny', words:['o sea','vale'] }      register: no colloquialisms
 *   { type:'avoidsPerson', person:'tú' }              register: formal address
 *   { type:'subjunctiveAfter', trigger:'para que' }   a trigger governs a mood
 *   { type:'cliticCluster' }                          se lo, me la, dármelo
 *   { type:'sePassive' }                              se construyó, se dice que
 *   { type:'distinctTenses', n:3 }                    narrative range
 *   { type:'minSentences', n:4 }
 * Any spec may add an explicit `label` to override the generated one.
 * ========================================================================== */
window.Checker = (function () {
  var E = window.ENGINE;

  /* Lower-cased but WITH accents kept — the tú-pronoun test needs to tell
   * `tú` from `tu`, which deaccenting destroys. */
  function deacKeep(s) { return String(s || '').toLowerCase(); }

  // Does a subjunctive at `i` have something governing it? `que` or a negation
  // within two tokens to its left is the whole of what makes it an address.
  function subjTriggered(tokens, i) {
    for (var k = Math.max(0, i - 2); k < i; k++) {
      var t = String(tokens[k] || '').toLowerCase();
      if (t === 'que' || t === 'no' || t === 'ni' || t === 'nunca' || t === 'jamás' || t === 'jamas') return true;
    }
    return false;
  }

  /* Every single-word noun the app teaches, plus its regular plural, so a
   * spelling the vocabulary claims as a noun is not counted as a verb form.
   * Built once, lazily — VOCAB is 5,822 rows and this must not cost anything
   * on a keystroke. Accents are dropped on both sides so razón/razones pair up
   * (the plural of an -ón noun loses the tilde). */
  var NOUNS = null;
  function deacLowerWord(s) {
    return String(s || '').toLowerCase().normalize ?
      String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') :
      String(s || '').toLowerCase();
  }
  function knownNoun(word) {
    if (!NOUNS) {
      NOUNS = {};
      (window.VOCAB || []).forEach(function (v) {
        var bare = String(v.es || '').replace(/^(el|la|los|las|un|una)\s+/i, '');
        if (!bare || /\s/.test(bare)) return;          // single words only
        var k = deacLowerWord(bare);
        NOUNS[k] = 1;
        NOUNS[k + 's'] = 1;                            // casa  -> casas
        NOUNS[k + 'es'] = 1;                           // razon -> razones
        if (/s$/.test(k)) NOUNS[k.replace(/e?s$/, '')] = 1;
      });
    }
    var key = deacLowerWord(word);
    return !!(key && Object.prototype.hasOwnProperty.call(NOUNS, key));
  }

  /* Is the token at `i` sitting in a NOUN SLOT — directly after a determiner
   * or a preposition? Spanish does not put a finite verb there: "sin reservas"
   * and "los importes" are noun phrases, and `sin hablas` / `el hablas` are
   * not sentences in any register. So a finite reading of a token in this
   * position can be discarded outright, with no need to guess.
   *
   * This is the rule tools/find-homographs.js already uses to find nouns the
   * analyser reads as verbs; it covers the cases the vocabulary-derived list
   * cannot, because VOCAB holds what the app TEACHES and prose legitimately
   * contains nouns it does not teach. `reservas` in "la recomiendo sin
   * reservas" is exactly that: a real noun, absent from a 5,822-word teaching
   * vocabulary, failing a formal letter for addressing somebody as tú. */
  var NOUN_SLOT_BEFORE = {
    el: 1, la: 1, los: 1, las: 1, un: 1, una: 1, unos: 1, unas: 1, lo: 1,
    mi: 1, mis: 1, su: 1, sus: 1, nuestro: 1, nuestra: 1, nuestros: 1, nuestras: 1,
    vuestro: 1, vuestra: 1, vuestros: 1, vuestras: 1,
    este: 1, esta: 1, estos: 1, estas: 1, ese: 1, esa: 1, esos: 1, esas: 1,
    aquel: 1, aquella: 1, aquellos: 1, aquellas: 1,
    de: 1, del: 1, en: 1, con: 1, sin: 1, por: 1, para: 1, sobre: 1, entre: 1,
    hasta: 1, desde: 1, hacia: 1, ante: 1, tras: 1, segun: 1, al: 1
  };
  function inNounSlot(tokens, i) {
    if (i <= 0) return false;
    var prev = deacLowerWord(tokens[i - 1]);
    return Object.prototype.hasOwnProperty.call(NOUN_SLOT_BEFORE, prev);
  }

  var CONNECTOR_BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  // Is this marker at or above `floor`? An item with no level recorded counts
  // as B1 — the band the inventory starts at — rather than being silently
  // dropped from every levelled check.
  function connectorAtLeast(item, floor) {
    if (!floor) return true;
    var want = CONNECTOR_BANDS.indexOf(floor);
    var got = CONNECTOR_BANDS.indexOf(item.level || 'B1');
    return want === -1 || got >= want;
  }

  function personIndex(tense, person) { return E.personsFor(tense).indexOf(person); }

  // Canonical conjugated form for a verb/tense/person, or null if unavailable.
  function expectedForm(inf, tense, person) {
    var v = E.verbByInf(inf);
    if (!v) return null;
    var i = personIndex(tense, person);
    if (i < 0) return null;
    return E.conjugate(v, tense)[i];
  }

  // Does any recognised verb token carry an analysis matching `pred`?
  function someVerb(analysis, pred) {
    return analysis.verbs.some(function (w) { return w.analyses.some(pred); });
  }

  // Tenses present in the sentence, counting both simple forms and compounds.
  function tensesPresent(analysis) {
    var set = {};
    analysis.verbs.forEach(function (w) { w.analyses.forEach(function (a) { set[a.tense] = 1; }); });
    analysis.compounds.forEach(function (c) { c.parts.forEach(function (p) { set[p.tense] = 1; }); });
    return set;
  }

  function words(text) { return E.tokenize(text); }
  function deacLower(s) { return E.deaccent((s || '').toLowerCase()); }

  // Evaluate one constraint -> { label, pass, detail }
  function evaluate(c, analysis, rawText) {
    var label = c.label || null, pass = false, detail = '';

    switch (c.type) {

      case 'verbForm': {                      // exact form of inf/tense/person
        var want = expectedForm(c.inf, c.tense, c.person);
        label = label || ('use <b>' + (want || '?') + '</b> (' + c.inf + ' · ' +
          E.TENSE_LABEL[c.tense] + ' · ' + c.person + ')');
        if (want) {
          var wantDe = deacLower(want);
          var hit = analysis.tokens.some(function (t) { return t === want.toLowerCase(); });
          var near = analysis.tokens.some(function (t) { return deacLower(t) === wantDe; });
          pass = hit;
          if (!hit && near) detail = 'almost — check the accents on “' + want + '”';
        }
        break;
      }

      case 'verbFormAny': {                   // any person of inf in this tense
        label = label || ('use <b>' + c.inf + '</b> in the ' + E.TENSE_LABEL[c.tense]);
        pass = someVerb(analysis, function (a) { return a.inf === c.inf && a.tense === c.tense; });
        break;
      }

      case 'anyVerbInTense': {                // any verb at all in this tense
        label = label || ('use a verb in the <b>' + E.TENSE_LABEL[c.tense] + '</b>');
        pass = !!tensesPresent(analysis)[c.tense];
        break;
      }

      case 'person': {                        // a verb conjugated for this person
        label = label || ('conjugate a verb for <b>' + c.person + '</b>');
        pass = someVerb(analysis, function (a) { return a.person === c.person; });
        break;
      }

      case 'infinitiveUsed': {                // any form of this verb (incl. inf)
        label = label || ('use the verb <b>' + c.inf + '</b>');
        pass = someVerb(analysis, function (a) { return a.inf === c.inf; }) ||
               analysis.tokens.indexOf(c.inf) !== -1;
        break;
      }

      case 'verbType': {                      // any -ar/-er/-ir verb (by ending)
        label = label || ('use an <b>-' + c.ending + '</b> verb');
        pass = someVerb(analysis, function (a) { return a.type === c.ending; });
        break;
      }

      case 'containsWord': {                  // a word / phrase appears
        label = label || ('include “<b>' + c.word + '</b>”');
        pass = deacLower(rawText).indexOf(deacLower(c.word)) !== -1;
        break;
      }

      case 'containsAny': {                    // any of these appear
        label = label || ('include one of: ' + c.words.map(function (w) { return '“' + w + '”'; }).join(', '));
        pass = c.words.some(function (w) { return deacLower(rawText).indexOf(deacLower(w)) !== -1; });
        break;
      }

      case 'minWords': {
        var n = words(rawText).length;
        label = label || ('at least <b>' + c.n + '</b> words');
        pass = n >= c.n;
        if (!pass) detail = n + ' so far';
        break;
      }

      case 'maxWords': {
        var m = words(rawText).length;
        label = label || ('at most <b>' + c.n + '</b> words');
        pass = m <= c.n;
        break;
      }

      case 'question': {
        label = label || 'write it as a question (¿… ?)';
        pass = /¿/.test(rawText) && /\?/.test(rawText);
        break;
      }

      case 'negation': {
        label = label || 'make it negative (use “no”)';
        pass = analysis.tokens.indexOf('no') !== -1;
        break;
      }

      case 'regex': {
        label = label || ('matches pattern');
        pass = new RegExp(c.pattern, c.flags || 'i').test(rawText);
        break;
      }

      /* ---- B2/C1 constraints ------------------------------------------- */

      case 'connectorFrom': {                  // uses a discourse marker of a class
        /* `minLevel` is what makes this constraint mean something at B2/C1.
         * Without it, "use a contraargumentativo" is satisfied by `pero` —
         * which every learner has had since A2 — so a C1 essay task could
         * assert nothing at all and still pass its own gate. The classes in
         * data/connectors.js are ordered easiest-first and every item carries
         * the level it is first expected at, so the band is already in the
         * data; this only reads it.
         *
         * The class is still the unit, not the individual marker: demanding
         * one exact word teaches the word, whereas demanding one of `ahora
         * bien / con todo / si bien / antes bien` teaches the MOVE and leaves
         * the learner the choice, which is the thing being learnt. */
        var klass = (window.CONNECTORS || []).filter(function (k) { return k.id === c.class; })[0];
        var need = c.n || 1;
        var floor = c.minLevel || null;
        label = label || ('use ' + (need > 1 ? need + ' markers' : 'a marker') +
                          ' of type <b>' + (klass ? klass.label.toLowerCase() : c.class) + '</b>' +
                          (floor ? ' at ' + floor + ' or above' : ''));
        if (!klass) { pass = false; detail = 'unknown connector class'; break; }
        var eligible = klass.items.filter(function (it) { return connectorAtLeast(it, floor); });
        var hay = deacLower(rawText);
        var found = eligible.filter(function (it) { return hay.indexOf(deacLower(it.es)) !== -1; });
        pass = found.length >= need;
        if (found.length) detail = found.map(function (f) { return f.es; }).join(', ');
        else if (floor) {
          /* Say WHICH markers would count. A learner who wrote "pero" and is
           * told only that it does not count has been given a puzzle; the
           * point of the task is the repertoire, so show the repertoire. */
          detail = 'e.g. ' + eligible.slice(0, 4).map(function (f) { return f.es; }).join(', ');
        }
        break;
      }

      case 'avoidsAny': {                      // register: none of these appear
        label = label || ('avoid: ' + c.words.map(function (w) { return '“' + w + '”'; }).join(', '));
        var bad = c.words.filter(function (w) { return deacLower(rawText).indexOf(deacLower(w)) !== -1; });
        pass = bad.length === 0;
        if (!pass) detail = 'found ' + bad.join(', ');
        break;
      }

      case 'avoidsPerson': {                   // register: e.g. no tú in a formal text
        label = label || ('do not address anyone as <b>' + c.person + '</b>');
        /* Three ways a token gets read as "tú" without anybody being addressed
         * as tú, all of which reached real content and failed correct texts.
         *
         * IMPERATIVES. Every regular third-person present is spelled like the
         * tú imperative — habla, vive, trabaja, puede — so counting imperative
         * readings made "Ella habla español" fail a no-tú check. An imperative
         * reading only counts when the token has NO other interpretation: ven,
         * haz, pon and dime are unambiguous, habla is not.
         *
         * BARE PRESENT SUBJUNCTIVES. Addressing somebody in the subjunctive
         * needs a trigger — `que vengas`, `no lo hagas`. Without one, a tú
         * present-subjunctive spelling is not address at all, and in practice
         * it is usually a plural noun: ocasiones, razones, ataques, importes
         * are all read as ocasionar/razonar/atacar/importar. So a subjunctive
         * counts only when `que` or a negation stands within two tokens of it.
         *
         * NOUN HOMOGRAPHS. `las bajas`, `el importe`, `la baja` are nouns the
         * app itself teaches that share a spelling with a tú indicative. The
         * app's own vocabulary is the list — tools/validate-content.js keeps a
         * hand-written NOUN_HOMOGRAPHS for the same problem, and a second hand
         * list would be the one that goes stale. Narrowed so it cannot hide a
         * real address: it applies only where the text uses no tú PRONOUN
         * anywhere. Once somebody has written tú or te, the register is
         * already broken and a homograph is no longer an excuse.
         *
         * NOUN SLOTS. The vocabulary list only knows words the app teaches,
         * and prose contains nouns it does not — `sin reservas` failed a
         * reference letter. A token directly after a determiner or preposition
         * is not a finite verb in Spanish at all, so that reading is dropped
         * outright (see inNounSlot). */
        var addressed = /(^|[^a-záéíóúñü])(tú|te|ti|contigo|tuy[oa]s?)([^a-záéíóúñü]|$)/i.test(deacKeep(rawText));
        var tks2 = analysis.tokens || [];
        pass = !analysis.verbs.some(function (w) {
          return w.analyses.some(function (a) {
            if (a.person !== c.person) return false;
            if (a.tense === 'imperativo') {
              return !w.analyses.some(function (b) { return b.tense !== 'imperativo'; });
            }
            if (/subj$/.test(a.tense) && !subjTriggered(tks2, w.index)) return false;
            if (inNounSlot(tks2, w.index)) return false;
            if (!addressed && knownNoun(w.word || tks2[w.index])) return false;
            return true;
          });
        });
        break;
      }

      case 'subjunctiveAfter': {               // a trigger governs the subjunctive
        label = label || ('use the subjunctive after “<b>' + c.trigger + '</b>”');
        var tks = analysis.tokens || [], trig = words(c.trigger), at = -1;
        for (var ti = 0; ti + trig.length <= tks.length && at < 0; ti++) {
          var hit = true;
          for (var tj = 0; tj < trig.length; tj++) if (deacLower(tks[ti + tj]) !== deacLower(trig[tj])) { hit = false; break; }
          if (hit) at = ti + trig.length - 1;
        }
        if (at < 0) { pass = false; detail = '“' + c.trigger + '” not used yet'; break; }
        var span = c.within || 8;
        pass = analysis.verbs.some(function (w) {
          return w.index > at && w.index <= at + span &&
                 w.analyses.some(function (a) { return /subj$/.test(a.tense); });
        });
        if (!pass) detail = 'no subjunctive follows it';
        break;
      }

      case 'cliticCluster': {                  // two object pronouns together
        label = label || 'use a double object pronoun (se lo, me la, dármelo)';
        pass = /\b(me|te|se|nos|os)\s+(lo|la|los|las|le|les)\b/i.test(rawText) ||
               /\w{2,}(me|te|se|nos|os)(lo|la|los|las)\b/i.test(rawText);
        break;
      }

      case 'sePassive': {                      // se + 3rd person (se dice, se construyó)
        label = label || 'use a “se” construction (se dice, se construyó)';
        var tk = analysis.tokens || [];
        pass = analysis.verbs.some(function (w) {
          var prev = tk[w.index - 1], prev2 = tk[w.index - 2];
          if (prev !== 'se' && prev2 !== 'se') return false;
          return w.analyses.some(function (a) {
            return (a.person === 'él/ella' || a.person === 'ellos') && a.tense !== 'imperativo';
          });
        });
        break;
      }

      case 'distinctTenses': {                 // narrative range
        var present = tensesPresent(analysis), count = Object.keys(present).length;
        label = label || ('use at least <b>' + c.n + '</b> different tenses');
        pass = count >= c.n;
        detail = count + ' so far';
        break;
      }

      case 'minSentences': {
        var sents = (rawText.match(/[^.!?…]*[.!?…]+/g) || []).filter(function (x) { return /\w/.test(x); }).length;
        label = label || ('at least <b>' + c.n + '</b> sentences');
        pass = sents >= c.n;
        if (!pass) detail = sents + ' so far';
        break;
      }

      default:
        label = label || ('unknown constraint: ' + c.type);
        pass = false;
    }

    return { label: label, pass: pass, detail: detail };
  }

  // Check a whole written answer against a task's constraint list.
  //   task.constraints : [spec, …]
  // Returns { results:[{label,pass,detail}], passed, total, allPass }.
  function checkWriting(task, text) {
    var analysis = E.analyzeSentence(text || '');
    var results = (task.constraints || []).map(function (c) { return evaluate(c, analysis, text || ''); });
    var passed = results.filter(function (r) { return r.pass; }).length;
    return {
      results: results,
      passed: passed,
      total: results.length,
      allPass: results.length > 0 && passed === results.length,
      analysis: analysis
    };
  }

  // Strict exact-answer check (accents required; case/space-insensitive) for
  // cloze / transform / sentence-building items. `accepted` is one string or
  // an array of acceptable answers.
  /* A dictionary gloss is not one answer, it is a small set of them.
   * "sex, gender" and "sociable, outgoing" list alternatives, either of which
   * is right. "the friend (m)" and "the doctor (f)" mark the gender of the
   * SPANISH word — the bracket is metadata, not part of the English, so
   * "friend" must pass. "the fish (food)" disambiguates which fish is meant,
   * and again the English word alone is the correct answer.
   *
   * So a gloss expands to: the whole string, each comma/slash-separated part,
   * and each of those with its bracket and its leading article or "to"
   * removed. Only used for meaning items (vocab, idioms, phrases) — never for
   * cloze or sentence answers, where splitting on a comma would accept half a
   * sentence. */
  function meaningAlternatives(gloss) {
    var out = [], seen = {};
    function add(x) {
      var t = String(x).trim();
      if (!t) return;
      var k = E.normalize(t);
      if (k && !seen[k]) { seen[k] = 1; out.push(t); }
    }
    add(gloss);
    String(gloss).split(/[,;\/]| or /).forEach(function (part) {
      add(part);
      var noParens = part.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ');
      add(noParens);
      add(noParens.replace(/^\s*(the|a|an|to)\s+/i, ''));
    });
    return out;
  }

  /* Punctuation is not the thing being tested. E.normalize lowercases and
   * collapses spaces, so capitals were already forgiven — but a trailing full
   * stop was not, and "Ella no tiene hambre." was marked cold-wrong against
   * "ella no tiene hambre". Worse than wrong: it is not even a near miss,
   * because deaccenting does not remove a full stop either, so the learner got
   * no "check the accents" hint — just a flat no for typing a sentence the way
   * sentences are written.
   *
   * Strip the marks that carry no lexical weight here: terminal stops, commas,
   * and the paired ¿¡ ?! of a question or exclamation. Accents are NOT touched
   * — those are part of the word, and getting them wrong is still a near miss
   * worth flagging. The `question` writing constraint is unaffected; it reads
   * the raw text, because there the question mark IS the point. */
  function depunct(s) {
    return E.normalize(s).replace(/[.,;:!?¡¿"“”'’]/g, '').replace(/\s+/g, ' ').trim();
  }

  function checkExact(input, accepted, opts) {
    var norm = E.normalize(input);
    var list = Array.isArray(accepted) ? accepted : [accepted];
    if (opts && opts.meaning) {
      list = list.reduce(function (acc, a) { return acc.concat(meaningAlternatives(a)); }, []);
    }
    /* Other Spanish the course itself glosses the same way (js/phrases.js).
     * "then" is taught as both `entonces` and `luego`; whichever one the card
     * happens to hold, the other is not a mistake. Only the phrase deck passes
     * this — a verb-form drill must still want the one form it asked for. */
    if (opts && opts.also && opts.also.length) list = list.concat(opts.also);
    if (list.some(function (a) { return E.normalize(a) === norm; })) return { pass: true, near: false };
    // same answer, different punctuation → a pass, not a near miss
    var bare = depunct(input);
    if (bare && list.some(function (a) { return depunct(a) === bare; })) return { pass: true, near: false };
    // accent-insensitive near miss → encourage a fix rather than mark cold-wrong
    var near = list.some(function (a) { return E.deaccent(depunct(a)) === E.deaccent(bare); });
    /* `accents: 'lenient'` turns that near miss into a pass, and is set for ONE
     * card kind: the phrase deck. A phrase card is asking whether the chunk
     * comes back whole — whether "no hay de qué" is there at all — and failing
     * it for a missing acute on a phrase the learner otherwise produced
     * correctly punishes the wrong thing and stops the chunk ever graduating.
     * The caller still shows the accented form in the pass message, so the
     * accent is taught rather than merely forgiven.
     *
     * Deliberately NOT global. Accents stay a near miss everywhere else —
     * see depunct() above — because in a verb drill `hablo`/`habló` is the
     * whole question, and tools/lint-spanish.js exists to keep the content
     * itself correct. */
    if (near && opts && opts.accents === 'lenient') return { pass: true, near: true };
    /* Under the same leniency, ñ and ü fold too — "hasta manana" for
     * "hasta mañana". E.deaccent deliberately leaves them alone, and that is
     * right everywhere else: ñ is a letter, not an accent, and año/ano is the
     * reason to keep it that way. But an English keyboard has no ñ, the accent
     * bar is a deliberate detour, and refusing the chunk over it fails the
     * learner for their hardware rather than their Spanish. Folded only here,
     * and only for the phrase deck. */
    if (opts && opts.accents === 'lenient') {
      var fold = function (s) { return E.deaccent(depunct(s)).replace(/ñ/g, 'n').replace(/ü/g, 'u'); };
      if (bare && list.some(function (a) { return fold(a) === fold(input); })) return { pass: true, near: true };
    }
    return { pass: false, near: near };
  }

  return { checkWriting: checkWriting, checkExact: checkExact, meaningAlternatives: meaningAlternatives, evaluate: evaluate, expectedForm: expectedForm };
})();
