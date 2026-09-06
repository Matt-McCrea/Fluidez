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
 *   { type:'connectorFrom', class:'contraargumentativo', n:1 }
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
        var klass = (window.CONNECTORS || []).filter(function (k) { return k.id === c.class; })[0];
        var need = c.n || 1;
        label = label || ('use ' + (need > 1 ? need + ' markers' : 'a marker') +
                          ' of type <b>' + (klass ? klass.label.toLowerCase() : c.class) + '</b>');
        if (!klass) { pass = false; detail = 'unknown connector class'; break; }
        var hay = deacLower(rawText);
        var found = klass.items.filter(function (it) { return hay.indexOf(deacLower(it.es)) !== -1; });
        pass = found.length >= need;
        detail = found.length ? found.map(function (f) { return f.es; }).join(', ') : '';
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
        /* Every regular third-person present is spelled like the tú imperative
         * — habla, vive, trabaja, puede — so counting imperative readings made
         * "Ella habla español" fail a no-tú check. An imperative reading only
         * counts when the token has NO other interpretation: ven, haz, pon and
         * dime are unambiguous, habla is not. */
        pass = !analysis.verbs.some(function (w) {
          return w.analyses.some(function (a) {
            if (a.person !== c.person) return false;
            if (a.tense !== 'imperativo') return true;
            return !w.analyses.some(function (b) { return b.tense !== 'imperativo'; });
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
  function checkExact(input, accepted) {
    var norm = E.normalize(input);
    var list = Array.isArray(accepted) ? accepted : [accepted];
    if (list.some(function (a) { return E.normalize(a) === norm; })) return { pass: true, near: false };
    // accent-insensitive near miss → encourage a fix rather than mark cold-wrong
    var near = list.some(function (a) { return E.deaccent(E.normalize(a)) === E.deaccent(norm); });
    return { pass: false, near: near };
  }

  return { checkWriting: checkWriting, checkExact: checkExact, evaluate: evaluate, expectedForm: expectedForm };
})();
