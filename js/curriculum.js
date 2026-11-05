/* ============================================================================
 * CURRICULUM — a band's stretch of the course.
 *
 * This used to BUILD the paced path: it held the verb tiers, filtered lessons
 * by CEFR gate, and interleaved lesson days with verb days and a practice day
 * every sixth. All of that is now written down in data/course.js, so there is
 * nothing left to compute — a band is a slice of one ordered course, and this
 * reads it out.
 *
 * The verb tiers themselves are not lost: they were frequency order blended
 * with the domestic verbs a beginner needs on day one, and the days they
 * produced are frozen into COURSE as `{ verbs: [...] }` entries.
 *
 * `seq` returns one band's own stretch, which is what the band pools used to
 * serve. Letting a learner run off the end into the next band is a separate
 * decision from writing the order down, so it is not taken here.
 * ========================================================================== */
window.Curriculum = (function () {

  // COURSE speaks {lesson|verbs|practice}; the session stages speak
  // {type:'grammar'|'verbs'|'practice'}. Translate at the boundary.
  function asFocus(e) {
    // `unit` rides along on every focus so a stage can name the unit the day
    // belongs to; it is null for days not yet organised into one.
    // `passage` likewise: the opening two units name their own reading
    // (data/course.js), and dropping it here is what would make that authored
    // choice silently do nothing.
    // `kind` is the day's place in the week (introduce, drill, input, output,
    // review) and drill/output/review/check its practice-day flags; the
    // pre-resequence course has none of them and they read null/false.
    var f;
    if (e.verbs) f = { type: 'verbs', verbs: e.verbs, unit: e.unit || null, passage: e.passage || null, write: e.write || null };
    else if (e.practice) f = { type: 'practice', unit: e.unit || null, passage: e.passage || null, write: e.write || null };
    else f = { type: 'grammar', id: e.lesson, unit: e.unit || null, passage: e.passage || null, write: e.write || null };
    f.kind = e.kind || (e.drill ? 'drill' : e.output ? 'output' : e.review ? 'review' : null);
    if (e.drill) f.drill = true;
    if (e.output) f.output = true;
    if (e.review) f.review = true;
    if (e.check) f.check = true;
    return f;
  }

  var CACHE = {}, ALL = null;
  function build(cefr) {
    // COURSE is authored as units that own their days; COURSE_DAYS is that
    // flattened, which is the shape a band slice and the session both want.
    var course = window.COURSE_DAYS || [];
    var starts = window.COURSE_BANDS || {};
    var codes = Object.keys(starts).sort(function (a, b) { return starts[a] - starts[b]; });
    var i = codes.indexOf(cefr);
    if (i === -1) return course.map(asFocus);
    var from = starts[cefr];
    var to = i + 1 < codes.length ? starts[codes[i + 1]] : course.length;
    return course.slice(from, to).map(asFocus);
  }

  return {
    seq: function (cefr) {
      var k = cefr || (window.Profile && window.Profile.current()) || 'A1';
      return CACHE[k] || (CACHE[k] = build(k));
    },
    // The lessons of one band, in order — the pool the session walks when it
    // is not on the paced path.
    lessonsFor: function (cefr) {
      return this.seq(cefr).filter(function (f) { return f.type === 'grammar'; })
        .map(function (f) { return f.id; });
    },
    // The whole course as focuses, for fingerprinting it as one.
    all: function () {
      var d = window.COURSE_DAYS || [];
      if (!ALL || ALL.src !== d) ALL = { src: d, seq: d.map(asFocus) };
      return ALL.seq;
    },
    startOf: function (cefr) { return (window.COURSE_BANDS || {})[cefr] || 0; }
  };
})();
