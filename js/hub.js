/* ============================================================================
 * HUB — the shared review-pool helper (used by the Inicio status strip) and
 * the "Tus errores" deck, reached from the Progreso tab.
 * ========================================================================== */
window.Hub = (function () {
  var UI = window.UI, S = window.SRS;

  // Rebuild the review candidate pool the same way the Review stage does, so
  // the hub can show an accurate "due today" count.
  function reviewPool() {
    var items = [];
    (window.VOCAB || []).forEach(function (w) {
      if (window.Profile && !window.Profile.catAllowed(w.cat) && !w.userWord) return;
      items.push({ id: 'v:' + w.es + ':meaning' });
    });
    (window.IDIOMS || []).forEach(function (x) { items.push({ id: 'i:' + x.es }); });
    (window.GRAMMAR_LESSONS || []).forEach(function (l) {
      (l.recall || []).forEach(function (r) { if (S.isEnrolled(r.id)) items.push({ id: r.id }); });
    });
    if (window.ErrorLog) window.ErrorLog.cards().forEach(function (c) { items.push({ id: c.id }); });
    return items;
  }

  // ---- "Tus errores" view -------------------------------------------------
  function renderErrors(host, back) {
    UI.clear(host);
    var cards = window.ErrorLog ? window.ErrorLog.cards() : [];
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Tus errores'));

    if (!cards.length) {
      wrap.appendChild(UI.el('p', 'muted', 'Nothing to review — no logged mistakes right now. Nicely done. Misses from cloze, short answers and review show up here to drill.'));
      var h = UI.el('button', 'ghost-btn', '← Volver'); h.type = 'button'; h.addEventListener('click', back);
      wrap.appendChild(h); host.appendChild(wrap); return;
    }

    wrap.appendChild(UI.el('p', 'muted', 'Drill the things you\'ve missed — the highest-leverage review there is. Get one right and it moves further out; miss it and it stays close.'));
    var deckHost = UI.el('div');
    wrap.appendChild(deckHost);
    host.appendChild(wrap);

    window.Deck.run(deckHost, cards, function (stats) {
      UI.clear(deckHost);
      deckHost.appendChild(UI.el('h2', null, 'Listo — ' + stats.correct + ' / ' + stats.seen));
      var h = UI.el('button', 'ghost-btn', '← Volver'); h.type = 'button'; h.addEventListener('click', back);
      deckHost.appendChild(h);
    });
  }

  return { renderErrors: renderErrors, reviewPool: reviewPool };
})();
