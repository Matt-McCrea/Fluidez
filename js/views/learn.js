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
  /* A lesson opens with two things the learner can read before any grammar:
   * what they will be able to say (`canDo`), and two lines of dialogue where
   * the thing is actually needed (`moment`). Both are optional — a lesson
   * without them renders exactly as it did before.
   *
   * The order matters and is the point: `summary` frequently opens with the
   * grammatical category ("-o is masculine and -a is feminine…"), which is an
   * answer to a question the learner has not yet been given a reason to ask.
   * The moment gives them the reason. */
  function fillOpening(wrap, l) {
    if (l.canDo) {
      wrap.appendChild(UI.el('p', 'lesson-cando',
        '<span class="cando-label">After this you can</span>' + l.canDo));
    }
    if (l.moment && l.moment.length) {
      var d = UI.el('div', 'lesson-moment');
      l.moment.forEach(function (line) {
        d.appendChild(UI.el('div', 'moment-line',
          '<span class="ex-es">' + line.es + '</span><span class="ex-en">' + line.en + '</span>'));
      });
      wrap.appendChild(d);
    }
  }

  // The closing half of the same idea: restate the can-do as achieved, and
  // offer the optional deep-dives rather than making the learner walk them.
  function fillClosing(wrap, l) {
    if (l.canDo) {
      wrap.appendChild(UI.el('p', 'lesson-nowyoucan',
        '<span class="cando-label">Now you can</span>' + l.canDo));
    }
    var deeper = (l.deeper || []).map(lessonTitle).filter(Boolean);
    if (deeper.length) {
      wrap.appendChild(UI.el('h3', null, 'Understand this better'));
      var ul = UI.el('ul', 'deeper-list');
      deeper.forEach(function (d) {
        var li = UI.el('li', null);
        /* There is no URL router — the app is tab-based (js/app.js) — so this
         * is a button into the Gramática reference, which already takes an
         * openId. A plain <a href="#/…"> would look like a link and do
         * nothing. */
        var b = UI.el('button', 'deeper-link', d.title);
        b.type = 'button';
        b.addEventListener('click', function () { window.Grammar.open(d.id); });
        li.appendChild(b);
        if (d.summary) li.appendChild(UI.el('span', 'muted', ' — ' + d.summary));
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    }
  }
  function lessonTitle(id) {
    // deeper targets are reference lessons, which are not in GRAMMAR_LESSONS
    var ls = window.ALL_LESSONS || window.GRAMMAR_LESSONS || [];
    for (var i = 0; i < ls.length; i++) {
      if (ls[i].id === id) {
        return { id: id, title: ls[i].title,
                 summary: (ls[i].summary || '').split('.')[0] };
      }
    }
    return null;
  }

  function fillLesson(wrap, l) {
    wrap.appendChild(UI.el('h1', null, l.title));
    fillOpening(wrap, l);
    wrap.appendChild(UI.el('p', 'doc-summary', l.summary));
    (l.sections || []).forEach(function (s) {
      wrap.appendChild(UI.el('h3', null, s.h));
      wrap.appendChild(UI.el('div', 'lesson-body', s.html));
    });
    if (l.contrasts && l.contrasts.length) {
      wrap.appendChild(UI.el('h3', null, 'Same words, different meaning'));
      wrap.appendChild(UI.el('div', null, contrastTable(l.contrasts)));
    }
    if (l.exponents && l.exponents.length) {
      // A function lesson's exponents are grouped BY REGISTER, because the
      // register contrast is the teaching point — an ungrouped list would read
      // as a vocabulary dump and teach the wrong thing.
      wrap.appendChild(UI.el('h3', null, 'Ways to say it — by register'));
      var order = (window.REGISTERS || []).map(function (r) { return r.id; });
      var groups = {};
      l.exponents.forEach(function (e) { (groups[e.register] = groups[e.register] || []).push(e); });
      order.filter(function (r) { return groups[r]; }).forEach(function (r) {
        var meta = (window.REGISTERS || []).filter(function (x) { return x.id === r; })[0] || { label: r, note: '' };
        wrap.appendChild(UI.el('h4', 'register-head', meta.label +
          (meta.note ? ' <span class="muted">— ' + meta.note + '</span>' : '')));
        wrap.appendChild(UI.el('div', null, contrastTable(groups[r].map(function (e) {
          return { es: e.es, en: e.en, note: e.note || '' };
        }))));
      });
    }
    if (l.moves && l.moves.length) {
      wrap.appendChild(UI.el('h3', null, 'How the text is built'));
      l.moves.forEach(function (m, i) {
        wrap.appendChild(UI.el('h4', 'register-head', (i + 1) + '. ' + m.h));
        wrap.appendChild(UI.el('div', 'lesson-body', m.html));
      });
    }
    if (l.model && l.model.text) {
      wrap.appendChild(UI.el('h3', null, 'A model' + (l.model.title ? ' — ' + l.model.title : '')));
      wrap.appendChild(UI.el('div', 'lesson-body model-text', l.model.text));
    }
    if (l.checklist && l.checklist.length) {
      wrap.appendChild(UI.el('h3', null, 'Before you send it'));
      var cl = UI.el('ul', 'pitfalls');
      l.checklist.forEach(function (c) { cl.appendChild(UI.el('li', null, c)); });
      wrap.appendChild(cl);
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
    fillClosing(wrap, l);
    speakify(wrap);
    return wrap;
  }

  /* Hang a speaker on every Spanish string in a rendered lesson, in one pass.
   * Doing it here rather than at each call site is what keeps it working for
   * blocks built as HTML strings (contrastTable, the exponent groups) as well
   * as ones built from elements. Silent no-op where the platform has no
   * Spanish voice — see js/speak.js. */
  function speakify(root) {
    if (!window.Speak || !window.Speak.available()) return;
    var sel = ['td.es', '.ex-es', '.moment-line .ex-es'].join(',');
    Array.prototype.forEach.call(root.querySelectorAll(sel), function (cell) {
      if (cell.querySelector('.speak-btn')) return;
      var b = window.Speak.button(function () {
        // read the cell WITHOUT the button's own emoji
        var t = cell.cloneNode(true);
        Array.prototype.forEach.call(t.querySelectorAll('.speak-btn'), function (x) { x.remove(); });
        return t.textContent;
      });
      if (b) cell.appendChild(b);
    });
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

  // Quick-check direction: production (type the Spanish) for standard/refresher;
  // recognition (Spanish shown, give the English) for beginners — matching how
  // their brand-new words start in the graduated daily review.
  function qcDir() {
    var d = window.Profile ? window.Profile.params().reviewDirection : 'en2es';
    return d === 'en2es' ? 'en2es' : 'es2en';
  }
  function qcItem(id, es, en) {
    return qcDir() === 'es2en' ? { id: id, front: es, back: en } : { id: id, front: en, back: es };
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
    /* Every probe gets asked. `srs:false` marks the ones that must not join the
     * review deck, not ones to skip — filtering here meant a comprehension
     * check written for the end of the lesson was silently dropped instead. */
    wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheckItems(host, l.recall || [], 'grammar', done); }));
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
    words.forEach(function (w) { S.enrol('v:' + w.es + ':meaning'); });
    var check = words.slice(0, 6).map(function (w) { return qcItem('v:' + w.es + ':meaning', w.es, w.en); });
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
    var check = verbs.map(function (v) { return qcItem('vm:' + v.inf, v.inf, v.en); });
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
        // srs:false items are comprehension checks, not review cards — asked
        // once, never enrolled, so they cannot come back weeks later as a miss
        var kept = items.filter(function (r) { return r.srs !== false; });
        kept.forEach(function (r) { S.enrol(r.id); });
        UI.clear(form);
        form.appendChild(UI.el('p', 'feedback good', kept.length
          ? '¡Hecho! ' + kept.length + (kept.length === 1 ? ' of these joins' : ' of these join') + ' your reviews.'
          : '¡Hecho!'));
        form.appendChild(UI.nextBtn('Continuar →', done));
        return;
      }
      var it = items[i];
      UI.clear(form);
      form.appendChild(UI.el('div', 'card-front small', it.front));
      var fb = UI.el('div', 'feedback');

      function next(good) {
        if (it.srs !== false) { S.enrol(it.id); if (!good) S.grade(it.id, false); }
        i++; show();
      }
      function logMiss() {
        if (window.ErrorLog) window.ErrorLog.record({   // log for the weak-spots view
          id: it.id, front: it.front, back: it.back, kind: kind || 'grammar', source: 'learn', reviewable: false });
      }

      /* A probe is asked the way it was written. An mcq that has lost its
       * options is not a harder question, it is an unanswerable one. */
      if (it.probe && it.probe.kind === 'mcq') {
        var opts = UI.el('div', 'mcq-opts');
        var answered = false;
        (it.probe.options || []).forEach(function (opt, oi) {
          var b = UI.el('button', 'mcq-btn', opt); b.type = 'button';
          b.addEventListener('click', function () {
            if (answered) return;
            answered = true;
            var right = oi === it.probe.answer;
            b.classList.add(right ? 'right' : 'wrong');
            if (!right) {
              logMiss();
              [].forEach.call(opts.children, function (c, ci) { if (ci === it.probe.answer) c.classList.add('right'); });
              fb.textContent = 'Not quite'; fb.className = 'feedback bad';
              form.appendChild(UI.nextBtn('Next →', function () { next(false); }));
            } else {
              fb.textContent = '¡Correcto!'; fb.className = 'feedback good';
              setTimeout(function () { next(true); }, 450);
            }
          });
          opts.appendChild(b);
        });
        form.appendChild(opts);
        form.appendChild(fb);
        return;
      }

      var input = UI.el('input', 'answer-input');
      input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
      var reveal = UI.el('button', 'ghost-btn', 'Reveal'); reveal.type = 'button';
      var revealed = false;
      form.appendChild(input);
      form.appendChild(UI.accentBar(function () { return input; }));
      form.appendChild(fb);
      form.appendChild(reveal);
      input.focus();

      // a cloze names every wording it will take; plain recall has one answer
      var accepted = (it.probe && it.probe.kind === 'cloze' && it.probe.accept) || it.back;

      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (revealed) { next(false); return; }
        var r = C.checkExact(input.value, accepted, { meaning: it.kind !== 'grammar' });
        if (r.pass) { fb.textContent = '¡Correcto!'; fb.className = 'feedback good'; setTimeout(function () { next(true); }, 300); }
        else { fb.textContent = r.near ? 'Nearly — accents' : 'Not quite'; fb.className = 'feedback bad'; }
      });
      reveal.addEventListener('click', function () {
        if (revealed) { next(false); return; }
        revealed = true; fb.textContent = it.back; fb.className = 'feedback reveal';
        reveal.textContent = 'Next →';
        logMiss();
      });
    }
    show();
  }

  return { key: 'learn', label: 'Aprender', icon: '📖', run: run, fillLesson: fillLesson };
})();
