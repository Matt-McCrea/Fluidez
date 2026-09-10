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
     * once, after the lesson, never enrolled into the deck.
     *
     * `probe` carries the ORIGINAL question through. Flattening an mcq to
     * {front, back} threw its options away, and the quick check renders a bare
     * text input, so all 1,467 of them became "type this exact string from
     * nothing": the deictic/anaphoric probe below asks you to produce "dos días
     * después" with no way to know that was the target. Keep the shape; let the
     * view ask it the way it was written. */
    function metalinguistic(front) {
      var f = String(front || '').trim();
      // The English form, and the same question asked in Spanish — which the
      // old check let through, because it required the front to carry no
      // accents: 412 cards of "¿Qué diferencia hay entre X e Y?" with a
      // paragraph for an answer went into the deck as typed recall.
      return /^(what|which|why|how|when|name the|in which)\b/i.test(f) ||
             /^¿(qué|cuál|cuáles|por qué|cómo|cuándo|quién|puede|cuántos?)\b/i.test(f);
    }
    /* Whatever it asks, an answer you could not type back weeks later is not a
     * card. Review always types a lesson card (js/views/review.js resolves
     * `fixed` to mode 'type'), so a five-word answer is an automatic miss —
     * 1,015 of them, running up to 27 words. */
    function reproducible(back) {
      return String(back || '').trim().split(/\s+/).length <= 3;
    }
    out.recall = l.probes.map(function (p) {
      var card = p.kind === 'mcq'
            ? { id: p.id, front: p.q, back: p.options[p.answer],
                probe: { kind: 'mcq', options: p.options, answer: p.answer } }
        : p.kind === 'cloze'
            ? { id: p.id, front: p.text, back: p.accept[0],
                probe: { kind: 'cloze', accept: p.accept } }
            : { id: p.id, front: p.front, back: p.back, probe: { kind: 'recall' } };
      card.srs = !metalinguistic(card.front) && reproducible(card.back);
      return card;
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

  /* ---- A1 merges -----------------------------------------------------------
   * The A1 notion/function/discourse strands arrived from PCIC as micro-lessons
   * — three sections and four recall items apiece. Taught one a day they alone
   * cost 39 days, which is most of why A1 ran to a year. These pairs are not
   * arbitrary chunking: each joins two halves of one idea a learner would
   * expect to meet together (where a thing is / where it is relative to
   * something else; asking for information / giving it). The merged lesson
   * keeps the first id, so progress and any reference to it survive; both
   * source ids are recorded in `mergedFrom` and both sets of PCIC provenance
   * are carried, so the coverage gates still see every spec item.
   * 39 lessons -> 20 days. Other levels are untouched for now; the same table
   * takes their groups when they need them. */
  var MERGES = [
    /* ---- one tense, one lesson -------------------------------------------
     * Every tense on the legacy ladder acquired a PCIC twin that also forms it,
     * so six tenses were taught twice — and half the pairs ran backwards. The
     * present perfect was built at A2 and built again at B1 day 3; the present
     * subjunctive at B1 day 17 and again at day 110; the conditional was taught
     * before the future it derives from, and said so ("next lesson").
     *
     * The two halves are worth different things. The ladder lesson is
     * GENERATED — endings table and recall items straight from the engine, so
     * they cannot drift — while the strand lesson is hand-written usage: what
     * the tense is actually for, and where it trips people. Neither is the one
     * to throw away, so pair them. The head decides where the lesson lands:
     *   futuro/condicional take the LADDER as head, because SEED order is what
     *     puts the future before the conditional that borrows its stems;
     *   the rest take the STRAND lesson, because its level is the honest one —
     *     the present perfect is A2 whatever the old 1-5 ladder said. */
    { title: 'El pretérito perfecto: haber + participio',
      ids: ['gr-preterito-perfecto-a2', 'perfecto'] },
    { title: 'El imperativo afirmativo: forma y uso',
      ids: ['gr-imperativo-forma-a2', 'imperativo'] },
    { title: 'El futuro: forma, predicción y conjetura',
      ids: ['futuro', 'gr-futuro-imperfecto-b1'] },
    { title: 'El condicional: forma, cortesía y modestia',
      ids: ['condicional', 'gr-condicional-simple-b1'] },
    { title: 'El subjuntivo: cómo se forma y cuándo aparece',
      ids: ['gr-presente-subjuntivo-b1', 'presubj'] },
    { title: 'Pretérito pluscuamperfecto: había hablado',
      ids: ['gr-pluscuamperfecto-b1', 'plusc'] },

    /* ---- one topic, one lesson -------------------------------------------
     * The PCIC files these as separate inventory subsections, so they arrived
     * as separate lessons teaching the same thing — twice, usually days apart.
     * Relative "que" is §7.2 Los relativos AND §15.2 Oraciones subordinadas
     * adjetivas; both A1 lessons carry a "subject or object of its own clause"
     * section and both use "la profesora que tengo". */
    { title: 'El relativo que: una palabra, tres trabajos',
      ids: ['gr-relativo-que-a1', 'gr-subordinadas-adjetivas-a1'] },
    { title: 'Los demostrativos: este, ese, aquel — y dónde van',
      // A1 taught where a demonstrative sits in the phrase; the forms it sits
      // there in were an A2 lesson. WORKLIST.md files gr-demostrativos-a2
      // against the A1 spec item, which is the tell: it was always the A1 half.
      ids: ['gr-demostrativos-distribucion-a1', 'gr-demostrativos-a2'] },
    { title: 'Comparativos: los tres marcos y los irregulares',
      ids: ['gr-comparativos-a2', 'gr-comparativo-a2'] },
    { title: 'Estar de acuerdo — y no estarlo',
      // The second lesson's entire body said the first one's rule was unchanged.
      ids: ['fn-estoy-de-acuerdo-b1', 'fn-no-estoy-de-acuerdo-b1'] },
    { title: 'Pedir ayuda: directa, atenuada y encubierta',
      // fn-pedir-ayuda-b1 already taught all three levels of directness and
      // pointed back at fn-ayuda-atenuada-b1 for the middle one.
      ids: ['fn-pedir-ayuda-b1', 'fn-ayuda-atenuada-b1'] },
    { title: 'Certeza y falta de certeza: dónde se rompe el indicativo',
      ids: ['fn-certeza-evidencia-b1', 'fn-falta-certeza-b1'] },
    { title: 'Dar y pedir una opinión',
      ids: ['fn-dar-opinion-b1', 'fn-pedir-opinion-b1'] },
    { title: 'Planes e intenciones: contarlos y preguntarlos',
      ids: ['fn-expresar-planes-b1', 'fn-preguntar-planes-b1'] },

    // notion: 18 -> 9
    { title: 'Dónde están las cosas', ids: ['nt-localizacion-a1', 'nt-posicion-relativa-a1'] },
    { title: 'Ir, venir y dar direcciones', ids: ['nt-movimiento-estabilidad-a1', 'nt-orientacion-direccion-a1'] },
    { title: 'Cantidad: números, más y menos', ids: ['nt-cantidad-numerica-a1', 'nt-cantidad-relativa-a1'] },
    { title: 'Precio y tamaño', ids: ['nt-valor-precio-a1', 'nt-tamano-a1'] },
    { title: 'La hora, los días y la frecuencia', ids: ['nt-referencias-generales-a1', 'nt-frecuencia-a1'] },
    { title: 'Antes, después y cuándo pasa', ids: ['nt-duracion-transcurso-a1', 'nt-tiempo-futuro-presente-pasado-a1'] },
    { title: 'Hay, está, y entrar o salir', ids: ['nt-existencia-a1', 'nt-accesibilidad-a1'] },
    { title: 'De dónde eres y cuántos años tienes', ids: ['nt-origen-a1', 'nt-edad-vejez-a1'] },
    { title: 'Bueno, malo y los colores', ids: ['nt-evaluacion-general-a1', 'nt-visibilidad-vision-a1'] },
    // function: 15 -> 8 (pedir silencio has no natural partner; it stays alone)
    { title: 'Empezar y terminar una conversación', ids: ['fn-establecer-comunicacion-a1', 'fn-despedirse-a1'] },
    { title: 'Dirigirse a alguien y responder', ids: ['fn-dirigirse-a1', 'fn-responder-presentacion-a1'] },
    { title: 'Identificar: qué es y quién es', ids: ['fn-identificar-a1', 'fn-preguntar-decir-cosa-a1'] },
    { title: 'Pedir y dar información', ids: ['fn-pedir-informacion-a1', 'fn-dar-informacion-a1'] },
    { title: 'Acuerdo y desacuerdo', ids: ['fn-acuerdo-a1', 'fn-desacuerdo-a1'] },
    { title: 'Corregir y decir que no sabes', ids: ['fn-corregir-informacion-a1', 'fn-desconocimiento-a1'] },
    { title: 'Valorar y hablar de lo que haces', ids: ['fn-valorar-a1', 'fn-actividad-a1'] },
    // discourse: 6 -> 3
    { title: 'Conectores y negación', ids: ['dc-conectores-a1', 'dc-negacion-a1'] },
    { title: 'Esto, eso y el orden de la información', ids: ['dc-deixis-espacial-a1', 'dc-rematizacion-a1'] },
    { title: 'La entonación y la cortesía', ids: ['dc-entonacion-a1', 'dc-atenuacion-2persona-a1'] },

    /* A2 has the same shape only worse: 62 micro-lessons, and smaller — 25 of
     * its 33 function lessons run to two sections. Many are already explicit
     * ask/answer halves of one exchange (preguntar por gustos / expresar
     * gustos), which is how PCIC files them, not how anyone learns them.
     * 62 -> 32. */
    // function: 33 -> 17 (disculparse has no natural partner; it stays alone)
    { title: 'Preguntar y expresar gustos', ids: ['fn-preguntar-gustos-a2', 'fn-expresar-gustos-a2'] },
    { title: 'Preferencias: qué te gusta más', ids: ['fn-preguntar-preferencias-a2', 'fn-preferencia-comparativa-a2'] },
    { title: 'Saber y no saber', ids: ['fn-preguntar-conocimiento-a2', 'fn-expresar-conocimiento-a2'] },
    { title: 'Deseos: los tuyos y los que se ofrecen', ids: ['fn-preguntar-deseos-a2', 'fn-buenos-deseos-a2'] },
    { title: 'Decir que sí y decir que no', ids: ['fn-acceder-peticion-a2', 'fn-negarse-peticion-a2'] },
    { title: 'Pedir algo con cortesía', ids: ['fn-atenuar-orden-a2', 'fn-pedir-objetos-a2'] },
    { title: 'Proponer, sugerir y aceptar', ids: ['fn-proponer-sugerir-a2', 'fn-aceptar-invitacion-a2'] },
    { title: 'Saludar: en persona y por escrito', ids: ['fn-responder-saludo-a2', 'fn-saludar-escrito-a2'] },
    { title: 'Dirigirse a alguien y presentarlo', ids: ['fn-dirigirse-a2', 'fn-presentar-alguien-a2'] },
    { title: 'Pedir y dar información (A2)', ids: ['fn-pedir-informacion-a2', 'fn-dar-informacion-a2'] },
    { title: 'Felicitar y alegrarse', ids: ['fn-felicitar-a2', 'fn-alegria-satisfaccion-a2'] },
    { title: 'Cómo estás: ánimo y sensaciones', ids: ['fn-preguntar-estado-animo-a2', 'fn-sensaciones-fisicas-a2'] },
    { title: 'Al teléfono y escuchando un relato', ids: ['fn-responder-telefono-a2', 'fn-reaccionar-relato-a2'] },
    { title: 'Aconsejar y ofrecerse', ids: ['fn-aconsejar-a2', 'fn-ofrecerse-a2'] },
    { title: 'Acuerdo y valoración', ids: ['fn-acuerdo-a2', 'fn-valorar-a2'] },
    { title: 'Qué es y qué puede ser', ids: ['fn-identificar-a2', 'fn-posibilidad-a2'] },
    // notion: 17 -> 9 (expresión verbal stays alone)
    { title: 'Situar en el tiempo: desde, hasta, durante', ids: ['nt-localizacion-tiempo-a2', 'nt-referencias-generales-a2'] },
    { title: 'Ya, todavía no, y el principio y el fin', ids: ['nt-anterioridad-a2', 'nt-inicio-duracion-fin-a2'] },
    { title: 'Cuántas veces y cuánta cantidad', ids: ['nt-frecuencia-a2', 'nt-cantidad-relativa-a2'] },
    { title: 'Moverse y dar direcciones (A2)', ids: ['nt-movimiento-estabilidad-a2', 'nt-orientacion-direccion-a2'] },
    { title: 'Dentro, fuera y a la vista', ids: ['nt-posicion-relativa-distancia-a2', 'nt-visibilidad-color-a2'] },
    { title: 'De qué es y cambiarlo por otro', ids: ['nt-cualidad-material-a2', 'nt-cambio-a2'] },
    { title: 'Nacer, morir y las edades', ids: ['nt-existencia-inexistencia-a2', 'nt-edad-vejez-a2'] },
    { title: 'Necesidad y conformidad: hace falta, vale', ids: ['nt-necesidad-obligacion-a2', 'nt-evaluacion-conformidad-a2'] },
    // discourse: 12 -> 6
    { title: 'Deixis personal y espacial', ids: ['dc-deixis-personal-a2', 'dc-deixis-espacial-a2'] },
    { title: 'Deixis temporal y el hilo del relato', ids: ['dc-deixis-temporal-a2', 'dc-mantenimiento-referente-a2'] },
    { title: 'Preguntas neutras y orientadas', ids: ['dc-interrogativos-neutros-a2', 'dc-interrogativos-orientados-a2'] },
    { title: 'Atenuar: se impersonal e indirectas', ids: ['dc-atenuacion-1apersona-a2', 'dc-atenuacion-acto-indirecto-a2'] },
    { title: 'Tematización y rematización', ids: ['dc-tematizacion-a2', 'dc-rematizacion-a2'] },
    { title: 'Estructuradores y negación reforzada', ids: ['dc-estructuradores-a2', 'dc-negacion-refuerzo-a2'] }
  ];

  function concat(a, b) { return (a || []).concat(b || []); }

  function applyMerges(lessons) {
    var byId = {};
    lessons.forEach(function (l) { byId[l.id] = l; });
    var absorbed = {}, merged = {};

    MERGES.forEach(function (m) {
      var parts = m.ids.map(function (id) { return byId[id]; });
      if (parts.some(function (p) { return !p; })) return;   // regenerated away: skip
      var head = parts[0], rest = parts.slice(1);
      var out = {
        id: head.id, strand: head.strand, cefr: head.cefr, level: head.level,
        theme: head.theme, title: m.title, summary: m.summary || head.summary,
        order: head.order, mergedFrom: m.ids.slice(),
        pcic: [], sections: [], exponents: [], contrasts: [], pitfalls: [],
        examples: [], probes: [], recall: []
      };
      parts.forEach(function (p, i) {
        // A divider titled with the absorbed lesson keeps the two halves legible
        // as two halves, rather than running six sections together unlabelled.
        if (i > 0) out.sections.push({ h: p.title, html: p.summary || '' });
        ['pcic', 'sections', 'exponents', 'contrasts', 'pitfalls', 'examples', 'probes']
          .forEach(function (k) { out[k] = concat(out[k], p[k]); });
        // Half the recall from each side: eight quick-check items in one
        // sitting is a test, not a check.
        out.recall = concat(out.recall, (p.recall || []).slice(0, 3));
        // The generated tense lessons carry an engine-built conjugation table.
        // A merge that drops it would trade the paradigm for the prose, which
        // is the opposite of the point of pairing them.
        if (p.conjTabs && !out.conjTabs) out.conjTabs = p.conjTabs;
      });
      // Drop the blocks that stayed empty: the strand gate rejects a block a
      // strand isn't allowed to carry, and an empty [] is still carrying it.
      Object.keys(out).forEach(function (k) {
        if (Array.isArray(out[k]) && !out[k].length) delete out[k];
      });
      merged[head.id] = out;
      rest.forEach(function (p) { absorbed[p.id] = head.id; });
    });

    window.LESSON_MERGED_INTO = absorbed;   // old id -> the lesson that now holds it
    return lessons.filter(function (l) { return !absorbed[l.id]; })
                  .map(function (l) { return merged[l.id] || l; });
  }

  /* The teaching order is READ, not derived — see data/course.js.
   *
   * It used to be a sort: level, then strand rank, then seed index, then an
   * explicit nudge, then the title. Every one of those keys was doing real
   * work, and the result was still an order nobody could read: for the ~600
   * PCIC strand lessons the title was the only thing separating them, so the
   * sequence came out of Spanish spelling. Worse, `level` was deciding both
   * teaching order AND content difficulty, and the two contradicted each other
   * — gate 3 belongs to A2 and B1 alike, so the conditional could not be moved
   * earlier for A2 without disappearing from B1.
   *
   * Now COURSE says the order and `level` means one thing again: how hard a
   * passage or cloze item may be (js/session.js atLevel). A lesson missing from
   * COURSE is a content-gate failure, not something to paper over here — it
   * would otherwise be silently unreachable. */
  function buildSyllabus(lessons) {
    var pos = {}, byId = {};
    (window.COURSE || []).forEach(function (e, i) { if (e.lesson) pos[e.lesson] = i; });
    lessons.forEach(function (l) { byId[l.id] = l; });
    return (window.COURSE || []).filter(function (e) { return e.lesson && byId[e.lesson]; })
      .map(function (e) {
        var l = byId[e.lesson];
        return { id: l.id, level: l.level || 1, strand: l.strand || 'grammar', cefr: l.cefr || null };
      });
  }

  /* The session walks GRAMMAR_LESSONS to find the next unstudied lesson, so the
   * ARRAY has to be in teaching order — deriving a separate SYLLABUS list and
   * leaving the array in build order would teach a B2 function lesson as
   * lesson 18, ahead of every A1 one. Order the array itself. */
  var built = applyMerges(build());
  var syllabus = buildSyllabus(built);
  var byId = {};
  built.forEach(function (l) { byId[l.id] = l; });
  window.GRAMMAR_LESSONS = syllabus.map(function (s) { return byId[s.id]; })
    .filter(function (l) { return !!l; });
  window.SYLLABUS = syllabus;
  window.SEED_SYLLABUS = SEED;
  /* Every lesson that EXISTS, ordered or not. GRAMMAR_LESSONS is the course,
   * so a lesson left out of data/course.js is simply absent from it — which
   * means the content gate cannot notice the omission by looking there. It
   * checks this against COURSE instead, and that is the whole safety net for
   * writing the order down by hand. */
  window.ALL_LESSONS = built;
})();
