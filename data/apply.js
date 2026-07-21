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
  { type: 'cloze', level: 2, text: 'Ayer nosotros ___ (decidir) cambiar de casa.', inf: 'decidir', tense: 'preterito', person: 'nosotros', en: 'Yesterday we decided to change houses.' }

];
