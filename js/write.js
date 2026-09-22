/* ============================================================================
 * WRITE SPACE — "Escribir": on-demand free writing & journal.
 * Two modes: a guided prompt (reusing the paragraph tasks' live constraint
 * checklist + model), or a free "diario" with soft goals (length + at least
 * two different tenses, detected by the engine). Entries are saved to a
 * personal journal so your own Spanish accumulates over time.
 *
 * Store (localStorage 'fluidez.journal'): [{ date, text, prompt }]
 * ========================================================================== */
window.WriteSpace = (function () {
  var UI = window.UI, E = window.ENGINE, C = window.Checker;
  var KEY = 'fluidez.journal';

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  /* `marks` is the self-assessment an essay carried when it was saved
   * ({rubric, yes, total}) — stored so the journal can show what you thought
   * of the piece at the time, and never aggregated into anything. A score you
   * gave yourself is evidence about your attention, not your Spanish. */
  function add(text, prompt, marks) {
    var a = load();
    var e = { date: new Date().toISOString().slice(0, 10), text: text, prompt: prompt || '' };
    if (marks) e.marks = marks;
    a.push(e);
    save(a);
  }

  // distinct tenses used in the text (for the free-mode soft goal)
  function tenseCount(text) {
    var set = {};
    E.analyzeSentence(text).verbs.forEach(function (v) { v.analyses.forEach(function (an) { set[an.tense] = 1; }); });
    E.analyzeSentence(text).compounds.forEach(function (c) { c.parts.forEach(function (p) { set[p.tense] = 1; }); });
    return Object.keys(set).length;
  }

  function render(host, back) {
    var backFn = back;
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, UI.t('Escribir', 'Writing')));
    wrap.appendChild(UI.el('p', 'muted', 'The part most learners skip. Take a prompt or write freely — the checklist updates as you type, and everything is saved.'));

    /* ---- extended writing (B2/C1) ----------------------------------------
     * Essays are offered here as well as on the session's essay day, because
     * the session decides WHEN and this space exists for deciding to write
     * anyway. They are listed rather than folded into the prompt dropdown
     * below: an essay is a different commitment from a journal entry, and a
     * twenty-minute task hiding as the fortieth option in a <select> is a
     * twenty-minute task nobody ever picks.
     *
     * Gated on level, not offered-and-refused. Somebody at A2 who opens one
     * gets a 200-word argumentative brief in Spanish and closes the app. */
    var lvl = (window.Profile && window.Profile.params()) ? window.Profile.params() : null;
    var band = lvl ? lvl.cefr : 'A1';
    var essays = (window.WRITING_TASKS || []).filter(function (t) { return t.type === 'essay'; });
    if (essays.length && (band === 'B2' || band === 'C1') && window.Essay) {
      wrap.appendChild(UI.el('h3', null, UI.t('Escritura larga', 'Extended writing')));
      wrap.appendChild(UI.el('p', 'muted small',
        UI.t('Veinte minutos y una revisión. Plan, borrador, modelo y autoevaluación.',
             'Twenty minutes and a revision pass. Plan, draft, model, self-assessment.')));
      var list = UI.el('div', 'essay-list');
      essays.forEach(function (t) {
        var b = UI.el('button', 'ghost-btn essay-pick'); b.type = 'button';
        b.appendChild(UI.el('b', null, t.prompt));
        b.appendChild(UI.el('span', 'muted small', ' · ' + (t.cefr || '') +
          ' · ' + (window.Essay.rubricById(t.rubric) || {}).label));
        b.addEventListener('click', function () {
          UI.clear(host);
          var panel = UI.el('div', 'panel');
          host.appendChild(panel);
          var back = UI.el('button', 'ghost-btn', UI.t('← Escribir', '← Writing')); back.type = 'button';
          back.addEventListener('click', function () { render(host, backFn); });
          window.Essay.mount(panel, t, { onDone: function () { render(host, backFn); } });
          panel.appendChild(back);
        });
        list.appendChild(b);
      });
      wrap.appendChild(list);
    }

    // prompt selector: free + the paragraph/write tasks
    var tasks = (window.WRITING_TASKS || []).filter(function (t) { return t.type === 'paragraph' || t.type === 'write'; });
    var sel = UI.el('select', 'write-select');
    sel.appendChild(new Option('Diario libre (free writing)', '__free__'));
    tasks.forEach(function (t) { sel.appendChild(new Option(t.prompt, t.id)); });
    wrap.appendChild(UI.el('label', 'field-label', 'Prompt'));
    wrap.appendChild(sel);

    var promptBox = UI.el('div', 'muted small');
    wrap.appendChild(promptBox);

    var ta = UI.el('textarea', 'answer-area'); ta.rows = 8; ta.spellcheck = false; ta.placeholder = 'escribe en español…';
    wrap.appendChild(ta);
    wrap.appendChild(UI.accentBar(function () { return ta; }));
    var counter = UI.el('div', 'muted small write-counter');
    wrap.appendChild(counter);
    wrap.appendChild(UI.el('div', 'checklist-title muted', 'Goals'));
    var checklist = UI.el('ul', 'constraint-list');
    wrap.appendChild(checklist);
    var modelBox = UI.el('div');
    wrap.appendChild(modelBox);

    var saveB = UI.nextBtn('Save to journal', function () {
      if (!ta.value.trim()) return;
      add(ta.value.trim(), currentTask ? currentTask.prompt : 'Diario libre');
      ta.value = ''; renderCheck(); UI.clear(modelBox); renderJournal();
      saveFb.textContent = '¡Guardado! Added to your journal.'; saveFb.className = 'feedback good';
    });
    var modelB = UI.el('button', 'ghost-btn', 'Show model'); modelB.type = 'button';
    var saveFb = UI.el('div', 'feedback');
    var row = UI.el('div', 'row-controls'); row.appendChild(saveB); row.appendChild(modelB);
    wrap.appendChild(row); wrap.appendChild(saveFb);

    var currentTask = null;
    function onSelect() {
      var id = sel.value;
      currentTask = tasks.filter(function (t) { return t.id === id; })[0] || null;
      promptBox.textContent = currentTask && currentTask.hint ? '💡 ' + currentTask.hint : 'Write about anything — aim for a few connected sentences.';
      modelB.style.display = currentTask ? '' : 'none';
      UI.clear(modelBox); saveFb.textContent = '';
      renderCheck();
    }
    function renderCheck() {
      UI.clear(checklist);
      var words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
      var sentences = (ta.value.match(/[.!?]+/g) || []).length;
      counter.textContent = words + ' words · ' + sentences + ' sentence' + (sentences === 1 ? '' : 's');
      if (currentTask) {
        C.checkWriting(currentTask, ta.value).results.forEach(function (r) {
          checklist.appendChild(UI.el('li', 'constraint ' + (r.pass ? 'pass' : 'todo'),
            (r.pass ? '✓ ' : '○ ') + r.label + (r.detail ? ' <span class="muted">(' + r.detail + ')</span>' : '')));
        });
      } else {                                     // free mode soft goals
        var okLen = words >= 40, tc = tenseCount(ta.value), okTense = tc >= 2;
        checklist.appendChild(UI.el('li', 'constraint ' + (okLen ? 'pass' : 'todo'), (okLen ? '✓ ' : '○ ') + 'at least 40 words <span class="muted">(' + words + ')</span>'));
        checklist.appendChild(UI.el('li', 'constraint ' + (okTense ? 'pass' : 'todo'), (okTense ? '✓ ' : '○ ') + 'use at least two different tenses <span class="muted">(' + tc + ')</span>'));
      }
    }
    modelB.addEventListener('click', function () {
      if (!currentTask || !currentTask.models) return;
      if (modelBox.childNodes.length) { UI.clear(modelBox); return; }
      modelBox.appendChild(UI.el('div', null, '<div class="checklist-title muted">Model:</div>' +
        currentTask.models.map(function (m) { return '<div class="model-answer">' + m + '</div>'; }).join('')));
    });
    sel.addEventListener('change', onSelect);
    ta.addEventListener('input', renderCheck);

    // ---- journal ----
    wrap.appendChild(UI.el('h3', null, UI.t('Tu diario', 'Your journal')));
    var journal = UI.el('div', 'journal-list');
    wrap.appendChild(journal);
    function renderJournal() {
      UI.clear(journal);
      var a = load();
      if (!a.length) { journal.appendChild(UI.el('p', 'muted', 'No entries yet — write your first above.')); return; }
      a.slice().reverse().forEach(function (e, ri) {
        var entry = UI.el('div', 'journal-entry');
        entry.appendChild(UI.el('div', 'muted small', e.date + (e.prompt ? ' · ' + e.prompt : '') +
          (e.marks ? ' · ' + e.marks.yes + '/' + e.marks.total : '')));
        entry.appendChild(UI.el('div', 'journal-text', e.text));
        var del = UI.el('button', 'mini-btn', '✕ delete'); del.type = 'button';
        del.addEventListener('click', function () {
          var all = load(); all.splice(all.length - 1 - ri, 1); save(all); renderJournal();
        });
        entry.appendChild(del);
        journal.appendChild(entry);
      });
    }

    var home = UI.el('button', 'ghost-btn', '← Más'); home.type = 'button'; home.addEventListener('click', back);
    wrap.appendChild(home);
    host.appendChild(wrap);
    onSelect(); renderJournal(); ta.focus();
  }

  return { render: render, add: add, entryCount: function () { return load().length; } };
})();
