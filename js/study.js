/* ============================================================================
 * ESTUDIO — the day's pack: learn the words first, then play them.
 *
 * WHAT WAS MISSING. The arcade could only ever score you. Every round graded
 * correct answers up in the SRS and logged the misses, and then the misses
 * went nowhere: js/gameround.js records them with `reviewable: false`, and
 * ErrorLog.cards() returns only reviewable entries, so a word you got wrong
 * while playing was written down and never asked again — not in the deck, not
 * in the schedule, nowhere. That flag is right about the thing it was written
 * for (a mistype at second 58 must not demote a mature card) and wrong about
 * the consequence it had (a miss should still come back).
 *
 * So this is the other half of the arcade. No clock, no score, no ladder: a
 * small pack of cards, and then the same words dealt as a round.
 *
 * WHY TWO PHASES. Seeing a word and retrieving it are different operations and
 * the second only works after the first. A timed game is pure retrieval, which
 * is why it is punishing on anything you have not met — you cannot recall what
 * you never encoded. The main app's session already runs in this order
 * (Repasar before Producir); this is the same idea in ninety seconds.
 *
 * WHAT GOES IN THE PACK, in priority order, capped at twelve so it can be
 * finished in one sitting:
 *
 *   1. WHAT YOU GOT WRONG. ErrorLog entries, worst first. Including the game
 *      misses that previously had nowhere to go.
 *   2. WHAT IS DUE. The SRS already knows; it is not asked to know anything
 *      new. No second scheduler, no second notion of "overdue".
 *   3. SOMETHING NEW. A few unseen words at your band, so the pack is never
 *      only repair work — a day where you learn nothing is a day you skip.
 *
 * Deterministic for the day: the same pack until midnight, however many times
 * you open it. A pack that reshuffles on every visit is a slot machine, and
 * you can never finish it.
 *
 * GRADING IS THE APP'S OWN. "Lo sabía" is SRS.grade(id, true) and nothing
 * else — the same call the daily session makes. Study here and tomorrow's
 * session does not ask you again. One store, one schedule, two front doors.
 * ========================================================================== */
window.Study = (function () {
  var S = window.SRS, GI = window.GameItems;
  var KEY = 'fluidez.study';
  var MAX = 12, MAX_MISSES = 6, MAX_DUE = 4, MAX_NEW = 4;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function today() { return S ? S.today() : Math.floor(Date.now() / 86400000); }

  /* A card is always asked meaning → Spanish, whatever orientation the miss
   * happened to be recorded in. Recognising "la barca" and producing it are
   * different skills and only the second is worth a card: the games already
   * test recognition constantly. */
  function card(id, es, en, source) {
    if (!id || !es || !en) return null;
    return { id: id, es: String(es), en: String(en), source: source };
  }

  function fromMisses(n) {
    if (!window.ErrorLog) return [];
    var out = [];
    window.ErrorLog.list().forEach(function (e) {
      if (out.length >= n) return;
      /* es/en when the miss recorded them, otherwise the front/back pair as it
       * was written. A verb-form miss ("he ate" / "comió") is a perfectly good
       * card even though neither side is a dictionary headword. */
      var c = card(e.id, e.es || e.back, e.en || e.front, 'fallo');
      if (c) out.push(c);
    });
    return out;
  }

  // The vocabulary the games draw from, as {id, es, en} — the only pool the
  // SRS and this share, so "due" means the same thing in both.
  function vocabPool() {
    if (!GI) return [];
    var idx = GI.index(), out = [];
    ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(function (b) {
      (idx.vocab[b] || []).forEach(function (w) {
        if (w.es && w.en) out.push({ id: 'v:' + w.es + ':meaning', es: w.es, en: w.en });
      });
    });
    return out;
  }

  /* The day's pack. Seeded by the date so it is the same pack all day, and
   * seeded by nothing else so it is a different one tomorrow. */
  function pack() {
    var seen = {}, out = [];
    function add(c) {
      if (!c || seen[c.id] || out.length >= MAX) return;
      seen[c.id] = 1; out.push(c);
    }
    fromMisses(MAX_MISSES).forEach(add);

    var pool = vocabPool();
    if (S && pool.length) {
      S.duePriority(pool, MAX_DUE).forEach(function (w) {
        add(card(w.id, w.es, w.en, 'toca'));
      });
      var rng = window.UI ? window.UI.seededRandom('pack-' + today()) : Math.random;
      /* null, not 0. SRS.freshItems(pool, n) slices to n, so passing 0 asked
       * for everything unseen and got nothing — a pack that was only ever the
       * misses, with no new words in it at all. `false` skips the shuffle of a
       * 5,800-entry array, which this does not need: the seeded offset below
       * is what makes the choice stable for the day. */
      var fresh = S.freshItems(pool, null, false) || [];
      var start = fresh.length ? Math.floor(rng() * fresh.length) : 0;
      for (var i = 0; i < fresh.length && out.length < MAX; i++) {
        var w = fresh[(start + i) % fresh.length];
        if (out.filter(function (c) { return c.source === 'nuevo'; }).length >= MAX_NEW) break;
        add(card(w.id, w.es, w.en, 'nuevo'));
      }
    }
    return out;
  }

  function doneToday() { var st = load(); return st.day === today() && !!st.done; }
  function markDone() { save({ day: today(), done: true }); }

  /* ---- the flashcards ----------------------------------------------------
   * One card, one reveal, two answers. No timer and no score anywhere on the
   * screen: this is the one surface in the arcade where being slow is fine. */
  function render(host, opts) {
    opts = opts || {};
    var cards = pack();
    clear(host);
    var wrap = el('div', 'study');

    if (!cards.length) {
      wrap.appendChild(el('h2', 'study-q', 'Nada que estudiar'));
      wrap.appendChild(el('p', 'study-sub', 'No hay fallos pendientes ni palabras que toquen hoy. Juega una ronda y vuelve.'));
      var b0 = el('button', 'primary-btn', 'Volver');
      b0.type = 'button';
      b0.addEventListener('click', function () { if (opts.onExit) opts.onExit(); });
      wrap.appendChild(b0);
      host.appendChild(wrap);
      return;
    }

    var i = 0, knew = 0;
    var top = el('div', 'study-top');
    var count = el('span', 'study-count');
    var tag = el('span', 'study-tag');
    var quit = el('button', 'study-quit', '✕');
    quit.type = 'button';
    quit.setAttribute('aria-label', 'Salir');
    quit.addEventListener('click', function () { if (opts.onExit) opts.onExit(); });
    top.appendChild(count); top.appendChild(tag);
    top.appendChild(el('span', 'g-spacer')); top.appendChild(quit);
    wrap.appendChild(top);

    var body = el('div', 'study-body');
    wrap.appendChild(body);
    host.appendChild(wrap);

    var LABEL = { fallo: 'lo fallaste', toca: 'toca repasarlo', nuevo: 'nueva' };

    function show() {
      if (i >= cards.length) return finish();
      var c = cards[i];
      count.textContent = (i + 1) + ' / ' + cards.length;
      tag.textContent = LABEL[c.source] || '';
      tag.dataset.source = c.source;
      clear(body);

      body.appendChild(el('div', 'study-q', c.en));
      var backEl = el('div', 'study-a', c.es);
      backEl.hidden = true;
      body.appendChild(backEl);

      var reveal = el('button', 'primary-btn study-reveal', 'Ver la respuesta');
      reveal.type = 'button';
      var row = el('div', 'row-controls study-row');
      row.hidden = true;
      var no = el('button', 'ghost-btn study-no', 'No la sabía');
      var yes = el('button', 'primary-btn study-yes', 'La sabía');
      no.type = 'button'; yes.type = 'button';
      row.appendChild(no); row.appendChild(yes);

      reveal.addEventListener('click', function () {
        backEl.hidden = false;
        reveal.hidden = true;
        row.hidden = false;
      });
      function answer(ok) {
        /* The same call the daily session makes, so studying here genuinely
         * removes the card from tomorrow's review rather than shadowing it. */
        if (S) { S.enrol(c.id); S.grade(c.id, ok); }
        // A card known three times running leaves the mistake list, whether it
        // was answered here or in a round — one counter, both doors.
        if (window.ErrorLog && window.ErrorLog.credit && ok) window.ErrorLog.credit({ id: c.id });
        if (ok) knew++;
        i++; show();
      }
      no.addEventListener('click', function () { answer(false); });
      yes.addEventListener('click', function () { answer(true); });

      body.appendChild(reveal);
      body.appendChild(row);
    }

    function finish() {
      markDone();
      clear(body);
      tag.textContent = '';
      count.textContent = '';
      body.appendChild(el('div', 'study-q', 'Hecho'));
      body.appendChild(el('p', 'study-sub',
        'Sabías ' + knew + ' de ' + cards.length + '. Ahora úsalas antes de que se enfríen.'));
      var play = el('button', 'primary-btn', 'Jugar con estas palabras');
      play.type = 'button';
      play.addEventListener('click', function () {
        if (opts.onPlay) opts.onPlay(cards);
      });
      var back = el('button', 'ghost-btn', 'Ahora no');
      back.type = 'button';
      back.addEventListener('click', function () { if (opts.onExit) opts.onExit(); });
      var row = el('div', 'row-controls');
      row.appendChild(play); row.appendChild(back);
      body.appendChild(row);
    }

    show();
  }

  return { pack: pack, render: render, doneToday: doneToday, MAX: MAX };
})();
