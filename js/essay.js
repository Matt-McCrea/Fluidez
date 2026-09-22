/* ============================================================================
 * ESSAY — the runner for extended B2/C1 writing: plan, draft, compare, mark.
 *
 * Everything else in the app that takes writing (js/views/produce.js,
 * js/writer.js, js/write.js) is the same widget: a prompt, a box, the live
 * checklist, a model. That widget is right for a sentence and wrong for two
 * hundred words, for one reason — it has no BEFORE and no AFTER. A C1 text is
 * planned before it is written and revised after, and a surface that opens on
 * an empty box and closes on a model answer teaches the learner that writing
 * is the middle bit.
 *
 * So this is four phases, and the order is the pedagogy:
 *
 *   PLAN     the brief and the genre's moves, with no box on screen. You
 *            cannot start typing yet. This is deliberate: given a box, people
 *            type the first sentence that occurs to them and then defend it
 *            for two hundred words. Thirty seconds of reading the moves is
 *            what the genre lessons (gn-argumentativa-c1 and the rest) have
 *            been teaching with nowhere to land.
 *   DRAFT    the box, with the live checklist and the counter. Same checker
 *            as everywhere else — mechanics only, and it says so.
 *   MODEL    two hundred words of the real thing, beside your own. Swain's
 *            noticing-the-gap, which needs BOTH texts visible at once, so the
 *            draft stays on screen rather than being replaced by the model.
 *   MARK     the rubric from data/rubrics.js, as questions you answer about
 *            your own text. Anything you answer "no" to shows its repair and
 *            REVISE takes you back to the box with those repairs still on
 *            screen. A rubric that cannot send you back to the text is a
 *            report card.
 *
 * The revision pass is the point of the whole screen. It is also the thing the
 * app has never once asked for: 705 writing tasks, every one of them
 * write-it-and-move-on, which is how you get a learner who has written a lot
 * of Spanish and improved at none of it.
 *
 * Nothing here is graded. The self-mark is stored with the entry so the
 * journal can show what you thought of it at the time, and that is all — a
 * score you gave yourself is evidence about your attention, not your Spanish,
 * and the app should not pretend otherwise.
 * ========================================================================== */
window.Essay = (function () {
  var UI = window.UI, C = window.Checker;

  function rubricById(id) {
    return (window.RUBRICS || []).filter(function (r) { return r.id === id; })[0] || null;
  }

  /* opts: { onDone(completed), doneLabel, compact } */
  function mount(host, task, opts) {
    opts = opts || {};
    var rubric = rubricById(task.rubric);
    var answers = {};                 // "dim:i" -> true when ticked
    var wrap = UI.el('div', 'essay');
    host.appendChild(wrap);

    var draft = '';                   // survives the phase changes
    var phase = 'plan';

    function render() {
      UI.clear(wrap);
      if (phase === 'plan') return renderPlan();
      return renderDraft();           // draft · model · mark all keep the box
    }

    // ---- phase 1: the brief and the moves ---------------------------------
    function renderPlan() {
      wrap.appendChild(UI.el('div', 'essay-eyebrow muted small',
        (task.cefr || '') + ' · ' + (rubric ? rubric.label : 'Escritura')));
      wrap.appendChild(UI.el('h2', 'q-text', task.prompt));

      if (task.brief) {
        var b = UI.el('div', 'essay-brief');
        b.appendChild(UI.el('div', 'essay-brief-label muted small', UI.t('La situación', 'The situation')));
        b.appendChild(UI.el('p', null, task.brief));
        wrap.appendChild(b);
      }

      if ((task.plan || []).length) {
        wrap.appendChild(UI.el('div', 'checklist-title muted', UI.t('El plan', 'The plan')));
        var ol = UI.el('ol', 'essay-plan');
        task.plan.forEach(function (step) { ol.appendChild(UI.el('li', null, step)); });
        wrap.appendChild(ol);
      }

      /* The rubric, before writing rather than only after. Criteria known in
       * advance change the draft; revealed at marking time they only explain
       * the mark. */
      if (rubric) {
        var det = UI.el('details', 'essay-rubric-peek');
        det.appendChild(UI.el('summary', null,
          UI.t('Con qué vas a evaluarlo después', 'What you will mark it against')));
        rubric.dims.forEach(function (d) {
          det.appendChild(UI.el('div', 'muted small', '· ' + d.label + ' — ' + d.en));
        });
        wrap.appendChild(det);
      }

      if (task.hint) wrap.appendChild(UI.el('p', 'muted small', '💡 ' + task.hint));

      var go = UI.el('button', 'primary-btn', UI.t('Empezar a escribir →', 'Start writing →'));
      go.type = 'button';
      go.addEventListener('click', function () { phase = 'draft'; render(); });
      var row = UI.el('div', 'row-controls'); row.appendChild(go);
      wrap.appendChild(row);
    }

    // ---- phases 2-4: the box, and what accumulates under it ---------------
    function renderDraft() {
      wrap.appendChild(UI.el('h2', 'q-text', task.prompt));
      if (task.brief) {
        var det = UI.el('details', 'essay-brief-fold');
        det.appendChild(UI.el('summary', null, UI.t('La situación', 'The situation')));
        det.appendChild(UI.el('p', 'muted small', task.brief));
        wrap.appendChild(det);
      }
      if ((task.plan || []).length) {
        var pd = UI.el('details', 'essay-plan-fold');
        pd.appendChild(UI.el('summary', null, UI.t('El plan', 'The plan')));
        var ol = UI.el('ol', 'essay-plan');
        task.plan.forEach(function (s) { ol.appendChild(UI.el('li', null, s)); });
        pd.appendChild(ol);
        wrap.appendChild(pd);
      }

      var ta = UI.el('textarea', 'answer-area essay-area');
      ta.rows = 14; ta.spellcheck = false;
      ta.placeholder = 'escribe en español…';
      ta.value = draft;
      wrap.appendChild(ta);
      wrap.appendChild(UI.accentBar(function () { return ta; }));

      var counter = UI.el('div', 'muted small write-counter');
      wrap.appendChild(counter);

      wrap.appendChild(UI.el('div', 'checklist-title muted',
        UI.t('Lo que la máquina puede comprobar', 'What the machine can check')));
      var checklist = UI.el('ul', 'constraint-list');
      wrap.appendChild(checklist);

      var after = UI.el('div', 'essay-after');
      wrap.appendChild(after);

      var modelB = UI.el('button', 'primary-btn', UI.t('Ver el modelo →', 'See the model →'));
      modelB.type = 'button'; modelB.disabled = true;
      var stuckB = UI.el('button', 'ghost-btn', UI.t('Estoy atascado', "I'm stuck"));
      stuckB.type = 'button';
      var row = UI.el('div', 'row-controls');
      row.appendChild(modelB); row.appendChild(stuckB);
      wrap.appendChild(row);

      function recheck() {
        draft = ta.value;
        var res = C.checkWriting(task, ta.value);
        UI.clear(checklist);
        res.results.forEach(function (r) {
          checklist.appendChild(UI.el('li', 'constraint ' + (r.pass ? 'pass' : 'todo'),
            (r.pass ? '✓ ' : '○ ') + r.label +
            (r.detail ? ' <span class="muted">(' + r.detail + ')</span>' : '')));
        });
        var words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        var sents = (ta.value.match(/[^.!?…]*[.!?…]+/g) || []).filter(function (x) { return /\w/.test(x); }).length;
        counter.textContent = words + ' palabras · ' + sents + (sents === 1 ? ' frase' : ' frases');
        if (phase === 'draft') modelB.disabled = !res.allPass;
        return res;
      }
      ta.addEventListener('input', recheck);

      function showModel() {
        phase = 'model';
        modelB.disabled = false;
        modelB.textContent = UI.t('Ahora evalúalo →', 'Now mark it →');
        stuckB.classList.add('hidden');
        UI.clear(after);
        after.appendChild(UI.el('div', 'checklist-title muted', UI.t('El modelo', 'The model')));
        (task.models || []).forEach(function (m) {
          after.appendChild(UI.el('div', 'model-answer essay-model', m));
        });
        after.appendChild(UI.el('p', 'muted small',
          UI.t('No lo copies: busca una sola cosa que el modelo hace y tu texto no.',
               'Do not copy it: find one thing the model does that your text does not.')));
        after.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      function showRubric() {
        phase = 'mark';
        UI.clear(after);
        if (!rubric) { finish(); return; }
        after.appendChild(UI.el('div', 'checklist-title muted',
          UI.t('Lo que la máquina no puede comprobar', 'What the machine cannot check')));
        after.appendChild(UI.el('p', 'muted small',
          UI.t('Responde mirando tu texto, no de memoria.', 'Answer by looking at your text, not from memory.')));

        rubric.dims.forEach(function (d) {
          var sec = UI.el('div', 'rubric-dim');
          sec.appendChild(UI.el('div', 'rubric-dim-label', d.label +
            ' <span class="muted">— ' + d.en + '</span>'));
          d.asks.forEach(function (a, i) {
            var key = d.id + ':' + i;
            var li = UI.el('label', 'rubric-ask');
            var cb = UI.el('input'); cb.type = 'checkbox';
            cb.checked = !!answers[key];
            var fix = UI.el('div', 'rubric-fix muted small', '→ ' + a.fix);
            fix.hidden = !!answers[key];
            cb.addEventListener('change', function () {
              answers[key] = cb.checked;
              fix.hidden = cb.checked;
              tally();
            });
            li.appendChild(cb);
            li.appendChild(UI.el('span', null, a.q));
            sec.appendChild(li);
            sec.appendChild(fix);
          });
          after.appendChild(sec);
        });

        var score = UI.el('div', 'rubric-score muted');
        after.appendChild(score);

        var reviseB = UI.el('button', 'primary-btn', UI.t('Revisar el texto', 'Revise the text'));
        reviseB.type = 'button';
        reviseB.addEventListener('click', function () {
          /* Back to the box with the repairs still on screen. Scrolling up
           * rather than re-rendering is the whole trick: the "no" answers and
           * their fixes have to stay visible while the text is being fixed,
           * or the learner is editing from memory again. */
          ta.focus();
          ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        var saveB = UI.el('button', 'ghost-btn', UI.t('Guardar y terminar', 'Save and finish'));
        saveB.type = 'button';
        saveB.addEventListener('click', finish);
        var r2 = UI.el('div', 'row-controls');
        r2.appendChild(reviseB); r2.appendChild(saveB);
        after.appendChild(r2);

        modelB.classList.add('hidden');
        function tally() {
          var total = 0, yes = 0;
          rubric.dims.forEach(function (d) {
            d.asks.forEach(function (a, i) { total++; if (answers[d.id + ':' + i]) yes++; });
          });
          score.textContent = yes + ' / ' + total + UI.t(' — lo que queda es tu lista de revisión.',
            ' — what is left is your revision list.');
        }
        tally();
        after.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      modelB.addEventListener('click', function () {
        if (phase === 'draft') showModel();
        else if (phase === 'model') showRubric();
      });
      stuckB.addEventListener('click', showModel);

      function finish() {
        var text = ta.value.trim();
        if (text && window.WriteSpace && window.WriteSpace.add) {
          var marks = null;
          if (rubric) {
            marks = { rubric: rubric.id, yes: 0, total: 0 };
            rubric.dims.forEach(function (d) {
              d.asks.forEach(function (a, i) { marks.total++; if (answers[d.id + ':' + i]) marks.yes++; });
            });
          }
          window.WriteSpace.add(text, task.prompt, marks);
        }
        if (opts.onDone) opts.onDone(true);
      }

      recheck();
      ta.focus();
    }

    render();
  }

  return { mount: mount, rubricById: rubricById };
})();
