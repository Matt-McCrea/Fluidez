/* ============================================================================
 * GAME ROUND: one universal round, so every game feels the same to play.
 * Ported from Fluidez js/gameround.js (no speech, no rematch, no "that counts too").
 *
 * Shared by every game: the HUD, the clock, the combo, the three ways of
 * answering (choose / type / build), the score that counts up, and the end screen.
 *
 *   THE CLOCK PAUSES ON A CORRECTION, and while the page is hidden (a 3-2-1 on return).
 *   A TYPED ANSWER RESOLVES THE MOMENT IT IS RIGHT, no Enter.
 *   A MISS NEVER LAPSES THE SRS: right grades up (and can make an item
 *   permanently learnt, js/srs.js), a miss goes to the error log and un-learns.
 *   GO RÉIDH (cfg.count) is N questions with no clock; the speed bonus still scores.
 * ========================================================================== */
window.GameRound = (function () {
  var UI = window.UI, GC = window.RUCore, S = window.SRS, GS = window.GameScore, GI = window.RUItems;

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
    /* TRANQUILO. cfg.count is a round of N questions with no clock at all: it
     * ends when the Nth is answered, the HUD shows "3 / 10" where the seconds
     * were, and the bar fills as you go. Speed still adds bonus points (that is
     * the scoring formula and it needs no clock), it just never ends anything.
     * Without a duration the engine used to mean sudden death; a count is
     * neither that nor a sprint, so it is named explicitly. */
    var counted = !!cfg.count;
    // the word and phrase grinds: what this round has already dealt and how many were new
    var grindState = { asked: 0, newN: 0, used: {} };
    var perItemClock = !cfg.duration && !counted;

    var startedAt = Date.now();
    /* The round's own shape, sampled at every score change, so a record round
       can be raced by the next one. Only timed rounds carry a ghost: in sudden
       death the thing you are chasing is how FAR you got, and there is no
       shared clock to line two runs up against. */
    var curve = [], ghost = !!(cfg.duration && (cfg.ghostAt || GS.hasGhost(cfg.key)));
    /* Whose round the ghost is. Your own record by default; js/liga.js passes
     * a friend's curve, and names them, because "▼ 12" against an unnamed
     * opponent is a number and "Ana ▼ 12" is a race. */
    var ghostAt = cfg.ghostAt || function (ms) { return GS.ghostAt(cfg.key, ms); };
    var score = 0, shownScore = 0, combo = 0, bestCombo = 0, bestRung = rung;
    var comboBefore = 0, rungBefore = rung;
    var seen = 0, right = 0, runLen = 0, bestRun = 0, misses = [], usedPrompts = {};
    var ended = false, paused = false, pausedAt = 0, recordHit = false;
    /* WHY THE CLOCK IS STOPPED. Two things can hold it: the correction screen
     * ('fb') and the app being hidden ('vis': the phone locked, another app in
     * front). It restarts only when neither does, so coming back to the app
     * mid-correction cannot start a clock under a screen that is waiting for
     * you to read it. */
    var holds = { fb: false, vis: false, kbd: false };
    var endAt = cfg.duration ? Date.now() + cfg.duration : null;
    var itemStart = 0, itemWindow = 0, current = null, resolved = true;
    var raf = null, pendingContinue = null, lastTyped = '';

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
    exit.setAttribute('aria-label', 'Leave the round');
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
    typeInput.setAttribute('lang', 'ru');
    typeInput.setAttribute('autocorrect', 'off');
    typeInput.enterKeyHint = 'go';
    typeInput.setAttribute('aria-label', 'Your answer, in Russian');
    typeHost.appendChild(typeInput);
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

    var pb = cfg.pb != null ? cfg.pb : GS.pb(cfg.key);
    pbEl.textContent = pb ? (cfg.pbLabel || 'PB') + ' ' + GS.fmt(pb) : '';
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
      if (counted) {
        secsEl.textContent = Math.min(seen + 1, cfg.count) + ' / ' + cfg.count;
        clockFill.style.transform = 'scaleX(' + Math.min(1, seen / cfg.count) + ')';
        raf = requestAnimationFrame(tick);
        return;
      }
      if (perItemClock) {
        secsEl.textContent = runLen + ' ✓';
        clock.dataset.urgent = left < 3000 ? '1' : '';
      } else {
        secsEl.textContent = secs;
        clock.dataset.urgent = left <= 10000 ? '1' : '';
        shell.dataset.urgent = left <= 10000 ? '1' : '';
        /* Racing the record, in the slot that used to hold its total. "PB
         * 8 420" is information you can do nothing with at second forty; "+340"
         * is the whole game. */
        if (ghost) {
          var g = ghostAt(cfg.duration - left);
          if (g != null) {
            var d = score - g;
            pbEl.textContent = (cfg.ghostName ? cfg.ghostName + ' ' : '') +
                               (d >= 0 ? '▲ +' : '▼ ') + GS.fmt(Math.abs(d));
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
    function anyHold() { return holds.fb || holds.vis || holds.kbd; }
    function pause(why) {
      if (ended) return;
      var was = anyHold();
      holds[why || 'fb'] = true;
      if (!was) { pausedAt = Date.now(); paused = true; }
    }
    function resume(why) {
      why = why || 'fb';
      if (!holds[why]) return;
      holds[why] = false;
      if (anyHold() || !paused) return;
      var slept = Date.now() - pausedAt;
      if (endAt) endAt += slept;
      itemStart += slept;
      paused = false;
    }

    /* PAUSE ON HIDE (Contrarreloj only; a Tranquilo round has no clock to
     * protect). A phone in a pocket locks itself, and a sixty-second round
     * that kept running through that was a round lost to the lock screen.
     * When the page is hidden the clock stops; when it comes back there is a
     * 3-2-1 over the question rather than an instant restart, because the
     * first second back is spent finding the screen again. */
    var resumeBox = null, resumeTimers = [];
    function clearResume() {
      resumeTimers.forEach(clearTimeout); resumeTimers = [];
      if (resumeBox && resumeBox.parentNode) resumeBox.parentNode.removeChild(resumeBox);
      resumeBox = null;
    }
    function isHidden() { return document.visibilityState === 'hidden' || document.hidden === true; }
    function onVisibility() {
      if (ended) return;
      if (isHidden()) { clearResume(); pause('vis'); return; }
      if (!holds.vis || resumeBox) return;
      resumeBox = el('div', 'g-resume');
      shell.appendChild(resumeBox);
      var step = cfg.resumeStepMs || 700, n = 3;
      (function count() {
        if (ended || !resumeBox) return;
        resumeBox.textContent = n > 0 ? String(n) : '';
        if (n === 0) { clearResume(); resume('vis'); return; }
        n--;
        resumeTimers.push(setTimeout(count, step));
      })();
    }
    var watchVisibility = !!cfg.duration && !cfg.noAutoPause;
    if (watchVisibility) document.addEventListener('visibilitychange', onVisibility);

    function stop() {
      ended = true;
      clearResume();
      document.removeEventListener('visibilitychange', onVisibility);
      if (raf) cancelAnimationFrame(raf);
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
      // a round with its own scoring (cfg.award) has no multiplier to show
      comboPill.hidden = n < 2 || !!cfg.award;
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
        if (item.id && S) {
          /* the card must be looked at BEFORE enrol: a typed right answer on an item the player has never met is
           * permanently learnt (js/srs.js, rule a); a tapped one never is */
          var fresh = !S.isEnrolled(item.id);
          S.enrol(item.id);
          S.grade(item.id, true, { typed: item.play === 'type', fresh: fresh });
        }
        // Getting it right is how a mistake stops being one. Same shape as the
        // record below, so ErrorLog files both under the same key.
        if (window.ErrorLog && window.ErrorLog.credit) {
          window.ErrorLog.credit({ id: item.id || null, kind: item.kind,
                                   front: item.prompt || item.ru || '', back: item.answer });
        }
        return;
      }
      if (item.id && S) {
        S.enrol(item.id);                      // eligible sooner, but not lapsed
        if (S.isLearnt && S.isLearnt(item.id)) S.grade(item.id, false);   // a learnt item missed anywhere loses the flag
      }
      if (window.ErrorLog) {
        /* ar/en as well as front/back where the two sides really are an Russian word
         * or phrase and its English; a gap falls back to front/back (the gapped
         * sentence, then the word that fills it). The prompt is always the meaning
         * and the answer the Russian. `topic` and `options` ride along so the miss
         * can be re-asked as the same choice. */
        var pair = item.kind === 'slova' || item.kind === 'frazy';
        var rec = {
          id: item.id || null,
          front: item.prompt || item.ru || '', back: item.answer,
          kind: item.kind, source: 'game', topic: item.topic || null,
          options: item.options || null, cefr: item.cefr || null
        };
        if (pair) { rec.ru = item.ru || item.answer; rec.en = item.en || item.prompt; }
        window.ErrorLog.record(rec);
      }
    }

    // ---- the loop ----------------------------------------------------------
    function nextItem() {
      if (ended) return;
      if (counted && seen >= cfg.count) { finish(); return; }
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
      /* Not in Palabras or Frases: their grind already deals a missed item
       * first, tapped, and this would ask it a second time, typed. */
      var grinds = cfg.kind === 'slova' || cfg.kind === 'frazy';
      if (!cfg.deck && !cfg.draw && !grinds && seen > 0 && seen % 4 === 3 && GI.missDeck) {
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
        /* cfg.draw: the round's own dealer. js/liga.js deals from fixed
         * steps rather than the ladder, and must deal the SAME sentences to
         * everyone on a seed — so no error-log revisits either (above). */
        var got = cfg.draw ? cfg.draw(rng)
                : cfg.deck ? GI.deckItem(cfg.deck, rng)
                            : GI.next(cfg.kind, rung, rng,
                                { topics: cfg.topics, theme: cfg.theme, pv: cfg.pv,
                                  grind: grindState, count: cfg.count || 0, gkind: cfg.kind });
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
    function keyOf(it) { if (it.key) return it.key; return (it.prompt || '') + '|' + (it.ru || it.answer || '') + '|' + (it.variety || '') + (it.hear ? 'h' : ''); }

    function timeOut() { if (!resolved) resolve('wrong', true); }

    function resolve(result, timedOut) {
      if (resolved || ended || holds.vis) return;
      resolved = true;
      var ms = Date.now() - itemStart;
      var item = current;
      // what the run looked like before this answer, so "eso también vale"
      // can put it back rather than trying to unpick the arithmetic
      comboBefore = combo;
      rungBefore = rung;
      seen++;
      /* A self-marked item (Speak, "say it"): the learner's own verdict. It scores nothing, never
       * touches the SRS or the error log, and goes straight on; cfg.onResolve still hears of it. */
      if (item.self) {
        if (cfg.onResolve) cfg.onResolve(item, result);
        setTimeout(function () { if (!ended) nextItem(); }, 0);
        return;
      }
      var a = cfg.award ? cfg.award(item, result, ms, combo) : GS.award(item, result, ms, combo);

      if (result === 'wrong') {
        GS.sfx('wrong');
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
          pop(cfg.recordText || 'New record!', 'record');
          GS.sfx('record');
        } else {
          GS.sfx(result, combo);
        }
      }
      writeBack(item, result);
      if (item.say && window.RU && RU.autoplay) RU.autoplay(item.say.t, item.say.v);
      if (cfg.onResolve) cfg.onResolve(item, result);
      rung = GS.nextRung(rung, result, rungCap, item && item.play);
      bestRung = Math.max(bestRung, rung);

      if (lives && livesLeft <= 0 && result === 'wrong') { showFeedback(item, result, timedOut, finish); return; }
      /* The Nth answer ends a counted round, after its correction has been
       * read: nextItem() is where the count is checked. */
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
    function diffLine(cls, label, text, against, latin) {
      var row = el('div', 'g-fb-line ' + cls);
      row.appendChild(el('span', 'g-fb-label', label));
      var body = el('span', 'g-fb-words');
      alignWords(keyed(text), keyed(against)).forEach(function (t, i) {
        if (i) body.appendChild(document.createTextNode(' '));
        var w = latin ? t.w : t.w;
        var node = latin ? document.createTextNode(w) : UI.ru(w);
        if (t.same) body.appendChild(node);
        else { var d = el('span', 'g-diff'); d.appendChild(node); body.appendChild(d); }
      });
      row.appendChild(body);
      return row;
    }

    var VLABEL = {};
    function badgeEl(v) {
      var b = el('span', 'g-badge', VLABEL[v] || v);
      b.dataset.v = v;
      return b;
    }
    function othersEl(item) {
      var wrap = el('div', 'g-others');
      item.others.forEach(function (o) {
        var r = el('div', 'g-other');
        r.appendChild(badgeEl(o.v));
        r.appendChild(UI.ru(o.text));
        var sp = UI.speaker(o.text, o.v);
        if (sp) r.appendChild(sp);
        wrap.appendChild(r);
      });
      return wrap;
    }
    // the answer on its own line: Russian in full, a speaker if there is a clip, a transliteration if it is due
    function answerNode(item, headline) {
      var span = el('span', 'g-fb-answer');
      if (item.ansLatin) { span.textContent = headline; return span; }
      span.appendChild(UI.ru(headline, 'big'));
      var sp = item.say && UI.speaker(item.say.t, item.say.v);
      if (sp) span.appendChild(sp);
      if (item.trAnswer) { span.appendChild(el('br')); span.appendChild(UI.tr(item.trAnswer)); }
      return span;
    }
    function noteNode(text) {
      var n = el('span', 'g-fb-note');
      UI.rich(n, text);
      return n;
    }

    /* How long the answer stays on screen. A correct answer barely interrupts;
     * a wrong one holds long enough to read the right answer and no longer,
     * with the clock stopped throughout and Enter to move on early. A phrase
     * shows its other varieties and a note after a right answer too. */
    function showFeedback(item, result, timedOut, then) {
      shell.dataset.state = result;
      var holdRight = (item.noteOnRight && item.note) || (item.others && item.others.length);
      if (result === 'good' && holdRight) {
        pause();
        clear(fbHost);
        var nbox = el('div', 'g-correct is-right');
        if (item.others && item.others.length) nbox.appendChild(othersEl(item));
        if (item.noteOnRight && item.note) nbox.appendChild(noteNode(item.note));
        fbHost.appendChild(nbox);
        var nrow = el('div', 'g-fb-actions'), ngo = el('button', 'g-continue', 'Next →');
        ngo.type = 'button';
        nrow.appendChild(ngo);
        fbHost.appendChild(nrow);
        var nt = setTimeout(ndone, 4200);
        function ndone() { clearTimeout(nt); if (ended) return; resume(); then(); }
        ngo.addEventListener('click', ndone);
        setTimeout(function () { if (!ended) pendingContinue = ndone; }, 0);
        return;
      }
      if (result === 'good') { setTimeout(function () { if (!ended) then(); }, 170); return; }

      pause();
      clear(fbHost);
      var box = el('div', 'g-correct');
      var headline = item.reveal && item.play === 'build' ? item.reveal : item.answer;
      var label = result === 'near' ? 'almost: check the spelling'
                : timedOut ? 'time is up' : 'answer';
      var typedIt = lastTyped && lastTyped.trim() && item.play === 'type';

      // the row the answer lives on
      var answerRow;
      if (typedIt) {
        // both lines, each marked against the other
        answerRow = diffLine('is-answer', label, headline, lastTyped);
        box.appendChild(answerRow);
        box.appendChild(diffLine('is-typed', 'you', lastTyped, headline));
        var sp0 = item.say && UI.speaker(item.say.t, item.say.v);
        if (sp0) box.appendChild(sp0);
        if (item.trAnswer) box.appendChild(UI.tr(item.trAnswer));
      } else {
        answerRow = el('div', 'g-fb-line is-answer');
        answerRow.appendChild(el('span', 'g-fb-label', label));
        answerRow.appendChild(answerNode(item, headline));
        box.appendChild(answerRow);
      }
      if (result === 'near' && lastTyped && window.RU && RU.slip) {
        var SLIP = { sign: 'Mind the soft sign ь or the hard sign ъ.', kratkoe: 'Mind й (short i) and и.',
          shch: 'Mind щ (shch) and ш (sh).', e: 'Mind э (e) and е (ye).', spelling: 'Check the spelling.' };
        box.appendChild(noteNode(SLIP[RU.slip(lastTyped, item.answer)] || SLIP.spelling));
      }
      var why = item.note || (item.reveal && item.reveal !== item.answer ? item.reveal : null);
      var whyEl = null;
      if (why) { whyEl = noteNode(why); box.appendChild(whyEl); }
      if (item.peek) { var pk = el('span', 'g-fb-note g-fb-en'); UI.rich(pk, item.peek); box.appendChild(pk); }
      if (item.others && item.others.length) box.appendChild(othersEl(item));
      fbHost.appendChild(box);

      var row2 = el('div', 'g-fb-actions');

      var go = el('button', 'g-continue', 'Next →');
      go.type = 'button';
      go.addEventListener('click', done);
      row2.appendChild(go);
      fbHost.appendChild(row2);
      /* A near miss moves on by itself: you got the item, the correction is
       * one spelling slip, and there is nothing to decide. A WRONG answer
       * waits; the round clock is paused for this screen, so the time is not
       * coming out of your sixty seconds. Enter still moves on, and so does Next. */
      var t = result === 'near' ? setTimeout(done, 2200) : null;
      function done() {
        if (t) clearTimeout(t);
        if (ended) return;
        resume();
        then();
      }
      /* Armed on the NEXT tick, never this one. A typed answer is submitted
       * with Enter, that keypress bubbles to the document, and arming
       * synchronously would let the same press dismiss the correction it just
       * produced. */
      setTimeout(function () { if (!ended) pendingContinue = done; }, 0);
    }

    // ---- the ways of answering ---------------------------------------------
    function renderItem(item) {
      clear(itemHost);
      pendingContinue = null;
      hideTypeBox();
      if (item.play === 'choose') return renderChoose(item);
      if (item.play === 'build') return item.tiles ? renderTiles(item) : renderBuild(item);
      if (item.play === 'say') return renderSay(item);
      showTypeBox();
      kbdGuide();
      return renderType(item);
    }

    /* One-time sheet before the first typed item ever: how to add the Russian
     * keyboard. "Done" is for good; "Remind me later" brings it back tomorrow. */
    function kbdFlag() { try { return JSON.parse(localStorage.getItem('svobodno.kbd')); } catch (e) { return null; } }
    function kbdGuide() {
      var f = kbdFlag();
      if (f === 'done' || f === true || (f && f.done)) return;
      var td = S ? S.today() : 0;
      if (f && f.later != null && f.later >= td) return;
      if (shell.querySelector && shell.querySelector('.g-kbd')) return;
      var sheet = el('div', 'g-kbd');
      sheet.appendChild(el('b', null, 'Add the Russian keyboard'));
      sheet.appendChild(el('p', null, 'Settings → General → Keyboard → Keyboards → Add New Keyboard → Russian, then tap 🌐 to switch.'));
      var row = el('div', 'g-fb-actions');
      function close(val) {
        try { localStorage.setItem('svobodno.kbd', JSON.stringify(val)); } catch (e) {}
        if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
        resume('kbd');
      }
      var done = el('button', 'g-continue', 'Done'); done.type = 'button';
      var later = el('button', 'g-peek', 'Remind me later'); later.type = 'button';
      done.addEventListener('click', function () { close('done'); });
      later.addEventListener('click', function () { close({ later: td }); });
      row.appendChild(done); row.appendChild(later);
      sheet.appendChild(row);
      pause('kbd');
      shell.appendChild(sheet);
    }

    /* The English in the prompt: a trailing bracket is a disambiguator the data
     * carries, set quietly aside. The Russian of a sentence is drawn at its vowel
     * level with the gap as one unit. */
    function listenButton(say) {
      var b = el('button', 'spk big', '🔊');
      b.type = 'button';
      b.setAttribute('aria-label', 'Hear it');
      b.addEventListener('click', function () { if (window.RU && RU.play) RU.play(say.t, say.v); });
      return b;
    }
    function promptEl(item, cls) {
      var p = el('div', 'g-prompt' + (cls ? ' ' + cls : ''));
      if (item.hear) {
        p.classList.add('hear');
        p.appendChild(listenButton(item.promptSay));
        p.appendChild(el('span', 'g-prompt-note', item.hearLabel || 'Listen, then pick the word'));
        return p;
      }
      var text = item.prompt || '';
      if (item.pRu) {
        p.classList.add('is-ru');
        if (item.pBig) p.classList.add('ru-big');
        if (item.pItalic) p.classList.add('ru-italic');
        text.split('＿＿＿').forEach(function (part, i) {
          if (i) p.appendChild(el('span', 'g-gap', '＿＿＿'));
          if (part) p.appendChild(UI.ruText(part, item.level, null));
        });
        if (item.promptSay) { var s1 = UI.speaker(item.promptSay.t, item.promptSay.v); if (s1) p.appendChild(s1); }
        if (text.length > 60) p.classList.add('long');
        return p;
      }
      if (item.pBig) {
        p.classList.add('big-prompt');
        p.appendChild(el('span', 'g-bigtext', text));
        if (item.pSub) p.appendChild(UI.tr(item.pSub, 'block'));
        if (item.promptSay) { var s2 = UI.speaker(item.promptSay.t, item.promptSay.v); if (s2) p.appendChild(s2); }
        return p;
      }
      var m = /^(.*?)\s*\(([^()]*)\)\s*([.!?]?)$/.exec(text);
      if (m && m[1].length > 3) {
        p.appendChild(el('span', null, m[1] + m[3]));
        p.appendChild(el('span', 'g-prompt-note', m[2]));
      } else {
        p.appendChild(el('span', null, text));
      }
      if (item.variety) p.appendChild(badgeEl(item.variety));
      if (item.pSub) p.appendChild(UI.tr(item.pSub, 'block'));
      if (item.promptSay) { var s3 = UI.speaker(item.promptSay.t, item.promptSay.v); if (s3) p.appendChild(s3); }
      if (text.length > 60) p.classList.add('long');
      return p;
    }

    /* The cue (English, under an Russian sentence) and the English of the whole
     * sentence, withheld and one tap away. */
    function subEl(item) {
      if (item.sub) { var s = el('div', 'g-sub'); UI.rich(s, item.sub); return s; }
      if (!item.peek && !item.cue) return null;
      var box = el('div', 'g-sub');
      if (item.cue) box.appendChild(UI.rich(el('div', 'g-cue'), item.cue));
      if (item.peek) {
        var b = el('button', 'g-peek', 'English');
        b.type = 'button';
        b.addEventListener('click', function () { clear(b); UI.rich(b, item.peek); b.classList.add('shown'); });
        box.appendChild(b);
      }
      return box;
    }

    function optionButton(item, o) {
      var b = el('button', 'g-opt');
      b.type = 'button';
      b._val = o;
      if (item.optScript && item.optScript[o]) {
        // Speak: the sound (transliteration) is the main line, the script small above it
        b.classList.add('has-sp');
        b.appendChild(UI.ru(item.optScript[o], 'sp-ru'));
        b.appendChild(el('span', 'sp-tr', o));
      } else if (item.optRu) {
        b.classList.add('has-ru');
        if (item.optBig) b.classList.add('big');
        b.appendChild(UI.ruText(o, item.level, item.helps && item.helps[o], item.optBig ? 'big' : null));
        if (item.optTr && item.optTr[o]) b.appendChild(UI.tr(item.optTr[o], 'block'));
      } else {
        b.textContent = o;
      }
      return b;
    }

    function renderChoose(item) {
      itemHost.appendChild(promptEl(item));
      var sub = subEl(item);
      if (sub) itemHost.appendChild(sub);
      var opts = el('div', 'g-options');
      if (item.optBig) opts.classList.add('big');
      item.options.forEach(function (o) {
        var b = optionButton(item, o);
        b.addEventListener('click', function () {
          if (resolved) return;
          var ok = o === item.answer;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) Array.prototype.forEach.call(opts.children, function (c) {
            if (c._val === item.answer) c.classList.add('right');
          });
          resolve(ok ? 'good' : 'wrong');
        });
        opts.appendChild(b);
      });
      itemHost.appendChild(opts);
      if ((item.hear || item.playPrompt) && item.promptSay && window.RU && RU.play) RU.play(item.promptSay.t, item.promptSay.v);
    }

    /* Speak, "say it": the English, then Listen reveals the sound, the script and the English,
     * and the learner marks themselves. Self-marked: see resolve(). */
    function renderSay(item) {
      itemHost.appendChild(promptEl(item));
      var sub = el('div', 'g-sub', 'Say it out loud, then listen');
      itemHost.appendChild(sub);
      var box = el('div', 'g-say');
      var cardHost = el('div', 'g-say-slot');
      var listen = el('button', 'arc-btn on g-say-listen', 'Listen');
      listen.type = 'button';
      var marks = el('div', 'g-fb-actions g-say-marks');
      marks.hidden = true;
      var got = el('button', 'g-continue', 'Got it'), not = el('button', 'g-peek', 'Not yet');
      got.type = 'button'; not.type = 'button';
      function mark(ok) { if (!resolved) resolve(ok ? 'good' : 'wrong'); }
      got.addEventListener('click', function () { mark(true); });
      not.addEventListener('click', function () { mark(false); });
      marks.appendChild(got); marks.appendChild(not);
      listen.addEventListener('click', function () {
        if (item.say && window.RU && RU.play) RU.play(item.say.t, item.say.v);
        if (cardHost.firstChild) return;
        var card = el('div', 'g-say-card');
        card.appendChild(el('div', 'g-say-tr', item.trAnswer || ''));
        if (item.ru) card.appendChild(UI.ru(item.sayRu || item.ru, 'sp-ru'));
        card.appendChild(el('div', 'g-say-en', item.en || item.prompt));
        cardHost.appendChild(card);
        marks.hidden = false;
      });
      box.appendChild(listen);
      box.appendChild(cardHost);
      box.appendChild(marks);
      itemHost.appendChild(box);
    }

    /* Resolves the instant it is right, no Enter and no submit button. The
     * listeners are on the shared input above; this only has to present it. */
    function renderType(item) {
      itemHost.appendChild(promptEl(item));
      var sub = subEl(item);
      if (sub) itemHost.appendChild(sub);
      showTypeBox();
    }

    /* Reset and reveal the shared input without ever detaching it. */
    function showTypeBox(label) {
      typeInput.setAttribute('aria-label', label || 'Your answer, in Russian');
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

    // chips of words in reading order, into an answer line (phrases of six to eight words)
    function renderBuild(item) {
      itemHost.appendChild(promptEl(item, 'build'));
      var lineEl = el('div', 'g-build');
      var bank = el('div', 'g-bank');
      // Speak builds in transliteration: Latin tiles, left to right
      var built = [];
      function chipNode(w, cls) {
        var c = el('button', cls);
        c.type = 'button';
        if (item.latin) c.textContent = w;
        else c.appendChild(UI.ruText(w, item.level, null));
        return c;
      }
      var chips = GC.shuffle(item.words.slice()).map(function (w, idx) {
        var c = chipNode(w, 'g-chip');
        c._word = w;
        c.addEventListener('click', function () {
          if (resolved || built.indexOf(idx) !== -1) return;
          reserve();
          built.push(idx); draw();
          if (built.length === item.words.length) {
            var said = built.map(function (i) { return chips[i]._word; }).join(' ');
            var r = item.latin ? (said === item.answer ? 'good' : 'wrong') : GI.grade(item, said);
            var ok = r !== 'wrong';
            lastTyped = said;                 // so the correction can show it
            lineEl.classList.add(ok ? 'right' : 'wrong');
            resolve(ok ? 'good' : 'wrong');
          }
        });
        bank.appendChild(c);
        return c;
      });
      function draw() {
        clear(lineEl);
        built.forEach(function (idx, pos) {
          var c = chipNode(chips[idx]._word, 'g-chip chosen');
          c.addEventListener('click', function () { if (resolved) return; built.splice(pos, 1); draw(); });
          lineEl.appendChild(c);
        });
        if (!built.length) lineEl.appendChild(el('span', 'g-build-hint', 'tap the words in order'));
        chips.forEach(function (c, idx) {
          var used = built.indexOf(idx) !== -1;
          c.classList.toggle('used', used);
          c.disabled = used;
        });
      }
      draw();
      itemHost.appendChild(lineEl);
      itemHost.appendChild(bank);
      var reserved = false;
      function reserve() {
        if (reserved) return;
        var bankH = bank.offsetHeight;
        if (!bankH) return;
        reserved = true;
        lineEl.style.minHeight = (bankH + 26 + 47) + 'px';
      }
      reserve();
      if (!reserved && window.requestAnimationFrame) requestAnimationFrame(reserve);
    }

    /* Stage 0 spelling: letter tiles tapped in reading order into a right-to-left
     * row. item.tiles holds the tiles (the word's letters and two decoys), item.target
     * the letters the row must end up with. A backspace tile takes the last one back. */
    function renderTiles(item) {
      itemHost.appendChild(promptEl(item, 'build'));
      var lineEl = el('div', 'g-tilerow');
      var bank = el('div', 'g-tilebank');
      var built = [];
      var back = el('button', 'g-tile back', '⌫');
      back.type = 'button';
      back.setAttribute('aria-label', 'Take back the last letter');
      var tiles = item.tiles.map(function (ch, idx) {
        var c = el('button', 'g-tile');
        c.type = 'button';
        c._ch = ch;
        c.appendChild(UI.ru(ch, 'tile-ch'));
        c.addEventListener('click', function () {
          if (resolved || built.indexOf(idx) !== -1) return;
          built.push(idx); draw();
          if (built.length === item.target.length) {
            var said = built.map(function (i) { return tiles[i]._ch; }).join('');
            var ok = said === item.target;
            lastTyped = said;
            lineEl.classList.add(ok ? 'right' : 'wrong');
            resolve(ok ? 'good' : 'wrong');
          }
        });
        bank.appendChild(c);
        return c;
      });
      back.addEventListener('click', function () { if (resolved || !built.length) return; built.pop(); draw(); });
      bank.appendChild(back);
      function draw() {
        clear(lineEl);
        built.forEach(function (idx) { lineEl.appendChild(el('span', 'g-slot', null)).appendChild(UI.ru(tiles[idx]._ch, 'tile-ch')); });
        if (!built.length) lineEl.appendChild(el('span', 'g-build-hint', 'tap the letters in order'));
        tiles.forEach(function (c, idx) {
          var used = built.indexOf(idx) !== -1;
          c.classList.toggle('used', used);
          c.disabled = used;
        });
        back.disabled = !built.length;
      }
      draw();
      itemHost.appendChild(lineEl);
      itemHost.appendChild(bank);
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
      // a Go réidh round has no clock, so it is not rated
      var rated = cfg.award || counted ? null : GS.rate(cfg.key, score);
      /* A round that answers to somebody else says so here, in place of the
       * personal-best line: js/liga.js files the round and returns where it
       * leaves you in the week. */
      var said = cfg.onFinish ? cfg.onFinish({
        score: score, seen: seen, right: right, curve: curve,
        ms: cfg.duration || (startedAt ? Date.now() - startedAt : 0)
      }) : null;

      clear(host);
      var over = el('div', 'g-over');
      over.dataset.pb = res.isPb ? '1' : '';

      over.appendChild(el('div', 'g-over-eyebrow', cfg.title));
      var big = el('div', 'g-over-score', GS.fmt(score));
      over.appendChild(big);

      if (said) {
        over.appendChild(said);
      } else if (res.isPb) {
        over.appendChild(el('div', 'g-over-verdict pb',
          res.prevPb ? 'New record! ' + GS.fmt(res.gap) + ' more than before' : 'Your first record'));
      } else if (res.pb) {
        over.appendChild(el('div', 'g-over-verdict',
          GS.fmt(res.gap) + ' short of your record of ' + GS.fmt(res.pb)));
      }

      /* The rating moves on every round, which is the point of having one:
       * a personal best is silent unless you beat it, and most rounds do not. */
      if (rated) {
        var rEl = el('div', 'g-rating' + (rated.delta > 0 ? ' up' : rated.delta < 0 ? ' down' : ''));
        rEl.appendChild(el('b', null, GS.fmt(rated.after)));
        rEl.appendChild(el('span', 'g-rating-d',
          rated.first ? 'your starting rating'
            : rated.delta === 0 ? 'no change'
            : (rated.delta > 0 ? '▴ ' : '▾ ') + Math.abs(rated.delta)));
        over.appendChild(rEl);
      }

      if ((cfg.kind === 'slova' || cfg.kind === 'igrat') && GI.coverage && GI.bankCount('slova')) {
        var cov = GI.coverage(cfg.theme);
        var covEl = el('div', 'g-over-cover');
        covEl.appendChild(el('div', 'g-over-cover-all', cov.text));
        if (cov.theme) covEl.appendChild(el('div', 'g-over-cover-theme', cov.theme.text));
        over.appendChild(covEl);
      }

      if (cfg.kind === 'frazy' && GI.phraseCoverage) {
        var pcov = el('div', 'g-over-cover');
        pcov.appendChild(el('div', 'g-over-cover-all', GI.phraseCoverage().text));
        over.appendChild(pcov);
      }

      var again = el('button', 'g-again', cfg.againLabel || 'Play again');
      again.type = 'button';
      again.addEventListener('click', function () { if (cfg.again) cfg.again(); else run(host, cfg); });
      over.appendChild(again);

      var stats = el('div', 'g-over-stats');
      function stat(n, l) {
        var s2 = el('div', 'g-stat');
        s2.appendChild(el('b', null, n));
        s2.appendChild(el('span', null, l));
        stats.appendChild(s2);
      }
      stat(seen ? Math.round(100 * right / seen) + '%' : '0%', 'accuracy');
      if (lives) stat(String(bestRun), 'best run');
      // A round with its own scoring has no multiplier, and one with its own
      // dealer has no ladder to have climbed (js/liga.js has both).
      if (!cfg.award) stat('×' + (1 + Math.min(bestCombo, 10) * 0.1).toFixed(1), 'best combo');
      if (!cfg.draw) stat(band0, 'reached');
      stat(String(res.todayBest ? GS.fmt(res.todayBest) : '0'), 'best today');
      over.appendChild(stats);

      if (misses.length) {
        over.appendChild(el('h3', 'g-over-h', 'To review'));
        var list = el('div', 'g-misses');
        misses.slice(0, 4).forEach(function (m) {
          var r = el('div', 'g-miss');
          var mq = el('span', 'g-miss-q');
          if (m.pRu) mq.appendChild(UI.ru(String(m.prompt || '').replace(/＿＿＿/g, '___')));
          else mq.textContent = m.prompt || (m.hear ? '🔊' : m.ru || '');
          r.appendChild(mq);
          var ma = el('span', 'g-miss-a');
          if (m.ansLatin) ma.textContent = m.answer; else ma.appendChild(UI.ru(m.answer));
          r.appendChild(ma);
          list.appendChild(r);
        });
        over.appendChild(list);
        /* Says what actually happens now. It used to claim these were "in
         * Puntos débiles", which was true only of their topic, only once three
         * misses shared one, and only in a round you had to go and pick. */
        // Palabras and Frases deal a miss first in the next round (their grind); the rest revisit one in four
        over.appendChild(el('p', 'g-over-note',
          cfg.kind === 'slova' || cfg.kind === 'frazy'
            ? 'These come first in your next round.'
            : 'These come back: one question in four is one you missed.'));
      }

      var back = el('button', 'g-back', '← ' + 'Back');
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
