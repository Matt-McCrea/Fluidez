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
  function add(text, prompt) {
    var a = load();
    a.push({ date: new Date().toISOString().slice(0, 10), text: text, prompt: prompt || '' });
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
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Escribir'));
    wrap.appendChild(UI.el('p', 'muted', 'The part most learners skip. Write freely, or take a prompt — either way you get live feedback, and your entries are saved to your journal.'));

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
    wrap.appendChild(UI.el('h3', null, 'Tu diario'));
    var journal = UI.el('div', 'journal-list');
    wrap.appendChild(journal);
    function renderJournal() {
      UI.clear(journal);
      var a = load();
      if (!a.length) { journal.appendChild(UI.el('p', 'muted', 'No entries yet — write your first above.')); return; }
      a.slice().reverse().forEach(function (e, ri) {
        var entry = UI.el('div', 'journal-entry');
        entry.appendChild(UI.el('div', 'muted small', e.date + (e.prompt ? ' · ' + e.prompt : '')));
        entry.appendChild(UI.el('div', 'journal-text', e.text));
        var del = UI.el('button', 'mini-btn', '✕ delete'); del.type = 'button';
        del.addEventListener('click', function () {
          var all = load(); all.splice(all.length - 1 - ri, 1); save(all); renderJournal();
        });
        entry.appendChild(del);
        journal.appendChild(entry);
      });
    }

    var home = UI.el('button', 'ghost-btn', '← Inicio'); home.type = 'button'; home.addEventListener('click', back);
    wrap.appendChild(home);
    host.appendChild(wrap);
    onSelect(); renderJournal(); ta.focus();
  }

  return { render: render, entryCount: function () { return load().length; } };
})();
