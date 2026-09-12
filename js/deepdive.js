/* ============================================================================
 * PROFUNDIZAR — the way into the optional deep units.
 *
 * Optional units cost no day and never appear on the daily path, which makes
 * them worthless unless something surfaces them. Three routes were designed:
 * a browsable index (this view), an "Understand this better" link from the
 * core lesson that introduces the topic (js/views/learn.js `deeper`), and —
 * still to build — the error log offering one when a learner keeps missing
 * the same thing.
 *
 * The index lists units by band and shows what the learner will be able to do,
 * not what the unit is about. A deep dive titled "The subjunctive" is a
 * reading list; one titled "choose indicative or subjunctive after any verb of
 * opinion, and say why" is a thing worth an evening.
 * ========================================================================== */
window.DeepDive = (function () {
  var UI = window.UI;

  function loadProg() {
    try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; }
  }
  function units() {
    var all = window.COURSE_UNITS || {};
    return Object.keys(all).map(function (k) { return all[k]; })
      .filter(function (u) { return u.optional; });
  }
  /* ALL_LESSONS, not GRAMMAR_LESSONS. GRAMMAR_LESSONS is built FROM the
   * course, so it contains only what is on the path — every lesson a deep
   * unit holds is by definition absent from it, and looking there showed the
   * raw ids instead of the titles. */
  function lessonById(id) {
    var ls = window.ALL_LESSONS || window.GRAMMAR_LESSONS || [];
    for (var i = 0; i < ls.length; i++) if (ls[i].id === id) return ls[i];
    return null;
  }

  function render(host, back, openId) {
    UI.clear(host);
    var studied = loadProg().studied || {};
    var list = units();

    var head = UI.el('div', 'panel');
    head.appendChild(UI.el('h1', null, 'Profundizar'));
    head.appendChild(UI.el('p', 'muted',
      'Optional deep dives on the things that stay confusing. None of these is on your daily path — ' +
      'they are here for when you want one, and you can take them in any order.'));
    var home = UI.el('button', 'ghost-btn', '← Más'); home.type = 'button';
    home.addEventListener('click', back);
    head.appendChild(home);
    host.appendChild(head);

    if (!list.length) {
      var none = UI.el('div', 'panel');
      none.appendChild(UI.el('p', 'muted', 'No deep dives yet.'));
      host.appendChild(none);
      return;
    }

    var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
    BANDS.forEach(function (band) {
      var inBand = list.filter(function (u) { return u.band === band; });
      if (!inBand.length) return;
      var panel = UI.el('div', 'panel');
      panel.appendChild(UI.el('h2', null, band));
      inBand.forEach(function (u) {
        var card = UI.el('div', 'deep-card');
        card.appendChild(UI.el('h3', 'deep-title', u.title));
        if (u.goal) card.appendChild(UI.el('p', 'deep-goal', u.goal));

        if ((u.canDo || []).length) {
          var ul = UI.el('ul', 'deep-cando');
          u.canDo.forEach(function (c) { ul.appendChild(UI.el('li', null, c)); });
          card.appendChild(ul);
        }

        // the lessons themselves, each opening in the Gramática reader
        var rows = UI.el('div', 'deep-lessons');
        (u.lessons || []).forEach(function (id, n) {
          var l = lessonById(id);
          var b = UI.el('button', 'deep-lesson'); b.type = 'button';
          b.innerHTML = '<span class="dl-n">' + (n + 1) + '</span>' +
            '<span class="dl-t">' + (l ? l.title : id) + '</span>' +
            '<span class="dl-mark">' + (studied[id] ? '✓' : '') + '</span>';
          b.addEventListener('click', function () {
            if (window.Grammar && window.Grammar.open) window.Grammar.open(id);
          });
          rows.appendChild(b);
        });
        card.appendChild(rows);
        panel.appendChild(card);
      });
      host.appendChild(panel);
    });

    if (openId) {
      var target = host.querySelector('[data-unit="' + openId + '"]');
      if (target) target.scrollIntoView({ block: 'nearest' });
    }
  }

  return { render: render };
})();
