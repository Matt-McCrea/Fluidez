/* ============================================================================
 * DRILLS — the fast, on-demand practice ported from the companion Español app
 * (its Quiz + Flashcards views), rebuilt on Fluidez's OWN engine, SRS and
 * error log rather than porting a second scheduler or data loader.
 *
 *   • Conjugación — pick tense(s) + a verb scope, then type each conjugated
 *     form. Answers are engine-computed and engine-graded (never hand-typed),
 *     and a card's SRS id is `vt:<inf>:<tense>` — the SAME id the daily Aplicar
 *     stage uses, so a correct answer here is genuinely a correct review of
 *     that (verb, tense) pair, and a miss lands in Puntos débiles.
 *   • Flashcards — a browse-and-flip deck for exposure (vocab / verbs /
 *     expresiones / a tense's conjugations). No typing, no grade — flipping a
 *     card has no result to record, so this one doesn't touch the SRS.
 *
 * Both are reached from the Practicar tab. Español keeps reading the shared
 * data files untouched; nothing here writes back to them.
 * ========================================================================== */
window.Drills = (function () {
  var UI = window.UI, E = window.ENGINE, S = window.SRS;

  // Per-mode tense set, consolidated in js/profile.js (Phase 7) — beginner
  // gets present + the two core pasts, everyone else the full ordered list.
  function tenseKeys() { return window.Profile ? window.Profile.tenses() : E.TENSES.map(function (t) { return t.key; }); }

  function backToTab() { window.Shell.closeOverlay(); window.Shell.refresh('practicar'); }

  // A natural English phrase for a conjugated form ("he ate") instead of a
  // grammatical label (infinitive · person · tense) — matching the form to
  // what it MEANS is the useful skill, not reading terminology off a label.
  function conjPrompt(v, tk, i) {
    var p = E.enPhrase(v, tk, i);
    return p.text + (p.marker ? ' (' + p.marker + ')' : '');
  }

  // ---- conjugation drill ---------------------------------------------------
  function buildConjCards(tenses, scope) {
    var verbs = (window.Profile ? window.Profile.conjugableVerbs() : (window.VERBS || [])).slice();
    if (scope === 'regular') verbs = verbs.filter(function (v) { return !E.isIrregular(v); });
    else if (scope === 'irregular') verbs = verbs.filter(function (v) { return E.isIrregular(v); });
    var cards = [];
    verbs.forEach(function (v) {
      tenses.forEach(function (tk) {
        var forms = E.conjugate(v, tk);
        forms.forEach(function (form, i) {
          if (!form) return;
          cards.push({
            id: 'vt:' + v.inf + ':' + tk,           // shared with the daily Aplicar schedule
            front: conjPrompt(v, tk, i),
            back: form, kind: 'conj', hint: null
          });
        });
      });
    });
    return cards;
  }

  function runConj(host, tenses, scope, title) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', title));
    var exitB = UI.el('button', 'ghost-btn small', '✕ salir'); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', backToTab);
    head.appendChild(exitB);
    wrap.appendChild(head);
    var cards = E.shuffle(buildConjCards(tenses, scope));
    if (!cards.length) { wrap.appendChild(UI.el('p', 'muted', 'Nothing to drill in that combination.')); host.appendChild(wrap); return; }
    // Cap a single sitting so the deck stays a drill, not a marathon.
    cards = cards.slice(0, 40);
    cards.forEach(function (c) { S.enrol(c.id); });
    var deckHost = UI.el('div'); wrap.appendChild(deckHost);
    host.appendChild(wrap);
    window.Deck.run(deckHost, cards, function (stats) {
      UI.clear(deckHost);
      deckHost.appendChild(UI.el('h3', null, 'Listo: ' + stats.correct + ' / ' + stats.seen));
      var again = UI.el('button', 'ghost-btn', '← Practicar'); again.type = 'button'; again.addEventListener('click', backToTab);
      deckHost.appendChild(again);
    }, { logErrors: true });
  }

  function showConjSetup(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', UI.t('Conjugación', 'Conjugation')));
    var exitB = UI.el('button', 'ghost-btn small', '✕ salir'); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', backToTab);
    head.appendChild(exitB);
    wrap.appendChild(head);
    wrap.appendChild(UI.el('p', 'muted', 'Pick one or more tenses, choose the verbs, and type each form. It follows the same schedule as your daily practice.'));

    var chosen = {};
    wrap.appendChild(UI.el('h3', null, 'Tenses'));
    var tchips = UI.el('div', 'chip-row');
    tenseKeys().forEach(function (tk) {
      var c = UI.el('button', 'topic-chip', E.TENSE_LABEL[tk]); c.type = 'button';
      c.addEventListener('click', function () { chosen[tk] = !chosen[tk]; c.classList.toggle('chosen', chosen[tk]); });
      tchips.appendChild(c);
    });
    wrap.appendChild(tchips);

    var scope = 'all';
    wrap.appendChild(UI.el('h3', null, 'Verbs'));
    var sBar = UI.el('div', 'profile-bar muted');
    var seg = UI.el('div', 'segmented');
    [['all', 'All'], ['regular', 'Regular'], ['irregular', 'Irregular']].forEach(function (o) {
      var b = UI.el('button', 'seg' + (scope === o[0] ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () {
        scope = o[0];
        Array.prototype.forEach.call(seg.children, function (x) { x.classList.remove('active'); });
        b.classList.add('active');
      });
      seg.appendChild(b);
    });
    sBar.appendChild(seg);
    wrap.appendChild(sBar);

    var go = UI.el('button', 'primary-btn', 'Empezar →'); go.type = 'button';
    go.addEventListener('click', function () {
      var tenses = Object.keys(chosen).filter(function (k) { return chosen[k]; });
      if (!tenses.length) { tenses = ['presente']; }
      runConj(host, tenses, scope, 'Conjugación');
    });
    wrap.appendChild(go);
    host.appendChild(wrap);
  }

  // ---- flashcards (browse + flip) ------------------------------------------
  function buildFlashDeck(kind, tense) {
    var out = [];
    if (kind === 'vocab') (window.VOCAB || []).forEach(function (w) {
      if (window.Profile && !window.Profile.wordAllowed(w)) return;
      out.push({ front: w.es, back: w.en, kind: 'vocab' });
    });
    // Meeting a verb's MEANING here is fine even if it hasn't been taught
    // yet — that's a legitimate way to first come across it — so this stays
    // on the full list regardless of mode.
    else if (kind === 'verbs') (window.VERBS || []).forEach(function (v) { out.push({ front: v.inf, back: v.en, kind: 'verb' }); });
    else if (kind === 'idioms') (window.IDIOMS || []).forEach(function (x) { out.push({ front: x.es, back: x.en, kind: 'idiom', hint: x.lit || null }); });
    // Conjugation IS restricted for beginner — same reasoning as the games.
    else if (kind === 'conj') (window.Profile ? window.Profile.conjugableVerbs() : (window.VERBS || [])).forEach(function (v) {
      var forms = E.conjugate(v, tense);
      forms.forEach(function (form, i) { if (form) out.push({ front: conjPrompt(v, tense, i), back: form, kind: 'conj' }); });
    });
    return out;
  }

  function runFlash(host, deck, title) {
    deck = E.shuffle(deck.slice());
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', title));
    var exitB = UI.el('button', 'ghost-btn small', '✕ salir'); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', backToTab);
    head.appendChild(exitB);
    wrap.appendChild(head);
    if (!deck.length) { wrap.appendChild(UI.el('p', 'muted', 'Nothing here to browse.')); host.appendChild(wrap); return; }

    var idx = 0, flipped = false;
    var pos = UI.el('div', 'muted small');
    var card = UI.el('button', 'flashcard'); card.type = 'button';
    var face = UI.el('div', 'flash-face');
    var hint = UI.el('div', 'muted small flash-hint');
    card.appendChild(face); card.appendChild(hint);
    function render() {
      var c = deck[idx];
      face.textContent = flipped ? c.back : c.front;
      card.dataset.kind = c.kind;
      card.classList.toggle('flipped', flipped);
      hint.textContent = (flipped && c.hint) ? 'lit: ' + c.hint : '';
      pos.textContent = (idx + 1) + ' / ' + deck.length + (flipped ? '' : ' · tap to flip');
    }
    card.addEventListener('click', function () { flipped = !flipped; render(); });
    var nav = UI.el('div', 'row-controls');
    var prev = UI.el('button', 'ghost-btn', '← Prev'); prev.type = 'button';
    var next = UI.el('button', 'ghost-btn', 'Next →'); next.type = 'button';
    prev.addEventListener('click', function () { idx = (idx - 1 + deck.length) % deck.length; flipped = false; render(); });
    next.addEventListener('click', function () { idx = (idx + 1) % deck.length; flipped = false; render(); });
    nav.appendChild(prev); nav.appendChild(next);
    wrap.appendChild(pos); wrap.appendChild(card); wrap.appendChild(nav);
    host.appendChild(wrap);
    render();
  }

  function showFlashSetup(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', 'Flashcards'));
    var exitB = UI.el('button', 'ghost-btn small', '✕ salir'); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', backToTab);
    head.appendChild(exitB);
    wrap.appendChild(head);
    wrap.appendChild(UI.el('p', 'muted', 'Browse and flip. Good for meeting new material or a quick warm-up. No typing.'));

    var chips = UI.el('div', 'chip-row');
    function contentChip(text, fn) { var c = UI.el('button', 'vocab-chip', text); c.type = 'button'; c.addEventListener('click', fn); chips.appendChild(c); }
    contentChip('Vocabulario', function () { runFlash(host, buildFlashDeck('vocab'), 'Flashcards · Vocabulario'); });
    contentChip('Verbos', function () { runFlash(host, buildFlashDeck('verbs'), 'Flashcards · Verbos'); });
    if ((window.IDIOMS || []).length) contentChip('Expresiones', function () { runFlash(host, buildFlashDeck('idioms'), 'Flashcards · Expresiones'); });
    wrap.appendChild(chips);

    wrap.appendChild(UI.el('h3', null, UI.t('Conjugación por tiempo', 'Conjugation by tense')));
    var tchips = UI.el('div', 'chip-row');
    tenseKeys().forEach(function (tk) {
      var c = UI.el('button', 'topic-chip', E.TENSE_LABEL[tk]); c.type = 'button';
      c.addEventListener('click', function () { runFlash(host, buildFlashDeck('conj', tk), 'Flashcards · ' + E.TENSE_LABEL[tk]); });
      tchips.appendChild(c);
    });
    wrap.appendChild(tchips);
    host.appendChild(wrap);
  }

  // ---- weak spots by form ----------------------------------------------------
  // Items missed twice or more in the last 30 days (counted off the review
  // log SRS.grade writes), grouped by the FORM they exercise rather than by
  // item: a verb tense, a contrast, or plain words. The log has no person, and
  // a vt: id names verb and tense only, so verb groups are per tense.
  var WEAK_DAYS = 30, WEAK_MIN = 2, WEAK_MAX = 10;
  var TENSE_PLAIN = { presente: 'present', preterito: 'preterite', imperfecto: 'imperfect', perfecto: 'present perfect',
    plusc: 'past perfect', futuro: 'future', futperf: 'future perfect', condicional: 'conditional', condperf: 'conditional perfect',
    presubj: 'present subjunctive', perfsubj: 'perfect subjunctive', impsubj: 'imperfect subjunctive',
    imperativo: 'commands', impneg: 'negative commands' };
  function missCounts() {
    var log = []; try { log = JSON.parse(localStorage.getItem(S.reviewLogKey)) || []; } catch (e) {}
    var from = S.today() - WEAK_DAYS, out = {};
    log.forEach(function (r) { if (r && r.day >= from && !r.ok) out[r.id] = (out[r.id] || 0) + 1; });
    return out;
  }
  function formOf(id) {
    var m = /^vt:[^:]+:(.+)$/.exec(id);
    if (m) return { key: 'vt:' + m[1], label: 'verbs: ' + (TENSE_PLAIN[m[1]] || m[1]) };
    m = /^(?:ac|x):(?:x:)?(.+)$/.exec(id);
    if (m) {
      var slug = m[1];
      var named = [[/ser-estar|ser-event/, 'ser or estar'], [/por-para/, 'por or para'], [/pret.*imp|imp.*pret/, 'preterite or imperfect'],
                   [/subj|indic/, 'subjunctive or indicative']].filter(function (n) { return n[0].test(slug); })[0];
      var lbl = named ? named[1] : slug.replace(/-/g, ' ');
      return { key: 'x:' + lbl, label: lbl };
    }
    return { key: 'words', label: 'words' };
  }
  // pool: master-pool items (with .id); returns [{key, label, items, n}] biggest first.
  function weakGroups(pool) {
    var miss = missCounts(), groups = {}, order = [];
    (pool || []).forEach(function (it) {
      var strong = (miss[it.id] || 0) >= WEAK_MIN;
      if (!strong) return;
      var f = formOf(it.id);
      if (!groups[f.key]) { groups[f.key] = { key: f.key, label: f.label, items: [], n: 0 }; order.push(f.key); }
      groups[f.key].items.push(it);
    });
    return order.map(function (k) {
      var g = groups[k];
      g.items.sort(function (a, b) { return miss[b.id] - miss[a.id]; });
      g.n = g.items.length;
      g.items = g.items.slice(0, WEAK_MAX);
      return g;
    }).sort(function (a, b) { return b.n - a.n; });
  }

  // ---- entry points injected into Practicar --------------------------------
  function renderSection(container) {
    var list = UI.el('div', 'mas-list');
    function row(icon, title, sub, onTap) {
      var b = UI.el('button', 'mas-row'); b.type = 'button';
      b.innerHTML = '<span class="mas-ico">' + icon + '</span><span class="mas-text"><b>' + title + '</b><br><span class="muted small">' + sub + '</span></span><span class="mas-chev">›</span>';
      b.addEventListener('click', function () { window.Shell.openOverlay(); onTap(document.getElementById('stage-host')); });
      list.appendChild(b);
    }
    row('🔡', 'Conjugación', 'Drill any tense, typed', showConjSetup);
    row('🃏', 'Flashcards', 'Browse & flip: vocab, verbs, conjugations', showFlashSetup);
    container.appendChild(list);
  }

  return { renderSection: renderSection, weakGroups: weakGroups };
})();
