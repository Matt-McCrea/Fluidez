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

  // Ordered stages (each module exposes { key, label, icon, run(host, ctx, done) }).
  function stages() {
    return [window.StageReview, window.StageLearn, window.StageComprehend, window.StageApply, window.StageProduce];
  }

  function dayNumber() {
    return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  }
  function rotate(arr, day, count, stride) {
    if (!arr.length) return [];
    var out = [], start = (day * (stride || 1)) % arr.length;
    for (var i = 0; i < Math.min(count, arr.length); i++) out.push(arr[(start + i) % arr.length]);
    return out;
  }

  // Build today's content bundle.
  // The lesson follows the SYLLABUS: the first not-yet-studied lesson (so you
  // progress in order, one per session; finish them all and it rotates as
  // review). Everything else is gated to your current level — you only meet
  // passages/cloze/writing built from grammar you've been taught.
  function buildContext() {
    var day = dayNumber();
    var pr = window.Profile ? window.Profile.params() : { unlockAll: false, produceStyle: 'full' };
    var lessons = window.GRAMMAR_LESSONS || [];
    var studied = loadProg().studied || {};

    var lesson = null;
    for (var i = 0; i < lessons.length; i++) {
      if (!studied[lessons[i].id]) { lesson = lessons[i]; break; }
    }
    var level;
    if (lesson) { level = lesson.level || 1; }
    else {                                     // syllabus complete → rotate, all levels open
      lesson = lessons[day % Math.max(1, lessons.length)] || null;
      level = 99;
    }
    if (pr.unlockAll) level = 99;              // refresher: all content from day one
    function atLevel(arr) { return arr.filter(function (x) { return (x.level || 1) <= level; }); }

    var passages = atLevel(window.PASSAGES || []);
    var apply = atLevel(window.APPLY_ITEMS || []);
    var writes = atLevel(window.WRITING_TASKS || []);

    // Produce: 'guided' (beginner) = a build + a translation, with scaffolding.
    // 'full' = also open free-writing and, from level 2+, a connected paragraph.
    var builds = writes.filter(function (t) { return t.type === 'build'; });
    var trans = writes.filter(function (t) { return t.type === 'translate'; });
    var frees = writes.filter(function (t) { return t.type === 'write'; });
    var paras = writes.filter(function (t) { return t.type === 'paragraph'; });
    var produce;
    if (pr.produceStyle === 'guided') {
      produce = [].concat(rotate(builds, day, 1, 1)).concat(rotate(trans, day, 1, 1));
    } else {
      produce = []
        .concat(rotate(builds, day, 1, 1))
        .concat(rotate(trans, day, 1, 1))
        .concat(rotate(frees, day, 2, 2))
        .concat(level >= 2 ? rotate(paras, day, 1, 1) : []);
    }

    return {
      day: day,
      level: level,
      dateLabel: new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
      lesson: lesson,
      passage: passages.length ? passages[day % passages.length] : null,
      applyItems: rotate(apply, day, 6, 3),
      writeTasks: produce,
      results: {}
    };
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

  function renderIntro() {
    UI.clear(host);
    var p = loadProg();
    var wrap = UI.el('div', 'panel intro');
    wrap.appendChild(UI.el('div', 'eyebrow', 'Tu sesión de hoy'));
    wrap.appendChild(UI.el('h1', null, ctx.dateLabel));
    wrap.appendChild(UI.el('p', 'muted', 'A short, complete workout for your Spanish — review, a grammar lesson, reading, applying it in context, and writing your own. About 15–20 minutes.'));
    if (p.streak) wrap.appendChild(UI.el('div', 'streak-badge', '🔥 ' + p.streak + '-day streak'));

    var list = UI.el('ol', 'stage-list');
    var meta = [
      ['🔁', 'Repasar', 'Review what\'s due (and meet a few new words)'],
      ['📖', 'Aprender', ctx.lesson ? ctx.lesson.title : 'A grammar lesson'],
      ['👂', 'Comprender', ctx.passage ? '“' + ctx.passage.title + '”' : 'Read & understand'],
      ['🧩', 'Aplicar', 'Use the grammar in real sentences'],
      ['✍️', 'Producir', 'Write your own Spanish']
    ];
    meta.forEach(function (m) {
      var li = UI.el('li', 'stage-row');
      li.appendChild(UI.el('span', 'stage-ico', m[0]));
      li.appendChild(UI.el('span', 'stage-name', '<b>' + m[1] + '</b><br><span class="muted">' + m[2] + '</span>'));
      list.appendChild(li);
    });
    wrap.appendChild(list);
    wrap.appendChild(UI.nextBtn('Empezar →', function () { idx = 0; runStage(); }));
    host.appendChild(wrap);
    setProgress(0, 1);
  }

  function runStage() {
    var all = stages();
    if (idx >= all.length) { renderComplete(); return; }
    setProgress(idx, all.length);
    UI.clear(host);
    var stage = all[idx];
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', stage.icon + '  ' + stage.label));
    head.appendChild(UI.el('span', 'stage-count', 'Paso ' + (idx + 1) + ' / ' + all.length));
    host.appendChild(head);
    var body = UI.el('div', 'stage-body');
    host.appendChild(body);
    stage.run(body, ctx, function () {
      // completing the Learn stage advances the syllabus — but a slow profile
      // repeats each lesson `syllabusPace` times before it counts as studied.
      if (stage.key === 'learn' && ctx.lesson) {
        var p = loadProg();
        var pr = window.Profile ? window.Profile.params() : { syllabusPace: 1 };
        p.studied = p.studied || {}; p.studyCount = p.studyCount || {};
        p.studyCount[ctx.lesson.id] = (p.studyCount[ctx.lesson.id] || 0) + 1;
        if (p.studyCount[ctx.lesson.id] >= (pr.syllabusPace || 1)) p.studied[ctx.lesson.id] = 1;
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
    wrap.appendChild(UI.el('h1', null, '¡Sesión completa!'));
    wrap.appendChild(UI.el('div', 'streak-badge', '🔥 ' + (p.streak || 1) + '-day streak'));
    var r = ctx.results;
    var lines = [];
    if (r.review) lines.push('Reviewed <b>' + r.review.seen + '</b> items (' + r.review.correct + ' correct)');
    if (ctx.lesson) lines.push('Learned <b>' + ctx.lesson.title + '</b>');
    if (r.comprehend) lines.push('Comprehension: <b>' + r.comprehend.correct + '/' + r.comprehend.total + '</b>');
    if (r.apply) lines.push('Applied grammar: <b>' + r.apply.correct + '/' + r.apply.total + '</b>');
    if (r.produce) lines.push('Wrote <b>' + r.produce.done + '</b> pieces of your own Spanish');
    var ul = UI.el('ul', 'summary-list');
    lines.forEach(function (l) { ul.appendChild(UI.el('li', null, l)); });
    wrap.appendChild(ul);
    wrap.appendChild(UI.el('p', 'muted', '¡Hasta mañana! Come back tomorrow for a fresh session.'));
    var homeB = UI.nextBtn('← Volver al inicio', function () { window.App.go('home'); });
    wrap.appendChild(homeB);
    var again = UI.nextBtn('Review today\'s session again', function () { start(); });
    again.className = 'ghost-btn';
    wrap.appendChild(again);
    host.appendChild(wrap);
  }

  function start() {
    host = document.getElementById('stage-host');
    bar = document.getElementById('session-progress-fill');
    ctx = buildContext();
    idx = -1;
    renderIntro();
  }

  return { start: start };
})();
