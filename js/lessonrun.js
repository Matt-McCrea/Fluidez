/* ============================================================================
 * LESSON RUN — take a single lesson on demand, taught exactly as in the daily
 * session (the Learn stage), then return where you came from. Lets you *do* any
 * lesson from the progress catalogue — grammar, vocab or verbs — not just read
 * it. Completing a grammar lesson marks it studied (updates ticks + level).
 * ========================================================================== */
window.LessonRun = (function () {
  var UI = window.UI, PKEY = 'fluidez.progress';

  function lessonById(id) {
    var ls = window.GRAMMAR_LESSONS || [];
    for (var i = 0; i < ls.length; i++) if (ls[i].id === id) return ls[i];
    return null;
  }
  function markStudied(id) {
    var p; try { p = JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { p = {}; }
    p.studied = p.studied || {}; p.studied[id] = 1;
    try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {}
  }

  // focus: { type:'grammar', id } | { type:'vocab', cat, words } | { type:'verbs', verbs }
  function run(focus, back) {
    var host = document.getElementById('stage-host');
    UI.clear(host);
    var lesson = focus.type === 'grammar' ? lessonById(focus.id) : null;
    var ctx = { focus: focus, lesson: lesson, results: {}, standalone: true };

    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', '📖 Lección'));
    var b = UI.el('button', 'ghost-btn', '← Volver'); b.type = 'button'; b.addEventListener('click', back);
    head.appendChild(b);
    host.appendChild(head);

    var body = UI.el('div');
    host.appendChild(body);

    window.StageLearn.run(body, ctx, function () {
      if (focus.type === 'grammar' && lesson) markStudied(lesson.id);
      back();
    });
  }

  return { run: run };
})();
