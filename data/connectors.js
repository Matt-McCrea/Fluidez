/* ============================================================================
 * CONNECTORS — discourse markers, in the Plan Curricular's own taxonomy
 * (Tácticas y estrategias pragmáticas 1.2, "Marcadores del discurso").
 *
 * Two jobs at once:
 *   1. CONTENT — this is what B2/C1 discourse lessons teach. The current app
 *      has eight words tagged `connectors` in data/vocab.js; connecting an
 *      argument is most of what separates B1 prose from C1 prose.
 *   2. VERIFICATION — the `connectorFrom` constraint in js/checker.js checks a
 *      learner's paragraph actually used, say, a contraargumentativo, rather
 *      than the vague `containsAny` word list we use today.
 *
 * `level` is the level at which the marker is first expected. Keep each class
 * ordered easiest-first: the word-bank generator takes from the front.
 * ========================================================================== */
window.CONNECTORS = [
  { id: 'aditivo', label: 'Aditivos', en: 'adding to the argument',
    items: [
      { es: 'además', level: 'B1' }, { es: 'también', level: 'B1' },
      { es: 'asimismo', level: 'B2' }, { es: 'es más', level: 'B2' },
      { es: 'incluso', level: 'B2' }, { es: 'aparte de eso', level: 'B2' },
      { es: 'por añadidura', level: 'C1' }, { es: 'a ello hay que sumar', level: 'C1' }
    ] },

  { id: 'consecutivo', label: 'Consecutivos', en: 'stating a consequence',
    items: [
      { es: 'por eso', level: 'B1' }, { es: 'así que', level: 'B1' },
      { es: 'entonces', level: 'B1' }, { es: 'por lo tanto', level: 'B2' },
      { es: 'en consecuencia', level: 'B2' }, { es: 'de ahí que', level: 'C1' },
      { es: 'por consiguiente', level: 'C1' }, { es: 'de modo que', level: 'B2' }
    ] },

  { id: 'justificativo', label: 'Justificativos', en: 'giving the reason',
    items: [
      { es: 'porque', level: 'B1' }, { es: 'ya que', level: 'B1' },
      { es: 'puesto que', level: 'B2' }, { es: 'dado que', level: 'B2' },
      { es: 'debido a que', level: 'B2' }, { es: 'en vista de que', level: 'C1' },
      { es: 'habida cuenta de que', level: 'C1' }
    ] },

  { id: 'contraargumentativo', label: 'Contraargumentativos', en: 'countering or conceding',
    items: [
      { es: 'pero', level: 'B1' }, { es: 'sin embargo', level: 'B1' },
      { es: 'aunque', level: 'B1' }, { es: 'en cambio', level: 'B2' },
      { es: 'no obstante', level: 'B2' }, { es: 'ahora bien', level: 'C1' },
      { es: 'con todo', level: 'C1' }, { es: 'si bien', level: 'C1' },
      { es: 'antes bien', level: 'C1' }
    ] },

  { id: 'ordenador-inicio', label: 'Ordenadores de inicio', en: 'opening',
    items: [
      { es: 'en primer lugar', level: 'B1' }, { es: 'para empezar', level: 'B1' },
      { es: 'ante todo', level: 'B2' }, { es: 'de entrada', level: 'C1' }
    ] },

  { id: 'ordenador-continuidad', label: 'Ordenadores de continuidad', en: 'continuing',
    items: [
      { es: 'en segundo lugar', level: 'B1' }, { es: 'por otra parte', level: 'B2' },
      { es: 'por un lado', level: 'B1' }, { es: 'por otro lado', level: 'B1' },
      { es: 'a continuación', level: 'B2' }, { es: 'asimismo', level: 'B2' }
    ] },

  { id: 'ordenador-cierre', label: 'Ordenadores de cierre', en: 'closing',
    items: [
      { es: 'por último', level: 'B1' }, { es: 'finalmente', level: 'B1' },
      { es: 'en definitiva', level: 'B2' }, { es: 'para terminar', level: 'B2' },
      { es: 'en suma', level: 'C1' }
    ] },

  { id: 'comentador', label: 'Comentadores', en: 'shifting to a new comment',
    items: [
      { es: 'pues bien', level: 'B2' }, { es: 'dicho esto', level: 'C1' },
      { es: 'en cuanto a', level: 'B2' }, { es: 'por lo que respecta a', level: 'C1' }
    ] },

  { id: 'reformulador-explicativo', label: 'Reformuladores explicativos', en: 'restating more clearly',
    items: [
      { es: 'es decir', level: 'B1' }, { es: 'o sea', level: 'B1' },
      { es: 'esto es', level: 'C1' }, { es: 'dicho de otro modo', level: 'B2' },
      { es: 'en otras palabras', level: 'B2' }
    ] },

  { id: 'reformulador-recapitulativo', label: 'Reformuladores recapitulativos', en: 'summing up',
    items: [
      { es: 'en resumen', level: 'B1' }, { es: 'en conclusión', level: 'B2' },
      { es: 'total que', level: 'C1' }, { es: 'a fin de cuentas', level: 'C1' },
      { es: 'en pocas palabras', level: 'B2' }
    ] },

  { id: 'focalizador', label: 'Focalizadores', en: 'putting the spotlight somewhere',
    items: [
      { es: 'sobre todo', level: 'B1' }, { es: 'en particular', level: 'B2' },
      { es: 'especialmente', level: 'B1' }, { es: 'en concreto', level: 'B2' },
      { es: 'más concretamente', level: 'C1' }
    ] },

  { id: 'atenuador', label: 'Atenuadores', en: 'softening a claim (cortesía atenuadora)',
    items: [
      { es: 'en cierto modo', level: 'B2' }, { es: 'hasta cierto punto', level: 'B2' },
      { es: 'por así decirlo', level: 'C1' }, { es: 'si no me equivoco', level: 'B2' },
      { es: 'todo hay que decirlo', level: 'C1' }, { es: 'digamos que', level: 'C1' }
    ] }
];
