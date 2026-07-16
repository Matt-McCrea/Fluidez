/* ============================================================================
 * STAGE 1 — REPASAR (Review).
 * Spaced repetition over everything enrolled: vocab, idioms, grammar recall,
 * captured words and logged errors. Due items first (protecting prior
 * learning); new items introduced each day so the pool grows.
 *
 * The PROFILE tunes this stage:
 *   direction  — es2en (recognition, for beginners) or en2es (production)
 *   mode       — 'choice' (multiple choice) or 'type'
 *   newPerDay / batchMax — pacing
 *   orderedVocab / vocabCats — beginners meet everyday words easiest-first
 * Grammar/error/capture cards always use typing (no clean distractors).
 * ========================================================================== */
window.StageReview = (function () {
  var UI = window.UI, E = window.ENGINE, S = window.SRS, C = window.Checker;
  var Capture = window.Capture, ErrorLog = window.ErrorLog, P = window.Profile;

  // Build the candidate pool, honouring the profile's direction + vocab gating.
  function pool() {
    var pr = P.params();
    var recog = pr.reviewDirection === 'es2en';
    var items = [];
    (window.VOCAB || []).forEach(function (w, idx) {
      if (!P.catAllowed(w.cat)) return;                       // gate advanced cats for beginners
      items.push(recog
        ? { id: 'v:' + w.es, front: w.es, back: w.en, kind: 'vocab', cat: w.cat, rank: P.catRank(w.cat), idx: idx }
        : { id: 'v:' + w.es, front: w.en, back: w.es, kind: 'vocab', cat: w.cat, rank: P.catRank(w.cat), idx: idx });
    });
    (window.IDIOMS || []).forEach(function (x) {
      items.push(recog
        ? { id: 'i:' + x.es, front: x.es, back: x.en, kind: 'idiom' }
        : { id: 'i:' + x.es, front: x.en, back: x.es, kind: 'idiom', hint: x.lit ? 'lit: ' + x.lit : null });
    });
    (window.GRAMMAR_LESSONS || []).forEach(function (l) {
      (l.recall || []).forEach(function (r) {
        items.push({ id: r.id, front: r.front, back: r.back, kind: 'grammar', enrolledOnly: true });
      });
    });
    if (Capture) Capture.cards().forEach(function (c) {
      items.push(recog ? { id: c.id, front: c.back, back: c.front, kind: 'capture' } : c);
    });
    if (ErrorLog) ErrorLog.cards().forEach(function (c) { items.push(c); });
    return items;
  }

  function run(host, ctx, done) {
    var pr = P.params();
    var all = pool().filter(function (it) { return !it.enrolledOnly || S.isEnrolled(it.id); });
    if (pr.orderedVocab) {                                    // easiest categories first, then file order
      all.sort(function (a, b) { return (a.rank == null ? 500 : a.rank) - (b.rank == null ? 500 : b.rank) || (a.idx || 0) - (b.idx || 0); });
    }
    var batch = S.batch(all, pr.reviewBatchMax, pr.newPerDay, !pr.orderedVocab);
    batch.forEach(function (it) { S.enrol(it.id); });

    // distractor pool for choice mode: other "back" values of the same kind
    var backsByKind = {};
    all.forEach(function (it) { (backsByKind[it.kind] = backsByKind[it.kind] || []).push(it.back); });

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
    var body = UI.el('div');                    // holds input+accent OR choices
    var feedback = UI.el('div', 'feedback');
    card.appendChild(stats); card.appendChild(kind); card.appendChild(front);
    card.appendChild(body); card.appendChild(feedback);
    host.appendChild(card);

    var cur = null;

    function useChoice() {
      return pr.reviewMode === 'choice' && (backsByKind[cur.kind] || []).filter(function (b) { return b !== cur.back; }).length >= 3;
    }

    function advance(good) {
      queue.shift(); seen++;
      if (good) { correct++; S.grade(cur.id, !missed[cur.id]); }
      else {
        S.grade(cur.id, false);
        if (!missed[cur.id] && ErrorLog && cur.kind !== 'error') {
          ErrorLog.record({ id: cur.id, front: cur.front, back: cur.back, kind: cur.kind, source: 'review', hint: cur.hint, reviewable: false });
        }
        missed[cur.id] = 1; queue.push(cur);
      }
      show();
    }

    function show() {
      if (!queue.length) { finish(); return; }
      cur = queue[0];
      kind.textContent = cur.kind; kind.dataset.kind = cur.kind;
      front.textContent = cur.front;
      feedback.textContent = ''; feedback.className = 'feedback';
      stats.textContent = seen + ' done · ' + queue.length + ' to go';
      UI.clear(body);
      if (useChoice()) showChoice(); else showType();
    }

    // ---- multiple-choice (recognition) ----
    function showChoice() {
      var others = (backsByKind[cur.kind] || []).filter(function (b) { return b !== cur.back; });
      E.shuffle(others);
      var opts = E.shuffle([cur.back].concat(others.slice(0, 3)));
      var answered = false;
      var grid = UI.el('div', 'mcq-opts');
      opts.forEach(function (opt) {
        var b = UI.el('button', 'mcq-btn', opt); b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          var right = opt === cur.back;
          b.classList.add(right ? 'right' : 'wrong');
          if (!right) Array.prototype.forEach.call(grid.children, function (c) { if (c.textContent === cur.back) c.classList.add('right'); });
          feedback.textContent = right ? '¡Correcto!' : cur.front + ' → ' + cur.back;
          feedback.className = 'feedback ' + (right ? 'good' : 'bad');
          setTimeout(function () { advance(right); }, right ? 450 : 1200);
        });
        grid.appendChild(b);
      });
      body.appendChild(grid);
    }

    // ---- typed answer (production) ----
    function showType() {
      var input = UI.el('input', 'answer-input'); input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
      input.placeholder = pr.reviewDirection === 'es2en' ? 'type in English…' : 'escribe en español…';
      var revealB = UI.el('button', 'ghost-btn', 'Reveal'); revealB.type = 'button';
      var hintEl = UI.el('div', 'muted hint', cur.hint || '');
      body.appendChild(input);
      if (pr.reviewDirection !== 'es2en') body.appendChild(UI.accentBar(function () { return input; }));
      body.appendChild(hintEl);
      var controls = UI.el('div', 'row-controls'); controls.appendChild(revealB); body.appendChild(controls);
      var locked = false, revealed = false;
      function good() { if (locked) return; locked = true; feedback.textContent = '¡Correcto! ' + cur.back; feedback.className = 'feedback good'; setTimeout(function () { advance(true); }, 350); }
      input.addEventListener('input', function () { if (!locked && !revealed && E.normalize(input.value) === E.normalize(cur.back)) good(); });
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return; e.preventDefault();
        if (locked) return;
        if (revealed) { advance(false); return; }
        if (C.checkExact(input.value, cur.back).pass) { good(); return; }
        feedback.textContent = C.checkExact(input.value, cur.back).near ? 'Nearly — check the accents' : 'Not quite — try again, or reveal';
        feedback.className = 'feedback bad';
      });
      revealB.addEventListener('click', function () {
        if (locked) return;
        if (revealed) { advance(false); return; }
        revealed = true; feedback.textContent = cur.back; feedback.className = 'feedback reveal';
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
