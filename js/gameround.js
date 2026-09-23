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
    var rung = Math.min(rungCap, cfg.startRung || GS.startRung());

    /* Lives, not instant death. One mistake ending a forty-item run reads as
     * unfair; the third one reads as earned — which is the difference between
     * closing the app and pressing Otra vez. `lives: 0` means unlimited (a
     * plain timed sprint); a game with lives and no clock is pure sudden
     * death, where each ITEM carries the clock instead. */
    var lives = cfg.lives || (cfg.sudden ? 1 : 0);
    var livesLeft = lives;
    var perItemClock = !cfg.duration;

    var startedAt = Date.now();
    /* The round's own shape, sampled at every score change, so a record round
       can be raced by the next one. Only timed rounds carry a ghost: in sudden
       death the thing you are chasing is how FAR you got, and there is no
       shared clock to line two runs up against. */
    var curve = [], ghost = !!(cfg.duration && GS.hasGhost(cfg.key));
    var score = 0, shownScore = 0, combo = 0, bestCombo = 0, bestRung = rung;
    var comboBefore = 0, rungBefore = rung;
    var seen = 0, right = 0, runLen = 0, bestRun = 0, misses = [], usedPrompts = {};
    var ended = false, paused = false, pausedAt = 0, recordHit = false;
    var endAt = cfg.duration ? Date.now() + cfg.duration : null;
    var itemStart = 0, itemWindow = 0, current = null, resolved = true;
    var raf = null, pendingContinue = null, lastTyped = '';

    if (window.GameItems && cfg.focus !== false) {
      /* In the app the focus is the day's lesson, set here on every round. In
       * the arcade there is no Session and the PLAYER chooses it, so leave
       * whatever js/arcade.js set: overwriting it with null on every round is
       * how the arcade's own focus control would silently do nothing. */
      if (window.Session) {
        try { GI.setFocus(window.Session.today().focus); } catch (e) { GI.setFocus(null); }
      }
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
    var livesPill = el('span', 'g-lives');
    livesPill.hidden = !lives;
    var exit = el('button', 'g-exit', '✕');
    exit.type = 'button';
    exit.setAttribute('aria-label', 'Salir');
    top.appendChild(name); top.appendChild(band); top.appendChild(comboPill);
    top.appendChild(livesPill);
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
    /* The typed answer lives OUTSIDE itemHost, and outlives the question.
     *
     * renderItem() clears itemHost between questions, which used to destroy
     * the input and build a new one. Two things went wrong with that. The
     * caret was gone, so every question needed a tap. And on iOS the software
     * keyboard drops when a focused element is removed and will not come back
     * from a programmatic focus() — that only raises the keyboard inside a
     * user gesture, and the move to the next question is driven by a timer.
     * So in a sixty-second round you were tapping the box, waiting for the
     * keyboard, and typing, over and over.
     *
     * One input, created once, never detached, never blurred: the keyboard
     * stays up and the caret stays in it for the whole round. */
    var typeHost = el('div', 'g-type');
    var typeInput = el('input', 'g-input');
    typeInput.type = 'text';
    typeInput.autocomplete = 'off';
    typeInput.autocapitalize = 'off';
    typeInput.spellcheck = false;
    typeInput.enterKeyHint = 'go';
    typeInput.setAttribute('aria-label', 'Tu respuesta');
    typeHost.appendChild(typeInput);
    typeHost.appendChild(UI.accentBar(function () { return typeInput; }));
    typeHost.hidden = true;

    var fbHost = el('div', 'g-feedback');
    shell.appendChild(itemHost);
    shell.appendChild(typeHost);
    shell.appendChild(fbHost);
    host.appendChild(shell);

    /* Wired once, against `current` rather than a captured item — the element
     * is shared by every typed question in the round. */
    typeInput.addEventListener('input', function () {
      if (resolved || !current || current.play === 'build') return;
      lastTyped = typeInput.value;
      if (GI.grade(current, typeInput.value) === 'good') {
        typeInput.classList.add('right');
        resolve('good');
      }
    });
    typeInput.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || resolved || !current) return;
      e.preventDefault();
      lastTyped = typeInput.value;
      var r = GI.grade(current, typeInput.value);
      typeInput.classList.add(r === 'wrong' ? 'wrong' : 'right');
      resolve(r);
    });

    var pb = GS.pb(cfg.key);
    pbEl.textContent = pb ? 'PB ' + GS.fmt(pb) : '';
    if (perItemClock) { secsEl.classList.add('g-run'); }
    function drawLives() {
      if (!lives) return;
      var t = '';
      for (var i = 0; i < lives; i++) t += i < livesLeft ? '●' : '○';
      livesPill.textContent = t;
      livesPill.dataset.low = livesLeft <= 1 ? '1' : '';
    }
    drawLives();

    exit.addEventListener('click', function () { stop(); if (cfg.onExit) cfg.onExit(); });

    // ---- clock -------------------------------------------------------------
    function remaining() {
      if (perItemClock) return Math.max(0, itemStart + itemWindow - now());
      return endAt ? Math.max(0, endAt - now()) : 0;
    }
    function now() { return paused ? pausedAt : Date.now(); }
    function total() { return perItemClock ? (itemWindow || 1) : (cfg.duration || 1); }

    function tick() {
      if (ended) return;
      var left = remaining();
      var frac = Math.max(0, Math.min(1, left / total()));
      clockFill.style.transform = 'scaleX(' + frac + ')';
      var secs = Math.ceil(left / 1000);
      if (perItemClock) {
        secsEl.textContent = runLen + (runLen === 1 ? ' seguida' : ' seguidas');
        clock.dataset.urgent = left < 3000 ? '1' : '';
      } else {
        secsEl.textContent = secs;
        clock.dataset.urgent = left <= 10000 ? '1' : '';
        shell.dataset.urgent = left <= 10000 ? '1' : '';
        /* Racing the record, in the slot that used to hold its total. "PB
         * 8 420" is information you can do nothing with at second forty; "+340"
         * is the whole game. */
        if (ghost) {
          var g = GS.ghostAt(cfg.key, cfg.duration - left);
          if (g != null) {
            var d = score - g;
            pbEl.textContent = (d >= 0 ? '▲ +' : '▼ ') + GS.fmt(Math.abs(d));
            pbEl.dataset.race = d >= 0 ? 'ahead' : 'behind';
          }
        }
      }
      if (left <= 0 && !paused) {
        if (perItemClock) { if (!resolved) timeOut(); }
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
      if (cfg.duration) curve.push({ t: cfg.duration - remaining(), s: score });
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
      /* AN ITEM WITHOUT AN SRS ID IS STILL A MISTAKE. This returned early on
       * one, which is correct for the SRS — the id IS the scheduling key and
       * there is nothing to schedule without it — and was silently wrong for
       * the error log, which only needs something stable to file the entry
       * under. Measured over 300 draws each: Uno u otro carries an id on 0% of
       * its items and Traducción on 49%, so a whole game's mistakes were
       * being thrown away and half of another's, and "Mis fallos" could stay
       * empty however much you played. */
      if (result === 'good' || result === 'near') {
        if (item.id && S) { S.enrol(item.id); S.grade(item.id, true); }
        // Getting it right is how a mistake stops being one. Same shape as the
        // record below, so ErrorLog files both under the same key.
        if (window.ErrorLog && window.ErrorLog.credit) {
          window.ErrorLog.credit({ id: item.id || null, kind: item.kind,
                                   front: item.prompt || item.es || '', back: item.answer });
        }
        return;
      }
      if (item.id && S) S.enrol(item.id);      // eligible sooner, but not lapsed
      if (window.ErrorLog) {
        /* es/en as well as front/back. The orientation of a game item flips
         * with how it was played — a typed vocab question shows the English
         * and a tapped one shows the Spanish — so front/back alone cannot say
         * which side is which, and js/study.js needs to know in order to build
         * a card that always asks meaning → Spanish. Derived rather than
         * demanded, so no generator has to remember to supply it.
         *
         * `reviewable` stays false on purpose: that flag makes ErrorLog grade
         * the card DOWN, and a mistype at second 58 must not demote something
         * you know. Coming back and being demoted are different things, and
         * the pack is how a game miss now comes back. */
        /* es/en only where the two sides really ARE a Spanish word and its
         * meaning. For a vocabulary or translation item the orientation flips
         * with how it was played, so it has to be derived; for a contrast item
         * the prompt is a Spanish sentence and the answer a Spanish word, and
         * calling either of them "the English" would put the card in the pack
         * backwards. Those fall back to front/back, which is already the right
         * way round: the gapped sentence, then the word that fills it. */
        var side = item.play === 'type';
        var pair = item.kind === 'vocab' || item.kind === 'translate' || item.kind === 'verb';
        var rec = {
          // No id on many items (contrast carries none at all); ErrorLog
          // synthesises one from the question rather than dropping the miss.
          id: item.id || null,
          front: item.prompt || item.es || '', back: item.answer,
          kind: item.kind, source: 'game', topic: item.topic || null, reviewable: false,
          options: item.options || null
        };
        if (pair) {
          rec.es = item.es || (side ? item.answer : item.prompt);
          rec.en = item.en || (side ? item.prompt : item.answer);
        }
        window.ErrorLog.record(rec);
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
      /* ONE IN FOUR IS SOMETHING YOU GOT WRONG.
       *
       * The end screen used to promise that misses were "in Puntos débiles",
       * and what that meant in practice was: the TOPIC became eligible for a
       * round you had to go and choose, once three misses shared it. The words
       * themselves were not queued anywhere a normal round would reach.
       *
       * So a quarter of the items are now drawn from your own error log
       * instead of the pool. A quarter rather than all of them because a round
       * that is only your mistakes is a punishment and you stop opening it;
       * this way the miss comes back while the game is still a game. Never in
       * a deck round (that already IS a fixed list) and never twice in one
       * round. */
      var revisit = null;
      if (!cfg.deck && !cfg.topic && seen > 0 && seen % 4 === 3 && GI.missDeck) {
        /* Checked AFTER building the item, not before: usedPrompts is keyed by
         * keyOf(), which is the prompt as it ends up on screen, and a deck
         * entry does not know yet whether it will be asked typed or tapped. */
        var deck = GI.missDeck(cfg.kind, 20);
        for (var d = 0; d < 6 && deck.length; d++) {
          var cand = GI.deckItem(deck, rng);
          if (cand && !usedPrompts[keyOf(cand)]) { revisit = cand; break; }
        }
      }

      var item = null, fallback = null;
      if (revisit) { item = revisit; }
      for (var i = 0; !item && i < 8; i++) {
        var got = cfg.deck ? GI.deckItem(cfg.deck, rng)
                : cfg.topic ? GI.weakItem(cfg.topic, rung, rng)
                            : GI.next(cfg.kind, rung, rng,
                                { silent: cfg.silent, tense: cfg.lockTense, tenses: cfg.tenses,
                                  anyBand: cfg.anyBand, theme: cfg.theme, only: cfg.only });
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
      itemWindow = perItemClock ? suddenWindow(runLen) : GS.limitFor(item) * 3;
      renderItem(item);
    }
    function keyOf(it) { return (it.prompt || '') + '|' + (it.es || it.answer || ''); }

    function timeOut() { if (!resolved) resolve('wrong', true); }

    function resolve(result, timedOut) {
      if (resolved || ended) return;
      resolved = true;
      var ms = Date.now() - itemStart;
      var item = current;
      // what the run looked like before this answer, so "eso también vale"
      // can put it back rather than trying to unpick the arithmetic
      comboBefore = combo;
      rungBefore = rung;
      seen++;
      var a = GS.award(item, result, ms, combo);

      if (result === 'wrong') {
        setCombo(0);
        misses.push(item);
        runLen = 0;
        if (lives) { livesLeft--; drawLives(); }
      } else {
        right++;
        runLen++;
        bestRun = Math.max(bestRun, runLen);
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
      rung = GS.nextRung(rung, result, rungCap, item && item.play);
      bestRung = Math.max(bestRung, rung);

      if (lives && livesLeft <= 0 && result === 'wrong') { showFeedback(item, result, timedOut, finish); return; }
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
      /* A built answer is the learner's Spanish too. From B2 up, 83% of
       * translation items arrive as chips rather than as an empty box, so
       * gating the claim on typing alone would have hidden it from exactly
       * the learners who hit the problem. With fixed chips the only
       * alternative is a different ORDER — which is a thing a person may
       * judge for themselves even though the grader must never assume it. */
      var producedIt = lastTyped && lastTyped.trim() &&
                       (item.play === 'type' || item.play === 'build');

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

      var row2 = el('div', 'g-fb-actions');

      /* "That counts too." Only where the learner actually produced Spanish
       * and the app said no — not on a timeout, not on a tap, and not on a
       * near miss, which already gave them the item. No data file holds every
       * good translation, so the app has to be correctable; see
       * js/accepted.js for why this is not a cheat button. */
      if (producedIt && result === 'wrong' && !timedOut && item.prompt && window.Accepted) {
        var mine = el('button', 'g-mine', 'eso también vale');
        mine.type = 'button';
        mine.addEventListener('click', function () {
          window.Accepted.add(item.prompt, lastTyped.trim());
          mine.disabled = true;
          mine.textContent = 'anotado — contará la próxima vez';
          /* Kept, not awarded. Scoring it now would price an answer nobody
           * graded; keeping the combo and the rung means the round stops
           * punishing you for being right. */
          combo = comboBefore;
          rung = rungBefore;
          shell.dataset.state = 'near';
        });
        row2.appendChild(mine);
      }

      var go = el('button', 'g-continue', 'Seguir →');
      go.type = 'button';
      go.addEventListener('click', done);
      row2.appendChild(go);
      fbHost.appendChild(row2);
      /* A near miss moves on by itself: you got the item, the correction is
       * one accent, and there is nothing to decide.
       *
       * A WRONG answer waits. It used to auto-advance after 2.4 seconds,
       * which was already tight for reading the diff between your line and
       * the real one, and became impossible once that screen carried a
       * decision — you cannot read a correction, judge whether your own
       * Spanish was defensible and tap "eso también vale" in two seconds.
       *
       * Waiting costs nothing: the round clock is paused for this screen
       * (pause() above), so the time is not coming out of your sixty seconds.
       * Enter still moves on, and so does Seguir. */
      var t = result === 'near' ? setTimeout(done, 1500) : null;
      function done() {
        if (t) clearTimeout(t);
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
      /* Only a typed question shows the box. The listening round types its
       * answer too, so it keeps it; choosing and building do not. */
      if (item.kind === 'listen') { showTypeBox(); return renderListen(item); }
      hideTypeBox();
      if (item.play === 'choose') return renderChoose(item);
      if (item.play === 'build') return renderBuild(item);
      showTypeBox();
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

    /* Resolves the instant it is right — no Enter, no submit button. The
     * listeners are on the shared input above; this only has to present it. */
    function renderType(item) {
      itemHost.appendChild(promptEl(item));
      showTypeBox();
    }

    /* Reset and reveal the shared input without ever detaching it. focus() is
     * called for the desktop case and for the first question of a round; on a
     * phone the element has not been blurred, so the keyboard never went away
     * and there is nothing to re-raise. */
    function showTypeBox(label) {
      typeInput.setAttribute('aria-label', label || 'Tu respuesta');
      typeInput.value = '';
      typeInput.classList.remove('right', 'wrong');
      typeInput.disabled = false;
      typeHost.hidden = false;
      if (document.activeElement !== typeInput) {
        try { typeInput.focus({ preventScroll: true }); } catch (e) { typeInput.focus(); }
      }
    }
    function hideTypeBox() {
      if (typeHost.hidden) return;
      typeInput.value = '';
      typeInput.classList.remove('right', 'wrong');
      typeHost.hidden = true;
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
              lastTyped = built.join(' ');     // so the correction can show it
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
      if (item.play === 'choose') { hideTypeBox(); renderChooseBody(item); }
      else renderTypeBody(item);
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
    /* Same shared input as every other typed question — see the note by
     * typeHost. It is already on screen and already focused by the time this
     * runs; only the label changes, because here you are writing down what
     * you heard rather than translating something you can see. */
    function renderTypeBody(item) {
      typeInput.setAttribute('aria-label', 'Escribe lo que oyes');
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
      /* Everything the round already knew and used to throw away: how many
       * items were dealt, how many were right, and how long it actually ran
       * (the clock, or the wall time for a sudden-death round with no clock). */
      var res = GS.record(cfg.key, {
        score: score, combo: bestCombo, band: band0, run: bestRun,
        seen: seen, right: right,
        ms: cfg.duration || (startedAt ? Date.now() - startedAt : 0),
        curve: curve
      });
      // the daily challenge is one shared round; rating it would mean rating
      // everyone against the same draw, which is a different thing
      var rated = cfg.key === GS.dailyKey() ? null : GS.rate(cfg.key, score);

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

      /* The rating moves on every round, which is the point of having one:
       * a personal best is silent unless you beat it, and most rounds do not. */
      if (rated) {
        var rEl = el('div', 'g-rating' + (rated.delta > 0 ? ' up' : rated.delta < 0 ? ' down' : ''));
        rEl.appendChild(el('b', null, GS.fmt(rated.after)));
        rEl.appendChild(el('span', 'g-rating-d',
          rated.first ? 'tu nivel de partida'
            : rated.delta === 0 ? 'sin cambios'
            : (rated.delta > 0 ? '▴ ' : '▾ ') + Math.abs(rated.delta)));
        over.appendChild(rEl);
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
      if (lives) stat(String(bestRun), 'mejor racha');
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
        /* Says what actually happens now. It used to claim these were "in
         * Puntos débiles", which was true only of their topic, only once three
         * misses shared one, and only in a round you had to go and pick. */
        over.appendChild(el('p', 'g-over-note',
          'Volverán: una de cada cuatro preguntas sale de tus fallos.'));
      }

      /* The rematch. Chess's post-game analysis works because it is a story
       * about YOU — and the app already knows the one you keep living: a topic
       * in the error log you have now missed several times. Offered here
       * rather than on the games list because this is the moment it lands,
       * with the miss still on screen. */
      var rem = rematch();
      if (rem && window.Games && window.Games.openWeak) {
        var card = el('div', 'g-rematch');
        card.appendChild(el('span', 'g-rematch-label', 'La revancha'));
        card.appendChild(el('p', 'g-rematch-text',
          rem.label + ' — ' + rem.n + (rem.n === 1 ? ' fallo' : ' fallos') + ' hasta ahora.'));
        var go = el('button', 'g-rematch-go', '60 segundos con eso');
        go.type = 'button';
        go.addEventListener('click', function () { window.Games.openWeak(rem.topic, rem.label); });
        card.appendChild(go);
        over.appendChild(card);
      }

      var back = el('button', 'g-back', '← Juegos');
      back.type = 'button';
      back.addEventListener('click', function () { if (cfg.onExit) cfg.onExit(); });
      over.appendChild(back);

      host.appendChild(over);
      setTimeout(function () { again.focus(); }, 30);
    }

    /* A topic from THIS round's misses that the learner has been missing all
     * along — not merely their worst topic ever, which would offer the same
     * rematch after every round regardless of what just happened. */
    function rematch() {
      if (!window.ErrorLog || !window.Games || cfg.topic) return null;
      var counts = {};
      window.ErrorLog.list().forEach(function (e) {
        if (e.topic) counts[e.topic] = (counts[e.topic] || 0) + (e.count || 1);
      });
      var best = null;
      misses.forEach(function (m) {
        if (!m.topic || (counts[m.topic] || 0) < 3) return;
        if (!best || counts[m.topic] > counts[best]) best = m.topic;
      });
      return best ? { topic: best, n: counts[best], label: window.Games.topicLabel(best) } : null;
    }

    setBand(GS.bandForRung(rung));
    nextItem();
    tick();
  }

  return { run: run };
})();
