/* ============================================================================
 * GA ARCADE: Líofa's whole application layer (ported from Fluidez js/arcade.js).
 *
 *   1. THE BOARD. A big Imir (the mix), a row of three (Briathra, Focail, Frásaí)
 *      and a row of four grammar tiles (Séimhiú agus urú, Forainmneacha, Tá nó Is,
 *      Freagair). Irish labels with a small English line. A tile whose bank is
 *      empty says "ag teacht" and is not tappable: a missing bank never crashes.
 *   2. THE SHEET: Go réidh (10 questions, no clock) or In aghaidh an chloig (60 s),
 *      and a tense / topic picker.
 *   3. DO DHUL CHUN CINN: progress panel, the word test (Triail focal), the weekly
 *      check, the cards (GA_CARDS) and a placement test on first open.
 *   4. A service worker of its own that looks for updates whenever the app returns.
 * Everything keeps to localStorage keys that start `liofa.`.
 * ========================================================================== */
(function () {
  var UI = window.UI, GS = window.GameScore, GI = window.GAItems, GC = window.GACore;
  var T = UI.t;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function host() { return document.getElementById('stage-host'); }
  function num(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function button(cls, text, fn, label) {
    var b = el('button', cls, text);
    b.type = 'button';
    if (label) b.setAttribute('aria-label', label);
    if (fn) b.addEventListener('click', fn);
    return b;
  }
  function band() { return window.Profile ? window.Profile.current() : 'A1'; }
  function bandIx() { return GC.bandIndex(band()); }

  /* ---- sparkline: the last twenty scores, as a shape ------------------------ */
  function spark(scores, hue, w, h) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('class', 'arc-spark');
    svg.setAttribute('aria-hidden', 'true');
    var pts = (scores || []).slice(-20);
    if (pts.length < 2) return svg;
    var max = Math.max.apply(null, pts), min = Math.min.apply(null, pts);
    var span = Math.max(1, max - min), pad = 2;
    var xy = pts.map(function (s, i) {
      return [pad + (w - pad * 2) * (i / (pts.length - 1)), pad + (h - pad * 2) * (1 - (s - min) / span)];
    });
    var d = xy.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d); path.setAttribute('fill', 'none'); path.setAttribute('stroke', hue);
    path.setAttribute('stroke-width', '2'); path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round'); path.setAttribute('opacity', '.85');
    svg.appendChild(path);
    var last = xy[xy.length - 1];
    var dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', last[0].toFixed(1)); dot.setAttribute('cy', last[1].toFixed(1));
    dot.setAttribute('r', '2.6'); dot.setAttribute('fill', hue);
    svg.appendChild(dot);
    return svg;
  }

  /* ---- what the arcade remembers (liofa.arcade) ------------------------------ */
  var AKEY = 'liofa.arcade';
  function loadArc() { try { return JSON.parse(localStorage.getItem(AKEY)) || {}; } catch (e) { return {}; } }
  function saveArc(o) { try { localStorage.setItem(AKEY, JSON.stringify(o)); } catch (e) {} }

  /* ---- the games --------------------------------------------------------------- */
  var GAMES = [
    { key: 'imir', kind: 'imir', hue: '#e8b64a', ga: 'Imir', en: 'Play', rule: 'A bit of everything: verbs, words, phrases and grammar' },
    { key: 'briathra', kind: 'briathra', hue: '#2fae6e', ga: 'Briathra', en: 'Verbs', rule: 'The right form of the verb, in a sentence' },
    { key: 'focail', kind: 'focail', hue: '#a26bd1', ga: 'Focail', en: 'Words', rule: 'The commonest words first' },
    { key: 'frasai', kind: 'frasai', hue: '#3a8fd6', ga: 'Frásaí', en: 'Phrases', rule: 'Everyday phrases, whole' },
    { key: 'seimhiu', kind: 'seimhiu', hue: '#e0a526', ga: 'Séimhiú agus urú', en: 'Lenition and eclipsis', rule: 'The first letter changes: bh, mb, t-, h' },
    { key: 'forainm', kind: 'forainm', hue: '#d9653b', ga: 'Forainmneacha', en: 'Prepositional pronouns', rule: 'agam, leis, uaim: a preposition and a pronoun in one' },
    { key: 'tais', kind: 'tais', hue: '#2fb3a5', ga: 'Tá nó Is', en: 'Tá or Is', rule: 'Which verb says "is": tá or is' },
    { key: 'freagair', kind: 'freagair', hue: '#e05a7a', ga: 'Freagair', en: 'Answer', rule: 'Answer the question the way Irish does: no yes or no' }
  ];
  function gameByKey(k) { return GAMES.filter(function (g) { return g.key === k; })[0]; }
  function playable(g) { return GI.bankCount(g.kind) > 0; }

  /* ---- navigation: every ← goes to the board, and the phone's back counts ------- */
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
        // press the round's own ✕: the one path that stops its clock and files nothing
        var x = document.querySelector && document.querySelector('.g-exit');
        if (x) { x.click(); return; }
      }
      board();
    });
  }
  function topBar(title, sub, onBack) {
    var top = el('div', 'arc-stats-top');
    top.appendChild(button('arc-back', '←', onBack || goBack, T('Ar ais', 'Back')));
    var h = el('h2', null, title);
    top.appendChild(h);
    return top;
  }

  /* ---- the board ------------------------------------------------------------------ */
  function board() {
    if (UPDATE_READY) { location.reload(); return; }
    VIEW = 'board';
    var h = host();
    if (!h) return;
    // first open: a placement test sets the band
    if (window.Profile && !window.Profile.placed() && !loadArc().noPlace && placementItems().length >= 6) {
      placement(); return;
    }
    clear(h);
    var wrap = el('div', 'arc');

    var top = el('div', 'arc-top');
    top.appendChild(el('div', 'arc-brand', 'Líofa'));
    top.appendChild(button('arc-level', band() + ' ▾', levelPicker, T('Do leibhéal', 'Change level')));
    wrap.appendChild(top);

    wrap.appendChild(imirCard(GAMES[0]));
    if (window.GACheck && window.GACheck.due()) wrap.appendChild(checkCard());

    wrap.appendChild(tileRow('arc-grid arc-row3', GAMES.slice(1, 4)));
    wrap.appendChild(tileRow('arc-grid arc-row4', GAMES.slice(4, 8)));
    wrap.appendChild(progressPanel());

    wrap.appendChild(el('div', 'arc-foot',
      'Verb forms: BuNaMo, Foras na Gaeilge (ODbL). Word order: Irish Word Frequency List, Michal Měchura (ODbL).'));
    h.appendChild(wrap);
  }

  function tileRow(cls, games) {
    var grid = el('div', cls);
    games.forEach(function (g) {
      var mk = shelfStats(g), p = mk.p;
      var ok = playable(g);
      var tile = el('button', 'arc-tile');
      tile.type = 'button';
      tile.style.setProperty('--g', g.hue);
      if (!ok) tile.disabled = true;
      tile.appendChild(el('span', 'arc-name', g.ga));
      tile.appendChild(el('span', 'arc-en', g.en));
      if (!ok) {
        tile.appendChild(el('span', 'arc-soon', 'ag teacht'));
        tile.appendChild(el('span', 'arc-pb-k', 'coming soon'));
      } else {
        tile.appendChild(el('span', 'arc-pb' + (p.pb ? '' : ' none'), p.pb ? num(p.pb) : 'no record'));
        if (p.pb) tile.appendChild(el('span', 'arc-pb-k', mk.label ? 'record · ' + mk.label : 'record'));
        if (p.scores.length > 1) tile.appendChild(spark(p.scores, g.hue, 120, 20));
        tile.addEventListener('click', function () { sheet(g); });
        if (p.plays) {
          var data = button('arc-data', '≡', function (e) { e.stopPropagation(); stats(mk.g); }, 'Stats: ' + g.en);
          tile.appendChild(data);
        }
      }
      grid.appendChild(tile);
    });
    return grid;
  }

  /* ---- records per shape (one for each clock mode) ---------------------------------- */
  function modeKey(g, m) { return g.key + ':' + m; }
  function shelfStats(g) {
    var pc = GS.profileOf(modeKey(g, 'c')), pt = GS.profileOf(modeKey(g, 't'));
    var useT = !pc.plays && pt.plays;
    var p = useT ? pt : pc;
    p = Object.assign({}, p, { plays: pc.plays + pt.plays });
    var sg = { key: modeKey(g, useT ? 't' : 'c'), ga: g.ga, en: g.en, rule: g.rule, hue: g.hue };
    return { p: p, g: sg, label: p.pb ? (useT ? '10' : '60 s') : null };
  }

  function imirCard(g) {
    var mk = shelfStats(g), ok = playable(g);
    var c = el('button', 'arc-jugar');
    c.type = 'button';
    c.style.setProperty('--g', g.hue);
    if (!ok) c.disabled = true;
    c.appendChild(el('span', 'arc-jugar-k', g.ga));
    c.appendChild(el('span', 'arc-jugar-t', g.en + ': a bit of everything'));
    c.appendChild(el('span', 'arc-jugar-s', !ok ? 'ag teacht · coming soon'
      : mk.p.pb ? 'record ' + num(mk.p.pb) + ' · ' + mk.label : 'Verbs, words, phrases and grammar'));
    if (ok) c.addEventListener('click', function () { sheet(g); });
    return c;
  }

  /* ---- the sheet: which mode, and which tenses or topics ----------------------------- */
  function lastMode() { var a = loadArc(); return a.mode === 't' || a.mode === 'c' ? a.mode : 't'; }
  function chosen(key) { var a = loadArc(); return (a.sel && a.sel[key]) || []; }
  function saveChosen(key, ts) { var a = loadArc(); a.sel = a.sel || {}; a.sel[key] = ts; saveArc(a); }
  function chosenWordTheme() {
    var a = loadArc(), id = a.wtheme;
    if (!id) return '';
    return GI.grindThemes().some(function (t) { return t.id === id; }) ? id : '';
  }
  function saveWordTheme(id) { var a = loadArc(); a.wtheme = id || ''; saveArc(a); }
  /* The Frásaí sheet's topic focus (multi-select; empty means all topics). */
  function chosenFocus() { var f = loadArc().pfocus; return Array.isArray(f) ? f.slice() : []; }
  function saveFocus(f) { var a = loadArc(); a.pfocus = f; saveArc(a); }
  /* My phrases: the learner's own list of phrase ids. As a topic it is 'mine' in the focus,
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

  // units of this tile that have sentences: the picker offers these
  function unitsFor(g) {
    if (!window.GACheck) return [];
    return window.GACheck.UNITS.filter(function (u) {
      return u.k === g.kind && GI.bank(u.k).some(function (r) { return u.t == null || r.t === u.t; });
    });
  }
  function hasCard(k) { var c = window.GA_CARDS; return !!(c && k && c[k]); }

  function sheet(g, noPush) {
    if (noPush) VIEW = 'sheet'; else pushView('sheet');
    var h = host();
    clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.style.setProperty('--g', g.hue);
    wrap.appendChild(topBar(g.ga));
    wrap.appendChild(el('p', 'arc-sub', g.en + '. ' + g.rule));

    var units = unitsFor(g);
    if (units.length > 1) {
      wrap.appendChild(el('div', 'arc-group', g.kind === 'briathra' ? T('Aimsirí', 'Tenses') : T('Ábhair', 'Topics')));
      var chips = el('div', 'arc-chips');
      var sel = chosen(g.key), byKey = {};
      var all = button('arc-chip', T('Gach rud', 'All of them'));
      var paint = function () {
        all.classList.toggle('on', !sel.length);
        Object.keys(byKey).forEach(function (k) { byKey[k].classList.toggle('on', sel.indexOf(k) !== -1); });
      };
      all.addEventListener('click', function () { sel = []; saveChosen(g.key, sel); paint(); });
      chips.appendChild(all);
      units.forEach(function (u) {
        var key = u.t;
        var b = button('arc-chip', T(u.label.ga, u.label.en), function () {
          var i = sel.indexOf(key);
          if (i === -1) sel.push(key); else sel.splice(i, 1);
          saveChosen(g.key, sel); paint();
        });
        byKey[key] = b;
        if (hasCard(u.card)) {
          var cw = el('span', 'arc-chipwrap');
          cw.appendChild(b);
          cw.appendChild(button('arc-chipq', '?', function () { cardScreen(u.card, u); }, 'Card: ' + u.label.en));
          chips.appendChild(cw);
        } else chips.appendChild(b);
      });
      paint();
      wrap.appendChild(chips);
    } else if (units.length === 1 && hasCard(units[0].card)) {
      wrap.appendChild(button('arc-wtbtn', T('Léigh an cárta', 'Read the card'), function () { cardScreen(units[0].card, units[0]); }));
    }

    if (g.key === 'frasai') {
      var pfocus = chosenFocus(), pcovLine = el('div', 'arc-progress-all');
      wrap.appendChild(el('div', 'arc-progress')).appendChild(pcovLine);
      /* Under a round's worth of your own phrases ready today, the sheet says so and offers more. */
      var lowBox = el('div', 'arc-mine-low'), lowTxt = el('p', 'arc-sub');
      var lb = button('arc-wtbtn', 'Add phrases', function () { knownScreen(g, true); });
      lowBox.appendChild(lowTxt); lowBox.appendChild(lb); wrap.appendChild(lowBox);
      var paintLow = function () {
        var r = pfocus.indexOf('mine') !== -1 && GI.mineReady ? GI.mineReady(focusThemes(pfocus)) : null;
        lowBox.hidden = !(r && r.low);
        if (r && r.low) lowTxt.textContent = 'Only ' + r.ready + ' of your phrases ' + (r.ready === 1 ? 'is' : 'are') + ' ready to practise today. Add more to keep your rounds full.';
      };
      var paintCov = function () { paintLow(); pcovLine.textContent = GI.phraseCoverage(focusThemes(pfocus)).text; };
      paintCov();
      var fbox = el('div', 'cv-sheet');
      var paintConvos = function () {
        clear(fbox);
        if (window.GAConvo) window.GAConvo.section(fbox, pfocus.filter(function (t) { return t !== 'mine'; }), function () { sheet(g, true); }, function (v) { VIEW = v; });
      };
      var fthemes = Object.keys(GI.phraseList().byTheme)
        .sort(function (a, b) { return knownThemeLabel(a) < knownThemeLabel(b) ? -1 : knownThemeLabel(a) > knownThemeLabel(b) ? 1 : 0; });
      if (fthemes.length > 1) {
        wrap.appendChild(el('div', 'arc-group', T('Ábhair le díriú orthu', 'Topics to focus on')));
        var fchips = el('div', 'arc-chips arc-focus-chips'), fby = {};
        var fall = button('arc-chip', T('Gach ábhar', 'All topics'));
        var paintF = function () {
          fall.classList.toggle('on', !pfocus.length);
          Object.keys(fby).forEach(function (k) { fby[k].classList.toggle('on', pfocus.indexOf(k) !== -1); });
        };
        fall.addEventListener('click', function () { pfocus = []; saveFocus(pfocus); paintF(); paintCov(); paintConvos(); });
        fchips.appendChild(fall);
        var mine = myPhrases();
        if (mine.length) fthemes.unshift('mine');
        fthemes.forEach(function (t) {
          fby[t] = button('arc-chip', t === 'mine' ? 'My phrases (' + mine.length + ')' : knownThemeLabel(t), function () {
            var i = pfocus.indexOf(t);
            if (i === -1) pfocus.push(t); else pfocus.splice(i, 1);
            saveFocus(pfocus); paintF(); paintCov(); paintConvos();
          });
          fchips.appendChild(fby[t]);
        });
        paintF();
        wrap.appendChild(fchips);
      }
      wrap.appendChild(button('arc-wtbtn', 'Choose your own phrases', function () { knownScreen(g, true); }));
      wrap.appendChild(button('arc-wtbtn', 'Tick the phrases you know', function () { knownScreen(g); }));
      paintConvos();
      wrap.appendChild(fbox);
    }

    if (g.key === 'focail') {
      var wt = chosenWordTheme();
      var prog = el('div', 'arc-progress');
      var paintProgress = function () {
        clear(prog);
        var cv = GI.coverage(wt || null);
        prog.appendChild(el('div', 'arc-progress-all', cv.text));
        if (cv.theme) prog.appendChild(el('div', 'arc-progress-theme', cv.theme.text));
      };
      paintProgress();
      wrap.appendChild(prog);
      wrap.appendChild(button('arc-wtbtn', 'Triail focal · Already know Irish? Mark the words you know', function () { wordTest(g); }));
      wrap.appendChild(el('p', 'arc-sub arc-wtsub',
        'Type each word, with no clock. The ones you get right are never asked again.'));
      var themes = GI.grindThemes();
      if (themes.length) {
        wrap.appendChild(el('div', 'arc-group', T('Téama', 'Theme')));
        var tchips = el('div', 'arc-chips'), tby = {};
        var paintT = function () { Object.keys(tby).forEach(function (k) { tby[k].classList.toggle('on', k === (wt || '')); }); };
        var tchip = function (id, label) {
          tby[id] = button('arc-chip', label, function () { wt = id; saveWordTheme(id); paintT(); paintProgress(); });
          tchips.appendChild(tby[id]);
        };
        tchip('', 'Commonest');
        themes.sort(function (a, b) { return a.label < b.label ? -1 : 1; }).forEach(function (t) { tchip(t.id, t.label); });
        paintT();
        wrap.appendChild(tchips);
      }
    }

    var last = lastMode();
    var modes = el('div', 'arc-modes');
    var mode = function (m, ga, en, note) {
      var b = el('button', 'arc-mode' + (m === last ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('b', null, ga));
      b.appendChild(el('span', null, en + ' · ' + note));
      b.addEventListener('click', function () { startShelf(g, m); });
      modes.appendChild(b);
    };
    mode('t', 'Go réidh', '10 questions', 'no clock; speed only adds points');
    mode('c', 'In aghaidh an chloig', '60 s', 'the clock stops when you lock the phone');
    wrap.appendChild(modes);
    h.appendChild(wrap);
  }

  function startShelf(g, m, extra) {
    var a = loadArc(); a.mode = m; saveArc(a);
    VIEW = 'round';                       // the sheet owns the history entry; a round shares it
    var cfg = { key: modeKey(g, m), title: g.ga, kind: g.kind, hue: g.hue, onExit: board };
    if (m === 't') { cfg.count = 10; cfg.duration = null; } else cfg.duration = 60000;
    var sel = chosen(g.key);
    if (sel.length) { if (g.kind === 'briathra') cfg.tenses = sel; else cfg.topics = sel; }
    if (g.key === 'focail') { var wth = chosenWordTheme(); if (wth) cfg.theme = wth; }
    if (g.key === 'frasai' && focusThemes(chosenFocus()).length) cfg.themes = focusThemes(chosenFocus());     // the Imir mix ignores the focus
    if (extra) Object.keys(extra).forEach(function (k) { cfg[k] = extra[k]; });
    window.GameRound.run(host(), cfg);
  }
  // ten untimed questions on one unit (from a card or a check result)
  function practiceUnit(u) {
    var g = GAMES.filter(function (x) { return x.kind === u.k; })[0];
    if (!g) return;
    VIEW = 'round';
    var cfg = { key: modeKey(g, 't'), title: g.ga, kind: g.kind, hue: g.hue, onExit: board, count: 10, duration: null };
    if (u.t) { if (g.kind === 'briathra') cfg.tenses = [u.t]; else cfg.topics = [u.t]; }
    window.GameRound.run(host(), cfg);
  }

  /* ---- TRIAIL FOCAL: the word test --------------------------------------------------
   * Endless, no clock, no score: one word at a time down the frequency list, the
   * English shown, the Irish typed. Right = permanently learnt. "Níl a fhios agam"
   * or wrong = the answer for a moment and the word enrolled as new. */
  function wordTest(g) {
    var h = host();
    VIEW = 'wtest';
    var arc = loadArc(), wt = arc.wordTest || {};
    var pos = wt.pos || 0, marked = wt.marked || 0, session = 0;
    var cur = null, locked = false, timer = null;
    var persist = function () { var a = loadArc(); a.wordTest = { pos: pos, marked: marked }; saveArc(a); };
    clear(h);
    var wrap = el('div', 'arc-stats arc-wt');
    wrap.style.setProperty('--g', g.hue);
    var top = el('div', 'arc-stats-top');
    var fin = button('arc-back', T('Críochnaigh', 'Finish'));
    top.appendChild(fin);
    top.appendChild(el('h2', null, 'Triail focal'));
    wrap.appendChild(top);
    var count = el('p', 'arc-sub arc-wt-count');
    var rankEl = el('div', 'arc-wt-rank');
    var promptEl = el('div', 'arc-wt-prompt');
    var input = el('input', 'g-input arc-wt-input');
    input.type = 'text'; input.autocomplete = 'off'; input.autocapitalize = 'off'; input.spellcheck = false;
    input.enterKeyHint = 'go'; input.setAttribute('aria-label', 'Do fhreagra');
    var fb = el('div', 'arc-wt-fb');
    var idk = button('arc-wtbtn arc-wt-idk', 'Níl a fhios agam');
    wrap.appendChild(count); wrap.appendChild(rankEl); wrap.appendChild(promptEl);
    wrap.appendChild(input);
    wrap.appendChild(UI.accentBar(function () { return input; }));
    wrap.appendChild(fb); wrap.appendChild(idk);
    h.appendChild(wrap);

    var paintCount = function () { count.textContent = num(marked) + ' marked as known so far'; };
    var sfx = function (k) { try { if (GS && GS.sfx) GS.sfx(k); } catch (e) {} };
    function next() {
      clearTimeout(timer);
      if (VIEW !== 'wtest') return;                // left by the back gesture
      locked = false; fb.textContent = ''; fb.className = 'arc-wt-fb';
      input.value = ''; input.className = 'g-input arc-wt-input'; input.disabled = false;
      var n = GI.wordTestNext(pos);
      paintCount();
      if (!n) { cur = null; promptEl.textContent = 'You have reached the end of the list.'; rankEl.textContent = ''; input.hidden = true; idk.hidden = true; return; }
      cur = n; pos = n.pos;
      persist();
      rankEl.textContent = 'word ' + num(n.rank) + ' of ' + num(n.total);
      promptEl.textContent = n.e.en;
      try { input.focus(); } catch (e) {}
    }
    function right() {
      if (locked || !cur) return; locked = true;
      GI.wordTestRight(cur.e);
      marked++; session++; pos = cur.pos + 1;
      input.classList.add('right'); fb.textContent = '✓'; fb.className = 'arc-wt-fb good';
      sfx('good'); persist(); paintCount();
      timer = setTimeout(next, 350);
    }
    function miss() {
      if (locked || !cur) return; locked = true;
      GI.wordTestMiss(cur.e);
      pos = cur.pos + 1;
      input.classList.add('wrong'); input.disabled = true;
      fb.textContent = cur.e.ga; fb.className = 'arc-wt-fb bad';
      sfx('wrong'); persist();
      timer = setTimeout(next, 1600);
      fb.onclick = function () { fb.onclick = null; next(); };
    }
    input.addEventListener('input', function () {
      if (locked || !cur) return;
      if (GI.wordTestGrade(cur.e, input.value) === 'good') right();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || locked || !cur) return;
      e.preventDefault();
      if (!input.value.trim()) return;
      if (GI.wordTestGrade(cur.e, input.value) === 'good') right(); else miss();
    });
    idk.addEventListener('click', miss);
    fin.addEventListener('click', function () {
      clearTimeout(timer); persist();
      clear(h);
      var sw = el('div', 'arc-stats arc-wt');
      sw.style.setProperty('--g', g.hue);
      sw.appendChild(el('h2', null, 'Triail focal'));
      sw.appendChild(el('p', 'arc-wt-sum', session === 0 ? 'You did not mark any this time.'
        : 'You marked ' + num(session) + (session === 1 ? ' word' : ' words') + ' as known.'));
      sw.appendChild(el('p', 'arc-sub', 'Altogether ' + num(marked) + '. The rest are in Focail, to learn.'));
      sw.appendChild(button('arc-wtbtn', 'Back to Focail', function () { sheet(g, true); }));
      h.appendChild(sw);
    });
    next();
  }

  /* ---- DO DHUL CHUN CINN: the progress panel --------------------------------------------- */
  var STATUS_TEXT = { dominado: 'got it', casi: 'nearly', aprender: 'to learn', sin: 'not tried' };
  function bar(n, of, hue) {
    var b = el('div', 'arc-bar');
    var f = el('i');
    f.style.setProperty('width', (of ? Math.min(100, Math.round(100 * n / of)) : 0) + '%');
    if (hue) f.style.setProperty('background', hue);
    b.appendChild(f);
    return b;
  }
  function unitChip(u, status, onTap) {
    var b = el('button', 'arc-tchip');
    b.type = 'button';
    b.setAttribute('data-s', status);
    b.appendChild(el('i', 'arc-tdot'));
    b.appendChild(el('span', null, T(u.label.ga, u.label.en)));
    b.setAttribute('aria-label', u.label.en + ', ' + STATUS_TEXT[status]);
    if (onTap) b.addEventListener('click', onTap);
    return b;
  }
  function ago(ms) {
    if (!ms) return null;
    var d = Math.floor((Date.now() - ms) / 86400000);
    return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago';
  }
  function progressPanel() {
    var C = window.GACheck;
    var pr = C.progress();
    var panel = el('section', 'arc-prog');
    panel.appendChild(el('div', 'arc-group', 'Do dhul chun cinn'));
    panel.appendChild(el('div', 'arc-prog-en', 'Your progress'));

    var w = pr.words;
    var rw = el('button', 'arc-prow');
    rw.type = 'button';
    rw.appendChild(el('span', 'arc-prow-k', 'Focail'));
    rw.appendChild(el('span', 'arc-prow-v', w.of ? GI.thousands(w.n) + ' of ' + GI.thousands(w.of) : 'ag teacht'));
    rw.appendChild(bar(w.n, w.of, '#a26bd1'));
    rw.appendChild(el('span', 'arc-prow-s', w.of ? 'the ' + GI.thousands(w.of) + ' commonest words · by theme ›' : 'words are on the way'));
    rw.addEventListener('click', wordsDetail);
    panel.appendChild(rw);

    var rv = el('div', 'arc-prow');
    rv.appendChild(el('span', 'arc-prow-k', 'Gramadach'));
    rv.appendChild(el('span', 'arc-prow-v', pr.verbs + (pr.verbs === 1 ? ' verb known' : ' verbs known') + ' · tenses and grammar'));
    var chips = el('div', 'arc-tchips');
    C.UNITS.forEach(function (u) {
      if (!GI.bank(u.k).some(function (r) { return u.t == null || r.t === u.t; })) return;
      chips.appendChild(unitChip(u, pr.units[u.id], hasCard(u.card) ? function () { cardScreen(u.card, u); } : null));
    });
    rv.appendChild(chips);
    if (C.ladder().length) {
      var at = C.lastCheckAt();
      var sub = el('span', 'arc-prow-s', at ? 'last check ' + ago(at) + ' · ' : 'no check yet · ');
      sub.appendChild(button('arc-link', 'take the check', checkRun));
      rv.appendChild(sub);
    }
    panel.appendChild(rv);

    var ph = pr.phrases;
    var rf = el('div', 'arc-prow');
    rf.appendChild(el('span', 'arc-prow-k', 'Frásaí'));
    rf.appendChild(el('span', 'arc-prow-v', ph.of ? GI.thousands(ph.n) + ' of ' + GI.thousands(ph.of) : 'ag teacht'));
    rf.appendChild(bar(ph.n, ph.of, '#3a8fd6'));
    panel.appendChild(rf);
    return panel;
  }
  function wordsDetail() {
    pushView('words');
    var h = host(); clear(h);
    var G = GI.grindList(), wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar('Focail'));
    var cv = GI.coverage(null);
    wrap.appendChild(el('p', 'arc-sub', 'Words you have got right at least once count. ' + GI.thousands(G.list.length) + ' in all; ' + cv.text + '.'));
    wrap.appendChild(el('div', 'arc-group', T('Téama', 'By theme')));
    GI.grindThemes().sort(function (a, b) { return a.label < b.label ? -1 : 1; }).forEach(function (t) {
      var c = GI.coverage(t.id).theme;
      var r = el('div', 'arc-drow');
      r.appendChild(el('span', 'arc-drow-k', t.label));
      r.appendChild(el('span', 'arc-drow-v', c.n + ' of ' + c.of));
      r.appendChild(bar(c.n, c.of, '#a26bd1'));
      wrap.appendChild(r);
    });
    h.appendChild(wrap);
  }

  /* ---- the weekly check ------------------------------------------------------------------- */
  function checkCard() {
    var c = el('div', 'arc-check');
    c.appendChild(el('span', 'arc-check-k', T('Seiceáil seachtainiúil', 'Weekly check')));
    c.appendChild(el('b', null, 'See which tenses and topics you have got'));
    c.appendChild(el('span', 'arc-check-s', 'Three sentences each, no clock. It tells you what to learn next.'));
    var row = el('div', 'arc-check-row');
    row.appendChild(button('arc-btn on', 'Start · 3 min', checkRun));
    row.appendChild(button('arc-btn', T('Níos déanaí', 'Later'), function () { window.GACheck.snooze(); board(); }));
    c.appendChild(row);
    return c;
  }
  function checkRun() {
    pushView('check');
    drawCheck(window.GACheck.session());
  }
  function drawCheck(s) {
    if (s.done) { checkResults(s); return; }
    var h = host(); clear(h);
    var wrap = el('div', 'arc-stats arc-checkrun');
    wrap.appendChild(topBar(T('Seiceáil seachtainiúil', 'Weekly check')));
    var u = s.unit(), g = s.item();
    var pos = el('div', 'arc-check-pos');
    pos.appendChild(el('b', null, T(u.label.ga, u.label.en)));
    pos.appendChild(el('span', null, ' · ' + (s.index() + 1) + ' of ' + s.count()));
    wrap.appendChild(pos);
    wrap.appendChild(bar(s.step() + s.index() / Math.max(1, s.count()), s.steps(), 'var(--accent)'));
    wrap.appendChild(el('div', 'g-prompt arc-check-q', g.q.replace(/___+/g, '＿＿＿')));
    var sub = el('div', 'g-sub');
    if (g.e) {
      sub.appendChild(button('g-peek', 'English', function () { sub.textContent = g.e; sub.classList.add('shown'); }));
      wrap.appendChild(sub);
    }
    var opts = el('div', 'g-options'), btns = [];
    var note = el('div', 'arc-check-note');
    var more = button('arc-btn on arc-check-next', T('Lean ar aghaidh', 'Next'));
    more.hidden = true;
    GC.shuffle(g.o.slice()).forEach(function (o) {
      var b = button('g-opt', o, function () {
        var r = s.answer(o);
        if (!r) return;
        btns.forEach(function (x) { x.disabled = true; if (x.textContent === r.answer) x.classList.add('right'); });
        if (!r.right) b.classList.add('wrong');
        var why = bandIx() >= 2 ? (r.whyGa || r.why) : r.why;
        note.textContent = (r.right ? '' : 'It was “' + r.answer + '”. ') + (why || '');
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
    var C = window.GACheck, h = host(); clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar(T('Do thoradh', 'Your check'), null, board));
    wrap.appendChild(el('p', 'arc-sub', s.stopped
      ? 'We stopped here: two in a row were hard, and there is no need to go on.'
      : 'You have been through everything on your ladder.'));
    var chips = el('div', 'arc-tchips');
    C.ladder().forEach(function (u) {
      var st = s.res[u.id] || 'sin';
      var c = unitChip(u, st, hasCard(u.card) ? function () { cardScreen(u.card, u); } : null);
      if (s.score[u.id]) c.appendChild(el('em', null, s.score[u.id]));
      chips.appendChild(c);
    });
    wrap.appendChild(chips);

    var cur = band(), sug = s.suggested;
    var box = el('div', 'arc-check arc-check-lvl');
    box.appendChild(el('span', 'arc-check-k', T('Do leibhéal', 'Your level')));
    if (sug !== cur) {
      box.appendChild(el('b', null, 'From your answers you fit ' + sug));
      box.appendChild(el('span', 'arc-check-s', 'You are on ' + cur + ' now. Rounds follow your level.'));
      var row = el('div', 'arc-check-row');
      row.appendChild(button('arc-btn on', 'Change my level to ' + sug, function () {
        window.Profile.set(sug);
        box.textContent = '';
        box.appendChild(el('b', null, 'Level changed to ' + sug));
      }));
      row.appendChild(button('arc-btn', 'Keep ' + cur, function () { box.textContent = ''; box.appendChild(el('b', null, 'You stay on ' + cur)); }));
      box.appendChild(row);
    } else {
      box.appendChild(el('b', null, cur + ' fits you'));
    }
    wrap.appendChild(box);

    var nu = s.nextUnit;
    if (nu) {
      var nb = el('button', 'arc-mode on arc-next');
      nb.type = 'button';
      nb.appendChild(el('b', null, 'Next to learn: ' + nu.label.en + ' (' + nu.label.ga + ')'));
      nb.appendChild(el('span', null, hasCard(nu.card) ? 'a short card, then ten questions' : 'ten questions to practise it'));
      nb.addEventListener('click', function () { if (hasCard(nu.card)) cardScreen(nu.card, nu); else practiceUnit(nu); });
      wrap.appendChild(nb);
    } else {
      wrap.appendChild(el('p', 'arc-sub', 'Nothing left to learn from what we tested.'));
    }
    wrap.appendChild(button('arc-btn', T('Ar ais go dtí an clár', 'Back to the board'), board));
    h.appendChild(wrap);
  }

  /* ---- the cards (GA_CARDS): the little pages ------------------------------------------------
   * { kind, topic, name:{ga,en}, when:[{ga,en}], how:{ga,en}, table:{head,rows},
   *   ex:[{ga,en}], tip:{ga,en} }. "*x*" inside English text marks Irish: italic. */
  function rich(parent, text) {
    String(text || '').split(/(\*[^*]+\*)/).forEach(function (part) {
      if (!part) return;
      if (/^\*[^*]+\*$/.test(part)) parent.appendChild(el('i', 'arc-irish', part.slice(1, -1)));
      else parent.appendChild(document.createTextNode ? document.createTextNode(part) : el('span', null, part));
    });
    return parent;
  }
  function cardLang() { var a = loadArc(); return a.cl === 'ga' || a.cl === 'en' ? a.cl : (bandIx() >= 2 ? 'ga' : 'en'); }
  function pickL(o, lang) { return o ? (o[lang] || o.en || o.ga || '') : ''; }

  /* ---- tick the phrases you know ---------------------------------------------------
   * One list of every phrase, grouped by theme in band order. Ticking calls SRS.learn (the
   * phrase is never dealt again); unticking calls SRS.unlearn (the record goes, so it is new). */
  var KNOWN_THEMES = { aimsir: 'Weather', am: 'Time', baile: 'At home', beannachtai: 'Greetings', cabhair: 'Asking for help', ceiliuradh: 'Celebrations', comhra: 'Conversation', mise: 'About me', mothu: 'Feelings', rang: 'In class', siopa: 'Shopping' };
  function knownThemeLabel(id) { return KNOWN_THEMES[id] || GI.prettyTheme(id); }
  function knownScreen(g, pick) {
    VIEW = 'known';            // keeps the sheet's history entry: back returns to the sheet
    var h = host(); clear(h);
    var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    var G = GI.phraseList(), S = window.SRS;

    var wrap = el('div', 'arc-stats arc-known');
    wrap.style.setProperty('--g', g.hue);
    wrap.appendChild(topBar(pick ? 'Choose your own phrases' : 'Phrases you know', null, function () { sheet(g, true); }));
    wrap.appendChild(el('p', 'arc-sub', pick ? 'Tick the phrases you want to learn. With the My phrases topic on, rounds ask only these.'
      : 'Tick any phrase you already know. Ticked phrases are never asked again. Untick one to bring it back as new.'));
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
    box.type = 'search'; box.placeholder = 'Search the phrases'; box.setAttribute('aria-label', 'Search the phrases');
    wrap.appendChild(box);
    var groups = {}, order = [];
    G.list.forEach(function (e) {
      var gr = groups[e.th];
      if (!gr) { gr = groups[e.th] = { th: e.th, rows: [], ix: 9 }; order.push(gr); }
      gr.rows.push(e);
      gr.ix = Math.min(gr.ix, Math.max(0, BANDS.indexOf(e.b)));
    });
    order.forEach(function (gr, i) { gr.first = i; });
    order.sort(function (a, b) { return a.ix - b.ix || a.first - b.first; });
    var all = [];
    var list = el('div', 'arc-known-list');
    order.forEach(function (gr) {
      gr.rows.sort(function (a, b) { return BANDS.indexOf(a.b) - BANDS.indexOf(b.b); });
      gr.box = el('section', 'arc-known-group');
      var head = el('div', 'arc-known-head');
      head.appendChild(el('h3', null, knownThemeLabel(gr.th)));
      var tl = el('label', 'arc-known-all');
      gr.tog = el('input'); gr.tog.type = 'checkbox';
      tl.appendChild(gr.tog); tl.appendChild(el('span', null, pick ? 'All of these' : 'I know all of these'));
      head.appendChild(tl);
      gr.box.appendChild(head);
      gr.items = [];
      gr.rows.forEach(function (e) {
        var row = el('label', 'arc-known-row');
        var cb = el('input'); cb.type = 'checkbox';
        var txt = el('span', 'arc-known-txt');
        txt.appendChild(el('span', 'arc-known-en', e.en));
        txt.appendChild(el('span', 'arc-known-tx', e.ga));
        row.appendChild(cb); row.appendChild(txt);
        cb.addEventListener('change', function () {
          setOn(e.id, cb.checked);
          paint();
        });
        var it = { e: e, cb: cb, row: row, hay: (e.en + ' ' + e.ga).toLowerCase() };
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

  function cardScreen(key, unit) {
    var c = window.GA_CARDS && window.GA_CARDS[key];
    pushView('card');
    var h = host(); clear(h);
    var lang = cardLang();
    var wrap = el('div', 'arc-stats arc-tcard');
    wrap.style.setProperty('--g', '#e8b64a');
    var top = topBar(c ? pickL(c.name, lang) : key);
    if (c) {
      top.appendChild(button('arc-lang', lang === 'ga' ? 'EN' : 'GA', function () {
        var a = loadArc(); a.cl = lang === 'ga' ? 'en' : 'ga'; saveArc(a); cardScreen(key, unit);
      }, lang === 'ga' ? 'Show in English' : 'Taispeáin as Gaeilge'));
    }
    wrap.appendChild(top);
    var L = function (ga, en) { return lang === 'ga' ? ga : en; };

    if (c) {
      if (c.name && lang === 'ga' && c.name.en) wrap.appendChild(el('p', 'arc-sub', c.name.en));
      if (c.when && c.when.length) {
        wrap.appendChild(el('div', 'arc-group', L('Cathain a úsáidtear é', 'When it is used')));
        var ul = el('ul', 'arc-when');
        c.when.forEach(function (w) { ul.appendChild(rich(el('li'), pickL(w, lang))); });
        wrap.appendChild(ul);
      }
      if (c.how) {
        wrap.appendChild(el('div', 'arc-group', L('Conas a dhéantar é', 'How it is formed')));
        wrap.appendChild(rich(el('p', 'arc-how'), pickL(c.how, lang)));
      }
      if (c.table && c.table.rows && c.table.rows.length) {
        var cols = Math.max((c.table.head || []).length, c.table.rows[0].length);
        var tb = el('div', 'arc-ctable');
        tb.style.setProperty('--cols', String(cols));
        (c.table.head || []).forEach(function (hd) { tb.appendChild(el('span', 'arc-ct-h', hd)); });
        c.table.rows.forEach(function (row) {
          row.forEach(function (cell, i) { tb.appendChild(rich(el(i === 0 ? 'b' : 'span', 'arc-ct-c'), cell)); });
        });
        wrap.appendChild(tb);
      }
      if (c.ex && c.ex.length) {
        wrap.appendChild(el('div', 'arc-group', L('Samplaí', 'Examples')));
        c.ex.forEach(function (ex) {
          var e = el('div', 'arc-ex');
          e.appendChild(rich(el('div', 'arc-ex-ga'), ex.ga));
          e.appendChild(rich(el('div', 'arc-ex-en'), ex.en));
          wrap.appendChild(e);
        });
      }
      if (c.tip) {
        wrap.appendChild(el('div', 'arc-group', L('Leid', 'Tip')));
        wrap.appendChild(rich(el('p', 'arc-how arc-tip'), pickL(c.tip, lang)));
      }
    } else {
      wrap.appendChild(el('p', 'arc-sub', 'No card for this yet. Practise it all the same.'));
    }

    var u = unit || (window.GACheck && window.GACheck.UNITS.filter(function (x) { return x.card === key; })[0]);
    if (u && playable({ kind: u.k })) {
      var btns = el('div', 'arc-modes');
      var pb = el('button', 'arc-mode on');
      pb.type = 'button';
      pb.appendChild(el('b', null, 'Practise: ' + u.label.en + ' · 10 questions'));
      pb.appendChild(el('span', null, 'Go réidh, no clock, just this'));
      pb.addEventListener('click', function () { practiceUnit(u); });
      btns.appendChild(pb);
      wrap.appendChild(btns);
    }
    h.appendChild(wrap);
  }

  /* ---- first open: the placement test ------------------------------------------------------------
   * About twelve questions, three a band from A1 to B2: two grammar or verb gaps
   * from different banks and one word, all tapped from four real Irish options,
   * with "Níl a fhios agam" so a guess is never forced. The level is the highest band
   * passed (two of three) with every band below it passed. */
  var PLACE_ITEMS = null;
  function placementItems() {
    try { return GI.placementItems(); } catch (e) { return []; }
  }
  function placement() {
    VIEW = 'place';
    var items = PLACE_ITEMS = placementItems();
    var i = 0, right = {}, asked = {}, stopped = false;
    function weakRun() {
      // two finished bands in a row under two right ends the test
      var per = {};
      items.forEach(function (x) { per[x.band] = (per[x.band] || 0) + 1; });
      var done = GC.BANDS.filter(function (b) { return per[b] && asked[b] === per[b]; });
      var n = done.length;
      return n >= 2 && (right[done[n - 1]] || 0) < 2 && (right[done[n - 2]] || 0) < 2;
    }
    function ask() {
      var h = host(); clear(h);
      if (i >= items.length || stopped) { result(); return; }
      var it = items[i];
      var wrap = el('div', 'arc-stats arc-place');
      var top = el('div', 'arc-stats-top');
      top.appendChild(el('h2', null, T('Do leibhéal', 'Find your level')));
      wrap.appendChild(top);
      wrap.appendChild(el('p', 'arc-sub', 'Question ' + (i + 1) + ' of ' + items.length + '. Not sure? Tap “Níl a fhios agam”: it is not a failure.'));
      wrap.appendChild(bar(i, items.length, 'var(--accent)'));
      wrap.appendChild(el('div', 'g-prompt arc-place-q', it.prompt));
      var sub = el('div', 'g-sub');
      if (it.peek) {
        sub.appendChild(button('g-peek', 'English', function () { sub.textContent = it.peek; sub.classList.add('shown'); }));
        wrap.appendChild(sub);
      }
      var opts = el('div', 'g-options'), btns = [], locked = false;
      var finish = function (ok, picked) {
        if (locked) return; locked = true;
        asked[it.band] = (asked[it.band] || 0) + 1;
        if (ok) right[it.band] = (right[it.band] || 0) + 1;
        btns.forEach(function (x) { x.disabled = true; if (x.textContent === it.answer) x.classList.add('right'); });
        if (picked && !ok) picked.classList.add('wrong');
        i++;
        if (weakRun()) stopped = true;
        setTimeout(ask, ok ? 450 : 1100);
      };
      it.options.forEach(function (o) {
        var b = button('g-opt', o, function () { finish(it.accept.indexOf(o) !== -1, b); });
        btns.push(b); opts.appendChild(b);
      });
      wrap.appendChild(opts);
      wrap.appendChild(button('arc-wtbtn arc-wt-idk', 'Níl a fhios agam', function () { finish(false, null); }));
      wrap.appendChild(button('arc-link arc-skip', 'Skip the test: start at A1', function () {
        var a = loadArc(); a.noPlace = true; saveArc(a); window.Profile.set('A1'); window.Profile.markPlaced(); board();
      }));
      h.appendChild(wrap);
    }
    function result() {
      var lvl = 'A1';
      for (var k = 0; k < GC.BANDS.length; k++) {
        var b = GC.BANDS[k];
        if (asked[b] && (right[b] || 0) >= Math.min(2, asked[b])) lvl = b; else break;
      }
      window.Profile.set(lvl); window.Profile.markPlaced();
      var h = host(); clear(h);
      var wrap = el('div', 'arc-stats');
      wrap.appendChild(el('h2', null, T('Do leibhéal', 'Your level')));
      wrap.appendChild(el('div', 'arc-place-band', lvl));
      var tot = 0, ok = 0;
      GC.BANDS.forEach(function (b) { tot += asked[b] || 0; ok += right[b] || 0; });
      wrap.appendChild(el('p', 'arc-sub', ok + ' of ' + tot + ' right. Rounds start here and reach one band higher. You can change it any time from the board.'));
      wrap.appendChild(button('arc-btn on', T('Imir', 'Start playing'), board));
      h.appendChild(wrap);
    }
    ask();
  }

  /* ---- the level ------------------------------------------------------------------------------------- */
  function levelPicker() {
    pushView('level');
    var h = host();
    clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar(T('Do leibhéal', 'Your level')));
    wrap.appendChild(el('p', 'arc-sub', 'Decides which band rounds start in and how far they can climb. Until B1 the explanations are in English.'));
    var list = el('div', 'arc-picks');
    var cur = band();
    window.Profile.all().forEach(function (pr) {
      var b = el('button', 'arc-pick' + (pr.name === cur ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('b', null, pr.label));
      b.appendChild(el('span', null, pr.name === cur ? 'your level now' : ''));
      b.addEventListener('click', function () { window.Profile.set(pr.name); window.Profile.markPlaced(); goBack(); });
      list.appendChild(b);
    });
    wrap.appendChild(list);
    if (placementItems().length >= 6) {
      wrap.appendChild(button('arc-wtbtn', 'Take the placement test again', function () {
        var a = loadArc(); a.noPlace = false; saveArc(a); placement();
      }));
    }
    h.appendChild(wrap);
  }

  /* ---- the numbers ----------------------------------------------------------------------------------------
   * Derived from the round history; anything with too little evidence shows "not yet". */
  function stats(g) {
    pushView('stats');
    var h = host();
    clear(h);
    var p = GS.profileOf(g.key);
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar(g.ga));
    wrap.appendChild(el('p', 'arc-sub', g.en + ' · ' + p.plays + (p.plays === 1 ? ' round' : ' rounds')));
    var figs = el('div', 'arc-figs');
    var fig = function (k, v, note, gold) {
      var f = el('div', 'arc-fig' + (gold ? ' gold' : ''));
      f.appendChild(el('div', 'arc-fig-k', k));
      f.appendChild(el('div', 'arc-fig-v' + (v == null ? ' dim' : ''), v == null ? 'not yet' : v));
      if (note) f.appendChild(el('div', 'arc-fig-n', note));
      figs.appendChild(f);
    };
    fig('Record', p.pb ? num(p.pb) : null, null, true);
    fig('Usual', p.typical ? num(p.typical) : null, 'median of the last ten');
    fig('Accuracy', p.accuracy == null ? null : Math.round(p.accuracy * 100) + '%',
        p.recentAccuracy == null || p.accuracy == null ? 'needs 20 answers' : 'last ten: ' + Math.round(p.recentAccuracy * 100) + '%');
    fig('Pace', p.perMin == null ? null : p.perMin.toFixed(1), p.perMin == null ? 'needs three rounds' : 'answers a minute');
    fig('Best run', p.bestRun || null, 'in a row');
    fig('Highest band', p.bestBand, 'the hardest you got right');
    wrap.appendChild(figs);
    if (p.scores.length > 1) {
      var chart = el('div', 'arc-chart');
      chart.appendChild(el('h3', null, 'Last ' + Math.min(20, p.scores.length) + ' rounds'));
      chart.appendChild(spark(p.scores, g.hue, 300, 110));
      wrap.appendChild(chart);
    } else {
      wrap.appendChild(el('p', 'arc-empty', 'Play a few times and this shows whether you are improving.'));
    }
    h.appendChild(wrap);
  }

  /* ---- never a blank screen ---------------------------------------------------------------------------------
   * A phone has no devtools: whatever goes wrong has to say so on the page. */
  var NEEDS = [
    ['GameScore', 'profileOf'], ['GameScore', 'ghostAt'], ['GAItems', 'next'], ['GameRound', 'run'],
    ['GACheck', 'session'], ['GA', 'check'], ['Profile', 'current']
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
    w.appendChild(el('div', 'arc-brand', 'Líofa'));
    var box = el('div', 'arc-fail');
    box.appendChild(el('b', null, title));
    box.appendChild(el('p', null, detail));
    var marks = [];
    if (window.Perf && window.Perf.BUILD) marks.push('build ' + window.Perf.BUILD);
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      marks.push('sw ' + navigator.serviceWorker.controller.scriptURL.replace(/^.*\//, ''));
    } else marks.push('no service worker');
    box.appendChild(el('code', 'arc-fail-build', marks.join('  ·  ')));
    var b = button('arc-back', 'Clear and reload');
    b.addEventListener('click', function () {
      // deleting the caches is not enough: the worker stays registered, so drop both
      b.disabled = true;
      b.textContent = 'Clearing…';
      var reload = function () { location.reload(); };
      var unreg = (navigator.serviceWorker && navigator.serviceWorker.getRegistrations)
        ? navigator.serviceWorker.getRegistrations().then(function (rs) {
            return Promise.all(rs.map(function (r) { return r.unregister(); }));
          })
        : Promise.resolve();
      unreg.then(function () {
        if (!window.caches || !caches.keys) return null;
        return caches.keys().then(function (names) { return Promise.all(names.map(function (n) { return caches.delete(n); })); });
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
        fail('Mixed versions',
             'The browser served old files from its cache next to new ones. Missing: ' + missing.join(', ') +
             '. Press Clear and reload to start again.');
        return;
      }
      board();
    } catch (e) {
      fail('Something went wrong opening the app', (e && e.message ? e.message : String(e)) + '. Press Clear and reload.');
    }
  }

  window.GAArcade = { board: board, placement: placement, knownScreen: knownScreen, cardScreen: cardScreen, checkRun: checkRun,
    wordTest: wordTest, sheet: sheet, GAMES: GAMES, levelPicker: levelPicker };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* UPDATES. The worker installs a new version in the background and takes over,
   * but a home-screen app resumes from memory and could stay old for days. So: look
   * for a new version every time the app comes back to the front, and when one has
   * taken over, reload at once on the board, or the next time the board is drawn
   * if a round or a test is on screen (never in the middle of one). */
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
