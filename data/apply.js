/* ============================================================================
 * APPLY ITEMS — the "Aplicar" stage: grammar used *in context*, not in a table.
 * This is the bridge our drills were missing — you pick the right form from the
 * meaning of the sentence, not from a label.
 *
 *   cloze     : fill the blank with the right form of `inf` in `tense`/`person`.
 *               The ANSWER IS COMPUTED BY THE ENGINE at runtime, so it can never
 *               drift from the conjugation tables. `text` uses ___ for the gap.
 *   transform : rewrite `from` per `instruction`; `to` is the expected answer.
 * `en` = English gloss (shown after answering).
 * `level` gates when the item can appear (see SYLLABUS in js/lessons.js):
 *   1 presente/ser-estar · 2 pasado · 3 futuro/condicional/perfecto ·
 *   4 subjuntivo/imperativo · 5 late compounds
 * ========================================================================== */
window.APPLY_ITEMS = [

  { type: 'cloze', level: 2, text: 'Ayer yo ___ (comer) paella con mis amigos.', inf: 'comer', tense: 'preterito', person: 'yo', en: 'Yesterday I ate paella with my friends.' },
  { type: 'cloze', level: 1, text: 'Normalmente nosotros ___ (hablar) español en casa.', inf: 'hablar', tense: 'presente', person: 'nosotros', en: 'We normally speak Spanish at home.' },
  { type: 'cloze', level: 2, text: 'Cuando era niña, ella ___ (vivir) en Madrid.', inf: 'vivir', tense: 'imperfecto', person: 'él/ella', en: 'When she was a girl, she lived in Madrid.' },
  { type: 'cloze', level: 3, text: 'Mañana ellos ___ (viajar) a Francia.', inf: 'viajar', tense: 'futuro', person: 'ellos', en: 'Tomorrow they will travel to France.' },
  { type: 'cloze', level: 4, text: 'Espero que tú ___ (venir) a la fiesta.', inf: 'venir', tense: 'presubj', person: 'tú', en: 'I hope (that) you come to the party.' },
  { type: 'cloze', level: 2, text: 'Anoche nosotros ___ (ir) al cine.', inf: 'ir', tense: 'preterito', person: 'nosotros', en: 'Last night we went to the cinema.' },
  { type: 'cloze', level: 1, text: 'Ahora mismo yo ___ (estar) en el trabajo.', inf: 'estar', tense: 'presente', person: 'yo', en: 'Right now I am at work.' },
  { type: 'cloze', level: 1, text: 'Yo ___ (ser) profesor de matemáticas.', inf: 'ser', tense: 'presente', person: 'yo', en: 'I am a maths teacher.' },
  { type: 'cloze', level: 2, text: 'De pequeño, tú siempre ___ (jugar) en el parque.', inf: 'jugar', tense: 'imperfecto', person: 'tú', en: 'As a child, you always played in the park.' },
  { type: 'cloze', level: 2, text: 'El año pasado nosotros ___ (comprar) una casa.', inf: 'comprar', tense: 'preterito', person: 'nosotros', en: 'Last year we bought a house.' },
  { type: 'cloze', level: 3, text: 'Mañana yo ___ (hacer) la cena para todos.', inf: 'hacer', tense: 'futuro', person: 'yo', en: 'Tomorrow I will make dinner for everyone.' },
  { type: 'cloze', level: 2, text: 'Ellos ___ (escribir) muchas cartas el mes pasado.', inf: 'escribir', tense: 'preterito', person: 'ellos', en: 'They wrote many letters last month.' },
  { type: 'cloze', level: 4, text: 'Quiero que él ___ (decir) la verdad.', inf: 'decir', tense: 'presubj', person: 'él/ella', en: 'I want him to tell the truth.' },
  { type: 'cloze', level: 1, text: 'Vosotros ___ (beber) demasiado café por la mañana.', inf: 'beber', tense: 'presente', person: 'vosotros', en: 'You all drink too much coffee in the morning.' },
  { type: 'cloze', level: 3, text: 'Ella ya ___ (terminar) el trabajo.', inf: 'terminar', tense: 'perfecto', person: 'él/ella', en: 'She has already finished the work.' },
  { type: 'cloze', level: 4, text: 'Si yo ___ (tener) más tiempo, viajaría más.', inf: 'tener', tense: 'impsubj', person: 'yo', en: 'If I had more time, I would travel more.' },

  { type: 'transform', level: 2, instruction: 'Rewrite in the preterite (a finished past event):', from: 'Yo como paella.', to: 'Yo comí paella.', en: 'I ate paella.' },
  { type: 'transform', level: 1, instruction: 'Change the subject to nosotros:', from: 'Yo vivo en España.', to: 'Nosotros vivimos en España.', en: 'We live in Spain.' },
  { type: 'transform', level: 1, instruction: 'Make it negative:', from: 'Quiero café.', to: 'No quiero café.', en: 'I don\'t want coffee.' },
  { type: 'transform', level: 2, instruction: 'Rewrite in the imperfect (a past habit/background):', from: 'Ella vive en Madrid.', to: 'Ella vivía en Madrid.', en: 'She used to live in Madrid.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the future:', from: 'Nosotros hablamos con el jefe.', to: 'Nosotros hablaremos con el jefe.', en: 'We will speak with the boss.' },

  // ---- level 1: presente ----
  { type: 'cloze', level: 1, text: 'Tú ___ (trabajar) en un hospital, ¿verdad?', inf: 'trabajar', tense: 'presente', person: 'tú', en: 'You work in a hospital, right?' },
  { type: 'cloze', level: 1, text: 'Mi hermano ___ (vivir) en Barcelona ahora mismo.', inf: 'vivir', tense: 'presente', person: 'él/ella', en: 'My brother lives in Barcelona right now.' },
  { type: 'cloze', level: 1, text: 'Todos los días nosotros ___ (comer) verduras frescas.', inf: 'comer', tense: 'presente', person: 'nosotros', en: 'Every day we eat fresh vegetables.' },
  { type: 'cloze', level: 1, text: 'Vosotros siempre ___ (estudiar) por la noche.', inf: 'estudiar', tense: 'presente', person: 'vosotros', en: 'You all always study at night.' },
  { type: 'cloze', level: 1, text: 'Los niños ___ (jugar) en el parque todos los sábados.', inf: 'jugar', tense: 'presente', person: 'ellos', en: 'The children play in the park every Saturday.' },
  { type: 'cloze', level: 1, text: 'Yo ___ (ser) ingeniera y trabajo en Madrid.', inf: 'ser', tense: 'presente', person: 'yo', en: 'I am an engineer and I work in Madrid.' },
  { type: 'cloze', level: 1, text: 'Ahora mismo, mi madre ___ (estar) en el mercado.', inf: 'estar', tense: 'presente', person: 'él/ella', en: 'Right now, my mother is at the market.' },
  { type: 'cloze', level: 1, text: '¿Cuántos años ___ (tener) tú?', inf: 'tener', tense: 'presente', person: 'tú', en: 'How old are you?' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (querer) viajar a Italia este año.', inf: 'querer', tense: 'presente', person: 'nosotros', en: 'We want to travel to Italy this year.' },
  { type: 'cloze', level: 1, text: 'Mis abuelos ___ (vivir) cerca de la playa.', inf: 'vivir', tense: 'presente', person: 'ellos', en: 'My grandparents live near the beach.' },
  { type: 'cloze', level: 1, text: 'Normalmente yo ___ (necesitar) ocho horas de sueño.', inf: 'necesitar', tense: 'presente', person: 'yo', en: 'I normally need eight hours of sleep.' },
  { type: 'cloze', level: 1, text: '¿Qué ___ (hacer) vosotros los domingos?', inf: 'hacer', tense: 'presente', person: 'vosotros', en: 'What do you all do on Sundays?' },

  // ---- level 2: preterito ----
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (comprar) un regalo para mi hermana.', inf: 'comprar', tense: 'preterito', person: 'yo', en: 'Yesterday I bought a gift for my sister.' },
  { type: 'cloze', level: 2, text: '¿A qué hora ___ (llegar) tú anoche?', inf: 'llegar', tense: 'preterito', person: 'tú', en: 'What time did you arrive last night?' },
  { type: 'cloze', level: 2, text: 'El mes pasado, mi jefe ___ (hacer) un viaje a Japón.', inf: 'hacer', tense: 'preterito', person: 'él/ella', en: 'Last month, my boss took a trip to Japan.' },
  { type: 'cloze', level: 2, text: 'La semana pasada nosotros ___ (ver) una película muy buena.', inf: 'ver', tense: 'preterito', person: 'nosotros', en: 'Last week we saw a very good movie.' },
  { type: 'cloze', level: 2, text: '¿A qué hora ___ (salir) vosotros de la fiesta?', inf: 'salir', tense: 'preterito', person: 'vosotros', en: 'What time did you all leave the party?' },
  { type: 'cloze', level: 2, text: 'Mis padres ___ (decir) la verdad ayer por la noche.', inf: 'decir', tense: 'preterito', person: 'ellos', en: 'My parents told the truth yesterday at night.' },
  { type: 'cloze', level: 2, text: 'El lunes pasado yo ___ (empezar) un curso de cocina.', inf: 'empezar', tense: 'preterito', person: 'yo', en: 'Last Monday I started a cooking class.' },

  // ---- level 2: imperfecto ----
  { type: 'cloze', level: 2, text: 'De niño, yo ___ (ser) muy tímido.', inf: 'ser', tense: 'imperfecto', person: 'yo', en: 'As a child, I was very shy.' },
  { type: 'cloze', level: 2, text: 'Cuando eras pequeño, ¿dónde ___ (vivir) tú?', inf: 'vivir', tense: 'imperfecto', person: 'tú', en: 'When you were little, where did you live?' },
  { type: 'cloze', level: 2, text: 'Mi abuelo ___ (trabajar) en el campo todos los veranos.', inf: 'trabajar', tense: 'imperfecto', person: 'él/ella', en: 'My grandfather used to work in the fields every summer.' },
  { type: 'cloze', level: 2, text: 'De niños, nosotros ___ (jugar) en la calle todas las tardes.', inf: 'jugar', tense: 'imperfecto', person: 'nosotros', en: 'As children, we used to play in the street every afternoon.' },
  { type: 'cloze', level: 2, text: 'Antes, vosotros ___ (estudiar) juntos los fines de semana.', inf: 'estudiar', tense: 'imperfecto', person: 'vosotros', en: 'Before, you all used to study together on weekends.' },
  { type: 'cloze', level: 2, text: 'Mis tíos ___ (tener) una tienda pequeña hace muchos años.', inf: 'tener', tense: 'imperfecto', person: 'ellos', en: 'My aunt and uncle had a small shop many years ago.' },
  { type: 'cloze', level: 2, text: 'Cuando era joven, yo siempre ___ (querer) ser médico.', inf: 'querer', tense: 'imperfecto', person: 'yo', en: 'When I was young, I always wanted to be a doctor.' },

  // ---- level 3: futuro ----
  { type: 'cloze', level: 3, text: 'El próximo verano yo ___ (viajar) a Portugal.', inf: 'viajar', tense: 'futuro', person: 'yo', en: 'Next summer I will travel to Portugal.' },
  { type: 'cloze', level: 3, text: 'Mañana tú ___ (terminar) el informe, ¿no?', inf: 'terminar', tense: 'futuro', person: 'tú', en: "Tomorrow you'll finish the report, right?" },
  { type: 'cloze', level: 3, text: 'El año que viene nosotros ___ (poder) comprar una casa.', inf: 'poder', tense: 'futuro', person: 'nosotros', en: 'Next year we will be able to buy a house.' },
  { type: 'cloze', level: 3, text: 'Mis primos ___ (venir) a visitarnos la próxima semana.', inf: 'venir', tense: 'futuro', person: 'ellos', en: 'My cousins will come visit us next week.' },

  // ---- level 3: condicional ----
  { type: 'cloze', level: 3, text: 'En tu lugar, yo ___ (preferir) esperar un poco más.', inf: 'preferir', tense: 'condicional', person: 'yo', en: 'In your place, I would prefer to wait a bit longer.' },
  { type: 'cloze', level: 3, text: '¿___ (poder) tú ayudarme con esta caja?', inf: 'poder', tense: 'condicional', person: 'tú', en: 'Could you help me with this box?' },
  { type: 'cloze', level: 3, text: 'A mi madre le ___ (gustar) vivir cerca del mar.', inf: 'gustar', tense: 'condicional', person: 'él/ella', en: 'My mother would like to live near the sea.' },
  { type: 'cloze', level: 3, text: 'Con más dinero, nosotros ___ (viajar) por todo el mundo.', inf: 'viajar', tense: 'condicional', person: 'nosotros', en: 'With more money, we would travel around the whole world.' },

  // ---- level 3: perfecto ----
  { type: 'cloze', level: 3, text: 'Yo ya ___ (terminar) mis exámenes de este curso.', inf: 'terminar', tense: 'perfecto', person: 'yo', en: 'I have already finished my exams for this course.' },
  { type: 'cloze', level: 3, text: '¿___ (ver) tú alguna vez las pirámides de Egipto?', inf: 'ver', tense: 'perfecto', person: 'tú', en: 'Have you ever seen the pyramids of Egypt?' },
  { type: 'cloze', level: 3, text: 'Nosotros siempre ___ (vivir) en esta ciudad.', inf: 'vivir', tense: 'perfecto', person: 'nosotros', en: 'We have always lived in this city.' },
  { type: 'cloze', level: 3, text: 'Mis compañeros ya ___ (escribir) el informe final.', inf: 'escribir', tense: 'perfecto', person: 'ellos', en: 'My colleagues have already written the final report.' },

  // ---- level 4: presente de subjuntivo ----
  { type: 'cloze', level: 4, text: 'Espero que tú ___ (llamar) a tu madre esta noche.', inf: 'llamar', tense: 'presubj', person: 'tú', en: 'I hope you call your mother tonight.' },
  { type: 'cloze', level: 4, text: 'Es importante que ella ___ (estudiar) más para el examen.', inf: 'estudiar', tense: 'presubj', person: 'él/ella', en: "It's important that she study more for the exam." },
  { type: 'cloze', level: 4, text: 'Ojalá que nosotros ___ (salir) temprano hoy.', inf: 'salir', tense: 'presubj', person: 'nosotros', en: 'Hopefully we leave early today.' },
  { type: 'cloze', level: 4, text: 'Quiero que ellos ___ (traer) los documentos mañana.', inf: 'traer', tense: 'presubj', person: 'ellos', en: 'I want them to bring the documents tomorrow.' },

  // ---- level 4: imperfecto de subjuntivo ----
  { type: 'cloze', level: 4, text: 'Si yo ___ (tener) más tiempo libre, aprendería a pintar.', inf: 'tener', tense: 'impsubj', person: 'yo', en: 'If I had more free time, I would learn to paint.' },
  { type: 'cloze', level: 4, text: 'Si tú ___ (ser) el jefe, ¿qué cambiarías?', inf: 'ser', tense: 'impsubj', person: 'tú', en: 'If you were the boss, what would you change?' },
  { type: 'cloze', level: 4, text: 'Si nosotros ___ (poder) volar, viajaríamos todos los días.', inf: 'poder', tense: 'impsubj', person: 'nosotros', en: 'If we could fly, we would travel every day.' },
  { type: 'cloze', level: 4, text: 'Si ellos ___ (saber) la verdad, se enfadarían mucho.', inf: 'saber', tense: 'impsubj', person: 'ellos', en: 'If they knew the truth, they would get very angry.' },

  // ---- level 4: imperativo ----
  { type: 'cloze', level: 4, text: 'Hijo, ___ (comer) tus verduras antes del postre.', inf: 'comer', tense: 'imperativo', person: 'tú', en: 'Son, eat your vegetables before dessert.' },
  { type: 'cloze', level: 4, text: 'Niños, ___ (hablar) más bajo, por favor.', inf: 'hablar', tense: 'imperativo', person: 'vosotros', en: 'Children, speak more quietly, please.' },

  // ---- level 4: pluscuamperfecto ----
  { type: 'cloze', level: 4, text: 'Cuando ella llegó, yo ya ___ (terminar) la cena.', inf: 'terminar', tense: 'plusc', person: 'yo', en: 'When she arrived, I had already finished dinner.' },
  { type: 'cloze', level: 4, text: 'Cuando llamamos, ellos ya ___ (salir) de casa.', inf: 'salir', tense: 'plusc', person: 'ellos', en: 'When we called, they had already left home.' },

  // ---- transforms ----
  { type: 'transform', level: 1, instruction: 'Change the subject to yo:', from: 'Tú vives en Sevilla.', to: 'Yo vivo en Sevilla.', en: 'I live in Seville.' },
  { type: 'transform', level: 1, instruction: 'Make it negative:', from: 'Ella tiene hambre.', to: 'Ella no tiene hambre.', en: "She isn't hungry." },
  { type: 'transform', level: 1, instruction: 'Change the subject to ellos:', from: 'Nosotros trabajamos mucho.', to: 'Ellos trabajan mucho.', en: 'They work a lot.' },
  { type: 'transform', level: 2, instruction: 'Rewrite in the preterite (a finished past event):', from: 'Yo hago la tarea.', to: 'Yo hice la tarea.', en: 'I did the homework.' },
  { type: 'transform', level: 2, instruction: 'Rewrite in the imperfect (a past habit/background):', from: 'Nosotros vamos a la playa todos los veranos.', to: 'Nosotros íbamos a la playa todos los veranos.', en: 'We used to go to the beach every summer.' },
  { type: 'transform', level: 2, instruction: 'Change the subject to vosotros:', from: 'Ellos comieron paella.', to: 'Vosotros comisteis paella.', en: 'You all ate paella.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the future:', from: 'Ella termina el proyecto.', to: 'Ella terminará el proyecto.', en: 'She will finish the project.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the conditional:', from: 'Yo hago un pastel.', to: 'Yo haría un pastel.', en: 'I would make a cake.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the present perfect:', from: 'Nosotros comemos en ese restaurante.', to: 'Nosotros hemos comido en ese restaurante.', en: 'We have eaten at that restaurant.' },
  { type: 'transform', level: 4, instruction: 'Rewrite as a wish using “Espero que…” + subjunctive:', from: 'Tú vienes a la fiesta.', to: 'Espero que tú vengas a la fiesta.', en: 'I hope you come to the party.' },
  { type: 'transform', level: 4, instruction: 'Rewrite as a tú command:', from: 'Tú abres la puerta.', to: 'Abre la puerta.', en: 'Open the door.' },
  { type: 'transform', level: 4, instruction: 'Rewrite in the pluscuamperfecto (already done before another past action):', from: 'Ellos salen antes de la llamada.', to: 'Ellos habían salido antes de la llamada.', en: 'They had left before the call.' }

];
