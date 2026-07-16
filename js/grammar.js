/* ============================================================================
 * GRAMMAR view — "Gramática": browse every lesson as reference, any time,
 * regardless of where you are in the syllabus. Left index → full lesson on the
 * right (rendered by the same code the daily Learn stage uses). Studied lessons
 * are ticked so you can see what you've covered.
 * ========================================================================== */
window.Grammar = (function () {
  var UI = window.UI;

  function loadProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }

  function render(host, back) {
    UI.clear(host);
    var lessons = window.GRAMMAR_LESSONS || [];
    var studied = loadProg().studied || {};

    var head = UI.el('div', 'panel');
    head.appendChild(UI.el('h1', null, 'Gramática'));
    head.appendChild(UI.el('p', 'muted', 'Every lesson, always open — read or revise any point whenever you like.'));
    var homeTop = UI.el('button', 'ghost-btn', '← Inicio'); homeTop.type = 'button'; homeTop.addEventListener('click', back);
    head.appendChild(homeTop);
    host.appendChild(head);

    var layout = UI.el('div', 'grammar-layout');
    var list = UI.el('div', 'grammar-index panel');
    var docPanel = UI.el('div', 'grammar-doc panel');
    layout.appendChild(list); layout.appendChild(docPanel);
    host.appendChild(layout);

    function showDoc(l) {
      Array.prototype.forEach.call(list.children, function (c) { c.classList.toggle('active', c.dataset.id === l.id); });
      UI.clear(docPanel);
      window.StageLearn.fillLesson(docPanel, l);
      docPanel.scrollIntoView({ block: 'nearest' });
    }

    lessons.forEach(function (l, i) {
      var row = UI.el('button', 'grammar-link');
      row.type = 'button'; row.dataset.id = l.id;
      row.innerHTML = '<span class="gl-mark">' + (studied[l.id] ? '✓' : '·') + '</span>' +
        '<span class="gl-title">' + l.title + '</span><span class="gl-level muted">L' + (l.level || 1) + '</span>';
      row.addEventListener('click', function () { showDoc(l); });
      list.appendChild(row);
      if (i === 0) row.classList.add('active');
    });
    if (lessons.length) showDoc(lessons[0]);
  }

  return { render: render };
})();
