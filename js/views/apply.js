/* ============================================================================
 * STAGE 4 — APLICAR (Apply).
 * Grammar in context: cloze sentences where the correct conjugation must be
 * chosen from the *meaning* of the sentence (time markers, subject, mood
 * triggers) — the bridge between drills and real use. Cloze answers are
 * computed by the engine, so they are always consistent with the tables.
 * Transforms rewrite a sentence per an instruction (tense/person/negation).
 * Choices pick between two real candidates — ser/estar, por/para, lo/le —
 * which is the one thing this stage could not ask before.
 * ========================================================================== */
window.StageApply = (function () {
  var UI = window.UI, E = window.ENGINE, C = window.Checker, S = window.SRS;

  function clozeAnswer(item) {
    var v = E.verbByInf(item.inf);
    var idx = E.personsFor(item.tense).indexOf(item.person);
    return v && idx >= 0 ? E.conjugate(v, item.tense)[idx] : null;
  }


  /* ---- feedback: the pure parts (no DOM; tools/test-apply-feedback.js drives them) ----
   * Evidence rule: a matched error gets a one-line hint and one retry before the
   * answer is shown; the answer and the reason follow; an unmatched error gets a
   * character diff. The item returns once, at least 3 items later. */
  var UNNAMED = { 'wrong-word': 1, differs: 1, empty: 1, fragment: 1 };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function plain(s) { return String(s || '').replace(/ñ/g, '\u0001').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\u0001/g, 'ñ').toLowerCase(); }
  function libMatch(lib) { return lib || (window.LIB && window.LIB.match) || null; }

  // The sentence an item's blank sits in, with `form` put into the blank.
  function sentenceOf(it, form) {
    if (it.type === 'transform') return String(form || '');
    var t = String(it.text || '').replace(/\s*«[^»]*»\s*$/, '');
    if (t.indexOf('___') === -1) return String(form || '');
    return t.replace(/___\s*\([^)]*\)/, form).replace('___', form);
  }
  function tokensOf(m, s) { return m.canon(s).toks.map(function (x) { return x.t; }); }

  /* What the trap rules make of a wrong text: { matched, hint, kind } or null
   * when nothing can be said. A lesson pitfall wins; then the plain diagnosis
   * (verb ending, ser or estar, por or para, article, ...). Location-only
   * answers (wrong-word, differs, ...) are not "matched": they get the diff. */
  function hintFor(it, typed, answer, lib) {
    var m = libMatch(lib);
    if (!m || !String(typed || '').trim()) return null;
    try {
      var nodes = it.nodes || it.t; if (typeof nodes === 'string') nodes = [nodes];
      var en = it.en || ((/«([^»]*)»\s*$/.exec(String(it.text || ''))) || [])[1] || '';
      var ta = tokensOf(m, sentenceOf(it, typed)), tb = tokensOf(m, sentenceOf(it, answer));
      if (ta.join(' ') === tb.join(' ')) return null;
      var d = m.diagnose(ta, tb), tr;
      if (it.bankKind === 'gap' && m.gapTrap) {
        var pre = String(it.text || '').split('___')[0];
        var before = pre.toLowerCase().split(/[^a-záéíóúüñ]+/).filter(Boolean);
        tr = m.gapTrap(d, { before: before, en: en, answer: String(answer) });
      } else if (m.trapDiagnose) {
        tr = m.trapDiagnose({ a: ta, b: tb, input: String(typed), en: en, dg: d, nodes: nodes });
      }
      if (tr) return { matched: tr.tier === 'assert' || tr.tier === 'ask' || !UNNAMED[tr.kind], hint: tr.hint, kind: tr.kind, tier: tr.tier, rule: tr.rule };
      if (m.pitfallFor && nodes) {
        var pf = m.pitfallFor(nodes, typed);
        if (pf && pf.why) return { matched: true, hint: pf.why, kind: 'pitfall' };
      }
      return { matched: !UNNAMED[d.kind], hint: d.hint, kind: d.kind };
    } catch (e) { return null; }
  }

  // An accent slip: only accents differ, and what was typed is not itself another word.
  function isAccentSlip(typed, answer, isWord) {
    var a = String(typed || '').trim().toLowerCase().split(/\s+/), b = String(answer || '').trim().toLowerCase().split(/\s+/);
    if (a.length !== b.length) return false;
    var slipped = false;
    for (var k = 0; k < a.length; k++) {
      if (a[k] === b[k]) continue;
      if (plain(a[k]) !== plain(b[k])) return false;
      if (isWord && isWord(a[k])) return false;
      slipped = true;
    }
    return slipped;
  }
  function realWord(w) {
    try { return window.ENGINE.analyzeToken(w).some(function (x) { return x.accentExact; }); } catch (e) { return false; }
  }

  // Character diff of what the learner wrote against the expected text, as HTML.
  function diffOps(mine, want) {
    var n = mine.length, m = want.length, L = [], i, j;
    for (i = 0; i <= n; i++) { L.push([]); for (j = 0; j <= m; j++) L[i].push(0); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--)
      L[i][j] = mine.charAt(i) === want.charAt(j) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var ops = [];
    function push(op, c) { var last = ops[ops.length - 1]; if (last && last.op === op) last.s += c; else ops.push({ op: op, s: c }); }
    i = 0; j = 0;
    while (i < n && j < m) {
      if (mine.charAt(i) === want.charAt(j)) { push('eq', mine.charAt(i)); i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) { push('del', mine.charAt(i)); i++; }
      else { push('ins', want.charAt(j)); j++; }
    }
    while (i < n) { push('del', mine.charAt(i++)); }
    while (j < m) { push('ins', want.charAt(j++)); }
    return ops;
  }
  function diffHtml(mine, want) {
    return diffOps(mine, want).map(function (o) {
      return o.op === 'eq' ? esc(o.s) : o.op === 'del' ? '<del class="diff-del">' + esc(o.s) + '</del>' : '<ins class="diff-ins">' + esc(o.s) + '</ins>';
    }).join('');
  }

  // outcome: 'first' (right first time), 'hint' (right after the hint), 'miss' (wrong twice, or shown).
  function gradeFor(outcome) {
    if (outcome === 'first') return { ok: true, meta: {} };
    if (outcome === 'hint') return { ok: true, meta: { usedHint: true } };
    return { ok: false, meta: {} };
  }
  // A missed item goes back once, 3 items after the one on screen (or to the end).
  function requeue(queue, at, it) {
    if (it._again) return false;
    var copy = {}; for (var k in it) if (Object.prototype.hasOwnProperty.call(it, k)) copy[k] = it[k];
    copy._again = true;
    queue.splice(Math.min(at + 4, queue.length), 0, copy);
    return true;
  }
  /* Pure parts are tested without a Profile, so they fall back to English there. */
  function T(es, en) { return (window.Profile && window.Profile.term) ? UI.t(es, en) : en; }
  /* The library's hints are English; from B1 they sit under a Spanish label. */
  function hintLine(h) { return (UI.t('y', 'n') === 'y' ? '<b>Pista:</b> ' : '') + esc(h); }
  // The prompt line for a choice: bank kinds ask their own question.
  function choicePrompt(it) {
    var m = /^(“[^”]*”)\s+(\S[\s\S]*)$/.exec(String(it.text || ''));
    if (it.bankKind === 'read') return { text: m ? m[1] : it.text, q: m ? m[2] : T('¿Cuál encaja?', 'Which one fits?') };
    if (it.bankKind === 'match') return { text: m ? m[1] : it.text, q: T('¿Cuál frase dice esto?', 'Which sentence says this?') };
    if (it.bankKind === 'gap') return { text: it.text, q: T('¿Qué palabra va en el espacio?', 'Which word goes in the gap?') };
    return { text: it.text, q: T('¿Cuál necesita esta frase?', 'Which one does this sentence need?') };
  }
  // Why a chosen option was wrong: the item's own reason, else a matched rule, else one neutral line.
  function whyWrong(it, chosen, answer, lib) {
    if (it.why) return it.why;
    if (it.bankKind !== 'read' && it.bankKind !== 'match') {
      var h = hintFor(it, chosen, answer, lib);
      if (h && h.matched) return h.hint;
    }
    return T('Esa no. La frase necesita ' + answer + '.', 'Not this one. The sentence needs ' + answer + '.');
  }

  // Conjugation-in-context, scheduled per (lemma, tense) — see js/srs.js.
  function tenseId(it) { return 'vt:' + it.inf + ':' + it.tense; }
  function gradeTense(it, good, meta) { if (it.type === 'cloze' && S) { S.enrol(tenseId(it)); S.grade(tenseId(it), good, meta || {}); } }

  // Log a revealed item into the error log so it resurfaces in review.
  function logMiss(it, answer) {
    if (!window.ErrorLog) return;
    if (it.type === 'cloze') {
      window.ErrorLog.record({
        id: 'err:cloze:' + E.normalize(it.text),
        front: it.text.replace('___', '＿＿＿') + '   [' + it.inf + ']',
        back: answer, kind: 'error', source: 'apply-cloze', reviewable: true
      });
    } else {
      window.ErrorLog.record({
        id: 'err:xform:' + E.normalize(it.from),
        front: it.instruction + '  ' + it.from,
        back: it.to, kind: 'error', source: 'apply-transform', reviewable: true
      });
    }
  }

  // Plausible wrong forms for a cloze: the same verb in other persons of the
  // same tense, and the same person in neighbouring tenses (the engine makes
  // them, so distractors are always real conjugations).
  function clozeDistractors(it, answer, taught) {
    var v = E.verbByInf(it.inf); if (!v) return [];
    var set = {};
    var pers0 = E.personsFor(it.tense);
    E.conjugate(v, it.tense).forEach(function (f, i) { if (f !== answer && pers0[i] !== 'vosotros') set[f] = 1; });
    taught = taught || ['presente', 'preterito', 'imperfecto', 'futuro', 'presubj'];
    taught.forEach(function (tk) {
      if (tk === it.tense) return;
      var idx = E.personsFor(tk).indexOf(it.person);
      if (idx < 0 || it.person === 'vosotros') return;
      try { var f = E.conjugate(v, tk)[idx]; if (f && f !== answer && f.indexOf(' ') === -1) set[f] = 1; } catch (e) {}
    });
    return E.shuffle(Object.keys(set)).slice(0, 3);
  }

  /* Tenses the learner has met by this day (plus today's nodes); presente is
   * always allowed. null when the graph is not loaded, which keeps the old set. */
  function taughtTenseList(ctx) {
    var Kn = window.Known, LS = window.LIB && window.LIB.search;
    if (!Kn || !LS || !LS.taughtTenses || ctx.di == null) return null;
    try {
      var ids = Array.from(Kn.taughtBy(ctx.di));
      if (ctx.nodes) ctx.nodes.forEach(function (n) { ids.push(n); });
      var t = LS.taughtTenses(ids);
      if (t.indexOf('presente') < 0) t.push('presente');
      return t.filter(function (k) { return ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'presubj', 'perfecto'].indexOf(k) >= 0; });
    } catch (e) { return null; }
  }

  function run(host, ctx, done) {
    var taughtT = taughtTenseList(ctx);
    var items = ctx.applyItems || [];
    if (!items.length) { done(); return; }
    var queue = items.slice();                     // missed items are pushed back into this, once
    var st = ctx.step || null, ex = (st && st.extra) || {};
    var i = Math.min((st && st.at) || 0, items.length), correct = ex.correct || 0, total = items.length;

    var wrap = UI.el('div', 'panel');
    var progress = UI.el('div', 'muted review-stats');
    var body = UI.el('div');
    wrap.appendChild(progress); wrap.appendChild(body);
    host.appendChild(wrap);

    function advance() { i++; show(); }
    // Score and schedule an item once, when it is settled. A repeat is practice only.
    function settle(it, outcome, record) {
      var g = gradeFor(outcome);
      if (it._again) return g;
      if (g.ok) correct++;
      else {
        if (record) record();
        requeue(queue, i, it);
      }
      return g;
    }

    // word-bank chooser for a cloze (beginner)
    function showWordbank(it, answer) {
      body.appendChild(UI.el('p', 'muted small', UI.t('Toca la forma correcta de <b>' + it.inf + '</b>. ¿Qué forma va aquí?', 'Tap the correct form of <b>' + it.inf + '</b>. Which form goes here?')));
      var opts = E.shuffle([answer].concat(clozeDistractors(it, answer, taughtT)));
      var fb = UI.el('div', 'feedback');
      var bank = UI.el('div', 'word-bank');
      var answered = false;
      opts.forEach(function (opt) {
        var b = UI.el('button', 'word-chip', opt); b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          var right = opt === answer;
          b.classList.add(right ? 'right' : 'wrong');
          var g = settle(it, right ? 'first' : 'miss', function () {
            if (window.ErrorLog) window.ErrorLog.record({ id: 'err:cloze:' + E.normalize(it.text), front: it.text.replace('___', '＿＿＿') + '   [' + it.inf + ']', back: answer, kind: 'error', source: 'apply-cloze', topic: it.tense ? 'tense:' + it.tense : null, reviewable: true });
          });
          if (!it._again) gradeTense(it, g.ok, g.meta);
          if (!right) Array.prototype.forEach.call(bank.children, function (c) { if (c.textContent === answer) c.classList.add('right'); });
          fb.innerHTML = right ? '¡Correcto! <span class="muted">' + esc(it.en || '') + '</span>'
            : '<b>' + esc(answer) + '</b> · ' + it.inf + ' · ' + E.TENSE_LABEL[it.tense] + (it.personKnown === false ? '' : ' · ' + it.person)
              + '<br><span class="muted">' + esc(whyWrong(it, opt, answer)) + '</span>';
          fb.className = 'feedback ' + (right ? 'good' : 'bad');
          if (right) setTimeout(advance, 850);
          else fb.appendChild(UI.nextBtn('Continuar →', advance));
        });
        bank.appendChild(b);
      });
      body.appendChild(bank); body.appendChild(fb);
    }

    function finish() {
      ctx.results.apply = { correct: correct, total: total };
      UI.clear(body);
      body.appendChild(UI.el('h2', null, UI.t('Aplicar', 'Apply') + ': ' + correct + ' / ' + total));
      body.appendChild(UI.el('p', 'muted', correct === total
        ? UI.t('Todas salieron de leer la frase, no de una tabla.', 'Every one of those came from reading the sentence, not a table.')
        : UI.t('La frase trae la respuesta: las palabras de tiempo, el sujeto, el modo.', 'The sentence carries the answer: the time words, the subject, the mood.')));
      body.appendChild(UI.nextBtn('Continuar →', done));
    }

    /* A CHOICE item: the blank has two or three real candidates and the
     * sentence decides which. This is the only apply shape that is not about
     * verb morphology, and it exists because everything an English speaker
     * most reliably gets wrong — ser/estar, por/para, lo/le, un/el,
     * preposition choice, agreement — could not be drilled at all. All 674
     * items were verb cloze or verb transform, so for those contrasts the
     * whole pipeline was: explain it, read it, skip Aplicar, write freely
     * around it (CURRICULUM_AUDIT.md §1.3).
     *
     * Scheduled per CONTRAST, not per sentence: `ac:ser-estar` comes back on
     * the SRS clock however many ser/estar items exist, the same contract
     * js/views/review.js already runs for verb+tense pairs (`vt:`). */
    function choiceId(it) { return 'ac:' + (it.focus || E.normalize(it.text)); }
    function showChoice(it) {
      var pr = choicePrompt(it);
      body.appendChild(UI.el('div', 'cloze-text', String(pr.text).replace('___', '<span class="blank">＿＿＿</span>')));
      body.appendChild(UI.el('p', 'muted small', pr.q
        + (it.options.some(UI.isNothing) ? UI.t(' ("(nada)" significa que aquí no va nada.)', ' ("(nothing)" means nothing goes here.)') : '')));
      var fb = UI.el('div', 'feedback');
      var row = UI.el('div', 'mcq-opts');
      var locked = false;
      it.options.forEach(function (opt, oi) {
        var b = UI.el('button', 'ghost-btn', UI.optLabel(opt)); b.type = 'button';
        b.addEventListener('click', function () {
          if (locked) return; locked = true;
          var good = oi === it.answer;
          var g = settle(it, good ? 'first' : 'miss', function () {
            if (!window.ErrorLog) return;
            window.ErrorLog.record({
              id: 'err:choice:' + E.normalize(it.text),
              front: it.text.replace('___', '＿＿＿'), back: it.options[it.answer],
              hint: it.why || null, kind: 'error', source: 'apply-choice',
              /* `focus` IS a lesson id, so this lands on the same key the
               * optional deep units already declare in their `triggers`
               * (data/course.js) and js/suggest.js already aggregates on.
               * Without it, missing ser/estar six times could never surface
               * "Ser and estar, properly" — whose trigger is literally
               * `lesson:ser-estar`. `source` says which stage produced the
               * miss, which is no use for noticing a pattern. */
              topic: 'lesson:' + it.focus, reviewable: true
            });
          });
          if (!it._again && S) { S.enrol(choiceId(it)); S.grade(choiceId(it), g.ok, g.meta); }
          b.classList.add(good ? 'right' : 'wrong');
          fb.className = 'feedback ' + (good ? 'good' : 'bad');
          var right = UI.optLabel(it.options[it.answer]);
          fb.innerHTML = '<b>' + esc(right) + '</b>'
            + (UI.isNothing(it.options[it.answer]) ? ' <span class="muted">' + UI.NOTHING_NOTE + '</span>' : '')
            + (good ? (it.why ? '<br>' + it.why : '') : '<br>' + (it.why ? it.why : esc(whyWrong(it, UI.optLabel(opt), right))))
            + (it.en ? '<br><span class="muted">' + esc(it.en) + '</span>' : '');
          body.appendChild(UI.nextBtn('Continuar →', advance));
        });
        row.appendChild(b);
      });
      body.appendChild(row);
      body.appendChild(fb);
    }

    function show() {
      // the place survives a reload: count the distinct items passed, not the repeats
      if (st) st.save(queue.slice(0, i).filter(function (x) { return !x._again; }).length, { correct: correct });
      if (i >= queue.length) { finish(); return; }
      var it = queue[i];
      progress.textContent = 'Frase ' + (i + 1) + ' / ' + queue.length;
      UI.clear(body);

      if (it.type === 'choice') { showChoice(it); return; }

      var answer, prompt, hintNote;
      if (it.type === 'cloze') {
        answer = clozeAnswer(it);
        prompt = it.text.replace('___', '<span class="blank">＿＿＿</span>');
        hintNote = it.bankKind === 'cloze' ? UI.t('¿Qué forma va aquí? Escribe la forma correcta del verbo entre paréntesis.', 'Which form goes here? Type the right form of the verb in brackets.') : UI.t('Llena el espacio con la forma correcta del verbo entre paréntesis.', 'Fill the blank with the right form of the verb in brackets.');
      } else {                                     // transform
        answer = it.to;
        prompt = '<span class="muted">' + it.instruction + '</span><br>' + it.from;
        hintNote = UI.t('Escribe la frase completa, reescrita.', 'Type the full rewritten sentence.');
      }

      body.appendChild(UI.el('div', 'cloze-text', prompt));

      // Beginner profile: pick the form from a word bank instead of typing it.
      if (window.Profile && window.Profile.params().applyMode === 'wordbank' && it.type === 'cloze') {
        showWordbank(it, answer); return;
      }

      body.appendChild(UI.el('p', 'muted small', hintNote));
      var input = UI.el('input', 'answer-input wide');
      input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
      var fb = UI.el('div', 'feedback');
      var reveal = UI.el('button', 'ghost-btn', UI.t('Mostrar', 'Reveal')); reveal.type = 'button';
      var attempts = 0, hinted = false, firstHint = null, settled = false, wrongDone = false;
      body.appendChild(input);
      body.appendChild(UI.accentBar(function () { return input; }));
      body.appendChild(fb);
      body.appendChild(reveal);
      input.focus();

      function explain() {
        var bits = [];
        if (it.type === 'cloze') bits.push('<b>' + esc(answer) + '</b> · ' + it.inf + ' · ' + E.TENSE_LABEL[it.tense] + (it.personKnown === false ? '' : ' · ' + it.person));
        else bits.push('<b>' + esc(answer) + '</b>');
        if (it.en) bits.push('<span class="muted">' + esc(it.en) + '</span>');
        return bits.join('<br>');
      }
      function logMissNow() { logMiss(it, answer); }
      // right: first time, or after the hint; an accent slip is right with a note
      function passed(slip) {
        settled = true;
        var g = settle(it, hinted ? 'hint' : 'first');
        if (!it._again) gradeTense(it, true, g.meta);
        fb.innerHTML = '¡Correcto!' + (slip ? '<br>' + UI.t('Bien. Ojo con la tilde: ', 'Right. Mind the accent: ') + '<b>' + esc(answer) + '</b>' : '') + '<br>' + explain();
        fb.className = 'feedback good';
        setTimeout(advance, slip ? 1600 : 900);
      }
      // wrong twice, no named cause, or shown: the answer, the reason, and the way on
      function failed(typed, h) {
        settled = true; wrongDone = true;
        settle(it, 'miss', logMissNow);
        if (!it._again) gradeTense(it, false, {});
        var why = firstHint || (h && h.matched ? h : null);
        var reason = why ? '<br>' + hintLine(why.hint)
          : (typed ? '<br><span class="diff-line">' + diffHtml(typed, answer) + '</span><br><span class="muted small">' + UI.t('Lo tachado sobra, lo subrayado falta.', 'Struck is yours to remove, underlined is missing.') + '</span>' : '');
        fb.innerHTML = explain() + reason;
        fb.className = 'feedback reveal';
        reveal.style.display = 'none';
        body.appendChild(UI.nextBtn('Continuar →', advance));
      }

      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || settled && !wrongDone) return;
        e.preventDefault();
        if (wrongDone) { advance(); return; }
        var typed = input.value.trim();
        if (!typed) return;
        var r = C.checkExact(typed, answer);
        if (r.pass) { passed(false); return; }
        if (r.near && isAccentSlip(typed, answer, realWord)) { passed(true); return; }
        var h = hintFor(it, typed, answer);
        if (attempts === 0 && h && h.matched) {
          attempts = 1; hinted = true; firstHint = h;
          fb.innerHTML = hintLine(h.hint) + '<br><span class="muted">' + UI.t('Inténtalo otra vez.', 'Try once more.') + '</span>';
          fb.className = 'feedback bad';
          input.select();
          return;
        }
        failed(typed, h);
      });
      reveal.addEventListener('click', function () {
        if (settled) return;
        failed('', null);
      });
    }
    show();
  }

  return { key: 'apply', label: 'Aplicar', icon: '🧩', run: run,
    fb: { hintFor: hintFor, isAccentSlip: isAccentSlip, diffOps: diffOps, diffHtml: diffHtml, gradeFor: gradeFor, requeue: requeue, choicePrompt: choicePrompt, whyWrong: whyWrong, sentenceOf: sentenceOf } };
})();
