/* ============================================================================
 * STAGE 2 — APRENDER (Learn).
 * Today's grammar lesson, taught in full depth: explanation sections, a
 * meaning-contrast table, pitfalls, and examples. Ends with a quick active
 * check of the lesson's recall points, which are then enrolled into spaced
 * repetition so the *concept* resurfaces on later days.
 * ========================================================================== */
window.StageLearn = (function () {
  var UI = window.UI, S = window.SRS, C = window.Checker, E = window.ENGINE;

  // One verb conjugated in one tense: a two-column (person, form) table.
  function verbTable(inf, tk) {
    var v = E.verbByInf(inf); if (!v) return '';
    var persons = E.personsFor(tk), forms = E.conjugate(v, tk);
    var html = '<table class="conj-table"><thead><tr><th></th><th>' + inf + '</th></tr></thead><tbody>';
    persons.forEach(function (p, i) { html += '<tr><td class="person">' + p + '</td><td>' + forms[i] + '</td></tr>'; });
    return html + '</tbody></table>';
  }
  // A tabbed widget: [{label, html}]. First tab shown by default.
  function tabsWidget(items) {
    var wrap = UI.el('div', 'tabs'), bar = UI.el('div', 'tab-bar'), body = UI.el('div', 'tab-body');
    items.forEach(function (it, i) {
      var b = UI.el('button', 'tab-btn' + (i === 0 ? ' active' : ''), it.label); b.type = 'button';
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(bar.children, function (c) { c.classList.remove('active'); });
        b.classList.add('active'); body.innerHTML = it.html;
      });
      bar.appendChild(b);
    });
    body.innerHTML = items.length ? items[0].html : '';
    wrap.appendChild(bar); wrap.appendChild(body);
    return wrap;
  }

  function contrastTable(rows) {
    var html = '<table class="contrast-table"><thead><tr><th>Español</th><th>English</th><th></th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td class="es">' + r.es + '</td><td>' + r.en + '</td><td class="note">' + (r.note || '') + '</td></tr>';
    });
    return html + '</tbody></table>';
  }

  // Render a lesson's teaching content into `wrap` (no buttons). Shared with the
  // Grammar reference view so lessons read identically wherever they appear.
  function fillLesson(wrap, l) {
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
    if (l.conjTabs && l.conjTabs.verbs.length) {   // irregular conjugations under tabs
      wrap.appendChild(UI.el('h3', null, 'Irregular verbs in this tense (tap each)'));
      wrap.appendChild(tabsWidget(l.conjTabs.verbs.map(function (inf) {
        return { label: inf, html: verbTable(inf, l.conjTabs.tense) };
      })));
    }
    return wrap;
  }

  var CAT_LABEL = {
    greetings: 'Greetings & courtesy', people: 'People & family', food: 'Food & drink',
    numbers: 'Numbers', time: 'Time & days', colors: 'Colours', places: 'Places',
    home: 'Home & objects', body: 'The body', nature: 'Nature & weather', adjectives: 'Describing things',
    travel: 'Travel & transport', weather: 'Weather', clothing: 'Clothing', animals: 'Animals',
    questions: 'Question words', connectors: 'Linking words', common: 'Everyday words',
    school: 'School', health: 'Health', shopping: 'Shopping', sports: 'Sports', kitchen: 'Kitchen', work: 'Work'
  };
  function listTable(rows) {
    return '<table class="contrast-table"><tbody>' + rows.map(function (r) {
      return '<tr><td class="es">' + r[0] + '</td><td>' + r[1] + '</td></tr>';
    }).join('') + '</tbody></table>';
  }

  // Dispatch on the day's focus (beginners get vocab/verb/practice days too;
  // standard/refresher always get a grammar lesson).
  function run(host, ctx, done) {
    var f = ctx.focus || { type: 'grammar' };
    if (f.type === 'vocab') return teachVocab(host, ctx, f, done);
    if (f.type === 'verbs') return teachVerbs(host, ctx, f, done);
    if (f.type === 'practice') return teachPractice(host, ctx, done);
    var l = ctx.lesson;
    if (!l) { done(); return; }
    var wrap = fillLesson(UI.el('div', 'panel lesson'), l);
    wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheckItems(host, (l.recall || []).slice(), 'grammar', done); }));
    host.appendChild(wrap);
  }

  // ---- vocab day ----
  function teachVocab(host, ctx, f, done) {
    var words = (f.words || []).map(function (es) {
      var w = (window.VOCAB || []).filter(function (v) { return v.es === es; })[0];
      return w || { es: es, en: '' };
    });
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'New words · ' + (CAT_LABEL[f.cat] || f.cat)));
    wrap.appendChild(UI.el('p', 'muted', 'Learn these by meaning first. They join your review deck straight away.'));
    wrap.appendChild(UI.el('div', null, listTable(words.map(function (w) { return [w.es, w.en]; }))));
    words.forEach(function (w) { S.enrol('v:' + w.es); });
    var check = words.slice(0, 6).map(function (w) { return { id: 'v:' + w.es, front: w.es, back: w.en }; });
    wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheckItems(host, check, 'vocab', done); }));
    host.appendChild(wrap);
  }

  // ---- verbs day ----
  function teachVerbs(host, ctx, f, done) {
    var verbs = (f.verbs || []).map(function (inf) { return window.ENGINE.verbByInf(inf); }).filter(Boolean);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'New verbs'));
    wrap.appendChild(UI.el('p', 'muted', 'Meet these verbs by meaning. You\'ll conjugate them in the Aplicar and Producir stages as you learn each tense.'));
    wrap.appendChild(UI.el('div', null, listTable(verbs.map(function (v) { return [v.inf, v.en]; }))));
    verbs.forEach(function (v) { S.enrol('vm:' + v.inf); });
    var check = verbs.map(function (v) { return { id: 'vm:' + v.inf, front: v.inf, back: v.en }; });
    wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheckItems(host, check, 'verb', done); }));
    host.appendChild(wrap);
  }

  // ---- practice day (no new content) ----
  function teachPractice(host, ctx, done) {
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Practice & review day'));
    wrap.appendChild(UI.el('p', 'doc-summary', 'No new grammar today — a day to let what you\'ve met settle. Your review deck, the reading, and the exercises below all draw on things you already know.'));
    wrap.appendChild(UI.el('p', 'muted', 'Little and often beats cramming. Take it easy and enjoy noticing how much you already recognise.'));
    wrap.appendChild(UI.nextBtn('Continuar →', done));
    host.appendChild(wrap);
  }

  // Active recall over a set of items, enrolling them into review. `kind` tags
  // the error-log entries. Shared by grammar recall, vocab days and verb days.
  function quickCheckItems(host, items, kind, done) {
    items = (items || []).slice();
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
          id: it.id, front: it.front, back: it.back, kind: kind || 'grammar', source: 'learn', reviewable: false });
      });
    }
    show();
  }

  return { key: 'learn', label: 'Aprender', icon: '📖', run: run, fillLesson: fillLesson };
})();
