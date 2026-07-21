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
  { id: 'p-yesterday', type: 'paragraph', level: 2,
    prompt: 'Write a short paragraph (3+ sentences) about what you did yesterday and how it went.',
    hint: 'Narrate with the preterite; describe the background with the imperfect; join ideas with y, pero, porque.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'luego', 'después'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Ayer trabajé mucho porque tenía una reunión muy importante por la mañana. Estaba cansado, pero después cené con mis amigos y hablamos durante muchas horas. Fue un día largo y difícil, pero bueno al final.'] },

  { id: 'p-routine', type: 'paragraph', level: 2,
    prompt: 'Describe your typical day, from morning to night.',
    hint: 'Present tense and time markers (por la mañana, luego, todos los días). Join your sentences.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['luego', 'después', 'por la mañana', 'todos los días', 'y'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Todos los días me levanto temprano y desayuno café. Por la mañana trabajo en la oficina, luego como con mis compañeros. Después estudio español y por la noche leo un rato antes de dormir.'] },

  { id: 'p-plans', type: 'paragraph', level: 3,
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
  { id: 'b-restaurant', type: 'build', level: 2, en: 'Yesterday I ate at a restaurant.',
    answer: 'Ayer comí en un restaurante.' },
  { id: 'b-travel', type: 'build', level: 1, en: 'She wants to travel to Spain.',
    answer: 'Ella quiere viajar a España.' },
  { id: 'b-house', type: 'build', level: 1, en: 'We live in a big house.',
    answer: 'Vivimos en una casa grande.' },

  // ---- guided translation (constraints + model) ----
  { id: 't-paella', type: 'translate', level: 2,
    prompt: 'Translate: “Yesterday I ate paella with my family.”',
    hint: 'A finished past event → preterite.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'ayer' }
    ],
    models: ['Ayer comí paella con mi familia.'] },

  { id: 't-thanks', type: 'translate', level: 1,
    prompt: 'Translate: “Thanks for your help with the project.”',
    hint: '“thanks for” is a fixed phrase.',
    constraints: [
      { type: 'containsWord', word: 'gracias por' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Gracias por tu ayuda con el proyecto.'] },

  // ---- constrained free writing (the core output work) ----
  { id: 'w-yesterday', type: 'write', level: 2,
    prompt: 'Write one sentence about what you did yesterday.',
    hint: 'Start with “Ayer” and use the preterite.',
    constraints: [
      { type: 'containsWord', word: 'ayer' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Ayer trabajé y luego cené con mis amigos.', 'Ayer estudié español por dos horas.'] },

  { id: 'w-here-now', type: 'write', level: 1,
    prompt: 'Say where you are right now and how you feel.',
    hint: 'Location and feelings both use estar.',
    constraints: [
      { type: 'verbFormAny', inf: 'estar', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Estoy en casa y estoy muy cansado.', 'Estoy en la oficina y estoy contento.'] },

  { id: 'w-habit', type: 'write', level: 1,
    prompt: 'Write about something you do every day.',
    hint: 'Present tense + “todos los días”.',
    constraints: [
      { type: 'containsWord', word: 'todos los días' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Todos los días bebo café y leo el periódico.', 'Todos los días camino al trabajo.'] },

  { id: 'w-future', type: 'write', level: 3,
    prompt: 'Write one sentence about your plans for next weekend.',
    hint: 'Use the future tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'minWords', n: 5 }
    ],
    models: ['El próximo fin de semana viajaré a la montaña.', 'Este fin de semana saldré con mis amigos.'] },

  { id: 'w-want', type: 'write', level: 4,
    prompt: 'Say what you want someone else to do. Start with “Quiero que…”.',
    hint: 'After “quiero que”, the next verb is subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'quiero que', label: 'start with “quiero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Quiero que tú vengas a mi casa.', 'Quiero que ellos digan la verdad.'] },

  { id: 'w-contrast', type: 'write', level: 1,
    prompt: 'Write a sentence that contrasts two ideas using “pero”.',
    hint: 'e.g. “I\'m tired, but…”.',
    constraints: [
      { type: 'containsAny', words: ['pero', 'aunque'] },
      { type: 'minWords', n: 6 }
    ],
    models: ['Estoy cansado, pero quiero salir esta noche.', 'Me gusta el café, pero prefiero el té.'] },

  // ---- more sentence building ----
  { id: 'b-market2', type: 'build', level: 1, en: 'I need fresh fruit and bread.',
    answer: 'Necesito fruta fresca y pan.' },
  { id: 'b-weather', type: 'build', level: 1, en: 'Today the weather is very nice.',
    answer: 'Hoy hace muy buen tiempo.' },
  { id: 'b-yesterday-work', type: 'build', level: 2, en: 'Yesterday we worked until eight.',
    answer: 'Ayer trabajamos hasta las ocho.' },
  { id: 'b-future-trip', type: 'build', level: 3, en: 'Next year I will travel to Chile.',
    answer: 'El año que viene viajaré a Chile.' },
  { id: 'b-wish', type: 'build', level: 4, en: 'I hope you all arrive early.',
    answer: 'Espero que vosotros lleguéis temprano.' },

  // ---- more guided translation ----
  { id: 't-cumple', type: 'translate', level: 2,
    prompt: 'Translate: “Last week I spent my birthday with my friends.”',
    hint: 'A finished past event → preterite.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'semana pasada' }
    ],
    models: ['La semana pasada pasé mi cumpleaños con mis amigos.'] },

  { id: 't-childhood', type: 'translate', level: 2,
    prompt: 'Translate: “When I was a child, I lived in a small town.”',
    hint: 'Background/habitual past → imperfect.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'de niño' }
    ],
    models: ['De niño, vivía en un pueblo pequeño.'] },

  { id: 't-future-plans', type: 'translate', level: 3,
    prompt: 'Translate: “Next summer we will travel to Greece.”',
    hint: 'Use the future tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'nosotros' },
      { type: 'containsWord', word: 'verano' }
    ],
    models: ['El próximo verano viajaremos a Grecia.'] },

  { id: 't-already-done', type: 'translate', level: 3,
    prompt: 'Translate: “I have already finished the report.”',
    hint: 'Use the present perfect.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'ya' }
    ],
    models: ['Ya he terminado el informe.'] },

  { id: 't-hope-subjunctive', type: 'translate', level: 4,
    prompt: 'Translate: “I hope that you (tú) call me tomorrow.”',
    hint: 'After “espero que”, use the subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'espero que', label: 'start with “espero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Espero que tú me llames mañana.'] },

  // ---- more constrained free writing ----
  { id: 'w-morning-routine', type: 'write', level: 1,
    prompt: 'Write one sentence about what you do every morning.',
    hint: 'Present tense + “todas las mañanas”.',
    constraints: [
      { type: 'containsWord', word: 'todas las mañanas' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Todas las mañanas desayuno y camino al trabajo.', 'Todas las mañanas bebo café y leo las noticias.'] },

  { id: 'w-description', type: 'write', level: 1,
    prompt: 'Describe a person using “ser” and an adjective.',
    hint: 'Use “es” + adjective.',
    constraints: [
      { type: 'verbFormAny', inf: 'ser', tense: 'presente' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Mi hermana es muy simpática y trabajadora.', 'Mi profesor es alto y paciente.'] },

  { id: 'w-question', type: 'write', level: 1,
    prompt: 'Ask someone where they live.',
    hint: 'Form a question with “dónde” and “vivir”.',
    constraints: [
      { type: 'question' },
      { type: 'verbFormAny', inf: 'vivir', tense: 'presente' }
    ],
    models: ['¿Dónde vives?', '¿Dónde vive tu familia?'] },

  { id: 'w-negation', type: 'write', level: 1,
    prompt: "Say something you don't like, using negation.",
    hint: 'Use “no” + gustar.',
    constraints: [
      { type: 'negation' },
      { type: 'verbFormAny', inf: 'gustar', tense: 'presente' }
    ],
    models: ['No me gusta el café frío.', 'No me gusta levantarme temprano.'] },

  { id: 'w-past-trip', type: 'write', level: 2,
    prompt: 'Write one sentence about a trip you took last year.',
    hint: 'Use “el año pasado” + preterite.',
    constraints: [
      { type: 'containsWord', word: 'el año pasado' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' }
    ],
    models: ['El año pasado viajé a Portugal con mi familia.', 'El año pasado conocí una ciudad nueva.'] },

  { id: 'w-childhood-habit', type: 'write', level: 2,
    prompt: 'Write about something you used to do as a child.',
    hint: 'Use “de niño/a” + imperfect.',
    constraints: [
      { type: 'containsWord', word: 'de niño' },
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'person', person: 'yo' }
    ],
    models: ['De niño, jugaba en el parque todos los días.', 'De niño, leía muchos libros de aventuras.'] },

  { id: 'w-plans-weekend2', type: 'write', level: 3,
    prompt: 'Write one sentence about what you and a friend will do this weekend.',
    hint: 'Use future tense + “nosotros”.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'nosotros' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Este fin de semana comeremos en un restaurante nuevo.', 'Este fin de semana veremos una película juntos.'] },

  { id: 'w-conditional-wish', type: 'write', level: 3,
    prompt: 'Say what you would do if you had more money, using the conditional.',
    hint: 'Use “me gustaría” or another conditional verb.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Con más dinero, viajaría por todo el mundo.', 'Me gustaría comprar una casa grande.'] },

  { id: 'w-subjunctive-wish', type: 'write', level: 4,
    prompt: 'Say what you hope a friend does, starting with “Espero que…”.',
    hint: 'After “espero que”, use the present subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'espero que', label: 'start with “espero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Espero que mi amiga encuentre un buen trabajo.', 'Espero que él llegue a tiempo mañana.'] },

  { id: 'w-command', type: 'write', level: 4,
    prompt: 'Give a friend an affirmative command using “tú”.',
    hint: 'Use the tú imperative form.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' },
      { type: 'minWords', n: 2 }
    ],
    models: ['¡Ven a la fiesta esta noche!', 'Habla con ella mañana.'] },

  // ==== batch 2: translate (L1-L5) ====
  { id: 't-computer', type: 'translate', level: 1,
    prompt: 'Translate: “I use the computer every day.”',
    hint: 'Present tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'todos los días' }
    ],
    models: ['Uso el ordenador todos los días.'] },

  { id: 't-family-job', type: 'translate', level: 1,
    prompt: 'Translate: “My mother is a doctor and works in a hospital.”',
    hint: 'ser + trabajar, present tense.',
    constraints: [
      { type: 'verbFormAny', inf: 'ser', tense: 'presente' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'minWords', n: 6 }
    ],
    models: ['Mi madre es médica y trabaja en un hospital.'] },

  { id: 't-where-live', type: 'translate', level: 1,
    prompt: 'Translate: “We live near the beach.”',
    hint: 'vivir, present tense.',
    constraints: [
      { type: 'verbFormAny', inf: 'vivir', tense: 'presente' },
      { type: 'person', person: 'nosotros' }
    ],
    models: ['Vivimos cerca de la playa.'] },

  { id: 't-feelings-tired', type: 'translate', level: 1,
    prompt: 'Translate: “I am tired, but happy.”',
    hint: 'estar + adjectives.',
    constraints: [
      { type: 'verbFormAny', inf: 'estar', tense: 'presente' },
      { type: 'containsWord', word: 'pero' }
    ],
    models: ['Estoy cansado, pero feliz.', 'Estoy cansada, pero feliz.'] },

  { id: 't-morning-coffee', type: 'translate', level: 1,
    prompt: 'Translate: “Every morning I listen to music and drink coffee.”',
    hint: 'escuchar + beber, present tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'todas las mañanas' }
    ],
    models: ['Todas las mañanas escucho música y bebo café.'] },

  { id: 't-need-help', type: 'translate', level: 1,
    prompt: 'Translate: “I need help with this project.”',
    hint: 'necesitar, present tense.',
    constraints: [
      { type: 'verbFormAny', inf: 'necesitar', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Necesito ayuda con este proyecto.'] },

  { id: 't-company-hires', type: 'translate', level: 1,
    prompt: 'Translate: “That company hires a lot of people.”',
    hint: 'contratar, present tense.',
    constraints: [
      { type: 'verbFormAny', inf: 'contratar', tense: 'presente' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Esa empresa contrata a mucha gente.'] },

  { id: 't-question-name', type: 'translate', level: 1,
    prompt: 'Translate: “Where do you live?”',
    hint: 'Question form, vivir.',
    constraints: [
      { type: 'question' },
      { type: 'verbFormAny', inf: 'vivir', tense: 'presente' }
    ],
    models: ['¿Dónde vives?'] },

  { id: 't-negation-understand', type: 'translate', level: 1,
    prompt: 'Translate: “I don’t understand this exercise.”',
    hint: 'negation + entender.',
    constraints: [
      { type: 'negation' },
      { type: 'verbFormAny', inf: 'entender', tense: 'presente' }
    ],
    models: ['No entiendo este ejercicio.'] },

  { id: 't-sent-email', type: 'translate', level: 2,
    prompt: 'Translate: “Yesterday I sent an important email.”',
    hint: 'enviar, preterite.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'ayer' }
    ],
    models: ['Ayer envié un correo importante.'] },

  { id: 't-childhood-listen', type: 'translate', level: 2,
    prompt: 'Translate: “As a child, I used to listen to the radio every night.”',
    hint: 'imperfect, escuchar.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'de niño' }
    ],
    models: ['De niño, escuchaba la radio todas las noches.'] },

  { id: 't-company-fired', type: 'translate', level: 2,
    prompt: 'Translate: “Last month, the company fired several employees.”',
    hint: 'preterite, despedir.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsWord', word: 'el mes pasado' }
    ],
    models: ['El mes pasado, la empresa despidió a varios empleados.'] },

  { id: 't-invested-year', type: 'translate', level: 2,
    prompt: 'Translate: “Last year we invested a lot of money.”',
    hint: 'preterite, invertir.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'nosotros' },
      { type: 'containsWord', word: 'el año pasado' }
    ],
    models: ['El año pasado invertimos mucho dinero.'] },

  { id: 't-used-to-drive', type: 'translate', level: 2,
    prompt: 'Translate: “My grandfather used to drive an old car.”',
    hint: 'imperfect, conducir.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'containsWord', word: 'antes' }
    ],
    models: ['Antes, mi abuelo conducía un coche viejo.'] },

  { id: 't-bought-for-gift', type: 'translate', level: 2,
    prompt: 'Translate: “I bought this gift for my sister.”',
    hint: 'preterite + para.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsWord', word: 'para' }
    ],
    models: ['Compré este regalo para mi hermana.'] },

  { id: 't-walked-through-park', type: 'translate', level: 2,
    prompt: 'Translate: “We walked through the park for two hours.”',
    hint: 'preterite + por.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsWord', word: 'por' }
    ],
    models: ['Caminamos por el parque durante dos horas.'] },

  { id: 't-will-organize', type: 'translate', level: 3,
    prompt: 'Translate: “Next month we will organize a big party.”',
    hint: 'future tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'nosotros' },
      { type: 'containsWord', word: 'el mes que viene' }
    ],
    models: ['El mes que viene organizaremos una fiesta grande.'] },

  { id: 't-would-invest', type: 'translate', level: 3,
    prompt: 'Translate: “With more money, I would invest in a business.”',
    hint: 'conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Con más dinero, invertiría en un negocio.'] },

  { id: 't-have-sent', type: 'translate', level: 3,
    prompt: 'Translate: “I have already sent the documents.”',
    hint: 'present perfect.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsWord', word: 'ya' }
    ],
    models: ['Ya he enviado los documentos.'] },

  { id: 't-will-save', type: 'translate', level: 3,
    prompt: 'Translate: “You will save more money next year.”',
    hint: 'future, ahorrar.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'tú' }
    ],
    models: ['Ahorrarás más dinero el año que viene.'] },

  { id: 't-would-be-worth', type: 'translate', level: 3,
    prompt: 'Translate: “That car would be worth more if it were new.”',
    hint: 'conditional, valer.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Ese coche valdría más si fuera nuevo.'] },

  { id: 't-have-hired', type: 'translate', level: 3,
    prompt: 'Translate: “The company has already hired a new designer.”',
    hint: 'present perfect, contratar.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'containsWord', word: 'ya' }
    ],
    models: ['La empresa ya ha contratado a un nuevo diseñador.'] },

  { id: 't-hope-listen', type: 'translate', level: 4,
    prompt: 'Translate: “I hope you (tú) listen to the advice.”',
    hint: 'espero que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'espero que', label: 'start with “espero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Espero que escuches el consejo.'] },

  { id: 't-command-organize', type: 'translate', level: 4,
    prompt: 'Translate: “Organize your things!” (tú command)',
    hint: 'tú imperative.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' }
    ],
    models: ['¡Organiza tus cosas!'] },

  { id: 't-if-had-more-time', type: 'translate', level: 4,
    prompt: 'Translate: “If I had more time, I would learn to paint.”',
    hint: 'imperfect subjunctive + conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' }
    ],
    models: ['Si tuviera más tiempo, aprendería a pintar.'] },

  { id: 't-had-already-chosen', type: 'translate', level: 4,
    prompt: 'Translate: “When we arrived, they had already chosen the restaurant.”',
    hint: 'pluscuamperfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'plusc' }
    ],
    models: ['Cuando llegamos, ellos ya habían elegido el restaurante.'] },

  { id: 't-want-lead', type: 'translate', level: 4,
    prompt: 'Translate: “I want her to lead the team.”',
    hint: 'quiero que + subjunctive.',
    constraints: [
      { type: 'regex', pattern: 'quiero que', label: 'start with “quiero que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Quiero que ella dirija el equipo.'] },

  { id: 't-command-vosotros', type: 'translate', level: 4,
    prompt: 'Translate: “Listen to the music!” (vosotros command)',
    hint: 'vosotros imperative.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' },
      { type: 'minWords', n: 2 }
    ],
    models: ['¡Escuchad la música!'] },

  { id: 't-will-have-finished', type: 'translate', level: 5,
    prompt: 'Translate: “By Friday, I will have finished the project.”',
    hint: 'futuro perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Para el viernes, habré terminado el proyecto.'] },

  { id: 't-would-have-invested', type: 'translate', level: 5,
    prompt: 'Translate: “With more information, I would have invested in that company.”',
    hint: 'condicional perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Con más información, habría invertido en esa empresa.'] },

  { id: 't-hope-have-finished', type: 'translate', level: 5,
    prompt: 'Translate: “I hope you all will have finished your studies by then.”',
    hint: 'pretérito perfecto de subjuntivo.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfsubj' }
    ],
    models: ['Ojalá que vosotros hayáis terminado los estudios para entonces.'] },

  { id: 't-will-have-saved', type: 'translate', level: 5,
    prompt: 'Translate: “By next year, we will have saved enough money.”',
    hint: 'futuro perfecto.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'nosotros' }
    ],
    models: ['Para el año que viene, habremos ahorrado suficiente dinero.'] },

  { id: 't-would-not-have-said', type: 'translate', level: 5,
    prompt: 'Translate: “In that situation, I would not have said anything.”',
    hint: 'condicional perfecto + negation.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'negation' }
    ],
    models: ['En esa situación, no habría dicho nada.'] },

  // ==== batch 2: write (L1-L5) ====
  { id: 'w-daily-tech', type: 'write', level: 1,
    prompt: 'Write one sentence about something you use every day (a device, an app...).',
    hint: 'Present tense + “todos los días”.',
    constraints: [
      { type: 'containsWord', word: 'todos los días' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Todos los días uso el móvil para hablar con mis amigos.', 'Todos los días uso la aplicación del banco.'] },

  { id: 'w-family-description', type: 'write', level: 1,
    prompt: 'Describe a family member using “ser” and an adjective.',
    hint: 'Use “es” + adjective.',
    constraints: [
      { type: 'verbFormAny', inf: 'ser', tense: 'presente' },
      { type: 'minWords', n: 4 }
    ],
    models: ['Mi abuelo es muy generoso y divertido.', 'Mi tía es alta y muy inteligente.'] },

  { id: 'w-negation-food', type: 'write', level: 1,
    prompt: "Say a food you don't like, using negation.",
    hint: 'no + gustar.',
    constraints: [
      { type: 'negation' },
      { type: 'verbFormAny', inf: 'gustar', tense: 'presente' }
    ],
    models: ['No me gusta el pescado.', 'No me gustan las verduras crudas.'] },

  { id: 'w-past-purchase', type: 'write', level: 2,
    prompt: 'Write one sentence about something you bought last week.',
    hint: 'Use “la semana pasada” + preterite.',
    constraints: [
      { type: 'containsWord', word: 'la semana pasada' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' }
    ],
    models: ['La semana pasada compré unos zapatos nuevos.', 'La semana pasada compré un regalo para mi madre.'] },

  { id: 'w-childhood-town', type: 'write', level: 2,
    prompt: 'Describe the town where you grew up, using the imperfect.',
    hint: 'era, había, vivía…',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'minWords', n: 8 }
    ],
    models: ['El pueblo donde crecí era pequeño y tranquilo, y había un parque bonito.', 'Mi ciudad era muy tradicional y tenía calles estrechas.'] },

  { id: 'w-job-yesterday', type: 'write', level: 2,
    prompt: 'Say what you did at work or school yesterday.',
    hint: 'Preterite, first person.',
    constraints: [
      { type: 'containsWord', word: 'ayer' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Ayer terminé un proyecto importante en el trabajo.', 'Ayer estudié mucho para el examen.'] },

  { id: 'w-future-career', type: 'write', level: 3,
    prompt: 'Write one sentence about a career goal for next year.',
    hint: 'Future tense.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 5 }
    ],
    models: ['El próximo año buscaré un trabajo mejor.', 'El año que viene terminaré mis estudios.'] },

  { id: 'w-conditional-dream', type: 'write', level: 3,
    prompt: 'Say what you would do with a lot of money.',
    hint: 'Conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'minWords', n: 5 }
    ],
    models: ['Con mucho dinero, viajaría por todo el mundo.', 'Compraría una casa grande para mi familia.'] },

  { id: 'w-perfect-achievement', type: 'write', level: 3,
    prompt: 'Say something you have already accomplished this year.',
    hint: 'Present perfect + “este año”.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Este año he ahorrado mucho dinero.', 'Este año he aprendido mucho español.'] },

  { id: 'w-subjunctive-advice', type: 'write', level: 4,
    prompt: 'Give advice to a friend, starting with “Te recomiendo que…”.',
    hint: 'Subjunctive after recomendar que.',
    constraints: [
      { type: 'regex', pattern: 'recomiendo que', label: 'start with “te recomiendo que”' },
      { type: 'anyVerbInTense', tense: 'presubj' }
    ],
    models: ['Te recomiendo que descanses más.', 'Te recomiendo que hables con tu jefe.'] },

  { id: 'w-conditional-hypothetical', type: 'write', level: 4,
    prompt: 'Say what you would do if you had a big problem.',
    hint: 'Si + imperfect subjunctive, conditional.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' }
    ],
    models: ['Si tuviera un problema grande, hablaría con mi familia.', 'Si perdiera mi trabajo, buscaría otro rápido.'] },

  { id: 'w-usted-command', type: 'write', level: 4,
    prompt: 'Give a formal (usted) command to a stranger.',
    hint: 'Usted imperative form.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperativo' },
      { type: 'minWords', n: 2 }
    ],
    models: ['Escuche con atención, por favor.', 'Envíe el documento hoy mismo.'] },

  { id: 'w-futperf-goal', type: 'write', level: 5,
    prompt: 'Say something you will have achieved by next year, using the futuro perfecto.',
    hint: 'habré + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Para el año que viene, habré terminado mis estudios.', 'Para entonces, habré ahorrado bastante dinero.'] },

  { id: 'w-condperf-regret', type: 'write', level: 5,
    prompt: 'Say what you would have done differently in a past situation.',
    hint: 'habría + participio.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'minWords', n: 5 }
    ],
    models: ['En esa situación, habría hablado con más calma.', 'Yo habría elegido un trabajo diferente.'] },

  // ==== batch 2: build (L1-L4) ====
  { id: 'b-listen-music', type: 'build', level: 1, en: 'I listen to music every morning.',
    answer: 'Escucho música todas las mañanas.' },
  { id: 'b-manage-team', type: 'build', level: 1, en: 'My boss manages a team.',
    answer: 'Mi jefa dirige un equipo.' },
  { id: 'b-save-money', type: 'build', level: 1, en: 'We save money every month.',
    answer: 'Ahorramos dinero cada mes.' },
  { id: 'b-need-help2', type: 'build', level: 1, en: 'I need help with the project.',
    answer: 'Necesito ayuda con el proyecto.' },
  { id: 'b-recycle-paper', type: 'build', level: 1, en: 'We recycle paper and plastic.',
    answer: 'Reciclamos papel y plástico.' },
  { id: 'b-sent-report', type: 'build', level: 2, en: 'Yesterday I sent the report.',
    answer: 'Ayer envié el informe.' },
  { id: 'b-company-fired2', type: 'build', level: 2, en: 'The company fired several employees.',
    answer: 'La empresa despidió a varios empleados.' },
  { id: 'b-used-to-work', type: 'build', level: 2, en: 'I used to work in a store.',
    answer: 'Yo trabajaba en una tienda.' },
  { id: 'b-bought-gift2', type: 'build', level: 2, en: 'I bought a gift for my sister.',
    answer: 'Compré un regalo para mi hermana.' },
  { id: 'b-invested-year2', type: 'build', level: 2, en: 'We invested a lot of money.',
    answer: 'Invertimos mucho dinero.' },
  { id: 'b-will-organize2', type: 'build', level: 3, en: 'We will organize a big party.',
    answer: 'Organizaremos una fiesta grande.' },
  { id: 'b-would-invest2', type: 'build', level: 3, en: 'I would invest in a new business.',
    answer: 'Invertiría en un negocio nuevo.' },
  { id: 'b-have-sent2', type: 'build', level: 3, en: 'I have already sent the documents.',
    answer: 'Ya he enviado los documentos.' },
  { id: 'b-will-hire', type: 'build', level: 3, en: 'The company will hire more staff.',
    answer: 'La empresa contratará más personal.' },
  { id: 'b-hope-listen2', type: 'build', level: 4, en: 'I hope you listen to the advice.',
    answer: 'Espero que escuches el consejo.' },
  { id: 'b-command-organize2', type: 'build', level: 4, en: 'Organize your things.',
    answer: 'Organiza tus cosas.' },
  { id: 'b-had-chosen2', type: 'build', level: 4, en: 'They had already chosen the restaurant.',
    answer: 'Ya habían elegido el restaurante.' },

  // ==== batch 2: paragraph (L2-L5) ====
  { id: 'p-first-job', type: 'paragraph', level: 2,
    prompt: 'Write a paragraph (3+ sentences) about your first job.',
    hint: 'Imperfect for background, preterite for specific events; connect with y, pero, porque.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'luego', 'después'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Mi primer trabajo era en una tienda pequeña donde ganaba poco dinero. Trabajaba los fines de semana porque necesitaba pagar mis estudios. Un día tuve un problema grande, pero mi jefe fue muy comprensivo y aprendí mucho de esa experiencia.'] },

  { id: 'p-childhood-home', type: 'paragraph', level: 2,
    prompt: 'Describe the house or town where you grew up, and something that happened there.',
    hint: 'Imperfect for description, preterite for one specific event.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'cuando'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['La casa donde crecí era grande y tenía un jardín precioso. Vivíamos cerca de un río y jugábamos allí todos los veranos. Un año llovió tanto que el río creció mucho, pero por suerte nadie salió herido.'] },

  { id: 'p-future-goals', type: 'paragraph', level: 3,
    prompt: 'Write a paragraph about your goals for next year.',
    hint: 'Future tense; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['El próximo año buscaré un trabajo nuevo porque quiero ganar más dinero. También ahorraré para viajar y aprenderé un idioma nuevo. Será un año difícil, pero estoy segura de que valdrá la pena.'] },

  { id: 'p-conditional-dream-life', type: 'paragraph', level: 3,
    prompt: 'Write a paragraph about what your ideal life would be like.',
    hint: 'Conditional tense throughout; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Mi vida ideal sería muy tranquila. Viviría cerca del mar porque me encanta el agua, y trabajaría solo cuatro días a la semana. También viajaría mucho y pasaría más tiempo con mi familia, pero seguiría ahorrando para el futuro.'] },

  { id: 'p-perfect-year-review', type: 'paragraph', level: 3,
    prompt: 'Write a paragraph reviewing what you have accomplished this year.',
    hint: 'Present perfect throughout; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'perfecto' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Este año he trabajado mucho y he aprendido cosas nuevas. También he ahorrado dinero porque quiero comprar una casa, y he viajado dos veces con mi familia. No ha sido un año fácil, pero estoy muy contenta con todo lo que he logrado.'] },

  { id: 'p-advice-friend', type: 'paragraph', level: 4,
    prompt: 'Write a paragraph giving advice to a friend who is stressed.',
    hint: 'Subjunctive after expressions like “espero que”, “quiero que”, “es importante que”; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presubj' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Sé que estás muy estresado últimamente. Te recomiendo que descanses más y que no trabajes los fines de semana. También espero que hables con tu jefe porque necesitas menos presión. Sé que no es fácil, pero creo que puedes mejorar tu situación.'] },

  { id: 'p-hypothetical-life', type: 'paragraph', level: 4,
    prompt: 'Write a paragraph about what you would do if you had different circumstances.',
    hint: 'Use several “si” clauses (imperfect subjunctive + conditional); connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'impsubj' },
      { type: 'anyVerbInTense', tense: 'condicional' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Si tuviera más tiempo libre, aprendería a pintar y viajaría más. También, si viviera en otra ciudad, buscaría un trabajo diferente porque quiero un cambio. Sé que no es fácil, pero si pudiera, cambiaría muchas cosas de mi vida ahora mismo.'] },

  { id: 'p-futperf-life-plan', type: 'paragraph', level: 5,
    prompt: 'Write a paragraph about everything you will have achieved by a future date, using the futuro perfecto.',
    hint: 'habré + participio, several times; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futperf' },
      { type: 'person', person: 'yo' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Para el año que viene, habré terminado mis estudios y habré empezado a trabajar. También habré ahorrado algo de dinero porque quiero viajar, pero todavía no habré comprado una casa. Sé que habré aprendido mucho durante este tiempo.'] },

  { id: 'p-condperf-reflection', type: 'paragraph', level: 5,
    prompt: 'Write a paragraph reflecting on what you would have done differently in the past.',
    hint: 'habría + participio, several times; connect ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'condperf' },
      { type: 'containsAny', words: ['porque', 'pero', 'y', 'también'] },
      { type: 'minWords', n: 30 }
    ],
    models: ['Si hubiera sabido más, habría elegido una carrera diferente porque siempre me ha gustado el arte. También habría viajado más de joven, y habría ahorrado más dinero cada mes. Sé que no puedo cambiar el pasado, pero me gusta pensar en estas cosas.'] },

  // ==== verb-group lesson writing tasks (groups 1-9) ====
  { id: 't-work-verbos1', type: 'translate', level: 1,
    prompt: 'Translate: “I work and study every day.”',
    constraints: [{ type: 'verbFormAny', inf: 'trabajar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Trabajo y estudio todos los días.'] },
  { id: 'w-eat-drink-verbos1', type: 'write', level: 1,
    prompt: 'Say what you typically eat and drink for lunch.',
    constraints: [{ type: 'verbFormAny', inf: 'comer', tense: 'presente' }, { type: 'minWords', n: 5 }],
    models: ['Como ensalada y bebo agua.'] },

  { id: 't-live-learn-verbos2', type: 'translate', level: 2,
    prompt: 'Translate: “Last year I lived in Madrid and learned a lot.”',
    constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'verbFormAny', inf: 'vivir', tense: 'preterito' }],
    models: ['El año pasado viví en Madrid y aprendí mucho.'] },
  { id: 'w-be-verbos2', type: 'write', level: 1,
    prompt: 'Describe yourself using “ser” and “estar”.',
    constraints: [{ type: 'verbFormAny', inf: 'ser', tense: 'presente' }, { type: 'verbFormAny', inf: 'estar', tense: 'presente' }],
    models: ['Soy paciente y estoy feliz hoy.'] },

  { id: 't-could-not-verbos3', type: 'translate', level: 2,
    prompt: 'Translate: “I couldn’t finish the project yesterday.”',
    constraints: [{ type: 'verbFormAny', inf: 'poder', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer no pude terminar el proyecto.'] },
  { id: 'w-went-verbos3', type: 'write', level: 2,
    prompt: 'Say where you went last weekend.',
    constraints: [{ type: 'verbFormAny', inf: 'ir', tense: 'preterito' }, { type: 'containsWord', word: 'fin de semana' }],
    models: ['El fin de semana pasado fui a la playa.'] },

  { id: 't-told-truth-verbos4', type: 'translate', level: 2,
    prompt: 'Translate: “She told me the truth.”',
    constraints: [{ type: 'verbFormAny', inf: 'decir', tense: 'preterito' }],
    models: ['Ella me dijo la verdad.'] },
  { id: 'w-know-languages-verbos4', type: 'write', level: 1,
    prompt: 'Say how many languages you know.',
    constraints: [{ type: 'verbFormAny', inf: 'saber', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Sé hablar dos idiomas.'] },

  { id: 't-set-table-verbos5', type: 'translate', level: 1,
    prompt: 'Translate: “We set the table before dinner.”',
    constraints: [{ type: 'verbFormAny', inf: 'poner', tense: 'presente' }],
    models: ['Ponemos la mesa antes de cenar.'] },
  { id: 'w-left-late-verbos5', type: 'write', level: 2,
    prompt: 'Say what time you left the house yesterday.',
    constraints: [{ type: 'verbFormAny', inf: 'salir', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer salí de casa a las ocho.'] },

  { id: 't-sleep-hours-verbos6', type: 'translate', level: 1,
    prompt: 'Translate: “I sleep eight hours every night.”',
    constraints: [{ type: 'verbFormAny', inf: 'dormir', tense: 'presente' }],
    models: ['Duermo ocho horas cada noche.'] },
  { id: 'w-ordered-verbos6', type: 'write', level: 2,
    prompt: 'Say what you ordered the last time you went to a restaurant.',
    constraints: [{ type: 'verbFormAny', inf: 'pedir', tense: 'preterito' }],
    models: ['Pedí pescado con ensalada.'] },

  { id: 't-got-job-verbos7', type: 'translate', level: 2,
    prompt: 'Translate: “She got a new job last month.”',
    constraints: [{ type: 'verbFormAny', inf: 'conseguir', tense: 'preterito' }, { type: 'containsWord', word: 'el mes pasado' }],
    models: ['El mes pasado ella consiguió un trabajo nuevo.'] },
  { id: 'w-prefer-verbos7', type: 'write', level: 1,
    prompt: 'Say what you prefer, coffee or tea.',
    constraints: [{ type: 'verbFormAny', inf: 'preferir', tense: 'presente' }],
    models: ['Prefiero el té por la mañana.'] },

  { id: 't-know-people-verbos8', type: 'translate', level: 1,
    prompt: 'Translate: “I know a lot of people here.”',
    constraints: [{ type: 'verbFormAny', inf: 'conocer', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Conozco a mucha gente aquí.'] },
  { id: 'w-read-book-verbos8', type: 'write', level: 2,
    prompt: 'Say what book you read last month.',
    constraints: [{ type: 'verbFormAny', inf: 'leer', tense: 'preterito' }],
    models: ['Leí una novela muy interesante.'] },

  { id: 't-think-before-verbos9', type: 'translate', level: 1,
    prompt: 'Translate: “I think a lot before deciding.”',
    constraints: [{ type: 'verbFormAny', inf: 'pensar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Pienso mucho antes de decidir.'] },
  { id: 'w-drove-verbos9', type: 'write', level: 2,
    prompt: 'Say where you drove to last weekend.',
    constraints: [{ type: 'verbFormAny', inf: 'conducir', tense: 'preterito' }],
    models: ['Conduje hasta la montaña el sábado.'] },

  // ==== verb-group lesson writing tasks (groups 10-18) ====
  { id: 't-start-work-verbos10', type: 'translate', level: 1,
    prompt: 'Translate: “I start work at nine.”',
    constraints: [{ type: 'verbFormAny', inf: 'empezar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Empiezo el trabajo a las nueve.'] },
  { id: 'w-lost-verbos10', type: 'write', level: 2,
    prompt: 'Say something you lost recently.',
    constraints: [{ type: 'verbFormAny', inf: 'perder', tense: 'preterito' }],
    models: ['Perdí mi teléfono la semana pasada.'] },

  { id: 't-remember-verbos11', type: 'translate', level: 1,
    prompt: 'Translate: “I don’t remember his name.”',
    constraints: [{ type: 'negation' }, { type: 'verbFormAny', inf: 'recordar', tense: 'presente' }],
    models: ['No recuerdo su nombre.'] },
  { id: 'w-found-verbos11', type: 'write', level: 2,
    prompt: 'Say something you found unexpectedly.',
    constraints: [{ type: 'verbFormAny', inf: 'encontrar', tense: 'preterito' }],
    models: ['Encontré dinero en la calle.'] },

  { id: 't-cost-verbos12', type: 'translate', level: 1,
    prompt: 'Translate: “This jacket costs a lot.”',
    constraints: [{ type: 'verbFormAny', inf: 'costar', tense: 'presente' }],
    models: ['Esta chaqueta cuesta mucho.'] },
  { id: 'w-played-verbos12', type: 'write', level: 1,
    prompt: 'Say a sport you play.',
    constraints: [{ type: 'verbFormAny', inf: 'jugar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Juego al tenis los sábados.'] },

  { id: 't-paid-verbos13', type: 'translate', level: 2,
    prompt: 'Translate: “Yesterday I paid the bill.”',
    constraints: [{ type: 'verbFormAny', inf: 'pagar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer pagué la cuenta.'] },
  { id: 'w-broke-verbos13', type: 'write', level: 2,
    prompt: 'Say something you broke by accident.',
    constraints: [{ type: 'verbFormAny', inf: 'romper', tense: 'preterito' }],
    models: ['Rompí un vaso sin querer.'] },

  { id: 't-call-mother-verbos14', type: 'translate', level: 1,
    prompt: 'Translate: “I call my mother every Sunday.”',
    constraints: [{ type: 'verbFormAny', inf: 'llamar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Llamo a mi madre todos los domingos.'] },
  { id: 'w-discovered-verbos14', type: 'write', level: 2,
    prompt: 'Say something you discovered recently.',
    constraints: [{ type: 'verbFormAny', inf: 'descubrir', tense: 'preterito' }],
    models: ['Descubrí un restaurante nuevo cerca de casa.'] },

  { id: 't-need-time-verbos15', type: 'translate', level: 1,
    prompt: 'Translate: “I need more time.”',
    constraints: [{ type: 'verbFormAny', inf: 'necesitar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Necesito más tiempo.'] },
  { id: 'w-waited-verbos15', type: 'write', level: 2,
    prompt: 'Say how long you waited for something recently.',
    constraints: [{ type: 'verbFormAny', inf: 'esperar', tense: 'preterito' }],
    models: ['Esperé veinte minutos en la parada del autobús.'] },

  { id: 't-help-verbos16', type: 'translate', level: 1,
    prompt: 'Translate: “The teacher helps us a lot.”',
    constraints: [{ type: 'verbFormAny', inf: 'ayudar', tense: 'presente' }],
    models: ['El profesor nos ayuda mucho.'] },
  { id: 'w-like-verbos16', type: 'write', level: 1,
    prompt: 'Say something you like using “gustar”.',
    constraints: [{ type: 'verbFormAny', inf: 'gustar', tense: 'presente' }],
    models: ['Me gusta la fotografía.'] },

  { id: 't-finished-report-verbos17', type: 'translate', level: 2,
    prompt: 'Translate: “Yesterday I finished the report.”',
    constraints: [{ type: 'verbFormAny', inf: 'terminar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer terminé el informe.'] },
  { id: 'w-earn-verbos17', type: 'write', level: 1,
    prompt: 'Say what you do for a living and mention what you earn.',
    constraints: [{ type: 'verbFormAny', inf: 'ganar', tense: 'presente' }],
    models: ['Trabajo en una tienda y gano un buen sueldo.'] },

  { id: 't-traveled-verbos18', type: 'translate', level: 2,
    prompt: 'Translate: “Last summer we traveled to Italy.”',
    constraints: [{ type: 'verbFormAny', inf: 'viajar', tense: 'preterito' }, { type: 'containsWord', word: 'el verano pasado' }],
    models: ['El verano pasado viajamos a Italia.'] },
  { id: 'w-cook-verbos18', type: 'write', level: 1,
    prompt: 'Say what you like to cook.',
    constraints: [{ type: 'verbFormAny', inf: 'cocinar', tense: 'presente' }],
    models: ['Cocino pasta italiana los domingos.'] },

  // ==== verb-group lesson writing tasks (groups 19-27) ====
  { id: 't-understand-grammar-verbos19', type: 'translate', level: 1,
    prompt: 'Translate: “I understand Spanish grammar well.”',
    constraints: [{ type: 'verbFormAny', inf: 'comprender', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Comprendo bien la gramática española.'] },
  { id: 'w-sold-verbos19', type: 'write', level: 2,
    prompt: 'Say something you sold recently.',
    constraints: [{ type: 'verbFormAny', inf: 'vender', tense: 'preterito' }],
    models: ['Vendí mi bicicleta vieja.'] },

  { id: 't-receive-emails-verbos20', type: 'translate', level: 1,
    prompt: 'Translate: “I receive many emails every day.”',
    constraints: [{ type: 'verbFormAny', inf: 'recibir', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Recibo muchos correos cada día.'] },
  { id: 'w-decided-verbos20', type: 'write', level: 2,
    prompt: 'Say something you decided recently.',
    constraints: [{ type: 'verbFormAny', inf: 'decidir', tense: 'preterito' }],
    models: ['Decidí cambiar de trabajo.'] },

  { id: 't-breakfast-verbos21', type: 'translate', level: 1,
    prompt: 'Translate: “We have breakfast together every morning.”',
    constraints: [{ type: 'verbFormAny', inf: 'desayunar', tense: 'presente' }],
    models: ['Desayunamos juntos todas las mañanas.'] },
  { id: 'w-dinner-late-verbos21', type: 'write', level: 2,
    prompt: 'Say what time you had dinner yesterday.',
    constraints: [{ type: 'verbFormAny', inf: 'cenar', tense: 'preterito' }, { type: 'containsWord', word: 'ayer' }],
    models: ['Ayer cené a las diez de la noche.'] },

  { id: 't-prepare-dinner-verbos22', type: 'translate', level: 1,
    prompt: 'Translate: “I prepare dinner every Sunday.”',
    constraints: [{ type: 'verbFormAny', inf: 'preparar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Preparo la cena todos los domingos.'] },
  { id: 'w-invited-verbos22', type: 'write', level: 2,
    prompt: 'Say who you invited to your last celebration.',
    constraints: [{ type: 'verbFormAny', inf: 'invitar', tense: 'preterito' }],
    models: ['Invité a toda mi familia a la fiesta.'] },

  { id: 't-swim-verbos23', type: 'translate', level: 1,
    prompt: 'Translate: “I swim in the pool every summer.”',
    constraints: [{ type: 'verbFormAny', inf: 'nadar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Nado en la piscina todos los veranos.'] },
  { id: 'w-signed-verbos23', type: 'write', level: 2,
    prompt: 'Say something you signed recently.',
    constraints: [{ type: 'verbFormAny', inf: 'firmar', tense: 'preterito' }],
    models: ['Firmé el contrato del piso nuevo.'] },

  { id: 't-clean-house-verbos24', type: 'translate', level: 1,
    prompt: 'Translate: “We clean the house every Saturday.”',
    constraints: [{ type: 'verbFormAny', inf: 'limpiar', tense: 'presente' }],
    models: ['Limpiamos la casa todos los sábados.'] },
  { id: 'w-achieved-verbos24', type: 'write', level: 2,
    prompt: 'Say something you managed to achieve recently.',
    constraints: [{ type: 'verbFormAny', inf: 'lograr', tense: 'preterito' }],
    models: ['Logré terminar el proyecto a tiempo.'] },

  { id: 't-attend-class-verbos25', type: 'translate', level: 1,
    prompt: 'Translate: “We attend class every day.”',
    constraints: [{ type: 'verbFormAny', inf: 'asistir', tense: 'presente' }],
    models: ['Asistimos a clase todos los días.'] },
  { id: 'w-argued-verbos25', type: 'write', level: 2,
    prompt: 'Say what you argued about with someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'discutir', tense: 'preterito' }],
    models: ['Discutí con mi hermano sobre el coche.'] },

  { id: 't-share-flat-verbos26', type: 'translate', level: 1,
    prompt: 'Translate: “We share an apartment with two friends.”',
    constraints: [{ type: 'verbFormAny', inf: 'compartir', tense: 'presente' }],
    models: ['Compartimos piso con dos amigos.'] },
  { id: 'w-turned-age-verbos26', type: 'write', level: 2,
    prompt: 'Say how old you turned on your last birthday.',
    constraints: [{ type: 'verbFormAny', inf: 'cumplir', tense: 'preterito' }],
    models: ['Cumplí treinta años en marzo.'] },

  { id: 't-listen-music-verbos27', type: 'translate', level: 1,
    prompt: 'Translate: “I listen to music while I work.”',
    constraints: [{ type: 'verbFormAny', inf: 'escuchar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Escucho música mientras trabajo.'] },
  { id: 'w-admitted-verbos27', type: 'write', level: 2,
    prompt: 'Say something you admitted to someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'admitir', tense: 'preterito' }],
    models: ['Admití mi error frente a mi jefe.'] },

  // ==== verb-group lesson writing tasks (groups 28-37) ====
  { id: 't-save-money-verbos28', type: 'translate', level: 1,
    prompt: 'Translate: “I save a bit of money every month.”',
    constraints: [{ type: 'verbFormAny', inf: 'ahorrar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Ahorro un poco de dinero cada mes.'] },
  { id: 'w-rented-verbos28', type: 'write', level: 1,
    prompt: 'Say what you rent or would like to rent.',
    constraints: [{ type: 'verbFormAny', inf: 'alquilar', tense: 'presente' }],
    models: ['Alquilo un piso pequeño cerca del centro.'] },

  { id: 't-negotiate-verbos29', type: 'translate', level: 1,
    prompt: 'Translate: “We negotiate the price every time.”',
    constraints: [{ type: 'verbFormAny', inf: 'negociar', tense: 'presente' }],
    models: ['Negociamos el precio cada vez.'] },
  { id: 'w-hired-verbos29', type: 'write', level: 2,
    prompt: 'Say who your company hired recently.',
    constraints: [{ type: 'verbFormAny', inf: 'contratar', tense: 'preterito' }],
    models: ['La empresa contrató a una diseñadora nueva.'] },

  { id: 't-recycle-verbos30', type: 'translate', level: 1,
    prompt: 'Translate: “I recycle paper and plastic.”',
    constraints: [{ type: 'verbFormAny', inf: 'reciclar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Reciclo papel y plástico.'] },
  { id: 'w-installed-verbos30', type: 'write', level: 2,
    prompt: 'Say what program or app you installed recently.',
    constraints: [{ type: 'verbFormAny', inf: 'instalar', tense: 'preterito' }],
    models: ['Instalé una aplicación nueva para el trabajo.'] },

  { id: 't-rest-sundays-verbos31', type: 'translate', level: 1,
    prompt: 'Translate: “I rest on Sunday afternoons.”',
    constraints: [{ type: 'verbFormAny', inf: 'descansar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Descanso los domingos por la tarde.'] },
  { id: 'w-vaccinated-verbos31', type: 'write', level: 2,
    prompt: 'Say when you were last vaccinated.',
    constraints: [{ type: 'verbFormAny', inf: 'vacunar', tense: 'preterito' }],
    models: ['Me vacuné el mes pasado.'] },

  { id: 't-program-apps-verbos32', type: 'translate', level: 1,
    prompt: 'Translate: “I program apps for mobile phones.”',
    constraints: [{ type: 'verbFormAny', inf: 'programar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Programo aplicaciones para móviles.'] },
  { id: 'w-voted-verbos32', type: 'write', level: 2,
    prompt: 'Say what you voted for recently.',
    constraints: [{ type: 'verbFormAny', inf: 'votar', tense: 'preterito' }],
    models: ['Voté por el nuevo diseño del logo.'] },

  { id: 't-opinion-verbos33', type: 'translate', level: 1,
    prompt: 'Translate: “I think the project is good.”',
    constraints: [{ type: 'verbFormAny', inf: 'opinar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Opino que el proyecto es bueno.'] },
  { id: 'w-protested-verbos33', type: 'write', level: 2,
    prompt: 'Say what people protested about recently.',
    constraints: [{ type: 'verbFormAny', inf: 'protestar', tense: 'preterito' }],
    models: ['Los vecinos protestaron por el ruido.'] },

  { id: 't-wake-early-verbos34', type: 'translate', level: 1,
    prompt: 'Translate: “I get up early every Monday.”',
    constraints: [{ type: 'verbFormAny', inf: 'madrugar', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Madrugo todos los lunes.'] },
  { id: 'w-downloaded-verbos34', type: 'write', level: 2,
    prompt: 'Say what you downloaded recently.',
    constraints: [{ type: 'verbFormAny', inf: 'descargar', tense: 'preterito' }],
    models: ['Descargué una canción nueva ayer.'] },

  { id: 't-turn-on-light-verbos35', type: 'translate', level: 1,
    prompt: 'Translate: “I turn on the kitchen light.”',
    constraints: [{ type: 'verbFormAny', inf: 'encender', tense: 'presente' }, { type: 'person', person: 'yo' }],
    models: ['Enciendo la luz de la cocina.'] },
  { id: 'w-chose-verbos35', type: 'write', level: 2,
    prompt: 'Say what gift you chose for someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'elegir', tense: 'preterito' }],
    models: ['Elegí un libro para mi madre.'] },

  { id: 't-manage-team-verbos36', type: 'translate', level: 1,
    prompt: 'Translate: “She manages a team of ten people.”',
    constraints: [{ type: 'verbFormAny', inf: 'dirigir', tense: 'presente' }],
    models: ['Ella dirige un equipo de diez personas.'] },
  { id: 'w-sent-report-verbos36', type: 'write', level: 2,
    prompt: 'Say what you sent someone recently.',
    constraints: [{ type: 'verbFormAny', inf: 'enviar', tense: 'preterito' }],
    models: ['Envié un correo importante a mi jefa.'] },

  { id: 't-worth-verbos37', type: 'translate', level: 1,
    prompt: 'Translate: “This ring is not worth much money.”',
    constraints: [{ type: 'verbFormAny', inf: 'valer', tense: 'presente' }],
    models: ['Este anillo no vale mucho dinero.'] },
  { id: 'w-worth-future-verbos37', type: 'write', level: 3,
    prompt: 'Say what you think will be valuable in the future.',
    constraints: [{ type: 'verbFormAny', inf: 'valer', tense: 'futuro' }],
    models: ['Creo que este cuadro valdrá mucho en el futuro.'] },

  // ==== vocab-lesson writing tasks (chunks 1-9) ====
  { id: 'w-greeting-vocab1', type: 'write', level: 1,
    prompt: 'Greet someone and ask how they are, in Spanish.',
    constraints: [{ type: 'containsAny', words: ['hola', 'buenos días', 'buenas tardes'] }, { type: 'minWords', n: 3 }],
    models: ['Hola, ¿qué tal estás?'] },
  { id: 'w-thanks-sorry-vocab1', type: 'write', level: 1,
    prompt: 'Write a short exchange: thank someone and apologize for something.',
    constraints: [{ type: 'containsWord', word: 'gracias' }, { type: 'containsAny', words: ['perdón', 'lo siento'] }],
    models: ['Perdón por el retraso, y gracias por esperar.'] },

  { id: 'w-describe-family-vocab2', type: 'write', level: 1,
    prompt: 'Describe two members of your family (e.g. el padre, la hermana).',
    constraints: [{ type: 'containsAny', words: ['padre', 'madre', 'hermano', 'hermana', 'hijo', 'hija'] }, { type: 'minWords', n: 6 }],
    models: ['Mi padre es alto y mi hermana es muy simpática.'] },
  { id: 'w-friend-vocab2', type: 'write', level: 1,
    prompt: 'Say something about a friend, using “el amigo” or “la amiga”.',
    constraints: [{ type: 'containsAny', words: ['amigo', 'amiga'] }],
    models: ['Mi amiga vive cerca de mi casa.'] },

  { id: 'w-grandparents-vocab3', type: 'write', level: 1,
    prompt: 'Say something about your grandparents.',
    constraints: [{ type: 'containsAny', words: ['abuelo', 'abuela'] }],
    models: ['Mi abuelo cocina muy bien.'] },
  { id: 'w-boss-neighbor-vocab3', type: 'write', level: 1,
    prompt: 'Say something about your boss or a neighbor.',
    constraints: [{ type: 'containsAny', words: ['jefe', 'vecino'] }],
    models: ['Mi vecino es muy amable.'] },

  { id: 'w-grandchild-vocab4', type: 'write', level: 1,
    prompt: 'Say something about a grandchild (nieto/nieta) in a family you know.',
    constraints: [{ type: 'containsAny', words: ['nieto', 'nieta'] }],
    models: ['Mi nieta juega en el jardín todos los días.'] },
  { id: 'w-grandchild2-vocab4', type: 'write', level: 2,
    prompt: 'Say what a grandchild did last weekend.',
    constraints: [{ type: 'containsAny', words: ['nieto', 'nieta'] }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['El nieto llamó a sus abuelos el domingo pasado.'] },

  { id: 'w-breakfast-vocab5', type: 'write', level: 1,
    prompt: 'Describe what you eat for breakfast (mention at least two foods).',
    constraints: [{ type: 'containsAny', words: ['pan', 'huevo', 'fruta', 'leche', 'café'] }, { type: 'minWords', n: 6 }],
    models: ['Como pan con huevo y bebo café con leche.'] },
  { id: 'w-lunch-vocab5', type: 'write', level: 1,
    prompt: 'Say what meat or fish you prefer.',
    constraints: [{ type: 'containsAny', words: ['la carne', 'el pescado', 'el pollo'] }],
    models: ['Prefiero el pollo al pescado.'] },

  { id: 'w-dinner-drink-vocab6', type: 'write', level: 1,
    prompt: 'Say what you like to drink with dinner.',
    constraints: [{ type: 'containsAny', words: ['vino', 'cerveza'] }],
    models: ['Me gusta beber vino con la cena.'] },
  { id: 'w-meal-times-vocab6', type: 'write', level: 1,
    prompt: 'Say what your favorite meal of the day is (desayuno/almuerzo/cena).',
    constraints: [{ type: 'containsAny', words: ['el desayuno', 'el almuerzo', 'la cena'] }],
    models: ['Mi comida favorita es la cena.'] },

  { id: 'w-count-vocab7', type: 'write', level: 1,
    prompt: 'Say a number that is important to you.',
    constraints: [{ type: 'containsAny', words: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'] }, { type: 'minWords', n: 4 }],
    models: ['Mi número favorito es el siete.'] },
  { id: 'w-big-number-vocab7', type: 'write', level: 1,
    prompt: 'Say something that costs around a hundred or a thousand (euros/dollars).',
    constraints: [{ type: 'containsAny', words: ['cien', 'mil'] }],
    models: ['Ese ordenador cuesta casi mil euros.'] },

  { id: 'w-order-vocab8', type: 'write', level: 1,
    prompt: 'Say something about being first or last at something.',
    constraints: [{ type: 'containsAny', words: ['primero', 'último'] }],
    models: ['Siempre soy el último en llegar a clase.'] },
  { id: 'w-order2-vocab8', type: 'write', level: 2,
    prompt: 'Say who arrived first or last somewhere yesterday.',
    constraints: [{ type: 'containsAny', words: ['primero', 'último'] }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['Ayer llegué el primero a la reunión.'] },

  { id: 'w-today-tomorrow-vocab9', type: 'write', level: 1,
    prompt: 'Say what you are doing today and tomorrow.',
    constraints: [{ type: 'containsAny', words: ['hoy', 'mañana'] }, { type: 'minWords', n: 6 }],
    models: ['Hoy trabajo y mañana descanso todo el día.'] },
  { id: 'w-always-never-vocab9', type: 'write', level: 1,
    prompt: 'Say something you always do and something you never do.',
    constraints: [{ type: 'containsWord', word: 'siempre' }, { type: 'containsWord', word: 'nunca' }],
    models: ['Siempre desayuno bien, pero nunca ceno tarde.'] },

  // ==== vocab-lesson writing tasks (chunks 10-18) ====
  { id: 'w-favorite-color-vocab10', type: 'write', level: 1,
    prompt: 'Say your favorite color and why.',
    constraints: [{ type: 'containsAny', words: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris', 'naranja', 'rosa', 'marrón'] }, { type: 'minWords', n: 4 }],
    models: ['Mi color favorito es el azul.'] },
  { id: 'w-describe-object-color-vocab10', type: 'write', level: 1,
    prompt: 'Describe an object using two colors.',
    constraints: [{ type: 'containsAny', words: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco'] }, { type: 'minWords', n: 5 }],
    models: ['Mi coche es blanco y negro.'] },

  { id: 'w-city-country-vocab11', type: 'write', level: 1,
    prompt: 'Say what city and country you live in.',
    constraints: [{ type: 'containsAny', words: ['ciudad', 'país'] }],
    models: ['Vivo en una ciudad grande en otro país.'] },
  { id: 'w-errands-vocab11', type: 'write', level: 1,
    prompt: 'Say two places you go to run errands (mercado, tienda, banco...).',
    constraints: [{ type: 'containsAny', words: ['mercado', 'tienda', 'escuela', 'restaurante', 'hospital'] }, { type: 'minWords', n: 6 }],
    models: ['Voy al mercado y después a la tienda.'] },

  { id: 'w-weekend-places-vocab12', type: 'write', level: 1,
    prompt: 'Say where you like to go on weekends.',
    constraints: [{ type: 'containsAny', words: ['parque', 'museo', 'cine', 'biblioteca'] }],
    models: ['Me gusta ir al parque los domingos.'] },
  { id: 'w-errands2-vocab12', type: 'write', level: 1,
    prompt: 'Say what you buy at the bakery or supermarket.',
    constraints: [{ type: 'containsAny', words: ['panadería', 'supermercado'] }],
    models: ['Compro pan en la panadería.'] },

  { id: 'w-describe-room-vocab13', type: 'write', level: 1,
    prompt: 'Describe your bedroom or kitchen (mention two things in it).',
    constraints: [{ type: 'containsAny', words: ['habitación', 'cocina', 'cama', 'mesa', 'silla', 'ventana'] }, { type: 'minWords', n: 6 }],
    models: ['Mi habitación tiene una cama y una ventana grande.'] },
  { id: 'w-keys-phone-vocab13', type: 'write', level: 1,
    prompt: 'Say something you often lose (keys, phone...).',
    constraints: [{ type: 'containsAny', words: ['llave', 'teléfono'] }],
    models: ['Siempre pierdo las llaves de casa.'] },

  { id: 'w-money-clothes-vocab14', type: 'write', level: 1,
    prompt: 'Say something about money or clothes.',
    constraints: [{ type: 'containsAny', words: ['dinero', 'ropa'] }],
    models: ['Necesito comprar ropa nueva.'] },
  { id: 'w-neighborhood-vocab14', type: 'write', level: 1,
    prompt: 'Say something about your neighborhood.',
    constraints: [{ type: 'containsWord', word: 'vecindario' }],
    models: ['Mi vecindario es muy tranquilo.'] },

  { id: 'w-body-part-vocab15', type: 'write', level: 1,
    prompt: 'Say what hurts (use a body part) with “me duele”.',
    constraints: [{ type: 'containsAny', words: ['cabeza', 'mano', 'pie', 'brazo', 'pierna'] }],
    models: ['Me duele la cabeza hoy.'] },
  { id: 'w-heart-eyes-vocab15', type: 'write', level: 1,
    prompt: "Describe someone's eyes or say something about the heart.",
    constraints: [{ type: 'containsAny', words: ['ojo', 'corazón'] }],
    models: ['Tiene los ojos muy bonitos.'] },

  { id: 'w-weather-nature-vocab16', type: 'write', level: 1,
    prompt: 'Describe the weather using the sun, wind, or rain.',
    constraints: [{ type: 'containsAny', words: ['sol', 'viento', 'lluvia'] }],
    models: ['Hoy hace sol y no hay viento.'] },
  { id: 'w-sky-sea-vocab16', type: 'write', level: 1,
    prompt: 'Describe the sky or the sea right now.',
    constraints: [{ type: 'containsAny', words: ['cielo', 'mar'] }],
    models: ['El cielo está muy azul hoy.'] },

  { id: 'w-compare-things-vocab17', type: 'write', level: 1,
    prompt: 'Compare two things using opposite adjectives (grande/pequeño, caro/barato...).',
    constraints: [{ type: 'containsAny', words: ['grande', 'pequeño', 'caro', 'barato', 'fácil', 'difícil'] }, { type: 'minWords', n: 6 }],
    models: ['Este piso es pequeño pero barato.'] },
  { id: 'w-new-old-vocab17', type: 'write', level: 1,
    prompt: 'Say if you prefer new or old things.',
    constraints: [{ type: 'containsAny', words: ['nuevo', 'viejo'] }],
    models: ['Prefiero los coches nuevos.'] },

  { id: 'w-fast-slow-vocab18', type: 'write', level: 1,
    prompt: 'Say if you are fast or slow at something.',
    constraints: [{ type: 'containsAny', words: ['rápido', 'lento'] }],
    models: ['Soy muy rápido corriendo.'] },
  { id: 'w-feelings-vocab18', type: 'write', level: 1,
    prompt: 'Say if you feel happy or sad today.',
    constraints: [{ type: 'containsAny', words: ['feliz', 'triste'] }],
    models: ['Hoy estoy muy feliz.'] },

  // ==== vocab-lesson writing tasks (chunks 19-27) ====
  { id: 'w-ask-question-vocab19', type: 'write', level: 1,
    prompt: 'Write a question asking where someone lives.',
    constraints: [{ type: 'question' }, { type: 'containsWord', word: 'dónde' }],
    models: ['¿Dónde vives?'] },
  { id: 'w-ask-why-vocab19', type: 'write', level: 1,
    prompt: 'Write a question asking why someone is late.',
    constraints: [{ type: 'question' }, { type: 'containsWord', word: 'por qué' }],
    models: ['¿Por qué llegas tarde?'] },

  { id: 'w-contrast-vocab20', type: 'write', level: 1,
    prompt: 'Write a sentence contrasting two things using “pero” or “aunque”.',
    constraints: [{ type: 'containsAny', words: ['pero', 'aunque'] }, { type: 'minWords', n: 6 }],
    models: ['Me gusta el café, aunque prefiero el té.'] },
  { id: 'w-reason-vocab20', type: 'write', level: 1,
    prompt: 'Give a reason for something using “porque”.',
    constraints: [{ type: 'containsWord', word: 'porque' }],
    models: ['Estudio español porque quiero viajar.'] },

  { id: 'w-nearby-far-vocab21', type: 'write', level: 1,
    prompt: 'Say something that is near and something that is far.',
    constraints: [{ type: 'containsWord', word: 'cerca' }, { type: 'containsWord', word: 'lejos' }],
    models: ['Mi casa está cerca, pero mi trabajo está lejos.'] },
  { id: 'w-quantity-vocab21', type: 'write', level: 1,
    prompt: 'Say how much of something you have (mucho/poco).',
    constraints: [{ type: 'containsAny', words: ['mucho', 'poco'] }],
    models: ['Tengo mucho tiempo libre hoy.'] },

  { id: 'w-nobody-something-vocab22', type: 'write', level: 1,
    prompt: 'Say that nobody is home, using “nadie”.',
    constraints: [{ type: 'containsWord', word: 'nadie' }],
    models: ['No hay nadie en casa.'] },
  { id: 'w-someone-something-vocab22', type: 'write', level: 1,
    prompt: 'Say that someone or something is in the room, using “alguien” or “algo”.',
    constraints: [{ type: 'containsAny', words: ['alguien', 'algo'] }],
    models: ['Hay alguien en la puerta.'] },

  { id: 'w-school-supplies-vocab23', type: 'write', level: 1,
    prompt: 'Say what you have in your backpack or on your desk.',
    constraints: [{ type: 'containsAny', words: ['mochila', 'cuaderno', 'bolígrafo', 'lápiz', 'escritorio'] }, { type: 'minWords', n: 6 }],
    models: ['En mi mochila tengo un cuaderno y un bolígrafo.'] },
  { id: 'w-whiteboard-vocab23', type: 'write', level: 1,
    prompt: 'Say what the teacher writes on the board.',
    constraints: [{ type: 'containsWord', word: 'pizarra' }],
    models: ['La profesora escribe la fecha en la pizarra.'] },

  { id: 'w-symptoms-vocab24', type: 'write', level: 1,
    prompt: 'Say a symptom you have (dolor, fiebre, gripe...).',
    constraints: [{ type: 'containsAny', words: ['dolor', 'fiebre', 'gripe', 'estrés', 'ansiedad'] }],
    models: ['Tengo dolor de cabeza hoy.'] },
  { id: 'w-doctor-visit-vocab24', type: 'write', level: 1,
    prompt: 'Say you have an appointment with the doctor or dentist.',
    constraints: [{ type: 'containsAny', words: ['cita médica', 'dentista', 'farmacia'] }],
    models: ['Tengo una cita médica mañana con el dentista.'] },

  { id: 'w-checkup-vocab25', type: 'write', level: 1,
    prompt: 'Say when your next checkup is.',
    constraints: [{ type: 'containsWord', word: 'chequeo' }],
    models: ['El próximo chequeo es en tres meses.'] },
  { id: 'w-checkup2-vocab25', type: 'write', level: 1,
    prompt: 'Say why regular checkups are important.',
    constraints: [{ type: 'containsWord', word: 'chequeo' }, { type: 'minWords', n: 5 }],
    models: ['El chequeo anual ayuda a prevenir problemas graves.'] },

  { id: 'w-price-discount-vocab26', type: 'write', level: 1,
    prompt: 'Say something is on sale or has a discount.',
    constraints: [{ type: 'containsAny', words: ['oferta', 'descuento', 'precio'] }],
    models: ['Esta chaqueta tiene un buen descuento.'] },
  { id: 'w-brand-vocab26', type: 'write', level: 1,
    prompt: 'Say what your favorite brand is.',
    constraints: [{ type: 'containsWord', word: 'marca' }],
    models: ['Mi marca favorita de ropa es esta.'] },

  { id: 'w-sport-play-vocab27', type: 'write', level: 1,
    prompt: 'Say what sport you play and with whom.',
    constraints: [{ type: 'containsAny', words: ['fútbol', 'baloncesto', 'tenis', 'natación'] }, { type: 'minWords', n: 5 }],
    models: ['Juego al fútbol con mis amigos los sábados.'] },
  { id: 'w-gym-team-vocab27', type: 'write', level: 1,
    prompt: 'Say something about your gym or team.',
    constraints: [{ type: 'containsAny', words: ['gimnasio', 'equipo'] }],
    models: ['Voy al gimnasio tres veces por semana.'] },

  // ==== vocab-lesson writing tasks (time2, adj3, travel, weather, clothing, animals, kitchen, work, tech1) ====
  { id: 'w-weekday-vocab-time2', type: 'write', level: 1,
    prompt: 'Say what day of the week it is today.',
    constraints: [{ type: 'containsAny', words: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] }],
    models: ['Hoy es viernes.'] },
  { id: 'w-early-late-vocab-time2', type: 'write', level: 1,
    prompt: 'Say if you usually arrive early or late.',
    constraints: [{ type: 'containsAny', words: ['temprano', 'tarde'] }],
    models: ['Normalmente llego temprano al trabajo.'] },

  { id: 'w-nervous-calm-vocab-adj3', type: 'write', level: 1,
    prompt: 'Say if you feel nervous or calm before an exam.',
    constraints: [{ type: 'containsAny', words: ['nervioso', 'tranquilo'] }],
    models: ['Estoy muy tranquilo antes de los exámenes.'] },
  { id: 'w-grateful-excited-vocab-adj3', type: 'write', level: 1,
    prompt: 'Say something you feel grateful or excited about.',
    constraints: [{ type: 'containsAny', words: ['agradecido', 'emocionado'] }],
    models: ['Estoy muy agradecido por mi familia.'] },

  { id: 'w-transport-vocab-travel', type: 'write', level: 1,
    prompt: 'Say how you prefer to travel (car, train, plane...).',
    constraints: [{ type: 'containsAny', words: ['coche', 'tren', 'avión', 'autobús'] }],
    models: ['Prefiero viajar en tren.'] },
  { id: 'w-suitcase-vocab-travel', type: 'write', level: 1,
    prompt: 'Say what you pack in your suitcase for a trip.',
    constraints: [{ type: 'containsAny', words: ['maleta', 'billete', 'hotel'] }],
    models: ['Meto mucha ropa en la maleta.'] },

  { id: 'w-storm-vocab-weather', type: 'write', level: 1,
    prompt: 'Describe a storm or foggy day.',
    constraints: [{ type: 'containsAny', words: ['tormenta', 'niebla', 'nieve'] }],
    models: ['Hoy hay mucha niebla por la mañana.'] },
  { id: 'w-clouds-vocab-weather', type: 'write', level: 1,
    prompt: 'Say something about the clouds today.',
    constraints: [{ type: 'containsWord', word: 'nube' }],
    models: ['El cielo está lleno de nubes.'] },

  { id: 'w-outfit-vocab-clothing', type: 'write', level: 1,
    prompt: 'Describe what you are wearing today (mention two items).',
    constraints: [{ type: 'containsAny', words: ['camisa', 'pantalones', 'vestido', 'zapatos', 'abrigo'] }, { type: 'minWords', n: 6 }],
    models: ['Llevo una camisa azul y pantalones negros.'] },
  { id: 'w-coat-vocab-clothing', type: 'write', level: 1,
    prompt: 'Say when you wear a coat.',
    constraints: [{ type: 'containsWord', word: 'abrigo' }],
    models: ['Llevo abrigo cuando hace mucho frío.'] },

  { id: 'w-pet-vocab-animals', type: 'write', level: 1,
    prompt: 'Say what pet you have or would like to have.',
    constraints: [{ type: 'containsAny', words: ['perro', 'gato', 'pájaro'] }],
    models: ['Tengo un perro y un gato en casa.'] },
  { id: 'w-farm-animal-vocab-animals', type: 'write', level: 1,
    prompt: 'Say a farm animal you like.',
    constraints: [{ type: 'containsAny', words: ['vaca', 'caballo', 'oveja'] }],
    models: ['Me gustan mucho los caballos.'] },

  { id: 'w-cooking-tools-vocab-kitchen', type: 'write', level: 1,
    prompt: 'Say what kitchen tool you use to cook.',
    constraints: [{ type: 'containsAny', words: ['sartén', 'cuchillo', 'cuchara', 'tenedor'] }],
    models: ['Uso la sartén para cocinar huevos.'] },
  { id: 'w-set-table-vocab-kitchen', type: 'write', level: 1,
    prompt: 'Say what you put on the table to eat.',
    constraints: [{ type: 'containsAny', words: ['plato', 'cuchara', 'tenedor'] }, { type: 'minWords', n: 5 }],
    models: ['Pongo un plato y un tenedor en la mesa.'] },

  { id: 'w-meeting-vocab-work', type: 'write', level: 1,
    prompt: 'Say when your next meeting is.',
    constraints: [{ type: 'containsWord', word: 'reunión' }],
    models: ['Mi próxima reunión es mañana.'] },
  { id: 'w-project-report-vocab-work', type: 'write', level: 1,
    prompt: 'Say what project or report you are working on.',
    constraints: [{ type: 'containsAny', words: ['proyecto', 'informe'] }],
    models: ['Trabajo en un proyecto nuevo esta semana.'] },

  { id: 'w-computer-vocab-tech1', type: 'write', level: 1,
    prompt: 'Say what you use your computer or phone for.',
    constraints: [{ type: 'containsAny', words: ['ordenador', 'móvil', 'aplicación'] }, { type: 'minWords', n: 5 }],
    models: ['Uso el ordenador para trabajar y el móvil para hablar.'] },
  { id: 'w-password-vocab-tech1', type: 'write', level: 1,
    prompt: 'Say something about passwords or wifi.',
    constraints: [{ type: 'containsAny', words: ['contraseña', 'wifi'] }],
    models: ['Siempre olvido mi contraseña.'] },

  // ==== vocab-lesson writing tasks (tech2, finance1/2, career1/2, professions, relationships, society, bureaucracy) ====
  { id: 'w-video-call-vocab-tech2', type: 'write', level: 1,
    prompt: 'Say something about a video call you had or will have.',
    constraints: [{ type: 'containsWord', word: 'videollamada' }],
    models: ['Tengo una videollamada con mi familia el domingo.'] },
  { id: 'w-privacy-vocab-tech2', type: 'write', level: 1,
    prompt: 'Say something about online privacy.',
    constraints: [{ type: 'containsAny', words: ['privacidad', 'datos personales'] }],
    models: ['Me preocupa mucho la privacidad en internet.'] },

  { id: 'w-monthly-bills-vocab-fin1', type: 'write', level: 1,
    prompt: 'Say what bills or expenses you pay each month.',
    constraints: [{ type: 'containsAny', words: ['alquiler', 'hipoteca', 'factura'] }, { type: 'minWords', n: 5 }],
    models: ['Pago el alquiler y las facturas cada mes.'] },
  { id: 'w-savings-vocab-fin1', type: 'write', level: 1,
    prompt: 'Say something about your savings or budget.',
    constraints: [{ type: 'containsAny', words: ['ahorro', 'presupuesto'] }],
    models: ['Tengo un presupuesto estricto cada mes.'] },

  { id: 'w-income-tax-vocab-fin2', type: 'write', level: 1,
    prompt: 'Say something about income tax.',
    constraints: [{ type: 'containsWord', word: 'impuesto sobre la renta' }],
    models: ['Pago el impuesto sobre la renta cada año.'] },
  { id: 'w-income-tax2-vocab-fin2', type: 'write', level: 2,
    prompt: 'Say when you last paid income tax.',
    constraints: [{ type: 'containsWord', word: 'impuesto sobre la renta' }, { type: 'anyVerbInTense', tense: 'preterito' }],
    models: ['Pagué el impuesto sobre la renta el mes pasado.'] },

  { id: 'w-job-search-vocab-career1', type: 'write', level: 1,
    prompt: 'Say what you look for in a job (horario, sueldo...).',
    constraints: [{ type: 'containsAny', words: ['horario', 'sueldo', 'contrato'] }],
    models: ['Busco un buen horario y un sueldo justo.'] },
  { id: 'w-company-vocab-career1', type: 'write', level: 1,
    prompt: 'Say something about the company you work for.',
    constraints: [{ type: 'containsWord', word: 'empresa' }],
    models: ['Mi empresa es pequeña pero muy buena.'] },

  { id: 'w-remote-work-vocab-career2', type: 'write', level: 1,
    prompt: 'Say if you prefer remote work or the office.',
    constraints: [{ type: 'containsWord', word: 'teletrabajo' }],
    models: ['Prefiero el teletrabajo a ir a la oficina.'] },
  { id: 'w-training-vocab-career2', type: 'write', level: 1,
    prompt: 'Say something about your training or education.',
    constraints: [{ type: 'containsAny', words: ['formación', 'especialización', 'maestría'] }],
    models: ['Tengo una formación en marketing digital.'] },

  { id: 'w-profession-vocab-professions', type: 'write', level: 1,
    prompt: 'Say what profession you have or would like to have.',
    constraints: [{ type: 'containsAny', words: ['médico', 'profesor', 'abogado', 'ingeniero', 'cocinero'] }],
    models: ['Me gustaría ser ingeniero algún día.'] },
  { id: 'w-waiter-police-vocab-professions', type: 'write', level: 1,
    prompt: 'Say something about a waiter or police officer.',
    constraints: [{ type: 'containsAny', words: ['camarero', 'policía'] }],
    models: ['El camarero de ese restaurante es muy amable.'] },

  { id: 'w-couple-vocab-relationships', type: 'write', level: 1,
    prompt: 'Say something about a couple you know (married, dating...).',
    constraints: [{ type: 'containsAny', words: ['pareja', 'matrimonio', 'boda'] }],
    models: ['Mi pareja y yo vivimos juntos desde hace un año.'] },
  { id: 'w-family-life-vocab-relationships', type: 'write', level: 2,
    prompt: 'Say something about raising children or starting a family.',
    constraints: [{ type: 'containsWord', word: 'crianza' }],
    models: ['La crianza de mis hijos me hizo más paciente.'] },

  { id: 'w-environment-vocab-society', type: 'write', level: 1,
    prompt: 'Say something about the environment or climate change.',
    constraints: [{ type: 'containsAny', words: ['medio ambiente', 'cambio climático', 'contaminación'] }],
    models: ['Me preocupa mucho el cambio climático.'] },
  { id: 'w-news-vocab-society', type: 'write', level: 1,
    prompt: 'Say something you saw in the news recently.',
    constraints: [{ type: 'containsWord', word: 'noticias' }],
    models: ['Vi las noticias esta mañana sobre política.'] },

  { id: 'w-paperwork-vocab-bureaucracy', type: 'write', level: 1,
    prompt: 'Say something about paperwork or documents you need.',
    constraints: [{ type: 'containsAny', words: ['trámite', 'documento'] }],
    models: ['Necesito hacer un trámite en el ayuntamiento.'] },
  { id: 'w-identity-vocab-bureaucracy', type: 'write', level: 1,
    prompt: 'Say something about your identity documents or nationality.',
    constraints: [{ type: 'containsAny', words: ['identidad', 'nacionalidad'] }],
    models: ['Mi nacionalidad es española.'] },

  // ==== grammar-lesson anchor writing tasks (ser-estar, por-para, preterite-imperfect, gender-articles) ====
  { id: 't-ser-estar-anchor', type: 'translate', level: 1,
    prompt: 'Translate: “My brother is a doctor and is very busy today.”',
    constraints: [{ type: 'verbFormAny', inf: 'ser', tense: 'presente' }, { type: 'verbFormAny', inf: 'estar', tense: 'presente' }],
    models: ['Mi hermano es médico y está muy ocupado hoy.'] },

  { id: 'w-por-para-anchor', type: 'write', level: 2,
    prompt: 'Write a sentence using both “por” and “para”.',
    constraints: [{ type: 'containsWord', word: 'por' }, { type: 'containsWord', word: 'para' }, { type: 'minWords', n: 6 }],
    models: ['Trabajo por la mañana para ganar dinero extra.'] },

  { id: 'w-pretimp-anchor', type: 'write', level: 2,
    prompt: 'Tell a short story: describe the background (imperfect) and one event that happened (preterite).',
    constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 10 }],
    models: ['Yo dormía tranquilamente en mi cama cuando mi hermano llegó a casa esta mañana.'] },

  { id: 'w-gender-anchor', type: 'write', level: 1,
    prompt: 'Describe three objects around you with their correct article (el/la).',
    constraints: [{ type: 'minWords', n: 6 }],
    models: ['Veo el libro, la ventana y el reloj de la habitación.'] }

];
