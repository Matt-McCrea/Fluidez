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
    /* CONTRAST cards, scheduled per contrast (`ac:ser-estar`), the same way
     * the verb+tense pairs above are scheduled per pair — a different real
     * sentence is drawn each time, the id and so the schedule is stable.
     *
     * Without this the schedule was write-only: js/views/apply.js has been
     * grading `ac:<focus>` on every choice item and nothing anywhere read the
     * id back, so a learner's record on ser/estar accumulated and was never
     * used to ask them again. The drill happened once, on the day its lesson
     * came round, and the contrast never returned.
     *
     * Asked as a CHOICE, not typed: the item is two real candidates and the
     * sentence decides between them, so `probe` carries the options and
     * resolve() renders it as the multiple choice it was written as. Typing
     * "está" into a blank box would be a different, easier question.
     *
     * Gated by level rather than by taught tense, because a choice item need
     * not contain a verb at all. */
    var gate = (P.params() || {}).maxGate || 99;
    var seenFocus = {};
    (window.APPLY_ITEMS || []).forEach(function (it) {
      if (it.type !== 'choice' || !it.focus) return;
      if ((it.level || 1) > gate) return;
      if (seenFocus[it.focus]) return; seenFocus[it.focus] = 1;
      var group = (window.APPLY_ITEMS || []).filter(function (x) {
        return x.type === 'choice' && x.focus === it.focus && (x.level || 1) <= gate;
      });
      var pick = group[Math.floor(Math.random() * group.length)];
      items.push({
        id: 'ac:' + it.focus,
        front: pick.text.replace('___', '＿＿＿'), back: pick.options[pick.answer],
        kind: 'grammar', fixed: true, enrolledOnly: true, hint: pick.why || null,
        probe: { kind: 'mcq', options: pick.options, answer: pick.answer }
      });
    });
    /* The Spanish every lesson is built out of — its keyword table and its
     * exponents (js/phrases.js). enrolledOnly, so they are not 4,681 cards
     * dumped into the deck on day one; a phrase arrives here once something
     * has enrolled it, which is now js/views/learn.js on the day its lesson
     * runs (and still a game round, for anything met that way first).
     *
     * Until that enrolment existed this pool was effectively empty for anyone
     * who did not play the games, which is what CURRICULUM_AUDIT.md §1.1 found:
     * the review loop carried the grammar point and never the language. */
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
    /* WHICH new words today teaches.
     *
     * Two preferences, and the first is the one that matters. The words are
     * drawn from the passage this same session will put in front of the
     * learner two stages later (Repasar is stage 1, Comprender is stage 3),
     * so a word met as a flashcard at 9:01 is met again in a sentence at
     * 9:06. Before this they were independent draws: measured over a themed
     * week, 7 of 336 words taught appeared in the reading that taught-day —
     * 2%. The passages were never short of material, they were simply never
     * consulted. The average passage already carries 27.6 words from the
     * taught corpus, 37 at B2.
     *
     * Second, and weaker: a running theme focus (js/focus.js).
     *
     * Scored rather than filtered, so the tiers degrade instead of starving.
     * Most of a passage's 27.6 words are ones the learner already knows —
     * they are TAUGHT words, not fresh ones — so on any given day only a few
     * may be both in the text and still new. Everything below simply falls
     * through to the ordinary pool. */
    var fTheme = window.Focus ? window.Focus.theme() : null;
    var px = (ctx && ctx.passage && ctx.passage.text && window.LexMatch)
      ? window.LexMatch.index(ctx.passage.text) : null;
    var prefer = (px || fTheme) ? function (it) {
      return (px && it.es && px.has(it.es) ? 2 : 0) + (fTheme && it.theme === fTheme ? 1 : 0);
    } : null;
    var batch = S.batch(all, cap, fresh, !pr.orderedVocab, prefer);
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
      /* A two-meaning gloss or a gender bracket accepts any one of its parts.
       *
       * Read off `cur`, the pool card, NOT off `R`: resolve() returns only
       * {front, back, mode, toSpanish, hint}, so `R.kind` was always undefined
       * and this whole table silently evaluated to false — the review stage
       * has never once applied meaning-alternatives, while js/deck.js (which
       * reads cur.kind) always has. Same bug would have swallowed the phrase
       * leniency below. */
      var MEANING = { vocab: 1, idiom: 1, phrase: 1, capture: 1, verb: 1 };
      /* A phrase card is graded generously on purpose: any Spanish the course
       * glosses the same way passes, and an accent slip passes with the
       * accented form shown back. See js/checker.js checkExact. */
      function mOpts() {
        var o = { meaning: !!MEANING[cur.kind] };
        if (cur.kind === 'phrase' && R.toSpanish && window.Phrases) {
          // ...except where the accent is the only thing separating two words
          if (!window.Phrases.accentCritical(R.back)) o.accents = 'lenient';
          o.also = window.Phrases.alternatives(R.front);
        }
        return o;
      }
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
