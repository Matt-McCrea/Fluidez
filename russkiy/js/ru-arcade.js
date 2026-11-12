/* ============================================================================
 * RU ARCADE: Svobodno's whole application layer (ported from arabiya/js/ar-arcade.js).
 *
 *   0. FIRST OPEN. Until the exit test is passed the home is stage 0 (ru-bukvy.js).
 *   1. THE BOARD. A big Играть (the mix), a row of three (Глаголы, Слова, Фразы),
 *      the grammar row (Падежи, Вид, Движение, Числа) and small Буквы and Говорить
 *      tiles. Each label is Russian, with its transliteration and English under
 *      it. A tile whose bank is empty says "coming soon" and is not tappable.
 *   2. THE SHEET: calm (10 questions, no clock) or against the clock (60 s), and a
 *      topic picker.
 *   3. PROGRESS, the weekly check, the cards (RU_CARDS), settings.
 *   4. A service worker of its own that looks for updates whenever the app returns.
 * Everything keeps to localStorage keys that start `svobodno.`.
 * ========================================================================== */
(function () {
  var UI = window.UI, GS = window.GameScore, GI = window.RUItems, GC = window.RUCore;

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

  /* ---- what the arcade remembers (svobodno.arcade) ------------------------------ */
  var AKEY = 'svobodno.arcade';
  function loadArc() { try { return JSON.parse(localStorage.getItem(AKEY)) || {}; } catch (e) { return {}; } }
  function saveArc(o) { try { localStorage.setItem(AKEY, JSON.stringify(o)); } catch (e) {} }

  /* ---- the games --------------------------------------------------------------- */
  var GAMES = [
    { key: 'igrat', kind: 'igrat', hue: '#e3a83a', ru: 'Игра́ть', tr: 'Igrát', en: 'Play', rule: 'A bit of everything: verbs, words, phrases and grammar' },
    { key: 'glagoly', kind: 'glagoly', hue: '#d2402f', ru: 'Глаго́лы', tr: 'Glagóly', en: 'Verbs', rule: 'The right form of the verb, in a sentence' },
    { key: 'slova', kind: 'slova', hue: '#c77d2e', ru: 'Слова́', tr: 'Slová', en: 'Words', rule: 'The commonest words first' },
    { key: 'frazy', kind: 'frazy', hue: '#b8577a', ru: 'Фра́зы', tr: 'Frázy', en: 'Phrases', rule: 'Everyday phrases, whole' },
    { key: 'padezhi', kind: 'padezhi', hue: '#3f8f8a', ru: 'Падежи́', tr: 'Padezhí', en: 'Cases', rule: 'The ending a word takes after a preposition or verb' },
    { key: 'vid', kind: 'vid', hue: '#7a6fd0', ru: 'Вид', tr: 'Vid', en: 'Aspect', rule: 'Which of the two verbs fits: going on, or done' },
    { key: 'dvizhenie', kind: 'dvizhenie', hue: '#3d86c6', ru: 'Движе́ние', tr: 'Dvizhéniye', en: 'Going', rule: 'Verbs of going: on foot, by transport, one way or back and forth' },
    { key: 'chisla', kind: 'chisla', hue: '#9aa83a', ru: 'Числа́', tr: 'Chislá', en: 'Numbers', rule: 'A number and the form of the word after it' },
    { key: 'bukvy', kind: 'bukvy', hue: '#e3a83a', ru: 'Бу́квы', tr: 'Búkvy', en: 'Letters', rule: 'The Cyrillic letters, and stress' }
  ];
  function playable(g) { return GI.bankCount(g.kind) > 0; }

  /* ---- navigation: every back goes to the board, and the phone's back counts ------- */
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
        if (x) { x.click(); return; }
      }
      board();
    });
  }
  function topBar(title, sub, onBack) {
    var top = el('div', 'arc-stats-top');
    top.appendChild(button('arc-back', '←', onBack || goBack, 'Back'));
    top.appendChild(el('h2', null, title));
    return top;
  }
  function tileLabel(g, parent) {
    parent.appendChild(UI.ru(g.ru, 'arc-name'));
    parent.appendChild(el('span', 'arc-tr', g.tr));
    parent.appendChild(el('span', 'arc-en', g.en));
  }

  /* ---- the board ------------------------------------------------------------------ */
  function board() {
    if (UPDATE_READY) { location.reload(); return; }
    VIEW = 'board';
    var h = host();
    if (!h) return;
    var H = window.RUBukvy, SK = window.RUSpeak;
    if (SK && SK.mode() === 'talk') { SK.talkHome(); return; }       // Talk (the default): the speaking side, any time
    if (H && !H.unlocked()) { H.path(); return; }                     // Script before the test: the letters course
    clear(h);
    var wrap = el('div', 'arc');

    var top = el('div', 'arc-top');
    var brand = el('div', 'arc-brand');
    brand.appendChild(UI.ru('Свобо́дно', 'arc-brand-ru'));
    brand.appendChild(el('span', null, ' Svobodno'));
    top.appendChild(brand);
    top.appendChild(button('arc-level', band() + ' ▾', levelPicker, 'Your level'));
    top.appendChild(button('arc-gear', '⚙', settings, 'Settings'));
    wrap.appendChild(top);
    if (SK) wrap.appendChild(SK.modeToggle());

    wrap.appendChild(ilabCard(GAMES[0]));
    if (window.RUCheck && window.RUCheck.due()) wrap.appendChild(checkCard());

    wrap.appendChild(tileRow('arc-grid arc-row3', GAMES.slice(1, 4)));
    wrap.appendChild(tileRow('arc-grid arc-row4', GAMES.slice(4, 8)));
    var pair = el('div', 'arc-grid arc-row2');
    pair.appendChild(bukvyTile(GAMES[8]));
    wrap.appendChild(pair);
    wrap.appendChild(progressPanel());

    wrap.appendChild(el('div', 'arc-foot',
      'Words and forms: OpenRussian.org (CC BY-SA 4.0).'));
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
      tileLabel(g, tile);
      if (!ok) {
        tile.appendChild(el('span', 'arc-soon', 'coming soon'));
      } else {
        tile.appendChild(el('span', 'arc-pb' + (p.pb ? '' : ' none'), p.pb ? num(p.pb) : 'no record'));
        if (p.pb) tile.appendChild(el('span', 'arc-pb-k', mk.label ? 'record · ' + mk.label : 'record'));
        if (p.scores.length > 1) tile.appendChild(spark(p.scores, g.hue, 120, 20));
        tile.addEventListener('click', function () { sheet(g); });
        if (p.plays) {
          tile.appendChild(button('arc-data', '≡', function (e) { e.stopPropagation(); stats(mk.g); }, 'Stats: ' + g.en));
        }
      }
      grid.appendChild(tile);
    });
    return grid;
  }
  function bukvyTile(g) {
    var tile = el('button', 'arc-tile arc-small');
    tile.type = 'button';
    tile.style.setProperty('--g', g.hue);
    tileLabel(g, tile);
    tile.addEventListener('click', function () { pushView('bukvy'); window.RUBukvy.path(); });
    return tile;
  }


  /* ---- records per shape (one for each clock mode) ---------------------------------- */
  function modeKey(g, m) { return g.key + ':' + m; }
  function shelfStats(g) {
    var pc = GS.profileOf(modeKey(g, 'c')), pt = GS.profileOf(modeKey(g, 't'));
    var useT = !pc.plays && pt.plays;
    var p = useT ? pt : pc;
    p = Object.assign({}, p, { plays: pc.plays + pt.plays });
    var sg = { key: modeKey(g, useT ? 't' : 'c'), name: g.tr, en: g.en, rule: g.rule, hue: g.hue };
    return { p: p, g: sg, label: p.pb ? (useT ? '10' : '60 s') : null };
  }

  function ilabCard(g) {
    var mk = shelfStats(g), ok = playable(g);
    var c = el('button', 'arc-jugar');
    c.type = 'button';
    c.style.setProperty('--g', g.hue);
    if (!ok) c.disabled = true;
    var k = el('span', 'arc-jugar-k');
    k.appendChild(UI.ru(g.ru, 'big'));
    k.appendChild(document.createTextNode(' ' + g.tr));
    c.appendChild(k);
    c.appendChild(el('span', 'arc-jugar-t', g.en + ': a bit of everything'));
    c.appendChild(el('span', 'arc-jugar-s', !ok ? 'coming soon'
      : mk.p.pb ? 'record ' + num(mk.p.pb) + ' · ' + mk.label : 'Verbs, words, phrases and grammar'));
    if (ok) c.addEventListener('click', function () { sheet(g); });
    return c;
  }

  /* ---- the sheet: which mode, and which topics ----------------------------------------- */
  function lastMode() { var a = loadArc(); return a.mode === 't' || a.mode === 'c' ? a.mode : 't'; }
  function chosen(key) { var a = loadArc(); return (a.sel && a.sel[key]) || []; }
  function saveChosen(key, ts) { var a = loadArc(); a.sel = a.sel || {}; a.sel[key] = ts; saveArc(a); }
  function chosenWordTheme() {
    var a = loadArc(), id = a.wtheme;
    if (!id) return '';
    return GI.grindThemes().some(function (t) { return t.id === id; }) ? id : '';
  }
  function saveWordTheme(id) { var a = loadArc(); a.wtheme = id || ''; saveArc(a); }
  function unitsFor(g) {
    if (!window.RUCheck) return [];
    return window.RUCheck.UNITS.filter(function (u) {
      return u.k === g.kind && GI.bank(u.k).some(function (r) { return u.t == null || r.t === u.t; });
    });
  }
  function hasCard(k) { var c = window.RU_CARDS; return !!(c && k && c[k]); }
  function unitLabel(u) {
    var s = el('span');
    s.appendChild(UI.ru(u.label.ru));
    s.appendChild(document.createTextNode(' ' + u.label.en));
    return s;
  }

  function sheet(g, noPush) {
    if (g.key === 'bukvy') { pushView('bukvy'); window.RUBukvy.path(); return; }
    if (noPush) VIEW = 'sheet'; else pushView('sheet');
    var h = host();
    clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.style.setProperty('--g', g.hue);
    var tb = topBar(g.tr);
    tb.appendChild(UI.ru(g.ru, 'arc-title-ru'));
    wrap.appendChild(tb);
    wrap.appendChild(el('p', 'arc-sub', g.en + '. ' + g.rule));

    var units = unitsFor(g);
    if (units.length > 1) {
      wrap.appendChild(el('div', 'arc-group', 'Topics'));
      var chips = el('div', 'arc-chips');
      var sel = chosen(g.key), byKey = {};
      var all = button('arc-chip', 'All of them');
      var paint = function () {
        all.classList.toggle('on', !sel.length);
        Object.keys(byKey).forEach(function (k) { byKey[k].classList.toggle('on', sel.indexOf(k) !== -1); });
      };
      all.addEventListener('click', function () { sel = []; saveChosen(g.key, sel); paint(); });
      chips.appendChild(all);
      units.forEach(function (u) {
        var key = u.t;
        var b = button('arc-chip', null, function () {
          var i = sel.indexOf(key);
          if (i === -1) sel.push(key); else sel.splice(i, 1);
          saveChosen(g.key, sel); paint();
        });
        b.appendChild(unitLabel(u));
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
      wrap.appendChild(button('arc-wtbtn', 'Read the card', function () { cardScreen(units[0].card, units[0]); }));
    }

    if (g.key === 'frazy') {
      var pfocus = chosenFocus(), pcov = el('div', 'arc-progress'), pcovLine = el('div', 'arc-progress-all');
      pcov.appendChild(pcovLine);
      wrap.appendChild(pcov);
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
      var fthemes = Object.keys(GI.phraseList().byTheme);
      if (fthemes.length > 1) {
        wrap.appendChild(el('div', 'arc-group', 'Topics to focus on'));
        var fchips = el('div', 'arc-chips arc-focus'), fby = {};
        var fall = button('arc-chip', 'All topics');
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
      var convoBox = el('div', 'cv-sheet');
      var paintConvos = function () {
        clear(convoBox);
        if (window.RUConvo) window.RUConvo.section(convoBox, pfocus.filter(function (t) { return t !== 'mine'; }), function () { sheet(g, true); });
      };
      paintConvos();
      wrap.appendChild(convoBox);
    }

    if (g.key === 'slova') {
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
      var themes = GI.grindThemes();
      if (themes.length) {
        wrap.appendChild(el('div', 'arc-group', 'Theme'));
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
    var mode = function (m, ru, tr, note) {
      var b = el('button', 'arc-mode' + (m === last ? ' on' : ''));
      b.type = 'button';
      var t = el('b');
      t.appendChild(UI.ru(ru));
      t.appendChild(document.createTextNode(' ' + tr));
      b.appendChild(t);
      b.appendChild(el('span', null, note));
      b.addEventListener('click', function () { startShelf(g, m); });
      modes.appendChild(b);
    };
    mode('t', 'Споко́йно', 'Calm', '10 questions, no clock; speed only adds points');
    mode('c', 'На вре́мя', 'Against the clock', '60 s, the clock stops when you lock the phone');
    wrap.appendChild(modes);
    h.appendChild(wrap);
  }

  function chosenFocus() { var f = loadArc().focus; return Array.isArray(f) ? f.slice() : []; }
  function saveFocus(f) { var a = loadArc(); a.focus = f; saveArc(a); }
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
  function startShelf(g, m, extra) {
    var a = loadArc(); a.mode = m; saveArc(a);
    VIEW = 'round';                       // the sheet owns the history entry; a round shares it
    var cfg = { key: modeKey(g, m), title: g.tr, kind: g.kind, hue: g.hue, onExit: board };
    if (m === 't') { cfg.count = 10; cfg.duration = null; } else cfg.duration = 60000;
    var sel = chosen(g.key);
    if (sel.length) cfg.topics = sel;
    if (g.key === 'slova') { var wth = chosenWordTheme(); if (wth) cfg.theme = wth; }
    if (g.key === 'frazy' && focusThemes(chosenFocus()).length) cfg.themes = focusThemes(chosenFocus());     // the Play mix ignores the focus
    if (extra) Object.keys(extra).forEach(function (k) { cfg[k] = extra[k]; });
    window.GameRound.run(host(), cfg);
  }
  /* Talk mode's phrase practice: ten phrases led by the sound, from the topics in focus. */
  function practisePhrases() {
    var g = GAMES.filter(function (x) { return x.key === 'frazy'; })[0];
    if (g) startShelf(g, 't', { talk: true });
  }
  // ten untimed questions on one unit (from a card or a check result)
  function practiceUnit(u) {
    var g = GAMES.filter(function (x) { return x.kind === u.k; })[0];
    if (!g) return;
    VIEW = 'round';
    var cfg = { key: modeKey(g, 't'), title: g.tr, kind: g.kind, hue: g.hue, onExit: board, count: 10, duration: null };
    if (u.t) cfg.topics = [u.t];
    window.GameRound.run(host(), cfg);
  }

  /* ---- the progress panel --------------------------------------------------------------- */
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
    b.appendChild(unitLabel(u));
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
    var C = window.RUCheck;
    var pr = C.progress();
    var panel = el('section', 'arc-prog');
    panel.appendChild(el('div', 'arc-group', 'Your progress'));

    var w = pr.words;
    var rw = el('button', 'arc-prow');
    rw.type = 'button';
    rw.appendChild(el('span', 'arc-prow-k', 'Words'));
    rw.appendChild(el('span', 'arc-prow-v', w.of ? GI.thousands(w.n) + ' of ' + GI.thousands(w.of) : 'coming soon'));
    rw.appendChild(bar(w.n, w.of, '#c77d2e'));
    rw.appendChild(el('span', 'arc-prow-s', w.of ? 'the ' + GI.thousands(w.of) + ' commonest words · by theme ›' : 'words are on the way'));
    rw.addEventListener('click', wordsDetail);
    panel.appendChild(rw);

    var rv = el('div', 'arc-prow');
    rv.appendChild(el('span', 'arc-prow-k', 'Grammar'));
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
    rf.appendChild(el('span', 'arc-prow-k', 'Phrases'));
    rf.appendChild(el('span', 'arc-prow-v', ph.of ? GI.thousands(ph.n) + ' of ' + GI.thousands(ph.of) : 'coming soon'));
    rf.appendChild(bar(ph.n, ph.of, '#b8577a'));
    panel.appendChild(rf);
    return panel;
  }
  function wordsDetail() {
    pushView('words');
    var h = host(); clear(h);
    var G = GI.grindList(), wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar('Words'));
    var cv = GI.coverage(null);
    wrap.appendChild(el('p', 'arc-sub', 'Words you have got right at least once count. ' + GI.thousands(G.list.length) + ' in all; ' + cv.text + '.'));
    wrap.appendChild(el('div', 'arc-group', 'By theme'));
    GI.grindThemes().sort(function (a, b) { return a.label < b.label ? -1 : 1; }).forEach(function (t) {
      var c = GI.coverage(t.id).theme;
      var r = el('div', 'arc-drow');
      r.appendChild(el('span', 'arc-drow-k', t.label));
      r.appendChild(el('span', 'arc-drow-v', c.n + ' of ' + c.of));
      r.appendChild(bar(c.n, c.of, '#c77d2e'));
      wrap.appendChild(r);
    });
    h.appendChild(wrap);
  }

  /* ---- the weekly check ------------------------------------------------------------------- */
  function checkCard() {
    var c = el('div', 'arc-check');
    c.appendChild(el('span', 'arc-check-k', 'Weekly check'));
    c.appendChild(el('b', null, 'See which tenses and topics you have got'));
    c.appendChild(el('span', 'arc-check-s', 'Three sentences each, no clock. It tells you what to learn next.'));
    var row = el('div', 'arc-check-row');
    row.appendChild(button('arc-btn on', 'Start · 3 min', checkRun));
    row.appendChild(button('arc-btn', 'Later', function () { window.RUCheck.snooze(); board(); }));
    c.appendChild(row);
    return c;
  }
  function checkRun() {
    pushView('check');
    drawCheck(window.RUCheck.session());
  }
  function gapLevelFor(g) {
    return GC.sentenceLevel(g.b || 'A1');
  }
  function drawCheck(s) {
    if (s.done) { checkResults(s); return; }
    var h = host(); clear(h);
    var wrap = el('div', 'arc-stats arc-checkrun');
    wrap.appendChild(topBar('Weekly check'));
    var u = s.unit(), g = s.item();
    var pos = el('div', 'arc-check-pos');
    pos.appendChild(el('b', null, u.label.en));
    pos.appendChild(el('span', null, ' · ' + (s.index() + 1) + ' of ' + s.count()));
    wrap.appendChild(pos);
    wrap.appendChild(bar(s.step() + s.index() / Math.max(1, s.count()), s.steps(), 'var(--accent)'));
    var lvl = gapLevelFor(g);
    var q = el('div', 'g-prompt is-ru arc-check-q');
    g.q.replace(/___+/g, '＿＿＿').split('＿＿＿').forEach(function (part, i) {
      if (i) q.appendChild(el('span', 'g-gap', '＿＿＿'));
      if (part) q.appendChild(UI.ruText(part, lvl, null));
    });
    wrap.appendChild(q);
    var sub = el('div', 'g-sub');
    if (g.c) sub.appendChild(el('div', 'g-cue', g.c));
    if (g.e) {
      var pk = button('g-peek', 'English', function () { clear(pk); UI.rich(pk, g.e); pk.classList.add('shown'); });
      sub.appendChild(pk);
    }
    if (g.c || g.e) wrap.appendChild(sub);
    var opts = el('div', 'g-options'), btns = [];
    var note = el('div', 'arc-check-note');
    var more = button('arc-btn on arc-check-next', 'Next');
    more.hidden = true;
    GC.shuffle(g.o.slice()).forEach(function (o) {
      var b = button('g-opt has-ru', null, function () {
        var r = s.answer(o);
        if (!r) return;
        btns.forEach(function (x) { x.disabled = true; if (x._val === r.answer) x.classList.add('right'); });
        if (!r.right) b.classList.add('wrong');
        clear(note);
        if (!r.right) { note.appendChild(document.createTextNode('It was ')); note.appendChild(UI.ru(r.answer)); note.appendChild(document.createTextNode('. ')); }
        if (r.why) UI.rich(note, r.why);
        if (window.RU && RU.autoplay) RU.autoplay(r.answer, 'ru');
        more.hidden = false;
      });
      b._val = o;
      b.appendChild(UI.ruText(o, lvl, null));
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
    var C = window.RUCheck, h = host(); clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar('Your check', null, board));
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
    box.appendChild(el('span', 'arc-check-k', 'Your level'));
    if (sug !== cur) {
      box.appendChild(el('b', null, 'From your answers you fit ' + sug));
      box.appendChild(el('span', 'arc-check-s', 'You are on ' + cur + ' now. Rounds follow your level.'));
      var row = el('div', 'arc-check-row');
      row.appendChild(button('arc-btn on', 'Change my level to ' + sug, function () {
        window.Profile.set(sug);
        clear(box);
        box.appendChild(el('b', null, 'Level changed to ' + sug));
      }));
      row.appendChild(button('arc-btn', 'Keep ' + cur, function () { clear(box); box.appendChild(el('b', null, 'You stay on ' + cur)); }));
      box.appendChild(row);
    } else {
      box.appendChild(el('b', null, cur + ' fits you'));
    }
    wrap.appendChild(box);

    var nu = s.nextUnit;
    if (nu) {
      var nb = el('button', 'arc-mode on arc-next');
      nb.type = 'button';
      nb.appendChild(el('b', null, 'Next to learn: ' + nu.label.en));
      nb.appendChild(el('span', null, hasCard(nu.card) ? 'a short card, then ten questions' : 'ten questions to practise it'));
      nb.addEventListener('click', function () { if (hasCard(nu.card)) cardScreen(nu.card, nu); else practiceUnit(nu); });
      wrap.appendChild(nb);
    } else {
      wrap.appendChild(el('p', 'arc-sub', 'Nothing left to learn from what we tested.'));
    }
    wrap.appendChild(button('arc-btn', 'Back to the board', board));
    h.appendChild(wrap);
  }

  /* ---- the cards (RU_CARDS): the little pages ------------------------------------------------
   * { kind, name:{ru,en}, when:[{en}], how:{en}, table:{head,rows}, ex:[{ru,en}], tip:{en} }.
   * "*x*" inside English text marks Russian. English explains; Russian is the example. */
  function en(o) { return o ? (o.en || o.ru || '') : ''; }
  /* ---- tick the phrases you know ---------------------------------------------------
   * One list of every phrase, grouped by theme in band order. Ticking calls SRS.learn (the
   * phrase is never dealt again); unticking calls SRS.unlearn (the record goes, so it is new). */
  var KNOWN_THEMES = { greet: 'Greetings', intro: 'Introductions', ask: 'Asking questions', shop: 'Shopping', food: 'Food', time: 'Time', feel: 'Feelings', help: 'Asking for help', social: 'Socialising', travel: 'Travel' };
  function knownThemeLabel(id) { return KNOWN_THEMES[id] || GI.prettyTheme(id); }
  function knownScreen(g, pick) {
    VIEW = 'known';            // keeps the sheet's history entry: back returns to the sheet
    var h = host(); clear(h);
    var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    var G = GI.phraseList(), S = window.SRS;
    function textOf(e) { return String(e.raw.ru || '').trim(); }
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
        var tx = textOf(e), tw = el('span', 'arc-known-tx');
        tw.appendChild(UI.ru(tx));
        tw.appendChild(UI.tr(GI.trOf(e.raw), 'block'));
        txt.appendChild(tw);
        row.appendChild(cb); row.appendChild(txt);
        cb.addEventListener('change', function () {
          setOn(e.id, cb.checked);
          paint();
        });
        var it = { e: e, cb: cb, row: row, hay: (e.en + ' ' + RU.strip(textOf(e)) + ' ' + textOf(e) + ' ' + GI.trOf(e.raw)).toLowerCase() };
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
    var c = window.RU_CARDS && window.RU_CARDS[key];
    pushView('card');
    var h = host(); clear(h);
    var wrap = el('div', 'arc-stats arc-tcard');
    wrap.style.setProperty('--g', '#e3a83a');
    var top = topBar(c ? en(c.name) : key);
    if (c && c.name && c.name.ru) top.appendChild(UI.ru(c.name.ru, 'arc-title-ru'));
    wrap.appendChild(top);

    if (c) {
      if (c.when && c.when.length) {
        wrap.appendChild(el('div', 'arc-group', 'When it is used'));
        var ul = el('ul', 'arc-when');
        c.when.forEach(function (w) { ul.appendChild(UI.rich(el('li'), en(w))); });
        wrap.appendChild(ul);
      }
      if (c.how) {
        wrap.appendChild(el('div', 'arc-group', 'How it is formed'));
        wrap.appendChild(UI.rich(el('p', 'arc-how'), en(c.how)));
      }
      if (c.table && c.table.rows && c.table.rows.length) {
        var cols = Math.max((c.table.head || []).length, c.table.rows[0].length);
        var tb = el('div', 'arc-ctable');
        tb.style.setProperty('--cols', String(cols));
        (c.table.head || []).forEach(function (hd) { tb.appendChild(UI.rich(el('span', 'arc-ct-h'), hd)); });
        c.table.rows.forEach(function (row) {
          row.forEach(function (cell, i) { tb.appendChild(UI.rich(el(i === 0 ? 'b' : 'span', 'arc-ct-c'), cell)); });
        });
        wrap.appendChild(tb);
      }
      if (c.ex && c.ex.length) {
        wrap.appendChild(el('div', 'arc-group', 'Examples'));
        c.ex.forEach(function (ex) {
          var e = el('div', 'arc-ex');
          var line = el('div', 'arc-ex-ru');
          line.appendChild(UI.ru(ex.ru, 'big'));
          var sp = UI.speaker(ex.ru, 'ru');
          if (sp) line.appendChild(sp);
          e.appendChild(line);
          e.appendChild(UI.tr(RU.translit(ex.ru), 'block'));
          e.appendChild(UI.rich(el('div', 'arc-ex-en'), ex.en));
          wrap.appendChild(e);
        });
      }
      if (c.tip) {
        wrap.appendChild(el('div', 'arc-group', 'Tip'));
        wrap.appendChild(UI.rich(el('p', 'arc-how arc-tip'), en(c.tip)));
      }
    } else {
      wrap.appendChild(el('p', 'arc-sub', 'No card for this yet. Practise it all the same.'));
    }

    var u = unit || (window.RUCheck && window.RUCheck.UNITS.filter(function (x) { return x.card === key; })[0]);
    if (u && playable({ kind: u.k })) {
      var btns = el('div', 'arc-modes');
      var pb = el('button', 'arc-mode on');
      pb.type = 'button';
      pb.appendChild(el('b', null, 'Practise: ' + u.label.en + ' · 10 questions'));
      pb.appendChild(el('span', null, 'Calm, no clock, just this'));
      pb.addEventListener('click', function () { practiceUnit(u); });
      btns.appendChild(pb);
      wrap.appendChild(btns);
    }
    h.appendChild(wrap);
  }

  /* ---- the level and the settings --------------------------------------------------------------- */
  function levelPicker() {
    pushView('level');
    var h = host();
    clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar('Your level'));
    wrap.appendChild(el('p', 'arc-sub', 'Decides which band rounds start in and how far they can climb.'));
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
    h.appendChild(wrap);
  }
  function settings() {
    pushView('settings');
    var h = host();
    clear(h);
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar('Settings'));
    wrap.appendChild(el('div', 'arc-group', 'Stress marks'));
    wrap.appendChild(el('p', 'arc-sub', 'Auto shows the stress mark on new words and fades it as you learn. Hold any faded word to see its stress.'));
    var chips = el('div', 'arc-chips'), by = {};
    var paint = function () { var v = GC.stressPref(); Object.keys(by).forEach(function (k) { by[k].classList.toggle('on', k === v); }); };
    [['auto', 'Auto'], ['full', 'Always show'], ['bare', 'Never show']].forEach(function (o) {
      by[o[0]] = button('arc-chip', o[1], function () { GC.setPref('stress', o[0]); paint(); });
      chips.appendChild(by[o[0]]);
    });
    paint();
    wrap.appendChild(chips);
    wrap.appendChild(el('div', 'arc-group', 'Sound'));
    var ap = button('arc-chip', null, function () { GC.setPref('autoplay', !GC.autoplay()); pa(); });
    var pa = function () { ap.textContent = 'Play the answer after each question: ' + (GC.autoplay() ? 'on' : 'off'); ap.classList.toggle('on', GC.autoplay()); };
    pa();
    wrap.appendChild(ap);
    var sw = button('arc-chip', null, function () { GS.setSilent(!GS.silent()); ps(); });
    var ps = function () { sw.textContent = 'Game tones: ' + (GS.silent() ? 'off' : 'on'); sw.classList.toggle('on', !GS.silent()); };
    ps();
    wrap.appendChild(sw);
    wrap.appendChild(el('div', 'arc-group', 'Keyboard'));
    wrap.appendChild(button('arc-chip', 'Show the Russian keyboard guide again', function () {
      try { localStorage.removeItem('svobodno.kbd'); } catch (e) {}
    }));
    h.appendChild(wrap);
  }

  /* ---- the numbers ----------------------------------------------------------------------------------
   * Derived from the round history; anything with too little evidence shows "not yet". */
  function stats(g) {
    pushView('stats');
    var h = host();
    clear(h);
    var p = GS.profileOf(g.key);
    var wrap = el('div', 'arc-stats');
    wrap.appendChild(topBar(g.name));
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
    ['GameScore', 'profileOf'], ['GameScore', 'ghostAt'], ['RUItems', 'next'], ['GameRound', 'run'],
    ['RUCheck', 'session'], ['RU', 'check'], ['RU', 'play'], ['Profile', 'current'], ['RUBukvy', 'path']
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
    w.appendChild(el('div', 'arc-brand', 'Svobodno'));
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
      window.RUBukvy.init({
        board: board, push: pushView, back: goBack,
        round: function () { VIEW = 'round'; }
      });
      board();
    } catch (e) {
      fail('Something went wrong opening the app', (e && e.message ? e.message : String(e)) + '. Press Clear and reload.');
    }
  }

  window.RUArcade = { practisePhrases: practisePhrases, themeLabels: knownThemeLabel, board: board, knownScreen: knownScreen, cardScreen: cardScreen, checkRun: checkRun, sheet: sheet,
    GAMES: GAMES, levelPicker: levelPicker, settings: settings, startShelf: startShelf };

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
