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
  /* THE SHELF, NOT THE WHOLE ARCADE. On 6 Nov the board was cut to a big Jugar
   * card and three tiles (Verbos, Palabras, Frases); the league, the daily
   * challenge, the study card, the focus chip and the other nine games are
   * hidden, not deleted. Setting window.arcadeFull = true before this file
   * loads brings that board back as it was, and the old tests run against it. */
  if (window.arcadeFull === undefined) window.arcadeFull = false;
  function FULL() { return window.arcadeFull === true; }
  function currentFocus() { if (!FULL()) return null; var a = loadArc(); return a.focus || null; }
  function setArcFocus(f) { var a = loadArc(); a.focus = f || null; saveArc(a); applyFocus(); }

  /* The Verbos bank's one tense the engine has no entry for (hubiera + participle). */
  function verbosTenses() {
    var keys = window.ENGINE.TENSES.map(function (t) { return t.key; });
    var i = keys.indexOf('perfsubj');
    keys.splice(i === -1 ? keys.length : i + 1, 0, 'pluscsubj');
    return keys;
  }
  function tenseLabel(k) {
    if (k === 'pluscsubj') return 'Pluscuamperfecto de subjuntivo';
    return (window.ENGINE && window.ENGINE.TENSE_LABEL && window.ENGINE.TENSE_LABEL[k]) || k;
  }
  function themeLabel(id) {
    if (id === 'basicas') return 'Básicas';
    var t = (window.THEMES || []).filter(function (x) { return x.id === id; })[0];
    return t ? (t.short || t.es || id) : id;
  }
  function focusLabel(f) {
    if (!f) return 'Todo';
    if (f.kind === 'tense') return tenseLabel(f.tense);
    if (f.kind === 'theme') return themeLabel(f.theme);
    if (f.kind === 'verbs') return 'Solo verbos';
    if (f.kind === 'weak') {
      var n = missCount('mixed');
      return n ? 'Mis fallos · ' + n : 'Mis fallos';
    }
    return 'Todo';
  }
  /* What a focus means to the round that is about to start. A tense biases
   * every game and locks Conjugación; a theme or a verbs-only choice is a real
   * filter and only Vocabulario can honour it, because it is the only pool
   * with a theme on every row. Returned as round config rather than applied
   * globally, so a focus cannot silently change a game it does not fit. */
  function roundExtras(g) {
    var f = currentFocus();
    if (!f || g.kind !== 'vocab') return null;
    if (f.kind === 'verbs') return { only: 'verbs' };
    if (f.kind === 'theme') return { theme: f.theme };
    return null;
  }
  // Push the choice into the item generator. Called on load and on every change,
  // so a round started from anywhere is already pointed the right way.
  function applyFocus() {
    if (!window.GameItems) return;
    var f = currentFocus();          // null unless the full board is on
    if (f && f.kind === 'tense') window.GameItems.setFocus({ type: 'grammar', id: f.tense, tense: f.tense });
    else window.GameItems.setFocus(null);
  }

  /* HOW MANY OF YOUR OWN MISTAKES THIS GAME COULD ASK YOU ABOUT.
   *
   * "Mis fallos" used to mean something else: it found the TOPIC behind your
   * most frequent misses, needed three of them to agree, and then ran a
   * grammar round on that topic (Games.openWeak, kind 'grammar'). So it was
   * not your mistakes, it was a subject you had been bad at — and for a
   * vocabulary player it never appeared at all.
   *
   * It now means what it says: every question comes from your error log. The
   * machinery already exists — a round dealt from a fixed deck is what the
   * study pack uses — so this is missDeck() into cfg.deck and nothing new. */
  function missCount(kind) {
    if (!window.GameItems || !window.GameItems.missDeck) return 0;
    try { return window.GameItems.missDeck(kind, 999).length; } catch (e) { return 0; }
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
    wrap.appendChild(el('p', 'arc-foot',
      'Frecuencias: FrequencyWords (OpenSubtitles 2018), CC BY-SA 4.0'));
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
      'Un tiempo verbal bloquea Conjugación y orienta los demás juegos. Un tema o ' +
      '“solo verbos” filtran Vocabulario, que es el único juego que puede hacerlo.'));

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
    pick('Solo verbos', '1.166 verbos, solo su significado',
         { kind: 'verbs' }, !!(cur && cur.kind === 'verbs'));
    var total = missCount('mixed');
    if (total) {
      pick('Mis fallos', 'todas las preguntas salen de tus ' + total +
           (total === 1 ? ' fallo' : ' fallos'),
           { kind: 'weak' }, !!(cur && cur.kind === 'weak'));
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
      list = more;
      rest.forEach(function (t) {
        pick(tenseLabel(t), null, { kind: 'tense', tense: t },
             !!(cur && cur.kind === 'tense' && cur.tense === t));
      });
      wrap.appendChild(more);
    }

    /* Themes. Only Vocabulario can act on one — it is the only pool with a
     * theme on every row — and the heading says so rather than leaving you to
     * discover it by playing Traducción and noticing nothing changed. */
    var themes = window.THEMES || [];
    if (themes.length) {
      wrap.appendChild(el('div', 'arc-group', 'Temas · solo en Vocabulario'));
      var tl = el('div', 'arc-picks');
      list = tl;
      themes.forEach(function (t) {
        pick(t.short || t.es || t.id, t.en || null, { kind: 'theme', theme: t.id },
             !!(cur && cur.kind === 'theme' && cur.theme === t.id));
      });
      wrap.appendChild(tl);
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
  var UPDATE_READY = false;                 // a new version has taken over; reload at the next board
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
    if (UPDATE_READY) { location.reload(); return; }
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

    // the league: the one number here that somebody else can beat
    if (FULL() && window.Liga) wrap.appendChild(window.Liga.card({ before: function () { pushView('round'); } }));

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
    if (FULL()) wrap.appendChild(daily);

    /* THE DAY'S PACK, above the games. It sits here rather than among the tiles
     * because it is not one: no clock, no score, no record to beat. The tiles
     * are things you play against yourself and this is the thing you do first.
     *
     * Shown as done rather than hidden once finished — hiding it would leave
     * the board looking like it had lost a feature, and the state is worth
     * seeing. */
    var packed = FULL() && window.Study ? window.Study.pack() : [];
    if (packed.length) {
      var done = window.Study.doneToday();
      var st = el('button', 'arc-study' + (done ? ' done' : ''));
      st.type = 'button';
      st.appendChild(el('span', 'arc-study-k', done ? 'Hecho hoy' : 'Hoy'));
      st.appendChild(el('b', null, packed.length + (packed.length === 1 ? ' palabra' : ' palabras')));
      var fallos = packed.filter(function (c) { return c.source === 'fallo'; }).length;
      st.appendChild(el('span', 'arc-study-s',
        fallos ? fallos + (fallos === 1 ? ' que fallaste' : ' que fallaste') + ', y lo que toca hoy'
               : 'Apréndelas y luego juégalas'));
      st.addEventListener('click', study);
      wrap.appendChild(st);
    }

    // the focus chip: what this arcade is pointed at, and the way to change it
    var f = currentFocus();
    var chip = el('button', 'arc-focus' + (f ? ' on' : ''));
    chip.type = 'button';
    chip.appendChild(el('span', 'arc-focus-k', 'Enfoque'));
    chip.appendChild(el('b', null, focusLabel(f)));
    chip.appendChild(el('span', 'arc-focus-x', '▾'));
    chip.addEventListener('click', focusPicker);
    if (FULL()) wrap.appendChild(chip);

    // JUGAR: the one big button. It deals the mix; the three tiles below are
    // the same cards one kind at a time.
    if (!FULL()) {
      var jg = G.GAMES.filter(function (g) { return g.key === 'jugar'; })[0];
      if (jg) wrap.appendChild(jugarCard(jg));
      if (window.TenseCheck && window.TenseCheck.due()) wrap.appendChild(checkCard());
    }

    // the shelf
    var grid = el('div', 'arc-grid');
    var shelf = G.GAMES.filter(function (g) { return FULL() ? !g.shelf : (g.shelf && g.key !== 'jugar'); });
    // Verbos, Palabras, Frases, in that order, which is the order of the goal
    shelf.forEach(function (g) {
      var mk = shelfStats(g);
      var p = mk.p;
      var tile = el('button', 'arc-tile');
      tile.type = 'button';
      tile.style.setProperty('--g', g.hue);
      var ok = playable(g);
      if (!ok) tile.disabled = true;

      /* Under a "mis fallos" focus a tile with no misses of its kind would
       * silently deal an ordinary round, which looks like the setting being
       * ignored. Say so on the tile instead, and take it out of play. */
      var weak = currentFocus() && currentFocus().kind === 'weak';
      var mine = weak ? missCount(g.kind) : 0;
      if (weak && !mine) { tile.disabled = true; ok = false; }

      tile.appendChild(el('span', 'arc-ico', g.icon));
      tile.appendChild(el('span', 'arc-name', g.name));
      tile.appendChild(el('span', 'arc-rule',
        !ok && g.needsVoice ? 'sin voz en este dispositivo'
        : weak ? (mine ? mine + (mine === 1 ? ' fallo tuyo' : ' fallos tuyos') : 'ningún fallo aquí')
        : g.rule));

      var pb = el('span', 'arc-pb' + (p.pb ? '' : ' none'), p.pb ? num(p.pb) : 'sin récord');
      tile.appendChild(pb);
      if (p.pb) tile.appendChild(el('span', 'arc-pb-k', mk.label ? 'récord · ' + mk.label : 'récord'));
      if (p.scores.length > 1) tile.appendChild(spark(p.scores, g.hue, 120, 20));

      if (ok) tile.addEventListener('click', function () { if (g.shelf) sheet(g); else play(g); });

      // The numbers, behind their own control so a tap on the tile always
      // means "play" — the one thing this screen must never make ambiguous.
      if (p.plays) {
        var data = el('button', 'arc-data', '≡');
        data.type = 'button';
        data.setAttribute('aria-label', 'Datos de ' + g.name);
        data.addEventListener('click', function (e) { e.stopPropagation(); stats(mk.g); });
        tile.appendChild(data);
      }
      grid.appendChild(tile);
    });
    wrap.appendChild(grid);
    if (!FULL() && window.TenseCheck) wrap.appendChild(progressPanel());

    var foot = el('div', 'arc-foot');
    foot.textContent = 'Tu nivel y tu memoria son los mismos que en Fluidez: lo que aciertas aquí cuenta allí.';
    wrap.appendChild(foot);

    h.appendChild(wrap);
  }

  /* ---- the shelf: records per shape, the Jugar card, the sheet ----------
   * Each game keeps two records, `<key>:c` (Contrarreloj) and `<key>:t`
   * (Tranquilo), because a score from ten untimed questions and a score from
   * sixty seconds against a clock are different claims. The tile shows the
   * clock record when there is one, since that is the one with a ghost, and
   * says which it is showing. The old games have one record under their key. */
  function modeKey(g, m) { return g.key + ':' + m; }
  function shelfStats(g) {
    if (!g.shelf) return { p: GS.profileOf(g.key), g: g, label: null };
    var pc = GS.profileOf(modeKey(g, 'c')), pt = GS.profileOf(modeKey(g, 't'));
    var useT = !pc.plays && pt.plays;
    var p = useT ? pt : pc;
    // plays are the two shapes together, so the stats control appears for either
    p = Object.assign({}, p, { plays: pc.plays + pt.plays });
    var sg = { key: modeKey(g, useT ? 't' : 'c'), name: g.name, rule: g.rule, hue: g.hue };
    return { p: p, g: sg, label: p.pb ? (useT ? '10' : '60 s') : null };
  }

  function jugarCard(g) {
    var mk = shelfStats(g);
    var c = el('button', 'arc-jugar');
    c.type = 'button';
    c.style.setProperty('--g', g.hue);
    c.appendChild(el('span', 'arc-jugar-k', 'Jugar'));
    c.appendChild(el('span', 'arc-jugar-t', 'Un poco de todo'));
    c.appendChild(el('span', 'arc-jugar-s', mk.p.pb
      ? 'récord ' + num(mk.p.pb) + ' · ' + mk.label
      : 'Verbos, palabras y frases'));
    c.addEventListener('click', function () { sheet(g); });
    return c;
  }

  /* What the player last chose, kept here (fluidez.arcade), never in the app's
   * own keys. Both are optional: no tenses means "all of your level". */
  function lastMode() { var a = loadArc(); return a.mode === 't' || a.mode === 'c' ? a.mode : 'c'; }
  function chosenTenses() {
    var a = loadArc(), ts = a.tenses;
    if (!ts || !ts.length || !window.ENGINE) return [];
    var known = verbosTenses();
    return ts.filter(function (t) { return known.indexOf(t) !== -1; });
  }
  function saveTenses(ts) { var a = loadArc(); a.tenses = ts; saveArc(a); }
  /* Palabras: "" is the whole ranked list, otherwise one theme that has words. */
  function chosenWordTheme() {
    var a = loadArc(), id = a.wtheme;
    if (!id || !window.GameItems || !window.GameItems.grindThemes) return '';
    return window.GameItems.grindThemes().some(function (t) { return t.id === id; }) ? id : '';
  }
  function saveWordTheme(id) { var a = loadArc(); a.wtheme = id || ''; saveArc(a); }
  /* The Frases sheet's topic focus (multi-select; empty means all topics). Its own key: `focus` is the full board's. */
  function chosenFocus() { var f = loadArc().pfocus; return Array.isArray(f) ? f.slice() : []; }
  function saveFocus(f) { var a = loadArc(); a.pfocus = f; saveArc(a); }
  /* Mis frases: the learner's own list of phrase ids. As a topic it is 'mine' in pfocus,
   * and it reaches the round as 'id:<phrase id>' entries in the themes array. */
  function myPhrases() { var m = loadArc().pmine; return Array.isArray(m) ? m.slice() : []; }
  function saveMine(m) { var a = loadArc(); a.pmine = m; saveArc(a); }
  function focusThemes(f) {
    var out = [];
    (f || []).forEach(function (t) {
      if (t === 'mine') myPhrases().forEach(function (id) { out.push('id:' + id); });
      else out.push(t);
    });
    return out;
  }

  /* THE SHEET. Tapping a tile does not start a round, it asks which kind: ten
   * questions with no clock for a few stops on a bus, or sixty seconds against
   * the record. Verbos adds its tense picker, because the useful question for a
   * verb drill is "which tense", and the answer should survive to next time. */
  function sheet(g, noPush) {
    if (noPush) VIEW = 'sheet'; else pushView('sheet');
    var h = host();
    clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.style.setProperty('--g', g.hue);
    var top = el('div', 'arc-stats-top');
    var back = el('button', 'arc-back', '←');
    back.type = 'button';
    back.setAttribute('aria-label', 'Volver');
    back.addEventListener('click', goBack);
    top.appendChild(back);
    top.appendChild(el('h2', null, g.name));
    wrap.appendChild(top);
    wrap.appendChild(el('p', 'arc-sub', g.blurb || g.rule));

    if (g.key === 'verbos2' && window.ENGINE && window.ENGINE.TENSES) {
      wrap.appendChild(el('div', 'arc-group', 'Tiempos'));
      var chips = el('div', 'arc-chips');
      var sel = chosenTenses();
      var all = el('button', 'arc-chip', 'Todos los de tu nivel');
      all.type = 'button';
      var byKey = {};
      function paint() {
        all.classList.toggle('on', !sel.length);
        Object.keys(byKey).forEach(function (k) { byKey[k].classList.toggle('on', sel.indexOf(k) !== -1); });
      }
      all.addEventListener('click', function () { sel = []; saveTenses(sel); paint(); });
      chips.appendChild(all);
      verbosTenses().forEach(function (tkey) {
        var b = el('button', 'arc-chip', tenseLabel(tkey));
        b.type = 'button';
        b.addEventListener('click', function () {
          var i = sel.indexOf(tkey);
          if (i === -1) sel.push(tkey); else sel.splice(i, 1);
          saveTenses(sel); paint();
        });
        byKey[tkey] = b;
        if (hasCard(tkey)) {
          var cw = el('span', 'arc-chipwrap');
          var q = el('button', 'arc-chipq', '?');
          q.type = 'button';
          q.setAttribute('aria-label', 'Ficha de ' + tenseLabel(tkey));
          q.addEventListener('click', function () { tenseCard(tkey); });
          cw.appendChild(b); cw.appendChild(q);
          chips.appendChild(cw);
        } else chips.appendChild(b);
      });
      paint();
      wrap.appendChild(chips);
    }

    if (g.key === 'frases' && window.GameItems && window.GameItems.phraseCoverage) {
      var pfocus = chosenFocus(), pcovLine = el('div', 'arc-progress-all');
      wrap.appendChild(el('div', 'arc-progress', null)).appendChild(pcovLine);
      function paintCov() { pcovLine.textContent = window.GameItems.phraseCoverage(focusThemes(pfocus)).text; }
      paintCov();
      var fbox = el('div', 'cv-sheet');
      function paintConvos() {
        clear(fbox);
        if (window.ESConvo) window.ESConvo.section(fbox, pfocus.filter(function (t) { return t !== 'mine'; }), function () { sheet(g, true); }, function (v) { VIEW = v; });
      }
      var fthemes = Object.keys(window.GameItems.phraseList().byTheme)
        .sort(function (a, b) { return themeLabel(a) < themeLabel(b) ? -1 : themeLabel(a) > themeLabel(b) ? 1 : 0; });
      if (fthemes.length > 1) {
        wrap.appendChild(el('div', 'arc-group', 'Temas'));
        var fchips = el('div', 'arc-chips arc-focus-chips'), fby = {};
        var fall = el('button', 'arc-chip', 'Todos los temas');
        fall.type = 'button';
        function paintF() {
          fall.classList.toggle('on', !pfocus.length);
          Object.keys(fby).forEach(function (k) { fby[k].classList.toggle('on', pfocus.indexOf(k) !== -1); });
        }
        fall.addEventListener('click', function () { pfocus = []; saveFocus(pfocus); paintF(); paintCov(); paintConvos(); });
        fchips.appendChild(fall);
        var mine = myPhrases();
        if (mine.length) fthemes.unshift('mine');
        fthemes.forEach(function (t) {
          var fb = el('button', 'arc-chip', t === 'mine' ? 'Mis frases (' + mine.length + ')' : themeLabel(t));
          fb.type = 'button';
          fb.addEventListener('click', function () {
            var i = pfocus.indexOf(t);
            if (i === -1) pfocus.push(t); else pfocus.splice(i, 1);
            saveFocus(pfocus); paintF(); paintCov(); paintConvos();
          });
          fby[t] = fb;
          fchips.appendChild(fb);
        });
        paintF();
        wrap.appendChild(fchips);
      }
      var kb = el('button', 'arc-wtbtn', 'Marca las frases que ya conoces');
      kb.type = 'button';
      kb.addEventListener('click', function () { knownScreen(g); });
      var mb = el('button', 'arc-wtbtn', 'Elige tus frases');
      mb.type = 'button';
      mb.addEventListener('click', function () { knownScreen(g, true); });
      wrap.appendChild(mb);
      wrap.appendChild(kb);
      paintConvos();
      wrap.appendChild(fbox);
    }

    if (g.key === 'palabras' && window.GameItems && window.GameItems.coverage) {
      var GI2 = window.GameItems, wt = chosenWordTheme();
      var prog = el('div', 'arc-progress');
      function paintProgress() {
        clear(prog);
        var cv = GI2.coverage(wt || null);
        prog.appendChild(el('div', 'arc-progress-all', cv.text));
        if (cv.theme) prog.appendChild(el('div', 'arc-progress-theme', cv.theme.text));
      }
      paintProgress();
      wrap.appendChild(prog);
      var tb = el('button', 'arc-wtbtn', '¿Ya sabes español? Marca las que conoces');
      tb.type = 'button';
      tb.addEventListener('click', function () { wordTest(g); });
      wrap.appendChild(tb);
      wrap.appendChild(el('p', 'arc-sub arc-wtsub', 'Escribe cada palabra, sin parar y sin reloj. Las que aciertas no vuelven a preguntarse nunca.'));
      wrap.appendChild(el('div', 'arc-group', 'Tema'));
      var tchips = el('div', 'arc-chips'), tby = {};
      function paintT() {
        Object.keys(tby).forEach(function (k) { tby[k].classList.toggle('on', k === (wt || '')); });
      }
      function tchip(id, label) {
        var b = el('button', 'arc-chip', label);
        b.type = 'button';
        b.addEventListener('click', function () { wt = id; saveWordTheme(id); paintT(); paintProgress(); });
        tby[id] = b;
        tchips.appendChild(b);
      }
      tchip('', 'Las más comunes');
      GI2.grindThemes().sort(function (a, b) { return a.label < b.label ? -1 : 1; })
        .forEach(function (t) { tchip(t.id, t.label); });
      paintT();
      wrap.appendChild(tchips);
    }

    var last = lastMode();
    var modes = el('div', 'arc-modes');
    function mode(m, title, note) {
      var b = el('button', 'arc-mode' + (m === last ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('b', null, title));
      b.appendChild(el('span', null, note));
      b.addEventListener('click', function () { startShelf(g, m); });
      modes.appendChild(b);
    }
    mode('t', 'Tranquilo · 10 preguntas', 'sin reloj; la rapidez solo suma puntos');
    mode('c', 'Contrarreloj · 60 s', 'el reloj se para si bloqueas el celular');
    wrap.appendChild(modes);
    h.appendChild(wrap);
  }

  /* PRUEBA DE PALABRAS. Endless, no clock, no score: one word at a time down the
   * frequency list, English shown, Spanish typed. Right = permanently learnt
   * (GameItems.wordTestRight); "No la sé" or wrong = the answer for a moment and
   * the word enrolled as new for Palabras. The position is kept in
   * fluidez.arcade (wordTest: { pos, marked }) so the next visit resumes. */
  function wordTest(g) {
    var GI3 = window.GameItems, h = host();
    VIEW = 'wtest';                         // shares the sheet's history entry, as a round does
    var arc = loadArc(), wt = arc.wordTest || {};
    var pos = wt.pos || 0, marked = wt.marked || 0, session = 0, asked = 0;
    var cur = null, locked = false, timer = null;
    function persist() { var a = loadArc(); a.wordTest = { pos: pos, marked: marked }; saveArc(a); }
    clear(h);
    var wrap = el('div', 'arc-stats arc-wt');
    wrap.style.setProperty('--g', g.hue);
    var top = el('div', 'arc-stats-top');
    var fin = el('button', 'arc-back', 'Terminar');
    fin.type = 'button';
    top.appendChild(fin);
    top.appendChild(el('h2', null, 'Prueba de palabras'));
    wrap.appendChild(top);
    var count = el('p', 'arc-sub arc-wt-count');
    var rankEl = el('div', 'arc-wt-rank');
    var promptEl = el('div', 'arc-wt-prompt');
    var input = el('input', 'g-input arc-wt-input');
    input.type = 'text'; input.autocomplete = 'off'; input.autocapitalize = 'off'; input.spellcheck = false;
    input.enterKeyHint = 'go'; input.setAttribute('aria-label', 'Tu respuesta');
    var fb = el('div', 'arc-wt-fb');
    var idk = el('button', 'arc-wtbtn arc-wt-idk', 'No la sé');
    idk.type = 'button';
    wrap.appendChild(count); wrap.appendChild(rankEl); wrap.appendChild(promptEl);
    wrap.appendChild(input);
    if (UI && UI.accentBar) wrap.appendChild(UI.accentBar(function () { return input; }));
    wrap.appendChild(fb); wrap.appendChild(idk);
    h.appendChild(wrap);

    function paintCount() { count.textContent = 'Llevas ' + num(marked) + ' marcadas como sabidas'; }
    function sfx(k) { try { if (GS && GS.sfx) GS.sfx(k); } catch (e) {} }
    function next() {
      clearTimeout(timer);
      if (VIEW !== 'wtest') return;               // left by the back gesture
      locked = false; fb.textContent = ''; fb.className = 'arc-wt-fb';
      input.value = ''; input.className = 'g-input arc-wt-input'; input.disabled = false;
      var n = GI3.wordTestNext(pos);
      paintCount();
      if (!n) { cur = null; promptEl.textContent = 'Has llegado al final de la lista.'; rankEl.textContent = ''; input.hidden = true; idk.hidden = true; return; }
      cur = n; pos = n.pos;
      persist();
      rankEl.textContent = 'palabra ' + thousandsA(n.rank) + ' de ' + thousandsA(n.total);
      promptEl.textContent = n.e.en;
      try { input.focus(); } catch (e) {}
    }
    function thousandsA(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function right() {
      if (locked || !cur) return; locked = true;
      GI3.wordTestRight(cur.e);
      marked++; session++; asked++; pos = cur.pos + 1;
      input.classList.add('right'); fb.textContent = '✓'; fb.className = 'arc-wt-fb good';
      sfx('good'); persist(); paintCount();
      timer = setTimeout(next, 350);
    }
    function miss() {
      if (locked || !cur) return; locked = true;
      GI3.wordTestMiss(cur.e);
      asked++; pos = cur.pos + 1;
      input.classList.add('wrong'); input.disabled = true;
      fb.textContent = cur.e.es; fb.className = 'arc-wt-fb bad';
      sfx('wrong'); persist();
      timer = setTimeout(next, 1600);
      fb.onclick = function () { fb.onclick = null; next(); };
    }
    input.addEventListener('input', function () {
      if (locked || !cur) return;
      if (GI3.wordTestGrade(cur.e, input.value) === 'good') right();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || locked || !cur) return;
      e.preventDefault();
      if (!input.value.trim()) return;
      if (GI3.wordTestGrade(cur.e, input.value) === 'good') right(); else miss();
    });
    idk.addEventListener('click', miss);
    fin.addEventListener('click', function () {
      clearTimeout(timer); persist();
      clear(h);
      var sw = el('div', 'arc-stats arc-wt');
      sw.style.setProperty('--g', g.hue);
      sw.appendChild(el('h2', null, 'Prueba de palabras'));
      sw.appendChild(el('p', 'arc-wt-sum', session === 0 ? 'No has marcado ninguna esta vez.' : 'Has marcado ' + num(session) + (session === 1 ? ' palabra' : ' palabras') + ' como sabidas.'));
      sw.appendChild(el('p', 'arc-sub', 'En total llevas ' + num(marked) + '. Las demás ya están en Palabras, para aprenderlas.'));
      var bk = el('button', 'arc-wtbtn', 'Volver a Palabras');
      bk.type = 'button';
      bk.addEventListener('click', function () { sheet(g, true); });
      sw.appendChild(bk);
      h.appendChild(sw);
    });
    next();
  }

  function startShelf(g, m) {
    var a = loadArc(); a.mode = m; saveArc(a);
    /* The sheet already owns this history entry; a round shares it rather than
     * stacking a second, as the study pack does. */
    VIEW = 'round';
    var extra = m === 't' ? { key: modeKey(g, 't'), count: 10, duration: null }
                          : { key: modeKey(g, 'c'), duration: 60000 };
    if (g.key === 'verbos2') { var ts = chosenTenses(); if (ts.length) extra.tenses = ts; }
    if (g.key === 'palabras') { var wth = chosenWordTheme(); if (wth) extra.theme = wth; }
    if (g.key === 'frases' && focusThemes(chosenFocus()).length) extra.themes = focusThemes(chosenFocus());     // the Jugar mix ignores the focus
    G.open(g.key, board, extra);
  }

  /* Start a game with the arcade's focus honoured as far as that game can:
   * Verbos locks to the tense, a weak-spot focus routes to the round built
   * from exactly those misses, everything else plays normally with the bias
   * already set by applyFocus(). */
  function play(g) {
    pushView('round');
    var f = currentFocus();
    /* Every question from your own error log, for THIS game's kind. A deck
     * round, which is the same path the study pack takes — and which also
     * turns off the one-in-four revisit, correctly: there is nothing to mix
     * back in when the whole round is already the mixture. */
    if (f && f.kind === 'weak') {
      var deck = window.GameItems.missDeck(g.kind, 40);
      if (deck.length) {
        G.open(g.key, board, { deck: deck, title: g.name + ' · tus fallos' });
        return;
      }
    }
    if (f && f.kind === 'tense' && g.key === 'verbos' && G.openTense) {
      var r = G.openTense(f.tense, 'Conjugación · ' + tenseLabel(f.tense), board);
      if (r !== null) return;                    // null = the lock was refused
    }
    G.open(g.key, board, roundExtras(g));
  }

  /* The pack: flashcards first, then the same words as a round. The round is
   * dealt from the deck rather than the index (cfg.deck), so it is those
   * twelve words and nothing else — the whole point is using them while they
   * are still warm. */
  function study() {
    if (!window.Study) return;
    pushView('study');
    window.Study.render(host(), {
      onExit: goBack,
      onPlay: function (cards) {
        VIEW = 'round';
        window.GameRound.run(host(), {
          key: 'estudio', title: 'Hoy', kind: 'vocab', deck: cards,
          duration: 90000, hue: '#c98a1f', silent: true, onExit: board
        });
      }
    });
  }

  /* ---- TU PROGRESO, THE WEEKLY CHECK, THE TENSE CARDS (stage 4) ------------
   * The logic lives in js/tensecheck.js (TenseCheck); this is its drawing.
   * Three things share one idea: the games feed the SRS, so the SRS can say how
   * far you have got, test the tenses once a week, and name the next one. */
  var TC = function () { return window.TenseCheck; };
  var STATUS_TEXT = { dominado: 'dominado', casi: 'casi', aprender: 'por aprender', sin: 'sin probar' };
  function cards() { return window.TENSE_CARDS || null; }
  function hasCard(k) { var c = cards(); return !!(c && c[k]); }
  function bandIndexNow() { var b = window.Profile ? window.Profile.current() : 'A1'; var i = ['A1', 'A2', 'B1', 'B2', 'C1'].indexOf(b); return i < 0 ? 0 : i; }
  function cardLang() { var a = loadArc(); return a.cl === 'es' || a.cl === 'en' ? a.cl : (bandIndexNow() >= 2 ? 'es' : 'en'); }

  function bar(n, of, hue) {
    var b = el('div', 'arc-bar');
    var f = el('i');
    f.style.setProperty('width', (of ? Math.min(100, Math.round(100 * n / of)) : 0) + '%');
    if (hue) f.style.setProperty('background', hue);
    b.appendChild(f);
    return b;
  }
  /* "*x*" is bold in the card data; everything else is plain text. */
  function rich(parent, text) {
    String(text || '').split(/(\*[^*]+\*)/).forEach(function (part) {
      if (!part) return;
      if (/^\*[^*]+\*$/.test(part)) parent.appendChild(el('b', null, part.slice(1, -1)));
      else parent.appendChild(document.createTextNode ? document.createTextNode(part) : el('span', null, part));
    });
    return parent;
  }
  function topBar(title, onBack) {
    var top = el('div', 'arc-stats-top');
    var back = el('button', 'arc-back', '←');
    back.type = 'button';
    back.setAttribute('aria-label', 'Volver');
    back.addEventListener('click', onBack || goBack);
    top.appendChild(back);
    top.appendChild(el('h2', null, title));
    return top;
  }
  var SHORT = { presente: 'Presente', preterito: 'Pretérito', imperfecto: 'Imperfecto', perfecto: 'Perfecto',
    futuro: 'Futuro', imperativo: 'Imperativo', condicional: 'Condicional', plusc: 'Pluscuam.',
    presubj: 'Pres. subj.', impneg: 'Imp. neg.', impsubj: 'Imperf. subj.', futperf: 'Fut. perf.',
    perfsubj: 'Perf. subj.', condperf: 'Cond. perf.', pluscsubj: 'Pluscuam. subj.' };
  function tenseChip(k, status, onTap) {
    var b = el('button', 'arc-tchip');
    b.type = 'button';
    b.setAttribute('data-s', status);
    b.appendChild(el('i', 'arc-tdot'));
    b.appendChild(el('span', null, SHORT[k] || tenseLabel(k)));
    b.setAttribute('title', tenseLabel(k) + ': ' + STATUS_TEXT[status]);
    b.setAttribute('aria-label', tenseLabel(k) + ', ' + STATUS_TEXT[status]);
    if (onTap) b.addEventListener('click', onTap);
    return b;
  }
  function ago(ms) {
    if (!ms) return null;
    var d = Math.floor((Date.now() - ms) / 86400000);
    return d <= 0 ? 'hoy' : d === 1 ? 'ayer' : 'hace ' + d + ' días';
  }

  /* ---- the panel on the board ---------------------------------------------- */
  function progressPanel() {
    var T = TC();
    var pr = T.progress();
    var panel = el('section', 'arc-prog');
    panel.appendChild(el('div', 'arc-group', 'Tu progreso'));

    var w = pr.words, nx = w.next;
    var rw = el('button', 'arc-prow');
    rw.type = 'button';
    rw.appendChild(el('span', 'arc-prow-k', 'Palabras'));
    rw.appendChild(el('span', 'arc-prow-v', T.thousands(nx.n) + ' de ' + T.thousands(nx.of)));
    rw.appendChild(bar(nx.n, nx.of, '#6f8f2a'));
    rw.appendChild(el('span', 'arc-prow-s', 'las ' + T.thousands(nx.m) + ' más comunes · ver por tema ›'));
    rw.addEventListener('click', wordsDetail);
    panel.appendChild(rw);

    var rv = el('div', 'arc-prow');
    rv.appendChild(el('span', 'arc-prow-k', 'Verbos'));
    rv.appendChild(el('span', 'arc-prow-v', pr.verbs + (pr.verbs === 1 ? ' verbo conocido' : ' verbos conocidos')));
    var chips = el('div', 'arc-tchips');
    T.LADDER.forEach(function (k) {
      chips.appendChild(tenseChip(k, pr.tenses[k], hasCard(k) ? function () { tenseCard(k); } : null));
    });
    rv.appendChild(chips);
    var at = T.lastCheckAt();
    var sub = el('span', 'arc-prow-s', at ? 'último chequeo ' + ago(at) + ' · ' : 'sin chequeo todavía · ');
    var go = el('button', 'arc-link', 'hacer el chequeo');
    go.type = 'button';
    go.addEventListener('click', checkRun);
    sub.appendChild(go);
    rv.appendChild(sub);
    panel.appendChild(rv);

    var ph = pr.phrases;
    var rf = el('div', 'arc-prow');
    rf.appendChild(el('span', 'arc-prow-k', 'Frases'));
    rf.appendChild(el('span', 'arc-prow-v', T.thousands(ph.n) + ' de ' + T.thousands(ph.of)));
    rf.appendChild(bar(ph.n, ph.of, '#1d7f8c'));
    panel.appendChild(rf);
    return panel;
  }

  function wordsDetail() {
    pushView('words');
    var h = host(); clear(h);
    var T = TC(), w = T.wordProgress();
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar('Palabras'));
    wrap.appendChild(el('p', 'arc-sub', 'Cuentan las palabras que has acertado al menos una vez. Son ' + T.thousands(w.total) + ' en total.'));
    wrap.appendChild(el('div', 'arc-group', 'Las más comunes'));
    w.marks.forEach(function (m) {
      var r = el('div', 'arc-drow');
      r.appendChild(el('span', 'arc-drow-k', 'Las ' + T.thousands(m.m)));
      r.appendChild(el('span', 'arc-drow-v', T.thousands(m.n) + ' de ' + T.thousands(m.of)));
      r.appendChild(bar(m.n, m.of, '#6f8f2a'));
      wrap.appendChild(r);
    });
    wrap.appendChild(el('div', 'arc-group', 'Por tema'));
    w.themes.slice().sort(function (a, b) { var x = themeLabel(a.id), y = themeLabel(b.id); return x < y ? -1 : x > y ? 1 : 0; })
      .forEach(function (t) {
        var r = el('div', 'arc-drow');
        r.appendChild(el('span', 'arc-drow-k', themeLabel(t.id)));
        r.appendChild(el('span', 'arc-drow-v', t.n + ' de ' + t.of));
        r.appendChild(bar(t.n, t.of, '#6f8f2a'));
        wrap.appendChild(r);
      });
    h.appendChild(wrap);
  }

  /* ---- the card on the board -------------------------------------------------- */
  function checkCard() {
    var c = el('div', 'arc-check');
    c.appendChild(el('span', 'arc-check-k', 'Chequeo semanal'));
    c.appendChild(el('b', null, 'Mira qué tiempos ya dominas'));
    c.appendChild(el('span', 'arc-check-s', 'Tres frases por tiempo, sin reloj. Te dice cuál aprender después.'));
    var row = el('div', 'arc-check-row');
    var go = el('button', 'arc-btn on', 'Empezar · 3 min');
    go.type = 'button';
    go.addEventListener('click', checkRun);
    var later = el('button', 'arc-btn', 'Más tarde');
    later.type = 'button';
    later.addEventListener('click', function () { TC().snooze(); board(); });
    row.appendChild(go); row.appendChild(later);
    c.appendChild(row);
    return c;
  }

  /* ---- the check -------------------------------------------------------------- */
  function checkRun() {
    pushView('check');
    drawCheck(TC().session());
  }
  function drawCheck(s) {
    if (s.done) { checkResults(s); return; }
    var h = host(); clear(h);
    var wrap = el('div', 'arc-stats arc-checkrun');
    wrap.style.setProperty('--g', '#b5711a');
    wrap.appendChild(topBar('Chequeo semanal'));
    var t = s.tense(), g = s.item();
    var pos = el('div', 'arc-check-pos');
    pos.appendChild(el('b', null, tenseLabel(t)));
    pos.appendChild(el('span', null, ' · ' + (s.index() + 1) + ' de ' + s.count()));
    wrap.appendChild(pos);
    wrap.appendChild(bar(s.step() + s.index() / Math.max(1, s.count()), s.steps(), 'var(--accent)'));
    wrap.appendChild(el('div', 'g-prompt arc-check-q', g.q.replace(/___+/g, '＿＿＿')));
    var opts = el('div', 'g-options');
    var btns = [];
    var note = el('div', 'arc-check-note');
    var more = el('button', 'arc-btn on arc-check-next', 'Seguir');
    more.type = 'button';
    more.hidden = true;
    var inEs = bandIndexNow() >= 2;
    (window.ENGINE ? window.ENGINE.shuffle(g.o.slice()) : g.o.slice()).forEach(function (o) {
      var b = el('button', 'g-opt', o);
      b.type = 'button';
      b.addEventListener('click', function () {
        var r = s.answer(o);
        if (!r) return;
        btns.forEach(function (x) {
          x.disabled = true;
          if (x.textContent === r.answer) x.classList.add('right');
        });
        if (!r.right) b.classList.add('wrong');
        var why = inEs ? r.why : r.whyEn;
        note.textContent = (r.right ? '' : 'Era «' + r.answer + '». ') + (why || '');
        more.hidden = false;
      });
      btns.push(b);
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
    wrap.appendChild(note);
    more.addEventListener('click', function () { s.next(); drawCheck(s); });
    wrap.appendChild(more);
    h.appendChild(wrap);
  }

  function checkResults(s) {
    var T = TC(), h = host(); clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar('Tu chequeo', board));
    var res = {};
    T.LADDER.forEach(function (k) { res[k] = s.res[k] || 'sin'; });
    wrap.appendChild(el('p', 'arc-sub', s.stopped
      ? 'Paramos aquí: dos tiempos seguidos salieron difíciles, y no hace falta seguir.'
      : 'Has pasado por todos los tiempos.'));
    var chips = el('div', 'arc-tchips');
    T.LADDER.forEach(function (k) {
      var c = tenseChip(k, res[k], hasCard(k) ? function () { tenseCard(k); } : null);
      if (s.score[k]) c.appendChild(el('em', null, s.score[k]));
      chips.appendChild(c);
    });
    wrap.appendChild(chips);

    var cur = window.Profile ? window.Profile.current() : 'A1';
    var sug = s.suggested;
    var box = el('div', 'arc-check arc-check-lvl');
    if (sug !== cur) {
      box.appendChild(el('span', 'arc-check-k', 'Tu nivel'));
      box.appendChild(el('b', null, 'Por lo que has contestado, encajas en ' + sug));
      box.appendChild(el('span', 'arc-check-s', 'Ahora tienes ' + cur + '. Las rondas siguen tu nivel.'));
      var row = el('div', 'arc-check-row');
      var chg = el('button', 'arc-btn on', 'Cambiar mi nivel a ' + sug);
      chg.type = 'button';
      chg.addEventListener('click', function () {
        if (window.Profile) window.Profile.set(sug);
        document.documentElement.setAttribute('data-level', sug);
        box.textContent = '';
        box.appendChild(el('b', null, 'Nivel cambiado a ' + sug));
      });
      var keep = el('button', 'arc-btn', 'Mantener');
      keep.type = 'button';
      keep.addEventListener('click', function () { box.textContent = ''; box.appendChild(el('b', null, 'Te quedas en ' + cur)); });
      row.appendChild(chg); row.appendChild(keep);
      box.appendChild(row);
    } else {
      box.appendChild(el('span', 'arc-check-k', 'Tu nivel'));
      box.appendChild(el('b', null, cur + ' te encaja'));
    }
    wrap.appendChild(box);

    var nt = s.nextTense;
    if (nt) {
      var nb = el('button', 'arc-mode on arc-next');
      nb.type = 'button';
      nb.style.setProperty('--g', '#b5711a');
      nb.appendChild(el('b', null, 'Siguiente tiempo: ' + tenseLabel(nt)));
      nb.appendChild(el('span', null, hasCard(nt) ? 'una ficha corta y diez preguntas' : 'diez preguntas para practicarlo'));
      nb.addEventListener('click', function () { if (hasCard(nt)) tenseCard(nt); else practiceTense(nt); });
      wrap.appendChild(nb);
    } else {
      wrap.appendChild(el('p', 'arc-sub', 'No te falta ningún tiempo de los que probamos.'));
    }
    var done = el('button', 'arc-btn', 'Volver al tablero');
    done.type = 'button';
    done.addEventListener('click', board);
    wrap.appendChild(done);
    h.appendChild(wrap);
  }

  /* ---- the tense card ----------------------------------------------------------- */
  function practiceTense(k) {
    VIEW = 'round';
    G.open('verbos2', board, { key: 'verbos2:t', count: 10, duration: null, tenses: [k] });
  }
  function tenseCard(k) {
    var C = cards(), c = C && C[k];
    pushView('card');
    var h = host(); clear(h);
    var lang = cardLang();
    var wrap = el('div', 'arc-stats arc-tcard');
    wrap.style.setProperty('--g', '#b5711a');
    var top = topBar(c ? (c.name[lang] || tenseLabel(k)) : tenseLabel(k));
    if (c) {
      var tg = el('button', 'arc-lang', lang === 'es' ? 'EN' : 'ES');
      tg.type = 'button';
      tg.setAttribute('aria-label', lang === 'es' ? 'Show in English' : 'Ver en español');
      tg.addEventListener('click', function () {
        var a = loadArc(); a.cl = lang === 'es' ? 'en' : 'es'; saveArc(a); tenseCard(k);
      });
      top.appendChild(tg);
    }
    wrap.appendChild(top);

    if (c) {
      wrap.appendChild(el('div', 'arc-group', lang === 'es' ? 'Cuándo se usa' : 'When it is used'));
      var ul = el('ul', 'arc-when');
      c.when.forEach(function (w) { ul.appendChild(rich(el('li'), w[lang])); });
      wrap.appendChild(ul);

      wrap.appendChild(el('div', 'arc-group', lang === 'es' ? 'Cómo se forma' : 'How it is formed'));
      wrap.appendChild(rich(el('p', 'arc-how'), c.how[lang]));
      var tb = el('div', 'arc-ctable');
      tb.appendChild(el('div', 'arc-ctable-v', c.table.verb));
      c.table.forms.forEach(function (f, i) {
        var r = el('div', 'arc-ctable-r');
        r.appendChild(el('span', null, c.table.persons[i]));
        r.appendChild(el('b', null, f));
        tb.appendChild(r);
      });
      wrap.appendChild(tb);
      if (c.irregular && c.irregular[lang]) {
        wrap.appendChild(el('div', 'arc-group', lang === 'es' ? 'Ojo con' : 'Watch out'));
        wrap.appendChild(rich(el('p', 'arc-how'), c.irregular[lang]));
      }
      wrap.appendChild(el('div', 'arc-group', lang === 'es' ? 'Ejemplos' : 'Examples'));
      c.examples.forEach(function (ex) {
        var e = el('div', 'arc-ex');
        e.appendChild(rich(el('div', 'arc-ex-es'), ex.es));
        e.appendChild(el('div', 'arc-ex-en', ex.en));
        wrap.appendChild(e);
      });
      if (c.contrast && c.contrast[lang]) {
        wrap.appendChild(el('div', 'arc-group', lang === 'es' ? 'No lo confundas' : 'Do not mix it up'));
        wrap.appendChild(rich(el('p', 'arc-how'), c.contrast[lang]));
      }
    } else {
      wrap.appendChild(el('p', 'arc-sub', 'Todavía no hay ficha de este tiempo. Practícalo igualmente.'));
    }

    var btns = el('div', 'arc-modes');
    var pb = el('button', 'arc-mode on');
    pb.type = 'button';
    pb.appendChild(el('b', null, 'Practicar ' + (c ? (c.name[lang] || tenseLabel(k)) : tenseLabel(k)) + ' · 10 preguntas'));
    pb.appendChild(el('span', null, 'Tranquilo, sin reloj, solo este tiempo'));
    pb.addEventListener('click', function () { practiceTense(k); });
    btns.appendChild(pb);
    var url = TC().lessonUrl(k);
    if (url) {
      var a = el('a', 'arc-mode arc-lesson');
      a.setAttribute('href', url);
      a.appendChild(el('b', null, 'Ver la lección completa en Fluidez'));
      a.appendChild(el('span', null, 'se abre la app grande'));
      btns.appendChild(a);
    }
    wrap.appendChild(btns);
    h.appendChild(wrap);
  }

  /* ---- the numbers -------------------------------------------------------
   * Everything here is DERIVED from the round history, and anything with too
   * little evidence behind it shows a dash rather than a number. A figure
   * computed from two rounds is noise wearing a decimal point, and printing
   * it teaches people not to trust the screen. */
  /* ---- tick the phrases you know ---------------------------------------------------
   * One list of every phrase, grouped by theme in band order. Ticking calls SRS.learn (the
   * phrase is never dealt again); unticking calls SRS.unlearn (the record goes, so it is new). */
  var KNOWN_THEMES = null;
  function knownThemeLabel(id) { return themeLabel(id); }
  function knownScreen(g, pick) {
    VIEW = 'known';            // keeps the sheet's history entry: back returns to the sheet
    var h = host(); clear(h);
    var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    var G = window.GameItems.phraseList(), S = window.SRS;

    var wrap = el('div', 'arc-stats arc-known');
    wrap.style.setProperty('--g', g.hue);
    wrap.appendChild(topBar(pick ? 'Elige tus frases' : 'Frases que conoces', function () { sheet(g, true); }));
    wrap.appendChild(el('p', 'arc-sub', pick ? 'Marca las frases que quieres aprender. Con el tema Mis frases, las rondas solo te preguntan estas.'
      : 'Marca las frases que ya sabes. No se vuelven a preguntar. Si desmarcas una, vuelve a salir como nueva.'));
    /* In pick mode a tick puts the phrase on the learner's own list instead of marking it known. */
    var mineSet = {};
    myPhrases().forEach(function (id) { mineSet[id] = 1; });
    function isOn(id) { return pick ? !!mineSet[id] : S.isLearnt(id); }
    function setOn(id, on) {
      if (!pick) { if (on) S.learn(id); else S.unlearn(id); return; }
      if (on) mineSet[id] = 1; else delete mineSet[id];
      var ids = G.list.filter(function (e) { return mineSet[e.id]; }).map(function (e) { return e.id; });
      saveMine(ids);
      var f = chosenFocus(), i = f.indexOf('mine');
      if (ids.length && i === -1) f.push('mine');
      if (!ids.length && i !== -1) f.splice(i, 1);
      saveFocus(f);
    }
    var box = el('input', 'arc-wt-input arc-known-search');
    box.type = 'search'; box.placeholder = 'Buscar una frase'; box.setAttribute('aria-label', 'Buscar una frase');
    wrap.appendChild(box);
    var groups = {}, order = [];
    G.list.forEach(function (e) {
      var gr = groups[e.th];
      if (!gr) { gr = groups[e.th] = { th: e.th, rows: [], ix: 9 }; order.push(gr); }
      gr.rows.push(e);
      gr.ix = Math.min(gr.ix, Math.max(0, BANDS.indexOf(e.c)));
    });
    order.forEach(function (gr, i) { gr.first = i; });
    order.sort(function (a, b) { return a.ix - b.ix || a.first - b.first; });
    var all = [];
    var list = el('div', 'arc-known-list');
    order.forEach(function (gr) {
      gr.rows.sort(function (a, b) { return BANDS.indexOf(a.c) - BANDS.indexOf(b.c); });
      gr.box = el('section', 'arc-known-group');
      var head = el('div', 'arc-known-head');
      head.appendChild(el('h3', null, knownThemeLabel(gr.th)));
      var tl = el('label', 'arc-known-all');
      gr.tog = el('input'); gr.tog.type = 'checkbox';
      tl.appendChild(gr.tog); tl.appendChild(el('span', null, pick ? 'Todas' : 'Las conozco todas'));
      head.appendChild(tl);
      gr.box.appendChild(head);
      gr.items = [];
      gr.rows.forEach(function (e) {
        var row = el('label', 'arc-known-row');
        var cb = el('input'); cb.type = 'checkbox';
        var txt = el('span', 'arc-known-txt');
        txt.appendChild(el('span', 'arc-known-en', e.en));
        txt.appendChild(el('span', 'arc-known-tx', e.es));
        row.appendChild(cb); row.appendChild(txt);
        cb.addEventListener('change', function () {
          setOn(e.id, cb.checked);
          paint();
        });
        var it = { e: e, cb: cb, row: row, hay: (e.en + ' ' + e.es).toLowerCase() };
        gr.items.push(it); all.push(it);
        gr.box.appendChild(row);
      });
      gr.tog.addEventListener('change', function () {
        gr.items.forEach(function (it) {
          if (it.row.hidden) return;
          var on = isOn(it.e.id);
          if (gr.tog.checked !== on) setOn(it.e.id, gr.tog.checked);
        });
        paint();
      });
      list.appendChild(gr.box);
    });
    wrap.appendChild(list);
    function paint() {
      var q = (box.value || '').trim().toLowerCase();
      order.forEach(function (gr) {
        var shown = 0, ticked = 0;
        gr.items.forEach(function (it) {
          it.cb.checked = isOn(it.e.id);
          it.row.hidden = !!q && it.hay.indexOf(q) === -1;
          if (!it.row.hidden) { shown++; if (it.cb.checked) ticked++; }
        });
        gr.box.hidden = shown === 0;
        gr.tog.checked = shown > 0 && ticked === shown;
      });
    }
    box.addEventListener('input', paint);
    paint();
    h.appendChild(wrap);
  }

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

  /* UPDATES. The worker installs a new version in the background and takes
   * over (skipWaiting, clients.claim), but the page on screen kept running the
   * old code until it was reloaded, and a home-screen app on a phone resumes
   * from memory rather than reloading, so it could stay old for days. Now: look
   * for a new version every time the app comes back to the front, and when one
   * has taken over, reload: at once on the board, or the next time the board is
   * drawn if a round or a test is on screen (never in the middle of one). */
  if ('serviceWorker' in navigator) {
    var hadController = !!navigator.serviceWorker.controller;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').then(function (reg) {
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'visible') { try { reg.update(); } catch (e) {} }
        });
      }).catch(function () {});
    });
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!hadController) { hadController = true; return; }   // the first install: already current
      UPDATE_READY = true;
      if (VIEW === 'board') location.reload();
    });
  }
})();
