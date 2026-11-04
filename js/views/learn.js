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
  function fillOpening(wrap, l, opts) {
    if (l.canDo && !(opts && opts.fold)) {
      wrap.appendChild(UI.el('p', 'lesson-cando',
        '<span class="cando-label">After this you can</span> ' + l.canDo));
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
  function fillClosing(wrap, l, opts) {
    if (l.canDo && !(opts && opts.fold)) {
      wrap.appendChild(UI.el('p', 'lesson-nowyoucan',
        '<span class="cando-label">Now you can</span> ' + l.canDo));
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
        if (d.summary) li.appendChild(UI.el('span', 'muted', ': ' + d.summary));
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

  /* The words this lesson is made of, translated, before any explanation of
   * them. A learner who does not read Spanish cannot pick the meaning of
   * `rojo` out of a sentence about how colour adjectives agree — and the
   * lesson that names nine colours and glosses none of them was teaching
   * nothing to exactly the person it is written for. Two columns, so the
   * speaker buttons attach (speakify hangs them on td.es). */
  function keywordTable(rows) {
    var html = '<table class="contrast-table keyword-table"><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td class="es">' + r.es + '</td><td>' + r.en + '</td></tr>';
    });
    return html + '</tbody></table>';
  }

  /* ---- one guess, before the explanation ----------------------------------
   * A lesson was: read all of it, then answer questions about it. That is the
   * wrong way round for the part that matters. Attempting something before
   * being taught it — and getting it wrong — measurably improves what the
   * explanation then sticks to, which is why this is framed as a guess and
   * not a test. Nothing is hidden behind it and nothing is scored: scroll
   * past and the lesson is exactly as it was.
   *
   * It uses a probe the lesson already carries, so this adds no content and
   * the same question comes back properly in the quick check at the end —
   * which is the second half of the effect, not a duplication bug. */
  function guessBlock(l) {
    var probes = (l.probes || []).filter(function (p) {
      return p.kind === 'mcq' && p.options && p.options.length > 1 && p.answer != null;
    });
    if (!probes.length) return null;
    /* Not probes[0]. The first probe usually tests the first thing the lesson
     * teaches, and the section directly above this block has just taught it —
     * so the "guess" is a reading-comprehension question with the answer two
     * lines up. One from the middle is about material still to come, which is
     * the whole point of guessing. */
    var p = probes[Math.floor(probes.length / 2)];

    var box = UI.el('div', 'guess');
    box.appendChild(UI.el('div', 'guess-eyebrow', UI.t('Antes de seguir', 'Have a guess first')));
    box.appendChild(UI.el('p', 'guess-q', p.q));

    var opts = UI.el('div', 'mcq-opts');
    var answered = false;
    p.options.forEach(function (text, i) {
      var b = UI.el('button', 'mcq-btn', text);
      b.type = 'button';
      b.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        var right = i === p.answer;
        Array.prototype.forEach.call(opts.children, function (btn, j) {
          if (j === p.answer) btn.classList.add('right');
          else if (j === i) btn.classList.add('wrong');
          btn.disabled = true;
        });
        box.appendChild(UI.el('p', 'guess-after' + (right ? ' good' : ''),
          right ? UI.t('Eso es. Sigue leyendo para ver por qué.',
                       'That is it. Read on for why.')
                : UI.t('No pasa nada, para eso es la lección. Sigue leyendo.',
                       'No matter, that is what the lesson is for. Read on.')));
      });
      opts.appendChild(b);
    });
    box.appendChild(opts);
    return box;
  }

  function fillLesson(wrap, l, opts) {
    if (!(opts && opts.fold)) wrap.appendChild(UI.el('h1', null, l.title));
    fillOpening(wrap, l, opts);
    wrap.appendChild(UI.el('p', 'doc-summary', l.summary));
    if (l.keywords && l.keywords.length) {
      wrap.appendChild(UI.el('h3', null, 'The words you need'));
      wrap.appendChild(UI.el('div', null, keywordTable(l.keywords)));
    }
    /* After the first section: the learner has met the words and seen one
     * explanation, which is enough to have an opinion and not enough to be
     * sure. Only in a lesson being TAKEN — the grammar browser is a
     * reference, and being quizzed on a page you opened to look something up
     * is just an obstacle. */
    var guessAt = (opts && opts.interactive) ? 1 : -1;
    (l.sections || []).forEach(function (s, i) {
      wrap.appendChild(UI.el('h3', null, s.h));
      wrap.appendChild(UI.el('div', 'lesson-body', s.html));
      if (i === guessAt - 1) {
        var g = guessBlock(l);
        if (g) wrap.appendChild(g);
      }
    });
    if (l.contrasts && l.contrasts.length) {
      wrap.appendChild(UI.el('h3', null, 'Same words, different meaning'));
      wrap.appendChild(UI.el('div', null, contrastTable(l.contrasts)));
    }
    if (l.exponents && l.exponents.length) {
      // A function lesson's exponents are grouped BY REGISTER, because the
      // register contrast is the teaching point — an ungrouped list would read
      // as a vocabulary dump and teach the wrong thing.
      wrap.appendChild(UI.el('h3', null, 'Ways to say it: with friends, at work, in writing'));
      var order = (window.REGISTERS || []).map(function (r) { return r.id; });
      var groups = {};
      l.exponents.forEach(function (e) { (groups[e.register] = groups[e.register] || []).push(e); });
      order.filter(function (r) { return groups[r]; }).forEach(function (r) {
        var meta = (window.REGISTERS || []).filter(function (x) { return x.id === r; })[0] || { label: r, note: '' };
        wrap.appendChild(UI.el('h4', 'register-head', meta.label +
          (meta.note ? ' <span class="muted">(' + meta.note + ')</span>' : '')));
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
      wrap.appendChild(UI.el('h3', null, 'A model' + (l.model.title ? ': ' + l.model.title : '')));
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
    fillClosing(wrap, l, opts);
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
  /* ---- teach before test ------------------------------------------------
   * The day's new vocabulary and idioms (StageReview.newToday) are shown here
   * first, one card at a time: the Spanish, the English, and the sentence it
   * came from when today's passage or lesson has one. "Got it" enrols the card
   * due TOMORROW, so it is first asked a day after it was taught and never in
   * the review stage that came before this one. */
  function sentenceFor(es, ctx) {
    if (!window.LexMatch || !es) return null;
    var srcs = [];
    if (ctx.passage && ctx.passage.text) srcs.push(String(ctx.passage.text));
    if (ctx.lesson && ctx.lesson.examples) srcs.push(ctx.lesson.examples.map(function (e) { return e.es; }).join('\n'));
    for (var i = 0; i < srcs.length; i++) {
      var parts = srcs[i].replace(/([.!?])\s+/g, '$1\n').split(/\n+/);
      for (var j = 0; j < parts.length; j++) {
        if (parts[j].trim() && window.LexMatch.index(parts[j]).has(es)) return parts[j].trim();
      }
    }
    return null;
  }

  function teachNew(host, cards, ctx, done) {
    var i = 0;
    function show() {
      UI.clear(host);
      if (i >= cards.length) { done(); return; }
      var c = cards[i];
      var wrap = UI.el('div', 'panel review-card');
      wrap.appendChild(UI.el('div', 'opener-eyebrow muted', UI.t('Nuevo hoy', 'New today') + ' · ' + (i + 1) + ' / ' + cards.length));
      wrap.appendChild(UI.el('div', 'card-front', c.es));
      wrap.appendChild(UI.el('p', null, '<b>' + c.en + '</b>'));
      if (c.lit) wrap.appendChild(UI.el('p', 'muted', 'literally: ' + c.lit));
      var sent = sentenceFor(c.es, ctx);
      if (sent) wrap.appendChild(UI.el('p', 'muted', 'From today: ' + sent));
      wrap.appendChild(UI.nextBtn('Got it', function () {
        S.enrol(c.id, 1);                        // first review is tomorrow
        i++; show();
      }));
      host.appendChild(wrap);
    }
    show();
  }

  function run(host, ctx, done) {
    var ft = (ctx.focus && ctx.focus.type) || 'grammar';
    if (ctx.lesson && ft !== 'vocab' && ft !== 'verbs' && ft !== 'practice') loadScripts(scriptBand(ctx, ctx.lesson));
    var SR = window.StageReview;
    var fresh = (SR && SR.newToday) ? SR.newToday(ctx).filter(function (c) { return !S.isEnrolled(c.id); }) : [];
    if (!fresh.length) { return runLesson(host, ctx, done); }
    teachNew(host, fresh, ctx, function () { runLesson(host, ctx, done); });
  }

  function runLesson(host, ctx, done) {
    var f = ctx.focus || { type: 'grammar' };
    if (f.type === 'vocab') return teachVocab(host, ctx, f, done);
    if (f.type === 'verbs') return teachVerbs(host, ctx, f, done);
    if (f.type === 'practice') return teachPractice(host, ctx, done);
    var l = ctx.lesson;
    if (!l) { done(); return; }
    withScript(host, ctx, l, function (sc) {
      if (sc) runScript(host, ctx, l, sc, done);
      else runOldLesson(host, ctx, l, done);
    });
  }

  function runOldLesson(host, ctx, l, done) {
    var wrap = fillLesson(UI.el('div', 'panel lesson'), l, { interactive: true });
    /* The Spanish this lesson is built out of joins the review deck, the same
     * way a vocab day's words do (teachVocab above). It is the same act: the
     * learner has just read the table and the exponents at the top of this
     * page, so these are things they have met today.
     *
     * This is the fix for CURRICULUM_AUDIT.md §1.1. Before it, `recall` was
     * the only thing a lesson put into review — so what came back for months
     * was the grammar point, and the ready-to-say Spanish on the same page
     * came back never. Enrolling here rather than in Phrases.all() keeps the
     * rule the rest of the app already follows: you review what you were
     * taught, on the day you were taught it, and nothing else.
     *
     * CAPPED, and the cap is the load-bearing part. SRS.enrol sets `due` to
     * today, so an enrolled phrase is a DUE item, not a "new" one — it is
     * governed by reviewBatchMax (20 at A1) and not by newPerDay. A lesson
     * releases a median of 9 phrases and up to 28; adding all of those on top
     * of the day's vocab, verbs and recall points would put ~25 items a day
     * into a queue that drains 20, and the overflow only gets rescheduled
     * (SRS.rescheduleJitter) rather than dropped — so the backlog would grow
     * every day and everything would read as perpetually overdue.
     *
     * Six, exponents first (js/phrases.js forLesson orders them), matching
     * what teachVocab quizzes from a vocab day. The rest of the table is still
     * on the page to read, still in the games pool, and still enrols the
     * moment a game round puts it in play. */
    enrolPhrases(l);
    /* Every probe gets asked. `srs:false` marks the ones that must not join the
     * review deck, not ones to skip — filtering here meant a comprehension
     * check written for the end of the lesson was silently dropped instead. */
    wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheckItems(host, l.recall || [], 'grammar', done, ctx); }));
    host.appendChild(wrap);
  }

  /* The Spanish this lesson is built out of joins the review deck (see
   * runOldLesson). Shared by both ways of teaching a lesson, so a script day
   * enrols exactly what the old page did. */
  function enrolPhrases(l) {
    if (window.Phrases) {
      window.Phrases.forLesson(l.id).slice(0, 6).forEach(function (p) { S.enrol(p.id); });
    }
  }

  /* ---- teaching scripts ---------------------------------------------------
   * A lesson with a script (data/scripts/<band>.js, window.SCRIPTS_<BAND>) is
   * taught in the order the evidence asks for: a human reason to care, two or
   * three examples BEFORE the rule, a rule card short enough to read in under
   * ninety seconds, read-and-pick items that can only be answered by reading
   * the form, typed production graded by the matcher with one hint and one
   * retry (as js/views/produce.js runBankTranslate), and one true sentence
   * about the learner with a live checklist. The old lesson is not thrown
   * away: all of it sits behind "Read more" at the end, and the quick check
   * and phrase enrolment after it are unchanged.
   *
   * The band file is injected at stage start, the way js/bankitems.js loads
   * its band files, so the lesson page costs nothing on a day without one. If
   * it has not arrived when the lesson is due (offline, a slow link, a 404),
   * the old lesson is taught exactly as before. */
  var SCRIPT_BANDS = { A1: 1, A2: 1, B1: 1, B2: 1, C1: 1 };       // band files that exist
  var scriptWaiters = {}, scriptFailed = {};
  var SCRIPT_WAIT_MS = 2500;

  function scriptBand(ctx, l) {
    var days = window.COURSE_DAYS || [];
    var d = ctx && ctx.di != null ? days[ctx.di] : null;
    if (d && d.lesson === l.id && d.band) return d.band;
    for (var i = 0; i < days.length; i++) if (days[i].lesson === l.id) return days[i].band || null;
    return l.cefr || null;
  }
  function loadScripts(band, cb) {
    cb = cb || function () {};
    var key = 'SCRIPTS_' + band;
    if (!band || !SCRIPT_BANDS[band] || scriptFailed[band]) { cb(false); return; }
    if (window[key]) { cb(true); return; }
    if (typeof document === 'undefined' || !document.createElement || !document.head) { cb(false); return; }
    if (!scriptWaiters[band]) {
      scriptWaiters[band] = [];
      var s = document.createElement('script');
      s.src = 'data/scripts/' + band.toLowerCase() + '.js';
      var finish = function (ok) {
        if (!ok) scriptFailed[band] = 1;
        var w = scriptWaiters[band] || []; delete scriptWaiters[band];
        w.forEach(function (f) { f(ok); });
      };
      s.onload = function () { finish(!!window[key]); };
      s.onerror = function () { finish(false); };
      document.head.appendChild(s);
    }
    scriptWaiters[band].push(cb);
  }
  // cb(script or null), once: null when there is none or it did not arrive in time.
  function withScript(host, ctx, l, cb) {
    var band = scriptBand(ctx, l), key = 'SCRIPTS_' + band;
    if (!band || !SCRIPT_BANDS[band] || scriptFailed[band]) { cb(null); return; }
    if (window[key]) { cb(window[key][l.id] || null); return; }
    var settled = false, note = UI.el('p', 'muted', UI.t('Cargando la lección…', 'Loading the lesson…'));
    host.appendChild(note);
    var settle = function (sc) {
      if (settled) return;
      settled = true;
      if (note.parentNode) note.parentNode.removeChild(note);
      cb(sc);
    };
    var timer = setTimeout(function () { settle(null); }, SCRIPT_WAIT_MS);
    loadScripts(band, function (ok) { clearTimeout(timer); settle(ok && window[key] ? window[key][l.id] || null : null); });
  }

  // Script text: HTML-escaped, *Spanish* in italics, \n as a line break.
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmt(s) { return esc(s).replace(/\*([^*\n]+)\*/g, '<i>$1</i>').replace(/\n/g, '<br>'); }
  // Spanish over its English, one pair per line, so a dialogue reads line by line.
  function pairs(es, en) {
    var a = String(es || '').split('\n'), b = String(en || '').split('\n');
    var box = UI.el('div', 'ex-pairs');
    a.forEach(function (line, i) {
      box.appendChild(UI.el('div', 'ex-pair',
        '<span class="ex-es">' + esc(line) + '</span><span class="ex-en">' + esc(b[i] || '') + '</span>'));
    });
    return box;
  }
  function seededOrder(n, seed) {
    var order = [], rnd = UI.seededRandom ? UI.seededRandom(seed) : Math.random;
    for (var i = 0; i < n; i++) order.push(i);
    for (var j = n - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)); var x = order[j]; order[j] = order[k]; order[k] = x; }
    return order;
  }

  function runScript(host, ctx, l, sc, done) {
    var st = ctx.step || null, ex = (st && st.extra) || {};
    var rp = sc.readAndPick || [], yt = sc.yourTurn || [], tr = sc.translate || [], reg = sc.register || [];
    /* One step index for the whole script, saved after every item:
     *   0 the opening page, then each read-and-pick item, then each typed item,
     *   then the personal sentence, then the closing page. */
    var P_RP = 1, P_YT = P_RP + rp.length, P_TR = P_YT + yt.length, P_ME = P_TR + tr.length, P_END = P_ME + 1;
    var resumed = ex.script === l.id;
    var at = resumed && st ? Math.min(st.at || 0, P_END) : 0;
    var score = resumed && ex.score ? ex.score : { rp: 0, yt: 0 };
    if (score.tr == null) score.tr = 0;
    var wrap = UI.el('div', 'panel lesson script');
    host.appendChild(wrap);

    function save() { if (st && st.save) st.save(at, { script: l.id, score: score }); }
    function go(n) { at = n; save(); show(); if (wrap.scrollIntoView) { try { wrap.scrollIntoView({ block: 'start' }); } catch (e) {} } }
    function eyebrow(text, i, n) {
      return UI.el('div', 'script-eyebrow', text + (n ? ' · ' + (i + 1) + ' / ' + n : ''));
    }
    function show() {
      UI.clear(wrap);
      if (at <= 0) opening();
      else if (at < P_YT) pick(at - P_RP);
      else if (at < P_TR) typed(yt, at - P_YT, UI.t('Te toca', 'Your turn'), 'yt');
      else if (at < P_ME) typed(tr, at - P_TR, UI.t('Ahora traduce', 'Now translate'), 'tr');
      else if (at === P_ME) personal();
      else closing();
      speakify(wrap);
    }

    // ---- hook, examples, the rule
    function opening() {
      wrap.appendChild(UI.el('h1', null, esc(l.title)));
      if (l.canDo) wrap.appendChild(UI.el('p', 'lesson-cando', '<span class="cando-label">After this you can</span> ' + esc(l.canDo)));
      if (sc.hook) {
        var h = UI.el('div', 'script-hook');
        h.appendChild(UI.el('p', 'hook-line', fmt(sc.hook.line)));
        h.appendChild(pairs(sc.hook.es, sc.hook.en));
        wrap.appendChild(h);
      } else {
        var g = guessBlock(l);                    // no hook: the guess still comes first
        if (g) wrap.appendChild(g);
      }
      if (sc.examples && sc.examples.length) {
        wrap.appendChild(UI.el('h3', null, UI.t('Primero, en uso', 'See it in use')));
        var exs = UI.el('div', 'examples');
        sc.examples.forEach(function (e) { var d = UI.el('div', 'ex'); d.appendChild(pairs(e.es, e.en)); exs.appendChild(d); });
        wrap.appendChild(exs);
      }
      if (sc.rule) {
        var card = UI.el('div', 'rule-card');
        card.appendChild(UI.el('div', 'script-eyebrow', UI.t('La regla', 'How it works')));
        String(sc.rule).split('\n').forEach(function (line) {
          if (line.trim()) card.appendChild(UI.el('p', 'rule-line', fmt(line)));
        });
        wrap.appendChild(card);
      }
      if (reg.length) {
        var rc = UI.el('div', 'rule-card register-card');
        rc.appendChild(UI.el('div', 'script-eyebrow', UI.t('Formas de decirlo', 'Ways to say it')));
        reg.forEach(function (r) {
          var d = UI.el('div', 'register-item');
          d.appendChild(UI.el('div', 'ex-es', esc(r.es)));
          d.appendChild(UI.el('div', 'ex-en', esc(r.en)));
          if (r.when) d.appendChild(UI.el('div', 'register-when muted small', fmt(r.when)));
          rc.appendChild(d);
        });
        wrap.appendChild(rc);
      }
      wrap.appendChild(UI.nextBtn(rp.length || yt.length || tr.length ? 'Try it →' : 'Continuar →', function () { go(1); }));
    }

    // ---- read and pick: one at a time, tap, one line of why
    function pick(i) {
      var r = rp[i];
      wrap.appendChild(eyebrow(UI.t('Lee y elige', 'Read and pick'), i, rp.length));
      wrap.appendChild(UI.el('p', 'guess-q', fmt(r.q)));
      var es = UI.el('div', 'cloze-text script-es');
      String(r.es).split('\n').forEach(function (line) { es.appendChild(UI.el('div', 'ex-es', esc(line))); });
      wrap.appendChild(es);
      var opts = UI.el('div', 'mcq-opts'), why = UI.el('p', 'guess-after'), answered = false;
      var order = seededOrder(r.options.length, l.id + ':rp:' + i);
      var next = UI.nextBtn('Next →', function () { go(at + 1); });
      next.classList.add('hidden');
      order.forEach(function (oi) {
        var b = UI.el('button', 'mcq-btn', esc(r.options[oi])); b.type = 'button';
        b.dataset.oi = oi;
        b.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          var right = oi === r.answer;
          if (right) score.rp++;
          Array.prototype.forEach.call(opts.children, function (btn) {
            var k = +btn.dataset.oi;
            if (k === r.answer) btn.classList.add('right');
            else if (btn === b) btn.classList.add('wrong');
            btn.disabled = true;
          });
          why.className = 'guess-after' + (right ? ' good' : '');
          why.innerHTML = (right ? '¡Eso es! ' : 'Not quite. ') + fmt(r.why || '');
          next.classList.remove('hidden');
          save();
        });
        opts.appendChild(b);
      });
      wrap.appendChild(opts);
      wrap.appendChild(why);
      wrap.appendChild(next);
    }

    // ---- your turn: typed, graded by the matcher, one hint and one retry
    function typed(list, j, label, key) {
      var t = list[j], M = window.LIB && window.LIB.match;
      wrap.appendChild(eyebrow(label, j, list.length));
      wrap.appendChild(UI.el('h2', 'q-text', 'Say it in Spanish:'));
      wrap.appendChild(UI.el('p', 'cloze-text', '“' + fmt(t.en) + '”'));
      var ta = UI.el('textarea', 'answer-area');
      ta.rows = 2; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;
      ta.setAttribute('autocapitalize', 'off'); ta.setAttribute('autocomplete', 'off');
      var fb = UI.el('div', 'feedback');
      var goB = UI.el('button', 'primary-btn', 'Check'); goB.type = 'button';
      var skip = UI.el('button', 'ghost-btn', 'Show answer (I\'m stuck)'); skip.type = 'button';
      var row = UI.el('div', 'row-controls');
      row.appendChild(goB); row.appendChild(skip);
      wrap.appendChild(ta);
      wrap.appendChild(UI.accentBar(function () { return ta; }));
      wrap.appendChild(fb);
      wrap.appendChild(row);
      ta.focus();

      var item = { es: t.es, en: t.en, accept: t.accept || [] };
      var state = M ? M.startAttempt(item, { accents: 'lenient' }) : null, tries = 0, finished = false;
      var model = '<div class="model-answer">' + esc(t.es) + '</div>';
      function finish(ok, html, cls) {
        finished = true;
        if (ok) score[key]++;
        fb.className = 'feedback ' + cls; fb.innerHTML = html;
        ta.readOnly = true;
        skip.classList.add('hidden');
        goB.textContent = 'Next →';
        goB.onclick = function () { go(at + 1); };
        save();
      }
      function reveal(hint) {
        if (window.ErrorLog) window.ErrorLog.record({ id: 'err:script:' + l.id + ':' + (key === 'tr' ? 't' : '') + j, front: t.en, back: t.es,
          hint: hint || null, kind: 'grammar', source: 'learn-script', reviewable: false });
        finish(false, model + (hint ? '<div class="muted small">' + fmt(hint) + '</div>' : ''), 'bad');
      }
      // The matcher reads words, not marks: a question typed without ¿ still passes, and is told.
      function marksNote(text) {
        return /¿/.test(t.es) && !/¿/.test(text) ? 'Spanish opens a question with ¿ as well.' : '';
      }
      function submit() {
        if (finished) return;
        var text = ta.value.trim();
        if (!text) return;
        if (!M) {                                 // no bundle: exact match against the model
          var r0 = C.checkExact(text, [t.es], { meaning: false });
          if (r0.pass) finish(true, 'Right', 'good');
          else if (++tries < 2) { fb.className = 'feedback bad'; fb.textContent = (r0.near ? 'Nearly, check the accents.' : 'Not quite.') + ' Try once more.'; ta.focus(); }
          else reveal(null);
          return;
        }
        var step = M.submitAttempt(state, text);
        state = step.state;
        var res = step.result;
        if (step.status === 'correct') {
          var note = [res.note || (res.near ? res.hint : ''), marksNote(text)].filter(Boolean).join(' ');
          finish(true, 'Right' + (note ? '. ' + fmt(note) + model : ''), 'good');
        } else if (step.status === 'retry') {
          fb.className = 'feedback bad';
          fb.innerHTML = fmt(res.hint || 'Not quite.') + ' Try once more.';
          ta.focus();
        } else {
          reveal(res.hint || null);
        }
      }
      goB.onclick = submit;
      skip.addEventListener('click', function () { if (!finished) reveal(null); });
      ta.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (finished) goB.click(); else submit(); }
      });
    }

    // ---- one true sentence about the learner, with a live checklist
    function personal() {
      var p = sc.personal;
      if (!p || !p.prompt) { go(at + 1); return; }
      wrap.appendChild(eyebrow(UI.t('Sobre ti', 'About you')));
      wrap.appendChild(UI.el('h2', 'q-text', fmt(p.prompt)));
      var ta = UI.el('textarea', 'answer-area');
      ta.rows = 3; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;
      var checklist = UI.el('ul', 'constraint-list');
      var modelBox = UI.el('div');
      var doneB = UI.el('button', 'primary-btn', p.model ? 'Compare with a model →' : 'Done →'); doneB.type = 'button';
      var skipB = UI.el('button', 'ghost-btn', p.model ? 'Show the model' : 'Skip'); skipB.type = 'button';
      wrap.appendChild(ta);
      wrap.appendChild(UI.accentBar(function () { return ta; }));
      var task = { constraints: p.constraints || [] };
      if (task.constraints.length) wrap.appendChild(UI.el('div', 'checklist-title muted', 'Your sentence needs to…'));
      wrap.appendChild(checklist);
      wrap.appendChild(modelBox);
      var row = UI.el('div', 'row-controls');
      row.appendChild(doneB); row.appendChild(skipB);
      wrap.appendChild(row);
      ta.focus();
      function render() {
        if (!C || !task.constraints.length) { doneB.disabled = !ta.value.trim(); return; }
        var res = C.checkWriting(task, ta.value);
        UI.clear(checklist);
        res.results.forEach(function (r, k) {
          var c = task.constraints[k] || {};
          checklist.appendChild(UI.el('li', 'constraint ' + (r.pass ? 'pass' : 'todo'),
            (r.pass ? '✓ ' : '○ ') + (c.label ? fmt(c.label) : r.label) + (r.detail ? ' <span class="muted">(' + esc(r.detail) + ')</span>' : '')));
        });
        doneB.disabled = !res.allPass;
      }
      ta.addEventListener('input', render);
      render();
      var shown = false;
      function showModel() {
        if (shown || !p.model) { go(at + 1); return; }
        shown = true;
        modelBox.appendChild(UI.el('div', null,
          '<div class="checklist-title muted">One way to say it:</div><div class="model-answer">' + esc(p.model) + '</div>' +
          '<p class="muted small">Yours is about you, so it will say different things. Compare the verb forms and the little words.</p>'));
        doneB.textContent = 'Next →'; doneB.disabled = false;
        skipB.classList.add('hidden');
        ta.readOnly = true;
      }
      doneB.addEventListener('click', showModel);
      skipB.addEventListener('click', function () { if (p.model) showModel(); else go(at + 1); });
    }

    // ---- watch out, the whole old lesson behind Read more, then the quick check
    function closing() {
      wrap.appendChild(UI.el('h2', null, esc(l.title)));
      if (rp.length || yt.length || tr.length) {
        wrap.appendChild(UI.el('p', 'muted script-score',
          (rp.length ? 'Read and pick: ' + score.rp + ' of ' + rp.length + ' first time.' : '') +
          (yt.length ? ' Your turn: ' + score.yt + ' of ' + yt.length + '.' : '') +
          (tr.length ? ' Now translate: ' + score.tr + ' of ' + tr.length + '.' : '')));
      }
      if (sc.pitfalls && sc.pitfalls.length) {
        wrap.appendChild(UI.el('h3', null, 'Watch out'));
        var ul = UI.el('ul', 'pitfalls');
        sc.pitfalls.forEach(function (x) { ul.appendChild(UI.el('li', null, fmt(x))); });
        wrap.appendChild(ul);
      }
      if (l.canDo) wrap.appendChild(UI.el('p', 'lesson-nowyoucan', '<span class="cando-label">Now you can</span> ' + esc(l.canDo)));
      var more = UI.el('details', 'read-more');
      more.appendChild(UI.el('summary', null, UI.t('Leer más: la lección completa', 'Read more: the full lesson')));
      more.appendChild(fillLesson(UI.el('div', 'read-more-body'), l, { fold: true }));
      wrap.appendChild(more);
      enrolPhrases(l);
      wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheckItems(host, l.recall || [], 'grammar', done, ctx); }));
    }

    save();
    show();
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
    wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheckItems(host, check, 'vocab', done, ctx); }));
    host.appendChild(wrap);
  }

  // ---- verbs day ----
  function teachVerbs(host, ctx, f, done) {
    var verbs = (f.verbs || []).map(function (inf) { return window.ENGINE.verbByInf(inf); }).filter(Boolean);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'New verbs'));
    wrap.appendChild(UI.el('p', 'muted', 'Meet these verbs by meaning. You\'ll conjugate them in the ' + UI.t('Aplicar', 'Apply') + ' and ' + UI.t('Producir', 'Produce') + ' stages as you learn each tense.'));
    wrap.appendChild(UI.el('div', null, listTable(verbs.map(function (v) { return [v.inf, v.en]; }))));
    verbs.forEach(function (v) { S.enrol('vm:' + v.inf); });
    var check = verbs.map(function (v) { return qcItem('vm:' + v.inf, v.inf, v.en); });
    wrap.appendChild(UI.nextBtn('Quick check →', function () { quickCheckItems(host, check, 'verb', done, ctx); }));
    host.appendChild(wrap);
  }

  // ---- practice day (no new content) ----
  function teachPractice(host, ctx, done) {
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Practice & review day'));
    wrap.appendChild(UI.el('p', 'doc-summary', 'No new grammar today: a day to let what you\'ve met settle. The review, the reading and the exercises all draw on things you already know.'));
    wrap.appendChild(UI.nextBtn('Continuar →', done));
    host.appendChild(wrap);
  }

  /* Active recall over a set of items, enrolling them into review. `kind` tags
   * the error-log entries. Shared by grammar recall, vocab days and verb days.
   *
   * `ctx` is only used to leave the score behind in ctx.results.learn. Every
   * other stage already reported its score and this one did not, so the one
   * stage that measures whether today's teaching landed was the one stage
   * invisible to the completion screen and to js/report.js. Optional, because
   * nothing here needs it to run. */
  function quickCheckItems(host, items, kind, done, ctx) {
    items = (items || []).slice();
    if (!items.length) { done(); return; }
    var asked = 0, right = 0;

    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h2', null, 'Quick check'));
    wrap.appendChild(UI.el('p', 'muted', 'Answer from memory. These join your review deck.'));

    var i = 0, form = UI.el('div');
    wrap.appendChild(form);
    host.appendChild(wrap);

    function show() {
      if (i >= items.length) {
        if (ctx && ctx.results) ctx.results.learn = { correct: right, total: asked };
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

      /* Every route out of a probe goes through here — typed-correct, wrong
       * mcq, and Reveal — so it is the only place the score can be counted
       * once and only once. A revealed answer counts as asked and not right,
       * which is what revealing it means. */
      function next(good) {
        if (it.srs !== false) { S.enrol(it.id); if (!good) S.grade(it.id, false); }
        asked++; if (good) right++;
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
        /* Same leniency the review stage gives a lesson card: an answer the
         * author wrote out with a slash or a bracket is accepted in the
         * forms a person would type it in. Nothing but this card's own
         * answer feeds it — see C.answerForms. */
        var r = C.checkExact(input.value, accepted, {
          meaning: it.kind !== 'grammar',
          also: C.answerForms ? C.answerForms(it.back) : null
        });
        if (r.pass) { fb.textContent = '¡Correcto!'; fb.className = 'feedback good'; setTimeout(function () { next(true); }, 300); }
        else { fb.textContent = r.near ? 'Nearly, check the accents' : 'Not quite'; fb.className = 'feedback bad'; }
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
