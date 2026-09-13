/* ============================================================================
 * GAME ROUND — one universal round, so every game feels the same to play.
 *
 * The old games each carried their own loop, their own timer and their own end
 * screen, and none of them reacted to anything: a right answer flipped a CSS
 * class, a wrong one froze the screen for 1.1 seconds WHILE THE CLOCK RAN, and
 * the round ended on a line of text. Learning one game taught you nothing
 * about the next.
 *
 * Everything here is shared: the HUD, the clock, the combo, the four ways of
 * answering (choose / type / build / listen), the score that counts up rather
 * than jumping, and the end screen whose loudest line after the score itself
 * is how far off your personal best you were.
 *
 * Three decisions worth defending:
 *
 *   THE CLOCK PAUSES ON A CORRECTION. Showing you the right answer is
 *   information, not a second penalty on top of losing the points and the
 *   combo. A correction you are being charged for is a correction you skip.
 *
 *   A TYPED ANSWER RESOLVES THE MOMENT IT IS RIGHT — no Enter, no submit. In a
 *   sixty-second round the keystroke you do not have to press is worth real
 *   points, and the instant response is most of what makes typing feel fast.
 *
 *   A MISS NEVER LAPSES THE SRS. A correct answer grades the item up exactly
 *   as the daily session would; a miss is recorded in the error log and makes
 *   the item eligible sooner, but it does not demote a mature card on the
 *   strength of a mistype at second 58. A game can earn you review credit; it
 *   must not cost you a memory.
 * ========================================================================== */
window.GameRound = (function () {
  var UI = window.UI, E = window.ENGINE, S = window.SRS, GS = window.GameScore, GI = window.GameItems;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }

  /* Answer windows in sudden-death: generous at the start, tightening as the
   * run gets long, so a run ends because it got hard rather than because it
   * ran out of questions. */
  function suddenWindow(run) { return Math.max(4500, 14000 - run * 350); }

  function run(host, cfg) {
    var rng = cfg.seed ? UI.seededRandom(cfg.seed) : Math.random;
    var rungCap = Math.min(GS.MAX_RUNG, cfg.maxRung || GS.ceilingRung());
    var rung = Math.min(rungCap, cfg.startRung || 1);

    var score = 0, shownScore = 0, combo = 0, bestCombo = 0, bestRung = rung;
    var seen = 0, right = 0, runLen = 0, misses = [], usedPrompts = {};
    var ended = false, paused = false, pausedAt = 0, recordHit = false;
    var endAt = cfg.duration ? Date.now() + cfg.duration : null;
    var itemStart = 0, itemWindow = 0, current = null, resolved = true;
    var raf = null, pendingContinue = null, lastTyped = '';

    if (window.GameItems && cfg.focus !== false) {
      try { GI.setFocus(window.Session ? window.Session.today().focus : null); } catch (e) { GI.setFocus(null); }
    }

    // ---- chrome ------------------------------------------------------------
    clear(host);
    var shell = el('div', 'g-shell');
    shell.dataset.state = 'play';
    // the game's own colour, which follows it from the tile into the round
    if (cfg.hue) shell.style.setProperty('--game', cfg.hue);

    var top = el('div', 'g-top');
    var name = el('span', 'g-name', cfg.title);
    var band = el('span', 'g-band');
    var comboPill = el('span', 'g-combo');
    comboPill.hidden = true;
    var exit = el('button', 'g-exit', '✕');
    exit.type = 'button';
    exit.setAttribute('aria-label', 'Salir');
    top.appendChild(name); top.appendChild(band); top.appendChild(comboPill);
    top.appendChild(el('span', 'g-spacer')); top.appendChild(exit);
    shell.appendChild(top);

    var clock = el('div', 'g-clock');
    var clockFill = el('div', 'g-clock-fill');
    clock.appendChild(clockFill);
    shell.appendChild(clock);

    var line = el('div', 'g-scoreline');
    var scoreEl = el('span', 'g-score', '0');
    var pbEl = el('span', 'g-pb');
    var secsEl = el('span', 'g-secs');
    line.appendChild(scoreEl); line.appendChild(pbEl); line.appendChild(el('span', 'g-spacer')); line.appendChild(secsEl);
    shell.appendChild(line);

    var itemHost = el('div', 'g-item');
    var fbHost = el('div', 'g-feedback');
    shell.appendChild(itemHost);
    shell.appendChild(fbHost);
    host.appendChild(shell);

    var pb = GS.pb(cfg.key);
    pbEl.textContent = pb ? 'PB ' + GS.fmt(pb) : '';
    if (cfg.sudden) { secsEl.classList.add('g-run'); }

    exit.addEventListener('click', function () { stop(); if (cfg.onExit) cfg.onExit(); });

    // ---- clock -------------------------------------------------------------
    function remaining() {
      if (cfg.sudden) return Math.max(0, itemStart + itemWindow - now());
      return endAt ? Math.max(0, endAt - now()) : 0;
    }
    function now() { return paused ? pausedAt : Date.now(); }
    function total() { return cfg.sudden ? (itemWindow || 1) : (cfg.duration || 1); }

    function tick() {
      if (ended) return;
      var left = remaining();
      var frac = Math.max(0, Math.min(1, left / total()));
      clockFill.style.transform = 'scaleX(' + frac + ')';
      var secs = Math.ceil(left / 1000);
      if (cfg.sudden) {
        secsEl.textContent = runLen + (runLen === 1 ? ' seguida' : ' seguidas');
        clock.dataset.urgent = left < 3000 ? '1' : '';
      } else {
        secsEl.textContent = secs;
        clock.dataset.urgent = left <= 10000 ? '1' : '';
        shell.dataset.urgent = left <= 10000 ? '1' : '';
      }
      if (left <= 0 && !paused) {
        if (cfg.sudden) { if (!resolved) timeOut(); }
        else { finish(); return; }
      }
      raf = requestAnimationFrame(tick);
    }
    function pause() { if (paused || ended) return; pausedAt = Date.now(); paused = true; }
    function resume() {
      if (!paused) return;
      var slept = Date.now() - pausedAt;
      if (endAt) endAt += slept;
      itemStart += slept;
      paused = false;
    }
    function stop() {
      ended = true;
      if (raf) cancelAnimationFrame(raf);
      if (window.Speak) window.Speak.stop();
      document.removeEventListener('keydown', onKey);
    }

    // ---- score -------------------------------------------------------------
    function tweenScore() {
      var from = shownScore, to = score, t0 = Date.now(), dur = 420;
      (function step() {
        var p = Math.min(1, (Date.now() - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        shownScore = Math.round(from + (to - from) * eased);
        scoreEl.textContent = GS.fmt(shownScore);
        if (p < 1) requestAnimationFrame(step);
      })();
    }
    function pop(text, cls) {
      var p = el('span', 'g-pop' + (cls ? ' ' + cls : ''), text);
      line.appendChild(p);
      setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 900);
    }
    function setBand(b) {
      band.textContent = b;
      band.dataset.band = b;
    }
    function setCombo(n) {
      combo = n;
      bestCombo = Math.max(bestCombo, n);
      comboPill.hidden = n < 2;
      comboPill.textContent = '×' + (1 + Math.min(n, 10) * 0.1).toFixed(1);
      comboPill.dataset.hot = n >= 5 ? '1' : '';
      if (n >= 2) { comboPill.classList.remove('beat'); void comboPill.offsetWidth; comboPill.classList.add('beat'); }
    }

    // ---- SRS: credit generously, never punish ------------------------------
    function writeBack(item, result) {
      if (!item.id) return;
      if (result === 'good' || result === 'near') {
        if (S) { S.enrol(item.id); S.grade(item.id, true); }
        return;
      }
      if (S) S.enrol(item.id);                 // eligible sooner, but not lapsed
      if (window.ErrorLog) {
        window.ErrorLog.record({
          id: item.id, front: item.prompt || item.es || '', back: item.answer,
          kind: item.kind, source: 'game', topic: item.topic || null, reviewable: false
        });
      }
    }

    // ---- the loop ----------------------------------------------------------
    function nextItem() {
      if (ended) return;
      clear(fbHost);
      lastTyped = '';
      shell.dataset.state = 'play';
      /* Redraw a few times to avoid repeating an item inside one round —
       * but take a repeat over stalling: the pools are large, and a round that
       * ends early because the draw was unlucky is worse than seeing a word
       * twice in ninety seconds. */
      var item = null, fallback = null;
      for (var i = 0; i < 8; i++) {
        var got = cfg.topic ? GI.weakItem(cfg.topic, rung, rng)
                            : GI.next(cfg.kind, rung, rng, { silent: cfg.silent });
        if (!got) continue;
        fallback = got;
        if (!usedPrompts[keyOf(got)]) { item = got; break; }
      }
      item = item || fallback;
      if (!item) { finish(); return; }
      usedPrompts[keyOf(item)] = 1;
      current = item;
      resolved = false;
      setBand(item.cefr);
      itemStart = Date.now();
      itemWindow = cfg.sudden ? suddenWindow(runLen) : GS.limitFor(item) * 3;
      renderItem(item);
    }
    function keyOf(it) { return (it.prompt || '') + '|' + (it.es || it.answer || ''); }

    function timeOut() { if (!resolved) resolve('wrong', true); }

    function resolve(result, timedOut) {
      if (resolved || ended) return;
      resolved = true;
      var ms = Date.now() - itemStart;
      var item = current;
      seen++;
      var a = GS.award(item, result, ms, combo);

      if (result === 'wrong') {
        setCombo(0);
        misses.push(item);
      } else {
        right++;
        runLen++;
        score += a.points;
        if (result === 'good') setCombo(combo + 1);
        tweenScore();
        pop('+' + GS.fmt(a.points) + (a.tags.length ? '  ' + a.tags.join(' ') : ''), result === 'near' ? 'near' : 'good');
        if (!recordHit && pb && score > pb) {
          recordHit = true;
          shell.dataset.record = '1';
          pop('¡RÉCORD!', 'record');
        }
      }
      writeBack(item, result);
      rung = GS.nextRung(rung, result, rungCap);
      bestRung = Math.max(bestRung, rung);

      if (cfg.sudden && result === 'wrong') { showFeedback(item, result, timedOut, finish); return; }
      showFeedback(item, result, timedOut, nextItem);
    }

    /* "Wrong", followed by the right answer, is a verdict. What the learner
     * needs is the DIFFERENCE — which word they actually got wrong — and they
     * should not have to find it by eye at second 50 of a sprint.
     *
     * Longest-common-subsequence over the two word lists, so an inserted or
     * missing word lines up the rest rather than marking everything after it.
     * Sentences here are at most fourteen words, so the table is tiny. */
    function alignWords(a, b) {
      var m = a.length, n = b.length, L = [], i, j;
      for (i = 0; i <= m; i++) { L.push([]); for (j = 0; j <= n; j++) L[i].push(0); }
      for (i = m - 1; i >= 0; i--) {
        for (j = n - 1; j >= 0; j--) {
          L[i][j] = a[i].k === b[j].k ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
        }
      }
      var out = []; i = 0; j = 0;
      while (i < m && j < n) {
        if (a[i].k === b[j].k) { out.push({ w: a[i].w, same: true }); i++; j++; }
        else if (L[i + 1][j] >= L[i][j + 1]) { out.push({ w: a[i].w, same: false }); i++; }
        else j++;
      }
      while (i < m) { out.push({ w: a[i].w, same: false }); i++; }
      return out;
    }
    // display form, plus the normalised key the comparison runs on
    function keyed(text) {
      return String(text || '').trim().split(/\s+/).filter(Boolean).map(function (word) {
        return { w: word, k: (GI.words(word)[0] || word.toLowerCase()) };
      });
    }
    function diffLine(cls, label, text, against) {
      var row = el('div', 'g-fb-line ' + cls);
      row.appendChild(el('span', 'g-fb-label', label));
      var body = el('span', 'g-fb-words');
      alignWords(keyed(text), keyed(against)).forEach(function (t, i) {
        if (i) body.appendChild(document.createTextNode(' '));
        body.appendChild(t.same ? document.createTextNode(t.w) : el('span', 'g-diff', t.w));
      });
      row.appendChild(body);
      return row;
    }

    /* How long the answer stays on screen. A correct answer barely interrupts;
     * a wrong one holds long enough to read the right answer and no longer,
     * with the clock stopped throughout and Enter to move on early. */
    function showFeedback(item, result, timedOut, then) {
      shell.dataset.state = result;
      if (result === 'good') { setTimeout(function () { if (!ended) then(); }, 170); return; }

      pause();
      clear(fbHost);
      var box = el('div', 'g-correct');
      /* A listening correction has to lead with what was SAID. Showing only
       * the answer to the question asked — one English gloss, or a Spanish
       * line the learner already knows they misheard — leaves them with
       * "wrong" and nothing to learn from. Spanish first, with the speaker so
       * it can be heard again now that they know what it was, then what it
       * means. */
      var headline = item.kind === 'listen' && item.es ? item.es : item.answer;
      var label = result === 'near' ? 'casi — los acentos'
                : timedOut ? 'se acabó el tiempo' : 'era';
      var typedIt = lastTyped && lastTyped.trim() && item.play === 'type';

      // the row the answer lives on, so the replay button rides with it
      // rather than dangling under the whole box
      var answerRow;
      if (typedIt) {
        // both lines, each marked against the other
        answerRow = diffLine('is-answer', label, headline, lastTyped);
        box.appendChild(answerRow);
        box.appendChild(diffLine('is-typed', 'tú', lastTyped, headline));
      } else {
        answerRow = el('div', 'g-fb-line is-answer');
        answerRow.appendChild(el('span', 'g-fb-label', label));
        answerRow.appendChild(el('span', 'g-fb-answer', headline));
        box.appendChild(answerRow);
      }
      if (window.Speak && item.es && window.Speak.available()) {
        var sp = window.Speak.button(item.es);
        if (sp) answerRow.appendChild(sp);
      }
      var why = item.kind === 'listen'
        ? [item.gloss, item.note].filter(Boolean).join(' · ')
        : (item.note || (item.reveal && item.reveal !== item.answer ? item.reveal : null));
      if (why) box.appendChild(el('span', 'g-fb-note', why));
      fbHost.appendChild(box);

      var go = el('button', 'g-continue', 'Seguir →');
      go.type = 'button';
      go.addEventListener('click', done);
      fbHost.appendChild(go);
      var t = setTimeout(done, result === 'near' ? 1500 : 2400);
      function done() {
        clearTimeout(t);
        if (ended) return;
        resume();
        then();
      }
      /* Armed on the NEXT tick, never this one. A typed answer is submitted
       * with Enter, that keypress bubbles to the document, and arming
       * synchronously would let the same press dismiss the correction it just
       * produced — the right answer would flash past unread every time. */
      setTimeout(function () { if (!ended) pendingContinue = done; }, 0);
    }

    // ---- the four ways of answering ----------------------------------------
    function renderItem(item) {
      clear(itemHost);
      pendingContinue = null;
      if (item.kind === 'listen') return renderListen(item);
      if (item.play === 'choose') return renderChoose(item);
      if (item.play === 'build') return renderBuild(item);
      return renderType(item);
    }

    /* A trailing bracket in the English is a disambiguator the data file
     * carries — "the friend (f)", "I don't know Granada (I've never been)" —
     * not part of what you are being asked to write. Setting it quietly aside
     * keeps the help without making it look like more to translate. */
    function promptEl(item, cls) {
      var p = el('div', 'g-prompt' + (cls ? ' ' + cls : ''));
      var text = item.prompt || '';
      var m = /^(.*?)\s*\(([^()]*)\)\s*([.!?]?)$/.exec(text);
      if (m && m[1].length > 3) {
        p.appendChild(document.createTextNode(m[1] + m[3]));
        p.appendChild(el('span', 'g-prompt-note', m[2]));
      } else {
        p.textContent = text;
      }
      if (text.length > 60) p.classList.add('long');
      return p;
    }

    function renderChoose(item) {
      itemHost.appendChild(promptEl(item));
      var opts = el('div', 'g-options');
      item.options.forEach(function (o) {
        var b = el('button', 'g-opt', o);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (resolved) return;
          var ok = o === item.answer;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) Array.prototype.forEach.call(opts.children, function (c) {
            if (c.textContent === item.answer) c.classList.add('right');
          });
          resolve(ok ? 'good' : 'wrong');
        });
        opts.appendChild(b);
      });
      itemHost.appendChild(opts);
    }

    function renderType(item) {
      itemHost.appendChild(promptEl(item));
      var input = el('input', 'g-input');
      input.type = 'text';
      input.autocomplete = 'off';
      input.autocapitalize = 'off';
      input.spellcheck = false;
      input.setAttribute('aria-label', 'Tu respuesta');
      itemHost.appendChild(input);
      itemHost.appendChild(UI.accentBar(function () { return input; }));
      // Resolves the instant it is right — no Enter, no submit button.
      input.addEventListener('input', function () {
        if (resolved) return;
        lastTyped = input.value;
        if (GI.grade(item, input.value) === 'good') { input.classList.add('right'); resolve('good'); }
      });
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || resolved) return;
        e.preventDefault();
        lastTyped = input.value;
        var r = GI.grade(item, input.value);
        input.classList.add(r === 'wrong' ? 'wrong' : 'right');
        resolve(r);
      });
      setTimeout(function () { input.focus(); }, 0);
    }

    function renderBuild(item) {
      itemHost.appendChild(promptEl(item, 'build'));
      var lineEl = el('div', 'g-build');
      var bank = el('div', 'g-bank');
      var built = [];
      function remainingWords() {
        var used = built.slice();
        return item.words.filter(function (w) {
          var i = used.indexOf(w);
          if (i !== -1) { used.splice(i, 1); return false; }
          return true;
        });
      }
      function draw() {
        clear(lineEl); clear(bank);
        built.forEach(function (w, i) {
          var c = el('button', 'g-chip chosen', w);
          c.type = 'button';
          c.addEventListener('click', function () { if (resolved) return; built.splice(i, 1); draw(); });
          lineEl.appendChild(c);
        });
        if (!built.length) lineEl.appendChild(el('span', 'g-build-hint', 'toca las palabras en orden'));
        E.shuffle(remainingWords()).forEach(function (w) {
          var c = el('button', 'g-chip', w);
          c.type = 'button';
          c.addEventListener('click', function () {
            if (resolved) return;
            built.push(w); draw();
            if (built.length === item.words.length) {
              var ok = built.join(' ') === item.answer;
              lineEl.classList.add(ok ? 'right' : 'wrong');
              resolve(ok ? 'good' : 'wrong');
            }
          });
          bank.appendChild(c);
        });
      }
      draw();
      itemHost.appendChild(lineEl);
      itemHost.appendChild(bank);
    }

    function renderListen(item) {
      var wrap = el('div', 'g-listen');
      var speaker = el('button', 'g-speaker', '🔊');
      speaker.type = 'button';
      speaker.setAttribute('aria-label', 'Repetir');
      var pulse = el('span', 'g-pulse');
      speaker.appendChild(pulse);
      function say() {
        speaker.classList.remove('playing'); void speaker.offsetWidth; speaker.classList.add('playing');
        if (window.Speak) window.Speak.speak(item.es, { rate: item.rate });
      }
      /* Replay as often as you like. There is no explicit penalty because
       * there does not need to be one: the clock has been running, so every
       * replay has already cost speed bonus and, in a sixty-second round,
       * another item. */
      speaker.addEventListener('click', function () { if (!resolved) say(); });
      wrap.appendChild(speaker);
      wrap.appendChild(el('span', 'g-listen-hint', 'tócalo para repetir'));
      itemHost.appendChild(wrap);
      if (item.play === 'choose') renderChooseBody(item); else renderTypeBody(item);
      setTimeout(say, 120);
    }
    // listening reuses the bodies without re-printing a text prompt
    function renderChooseBody(item) {
      var opts = el('div', 'g-options');
      item.options.forEach(function (o) {
        var b = el('button', 'g-opt', o);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (resolved) return;
          var ok = o === item.answer;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) Array.prototype.forEach.call(opts.children, function (c) {
            if (c.textContent === item.answer) c.classList.add('right');
          });
          resolve(ok ? 'good' : 'wrong');
        });
        opts.appendChild(b);
      });
      itemHost.appendChild(opts);
    }
    function renderTypeBody(item) {
      var input = el('input', 'g-input');
      input.type = 'text'; input.autocomplete = 'off'; input.autocapitalize = 'off'; input.spellcheck = false;
      input.setAttribute('aria-label', 'Escribe lo que oyes');
      itemHost.appendChild(input);
      itemHost.appendChild(UI.accentBar(function () { return input; }));
      input.addEventListener('input', function () {
        if (resolved) return;
        lastTyped = input.value;
        if (GI.grade(item, input.value) === 'good') { input.classList.add('right'); resolve('good'); }
      });
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || resolved) return;
        e.preventDefault();
        lastTyped = input.value;
        var r = GI.grade(item, input.value);
        input.classList.add(r === 'wrong' ? 'wrong' : 'right');
        resolve(r);
      });
      setTimeout(function () { input.focus(); }, 0);
    }

    // ---- Enter is always the next thing you want ---------------------------
    function onKey(e) {
      if (e.key !== 'Enter') return;
      if (pendingContinue) { e.preventDefault(); var f = pendingContinue; pendingContinue = null; f(); }
    }
    document.addEventListener('keydown', onKey);

    // ---- the end -----------------------------------------------------------
    function finish() {
      if (ended) return;
      stop();
      var band0 = GS.bandForRung(bestRung);
      var res = GS.record(cfg.key, { score: score, combo: bestCombo, band: band0, run: runLen });

      clear(host);
      var over = el('div', 'g-over');
      over.dataset.pb = res.isPb ? '1' : '';

      over.appendChild(el('div', 'g-over-eyebrow', cfg.title));
      var big = el('div', 'g-over-score', GS.fmt(score));
      over.appendChild(big);

      if (res.isPb) {
        over.appendChild(el('div', 'g-over-verdict pb',
          res.prevPb ? '¡Récord! ' + GS.fmt(res.gap) + ' más que antes' : 'Tu primer récord'));
      } else if (res.pb) {
        over.appendChild(el('div', 'g-over-verdict',
          'Te faltaron ' + GS.fmt(res.gap) + ' para tu récord de ' + GS.fmt(res.pb)));
      }

      var again = el('button', 'g-again', 'Otra vez');
      again.type = 'button';
      again.addEventListener('click', function () { run(host, cfg); });
      over.appendChild(again);

      var stats = el('div', 'g-over-stats');
      function stat(n, l) {
        var s2 = el('div', 'g-stat');
        s2.appendChild(el('b', null, n));
        s2.appendChild(el('span', null, l));
        stats.appendChild(s2);
      }
      stat(seen ? Math.round(100 * right / seen) + '%' : '—', 'precisión');
      if (cfg.sudden) stat(String(runLen), 'seguidas');
      stat('×' + (1 + Math.min(bestCombo, 10) * 0.1).toFixed(1), 'mejor combo');
      stat(band0, 'llegaste a');
      stat(String(res.todayBest ? GS.fmt(res.todayBest) : '—'), 'mejor de hoy');
      over.appendChild(stats);

      if (misses.length) {
        over.appendChild(el('h3', 'g-over-h', 'Para revisar'));
        var list = el('div', 'g-misses');
        misses.slice(0, 4).forEach(function (m) {
          var r = el('div', 'g-miss');
          r.appendChild(el('span', 'g-miss-q', m.prompt || m.es || ''));
          r.appendChild(el('span', 'g-miss-a', m.answer));
          list.appendChild(r);
        });
        over.appendChild(list);
        over.appendChild(el('p', 'g-over-note', 'Ya están en Puntos débiles.'));
      }

      var back = el('button', 'g-back', '← Juegos');
      back.type = 'button';
      back.addEventListener('click', function () { if (cfg.onExit) cfg.onExit(); });
      over.appendChild(back);

      host.appendChild(over);
      setTimeout(function () { again.focus(); }, 30);
    }

    setBand(GS.bandForRung(rung));
    nextItem();
    tick();
  }

  return { run: run };
})();
