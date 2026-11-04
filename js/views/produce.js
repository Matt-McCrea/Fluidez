/* ============================================================================
 * STAGE 5 — PRODUCIR (Produce). The output stage: you create Spanish.
 *
 *   build     : click scrambled words into order (auto-checked warm-up)
 *   translate : translate an English sentence — LIVE constraint checklist as
 *               you type (engine-verified), then compare with a model
 *   write     : constrained free writing — same live checklist + model compare
 *   essay     : B2/C1 extended production — plan, draft, model, self-mark,
 *               revise. Handed to js/essay.js, which owns the four phases;
 *               this file only decides that an essay is not a `write` with a
 *               taller box (it was, for one afternoon, and the phases are the
 *               entire difference).
 *
 * The live checklist is the app's signature: because the engine can analyse
 * any conjugated form, we verify *mechanics* automatically ("uses the
 * preterite", "conjugated for yo", "includes ayer") while the model comparison
 * covers naturalness. Both automated checking and check-yourself, as designed.
 * ========================================================================== */
window.StageProduce = (function () {
  var UI = window.UI, E = window.ENGINE, C = window.Checker;

  // ---- scrambled sentence builder ----------------------------------------
  function runBuild(body, task, next) {
    body.appendChild(UI.el('h2', 'q-text', 'Build the sentence:'));
    body.appendChild(UI.el('p', 'muted', '“' + task.en + '”'));

    var words = task.answer.replace(/[.!?]$/, '').split(' ');
    var scrambled = E.shuffle(words.slice());
    // re-scramble if it landed in the right order (spoils the task)
    if (scrambled.join(' ') === words.join(' ') && words.length > 2) scrambled.reverse();

    var line = UI.el('div', 'build-line');       // chosen words appear here
    var bank = UI.el('div', 'word-bank');        // pool of remaining words
    var fb = UI.el('div', 'feedback');
    var chosen = [];                             // indices into `scrambled`

    function render() {
      UI.clear(line); UI.clear(bank);
      chosen.forEach(function (si, ci) {
        var b = UI.el('button', 'word-chip chosen', scrambled[si]); b.type = 'button';
        b.addEventListener('click', function () { chosen.splice(ci, 1); render(); });
        line.appendChild(b);
      });
      if (!chosen.length) line.appendChild(UI.el('span', 'muted', 'click the words below in order…'));
      scrambled.forEach(function (w, si) {
        var used = chosen.indexOf(si) !== -1;
        var b = UI.el('button', 'word-chip' + (used ? ' used' : ''), w); b.type = 'button';
        if (!used) b.addEventListener('click', function () { chosen.push(si); render(); check(); });
        bank.appendChild(b);
      });
    }

    function check() {
      if (chosen.length !== words.length) { fb.textContent = ''; fb.className = 'feedback'; return; }
      var built = chosen.map(function (si) { return scrambled[si]; }).join(' ');
      if (built === words.join(' ')) {
        fb.textContent = '¡Correcto! ' + task.answer;
        fb.className = 'feedback good';
        setTimeout(next, 900);
      } else {
        fb.textContent = 'Not quite. Click a word to send it back.';
        fb.className = 'feedback bad';
      }
    }

    body.appendChild(line);
    body.appendChild(bank);
    body.appendChild(fb);
    render();
  }

  // ---- constrained writing (translate / free write / paragraph) -----------
  function runWrite(body, task, next) {
    var isPara = task.type === 'paragraph';
    body.appendChild(UI.el('h2', 'q-text', task.prompt));
    if (task.hint) body.appendChild(UI.el('p', 'muted small', '💡 ' + task.hint));

    var ta = UI.el('textarea', 'answer-area');
    ta.rows = isPara ? 7 : 3; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;

    var counter = isPara ? UI.el('div', 'muted small write-counter') : null;
    var checklist = UI.el('ul', 'constraint-list');
    var modelBox = UI.el('div');
    var doneB = UI.el('button', 'primary-btn', 'Compare with model →'); doneB.type = 'button';
    doneB.disabled = true;
    var skipB = UI.el('button', 'ghost-btn', 'Show model (I\'m stuck)'); skipB.type = 'button';

    body.appendChild(ta);
    body.appendChild(UI.accentBar(function () { return ta; }));
    if (counter) body.appendChild(counter);
    body.appendChild(UI.el('div', 'checklist-title muted', (isPara ? 'Your paragraph' : 'Your sentence') + ' needs to…'));
    body.appendChild(checklist);
    body.appendChild(modelBox);
    var row = UI.el('div', 'row-controls');
    row.appendChild(doneB); row.appendChild(skipB);
    body.appendChild(row);
    ta.focus();

    function renderCheck() {
      var res = C.checkWriting(task, ta.value);
      UI.clear(checklist);
      res.results.forEach(function (r) {
        var li = UI.el('li', 'constraint ' + (r.pass ? 'pass' : 'todo'),
          (r.pass ? '✓ ' : '○ ') + r.label + (r.detail ? ' <span class="muted">(' + r.detail + ')</span>' : ''));
        checklist.appendChild(li);
      });
      if (counter) {
        var words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        var sentences = (ta.value.match(/[.!?]+/g) || []).length;
        counter.textContent = words + ' words · ' + sentences + ' sentence' + (sentences === 1 ? '' : 's');
      }
      doneB.disabled = !res.allPass;
      return res;
    }
    ta.addEventListener('input', renderCheck);
    renderCheck();

    var shown = false;
    function showModel(passed) {
      if (shown) { next(passed); return; }
      shown = true;
      var models = task.models || [];
      var html = models.map(function (m) { return '<div class="model-answer">' + m + '</div>'; }).join('');
      modelBox.appendChild(UI.el('div', null,
        '<div class="checklist-title muted">Model answer' + (models.length > 1 ? 's' : '') + ':</div>' + html +
        '<p class="muted small">Compare word by word. Did you say it a natural way? Differences in vocabulary are fine; look at the verb forms and little words.</p>'));
      doneB.textContent = 'Next →';
      doneB.disabled = false;
      skipB.classList.add('hidden');
    }
    doneB.addEventListener('click', function () {
      if (shown) { next(true); return; }
      showModel(true);
    });
    skipB.addEventListener('click', function () { showModel(false); });
  }

  /* ---- translate from the sentence bank -------------------------------------
   * A bank task carries the model (`es`) and the accepted alternatives
   * (`accept`), so it is graded by LIB.match.matchTranslation instead of the
   * constraint checklist: right is right whatever words the learner chose. One
   * self-correction (lib/match/attempt.ts): a miss shows the matcher's one line
   * hint and lets the learner try again; a second miss shows the model. Both
   * attempts count once. A right answer says "Right" and shows the model only
   * when the matcher noted something (a kept pronoun, an accent slip). */
  function lines(s) { return String(s || '').replace(/\n/g, '<br>'); }
  function runBankTranslate(body, task, next) {
    var M = window.LIB && window.LIB.match;
    body.appendChild(UI.el('h2', 'q-text', 'Say it in Spanish:'));
    body.appendChild(UI.el('p', 'cloze-text', '“' + lines(task.prompt) + '”'));
    var ta = UI.el('textarea', 'answer-area');
    ta.rows = 2; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;
    var fb = UI.el('div', 'feedback');
    var go = UI.el('button', 'primary-btn', 'Check'); go.type = 'button';
    var skip = UI.el('button', 'ghost-btn', 'Show answer (I\'m stuck)'); skip.type = 'button';
    var row = UI.el('div', 'row-controls');
    row.appendChild(go); row.appendChild(skip);
    body.appendChild(ta);
    body.appendChild(UI.accentBar(function () { return ta; }));
    body.appendChild(fb);
    body.appendChild(row);
    ta.focus();

    var state = M ? M.startAttempt({ es: task.es, en: task.prompt, accept: task.accept || [] }, { accents: 'lenient' }) : null;
    var finished = false;

    function finish(ok, html, cls) {
      finished = true;
      fb.className = 'feedback ' + cls;
      fb.innerHTML = html;
      ta.readOnly = true;
      skip.classList.add('hidden');
      go.textContent = 'Next →'; go.disabled = false;
      go.onclick = function () { next(ok); };
    }
    function reveal(hint) {
      if (window.ErrorLog) window.ErrorLog.record({ id: 'err:translate:' + E.normalize(task.es), front: task.prompt,
        back: task.es, hint: hint || null, kind: 'error', source: 'produce-translate', reviewable: true });
      finish(false, '<div class="model-answer">' + lines(task.es) + '</div>' + (hint ? '<div class="muted small">' + hint + '</div>' : ''), 'bad');
    }
    function submit() {
      if (finished) return;
      var text = ta.value.trim();
      if (!text) return;
      if (!M) { reveal(null); return; }
      var step = M.submitAttempt(state, text);
      state = step.state;
      var res = step.result;
      if (step.status === 'correct') {
        var note = res.note || (res.near ? res.hint : '');
        finish(true, 'Right' + (note ? '. ' + note + '<div class="model-answer">' + lines(task.es) + '</div>' : ''), 'good');
      } else if (step.status === 'retry') {
        fb.className = 'feedback bad';
        fb.textContent = (res.hint || 'Not quite.') + ' Try once more.';
        ta.focus();
      } else {
        reveal(res.hint || null);
      }
    }
    go.onclick = submit;
    skip.addEventListener('click', function () { if (!finished) reveal(null); });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (finished) go.click(); else submit(); }
    });
  }

  function run(host, ctx, done) {
    var tasks = ctx.writeTasks || [];
    if (!tasks.length) { done(); return; }
    var st = ctx.step || null, ex = (st && st.extra) || {};
    var i = Math.min((st && st.at) || 0, tasks.length), doneCount = ex.done || 0;

    var wrap = UI.el('div', 'panel');
    var progress = UI.el('div', 'muted review-stats');
    var body = UI.el('div');
    wrap.appendChild(progress); wrap.appendChild(body);
    host.appendChild(wrap);

    function finish() {
      ctx.results.produce = { done: doneCount, total: tasks.length };
      UI.clear(body);
      body.appendChild(UI.el('h2', null, UI.t('Escrito', 'Written')));
      body.appendChild(UI.el('p', 'muted', 'You produced ' + doneCount + ' piece' + (doneCount === 1 ? '' : 's') + ' of your own Spanish today. Most learners skip this part, and it is the part that builds fluency.'));
      body.appendChild(UI.nextBtn('Terminar la sesión →', done));
    }

    function show() {
      if (st) st.save(i, { done: doneCount });   // the place survives a reload
      if (i >= tasks.length) { finish(); return; }
      var t = tasks[i];
      progress.textContent = 'Tarea ' + (i + 1) + ' / ' + tasks.length;
      UI.clear(body);
      var next = function (completed) { if (completed !== false) doneCount++; i++; show(); };
      if (t.type === 'build') runBuild(body, t, next);
      else if (t.type === 'essay' && window.Essay) window.Essay.mount(body, t, { onDone: next });
      else if (t.type === 'translate' && t.es && window.LIB && window.LIB.match) runBankTranslate(body, t, next);
      else runWrite(body, t, next);
    }
    show();
  }

  return { key: 'produce', label: 'Producir', icon: '✍️', run: run };
})();
