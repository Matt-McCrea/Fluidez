/* ============================================================================
 * NATURAL — "Suena natural" (Sound natural), a Practicar mode from B1.
 *
 * The English a learner wants to say and, when the item has one, the stiff
 * line a learner would produce ("You might say:"); the learner types what a
 * Colombian would actually say. Graded like a bank translation in
 * js/views/produce.js (runBankTranslate): LIB.match.startAttempt and
 * submitAttempt, one plain hint and one retry, then the natural line. A miss
 * shows the natural line and its why; a pass shows the why too, and the
 * natural line when the learner got there another way.
 *
 * Typing the stiff line itself is a try with its own hint, checked before the
 * matcher: Spain's "le echo de menos" would otherwise pass the matcher as a
 * Peninsular variant. tools/test-natural.js holds every accepted form to not
 * reading as the stiff line, so this check can never fail a right answer.
 *
 * Rounds of ROUND items from one group or all of them ("mixed"), at or below
 * the learner's band, the ones not seen in FRESH_DAYS days first (the shared
 * ledger fluidez.seen, key nat:<id>). Every item is enrolled as a review card
 * the first time it is shown: SRS.enrol('nat:<id>', 1), so due tomorrow. The
 * review deck still needs a renderer for nat: ids (see the report for this
 * change); until then the cards are scheduled and not asked.
 *
 * Practice, not a game: no bests, no score kept. A round ends on one line.
 * Data: data/natural.js (window.NATURAL).
 * ========================================================================== */
window.Natural = (function () {
  var SEEN_KEY = 'fluidez.seen', FRESH_DAYS = 14, ROUND = 10, MIN_BAND = 'B1';
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var GROUPS = [
    { id: 'verbs', en: 'Verbs in use', es: 'Verbos en uso', sub: 'dar, quedar, tocar, caer and the rest, the way people use them', subEs: 'dar, quedar, tocar, caer y los demás, como los usa la gente' },
    { id: 'anglicisms', en: 'False friends', es: 'Falsos amigos', sub: 'realizar, asistir, actualmente and the other English traps', subEs: 'realizar, asistir, actualmente y las otras trampas del inglés' },
    { id: 'colombia', en: 'Colombian everyday', es: 'Colombiano de todos los días', sub: 'qué pena, regálame, ahorita, dar papaya' },
    { id: 'connectors', en: 'Connectors', es: 'Conectores', sub: 'o sea, es que, resulta que, lo que pasa es que' },
    { id: 'register', en: 'Friend or stranger', es: 'Amigo o desconocido', sub: 'the same thing, said to each', subEs: 'lo mismo, dicho a cada uno' }
  ];
  var WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  /* Interface text: Spanish from B1, English before (UI.t). Pure parts run without a UI, so they fall back to English. */
  function T(es, en) { return (window.UI && window.UI.t && window.Profile && window.Profile.term) ? window.UI.t(es, en) : en; }
  var WORDS_ES = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  function stiffHint() { return T('Esa es la línea acartonada de arriba.', 'That is the stiff line from above.'); }

  // ---- pure parts (tools/test-natural.js) ----------------------------------
  function rank(b) { var i = BANDS.indexOf(b); return i < 0 ? 0 : i; }
  function band() {
    try { return (window.Profile && window.Profile.current && window.Profile.current()) || 'A1'; } catch (e) { return 'A1'; }
  }
  function open(b) { return rank(b || band()) >= rank(MIN_BAND); }
  function cardId(it) { return 'nat:' + it.id; }
  function items() { return window.NATURAL || []; }
  function vetoed(it) { return !!(window.Vetoed && window.Vetoed.has && window.Vetoed.has(cardId(it))); }

  /* Items at or below band b, in one group or all of them ('mixed' or none),
   * leaving out any the learner retired from review ("stop asking me this"). */
  function pool(b, group) {
    var r = rank(b);
    if (r < rank(MIN_BAND)) return [];
    return items().filter(function (it) {
      return rank(it.band) <= r && (!group || group === 'mixed' || it.group === group) && !vetoed(it);
    });
  }

  /* A round of n: items not seen in FRESH_DAYS days first, shuffled; then the
   * ones seen recently, the longest ago first. */
  function round(list, seen, td, rng, n) {
    rng = rng || Math.random; seen = seen || {}; n = n || ROUND;
    var fresh = [], recent = [];
    (list || []).forEach(function (it) {
      var s = seen[cardId(it)];
      if (s != null && td - s >= 0 && td - s < FRESH_DAYS) recent.push(it); else fresh.push(it);
    });
    for (var i = fresh.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1)), t = fresh[i]; fresh[i] = fresh[j]; fresh[j] = t;
    }
    recent.sort(function (a, b) { return seen[cardId(a)] - seen[cardId(b)]; });
    return fresh.concat(recent).slice(0, n);
  }

  /* The one closing line: "Eight of ten. The ones you missed come back in review." */
  function word(n) { return WORDS[n] || String(n); }
  function summary(right, total) {
    var w = word(right), missed = total - right;
    var es = (WORDS_ES[right] || String(right)), est = (WORDS_ES[total] || String(total));
    return T(es.charAt(0).toUpperCase() + es.slice(1) + ' de ' + est + '. ' +
        (missed <= 0 ? 'Todas vuelven en el repaso.'
          : missed === 1 ? 'La que fallaste vuelve en el repaso.'
          : 'Las que fallaste vuelven en el repaso.'),
      w.charAt(0).toUpperCase() + w.slice(1) + ' of ' + word(total) + '. ' +
      (missed <= 0 ? 'They all come back in review.'
        : missed === 1 ? 'The one you missed comes back in review.'
        : 'The ones you missed come back in review.'));
  }

  /* Does the typed line read as the item's stiff line? Graded by the matcher
   * itself, so punctuation, capitals, accents and a dropped yo do not hide it. */
  function isStiff(it, text) {
    var M = window.LIB && window.LIB.match;
    if (!it.stiff || !M) return false;
    try { return !!M.matchTranslation(text, { es: it.stiff, en: it.en, accept: [] }, { accents: 'lenient' }).pass; }
    catch (e) { return false; }
  }

  /* A miss that is only the wrong "you": the English brackets who it is said
   * to, so with the bracket gone the matcher accepts the other register and
   * says which one it was. The matcher's own hint for that is about mood or a
   * verb ending, which sends the learner the wrong way. */
  var FORMAL = /\([^)]*\b(formal|polite)\b[^)]*\)/i;
  function tuHint() { return T('Las palabras están bien, pero esa es la forma de tú y esta es para usted.', 'Right words, but that is the tú form, and this one is for usted.'); }
  function ustedHint() { return T('Las palabras están bien, pero esa es la forma de usted y esta es para un amigo.', 'Right words, but that is the usted form, and this one is for a friend.'); }
  function registerMiss(it, text) {
    var M = window.LIB && window.LIB.match;
    var openEn = String(it.en).replace(/\s*\([^)]*\)\s*$/, '');
    if (!M || openEn === it.en) return null;
    try {
      var r = M.matchTranslation(text, { es: it.es, en: openEn, accept: it.accept || [] }, { accents: 'lenient' });
      if (r.pass && r.register === 'tú') return tuHint();
      if (r.pass && r.register === 'usted') return ustedHint();
    } catch (e) {}
    // the matcher cannot re-inflect every line (disculpe, ¿cómo está?): for usted, a tú word is enough
    return FORMAL.test(it.en) && tuSignal(text, it.es) ? T('Esa es la forma de tú y esta es para usted.', 'That is the tú form, and this one is for usted.') : null;
  }
  /* A word only tú uses (te, tu, ti, contigo, podrías, estás) that the natural line does not have. */
  function tuSignal(text, es) {
    var E = window.LIB && window.LIB.engine;
    var toks = String(text).toLowerCase().match(/[a-záéíóúñü]+/g) || [];
    var model = ' ' + (String(es).toLowerCase().match(/[a-záéíóúñü]+/g) || []).join(' ') + ' ';
    return toks.some(function (w) {
      if (model.indexOf(' ' + w + ' ') >= 0) return false;
      if (/^(te|tu|tus|ti|contigo)$/.test(w)) return true;
      var an = (E && E.analyzeToken) ? (E.analyzeToken(w) || []) : [];
      return an.length > 0 && an.every(function (a) { return a.person === 'tú'; });
    });
  }

  // ---- the seen ledger and the review card ---------------------------------
  function today() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000); }
  function loadSeen() { try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { return {}; } }
  function markSeen(it) {
    try {
      var s = loadSeen();
      s[cardId(it)] = today();
      localStorage.setItem(SEEN_KEY, JSON.stringify(s));
    } catch (e) {}
    if (window.SRS && window.SRS.enrol) window.SRS.enrol(cardId(it), 1);
  }

  // ---- screens --------------------------------------------------------------
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function emph(s) { return esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>'); }
  function groupOf(id) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].id === id) return GROUPS[i]; return null; }
  function title() { return window.UI.t('Suena natural', 'Sound natural'); }

  /* The entry in Practicar: one row from B1, a note below it. */
  function renderEntry(container, back) {
    var UI = window.UI;
    if (!items().length) return;
    if (!open()) {
      container.appendChild(UI.el('p', 'muted small nat-locked',
        T('Suena natural abre en B1: los verbos de todos los días, los falsos amigos y las frases colombianas que hacen que tu español suene nativo.', 'Sound natural opens at B1: the everyday verbs, false friends and Colombian lines that make your Spanish sound native.')));
      return;
    }
    var list = UI.el('div', 'mas-list');
    var b = UI.el('button', 'mas-row'); b.type = 'button';
    b.innerHTML = '<span class="mas-ico">🗣️</span><span class="mas-text"><b>' + title() +
      '</b><br><span class="muted small">' + T('Dilo como lo diría un colombiano: verbos en uso, falsos amigos, frases de todos los días', 'Say it the way a Colombian would: verbs in use, false friends, everyday lines') + '</span></span><span class="mas-chev">›</span>';
    b.addEventListener('click', function () {
      window.Shell.openOverlay();
      render(document.getElementById('stage-host'), back);
    });
    list.appendChild(b);
    container.appendChild(list);
  }

  /* The group picker: a chip per group with how many are open to you, and mixed. */
  function render(host, back) {
    var UI = window.UI, b = band();
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, title()));
    if (!open(b)) {
      wrap.appendChild(UI.el('p', 'muted', T('Esto abre en B1. Hasta entonces, las lecciones construyen el español del que parte.', 'This opens at B1. Until then the lessons build the Spanish it starts from.')));
    } else {
      wrap.appendChild(UI.el('p', 'muted',
        T('El inglés que quieres decir, a veces con la línea que produciría un estudiante. Tú escribes lo que realmente diría un colombiano. De diez en diez, y cada una vuelve en el repaso.', 'The English you want to say, sometimes with the line a learner would produce. You type what a Colombian would actually say. Ten at a time, and each one comes back in review.')));
      var chips = UI.el('div', 'chip-row nat-groups');
      var all = pool(b, 'mixed').length;
      var chip = function (id, label, n, sub) {
        var c = UI.el('button', 'topic-chip', esc(label) + ' · ' + n); c.type = 'button';
        if (sub) c.title = sub;
        c.addEventListener('click', function () { start(host, id, back); });
        chips.appendChild(c);
      };
      if (all) chip('mixed', T('Mezcla', 'Mixed'), all, T('una ronda de todos los grupos', 'a round from every group'));
      GROUPS.forEach(function (g) {
        var n = pool(b, g.id).length;
        if (n) chip(g.id, T(g.es, g.en), n, T(g.subEs || g.sub, g.sub));
      });
      if (!all) chips.appendChild(UI.el('span', 'muted small', T('Todavía no hay nada aquí para tu nivel.', 'Nothing here at your level yet.')));
      wrap.appendChild(chips);
    }
    var backB = UI.el('button', 'ghost-btn', '← Practicar'); backB.type = 'button';
    backB.addEventListener('click', back);
    wrap.appendChild(backB);
    host.appendChild(wrap);
  }

  function start(host, group, back) {
    var UI = window.UI;
    var list = round(pool(band(), group), loadSeen(), today(), Math.random, ROUND);
    var g = groupOf(group), label = g ? T(g.es, g.en) : T('Mezcla', 'Mixed');
    var at = 0, right = 0;
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var progress = UI.el('div', 'muted review-stats');
    var body = UI.el('div');
    wrap.appendChild(progress); wrap.appendChild(body);
    host.appendChild(wrap);

    function show() {
      UI.clear(body);
      if (at >= list.length) { end(); return; }
      var it = list[at];
      progress.textContent = title() + ' · ' + label + ' · ' + (at + 1) + ' / ' + list.length;
      markSeen(it);
      runItem(body, it, function (ok) { if (ok) right++; at++; show(); });
    }
    function end() {
      progress.textContent = title() + ' · ' + label;
      if (!list.length) body.appendChild(UI.el('p', 'muted', T('Todavía no hay nada aquí para tu nivel.', 'Nothing here at your level yet.')));
      else body.appendChild(UI.el('p', 'nat-summary', summary(right, list.length)));
      var row = UI.el('div', 'row-controls');
      if (list.length) {
        var again = UI.el('button', 'primary-btn', T('Otra ronda', 'Another round')); again.type = 'button';
        again.addEventListener('click', function () { start(host, group, back); });
        row.appendChild(again);
      }
      var other = UI.el('button', 'ghost-btn', T('Elegir un grupo', 'Pick a group')); other.type = 'button';
      other.addEventListener('click', function () { render(host, back); });
      row.appendChild(other);
      var backB = UI.el('button', 'ghost-btn', '← Practicar'); backB.type = 'button';
      backB.addEventListener('click', back);
      row.appendChild(backB);
      body.appendChild(row);
    }
    show();
  }

  /* One item: the flow of runBankTranslate, with the stiff line in front and
   * the why behind. next(ok) once it is settled. */
  function runItem(body, it, next) {
    var UI = window.UI, M = window.LIB && window.LIB.match;
    body.appendChild(UI.el('h2', 'q-text', '“' + esc(it.en) + '”'));
    if (it.stiff) {
      var st = UI.el('div', 'nat-stiff');
      st.appendChild(UI.el('div', 'muted small', T('Podrías decir:', 'You might say:')));
      st.appendChild(UI.el('div', 'nat-stiff-es', esc(it.stiff)));
      body.appendChild(st);
      body.appendChild(UI.el('p', 'muted', T('Dilo como lo diría un colombiano:', 'Say it the way a Colombian would:')));
    } else {
      body.appendChild(UI.el('p', 'muted', T('Dilo de forma natural:', 'Say it the natural way:')));
    }
    var ta = UI.el('textarea', 'answer-area');
    ta.rows = 2; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;
    var fb = UI.el('div', 'feedback');
    var go = UI.el('button', 'primary-btn', T('Revisa', 'Check')); go.type = 'button';
    var skip = UI.el('button', 'ghost-btn', T('Ver la respuesta (no me sale)', 'Show answer (I\'m stuck)')); skip.type = 'button';
    var row = UI.el('div', 'row-controls');
    row.appendChild(go); row.appendChild(skip);
    body.appendChild(ta);
    body.appendChild(UI.accentBar(function () { return ta; }));
    body.appendChild(fb);
    body.appendChild(row);
    ta.focus();

    var sentence = { es: it.es, en: it.en, accept: it.accept || [] };
    var state = M ? M.startAttempt(sentence, { accents: 'lenient' }) : null;
    var tries = 0, finished = false;
    var model = function () { return '<div class="model-answer">' + esc(it.es) + '</div>'; };
    var why = function () { return '<div class="nat-why">' + emph(it.why) + '</div>'; };

    function finish(ok, html, cls) {
      finished = true;
      fb.className = 'feedback ' + cls;
      fb.innerHTML = html + why();
      ta.readOnly = true;
      skip.classList.add('hidden');
      go.textContent = T('Siguiente →', 'Next →'); go.disabled = false;
      go.onclick = function () { next(ok); };
    }
    function reveal(hint) {
      finish(false, model() + (hint ? '<div class="muted small">' + esc(hint) + '</div>' : ''), 'bad');
    }
    function retry(hint) {
      fb.className = 'feedback bad';
      fb.textContent = (hint ? (T('y', 'n') === 'y' ? 'Pista: ' : '') + hint : T('Casi.', 'Not quite.')) + ' ' + T('Inténtalo otra vez.', 'Try once more.');
      ta.focus();
    }
    function submit() {
      if (finished) return;
      var text = ta.value.trim();
      if (!text) return;
      if (!M) { reveal(null); return; }
      // the stiff line counts as a try even where the matcher would let it through
      if (isStiff(it, text)) {
        tries++;
        state.tries = tries;
        if (tries < (M.MAX_TRIES || 2)) retry(stiffHint()); else reveal(stiffHint());
        return;
      }
      var step = M.submitAttempt(state, text);
      state = step.state; tries = state.tries;
      var res = step.result;
      if (step.status === 'correct') {
        var note = res.note || (res.near ? res.hint : '');
        // the natural line is shown whenever the pass was not that line itself
        if (res.variant === 'peninsular') finish(true, T('Bien, aunque así lo dicen en España. En Colombia:', 'Right, though that is how Spain says it. In Colombia:') + model(), 'good');
        else if (note) finish(true, T('Bien. ', 'Right. ') + esc(note) + model(), 'good');
        else if (res.closest !== it.es) finish(true, T('Bien. También es natural:', 'Right. Also natural:') + model(), 'good');
        else finish(true, T('Bien.', 'Right.'), 'good');
      } else {
        var hint = registerMiss(it, text) || res.hint || null;
        if (step.status === 'retry') retry(hint); else reveal(hint);
      }
    }
    go.onclick = submit;
    skip.addEventListener('click', function () { if (!finished) reveal(null); });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (finished) go.click(); else submit(); }
    });
  }

  return { GROUPS: GROUPS, ROUND: ROUND, FRESH_DAYS: FRESH_DAYS,
           open: open, pool: pool, round: round, summary: summary, cardId: cardId, isStiff: isStiff, registerMiss: registerMiss,
           renderEntry: renderEntry, render: render, start: start };
})();
