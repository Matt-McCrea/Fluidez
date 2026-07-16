/* ============================================================================
 * WRITER — a reusable constrained-writing widget: prompt + textarea + a LIVE
 * constraint checklist (engine-verified) + a reveal-the-model self-check.
 * Used by the Practice area's "talk about X" quizzes. (Produce and the Write
 * space have their own inline copies with extra bookkeeping.)
 * ========================================================================== */
window.Writer = (function () {
  var UI = window.UI, C = window.Checker, E = window.ENGINE;

  // opts: { onDone(), doneLabel, counter (bool) }
  function mount(host, task, opts) {
    opts = opts || {};
    var wrap = UI.el('div');
    if (task.prompt) wrap.appendChild(UI.el('h2', 'q-text', task.prompt));
    if (task.hint) wrap.appendChild(UI.el('p', 'muted small', '💡 ' + task.hint));

    var ta = UI.el('textarea', 'answer-area'); ta.rows = opts.counter ? 6 : 3; ta.spellcheck = false;
    ta.placeholder = 'escribe en español…';
    wrap.appendChild(ta);
    wrap.appendChild(UI.accentBar(function () { return ta; }));
    var counter = opts.counter ? UI.el('div', 'muted small write-counter') : null;
    if (counter) wrap.appendChild(counter);

    wrap.appendChild(UI.el('div', 'checklist-title muted', 'Your answer needs to…'));
    var checklist = UI.el('ul', 'constraint-list');
    var modelBox = UI.el('div');
    wrap.appendChild(checklist); wrap.appendChild(modelBox);

    var modelB = UI.el('button', 'ghost-btn', 'Ver ejemplo'); modelB.type = 'button';
    var doneB = UI.el('button', 'primary-btn', opts.doneLabel || 'Listo →'); doneB.type = 'button';
    var row = UI.el('div', 'row-controls'); row.appendChild(doneB); row.appendChild(modelB);
    wrap.appendChild(row);
    host.appendChild(wrap);
    ta.focus();

    function renderCheck() {
      UI.clear(checklist);
      C.checkWriting(task, ta.value).results.forEach(function (r) {
        checklist.appendChild(UI.el('li', 'constraint ' + (r.pass ? 'pass' : 'todo'),
          (r.pass ? '✓ ' : '○ ') + r.label + (r.detail ? ' <span class="muted">(' + r.detail + ')</span>' : '')));
      });
      if (counter) {
        var words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        counter.textContent = words + ' words';
      }
    }
    ta.addEventListener('input', renderCheck);
    renderCheck();

    modelB.addEventListener('click', function () {
      if (modelBox.childNodes.length) { UI.clear(modelBox); return; }
      modelBox.appendChild(UI.el('div', null, '<div class="checklist-title muted">Model:</div>' +
        (task.models || []).map(function (m) { return '<div class="model-answer">' + m + '</div>'; }).join('')));
    });
    doneB.addEventListener('click', function () { if (opts.onDone) opts.onDone(); });
  }

  return { mount: mount };
})();
