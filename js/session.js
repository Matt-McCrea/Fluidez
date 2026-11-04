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
    rapido: { key: 'rapido', icon: '⚡', label: 'Cinco minutos', labelEn: 'Five minutes',       mins: 'unos 5 min', minsEn: 'about 5 min',
              blurb: 'Due reviews and a page of the story',
              keys: ['review', 'comprehend'] },
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

  /* ---- gate by NODE, not by tense ---------------------------------------
   *
   * Every passage, Apply item and writing task knows what it requires
   * (data/requires.js, keyed passage:<id>, apply:<index>, writing:<id>) and
   * js/known.js knows what the learner has met. An item is served only when
   * everything it requires has been taught by today, passed in review, or is
   * what today teaches (Known.allows). Replaces the old tense gate, and with
   * it the present-tense "floor": the present is just a node now, taught on
   * the day that teaches it.
   *
   * Among the allowed items, those that exercise today's lesson nodes are
   * preferred (Known.targets): at least two thirds of the Apply and Produce
   * picks, when enough exist.
   *
   * NEVER EMPTY, as a last resort only. If gating leaves a stage nothing, the
   * ungated set is used and the miss is written to ctx.gaps ({kind:'ungated'})
   * so the playtest can count how often supply ran out.
   *
   * EXPOSURE LEDGER. fluidez.seen maps an item key to the day it was last
   * served. Within SEEN_DAYS days it is not served again for Apply, Produce or
   * the passage, unless that would leave nothing: then the oldest is reused and
   * ctx.gaps says so ({kind:'reuse'}). A day's authored re-read (data/course.js
   * `passage`) is allowed and recorded as {kind:'authored-repeat'}. */
  var SEEN_KEY = 'fluidez.seen', SEEN_DAYS = 14;
  function loadSeen() { try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { return {}; } }
  function saveSeen(o) { try { localStorage.setItem(SEEN_KEY, JSON.stringify(o)); } catch (e) {} }
  var _applyIx = null, _applyIxSrc = null;
  function applyKey(it) {
    if (it && it.key) return it.key;                  // a bank item: bank:<id>
    var src = window.APPLY_ITEMS || [];
    if (_applyIxSrc !== src) { _applyIx = new Map(); src.forEach(function (x, i) { _applyIx.set(x, i); }); _applyIxSrc = src; }
    return 'apply:' + _applyIx.get(it);
  }
  function writeKey(t) { return t.key || ('writing:' + t.id); }
  function passageKey(p) { return 'passage:' + p.id; }
  /* Record what a session served. Called once when a fresh (non-repeat) session
   * starts, not from buildContext: the home screen and a resume build contexts
   * too and must not count as serving. */
  function markSeen(c) {
    if (!c || c.repeat) return;
    var seen = loadSeen(), d = c.seenDay != null ? c.seenDay : c.day;
    if (c.passage && !c.chapter) seen[passageKey(c.passage)] = d;   // a chapter day does not read it
    (c.applyItems || []).forEach(function (x) { seen[applyKey(x)] = d; });
    (c.writeTasks || []).forEach(function (t) { seen[writeKey(t)] = d; });
    Object.keys(seen).forEach(function (k) { if (d - seen[k] > 60) delete seen[k]; });
    saveSeen(seen);
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

  /* NO MONOTONY RUNS. Never more than MAX_RUN cards of one shape in a row. When
   * a run would grow past that, the next card of a different shape is pulled
   * forward; everything else keeps its order. If nothing else is left the run
   * stays (a stage of six cloze items has no other shape to rotate to). */
  var MAX_RUN = 4;
  function shapeOf(x) { return (x && x.type) || '?'; }
  function breakRuns(items, shape, max) {
    var rest = (items || []).slice(), out = [];
    while (rest.length) {
      var n = out.length, run = 0, last = null;
      if (n) { last = shape(out[n - 1]); for (var k = n - 1; k >= 0 && shape(out[k]) === last; k--) run++; }
      var at = 0;
      if (run >= max) {
        for (var j = 0; j < rest.length; j++) if (shape(rest[j]) !== last) { at = j; break; }
      }
      out.push(rest.splice(at, 1)[0]);
    }
    return out;
  }

  function buildContext(opts) {
    if (window.Perf) return window.Perf.mark('session build', function () { return buildContextInner(opts); });
    return buildContextInner(opts);
  }

  /* Which lesson today is, and where it sits in the course.
   *
   * Split out of buildContext so the home screen can name today's work without
   * also sampling a passage, six cloze items and five writing tasks — Inicio
   * re-renders on every tab switch, and that sampling is the expensive half. */
  function pickFocus(over) {
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
      /* `over.di` pins the day: a resumed or repeated session must rebuild the
       * day it STARTED on, not whatever the counter says now. */
      var pinned = !!(over && over.di != null);
      if (pinned) di = over.di;
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
      if (!pinned && prog.courseSig !== sig) { di = 0; prog.courseSig = sig; remapped = true; }
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
      while (!pinned && di < seq.length && doneAlready(seq[di])) { di++; moved = true; }
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
      if (over && over.lessonId) { var ol = lessonById(over.lessonId); if (ol) lesson = ol; }
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
             focus: focus, lesson: lesson, level: level, dayIndex: dayIndex,
             di: (pr.usesCurriculum && window.Curriculum) ? di : null };
  }

  function buildContextInner(opts) {
    opts = opts || {};
    var over = opts.over || null;
    var f = pickFocus(over);
    var day = f.day, pr = f.pr, studied = f.studied;
    var focus = f.focus, lesson = f.lesson, level = f.level, dayIndex = f.dayIndex;

    function atLevel(arr) { return arr.filter(function (x) { return (x.level || 1) <= level; }); }

    var gaps = [];
    var Kn = window.Known;
    var gating = !!(Kn && window.REQUIRES && window.GRAPH && !pr.unlockAll);
    var gi = dayIndex != null ? dayIndex : -1;
    var tNodes = gating ? Kn.todayNodes(focus, gi) : new Set();
    var known = gating ? Kn.forLearner(f.prog, gi) : null;
    var band = pr.cefr || null;
    var seenDay = opts.today != null ? opts.today : day;
    var seen = loadSeen();
    function recent(key) {
      var s = seen[key];
      return s != null && s !== seenDay && seenDay - s >= 0 && seenDay - s < SEEN_DAYS;
    }
    // node gate; the ungated set only as a last resort, and logged
    function gated(arr, keyOf, stage) {
      if (!gating) return arr;
      var ok = arr.filter(function (x) { return Kn.allows(keyOf(x), known, tNodes, band); });
      if (ok.length) return ok;
      if (arr.length) gaps.push({ kind: 'ungated', stage: stage, lesson: lesson ? lesson.id : null });
      return arr;
    }
    var NONE = function () { return false; };
    /* n items: up to two thirds from those that target today's nodes (when that
     * many exist), the rest from the other unseen ones, then leftovers, then
     * (logged) the oldest seen. Focus alignment (tense/concept) ranks within
     * each tier, as before. */
    function choose(pool, n, keyOf, matchFn, stage) {
      if (!pool.length || n <= 0) return [];
      var fresh = pool.filter(function (x) { return !recent(keyOf(x)); });
      var stale = pool.filter(function (x) { return recent(keyOf(x)); })
        .sort(function (a, b) { return seen[keyOf(a)] - seen[keyOf(b)]; });
      var pref = gating ? fresh.filter(function (x) { return Kn.targets(keyOf(x), tNodes); }) : [];
      var rest = fresh.filter(function (x) { return pref.indexOf(x) < 0; });
      var fn = matchFn || NONE;
      var out = sampleAligned(pref, focus, Math.min(pref.length, Math.ceil(n * 2 / 3)), fn, rng);
      if (out.length < n) out = out.concat(sampleAligned(rest, focus, n - out.length, fn, rng));
      if (out.length < n) out = out.concat(sample(pref.filter(function (x) { return out.indexOf(x) < 0; }), n - out.length, rng));
      if (out.length < n && stale.length) {
        var more = stale.slice(0, n - out.length);
        out = out.concat(more);
        gaps.push({ kind: 'reuse', stage: stage, keys: more.map(keyOf) });
      }
      return out;
    }

    var passAll = gated(atLevel(window.PASSAGES || []), passageKey, 'comprehend');
    var passages = passAll.filter(function (x) { return !recent(passageKey(x)); });
    if (!passages.length && passAll.length) {
      passages = [passAll.slice().sort(function (a, b) { return seen[passageKey(a)] - seen[passageKey(b)]; })[0]];
      gaps.push({ kind: 'reuse', stage: 'comprehend', keys: [passageKey(passages[0])] });
    }
    var apply = safeVerbs(gated(atLevel(window.APPLY_ITEMS || []), applyKey, 'apply'));
    var writes = safeWriting(gated(atLevel(window.WRITING_TASKS || []), writeKey, 'produce'));

    // The FIRST time a grammar lesson is seen (not yet in `studied`), its
    // content is picked with a seed derived from the lesson id — reproducible
    // if you reload mid-session, but distinct lesson to lesson. Once you've
    // studied it and come back around to it again (review rotation), selection
    // is plain Math.random so repeats don't feel identical every time.
    var firstTime = (focus.type === 'grammar' && lesson) ? !studied[lesson.id] : false;
    var rng = firstTime ? UI.seededRandom(lesson.id)
      : (opts.seed != null ? UI.seededRandom('s:' + opts.seed) : Math.random);

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
        .concat(choose(builds, 1, writeKey, null, 'produce'))
        .concat(choose(trans, big ? 2 : 1, writeKey, writeMatchesFocus, 'produce'))
        .concat(choose(frees, big ? 2 : 1, writeKey, writeMatchesFocus, 'produce'))
        .concat(choose(paras, 1, writeKey, writeMatchesFocus, 'produce'));
    } else if (essayDay) {
      produce = []
        .concat(choose(builds, 1, writeKey, null, 'produce'))
        .concat(choose(trans, 1, writeKey, writeMatchesFocus, 'produce'))
        .concat(choose(essays, 1, writeKey, writeMatchesFocus, 'produce'));
    } else {
      // 'build' (A1), 'full' (B1/B2), 'extended' → 'full' (C1).
      produce = []
        .concat(choose(builds, 1, writeKey, null, 'produce'))
        .concat(choose(trans, big ? 2 : 1, writeKey, writeMatchesFocus, 'produce'))
        .concat(choose(frees, big ? 3 : 2, writeKey, writeMatchesFocus, 'produce'))
        .concat(level >= 2 ? choose(paras, 1, writeKey, writeMatchesFocus, 'produce') : []);
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
    /* Between "uses today's words" and "same theme": a passage that requires
     * today's lesson nodes (Known.targets). */
    var targeted = (!aligned.length && gating)
      ? passages.filter(function (x) { return Kn.targets(passageKey(x), tNodes); }) : [];
    var themed = [];
    if (!aligned.length && !targeted.length && lesson && lesson.theme) {
      themed = passages.filter(function (x) { return x.theme === lesson.theme; });
    }
    var storyPool = aligned.length ? aligned : (targeted.length ? targeted : (themed.length ? themed : passages));
    var storyTier = (aligned.length || targeted.length) ? 'focus' : (themed.length ? 'theme' : 'level');

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
      var named = passAll.filter(function (x) { return x.id === focus.passage; });
      if (named.length) {
        storyPool = named; storyTier = 'focus';
        if (recent(passageKey(named[0]))) gaps.push({ kind: 'authored-repeat', stage: 'comprehend', keys: [passageKey(named[0])] });
      }
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

    /* A repeat or a resume names its passage; everything else is the scheduler's
     * choice. Looked up in the whole table, not the gated one: the learner has
     * already been shown this text today. */
    var named0 = null;
    if (over && over.passageId) {
      named0 = (window.PASSAGES || []).filter(function (x) { return x.id === over.passageId; })[0] || null;
    }
    var chosenPassage = named0 || richest(storyPool.length ? storyPool : passages);

    /* ---- THE SENTENCE BANK AS THE PRACTICE SUPPLY (js/bankitems.js) ----------
     * The authored pools are small, so on most days few of their items exercise
     * what today teaches. After they are gated and chosen, the bank tops up:
     *   Apply: at least half the day's items target today's nodes. Structured
     *     input first on a lesson day with a grammar node, then cloze, then gap.
     *   Produce: the translate slot(s) come from the bank for today's nodes.
     * Rows come from forNodes (allowed by Known, unseen for 14 days, deduped).
     * Nothing for today is logged in ctx.gaps ({kind:'bank-empty'}); a band
     * that is not loaded yet is logged too ({kind:'bank-unloaded'}).
     * Bank items carry key 'bank:<id>', so the ledger records them. */
    var applyN = big ? 12 : (mode === 'corto' ? 4 : 6);
    var applyPicks = choose(apply, applyN, applyKey, clozeMatchesFocus, 'apply');
    var BI = window.BankItems;
    if (gating && BI && band) {
      if (!BI.ready(band)) {
        gaps.push({ kind: 'bank-unloaded', stage: 'apply' });
      } else {
        var rows = tNodes.size ? BI.forNodes(tNodes, known, { band: band, recent: recent }) : [];
        /* A day that teaches no node of its own (a can-do day) practises the unit so far. */
        if (!rows.length && focus.unit) {
          var uNodes = Kn.todayNodes({ type: 'practice', unit: focus.unit }, gi);
          rows = BI.forNodes(uNodes, known, { band: band, recent: recent });
          if (rows.length) gaps.push({ kind: 'bank-unit-fallback', stage: 'apply' });
        }
        if (!rows.length) gaps.push({ kind: 'bank-empty', stage: 'apply' });
        else {
          var pool = sample(rows.slice(0, rows.primary), 600, rng).concat(sample(rows.slice(rows.primary), 300, rng)), used = {}, bankApply = [];
          var isHit = function (x) { return x.bankId ? true : Kn.targets(applyKey(x), tNodes); };
          // Produce first: the translate slot(s) and the build come from the bank, then Apply fills the rest of the half
          var len = level >= 3 ? 16 : 10, free = function () { return rows.filter(function (r) { return !used[r.id]; }); };
          var tCount = produce.filter(function (t) { return t.type === 'translate'; }).length;
          if (tCount) {
            var shortRows = free().filter(function (r) { return BI.words(r.es) >= 3 && BI.words(r.es) <= len; });
            var tp = sample(shortRows.length >= tCount ? shortRows : free(), tCount, rng);
            tp.forEach(function (r) { used[r.id] = 1; });
            if (tp.length) {
              var ti = 0;
              produce = produce.map(function (t) { return t.type === 'translate' && ti < tp.length ? BI.translate(tp[ti++]) : t; });
            } else gaps.push({ kind: 'bank-empty', stage: 'produce' });
          }
          var bi = -1;
          produce.forEach(function (t, i) { if (t.type === 'build' && bi < 0) bi = i; });
          if (bi >= 0) {
            var bs = sample(free().filter(function (r) { return BI.build(r); }), 1, rng)[0];
            if (bs) { used[bs.id] = 1; produce[bi] = BI.build(bs); }
          }
          var pHit = produce.filter(function (t) { return t.bankId; }).length;
          var total = applyN + produce.length;
          var need = Math.max(Math.ceil(applyN / 2) - applyPicks.filter(isHit).length,
                              Math.ceil(total / 2) - pHit - applyPicks.filter(isHit).length);
          need = Math.min(need, applyN - applyPicks.filter(isHit).length);
          var hasGrammar = false;
          tNodes.forEach(function (n) { if (n.charAt(0) === 'g') hasGrammar = true; });
          var order = (focus.type === 'grammar' && hasGrammar) ? ['read', 'cloze', 'gap', 'match'] : ['cloze', 'gap', 'read', 'match'];
          var maker = { read: function (r) { return BI.readAndPick(r, rng); }, cloze: BI.cloze, gap: function (r) { return BI.gap(r, rng); },
                        match: function (r) { return BI.matchSentence(r, rng); } };
          for (var slot = 0; slot < need; slot++) {
            /* the preferred kind first (two slots of three on a lesson day), the others as fallbacks */
            var first = slot % 3 === 2 ? order[1] : order[0], kinds = [first].concat(order.filter(function (k) { return k !== first; }));
            var item = null;
            for (var ki = 0; ki < kinds.length && !item; ki++) {
              for (var ri = 0, seen2 = 0; ri < pool.length && seen2 < 250 && !item; ri++) {
                if (used[pool[ri].id]) continue;
                seen2++;
                item = maker[kinds[ki]](pool[ri]);
                if (item) used[pool[ri].id] = 1;
              }
            }
            if (!item) { gaps.push({ kind: 'bank-empty', stage: 'apply' }); break; }
            bankApply.push(item);
          }
          if (bankApply.length) {
            // bank items replace authored picks that do not target today
            var keep = applyPicks.filter(isHit), drop = applyPicks.filter(function (x) { return !isHit(x); });
            applyPicks = keep.concat(bankApply, drop.slice(0, Math.max(0, applyN - keep.length - bankApply.length)));
          }
        }
      }
    }

    // A day's authored writing task (data/course.js `write`, the unit task's own
    // box) comes first in Produce, ahead of whatever the pools chose.
    if (focus && focus.write && window.WRITING_TASKS) {
      var authoredWrite = window.WRITING_TASKS.filter(function (t) { return t.id === focus.write; })[0];
      if (authoredWrite) {
        // The unit's own task is served whatever the gate says; the playtest
        // counts it as an authored choice, not a gap in supply.
        var aw = Object.assign({}, authoredWrite, { authored: true });
        if (recent(writeKey(aw))) gaps.push({ kind: 'authored-repeat', stage: 'produce', keys: [writeKey(aw)] });
        produce = [aw].concat(produce.filter(function (t) { return t.id !== focus.write; }));
      }
    }

    var built = {
      day: day,
      di: f.di,
      seed: opts.seed != null ? opts.seed : null,
      repeat: !!opts.repeat,
      startedDay: day,
      dayIndex: dayIndex,
      level: level,
      profile: pr.name,
      focus: focus,
      dateLabel: new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
      lesson: lesson,
      mode: mode,
      passage: chosenPassage,
      passageTier: storyTier,
      applyItems: breakRuns(applyPicks, shapeOf, MAX_RUN),
      writeTasks: breakRuns(produce, shapeOf, MAX_RUN),
      rng: rng,
      gaps: gaps,
      seenDay: seenDay,
      nodes: tNodes,
      results: {}
    };
    var Kn2 = window.Known, known2 = null;
    if (Kn2 && Kn2.forLearner && window.STORY_INDEX) { try { known2 = Kn2.forLearner(f.prog, gi); } catch (e) { known2 = null; } }
    return window.STORY_INDEX ? applyReading(built, f.prog, known2, over) : built;
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
    return { id: u.id, title: u.title, goal: u.goal,
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
  function markRead(id, text, chapter) {
    if (!id) return;
    var p = loadProg();
    if (chapter) {
      /* A chapter part: `chapterParts[id]` counts the parts done, `chaptersRead[id]`
       * is set (to the day) only with the last. One part a reading day. */
      p.chapterParts = p.chapterParts || {};
      if ((p.chapterParts[id] || 0) > chapter.part) return;
      p.chapterParts[id] = chapter.part + 1;
      p.chapterDay = dayNumber();
      if (chapter.part + 1 >= chapter.parts) { p.chaptersRead = p.chaptersRead || {}; p.chaptersRead[id] = dayNumber(); }
    } else {
      p.read = p.read || {};
      if (p.read[id]) return;
      p.read[id] = dayNumber();
    }
    // Words read: Spanish words in passages marked read, counted once per passage.
    var nWords = String(text || '').split(/\s+/).filter(Boolean).length;
    p.wordsRead = (p.wordsRead || 0) + nWords;
    var uid = ctx && !ctx.repeat ? unitIdOfCtx(ctx) : null;
    if (uid) {
      p.unitStats = p.unitStats || {};
      var us = p.unitStats[uid] = p.unitStats[uid] || { days: [], words: 0 };
      us.words = (us.words || 0) + nWords;
    }
    saveProg(p);
  }
  /* ---- THE SERIAL --------------------------------------------------------
   * One reading day a unit serves the next unread chapter of the story
   * (data/story) instead of a passage. Chapters load on demand, as the
   * library loads them; buildContext is synchronous, so begin()/resume()
   * preload the band file first (withReading) and the pick reads the cache.
   *
   * Coverage is the share of the chapter's lemmas the learner already knows
   * (Known's `l:` ids, the chapter's own glosses, and the function words
   * LIB.gloss treats as free). Below the band's target by no more than 0.10
   * the chapter is served anyway and ctx.gaps says so; further below, the
   * day reads a passage and ctx.gaps says the chapter is waiting. */
  var COVERAGE_TARGET = { A1: 0.85, A2: 0.90, B1: 0.93, B2: 0.95, C1: 0.95 };
  var COVERAGE_SLACK = 0.10;
  var storyLoads = {};
  function storyEntries() { return window.STORY_INDEX || []; }
  function storyEntry(id) { return storyEntries().filter(function (e) { return e.id === id; })[0] || null; }
  function chapterCached(id) {
    var e = storyEntry(id), list = e && window['STORY_' + e.band];
    return list ? (list.filter(function (c) { return c.id === id; })[0] || null) : null;
  }
  function loadStoryBand(entry, cb) {
    var key = 'STORY_' + entry.band;
    if (window[key]) { cb(); return; }
    if (typeof document === 'undefined' || !document.head || !document.head.appendChild) { cb(); return; }
    if (!storyLoads[entry.file]) {
      storyLoads[entry.file] = [];
      var s = document.createElement('script');
      s.src = entry.file;
      var fin = function () { var w = storyLoads[entry.file]; delete storyLoads[entry.file]; w.forEach(function (f) { f(); }); };
      s.onload = fin; s.onerror = fin;     // offline: the day falls back to a passage
      document.head.appendChild(s);
    }
    storyLoads[entry.file].push(cb);
  }
  // The first chapter (in serial order) not yet fully read, and how many parts of it are done.
  function nextChapterEntry(prog) {
    var cr = (prog && prog.chaptersRead) || {};
    return storyEntries().filter(function (e) { return !cr[e.id]; })[0] || null;
  }
  // A chapter read 14 to 21 days ago, else a passage read then: the five-minute day's fallback beat.
  function rereadCandidate(prog, day) {
    var best = null;
    function consider(kind, id, d) {
      var age = day - d;
      if (age >= 14 && age <= 21 && (!best || age > best.age)) best = { kind: kind, id: id, age: age };
    }
    var cr = prog.chaptersRead || {}, pr = prog.read || {};
    Object.keys(cr).forEach(function (id) { if (storyEntry(id)) consider('chapter', id, cr[id]); });
    Object.keys(pr).forEach(function (id) { consider('passage', id, pr[id]); });
    return best;
  }
  // The unit's one reading day: first lesson day at or after its third day; short units use their last day.
  function isReadingDay(dayIndex) {
    if (dayIndex == null) return false;
    var d = (window.COURSE_DAYS || [])[dayIndex];
    var u = d && d.unit ? (window.COURSE_UNITS || {})[d.unit] : null;
    if (!u || u.optional || u.from == null || !u.length) return false;
    var last = u.from + u.length - 1;
    if (u.length < 3) return dayIndex === last;
    for (var i = u.from + 2; i <= last; i++) {
      var di = (window.COURSE_DAYS || [])[i];
      if (di && di.lesson) return i === dayIndex;
    }
    return dayIndex === last;
  }
  function chapterCoverage(ch, known) {
    if (!known) return 1;      // no node graph loaded: nothing to measure against
    var lem = ch.lemmas || [];
    if (!lem.length) return 1;
    var gl = {};
    (ch.gloss || []).forEach(function (g) {
      (String(g.es || '').toLowerCase().match(/\p{L}+/gu) || []).forEach(function (w) { gl[w] = 1; });
    });
    var small = (window.LIB && window.LIB.gloss && window.LIB.gloss.SMALL_WORDS) || {};
    var n = 0;
    lem.forEach(function (l) {
      l = String(l).toLowerCase();
      if ((known && known.has('l:' + l)) || gl[l] || Object.prototype.hasOwnProperty.call(small, l)) n++;
    });
    return n / lem.length;
  }
  /* The next chapter part this learner can read, or null: {ch, part, cov, gap}.
   * `pin` is a snapshot's {chapterId, part}: a resume or repeat gets exactly that. */
  function chapterBeat(prog, known, pin, gaps) {
    if (pin && pin.chapterId) {
      var pc = chapterCached(pin.chapterId);
      return pc ? { ch: pc, part: pin.part || 0, cov: chapterCoverage(pc, known) } : null;
    }
    var e = nextChapterEntry(prog);
    if (!e) return null;
    var ch = chapterCached(e.id);
    if (!ch) { gaps.push({ kind: 'chapter-waiting', chapter: e.id, why: 'not loaded' }); return null; }
    var target = COVERAGE_TARGET[ch.band] || COVERAGE_TARGET[e.band] || 0.9;
    var cov = chapterCoverage(ch, known);
    if (cov + 1e-9 < target - COVERAGE_SLACK) { gaps.push({ kind: 'chapter-waiting', chapter: ch.id, coverage: Math.round(cov * 100) / 100, target: target }); return null; }
    var part = Math.min((prog.chapterParts || {})[ch.id] || 0, (ch.parts || []).length - 1);
    var beat = { ch: ch, part: part, cov: cov };
    if (cov + 1e-9 < target) { beat.gap = true; gaps.push({ kind: 'chapter-under-coverage', chapter: ch.id, coverage: Math.round(cov * 100) / 100, target: target }); }
    return beat;
  }
  // Decide today's reading beat on a built context: sets ctx.chapter / ctx.reread, and drops the passage a chapter replaces.
  function applyReading(c, prog, known, over) {
    var pin = over && (over.chapterId || over.rereadId) ? over : null;
    var snapped = !!(over && 'passageId' in over);      // a rebuilt session keeps the beat it started with
    var wantChapter = pin ? !!over.chapterId : (!snapped && (mode === 'rapido' || isReadingDay(c.dayIndex)));
    var servedToday = prog.chapterDay === c.day;       // one part per reading day
    if (wantChapter && (pin || !servedToday)) {
      var b = chapterBeat(prog, known, pin, c.gaps);
      if (b) { c.chapter = { id: b.ch.id, ch: b.ch, part: b.part, coverage: b.cov }; }
    }
    if (mode === 'rapido' && !c.chapter && (!snapped || pin)) {
      var rr = pin && over.rereadId ? { kind: over.rereadKind, id: over.rereadId } : rereadCandidate(prog, c.day);
      if (rr) {
        var item = rr.kind === 'chapter' ? chapterCached(rr.id) : (window.PASSAGES || []).filter(function (x) { return x.id === rr.id; })[0];
        if (item) {
          var text = rr.kind === 'chapter' ? (item.parts || []).map(function (p) { return p.text; }).join('\n\n') : item.text;
          c.reread = { kind: rr.kind, id: rr.id, title: item.title, text: text, gloss: item.gloss || [] };
        }
      }
    }
    if (mode === 'rapido') c.passage = null;           // the beat is the chapter part or the re-read, never a fresh passage
    return c;
  }
  // Preload whatever band file(s) the day's beat will need, then run fn.
  function withReading(over, fn) {
    var need = [], prog = loadProg();
    if (over && over.chapterId) { var pe = storyEntry(over.chapterId); if (pe) need.push(pe); }
    else if (over && over.rereadId) { if (over.rereadKind === 'chapter') { var re = storyEntry(over.rereadId); if (re) need.push(re); } }
    else {
      var f = pickFocus(over);
      if (mode === 'rapido' || isReadingDay(f.dayIndex)) {
        var ne = nextChapterEntry(prog); if (ne) need.push(ne);
        if (mode === 'rapido') { var rc = rereadCandidate(prog, dayNumber()); if (rc && rc.kind === 'chapter' && storyEntry(rc.id)) need.push(storyEntry(rc.id)); }
      }
    }
    var left = need.length;
    if (!left) { fn(); return; }
    need.forEach(function (e) { loadStoryBand(e, function () { if (--left === 0) fn(); }); });
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
    /* The counter moves when a session COMPLETES (see markDone), so it already
     * points at the day the next session will serve. It used to be read as
     * "the day just done" and bumped by one, which named a lesson the Start
     * button then did not open. */
    var di = prog.beginnerDay || 0;
    for (var i = di; i < seq.length && i < di + 40; i++) {
      var f = seq[i];
      if (!f) continue;
      if (f.type === 'grammar') {
        if (studied[f.id]) continue;
        var l = lessonById(f.id);
        if (!l) continue;
        return { title: l.title, kind: 'grammar', focus: f, lessonId: l.id, di: i,
                 canDo: l.canDo || null };
      }
      if (f.type === 'verbs') return { title: T('Verbos nuevos', 'New verbs'), kind: 'verbs', focus: f, di: i, canDo: null };
      if (f.type === 'vocab') return { title: T('Palabras nuevas', 'New words'), kind: 'vocab', focus: f, di: i, canDo: null };
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
    discardSession();
  }

  /* TIME IN THE SESSION. Active time only: it stops at a pause and starts again
   * on resume, so "N minutes in" on the hub is what was spent, not how long ago
   * the session was opened. */
  var STOP_AFTER_MS = 10 * 60000;
  function activeMs() {
    if (!ctx) return 0;
    return (ctx.activeMs || 0) + (ctx.segStart ? Date.now() - ctx.segStart : 0);
  }
  function minutesIn() {
    var ms = 0;
    if (ctx && idx >= 0) ms = activeMs();
    else { var r = pending(); ms = r ? (r.activeMs || 0) : 0; }
    return Math.floor(ms / 60000);
  }
  function pauseToShell() {
    if (ctx) { ctx.activeMs = activeMs(); ctx.segStart = null; persist(); }
    if (window.Shell) { window.Shell.closeOverlay(); window.Shell.go('inicio'); }
  }

  /* ---- the session survives a reload --------------------------------------
   *
   * Position used to live only in `idx` and `ctx`, so closing the tab sent the
   * learner back to Review. The record below is what is needed to rebuild the
   * same session: the mode, the stage and step, the RNG seed, and the ids of
   * what was chosen (lesson, passage, apply items by index, writing tasks by
   * id). A record from another day is dropped. */
  var SKEY = 'fluidez.session', LKEY = 'fluidez.lastsession';
  var stepIdx = 0, answers = {}, resumeAt = null;

  function readRec(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function writeRec(key, o) { try { localStorage.setItem(key, JSON.stringify(o)); } catch (e) {} }
  function dropRec(key) { try { localStorage.removeItem(key); } catch (e) {} }
  function bandNow() { return window.Profile && window.Profile.current ? window.Profile.current() : null; }

  // The saved session if it is today's and still makes sense, else null (and gone).
  function pending() {
    var rec = readRec(SKEY);
    if (!rec) return null;
    if (rec.startedDay !== dayNumber() || !MODES[rec.mode] || !rec.snap ||
        (rec.band && bandNow() && rec.band !== bandNow())) { dropRec(SKEY); return null; }
    return rec;
  }
  function makeSnap(c) {
    var ai = window.APPLY_ITEMS || [];
    return {
      di: c.di != null ? c.di : null,
      lessonId: c.lesson ? c.lesson.id : null,
      passageId: c.passage ? c.passage.id : null,
      chapterId: c.chapter ? c.chapter.id : null,
      part: c.chapter ? c.chapter.part : null,
      rereadId: c.reread ? c.reread.id : null,
      rereadKind: c.reread ? c.reread.kind : null,
      applyIx: (c.applyItems || []).map(function (x) { return ai.indexOf(x); }),
      // bank items are not in APPLY_ITEMS: kept by row id and kind, rebuilt on restore
      applyBank: (c.applyItems || []).map(function (x) { return x.bankId ? { id: x.bankId, kind: x.bankKind } : null; }),
      writeIds: (c.writeTasks || []).map(function (t) { return t.id; }),
      writeBank: (c.writeTasks || []).map(function (t) { return t.bankId ? t.bankKind : null; })
    };
  }
  function persist() {
    if (!ctx || idx < 0 || idx >= stages().length) return;
    writeRec(SKEY, { v: 1, mode: mode, stageIdx: idx, stepIdx: stepIdx, ctxSeed: ctx.seed,
                     startedDay: ctx.startedDay, band: bandNow(), answers: answers,
                     results: ctx.results, snap: ctx.snap, repeat: !!ctx.repeat,
                     startedAt: ctx.startedAt || null, activeMs: activeMs() });
  }
  function discardSession() { dropRec(SKEY); idx = -1; ctx = null; stepIdx = 0; answers = {}; resumeAt = null; }

  // Rebuild ctx from a saved record. False when it cannot be rebuilt faithfully.
  function restore(rec) {
    var snap = rec.snap;
    mode = rec.mode;
    var c = buildContext({ seed: rec.ctxSeed, over: snap, repeat: rec.repeat });
    if (snap.lessonId && (!c.lesson || c.lesson.id !== snap.lessonId)) return false;
    var ai = window.APPLY_ITEMS || [], wt = window.WRITING_TASKS || [];
    var BI = window.BankItems, rs = UI.seededRandom('r:' + rec.ctxSeed);
    var apply = (snap.applyIx || []).map(function (n, i) {
      var b = snap.applyBank && snap.applyBank[i];
      return b ? (BI ? BI.make(b.kind, BI.row(b.id), rs) : null) : ai[n];
    });
    var writes = (snap.writeIds || []).map(function (id, i) {
      if (/^bank:/.test(id)) return BI ? BI.make((snap.writeBank && snap.writeBank[i]) || 'translate', BI.row(id.slice(5)), rs) : null;
      return wt.filter(function (t) { return t.id === id; })[0];
    });
    if (apply.some(function (x) { return !x; }) || writes.some(function (x) { return !x; })) return false;
    c.applyItems = apply; c.writeTasks = writes;
    c.snap = snap; c.results = rec.results || {};
    if (snap.chapterId && !c.chapter) return false;
    c.startedAt = rec.startedAt || Date.now(); c.activeMs = rec.activeMs || 0; c.segStart = Date.now();
    if (rec.stageIdx >= stages().length) return false;
    ctx = c; idx = rec.stageIdx; stepIdx = rec.stepIdx || 0; answers = rec.answers || {};
    resumeAt = idx;
    return true;
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
    /* After ten minutes in a full session, a quiet way out that keeps the place. */
    if (mode === 'diaria' || mode === 'larga') {
      var stopB = UI.el('button', 'linkish stop-link', T('Necesito parar', 'I need to stop'));
      stopB.type = 'button'; stopB.style.display = 'none';
      stopB.addEventListener('click', pauseToShell);
      right.appendChild(stopB);
      var left = STOP_AFTER_MS - activeMs();
      if (left <= 0) stopB.style.display = '';
      else {
        var stopT = setTimeout(function () { if (ctx) { var rest = STOP_AFTER_MS - activeMs(); if (rest <= 0) stopB.style.display = ''; } }, left + 50);
        if (stopT && stopT.unref) stopT.unref();
      }
    }
    head.appendChild(right);
    host.appendChild(head);
    var body = UI.el('div', 'stage-body');
    host.appendChild(body);
    /* The stage's seam to the saved position: where to start (only on the stage
     * a resume landed in) and a save() to call after each card. */
    var fromHere = resumeAt === idx;
    if (!fromHere) { stepIdx = 0; answers = {}; }
    resumeAt = null;
    var myIdx = idx;
    ctx.step = {
      at: fromHere ? stepIdx : 0,
      extra: fromHere ? (answers[stage.key] || {}) : {},
      save: function (n, extra) {
        if (idx !== myIdx) return;
        stepIdx = n; answers[stage.key] = extra || {}; persist();
      }
    };
    persist();
    stage.run(body, ctx, function () {
      // A passage counts as read once the reading stage is done with it.
      if (stage.key === 'comprehend' && ctx.chapter) {
        var cp = ctx.chapter.ch.parts[ctx.chapter.part];
        markRead(ctx.chapter.id, cp.text, { part: ctx.chapter.part, parts: ctx.chapter.ch.parts.length });
      } else if (stage.key === 'comprehend' && ctx.passage) markRead(ctx.passage.id, ctx.passage.text);
      /* Learn finishing no longer marks the lesson studied or moves the day:
       * the day is done when the SESSION is (see markDone). Learn's own recall
       * items were enrolled inside the stage and stay enrolled. */
      idx++; stepIdx = 0; answers = {};
      if (idx < stages().length) persist();
      runStage();
    });
  }

  /* The day's progress, written once, when the whole session completes. Quick
   * and short modes never ran Learn, so they never mark a lesson studied. A
   * repeat is practice, not progress. */
  function markDone(c) {
    if (c.repeat) return;
    if (modeDef().keys.indexOf('learn') === -1) return;
    var p = loadProg();
    var pr = window.Profile ? window.Profile.params() : { name: 'standard' };
    if (pr.usesCurriculum) {               // paced path: step through the curriculum
      var base = c.di != null ? c.di : (p.beginnerDay || 0);
      p.beginnerDay = Math.max(p.beginnerDay || 0, base + 1);
      if (c.focus && c.focus.type === 'grammar' && c.lesson) { p.studied = p.studied || {}; p.studied[c.lesson.id] = 1; }
    } else if (c.lesson) {                 // standard/refresher: a grammar lesson each day
      p.studied = p.studied || {}; p.studied[c.lesson.id] = 1;
    }
    saveProg(p);
  }

  /* ---- UNITS AS A CHAIN ----------------------------------------------------
   * The week is a unit; finishing its last day is an event. These are the
   * lookups the unit-done card and the Progress screen share. */
  function unitOf(di) {
    var d = (window.COURSE_DAYS || [])[di];
    var u = d && d.unit ? (window.COURSE_UNITS || {})[d.unit] : null;
    return u && !u.optional ? u : null;
  }
  function unitIdOfCtx(c) {
    if (!c) return null;
    var u = c.focus && c.focus.unit ? (window.COURSE_UNITS || {})[c.focus.unit] : unitOf(c.dayIndex);
    return u && !u.optional && u.from != null ? u.id : null;
  }
  /* Days done of days. A1/A2 walk a counter; above that, a day is done when its
   * lesson is studied. */
  function unitProgress(u) {
    if (!u || u.from == null) return { done: 0, of: 0 };
    var p = loadProg(), pr = window.Profile ? window.Profile.params() : {};
    var done = 0;
    if (pr.usesCurriculum && window.Curriculum && window.Curriculum.startOf) {
      var at = window.Curriculum.startOf(pr.cefr || window.Profile.current()) + (p.beginnerDay || 0);
      done = Math.max(0, Math.min(u.length, at - u.from));
    } else {
      var st = p.studied || {};
      (window.COURSE_DAYS || []).slice(u.from, u.from + u.length).forEach(function (d) {
        if (d.lesson && st[d.lesson]) done++;
      });
    }
    if (p.unitsDone && p.unitsDone[u.id]) done = u.length;
    return { done: done, of: u.length };
  }
  function unitOrdinal(u) {
    var n = 0, all = window.COURSE_UNITS || {};
    Object.keys(all).forEach(function (k) {
      var x = all[k];
      if (!x.optional && x.from != null && x.band === u.band && x.from <= u.from) n++;
    });
    return n;
  }
  function unitFollowing(u) {
    var all = window.COURSE_UNITS || {}, want = u.from + u.length, hit = null;
    Object.keys(all).forEach(function (k) { if (!all[k].optional && all[k].from === want) hit = all[k]; });
    return hit;
  }
  /* Is the session that just finished the last day of its unit, and the first
   * time that has been true? Writes the record that makes it once-only. */
  function detectUnitDone(c) {
    if (c.repeat || modeDef().keys.indexOf('learn') === -1) return null;
    var uid = unitIdOfCtx(c);
    if (!uid) return null;
    var u = window.COURSE_UNITS[uid], p = loadProg();
    if (p.unitsDone && p.unitsDone[uid]) return null;
    var pr = window.Profile ? window.Profile.params() : {}, last;
    if (pr.usesCurriculum) last = c.dayIndex === u.from + u.length - 1;
    else last = !!(c.lesson && window.UnitCheck && window.UnitCheck.isDone(u) &&
                   window.UnitCheck.lessonIds(u).indexOf(c.lesson.id) !== -1);
    if (!last) return null;
    p.unitsDone = p.unitsDone || {}; p.unitsDone[uid] = dayNumber();
    saveProg(p);
    return u;
  }
  /* Today counts as one of the unit's sessions (a repeat does not). */
  function recordUnitDay(c) {
    var uid = unitIdOfCtx(c);
    if (!uid || c.repeat) return;
    var p = loadProg();
    p.unitStats = p.unitStats || {};
    var us = p.unitStats[uid] = p.unitStats[uid] || { days: [], words: 0 };
    var d = dayNumber();
    if (us.days.indexOf(d) === -1) us.days.push(d);
    saveProg(p);
  }
  function unitNumbers(u) {
    var us = (loadProg().unitStats || {})[u.id] || { days: [], words: 0 };
    var inDays = {}; us.days.forEach(function (d) { inDays[d] = 1; });
    var log = []; try { log = JSON.parse(localStorage.getItem('fluidez.reviewlog')) || []; } catch (e) {}
    var n = 0, right = 0;
    log.forEach(function (e) { if (inDays[e.day]) { n++; if (e.ok) right++; } });
    return { sessions: us.days.length, words: us.words || 0, reviewed: n, right: right,
             share: n ? Math.round(100 * right / n) : null };
  }
  function plain(t) { return String(t || '').replace(/\s*[—–]\s*/g, ', ').replace(/\s+-\s+/g, ', ').replace(/\.$/, ''); }
  function unitCanDos(u) {
    var out = [];
    window.UnitCheck.lessonIds(u).forEach(function (id) {
      var l = lessonById(id);
      if (l && l.canDo && out.length < 5) out.push(plain(l.canDo));
    });
    if (!out.length) (u.canDo || []).slice(0, 5).forEach(function (c) { out.push(plain(c)); });
    if (!out.length && u.goal) out.push(plain(u.goal));
    return out;
  }
  function unitDoneCard(u) {
    var card = UI.el('div', 'unit-done-card');
    card.appendChild(UI.el('div', 'eyebrow', T('Unidad terminada', 'Unit done')));
    card.appendChild(UI.el('h2', null, T('Unidad ', 'Unit ') + unitOrdinal(u) + T(' terminada: ', ' done: ') + u.title));
    var cds = unitCanDos(u);
    if (cds.length) {
      card.appendChild(UI.el('div', 'muted small', T('Ahora puedes...', 'You can now...')));
      var ul = UI.el('ul', 'summary-list');
      cds.forEach(function (c) { ul.appendChild(UI.el('li', null, c)); });
      card.appendChild(ul);
    }
    var nm = unitNumbers(u), bits = [];
    bits.push(nm.sessions + (nm.sessions === 1 ? ' session' : ' sessions'));
    if (nm.share != null) bits.push(nm.share + '% right');
    bits.push(nm.words + ' words read');
    card.appendChild(UI.el('p', 'unit-numbers', bits.join(' · ')));
    var F = window.Focus, band = bandNow();
    if (F && F.newlyDone && band) {
      F.newlyDone(band).forEach(function (t) {
        card.appendChild(UI.el('p', 'muted small', F.themeLabel(t) + T(' está hecho en ', ' is done at ') + band +
          T('. Vuelve en el nivel siguiente con material más difícil.', '. It returns one band up with harder material.')));
      });
    }
    if (window.UnitCheck && window.UnitCheck.testable(u)) {
      var tb = UI.el('button', 'ghost-btn', T('Hacer la prueba de la unidad', 'Take the unit check')); tb.type = 'button';
      tb.addEventListener('click', function () {
        window.UnitCheck.run(u, function () { if (ctx && !ctx.repeat) renderComplete(); else window.App.go('home'); });
      });
      card.appendChild(tb);
    }
    var nxt = unitFollowing(u);
    if (nxt && window.Hub && window.Hub.themeOffer) {
      var offer = window.Hub.themeOffer({ unitId: nxt.id, days: nxt.length, band: bandNow(),
        title: T('La próxima semana: elige un tema, o sigue.', 'Next week: pick a theme, or carry on.') });
      if (offer) card.appendChild(offer);
    }
    return card;
  }

  function renderComplete() {
    setProgress(1, 1);
    if (!ctx.counted) {
      ctx.counted = true;
      markDone(ctx);
      if (!ctx.repeat) {
        bumpStreak();
        recordUnitDay(ctx);
        var doneUnit = detectUnitDone(ctx);
        if (doneUnit) ctx.unitDone = doneUnit.id;
        // A session that finished is what a focus is counted in — see js/focus.js.
        if (window.Focus) window.Focus.tick();
        // ...and what the league's «días» column counts — see js/liga.js.
        if (window.Liga && ctx.results) {
          window.Liga.sessionDone(ctx.results.review ? ctx.results.review.correct : 0);
        }
        // What "do it again" repeats: today's session as it was started.
        writeRec(LKEY, { startedDay: ctx.startedDay, mode: mode, snap: ctx.snap });
      }
      dropRec(SKEY);
    }
    UI.clear(host);
    var wrap = UI.el('div', 'panel intro complete');
    wrap.appendChild(UI.el('div', 'big-check', '✓'));
    wrap.appendChild(UI.el('h1', null, T('Sesión terminada', 'Session done')));
    if (ctx.unitDone && window.COURSE_UNITS[ctx.unitDone] && window.UnitCheck) {
      wrap.appendChild(unitDoneCard(window.COURSE_UNITS[ctx.unitDone]));
    }
    var rh = rhythm();
    wrap.appendChild(UI.el('div', 'streak-badge',
      '🔥 ' + rh.days30 + T(' de los últimos 30 días', ' of the last 30 days')));
    var r = ctx.results;
    var lines = [];
    if (r.review) lines.push('Reviewed <b>' + r.review.seen + '</b> items, ' + r.review.correct + ' right');
    // Only name a focus if the lesson stage actually ran; a quick review has none.
    if (r.learn || modeDef().keys.indexOf('learn') !== -1) lines.push('Lesson: <b>' + focusLabel(ctx) + '</b>');
    if (r.learn && r.learn.total) lines.push('Quick check: <b>' + r.learn.correct + '/' + r.learn.total + '</b>');
    if (r.reread) lines.push('Read it again in <b>' + r.reread.time + '</b>');
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
    /* The day in one paste-able block, offered the moment it is finished.
     * Everything in it was on screen a second ago and about to be discarded;
     * a person waiting for your message is the cheapest reason there is to
     * come back tomorrow. See js/report.js.
     *
     * The modal comes up on its own, and the button below is how you get it
     * back — dismissing it must not be the same as losing it. */
    var reportData = {
      kind: 'session',
      dateLabel: ctx.dateLabel,
      band: window.Profile ? window.Profile.current() : null,
      dayNumber: ctx.dayIndex != null ? ctx.dayIndex + 1 : null,
      unit: unitLabel(ctx),
      lessonTitle: (r.learn || modeDef().keys.indexOf('learn') !== -1) ? focusLabel(ctx) : null,
      lessonCanDo: ctx.lesson ? ctx.lesson.canDo : null,
      passage: (r.comprehend && ctx.passage) ? ctx.passage : null,
      results: r,
      rhythm: rh
    };
    if (window.Report) {
      var reopen = UI.el('button', 'ghost-btn report-reopen',
        '📨 ' + T('Cópialo y mándaselo a Matthew', 'Copy and send to Matthew'));
      reopen.type = 'button';
      reopen.addEventListener('click', function () { window.Report.show(reportData); });
      wrap.appendChild(reopen);
      window.Report.showAfter(reportData, wrap);
    }
    wrap.appendChild(UI.el('p', 'muted', T('Hasta mañana. Mañana hay material nuevo.', 'See you tomorrow. There will be new material.')));
    var homeB = UI.nextBtn('← ' + T('Volver al inicio', 'Back to home'), function () { window.App.go('home'); });
    wrap.appendChild(homeB);
    var again = UI.nextBtn(T('Hacerla otra vez', 'Do it again'), function () { repeatToday(mode); });
    again.className = 'ghost-btn';
    wrap.appendChild(again);
    host.appendChild(wrap);
  }

  /* Straight into the first stage. There used to be an intro screen here
   * naming the unit, the goal and today's lesson; all of that now lives on
   * the home card, which is where the learner decides whether to start. */
  /* The sentence bank is a few megabytes per band and loaded on demand; a
   * session waits for it (and for the band below) before it is built. Offline
   * with nothing cached, it goes ahead without: the authored pools carry it. */
  function withBank(fn) {
    var BI = window.BankItems, b = bandNow();
    if (!BI || !b || BI.ready(b)) { fn(); return; }
    BI.load(b, function () { fn(); });
  }
  function begin(m, over, repeat) {
    if (m && MODES[m]) mode = m;
    host = document.getElementById('stage-host');
    bar = document.getElementById('session-progress-fill');
    withBank(function () { withReading(over, function () {
      var seed = Math.floor(Math.random() * 1e9);
      ctx = buildContext({ seed: seed, over: over, repeat: repeat });
      ctx.snap = makeSnap(ctx);
      ctx.startedAt = Date.now(); ctx.activeMs = 0; ctx.segStart = Date.now();
      markSeen(ctx);
      idx = 0; stepIdx = 0; answers = {}; resumeAt = null;
      persist();
      runStage();
    }); });
  }
  function start(m) { begin(m, null, false); }

  /* "Do it again": today's lesson and passage, not tomorrow's. Counted nowhere. */
  function repeatToday(m) {
    var last = readRec(LKEY);
    var same = last && last.startedDay === dayNumber() && last.snap;
    begin(m || (same && last.mode) || mode, same ? last.snap : null, true);
  }
  /* Start a specific day of the paced course (the "Next up" box). */
  function startAt(di, m) { begin(m || 'diaria', { di: di }, false); }

  function resume() {
    host = document.getElementById('stage-host'); bar = document.getElementById('session-progress-fill');
    if (ctx && idx >= 0 && idx < stages().length) { if (!ctx.segStart) ctx.segStart = Date.now(); runStage(); return; }
    var rec = pending();
    if (!rec) { dropRec(SKEY); idx = -1; ctx = null; start(); return; }
    mode = rec.mode;
    withBank(function () { withReading(rec.snap, function () {
      if (restore(rec)) { runStage(); return; }
      dropRec(SKEY); idx = -1; ctx = null;
      start();
    }); });
  }

  pending();   // on load: a record from a previous day is discarded here

  return {
    start: start,
    // test hooks: build a context without starting a session; record what it served
    _build: buildContext, _markSeen: markSeen, _isReadingDay: isReadingDay, _markRead: markRead, _setMode: function (m) { mode = m; },
    today: today,
    skipLesson: skipLesson,
    modes: function () { return [MODES.rapido, MODES.corto, MODES.diaria, MODES.larga]; },
    rhythm: rhythm,
    nextUp: nextUp,
    unitOf: unitOf,
    unitProgress: unitProgress,
    mode: function () { var r = !ctx && pending(); return r ? MODES[r.mode] : modeDef(); },
    resume: resume,
    repeatToday: repeatToday,
    startAt: startAt,
    pending: pending,
    breakRuns: breakRuns,
    hasSavedSession: function () { return !!pending(); },
    minutesIn: minutesIn,
    isActive: function () { return (!!ctx && idx >= 0 && idx < stages().length) || !!pending(); },
    currentStageIndex: function () { return idx; },
    stageCount: function () { return stages().length; }
  };
})();
