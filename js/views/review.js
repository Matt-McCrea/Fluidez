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
  var UI = window.UI, E = window.ENGINE, S = window.SRS, C = window.Checker;
  var Capture = window.Capture, ErrorLog = window.ErrorLog, P = window.Profile;

  // Language-neutral pool: pair cards carry {es,en}; grammar/error are fixed.
  function pool() {
    var items = [];
    (window.VOCAB || []).forEach(function (w, idx) {
      if (!P.catAllowed(w.cat)) return;
      items.push({ id: 'v:' + w.es, es: w.es, en: w.en, kind: 'vocab', cat: w.cat, rank: P.catRank(w.cat), idx: idx });
    });
    (window.IDIOMS || []).forEach(function (x) {
      items.push({ id: 'i:' + x.es, es: x.es, en: x.en, lit: x.lit || null, kind: 'idiom' });
    });
    (window.GRAMMAR_LESSONS || []).forEach(function (l) {
      (l.recall || []).forEach(function (r) {
        items.push({ id: r.id, front: r.front, back: r.back, kind: 'grammar', fixed: true, enrolledOnly: true });
      });
    });
    (window.VERBS || []).forEach(function (v) {
      items.push({ id: 'vm:' + v.inf, es: v.inf, en: v.en, kind: 'verb', enrolledOnly: true });
    });
    if (Capture) Capture.cards().forEach(function (c) {                 // {front:en, back:es, hint}
      items.push({ id: c.id, es: c.back, en: c.front, hint: c.hint || null, kind: 'capture' });
    });
    if (ErrorLog) ErrorLog.cards().forEach(function (c) {               // {front, back, hint} — fixed
      items.push({ id: c.id, front: c.front, back: c.back, hint: c.hint || null, kind: 'error', fixed: true });
    });
    return items;
  }

  // Resolve a card to a concrete direction: { front, back, mode, toSpanish, hint }
  function resolve(card, pr) {
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
    var batch = S.batch(all, pr.reviewBatchMax, pr.newPerDay, !pr.orderedVocab);
    batch.forEach(function (it) { S.enrol(it.id); });

    // recognition distractors: other English glosses of the same kind
    var enByKind = {};
    all.forEach(function (it) { if (it.en) (enByKind[it.kind] = enByKind[it.kind] || []).push(it.en); });

    var queue = batch.slice(), seen = 0, correct = 0, missed = {};

    if (!queue.length) {
      var empty = UI.el('div', 'panel');
      empty.appendChild(UI.el('h2', null, 'Nothing due today'));
      empty.appendChild(UI.el('p', 'muted', 'Your review queue is clear — new items are added as you learn. On to today\'s lesson.'));
      empty.appendChild(UI.nextBtn('Continuar →', function () { ctx.results.review = { seen: 0, correct: 0 }; done(); }));
      host.appendChild(empty); return;
    }

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
          ErrorLog.record({ id: cur.id, front: R.front, back: R.back, kind: cur.kind, source: 'review', hint: R.hint, reviewable: false });
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
      var canChoose = R.mode === 'choice' && (enByKind[cur.kind] || []).filter(function (b) { return b !== R.back; }).length >= 3;
      if (canChoose) showChoice(); else showType();
    }

    // ---- multiple-choice (recognition) ----
    function showChoice() {
      var others = E.shuffle((enByKind[cur.kind] || []).filter(function (b) { return b !== R.back; }));
      var opts = E.shuffle([R.back].concat(others.slice(0, 3)));
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
      var controls = UI.el('div', 'row-controls'); controls.appendChild(revealB); body.appendChild(controls);
      var locked = false, revealed = false;
      function good() { if (locked) return; locked = true; feedback.textContent = '¡Correcto! ' + R.back; feedback.className = 'feedback good'; setTimeout(function () { advance(true); }, 350); }
      input.addEventListener('input', function () { if (!locked && !revealed && E.normalize(input.value) === E.normalize(R.back)) good(); });
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return; e.preventDefault();
        if (locked) return;
        if (revealed) { advance(false); return; }
        var chk = C.checkExact(input.value, R.back);
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
      wrap.appendChild(UI.el('h2', null, 'Repaso terminado'));
      wrap.appendChild(UI.el('p', null, 'You got <b>' + correct + '</b> of <b>' + seen + '</b>. Misses come back tomorrow; the rest move further out.'));
      wrap.appendChild(UI.nextBtn('Continuar →', done));
      host.appendChild(wrap);
    }

    show();
  }

  return { key: 'review', label: 'Repasar', icon: '🔁', run: run };
})();
