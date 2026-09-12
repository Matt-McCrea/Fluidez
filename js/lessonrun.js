/* ============================================================================
 * LESSON RUN — take a lesson on demand as a proper mini-session, not just a
 * quick check. EVERY lesson type runs the full arc, centred on its focus:
 *     Aprender (taught + conjugation tabs / flashcards + quick check)
 *   → Comprender (a short story that USES the tense / verbs / words)
 *   → Aplicar (cloze practice — grammar & verb-group lessons only; vocab has
 *              no verb-conjugation mechanic to apply, so it skips this stage)
 *   → Producir (write your own sentences using it)
 * The first time ANY lesson (grammar, verb-group, or vocab) is taken, its
 * content is picked with a seed derived from a stable key for that lesson —
 * reproducible if you reload mid-lesson. Once completed and retaken later,
 * selection is plain Math.random so repeats don't surface the identical set.
 * Reuses the daily session's stage modules.
 * ========================================================================== */
window.LessonRun = (function () {
  var UI = window.UI, E = window.ENGINE, PKEY = 'fluidez.progress';

  function lessonById(id) {
    var ls = window.GRAMMAR_LESSONS || [];
    for (var i = 0; i < ls.length; i++) if (ls[i].id === id) return ls[i];
    return null;
  }
  function loadStudied() {
    try { return (JSON.parse(localStorage.getItem(PKEY)) || {}).studied || {}; } catch (e) { return {}; }
  }
  function markStudied(id) {
    var p; try { p = JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { p = {}; }
    p.studied = p.studied || {}; p.studied[id] = 1;
    try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {}
  }
  // A stable identity for ANY focus (grammar lesson id, or a verb-group /
  // vocab-chunk signature) — used both as the "studied" key and the RNG seed.
  function keyForFocus(focus, lesson) {
    if (lesson) return lesson.id;
    if (focus.type === 'verbs') return 'verbs:' + focus.verbs.join(',');
    if (focus.type === 'vocab') return 'vocab:' + focus.cat + ':' + (focus.words[0] || '');
    return 'practice';
  }

  // ---- lesson content pickers ----------------------------------------------
  /* A lesson's id used to be the ONLY selector for its content — `it.tense ===
   * id` for cloze, an analysed verb form for passages. That resolves for the 13
   * generated tense lessons and the 5 concept lessons and for nothing else:
   * every PCIC strand lesson (681 of 699) has an id like `gr-condicionales-a2`,
   * which matches no tense, no concept and no cloze item. Those lessons served
   * no passage, no cloze, and a synthesised write task that read "using the
   * undefined" — `E.TENSE_LABEL[id]` on an id that is not a tense — carrying a
   * constraint no answer could ever satisfy.
   *
   * So: keep the tense-aligned pool where the lesson IS about a tense, and
   * otherwise select on what a strand lesson actually carries — its level and
   * its theme. Same "aligned, else level-appropriate" rule the daily session
   * already uses (see sampleAligned/preferAligned in js/session.js).
   *
   * `rng` is seeded (reproducible) the FIRST time a lesson is taken, and plain
   * Math.random on every retake, so repeats don't surface the identical set. */
  function tenseFocused(lesson) { return !!(E.TENSE_LABEL[lesson.id] || E.CONCEPTS[lesson.id]); }

  function atLevel(arr, level) {
    var out = arr.filter(function (x) { return (x.level || 1) <= level; });
    return out.length ? out : arr;          // a hard item beats a blank stage
  }
  /* A themed pool only wins if it is big enough to VARY. `t.length ? t : arr`
   * handed a lesson its theme even when the theme had one matching passage at
   * that level — so task-escribir (theme `medios`) drew the same text every
   * time it came round, and task-pedir alternated between two. Same threshold
   * and same reasoning as nearestLevel below: three is the point at which a
   * pool stops being a single item wearing a filter. */
  function preferTheme(arr, theme) {
    if (!theme) return arr;
    var t = arr.filter(function (x) { return x.theme === theme; });
    return t.length >= 3 ? t : arr;
  }
  /* Closest level wins. "At or below" alone would let a C1 lesson draw an A1
   * text, which is technically in range and useless as input — and a level-2
   * lesson draw the level-1 pool, which is four times bigger and so wins on
   * volume every time. Take the highest level available and only widen
   * downwards while the pool is too thin to vary. */
  function nearestLevel(arr) {
    if (!arr.length) return arr;
    var top = arr.reduce(function (m, x) { return Math.max(m, x.level || 1); }, 0);
    for (var floor = top; floor >= 1; floor--) {
      var out = arr.filter(function (x) { return (x.level || 1) >= floor; });
      if (out.length >= 3) return out;
    }
    return arr;
  }
  function levelPool(arr, lesson) {
    return nearestLevel(preferTheme(atLevel(arr, lesson.level || 1), lesson.theme));
  }

  function clozeForLesson(lesson, rng) {
    var concept = E.CONCEPTS[lesson.id];
    var all = (window.APPLY_ITEMS || []).filter(function (it) { return it.type === 'cloze'; });
    if (tenseFocused(lesson)) {
      var aligned = all.filter(function (it) {
        return concept ? concept.matchesCloze(it) : it.tense === lesson.id;
      });
      if (aligned.length) return UI.sample(aligned, 6, rng);
    }
    // apply items carry no theme, so a strand lesson selects on level alone
    return UI.sample(nearestLevel(atLevel(all, lesson.level || 1)), 6, rng);
  }

  function writesForLesson(lesson, rng) {
    var concept = E.CONCEPTS[lesson.id];
    var all = [];
    (window.WRITING_TASKS || []).forEach(function (t) {
      if (t.type === 'write' || t.type === 'translate' || t.type === 'paragraph') all.push(t);
    });
    (window.TOPICS || []).forEach(function (top) {
      (top.prompts || []).forEach(function (pr) { all.push(pr); });
    });
    if (tenseFocused(lesson)) {
      var aligned = all.filter(function (t) {
        if (concept) return concept.matchesConstraints(t.constraints);
        return (t.constraints || []).some(function (c) {
          return (c.type === 'anyVerbInTense' || c.type === 'verbFormAny') && c.tense === lesson.id;
        });
      });
      if (aligned.length) return UI.sample(aligned, 2, rng);
      if (concept) return UI.sample(concept.fallbackWrites(), 2, rng);
    }
    return UI.sample(levelPool(all, lesson), 2, rng);
  }

  function passageForLesson(lesson, level, rng) {
    var ps = window.PASSAGES || [];
    var concept = E.CONCEPTS[lesson.id];
    if (tenseFocused(lesson)) {
      var aligned = ps.filter(function (p) {
        if (concept) return concept.matchesText(p.text);
        var a = E.analyzeSentence(p.text);
        return a.verbs.some(function (v) { return v.analyses.some(function (x) { return x.tense === lesson.id; }); }) ||
               a.compounds.some(function (c) { return c.parts.some(function (x) { return x.tense === lesson.id; }); });
      });
      if (aligned.length) return UI.pick(atLevel(aligned, level), rng);
    }
    return UI.pick(levelPool(ps, lesson), rng);
  }

  // ---- verb-group content pickers ------------------------------------------
  // A passage "uses" a verb group when it clearly draws on it (≥2 of the 5
  // verbs), not just a single passing mention shared with everything else.
  function passageForVerbGroup(infs, rng) {
    var ps = window.PASSAGES || [];
    var strong = ps.filter(function (p) { return E.matchesVerbGroup(p.text, infs) >= 2; });
    if (strong.length) return UI.pick(strong, rng);
    var any = ps.filter(function (p) { return E.matchesVerbGroup(p.text, infs) >= 1; });
    return UI.pick(any, rng) || null;
  }
  function clozeForVerbGroup(infs, rng) {
    var pool = (window.APPLY_ITEMS || []).filter(function (it) { return it.type === 'cloze' && infs.indexOf(it.inf) !== -1; });
    return UI.sample(pool, 6, rng);
  }
  function constraintsReferVerb(constraints, infs) {
    return (constraints || []).some(function (c) { return c.inf && infs.indexOf(c.inf) !== -1; });
  }
  function writesForVerbGroup(infs, rng) {
    var out = [];
    (window.WRITING_TASKS || []).forEach(function (t) { if (t.constraints && constraintsReferVerb(t.constraints, infs)) out.push(t); });
    (window.TOPICS || []).forEach(function (top) {
      (top.prompts || []).forEach(function (pr) { if (constraintsReferVerb(pr.constraints, infs)) out.push(pr); });
    });
    return UI.sample(out, 2, rng);
  }

  // ---- vocab-category content pickers ---------------------------------------
  // A passage "uses" a vocab chunk when it draws on several of its words
  // (≥3), not just one word every passage happens to share.
  function passageForVocab(words, rng) {
    var ps = window.PASSAGES || [];
    var strong = ps.filter(function (p) { return E.matchesVocabWords(p.text, words) >= 3; });
    if (strong.length) return UI.pick(strong, rng);
    var any = ps.filter(function (p) { return E.matchesVocabWords(p.text, words) >= 1; });
    return UI.pick(any, rng) || null;
  }
  function vocabNouns(words) {
    return words.map(function (w) { return E.deaccent(w.toLowerCase().replace(/^(el |la |los |las |un |una )/, '')); });
  }
  function constraintsReferWords(constraints, nouns) {
    return (constraints || []).some(function (c) {
      if (c.type === 'containsWord') return nouns.some(function (n) { return E.deaccent(c.word.toLowerCase()).indexOf(n) !== -1; });
      if (c.type === 'containsAny') return (c.words || []).some(function (w) { return nouns.some(function (n) { return E.deaccent(w.toLowerCase()).indexOf(n) !== -1; }); });
      return false;
    });
  }
  function writesForVocab(words, rng) {
    var nouns = vocabNouns(words);
    var out = [];
    (window.WRITING_TASKS || []).forEach(function (t) { if (constraintsReferWords(t.constraints, nouns)) out.push(t); });
    (window.TOPICS || []).forEach(function (top) {
      (top.prompts || []).forEach(function (pr) { if (constraintsReferWords(pr.constraints, nouns)) out.push(pr); });
    });
    return UI.sample(out, 2, rng);
  }

  // ---- mini-session runner -------------------------------------------------
  function run(focus, back) {
    var host = document.getElementById('stage-host');
    var lesson = focus.type === 'grammar' ? lessonById(focus.id) : null;
    var key = keyForFocus(focus, lesson);
    var firstTime = !loadStudied()[key];
    var rng = firstTime ? UI.seededRandom(key) : Math.random;
    var ctx = { focus: focus, lesson: lesson, results: {},
      profile: window.Profile ? window.Profile.current() : 'A1' };
    var title = lesson ? lesson.title : (focus.type === 'verbs' ? 'Verbs · ' + focus.verbs.slice(0, 3).join(', ') :
      focus.type === 'vocab' ? 'New words · ' + focus.cat : 'Practice');

    var seq = [window.StageLearn];
    if (lesson) {
      ctx.level = lesson.level || 1;
      ctx.passage = passageForLesson(lesson, ctx.level, rng);
      ctx.applyItems = clozeForLesson(lesson, rng);
      ctx.writeTasks = writesForLesson(lesson, rng);
    } else if (focus.type === 'verbs') {
      ctx.level = 99;
      ctx.passage = passageForVerbGroup(focus.verbs, rng);
      ctx.applyItems = clozeForVerbGroup(focus.verbs, rng);
      ctx.writeTasks = writesForVerbGroup(focus.verbs, rng);
    } else if (focus.type === 'vocab') {
      ctx.level = 99;
      ctx.passage = passageForVocab(focus.words, rng);
      ctx.applyItems = [];                     // no verb-conjugation mechanic applies to plain vocab
      ctx.writeTasks = writesForVocab(focus.words, rng);
    }
    if (ctx.passage) seq.push(window.StageComprehend);
    if ((ctx.applyItems || []).length) seq.push(window.StageApply);
    if ((ctx.writeTasks || []).length) seq.push(window.StageProduce);

    var i = 0;
    function step() {
      if (i >= seq.length) {
        markStudied(key);
        finish();
        return;
      }
      var stage = seq[i];
      UI.clear(host);
      var head = UI.el('div', 'stage-head');
      head.appendChild(UI.el('span', 'eyebrow', stage.icon + '  ' + stage.label));
      var right = UI.el('span', 'stage-count');
      var b = UI.el('button', 'ghost-btn small', '✕ salir'); b.type = 'button'; b.style.marginTop = '0';
      b.addEventListener('click', back);
      right.appendChild(UI.el('span', null, 'Paso ' + (i + 1) + ' / ' + seq.length + '  '));
      right.appendChild(b);
      head.appendChild(right);
      host.appendChild(head);
      var body = UI.el('div', 'stage-body');
      host.appendChild(body);
      stage.run(body, ctx, function () { i++; step(); });
    }

    function finish() {
      UI.clear(host);
      var wrap = UI.el('div', 'panel intro');
      wrap.appendChild(UI.el('div', 'big-check', '✓'));
      wrap.appendChild(UI.el('h1', null, UI.t('Lección terminada', 'Lesson done')));
      wrap.appendChild(UI.el('p', 'muted', 'You worked through ' + title + ' — taught, read, applied and written.'));
      wrap.appendChild(UI.nextBtn('← Volver', back));
      host.appendChild(wrap);
    }

    step();
  }

  return { run: run };
})();
