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

  // ---- tense-focused content pickers --------------------------------------
  // `rng` is seeded (reproducible) the FIRST time a lesson is taken, and plain
  // Math.random on every retake, so repeats don't surface the identical set.
  function clozeForTense(tk, rng) {
    var concept = E.CONCEPTS[tk];
    var pool = (window.APPLY_ITEMS || []).filter(function (it) {
      return it.type === 'cloze' && (concept ? concept.matchesCloze(it) : it.tense === tk);
    });
    return UI.sample(pool, 6, rng);
  }
  function usesTense(task, tk) {
    var concept = E.CONCEPTS[tk];
    if (concept) return concept.matchesConstraints(task.constraints);
    return (task.constraints || []).some(function (c) {
      return (c.type === 'anyVerbInTense' || c.type === 'verbFormAny') && c.tense === tk;
    });
  }
  function writesForTense(tk, lesson, rng) {
    var out = [];
    (window.WRITING_TASKS || []).forEach(function (t) {
      if ((t.type === 'write' || t.type === 'translate' || t.type === 'paragraph') && usesTense(t, tk)) out.push(t);
    });
    (window.TOPICS || []).forEach(function (top) {
      (top.prompts || []).forEach(function (pr) { if (usesTense(pr, tk)) out.push(pr); });
    });
    if (!out.length) {
      var concept = E.CONCEPTS[tk];
      if (concept) {
        out = concept.fallbackWrites();
      } else {                               // synthesise one, seeded with example models from the lesson
        var models = (lesson.examples || []).filter(function (ex) {
          return E.analyzeSentence(ex.es).verbs.some(function (v) { return v.analyses.some(function (a) { return a.tense === tk; }); });
        }).map(function (ex) { return ex.es; }).slice(0, 1);
        out.push({ prompt: 'Write two or three sentences of your own using the ' + E.TENSE_LABEL[tk] + '.',
          hint: 'Use the ' + E.TENSE_LABEL[tk] + ' at least once.',
          constraints: [{ type: 'anyVerbInTense', tense: tk }, { type: 'minWords', n: 8 }], models: models });
      }
    }
    return UI.sample(out, 2, rng);
  }
  function passageForTense(tk, level, rng) {
    var ps = window.PASSAGES || [];
    var concept = E.CONCEPTS[tk];
    function uses(p) {
      if (concept) return concept.matchesText(p.text);
      var a = E.analyzeSentence(p.text);
      return a.verbs.some(function (v) { return v.analyses.some(function (x) { return x.tense === tk; }); }) ||
             a.compounds.some(function (c) { return c.parts.some(function (x) { return x.tense === tk; }); });
    }
    return UI.pick(ps.filter(function (p) { return (p.level || 1) <= level && uses(p); }), rng) ||
           UI.pick(ps.filter(uses), rng) || null;
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
      profile: window.Profile ? window.Profile.current() : 'standard' };
    var title = lesson ? lesson.title : (focus.type === 'verbs' ? 'Verbs · ' + focus.verbs.slice(0, 3).join(', ') :
      focus.type === 'vocab' ? 'New words · ' + focus.cat : 'Practice');

    var seq = [window.StageLearn];
    if (lesson) {
      var tk = lesson.id;
      ctx.level = lesson.level || 1;
      ctx.passage = passageForTense(tk, ctx.level, rng);
      ctx.applyItems = clozeForTense(tk, rng);
      ctx.writeTasks = writesForTense(tk, lesson, rng);
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
      wrap.appendChild(UI.el('h1', null, '¡Lección completa!'));
      wrap.appendChild(UI.el('p', 'muted', 'You worked through ' + title + ' — taught, read, applied and written.'));
      wrap.appendChild(UI.nextBtn('← Volver', back));
      host.appendChild(wrap);
    }

    step();
  }

  return { run: run };
})();
