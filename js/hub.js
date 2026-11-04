/* ============================================================================
 * HUB — the shared review-pool helper (used by the Inicio status strip) and
 * the "Tus errores" deck, reached from the Lecciones tab.
 * ========================================================================== */
window.Hub = (function () {
  var UI = window.UI, S = window.SRS;

  // Rebuild the review candidate pool the same way the Review stage does, so
  // the hub can show an accurate "due today" count.
  function reviewPool() {
    if (window.Perf) return window.Perf.mark('reviewPool', reviewPoolInner);
    return reviewPoolInner();
  }
  function reviewPoolInner() {
    var items = [];
    (window.VOCAB || []).forEach(function (w) {
      if (window.Profile && !window.Profile.wordAllowed(w)) return;
      items.push({ id: 'v:' + w.es + ':meaning' });
    });
    (window.IDIOMS || []).forEach(function (x) { items.push({ id: 'i:' + x.es }); });
    (window.GRAMMAR_LESSONS || []).forEach(function (l) {
      (l.recall || []).forEach(function (r) { if (r.srs !== false && S.isEnrolled(r.id)) items.push({ id: r.id }); });
    });
    (window.Phrases ? window.Phrases.all() : []).forEach(function (ph) {
      if (S.isEnrolled(ph.id)) items.push({ id: ph.id });
    });
    if (window.ErrorLog) window.ErrorLog.cards().forEach(function (c) { items.push({ id: c.id }); });
    return window.Vetoed ? window.Vetoed.filter(items) : items;
  }

  // ---- "Tus errores" view -------------------------------------------------
  function renderErrors(host, back) {
    UI.clear(host);
    var cards = window.ErrorLog ? window.ErrorLog.cards() : [];
    if (window.Vetoed) cards = window.Vetoed.filter(cards);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, UI.t('Tus errores', 'Your mistakes')));

    if (!cards.length) {
      wrap.appendChild(UI.el('p', 'muted', 'Nothing to review. You have no logged mistakes right now. Misses from fill-in-the-blank, short answers and review show up here to practise.'));
      var h = UI.el('button', 'ghost-btn', '← Volver'); h.type = 'button'; h.addEventListener('click', back);
      wrap.appendChild(h); host.appendChild(wrap); return;
    }

    wrap.appendChild(UI.el('p', 'muted', 'Practising your own mistakes is the fastest way to fix them. Get one right and it moves further out; miss it and it stays close.'));
    var deckHost = UI.el('div');
    wrap.appendChild(deckHost);
    host.appendChild(wrap);

    window.Deck.run(deckHost, cards, function (stats) {
      UI.clear(deckHost);
      deckHost.appendChild(UI.el('h2', null, UI.t('Listo', 'Done') + ': ' + stats.correct + ' / ' + stats.seen));
      var h = UI.el('button', 'ghost-btn', '← Volver'); h.type = 'button'; h.addEventListener('click', back);
      deckHost.appendChild(h);
    });
  }

  /* ---- the weekly theme choice ---------------------------------------------
   * One card, two homes: the unit-done screen ("Next week: ...") and the hub on
   * the first day of a unit ("Pick a theme for this unit?"). Choosing starts a
   * Focus for `days` sessions; "carry on" starts nothing. Either answer is
   * recorded under progress.themeOffered so the offer is made once per unit.
   *   opts: { unitId, days, title, band, onDone }  */
  function offeredMap() {
    try { return (JSON.parse(localStorage.getItem('fluidez.progress')) || {}).themeOffered || {}; } catch (e) { return {}; }
  }
  function markOffered(unitId) {
    if (!unitId) return;
    try {
      var p = JSON.parse(localStorage.getItem('fluidez.progress')) || {};
      p.themeOffered = p.themeOffered || {}; p.themeOffered[unitId] = 1;
      localStorage.setItem('fluidez.progress', JSON.stringify(p));
    } catch (e) {}
  }
  function themeOffer(opts) {
    var F = window.Focus;
    if (!F || !F.themeOptions || offeredMap()[opts.unitId]) return null;
    var list = F.themeOptions(opts.band);
    if (!list.length) return null;
    var box = UI.el('div', 'theme-offer');
    box.appendChild(UI.el('div', 'eyebrow', opts.title || UI.t('Elige un tema para la próxima semana, o sigue.', 'Pick a theme for next week, or carry on.')));
    var row = UI.el('div', 'theme-chips');
    function finish(msg) {
      markOffered(opts.unitId);
      UI.clear(box);
      box.appendChild(UI.el('p', 'muted', msg));
      if (opts.onDone) opts.onDone();
    }
    list.forEach(function (t) {
      var b = UI.el('button', 'ghost-btn small theme-chip', t.label); b.type = 'button';
      b.addEventListener('click', function () {
        F.start(t.id, Math.min(F.MAX_DAYS, opts.days || F.DEFAULT_DAYS), opts.band);
        finish(UI.t('Enfoque: ', 'Focus: ') + t.label + ' · ' + F.remaining() + UI.t(' sesiones', ' sessions'));
      });
      row.appendChild(b);
    });
    box.appendChild(row);
    var carry = UI.el('button', 'linkish', UI.t('Seguir con el curso', 'Carry on')); carry.type = 'button';
    carry.addEventListener('click', function () { finish(UI.t('Seguimos con el curso.', 'Carrying on with the course.')); });
    box.appendChild(carry);
    return box;
  }

  return { renderErrors: renderErrors, reviewPool: reviewPool, themeOffer: themeOffer };
})();
