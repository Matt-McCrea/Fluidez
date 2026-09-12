/* ============================================================================
 * COURSE — the syllabus, written down.
 *
 * This file IS the teaching order. It replaced a sort: level, then strand rank,
 * then seed index, then title. That sort worked, but the order it produced was
 * emergent — nobody could read it, and for the ~600 PCIC strand lessons the
 * LAST tiebreaker (localeCompare on the Spanish title) was the only thing
 * separating them, so the sequence was an artifact of spelling. "Los posesivos
 * átonos: dónde van" came before "Los posesivos: formas": where they go,
 * before what they are.
 *
 * The deeper problem was that `level` was doing two unrelated jobs — deciding
 * teaching order AND gating content difficulty — and the two kept contradicting
 * each other. Gate 3 belongs to both A2 and B1, so the conditional could not be
 * moved earlier for A2 without vanishing from B1. Splitting them fixes it:
 * order lives here, and `level` goes back to meaning one thing, how hard a
 * passage or cloze item is (js/session.js atLevel).
 *
 * Three kinds of entry:
 *   { lesson: 'id' }   a lesson from GRAMMAR_LESSONS
 *   { verbs: [...] }   a verb day — meet five new verbs by meaning
 *   { practice: true } no new content; consolidate
 *
 * COURSE_BANDS gives each CEFR band's start index. "Start at B1" means "start
 * at index 192"; a learner runs off the end of their band straight into
 * the next one, which is what finishing a band should do.
 *
 * The content gate (tools/validate-content.js) checks that every lesson appears
 * exactly once and that no lesson's teaching sections use a verb form built
 * later in this list. Adding a lesson means placing it — that is the point.
 *
 * Verb days were frozen from the VERB_TIERS table that used to live in
 * js/curriculum.js: frequency order blended with the domestic verbs a beginner
 * needs on day one and that raw corpus counts rank far too low.
 * ========================================================================== */
window.COURSE = [

  /* ---- A1 · 94 days · starts at index 0 ------------------------------- */

  /* Unit 1 · Meet someone — 10 days ------------------------------------
   * "I can greet someone, say who I am and where I am from, and ask them
   * the same." Four of these lessons were already written and sat at days
   * 87, 90, 100 and 234; the dialogue, the thanks and the task are new.
   * The dialogue comes FIRST, before any grammar, on purpose. */
  { unit: 'a1-u01', band: 'A1', title: 'Meet someone',
    goal: 'I can greet someone, say who I am and where I am from, and ask them the same.',
    canDo: ['greet someone and answer a greeting',
            'give my name and ask for one',
            'say where I am from and how old I am',
            'say thank you and reply to it',
            'open a conversation and close it'],
    days: [
    { lesson: 'dlg-presentarse' },                        // dial  Dos personas se conocen
    { lesson: 'gr-sonidos-a1' },                          // gram  Los sonidos: cinco vocales y nada más
    { verbs: ['ser', 'estar', 'llamarse', 'tener', 'haber'] },
    { lesson: 'presente' },                               // gram  Presente (Present)
    { lesson: 'fn-responder-saludo-a2' },                 // func  Saludar: en persona y por escrito
    { lesson: 'ser-estar' },                              // gram  Ser vs. Estar
    { lesson: 'nt-origen-a1' },                           // noti  De dónde eres y cuántos años tienes
    { lesson: 'fn-identificar-a1' },                      // func  Identificar: qué es y quién es
    { lesson: 'fn-agradecer-a1' },                        // func  Dar las gracias
    { lesson: 'fn-establecer-comunicacion-a1' },          // func  Empezar y terminar una conversación
    { lesson: 'task-presentarse' },                       // task  Preséntate
    ] },

  { unit: 'a1-u02', band: 'A1', title: 'Ask a question',
    goal: 'I can ask for a name, a place, a price and a repeat — and say when I have not understood.',
    canDo: ['ask with qué, dónde, cuánto, quién',
            'turn a statement into a question with my voice',
            'say I do not understand and ask for a repeat',
            'ask a stranger for information'],
    days: [
      { lesson: 'gr-interrogativos-a1' },
      { lesson: 'gr-acentuacion-a1' },
      { verbs: ['querer', 'poder', 'ir', 'hacer', 'dar'] },
      { lesson: 'dc-entonacion-a1' },
      { lesson: 'gr-pronombre-sujeto-a1' },
      { practice: true },
      { lesson: 'fn-pedir-informacion-a1' },
      { lesson: 'task-preguntar' },
    ] },

  { unit: 'a1-u03', band: 'A1', title: 'Be polite',
    goal: 'I can apologise, agree, disagree, and choose between tú and usted.',
    canDo: ['say sorry and reply when someone apologises',
            'agree and disagree out loud',
            'use tú or usted deliberately',
            'say yes, no, me too and me neither'],
    days: [
      { lesson: 'fn-dirigirse-a1' },
      { verbs: ['saber', 'conocer', 'ver', 'decir', 'poner'] },
      { lesson: 'fn-disculparse-a2' },
      { lesson: 'fn-acuerdo-a1' },
      { practice: true },
      { lesson: 'gr-adverbios-afirmacion-negacion-a1' },
      { lesson: 'task-cortesia' },
    ] },

  { unit: 'a1-u04', band: 'A1', title: 'Numbers, time and money',
    goal: 'I can say how many, what time, what day and how much.',
    canDo: ['count and use numbers up to a hundred',
            'tell the time and name the days',
            'ask and understand a price',
            'arrange a time to meet'],
    days: [
      { lesson: 'nt-cantidad-numerica-a1' },
      { lesson: 'gr-numerales-a1' },
      { verbs: ['hablar', 'trabajar', 'vivir', 'llamar', 'quedar'] },
      { lesson: 'nt-referencias-generales-a1' },
      { practice: true },
      { lesson: 'nt-valor-precio-a1' },
      { lesson: 'task-quedar' },
    ] },

  { unit: 'a1-u05', band: 'A1', title: 'Say what you like',
    goal: 'I can say what I like and hate, and react to what someone else likes.',
    canDo: ['use me gusta and me gustan correctly',
            'say me encanta and no me gusta nada',
            'agree with a negative using a mí tampoco',
            'ask what someone else likes'],
    days: [
      { lesson: 'gr-verbos-predicativos-tipos-a2' },
      { lesson: 'fn-preguntar-gustos-a2' },
      { verbs: ['comer', 'beber', 'comprar', 'necesitar', 'esperar'] },
      { lesson: 'nt-evaluacion-general-a1' },
      { practice: true },
      { lesson: 'fn-valorar-a1' },
      { lesson: 'task-gustos' },
    ] },

  { unit: 'a1-u06', band: 'A1', title: 'Order and buy',
    goal: 'I can order food and drink, buy something and pay for it.',
    canDo: ['order in a bar or café',
            'ask whether something exists with hay',
            'ask the price and pay',
            'close a transaction politely'],
    days: [
      { lesson: 'gn-conversacion-transaccional-a1' },
      { lesson: 'gr-articulo-indefinido-a1' },
      { verbs: ['venir', 'salir', 'volver', 'empezar', 'terminar'] },
      { lesson: 'nt-existencia-a1' },
      { practice: true },
      { lesson: 'task-cafe' },
    ] },

  { unit: 'a1-u07', band: 'A1', title: 'Describe people and things',
    goal: 'I can describe a person, a place or an object so that someone recognises it.',
    canDo: ['make adjectives agree',
            'say whose something is',
            'point things out with este, ese, aquel',
            'describe somebody until they are guessed'],
    days: [
      { lesson: 'gr-genero-adjetivo-a1' },
      { lesson: 'gr-adjetivos-calificativos-a1' },
      { verbs: ['entrar', 'pasar', 'llevar', 'tomar', 'dejar'] },
      { lesson: 'gr-posesivos-forma-a1' },
      { lesson: 'gr-posesivos-distribucion-a1' },
      { practice: true },
      { lesson: 'gr-demostrativos-distribucion-a1' },
      { lesson: 'gn-describir-persona-a1' },
      { lesson: 'gn-describir-objeto-a1' },
      { lesson: 'task-describir' },
    ] },

  { unit: 'a1-u08', band: 'A1', title: 'Where things are',
    goal: 'I can say where something is and give directions to it.',
    canDo: ['use hay for existence and está for location',
            'say aquí, ahí, allí and mean the right one',
            'give directions in a street',
            'describe a place'],
    days: [
      { lesson: 'nt-localizacion-a1' },
      { lesson: 'dc-deixis-espacial-a1' },
      { verbs: ['mirar', 'escuchar', 'ayudar', 'usar', 'estudiar'] },
      { lesson: 'nt-movimiento-estabilidad-a1' },
      { practice: true },
      { lesson: 'gn-describir-lugar-a1' },
      { lesson: 'task-direcciones' },
    ] },

  { unit: 'a1-u09', band: 'A1', title: 'Your day',
    goal: 'I can describe my daily routine and say how often I do things.',
    canDo: ['use reflexive verbs with their pronoun',
            'say when and how often',
            'talk about a whole day in order',
            'use the present for habits'],
    days: [
      { lesson: 'gr-pronombre-se-a1' },
      { lesson: 'gr-presente-indicativo-valores-a1' },
      { verbs: ['preguntar', 'contestar', 'cocinar', 'lavar', 'limpiar'] },
      { lesson: 'gr-adverbios-lugar-tiempo-cantidad-a1' },
      { practice: true },
      { lesson: 'nt-duracion-transcurso-a1' },
      { lesson: 'task-rutina' },
    ] },

  { unit: 'a1-u10', band: 'A1', title: 'Want, need, ask for',
    goal: 'I can say what I want, what I need and what I have to do — and ask for help.',
    canDo: ['use a verb plus an infinitive',
            'say what something is for with para',
            'correct someone and say I do not know',
            'ask three kinds of favour'],
    days: [
      { lesson: 'gr-infinitivo-usos-a1' },
      { lesson: 'gr-oraciones-finales-a1' },
      { verbs: ['ordenar', 'preparar', 'cuidar', 'aprender', 'subir'] },
      { lesson: 'fn-corregir-informacion-a1' },
      { practice: true },
      { lesson: 'task-pedir' },
    ] },

  { unit: 'a1-u11', band: 'A1', title: 'Join it up',
    goal: 'I can join short sentences so I sound connected rather than chopped up.',
    canDo: ['link with y, pero, porque, también',
            'use que to join a noun to a clause',
            'replace a noun with lo, la, los, las',
            'say how much with poco and mucho'],
    days: [
      { lesson: 'dc-conectores-a1' },
      { lesson: 'gr-relativo-que-a1' },
      { verbs: ['bajar', 'correr', 'caminar', 'viajar', 'visitar'] },
      { lesson: 'gr-objeto-directo-a1' },
      { practice: true },
      { lesson: 'gr-cuantificadores-no-universales-a1' },
      { lesson: 'task-contar' },
    ] },

  { unit: 'a1-u12', band: 'A1', title: 'The words behind the words',
    goal: 'I understand why Spanish nouns have a gender, and I can find my own agreement mistakes.',
    canDo: ['explain why a noun is el or la',
            'form plurals on article, noun and adjective',
            'use the definite article where English drops it',
            'correct my own earlier writing'],
    days: [
      { lesson: 'gender-articles' },
      { lesson: 'gr-genero-sustantivos-a1' },
      { verbs: ['invitar', 'cantar', 'bailar', 'nadar', 'cambiar'] },
      { lesson: 'gr-numero-sustantivos-a1' },
      { lesson: 'gr-articulo-definido-a1' },
      { practice: true },
      { lesson: 'task-revisar' },
    ] },

  { unit: 'a1-u13', band: 'A1', title: 'Everyday writing',
    goal: 'I can write the short texts people actually send.',
    canDo: ['write a message cancelling a plan',
            'open and close an email correctly',
            'leave a note somebody can act on',
            'write a postcard'],
    days: [
      { lesson: 'gn-generos-escritos-a1' },
      { verbs: ['ganar', 'gastar', 'ahorrar', 'firmar', 'reservar'] },
      { verbs: ['alquilar', 'olvidar', 'explicar', 'enseñar', 'aceptar'] },
      { practice: true },
      { lesson: 'task-escribir' },
    ] },

  /* ---- A2 · 104 days · starts at index 94 ------------------------------- */

  { unit: 'a2-u14', band: 'A2', title: 'Tell me what happened',
    goal: 'I can say what happened, in order, in the past.',
    canDo: ['use the preterite for completed events',
            'chain events with primero, luego, después',
            'handle fui, hice, tuve, estuve',
            'vary the verb beyond decir'],
    days: [
      { lesson: 'preterito' },
      { verbs: ['mejorar', 'empeorar', 'aumentar', 'evitar', 'crear'] },
      { lesson: 'dc-deixis-temporal-a2' },
      { lesson: 'nt-expresion-verbal-a2' },
      { practice: true },
      { lesson: 'task-a2-ayer' },
    ] },

  { unit: 'a2-u15', band: 'A2', title: 'How things used to be',
    goal: 'I can describe how things were and what I used to do.',
    canDo: ['use the imperfect for habits and descriptions',
            'know the only three irregulars',
            'say when something lasted',
            'say how often it happened'],
    days: [
      { lesson: 'imperfecto' },
      { verbs: ['formar', 'tratar', 'resultar', 'señalar', 'indicar'] },
      { lesson: 'nt-localizacion-tiempo-a2' },
      { lesson: 'nt-frecuencia-a2' },
      { practice: true },
      { lesson: 'task-a2-antes' },
    ] },

  { unit: 'a2-u16', band: 'A2', title: 'Telling a story',
    goal: 'I can tell an anecdote with both a background and a sequence of events.',
    canDo: ['choose preterite or imperfect by what I mean',
            'set a scene before anything happens',
            'interrupt an ongoing action with cuando',
            'structure a story from opening to close'],
    days: [
      { lesson: 'preterite-imperfect' },
      { verbs: ['ocupar', 'asegurar', 'expresar', 'comentar', 'opinar'] },
      { lesson: 'gn-narrar-anecdota-a2' },
      { lesson: 'dc-estructuradores-a2' },
      { practice: true },
      { lesson: 'task-a2-anecdota' },
    ] },

  { unit: 'a2-u17', band: 'A2', title: 'Have you ever…?',
    goal: 'I can talk about experience — what I have and have not done.',
    canDo: ['use the present perfect for experience',
            'use ya and todavía no',
            'form the irregular participles',
            'switch to the preterite when asked when'],
    days: [
      { lesson: 'gr-preterito-perfecto-a2' },
      { verbs: ['imaginar', 'dudar', 'notar', 'observar', 'comparar'] },
      { lesson: 'nt-anterioridad-a2' },
      { lesson: 'nt-existencia-inexistencia-a2' },
      { practice: true },
      { lesson: 'task-a2-experiencia' },
    ] },

  { unit: 'a2-u18', band: 'A2', title: 'It, him, her, them',
    goal: 'I can stop repeating the noun.',
    canDo: ['replace a direct object with lo, la, los, las',
            'replace an indirect object with le, les',
            'combine them as se lo',
            'put a pronoun in the right place'],
    days: [
      { lesson: 'gr-objeto-indirecto-a2' },
      { verbs: ['resumir', 'anunciar', 'publicar', 'celebrar', 'organizar'] },
      { lesson: 'gr-pronombres-atonos-a2' },
      { lesson: 'gr-pronombres-tonicos-a2' },
      { practice: true },
      { lesson: 'gr-posesivos-tonicos-a2' },
      { lesson: 'task-a2-pronombres' },
    ] },

  { unit: 'a2-u19', band: 'A2', title: 'Asking nicely',
    goal: 'I can make the same request from blunt to very polite, and refuse without offence.',
    canDo: ['form the affirmative imperative',
            'climb the politeness scale with poder and the conditional',
            'say no with es que',
            'give clear instructions'],
    days: [
      { lesson: 'gr-imperativo-forma-a2' },
      { verbs: ['participar', 'colaborar', 'reciclar', 'contaminar', 'reparar'] },
      { lesson: 'fn-atenuar-orden-a2' },
      { lesson: 'fn-acceder-peticion-a2' },
      { practice: true },
      { lesson: 'dc-atenuacion-1apersona-a2' },
      { lesson: 'gn-instrucciones-a2' },
      { lesson: 'task-a2-pedir' },
    ] },

  { unit: 'a2-u20', band: 'A2', title: 'How are you feeling?',
    goal: 'I can react to good and bad news the way a person actually does.',
    canDo: ['ask how somebody is and mean it',
            'react at the right size',
            'congratulate and sympathise',
            'agree and value what someone says'],
    days: [
      { lesson: 'fn-preguntar-estado-animo-a2' },
      { verbs: ['solicitar', 'entregar', 'cobrar', 'reclamar', 'vender'] },
      { lesson: 'fn-felicitar-a2' },
      { lesson: 'fn-preguntar-deseos-a2' },
      { practice: true },
      { lesson: 'fn-acuerdo-a2' },
      { lesson: 'task-a2-animo' },
    ] },

  { unit: 'a2-u21', band: 'A2', title: 'Comparing',
    goal: 'I can compare two things and justify which I would pick.',
    canDo: ['use más que, menos que, tan como',
            'use mejor, peor, mayor, menor',
            'say what something is made of',
            'describe two things against each other'],
    days: [
      { lesson: 'gr-comparativos-a2' },
      { verbs: ['funcionar', 'durar', 'faltar', 'suceder', 'practicar'] },
      { lesson: 'nt-cualidad-material-a2' },
      { lesson: 'gn-describir-persona-a2' },
      { practice: true },
      { lesson: 'gn-describir-objeto-a2' },
      { lesson: 'task-a2-comparar' },
    ] },

  { unit: 'a2-u22', band: 'A2', title: 'Getting things done',
    goal: 'I can handle a phone call, a shop and a desk — including when something is wrong.',
    canDo: ['open and close a phone call',
            'say what is wrong with something I bought',
            'ask for information I need',
            'say what I know and do not know'],
    days: [
      { lesson: 'gn-conversacion-transaccional-a2' },
      { verbs: ['entrenar', 'montar', 'aparcar', 'arrancar', 'frenar'] },
      { lesson: 'fn-responder-telefono-a2' },
      { lesson: 'fn-pedir-informacion-a2' },
      { practice: true },
      { lesson: 'fn-preguntar-preferencias-a2' },
      { lesson: 'nt-necesidad-obligacion-a2' },
      { lesson: 'fn-preguntar-conocimiento-a2' },
      { lesson: 'task-a2-gestion' },
    ] },

  { unit: 'a2-u23', band: 'A2', title: 'Reasons and conditions',
    goal: 'I can explain why I did something and what would have changed it.',
    canDo: ['give a cause with porque and como',
            'give a purpose with para',
            'say what happens if',
            'advise somebody else'],
    days: [
      { lesson: 'gr-causales-a2' },
      { verbs: ['cruzar', 'doblar', 'girar', 'parar', 'avisar'] },
      { lesson: 'por-para' },
      { lesson: 'gr-condicionales-a2' },
      { practice: true },
      { lesson: 'fn-aconsejar-a2' },
      { lesson: 'fn-proponer-sugerir-a2' },
      { lesson: 'task-a2-razones' },
    ] },

  { unit: 'a2-u24', band: 'A2', title: 'Getting around',
    goal: 'I can guide someone through a place and describe what is there.',
    canDo: ['use dentro, fuera, alrededor, al fondo',
            'measure a short distance in minutes',
            'describe a route somebody could follow',
            'introduce someone along the way'],
    days: [
      { lesson: 'nt-posicion-relativa-distancia-a2' },
      { verbs: ['informar', 'consultar', 'confirmar', 'cancelar', 'retrasar'] },
      { lesson: 'nt-movimiento-estabilidad-a2' },
      { lesson: 'gn-describir-lugar-a2' },
      { practice: true },
      { lesson: 'fn-dirigirse-a2' },
      { lesson: 'task-a2-sitio' },
    ] },

  { unit: 'a2-u25', band: 'A2', title: 'Writing it down',
    goal: 'I can write at paragraph length — a review and a semi-formal email.',
    canDo: ['use the gerund for two things at once',
            'hold a text together for three paragraphs',
            'open and close a semi-formal email',
            'keep usted consistent'],
    days: [
      { lesson: 'gr-gerundio-a2' },
      { verbs: ['adelantar', 'pesar', 'calcular', 'sumar', 'restar'] },
      { lesson: 'gr-adverbios-circunstanciales-a2' },
      { lesson: 'gn-generos-escritos-a2' },
      { practice: true },
      { lesson: 'gn-presentacion-publica-a2' },
      { lesson: 'task-a2-escribir' },
    ] },

  { unit: 'a2-u26', band: 'A2', title: 'The grammar under it',
    goal: 'I understand the machinery behind what I have been writing, and can correct my own work.',
    canDo: ['explain the irregular present patterns',
            'use the definite article where English drops it',
            'handle todo, otro, demasiado, nada',
            'find my own tense and pronoun errors'],
    days: [
      { lesson: 'gr-presente-irregular-a2' },
      { verbs: ['conectar', 'navegar', 'actualizar', 'instalar', 'suspender'] },
      { lesson: 'gr-articulo-definido-distribucion-a2' },
      { lesson: 'gr-cuantificadores-a2' },
      { practice: true },
      { lesson: 'gr-interrogativos-exclamativos-a2' },
      { lesson: 'gr-demostrativos-valores-a2' },
      { verbs: ['aprobar', 'quejarse', 'enfadarse', 'alegrarse', 'preocuparse'] },
      { lesson: 'task-a2-repaso' },
    ] },

  /* ---- B1 · 189 days · starts at index 198 ------------------------------- */

  { unit: 'b1-u27', band: 'B1', title: 'What I think',
    goal: 'I can state an opinion and say what I do NOT think.',
    canDo: ['give an opinion and back it',
            'use no creo que + subjunctive',
            'say how certain I am',
            'ask what someone else thinks'],
    days: [
      { lesson: 'gr-presente-subjuntivo-b1' },
      { lesson: 'fn-dar-opinion-b1' },
      { lesson: 'fn-certeza-evidencia-b1' },
      { lesson: 'nt-certeza-realidad-b1' },
      { practice: true },
      { lesson: 'fn-estoy-de-acuerdo-b1' },
      { lesson: 'task-b1-opinion' },
    ] },

  { unit: 'b1-u28', band: 'B1', title: 'Agreeing and arguing',
    goal: 'I can disagree without it becoming a row.',
    canDo: ['agree in part before pushing back',
            'put a counter-argument',
            'show scepticism',
            'correct with no… sino'],
    days: [
      { lesson: 'fn-aprobacion-desaprobacion-b1' },
      { lesson: 'fn-posicionarse-b1' },
      { lesson: 'fn-contraargumento-b1' },
      { lesson: 'fn-preguntar-si-acuerdo-b1' },
      { practice: true },
      { lesson: 'fn-mostrar-escepticismo-b1' },
      { lesson: 'dc-intensificar-acuerdo-desacuerdo-b1' },
      { lesson: 'fn-respuesta-afirmativa-b1' },
      { lesson: 'task-b1-debate' },
    ] },

  { unit: 'b1-u29', band: 'B1', title: 'Advice and what I would do',
    goal: 'I can advise someone at three levels of directness.',
    canDo: ['use the conditional to soften',
            'say yo que tú / lo mejor sería',
            'soften by shifting the tense',
            'value something and ask for a valuation'],
    days: [
      { lesson: 'condicional' },
      { lesson: 'fn-aconsejar-b1' },
      { lesson: 'gr-condicionales-b1' },
      { lesson: 'dc-atenuacion-b1' },
      { practice: true },
      { lesson: 'fn-valorar-b1' },
      { lesson: 'fn-pedir-valoracion-b1' },
      { lesson: 'task-b1-consejo' },
    ] },

  { unit: 'b1-u30', band: 'B1', title: 'What I want from you',
    goal: 'I can say what I want someone else to do.',
    canDo: ['use que + subjunctive after wanting',
            'express hope and wishes',
            'ask what someone wants',
            'say what is and is not possible'],
    days: [
      { lesson: 'gr-subordinadas-sustantivas-b1' },
      { lesson: 'fn-expresar-deseos-b1' },
      { lesson: 'fn-espero-esperanza-b1' },
      { lesson: 'fn-preguntar-deseos-b1' },
      { practice: true },
      { lesson: 'fn-posibilidad-b1' },
      { lesson: 'task-b1-deseos' },
    ] },

  { unit: 'b1-u31', band: 'B1', title: 'Plans and predictions',
    goal: 'I can talk about the future and guess about the present.',
    canDo: ['use ir a and the simple future',
            'use cuando + subjunctive for a future moment',
            'guess with the future of conjecture',
            'talk about events and when they happen'],
    days: [
      { lesson: 'futuro' },
      { lesson: 'fn-expresar-planes-b1' },
      { lesson: 'gr-temporales-b1' },
      { lesson: 'gr-modalidad-b1' },
      { practice: true },
      { lesson: 'nt-acontecimiento-b1' },
      { lesson: 'fn-proponer-sugerir-b1' },
      { lesson: 'fn-aceptar-propuesta-b1' },
      { lesson: 'fn-ofrecer-invitar-b1' },
      { lesson: 'task-b1-planes' },
    ] },

  { unit: 'b1-u32', band: 'B1', title: 'Asking, refusing, forbidding',
    goal: 'I can ask at four levels, refuse without offence, and forbid clearly.',
    canDo: ['ask a favour, permission and an object',
            'refuse with a reason',
            'give a direct order and a negative one',
            'forbid and warn'],
    days: [
      { lesson: 'fn-pedir-ayuda-b1' },
      { lesson: 'fn-pedir-permiso-b1' },
      { lesson: 'fn-pedir-favor-b1' },
      { lesson: 'fn-pedir-objetos-b1' },
      { practice: true },
      { lesson: 'fn-responder-orden-b1' },
      { lesson: 'fn-rechazar-b1' },
      { lesson: 'fn-ordenar-directo-b1' },
      { lesson: 'impneg' },
      { lesson: 'fn-prohibir-b1' },
      { lesson: 'fn-obligacion-necesidad-b1' },
      { lesson: 'fn-habilidad-b1' },
      { lesson: 'task-b1-pedir' },
    ] },

  { unit: 'b1-u33', band: 'B1', title: 'Good feelings',
    goal: 'I can express pleasure, pride and affection at the right intensity.',
    canDo: ['express joy, pride and affection',
            'intensify without sounding sarcastic',
            'say I am glad for someone',
            'express amusement'],
    days: [
      { lesson: 'fn-contento-encantado-b1' },
      { lesson: 'fn-me-alegro-b1' },
      { lesson: 'fn-placer-diversion-b1' },
      { lesson: 'fn-admiracion-orgullo-b1' },
      { practice: true },
      { lesson: 'fn-afecto-b1' },
      { lesson: 'fn-tristeza-afliccion-b1' },
      { lesson: 'fn-me-duele-b1' },
      { lesson: 'task-b1-alegria' },
    ] },

  { unit: 'b1-u34', band: 'B1', title: 'When it goes wrong',
    goal: 'I can express anger, worry and indifference — and calm someone else down.',
    canDo: ['express anger and indignation',
            'express fear and worry',
            'express boredom and indifference',
            'calm and reassure someone'],
    days: [
      { lesson: 'fn-enfado-indignacion-b1' },
      { lesson: 'fn-miedo-ansiedad-preocupacion-b1' },
      { lesson: 'fn-aversion-b1' },
      { lesson: 'fn-aburrimiento-b1' },
      { practice: true },
      { lesson: 'fn-no-me-importa-b1' },
      { lesson: 'fn-sorpresa-extraneza-b1' },
      { lesson: 'fn-empatia-b1' },
      { lesson: 'fn-tranquilizar-consolar-b1' },
      { lesson: 'fn-animar-b1' },
      { lesson: 'task-b1-enfado' },
    ] },

  { unit: 'b1-u35', band: 'B1', title: 'Likes and how you are',
    goal: 'I can talk about liking what other people do, and how I am feeling.',
    canDo: ['use me gusta que + subjunctive',
            'compare two preferences',
            'describe physical sensations',
            'ask and answer how things are going'],
    days: [
      { lesson: 'fn-expresar-gustos-b1' },
      { lesson: 'fn-preguntar-gustos-b1' },
      { lesson: 'fn-preferencia-b1' },
      { lesson: 'fn-preguntar-preferencias-b1' },
      { practice: true },
      { lesson: 'fn-sensaciones-fisicas-b1' },
      { lesson: 'fn-preguntar-estado-animo-b1' },
      { lesson: 'fn-responder-estado-b1' },
      { lesson: 'task-b1-gustos' },
    ] },

  { unit: 'b1-u36', band: 'B1', title: 'Telling a longer story',
    goal: 'I can tell a story that reaches back before its own beginning.',
    canDo: ['use the pluperfect for an earlier past',
            'structure a story in five parts',
            'open, develop and close a narrative',
            'keep track of who is who'],
    days: [
      { lesson: 'gr-pluscuamperfecto-b1' },
      { lesson: 'gn-narrar-estructura-b1' },
      { lesson: 'fn-introducir-tema-relato-b1' },
      { lesson: 'fn-introducir-hecho-b1' },
      { practice: true },
      { lesson: 'fn-concluir-relato-b1' },
      { lesson: 'dc-marcadores-discurso-b1' },
      { lesson: 'dc-mantenimiento-referente-b1' },
      { lesson: 'task-b1-relato' },
    ] },

  { unit: 'b1-u37', band: 'B1', title: 'Holding a conversation',
    goal: 'I can keep a long conversation going without taking it over.',
    canDo: ['signal that I am listening',
            'interrupt without hijacking',
            'hold the floor and hand it back',
            'handle a transactional phone call'],
    days: [
      { lesson: 'fn-seguir-relato-interes-b1' },
      { lesson: 'fn-interrumpir-b1' },
      { lesson: 'fn-controlar-atencion-b1' },
      { lesson: 'fn-has-oido-b1' },
      { practice: true },
      { lesson: 'fn-conocimiento-desconocimiento-b1' },
      { lesson: 'gn-llamada-transaccional-b1' },
      { lesson: 'fn-preguntar-persona-telefono-b1' },
      { lesson: 'fn-pedir-informacion-b1' },
      { lesson: 'dc-valores-ilocutivos-b1' },
      { lesson: 'task-b1-conversar' },
    ] },

  { unit: 'b1-u38', band: 'B1', title: 'Describing at length',
    goal: 'I can sustain a description for a paragraph.',
    canDo: ['use que, quien and donde',
            'identify with a relative clause',
            'describe a person, a place and an object at B1 depth',
            'add detail without starting a new sentence'],
    days: [
      { lesson: 'gr-relativas-b1' },
      { lesson: 'gr-adverbios-relativos-b1' },
      { lesson: 'fn-identificar-b1' },
      { lesson: 'gn-describir-persona-b1' },
      { practice: true },
      { lesson: 'gn-describir-lugar-b1' },
      { lesson: 'gn-describir-objeto-b1' },
      { lesson: 'gr-pronombres-combinados-b1' },
      { lesson: 'task-b1-describir' },
    ] },

  { unit: 'b1-u39', band: 'B1', title: 'Joining ideas up',
    goal: 'I can link ideas by cause, result, concession and comparison.',
    canDo: ['give causes and results',
            'concede with aunque, indicative or subjunctive',
            'compare with igual de and más de',
            'use soler, volver a, dejar de'],
    days: [
      { lesson: 'gr-causales-b1' },
      { lesson: 'gr-consecutivas-b1' },
      { lesson: 'gr-concesivas-b1' },
      { lesson: 'gr-comparativas-b1' },
      { practice: true },
      { lesson: 'gr-perifrasis-verbales-b1' },
      { lesson: 'task-b1-unir' },
    ] },

  { unit: 'b1-u40', band: 'B1', title: 'Courtesy and celebrations',
    goal: 'I can handle the social moments where the formula is visible.',
    canDo: ['congratulate and respond',
            'wish someone well and propose a toast',
            'apologise with a reason and respond',
            'reproach gently'],
    days: [
      { lesson: 'fn-felicitar-b1' },
      { lesson: 'fn-responder-felicitaciones-b1' },
      { lesson: 'fn-buenos-deseos-b1' },
      { lesson: 'fn-brindis-b1' },
      { practice: true },
      { lesson: 'fn-saludar-responder-b1' },
      { lesson: 'fn-disculparse-b1' },
      { lesson: 'fn-responder-disculpa-b1' },
      { lesson: 'fn-reprochar-b1' },
      { lesson: 'fn-advertir-b1' },
      { lesson: 'task-b1-cortesia' },
    ] },

  { unit: 'b1-u41', band: 'B1', title: 'Writing at length',
    goal: 'I can write a composition with a thesis, a development and a conclusion.',
    canDo: ['structure an argument across four paragraphs',
            'raise and answer a counter-argument',
            'write a personal letter and a public talk',
            'close a written text properly'],
    days: [
      { lesson: 'gn-composicion-escrita-b1' },
      { lesson: 'gn-exponer-tema-b1' },
      { lesson: 'gn-carta-personal-b1' },
      { lesson: 'gn-presentacion-publica-b1' },
      { practice: true },
      { lesson: 'fn-despedida-escrita-b1' },
      { lesson: 'fn-destacar-elemento-b1' },
      { lesson: 'gn-generos-escritos-b1' },
      { lesson: 'task-b1-escribir' },
    ] },

  { unit: 'b1-u42', band: 'B1', title: 'If things had been different',
    goal: 'I can talk about what is not the case, and what would have been.',
    canDo: ['use si + imperfect subjunctive + conditional',
            'use si + pluperfect subjunctive + conditional perfect',
            'match the tenses across the comma',
            'use the imperative beyond the order'],
    days: [
      { lesson: 'impsubj' },
      { lesson: 'futperf' },
      { lesson: 'condperf' },
      { lesson: 'perfsubj' },
      { practice: true },
      { lesson: 'gr-imperativo-valores-b1' },
      { lesson: 'task-b1-hipotesis' },
    ] },

  /* ---- B2 · 169 days · starts at index 387 ------------------------------- */
  { band: 'B2' },
  { lesson: 'gr-que-explicativo-b2' },                  // gram  "Que" explicativo: la coma que añade, no que elige
  { lesson: 'gr-adverbios-enunciacion-b2' },            // gram  Adverbios de enunciación: comentar sobre las propias palab
  { lesson: 'gr-adverbios-frecuencia-topico-b2' },      // gram  Adverbios de frecuencia y el adverbio-tópico
  { lesson: 'gr-adverbios-evaluativos-b2' },            // gram  Adverbios evaluativos: un comentario sobre toda la frase
  { lesson: 'gr-adverbios-nucleares-b2' },              // gram  Adverbios: combinaciones, cuantificadores y equivalencia a
  { practice: true },
  { lesson: 'gr-nucleo-verbal-copulativos-b2' },        // gram  Auxiliares, copulativos y pseudocopulativos avanzados
  { lesson: 'gr-complementos-sa-b2' },                  // gram  Complementos del adjetivo: difícil de, interesado en
  { lesson: 'gr-complementos-nominales-b2' },           // gram  Complementos del nombre: ambiguos, no restrictivos, y sus 
  { lesson: 'nt-acontecimiento-b2' },                   // noti  Acontecimiento: ocurrir, casualidad, suspender
  { lesson: 'fn-aconsejar-b2' },                        // func  Aconsejar, advertir y amenazar
  { practice: true },
  { lesson: 'gr-concordancia-sn-verbo-b2' },            // gram  Concordancia del sujeto con el verbo: los casos difíciles
  { lesson: 'nt-adecuacion-b2' },                       // noti  Adecuación: adaptarse, apropiado
  { lesson: 'dc-atenuacion-b2' },                       // disc  Cortesía atenuadora en B2: desplazar la persona, aplazar e
  { lesson: 'gn-argumentativa-b2' },                    // genr  Argumentar en B2: tesis, fuente, contraargumentación, rese
  { lesson: 'nt-anticipacion-b2' },                     // noti  Anticipación: adelantar, con tiempo, por adelantado
  { practice: true },
  { lesson: 'fn-agradecer-b2' },                        // func  Agradecer y desear
  { lesson: 'gr-relativo-donde-b2' },                   // gram  Donde como relativo: lugares sin repetir "en el que"
  { lesson: 'nt-audibilidad-audicion-b2' },             // noti  Audibilidad: sonar, a gritos, a todo volumen
  { lesson: 'fn-dar-informacion-b2' },                  // func  Dar información: corregir con matiz, modo y finalidad
  { lesson: 'nt-aumento-disminucion-b2' },              // noti  Aumento y disminución: crecer, duplicarse, cada vez más
  { practice: true },
  { lesson: 'gr-articulo-definido-valores-b2' },        // gram  El artículo definido: valor genérico y "lo" sustantivador
  { lesson: 'nt-cantidad-numerica-b2' },                // noti  Cantidad numérica: cifras, índices, "número + de"
  { lesson: 'dc-perspectiva-temporal-b2' },             // disc  Desplazar el tiempo verbal: presente, futuro de probabilid
  { lesson: 'gn-descriptiva-lugares-b2' },              // genr  Describir lugares en B2: de la planta a la anécdota
  { lesson: 'fn-dar-opinion-b2' },                      // func  Opinar y valorar: darla, pedirla, matizarla
  { practice: true },
  { lesson: 'nt-cantidad-relativa-b2' },                // noti  Cantidad relativa: aproximar sin comprometerse
  { lesson: 'gr-articulo-indefinido-valores-b2' },      // gram  El artículo indefinido: restricciones sutiles
  { lesson: 'nt-capacidad-competencia-b2' },            // noti  Capacidad y competencia: dársele bien, ser capaz de
  { lesson: 'fn-disculparse-b2' },                      // func  Disculparse y responder a una disculpa
  { lesson: 'nt-certeza-b2' },                          // noti  Certeza e incertidumbre: el vocabulario, más allá del modo
  { practice: true },
  { lesson: 'gr-condicional-compuesto-b2' },            // gram  El condicional compuesto: habría + participio
  { lesson: 'nt-color-b2' },                            // noti  Color: tonos compuestos, ser de color, en blanco y negro
  { lesson: 'fn-expresar-certeza-b2' },                 // func  Certeza, duda y escepticismo
  { lesson: 'dc-entonacion-b2' },                       // disc  Entonación y alargamientos: lo que dice el tono
  { lesson: 'gn-descriptiva-objetos-b2' },              // genr  Describir objetos en B2: del tomate al desarrollo formal
  { practice: true },
  { lesson: 'nt-consistencia-resistencia-b2' },         // noti  Consistencia y resistencia: denso, frágil, resistente a
  { lesson: 'fn-acuerdo-b2' },                          // func  Acuerdo y desacuerdo: de "sin ninguna duda" a "en absoluto
  { lesson: 'gr-futuro-perfecto-b2' },                  // gram  El futuro perfecto: habré + participio
  { lesson: 'nt-correccion-precision-b2' },             // noti  Corrección y precisión: fallo, exacto, verlo claro
  { lesson: 'nt-cualidad-general-b2' },                 // noti  Cualidad general: propiedades, categorías, composición
  { practice: true },
  { lesson: 'fn-alegria-satisfaccion-b2' },             // func  Alegría, placer, afecto y orgullo
  { lesson: 'nt-disponibilidad-b2' },                   // noti  Disponibilidad: agotarse, contar con, estar listo
  { lesson: 'gr-imperativo-valores-b2' },               // gram  El imperativo: valores más allá de la orden
  { lesson: 'dc-focalizacion-b2' },                     // disc  Focalizar en B2: reduplicación del pronombre y ecos
  { lesson: 'gn-descriptiva-personas-b2' },             // genr  Describir personas en B2: anclaje, aspectualización, puest
  { practice: true },
  { lesson: 'nt-distancia-b2' },                        // noti  Distancia: acercar(se), alejar(se), a distancia
  { lesson: 'fn-expresar-alivio-b2' },                  // func  Alivio, esperanza y resignación
  { lesson: 'nt-edad-vejez-b2' },                       // noti  Edad y vejez: recién + participio, fresco/podrido, estrena
  { lesson: 'gr-impsubj-valores-b2' },                  // gram  El imperfecto de subjuntivo: más allá del "si tuviera"
  { lesson: 'fn-aprobacion-desaprobacion-b2' },         // func  Aprobar, desaprobar y reprochar
  { practice: true },
  { lesson: 'nt-peso-b2' },                             // noti  El peso: tonelada, carga, pesarse
  { lesson: 'nt-evaluacion-general-b2' },               // noti  Evaluación general: salirle/irle algo a alguien, valer la 
  { lesson: 'gr-orden-interrogativos-b2' },             // gram  El orden en las preguntas: lo que puede moverse
  { lesson: 'dc-intensificacion-b2' },                  // disc  Intensificar en B2: prefijos, verbos performativos, alarga
  { lesson: 'gn-expositiva-b2' },                       // genr  Exponer un tema en B2: presentar, desarrollar, concluir
  { practice: true },
  { lesson: 'fn-conocimiento-b2' },                     // func  Saber, no saber y confirmar
  { lesson: 'nt-existencia-b2' },                       // noti  Existencia e inexistencia: crear, eliminar, provocar
  { lesson: 'nt-exito-logro-b2' },                      // noti  Éxito y logro: triunfar, fracasar, llegar a ser
  { lesson: 'gr-perfsubj-valores-b2' },                 // gram  El pretérito perfecto de subjuntivo: haya + participio
  { lesson: 'fn-deseos-b2' },                           // func  Deseos, gustos, preferencias y planes
  { practice: true },
  { lesson: 'nt-expresion-verbal-b2' },                 // noti  Expresión verbal: variar el verbo de habla más allá de "de
  { lesson: 'nt-facilidad-b2' },                        // noti  Facilidad y dificultad: complejo, facilitar, con facilidad
  { lesson: 'fn-empatia-b2' },                          // func  Consolar, animar y acompañar
  { lesson: 'gr-pluscuamsubj-b2' },                     // gram  El pretérito pluscuamperfecto de subjuntivo: hubiera/hubie
  { lesson: 'dc-deixis-b2' },                           // disc  La deixis en B2: pronombre enfático, "se" mitigador
  { practice: true },
  { lesson: 'gn-generos-escritos-b2' },                 // genr  Géneros escritos en B2: cartas al director, informes, biog
  { lesson: 'nt-formas-figuras-b2' },                   // noti  Formas y figuras: geometría cotidiana
  { lesson: 'fn-enfado-indignacion-b2' },               // func  Enfado, hartazgo y aversión
  { lesson: 'nt-generalidad-especificidad-b2' },        // noti  Generalidad y especificidad: concretar, particular, en gen
  { lesson: 'gr-pronombre-personal-b2' },               // gram  El pronombre personal: se accidental y la jerarquía de clí
  { practice: true },
  { lesson: 'nt-grado-b2' },                            // noti  Grado: intensificadores más allá de "muy"
  { lesson: 'fn-falta-obligacion-b2' },                 // func  Expresar falta de obligación: no hace falta que...
  { lesson: 'nt-humedad-sequedad-b2' },                 // noti  Humedad y sequedad: empapado, transpirar, en seco
  { lesson: 'dc-valores-ilocutivos-b2' },               // disc  Lo que hace una pregunta en B2: dudas, ecos y retóricas
  { lesson: 'gn-generos-orales-b2' },                   // genr  Géneros orales en B2: qué debes entender, qué debes produc
  { practice: true },
  { lesson: 'gr-el-que-relativos-b2' },                 // gram  El que, la que, los que, las que: el relativo tras preposi
  { lesson: 'nt-importancia-normalidad-b2' },           // noti  Importancia y normalidad: dar lo mismo, por norma
  { lesson: 'fn-habilidad-b2' },                        // func  Habilidad: se me da bien, soy un negado
  { lesson: 'nt-interes-b2' },                          // noti  Interés: motivación, aburrir, centro de interés
  { lesson: 'gr-formas-no-personales-b2' },             // gram  Infinitivo, gerundio y participio: valores avanzados
  { practice: true },
  { lesson: 'nt-limpieza-b2' },                         // noti  Limpieza: mancha, ensuciar, limpiar a fondo
  { lesson: 'fn-miedo-ansiedad-b2' },                   // func  Miedo, nervios y vergüenza
  { lesson: 'nt-localizacion-b2' },                     // noti  Localización: situado, quedar, hallarse
  { lesson: 'dc-mantenimiento-referente-b2' },          // disc  Mantener el referente: elipsis, sinónimos, hiperónimos
  { lesson: 'gn-carta-solicitud-trabajo-b2' },          // genr  La carta de solicitud de trabajo
  { practice: true },
  { lesson: 'gr-exclamativos-b2' },                     // gram  Los exclamativos: qué, cómo, cuánto y quién
  { lesson: 'fn-posibilidad-b2' },                      // func  Expresar posibilidad: el futuro y condicional de conjetura
  { lesson: 'nt-materia-b2' },                          // noti  Materia: estar fabricado con, contener un ingrediente
  { lesson: 'nt-movimiento-estabilidad-b2' },           // noti  Movimiento y estabilidad: un verbo por cada fase
  { lesson: 'fn-expresar-recordar-b2' },                // func  Recordar y olvidar: me acuerdo, me suena, ni idea
  { practice: true },
  { lesson: 'gr-posesivos-b2' },                        // gram  Los posesivos: forma tónica, fórmulas fijas
  { lesson: 'nt-necesidad-contingencia-b2' },           // noti  Necesidad y azar: imprescindible, inevitablemente, por cas
  { lesson: 'nt-orden-b2' },                            // noti  Orden: puesto, colocado/descolocado, por orden
  { lesson: 'fn-sensaciones-fisicas-b2' },              // func  Expresar sensaciones físicas: pasar hambre/frío, me agota
  { lesson: 'dc-marcadores-discurso-b2' },              // disc  Marcadores del discurso B2: contraargumentativos y reformu
  { practice: true },
  { lesson: 'gn-composicion-argumentativa-b2' },        // genr  La composición argumentativa (B2)
  { lesson: 'gr-nombres-escuetos-b2' },                 // gram  Nombres escuetos: sin artículo, con reglas propias
  { lesson: 'nt-orientacion-direccion-b2' },            // noti  Orientación y dirección: dirigirse a, empujar/tirar, a dom
  { lesson: 'nt-origen-b2' },                           // noti  Origen: raíz, procedencia, proceder de
  { lesson: 'fn-sorpresa-extraneza-b2' },               // func  Expresar sorpresa: qué raro que, no puede ser
  { practice: true },
  { lesson: 'gr-cuantificadores-numerales-cualquier-b2' },// gram  Numerales partitivos/multiplicativos y cualquier/cualquier
  { lesson: 'nt-permanencia-b2' },                      // noti  Permanencia: estable, fijo, sobrevivir
  { lesson: 'fn-tristeza-afliccion-b2' },               // func  Tristeza, decepción y arrepentimiento
  { lesson: 'nt-posicion-absoluta-b2' },                // noti  Posición absoluta: tumbado, de rodillas, del revés
  { lesson: 'dc-negacion-b2' },                         // disc  Matices de la negación: reiterada, enfática, artificiosa
  { practice: true },
  { lesson: 'gn-llamada-transaccional-b2' },            // genr  La llamada telefónica transaccional (B2): una cadena más l
  { lesson: 'gr-subordinadas-lugar-b2' },               // gram  Oraciones subordinadas de lugar: donde con indicativo o su
  { lesson: 'nt-posicion-relativa-b2' },                // noti  Posición relativa: delantero/trasero, a lo largo de, al ot
  { lesson: 'fn-identificar-b2' },                      // func  Identificar: el/los que, lo de, se trata de
  { lesson: 'nt-presencia-ausencia-b2' },               // noti  Presencia y ausencia: asistir, faltar, a la vista
  { practice: true },
  { lesson: 'nt-proporcion-b2' },                       // noti  Proporción: partir, repartir, la sexta parte
  { lesson: 'gr-subordinadas-modo-b2' },                // gram  Oraciones subordinadas de modo: como y según
  { lesson: 'fn-introducir-nuevo-tema-b2' },            // func  Manejar el tema: introducirlo, interrumpir, cerrarlo
  { lesson: 'nt-realidad-ficcion-b2' },                 // noti  Realidad y ficción: inventar, simular, cumplirse
  { lesson: 'dc-significados-interpretados-b2' },       // disc  Metáforas fijas: comparaciones con animales y verbos de ca
  { practice: true },
  { lesson: 'gn-narrativa-b2' },                        // genr  La macrofunción narrativa en B2: las cinco etapas del rela
  { lesson: 'fn-pedir-ayuda-b2' },                      // func  Pedir: ayuda, favores y cosas — y responder
  { lesson: 'nt-referencias-generales-b2' },            // noti  Referencias temporales: dedicar tiempo, a mediados de, hac
  { lesson: 'gr-numero-sustantivos-b2' },               // gram  Plurales irregulares: invariables, tónicos y léxicos
  { lesson: 'nt-reflexion-conocimiento-b2' },           // noti  Reflexión y conocimiento: ocurrírsele, ser consciente de, 
  { practice: true },
  { lesson: 'fn-pedir-permiso-b2' },                    // func  Permiso y prohibición: pedirlo, darlo, negarlo
  { lesson: 'nt-repeticion-b2' },                       // noti  Repetición: rutina, ciclo, una y otra vez
  { lesson: 'gr-quien-quienes-b2' },                    // gram  Quien / quienes: solo para personas
  { lesson: 'nt-sabor-olor-b2' },                       // noti  Sabor y olor: soso, agridulce, oler a
  { lesson: 'fn-preguntar-persona-telefono-b2' },       // func  Al teléfono y "¿cómo va todo?"
  { practice: true },
  { lesson: 'dc-cita-b2' },                             // disc  Procedimientos de cita: estilo indirecto y citas encubiert
  { lesson: 'gn-presentacion-publica-b2' },             // genr  Una presentación pública (B2)
  { lesson: 'nt-simultaneidad-b2' },                    // noti  Simultaneidad: mientras tanto, a la vez, coincidir
  { lesson: 'gr-subordinadas-relativas-tipos-b2' },     // gram  Relativas: especificativas, explicativas y sus restriccion
  { lesson: 'nt-localizacion-tiempo-b2' },              // noti  Situar en el tiempo: llevar sin, antiguamente, a corto/lar
  { practice: true },
  { lesson: 'fn-proponer-sugerir-b2' },                 // func  Proponer, aceptar, rechazar y suponer
  { lesson: 'nt-textura-acabado-b2' },                  // noti  Textura y acabado: áspero, arrugado, una mano de pintura
  { lesson: 'gr-subordinadas-sustantivas-b2' },         // gram  Subordinadas sustantivas: el verbo principal decide el mod
  { lesson: 'fn-saludar-responder-b2' },                // func  Saludar, despedirse y dar la bienvenida
  { lesson: 'nt-utilidad-uso-b2' },                     // noti  Utilidad y uso: utilizar/emplear, fuera de servicio
  { practice: true },
  { lesson: 'dc-rematizacion-tematizacion-b2' },        // disc  Rematización y tematización en B2: ecuacionales y "lo de"
  { lesson: 'gn-reclamacion-b2' },                      // genr  La carta de reclamación
  { lesson: 'nt-valor-precio-b2' },                     // noti  Valor y precio: invertir, estar en oferta, ganar/perder va
  { lesson: 'gr-complemento-preposicional-regido-b2' }, // gram  Verbos con preposición fija: decidirse a, contar con
  { lesson: 'fn-solicitar-comienzo-relato-b2' },        // func  Contar algo: abrir, seguir y cerrar el relato
  { practice: true },
  { lesson: 'nt-visibilidad-vision-b2' },               // noti  Visibilidad y visión: a simple vista, distinguir, de lejos

  /* ---- C1 · 229 days · starts at index 556 ------------------------------- */
  { band: 'C1' },
  { lesson: 'gr-clases-adjetivos-c1' },                 // gram  Cuyo, los adjetivos de color compuestos y el relacional qu
  { lesson: 'gr-articulo-definido-c1' },                // gram  El artículo definido en C1: valor enfático y sustantivador
  { lesson: 'gr-articulo-indefinido-c1' },              // gram  El artículo indefinido en C1: convertir un nombre propio e
  { lesson: 'gr-genero-sustantivos-c1' },               // gram  El género que cambia el significado: el fruto / la fruta
  { lesson: 'gr-numero-sustantivos-c1' },               // gram  El número en C1: dónde se mueve el acento, qué cambia de s
  { practice: true },
  { lesson: 'gr-demostrativos-c1' },                    // gram  Los demostrativos en C1: proximidad discursiva, condescend
  { lesson: 'gr-exclamativos-c1' },                     // gram  Los exclamativos en C1: cuánto + valorativo, dónde, y el o
  { lesson: 'gr-posesivos-c1' },                        // gram  Los posesivos en C1: cuantificador, sufrimiento, y el "mío
  { lesson: 'gr-nombres-escuetos-c1' },                 // gram  Nombres escuetos: sin artículo, aunque el verbo lo pida
  { lesson: 'nt-acabado-c1' },                          // noti  Acabado en C1: de "en bruto" a "metalizado"
  { practice: true },
  { lesson: 'fn-aceptar-rechazar-propuesta-c1' },       // func  Aceptar y rechazar propuestas en C1: "no te voy a decir qu
  { lesson: 'gr-adverbios-conjuntivos-c1' },            // gram  Adverbios conjuntivos: matizar una coordinación sin ser un
  { lesson: 'nt-accesibilidad-limpieza-c1' },           // noti  Accesibilidad y limpieza en C1: "obstruido" y "estar hecho
  { lesson: 'dc-atenuacion-dialogica-c1' },             // disc  Atenuación dialógica: discrepar sin romper nada
  { lesson: 'gn-argumentativa-c1' },                    // genr  Argumentar: de la cuestión polémica a la reserva final
  { practice: true },
  { lesson: 'fn-aconsejar-advertir-amenazar-c1' },      // func  Aconsejar, advertir y amenazar en C1: "allá tú" cambia de 
  { lesson: 'nt-aceptabilidad-c1' },                    // noti  Aceptabilidad en C1: de "razonable" a "disparate", y "no p
  { lesson: 'nt-acontecimiento-c1' },                   // noti  Acontecimiento en C1: de la odisea al hecho aislado
  { lesson: 'fn-afecto-sensaciones-c1' },               // func  Afecto y sensaciones físicas en C1: "estoy hecho polvo" y 
  { lesson: 'gr-adverbios-externos-c1' },               // gram  Adverbios externos al dictum: el punto de vista que envuel
  { practice: true },
  { lesson: 'nt-adecuacion-c1' },                       // noti  Adecuación en C1: "guardar las formas" y "estar contraindi
  { lesson: 'nt-anterioridad-c1' },                     // noti  Anterioridad en C1: precedentes, antepasados y "de anteman
  { lesson: 'fn-agradecer-pesame-c1' },                 // func  Agradecer y dar el pésame en C1: "¿qué haría yo sin ti?" y
  { lesson: 'nt-anticipacion-c1' },                     // noti  Anticipación en C1: prever, predecir y "por anticipado"
  { lesson: 'dc-atenuacion-c1' },                       // disc  Atenuación: decirlo sin señalar a nadie
  { practice: true },
  { lesson: 'gn-narrativa-c1' },                        // genr  Contar una anécdota: las cinco etapas
  { lesson: 'fn-arrepentimiento-verguenza-c1' },        // func  Arrepentimiento y vergüenza en C1: "si volviera a nacer...
  { lesson: 'gr-adverbios-nucleares-c1' },              // gram  Adverbios nucleares en C1: dónde va el modo, y por qué
  { lesson: 'nt-atractivo-calidad-c1' },                // noti  Atractivo y calidad en C1: de "apuesto" a "vulgar", de "de
  { lesson: 'nt-audibilidad-audicion-c1' },             // noti  Audibilidad y audición en C1: de "susurro" a "dar gritos"
  { practice: true },
  { lesson: 'fn-certeza-evidencia-c1' },                // func  Certeza y su ausencia en C1: de "sin lugar a dudas" a "jur
  { lesson: 'nt-aumento-disminucion-c1' },              // noti  Aumento y disminución en C1: de "ir en aumento" a "dispara
  { lesson: 'gr-complementos-adjetival-c1' },           // gram  Complementos del adjetivo en C1: interrogativas, superlati
  { lesson: 'nt-cambio-c1' },                           // noti  Cambio en C1: transiciones, transformaciones y verbos deri
  { lesson: 'fn-confirmar-informacion-previa-c1' },     // func  Confirmar información previa en C1: "así es", "¡y tanto!" 
  { practice: true },
  { lesson: 'nt-cantidad-numerica-c1' },                // noti  Cantidad numérica en C1: calcular "por lo alto" o "por lo 
  { lesson: 'dc-estilo-indirecto-c1' },                 // disc  Estilo indirecto: el verbo que interpreta
  { lesson: 'gn-descriptiva-personas-c1' },             // genr  Describir a una persona: anclar, detallar, relacionar
  { lesson: 'fn-conocimiento-desconocimiento-c1' },     // func  Conocimiento y desconocimiento en C1: de "¿te has enterado
  { lesson: 'nt-cantidad-relativa-c1' },                // noti  Cantidad relativa en C1: colectivos, porciones y cantidade
  { practice: true },
  { lesson: 'gr-complementos-nominal-c1' },             // gram  Complementos del nombre en C1: la ambigüedad como norma
  { lesson: 'nt-capacidad-competencia-c1' },            // noti  Capacidad y competencia en C1: ser "un hacha" o "un manaza
  { lesson: 'fn-dar-informacion-c1' },                  // func  Dar información en C1: de las subordinadas de lugar a "¡¿C
  { lesson: 'nt-certeza-incertidumbre-c1' },            // noti  Certeza e incertidumbre en C1: de "cabe la posibilidad" a 
  { lesson: 'nt-color-c1' },                            // noti  Color en C1: matices, gamas y verbos que cambian el color
  { practice: true },
  { lesson: 'fn-orden-instruccion-c1' },                // func  Dar una orden en C1: de "tú te callas" a la orden encubier
  { lesson: 'gr-complementos-verbales-c1' },            // gram  Complementos verbales en C1: leísmo, laísmo, loísmo y el p
  { lesson: 'nt-conformidad-c1' },                      // noti  Conformidad en C1: "hacer la vista gorda" y "no quedar más
  { lesson: 'dc-focalizacion-c1' },                     // disc  Focalizar en C1: el artículo que exclama, la dislocación q
  { lesson: 'gn-descriptiva-lugares-c1' },              // genr  Describir un lugar: de fuera adentro, con un porqué
  { practice: true },
  { lesson: 'fn-decepcion-resignacion-c1' },            // func  Decepción y resignación en C1: "¡vaya, hombre!" y "que sea
  { lesson: 'nt-consistencia-resistencia-c1' },         // noti  Consistencia y resistencia en C1: "fuerte como un roble", 
  { lesson: 'nt-continuacion-c1' },                     // noti  Continuación en C1: retomar, perseverar y "sin cesar"
  { lesson: 'fn-deseos-planes-c1' },                    // func  Deseos y planes en C1: "¡quién tuviera...!" y "estoy por..
  { lesson: 'gr-concordancia-oracional-c1' },           // gram  Concordancia ad sensum en C1: cuando el sentido gana a la 
  { practice: true },
  { lesson: 'nt-correccion-c1' },                       // noti  Corrección en C1: de "un acierto" a "a la perfección"
  { lesson: 'fn-destacar-silencio-tema-cierre-c1' },    // func  Destacar, pedir silencio, cambiar de tema y cerrar en C1
  { lesson: 'nt-cualidad-general-c1' },                 // noti  Cualidad general en C1: naturaleza, apariencia y composici
  { lesson: 'nt-disponibilidad-c1' },                   // noti  Disponibilidad en C1: desde "a mano" hasta "no estar para 
  { lesson: 'dc-deixis-c1' },                           // disc  La deixis en C1: el pronombre que desambigua, el que despe
  { practice: true },
  { lesson: 'gn-descriptiva-objetos-c1' },              // genr  Describir un objeto: del hecho general a la vivencia propi
  { lesson: 'fn-disculparse-responder-c1' },            // func  Disculparse y responder en C1: "mil perdones" y "por esta 
  { lesson: 'gr-cuantificadores-propios-c1' },          // gram  Cuantificadores propios en C1: cuanto, cada uno, cualquier
  { lesson: 'nt-distancia-c1' },                        // noti  Distancia en C1: de "manzanas" a "acortar distancias"
  { lesson: 'nt-distancia-velocidad-c1' },              // noti  Distancia y velocidad en C1: del "año luz" al "exceso de v
  { practice: true },
  { lesson: 'fn-empatia-alivio-esperanza-c1' },         // func  Empatía, alivio y esperanza en C1: "me pongo en tu lugar" 
  { lesson: 'nt-duracion-transcurso-c1' },              // noti  Duración en C1: de lo "fugaz" a lo "perpetuo"
  { lesson: 'gr-imperativo-c1' },                       // gram  El imperativo en C1: cuando no manda nada
  { lesson: 'fn-escepticismo-contraargumento-c1' },     // func  Escepticismo y contraargumento en C1: "no te falta razón, 
  { lesson: 'nt-edad-vejez-c1' },                       // noti  Edad y vejez en C1: novato, veterano y "no pasar los años 
  { practice: true },
  { lesson: 'dc-mantenimiento-referente-c1' },          // disc  Mantener el referente: proformas globalizadoras
  { lesson: 'gn-argumentativa-conectores-c1' },         // genr  El repertorio del ensayo argumentativo
  { lesson: 'nt-evaluacion-general-c1' },               // noti  Evaluación general en C1: de "pasable" a "catastrófico"
  { lesson: 'fn-expresar-acuerdo-c1' },                 // func  Expresar acuerdo en C1: de "algo de razón tienes" a "¡exac
  { lesson: 'nt-existencia-inexistencia-c1' },          // noti  Existencia e inexistencia en C1: nacer, formarse y dejar d
  { practice: true },
  { lesson: 'gr-nucleo-verbal-c1' },                    // gram  El núcleo del sintagma verbal en C1: pasivas, perífrasis y
  { lesson: 'nt-exito-logro-c1' },                      // noti  Éxito y logro en C1: de "estar en pleno auge" a "ganar por
  { lesson: 'fn-aprobacion-desaprobacion-c1' },         // func  Expresar aprobación y desaprobación en C1: de "apruebo" a 
  { lesson: 'nt-expresion-verbal-c1' },                 // noti  Expresión verbal en C1: de "dejar caer" a "poner algo en c
  { lesson: 'fn-expresar-desacuerdo-c1' },              // func  Expresar desacuerdo en C1: de "no me convence" a "¡de eso 
  { practice: true },
  { lesson: 'nt-facilidad-c1' },                        // noti  Facilidad en C1: "fácil de entender" y los verbos que faci
  { lesson: 'gr-pronombre-personal-c1' },               // gram  El pronombre personal en C1: desambiguar, personificar, la
  { lesson: 'dc-reformuladores-c1' },                   // disc  Reformuladores: volver a decirlo mejor
  { lesson: 'gn-trabajo-academico-c1' },                // genr  El trabajo académico: de lo general a lo no resuelto
  { lesson: 'nt-finalizacion-c1' },                     // noti  Finalización en C1: caducar, vencer y "acabar por volverme
  { practice: true },
  { lesson: 'fn-habilidad-c1' },                        // func  Expresar habilidad en C1: de "soy un hacha" a "soy patoso 
  { lesson: 'nt-formas-figuras-c1' },                   // noti  Formas y figuras en C1: de la "silueta" al "zigzag"
  { lesson: 'nt-frecuencia-c1' },                       // noti  Frecuencia en C1: de "rara vez" a "el pan de cada día"
  { lesson: 'fn-felicitar-despedirse-c1' },             // func  Felicitar y despedirse en C1: "estás de enhorabuena" y "si
  { lesson: 'gr-formas-no-personales-c1' },             // gram  Formas no personales en C1: infinitivo, gerundio y partici
  { practice: true },
  { lesson: 'nt-generalidad-especificidad-c1' },        // noti  Generalidad y especificidad en C1: de "por lo general" a "
  { lesson: 'fn-hipotesis-posibilidad-c1' },            // func  Formular hipótesis y expresar posibilidad en C1: "¿y si...
  { lesson: 'nt-grado-c1' },                            // noti  Grado en C1: de "lo grande que es" a "por todo lo alto"
  { lesson: 'dc-citas-encubiertas-c1' },                // disc  Citas encubiertas: decirlo sin responder de ello
  { lesson: 'gn-expositiva-c1' },                       // genr  Exponer un tema: presentar, desarrollar, concluir
  { practice: true },
  { lesson: 'nt-humedad-sequedad-c1' },                 // noti  Humedad y sequedad en C1: "ponerse como una sopa" y cocina
  { lesson: 'fn-gustos-aversion-c1' },                  // func  Gustos y aversión en C1: de "adoro" a "me da náuseas"
  { lesson: 'gr-interrogativos-c1' },                   // gram  Los interrogativos en C1: cuándo se separan, cuándo se coo
  { lesson: 'nt-importancia-c1' },                      // noti  Importancia en C1: de "trascendencia" a "importarle un pim
  { lesson: 'fn-hartazgo-enfado-c1' },                  // func  Hartazgo y enfado en C1: "hasta la coronilla" y "de un hum
  { practice: true },
  { lesson: 'nt-inicio-c1' },                           // noti  Inicio en C1: de "dar comienzo" a "¡manos a la obra!"
  { lesson: 'nt-interes-c1' },                          // noti  Interés en C1: de "apasionante" a "morirse de aburrimiento
  { lesson: 'gr-relativos-c1' },                        // gram  Relativos en C1: el cual, quien, y el "que" que rechaza un
  { lesson: 'fn-identificar-c1' },                      // func  Identificar en C1: "el que suscribe" y las hendidas "lo qu
  { lesson: 'nt-localizacion-c1' },                     // noti  Localización en C1: ubicar, situar y "en paradero desconoc
  { practice: true },
  { lesson: 'dc-imperfecto-modal-c1' },                 // disc  El imperfecto que no habla del pasado
  { lesson: 'gn-generos-escritos-c1' },                 // genr  Géneros escritos en C1: el informe extenso y la reseña pro
  { lesson: 'nt-localizacion-futuro-c1' },              // noti  Localizar en el futuro en C1: "de un momento a otro" y "a 
  { lesson: 'fn-introducir-relato-atencion-c1' },       // func  Introducir un relato y controlar la atención en C1: "¿me s
  { lesson: 'nt-localizacion-pasado-c1' },              // noti  Localizar en el pasado en C1: eras, herencia y "en tiempos
  { practice: true },
  { lesson: 'gr-sub-adv-causales-c1' },                 // gram  Subordinadas causales en C1: énfasis con "porque" antepues
  { lesson: 'fn-miedo-nerviosismo-c1' },                // func  Miedo y nerviosismo en C1: "el corazón en un puño" y "los 
  { lesson: 'nt-localizacion-presente-c1' },            // noti  Localizar en el presente en C1: actualidad, tendencia y "e
  { lesson: 'nt-movimiento-locuciones-c1' },            // noti  Locuciones de movimiento en C1: de "dar marcha atrás" a "i
  { lesson: 'fn-obligacion-necesidad-c1' },             // func  Obligación y necesidad en C1: de "es mi obligación" a "bas
  { practice: true },
  { lesson: 'nt-materia-c1' },                          // noti  Materia en C1: de la seda al cartón piedra
  { lesson: 'dc-indefinido-perfecto-c1' },              // disc  Indefinido o perfecto: acercar y alejar lo ocurrido
  { lesson: 'gn-generos-orales-c1' },                   // genr  Géneros orales en C1: intervenir en tu especialidad
  { lesson: 'gr-sub-adv-comparativas-c1' },             // gram  Subordinadas comparativas en C1: cuatro comparaciones con 
  { lesson: 'nt-medidas-generales-tamano-c1' },         // noti  Medidas generales, talla y tamaño en C1: de "a ojo" a "gig
  { practice: true },
  { lesson: 'fn-pedir-confirmacion-c1' },               // func  Pedir confirmación en C1: de "¿a que sí?" a "tengo entendi
  { lesson: 'nt-movimiento-estabilidad-sustantivos-c1' },// noti  Movimiento y estabilidad en C1: nombrar el tipo de movimie
  { lesson: 'fn-favor-objetos-ayuda-c1' },              // func  Pedir favores, objetos y ayuda en C1: la misma escalera de
  { lesson: 'nt-necesidad-obligacion-c1' },             // noti  Necesidad, contingencia y obligación en C1: de lo prescind
  { lesson: 'gr-sub-adv-concesivas-c1' },               // gram  Subordinadas concesivas en C1: reduplicación universal, po
  { practice: true },
  { lesson: 'nt-normalidad-c1' },                       // noti  Normalidad en C1: de lo "convencional" a "un fuera de seri
  { lesson: 'fn-pedir-informacion-c1' },                // func  Pedir información en C1: de "¿qué es lo que...?" a "¿me pe
  { lesson: 'nt-olor-c1' },                             // noti  Olor en C1: de "fragancia" a "peste"
  { lesson: 'dc-intensificacion-c1' },                  // disc  Intensificar en C1: sufijos, entonación suspendida, el "qu
  { lesson: 'gn-carta-comercial-c1' },                  // genr  La carta comercial: atención, interés, deseo, acción
  { practice: true },
  { lesson: 'nt-orden-c1' },                            // noti  Orden en C1: series, secuencias y "por orden de prioridad"
  { lesson: 'fn-pedir-dar-opinion-c1' },                // func  Pedir y dar opinión en C1: "a mi entender" y "en mi modest
  { lesson: 'gr-sub-adv-condicionales-c1' },            // gram  Subordinadas condicionales en C1: registros, matices y la 
  { lesson: 'nt-orientacion-direccion-c1' },            // noti  Orientación y dirección en C1: "con rumbo a" y "sin rumbo 
  { lesson: 'fn-permiso-prohibicion-c1' },              // func  Permiso y prohibición en C1: "eso ni se pregunta" y "digas
  { practice: true },
  { lesson: 'nt-origen-c1' },                           // noti  Origen en C1: la "semilla" y la "raíz" de las cosas
  { lesson: 'nt-permanencia-c1' },                      // noti  Permanencia en C1: lo imborrable, lo inalterable y "conser
  { lesson: 'gr-sub-adv-consecutivas-c1' },             // gram  Subordinadas consecutivas en C1: intensidad, suspensión y 
  { lesson: 'fn-preferencia-indiferencia-c1' },         // func  Preferencia e indiferencia en C1: "no cambio... por nada d
  { lesson: 'dc-valores-ilocutivos-c1' },               // disc  Lo que hace una pregunta en C1: saludo, crítica, eco recap
  { practice: true },
  { lesson: 'gn-carta-reclamacion-c1' },                // genr  La carta de reclamación: motivo, argumento, solución
  { lesson: 'nt-peso-superficie-c1' },                  // noti  Peso y superficie en C1: de "peso bruto" a "de norte a sur
  { lesson: 'nt-posicion-absoluta-c1' },                // noti  Posición absoluta en C1: inclinado, torcido, empinado
  { lesson: 'fn-estado-animo-alegria-c1' },             // func  Preguntar por el ánimo y expresar alegría en C1: "estoy co
  { lesson: 'nt-posicion-relativa-c1' },                // noti  Posición relativa en C1: "a la vuelta de la esquina" y "al
  { practice: true },
  { lesson: 'gr-sub-adv-lugar-modo-c1' },               // gram  Subordinadas de lugar y de modo en C1: "para donde" y el m
  { lesson: 'fn-estado-general-cosas-c1' },             // func  Preguntar por el estado general de las cosas: la pregunta 
  { lesson: 'nt-posterioridad-c1' },                    // noti  Posterioridad en C1: de "apenas" a "con posterioridad"
  { lesson: 'nt-precision-claridad-c1' },               // noti  Precisión y claridad en C1: de "matemático" a "un lío"
  { lesson: 'fn-proponer-ofrecer-confirmar-c1' },       // func  Proponer, ofrecer y confirmar en C1: "no puedes faltar" y 
  { practice: true },
  { lesson: 'dc-metaforas-c1' },                        // disc  Metáforas: el juicio escondido en la gramática
  { lesson: 'gn-composicion-escrita-c1' },              // genr  La composición escrita: título, hoja de ruta, síntesis
  { lesson: 'nt-presencia-ausencia-c1' },               // noti  Presencia y ausencia en C1: de "estar hasta arriba" a "cua
  { lesson: 'gr-sub-adjetivas-relativo-c1' },           // gram  Subordinadas de relativo en C1: antecedentes especiales y 
  { lesson: 'fn-recordar-olvidar-c1' },                 // func  Recordar y olvidar en C1: "lo tengo en la punta de la leng
  { practice: true },
  { lesson: 'nt-proporcion-c1' },                       // noti  Proporción en C1: fracciones, cuotas y "tres de cada diez"
  { lesson: 'nt-puntualidad-singularidad-c1' },         // noti  Puntualidad y singularidad en C1: "por los pelos" y "sin p
  { lesson: 'fn-repetir-orden-c1' },                    // func  Repetir una orden en C1: "¿cuántas veces tengo que repetir
  { lesson: 'nt-realidad-ficcion-c1' },                 // noti  Realidad y ficción en C1: idealizar, disimular y volver a 
  { lesson: 'gr-sub-adv-finales-c1' },                  // gram  Subordinadas finales en C1: cuando "para" deja de ser sobr
  { practice: true },
  { lesson: 'nt-referencias-generales-c1' },            // noti  Referencias temporales generales en C1: de "a primeros de 
  { lesson: 'fn-reprochar-ofrecerse-c1' },              // func  Reprochar y ofrecerse en C1: "¿no te da vergüenza?" y "cue
  { lesson: 'dc-negacion-c1' },                         // disc  Negación en C1: velada, diluida, obviada
  { lesson: 'gn-presentacion-publica-c2' },             // genr  La presentación pública: el nivel más pulido
  { lesson: 'nt-reflexion-conocimiento-c1' },           // noti  Reflexión y conocimiento en C1: "consultar con la almohada
  { practice: true },
  { lesson: 'fn-responder-saludo-dirigirse-c1' },       // func  Responder a un saludo y dirigirse a alguien en C1: "seguim
  { lesson: 'nt-repeticion-c1' },                       // noti  Repetición en C1: recurrente, turnarse y "erre que erre"
  { lesson: 'gr-sub-sustantivas-c1' },                  // gram  Subordinadas sustantivas en C1: cuándo el infinitivo reemp
  { lesson: 'nt-retraso-c1' },                          // noti  Retraso en C1: atraso, demora y aplazamiento
  { lesson: 'fn-responder-orden-peticion-c1' },         // func  Responder a una petición en C1: de "faltaría más" a "¡ni l
  { practice: true },
  { lesson: 'nt-sabor-c1' },                            // noti  Sabor en C1: catar, saborear y "estar para chuparse los de
  { lesson: 'nt-simultaneidad-c1' },                    // noti  Simultaneidad en C1: "al tiempo que" y "en el mismo instan
  { lesson: 'gr-sub-adv-temporales-c1' },               // gram  Subordinadas temporales en C1: "antes de" hiperbólico y el
  { lesson: 'fn-saludar-c1' },                          // func  Saludar en C1: de "¿qué es de tu vida?" a "señora ministra
  { lesson: 'dc-rematizacion-tematizacion-c1' },        // disc  Rematización y tematización en C1: el orden que hace la pr
  { practice: true },
  { lesson: 'gn-presentacion-publica-c1' },             // genr  La presentación pública: la estructura completa
  { lesson: 'nt-temperatura-c1' },                      // noti  Temperatura en C1: de "un frío que pela" a "al rojo vivo"
  { lesson: 'fn-sorpresa-admiracion-c1' },              // func  Sorpresa y admiración en C1: "me quedo con la boca abierta
  { lesson: 'nt-textura-c1' },                          // noti  Textura en C1: rugoso, sedoso y "al tacto"
  { lesson: 'nt-utilidad-uso-c1' },                     // noti  Utilidad y uso en C1: de "hacer uso de" a "ser un trasto"
  { practice: true },
  { lesson: 'gr-tiempos-indicativo-c1' },               // gram  Tiempos verbales de indicativo en C1: cada tiempo, su obje
  { lesson: 'fn-tranquilizar-animar-c1' },              // func  Tranquilizar y animar en C1: "el no ya lo tienes" y "no es
  { lesson: 'nt-valor-precio-c1' },                     // noti  Valor y precio en C1: de "estar tirado" a "precio de coste
  { lesson: 'nt-movimiento-verbos-especificos-c1' },    // noti  Verbos de movimiento en C1: de "vagar" a "tambalearse"
  { lesson: 'fn-tristeza-placer-c1' },                  // func  Tristeza y placer en C1: "se me rompe el corazón" y "me pa
  { practice: true },
  { lesson: 'dc-ironia-c1' },                           // disc  Indicadores de ironía: cómo se marca que no lo dices en se
  { lesson: 'gn-resena-c1' },                           // genr  La reseña crítica
  { lesson: 'nt-visibilidad-vision-c1' },               // noti  Visibilidad y visión en C1: "saltar a la vista" y "mirar p
  { lesson: 'gr-tiempos-subjuntivo-c1' },               // gram  Tiempos verbales de subjuntivo en C1: lo que decide la neg
  { lesson: 'fn-valorar-c1' },                          // func  Valorar en C1: "de pésimo gusto" y "resulta vergonzoso"
  { practice: true },
  { lesson: 'nt-volumen-capacidad-presion-c1' },        // noti  Volumen, capacidad y presión en C1: de "dar volumen al cab
];



/* ============================================================================
 * DERIVED — the flat day list, the unit index, and where each band starts.
 *
 * COURSE above is what a person edits: units that own their days, with bare
 * day entries for the stretches not yet organised into units. Everything that
 * CONSUMES the course wants a flat list of days, so it is computed here once
 * rather than in each of the three readers.
 *
 * COURSE_BANDS used to be a hand-written object of indices at the bottom of
 * this file, and every insertion silently invalidated it — inserting four verb
 * days into A1 moved four band starts, and nothing would have complained if
 * they had not been updated by hand. It is derived now, so it cannot drift.
 * ========================================================================== */
(function () {
  var days = [], units = {}, bands = {}, cur = null;

  function mark(band) {
    if (!band) return;
    cur = band;
    if (!(band in bands)) bands[band] = days.length;
  }
  function push(day, unitId) {
    // Each day carries the unit it belongs to (null while unassigned), so the
    // session can name the unit without searching back through COURSE.
    var out = { unit: unitId || null, band: cur };
    Object.keys(day).forEach(function (k) { out[k] = day[k]; });
    days.push(out);
  }

  (window.COURSE || []).forEach(function (e) {
    if (e.unit) {
      mark(e.band);
      units[e.unit] = { id: e.unit, band: e.band || cur, title: e.title,
                        goal: e.goal || null, canDo: e.canDo || [],
                        from: days.length, length: (e.days || []).length };
      (e.days || []).forEach(function (d) { push(d, e.unit); });
      return;
    }
    if (e.band && !e.days) { mark(e.band); return; }   // a bare band marker
    push(e, null);
  });

  window.COURSE_DAYS  = days;    // the flat sequence every reader walks
  window.COURSE_UNITS = units;   // id -> { title, goal, canDo, from, length }
  window.COURSE_BANDS = bands;   // band -> index of its first day
})();