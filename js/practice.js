/* ============================================================================
 * PRACTICE — "Practicar": focused, on-demand drilling (not the whole session).
 *   • Hablar de…  — pick a topic, write a few sentences with a live checklist.
 *   • Vocabulario — drill a category, your captured words, or the idioms, in
 *                   either direction (types-to-answer, grades your SRS).
 *   • A shortcut out to the Español app for fast flashcard/conjugation drills.
 * ========================================================================== */
window.Practice = (function () {
  var UI = window.UI;
  var ESPANOL_URL = 'https://matt-mccrea.github.io/Espanol-/';

  var CAT_LABEL = {
    greetings: 'Greetings', people: 'People', food: 'Food & drink', home: 'Home',
    time: 'Time & days', numbers: 'Numbers', colors: 'Colours', places: 'Places',
    travel: 'Travel', body: 'The body', nature: 'Nature', adjectives: 'Adjectives',
    weather: 'Weather', clothing: 'Clothing', animals: 'Animals', questions: 'Questions',
    connectors: 'Connectors', common: 'Everyday words', school: 'School', health: 'Health',
    shopping: 'Shopping', sports: 'Sports', kitchen: 'Kitchen', work: 'Work',
    technology: 'Technology', finance: 'Finance', career: 'Career', society: 'Society',
    professions: 'Professions', relationships: 'Relationships', bureaucracy: 'Bureaucracy'
  };
  function label(cat) { return CAT_LABEL[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1)); }

  var dir = (window.Profile && window.Profile.params().reviewDirection) || 'en2es';

  function pairsToCards(pairs, kind) {
    return pairs.map(function (p) {
      return dir === 'es2en'
        ? { id: kind.charAt(0) + ':' + p.es, front: p.es, back: p.en, kind: kind, hint: p.hint }
        : { id: kind.charAt(0) + ':' + p.es, front: p.en, back: p.es, kind: kind, hint: p.hint };
    });
  }

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Practicar'));
    wrap.appendChild(UI.el('p', 'muted', 'Quick, targeted drills — pick exactly what you want to work on.'));

    // ---- Hablar de… (talk about X) ----
    wrap.appendChild(UI.el('h3', null, 'Hablar de… (write about a topic)'));
    var topics = UI.el('div', 'chip-row');
    (window.TOPICS || []).forEach(function (t) {
      var c = UI.el('button', 'topic-chip', t.topic); c.type = 'button';
      c.addEventListener('click', function () { startTopic(t); });
      topics.appendChild(c);
    });
    wrap.appendChild(topics);

    // ---- Vocabulario por tema ----
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

    var chips = UI.el('div', 'chip-row');
    // your captured words first (what the user added)
    var capN = window.Capture ? window.Capture.count() : 0;
    if (capN) {
      var cc = UI.el('button', 'vocab-chip accent-chip', 'Tus palabras · ' + capN); cc.type = 'button';
      cc.addEventListener('click', function () { startCards(pairsToCardsCaptured(), 'Tus palabras'); });
      chips.appendChild(cc);
    }
    // categories with counts
    var byCat = {};
    (window.VOCAB || []).forEach(function (w) { (byCat[w.cat] = byCat[w.cat] || []).push(w); });
    Object.keys(byCat).sort(function (a, b) { return label(a).localeCompare(label(b)); }).forEach(function (cat) {
      var c = UI.el('button', 'vocab-chip', label(cat) + ' · ' + byCat[cat].length); c.type = 'button';
      c.addEventListener('click', function () { startCards(pairsToCards(byCat[cat], 'vocab'), label(cat)); });
      chips.appendChild(c);
    });
    // idioms
    if ((window.IDIOMS || []).length) {
      var ic = UI.el('button', 'vocab-chip', 'Expresiones · ' + window.IDIOMS.length); ic.type = 'button';
      ic.addEventListener('click', function () { startCards(pairsToCards(window.IDIOMS, 'idiom'), 'Expresiones'); });
      chips.appendChild(ic);
    }
    wrap.appendChild(chips);

    // ---- external drills ----
    wrap.appendChild(UI.el('h3', null, 'Fast drills'));
    var esp = UI.el('a', 'resource-item'); esp.href = ESPANOL_URL; esp.target = '_blank'; esp.rel = 'noopener noreferrer';
    esp.innerHTML = '<span class="res-label">Español — vocab & conjugation drills ↗</span><span class="res-note muted">the companion app: rapid flashcards, quizzes and full conjugation tables</span>';
    wrap.appendChild(esp);

    var home = UI.el('button', 'ghost-btn', '← Inicio'); home.type = 'button'; home.addEventListener('click', back);
    wrap.appendChild(home);
    host.appendChild(wrap);
  }

  function pairsToCardsCaptured() {
    return (window.Capture.cards() || []).map(function (c) {
      return dir === 'es2en' ? { id: c.id, front: c.back, back: c.front, kind: 'capture', hint: c.hint } : c;
    });
  }

  function backTo(host, back) { render(host, back); }

  function startCards(cards, title) {
    var host = document.getElementById('stage-host');
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h2', null, title));
    var deckHost = UI.el('div'); wrap.appendChild(deckHost);
    host.appendChild(wrap);
    if (!cards.length) { deckHost.appendChild(UI.el('p', 'muted', 'Nothing here yet.')); }
    else window.Deck.run(deckHost, cards, function (stats) {
      UI.clear(deckHost);
      deckHost.appendChild(UI.el('h3', null, 'Listo — ' + stats.correct + ' / ' + stats.seen));
      var again = UI.el('button', 'ghost-btn', '← Practicar'); again.type = 'button';
      again.addEventListener('click', function () { render(host, function () { window.App.go('home'); }); });
      deckHost.appendChild(again);
    });
  }

  function startTopic(t) {
    var host = document.getElementById('stage-host');
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('div', 'eyebrow', 'Hablar de… ' + t.topic));
    var body = UI.el('div'); wrap.appendChild(body);
    host.appendChild(wrap);
    window.Writer.mount(body, t, {
      counter: true, doneLabel: '← Practicar',
      onDone: function () { render(host, function () { window.App.go('home'); }); }
    });
  }

  return { render: render };
})();
