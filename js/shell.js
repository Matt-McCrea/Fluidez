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
  /* Jugar sits second, next to Inicio, because those two are the whole app on
   * most days: the session when there is time, a game against your own record
   * when there is not. It used to be an overlay behind a single button on one
   * home card, which is a strange place to keep the part people replay. */
  var TABS = ['inicio', 'jugar', 'practicar', 'progreso', 'palabras', 'mas'];
  var TAB_META = {
    inicio:    { icon: '🏠', label: 'Inicio' },
    jugar:     { icon: '🎮', label: 'Jugar' },
    practicar: { icon: '🧩', label: 'Practicar' },
    /* Labelled for what the tab holds. It said "Lecciones", which promised a
     * lesson list and delivered stat tiles, an SRS distribution and a
     * heatmap — so the one screen that answers "am I getting better?" was
     * filed under a name that answers a different question. */
    progreso:  { icon: '📊', label: 'Progreso' },
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

    var rh = (window.Session && window.Session.rhythm) ? window.Session.rhythm() : null;

    /* Somebody coming back after a fortnight gets a greeting, not a reckoning.
     * The old strip told them their streak was 0 and their session was
     * "pendiente", which is a bill, and then asked them to study. */
    if (rh && rh.away !== null && rh.away >= 7) {
      var wb = UI.el('div', 'welcome-back');
      wb.appendChild(UI.el('b', null, T('Bienvenido de nuevo.', 'Welcome back.')));
      wb.appendChild(UI.el('span', null,
        T('Tu sitio está guardado — seguimos donde lo dejaste.',
          'Your place is saved — we pick up exactly where you left off.')));
      host.appendChild(wb);
    }

    var strip = UI.el('div', 'status-strip');
    if (rh) {
      strip.appendChild(UI.el('span', 'status-item',
        '🔥 ' + rh.days30 + T(' de 30 días', ' of 30 days')));
    }
    strip.appendChild(UI.el('span', 'status-item', due + T(due === 1 ? ' pendiente' : ' pendientes', due === 1 ? ' due' : ' due')));
    /* "Sesión pendiente" read as a debt. It is an invitation until you take
     * it and a receipt afterwards, and neither of those is an outstanding
     * obligation. */
    strip.appendChild(UI.el('span', 'status-item' + (doneToday ? ' done' : ''),
      doneToday ? T('✓ Hecho hoy', '✓ Done today') : T('Listo cuando quieras', 'Ready when you are')));
    host.appendChild(strip);

    var isActive = window.Session && window.Session.isActive && window.Session.isActive();
    var t = null;
    try { t = window.Session ? window.Session.today() : null; } catch (e) { t = null; }

    // ---- today's card ----
    /* Two cards, not one. The session card is an invitation while there is a
     * session to take; once it is done it used to sit there unchanged, still
     * saying "Empezar →", so the one thing the app offered on a second visit
     * was to repeat the thing you had just finished. The done state is its
     * own card now, and its job is to hand you somewhere worth going. */
    if (doneToday && !isActive) {
      /* Just the two boxes. This card used to open with a "Done for today"
       * pill and "You did <lesson>", both of which the status strip directly
       * above already says — and then a Review button, which the strip's due
       * count and the practice box were both also offering. Four things
       * telling you the same two facts. The strip carries the state; the card
       * carries the action, and nothing else. */
      var dc = UI.el('div', 'today-card done-card');

      /* Two boxes, half width. The card used to end here with "the course
       * comes back tomorrow", which is true and is not an answer to "so what
       * now?". One box says what tomorrow actually is and offers to start it
       * early — nothing in this app is locked, Lecciones has always let you
       * take any lesson. The other is practice, rotated by the day through
       * what already exists, so the second visit is not the same suggestion
       * every time. */
      var pair = UI.el('div', 'next-pair');

      var up = (window.Session && window.Session.nextUp) ? window.Session.nextUp() : null;
      if (up) {
        var nb = UI.el('button', 'next-box'); nb.type = 'button';
        nb.innerHTML = '<span class="nb-eyebrow">' + T('Lo siguiente', 'Next up') + '</span>' +
          '<b class="nb-title">' + up.title + '</b>' +
          (up.canDo ? '<span class="nb-sub">' + up.canDo + '</span>' : '') +
          '<span class="nb-go">' + T('Empezarla ya →', 'Start it now →') + '</span>';
        nb.addEventListener('click', function () {
          if (up.kind === 'grammar' && window.LessonRun) {
            window.Shell.openOverlay();
            window.LessonRun.run(up.focus, function () { window.Shell.closeOverlay(); refresh('inicio'); });
          } else { window.App.go('session', 'diaria'); }
        });
        pair.appendChild(nb);
      }

      /* Same recommender as the Quick Play card, with the two things this
       * screen is already showing ruled out: the due count is in the strip
       * above, and the games card below headlines today's challenge. */
      var side = window.QuickPlay
        ? window.QuickPlay.pick({ skipReview: true, skipDaily: true }) : null;
      if (side) {
        var sb = UI.el('button', 'next-box alt'); sb.type = 'button';
        sb.innerHTML = '<span class="nb-eyebrow">' + T('Práctica', 'Practice') + '</span>' +
          '<b class="nb-title">' + side.label + '</b>' +
          '<span class="nb-sub">' + side.why + '</span>' +
          '<span class="nb-go">' + (side.cta || T('Empezar', 'Start')) + ' →</span>';
        sb.addEventListener('click', side.run);
        pair.appendChild(sb);
      }
      /* The line only speaks when the boxes cannot. With a "Next up" box on
       * screen, "the course comes back tomorrow" is both redundant and
       * slightly wrong — the box is offering tomorrow's lesson now. */
      if (pair.firstChild) {
        dc.appendChild(pair);
      } else {
        dc.appendChild(UI.el('p', 'done-next muted',
          due ? T('Lo de abajo no cuesta nada y cuenta igual.',
                  'What follows is short, and it still counts.')
              : T('El curso vuelve mañana con material nuevo.',
                  'The course comes back tomorrow with new material.')));
      }

      var redo = UI.el('button', 'linkish', T('Repetir la sesión de hoy', 'Do today\'s session again'));
      redo.type = 'button';
      redo.addEventListener('click', function () { window.App.go('session', 'diaria'); });
      dc.appendChild(redo);
      host.appendChild(dc);
    } else {

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

      /* A running theme focus belongs here and not only in Practicar. It is a
       * standing choice that changes what the next fortnight is made of, and a
       * setting you cannot see from the screen you start your session on is a
       * setting you forget you made. The lesson line sits directly above it,
       * which is also the clearest possible statement that the focus did not
       * replace it. */
      var F = window.Focus, fx = F && F.get();
      if (fx) {
        var fRow = UI.el('div', 'today-focus theme-focus');
        fRow.appendChild(UI.el('span', 'tf-label', T('Enfoque', 'Focus')));
        var v = UI.el('span', 'tf-value', F.label());
        v.appendChild(UI.el('span', 'tf-left',
          ' · ' + fx.left + T(fx.left === 1 ? ' sesión' : ' sesiones',
                              fx.left === 1 ? ' session' : ' sessions')));
        fRow.appendChild(v);
        card.appendChild(fRow);
      }
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
    }

    /* Two minutes, chosen for you — the answer to the question the session
     * card cannot answer: what if I do not have fifteen minutes? Only when
     * there is a session still to take. Once it is done the Practice box on
     * the card above is the same recommender saying the same thing, and two
     * of them a centimetre apart is just noise. */
    if (!doneToday && window.QuickPlay && window.QuickPlay.card) {
      var qp = window.QuickPlay.card();
      if (qp) host.appendChild(qp);
    }

    /* Order on this screen is an argument about what the learner should do
     * next. Today's session first, because that is the course. Then GAMES,
     * because five minutes against your own best is the thing somebody
     * actually opens the app for when they have not got twenty — it used to
     * sit at the very bottom under the error deck, which is the one place
     * nobody goes looking for something fun. Then the other session lengths,
     * then the mistakes, which matter but are nobody's idea of an invitation.
     * ---------------------------------------------------------------------- */
    /* Every third day, a short retrieval round on the tenses already taught.
     * Above the games card because it is the thing that is only here today. */
    if (window.Games && window.Games.tenseCheckCard) {
      var tcc = window.Games.tenseCheckCard(function () {
        window.Shell.closeOverlay(); window.Shell.go('inicio');
      });
      if (tcc) host.appendChild(tcc);
    }

    if (window.Games && window.Games.homeCard) {
      host.appendChild(window.Games.homeCard(function () {
        window.Shell.closeOverlay(); window.Shell.go('inicio');
      }));
    }

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
    // the only thing left in here is the mistake deck, so with no mistakes
    // there is nothing to append — an empty block would just add a gap
    if (extras.firstChild) host.appendChild(extras);
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
      case 'jugar':     window.Games.renderTab(host); break;
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
