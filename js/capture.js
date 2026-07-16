/* ============================================================================
 * CAPTURE — words & phrases you meet in the wild.
 *
 * You already swim in real Spanish (podcasts, TV, friends). This is where you
 * consolidate it: paste a word/phrase you heard, and it enrols into the SRS so
 * it comes back in your daily Review. Turns passive input into active recall.
 *
 * Store (localStorage 'fluidez.captured'): [{ es, en, note, day }]
 * Module = store + its own view (window.Capture).
 * ========================================================================== */
window.Capture = (function () {
  var KEY = 'fluidez.captured';
  var UI = window.UI, S = window.SRS;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function idFor(es) { return 'cap:' + es; }

  function add(es, en, note) {
    es = (es || '').trim(); en = (en || '').trim();
    if (!es || !en) return false;
    var a = load();
    if (a.some(function (w) { return w.es === es; })) return false;   // no dupes
    a.push({ es: es, en: en, note: (note || '').trim(), day: S ? S.today() : 0 });
    save(a);
    if (S) S.enrol(idFor(es));
    return true;
  }
  function remove(es) { save(load().filter(function (w) { return w.es !== es; })); }

  function cards() {
    return load().map(function (w) {
      return { id: idFor(w.es), front: w.en, back: w.es, kind: 'capture', hint: w.note || null };
    });
  }
  function count() { return load().length; }

  // ---- view --------------------------------------------------------------
  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Añadir palabras'));
    wrap.appendChild(UI.el('p', 'muted', 'Heard a word on a podcast or from a friend? Add it here — it joins your review deck and comes back at spaced intervals.'));

    var form = UI.el('div', 'capture-form');
    var esIn = UI.el('input', 'answer-input wide'); esIn.type = 'text'; esIn.placeholder = 'español (e.g. madrugar)'; esIn.spellcheck = false;
    var enIn = UI.el('input', 'answer-input wide'); enIn.type = 'text'; enIn.placeholder = 'English (e.g. to get up early)';
    var noteIn = UI.el('input', 'answer-input wide'); noteIn.type = 'text'; noteIn.placeholder = 'note / context (optional)';
    form.appendChild(UI.el('label', 'field-label', 'Spanish')); form.appendChild(esIn);
    form.appendChild(UI.accentBar(function () { return document.activeElement && document.activeElement.tagName === 'INPUT' ? document.activeElement : esIn; }));
    form.appendChild(UI.el('label', 'field-label', 'English')); form.appendChild(enIn);
    form.appendChild(UI.el('label', 'field-label', 'Note')); form.appendChild(noteIn);
    var fb = UI.el('div', 'feedback');
    var addB = UI.nextBtn('Add to my deck', function () {
      if (add(esIn.value, enIn.value, noteIn.value)) {
        fb.textContent = '¡Añadido! “' + esIn.value.trim() + '” is in your review deck.';
        fb.className = 'feedback good';
        esIn.value = enIn.value = noteIn.value = ''; esIn.focus();
        renderList();
      } else {
        fb.textContent = 'Need both Spanish and English (and no duplicates).';
        fb.className = 'feedback bad';
      }
    });
    form.appendChild(fb); form.appendChild(addB);
    wrap.appendChild(form);

    var listWrap = UI.el('div', 'capture-list');
    wrap.appendChild(UI.el('h3', null, 'Your words (' + count() + ')'));
    wrap.appendChild(listWrap);

    function renderList() {
      UI.clear(listWrap);
      var a = load();
      if (!a.length) { listWrap.appendChild(UI.el('p', 'muted', 'Nothing captured yet.')); return; }
      a.slice().reverse().forEach(function (w) {
        var row = UI.el('div', 'capture-row');
        row.appendChild(UI.el('span', 'cap-es', w.es));
        row.appendChild(UI.el('span', 'cap-en muted', w.en + (w.note ? ' · ' + w.note : '')));
        var del = UI.el('button', 'mini-btn', '✕'); del.type = 'button';
        del.addEventListener('click', function () { remove(w.es); renderList(); });
        row.appendChild(del);
        listWrap.appendChild(row);
      });
    }
    renderList();

    var home = UI.el('button', 'ghost-btn', '← Inicio'); home.type = 'button';
    home.addEventListener('click', back);
    wrap.appendChild(home);
    host.appendChild(wrap);
    esIn.focus();
  }

  return { add: add, remove: remove, cards: cards, count: count, render: render };
})();
