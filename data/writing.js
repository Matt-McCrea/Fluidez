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
  { id: 't-paella', type: 'translate', level: 1, theme: 'alimentacion',
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
  { id: 'w-yesterday', type: 'write', level: 1, theme: 'trabajo',
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
  { id: 't-cumple', type: 'translate', level: 1, theme: 'relaciones',
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

  { id: 't-already-done', type: 'translate', level: 1, theme: 'trabajo',
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

  { id: 'w-past-trip', type: 'write', level: 1, theme: 'viajes',
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

  { id: 't-sent-email', type: 'translate', level: 1, theme: 'trabajo',
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

  { id: 't-company-fired', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “Last month, the company fired several employees.”',
    hint: 'preterite, despedir.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsWord', word: 'el mes pasado' }
    ],
    models: ['El mes pasado, la empresa despidió a varios empleados.'] },

  { id: 't-invested-year', type: 'translate', level: 1, theme: 'economia',
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

  { id: 't-bought-for-gift', type: 'translate', level: 1, theme: 'compras',
    prompt: 'Translate: “I bought this gift for my sister.”',
    hint: 'preterite + para.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsWord', word: 'para' }
    ],
    models: ['Compré este regalo para mi hermana.'] },

  { id: 't-walked-through-park', type: 'translate', level: 1, theme: 'ocio',
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

  { id: 't-have-sent', type: 'translate', level: 1, theme: 'trabajo',
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

  { id: 't-have-hired', type: 'translate', level: 1, theme: 'trabajo',
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

  { id: 'w-past-purchase', type: 'write', level: 1, theme: 'compras',
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

  { id: 'w-job-yesterday', type: 'write', level: 1, theme: 'trabajo',
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

  { id: 'w-perfect-achievement', type: 'write', level: 1, theme: 'economia',
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

  { id: 'p-perfect-year-review', type: 'paragraph', level: 1, theme: 'trabajo',
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

  { id: 't-live-learn-verbos2', type: 'translate', level: 1, theme: 'viajes',
    prompt: 'Translate: “Last year I lived in Madrid and learned a lot.”',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'verbFormAny', inf: 'vivir', tense: 'preterito' }],
    models: ['El año pasado viví en Madrid y aprendí mucho.'] },
  { id: 'w-be-verbos2', type: 'write', level: 1, theme: 'caracter',
    prompt: 'Describe yourself using “ser” and “estar”.',
    constraints: [{ type: 'verbFormAny', inf: 'ser', tense: 'presente' }, { type: 'verbFormAny', inf: 'estar', tense: 'presente' }],
    models: ['Soy paciente y estoy feliz hoy.'] },

  { id: 't-could-not-verbos3', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I couldn’t finish the project yesterday.”',
    constraints: [{ type: 'verbFormAny', inf: 'poder', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer no pude terminar el proyecto.'] },
  { id: 'w-went-verbos3', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Say where you went last weekend.',
    constraints: [{ type: 'verbFormAny', inf: 'ir', tense: 'preterito' }, { type: 'containsWord', word: 'fin de semana' }],
    models: ['El fin de semana pasado fui a la playa.'] },

  { id: 't-told-truth-verbos4', type: 'translate', level: 1, theme: 'relaciones',
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
  { id: 'w-left-late-verbos5', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what time you left the house yesterday.',
    constraints: [{ type: 'verbFormAny', inf: 'salir', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer salí de casa a las ocho.'] },

  { id: 't-sleep-hours-verbos6', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: “I sleep eight hours every night.”',
    constraints: [{ type: 'verbFormAny', inf: 'dormir', tense: 'presente' }],
    models: ['Duermo ocho horas cada noche.'] },
  { id: 'w-ordered-verbos6', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what you ordered the last time you went to a restaurant.',
    constraints: [{ type: 'verbFormAny', inf: 'pedir', tense: 'preterito' }],
    models: ['Pedí pescado con ensalada.'] },

  { id: 't-got-job-verbos7', type: 'translate', level: 1, theme: 'trabajo',
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
  { id: 'w-read-book-verbos8', type: 'write', level: 1, theme: 'arte',
    prompt: 'Say what book you read last month.',
    constraints: [{ type: 'verbFormAny', inf: 'leer', tense: 'preterito' }],
    models: ['Leí una novela muy interesante.'] },

  { id: 't-think-before-verbos9', type: 'translate', level: 1, theme: 'caracter',
    prompt: 'Translate: “I think a lot before deciding.”',
    constraints: [{ type: 'verbFormAny', inf: 'pensar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Pienso mucho antes de decidir.'] },
  { id: 'w-drove-verbos9', type: 'write', level: 1, theme: 'naturaleza',
    prompt: 'Say where you drove to last weekend.',
    constraints: [{ type: 'verbFormAny', inf: 'conducir', tense: 'preterito' }],
    models: ['Conduje hasta la montaña el sábado.'] },

  // ==== verb-group lesson writing tasks (groups 10-18) ====
  { id: 't-start-work-verbos10', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I start work at nine.”',
    constraints: [{ type: 'verbFormAny', inf: 'empezar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Empiezo el trabajo a las nueve.'] },
  { id: 'w-lost-verbos10', type: 'write', level: 1, theme: 'ciencia',
    prompt: 'Say something you lost recently.',
    constraints: [{ type: 'verbFormAny', inf: 'perder', tense: 'preterito' }],
    models: ['Perdí mi teléfono la semana pasada.'] },

  { id: 't-remember-verbos11', type: 'translate', level: 1, theme: 'caracter',
    prompt: 'Translate: “I don’t remember his name.”',
    constraints: [{ type: 'negation' }, { type: 'verbFormAny', inf: 'recordar', tense: 'presente' }],
    models: ['No recuerdo su nombre.'] },
  { id: 'w-found-verbos11', type: 'write', level: 1, theme: 'economia',
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

  { id: 't-paid-verbos13', type: 'translate', level: 1, theme: 'compras',
    prompt: 'Translate: “Yesterday I paid the bill.”',
    constraints: [{ type: 'verbFormAny', inf: 'pagar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer pagué la cuenta.'] },
  { id: 'w-broke-verbos13', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Say something you broke by accident.',
    constraints: [{ type: 'verbFormAny', inf: 'romper', tense: 'preterito' }],
    models: ['Rompí un vaso sin querer.'] },

  { id: 't-call-mother-verbos14', type: 'translate', level: 1, theme: 'relaciones',
    prompt: 'Translate: “I call my mother every Sunday.”',
    constraints: [{ type: 'verbFormAny', inf: 'llamar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Llamo a mi madre todos los domingos.'] },
  { id: 'w-discovered-verbos14', type: 'write', level: 1, theme: 'ocio',
    prompt: 'Say something you discovered recently.',
    constraints: [{ type: 'verbFormAny', inf: 'descubrir', tense: 'preterito' }],
    models: ['Descubrí un restaurante nuevo cerca de casa.'] },

  { id: 't-need-time-verbos15', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I need more time.”',
    constraints: [{ type: 'verbFormAny', inf: 'necesitar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Necesito más tiempo.'] },
  { id: 'w-waited-verbos15', type: 'write', level: 1, theme: 'viajes',
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

  { id: 't-finished-report-verbos17', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “Yesterday I finished the report.”',
    constraints: [{ type: 'verbFormAny', inf: 'terminar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer terminé el informe.'] },
  { id: 'w-earn-verbos17', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what you do for a living and mention what you earn.',
    constraints: [{ type: 'verbFormAny', inf: 'ganar', tense: 'presente' }],
    models: ['Trabajo en una tienda y gano un buen sueldo.'] },

  { id: 't-traveled-verbos18', type: 'translate', level: 1, theme: 'viajes',
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
  { id: 'w-sold-verbos19', type: 'write', level: 1, theme: 'economia',
    prompt: 'Say something you sold recently.',
    constraints: [{ type: 'verbFormAny', inf: 'vender', tense: 'preterito' }],
    models: ['Vendí mi bicicleta vieja.'] },

  { id: 't-receive-emails-verbos20', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I receive many emails every day.”',
    constraints: [{ type: 'verbFormAny', inf: 'recibir', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Recibo muchos correos cada día.'] },
  { id: 'w-decided-verbos20', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say something you decided recently.',
    constraints: [{ type: 'verbFormAny', inf: 'decidir', tense: 'preterito' }],
    models: ['Decidí cambiar de trabajo.'] },

  { id: 't-breakfast-verbos21', type: 'translate', level: 1, theme: 'alimentacion',
    prompt: 'Translate: “We have breakfast together every morning.”',
    constraints: [{ type: 'verbFormAny', inf: 'desayunar', tense: 'presente' }],
    models: ['Desayunamos juntos todas las mañanas.'] },
  { id: 'w-dinner-late-verbos21', type: 'write', level: 1, theme: 'alimentacion',
    prompt: 'Say what time you had dinner yesterday.',
    constraints: [{ type: 'verbFormAny', inf: 'cenar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer cené a las diez de la noche.'] },

  { id: 't-prepare-dinner-verbos22', type: 'translate', level: 1, theme: 'alimentacion',
    prompt: 'Translate: “I prepare dinner every Sunday.”',
    constraints: [{ type: 'verbFormAny', inf: 'preparar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Preparo la cena todos los domingos.'] },
  { id: 'w-invited-verbos22', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Say who you invited to your last celebration.',
    constraints: [{ type: 'verbFormAny', inf: 'invitar', tense: 'preterito' }],
    models: ['Invité a toda mi familia a la fiesta.'] },

  { id: 't-swim-verbos23', type: 'translate', level: 1, theme: 'ocio',
    prompt: 'Translate: “I swim in the pool every summer.”',
    constraints: [{ type: 'verbFormAny', inf: 'nadar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Nado en la piscina todos los veranos.'] },
  { id: 'w-signed-verbos23', type: 'write', level: 1, theme: 'vivienda',
    prompt: 'Say something you signed recently.',
    constraints: [{ type: 'verbFormAny', inf: 'firmar', tense: 'preterito' }],
    models: ['Firmé el contrato del piso nuevo.'] },

  { id: 't-clean-house-verbos24', type: 'translate', level: 1, theme: 'vivienda',
    prompt: 'Translate: “We clean the house every Saturday.”',
    constraints: [{ type: 'verbFormAny', inf: 'limpiar', tense: 'presente' }],
    models: ['Limpiamos la casa todos los sábados.'] },
  { id: 'w-achieved-verbos24', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say something you managed to achieve recently.',
    constraints: [{ type: 'verbFormAny', inf: 'lograr', tense: 'preterito' }],
    models: ['Logré terminar el proyecto a tiempo.'] },

  { id: 't-attend-class-verbos25', type: 'translate', level: 1, theme: 'educacion',
    prompt: 'Translate: “We attend class every day.”',
    constraints: [{ type: 'verbFormAny', inf: 'asistir', tense: 'presente' }],
    models: ['Asistimos a clase todos los días.'] },
  { id: 'w-argued-verbos25', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Say what you argued about with someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'discutir', tense: 'preterito' }],
    models: ['Discutí con mi hermano sobre el coche.'] },

  { id: 't-share-flat-verbos26', type: 'translate', level: 1, theme: 'vivienda',
    prompt: 'Translate: “We share an apartment with two friends.”',
    constraints: [{ type: 'verbFormAny', inf: 'compartir', tense: 'presente' }],
    models: ['Compartimos piso con dos amigos.'] },
  { id: 'w-turned-age-verbos26', type: 'write', level: 1, theme: 'identidad',
    prompt: 'Say how old you turned on your last birthday.',
    constraints: [{ type: 'verbFormAny', inf: 'cumplir', tense: 'preterito' }],
    models: ['Cumplí treinta años en marzo.'] },

  { id: 't-listen-music-verbos27', type: 'translate', level: 1, theme: 'arte',
    prompt: 'Translate: “I listen to music while I work.”',
    constraints: [{ type: 'verbFormAny', inf: 'escuchar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Escucho música mientras trabajo.'] },
  { id: 'w-admitted-verbos27', type: 'write', level: 1, theme: 'trabajo',
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
  { id: 'w-hired-verbos29', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say who your company hired recently.',
    constraints: [{ type: 'verbFormAny', inf: 'contratar', tense: 'preterito' }],
    models: ['La empresa contrató a una diseñadora nueva.'] },

  { id: 't-recycle-verbos30', type: 'translate', level: 1, theme: 'naturaleza',
    prompt: 'Translate: “I recycle paper and plastic.”',
    constraints: [{ type: 'verbFormAny', inf: 'reciclar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Reciclo papel y plástico.'] },
  { id: 'w-installed-verbos30', type: 'write', level: 1, theme: 'ciencia',
    prompt: 'Say what program or app you installed recently.',
    constraints: [{ type: 'verbFormAny', inf: 'instalar', tense: 'preterito' }],
    models: ['Instalé una aplicación nueva para el trabajo.'] },

  { id: 't-rest-sundays-verbos31', type: 'translate', level: 1, theme: 'ocio',
    prompt: 'Translate: “I rest on Sunday afternoons.”',
    constraints: [{ type: 'verbFormAny', inf: 'descansar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Descanso los domingos por la tarde.'] },
  { id: 'w-vaccinated-verbos31', type: 'write', level: 1, theme: 'salud',
    prompt: 'Say when you were last vaccinated.',
    constraints: [{ type: 'verbFormAny', inf: 'vacunar', tense: 'preterito' }],
    models: ['Me vacuné el mes pasado.'] },

  { id: 't-program-apps-verbos32', type: 'translate', level: 1, theme: 'ciencia',
    prompt: 'Translate: “I program apps for mobile phones.”',
    constraints: [{ type: 'verbFormAny', inf: 'programar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Programo aplicaciones para móviles.'] },
  { id: 'w-voted-verbos32', type: 'write', level: 1, theme: 'trabajo',
    prompt: 'Say what you voted for recently.',
    constraints: [{ type: 'verbFormAny', inf: 'votar', tense: 'preterito' }],
    models: ['Voté por el nuevo diseño del logo.'] },

  { id: 't-opinion-verbos33', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I think the project is good.”',
    constraints: [{ type: 'verbFormAny', inf: 'opinar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Opino que el proyecto es bueno.'] },
  { id: 'w-protested-verbos33', type: 'write', level: 1, theme: 'politica',
    prompt: 'Say what people protested about recently.',
    constraints: [{ type: 'verbFormAny', inf: 'protestar', tense: 'preterito' }],
    models: ['Los vecinos protestaron por el ruido.'] },

  { id: 't-wake-early-verbos34', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “I get up early every Monday.”',
    constraints: [{ type: 'verbFormAny', inf: 'madrugar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Madrugo todos los lunes.'] },
  { id: 'w-downloaded-verbos34', type: 'write', level: 1, theme: 'arte',
    prompt: 'Say what you downloaded recently.',
    constraints: [{ type: 'verbFormAny', inf: 'descargar', tense: 'preterito' }],
    models: ['Descargué una canción nueva ayer.'] },

  { id: 't-turn-on-light-verbos35', type: 'translate', level: 1, theme: 'vivienda',
    prompt: 'Translate: “I turn on the kitchen light.”',
    constraints: [{ type: 'verbFormAny', inf: 'encender', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Enciendo la luz de la cocina.'] },
  { id: 'w-chose-verbos35', type: 'write', level: 1, theme: 'relaciones',
    prompt: 'Say what gift you chose for someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'elegir', tense: 'preterito' }],
    models: ['Elegí un libro para mi madre.'] },

  { id: 't-manage-team-verbos36', type: 'translate', level: 1, theme: 'trabajo',
    prompt: 'Translate: “She manages a team of ten people.”',
    constraints: [{ type: 'verbFormAny', inf: 'dirigir', tense: 'presente' }],
    models: ['Ella dirige un equipo de diez personas.'] },
  { id: 'w-sent-report-verbos36', type: 'write', level: 1, theme: 'trabajo',
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
  { id: 'w-grandchild2-vocab4', type: 'write', level: 1, theme: 'relaciones',
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
  { id: 'w-order2-vocab8', type: 'write', level: 1, theme: 'educacion',
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
  { id: 'w-income-tax2-vocab-fin2', type: 'write', level: 1, theme: 'economia',
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
,

  /* ---- A2 translation tasks ----------------------------------------------
   * A2 had 19 writing tasks for 81 days — 0.23 per day, against A1's 1.94 —
   * so the band that teaches the preterite/imperfect choice, object pronouns,
   * the imperative, comparatives, por/para and the conditional asked the
   * learner to produce almost none of it (CURRICULUM_AUDIT.md §1.2).
   *
   * Translation on purpose, per the standing worklist direction: it is the
   * one task type a learner cannot route around. "I have to work tomorrow"
   * must come out as `tengo que` — you cannot answer it with whatever
   * vocabulary happens to surface.
   * ------------------------------------------------------------------------ */

  { id: 't-a2-tengo-que', type: 'translate', level: 2, theme: 'trabajo',
    prompt: 'Translate: "I have to work tomorrow."',
    hint: 'Personal obligation → tener que + infinitive.',
    constraints: [{ type: 'containsWord', word: 'tengo' }, { type: 'containsWord', word: 'que' },
                  { type: 'infinitiveUsed', inf: 'trabajar' }, { type: 'person', person: 'yo' }],
    models: ['Tengo que trabajar mañana.'] },

  { id: 't-a2-hay-que', type: 'translate', level: 2, theme: 'viajes',
    prompt: 'Translate: "You have to book in advance." (people in general)',
    hint: 'Nobody in particular → hay que + infinitive.',
    constraints: [{ type: 'containsWord', word: 'hay' }, { type: 'containsWord', word: 'que' },
                  { type: 'infinitiveUsed', inf: 'reservar' }],
    models: ['Hay que reservar con antelación.'] },

  { id: 't-a2-porque-tengo', type: 'translate', level: 2, theme: 'trabajo',
    prompt: 'Translate: "I need to go because I have to work tomorrow."',
    hint: 'Two verbs plus an infinitive each, joined with porque.',
    constraints: [{ type: 'containsWord', word: 'porque' }, { type: 'containsWord', word: 'tengo' },
                  { type: 'infinitiveUsed', inf: 'trabajar' }, { type: 'person', person: 'yo' }],
    models: ['Necesito irme porque tengo que trabajar mañana.'] },

  { id: 't-a2-imperfecto-habit', type: 'translate', level: 2, theme: 'ocio',
    prompt: 'Translate: "Every summer we went to my grandmother\'s house."',
    hint: 'A repeated habit in the past → imperfect, not preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'person', person: 'nosotros' }],
    models: ['Todos los veranos íbamos a casa de mi abuela.'] },

  { id: 't-a2-interrumpido', type: 'translate', level: 2, theme: 'vivienda',
    prompt: 'Translate: "I was watching television when the telephone rang."',
    hint: 'The long action is imperfect; the one that cuts in is preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' },
                  { type: 'anyVerbInTense', tense: 'preterito' },
                  { type: 'containsWord', word: 'cuando' }],
    models: ['Veía la televisión cuando sonó el teléfono.'] },

  { id: 't-a2-ayer-conto', type: 'translate', level: 2, theme: 'relaciones',
    prompt: 'Translate: "Yesterday my sister called me and we talked for two hours."',
    hint: 'Two completed events → preterite for both.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' },
                  { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer me llamó mi hermana y hablamos durante dos horas.'] },

  { id: 't-a2-por-para', type: 'translate', level: 2, theme: 'educacion',
    prompt: 'Translate: "I study Spanish in order to work in Chile."',
    hint: 'Purpose → para + infinitive.',
    constraints: [{ type: 'containsWord', word: 'para' }, { type: 'infinitiveUsed', inf: 'trabajar' },
                  { type: 'person', person: 'yo' }],
    models: ['Estudio español para trabajar en Chile.'] },

  { id: 't-a2-gracias-por', type: 'translate', level: 2, theme: 'relaciones',
    prompt: 'Translate: "Thanks for your help, it is very kind of you."',
    hint: 'The reason you are grateful → por, not para.',
    constraints: [{ type: 'containsWord', word: 'por' }, { type: 'containsWord', word: 'gracias' }],
    models: ['Gracias por tu ayuda, eres muy amable.'] },

  { id: 't-a2-comparativo', type: 'translate', level: 2, theme: 'vivienda',
    prompt: 'Translate: "This flat is smaller than the other one but it is cheaper."',
    hint: 'más/menos … que, joined with pero.',
    constraints: [{ type: 'containsWord', word: 'que' }, { type: 'containsWord', word: 'pero' },
                  { type: 'containsAny', words: ['más', 'menos'] }],
    models: ['Este piso es más pequeño que el otro, pero es más barato.'] },

  { id: 't-a2-mayor', type: 'translate', level: 2, theme: 'relaciones',
    prompt: 'Translate: "My brother is older than me."',
    hint: 'Age between people → mayor, not más grande.',
    constraints: [{ type: 'containsWord', word: 'mayor' }, { type: 'containsWord', word: 'que' }],
    models: ['Mi hermano es mayor que yo.'] },

  { id: 't-a2-gustar-plural', type: 'translate', level: 2, theme: 'ocio',
    prompt: 'Translate: "I like books but I do not like films at all."',
    hint: 'The verb agrees with the thing: plural thing, plural verb.',
    constraints: [{ type: 'containsWord', word: 'gustan' }, { type: 'containsWord', word: 'pero' },
                  { type: 'negation' }],
    models: ['Me gustan los libros, pero no me gustan nada las películas.'] },

  { id: 't-a2-le-gusta', type: 'translate', level: 2, theme: 'ocio',
    prompt: 'Translate: "My brother loves football."',
    hint: 'Name the person with a, and keep le in front of the verb.',
    constraints: [{ type: 'containsWord', word: 'le' }, { type: 'containsWord', word: 'encanta' }],
    models: ['A mi hermano le encanta el fútbol.'] },

  { id: 't-a2-si-presente', type: 'translate', level: 2, theme: 'ocio',
    prompt: 'Translate: "If it rains, we will stay at home."',
    hint: 'After si Spanish uses the present, never the future.',
    constraints: [{ type: 'containsWord', word: 'si' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Si llueve, nos quedamos en casa.'] },

  { id: 't-a2-repair', type: 'translate', level: 2, theme: 'educacion',
    prompt: 'Translate: "Sorry, I did not catch that. Can you say it again more slowly?"',
    hint: 'Two fixed repair phrases — the exact wording matters more than the grammar.',
    constraints: [{ type: 'containsAny', words: ['perdona', 'perdón', 'perdone'] },
                  { type: 'containsWord', word: 'repetir' }, { type: 'question' }],
    models: ['Perdona, no te he entendido. ¿Puedes repetirlo más despacio?'] },

  { id: 't-a2-como-se-dice', type: 'translate', level: 2, theme: 'educacion',
    prompt: 'Translate: "How do you say it in Spanish? What does this word mean?"',
    hint: 'Two survival questions. Both use se.',
    constraints: [{ type: 'containsWord', word: 'dice' }, { type: 'containsWord', word: 'significa' },
                  { type: 'question' }],
    models: ['¿Cómo se dice en español? ¿Qué significa esta palabra?'] },

  { id: 't-a2-hedge', type: 'translate', level: 2, theme: 'trabajo',
    prompt: 'Translate: "I am not sure. Maybe he is coming tomorrow."',
    hint: 'a lo mejor takes the ordinary present, not the subjunctive.',
    constraints: [{ type: 'containsWord', word: 'seguro' }, { type: 'negation' },
                  { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['No estoy seguro. A lo mejor viene mañana.'] },

  { id: 't-a2-es-que', type: 'translate', level: 2, theme: 'relaciones',
    prompt: 'Translate: "I cannot come, it is just that I do not have time."',
    hint: 'es que softens a refusal — it is how you say no without sounding blunt.',
    constraints: [{ type: 'containsWord', word: 'es' }, { type: 'containsWord', word: 'que' },
                  { type: 'negation' }],
    models: ['No puedo venir, es que no tengo tiempo.'] },

  { id: 't-a2-lo-pronoun', type: 'translate', level: 2, theme: 'ocio',
    prompt: 'Translate: "The book? I have already read it."',
    hint: 'Replace the noun rather than repeating it — and the pronoun goes in front.',
    constraints: [{ type: 'containsWord', word: 'lo' }, { type: 'containsWord', word: 'ya' },
                  { type: 'anyVerbInTense', tense: 'perfecto' }],
    models: ['¿El libro? Ya lo he leído.'] },

  { id: 't-a2-le-escribo', type: 'translate', level: 2, theme: 'relaciones',
    prompt: 'Translate: "I write to my mother every week."',
    hint: 'You write TO her — indirect object, so le even though she is female.',
    constraints: [{ type: 'containsWord', word: 'le' }, { type: 'person', person: 'yo' },
                  { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Le escribo a mi madre todas las semanas.'] },

  { id: 't-a2-doler', type: 'translate', level: 2, theme: 'salud',
    prompt: 'Translate: "My head hurts and my feet hurt too."',
    hint: 'The body part is the subject, so the verb follows it — and Spanish uses the article, not "my".',
    constraints: [{ type: 'containsWord', word: 'duele' }, { type: 'containsWord', word: 'duelen' }],
    models: ['Me duele la cabeza y también me duelen los pies.'] },

  { id: 't-a2-gerundio', type: 'translate', level: 2, theme: 'vivienda',
    prompt: 'Translate: "Learning languages is useful, and I am studying Spanish now."',
    hint: 'English -ing does two jobs here; Spanish splits them — infinitive as a noun, gerund after estar.',
    constraints: [{ type: 'infinitiveUsed', inf: 'aprender' }, { type: 'containsWord', word: 'estoy' },
                  { type: 'containsWord', word: 'estudiando' }],
    models: ['Aprender idiomas es útil, y ahora estoy estudiando español.'] }
,

  /* ---- THEME BUILD-OUT ----------------------------------------------------
   * Nine themes taken to the depth `trabajo` already had, so that a themed
   * focus (js/focus.js) has something to narrow to for its whole run rather
   * than falling back to the general pool after two sessions.
   *
   * The gap was worst exactly where a learner is likeliest to want a focus:
   * `servicios` had ONE writing task at any level and `viajes` eight at A1,
   * while the module's own opening line is "I have a holiday in three weeks".
   *
   * Weighted to translate, per the standing worklist direction — it is the
   * one task type a learner cannot route around — and to levels 1-3, where
   * the shortage actually starves a focus.
   * ------------------------------------------------------------------------ */

  // ---- servicios: post office, bank, phone, repairs, appointments ----------
  { id: 't-serv-cita', type: 'translate', level: 1, theme: 'servicios',
    prompt: 'Translate: "I need an appointment for Monday."',
    hint: 'necesitar + noun; el lunes for "on Monday".',
    constraints: [{ type: 'containsWord', word: 'cita' }, { type: 'containsWord', word: 'necesito' }],
    models: ['Necesito una cita para el lunes.'] },
  { id: 't-serv-abre', type: 'translate', level: 1, theme: 'servicios',
    prompt: 'Translate: "What time does the bank open?"',
    hint: 'A qué hora + present tense.',
    constraints: [{ type: 'containsWord', word: 'banco' }, { type: 'question' }],
    models: ['¿A qué hora abre el banco?'] },
  { id: 't-serv-sellos', type: 'translate', level: 1, theme: 'servicios',
    prompt: 'Translate: "I would like to send this letter to Ireland."',
    hint: 'Querer in the polite past form: quería.',
    constraints: [{ type: 'containsWord', word: 'carta' }, { type: 'infinitiveUsed', inf: 'mandar' }],
    models: ['Quería mandar esta carta a Irlanda.'] },
  { id: 'b-serv-ventanilla', type: 'build', level: 1, theme: 'servicios',
    en: 'Which counter is it for parcels?', answer: '¿Cuál es la ventanilla para los paquetes?' },
  { id: 't-serv-funciona', type: 'translate', level: 1, theme: 'servicios',
    prompt: 'Translate: "The heating does not work."',
    hint: 'funcionar, with no.',
    constraints: [{ type: 'containsWord', word: 'funciona' }, { type: 'negation' }],
    models: ['La calefacción no funciona.'] },
  { id: 't-serv-arreglar', type: 'translate', level: 1, theme: 'servicios',
    prompt: 'Translate: "Can you repair it today?"',
    hint: 'poder + infinitive, as a question.',
    constraints: [{ type: 'infinitiveUsed', inf: 'arreglar' }, { type: 'question' }],
    models: ['¿Puede arreglar la lavadora hoy?'] },
  { id: 'w-serv-nota', type: 'write', level: 1, theme: 'servicios',
    prompt: 'Write a short note for a repair service saying what is broken and when you are at home.',
    hint: 'Say what it is, what is wrong, and give a time.',
    constraints: [{ type: 'containsAny', words: ['no funciona', 'está roto', 'está rota'] },
                  { type: 'minWords', n: 15 }],
    models: ['Buenos días: la lavadora no funciona desde el viernes. Estoy en casa por la tarde, a partir de las cinco. Gracias.'] },
  { id: 't-serv-movil', type: 'translate', level: 1, theme: 'servicios',
    prompt: 'Translate: "I want to buy a SIM card for my phone."',
    hint: 'querer + infinitive; para + possessive.',
    constraints: [{ type: 'infinitiveUsed', inf: 'comprar' }, { type: 'containsWord', word: 'para' }],
    models: ['Quiero comprar una tarjeta SIM para mi móvil.'] },
  { id: 'b-serv-cuanto', type: 'build', level: 1, theme: 'servicios',
    en: 'How much does the repair cost?', answer: '¿Cuánto cuesta la reparación?' },
  { id: 't-serv-tarde', type: 'translate', level: 1, theme: 'servicios',
    prompt: 'Translate: "The post office closes at two."',
    hint: 'cerrar in the present, a las + time.',
    constraints: [{ type: 'containsWord', word: 'correos' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Correos cierra a las dos.'] },
  { id: 'w-serv-problema', type: 'write', level: 1, theme: 'servicios',
    prompt: 'Write two sentences explaining a problem with your internet and asking for help.',
    hint: 'Say what is wrong, then ask.',
    constraints: [{ type: 'containsWord', word: 'internet' }, { type: 'question' }, { type: 'minWords', n: 12 }],
    models: ['El internet no funciona bien desde ayer. ¿Pueden mandar a alguien esta semana?'] },

  { id: 't-serv-a2-esperar', type: 'translate', level: 2, theme: 'servicios',
    prompt: 'Translate: "I waited an hour and nobody helped me."',
    hint: 'Two completed events → preterite; nadie takes the verb after it.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'nadie' }],
    models: ['Esperé una hora y nadie me ayudó.'] },
  { id: 't-serv-a2-reclamar', type: 'translate', level: 2, theme: 'servicios',
    prompt: 'Translate: "I have to make a complaint because they charged me twice."',
    hint: 'tener que + infinitive, porque, preterite.',
    constraints: [{ type: 'containsWord', word: 'porque' }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['Tengo que reclamar porque me cobraron dos veces.'] },
  { id: 'p-serv-a2-gestion', type: 'paragraph', level: 2, theme: 'servicios',
    prompt: 'Write a short paragraph (3+ sentences) about a time you had to sort something out at an office or a shop.',
    hint: 'Set the scene in the imperfect, tell what happened in the preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'anyVerbInTense', tense: 'imperfecto' },
                  { type: 'minWords', n: 30 }],
    models: ['El mes pasado fui al banco porque tenía un problema con mi cuenta. Había mucha gente y esperé casi una hora. Al final me atendieron muy bien y lo solucionaron en diez minutos.'] },
  { id: 'w-serv-a2-correo', type: 'write', level: 2, theme: 'servicios',
    prompt: 'Write a short email to a company asking when your order will arrive.',
    hint: 'Open it properly, ask clearly, close it.',
    constraints: [{ type: 'containsAny', words: ['buenos días', 'estimados', 'buenas tardes'] },
                  { type: 'question' }, { type: 'minWords', n: 20 }],
    models: ['Buenos días: hice un pedido el día tres y todavía no ha llegado. ¿Pueden decirme cuándo lo voy a recibir? Muchas gracias.'] },
  { id: 't-serv-a2-devolver', type: 'translate', level: 2, theme: 'servicios',
    prompt: 'Translate: "They told me that they would return the money."',
    hint: 'decir in the preterite, que, and the conditional.',
    constraints: [{ type: 'containsWord', word: 'que' }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['Me dijeron que me devolvían el dinero.'] },
  { id: 'b-serv-a2-cambiar', type: 'build', level: 2, theme: 'servicios',
    en: 'Can I change the appointment to Thursday?', answer: '¿Puedo cambiar la cita para el jueves?' },

  { id: 't-serv-b1-tramite', type: 'translate', level: 3, theme: 'servicios',
    prompt: 'Translate: "You will have to fill in this form and bring your passport."',
    hint: 'tener que in the future, two infinitives.',
    constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'containsWord', word: 'pasaporte' }],
    models: ['Tendrá que rellenar este impreso y traer el pasaporte.'] },
  { id: 'w-serv-b1-queja', type: 'write', level: 3, theme: 'servicios',
    prompt: 'Write a complaint about a service that went wrong, saying what you expect them to do.',
    hint: 'Say what happened, then what you want.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 35 }],
    models: ['Contraté el servicio de internet hace tres semanas y todavía no funciona correctamente. He llamado cuatro veces y nadie me ha dado una solución. Espero que me devuelvan el importe de este mes o que envíen a un técnico esta semana.'] },
  { id: 'p-serv-b1-comparar', type: 'paragraph', level: 3, theme: 'servicios',
    prompt: 'Write a paragraph comparing two companies or services you have used.',
    hint: 'Use más/menos … que and say which you would choose.',
    constraints: [{ type: 'containsAny', words: ['más', 'menos'] }, { type: 'containsWord', word: 'que' },
                  { type: 'minWords', n: 35 }],
    models: ['La compañía que tenía antes era más barata, pero el servicio funcionaba peor y costaba mucho contactar con ellos. La de ahora cuesta unos euros más al mes y responde el mismo día. Yo elegiría siempre la segunda, porque el precio no lo es todo.'] },
  { id: 't-serv-b1-desde', type: 'translate', level: 3, theme: 'servicios',
    prompt: 'Translate: "I have been waiting for an answer since March."',
    hint: 'llevar + gerund, or desde + month.',
    constraints: [{ type: 'containsWord', word: 'desde' }, { type: 'containsWord', word: 'marzo' }],
    models: ['Espero una respuesta desde marzo.'] },
  { id: 'w-serv-b1-explicar', type: 'write', level: 3, theme: 'servicios',
    prompt: 'Explain to someone new in your city how to register with a doctor or open a bank account.',
    hint: 'Give the steps in order; hay que and tener que are both useful.',
    constraints: [{ type: 'containsAny', words: ['hay que', 'tienes que', 'tiene que'] }, { type: 'minWords', n: 35 }],
    models: ['Para abrir una cuenta hay que ir a una oficina con el pasaporte y un justificante de domicilio. Primero pides cita por internet, porque sin cita no te atienden. Luego firmas los papeles y en una semana te llega la tarjeta a casa.'] },

  { id: 'w-serv-b2-formal', type: 'write', level: 5, theme: 'servicios',
    prompt: 'Write a formal letter disputing a charge, keeping usted throughout.',
    hint: 'Formal register; state the facts, then the request.',
    constraints: [{ type: 'avoidsPerson', person: 'tú' }, { type: 'minWords', n: 40 }],
    models: ['Estimados señores: en la factura del mes de abril aparece un cargo de sesenta euros que no corresponde a ningún servicio contratado por mí. Les ruego que revisen el concepto y que procedan a su devolución. Quedo a la espera de su respuesta. Atentamente.'] },
  { id: 't-serv-b2-hubiera', type: 'translate', level: 5, theme: 'servicios',
    prompt: 'Translate: "If they had answered on time, I would not have cancelled the contract."',
    hint: 'Past unreal condition: si + pluperfect subjunctive, then the conditional perfect.',
    constraints: [{ type: 'containsWord', word: 'si' }, { type: 'anyVerbInTense', tense: 'condperf' }],
    models: ['Si hubieran contestado a tiempo, no habría cancelado el contrato.'] },
  { id: 'p-serv-b2-sistema', type: 'paragraph', level: 5, theme: 'servicios',
    prompt: 'Write about how easy or hard everyday bureaucracy is where you live.',
    hint: 'Give an opinion and back it with an example.',
    constraints: [{ type: 'containsAny', words: ['creo', 'me parece', 'en mi opinión'] }, { type: 'minWords', n: 45 }],
    models: ['Me parece que aquí todo se ha vuelto más rápido desde que los trámites se hacen por internet, aunque eso deja fuera a mucha gente mayor. El año pasado renové el pasaporte en veinte minutos, algo impensable hace una década. El problema aparece cuando algo se sale de lo previsto y ya no hay nadie a quien preguntar.'] }
,

  // ---- cuerpo: body, appearance, physical states --------------------------
  { id: 't-cuer-pelo', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: "My sister has long dark hair."',
    hint: 'tener for physical description; adjectives agree with pelo.',
    constraints: [{ type: 'containsWord', word: 'pelo' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Mi hermana tiene el pelo largo y oscuro.'] },
  { id: 't-cuer-ojos', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: "He has green eyes and he is quite tall."',
    hint: 'tener for the eyes, ser for the height.',
    constraints: [{ type: 'containsWord', word: 'ojos' }, { type: 'containsWord', word: 'alto' }],
    models: ['Tiene los ojos verdes y es bastante alto.'] },
  { id: 'b-cuer-manos', type: 'build', level: 1, theme: 'cuerpo',
    en: 'I wash my hands before eating.', answer: 'Me lavo las manos antes de comer.' },
  { id: 't-cuer-frio', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: "I am cold and my feet hurt."',
    hint: 'tener frío, and doler agreeing with los pies.',
    constraints: [{ type: 'containsWord', word: 'frío' }, { type: 'containsWord', word: 'duelen' }],
    models: ['Tengo frío y me duelen los pies.'] },
  { id: 'w-cuer-describir', type: 'write', level: 1, theme: 'cuerpo',
    prompt: 'Describe what a friend looks like, so somebody could pick them out.',
    hint: 'Height, hair, eyes — tener for features, ser for build.',
    constraints: [{ type: 'containsWord', word: 'pelo' }, { type: 'minWords', n: 15 }],
    models: ['Mi amiga Clara es baja y delgada. Tiene el pelo corto y rizado, y lleva gafas casi siempre.'] },
  { id: 'b-cuer-cabeza', type: 'build', level: 1, theme: 'cuerpo',
    en: 'My head hurts a lot today.', answer: 'Me duele mucho la cabeza hoy.' },
  { id: 't-cuer-llevar', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: "She wears glasses and has a beard."',
    hint: 'llevar for what somebody wears or sports.',
    constraints: [{ type: 'containsWord', word: 'gafas' }, { type: 'containsWord', word: 'lleva' }],
    models: ['Lleva gafas y tiene barba.'] },
  { id: 't-cuer-cansado', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: "I am very tired but I am not ill."',
    hint: 'estar for both states; pero to join them.',
    constraints: [{ type: 'containsWord', word: 'cansado' }, { type: 'negation' }],
    models: ['Estoy muy cansado, pero no estoy enfermo.'] },
  { id: 'w-cuer-rutina', type: 'write', level: 1, theme: 'cuerpo',
    prompt: 'Write about what you do to look after yourself in a normal week.',
    hint: 'Reflexive verbs and frequency words.',
    constraints: [{ type: 'containsAny', words: ['siempre', 'nunca', 'veces', 'todos los días'] },
                  { type: 'minWords', n: 15 }],
    models: ['Camino todos los días media hora y nado dos veces a la semana. Siempre me acuesto antes de las once, porque si duermo poco me duele la cabeza.'] },
  { id: 't-cuer-parecerse', type: 'translate', level: 2, theme: 'cuerpo',
    prompt: 'Translate: "She looks a lot like her mother."',
    hint: 'parecerse a — a reflexive verb with a.',
    constraints: [{ type: 'containsWord', word: 'parece' }, { type: 'containsWord', word: 'madre' }],
    models: ['Se parece mucho a su madre.'] },
  { id: 't-cuer-antes', type: 'translate', level: 2, theme: 'cuerpo',
    prompt: 'Translate: "When I was young I had longer hair."',
    hint: 'Two imperfects — a past state, not an event.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'containsWord', word: 'pelo' }],
    models: ['Cuando era joven tenía el pelo más largo.'] },
  { id: 'p-cuer-cambio', type: 'paragraph', level: 2, theme: 'cuerpo',
    prompt: 'Write a short paragraph about how somebody you know has changed in appearance.',
    hint: 'Imperfect for how they were, present for how they are now.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 30 }],
    models: ['Mi primo antes era muy delgado y llevaba el pelo muy largo. Ahora tiene barba y está bastante más fuerte, porque va al gimnasio cada día. La verdad es que al principio no lo reconocí.'] },
  { id: 'b-cuer-espalda', type: 'build', level: 2, theme: 'cuerpo',
    en: 'My back has been hurting since Monday.', answer: 'Me duele la espalda desde el lunes.' },
  { id: 't-cuer-b1-mantener', type: 'translate', level: 3, theme: 'cuerpo',
    prompt: 'Translate: "You should sleep more and sit down less."',
    hint: 'deber in the conditional, then two infinitives.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'infinitiveUsed', inf: 'dormir' }],
    models: ['Deberías dormir más y sentarte menos.'] },
  { id: 'w-cuer-b1-consejo', type: 'write', level: 3, theme: 'cuerpo',
    prompt: 'Give a friend advice about a sore back from sitting at a desk all day.',
    hint: 'Advice: deberías, te recomiendo, lo mejor es.',
    constraints: [{ type: 'containsAny', words: ['deberías', 'te recomiendo', 'lo mejor'] },
                  { type: 'minWords', n: 30 }],
    models: ['Lo mejor es levantarte cada media hora, aunque sea un minuto. Deberías cambiar la altura de la pantalla, porque si miras hacia abajo todo el día el cuello lo paga. A mí me ayudó mucho caminar media hora al salir del trabajo.'] },
  { id: 'p-cuer-b2-imagen', type: 'paragraph', level: 5, theme: 'cuerpo',
    prompt: 'Write about the pressure people feel over how they look.',
    hint: 'State a position and support it.',
    constraints: [{ type: 'containsAny', words: ['creo', 'me parece', 'pienso'] }, { type: 'minWords', n: 40 }],
    models: ['Me parece que la presión por el aspecto físico ha crecido justo cuando decíamos estar superándola. Las redes muestran cuerpos editados como si fueran cotidianos, y el que compara el suyo siempre pierde. Lo preocupante no es la vanidad, sino la edad a la que empieza.'] },

  // ---- salud: illness, the doctor, the pharmacy ---------------------------
  { id: 't-salud-cita', type: 'translate', level: 1, theme: 'salud',
    prompt: 'Translate: "I need to see a doctor today."',
    hint: 'necesitar + infinitive.',
    constraints: [{ type: 'infinitiveUsed', inf: 'ver' }, { type: 'containsWord', word: 'médico' }],
    models: ['Necesito ver a un médico hoy.'] },
  { id: 't-salud-garganta', type: 'translate', level: 1, theme: 'salud',
    prompt: 'Translate: "My throat hurts and I have a temperature."',
    hint: 'doler for the throat, tener for the fever.',
    constraints: [{ type: 'containsWord', word: 'garganta' }, { type: 'containsWord', word: 'fiebre' }],
    models: ['Me duele la garganta y tengo fiebre.'] },
  { id: 'b-salud-farmacia', type: 'build', level: 1, theme: 'salud',
    en: 'Is there a pharmacy near here?', answer: '¿Hay una farmacia por aquí cerca?' },
  { id: 't-salud-alergia', type: 'translate', level: 1, theme: 'salud',
    prompt: 'Translate: "I am allergic to nuts."',
    hint: 'ser + alérgico + a.',
    constraints: [{ type: 'containsWord', word: 'alérgico' }, { type: 'containsWord', word: 'a' }],
    models: ['Soy alérgico a los frutos secos.'] },
  { id: 'w-salud-sintomas', type: 'write', level: 1, theme: 'salud',
    prompt: 'Tell a pharmacist what is wrong with you and since when.',
    hint: 'Say the symptom, then how long.',
    constraints: [{ type: 'containsAny', words: ['desde', 'hace'] }, { type: 'minWords', n: 12 }],
    models: ['Me duele mucho el estómago desde ayer por la noche y no puedo comer nada.'] },
  { id: 'b-salud-receta', type: 'build', level: 1, theme: 'salud',
    en: 'Do I need a prescription for this?', answer: '¿Necesito receta para esto?' },
  { id: 't-salud-descansar', type: 'translate', level: 1, theme: 'salud',
    prompt: 'Translate: "I cannot work today because I am ill."',
    hint: 'poder + infinitive, porque, estar enfermo.',
    constraints: [{ type: 'containsWord', word: 'porque' }, { type: 'negation' }],
    models: ['Hoy no puedo trabajar porque estoy enfermo.'] },
  { id: 't-salud-a2-ayer', type: 'translate', level: 2, theme: 'salud',
    prompt: 'Translate: "I went to the doctor yesterday and she gave me some pills."',
    hint: 'Two completed events → preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer fui al médico y me dio unas pastillas.'] },
  { id: 't-salud-a2-antes', type: 'translate', level: 2, theme: 'salud',
    prompt: 'Translate: "I used to get ill a lot when I was a child."',
    hint: 'A repeated past habit → imperfect.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'containsWord', word: 'cuando' }],
    models: ['Cuando era niño me ponía enfermo muy a menudo.'] },
  { id: 'p-salud-a2-relato', type: 'paragraph', level: 2, theme: 'salud',
    prompt: 'Write a short paragraph about a time you were ill or hurt yourself.',
    hint: 'Background in the imperfect, events in the preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'anyVerbInTense', tense: 'imperfecto' },
                  { type: 'minWords', n: 30 }],
    models: ['El invierno pasado estaba de viaje y me puse malo en el hotel. Tenía mucha fiebre y no conocía a nadie en la ciudad. Al final bajé a la recepción, me ayudaron a encontrar un médico y en dos días estaba bien.'] },
  { id: 'w-salud-a2-email', type: 'write', level: 2, theme: 'salud',
    prompt: 'Write a message to work saying you are ill and will not come in.',
    hint: 'Say what is wrong and when you expect to be back.',
    constraints: [{ type: 'containsAny', words: ['no puedo', 'no voy a'] }, { type: 'minWords', n: 20 }],
    models: ['Buenos días: hoy no puedo ir a la oficina porque tengo gripe y bastante fiebre. Voy al médico esta mañana y os digo algo esta tarde. Un saludo.'] },
  { id: 'b-salud-a2-mejor', type: 'build', level: 2, theme: 'salud',
    en: 'I am feeling better than yesterday.', answer: 'Me encuentro mejor que ayer.' },
  { id: 't-salud-b1-recomendar', type: 'translate', level: 3, theme: 'salud',
    prompt: 'Translate: "The doctor told me I had to rest for a week."',
    hint: 'decir in the preterite, que, tener que.',
    constraints: [{ type: 'containsWord', word: 'que' }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['El médico me dijo que tenía que descansar una semana.'] },
  { id: 'w-salud-b1-sistema', type: 'write', level: 3, theme: 'salud',
    prompt: 'Explain to a visitor how to get seen by a doctor where you live.',
    hint: 'Steps in order; hay que and primero/luego help.',
    constraints: [{ type: 'containsAny', words: ['hay que', 'tienes que', 'primero'] }, { type: 'minWords', n: 35 }],
    models: ['Primero tienes que llamar al centro de salud o pedir cita por la aplicación. Si es urgente, hay que ir directamente a urgencias, aunque a veces esperas varias horas. Lleva siempre la tarjeta sanitaria y el pasaporte, porque sin eso no te atienden.'] },
  { id: 'p-salud-b1-habitos', type: 'paragraph', level: 3, theme: 'salud',
    prompt: 'Write about a habit you would like to change and what you would do differently.',
    hint: 'me gustaría / debería, and the conditional.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'minWords', n: 35 }],
    models: ['Me gustaría dejar de mirar el móvil por la noche, porque luego duermo fatal y al día siguiente no rindo. Lo dejaría cargando en otra habitación y leería un rato antes de dormir. Sé que suena fácil, pero llevo meses diciéndolo.'] },
  { id: 'w-salud-b2-debate', type: 'write', level: 5, theme: 'salud',
    prompt: 'Argue for or against making healthcare entirely free at the point of use.',
    hint: 'Concede something, then make your case.',
    constraints: [{ type: 'containsAny', words: ['aunque', 'sin embargo', 'ahora bien'] }, { type: 'minWords', n: 45 }],
    models: ['Aunque un sistema gratuito siempre genera un coste que alguien acaba pagando, me parece el único modelo que evita que enfermar sea una cuestión económica. Sin embargo, gratuito no puede significar ilimitado: sin criterios de prioridad, el que más insiste se atiende antes que el que más lo necesita.'] },
  { id: 't-salud-b2-ojala', type: 'translate', level: 4, theme: 'salud',
    prompt: 'Translate: "I hope the results come back soon."',
    hint: 'ojalá takes the subjunctive.',
    constraints: [{ type: 'anyVerbInTense', tense: 'presubj' }, { type: 'containsWord', word: 'ojalá' }],
    models: ['Ojalá lleguen pronto los resultados.'] }
,

  // ---- identidad: who you are, where you are from, documents --------------
  { id: 't-iden-soy', type: 'translate', level: 1, theme: 'identidad',
    prompt: 'Translate: "I am Scottish but I live in Valencia."',
    hint: 'ser for nationality, vivir for where you live.',
    constraints: [{ type: 'containsWord', word: 'pero' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Soy escocés, pero vivo en Valencia.'] },
  { id: 't-iden-apellido', type: 'translate', level: 1, theme: 'identidad',
    prompt: 'Translate: "How do you spell your surname?"',
    hint: 'cómo se escribe.',
    constraints: [{ type: 'containsWord', word: 'apellido' }, { type: 'question' }],
    models: ['¿Cómo se escribe su apellido?'] },
  { id: 'b-iden-nacido', type: 'build', level: 1, theme: 'identidad',
    en: 'I was born in Manchester in 1990.', answer: 'Nací en Manchester en 1990.' },
  { id: 't-iden-idiomas', type: 'translate', level: 1, theme: 'identidad',
    prompt: 'Translate: "I speak English and a little Spanish."',
    hint: 'un poco de before a language.',
    constraints: [{ type: 'containsWord', word: 'español' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Hablo inglés y un poco de español.'] },
  { id: 'w-iden-presentarse', type: 'write', level: 1, theme: 'identidad',
    prompt: 'Introduce yourself: name, where you are from, what you do, and one thing you like.',
    hint: 'Four short sentences is plenty.',
    constraints: [{ type: 'containsAny', words: ['me llamo', 'soy'] }, { type: 'minWords', n: 18 }],
    models: ['Me llamo Tom y soy irlandés, de Cork. Vivo en Madrid desde hace dos años y trabajo en una escuela. Me encanta el cine español.'] },
  { id: 'b-iden-dni', type: 'build', level: 1, theme: 'identidad',
    en: 'Can I see your passport, please?', answer: '¿Puedo ver su pasaporte, por favor?' },
  { id: 't-iden-edad', type: 'translate', level: 1, theme: 'identidad',
    prompt: 'Translate: "She is thirty-two and she is single."',
    hint: 'tener for age, estar for marital status.',
    constraints: [{ type: 'containsWord', word: 'años' }, { type: 'containsAny', words: ['soltera', 'soltero'] }],
    models: ['Tiene treinta y dos años y está soltera.'] },
  { id: 't-iden-direccion', type: 'translate', level: 1, theme: 'identidad',
    prompt: 'Translate: "What is your address and your telephone number?"',
    hint: 'cuál for picking one out of many.',
    constraints: [{ type: 'question' }, { type: 'containsWord', word: 'teléfono' }],
    models: ['¿Cuál es su dirección y su número de teléfono?'] },
  { id: 'w-iden-formulario', type: 'write', level: 1, theme: 'identidad',
    prompt: 'Write the lines you would say while filling in a form at a hotel desk.',
    hint: 'Name, nationality, how long you are staying.',
    constraints: [{ type: 'containsAny', words: ['me llamo', 'soy'] }, { type: 'minWords', n: 15 }],
    models: ['Me llamo Ana Ruiz, soy mexicana y me quedo tres noches. Aquí tiene el pasaporte.'] },
  { id: 't-iden-a2-llevo', type: 'translate', level: 2, theme: 'identidad',
    prompt: 'Translate: "I have been living here for three years."',
    hint: 'desde hace + a length of time, with the present.',
    constraints: [{ type: 'containsAny', words: ['desde hace', 'llevo'] }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Vivo aquí desde hace tres años.'] },
  { id: 't-iden-a2-mude', type: 'translate', level: 2, theme: 'identidad',
    prompt: 'Translate: "I moved to Spain because my wife got a job here."',
    hint: 'Two completed events → preterite; porque joins them.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'porque' }],
    models: ['Me mudé a España porque mi mujer encontró trabajo aquí.'] },
  { id: 'p-iden-a2-vida', type: 'paragraph', level: 2, theme: 'identidad',
    prompt: 'Write a short paragraph about where you grew up and how it was different from now.',
    hint: 'Imperfect for how things were, present for now.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 30 }],
    models: ['Crecí en un pueblo pequeño donde todo el mundo se conocía. No había cine ni casi tiendas, y los sábados íbamos a la ciudad en autobús. Ahora vivo en Barcelona y a veces echo de menos aquel silencio.'] },
  { id: 'b-iden-a2-doble', type: 'build', level: 2, theme: 'identidad',
    en: 'My father is Italian and my mother is Spanish.', answer: 'Mi padre es italiano y mi madre es española.' },
  { id: 'w-iden-a2-perfil', type: 'write', level: 2, theme: 'identidad',
    prompt: 'Write a short profile of yourself for a language exchange website.',
    hint: 'Who you are, what you do, what you want to practise.',
    constraints: [{ type: 'containsAny', words: ['me gustaría', 'quiero', 'busco'] }, { type: 'minWords', n: 25 }],
    models: ['Soy profesor de música y vivo en Sevilla desde el año pasado. Hablo inglés y alemán, y quiero practicar español para poder hablar con mis vecinos sin cambiar de idioma cada dos frases.'] },
  { id: 't-iden-b1-aunque', type: 'translate', level: 3, theme: 'identidad',
    prompt: 'Translate: "Although I was born in France, I feel Spanish."',
    hint: 'aunque + indicative for a fact.',
    constraints: [{ type: 'containsWord', word: 'aunque' }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['Aunque nací en Francia, me siento español.'] },
  { id: 'w-iden-b1-pertenencia', type: 'write', level: 3, theme: 'identidad',
    prompt: 'Write about what makes somebody "from" a place — where you were born, or where you live?',
    hint: 'Take a position and give a reason.',
    constraints: [{ type: 'containsAny', words: ['creo', 'me parece', 'para mí'] }, { type: 'minWords', n: 35 }],
    models: ['Para mí uno es de donde tiene la vida, no de donde tiene los papeles. Conozco a gente que nació aquí y no sabe el nombre de su calle, y a otros que llegaron hace cinco años y conocen el barrio mejor que yo. El nacimiento es un accidente; el arraigo se construye.'] },
  { id: 'p-iden-b2-nombres', type: 'paragraph', level: 5, theme: 'identidad',
    prompt: 'Write about what a name says, or fails to say, about a person.',
    hint: 'A reflective register; concede and qualify.',
    constraints: [{ type: 'containsAny', words: ['sin embargo', 'ahora bien', 'aunque'] }, { type: 'minWords', n: 45 }],
    models: ['Un apellido cuenta una historia que su dueño no eligió: un pueblo, una lengua, a veces una frontera cruzada por alguien a quien no llegó a conocer. Sin embargo, lo que hace a una persona reconocible no es eso, sino cómo trata a quien no puede devolverle el favor. El nombre abre la puerta; lo que uno hace con ella ya es cosa suya.'] },

  // ---- caracter: personality, moods, how people are -----------------------
  { id: 't-car-simpatico', type: 'translate', level: 1, theme: 'caracter',
    prompt: 'Translate: "My neighbour is very friendly but quite shy."',
    hint: 'ser for personality; adjectives agree.',
    constraints: [{ type: 'containsWord', word: 'pero' }, { type: 'containsAny', words: ['tímido', 'tímida'] }],
    models: ['Mi vecino es muy simpático, pero bastante tímido.'] },
  { id: 'b-car-paciente', type: 'build', level: 1, theme: 'caracter',
    en: 'My brother is very patient with children.', answer: 'Mi hermano es muy paciente con los niños.' },
  { id: 't-car-humor', type: 'translate', level: 1, theme: 'caracter',
    prompt: 'Translate: "She is in a bad mood today."',
    hint: 'estar de mal humor — a state, not a trait.',
    constraints: [{ type: 'containsWord', word: 'humor' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Hoy está de mal humor.'] },
  { id: 'w-car-amigo', type: 'write', level: 1, theme: 'caracter',
    prompt: 'Describe the personality of somebody you like spending time with.',
    hint: 'Three adjectives and one reason.',
    constraints: [{ type: 'containsWord', word: 'es' }, { type: 'minWords', n: 15 }],
    models: ['Mi amiga Rosa es muy tranquila y siempre escucha antes de hablar. Es generosa con su tiempo, y por eso todo el mundo la quiere.'] },
  { id: 't-car-nunca', type: 'translate', level: 1, theme: 'caracter',
    prompt: 'Translate: "He never gets angry."',
    hint: 'nunca before the verb takes no second no.',
    constraints: [{ type: 'containsWord', word: 'nunca' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Nunca se enfada.'] },
  { id: 'b-car-parecido', type: 'build', level: 1, theme: 'caracter',
    en: 'We are very different but we get on well.', answer: 'Somos muy diferentes, pero nos llevamos bien.' },
  { id: 't-car-a2-antes', type: 'translate', level: 2, theme: 'caracter',
    prompt: 'Translate: "When I was younger I was much more impatient."',
    hint: 'Past states → imperfect, twice.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'containsWord', word: 'más' }],
    models: ['Cuando era más joven era mucho más impaciente.'] },
  { id: 't-car-a2-cambiar', type: 'translate', level: 2, theme: 'caracter',
    prompt: 'Translate: "He has changed a lot since he became a father."',
    hint: 'Present perfect for a change that still holds.',
    constraints: [{ type: 'anyVerbInTense', tense: 'perfecto' }, { type: 'containsWord', word: 'desde' }],
    models: ['Ha cambiado mucho desde que es padre.'] },
  { id: 'p-car-a2-alguien', type: 'paragraph', level: 2, theme: 'caracter',
    prompt: 'Write a short paragraph about somebody whose character you admire.',
    hint: 'Say what they are like, then give an example of something they did.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 30 }],
    models: ['Mi abuela era la persona más tranquila que he conocido. Nunca levantaba la voz, ni siquiera cuando tenía razón. Una vez un vecino le rompió la valla del jardín y ella solo le preguntó si se había hecho daño.'] },
  { id: 'w-car-a2-companero', type: 'write', level: 2, theme: 'caracter',
    prompt: 'Describe a difficult colleague or flatmate without being unkind about them.',
    hint: 'es que… and a bit of hedging help here.',
    constraints: [{ type: 'containsAny', words: ['es que', 'a veces', 'un poco'] }, { type: 'minWords', n: 25 }],
    models: ['Mi compañero de piso es buena persona, pero es que no ve el desorden. A veces deja los platos tres días y no lo hace por molestar, simplemente no se da cuenta.'] },
  { id: 'b-car-a2-confiar', type: 'build', level: 2, theme: 'caracter',
    en: 'You can trust her completely.', answer: 'Puedes confiar en ella completamente.' },
  { id: 't-car-b1-ojala', type: 'translate', level: 4, theme: 'caracter',
    prompt: 'Translate: "I wish he were a bit more patient."',
    hint: 'ojalá about something unreal now → imperfect subjunctive.',
    constraints: [{ type: 'anyVerbInTense', tense: 'impsubj' }, { type: 'containsWord', word: 'ojalá' }],
    models: ['Ojalá fuera un poco más paciente.'] },
  { id: 'w-car-b1-defecto', type: 'write', level: 3, theme: 'caracter',
    prompt: 'Write about a fault of your own and how it affects the people around you.',
    hint: 'Be honest and specific; give one example.',
    constraints: [{ type: 'containsAny', words: ['a veces', 'suelo', 'tiendo'] }, { type: 'minWords', n: 35 }],
    models: ['Tiendo a decir que sí a todo y luego me arrepiento cuando no llego. La gente cuenta conmigo y yo acabo cancelando a última hora, que es justo lo que no quería hacer. Estoy aprendiendo a decir que lo miro y contesto mañana.'] },
  { id: 'p-car-b1-test', type: 'paragraph', level: 3, theme: 'caracter',
    prompt: 'Do personality tests tell you anything useful? Give your view.',
    hint: 'Opinion plus a reason plus a concession.',
    constraints: [{ type: 'containsAny', words: ['aunque', 'sin embargo', 'por otro lado'] }, { type: 'minWords', n: 35 }],
    models: ['Creo que sirven sobre todo para empezar una conversación sobre uno mismo, que ya es algo. Aunque los resultados son bastante vagos, a veces ponen nombre a algo que llevabas años notando. Otra cosa es usarlos para decidir a quién se contrata.'] },
  { id: 'w-car-b2-madurar', type: 'write', level: 5, theme: 'caracter',
    prompt: 'Does character change with age, or only show itself more clearly?',
    hint: 'Argue one side while acknowledging the other.',
    constraints: [{ type: 'containsAny', words: ['más bien', 'sin embargo', 'ahora bien'] }, { type: 'minWords', n: 45 }],
    models: ['Sospecho que con los años no cambiamos tanto como aprendemos a administrarnos. El impaciente de veinte años sigue ahí a los cincuenta, solo que ha averiguado que impacientarse no acelera nada. Ahora bien, quien diga que nadie cambia nunca probablemente no ha visto a alguien pasar por algo serio.'] }
,

  // ---- medios: news, TV, phones, social media -----------------------------
  { id: 't-med-noticias', type: 'translate', level: 1, theme: 'medios',
    prompt: 'Translate: "I watch the news every evening."',
    hint: 'ver + las noticias, with a frequency phrase.',
    constraints: [{ type: 'containsWord', word: 'noticias' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Veo las noticias todas las tardes.'] },
  { id: 'b-med-periodico', type: 'build', level: 1, theme: 'medios',
    en: 'I read the newspaper on my phone.', answer: 'Leo el periódico en el móvil.' },
  { id: 't-med-serie', type: 'translate', level: 1, theme: 'medios',
    prompt: 'Translate: "This series is very good but very long."',
    hint: 'ser for a quality; pero to join.',
    constraints: [{ type: 'containsWord', word: 'serie' }, { type: 'containsWord', word: 'pero' }],
    models: ['Esta serie es muy buena, pero muy larga.'] },
  { id: 'w-med-habitos', type: 'write', level: 1, theme: 'medios',
    prompt: 'Write about how you find out what is happening in the world.',
    hint: 'Say what you use and how often.',
    constraints: [{ type: 'containsAny', words: ['siempre', 'nunca', 'veces', 'todos los días'] },
                  { type: 'minWords', n: 15 }],
    models: ['Casi siempre leo las noticias en el móvil por la mañana. Nunca veo la televisión, pero a veces escucho la radio en el coche.'] },
  { id: 't-med-apagar', type: 'translate', level: 1, theme: 'medios',
    prompt: 'Translate: "Can you turn off the television, please?"',
    hint: 'poder + infinitive, as a request.',
    constraints: [{ type: 'infinitiveUsed', inf: 'apagar' }, { type: 'question' }],
    models: ['¿Puedes apagar la televisión, por favor?'] },
  { id: 'b-med-movil', type: 'build', level: 1, theme: 'medios',
    en: 'I spend too much time on my phone.', answer: 'Paso demasiado tiempo con el móvil.' },
  { id: 't-med-a2-enterarse', type: 'translate', level: 2, theme: 'medios',
    prompt: 'Translate: "I found out yesterday because a friend sent it to me."',
    hint: 'Two completed events → preterite; me lo mandó.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'porque' }],
    models: ['Me enteré ayer porque un amigo me lo mandó.'] },
  { id: 't-med-a2-antes', type: 'translate', level: 2, theme: 'medios',
    prompt: 'Translate: "We used to watch television together every Sunday."',
    hint: 'A repeated habit → imperfect.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'containsWord', word: 'domingos' }],
    models: ['Veíamos la televisión juntos todos los domingos.'] },
  { id: 'p-med-a2-red', type: 'paragraph', level: 2, theme: 'medios',
    prompt: 'Write a short paragraph about a social network you use or have stopped using.',
    hint: 'Say what you used it for and what changed.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 30 }],
    models: ['Usé Twitter durante casi diez años, sobre todo para seguir noticias. Al principio encontraba cosas buenas y gente interesante, pero al final solo había discusiones. Lo dejé el verano pasado y no lo echo de menos.'] },
  { id: 'w-med-a2-recomendar', type: 'write', level: 2, theme: 'medios',
    prompt: 'Recommend a film or series to a friend, saying why.',
    hint: 'te recomiendo / tienes que ver, plus a reason.',
    constraints: [{ type: 'containsAny', words: ['te recomiendo', 'tienes que'] }, { type: 'minWords', n: 25 }],
    models: ['Tienes que ver esta serie española: son solo seis capítulos y no sobra ni uno. Está muy bien escrita y los actores son buenísimos. Te la recomiendo de verdad.'] },
  { id: 'b-med-a2-suscripcion', type: 'build', level: 2, theme: 'medios',
    en: 'I cancelled the subscription last month.', answer: 'Cancelé la suscripción el mes pasado.' },
  { id: 't-med-b1-fuente', type: 'translate', level: 3, theme: 'medios',
    prompt: 'Translate: "You should check where the information comes from."',
    hint: 'deber in the conditional + infinitive.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'containsWord', word: 'información' }],
    models: ['Deberías comprobar de dónde viene la información.'] },
  { id: 'w-med-b1-bulos', type: 'write', level: 3, theme: 'medios',
    prompt: 'Write about how you decide whether something you read online is true.',
    hint: 'Give two or three concrete habits.',
    constraints: [{ type: 'containsAny', words: ['primero', 'suelo', 'normalmente'] }, { type: 'minWords', n: 35 }],
    models: ['Normalmente miro quién lo publica antes que lo que dice, porque el titular siempre suena convincente. Si no aparece en ningún otro sitio, desconfío. Y si me da mucha rabia al leerlo, espero un día antes de compartirlo.'] },
  { id: 'p-med-b1-television', type: 'paragraph', level: 3, theme: 'medios',
    prompt: 'Has the way people watch television changed for the better?',
    hint: 'Compare then and now, and land on a view.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 35 }],
    models: ['Antes toda la familia veía lo mismo a la misma hora, aunque no le gustara a nadie del todo. Ahora cada uno ve lo suyo en su pantalla y se elige mejor, pero se comparte menos. Yo creo que hemos ganado en variedad y perdido en conversación.'] },
  { id: 't-med-b2-duda', type: 'translate', level: 4, theme: 'medios',
    prompt: 'Translate: "I do not think that story is true."',
    hint: 'no creer que takes the subjunctive.',
    constraints: [{ type: 'anyVerbInTense', tense: 'presubj' }, { type: 'negation' }],
    models: ['No creo que esa noticia sea verdad.'] },
  { id: 'w-med-b2-algoritmo', type: 'write', level: 5, theme: 'medios',
    prompt: 'Write about what it means that a machine chooses what you read.',
    hint: 'Make an argument, with a concession.',
    constraints: [{ type: 'containsAny', words: ['sin embargo', 'ahora bien', 'aunque'] }, { type: 'minWords', n: 45 }],
    models: ['Lo inquietante de un algoritmo no es que se equivoque, sino que acierte: te da exactamente lo que ya pensabas y llamas a eso estar informado. Sin embargo, sería ingenuo añorar una época en la que la selección la hacían cuatro periódicos con dueño conocido. El filtro siempre existió; lo que ha cambiado es que ahora no se ve.'] },
  { id: 'p-med-c1-prensa', type: 'paragraph', level: 8, theme: 'medios',
    prompt: 'Write about whether journalism can survive without somebody paying for it.',
    hint: 'A sustained argument; hypothetical constructions welcome.',
    constraints: [{ type: 'minWords', n: 55 }],
    models: ['Si el lector no paga, paga el anunciante, y entonces el producto deja de ser la noticia para pasar a ser el lector. Eso no es una conspiración: es aritmética. Lo que no termino de ver es por qué damos por hecho que informarse debería ser gratis cuando aceptamos pagar por casi todo lo demás. Quizá el problema no sea el modelo de negocio sino que hemos dejado de considerar la información un bien que cuesta producir.'] },

  // ---- politica: civic life, rules, public decisions ----------------------
  { id: 't-pol-votar', type: 'translate', level: 1, theme: 'politica',
    prompt: 'Translate: "I am going to vote on Sunday."',
    hint: 'ir a + infinitive for a plan.',
    constraints: [{ type: 'infinitiveUsed', inf: 'votar' }, { type: 'containsWord', word: 'domingo' }],
    models: ['Voy a votar el domingo.'] },
  { id: 'b-pol-alcalde', type: 'build', level: 1, theme: 'politica',
    en: 'The new mayor is very young.', answer: 'El nuevo alcalde es muy joven.' },
  { id: 't-pol-prohibido', type: 'translate', level: 1, theme: 'politica',
    prompt: 'Translate: "It is forbidden to park here."',
    hint: 'está prohibido + infinitive.',
    constraints: [{ type: 'containsWord', word: 'prohibido' }, { type: 'infinitiveUsed', inf: 'aparcar' }],
    models: ['Está prohibido aparcar aquí.'] },
  { id: 'w-pol-barrio', type: 'write', level: 1, theme: 'politica',
    prompt: 'Write about one thing you would change in your neighbourhood.',
    hint: 'Say the problem, then what is needed.',
    constraints: [{ type: 'containsAny', words: ['hay que', 'necesitamos', 'falta'] }, { type: 'minWords', n: 15 }],
    models: ['En mi barrio hay muy pocos árboles y en verano hace un calor horrible. Hay que plantar más y poner bancos a la sombra.'] },
  { id: 'b-pol-ley', type: 'build', level: 1, theme: 'politica',
    en: 'The new law starts in January.', answer: 'La nueva ley empieza en enero.' },
  { id: 't-pol-a2-manifestacion', type: 'translate', level: 2, theme: 'politica',
    prompt: 'Translate: "Thousands of people came out onto the street yesterday."',
    hint: 'salir in the preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'calle' }],
    models: ['Ayer miles de personas salieron a la calle.'] },
  { id: 't-pol-a2-si', type: 'translate', level: 2, theme: 'politica',
    prompt: 'Translate: "If they raise taxes, many people will complain."',
    hint: 'si + present, then the present or future.',
    constraints: [{ type: 'containsWord', word: 'si' }, { type: 'containsWord', word: 'impuestos' }],
    models: ['Si suben los impuestos, mucha gente se va a quejar.'] },
  { id: 'p-pol-a2-cambio', type: 'paragraph', level: 2, theme: 'politica',
    prompt: 'Write a short paragraph about something that has changed in your town in recent years.',
    hint: 'Imperfect for how it was, present or perfect for now.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 30 }],
    models: ['Antes el centro estaba lleno de coches y casi no se podía caminar. Hace tres años lo cerraron al tráfico y ahora hay terrazas y bicicletas por todas partes. A los comerciantes no les gustó al principio, pero ahora viene más gente.'] },
  { id: 'w-pol-a2-carta', type: 'write', level: 2, theme: 'politica',
    prompt: 'Write a short message to your local council about a problem in your street.',
    hint: 'State the problem, say what you are asking for.',
    constraints: [{ type: 'question' }, { type: 'minWords', n: 25 }],
    models: ['Buenos días: las farolas de la calle Mayor llevan tres semanas apagadas y por la noche no se ve nada. ¿Pueden decirme cuándo van a arreglarlas? Muchas gracias.'] },
  { id: 'b-pol-a2-acuerdo', type: 'build', level: 2, theme: 'politica',
    en: 'I do not agree with that decision.', answer: 'No estoy de acuerdo con esa decisión.' },
  { id: 't-pol-b1-deberia', type: 'translate', level: 3, theme: 'politica',
    prompt: 'Translate: "The government should explain it better."',
    hint: 'deber in the conditional + infinitive.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'containsWord', word: 'gobierno' }],
    models: ['El gobierno debería explicarlo mejor.'] },
  { id: 'w-pol-b1-opinion', type: 'write', level: 3, theme: 'politica',
    prompt: 'Should voting be compulsory? Give your view with a reason.',
    hint: 'State the position, give one argument, acknowledge the other side.',
    constraints: [{ type: 'containsAny', words: ['aunque', 'por otro lado', 'sin embargo'] }, { type: 'minWords', n: 35 }],
    models: ['Creo que no debería ser obligatorio, aunque entiendo el argumento. Obligar a votar sube la participación, pero llena las urnas de votos sin convicción. Por otro lado, si vota poca gente, deciden siempre los mismos.'] },
  { id: 't-pol-b1-subj', type: 'translate', level: 4, theme: 'politica',
    prompt: 'Translate: "I hope they approve it before the summer."',
    hint: 'esperar que takes the subjunctive.',
    constraints: [{ type: 'anyVerbInTense', tense: 'presubj' }, { type: 'containsWord', word: 'verano' }],
    models: ['Espero que lo aprueben antes del verano.'] },
  { id: 'p-pol-b2-local', type: 'paragraph', level: 5, theme: 'politica',
    prompt: 'Write about whether decisions are better made locally or centrally.',
    hint: 'Argue a case and concede something real.',
    constraints: [{ type: 'containsAny', words: ['ahora bien', 'sin embargo', 'no obstante'] }, { type: 'minWords', n: 45 }],
    models: ['Quien decide de cerca conoce el problema y paga el coste político de equivocarse, que son las dos condiciones para decidir bien. Ahora bien, lo local también protege privilegios locales, y hay cosas que ningún ayuntamiento resolverá solo. La pregunta útil no es dónde se decide, sino quién responde después.'] },
  { id: 'w-pol-c1-confianza', type: 'write', level: 8, theme: 'politica',
    prompt: 'Write about why trust in institutions falls, and whether it can be rebuilt.',
    hint: 'Sustained argument; qualify rather than assert.',
    constraints: [{ type: 'minWords', n: 55 }],
    models: ['La desconfianza rara vez nace de un escándalo concreto: nace de la sospecha, acumulada durante años, de que las reglas se aplican de manera distinta según a quién. Reconstruirla exige algo más aburrido que un discurso, que es cumplir promesas pequeñas de forma visible y repetida. Nadie recupera la confianza anunciando que la va a recuperar; se recupera cuando deja de hacer falta anunciarlo.'] },

  // ---- economia: money, prices, work and cost -----------------------------
  { id: 't-eco-cuesta', type: 'translate', level: 1, theme: 'economia',
    prompt: 'Translate: "Everything is more expensive this year."',
    hint: 'estar for a current state; más caro.',
    constraints: [{ type: 'containsWord', word: 'caro' }, { type: 'containsWord', word: 'año' }],
    models: ['Este año todo está más caro.'] },
  { id: 'b-eco-ahorrar', type: 'build', level: 1, theme: 'economia',
    en: 'I am saving money for a trip.', answer: 'Estoy ahorrando dinero para un viaje.' },
  { id: 't-eco-pagar', type: 'translate', level: 1, theme: 'economia',
    prompt: 'Translate: "Can I pay by card?"',
    hint: 'poder + infinitive; con tarjeta.',
    constraints: [{ type: 'infinitiveUsed', inf: 'pagar' }, { type: 'question' }],
    models: ['¿Puedo pagar con tarjeta?'] },
  { id: 'w-eco-gastos', type: 'write', level: 1, theme: 'economia',
    prompt: 'Write about what you spend most of your money on.',
    hint: 'Say the biggest thing, then a smaller one.',
    constraints: [{ type: 'containsAny', words: ['gasto', 'pago'] }, { type: 'minWords', n: 15 }],
    models: ['Gasto casi todo en el alquiler, que es carísimo en esta ciudad. Después pago el transporte y la comida, y no me queda mucho más.'] },
  { id: 'b-eco-barato', type: 'build', level: 1, theme: 'economia',
    en: 'This shop is cheaper than the other one.', answer: 'Esta tienda es más barata que la otra.' },
  { id: 't-eco-a2-subio', type: 'translate', level: 2, theme: 'economia',
    prompt: 'Translate: "The rent went up twice last year."',
    hint: 'subir in the preterite; dos veces.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'alquiler' }],
    models: ['El alquiler subió dos veces el año pasado.'] },
  { id: 'p-eco-a2-antes', type: 'paragraph', level: 2, theme: 'economia',
    prompt: 'Write a short paragraph comparing prices now with when you were younger.',
    hint: 'Imperfect for then, present for now.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 30 }],
    models: ['Cuando estudiaba, un café costaba menos de un euro y comer fuera era algo normal entre semana. Ahora pago casi el triple y lo pienso dos veces. La gente gana más o menos lo mismo, y eso es lo que asusta.'] },
  { id: 'w-eco-a2-consejo', type: 'write', level: 2, theme: 'economia',
    prompt: 'Give a friend advice about saving money in your city.',
    hint: 'Two or three concrete suggestions.',
    constraints: [{ type: 'containsAny', words: ['puedes', 'te recomiendo', 'lo mejor'] }, { type: 'minWords', n: 25 }],
    models: ['Lo mejor es comprar en el mercado el sábado por la tarde, porque bajan mucho los precios. También puedes coger el abono de transporte mensual: si sales más de dos veces por semana, sale a cuenta.'] },
  { id: 't-eco-b1-si', type: 'translate', level: 3, theme: 'economia',
    prompt: 'Translate: "If I earned more, I would move."',
    hint: 'si + imperfect subjunctive, then the conditional.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'containsWord', word: 'si' }],
    models: ['Si ganara más, me mudaría.'] },
  { id: 'w-eco-b1-vivienda', type: 'write', level: 3, theme: 'economia',
    prompt: 'Write about why housing costs so much where you live, and what might help.',
    hint: 'Cause then proposal; porque and para are both useful.',
    constraints: [{ type: 'containsWord', word: 'porque' }, { type: 'minWords', n: 35 }],
    models: ['Aquí la vivienda es cara porque se construye poco y buena parte de lo que hay está en alquiler turístico. La gente joven se va a vivir a treinta kilómetros y pasa dos horas al día en el coche. Limitar los pisos turísticos ayudaría, aunque no lo arregla solo.'] },
  { id: 'p-eco-b2-trabajo', type: 'paragraph', level: 5, theme: 'economia',
    prompt: 'Write about whether working fewer hours for the same pay could work.',
    hint: 'Take a position and answer the obvious objection.',
    constraints: [{ type: 'containsAny', words: ['ahora bien', 'sin embargo', 'aunque'] }, { type: 'minWords', n: 45 }],
    models: ['Los experimentos que conozco apuntan a que la producción no cae, sobre todo donde se medía mal el tiempo y bien el resultado. Ahora bien, eso vale para una oficina y no para una cocina o una planta de montaje, donde la hora es el producto. Generalizar a partir del caso más cómodo es lo que suele hundir estas propuestas.'] },
  { id: 't-eco-b2-hubiera', type: 'translate', level: 5, theme: 'economia',
    prompt: 'Translate: "If we had bought it then, we would have saved a lot."',
    hint: 'Past unreal: si + pluperfect subjunctive, then conditional perfect.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condperf' }, { type: 'containsWord', word: 'si' }],
    models: ['Si lo hubiéramos comprado entonces, habríamos ahorrado mucho.'] },

  // ---- viajes: topping up the theme Focus exists for ----------------------
  { id: 't-via-reservar', type: 'translate', level: 1, theme: 'viajes',
    prompt: 'Translate: "I want to book a room for two nights."',
    hint: 'querer + infinitive; para + length.',
    constraints: [{ type: 'infinitiveUsed', inf: 'reservar' }, { type: 'containsWord', word: 'noches' }],
    models: ['Quiero reservar una habitación para dos noches.'] },
  { id: 'b-via-andén', type: 'build', level: 1, theme: 'viajes',
    en: 'Which platform does the train leave from?', answer: '¿De qué andén sale el tren?' },
  { id: 't-via-perdido', type: 'translate', level: 1, theme: 'viajes',
    prompt: 'Translate: "I am lost, I am looking for the station."',
    hint: 'estar perdido, buscar with no preposition.',
    constraints: [{ type: 'containsWord', word: 'perdido' }, { type: 'containsWord', word: 'estación' }],
    models: ['Estoy perdido, busco la estación.'] },
  { id: 'w-via-maleta', type: 'write', level: 1, theme: 'viajes',
    prompt: 'Tell an airline your suitcase has not arrived and where you are staying.',
    hint: 'Say the problem, then where to send it.',
    constraints: [{ type: 'containsWord', word: 'maleta' }, { type: 'minWords', n: 15 }],
    models: ['Mi maleta no ha llegado. Estoy en el hotel Sol, en la calle Mayor, hasta el jueves.'] },
  { id: 't-via-a2-retraso', type: 'translate', level: 2, theme: 'viajes',
    prompt: 'Translate: "The flight was delayed and we missed the connection."',
    hint: 'Two completed events → preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'vuelo' }],
    models: ['El vuelo se retrasó y perdimos la conexión.'] },
  { id: 'p-via-a2-mejor', type: 'paragraph', level: 2, theme: 'viajes',
    prompt: 'Write a short paragraph about the best trip you have taken.',
    hint: 'Set the scene in the imperfect, tell what happened in the preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'anyVerbInTense', tense: 'imperfecto' },
                  { type: 'minWords', n: 30 }],
    models: ['Hace dos años fuimos a Galicia en coche sin reservar nada. Llovía casi todos los días y no nos importó nada. Comimos mejor que en ningún otro viaje y volvimos con ganas de repetir.'] }
,

  // ---- top-up to the target depth, weighted to A1/A2 ----------------------
  { id: 't-cuer-dedo', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: "I have cut my finger."',
    hint: 'Present perfect, with the article rather than "my".',
    constraints: [{ type: 'anyVerbInTense', tense: 'perfecto' }, { type: 'containsWord', word: 'dedo' }],
    models: ['Me he cortado el dedo.'] },
  { id: 'b-cuer-brazo', type: 'build', level: 1, theme: 'cuerpo',
    en: 'He broke his arm playing football.', answer: 'Se rompió el brazo jugando al fútbol.' },
  { id: 't-cuer-hambre', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: "I am hungry and very thirsty."',
    hint: 'tener hambre / tener sed, never estar.',
    constraints: [{ type: 'containsWord', word: 'hambre' }, { type: 'containsWord', word: 'sed' }],
    models: ['Tengo hambre y mucha sed.'] },
  { id: 'b-cuer-sueno', type: 'build', level: 1, theme: 'cuerpo',
    en: 'I am very sleepy today.', answer: 'Hoy tengo mucho sueño.' },
  { id: 't-cuer-estatura', type: 'translate', level: 1, theme: 'cuerpo',
    prompt: 'Translate: "He is taller than me."',
    hint: 'más alto que.',
    constraints: [{ type: 'containsWord', word: 'que' }, { type: 'containsWord', word: 'alto' }],
    models: ['Es más alto que yo.'] },
  { id: 'w-cuer-deporte', type: 'write', level: 1, theme: 'cuerpo',
    prompt: 'Write about a sport or exercise you do, and how your body feels afterwards.',
    hint: 'Present tense plus doler.',
    constraints: [{ type: 'containsAny', words: ['duele', 'duelen', 'cansado', 'cansada'] }, { type: 'minWords', n: 15 }],
    models: ['Juego al pádel los martes con unos amigos del trabajo. Al día siguiente siempre me duelen las piernas, pero merece la pena.'] },
  { id: 't-cuer-a2-caida', type: 'translate', level: 2, theme: 'cuerpo',
    prompt: 'Translate: "I fell and hurt my knee."',
    hint: 'Two completed events → preterite; the article, not "my".',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'rodilla' }],
    models: ['Me caí y me hice daño en la rodilla.'] },
  { id: 'b-cuer-a2-gafas', type: 'build', level: 2, theme: 'cuerpo',
    en: 'I have worn glasses since I was a child.', answer: 'Llevo gafas desde pequeño.' },
  { id: 'w-cuer-a2-dormir', type: 'write', level: 2, theme: 'cuerpo',
    prompt: 'Write about how well you sleep and what affects it.',
    hint: 'Frequency plus a reason.',
    constraints: [{ type: 'containsWord', word: 'porque' }, { type: 'minWords', n: 25 }],
    models: ['Duermo bastante mal entre semana porque me acuesto tarde y me levanto a las seis. Los fines de semana recupero un poco, aunque dicen que eso no funciona así.'] },
  { id: 't-cuer-b1-agujetas', type: 'translate', level: 3, theme: 'cuerpo',
    prompt: 'Translate: "Tomorrow I am going to ache all over."',
    hint: 'ir a + infinitive for a confident prediction.',
    constraints: [{ type: 'infinitiveUsed', inf: 'doler' }, { type: 'containsWord', word: 'mañana' }],
    models: ['Mañana me va a doler todo.'] },
  { id: 'p-cuer-b1-edad', type: 'paragraph', level: 3, theme: 'cuerpo',
    prompt: 'Write about how people treat their bodies differently as they get older.',
    hint: 'Compare then and now; land on a view.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 35 }],
    models: ['A los veinte años no pensaba en el cuerpo en absoluto: dormía cuatro horas y al día siguiente estaba perfecto. Ahora tengo que calentar antes de correr y estirar después, y si no lo hago lo pago. No es peor, es distinto: antes el cuerpo perdonaba y ahora negocia.'] },
  { id: 't-cuer-b2-parezca', type: 'translate', level: 4, theme: 'cuerpo',
    prompt: 'Translate: "I do not think he looks like his father."',
    hint: 'no creer que → subjunctive; parecerse a.',
    constraints: [{ type: 'anyVerbInTense', tense: 'presubj' }, { type: 'negation' }],
    models: ['No creo que se parezca a su padre.'] },
  { id: 'w-cuer-b2-descanso', type: 'write', level: 5, theme: 'cuerpo',
    prompt: 'Write about why rest is treated as something to be earned.',
    hint: 'A reflective argument with a concession.',
    constraints: [{ type: 'containsAny', words: ['sin embargo', 'aunque', 'ahora bien'] }, { type: 'minWords', n: 45 }],
    models: ['Hemos convertido el descanso en un premio, algo que solo se merece quien antes se ha vaciado. Aunque suene a frase de taller, el cuerpo no distingue entre cansancio noble y cansancio tonto: se rompe igual. Lo raro es que sigamos contando las horas dormidas como si fueran una debilidad.'] },
  { id: 'b-cuer-c1-postura', type: 'build', level: 8, theme: 'cuerpo',
    en: 'Sitting badly for years took its toll on her back.', answer: 'Sentarse mal durante años le pasó factura a la espalda.' },
  { id: 't-cuer-c1-hubiera', type: 'translate', level: 5, theme: 'cuerpo',
    prompt: 'Translate: "If I had stretched, I would not have injured myself."',
    hint: 'si + pluperfect subjunctive, then conditional perfect.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condperf' }, { type: 'containsWord', word: 'si' }],
    models: ['Si hubiera estirado, no me habría lesionado.'] },

  { id: 't-med-canal', type: 'translate', level: 1, theme: 'medios',
    prompt: 'Translate: "What channel is the match on?"',
    hint: 'en qué canal.',
    constraints: [{ type: 'containsWord', word: 'canal' }, { type: 'question' }],
    models: ['¿En qué canal ponen el partido?'] },
  { id: 'b-med-radio', type: 'build', level: 1, theme: 'medios',
    en: 'I listen to the radio while I cook.', answer: 'Escucho la radio mientras cocino.' },
  { id: 't-med-foto', type: 'translate', level: 1, theme: 'medios',
    prompt: 'Translate: "She sent me a photo yesterday."',
    hint: 'Indirect pronoun before the verb, preterite.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'foto' }],
    models: ['Ayer me mandó una foto.'] },
  { id: 'b-med-anuncio', type: 'build', level: 1, theme: 'medios',
    en: 'There are too many adverts on this channel.', answer: 'Hay demasiados anuncios en este canal.' },
  { id: 'w-med-pelicula', type: 'write', level: 1, theme: 'medios',
    prompt: 'Write about a film you watched recently and whether you liked it.',
    hint: 'Say what it was and give a verdict.',
    constraints: [{ type: 'containsAny', words: ['me gustó', 'me encantó', 'no me gustó'] }, { type: 'minWords', n: 15 }],
    models: ['El sábado vi una película argentina en el cine del barrio. Me gustó mucho, aunque el final fue un poco raro.'] },
  { id: 't-med-a2-oido', type: 'translate', level: 2, theme: 'medios',
    prompt: 'Translate: "Have you heard the news?"',
    hint: 'Present perfect for something just now.',
    constraints: [{ type: 'anyVerbInTense', tense: 'perfecto' }, { type: 'question' }],
    models: ['¿Has oído la noticia?'] },
  { id: 'b-med-a2-compartir', type: 'build', level: 2, theme: 'medios',
    en: 'I do not share anything on the internet.', answer: 'No comparto nada en internet.' },
  { id: 'w-med-a2-desconectar', type: 'write', level: 2, theme: 'medios',
    prompt: 'Write about a time you stopped using your phone for a while.',
    hint: 'Preterite for what you did, imperfect for how it felt.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 25 }],
    models: ['El verano pasado dejé el móvil en casa durante una semana en el pueblo. Los dos primeros días estaba nervioso y lo buscaba sin darme cuenta. Después se me olvidó por completo.'] },
  { id: 't-med-a2-suele', type: 'translate', level: 2, theme: 'medios',
    prompt: 'Translate: "He usually reads two newspapers a day."',
    hint: 'soler + infinitive.',
    constraints: [{ type: 'infinitiveUsed', inf: 'leer' }, { type: 'containsWord', word: 'día' }],
    models: ['Suele leer dos periódicos al día.'] },
  { id: 'p-med-b1-idiomas', type: 'paragraph', level: 3, theme: 'medios',
    prompt: 'Write about watching things in another language, with or without subtitles.',
    hint: 'Give your practice and a reason.',
    constraints: [{ type: 'containsWord', word: 'porque' }, { type: 'minWords', n: 35 }],
    models: ['Ahora veo casi todo en versión original con subtítulos en español, porque así leo y escucho a la vez. Al principio iba perdidísimo y tenía que parar cada dos minutos. Después de unos meses te acostumbras al acento y dejas de leer sin darte cuenta.'] },
  { id: 't-med-b1-aunque', type: 'translate', level: 3, theme: 'medios',
    prompt: 'Translate: "Although everyone talks about it, I have not seen it."',
    hint: 'aunque + indicative, then the present perfect.',
    constraints: [{ type: 'containsWord', word: 'aunque' }, { type: 'anyVerbInTense', tense: 'perfecto' }],
    models: ['Aunque todo el mundo habla de ella, yo no la he visto.'] },
  { id: 'w-med-b1-titular', type: 'write', level: 3, theme: 'medios',
    prompt: 'Write about a headline that turned out to say less than it promised.',
    hint: 'Narrate briefly, then comment.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 35 }],
    models: ['La semana pasada leí un titular que anunciaba un descubrimiento enorme sobre el sueño. Entré a leerlo y era un estudio con treinta personas y sin conclusiones claras. No era mentira, pero el titular prometía algo que el texto no daba.'] },
  { id: 'b-med-b2-directo', type: 'build', level: 5, theme: 'medios',
    en: 'The interview was broadcast live.', answer: 'La entrevista se emitió en directo.' },
  { id: 't-med-b2-dijera', type: 'translate', level: 5, theme: 'medios',
    prompt: 'Translate: "They asked me to say what I thought."',
    hint: 'pedir que in the past → imperfect subjunctive.',
    constraints: [{ type: 'anyVerbInTense', tense: 'impsubj' }, { type: 'containsWord', word: 'que' }],
    models: ['Me pidieron que dijera lo que pensaba.'] },
  { id: 'p-med-b2-atencion', type: 'paragraph', level: 5, theme: 'medios',
    prompt: 'Write about what competing for attention does to how things get told.',
    hint: 'Argue, and concede something.',
    constraints: [{ type: 'containsAny', words: ['sin embargo', 'ahora bien', 'aunque'] }, { type: 'minWords', n: 45 }],
    models: ['Cuando lo que se vende es la atención, el matiz se vuelve caro y la indignación sale gratis. Aunque siempre ha habido prensa sensacionalista, antes ocupaba un quiosco y ahora ocupa el bolsillo. Lo grave no es que exista, sino que el formato premia al que grita por encima del que explica.'] },

  { id: 't-pol-vecinos', type: 'translate', level: 1, theme: 'politica',
    prompt: 'Translate: "There is a meeting on Thursday at seven."',
    hint: 'hay for existence; a las for the time.',
    constraints: [{ type: 'containsWord', word: 'reunión' }, { type: 'containsWord', word: 'jueves' }],
    models: ['Hay una reunión el jueves a las siete.'] },
  { id: 'b-pol-firma', type: 'build', level: 1, theme: 'politica',
    en: 'Many people signed the petition.', answer: 'Mucha gente firmó la petición.' },
  { id: 't-pol-impuestos', type: 'translate', level: 1, theme: 'politica',
    prompt: 'Translate: "We pay a lot of tax here."',
    hint: 'pagar in the present, nosotros.',
    constraints: [{ type: 'containsWord', word: 'impuestos' }, { type: 'anyVerbInTense', tense: 'presente' }],
    models: ['Aquí pagamos muchos impuestos.'] },
  { id: 'b-pol-derecho', type: 'build', level: 1, theme: 'politica',
    en: 'Everyone has the right to an education.', answer: 'Todo el mundo tiene derecho a la educación.' },
  { id: 'w-pol-participar', type: 'write', level: 1, theme: 'politica',
    prompt: 'Write about whether you take part in anything in your community.',
    hint: 'Say what you do or do not do, and why.',
    constraints: [{ type: 'containsWord', word: 'porque' }, { type: 'minWords', n: 15 }],
    models: ['No participo mucho porque trabajo por las tardes y las reuniones son siempre a esa hora. Me gustaría ir alguna vez.'] },
  { id: 't-pol-a2-prometieron', type: 'translate', level: 2, theme: 'politica',
    prompt: 'Translate: "They promised a new hospital and never built it."',
    hint: 'Two completed events → preterite; nunca before the verb.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'containsWord', word: 'nunca' }],
    models: ['Prometieron un hospital nuevo y nunca lo construyeron.'] },
  { id: 'b-pol-a2-huelga', type: 'build', level: 2, theme: 'politica',
    en: 'There is a transport strike tomorrow.', answer: 'Mañana hay huelga de transporte.' },
  { id: 'w-pol-a2-debate', type: 'write', level: 2, theme: 'politica',
    prompt: 'Write about a decision in your town that people disagreed about.',
    hint: 'Say what happened and what people thought.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 25 }],
    models: ['El año pasado quitaron los aparcamientos del centro para hacer una zona peatonal. A los comerciantes no les gustó nada y hubo protestas, pero ahora casi nadie quiere volver atrás.'] },
  { id: 't-pol-a2-suba', type: 'translate', level: 2, theme: 'politica',
    prompt: 'Translate: "Nobody wants to pay more."',
    hint: 'nadie plus querer plus infinitive.',
    constraints: [{ type: 'containsWord', word: 'nadie' }, { type: 'infinitiveUsed', inf: 'pagar' }],
    models: ['Nadie quiere pagar más.'] },
  { id: 'p-pol-b1-jovenes', type: 'paragraph', level: 3, theme: 'politica',
    prompt: 'Write about whether young people are less interested in politics than before.',
    hint: 'Compare, then give a view.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 35 }],
    models: ['Se dice que antes la gente joven tenía más interés, aunque no estoy seguro de que sea cierto. Antes se entraba en un partido y se estaba allí años; ahora la gente se organiza por internet para una causa concreta y luego lo deja. Ha cambiado la forma, no necesariamente las ganas.'] },
  { id: 't-pol-b1-cambiara', type: 'translate', level: 3, theme: 'politica',
    prompt: 'Translate: "I do not think anything will change."',
    hint: 'Future or ir a; negation at the front.',
    constraints: [{ type: 'negation' }, { type: 'containsWord', word: 'nada' }],
    models: ['No creo que cambie nada.'] },
  { id: 'w-pol-b1-local', type: 'write', level: 3, theme: 'politica',
    prompt: 'Write about something your local council does well or badly.',
    hint: 'One concrete example beats three general claims.',
    constraints: [{ type: 'containsAny', words: ['por ejemplo', 'por un lado', 'lo peor'] }, { type: 'minWords', n: 35 }],
    models: ['Lo peor de mi ayuntamiento es que anuncia las obras y no dice cuánto van a durar. Por ejemplo, cortaron mi calle en marzo para cambiar unas tuberías y seguimos igual en septiembre. Nadie contesta al teléfono y la web lleva meses sin actualizarse.'] },
  { id: 't-pol-b2-hubiera', type: 'translate', level: 5, theme: 'politica',
    prompt: 'Translate: "If they had explained it better, there would have been less opposition."',
    hint: 'si + pluperfect subjunctive, then conditional perfect.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condperf' }, { type: 'containsWord', word: 'si' }],
    models: ['Si lo hubieran explicado mejor, habría habido menos oposición.'] },
  { id: 'b-pol-b2-mayoria', type: 'build', level: 5, theme: 'politica',
    en: 'The law was approved by a large majority.', answer: 'La ley se aprobó por amplia mayoría.' },
  { id: 'w-pol-b2-compromiso', type: 'write', level: 5, theme: 'politica',
    prompt: 'Write about why compromise is unpopular and whether that matters.',
    hint: 'Argue, concede, qualify.',
    constraints: [{ type: 'containsAny', words: ['ahora bien', 'sin embargo', 'no obstante'] }, { type: 'minWords', n: 45 }],
    models: ['El acuerdo tiene mala prensa porque obliga a admitir en público que el otro llevaba algo de razón, y eso se lee como derrota. Sin embargo, casi todo lo que funciona a largo plazo se pactó con alguien a quien no se quería. Quien nunca cede no defiende mejor sus ideas: simplemente las defiende solo.'] },

  { id: 't-iden-vecino', type: 'translate', level: 1, theme: 'identidad',
    prompt: 'Translate: "This is my neighbour, he is called Paco."',
    hint: 'este es for introducing somebody; llamarse.',
    constraints: [{ type: 'containsWord', word: 'vecino' }, { type: 'containsWord', word: 'llama' }],
    models: ['Este es mi vecino, se llama Paco.'] },
  { id: 'b-iden-trabajo', type: 'build', level: 1, theme: 'identidad',
    en: 'I am a nurse and I work at night.', answer: 'Soy enfermera y trabajo por la noche.' },
  { id: 't-iden-casado', type: 'translate', level: 1, theme: 'identidad',
    prompt: 'Translate: "They are married and have two children."',
    hint: 'estar casado, tener for children.',
    constraints: [{ type: 'containsWord', word: 'casados' }, { type: 'containsWord', word: 'hijos' }],
    models: ['Están casados y tienen dos hijos.'] },
  { id: 'b-iden-firma', type: 'build', level: 1, theme: 'identidad',
    en: 'Please sign here and write the date.', answer: 'Firme aquí y escriba la fecha, por favor.' },
  { id: 't-iden-a2-extranjero', type: 'translate', level: 2, theme: 'identidad',
    prompt: 'Translate: "It was hard at first, but now I feel at home."',
    hint: 'Imperfect for how it was, present for now.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'containsWord', word: 'ahora' }],
    models: ['Al principio era difícil, pero ahora me siento en casa.'] },
  { id: 'w-iden-a2-nombre', type: 'write', level: 2, theme: 'identidad',
    prompt: 'Write about your name — who chose it, and whether it suits you.',
    hint: 'Preterite for the choosing, present for now.',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 25 }],
    models: ['Me pusieron el nombre de mi abuela, que murió el año antes de nacer yo. De pequeña no me gustaba nada porque era muy poco común en el colegio. Ahora me parece que me va bien.'] },
  { id: 't-iden-b1-sintiera', type: 'translate', level: 5, theme: 'identidad',
    prompt: 'Translate: "It was as if I had always lived here."',
    hint: 'como si always takes a past subjunctive.',
    constraints: [{ type: 'containsWord', word: 'como' }, { type: 'containsWord', word: 'si' }],
    models: ['Era como si hubiera vivido aquí toda la vida.'] },
  { id: 'p-iden-b1-lengua', type: 'paragraph', level: 3, theme: 'identidad',
    prompt: 'Write about whether you feel like a different person in another language.',
    hint: 'Give your experience, then a view.',
    constraints: [{ type: 'containsAny', words: ['creo', 'me parece', 'la verdad'] }, { type: 'minWords', n: 35 }],
    models: ['En español soy más directo, y no sé si es la lengua o que todavía no tengo palabras para suavizar las cosas. Me parece que uno suena más simple en el idioma que está aprendiendo, y eso cambia cómo te ven. La verdad es que también me hace menos tímido.'] },

  { id: 't-car-a2-fiarse', type: 'translate', level: 2, theme: 'caracter',
    prompt: 'Translate: "He seems serious but he is very funny."',
    hint: 'parecer plus an adjective; pero to contrast.',
    constraints: [{ type: 'containsWord', word: 'parece' }, { type: 'containsWord', word: 'pero' }],
    models: ['Parece serio, pero es muy divertido.'] },
  { id: 'b-car-a2-enfadado', type: 'build', level: 2, theme: 'caracter',
    en: 'She is angry because we arrived late.', answer: 'Está enfadada porque llegamos tarde.' },
  { id: 't-car-b1-daria', type: 'translate', level: 3, theme: 'caracter',
    prompt: 'Translate: "He would never say anything like that."',
    hint: 'Conditional plus nunca.',
    constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'containsWord', word: 'nunca' }],
    models: ['Nunca diría algo así.'] },
  { id: 'w-car-b1-primera', type: 'write', level: 3, theme: 'caracter',
    prompt: 'Write about a time your first impression of somebody turned out to be wrong.',
    hint: 'Imperfect for the impression, preterite for what changed it.',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'anyVerbInTense', tense: 'preterito' },
                  { type: 'minWords', n: 35 }],
    models: ['Cuando conocí a mi jefa me pareció fría y bastante seca, y durante semanas evité hablar con ella. Un día se quedó hasta tarde ayudándome con un informe que no era suyo. Entendí entonces que no era distante, simplemente no hablaba por hablar.'] },
  { id: 'b-car-b2-genio', type: 'build', level: 5, theme: 'caracter',
    en: 'He has a terrible temper but he gets over it quickly.', answer: 'Tiene muy mal genio, pero se le pasa enseguida.' },
  { id: 't-car-b2-fuera', type: 'translate', level: 5, theme: 'caracter',
    prompt: 'Translate: "I would have liked him to be more honest."',
    hint: 'me habría gustado que + imperfect subjunctive.',
    constraints: [{ type: 'anyVerbInTense', tense: 'impsubj' }, { type: 'containsWord', word: 'que' }],
    models: ['Me habría gustado que fuera más sincero.'] },

  /* ==== ESSAYS — extended argumentative & professional production (B2/C1) ===
   *
   * Everything above this line asks for a sentence or, at most, a paragraph.
   * Measured across the whole file before these were written, the MEDIAN
   * `minWords` at B2/C1 was eight, and the longest advanced task in the corpus
   * was fifty-five words — against 220-250 for a single DELE C1 task. A
   * learner could finish every advanced writing task the app had and never
   * once have had to hold an argument together across two paragraphs, which
   * is the only thing B2 and C1 are actually about.
   *
   * An `essay` therefore carries four things a `paragraph` does not:
   *
   *   brief   the SITUATION. Not a topic — who you are, who reads it, and
   *           what you want out of them. "Escribe sobre el teletrabajo" gets
   *           an encyclopaedia entry; "convince a committee that has already
   *           voted against it once" gets writing, because there is something
   *           to lose. Every brief here has a reader with an interest.
   *   plan    the genre's moves, from the genre lesson that teaches it. Shown
   *           BEFORE the box, because a C1 text is planned, and because the
   *           app already teaches these moves in gn-argumentativa-c1 and
   *           gn-carta-reclamacion-c1 and then never asked for them.
   *   rubric  the id of a self-assessment template in data/rubrics.js — what
   *           the machine cannot check, handed back to the learner as
   *           answerable questions rather than as a grade.
   *   models  200 words or so of the real thing, to compare against after.
   *
   * The constraints lean on `connectorFrom` with `minLevel`, which is the
   * whole reason that option exists: "use a contraargumentativo" is satisfied
   * by `pero`, so without a floor an advanced task asserts nothing. A class is
   * demanded rather than a word, so the learner picks from the repertoire —
   * which is what is being learnt — instead of inserting a fixed phrase.
   *
   * Written to be FEW AND LONG. Ten tasks here against 163 short ones above is
   * the intended ratio, not a first instalment awaiting bulk: an essay is
   * twenty minutes and a revision pass, and a learner meets one every week or
   * two, not twice a session.
   * ======================================================================== */

  { id: 'b2e-jornada-trabajo', type: 'essay', level: 6, cefr: 'B2', theme: 'trabajo',
    rubric: 'argumentativa',
    prompt: 'Argue for or against extending the four-day week, to the committee that has to decide.',
    brief: 'Tu empresa ha probado la jornada de cuatro días durante seis meses en un solo departamento: el tuyo. El comité de dirección decide el martes si la amplía. Dos de los cinco miembros ya votaron en contra la primera vez. Escribe tu informe: te leen personas con prisa y con la decisión medio tomada.',
    plan: ['Reconoce lo que funcionó, con una cifra concreta',
           'Admite la objeción más fuerte del otro lado — y respóndela',
           'Trae el dato que no está sobre la mesa',
           'Cierra con una propuesta acotada, no con un deseo'],
    hint: 'Usted-level register; concede antes de contraargumentar; cierra con una propuesta que se pueda votar.',
    constraints: [
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'consecutivo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'B2' },
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Ante todo, conviene reconocer que el proyecto ha salido mejor de lo que muchos esperábamos. Durante estos seis meses la producción no ha caído y el número de bajas se ha reducido casi a la mitad. No obstante, los datos que se nos han presentado miden el periodo más tranquilo del año, de modo que conviene leerlos con prudencia. Quienes se oponen a ampliar la medida sostienen que el ahorro desaparecerá en cuanto vuelva la campaña de otoño. El argumento tiene fundamento, y hasta cierto punto lo comparto. Ahora bien, el mismo informe muestra que las horas extra se han desplomado, esto es, que el equipo no está compensando en casa lo que deja de hacer en la oficina. Por lo que respecta al coste, la comparación que circula no incluye lo que nos cuesta cada sustitución. Habida cuenta de que formar a una persona nueva supone tres meses de salario, cualquier medida que retenga al personal se paga sola. Propongo, por consiguiente, ampliar el piloto a dos departamentos más y volver a evaluarlo en marzo, cuando la carga de trabajo permita una comparación honesta.'] },

  { id: 'b2e-obra-vivienda', type: 'essay', level: 7, cefr: 'B2', theme: 'vivienda',
    rubric: 'formal-transaccional',
    prompt: 'Write the letter of complaint about a building job delivered three months late and billed with extras you never authorised.',
    brief: 'Contrataste una reforma con entrega el 30 de junio. Te la entregaron el 28 de septiembre y la factura final trae 2.400 euros de conceptos que nadie te comunicó por escrito. La empresa sigue trabajando en tu barrio y no quieres un pleito: quieres que anulen el importe y revisen el baño.',
    plan: ['Los hechos primero: fechas, importes, qué se firmó',
           'El argumento: qué cláusula se incumplió',
           'La concesión — lo que sí les reconoces',
           'La petición, en una frase, con plazo'],
    hint: 'Usted a lo largo de toda la carta. Los hechos antes que las valoraciones. Impersonal con "se" donde señalar a alguien no ayuda.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'consecutivo', minLevel: 'B2' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Estimados señores: Ante todo, les recuerdo que el contrato firmado el 14 de marzo fijaba la entrega de la reforma para el 30 de junio. Las obras se entregaron el 28 de septiembre, es decir, con casi tres meses de retraso, y la factura final incluye 2.400 euros en conceptos que nunca se me comunicaron por escrito. Pues bien, en ese periodo se nos pidió dos veces que desalojáramos la vivienda durante el fin de semana, y en ninguna de las dos ocasiones se avanzó lo previsto. No obstante, entiendo que parte del retraso se debió a la escasez de material, circunstancia que no les es imputable. Por lo que respecta a los importes añadidos, la cláusula cuarta exige autorización previa del cliente. Dado que esa autorización no consta en ningún documento, dichos conceptos no resultan exigibles. Les solicito, por lo tanto, la anulación de los 2.400 euros y la revisión del acabado del baño, que presenta humedades. Quedo a la espera de su respuesta en el plazo de quince días. Atentamente,'] },

  { id: 'b2e-moviles-educacion', type: 'essay', level: 6, cefr: 'B2', theme: 'educacion',
    rubric: 'opinion-debate',
    prompt: 'Take your turn in the staff-room debate: a colleague has proposed banning phones outright.',
    brief: 'Estás en el claustro. Una compañera acaba de defender la prohibición total del móvil con datos buenos y con razón en casi todo. No estás de acuerdo con la medida, pero vas a seguir trabajando con ella el resto del curso. Tu turno.',
    plan: ['Recoge lo que ha dicho — demuestra que lo has entendido',
           'Atenúa antes de discrepar',
           'Discrepa del argumento, no de la persona',
           'Aporta algo nuevo: una alternativa concreta y comprobable'],
    hint: 'Atenuadores antes del desacuerdo. Evita los absolutos. Un verbo de opinión en negativo pide subjuntivo.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'no creo que' },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'B2', n: 2 },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'reformulador-explicativo', minLevel: 'B2' },
      { type: 'minSentences', n: 6 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Comparto buena parte de lo que se ha dicho: es cierto que el móvil interrumpe la clase y que muchos centros han llegado al límite. En cuanto al efecto sobre la atención, los datos que se citan son sólidos y no pretendo discutirlos. Ahora bien, no creo que la prohibición total resuelva el problema de fondo. Hasta cierto punto, retirar el aparato traslada el conflicto a la puerta del instituto, donde ya nadie lo supervisa. Dicho de otro modo, ganamos la hora de clase y perdemos la ocasión de enseñar a usarlo. Si no me equivoco, lo que se propuso en el claustro anterior iba en otra dirección: reservar el móvil para tareas concretas y retirarlo el resto del tiempo. Esa vía exige más trabajo del profesorado, todo hay que decirlo, pero no renuncia a formar a nadie. Propongo, en consecuencia, que probemos la fórmula mixta durante un trimestre y que comparemos los resultados con los de los grupos que mantengan la prohibición.'] },

  { id: 'b2e-pisos-turisticos-economia', type: 'essay', level: 7, cefr: 'B2', theme: 'economia',
    rubric: 'formal-transaccional',
    prompt: 'Write to the mayor on behalf of your neighbourhood association about the tourist-flat bylaw.',
    brief: 'La ordenanza va a pleno el mes que viene. Tu asociación no pide la prohibición — la mitad del comercio del barrio vive del turismo y lo sabéis. Pedís tres cosas concretas, y las cifras que las sostienen son del propio ayuntamiento, que es lo que las hace difíciles de rebatir.',
    plan: ['Sitúa quién escribe y sobre qué expediente',
           'Concede lo que el ayuntamiento tiene razón en defender',
           'Los datos — y de dónde salen',
           'Las peticiones, numerables y votables'],
    hint: 'Usted. Impersonal con "se" para los hechos administrativos. Las cifras antes que la indignación.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'consecutivo', minLevel: 'B2' },
      { type: 'minSentences', n: 7 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Estimado señor alcalde: Le escribo en nombre de la asociación de vecinos del barrio de San Andrés en relación con la ordenanza de viviendas de uso turístico que se someterá a pleno el mes que viene. Ante todo, quiero dejar constancia de que no pedimos la prohibición. En cuanto al efecto económico, somos conscientes de que el turismo sostiene buena parte del comercio de la zona, y así lo reconocimos en la reunión de mayo. No obstante, en los últimos tres años se han licenciado ciento cuarenta pisos turísticos en ocho calles, y en ese mismo periodo el alquiler de larga duración ha subido un treinta y uno por ciento. Dado que ambas cifras proceden del propio ayuntamiento, entendemos que no se discuten. Por lo tanto, solicitamos que la ordenanza fije un límite por edificio, que se publique un registro accesible y que se revise la medida a los dos años. Quedamos a su disposición para exponer estos datos ante la comisión. Atentamente,'] },

  { id: 'c1e-prensa-medios', type: 'essay', level: 8, cefr: 'C1', theme: 'medios',
    rubric: 'argumentativa',
    prompt: 'Write the opinion column: can journalism survive without somebody paying for it?',
    brief: 'Te han pedido 250 palabras para la página de opinión de un diario que acaba de poner muro de pago y ha perdido un tercio de sus lectores. La redacción te lee. Los lectores que se fueron, también.',
    plan: ['Deshaz la confusión que la pregunta esconde',
           'Lo que se creyó durante veinte años, y en qué acabó',
           'El reproche más serio al muro de pago — reconócelo entero',
           'Por qué la alternativa tampoco es gratis',
           'Cierra desplazando la pregunta, no repitiéndola'],
    hint: 'Contraargumentativos de C1. Impersonal con "se" para lo que se sostiene sin firmar. La conclusión debe decir algo nuevo.',
    constraints: [
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'reformulador-recapitulativo', minLevel: 'C1' },
      { type: 'sePassive' },
      { type: 'minSentences', n: 9 },
      { type: 'minWords', n: 180 }
    ],
    models: ['De entrada, conviene separar dos preguntas que suelen mezclarse: si el periodismo puede sobrevivir sin que nadie lo pague, y si debe pagarlo el lector. La primera tiene una respuesta corta y desagradable; la segunda, ninguna que sirva para todos los países a la vez. Durante dos décadas se sostuvo que la publicidad bastaría. Hoy sabemos en qué acabó aquello: los ingresos migraron a dos plataformas que no producen ni una línea, y las redacciones se vaciaron. Si bien algunos medios han recuperado suscriptores, el volumen no compensa lo perdido, y conviene no confundir una excepción con una tendencia. Se argumenta, con razón, que un muro de pago deja fuera precisamente a quien más necesita informarse. El reproche es serio. Con todo, la alternativa que se propone, un periodismo gratuito financiado por quien tenga interés en aparecer en él, no es gratuita en absoluto: se paga en otra moneda, y la factura llega más tarde. Habida cuenta de que ningún modelo único ha funcionado, lo razonable sería dejar de buscarlo. Suscripción, fundación, dinero público con reglas estrictas y cooperativa de lectores pueden convivir sin que ninguno explique el conjunto. A fin de cuentas, la pregunta no es quién paga el periodismo, sino qué se deja de saber cuando nadie lo paga.'] },

  { id: 'c1e-triaje-salud', type: 'essay', level: 8, cefr: 'C1', theme: 'salud',
    rubric: 'argumentativa',
    prompt: 'Write the memo objecting to one clause of a triage protocol, to the committee that approves it on Tuesday.',
    brief: 'El borrador ordena a los pacientes por pronóstico vital a doce meses. En urgencias, eso penaliza sistemáticamente a los crónicos. El comité lo aprueba el martes en bloque y nadie ha pedido la palabra. No quieres tumbar el protocolo: quieres que ese punto se debata por separado.',
    plan: ['Di qué pides antes de argumentar por qué',
           'Reconoce que el criterio es defendible donde lo es',
           'Acota el daño: dónde falla y a quién',
           'Propón la corrección, no la supresión',
           'Pide un acto concreto: votar ese punto aparte'],
    hint: 'Usted. Impersonal con "se" para el procedimiento. Un reformulador para precisar a quién afecta.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'ordenador-cierre', minLevel: 'C1' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 160 }
    ],
    models: ['Distinguidos miembros del comité: Por lo que respecta al protocolo de triaje que se revisará el próximo martes, quisiera exponer una objeción antes de que el texto se apruebe. El borrador ordena a los pacientes por pronóstico vital a doce meses. El criterio es defendible y en la mayoría de los servicios funcionaría sin conflicto. Ahora bien, aplicado en urgencias, penaliza sistemáticamente a los pacientes crónicos, esto es, a quienes ya acuden con un pronóstico peor por razones ajenas al episodio que los trae hoy aquí. No propongo suprimir el criterio. Propongo acotarlo: que el pronóstico se pondere junto con la urgencia del cuadro y no por delante de ella, tal como recomienda el documento de la sociedad científica que se adjunta. Si no me equivoco, esta fue la fórmula que se ensayó en el hospital comarcal el año pasado, y conviene recuperar sus datos antes de decidir. En suma, les ruego que el punto tercero se debata por separado y que no se dé por aprobado con el resto del protocolo. Reciban un cordial saludo,'] },

  { id: 'c1e-voto-politica', type: 'essay', level: 9, cefr: 'C1', theme: 'politica',
    rubric: 'opinion-debate',
    prompt: 'Take your turn against compulsory voting — to somebody you agree with about the problem.',
    brief: 'La abstención en las últimas municipales fue del sesenta por ciento y quien propone el voto obligatorio tiene razón en el diagnóstico. Es amigo tuyo y vais a seguir hablando de esto. Discrepas de la medida, no del problema.',
    plan: ['Concede el diagnóstico sin reservas',
           'Reformula su argumento antes de responderlo',
           'Trae la evidencia contraria — y señala tú mismo su límite',
           'Rescata la parte de su propuesta que sí apoyas',
           'Propón separar las dos medidas'],
    hint: 'Tuteo: es un debate entre iguales. Atenuadores de C1, y cuantifica en vez de afirmar en absoluto.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'no creo que' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'focalizador', minLevel: 'C1' },
      { type: 'minSentences', n: 9 },
      { type: 'minWords', n: 170 }
    ],
    models: ['Digamos que el punto de partida es justo: la abstención en las últimas municipales fue del sesenta por ciento y eso debilita cualquier mandato. En eso coincidimos. Por mi parte, sin embargo, no creo que la obligatoriedad corrija lo que se pretende corregir. Si te he entendido bien, el argumento es que votar obliga a informarse. Antes bien, la experiencia de los países que lo aplican muestra lo contrario: aumenta el voto, no la deliberación, y crece el voto en blanco hasta niveles que nadie sabe interpretar. Todo hay que decirlo: la comparación no es limpia, porque esos sistemas llevan décadas funcionando y el nuestro no. Más concretamente, habría que mirar qué pasó en los primeros diez años de cada uno, y ese dato no se suele citar. Con todo, hay una parte de la propuesta que sí me convence: penalizar la abstención es discutible, pero facilitar el voto no lo es. Voto por correo sin trámite, urnas abiertas dos días, jornada laboral protegida. Quizá convendría separar las dos medidas y votarlas por separado, porque la segunda tendría apoyo hoy mismo.'] },

  { id: 'c1e-financiacion-ciencia', type: 'essay', level: 9, cefr: 'C1', theme: 'ciencia',
    rubric: 'argumentativa',
    prompt: 'Argue the case on whether basic research should be funded by results.',
    brief: 'Escribes para una revista de política científica que ha publicado ya tres artículos a favor de la evaluación por resultados a tres años. Te leen quienes toman la decisión y quienes la sufren. No te van a conceder la segunda página.',
    plan: ['Nombra la confusión que la pregunta esconde',
           'Concede lo razonable de pedir criterios',
           'El caso contrario, con ejemplos que no se puedan discutir',
           'El sesgo del sistema alternativo — sin fingir que hay uno neutral',
           'Reformula la pregunta: no si evaluar, sino en qué plazo'],
    hint: 'Impersonal con "se" para lo que se debate. Un aditivo de C1 para el efecto que nadie contabiliza.',
    constraints: [
      { type: 'connectorFrom', class: 'aditivo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'sePassive' },
      { type: 'minSentences', n: 9 },
      { type: 'minWords', n: 180 }
    ],
    models: ['La cuestión que se debate, si la investigación básica debe financiarse por resultados, parte de una confusión que conviene deshacer antes de tomar partido. En vista de que los presupuestos son limitados, resulta razonable pedir criterios. Ahora bien, el criterio que se propone mide publicaciones y patentes a tres años, y ese plazo es más corto que el de casi todo lo que después resultó útil. La edición genética nació de un trabajo sobre bacterias que no prometía ninguna aplicación; el láser se describió durante cuarenta años como una solución en busca de un problema. Por lo que respecta a la evaluación por pares, tampoco está libre de sesgos: premia lo incremental, esto es, lo que se parece a lo ya publicado. Si bien ningún sistema es neutral, conviene elegir el sesgo con los ojos abiertos. A ello hay que sumar un efecto que rara vez se contabiliza: los grupos pequeños dejan de intentar lo arriesgado en cuanto su continuidad depende de un indicador anual. En suma, la pregunta no es si evaluar, sino en qué plazo y contra qué. Una evaluación a diez años, con revisión intermedia y tolerancia explícita al fracaso, mediría lo que decimos querer medir.'] },

  { id: 'c1e-resena-arte', type: 'essay', level: 8, cefr: 'C1', theme: 'arte',
    rubric: 'argumentativa',
    prompt: 'Write the critical review: an essential exhibition, hung in a way that works against it.',
    brief: 'Ochenta piezas que casi nunca se han visto juntas, y un montaje cronológico que convierte una obsesión del pintor en una evolución. El museo te ha dado la acreditación. La reseña sale el viernes y la van a leer allí.',
    plan: ['Di qué justifica la visita, sin rodeos',
           'Gira: lo que el montaje hace en contra de la obra',
           'Un ejemplo concreto y verificable — sala, obra, distancia',
           'Lo que el museo ha hecho bien, y dilo de verdad',
           'Cierra con un juicio doble, no con una nota'],
    hint: 'Un comentador de C1 para girar. Un focalizador para bajar al ejemplo. El elogio tiene que ser específico o no cuenta.',
    constraints: [
      { type: 'connectorFrom', class: 'comentador', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'focalizador', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'ordenador-inicio', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'aditivo', minLevel: 'C1' },
      { type: 'minSentences', n: 9 },
      { type: 'minWords', n: 170 }
    ],
    models: ['La exposición reúne ochenta piezas que casi nunca se habían visto juntas, y ese solo hecho justifica la visita. Dicho esto, el montaje trabaja en contra de lo que pretende mostrar. De entrada, la sala primera impone un recorrido cronológico que la propia obra desmiente: el pintor volvió tres veces sobre los mismos motivos, y verlos ordenados por fecha convierte una obsesión en una evolución. Más concretamente, los dos retratos de 1911 y 1937 cuelgan a cuarenta metros uno del otro, cuando la comparación entre ambos es el argumento del catálogo. Si bien la iluminación se ha cuidado, los textos de sala no acompañan. Explican el contexto histórico con solvencia y callan casi todo lo técnico, esto es, precisamente lo que el visitante no puede deducir mirando. A ello hay que sumar un acierto que conviene señalar: la última sala, dedicada a los bocetos, es la mejor que ha ofrecido este museo en años. En suma, una exposición imprescindible por lo que reúne y discutible por cómo lo ordena. Merece la pena verla dos veces: la primera, siguiendo el recorrido; la segunda, desobedeciéndolo.'] },

  { id: 'c1e-lobo-naturaleza', type: 'essay', level: 9, cefr: 'C1', theme: 'naturaleza',
    rubric: 'opinion-debate',
    prompt: 'Persuade a hostile audience to postpone the motion — the people who lost the livestock.',
    brief: 'Asamblea de ganaderos. La moción pide retirar la protección del lobo y va a salir adelante esta tarde. Quien la ha presentado perdió seis ovejas en una noche. No te van a escuchar por compasión y no tienes autoridad aquí: tienes dos minutos y un dato.',
    plan: ['Pide lo concreto al principio — no hagas esperar',
           'Reconoce el daño sin condescendencia y sin peros',
           'El argumento: por qué la medida no resuelve lo que duele',
           'Apoya la parte de la moción que sí funcionaría',
           'Ofrece algo que te comprometa a ti si te equivocas'],
    hint: 'Ustedes: no los conoces. Atenúa antes de contradecir a alguien que ha perdido algo. Un contraargumentativo de C1 para el giro.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'subjunctiveAfter', trigger: 'hasta que' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'B2' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 170 }
    ],
    models: ['Vengo a pedirles algo concreto, y prefiero decirlo al principio: que retiren la moción hasta que tengamos los datos del censo de este año. Entiendo perfectamente de dónde viene la moción. Quien ha perdido seis ovejas en una noche no necesita que nadie le explique lo que es un lobo, y las indemnizaciones llegan tarde y mal. En eso no voy a discutirles nada. Ahora bien, la moción pide una cosa que no resolvería eso. Retirar la protección no reduce los ataques a corto plazo; los desplaza, porque el hueco lo ocupan animales jóvenes y dispersos, que son precisamente los que atacan ganado. Si no me equivoco, es lo que pasó en el valle contiguo hace cuatro años. Con todo, hay una parte de la moción que apoyaría hoy mismo: exigir que la indemnización se pague en treinta días y que los mastines y el vallado los financie la administración, no el ganadero. Habida cuenta de que la votación no es urgente, propongo aplazarla dos meses. Si los datos me contradicen, seré yo quien defienda la moción en la próxima asamblea.'] },
  /* ---- second batch: depth, and the ten themes the first batch missed ----
   * Ten essays was too few to survive contact with the selector. Measured over
   * 120 B2 sessions, the produce stage served 17 essays and NINE of them were
   * the same one — with four to choose from, that is what the arithmetic gives,
   * not a fault in the sampling. C1 was better only because it had six.
   *
   * So: B2 goes to twelve and C1 to fourteen, and the twenty themes are all
   * represented. The rubrics stay at three — a fourth would be a new marking
   * vocabulary for the same five DELE criteria, and the learner is better
   * served meeting one rubric often enough to know it by heart.
   * ---------------------------------------------------------------------- */

  { id: 'b2e-suministro-servicios', type: 'essay', level: 7, cefr: 'B2', theme: 'servicios',
    rubric: 'formal-transaccional',
    prompt: 'Write the complaint to the electricity company: five months billed on estimated readings.',
    brief: 'El contador está en el rellano y nunca se ha impedido leerlo. Llevas cinco facturas estimadas sobre el histórico del inquilino anterior, que consumía el doble que tú. Cada factura arrastra el error de la anterior. Quieres refacturación, devolución y una lectura presencial.',
    plan: ['Sitúa el expediente: contrato, periodo, qué facturas',
           'Los hechos comprobables antes de cualquier valoración',
           'Concede lo que no les es imputable',
           'La norma que obliga, y el plazo que fija',
           'Las peticiones, numeradas, con fecha límite'],
    hint: 'Usted en toda la carta. Impersonal con "se" para el procedimiento. Las cifras antes que la queja.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'consecutivo', minLevel: 'B2' },
      { type: 'minSentences', n: 7 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Estimados señores: Me dirijo a ustedes en relación con las facturas de los últimos cinco meses, todas ellas emitidas con lectura estimada. Ante todo, conviene aclarar que el contador es accesible desde el rellano y que nunca se ha impedido su lectura. Pues bien, en ese periodo se me ha facturado un consumo medio de cuatrocientos kilovatios, cuando la lectura real que comuniqué en marzo arroja menos de la mitad. Dado que la estimación se calcula sobre el histórico del titular anterior, el error se arrastra factura tras factura y no se corrige solo. No obstante, entiendo que la incidencia pudo originarse en el cambio de comercializadora y que no responde a mala fe. Por lo que respecta a la regularización, la normativa exige que se practique en el plazo de un mes desde la lectura real. Les solicito, por lo tanto, la refacturación de los cinco periodos, la devolución del exceso cobrado y la lectura presencial del contador antes del próximo ciclo. Quedo a la espera de su respuesta por escrito en el plazo de quince días. Atentamente,'] },

  { id: 'b2e-garantia-compras', type: 'essay', level: 6, cefr: 'B2', theme: 'compras',
    rubric: 'formal-transaccional',
    prompt: 'Claim the warranty the shop has refused on a laptop that died at fourteen months.',
    brief: 'Novecientos euros, comprado en enero, muerto a los catorce meses. El servicio técnico dice placa base y uso indebido. No ha recibido ningún golpe ni mojadura, y su propio informe no menciona daño externo. La garantía legal son tres años.',
    plan: ['La compra: fecha, importe, justificante',
           'Qué falló y qué dictaminó el servicio técnico',
           'Por qué el dictamen no se sostiene, con su propio informe',
           'Reconoce lo que sí hicieron bien',
           'Pide reparación o sustitución, en una frase'],
    hint: 'Usted. Impersonal con "se" para lo que dice el informe. Un contraargumentativo para girar contra el dictamen.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'B2' },
      { type: 'minSentences', n: 7 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Estimados señores: El pasado 12 de enero adquirí en su establecimiento un ordenador portátil por importe de novecientos euros, según la factura que se adjunta. En primer lugar, quiero dejar constancia de que el equipo dejó de encender a los catorce meses, es decir, dentro del periodo de garantía legal de tres años. Pues bien, en el servicio técnico se me informó de que el fallo corresponde a la placa base y de que la reparación no se cubre por tratarse de un uso indebido. Ahora bien, el equipo no ha sufrido ningún golpe ni contacto con líquidos, y en el propio informe técnico no se menciona daño externo alguno. Dado que la normativa presume que los defectos aparecidos en ese plazo son de origen, corresponde a la empresa acreditar lo contrario. No obstante, reconozco que el trato recibido en tienda fue correcto en todo momento y que se me atendió sin demora. Les solicito, en consecuencia, la reparación sin coste o, en su defecto, la sustitución del equipo. Quedo a la espera de su respuesta. Atentamente,'] },

  { id: 'b2e-comedor-alimentacion', type: 'essay', level: 6, cefr: 'B2', theme: 'alimentacion',
    rubric: 'opinion-debate',
    prompt: 'Take your turn: a colleague wants every processed product out of the school canteen at once.',
    brief: 'Tiene razón en el diagnóstico y los datos son buenos. Pero ya lo intentasteis hace tres cursos: la mitad de los niños dejó de comer y la otra mitad trajo la merienda de casa. Discrepas del método, no del objetivo, y trabajas con ella todos los días.',
    plan: ['Concede el diagnóstico sin reservas',
           'Reformula su propuesta antes de responderla',
           'Trae lo que ya pasó, y señala tú mismo su límite',
           'Nombra la causa que nadie ha tocado',
           'Propón algo medible y por fases'],
    hint: 'Atenúa antes de discrepar. Un verbo de opinión en negativo pide subjuntivo. Evita los absolutos.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'no creo que' },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'B2', n: 2 },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'reformulador-explicativo', minLevel: 'B2' },
      { type: 'minSentences', n: 7 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Comparto el diagnóstico y creo que nadie en esta sala lo discute: lo que se sirve en el comedor no es lo que recomendaríamos en casa. En cuanto a los datos del informe, me parecen sólidos y no voy a ponerlos en duda. Ahora bien, no creo que la retirada total funcione como se espera. Hasta cierto punto, ya lo intentamos hace tres cursos, y lo que ocurrió fue que la mitad de los niños dejó de comer y la otra mitad trajo la merienda de casa. Dicho de otro modo, cambiamos el menú y no cambiamos lo que acabaron comiendo. Si no me equivoco, el problema no está solo en la compra, sino en que nadie ha explicado nunca a las familias por qué se cambia. Todo hay que decirlo, eso exige tiempo del claustro que ahora mismo no tenemos. Propongo, en consecuencia, que la sustitución se haga por fases, empezando por los desayunos, y que se evalúe con el peso de los restos antes de seguir.'] },

  { id: 'b2e-polideportivo-ocio', type: 'essay', level: 7, cefr: 'B2', theme: 'ocio',
    rubric: 'argumentativa',
    prompt: 'Argue against closing the municipal sports centre, to the councillors who costed it.',
    brief: 'Pierde ciento veinte mil euros al año y eso es cierto. También recibe cuarenta y dos mil entradas, casi todas de menores de dieciséis y mayores de sesenta y cinco. El informe mide el coste por hora de apertura, no por usuario. La alternativa privada está a once kilómetros.',
    plan: ['Admite la pérdida, con la cifra exacta',
           'Muestra qué mide el informe y qué no',
           'Traslada el ahorro: quién acaba pagándolo',
           'Reformula la pregunta: rentable, o servicio',
           'Propón una salida intermedia y una fecha'],
    hint: 'Usted. Impersonal con "se" para lo que dice el informe. Cierra con un ordenador de cierre, no con un ruego.',
    constraints: [
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'ordenador-cierre', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'B2' },
      { type: 'minSentences', n: 6 },
      { type: 'minWords', n: 150 }
    ],
    models: ['El cierre del polideportivo municipal se presenta como un ajuste contable, y conviene mirar la cuenta entera antes de aceptarlo. Ante todo, reconozco que las instalaciones pierden dinero: ciento veinte mil euros el año pasado, según el propio informe de intervención. En cuanto al uso, sin embargo, ese mismo informe contabiliza cuarenta y dos mil entradas anuales, la mayoría de menores de dieciséis años y de mayores de sesenta y cinco. No obstante, la comparación que se ha hecho circular mide el coste por hora de apertura y no por usuario, de modo que un centro lleno y uno vacío salen igual de caros. Dado que la alternativa privada más cercana está a once kilómetros y cuesta cuarenta euros al mes, el ahorro se traslada a las familias en lugar de desaparecer. Hasta cierto punto, el debate no es si el servicio es rentable, sino qué se espera que sea. En definitiva, propongo que antes de cerrar se estudie la cesión a un club federado y que la decisión se aplace hasta el pleno de diciembre.'] },

  { id: 'b2e-cuidado-relaciones', type: 'essay', level: 7, cefr: 'B2', theme: 'relaciones',
    rubric: 'opinion-debate',
    prompt: 'Answer your sister: she wants to move your father into a care home, and you disagree.',
    brief: 'Lleva dos años haciéndolo sola y eso no lo discute nadie. Pero lo que ha cambiado en enero no es tu padre: es el turno de noche que le han puesto a ella. Hay una ayuda a domicilio que nadie ha pedido todavía, y tarda tres meses. Vas a seguir siendo su hermano después de esta conversación.',
    plan: ['Reconoce lo que ha hecho, sin peros',
           'Nombra lo que ha cambiado de verdad',
           'Separa los dos problemas que se están mezclando',
           'Trae la opción que nadie ha probado, con su pega',
           'Comprométete a algo tú, no solo ella'],
    hint: 'Tuteo: es tu hermana. Atenúa antes de contradecir a alguien agotado. Un contraargumentativo de C1 para el giro.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'no creo que' },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'B2', n: 2 },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'B2' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Antes de nada, quiero decir que llevas dos años haciendo esto sola y que eso no lo discute nadie, y menos yo. En cuanto a la residencia, entiendo perfectamente por qué la planteas ahora y no hace seis meses. Ahora bien, no creo que la decisión esté madura. Hasta cierto punto, lo que ha cambiado no es papá, sino el turno de noche que te han puesto en enero. Dicho de otro modo, estamos resolviendo tu agotamiento con una mudanza suya, y son dos problemas distintos. Si no me equivoco, la trabajadora social mencionó una ayuda a domicilio de veinte horas semanales que todavía no hemos pedido. Todo hay que decirlo, esa ayuda tarda tres meses en concederse y puede que no llegue a tiempo. Con todo, propongo que la solicitemos esta semana y que volvamos a hablarlo en marzo, cuando sepamos si la han aprobado. Si para entonces sigues igual, la pido yo y la pago yo, y no vuelvo a discutirte la residencia.'] },

  { id: 'b2e-apellidos-identidad', type: 'essay', level: 7, cefr: 'B2', theme: 'identidad',
    rubric: 'argumentativa',
    prompt: 'Write the letter to the editor on the law that lets parents choose the order of surnames.',
    brief: 'Lleva años en vigor y se sigue discutiendo como si fuera de ayer. Los argumentos en contra son administrativos; la resistencia no lo es. Escribes para la sección de cartas de un diario cuyos lectores se reparten a partes iguales.',
    plan: ['Recuerda qué dice la norma, exactamente',
           'Concede el coste administrativo real',
           'Compárala con una reforma anterior que ya nadie discute',
           'Nombra lo que de verdad incomoda',
           'Cierra sobre esa distinción'],
    hint: 'Impersonal con "se": la norma no la aplica nadie en concreto. Cierra con un ordenador de cierre.',
    constraints: [
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'ordenador-cierre', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'B2' },
      { type: 'minSentences', n: 6 },
      { type: 'minWords', n: 150 }
    ],
    models: ['La reforma que permite elegir el orden de los apellidos lleva años en vigor y sigue discutiéndose como si fuera de ayer. Ante todo, conviene recordar de qué estamos hablando: no se obliga a nadie a nada, se retira una imposición que antes no se podía discutir. En cuanto al argumento de la confusión administrativa, es cierto que los registros tuvieron que adaptarse y que el proceso costó dinero. No obstante, la misma objeción se hizo cuando se permitió conservar el apellido tras el matrimonio, y hoy nadie propone volver atrás. Dado que el orden se fija una sola vez y afecta a todos los hermanos por igual, el supuesto caos genealógico no se ha producido en ninguno de los países que lo aplican desde hace décadas. Hasta cierto punto, lo que incomoda no es el trámite, sino que una costumbre deje de ser automática. En definitiva, una norma que amplía una decisión sin quitársela a nadie es difícil de criticar por sus efectos, y por eso se la critica por lo que representa.'] },

  { id: 'b2e-recomendacion-caracter', type: 'essay', level: 6, cefr: 'B2', theme: 'caracter',
    rubric: 'formal-transaccional',
    prompt: 'Write the reference letter for a former colleague — including the thing she is not good at.',
    brief: 'Cuatro años a tu cargo, llevando las incidencias ya escaladas. Es la mejor que has tenido en ese puesto. También tarda en pedir ayuda, y el puesto al que opta es de trabajo en equipo. Una carta que solo alabe no la ayuda: quien la lee ha leído cincuenta.',
    plan: ['Sitúa la relación: cuánto tiempo, en qué puesto',
           'Di qué exigía el puesto realmente',
           'Un episodio concreto, no un adjetivo',
           'La reserva, dicha sin rodeos, y cómo la corrigió',
           'Recomienda y ofrécete a ampliar'],
    hint: 'Usted a quien lee. Un focalizador para bajar al episodio concreto. La reserva es lo que hace creíble el elogio.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'focalizador', minLevel: 'B2' },
      { type: 'connectorFrom', class: 'ordenador-cierre', minLevel: 'B2' },
      { type: 'minSentences', n: 7 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Estimada señora directora: Escribo a petición de Marta Ruiz, que trabajó bajo mi supervisión durante cuatro años en el departamento de atención al cliente. En primer lugar, conviene situar lo que hacía: llevaba las incidencias que llegaban ya escaladas, es decir, las que nadie había conseguido resolver antes. Pues bien, en ese puesto lo que se necesita no es simpatía, sino aguante y criterio, y las dos cosas las tiene. Recuerdo en concreto un episodio en el que se nos cayó el sistema durante dos días y ella reorganizó sola el reparto de llamadas sin que nadie se lo pidiera. No obstante, sería injusto describirla como alguien que no falla nunca: tarda en pedir ayuda y hay que preguntárselo expresamente. Dado que el puesto que ustedes ofrecen exige trabajo en equipo, me parece honesto mencionarlo, y añadir que lo corrigió en cuanto se le dijo. En definitiva, la recomiendo sin reservas y quedo a su disposición para ampliar cualquier punto. Atentamente,'] },

  { id: 'b2e-encuentro-viajes', type: 'essay', level: 6, cefr: 'B2', theme: 'viajes',
    rubric: 'opinion-debate',
    prompt: 'Your colleague wants to cut the annual team meet-up. Argue for keeping it, in the meeting.',
    brief: 'El presupuesto de formación se ha recortado un treinta por ciento y algo hay que quitar: en eso tiene razón. El encuentro anual es la partida más visible. El año que se canceló, el plan anual tardó cuatro meses en cerrarse en vez de tres semanas — y no puedes demostrar que una cosa causara la otra.',
    plan: ['Concede el recorte y de dónde sale la propuesta',
           'Dale la razón en lo que la tiene',
           'Di qué se compra de verdad con ese gasto',
           'Trae tu evidencia — y admite su límite tú mismo',
           'Propón una versión más barata y una comparación'],
    hint: 'Tuteo entre iguales. Admitir el límite de tu propia prueba te hace más difícil de rebatir, no menos.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'no creo que' },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'B2', n: 2 },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'B2' },
      { type: 'minSentences', n: 7 },
      { type: 'minWords', n: 150 }
    ],
    models: ['Entiendo la propuesta y entiendo de dónde sale: el presupuesto de formación se ha recortado un treinta por ciento y algo hay que quitar. En cuanto al coste, tienes razón en que el encuentro anual es la partida más visible y la más fácil de defender ante dirección. Ahora bien, no creo que sea la más prescindible. Hasta cierto punto, lo que se compra con esos tres días no es el hotel, sino las conversaciones que después ahorran semanas de correos. Dicho de otro modo, el gasto está en una línea del presupuesto y el ahorro está en otra, y solo miramos la primera. Si no me equivoco, el año que lo cancelamos tardamos cuatro meses en cerrar el plan anual, frente a las tres semanas habituales. Todo hay que decirlo, no puedo demostrar que una cosa causara la otra. Con todo, propongo que en lugar de suprimirlo lo acortemos a dos días y lo hagamos aquí, sin vuelos, y que comparemos el resultado antes de decidir el año que viene.'] },

  { id: 'c1e-dopaje-cuerpo', type: 'essay', level: 8, cefr: 'C1', theme: 'cuerpo',
    rubric: 'argumentativa',
    prompt: 'Argue the case on retroactive doping bans and the reassigning of medals years later.',
    brief: 'Escribes para una revista deportiva que acaba de publicar la reasignación de seis medallas de hace ocho años. Te leen federativos y atletas, y unos y otros creen que el artículo va a darles la razón.',
    plan: ['Separa las dos preguntas que el debate confunde',
           'Concede entero el argumento de quien fue limpio',
           'Di qué se devuelve realmente, y qué no',
           'El argumento del reanálisis, con su lado incómodo',
           'Cierra desplazando la pregunta'],
    hint: 'Contraargumentativos de C1. Impersonal con "se" para lo que se sostiene sin firmar.',
    constraints: [
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'reformulador-recapitulativo', minLevel: 'C1' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 180 }
    ],
    models: ['De entrada, conviene separar dos cosas que el debate sobre el dopaje retroactivo mezcla sin descanso: si una marca debe anularse y si una carrera puede reescribirse. La primera tiene respuesta; la segunda, ninguna que satisfaga a nadie. Se argumenta, con razón, que reasignar una medalla ocho años después devuelve a quien fue limpio lo que le correspondía. El principio es difícil de rebatir. Ahora bien, lo que se devuelve es un objeto, no la tarde en que debió recibirlo, ni el patrocinio que entonces no llegó, ni la carrera que se organizó alrededor de un cuarto puesto. Si bien la reasignación repara algo, conviene no confundir una corrección administrativa con una reparación. Por lo que respecta a la prueba, el argumento del almacenamiento de muestras es más sólido de lo que suele admitirse, porque reanalizar con técnicas que no existían sanciona al que quedó expuesto por el calendario. Habida cuenta de que ningún sistema alcanza a todos por igual, lo honesto sería decir qué se persigue. A fin de cuentas, el deporte no ha decidido todavía si castiga el fraude o si administra un palmarés, y mientras no lo decida seguirá haciendo mal las dos cosas.'] },

  { id: 'c1e-simbolos-religion', type: 'essay', level: 9, cefr: 'C1', theme: 'religion',
    rubric: 'argumentativa',
    prompt: 'Argue the case on religious symbols in public buildings — where the real fault line is.',
    brief: 'Para una revista de pensamiento cuyos lectores esperan que tomes partido por uno de los dos bandos. Ninguno de los dos bandos es el que ellos creen: hay creyentes a favor de retirarlos y agnósticos en contra.',
    plan: ['Desmonta la línea de fractura que se da por supuesta',
           'Toma en serio el mejor argumento de cada lado',
           'Muestra que ambos dependen del caso concreto',
           'Trae lo que ha funcionado donde se ha intentado',
           'Cierra sobre el procedimiento, no sobre el símbolo'],
    hint: 'Impersonal con "se" para lo que se argumenta. Dos contraargumentativos de C1: uno por cada lado.',
    constraints: [
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'ordenador-cierre', minLevel: 'C1' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 180 }
    ],
    models: ['La discusión sobre los símbolos religiosos en los edificios públicos se plantea casi siempre como un choque entre creyentes y no creyentes, y de entrada conviene decir que esa no es la línea de fractura real. Hay creyentes partidarios de retirarlos y agnósticos que se oponen, y la razón es que no se está discutiendo sobre fe, sino sobre qué representa un edificio del Estado. Se argumenta que un crucifijo en un aula es patrimonio y no doctrina. El argumento tiene peso donde el edificio es histórico y ninguno donde el centro se inauguró anteayer. Ahora bien, quienes piden la retirada suelen presentarla como neutralidad, y la neutralidad tampoco es un estado natural, porque una pared vacía también comunica algo. Si bien ambas posiciones se presentan como principios, las dos dependen del caso concreto mucho más de lo que admiten. Por lo que respecta a la solución, la que mejor ha funcionado donde se ha abordado no fue una norma general, sino dejar la decisión al consejo de cada centro con un procedimiento reglado. Habida cuenta de que ninguna regla única encaja en todos los edificios, esa es probablemente la única respuesta honesta. En suma, la pregunta no es qué cuelga de la pared, sino quién decide y con qué procedimiento.'] },

  { id: 'c1e-placebo-salud', type: 'essay', level: 8, cefr: 'C1', theme: 'salud',
    rubric: 'argumentativa',
    prompt: 'Argue the case on placebo arms in trials where a working treatment already exists.',
    brief: 'Para el boletín de un comité de ética que aprueba protocolos cada mes. La mitad de sus miembros son investigadores y saben perfectamente que el diseño con placebo es más limpio y más barato. Esa es exactamente la razón por la que hay que decirlo en voz alta.',
    plan: ['Concede el valor real del diseño con placebo',
           'Acota la pregunta: no si sirve, sino cuándo puede usarse',
           'Responde al argumento de la limpieza metodológica',
           'Cita la norma y muestra cómo acota sus excepciones',
           'Nombra el argumento verdadero, el económico'],
    hint: 'Impersonal con "se" para lo que se argumenta. Un justificativo de C1 para el desenlace.',
    constraints: [
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'ordenador-cierre', minLevel: 'C1' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 180 }
    ],
    models: ['De entrada, el ensayo con brazo de placebo no es un residuo ético del pasado, sino el diseño que mejor separa el efecto de un fármaco del ruido de todo lo demás. Eso no está en discusión. Lo que está en discusión es si puede usarse cuando ya existe un tratamiento eficaz, y la respuesta corta es que no, salvo en circunstancias que conviene enumerar en lugar de invocar. Se argumenta que el placebo da resultados más limpios con menos pacientes, y es cierto. Ahora bien, un ensayo más limpio que deja sin tratar a alguien tratable no produce mejor conocimiento, sino el mismo conocimiento a un precio que no pagamos nosotros. Si bien la declaración de Helsinki admite excepciones, las acota con precisión, porque exige que no exista intervención probada o que retirarla suponga un riesgo menor y reversible. Por lo que respecta al argumento regulatorio, que suele ser el verdadero, conviene decirlo en voz alta, ya que el ensayo de no inferioridad es más caro y más lento y por eso se evita. Habida cuenta de que el coste recae en el promotor y el riesgo en el paciente, no estamos ante un empate. En suma, el placebo sigue siendo el mejor comparador disponible y el peor comparador defendible cuando hay algo mejor que dar.'] },

  { id: 'c1e-ia-redaccion-medios', type: 'essay', level: 9, cefr: 'C1', theme: 'medios',
    rubric: 'opinion-debate',
    prompt: 'Your editor wants to automate sport and election results first. Argue for starting elsewhere.',
    brief: 'Si no automatizáis algo, cerráis antes: en eso estáis de acuerdo. Pero deportes y resultados son justo donde un error se propaga más rápido y se corrige más tarde, porque nadie relee un resultado. Es tu jefe y tiene que decidir esta semana.',
    plan: ['Concede el diagnóstico sin fingir lo contrario',
           'Reformula su propuesta antes de responderla',
           'Di por qué ese es el peor sitio para empezar',
           'Propón el sitio correcto — y admite qué ahorra menos',
           'Rescata la parte que firmas hoy mismo'],
    hint: 'Tuteo: es una conversación de redacción. Atenuadores de C1, y un "antes bien" para el giro.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'no creo que' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'focalizador', minLevel: 'C1' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 170 }
    ],
    models: ['Digamos que en el diagnóstico no hay discusión: si no automatizamos los teletipos y las previsiones, cerramos antes. En eso estamos de acuerdo y no voy a fingir lo contrario. Si te he entendido bien, lo que propones es empezar por deportes y resultados electorales, que es donde el texto resulta más previsible. Ahora bien, no creo que ese sea el sitio por donde conviene empezar. Más concretamente, son las dos secciones en las que un error se propaga más rápido y se corrige más tarde, porque nadie relee un resultado. Antes bien, el candidato razonable sería la documentación interna, donde el error lo paga quien lo comete y no el lector. Todo hay que decirlo, eso ahorra menos y cuesta más explicarlo arriba. Con todo, hay una parte de tu propuesta que firmo hoy mismo, y es que si se publica con firma automática tiene que decirlo la firma, y no en la línea doce. Por así decirlo, el problema no es que lo escriba una máquina, sino que el lector crea que lo escribió alguien a quien puede reclamar.'] },

  { id: 'c1e-turismo-viajes', type: 'essay', level: 9, cefr: 'C1', theme: 'viajes',
    rubric: 'argumentativa',
    prompt: 'Argue the case on limiting tourism — without either of the two words that end the argument.',
    brief: 'Para un diario regional donde una palabra la usa un bando y la otra el suyo. Ni "turismofobia" ni "sostenibilidad" sirven ya para nada. El único dato medido en serio es la relación entre licencias turísticas por portal y subida del alquiler en ese portal.',
    plan: ['Desactiva la palabra que envenena el debate',
           'Toma en serio la cifra del sector y di por qué no zanja nada',
           'Desactiva también la palabra de tu propio lado',
           'El dato que sí está medido, con su límite',
           'El efecto que nadie contabiliza, y el orden prudente'],
    hint: 'Impersonal con "se". Un aditivo de C1 para el efecto que nadie cuenta. Cierra reformulando la pregunta.',
    constraints: [
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'aditivo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'ordenador-cierre', minLevel: 'C1' },
      { type: 'minSentences', n: 9 },
      { type: 'minWords', n: 180 }
    ],
    models: ['De entrada, conviene desactivar la palabra que envenena este debate, que es turismofobia. Nombrar así una queja sobre la vivienda convierte un problema de precios en un problema de carácter, y quien la usa suele saberlo. Se argumenta que el sector aporta el doce por ciento del producto interior bruto y que discutirlo es discutir el sustento de mucha gente. La cifra es correcta y el argumento, tramposo, porque nadie propone cerrar el aeropuerto. Ahora bien, quienes pedimos límites tampoco podemos escondernos detrás de la palabra sostenibilidad, que a estas alturas no significa nada y sirve para cualquier cosa. Por lo que respecta a los datos, lo único medido con seriedad es la relación entre licencias turísticas por portal y subida del alquiler en ese portal, y resulta sólida en las cuatro ciudades donde se ha estudiado. Si bien la correlación no basta, el mecanismo es conocido y no hace falta imaginarlo. A ello hay que sumar un efecto que rara vez se contabiliza, y es que el comercio desaparecido no vuelve cuando baja la presión, porque el local ya se ha reformado. Habida cuenta de que la decisión es reversible en un sentido y no en el otro, el orden prudente es limitar primero y ver después. En suma, no se trata de cuántos vienen, sino de qué queda cuando se van.'] },

  { id: 'c1e-mecenazgo-arte', type: 'essay', level: 8, cefr: 'C1', theme: 'arte',
    rubric: 'opinion-debate',
    prompt: 'Answer the trustee who says private patronage has never shaped the museum programme.',
    brief: 'Sin ese dinero, la mitad de las exposiciones de la última década no se habrían montado, y lo sabes. Pero de las catorce muestras patrocinadas por la fundación, once eran de artistas cuya obra ella colecciona. Probablemente nadie pidió nada — y ese es justamente el punto.',
    plan: ['Concede la dependencia del dinero, sin rodeos',
           'Reformula su afirmación antes de responderla',
           'El dato, y lo que hace falta para leerlo',
           'La versión sin villanos, que es la incómoda',
           'Concede que lo público tampoco es inocente — y di la diferencia'],
    hint: 'Tuteo entre patronos. Un focalizador de C1 para bajar al dato. Pide algo concreto al final.',
    constraints: [
      { type: 'subjunctiveAfter', trigger: 'no creo que' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'atenuador', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'focalizador', minLevel: 'C1' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 170 }
    ],
    models: ['Digamos que el punto de partida lo comparto: sin ese dinero, la mitad de las exposiciones de los últimos diez años no se habrían montado. Eso es un hecho y no lo voy a discutir. Si te he entendido bien, tu argumento es que el mecenazgo privado no ha condicionado nunca el criterio del museo. Ahora bien, no creo que eso pueda afirmarse sin mirar el calendario. Más concretamente, de las catorce muestras patrocinadas por la fundación, once eran de artistas cuya obra ella misma colecciona, y una exposición revaloriza una colección. Antes bien, lo interesante es que probablemente nadie pidió nada, porque no hace falta presión cuando la propuesta llega ya filtrada por quien sabe qué se va a aprobar. Todo hay que decirlo, el dinero público tampoco es inocente, y un consejero también tiene gustos. Con todo, la diferencia está en que a un consejero se le puede preguntar en un pleno. Por así decirlo, no discuto el mecenazgo, sino que se publique la lista de obras prestadas y las fechas de compra, y que se publique antes y no después.'] },

  { id: 'c1e-pensiones-economia', type: 'essay', level: 9, cefr: 'C1', theme: 'economia',
    rubric: 'formal-transaccional',
    prompt: 'File the formal submission to a public consultation on the pension reform.',
    brief: 'Alegaciones a una orden en información pública. No discutes la reforma: discutes el artículo tercero, que amplía el periodo de cómputo a veintinueve años sin régimen transitorio para las carreras interrumpidas antes de 2012. Quien lo lea archiva cien al día.',
    plan: ['Identifica el expediente y la fecha de publicación',
           'Deja claro qué NO se discute',
           'El artículo concreto y el defecto concreto',
           'Reconoce la cautela que el texto sí incorpora',
           'La petición: qué se pide y qué se acompaña'],
    hint: 'Registro administrativo: impersonal con "se" de principio a fin, usted, nada de indignación.',
    constraints: [
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'comentador', minLevel: 'C1' },
      { type: 'minSentences', n: 7 },
      { type: 'minWords', n: 170 }
    ],
    models: ['A la Secretaría de Estado de Seguridad Social: Quien suscribe presenta las siguientes alegaciones al proyecto de orden sometido a información pública el pasado 4 de octubre. De entrada, conviene precisar que no se discute aquí la necesidad de la reforma, ampliamente justificada en la memoria económica que acompaña al texto. Por lo que respecta al artículo tercero, se observa que el periodo de cómputo se amplía a veintinueve años sin que se prevea régimen transitorio alguno para las carreras interrumpidas con anterioridad. Habida cuenta de que la cotización de esos años no pudo elegirse, la norma traslada a la persona un efecto que no dependió de ella. Ahora bien, se reconoce que la disposición adicional segunda mitiga parcialmente el problema para las carreras de menos de quince años cotizados. Si bien esa cautela resulta acertada, deja fuera precisamente el tramo más numeroso según los propios datos del anexo. Se solicita, en consecuencia, que se introduzca un régimen transitorio de cinco ejercicios y que se publique la simulación por decil de renta antes de la aprobación definitiva. Se acompaña informe técnico y se queda a disposición de esa Secretaría para cuanto se estime oportuno. Atentamente,'] },

  { id: 'c1e-callejero-identidad', type: 'essay', level: 9, cefr: 'C1', theme: 'identidad',
    rubric: 'argumentativa',
    prompt: 'Argue the case on renaming streets — and on who gets to decide.',
    brief: 'El pleno vota el jueves una lista de once nombres. Escribes en el diario local, donde la mitad de los lectores cree que borrar un nombre es borrar historia y la otra mitad cree que mantenerlo es suscribirlo.',
    plan: ['Distingue archivar de nombrar',
           'Toma en serio el argumento de borrar la historia, y muéstralo falso',
           'Concede el riesgo real del otro lado',
           'El criterio que menos conflicto genera, y por qué',
           'El coste práctico que obliga a cambiar poco'],
    hint: 'Impersonal con "se". Un aditivo de C1 para el coste que nadie menciona. Cierra sobre el procedimiento.',
    constraints: [
      { type: 'sePassive' },
      { type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'C1', n: 2 },
      { type: 'connectorFrom', class: 'aditivo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'justificativo', minLevel: 'C1' },
      { type: 'connectorFrom', class: 'ordenador-cierre', minLevel: 'C1' },
      { type: 'minSentences', n: 8 },
      { type: 'minWords', n: 180 }
    ],
    models: ['De entrada, el callejero no es un archivo. Un archivo conserva y una calle nombra, y nombrar es una decisión que se toma en presente, aunque el nombre venga de hace ochenta años. Quien defiende mantenerlo todo suele apoyarse en que borrar nombres es borrar historia, y el argumento sería sólido si las placas fueran documentos. Ahora bien, ningún historiador ha perdido nunca una fuente porque una calle cambiara de rótulo, y las que se cambiaron en la Transición no han dejado hueco en ningún libro. Si bien el riesgo de convertir el callejero en un plebiscito permanente es real, y conviene decirlo, se resuelve con un procedimiento y no con una prohibición. Por lo que respecta al criterio, el que menos conflicto ha generado no es el ideológico sino el biográfico, porque se revisa el nombre cuando la persona participó en hechos que hoy son delito y no cuando sostuvo ideas que hoy desagradan. A ello hay que sumar un detalle práctico que rara vez se menciona, y es que el coste del cambio recae sobre los vecinos, en documentación y en tiempo, lo que obliga a cambiar poco y a explicarlo bien. Habida cuenta de que ninguna lista contentará a todos, el procedimiento importa más que el resultado. En suma, la pregunta no es a quién se retira, sino quién decide y con qué regla escrita de antemano.'] }




];
