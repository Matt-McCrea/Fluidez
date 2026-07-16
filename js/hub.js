/* ============================================================================
 * HUB — the home screen (launcher) and the "Tus errores" view.
 * The session stays immersive; everything else is reached from here.
 * ========================================================================== */
window.Hub = (function () {
  var UI = window.UI, S = window.SRS;

  // Rebuild the review candidate pool the same way the Review stage does, so
  // the hub can show an accurate "due today" count.
  function reviewPool() {
    var items = [];
    (window.VOCAB || []).forEach(function (w) {
      if (window.Profile && !window.Profile.catAllowed(w.cat)) return;
      items.push({ id: 'v:' + w.es });
    });
    (window.IDIOMS || []).forEach(function (x) { items.push({ id: 'i:' + x.es }); });
    (window.GRAMMAR_LESSONS || []).forEach(function (l) {
      (l.recall || []).forEach(function (r) { if (S.isEnrolled(r.id)) items.push({ id: r.id }); });
    });
    if (window.Capture) window.Capture.cards().forEach(function (c) { items.push({ id: c.id }); });
    if (window.ErrorLog) window.ErrorLog.cards().forEach(function (c) { items.push({ id: c.id }); });
    return items;
  }

  function loadProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }

  function nextLesson() {
    var studied = loadProg().studied || {};
    var lessons = window.GRAMMAR_LESSONS || [];
    for (var i = 0; i < lessons.length; i++) if (!studied[lessons[i].id]) return lessons[i];
    return null;
  }

  function card(icon, title, sub, view) {
    var b = UI.el('button', 'hub-card');
    b.type = 'button';
    b.innerHTML = '<span class="hub-ico">' + icon + '</span><span class="hub-title">' + title + '</span>' +
      '<span class="hub-sub muted">' + sub + '</span>';
    b.addEventListener('click', function () { window.App.go(view); });
    return b;
  }

  function render(host) {
    UI.clear(host);
    var p = loadProg();
    var due = S.dueCount(reviewPool());
    var nl = nextLesson();

    var head = UI.el('div', 'hub-head panel');
    head.appendChild(UI.el('div', 'eyebrow', '🌊 Fluidez'));
    head.appendChild(UI.el('h1', null, p.streak ? '🔥 ' + p.streak + '-day streak' : '¡Hola! Ready to practise?'));
    head.appendChild(UI.el('p', 'muted',
      (due ? due + ' item' + (due === 1 ? '' : 's') + ' due · ' : '') +
      (nl ? 'Next lesson: ' + nl.title : 'Syllabus complete — you\'re in review mode 🎓')));
    host.appendChild(head);

    var start = UI.el('button', 'hub-start');
    start.type = 'button';
    start.innerHTML = '<span class="hub-ico">▶</span><span><b>Empezar la sesión de hoy</b><br>' +
      '<span class="muted">Review · lesson · reading · apply · write — about 15–20 min</span></span>';
    start.addEventListener('click', function () { window.App.go('session'); });
    host.appendChild(start);

    var grid = UI.el('div', 'hub-grid');
    var errN = window.ErrorLog ? window.ErrorLog.list().filter(function (e) { return e.reviewable; }).length : 0;
    var capN = window.Capture ? window.Capture.count() : 0;
    grid.appendChild(card('📊', 'Tu progreso', 'streak, syllabus & stats', 'progress'));
    grid.appendChild(card('✍️', 'Escribir', 'free writing & journal', 'write'));
    grid.appendChild(card('➕', 'Añadir palabras', capN + ' captured', 'capture'));
    grid.appendChild(card('🩹', 'Tus errores', errN + ' to review', 'errors'));
    grid.appendChild(card('📚', 'Recursos', 'podcasts & references', 'resources'));
    host.appendChild(grid);

    // ---- profile switcher ----
    if (window.Profile) {
      var pr = UI.el('div', 'profile-bar muted');
      pr.appendChild(UI.el('span', null, 'Mode:'));
      var seg = UI.el('div', 'segmented');
      window.Profile.all().forEach(function (pf) {
        var b = UI.el('button', 'seg' + (window.Profile.current() === pf.name ? ' active' : ''), pf.label);
        b.type = 'button';
        b.addEventListener('click', function () { window.Profile.set(pf.name); render(host); });
        seg.appendChild(b);
      });
      pr.appendChild(seg);
      host.appendChild(pr);
    }
  }

  // ---- "Tus errores" view -------------------------------------------------
  function renderErrors(host, back) {
    UI.clear(host);
    var cards = window.ErrorLog ? window.ErrorLog.cards() : [];
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Tus errores'));

    if (!cards.length) {
      wrap.appendChild(UI.el('p', 'muted', 'Nothing to review — no logged mistakes right now. Nicely done. Misses from cloze, short answers and review show up here to drill.'));
      var h = UI.el('button', 'ghost-btn', '← Inicio'); h.type = 'button'; h.addEventListener('click', back);
      wrap.appendChild(h); host.appendChild(wrap); return;
    }

    wrap.appendChild(UI.el('p', 'muted', 'Drill the things you\'ve missed — the highest-leverage review there is. Get one right and it moves further out; miss it and it stays close.'));
    var deckHost = UI.el('div');
    wrap.appendChild(deckHost);
    host.appendChild(wrap);

    window.Deck.run(deckHost, cards, function (stats) {
      UI.clear(deckHost);
      deckHost.appendChild(UI.el('h2', null, 'Listo — ' + stats.correct + ' / ' + stats.seen));
      var h = UI.el('button', 'ghost-btn', '← Inicio'); h.type = 'button'; h.addEventListener('click', back);
      deckHost.appendChild(h);
    });
  }

  return { render: render, renderErrors: renderErrors, reviewPool: reviewPool };
})();
