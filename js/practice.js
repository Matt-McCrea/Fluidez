/* ============================================================================
 * PRACTICE — "Practicar": focused, on-demand drilling (not the whole session).
 *   • Hablar de…  — leveled topic prompts; finish one and the chip advances to
 *                   the next (harder) level on that topic.
 *   • Gramática    — drill a tense in context (cloze), types-to-answer.
 *   • Vocabulario  — themed word sets (grouped so quizzes aren't tiny), your
 *                   captured words, or the idioms, in either direction.
 * ========================================================================== */
window.Practice = (function () {
  var UI = window.UI, E = window.ENGINE;
  var TLKEY = 'fluidez.topicLevel';

  // Themed vocab groups (pool several categories so every quiz has enough words).
  var GROUPS = [
    ['Greetings', ['greetings']],
    ['People & family', ['people', 'relationships']],
    ['Food & drink', ['food', 'kitchen']],
    ['Home', ['home']],
    ['Time & numbers', ['time', 'numbers']],
    ['Colours & describing', ['colors', 'adjectives']],
    ['Places & travel', ['places', 'travel']],
    ['Body & health', ['body', 'health']],
    ['Nature & weather', ['nature', 'weather', 'animals']],
    ['Questions & little words', ['questions', 'connectors', 'common']],
    ['Work & money', ['work', 'career', 'finance', 'professions']],
    ['School & study', ['school']],
    ['Shopping & clothing', ['shopping', 'clothing']],
    ['Sports', ['sports']],
    ['Technology', ['technology']],
    ['Society', ['society', 'bureaucracy']]
  ];

  // default drill direction: recognition for beginners, production otherwise
  var dir = (window.Profile && window.Profile.current() === 'beginner') ? 'es2en' : 'en2es';

  function loadTL() { try { return JSON.parse(localStorage.getItem(TLKEY)) || {}; } catch (e) { return {}; } }
  function saveTL(o) { try { localStorage.setItem(TLKEY, JSON.stringify(o)); } catch (e) {} }
  function topicLevel(id) { return loadTL()[id] || 1; }

  function pairsToCards(pairs, kind) {
    return pairs.map(function (p) {
      return dir === 'es2en'
        ? { id: kind.charAt(0) + ':' + p.es, front: p.es, back: p.en, kind: kind, hint: p.hint }
        : { id: kind.charAt(0) + ':' + p.es, front: p.en, back: p.es, kind: kind, hint: p.hint };
    });
  }
  function capturedCards() {
    return (window.Capture ? window.Capture.cards() : []).map(function (c) {
      return dir === 'es2en' ? { id: c.id, front: c.back, back: c.front, kind: 'capture', hint: c.hint } : c;
    });
  }
  // contextual conjugation cards for a tense, from the cloze bank
  function grammarCards(tense) {
    return (window.APPLY_ITEMS || []).filter(function (it) { return it.type === 'cloze' && it.tense === tense; })
      .map(function (it) {
        var v = E.verbByInf(it.inf); if (!v) return null;
        var ans = E.conjugate(v, it.tense)[E.personsFor(it.tense).indexOf(it.person)];
        if (!ans) return null;
        return { id: 'gd:' + E.normalize(it.text), front: it.text.replace('___', '＿＿＿') + '   [' + it.inf + ']', back: ans, kind: 'conj' };
      }).filter(Boolean);
  }

  function chipRow() { return UI.el('div', 'chip-row'); }

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Practicar'));
    wrap.appendChild(UI.el('p', 'muted', 'Quick, targeted drills — pick exactly what you want to work on.'));

    // ---- Hablar de… (leveled) ----
    wrap.appendChild(UI.el('h3', null, 'Hablar de… (write about a topic)'));
    var topics = chipRow();
    (window.TOPICS || []).forEach(function (t) {
      var lvl = Math.min(topicLevel(t.id), t.prompts.length);
      var c = UI.el('button', 'topic-chip', t.topic + ' · L' + lvl + (lvl >= t.prompts.length ? ' ✓' : '')); c.type = 'button';
      c.addEventListener('click', function () { startTopic(t); });
      topics.appendChild(c);
    });
    wrap.appendChild(topics);

    // ---- Gramática (contextual conjugation drills by tense) ----
    wrap.appendChild(UI.el('h3', null, 'Gramática (conjugate in context)'));
    var gchips = chipRow();
    E.TENSES.forEach(function (t) {
      var n = grammarCards(t.key).length;
      if (!n) return;
      var c = UI.el('button', 'topic-chip', E.TENSE_LABEL[t.key] + ' · ' + n); c.type = 'button';
      c.addEventListener('click', function () { startCards(grammarCards(t.key), E.TENSE_LABEL[t.key]); });
      gchips.appendChild(c);
    });
    wrap.appendChild(gchips);

    // ---- Vocabulario (grouped themes + direction) ----
    wrap.appendChild(UI.el('h3', null, 'Vocabulario'));
    var dirBar = UI.el('div', 'profile-bar muted');
    dirBar.appendChild(UI.el('span', null, 'Direction:'));
    var seg = UI.el('div', 'segmented');
    [['en2es', 'EN → ES'], ['es2en', 'ES → EN']].forEach(function (o) {
      var b = UI.el('button', 'seg' + (dir === o[0] ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () { dir = o[0]; render(host, back); });
      seg.appendChild(b);
    });
    dirBar.appendChild(seg);
    wrap.appendChild(dirBar);

    var chips = chipRow();
    var capN = window.Capture ? window.Capture.count() : 0;
    if (capN) {
      var cc = UI.el('button', 'vocab-chip accent-chip', 'Tus palabras · ' + capN); cc.type = 'button';
      cc.addEventListener('click', function () { startCards(capturedCards(), 'Tus palabras'); });
      chips.appendChild(cc);
    }
    var byCat = {};
    (window.VOCAB || []).forEach(function (w) { (byCat[w.cat] = byCat[w.cat] || []).push(w); });
    GROUPS.forEach(function (g) {
      var pool = [];
      g[1].forEach(function (cat) { if (byCat[cat]) pool = pool.concat(byCat[cat]); });
      if (!pool.length) return;
      var c = UI.el('button', 'vocab-chip', g[0] + ' · ' + pool.length); c.type = 'button';
      c.addEventListener('click', function () { startCards(pairsToCards(pool, 'vocab'), g[0]); });
      chips.appendChild(c);
    });
    if ((window.IDIOMS || []).length) {
      var ic = UI.el('button', 'vocab-chip', 'Expresiones · ' + window.IDIOMS.length); ic.type = 'button';
      ic.addEventListener('click', function () { startCards(pairsToCards(window.IDIOMS, 'idiom'), 'Expresiones'); });
      chips.appendChild(ic);
    }
    wrap.appendChild(chips);

    host.appendChild(wrap);
  }

  function backToMenu() { window.Shell.closeOverlay(); window.Shell.refresh('practicar'); }

  function startCards(cards, title) {
    window.Shell.openOverlay(false);
    var host = document.getElementById('stage-host');
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h2', null, title));
    var deckHost = UI.el('div'); wrap.appendChild(deckHost);
    host.appendChild(wrap);
    if (!cards.length) { deckHost.appendChild(UI.el('p', 'muted', 'Nothing here yet.')); return; }
    window.Deck.run(deckHost, cards, function (stats) {
      UI.clear(deckHost);
      deckHost.appendChild(UI.el('h3', null, 'Listo — ' + stats.correct + ' / ' + stats.seen));
      var again = UI.el('button', 'ghost-btn', '← Practicar'); again.type = 'button';
      again.addEventListener('click', backToMenu);
      deckHost.appendChild(again);
    });
  }

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
