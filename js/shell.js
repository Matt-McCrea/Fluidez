/* ============================================================================
 * SHELL — the tab-bar navigation shell.
 *
 * Five persistent tabs (Inicio, Practicar, Lecciones, Palabras, Más), each
 * mounted ONCE into its own container and toggled with a CSS class rather
 * than cleared and rebuilt — so switching tabs is instant and each tab keeps
 * its scroll position and internal state. Inicio and Lecciones (internally
 * still keyed "progreso" — same module, just relabelled) re-render their
 * content every time you switch to them (their stats can go stale); the
 * others keep whatever they last showed.
 *
 * Focused tasks (the daily session, an on-demand lesson, a Practicar drill,
 * the error deck, a game) are NOT tabs — they're a full-screen overlay that
 * temporarily hides the tab bar and shows #stage-host instead, exactly as
 * the single-view app worked before. openOverlay()/closeOverlay() are the
 * seam every one of those call sites uses.
 * ========================================================================== */
window.Shell = (function () {
  var UI = window.UI;
  var TABS = ['inicio', 'practicar', 'progreso', 'palabras', 'mas'];
  var TAB_META = {
    inicio:    { icon: '🏠', label: 'Inicio' },
    practicar: { icon: '🧩', label: 'Practicar' },
    progreso:  { icon: '📊', label: 'Lecciones' },
    palabras:  { icon: '➕', label: 'Palabras' },
    mas:       { icon: '⋯', label: 'Más' }
  };
  // Tabs whose stats can go stale while you're elsewhere — re-render on every
  // switch-to rather than only once.
  var LIVE_TABS = { inicio: 1, progreso: 1 };

  var containers = {}, mounted = {}, active = 'inicio';
  var tabHost, tabBar, stageHost, header;

  // Headings in English until B1 — see Profile.term.
  function T(es, en) { return window.UI.t(es, en); }

  function loadProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }

  /* ---- Inicio -------------------------------------------------------------
   *
   * The home screen used to be two tiles: "Sesión diaria" over the words
   * "Review · lesson · reading · apply · write — about 15–20 min", identical
   * every day of the course. Everything needed to say something true — the
   * unit, its goal, how far through it you are, which lesson is next — was
   * already being computed, and shown one screen later on an intro card you
   * had to start a session to reach.
   *
   * So the intro card IS the home screen now, and starting goes straight to
   * the first stage. Session.today() supplies the content without building a
   * whole session for it. */
  function renderInicio(host) {
    UI.clear(host);
    var p = loadProg();
    var due = (window.Hub && window.SRS) ? window.SRS.dueCount(window.Hub.reviewPool()) : 0;
    var doneToday = window.SRS && p.lastDay === window.SRS.today();
    var errors = window.ErrorLog ? window.ErrorLog.cards().length : 0;

    var strip = UI.el('div', 'status-strip');
    strip.appendChild(UI.el('span', 'status-item', '🔥 ' + (p.streak || 0) + T(p.streak === 1 ? ' día' : ' días', p.streak === 1 ? ' day' : ' days')));
    strip.appendChild(UI.el('span', 'status-item', due + T(due === 1 ? ' pendiente' : ' pendientes', due === 1 ? ' due' : ' due')));
    strip.appendChild(UI.el('span', 'status-item' + (doneToday ? ' done' : ''), doneToday ? T('✓ Hecho hoy', '✓ Done today') : T('Sesión pendiente', 'Not done yet')));
    host.appendChild(strip);

    var isActive = window.Session && window.Session.isActive && window.Session.isActive();
    var t = null;
    try { t = window.Session ? window.Session.today() : null; } catch (e) { t = null; }

    // ---- today's card ----
    var card = UI.el('div', 'today-card');
    card.appendChild(UI.el('div', 'eyebrow', isActive ? T('Sesión a medias', 'Session in progress') : T('Tu sesión de hoy', 'Today')));

    if (t && t.unit) {
      var u = t.unit;
      var uh = UI.el('div', 'today-unit');
      uh.appendChild(UI.el('div', 'unit-eyebrow',
        T('Unidad', 'Unit') + (u.day ? ' · ' + T('día', 'day') + ' ' + u.day + T(' de ', ' of ') + u.of : '')));
      uh.appendChild(UI.el('div', 'unit-title', u.title));
      if (u.goal) uh.appendChild(UI.el('div', 'unit-goal', u.goal));
      if (u.day) {
        var ub = UI.el('div', 'unit-bar');
        var uf = UI.el('div', 'unit-bar-fill');
        uf.style.width = Math.round(100 * u.day / u.of) + '%';
        ub.appendChild(uf); uh.appendChild(ub);
      }
      card.appendChild(uh);
    }

    if (t) {
      var todayRow = UI.el('div', 'today-focus');
      todayRow.appendChild(UI.el('span', 'tf-label', T('Hoy', 'Today')));
      todayRow.appendChild(UI.el('span', 'tf-value', t.lessonTitle));
      card.appendChild(todayRow);

      // the shape of the session, as a strip rather than a five-row list
      var strip2 = UI.el('div', 'stage-strip');
      var cur = isActive ? window.Session.currentStageIndex() : -1;
      t.stages.forEach(function (st, i) {
        var cls = 'ss-step' + (i < cur ? ' done' : i === cur ? ' current' : '');
        var step = UI.el('span', cls);
        step.appendChild(UI.el('span', 'ss-ico', st.icon));
        step.appendChild(UI.el('span', 'ss-label', st.label));
        strip2.appendChild(step);
      });
      card.appendChild(strip2);
    }

    var go = UI.el('button', 'primary-btn today-go');
    go.type = 'button';
    go.textContent = isActive ? 'Seguir →' : 'Empezar →';   // buttons stay Spanish at every level
    go.addEventListener('click', function () { window.App.go('session', 'diaria'); });
    var goRow = UI.el('div', 'today-go-row');
    goRow.appendChild(go);
    var dm = window.Session ? window.Session.modes()[2] : null;
    goRow.appendChild(UI.el('span', 'muted small', dm ? T(dm.mins, dm.minsEn) : ''));
    card.appendChild(goRow);

    /* A rusty ex-speaker often already knows today's lesson cold. This used to
     * sit on the intro screen; it belongs wherever the learner decides. */
    if (t && t.canSkipLesson && !isActive) {
      var skip = UI.el('button', 'linkish', T('Ya me sé esta lección — pasar a la siguiente', 'I already know this lesson — skip to the next'));
      skip.type = 'button';
      skip.addEventListener('click', function () { window.Session.skipLesson(); refresh('inicio'); });
      card.appendChild(skip);
    }
    host.appendChild(card);

    // ---- shorter and longer ways in ----
    if (window.Session && window.Session.modes) {
      var alt = window.Session.modes().filter(function (m) { return m.key !== 'diaria'; });
      var sec = UI.el('div', 'alt-section');
      sec.appendChild(UI.el('h3', null, T('Otra duración', 'Got more or less time?')));
      var list = UI.el('div', 'alt-list');
      alt.forEach(function (m) {
        var b = UI.el('button', 'alt-row'); b.type = 'button';
        b.innerHTML = '<span class="alt-ico">' + (m.icon || '•') + '</span>' +
          '<span class="alt-text"><b class="alt-name">' + T(m.label, m.labelEn) + '</b>' +
          '<span class="alt-blurb">' + m.blurb + '</span></span>' +
          '<span class="alt-mins">' + T(m.mins, m.minsEn) + '</span>';
        b.addEventListener('click', function () { window.App.go('session', m.key); });
        list.appendChild(b);
      });
      sec.appendChild(list);
      host.appendChild(sec);
    }

    // ---- practice that is worth surfacing ----
    var extras = UI.el('div', 'home-extras');
    if (errors) {
      var eb = UI.el('button', 'home-extra errors'); eb.type = 'button';
      eb.innerHTML = '<span class="he-ico">🩹</span><span class="he-text"><b>' + T('Practicar tus errores', 'Practise your mistakes') + '</b><br>' +
        '<span class="muted small">' + errors + T(errors === 1 ? ' cosa que se te ha resistido' : ' cosas que se te han resistido',
                                                    errors === 1 ? ' thing you keep missing' : ' things you keep missing') + '</span></span>';
      eb.addEventListener('click', function () { window.App.go('errors'); });
      extras.appendChild(eb);
    }
    var gb = UI.el('button', 'home-extra games'); gb.type = 'button';
    gb.innerHTML = '<span class="he-ico">🎮</span><span class="he-text"><b>' + T('Juegos', 'Games') + '</b><br>' +
      '<span class="muted small">' + T('Repaso que se juega', 'Review that plays like a game') + '</span></span>';
    gb.addEventListener('click', function () { window.App.go('games'); });
    extras.appendChild(gb);
    host.appendChild(extras);
  }

  // ---- Más: a menu, with its own sub-navigation inside the same container --
  function showMasMenu(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, T('Más', 'More')));
    var list = UI.el('div', 'mas-list');
    function row(icon, title, sub, onOpen) {
      var b = UI.el('button', 'mas-row'); b.type = 'button';
      b.innerHTML = '<span class="mas-ico">' + icon + '</span>' +
        '<span class="mas-text"><b>' + title + '</b><br><span class="muted small">' + sub + '</span></span>' +
        '<span class="mas-chev">›</span>';
      b.addEventListener('click', function () { onOpen(host, function () { showMasMenu(host); }); });
      list.appendChild(b);
    }
    row('🧭', T('Cómo funciona', 'How this works'), 'the tour, and set your level', function (h, back) {
      window.Onboarding.run(h, function () { refresh('inicio'); back(); });
    });
    row('📖', T('Gramática', 'Grammar'), 'browse every lesson', window.Grammar.render);
    row('🔍', T('Profundizar', 'Go deeper'), 'optional deep dives on the hard parts', window.DeepDive.render);
    row('✍️', T('Escribir', 'Writing'), 'free writing & journal', window.WriteSpace.render);
    row('📚', T('Recursos', 'Resources'), 'podcasts & references', window.Resources.render);
    row('⚙️', T('Ajustes', 'Settings'), 'mode, export / import', window.Settings.render);
    wrap.appendChild(list);

    if (window.Profile) {
      var pr = UI.el('div', 'profile-bar muted');
      pr.appendChild(UI.el('span', null, T('Nivel:', 'Level:')));
      var seg = UI.el('div', 'segmented');
      window.Profile.all().forEach(function (pf) {
        // the code only: five full labels ("A1 · Acceso"…) overflow the bar
        var b = UI.el('button', 'seg' + (window.Profile.current() === pf.name ? ' active' : ''), pf.name);
        b.type = 'button';
        b.title = pf.label;
        b.addEventListener('click', function () {
          window.Profile.set(pf.name);
          refresh('mas'); refresh('inicio');
        });
        seg.appendChild(b);
      });
      pr.appendChild(seg);
      wrap.appendChild(pr);
    }
    host.appendChild(wrap);
  }

  // ---- tab lifecycle --------------------------------------------------------
  function mountTab(name) {
    if (window.Perf) return window.Perf.mark('mount ' + name, function () { return mountTabInner(name); });
    return mountTabInner(name);
  }
  function mountTabInner(name) {
    if (mounted[name]) return;
    mounted[name] = true;
    var host = containers[name];
    var toInicio = function () { go('inicio'); };
    switch (name) {
      case 'inicio':    renderInicio(host); break;
      case 'practicar': window.Practice.render(host, toInicio); break;
      case 'progreso':  window.Progress.render(host, toInicio); break;
      case 'palabras':  window.UserWords.render(host, toInicio); break;
      case 'mas':       showMasMenu(host); break;
    }
  }

  function refresh(name) {
    mounted[name] = false;
    mountTab(name);
  }

  function go(name) {
    if (TABS.indexOf(name) === -1) return;
    active = name;
    TABS.forEach(function (t) { containers[t].classList.toggle('active', t === name); });
    Array.prototype.forEach.call(tabBar.children, function (btn) { btn.classList.toggle('active', btn.dataset.tab === name); });
    if (LIVE_TABS[name]) refresh(name); else mountTab(name);
  }

  // `showBar` — only the real daily session drives the header's progress bar;
  // other overlays (lessons, drills, errors, games) leave it hidden.
  function openOverlay(showBar) {
    stageHost.classList.remove('hidden');
    tabHost.classList.add('hidden');
    tabBar.classList.add('hidden');
    if (header) header.classList.toggle('in-session', !!showBar);
  }
  function closeOverlay() {
    stageHost.classList.add('hidden');
    UI.clear(stageHost);
    tabHost.classList.remove('hidden');
    tabBar.classList.remove('hidden');
    if (header) header.classList.remove('in-session');
  }

  function init() {
    header = document.querySelector('.app-header');
    stageHost = document.getElementById('stage-host');
    tabHost = document.getElementById('tab-host');

    TABS.forEach(function (t) {
      var c = UI.el('div', 'tab-panel' + (t === 'inicio' ? ' active' : ''));
      containers[t] = c;
      tabHost.appendChild(c);
    });

    tabBar = UI.el('nav', 'bottom-nav');
    TABS.forEach(function (t) {
      var b = UI.el('button', 'bottom-nav-btn' + (t === 'inicio' ? ' active' : '')); b.type = 'button';
      b.dataset.tab = t;
      b.innerHTML = '<span class="bn-ico">' + TAB_META[t].icon + '</span><span class="bn-label">' + TAB_META[t].label + '</span>';
      b.addEventListener('click', function () { go(t); });
      tabBar.appendChild(b);
    });
    document.body.appendChild(tabBar);

    mountTab('inicio');
  }

  return { init: init, go: go, refresh: refresh, openOverlay: openOverlay, closeOverlay: closeOverlay };
})();
