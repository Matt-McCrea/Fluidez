/* ============================================================================
 * GAME ITEMS — where the questions come from.
 *
 * The old generators built their pools eagerly and whole: mcqMeaningItems()
 * made an item for all 5,822 vocabulary words, each one filtering and
 * shuffling the full English list to find three distractors (656 ms of
 * blocking work on every "Empezar"), and mcqConjItems() materialised 89,782
 * objects that the round then copied and shuffled again. Meanwhile ¿Cuál va
 * aquí? drew por/para from a pool of TWO.
 *
 * So: nothing is built whole. draw(kind, rung) SAMPLES from a light index of
 * what exists, and the index is built once, on the first game, from data the
 * app already ships. What that unlocks:
 *
 *   translate  6,155 CEFR-tagged ES↔EN pairs (strand examples, exponents and
 *              contrasts), 145 authored translation tasks, 83 idioms. No game
 *              read any of it before.
 *   listen     the same pairs, spoken by js/speak.js — the app's first ear
 *              practice of any kind.
 *   grammar    ~3,000 questions: 1,606 strand MCQ probes, 794 cloze probes,
 *              674 APPLY cloze items given engine-generated distractors,
 *              2,305 gendered nouns, and the five hand-written concept pairs.
 *   verb       generated on demand from 1,166 verbs × the tenses this learner
 *              has been taught, never stored.
 *
 * Two things make an item worth answering rather than eliminating:
 *   DISTRACTORS come from the same CEFR band and, where possible, the same
 *   PCIC theme — "la mesa" is not tested by offering "to legislate". Verb
 *   distractors are other real forms of the SAME verb, so a wrong option is
 *   always Spanish somebody might actually say.
 *   DIFFICULTY is the content's own: a `rung` (1-10) maps to a CEFR band, and
 *   the generators pay a `bonus` for what the band does not capture — sentence
 *   length, irregularity, how hard the tense is.
 *
 * Every item that corresponds to something the SRS already schedules carries
 * that id (v:<es>:meaning, vt:<inf>:<tense>), so a game round is a real review.
 * ========================================================================== */
window.GameItems = (function () {
  var E = window.ENGINE, S = window.SRS;
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  /* Spanish has words that are also Object.prototype members — "el
   * constructor" is in data/vocab.js — so a bare `map[word]` lookup can come
   * back with a function instead of undefined. Every word-keyed map here goes
   * through these two. */
  var hasOwn = Object.prototype.hasOwnProperty;
  function own(map, k) { return hasOwn.call(map, k) ? map[k] : undefined; }

  function rnd(rng) { return (rng || Math.random)(); }
  function pick(arr, rng) { return arr && arr.length ? arr[Math.floor(rnd(rng) * arr.length)] : null; }
  function bandOf(rung) { return window.GameScore.bandForRung(rung); }
  function bandIdx(b) { var i = BANDS.indexOf(b); return i === -1 ? 0 : i; }

  /* Content gets thin at the edges of a band, so a draw walks outwards from
   * the band it wanted rather than returning nothing: B2 first, then B1, then
   * C1, then A2… A game must never stall because one bucket was empty. */
  function nearBands(band) {
    var i = bandIdx(band), out = [BANDS[i]];
    for (var d = 1; d < BANDS.length; d++) {
      if (BANDS[i - d]) out.push(BANDS[i - d]);
      if (BANDS[i + d]) out.push(BANDS[i + d]);
    }
    return out;
  }
  function fromBands(buckets, band, rng) {
    var order = nearBands(band);
    for (var i = 0; i < order.length; i++) {
      var b = buckets[order[i]];
      if (b && b.length) return { item: pick(b, rng), cefr: order[i] };
    }
    return null;
  }

  // The syllabus `level` (1-9) that content files are tagged with, mapped onto
  // the CEFR bands the score is denominated in (see LEVELS in data/taxonomy.js).
  var LEVEL_BAND = { 1: 'A1', 2: 'A2', 3: 'A2', 4: 'B1', 5: 'B1', 6: 'B2', 7: 'B2', 8: 'C1', 9: 'C1', 10: 'C1' };
  function bandForLevel(n) { return LEVEL_BAND[n || 1] || 'B1'; }

  // ---- the index -----------------------------------------------------------
  var IDX = null;

  function emptyBuckets() { return { A1: [], A2: [], B1: [], B2: [], C1: [] }; }

  /* Is this Spanish string usable as something to TYPE, or to say out loud?
   *
   * This was a blacklist of the marks lesson data uses as furniture, and a
   * blacklist is the wrong shape: the corpus is 800 hand-written lessons and
   * it kept containing something the list had not thought of. Two that got
   * through and reached real rounds:
   *
   *   "Vive en Madrid. ↓"   the intonation lessons mark rising and falling
   *                         voice with arrows, so the answer to "He lives in
   *                         Madrid" contained a character nobody can type.
   *   "*La María es profesora."   a contrast table's asterisk means "this is
   *                         WRONG Spanish". Thirty-six of those were being
   *                         served as the correct answer and read aloud by the
   *                         listening game.
   *
   * So: a whitelist. Spanish letters, digits, spaces and the punctuation a
   * sentence actually uses. Anything else means the string is carrying
   * teaching notation rather than a sentence, and it is not for us.
   */
  var TYPEABLE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,;:!?¿¡'’%-]+$/;

  function cleanPair(es, en) {
    if (!es || !en) return null;
    es = String(es).trim();
    en = String(en).trim();
    if (!TYPEABLE.test(es)) return null;
    if (/^\*/.test(es)) return null;                    // marked as wrong Spanish
    if (/[_＿<>\n]/.test(en)) return null;               // the English is read, not typed
    if (/[.!?].+[.!?]/.test(es.replace(/\.\.\./g, ''))) return null;   // more than one sentence
    var n = es.split(/\s+/).length;
    if (n < 1 || n > 14) return null;
    return { es: es, en: en, n: n };
  }

  function buildIndex() {
    var idx = {
      pairs: emptyBuckets(),          // { es, en, n, note }
      vocab: emptyBuckets(),          // VOCAB rows
      byTheme: {},                    // theme -> band -> rows, for real distractors
      grammar: emptyBuckets(),        // pre-shaped grammar questions
      gender: emptyBuckets(),
      words: {},                      // every single-word form VOCAB knows, for
                                      // checking that a distractor is a real word
      glossesOf: {}                   // spanish word -> the english meanings it has
    };

    // --- translation / listening pairs ---
    function addPair(band, es, en, note, bonus) {
      var p = cleanPair(es, en);
      if (!p) return;
      p.note = note || null;
      p.bonus = bonus || 0;
      idx.pairs[band].push(p);
    }
    (window.STRAND_LESSONS || []).forEach(function (l) {
      var band = BANDS.indexOf(l.cefr) === -1 ? 'B1' : l.cefr;
      (l.examples || []).forEach(function (x) { addPair(band, x.es, x.en); });
      (l.exponents || []).forEach(function (x) { addPair(band, x.es, x.en, x.note); });
      (l.contrasts || []).forEach(function (x) { addPair(band, x.es, x.en, x.note); });
    });
    (window.WRITING_TASKS || []).forEach(function (t) {
      if (t.type !== 'translate' || !t.models || !t.models[0]) return;
      var en = (t.prompt || '').replace(/^\s*Translate:\s*/i, '').replace(/^[“"']|[”"']$/g, '').trim();
      // authored against machine-checkable constraints — worth more than a gloss
      addPair(bandForLevel(t.level), t.models[0], en, t.hint, 25);
    });
    (window.IDIOMS || []).forEach(function (x) {
      // an idiom is never an A1 item however short it is — you cannot derive it
      addPair('B1', x.es, x.en, x.lit ? 'lit. ' + x.lit : null, 40);
    });

    // --- vocabulary, bucketed by band and by PCIC theme ---
    (window.VOCAB || []).forEach(function (wd) {
      if (!wd.es || !wd.en) return;
      var band = BANDS.indexOf(wd.cefr) === -1 ? 'A1' : wd.cefr;
      idx.vocab[band].push(wd);
      var th = wd.theme || wd.cat || 'otros';
      if (!idx.byTheme[th]) idx.byTheme[th] = emptyBuckets();
      idx.byTheme[th][band].push(wd);
      // gender: the article is carried on the word, so the question is free
      var m = /^(el|la|los|las)\s+(.+)$/i.exec(wd.es);
      if (m) idx.gender[band].push({ art: m[1].toLowerCase(), bare: m[2], en: wd.en, es: wd.es });
      wd.es.toLowerCase().split(/\s+/).forEach(function (tok) { if (tok.length > 1) idx.words[tok] = 1; });
    });

    // --- grammar questions, from four sources, all pre-shaped ---
    (window.STRAND_LESSONS || []).forEach(function (l) {
      var band = BANDS.indexOf(l.cefr) === -1 ? 'B1' : l.cefr;
      (l.probes || []).forEach(function (p) {
        if (p.kind === 'mcq' && p.options && p.options.length > 1 && p.answer != null) {
          idx.grammar[band].push({ src: 'probe-mcq', id: p.id, q: p.q,
            options: p.options.slice(), answer: p.options[p.answer], topic: 'lesson:' + l.id });
        } else if (p.kind === 'cloze' && p.text && p.accept && p.accept.length) {
          idx.grammar[band].push({ src: 'probe-cloze', id: p.id, q: p.text,
            accept: p.accept.slice(), answer: p.accept[0], topic: 'lesson:' + l.id });
        }
      });
    });
    (window.APPLY_ITEMS || []).forEach(function (it) {
      if (it.type !== 'cloze' || !it.inf || !it.tense) return;
      idx.grammar[bandForLevel(it.level)].push({ src: 'apply', q: it.text, inf: it.inf,
        tense: it.tense, person: it.person, en: it.en, topic: 'tense:' + it.tense });
    });
    (window.CONCEPT_LESSONS || []).forEach(function (l) {
      var opts = l.id === 'ser-estar' ? ['ser', 'estar']
               : l.id === 'por-para' ? ['por', 'para']
               : l.id === 'preterite-imperfect' ? ['preterito', 'imperfecto'] : null;
      if (!opts) return;
      (l.recall || []).forEach(function (r) {
        idx.grammar.A2.push({ src: 'concept', id: r.id, q: r.front, options: opts,
          answer: r.back, topic: 'lesson:' + l.id });
      });
    });

    /* ---- synonyms, derived rather than authored ---------------------------
     * enviar and mandar are both "to send", and a game that accepts only the
     * one its data file happened to store is marking correct Spanish wrong.
     * Checker.meaningAlternatives already splits a gloss into the answers it
     * licenses ("to send / to order" -> to send, send, to order, order), so
     * two entries sharing one of those are synonyms and nothing has to be
     * written down. It is deliberately narrow: empezar "to begin" and comenzar
     * "to start" do not share a gloss and are not paired here. Better to miss
     * a synonym than to invent one.
     *
     * A parenthetical is a discriminator, not part of the meaning — "the
     * friend (m)" and "the friend (f)" reduce to the same gloss and are the
     * one pair we must NOT treat as interchangeable — so entries are only
     * paired when their brackets agree. */
    var C = window.Checker;
    function bracket(en) { var m = /\(([^)]*)\)/.exec(en || ''); return m ? m[1].toLowerCase() : ''; }
    /* Indexed BY THE SPANISH WORD, not by the gloss: comparing two words then
     * intersects two short lists, where a gloss-keyed map would have to be
     * scanned. This runs on every keystroke of every typed answer. */
    function addGloss(es, en) {
      if (!es || !en || !C) return;
      var key = es.toLowerCase(), br = bracket(en);
      var list = own(idx.glossesOf, key);
      if (!list) list = idx.glossesOf[key] = [];
      C.meaningAlternatives(en).forEach(function (g) {
        var gk = String(g).toLowerCase().trim();
        if (!gk || gk.length < 3) return;
        gk = gk + '|' + br;                      // the bracket is part of the key
        if (list.indexOf(gk) === -1) list.push(gk);
      });
    }
    (window.VERBS || []).forEach(function (v) { addGloss(v.inf, v.en); });
    (window.VOCAB || []).forEach(function (wd) {
      addGloss(wd.es, wd.en);
      var bare = wd.es.replace(/^(el|la|los|las)\s+/i, '');
      if (bare !== wd.es) addGloss(bare, wd.en);
    });

    IDX = idx;
    return idx;
  }
  function index() { return IDX || buildIndex(); }
  function reset() { IDX = null; }

  // ---- what the round should lean towards ----------------------------------
  // Games are not a separate silo: given a few equally good candidates, take
  // the one that is overdue for review, or the one that matches what the
  // learner is studying today. Never ALL of them — a mixed game that stops
  // being mixed stops being a game.
  var focus = null;
  function setFocus(f) { focus = f || null; }
  function matchesFocus(item) {
    if (!focus || !item) return false;
    if (focus.type === 'grammar' && item.topic) return item.topic === 'tense:' + focus.id || item.topic === 'lesson:' + focus.id;
    if (focus.type === 'verbs' && item.inf) return (focus.verbs || []).indexOf(item.inf) !== -1;
    return false;
  }
  function best(cands) {
    var due = null, foc = null;
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i];
      if (!c) continue;
      if (!due && c.id && S && S.isDue(c.id)) due = c;
      if (!foc && matchesFocus(c)) foc = c;
    }
    return due || foc || cands.filter(Boolean)[0] || null;
  }

  // ---- grading -------------------------------------------------------------
  var PRONOUNS = /^(yo|tú|tu|él|ella|usted|nosotros|nosotras|vosotros|vosotras|ellos|ellas|ustedes)\s+/i;

  /* Spanish drops the subject pronoun freely, so "Como paella" and "Yo como
   * paella" are both right and only one of them is in the data file. Accept
   * either direction: strip a leading pronoun from the expected answer AND
   * from what was typed. Everything else — case, spacing, punctuation, and
   * the accents-only near miss — Checker.checkExact already knows. */
  function acceptFor(item) {
    var list = (item.accept || [item.answer]).slice();
    list.slice().forEach(function (a) {
      var bare = String(a).replace(PRONOUNS, '');
      if (bare !== a) list.push(bare);
    });
    return list;
  }
  // Are these two Spanish words two ways of saying the same thing? Lemmas
  // first, then conjugated forms: "mandó" and "envió" are synonyms because
  // mandar and enviar are, in the same tense and person.
  function sameLemma(a, b) {
    if (a === b) return false;
    var g = index().glossesOf, ga = own(g, a), gb = own(g, b);
    if (!ga || !gb) return false;
    for (var i = 0; i < ga.length; i++) if (gb.indexOf(ga[i]) !== -1) return true;
    return false;
  }
  var _synCache = {};
  function areSynonyms(a, b) {
    if (a === b) return false;
    var ck = a + '|' + b;
    var cached = own(_synCache, ck);
    if (cached != null) return cached;
    var out = sameLemma(a, b);
    if (!out) {
      var xa = E.analyzeToken(a), xb = E.analyzeToken(b);
      for (var i = 0; i < xa.length && !out; i++) {
        for (var j = 0; j < xb.length && !out; j++) {
          if (xa[i].tense === xb[j].tense && xa[i].person === xb[j].person &&
              sameLemma(xa[i].inf, xb[j].inf)) out = true;
        }
      }
    }
    _synCache[ck] = out;
    return out;
  }

  /* Punctuation, capitals and the dashes and ellipses lesson data uses to set
   * dialogue are not what any of these games are testing. Checker.checkExact
   * already forgives the common marks; this adds the ones it does not know
   * about, and gives the synonym comparison a clean token list to work on. */
  function words(s) {
    return String(s).toLowerCase()
      .replace(/[.,;:!?¿¡"“”'’—–…()]/g, ' ')
      .replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  }

  /* One or two words swapped for words that mean the same thing is a correct
   * translation, not a wrong one: "te mando un mensaje" for "te envío un
   * mensaje". Capped at two so a sentence cannot be rebuilt out of synonyms
   * into something nobody would say. */
  function synonymPass(input, list) {
    var a = words(input);
    if (!a.length) return false;
    for (var k = 0; k < list.length; k++) {
      var b = words(list[k]);
      if (b.length !== a.length) continue;
      var diffs = [];
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i] && E.deaccent(a[i]) !== E.deaccent(b[i])) diffs.push(i);
      }
      if (!diffs.length || diffs.length > 2) continue;
      var all = true;
      for (var d = 0; d < diffs.length && all; d++) {
        if (!areSynonyms(a[diffs[d]], b[diffs[d]])) all = false;
      }
      if (all) return true;
    }
    return false;
  }

  function grade(item, input) {
    var C = window.Checker;
    var list = acceptFor(item);
    var r = C.checkExact(input, list);
    if (r.pass) return 'good';
    var stripped = String(input).replace(PRONOUNS, '');
    if (stripped !== input && C.checkExact(stripped, list).pass) return 'good';
    // the marks Checker does not strip (dialogue dashes, ellipses, brackets)
    for (var i = 0; i < list.length; i++) {
      if (words(input).join(' ') === words(list[i]).join(' ')) return 'good';
    }
    if (synonymPass(input, list)) return 'good';
    /* Near-miss detection over the same tolerant tokens, so an accents-only
     * slip behind a mark Checker does not strip still reads as "casi" rather
     * than as a flat no. */
    if (!r.near) {
      var typed = E.deaccent(words(input).join(' '));
      for (var j = 0; j < list.length; j++) {
        if (typed && typed === E.deaccent(words(list[j]).join(' '))) return 'near';
      }
    }
    return r.near ? 'near' : 'wrong';
  }

  // ---- translation ---------------------------------------------------------
  // Short items are TYPED, which is real production. Long ones arrive as
  // scrambled chips to build, for two reasons: typing fourteen words against a
  // clock measures typing, and a long sentence has several right translations
  // where a fixed set of chips has exactly one right order.
  var BUILD_FROM = 6;

  function translateItem(rung, rng) {
    var idx = index(), band = bandOf(rung);
    var want = rung >= 6;                                   // long enough to build
    function shaped() {
      var got = fromBands(idx.pairs, band, rng);
      if (!got) return null;
      var p = got.item;
      var longish = p.n >= BUILD_FROM;
      if (want !== longish && rnd(rng) < 0.75) return null;  // mostly honour the shape
      return { p: p, cefr: got.cefr, build: longish };
    }
    var got = null;
    for (var i = 0; i < 6 && !got; i++) got = shaped();
    if (!got) { var g = fromBands(idx.pairs, band, rng); if (!g) return null; got = { p: g.item, cefr: g.cefr, build: g.item.n >= BUILD_FROM }; }

    var p = got.p;
    var bonus = (p.bonus || 0) + Math.max(0, p.n - 3) * 10;
    var base = { kind: 'translate', cefr: got.cefr, bonus: bonus, es: p.es,
                 prompt: p.en, answer: p.es, note: p.note, topic: null, id: null };
    if (!got.build) { base.play = 'type'; base.accept = [p.es]; return base; }

    /* Chips carry no punctuation at all. A chip reading "noticia," asks the
     * learner to reproduce comma placement, which is not what this item is
     * testing, and it gives away where the clause breaks. */
    base.play = 'build';
    base.words = p.es.replace(/[.,;:!?¿¡"“”]/g, '').replace(/\s+/g, ' ').trim().split(' ');
    base.answer = base.words.join(' ');
    base.reveal = p.es;
    return base;
  }

  // ---- listening -----------------------------------------------------------
  // Difficulty is length, band AND SPEED: 0.85 at the bottom, 1.15 at the top —
  // "slow and clear" through "natural" to "faster than you would like".
  function listenRate(rung) { return Math.round((0.82 + 0.035 * rung) * 100) / 100; }

  /* Distractors for "which of these did you hear" have to be near-identical
   * or the question is free — and they also have to be AUDIBLY different, or
   * the question is unanswerable. That rules out the diacritic pairs a reader
   * would reach for first: el/él, mi/mí, si/sí, de/dé and the rest are
   * monosyllables whose accent is purely orthographic, pronounced identically,
   * so "which did you hear" has no honest answer.
   *
   * What IS audible: a different form of the same verb (llegó / llegaba /
   * llegan), a number change (casa / casas), and the accent that moves the
   * stress on a polysyllable (hablo / habló). The first is preferred because
   * it is always a real Spanish word; the last is only accepted when the
   * engine recognises the result as one. */
  function verbSwap(bare, rng) {
    var list = E.analyzeToken(bare.toLowerCase()).filter(function (a) { return a.accentExact; });
    if (!list.length) return null;
    var a = list[0], v = E.verbByInf(a.inf);
    if (!v) return null;
    var alts = [];
    function add(f) { if (f && f.toLowerCase() !== bare.toLowerCase() && alts.indexOf(f) === -1) alts.push(f); }
    E.conjugate(v, a.tense).forEach(add);
    ['presente', 'preterito', 'imperfecto', 'futuro'].forEach(function (tk) {
      if (tk === a.tense) return;
      var pj = E.personsFor(tk).indexOf(a.person);
      if (pj >= 0) add(E.conjugate(v, tk)[pj]);
    });
    return pick(alts, rng);
  }

  function isWord(w) {
    var lw = w.toLowerCase();
    return !!own(index().words, lw) || E.analyzeToken(lw).length > 0;
  }
  function soundAlike(bare, rng) {
    var swapped = verbSwap(bare, rng);
    if (swapped) return swapped;
    // a number change is audible — but only when the result is a word Spanish
    // actually has, or the option can be eliminated on sight without listening
    var last = bare.charAt(bare.length - 1);
    var num = last === 's' && bare.length >= 4 ? bare.slice(0, -1)
            : /[aeiouáéíóú]/.test(last) && bare.length >= 4 ? bare + 's' : null;
    if (num && isWord(num)) return num;
    return null;
  }
  /* Two spellings that differ ONLY in their accents are not a listening
   * question. Some are outright homophones (el/él, mi/mí); the rest are a
   * stress contrast (hablo/habló) that a browser's synthesiser renders
   * unreliably at best — so the item comes back "wrong" with nothing the
   * learner could have done differently, which is the least useful thing a
   * game can say. Whatever generated the variant, this is the gate it has to
   * pass. */
  function audiblyDifferent(a, b) {
    return E.deaccent(String(a).toLowerCase()) !== E.deaccent(String(b).toLowerCase());
  }
  function perturb(es, rng) {
    var words = es.split(/\s+/), order = [];
    for (var i = 0; i < words.length; i++) order.push(i);
    order.sort(function () { return rnd(rng) - 0.5; });
    for (var k = 0; k < order.length; k++) {
      var at = order[k], w = words[at];
      var bare = w.replace(/[.,;:!?¿¡"“”]/g, '');
      if (bare.length < 3) continue;
      var alt = soundAlike(bare, rng);
      if (!alt || !audiblyDifferent(alt, bare)) continue;
      if (/^[A-ZÁÉÍÓÚÑ]/.test(bare)) alt = alt.charAt(0).toUpperCase() + alt.slice(1);
      var out = words.slice();
      out[at] = w.replace(bare, alt);
      return out.join(' ');
    }
    return null;
  }

  function listenItem(rung, rng) {
    var idx = index(), band = bandOf(rung);
    var got = fromBands(idx.pairs, band, rng);
    if (!got) return null;
    var p = got.item;
    var bonus = (p.bonus || 0) + Math.max(0, p.n - 3) * 10;
    // `es` is what was said and `gloss` what it means. A listening correction
    // has to show both — the answer alone ("wrong", then one English line) tells
    // the learner nothing about what they failed to hear.
    var item = { kind: 'listen', cefr: got.cefr, bonus: bonus, es: p.es, gloss: p.en,
                 prompt: null, rate: listenRate(rung), note: p.note, id: null, topic: null };

    if (rung <= 4) {
      // hear it, choose what it means
      var wrong = [];
      for (var i = 0; i < 24 && wrong.length < 3; i++) {
        var o = fromBands(idx.pairs, got.cefr, rng);
        if (o && o.item.en !== p.en && wrong.indexOf(o.item.en) === -1 &&
            Math.abs(o.item.n - p.n) <= 3) wrong.push(o.item.en);
      }
      if (wrong.length < 3) return null;
      item.play = 'choose';
      item.answer = p.en;
      item.options = E.shuffle([p.en].concat(wrong));
      item.reveal = p.es;
      return item;
    }
    if (rung <= 7) {
      // hear it, choose WHICH SPANISH it was — minimal pairs, the thing
      // written practice can never test
      var alts = [], guard = 0;
      while (alts.length < 3 && guard++ < 24) {
        var v = perturb(p.es, rng);
        if (v && audiblyDifferent(v, p.es) && alts.indexOf(v) === -1) alts.push(v);
      }
      if (alts.length < 3) return null;
      item.play = 'choose';
      item.answer = p.es;
      item.options = E.shuffle([p.es].concat(alts));
      item.bonus += 30;
      item.reveal = p.en;
      return item;
    }
    // hear it, write it
    if (p.n > 9) return null;
    item.play = 'type';
    item.answer = p.es;
    item.accept = [p.es];
    item.bonus += 50;
    item.reveal = p.en;
    return item;
  }

  // ---- verbs ---------------------------------------------------------------
  // data/verbs.js is ordered by frequency, so a slice of it IS a frequency
  // band: the commonest sixty at the bottom of the ladder, the long tail at
  // the top. Nothing is materialised — one verb, one tense, one person.
  var RUNG_VERBS = [60, 60, 150, 150, 350, 350, 700, 700, 4000, 4000];
  var RUNG_TENSES = [
    ['presente'], ['presente'],
    ['presente', 'preterito', 'imperfecto'], ['preterito', 'imperfecto'],
    ['preterito', 'imperfecto', 'futuro', 'condicional'], ['futuro', 'condicional', 'perfecto'],
    ['perfecto', 'plusc', 'presubj'], ['presubj', 'imperativo', 'plusc'],
    ['impsubj', 'presubj', 'futperf', 'condperf'], ['impsubj', 'perfsubj', 'condperf', 'futperf']
  ];
  var TENSE_BONUS = { presente: 0, preterito: 40, imperfecto: 35, futuro: 30, condicional: 35,
    perfecto: 45, plusc: 70, futperf: 90, condperf: 90, presubj: 90, impsubj: 110,
    perfsubj: 120, imperativo: 60, impneg: 70 };

  function conjPrompt(v, tk, i) {
    var p = E.enPhrase(v, tk, i);
    return p.text + (p.marker ? ' (' + p.marker + ')' : '');
  }

  function verbItem(rung, rng) {
    var all = (window.Profile ? window.Profile.conjugableVerbs() : (window.VERBS || []));
    /* At A1 conjugableVerbs() is "verbs the curriculum has actually taught",
     * which on day one is none at all — correct for a lesson, fatal for a game
     * that has to deal a question. Fall back to the frequency head of
     * data/verbs.js, which is what those first days teach anyway; verbOkAt()
     * still keeps unheralded stem changes away from an A1 learner. */
    if (all.length < 8) all = (window.VERBS || []).slice(0, 20);
    if (!all.length) return null;
    var pool = all.slice(0, Math.min(all.length, RUNG_VERBS[Math.min(9, rung - 1)]));
    var allowed = window.Profile ? window.Profile.tenses() : E.TENSES.map(function (t) { return t.key; });
    var wanted = RUNG_TENSES[Math.min(9, rung - 1)].filter(function (t) { return allowed.indexOf(t) !== -1; });
    /* A learner whose course has only taught the present gets exactly that,
     * and the ladder climbs through RARITY and IRREGULARITY instead — there
     * still has to be somewhere to go at rung 8. */
    if (!wanted.length) wanted = [allowed[0] || 'presente'];

    var cands = [];
    for (var i = 0; i < 8 && cands.length < 3; i++) {
      var v = pick(pool, rng), tk = pick(wanted, rng);
      if (!v || !tk) continue;
      if (window.Profile && !window.Profile.verbOkAt(v.inf, tk)) continue;
      var persons = E.personsFor(tk);
      var pi = Math.floor(rnd(rng) * persons.length);
      var form = E.conjugate(v, tk)[pi];
      if (!form) continue;
      // the ladder should get harder, so lean on irregulars near the top
      var irr = E.isIrregularIn(v, tk);
      if (rung >= 7 && !irr && rnd(rng) < 0.6) continue;
      if (rung <= 2 && irr && rnd(rng) < 0.5) continue;
      cands.push({
        kind: 'verb', play: 'type', id: 'vt:' + v.inf + ':' + tk, inf: v.inf,
        cefr: bandOf(rung), topic: 'tense:' + tk,
        bonus: (TENSE_BONUS[tk] || 0) + (irr ? (v.forms ? 60 : 30) : 0),
        prompt: conjPrompt(v, tk, pi), answer: form, accept: [form],
        note: v.inf + ' · ' + (E.TENSE_LABEL[tk] || tk)
      });
    }
    return best(cands);
  }

  // ---- grammar -------------------------------------------------------------
  /* An APPLY cloze becomes a four-way choice whose wrong options are OTHER
   * REAL FORMS of the same verb — other persons of this tense and the same
   * person in other tenses. Every option is Spanish somebody says; only one of
   * them is what this sentence means. */
  function applyOptions(it, rng) {
    var v = E.verbByInf(it.inf);
    if (!v) return null;
    var persons = E.personsFor(it.tense);
    var pi = persons.indexOf(it.person);
    if (pi < 0) return null;
    var right = E.conjugate(v, it.tense)[pi];
    if (!right) return null;
    var others = [], allowed = window.Profile ? window.Profile.tenses() : [];
    E.shuffle((allowed.length ? allowed : ['presente', 'preterito', 'imperfecto', 'futuro', 'presubj'])
      .filter(function (t) { return t !== it.tense; })).forEach(function (tk) {
      if (others.length >= 2) return;
      var pj = E.personsFor(tk).indexOf(it.person);
      var f = pj >= 0 ? E.conjugate(v, tk)[pj] : null;
      if (f && f !== right && others.indexOf(f) === -1) others.push(f);
    });
    E.shuffle(persons.map(function (_, i) { return i; })).forEach(function (i) {
      if (others.length >= 3) return;
      var f = E.conjugate(v, it.tense)[i];
      if (f && f !== right && others.indexOf(f) === -1) others.push(f);
    });
    if (others.length < 2) return null;
    return { right: right, options: E.shuffle([right].concat(others)) };
  }

  function grammarItem(rung, rng) {
    var idx = index(), band = bandOf(rung);
    var cands = [];
    for (var i = 0; i < 5 && cands.length < 3; i++) {
      // one question in five is noun gender, which is drillable for ever and
      // which every learner of Spanish gets wrong for years
      if (rnd(rng) < 0.2) {
        var g = fromBands(idx.gender, band, rng);
        if (g) {
          cands.push({ kind: 'grammar', play: 'choose', cefr: g.cefr, bonus: 0,
            id: 'v:' + g.item.es + ':gender', topic: 'lesson:gender-articles',
            prompt: g.item.bare + '  —  ' + g.item.en, answer: g.item.art,
            options: /os?$/.test(g.item.art) ? ['el', 'la', 'los', 'las'] : ['el', 'la'],
            note: g.item.es });
          continue;
        }
      }
      var got = fromBands(idx.grammar, band, rng);
      if (!got) continue;
      var q = got.item, base = { kind: 'grammar', cefr: got.cefr, bonus: 20, topic: q.topic || null, id: q.id || null };
      if (q.src === 'probe-mcq' || q.src === 'concept') {
        base.play = 'choose'; base.prompt = q.q; base.answer = q.answer;
        base.options = E.shuffle(q.options.slice());
        if (q.src === 'concept') base.bonus = 10;
        cands.push(base);
      } else if (q.src === 'probe-cloze') {
        base.play = 'type'; base.prompt = q.q.replace(/___+/g, '＿＿＿');
        base.answer = q.answer; base.accept = q.accept; base.bonus = 40;
        cands.push(base);
      } else if (q.src === 'apply') {
        var o = applyOptions(q, rng);
        if (!o) continue;
        base.play = 'choose'; base.inf = q.inf;
        base.prompt = q.q.replace(/___+/g, '＿＿＿');
        base.answer = o.right; base.options = o.options; base.note = q.en || null;
        base.bonus = 20 + (TENSE_BONUS[q.tense] || 0) / 2;
        base.id = 'vt:' + q.inf + ':' + q.tense;
        cands.push(base);
      }
    }
    return best(cands);
  }

  // ---- vocabulary ----------------------------------------------------------
  /* Distractors from the SAME THEME and the same band. Three words for parts
   * of a kitchen are a real question; "la sartén / hello / quarterly / to
   * legislate" is a reading-speed test. Where the word carries collocations,
   * the prompt shows it in one — knowing Spanish is using it, not glossing it. */
  function vocabItem(rung, rng) {
    var idx = index(), band = bandOf(rung);
    var got = fromBands(idx.vocab, band, rng);
    if (!got) return null;
    var wd = got.item;
    if (window.Profile && !window.Profile.wordAllowed(wd)) return null;
    var theme = wd.theme || wd.cat || 'otros';
    var siblings = (idx.byTheme[theme] && idx.byTheme[theme][got.cefr]) || [];
    var pool = siblings.length >= 6 ? siblings : idx.vocab[got.cefr];

    /* Only ask for a word to be TYPED when it is actually typeable. A gloss
     * that lists both genders ("el/la mártir") has no single right spelling,
     * and anything carrying notation is not a word. Those still make perfectly
     * good four-way questions, so they fall back to choosing rather than
     * being dropped. */
    var typed = (rung >= 5 || rnd(rng) < 0.35) && TYPEABLE.test(wd.es) && !/^\*/.test(wd.es);
    var item = { kind: 'vocab', cefr: got.cefr, bonus: 0, id: 'v:' + wd.es + ':meaning',
                 topic: null, note: (wd.collocations && wd.collocations[0]) || null };
    if (typed) {
      item.play = 'type'; item.prompt = wd.en; item.answer = wd.es;
      item.accept = [wd.es, wd.es.replace(/^(el|la|los|las)\s+/i, '')];
      item.es = wd.es;
      return item;
    }
    var wrong = [];
    for (var i = 0; i < 20 && wrong.length < 3; i++) {
      var o = pick(pool, rng);
      if (o && o.en !== wd.en && wrong.indexOf(o.en) === -1) wrong.push(o.en);
    }
    if (wrong.length < 3) return null;
    item.play = 'choose';
    item.prompt = wd.es; item.answer = wd.en; item.es = wd.es;
    item.options = E.shuffle([wd.en].concat(wrong));
    return item;
  }

  // ---- the mix -------------------------------------------------------------
  // Racha and the daily challenge draw from everything. The weights shift up
  // the ladder: recognition early, production and the ear later, because that
  // is also the order those skills become possible.
  function mixedItem(rung, rng, opts) {
    var canHear = window.Speak && window.Speak.available() && !(opts && opts.silent);
    var table = rung <= 3
      ? [['vocab', 3], ['grammar', 3], ['translate', 2], ['verb', 1], ['listen', canHear ? 2 : 0]]
      : [['translate', 3], ['grammar', 3], ['verb', 2], ['vocab', 1], ['listen', canHear ? 2 : 0]];
    var total = table.reduce(function (n, r) { return n + r[1]; }, 0);
    for (var attempt = 0; attempt < 6; attempt++) {
      var r = rnd(rng) * total, kind = table[0][0];
      for (var i = 0; i < table.length; i++) { r -= table[i][1]; if (r <= 0) { kind = table[i][0]; break; } }
      var it = draw(kind, rung, rng, opts);
      if (it) return it;
    }
    return draw('grammar', rung, rng, opts) || draw('vocab', rung, rng, opts);
  }

  /* A round built only from what this learner keeps getting wrong. The error
   * log records a `topic` per miss ("tense:presubj", "lesson:por-para"); this
   * draws items carrying that topic, and falls back to the mix when the topic
   * has nothing generable behind it. */
  function weakItem(topic, rung, rng) {
    for (var i = 0; i < 14; i++) {
      var it = /^tense:/.test(topic) ? (rnd(rng) < 0.5 ? verbItem(rung, rng) : grammarItem(rung, rng))
                                     : grammarItem(rung, rng);
      if (it && it.topic === topic) return it;
    }
    return mixedItem(rung, rng);
  }

  function draw(kind, rung, rng, opts) {
    rung = Math.max(1, Math.min(window.GameScore.MAX_RUNG, rung || 1));
    switch (kind) {
      case 'translate': return translateItem(rung, rng);
      case 'listen':    return listenItem(rung, rng);
      case 'verb':      return verbItem(rung, rng);
      case 'grammar':   return grammarItem(rung, rng);
      case 'vocab':     return vocabItem(rung, rng);
      case 'mixed':     return mixedItem(rung, rng, opts);
      default:          return mixedItem(rung, rng, opts);
    }
  }

  /* Retry around the generators, which legitimately return null when a draw
   * lands somewhere thin (no near-identical variants for this sentence, no
   * theme-mates for this word). The round asks for an item and gets one. */
  function next(kind, rung, rng, opts) {
    for (var i = 0; i < 12; i++) {
      var it = draw(kind, rung, rng, opts);
      if (it) return it;
      rung = Math.max(1, rung - 1);
    }
    return null;
  }

  return {
    draw: draw, next: next, grade: grade, reset: reset, index: index, words: words,
    setFocus: setFocus, weakItem: weakItem, conjPrompt: conjPrompt,
    listenRate: listenRate, bandForLevel: bandForLevel
  };
})();
