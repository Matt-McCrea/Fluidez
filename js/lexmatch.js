/* ============================================================================
 * LEXMATCH — which taught words does this text actually contain?
 *
 * One matcher, two consumers, because the alternative is two matchers that
 * disagree. js/views/review.js uses it to pick the day's new words out of the
 * passage the learner is about to read; tools/variety.js uses it to check that
 * a newly written passage carries enough of its own theme's vocabulary to be
 * worth reading. If those two ever answer differently, the app teaches words
 * the checker believes are absent, and nobody finds out.
 *
 * WHY NOT ENGINE.matchesVocabWords. It exists and does nearly this — strips
 * the article, deaccents, substring-searches — but it has no word boundary, so
 * `mar` is found inside `marzo` and `María`. For counting a rough alignment
 * that is tolerable. For choosing which eight words a learner is taught today
 * it is not: a false positive means teaching a word on the promise that it
 * appears in today's reading, where it does not appear at all.
 *
 * So the boundary is checked, and the only continuations allowed are a plural
 * -s or -es. `el libro` matches `los libros`; it does not match `librito`.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO: conjugated verbs. `viajar` will not be
 * found in `viajé`. Lemmatising properly means running ENGINE.analyzeToken
 * over every token of every passage, which is the validator's job and too slow
 * for a per-session hot path. Vocabulary entries are overwhelmingly nouns and
 * phrases, so the loss is small and it fails in the safe direction — a missed
 * verb drops out of the preference and is simply chosen on the old grounds.
 * ========================================================================== */
window.LexMatch = (function () {
  var ACC = { 'á': 'a', 'à': 'a', 'ä': 'a', 'é': 'e', 'è': 'e', 'ë': 'e',
              'í': 'i', 'ì': 'i', 'ï': 'i', 'ó': 'o', 'ò': 'o', 'ö': 'o',
              'ú': 'u', 'ù': 'u', 'ü': 'u' };
  var ARTICLE = /^(el|la|los|las|un|una|unos|unas)\s+/;

  function deaccent(s) {
    return String(s).replace(/[áàäéèëíìïóòöúùü]/g, function (c) { return ACC[c] || c; });
  }

  // ñ is kept: it is a letter, not an accent, and `año` is not `ano`.
  function clean(s) {
    return deaccent(String(s || '').toLowerCase())
      .replace(/[^a-z0-9ñ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function norm(text) { return ' ' + clean(text) + ' '; }

  /* The form to look for: the entry without its article. Gender notes and
   * parentheses have already been stripped by clean(). */
  function base(es) { return clean(String(es || '').toLowerCase().replace(ARTICLE, '')); }

  /* An index over one text. Built once per passage and queried per candidate
   * word, which is the shape the caller needs — review.js asks this several
   * thousand times against a single passage. */
  function index(text) {
    var t = norm(text);
    function has(es) {
      var b = base(es);
      if (b.length < 3) return false;              // "es", "un" match everywhere
      var needle = ' ' + b, i = t.indexOf(needle);
      while (i !== -1) {
        var rest = t.slice(i + needle.length);
        if (rest.charAt(0) === ' ') return true;                 // exact
        if (rest.slice(0, 2) === 's ') return true;              // libro / libros
        if (rest.slice(0, 3) === 'es ') return true;             // ciudad / ciudades
        i = t.indexOf(needle, i + 1);
      }
      return false;
    }
    return { has: has, text: t };
  }

  /* How many of `words` (objects with .es, or plain strings) the text holds.
   * The count tools/variety.js reports per passage. */
  function countIn(text, words) {
    var ix = index(text), n = 0;
    (words || []).forEach(function (w) { if (ix.has(w && w.es ? w.es : w)) n++; });
    return n;
  }

  return { index: index, countIn: countIn, base: base, norm: norm, deaccent: deaccent };
})();
