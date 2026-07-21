/* ============================================================================
 * STAGE 4 — APLICAR (Apply).
 * Grammar in context: cloze sentences where the correct conjugation must be
 * chosen from the *meaning* of the sentence (time markers, subject, mood
 * triggers) — the bridge between drills and real use. Cloze answers are
 * computed by the engine, so they are always consistent with the tables.
 * Transforms rewrite a sentence per an instruction (tense/person/negation).
 * ========================================================================== */
window.StageApply = (function () {
  var UI = window.UI, E = window.ENGINE, C = window.Checker, S = window.SRS;

  function clozeAnswer(item) {
    var v = E.verbByInf(item.inf);
    var idx = E.personsFor(item.tense).indexOf(item.person);
    return v && idx >= 0 ? E.conjugate(v, item.tense)[idx] : null;
  }

  // Conjugation-in-context, scheduled per (lemma, tense) — see js/srs.js.
  function tenseId(it) { return 'vt:' + it.inf + ':' + it.tense; }
  function gradeTense(it, good) { if (it.type === 'cloze' && S) { S.enrol(tenseId(it)); S.grade(tenseId(it), good); } }

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
  function clozeDistractors(it, answer) {
    var v = E.verbByInf(it.inf); if (!v) return [];
    var set = {};
    E.conjugate(v, it.tense).forEach(function (f) { if (f !== answer) set[f] = 1; });
    ['presente', 'preterito', 'imperfecto', 'futuro', 'presubj'].forEach(function (tk) {
      if (tk === it.tense) return;
      var idx = E.personsFor(tk).indexOf(it.person);
      if (idx < 0) return;
      try { var f = E.conjugate(v, tk)[idx]; if (f && f !== answer && f.indexOf(' ') === -1) set[f] = 1; } catch (e) {}
    });
    return E.shuffle(Object.keys(set)).slice(0, 3);
  }

  function run(host, ctx, done) {
    var items = ctx.applyItems || [];
    if (!items.length) { done(); return; }
    var i = 0, correct = 0, total = items.length;

    var wrap = UI.el('div', 'panel');
    var progress = UI.el('div', 'muted review-stats');
    var body = UI.el('div');
    wrap.appendChild(progress); wrap.appendChild(body);
    host.appendChild(wrap);

    function nextAfter(good) { if (good) correct++; i++; show(); }

    // word-bank chooser for a cloze (beginner)
    function showWordbank(it, answer) {
      body.appendChild(UI.el('p', 'muted small', 'Tap the correct form of <b>' + it.inf + '</b>.'));
      var opts = E.shuffle([answer].concat(clozeDistractors(it, answer)));
      var fb = UI.el('div', 'feedback');
      var bank = UI.el('div', 'word-bank');
      var answered = false;
      opts.forEach(function (opt) {
        var b = UI.el('button', 'word-chip', opt); b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          var right = opt === answer;
          b.classList.add(right ? 'right' : 'wrong');
          gradeTense(it, right);
          if (!right) {
            Array.prototype.forEach.call(bank.children, function (c) { if (c.textContent === answer) c.classList.add('right'); });
            if (window.ErrorLog) window.ErrorLog.record({ id: 'err:cloze:' + E.normalize(it.text), front: it.text.replace('___', '＿＿＿') + '   [' + it.inf + ']', back: answer, kind: 'error', source: 'apply-cloze', reviewable: true });
          }
          fb.innerHTML = right ? '¡Correcto! <span class="muted">' + (it.en || '') + '</span>'
            : '<b>' + answer + '</b> — ' + it.inf + ' · ' + E.TENSE_LABEL[it.tense] + ' · ' + it.person;
          fb.className = 'feedback ' + (right ? 'good' : 'bad');
          setTimeout(function () { nextAfter(right); }, right ? 850 : 1500);
        });
        bank.appendChild(b);
      });
      body.appendChild(bank); body.appendChild(fb);
    }

    function finish() {
      ctx.results.apply = { correct: correct, total: total };
      UI.clear(body);
      body.appendChild(UI.el('h2', null, 'Aplicar: ' + correct + ' / ' + total));
      body.appendChild(UI.el('p', 'muted', 'Choosing the form from the sentence — not from a label — is what makes conjugation stick.'));
      body.appendChild(UI.nextBtn('Continuar →', done));
    }

    function show() {
      if (i >= items.length) { finish(); return; }
      var it = items[i];
      progress.textContent = 'Frase ' + (i + 1) + ' / ' + items.length;
      UI.clear(body);

      var answer, prompt, hintNote;
      if (it.type === 'cloze') {
        answer = clozeAnswer(it);
        prompt = it.text.replace('___', '<span class="blank">＿＿＿</span>');
        hintNote = 'Fill the blank with the right form of the verb in brackets.';
      } else {                                     // transform
        answer = it.to;
        prompt = '<span class="muted">' + it.instruction + '</span><br>' + it.from;
        hintNote = 'Type the full rewritten sentence.';
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
      var reveal = UI.el('button', 'ghost-btn', 'Reveal'); reveal.type = 'button';
      var revealed = false, locked = false;
      body.appendChild(input);
      body.appendChild(UI.accentBar(function () { return input; }));
      body.appendChild(fb);
      body.appendChild(reveal);
      input.focus();

      function explain() {
        var bits = [];
        if (it.type === 'cloze') bits.push('<b>' + answer + '</b> — ' + it.inf + ' · ' + E.TENSE_LABEL[it.tense] + ' · ' + it.person);
        else bits.push('<b>' + answer + '</b>');
        if (it.en) bits.push('<span class="muted">' + it.en + '</span>');
        return bits.join('<br>');
      }
      function next(good) {
        if (good) correct++;
        i++; show();
      }

      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || locked) return;
        e.preventDefault();
        if (revealed) { next(false); return; }
        var r = C.checkExact(input.value, answer);
        if (r.pass) {
          locked = true;
          gradeTense(it, true);
          fb.innerHTML = '¡Correcto!<br>' + explain();
          fb.className = 'feedback good';
          setTimeout(function () { locked = false; next(true); }, 900);
        } else {
          fb.textContent = r.near ? 'Nearly — check the accents' : 'Not quite — look at the time words and the subject';
          fb.className = 'feedback bad';
        }
      });
      reveal.addEventListener('click', function () {
        if (locked) return;
        if (revealed) { next(false); return; }
        revealed = true;
        gradeTense(it, false);
        fb.innerHTML = explain();
        fb.className = 'feedback reveal';
        reveal.textContent = 'Next →';
        logMiss(it, answer);
      });
    }
    show();
  }

  return { key: 'apply', label: 'Aplicar', icon: '🧩', run: run };
})();
