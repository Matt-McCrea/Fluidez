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

  // ---- scrambled sentence builder ----------------------------------------
  function runBuild(body, task, next) {
    body.appendChild(UI.el('h2', 'q-text', 'Build the sentence:'));
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
      if (!chosen.length) line.appendChild(UI.el('span', 'muted', 'click the words below in order…'));
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
        fb.textContent = 'Not quite. Click a word to send it back.';
        fb.className = 'feedback bad';
      }
    }

    body.appendChild(line);
    body.appendChild(bank);
    body.appendChild(fb);
    render();
  }

  /* Enough Spanish to count as a sentence: a verb the engine recognises plus an
   * article or pronoun, or simply six words or more. */
  var SMALL = /^(el|la|los|las|un|una|unos|unas|yo|tu|vos|usted|el|ella|nosotros|nosotras|ustedes|ellos|ellas|me|te|se|nos|lo|le|les|mi|mis|su|sus)$/;
  function substantial(analysis, text) {
    var toks = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (toks.length >= 6) return true;
    var hasVerb = !!(analysis && (analysis.verbs.length || analysis.compounds.length));
    var hasSmall = toks.some(function (w) { return SMALL.test(E.deaccent(w.toLowerCase()).replace(/[^a-zñ]/g, '')); });
    return hasVerb && hasSmall;
  }

  // ---- constrained writing (translate / free write / paragraph) -----------
  function runWrite(body, task, next) {
    var isPara = task.type === 'paragraph';
    body.appendChild(UI.el('h2', 'q-text', task.prompt));
    if (task.hint) body.appendChild(UI.el('p', 'muted small', '💡 ' + task.hint));

    var ta = UI.el('textarea', 'answer-area');
    ta.rows = isPara ? 7 : 3; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;

    var counter = isPara ? UI.el('div', 'muted small write-counter') : null;
    var checklist = UI.el('ul', 'constraint-list');
    var modelBox = UI.el('div');
    var doneB = UI.el('button', 'primary-btn', 'Compare with model →'); doneB.type = 'button';
    doneB.disabled = true;
    var skipB = UI.el('button', 'ghost-btn', 'Show model (I\'m stuck)'); skipB.type = 'button';

    body.appendChild(ta);
    body.appendChild(UI.accentBar(function () { return ta; }));
    if (counter) body.appendChild(counter);
    body.appendChild(UI.el('div', 'checklist-title muted', (isPara ? 'Your paragraph' : 'Your sentence') + ' needs to…'));
    body.appendChild(checklist);
    body.appendChild(modelBox);
    var row = UI.el('div', 'row-controls');
    row.appendChild(doneB); row.appendChild(skipB);
    body.appendChild(row);
    ta.focus();

    var lastRes = null, warned = false;
    var telegramNote = UI.el('p', 'muted small hidden', 'That reads like a telegram: add the small words (el, la, un, mi, yo, me) and try again.');
    body.insertBefore(telegramNote, modelBox);
    function renderCheck() {
      var res = C.checkWriting(task, ta.value);
      UI.clear(checklist);
      res.results.forEach(function (r) {
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
        '<div class="checklist-title muted">Model answer' + (models.length > 1 ? 's' : '') + ':</div>' + html +
        '<p class="muted small">Compare word by word. Did you say it a natural way? Differences in vocabulary are fine; look at the verb forms and little words.</p>'));
      doneB.textContent = 'Next →';
      doneB.disabled = false;
      skipB.classList.add('hidden');
    }
    doneB.addEventListener('click', function () {
      if (shown) { next(true); return; }
      /* A telegram ("Necesito cita lunes") is held back once, with a note, and
       * let through on the second try. */
      if (!warned && lastRes && !substantial(lastRes.analysis, ta.value)) {
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
    body.appendChild(UI.el('h2', 'q-text', 'Say it in Spanish:'));
    body.appendChild(UI.el('p', 'cloze-text', '“' + lines(task.prompt) + '”'));
    var ta = UI.el('textarea', 'answer-area');
    ta.rows = 2; ta.placeholder = 'escribe en español…'; ta.spellcheck = false;
    var fb = UI.el('div', 'feedback');
    var go = UI.el('button', 'primary-btn', 'Check'); go.type = 'button';
    var skip = UI.el('button', 'ghost-btn', 'Show answer (I\'m stuck)'); skip.type = 'button';
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
      go.textContent = 'Next →'; go.disabled = false;
      go.onclick = function () { next(ok); };
    }
    function reveal(hint) {
      if (window.ErrorLog) window.ErrorLog.record({ id: 'err:translate:' + E.normalize(task.es), front: task.prompt,
        back: task.es, hint: hint || null, kind: 'error', source: 'produce-translate', reviewable: true });
      finish(false, '<div class="model-answer">' + lines(task.es) + '</div>' + (hint ? '<div class="muted small">' + hint + '</div>' : ''), 'bad');
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
        finish(true, 'Right' + (note ? '. ' + note + '<div class="model-answer">' + lines(task.es) + '</div>' : ''), 'good');
      } else if (step.status === 'retry') {
        fb.className = 'feedback bad';
        fb.textContent = (res.hint || 'Not quite.') + ' Try once more.';
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
      var go = UI.el('button', 'primary-btn', 'Check'); go.type = 'button';
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
        go.textContent = 'Next →';
        go.onclick = function () { advance(rec); };
      }
      function submit() {
        if (finished) return;
        var text = ta.value.trim();
        if (!text) return;
        var g = S.grade(t, text);
        tries++;
        if (g.pass) { finish({ npc: t.npc, text: text, ok: true }, 'Right' + (g.hint ? '. ' + esc(g.hint) : ''), 'good'); return; }
        if (tries < 2) {
          fb.className = 'feedback bad';
          fb.textContent = (g.hint || 'Not quite.') + ' Try once more.';
          ta.focus(); return;
        }
        var model = (t.accept || [])[0] || '';
        finish({ npc: t.npc, text: text, ok: false, model: model },
          '<div class="model-answer">' + esc(model) + '</div>' + (g.hint ? '<div class="muted small">' + esc(g.hint) + '</div>' : ''), 'bad');
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
      body.appendChild(UI.el('p', 'muted', 'Scene done'));
      body.appendChild(UI.nextBtn('Continue →', done));
    }
    turn();
  }

  function run(host, ctx, done) {
    var tasks = ctx.writeTasks || [];
    if (!tasks.length) { done(); return; }
    var st = ctx.step || null, ex = (st && st.extra) || {};
    var i = Math.min((st && st.at) || 0, tasks.length), doneCount = ex.done || 0;

    var wrap = UI.el('div', 'panel');
    var progress = UI.el('div', 'muted review-stats');
    var body = UI.el('div');
    wrap.appendChild(progress); wrap.appendChild(body);
    host.appendChild(wrap);

    var sceneEntry = sceneDay(ctx), sceneState = null;
    function playScene() {
      UI.clear(body);
      progress.textContent = 'Escena';
      body.appendChild(UI.el('p', 'muted', 'Loading the scene…'));
      var begin = function (sc, at, lines) {
        if (!sc) { sceneEntry = null; finish(); return; }
        sceneState = { sc: sc };
        if (!at) recordScene(sc, ctx);
        UI.clear(body);
        runScene(body, sc, at, lines, function (n, l) { if (st) st.save(tasks.length, { done: doneCount, sc: sc.id, turn: n, lines: l }); },
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

    function finish() {
      if (sceneEntry) { playScene(); return; }
      ctx.results.produce = { done: doneCount, total: tasks.length };
      UI.clear(body);
      body.appendChild(UI.el('h2', null, UI.t('Escrito', 'Written')));
      body.appendChild(UI.el('p', 'muted', 'You produced ' + doneCount + ' piece' + (doneCount === 1 ? '' : 's') + ' of your own Spanish today. Most learners skip this part, and it is the part that builds fluency.'));
      body.appendChild(UI.nextBtn('Terminar la sesión →', done));
    }

    function show() {
      if (st) st.save(i, { done: doneCount });   // the place survives a reload
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
    show();
  }

  return { key: 'produce', label: 'Producir', icon: '✍️', run: run };
})();
