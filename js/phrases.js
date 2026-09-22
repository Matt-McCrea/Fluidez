/* ============================================================================
 * PHRASES — the keyword tables, as a live item source.
 *
 * Every lesson page opens with a table of the Spanish it is built out of, with
 * its English, and a function or notion lesson follows it with `exponents` —
 * whole utterances, register-tagged. Together: ~7,200 hand-curated rows,
 * level-tagged by the lesson that carries them. Until now exactly one thing
 * read them — the renderer in js/views/learn.js. They were the best-structured
 * content in the app and they were decoration.
 *
 * This is the one place that turns them into items. Three consumers:
 *   js/views/learn.js   ENROLS the lesson's own phrases on the day it runs, so
 *                     they enter spaced review like vocabulary and verbs do
 *   js/gameitems.js   adds them to the translation/listening pool, so Traducción,
 *                     Escucha and Racha draw on the phrases the course actually
 *                     taught rather than only on example sentences
 *   js/views/review.js  carries them as `enrolledOnly` cards
 *
 * The audit (CURRICULUM_AUDIT.md §1.1) measured what the old arrangement cost:
 * 7.2% of A1 exponents and 6.3% of A2 exponents appeared anywhere in the
 * practice corpus, and none of them entered review at all unless a game put
 * them there. "¿Cómo te llamas?" is taught on day 1 and was never asked again.
 *
 * The id is `k:<spanish>` and is stable, which is what lets a miss in a game
 * schedule the same phrase for review — the contract the rest of the item
 * system already runs on (v:<es>:meaning, vt:<inf>:<tense>).
 *
 * WHAT IS THROWN AWAY, and why the tables can be written freely without
 * worrying about this module: a keyword row is written to be READ, so plenty
 * of rows are not things anybody types. Paradigm rows ("me / te / le"),
 * patterns ("¿Te gusta…?"), starred wrong forms ("*Yo gusto el cine") and
 * bare grammatical labels are all dropped here rather than being kept out of
 * the tables, where they earn their place.
 * ========================================================================== */
window.Phrases = (function () {
  var E = window.ENGINE;
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var cache = null;

  /* Spanish somebody could be asked to produce. No slashes (a paradigm row),
   * no ellipsis (a pattern with a hole in it), no asterisk (marked as wrong),
   * no brackets (a teaching note that wandered into the Spanish column). */
  var PRODUCIBLE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ¿¡?!.,;:'’·—-]+$/;

  /* A bare clitic or article on its own line is a PARADIGM ROW, not a phrase:
   * "me / te / le" split across rows, or the el/él minimal pair from the accent
   * lesson. The row earns its place in the table — it is the table — but
   * "type the Spanish for 'the'" has four right answers and marks three wrong. */
  var PARADIGM_ROW = /^(me|te|se|nos|os|le|les|lo|la|los|las|el|un|una|al|del)$/i;

  /* Same problem from the English side: a one-word row glossed with a bare
   * determiner or pronoun cannot be picked out from its gloss, because Spanish
   * decides it by gender and number that the English does not carry. */
  var UNDECIDABLE_GLOSS = /^(the|a|an|my|your|his|her|its|our|their|you|he|she|it|we|they|i|him|them|us)[.\s]*$/i;

  /* A row whose Spanish IS its English is a proper noun being echoed —
   * "¡María!" glossed "María!", taught as an attention-getter. It is a fine
   * thing to show and a card that asks nothing: the prompt contains the
   * answer. */
  function echoesGloss(es, en) {
    var strip = function (s) { return String(s).toLowerCase().replace(/[^a-zá-úñü]/g, ''); };
    return strip(es) === strip(en);
  }

  function usable(es, en) {
    if (!es) return false;
    es = String(es).trim();
    /* Test the SPLIT gloss, not the raw one. "tú" is glossed "you (one
     * person, informal)", and the parenthesis is what made UNDECIDABLE_GLOSS
     * miss it — so tú, usted and ustedes all reached the deck as three
     * separate cards whose prompt is the bare word "you", which no answer can
     * be wrong about and none can be right about either. */
    en = splitGloss(en).en;
    if (echoesGloss(es, en)) return false;
    if (!PRODUCIBLE.test(es)) return false;
    if (/[/…*_(){}\[\]]/.test(es)) return false;
    if (es.indexOf('·') !== -1) return false;            // "me · te · le"
    /* A dialogue dash means two speakers: "—Katrin es alemana. —No, es
     * austriaca." That is a first-rate thing to READ in a lesson and an
     * unreasonable thing to be asked to type back verbatim, so it stays in the
     * table and out of the deck. */
    if (/[—–]/.test(es)) return false;
    var n = es.split(/\s+/).length;
    /* Was 12. Twelve words is fine to read and punishing to retype — at that
     * length a learner who knows the phrase still loses on a dropped comma or
     * a swapped synonym, which teaches nothing. Eight covers the chunks that
     * are worth having automatic. */
    if (n < 1 || n > 8) return false;
    if (n === 1 && PARADIGM_ROW.test(es)) return false;
    if (n === 1 && UNDECIDABLE_GLOSS.test(String(en || ''))) return false;
    /* A lone conjugated form glossed with its subject — "hablo" / "I speak",
     * "habló" / "he/she spoke" — is the other shape a paradigm row takes: one
     * cell of a table, on its own line, where the slash-separated kind is
     * caught above. As a card it asks "I speak →" and accepts exactly one of
     * the hundreds of verbs that answer it.
     *
     * The app already reviews conjugation properly and per verb+tense, with
     * the sentence around it: `vt:<inf>:<tense>` cards, built from
     * data/apply.js (js/views/review.js). These would be a worse second copy
     * of that. Infinitives stay — "hablar / to speak" is a word, not a cell. */
    if (n === 1 && CONJUGATED_GLOSS.test(String(en || '')) && isConjugatedForm(es)) return false;
    return true;
  }

  var CONJUGATED_GLOSS = /^(i|you|he|she|it|we|they|he\/she)\b/i;
  /* Ask the ENGINE, not the stored forms. `verbs[i].forms` only holds the
   * irregulars — a regular verb's paradigm is computed, so scanning that
   * table recognised "estaba" and missed "hablo", which is the whole family
   * this rule exists to catch. analyzeSentence is the same recogniser the
   * content gate uses, and it returns nothing for an infinitive, so
   * "hablar / to speak" stays a word. */
  function isConjugatedForm(es) {
    if (!E || !E.analyzeSentence) return false;
    var a = E.analyzeSentence(es.toLowerCase());
    return ((a.verbs || []).length + (a.compounds || []).length) > 0;
  }

  /* "to like (literally: to please)" is a gloss plus a note. The note is worth
   * keeping — it is often the whole reason the row was written that way — but
   * it is not part of the answer, so it must not sit in the prompt. */
  function splitGloss(en) {
    var m = /^([^(]+?)\s*\(([^)]+)\)\s*$/.exec(String(en || '').trim());
    if (!m) return { en: String(en || '').trim(), note: null };
    return { en: m[1].trim(), note: m[2].trim() };
  }

  function build() {
    var out = [], seen = {};
    var lessons = window.ALL_LESSONS || window.GRAMMAR_LESSONS || [];
    lessons.forEach(function (l) {
      var band = BANDS.indexOf(l.cefr) === -1 ? 'B1' : l.cefr;
      /* Both blocks, because both are the same thing from the learner's side:
       * Spanish with its English, ready to say. `exponents` were the larger
       * and better half — 2,342 on the walked path, register-tagged, written
       * as whole utterances — and nothing outside the lesson page read them. */
      [].concat(l.keywords || [], l.exponents || []).forEach(function (k) {
        if (!k || !k.es || !k.en) return;
        var es = String(k.es).trim();
        if (!usable(es, k.en)) return;
        var key = es.toLowerCase();
        if (seen[key]) return;                 // the same phrase taught twice
        var g = splitGloss(k.en);
        if (!g.en) return;
        seen[key] = 1;
        out.push({
          id: 'k:' + es,
          es: es, en: g.en, note: g.note || k.note || null,
          band: band, level: l.level || 1, lesson: l.id
        });
      });
    });
    return out;
  }

  function all() {
    if (!cache) cache = build();
    return cache;
  }

  /* EVERY Spanish the course itself glosses the same way, so that asking
   * "then →" and being typed `luego` when the card happens to hold `entonces`
   * is a pass rather than a mark against the learner.
   *
   * 171 English glosses in the corpus are shared by two or more Spanish
   * phrases. Most are harmless punctuation variants ("gracias" / "Gracias."),
   * but the rest are real synonym sets the course teaches on purpose —
   * de repente / de pronto, por supuesto / claro que sí, ser / estar — and
   * marking one of them wrong for not being the other one is the deck being
   * wrong, not the learner. Built once, off the same list the cards come from,
   * so it cannot drift from what was taught. */
  var altCache = null;
  function alternatives(en) {
    if (!altCache) {
      altCache = {};
      all().forEach(function (p) {
        var k = E.normalize(p.en).replace(/[.,!?¿¡]/g, '').trim();
        if (!k) return;
        (altCache[k] = altCache[k] || []).push(p.es);
      });
    }
    var key = E.normalize(en).replace(/[.,!?¿¡]/g, '').trim();
    return altCache[key] || [];
  }

  /* Phrases whose accent is the WHOLE point, so the deck must not forgive it.
   *
   * The phrase deck is graded leniently (js/checker.js, accents:'lenient'):
   * "buenos dias" passes for "buenos días", because an English keyboard has no
   * á and the chunk is what is being asked. That is right until the accent is
   * the only thing separating two different words the course teaches on
   * purpose — sí/si, qué/que, cómo/como, hablo/habló — where forgiving it
   * teaches the opposite of gr-acentuacion-a1.
   *
   * DERIVED, not listed: a phrase is accent-critical when some OTHER phrase in
   * the corpus differs from it by accents alone. depunct-equal means the same
   * phrase written twice ("hola" / "Hola.") and is not a clash; fold-equal but
   * depunct-different is exactly an accent-only pair. A hand-kept list would
   * go stale the first time somebody added a minimal pair to a lesson. */
  var critCache = null;
  function accentCritical(es) {
    if (!critCache) {
      critCache = {};
      var byFold = {};
      all().forEach(function (p) {
        var f = fold(p.es), d = depunct(p.es);
        (byFold[f] = byFold[f] || {})[d] = 1;
      });
      all().forEach(function (p) {
        if (Object.keys(byFold[fold(p.es)]).length > 1) critCache[depunct(p.es)] = 1;
      });
    }
    return !!critCache[depunct(es)];
  }
  function depunct(s) {
    return E.normalize(s).replace(/[.,;:!?¡¿"“”'’]/g, '').replace(/\s+/g, ' ').trim();
  }
  function fold(s) {
    return E.deaccent(depunct(s)).replace(/ñ/g, 'n').replace(/ü/g, 'u');
  }

  /* The phrases one lesson taught. js/views/learn.js enrols these on the day
   * the lesson runs, which is the whole point of the module: before that, a
   * phrase reached review only if a game round happened to put it in play, so
   * a learner who walked the course and never opened the games met every
   * exponent exactly once and never again. */
  function forLesson(id) {
    /* Built from the lesson's OWN rows, not by filtering all(). all() keeps
     * one copy of each phrase and assigns it to whichever lesson reaches it
     * first in ALL_LESSONS order — which is not course order, so filtering it
     * handed a phrase taught on day 34 to a lesson on day 400 and enrolled it
     * on neither. 163 course lessons released under half their rows that way,
     * 1,173 rows in total.
     *
     * Duplicates cost nothing here: the id is `k:<spanish>` and SRS.enrol is
     * idempotent, so two lessons teaching the same phrase enrol the same card,
     * and the learner meets it on the first of those days. all() stays deduped
     * because the review POOL must offer each card once. */
    var l = (window.ALL_LESSONS || []).filter(function (x) { return x.id === id; })[0];
    if (!l) return [];
    var band = BANDS.indexOf(l.cefr) === -1 ? 'B1' : l.cefr;
    var out = [], seen = {};
    /* EXPONENTS FIRST, because the caller takes the first N (js/views/learn.js)
     * and they are the better half: whole utterances you could say as they
     * stand, where a keyword row is often a single word that data/vocab.js
     * already carries and the vocab pipeline already enrols. */
    [].concat(l.exponents || [], l.keywords || []).forEach(function (k) {
      if (!k || !k.es || !k.en) return;
      var es = String(k.es).trim();
      if (!usable(es, k.en)) return;
      if (seen[es.toLowerCase()]) return;
      seen[es.toLowerCase()] = 1;
      var g = splitGloss(k.en);
      if (!g.en) return;
      out.push({ id: 'k:' + es, es: es, en: g.en, note: g.note || k.note || null,
                 band: band, level: l.level || 1, lesson: l.id });
    });
    return out;
  }

  /* Only phrases from lessons this learner has actually been taught. A game
   * built on these is the strongest version of the idea — it cannot ask for
   * anything you were never shown. */
  function studied() {
    var done = {};
    try { done = (JSON.parse(localStorage.getItem('fluidez.progress')) || {}).studied || {}; } catch (e) { done = {}; }
    return all().filter(function (p) { return done[p.lesson]; });
  }

  function countByBand() {
    var o = {};
    all().forEach(function (p) { o[p.band] = (o[p.band] || 0) + 1; });
    return o;
  }

  return { all: all, studied: studied, countByBand: countByBand,
           alternatives: alternatives, forLesson: forLesson,
           accentCritical: accentCritical };
})();
