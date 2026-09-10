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

  /* ---- A1 · 86 days · starts at index 0 ------------------------------- */
  { verbs: ['hablar', 'pasar', 'llevar', 'dejar', 'tomar'] },
  { lesson: 'presente' },                               // gram  Presente (Present)
  { lesson: 'ser-estar' },                              // gram  Ser vs. Estar
  { lesson: 'gender-articles' },                        // gram  Gender & articles
  { verbs: ['llamar', 'quedar', 'esperar', 'entrar', 'trabajar'] },
  { practice: true },
  { lesson: 'gr-genero-sustantivos-a1' },               // gram  El género de los sustantivos
  { lesson: 'gr-numero-sustantivos-a1' },               // gram  El plural de los sustantivos
  { verbs: ['necesitar', 'mirar', 'escuchar', 'comprar', 'ayudar'] },
  { lesson: 'gr-genero-adjetivo-a1' },                  // gram  El género del adjetivo
  { lesson: 'gr-posesivos-forma-a1' },                  // gram  Los posesivos: formas
  { practice: true },
  { verbs: ['usar', 'terminar', 'estudiar', 'preguntar', 'contestar'] },
  { lesson: 'gr-posesivos-distribucion-a1' },           // gram  Los posesivos átonos: dónde van
  { lesson: 'gr-adjetivos-calificativos-a1' },          // gram  Adjetivos calificativos
  { verbs: ['comer', 'beber', 'cocinar', 'lavar', 'limpiar'] },
  { lesson: 'gr-adverbios-lugar-tiempo-cantidad-a1' },  // gram  Adverbios de lugar, tiempo y cantidad
  { practice: true },
  { lesson: 'gr-articulo-definido-a1' },                // gram  El artículo definido: distribución
  { verbs: ['ordenar', 'descansar', 'cenar', 'desayunar', 'preparar'] },
  { lesson: 'gr-articulo-indefinido-a1' },              // gram  El artículo indefinido: un, una, unos, unas
  { lesson: 'gr-atributo-a1' },                         // gram  El atributo con ser
  { verbs: ['cuidar', 'vivir', 'aprender', 'subir', 'bajar'] },
  { practice: true },
  { lesson: 'gr-infinitivo-usos-a1' },                  // gram  El infinitivo: cuándo se usa solo
  { lesson: 'gr-objeto-directo-a1' },                   // gram  El objeto directo
  { verbs: ['correr', 'caminar', 'viajar', 'visitar', 'invitar'] },
  { lesson: 'gr-participio-adjetival-a1' },             // gram  El participio como adjetivo
  { lesson: 'gr-presente-indicativo-valores-a1' },      // gram  El presente: de qué habla realmente
  { practice: true },
  { verbs: ['cantar', 'bailar', 'nadar', 'cambiar', 'ganar'] },
  { lesson: 'gr-pronombre-se-a1' },                     // gram  El pronombre se: usos reflexivos
  { lesson: 'gr-relativo-que-a1' },                     // gram  El relativo que: una palabra, tres trabajos
  { verbs: ['gastar', 'ahorrar', 'firmar', 'reservar', 'alquilar'] },
  { lesson: 'gr-demostrativos-distribucion-a1' },       // gram  Los demostrativos: este, ese, aquel — y dónde van
  { practice: true },
  { lesson: 'gr-interrogativos-a1' },                   // gram  Los interrogativos: qué, quién, cuánto, dónde, cómo
  { verbs: ['olvidar', 'explicar', 'enseñar', 'aceptar', 'intentar'] },
  { lesson: 'gr-numerales-a1' },                        // gram  Los numerales: cardinales y ordinales
  { lesson: 'gr-pronombre-sujeto-a1' },                 // gram  Los pronombres sujeto
  { verbs: ['decidir', 'permitir', 'recibir', 'partir', 'cumplir'] },
  { practice: true },
  { lesson: 'gr-nombres-propios-a1' },                  // gram  Nombres propios: con o sin artículo
  { lesson: 'gr-oraciones-finales-a1' },                // gram  Oraciones finales: para + infinitivo
  { verbs: ['existir', 'ocurrir', 'insistir', 'discutir', 'guardar'] },
  { lesson: 'gr-subordinadas-sustantivas-a1' },         // gram  Oraciones subordinadas sustantivas: infinitivo y "que"
  { lesson: 'gr-cuantificadores-no-universales-a1' },   // gram  Poco y mucho
  { practice: true },
  { verbs: ['tirar', 'arreglar', 'prestar', 'regalar', 'mandar'] },
  { lesson: 'gr-nucleo-verbal-a1' },                    // gram  Ser y estar sin adjetivo: el núcleo del predicado
  { lesson: 'gr-adverbios-afirmacion-negacion-a1' },    // gram  Sí, no, también, tampoco
  { verbs: ['saludar', 'presentar', 'acompañar', 'grabar', 'marcar'] },
  { lesson: 'gr-oraciones-actitud-hablante-a1' },       // gram  Tipos de oración según la actitud del hablante
  { practice: true },
  { lesson: 'nt-duracion-transcurso-a1' },              // noti  Antes, después y cuándo pasa
  { verbs: ['llenar', 'levantar', 'vestir', 'lavarse', 'ducharse'] },
  { lesson: 'nt-evaluacion-general-a1' },               // noti  Bueno, malo y los colores
  { lesson: 'nt-cantidad-numerica-a1' },                // noti  Cantidad: números, más y menos
  { verbs: ['levantarse', 'llamarse', 'llevarse'] },
  { practice: true },
  { lesson: 'nt-origen-a1' },                           // noti  De dónde eres y cuántos años tienes
  { lesson: 'nt-localizacion-a1' },                     // noti  Dónde están las cosas
  { lesson: 'nt-existencia-a1' },                       // noti  Hay, está, y entrar o salir
  { lesson: 'nt-movimiento-estabilidad-a1' },           // noti  Ir, venir y dar direcciones
  { lesson: 'nt-referencias-generales-a1' },            // noti  La hora, los días y la frecuencia
  { practice: true },
  { lesson: 'nt-valor-precio-a1' },                     // noti  Precio y tamaño
  { lesson: 'fn-acuerdo-a1' },                          // func  Acuerdo y desacuerdo
  { lesson: 'fn-corregir-informacion-a1' },             // func  Corregir y decir que no sabes
  { lesson: 'fn-dirigirse-a1' },                        // func  Dirigirse a alguien y responder
  { lesson: 'fn-establecer-comunicacion-a1' },          // func  Empezar y terminar una conversación
  { practice: true },
  { lesson: 'fn-identificar-a1' },                      // func  Identificar: qué es y quién es
  { lesson: 'fn-silencio-a1' },                         // func  Pedir silencio
  { lesson: 'fn-pedir-informacion-a1' },                // func  Pedir y dar información
  { lesson: 'fn-valorar-a1' },                          // func  Valorar y hablar de lo que haces
  { lesson: 'dc-conectores-a1' },                       // disc  Conectores y negación
  { practice: true },
  { lesson: 'dc-deixis-espacial-a1' },                  // disc  Esto, eso y el orden de la información
  { lesson: 'dc-entonacion-a1' },                       // disc  La entonación y la cortesía
  { lesson: 'gn-describir-persona-a1' },                // genr  Describir a una persona
  { lesson: 'gn-describir-lugar-a1' },                  // genr  Describir un lugar
  { lesson: 'gn-describir-objeto-a1' },                 // genr  Describir un objeto
  { practice: true },
  { lesson: 'gn-conversacion-transaccional-a1' },       // genr  La conversación transaccional: comprar algo
  { lesson: 'gn-generos-escritos-a1' },                 // genr  Textos breves de cada día

  /* ---- A2 · 106 days · starts at index 86 ------------------------------- */
  { verbs: ['mejorar', 'empeorar', 'aumentar', 'evitar', 'crear'] },
  { lesson: 'preterito' },                              // gram  Pretérito (Preterite)
  { lesson: 'imperfecto' },                             // gram  Imperfecto (Imperfect)
  { lesson: 'preterite-imperfect' },                    // gram  Preterite vs. Imperfect
  { verbs: ['formar', 'tratar', 'resultar', 'señalar', 'indicar'] },
  { practice: true },
  { lesson: 'por-para' },                               // gram  Por vs. Para
  { lesson: 'gr-adverbios-circunstanciales-a2' },       // gram  Adverbios circunstanciales: lugar, tiempo y cantidad
  { verbs: ['ocupar', 'asegurar', 'expresar', 'comentar', 'opinar'] },
  { lesson: 'gr-causales-a2' },                         // gram  Causales: porque, como, por
  { lesson: 'gr-comparativos-a2' },                     // gram  Comparativos: los tres marcos y los irregulares
  { practice: true },
  { verbs: ['imaginar', 'dudar', 'notar', 'observar', 'comparar'] },
  { lesson: 'gr-condicionales-a2' },                    // gram  Condicionales: si + presente
  { lesson: 'gr-cuantificadores-a2' },                  // gram  Cuantificadores: todo, otro, demasiado, nada
  { verbs: ['resumir', 'anunciar', 'publicar', 'celebrar', 'organizar'] },
  { lesson: 'gr-articulo-definido-distribucion-a2' },   // gram  El artículo definido: el agua, jugar al tenis, todos los l
  { practice: true },
  { lesson: 'gr-articulo-definido-valores-a2' },        // gram  El artículo definido: usos más allá de "the"
  { verbs: ['participar', 'colaborar', 'reciclar', 'contaminar', 'reparar'] },
  { lesson: 'gr-articulo-indefinido-valores-a2' },      // gram  El artículo indefinido: valor aproximativo
  { lesson: 'gr-gerundio-a2' },                         // gram  El gerundio: -ando, -iendo
  { verbs: ['solicitar', 'entregar', 'cobrar', 'reclamar', 'vender'] },
  { practice: true },
  { lesson: 'gr-imperativo-forma-a2' },                 // gram  El imperativo afirmativo: forma y uso
  { lesson: 'gr-objeto-indirecto-a2' },                 // gram  El objeto indirecto
  { verbs: ['funcionar', 'durar', 'faltar', 'suceder', 'practicar'] },
  { lesson: 'gr-presente-irregular-a2' },               // gram  El presente irregular: la bota y el yo raro
  { lesson: 'gr-preterito-imperfecto-a2' },             // gram  El pretérito imperfecto
  { practice: true },
  { verbs: ['entrenar', 'montar', 'aparcar', 'arrancar', 'frenar'] },
  { lesson: 'gr-preterito-indefinido-a2' },             // gram  El pretérito indefinido
  { lesson: 'gr-preterito-perfecto-a2' },               // gram  El pretérito perfecto: haber + participio
  { verbs: ['cruzar', 'doblar', 'girar', 'parar', 'avisar'] },
  { lesson: 'gr-interrogativos-exclamativos-a2' },      // gram  Interrogativos y exclamativos: qué, cuál, cómo
  { practice: true },
  { lesson: 'gr-restrictivos-nominales-a2' },           // gram  La casa mía, una película apasionante, calle Alcalá
  { verbs: ['informar', 'consultar', 'confirmar', 'cancelar', 'retrasar'] },
  { lesson: 'gr-demostrativos-valores-a2' },            // gram  Los demostrativos: uso anafórico y temporal
  { lesson: 'gr-posesivos-tonicos-a2' },                // gram  Los posesivos tónicos: mío, tuyo, suyo
  { verbs: ['adelantar', 'pesar', 'calcular', 'sumar', 'restar'] },
  { practice: true },
  { lesson: 'gr-masculino-a2' },                        // gram  Más sustantivos masculinos: colores y casos aislados
  { lesson: 'gr-nombres-escuetos-a2' },                 // gram  Nombres escuetos: sin artículo ni cuantificador
  { verbs: ['conectar', 'navegar', 'actualizar', 'instalar', 'suspender'] },
  { lesson: 'gr-sustantivos-especiales-a2' },           // gram  Nombres propios con artículo fijo y nombres eventivos
  { lesson: 'gr-pronombres-atonos-a2' },                // gram  Pronombres átonos: OD y OI
  { practice: true },
  { verbs: ['aprobar', 'quejarse', 'enfadarse', 'alegrarse', 'preocuparse'] },
  { lesson: 'gr-pronombres-tonicos-a2' },               // gram  Pronombres tónicos: mí, ti, conmigo
  { lesson: 'gr-oraciones-simples-a2' },                // gram  Tipos de oraciones simples: disyuntivas, exclamativas, ref
  { verbs: ['cansarse', 'aburrirse', 'casarse', 'mudarse', 'jubilarse'] },
  { lesson: 'gr-nucleo-verbal-tipos-a2' },              // gram  Tipos de verbo: predicativo, auxiliar, copulativo
  { practice: true },
  { lesson: 'gr-verbos-predicativos-tipos-a2' },        // gram  Verbos que funcionan al revés: encantar, doler
  { verbs: ['apuntarse', 'quedarse', 'matricularse', 'relajarse', 'enterarse'] },
  { lesson: 'nt-frecuencia-a2' },                       // noti  Cuántas veces y cuánta cantidad
  { lesson: 'nt-cualidad-material-a2' },                // noti  De qué es y cambiarlo por otro
  { verbs: ['fijarse'] },
  { practice: true },
  { lesson: 'nt-posicion-relativa-distancia-a2' },      // noti  Dentro, fuera y a la vista
  { lesson: 'nt-expresion-verbal-a2' },                 // noti  Expresión verbal: preguntar, contestar, decir
  { lesson: 'nt-movimiento-estabilidad-a2' },           // noti  Moverse y dar direcciones (A2)
  { lesson: 'nt-existencia-inexistencia-a2' },          // noti  Nacer, morir y las edades
  { lesson: 'nt-necesidad-obligacion-a2' },             // noti  Necesidad y conformidad: hace falta, vale
  { practice: true },
  { lesson: 'nt-localizacion-tiempo-a2' },              // noti  Situar en el tiempo: desde, hasta, durante
  { lesson: 'nt-anterioridad-a2' },                     // noti  Ya, todavía no, y el principio y el fin
  { lesson: 'fn-aconsejar-a2' },                        // func  Aconsejar y ofrecerse
  { lesson: 'fn-acuerdo-a2' },                          // func  Acuerdo y valoración
  { lesson: 'fn-responder-telefono-a2' },               // func  Al teléfono y escuchando un relato
  { practice: true },
  { lesson: 'fn-preguntar-estado-animo-a2' },           // func  Cómo estás: ánimo y sensaciones
  { lesson: 'fn-acceder-peticion-a2' },                 // func  Decir que sí y decir que no
  { lesson: 'fn-preguntar-deseos-a2' },                 // func  Deseos: los tuyos y los que se ofrecen
  { lesson: 'fn-dirigirse-a2' },                        // func  Dirigirse a alguien y presentarlo
  { lesson: 'fn-disculparse-a2' },                      // func  Disculparse
  { practice: true },
  { lesson: 'fn-felicitar-a2' },                        // func  Felicitar y alegrarse
  { lesson: 'fn-atenuar-orden-a2' },                    // func  Pedir algo con cortesía
  { lesson: 'fn-pedir-informacion-a2' },                // func  Pedir y dar información (A2)
  { lesson: 'fn-preguntar-preferencias-a2' },           // func  Preferencias: qué te gusta más
  { lesson: 'fn-preguntar-gustos-a2' },                 // func  Preguntar y expresar gustos
  { practice: true },
  { lesson: 'fn-proponer-sugerir-a2' },                 // func  Proponer, sugerir y aceptar
  { lesson: 'fn-identificar-a2' },                      // func  Qué es y qué puede ser
  { lesson: 'fn-preguntar-conocimiento-a2' },           // func  Saber y no saber
  { lesson: 'fn-responder-saludo-a2' },                 // func  Saludar: en persona y por escrito
  { lesson: 'dc-atenuacion-1apersona-a2' },             // disc  Atenuar: se impersonal e indirectas
  { practice: true },
  { lesson: 'dc-deixis-personal-a2' },                  // disc  Deixis personal y espacial
  { lesson: 'dc-deixis-temporal-a2' },                  // disc  Deixis temporal y el hilo del relato
  { lesson: 'dc-estructuradores-a2' },                  // disc  Estructuradores y negación reforzada
  { lesson: 'dc-interrogativos-neutros-a2' },           // disc  Preguntas neutras y orientadas
  { lesson: 'dc-tematizacion-a2' },                     // disc  Tematización y rematización
  { practice: true },
  { lesson: 'gn-narrar-anecdota-a2' },                  // genr  Contar una anécdota
  { lesson: 'gn-instrucciones-a2' },                    // genr  Dar instrucciones breves
  { lesson: 'gn-describir-persona-a2' },                // genr  Describir a una persona: comparar y narrar un momento
  { lesson: 'gn-describir-lugar-a2' },                  // genr  Describir un lugar: recorrido, anécdota y comparación
  { lesson: 'gn-describir-objeto-a2' },                 // genr  Describir un objeto: partes, una anécdota y una comparació
  { practice: true },
  { lesson: 'gn-conversacion-transaccional-a2' },       // genr  La conversación transaccional en la tienda de ropa
  { lesson: 'gn-generos-escritos-a2' },                 // genr  Textos breves de cada día (A2)
  { lesson: 'gn-presentacion-publica-a2' },             // genr  Una presentación pública breve
  { practice: true },

  /* ---- B1 · 158 days · starts at index 192 ------------------------------- */
  { lesson: 'futuro' },                                 // gram  El futuro: forma, predicción y conjetura
  { lesson: 'condicional' },                            // gram  El condicional: forma, cortesía y modestia
  { lesson: 'gr-presente-subjuntivo-b1' },              // gram  El subjuntivo: cómo se forma y cuándo aparece
  { lesson: 'gr-temporales-b1' },                       // gram  Temporales: cuando + subjuntivo para el futuro
  { lesson: 'gr-modalidad-b1' },                        // gram  Modalidad: posiblemente, seguramente, probablemente
  { lesson: 'gr-subordinadas-sustantivas-b1' },         // gram  Subordinadas sustantivas: infinitivo o que + verbo
  { lesson: 'gr-imperativo-valores-b1' },               // gram  El imperativo: más allá de la orden
  { lesson: 'gr-adverbios-modo-cantidad-b1' },          // gram  Adverbios de tiempo, cantidad y modo: posición y matiz
  { lesson: 'gr-indefinidos-negativos-b1' },            // gram  Algo, alguien, alguno — nada, nadie, ninguno
  { lesson: 'gr-causales-b1' },                         // gram  Causales: como, por + infinitivo
  { lesson: 'gr-pronombres-combinados-b1' },            // gram  Combinación de pronombres átonos: te lo, se lo
  { lesson: 'gr-adverbios-relativos-b1' },              // gram  Como, cuando, donde: relativos vs interrogativos
  { lesson: 'gr-comparativas-b1' },                     // gram  Comparativas: igual de... que, más de
  { lesson: 'gr-concesivas-b1' },                       // gram  Concesivas: aunque + indicativo
  { lesson: 'gr-condicionales-b1' },                    // gram  Condicionales reales: si + futuro, si + imperativo
  { lesson: 'gr-consecutivas-b1' },                     // gram  Consecutivas: entonces, así que, o sea que
  { lesson: 'gr-cuantificadores-b1' },                  // gram  Cuantificadores B1: cada, alguien/algo/alguno, más de
  { lesson: 'gr-articulo-anaforico-escuetos-b1' },      // gram  El artículo anafórico y los nombres escuetos
  { lesson: 'gr-posesivo-dativo-b1' },                  // gram  El dativo posesivo: le cortaron el pelo
  { lesson: 'gr-nombres-propios-b1' },                  // gram  Familias, accidentes geográficos y títulos de obras
  { lesson: 'gr-interrogativos-b1' },                   // gram  Interrogativos: qué, quién, cuál + preposición
  { lesson: 'gr-modificadores-adverbios-b1' },          // gram  Modificadores: el doble de, -mente, elativos
  { lesson: 'gr-genero-especial-b1' },                  // gram  Nombres epicenos y cambio de género con cambio de signific
  { lesson: 'gr-relativas-b1' },                        // gram  Oraciones de relativo: que, quien, donde
  { lesson: 'gr-perifrasis-verbales-b1' },              // gram  Perífrasis verbales: soler, volver a, dejar de
  { lesson: 'gr-pluscuamperfecto-b1' },                 // gram  Pretérito pluscuamperfecto: había hablado
  { lesson: 'gr-se-multiuso-b1' },                      // gram  Se: recíproco, impersonal, meteorológico
  { lesson: 'gr-ser-impersonal-b1' },                   // gram  Ser impersonal: es de noche, es una pena que
  { lesson: 'gr-numero-sustantivos-b1' },               // gram  Singularia y pluralia tantum, y el plural en -y
  { lesson: 'gr-formas-no-personales-b1' },             // gram  Usos independientes del infinitivo, gerundio y participio
  { lesson: 'nt-acontecimiento-b1' },                   // noti  Acontecimiento: tener lugar, celebrarse
  { lesson: 'nt-aumento-proporcion-grado-b1' },         // noti  Aumento y proporción: subida, la mitad, sobre todo
  { lesson: 'nt-cantidad-numerica-relativa-b1' },       // noti  Cantidad: en total, por ciento, la mayoría de
  { lesson: 'nt-certeza-realidad-b1' },                 // noti  Certeza e incertidumbre: seguro, tal vez, imaginario
  { lesson: 'nt-conformidad-correccion-precision-b1' }, // noti  Conformidad y corrección: aceptar, error, claro
  { lesson: 'nt-cualidad-generalidad-b1' },             // noti  Cualidad y generalidad: tipo, forma, en general
  { lesson: 'nt-distancia-movimiento-b1' },             // noti  Distancia y movimiento: acercarse, alejarse, caerse
  { lesson: 'nt-edad-vejez-b1' },                       // noti  Edad: cumplir años, aniversario
  { lesson: 'nt-ciclo-accion-b1' },                     // noti  El ciclo de una acción: empezar, seguir, dejar de
  { lesson: 'nt-tiempo-referencias-futuro-pasado-presente-b1' },// noti  El tiempo: siglos, décadas y el presente que dura
  { lesson: 'nt-evaluacion-valor-b1' },                 // noti  Evaluación y precio: parecerle, estar a, rebajas
  { lesson: 'nt-existencia-disponibilidad-b1' },        // noti  Existencia y disponibilidad: vacío, libre, ocupado
  { lesson: 'nt-exito-utilidad-importancia-b1' },       // noti  Éxito, utilidad e importancia: servir para, dar igual
  { lesson: 'nt-formas-materia-b1' },                   // noti  Formas y materia: círculo, estar hecho de
  { lesson: 'nt-localizacion-posicion-b1' },            // noti  Localización y posición: junto a, al fondo, en ninguna par
  { lesson: 'nt-sentidos-b1' },                         // noti  Los sentidos: ver, oír, saber a, oler a
  { lesson: 'nt-medidas-tamano-superficie-b1' },        // noti  Medidas: medir, tamaño, metros cuadrados
  { lesson: 'nt-necesidad-obligacion-b1' },             // noti  Necesidad y obligación: depender de, ser obligatorio
  { lesson: 'nt-orientacion-orden-b1' },                // noti  Orientación y orden: seguir por, primero, luego
  { lesson: 'nt-puntualidad-retraso-b1' },              // noti  Puntualidad y retraso: llegar a tiempo, con retraso
  { lesson: 'nt-reflexion-expresion-b1' },              // noti  Reflexión y expresión: darse cuenta de, contar un chiste
  { lesson: 'nt-temperatura-velocidad-volumen-b1' },    // noti  Temperatura, velocidad y volumen: grados, km por hora
  { lesson: 'nt-textura-consistencia-b1' },             // noti  Textura y consistencia: duro, blando, húmedo
  { lesson: 'fn-has-oido-b1' },                         // func  ¿Has oído...?
  { lesson: 'fn-aceptar-propuesta-b1' },                // func  Aceptar una propuesta: entusiasmo y aceptación con reparos
  { lesson: 'fn-aconsejar-b1' },                        // func  Aconsejar: del condicional a "yo que tú"
  { lesson: 'fn-certeza-evidencia-b1' },                // func  Certeza y falta de certeza: dónde se rompe el indicativo
  { lesson: 'fn-conocimiento-desconocimiento-b1' },     // func  Conocimiento y desconocimiento: oír que + indicativo/subju
  { lesson: 'fn-respuesta-afirmativa-b1' },             // func  Corregir con no... sino
  { lesson: 'fn-dar-opinion-b1' },                      // func  Dar y pedir una opinión
  { lesson: 'fn-disculparse-b1' },                      // func  Disculparse con una razón: "es que..."
  { lesson: 'fn-estoy-de-acuerdo-b1' },                 // func  Estar de acuerdo — y no estarlo
  { lesson: 'fn-aprobacion-desaprobacion-b1' },         // func  Expresar aprobación y desaprobación (B1)
  { lesson: 'fn-aversion-b1' },                         // func  Expresar aversión
  { lesson: 'fn-expresar-gustos-b1' },                  // func  Expresar gustos e intereses sobre acciones ajenas
  { lesson: 'fn-habilidad-b1' },                        // func  Expresar habilidad para hacer algo
  { lesson: 'fn-obligacion-necesidad-b1' },             // func  Expresar obligación y necesidad
  { lesson: 'fn-posibilidad-b1' },                      // func  Expresar posibilidad: quiénes exigen subjuntivo y quiénes 
  { lesson: 'fn-preferencia-b1' },                      // func  Expresar preferencia
  { lesson: 'fn-sensaciones-fisicas-b1' },              // func  Expresar sensaciones físicas: tener, sentir, estar, doler
  { lesson: 'fn-felicitar-b1' },                        // func  Felicitar: por un logro y en fechas señaladas
  { lesson: 'fn-identificar-b1' },                      // func  Identificar con una oración de relativo
  { lesson: 'fn-mostrar-escepticismo-b1' },             // func  Mostrar escepticismo
  { lesson: 'fn-pedir-informacion-b1' },                // func  Pedir información con preguntas indirectas
  { lesson: 'fn-pedir-objetos-b1' },                    // func  Pedir objetos: del imperativo directo a la pregunta atenua
  { lesson: 'fn-pedir-valoracion-b1' },                 // func  Pedir valoración
  { lesson: 'fn-posicionarse-b1' },                     // func  Posicionarse a favor o en contra
  { lesson: 'fn-preguntar-deseos-b1' },                 // func  Preguntar por deseos: te apetece, tienes ganas de
  { lesson: 'fn-preguntar-estado-animo-b1' },           // func  Preguntar por el estado de ánimo
  { lesson: 'fn-preguntar-gustos-b1' },                 // func  Preguntar por gustos: ¿te gusta que + subjuntivo?
  { lesson: 'fn-preguntar-preferencias-b1' },           // func  Preguntar por preferencias: comparando dos opciones
  { lesson: 'fn-preguntar-persona-telefono-b1' },       // func  Preguntar por una persona y responder al teléfono
  { lesson: 'fn-preguntar-si-acuerdo-b1' },             // func  Preguntar si se está de acuerdo
  { lesson: 'fn-contraargumento-b1' },                  // func  Presentar un contraargumento
  { lesson: 'fn-proponer-sugerir-b1' },                 // func  Proponer y sugerir: seis formas, una escala de fuerza
  { lesson: 'fn-responder-orden-b1' },                  // func  Responder a una petición: aceptar, dudar, negarse
  { lesson: 'fn-saludar-responder-b1' },                // func  Saludar y responder: la lengua escrita añade un registro
  { lesson: 'fn-valorar-b1' },                          // func  Valorar: hechos en indicativo, ajenos en subjuntivo
  { lesson: 'dc-atenuacion-b1' },                       // disc  Atenuación: desplazar el tiempo verbal para suavizar
  { lesson: 'dc-deixis-b1' },                           // disc  La deixis: espacial, temporal y personal
  { lesson: 'dc-valores-ilocutivos-b1' },               // disc  Lo que realmente hace una pregunta
  { lesson: 'dc-mantenimiento-referente-b1' },          // disc  Mantener el referente sin repetir el nombre
  { lesson: 'dc-marcadores-discurso-b1' },              // disc  Marcadores del discurso: las cinco familias del B1
  { lesson: 'dc-negacion-refuerzo-b1' },                // disc  Refuerzo de la negación: nadie, hasta, desde
  { lesson: 'dc-rematizacion-tematizacion-b1' },        // disc  Rematización y tematización: reordenar para destacar
  { lesson: 'gn-describir-persona-b1' },                // genr  Describir a una persona: objetivo vs subjetivo, y una anéc
  { lesson: 'gn-describir-lugar-b1' },                  // genr  Describir un lugar: razones objetivas, cariño subjetivo
  { lesson: 'gn-describir-objeto-b1' },                 // genr  Describir un objeto: origen objetivo o acertijo subjetivo
  { lesson: 'gn-carta-personal-b1' },                   // genr  La carta personal (B1)
  { lesson: 'gn-narrar-estructura-b1' },                // genr  La estructura de una anécdota: cinco partes, no una lista 
  { lesson: 'gn-llamada-transaccional-b1' },            // genr  La llamada telefónica transaccional (B1)
  { lesson: 'gn-generos-escritos-b1' },                 // genr  Reconocer géneros escritos: la forma predice el registro
  { lesson: 'gn-reconocer-generos-orales-b1' },         // genr  Reconocer géneros orales: boletín, deportes, contestador
  { lesson: 'gn-generos-orales-b1' },                   // genr  Reconocer géneros orales: qué exige entender, qué exige pr
  { lesson: 'gn-presentacion-publica-b1' },             // genr  Una presentación pública (B1)
  { lesson: 'impsubj' },                                // gram  Imperfecto de subjuntivo (Imperfect Subjunctive)
  { lesson: 'impneg' },                                 // gram  Imperativo negativo
  { lesson: 'nt-acabado-b1' },                          // noti  Acabado: el resultado de una acción terminada
  { lesson: 'fn-ordenar-directo-b1' },                  // func  Dar una orden de forma directa
  { lesson: 'fn-espero-esperanza-b1' },                 // func  Espero... / Expresar esperanza
  { lesson: 'fn-contento-encantado-b1' },               // func  Estoy contento / encantado...
  { lesson: 'fn-aburrimiento-b1' },                     // func  Expresar aburrimiento
  { lesson: 'fn-admiracion-orgullo-b1' },               // func  Expresar admiración y orgullo
  { lesson: 'fn-afecto-b1' },                           // func  Expresar afecto
  { lesson: 'fn-expresar-deseos-b1' },                  // func  Expresar deseos
  { lesson: 'fn-empatia-b1' },                          // func  Expresar empatía
  { lesson: 'fn-enfado-indignacion-b1' },               // func  Expresar enfado e indignación
  { lesson: 'fn-miedo-ansiedad-preocupacion-b1' },      // func  Expresar miedo, ansiedad y preocupación
  { lesson: 'fn-placer-diversion-b1' },                 // func  Expresar placer y diversión
  { lesson: 'fn-sorpresa-extraneza-b1' },               // func  Expresar sorpresa y extrañeza
  { lesson: 'fn-tristeza-afliccion-b1' },               // func  Expresar tristeza y aflicción
  { lesson: 'fn-me-alegro-b1' },                        // func  Me alegro
  { lesson: 'fn-me-duele-b1' },                         // func  Me duele (emocional)
  { lesson: 'fn-no-me-importa-b1' },                    // func  No me importa (indiferencia)
  { lesson: 'fn-pedir-ayuda-b1' },                      // func  Pedir ayuda: directa, atenuada y encubierta
  { lesson: 'fn-pedir-permiso-b1' },                    // func  Pedir permiso
  { lesson: 'fn-pedir-favor-b1' },                      // func  Pedir un favor
  { lesson: 'fn-expresar-planes-b1' },                  // func  Planes e intenciones: contarlos y preguntarlos
  { lesson: 'fn-prohibir-b1' },                         // func  Prohibir
  { lesson: 'dc-intensificacion-discurso-b1' },         // disc  Intensificar: el más... de, -ísimo, kilómetros y kilómetro
  { lesson: 'gn-exponer-tema-b1' },                     // genr  Exponer un tema: presente, ejemplos y esquemas
  { lesson: 'gn-composicion-escrita-b1' },              // genr  La composición escrita (B1)
  { lesson: 'futperf' },                                // gram  Futuro perfecto (Future Perfect)
  { lesson: 'condperf' },                               // gram  Condicional perfecto (Conditional Perfect)
  { lesson: 'perfsubj' },                               // gram  Pretérito perfecto de subjuntivo (Present Perfect Subjunct
  { lesson: 'gr-complementos-modificadores-b1' },       // gram  La chica de los ojos azules, la construcción del edificio
  { lesson: 'fn-advertir-b1' },                         // func  Advertir
  { lesson: 'fn-animar-b1' },                           // func  Animar
  { lesson: 'fn-concluir-relato-b1' },                  // func  Concluir un relato
  { lesson: 'fn-controlar-atencion-b1' },               // func  Controlar la atención del interlocutor
  { lesson: 'fn-despedida-escrita-b1' },                // func  Despedirse por escrito
  { lesson: 'fn-destacar-elemento-b1' },                // func  Destacar un elemento por escrito
  { lesson: 'fn-buenos-deseos-b1' },                    // func  Formular buenos deseos: dos formas, un mismo deseo
  { lesson: 'fn-seguir-relato-interes-b1' },            // func  Indicar que se sigue el relato con interés
  { lesson: 'fn-interrumpir-b1' },                      // func  Interrumpir
  { lesson: 'fn-introducir-tema-relato-b1' },           // func  Introducir el tema de un relato
  { lesson: 'fn-introducir-hecho-b1' },                 // func  Introducir un hecho dentro de un relato
  { lesson: 'fn-ofrecer-invitar-b1' },                  // func  Ofrecer e invitar
  { lesson: 'fn-brindis-b1' },                          // func  Proponer un brindis
  { lesson: 'fn-rechazar-b1' },                         // func  Rechazar una propuesta, ofrecimiento o invitación
  { lesson: 'fn-reprochar-b1' },                        // func  Reprochar
  { lesson: 'fn-responder-felicitaciones-b1' },         // func  Responder a felicitaciones y buenos deseos
  { lesson: 'fn-responder-disculpa-b1' },               // func  Responder a una disculpa
  { lesson: 'fn-responder-estado-b1' },                 // func  Responder cuando preguntan cómo van las cosas
  { lesson: 'fn-tranquilizar-consolar-b1' },            // func  Tranquilizar y consolar
  { lesson: 'dc-focalizacion-b1' },                     // disc  Focalización: solo, sobre todo, ¡qué bien habla!
  { lesson: 'dc-intensificar-acuerdo-desacuerdo-b1' },  // disc  Intensificar el acuerdo o el desacuerdo: claro, claro
  { lesson: 'dc-entonacion-b1' },                       // disc  Más allá de las palabras: pausas, alargamientos y énfasis

  /* ---- B2 · 210 days · starts at index 350 ------------------------------- */
  { lesson: 'gr-que-explicativo-b2' },                  // gram  "Que" explicativo: la coma que añade, no que elige
  { lesson: 'gr-adverbios-enunciacion-b2' },            // gram  Adverbios de enunciación: comentar sobre las propias palab
  { lesson: 'gr-adverbios-frecuencia-topico-b2' },      // gram  Adverbios de frecuencia y el adverbio-tópico
  { lesson: 'gr-adverbios-evaluativos-b2' },            // gram  Adverbios evaluativos: un comentario sobre toda la frase
  { lesson: 'gr-adverbios-nucleares-b2' },              // gram  Adverbios: combinaciones, cuantificadores y equivalencia a
  { lesson: 'gr-nucleo-verbal-copulativos-b2' },        // gram  Auxiliares, copulativos y pseudocopulativos avanzados
  { lesson: 'gr-complementos-sa-b2' },                  // gram  Complementos del adjetivo: difícil de, interesado en
  { lesson: 'gr-complementos-nominales-b2' },           // gram  Complementos del nombre: ambiguos, no restrictivos, y sus 
  { lesson: 'gr-concordancia-sn-verbo-b2' },            // gram  Concordancia del sujeto con el verbo: los casos difíciles
  { lesson: 'gr-relativo-donde-b2' },                   // gram  Donde como relativo: lugares sin repetir "en el que"
  { lesson: 'gr-articulo-definido-valores-b2' },        // gram  El artículo definido: valor genérico y "lo" sustantivador
  { lesson: 'gr-articulo-indefinido-valores-b2' },      // gram  El artículo indefinido: restricciones sutiles
  { lesson: 'gr-condicional-compuesto-b2' },            // gram  El condicional compuesto: habría + participio
  { lesson: 'gr-futuro-perfecto-b2' },                  // gram  El futuro perfecto: habré + participio
  { lesson: 'gr-imperativo-valores-b2' },               // gram  El imperativo: valores más allá de la orden
  { lesson: 'gr-impsubj-valores-b2' },                  // gram  El imperfecto de subjuntivo: más allá del "si tuviera"
  { lesson: 'gr-orden-interrogativos-b2' },             // gram  El orden en las preguntas: lo que puede moverse
  { lesson: 'gr-perfsubj-valores-b2' },                 // gram  El pretérito perfecto de subjuntivo: haya + participio
  { lesson: 'gr-pluscuamsubj-b2' },                     // gram  El pretérito pluscuamperfecto de subjuntivo: hubiera/hubie
  { lesson: 'gr-pronombre-personal-b2' },               // gram  El pronombre personal: se accidental y la jerarquía de clí
  { lesson: 'gr-el-que-relativos-b2' },                 // gram  El que, la que, los que, las que: el relativo tras preposi
  { lesson: 'gr-formas-no-personales-b2' },             // gram  Infinitivo, gerundio y participio: valores avanzados
  { lesson: 'gr-exclamativos-b2' },                     // gram  Los exclamativos: qué, cómo, cuánto y quién
  { lesson: 'gr-posesivos-b2' },                        // gram  Los posesivos: forma tónica, fórmulas fijas
  { lesson: 'gr-nombres-escuetos-b2' },                 // gram  Nombres escuetos: sin artículo, con reglas propias
  { lesson: 'gr-cuantificadores-numerales-cualquier-b2' },// gram  Numerales partitivos/multiplicativos y cualquier/cualquier
  { lesson: 'gr-subordinadas-lugar-b2' },               // gram  Oraciones subordinadas de lugar: donde con indicativo o su
  { lesson: 'gr-subordinadas-modo-b2' },                // gram  Oraciones subordinadas de modo: como y según
  { lesson: 'gr-numero-sustantivos-b2' },               // gram  Plurales irregulares: invariables, tónicos y léxicos
  { lesson: 'gr-quien-quienes-b2' },                    // gram  Quien / quienes: solo para personas
  { lesson: 'gr-subordinadas-relativas-tipos-b2' },     // gram  Relativas: especificativas, explicativas y sus restriccion
  { lesson: 'gr-subordinadas-sustantivas-b2' },         // gram  Subordinadas sustantivas: el verbo principal decide el mod
  { lesson: 'gr-complemento-preposicional-regido-b2' }, // gram  Verbos con preposición fija: decidirse a, contar con
  { lesson: 'nt-acontecimiento-b2' },                   // noti  Acontecimiento: ocurrir, casualidad, suspender
  { lesson: 'nt-adecuacion-b2' },                       // noti  Adecuación: adaptarse, apropiado
  { lesson: 'nt-anticipacion-b2' },                     // noti  Anticipación: adelantar, con tiempo, por adelantado
  { lesson: 'nt-audibilidad-audicion-b2' },             // noti  Audibilidad: sonar, a gritos, a todo volumen
  { lesson: 'nt-aumento-disminucion-b2' },              // noti  Aumento y disminución: crecer, duplicarse, cada vez más
  { lesson: 'nt-cantidad-numerica-b2' },                // noti  Cantidad numérica: cifras, índices, "número + de"
  { lesson: 'nt-cantidad-relativa-b2' },                // noti  Cantidad relativa: aproximar sin comprometerse
  { lesson: 'nt-capacidad-competencia-b2' },            // noti  Capacidad y competencia: dársele bien, ser capaz de
  { lesson: 'nt-certeza-b2' },                          // noti  Certeza e incertidumbre: el vocabulario, más allá del modo
  { lesson: 'nt-color-b2' },                            // noti  Color: tonos compuestos, ser de color, en blanco y negro
  { lesson: 'nt-consistencia-resistencia-b2' },         // noti  Consistencia y resistencia: denso, frágil, resistente a
  { lesson: 'nt-correccion-precision-b2' },             // noti  Corrección y precisión: fallo, exacto, verlo claro
  { lesson: 'nt-cualidad-general-b2' },                 // noti  Cualidad general: propiedades, categorías, composición
  { lesson: 'nt-disponibilidad-b2' },                   // noti  Disponibilidad: agotarse, contar con, estar listo
  { lesson: 'nt-distancia-b2' },                        // noti  Distancia: acercar(se), alejar(se), a distancia
  { lesson: 'nt-edad-vejez-b2' },                       // noti  Edad y vejez: recién + participio, fresco/podrido, estrena
  { lesson: 'nt-peso-b2' },                             // noti  El peso: tonelada, carga, pesarse
  { lesson: 'nt-evaluacion-general-b2' },               // noti  Evaluación general: salirle/irle algo a alguien, valer la 
  { lesson: 'nt-existencia-b2' },                       // noti  Existencia e inexistencia: crear, eliminar, provocar
  { lesson: 'nt-exito-logro-b2' },                      // noti  Éxito y logro: triunfar, fracasar, llegar a ser
  { lesson: 'nt-expresion-verbal-b2' },                 // noti  Expresión verbal: variar el verbo de habla más allá de "de
  { lesson: 'nt-facilidad-b2' },                        // noti  Facilidad y dificultad: complejo, facilitar, con facilidad
  { lesson: 'nt-formas-figuras-b2' },                   // noti  Formas y figuras: geometría cotidiana
  { lesson: 'nt-generalidad-especificidad-b2' },        // noti  Generalidad y especificidad: concretar, particular, en gen
  { lesson: 'nt-grado-b2' },                            // noti  Grado: intensificadores más allá de "muy"
  { lesson: 'nt-humedad-sequedad-b2' },                 // noti  Humedad y sequedad: empapado, transpirar, en seco
  { lesson: 'nt-importancia-normalidad-b2' },           // noti  Importancia y normalidad: dar lo mismo, por norma
  { lesson: 'nt-interes-b2' },                          // noti  Interés: motivación, aburrir, centro de interés
  { lesson: 'nt-limpieza-b2' },                         // noti  Limpieza: mancha, ensuciar, limpiar a fondo
  { lesson: 'nt-localizacion-b2' },                     // noti  Localización: situado, quedar, hallarse
  { lesson: 'nt-materia-b2' },                          // noti  Materia: estar fabricado con, contener un ingrediente
  { lesson: 'nt-movimiento-estabilidad-b2' },           // noti  Movimiento y estabilidad: un verbo por cada fase
  { lesson: 'nt-necesidad-contingencia-b2' },           // noti  Necesidad y azar: imprescindible, inevitablemente, por cas
  { lesson: 'nt-orden-b2' },                            // noti  Orden: puesto, colocado/descolocado, por orden
  { lesson: 'nt-orientacion-direccion-b2' },            // noti  Orientación y dirección: dirigirse a, empujar/tirar, a dom
  { lesson: 'nt-origen-b2' },                           // noti  Origen: raíz, procedencia, proceder de
  { lesson: 'nt-permanencia-b2' },                      // noti  Permanencia: estable, fijo, sobrevivir
  { lesson: 'nt-posicion-absoluta-b2' },                // noti  Posición absoluta: tumbado, de rodillas, del revés
  { lesson: 'nt-posicion-relativa-b2' },                // noti  Posición relativa: delantero/trasero, a lo largo de, al ot
  { lesson: 'nt-presencia-ausencia-b2' },               // noti  Presencia y ausencia: asistir, faltar, a la vista
  { lesson: 'nt-proporcion-b2' },                       // noti  Proporción: partir, repartir, la sexta parte
  { lesson: 'nt-realidad-ficcion-b2' },                 // noti  Realidad y ficción: inventar, simular, cumplirse
  { lesson: 'nt-referencias-generales-b2' },            // noti  Referencias temporales: dedicar tiempo, a mediados de, hac
  { lesson: 'nt-reflexion-conocimiento-b2' },           // noti  Reflexión y conocimiento: ocurrírsele, ser consciente de, 
  { lesson: 'nt-repeticion-b2' },                       // noti  Repetición: rutina, ciclo, una y otra vez
  { lesson: 'nt-sabor-olor-b2' },                       // noti  Sabor y olor: soso, agridulce, oler a
  { lesson: 'nt-simultaneidad-b2' },                    // noti  Simultaneidad: mientras tanto, a la vez, coincidir
  { lesson: 'nt-localizacion-tiempo-b2' },              // noti  Situar en el tiempo: llevar sin, antiguamente, a corto/lar
  { lesson: 'nt-textura-acabado-b2' },                  // noti  Textura y acabado: áspero, arrugado, una mano de pintura
  { lesson: 'nt-utilidad-uso-b2' },                     // noti  Utilidad y uso: utilizar/emplear, fuera de servicio
  { lesson: 'nt-valor-precio-b2' },                     // noti  Valor y precio: invertir, estar en oferta, ganar/perder va
  { lesson: 'nt-visibilidad-vision-b2' },               // noti  Visibilidad y visión: a simple vista, distinguir, de lejos
  { lesson: 'fn-aceptar-propuesta-b2' },                // func  Aceptar una propuesta: me encantaría, si no hay más remedi
  { lesson: 'fn-aconsejar-b2' },                        // func  Aconsejar: si yo fuera tú, lo mejor sería que
  { lesson: 'fn-advertir-b2' },                         // func  Advertir: ¡ojo con...!, no te fíes de
  { lesson: 'fn-agradecer-b2' },                        // func  Agradecer: no sé cómo agradecértelo
  { lesson: 'fn-amenazar-b2' },                         // func  Amenazar: si no + presente, que sea la última vez
  { lesson: 'fn-animar-b2' },                           // func  Animar: no tengas miedo de, no te rindas, atrévete
  { lesson: 'fn-cerrar-rechazar-tema-b2' },             // func  Cerrar una digresión y rechazar un tema
  { lesson: 'fn-concluir-relato-b2' },                  // func  Concluir el relato: y bueno..., total que..., en fin...
  { lesson: 'fn-confirmar-info-previa-b2' },            // func  Confirmar información previa: claro que sí
  { lesson: 'fn-cuestionar-informacion-b2' },           // func  Cuestionar la información: dudar en voz alta
  { lesson: 'fn-dar-informacion-b2' },                  // func  Dar información: corregir con matiz, modo y finalidad
  { lesson: 'fn-dar-permiso-b2' },                      // func  Dar permiso: estás en tu casa, siempre y cuando
  { lesson: 'fn-dar-opinion-b2' },                      // func  Dar una opinión: a mi modo de ver, considero que, yo diría
  { lesson: 'fn-dar-orden-b2' },                        // func  Dar una orden: primera persona del plural para suavizar
  { lesson: 'fn-denegar-permiso-b2' },                  // func  Denegar permiso: me temo que no, no va a ser posible
  { lesson: 'fn-despedirse-b2' },                       // func  Despedirse: fórmulas escritas, del "atentamente" al "cordi
  { lesson: 'fn-destacar-elemento-b2' },                // func  Destacar un elemento: hay que tener en cuenta que
  { lesson: 'fn-dirigirse-bienvenida-b2' },             // func  Dirigirse a alguien y dar la bienvenida
  { lesson: 'fn-disculparse-b2' },                      // func  Disculparse: siento + lo de/infinitivo compuesto/que
  { lesson: 'fn-enviar-saludos-b2' },                   // func  Enviar y transmitir saludos: dale un abrazo de mi parte
  { lesson: 'fn-expresar-acuerdo-parcial-general-b2' }, // func  Estar de acuerdo con matices: parcial, en general, con eso
  { lesson: 'fn-expresar-certeza-b2' },                 // func  Estoy absolutamente seguro/convencido: certeza total
  { lesson: 'fn-aburrimiento-b2' },                     // func  Expresar aburrimiento: me aburre que, qué rollo
  { lesson: 'fn-acuerdo-b2' },                          // func  Expresar acuerdo
  { lesson: 'fn-expresar-acuerdo-rotundo-b2' },         // func  Expresar acuerdo rotundo: sin ninguna duda
  { lesson: 'fn-admiracion-orgullo-b2' },               // func  Expresar admiración y orgullo: qué + SN + tan + adjetivo
  { lesson: 'fn-afecto-b2' },                           // func  Expresar afecto: te echo de menos, me importas
  { lesson: 'fn-alegria-satisfaccion-b2' },             // func  Expresar alegría: me alegro de que, me pone de buen humor
  { lesson: 'fn-expresar-alivio-b2' },                  // func  Expresar alivio: ¡menos mal!
  { lesson: 'fn-aprobacion-desaprobacion-b2' },         // func  Expresar aprobación y desaprobación: no deberías haberlo h
  { lesson: 'fn-expresar-arrepentimiento-b2' },         // func  Expresar arrepentimiento: es una pena que...
  { lesson: 'fn-aversion-b2' },                         // func  Expresar aversión: detesto que, me da asco
  { lesson: 'fn-conocimiento-b2' },                     // func  Expresar conocimiento: me he enterado de que...
  { lesson: 'fn-expresar-decepcion-b2' },               // func  Expresar decepción: ¡qué decepción!
  { lesson: 'fn-expresar-desacuerdo-rotundo-b2' },      // func  Expresar desacuerdo rotundo: en absoluto
  { lesson: 'fn-deseos-b2' },                           // func  Expresar deseos: ojalá, me hace ilusión, sueño con
  { lesson: 'fn-empatia-b2' },                          // func  Expresar empatía: sé cómo te sientes, a mí me pasa lo mism
  { lesson: 'fn-enfado-indignacion-b2' },               // func  Expresar enfado e indignación: me indigna, no aguanto que
  { lesson: 'fn-esperanza-b2' },                        // func  Expresar esperanza: eso espero, ojalá
  { lesson: 'fn-falta-certeza-b2' },                    // func  Expresar falta de certeza y evidencia: tengo mis dudas sob
  { lesson: 'fn-falta-obligacion-b2' },                 // func  Expresar falta de obligación: no hace falta que...
  { lesson: 'fn-gustos-intereses-b2' },                 // func  Expresar gustos e intereses: entusiasmar, fascinar, apasio
  { lesson: 'fn-habilidad-b2' },                        // func  Expresar habilidad: negado para, se me da bien, tener faci
  { lesson: 'fn-expresar-hartazgo-b2' },                // func  Expresar hartazgo: ¡ya está bien!
  { lesson: 'fn-miedo-ansiedad-b2' },                   // func  Expresar miedo y preocupación: me preocupa que, tengo mied
  { lesson: 'fn-expresar-nerviosismo-b2' },             // func  Expresar nerviosismo: me pone nervioso, pierdo la pacienci
  { lesson: 'fn-placer-diversion-b2' },                 // func  Expresar placer y diversión: disfrutar de/con, estar a gus
  { lesson: 'fn-planes-intenciones-b2' },               // func  Expresar planes: propósito es..., y planes frustrados
  { lesson: 'fn-posibilidad-b2' },                      // func  Expresar posibilidad: el futuro y condicional de conjetura
  { lesson: 'fn-preferencia-b2' },                      // func  Expresar preferencia: prefiero que + subjuntivo + a que
  { lesson: 'fn-expresar-no-recordar-general-b2' },     // func  Expresar que no se recuerda: tres formas generales
  { lesson: 'fn-expresar-recordar-b2' },                // func  Expresar que se recuerda: recuerdo, me acuerdo de
  { lesson: 'fn-expresar-resignacion-b2' },             // func  Expresar resignación: no hay nada que hacer
  { lesson: 'fn-sensaciones-fisicas-b2' },              // func  Expresar sensaciones físicas: pasar hambre/frío, me agota
  { lesson: 'fn-sorpresa-extraneza-b2' },               // func  Expresar sorpresa: qué raro que, no puede ser
  { lesson: 'fn-tristeza-afliccion-b2' },               // func  Expresar tristeza: me da pena que, lo paso fatal
  { lesson: 'fn-verguenza-b2' },                        // func  Expresar vergüenza: me avergüenzo de, ponerse rojo
  { lesson: 'fn-buenos-deseos-b2' },                    // func  Formular buenos deseos: crucemos los dedos, que te pongas 
  { lesson: 'fn-identificar-b2' },                      // func  Identificar: el/los que, lo de, se trata de
  { lesson: 'fn-seguir-relato-b2' },                    // func  Indicar que se sigue el relato con interés: ya me lo imagi
  { lesson: 'fn-interrumpir-b2' },                      // func  Interrumpir: antes de que se me olvide, perdona que te int
  { lesson: 'fn-introducir-tema-relato-b2' },           // func  Introducir el tema del relato: ¿sabes qué?, ¿te has entera
  { lesson: 'fn-introducir-nuevo-tema-b2' },            // func  Introducir un nuevo tema: por cierto, hablando de...
  { lesson: 'fn-invitar-hipotesis-b2' },                // func  Invitar a formular una hipótesis: ¿qué harías si...?
  { lesson: 'fn-me-suena-b2' },                         // func  Me suena: reconocimiento parcial
  { lesson: 'fn-escepticismo-b2' },                     // func  Mostrar escepticismo: si tú lo dices, no lo veo tan claro
  { lesson: 'fn-no-he-olvidado-b2' },                   // func  No he olvidado: insistir en que se recuerda
  { lesson: 'fn-no-recuerdo-elaborado-b2' },            // func  No recuerdo / no me acuerdo de: con infinitivo, que y preg
  { lesson: 'fn-no-tengo-ni-idea-b2' },                 // func  No tengo ni idea: desconocimiento enfático
  { lesson: 'fn-ofrecerse-b2' },                        // func  Ofrecerse: déjame que te ayude, permita que le ayude
  { lesson: 'fn-pedir-ayuda-b2' },                      // func  Pedir ayuda: échame una mano, solicito tu colaboración
  { lesson: 'fn-pedir-confirmacion-b2' },               // func  Pedir confirmación: ¿es verdad que...?
  { lesson: 'fn-pedir-objetos-b2' },                    // func  Pedir objetos: tengo que pedirte una cosa...
  { lesson: 'fn-pedir-opinion-b2' },                    // func  Pedir opinión: qué opinas de que + subjuntivo
  { lesson: 'fn-pedir-permiso-b2' },                    // func  Pedir permiso: ¿te importaría que + subjuntivo?
  { lesson: 'fn-pedir-silencio-continuar-b2' },         // func  Pedir silencio y continuar: como decía...
  { lesson: 'fn-pedir-favor-b2' },                      // func  Pedir un favor: de forma encubierta
  { lesson: 'fn-pedir-valoracion-b2' },                 // func  Pedir valoración: ¿qué tal estuvo?, ¿cómo lo ves?
  { lesson: 'fn-preguntar-con-prudencia-b2' },          // func  Preguntar con prudencia: pedir permiso para preguntar
  { lesson: 'fn-preguntar-encubierta-b2' },             // func  Preguntar de forma encubierta: sin preguntar directamente
  { lesson: 'fn-preguntar-deseos-b2' },                 // func  Preguntar por deseos: ¿te habría gustado que...?
  { lesson: 'fn-preguntar-conocimiento-b2' },           // func  Preguntar por el conocimiento: ¿te has enterado de que...?
  { lesson: 'fn-estado-general-cosas-b2' },             // func  Preguntar por el estado general: ¿cómo va lo de...?
  { lesson: 'fn-preguntar-habilidad-b2' },              // func  Preguntar por la habilidad: ¿se te da bien...?
  { lesson: 'fn-preguntar-planes-b2' },                 // func  Preguntar por planes: ¿qué tienes en mente?, ¿tienes previ
  { lesson: 'fn-preguntar-persona-telefono-b2' },       // func  Preguntar por una persona: no se retire, ahora le paso
  { lesson: 'fn-preguntar-recordar-b2' },               // func  Preguntar si se recuerda: ¿te acuerdas de que...?
  { lesson: 'fn-contraargumento-b2' },                  // func  Presentar un contraargumento: sí, pero...
  { lesson: 'fn-prohibir-b2' },                         // func  Prohibir: está prohibido que, te prohíbo que
  { lesson: 'fn-proponer-sugerir-b2' },                 // func  Proponer y sugerir: habría que, estaría bien que
  { lesson: 'fn-rechazar-prohibicion-b2' },             // func  Rechazar una prohibición: pues claro que, no me da la gana
  { lesson: 'fn-rechazar-propuesta-b2' },               // func  Rechazar una propuesta: preferiría + contrapropuesta
  { lesson: 'fn-reprochar-b2' },                        // func  Reprochar: ya deberías haberlo solucionado
  { lesson: 'fn-responder-disculpa-b2' },               // func  Responder a una disculpa: con reproche o sin él
  { lesson: 'fn-responder-orden-b2' },                  // func  Responder a una petición: sí, pero solamente si...
  { lesson: 'fn-saludar-responder-b2' },                // func  Saludar y responder: vocal alargada, cuánto tiempo
  { lesson: 'fn-solicitar-comienzo-relato-b2' },        // func  Solicitar que comience un relato: pues verás..., te cuento
  { lesson: 'fn-tranquilizar-consolar-b2' },            // func  Tranquilizar y consolar: ya ha pasado, todo tiene solución
  { lesson: 'fn-valorar-b2' },                          // func  Valorar: lo veo/lo encuentro + adjetivo
  { lesson: 'dc-atenuacion-b2' },                       // disc  Cortesía atenuadora en B2: desplazar la persona, aplazar e
  { lesson: 'dc-perspectiva-temporal-b2' },             // disc  Desplazar el tiempo verbal: presente, futuro de probabilid
  { lesson: 'dc-entonacion-b2' },                       // disc  Entonación y alargamientos: lo que dice el tono
  { lesson: 'dc-focalizacion-b2' },                     // disc  Focalizar en B2: reduplicación del pronombre y ecos
  { lesson: 'dc-intensificacion-b2' },                  // disc  Intensificar en B2: prefijos, verbos performativos, alarga
  { lesson: 'dc-deixis-b2' },                           // disc  La deixis en B2: pronombre enfático, "se" mitigador
  { lesson: 'dc-valores-ilocutivos-b2' },               // disc  Lo que hace una pregunta en B2: dudas, ecos y retóricas
  { lesson: 'dc-mantenimiento-referente-b2' },          // disc  Mantener el referente: elipsis, sinónimos, hiperónimos
  { lesson: 'dc-marcadores-discurso-b2' },              // disc  Marcadores del discurso B2: contraargumentativos y reformu
  { lesson: 'dc-negacion-b2' },                         // disc  Matices de la negación: reiterada, enfática, artificiosa
  { lesson: 'dc-significados-interpretados-b2' },       // disc  Metáforas fijas: comparaciones con animales y verbos de ca
  { lesson: 'dc-cita-b2' },                             // disc  Procedimientos de cita: estilo indirecto y citas encubiert
  { lesson: 'dc-rematizacion-tematizacion-b2' },        // disc  Rematización y tematización en B2: ecuacionales y "lo de"
  { lesson: 'gn-argumentativa-b2' },                    // genr  Argumentar en B2: tesis, fuente, contraargumentación, rese
  { lesson: 'gn-descriptiva-lugares-b2' },              // genr  Describir lugares en B2: de la planta a la anécdota
  { lesson: 'gn-descriptiva-objetos-b2' },              // genr  Describir objetos en B2: del tomate al desarrollo formal
  { lesson: 'gn-descriptiva-personas-b2' },             // genr  Describir personas en B2: anclaje, aspectualización, puest
  { lesson: 'gn-expositiva-b2' },                       // genr  Exponer un tema en B2: presentar, desarrollar, concluir
  { lesson: 'gn-generos-escritos-b2' },                 // genr  Géneros escritos en B2: cartas al director, informes, biog
  { lesson: 'gn-generos-orales-b2' },                   // genr  Géneros orales en B2: qué debes entender, qué debes produc
  { lesson: 'gn-carta-solicitud-trabajo-b2' },          // genr  La carta de solicitud de trabajo
  { lesson: 'gn-composicion-argumentativa-b2' },        // genr  La composición argumentativa (B2)
  { lesson: 'gn-llamada-transaccional-b2' },            // genr  La llamada telefónica transaccional (B2): una cadena más l
  { lesson: 'gn-narrativa-b2' },                        // genr  La macrofunción narrativa en B2: las cinco etapas del rela
  { lesson: 'gn-presentacion-publica-b2' },             // genr  Una presentación pública (B2)
  { lesson: 'gn-reclamacion-b2' },                      // genr  La carta de reclamación

  /* ---- C1 · 191 days · starts at index 560 ------------------------------- */
  { lesson: 'gr-clases-adjetivos-c1' },                 // gram  Cuyo, los adjetivos de color compuestos y el relacional qu
  { lesson: 'gr-articulo-definido-c1' },                // gram  El artículo definido en C1: valor enfático y sustantivador
  { lesson: 'gr-articulo-indefinido-c1' },              // gram  El artículo indefinido en C1: convertir un nombre propio e
  { lesson: 'gr-genero-sustantivos-c1' },               // gram  El género que cambia el significado: el fruto / la fruta
  { lesson: 'gr-numero-sustantivos-c1' },               // gram  El número en C1: dónde se mueve el acento, qué cambia de s
  { lesson: 'gr-demostrativos-c1' },                    // gram  Los demostrativos en C1: proximidad discursiva, condescend
  { lesson: 'gr-exclamativos-c1' },                     // gram  Los exclamativos en C1: cuánto + valorativo, dónde, y el o
  { lesson: 'gr-posesivos-c1' },                        // gram  Los posesivos en C1: cuantificador, sufrimiento, y el "mío
  { lesson: 'gr-nombres-escuetos-c1' },                 // gram  Nombres escuetos: sin artículo, aunque el verbo lo pida
  { lesson: 'dc-atenuacion-dialogica-c1' },             // disc  Atenuación dialógica: discrepar sin romper nada
  { lesson: 'dc-atenuacion-c1' },                       // disc  Atenuación: decirlo sin señalar a nadie
  { lesson: 'dc-estilo-indirecto-c1' },                 // disc  Estilo indirecto: el verbo que interpreta
  { lesson: 'dc-focalizacion-c1' },                     // disc  Focalizar en C1: el artículo que exclama, la dislocación q
  { lesson: 'dc-deixis-c1' },                           // disc  La deixis en C1: el pronombre que desambigua, el que despe
  { lesson: 'dc-mantenimiento-referente-c1' },          // disc  Mantener el referente: proformas globalizadoras
  { lesson: 'dc-reformuladores-c1' },                   // disc  Reformuladores: volver a decirlo mejor
  { lesson: 'gr-adverbios-conjuntivos-c1' },            // gram  Adverbios conjuntivos: matizar una coordinación sin ser un
  { lesson: 'gr-adverbios-externos-c1' },               // gram  Adverbios externos al dictum: el punto de vista que envuel
  { lesson: 'gr-adverbios-nucleares-c1' },              // gram  Adverbios nucleares en C1: dónde va el modo, y por qué
  { lesson: 'gr-complementos-adjetival-c1' },           // gram  Complementos del adjetivo en C1: interrogativas, superlati
  { lesson: 'gr-complementos-nominal-c1' },             // gram  Complementos del nombre en C1: la ambigüedad como norma
  { lesson: 'gr-complementos-verbales-c1' },            // gram  Complementos verbales en C1: leísmo, laísmo, loísmo y el p
  { lesson: 'gr-concordancia-oracional-c1' },           // gram  Concordancia ad sensum en C1: cuando el sentido gana a la 
  { lesson: 'gr-cuantificadores-propios-c1' },          // gram  Cuantificadores propios en C1: cuanto, cada uno, cualquier
  { lesson: 'gr-imperativo-c1' },                       // gram  El imperativo en C1: cuando no manda nada
  { lesson: 'gr-nucleo-verbal-c1' },                    // gram  El núcleo del sintagma verbal en C1: pasivas, perífrasis y
  { lesson: 'gr-pronombre-personal-c1' },               // gram  El pronombre personal en C1: desambiguar, personificar, la
  { lesson: 'gr-formas-no-personales-c1' },             // gram  Formas no personales en C1: infinitivo, gerundio y partici
  { lesson: 'gr-interrogativos-c1' },                   // gram  Los interrogativos en C1: cuándo se separan, cuándo se coo
  { lesson: 'gr-relativos-c1' },                        // gram  Relativos en C1: el cual, quien, y el "que" que rechaza un
  { lesson: 'gr-sub-adv-causales-c1' },                 // gram  Subordinadas causales en C1: énfasis con "porque" antepues
  { lesson: 'gr-sub-adv-comparativas-c1' },             // gram  Subordinadas comparativas en C1: cuatro comparaciones con 
  { lesson: 'gr-sub-adv-concesivas-c1' },               // gram  Subordinadas concesivas en C1: reduplicación universal, po
  { lesson: 'gr-sub-adv-condicionales-c1' },            // gram  Subordinadas condicionales en C1: registros, matices y la 
  { lesson: 'gr-sub-adv-consecutivas-c1' },             // gram  Subordinadas consecutivas en C1: intensidad, suspensión y 
  { lesson: 'gr-sub-adv-lugar-modo-c1' },               // gram  Subordinadas de lugar y de modo en C1: "para donde" y el m
  { lesson: 'gr-sub-adjetivas-relativo-c1' },           // gram  Subordinadas de relativo en C1: antecedentes especiales y 
  { lesson: 'gr-sub-adv-finales-c1' },                  // gram  Subordinadas finales en C1: cuando "para" deja de ser sobr
  { lesson: 'gr-sub-sustantivas-c1' },                  // gram  Subordinadas sustantivas en C1: cuándo el infinitivo reemp
  { lesson: 'gr-sub-adv-temporales-c1' },               // gram  Subordinadas temporales en C1: "antes de" hiperbólico y el
  { lesson: 'gr-tiempos-indicativo-c1' },               // gram  Tiempos verbales de indicativo en C1: cada tiempo, su obje
  { lesson: 'gr-tiempos-subjuntivo-c1' },               // gram  Tiempos verbales de subjuntivo en C1: lo que decide la neg
  { lesson: 'nt-acabado-c1' },                          // noti  Acabado en C1: de "en bruto" a "metalizado"
  { lesson: 'nt-accesibilidad-limpieza-c1' },           // noti  Accesibilidad y limpieza en C1: "obstruido" y "estar hecho
  { lesson: 'nt-aceptabilidad-c1' },                    // noti  Aceptabilidad en C1: de "razonable" a "disparate", y "no p
  { lesson: 'nt-acontecimiento-c1' },                   // noti  Acontecimiento en C1: de la odisea al hecho aislado
  { lesson: 'nt-adecuacion-c1' },                       // noti  Adecuación en C1: "guardar las formas" y "estar contraindi
  { lesson: 'nt-anterioridad-c1' },                     // noti  Anterioridad en C1: precedentes, antepasados y "de anteman
  { lesson: 'nt-anticipacion-c1' },                     // noti  Anticipación en C1: prever, predecir y "por anticipado"
  { lesson: 'nt-atractivo-calidad-c1' },                // noti  Atractivo y calidad en C1: de "apuesto" a "vulgar", de "de
  { lesson: 'nt-audibilidad-audicion-c1' },             // noti  Audibilidad y audición en C1: de "susurro" a "dar gritos"
  { lesson: 'nt-aumento-disminucion-c1' },              // noti  Aumento y disminución en C1: de "ir en aumento" a "dispara
  { lesson: 'nt-cambio-c1' },                           // noti  Cambio en C1: transiciones, transformaciones y verbos deri
  { lesson: 'nt-cantidad-numerica-c1' },                // noti  Cantidad numérica en C1: calcular "por lo alto" o "por lo 
  { lesson: 'nt-cantidad-relativa-c1' },                // noti  Cantidad relativa en C1: colectivos, porciones y cantidade
  { lesson: 'nt-capacidad-competencia-c1' },            // noti  Capacidad y competencia en C1: ser "un hacha" o "un manaza
  { lesson: 'nt-certeza-incertidumbre-c1' },            // noti  Certeza e incertidumbre en C1: de "cabe la posibilidad" a 
  { lesson: 'nt-color-c1' },                            // noti  Color en C1: matices, gamas y verbos que cambian el color
  { lesson: 'nt-conformidad-c1' },                      // noti  Conformidad en C1: "hacer la vista gorda" y "no quedar más
  { lesson: 'nt-consistencia-resistencia-c1' },         // noti  Consistencia y resistencia en C1: "fuerte como un roble", 
  { lesson: 'nt-continuacion-c1' },                     // noti  Continuación en C1: retomar, perseverar y "sin cesar"
  { lesson: 'nt-correccion-c1' },                       // noti  Corrección en C1: de "un acierto" a "a la perfección"
  { lesson: 'nt-cualidad-general-c1' },                 // noti  Cualidad general en C1: naturaleza, apariencia y composici
  { lesson: 'nt-disponibilidad-c1' },                   // noti  Disponibilidad en C1: desde "a mano" hasta "no estar para 
  { lesson: 'nt-distancia-c1' },                        // noti  Distancia en C1: de "manzanas" a "acortar distancias"
  { lesson: 'nt-distancia-velocidad-c1' },              // noti  Distancia y velocidad en C1: del "año luz" al "exceso de v
  { lesson: 'nt-duracion-transcurso-c1' },              // noti  Duración en C1: de lo "fugaz" a lo "perpetuo"
  { lesson: 'nt-edad-vejez-c1' },                       // noti  Edad y vejez en C1: novato, veterano y "no pasar los años 
  { lesson: 'nt-evaluacion-general-c1' },               // noti  Evaluación general en C1: de "pasable" a "catastrófico"
  { lesson: 'nt-existencia-inexistencia-c1' },          // noti  Existencia e inexistencia en C1: nacer, formarse y dejar d
  { lesson: 'nt-exito-logro-c1' },                      // noti  Éxito y logro en C1: de "estar en pleno auge" a "ganar por
  { lesson: 'nt-expresion-verbal-c1' },                 // noti  Expresión verbal en C1: de "dejar caer" a "poner algo en c
  { lesson: 'nt-facilidad-c1' },                        // noti  Facilidad en C1: "fácil de entender" y los verbos que faci
  { lesson: 'nt-finalizacion-c1' },                     // noti  Finalización en C1: caducar, vencer y "acabar por volverme
  { lesson: 'nt-formas-figuras-c1' },                   // noti  Formas y figuras en C1: de la "silueta" al "zigzag"
  { lesson: 'nt-frecuencia-c1' },                       // noti  Frecuencia en C1: de "rara vez" a "el pan de cada día"
  { lesson: 'nt-generalidad-especificidad-c1' },        // noti  Generalidad y especificidad en C1: de "por lo general" a "
  { lesson: 'nt-grado-c1' },                            // noti  Grado en C1: de "lo grande que es" a "por todo lo alto"
  { lesson: 'nt-humedad-sequedad-c1' },                 // noti  Humedad y sequedad en C1: "ponerse como una sopa" y cocina
  { lesson: 'nt-importancia-c1' },                      // noti  Importancia en C1: de "trascendencia" a "importarle un pim
  { lesson: 'nt-inicio-c1' },                           // noti  Inicio en C1: de "dar comienzo" a "¡manos a la obra!"
  { lesson: 'nt-interes-c1' },                          // noti  Interés en C1: de "apasionante" a "morirse de aburrimiento
  { lesson: 'nt-localizacion-c1' },                     // noti  Localización en C1: ubicar, situar y "en paradero desconoc
  { lesson: 'nt-localizacion-futuro-c1' },              // noti  Localizar en el futuro en C1: "de un momento a otro" y "a 
  { lesson: 'nt-localizacion-pasado-c1' },              // noti  Localizar en el pasado en C1: eras, herencia y "en tiempos
  { lesson: 'nt-localizacion-presente-c1' },            // noti  Localizar en el presente en C1: actualidad, tendencia y "e
  { lesson: 'nt-movimiento-locuciones-c1' },            // noti  Locuciones de movimiento en C1: de "dar marcha atrás" a "i
  { lesson: 'nt-materia-c1' },                          // noti  Materia en C1: de la seda al cartón piedra
  { lesson: 'nt-medidas-generales-tamano-c1' },         // noti  Medidas generales, talla y tamaño en C1: de "a ojo" a "gig
  { lesson: 'nt-movimiento-estabilidad-sustantivos-c1' },// noti  Movimiento y estabilidad en C1: nombrar el tipo de movimie
  { lesson: 'nt-necesidad-obligacion-c1' },             // noti  Necesidad, contingencia y obligación en C1: de lo prescind
  { lesson: 'nt-normalidad-c1' },                       // noti  Normalidad en C1: de lo "convencional" a "un fuera de seri
  { lesson: 'nt-olor-c1' },                             // noti  Olor en C1: de "fragancia" a "peste"
  { lesson: 'nt-orden-c1' },                            // noti  Orden en C1: series, secuencias y "por orden de prioridad"
  { lesson: 'nt-orientacion-direccion-c1' },            // noti  Orientación y dirección en C1: "con rumbo a" y "sin rumbo 
  { lesson: 'nt-origen-c1' },                           // noti  Origen en C1: la "semilla" y la "raíz" de las cosas
  { lesson: 'nt-permanencia-c1' },                      // noti  Permanencia en C1: lo imborrable, lo inalterable y "conser
  { lesson: 'nt-peso-superficie-c1' },                  // noti  Peso y superficie en C1: de "peso bruto" a "de norte a sur
  { lesson: 'nt-posicion-absoluta-c1' },                // noti  Posición absoluta en C1: inclinado, torcido, empinado
  { lesson: 'nt-posicion-relativa-c1' },                // noti  Posición relativa en C1: "a la vuelta de la esquina" y "al
  { lesson: 'nt-posterioridad-c1' },                    // noti  Posterioridad en C1: de "apenas" a "con posterioridad"
  { lesson: 'nt-precision-claridad-c1' },               // noti  Precisión y claridad en C1: de "matemático" a "un lío"
  { lesson: 'nt-presencia-ausencia-c1' },               // noti  Presencia y ausencia en C1: de "estar hasta arriba" a "cua
  { lesson: 'nt-proporcion-c1' },                       // noti  Proporción en C1: fracciones, cuotas y "tres de cada diez"
  { lesson: 'nt-puntualidad-singularidad-c1' },         // noti  Puntualidad y singularidad en C1: "por los pelos" y "sin p
  { lesson: 'nt-realidad-ficcion-c1' },                 // noti  Realidad y ficción en C1: idealizar, disimular y volver a 
  { lesson: 'nt-referencias-generales-c1' },            // noti  Referencias temporales generales en C1: de "a primeros de 
  { lesson: 'nt-reflexion-conocimiento-c1' },           // noti  Reflexión y conocimiento en C1: "consultar con la almohada
  { lesson: 'nt-repeticion-c1' },                       // noti  Repetición en C1: recurrente, turnarse y "erre que erre"
  { lesson: 'nt-retraso-c1' },                          // noti  Retraso en C1: atraso, demora y aplazamiento
  { lesson: 'nt-sabor-c1' },                            // noti  Sabor en C1: catar, saborear y "estar para chuparse los de
  { lesson: 'nt-simultaneidad-c1' },                    // noti  Simultaneidad en C1: "al tiempo que" y "en el mismo instan
  { lesson: 'nt-temperatura-c1' },                      // noti  Temperatura en C1: de "un frío que pela" a "al rojo vivo"
  { lesson: 'nt-textura-c1' },                          // noti  Textura en C1: rugoso, sedoso y "al tacto"
  { lesson: 'nt-utilidad-uso-c1' },                     // noti  Utilidad y uso en C1: de "hacer uso de" a "ser un trasto"
  { lesson: 'nt-valor-precio-c1' },                     // noti  Valor y precio en C1: de "estar tirado" a "precio de coste
  { lesson: 'nt-movimiento-verbos-especificos-c1' },    // noti  Verbos de movimiento en C1: de "vagar" a "tambalearse"
  { lesson: 'nt-visibilidad-vision-c1' },               // noti  Visibilidad y visión en C1: "saltar a la vista" y "mirar p
  { lesson: 'nt-volumen-capacidad-presion-c1' },        // noti  Volumen, capacidad y presión en C1: de "dar volumen al cab
  { lesson: 'fn-aceptar-rechazar-propuesta-c1' },       // func  Aceptar y rechazar propuestas en C1: "no te voy a decir qu
  { lesson: 'fn-aconsejar-advertir-amenazar-c1' },      // func  Aconsejar, advertir y amenazar en C1: "allá tú" cambia de 
  { lesson: 'fn-afecto-sensaciones-c1' },               // func  Afecto y sensaciones físicas en C1: "estoy hecho polvo" y 
  { lesson: 'fn-agradecer-pesame-c1' },                 // func  Agradecer y dar el pésame en C1: "¿qué haría yo sin ti?" y
  { lesson: 'fn-arrepentimiento-verguenza-c1' },        // func  Arrepentimiento y vergüenza en C1: "si volviera a nacer...
  { lesson: 'fn-certeza-evidencia-c1' },                // func  Certeza y su ausencia en C1: de "sin lugar a dudas" a "jur
  { lesson: 'fn-confirmar-informacion-previa-c1' },     // func  Confirmar información previa en C1: "así es", "¡y tanto!" 
  { lesson: 'fn-conocimiento-desconocimiento-c1' },     // func  Conocimiento y desconocimiento en C1: de "¿te has enterado
  { lesson: 'fn-dar-informacion-c1' },                  // func  Dar información en C1: de las subordinadas de lugar a "¡¿C
  { lesson: 'fn-orden-instruccion-c1' },                // func  Dar una orden en C1: de "tú te callas" a la orden encubier
  { lesson: 'fn-decepcion-resignacion-c1' },            // func  Decepción y resignación en C1: "¡vaya, hombre!" y "que sea
  { lesson: 'fn-deseos-planes-c1' },                    // func  Deseos y planes en C1: "¡quién tuviera...!" y "estoy por..
  { lesson: 'fn-destacar-silencio-tema-cierre-c1' },    // func  Destacar, pedir silencio, cambiar de tema y cerrar en C1
  { lesson: 'fn-disculparse-responder-c1' },            // func  Disculparse y responder en C1: "mil perdones" y "por esta 
  { lesson: 'fn-empatia-alivio-esperanza-c1' },         // func  Empatía, alivio y esperanza en C1: "me pongo en tu lugar" 
  { lesson: 'fn-escepticismo-contraargumento-c1' },     // func  Escepticismo y contraargumento en C1: "no te falta razón, 
  { lesson: 'fn-expresar-acuerdo-c1' },                 // func  Expresar acuerdo en C1: de "algo de razón tienes" a "¡exac
  { lesson: 'fn-aprobacion-desaprobacion-c1' },         // func  Expresar aprobación y desaprobación en C1: de "apruebo" a 
  { lesson: 'fn-expresar-desacuerdo-c1' },              // func  Expresar desacuerdo en C1: de "no me convence" a "¡de eso 
  { lesson: 'fn-habilidad-c1' },                        // func  Expresar habilidad en C1: de "soy un hacha" a "soy patoso 
  { lesson: 'fn-felicitar-despedirse-c1' },             // func  Felicitar y despedirse en C1: "estás de enhorabuena" y "si
  { lesson: 'fn-hipotesis-posibilidad-c1' },            // func  Formular hipótesis y expresar posibilidad en C1: "¿y si...
  { lesson: 'fn-gustos-aversion-c1' },                  // func  Gustos y aversión en C1: de "adoro" a "me da náuseas"
  { lesson: 'fn-hartazgo-enfado-c1' },                  // func  Hartazgo y enfado en C1: "hasta la coronilla" y "de un hum
  { lesson: 'fn-identificar-c1' },                      // func  Identificar en C1: "el que suscribe" y las hendidas "lo qu
  { lesson: 'fn-introducir-relato-atencion-c1' },       // func  Introducir un relato y controlar la atención en C1: "¿me s
  { lesson: 'fn-miedo-nerviosismo-c1' },                // func  Miedo y nerviosismo en C1: "el corazón en un puño" y "los 
  { lesson: 'fn-obligacion-necesidad-c1' },             // func  Obligación y necesidad en C1: de "es mi obligación" a "bas
  { lesson: 'fn-pedir-confirmacion-c1' },               // func  Pedir confirmación en C1: de "¿a que sí?" a "tengo entendi
  { lesson: 'fn-favor-objetos-ayuda-c1' },              // func  Pedir favores, objetos y ayuda en C1: la misma escalera de
  { lesson: 'fn-pedir-informacion-c1' },                // func  Pedir información en C1: de "¿qué es lo que...?" a "¿me pe
  { lesson: 'fn-pedir-dar-opinion-c1' },                // func  Pedir y dar opinión en C1: "a mi entender" y "en mi modest
  { lesson: 'fn-permiso-prohibicion-c1' },              // func  Permiso y prohibición en C1: "eso ni se pregunta" y "digas
  { lesson: 'fn-preferencia-indiferencia-c1' },         // func  Preferencia e indiferencia en C1: "no cambio... por nada d
  { lesson: 'fn-estado-animo-alegria-c1' },             // func  Preguntar por el ánimo y expresar alegría en C1: "estoy co
  { lesson: 'fn-estado-general-cosas-c1' },             // func  Preguntar por el estado general de las cosas: la pregunta 
  { lesson: 'fn-proponer-ofrecer-confirmar-c1' },       // func  Proponer, ofrecer y confirmar en C1: "no puedes faltar" y 
  { lesson: 'fn-recordar-olvidar-c1' },                 // func  Recordar y olvidar en C1: "lo tengo en la punta de la leng
  { lesson: 'fn-repetir-orden-c1' },                    // func  Repetir una orden en C1: "¿cuántas veces tengo que repetir
  { lesson: 'fn-reprochar-ofrecerse-c1' },              // func  Reprochar y ofrecerse en C1: "¿no te da vergüenza?" y "cue
  { lesson: 'fn-responder-saludo-dirigirse-c1' },       // func  Responder a un saludo y dirigirse a alguien en C1: "seguim
  { lesson: 'fn-responder-orden-peticion-c1' },         // func  Responder a una petición en C1: de "faltaría más" a "¡ni l
  { lesson: 'fn-saludar-c1' },                          // func  Saludar en C1: de "¿qué es de tu vida?" a "señora ministra
  { lesson: 'fn-sorpresa-admiracion-c1' },              // func  Sorpresa y admiración en C1: "me quedo con la boca abierta
  { lesson: 'fn-tranquilizar-animar-c1' },              // func  Tranquilizar y animar en C1: "el no ya lo tienes" y "no es
  { lesson: 'fn-tristeza-placer-c1' },                  // func  Tristeza y placer en C1: "se me rompe el corazón" y "me pa
  { lesson: 'fn-valorar-c1' },                          // func  Valorar en C1: "de pésimo gusto" y "resulta vergonzoso"
  { lesson: 'dc-citas-encubiertas-c1' },                // disc  Citas encubiertas: decirlo sin responder de ello
  { lesson: 'dc-imperfecto-modal-c1' },                 // disc  El imperfecto que no habla del pasado
  { lesson: 'dc-indefinido-perfecto-c1' },              // disc  Indefinido o perfecto: acercar y alejar lo ocurrido
  { lesson: 'dc-intensificacion-c1' },                  // disc  Intensificar en C1: sufijos, entonación suspendida, el "qu
  { lesson: 'dc-valores-ilocutivos-c1' },               // disc  Lo que hace una pregunta en C1: saludo, crítica, eco recap
  { lesson: 'dc-metaforas-c1' },                        // disc  Metáforas: el juicio escondido en la gramática
  { lesson: 'dc-negacion-c1' },                         // disc  Negación en C1: velada, diluida, obviada
  { lesson: 'dc-rematizacion-tematizacion-c1' },        // disc  Rematización y tematización en C1: el orden que hace la pr
  { lesson: 'gn-argumentativa-c1' },                    // genr  Argumentar: de la cuestión polémica a la reserva final
  { lesson: 'gn-narrativa-c1' },                        // genr  Contar una anécdota: las cinco etapas
  { lesson: 'gn-descriptiva-personas-c1' },             // genr  Describir a una persona: anclar, detallar, relacionar
  { lesson: 'gn-descriptiva-lugares-c1' },              // genr  Describir un lugar: de fuera adentro, con un porqué
  { lesson: 'gn-descriptiva-objetos-c1' },              // genr  Describir un objeto: del hecho general a la vivencia propi
  { lesson: 'gn-argumentativa-conectores-c1' },         // genr  El repertorio del ensayo argumentativo
  { lesson: 'gn-trabajo-academico-c1' },                // genr  El trabajo académico: de lo general a lo no resuelto
  { lesson: 'gn-expositiva-c1' },                       // genr  Exponer un tema: presentar, desarrollar, concluir
  { lesson: 'gn-generos-escritos-c1' },                 // genr  Géneros escritos en C1: el informe extenso y la reseña pro
  { lesson: 'gn-generos-orales-c1' },                   // genr  Géneros orales en C1: intervenir en tu especialidad
  { lesson: 'gn-carta-comercial-c1' },                  // genr  La carta comercial: atención, interés, deseo, acción
  { lesson: 'gn-carta-reclamacion-c1' },                // genr  La carta de reclamación: motivo, argumento, solución
  { lesson: 'gn-composicion-escrita-c1' },              // genr  La composición escrita: título, hoja de ruta, síntesis
  { lesson: 'gn-presentacion-publica-c2' },             // genr  La presentación pública: el nivel más pulido
  { lesson: 'gn-presentacion-publica-c1' },             // genr  La presentación pública: la estructura completa
  { lesson: 'gn-resena-c1' },                           // genr  La reseña crítica
  { lesson: 'dc-ironia-c1' },                           // disc  Indicadores de ironía: cómo se marca que no lo dices en se
];

// Where each band starts. A band is a slice of one course, not a pool.
window.COURSE_BANDS = {"A1":0,"A2":86,"B1":192,"B2":350,"C1":560};
