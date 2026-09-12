/* ============================================================================
 * PROGRESS — the "Lecciones" tab: makes invisible progress visible.
 * Stat tiles, syllabus status, an SRS box distribution (single-hue magnitude
 * bars), a 10-week activity heatmap (single-hue presence over time), and your
 * weak spots from the error log. All data comes from localStorage — nothing
 * is computed on a server.
 * ========================================================================== */
window.Progress = (function () {
  var UI = window.UI, S = window.SRS;

  function loadProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }
  function loadSrs() { try { return JSON.parse(localStorage.getItem('fluidez.srs')) || {}; } catch (e) { return {}; } }
  var INTERVAL_LABELS = ['new', '1d', '2d', '4d', '8d', '16d', '32d', '64d'];

  function dayNumOf(d) { return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); }

  // ---- lesson catalogue builders (all profiles can DO any of these) --------
  var VOCAB_ORDER = ['greetings', 'people', 'food', 'numbers', 'time', 'colors',
    'places', 'home', 'body', 'nature', 'adjectives', 'travel', 'weather',
    'clothing', 'animals', 'questions', 'connectors', 'common', 'school',
    'health', 'shopping', 'sports', 'kitchen', 'work', 'technology', 'finance',
    'career', 'professions', 'relationships', 'society', 'bureaucracy'];
  var CAT_LABEL = {
    greetings: 'Greetings', people: 'People & family', food: 'Food & drink', home: 'Home',
    time: 'Time & days', numbers: 'Numbers', colors: 'Colours', places: 'Places',
    travel: 'Travel', body: 'The body', nature: 'Nature', adjectives: 'Describing things',
    weather: 'Weather', clothing: 'Clothing', animals: 'Animals', questions: 'Question words',
    connectors: 'Linking words', common: 'Everyday words', school: 'School', health: 'Health',
    shopping: 'Shopping', sports: 'Sports', kitchen: 'Kitchen', work: 'Work',
    technology: 'Technology', finance: 'Finance', career: 'Career', professions: 'Professions',
    relationships: 'Relationships', society: 'Society', bureaucracy: 'Bureaucracy'
  };
  function chunk(a, n) { var o = []; for (var i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; }
  function label(c) { return CAT_LABEL[c] || c; }

  function vocabLessons() {
    var byCat = {};
    (window.VOCAB || []).forEach(function (w) { (byCat[w.cat] = byCat[w.cat] || []).push(w.es); });
    var cats = (window.TAXONOMY ? window.TAXONOMY.vocabOrder(window.VOCAB || []) : [])
      .filter(function (c) { return byCat[c]; });
    Object.keys(byCat).forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); });
    var out = [];
    cats.forEach(function (c) {
      var parts = chunk(byCat[c], 12);
      parts.forEach(function (words, i) {
        out.push({ cat: c, words: words, title: 'New words · ' + label(c) + (parts.length > 1 ? ' ' + (i + 1) : '') });
      });
    });
    return out;
  }
  function verbLessons() {
    var E = window.ENGINE, seen = {}, order = [];
    ['hablar', 'trabajar', 'estudiar', 'comer', 'beber', 'vivir', 'aprender', 'escribir'].forEach(function (inf) {
      if (E.verbByInf(inf) && !seen[inf]) { seen[inf] = 1; order.push(inf); }
    });
    (window.VERBS || []).forEach(function (v) { if (!seen[v.inf]) { seen[v.inf] = 1; order.push(v.inf); } });
    return chunk(order, 5);
  }

  function tile(num, label) {
    var t = UI.el('div', 'stat-tile');
    t.appendChild(UI.el('div', 'stat-num', String(num)));
    t.appendChild(UI.el('div', 'stat-lbl muted', label));
    return t;
  }

  function render(host, back) {
    if (window.Perf) return window.Perf.mark('progreso render', function () { return renderInner(host, back); });
    return renderInner(host, back);
  }
  function renderInner(host, back) {
    UI.clear(host);
    var p = loadProg(), srs = loadSrs();
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Lecciones'));

    // ---- stat tiles ----
    var ids = Object.keys(srs);
    var wordsKnown = ids.filter(function (k) { return /^(v:|cap:)/.test(k); }).length;
    var due = window.Hub ? S.dueCount(window.Hub.reviewPool()) : 0;
    var tiles = UI.el('div', 'stat-row');
    tiles.appendChild(tile('🔥 ' + (p.streak || 0), 'day streak'));
    tiles.appendChild(tile(p.total || 0, 'sessions done'));
    tiles.appendChild(tile(wordsKnown, 'words learned'));
    tiles.appendChild(tile(due, 'due today'));
    wrap.appendChild(tiles);

    // ---- lesson catalogue: DO any lesson (grammar first, then vocab & verbs) --
    var studied = p.studied || {};
    var lessons = window.GRAMMAR_LESSONS || [];
    var nextIdx = lessons.findIndex(function (l) { return !studied[l.id]; });
    function reRender() { window.Shell.closeOverlay(); render(host, back); }

    /* ---- the catalogue -------------------------------------------------
     * Three sections, in this order:
     *   TU CURSO       level -> unit -> lesson, which is how the course is
     *                  actually built now (data/course.js)
     *   GRAMÁTICA      the same lessons reached the other way — by tense
     *                  first, then by the other things grammar is about
     *   VOCABULARIO / VERBOS
     *
     * The old "ruta diaria" is gone. It was a flat list of every day in the
     * band, which is what units replaced — a learner scrolling 95 undifferen-
     * tiated rows cannot see what any of it is for, which is the whole
     * problem the units were introduced to fix. */

    // ---- TU CURSO: level -> unit -> lesson -------------------------------
    wrap.appendChild(UI.el('h3', null, 'Tu curso'));
    wrap.appendChild(UI.el('p', 'muted small',
      'Every lesson, in the order the course teaches them. Tap any one to take it — nothing is locked.'));

    var UNITS = window.COURSE_UNITS || {};
    var DAYS = window.COURSE_DAYS || [];
    var here = (window.Profile && window.Profile.params().cefr) || 'A1';
    var byId = {};
    lessons.forEach(function (l) { byId[l.id] = l; });

    function lessonRow(id, mark) {
      var l = byId[id];
      var row = UI.el('button', 'syl-row ' + (studied[id] ? 'done' : 'open'));
      row.type = 'button';
      row.innerHTML = '<span class="syl-mark">' + (studied[id] ? '✓' : (mark || '·')) + '</span>' +
        '<span class="syl-title">' + (l ? l.title : id) + '</span>' +
        '<span class="syl-level muted">' + (l && l.canDo ? '' : '') + '›</span>';
      row.addEventListener('click', function () {
        window.Shell.openOverlay(); window.LessonRun.run({ type: 'grammar', id: id }, reRender);
      });
      return row;
    }

    ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(function (band) {
      var us = Object.keys(UNITS).map(function (k) { return UNITS[k]; })
        .filter(function (u) { return u.band === band && !u.optional; })
        .sort(function (a, b) { return a.from - b.from; });
      if (!us.length) return;

      var total = 0, done = 0;
      us.forEach(function (u) {
        DAYS.slice(u.from, u.from + u.length).forEach(function (d) {
          if (!d.lesson) return; total++; if (studied[d.lesson]) done++;
        });
      });

      var bandDet = UI.el('details', 'catalog-more band-det' + (band === here ? ' band-here' : ''));
      if (band === here) bandDet.setAttribute('open', 'open');
      bandDet.appendChild(UI.el('summary', null,
        band + ' — ' + us.length + ' unidades · ' + done + '/' + total + ' lecciones'));

      us.forEach(function (u) {
        var ids = DAYS.slice(u.from, u.from + u.length)
          .filter(function (d) { return !!d.lesson; }).map(function (d) { return d.lesson; });
        var uDone = ids.filter(function (i) { return studied[i]; }).length;

        var uDet = UI.el('details', 'unit-det');
        uDet.appendChild(UI.el('summary', null,
          '<span class="unit-det-title">' + u.title + '</span>' +
          '<span class="unit-det-n muted">' + uDone + '/' + ids.length + '</span>'));
        if (u.goal) uDet.appendChild(UI.el('div', 'unit-det-goal muted', u.goal));
        var syl = UI.el('div', 'syllabus');
        ids.forEach(function (id) { syl.appendChild(lessonRow(id)); });
        uDet.appendChild(syl);
        bandDet.appendChild(uDet);
      });
      wrap.appendChild(bandDet);
    });

    // ---- GRAMÁTICA: by tense, then by everything else --------------------
    wrap.appendChild(UI.el('h3', null, 'Gramática'));
    wrap.appendChild(UI.el('p', 'muted small',
      'The same lessons reached a different way — by what they are about rather than by when they are taught.'));

    var E2 = window.ENGINE;
    var TENSE_ORDER = ['presente', 'preterito', 'imperfecto', 'perfecto', 'plusc',
      'futuro', 'futperf', 'condicional', 'condperf',
      'presubj', 'perfsubj', 'impsubj', 'imperativo', 'impneg'];

    var tenseDet = UI.el('details', 'catalog-more');
    tenseDet.appendChild(UI.el('summary', null, 'Por tiempo verbal'));
    var tl = UI.el('div', 'syllabus');
    TENSE_ORDER.forEach(function (tk) {
      var l = byId[tk]; if (!l) return;
      tl.appendChild(lessonRow(tk, '⏱'));
    });
    tenseDet.appendChild(tl);
    wrap.appendChild(tenseDet);

    /* Everything else grammar is about. Derived from the id because the
     * lessons carry no sub-topic tag; the buckets are ordered so the ones a
     * learner asks about most sit at the top. */
    var ASPECTS = [
      ['Sustantivos y artículos', /(sustantiv|genero|numero|articulo|nombres|escuetos|masculino)/],
      ['Adjetivos y determinantes', /(adjetiv|posesiv|demostrativ|cuantificador|numeral|indefinid)/],
      ['Pronombres y relativos', /(pronombre|objeto|atonos|tonicos|relativ|interrogativ|exclamativ|quien|el-que)/],
      ['Adverbios', /adverbio/],
      ['Oraciones y subordinadas', /(subordinad|oracion|causal|concesiv|condicional|consecutiv|temporal|final|comparativ|modalidad|restrictiv|concordancia)/],
      ['Formas verbales y perífrasis', /(perifrasis|formas-no-personales|gerundio|infinitivo|participio|imperativo|nucleo-verbal|se-multiuso|pronombre-se|complement)/]
    ];
    var placed = {};
    ASPECTS.forEach(function (a) {
      var name = a[0], re = a[1];
      var hits = lessons.filter(function (l) {
        if ((l.strand || 'grammar') !== 'grammar') return false;
        if (TENSE_ORDER.indexOf(l.id) !== -1) return false;
        if (placed[l.id]) return false;
        return re.test(l.id);
      });
      if (!hits.length) return;
      hits.forEach(function (l) { placed[l.id] = 1; });
      var d = UI.el('details', 'catalog-more');
      d.appendChild(UI.el('summary', null, name + ' — ' + hits.length));
      var s2 = UI.el('div', 'syllabus');
      hits.forEach(function (l) { s2.appendChild(lessonRow(l.id)); });
      d.appendChild(s2); wrap.appendChild(d);
    });

    // ---- VOCABULARIO ------------------------------------------------------
    wrap.appendChild(UI.el('h3', null, 'Vocabulario'));
    var vd = UI.el('details', 'catalog-more');
    vd.appendChild(UI.el('summary', null, 'Vocabulary lessons'));
    var vlist = UI.el('div', 'syllabus');
    vocabLessons().forEach(function (v) {
      var row = UI.el('button', 'syl-row'); row.type = 'button';
      row.innerHTML = '<span class="syl-mark">📇</span><span class="syl-title">' + v.title + '</span><span class="syl-level muted">' + v.words.length + ' ›</span>';
      row.addEventListener('click', function () { window.Shell.openOverlay(); window.LessonRun.run({ type: 'vocab', cat: v.cat, words: v.words }, reRender); });
      vlist.appendChild(row);
    });
    vd.appendChild(vlist); wrap.appendChild(vd);

    // ---- VERBOS -----------------------------------------------------------
    wrap.appendChild(UI.el('h3', null, 'Verbos'));
    var rd = UI.el('details', 'catalog-more');
    rd.appendChild(UI.el('summary', null, 'Verb lessons'));
    var rlist = UI.el('div', 'syllabus');
    verbLessons().forEach(function (grp) {
      var row = UI.el('button', 'syl-row'); row.type = 'button';
      row.innerHTML = '<span class="syl-mark">🔤</span><span class="syl-title">' + grp.slice(0, 4).join(', ') + (grp.length > 4 ? '…' : '') + '</span><span class="syl-level muted">' + grp.length + ' ›</span>';
      row.addEventListener('click', function () { window.Shell.openOverlay(); window.LessonRun.run({ type: 'verbs', verbs: grp }, reRender); });
      rlist.appendChild(row);
    });
    rd.appendChild(rlist); wrap.appendChild(rd);


    // ---- SRS box distribution (single-hue magnitude bars) ----
    wrap.appendChild(UI.el('h3', null, 'Memory strength'));
    var boxes = [0, 0, 0, 0, 0, 0, 0, 0];
    ids.forEach(function (k) { var b = srs[k].box || 0; boxes[Math.min(b, 7)]++; });
    var maxBox = Math.max(1, Math.max.apply(null, boxes));
    var dist = UI.el('div', 'box-dist');
    boxes.forEach(function (n, b) {
      var rowb = UI.el('div', 'box-row');
      rowb.appendChild(UI.el('span', 'box-lbl muted', INTERVAL_LABELS[b]));
      var track = UI.el('div', 'box-track');
      var fill = UI.el('div', 'box-fill'); fill.style.width = Math.round(100 * n / maxBox) + '%';
      track.appendChild(fill);
      rowb.appendChild(track);
      rowb.appendChild(UI.el('span', 'box-n muted', String(n)));
      dist.appendChild(rowb);
    });
    wrap.appendChild(dist);
    wrap.appendChild(UI.el('p', 'muted small', 'Cards move right as you keep getting them right — “new” are fragile, “64d” are close to permanent.'));

    // ---- activity heatmap (10 weeks, single-hue presence) ----
    wrap.appendChild(UI.el('h3', null, 'Activity'));
    var active = {};
    (p.history || []).forEach(function (d) { active[d] = 1; });
    var today = new Date();
    // start on the Monday of 9 weeks ago so columns are whole weeks
    var WEEKS = 10;
    var startOffset = ((today.getDay() + 6) % 7) + (WEEKS - 1) * 7;   // days back to that Monday
    var grid = UI.el('div', 'heatmap');
    for (var w = 0; w < WEEKS; w++) {
      var col = UI.el('div', 'hm-col');
      for (var dow = 0; dow < 7; dow++) {
        var d = new Date(today); d.setDate(today.getDate() - startOffset + w * 7 + dow);
        var cell = UI.el('div', 'hm-cell' + (d > today ? ' future' : (active[dayNumOf(d)] ? ' on' : '')));
        cell.title = d.toISOString().slice(0, 10);
        col.appendChild(cell);
      }
      grid.appendChild(col);
    }
    wrap.appendChild(grid);

    // ---- weak spots ----
    var errs = window.ErrorLog ? window.ErrorLog.list() : [];
    wrap.appendChild(UI.el('h3', null, 'Weak spots'));
    if (!errs.length) wrap.appendChild(UI.el('p', 'muted', 'None logged yet — mistakes you make show up here.'));
    else {
      var top = UI.el('div', 'weak-list');
      errs.slice(0, 8).forEach(function (e) {
        var row = UI.el('div', 'weak-row');
        row.appendChild(UI.el('span', 'weak-front', e.front));
        row.appendChild(UI.el('span', 'weak-back muted', e.back));
        row.appendChild(UI.el('span', 'weak-count', '×' + e.count));
        // add-from-anywhere: save a missed vocab pair into Palabras
        if (e.es && e.en && window.UserWords) row.appendChild(window.UserWords.addChip(e.es, e.en, 'mios'));
        top.appendChild(row);
      });
      wrap.appendChild(top);
      if (errs.some(function (e) { return e.reviewable; })) {
        var drill = UI.el('button', 'ghost-btn', 'Drill your errors →'); drill.type = 'button';
        drill.addEventListener('click', function () { window.App.go('errors'); });
        wrap.appendChild(drill);
      }
    }

    host.appendChild(wrap);
  }

  return { render: render, vocabLessons: vocabLessons, verbLessons: verbLessons };
})();
