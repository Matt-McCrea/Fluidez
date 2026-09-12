/* ============================================================================
 * PRACTICE — "Practicar": on-demand practice.
 *
 * Order matters here. "Hablar de…" used to come first and render eleven topic
 * chips, which pushed the actual practice modes and the drills below the fold —
 * so the most useful part of the tab was the part nobody saw. The modes come
 * first now, and writing-about-a-topic comes last.
 *
 * It is also a better section than it was. The eleven hand-written topics gave
 * 38 prompts and stopped at level 5; data/writing.js now holds 405 tasks, every
 * one tagged with one of the 20 Plan Curricular themes and reaching B2. So the
 * chips are themes, the prompts are drawn from that pool at the learner's own
 * level, and the count on each chip tells you how much is actually there.
 * ========================================================================== */
window.Practice = (function () {
  var UI = window.UI;

  function levelGate() {
    var p = window.Profile ? window.Profile.params() : null;
    return (p && p.maxGate) || 99;
  }

  // Writing tasks on a theme, at or below the learner's level, hardest first so
  // a round starts at the top of what they can currently handle.
  function tasksFor(theme) {
    var gate = levelGate();
    return (window.WRITING_TASKS || [])
      .filter(function (t) { return t.theme === theme && (t.level || 1) <= gate; })
      .sort(function (a, b) { return (b.level || 1) - (a.level || 1); });
  }

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, UI.t('Practicar', 'Practice')));
    wrap.appendChild(UI.el('p', 'muted', 'Quick, targeted practice — pick exactly what you want to work on.'));

    // ---- the practice modes come first: this is the useful part ----
    wrap.appendChild(UI.el('h3', null, UI.t('Elige un modo', 'Pick a mode')));
    if (window.Selector) window.Selector.renderChooser(wrap);

    // ---- fast drills (conjugation + flashcards) ----
    wrap.appendChild(UI.el('h3', null, UI.t('Ejercicios rápidos', 'Quick exercises')));
    if (window.Drills) window.Drills.renderSection(wrap);

    // ---- writing on a theme, last ----
    wrap.appendChild(UI.el('h3', null, UI.t('Escribir sobre un tema', 'Write about a topic')));
    wrap.appendChild(UI.el('p', 'muted small',
      'A writing prompt on the theme you pick, at your level. The number is how many are available to you now.'));
    var chips = UI.el('div', 'chip-row');
    var any = false;
    (window.THEMES || []).forEach(function (th) {
      var n = tasksFor(th.id).length;
      if (!n) return;
      any = true;
      var c = UI.el('button', 'topic-chip', th.en + ' · ' + n); c.type = 'button';
      c.title = th.es;
      c.addEventListener('click', function () { startTheme(th); });
      chips.appendChild(c);
    });
    if (!any) chips.appendChild(UI.el('span', 'muted small', 'Nothing at your level yet — try a higher level in Más.'));
    wrap.appendChild(chips);

    host.appendChild(wrap);
  }

  function backToMenu() { window.Shell.closeOverlay(); window.Shell.refresh('practicar'); }

  /* Pick a task the learner has not just done: rotate by day so the same theme
   * gives something different tomorrow, rather than always the hardest one. */
  function startTheme(th) {
    var pool = tasksFor(th.id);
    if (!pool.length) return;
    var day = Math.floor(Date.now() / 86400000);
    var task = pool[day % pool.length];

    window.Shell.openOverlay(false);
    var host = document.getElementById('stage-host');
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('div', 'eyebrow', 'Escribir · ' + th.es + ' · L' + (task.level || 1)));
    var body = UI.el('div'); wrap.appendChild(body);
    host.appendChild(wrap);
    window.Writer.mount(body, task, { counter: true, doneLabel: '← Practicar', onDone: backToMenu });
  }

  return { render: render };
})();
