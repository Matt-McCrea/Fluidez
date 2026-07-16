/* ============================================================================
 * LESSON RUN — take a lesson on demand as a proper mini-session, not just a
 * quick check. A grammar lesson runs the full arc, centred on its tense:
 *     Aprender (taught + conjugation tabs + quick check)
 *   → Comprender (a short story that USES the tense)
 *   → Aplicar (cloze practice in the tense)
 *   → Producir (write your own sentences in the tense)
 * Vocab/verb lessons stay a focused teach + quick check. Completing a grammar
 * lesson marks it studied. Reuses the daily session's stage modules.
 * ========================================================================== */
window.LessonRun = (function () {
  var UI = window.UI, E = window.ENGINE, PKEY = 'fluidez.progress';

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

  // ---- tense-focused content pickers --------------------------------------
  function clozeForTense(tk) {
    return (window.APPLY_ITEMS || []).filter(function (it) { return it.type === 'cloze' && it.tense === tk; }).slice(0, 6);
  }
  function usesTense(task, tk) {
    return (task.constraints || []).some(function (c) {
      return (c.type === 'anyVerbInTense' || c.type === 'verbFormAny') && c.tense === tk;
    });
  }
  function writesForTense(tk, lesson) {
    var out = [];
    (window.WRITING_TASKS || []).forEach(function (t) {
      if ((t.type === 'write' || t.type === 'translate' || t.type === 'paragraph') && usesTense(t, tk)) out.push(t);
    });
    (window.TOPICS || []).forEach(function (top) {
      (top.prompts || []).forEach(function (pr) { if (usesTense(pr, tk)) out.push(pr); });
    });
    if (!out.length) {                       // synthesise one, seeded with example models from the lesson
      var models = (lesson.examples || []).filter(function (ex) {
        return E.analyzeSentence(ex.es).verbs.some(function (v) { return v.analyses.some(function (a) { return a.tense === tk; }); });
      }).map(function (ex) { return ex.es; }).slice(0, 1);
      out.push({ prompt: 'Write two or three sentences of your own using the ' + E.TENSE_LABEL[tk] + '.',
        hint: 'Use the ' + E.TENSE_LABEL[tk] + ' at least once.',
        constraints: [{ type: 'anyVerbInTense', tense: tk }, { type: 'minWords', n: 8 }], models: models });
    }
    return out.slice(0, 2);
  }
  function passageForTense(tk, level) {
    var ps = window.PASSAGES || [];
    function uses(p) {
      var a = E.analyzeSentence(p.text);
      return a.verbs.some(function (v) { return v.analyses.some(function (x) { return x.tense === tk; }); }) ||
             a.compounds.some(function (c) { return c.parts.some(function (x) { return x.tense === tk; }); });
    }
    return ps.filter(function (p) { return (p.level || 1) <= level && uses(p); })[0] ||
           ps.filter(uses)[0] || null;
  }

  // ---- mini-session runner -------------------------------------------------
  function run(focus, back) {
    var host = document.getElementById('stage-host');
    var lesson = focus.type === 'grammar' ? lessonById(focus.id) : null;
    var ctx = { focus: focus, lesson: lesson, results: {},
      profile: window.Profile ? window.Profile.current() : 'standard' };

    var seq = [window.StageLearn];
    if (lesson) {
      var tk = lesson.id;
      ctx.level = lesson.level || 1;
      ctx.passage = passageForTense(tk, ctx.level);
      ctx.applyItems = clozeForTense(tk);
      ctx.writeTasks = writesForTense(tk, lesson);
      if (ctx.passage) seq.push(window.StageComprehend);
      if (ctx.applyItems.length) seq.push(window.StageApply);
      if (ctx.writeTasks.length) seq.push(window.StageProduce);
    }

    var i = 0;
    function step() {
      if (i >= seq.length) {
        if (lesson) markStudied(lesson.id);
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
      wrap.appendChild(UI.el('h1', null, lesson ? '¡Lección completa!' : '¡Hecho!'));
      wrap.appendChild(UI.el('p', 'muted', lesson ? ('You worked through ' + lesson.title + ' — taught, read, applied and written.') : 'Nice work.'));
      wrap.appendChild(UI.nextBtn('← Volver', back));
      host.appendChild(wrap);
    }

    step();
  }

  return { run: run };
})();
