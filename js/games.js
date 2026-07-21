/* ============================================================================
 * GAMES — "Juegos": spaced practice that doesn't feel like practice.
 *
 * Every game reads from and writes to the SAME SRS ids and error log as the
 * daily session — games are not a separate silo, and a correct answer in a
 * game is a correct review. No XP economy, no levels, no daily-target
 * nagging, no audio — deliberately out of scope.
 *
 * Two modes on every game, chosen on the round-start screen:
 *   Tranquilo    — untimed, no score pressure, no timer shown. The default
 *                  everywhere (the only default in beginner mode).
 *   Contrarreloj — 90 seconds, points for correct answers, a personal best
 *                  stored per game+submode. Selectable in every mode, never
 *                  pre-selected.
 * Round length is 10-15 items in Tranquilo (12, fixed); Contrarreloj runs
 * until the clock ends, recycling the item pool if it's exhausted first.
 *
 * Misses are logged to the error log AS THEY HAPPEN (the same convention the
 * daily session and drills use), so by the time the round-end screen offers
 * "these are now in Puntos débiles" it's already true — no separate step to
 * forget to take.
 * ========================================================================== */
window.Games = (function () {
  var UI = window.UI, E = window.ENGINE, S = window.SRS;
  var BEST_KEY = 'fluidez.gameBest';
  var ROUND_LEN = 12, CONTRARRELOJ_SECONDS = 90;

  function isBeginner() { return !!(window.Profile && window.Profile.current() === 'beginner'); }
  function loadBest() { try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; } catch (e) { return {}; } }
  function saveBest(o) { try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) {} }
  function bestFor(key) { return loadBest()[key] || 0; }
  function setBest(key, score) { var b = loadBest(); if (score > (b[key] || 0)) { b[key] = score; saveBest(b); return true; } return false; }

  // Games isn't a Shell tab — it's reached as an overlay from the Inicio tile.
  // "Back" from inside any game means "show the Games list again", still
  // inside the same overlay; only the list's own exit truly closes it.
  var exitAll = null;
  function backToTab() { render(document.getElementById('stage-host'), exitAll); }

  function logMiss(item) {
    if (!window.ErrorLog || !item.id) return;
    window.ErrorLog.record({ id: item.id, front: item.front, back: item.back, kind: item.kind || 'game', source: 'game', hint: item.hint || null, reviewable: false });
  }
  function grade(item, good) {
    if (!item.id || !S) return;
    S.enrol(item.id);
    S.grade(item.id, good);
    if (!good) logMiss(item);
  }

  // ---- shared round chrome: header, timer/score, life-cycle, end summary --
  // items: pre-shuffled pool (>= round length ideally; short pools recycle).
  // renderItem(itemHost, item, answer(good)) draws one item; the game calls
  // answer(good) when it's resolved. onFinish gets the raw results if a game
  // needs to do something extra (Emparejar's grid doesn't use this at all).
  function runRound(host, opts) {
    var title = opts.title, items = opts.items, renderItem = opts.renderItem;
    var tranquilo = opts.tranquilo, gameKey = opts.gameKey;
    var bestKey = gameKey + (opts.submode ? ':' + opts.submode : '');
    if (!items.length) {
      UI.clear(host);
      var empty = UI.el('div', 'panel');
      empty.appendChild(UI.el('h2', null, title));
      empty.appendChild(UI.el('p', 'muted', 'Nothing to play with yet for this combination.'));
      var b0 = UI.el('button', 'ghost-btn', '← Juegos'); b0.type = 'button'; b0.addEventListener('click', backToTab);
      empty.appendChild(b0); host.appendChild(empty); return;
    }

    var pool = E.shuffle(items.slice());
    var idx = 0, correct = 0, seen = 0, misses = [];
    var endTime = tranquilo ? null : Date.now() + CONTRARRELOJ_SECONDS * 1000;
    var timerId = null, finished = false;

    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', title + (tranquilo ? '' : ' · Contrarreloj')));
    var right = UI.el('span', 'stage-count');
    var timerEl = UI.el('span', 'game-timer');
    var exitB = UI.el('button', 'ghost-btn small', '✕ salir'); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', function () { if (timerId) clearInterval(timerId); backToTab(); });
    right.appendChild(timerEl); right.appendChild(UI.el('span', null, '  ')); right.appendChild(exitB);
    head.appendChild(right);
    wrap.appendChild(head);

    var scoreRow = UI.el('div', 'muted small game-score');
    wrap.appendChild(scoreRow);
    var itemHost = UI.el('div');
    wrap.appendChild(itemHost);
    host.appendChild(wrap);

    function updateScore() {
      scoreRow.textContent = tranquilo
        ? (seen + ' / ' + Math.min(ROUND_LEN, pool.length))
        : (correct + ' correct · ' + seen + ' seen' + (bestFor(bestKey) ? ' · best ' + bestFor(bestKey) : ''));
    }
    function tick() {
      var remain = Math.max(0, endTime - Date.now());
      var s = Math.ceil(remain / 1000);
      timerEl.textContent = '⏱ ' + s + 's';
      if (remain <= 0) finish();
    }
    if (!tranquilo) { tick(); timerId = setInterval(tick, 250); }

    function nextItem() {
      if (tranquilo && seen >= Math.min(ROUND_LEN, pool.length)) { finish(); return; }
      if (idx >= pool.length) { pool = E.shuffle(items.slice()); idx = 0; }   // recycle
      var item = pool[idx++];
      renderItem(itemHost, item, function (good) {
        seen++; if (good) correct++; else misses.push(item);
        grade(item, good);
        updateScore();
        nextItem();
      });
      updateScore();
    }

    function finish() {
      if (finished) return; finished = true;
      if (timerId) { clearInterval(timerId); timerId = null; }
      UI.clear(itemHost); UI.clear(scoreRow);
      var isNewBest = !tranquilo && setBest(bestKey, correct);
      var done = UI.el('div', 'intro complete');
      done.appendChild(UI.el('div', 'big-check', '✓'));
      done.appendChild(UI.el('h2', null, tranquilo ? 'Listo' : '¡Tiempo!'));
      done.appendChild(UI.el('p', null, correct + ' correct de ' + seen + (tranquilo ? '' : (isNewBest ? ' — ¡nuevo récord!' : ' · récord: ' + bestFor(bestKey)))));
      if (misses.length) {
        done.appendChild(UI.el('h3', null, 'Para revisar'));
        var ul = UI.el('ul', 'summary-list');
        misses.slice(0, 8).forEach(function (m) { ul.appendChild(UI.el('li', null, (m.front || '') + ' → <b>' + (m.back || '') + '</b>')); });
        done.appendChild(ul);
        done.appendChild(UI.el('p', 'muted small', 'Ya están en Puntos débiles.'));
      }
      var again = UI.el('button', 'primary-btn', 'Jugar de nuevo'); again.type = 'button';
      again.addEventListener('click', function () { runRound(host, opts); });
      var back = UI.el('button', 'ghost-btn', '← Juegos'); back.type = 'button'; back.addEventListener('click', backToTab);
      done.appendChild(again); done.appendChild(back);
      wrap.appendChild(done);
    }

    nextItem();
  }

  // Mode picker shared by every game's setup screen.
  function modeToggle(container, onChange) {
    var tranquilo = true;
    var bar = UI.el('div', 'profile-bar muted');
    bar.appendChild(UI.el('span', null, 'Modo:'));
    var seg = UI.el('div', 'segmented');
    [['tranquilo', 'Tranquilo'], ['contrarreloj', 'Contrarreloj']].forEach(function (o) {
      var b = UI.el('button', 'seg' + (o[0] === 'tranquilo' ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () {
        tranquilo = o[0] === 'tranquilo';
        Array.prototype.forEach.call(seg.children, function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        onChange(tranquilo);
      });
      seg.appendChild(b);
    });
    bar.appendChild(seg);
    container.appendChild(bar);
    return function () { return tranquilo; };
  }

  function exitHeader(title) {
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', title));
    var exitB = UI.el('button', 'ghost-btn small', '✕ salir'); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', backToTab);
    var right = UI.el('span', 'stage-count'); right.appendChild(exitB);
    head.appendChild(right);
    return head;
  }

  // ===========================================================================
  // 1. EMPAREJAR — matching pairs (ES↔EN vocab, or verb form ↔ person+tense)
  // ===========================================================================
  function vocabPairSource() {
    return (window.VOCAB || []).filter(function (w) { return window.Profile ? (window.Profile.catAllowed(w.cat) || w.userWord) : true; })
      .map(function (w) { return { id: 'v:' + w.es + ':meaning', a: w.es, b: w.en, kind: 'vocab' }; });
  }
  function conjPairSource(tenses) {
    var out = [];
    (window.VERBS || []).forEach(function (v) {
      tenses.forEach(function (tk) {
        var forms = E.conjugate(v, tk), persons = E.personsFor(tk);
        forms.forEach(function (form, i) { if (form) out.push({ id: 'vt:' + v.inf + ':' + tk, a: form, b: v.inf + ' · ' + persons[i] + ' · ' + E.TENSE_LABEL[tk], kind: 'verb-tense' }); });
      });
    });
    return out;
  }

  function showEmparejarSetup(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(exitHeader('Emparejar'));
    wrap.appendChild(UI.el('p', 'muted', 'Tap two cards to match them. 6 pairs a round.'));
    var content = 'vocab';
    wrap.appendChild(UI.el('h3', null, 'Contenido'));
    var seg1 = UI.el('div', 'segmented');
    [['vocab', 'Vocabulario'], ['conj', 'Verbos']].forEach(function (o) {
      var b = UI.el('button', 'seg' + (content === o[0] ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () { content = o[0]; Array.prototype.forEach.call(seg1.children, function (x) { x.classList.remove('active'); }); b.classList.add('active'); });
      seg1.appendChild(b);
    });
    var bar1 = UI.el('div', 'profile-bar muted'); bar1.appendChild(seg1); wrap.appendChild(bar1);

    var getTranquilo = modeToggle(wrap, function () {});
    var go = UI.el('button', 'primary-btn', 'Empezar →'); go.type = 'button';
    go.addEventListener('click', function () {
      var source = content === 'vocab' ? vocabPairSource() : conjPairSource(isBeginner() ? ['presente'] : ['presente', 'preterito']);
      runEmparejar(host, source, getTranquilo(), content);
    });
    wrap.appendChild(go);
    host.appendChild(wrap);
  }

  function runEmparejar(host, source, tranquilo, submode) {
    var N = 6;
    var picks = UI.sample ? UI.sample(source, Math.min(N, source.length)) : E.shuffle(source.slice()).slice(0, Math.min(N, source.length));
    if (!picks.length) { showEmparejarSetup(host); return; }
    var cards = [];
    picks.forEach(function (p, i) {
      cards.push({ uid: i + 'a', pairId: i, text: p.a, item: p });
      cards.push({ uid: i + 'b', pairId: i, text: p.b, item: p });
    });
    cards = E.shuffle(cards);

    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(exitHeader('Emparejar'));
    var stats = UI.el('div', 'muted small game-score');
    wrap.appendChild(stats);
    var grid = UI.el('div', 'match-grid');
    wrap.appendChild(grid);
    host.appendChild(wrap);

    var open = [], matched = {}, attempts = {}, foundPairs = 0, startTime = Date.now();
    function render() {
      stats.textContent = foundPairs + ' / ' + picks.length + ' pares';
    }
    var els = {};
    cards.forEach(function (c) {
      var b = UI.el('button', 'match-card'); b.type = 'button'; b.textContent = c.text;
      b.addEventListener('click', function () { onTap(c, b); });
      els[c.uid] = b;
      grid.appendChild(b);
    });
    render();

    function onTap(c, el) {
      if (matched[c.pairId] || el.classList.contains('open') || open.length === 2) return;
      el.classList.add('open');
      open.push(c);
      if (open.length === 2) {
        if (open[0].pairId === open[1].pairId) {
          matched[c.pairId] = true; foundPairs++;
          open.forEach(function (o) { els[o.uid].classList.add('matched'); });
          var missedFirst = (attempts[c.pairId] || 0) > 0;
          grade(open[0].item, !missedFirst);
          open = []; render();
          if (foundPairs === picks.length) setTimeout(finishEmparejar, 400);
        } else {
          attempts[open[0].pairId] = (attempts[open[0].pairId] || 0) + 1;
          attempts[open[1].pairId] = (attempts[open[1].pairId] || 0) + 1;
          var pair = open.slice();
          setTimeout(function () { pair.forEach(function (o) { els[o.uid].classList.remove('open'); }); open = []; }, 550);
        }
      }
    }

    function finishEmparejar() {
      UI.clear(host);
      var seconds = Math.round((Date.now() - startTime) / 1000);
      var bestKey = 'emparejar:' + submode;
      var isNewBest = !tranquilo && setBest(bestKey, Math.max(0, 999 - seconds));
      var done = UI.el('div', 'panel intro complete');
      done.appendChild(UI.el('div', 'big-check', '✓'));
      done.appendChild(UI.el('h2', null, '¡Emparejado!'));
      done.appendChild(UI.el('p', null, picks.length + ' pares en ' + seconds + 's' + (isNewBest ? ' — ¡nuevo récord!' : '')));
      var again = UI.el('button', 'primary-btn', 'Jugar de nuevo'); again.type = 'button';
      again.addEventListener('click', function () { showEmparejarSetup(host); });
      var back = UI.el('button', 'ghost-btn', '← Juegos'); back.type = 'button'; back.addEventListener('click', backToTab);
      done.appendChild(again); done.appendChild(back);
      host.appendChild(done);
    }
  }

  // ===========================================================================
  // 2. OPCIÓN MÚLTIPLE — 4-way choice: meaning / article / conjugated form / preposition
  // ===========================================================================
  function articleOf(es) {
    var m = (es || '').match(/^(el|la|los|las)\s+/i);
    return m ? m[1].toLowerCase() : null;
  }
  function mcqMeaningItems() {
    var pool = vocabPairSource();
    var allEn = pool.map(function (p) { return p.b; });
    return pool.map(function (p) {
      var wrong = E.shuffle(allEn.filter(function (e) { return e !== p.b; })).slice(0, 3);
      return { id: p.id, front: p.a, back: p.b, options: E.shuffle([p.b].concat(wrong)), kind: 'vocab' };
    });
  }
  function mcqArticleItems() {
    var nouns = (window.VOCAB || []).filter(function (w) { return articleOf(w.es); });
    var arts = ['el', 'la', 'los', 'las'];
    return nouns.map(function (w) {
      var correct = articleOf(w.es);
      var bare = w.es.replace(/^(el|la|los|las)\s+/i, '');
      var wrong = arts.filter(function (a) { return a !== correct; });
      return { id: 'v:' + w.es + ':gender', front: bare + '  (' + w.en + ')', back: correct, options: E.shuffle([correct].concat(E.shuffle(wrong).slice(0, 3))), kind: 'gender' };
    });
  }
  function mcqConjItems(tenses) {
    var out = [];
    (window.VERBS || []).forEach(function (v) {
      tenses.forEach(function (tk) {
        var forms = E.conjugate(v, tk), persons = E.personsFor(tk);
        forms.forEach(function (form, i) {
          if (!form) return;
          var others = E.shuffle(forms.filter(function (f) { return f !== form; })).slice(0, 3);
          out.push({ id: 'vt:' + v.inf + ':' + tk, front: v.inf + ' · ' + persons[i] + ' · ' + E.TENSE_LABEL[tk], back: form, options: E.shuffle([form].concat(others)), kind: 'verb-tense' });
        });
      });
    });
    return out;
  }
  function mcqPrepositionItems() {
    var lessons = (window.GRAMMAR_LESSONS || []).filter(function (l) { return l.id === 'por-para'; });
    var out = [];
    lessons.forEach(function (l) { (l.recall || []).forEach(function (r) {
      out.push({ id: r.id, front: r.front, back: r.back, options: E.shuffle(['por', 'para']), kind: 'grammar' });
    }); });
    return out;
  }

  function showOpcionSetup(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(exitHeader('Opción múltiple'));
    wrap.appendChild(UI.el('p', 'muted', 'Choose the right answer from a few options.'));
    var sub = 'meaning';
    var modes = [['meaning', 'Significado'], ['article', 'Artículo'], ['conj', 'Conjugación']];
    if (!isBeginner()) modes.push(['prep', 'Por / Para']);
    wrap.appendChild(UI.el('h3', null, 'Qué practicar'));
    var seg = UI.el('div', 'segmented');
    modes.forEach(function (o) {
      var b = UI.el('button', 'seg' + (sub === o[0] ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () { sub = o[0]; Array.prototype.forEach.call(seg.children, function (x) { x.classList.remove('active'); }); b.classList.add('active'); });
      seg.appendChild(b);
    });
    var bar = UI.el('div', 'profile-bar muted'); bar.appendChild(seg); wrap.appendChild(bar);
    var getTranquilo = modeToggle(wrap, function () {});
    var go = UI.el('button', 'primary-btn', 'Empezar →'); go.type = 'button';
    go.addEventListener('click', function () {
      var items;
      if (sub === 'meaning') items = mcqMeaningItems();
      else if (sub === 'article') items = mcqArticleItems();
      else if (sub === 'conj') items = mcqConjItems(isBeginner() ? ['presente'] : ['presente', 'preterito', 'imperfecto']);
      else items = mcqPrepositionItems();
      runOpcion(host, items, getTranquilo(), sub);
    });
    wrap.appendChild(go);
    host.appendChild(wrap);
  }

  function renderMcq(itemHost, item, answer) {
    UI.clear(itemHost);
    itemHost.appendChild(UI.el('div', 'card-front small', item.front));
    var grid = UI.el('div', 'mcq-opts');
    var answered = false;
    item.options.forEach(function (opt) {
      var b = UI.el('button', 'mcq-btn', opt); b.type = 'button';
      b.addEventListener('click', function () {
        if (answered) return; answered = true;
        var right = opt === item.back;
        b.classList.add(right ? 'right' : 'wrong');
        if (!right) Array.prototype.forEach.call(grid.children, function (c) { if (c.textContent === item.back) c.classList.add('right'); });
        setTimeout(function () { answer(right); }, right ? 400 : 1100);
      });
      grid.appendChild(b);
    });
    itemHost.appendChild(grid);
  }

  function runOpcion(host, items, tranquilo, submode) {
    runRound(host, { title: 'Opción múltiple', items: items, tranquilo: tranquilo, gameKey: 'opcion', submode: submode, renderItem: renderMcq });
  }

  // ===========================================================================
  // 3. CONJUGACIÓN RÁPIDA — infinitive + person + tense → the form, typed
  // ===========================================================================
  function conjRapidaItems(tenses, scope) {
    var verbs = (window.VERBS || []).slice();
    if (scope === 'regular') verbs = verbs.filter(function (v) { return !E.isIrregular(v); });
    else if (scope === 'irregular') verbs = verbs.filter(function (v) { return E.isIrregular(v); });
    var out = [];
    verbs.forEach(function (v) {
      tenses.forEach(function (tk) {
        var forms = E.conjugate(v, tk), persons = E.personsFor(tk);
        forms.forEach(function (form, i) { if (form) out.push({ id: 'vt:' + v.inf + ':' + tk, front: v.inf + '  ·  ' + E.TENSE_LABEL[tk] + '  ·  ' + persons[i], back: form, kind: 'verb-tense' }); });
      });
    });
    return out;
  }
  function renderTyped(itemHost, item, answer) {
    UI.clear(itemHost);
    itemHost.appendChild(UI.el('div', 'card-front small', item.front));
    var input = UI.el('input', 'answer-input'); input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
    var fb = UI.el('div', 'feedback');
    var reveal = UI.el('button', 'ghost-btn', 'Reveal'); reveal.type = 'button';
    itemHost.appendChild(input); itemHost.appendChild(UI.accentBar(function () { return input; })); itemHost.appendChild(fb);
    var controls = UI.el('div', 'row-controls'); controls.appendChild(reveal); itemHost.appendChild(controls);
    var locked = false, revealed = false;
    function good() { if (locked) return; locked = true; fb.textContent = '¡Correcto! ' + item.back; fb.className = 'feedback good'; setTimeout(function () { answer(true); }, 350); }
    input.addEventListener('input', function () { if (!locked && !revealed && E.normalize(input.value) === E.normalize(item.back)) good(); });
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return; e.preventDefault();
      if (locked) return;
      if (revealed) { answer(false); return; }
      if (E.normalize(input.value) === E.normalize(item.back)) { good(); return; }
      fb.textContent = 'Not quite — try again, or reveal'; fb.className = 'feedback bad';
    });
    reveal.addEventListener('click', function () {
      if (locked) return;
      if (revealed) { answer(false); return; }
      revealed = true; fb.textContent = item.back; fb.className = 'feedback reveal'; reveal.textContent = 'Next →'; input.focus();
    });
    input.focus();
  }

  function showConjRapidaSetup(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(exitHeader('Conjugación rápida'));
    wrap.appendChild(UI.el('p', 'muted', 'Infinitive + person + tense → type the form. Engine-graded.'));
    var allTenses = E.TENSES.map(function (t) { return t.key; });
    var tenses = isBeginner() ? allTenses.filter(function (k) { return ['presente', 'preterito', 'imperfecto'].indexOf(k) !== -1; }) : allTenses;
    var chosen = {};
    wrap.appendChild(UI.el('h3', null, 'Tenses'));
    var tchips = UI.el('div', 'chip-row');
    tenses.forEach(function (tk) {
      var c = UI.el('button', 'topic-chip', E.TENSE_LABEL[tk]); c.type = 'button';
      c.addEventListener('click', function () { chosen[tk] = !chosen[tk]; c.classList.toggle('chosen', chosen[tk]); });
      tchips.appendChild(c);
    });
    wrap.appendChild(tchips);
    var scope = 'all';
    wrap.appendChild(UI.el('h3', null, 'Verbs'));
    var seg = UI.el('div', 'segmented');
    [['all', 'All'], ['regular', 'Regular'], ['irregular', 'Irregular']].forEach(function (o) {
      var b = UI.el('button', 'seg' + (scope === o[0] ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () { scope = o[0]; Array.prototype.forEach.call(seg.children, function (x) { x.classList.remove('active'); }); b.classList.add('active'); });
      seg.appendChild(b);
    });
    var bar = UI.el('div', 'profile-bar muted'); bar.appendChild(seg); wrap.appendChild(bar);
    var getTranquilo = modeToggle(wrap, function () {});
    var go = UI.el('button', 'primary-btn', 'Empezar →'); go.type = 'button';
    go.addEventListener('click', function () {
      var picked = Object.keys(chosen).filter(function (k) { return chosen[k]; });
      if (!picked.length) picked = [tenses[0]];
      var items = conjRapidaItems(picked, scope);
      runRound(host, { title: 'Conjugación rápida', items: items, tranquilo: getTranquilo(), gameKey: 'conjrapida', submode: scope, renderItem: renderTyped });
    });
    wrap.appendChild(go);
    host.appendChild(wrap);
  }

  // ===========================================================================
  // 4. FRASE REVUELTA — reorder shuffled words into the correct sentence
  // ===========================================================================
  function sentenceBank(beginner) {
    var out = [];
    (window.GRAMMAR_LESSONS || []).forEach(function (l) {
      (l.examples || []).forEach(function (ex) {
        var words = ex.es.replace(/[.!?¿¡]/g, '').trim().split(/\s+/);
        if (words.length < 3) return;
        if (beginner && words.length > 6) return;
        if (!beginner && words.length > 10) return;
        out.push({ id: 'fr:' + E.normalize(ex.es), sentence: ex.es, words: words, en: ex.en, kind: 'phrase' });
      });
    });
    return out;
  }
  function renderScramble(itemHost, item, answer) {
    UI.clear(itemHost);
    itemHost.appendChild(UI.el('div', 'muted small', item.en));
    var built = [];
    var line = UI.el('div', 'build-line');
    var bank = UI.el('div', 'word-bank');
    var fb = UI.el('div', 'feedback');
    var punct = (item.sentence.match(/[.!?]+$/) || [''])[0];
    function renderBank() {
      UI.clear(bank);
      E.shuffle(remaining()).forEach(function (w, i) {
        var b = UI.el('button', 'word-chip', w); b.type = 'button';
        b.addEventListener('click', function () { built.push(w); renderLine(); renderBank(); checkDone(); });
        bank.appendChild(b);
      });
    }
    function remaining() {
      var used = built.slice();
      return item.words.filter(function (w) { var i = used.indexOf(w); if (i !== -1) { used.splice(i, 1); return false; } return true; });
    }
    function renderLine() {
      UI.clear(line);
      built.forEach(function (w, i) {
        var b = UI.el('button', 'word-chip chosen', w); b.type = 'button';
        b.addEventListener('click', function () { built.splice(i, 1); renderLine(); renderBank(); });
        line.appendChild(b);
      });
    }
    function checkDone() {
      if (built.length !== item.words.length) return;
      var right = built.join(' ') === item.words.join(' ');
      fb.textContent = right ? '¡Correcto!' : 'Correct order: ' + item.words.join(' ') + punct;
      fb.className = 'feedback ' + (right ? 'good' : 'bad');
      setTimeout(function () { answer(right); }, right ? 500 : 1600);
    }
    renderLine(); renderBank();
    itemHost.appendChild(line); itemHost.appendChild(bank); itemHost.appendChild(fb);
  }

  function showFraseSetup(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(exitHeader('Frase revuelta'));
    wrap.appendChild(UI.el('p', 'muted', 'Tap the words in order to rebuild the sentence.'));
    var getTranquilo = modeToggle(wrap, function () {});
    var go = UI.el('button', 'primary-btn', 'Empezar →'); go.type = 'button';
    go.addEventListener('click', function () {
      var items = sentenceBank(isBeginner());
      runRound(host, { title: 'Frase revuelta', items: items, tranquilo: getTranquilo(), gameKey: 'frase', renderItem: renderScramble });
    });
    wrap.appendChild(go);
    host.appendChild(wrap);
  }

  // ===========================================================================
  // 5. ¿CUÁL VA AQUÍ? — minimal-pair chooser (ser/estar, por/para,
  //    pretérito/imperfecto, subjuntivo/indicativo)
  // ===========================================================================
  function conceptItems(lessonId) {
    var l = (window.GRAMMAR_LESSONS || []).filter(function (x) { return x.id === lessonId; })[0];
    if (!l) return [];
    return (l.recall || []).map(function (r) {
      var opts = lessonId === 'ser-estar' ? ['ser', 'estar'] : lessonId === 'por-para' ? ['por', 'para'] : ['preterito', 'imperfecto'];
      return { id: r.id, front: r.front, back: r.back, options: opts, kind: 'grammar' };
    });
  }
  // Generated, not hand-authored: pull real presubj cloze items and pit the
  // engine-computed subjunctive form against the engine-computed indicative
  // form of the SAME verb/person — the classic trap, with zero new data.
  function subjIndicItems() {
    var out = [];
    (window.APPLY_ITEMS || []).forEach(function (it) {
      if (it.type !== 'cloze' || it.tense !== 'presubj') return;
      var v = E.verbByInf(it.inf); if (!v) return;
      var idx = E.personsFor('presubj').indexOf(it.person);
      var subjForm = E.conjugate(v, 'presubj')[idx];
      var indicForm = E.conjugate(v, 'presente')[E.personsFor('presente').indexOf(it.person)];
      if (!subjForm || !indicForm || subjForm === indicForm) return;
      out.push({ id: 'vt:' + it.inf + ':presubj', front: it.text.replace('___', '＿＿＿') + '  [' + it.inf + ']', back: subjForm, options: E.shuffle([subjForm, indicForm]), kind: 'verb-tense' });
    });
    return out;
  }
  function renderMinimalPair(itemHost, item, answer) {
    UI.clear(itemHost);
    itemHost.appendChild(UI.el('div', 'card-front small', item.front));
    var opts = UI.el('div', 'mcq-opts');
    var answered = false;
    item.options.forEach(function (opt) {
      var b = UI.el('button', 'mcq-btn', E.TENSE_LABEL && E.TENSE_LABEL[opt] ? E.TENSE_LABEL[opt] : opt); b.type = 'button';
      b.addEventListener('click', function () {
        if (answered) return; answered = true;
        var right = opt === item.back;
        b.classList.add(right ? 'right' : 'wrong');
        if (!right) Array.prototype.forEach.call(opts.children, function (c, i) { if (item.options[i] === item.back) c.classList.add('right'); });
        setTimeout(function () { answer(right); }, right ? 400 : 1100);
      });
      opts.appendChild(b);
    });
    itemHost.appendChild(opts);
  }

  function showCualSetup(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(exitHeader('¿Cuál va aquí?'));
    wrap.appendChild(UI.el('p', 'muted', 'The classic traps — pick the one that actually goes here.'));
    var modes = [['ser-estar', 'Ser / Estar']];
    if (!isBeginner()) { modes.push(['por-para', 'Por / Para'], ['preterite-imperfect', 'Pretérito / Imperfecto'], ['subj', 'Subjuntivo / Indicativo']); }
    var sub = modes[0][0];
    wrap.appendChild(UI.el('h3', null, 'Which pair'));
    var seg = UI.el('div', 'segmented');
    modes.forEach(function (o) {
      var b = UI.el('button', 'seg' + (sub === o[0] ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () { sub = o[0]; Array.prototype.forEach.call(seg.children, function (x) { x.classList.remove('active'); }); b.classList.add('active'); });
      seg.appendChild(b);
    });
    var bar = UI.el('div', 'profile-bar muted'); bar.appendChild(seg); wrap.appendChild(bar);
    var getTranquilo = modeToggle(wrap, function () {});
    var go = UI.el('button', 'primary-btn', 'Empezar →'); go.type = 'button';
    go.addEventListener('click', function () {
      var items = sub === 'subj' ? subjIndicItems() : conceptItems(sub === 'preterite-imperfect' ? 'preterite-imperfect' : sub);
      runRound(host, { title: '¿Cuál va aquí?', items: items, tranquilo: getTranquilo(), gameKey: 'cual', submode: sub, renderItem: renderMinimalPair });
    });
    wrap.appendChild(go);
    host.appendChild(wrap);
  }

  // ---- Juegos entry point (an overlay opened from the Inicio tile) --------
  function render(host, back) {
    exitAll = back;
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', 'Juegos'));
    var exitB = UI.el('button', 'ghost-btn small', '✕ salir'); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', function () { if (back) back(); });
    var right = UI.el('span', 'stage-count'); right.appendChild(exitB);
    head.appendChild(right);
    wrap.appendChild(head);
    wrap.appendChild(UI.el('p', 'muted', 'Spaced practice that plays like a game — every round reads and writes your real review schedule.'));
    var list = UI.el('div', 'mas-list');
    function row(icon, title, sub, onTap) {
      var b = UI.el('button', 'mas-row'); b.type = 'button';
      b.innerHTML = '<span class="mas-ico">' + icon + '</span><span class="mas-text"><b>' + title + '</b><br><span class="muted small">' + sub + '</span></span><span class="mas-chev">›</span>';
      b.addEventListener('click', function () { window.Shell.openOverlay(); onTap(document.getElementById('stage-host')); });
      list.appendChild(b);
    }
    row('🃏', 'Emparejar', 'Matching pairs — vocab or verb forms', showEmparejarSetup);
    row('☑️', 'Opción múltiple', 'Meaning, article, conjugation, por/para', showOpcionSetup);
    row('⚡', 'Conjugación rápida', 'Infinitive + person + tense → the form', showConjRapidaSetup);
    row('🧩', 'Frase revuelta', 'Reorder the shuffled words', showFraseSetup);
    row('🎯', '¿Cuál va aquí?', 'The classic minimal-pair traps', showCualSetup);
    wrap.appendChild(list);
    host.appendChild(wrap);
  }

  return { render: render };
})();
