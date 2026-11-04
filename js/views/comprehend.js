/* ============================================================================
 * STAGE 3 — COMPRENDER (Comprehend).
 * Read today's passage (with a small gloss as a crutch), then answer questions.
 * MCQ and short answers are auto-checked; a translate question is self-checked
 * against a model — comparing your version to a correct one is exactly the
 * "noticing the gap" mechanism that drives acquisition.
 * ========================================================================== */
window.StageComprehend = (function () {
  var UI = window.UI, C = window.Checker;

  /* A chapter part dressed as a passage, so the reader and the question loop
   * below serve both. Options are shuffled here, at display time, and the
   * stored `answer` index is remapped to where the right option landed. */
  function chapterAsPassage(ctx) {
    var c = ctx.chapter, ch = c.ch, part = ch.parts[c.part], last = c.part === ch.parts.length - 1;
    var many = ch.parts.length > 1;
    var qs = (part.questions || []).map(function (q) {
      var order = (q.options || []).map(function (o, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = order[i]; order[i] = order[j]; order[j] = t; }
      return { type: 'mcq', q: q.q, options: order.map(function (k) { return q.options[k]; }), answer: order.indexOf(q.answer) };
    });
    return { id: ch.id, title: ch.title, text: part.text, gloss: ch.gloss || [], questions: qs,
             chapterNo: ch.n, part: c.part + 1, parts: ch.parts.length, many: many,
             recap: c.part > 0 ? part.recap : null, hook: last ? part.hook : null };
  }

  function rereadBeat(host, ctx, done) {
    var r = ctx.reread, t0 = Date.now();
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, r.title));
    wrap.appendChild(UI.el('p', 'muted', 'Read it again, a little faster.'));
    var body = UI.el('div', 'passage');
    if (window.Gloss) window.Gloss.render(body, r.text, { gloss: r.gloss }); else body.textContent = r.text;
    wrap.appendChild(body);
    wrap.appendChild(UI.nextBtn('Finished reading', function () {
      var s = Math.round((Date.now() - t0) / 1000);
      var time = Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
      ctx.results.reread = { seconds: s, time: time };
      UI.clear(host);
      var end = UI.el('div', 'panel');
      end.appendChild(UI.el('h2', null, 'Read in ' + time));
      end.appendChild(UI.el('p', 'muted', 'No questions this time. A text you have met before should go quicker.'));
      end.appendChild(UI.nextBtn('Continuar →', done));
      host.appendChild(end);
    }));
    host.appendChild(wrap);
  }

  function run(host, ctx, done) {
    if (ctx.reread && !ctx.chapter) { rereadBeat(host, ctx, done); return; }
    var p = ctx.chapter ? (ctx.chapterPassage = ctx.chapterPassage || chapterAsPassage(ctx)) : ctx.passage;
    if (!p) { done(); return; }

    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, p.title));
    if (p.chapterNo != null) {
      wrap.appendChild(UI.el('div', 'muted small', 'Chapter ' + p.chapterNo + (p.many ? ', part ' + p.part + ' of ' + p.parts : '')));
      if (p.recap) wrap.appendChild(UI.el('p', 'muted chapter-recap', p.recap));
    }
    wrap.appendChild(UI.el('p', 'muted', 'Read it through twice: once for the gist, once for detail. Then answer below.'));
    var body = UI.el('div', 'passage');
    // every word is tappable; falls back to plain text if Gloss is not loaded
    if (window.Gloss) window.Gloss.render(body, p.text, { gloss: p.gloss });
    else body.textContent = p.text;
    /* Listen to the whole passage. This is the closest the app gets to a
     * listening stage: connected speech at length, with the text there to fall
     * back on. Shift-click reads it slowly. */
    if (window.Speak && window.Speak.available()) {
      var bar = UI.el('div', 'passage-audio');
      var b = window.Speak.button(p.text, 'big');
      if (b) { bar.appendChild(b); bar.appendChild(UI.el('span', 'muted small', 'escucha el texto (shift para ir despacio)')); }
      wrap.appendChild(bar);
    }
    wrap.appendChild(body);

    if (p.gloss && p.gloss.length) {
      var gdet = UI.el('details', 'gloss-all');
      gdet.appendChild(UI.el('summary', null, 'All glosses'));
      var g = UI.el('div', 'gloss');
      gdet.appendChild(g);
      p.gloss.forEach(function (w) {
        var item = UI.el('span', 'gloss-item', '<b>' + w.es + '</b> ' + w.en + ' ');
        // add-from-anywhere: drop a glossed word straight into your Palabras
        if (window.UserWords) item.appendChild(window.UserWords.addChip(w.es, w.en, 'mios'));
        g.appendChild(item);
      });
      wrap.appendChild(gdet);
    }

    wrap.appendChild(UI.nextBtn('Preguntas →', function () { questions(host, ctx, done); }));
    host.appendChild(wrap);
    // resumed part-way through the questions: go straight back to them
    if (ctx.step && ctx.step.at > 0) questions(host, ctx, done);
  }

  function questions(host, ctx, done) {
    var p = ctx.chapter ? ctx.chapterPassage : ctx.passage;
    var qs = p.questions || [];
    var st = ctx.step || null, ex = (st && st.extra) || {};
    var i = Math.min((st && st.at) || 0, qs.length), correct = ex.correct || 0, total = ex.total || 0;
    if (st) st.at = 0;   // only the first entry resumes

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
      body.appendChild(UI.el('h2', null, UI.t('Comprensión', 'Reading') + ': ' + correct + ' / ' + total));
      if (correct === total) body.appendChild(UI.el('p', 'muted', 'All of them.'));
      if (p.hook) body.appendChild(UI.el('p', 'chapter-hook', p.hook));
      body.appendChild(UI.nextBtn('Continuar →', done));
    }

    function show() {
      if (st) st.save(i, { correct: correct, total: total });   // the place survives a reload
      if (i >= qs.length) { finish(); return; }
      var q = qs[i];
      progress.textContent = 'Pregunta ' + (i + 1) + ' / ' + qs.length;
      UI.clear(body);

      // keep the passage available (collapsed) so it's comprehension, not memory
      var det = UI.el('details', 'passage-peek');
      det.appendChild(UI.el('summary', null, 'Ver el texto'));
      var peek = UI.el('div', 'passage small');
      if (window.Gloss) window.Gloss.render(peek, p.text, { gloss: p.gloss }); else peek.textContent = p.text;
      det.appendChild(peek);
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
          else { fb.textContent = r.near ? 'Nearly, check the accents' : 'Not quite'; fb.className = 'feedback bad'; }
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
