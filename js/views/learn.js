/* ============================================================================
 * STAGE 2 — APRENDER (Learn).
 * Today's grammar lesson, taught in full depth: explanation sections, a
 * meaning-contrast table, pitfalls, and examples. Ends with a quick active
 * check of the lesson's recall points, which are then enrolled into spaced
 * repetition so the *concept* resurfaces on later days.
 * ========================================================================== */
window.StageLearn = (function () {
  var UI = window.UI, S = window.SRS, C = window.Checker;

  function contrastTable(rows) {
    var html = '<table class="contrast-table"><thead><tr><th>Español</th><th>English</th><th></th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td class="es">' + r.es + '</td><td>' + r.en + '</td><td class="note">' + (r.note || '') + '</td></tr>';
    });
    return html + '</tbody></table>';
  }

  function run(host, ctx, done) {
    var l = ctx.lesson;
    if (!l) { done(); return; }

    var wrap = UI.el('div', 'panel lesson');
    wrap.appendChild(UI.el('h1', null, l.title));
    wrap.appendChild(UI.el('p', 'doc-summary', l.summary));

    (l.sections || []).forEach(function (s) {
      wrap.appendChild(UI.el('h3', null, s.h));
      wrap.appendChild(UI.el('div', 'lesson-body', s.html));
    });

    if (l.contrasts && l.contrasts.length) {
      wrap.appendChild(UI.el('h3', null, 'Same words, different meaning'));
      wrap.appendChild(UI.el('div', null, contrastTable(l.contrasts)));
    }

    if (l.pitfalls && l.pitfalls.length) {
      wrap.appendChild(UI.el('h3', null, 'Watch out'));
      var ul = UI.el('ul', 'pitfalls');
      l.pitfalls.forEach(function (p) { ul.appendChild(UI.el('li', null, p)); });
      wrap.appendChild(ul);
    }

    if (l.examples && l.examples.length) {
      wrap.appendChild(UI.el('h3', null, 'In use'));
      var ex = UI.el('div', 'examples');
      l.examples.forEach(function (e) {
        ex.appendChild(UI.el('div', 'ex', '<span class="ex-es">' + e.es + '</span><span class="ex-en">' + e.en + '</span>'));
      });
      wrap.appendChild(ex);
    }

    wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheck(host, ctx, done); }));
    host.appendChild(wrap);
  }

  // Active recall of the lesson's key points before moving on (retrieval beats
  // re-reading), then enrol them so they come back in future reviews.
  function quickCheck(host, ctx, done) {
    var l = ctx.lesson;
    var items = (l.recall || []).slice();
    if (!items.length) { done(); return; }

    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h2', null, 'Quick check'));
    wrap.appendChild(UI.el('p', 'muted', 'Answer from memory — these join your review deck.'));

    var i = 0, form = UI.el('div');
    wrap.appendChild(form);
    host.appendChild(wrap);

    function show() {
      if (i >= items.length) {
        items.forEach(function (r) { S.enrol(r.id); });
        UI.clear(form);
        form.appendChild(UI.el('p', 'feedback good', '¡Hecho! These will come back in your reviews.'));
        form.appendChild(UI.nextBtn('Continuar →', done));
        return;
      }
      var it = items[i];
      UI.clear(form);
      form.appendChild(UI.el('div', 'card-front small', it.front));
      var input = UI.el('input', 'answer-input');
      input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
      var fb = UI.el('div', 'feedback');
      var reveal = UI.el('button', 'ghost-btn', 'Reveal'); reveal.type = 'button';
      var revealed = false;
      form.appendChild(input);
      form.appendChild(UI.accentBar(function () { return input; }));
      form.appendChild(fb);
      form.appendChild(reveal);
      input.focus();

      function next(good) { S.enrol(it.id); if (!good) S.grade(it.id, false); i++; show(); }

      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (revealed) { next(false); return; }
        var r = C.checkExact(input.value, it.back);
        if (r.pass) { fb.textContent = '¡Correcto!'; fb.className = 'feedback good'; setTimeout(function () { next(true); }, 300); }
        else { fb.textContent = r.near ? 'Nearly — accents' : 'Not quite'; fb.className = 'feedback bad'; }
      });
      reveal.addEventListener('click', function () {
        if (revealed) { next(false); return; }
        revealed = true; fb.textContent = it.back; fb.className = 'feedback reveal';
        reveal.textContent = 'Next →';
        if (window.ErrorLog) window.ErrorLog.record({   // already SRS; log for the weak-spots view
          id: it.id, front: it.front, back: it.back, kind: 'grammar', source: 'learn', reviewable: false });
      });
    }
    show();
  }

  return { key: 'learn', label: 'Aprender', icon: '📖', run: run };
})();
