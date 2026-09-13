/* ============================================================================
 * UNIT CHECK — "I already know this one."
 *
 * The course is 671 days long and a learner who starts at B1 still has all of
 * A1 and A2 sitting above them, unstudied, skewing every count in Lecciones
 * and every "next unstudied lesson" the session picks. The only way to clear
 * a lesson was to sit through it, one at a time.
 *
 * Two ways out, on every unit:
 *
 *   PONME A PRUEBA   six questions drawn from across the unit's own lessons,
 *                    one wrong allowed. Pass and the whole unit is marked
 *                    studied. Fail and NOTHING is marked — and the unit tells
 *                    you which lessons the questions you missed came from,
 *                    which is the genuinely useful half: not "you failed" but
 *                    "do these two".
 *
 *   MARCAR ✓         just mark it, no test. A rusty ex-speaker skimming A1
 *                    does not need to prove it to their own phone, and a
 *                    button that makes them is a button they will route
 *                    around by clicking through eight lessons instead.
 *
 * Both are reversible — the same control un-marks — because a mis-tap that
 * silently erases a unit's progress is worse than either.
 *
 * Marking studied deliberately does NOT enrol the unit's recall cards into
 * the SRS. Enrolment happens when a lesson is actually taught; "I know this
 * already" means you want it out of the way, not arriving in Repasar for the
 * next six weeks.
 * ========================================================================== */
window.UnitCheck = (function () {
  var UI = window.UI;
  var PKEY = 'fluidez.progress';

  var ASK = 6;          // questions in a unit check
  var ALLOWED_WRONG = 1;
  var MIN_POOL = 3;     // below this there is nothing worth calling a test

  function loadProg() { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; } }
  function saveProg(o) { try { localStorage.setItem(PKEY, JSON.stringify(o)); } catch (e) {} }
  function studiedMap() { return loadProg().studied || {}; }

  function lessonIds(unit) {
    var D = window.COURSE_DAYS || [];
    if (!unit || unit.from == null) return [];
    return D.slice(unit.from, unit.from + unit.length)
      .filter(function (d) { return !!d.lesson; })
      .map(function (d) { return d.lesson; });
  }
  function doneCount(unit) {
    var st = studiedMap();
    return lessonIds(unit).filter(function (id) { return st[id]; }).length;
  }
  function isDone(unit) {
    var ids = lessonIds(unit);
    return ids.length > 0 && doneCount(unit) === ids.length;
  }

  function setLessons(ids, done) {
    var p = loadProg();
    p.studied = p.studied || {};
    ids.forEach(function (id) { if (done) p.studied[id] = 1; else delete p.studied[id]; });
    saveProg(p);
  }
  function setUnit(unit, done) { setLessons(lessonIds(unit), done); }

  function unitsIn(band) {
    var U = window.COURSE_UNITS || {};
    return Object.keys(U).map(function (k) { return U[k]; })
      .filter(function (u) { return u.band === band && !u.optional && u.from != null; })
      .sort(function (a, b) { return a.from - b.from; });
  }
  function setBand(band, done) {
    var ids = [];
    unitsIn(band).forEach(function (u) { ids = ids.concat(lessonIds(u)); });
    setLessons(ids, done);
    return ids.length;
  }
  function bandDone(band) {
    var us = unitsIn(band);
    return us.length > 0 && us.every(isDone);
  }

  /* Questions for a unit check. At most two from any one lesson, so six
   * questions cover the unit rather than interrogating whichever lesson
   * happened to be written with the most probes. Each carries the lesson it
   * came from, which is what makes a failure useful. */
  function questions(unit, rng) {
    var byId = {};
    (window.ALL_LESSONS || window.GRAMMAR_LESSONS || []).forEach(function (l) { byId[l.id] = l; });
    var perLesson = [];
    lessonIds(unit).forEach(function (id) {
      var l = byId[id];
      if (!l) return;
      var mine = (l.probes || []).filter(function (p) {
        return p.kind === 'mcq' && p.options && p.options.length >= 3 && p.answer != null;
      });
      if (mine.length) perLesson.push({ id: id, title: l.title, qs: UI.shuffle(mine, rng) });
    });
    // UI.shuffle returns a NEW array rather than sorting in place, so this has
    // to be assigned — otherwise the check asks the same six questions from the
    // same first lessons every time, and becomes something to memorise.
    perLesson = UI.shuffle(perLesson, rng);
    var out = [];
    for (var round = 0; round < 2 && out.length < ASK; round++) {
      for (var i = 0; i < perLesson.length && out.length < ASK; i++) {
        var src = perLesson[i];
        if (src.qs.length > round) out.push({ q: src.qs[round], lesson: src.id, title: src.title });
      }
    }
    return out;
  }
  function testable(unit) { return questions(unit, Math.random).length >= MIN_POOL; }

  // ---- the check itself ----------------------------------------------------
  function run(unit, onDone) {
    var host = document.getElementById('stage-host');
    var qs = questions(unit, Math.random);
    if (qs.length < MIN_POOL) { onDone(); return; }
    var need = qs.length - ALLOWED_WRONG;
    var i = 0, right = 0, missed = [];

    function back() { if (onDone) onDone(); }

    function ask() {
      if (i >= qs.length) return finish();
      var item = qs[i++];
      UI.clear(host);
      var wrap = UI.el('div', 'panel');
      wrap.appendChild(UI.el('div', 'eyebrow', UI.t('Prueba', 'Check') + ' · ' + i + '/' + qs.length));
      wrap.appendChild(UI.el('h2', null, unit.title));
      wrap.appendChild(UI.el('p', 'uc-q', item.q.q));
      var opts = UI.el('div', 'onb-options');
      var answered = false;
      item.q.options.forEach(function (o, n) {
        var b = UI.el('button', 'onb-option', o);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          var ok = n === item.q.answer;
          if (ok) right++; else missed.push(item);
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) Array.prototype.forEach.call(opts.children, function (c, m) {
            if (m === item.q.answer) c.classList.add('right');
          });
          setTimeout(ask, ok ? 380 : 950);
        });
        opts.appendChild(b);
      });
      wrap.appendChild(opts);
      var quit = UI.el('button', 'linkish muted', UI.t('Dejarlo', 'Stop'));
      quit.type = 'button';
      quit.addEventListener('click', back);
      wrap.appendChild(quit);
      host.appendChild(wrap);
    }

    function finish() {
      var passed = right >= need;
      if (passed) setUnit(unit, true);
      UI.clear(host);
      var wrap = UI.el('div', 'panel intro');
      wrap.appendChild(UI.el('div', 'eyebrow', unit.title));
      wrap.appendChild(UI.el('div', 'uc-score' + (passed ? ' pass' : ''), right + '/' + qs.length));
      if (passed) {
        wrap.appendChild(UI.el('h2', null, UI.t('Unidad superada', 'Unit cleared')));
        wrap.appendChild(UI.el('p', 'muted', lessonIds(unit).length +
          UI.t(' lecciones marcadas como hechas.', ' lessons marked as done.')));
      } else {
        wrap.appendChild(UI.el('h2', null, UI.t('Todavía no', 'Not yet')));
        wrap.appendChild(UI.el('p', 'muted', UI.t(
          'No se ha marcado nada. Hacían falta ' + need + ' de ' + qs.length + '.',
          'Nothing was marked. You needed ' + need + ' of ' + qs.length + '.')));
        /* The useful half of a failure: not the score, but which lessons to
         * actually take. Deduplicated — two misses from one lesson is still
         * one lesson to do. */
        var seen = {}, list = UI.el('div', 'syllabus uc-missed');
        missed.forEach(function (m) {
          if (seen[m.lesson]) return;
          seen[m.lesson] = 1;
          var row = UI.el('button', 'syl-row open');
          row.type = 'button';
          row.innerHTML = '<span class="syl-mark">›</span><span class="syl-title">' + m.title + '</span>';
          row.addEventListener('click', function () {
            window.LessonRun.run({ type: 'grammar', id: m.lesson }, back);
          });
          list.appendChild(row);
        });
        if (list.firstChild) {
          wrap.appendChild(UI.el('h3', null, UI.t('Empieza por aquí', 'Start with these')));
          wrap.appendChild(list);
        }
        var anyway = UI.el('button', 'linkish muted', UI.t('Marcarla igualmente', 'Mark it done anyway'));
        anyway.type = 'button';
        anyway.addEventListener('click', function () { setUnit(unit, true); back(); });
        wrap.appendChild(anyway);
      }
      var b2 = UI.el('button', 'ghost-btn', '← ' + UI.t('Lecciones', 'Lessons'));
      b2.type = 'button';
      b2.addEventListener('click', back);
      wrap.appendChild(b2);
      host.appendChild(wrap);
    }

    ask();
  }

  return {
    run: run, testable: testable,
    lessonIds: lessonIds, doneCount: doneCount, isDone: isDone,
    setUnit: setUnit, setBand: setBand, bandDone: bandDone, unitsIn: unitsIn
  };
})();
