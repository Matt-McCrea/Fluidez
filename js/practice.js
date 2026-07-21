/* ============================================================================
 * PRACTICE — "Practicar": on-demand practice.
 *   • Hablar de…  — leveled topic prompts; finish one and the chip advances to
 *                   the next (harder) level on that topic. Free writing, not
 *                   a quiz, so it sits outside the selector below.
 *   • Everything quiz-like (mixed review, themed vocab, grammar-in-context,
 *     your worst items, what to test next) goes through window.Selector's
 *     5-option chooser — see js/selector.js.
 * ========================================================================== */
window.Practice = (function () {
  var UI = window.UI;
  var TLKEY = 'fluidez.topicLevel';

  function loadTL() { try { return JSON.parse(localStorage.getItem(TLKEY)) || {}; } catch (e) { return {}; } }
  function saveTL(o) { try { localStorage.setItem(TLKEY, JSON.stringify(o)); } catch (e) {} }
  function topicLevel(id) { return loadTL()[id] || 1; }

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Practicar'));
    wrap.appendChild(UI.el('p', 'muted', 'Quick, targeted practice — pick exactly what you want to work on.'));

    // ---- Hablar de… (leveled) ----
    wrap.appendChild(UI.el('h3', null, 'Hablar de… (write about a topic)'));
    var topics = UI.el('div', 'chip-row');
    (window.TOPICS || []).forEach(function (t) {
      var lvl = Math.min(topicLevel(t.id), t.prompts.length);
      var c = UI.el('button', 'topic-chip', t.topic + ' · L' + lvl + (lvl >= t.prompts.length ? ' ✓' : '')); c.type = 'button';
      c.addEventListener('click', function () { startTopic(t); });
      topics.appendChild(c);
    });
    wrap.appendChild(topics);

    // ---- everything quiz-like ----
    wrap.appendChild(UI.el('h3', null, 'Practicar (elige un modo)'));
    if (window.Selector) window.Selector.renderChooser(wrap);

    host.appendChild(wrap);
  }

  function backToMenu() { window.Shell.closeOverlay(); window.Shell.refresh('practicar'); }

  function startTopic(t) {
    window.Shell.openOverlay(false);
    var host = document.getElementById('stage-host');
    var lvl = Math.min(topicLevel(t.id), t.prompts.length);
    var pr = t.prompts[lvl - 1];
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('div', 'eyebrow', 'Hablar de… ' + t.topic + ' · L' + lvl));
    var body = UI.el('div'); wrap.appendChild(body);
    host.appendChild(wrap);
    window.Writer.mount(body, pr, {
      counter: true, doneLabel: (lvl < t.prompts.length ? 'Done — unlock L' + (lvl + 1) + ' →' : '← Practicar'),
      onDone: function () {
        if (lvl < t.prompts.length) { var tl = loadTL(); tl[t.id] = lvl + 1; saveTL(tl); }
        backToMenu();
      }
    });
  }

  return { render: render };
})();
