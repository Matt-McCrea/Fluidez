/* ============================================================================
 * STAGE 5 — PRODUCIR (Produce). The output stage: you create Spanish.
 *
 *   build     : click scrambled words into order (auto-checked warm-up)
 *   translate : translate an English sentence — LIVE constraint checklist as
 *               you type (engine-verified), then compare with a model
 *   write     : constrained free writing — same live checklist + model compare
 *   essay     : B2/C1 extended production — plan, draft, model, self-mark,
 *               revise. Handed to js/essay.js, which owns the four phases;
 *               this file only decides that an essay is not a `write` with a
 *               taller box (it was, for one afternoon, and the phases are the
 *               entire difference).
 *
 * The live checklist is the app's signature: because the engine can analyse
 * any conjugated form, we verify *mechanics* automatically ("uses the
 * preterite", "conjugated for yo", "includes ayer") while the model comparison
 * covers naturalness. Both automated checking and check-yourself, as designed.
 * ========================================================================== */
window.StageProduce = (function () {
  var UI = window.UI, E = window.ENGINE, C = window.Checker;

  /* The matcher's hints come from the library in English; from B1 they sit under a Spanish label. */
  function hintText(h) { return (UI.t('y', 'n') === 'y' ? 'Pista: ' : '') + h; }

  // ---- scrambled sentence builder ----------------------------------------
  function runBuild(body, task, next) {
    body.appendChild(UI.el('h2', 'q-text', UI.t('Arma la frase:', 'Build the sentence:')));
    body.appendChild(UI.el('p', 'muted', '“' + task.en + '”'));

    var words = task.answer.replace(/[.!?]$/, '').split(' ');
    var scrambled = E.shuffle(words.slice());
    // re-scramble if it landed in the right order (spoils the task)
    if (scrambled.join(' ') === words.join(' ') && words.length > 2) scrambled.reverse();

    var line = UI.el('div', 'build-line');       // chosen words appear here
    var bank = UI.el('div', 'word-bank');        // pool of remaining words
    var fb = UI.el('div', 'feedback');
    var chosen = [];                             // indices into `scrambled`

    function render() {
      UI.clear(line); UI.clear(bank);
      chosen.forEach(function (si, ci) {
        var b = UI.el('button', 'word-chip chosen', scrambled[si]); b.type = 'button';
        b.addEventListener('click', function () { chosen.splice(ci, 1); render(); });
        line.appendChild(b);
      });
      if (!chosen.length) line.appendChild(UI.el('span', 'muted', UI.t('toca las palabras de abajo en orden…', 'click the words below in order…')));
      scrambled.forEach(function (w, si) {
        var used = chosen.indexOf(si) !== -1;
        var b = UI.el('button', 'word-chip' + (used ? ' used' : ''), w); b.type = 'button';
        if (!used) b.addEventListener('click', function () { chosen.push(si); render(); check(); });
        bank.appendChild(b);
      });
    }

    function check() {
      if (chosen.length !== words.length) { fb.textContent = ''; fb.className = 'feedback'; return; }
      var built = chosen.map(function (si) { return scrambled[si]; }).join(' ');
      if (built === words.join(' ')) {
        fb.textContent = '¡Correcto! ' + task.answer;
        fb.className = 'feedback good';
        setTimeout(next, 900);
      } else {
        fb.textContent = UI.t('Casi. Toca una palabra para devolverla.', 'Not quite. Click a word to send it back.');
        fb.className = 'feedback bad';
      }
    }

    body.appendChild(line);
    body.appendChild(bank);
    body.appendChild(fb);
    render();
  }

  /* A telegram is a bare string of nouns ("Necesito cita lunes"). Correct Spanish
   * must never be held back, so the check stays out of the way whenever the text
   * passes the task, matches a model, or has a conjugated verb in three or more
   * words. */
  function substantial(analysis, text, task, res) {
    var toks = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (toks.length >= 6) return true;
    var specs = (task && task.constraints) || [];
    var core = specs.filter(function (c) { return c.type !== 'containsAny' && c.type !== 'containsWord'; });
    if (core.length && res && res.allPass) return true;
    var M = window.LIB && window.LIB.match;
    if (M && task && task.models) {
      for (var i = 0; i < task.models.length; i++) {
        var m = String(task.models[i]).replace(/<[^>]*>/g, '');
        try { if (M.matchTranslation(text, { es: m, en: '', accept: [] }, { accents: 'lenient' }).pass) return true; } catch (e) {}
      }
    }
    var hasVerb = !!(analysis && (analysis.verbs.length || analysis.compounds.length));
    return hasVerb && toks.length >= 3;
  }

  // ---- constrained writing (translate / free write / paragraph) -----------
  function runWrite(body, task, next) {
    var isPara = task.type === 'paragraph';
    body.appendChild(UI.el('h2', 'q-text', task.prompt));
    if (task.hint) body.appendChild(UI.el('p', 'muted small', '💡 ' + UI.t('Pista', 'Hint') + ': ' + task.hint));

    var ta = UI.el('textarea', 'answer-area');
    ta.rows = isPara ? 7 : 3; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;

    var counter = isPara ? UI.el('div', 'muted small write-counter') : null;
    var checklist = UI.el('ul', 'constraint-list');
    var modelBox = UI.el('div');
    var doneB = UI.el('button', 'primary-btn', UI.t('Compara con el modelo →', 'Compare with model →')); doneB.type = 'button';
    doneB.disabled = true;
    var skipB = UI.el('button', 'ghost-btn', UI.t('Ver el modelo (no me sale)', 'Show model (I\'m stuck)')); skipB.type = 'button';

    body.appendChild(ta);
    body.appendChild(UI.accentBar(function () { return ta; }));
    if (counter) body.appendChild(counter);
    body.appendChild(UI.el('div', 'checklist-title muted', (isPara ? UI.t('Tu párrafo debe…', 'Your paragraph needs to…') : UI.t('Tu frase debe…', 'Your sentence needs to…'))));
    body.appendChild(checklist);
    body.appendChild(modelBox);
    var row = UI.el('div', 'row-controls');
    row.appendChild(doneB); row.appendChild(skipB);
    body.appendChild(row);
    ta.focus();

    var lastRes = null, warned = false;
    var telegramNote = UI.el('p', 'muted small hidden', UI.t('Suena a telegrama: agrega las palabras pequeñas (el, la, un, mi, me, te) e inténtalo otra vez.', 'That reads like a telegram: add the small words (el, la, un, mi, me, te) and try again.'));
    body.insertBefore(telegramNote, modelBox);
    function renderCheck() {
      var res = C.checkWriting(task, ta.value);
      UI.clear(checklist);
      var seenAdv = {}, rows = [];
      res.results.forEach(function (r, ri) {
        var spec = (task.constraints || [])[ri] || {};
        if (r.advisory) {
          var lab = spec.label || r.label;
          if (seenAdv[lab] != null) { if (r.pass) rows[seenAdv[lab]].pass = true; return; }
          seenAdv[lab] = rows.length;
          rows.push({ pass: r.pass, advisory: true, label: lab, detail: r.detail });
        } else rows.push(r);
      });
      rows.forEach(function (r) {
        var li = UI.el('li', 'constraint ' + (r.pass ? 'pass' : 'todo') + (r.advisory ? ' advisory' : ''),
          (r.pass ? '✓ ' : '○ ') + r.label + (r.detail ? ' <span class="muted">(' + r.detail + ')</span>' : ''));
        checklist.appendChild(li);
      });
      if (counter) {
        var words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        var sentences = (ta.value.match(/[.!?]+/g) || []).length;
        counter.textContent = words + ' words · ' + sentences + ' sentence' + (sentences === 1 ? '' : 's');
      }
      doneB.disabled = !res.allPass;
      lastRes = res;
      return res;
    }
    ta.addEventListener('input', renderCheck);
    renderCheck();

    var shown = false;
    function showModel(passed) {
      if (shown) { next(passed); return; }
      shown = true;
      var models = task.models || [];
      var html = models.map(function (m) { return '<div class="model-answer">' + m + '</div>'; }).join('');
      modelBox.appendChild(UI.el('div', null,
        '<div class="checklist-title muted">' + (models.length > 1 ? UI.t('Respuestas modelo', 'Model answers') : UI.t('Respuesta modelo', 'Model answer')) + ':</div>' + html +
        '<p class="muted small">' + UI.t('Compara palabra por palabra. ¿Lo dijiste de forma natural? Las diferencias de vocabulario están bien; fíjate en las formas del verbo y las palabras pequeñas.', 'Compare word by word. Did you say it a natural way? Differences in vocabulary are fine; look at the verb forms and little words.') + '</p>'));
      doneB.textContent = UI.t('Siguiente →', 'Next →');
      doneB.disabled = false;
      skipB.classList.add('hidden');
    }
    doneB.addEventListener('click', function () {
      if (shown) { next(true); return; }
      /* A telegram ("Necesito cita lunes") is held back once, with a note, and
       * let through on the second try. */
      if (!warned && lastRes && !substantial(lastRes.analysis, ta.value, task, lastRes)) {
        warned = true; telegramNote.classList.remove('hidden'); return;
      }
      showModel(true);
    });
    skipB.addEventListener('click', function () { showModel(false); });
  }

  /* ---- translate from the sentence bank -------------------------------------
   * A bank task carries the model (`es`) and the accepted alternatives
   * (`accept`), so it is graded by LIB.match.matchTranslation instead of the
   * constraint checklist: right is right whatever words the learner chose. One
   * self-correction (lib/match/attempt.ts): a miss shows the matcher's one line
   * hint and lets the learner try again; a second miss shows the model. Both
   * attempts count once. A right answer says "Right" and shows the model only
   * when the matcher noted something (a kept pronoun, an accent slip). */
  function lines(s) { return String(s || '').replace(/\n/g, '<br>'); }
  function runBankTranslate(body, task, next) {
    var M = window.LIB && window.LIB.match;
    body.appendChild(UI.el('h2', 'q-text', task.lead ? UI.t('Dilo:', 'Say it:') : UI.t('Dilo en español:', 'Say it in Spanish:')));
    if (task.lead) body.appendChild(UI.el('p', 'muted', emph(task.lead)));
    body.appendChild(UI.el('p', 'cloze-text', '“' + lines(task.prompt) + '”'));
    var ta = UI.el('textarea', 'answer-area');
    ta.rows = 2; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;
    var fb = UI.el('div', 'feedback');
    var go = UI.el('button', 'primary-btn', UI.t('Revisa', 'Check')); go.type = 'button';
    var skip = UI.el('button', 'ghost-btn', UI.t('Ver la respuesta (no me sale)', 'Show answer (I\'m stuck)')); skip.type = 'button';
    var row = UI.el('div', 'row-controls');
    row.appendChild(go); row.appendChild(skip);
    body.appendChild(ta);
    body.appendChild(UI.accentBar(function () { return ta; }));
    body.appendChild(fb);
    body.appendChild(row);
    ta.focus();

    var state = M ? M.startAttempt({ es: task.es, en: task.prompt, accept: task.accept || [] }, { accents: 'lenient' }) : null;
    var finished = false;

    function finish(ok, html, cls) {
      finished = true;
      fb.className = 'feedback ' + cls;
      fb.innerHTML = html;
      ta.readOnly = true;
      skip.classList.add('hidden');
      go.textContent = UI.t('Siguiente →', 'Next →'); go.disabled = false;
      go.onclick = function () { next(ok); };
    }
    function reveal(hint) {
      if (window.ErrorLog) window.ErrorLog.record({ id: 'err:translate:' + E.normalize(task.es), front: task.prompt,
        back: task.es, hint: hint || null, kind: 'error', source: 'produce-translate', reviewable: true });
      finish(false, '<div class="model-answer">' + lines(task.es) + '</div>' + (hint ? '<div class="muted small">' + hintText(hint) + '</div>' : ''), 'bad');
    }
    function submit() {
      if (finished) return;
      var text = ta.value.trim();
      if (!text) return;
      if (!M) { reveal(null); return; }
      var step = M.submitAttempt(state, text);
      state = step.state;
      var res = step.result;
      if (step.status === 'correct') {
        var note = res.note || (res.near ? res.hint : '');
        finish(true, UI.t('Bien', 'Right') + (note ? '. ' + hintText(note) + '<div class="model-answer">' + lines(task.es) + '</div>' : ''), 'good');
      } else if (step.status === 'retry') {
        fb.className = 'feedback bad';
        fb.textContent = (res.hint ? hintText(res.hint) : UI.t('Casi.', 'Not quite.')) + ' ' + UI.t('Inténtalo otra vez.', 'Try once more.');
        ta.focus();
      } else {
        reveal(res.hint || null);
      }
    }
    go.onclick = submit;
    skip.addEventListener('click', function () { if (!finished) reveal(null); });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (finished) go.click(); else submit(); }
    });
  }


  /* ---- scripted scene --------------------------------------------------------
   * One dialogue at the end of Produce on a task day, a practice day and every
   * fourth lesson day. Each turn: the NPC line (Spanish, English muted), the
   * intent in English, a text box. Graded by Scenes.grade (matcher or the
   * turn's own constraints), one retry with the matcher's hint, then the model
   * line. Untimed. The position is saved through ctx.step after every turn. */
  function readProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }
  function sceneDay(ctx) {
    var S = window.Scenes, days = window.COURSE_DAYS;
    if (!S || !days || ctx.di == null || ctx.repeat) return null;
    var entry = days[ctx.di];
    if (!entry || !S.shouldPlay(entry, ctx.di, (window.COURSE_UNITS || {})[entry.unit])) return null;
    return entry;
  }
  function pickScene(ctx, entry, cb) {
    var S = window.Scenes, Kn = window.Known;
    S.load(entry.band, function (ok) {
      if (!ok) { cb(null); return; }
      var known = null;
      try { known = Kn && window.REQUIRES && window.GRAPH ? Kn.forLearner(readProg(), ctx.di) : null; } catch (e) { known = null; }
      var seen = {};
      try { seen = JSON.parse(localStorage.getItem('fluidez.seen')) || {}; } catch (e) {}
      cb(S.pick(known, ctx.di, entry.band, seen, { today: ctx.nodes, day: ctx.seenDay != null ? ctx.seenDay : ctx.day }));
    });
  }
  function recordScene(sc, ctx) {
    try {
      var seen = JSON.parse(localStorage.getItem('fluidez.seen')) || {};
      seen['scene:' + sc.id] = ctx.seenDay != null ? ctx.seenDay : ctx.day;
      localStorage.setItem('fluidez.seen', JSON.stringify(seen));
    } catch (e) {}
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function runScene(body, sc, startAt, lines, save, done) {
    var S = window.Scenes, list = S.turns(sc), at = Math.min(startAt || 0, list.length);
    lines = lines || [];
    function turn() {
      UI.clear(body);
      if (at >= list.length) { summary(); return; }
      var t = list[at], tries = 0, finished = false;
      body.appendChild(UI.el('div', 'muted small', esc(sc.title) + ' · ' + (at + 1) + ' / ' + list.length));
      if (at === 0 && sc.brief) body.appendChild(UI.el('p', 'muted small', esc(sc.brief)));
      body.appendChild(UI.el('h2', 'q-text', esc(t.npc)));
      body.appendChild(UI.el('p', 'muted small', esc(t.npcEn)));
      body.appendChild(UI.el('p', 'cloze-text', esc(t.intent)));
      var ta = UI.el('textarea', 'answer-area');
      ta.rows = 2; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;
      var fb = UI.el('div', 'feedback');
      var go = UI.el('button', 'primary-btn', UI.t('Revisa', 'Check')); go.type = 'button';
      var row = UI.el('div', 'row-controls'); row.appendChild(go);
      body.appendChild(ta); body.appendChild(UI.accentBar(function () { return ta; }));
      body.appendChild(fb); body.appendChild(row);
      ta.focus();
      function advance(rec) {
        lines.push(rec); at++; save(at, lines); turn();
      }
      function finish(rec, html, cls) {
        finished = true; ta.readOnly = true;
        fb.className = 'feedback ' + cls; fb.innerHTML = html;
        go.textContent = UI.t('Siguiente →', 'Next →');
        go.onclick = function () { advance(rec); };
      }
      function submit() {
        if (finished) return;
        var text = ta.value.trim();
        if (!text) return;
        var g = S.grade(t, text);
        tries++;
        if (g.pass) { finish({ npc: t.npc, text: text, ok: true }, UI.t('Bien', 'Right') + (g.hint ? '. ' + esc(hintText(g.hint)) : ''), 'good'); return; }
        if (tries < 2) {
          fb.className = 'feedback bad';
          fb.textContent = (g.hint ? hintText(g.hint) : UI.t('Casi.', 'Not quite.')) + ' ' + UI.t('Inténtalo otra vez.', 'Try once more.');
          ta.focus(); return;
        }
        var model = (t.accept || [])[0] || '';
        finish({ npc: t.npc, text: text, ok: false, model: model },
          '<div class="model-answer">' + esc(model) + '</div>' + (g.hint ? '<div class="muted small">' + esc(hintText(g.hint)) + '</div>' : ''), 'bad');
      }
      go.onclick = submit;
      ta.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (finished) go.click(); else submit(); }
      });
    }
    function summary() {
      body.appendChild(UI.el('h2', null, esc(sc.title)));
      lines.forEach(function (l) {
        var d = UI.el('div', 'scene-line');
        d.appendChild(UI.el('p', 'muted', esc(l.npc)));
        d.appendChild(UI.el('p', l.ok ? 'model-answer' : 'feedback bad', esc(l.text) + (l.ok ? '' : ' → ' + esc(l.model))));
        body.appendChild(d);
      });
      body.appendChild(UI.el('p', 'muted', UI.t('Escena terminada', 'Scene done')));
      body.appendChild(UI.nextBtn(UI.t('Continuar →', 'Continue →'), done));
    }
    turn();
  }


  /* ---- Build it ----------------------------------------------------------------
   * On an Introduce day (the day's nodes hold a g: node), one chain of three
   * steps before the writing tasks (js/buildit.js): a short row the learner can
   * read, then the same sentence with one change at a time. Each step is typed
   * and graded like a bank translation (one hint, one retry, then the model).
   * The next step appears under the settled one. */
  function emph(s) { return esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>'); }
  function hasGrammar(nodes) {
    var yes = false;
    if (nodes && nodes.forEach) nodes.forEach(function (id) { if (id.charAt(0) === 'g') yes = true; });
    return yes;
  }
  function buildChain(ctx) {
    var BI = window.BuildIt, Kn = window.Known;
    if (!BI || !Kn || !window.REQUIRES || !window.GRAPH || ctx.repeat || ctx.di == null || !ctx.nodes || !hasGrammar(ctx.nodes)) return null;
    var days = window.COURSE_DAYS, entry = days && days[ctx.di];
    if (!entry || !entry.lesson) return null;
    var known;
    try { known = Kn.forLearner(readProg(), ctx.di); } catch (e) { return null; }
    var key = 'buildit:' + ctx.di + ':' + (ctx.seenDay != null ? ctx.seenDay : ctx.day);
    var rng = UI.seededRandom ? UI.seededRandom(key) : Math.random;
    var list;
    try { list = BI.prompts(known, ctx.nodes, 1, rng, { band: entry.band, lessonId: ctx.lesson && ctx.lesson.id, verbs: ctx.focus && ctx.focus.verbs }); } catch (e) { return null; }
    return list && list.length ? list[0] : null;
  }
  function runBuildIt(body, chain, startAt, save, done) {
    var at = Math.min(startAt || 0, chain.steps.length), BI = window.BuildIt;
    function nextStep() {
      if (at >= chain.steps.length) { done(); return; }
      var step = chain.steps[at], first = at === 0;
      var sec = UI.el('div', 'buildit-step');
      body.appendChild(sec);
      sec.appendChild(UI.el('div', 'muted small', UI.t('Constrúyelo', 'Build it') + ' · ' + (at + 1) + ' / ' + chain.steps.length));
      var lead = BI.lead(step);
      var cue = { person: UI.t('Ahora cambia quién lo hace.', 'Now change who does it.'), tense: UI.t('Ahora dilo en pasado.', 'Now say it in the past.'), neg: UI.t('Ahora hazlo negativo.', 'Now make it negative.'), pronoun: UI.t('Ahora dilo sin repetir la cosa.', 'Now say it without repeating the thing.') }[step.change] || '';
      var task = { prompt: step.en, es: step.es, accept: step.accept || [], lead: (cue ? cue + ' ' : '') + lead };
      save(at);
      runBankTranslate(sec, task, function () {
        // settle the finished step: keep it on screen, read only
        sec.classList.add('settled');
        at++;
        nextStep();
      });
    }
    nextStep();
  }

  /* ---- About me --------------------------------------------------------------
   * At a unit's output day: ONE true sentence about the learner, using the unit's
   * point. The checker holds it to a constraint built from the unit's node; the
   * learner may add the English. It joins the script (js/buildit.js) and becomes
   * a review card. */
  function aboutDay(ctx) {
    var entry = sceneDay(ctx), BI = window.BuildIt;
    if (!entry || !BI || !entry.unit || entry.practice) return null;
    if (BI.has(entry.unit, ctx.di)) return null;
    var spec = BI.constraint(ctx.nodes, { canDo: ctx.lesson && ctx.lesson.canDo });
    var u = (window.COURSE_UNITS || {})[entry.unit];
    return { unit: entry.unit, title: (u && u.title) || '', spec: spec };
  }
  function aboutLabel(l) {
    l = String(l || '').replace(/^use an? verb in the presente\b/i, 'a verb in the present');
    return l.replace(/\s+[-\u2013\u2014]+\s+/g, ', ').replace(/[\u2013\u2014]/g, ', ').replace(/(\w)-(?=\s)/g, '$1');
  }
  function runAboutMe(body, ab, ctx, done) {
    var BI = window.BuildIt, prompt = ab.spec.prompt || UI.t('Una línea verdadera para tu guion: di algo sobre ti ' + ab.spec.text + '.', 'One true line for your script: say something about you ' + ab.spec.text + '.');
    if (ab.title) body.appendChild(UI.el('div', 'muted small', UI.t('Mi guion', 'My script') + ' · ' + esc(ab.title)));
    body.appendChild(UI.el('h2', 'q-text', emph(prompt)));
    var ta = UI.el('textarea', 'answer-area');
    ta.rows = 2; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;
    var en = UI.el('input', 'answer-input wide'); en.type = 'text'; en.placeholder = UI.t('En inglés (opcional)', 'In English (optional)');
    var list = UI.el('ul', 'constraint-list');
    var add = UI.el('button', 'primary-btn', UI.t('Agregar a mi guion', 'Add to my script')); add.type = 'button'; add.disabled = true;
    var skip = UI.el('button', 'ghost-btn', UI.t('Saltar', 'Skip')); skip.type = 'button';
    var row = UI.el('div', 'row-controls'); row.appendChild(add); row.appendChild(skip);
    body.appendChild(ta); body.appendChild(UI.accentBar(function () { return ta; }));
    body.appendChild(en); body.appendChild(list); body.appendChild(row);
    ta.focus();
    function check() {
      var res = C.checkWriting({ type: 'scene', constraints: ab.spec.constraints }, ta.value);
      UI.clear(list);
      res.results.forEach(function (r) { list.appendChild(UI.el('li', 'constraint ' + (r.pass ? 'pass' : 'todo'), (r.pass ? '✓ ' : '○ ') + aboutLabel(r.label))); });
      add.disabled = !(ta.value.trim() && res.allPass);
    }
    ta.addEventListener('input', check);
    check();
    add.addEventListener('click', function () {
      if (add.disabled) return;
      if (BI.isDuplicate && BI.isDuplicate(ta.value)) {
        var dm = body.querySelector('.about-dup');
        if (!dm) { dm = UI.el('p', 'muted about-dup'); list.parentNode.insertBefore(dm, list); }
        dm.textContent = BI.DUP_MSG;
        return;
      }
      BI.add({ unit: ab.unit, es: ta.value, en: en.value, p: prompt.replace(/\*/g, ''), day: ctx.di });
      UI.clear(body);
      body.appendChild(UI.el('h2', null, UI.t('Agregada a tu guion', 'Added to your script')));
      body.appendChild(UI.el('p', 'model-answer', esc(ta.value.trim())));
      body.appendChild(UI.el('p', 'muted', UI.t('Vuelve en tus repasos.', 'It comes back in your reviews.')));
      body.appendChild(UI.nextBtn(UI.t('Continuar →', 'Continue →'), done));
    });
    skip.addEventListener('click', done);
  }

  /* My script: every line, by unit, each editable. */
  function runScript(body, back) {
    var BI = window.BuildIt, units = (window.COURSE_UNITS || {});
    function paint() {
      UI.clear(body);
      var all = BI.load();
      body.appendChild(UI.el('h2', null, UI.t('Mi guion (' + all.length + (all.length === 1 ? ' línea' : ' líneas') + ')', 'My script (' + all.length + ' line' + (all.length === 1 ? '' : 's') + ')')));
      if (!all.length) body.appendChild(UI.el('p', 'muted', UI.t('Aquí se juntan tus líneas verdaderas sobre ti, una por unidad.', 'Your true lines about you collect here, one for each unit.')));
      var last = null;
      all.forEach(function (l, n) {
        if (l.unit !== last) { last = l.unit; body.appendChild(UI.el('h3', null, esc((units[l.unit] && units[l.unit].title) || l.unit))); }
        var d = UI.el('div', 'script-line');
        d.appendChild(UI.el('p', 'model-answer', esc(l.es)));
        if (l.en) d.appendChild(UI.el('p', 'muted small', esc(l.en)));
        var ed = UI.el('button', 'ghost-btn', UI.t('Editar', 'Edit')); ed.type = 'button';
        ed.addEventListener('click', function () {
          UI.clear(d);
          var t = UI.el('textarea', 'answer-area'); t.rows = 2; t.value = l.es; t.spellcheck = false;
          var e = UI.el('input', 'answer-input wide'); e.type = 'text'; e.value = l.en || ''; e.placeholder = UI.t('En inglés (opcional)', 'In English (optional)');
          var sv = UI.el('button', 'primary-btn', UI.t('Guardar', 'Save')); sv.type = 'button';
          var cx = UI.el('button', 'ghost-btn', UI.t('Cancelar', 'Cancel')); cx.type = 'button';
          sv.addEventListener('click', function () { if (BI.edit(n, t.value, e.value)) paint(); });
          cx.addEventListener('click', paint);
          d.appendChild(t); d.appendChild(UI.accentBar(function () { return t; })); d.appendChild(e); d.appendChild(sv); d.appendChild(cx);
          t.focus();
        });
        d.appendChild(ed);
        body.appendChild(d);
      });
      body.appendChild(UI.nextBtn(UI.t('Volver', 'Back'), back));
    }
    paint();
  }

  function run(host, ctx, done) {
    var tasks = ctx.writeTasks || [];
    var st = ctx.step || null, ex = (st && st.extra) || {};
    var chain = buildChain(ctx);
    if (!tasks.length && !chain) { done(); return; }
    var i = Math.min((st && st.at) || 0, tasks.length), doneCount = ex.done || 0;
    /* the chain is over once any later place has been saved */
    var chainDone = !chain || !!ex.bd || (st && st.at > 0) || !!ex.sc || !!ex.ab;
    var about = aboutDay(ctx), aboutDone = false;

    var wrap = UI.el('div', 'panel');
    var progress = UI.el('div', 'muted review-stats');
    var body = UI.el('div');
    wrap.appendChild(progress); wrap.appendChild(body);
    host.appendChild(wrap);

    var sceneEntry = sceneDay(ctx), sceneState = null;
    if (ex.ab) sceneEntry = null;
    function playScene() {
      UI.clear(body);
      progress.textContent = 'Escena';
      var begin = function (sc, at, lines) {
        if (!sc) { sceneEntry = null; finish(); return; }
        sceneState = { sc: sc };
        if (!at) recordScene(sc, ctx);
        UI.clear(body);
        runScene(body, sc, at, lines, function (n, l) { if (st) st.save(tasks.length, { done: doneCount, bd: 1, sc: sc.id, turn: n, lines: l }); },
          function () { sceneEntry = null; finish(); });
      };
      if (ex.sc && window.Scenes) {
        window.Scenes.load(sceneEntry.band, function () {
          var sc = window.Scenes.find(ex.sc);
          var at = ex.turn || 0, lines = ex.lines || [];
          ex = {};
          begin(sc, at, lines);
        });
      } else pickScene(ctx, sceneEntry, function (sc) { begin(sc, 0, []); });
    }

    function playAbout() {
      aboutDone = true;
      UI.clear(body);
      progress.textContent = 'Mi guion';
      if (st) st.save(tasks.length, { done: doneCount, bd: 1, ab: 1 });
      runAboutMe(body, about, ctx, finish);
    }
    function playChain() {
      UI.clear(body);
      progress.textContent = UI.t('Constrúyelo', 'Build it');
      runBuildIt(body, chain, ex.bi || 0, function (n) { if (st) st.save(0, { done: doneCount, bi: n }); },
        function () { chainDone = true; ex = {}; show(); });
    }

    function finish() {
      if (sceneEntry) { playScene(); return; }
      if (about && !aboutDone) { playAbout(); return; }
      ctx.results.produce = { done: doneCount, total: tasks.length };
      UI.clear(body);
      body.appendChild(UI.el('h2', null, UI.t('Escrito', 'Written')));
      body.appendChild(UI.el('p', 'muted', UI.t('Hoy produjiste ' + doneCount + (doneCount === 1 ? ' texto' : ' textos') + ' en tu propio español. Muchos estudiantes se saltan esta parte, y es la que construye la fluidez.', 'You produced ' + doneCount + ' piece' + (doneCount === 1 ? '' : 's') + ' of your own Spanish today. Most learners skip this part, and it is the part that builds fluency.')));
      var nLines = window.BuildIt ? window.BuildIt.count() : 0;
      if (nLines) {
        var sb = UI.el('button', 'ghost-btn script-link', UI.t('Mi guion (' + nLines + (nLines === 1 ? ' línea' : ' líneas') + ')', 'My script (' + nLines + ' line' + (nLines === 1 ? '' : 's') + ')')); sb.type = 'button';
        sb.addEventListener('click', function () { runScript(body, finish); });
        body.appendChild(sb);
      }
      body.appendChild(UI.nextBtn('Terminar la sesión →', done));
    }

    function show() {
      if (!chainDone) { playChain(); return; }
      if (st) st.save(i, { done: doneCount, bd: 1 });   // the place survives a reload
      if (i >= tasks.length) { finish(); return; }
      var t = tasks[i];
      progress.textContent = 'Tarea ' + (i + 1) + ' / ' + tasks.length;
      UI.clear(body);
      var next = function (completed) { if (completed !== false) doneCount++; i++; show(); };
      if (t.type === 'build') runBuild(body, t, next);
      else if (t.type === 'essay' && window.Essay) window.Essay.mount(body, t, { onDone: next });
      else if (t.type === 'translate' && t.es && window.LIB && window.LIB.match) runBankTranslate(body, t, next);
      else runWrite(body, t, next);
    }
    if (ex.ab && about) { playAbout(); return; }
    show();
  }

  return { key: 'produce', label: 'Producir', icon: '✍️', run: run };
})();
