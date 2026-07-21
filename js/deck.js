/* ============================================================================
 * DECK — a reusable type-to-answer review runner over a list of cards
 *   { id, front, back, kind, hint }.
 * Shared by the Errors view (and available to any on-demand drill). Grades the
 * SRS on each answer; a miss re-queues at the end. Calls onDone(stats) when the
 * queue is exhausted. (The daily Review stage keeps its own copy for its extra
 * session bookkeeping.)
 *
 * opts (optional):
 *   logErrors — record the first miss of each card into the error log (so it
 *               resurfaces in Puntos débiles), the way the daily Review stage
 *               does. Ported drills / on-demand rounds pass this; the plain
 *               errors-deck (already made of error cards) does not.
 * ========================================================================== */
window.Deck = (function () {
  var UI = window.UI, E = window.ENGINE, S = window.SRS, C = window.Checker;

  function run(host, cards, onDone, opts) {
    opts = opts || {};
    var queue = E.shuffle(cards.slice());
    var seen = 0, correct = 0, missed = {};
    if (!queue.length) { onDone({ seen: 0, correct: 0 }); return; }

    var card = UI.el('div', 'panel review-card');
    var stats = UI.el('div', 'muted review-stats');
    var kind = UI.el('span', 'kind-badge');
    var front = UI.el('div', 'card-front');
    var input = UI.el('input', 'answer-input'); input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
    input.placeholder = 'escribe en español…';
    var hintEl = UI.el('div', 'muted hint');
    var feedback = UI.el('div', 'feedback');
    var revealB = UI.el('button', 'ghost-btn', 'Reveal'); revealB.type = 'button';
    card.appendChild(stats); card.appendChild(kind); card.appendChild(front);
    card.appendChild(input); card.appendChild(UI.accentBar(function () { return input; }));
    card.appendChild(hintEl); card.appendChild(feedback);
    var controls = UI.el('div', 'row-controls'); controls.appendChild(revealB);
    card.appendChild(controls);
    host.appendChild(card);

    var cur = null, locked = false, revealed = false;
    function show() {
      if (!queue.length) { onDone({ seen: seen, correct: correct }); return; }
      cur = queue[0]; locked = false; revealed = false;
      kind.textContent = cur.kind; kind.dataset.kind = cur.kind;
      front.textContent = cur.front; hintEl.textContent = cur.hint || '';
      input.value = ''; feedback.textContent = ''; feedback.className = 'feedback';
      revealB.textContent = 'Reveal';
      stats.textContent = seen + ' done · ' + queue.length + ' to go';
      input.focus();
    }
    function advance(good) {
      queue.shift(); seen++;
      if (good) { correct++; S.grade(cur.id, !missed[cur.id]); }
      else {
        S.grade(cur.id, false);
        if (opts.logErrors && !missed[cur.id] && window.ErrorLog && cur.kind !== 'error') {
          window.ErrorLog.record({ id: cur.id, front: cur.front, back: cur.back, kind: cur.kind, source: 'drill', hint: cur.hint, reviewable: false });
        }
        missed[cur.id] = 1; queue.push(cur);
      }
      show();
    }
    function markGood() { if (locked) return; locked = true; feedback.textContent = '¡Correcto! ' + cur.back; feedback.className = 'feedback good'; setTimeout(function () { advance(true); }, 350); }
    input.addEventListener('input', function () { if (!locked && !revealed && E.normalize(input.value) === E.normalize(cur.back)) markGood(); });
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return; e.preventDefault();
      if (locked) return;
      if (revealed) { advance(false); return; }
      var r = C.checkExact(input.value, cur.back);
      if (r.pass) { markGood(); return; }
      feedback.textContent = r.near ? 'Nearly — check the accents' : 'Not quite — try again, or reveal';
      feedback.className = 'feedback bad';
    });
    revealB.addEventListener('click', function () {
      if (locked) return;
      if (revealed) { advance(false); return; }
      revealed = true; feedback.textContent = cur.back; feedback.className = 'feedback reveal';
      revealB.textContent = 'Next →'; input.focus();
    });
    show();
  }

  return { run: run };
})();
