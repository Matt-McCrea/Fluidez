/* ============================================================================
 * RESOURCES view — "Recursos": curated links to real Spanish input and
 * reference tools (data/resources.js). Opens in a new tab; the app itself
 * stays offline. This is where the "you already consume Spanish" habit gets
 * pointed at good material.
 * ========================================================================== */
window.Resources = (function () {
  var UI = window.UI;

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Recursos'));
    wrap.appendChild(UI.el('p', 'muted', 'Fluidez trains output; these give you input. Aim for material you understand ~80% of — interesting first, easy second.'));

    (window.RESOURCES || []).forEach(function (group) {
      wrap.appendChild(UI.el('h3', null, group.category));
      var list = UI.el('div', 'resource-list');
      (group.items || []).forEach(function (it) {
        var a = UI.el('a', 'resource-item');
        a.href = it.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.innerHTML = '<span class="res-label">' + it.label + ' ↗</span>' +
          (it.note ? '<span class="res-note muted">' + it.note + '</span>' : '');
        list.appendChild(a);
      });
      wrap.appendChild(list);
    });

    var home = UI.el('button', 'ghost-btn', '← Más'); home.type = 'button'; home.addEventListener('click', back);
    wrap.appendChild(home);
    host.appendChild(wrap);
  }

  return { render: render };
})();
