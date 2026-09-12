/* ============================================================================
 * SESSION — "Tu sesión de hoy": the daily orchestrator.
 * Threads the five stages in the research-backed order
 *   Repasar → Aprender → Comprender → Aplicar → Producir
 * (review protects prior learning; input before output; production last).
 * Content is chosen deterministically from the date, so a day's session is
 * stable if you come back to it, and rotates as the days advance.
 * ========================================================================== */
window.Session = (function () {
  var UI = window.UI;
  var PKEY = 'fluidez.progress';

  /* Ordered stages (each module exposes { key, label, icon, run(host, ctx, done) }).
   *
   * Session lengths are SUBSETS of the same five stages — there is no second
   * code path, and a learner who never touches the short forms sees exactly
   * what they always saw. `larga` runs the same five but is handed more to do
   * (see buildContext), rather than bolting on a sixth stage that would have
   * to invent content of its own. */
  var MODES = {
    rapido: { key: 'rapido', icon: '⚡', label: 'Repaso rápido', labelEn: 'Quick review',       mins: 'unos 4 min', minsEn: 'about 4 min',
              blurb: 'Only what is due today',
              keys: ['review'] },
    corto:  { key: 'corto', icon: '🎯',  label: 'Repaso y práctica', labelEn: 'Review and practice', mins: 'unos 10 min', minsEn: 'about 10 min',
              blurb: 'Review, then grammar in context',
              keys: ['review', 'apply'] },
    diaria: { key: 'diaria', icon: '▶', label: 'Sesión diaria', labelEn: 'Daily session',       mins: 'unos 15 min', minsEn: 'about 15 min',
              blurb: 'The five stages, start to finish',
              keys: ['review', 'learn', 'comprehend', 'apply', 'produce'] },
    larga:  { key: 'larga', icon: '📚',  label: 'Sesión larga', labelEn: 'Long session',         mins: 'unos 40 min', minsEn: 'about 40 min',
              blurb: 'The same session, with more to read and write',
              keys: ['review', 'learn', 'comprehend', 'apply', 'produce'] }
  };
  var mode = 'diaria';

  function modeDef() { return MODES[mode] || MODES.diaria; }
  function stageByKey() {
    return { review: window.StageReview, learn: window.StageLearn,
             comprehend: window.StageComprehend, apply: window.StageApply,
             produce: window.StageProduce };
  }
  function stages() {
    var all = stageByKey();
    return modeDef().keys.map(function (k) { return all[k]; })
      .filter(function (st) { return !!st; });
  }

  // Headings in English until B1 — see Profile.term.
  function T(es, en) { return window.UI.t(es, en); }

  function dayNumber() {
    return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  }
  // sample/pick take an optional rng (see buildContext: seeded & reproducible
  // the first time a lesson is seen, plain Math.random on every repeat).
  function sample(arr, n, rng) { return UI.sample(arr, n, rng); }
  function pick(arr, rng) { return UI.pick(arr, rng); }

  // ---- align content to the day's focus (use what was just taught) --------
  var E = window.ENGINE;
  function passageUsesFocus(p, focus) {
    if (focus.type === 'grammar' && E.CONCEPTS[focus.id]) return E.CONCEPTS[focus.id].matchesText(p.text);
    if (focus.type === 'grammar') {
      var a = E.analyzeSentence(p.text);
      return a.verbs.some(function (v) { return v.analyses.some(function (x) { return x.tense === focus.id; }); }) ||
             a.compounds.some(function (c) { return c.parts.some(function (x) { return x.tense === focus.id; }); });
    }
    if (focus.type === 'verbs') return E.matchesVerbGroup(p.text, focus.verbs) >= 1;
    if (focus.type === 'vocab') return E.matchesVocabWords(p.text, focus.words) >= 1;
    return false;
  }
  function clozeMatchesFocus(it, focus) {
    if (focus.type === 'grammar' && E.CONCEPTS[focus.id]) return E.CONCEPTS[focus.id].matchesCloze(it);
    if (focus.type === 'grammar') return it.tense === focus.id;
    if (focus.type === 'verbs') return focus.verbs.indexOf(it.inf) !== -1;
    return false;
  }
  function writeMatchesFocus(t, focus) {
    if (focus.type !== 'grammar') return false;
    if (E.CONCEPTS[focus.id]) return E.CONCEPTS[focus.id].matchesConstraints(t.constraints);
    return (t.constraints || []).some(function (c) {
      return (c.type === 'anyVerbInTense' || c.type === 'verbFormAny') && c.tense === focus.id;
    });
  }
  // n items from the focus-aligned items, topped up with other items to reach n
  function sampleAligned(pool, focus, n, matchFn, rng) {
    var yes = pool.filter(function (x) { return matchFn(x, focus); });
    var no = pool.filter(function (x) { return !matchFn(x, focus); });
    var out = sample(yes, n, rng);
    if (out.length < n) out = out.concat(sample(no, n - out.length, rng));
    return out;
  }
  function preferAligned(arr, focus, fn) {
    var a = arr.filter(function (t) { return fn(t, focus); });
    return a.length ? a : arr;
  }

  /* Keep verbs a beginner has not been taught out of the answers they are
   * asked to produce. A translation task on "I sleep eight hours a night"
   * demands "duermo"; a learner three days into the present tense writes
   * "dormo" and is marked wrong for a stem change nobody has shown them.
   *
   * A1 only — the Plan Curricular introduces stem changes at A2, and querer,
   * poder, dormir and jugar are core early vocabulary. Never empties a stage
   * either: if the filter leaves nothing, the unfiltered set is used, because
   * a hard verb beats a blank screen. */
  function safeVerbs(items) {
    var P = window.Profile;
    if (!P || !P.verbOkAt) return items;
    var out = items.filter(function (it) {
      return it.type !== 'cloze' || P.verbOkAt(it.inf, it.tense);
    });
    return out.length ? out : items;
  }

  var _writeSafe = {};
  function safeWriting(tasks) {
    var P = window.Profile, E = window.ENGINE;
    if (!P || !P.verbOkAt || !E || P.params().cefr !== 'A1') return tasks;
    var key = P.current();
    var cache = _writeSafe[key] || (_writeSafe[key] = {});
    var out = tasks.filter(function (t) {
      if (cache[t.id] === undefined) {
        var texts = (t.models || []).concat(t.answer ? [t.answer] : []);
        cache[t.id] = texts.every(function (m) {
          return E.tokenize(m || '').every(function (tok) {
            return E.analyzeToken(tok).every(function (a) { return P.verbOkAt(a.inf, a.tense); });
          });
        });
      }
      return cache[t.id];
    });
    return out.length ? out : tasks;
  }

  // Build today's content bundle.
  // The lesson follows the SYLLABUS: the first not-yet-studied lesson (so you
  // progress in order, one per session; finish them all and it rotates as
  // review). Everything else is gated to your current level — you only meet
  // passages/cloze/writing built from grammar you've been taught.
  function lessonById(id) {
    var lessons = window.GRAMMAR_LESSONS || [];
    for (var i = 0; i < lessons.length; i++) if (lessons[i].id === id) return lessons[i];
    return null;
  }

  function buildContext() {
    if (window.Perf) return window.Perf.mark('session build', buildContextInner);
    return buildContextInner();
  }

  /* Which lesson today is, and where it sits in the course.
   *
   * Split out of buildContext so the home screen can name today's work without
   * also sampling a passage, six cloze items and five writing tasks — Inicio
   * re-renders on every tab switch, and that sampling is the expensive half. */
  function pickFocus() {
    var day = dayNumber();
    var pr = window.Profile ? window.Profile.params() : { name: 'standard', unlockAll: false, produceStyle: 'full' };
    var prog = loadProg();
    var lessons = window.GRAMMAR_LESSONS || [];
    var studied = prog.studied || {};

    var focus, lesson = null, level, dayIndex = null;

    if (pr.usesCurriculum && window.Curriculum) {
      // paced path: grammar/vocab/verb/practice days, grammar spaced out
      var seq = window.Curriculum.seq();
      var di = prog.beginnerDay || 0;
      focus = seq[Math.min(di, seq.length - 1)] || { type: 'practice' };
      /* `di` indexes the BAND's slice; COURSE_UNITS.from indexes the whole
       * course, so the band's start has to be added back before the two can
       * be compared. Getting this wrong shows the learner "day -87 of 10". */
      dayIndex = (window.Curriculum.startOf
        ? window.Curriculum.startOf(pr.cefr || (window.Profile && window.Profile.current()))
        : 0) + Math.min(di, seq.length - 1);
      if (focus.type === 'grammar') lesson = lessonById(focus.id);
      level = 1;
      lessons.forEach(function (l) { if (studied[l.id]) level = Math.max(level, l.level || 1); });
      if (lesson) level = Math.max(level, lesson.level || 1);
    } else {
      /* A lesson from the band you selected, in the order data/course.js puts
       * it in. This used to be a filter — the lesson's own cefr tag, falling
       * back to whether its numeric level was one of the band's gates — which
       * had to guess for the 18 legacy tense lessons that carry no tag, and
       * served a lesson twice over wherever two bands shared a gate. The course
       * says where every lesson belongs, so there is nothing left to infer. */
      var ids = window.Curriculum ? window.Curriculum.lessonsFor(pr.cefr) : [];
      var pool = ids.map(lessonById).filter(function (l) { return !!l; });
      if (!pool.length) pool = lessons.filter(function (l) { return (l.level || 1) <= (pr.maxGate || 99); });
      if (!pool.length) pool = lessons;
      for (var i = 0; i < pool.length; i++) { if (!studied[pool[i].id]) { lesson = pool[i]; break; } }
      if (!lesson) lesson = pool[day % Math.max(1, pool.length)] || null;
      level = lesson ? (lesson.level || 1) : (pr.maxGate || 1);
      focus = lesson ? { type: 'grammar', id: lesson.id } : { type: 'practice' };
      if (pr.unlockAll) level = 99;
      /* B1 and up do not walk a day counter — they take the next unstudied
       * lesson — so dayIndex stayed null and the home card showed no unit at
       * all for three of the five bands. The course knows where the lesson
       * sits; look it up rather than leaving the learner without the goal the
       * lesson is meant to serve. */
      if (lesson && window.COURSE_DAYS) {
        var days = window.COURSE_DAYS;
        for (var k = 0; k < days.length; k++) {
          if (days[k].lesson === lesson.id) { dayIndex = k; focus.unit = days[k].unit || null; break; }
        }
      }
    }
    // Never offer content above the level you are studying: a B1 learner should
    // not meet C1 passages just because the lesson ladder ran ahead.
    if (pr.maxGate) level = Math.min(level, pr.maxGate);
    return { day: day, pr: pr, prog: prog, studied: studied,
             focus: focus, lesson: lesson, level: level, dayIndex: dayIndex };
  }

  function buildContextInner() {
    var f = pickFocus();
    var day = f.day, pr = f.pr, studied = f.studied;
    var focus = f.focus, lesson = f.lesson, level = f.level, dayIndex = f.dayIndex;

    function atLevel(arr) { return arr.filter(function (x) { return (x.level || 1) <= level; }); }

    var passages = atLevel(window.PASSAGES || []);
    var apply = safeVerbs(atLevel(window.APPLY_ITEMS || []));
    var writes = safeWriting(atLevel(window.WRITING_TASKS || []));

    // The FIRST time a grammar lesson is seen (not yet in `studied`), its
    // content is picked with a seed derived from the lesson id — reproducible
    // if you reload mid-session, but distinct lesson to lesson. Once you've
    // studied it and come back around to it again (review rotation), selection
    // is plain Math.random so repeats don't feel identical every time.
    var firstTime = (focus.type === 'grammar' && lesson) ? !studied[lesson.id] : false;
    var rng = firstTime ? UI.seededRandom(lesson.id) : Math.random;

    // Produce: 'guided' (beginner) = a build + a translation, with scaffolding.
    // 'full' = also open free-writing and, from level 2+, a connected paragraph.
    var builds = writes.filter(function (t) { return t.type === 'build'; });
    var trans = writes.filter(function (t) { return t.type === 'translate'; });
    var frees = writes.filter(function (t) { return t.type === 'write'; });
    var paras = writes.filter(function (t) { return t.type === 'paragraph'; });
    // A long session is the same session with more of it — not extra stages.
    var big = mode === 'larga';
    var produce;
    if (pr.produceStyle === 'guided') {
      produce = [].concat(sample(builds, 1, rng))
        .concat(sample(preferAligned(trans, focus, writeMatchesFocus), big ? 2 : 1, rng));
    } else {
      produce = []
        .concat(sample(builds, 1, rng))
        .concat(sample(preferAligned(trans, focus, writeMatchesFocus), big ? 2 : 1, rng))
        .concat(sample(preferAligned(frees, focus, writeMatchesFocus), big ? 3 : 2, rng))
        .concat(level >= 2 ? sample(preferAligned(paras, focus, writeMatchesFocus), 1, rng) : []);
    }

    /* Which passage to read. Three tiers, because the fallback used to be "any
     * passage at this level" and that put a reading about a final exam on day
     * one of "Meet someone" — the learner's very first session, and nothing
     * about it connected to the unit they had just been taught.
     *
     * 1. a passage that actually USES today's grammar/verbs/vocabulary
     * 2. failing that, one on the same theme as today's lesson
     * 3. failing that, anything at this level — and the stage says so, rather
     *    than presenting it as though it followed on. */
    var aligned = passages.filter(function (x) { return passageUsesFocus(x, focus); });
    var themed = [];
    if (!aligned.length && lesson && lesson.theme) {
      themed = passages.filter(function (x) { return x.theme === lesson.theme; });
    }
    var storyPool = aligned.length ? aligned : (themed.length ? themed : passages);
    var storyTier = aligned.length ? 'focus' : (themed.length ? 'theme' : 'level');

    return {
      day: day,
      dayIndex: dayIndex,
      level: level,
      profile: pr.name,
      focus: focus,
      dateLabel: new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
      lesson: lesson,
      mode: mode,
      passage: pick(storyPool.length ? storyPool : passages, rng),
      passageTier: storyTier,
      applyItems: sampleAligned(apply, focus, big ? 12 : (mode === 'corto' ? 4 : 6), clozeMatchesFocus, rng),
      writeTasks: produce,
      results: {}
    };
  }

  // Short label for a day's teaching focus (used on the intro + complete cards).
  var CAT_LABEL = {
    greetings: 'Greetings', people: 'People & family', food: 'Food & drink', home: 'Home',
    time: 'Time & days', numbers: 'Numbers', colors: 'Colours', places: 'Places',
    travel: 'Travel', body: 'The body', nature: 'Nature & weather', adjectives: 'Describing things',
    weather: 'Weather', clothing: 'Clothing', animals: 'Animals', questions: 'Question words',
    connectors: 'Linking words', common: 'Everyday words', school: 'School', health: 'Health',
    shopping: 'Shopping', sports: 'Sports', kitchen: 'Kitchen', work: 'Work'
  };
  /* Where today sits in its unit — "Meet someone · day 3 of 10".
   * The course is 63 units now, and without this a learner sees a lesson
   * title and no sense of what it is part of or how far through they are.
   * Returns null for the days not yet in a unit, and for optional units,
   * which have no position in time. */
  function unitLabel(ctx) {
    var f = ctx.focus;
    if (!f || !f.unit) return null;
    var u = (window.COURSE_UNITS || {})[f.unit];
    if (!u || u.optional || u.from == null) return null;
    var day = (ctx.dayIndex != null ? ctx.dayIndex : -1) - u.from + 1;
    return { title: u.title, goal: u.goal,
             day: day > 0 && day <= u.length ? day : null, of: u.length };
  }

  function focusLabel(ctx) {
    var f = ctx.focus || { type: 'grammar' };
    if (f.type === 'grammar') return ctx.lesson ? ctx.lesson.title : 'A grammar lesson';
    if (f.type === 'vocab') return 'New words · ' + ((CAT_LABEL[f.cat] || f.cat) + (f.part ? ' ' + f.part : ''));
    if (f.type === 'verbs') return 'New verbs · ' + f.verbs.slice(0, 3).join(', ') + (f.verbs.length > 3 ? '…' : '');
    return 'Practice & review day';
  }
  // ---- progress / streak -------------------------------------------------
  function loadProg() { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; } }
  function saveProg(o) { try { localStorage.setItem(PKEY, JSON.stringify(o)); } catch (e) {} }
  function bumpStreak() {
    var p = loadProg(), day = dayNumber();
    // record the active day for the dashboard heatmap (even if already counted today)
    p.history = p.history || [];
    if (p.history.indexOf(day) === -1) p.history.push(day);
    if (p.lastDay === day) { saveProg(p); return p; }
    p.streak = (p.lastDay === day - 1) ? (p.streak || 0) + 1 : 1;
    p.lastDay = day; p.total = (p.total || 0) + 1;
    saveProg(p); return p;
  }

  // ---- rendering ---------------------------------------------------------
  var host, bar, ctx, idx;

  function setProgress(done, total) {
    bar.style.width = Math.round(100 * done / total) + '%';
  }

  /* What today is, without building a whole session for it.
   * The home screen used to say "Sesión diaria · Review · lesson · reading ·
   * apply · write" every single day — the same words whatever the day held.
   * Everything needed to say something true was already computed one screen
   * later, on an intro card the learner had to commit to a session to see. */
  function today() {
    var f = pickFocus();
    var c = { focus: f.focus, lesson: f.lesson, dayIndex: f.dayIndex, passage: null };
    return {
      unit: unitLabel(c),
      focus: f.focus,
      lessonTitle: homeLabel(c),
      canSkipLesson: !f.pr.usesCurriculum && f.focus && f.focus.type === 'grammar' && !!f.lesson,
      lessonId: f.lesson ? f.lesson.id : null,
    };
  }

  /* What today is, in as few words as the home card needs. focusLabel is kept
   * for the completion screen, where naming the individual verbs is the point
   * of the line; on the home card it was a comma list that changed nothing
   * about what the learner was going to do next. */
  function homeLabel(c) {
    var f = c.focus || { type: 'grammar' };
    if (f.type === 'grammar') return c.lesson ? c.lesson.title : T('Una lección', 'A lesson');
    if (f.type === 'verbs') return T('Verbos nuevos', 'New verbs');
    if (f.type === 'vocab') return T('Palabras nuevas', 'New words');
    return T('Práctica y repaso', 'Practice and review');
  }
  var STAGE_LABEL_ES = { review: 'Repasar', learn: 'Aprender', comprehend: 'Comprender',
                         apply: 'Aplicar', produce: 'Producir' };
  var STAGE_LABEL_EN = { review: 'Review', learn: 'Learn', comprehend: 'Understand',
                         apply: 'Apply', produce: 'Produce' };
  function stageLabel(k) { return T(STAGE_LABEL_ES[k], STAGE_LABEL_EN[k]); }

  // Mark today's lesson studied without taking it — a rusty ex-speaker often
  // already knows it cold. Offered on the home card, not buried in a session.
  function skipLesson() {
    var f = pickFocus();
    if (!f.lesson) return;
    var pp = loadProg();
    pp.studied = pp.studied || {}; pp.studied[f.lesson.id] = 1;
    saveProg(pp);
  }

  function pauseToShell() {
    if (window.Shell) { window.Shell.closeOverlay(); window.Shell.go('inicio'); }
  }

  function runStage() {
    var all = stages();
    if (idx >= all.length) { renderComplete(); return; }
    setProgress(idx, all.length);
    UI.clear(host);
    var stage = all[idx];
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', stage.icon + '  ' + stageLabel(stage.key)));
    var right = UI.el('span', 'stage-count');
    right.appendChild(UI.el('span', null, T('Paso', 'Step') + ' ' + (idx + 1) + ' / ' + all.length + '  '));
    var exitB = UI.el('button', 'ghost-btn small', '✕ ' + T('pausar', 'pause')); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', pauseToShell);
    right.appendChild(exitB);
    head.appendChild(right);
    host.appendChild(head);
    var body = UI.el('div', 'stage-body');
    host.appendChild(body);
    stage.run(body, ctx, function () {
      if (stage.key === 'learn') {
        var p = loadProg();
        var pr = window.Profile ? window.Profile.params() : { name: 'standard' };
        if (pr.usesCurriculum) {               // paced path: step through the curriculum
          p.beginnerDay = (p.beginnerDay || 0) + 1;
          if (ctx.focus && ctx.focus.type === 'grammar' && ctx.lesson) { p.studied = p.studied || {}; p.studied[ctx.lesson.id] = 1; }
        } else if (ctx.lesson) {               // standard/refresher: a grammar lesson each day
          p.studied = p.studied || {}; p.studied[ctx.lesson.id] = 1;
        }
        saveProg(p);
      }
      idx++; runStage();
    });
  }

  function renderComplete() {
    setProgress(1, 1);
    var p = bumpStreak();
    UI.clear(host);
    var wrap = UI.el('div', 'panel intro complete');
    wrap.appendChild(UI.el('div', 'big-check', '✓'));
    wrap.appendChild(UI.el('h1', null, T('Sesión terminada', 'Session done')));
    wrap.appendChild(UI.el('div', 'streak-badge', '🔥 ' + (p.streak || 1) + (p.streak === 1 ? ' día seguido' : ' días seguidos')));
    var r = ctx.results;
    var lines = [];
    if (r.review) lines.push('Reviewed <b>' + r.review.seen + '</b> items — ' + r.review.correct + ' right');
    // Only name a focus if the lesson stage actually ran; a quick review has none.
    if (r.learn || modeDef().keys.indexOf('learn') !== -1) lines.push('Lesson: <b>' + focusLabel(ctx) + '</b>');
    if (r.comprehend) lines.push('Reading: <b>' + r.comprehend.correct + '/' + r.comprehend.total + '</b>');
    if (r.apply) lines.push('Grammar in context: <b>' + r.apply.correct + '/' + r.apply.total + '</b>');
    if (r.produce) lines.push('Wrote <b>' + r.produce.done + '</b> ' + (r.produce.done === 1 ? 'thing' : 'things') + ' of your own');
    var ul = UI.el('ul', 'summary-list');
    lines.forEach(function (l) { ul.appendChild(UI.el('li', null, l)); });
    wrap.appendChild(ul);
    /* The moment to offer a deep dive is right after the mistakes were made,
     * not on a menu the learner was supposed to browse. Returns null — and
     * appends nothing — unless the same thing has been missed repeatedly. */
    if (window.Suggest) {
      var sc = window.Suggest.card(function (u) {
        window.App.go('home');
        if (window.Shell) window.Shell.go('mas');
        if (window.DeepDive) {
          var hostEl = document.getElementById('tab-host') || document.getElementById('stage-host');
          window.DeepDive.render(hostEl, function () { window.Shell.go('mas'); }, u.id);
        }
      });
      if (sc) wrap.appendChild(sc);
    }
    wrap.appendChild(UI.el('p', 'muted', T('Hasta mañana — tomorrow rotates to new material.', 'See you tomorrow — it rotates to new material.')));
    var homeB = UI.nextBtn('← ' + T('Volver al inicio', 'Back to home'), function () { window.App.go('home'); });
    wrap.appendChild(homeB);
    var again = UI.nextBtn(T('Hacerla otra vez', 'Do it again'), function () { start(mode); });
    again.className = 'ghost-btn';
    wrap.appendChild(again);
    host.appendChild(wrap);
  }

  /* Straight into the first stage. There used to be an intro screen here
   * naming the unit, the goal and today's lesson; all of that now lives on
   * the home card, which is where the learner decides whether to start. */
  function start(m) {
    if (m && MODES[m]) mode = m;
    host = document.getElementById('stage-host');
    bar = document.getElementById('session-progress-fill');
    ctx = buildContext();
    idx = 0;
    runStage();
  }

  return {
    start: start,
    today: today,
    skipLesson: skipLesson,
    modes: function () { return [MODES.rapido, MODES.corto, MODES.diaria, MODES.larga]; },
    mode: function () { return modeDef(); },
    resume: function () { host = document.getElementById('stage-host'); bar = document.getElementById('session-progress-fill'); if (idx >= 0 && ctx) runStage(); else start(); },
    isActive: function () { return idx >= 0 && idx < stages().length; },
    currentStageIndex: function () { return idx; },
    stageCount: function () { return stages().length; }
  };
})();
