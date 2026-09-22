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
  /* The tense a grammar focus is ABOUT. For the generated ladder lessons this
   * is the id (`preterito`), but a merged lesson keeps the id of its
   * hand-written half (`gr-presente-subjuntivo-b1`) while still teaching
   * `presubj` — so the id is not a safe stand-in for the tense key any more. */
  function focusTense(focus) { return focus.tense || focus.id; }

  /* The Spanish a lesson is built out of, as single content words, for deciding
   * whether a passage rehearses today's lesson.
   *
   * SINGLE WORDS, not the keyword rows themselves: a row like "¿Cómo te
   * llamas?" only ever matches verbatim, and a passage that says "¿cómo se
   * llama tu hermana?" is rehearsing exactly the same lesson. Four letters is
   * the floor because `de`, `que` and `una` appear in every text ever written
   * and would make every passage look aligned.
   *
   * Cached per lesson id: this is a hot path — one session filters every
   * eligible passage — and a lesson's keyword table does not change. */
  var LEX_CACHE = Object.create(null);
  function lessonLex(l) {
    if (!l) return [];
    if (LEX_CACHE[l.id]) return LEX_CACHE[l.id];
    var seen = Object.create(null), out = [];
    [].concat(l.keywords || [], l.exponents || []).forEach(function (k) {
      String((k && k.es) || '').split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/).forEach(function (w) {
        w = w.toLowerCase();
        if (w.length < 4 || seen[w]) return;
        seen[w] = 1; out.push(w);
      });
    });
    return (LEX_CACHE[l.id] = out);
  }

  /* Does this passage rehearse today's lesson?
   *
   * The tense test below can only answer for a lesson that HAS a tense, and
   * most of the course does not: of the 19 lesson-days in the first 24, one
   * carries a tense and one is a concept lesson. The other 17 teach a function
   * or a notion, so they fell straight past this test to the theme tier, and
   * nine of them past that to "any passage at this level" — which is the exact
   * failure the tier comment further down was written to prevent, still
   * happening on the days that teach the most useful Spanish.
   *
   * So a lesson may also align on its own vocabulary. Read through
   * js/lexmatch.js rather than a second matcher, for the reason that file
   * gives: if the app and the checker ever disagree about which words a text
   * contains, the app teaches words the checker believes are absent.
   *
   * Three words, not one. One shared word is a coincidence in a 60-word text;
   * three is the passage being about the same thing. Measured over the first
   * 24 days, the threshold moves alignment from 2 days to 16 and leaves the
   * candidate pools small (1-10 passages) rather than 193. */
  var LEX_MIN = 3;
  function passageUsesFocus(p, focus, lesson) {
    if (focus.type === 'grammar' && E.CONCEPTS[focus.id] && E.CONCEPTS[focus.id].matchesText(p.text)) return true;
    if (focus.type === 'grammar' && !E.CONCEPTS[focus.id]) {
      var a = E.analyzeSentence(p.text);
      var tk = focusTense(focus);
      if (a.verbs.some(function (v) { return v.analyses.some(function (x) { return x.tense === tk; }); }) ||
          a.compounds.some(function (c) { return c.parts.some(function (x) { return x.tense === tk; }); })) return true;
    }
    if (focus.type === 'grammar' && window.LexMatch) {
      var lex = lessonLex(lesson);
      if (lex.length && window.LexMatch.countIn(p.text, lex) >= LEX_MIN) return true;
    }
    if (focus.type === 'verbs') return E.matchesVerbGroup(p.text, focus.verbs) >= 1;
    if (focus.type === 'vocab') return E.matchesVocabWords(p.text, focus.words) >= 1;
    return false;
  }
  function clozeMatchesFocus(it, focus) {
    /* A choice item names the contrast it drills (`focus: 'ser-estar'`), so it
     * aligns by that rather than by tense — it may not contain a verb at all.
     * Tested first: E.CONCEPTS['ser-estar'].matchesCloze would be asked about
     * an item with no `inf`, and answer for the wrong reason. */
    if (it.type === 'choice') return focus.type === 'grammar' && it.focus === focus.id;
    if (focus.type === 'grammar' && E.CONCEPTS[focus.id]) return E.CONCEPTS[focus.id].matchesCloze(it);
    if (focus.type === 'grammar') return it.tense === focusTense(focus);
    if (focus.type === 'verbs') return focus.verbs.indexOf(it.inf) !== -1;
    return false;
  }
  function writeMatchesFocus(t, focus) {
    if (focus.type !== 'grammar') return false;
    if (E.CONCEPTS[focus.id]) return E.CONCEPTS[focus.id].matchesConstraints(t.constraints);
    return (t.constraints || []).some(function (c) {
      return (c.type === 'anyVerbInTense' || c.type === 'verbFormAny') && c.tense === focusTense(focus);
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

  /* ---- gate reading by TAUGHT TENSE, not by level ------------------------
   *
   * `level` has always been a proxy for "which tenses may appear in this
   * text" — that is the only thing the number ever decided about a passage.
   * Standing for something is not being it, and the gap opened the moment the
   * preterite moved into A1: A1 is a single level (LEVELS gives it
   * `levels:[1]`, so maxGate is 1), which means making a preterite legal at
   * level 1 makes it legal in the passage handed to a learner on day 3, with
   * nothing left to tell the two apart. There is no "late A1" to put it in.
   *
   * So the proxy is dropped and the thing itself is read. Each passage carries
   * a precomputed `tenses` array (tools/tense-index.js, generated from the
   * same scanner the content gate levels verbs with, so the two cannot drift),
   * and a passage is only offered once the learner has REACHED every tense in
   * it — studied the lesson, or walked past the day that teaches it.
   *
   * This also removes a latent version of the same bug at every other band: a
   * B1 learner on day 190 was being handed texts built on the
   * pluscuamperfecto, which B1 does not teach until day 279.
   *
   * Two deliberate softnesses:
   *
   *   THE FLOOR. The present indicative is not gated. It is the first tense
   *   the course teaches (day 4) and the one every beginner text is written
   *   in, so gating it would blank the reading stage for the three days before
   *   its lesson — a rule that fires on correct content is worse than no rule.
   *   Taken as "the earliest tense on the course" rather than spelled
   *   `presente`, so it follows the course if the course moves.
   *
   *   NEVER EMPTY. If the filter leaves nothing, the unfiltered set is used —
   *   the same bargain safeVerbs and Focus.narrow already make. A text with an
   *   untaught tense in it beats a blank stage, and it is also what makes a
   *   theme focus on a thin theme degrade instead of starving.
   *
   * ALL THREE STAGES, not just reading. Cloze items and writing tasks carry
   * their tense explicitly — `tense` on an apply item, `anyVerbInTense` and
   * friends on a writing task's constraints — so they need no scanner, but
   * they were leaning on exactly the same proxy: `level` was the only thing
   * keeping a preterite drill away from a beginner. Gating a passage and not
   * the drill would have taught the preterite on day 72 and then spent the
   * afternoon conjugating the present, which is the failure this whole piece
   * of work is about, one stage over. */
  var _tenseSched = null;
  function tenseSchedule() {
    if (_tenseSched) return _tenseSched;
    var byId = {};
    (window.ALL_LESSONS || window.GRAMMAR_LESSONS || []).forEach(function (l) { byId[l.id] = l; });
    // the ladder's own tenses — the set `level` was ever a proxy for
    var onLadder = {};
    (window.SEED_SYLLABUS || []).forEach(function (s) { onLadder[s.id] = 1; });
    var day = {}, lesson = {}, floor = null;
    (window.COURSE_DAYS || []).forEach(function (d, i) {
      var l = d.lesson && byId[d.lesson];
      if (!l) return;
      /* A merged lesson keeps the id of its hand-written half while still
       * teaching the tense — `gr-preterito-perfecto-a2` IS the present
       * perfect — so `tense` is the thing to read, not the id. */
      var tk = l.tense || (onLadder[l.id] ? l.id : null);
      if (!tk || day[tk] != null) return;
      day[tk] = i; lesson[tk] = l.id;
      if (floor === null || i < day[floor]) floor = tk;
    });
    _tenseSched = { day: day, lesson: lesson, floor: floor };
    return _tenseSched;
  }

  function tenseReached(tk, dayIndex, studied) {
    var sc = tenseSchedule();
    if (tk === sc.floor) return true;
    if (sc.lesson[tk] && studied[sc.lesson[tk]]) return true;
    return sc.day[tk] != null && dayIndex != null && sc.day[tk] <= dayIndex;
  }
  // the tenses an item requires — a passage carries them precomputed, a cloze
  // item and a writing task say so outright
  function tensesOfPassage(p) { return p.tenses || []; }
  function tensesOfApply(it) { return it.tense ? [it.tense] : []; }
  function tensesOfWrite(t) {
    return (t.constraints || []).map(function (c) { return c.tense; }).filter(Boolean);
  }
  function taughtTenses(items, tensesOf, dayIndex, studied) {
    var out = items.filter(function (x) {
      return tensesOf(x).every(function (tk) { return tenseReached(tk, dayIndex, studied); });
    });
    return out.length ? out : items;
  }

  /* A fingerprint of the band's day sequence, so a course edit that renumbers
   * the days can be noticed and `beginnerDay` rebuilt against the new layout
   * (see pickFocus). Every day contributes — a lesson by id, a verb day by its
   * verbs, a practice day by its position — because inserting a verb day
   * shifts the counter exactly as inserting a lesson does. djb2 over that,
   * because the alternative is storing the whole sequence in localStorage to
   * compare it. */
  function courseSig(seq) {
    var h = 5381, s = seq.map(function (f, i) {
      return f.type === 'grammar' ? f.id : f.type === 'verbs' ? f.verbs.join('+') : 'p' + i;
    }).join('|');
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return seq.length + ':' + (h >>> 0).toString(36);
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
      /* WHEN THE COURSE ITSELF MOVES.
       *
       * `beginnerDay` is a plain index into the band's slice, so inserting a
       * unit renumbers every day after it and the counter silently points at
       * different material than it did yesterday. Moving the two past-tense
       * units into A1 inserted twelve days at index 71: a learner sitting on
       * day 75 would have been mid-way through "Want, need, ask for" on
       * Monday and somewhere inside "Have you ever…?" on Tuesday, having been
       * taught neither.
       *
       * So the layout is fingerprinted and the counter is rebuilt from the
       * learner's STUDIED SET when it changes — which is the durable record,
       * keyed by lesson id and unaffected by any renumbering. Rebuilding means
       * restarting the catch-up walk below from zero rather than from the
       * stale index: it stops at the first day the learner has not done, so a
       * unit inserted BEHIND them is picked up rather than skipped. That
       * matters here specifically — a learner past day 71 who kept their old
       * position would step over the preterite entirely and meet it first in
       * "Telling a story", which assumes it.
       *
       * The walk is not a downgrade for someone deep in the band: a unit whose
       * lessons are all studied counts as done wholesale (UnitCheck.isDone),
       * so its verb and practice days are stepped over too.
       *
       * A learner who has studied nothing loses nothing — their counter was 0
       * and stays 0. */
      var sig = courseSig(seq), remapped = false;
      if (prog.courseSig !== sig) { di = 0; prog.courseSig = sig; remapped = true; }
      /* The paced path walks a DAY COUNTER, not the studied set — so a lesson
       * marked done from Lecciones (js/unitcheck.js), by a unit check or by
       * hand, left the counter where it was and the session kept serving
       * lessons the learner had just said they knew. Catch the counter up:
       * step over any grammar day whose lesson is already studied, and write
       * the new position back so it is done once rather than on every render. */
      var moved = false;
      var UNITS = window.COURSE_UNITS || {};
      function doneAlready(f) {
        if (!f) return false;
        if (f.type === 'grammar') return !!studied[f.id];
        /* A verb or practice day inside a unit the learner has cleared goes
         * too. "I know this unit" has to mean the whole unit, or somebody who
         * marks A1 done still walks thirty verb days to get out of it. */
        return !!(f.unit && UNITS[f.unit] && window.UnitCheck && window.UnitCheck.isDone(UNITS[f.unit]));
      }
      while (di < seq.length && doneAlready(seq[di])) { di++; moved = true; }
      if (moved || remapped) { prog.beginnerDay = di; saveProg(prog); }
      focus = seq[Math.min(di, seq.length - 1)] || { type: 'practice' };
      /* `di` indexes the BAND's slice; COURSE_UNITS.from indexes the whole
       * course, so the band's start has to be added back before the two can
       * be compared. Getting this wrong shows the learner "day -87 of 10". */
      dayIndex = (window.Curriculum.startOf
        ? window.Curriculum.startOf(pr.cefr || (window.Profile && window.Profile.current()))
        : 0) + Math.min(di, seq.length - 1);
      if (focus.type === 'grammar') {
        lesson = lessonById(focus.id);
        if (lesson && lesson.tense) focus.tense = lesson.tense;
      }
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
      focus = lesson ? { type: 'grammar', id: lesson.id, tense: lesson.tense || lesson.id }
                     : { type: 'practice' };
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

    /* Level first, then taught tense — the two are different questions ("is
     * this written too hard for me?" and "have I met what is in it?") and the
     * second only makes sense over things that already passed the first. */
    function taught(arr, tensesOf) {
      return pr.unlockAll ? arr : taughtTenses(arr, tensesOf, dayIndex, studied);
    }
    var passages = taught(atLevel(window.PASSAGES || []), tensesOfPassage);
    var apply = safeVerbs(taught(atLevel(window.APPLY_ITEMS || []), tensesOfApply));
    var writes = safeWriting(taught(atLevel(window.WRITING_TASKS || []), tensesOfWrite));

    // The FIRST time a grammar lesson is seen (not yet in `studied`), its
    // content is picked with a seed derived from the lesson id — reproducible
    // if you reload mid-session, but distinct lesson to lesson. Once you've
    // studied it and come back around to it again (review rotation), selection
    // is plain Math.random so repeats don't feel identical every time.
    var firstTime = (focus.type === 'grammar' && lesson) ? !studied[lesson.id] : false;
    var rng = firstTime ? UI.seededRandom(lesson.id) : Math.random;

    // Produce: 'guided' (beginner) = a build + a translation, with scaffolding.
    // 'full' = also open free-writing and, from level 2+, a connected paragraph.
    /* A theme focus narrows the pool BEFORE the grammar preference runs, so
     * the day's grammar still decides which of the themed tasks you get. Order
     * matters: narrowing second would hand back a task on the right tense and
     * the wrong subject, which is the half that was already working. */
    var FO = window.Focus;
    function inTheme(arr) { return FO ? FO.narrow(arr) : arr; }
    var builds = inTheme(writes.filter(function (t) { return t.type === 'build'; }));
    var trans = inTheme(writes.filter(function (t) { return t.type === 'translate'; }));
    var frees = inTheme(writes.filter(function (t) { return t.type === 'write'; }));
    var paras = inTheme(writes.filter(function (t) { return t.type === 'paragraph'; }));
    var essays = inTheme(writes.filter(function (t) { return t.type === 'essay'; }));

    /* ESSAY DAYS. An essay is twenty minutes and a revision pass, so it cannot
     * be another item appended to a produce stage that already runs six — that
     * turns every B2 session into forty minutes and the learner stops opening
     * the app, which is the failure mode this whole section is supposed to fix.
     *
     * So it REPLACES rather than adds: on an essay day the two free writes and
     * the paragraph come out and the essay goes in, leaving the build and the
     * translation as a warm-up. Session length barely moves; what changes is
     * that once a week the output is one long text instead of five short ones.
     *
     * The clock is `dayIndex`, and WHAT THAT COUNTS IS NOT DAYS. At B1 and up
     * it is the course position of the learner's next unstudied lesson (see
     * pickFocus), so it advances when a lesson is finished and not when a
     * calendar day passes. That is the right clock — somebody who studies
     * twice a week should meet an essay every seventh LESSON, not have six of
     * them go by unseen — but it is easy to misread, and the first version of
     * this was tested against a learner who completed nothing, so dayIndex
     * never moved, and it served zero essays across 28 B2 and 28 C1 sessions
     * while every content gate stayed green. tools/test-essay.js now walks a
     * learner who finishes a lesson each session for exactly that reason.
     *
     * Measured over 42 such sessions: 4 essays at B2, 6 at C1, 0 at B1. The
     * gaps are 6-13 rather than a clean 7 because the non-lesson days in a
     * unit do not advance the counter.
     *
     * A learner parked on one lesson does see the same essay day repeat — but
     * they are being served the same lesson repeatedly too, which is how the
     * whole session already behaves, so it needs no state of its own. */
    var essayDay = level >= 6 && essays.length && (dayIndex % 7 === 0);
    // A long session is the same session with more of it — not extra stages.
    var big = mode === 'larga';
    /* THE PRODUCE STAGE, BY BAND.
     *
     * `produceStyle` declares four values in data/taxonomy.js — build (A1),
     * guided (A2), full (B1/B2), extended (C1, mapped to full in
     * js/profile.js). This branched on 'guided' alone, so:
     *
     *   · A2 hit the restricted branch and wrote NOTHING for 81 days. Build a
     *     scrambled sentence, translate a sentence, done. Measured across the
     *     whole band: 162 tasks served, every one a build or a translation,
     *     while 215 eligible write/paragraph tasks — 58 of them authored at
     *     A2's own levels — were never reached once.
     *   · A1's 'build' was handled nowhere, fell through to the full branch,
     *     and therefore did MORE free production than the band above it.
     *
     * That inversion is fallout from the profiles→levels migration
     * (tools/ARCHITECTURE_V2.md, decision 4): 'guided' is a SUPPORT value that
     * ended up in the LEVEL table, so A2 inherited the old beginner profile's
     * scaffolding as though it were a property of the band.
     *
     * All four values are now handled. A2's produce stage goes from two tasks
     * to four, and that IS a longer session — two was not a shortened form of
     * writing practice, it was the absence of it, so there was nothing to
     * trim. It stays one task shorter than B1 (which takes two `write`s), and
     * the task it gains over A1 is the `paragraph`: the A1→A2 step the CEFR
     * actually describes is not more writing but CONNECTED writing, the first
     * point at which the learner has to link sentences to each other.
     *
     * A1 keeps what it had. Level 1 excludes paragraphs by the gate below, and
     * its 156 level-1 `write` tasks were authored for exactly this slot; the
     * accident produced the right outcome and only the reasoning was missing. */
    var produce;
    if (pr.produceStyle === 'guided') {
      produce = []
        .concat(sample(builds, 1, rng))
        .concat(sample(preferAligned(trans, focus, writeMatchesFocus), big ? 2 : 1, rng))
        .concat(sample(preferAligned(frees, focus, writeMatchesFocus), big ? 2 : 1, rng))
        .concat(sample(preferAligned(paras, focus, writeMatchesFocus), 1, rng));
    } else if (essayDay) {
      produce = []
        .concat(sample(builds, 1, rng))
        .concat(sample(preferAligned(trans, focus, writeMatchesFocus), 1, rng))
        .concat(sample(preferAligned(essays, focus, writeMatchesFocus), 1, rng));
    } else {
      // 'build' (A1), 'full' (B1/B2), 'extended' → 'full' (C1).
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
    var aligned = passages.filter(function (x) { return passageUsesFocus(x, focus, lesson); });
    var themed = [];
    if (!aligned.length && lesson && lesson.theme) {
      themed = passages.filter(function (x) { return x.theme === lesson.theme; });
    }
    var storyPool = aligned.length ? aligned : (themed.length ? themed : passages);
    var storyTier = aligned.length ? 'focus' : (themed.length ? 'theme' : 'level');

    /* A chosen focus outranks all three tiers — the learner asked for this
     * theme out loud, which is a better reason than any the scheduler has. It
     * still prefers a passage that ALSO uses today's grammar, so a focus buys
     * a narrower choice rather than a worse one. */
    var fTheme = FO ? FO.theme() : null;
    if (fTheme) {
      var inF = passages.filter(function (x) { return x.theme === fTheme; });
      if (inF.length) {
        var both = inF.filter(function (x) { return passageUsesFocus(x, focus, lesson); });
        storyPool = both.length ? both : inF;
        storyTier = both.length ? 'focus' : 'themeFocus';
      }
    }

    /* Prefer something not read yet.
     *
     * Applied to whatever pool the tiers produced, so it never widens the
     * choice — an unread passage that is wrong for today still loses to the
     * tier above it. It only breaks the tie the scheduler was previously
     * breaking by re-serving a favourite.
     *
     * Falls back to the whole pool when everything in it has been read, which
     * is the same bargain taughtTenses and Focus.narrow already make: a stage
     * that must produce a passage cannot be handed an empty list, and a
     * repeat is better than nothing. */
    var alreadyRead = readSet();
    var unread = storyPool.filter(function (x) { return !alreadyRead[x.id]; });
    if (unread.length) storyPool = unread;

    /* A day that names its reading (data/course.js `passage`) gets it. Outranks
     * every tier above, including a chosen theme focus AND the unread
     * preference: the opening fortnight is authored, day 11 re-reads day 1 on
     * purpose, and a hand-picked text losing because it has been seen would
     * defeat the point of writing it down.
     *
     * Read out of `passages`, which is already gated by level and by taught
     * tense, so an id that names something the learner cannot meet yet falls
     * back to the scheduler rather than serving a text full of unseen tenses.
     * tools/validate-content.js checks these ids resolve and are legal on
     * their day, so a fallback here means the gate would have caught it. */
    if (focus.passage) {
      var named = passages.filter(function (x) { return x.id === focus.passage; });
      if (named.length) { storyPool = named; storyTier = 'focus'; }
    }

    /* Among passages that are equally right on grammar and theme, prefer the
     * one that would TEACH the most — the most words the learner has no SRS
     * state for yet.
     *
     * This is the other half of drawing the day's new words from the day's
     * passage (js/views/review.js). With the passage chosen purely on grammar
     * and theme, that preference decays as the learner advances: measured at
     * 100% same-day overlap on an empty SRS, 72% with half the vocabulary
     * known, 17% at 80% and 0% at 95%, because by then almost nothing left in
     * the text is still new. Choosing the passage for its unmet words holds
     * the overlap up instead of letting it fade exactly when the learner has
     * the most Spanish to build on.
     *
     * Scored over the candidates the tiers already produced, never across
     * them: this decides WHICH of the right passages, never whether to take a
     * wrong one. Ties keep the seeded rng, so the choice still rotates and a
     * first-time lesson is still reproducible on reload. */
    var unmet = Object.create(null);
    if (window.LexMatch && window.SRS) {
      (window.VOCAB || []).forEach(function (w) {
        if (!w.es || window.SRS.isEnrolled('v:' + w.es + ':meaning')) return;
        var b = window.LexMatch.base(w.es);
        if (b.length >= 3) unmet[b] = 1;
      });
    }
    function teaches(p) {
      if (!window.LexMatch || !p || !p.text) return 0;
      var seen = Object.create(null), n = 0;
      window.LexMatch.norm(p.text).split(' ').forEach(function (t) {
        if (!t || t.length < 3) return;
        var cands = [t];
        if (/es$/.test(t)) cands.push(t.slice(0, -2));
        if (/s$/.test(t)) cands.push(t.slice(0, -1));
        for (var i = 0; i < cands.length; i++) {
          if (unmet[cands[i]] && !seen[cands[i]]) { seen[cands[i]] = 1; n++; return; }
        }
      });
      return n;
    }
    /* Two stages, because the raw count and the density each answer half of
     * it and neither answers both.
     *
     * The FLOOR is what the raw count was really for: the day's new words are
     * drawn from this passage, so a text carrying fewer unmet words than the
     * day's quota cannot overlap with all of them however good it is.
     *
     * Above that floor, prefer the DENSER text, not the longer one. Scoring on
     * the raw count alone made length the dominant term — measured over the
     * 139 A1 passages, correlation between length and score was +0.51, the 20
     * top-scoring averaged 77 words against A1's 30-60 target, and NOT ONE of
     * them was inside it. So the scheduler was systematically picking the
     * baggiest text available, and any correctly-sized passage written later
     * would lose to a longer one for being shorter. Normalising flips that to
     * -0.35, and 16 of the top 20 land in target. */
    function words(t) { return String(t || '').split(/\s+/).filter(Boolean).length; }
    function richest(pool) {
      if (!pool || !pool.length) return null;
      // Bounded: this runs on a phone, once per session.
      var cand = pool.length > 40 ? sample(pool, 40, rng) : pool;
      var need = pr.newPerDay || 5;
      var scored = cand.map(function (p) { return { p: p, n: teaches(p), w: words(p.text) }; });
      var enough = scored.filter(function (x) { return x.n >= need; });
      // Below the floor nothing can overlap fully, so there the raw count IS
      // the right measure — take the one that carries the most.
      var useDensity = enough.length > 0;
      var field = useDensity ? enough : scored;
      var best = -1, top = [];
      field.forEach(function (x) {
        var s = useDensity ? x.n / Math.max(x.w, 1) : x.n;
        if (s > best) { best = s; top = [x.p]; } else if (s === best) top.push(x.p);
      });
      return pick(top, rng);
    }

    return {
      day: day,
      dayIndex: dayIndex,
      level: level,
      profile: pr.name,
      focus: focus,
      dateLabel: new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
      lesson: lesson,
      mode: mode,
      passage: richest(storyPool.length ? storyPool : passages),
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

  /* WHICH PASSAGES HAVE BEEN READ.
   *
   * Nothing recorded this, and the cost was severe: over the first 60 days the
   * scheduler served 45 lesson-days out of 24 distinct passages, one of them
   * eight times. The preference that picks a passage — most unmet vocabulary
   * per word read (see `richest`) — has no memory, so the same short, dense
   * text keeps winning every time it is eligible. Re-reading one passage four
   * times in a month is a worse failure than a hard passage.
   *
   * Recorded when the READING STAGE FINISHES, not when the day is built:
   * buildContext is deterministic and re-runs on every reload, so marking
   * there would retire passages the learner never actually read.
   *
   * The day is stored rather than a bare flag — it costs the same and leaves
   * the door open to "offer this again after N days", which is a different
   * decision from "never again" and should not be foreclosed here. */
  function markRead(id) {
    if (!id) return;
    var p = loadProg();
    p.read = p.read || {};
    if (p.read[id]) return;
    p.read[id] = dayNumber();
    saveProg(p);
  }
  function readSet() { return loadProg().read || {}; }
  function bumpStreak() {
    var p = loadProg(), day = dayNumber();
    // record the active day for the dashboard heatmap (even if already counted today)
    p.history = p.history || [];
    if (p.history.indexOf(day) === -1) p.history.push(day);
    if (p.lastDay === day) { saveProg(p); return p; }
    /* `streak` is still written for anything that reads an old save, but
     * nothing in the UI shows it any more — see rhythm(). */
    p.streak = (p.lastDay === day - 1) ? (p.streak || 0) + 1 : 1;
    p.lastDay = day; p.total = (p.total || 0) + 1;
    saveProg(p); return p;
  }

  /* ---- rhythm, which replaced the streak ---------------------------------
   * A consecutive-day streak reset to 1 on a single missed day, so a learner
   * forty days in who had one bad Tuesday was shown the same number as
   * somebody who started yesterday. That is a punishment for a life event,
   * and it is the opposite of what a course measured in months wants.
   *
   * js/gamescore.js had already worked this out for the games — "no streak
   * that punishes a missed day" — so the app disagreed with itself and the
   * punishing half was the one on the home screen.
   *
   * Days practised in the last thirty cannot be destroyed by one miss, still
   * moves every day you turn up, and is a truer picture of a habit. The
   * history it reads has been recorded all along for the heatmap. */
  function rhythm() {
    var p = loadProg(), day = dayNumber();
    var hist = p.history || [];
    var days30 = 0, last = null;
    for (var i = 0; i < hist.length; i++) {
      var d = hist[i];
      if (d > day - 30 && d <= day) days30++;
      if (last === null || d > last) last = d;
    }
    return {
      days30: days30,
      total: p.total || 0,
      lastDay: last,
      away: last === null ? null : day - last,   // days since the last session
      today: last === day
    };
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

  /* What comes after today, without moving anything. The home card shows this
   * once the session is done: "tomorrow" is a real answer to "what now?", and
   * a course that rotates overnight should be willing to say what it rotates
   * to. Nothing is locked in this app — Lecciones has always let you take any
   * lesson — so the card can also offer to start it early. */
  function nextUp() {
    if (!window.Curriculum || !window.Curriculum.seq) return null;
    var pr = window.Profile ? window.Profile.params() : null;
    if (!pr || !pr.usesCurriculum) return null;
    var seq = window.Curriculum.seq(), prog = loadProg();
    var studied = prog.studied || {};
    var di = (prog.beginnerDay || 0) + 1;          // the day after the one just done
    for (var i = di; i < seq.length && i < di + 40; i++) {
      var f = seq[i];
      if (!f) continue;
      if (f.type === 'grammar') {
        if (studied[f.id]) continue;
        var l = lessonById(f.id);
        if (!l) continue;
        return { title: l.title, kind: 'grammar', focus: f, lessonId: l.id,
                 canDo: l.canDo || null };
      }
      if (f.type === 'verbs') return { title: T('Verbos nuevos', 'New verbs'), kind: 'verbs', focus: f, canDo: null };
      if (f.type === 'vocab') return { title: T('Palabras nuevas', 'New words'), kind: 'vocab', focus: f, canDo: null };
    }
    return null;
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
      // A passage counts as read once the reading stage is done with it.
      if (stage.key === 'comprehend' && ctx.passage) markRead(ctx.passage.id);
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
    // A session that finished is what a focus is counted in — see js/focus.js.
    if (window.Focus) window.Focus.tick();
    UI.clear(host);
    var wrap = UI.el('div', 'panel intro complete');
    wrap.appendChild(UI.el('div', 'big-check', '✓'));
    wrap.appendChild(UI.el('h1', null, T('Sesión terminada', 'Session done')));
    var rh = rhythm();
    wrap.appendChild(UI.el('div', 'streak-badge',
      '🔥 ' + rh.days30 + T(' de los últimos 30 días', ' of the last 30 days')));
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
    /* If today taught a tense, the best sixty seconds the learner can spend
     * are the next sixty, producing it against a clock. */
    if (window.Games && window.Games.tenseCard && ctx.lesson) {
      var tc = window.Games.tenseCard(ctx.lesson, function () { window.App.go('home'); });
      if (tc) wrap.appendChild(tc);
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
    rhythm: rhythm,
    nextUp: nextUp,
    mode: function () { return modeDef(); },
    resume: function () { host = document.getElementById('stage-host'); bar = document.getElementById('session-progress-fill'); if (idx >= 0 && ctx) runStage(); else start(); },
    isActive: function () { return idx >= 0 && idx < stages().length; },
    currentStageIndex: function () { return idx; },
    stageCount: function () { return stages().length; }
  };
})();
