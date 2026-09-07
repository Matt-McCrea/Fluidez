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
  { type: 'transform', level: 4, instruction: 'Rewrite in the pluscuamperfecto (already done before another past action):', from: 'Ellos salen antes de la llamada.', to: 'Ellos habían salido antes de la llamada.', en: 'They had left before the call.' },

  // ==== batch 2: more common verbs, modern-life contexts ====

  // ---- level 1: presente ----
  { type: 'cloze', level: 1, text: 'Todas las mañanas yo ___ (escuchar) música mientras desayuno.', inf: 'escuchar', tense: 'presente', person: 'yo', en: 'Every morning I listen to music while I have breakfast.' },
  { type: 'cloze', level: 1, text: 'Tú siempre ___ (enviar) mensajes muy tarde por la noche.', inf: 'enviar', tense: 'presente', person: 'tú', en: 'You always send messages very late at night.' },
  { type: 'cloze', level: 1, text: 'Mi jefa ___ (dirigir) un equipo de diez personas.', inf: 'dirigir', tense: 'presente', person: 'él/ella', en: 'My boss manages a team of ten people.' },
  { type: 'cloze', level: 1, text: 'Cada mes nosotros ___ (ahorrar) un poco de dinero.', inf: 'ahorrar', tense: 'presente', person: 'nosotros', en: 'Every month we save a bit of money.' },
  { type: 'cloze', level: 1, text: 'Vosotros siempre ___ (exigir) demasiado a los estudiantes.', inf: 'exigir', tense: 'presente', person: 'vosotros', en: 'You all always demand too much of the students.' },
  { type: 'cloze', level: 1, text: 'Esa empresa ___ (contratar) muchos empleados nuevos cada año.', inf: 'contratar', tense: 'presente', person: 'ellos', en: 'That company hires many new employees every year.' },
  { type: 'cloze', level: 1, text: 'Ese reloj no ___ (valer) mucho dinero.', inf: 'valer', tense: 'presente', person: 'él/ella', en: "That watch isn't worth much money." },
  { type: 'cloze', level: 1, text: 'Yo ___ (gestionar) las redes sociales de la empresa.', inf: 'gestionar', tense: 'presente', person: 'yo', en: "I manage the company's social media." },
  { type: 'cloze', level: 1, text: 'Tú siempre ___ (organizar) muy bien tus documentos.', inf: 'organizar', tense: 'presente', person: 'tú', en: 'You always organize your documents very well.' },
  { type: 'cloze', level: 1, text: 'En mi casa nosotros ___ (reciclar) el plástico y el papel.', inf: 'reciclar', tense: 'presente', person: 'nosotros', en: 'In my house we recycle plastic and paper.' },
  { type: 'cloze', level: 1, text: 'Los domingos mis padres ___ (descansar) todo el día.', inf: 'descansar', tense: 'presente', person: 'ellos', en: 'On Sundays my parents rest all day.' },
  { type: 'cloze', level: 1, text: 'Yo siempre ___ (sonreír) cuando veo a mis sobrinos.', inf: 'sonreír', tense: 'presente', person: 'yo', en: 'I always smile when I see my nephews and nieces.' },
  { type: 'cloze', level: 1, text: 'Tú ___ (conducir) muy rápido por la autopista.', inf: 'conducir', tense: 'presente', person: 'tú', en: 'You drive very fast on the highway.' },
  { type: 'cloze', level: 1, text: 'Mi hijo ya ___ (entender) las tareas difíciles.', inf: 'entender', tense: 'presente', person: 'él/ella', en: 'My son already understands the difficult homework.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (preferir) el té al café por la mañana.', inf: 'preferir', tense: 'presente', person: 'nosotros', en: 'We prefer tea to coffee in the morning.' },
  { type: 'cloze', level: 1, text: 'Vosotros ___ (repetir) los mismos errores siempre.', inf: 'repetir', tense: 'presente', person: 'vosotros', en: 'You all always repeat the same mistakes.' },
  { type: 'cloze', level: 1, text: 'Mis vecinos ___ (conocer) a todo el mundo en el barrio.', inf: 'conocer', tense: 'presente', person: 'ellos', en: 'My neighbors know everyone in the neighborhood.' },
  { type: 'cloze', level: 1, text: 'Yo ___ (administrar) el presupuesto familiar cada mes.', inf: 'administrar', tense: 'presente', person: 'yo', en: 'I manage the family budget every month.' },
  { type: 'cloze', level: 1, text: 'Tú ___ (andar) cinco kilómetros cada mañana.', inf: 'andar', tense: 'presente', person: 'tú', en: 'You walk five kilometers every morning.' },

  // ---- level 2: preterito / imperfecto ----
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (enviar) el informe a mi jefe.', inf: 'enviar', tense: 'preterito', person: 'yo', en: 'Yesterday I sent the report to my boss.' },
  { type: 'cloze', level: 2, text: 'El año pasado tú ___ (elegir) estudiar medicina.', inf: 'elegir', tense: 'preterito', person: 'tú', en: 'Last year you chose to study medicine.' },
  { type: 'cloze', level: 2, text: 'La empresa ___ (despedir) a varios empleados el mes pasado.', inf: 'despedir', tense: 'preterito', person: 'él/ella', en: 'The company laid off several employees last month.' },
  { type: 'cloze', level: 2, text: 'El año pasado nosotros ___ (invertir) en un negocio nuevo.', inf: 'invertir', tense: 'preterito', person: 'nosotros', en: 'Last year we invested in a new business.' },
  { type: 'cloze', level: 2, text: 'Vosotros ___ (andar) por la playa toda la tarde ayer.', inf: 'andar', tense: 'preterito', person: 'vosotros', en: 'You all walked along the beach all afternoon yesterday.' },
  { type: 'cloze', level: 2, text: 'Los profesores ___ (corregir) los exámenes anoche.', inf: 'corregir', tense: 'preterito', person: 'ellos', en: 'The teachers corrected the exams last night.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (gastar) demasiado dinero en ropa.', inf: 'gastar', tense: 'preterito', person: 'yo', en: 'Yesterday I spent too much money on clothes.' },
  { type: 'cloze', level: 2, text: 'Tú ___ (llorar) mucho en la boda de tu hermana.', inf: 'llorar', tense: 'preterito', person: 'tú', en: "You cried a lot at your sister's wedding." },
  { type: 'cloze', level: 2, text: 'Cuando vio el regalo, ella ___ (sonreír) de felicidad.', inf: 'sonreír', tense: 'preterito', person: 'él/ella', en: 'When she saw the gift, she smiled with happiness.' },
  { type: 'cloze', level: 2, text: 'De joven, yo ___ (trabajar) en una tienda de ropa.', inf: 'trabajar', tense: 'imperfecto', person: 'yo', en: 'As a young person, I used to work in a clothing store.' },
  { type: 'cloze', level: 2, text: 'Cuando eras niño, ¿qué música ___ (escuchar) tú?', inf: 'escuchar', tense: 'imperfecto', person: 'tú', en: 'When you were a child, what music did you use to listen to?' },
  { type: 'cloze', level: 2, text: 'Mi abuelo ___ (conducir) un coche muy viejo hace años.', inf: 'conducir', tense: 'imperfecto', person: 'él/ella', en: 'My grandfather used to drive a very old car years ago.' },
  { type: 'cloze', level: 2, text: 'Antes, nosotros ___ (descansar) los domingos por la tarde.', inf: 'descansar', tense: 'imperfecto', person: 'nosotros', en: 'Before, we used to rest on Sunday afternoons.' },
  { type: 'cloze', level: 2, text: 'De niños, vosotros ___ (preferir) el chocolate a la fruta.', inf: 'preferir', tense: 'imperfecto', person: 'vosotros', en: 'As children, you all used to prefer chocolate to fruit.' },
  { type: 'cloze', level: 2, text: 'Mis abuelos ___ (conocer) a mucha gente en el pueblo antiguamente.', inf: 'conocer', tense: 'imperfecto', person: 'ellos', en: 'My grandparents used to know a lot of people in the village in the old days.' },

  // ---- level 3: futuro / condicional / perfecto ----
  { type: 'cloze', level: 3, text: 'Mañana yo ___ (enviar) los documentos por correo.', inf: 'enviar', tense: 'futuro', person: 'yo', en: 'Tomorrow I will send the documents by email.' },
  { type: 'cloze', level: 3, text: 'Si trabajas más, tú ___ (ahorrar) más dinero este año.', inf: 'ahorrar', tense: 'futuro', person: 'tú', en: 'If you work more, you will save more money this year.' },
  { type: 'cloze', level: 3, text: 'El próximo año, mi hermano ___ (invertir) en bolsa.', inf: 'invertir', tense: 'futuro', person: 'él/ella', en: 'Next year, my brother will invest in the stock market.' },
  { type: 'cloze', level: 3, text: 'El mes que viene nosotros ___ (organizar) una fiesta grande.', inf: 'organizar', tense: 'futuro', person: 'nosotros', en: 'Next month we will organize a big party.' },
  { type: 'cloze', level: 3, text: 'Después del examen, vosotros ___ (descansar) por fin.', inf: 'descansar', tense: 'futuro', person: 'vosotros', en: 'After the exam, you all will finally rest.' },
  { type: 'cloze', level: 3, text: 'La empresa ___ (contratar) a más personal el próximo trimestre.', inf: 'contratar', tense: 'futuro', person: 'ellos', en: 'The company will hire more staff next quarter.' },
  { type: 'cloze', level: 3, text: 'Con más dinero, yo ___ (gastar) menos en tonterías.', inf: 'gastar', tense: 'condicional', person: 'yo', en: 'With more money, I would spend less on nonsense.' },
  { type: 'cloze', level: 3, text: 'Ese coche ___ (valer) mucho más si estuviera nuevo.', inf: 'valer', tense: 'condicional', person: 'él/ella', en: 'That car would be worth much more if it were new.' },
  { type: 'cloze', level: 3, text: 'Si tuviéramos ahorros, nosotros ___ (invertir) en una casa.', inf: 'invertir', tense: 'condicional', person: 'nosotros', en: 'If we had savings, we would invest in a house.' },
  { type: 'cloze', level: 3, text: 'Mis amigos ___ (organizar) mejor la fiesta si tuvieran tiempo.', inf: 'organizar', tense: 'condicional', person: 'ellos', en: 'My friends would organize the party better if they had time.' },
  { type: 'cloze', level: 3, text: 'Yo ya ___ (enviar) el correo esta mañana.', inf: 'enviar', tense: 'perfecto', person: 'yo', en: 'I have already sent the email this morning.' },
  { type: 'cloze', level: 3, text: '¿___ (descansar) tú lo suficiente esta semana?', inf: 'descansar', tense: 'perfecto', person: 'tú', en: 'Have you rested enough this week?' },
  { type: 'cloze', level: 3, text: 'Mi hermana ya ___ (elegir) el vestido para la boda.', inf: 'elegir', tense: 'perfecto', person: 'él/ella', en: 'My sister has already chosen the dress for the wedding.' },
  { type: 'cloze', level: 3, text: 'Este año nosotros ___ (ahorrar) más que nunca.', inf: 'ahorrar', tense: 'perfecto', person: 'nosotros', en: 'This year we have saved more than ever.' },
  { type: 'cloze', level: 3, text: 'Mis jefes ya ___ (contratar) a un nuevo diseñador.', inf: 'contratar', tense: 'perfecto', person: 'ellos', en: 'My bosses have already hired a new designer.' },

  // ---- level 4: presubj / impsubj / imperativo / plusc ----
  { type: 'cloze', level: 4, text: 'Quiero que tú me ___ (escuchar) con atención.', inf: 'escuchar', tense: 'presubj', person: 'tú', en: 'I want you to listen to me carefully.' },
  { type: 'cloze', level: 4, text: 'Es importante que ella ___ (dirigir) bien el proyecto.', inf: 'dirigir', tense: 'presubj', person: 'él/ella', en: "It's important that she manages the project well." },
  { type: 'cloze', level: 4, text: 'El banco recomienda que nosotros ___ (ahorrar) más cada mes.', inf: 'ahorrar', tense: 'presubj', person: 'nosotros', en: 'The bank recommends that we save more each month.' },
  { type: 'cloze', level: 4, text: 'Espero que ellos ___ (contratar) a más gente pronto.', inf: 'contratar', tense: 'presubj', person: 'ellos', en: 'I hope they hire more people soon.' },
  { type: 'cloze', level: 4, text: 'Si yo ___ (enviar) el correo antes, no habría problemas.', inf: 'enviar', tense: 'impsubj', person: 'yo', en: "If I sent the email earlier, there wouldn't be problems." },
  { type: 'cloze', level: 4, text: 'Si tú ___ (despedir) a ese empleado, la empresa cambiaría mucho.', inf: 'despedir', tense: 'impsubj', person: 'tú', en: 'If you fired that employee, the company would change a lot.' },
  { type: 'cloze', level: 4, text: 'Si nosotros ___ (invertir) más, ganaríamos más dinero.', inf: 'invertir', tense: 'impsubj', person: 'nosotros', en: 'If we invested more, we would earn more money.' },
  { type: 'cloze', level: 4, text: 'Si ellos ___ (exigir) menos, todos estarían más felices.', inf: 'exigir', tense: 'impsubj', person: 'ellos', en: 'If they demanded less, everyone would be happier.' },
  { type: 'cloze', level: 4, text: 'Hijo, ___ (escuchar) a tu madre, por favor.', inf: 'escuchar', tense: 'imperativo', person: 'tú', en: 'Son, listen to your mother, please.' },
  { type: 'cloze', level: 4, text: 'Niños, ___ (organizar) vuestros juguetes antes de cenar.', inf: 'organizar', tense: 'imperativo', person: 'vosotros', en: 'Children, organize your toys before dinner.' },
  { type: 'cloze', level: 4, text: 'Señor Pérez, ___ (enviar) el informe antes del viernes.', inf: 'enviar', tense: 'imperativo', person: 'usted', en: 'Mr. Pérez, send the report before Friday.' },
  { type: 'cloze', level: 4, text: 'Cuando llegó el jefe, yo ya ___ (enviar) el informe.', inf: 'enviar', tense: 'plusc', person: 'yo', en: 'When the boss arrived, I had already sent the report.' },
  { type: 'cloze', level: 4, text: 'Cuando llegué, mi jefe ya ___ (despedir) a dos personas.', inf: 'despedir', tense: 'plusc', person: 'él/ella', en: 'When I arrived, my boss had already fired two people.' },
  { type: 'cloze', level: 4, text: 'Antes de comprar la casa, nosotros ya ___ (ahorrar) mucho dinero.', inf: 'ahorrar', tense: 'plusc', person: 'nosotros', en: 'Before buying the house, we had already saved a lot of money.' },
  { type: 'cloze', level: 4, text: 'Cuando llegamos, mis padres ya ___ (elegir) el restaurante.', inf: 'elegir', tense: 'plusc', person: 'ellos', en: 'When we arrived, my parents had already chosen the restaurant.' },

  // ---- level 5: futuro perfecto / condicional perfecto / perfecto de subjuntivo ----
  { type: 'cloze', level: 5, text: 'Para el viernes, yo ya ___ (terminar) el proyecto.', inf: 'terminar', tense: 'futperf', person: 'yo', en: 'By Friday, I will have already finished the project.' },
  { type: 'cloze', level: 5, text: 'Cuando empiece la reunión, tú ya ___ (llegar).', inf: 'llegar', tense: 'futperf', person: 'tú', en: 'When the meeting starts, you will have already arrived.' },
  { type: 'cloze', level: 5, text: 'Para mañana, mi hermana ___ (escribir) toda la tesis.', inf: 'escribir', tense: 'futperf', person: 'él/ella', en: 'By tomorrow, my sister will have written the whole thesis.' },
  { type: 'cloze', level: 5, text: 'Para el próximo año, nosotros ___ (ahorrar) lo suficiente para el viaje.', inf: 'ahorrar', tense: 'futperf', person: 'nosotros', en: 'By next year, we will have saved enough for the trip.' },
  { type: 'cloze', level: 5, text: 'Para el verano, vosotros ___ (vivir) un año entero en Madrid.', inf: 'vivir', tense: 'futperf', person: 'vosotros', en: 'By summer, you all will have lived a whole year in Madrid.' },
  { type: 'cloze', level: 5, text: 'Para el sábado, mis amigos ___ (organizar) toda la fiesta.', inf: 'organizar', tense: 'futperf', person: 'ellos', en: 'By Saturday, my friends will have organized the whole party.' },
  { type: 'cloze', level: 5, text: 'Para las cinco, yo ya ___ (hacer) toda la compra.', inf: 'hacer', tense: 'futperf', person: 'yo', en: "By five o'clock, I will have already done all the shopping." },
  { type: 'cloze', level: 5, text: 'Con más información, yo ___ (invertir) en esa empresa.', inf: 'invertir', tense: 'condperf', person: 'yo', en: 'With more information, I would have invested in that company.' },
  { type: 'cloze', level: 5, text: 'En mi lugar, tú ___ (elegir) la misma universidad.', inf: 'elegir', tense: 'condperf', person: 'tú', en: 'In my place, you would have chosen the same university.' },
  { type: 'cloze', level: 5, text: 'Con un poco más de suerte, él ___ (ganar) el premio.', inf: 'ganar', tense: 'condperf', person: 'él/ella', en: 'With a little more luck, he would have won the prize.' },
  { type: 'cloze', level: 5, text: 'Sin esos gastos, nosotros ___ (ahorrar) mucho más dinero.', inf: 'ahorrar', tense: 'condperf', person: 'nosotros', en: 'Without those expenses, we would have saved much more money.' },
  { type: 'cloze', level: 5, text: 'Con más tiempo, vosotros ___ (terminar) el trabajo mejor.', inf: 'terminar', tense: 'condperf', person: 'vosotros', en: 'With more time, you all would have finished the job better.' },
  { type: 'cloze', level: 5, text: 'Sin el nuevo presupuesto, ellos no ___ (contratar) a nadie.', inf: 'contratar', tense: 'condperf', person: 'ellos', en: "Without the new budget, they wouldn't have hired anyone." },
  { type: 'cloze', level: 5, text: 'En esa situación, yo no ___ (decir) nada.', inf: 'decir', tense: 'condperf', person: 'yo', en: "In that situation, I wouldn't have said anything." },
  { type: 'cloze', level: 5, text: 'Espero que para entonces yo ya ___ (terminar) el informe.', inf: 'terminar', tense: 'perfsubj', person: 'yo', en: 'I hope that by then I will have already finished the report.' },
  { type: 'cloze', level: 5, text: 'Ojalá que tú ya ___ (llegar) cuando empiece la película.', inf: 'llegar', tense: 'perfsubj', person: 'tú', en: 'I hope you will have already arrived when the movie starts.' },
  { type: 'cloze', level: 5, text: 'Dudo que mi hermano ___ (aprender) tanto en un mes.', inf: 'aprender', tense: 'perfsubj', person: 'él/ella', en: "I doubt my brother will have learned so much in a month." },
  { type: 'cloze', level: 5, text: 'Espero que para diciembre nosotros ___ (ahorrar) bastante dinero.', inf: 'ahorrar', tense: 'perfsubj', person: 'nosotros', en: 'I hope that by December we will have saved enough money.' },
  { type: 'cloze', level: 5, text: 'Ojalá que vosotros ___ (terminar) los estudios para entonces.', inf: 'terminar', tense: 'perfsubj', person: 'vosotros', en: 'I hope you all will have finished your studies by then.' },
  { type: 'cloze', level: 5, text: 'Espero que ellos ya ___ (decidir) algo cuando lleguemos.', inf: 'decidir', tense: 'perfsubj', person: 'ellos', en: 'I hope they will have already decided something by the time we arrive.' },

  // ---- more transforms across levels ----
  { type: 'transform', level: 1, instruction: 'Change the subject to tú:', from: 'Yo escucho música.', to: 'Tú escuchas música.', en: 'You listen to music.' },
  { type: 'transform', level: 1, instruction: 'Make it negative:', from: 'Nosotros ahorramos dinero.', to: 'Nosotros no ahorramos dinero.', en: "We don't save money." },
  { type: 'transform', level: 1, instruction: 'Change the subject to ellos:', from: 'Yo organizo mi trabajo.', to: 'Ellos organizan su trabajo.', en: 'They organize their work.' },
  { type: 'transform', level: 1, instruction: 'Change the subject to nosotros:', from: 'Tú conduces rápido.', to: 'Nosotros conducimos rápido.', en: 'We drive fast.' },
  { type: 'transform', level: 1, instruction: 'Make it negative:', from: 'Ella entiende el problema.', to: 'Ella no entiende el problema.', en: "She doesn't understand the problem." },
  { type: 'transform', level: 2, instruction: 'Rewrite in the preterite (a finished past event):', from: 'Yo envío el correo.', to: 'Yo envié el correo.', en: 'I sent the email.' },
  { type: 'transform', level: 2, instruction: 'Rewrite in the imperfect (a past habit/background):', from: 'Nosotros vivimos en Madrid.', to: 'Nosotros vivíamos en Madrid.', en: 'We used to live in Madrid.' },
  { type: 'transform', level: 2, instruction: 'Change the subject to vosotros:', from: 'Ellos gastaron mucho dinero.', to: 'Vosotros gastasteis mucho dinero.', en: 'You all spent a lot of money.' },
  { type: 'transform', level: 2, instruction: 'Rewrite in the preterite (a finished past event):', from: 'Tú eliges la universidad.', to: 'Tú elegiste la universidad.', en: 'You chose the university.' },
  { type: 'transform', level: 2, instruction: 'Rewrite in the imperfect (a past habit/background):', from: 'Yo trabajo en una tienda.', to: 'Yo trabajaba en una tienda.', en: 'I used to work in a store.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the future:', from: 'Nosotros organizamos la fiesta.', to: 'Nosotros organizaremos la fiesta.', en: 'We will organize the party.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the conditional:', from: 'Yo invierto en esa empresa.', to: 'Yo invertiría en esa empresa.', en: 'I would invest in that company.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the present perfect:', from: 'Ellos contratan a un diseñador.', to: 'Ellos han contratado a un diseñador.', en: 'They have hired a designer.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the future:', from: 'Tú ahorras dinero.', to: 'Tú ahorrarás dinero.', en: 'You will save money.' },
  { type: 'transform', level: 3, instruction: 'Rewrite in the present perfect:', from: 'Yo termino el proyecto.', to: 'Yo he terminado el proyecto.', en: 'I have finished the project.' },
  { type: 'transform', level: 4, instruction: 'Rewrite as a wish using “Espero que…” + subjunctive:', from: 'Tú escuchas el consejo.', to: 'Espero que tú escuches el consejo.', en: 'I hope you listen to the advice.' },
  { type: 'transform', level: 4, instruction: 'Rewrite as a tú command:', from: 'Tú organizas tus cosas.', to: 'Organiza tus cosas.', en: 'Organize your things.' },
  { type: 'transform', level: 4, instruction: 'Rewrite in the pluscuamperfecto (already done before another past action):', from: 'Ellos eligen el restaurante.', to: 'Ellos habían elegido el restaurante.', en: 'They had chosen the restaurant.' },
  { type: 'transform', level: 4, instruction: 'Rewrite as a wish using “Quiero que…” + subjunctive:', from: 'Ella dirige el equipo.', to: 'Quiero que ella dirija el equipo.', en: 'I want her to lead the team.' },
  { type: 'transform', level: 4, instruction: 'Rewrite as a vosotros command:', from: 'Vosotros escucháis la música.', to: 'Escuchad la música.', en: 'Listen to the music.' },
  { type: 'transform', level: 5, instruction: 'Rewrite in the futuro perfecto (will have done by then):', from: 'Yo termino el informe.', to: 'Yo habré terminado el informe.', en: 'I will have finished the report.' },
  { type: 'transform', level: 5, instruction: 'Rewrite in the condicional perfecto (would have done):', from: 'Nosotros ahorramos más.', to: 'Nosotros habríamos ahorrado más.', en: 'We would have saved more.' },
  { type: 'transform', level: 5, instruction: 'Rewrite as a hope using “Espero que…” + pretérito perfecto de subjuntivo:', from: 'Ellos deciden algo.', to: 'Espero que ellos hayan decidido algo.', en: 'I hope they have decided something.' },

  // ==== verb-group lesson cloze (groups 1-9) ====
  { type: 'cloze', level: 1, text: 'Todos los días yo ___ (trabajar) ocho horas en la oficina.', inf: 'trabajar', tense: 'presente', person: 'yo', en: 'Every day I work eight hours at the office.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (comer) en un restaurante nuevo.', inf: 'comer', tense: 'preterito', person: 'nosotros', en: 'Yesterday we ate at a new restaurant.' },
  { type: 'cloze', level: 2, text: 'De joven, tú ___ (estudiar) música todos los sábados.', inf: 'estudiar', tense: 'imperfecto', person: 'tú', en: 'As a young person, you used to study music every Saturday.' },
  { type: 'cloze', level: 1, text: 'Vosotros ___ (beber) demasiada agua con gas.', inf: 'beber', tense: 'presente', person: 'vosotros', en: 'You all drink too much sparkling water.' },

  { type: 'cloze', level: 2, text: 'El año pasado yo ___ (vivir) en otra ciudad.', inf: 'vivir', tense: 'preterito', person: 'yo', en: 'Last year I lived in another city.' },
  { type: 'cloze', level: 1, text: 'Ella ___ (escribir) un correo cada mañana.', inf: 'escribir', tense: 'presente', person: 'él/ella', en: 'She writes an email every morning.' },
  { type: 'cloze', level: 2, text: 'Cuando era niño, yo ___ (ser) muy curioso.', inf: 'ser', tense: 'imperfecto', person: 'yo', en: 'When I was a child, I was very curious.' },
  { type: 'cloze', level: 1, text: 'Ahora mismo, nosotros ___ (estar) en clase.', inf: 'estar', tense: 'presente', person: 'nosotros', en: 'Right now, we are in class.' },

  { type: 'cloze', level: 2, text: 'Ayer yo ___ (tener) una reunión muy larga.', inf: 'tener', tense: 'preterito', person: 'yo', en: 'Yesterday I had a very long meeting.' },
  { type: 'cloze', level: 2, text: 'El sábado pasado nosotros ___ (ir) al cine.', inf: 'ir', tense: 'preterito', person: 'nosotros', en: 'Last Saturday we went to the movies.' },
  { type: 'cloze', level: 2, text: 'Ella no ___ (poder) terminar el examen a tiempo.', inf: 'poder', tense: 'preterito', person: 'él/ella', en: "She couldn't finish the exam on time." },
  { type: 'cloze', level: 1, text: 'Vosotros ___ (hacer) la cena todos los martes.', inf: 'hacer', tense: 'presente', person: 'vosotros', en: 'You all make dinner every Tuesday.' },

  { type: 'cloze', level: 2, text: 'Ayer mis padres me ___ (decir) la verdad.', inf: 'decir', tense: 'preterito', person: 'ellos', en: 'Yesterday my parents told me the truth.' },
  { type: 'cloze', level: 1, text: 'Yo ___ (saber) hablar tres idiomas.', inf: 'saber', tense: 'presente', person: 'yo', en: 'I know how to speak three languages.' },
  { type: 'cloze', level: 2, text: 'La semana pasada nosotros ___ (ver) una película muy triste.', inf: 'ver', tense: 'preterito', person: 'nosotros', en: 'Last week we saw a very sad movie.' },
  { type: 'cloze', level: 1, text: 'Tú siempre ___ (querer) llegar temprano.', inf: 'querer', tense: 'presente', person: 'tú', en: 'You always want to arrive early.' },

  { type: 'cloze', level: 2, text: 'Ayer tú ___ (venir) muy tarde a la oficina.', inf: 'venir', tense: 'preterito', person: 'tú', en: 'Yesterday you came very late to the office.' },
  { type: 'cloze', level: 2, text: 'Anoche yo ___ (salir) con mis amigos.', inf: 'salir', tense: 'preterito', person: 'yo', en: 'Last night I went out with my friends.' },
  { type: 'cloze', level: 2, text: 'Mi hermano ___ (traer) el postre a la fiesta el sábado.', inf: 'traer', tense: 'preterito', person: 'él/ella', en: 'My brother brought the dessert to the party on Saturday.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (poner) la mesa antes de cenar.', inf: 'poner', tense: 'presente', person: 'nosotros', en: 'We set the table before dinner.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (dormir) ocho horas cada noche.', inf: 'dormir', tense: 'presente', person: 'yo', en: 'I sleep eight hours every night.' },
  { type: 'cloze', level: 2, text: 'Anoche nosotros no ___ (oír) el despertador.', inf: 'oír', tense: 'preterito', person: 'nosotros', en: "Last night we didn't hear the alarm clock." },
  { type: 'cloze', level: 1, text: 'El camarero ___ (servir) la comida muy rápido.', inf: 'servir', tense: 'presente', person: 'él/ella', en: 'The waiter serves the food very fast.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (pedir) el mismo plato de siempre.', inf: 'pedir', tense: 'preterito', person: 'yo', en: 'Yesterday I ordered the same dish as always.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (seguir) un plan de estudio cada semana.', inf: 'seguir', tense: 'presente', person: 'yo', en: 'I follow a study plan every week.' },
  { type: 'cloze', level: 2, text: 'Después de mucho esfuerzo, ella ___ (conseguir) el trabajo.', inf: 'conseguir', tense: 'preterito', person: 'él/ella', en: 'After a lot of effort, she got the job.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (preferir) el té al café.', inf: 'preferir', tense: 'presente', person: 'nosotros', en: 'We prefer tea to coffee.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (sentir) mucho frío en la calle.', inf: 'sentir', tense: 'preterito', person: 'yo', en: 'Yesterday I felt very cold in the street.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (conocer) a mucha gente interesante en este trabajo.', inf: 'conocer', tense: 'presente', person: 'yo', en: 'I know a lot of interesting people in this job.' },
  { type: 'cloze', level: 2, text: 'Anoche nosotros ___ (leer) el mismo libro juntos.', inf: 'leer', tense: 'preterito', person: 'nosotros', en: 'Last night we read the same book together.' },
  { type: 'cloze', level: 1, text: 'Ella ___ (creer) que todo va a salir bien.', inf: 'creer', tense: 'presente', person: 'él/ella', en: 'She believes everything will turn out fine.' },
  { type: 'cloze', level: 2, text: 'Cuando escuché el chiste, yo ___ (reír) mucho.', inf: 'reír', tense: 'preterito', person: 'yo', en: 'When I heard the joke, I laughed a lot.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (pensar) mucho antes de tomar decisiones.', inf: 'pensar', tense: 'presente', person: 'yo', en: 'I think a lot before making decisions.' },
  { type: 'cloze', level: 2, text: 'Ayer tú ___ (conducir) hasta la costa.', inf: 'conducir', tense: 'preterito', person: 'tú', en: 'Yesterday you drove to the coast.' },
  { type: 'cloze', level: 1, text: 'Esta fábrica ___ (producir) muebles de madera.', inf: 'producir', tense: 'presente', person: 'él/ella', en: 'This factory produces wooden furniture.' },
  { type: 'cloze', level: 2, text: 'El traductor ___ (traducir) el documento en una hora.', inf: 'traducir', tense: 'preterito', person: 'él/ella', en: 'The translator translated the document in an hour.' },

  // ==== verb-group lesson cloze (groups 10-18) ====
  { type: 'cloze', level: 1, text: 'Yo ___ (empezar) mi jornada a las ocho.', inf: 'empezar', tense: 'presente', person: 'yo', en: 'I start my workday at eight.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (comenzar) un proyecto nuevo.', inf: 'comenzar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we started a new project.' },
  { type: 'cloze', level: 1, text: 'Ella siempre ___ (cerrar) la puerta con llave.', inf: 'cerrar', tense: 'presente', person: 'él/ella', en: 'She always locks the door.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (perder) las llaves de casa.', inf: 'perder', tense: 'preterito', person: 'yo', en: 'Yesterday I lost the house keys.' },

  { type: 'cloze', level: 2, text: 'Anoche yo ___ (volver) muy tarde a casa.', inf: 'volver', tense: 'preterito', person: 'yo', en: 'Last night I got home very late.' },
  { type: 'cloze', level: 2, text: 'Ayer tú ___ (encontrar) mi cartera en el sofá.', inf: 'encontrar', tense: 'preterito', person: 'tú', en: 'Yesterday you found my wallet on the sofa.' },
  { type: 'cloze', level: 1, text: 'Mi abuela siempre ___ (contar) la misma historia.', inf: 'contar', tense: 'presente', person: 'él/ella', en: 'My grandmother always tells the same story.' },
  { type: 'cloze', level: 1, text: 'Yo no ___ (recordar) su nombre.', inf: 'recordar', tense: 'presente', person: 'yo', en: "I don't remember his name." },

  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (llegar) tarde al partido.', inf: 'llegar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we arrived late to the game.' },
  { type: 'cloze', level: 1, text: 'Los niños ___ (jugar) en el jardín todas las tardes.', inf: 'jugar', tense: 'presente', person: 'ellos', en: 'The children play in the garden every afternoon.' },
  { type: 'cloze', level: 1, text: 'Este bolso ___ (costar) demasiado dinero.', inf: 'costar', tense: 'presente', person: 'él/ella', en: 'This bag costs too much money.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (buscar) las entradas durante una hora.', inf: 'buscar', tense: 'preterito', person: 'yo', en: 'Yesterday I looked for the tickets for an hour.' },

  { type: 'cloze', level: 2, text: 'Ayer yo ___ (pagar) la cuenta con tarjeta.', inf: 'pagar', tense: 'preterito', person: 'yo', en: 'Yesterday I paid the bill with a card.' },
  { type: 'cloze', level: 1, text: 'El mecánico ___ (abrir) el taller a las ocho.', inf: 'abrir', tense: 'presente', person: 'él/ella', en: 'The mechanic opens the shop at eight.' },
  { type: 'cloze', level: 2, text: 'Sin querer, mi hermano ___ (romper) el espejo.', inf: 'romper', tense: 'preterito', person: 'él/ella', en: 'Without meaning to, my brother broke the mirror.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (sacar) fotos en cada viaje.', inf: 'sacar', tense: 'presente', person: 'nosotros', en: 'We take photos on every trip.' },

  { type: 'cloze', level: 2, text: 'Ayer los científicos ___ (descubrir) una especie nueva.', inf: 'descubrir', tense: 'preterito', person: 'ellos', en: 'Yesterday the scientists discovered a new species.' },
  { type: 'cloze', level: 1, text: 'Yo ___ (llamar) a mi madre todos los domingos.', inf: 'llamar', tense: 'presente', person: 'yo', en: 'I call my mother every Sunday.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (dejar) las maletas en el hotel.', inf: 'dejar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we left the suitcases at the hotel.' },
  { type: 'cloze', level: 1, text: 'La nieve ___ (cubrir) las montañas en invierno.', inf: 'cubrir', tense: 'presente', person: 'él/ella', en: 'Snow covers the mountains in winter.' },

  { type: 'cloze', level: 1, text: 'Nosotros ___ (quedar) con amigos todos los viernes.', inf: 'quedar', tense: 'presente', person: 'nosotros', en: 'We meet up with friends every Friday.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (esperar) media hora en la parada.', inf: 'esperar', tense: 'preterito', person: 'yo', en: 'Yesterday I waited half an hour at the stop.' },
  { type: 'cloze', level: 1, text: 'Ella ___ (necesitar) más tiempo para terminar.', inf: 'necesitar', tense: 'presente', person: 'él/ella', en: 'She needs more time to finish.' },
  { type: 'cloze', level: 2, text: 'Anoche nosotros ___ (pasar) horas hablando.', inf: 'pasar', tense: 'preterito', person: 'nosotros', en: 'Last night we spent hours talking.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (usar) el ordenador para trabajar.', inf: 'usar', tense: 'presente', person: 'yo', en: 'I use the computer to work.' },
  { type: 'cloze', level: 2, text: 'Ayer mi profesor me ___ (ayudar) con la tarea.', inf: 'ayudar', tense: 'preterito', person: 'él/ella', en: 'Yesterday my teacher helped me with the homework.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (mirar) el mapa antes de salir.', inf: 'mirar', tense: 'presente', person: 'nosotros', en: 'We look at the map before leaving.' },
  { type: 'cloze', level: 2, text: 'Esta mañana yo ___ (tomar) café con mi hermana.', inf: 'tomar', tense: 'preterito', person: 'yo', en: 'This morning I had coffee with my sister.' },

  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (comprar) un regalo para papá.', inf: 'comprar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we bought a gift for dad.' },
  { type: 'cloze', level: 1, text: 'Tú siempre ___ (cambiar) de opinión rápido.', inf: 'cambiar', tense: 'presente', person: 'tú', en: 'You always change your mind quickly.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (terminar) el informe a tiempo.', inf: 'terminar', tense: 'preterito', person: 'yo', en: 'Yesterday I finished the report on time.' },
  { type: 'cloze', level: 1, text: 'Ella ___ (ganar) un buen sueldo en su trabajo.', inf: 'ganar', tense: 'presente', person: 'él/ella', en: 'She earns a good salary at her job.' },

  { type: 'cloze', level: 2, text: 'El verano pasado nosotros ___ (viajar) por el sur de España.', inf: 'viajar', tense: 'preterito', person: 'nosotros', en: 'Last summer we traveled around the south of Spain.' },
  { type: 'cloze', level: 1, text: 'Mi madre ___ (cocinar) muy bien los fines de semana.', inf: 'cocinar', tense: 'presente', person: 'él/ella', en: 'My mother cooks very well on weekends.' },
  { type: 'cloze', level: 2, text: 'Anoche yo ___ (bailar) toda la noche en la fiesta.', inf: 'bailar', tense: 'preterito', person: 'yo', en: 'Last night I danced all night at the party.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (caminar) al trabajo todos los días.', inf: 'caminar', tense: 'presente', person: 'nosotros', en: 'We walk to work every day.' },

  // ==== verb-group lesson cloze (groups 19-27) ====
  { type: 'cloze', level: 1, text: 'Yo ___ (comprender) bien la gramática española.', inf: 'comprender', tense: 'presente', person: 'yo', en: 'I understand Spanish grammar well.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (vender) el coche viejo.', inf: 'vender', tense: 'preterito', person: 'nosotros', en: 'Yesterday we sold the old car.' },
  { type: 'cloze', level: 1, text: 'Ella ___ (correr) cinco kilómetros cada mañana.', inf: 'correr', tense: 'presente', person: 'él/ella', en: 'She runs five kilometers every morning.' },
  { type: 'cloze', level: 2, text: 'Ayer yo le ___ (responder) rápido al mensaje.', inf: 'responder', tense: 'preterito', person: 'yo', en: 'Yesterday I replied to the message quickly.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (recibir) muchos correos cada día.', inf: 'recibir', tense: 'presente', person: 'yo', en: 'I receive many emails every day.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (decidir) cambiar de piso.', inf: 'decidir', tense: 'preterito', person: 'nosotros', en: 'Yesterday we decided to change apartments.' },
  { type: 'cloze', level: 1, text: 'El portero no ___ (permitir) animales en el edificio.', inf: 'permitir', tense: 'presente', person: 'él/ella', en: 'The doorman does not allow animals in the building.' },
  { type: 'cloze', level: 2, text: 'Anoche yo ___ (subir) las escaleras muy rápido.', inf: 'subir', tense: 'preterito', person: 'yo', en: 'Last night I went up the stairs very fast.' },

  { type: 'cloze', level: 1, text: 'Nosotros ___ (desayunar) juntos todas las mañanas.', inf: 'desayunar', tense: 'presente', person: 'nosotros', en: 'We have breakfast together every morning.' },
  { type: 'cloze', level: 2, text: 'Anoche yo ___ (cenar) muy tarde.', inf: 'cenar', tense: 'preterito', person: 'yo', en: 'Last night I had dinner very late.' },
  { type: 'cloze', level: 1, text: 'El tren ___ (partir) a las siete en punto.', inf: 'partir', tense: 'presente', person: 'él/ella', en: 'The train departs at seven sharp.' },
  { type: 'cloze', level: 2, text: 'Ayer algo extraño ___ (ocurrir) en la oficina.', inf: 'ocurrir', tense: 'preterito', person: 'él/ella', en: 'Yesterday something strange happened at the office.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (preparar) la cena todos los domingos.', inf: 'preparar', tense: 'presente', person: 'yo', en: 'I prepare dinner every Sunday.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (invitar) a los vecinos a cenar.', inf: 'invitar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we invited the neighbors to dinner.' },
  { type: 'cloze', level: 1, text: 'Ella siempre ___ (saludar) con una sonrisa.', inf: 'saludar', tense: 'presente', person: 'él/ella', en: 'She always greets with a smile.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (olvidar) las llaves en el coche.', inf: 'olvidar', tense: 'preterito', person: 'yo', en: 'Yesterday I forgot the keys in the car.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (nadar) en la piscina todos los veranos.', inf: 'nadar', tense: 'presente', person: 'yo', en: 'I swim in the pool every summer.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (firmar) el contrato del piso.', inf: 'firmar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we signed the apartment contract.' },
  { type: 'cloze', level: 1, text: 'Ella ___ (dibujar) muy bien los paisajes.', inf: 'dibujar', tense: 'presente', person: 'él/ella', en: 'She draws landscapes very well.' },
  { type: 'cloze', level: 2, text: 'Anoche yo ___ (lavar) toda la ropa sucia.', inf: 'lavar', tense: 'preterito', person: 'yo', en: 'Last night I washed all the dirty clothes.' },

  { type: 'cloze', level: 1, text: 'Nosotros ___ (limpiar) la casa todos los sábados.', inf: 'limpiar', tense: 'presente', person: 'nosotros', en: 'We clean the house every Saturday.' },
  { type: 'cloze', level: 2, text: 'Ayer yo le ___ (prometer) ayuda a mi hermano.', inf: 'prometer', tense: 'preterito', person: 'yo', en: 'Yesterday I promised my brother help.' },
  { type: 'cloze', level: 1, text: 'El resultado ___ (depender) mucho del esfuerzo del equipo.', inf: 'depender', tense: 'presente', person: 'él/ella', en: "The result depends a lot on the team's effort." },
  { type: 'cloze', level: 2, text: 'Al final nosotros ___ (lograr) terminar el proyecto.', inf: 'lograr', tense: 'preterito', person: 'nosotros', en: 'In the end we managed to finish the project.' },

  { type: 'cloze', level: 1, text: 'Nosotros ___ (asistir) a clase todos los días.', inf: 'asistir', tense: 'presente', person: 'nosotros', en: 'We attend class every day.' },
  { type: 'cloze', level: 2, text: 'Ayer mis padres ___ (discutir) sobre las vacaciones.', inf: 'discutir', tense: 'preterito', person: 'ellos', en: 'Yesterday my parents argued about the vacation.' },
  { type: 'cloze', level: 1, text: 'Esa noticia siempre me ___ (sorprender).', inf: 'sorprender', tense: 'presente', person: 'él/ella', en: 'That news always surprises me.' },
  { type: 'cloze', level: 2, text: 'Ayer algo extraño le ___ (suceder) a mi vecino.', inf: 'suceder', tense: 'preterito', person: 'él/ella', en: 'Yesterday something strange happened to my neighbor.' },

  { type: 'cloze', level: 1, text: 'Nosotros ___ (compartir) piso con dos amigos.', inf: 'compartir', tense: 'presente', person: 'nosotros', en: 'We share an apartment with two friends.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (cumplir) veinticinco años.', inf: 'cumplir', tense: 'preterito', person: 'yo', en: 'Yesterday I turned twenty-five.' },
  { type: 'cloze', level: 1, text: 'Ella siempre ___ (insistir) en pagar la cuenta.', inf: 'insistir', tense: 'presente', person: 'él/ella', en: 'She always insists on paying the bill.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (añadir) más sal a la sopa.', inf: 'añadir', tense: 'preterito', person: 'yo', en: 'Yesterday I added more salt to the soup.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (escuchar) música mientras trabajo.', inf: 'escuchar', tense: 'presente', person: 'yo', en: 'I listen to music while I work.' },
  { type: 'cloze', level: 2, text: 'Ayer ella ___ (admitir) su error frente a todos.', inf: 'admitir', tense: 'preterito', person: 'él/ella', en: 'Yesterday she admitted her mistake in front of everyone.' },
  { type: 'cloze', level: 1, text: 'Mi jefe siempre ___ (mandar) correos muy tarde.', inf: 'mandar', tense: 'presente', person: 'él/ella', en: 'My boss always sends emails very late.' },
  { type: 'cloze', level: 2, text: 'El año pasado nosotros ___ (sufrir) mucho estrés en el trabajo.', inf: 'sufrir', tense: 'preterito', person: 'nosotros', en: 'Last year we suffered a lot of stress at work.' },

  // ==== verb-group lesson cloze (groups 28-37) ====
  { type: 'cloze', level: 1, text: 'Yo ___ (ahorrar) un poco de dinero cada mes.', inf: 'ahorrar', tense: 'presente', person: 'yo', en: 'I save a bit of money every month.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (planear) las vacaciones de verano.', inf: 'planear', tense: 'preterito', person: 'nosotros', en: 'Yesterday we planned the summer vacation.' },
  { type: 'cloze', level: 1, text: 'Ellos ___ (alquilar) un piso pequeño en el centro.', inf: 'alquilar', tense: 'presente', person: 'ellos', en: 'They rent a small apartment downtown.' },
  { type: 'cloze', level: 2, text: 'El mes pasado yo ___ (gastar) demasiado en ropa.', inf: 'gastar', tense: 'preterito', person: 'yo', en: 'Last month I spent too much on clothes.' },

  { type: 'cloze', level: 1, text: 'Nosotros ___ (reservar) mesa para las nueve.', inf: 'reservar', tense: 'presente', person: 'nosotros', en: 'We reserve a table for nine.' },
  { type: 'cloze', level: 2, text: 'Ayer la empresa ___ (contratar) a dos ingenieros.', inf: 'contratar', tense: 'preterito', person: 'él/ella', en: 'Yesterday the company hired two engineers.' },
  { type: 'cloze', level: 1, text: 'Ella ___ (gestionar) el equipo con mucha calma.', inf: 'gestionar', tense: 'presente', person: 'él/ella', en: 'She manages the team very calmly.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (negociar) un precio mejor.', inf: 'negociar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we negotiated a better price.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (reciclar) el plástico y el papel.', inf: 'reciclar', tense: 'presente', person: 'yo', en: 'I recycle plastic and paper.' },
  { type: 'cloze', level: 2, text: 'Ayer tú ___ (instalar) el programa nuevo.', inf: 'instalar', tense: 'preterito', person: 'tú', en: 'Yesterday you installed the new program.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (conectar) el ordenador a la impresora.', inf: 'conectar', tense: 'presente', person: 'nosotros', en: 'We connect the computer to the printer.' },
  { type: 'cloze', level: 2, text: 'Anoche yo ___ (actualizar) todos mis dispositivos.', inf: 'actualizar', tense: 'preterito', person: 'yo', en: 'Last night I updated all my devices.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (descansar) los domingos por la tarde.', inf: 'descansar', tense: 'presente', person: 'yo', en: 'I rest on Sunday afternoons.' },
  { type: 'cloze', level: 2, text: 'Ayer el veterinario ___ (vacunar) a diez cachorros.', inf: 'vacunar', tense: 'preterito', person: 'él/ella', en: 'Yesterday the vet vaccinated ten puppies.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (respirar) hondo antes del examen.', inf: 'respirar', tense: 'presente', person: 'nosotros', en: 'We breathe deeply before the exam.' },
  { type: 'cloze', level: 2, text: 'El año pasado los médicos ___ (curar) a muchos pacientes.', inf: 'curar', tense: 'preterito', person: 'ellos', en: 'Last year the doctors cured many patients.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (programar) aplicaciones para móviles.', inf: 'programar', tense: 'presente', person: 'yo', en: 'I program apps for mobile phones.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (votar) por el nuevo diseño.', inf: 'votar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we voted for the new design.' },
  { type: 'cloze', level: 1, text: 'Ella ___ (diseñar) la portada de la revista.', inf: 'diseñar', tense: 'presente', person: 'él/ella', en: 'She designs the cover of the magazine.' },
  { type: 'cloze', level: 2, text: 'El cliente ___ (reclamar) un descuento ayer.', inf: 'reclamar', tense: 'preterito', person: 'él/ella', en: 'The client demanded a discount yesterday.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (opinar) que el proyecto es bueno.', inf: 'opinar', tense: 'presente', person: 'yo', en: 'I think the project is good.' },
  { type: 'cloze', level: 2, text: 'Ayer los vecinos ___ (protestar) frente al ayuntamiento.', inf: 'protestar', tense: 'preterito', person: 'ellos', en: 'Yesterday the neighbors protested in front of city hall.' },
  { type: 'cloze', level: 1, text: 'Esa fábrica ___ (contaminar) mucho el aire.', inf: 'contaminar', tense: 'presente', person: 'él/ella', en: 'That factory pollutes the air a lot.' },
  { type: 'cloze', level: 2, text: 'Anoche yo ___ (llorar) viendo esa película.', inf: 'llorar', tense: 'preterito', person: 'yo', en: 'Last night I cried watching that movie.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (madrugar) todos los lunes.', inf: 'madrugar', tense: 'presente', person: 'yo', en: 'I get up early every Monday.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (descargar) la aplicación nueva.', inf: 'descargar', tense: 'preterito', person: 'nosotros', en: 'Yesterday we downloaded the new app.' },
  { type: 'cloze', level: 1, text: 'Ella siempre ___ (apagar) las luces al salir.', inf: 'apagar', tense: 'presente', person: 'él/ella', en: 'She always turns off the lights when leaving.' },
  { type: 'cloze', level: 2, text: 'Anoche yo ___ (cargar) el teléfono antes de dormir.', inf: 'cargar', tense: 'preterito', person: 'yo', en: 'Last night I charged my phone before sleeping.' },

  { type: 'cloze', level: 1, text: 'Yo ___ (encender) la luz de la cocina.', inf: 'encender', tense: 'presente', person: 'yo', en: 'I turn on the kitchen light.' },
  { type: 'cloze', level: 2, text: 'El año pasado nosotros ___ (invertir) en una empresa nueva.', inf: 'invertir', tense: 'preterito', person: 'nosotros', en: 'Last year we invested in a new company.' },
  { type: 'cloze', level: 1, text: 'La profesora ___ (corregir) los exámenes cada semana.', inf: 'corregir', tense: 'presente', person: 'él/ella', en: 'The teacher corrects the exams every week.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (elegir) el regalo perfecto.', inf: 'elegir', tense: 'preterito', person: 'yo', en: 'Yesterday I chose the perfect gift.' },

  { type: 'cloze', level: 1, text: 'Ella ___ (dirigir) un equipo de diez personas.', inf: 'dirigir', tense: 'presente', person: 'él/ella', en: 'She manages a team of ten people.' },
  { type: 'cloze', level: 2, text: 'Ayer yo ___ (enviar) el informe a mi jefa.', inf: 'enviar', tense: 'preterito', person: 'yo', en: 'Yesterday I sent the report to my boss.' },
  { type: 'cloze', level: 1, text: 'Nosotros ___ (andar) por el parque cada tarde.', inf: 'andar', tense: 'presente', person: 'nosotros', en: 'We walk through the park every afternoon.' },
  { type: 'cloze', level: 2, text: 'Cuando vio el resultado, ella ___ (sonreír) mucho.', inf: 'sonreír', tense: 'preterito', person: 'él/ella', en: 'When she saw the result, she smiled a lot.' },

  { type: 'cloze', level: 1, text: 'Estos libros no ___ (valer) mucho dinero.', inf: 'valer', tense: 'presente', person: 'ellos', en: "These books aren't worth much money." },
  { type: 'cloze', level: 3, text: 'Ese cuadro ___ (valer) mucho más en el futuro.', inf: 'valer', tense: 'futuro', person: 'él/ella', en: 'That painting will be worth much more in the future.' },
  { type: 'cloze', level: 3, text: 'Con más publicidad, esta casa ___ (valer) más.', inf: 'valer', tense: 'condicional', person: 'él/ella', en: 'With more advertising, this house would be worth more.' },
  { type: 'cloze', level: 2, text: 'De niño, aquel juguete ___ (valer) muy poco.', inf: 'valer', tense: 'imperfecto', person: 'él/ella', en: 'As a child, that toy was worth very little.' },

  // ==== grammar-lesson anchor cloze (ser-estar, preterite-imperfect) ====
  { type: 'cloze', level: 1, text: 'Mi hermana ___ (ser) muy simpática con todo el mundo.', inf: 'ser', tense: 'presente', person: 'él/ella', en: 'My sister is very nice to everyone.' },
  { type: 'cloze', level: 1, text: 'Ahora mismo, nosotros ___ (estar) muy cansados.', inf: 'estar', tense: 'presente', person: 'nosotros', en: 'Right now, we are very tired.' },
  { type: 'cloze', level: 2, text: 'De niña, ella ___ (jugar) en el parque cada tarde.', inf: 'jugar', tense: 'imperfecto', person: 'él/ella', en: 'As a child, she used to play in the park every afternoon.' },
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (decidir) cambiar de casa.', inf: 'decidir', tense: 'preterito', person: 'nosotros', en: 'Yesterday we decided to change houses.' },

  // ==== batch: B1 (levels 4-5) — subjunctive, imperative, compound tenses ====

  // ---- level 4: presente de subjuntivo ----
  { type: 'cloze', level: 4, text: 'Mis padres quieren que yo ___ (estudiar) medicina.', inf: 'estudiar', tense: 'presubj', person: 'yo', en: 'My parents want me to study medicine.' },
  { type: 'cloze', level: 4, text: 'Es importante que tú ___ (llegar) temprano a la entrevista.', inf: 'llegar', tense: 'presubj', person: 'tú', en: "It's important that you arrive early to the interview." },
  { type: 'cloze', level: 4, text: 'Ojalá que ella ___ (aprobar) el examen de conducir.', inf: 'aprobar', tense: 'presubj', person: 'él/ella', en: 'I hope she passes the driving test.' },
  { type: 'cloze', level: 4, text: 'El profesor espera que nosotros ___ (entregar) el trabajo a tiempo.', inf: 'entregar', tense: 'presubj', person: 'nosotros', en: 'The teacher hopes we hand in the work on time.' },
  { type: 'cloze', level: 4, text: 'Prefiero que vosotros ___ (decidir) juntos el destino del viaje.', inf: 'decidir', tense: 'presubj', person: 'vosotros', en: 'I prefer that you all decide the trip destination together.' },
  { type: 'cloze', level: 4, text: 'No creo que ellos ___ (saber) toda la verdad.', inf: 'saber', tense: 'presubj', person: 'ellos', en: "I don't think they know the whole truth." },

  // ---- level 4: imperfecto de subjuntivo ----
  { type: 'cloze', level: 4, text: 'Si yo ___ (tener) más tiempo libre, viajaría por Sudamérica.', inf: 'tener', tense: 'impsubj', person: 'yo', en: 'If I had more free time, I would travel around South America.' },
  { type: 'cloze', level: 4, text: 'Mi madre quería que tú la ___ (llamar) todos los domingos.', inf: 'llamar', tense: 'impsubj', person: 'tú', en: 'My mother wanted you to call her every Sunday.' },
  { type: 'cloze', level: 4, text: 'Si ella ___ (saber) conducir, iría en coche al trabajo.', inf: 'saber', tense: 'impsubj', person: 'él/ella', en: 'If she knew how to drive, she would go to work by car.' },
  { type: 'cloze', level: 4, text: 'Si nosotros ___ (ganar) la lotería, compraríamos una casa.', inf: 'ganar', tense: 'impsubj', person: 'nosotros', en: 'If we won the lottery, we would buy a house.' },
  { type: 'cloze', level: 4, text: 'El director pidió que vosotros ___ (terminar) el informe antes del viernes.', inf: 'terminar', tense: 'impsubj', person: 'vosotros', en: 'The director asked you all to finish the report before Friday.' },
  { type: 'cloze', level: 4, text: 'Si ellos ___ (venir) a la fiesta, la pasaríamos genial.', inf: 'venir', tense: 'impsubj', person: 'ellos', en: 'If they came to the party, we would have a great time.' },

  // ---- level 4: imperativo ----
  { type: 'cloze', level: 4, text: '___ (cerrar) la puerta cuando salgas, por favor.', inf: 'cerrar', tense: 'imperativo', person: 'tú', en: 'Close the door when you leave, please.' },
  { type: 'cloze', level: 4, text: '___ (firmar) aquí, por favor.', inf: 'firmar', tense: 'imperativo', person: 'usted', en: 'Sign here, please.' },
  { type: 'cloze', level: 4, text: '___ (empezar) la reunión sin más demora.', inf: 'empezar', tense: 'imperativo', person: 'nosotros', en: "Let's start the meeting without further delay." },
  { type: 'cloze', level: 4, text: '___ (escuchar) con atención las instrucciones.', inf: 'escuchar', tense: 'imperativo', person: 'vosotros', en: 'Listen carefully to the instructions.' },
  { type: 'cloze', level: 4, text: '___ (pasar) por la puerta principal, por favor.', inf: 'pasar', tense: 'imperativo', person: 'ustedes', en: 'Go through the main door, please.' },

  // ---- level 4: pluscuamperfecto ----
  { type: 'cloze', level: 4, text: 'Antes de ese trabajo, yo nunca ___ (viajar) al extranjero.', inf: 'viajar', tense: 'plusc', person: 'yo', en: 'Before that job, I had never traveled abroad.' },
  { type: 'cloze', level: 4, text: 'Cuando te conocí, tú ya ___ (viajar) por diez países.', inf: 'viajar', tense: 'plusc', person: 'tú', en: 'When I met you, you had already traveled through ten countries.' },
  { type: 'cloze', level: 4, text: 'Cuando llegó la policía, el ladrón ya ___ (salir) del banco.', inf: 'salir', tense: 'plusc', person: 'él/ella', en: 'When the police arrived, the thief had already left the bank.' },
  { type: 'cloze', level: 4, text: 'Antes de ese verano, nosotros nunca ___ (viajar) tan lejos.', inf: 'viajar', tense: 'plusc', person: 'nosotros', en: "Before that summer, we had never traveled so far." },
  { type: 'cloze', level: 4, text: 'Cuando os conocimos, vosotros ya ___ (terminar) la carrera.', inf: 'terminar', tense: 'plusc', person: 'vosotros', en: 'When we met you all, you had already finished your degree.' },
  { type: 'cloze', level: 4, text: 'Cuando llegamos al cine, la película ya ___ (empezar).', inf: 'empezar', tense: 'plusc', person: 'él/ella', en: 'When we got to the cinema, the film had already started.' },

  // ---- level 5: futuro perfecto ----
  { type: 'cloze', level: 5, text: 'Para las nueve, yo ya ___ (terminar) el informe.', inf: 'terminar', tense: 'futperf', person: 'yo', en: 'By nine, I will have finished the report.' },
  { type: 'cloze', level: 5, text: 'Para el año que viene, tú ya ___ (acabar) la carrera.', inf: 'acabar', tense: 'futperf', person: 'tú', en: 'By next year, you will have finished your degree.' },
  { type: 'cloze', level: 5, text: 'Para diciembre, ella ya ___ (cambiar) de trabajo.', inf: 'cambiar', tense: 'futperf', person: 'él/ella', en: 'By December, she will have changed jobs.' },
  { type: 'cloze', level: 5, text: 'Para entonces, nosotros ya ___ (terminar) el proyecto.', inf: 'terminar', tense: 'futperf', person: 'nosotros', en: 'By then, we will have finished the project.' },
  { type: 'cloze', level: 5, text: 'Cuando volváis, vosotros ya ___ (aprender) mucho español.', inf: 'aprender', tense: 'futperf', person: 'vosotros', en: 'By the time you all come back, you will have learned a lot of Spanish.' },
  { type: 'cloze', level: 5, text: 'Para el viernes, ellos ya ___ (entregar) el proyecto.', inf: 'entregar', tense: 'futperf', person: 'ellos', en: 'By Friday, they will have handed in the project.' },

  // ---- level 5: condicional perfecto ----
  { type: 'cloze', level: 5, text: 'Sin tu ayuda, yo no ___ (conseguir) el trabajo.', inf: 'conseguir', tense: 'condperf', person: 'yo', en: "Without your help, I wouldn't have gotten the job." },
  { type: 'cloze', level: 5, text: 'En mi lugar, tú ___ (hacer) lo mismo.', inf: 'hacer', tense: 'condperf', person: 'tú', en: 'In my place, you would have done the same.' },
  { type: 'cloze', level: 5, text: 'Con más tiempo, ella ___ (terminar) el proyecto mejor.', inf: 'terminar', tense: 'condperf', person: 'él/ella', en: 'With more time, she would have finished the project better.' },
  { type: 'cloze', level: 5, text: 'Sin el tráfico, nosotros ___ (llegar) mucho antes.', inf: 'llegar', tense: 'condperf', person: 'nosotros', en: 'Without the traffic, we would have arrived much earlier.' },
  { type: 'cloze', level: 5, text: 'Con más práctica, vosotros ___ (mejorar) mucho más.', inf: 'mejorar', tense: 'condperf', person: 'vosotros', en: 'With more practice, you all would have improved much more.' },
  { type: 'cloze', level: 5, text: 'Sin ese error, ellos ___ (ganar) el partido.', inf: 'ganar', tense: 'condperf', person: 'ellos', en: 'Without that mistake, they would have won the match.' },

  // ---- level 5: pretérito perfecto de subjuntivo ----
  { type: 'cloze', level: 5, text: 'Espero que yo ___ (aprobar) el examen de conducir.', inf: 'aprobar', tense: 'perfsubj', person: 'yo', en: 'I hope I have passed the driving test.' },
  { type: 'cloze', level: 5, text: 'Ojalá que tú ___ (llegar) bien a casa.', inf: 'llegar', tense: 'perfsubj', person: 'tú', en: 'I hope you have arrived home safely.' },
  { type: 'cloze', level: 5, text: 'Dudo que ella ya ___ (terminar) el informe.', inf: 'terminar', tense: 'perfsubj', person: 'él/ella', en: "I doubt she has finished the report yet." },
  { type: 'cloze', level: 5, text: 'Es una pena que nosotros no ___ (poder) verte esta vez.', inf: 'poder', tense: 'perfsubj', person: 'nosotros', en: "It's a shame we haven't been able to see you this time." },
  { type: 'cloze', level: 5, text: 'Me alegro de que vosotros ___ (aprobar) todos los exámenes.', inf: 'aprobar', tense: 'perfsubj', person: 'vosotros', en: 'I\'m glad you all have passed all the exams.' },
  { type: 'cloze', level: 5, text: 'No creo que ellos ___ (llegar) todavía.', inf: 'llegar', tense: 'perfsubj', person: 'ellos', en: "I don't think they have arrived yet." },

  // ---- transforms: level 4-5 ----
  { type: 'transform', level: 4, instruction: 'Rewrite as a wish using "Ojalá que…" + subjunctive:', from: 'Ella gana el premio.', to: 'Ojalá que ella gane el premio.', en: 'I hope she wins the prize.' },
  { type: 'transform', level: 4, instruction: 'Rewrite as an usted command:', from: 'Usted firma aquí.', to: 'Firme aquí.', en: 'Sign here.' },
  { type: 'transform', level: 4, instruction: 'Rewrite in the pluscuamperfecto (already done before another past action):', from: 'Nosotros terminamos el trabajo antes de la reunión.', to: 'Nosotros habíamos terminado el trabajo antes de la reunión.', en: 'We had finished the work before the meeting.' },
  { type: 'transform', level: 4, instruction: 'Rewrite as a nosotros command ("Let\'s..."):', from: 'Nosotros empezamos ahora.', to: 'Empecemos ahora.', en: "Let's start now." },
  { type: 'transform', level: 4, instruction: 'Rewrite as a vosotros command:', from: 'Vosotros leéis las instrucciones.', to: 'Leed las instrucciones.', en: 'Read the instructions.' },
  { type: 'transform', level: 5, instruction: 'Rewrite in the futuro perfecto (will have done by then):', from: 'Ellos terminan el proyecto.', to: 'Ellos habrán terminado el proyecto.', en: 'They will have finished the project.' },
  { type: 'transform', level: 5, instruction: 'Rewrite in the condicional perfecto (would have done):', from: 'Yo acepto la oferta.', to: 'Yo habría aceptado la oferta.', en: 'I would have accepted the offer.' },
  { type: 'transform', level: 5, instruction: 'Rewrite as a hope using "Ojalá que…" + pretérito perfecto de subjuntivo:', from: 'Ella llega a tiempo.', to: 'Ojalá que ella haya llegado a tiempo.', en: 'I hope she has arrived on time.' },

  // ==== batch: B1 (levels 4-5), wave 2 — more verbs, more variety ====

  // ---- level 4: presente de subjuntivo ----
  { type: 'cloze', level: 4, text: 'Es necesario que yo ___ (entregar) la solicitud antes del lunes.', inf: 'entregar', tense: 'presubj', person: 'yo', en: "It's necessary that I hand in the application before Monday." },
  { type: 'cloze', level: 4, text: 'Mis amigos esperan que tú ___ (venir) a la boda.', inf: 'venir', tense: 'presubj', person: 'tú', en: 'My friends hope you come to the wedding.' },
  { type: 'cloze', level: 4, text: 'Dudo que él ___ (decir) toda la verdad.', inf: 'decir', tense: 'presubj', person: 'él/ella', en: "I doubt he's telling the whole truth." },
  { type: 'cloze', level: 4, text: 'Es posible que nosotros ___ (cambiar) de casa este año.', inf: 'cambiar', tense: 'presubj', person: 'nosotros', en: "It's possible we'll move house this year." },
  { type: 'cloze', level: 4, text: 'No es seguro que ellos ___ (aceptar) la oferta.', inf: 'aceptar', tense: 'presubj', person: 'ellos', en: "It's not certain they will accept the offer." },

  // ---- level 4: imperfecto de subjuntivo ----
  { type: 'cloze', level: 4, text: 'Si yo ___ (poder) elegir, viviría en la costa.', inf: 'poder', tense: 'impsubj', person: 'yo', en: 'If I could choose, I would live on the coast.' },
  { type: 'cloze', level: 4, text: 'Mi jefe esperaba que tú ___ (resolver) el problema rápido.', inf: 'resolver', tense: 'impsubj', person: 'tú', en: 'My boss hoped you would solve the problem quickly.' },
  { type: 'cloze', level: 4, text: 'Si ella ___ (construir) su propia casa, sería más grande.', inf: 'construir', tense: 'impsubj', person: 'él/ella', en: 'If she built her own house, it would be bigger.' },
  { type: 'cloze', level: 4, text: 'Si nosotros ___ (reducir) los gastos, ahorraríamos más.', inf: 'reducir', tense: 'impsubj', person: 'nosotros', en: 'If we reduced expenses, we would save more.' },
  { type: 'cloze', level: 4, text: 'El profesor pidió que ellos ___ (corregir) sus propios errores.', inf: 'corregir', tense: 'impsubj', person: 'ellos', en: 'The teacher asked them to correct their own mistakes.' },

  // ---- level 4: imperativo ----
  { type: 'cloze', level: 4, text: '___ (comprar) el pan de camino a casa.', inf: 'comprar', tense: 'imperativo', person: 'tú', en: 'Buy the bread on your way home.' },
  { type: 'cloze', level: 4, text: '___ (escribir) su nombre completo aquí.', inf: 'escribir', tense: 'imperativo', person: 'usted', en: 'Write your full name here.' },
  { type: 'cloze', level: 4, text: '___ (limpiar) vuestra habitación antes de salir.', inf: 'limpiar', tense: 'imperativo', person: 'vosotros', en: 'Clean your room before you go out.' },
  { type: 'cloze', level: 4, text: '___ (elegir) la opción que prefieran.', inf: 'elegir', tense: 'imperativo', person: 'ustedes', en: 'Choose the option you prefer.' },

  // ---- level 4: pluscuamperfecto ----
  { type: 'cloze', level: 4, text: 'Antes de aquel año, yo nunca ___ (comprar) un coche.', inf: 'comprar', tense: 'plusc', person: 'yo', en: 'Before that year, I had never bought a car.' },
  { type: 'cloze', level: 4, text: 'Cuando la conocí, ella ya ___ (publicar) su primer libro.', inf: 'publicar', tense: 'plusc', person: 'él/ella', en: 'When I met her, she had already published her first book.' },
  { type: 'cloze', level: 4, text: 'Antes de mudarnos, nosotros nunca ___ (vivir) en una ciudad grande.', inf: 'vivir', tense: 'plusc', person: 'nosotros', en: 'Before moving, we had never lived in a big city.' },
  { type: 'cloze', level: 4, text: 'Cuando llegamos, ellos ya ___ (limpiar) toda la casa.', inf: 'limpiar', tense: 'plusc', person: 'ellos', en: 'When we arrived, they had already cleaned the whole house.' },

  // ---- level 5: futuro perfecto ----
  { type: 'cloze', level: 5, text: 'Para junio, yo ya ___ (aprender) a conducir.', inf: 'aprender', tense: 'futperf', person: 'yo', en: 'By June, I will have learned to drive.' },
  { type: 'cloze', level: 5, text: 'Para entonces, ella ya ___ (construir) la casa.', inf: 'construir', tense: 'futperf', person: 'él/ella', en: 'By then, she will have built the house.' },
  { type: 'cloze', level: 5, text: 'Para el próximo año, nosotros ya ___ (invertir) en el negocio.', inf: 'invertir', tense: 'futperf', person: 'nosotros', en: 'By next year, we will have invested in the business.' },
  { type: 'cloze', level: 5, text: 'Para el lunes, ellos ya ___ (elegir) al nuevo director.', inf: 'elegir', tense: 'futperf', person: 'ellos', en: 'By Monday, they will have chosen the new director.' },

  // ---- level 5: condicional perfecto ----
  { type: 'cloze', level: 5, text: 'Sin el consejo de mi hermano, yo no ___ (elegir) esta carrera.', inf: 'elegir', tense: 'condperf', person: 'yo', en: "Without my brother's advice, I wouldn't have chosen this degree." },
  { type: 'cloze', level: 5, text: 'Con más cuidado, tú no ___ (romper) el jarrón.', inf: 'romper', tense: 'condperf', person: 'tú', en: "With more care, you wouldn't have broken the vase." },
  { type: 'cloze', level: 5, text: 'Con más presupuesto, nosotros ___ (construir) un edificio más grande.', inf: 'construir', tense: 'condperf', person: 'nosotros', en: 'With more budget, we would have built a bigger building.' },
  { type: 'cloze', level: 5, text: 'Sin ese apoyo, ellos no ___ (lograr) el objetivo.', inf: 'lograr', tense: 'condperf', person: 'ellos', en: "Without that support, they wouldn't have achieved the goal." },

  // ---- level 5: pretérito perfecto de subjuntivo ----
  { type: 'cloze', level: 5, text: 'Ojalá que yo ___ (elegir) bien esta vez.', inf: 'elegir', tense: 'perfsubj', person: 'yo', en: 'I hope I have chosen well this time.' },
  { type: 'cloze', level: 5, text: 'Espero que tú ___ (escribir) la carta ya.', inf: 'escribir', tense: 'perfsubj', person: 'tú', en: 'I hope you have already written the letter.' },
  { type: 'cloze', level: 5, text: 'No creo que él ___ (decir) la verdad.', inf: 'decir', tense: 'perfsubj', person: 'él/ella', en: "I don't think he has told the truth." },
  { type: 'cloze', level: 5, text: 'Me alegro de que vosotros ___ (aprender) tanto este curso.', inf: 'aprender', tense: 'perfsubj', person: 'vosotros', en: "I'm glad you all have learned so much this course." },
  { type: 'cloze', level: 5, text: 'Dudo que ellos ___ (construir) el puente a tiempo.', inf: 'construir', tense: 'perfsubj', person: 'ellos', en: "I doubt they have built the bridge on time." },

  /* ============================================================================
   * B2 APPLY ITEMS — batch 1 of 12 (WORKLIST.md § apply). Verb variety and
   * register beyond the basic tenses: reported opinion, regret, insistence,
   * conjecture, formal register. Levels 6-7.
   * ========================================================================== */
  { type: 'cloze', level: 6, text: 'Me sorprende que el comité todavía no ___ (pronunciarse) sobre el caso.', inf: 'pronunciarse', tense: 'presubj', person: 'él/ella', en: "I'm surprised the committee still hasn't taken a position on the case." },
  { type: 'cloze', level: 6, text: 'Si el ayuntamiento ___ (invertir) más en transporte público, habría menos tráfico.', inf: 'invertir', tense: 'impsubj', person: 'él/ella', en: 'If the city council invested more in public transport, there would be less traffic.' },
  { type: 'cloze', level: 6, text: 'Para cuando lleguen los resultados, nosotros ya ___ (tomar) una decisión.', inf: 'tomar', tense: 'futperf', person: 'nosotros', en: 'By the time the results arrive, we will have already made a decision.' },
  { type: 'cloze', level: 6, text: 'Yo, en tu lugar, ___ (exigir) una explicación por escrito.', inf: 'exigir', tense: 'condicional', person: 'yo', en: "In your place, I would demand a written explanation." },
  { type: 'cloze', level: 6, text: 'El jefe insiste en que vosotros ___ (comprometerse) con la nueva fecha de entrega.', inf: 'comprometerse', tense: 'presubj', person: 'vosotros', en: 'The boss insists that you all commit to the new delivery date.' },
  { type: 'cloze', level: 6, text: 'Ella se arrepiente de que nunca le ___ (proponer, ellos) el ascenso.', inf: 'proponer', tense: 'perfsubj', person: 'ellos', en: 'She regrets that they never offered her the promotion.' },
  { type: 'cloze', level: 7, text: 'Habrán cambiado de opinión, porque hasta ayer ___ (negarse) en redondo.', inf: 'negarse', tense: 'imperfecto', person: 'ellos', en: 'They must have changed their minds, because until yesterday they were flatly refusing.' },
  { type: 'cloze', level: 7, text: 'De haberlo sabido antes, ella ___ (renunciar) al puesto de inmediato.', inf: 'renunciar', tense: 'condperf', person: 'él/ella', en: 'Had she known beforehand, she would have resigned from the position immediately.' },

  { type: 'transform', level: 6, instruction: 'Rewrite as a "se" construction that avoids naming who is responsible:', from: 'Alguien canceló el vuelo sin previo aviso.', to: 'El vuelo se canceló sin previo aviso.', en: 'The flight was cancelled without prior notice.' },
  { type: 'transform', level: 7, instruction: 'Rewrite in reported (indirect) speech, starting with "El ministro afirmó que...":', from: 'El ministro dijo: "La reforma entrará en vigor el próximo año."', to: 'El ministro afirmó que la reforma entraría en vigor el año siguiente.', en: 'The minister stated that the reform would take effect the following year.' },

  /* ---- B2 apply, batch 2 of 12 ---- */
  { type: 'cloze', level: 6, text: 'No dudes en llamarme en cuanto ___ (tener, tú) noticias.', inf: 'tener', tense: 'presubj', person: 'tú', en: "Don't hesitate to call me as soon as you have news." },
  { type: 'cloze', level: 6, text: 'El portavoz ___ (desmentir) esta mañana los rumores sobre su dimisión.', inf: 'desmentir', tense: 'preterito', person: 'él/ella', en: 'The spokesperson denied the resignation rumors this morning.' },
  { type: 'cloze', level: 6, text: 'Si vosotros me ___ (advertir) antes, habría cambiado de planes.', inf: 'advertir', tense: 'impsubj', person: 'vosotros', en: 'If you all had warned me sooner, I would have changed plans.' },
  { type: 'cloze', level: 6, text: 'Para entonces, la empresa ya ___ (aplazar) la fecha de lanzamiento dos veces.', inf: 'aplazar', tense: 'plusc', person: 'él/ella', en: 'By then, the company had already postponed the launch date twice.' },
  { type: 'cloze', level: 7, text: 'Cuando el juez se lo pregunte directamente, no ___ (contradecir, tú) tu propia declaración anterior.', inf: 'contradecir', tense: 'presente', person: 'tú', en: "When the judge asks you directly, don't contradict your own earlier statement." },
  { type: 'cloze', level: 7, text: 'Los analistas ___ (prever) ya un crecimiento moderado para el próximo trimestre.', inf: 'prever', tense: 'perfecto', person: 'ellos', en: 'Analysts have already forecast moderate growth for next quarter.' },
  { type: 'cloze', level: 7, text: 'El informe ___ (subrayar) que la medida beneficiaría sobre todo a las pymes.', inf: 'subrayar', tense: 'condicional', person: 'él/ella', en: 'The report would emphasize that the measure would mainly benefit small businesses.' },
  { type: 'cloze', level: 6, text: 'La asociación ___ (denunciar) públicamente las condiciones del centro la próxima semana.', inf: 'denunciar', tense: 'futuro', person: 'él/ella', en: 'The association will publicly denounce the center\'s conditions next week.' },

  { type: 'transform', level: 6, instruction: 'Rewrite using "de ahí que" + subjunctive to state a consequence:', from: 'El puente estaba en mal estado. Por eso lo cerraron.', to: 'El puente estaba en mal estado, de ahí que lo cerraran.', en: 'The bridge was in poor condition, hence why they closed it.' },
  { type: 'transform', level: 7, instruction: 'Rewrite avoiding "tú" — address the reader formally with "usted":', from: 'Si tienes alguna duda, puedes escribirnos cuando quieras.', to: 'Si tiene alguna duda, puede escribirnos cuando quiera.', en: 'If you have any doubts, you may write to us whenever you like.' },

  /* ---- B2 apply, batch 3 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Al final, la dirección ___ (ceder) a las peticiones de los empleados.', inf: 'ceder', tense: 'preterito', person: 'él/ella', en: 'In the end, management gave in to the employees\' requests.' },
  { type: 'cloze', level: 6, text: 'Yo, en su lugar, ___ (discrepar) abiertamente de esa decisión.', inf: 'discrepar', tense: 'condicional', person: 'yo', en: "In their place, I would openly disagree with that decision." },
  { type: 'cloze', level: 6, text: 'Es curioso que nuestras opiniones ___ (coincidir) tan pocas veces.', inf: 'coincidir', tense: 'presubj', person: 'ellos', en: 'It\'s odd that our opinions coincide so rarely.' },
  { type: 'cloze', level: 7, text: 'Antes de multarla, la autoridad exigió que la empresa ___ (justificar) el retraso.', inf: 'justificar', tense: 'impsubj', person: 'él/ella', en: 'Before fining it, the authority demanded that the company justify the delay.' },
  { type: 'cloze', level: 7, text: 'El abogado ___ (argumentar) mañana ante el tribunal que el contrato era nulo.', inf: 'argumentar', tense: 'futuro', person: 'él/ella', en: 'The lawyer will argue before the court tomorrow that the contract was void.' },
  { type: 'cloze', level: 6, text: 'Aunque todos se lo desaconsejaran, ella ___ (persistir) en su idea inicial.', inf: 'persistir', tense: 'preterito', person: 'él/ella', en: 'Although everyone advised her against it, she persisted with her original idea.' },
  { type: 'cloze', level: 7, text: 'Nadie esperaba que el pequeño sindicato ___ (desafiar) tan abiertamente a la dirección.', inf: 'desafiar', tense: 'perfsubj', person: 'él/ella', en: 'Nobody expected the small union to have so openly defied management.' },
  { type: 'cloze', level: 6, text: 'Para cuando se retire, ella ___ (ceder) su puesto a alguien de confianza.', inf: 'ceder', tense: 'futperf', person: 'él/ella', en: 'By the time she retires, she will have handed over her position to someone she trusts.' },

  { type: 'transform', level: 7, instruction: 'Rewrite using a double object pronoun (cliticCluster: "se lo/se la"):', from: 'El comité comunicó la decisión a los afectados.', to: 'El comité se la comunicó.', en: 'The committee communicated it to them.' },
  { type: 'transform', level: 6, instruction: 'Rewrite with at least three distinct tenses, narrating past, present relevance and a future consequence:', from: 'Cerraron la fábrica.', to: 'Cerraron la fábrica hace un año, la zona sigue deprimida, y muchos vecinos habrán tenido que mudarse para entonces.', en: 'They closed the factory a year ago, the area is still depressed, and many residents will likely have had to move by now.' },

  /* ---- B2 apply, batch 4 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Ambas partes ___ (acordar) ayer una tregua de setenta y dos horas.', inf: 'acordar', tense: 'preterito', person: 'ellos', en: 'Both sides agreed yesterday to a seventy-two-hour truce.' },
  { type: 'cloze', level: 6, text: 'Después de tres intentos fallidos, nosotros ___ (desistir) del recurso.', inf: 'desistir', tense: 'preterito', person: 'nosotros', en: 'After three failed attempts, we gave up on the appeal.' },
  { type: 'cloze', level: 7, text: 'El sindicato exige que la empresa ___ (acatar) la sentencia sin más demoras.', inf: 'acatar', tense: 'presubj', person: 'él/ella', en: 'The union demands that the company comply with the ruling without further delay.' },
  { type: 'cloze', level: 6, text: 'Ojalá ___ (zanjar, ellos) pronto esta disputa; lleva meses enquistada.', inf: 'zanjar', tense: 'presubj', person: 'ellos', en: 'I hope they settle this dispute soon; it has been stuck for months.' },
  { type: 'cloze', level: 6, text: 'Yo no ___ (tolerar) que me hablaran así en una reunión.', inf: 'tolerar', tense: 'condicional', person: 'yo', en: "I wouldn't tolerate being spoken to like that in a meeting." },
  { type: 'cloze', level: 6, text: 'Si el árbitro ___ (mediar) antes, el conflicto no habría llegado a los tribunales.', inf: 'mediar', tense: 'impsubj', person: 'él/ella', en: 'If the arbitrator had mediated earlier, the conflict would not have reached the courts.' },
  { type: 'cloze', level: 7, text: 'Para el viernes, el comité ya ___ (resolver) las últimas reclamaciones pendientes.', inf: 'resolver', tense: 'futperf', person: 'él/ella', en: 'By Friday, the committee will have already resolved the last outstanding claims.' },
  { type: 'cloze', level: 6, text: 'Durante años, los dos países ___ (pactar) acuerdos comerciales puntuales.', inf: 'pactar', tense: 'imperfecto', person: 'ellos', en: 'For years, the two countries used to negotiate occasional trade agreements.' },

  { type: 'transform', level: 7, instruction: 'Rewrite using the subjunctive after "aunque" to concede a point:', from: 'Es una buena oferta. Aun así, la rechazo.', to: 'Aunque sea una buena oferta, la rechazo.', en: 'Even though it may be a good offer, I reject it.' },
  { type: 'transform', level: 6, instruction: 'Rewrite avoiding colloquialisms (avoidsAny: "o sea", "vale", "guay") for a formal register:', from: 'O sea, vale, lo hacemos así, qué guay.', to: 'De acuerdo, procederemos de esa manera.', en: "Understood, we will proceed that way." },

  /* ---- B2 apply, batch 5 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Si no ___ (talar, ellos) tantos árboles, el suelo no se habría erosionado tan rápido.', inf: 'talar', tense: 'impsubj', person: 'ellos', en: "If they hadn't cut down so many trees, the soil wouldn't have eroded so fast." },
  { type: 'cloze', level: 6, text: 'La fábrica ___ (verter) residuos al río durante años antes de que la denunciaran.', inf: 'verter', tense: 'imperfecto', person: 'él/ella', en: 'The factory used to dump waste into the river for years before it was reported.' },
  { type: 'cloze', level: 7, text: 'Es fundamental que este humedal se ___ (preservar) tal como está.', inf: 'preservar', tense: 'presubj', person: 'él/ella', en: 'It is essential that this wetland be preserved just as it is.' },
  { type: 'cloze', level: 6, text: 'Para el año que viene, la central ___ (reducir) sus emisiones a la mitad.', inf: 'reducir', tense: 'futperf', person: 'él/ella', en: 'By next year, the plant will have cut its emissions in half.' },
  { type: 'cloze', level: 6, text: 'Ojalá esa especie no ___ (extinguirse) antes de que actuemos.', inf: 'extinguirse', tense: 'presubj', person: 'él/ella', en: 'I hope that species doesn\'t go extinct before we act.' },
  { type: 'cloze', level: 7, text: 'Los recursos pesqueros ___ (agotarse) por completo si seguimos pescando así.', inf: 'agotarse', tense: 'futuro', person: 'ellos', en: 'Fishing resources will run out completely if we keep fishing like this.' },
  { type: 'cloze', level: 6, text: 'Yo ___ (conservar) este bosque tal cual, sin ninguna concesión a la construcción.', inf: 'conservar', tense: 'condicional', person: 'yo', en: 'I would preserve this forest as it is, with no concessions to construction.' },
  { type: 'cloze', level: 6, text: 'Antes de esta ley, las empresas ___ (contaminar) los ríos sin ninguna consecuencia real.', inf: 'contaminar', tense: 'imperfecto', person: 'ellos', en: 'Before this law, companies used to pollute rivers with no real consequence.' },

  { type: 'transform', level: 6, instruction: 'Rewrite using the "se" passive construction:', from: 'Los trabajadores construyeron el puente en dos años.', to: 'El puente se construyó en dos años.', en: 'The bridge was built in two years.' },
  { type: 'transform', level: 7, instruction: 'Rewrite using at least four sentences that build an argument (minSentences: 4):', from: 'Talar el bosque es malo.', to: 'Talar el bosque tiene consecuencias graves. En primer lugar, acelera la erosión del suelo. Además, destruye el hábitat de numerosas especies. Por todo ello, cualquier tala debería exigir un estudio previo serio.', en: 'Felling the forest has serious consequences. First, it accelerates soil erosion. It also destroys the habitat of numerous species. For all these reasons, any felling should require a serious prior study.' },

  /* ---- B2 apply, batch 6 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Desde que se fue, ella ___ (añorar) el ruido de la casa llena de gente.', inf: 'añorar', tense: 'presente', person: 'él/ella', en: 'Ever since she left, she misses the noise of a house full of people.' },
  { type: 'cloze', level: 6, text: 'Ojalá vosotros ___ (apreciar) más lo que tenéis antes de perderlo.', inf: 'apreciar', tense: 'presubj', person: 'vosotros', en: 'I wish you all appreciated what you have before losing it.' },
  { type: 'cloze', level: 7, text: 'Si él no ___ (desconfiar) tanto de todo el mundo, tendría más amigos.', inf: 'desconfiar', tense: 'presente', person: 'él/ella', en: "If he didn't distrust everyone so much, he would have more friends." },
  { type: 'cloze', level: 6, text: 'De joven, yo siempre ___ (anhelar) un cambio así en mi vida.', inf: 'anhelar', tense: 'imperfecto', person: 'yo', en: 'As a young person, I always longed for a change like this in my life.' },
  { type: 'cloze', level: 7, text: 'Al final, aquel malentendido ___ (frustrar) todos sus planes de boda.', inf: 'frustrar', tense: 'preterito', person: 'él/ella', en: 'In the end, that misunderstanding thwarted all their wedding plans.' },
  { type: 'cloze', level: 6, text: 'Nos ___ (compadecer, nosotros) sinceramente de su situación, aunque no pudiéramos ayudar.', inf: 'compadecer', tense: 'preterito', person: 'nosotros', en: 'We genuinely felt for his situation, even though we couldn\'t help.' },
  { type: 'cloze', level: 6, text: 'Cuando por fin llegó la noticia, ella se ___ (aliviar) visiblemente.', inf: 'aliviar', tense: 'preterito', person: 'él/ella', en: 'When the news finally arrived, she was visibly relieved.' },
  { type: 'cloze', level: 6, text: 'Me ___ (avergonzarse) mucho de cómo reaccioné aquella tarde.', inf: 'avergonzarse', tense: 'presente', person: 'yo', en: "I'm quite ashamed of how I reacted that afternoon." },

  { type: 'transform', level: 6, instruction: 'Rewrite as a formal write task avoiding "tú" throughout (avoidsPerson: tú):', from: 'Si tú quieres, te puedo ayudar con eso.', to: 'Si usted lo desea, puedo ayudarle con eso.', en: 'If you wish, I can help you with that.' },
  { type: 'transform', level: 7, instruction: 'Rewrite using a connector from the contraargumentativo class:', from: 'El proyecto es caro. Lo aprobamos igualmente.', to: 'El proyecto es caro; no obstante, lo aprobamos.', en: 'The project is expensive; nevertheless, we approved it.' },

  /* ---- B2 apply, batch 7 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Si hubiera trabajado más duro aquel año, la ___ (ascender, ellos) antes.', inf: 'ascender', tense: 'condperf', person: 'ellos', en: 'If she had worked harder that year, they would have promoted her sooner.' },
  { type: 'cloze', level: 6, text: 'La empresa ___ (despedir) a un tercio de la plantilla el mes pasado.', inf: 'despedir', tense: 'preterito', person: 'él/ella', en: 'The company laid off a third of its staff last month.' },
  { type: 'cloze', level: 7, text: 'Es probable que la dirección ___ (reestructurar) todo el departamento este trimestre.', inf: 'reestructurar', tense: 'presubj', person: 'él/ella', en: 'It is likely that management will restructure the whole department this quarter.' },
  { type: 'cloze', level: 6, text: 'Para diciembre, la empresa ya ___ (contratar) a los cincuenta nuevos empleados previstos.', inf: 'contratar', tense: 'futperf', person: 'él/ella', en: 'By December, the company will have already hired the fifty new employees planned.' },
  { type: 'cloze', level: 6, text: 'Yo no ___ (delegar) una tarea tan delicada en alguien tan nuevo.', inf: 'delegar', tense: 'condicional', person: 'yo', en: "I wouldn't delegate such a delicate task to someone so new." },
  { type: 'cloze', level: 7, text: 'El nuevo gerente exige que alguien ___ (supervisar) personalmente cada envío.', inf: 'supervisar', tense: 'presubj', person: 'él/ella', en: 'The new manager demands that someone personally supervise each shipment.' },
  { type: 'cloze', level: 6, text: 'Aquella empresa ___ (quebrar) apenas dos años después de fundarse.', inf: 'quebrar', tense: 'preterito', person: 'él/ella', en: 'That company went bankrupt barely two years after it was founded.' },
  { type: 'cloze', level: 6, text: 'Durante la crisis, muchas familias ___ (ahorrar) hasta el último céntimo posible.', inf: 'ahorrar', tense: 'imperfecto', person: 'ellos', en: 'During the crisis, many families saved every last cent they could.' },

  { type: 'transform', level: 6, instruction: 'Rewrite using the pluscuamperfecto via a relative clause:', from: 'Compraron el piso. Antes lo habían visitado tres veces.', to: 'El piso que habían visitado tres veces fue el que finalmente compraron.', en: 'The apartment they had visited three times was the one they finally bought.' },
  { type: 'transform', level: 7, instruction: 'Rewrite as reported speech using "dijo que" (correlación de marcas: tense and deixis shift):', from: 'La directora dijo: "Mañana anunciaremos los despidos aquí."', to: 'La directora dijo que al día siguiente anunciarían los despidos allí.', en: 'The director said that the next day they would announce the layoffs there.' },

  /* ---- B2 apply, batch 8 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Es raro que todavía no le ___ (diagnosticar, ellos) nada, con esos síntomas.', inf: 'diagnosticar', tense: 'perfsubj', person: 'ellos', en: "It's strange they still haven't diagnosed anything, with those symptoms." },
  { type: 'cloze', level: 6, text: 'El médico le ___ (recetar) un tratamiento nuevo la semana pasada.', inf: 'recetar', tense: 'preterito', person: 'él/ella', en: 'The doctor prescribed him a new treatment last week.' },
  { type: 'cloze', level: 7, text: 'Para cuando llegue el especialista, ya la ___ (operar, ellos) de urgencia.', inf: 'operar', tense: 'futperf', person: 'ellos', en: 'By the time the specialist arrives, they will have already operated on her as an emergency.' },
  { type: 'cloze', level: 6, text: 'Si te hubieras vacunado a tiempo, no te ___ (contagiar).', inf: 'contagiar', tense: 'condperf', person: 'tú', en: "If you had gotten vaccinated in time, you wouldn't have gotten infected." },
  { type: 'cloze', level: 6, text: 'Ojalá su estado no ___ (empeorar) durante la noche.', inf: 'empeorar', tense: 'presubj', person: 'él/ella', en: "I hope his condition doesn't worsen overnight." },
  { type: 'cloze', level: 7, text: 'Yo ___ (intervenir) quirúrgicamente solo como última opción.', inf: 'intervenir', tense: 'condicional', person: 'yo', en: 'I would only operate surgically as a last resort.' },
  { type: 'cloze', level: 6, text: 'Después del accidente, ella ___ (recuperarse) mucho más rápido de lo esperado.', inf: 'recuperarse', tense: 'preterito', person: 'él/ella', en: 'After the accident, she recovered much faster than expected.' },
  { type: 'cloze', level: 6, text: 'Muchos pacientes ___ (padecer) esta enfermedad durante años sin saberlo.', inf: 'padecer', tense: 'imperfecto', person: 'ellos', en: 'Many patients used to suffer from this disease for years without knowing it.' },

  { type: 'transform', level: 6, instruction: 'Rewrite reaching the subjunctive after "para que":', from: 'Le recetaron el jarabe. Así dejaría de toser.', to: 'Le recetaron el jarabe para que dejara de toser.', en: 'They prescribed him the syrup so that he would stop coughing.' },
  { type: 'transform', level: 7, instruction: 'Rewrite as a formal register write task avoiding informal words (avoidsAny: "vale", "tío", "guay"):', from: 'Vale, tío, el análisis salió guay, no te preocupes.', to: 'De acuerdo, los resultados del análisis son satisfactorios; no hay motivo de preocupación.', en: 'Understood, the test results are satisfactory; there is no reason for concern.' },

  /* ---- B2 apply, batch 9 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Cuando yo ___ (matricularse) en la universidad, todavía no existía internet.', inf: 'matricularse', tense: 'preterito', person: 'yo', en: 'When I enrolled at university, the internet didn\'t exist yet.' },
  { type: 'cloze', level: 6, text: 'Si hubiera estudiado más idiomas, ella se ___ (especializarse) en traducción.', inf: 'especializarse', tense: 'condperf', person: 'él/ella', en: 'If she had studied more languages, she would have specialized in translation.' },
  { type: 'cloze', level: 7, text: 'Es fundamental que el profesorado ___ (evaluar) a cada alumno individualmente.', inf: 'evaluar', tense: 'presubj', person: 'él/ella', en: 'It is essential that the teaching staff evaluate each student individually.' },
  { type: 'cloze', level: 6, text: 'Para junio, nosotros ya ___ (redactar) toda la tesis.', inf: 'redactar', tense: 'futperf', person: 'nosotros', en: 'By June, we will have already written the whole thesis.' },
  { type: 'cloze', level: 6, text: 'Yo nunca ___ (copiar) en un examen, ni siquiera de adolescente.', inf: 'copiar', tense: 'perfecto', person: 'yo', en: 'I have never cheated on an exam, not even as a teenager.' },
  { type: 'cloze', level: 6, text: 'Antes de aprobar la reforma, el ministerio ___ (revisar) el plan varias veces.', inf: 'revisar', tense: 'plusc', person: 'él/ella', en: 'Before approving the reform, the ministry had reviewed the plan several times.' },
  { type: 'cloze', level: 7, text: 'Dudo que el tribunal ___ (calificar) el examen tan pronto.', inf: 'calificar', tense: 'presubj', person: 'él/ella', en: 'I doubt the panel will have graded the exam so soon.' },
  { type: 'cloze', level: 6, text: 'De niño, mi abuela ___ (formarse) sola, sin apenas ir a la escuela.', inf: 'formarse', tense: 'imperfecto', person: 'él/ella', en: 'As a child, my grandmother used to educate herself, barely attending school.' },

  { type: 'transform', level: 6, instruction: 'Rewrite using distinct tenses to narrate a whole academic journey (distinctTenses: 3):', from: 'Estudió medicina.', to: 'Estudió medicina durante seis años, ahora trabaja en un hospital y para el próximo año se habrá especializado en cirugía.', en: 'She studied medicine for six years, now works at a hospital, and by next year will have specialized in surgery.' },
  { type: 'transform', level: 7, instruction: 'Rewrite as a "se" construction avoiding naming who corrected it:', from: 'Alguien corrigió mal el examen.', to: 'El examen se corrigió mal.', en: 'The exam was graded incorrectly.' },

  /* ---- B2 apply, batch 10 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Antes de contestar, ella ___ (bloquear) a ese usuario por si acaso.', inf: 'bloquear', tense: 'perfecto', person: 'él/ella', en: 'Before replying, she has blocked that user just in case.' },
  { type: 'cloze', level: 6, text: 'Si el gobierno ___ (censurar) esa noticia, la gente igualmente se habría enterado.', inf: 'censurar', tense: 'impsubj', person: 'él/ella', en: 'If the government had censored that news, people would have found out anyway.' },
  { type: 'cloze', level: 7, text: 'Es posible que alguien ___ (filtrar) los documentos antes de la publicación oficial.', inf: 'filtrar', tense: 'perfsubj', person: 'él/ella', en: 'It\'s possible that someone leaked the documents before the official release.' },
  { type: 'cloze', level: 6, text: 'Para mañana, los técnicos ya ___ (actualizar) la aplicación con el nuevo parche de seguridad.', inf: 'actualizar', tense: 'futperf', person: 'ellos', en: 'By tomorrow, the technicians will have already updated the app with the new security patch.' },
  { type: 'cloze', level: 6, text: 'Yo nunca ___ (suscribirse) a un servicio sin leer antes las condiciones.', inf: 'suscribirse', tense: 'condicional', person: 'yo', en: "I would never subscribe to a service without reading the terms first." },
  { type: 'cloze', level: 6, text: 'El vídeo se ___ (difundir) por todas las redes en cuestión de horas.', inf: 'difundir', tense: 'preterito', person: 'él/ella', en: 'The video spread across every social network within hours.' },
  { type: 'cloze', level: 7, text: 'Insistió en que le ___ (silenciar, ellos) las notificaciones durante la reunión.', inf: 'silenciar', tense: 'impsubj', person: 'ellos', en: 'She insisted that they silence her notifications during the meeting.' },
  { type: 'cloze', level: 6, text: 'De adolescente, yo ___ (descargar) música ilegalmente sin pensarlo dos veces.', inf: 'descargar', tense: 'imperfecto', person: 'yo', en: 'As a teenager, I used to download music illegally without a second thought.' },

  { type: 'transform', level: 6, instruction: 'Rewrite using a double object pronoun cluster (cliticCluster):', from: 'La aplicación mandó la alerta a los usuarios.', to: 'La aplicación se la mandó.', en: 'The app sent it to them.' },
  { type: 'transform', level: 7, instruction: 'Rewrite with at least four sentences weighing pros and cons (minSentences: 4):', from: 'Piratear contenido está mal.', to: 'Descargar contenido pirata parece gratuito, pero no lo es del todo. Por un lado, ahorra dinero a corto plazo. Por otro lado, perjudica directamente a los creadores originales. En definitiva, conviene sopesar ambos efectos antes de decidir.', en: 'Downloading pirated content seems free, but it isn\'t entirely. On one hand, it saves money short-term. On the other, it directly harms the original creators. Ultimately, both effects are worth weighing before deciding.' },

  /* ---- B2 apply, batch 11 of 12 ---- */
  { type: 'cloze', level: 6, text: 'Después de meses sin hablarse, por fin ellos se ___ (reconciliarse).', inf: 'reconciliarse', tense: 'perfecto', person: 'ellos', en: 'After months without speaking, they have finally reconciled.' },
  { type: 'cloze', level: 6, text: 'Si él no la ___ (traicionar), seguirían siendo socios hoy.', inf: 'traicionar', tense: 'impsubj', person: 'él/ella', en: 'If he hadn\'t betrayed her, they would still be business partners today.' },
  { type: 'cloze', level: 7, text: 'Es poco probable que la fiscalía lo ___ (acusar) sin pruebas sólidas.', inf: 'acusar', tense: 'presubj', person: 'él/ella', en: 'It is unlikely that the prosecution will accuse him without solid evidence.' },
  { type: 'cloze', level: 6, text: 'Para cuando cumplan un año de bodas, ya se ___ (distanciarse, ellos) bastante.', inf: 'distanciarse', tense: 'futperf', person: 'ellos', en: 'By the time they reach their first wedding anniversary, they will have already grown quite distant.' },
  { type: 'cloze', level: 6, text: 'Yo jamás ___ (perdonar) una mentira tan grande.', inf: 'perdonar', tense: 'condicional', person: 'yo', en: 'I would never forgive such a big lie.' },
  { type: 'cloze', level: 6, text: 'Mis padres ___ (divorciarse) cuando yo tenía diez años.', inf: 'divorciarse', tense: 'preterito', person: 'ellos', en: 'My parents got divorced when I was ten.' },
  { type: 'cloze', level: 7, text: 'Ella se ___ (enamorarse) de él antes de conocerlo siquiera en persona.', inf: 'enamorarse', tense: 'plusc', person: 'él/ella', en: 'She had fallen in love with him before even meeting him in person.' },
  { type: 'cloze', level: 6, text: 'Aunque discutan mucho, dudo que ___ (separarse, ellos) de verdad.', inf: 'separarse', tense: 'presubj', person: 'ellos', en: 'Even though they argue a lot, I doubt they will really separate.' },

  { type: 'transform', level: 6, instruction: 'Rewrite reaching the subjunctive after "aunque" to concede a point:', from: 'Se traicionaron una vez. Aun así, siguen siendo amigos.', to: 'Aunque se hayan traicionado una vez, siguen siendo amigos.', en: 'Even though they may have betrayed each other once, they are still friends.' },
  { type: 'transform', level: 7, instruction: 'Rewrite as reported speech, starting with "Ella confesó que...":', from: 'Ella dijo: "Lo traicioné porque tenía miedo."', to: 'Ella confesó que lo había traicionado porque tenía miedo.', en: 'She confessed that she had betrayed him because she was scared.' },

  /* ---- B2 apply, batch 12 of 12 — completes 120/120 ---- */
  { type: 'cloze', level: 6, text: 'La empresa ___ (demandar) al proveedor por incumplimiento de contrato el mes pasado.', inf: 'demandar', tense: 'preterito', person: 'él/ella', en: 'The company sued the supplier for breach of contract last month.' },
  { type: 'cloze', level: 7, text: 'Es improbable que el tribunal lo ___ (condenar) sin ninguna prueba directa.', inf: 'condenar', tense: 'presubj', person: 'él/ella', en: 'It is unlikely that the court will convict him without any direct evidence.' },
  { type: 'cloze', level: 6, text: 'Si hubieran presentado la coartada a tiempo, lo ___ (absolver, ellos) de inmediato.', inf: 'absolver', tense: 'condperf', person: 'ellos', en: 'If they had presented the alibi in time, they would have acquitted him immediately.' },
  { type: 'cloze', level: 6, text: 'La defensa ___ (apelar) la sentencia en cuanto se publique.', inf: 'apelar', tense: 'futuro', person: 'él/ella', en: 'The defense will appeal the ruling as soon as it is published.' },
  { type: 'cloze', level: 7, text: 'El juez ordenó que la aseguradora ___ (indemnizar) a las víctimas del accidente.', inf: 'indemnizar', tense: 'impsubj', person: 'él/ella', en: 'The judge ordered the insurance company to compensate the accident victims.' },
  { type: 'cloze', level: 6, text: 'La policía ya ___ (multar) a tres conductores por exceso de velocidad esta mañana.', inf: 'multar', tense: 'perfecto', person: 'él/ella', en: 'The police have already fined three drivers for speeding this morning.' },
  { type: 'cloze', level: 6, text: 'Yo ___ (testificar) a su favor sin dudarlo, si me lo pidieran.', inf: 'testificar', tense: 'condicional', person: 'yo', en: 'I would testify in his favor without hesitation, if they asked me to.' },
  { type: 'cloze', level: 6, text: 'Para cuando acabe el juicio, el fiscal ya ___ (jurar) que apelaría cualquier absolución.', inf: 'jurar', tense: 'futperf', person: 'él/ella', en: 'By the time the trial ends, the prosecutor will have already sworn to appeal any acquittal.' },

  { type: 'transform', level: 7, instruction: 'Rewrite as a "se" construction avoiding naming who fined the driver:', from: 'Un agente multó al conductor por aparcar mal.', to: 'Al conductor se le multó por aparcar mal.', en: 'The driver was fined for parking badly.' },
  { type: 'transform', level: 6, instruction: 'Rewrite using at least three distinct tenses to narrate a legal case from start to resolution (distinctTenses: 3):', from: 'Lo demandaron.', to: 'Lo demandaron hace dos años, el juicio sigue abierto todavía, y para el próximo verano probablemente ya se habrá resuelto.', en: 'He was sued two years ago, the trial is still open, and by next summer it will probably have been resolved already.' },

  // ---- C1 ----
  { type: 'cloze', level: 9, text: 'Es una lástima que el gobierno todavía no ___ (invertir) más en investigación básica.', inf: 'invertir', tense: 'perfsubj', person: 'él/ella', en: 'It is a shame the government still has not invested more in basic research.' },
  { type: 'cloze', level: 9, text: 'Si el testigo ___ (declarar) ahora mismo, el juicio duraría mucho menos.', inf: 'declarar', tense: 'impsubj', person: 'él/ella', en: 'If the witness were to testify right now, the trial would last much less.' },
  { type: 'cloze', level: 9, text: 'Si hubiéramos conocido antes los resultados, la empresa ___ (invertir) de otra manera.', inf: 'invertir', tense: 'condperf', person: 'él/ella', en: 'If we had known the results earlier, the company would have invested differently.' },
  { type: 'cloze', level: 9, text: 'Para cuando se resuelva el caso, el acusado ya ___ (cumplir) media condena.', inf: 'cumplir', tense: 'futperf', person: 'él/ella', en: 'By the time the case is resolved, the defendant will have already served half his sentence.' },
  { type: 'cloze', level: 8, text: 'Cuando llegaron los inspectores, la fábrica ya ___ (cerrar) sus puertas.', inf: 'cerrar', tense: 'plusc', person: 'él/ella', en: 'When the inspectors arrived, the factory had already closed its doors.' },
  { type: 'cloze', level: 9, text: 'No creo que las nuevas medidas ___ (resolver) el problema de fondo.', inf: 'resolver', tense: 'presubj', person: 'ellos', en: 'I do not think the new measures will solve the underlying problem.' },
  { type: 'cloze', level: 8, text: '___ (completar) el formulario antes de las cinco de la tarde, por favor.', inf: 'completar', tense: 'imperativo', person: 'usted', en: 'Please fill out the form before five in the afternoon.' },
  { type: 'cloze', level: 9, text: 'No ___ (revelar) la fuente de la información bajo ninguna circunstancia.', inf: 'revelar', tense: 'impneg', person: 'usted', en: 'Do not reveal the source of the information under any circumstances.' },
  { type: 'transform', level: 9, instruction: 'Rewrite as reported speech, starting with "El ministro declaró que...":', from: 'El ministro dijo: "Revisaremos la ley el próximo mes."', to: 'El ministro declaró que revisarían la ley el mes siguiente.', en: 'The minister stated that they would review the law the following month.' },
  { type: 'transform', level: 9, instruction: 'Rewrite as an impersonal "se" construction, without naming who took the decision:', from: 'El comité tomó la decisión sin consultar a los empleados.', to: 'La decisión se tomó sin consultar a los empleados.', en: 'The decision was made without consulting the employees.' },

  { type: 'cloze', level: 9, text: 'Buscaban un candidato que ___ (dominar) al menos tres idiomas.', inf: 'dominar', tense: 'impsubj', person: 'él/ella', en: 'They were looking for a candidate who commanded at least three languages.' },
  { type: 'cloze', level: 8, text: 'Es posible que la vacuna ___ (reducir) los contagios notablemente.', inf: 'reducir', tense: 'presubj', person: 'él/ella', en: 'It is possible the vaccine will notably reduce infections.' },
  { type: 'cloze', level: 8, text: 'Los científicos ya ___ (publicar) los resultados preliminares.', inf: 'publicar', tense: 'perfecto', person: 'ellos', en: 'The scientists have already published the preliminary results.' },
  { type: 'cloze', level: 8, text: 'Yo, en su lugar, ___ (renunciar) al cargo inmediatamente.', inf: 'renunciar', tense: 'condicional', person: 'yo', en: 'In their place, I would resign from the position immediately.' },
  { type: 'cloze', level: 8, text: 'El tribunal ___ (dictar) sentencia la próxima semana.', inf: 'dictar', tense: 'futuro', person: 'él/ella', en: 'The court will hand down a ruling next week.' },
  { type: 'cloze', level: 8, text: 'La comisión ___ (rechazar) la propuesta por mayoría.', inf: 'rechazar', tense: 'preterito', person: 'él/ella', en: 'The committee rejected the proposal by majority vote.' },
  { type: 'cloze', level: 8, text: 'Antes de la reforma, los funcionarios ___ (necesitar) meses para resolver cada expediente.', inf: 'necesitar', tense: 'imperfecto', person: 'ellos', en: 'Before the reform, officials used to need months to resolve each case file.' },
  { type: 'cloze', level: 9, text: 'De haber tenido más pruebas, la fiscalía ___ (presentar) cargos adicionales.', inf: 'presentar', tense: 'condperf', person: 'él/ella', en: 'Had they had more evidence, the prosecution would have filed additional charges.' },
  { type: 'transform', level: 9, instruction: 'Rewrite conceding a point with "aunque" + subjunctive:', from: 'El proyecto es ambicioso. Aun así, podría fracasar.', to: 'Aunque el proyecto sea ambicioso, podría fracasar.', en: 'Although the project may be ambitious, it could fail.' },
  { type: 'transform', level: 8, instruction: 'Rewrite in a formal register, addressing the reader as usted:', from: 'Tienes que enviar el documento antes del viernes.', to: 'Tiene que enviar el documento antes del viernes.', en: 'You must send the document before Friday.' },

  { type: 'cloze', level: 8, text: 'Espero que la reunión no ___ (durar) demasiado.', inf: 'durar', tense: 'presubj', person: 'él/ella', en: 'I hope the meeting does not last too long.' },
  { type: 'cloze', level: 8, text: 'Le pedí que ___ (guardar) el secreto.', inf: 'guardar', tense: 'impsubj', person: 'él/ella', en: 'I asked him to keep the secret.' },
  { type: 'cloze', level: 9, text: 'Ojalá que el comité ya ___ (decidir) el ganador.', inf: 'decidir', tense: 'perfsubj', person: 'él/ella', en: 'I hope the committee has already decided the winner.' },
  { type: 'cloze', level: 8, text: '¿___ (poder) usted confirmarme la cita para mañana?', inf: 'poder', tense: 'condicional', person: 'él/ella', en: 'Could you confirm the appointment for tomorrow?' },
  { type: 'cloze', level: 9, text: 'Para el año que viene, la universidad ya ___ (aplicar) el nuevo plan de estudios.', inf: 'aplicar', tense: 'futperf', person: 'él/ella', en: 'By next year, the university will have already applied the new curriculum.' },
  { type: 'cloze', level: 9, text: 'Cuando por fin llegó la ayuda, muchos vecinos ya ___ (abandonar) sus casas.', inf: 'abandonar', tense: 'plusc', person: 'ellos', en: 'When help finally arrived, many neighbors had already abandoned their homes.' },
  { type: 'cloze', level: 8, text: 'El abogado ___ (redactar) el recurso justo a tiempo.', inf: 'redactar', tense: 'preterito', person: 'él/ella', en: 'The lawyer drafted the appeal just in time.' },
  { type: 'cloze', level: 8, text: 'Cada vez que sube el precio del petróleo, la inflación ___ (afectar) directamente al bolsillo del consumidor.', inf: 'afectar', tense: 'presente', person: 'él/ella', en: 'Every time the price of oil rises, inflation directly affects the consumer\'s pocket.' },
  { type: 'transform', level: 9, instruction: 'Rewrite replacing both objects with clitic pronouns:', from: 'El juez explicó la sentencia a los acusados.', to: 'El juez se la explicó.', en: 'The judge explained it to them.' },
  { type: 'transform', level: 9, instruction: 'Rewrite narrating a career using at least three distinct tenses (distinctTenses: 3):', from: 'Empezó como becaria.', to: 'Empezó como becaria hace diez años, hoy dirige el departamento, y para su jubilación probablemente habrá formado a decenas de sucesores.', en: 'She started as an intern ten years ago, today she runs the department, and by her retirement she will probably have trained dozens of successors.' },

  { type: 'cloze', level: 8, text: 'No es que ellos no ___ (querer) ayudar, es que no pueden.', inf: 'querer', tense: 'presubj', person: 'ellos', en: 'It is not that they do not want to help, it is that they cannot.' },
  { type: 'cloze', level: 8, text: 'Si yo ___ (tener) que elegir, preferiría la opción más segura.', inf: 'tener', tense: 'impsubj', person: 'yo', en: 'If I had to choose, I would prefer the safer option.' },
  { type: 'cloze', level: 9, text: 'Es extraño que nadie ___ (avisar) a los vecinos.', inf: 'avisar', tense: 'perfsubj', person: 'él/ella', en: 'It is strange that no one has warned the neighbors.' },
  { type: 'cloze', level: 9, text: 'Si lo hubiéramos sabido antes, nosotros ___ (responder) de otra forma.', inf: 'responder', tense: 'condperf', person: 'nosotros', en: 'If we had known beforehand, we would have responded differently.' },
  { type: 'cloze', level: 8, text: 'Para entonces, el equipo ya ___ (terminar) el proyecto.', inf: 'terminar', tense: 'futperf', person: 'él/ella', en: 'By then, the team will have already finished the project.' },
  { type: 'cloze', level: 8, text: 'Nadie se dio cuenta de que el sistema ya ___ (fallar) varias veces.', inf: 'fallar', tense: 'plusc', person: 'él/ella', en: 'No one noticed that the system had already failed several times.' },
  { type: 'cloze', level: 8, text: '___ (firmar) aquí, por favor.', inf: 'firmar', tense: 'imperativo', person: 'usted', en: 'Sign here, please.' },
  { type: 'cloze', level: 8, text: 'No ___ (confirmar) la reserva todavía; falta revisar una cláusula.', inf: 'confirmar', tense: 'impneg', person: 'usted', en: 'Do not confirm the reservation yet; a clause still needs reviewing.' },
  { type: 'transform', level: 9, instruction: 'Rewrite using "para que" + subjunctive to express purpose:', from: 'Firmaron el acuerdo. Así evitarían una demanda.', to: 'Firmaron el acuerdo para que se evitara una demanda.', en: 'They signed the agreement so that a lawsuit would be avoided.' },
  { type: 'transform', level: 8, instruction: 'Rewrite as a negation:', from: 'Todos los socios aprobaron la fusión.', to: 'No todos los socios aprobaron la fusión.', en: 'Not all the partners approved the merger.' },

  { type: 'cloze', level: 9, text: 'Dudo que el ministro ___ (reconocer) públicamente el error.', inf: 'reconocer', tense: 'presubj', person: 'él/ella', en: 'I doubt the minister will publicly acknowledge the mistake.' },
  { type: 'cloze', level: 8, text: 'El profesor exigía que los alumnos ___ (entregar) el trabajo a tiempo.', inf: 'entregar', tense: 'impsubj', person: 'ellos', en: 'The teacher demanded that the students hand in the assignment on time.' },
  { type: 'cloze', level: 8, text: 'Me alegra que por fin lo ___ (conseguir) ellos.', inf: 'conseguir', tense: 'perfsubj', person: 'ellos', en: 'I am glad they have finally achieved it.' },
  { type: 'cloze', level: 8, text: 'Nunca ___ (imaginar) yo semejante reacción.', inf: 'imaginar', tense: 'condicional', person: 'yo', en: 'I would never have imagined such a reaction.' },
  { type: 'cloze', level: 8, text: 'La empresa ___ (anunciar) los resultados el jueves.', inf: 'anunciar', tense: 'futuro', person: 'él/ella', en: 'The company will announce the results on Thursday.' },
  { type: 'cloze', level: 8, text: 'El comité ___ (aprobar) el presupuesto por unanimidad.', inf: 'aprobar', tense: 'preterito', person: 'él/ella', en: 'The committee approved the budget unanimously.' },
  { type: 'cloze', level: 8, text: 'De joven, ella ___ (desear) ser diplomática.', inf: 'desear', tense: 'imperfecto', person: 'él/ella', en: 'As a young woman, she used to wish to be a diplomat.' },
  { type: 'cloze', level: 8, text: 'Todavía no ___ (recibir) nosotros ninguna respuesta oficial.', inf: 'recibir', tense: 'perfecto', person: 'nosotros', en: 'We still have not received any official response.' },
  { type: 'transform', level: 8, instruction: 'Rewrite as an impersonal "se" construction:', from: 'Los responsables anunciaron nuevas medidas.', to: 'Se anunciaron nuevas medidas.', en: 'New measures were announced.' },
  { type: 'transform', level: 9, instruction: 'Rewrite avoiding colloquial words, for a formal report:', from: 'La cosa empeoró bastante al final.', to: 'La situación empeoró considerablemente al final.', en: 'The situation worsened considerably in the end.' }

];
