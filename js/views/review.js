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
      items.push({ id: 'v:' + w.es + ':meaning', es: (window.LexMatch ? window.LexMatch.shown(w.es) : w.es), en: w.en, kind: 'vocab',
                   cat: w.cat, theme: w.theme || null, rank: P.catRank(w.cat), idx: idx });
      /* From A2 a word is two cards: the meaning (recognition) and the form
       * (type the Spanish). The form card exists once the meaning has been
       * passed; it is never drawn as a new word. */
      if (P.current() !== 'A1') {
        items.push({ id: 'v:' + w.es + ':form', es: (window.LexMatch ? window.LexMatch.shown(w.es) : w.es), en: w.en, kind: 'vocab',
                     form: true, enrolledOnly: true });
      }
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
    /* The learner's own About me lines (js/buildit.js): front the English, or the prompt when it
     * was left blank; back their own Spanish, the only answer accepted. enrolledOnly: enrolled
     * when the line is written, never drawn as new. */
    if (window.BuildIt && window.BuildIt.cards) window.BuildIt.cards().forEach(function (c) {
      var en = c.en || c.prompt || c.front, es = c.es || c.back;
      if (es) items.push({ id: c.id, es: es, en: en, kind: 'aboutme', enrolledOnly: true });
    });
    /* Contrast items already served (js/contrasts.js): FSRS schedules each one by
     * its own id, so once enrolled it comes back here like any other card. */
    if (window.Contrasts && window.Contrasts.ready()) {
      window.CONTRAST_ITEMS.forEach(function (it) {
        var cid = 'x:' + it.id;
        if (S.isEnrolled(cid)) { var c = window.Contrasts.cardOf(it); c.enrolledOnly = true; items.push(c); }
      });
    }
    /* Sound-natural lines (js/natural.js) enrolled by the practice mode: typed English to Spanish. */
    (window.NATURAL || []).forEach(function (n) {
      if (S.isEnrolled('nat:' + n.id)) items.push({ id: 'nat:' + n.id, en: n.en, es: n.es, accept: n.accept || [], why: n.why || null,
        stiff: n.stiff || null, kind: 'natural', enrolledOnly: true });
    });
    if (ErrorLog) ErrorLog.cards().forEach(function (c) {               // {front, back, hint} — fixed
      items.push({ id: c.id, front: c.front, back: c.back, hint: c.hint || null, kind: 'error', fixed: true });
    });
    // "Stop asking me this" is permanent and applies everywhere a card can
    // surface, not only where it was retired.
    return window.Vetoed ? window.Vetoed.filter(items) : items;
  }

  // the sentence with its gap shown as ___
  function contrastFront(c) {
    var g = c.gap || [0, 0];
    return c.es.slice(0, g[0]) + '___' + c.es.slice(g[1]);
  }

  // Resolve a card to a concrete direction: { front, back, mode, toSpanish, hint }
  function resolve(card, pr) {
    // a question written as a choice is asked as a choice, with ITS options
    if (card.kind === 'contrast') {
      return { front: contrastFront(card), back: card.options[card.answer], mode: 'contrast', toSpanish: true,
               hint: card.why || null, options: card.options };
    }
    if (card.kind === 'natural') {
      return { front: card.en, back: card.es, mode: 'type', toSpanish: true, hint: null,
               extra: card.stiff ? 'You might say: ' + card.stiff : null };
    }
    if (card.fixed && card.probe && card.probe.kind === 'mcq' && (card.probe.options || []).length > 1) {
      return { front: card.front, back: card.back, mode: 'choice', toSpanish: true,
               options: card.probe.options,
               hint: card.probe.options.some(UI.isNothing) ? (card.hint ? card.hint + ' (' : '(') + '"(nothing)" means ' + UI.NOTHING_NOTE + (card.hint ? ')' : ')') : (card.hint || null) };
    }
    if (card.fixed) return { front: card.front, back: card.back, mode: 'type', toSpanish: true, hint: card.hint || null };
    var d = pr.reviewDirection;
    if (card.form) d = 'en2es';
    // from B1 typed recall is the default: the meaning card is "type the English" (graded with the
    // meaning alternatives), and the form card types the Spanish. A1 and A2 keep their own direction.
    else if (card.kind === 'vocab' && /^B[12]$|^C/.test(P.current())) d = 'es2en-type';
    if (d === 'graduated') d = (S.boxOf(card.id) <= 1) ? 'es2en' : 'en2es';
    if (d === 'es2en-type') return { front: card.es, back: card.en, mode: 'type', toSpanish: false, hint: card.hint || null };
    if (d === 'es2en') return { front: card.es, back: card.en, mode: 'choice', toSpanish: false, hint: card.hint || null };
    return { front: card.en, back: card.es, mode: 'type', toSpanish: true,
      hint: card.kind === 'idiom' && card.lit ? 'lit: ' + card.lit : (card.hint || null) };
  }

  // what Repasar may ask: cards the learner has already met
  function reviewable(items) {
    return items.filter(function (it) {
      if (it.enrolledOnly) return S.isEnrolled(it.id);
      if (it.kind === 'vocab' || it.kind === 'idiom') return S.isEnrolled(it.id);
      return true;
    });
  }
  // the Settings number is a ceiling on due cards, and only when the learner set one
  function manualCap() {
    try { var o = JSON.parse(localStorage.getItem('fluidez.caps')) || {}; var v = o[P.current()]; return v > 0 ? v : 0; }
    catch (e) { return 0; }
  }
  /* Today's budget: how many due cards to serve and how many new to teach,
   * from the learner's own seconds per card (see SRS.plan). Cached on ctx and,
   * per day, in the SRS meta, so Repasar and Aprender agree. */
  function planFor(ctx) {
    if (ctx && ctx._plan) return ctx._plan;
    var pl = S.plan(reviewable(pool()), { manualCap: manualCap() });
    if (ctx) ctx._plan = pl;
    return pl;
  }

  /* The day's NEW vocabulary and idioms, for the Learn stage to teach.
   *
   * This is the draw that used to sit inside run() below: same count
   * (`newPerDay`), same passage preference, same shuffle. The shuffle takes
   * ctx.rng, which session.js seeds from the lesson id the first time a lesson
   * is seen, so that first-time draw is reproducible. Nothing is enrolled
   * here; Learn enrols each card, due tomorrow, when it is taught. Computed
   * once per session and cached on ctx, so the stage can be re-entered. */
  function newToday(ctx) {
    if (ctx && ctx._newToday) return ctx._newToday;
    var pr = P.params();
    var out = [];
    var count = planFor(ctx).newCount;
    /* A quick review teaches nothing new, but never two sessions in a row
     * without any new word: the third gets the floor. */
    if (ctx && ctx.mode === 'rapido' && S.zeroStreak() < 2) count = 0;
    if (count > 0) {
      var skip = {};
      if (ctx && ctx.focus && ctx.focus.type === 'vocab') (ctx.focus.words || []).forEach(function (w) { skip['v:' + w + ':meaning'] = 1; });
      var cands = pool().filter(function (it) {
        return (it.kind === 'vocab' || it.kind === 'idiom') && !it.form && !S.isEnrolled(it.id) && !skip[it.id];
      });
      if (pr.orderedVocab) {
        cands.sort(function (a, b) { return (a.rank == null ? 500 : a.rank) - (b.rank == null ? 500 : b.rank) || (a.idx || 0) - (b.idx || 0); });
      }
      var fTheme = window.Focus ? window.Focus.theme() : null;
      var px = (ctx && ctx.passage && ctx.passage.text && window.LexMatch)
        ? window.LexMatch.index(ctx.passage.text) : null;
      var prefer = (px || fTheme) ? function (it) {
        return (px && it.es && px.has(it.es) ? 2 : 0) + (fTheme && it.theme === fTheme ? 1 : 0);
      } : null;
      out = S.batch(cands, 0, count, !pr.orderedVocab, prefer, ctx && ctx.rng);
    }
    S.noteNew(out.length);
    if (ctx) ctx._newToday = out;
    return out;
  }

  /* ---- contrast cards: weekly-ish slots, not daily ----
   * fluidez.progress.contrast = {n: review sessions begun, last: the n of the last
   * session that carried contrast cards}. A slot opens when two sessions have
   * passed since the last one, so at most one session in two. */
  var BAND_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
  function progGet() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }
  function contrastSlot(commit) {
    var pg = progGet(), c = pg.contrast || { n: 0, last: -9 };
    var n = (c.n || 0) + 1, open = n - (c.last == null ? -9 : c.last) >= 2;
    if (commit) {
      pg.contrast = { n: n, last: open ? n : c.last };
      try { localStorage.setItem('fluidez.progress', JSON.stringify(pg)); } catch (e) {}
    }
    return open;
  }
  function wantsContrasts() { return (BAND_ORDER[P.current()] || 0) >= 1; }
  /* js/contrasts.js and its data are injected on demand (not in index.html). */
  function ensureContrasts(need, cb) {
    if (!need || typeof document === 'undefined' || (window.Contrasts && window.Contrasts.ready())) { cb(); return; }
    var go = function () { if (window.Contrasts) window.Contrasts.load(function () { cb(); }); else cb(); };
    if (window.Contrasts) { go(); return; }
    var s = document.createElement('script');
    s.src = 'js/contrasts.js'; s.onload = go; s.onerror = function () { cb(); };
    document.head.appendChild(s);
  }

  function run(host, ctx, done) {
    var rx = (ctx && ctx.step && ctx.step.extra) || {};
    var need = wantsContrasts() || (Array.isArray(rx.queue) && rx.queue.some(function (id) { return /^x:x:/.test(id); }));
    ensureContrasts(need, function () { runDeck(host, ctx, done); });
  }

  function runDeck(host, ctx, done) {
    var pr = P.params();
    /* Teach before test. A vocabulary or idiom card that has never been shown
     * is NOT drawn here: the Learn stage teaches it (see newToday, below) and
     * it joins this deck the next day. Only cards the learner has already met
     * can be asked, so nothing here is ever "new". */
    if (P.current() !== 'A1') {                       // words passed before the production card existed
      var made = 0;
      (window.VOCAB || []).forEach(function (w) {
        if (made >= 5) return;
        var m = 'v:' + w.es + ':meaning', f = S.formId(m);
        if (S.passed(m) && !S.isEnrolled(f)) { S.enrol(f, 1); made++; }
      });
    }
    var all = reviewable(pool());
    if (pr.orderedVocab) {
      all.sort(function (a, b) { return (a.rank == null ? 500 : a.rank) - (b.rank == null ? 500 : b.rank) || (a.idx || 0) - (b.idx || 0); });
    }
    /* A "4 min" quick review has to actually be four minutes, so it takes the
     * most-overdue slice rather than the whole daily cap. SRS.batch reschedules
     * whatever it leaves behind, so nothing is lost — it comes round again. */
    var plan = planFor(ctx);
    var cap = plan.dueCap;
    var fresh = plan.newCount;
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
    /* A resume starts from the saved deck, not a fresh draw: the draw is
     * random, so drawing again would hand back different cards. The step's
     * extra holds the ordered ids still to ask, plus the running tallies. */
    var ex = (ctx && ctx.step && ctx.step.extra) || {};
    var resumed = Array.isArray(ex.queue);
    var batch;
    if (resumed) {
      var byId = {};
      all.forEach(function (it) { byId[it.id] = it; });
      batch = ex.queue.map(function (id) { return byId[id]; }).filter(Boolean);
    } else {
      batch = S.batch(all, cap, fresh, !pr.orderedVocab, prefer);
      batch.forEach(function (it) { S.enrol(it.id); });
      /* Contrast cards: from A2, when the plan has room and the weekly-ish slot is
       * open, up to 3 items from contrasts whose every side is known. Never in a
       * quick review. */
      if (wantsContrasts() && !(ctx && ctx.mode === 'rapido') && window.Contrasts && window.Contrasts.ready() && window.Known) {
        var room = Math.min(3, cap - batch.length);
        if (contrastSlot(true) && room > 0) {
          var pg = progGet(), dI = ctx && ctx.dayIndex != null ? ctx.dayIndex : -1;
          var known = window.Known.forLearner(pg, dI);
          var have = {}; batch.forEach(function (it) { have[it.id] = 1; });
          var cc = window.Contrasts.cardsFor(known, room, null, { dayIndex: dI, isEnrolled: S.isEnrolled })
            .filter(function (c) { return !have[c.id]; });
          cc.forEach(function (c) { S.enrol(c.id); c.enrolledOnly = true; all.push(c); });
          window.Contrasts.markSeen(cc);
          batch = batch.concat(cc);
        }
      }
    }

    // recognition distractors: other English glosses of the same kind
    var enByKind = {};
    all.forEach(function (it) { if (it.en && !it.form) (enByKind[it.kind] = enByKind[it.kind] || []).push(it.en); });

    var queue = batch.slice(), seen = resumed ? (ex.seen || 0) : 0,
        correct = resumed ? (ex.correct || 0) : 0, missed = resumed ? (ex.missed || {}) : {};

    function saveStep() {
      if (ctx && ctx.step && ctx.step.save) {
        ctx.step.save(seen, { queue: queue.map(function (c) { return c.id; }),
                              seen: seen, correct: correct, missed: missed });
      }
    }

    if (!queue.length && resumed && seen) { finish(); return; }
    if (!queue.length) {
      var empty = UI.el('div', 'panel');
      var firstDay = S.enrolledCount() === 0;
      empty.appendChild(UI.el('h2', null, firstDay ? UI.t('Nada que repasar todavía', 'Nothing to review yet')
                                                   : UI.t('Nada que repasar hoy', 'Nothing to check today')));
      empty.appendChild(UI.el('p', 'muted', firstDay
        ? 'Nothing to review yet. New words come back tomorrow.'
        : (ctx && ctx.mode === 'rapido'
          ? 'Your review queue is clear. New items are added as you learn.'
          : 'Your review queue is clear. New items are added as you learn. On to today\'s lesson.')));
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
    saveStep();

    /* Timing, for the grade and for the budget. `shownAt` is when the card
     * appeared; `answeredAt` is the moment the learner committed to an answer
     * (set once). A hint is only counted when the learner asked for one. */
    var shownAt = 0, answeredAt = 0, hinted = false;
    function stamp() { if (!answeredAt) answeredAt = Date.now(); }

    /* Learning step inside the session: a card missed for the first time is
     * not graded yet. It is logged, pushed back at least three cards, and
     * asked once more; the one FSRS review it gets today is graded when that
     * second ask is answered. A second miss does not requeue it again.
     * missed[id] is 1 for a wrong answer and 2 for "I don't know". */
    function advance(good, opts) {
      opts = opts || {};
      stamp();
      var meta = { usedHint: hinted, latencyMs: Math.max(0, answeredAt - shownAt),
                   cardMs: Math.max(0, Date.now() - shownAt), unsure: !!opts.unsure };
      var id = cur.id, prior = missed[id];
      queue.shift(); seen++;
      if (good) {
        correct++;
        if (prior) { meta.unsure = prior === 2; S.grade(id, false, meta); }
        else S.grade(id, true, meta);
      } else if (!prior) {
        if (!opts.unsure && ErrorLog && cur.kind !== 'error') {
          ErrorLog.record({ id: id, front: R.front, back: R.back, kind: cur.kind, source: 'review', hint: R.hint, topic: topicOf(cur), reviewable: false, es: cur.es || null, en: cur.en || null });
        }
        missed[id] = opts.unsure ? 2 : 1;
        queue.splice(Math.min(3, queue.length), 0, cur);
      } else {
        meta.unsure = prior === 2;
        S.grade(id, false, meta);
      }
      saveStep();
      show();
    }

    function show() {
      if (!queue.length) { finish(); return; }
      cur = queue[0]; R = resolve(cur, pr);
      shownAt = Date.now(); answeredAt = 0; hinted = false;
      kind.textContent = cur.kind; kind.dataset.kind = cur.kind;
      front.textContent = R.front;
      feedback.textContent = ''; feedback.className = 'feedback';
      stats.textContent = seen + ' done · ' + queue.length + ' to go';
      UI.clear(body);
      // an authored choice always has its options; a vocab card needs three
      // plausible distractors scavenged from the same kind before it can offer one
      if (R.mode === 'contrast') { showContrast(); return; }
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
        var b = UI.el('button', 'mcq-btn', UI.optLabel(opt)); b.type = 'button'; b.dataset.opt = opt;
        b.addEventListener('click', function () {
          if (answered) return; answered = true; stamp();
          var right = opt === R.back;
          b.classList.add(right ? 'right' : 'wrong');
          if (!right) Array.prototype.forEach.call(grid.children, function (c) { if (c.dataset.opt === R.back) c.classList.add('right'); });
          feedback.textContent = right ? '¡Correcto!' : R.front + ' → ' + UI.optLabel(R.back);
          if (UI.isNothing(R.back)) feedback.textContent += ' (' + UI.NOTHING_NOTE + ')';
          feedback.className = 'feedback ' + (right ? 'good' : 'bad');
          setTimeout(function () { advance(right); }, right ? 450 : 1200);
        });
        grid.appendChild(b);
      });
      body.appendChild(grid);
    }

    // ---- a contrast item: the sentence with a gap, the forms as buttons, English under it ----
    function showContrast() {
      kind.textContent = UI.t('contraste', 'contrast');
      body.appendChild(UI.el('div', 'muted', cur.en));
      var answered = false, grid = UI.el('div', 'mcq-opts');
      E.shuffle(R.options.slice()).forEach(function (opt) {
        var b = UI.el('button', 'mcq-btn', UI.optLabel(opt)); b.type = 'button'; b.dataset.opt = opt;
        b.addEventListener('click', function () {
          if (answered) return; answered = true; stamp();
          var right = opt === R.back;
          b.classList.add(right ? 'right' : 'wrong');
          if (!right) Array.prototype.forEach.call(grid.children, function (c) { if (c.dataset.opt === R.back) c.classList.add('right'); });
          feedback.textContent = (right ? '¡Correcto! ' : UI.optLabel(R.back) + '. ') + (cur.why || '');
          feedback.className = 'feedback ' + (right ? 'good' : 'bad');
          setTimeout(function () { advance(right); }, right ? 1400 : 2600);
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
      if (R.extra) body.appendChild(UI.el('div', 'muted', R.extra));
      body.appendChild(input);
      if (R.toSpanish) body.appendChild(UI.accentBar(function () { return input; }));
      body.appendChild(hintEl);
      var hintB = UI.el('button', 'ghost-btn', UI.t('Pista', 'Hint')); hintB.type = 'button';
      var dontB = UI.el('button', 'ghost-btn', UI.t('No lo sé', 'I don\'t know')); dontB.type = 'button';
      var controls = UI.el('div', 'row-controls'); controls.appendChild(hintB); controls.appendChild(dontB); controls.appendChild(revealB);
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
          saveStep();
          feedback.textContent = UI.t('Retirada.', 'Retired.');
          feedback.className = 'feedback';
          setTimeout(show, 260);
        });
        controls.appendChild(vetoB);
      }
      body.appendChild(controls);
      var locked = false, revealed = false;
      function good() { if (locked) return; locked = true; stamp(); feedback.textContent = '¡Correcto! ' + R.back; feedback.className = 'feedback good'; setTimeout(function () { advance(true); }, 350); }
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
        /* A lesson answer written out for a reader rather than for a text
         * box. "quizá(s)" demanded the brackets back and "encantado /
         * encantada" demanded the slash, so both could only be failed or
         * revealed. C.answerForms derives the forms a person would actually
         * type, from that card's OWN answer and nothing else — see the
         * comment there for why each rule is as narrow as it is. */
        if (cur.kind === 'aboutme' && R.toSpanish) o.accents = 'lenient';
        if (cur.kind === 'lesson' && C.answerForms) o.also = C.answerForms(R.back);
        return o;
      }
      /* A sound-natural card: the stiff line is a miss with its own hint, then the matcher with the
       * accepted variants, then the register hint on a miss. */
      function natCheck(text) {
        var N = window.Natural, M = window.LIB && window.LIB.match;
        if (N && N.isStiff(cur, text)) return { pass: false, hint: 'That is the stiff line.' };
        var r = M ? M.matchTranslation(text, { es: cur.es, en: cur.en, accept: cur.accept || [] }, { accents: 'lenient' }) : { pass: false };
        if (r.pass) return { pass: true };
        return { pass: false, hint: (N && N.registerMiss(cur, text)) || r.hint || null };
      }
      function setRich(node, lead, text) {
        node.textContent = lead;
        String(text || '').split(/\*([^*]+)\*/).forEach(function (part, i) {
          if (!part) return;
          if (i % 2) node.appendChild(UI.el('em', null, part)); else node.appendChild(document.createTextNode(part));
        });
      }
      input.addEventListener('input', function () {
        if (locked || revealed || cur.kind === 'natural') return;
        if (C.checkExact(input.value, R.back, mOpts()).pass) good();
      });
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return; e.preventDefault();
        if (locked) return;
        if (revealed) { advance(false, { unsure: unsure }); return; }
        if (cur.kind === 'natural') {
          var nc = natCheck(input.value);
          if (nc.pass) { good(); return; }
          feedback.textContent = 'Not quite.' + (nc.hint ? ' ' + nc.hint : '') + ' Try again, or reveal';
          feedback.className = 'feedback bad';
          return;
        }
        var chk = C.checkExact(input.value, R.back, mOpts());
        if (chk.pass) { good(); return; }
        feedback.textContent = chk.near ? 'Nearly. Check the accents' : 'Not quite. Try again, or reveal';
        feedback.className = 'feedback bad';
      });
      var unsure = false;
      function showAnswer(isUnsure) {
        stamp(); revealed = true; unsure = !!isUnsure; hinted = true;
        if (cur.kind === 'natural') setRich(feedback, R.back + (cur.why ? ' · ' : ''), cur.why); else feedback.textContent = R.back;
        feedback.className = 'feedback reveal';
        revealB.textContent = 'Next →'; hintB.disabled = true; dontB.disabled = true; input.focus();
      }
      revealB.addEventListener('click', function () {
        if (locked) return;
        if (revealed) { advance(false, { unsure: unsure }); return; }
        showAnswer(false);
      });
      // no penalty: the answer is shown, the card is asked again and counts as not yet known
      dontB.addEventListener('click', function () {
        if (locked || revealed) return;
        showAnswer(true);
      });
      // the first letters of the answer; right after this the grade is Hard at best
      hintB.addEventListener('click', function () {
        if (locked || revealed) return;
        hinted = true;
        var a = String(R.back), n = Math.min(2, Math.max(1, Math.floor(a.length / 3)));
        hintEl.textContent = (R.hint ? R.hint + ' · ' : '') + a.slice(0, n) + a.slice(n).replace(/[^\s]/g, '_');
        hintB.disabled = true; input.focus();
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

  return { key: 'review', label: 'Repasar', icon: '🔁', run: run, pool: pool, newToday: newToday };
})();
