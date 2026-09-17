/* ============================================================================
 * STAGE 1 — REPASAR (Review).
 * Spaced repetition over everything enrolled: vocab, idioms, grammar recall,
 * verb meanings, captured words and logged errors. Due items first; new items
 * introduced each day so the pool grows.
 *
 * DIRECTION is decided PER CARD from the profile:
 *   en2es      — always produce the Spanish (typed). Standard & Refresher.
 *   graduated  — a word starts as ES→EN recognition (multiple choice) while
 *                it's new/fragile (SRS box ≤ 1), then flips to EN→ES production
 *                (typed) once it's stuck (box ≥ 2). Beginner. So a beginner's
 *                daily review is mostly recognition early, shifting to
 *                production as words settle.
 * Grammar-recall and logged-error cards are fixed (always produce the answer).
 * ========================================================================== */
window.StageReview = (function () {
  /* A review card's id already says where it came from: "g:presubj:yo" from a
   * generated tense lesson, "p:gr-relativas-b1-2" from a strand lesson's
   * probes. Recover that rather than adding a field to 1,100 cards. */
  function topicOf(card) {
    var id = String((card && card.id) || '');
    var m = id.match(/^g:([a-z]+):/);
    if (m) return 'tense:' + m[1];
    m = id.match(/^p:(.+)-\d+$/);
    if (m) return 'lesson:' + m[1];
    if (card && card.tense) return 'tense:' + card.tense;
    return null;
  }
  var UI = window.UI, E = window.ENGINE, S = window.SRS, C = window.Checker;
  var ErrorLog = window.ErrorLog, P = window.Profile;

  // Language-neutral pool: pair cards carry {es,en}; grammar/error are fixed.
  function pool() {
    var items = [];
    (window.VOCAB || []).forEach(function (w, idx) {
      if (!P.wordAllowed(w)) return;                     // your own words are never gated out
      items.push({ id: 'v:' + w.es + ':meaning', es: w.es, en: w.en, kind: 'vocab',
                   cat: w.cat, theme: w.theme || null, rank: P.catRank(w.cat), idx: idx });
    });
    (window.IDIOMS || []).forEach(function (x) {
      items.push({ id: 'i:' + x.es, es: x.es, en: x.en, lit: x.lit || null, kind: 'idiom' });
    });
    (window.GRAMMAR_LESSONS || []).forEach(function (l) {
      (l.recall || []).forEach(function (r) {
        // Questions ABOUT grammar, in English, are comprehension checks for the
        // end of a lesson — never review cards. Filtering here rather than only
        // at enrolment matters: anything enrolled before that rule existed was
        // still being served, which is what kept "How does X express an
        // obligation?" appearing in Repasar.
        if (r.srs === false) return;
        /* Carry `probe` through. js/lessons.js keeps the ORIGINAL shape on
         * every card precisely so the view can "ask it the way it was
         * written", and this was the call site dropping it — so a question
         * authored as a four-way choice arrived as a blank box demanding the
         * exact string, comma and capital included. */
        items.push({ id: r.id, front: r.front, back: r.back, kind: 'grammar',
                     fixed: true, enrolledOnly: true, probe: r.probe || null });
      });
    });
    (window.VERBS || []).forEach(function (v) {
      items.push({ id: 'vm:' + v.inf, es: v.inf, en: v.en, kind: 'verb', enrolledOnly: true });
    });
    // conjugation-in-context, scheduled per (lemma, tense) — a different real
    // sentence is drawn each time this pair comes up, but the id (and so the
    // schedule) is stable per verb+tense, not per sentence.
    /* Gate these by the tenses the level has actually taught. The review pool
     * never consulted the learner's level, so once a verb+tense pair was
     * enrolled — by tapping any lesson in Lecciones, which are all open — it
     * came back forever. That is how an A1 learner on day four met imperfect
     * conjugations: the session's own content gate is fine, but Repasar sat
     * outside it. */
    var allowed = {};
    (P.tenses() || []).forEach(function (t) { allowed[t] = 1; });
    var seenPairs = {};
    (window.APPLY_ITEMS || []).forEach(function (it) {
      if (it.type !== 'cloze') return;
      if (!allowed[it.tense]) return;
      var key = it.inf + '|' + it.tense;
      if (seenPairs[key]) return; seenPairs[key] = 1;
      var group = (window.APPLY_ITEMS || []).filter(function (x) { return x.type === 'cloze' && x.inf === it.inf && x.tense === it.tense; });
      var pick = group[Math.floor(Math.random() * group.length)];
      var v = E.verbByInf(pick.inf);
      var idx = E.personsFor(pick.tense).indexOf(pick.person);
      var ans = v ? E.conjugate(v, pick.tense)[idx] : null;
      if (!ans) return;
      items.push({
        id: 'vt:' + it.inf + ':' + it.tense,
        front: pick.text.replace('___', '＿＿＿') + '  [' + pick.inf + ']', back: ans,
        kind: 'verb-tense', tense: pick.tense, fixed: true, enrolledOnly: true, hint: E.TENSE_LABEL[pick.tense]
      });
    });
    /* The phrases every lesson opens with (js/phrases.js). enrolledOnly, so
     * they are not 5,290 cards dumped into the deck on day one — a phrase
     * arrives here because a game round put it in play, which means it
     * arrives because you got it wrong, which is when it is worth asking. */
    (window.Phrases ? window.Phrases.all() : []).forEach(function (ph) {
      items.push({ id: ph.id, es: ph.es, en: ph.en, kind: 'phrase',
                   hint: ph.note || null, enrolledOnly: true });
    });
    if (ErrorLog) ErrorLog.cards().forEach(function (c) {               // {front, back, hint} — fixed
      items.push({ id: c.id, front: c.front, back: c.back, hint: c.hint || null, kind: 'error', fixed: true });
    });
    // "Stop asking me this" is permanent and applies everywhere a card can
    // surface, not only where it was retired.
    return window.Vetoed ? window.Vetoed.filter(items) : items;
  }

  // Resolve a card to a concrete direction: { front, back, mode, toSpanish, hint }
  function resolve(card, pr) {
    // a question written as a choice is asked as a choice, with ITS options
    if (card.fixed && card.probe && card.probe.kind === 'mcq' && (card.probe.options || []).length > 1) {
      return { front: card.front, back: card.back, mode: 'choice', toSpanish: true,
               options: card.probe.options, hint: card.hint || null };
    }
    if (card.fixed) return { front: card.front, back: card.back, mode: 'type', toSpanish: true, hint: card.hint || null };
    var d = pr.reviewDirection;
    if (d === 'graduated') d = (S.boxOf(card.id) <= 1) ? 'es2en' : 'en2es';
    if (d === 'es2en') return { front: card.es, back: card.en, mode: 'choice', toSpanish: false, hint: card.hint || null };
    return { front: card.en, back: card.es, mode: 'type', toSpanish: true,
      hint: card.kind === 'idiom' && card.lit ? 'lit: ' + card.lit : (card.hint || null) };
  }

  function run(host, ctx, done) {
    var pr = P.params();
    var all = pool().filter(function (it) { return !it.enrolledOnly || S.isEnrolled(it.id); });
    if (pr.orderedVocab) {
      all.sort(function (a, b) { return (a.rank == null ? 500 : a.rank) - (b.rank == null ? 500 : b.rank) || (a.idx || 0) - (b.idx || 0); });
    }
    /* A "4 min" quick review has to actually be four minutes, so it takes the
     * most-overdue slice rather than the whole daily cap. SRS.batch reschedules
     * whatever it leaves behind, so nothing is lost — it comes round again. */
    var cap = P.reviewCap();
    var fresh = pr.newPerDay;
    if (ctx && ctx.mode === 'rapido') { cap = Math.min(cap, 10); fresh = 0; }
    else if (ctx && ctx.mode === 'corto') { cap = Math.min(cap, 15); }
    /* Under a theme focus the daily new-word drip comes from that theme first.
     * This is the channel that matters most: it runs EVERY session, where the
     * lesson ladder teaches a theme on only a handful of days in the whole
     * course. A preference, not a filter — see SRS.batch. */
    var fTheme = window.Focus ? window.Focus.theme() : null;
    var batch = S.batch(all, cap, fresh, !pr.orderedVocab,
      fTheme ? function (it) { return it.theme === fTheme; } : null);
    batch.forEach(function (it) { S.enrol(it.id); });

    // recognition distractors: other English glosses of the same kind
    var enByKind = {};
    all.forEach(function (it) { if (it.en) (enByKind[it.kind] = enByKind[it.kind] || []).push(it.en); });

    var queue = batch.slice(), seen = 0, correct = 0, missed = {};

    if (!queue.length) {
      var empty = UI.el('div', 'panel');
      empty.appendChild(UI.el('h2', null, UI.t('Nada que repasar hoy', 'Nothing to check today')));
      empty.appendChild(UI.el('p', 'muted', ctx && ctx.mode === 'rapido'
        ? 'Your review queue is clear. New items are added as you learn.'
        : 'Your review queue is clear — new items are added as you learn. On to today\'s lesson.'));
      empty.appendChild(UI.nextBtn('Continuar →', function () { ctx.results.review = { seen: 0, correct: 0 }; done(); }));
      host.appendChild(empty); return;
    }

    /* Review was a stage you got through before the lesson — it opened
     * straight onto a card with a counter. It is the highest-value minutes in
     * the session and it read as the toll for them, so it gets a line saying
     * what it is: not revision, a check of what is still there. The number is
     * the honest version of "this will be short". */
    var opener = UI.el('div', 'review-opener');
    opener.appendChild(UI.el('b', null, UI.t('¿Te acuerdas?', 'Still remember these?')));
    opener.appendChild(UI.el('span', null,
      queue.length + UI.t(queue.length === 1 ? ' cosa que ya has visto.' : ' cosas que ya has visto.',
                          queue.length === 1 ? ' thing you have met before.' : ' things you have met before.')));
    host.appendChild(opener);

    var card = UI.el('div', 'panel review-card');
    var stats = UI.el('div', 'muted review-stats');
    var kind = UI.el('span', 'kind-badge');
    var front = UI.el('div', 'card-front');
    var body = UI.el('div');
    var feedback = UI.el('div', 'feedback');
    card.appendChild(stats); card.appendChild(kind); card.appendChild(front);
    card.appendChild(body); card.appendChild(feedback);
    host.appendChild(card);

    var cur = null, R = null;    // cur = pool card, R = resolved direction

    function advance(good) {
      queue.shift(); seen++;
      if (good) { correct++; S.grade(cur.id, !missed[cur.id]); }
      else {
        S.grade(cur.id, false);
        if (!missed[cur.id] && ErrorLog && cur.kind !== 'error') {
          ErrorLog.record({ id: cur.id, front: R.front, back: R.back, kind: cur.kind, source: 'review', hint: R.hint, topic: topicOf(cur), reviewable: false, es: cur.es || null, en: cur.en || null });
        }
        missed[cur.id] = 1; queue.push(cur);
      }
      show();
    }

    function show() {
      if (!queue.length) { finish(); return; }
      cur = queue[0]; R = resolve(cur, pr);
      kind.textContent = cur.kind; kind.dataset.kind = cur.kind;
      front.textContent = R.front;
      feedback.textContent = ''; feedback.className = 'feedback';
      stats.textContent = seen + ' done · ' + queue.length + ' to go';
      UI.clear(body);
      // an authored choice always has its options; a vocab card needs three
      // plausible distractors scavenged from the same kind before it can offer one
      var canChoose = R.mode === 'choice' &&
        (R.options ? R.options.length > 1
                   : (enByKind[cur.kind] || []).filter(function (b) { return b !== R.back; }).length >= 3);
      if (canChoose) showChoice(); else showType();
    }

    // ---- multiple-choice (recognition) ----
    function showChoice() {
      var opts;
      if (R.options) {
        opts = E.shuffle(R.options.slice());          // the options the author wrote
      } else {
        var others = E.shuffle((enByKind[cur.kind] || []).filter(function (b) { return b !== R.back; }));
        opts = E.shuffle([R.back].concat(others.slice(0, 3)));
      }
      var answered = false;
      var grid = UI.el('div', 'mcq-opts');
      opts.forEach(function (opt) {
        var b = UI.el('button', 'mcq-btn', opt); b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          var right = opt === R.back;
          b.classList.add(right ? 'right' : 'wrong');
          if (!right) Array.prototype.forEach.call(grid.children, function (c) { if (c.textContent === R.back) c.classList.add('right'); });
          feedback.textContent = right ? '¡Correcto!' : R.front + ' → ' + R.back;
          feedback.className = 'feedback ' + (right ? 'good' : 'bad');
          setTimeout(function () { advance(right); }, right ? 450 : 1200);
        });
        grid.appendChild(b);
      });
      body.appendChild(grid);
    }

    // ---- typed answer ----
    function showType() {
      var input = UI.el('input', 'answer-input'); input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
      input.placeholder = R.toSpanish ? 'escribe en español…' : 'type in English…';
      var revealB = UI.el('button', 'ghost-btn', 'Reveal'); revealB.type = 'button';
      var hintEl = UI.el('div', 'muted hint', R.hint || '');
      body.appendChild(input);
      if (R.toSpanish) body.appendChild(UI.accentBar(function () { return input; }));
      body.appendChild(hintEl);
      var controls = UI.el('div', 'row-controls'); controls.appendChild(revealB);
      /* The escape hatch for a question no rule caught. A bad card is bad
       * every time it comes round, so this retires it for good rather than
       * pushing it a few days out — and it costs the learner nothing: the
       * round moves on, no miss recorded. */
      if (cur.id) {
        var vetoB = UI.el('button', 'linkish veto-btn', UI.t('No preguntes esto', 'Stop asking this'));
        vetoB.type = 'button';
        vetoB.title = UI.t('Retira esta pregunta para siempre', 'Retires this question for good');
        vetoB.addEventListener('click', function () {
          var gone = cur.id;
          if (window.Vetoed) window.Vetoed.add(gone);
          // drop every copy, including the one advance() re-queued after a miss
          queue = queue.filter(function (c) { return c.id !== gone; });
          feedback.textContent = UI.t('Retirada.', 'Retired.');
          feedback.className = 'feedback';
          setTimeout(show, 260);
        });
        controls.appendChild(vetoB);
      }
      body.appendChild(controls);
      var locked = false, revealed = false;
      function good() { if (locked) return; locked = true; feedback.textContent = '¡Correcto! ' + R.back; feedback.className = 'feedback good'; setTimeout(function () { advance(true); }, 350); }
      // a two-meaning gloss or a gender bracket accepts any one of its parts
      var MEANING = { vocab: 1, idiom: 1, phrase: 1, capture: 1, verb: 1 };
      function mOpts() { return { meaning: !!MEANING[R.kind] }; }
      input.addEventListener('input', function () {
        if (locked || revealed) return;
        if (C.checkExact(input.value, R.back, mOpts()).pass) good();
      });
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return; e.preventDefault();
        if (locked) return;
        if (revealed) { advance(false); return; }
        var chk = C.checkExact(input.value, R.back, mOpts());
        if (chk.pass) { good(); return; }
        feedback.textContent = chk.near ? 'Nearly — check the accents' : 'Not quite — try again, or reveal';
        feedback.className = 'feedback bad';
      });
      revealB.addEventListener('click', function () {
        if (locked) return;
        if (revealed) { advance(false); return; }
        revealed = true; feedback.textContent = R.back; feedback.className = 'feedback reveal';
        revealB.textContent = 'Next →'; input.focus();
      });
      input.focus();
    }

    function finish() {
      ctx.results.review = { seen: seen, correct: correct };
      UI.clear(host);
      var wrap = UI.el('div', 'panel');
      wrap.appendChild(UI.el('h2', null, correct === seen
        ? UI.t('Todas.', 'All of them.')
        : UI.t('Repaso hecho', 'Still there')));
      wrap.appendChild(UI.el('p', null,
        UI.t('Te acordabas de <b>' + correct + '</b> de <b>' + seen + '</b>. Las que no vuelven mañana; el resto se alejan.',
             'You still had <b>' + correct + '</b> of <b>' + seen + '</b>. The ones you missed come back tomorrow; the rest move further out.')));
      wrap.appendChild(UI.nextBtn('Continuar →', done));
      host.appendChild(wrap);
    }

    show();
  }

  return { key: 'review', label: 'Repasar', icon: '🔁', run: run, pool: pool };
})();
