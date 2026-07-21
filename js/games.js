/* ============================================================================
 * GAMES — placeholder for the Juegos overlay (Phase 6 builds the 5 games:
 * Emparejar, Opción múltiple, Conjugación rápida, Frase revuelta,
 * ¿Cuál va aquí?). For now this just gives the "Juegos" tile somewhere to go.
 * ========================================================================== */
window.Games = (function () {
  var UI = window.UI;

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Juegos'));
    wrap.appendChild(UI.el('p', 'muted', 'Coming soon — spaced practice that plays like a game.'));
    var b = UI.el('button', 'ghost-btn', '← Volver'); b.type = 'button'; b.addEventListener('click', back);
    wrap.appendChild(b);
    host.appendChild(wrap);
  }

  return { render: render };
})();
