/* ============================================================================
 * STAGE 5 — PRODUCIR (Produce). The output stage: you create Spanish.
 *
 *   build     : click scrambled words into order (auto-checked warm-up)
 *   translate : translate an English sentence — LIVE constraint checklist as
 *               you type (engine-verified), then compare with a model
 *   write     : constrained free writing — same live checklist + model compare
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
        fb.textContent = 'Not quite — click a word to send it back.';
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
        '<p class="muted small">Compare word by word — did you say it a natural way? Differences in vocabulary are fine; look at the verb forms and little words.</p>'));
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

  function run(host, ctx, done) {
    var tasks = ctx.writeTasks || [];
    if (!tasks.length) { done(); return; }
    var i = 0, doneCount = 0;

    var wrap = UI.el('div', 'panel');
    var progress = UI.el('div', 'muted review-stats');
    var body = UI.el('div');
    wrap.appendChild(progress); wrap.appendChild(body);
    host.appendChild(wrap);

    function finish() {
      ctx.results.produce = { done: doneCount, total: tasks.length };
      UI.clear(body);
      body.appendChild(UI.el('h2', null, '¡Buen trabajo!'));
      body.appendChild(UI.el('p', 'muted', 'You produced ' + doneCount + ' piece' + (doneCount === 1 ? '' : 's') + ' of your own Spanish today — the part most learners skip, and the part that builds fluency.'));
      body.appendChild(UI.nextBtn('Terminar la sesión →', done));
    }

    function show() {
      if (i >= tasks.length) { finish(); return; }
      var t = tasks[i];
      progress.textContent = 'Tarea ' + (i + 1) + ' / ' + tasks.length;
      UI.clear(body);
      var next = function (completed) { if (completed !== false) doneCount++; i++; show(); };
      if (t.type === 'build') runBuild(body, t, next);
      else runWrite(body, t, next);
    }
    show();
  }

  return { key: 'produce', label: 'Producir', icon: '✍️', run: run };
})();
