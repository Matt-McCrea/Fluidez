/* ============================================================================
 * STAGE 3 — COMPRENDER (Comprehend).
 * Read today's passage (with a small gloss as a crutch), then answer questions.
 * MCQ and short answers are auto-checked; a translate question is self-checked
 * against a model — comparing your version to a correct one is exactly the
 * "noticing the gap" mechanism that drives acquisition.
 * ========================================================================== */
window.StageComprehend = (function () {
  var UI = window.UI, C = window.Checker;

  function run(host, ctx, done) {
    var p = ctx.passage;
    if (!p) { done(); return; }

    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, p.title));
    wrap.appendChild(UI.el('p', 'muted', 'Read it through twice — once for the gist, once for detail. Then answer below.'));
    wrap.appendChild(UI.el('div', 'passage', p.text));

    if (p.gloss && p.gloss.length) {
      var g = UI.el('div', 'gloss');
      p.gloss.forEach(function (w) {
        g.appendChild(UI.el('span', 'gloss-item', '<b>' + w.es + '</b> ' + w.en));
      });
      wrap.appendChild(g);
    }

    wrap.appendChild(UI.nextBtn('Preguntas →', function () { questions(host, ctx, done); }));
    host.appendChild(wrap);
  }

  function questions(host, ctx, done) {
    var p = ctx.passage;
    var qs = p.questions || [];
    var i = 0, correct = 0, total = 0;

    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var progress = UI.el('div', 'muted review-stats');
    var body = UI.el('div');
    wrap.appendChild(progress);
    wrap.appendChild(body);
    host.appendChild(wrap);

    function finish() {
      ctx.results.comprehend = { correct: correct, total: total };
      UI.clear(body);
      body.appendChild(UI.el('h2', null, 'Comprensión: ' + correct + ' / ' + total));
      body.appendChild(UI.el('p', 'muted', correct === total ? '¡Perfecto!' : 'Re-read the passage any time — it stays in the rotation.'));
      body.appendChild(UI.nextBtn('Continuar →', done));
    }

    function show() {
      if (i >= qs.length) { finish(); return; }
      var q = qs[i];
      progress.textContent = 'Pregunta ' + (i + 1) + ' / ' + qs.length;
      UI.clear(body);

      // keep the passage available (collapsed) so it's comprehension, not memory
      var det = UI.el('details', 'passage-peek');
      det.appendChild(UI.el('summary', null, 'Ver el texto'));
      det.appendChild(UI.el('div', 'passage small', p.text));
      body.appendChild(det);

      if (q.type === 'mcq') {
        total++;
        body.appendChild(UI.el('h2', 'q-text', q.q));
        var opts = UI.el('div', 'mcq-opts');
        var answered = false;
        q.options.forEach(function (opt, oi) {
          var b = UI.el('button', 'mcq-btn', opt); b.type = 'button';
          b.addEventListener('click', function () {
            if (answered) return; answered = true;
            var right = oi === q.answer;
            if (right) correct++;
            // comprehension answers are context-dependent — not logged as errors
            b.classList.add(right ? 'right' : 'wrong');
            if (!right) opts.children[q.answer].classList.add('right');
            setTimeout(function () { i++; show(); }, right ? 500 : 1400);
          });
          opts.appendChild(b);
        });
        body.appendChild(opts);

      } else if (q.type === 'short') {
        total++;
        body.appendChild(UI.el('h2', 'q-text', q.q));
        var input = UI.el('input', 'answer-input');
        input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
        var fb = UI.el('div', 'feedback');
        var reveal = UI.el('button', 'ghost-btn', 'Reveal'); reveal.type = 'button';
        var revealed = false;
        body.appendChild(input);
        body.appendChild(UI.accentBar(function () { return input; }));
        body.appendChild(fb);
        body.appendChild(reveal);
        input.focus();
        input.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          if (revealed) { i++; show(); return; }
          var r = C.checkExact(input.value, q.accept);
          if (r.pass) { correct++; fb.textContent = '¡Correcto!'; fb.className = 'feedback good'; setTimeout(function () { i++; show(); }, 400); }
          else { fb.textContent = r.near ? 'Nearly — accents' : 'Not quite'; fb.className = 'feedback bad'; }
        });
        reveal.addEventListener('click', function () {
          if (revealed) { i++; show(); return; }
          revealed = true;
          var ans = Array.isArray(q.accept) ? q.accept[0] : q.accept;
          fb.textContent = ans;
          fb.className = 'feedback reveal';
          reveal.textContent = 'Next →';
          // comprehension answers are context-dependent — not logged as errors
        });

      } else if (q.type === 'translate') {
        // self-checked: write your translation, then compare to the model
        body.appendChild(UI.el('h2', 'q-text', 'Translate to English:'));
        body.appendChild(UI.el('div', 'passage small quote', q.line));
        var ta = UI.el('textarea', 'answer-area');
        ta.rows = 2; ta.placeholder = 'your English…';
        var cmp = UI.el('div');
        var showB = UI.el('button', 'primary-btn', 'Compare with model →'); showB.type = 'button';
        body.appendChild(ta); body.appendChild(cmp); body.appendChild(showB);
        ta.focus();
        showB.addEventListener('click', function () {
          if (cmp.childNodes.length) { i++; show(); return; }
          cmp.appendChild(UI.el('div', 'model-answer', '<span class="muted">Model:</span> ' + q.model));
          cmp.appendChild(UI.el('p', 'muted', 'Did you capture the same meaning? Small wording differences are fine.'));
          showB.textContent = 'Next →';
        });
      } else { i++; show(); }
    }
    show();
  }

  return { key: 'comprehend', label: 'Comprender', icon: '👂', run: run };
})();
