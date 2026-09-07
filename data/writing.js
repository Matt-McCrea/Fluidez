/* ============================================================================
 * WRITING TASKS — the "Producir" (Produce) stage: real output.
 *
 *   build     : reorder scrambled words into the target `answer` (auto-checked).
 *   translate : translate the English `prompt` to Spanish. `constraints` are
 *               auto-checked live; `models` are shown on reveal for self-check.
 *   write     : open prompt. `constraints` verify the mechanics you're
 *               practising (auto); `models` show natural answers to compare to.
 *   paragraph : like `write` but a connected multi-sentence answer (taller box,
 *               word/sentence counter). Constraints span the whole paragraph
 *               (e.g. minWords 40, two tenses, a connector).
 *
 * Every `models` answer must satisfy that task's own constraints
 * (tools/test-checker.js enforces this — self-inconsistent tasks fail the build).
 * ========================================================================== */
window.WRITING_TASKS = [

  // ---- connected paragraphs (level 2+; connect ideas, mix tenses) ----
  { id: 'p-yesterday', type: 'paragraph', level: 2, theme: 'trabajo',
    prompt: 'Write a short paragraph (3+ sentences) about what you did yesterday and how it went.',
    hint: 'Narrate with the preterite; describe the background with the imperfect; join ideas with y, pero, porque.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'luego', 'después'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Ayer trabajé mucho porque tenía una reunión muy importante por la mañana. Estaba cansado, pero después cené con mis amigos y hablamos durante muchas horas. Fue un día largo y difícil, pero bueno al final.'] },

  { id: 'p-routine', type: 'paragraph', level: 2, theme: 'trabajo',
    prompt: 'Describe your typical day, from morning to night.',
    hint: 'Present tense and time markers (por la mañana, luego, todos los días). Join your sentences.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['luego', 'después', 'por la mañana', 'todos los días', 'y'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Todos los días me levanto temprano y desayuno café. Por la mañana trabajo en la oficina, luego como con mis compañeros. Después estudio español y por la noche leo un rato antes de dormir.'] },

  { id: 'p-plans', type: 'paragraph', level: 3, theme: 'viajes',
    prompt: 'Write a paragraph about your plans and hopes for next year.',
    hint: 'Use the future; connect your ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['El próximo año viajaré a México porque quiero aprender mucho más español. También buscaré un trabajo nuevo y ahorraré bastante dinero. Será un año importante y difícil, pero estoy muy ilusionado.'] },


  // ---- sentence building (warm-up output) ----
  { id: 'b-restaurant', type: 'build', level: 2, theme: 'alimentacion', en: 'Yesterday I ate at a restaurant.',
    answer: 'Ayer comí en un restaurante.' },
  { id: 'b-travel', type: 'build', level: 1, theme: 'viajes', en: 'She wants to travel to Spain.',
    answer: 'Ella quiere viajar a España.' },
  { id: 'b-house', type: 'build', level: 1, theme: 'vivienda', en: 'We live in a big house.',
    answer: 'Vivimos en una casa grande.' },

  // ---- guided translation (constraints + model) ----
  { id: 't-paella', type: 'translate', level: 2, theme: 'alimentacion',
    prompt: 'Translate: “Yesterday I ate paella with my family.”',
    hint: 'A finished past event → preterite.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'ayer' }
    ],
    models: ['Ayer comí paella con mi familia.'] },

  { id: 't-thanks', type: 'translate', level: 1, theme: 'relaciones',
    prompt: 'Translate: “Thanks for your help with the project.”',
    hint: '“thanks for” is a fixed phrase.',
    constraints: [
      { type: 'containsWord', word: 'gracias por' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Gracias por tu ayuda con el proyecto.'] },

  // ---- constrained free writing (the core output work) ----
  { id: 'w-yesterday', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Write one sentence about what you did yesterday.',
    hint: 'Start with “Ayer” and use the preterite.',
    constraints: [
      { type: 'containsWord', word: 'ayer' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Ayer trabajé y luego cené con mis amigos.', 'Ayer estudié español por dos horas.'] },

  { id: 'w-here-now', type: 'write', level: 1, theme: 'caracter',
    prompt: 'Say where you are right now and how you feel.',
    hint: 'Location and feelings both use estar.',
    constraints: [
      { type: 'verbFormAny', inf: 'estar', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Estoy en casa y estoy muy cansado.', 'Estoy en la oficina y estoy contento.'] },

  { id: 'w-habit', type: 'write', level: 1, theme: 'medios',
    prompt: 'Write about something you do every day.',
    hint: 'Present tense + “todos los días”.',
    constraints: [
      { type: 'containsWord', word: 'todos los días' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Todos los días bebo café y leo el periódico.', 'Todos los días camino al trabajo.'] },

  { id: 'w-future', type: 'write', level: 3, theme: 'viajes',
    prompt: 'Write one sentence about your plans for next weekend.',
    hint: 'Use the future tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'minWords', n: 5 }
    ],
    models: ['El próximo fin de semana viajaré a la montaña.', 'Este fin de semana saldré con mis amigos.'] },

  { id: 'w-want', type: 'write', level: 4, theme: 'relaciones',
    prompt: 'Say what you want someone else to do. Start with “Quiero que…”.',
    hint: 'After “quiero que”, the next verb is subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'quiero que', label: 'start with “quiero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Quiero que tú vengas a mi casa.', 'Quiero que ellos digan la verdad.'] },

  { id: 'w-contrast', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Write a sentence that contrasts two ideas using “pero”.',
    hint: 'e.g. “I\'m tired, but…”.',
    constraints: [
      { type: 'containsAny', words: ['pero', 'aunque'] },
      { type: 'minWords', n: 6 }
    ],
    models: ['Estoy cansado, pero quiero salir esta noche.', 'Me gusta el café, pero prefiero el té.'] },

  // ---- more sentence building ----
  { id: 'b-market2', type: 'build', level: 1, theme: 'alimentacion', en: 'I need fresh fruit and bread.',
    answer: 'Necesito fruta fresca y pan.' },
  { id: 'b-weather', type: 'build', level: 1, theme: 'naturaleza', en: 'Today the weather is very nice.',
    answer: 'Hoy hace muy buen tiempo.' },
  { id: 'b-yesterday-work', type: 'build', level: 2, theme: 'trabajo', en: 'Yesterday we worked until eight.',
    answer: 'Ayer trabajamos hasta las ocho.' },
  { id: 'b-future-trip', type: 'build', level: 3, theme: 'viajes', en: 'Next year I will travel to Chile.',
    answer: 'El año que viene viajaré a Chile.' },
  { id: 'b-wish', type: 'build', level: 4, theme: 'relaciones', en: 'I hope you all arrive early.',
    answer: 'Espero que vosotros lleguéis temprano.' },

  // ---- more guided translation ----
  { id: 't-cumple', type: 'translate', level: 2, theme: 'relaciones',
    prompt: 'Translate: “Last week I spent my birthday with my friends.”',
    hint: 'A finished past event → preterite.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'semana pasada' }
    ],
    models: ['La semana pasada pasé mi cumpleaños con mis amigos.'] },

  { id: 't-childhood', type: 'translate', level: 2, theme: 'identidad',
    prompt: 'Translate: “When I was a child, I lived in a small town.”',
    hint: 'Background/habitual past → imperfect.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'de niño' }
    ],
    models: ['De niño, vivía en un pueblo pequeño.'] },

  { id: 't-future-plans', type: 'translate', level: 3, theme: 'viajes',
    prompt: 'Translate: “Next summer we will travel to Greece.”',
    hint: 'Use the future tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'nosotros' },
      { type: 'containsWord', word: 'verano' }
    ],
    models: ['El próximo verano viajaremos a Grecia.'] },

  { id: 't-already-done', type: 'translate', level: 3, theme: 'trabajo',
    prompt: 'Translate: “I have already finished the report.”',
    hint: 'Use the present perfect.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'ya' }
    ],
    models: ['Ya he terminado el informe.'] },

  { id: 't-hope-subjunctive', type: 'translate', level: 4, theme: 'relaciones',
    prompt: 'Translate: “I hope that you (tú) call me tomorrow.”',
    hint: 'After “espero que”, use the subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'espero que', label: 'start with “espero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Espero que tú me llames mañana.'] },

  // ---- more constrained free writing ----
  { id: 'w-morning-routine', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Write one sentence about what you do every morning.',
    hint: 'Present tense + “todas las mañanas”.',
    constraints: [
      { type: 'containsWord', word: 'todas las mañanas' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Todas las mañanas desayuno y camino al trabajo.', 'Todas las mañanas bebo café y leo las noticias.'] },

  { id: 'w-description', type: 'write', level: 1, theme: 'caracter',
    prompt: 'Describe a person using “ser” and an adjective.',
    hint: 'Use “es” + adjective.',
    constraints: [
      { type: 'verbFormAny', inf: 'ser', tense: 'presente' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Mi hermana es muy simpática y trabajadora.', 'Mi profesor es alto y paciente.'] },

  { id: 'w-question', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Ask someone where they live.',
    hint: 'Form a question with “dónde” and “vivir”.',
    constraints: [
      { type: 'question' },
      { type: 'verbFormAny', inf: 'vivir', tense: 'presente' }
    ],
    models: ['¿Dónde vives?', '¿Dónde vive tu familia?'] },

  { id: 'w-negation', type: 'write', level: 1, theme: 'alimentacion',
    prompt: "Say something you don't like, using negation.",
    hint: 'Use “no” + gustar.',
    constraints: [
      { type: 'negation' },
      { type: 'verbFormAny', inf: 'gustar', tense: 'presente' }
    ],
    models: ['No me gusta el café frío.', 'No me gusta levantarme temprano.'] },

  { id: 'w-past-trip', type: 'write', level: 2, theme: 'viajes',
    prompt: 'Write one sentence about a trip you took last year.',
    hint: 'Use “el año pasado” + preterite.',
    constraints: [
      { type: 'containsWord', word: 'el año pasado' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' }
    ],
    models: ['El año pasado viajé a Portugal con mi familia.', 'El año pasado conocí una ciudad nueva.'] },

  { id: 'w-childhood-habit', type: 'write', level: 2, theme: 'identidad',
    prompt: 'Write about something you used to do as a child.',
    hint: 'Use “de niño/a” + imperfect.',
    constraints: [
      { type: 'containsWord', word: 'de niño' },
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'person', person: 'yo' }
    ],
    models: ['De niño, jugaba en el parque todos los días.', 'De niño, leía muchos libros de aventuras.'] },

  { id: 'w-plans-weekend2', type: 'write', level: 3, theme: 'alimentacion',
    prompt: 'Write one sentence about what you and a friend will do this weekend.',
    hint: 'Use future tense + “nosotros”.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'nosotros' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Este fin de semana comeremos en un restaurante nuevo.', 'Este fin de semana veremos una película juntos.'] },

  { id: 'w-conditional-wish', type: 'write', level: 3, theme: 'economia',
    prompt: 'Say what you would do if you had more money, using the conditional.',
    hint: 'Use “me gustaría” or another conditional verb.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Con más dinero, viajaría por todo el mundo.', 'Me gustaría comprar una casa grande.'] },

  { id: 'w-subjunctive-wish', type: 'write', level: 4, theme: 'trabajo',
    prompt: 'Say what you hope a friend does, starting with “Espero que…”.',
    hint: 'After “espero que”, use the present subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'espero que', label: 'start with “espero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Espero que mi amiga encuentre un buen trabajo.', 'Espero que él llegue a tiempo mañana.'] },

  { id: 'w-command', type: 'write', level: 4, theme: 'ocio',
    prompt: 'Give a friend an affirmative command using “tú”.',
    hint: 'Use the tú imperative form.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' },
      { type: 'minWords', n: 2 }
    ],
    models: ['¡Ven a la fiesta esta noche!', 'Habla con ella mañana.'] },

  // ==== batch 2: translate (L1-L5) ====
  { id: 't-computer', type: 'translate', level: 1, theme: 'ciencia',
    prompt: 'Translate: “I use the computer every day.”',
    hint: 'Present tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'todos los días' }
    ],
    models: ['Uso el ordenador todos los días.'] },

  { id: 't-family-job', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “My mother is a doctor and works in a hospital.”',
    hint: 'ser + trabajar, present tense.',
    constraints: [
      { type: 'verbFormAny', inf: 'ser', tense: 'presente' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'minWords', n: 6 }
    ],
    models: ['Mi madre es médica y trabaja en un hospital.'] },

  { id: 't-where-live', type: 'translate', level: 1, theme: 'vivienda',
    prompt: 'Translate: “We live near the beach.”',
    hint: 'vivir, present tense.',
    constraints: [
      { type: 'verbFormAny', inf: 'vivir', tense: 'presente' },
      { type: 'person', person: 'nosotros' }
    ],
    models: ['Vivimos cerca de la playa.'] },

  { id: 't-feelings-tired', type: 'translate', level: 1, theme: 'caracter',
    prompt: 'Translate: “I am tired, but happy.”',
    hint: 'estar + adjectives.',
    constraints: [
      { type: 'verbFormAny', inf: 'estar', tense: 'presente' },
      { type: 'containsWord', word: 'pero' }
    ],
    models: ['Estoy cansado, pero feliz.', 'Estoy cansada, pero feliz.'] },

  { id: 't-morning-coffee', type: 'translate', level: 1, theme: 'alimentacion',
    prompt: 'Translate: “Every morning I listen to music and drink coffee.”',
    hint: 'escuchar + beber, present tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'todas las mañanas' }
    ],
    models: ['Todas las mañanas escucho música y bebo café.'] },

  { id: 't-need-help', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I need help with this project.”',
    hint: 'necesitar, present tense.',
    constraints: [
      { type: 'verbFormAny', inf: 'necesitar', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Necesito ayuda con este proyecto.'] },

  { id: 't-company-hires', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “That company hires a lot of people.”',
    hint: 'contratar, present tense.',
    constraints: [
      { type: 'verbFormAny', inf: 'contratar', tense: 'presente' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Esa empresa contrata a mucha gente.'] },

  { id: 't-question-name', type: 'translate', level: 1, theme: 'vivienda',
    prompt: 'Translate: “Where do you live?”',
    hint: 'Question form, vivir.',
    constraints: [
      { type: 'question' },
      { type: 'verbFormAny', inf: 'vivir', tense: 'presente' }
    ],
    models: ['¿Dónde vives?'] },

  { id: 't-negation-understand', type: 'translate', level: 1, theme: 'educacion',
    prompt: 'Translate: “I don’t understand this exercise.”',
    hint: 'negation + entender.',
    constraints: [
      { type: 'negation' },
      { type: 'verbFormAny', inf: 'entender', tense: 'presente' }
    ],
    models: ['No entiendo este ejercicio.'] },

  { id: 't-sent-email', type: 'translate', level: 2, theme: 'trabajo',
    prompt: 'Translate: “Yesterday I sent an important email.”',
    hint: 'enviar, preterite.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'ayer' }
    ],
    models: ['Ayer envié un correo importante.'] },

  { id: 't-childhood-listen', type: 'translate', level: 2, theme: 'identidad',
    prompt: 'Translate: “As a child, I used to listen to the radio every night.”',
    hint: 'imperfect, escuchar.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'de niño' }
    ],
    models: ['De niño, escuchaba la radio todas las noches.'] },

  { id: 't-company-fired', type: 'translate', level: 2, theme: 'trabajo',
    prompt: 'Translate: “Last month, the company fired several employees.”',
    hint: 'preterite, despedir.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsWord', word: 'el mes pasado' }
    ],
    models: ['El mes pasado, la empresa despidió a varios empleados.'] },

  { id: 't-invested-year', type: 'translate', level: 2, theme: 'economia',
    prompt: 'Translate: “Last year we invested a lot of money.”',
    hint: 'preterite, invertir.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'nosotros' },
      { type: 'containsWord', word: 'el año pasado' }
    ],
    models: ['El año pasado invertimos mucho dinero.'] },

  { id: 't-used-to-drive', type: 'translate', level: 2, theme: 'relaciones',
    prompt: 'Translate: “My grandfather used to drive an old car.”',
    hint: 'imperfect, conducir.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'containsWord', word: 'antes' }
    ],
    models: ['Antes, mi abuelo conducía un coche viejo.'] },

  { id: 't-bought-for-gift', type: 'translate', level: 2, theme: 'compras',
    prompt: 'Translate: “I bought this gift for my sister.”',
    hint: 'preterite + para.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsWord', word: 'para' }
    ],
    models: ['Compré este regalo para mi hermana.'] },

  { id: 't-walked-through-park', type: 'translate', level: 2, theme: 'ocio',
    prompt: 'Translate: “We walked through the park for two hours.”',
    hint: 'preterite + por.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsWord', word: 'por' }
    ],
    models: ['Caminamos por el parque durante dos horas.'] },

  { id: 't-will-organize', type: 'translate', level: 3, theme: 'ocio',
    prompt: 'Translate: “Next month we will organize a big party.”',
    hint: 'future tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'nosotros' },
      { type: 'containsWord', word: 'el mes que viene' }
    ],
    models: ['El mes que viene organizaremos una fiesta grande.'] },

  { id: 't-would-invest', type: 'translate', level: 3, theme: 'economia',
    prompt: 'Translate: “With more money, I would invest in a business.”',
    hint: 'conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Con más dinero, invertiría en un negocio.'] },

  { id: 't-have-sent', type: 'translate', level: 3, theme: 'trabajo',
    prompt: 'Translate: “I have already sent the documents.”',
    hint: 'present perfect.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'ya' }
    ],
    models: ['Ya he enviado los documentos.'] },

  { id: 't-will-save', type: 'translate', level: 3, theme: 'economia',
    prompt: 'Translate: “You will save more money next year.”',
    hint: 'future, ahorrar.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'tú' }
    ],
    models: ['Ahorrarás más dinero el año que viene.'] },

  { id: 't-would-be-worth', type: 'translate', level: 3, theme: 'economia',
    prompt: 'Translate: “That car would be worth more if it were new.”',
    hint: 'conditional, valer.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Ese coche valdría más si fuera nuevo.'] },

  { id: 't-have-hired', type: 'translate', level: 3, theme: 'trabajo',
    prompt: 'Translate: “The company has already hired a new designer.”',
    hint: 'present perfect, contratar.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'containsWord', word: 'ya' }
    ],
    models: ['La empresa ya ha contratado a un nuevo diseñador.'] },

  { id: 't-hope-listen', type: 'translate', level: 4, theme: 'relaciones',
    prompt: 'Translate: “I hope you (tú) listen to the advice.”',
    hint: 'espero que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'espero que', label: 'start with “espero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Espero que escuches el consejo.'] },

  { id: 't-command-organize', type: 'translate', level: 4, theme: 'vivienda',
    prompt: 'Translate: “Organize your things!” (tú command)',
    hint: 'tú imperative.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' }
    ],
    models: ['¡Organiza tus cosas!'] },

  { id: 't-if-had-more-time', type: 'translate', level: 4, theme: 'arte',
    prompt: 'Translate: “If I had more time, I would learn to paint.”',
    hint: 'imperfect subjunctive + conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' }
    ],
    models: ['Si tuviera más tiempo, aprendería a pintar.'] },

  { id: 't-had-already-chosen', type: 'translate', level: 4, theme: 'alimentacion',
    prompt: 'Translate: “When we arrived, they had already chosen the restaurant.”',
    hint: 'pluscuamperfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' }
    ],
    models: ['Cuando llegamos, ellos ya habían elegido el restaurante.'] },

  { id: 't-want-lead', type: 'translate', level: 4, theme: 'trabajo',
    prompt: 'Translate: “I want her to lead the team.”',
    hint: 'quiero que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'quiero que', label: 'start with “quiero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Quiero que ella dirija el equipo.'] },

  { id: 't-command-vosotros', type: 'translate', level: 4, theme: 'arte',
    prompt: 'Translate: “Listen to the music!” (vosotros command)',
    hint: 'vosotros imperative.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' },
      { type: 'minWords', n: 2 }
    ],
    models: ['¡Escuchad la música!'] },

  { id: 't-will-have-finished', type: 'translate', level: 5, theme: 'trabajo',
    prompt: 'Translate: “By Friday, I will have finished the project.”',
    hint: 'futuro perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Para el viernes, habré terminado el proyecto.'] },

  { id: 't-would-have-invested', type: 'translate', level: 5, theme: 'economia',
    prompt: 'Translate: “With more information, I would have invested in that company.”',
    hint: 'condicional perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Con más información, habría invertido en esa empresa.'] },

  { id: 't-hope-have-finished', type: 'translate', level: 5, theme: 'educacion',
    prompt: 'Translate: “I hope you all will have finished your studies by then.”',
    hint: 'pretérito perfecto de subjuntivo.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfsubj' }
    ],
    models: ['Ojalá que vosotros hayáis terminado los estudios para entonces.'] },

  { id: 't-will-have-saved', type: 'translate', level: 5, theme: 'economia',
    prompt: 'Translate: “By next year, we will have saved enough money.”',
    hint: 'futuro perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'nosotros' }
    ],
    models: ['Para el año que viene, habremos ahorrado suficiente dinero.'] },

  { id: 't-would-not-have-said', type: 'translate', level: 5, theme: 'caracter',
    prompt: 'Translate: “In that situation, I would not have said anything.”',
    hint: 'condicional perfecto + negation.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'negation' }
    ],
    models: ['En esa situación, no habría dicho nada.'] },

  // ==== batch 2: write (L1-L5) ====
  { id: 'w-daily-tech', type: 'write', level: 1, theme: 'ciencia',
    prompt: 'Write one sentence about something you use every day (a device, an app...).',
    hint: 'Present tense + “todos los días”.',
    constraints: [
      { type: 'containsWord', word: 'todos los días' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Todos los días uso el móvil para hablar con mis amigos.', 'Todos los días uso la aplicación del banco.'] },

  { id: 'w-family-description', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Describe a family member using “ser” and an adjective.',
    hint: 'Use “es” + adjective.',
    constraints: [
      { type: 'verbFormAny', inf: 'ser', tense: 'presente' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Mi abuelo es muy generoso y divertido.', 'Mi tía es alta y muy inteligente.'] },

  { id: 'w-negation-food', type: 'write', level: 1, theme: 'alimentacion',
    prompt: "Say a food you don't like, using negation.",
    hint: 'no + gustar.',
    constraints: [
      { type: 'negation' },
      { type: 'verbFormAny', inf: 'gustar', tense: 'presente' }
    ],
    models: ['No me gusta el pescado.', 'No me gustan las verduras crudas.'] },

  { id: 'w-past-purchase', type: 'write', level: 2, theme: 'compras',
    prompt: 'Write one sentence about something you bought last week.',
    hint: 'Use “la semana pasada” + preterite.',
    constraints: [
      { type: 'containsWord', word: 'la semana pasada' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' }
    ],
    models: ['La semana pasada compré unos zapatos nuevos.', 'La semana pasada compré un regalo para mi madre.'] },

  { id: 'w-childhood-town', type: 'write', level: 2, theme: 'identidad',
    prompt: 'Describe the town where you grew up, using the imperfect.',
    hint: 'era, había, vivía…',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'minWords', n: 8 }
    ],
    models: ['El pueblo donde crecí era pequeño y tranquilo, y había un parque bonito.', 'Mi ciudad era muy tradicional y tenía calles estrechas.'] },

  { id: 'w-job-yesterday', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Say what you did at work or school yesterday.',
    hint: 'Preterite, first person.',
    constraints: [
      { type: 'containsWord', word: 'ayer' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Ayer terminé un proyecto importante en el trabajo.', 'Ayer estudié mucho para el examen.'] },

  { id: 'w-future-career', type: 'write', level: 3, theme: 'trabajo',
    prompt: 'Write one sentence about a career goal for next year.',
    hint: 'Future tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 5 }
    ],
    models: ['El próximo año buscaré un trabajo mejor.', 'El año que viene terminaré mis estudios.'] },

  { id: 'w-conditional-dream', type: 'write', level: 3, theme: 'viajes',
    prompt: 'Say what you would do with a lot of money.',
    hint: 'Conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Con mucho dinero, viajaría por todo el mundo.', 'Compraría una casa grande para mi familia.'] },

  { id: 'w-perfect-achievement', type: 'write', level: 3, theme: 'economia',
    prompt: 'Say something you have already accomplished this year.',
    hint: 'Present perfect + “este año”.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Este año he ahorrado mucho dinero.', 'Este año he aprendido mucho español.'] },

  { id: 'w-subjunctive-advice', type: 'write', level: 4, theme: 'salud',
    prompt: 'Give advice to a friend, starting with “Te recomiendo que…”.',
    hint: 'Subjunctive after recomendar que.',
    constraints: [
      { type: 'regex', pattern: 'recomiendo que', label: 'start with “te recomiendo que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Te recomiendo que descanses más.', 'Te recomiendo que hables con tu jefe.'] },

  { id: 'w-conditional-hypothetical', type: 'write', level: 4, theme: 'relaciones',
    prompt: 'Say what you would do if you had a big problem.',
    hint: 'Si + imperfect subjunctive, conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' }
    ],
    models: ['Si tuviera un problema grande, hablaría con mi familia.', 'Si perdiera mi trabajo, buscaría otro rápido.'] },

  { id: 'w-usted-command', type: 'write', level: 4, theme: 'relaciones',
    prompt: 'Give a formal (usted) command to a stranger.',
    hint: 'Usted imperative form.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' },
      { type: 'minWords', n: 2 }
    ],
    models: ['Escuche con atención, por favor.', 'Envíe el documento hoy mismo.'] },

  { id: 'w-futperf-goal', type: 'write', level: 5, theme: 'educacion',
    prompt: 'Say something you will have achieved by next year, using the futuro perfecto.',
    hint: 'habré + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Para el año que viene, habré terminado mis estudios.', 'Para entonces, habré ahorrado bastante dinero.'] },

  { id: 'w-condperf-regret', type: 'write', level: 5, theme: 'caracter',
    prompt: 'Say what you would have done differently in a past situation.',
    hint: 'habría + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'minWords', n: 5 }
    ],
    models: ['En esa situación, habría hablado con más calma.', 'Yo habría elegido un trabajo diferente.'] },

  // ==== batch 2: build (L1-L4) ====
  { id: 'b-listen-music', type: 'build', level: 1, theme: 'arte', en: 'I listen to music every morning.',
    answer: 'Escucho música todas las mañanas.' },
  { id: 'b-manage-team', type: 'build', level: 1, theme: 'trabajo', en: 'My boss manages a team.',
    answer: 'Mi jefa dirige un equipo.' },
  { id: 'b-save-money', type: 'build', level: 1, theme: 'economia', en: 'We save money every month.',
    answer: 'Ahorramos dinero cada mes.' },
  { id: 'b-need-help2', type: 'build', level: 1, theme: 'trabajo', en: 'I need help with the project.',
    answer: 'Necesito ayuda con el proyecto.' },
  { id: 'b-recycle-paper', type: 'build', level: 1, theme: 'naturaleza', en: 'We recycle paper and plastic.',
    answer: 'Reciclamos papel y plástico.' },
  { id: 'b-sent-report', type: 'build', level: 2, theme: 'trabajo', en: 'Yesterday I sent the report.',
    answer: 'Ayer envié el informe.' },
  { id: 'b-company-fired2', type: 'build', level: 2, theme: 'trabajo', en: 'The company fired several employees.',
    answer: 'La empresa despidió a varios empleados.' },
  { id: 'b-used-to-work', type: 'build', level: 2, theme: 'trabajo', en: 'I used to work in a store.',
    answer: 'Yo trabajaba en una tienda.' },
  { id: 'b-bought-gift2', type: 'build', level: 2, theme: 'compras', en: 'I bought a gift for my sister.',
    answer: 'Compré un regalo para mi hermana.' },
  { id: 'b-invested-year2', type: 'build', level: 2, theme: 'economia', en: 'We invested a lot of money.',
    answer: 'Invertimos mucho dinero.' },
  { id: 'b-will-organize2', type: 'build', level: 3, theme: 'ocio', en: 'We will organize a big party.',
    answer: 'Organizaremos una fiesta grande.' },
  { id: 'b-would-invest2', type: 'build', level: 3, theme: 'economia', en: 'I would invest in a new business.',
    answer: 'Invertiría en un negocio nuevo.' },
  { id: 'b-have-sent2', type: 'build', level: 3, theme: 'trabajo', en: 'I have already sent the documents.',
    answer: 'Ya he enviado los documentos.' },
  { id: 'b-will-hire', type: 'build', level: 3, theme: 'trabajo', en: 'The company will hire more staff.',
    answer: 'La empresa contratará más personal.' },
  { id: 'b-hope-listen2', type: 'build', level: 4, theme: 'relaciones', en: 'I hope you listen to the advice.',
    answer: 'Espero que escuches el consejo.' },
  { id: 'b-command-organize2', type: 'build', level: 4, theme: 'vivienda', en: 'Organize your things.',
    answer: 'Organiza tus cosas.' },
  { id: 'b-had-chosen2', type: 'build', level: 4, theme: 'alimentacion', en: 'They had already chosen the restaurant.',
    answer: 'Ya habían elegido el restaurante.' },

  // ==== batch 2: paragraph (L2-L5) ====
  { id: 'p-first-job', type: 'paragraph', level: 2, theme: 'trabajo',
    prompt: 'Write a paragraph (3+ sentences) about your first job.',
    hint: 'Imperfect for background, preterite for specific events; connect with y, pero, porque.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'luego', 'después'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Mi primer trabajo era en una tienda pequeña donde ganaba poco dinero. Trabajaba los fines de semana porque necesitaba pagar mis estudios. Un día tuve un problema grande, pero mi jefe fue muy comprensivo y aprendí mucho de esa experiencia.'] },

  { id: 'p-childhood-home', type: 'paragraph', level: 2, theme: 'identidad',
    prompt: 'Describe the house or town where you grew up, and something that happened there.',
    hint: 'Imperfect for description, preterite for one specific event.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'cuando'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['La casa donde crecí era grande y tenía un jardín precioso. Vivíamos cerca de un río y jugábamos allí todos los veranos. Un año llovió tanto que el río creció mucho, pero por suerte nadie salió herido.'] },

  { id: 'p-future-goals', type: 'paragraph', level: 3, theme: 'trabajo',
    prompt: 'Write a paragraph about your goals for next year.',
    hint: 'Future tense; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['El próximo año buscaré un trabajo nuevo porque quiero ganar más dinero. También ahorraré para viajar y aprenderé un idioma nuevo. Será un año difícil, pero estoy segura de que valdrá la pena.'] },

  { id: 'p-conditional-dream-life', type: 'paragraph', level: 3, theme: 'viajes',
    prompt: 'Write a paragraph about what your ideal life would be like.',
    hint: 'Conditional tense throughout; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Mi vida ideal sería muy tranquila. Viviría cerca del mar porque me encanta el agua, y trabajaría solo cuatro días a la semana. También viajaría mucho y pasaría más tiempo con mi familia, pero seguiría ahorrando para el futuro.'] },

  { id: 'p-perfect-year-review', type: 'paragraph', level: 3, theme: 'trabajo',
    prompt: 'Write a paragraph reviewing what you have accomplished this year.',
    hint: 'Present perfect throughout; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Este año he trabajado mucho y he aprendido cosas nuevas. También he ahorrado dinero porque quiero comprar una casa, y he viajado dos veces con mi familia. No ha sido un año fácil, pero estoy muy contenta con todo lo que he logrado.'] },

  { id: 'p-advice-friend', type: 'paragraph', level: 4, theme: 'salud',
    prompt: 'Write a paragraph giving advice to a friend who is stressed.',
    hint: 'Subjunctive after expressions like “espero que”, “quiero que”, “es importante que”; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presubj' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Sé que estás muy estresado últimamente. Te recomiendo que descanses más y que no trabajes los fines de semana. También espero que hables con tu jefe porque necesitas menos presión. Sé que no es fácil, pero creo que puedes mejorar tu situación.'] },

  { id: 'p-hypothetical-life', type: 'paragraph', level: 4, theme: 'viajes',
    prompt: 'Write a paragraph about what you would do if you had different circumstances.',
    hint: 'Use several “si” clauses (imperfect subjunctive + conditional); connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Si tuviera más tiempo libre, aprendería a pintar y viajaría más. También, si viviera en otra ciudad, buscaría un trabajo diferente porque quiero un cambio. Sé que no es fácil, pero si pudiera, cambiaría muchas cosas de mi vida ahora mismo.'] },

  { id: 'p-futperf-life-plan', type: 'paragraph', level: 5, theme: 'trabajo',
    prompt: 'Write a paragraph about everything you will have achieved by a future date, using the futuro perfecto.',
    hint: 'habré + participio, several times; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Para el año que viene, habré terminado mis estudios y habré empezado a trabajar. También habré ahorrado algo de dinero porque quiero viajar, pero todavía no habré comprado una casa. Sé que habré aprendido mucho durante este tiempo.'] },

  { id: 'p-condperf-reflection', type: 'paragraph', level: 5, theme: 'educacion',
    prompt: 'Write a paragraph reflecting on what you would have done differently in the past.',
    hint: 'habría + participio, several times; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Si hubiera sabido más, habría elegido una carrera diferente porque siempre me ha gustado el arte. También habría viajado más de joven, y habría ahorrado más dinero cada mes. Sé que no puedo cambiar el pasado, pero me gusta pensar en estas cosas.'] },

  // ==== verb-group lesson writing tasks (groups 1-9) ====
  { id: 't-work-verbos1', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I work and study every day.”',
    constraints: [{ type: 'verbFormAny', inf: 'trabajar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Trabajo y estudio todos los días.'] },
  { id: 'w-eat-drink-verbos1', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what you typically eat and drink for lunch.',
    constraints: [{ type: 'verbFormAny', inf: 'comer', tense: 'presente' }, { type: 'minWords', n: 5 }],
    models: ['Como ensalada y bebo agua.'] },

  { id: 't-live-learn-verbos2', type: 'translate', level: 2, theme: 'viajes',
    prompt: 'Translate: “Last year I lived in Madrid and learned a lot.”',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'verbFormAny', inf: 'vivir', tense: 'preterito' }],
    models: ['El año pasado viví en Madrid y aprendí mucho.'] },
  { id: 'w-be-verbos2', type: 'write', level: 1, theme: 'caracter',
    prompt: 'Describe yourself using “ser” and “estar”.',
    constraints: [{ type: 'verbFormAny', inf: 'ser', tense: 'presente' }, { type: 'verbFormAny', inf: 'estar', tense: 'presente' }],
    models: ['Soy paciente y estoy feliz hoy.'] },

  { id: 't-could-not-verbos3', type: 'translate', level: 2, theme: 'trabajo',
    prompt: 'Translate: “I couldn’t finish the project yesterday.”',
    constraints: [{ type: 'verbFormAny', inf: 'poder', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer no pude terminar el proyecto.'] },
  { id: 'w-went-verbos3', type: 'write', level: 2, theme: 'ocio',
    prompt: 'Say where you went last weekend.',
    constraints: [{ type: 'verbFormAny', inf: 'ir', tense: 'preterito' }, { type: 'containsWord', word: 'fin de semana' }],
    models: ['El fin de semana pasado fui a la playa.'] },

  { id: 't-told-truth-verbos4', type: 'translate', level: 2, theme: 'relaciones',
    prompt: 'Translate: “She told me the truth.”',
    constraints: [{ type: 'verbFormAny', inf: 'decir', tense: 'preterito' }],
    models: ['Ella me dijo la verdad.'] },
  { id: 'w-know-languages-verbos4', type: 'write', level: 1, theme: 'educacion',
    prompt: 'Say how many languages you know.',
    constraints: [{ type: 'verbFormAny', inf: 'saber', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Sé hablar dos idiomas.'] },

  { id: 't-set-table-verbos5', type: 'translate', level: 1, theme: 'alimentacion',
    prompt: 'Translate: “We set the table before dinner.”',
    constraints: [{ type: 'verbFormAny', inf: 'poner', tense: 'presente' }],
    models: ['Ponemos la mesa antes de cenar.'] },
  { id: 'w-left-late-verbos5', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Say what time you left the house yesterday.',
    constraints: [{ type: 'verbFormAny', inf: 'salir', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer salí de casa a las ocho.'] },

  { id: 't-sleep-hours-verbos6', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: “I sleep eight hours every night.”',
    constraints: [{ type: 'verbFormAny', inf: 'dormir', tense: 'presente' }],
    models: ['Duermo ocho horas cada noche.'] },
  { id: 'w-ordered-verbos6', type: 'write', level: 2, theme: 'alimentacion',
    prompt: 'Say what you ordered the last time you went to a restaurant.',
    constraints: [{ type: 'verbFormAny', inf: 'pedir', tense: 'preterito' }],
    models: ['Pedí pescado con ensalada.'] },

  { id: 't-got-job-verbos7', type: 'translate', level: 2, theme: 'trabajo',
    prompt: 'Translate: “She got a new job last month.”',
    constraints: [{ type: 'verbFormAny', inf: 'conseguir', tense: 'preterito' }, { type: 'containsWord', word: 'el mes pasado' }],
    models: ['El mes pasado ella consiguió un trabajo nuevo.'] },
  { id: 'w-prefer-verbos7', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what you prefer, coffee or tea.',
    constraints: [{ type: 'verbFormAny', inf: 'preferir', tense: 'presente' }],
    models: ['Prefiero el té por la mañana.'] },

  { id: 't-know-people-verbos8', type: 'translate', level: 1, theme: 'relaciones',
    prompt: 'Translate: “I know a lot of people here.”',
    constraints: [{ type: 'verbFormAny', inf: 'conocer', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Conozco a mucha gente aquí.'] },
  { id: 'w-read-book-verbos8', type: 'write', level: 2, theme: 'arte',
    prompt: 'Say what book you read last month.',
    constraints: [{ type: 'verbFormAny', inf: 'leer', tense: 'preterito' }],
    models: ['Leí una novela muy interesante.'] },

  { id: 't-think-before-verbos9', type: 'translate', level: 1, theme: 'caracter',
    prompt: 'Translate: “I think a lot before deciding.”',
    constraints: [{ type: 'verbFormAny', inf: 'pensar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Pienso mucho antes de decidir.'] },
  { id: 'w-drove-verbos9', type: 'write', level: 2, theme: 'naturaleza',
    prompt: 'Say where you drove to last weekend.',
    constraints: [{ type: 'verbFormAny', inf: 'conducir', tense: 'preterito' }],
    models: ['Conduje hasta la montaña el sábado.'] },

  // ==== verb-group lesson writing tasks (groups 10-18) ====
  { id: 't-start-work-verbos10', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I start work at nine.”',
    constraints: [{ type: 'verbFormAny', inf: 'empezar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Empiezo el trabajo a las nueve.'] },
  { id: 'w-lost-verbos10', type: 'write', level: 2, theme: 'ciencia',
    prompt: 'Say something you lost recently.',
    constraints: [{ type: 'verbFormAny', inf: 'perder', tense: 'preterito' }],
    models: ['Perdí mi teléfono la semana pasada.'] },

  { id: 't-remember-verbos11', type: 'translate', level: 1, theme: 'caracter',
    prompt: 'Translate: “I don’t remember his name.”',
    constraints: [{ type: 'negation' }, { type: 'verbFormAny', inf: 'recordar', tense: 'presente' }],
    models: ['No recuerdo su nombre.'] },
  { id: 'w-found-verbos11', type: 'write', level: 2, theme: 'economia',
    prompt: 'Say something you found unexpectedly.',
    constraints: [{ type: 'verbFormAny', inf: 'encontrar', tense: 'preterito' }],
    models: ['Encontré dinero en la calle.'] },

  { id: 't-cost-verbos12', type: 'translate', level: 1, theme: 'compras',
    prompt: 'Translate: “This jacket costs a lot.”',
    constraints: [{ type: 'verbFormAny', inf: 'costar', tense: 'presente' }],
    models: ['Esta chaqueta cuesta mucho.'] },
  { id: 'w-played-verbos12', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Say a sport you play.',
    constraints: [{ type: 'verbFormAny', inf: 'jugar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Juego al tenis los sábados.'] },

  { id: 't-paid-verbos13', type: 'translate', level: 2, theme: 'compras',
    prompt: 'Translate: “Yesterday I paid the bill.”',
    constraints: [{ type: 'verbFormAny', inf: 'pagar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer pagué la cuenta.'] },
  { id: 'w-broke-verbos13', type: 'write', level: 2, theme: 'vivienda',
    prompt: 'Say something you broke by accident.',
    constraints: [{ type: 'verbFormAny', inf: 'romper', tense: 'preterito' }],
    models: ['Rompí un vaso sin querer.'] },

  { id: 't-call-mother-verbos14', type: 'translate', level: 1, theme: 'relaciones',
    prompt: 'Translate: “I call my mother every Sunday.”',
    constraints: [{ type: 'verbFormAny', inf: 'llamar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Llamo a mi madre todos los domingos.'] },
  { id: 'w-discovered-verbos14', type: 'write', level: 2, theme: 'ocio',
    prompt: 'Say something you discovered recently.',
    constraints: [{ type: 'verbFormAny', inf: 'descubrir', tense: 'preterito' }],
    models: ['Descubrí un restaurante nuevo cerca de casa.'] },

  { id: 't-need-time-verbos15', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I need more time.”',
    constraints: [{ type: 'verbFormAny', inf: 'necesitar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Necesito más tiempo.'] },
  { id: 'w-waited-verbos15', type: 'write', level: 2, theme: 'viajes',
    prompt: 'Say how long you waited for something recently.',
    constraints: [{ type: 'verbFormAny', inf: 'esperar', tense: 'preterito' }],
    models: ['Esperé veinte minutos en la parada del autobús.'] },

  { id: 't-help-verbos16', type: 'translate', level: 1, theme: 'educacion',
    prompt: 'Translate: “The teacher helps us a lot.”',
    constraints: [{ type: 'verbFormAny', inf: 'ayudar', tense: 'presente' }],
    models: ['El profesor nos ayuda mucho.'] },
  { id: 'w-like-verbos16', type: 'write', level: 1, theme: 'arte',
    prompt: 'Say something you like using “gustar”.',
    constraints: [{ type: 'verbFormAny', inf: 'gustar', tense: 'presente' }],
    models: ['Me gusta la fotografía.'] },

  { id: 't-finished-report-verbos17', type: 'translate', level: 2, theme: 'trabajo',
    prompt: 'Translate: “Yesterday I finished the report.”',
    constraints: [{ type: 'verbFormAny', inf: 'terminar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer terminé el informe.'] },
  { id: 'w-earn-verbos17', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what you do for a living and mention what you earn.',
    constraints: [{ type: 'verbFormAny', inf: 'ganar', tense: 'presente' }],
    models: ['Trabajo en una tienda y gano un buen sueldo.'] },

  { id: 't-traveled-verbos18', type: 'translate', level: 2, theme: 'viajes',
    prompt: 'Translate: “Last summer we traveled to Italy.”',
    constraints: [{ type: 'verbFormAny', inf: 'viajar', tense: 'preterito' }, { type: 'containsWord', word: 'el verano pasado' }],
    models: ['El verano pasado viajamos a Italia.'] },
  { id: 'w-cook-verbos18', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what you like to cook.',
    constraints: [{ type: 'verbFormAny', inf: 'cocinar', tense: 'presente' }],
    models: ['Cocino pasta italiana los domingos.'] },

  // ==== verb-group lesson writing tasks (groups 19-27) ====
  { id: 't-understand-grammar-verbos19', type: 'translate', level: 1, theme: 'educacion',
    prompt: 'Translate: “I understand Spanish grammar well.”',
    constraints: [{ type: 'verbFormAny', inf: 'comprender', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Comprendo bien la gramática española.'] },
  { id: 'w-sold-verbos19', type: 'write', level: 2, theme: 'economia',
    prompt: 'Say something you sold recently.',
    constraints: [{ type: 'verbFormAny', inf: 'vender', tense: 'preterito' }],
    models: ['Vendí mi bicicleta vieja.'] },

  { id: 't-receive-emails-verbos20', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I receive many emails every day.”',
    constraints: [{ type: 'verbFormAny', inf: 'recibir', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Recibo muchos correos cada día.'] },
  { id: 'w-decided-verbos20', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Say something you decided recently.',
    constraints: [{ type: 'verbFormAny', inf: 'decidir', tense: 'preterito' }],
    models: ['Decidí cambiar de trabajo.'] },

  { id: 't-breakfast-verbos21', type: 'translate', level: 1, theme: 'alimentacion',
    prompt: 'Translate: “We have breakfast together every morning.”',
    constraints: [{ type: 'verbFormAny', inf: 'desayunar', tense: 'presente' }],
    models: ['Desayunamos juntos todas las mañanas.'] },
  { id: 'w-dinner-late-verbos21', type: 'write', level: 2, theme: 'alimentacion',
    prompt: 'Say what time you had dinner yesterday.',
    constraints: [{ type: 'verbFormAny', inf: 'cenar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer cené a las diez de la noche.'] },

  { id: 't-prepare-dinner-verbos22', type: 'translate', level: 1, theme: 'alimentacion',
    prompt: 'Translate: “I prepare dinner every Sunday.”',
    constraints: [{ type: 'verbFormAny', inf: 'preparar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Preparo la cena todos los domingos.'] },
  { id: 'w-invited-verbos22', type: 'write', level: 2, theme: 'relaciones',
    prompt: 'Say who you invited to your last celebration.',
    constraints: [{ type: 'verbFormAny', inf: 'invitar', tense: 'preterito' }],
    models: ['Invité a toda mi familia a la fiesta.'] },

  { id: 't-swim-verbos23', type: 'translate', level: 1, theme: 'ocio',
    prompt: 'Translate: “I swim in the pool every summer.”',
    constraints: [{ type: 'verbFormAny', inf: 'nadar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Nado en la piscina todos los veranos.'] },
  { id: 'w-signed-verbos23', type: 'write', level: 2, theme: 'vivienda',
    prompt: 'Say something you signed recently.',
    constraints: [{ type: 'verbFormAny', inf: 'firmar', tense: 'preterito' }],
    models: ['Firmé el contrato del piso nuevo.'] },

  { id: 't-clean-house-verbos24', type: 'translate', level: 1, theme: 'vivienda',
    prompt: 'Translate: “We clean the house every Saturday.”',
    constraints: [{ type: 'verbFormAny', inf: 'limpiar', tense: 'presente' }],
    models: ['Limpiamos la casa todos los sábados.'] },
  { id: 'w-achieved-verbos24', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Say something you managed to achieve recently.',
    constraints: [{ type: 'verbFormAny', inf: 'lograr', tense: 'preterito' }],
    models: ['Logré terminar el proyecto a tiempo.'] },

  { id: 't-attend-class-verbos25', type: 'translate', level: 1, theme: 'educacion',
    prompt: 'Translate: “We attend class every day.”',
    constraints: [{ type: 'verbFormAny', inf: 'asistir', tense: 'presente' }],
    models: ['Asistimos a clase todos los días.'] },
  { id: 'w-argued-verbos25', type: 'write', level: 2, theme: 'relaciones',
    prompt: 'Say what you argued about with someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'discutir', tense: 'preterito' }],
    models: ['Discutí con mi hermano sobre el coche.'] },

  { id: 't-share-flat-verbos26', type: 'translate', level: 1, theme: 'vivienda',
    prompt: 'Translate: “We share an apartment with two friends.”',
    constraints: [{ type: 'verbFormAny', inf: 'compartir', tense: 'presente' }],
    models: ['Compartimos piso con dos amigos.'] },
  { id: 'w-turned-age-verbos26', type: 'write', level: 2, theme: 'identidad',
    prompt: 'Say how old you turned on your last birthday.',
    constraints: [{ type: 'verbFormAny', inf: 'cumplir', tense: 'preterito' }],
    models: ['Cumplí treinta años en marzo.'] },

  { id: 't-listen-music-verbos27', type: 'translate', level: 1, theme: 'arte',
    prompt: 'Translate: “I listen to music while I work.”',
    constraints: [{ type: 'verbFormAny', inf: 'escuchar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Escucho música mientras trabajo.'] },
  { id: 'w-admitted-verbos27', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Say something you admitted to someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'admitir', tense: 'preterito' }],
    models: ['Admití mi error frente a mi jefe.'] },

  // ==== verb-group lesson writing tasks (groups 28-37) ====
  { id: 't-save-money-verbos28', type: 'translate', level: 1, theme: 'economia',
    prompt: 'Translate: “I save a bit of money every month.”',
    constraints: [{ type: 'verbFormAny', inf: 'ahorrar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Ahorro un poco de dinero cada mes.'] },
  { id: 'w-rented-verbos28', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Say what you rent or would like to rent.',
    constraints: [{ type: 'verbFormAny', inf: 'alquilar', tense: 'presente' }],
    models: ['Alquilo un piso pequeño cerca del centro.'] },

  { id: 't-negotiate-verbos29', type: 'translate', level: 1, theme: 'economia',
    prompt: 'Translate: “We negotiate the price every time.”',
    constraints: [{ type: 'verbFormAny', inf: 'negociar', tense: 'presente' }],
    models: ['Negociamos el precio cada vez.'] },
  { id: 'w-hired-verbos29', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Say who your company hired recently.',
    constraints: [{ type: 'verbFormAny', inf: 'contratar', tense: 'preterito' }],
    models: ['La empresa contrató a una diseñadora nueva.'] },

  { id: 't-recycle-verbos30', type: 'translate', level: 1, theme: 'naturaleza',
    prompt: 'Translate: “I recycle paper and plastic.”',
    constraints: [{ type: 'verbFormAny', inf: 'reciclar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Reciclo papel y plástico.'] },
  { id: 'w-installed-verbos30', type: 'write', level: 2, theme: 'ciencia',
    prompt: 'Say what program or app you installed recently.',
    constraints: [{ type: 'verbFormAny', inf: 'instalar', tense: 'preterito' }],
    models: ['Instalé una aplicación nueva para el trabajo.'] },

  { id: 't-rest-sundays-verbos31', type: 'translate', level: 1, theme: 'ocio',
    prompt: 'Translate: “I rest on Sunday afternoons.”',
    constraints: [{ type: 'verbFormAny', inf: 'descansar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Descanso los domingos por la tarde.'] },
  { id: 'w-vaccinated-verbos31', type: 'write', level: 2, theme: 'salud',
    prompt: 'Say when you were last vaccinated.',
    constraints: [{ type: 'verbFormAny', inf: 'vacunar', tense: 'preterito' }],
    models: ['Me vacuné el mes pasado.'] },

  { id: 't-program-apps-verbos32', type: 'translate', level: 1, theme: 'ciencia',
    prompt: 'Translate: “I program apps for mobile phones.”',
    constraints: [{ type: 'verbFormAny', inf: 'programar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Programo aplicaciones para móviles.'] },
  { id: 'w-voted-verbos32', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Say what you voted for recently.',
    constraints: [{ type: 'verbFormAny', inf: 'votar', tense: 'preterito' }],
    models: ['Voté por el nuevo diseño del logo.'] },

  { id: 't-opinion-verbos33', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I think the project is good.”',
    constraints: [{ type: 'verbFormAny', inf: 'opinar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Opino que el proyecto es bueno.'] },
  { id: 'w-protested-verbos33', type: 'write', level: 2, theme: 'politica',
    prompt: 'Say what people protested about recently.',
    constraints: [{ type: 'verbFormAny', inf: 'protestar', tense: 'preterito' }],
    models: ['Los vecinos protestaron por el ruido.'] },

  { id: 't-wake-early-verbos34', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I get up early every Monday.”',
    constraints: [{ type: 'verbFormAny', inf: 'madrugar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Madrugo todos los lunes.'] },
  { id: 'w-downloaded-verbos34', type: 'write', level: 2, theme: 'arte',
    prompt: 'Say what you downloaded recently.',
    constraints: [{ type: 'verbFormAny', inf: 'descargar', tense: 'preterito' }],
    models: ['Descargué una canción nueva ayer.'] },

  { id: 't-turn-on-light-verbos35', type: 'translate', level: 1, theme: 'vivienda',
    prompt: 'Translate: “I turn on the kitchen light.”',
    constraints: [{ type: 'verbFormAny', inf: 'encender', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Enciendo la luz de la cocina.'] },
  { id: 'w-chose-verbos35', type: 'write', level: 2, theme: 'relaciones',
    prompt: 'Say what gift you chose for someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'elegir', tense: 'preterito' }],
    models: ['Elegí un libro para mi madre.'] },

  { id: 't-manage-team-verbos36', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “She manages a team of ten people.”',
    constraints: [{ type: 'verbFormAny', inf: 'dirigir', tense: 'presente' }],
    models: ['Ella dirige un equipo de diez personas.'] },
  { id: 'w-sent-report-verbos36', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Say what you sent someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'enviar', tense: 'preterito' }],
    models: ['Envié un correo importante a mi jefa.'] },

  { id: 't-worth-verbos37', type: 'translate', level: 1, theme: 'economia',
    prompt: 'Translate: “This ring is not worth much money.”',
    constraints: [{ type: 'verbFormAny', inf: 'valer', tense: 'presente' }],
    models: ['Este anillo no vale mucho dinero.'] },
  { id: 'w-worth-future-verbos37', type: 'write', level: 3, theme: 'arte',
    prompt: 'Say what you think will be valuable in the future.',
    constraints: [{ type: 'verbFormAny', inf: 'valer', tense: 'futuro' }],
    models: ['Creo que este cuadro valdrá mucho en el futuro.'] },

  // ==== vocab-lesson writing tasks (chunks 1-9) ====
  { id: 'w-greeting-vocab1', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Greet someone and ask how they are, in Spanish.',
    constraints: [{ type: 'containsAny', words: ['hola', 'buenos días', 'buenas tardes'] }, { type: 'minWords', n: 3 }],
    models: ['Hola, ¿qué tal estás?'] },
  { id: 'w-thanks-sorry-vocab1', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Write a short exchange: thank someone and apologize for something.',
    constraints: [{ type: 'containsWord', word: 'gracias' }, { type: 'containsAny', words: ['perdón', 'lo siento'] }],
    models: ['Perdón por el retraso, y gracias por esperar.'] },

  { id: 'w-describe-family-vocab2', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Describe two members of your family (e.g. el padre, la hermana).',
    constraints: [{ type: 'containsAny', words: ['padre', 'madre', 'hermano', 'hermana', 'hijo', 'hija'] }, { type: 'minWords', n: 6 }],
    models: ['Mi padre es alto y mi hermana es muy simpática.'] },
  { id: 'w-friend-vocab2', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Say something about a friend, using “el amigo” or “la amiga”.',
    constraints: [{ type: 'containsAny', words: ['amigo', 'amiga'] }],
    models: ['Mi amiga vive cerca de mi casa.'] },

  { id: 'w-grandparents-vocab3', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Say something about your grandparents.',
    constraints: [{ type: 'containsAny', words: ['abuelo', 'abuela'] }],
    models: ['Mi abuelo cocina muy bien.'] },
  { id: 'w-boss-neighbor-vocab3', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Say something about your boss or a neighbor.',
    constraints: [{ type: 'containsAny', words: ['jefe', 'vecino'] }],
    models: ['Mi vecino es muy amable.'] },

  { id: 'w-grandchild-vocab4', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Say something about a grandchild (nieto/nieta) in a family you know.',
    constraints: [{ type: 'containsAny', words: ['nieto', 'nieta'] }],
    models: ['Mi nieta juega en el jardín todos los días.'] },
  { id: 'w-grandchild2-vocab4', type: 'write', level: 2, theme: 'relaciones',
    prompt: 'Say what a grandchild did last weekend.',
    constraints: [{ type: 'containsAny', words: ['nieto', 'nieta'] }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['El nieto llamó a sus abuelos el domingo pasado.'] },

  { id: 'w-breakfast-vocab5', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Describe what you eat for breakfast (mention at least two foods).',
    constraints: [{ type: 'containsAny', words: ['pan', 'huevo', 'fruta', 'leche', 'café'] }, { type: 'minWords', n: 6 }],
    models: ['Como pan con huevo y bebo café con leche.'] },
  { id: 'w-lunch-vocab5', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what meat or fish you prefer.',
    constraints: [{ type: 'containsAny', words: ['la carne', 'el pescado', 'el pollo'] }],
    models: ['Prefiero el pollo al pescado.'] },

  { id: 'w-dinner-drink-vocab6', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what you like to drink with dinner.',
    constraints: [{ type: 'containsAny', words: ['vino', 'cerveza'] }],
    models: ['Me gusta beber vino con la cena.'] },
  { id: 'w-meal-times-vocab6', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what your favorite meal of the day is (desayuno/almuerzo/cena).',
    constraints: [{ type: 'containsAny', words: ['el desayuno', 'el almuerzo', 'la cena'] }],
    models: ['Mi comida favorita es la cena.'] },

  { id: 'w-count-vocab7', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Say a number that is important to you.',
    constraints: [{ type: 'containsAny', words: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'] }, { type: 'minWords', n: 4 }],
    models: ['Mi número favorito es el siete.'] },
  { id: 'w-big-number-vocab7', type: 'write', level: 1, theme: 'compras',
    prompt: 'Say something that costs around a hundred or a thousand (euros/dollars).',
    constraints: [{ type: 'containsAny', words: ['cien', 'mil'] }],
    models: ['Ese ordenador cuesta casi mil euros.'] },

  { id: 'w-order-vocab8', type: 'write', level: 1, theme: 'educacion',
    prompt: 'Say something about being first or last at something.',
    constraints: [{ type: 'containsAny', words: ['primero', 'último'] }],
    models: ['Siempre soy el último en llegar a clase.'] },
  { id: 'w-order2-vocab8', type: 'write', level: 2, theme: 'educacion',
    prompt: 'Say who arrived first or last somewhere yesterday.',
    constraints: [{ type: 'containsAny', words: ['primero', 'último'] }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['Ayer llegué el primero a la reunión.'] },

  { id: 'w-today-tomorrow-vocab9', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what you are doing today and tomorrow.',
    constraints: [{ type: 'containsAny', words: ['hoy', 'mañana'] }, { type: 'minWords', n: 6 }],
    models: ['Hoy trabajo y mañana descanso todo el día.'] },
  { id: 'w-always-never-vocab9', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say something you always do and something you never do.',
    constraints: [{ type: 'containsWord', word: 'siempre' }, { type: 'containsWord', word: 'nunca' }],
    models: ['Siempre desayuno bien, pero nunca ceno tarde.'] },

  // ==== vocab-lesson writing tasks (chunks 10-18) ====
  { id: 'w-favorite-color-vocab10', type: 'write', level: 1, theme: 'arte',
    prompt: 'Say your favorite color and why.',
    constraints: [{ type: 'containsAny', words: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris', 'naranja', 'rosa', 'marrón'] }, { type: 'minWords', n: 4 }],
    models: ['Mi color favorito es el azul.'] },
  { id: 'w-describe-object-color-vocab10', type: 'write', level: 1, theme: 'compras',
    prompt: 'Describe an object using two colors.',
    constraints: [{ type: 'containsAny', words: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco'] }, { type: 'minWords', n: 5 }],
    models: ['Mi coche es blanco y negro.'] },

  { id: 'w-city-country-vocab11', type: 'write', level: 1, theme: 'viajes',
    prompt: 'Say what city and country you live in.',
    constraints: [{ type: 'containsAny', words: ['ciudad', 'país'] }],
    models: ['Vivo en una ciudad grande en otro país.'] },
  { id: 'w-errands-vocab11', type: 'write', level: 1, theme: 'compras',
    prompt: 'Say two places you go to run errands (mercado, tienda, banco...).',
    constraints: [{ type: 'containsAny', words: ['mercado', 'tienda', 'escuela', 'restaurante', 'hospital'] }, { type: 'minWords', n: 6 }],
    models: ['Voy al mercado y después a la tienda.'] },

  { id: 'w-weekend-places-vocab12', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Say where you like to go on weekends.',
    constraints: [{ type: 'containsAny', words: ['parque', 'museo', 'cine', 'biblioteca'] }],
    models: ['Me gusta ir al parque los domingos.'] },
  { id: 'w-errands2-vocab12', type: 'write', level: 1, theme: 'compras',
    prompt: 'Say what you buy at the bakery or supermarket.',
    constraints: [{ type: 'containsAny', words: ['panadería', 'supermercado'] }],
    models: ['Compro pan en la panadería.'] },

  { id: 'w-describe-room-vocab13', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Describe your bedroom or kitchen (mention two things in it).',
    constraints: [{ type: 'containsAny', words: ['habitación', 'cocina', 'cama', 'mesa', 'silla', 'ventana'] }, { type: 'minWords', n: 6 }],
    models: ['Mi habitación tiene una cama y una ventana grande.'] },
  { id: 'w-keys-phone-vocab13', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Say something you often lose (keys, phone...).',
    constraints: [{ type: 'containsAny', words: ['llave', 'teléfono'] }],
    models: ['Siempre pierdo las llaves de casa.'] },

  { id: 'w-money-clothes-vocab14', type: 'write', level: 1, theme: 'compras',
    prompt: 'Say something about money or clothes.',
    constraints: [{ type: 'containsAny', words: ['dinero', 'ropa'] }],
    models: ['Necesito comprar ropa nueva.'] },
  { id: 'w-neighborhood-vocab14', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Say something about your neighborhood.',
    constraints: [{ type: 'containsWord', word: 'vecindario' }],
    models: ['Mi vecindario es muy tranquilo.'] },

  { id: 'w-body-part-vocab15', type: 'write', level: 1, theme: 'cuerpo',
    prompt: 'Say what hurts (use a body part) with “me duele”.',
    constraints: [{ type: 'containsAny', words: ['cabeza', 'mano', 'pie', 'brazo', 'pierna'] }],
    models: ['Me duele la cabeza hoy.'] },
  { id: 'w-heart-eyes-vocab15', type: 'write', level: 1, theme: 'cuerpo',
    prompt: "Describe someone's eyes or say something about the heart.",
    constraints: [{ type: 'containsAny', words: ['ojo', 'corazón'] }],
    models: ['Tiene los ojos muy bonitos.'] },

  { id: 'w-weather-nature-vocab16', type: 'write', level: 1, theme: 'naturaleza',
    prompt: 'Describe the weather using the sun, wind, or rain.',
    constraints: [{ type: 'containsAny', words: ['sol', 'viento', 'lluvia'] }],
    models: ['Hoy hace sol y no hay viento.'] },
  { id: 'w-sky-sea-vocab16', type: 'write', level: 1, theme: 'naturaleza',
    prompt: 'Describe the sky or the sea right now.',
    constraints: [{ type: 'containsAny', words: ['cielo', 'mar'] }],
    models: ['El cielo está muy azul hoy.'] },

  { id: 'w-compare-things-vocab17', type: 'write', level: 1, theme: 'compras',
    prompt: 'Compare two things using opposite adjectives (grande/pequeño, caro/barato...).',
    constraints: [{ type: 'containsAny', words: ['grande', 'pequeño', 'caro', 'barato', 'fácil', 'difícil'] }, { type: 'minWords', n: 6 }],
    models: ['Este piso es pequeño pero barato.'] },
  { id: 'w-new-old-vocab17', type: 'write', level: 1, theme: 'compras',
    prompt: 'Say if you prefer new or old things.',
    constraints: [{ type: 'containsAny', words: ['nuevo', 'viejo'] }],
    models: ['Prefiero los coches nuevos.'] },

  { id: 'w-fast-slow-vocab18', type: 'write', level: 1, theme: 'caracter',
    prompt: 'Say if you are fast or slow at something.',
    constraints: [{ type: 'containsAny', words: ['rápido', 'lento'] }],
    models: ['Soy muy rápido corriendo.'] },
  { id: 'w-feelings-vocab18', type: 'write', level: 1, theme: 'caracter',
    prompt: 'Say if you feel happy or sad today.',
    constraints: [{ type: 'containsAny', words: ['feliz', 'triste'] }],
    models: ['Hoy estoy muy feliz.'] },

  // ==== vocab-lesson writing tasks (chunks 19-27) ====
  { id: 'w-ask-question-vocab19', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Write a question asking where someone lives.',
    constraints: [{ type: 'question' }, { type: 'containsWord', word: 'dónde' }],
    models: ['¿Dónde vives?'] },
  { id: 'w-ask-why-vocab19', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Write a question asking why someone is late.',
    constraints: [{ type: 'question' }, { type: 'containsWord', word: 'por qué' }],
    models: ['¿Por qué llegas tarde?'] },

  { id: 'w-contrast-vocab20', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Write a sentence contrasting two things using “pero” or “aunque”.',
    constraints: [{ type: 'containsAny', words: ['pero', 'aunque'] }, { type: 'minWords', n: 6 }],
    models: ['Me gusta el café, aunque prefiero el té.'] },
  { id: 'w-reason-vocab20', type: 'write', level: 1, theme: 'educacion',
    prompt: 'Give a reason for something using “porque”.',
    constraints: [{ type: 'containsWord', word: 'porque' }],
    models: ['Estudio español porque quiero viajar.'] },

  { id: 'w-nearby-far-vocab21', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Say something that is near and something that is far.',
    constraints: [{ type: 'containsWord', word: 'cerca' }, { type: 'containsWord', word: 'lejos' }],
    models: ['Mi casa está cerca, pero mi trabajo está lejos.'] },
  { id: 'w-quantity-vocab21', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Say how much of something you have (mucho/poco).',
    constraints: [{ type: 'containsAny', words: ['mucho', 'poco'] }],
    models: ['Tengo mucho tiempo libre hoy.'] },

  { id: 'w-nobody-something-vocab22', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Say that nobody is home, using “nadie”.',
    constraints: [{ type: 'containsWord', word: 'nadie' }],
    models: ['No hay nadie en casa.'] },
  { id: 'w-someone-something-vocab22', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Say that someone or something is in the room, using “alguien” or “algo”.',
    constraints: [{ type: 'containsAny', words: ['alguien', 'algo'] }],
    models: ['Hay alguien en la puerta.'] },

  { id: 'w-school-supplies-vocab23', type: 'write', level: 1, theme: 'educacion',
    prompt: 'Say what you have in your backpack or on your desk.',
    constraints: [{ type: 'containsAny', words: ['mochila', 'cuaderno', 'bolígrafo', 'lápiz', 'escritorio'] }, { type: 'minWords', n: 6 }],
    models: ['En mi mochila tengo un cuaderno y un bolígrafo.'] },
  { id: 'w-whiteboard-vocab23', type: 'write', level: 1, theme: 'educacion',
    prompt: 'Say what the teacher writes on the board.',
    constraints: [{ type: 'containsWord', word: 'pizarra' }],
    models: ['La profesora escribe la fecha en la pizarra.'] },

  { id: 'w-symptoms-vocab24', type: 'write', level: 1, theme: 'salud',
    prompt: 'Say a symptom you have (dolor, fiebre, gripe...).',
    constraints: [{ type: 'containsAny', words: ['dolor', 'fiebre', 'gripe', 'estrés', 'ansiedad'] }],
    models: ['Tengo dolor de cabeza hoy.'] },
  { id: 'w-doctor-visit-vocab24', type: 'write', level: 1, theme: 'salud',
    prompt: 'Say you have an appointment with the doctor or dentist.',
    constraints: [{ type: 'containsAny', words: ['cita médica', 'dentista', 'farmacia'] }],
    models: ['Tengo una cita médica mañana con el dentista.'] },

  { id: 'w-checkup-vocab25', type: 'write', level: 1, theme: 'salud',
    prompt: 'Say when your next checkup is.',
    constraints: [{ type: 'containsWord', word: 'chequeo' }],
    models: ['El próximo chequeo es en tres meses.'] },
  { id: 'w-checkup2-vocab25', type: 'write', level: 1, theme: 'salud',
    prompt: 'Say why regular checkups are important.',
    constraints: [{ type: 'containsWord', word: 'chequeo' }, { type: 'minWords', n: 5 }],
    models: ['El chequeo anual ayuda a prevenir problemas graves.'] },

  { id: 'w-price-discount-vocab26', type: 'write', level: 1, theme: 'compras',
    prompt: 'Say something is on sale or has a discount.',
    constraints: [{ type: 'containsAny', words: ['oferta', 'descuento', 'precio'] }],
    models: ['Esta chaqueta tiene un buen descuento.'] },
  { id: 'w-brand-vocab26', type: 'write', level: 1, theme: 'compras',
    prompt: 'Say what your favorite brand is.',
    constraints: [{ type: 'containsWord', word: 'marca' }],
    models: ['Mi marca favorita de ropa es esta.'] },

  { id: 'w-sport-play-vocab27', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Say what sport you play and with whom.',
    constraints: [{ type: 'containsAny', words: ['fútbol', 'baloncesto', 'tenis', 'natación'] }, { type: 'minWords', n: 5 }],
    models: ['Juego al fútbol con mis amigos los sábados.'] },
  { id: 'w-gym-team-vocab27', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Say something about your gym or team.',
    constraints: [{ type: 'containsAny', words: ['gimnasio', 'equipo'] }],
    models: ['Voy al gimnasio tres veces por semana.'] },

  // ==== vocab-lesson writing tasks (time2, adj3, travel, weather, clothing, animals, kitchen, work, tech1) ====
  { id: 'w-weekday-vocab-time2', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what day of the week it is today.',
    constraints: [{ type: 'containsAny', words: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] }],
    models: ['Hoy es viernes.'] },
  { id: 'w-early-late-vocab-time2', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say if you usually arrive early or late.',
    constraints: [{ type: 'containsAny', words: ['temprano', 'tarde'] }],
    models: ['Normalmente llego temprano al trabajo.'] },

  { id: 'w-nervous-calm-vocab-adj3', type: 'write', level: 1, theme: 'educacion',
    prompt: 'Say if you feel nervous or calm before an exam.',
    constraints: [{ type: 'containsAny', words: ['nervioso', 'tranquilo'] }],
    models: ['Estoy muy tranquilo antes de los exámenes.'] },
  { id: 'w-grateful-excited-vocab-adj3', type: 'write', level: 1, theme: 'caracter',
    prompt: 'Say something you feel grateful or excited about.',
    constraints: [{ type: 'containsAny', words: ['agradecido', 'emocionado'] }],
    models: ['Estoy muy agradecido por mi familia.'] },

  { id: 'w-transport-vocab-travel', type: 'write', level: 1, theme: 'viajes',
    prompt: 'Say how you prefer to travel (car, train, plane...).',
    constraints: [{ type: 'containsAny', words: ['coche', 'tren', 'avión', 'autobús'] }],
    models: ['Prefiero viajar en tren.'] },
  { id: 'w-suitcase-vocab-travel', type: 'write', level: 1, theme: 'viajes',
    prompt: 'Say what you pack in your suitcase for a trip.',
    constraints: [{ type: 'containsAny', words: ['maleta', 'billete', 'hotel'] }],
    models: ['Meto mucha ropa en la maleta.'] },

  { id: 'w-storm-vocab-weather', type: 'write', level: 1, theme: 'naturaleza',
    prompt: 'Describe a storm or foggy day.',
    constraints: [{ type: 'containsAny', words: ['tormenta', 'niebla', 'nieve'] }],
    models: ['Hoy hay mucha niebla por la mañana.'] },
  { id: 'w-clouds-vocab-weather', type: 'write', level: 1, theme: 'naturaleza',
    prompt: 'Say something about the clouds today.',
    constraints: [{ type: 'containsWord', word: 'nube' }],
    models: ['El cielo está lleno de nubes.'] },

  { id: 'w-outfit-vocab-clothing', type: 'write', level: 1, theme: 'compras',
    prompt: 'Describe what you are wearing today (mention two items).',
    constraints: [{ type: 'containsAny', words: ['camisa', 'pantalones', 'vestido', 'zapatos', 'abrigo'] }, { type: 'minWords', n: 6 }],
    models: ['Llevo una camisa azul y pantalones negros.'] },
  { id: 'w-coat-vocab-clothing', type: 'write', level: 1, theme: 'compras',
    prompt: 'Say when you wear a coat.',
    constraints: [{ type: 'containsWord', word: 'abrigo' }],
    models: ['Llevo abrigo cuando hace mucho frío.'] },

  { id: 'w-pet-vocab-animals', type: 'write', level: 1, theme: 'naturaleza',
    prompt: 'Say what pet you have or would like to have.',
    constraints: [{ type: 'containsAny', words: ['perro', 'gato', 'pájaro'] }],
    models: ['Tengo un perro y un gato en casa.'] },
  { id: 'w-farm-animal-vocab-animals', type: 'write', level: 1, theme: 'naturaleza',
    prompt: 'Say a farm animal you like.',
    constraints: [{ type: 'containsAny', words: ['vaca', 'caballo', 'oveja'] }],
    models: ['Me gustan mucho los caballos.'] },

  { id: 'w-cooking-tools-vocab-kitchen', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what kitchen tool you use to cook.',
    constraints: [{ type: 'containsAny', words: ['sartén', 'cuchillo', 'cuchara', 'tenedor'] }],
    models: ['Uso la sartén para cocinar huevos.'] },
  { id: 'w-set-table-vocab-kitchen', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what you put on the table to eat.',
    constraints: [{ type: 'containsAny', words: ['plato', 'cuchara', 'tenedor'] }, { type: 'minWords', n: 5 }],
    models: ['Pongo un plato y un tenedor en la mesa.'] },

  { id: 'w-meeting-vocab-work', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say when your next meeting is.',
    constraints: [{ type: 'containsWord', word: 'reunión' }],
    models: ['Mi próxima reunión es mañana.'] },
  { id: 'w-project-report-vocab-work', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what project or report you are working on.',
    constraints: [{ type: 'containsAny', words: ['proyecto', 'informe'] }],
    models: ['Trabajo en un proyecto nuevo esta semana.'] },

  { id: 'w-computer-vocab-tech1', type: 'write', level: 1, theme: 'ciencia',
    prompt: 'Say what you use your computer or phone for.',
    constraints: [{ type: 'containsAny', words: ['ordenador', 'móvil', 'aplicación'] }, { type: 'minWords', n: 5 }],
    models: ['Uso el ordenador para trabajar y el móvil para hablar.'] },
  { id: 'w-password-vocab-tech1', type: 'write', level: 1, theme: 'ciencia',
    prompt: 'Say something about passwords or wifi.',
    constraints: [{ type: 'containsAny', words: ['contraseña', 'wifi'] }],
    models: ['Siempre olvido mi contraseña.'] },

  // ==== vocab-lesson writing tasks (tech2, finance1/2, career1/2, professions, relationships, society, bureaucracy) ====
  { id: 'w-video-call-vocab-tech2', type: 'write', level: 1, theme: 'ciencia',
    prompt: 'Say something about a video call you had or will have.',
    constraints: [{ type: 'containsWord', word: 'videollamada' }],
    models: ['Tengo una videollamada con mi familia el domingo.'] },
  { id: 'w-privacy-vocab-tech2', type: 'write', level: 1, theme: 'ciencia',
    prompt: 'Say something about online privacy.',
    constraints: [{ type: 'containsAny', words: ['privacidad', 'datos personales'] }],
    models: ['Me preocupa mucho la privacidad en internet.'] },

  { id: 'w-monthly-bills-vocab-fin1', type: 'write', level: 1, theme: 'economia',
    prompt: 'Say what bills or expenses you pay each month.',
    constraints: [{ type: 'containsAny', words: ['alquiler', 'hipoteca', 'factura'] }, { type: 'minWords', n: 5 }],
    models: ['Pago el alquiler y las facturas cada mes.'] },
  { id: 'w-savings-vocab-fin1', type: 'write', level: 1, theme: 'economia',
    prompt: 'Say something about your savings or budget.',
    constraints: [{ type: 'containsAny', words: ['ahorro', 'presupuesto'] }],
    models: ['Tengo un presupuesto estricto cada mes.'] },

  { id: 'w-income-tax-vocab-fin2', type: 'write', level: 1, theme: 'economia',
    prompt: 'Say something about income tax.',
    constraints: [{ type: 'containsWord', word: 'impuesto sobre la renta' }],
    models: ['Pago el impuesto sobre la renta cada año.'] },
  { id: 'w-income-tax2-vocab-fin2', type: 'write', level: 2, theme: 'economia',
    prompt: 'Say when you last paid income tax.',
    constraints: [{ type: 'containsWord', word: 'impuesto sobre la renta' }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['Pagué el impuesto sobre la renta el mes pasado.'] },

  { id: 'w-job-search-vocab-career1', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what you look for in a job (horario, sueldo...).',
    constraints: [{ type: 'containsAny', words: ['horario', 'sueldo', 'contrato'] }],
    models: ['Busco un buen horario y un sueldo justo.'] },
  { id: 'w-company-vocab-career1', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say something about the company you work for.',
    constraints: [{ type: 'containsWord', word: 'empresa' }],
    models: ['Mi empresa es pequeña pero muy buena.'] },

  { id: 'w-remote-work-vocab-career2', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say if you prefer remote work or the office.',
    constraints: [{ type: 'containsWord', word: 'teletrabajo' }],
    models: ['Prefiero el teletrabajo a ir a la oficina.'] },
  { id: 'w-training-vocab-career2', type: 'write', level: 1, theme: 'educacion',
    prompt: 'Say something about your training or education.',
    constraints: [{ type: 'containsAny', words: ['formación', 'especialización', 'maestría'] }],
    models: ['Tengo una formación en marketing digital.'] },

  { id: 'w-profession-vocab-professions', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what profession you have or would like to have.',
    constraints: [{ type: 'containsAny', words: ['médico', 'profesor', 'abogado', 'ingeniero', 'cocinero'] }],
    models: ['Me gustaría ser ingeniero algún día.'] },
  { id: 'w-waiter-police-vocab-professions', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say something about a waiter or police officer.',
    constraints: [{ type: 'containsAny', words: ['camarero', 'policía'] }],
    models: ['El camarero de ese restaurante es muy amable.'] },

  { id: 'w-couple-vocab-relationships', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Say something about a couple you know (married, dating...).',
    constraints: [{ type: 'containsAny', words: ['pareja', 'matrimonio', 'boda'] }],
    models: ['Mi pareja y yo vivimos juntos desde hace un año.'] },
  { id: 'w-family-life-vocab-relationships', type: 'write', level: 2, theme: 'relaciones',
    prompt: 'Say something about raising children or starting a family.',
    constraints: [{ type: 'containsWord', word: 'crianza' }],
    models: ['La crianza de mis hijos me hizo más paciente.'] },

  { id: 'w-environment-vocab-society', type: 'write', level: 1, theme: 'naturaleza',
    prompt: 'Say something about the environment or climate change.',
    constraints: [{ type: 'containsAny', words: ['medio ambiente', 'cambio climático', 'contaminación'] }],
    models: ['Me preocupa mucho el cambio climático.'] },
  { id: 'w-news-vocab-society', type: 'write', level: 1, theme: 'medios',
    prompt: 'Say something you saw in the news recently.',
    constraints: [{ type: 'containsWord', word: 'noticias' }],
    models: ['Vi las noticias esta mañana sobre política.'] },

  { id: 'w-paperwork-vocab-bureaucracy', type: 'write', level: 1, theme: 'servicios',
    prompt: 'Say something about paperwork or documents you need.',
    constraints: [{ type: 'containsAny', words: ['trámite', 'documento'] }],
    models: ['Necesito hacer un trámite en el ayuntamiento.'] },
  { id: 'w-identity-vocab-bureaucracy', type: 'write', level: 1, theme: 'identidad',
    prompt: 'Say something about your identity documents or nationality.',
    constraints: [{ type: 'containsAny', words: ['identidad', 'nacionalidad'] }],
    models: ['Mi nacionalidad es española.'] },

  // ==== grammar-lesson anchor writing tasks (ser-estar, por-para, preterite-imperfect, gender-articles) ====
  { id: 't-ser-estar-anchor', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “My brother is a doctor and is very busy today.”',
    constraints: [{ type: 'verbFormAny', inf: 'ser', tense: 'presente' }, { type: 'verbFormAny', inf: 'estar', tense: 'presente' }],
    models: ['Mi hermano es médico y está muy ocupado hoy.'] },

  { id: 'w-por-para-anchor', type: 'write', level: 2, theme: 'trabajo',
    prompt: 'Write a sentence using both “por” and “para”.',
    constraints: [{ type: 'containsWord', word: 'por' }, { type: 'containsWord', word: 'para' }, { type: 'minWords', n: 6 }],
    models: ['Trabajo por la mañana para ganar dinero extra.'] },

  { id: 'w-pretimp-anchor', type: 'write', level: 2, theme: 'relaciones',
    prompt: 'Tell a short story: describe the background (imperfect) and one event that happened (preterite).',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 10 }],
    models: ['Yo dormía tranquilamente en mi cama cuando mi hermano llegó a casa esta mañana.'] },

  { id: 'w-gender-anchor', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Describe three objects around you with their correct article (el/la).',
    constraints: [{ type: 'minWords', n: 6 }],
    models: ['Veo el libro, la ventana y el reloj de la habitación.'] },

  // ==== batch: B1 (levels 4-5) — build ====
  { id: 'b-hope-arrive-b1', type: 'build', level: 4, theme: 'viajes', en: 'I hope you (tú) arrive on time.',
    answer: 'Espero que llegues a tiempo.' },
  { id: 'b-close-door-b1', type: 'build', level: 4, theme: 'vivienda', en: 'Close the door, please.',
    answer: 'Cierra la puerta, por favor.' },
  { id: 'b-had-finished-b1', type: 'build', level: 4, theme: 'trabajo', en: 'She had already finished the report.',
    answer: 'Ella ya había terminado el informe.' },
  { id: 'b-will-have-learned-b1', type: 'build', level: 5, theme: 'educacion', en: 'By June, I will have learned a lot.',
    answer: 'Para junio, habré aprendido mucho.' },
  { id: 'b-would-have-preferred-b1', type: 'build', level: 5, theme: 'vivienda', en: 'I would have preferred a smaller house.',
    answer: 'Yo habría preferido una casa más pequeña.' },
  { id: 'b-hope-arrived-b1', type: 'build', level: 5, theme: 'viajes', en: 'I hope you have arrived home safely.',
    answer: 'Espero que hayas llegado bien a casa.' },
  { id: 'b-sign-here-b1', type: 'build', level: 4, theme: 'servicios', en: 'Sign here, please. (usted)',
    answer: 'Firme aquí, por favor.' },
  { id: 'b-if-had-time-b1', type: 'build', level: 4, theme: 'viajes', en: 'If I had more time, I would travel more.',
    answer: 'Si tuviera más tiempo, viajaría más.' },
  { id: 'b-had-already-sold-b1', type: 'build', level: 4, theme: 'vivienda', en: 'They had already sold the house.',
    answer: 'Ellos ya habían vendido la casa.' },
  { id: 'b-will-have-arrived-b1', type: 'build', level: 5, theme: 'viajes', en: 'By ten, they will have arrived.',
    answer: 'Para las diez, ellos habrán llegado.' },

  // ==== batch: B1 (levels 4-5) — translate ====
  { id: 't-recommend-eat-better', type: 'translate', level: 4, theme: 'salud',
    prompt: 'Translate: "I recommend that you (tú) eat better."',
    hint: 'te recomiendo que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'recomiendo que', label: 'start with "te recomiendo que"' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Te recomiendo que comas mejor.'] },

  { id: 't-doubt-arrive-b1', type: 'translate', level: 4, theme: 'trabajo',
    prompt: 'Translate: "I doubt that he arrives on time."',
    hint: 'dudo que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'dudo que', label: 'start with "dudo que"' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Dudo que llegue a tiempo.'] },

  { id: 't-if-knew-truth', type: 'translate', level: 4, theme: 'relaciones',
    prompt: 'Translate: "If she knew the truth, she would be furious."',
    hint: 'imperfect subjunctive + conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' }
    ],
    models: ['Si ella supiera la verdad, estaría furiosa.'] },

  { id: 't-had-left-b1', type: 'translate', level: 4, theme: 'relaciones',
    prompt: 'Translate: "When I arrived, they had already left."',
    hint: 'pluscuamperfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' }
    ],
    models: ['Cuando llegué, ellos ya habían salido.'] },

  { id: 't-command-usted-sign', type: 'translate', level: 4, theme: 'servicios',
    prompt: 'Translate: "Sign here, please." (usted command)',
    hint: 'usted imperative.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' }
    ],
    models: ['Firme aquí, por favor.'] },

  { id: 't-hope-she-lead', type: 'translate', level: 4, theme: 'trabajo',
    prompt: 'Translate: "I hope she leads the project."',
    hint: 'espero que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'espero que', label: 'start with "espero que"' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Espero que ella dirija el proyecto.'] },

  { id: 't-will-have-sold', type: 'translate', level: 5, theme: 'vivienda',
    prompt: 'Translate: "By December, we will have sold the house."',
    hint: 'futuro perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'nosotros' }
    ],
    models: ['Para diciembre, habremos vendido la casa.'] },

  { id: 't-would-have-chosen-b1', type: 'translate', level: 5, theme: 'trabajo',
    prompt: 'Translate: "In her place, I would have chosen another job."',
    hint: 'condicional perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['En su lugar, yo habría elegido otro trabajo.'] },

  { id: 't-hope-have-arrived', type: 'translate', level: 5, theme: 'viajes',
    prompt: 'Translate: "I hope they have arrived by now."',
    hint: 'pretérito perfecto de subjuntivo.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfsubj' }
    ],
    models: ['Espero que ya hayan llegado.'] },

  { id: 't-would-not-have-bought', type: 'translate', level: 5, theme: 'compras',
    prompt: 'Translate: "Without that discount, I would not have bought it."',
    hint: 'condicional perfecto + negation.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'negation' }
    ],
    models: ['Sin ese descuento, no lo habría comprado.'] },

  // ==== batch: B1 (levels 4-5) — write ====
  { id: 'w-advice-colleague', type: 'write', level: 4, theme: 'trabajo',
    prompt: 'Give advice to a colleague who is overwhelmed with work, starting with "Te aconsejo que…".',
    hint: 'Subjunctive after aconsejar que.',
    constraints: [
      { type: 'regex', pattern: 'aconsejo que', label: 'start with "te aconsejo que"' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Te aconsejo que hables con tu jefe.', 'Te aconsejo que pidas ayuda a tu equipo.'] },

  { id: 'w-command-tu-call', type: 'write', level: 4, theme: 'relaciones',
    prompt: 'Give a tú command telling someone to call you tomorrow.',
    hint: 'tú imperative.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' },
      { type: 'minWords', n: 3 }
    ],
    models: ['Llámame mañana, por favor.'] },

  { id: 'w-plusc-before', type: 'write', level: 4, theme: 'ocio',
    prompt: 'Say something that had already happened before you arrived somewhere.',
    hint: 'pluscuamperfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' }
    ],
    models: ['Cuando llegué a la fiesta, ya se habían ido todos.', 'Antes de mi visita, ya habían terminado la obra.'] },

  { id: 'w-hypothesis-job-loss', type: 'write', level: 4, theme: 'trabajo',
    prompt: 'Say what you would do if you lost your job.',
    hint: 'Si + imperfect subjunctive, conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' }
    ],
    models: ['Si perdiera mi trabajo, buscaría otro rápidamente.'] },

  { id: 'w-futperf-month-end', type: 'write', level: 5, theme: 'educacion',
    prompt: 'Say something you will have finished by the end of the month, using the futuro perfecto.',
    hint: 'habré + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Para fin de mes, habré terminado el curso.'] },

  { id: 'w-condperf-trip', type: 'write', level: 5, theme: 'viajes',
    prompt: 'Say what you would have done differently on a trip.',
    hint: 'habría + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'minWords', n: 5 }
    ],
    models: ['En ese viaje, habría reservado el hotel con más tiempo.'] },

  { id: 'w-usted-permission-window', type: 'write', level: 4, theme: 'servicios',
    prompt: 'Ask a stranger, formally (usted), for permission to open the window.',
    hint: 'A polite question with usted.',
    constraints: [
      { type: 'question' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Perdone, ¿podría abrir la ventana?'] },

  { id: 'w-perfsubj-recovery', type: 'write', level: 5, theme: 'salud',
    prompt: 'Say you hope a friend has recovered from an illness, using pretérito perfecto de subjuntivo.',
    hint: 'espero que + haya + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfsubj' }
    ],
    models: ['Espero que te hayas recuperado pronto.', 'Espero que ya te hayas mejorado.'] },

  // ==== batch: B1 (levels 4-5) — paragraph ====
  { id: 'p-advice-family-career', type: 'paragraph', level: 4, theme: 'trabajo',
    prompt: 'Write a paragraph giving advice to a family member who wants to change careers.',
    hint: 'Subjunctive after espero que / te recomiendo que / es importante que; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presubj' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Entiendo que quieras cambiar de carrera. Te recomiendo que lo pienses bien porque es una decisión importante. También espero que hables con un experto antes de decidir, pero al final la decisión es tuya.'] },

  { id: 'p-hypothetical-city', type: 'paragraph', level: 4, theme: 'viajes',
    prompt: 'Write a paragraph about what you would do if you lived in a different city.',
    hint: 'Si + imperfect subjunctive, conditional; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Si viviera en otra ciudad, buscaría un trabajo nuevo y conocería a gente diferente. También aprendería sobre la cultura local porque me interesa mucho. Sé que sería difícil al principio, pero creo que valdría la pena.'] },

  { id: 'p-futperf-five-years', type: 'paragraph', level: 5, theme: 'trabajo',
    prompt: 'Write a paragraph about everything you will have achieved in five years, using the futuro perfecto.',
    hint: 'habré + participio, several times; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Dentro de cinco años, habré terminado mis estudios y habré empezado a trabajar en lo que me gusta. También habré viajado a varios países porque siempre he querido conocer el mundo. Espero que para entonces también habré aprendido a hablar español con fluidez.'] },

  { id: 'p-condperf-career-choices', type: 'paragraph', level: 5, theme: 'trabajo',
    prompt: 'Write a paragraph reflecting on career choices you would have made differently.',
    hint: 'habría + participio, several times; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Mirando atrás, habría estudiado algo diferente porque me interesa mucho la tecnología. También habría buscado experiencia antes de terminar la universidad, pero no puedo cambiar el pasado. Aun así, me gusta pensar en estas posibilidades.'] },

  // ==== batch 2: B1 (levels 4-5), final wave — build ====
  { id: 'b-hope-rest-vosotros', type: 'build', level: 4, theme: 'salud', en: 'I hope you (vosotros) rest well.',
    answer: 'Espero que descanséis bien.' },
  { id: 'b-open-window-usted', type: 'build', level: 4, theme: 'servicios', en: 'Open the window, please. (usted)',
    answer: 'Abra la ventana, por favor.' },
  { id: 'b-had-written-b1', type: 'build', level: 4, theme: 'relaciones', en: 'I had already written the letter.',
    answer: 'Yo ya había escrito la carta.' },
  { id: 'b-would-have-called-b1', type: 'build', level: 5, theme: 'relaciones', en: 'She would have called earlier.',
    answer: 'Ella habría llamado antes.' },
  { id: 'b-will-have-finished-course', type: 'build', level: 5, theme: 'educacion', en: 'By July, they will have finished the course.',
    answer: 'Para julio, ellos habrán terminado el curso.' },

  // ==== batch 2: B1 (levels 4-5), final wave — translate ====
  { id: 't-recommend-sleep-b1', type: 'translate', level: 4, theme: 'salud',
    prompt: 'Translate: "I recommend that you (tú) sleep more."',
    hint: 'te recomiendo que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'recomiendo que', label: 'start with "te recomiendo que"' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Te recomiendo que duermas más.'] },

  { id: 't-doubt-know-answer', type: 'translate', level: 4, theme: 'educacion',
    prompt: 'Translate: "I doubt that they know the answer."',
    hint: 'dudo que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'dudo que', label: 'start with "dudo que"' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Dudo que sepan la respuesta.'] },

  { id: 't-if-had-money-b1', type: 'translate', level: 4, theme: 'vivienda',
    prompt: 'Translate: "If I had more money, I would buy a house."',
    hint: 'imperfect subjunctive + conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' }
    ],
    models: ['Si tuviera más dinero, compraría una casa.'] },

  { id: 't-had-arrived-before-call', type: 'translate', level: 4, theme: 'relaciones',
    prompt: 'Translate: "By the time she called, I had already arrived."',
    hint: 'pluscuamperfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' }
    ],
    models: ['Cuando ella llamó, yo ya había llegado.'] },

  { id: 't-will-have-read-book', type: 'translate', level: 5, theme: 'arte',
    prompt: 'Translate: "By Friday, I will have read the whole book."',
    hint: 'futuro perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Para el viernes, habré leído todo el libro.'] },

  { id: 't-would-have-stayed-longer', type: 'translate', level: 5, theme: 'viajes',
    prompt: 'Translate: "With better weather, we would have stayed longer."',
    hint: 'condicional perfecto (reflexive quedarse).',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'person', person: 'nosotros' }
    ],
    models: ['Con mejor tiempo, nos habríamos quedado más tiempo.'] },

  // ==== batch 2: B1 (levels 4-5), final wave — write ====
  { id: 'w-advice-sleep', type: 'write', level: 4, theme: 'salud',
    prompt: 'Give advice to a friend who can\'t sleep well, starting with "Te sugiero que…".',
    hint: 'Subjunctive after sugerir que.',
    constraints: [
      { type: 'regex', pattern: 'sugiero que', label: 'start with "te sugiero que"' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Te sugiero que dejes el móvil antes de dormir.', 'Te sugiero que apagues las luces antes.'] },

  { id: 'w-command-vosotros-wait', type: 'write', level: 4, theme: 'relaciones',
    prompt: 'Give a vosotros command telling a group to wait here.',
    hint: 'vosotros imperative.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' },
      { type: 'minWords', n: 2 }
    ],
    models: ['Esperad aquí, por favor.'] },

  { id: 'w-plusc-life-event', type: 'write', level: 4, theme: 'viajes',
    prompt: 'Say something you had never done before a specific moment in your life.',
    hint: 'pluscuamperfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' }
    ],
    models: ['Antes de ese verano, nunca había viajado sola.', 'Antes de mudarme, nunca había vivido lejos de mi familia.'] },

  { id: 'w-futperf-career-decade', type: 'write', level: 5, theme: 'trabajo',
    prompt: 'Say something you will have accomplished in your career in ten years.',
    hint: 'habré + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Dentro de diez años, habré logrado mis objetivos profesionales.'] },

  { id: 'w-condperf-someone-else', type: 'write', level: 5, theme: 'caracter',
    prompt: 'Say what you would have decided in someone else\'s situation.',
    hint: 'habría + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'minWords', n: 5 }
    ],
    models: ['En su situación, yo habría tomado la misma decisión.'] },

  // ==== batch 2: B1 (levels 4-5), final wave — paragraph ====
  { id: 'p-plusc-memory', type: 'paragraph', level: 4, theme: 'identidad',
    prompt: 'Write a paragraph about a memory: what had already happened before something surprising occurred.',
    hint: 'pluscuamperfecto, several times; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'cuando'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Antes de aquel día, nunca había visto algo tan extraño. Ya habíamos terminado de cenar cuando escuchamos un ruido fuerte fuera. Salimos a mirar, pero no encontramos nada, y nunca supimos qué había sido.'] },

  { id: 'p-perfsubj-hopes', type: 'paragraph', level: 5, theme: 'trabajo',
    prompt: 'Write a paragraph expressing hopes about things that may have already happened, using pretérito perfecto de subjuntivo.',
    hint: 'haya + participio, several times; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfsubj' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Espero que todo haya salido bien en tu entrevista de trabajo. También espero que hayas dormido bien porque sé que estabas nerviosa. Ojalá que ya te hayan llamado con buenas noticias, pero si no, seguro que llegará pronto.'] },

  /* ============================================================================
   * B2 WRITING TASKS — batch 1 of 8 (WORKLIST.md § writing). Uses the B2/C1-
   * specific constraints (subjunctiveAfter, avoidsPerson, avoidsAny,
   * cliticCluster, sePassive, distinctTenses, minSentences) alongside the
   * existing basic ones. Levels 6-7. NOTE: `connectorFrom` is not used here —
   * tools/test-checker.js does not load data/connectors.js, so any model
   * using it fails self-verification; `containsAny` with explicit connector
   * words does the same job without that dependency.
   * ========================================================================== */
  { id: 'b2t-contraargumento-economia', type: 'translate', level: 6, theme: 'economia',
    prompt: 'Translate: "The proposal is expensive; however, the board approved it."',
    hint: 'Use a contraargumentativo connector such as "sin embargo".',
    constraints: [
      { type: 'containsAny', words: ['sin embargo', 'no obstante', 'en cambio', 'aunque'] },
      { type: 'minWords', n: 6 }
    ],
    models: ['La propuesta es cara; sin embargo, la junta la aprobó.'] },

  { id: 'b2t-paraque-educacion', type: 'translate', level: 6, theme: 'educacion',
    prompt: 'Translate: "They explained everything again so that no one would have doubts."',
    hint: '"para que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'para que' },
      { type: 'minWords', n: 6 }
    ],
    models: ['Lo explicaron todo de nuevo para que nadie tuviera dudas.'] },

  { id: 'b2w-antibioticos-salud', type: 'write', level: 6, theme: 'salud',
    prompt: 'Explain to a patient, in a formal register, why it is important to finish a full course of antibiotics.',
    hint: 'Address the patient as "usted", not "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 20 }
    ],
    models: ['Es fundamental que complete usted todo el tratamiento con antibióticos, aunque los síntomas hayan desaparecido antes. De lo contrario, la infección podría no eliminarse por completo y las bacterias podrían volverse resistentes.'] },

  { id: 'b2w-algoritmos-medios', type: 'write', level: 7, theme: 'medios',
    prompt: 'Write about whether social media algorithms are good or bad for society, in a formal register, using a contraargumentativo connector.',
    hint: 'Avoid colloquial fillers; concede one point before countering it.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'tío', 'guay'] },
      { type: 'containsAny', words: ['sin embargo', 'no obstante', 'en cambio', 'aunque'] },
      { type: 'minWords', n: 25 }
    ],
    models: ['Los algoritmos de las redes sociales mantienen a los usuarios más tiempo conectados. Sin embargo, ese mismo diseño favorece la difusión de contenido sensacionalista frente al meramente informativo.'] },

  { id: 'p-cambio-carrera-trabajo', type: 'paragraph', level: 6, theme: 'trabajo',
    prompt: 'Write a paragraph narrating a career change: what happened, how things are now, and what you expect for the future.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Hace dos años dejé mi trabajo en el banco. Ahora trabajo como autónomo desde casa y gano menos, pero estoy mucho más tranquilo. Para el año que viene espero haber conseguido suficientes clientes como para no depender de un solo proyecto. Nunca había imaginado que un cambio así me haría tan feliz.'] },

  { id: 'p-cambio-climatico-naturaleza', type: 'paragraph', level: 7, theme: 'naturaleza',
    prompt: 'Write a paragraph about climate change, conceding a counterargument with "aunque" + subjunctive.',
    hint: 'Concede a point with "aunque" + subjunctive, then counter it; write at least four sentences.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'aunque' },
      { type: 'minSentences', n: 4 }
    ],
    models: ['El cambio climático ya afecta a millones de personas cada año. Aunque algunos gobiernos hayan reducido sus emisiones, la mayoría sigue sin cumplir sus propios compromisos. Las consecuencias, mientras tanto, se agravan cada temporada. Actuar de verdad exigirá bastante más que promesas.'] },

  { id: 'b2t-cliticos-relaciones', type: 'translate', level: 6, theme: 'relaciones',
    prompt: 'Translate: "I already told them the whole truth about it."',
    hint: 'Use a double object pronoun: "se lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Ya se lo conté todo.'] },

  { id: 'b2w-vacuna-ciencia', type: 'write', level: 7, theme: 'ciencia',
    prompt: 'Describe, in an impersonal register using "se", how a vaccine is tested before approval.',
    hint: 'Use "se" constructions throughout instead of naming who does the testing.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Antes de aprobarse, cada vacuna se somete a varias fases de ensayos clínicos. Primero se prueba en un grupo reducido de voluntarios, y solo después se administra a miles de personas para confirmar su seguridad.'] },

  { id: 'b2b-oferta-viajes', type: 'build', level: 6, theme: 'viajes', en: 'They would have accepted the offer if it had arrived on time.',
    answer: 'Habrían aceptado la oferta si hubiera llegado a tiempo.' },
  { id: 'b2b-proyecto-servicios', type: 'build', level: 7, theme: 'servicios', en: 'I doubt they have already finished the project.',
    answer: 'Dudo que ya hayan terminado el proyecto.' },

  /* ---- B2 writing, batch 2 of 8 ---- */
  { id: 'b2t-cuando-politica', type: 'translate', level: 6, theme: 'politica',
    prompt: 'Translate: "When the vote finally takes place, we will already know the result of the survey."',
    hint: '"cuando" + subjunctive for a future event still pending.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'cuando' },
      { type: 'minWords', n: 8 }
    ],
    models: ['Cuando por fin se celebre la votación, ya conoceremos el resultado de la encuesta.'] },

  { id: 'b2t-guia-museo-arte', type: 'translate', level: 6, theme: 'arte',
    prompt: 'Translate, as a formal museum guide addressing visitors: "If you look closely, you will notice the artist\'s technique."',
    hint: 'Address the visitors as "usted/ustedes", never "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 6 }
    ],
    models: ['Si se fijan bien, notarán la técnica del artista.'] },

  { id: 'b2w-vocacion-religion', type: 'write', level: 6, theme: 'religion',
    prompt: 'Write about someone who changed their beliefs later in life, conceding that not everyone will understand the decision.',
    hint: 'Concede a point with "aunque" or "aun cuando" before making your own point.',
    constraints: [
      { type: 'containsAny', words: ['aunque', 'aun cuando', 'a pesar de'] },
      { type: 'minWords', n: 20 }
    ],
    models: ['Aunque muchos de sus amigos no lo entendieran, decidió seguir adelante con su nueva fe. Para ella, la decisión no respondía a ningún gesto simbólico, sino a una reflexión personal de años.'] },

  { id: 'b2w-nombre-identidad', type: 'write', level: 7, theme: 'identidad',
    prompt: 'Write, in a formal register, about why someone might choose to change their name as an adult.',
    hint: 'Avoid colloquialisms; this is a reflective, formal piece.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'tío', 'guay', 'qué va'] },
      { type: 'minWords', n: 25 }
    ],
    models: ['Cambiar de nombre en la edad adulta rara vez responde a un capricho pasajero. Con frecuencia, refleja años de sentir que el nombre recibido al nacer nunca terminó de encajar con la propia identidad.'] },

  { id: 'p-jefe-exigente-caracter', type: 'paragraph', level: 6, theme: 'caracter',
    prompt: 'Write a paragraph describing a demanding boss: what they were like before, how they are now, and how you expect to feel about them in the future.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Al principio me parecía una jefa insoportable, siempre exigiendo más de lo razonable. Ahora entiendo que su exigencia tenía un motivo real detrás. Para cuando termine este proyecto, seguramente habré aprendido más de ella que de nadie más en la empresa. Nunca imaginé que llegaría a agradecérselo.'] },

  { id: 'p-torneo-ajedrez-ocio', type: 'paragraph', level: 6, theme: 'ocio',
    prompt: 'Write a paragraph about an amateur competition, explaining what was done so that everyone could participate fairly.',
    hint: '"para que" + subjunctive; write at least four sentences.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'para que' },
      { type: 'minSentences', n: 4 }
    ],
    models: ['El club organizó un torneo abierto a todos los vecinos del barrio. Cambiaron el reglamento para que también pudieran participar los principiantes. Al final, ganó una adolescente que apenas llevaba un año jugando. Nadie esperaba un resultado así.'] },

  { id: 'b2t-piso-vivienda', type: 'translate', level: 6, theme: 'vivienda',
    prompt: 'Translate: "The landlord finally gave it back to us."',
    hint: 'Use a double object pronoun: "se lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 4 }
    ],
    models: ['El casero por fin nos lo devolvió.'] },

  { id: 'b2w-devoluciones-compras', type: 'write', level: 7, theme: 'compras',
    prompt: 'Describe, in an impersonal register using "se", how returns are typically handled in an online shop.',
    hint: 'Use "se" constructions throughout instead of naming who handles each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Cuando se solicita una devolución, primero se revisa el estado del producto. Si todo está correcto, se reembolsa el importe en un plazo de cinco días, y se notifica al cliente por correo electrónico.'] },

  { id: 'b2b-mercado-alimentacion', type: 'build', level: 6, theme: 'alimentacion', en: 'I would have bought more vegetables if the market had still been open.',
    answer: 'Habría comprado más verduras si el mercado hubiera estado todavía abierto.' },
  { id: 'b2b-lesion-cuerpo', type: 'build', level: 7, theme: 'cuerpo', en: 'It is unlikely that he has already recovered from such a serious injury.',
    answer: 'Es poco probable que ya se haya recuperado de una lesión tan grave.' },

  /* ---- B2 writing, batch 3 of 8 ---- */
  { id: 'p-lobo-naturaleza-futperf', type: 'paragraph', level: 6, theme: 'naturaleza',
    prompt: 'Write a paragraph speculating about why the wolves haven\'t been seen in the valley this month, using the futuro perfecto as conjecture.',
    hint: '"Habrán..." to guess about the past; write at least 25 words.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'minWords', n: 25 }
    ],
    models: ['Los pastores llevan un mes sin avistar a la manada. Habrán encontrado presas más abundantes en otra zona del valle, o quizás se habrán desplazado hacia el norte, donde hay menos actividad humana.'] },

  { id: 'b2w-jefe-condperf-trabajo', type: 'write', level: 6, theme: 'trabajo',
    prompt: 'Write what you would have done differently, in someone else\'s position, facing a difficult decision at work.',
    hint: '"Yo que tú, habría..." reaches the condicional perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'minWords', n: 20 }
    ],
    models: ['Yo que tú, habría hablado directamente con el jefe antes de tomar una decisión tan drástica. Habría explicado la situación con calma, en vez de dimitir sin más explicación.'] },

  { id: 'b2t-amenoss-salud', type: 'translate', level: 7, theme: 'salud',
    prompt: 'Translate: "The treatment won\'t work unless the patient follows it exactly."',
    hint: '"a menos que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'a menos que' },
      { type: 'minWords', n: 6 }
    ],
    models: ['El tratamiento no funcionará a menos que el paciente lo siga exactamente.'] },

  { id: 'b2w-repetir-curso-educacion', type: 'write', level: 6, theme: 'educacion',
    prompt: 'Write, in a formal register, advice to a parent whose child might repeat a school year.',
    hint: 'Address the parent as "usted", not "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'containsAny', words: ['conviene', 'convendría', 'sería recomendable', 'le recomiendo'] },
      { type: 'minWords', n: 20 }
    ],
    models: ['Le recomiendo que no tome esta decisión únicamente en función de las calificaciones. Convendría hablar primero con el tutor, con el fin de entender qué dificultades tiene realmente su hijo en cada asignatura.'] },

  { id: 'p-bache-servicios-relativa', type: 'paragraph', level: 7, theme: 'servicios',
    prompt: 'Write a paragraph about a problem the city council finally fixed, using a relative clause with pluscuamperfecto ("el bache que habían denunciado...").',
    hint: 'Reach the pluscuamperfecto through a relative clause, not "antes de".',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' },
      { type: 'minSentences', n: 3 }
    ],
    models: ['El bache que los vecinos habían denunciado durante meses por fin se reparó la semana pasada. Nadie esperaba una respuesta tan rápida. Ahora solo falta que arreglen también la farola rota de la esquina.'] },

  { id: 'b2t-reencuentro-relaciones', type: 'translate', level: 6, theme: 'relaciones',
    prompt: 'Translate: "In the end, she gave it to him in person."',
    hint: 'Use a double object pronoun: "se lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Al final, se lo dio en persona.'] },

  { id: 'b2b-tren-nocturno-viajes', type: 'build', level: 6, theme: 'viajes', en: 'If the night train hadn\'t been delayed, we would have arrived on time.',
    answer: 'Si el tren nocturno no se hubiera retrasado, habríamos llegado a tiempo.' },
  { id: 'b2b-panaderia-economia', type: 'build', level: 7, theme: 'economia', en: 'It is likely that the bakery has already found new customers.',
    answer: 'Es probable que la panadería ya haya encontrado nuevos clientes.' },

  { id: 'b2w-referendum-politica', type: 'write', level: 7, theme: 'politica',
    prompt: 'Describe, in an impersonal register using "se", how a local referendum is typically organized.',
    hint: 'Use "se" constructions throughout instead of naming who organizes each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Primero se convoca oficialmente la votación con al menos un mes de antelación. Después se informa a todos los vecinos censados, y finalmente se cuenta cada voto ante representantes de ambas posturas.'] },

  { id: 'b2t-restauracion-arte', type: 'translate', level: 6, theme: 'arte',
    prompt: 'Translate, for a museum catalogue in a formal register: "The restoration took nearly a year to complete."',
    hint: 'Avoid colloquial words; this is written for publication.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 6 }
    ],
    models: ['La restauración tardó casi un año en completarse.'] },

  /* ---- B2 writing, batch 4 of 8 ---- */
  { id: 'p-ramadan-comosi-religion', type: 'paragraph', level: 6, theme: 'religion',
    prompt: 'Write a paragraph about someone observing a religious practice with total dedication, using "como si" + imperfecto de subjuntivo.',
    hint: '"como si" + imperfecto de subjuntivo; write at least three sentences.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'minSentences', n: 3 }
    ],
    models: ['Durante el Ramadán, mi vecino ayuna como si nunca hubiera comido en su vida. Organiza cada día alrededor del amanecer y la puesta de sol. Nunca se queja, aunque el calor del verano complique bastante el ayuno.'] },

  { id: 'b2w-nombre-identidad-2', type: 'write', level: 6, theme: 'identidad',
    prompt: 'Write about a family that reacted with surprise to a personal decision, but eventually came to accept it.',
    hint: 'Include a concession with "aunque" or "a pesar de".',
    constraints: [
      { type: 'containsAny', words: ['aunque', 'a pesar de', 'sin embargo'] },
      { type: 'minWords', n: 20 }
    ],
    models: ['Aunque al principio la familia se mostró bastante sorprendida, con el tiempo terminó aceptando la decisión sin mayor resistencia. Nadie esperaba un cambio de opinión tan rápido.'] },

  { id: 'b2t-sinque-caracter', type: 'translate', level: 7, theme: 'caracter',
    prompt: 'Translate: "He managed to calm everyone down without anyone noticing his own nervousness."',
    hint: '"sin que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'sin que' },
      { type: 'minWords', n: 8 }
    ],
    models: ['Consiguió calmar a todos sin que nadie notara su propio nerviosismo.'] },

  { id: 'b2w-escalada-ocio', type: 'write', level: 6, theme: 'ocio',
    prompt: 'Write, in a formal register, a short notice reminding club members to book a slot on the climbing wall in advance.',
    hint: 'Address members as "ustedes", never "tú"; avoid the word "para" (it homographs a tú imperative) — use "con el fin de" instead.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Los socios deben reservar su turno con antelación, con el fin de evitar aglomeraciones en el rocódromo durante las horas de mayor afluencia.'] },

  { id: 'p-covivienda-vivienda', type: 'paragraph', level: 6, theme: 'vivienda',
    prompt: 'Write a paragraph about a co-housing project: how it started, how it works now, and what you expect for its future.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Dos vecinas jubiladas propusieron la idea hace cinco años. Hoy, veintiséis personas comparten zonas comunes sin renunciar a su propio apartamento. Dentro de una década, probablemente habrá inspirado proyectos similares en otros barrios. Nadie imaginaba un éxito así al principio.'] },

  { id: 'b2t-suscripcion-compras', type: 'translate', level: 6, theme: 'compras',
    prompt: 'Translate: "In the end, they refunded it to me without any problem."',
    hint: 'Use a double object pronoun: "me lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Al final, me lo reembolsaron sin ningún problema.'] },

  { id: 'b2b-receta-alimentacion', type: 'build', level: 6, theme: 'alimentacion', en: 'My grandmother had already written that recipe down before I was born.',
    answer: 'Mi abuela ya había escrito esa receta antes de que yo naciera.' },
  { id: 'b2b-donante-cuerpo', type: 'build', level: 7, theme: 'cuerpo', en: 'It is essential that the donor be compatible with the patient.',
    answer: 'Es fundamental que el donante sea compatible con el paciente.' },

  { id: 'b2w-noticias-medios', type: 'write', level: 7, theme: 'medios',
    prompt: 'Describe, in an impersonal register using "se", how a news story is typically fact-checked before publication.',
    hint: 'Use "se" constructions throughout instead of naming who checks each fact.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Antes de publicarse, cada dato se contrasta con al menos dos fuentes independientes. Si se detecta alguna inconsistencia, se retrasa la publicación hasta que se resuelve la duda.'] },

  { id: 'b2t-bateria-ciencia', type: 'translate', level: 6, theme: 'ciencia',
    prompt: 'Translate, for a science magazine in a formal register: "The battery gradually loses capacity over time."',
    hint: 'Avoid colloquial words; this is written for publication.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 6 }
    ],
    models: ['La batería pierde capacidad gradualmente con el paso del tiempo.'] },

  /* ---- B2 writing, batch 5 of 8 ---- */
  { id: 'b2t-glaciar-naturaleza', type: 'translate', level: 6, theme: 'naturaleza',
    prompt: 'Translate: "Unless emissions drop soon, the glacier will disappear within a decade."',
    hint: '"a menos que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'a menos que' },
      { type: 'minWords', n: 8 }
    ],
    models: ['A menos que las emisiones bajen pronto, el glaciar desaparecerá en una década.'] },

  { id: 'p-semana-4dias-trabajo', type: 'paragraph', level: 7, theme: 'trabajo',
    prompt: 'Write a paragraph about a company that tried a four-day week: what happened, how it works now, and what you expect for its future.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['La empresa probó la semana de cuatro días hace un año. Hoy, casi todos los empleados prefieren este modelo al anterior. Dentro de poco, es probable que otras empresas del sector hayan copiado la medida. Nadie esperaba resultados tan positivos al principio.'] },

  { id: 'b2w-fibromialgia-salud', type: 'write', level: 6, theme: 'salud',
    prompt: 'Write, in a formal register, an explanation to a colleague about why a chronic illness without a clear diagnosis is still real.',
    hint: 'Avoid colloquialisms; keep a measured, formal tone.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'tío', 'guay', 'qué va'] },
      { type: 'minWords', n: 20 }
    ],
    models: ['Un dolor crónico sin diagnóstico inmediato no implica, en absoluto, que carezca de fundamento real. Muchas enfermedades exigen años de pruebas antes de identificarse con claridad.'] },

  { id: 'b2t-bilinguismo-educacion', type: 'translate', level: 6, theme: 'educacion',
    prompt: 'Translate: "Although bilingual children may show a smaller vocabulary in each language, the combined total is similar."',
    hint: '"aunque" + subjunctive to concede a point.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'aunque' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Aunque los niños bilingües muestren un vocabulario menor en cada idioma, el total combinado es similar.'] },

  { id: 'p-mediador-servicios', type: 'paragraph', level: 6, theme: 'servicios',
    prompt: 'Write a paragraph about a mediator resolving a dispute between neighbors, using a relative clause to reach the pluscuamperfecto.',
    hint: 'Reach the pluscuamperfecto through a relative clause, not "antes de".',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' },
      { type: 'minSentences', n: 3 }
    ],
    models: ['El conflicto que los vecinos habían arrastrado durante meses se resolvió en una sola reunión. El mediador propuso un pago escalonado que ambas partes aceptaron. Hoy vuelven a saludarse en el rellano sin ninguna tensión.'] },

  { id: 'b2t-hermanos-relaciones', type: 'translate', level: 6, theme: 'relaciones',
    prompt: 'Translate: "The hospital finally gave them back to each other, after ten years of silence."',
    hint: 'This one is figurative — focus on the double object pronoun structure: "se los".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 5 }
    ],
    models: ['El hospital al final se los devolvió, tras diez años de silencio.'] },

  { id: 'b2b-autobus-viajes', type: 'build', level: 6, theme: 'viajes', en: 'It is likely that the tour bus has already left without them.',
    answer: 'Es probable que el autobús turístico ya haya salido sin ellos.' },
  { id: 'b2b-renta-economia', type: 'build', level: 7, theme: 'economia', en: 'If the government had tried the experiment sooner, the results would have been clearer.',
    answer: 'Si el gobierno hubiera probado el experimento antes, los resultados habrían sido más claros.' },

  { id: 'b2w-ley-politica', type: 'write', level: 7, theme: 'politica',
    prompt: 'Describe, in an impersonal register using "se", the main stages a bill goes through before becoming law.',
    hint: 'Use "se" constructions throughout instead of naming who does each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Primero se redacta un anteproyecto, que se somete a consulta pública. Después se debate artículo por artículo, y finalmente se vota en ambas cámaras antes de publicarse la ley definitiva.'] },

  { id: 'b2t-falsificador-arte', type: 'translate', level: 7, theme: 'arte',
    prompt: 'Translate, for an art catalogue in a formal register: "The forgery fooled several museums for decades."',
    hint: 'Avoid colloquial words; this is written for publication.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 6 }
    ],
    models: ['La falsificación engañó a varios museos durante décadas.'] },

  /* ---- B2 writing, batch 6 of 8 ---- */
  { id: 'b2w-ermitano-religion', type: 'write', level: 6, theme: 'religion',
    prompt: 'Write about a monk who accepts that certain traditions will disappear once he is gone, without bitterness.',
    hint: 'Include a concession with "aunque" or "a pesar de".',
    constraints: [
      { type: 'containsAny', words: ['aunque', 'a pesar de', 'sin embargo'] },
      { type: 'minWords', n: 20 }
    ],
    models: ['Aunque sabe que muchas tradiciones del monasterio se perderán cuando él falte, las acepta sin ninguna angustia aparente. A pesar de todo, sigue rezando cada día con la misma disciplina de siempre.'] },

  { id: 'p-apellido-identidad', type: 'paragraph', level: 6, theme: 'identidad',
    prompt: 'Write a paragraph about a family tradition that changed: what it used to be, what it is now, and what you expect for the future.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Durante generaciones, el apellido paterno siempre precedía al materno. Hoy, cada vez más familias eligen libremente el orden. Dentro de unas décadas, es posible que la costumbre tradicional haya dejado de ser mayoritaria. Nadie imaginaba un cambio tan rápido hace apenas veinte años.'] },

  { id: 'b2t-bromista-caracter', type: 'translate', level: 7, theme: 'caracter',
    prompt: 'Translate: "He always jokes so that no one notices his own discomfort."',
    hint: '"para que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'para que' },
      { type: 'minWords', n: 8 }
    ],
    models: ['Siempre bromea para que nadie note su propia incomodidad.'] },

  { id: 'b2w-coro-ocio', type: 'write', level: 6, theme: 'ocio',
    prompt: 'Write, in a formal register, a short announcement inviting neighbors to join a new community choir.',
    hint: 'Address readers as "ustedes"; avoid "para" and any other word that could double as a tú-form.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Los vecinos interesados en la música están invitados a apuntarse al nuevo coro comunitario, sin necesidad de experiencia musical previa. Los ensayos serán los martes por la tarde en el centro cultural.'] },

  { id: 'b2t-okupacion-vivienda', type: 'translate', level: 7, theme: 'vivienda',
    prompt: 'Translate: "Unless the tenants leave voluntarily, the process could take months."',
    hint: '"a menos que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'a menos que' },
      { type: 'minWords', n: 8 }
    ],
    models: ['A menos que los inquilinos se marchen voluntariamente, el proceso podría durar meses.'] },

  { id: 'p-segunda-mano-compras', type: 'paragraph', level: 6, theme: 'compras',
    prompt: 'Write a paragraph about how buying second-hand clothes has changed, using a relative clause to reach the pluscuamperfecto.',
    hint: 'Reach the pluscuamperfecto through a relative clause, not "antes de".',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' },
      { type: 'minSentences', n: 3 }
    ],
    models: ['El estigma que durante años había rodeado a la ropa usada ha desaparecido casi por completo entre los jóvenes. Hoy, muchos la prefieren por motivos ambientales. Las propias marcas ya han empezado a vender sus propias prendas de segunda mano.'] },

  { id: 'b2t-caja-recetas-alimentacion', type: 'translate', level: 6, theme: 'alimentacion',
    prompt: 'Translate: "Her mother gave it to her before she passed away."',
    hint: 'Use a double object pronoun: "se lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Su madre se lo dio antes de fallecer.'] },

  { id: 'b2b-medula-cuerpo', type: 'build', level: 6, theme: 'cuerpo', en: 'I would never have imagined that a simple test could save a stranger\'s life.',
    answer: 'Nunca habría imaginado que una simple prueba pudiera salvar la vida de un desconocido.' },
  { id: 'b2b-deepfake-medios', type: 'build', level: 7, theme: 'medios', en: 'It is unlikely that we will stop trusting images completely.',
    answer: 'Es poco probable que dejemos de confiar en las imágenes por completo.' },

  { id: 'b2w-agujero-negro-ciencia', type: 'write', level: 7, theme: 'ciencia',
    prompt: 'Describe, in an impersonal register using "se", how a black hole was photographed for the first time.',
    hint: 'Use "se" constructions throughout instead of naming who did each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Para lograr la imagen, se combinaron datos de radiotelescopios repartidos por todo el planeta. Después se procesaron durante meses, y finalmente se publicó la fotografía que confirmaba la teoría.'] },

  /* ---- B2 writing, batch 7 of 8 ---- */
  { id: 'b2w-lobo-naturaleza', type: 'write', level: 6, theme: 'naturaleza',
    prompt: 'Write about a rural community divided over the return of wolves to a valley, conceding the ranchers\' point before the conservationists\' one.',
    hint: 'Include a concession with "aunque" or "a pesar de".',
    constraints: [
      { type: 'containsAny', words: ['aunque', 'a pesar de', 'sin embargo'] },
      { type: 'minWords', n: 20 }
    ],
    models: ['Aunque el miedo de los ganaderos a perder ganado es comprensible, la presencia del lobo cumple una función ecológica real. Sin embargo, ninguna de las dos posturas parece dispuesta a ceder del todo.'] },

  { id: 'p-repartidores-trabajo', type: 'paragraph', level: 6, theme: 'trabajo',
    prompt: 'Write a paragraph about delivery workers organizing collectively: how it started, how it works now, and what you expect for the future.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Todo empezó con un grupo de mensajería entre unos pocos repartidores. Hoy, la asociación negocia directamente con varias plataformas locales. Dentro de poco, es probable que otras ciudades hayan copiado el modelo. Nadie confiaba en que aquello llegara tan lejos.'] },

  { id: 'b2t-diagnostico-salud', type: 'translate', level: 7, theme: 'salud',
    prompt: 'Translate: "She kept searching for an explanation without anyone taking her pain seriously."',
    hint: '"sin que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'sin que' },
      { type: 'minWords', n: 8 }
    ],
    models: ['Siguió buscando una explicación sin que nadie tomara en serio su dolor.'] },

  { id: 'b2w-profesor-educacion', type: 'write', level: 6, theme: 'educacion',
    prompt: 'Write, in a formal register, a short tribute to a retiring teacher, to be read at a school ceremony.',
    hint: 'Avoid "tú"; favor compound tenses and preterite over regular present-tense verbs, which double as tú commands.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 20 }
    ],
    models: ['Este profesor dedicó más de cuatro décadas de su vida a la enseñanza en el mismo instituto. Numerosas promociones de antiguos alumnos regresaron después, con el fin de agradecérselo en persona.'] },

  { id: 'b2t-mediador-servicios', type: 'translate', level: 6, theme: 'servicios',
    prompt: 'Translate: "Unless both parties reach an agreement, the case will end up in court."',
    hint: '"a menos que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'a menos que' },
      { type: 'minWords', n: 8 }
    ],
    models: ['A menos que ambas partes lleguen a un acuerdo, el caso acabará en los tribunales.'] },

  { id: 'p-amistad-distancia-relaciones', type: 'paragraph', level: 6, theme: 'relaciones',
    prompt: 'Write a paragraph about a long-distance friendship, using a relative clause to reach the pluscuamperfecto.',
    hint: 'Reach the pluscuamperfecto through a relative clause, not "antes de".',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' },
      { type: 'minSentences', n: 3 }
    ],
    models: ['La rutina que habían mantenido durante seis años seguidos resistió, contra todo pronóstico, la distancia entre los dos países. Ninguna de las dos esperaba que una simple videollamada semanal fuera tan importante. Hoy siguen sintiéndose tan cerca como siempre.'] },

  { id: 'b2t-trenes-viajes', type: 'translate', level: 6, theme: 'viajes',
    prompt: 'Translate: "The company finally gave the tickets back to the passengers."',
    hint: 'Use a double object pronoun: "se los".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 5 }
    ],
    models: ['La compañía por fin se los devolvió a los pasajeros.'] },

  { id: 'b2b-cooperativa-economia', type: 'build', level: 6, theme: 'economia', en: 'If they hadn\'t joined together in a cooperative, none of them would have survived the competition.',
    answer: 'Si no se hubieran unido en una cooperativa, ninguno de ellos habría sobrevivido a la competencia.' },
  { id: 'b2b-referendum-politica', type: 'build', level: 7, theme: 'politica', en: 'It is likely that the project will have been rejected by a narrow margin.',
    answer: 'Es probable que el proyecto haya sido rechazado por un estrecho margen.' },

  { id: 'b2t-mural-arte', type: 'translate', level: 6, theme: 'arte',
    prompt: 'Translate, for a museum catalogue in a formal register: "The restorers worked for almost a year on the mural."',
    hint: 'Avoid colloquial words; this is written for publication.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 6 }
    ],
    models: ['Los restauradores trabajaron casi un año en el mural.'] },

  /* ---- B2 writing, batch 8 of 8 — completes 80/80 ---- */
  { id: 'b2t-ramadan-religion', type: 'translate', level: 6, theme: 'religion',
    prompt: 'Translate: "Unless one has fasted before, the first days can feel very hard."',
    hint: '"a menos que" governs the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'a menos que' },
      { type: 'minWords', n: 8 }
    ],
    models: ['A menos que uno haya ayunado antes, los primeros días pueden resultar muy duros.'] },

  { id: 'p-apellido-materno-identidad', type: 'paragraph', level: 6, theme: 'identidad',
    prompt: 'Write a paragraph about a legal reform that changed a personal-identity custom, using a relative clause to reach the pluscuamperfecto.',
    hint: 'Reach the pluscuamperfecto through a relative clause, not "antes de".',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' },
      { type: 'minSentences', n: 3 }
    ],
    models: ['El orden de apellidos que la tradición había impuesto durante siglos dejó de ser obligatorio en 2013. Desde entonces, cada familia decide libremente. Todavía sorprende a algunos parientes mayores, aunque cada vez menos.'] },

  { id: 'b2w-perfeccionista-caracter', type: 'write', level: 7, theme: 'caracter',
    prompt: 'Write about the difference between healthy striving for excellence and unhealthy perfectionism, conceding a point before making yours.',
    hint: 'Include a concession with "aunque" or "a pesar de".',
    constraints: [
      { type: 'containsAny', words: ['aunque', 'a pesar de', 'sin embargo'] },
      { type: 'minWords', n: 20 }
    ],
    models: ['Aunque buscar la excelencia resulta generalmente saludable, el perfeccionismo propiamente dicho fija un estándar imposible de alcanzar. Sin embargo, muchas personas confunden ambas cosas durante años.'] },

  { id: 'b2t-covivienda-vivienda', type: 'translate', level: 7, theme: 'vivienda',
    prompt: 'Translate: "It is essential that shared tasks be distributed fairly among residents."',
    hint: '"es fundamental que" governs the subjunctive.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presubj' },
      { type: 'minWords', n: 8 }
    ],
    models: ['Es fundamental que las tareas compartidas se repartan de forma justa entre los residentes.'] },

  { id: 'p-moda-rapida-compras', type: 'paragraph', level: 6, theme: 'compras',
    prompt: 'Write a paragraph about fast fashion: what it used to mean, what it means now, and what you expect will change.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Durante años, una camiseta barata parecía simplemente una buena oportunidad. Hoy, cada vez más consumidores conocen el coste humano y ambiental real. Dentro de poco, es posible que muchas marcas hayan cambiado su modelo por presión pública. Nadie esperaba que el debate avanzara tan rápido.'] },

  { id: 'b2t-huerto-alimentacion', type: 'translate', level: 6, theme: 'alimentacion',
    prompt: 'Translate: "The neighbors gave it to the community garden."',
    hint: 'Use a double object pronoun: "se lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Los vecinos se lo dieron al huerto comunitario.'] },

  { id: 'b2b-transplante-cuerpo', type: 'build', level: 7, theme: 'cuerpo', en: 'It is possible that he will need two more years of therapy before feeling fully himself again.',
    answer: 'Es posible que necesite dos años más de terapia antes de volver a sentirse plenamente él mismo.' },
  { id: 'b2b-quejas-servicios', type: 'build', level: 6, theme: 'servicios', en: 'If the council had reviewed the data sooner, they would have fixed the pothole months ago.',
    answer: 'Si el ayuntamiento hubiera revisado los datos antes, habría reparado el bache hace meses.' },

  { id: 'b2w-algoritmo-medios', type: 'write', level: 7, theme: 'medios',
    prompt: 'Describe, in an impersonal register using "se", how a social network\'s feed typically decides what to show a user.',
    hint: 'Use "se" constructions throughout instead of naming who designs each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Cada publicación se evalúa según cientos de señales de comportamiento recogidas antes. Después se ordena todo el contenido disponible, y finalmente se muestra primero aquello que, según el sistema, mantendrá más tiempo conectado al usuario.'] },

  { id: 'b2t-agujeros-negros-ciencia', type: 'translate', level: 7, theme: 'ciencia',
    prompt: 'Translate, for a science magazine in a formal register: "Not even light can escape a black hole\'s gravitational pull."',
    hint: 'Avoid colloquial words; this is written for publication.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 8 }
    ],
    models: ['Ni siquiera la luz puede escapar de la atracción gravitatoria de un agujero negro.'] },

  { id: 'c1b-informe-viernes', type: 'build', level: 9, theme: 'trabajo', en: 'It is essential that the report be submitted before Friday.',
    answer: 'Es imprescindible que el informe se entregue antes del viernes.' },
  { id: 'c1b-aviso-retraso', type: 'build', level: 9, theme: 'servicios', en: 'Had they warned us in time, we would have avoided the delay.',
    answer: 'Si nos hubieran avisado a tiempo, habríamos evitado el retraso.' },

  { id: 'c1t-explico-abogado-trabajo', type: 'translate', level: 9, theme: 'trabajo',
    prompt: 'Translate, using a double object pronoun: "The lawyer explained it to them."',
    hint: 'Use "se lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 3 }
    ],
    models: ['El abogado se lo explicó.'] },

  { id: 'c1t-resultados-ciencia', type: 'translate', level: 9, theme: 'ciencia',
    prompt: 'Translate, for a scientific bulletin in a formal register: "The results have not yet been confirmed."',
    hint: 'Avoid colloquial words; this is written for publication.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 4 }
    ],
    models: ['Los resultados todavía no se han confirmado.'] },

  { id: 'c1w-ley-aprobacion-politica', type: 'write', level: 9, theme: 'politica',
    prompt: 'Describe, in an impersonal register using "se", how a new law typically gets approved, from proposal to publication.',
    hint: 'Use "se" constructions throughout instead of naming who does each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Primero, un grupo de diputados presenta el proyecto de ley. Después, se debate en comisión y se vota en el pleno. Si se aprueba, se envía a la cámara alta, donde se revisa de nuevo antes de publicarse en el boletín oficial.'] },

  { id: 'c1w-ojala-paciente-salud', type: 'write', level: 8, theme: 'salud',
    prompt: 'Write a sentence expressing hope, using "ojalá que" + subjunctive, about a patient\'s recovery.',
    hint: 'The verb right after "ojalá que" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'ojalá que' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Ojalá que el paciente se recupere pronto.'] },

  { id: 'p-inflacion-economia', type: 'paragraph', level: 9, theme: 'economia',
    prompt: 'Write a paragraph about inflation: what it used to mean for people, what it means now, and what you expect will happen.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Durante décadas, la inflación apenas preocupaba a la mayoría de los ciudadanos. Hoy, sin embargo, cualquier subida de precios afecta directamente al presupuesto familiar. Es probable que, dentro de poco, los bancos centrales ya hayan ajustado de nuevo los tipos de interés. Nadie sabe todavía cuánto durará esta tendencia.'] },

  { id: 'c1w-formal-usted-educacion', type: 'write', level: 8, theme: 'educacion',
    prompt: 'Write formal advice to a student, addressing them as "usted", about reviewing their work before submitting it.',
    hint: 'Never address the student as "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Le recomiendo encarecidamente que revise el trabajo antes de entregarlo, y que consulte cualquier duda con antelación.'] },

  { id: 'c1b-quienquiera-luces', type: 'build', level: 9, theme: 'vivienda', en: 'Whoever arrives first should turn on the lights.',
    answer: 'Quienquiera que llegue primero debería encender las luces.' },

  { id: 'c1t-vuelo-retraso-viajes', type: 'translate', level: 8, theme: 'viajes',
    prompt: 'Translate, conceding a point with "aunque" + subjunctive: "Although the flight may be delayed, we will arrive on time."',
    hint: 'The verb right after "aunque" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'aunque' },
      { type: 'minWords', n: 6 }
    ],
    models: ['Aunque el vuelo se retrase, llegaremos a tiempo.'] },

  { id: 'c1b-para-cuando-llegues', type: 'build', level: 9, theme: 'relaciones', en: 'By the time you arrive, we will have already left.',
    answer: 'Para cuando llegues, ya nos habremos ido.' },
  { id: 'c1b-yo-que-tu-contrato', type: 'build', level: 8, theme: 'trabajo', en: 'If I were you, I would not sign that contract.',
    answer: 'Yo que tú, no firmaría ese contrato.' },

  { id: 'c1t-medida-naturaleza', type: 'translate', level: 9, theme: 'naturaleza',
    prompt: 'Translate, using a contrast connector: "However, the measure did not have the expected effect."',
    hint: 'Start with "sin embargo".',
    constraints: [
      { type: 'containsWord', word: 'sin embargo' },
      { type: 'minWords', n: 6 }
    ],
    models: ['Sin embargo, la medida no tuvo el efecto esperado.'] },

  { id: 'c1t-exposicion-arte', type: 'translate', level: 9, theme: 'arte',
    prompt: 'Translate, for a museum press release in a formal register: "The exhibition attracted an unexpectedly large audience."',
    hint: 'Avoid colloquial words; this is written for publication.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 5 }
    ],
    models: ['La exposición atrajo a un público inesperadamente numeroso.'] },

  { id: 'c1w-verificacion-medios', type: 'write', level: 9, theme: 'medios',
    prompt: 'Explain, in an impersonal register using "se", how a news article typically gets fact-checked before publication.',
    hint: 'Use "se" constructions throughout instead of naming who checks each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Primero se revisan las fuentes citadas en el artículo. Después se contrastan los datos con otras publicaciones fiables, y finalmente se corrige cualquier imprecisión antes de que el texto se publique.'] },

  { id: 'c1w-espero-amistad-relaciones', type: 'write', level: 8, theme: 'relaciones',
    prompt: 'Write a sentence hoping a friendship recovers, using "espero que" + subjunctive.',
    hint: 'The verb right after "espero que" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'espero que' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Espero que la amistad se recupere con el tiempo.'] },

  { id: 'p-viaje-planificado-viajes', type: 'paragraph', level: 9, theme: 'viajes',
    prompt: 'Write a paragraph about a trip: how you used to imagine it, how the planning is going now, and what you expect once you arrive.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['De niña, imaginaba aquel viaje como una aventura sin ningún imprevisto. Ahora mismo, sin embargo, la planificación resulta bastante más complicada de lo que recordaba. Cuando por fin lleguemos, espero que el cansancio del vuelo no nos arruine el primer día. Ya veremos si la realidad se parece en algo a lo que imaginaba entonces.'] },

  { id: 'c1w-memo-formal-trabajo', type: 'write', level: 9, theme: 'trabajo',
    prompt: 'Write a formal internal memo, addressing colleagues as "usted", asking them to submit expense reports by the end of the month.',
    hint: 'Never address the reader as "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Se ruega a todo el personal que entregue los justificantes de gastos antes de que finalice el mes.'] },

  { id: 'c1b-confeso-mintio-relaciones', type: 'build', level: 9, theme: 'relaciones', en: 'She confessed that she had lied to protect her friend.',
    answer: 'Confesó que había mentido para proteger a su amiga.' },

  { id: 'c1t-medico-receto-salud', type: 'translate', level: 8, theme: 'salud',
    prompt: 'Translate, using a double object pronoun: "The doctor prescribed it to her."',
    hint: 'Use "se la" (la receta).',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 3 }
    ],
    models: ['El médico se la recetó.'] },

  { id: 'c1b-actas-corregidas-trabajo', type: 'build', level: 9, theme: 'trabajo', en: 'The committee demanded that the minutes be corrected.',
    answer: 'El comité exigió que se corrigieran las actas.' },
  { id: 'c1b-premio-reclamado-ocio', type: 'build', level: 9, theme: 'ocio', en: 'It is a shame that no one has claimed the prize yet.',
    answer: 'Es una pena que todavía nadie haya reclamado el premio.' },

  { id: 'c1t-hipotesis-ciencia', type: 'translate', level: 9, theme: 'ciencia',
    prompt: 'Translate, using a consequence connector: "Therefore, the hypothesis was rejected."',
    hint: 'Start with "por lo tanto".',
    constraints: [
      { type: 'containsWord', word: 'por lo tanto' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Por lo tanto, la hipótesis fue rechazada.'] },

  { id: 'c1t-reembolso-compras', type: 'translate', level: 8, theme: 'compras',
    prompt: 'Translate, for a store\'s formal terms and conditions: "The refund will be processed within ten business days."',
    hint: 'Avoid colloquial words; this is written policy text.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 8 }
    ],
    models: ['El reembolso se procesará en un plazo de diez días hábiles.'] },

  { id: 'c1w-fianza-vivienda', type: 'write', level: 9, theme: 'vivienda',
    prompt: 'Explain, in an impersonal register using "se", how a rental deposit typically gets returned at the end of a lease.',
    hint: 'Use "se" constructions throughout instead of naming who checks each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Normalmente, el depósito se revisa al final del contrato. Si no hay desperfectos, se devuelve íntegramente en un plazo de treinta días; en caso contrario, se descuenta el coste de las reparaciones necesarias.'] },

  { id: 'c1w-duda-diagnostico-cuerpo', type: 'write', level: 8, theme: 'cuerpo',
    prompt: 'Write a sentence expressing doubt about a diagnosis, using "no creo que" + subjunctive.',
    hint: 'The verb right after "no creo que" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'no creo que' },
      { type: 'minWords', n: 5 }
    ],
    models: ['No creo que el diagnóstico sea correcto.'] },

  { id: 'p-identidad-cambio', type: 'paragraph', level: 9, theme: 'identidad',
    prompt: 'Write a paragraph about identity: how yours used to depend on others\' opinions, how you define yourself now, and how you expect it to keep changing.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['De adolescente, sentía que mi identidad dependía completamente de lo que pensaban los demás. Hoy en día, sin embargo, me defino sobre todo por mis propias decisiones. Dentro de unos años, probablemente habré cambiado todavía más, y eso ya no me asusta como antes. Supongo que la identidad nunca deja de construirse del todo.'] },

  { id: 'c1w-instrucciones-examen-educacion', type: 'write', level: 9, theme: 'educacion',
    prompt: 'Write formal exam instructions, addressing students as "usted"/plural, about submission time and prohibited devices.',
    hint: 'Never address the reader as "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Los alumnos deberán entregar el examen antes de las diez en punto, y no podrán utilizar ningún dispositivo electrónico durante la prueba.'] },

  { id: 'c1b-decidan-respetaremos-politica', type: 'build', level: 9, theme: 'politica', en: 'Whatever they decide, we will respect it.',
    answer: 'Decidan lo que decidan, lo respetaremos.' },

  { id: 'c1t-regalo-ocio', type: 'translate', level: 8, theme: 'ocio',
    prompt: 'Translate, using a double object pronoun: "They gave it to us as a gift."',
    hint: 'Use "nos lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 3 }
    ],
    models: ['Nos lo regalaron.'] },

  { id: 'c1b-cuanto-mas-menos-educacion', type: 'build', level: 9, theme: 'educacion', en: 'The more they explained it to me, the less I understood.',
    answer: 'Cuanto más me lo explicaban, menos entendía.' },
  { id: 'c1b-sorprendio-votado-politica', type: 'build', level: 9, theme: 'politica', en: 'It surprised us that so few people had voted.',
    answer: 'Nos sorprendió que tan pocas personas hubieran votado.' },

  { id: 'c1t-restaurante-alimentacion', type: 'translate', level: 8, theme: 'alimentacion',
    prompt: 'Translate, using a contrast connector: "Nonetheless, the restaurant maintained its reputation."',
    hint: 'Start with "no obstante".',
    constraints: [
      { type: 'containsWord', word: 'no obstante' },
      { type: 'minWords', n: 6 }
    ],
    models: ['No obstante, el restaurante mantuvo su reputación.'] },

  { id: 'c1t-ceremonia-religion', type: 'translate', level: 8, theme: 'religion',
    prompt: 'Translate, for a formal event announcement: "The ceremony will take place regardless of the weather."',
    hint: 'Avoid colloquial words; this is written for an official notice.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 6 }
    ],
    models: ['La ceremonia se celebrará independientemente del clima.'] },

  { id: 'c1w-queja-servicios', type: 'write', level: 9, theme: 'servicios',
    prompt: 'Explain, in an impersonal register using "se", how a customer complaint typically gets processed.',
    hint: 'Use "se" constructions throughout instead of naming who handles each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Primero se registra la queja en el sistema. Después se asigna a un agente responsable, y finalmente se contacta con el cliente para confirmar la resolución.'] },

  { id: 'c1w-sorpresa-reaccion-caracter', type: 'write', level: 8, theme: 'caracter',
    prompt: 'Write a sentence about someone possibly being surprised by news, using "es posible que" + subjunctive.',
    hint: 'The verb right after "es posible que" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'es posible que' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Es posible que se sorprenda con la noticia.'] },

  { id: 'p-bosque-naturaleza', type: 'paragraph', level: 9, theme: 'naturaleza',
    prompt: 'Write a paragraph about a forest: how it used to look, how it looks now, and what you expect will happen if nothing changes.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Antes, aquel bosque cubría toda la ladera sin interrupción. Actualmente, apenas quedan algunos árboles dispersos entre los campos de cultivo. Si nadie interviene pronto, es probable que la erosión haya avanzado todavía más dentro de una década. Algunos vecinos ya han empezado a replantar especies autóctonas.'] },

  { id: 'c1w-anuncio-galeria-arte', type: 'write', level: 9, theme: 'arte',
    prompt: 'Write a formal gallery announcement, addressing visitors formally, about picking up tickets in advance and respecting room capacity.',
    hint: 'Never address the reader as "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Se invita a los visitantes a recoger su entrada con antelación y a respetar el aforo máximo permitido en cada sala.'] },

  { id: 'c1b-nada-mas-llegar-relaciones', type: 'build', level: 9, theme: 'relaciones', en: 'No sooner had she arrived than the phone rang.',
    answer: 'Nada más llegar, sonó el teléfono.' },

  { id: 'c1t-enfermera-salud', type: 'translate', level: 8, theme: 'salud',
    prompt: 'Translate, using a double object pronoun: "The nurse will bring it to you right away."',
    hint: 'Use "te lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 3 }
    ],
    models: ['La enfermera te lo traerá enseguida.'] },

  { id: 'c1b-consultado-expertos-ciencia', type: 'build', level: 9, theme: 'ciencia', en: 'Had they consulted the experts, they would have avoided the mistake.',
    answer: 'De haber consultado a los expertos, habrían evitado el error.' },
  { id: 'c1b-descansa-pase-salud', type: 'build', level: 8, theme: 'salud', en: 'Get some rest, whatever happens tomorrow.',
    answer: 'Descansa, pase lo que pase mañana.' },

  { id: 'c1t-plantilla-economia', type: 'translate', level: 9, theme: 'economia',
    prompt: 'Translate, using a consequence connector: "Consequently, the company reduced its workforce."',
    hint: 'Start with "por consiguiente".',
    constraints: [
      { type: 'containsWord', word: 'por consiguiente' },
      { type: 'minWords', n: 6 }
    ],
    models: ['Por consiguiente, la empresa redujo su plantilla.'] },

  { id: 'c1t-embarque-viajes', type: 'translate', level: 8, theme: 'viajes',
    prompt: 'Translate, for an airline\'s official boarding notice: "Passengers must present a valid ID at boarding."',
    hint: 'Avoid colloquial words; this is written policy text.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 8 }
    ],
    models: ['Los pasajeros deben presentar un documento de identidad válido al embarcar.'] },

  { id: 'c1w-pedido-online-compras', type: 'write', level: 9, theme: 'compras',
    prompt: 'Explain, in an impersonal register using "se", how an online order typically gets processed and shipped.',
    hint: 'Use "se" constructions throughout instead of naming who handles each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['En cuanto se confirma el pago, se prepara el pedido en el almacén. Después se empaqueta con cuidado y se envía mediante la empresa de transporte elegida por el cliente.'] },

  { id: 'c1w-duda-identidad-identidad', type: 'write', level: 8, theme: 'identidad',
    prompt: 'Write a sentence doubting whether someone really is who they claim to be, using "dudo que" + subjunctive.',
    hint: 'The verb right after "dudo que" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'dudo que' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Dudo que esa persona sea quien dice ser.'] },

  { id: 'p-carrera-cambio-trabajo', type: 'paragraph', level: 9, theme: 'trabajo',
    prompt: 'Write a paragraph about your career: what you used to accept without question, what you choose now, and what you expect will change.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Al principio de mi carrera, aceptaba cualquier proyecto sin cuestionarlo demasiado. Hoy en día, sin embargo, elijo con mucho más cuidado en qué invierto mi tiempo. Para dentro de cinco años, probablemente habré cambiado de sector por completo. Nunca imaginé que mis prioridades cambiarían tanto.'] },

  { id: 'c1w-aviso-misa-religion', type: 'write', level: 8, theme: 'religion',
    prompt: 'Write a formal parish notice about the Sunday mass schedule, addressed to parishioners in general.',
    hint: 'Never address the reader as "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Se recuerda a los fieles que la misa dominical se celebrará a las diez de la mañana en la capilla principal.'] },

  { id: 'c1b-poco-imaginabamos-viajes', type: 'build', level: 9, theme: 'viajes', en: 'Little did we know what awaited us.',
    answer: 'Poco nos imaginábamos lo que nos esperaba.' },

  { id: 'c1t-casero-vivienda', type: 'translate', level: 8, theme: 'vivienda',
    prompt: 'Translate, using a double object pronoun: "The landlord finally gave it back to us."',
    hint: 'Use "nos lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 3 }
    ],
    models: ['El casero por fin nos lo devolvió.'] },

  { id: 'c1b-demasiado-tarde-servicios', type: 'build', level: 9, theme: 'servicios', en: 'By the time we noticed, it was too late to fix it.',
    answer: 'Para cuando nos dimos cuenta, ya era demasiado tarde para arreglarlo.' },
  { id: 'c1b-en-cuanto-firme-trabajo', type: 'build', level: 9, theme: 'trabajo', en: 'As soon as she signs it, we will send the confirmation.',
    answer: 'En cuanto lo firme, enviaremos la confirmación.' },

  { id: 'c1t-estudio-medios', type: 'translate', level: 9, theme: 'medios',
    prompt: 'Translate, using a contrast connector: "By contrast, the second study found no significant effect."',
    hint: 'Start with "en cambio".',
    constraints: [
      { type: 'containsWord', word: 'en cambio' },
      { type: 'minWords', n: 8 }
    ],
    models: ['En cambio, el segundo estudio no encontró ningún efecto significativo.'] },

  { id: 'c1t-solicitudes-educacion', type: 'translate', level: 8, theme: 'educacion',
    prompt: 'Translate, for a formal admissions notice: "Applications must be submitted no later than June 30th."',
    hint: 'Avoid colloquial words; this is official wording.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 8 }
    ],
    models: ['Las solicitudes deben presentarse a más tardar el treinta de junio.'] },

  { id: 'c1w-referendum-politica', type: 'write', level: 9, theme: 'politica',
    prompt: 'Explain, in an impersonal register using "se", how a referendum result typically gets validated.',
    hint: 'Use "se" constructions throughout instead of naming who validates each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Primero se recuentan los votos en cada colegio electoral. Después se comparan los resultados con las actas oficiales, y finalmente se publica el resultado validado por la junta electoral.'] },

  { id: 'c1w-encuanto-aficion-ocio', type: 'write', level: 8, theme: 'ocio',
    prompt: 'Write about starting a hobby as soon as you have free time, using "en cuanto" + subjunctive.',
    hint: 'The verb right after "en cuanto" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'en cuanto' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Empezaré esa afición en cuanto tenga tiempo libre.'] },

  { id: 'p-dejar-fumar-salud', type: 'paragraph', level: 9, theme: 'salud',
    prompt: 'Write a paragraph about quitting a bad habit: what it was like before, how it is going now, and what you expect for the future.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Durante años, fumaba casi un paquete diario sin pensarlo demasiado. Ahora, en cambio, llevo ya seis meses sin fumar ni un solo cigarrillo. Para el verano, es probable que ya haya recuperado buena parte de la capacidad pulmonar que perdí. Nunca pensé que dejarlo fuera posible tan pronto.'] },

  { id: 'c1w-devoluciones-compras', type: 'write', level: 9, theme: 'compras',
    prompt: 'Write a formal store return-policy notice, addressed to customers in general, about keeping the receipt.',
    hint: 'Never address the reader as "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Se ruega a los clientes que conserven el recibo de compra para poder tramitar cualquier devolución dentro del plazo establecido.'] },

  { id: 'c1b-cuanto-mas-insistas-caracter', type: 'build', level: 9, theme: 'caracter', en: 'The more you insist, the less likely I am to change my mind.',
    answer: 'Cuanto más insistas, menos probable es que cambie de opinión.' },

  { id: 'c1t-galeria-arte', type: 'translate', level: 8, theme: 'arte',
    prompt: 'Translate, using a double object pronoun and addressing the reader as "usted": "The gallery is going to send it to you by courier."',
    hint: 'Use "se lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 3 }
    ],
    models: ['La galería se lo enviará por mensajería.'] },

  { id: 'c1b-confianza-reconstruida-relaciones', type: 'build', level: 9, theme: 'relaciones', en: 'Little by little, trust was rebuilt between them.',
    answer: 'Poco a poco, se fue reconstruyendo la confianza entre ellos.' },
  { id: 'c1b-hasta-que-no-ciencia', type: 'build', level: 9, theme: 'ciencia', en: 'Not until the results arrived did they celebrate.',
    answer: 'Hasta que no llegaron los resultados, no celebraron.' },

  { id: 'c1t-sospecha-naturaleza', type: 'translate', level: 9, theme: 'naturaleza',
    prompt: 'Translate, using a confirming connector: "In fact, the data confirmed the initial suspicion."',
    hint: 'Start with "de hecho".',
    constraints: [
      { type: 'containsWord', word: 'de hecho' },
      { type: 'minWords', n: 7 }
    ],
    models: ['De hecho, los datos confirmaron la sospecha inicial.'] },

  { id: 'c1t-ausencia-trabajo', type: 'translate', level: 8, theme: 'trabajo',
    prompt: 'Translate, for a formal employee handbook: "Employees must notify their supervisor of any absence in advance."',
    hint: 'Avoid colloquial words; this is official wording.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 8 }
    ],
    models: ['Los empleados deben notificar a su supervisor cualquier ausencia con antelación.'] },

  { id: 'c1w-vacuna-aprobacion-salud', type: 'write', level: 9, theme: 'salud',
    prompt: 'Explain, in an impersonal register using "se", how a vaccine typically gets approved before distribution.',
    hint: 'Use "se" constructions throughout instead of naming who approves each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['Antes de autorizarse, cada vacuna se somete a varias fases de ensayos clínicos. Una vez completados, se revisan los resultados y se aprueba su distribución si cumplen los estándares exigidos.'] },

  { id: 'c1w-reformas-antes-vivienda', type: 'write', level: 8, theme: 'vivienda',
    prompt: 'Write about finishing renovations before tenants move in, using "antes de que" + subjunctive.',
    hint: 'The verb right after "antes de que" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'antes de que' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Terminaremos las reformas antes de que los inquilinos se muden.'] },

  { id: 'p-compras-online-compras', type: 'paragraph', level: 9, theme: 'compras',
    prompt: 'Write a paragraph about shopping habits: how you used to shop in physical stores, how you shop now, and what you expect in the future.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Antes, hacía casi todas mis compras en tiendas físicas del barrio. Ahora compro la mayoría de las cosas por internet, sin salir de casa. Para dentro de unos años, es posible que ni siquiera queden tiendas físicas cerca de mi casa. Echo de menos, la verdad, poder tocar el producto antes de comprarlo.'] },

  { id: 'c1w-fauna-parque-naturaleza', type: 'write', level: 9, theme: 'naturaleza',
    prompt: 'Write a formal park notice about not feeding wildlife, addressed to visitors in general.',
    hint: 'Never address the reader as "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Se recuerda a los visitantes que está prohibido alimentar a la fauna silvestre dentro del parque natural.'] },

  { id: 'c1b-no-solo-sino-servicios', type: 'build', level: 9, theme: 'servicios', en: 'Not only did he apologize, but he also offered compensation.',
    answer: 'No solo se disculpó, sino que además ofreció una compensación.' },

  { id: 'c1t-profesor-educacion', type: 'translate', level: 8, theme: 'educacion',
    prompt: 'Translate, using a double object pronoun: "The teacher is going to explain it to us again."',
    hint: 'Use "nos lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 3 }
    ],
    models: ['El profesor nos lo explicará de nuevo.'] },

  { id: 'c1b-pase-lo-que-pase-caracter', type: 'build', level: 9, theme: 'caracter', en: 'Whatever happens, we will keep trying.',
    answer: 'Pase lo que pase, seguiremos intentándolo.' },
  { id: 'c1b-cuanto-antes-relaciones', type: 'build', level: 8, theme: 'relaciones', en: 'The sooner you tell them, the better.',
    answer: 'Cuanto antes se lo digas, mejor.' },

  { id: 'c1t-museo-arte', type: 'translate', level: 9, theme: 'arte',
    prompt: 'Translate, using an additive connector: "Likewise, the museum extended the exhibition\'s schedule."',
    hint: 'Start with "asimismo".',
    constraints: [
      { type: 'containsWord', word: 'asimismo' },
      { type: 'minWords', n: 7 }
    ],
    models: ['Asimismo, el museo amplió el horario de la exposición.'] },

  { id: 'c1t-templo-religion', type: 'translate', level: 8, theme: 'religion',
    prompt: 'Translate, for a formal sign at the entrance of a temple: "Visitors are kindly asked to remain silent inside the temple."',
    hint: 'Avoid colloquial words; this is official signage.',
    constraints: [
      { type: 'avoidsAny', words: ['o sea', 'vale', 'guay', 'tío'] },
      { type: 'minWords', n: 8 }
    ],
    models: ['Se ruega amablemente a los visitantes que guarden silencio dentro del templo.'] },

  { id: 'c1w-equipaje-perdido-viajes', type: 'write', level: 9, theme: 'viajes',
    prompt: 'Explain, in an impersonal register using "se", how lost luggage typically gets tracked and returned.',
    hint: 'Use "se" constructions throughout instead of naming who tracks each step.',
    constraints: [
      { type: 'sePassive' },
      { type: 'minWords', n: 15 }
    ],
    models: ['En cuanto se detecta el extravío, se activa un rastreo mediante el código de la etiqueta. Si se localiza la maleta, se envía directamente al domicilio del pasajero afectado.'] },

  { id: 'c1w-tramite-para-que-economia', type: 'write', level: 8, theme: 'economia',
    prompt: 'Write about simplifying a bureaucratic process, using "para que" + subjunctive to explain its purpose.',
    hint: 'The verb right after "para que" must be in the subjunctive.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'para que' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Simplificaron el trámite para que más gente lo utilizara.'] },

  { id: 'p-forma-fisica-cuerpo', type: 'paragraph', level: 9, theme: 'cuerpo',
    prompt: 'Write a paragraph about physical fitness: how little you used to exercise, how you train now, and what you expect for an upcoming goal.',
    hint: 'Mix at least three different tenses; write at least four sentences.',
    constraints: [
      { type: 'distinctTenses', n: 3 },
      { type: 'minSentences', n: 4 }
    ],
    models: ['Hace unos años, apenas hacía ejercicio y me cansaba subiendo un solo piso de escaleras. Ahora entreno regularmente y noto una resistencia que antes no tenía. Para el próximo maratón, espero que mi cuerpo ya se haya adaptado del todo al nuevo ritmo de entrenamiento. Nunca pensé que llegaría tan lejos.'] },

  { id: 'c1w-mantenimiento-servicios', type: 'write', level: 9, theme: 'servicios',
    prompt: 'Write a formal service-interruption notice about scheduled maintenance, addressed to users in general.',
    hint: 'Never address the reader as "tú".',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minWords', n: 10 }
    ],
    models: ['Se informa a los usuarios de que el servicio permanecerá interrumpido por mantenimiento programado durante la madrugada del sábado.'] },

  { id: 'c1b-por-mucho-que-trabajo', type: 'build', level: 9, theme: 'trabajo', en: 'However hard he tries, he will not convince them.',
    answer: 'Por mucho que lo intente, no los convencerá.' },

  { id: 'c1t-sinceridad-identidad', type: 'translate', level: 8, theme: 'identidad',
    prompt: 'Translate, using a double object pronoun and addressing the reader as "usted": "I am going to tell it to you honestly."',
    hint: 'Use "se lo".',
    constraints: [
      { type: 'cliticCluster' },
      { type: 'minWords', n: 3 }
    ],
    models: ['Se lo voy a decir con toda sinceridad.'] }

];
