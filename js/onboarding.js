/* ============================================================================
 * ONBOARDING — the first-run walkthrough and the placement check.
 *
 * A new learner used to land on Inicio with five tabs, a five-stage session and
 * a level switcher offering A1 through C1, and no way to know what any of it
 * was or which level was theirs. Picking your own CEFR level is a guess, and
 * getting it wrong is expensive: too high and every passage is opaque, too low
 * and you spend weeks on the present tense.
 *
 * Two parts, both skippable:
 *   1. three cards on what the app is and how a day works
 *   2. a placement check that binary-searches the five levels using the
 *      `probes` every lesson already carries (1,156 self-marking multiple
 *      choice items). Nine questions places you within one band.
 *
 * Replayable from Más → "Cómo funciona". Shown once, tracked in localStorage.
 * ========================================================================== */
window.Onboarding = (function () {
  var UI = window.UI;
  var KEY = 'fluidez.onboarded';
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  function seen() { try { return !!localStorage.getItem(KEY); } catch (e) { return true; } }
  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  /* ---- the explainer ------------------------------------------------------ */
  var CARDS = [
    { h: 'Una sesión al día',
      p: 'Fluidez is one structured session a day, not a pile of exercises. Open it, work through the five stages, and you are done — about fifteen minutes. Tomorrow it rotates to new material automatically.' },
    { h: 'Las cinco etapas',
      p: '<b>🔁 Repasar</b> — spaced review of everything due today.<br>' +
         '<b>📖 Aprender</b> — one lesson, taught properly.<br>' +
         '<b>👂 Comprender</b> — read a passage and answer on it.<br>' +
         '<b>🧩 Aplicar</b> — use the grammar in context, not in a table.<br>' +
         '<b>✍️ Producir</b> — write something, checked as you type.' },
    { h: 'Dónde está todo',
      p: '<b>Inicio</b> starts the day\'s session. <b>Practicar</b> has drills and games for when you want more. ' +
         '<b>Progreso</b> shows every lesson — all of them are open, you are never locked out. ' +
         '<b>Palabras</b> is your vocabulary. <b>Más</b> holds the grammar reference, free writing and settings.' }
  ];

  /* ---- placement ---------------------------------------------------------- */
  // Multiple-choice probes only: they mark themselves, so a placement check
  // needs no judgement from the learner about whether they were right.
  function probePool(band) {
    var out = [];
    (window.GRAMMAR_LESSONS || []).forEach(function (l) {
      if (l.cefr !== band) return;
      (l.probes || []).forEach(function (p) {
        if (p.kind === 'mcq' && p.options && p.options.length >= 3) out.push(p);
      });
    });
    return out;
  }

  function runPlacement(host, onDone) {
    /* Binary search over the five bands: three questions at the midpoint, pass
     * two and search upwards, otherwise downwards. Three rounds of three places
     * a learner within one band — far fewer questions than walking up from A1. */
    var lo = 0, hi = BANDS.length - 1, asked = 0, best = 0;
    var rng = UI.seededRandom(String(Date.now()));

    function round() {
      if (lo > hi || asked >= 9) return finish();
      var mid = Math.floor((lo + hi) / 2);
      var pool = probePool(BANDS[mid]);
      if (!pool.length) { lo = mid + 1; return round(); }
      var qs = UI.sample(pool, Math.min(3, pool.length), rng);
      var got = 0, i = 0;

      function ask() {
        if (i >= qs.length) {
          asked += qs.length;
          if (got >= 2) { best = Math.max(best, mid); lo = mid + 1; } else { hi = mid - 1; }
          return round();
        }
        var q = qs[i++];
        UI.clear(host);
        var wrap = UI.el('div', 'panel');
        wrap.appendChild(UI.el('div', 'eyebrow', 'Nivel · pregunta ' + (asked + i) + ' de 9'));
        wrap.appendChild(UI.el('h2', null, q.q));
        var opts = UI.el('div', 'onb-options');
        q.options.forEach(function (o, n) {
          var b = UI.el('button', 'onb-option', o); b.type = 'button';
          b.addEventListener('click', function () { if (n === q.answer) got++; ask(); });
          opts.appendChild(b);
        });
        wrap.appendChild(opts);
        var skip = UI.el('button', 'linkish muted', 'No lo sé →'); skip.type = 'button';
        skip.addEventListener('click', function () { ask(); });
        wrap.appendChild(skip);
        host.appendChild(wrap);
      }
      ask();
    }

    function finish() {
      var band = BANDS[Math.min(best, BANDS.length - 1)];
      UI.clear(host);
      var wrap = UI.el('div', 'panel');
      wrap.appendChild(UI.el('h1', null, 'Empezamos en ' + band));
      wrap.appendChild(UI.el('p', 'doc-summary',
        'Based on those answers, ' + band + ' looks like the right place to start. ' +
        'Nothing is locked — you can change level any time from Más, and every lesson ' +
        'at every level stays open in Progreso.'));
      wrap.appendChild(UI.nextBtn('Empezar →', function () {
        if (window.Profile) window.Profile.set(band);
        markSeen();
        onDone(band);
      }));
      var other = UI.el('button', 'linkish muted', 'Prefiero elegir yo →'); other.type = 'button';
      other.addEventListener('click', function () { markSeen(); onDone(null); });
      wrap.appendChild(other);
      host.appendChild(wrap);
    }

    round();
  }

  /* ---- the flow ----------------------------------------------------------- */
  function run(host, onDone) {
    var idx = 0;
    onDone = onDone || function () {};

    function card() {
      if (idx >= CARDS.length) return offerPlacement();
      var c = CARDS[idx++];
      UI.clear(host);
      var wrap = UI.el('div', 'panel');
      wrap.appendChild(UI.el('div', 'eyebrow', idx + ' / ' + (CARDS.length + 1)));
      wrap.appendChild(UI.el('h1', null, c.h));
      wrap.appendChild(UI.el('div', 'lesson-body', c.p));
      wrap.appendChild(UI.nextBtn(idx < CARDS.length ? 'Siguiente →' : 'Casi →', card));
      var skip = UI.el('button', 'linkish muted', 'Saltar →'); skip.type = 'button';
      skip.addEventListener('click', function () { markSeen(); onDone(null); });
      wrap.appendChild(skip);
      host.appendChild(wrap);
    }

    function offerPlacement() {
      UI.clear(host);
      var wrap = UI.el('div', 'panel');
      wrap.appendChild(UI.el('div', 'eyebrow', (CARDS.length + 1) + ' / ' + (CARDS.length + 1)));
      wrap.appendChild(UI.el('h1', null, '¿Por dónde empezamos?'));
      wrap.appendChild(UI.el('p', 'doc-summary',
        'Nine quick multiple-choice questions will place you at A1, A2, B1, B2 or C1. ' +
        'It takes about two minutes, and you can change it afterwards.'));
      wrap.appendChild(UI.nextBtn('Hacer la prueba →', function () { runPlacement(host, onDone); }));
      var pick = UI.el('button', 'linkish muted', 'Elijo yo mi nivel →'); pick.type = 'button';
      pick.addEventListener('click', function () { markSeen(); onDone(null); });
      wrap.appendChild(pick);
      host.appendChild(wrap);
    }

    card();
  }

  return { run: run, runPlacement: runPlacement, seen: seen, markSeen: markSeen };
})();
