/* ============================================================================
 * RUBRICS — how you mark your own advanced writing, offline.
 *
 * The app could already check MECHANICS: the engine conjugates, so
 * js/checker.js can verify "this is the imperfect subjunctive of poder" or
 * "this paragraph contains a C1 contraargumentativo" while you type. What it
 * has never been able to check is everything a B2/C1 text is actually judged
 * on — whether the reader knows your position by the end of the first
 * paragraph, whether the concession is answered or merely admitted, whether
 * the register survives to the last line. There is no local model that can
 * judge that, and there will not be one on a device with no network.
 *
 * So the app does not pretend to. It hands the judgement back to the learner
 * as a RUBRIC, and the rubric is built so that handing it back works:
 *
 *   EVERY QUESTION IS A FACT ABOUT THE TEXT, NOT AN OPINION OF IT. "¿Está
 *   bien escrito?" is unanswerable by the person who just wrote it. "¿Aparece
 *   tu tesis antes de la línea cuatro?" is a thing you can look at and settle
 *   in five seconds, and it is most of what "bien escrito" meant.
 *
 *   EVERY QUESTION CARRIES ITS REPAIR. A criterion you fail and cannot act on
 *   is a grade, and a grade is the least useful thing you can give somebody
 *   with a draft in front of them. `fix` is the next edit.
 *
 *   THE RUBRIC IS READ BEFORE WRITING, NOT ONLY AFTER. js/essay.js shows it
 *   as the plan; the same list then becomes the self-check. Criteria known in
 *   advance change the draft, which is the entire point — a rubric revealed
 *   only at marking time is a test, not teaching.
 *
 * The five dimensions are the DELE written-expression criteria (adecuación ·
 * coherencia · cohesión · alcance · corrección), because the learner this app
 * is for is heading for a real exam and there is no reason to invent a
 * private vocabulary for the same five things. `corrección` is deliberately
 * the THINNEST dimension here: it is the one the live checklist already
 * covers, and repeating a machine check as a human one teaches the learner to
 * tick without looking.
 *
 * Referenced by id from a writing task's `rubric` field. Adding one is a data
 * edit; tools/validate-content.js checks that every id a task names exists.
 * ========================================================================== */
window.RUBRICS = [

  /* --------------------------------------------------------------------- */
  { id: 'argumentativa',
    label: 'Composición argumentativa',
    en: 'Argumentative composition',
    teaches: 'gn-argumentativa-c1',
    dims: [
      { id: 'adecuacion', label: 'Adecuación', en: 'fit to reader and purpose',
        asks: [
          { q: '¿Se sabe cuál es tu postura antes del final del primer párrafo?',
            fix: 'Adelanta la tesis. El lector de un texto argumentativo no espera el suspense.' },
          { q: '¿Has mantenido el mismo tratamiento y el mismo registro hasta la última línea?',
            fix: 'Relee solo los finales de párrafo: el registro se cae al final, cuando ya te has relajado.' },
          { q: '¿Se dirige a alguien concreto, y se nota?',
            fix: 'Pregúntate quién lee esto. Un texto sin lector acaba sonando a apuntes.' }
        ] },
      { id: 'coherencia', label: 'Coherencia', en: 'the shape of the argument',
        asks: [
          { q: '¿Cada párrafo defiende una sola idea?',
            fix: 'Si un párrafo tiene dos, pártelo. Si tiene media, únelo al siguiente.' },
          { q: '¿Has concedido algo al otro lado, y luego lo has respondido?',
            fix: 'Conceder sin responder es cambiar de bando. Tras la concesión hace falta un contraargumento.' },
          { q: '¿La conclusión dice algo que no estaba ya en la introducción?',
            fix: 'Una conclusión que repite la tesis sobra. Cierra con la consecuencia, la reserva o lo que queda sin resolver.' }
        ] },
      { id: 'cohesion', label: 'Cohesión', en: 'how the parts hold together',
        asks: [
          { q: '¿Los marcadores que has usado dicen de verdad lo que hace la frase siguiente?',
            fix: 'Un "sin embargo" delante de algo que no contrasta desorienta más que la ausencia de marcador.' },
          { q: '¿Has evitado repetir el mismo sustantivo en frases seguidas?',
            fix: 'Pronombre, sinónimo, hiperónimo o elipsis. Repetir el nombre es lo que delata una traducción.' },
          { q: '¿Hay alguna frase de más de tres líneas?',
            fix: 'Divídela. La subordinación larga no es nivel alto; el control del ritmo sí.' }
        ] },
      { id: 'alcance', label: 'Alcance', en: 'how far the language reaches',
        asks: [
          { q: '¿Has usado algún verbo distinto de ser, estar, haber, tener y hacer en cada párrafo?',
            fix: 'Subraya los verbos. Si son esos cinco, el texto es correcto y plano.' },
          { q: '¿Aparece vocabulario propio del tema que no usarías hablando de otra cosa?',
            fix: 'Un texto sobre vivienda que no dice alquiler, hipoteca ni desahucio no es sobre vivienda.' },
          { q: '¿Has matizado alguna afirmación en lugar de dejarla absoluta?',
            fix: 'Atenúa: "hasta cierto punto", "todo hay que decirlo", condicional. Lo tajante suena a folleto.' }
        ] },
      { id: 'correccion', label: 'Corrección', en: 'what is left after the checklist',
        asks: [
          { q: '¿Has releído en voz baja buscando concordancias y tildes?',
            fix: 'La lista de arriba comprueba lo que se le pidió al texto, no todo lo que el texto dice.' }
        ] }
    ] },

  /* --------------------------------------------------------------------- */
  { id: 'formal-transaccional',
    label: 'Carta formal o reclamación',
    en: 'Formal or transactional letter',
    teaches: 'gn-carta-reclamacion-c1',
    dims: [
      { id: 'adecuacion', label: 'Adecuación', en: 'fit to reader and purpose',
        asks: [
          { q: '¿Has tratado de usted sin una sola caída al tú?',
            fix: 'Busca los imperativos: son donde se escapa el tú.' },
          { q: '¿El tono se sostiene aunque el motivo sea una queja?',
            fix: 'La indignación no obliga a nada. La carta que consigue algo es la que resulta fácil de atender.' },
          { q: '¿Se entiende qué pides exactamente, y no solo de qué te quejas?',
            fix: 'Escribe la petición como una sola frase: devolución, sustitución, disculpa, plazo.' }
        ] },
      { id: 'coherencia', label: 'Coherencia', en: 'the shape of the letter',
        asks: [
          { q: '¿Aparecen los hechos antes que las valoraciones?',
            fix: 'Fecha, producto, importe, qué pasó. La valoración sin hechos no se puede comprobar.' },
          { q: '¿Has separado el motivo, el argumento y la solución que propones?',
            fix: 'Tres bloques. Mezclados, el lector tiene que reconstruirlos para poder responderte.' },
          { q: '¿El cierre deja claro qué esperas y para cuándo?',
            fix: 'Un cierre cortés sin petición concreta se archiva sin respuesta.' }
        ] },
      { id: 'cohesion', label: 'Cohesión', en: 'how the parts hold together',
        asks: [
          { q: '¿Has ordenado los hechos con marcadores de tiempo o de secuencia?',
            fix: 'El lector no estaba allí. Sin orden explícito reconstruye mal la historia.' },
          { q: '¿Has evitado empezar tres frases seguidas igual?',
            fix: 'Tres frases que abren con el mismo sujeto convierten una carta en una lista.' }
        ] },
      { id: 'alcance', label: 'Alcance', en: 'how far the language reaches',
        asks: [
          { q: '¿Has usado construcciones impersonales o pasivas donde señalar a alguien sobraba?',
            fix: 'Con "se" y con la pasiva se reclama sin acusar, que es lo que hace que te atiendan.' },
          { q: '¿Aparece el vocabulario propio del trámite?',
            fix: 'Factura, garantía, plazo, justificante, importe. Sin ellos la carta suena a conversación.' }
        ] },
      { id: 'correccion', label: 'Corrección', en: 'what is left after the checklist',
        asks: [
          { q: '¿Has comprobado las fórmulas de apertura y cierre?',
            fix: 'Son lo primero y lo último que se lee, y las únicas partes que el lector espera exactas.' }
        ] }
    ] },

  /* --------------------------------------------------------------------- */
  { id: 'opinion-debate',
    label: 'Intervención en un debate',
    en: 'Taking part in a debate',
    teaches: 'dc-atenuacion-dialogica-c1',
    dims: [
      { id: 'adecuacion', label: 'Adecuación', en: 'fit to reader and purpose',
        asks: [
          { q: '¿Discrepas del argumento y no de la persona?',
            fix: 'Cita lo que se ha dicho, no a quien lo ha dicho. Es la diferencia entre debatir y reñir.' },
          { q: '¿Has atenuado el desacuerdo antes de formularlo?',
            fix: 'Reconoce la parte que compartes primero. Un desacuerdo desnudo cierra el turno del otro.' }
        ] },
      { id: 'coherencia', label: 'Coherencia', en: 'the shape of the turn',
        asks: [
          { q: '¿Has recogido lo que dijo el otro antes de responderlo?',
            fix: 'Reformula su postura en una línea. Si no puedes, todavía no la has entendido.' },
          { q: '¿Tu intervención aporta algo nuevo o solo repite tu postura con otras palabras?',
            fix: 'Un dato, un caso, una consecuencia o una distinción. Insistir no es argumentar.' }
        ] },
      { id: 'cohesion', label: 'Cohesión', en: 'how the parts hold together',
        asks: [
          { q: '¿Se ve dónde acaba lo que cita y dónde empieza lo que opinas?',
            fix: 'Marca la frontera: "según él", "si te he entendido bien", "por mi parte".' },
          { q: '¿Has usado algún reformulador para precisar en lugar de repetir?',
            fix: '"Dicho de otro modo", "esto es". Precisar es más persuasivo que subir el volumen.' }
        ] },
      { id: 'alcance', label: 'Alcance', en: 'how far the language reaches',
        asks: [
          { q: '¿Aparece alguna forma de cortesía verbal más allá de "creo que"?',
            fix: 'Condicional, imperfecto de cortesía, "no sé si", "quizá convendría".' },
          { q: '¿Has evitado los absolutos (siempre, nunca, todos, nadie)?',
            fix: 'Un absoluto se rebate con un solo contraejemplo. Cuantifica y te haces difícil de refutar.' }
        ] },
      { id: 'correccion', label: 'Corrección', en: 'what is left after the checklist',
        asks: [
          { q: '¿Los subjuntivos que pide la atenuación están donde deben?',
            fix: 'Los verbos de opinión en negativo lo rigen: "no creo que sea", no "no creo que es".' }
        ] }
    ] }
];
