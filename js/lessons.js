/* ============================================================================
 * LESSONS — assembles the full ordered syllabus (window.GRAMMAR_LESSONS).
 *
 * Tense lessons are GENERATED from data/grammar-docs.js (shared with the
 * Español app): the doc supplies summary/formation/usage/irregulars/examples,
 * and the ENGINE supplies the endings table and the recall items — so tables
 * and answers can never drift from the conjugation engine. Concept lessons
 * (ser/estar, por/para, …) come hand-written from data/grammar.js.
 *
 * SYLLABUS is the teaching order; each id is either a tense key (grammar-docs)
 * or a concept lesson id. Levels gate the rest of the day's content: you only
 * meet passages/cloze/writing at or below the level you've reached.
 * ========================================================================== */
(function () {
  var E = window.ENGINE;

  /* The legacy tense ladder. This is a SEED, not the syllabus: it exists to
   * give the 18 hand-written tense/concept lessons a level and a deliberate
   * order, since they carry neither themselves. Everything authored since
   * (data/strand-lessons.js) carries its own cefr/level/strand, so the real
   * teaching order is DERIVED from the lessons below — see buildSyllabus().
   * Three competing notions of "the order" (this list, spec/syllabus-draft.json
   * and the strand lessons' own tags) was one source of confusion too many. */
  var SEED = [
    // Level 1 — the foundations
    { id: 'presente', level: 1 },
    { id: 'ser-estar', level: 1 },
    { id: 'gender-articles', level: 1 },
    // Level 2 — talking about the past
    { id: 'preterito', level: 2 },
    { id: 'imperfecto', level: 2 },
    { id: 'preterite-imperfect', level: 2 },
    { id: 'por-para', level: 2 },
    // Level 3 — future, conditional, perfect
    { id: 'futuro', level: 3 },
    { id: 'condicional', level: 3 },
    { id: 'perfecto', level: 3 },
    // Level 4 — subjunctive & commands
    { id: 'presubj', level: 4 },
    { id: 'impsubj', level: 4 },
    { id: 'imperativo', level: 4 },
    { id: 'plusc', level: 4 },
    // Level 5 — the rest of the compound system
    { id: 'futperf', level: 5 },
    { id: 'condperf', level: 5 },
    { id: 'perfsubj', level: 5 }
  ];

  // Which simple tense of haber forms each compound tense.
  var HABER_BASE = { perfecto: 'presente', plusc: 'imperfecto', futperf: 'futuro',
                     condperf: 'condicional', perfsubj: 'presubj' };

  // ---- endings / model table HTML (engine-derived) -------------------------
  function endingsTable(tk) {
    var t = E.END[tk];
    if (!t) return modelTable(tk);
    var cols = t.all ? [['all verbs', t.all]] : [['-ar', t.ar], ['-er', t.er], ['-ir', t.ir]];
    var html = '<table class="contrast-table"><thead><tr><th></th>' +
      cols.map(function (c) { return '<th>' + c[0] + '</th>'; }).join('') + '</tr></thead><tbody>';
    E.PERSONS.forEach(function (p, i) {
      html += '<tr><td class="es">' + p + '</td>' +
        cols.map(function (c) { return '<td>-' + c[1][i] + '</td>'; }).join('') + '</tr>';
    });
    return html + '</tbody></table>';
  }
  function modelTable(tk) {
    var persons = E.personsFor(tk);
    var models = ['hablar', 'comer', 'vivir'].map(E.verbByInf);
    var cols = models.map(function (v) { return E.conjugate(v, tk); });
    var html = '<table class="contrast-table"><thead><tr><th></th>' +
      models.map(function (v) { return '<th>' + v.inf + '</th>'; }).join('') + '</tr></thead><tbody>';
    persons.forEach(function (p, i) {
      html += '<tr><td class="es">' + p + '</td>' +
        cols.map(function (c) { return '<td>' + c[i] + '</td>'; }).join('') + '</tr>';
    });
    return html + '</tbody></table>';
  }

  // ---- recall items per tense (typed answers, engine-computed) -------------
  function recallFor(tk, label) {
    var items = [];
    function add(suffix, front, back) { items.push({ id: 'g:' + tk + ':' + suffix, front: front, back: back }); }

    if (E.END[tk]) {                                    // simple tense with an endings table
      var t = E.END[tk];
      if (t.all) {
        add('yo', label + ': ending for yo (all verbs)', t.all[0]);
        add('nos', label + ': ending for nosotros (all verbs)', t.all[3]);
        add('ellos', label + ': ending for ellos (all verbs)', t.all[5]);
      } else {
        add('ar-yo', label + ': -ar ending for yo', t.ar[0]);
        add('er-el', label + ': -er ending for él/ella', t.er[2]);
        add('ar-nos', label + ': -ar ending for nosotros', t.ar[3]);
      }
    } else if (HABER_BASE[tk]) {                        // compound: recall the auxiliary
      var forms = E.conjugate(E.verbByInf('haber'), HABER_BASE[tk]);
      add('haber-yo', label + ': form of haber for yo', forms[0]);
      add('haber-nos', label + ': form of haber for nosotros', forms[3]);
      add('part', label + ': participle of hacer', 'hecho');
    } else if (tk === 'impsubj') {
      add('drop', 'Imperfect subjunctive: ellos-preterite minus ___, then -ra endings', 'ron');
      add('tener', 'Imperfect subjunctive of tener (yo)', 'tuviera');
      add('ser', 'Imperfect subjunctive of ser/ir (yo)', 'fuera');
    } else if (tk === 'imperativo') {
      add('haz', 'Affirmative tú command of hacer', 'haz');
      add('ven', 'Affirmative tú command of venir', 'ven');
      add('di', 'Affirmative tú command of decir', 'di');
    }
    return items;
  }

  // Verbs worth showing as full conjugation tables for a tense — the common
  // ones that are ACTUALLY irregular in that tense (engine-checked, so it never
  // shows a "regular" verb under the irregulars tabs).
  var IRR_CANDIDATES = ['ser', 'estar', 'ir', 'haber', 'tener', 'hacer', 'poder',
    'querer', 'decir', 'venir', 'poner', 'saber', 'salir', 'dar', 'ver',
    'conocer', 'pedir', 'dormir', 'volver', 'pensar', 'jugar'];
  function isIrregularInTense(inf, tk) {
    var v = E.verbByInf(inf); if (!v) return false;
    var twin = { inf: v.inf, en: v.en, type: v.type };
    return E.conjugate(v, tk).join('|') !== E.conjugate(twin, tk).join('|');
  }
  function irregularsFor(tk) {
    return IRR_CANDIDATES.filter(function (inf) { return isIrregularInTense(inf, tk); }).slice(0, 8);
  }

  // ---- doc → lesson ---------------------------------------------------------
  function tenseLesson(doc, level) {
    var tk = doc.key;
    var isSimple = !!E.END[tk];
    var sections = [
      { h: 'How it forms', html: doc.formation },
      { h: isSimple ? 'The endings' : 'Model conjugation', html: endingsTable(tk) },
      { h: 'When to use it', html: '<ul>' + doc.when.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' }
    ];
    var irr = irregularsFor(tk);
    return {
      id: tk, level: level, title: doc.title, summary: doc.summary,
      sections: sections,
      pitfalls: doc.irregulars || [],
      examples: doc.examples || [],
      conjTabs: irr.length ? { tense: tk, verbs: irr } : null,   // tabbed conjugations
      recall: recallFor(tk, doc.title.split(' (')[0])
    };
  }

  /* Strand lessons author their checks as `probes` — a richer shape carrying
   * mcq and cloze as well as plain recall, because the same items also drive
   * placement and the pre-lesson skip check. Everything downstream (the SRS
   * deck, the hub, games, the review stage) speaks the simple {id, front, back}
   * `recall` shape, so derive it here rather than teaching four call sites a
   * second vocabulary. */
  function withRecall(l) {
    if (l.recall || !l.probes) return l;
    var out = Object.create(null);
    Object.keys(l).forEach(function (k) { out[k] = l[k]; });
    /* A probe checks understanding at the end of a lesson. That is not the same
     * job as a spaced-repetition card, which asks you to REPRODUCE an answer
     * exactly, weeks later, and counts a miss against you.
     *
     * "What can stand in for a dropped noun that a possessive cannot?" ->
     * "the article (el/la + adjective)" is a fair comprehension check and a
     * terrible review item: it is a question about grammar in English, with a
     * prose answer nobody will retype. Those are marked srs:false — still asked
     * once, after the lesson, never enrolled into the deck. */
    function metalinguistic(front) {
      var f = String(front || '');
      return /^(what|which|why|how|when|name the|in which)\b/i.test(f.trim()) && !/[áéíóúñ¿]/.test(f);
    }
    out.recall = l.probes.map(function (p) {
      if (p.kind === 'mcq') return { id: p.id, front: p.q, back: p.options[p.answer] };
      if (p.kind === 'cloze') return { id: p.id, front: p.text, back: p.accept[0] };
      return { id: p.id, front: p.front, back: p.back, srs: !metalinguistic(p.front) };
    });
    return out;
  }

  function build() {
    var docs = {};
    (window.GRAMMAR || []).forEach(function (d) { docs[d.key] = d; });
    var concepts = {};
    (window.CONCEPT_LESSONS || []).forEach(function (c) { concepts[c.id] = c; });

    var lessons = [];
    SEED.forEach(function (s) {
      if (docs[s.id]) lessons.push(tenseLesson(docs[s.id], s.level));
      else if (concepts[s.id]) { concepts[s.id].level = s.level; lessons.push(concepts[s.id]); }
    });
    // any concept lessons not named in SYLLABUS are appended (nothing lost)
    (window.CONCEPT_LESSONS || []).forEach(function (c) {
      if (!SEED.some(function (s) { return s.id === c.id; })) lessons.push(c);
    });
    // Strand lessons (function / discourse / genre — data/strand-lessons.js)
    // carry their own level and PCIC provenance, so they need no SYLLABUS entry.
    (window.STRAND_LESSONS || []).forEach(function (l) { lessons.push(withRecall(l)); });
    return lessons;
  }

  /* The teaching order, derived from the lessons themselves: level first, then
   * strand (form before the functions that use it, discourse and genre after),
   * then the seed order for the legacy ladder, then title. A new lesson takes
   * its place automatically — nothing to maintain by hand. */
  var STRAND_RANK = { grammar: 0, notion: 1, function: 2, discourse: 3, genre: 4 };
  function buildSyllabus(lessons) {
    var seedIdx = {};
    SEED.forEach(function (s, i) { seedIdx[s.id] = i; });
    return lessons.slice().sort(function (a, b) {
      return (a.level || 1) - (b.level || 1) ||
             (STRAND_RANK[a.strand || 'grammar'] || 0) - (STRAND_RANK[b.strand || 'grammar'] || 0) ||
             (seedIdx[a.id] === undefined ? 999 : seedIdx[a.id]) -
             (seedIdx[b.id] === undefined ? 999 : seedIdx[b.id]) ||
             String(a.title).localeCompare(String(b.title));
    }).map(function (l) {
      return { id: l.id, level: l.level || 1, strand: l.strand || 'grammar', cefr: l.cefr || null };
    });
  }

  /* The session walks GRAMMAR_LESSONS to find the next unstudied lesson, so the
   * ARRAY has to be in teaching order — deriving a separate SYLLABUS list and
   * leaving the array in build order would teach a B2 function lesson as
   * lesson 18, ahead of every A1 one. Order the array itself. */
  var built = build();
  var syllabus = buildSyllabus(built);
  var byId = {};
  built.forEach(function (l) { byId[l.id] = l; });
  window.GRAMMAR_LESSONS = syllabus.map(function (s) { return byId[s.id]; })
    .filter(function (l) { return !!l; });
  window.SYLLABUS = syllabus;
  window.SEED_SYLLABUS = SEED;
})();
