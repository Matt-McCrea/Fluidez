/* ============================================================================
 * ARCADE — the games-only build (juegos/index.html): its board, its numbers.
 *
 * The full app opens on a hub, loads 7.5 MB and routes through js/shell.js.
 * None of that is wanted when somebody has ninety seconds: the point of a
 * separate build is that tapping the icon puts a question on screen, and
 * everything between the tap and the question is the product.
 *
 * This file is the arcade's entire application layer, and it does four things.
 *
 *   1. DRAWS ITS OWN BOARD. It does not reuse Games.render(), which is the
 *      list as it appears inside the app — a tab among five, styled to match a
 *      study tool. Here the shelf IS the app, so it gets a scoreboard: the
 *      streak, today's challenge, and six tiles whose loudest element is the
 *      record you are about to try to beat.
 *   2. SHOWS THE NUMBERS. js/gamescore.js now records how each round actually
 *      went — items dealt, items right, how long it ran — and this is where
 *      that surfaces. Score alone cannot answer "am I getting better?",
 *      because it moves with the difficulty you were dealt.
 *   3. STANDS IN FOR THE SHELL. js/games.js calls Shell.openOverlay/go/refresh
 *      to move between the tab bar and a full-screen round. There is no tab
 *      bar and nowhere else to go, so those become "show the board". A shim
 *      rather than a change to games.js, deliberately: the games files are
 *      shared between the two builds, and the day they fork is the day the
 *      arcade quietly stops matching the app.
 *   4. Registers its own service worker, scoped to this directory.
 *
 * SHARED STATE IS THE POINT. Same origin means the same localStorage: the SRS,
 * the error log, the level and the personal bests are the app's own. A round
 * played here grades cards the daily session will not then ask for, and a word
 * missed here is in Tus errores tomorrow morning. Two apps, one learner's
 * memory — which only works because nothing here keeps a second copy.
 * ========================================================================== */
(function () {
  var UI = window.UI, GS = window.GameScore, G = window.Games;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function host() { return document.getElementById('stage-host'); }

  // 8 420 rather than 8420: a four-digit score is read as a quantity, and the
  // thin space is what makes it one at a glance.
  function num(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* ---- sparkline ---------------------------------------------------------
   * The last twenty scores, as a shape. Not a chart — there are no axes and
   * no labels, because at tile size they would be illegible and the only
   * question it answers is "is the line going up". The most recent point is
   * marked, since that is the one the next round replaces. */
  function spark(scores, hue, w, h) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('class', 'arc-spark');
    svg.setAttribute('aria-hidden', 'true');
    var pts = (scores || []).slice(-20);
    if (pts.length < 2) return svg;
    var max = Math.max.apply(null, pts), min = Math.min.apply(null, pts);
    var span = Math.max(1, max - min);
    var pad = 2;
    var xy = pts.map(function (s, i) {
      return [pad + (w - pad * 2) * (pts.length === 1 ? 0 : i / (pts.length - 1)),
              pad + (h - pad * 2) * (1 - (s - min) / span)];
    });
    var d = xy.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', hue);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('opacity', '.85');
    svg.appendChild(path);
    var last = xy[xy.length - 1];
    var dot = document.createElementNS(svg.namespaceURI, 'circle');
    dot.setAttribute('cx', last[0].toFixed(1));
    dot.setAttribute('cy', last[1].toFixed(1));
    dot.setAttribute('r', '2.6');
    dot.setAttribute('fill', hue);
    svg.appendChild(dot);
    return svg;
  }

  /* ---- the arcade's OWN focus -------------------------------------------
   * Not the app's. The daily session picks a focus from the course and the
   * lesson ladder, and the arcade cannot see any of that — nor should it, if
   * opening the arcade is meant to be a decision of its own. So the player
   * chooses here, it persists here, and it does not touch anything the app
   * reads.
   *
   * It does two different jobs depending on what the game can honour:
   *   · Verbos takes a HARD lock (cfg.lockTense) — every question in that
   *     tense, which is what you want after a lesson on it.
   *   · Everything else takes a BIAS, through GameItems.setFocus: given a few
   *     equally good candidates, prefer the one on this topic. Never a filter,
   *     because a translation round that could only deal sentences containing
   *     the imperfect would run out of sentences and start repeating. */
  var AKEY = 'fluidez.arcade';
  function loadArc() { try { return JSON.parse(localStorage.getItem(AKEY)) || {}; } catch (e) { return {}; } }
  function saveArc(o) { try { localStorage.setItem(AKEY, JSON.stringify(o)); } catch (e) {} }
  function currentFocus() { var a = loadArc(); return a.focus || null; }
  function setArcFocus(f) { var a = loadArc(); a.focus = f || null; saveArc(a); applyFocus(); }

  function tenseLabel(k) {
    return (window.ENGINE && window.ENGINE.TENSE_LABEL && window.ENGINE.TENSE_LABEL[k]) || k;
  }
  function focusLabel(f) {
    if (!f) return 'Todo';
    if (f.kind === 'tense') return tenseLabel(f.tense);
    if (f.kind === 'weak') return 'Mis fallos';
    return 'Todo';
  }
  // Push the choice into the item generator. Called on load and on every change,
  // so a round started from anywhere is already pointed the right way.
  function applyFocus() {
    if (!window.GameItems) return;
    var f = currentFocus();
    if (f && f.kind === 'tense') window.GameItems.setFocus({ type: 'grammar', id: f.tense, tense: f.tense });
    else window.GameItems.setFocus(null);
  }

  /* The topic behind the most logged misses, when one stands out. The error
   * log is the app's own — a word missed in yesterday's session is a candidate
   * here, which is the point of sharing the store. */
  function weakTopic() {
    if (!window.ErrorLog) return null;
    var n = {}, best = null;
    try { window.ErrorLog.cards().forEach(function (c) { if (c.topic) n[c.topic] = (n[c.topic] || 0) + 1; }); }
    catch (e) { return null; }
    Object.keys(n).forEach(function (k) { if (!best || n[k] > best.n) best = { key: k, n: n[k] }; });
    return best && best.n >= 3 ? best : null;
  }

  /* ---- the level ---------------------------------------------------------
   * The arcade had no way to set this, and without it a browser that has
   * never opened the full app is stuck at A1 for ever: the band defaults to
   * A1, and at A1 the tense list is gated to what the COURSE has taught,
   * which for a learner with no history is the present and nothing else. That
   * is right inside a course and wrong in a standalone arcade, where the
   * whole proposition is ninety seconds at your own level.
   *
   * It writes fluidez.profile — the same key the app uses, on purpose. This
   * is not an arcade preference, it is your level, and having two of them
   * that disagreed would be worse than having none here at all. */
  function levelPicker() {
    pushView('level');
    var h = host();
    clear(h);
    var wrap = el('div', 'arc-stats');
    var top = el('div', 'arc-stats-top');
    var back = el('button', 'arc-back', '←');
    back.type = 'button';
    back.addEventListener('click', goBack);
    top.appendChild(back);
    top.appendChild(el('h2', null, 'Tu nivel'));
    wrap.appendChild(top);
    wrap.appendChild(el('p', 'arc-sub',
      'Decide en qué banda empiezan las rondas y hasta dónde pueden subir. Es el mismo nivel que usa Fluidez.'));

    var list = el('div', 'arc-picks');
    var cur = window.Profile ? window.Profile.current() : 'A1';
    (window.Profile ? window.Profile.all() : []).forEach(function (pr) {
      var b = el('button', 'arc-pick' + (pr.name === cur ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('b', null, pr.label));
      b.appendChild(el('span', null, pr.name === cur ? 'tu nivel ahora' : ''));
      b.addEventListener('click', function () {
        window.Profile.set(pr.name);
        document.documentElement.setAttribute('data-level', pr.name);
        goBack();
      });
      list.appendChild(b);
    });
    wrap.appendChild(list);
    h.appendChild(wrap);
  }

  function focusPicker() {
    pushView('focus');
    var h = host();
    clear(h);
    var wrap = el('div', 'arc-stats');
    var top = el('div', 'arc-stats-top');
    var back = el('button', 'arc-back', '←');
    back.type = 'button';
    back.addEventListener('click', goBack);
    top.appendChild(back);
    top.appendChild(el('h2', null, 'Enfoque'));
    wrap.appendChild(top);
    wrap.appendChild(el('p', 'arc-sub',
      'Verbos se bloquea en el tiempo que elijas. Los demás juegos lo prefieren cuando pueden.'));

    var list = el('div', 'arc-picks');
    function pick(label, note, f, on) {
      var b = el('button', 'arc-pick' + (on ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('b', null, label));
      if (note) b.appendChild(el('span', null, note));
      // Choosing is also leaving: pop the panel rather than stacking a board
      // entry on top of it, or one back press would return to the picker.
      b.addEventListener('click', function () { setArcFocus(f); goBack(); });
      list.appendChild(b);
    }
    var cur = currentFocus();
    pick('Todo', 'sin preferencia', null, !cur);
    var wk = weakTopic();
    if (wk) {
      pick('Mis fallos', wk.n + ' fallos en ' + (window.Games.topicLabel ? window.Games.topicLabel(wk.key) : wk.key),
           { kind: 'weak', topic: wk.key }, !!(cur && cur.kind === 'weak'));
    }
    /* Taught first, then the rest. Profile.tenses() is what the COURSE has
     * reached, and at A1/A2 that is the present alone — the right answer for
     * a lesson, the wrong one here. Deliberately choosing to drill the
     * imperfect subjunctive before the course gets there is a legitimate thing
     * to want from a practice tool, and the locked round honours it (opts.tense
     * overrides the allowed set in GameItems.verbItem). Keeping them in a
     * separate group means the offer is still honest about where you are. */
    var taught = (window.Profile && window.Profile.tenses) ? window.Profile.tenses() : [];
    var all = (window.ENGINE && window.ENGINE.TENSES)
      ? window.ENGINE.TENSES.map(function (t) { return t.key; }) : taught;
    taught.forEach(function (t) {
      pick(tenseLabel(t), null, { kind: 'tense', tense: t },
           !!(cur && cur.kind === 'tense' && cur.tense === t));
    });
    var rest = all.filter(function (t) { return taught.indexOf(t) === -1; });
    wrap.appendChild(list);
    if (rest.length) {
      wrap.appendChild(el('div', 'arc-group', 'Todavía no los has estudiado'));
      var more = el('div', 'arc-picks');
      var list0 = list;
      list = more;
      rest.forEach(function (t) {
        pick(tenseLabel(t), null, { kind: 'tense', tense: t },
             !!(cur && cur.kind === 'tense' && cur.tense === t));
      });
      list = list0;
      wrap.appendChild(more);
    }
    h.appendChild(wrap);
  }

  function playable(g) {
    if (!g.needsVoice) return true;
    if (GS.silent()) return false;
    return !!(window.Speak && window.Speak.available());
  }

  /* ---- the board --------------------------------------------------------- */
  /* ---- navigation --------------------------------------------------------
   * Three panels and a round sit on top of one board, and every one of them
   * needs a way back that lands somewhere a person expects. Two rules:
   *
   *   Every ← goes to the board, never to "whatever was there before". There
   *   is only one place to be when you are not in a panel.
   *
   *   THE PHONE'S OWN BACK BUTTON COUNTS. This is installed to a home screen
   *   and opened full-screen, where the system back gesture is the only
   *   navigation the OS offers. Without a history entry it closed the app from
   *   inside a stats panel, which reads as a crash. Each panel pushes one
   *   entry; back pops it and the board comes home.
   *
   * A round is the exception worth explaining: the back gesture cannot just
   * redraw the board, because the round's animation frame and its clock are
   * still running and would go on to record a round nobody finished. So it
   * presses the round's own ✕ instead — the one path that stops the clock and
   * files nothing. */
  var VIEW = 'board';
  function pushView(v) {
    VIEW = v;
    try { history.pushState({ arc: v }, ''); } catch (e) {}
  }
  function goBack() {
    if (VIEW === 'board') { board(); return; }
    try { history.back(); } catch (e) { board(); }
  }
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('popstate', function () {
      if (VIEW === 'round') {
        var x = document.querySelector && document.querySelector('.g-exit');
        if (x) { x.click(); return; }                 // stop() + onExit -> board
      }
      board();
    });
  }

  function board() {
    VIEW = 'board';
    var h = host();
    if (!h) return;                                  // nothing to draw into
    if (!G) { fail('No se han cargado los juegos', 'js/games.js no está disponible.'); return; }
    clear(h);
    var wrap = el('div', 'arc');

    var top = el('div', 'arc-top');
    top.appendChild(el('div', 'arc-brand', 'Juegos'));
    var lvl = el('button', 'arc-level');
    lvl.type = 'button';
    lvl.textContent = (window.Profile ? window.Profile.current() : 'A1') + ' ▾';
    lvl.setAttribute('aria-label', 'Cambiar de nivel');
    lvl.addEventListener('click', levelPicker);

    var streak = GS.dailyStreak();
    // Never shown at zero — see the note on dailyStreak in js/gamescore.js: a
    // number that appears once you have one is an observation; a number that
    // warns you about losing it is a debt.
    if (streak > 0) top.appendChild(el('div', 'arc-streak', '🔥 ' + streak + (streak === 1 ? ' día' : ' días')));
    top.appendChild(lvl);
    wrap.appendChild(top);

    // today's challenge
    var dailyKey = GS.dailyKey();
    var playedToday = GS.todayBest(dailyKey);
    var daily = el('button', 'arc-daily');
    daily.type = 'button';
    daily.appendChild(el('span', 'arc-daily-k', 'Reto de hoy'));
    daily.appendChild(el('span', 'arc-daily-t', GS.dailyLabel()));
    daily.appendChild(el('span', 'arc-daily-s', playedToday
      ? 'Hoy: ' + num(playedToday) + '  ·  récord ' + num(GS.pb(dailyKey))
      : 'Mixto · 90 s · el mismo para todos, hasta medianoche'));
    daily.addEventListener('click', function () { G.open(dailyKey, board); });
    wrap.appendChild(daily);

    // the focus chip: what this arcade is pointed at, and the way to change it
    var f = currentFocus();
    var chip = el('button', 'arc-focus' + (f ? ' on' : ''));
    chip.type = 'button';
    chip.appendChild(el('span', 'arc-focus-k', 'Enfoque'));
    chip.appendChild(el('b', null, focusLabel(f)));
    chip.appendChild(el('span', 'arc-focus-x', '▾'));
    chip.addEventListener('click', focusPicker);
    wrap.appendChild(chip);

    // the shelf
    var grid = el('div', 'arc-grid');
    G.GAMES.forEach(function (g) {
      var p = GS.profileOf(g.key);
      var tile = el('button', 'arc-tile');
      tile.type = 'button';
      tile.style.setProperty('--g', g.hue);
      var ok = playable(g);
      if (!ok) tile.disabled = true;

      tile.appendChild(el('span', 'arc-ico', g.icon));
      tile.appendChild(el('span', 'arc-name', g.name));
      tile.appendChild(el('span', 'arc-rule', ok ? g.rule : 'sin voz en este dispositivo'));

      var pb = el('span', 'arc-pb' + (p.pb ? '' : ' none'), p.pb ? num(p.pb) : 'sin récord');
      tile.appendChild(pb);
      if (p.pb) tile.appendChild(el('span', 'arc-pb-k', 'récord'));
      if (p.scores.length > 1) tile.appendChild(spark(p.scores, g.hue, 120, 20));

      if (ok) tile.addEventListener('click', function () { play(g); });

      // The numbers, behind their own control so a tap on the tile always
      // means "play" — the one thing this screen must never make ambiguous.
      if (p.plays) {
        var data = el('button', 'arc-data', '≡');
        data.type = 'button';
        data.setAttribute('aria-label', 'Datos de ' + g.name);
        data.addEventListener('click', function (e) { e.stopPropagation(); stats(g); });
        tile.appendChild(data);
      }
      grid.appendChild(tile);
    });
    wrap.appendChild(grid);

    var foot = el('div', 'arc-foot');
    foot.textContent = 'Tu nivel y tu memoria son los mismos que en Fluidez: lo que aciertas aquí cuenta allí.';
    wrap.appendChild(foot);

    h.appendChild(wrap);
  }

  /* Start a game with the arcade's focus honoured as far as that game can:
   * Verbos locks to the tense, a weak-spot focus routes to the round built
   * from exactly those misses, everything else plays normally with the bias
   * already set by applyFocus(). */
  function play(g) {
    pushView('round');
    var f = currentFocus();
    if (f && f.kind === 'weak' && G.openWeak) {
      G.openWeak(f.topic, G.topicLabel ? G.topicLabel(f.topic) : 'Mis fallos');
      return;
    }
    if (f && f.kind === 'tense' && g.key === 'verbos' && G.openTense) {
      var r = G.openTense(f.tense, 'Conjugación · ' + tenseLabel(f.tense), board);
      if (r !== null) return;                    // null = the lock was refused
    }
    G.open(g.key, board);
  }

  /* ---- the numbers -------------------------------------------------------
   * Everything here is DERIVED from the round history, and anything with too
   * little evidence behind it shows a dash rather than a number. A figure
   * computed from two rounds is noise wearing a decimal point, and printing
   * it teaches people not to trust the screen. */
  function stats(g) {
    pushView('stats');
    var h = host();
    clear(h);
    var p = GS.profileOf(g.key);
    var wrap = el('div', 'arc-stats');

    var top = el('div', 'arc-stats-top');
    var back = el('button', 'arc-back', '←');
    back.type = 'button';
    back.setAttribute('aria-label', 'Volver');
    back.addEventListener('click', goBack);
    top.appendChild(back);
    top.appendChild(el('h2', null, g.name));
    wrap.appendChild(top);
    wrap.appendChild(el('p', 'arc-sub', g.rule + ' · ' + p.plays + (p.plays === 1 ? ' partida' : ' partidas')));

    var figs = el('div', 'arc-figs');
    function fig(k, v, note, gold) {
      var f = el('div', 'arc-fig' + (gold ? ' gold' : ''));
      f.appendChild(el('div', 'arc-fig-k', k));
      f.appendChild(el('div', 'arc-fig-v' + (v == null ? ' dim' : ''), v == null ? 'aún no' : v));
      if (note) f.appendChild(el('div', 'arc-fig-n', note));
      figs.appendChild(f);
    }
    fig('Récord', p.pb ? num(p.pb) : null, null, true);
    fig('Habitual', p.typical ? num(p.typical) : null, 'mediana de las últimas diez');
    fig('Aciertos', p.accuracy == null ? null : Math.round(p.accuracy * 100) + '%',
        p.recentAccuracy == null || p.accuracy == null ? 'hacen falta 20 respuestas'
          : 'últimas diez: ' + Math.round(p.recentAccuracy * 100) + '%');
    fig('Ritmo', p.perMin == null ? null : p.perMin.toFixed(1),
        p.perMin == null ? 'hacen falta tres partidas' : 'respuestas por minuto');
    fig('Mejor racha', p.bestRun || null, 'seguidas sin fallar');
    fig('Nivel alcanzado', p.bestBand, 'lo más difícil que has contestado bien');
    wrap.appendChild(figs);

    if (p.scores.length > 1) {
      var chart = el('div', 'arc-chart');
      chart.appendChild(el('h3', null, 'Últimas ' + Math.min(20, p.scores.length) + ' partidas'));
      chart.appendChild(spark(p.scores, g.hue, 300, 110));
      wrap.appendChild(chart);
    } else {
      wrap.appendChild(el('p', 'arc-empty', 'Juega unas cuantas veces y aquí aparecerá si estás mejorando.'));
    }

    h.appendChild(wrap);
  }

  /* ---- the shell games.js expects ---------------------------------------- */
  window.Shell = {
    openOverlay: function () {},      // the round already owns the whole screen
    closeOverlay: function () {},
    go: function () { board(); },     // 'jugar' and 'inicio' are both the board
    refresh: function () {}           // no other surface to keep in step
  };

  /* ---- never a blank screen ----------------------------------------------
   * This build showed one, and the cause is worth building a guard against
   * rather than just fixing. The ROOT service worker's scope is the whole
   * site, /juegos/ included, and it serves cache-first. So on the first load
   * after a release the browser can hand this page a MIXTURE: the new files
   * (js/arcade.js, css/arcade.css, data/game-index.js) were never in that
   * cache and arrive fresh, while js/gamescore.js and js/games.js are in it
   * and arrive stale. The new board then calls GameScore.profileOf, which the
   * old build has never heard of, and the exception leaves a dark page with
   * nothing on it and no way to tell what happened.
   *
   * A round of this app is ninety seconds on a phone with no devtools and
   * possibly no network. Whatever goes wrong has to say so ON THE PAGE. */
  var NEEDS = [
    ['GameScore', 'profileOf'], ['GameScore', 'hasGhost'], ['GameScore', 'ghostAt'],
    ['GameItems', 'next'], ['GameRound', 'run'], ['Games', 'GAMES']
  ];
  function missingParts() {
    return NEEDS.filter(function (n) {
      var mod = window[n[0]];
      return !mod || typeof mod[n[1]] === 'undefined';
    }).map(function (n) { return n[0] + '.' + n[1]; });
  }

  function fail(title, detail) {
    var h = host();
    if (!h) { document.body.appendChild(el('pre', null, title + '\n' + detail)); return; }
    clear(h);
    var w = el('div', 'arc');
    w.appendChild(el('div', 'arc-brand', 'Juegos'));
    var box = el('div', 'arc-fail');
    box.appendChild(el('b', null, title));
    box.appendChild(el('p', null, detail));
    /* WHAT THE LOADED BUILD ACTUALLY IS. js/perf.js carries a BUILD marker that
     * is a hash of the precached files, and the whole reason it exists is this
     * question: "did my fix even reach the device". Print it, and the arcade
     * worker's version beside it — if they disagree, the page is running a
     * mixture and the two numbers say so outright. */
    var marks = [];
    if (window.Perf && window.Perf.BUILD) marks.push('build ' + window.Perf.BUILD);
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      marks.push('sw ' + navigator.serviceWorker.controller.scriptURL.replace(/^.*\//, ''));
    } else {
      marks.push('sin service worker');
    }
    box.appendChild(el('code', 'arc-fail-build', marks.join('  ·  ')));

    var b = el('button', 'arc-back', 'Vaciar y recargar');
    b.type = 'button';
    b.addEventListener('click', function () {
      /* DELETING THE CACHES IS NOT ENOUGH, and the first version of this
       * button only did that. The worker stays REGISTERED and keeps
       * intercepting: it misses the cache it no longer has, fetches, and can
       * be answered from the browser's own HTTP cache with the same stale
       * file. Two workers are in play here as well — the root one, whose
       * scope covers this directory, and the arcade's own — so both have to
       * go. Unregister everything, drop every cache, then reload. */
      b.disabled = true;
      b.textContent = 'Vaciando…';
      var reload = function () { location.reload(); };
      var unreg = (navigator.serviceWorker && navigator.serviceWorker.getRegistrations)
        ? navigator.serviceWorker.getRegistrations().then(function (rs) {
            return Promise.all(rs.map(function (r) { return r.unregister(); }));
          })
        : Promise.resolve();
      unreg.then(function () {
        if (!window.caches || !caches.keys) return null;
        return caches.keys().then(function (names) {
          return Promise.all(names.map(function (n) { return caches.delete(n); }));
        });
      }).then(reload, reload);
    });
    box.appendChild(b);
    w.appendChild(box);
    h.appendChild(w);
  }

  function boot() {
    try {
      var missing = missingParts();
      if (missing.length) {
        fail('Versiones mezcladas',
             'El navegador ha servido archivos viejos desde la caché junto a los nuevos. ' +
             'Falta: ' + missing.join(', ') + '. Pulsa Recargar para vaciar la caché y volver a empezar.');
        return;
      }
      // The level accent is the APP's palette, and this build has its own. Only
      // the data-level attribute is wanted (games.css keys off nothing else);
      // css/arcade.css owns the colours.
      if (window.Profile && window.Profile.current) {
        document.documentElement.setAttribute('data-level', window.Profile.current());
      }
      applyFocus();
      // Leaving a round must come back to THIS board, not to the app's list.
      if (G && G.setListRenderer) G.setListRenderer(board);
      board();
    } catch (e) {
      fail('Algo ha fallado al abrir', (e && e.message ? e.message : String(e)) +
           '. Pulsa Recargar para vaciar la caché.');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  }
})();
