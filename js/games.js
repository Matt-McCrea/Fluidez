/* ============================================================================
 * JUEGOS — the games section: five to fifteen minutes, against your last score.
 *
 * This file used to hold five games, each with its own setup screen, its own
 * round loop and a "score" that counted correct answers — so the number you
 * were chasing said nothing about your Spanish, and the default mode had no
 * score, no clock and no end at all. The games were good practice and nobody
 * would ever have chosen to play one twice.
 *
 * What is here now is a REGISTRY and a landing page. The three things a game
 * needs — what a point is worth (js/gamescore.js), where the questions come
 * from (js/gameitems.js) and how a round plays (js/gameround.js) — are shared,
 * so adding a game is an entry in a list rather than another loop to maintain.
 *
 * Tapping a tile STARTS THE GAME. No submode, no verb scope, no difficulty, no
 * mode toggle: the ladder handles difficulty by watching you answer, and the
 * only choice left before playing is which game. Every tile carries its own
 * personal best, because the whole motivation — "let's see if I can beat
 * 8,420" — has to be visible at the moment you are deciding whether to play.
 *
 * Emparejar keeps a loop of its own at the foot of this file: a board that
 * empties is not a sequence of items, and the shared round engine would have
 * had to grow a second shape to hold it.
 * ========================================================================== */
window.Games = (function () {
  var UI = window.UI, E = window.ENGINE, GS = window.GameScore, GI = window.GameItems;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }

  var exitAll = null;
  function host() { return document.getElementById('stage-host'); }
  function backToList() { render(host(), exitAll); }

  /* One accent per game. Colour is what makes the Games page feel like a
   * shelf of different things rather than one list repeated six times, and it
   * follows you into the round, so you always know what you are playing. */
  var GAMES = [
    { key: 'traduccion', name: 'Traducción', rule: 'inglés → español', icon: '✍️',
      hue: '#1d7f8c', secs: 60, kind: 'translate',
      blurb: 'Escribe el español. Las frases se alargan según aciertas.' },
    { key: 'escucha', name: 'Escucha', rule: 'óyelo una vez', icon: '🎧',
      hue: '#7a5bd0', secs: 60, kind: 'listen', needsVoice: true,
      blurb: 'Una voz lo dice. ¿Qué era? Cada nivel habla más rápido.' },
    { key: 'verbos', name: 'Verbos', rule: '“he ate” → comió', icon: '⚡',
      hue: '#b5711a', secs: 60, kind: 'verb',
      blurb: 'Del significado a la forma, sin etiquetas gramaticales.' },
    { key: 'gramatica', name: 'Gramática', rule: '¿cuál va aquí?', icon: '🎯',
      hue: '#2f7fb8', secs: 90, kind: 'grammar',
      blurb: 'Ser o estar, por o para, indicativo o subjuntivo. Noventa segundos.' },
    /* Not red, however much "sudden death" wants to be: --game colours the
     * focused input and the clock, and red already means "you got that wrong"
     * everywhere else in the round. A game whose resting state looks like an
     * error state is telling the player the wrong thing continuously. */
    { key: 'racha', name: 'Racha', rule: 'un fallo y se acaba', icon: '🔥',
      hue: '#a8306e', sudden: true, kind: 'mixed',
      blurb: 'Cualquier cosa, sin avisar. Un solo error termina la partida.' },
    { key: 'emparejar', name: 'Emparejar', rule: 'vacía el tablero', icon: '🃏',
      hue: '#2f8f5b', secs: 60, custom: true,
      blurb: 'Empareja las columnas. Cada tablero es más grande que el anterior.' }
  ];
  function byKey(k) { return GAMES.filter(function (g) { return g.key === k; })[0]; }

  function playable(g) {
    if (!g.needsVoice) return true;
    return !!(window.Speak && window.Speak.available());
  }

  function start(g, extra) {
    var h = host();
    clear(h);
    if (g.custom) return runEmparejar(h, g);
    var cfg = {
      key: g.key, title: g.name, kind: g.kind,
      duration: g.secs ? g.secs * 1000 : null,
      sudden: !!g.sudden, hue: g.hue,
      onExit: backToList
    };
    if (extra) Object.keys(extra).forEach(function (k) { cfg[k] = extra[k]; });
    window.GameRound.run(h, cfg);
  }

  // ---- what to put at the top ---------------------------------------------
  /* One recommendation, not six. In order: a game you very nearly beat last
   * time (the only genuinely motivating reason to open one), then a game you
   * have never played, then the one you have played least. It says nothing at
   * all when it has nothing true to say. */
  function recommend() {
    var open = GAMES.filter(playable);
    var close = null, closest = 0;
    open.forEach(function (g) {
      var n = GS.nearMissScore(g.key);
      if (n > 0.88 && n < 1 && n > closest) { closest = n; close = g; }
    });
    if (close) {
      var st = GS.stats(close.key);
      var last = st.history.length ? st.history[st.history.length - 1].s : 0;
      return { game: close, why: 'Tu última partida se quedó a ' + GS.fmt(st.pb - last) + ' del récord' };
    }
    var fresh = open.filter(function (g) { return !GS.stats(g.key).plays; });
    if (fresh.length) return { game: fresh[0], why: 'Todavía no lo has probado' };
    var least = open.slice().sort(function (a, b) { return GS.stats(a.key).plays - GS.stats(b.key).plays; })[0];
    return least ? { game: least, why: 'Hace tiempo que no juegas a este' } : null;
  }

  /* A topic the learner keeps getting wrong, if there is one. Four misses is
   * the threshold js/suggest.js already uses before it offers a deep dive —
   * one bad day should not trigger anything, and nothing here is a scold. */
  function weakSpot() {
    if (!window.ErrorLog) return null;
    var byTopic = {};
    window.ErrorLog.list().forEach(function (e) {
      if (!e.topic) return;
      byTopic[e.topic] = (byTopic[e.topic] || 0) + (e.count || 1);
    });
    var best = null;
    Object.keys(byTopic).forEach(function (t) {
      if (byTopic[t] >= 4 && (!best || byTopic[t] > byTopic[best])) best = t;
    });
    if (!best) return null;
    return { topic: best, n: byTopic[best], label: topicLabel(best) };
  }
  function topicLabel(topic) {
    var m = /^tense:(.+)$/.exec(topic);
    if (m) return (E.TENSE_LABEL && E.TENSE_LABEL[m[1]]) || m[1];
    var l = /^lesson:(.+)$/.exec(topic);
    if (!l) return topic;
    var found = (window.ALL_LESSONS || window.GRAMMAR_LESSONS || []).filter(function (x) { return x.id === l[1]; })[0];
    return found ? found.title : l[1];
  }

  // ---- the landing page ----------------------------------------------------
  function render(h, back) {
    exitAll = back;
    clear(h);
    h.style.removeProperty('--game');

    var page = el('div', 'g-page');

    var head = el('div', 'g-page-head');
    var titles = el('div');
    titles.appendChild(el('h1', null, 'Juegos'));
    titles.appendChild(el('p', 'g-page-sub', 'Cinco minutos. A ver si superas tu marca.'));
    head.appendChild(titles);
    var out = el('button', 'g-exit', '✕');
    out.type = 'button';
    out.setAttribute('aria-label', 'Salir');
    out.addEventListener('click', function () { if (back) back(); });
    head.appendChild(out);
    page.appendChild(head);

    // ---- today's challenge ----
    page.appendChild(dailyCard());

    // ---- one recommendation ----
    var rec = recommend();
    if (rec) {
      page.appendChild(el('h2', 'g-h', 'Sigue así'));
      page.appendChild(recRow(rec));
    }

    // ---- the shelf ----
    page.appendChild(el('h2', 'g-h', 'Todos los juegos'));
    var grid = el('div', 'g-grid');
    GAMES.forEach(function (g) { if (playable(g)) grid.appendChild(tile(g)); });
    page.appendChild(grid);

    // ---- your own weak spot ----
    var weak = weakSpot();
    if (weak) page.appendChild(weakCard(weak));

    // ---- the quiet line at the foot ----
    var wk = GS.weekSummary();
    if (wk.plays) {
      var bits = [wk.plays + (wk.plays === 1 ? ' partida' : ' partidas')];
      if (wk.records) bits.push(wk.records + (wk.records === 1 ? ' récord' : ' récords'));
      if (wk.bestRun) bits.push('mejor racha ' + wk.bestRun);
      page.appendChild(el('p', 'g-week', 'Esta semana · ' + bits.join(' · ')));
    }

    h.appendChild(page);
  }

  function dailyCard() {
    var key = GS.dailyKey();
    var card = el('div', 'g-daily');
    var top = el('div', 'g-daily-top');
    top.appendChild(el('span', 'g-daily-label', 'Reto de hoy'));
    top.appendChild(el('span', 'g-daily-date', GS.dailyLabel()));
    card.appendChild(top);
    card.appendChild(el('p', 'g-daily-rule', 'Mixto · 90 segundos · el mismo reto para todos hoy'));

    var best = GS.todayBest(key), pb = GS.pb(key), streak = GS.dailyStreak();
    var nums = el('div', 'g-daily-nums');
    function n(v, l) {
      var b = el('div', 'g-dn');
      b.appendChild(el('b', null, v));
      b.appendChild(el('span', null, l));
      nums.appendChild(b);
    }
    n(best ? GS.fmt(best) : '—', 'tu mejor de hoy');
    if (pb) n(GS.fmt(pb), 'récord');
    if (streak > 1) n(String(streak), 'días seguidos');
    card.appendChild(nums);

    var go = el('button', 'g-daily-go', best ? 'Volver a intentarlo' : 'Jugar');
    go.type = 'button';
    go.addEventListener('click', function () {
      var h = host();
      clear(h);
      window.GameRound.run(h, {
        key: key, title: 'Reto de hoy', kind: 'mixed', duration: 90000,
        hue: 'var(--accent)', seed: GS.dailySeed(), onExit: backToList
      });
    });
    card.appendChild(go);
    return card;
  }

  function recRow(rec) {
    var g = rec.game;
    var row = el('button', 'g-rec');
    row.type = 'button';
    row.style.setProperty('--game', g.hue);
    row.appendChild(el('span', 'g-rec-ico', g.icon));
    var mid = el('span', 'g-rec-mid');
    mid.appendChild(el('b', null, g.name));
    mid.appendChild(el('span', 'g-rec-why', rec.why));
    row.appendChild(mid);
    var pb = GS.pb(g.key);
    row.appendChild(el('span', 'g-rec-pb', pb ? 'PB ' + GS.fmt(pb) : g.secs + ' s'));
    row.addEventListener('click', function () { start(g); });
    return row;
  }

  function tile(g) {
    var st = GS.stats(g.key);
    var t = el('button', 'g-tile');
    t.type = 'button';
    t.style.setProperty('--game', g.hue);

    var head = el('div', 'g-tile-head');
    head.appendChild(el('span', 'g-tile-ico', g.icon));
    head.appendChild(el('span', 'g-tile-len', g.sudden ? 'muerte súbita' : g.secs + ' s'));
    t.appendChild(head);

    t.appendChild(el('div', 'g-tile-name', g.name));
    t.appendChild(el('div', 'g-tile-rule', g.rule));

    var foot = el('div', 'g-tile-foot');
    if (st.pb) {
      foot.appendChild(el('b', null, (g.sudden ? st.bestRun + ' seguidas' : GS.fmt(st.pb))));
      if (st.bestBand && !g.sudden) foot.appendChild(el('span', 'g-tile-band', st.bestBand));
    } else {
      foot.appendChild(el('span', 'g-tile-none', 'sin récord'));
    }
    var todayB = GS.todayBest(g.key);
    if (todayB && todayB < st.pb) foot.appendChild(el('span', 'g-tile-today', 'hoy ' + GS.fmt(todayB)));
    t.appendChild(foot);

    t.title = g.blurb;
    t.addEventListener('click', function () { start(g); });
    return t;
  }

  function weakCard(weak) {
    var card = el('div', 'g-weak');
    card.appendChild(el('span', 'g-weak-label', 'Se te resiste'));
    card.appendChild(el('p', 'g-weak-text', weak.label + ' — ' + weak.n + ' fallos.'));
    var go = el('button', 'g-weak-go', '60 segundos con eso');
    go.type = 'button';
    go.addEventListener('click', function () {
      var h = host();
      clear(h);
      window.GameRound.run(h, {
        key: 'debiles', title: weak.label, kind: 'grammar', topic: weak.topic,
        duration: 60000, hue: '#b5711a', onExit: backToList
      });
    });
    card.appendChild(go);
    return card;
  }

  // ===========================================================================
  // EMPAREJAR — the one game whose round is a board, not a queue.
  //
  // Kept from the old section because it is the only one that already had game
  // feel, and rebuilt around three things it was missing: boards that GROW
  // (six cards, then eight, then ten, with rarer words each time), a combo on
  // consecutive first-try matches, and a bonus for clearing a board fast — so
  // the last pair on a board is worth hurrying for. Matched pairs now collapse
  // out of the grid instead of sitting there at 35% opacity, so the board
  // visibly empties under you.
  //
  // The verb board keeps the old generator's insight: hold the PERSON fixed
  // and vary the TENSE, because when the tense does not vary the English side
  // is just a subject pronoun and the puzzle is pronoun elimination.
  // ===========================================================================
  var BOARD_SIZES = [6, 6, 8, 8, 10];

  function vocabBoard(rung, n) {
    var idx = GI.index(), band = GS.bandForRung(rung);
    var pool = idx.vocab[band];
    if (!pool || pool.length < n * 2) pool = idx.vocab.B1.concat(idx.vocab.A2, idx.vocab.A1);
    var picked = E.shuffle(pool.slice()).filter(function (w) {
      return !window.Profile || window.Profile.wordAllowed(w);
    }).slice(0, n);
    return picked.map(function (w) {
      return { id: 'v:' + w.es + ':meaning', a: w.es, b: w.en, cefr: w.cefr || band };
    });
  }
  function verbBoard(rung, n) {
    var band = GS.bandForRung(rung);
    var tenses = (window.Profile ? window.Profile.tenses() : ['presente'])
      .filter(function (t) { return t !== 'imperativo' && t !== 'impneg'; });
    if (tenses.length < 2) return null;
    var verbs = E.shuffle((window.Profile ? window.Profile.conjugableVerbs() : (window.VERBS || [])).slice());
    if (verbs.length < 3) verbs = (window.VERBS || []).slice(0, 20);
    var out = [], vi = 0, guard = 0;
    while (out.length < n && guard++ < n * 8) {
      var v = verbs[vi++ % verbs.length];
      if (!v) break;
      var person = Math.floor(Math.random() * 6);          // fixed for this verb
      E.shuffle(tenses.slice()).slice(0, 3).forEach(function (tk) {
        if (out.length >= n) return;
        if (window.Profile && !window.Profile.verbOkAt(v.inf, tk)) return;
        var form = E.conjugate(v, tk)[person];
        if (!form || out.some(function (o) { return o.a === form; })) return;
        out.push({ id: 'vt:' + v.inf + ':' + tk, a: form, b: GI.conjPrompt(v, tk, person), cefr: band });
      });
    }
    return out.length >= 4 ? out : null;
  }

  function runEmparejar(h, g) {
    var DURATION = g.secs * 1000;
    var rungCap = GS.ceilingRung();
    var rung = 1, boards = 0, pairsDone = 0, combo = 0, bestCombo = 0, score = 0, shownScore = 0;
    var misses = [], ended = false, endAt = Date.now() + DURATION, raf = null, recordHit = false;
    var pb = GS.pb(g.key);

    clear(h);
    var shell = el('div', 'g-shell');
    shell.dataset.state = 'play';
    shell.style.setProperty('--game', g.hue);

    var top = el('div', 'g-top');
    top.appendChild(el('span', 'g-name', g.name));
    var band = el('span', 'g-band');
    var comboPill = el('span', 'g-combo');
    comboPill.hidden = true;
    var exit = el('button', 'g-exit', '✕');
    exit.type = 'button';
    exit.setAttribute('aria-label', 'Salir');
    exit.addEventListener('click', function () { stop(); backToList(); });
    top.appendChild(band); top.appendChild(comboPill); top.appendChild(el('span', 'g-spacer')); top.appendChild(exit);
    shell.appendChild(top);

    var clock = el('div', 'g-clock');
    var fill = el('div', 'g-clock-fill');
    clock.appendChild(fill);
    shell.appendChild(clock);

    var line = el('div', 'g-scoreline');
    var scoreEl = el('span', 'g-score', '0');
    var pbEl = el('span', 'g-pb', pb ? 'PB ' + GS.fmt(pb) : '');
    var secsEl = el('span', 'g-secs');
    line.appendChild(scoreEl); line.appendChild(pbEl); line.appendChild(el('span', 'g-spacer')); line.appendChild(secsEl);
    shell.appendChild(line);

    var columns = el('div', 'g-match');
    shell.appendChild(columns);
    h.appendChild(shell);

    function stop() { ended = true; if (raf) cancelAnimationFrame(raf); }
    function tick() {
      if (ended) return;
      var left = Math.max(0, endAt - Date.now());
      fill.style.transform = 'scaleX(' + (left / DURATION) + ')';
      secsEl.textContent = Math.ceil(left / 1000);
      clock.dataset.urgent = left <= 10000 ? '1' : '';
      shell.dataset.urgent = left <= 10000 ? '1' : '';
      if (left <= 0) { finish(); return; }
      raf = requestAnimationFrame(tick);
    }
    function tween() {
      var from = shownScore, to = score, t0 = Date.now();
      (function step() {
        var p = Math.min(1, (Date.now() - t0) / 380);
        shownScore = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        scoreEl.textContent = GS.fmt(shownScore);
        if (p < 1) requestAnimationFrame(step);
      })();
    }
    function pop(text, cls) {
      var p = el('span', 'g-pop' + (cls ? ' ' + cls : ''), text);
      line.appendChild(p);
      setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 900);
    }
    function setCombo(n) {
      combo = n; bestCombo = Math.max(bestCombo, n);
      comboPill.hidden = n < 2;
      comboPill.textContent = '×' + (1 + Math.min(n, 10) * 0.1).toFixed(1);
      comboPill.dataset.hot = n >= 5 ? '1' : '';
      if (n >= 2) { comboPill.classList.remove('beat'); void comboPill.offsetWidth; comboPill.classList.add('beat'); }
    }

    var open, matched, attempts, found, els, pairs, boardStart;
    function deal() {
      if (ended) return;
      var n = BOARD_SIZES[Math.min(BOARD_SIZES.length - 1, boards)];
      // boards alternate content once there is more than one tense to vary
      var wantVerbs = boards >= 2 && boards % 2 === 0;
      pairs = (wantVerbs && verbBoard(rung, n)) || vocabBoard(rung, n);
      if (!pairs || !pairs.length) { finish(); return; }
      band.textContent = GS.bandForRung(rung);
      band.dataset.band = GS.bandForRung(rung);
      open = []; matched = {}; attempts = {}; found = 0; els = {};
      boardStart = Date.now();
      clear(columns);
      var left = el('div', 'g-match-col'), right = el('div', 'g-match-col');
      columns.appendChild(left); columns.appendChild(right);
      var ls = [], rs = [];
      pairs.forEach(function (p, i) {
        ls.push({ uid: i + 'a', pair: i, text: p.a, item: p });
        rs.push({ uid: i + 'b', pair: i, text: p.b, item: p });
      });
      E.shuffle(ls).forEach(function (c) { add(c, left); });
      E.shuffle(rs).forEach(function (c) { add(c, right); });
      function add(c, col) {
        var b = el('button', 'g-card', c.text);
        b.type = 'button';
        b.addEventListener('click', function () { tap(c, b); });
        els[c.uid] = b;
        col.appendChild(b);
      }
    }

    function tap(c, node) {
      if (ended || matched[c.pair] || node.classList.contains('open') || open.length === 2) return;
      node.classList.add('open');
      open.push(c);
      if (open.length < 2) return;
      if (open[0].pair === open[1].pair) {
        matched[c.pair] = true; found++;
        var firstTry = !(attempts[c.pair] > 0);
        var ms = Date.now() - boardStart;
        var a = GS.award({ cefr: c.item.cefr || 'A1', play: 'choose', bonus: 0, limitMs: 9000 },
                         'good', firstTry ? Math.min(ms, 4000) : 9000, combo);
        score += a.points; pairsDone++;
        if (firstTry) setCombo(combo + 1); else setCombo(0);
        tween();
        pop('+' + GS.fmt(a.points), 'good');
        if (!recordHit && pb && score > pb) { recordHit = true; shell.dataset.record = '1'; pop('¡RÉCORD!', 'record'); }
        if (window.SRS && c.item.id) { window.SRS.enrol(c.item.id); window.SRS.grade(c.item.id, firstTry); }
        open.forEach(function (o) { els[o.uid].classList.add('gone'); });
        open = [];
        if (found === pairs.length) {
          // clearing fast is worth hurrying the last pair for
          var elapsed = Date.now() - boardStart;
          if (elapsed < 8000) {
            var bonus = Math.round(120 * (1 - elapsed / 8000) * pairs.length / 6);
            score += bonus; tween(); pop('+' + GS.fmt(bonus) + ' tablero', 'good');
          }
          boards++;
          rung = Math.min(rungCap, rung + 1);
          setTimeout(deal, 340);
        }
      } else {
        attempts[open[0].pair] = (attempts[open[0].pair] || 0) + 1;
        attempts[open[1].pair] = (attempts[open[1].pair] || 0) + 1;
        setCombo(0);
        if (misses.length < 6 && open[0].item) misses.push({ prompt: open[0].item.a, answer: open[0].item.b });
        var two = open.slice();
        two.forEach(function (o) { els[o.uid].classList.add('miss'); });
        open = [];
        setTimeout(function () {
          two.forEach(function (o) { els[o.uid].classList.remove('open', 'miss'); });
        }, 420);
      }
    }

    function finish() {
      if (ended) return;
      stop();
      var res = GS.record(g.key, { score: score, combo: bestCombo, band: GS.bandForRung(rung), run: pairsDone });
      clear(h);
      var over = el('div', 'g-over');
      over.dataset.pb = res.isPb ? '1' : '';
      over.appendChild(el('div', 'g-over-eyebrow', g.name));
      over.appendChild(el('div', 'g-over-score', GS.fmt(score)));
      if (res.isPb) over.appendChild(el('div', 'g-over-verdict pb', res.prevPb ? '¡Récord! ' + GS.fmt(res.gap) + ' más que antes' : 'Tu primer récord'));
      else if (res.pb) over.appendChild(el('div', 'g-over-verdict', 'Te faltaron ' + GS.fmt(res.gap) + ' para tu récord de ' + GS.fmt(res.pb)));
      var again = el('button', 'g-again', 'Otra vez');
      again.type = 'button';
      again.addEventListener('click', function () { runEmparejar(h, g); });
      over.appendChild(again);
      var stats = el('div', 'g-over-stats');
      function stat(n, l) { var s = el('div', 'g-stat'); s.appendChild(el('b', null, n)); s.appendChild(el('span', null, l)); stats.appendChild(s); }
      stat(String(pairsDone), 'parejas');
      stat(String(boards + 1), 'tableros');
      stat('×' + (1 + Math.min(bestCombo, 10) * 0.1).toFixed(1), 'mejor combo');
      stat(GS.bandForRung(rung), 'llegaste a');
      over.appendChild(stats);
      var back = el('button', 'g-back', '← Juegos');
      back.type = 'button';
      back.addEventListener('click', backToList);
      over.appendChild(back);
      h.appendChild(over);
      setTimeout(function () { again.focus(); }, 30);
    }

    deal();
    tick();
  }

  return { render: render, GAMES: GAMES };
})();
