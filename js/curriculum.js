/* ============================================================================
 * CURRICULUM — the paced path through one level.
 *
 * A new grammar tense every day is too much; a year to finish A1 is far too
 * little. This interleaves day-types so new grammar is spaced out without the
 * path running to thousands of days:
 *
 *   verbs    — meet a few new verbs (meaning), most-common first
 *   grammar  — a lesson: a tense, a notion, a function, discourse, a genre
 *   practice — no new content; consolidate what you've met
 *
 * Three things keep it short:
 *   1. The path is scoped to the learner's OWN level. It used to walk all 748
 *      lessons and all 5,805 words whatever level you were on, so an A1
 *      beginner's route to "finished" ran through C1 — 2,211 days.
 *   2. There are no vocab days. New words arrive every day through the review
 *      stage (Profile.newPerDay), which is where the SRS wants them anyway; a
 *      day spent only meeting words was a day not spent using any.
 *   3. Practice lands every 6th day rather than every 4th.
 *
 * Paced levels (A1/A2) use this; B1 and up get a lesson each session.
 * ========================================================================== */
window.Curriculum = (function () {
  var E = window.ENGINE;

  /* Frequency order, blended with the domestic/daily-life verbs an A1 learner
   * needs on day one and the raw corpus counts rank far too low (ducharse
   * before desarrollar). Verb days teach regular verbs only — the common
   * irregulars are taught properly by the grammar ladder — so this list is a
   * ranking, not a syllabus: whatever in it is irregular simply falls out. */
  var VERB_PRIORITY = [
    'hablar', 'llegar', 'pasar', 'llevar', 'dejar', 'tomar', 'llamar', 'quedar',
    'creer', 'esperar', 'buscar', 'entrar', 'trabajar', 'necesitar', 'mirar',
    'escuchar', 'comprar', 'ayudar', 'usar', 'terminar', 'estudiar', 'preguntar',
    'contestar', 'comer', 'beber', 'cocinar', 'lavar', 'limpiar', 'ordenar',
    'descansar', 'cenar', 'desayunar', 'preparar', 'cuidar', 'vivir', 'aprender',
    'escribir', 'leer', 'abrir', 'subir', 'bajar', 'correr', 'caminar', 'viajar',
    'visitar', 'invitar', 'cantar', 'bailar', 'nadar', 'tocar', 'sacar', 'pagar',
    'cambiar', 'ganar', 'gastar', 'ahorrar', 'firmar', 'reservar', 'alquilar',
    'olvidar', 'recordar', 'contar', 'explicar', 'enseñar', 'aceptar', 'usar',
    'intentar', 'decidir', 'permitir', 'recibir', 'partir', 'cumplir', 'existir',
    'ocurrir', 'insistir', 'discutir', 'apagar', 'encender', 'guardar', 'tirar',
    'romper', 'arreglar', 'prestar', 'regalar', 'mandar', 'enviar', 'saludar',
    'presentar', 'acompañar', 'esperar', 'descargar', 'grabar', 'marcar',
    'llenar', 'vaciar', 'cerrar', 'levantar', 'bañar', 'peinar', 'vestir',
    'lavarse', 'ducharse', 'levantarse', 'acostarse', 'llamarse', 'llevarse'
  ];

  // How many of those a level meets on verb days. A1 wants the common core and
  // nothing else; higher levels widen out to the whole regular vocabulary.
  var VERB_BUDGET = { A1: 100, A2: 220 };

  function chunk(a, n) { var o = []; for (var i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; }

  function lessonsFor(cefr) {
    var all = window.GRAMMAR_LESSONS || [];
    var band = (window.LEVELS || []).filter(function (L) { return L.code === cefr; })[0];
    var gates = (band && band.levels) || null;
    return all.filter(function (l) {
      if (l.cefr) return l.cefr === cefr;
      // The legacy tense ladder carries no CEFR band, only a 1-5 gate; take the
      // ones this level is allowed to reach. Without this an A1 path walked all
      // 18 of them — the subjunctive included.
      return !gates || gates.indexOf(l.level || 1) !== -1;
    });
  }

  function verbsFor(cefr) {
    var budget = VERB_BUDGET[cefr] || 0;
    var seen = {}, order = [];
    VERB_PRIORITY.forEach(function (inf) {
      var v = E.verbByInf(inf);
      if (v && !E.isIrregular(v) && !seen[inf]) { seen[inf] = 1; order.push(inf); }
    });
    if (!budget) {
      (window.VERBS || []).forEach(function (v) {
        if (!E.isIrregular(v) && !seen[v.inf]) { seen[v.inf] = 1; order.push(v.inf); }
      });
      return order;
    }
    return order.slice(0, budget);
  }

  function build(cefr) {
    var lessonDays = lessonsFor(cefr).map(function (l) { return { type: 'grammar', id: l.id }; });
    var verbDays = chunk(verbsFor(cefr), 5).map(function (ch) { return { type: 'verbs', verbs: ch }; });

    var seq = [];
    function take(q) { return q.length ? q.shift() : null; }
    function push(x) { if (x) seq.push(x); }
    // Practice every 6th day, counted over the sequence as built so the spacing
    // stays even however the two queues drain.
    function tick() { if (seq.length && seq.length % 6 === 5) seq.push({ type: 'practice' }); }

    // Opener: the first verbs, then the present tense, then straight on.
    push(take(verbDays));
    push(take(lessonDays));

    // Then two lessons per verb day: the verbs are there to feed the lessons,
    // not to be the course.
    while (lessonDays.length || verbDays.length) {
      push(take(lessonDays)); tick();
      push(take(lessonDays)); tick();
      push(take(verbDays));   tick();
    }
    return seq;
  }

  var CACHE = {};
  return {
    seq: function (cefr) {
      var k = cefr || (window.Profile && window.Profile.current()) || 'A1';
      return CACHE[k] || (CACHE[k] = build(k));
    }
  };
})();
