/* ============================================================================
 * SHELL — the tab-bar navigation shell.
 *
 * Five persistent tabs (Inicio, Practicar, Progreso, Palabras, Más), each
 * mounted ONCE into its own container and toggled with a CSS class rather
 * than cleared and rebuilt — so switching tabs is instant and each tab keeps
 * its scroll position and internal state. Inicio and Progreso re-render their
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
    progreso:  { icon: '📊', label: 'Progreso' },
    palabras:  { icon: '➕', label: 'Palabras' },
    mas:       { icon: '⋯', label: 'Más' }
  };
  // Tabs whose stats can go stale while you're elsewhere — re-render on every
  // switch-to rather than only once.
  var LIVE_TABS = { inicio: 1, progreso: 1 };

  var containers = {}, mounted = {}, active = 'inicio';
  var tabHost, tabBar, stageHost, header;

  function loadProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }

  // ---- Inicio: slim status strip + two big tiles --------------------------
  function renderInicio(host) {
    UI.clear(host);
    var p = loadProg();
    var due = (window.Hub && window.SRS) ? window.SRS.dueCount(window.Hub.reviewPool()) : 0;
    var doneToday = window.SRS && p.lastDay === window.SRS.today();

    var strip = UI.el('div', 'status-strip');
    strip.appendChild(UI.el('span', 'status-item', '🔥 ' + (p.streak || 0) + (p.streak === 1 ? ' día' : ' días')));
    strip.appendChild(UI.el('span', 'status-item', due + (due === 1 ? ' pendiente' : ' pendientes')));
    strip.appendChild(UI.el('span', 'status-item' + (doneToday ? ' done' : ''), doneToday ? '✓ Hecho hoy' : 'Sesión pendiente'));
    host.appendChild(strip);

    var isActive = window.Session && window.Session.isActive && window.Session.isActive();
    var stageIdx = isActive ? window.Session.currentStageIndex() : -1;
    var stageN = (window.Session && window.Session.stageCount) ? window.Session.stageCount() : 5;

    var tile1 = UI.el('button', 'home-tile session-tile'); tile1.type = 'button';
    var head1 = UI.el('div', 'tile-head');
    head1.appendChild(UI.el('span', 'tile-ico', '▶'));
    head1.appendChild(UI.el('span', 'tile-title', isActive ? 'Continuar la sesión' : 'Sesión diaria'));
    tile1.appendChild(head1);
    var pips = UI.el('div', 'stage-pips');
    for (var i = 0; i < stageN; i++) {
      pips.appendChild(UI.el('span', 'pip' + (i < stageIdx ? ' done' : i === stageIdx ? ' current' : '')));
    }
    tile1.appendChild(pips);
    tile1.appendChild(UI.el('div', 'muted small', 'Review · lesson · reading · apply · write — about 15–20 min'));
    tile1.addEventListener('click', function () { window.App.go('session'); });
    host.appendChild(tile1);

    var tile2 = UI.el('button', 'home-tile games-tile'); tile2.type = 'button';
    var head2 = UI.el('div', 'tile-head');
    head2.appendChild(UI.el('span', 'tile-ico', '🎮'));
    head2.appendChild(UI.el('span', 'tile-title', 'Juegos'));
    tile2.appendChild(head2);
    tile2.appendChild(UI.el('div', 'muted small', 'Spaced practice that plays like a game'));
    tile2.addEventListener('click', function () { window.App.go('games'); });
    host.appendChild(tile2);
  }

  // ---- Más: a menu, with its own sub-navigation inside the same container --
  function showMasMenu(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Más'));
    var list = UI.el('div', 'mas-list');
    function row(icon, title, sub, onOpen) {
      var b = UI.el('button', 'mas-row'); b.type = 'button';
      b.innerHTML = '<span class="mas-ico">' + icon + '</span>' +
        '<span class="mas-text"><b>' + title + '</b><br><span class="muted small">' + sub + '</span></span>' +
        '<span class="mas-chev">›</span>';
      b.addEventListener('click', function () { onOpen(host, function () { showMasMenu(host); }); });
      list.appendChild(b);
    }
    row('📖', 'Gramática', 'browse every lesson', window.Grammar.render);
    row('✍️', 'Escribir', 'free writing & journal', window.WriteSpace.render);
    row('📚', 'Recursos', 'podcasts & references', window.Resources.render);
    row('⚙️', 'Ajustes', 'mode, export / import', window.Settings.render);
    wrap.appendChild(list);

    if (window.Profile) {
      var pr = UI.el('div', 'profile-bar muted');
      pr.appendChild(UI.el('span', null, 'Mode:'));
      var seg = UI.el('div', 'segmented');
      window.Profile.all().forEach(function (pf) {
        var b = UI.el('button', 'seg' + (window.Profile.current() === pf.name ? ' active' : ''), pf.label);
        b.type = 'button';
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
