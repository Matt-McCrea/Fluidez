/* ============================================================================
 * CURRICULUM — the beginner's paced path.
 *
 * A new grammar tense every day is far too much for a beginner. Modelled on the
 * Español roadmap, this interleaves gentler day-types so new grammar is spaced
 * out, with vocab days, verb days and practice days in between:
 *
 *   vocab    — meet a themed set of new words
 *   verbs    — meet a few new verbs (meaning)
 *   grammar  — a new tense/concept (only ~every 5th day)
 *   practice — no new content; consolidate what you've met
 *
 * Only the beginner profile uses this; standard/refresher get a grammar lesson
 * each session as before. The sequence is generated from the dataset, so new
 * content is picked up automatically.
 * ========================================================================== */
window.Curriculum = (function () {
  var E = window.ENGINE;

  var VOCAB_ORDER = ['greetings', 'people', 'food', 'numbers', 'time', 'colors',
    'places', 'home', 'body', 'nature', 'adjectives', 'travel', 'weather',
    'clothing', 'animals', 'questions', 'connectors', 'common', 'school',
    'health', 'shopping', 'sports', 'kitchen', 'work'];
  var VERB_PRIORITY = ['hablar', 'trabajar', 'estudiar', 'necesitar', 'comprar',
    'comer', 'beber', 'vivir', 'aprender', 'escribir', 'ser', 'estar', 'tener',
    'ir', 'hacer', 'poder', 'querer', 'decir', 'ver', 'dar'];

  function chunk(a, n) { var o = []; for (var i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; }

  function build() {
    // one vocab day per (chunked) category, in beginner order
    var byCat = {};
    (window.VOCAB || []).forEach(function (w) { (byCat[w.cat] = byCat[w.cat] || []).push(w.es); });
    var vocabDays = [];
    VOCAB_ORDER.forEach(function (c) {
      if (!byCat[c]) return;
      var parts = chunk(byCat[c], 12);
      parts.forEach(function (words, i) { vocabDays.push({ type: 'vocab', cat: c, words: words, part: parts.length > 1 ? i + 1 : 0 }); });
    });

    // verb days: regular verbs, priority first, in fives
    var seen = {}, order = [];
    VERB_PRIORITY.forEach(function (inf) { var v = E.verbByInf(inf); if (v && !E.isIrregular(v) && !seen[inf]) { seen[inf] = 1; order.push(inf); } });
    (window.VERBS || []).forEach(function (v) { if (!E.isIrregular(v) && !seen[v.inf]) { seen[v.inf] = 1; order.push(v.inf); } });
    var verbDays = chunk(order, 5).map(function (ch) { return { type: 'verbs', verbs: ch }; });

    // grammar days: syllabus order
    var grammarDays = (window.GRAMMAR_LESSONS || []).map(function (l) { return { type: 'grammar', id: l.id }; });

    var seq = [], practice = function () { return { type: 'practice' }; };
    function take(q) { return q.length ? q.shift() : null; }
    function push(x) { if (x) seq.push(x); }

    // opener: two vocab days, first verbs, the present tense, a practice day
    push(take(vocabDays)); push(take(vocabDays));
    push(take(verbDays));
    push(take(grammarDays));          // presente
    seq.push(practice());

    // then: before each remaining grammar day, a run of vocab/verb/vocab + practice
    while (grammarDays.length) {
      push(take(vocabDays));
      push(take(verbDays));
      push(take(vocabDays));
      seq.push(practice());
      push(take(grammarDays));
    }
    // drain any leftover vocab/verbs, practice interspersed
    while (vocabDays.length || verbDays.length) {
      push(take(vocabDays));
      push(take(verbDays));
      seq.push(practice());
    }
    return seq;
  }

  var SEQ = null;
  return { seq: function () { return SEQ || (SEQ = build()); } };
})();
