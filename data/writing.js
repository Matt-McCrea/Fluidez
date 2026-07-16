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
    models: ['¡Ven a la fiesta esta noche!', 'Habla con ella mañana.'] }

];
