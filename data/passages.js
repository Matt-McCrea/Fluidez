/* ============================================================================
 * PASSAGES — short readings for the "Comprender" (Comprehend) stage.
 * Each has a Spanish text and questions. Question types:
 *   mcq       : multiple choice, `answer` = index of correct option (auto)
 *   short     : type a short Spanish answer, `accept` = acceptable answers (auto)
 *   translate : translate one line to English, `model` shown on reveal (self)
 * `gloss` gives a few key words as a crutch (shown under the text).
 * ========================================================================== */
window.PASSAGES = [

{
  id: 'rutina', title: 'La rutina de Marta', level: 1,
  text: 'Marta vive en Sevilla. Todos los días se levanta a las siete y desayuna café con tostadas. Trabaja en una tienda de ropa en el centro. Al mediodía come con sus compañeros en un bar cerca del trabajo. Por la tarde estudia inglés porque quiere viajar a Londres. Los fines de semana visita a su familia y pasea por el río.',
  gloss: [
    { es: 'se levanta', en: 'she gets up' },
    { es: 'tostadas', en: 'toast' },
    { es: 'compañeros', en: 'colleagues' },
    { es: 'los fines de semana', en: 'on weekends' }
  ],
  questions: [
    { type: 'mcq', q: '¿A qué hora se levanta Marta?', options: ['A las seis', 'A las siete', 'A las ocho'], answer: 1 },
    { type: 'mcq', q: '¿Por qué estudia inglés?', options: ['Para trabajar en la tienda', 'Porque quiere viajar a Londres', 'Para hablar con su familia'], answer: 1 },
    { type: 'short', q: '¿Dónde vive Marta? (una palabra)', accept: ['sevilla', 'en sevilla'] },
    { type: 'translate', line: 'Por la tarde estudia inglés porque quiere viajar a Londres.', model: 'In the afternoon she studies English because she wants to travel to London.' }
  ]
},

{
  id: 'viaje', title: 'Un viaje a la montaña', level: 2,
  text: 'El verano pasado, mis amigos y yo fuimos a los Pirineos. Salimos muy temprano porque el camino era largo. Mientras conducíamos, escuchábamos música y hablábamos de todo. Cuando llegamos, hacía frío y llovía un poco, pero estábamos muy contentos. Pasamos tres días en una casa pequeña y cocinamos juntos cada noche. Fue un viaje que nunca voy a olvidar.',
  gloss: [
    { es: 'el verano pasado', en: 'last summer' },
    { es: 'el camino', en: 'the road/way' },
    { es: 'mientras', en: 'while' },
    { es: 'juntos', en: 'together' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuándo fue el viaje?', options: ['El verano pasado', 'La semana pasada', 'El invierno pasado'], answer: 0 },
    { type: 'mcq', q: '¿Qué tiempo hacía cuando llegaron?', options: ['Hacía calor y sol', 'Hacía frío y llovía', 'Nevaba mucho'], answer: 1 },
    { type: 'mcq', q: '¿Por qué salieron temprano?', options: ['Porque el camino era largo', 'Porque tenían hambre', 'Porque llovía'], answer: 0 },
    { type: 'translate', line: 'Fue un viaje que nunca voy a olvidar.', model: 'It was a trip that I am never going to forget.' }
  ]
},

{
  id: 'mercado', title: 'En el mercado', level: 1,
  text: 'Hoy Diego está en el mercado. Es sábado y hay mucha gente. Diego busca fruta fresca para preparar una cena especial esta noche. Compra manzanas, naranjas y un poco de pescado. El pescado es para su madre, que viene a cenar. Diego paga con tarjeta porque no tiene dinero en efectivo. Cuando llega a casa, está cansado pero contento.',
  gloss: [
    { es: 'hay mucha gente', en: 'there are many people' },
    { es: 'fresca', en: 'fresh' },
    { es: 'en efectivo', en: 'in cash' }
  ],
  questions: [
    { type: 'mcq', q: '¿Para quién es el pescado?', options: ['Para Diego', 'Para su madre', 'Para un amigo'], answer: 1 },
    { type: 'mcq', q: '¿Por qué paga con tarjeta?', options: ['Porque es más rápido', 'Porque no tiene efectivo', 'Porque es sábado'], answer: 1 },
    { type: 'short', q: '¿Qué día es? (una palabra)', accept: ['sábado', 'sabado', 'es sábado'] },
    { type: 'translate', line: 'Cuando llega a casa, está cansado pero contento.', model: 'When he gets home, he is tired but happy.' }
  ]
},

{
  id: 'oficina', title: 'Un día en la oficina', level: 1,
  text: 'Pablo trabaja en una oficina grande en el centro de la ciudad. Todos los días llega a las nueve y saluda a sus compañeros. Prepara un café y organiza sus tareas antes de empezar. A las dos, come con su equipo en la cafetería. Por la tarde escribe correos y asiste a reuniones importantes. Pablo es una persona muy organizada y siempre termina su trabajo a tiempo. A las seis, sale de la oficina y camina a casa porque vive cerca.',
  gloss: [
    { es: 'la oficina', en: 'the office' },
    { es: 'saluda', en: 'greets' },
    { es: 'la cafetería', en: 'the cafeteria' },
    { es: 'a tiempo', en: 'on time' }
  ],
  questions: [
    { type: 'mcq', q: '¿A qué hora llega Pablo a la oficina?', options: ['A las ocho', 'A las nueve', 'A las diez'], answer: 1 },
    { type: 'mcq', q: '¿Por qué camina a casa?', options: ['Porque no tiene coche', 'Porque vive cerca', 'Porque le gusta el ejercicio'], answer: 1 },
    { type: 'short', q: '¿Dónde come Pablo? (una palabra)', accept: ['cafetería', 'cafeteria', 'en la cafetería'] },
    { type: 'translate', line: 'Por la tarde escribe correos y asiste a reuniones importantes.', model: 'In the afternoon he writes emails and attends important meetings.' }
  ]
},

{
  id: 'parque', title: 'Un sábado en el parque', level: 1,
  text: 'Es sábado y hace buen tiempo. Lucía y su hermano van al parque por la mañana. Ella lleva su perro y él lleva una pelota. En el parque hay mucha gente porque el sol brilla mucho. Los niños juegan y los adultos hablan sentados en un banco. Lucía y su hermano caminan media hora y después toman un helado en un puesto cerca de la entrada. A ellos les gusta mucho el parque porque es tranquilo y bonito.',
  gloss: [
    { es: 'hace buen tiempo', en: 'the weather is nice' },
    { es: 'un banco', en: 'a bench' },
    { es: 'un puesto', en: 'a stall' },
    { es: 'la entrada', en: 'the entrance' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué lleva Lucía al parque?', options: ['Un balón', 'Su perro', 'Una bicicleta'], answer: 1 },
    { type: 'mcq', q: '¿Qué hacen Lucía y su hermano después de caminar?', options: ['Toman un helado', 'Comen pizza', 'Vuelven a casa'], answer: 0 },
    { type: 'short', q: '¿Qué día es? (una palabra)', accept: ['sábado', 'sabado', 'es sábado'] },
    { type: 'translate', line: 'A ellos les gusta mucho el parque porque es tranquilo y bonito.', model: 'They like the park a lot because it is calm and pretty.' }
  ]
},

{
  id: 'estudiante', title: 'La vida de un estudiante', level: 1,
  text: 'Sofía es estudiante de biología en la universidad. Vive en un piso pequeño con dos compañeras de clase. Cada mañana desayuna rápido y toma el autobús a las ocho. Las clases empiezan a las nueve y terminan a la una. Después, Sofía come en la cafetería y estudia en la biblioteca por dos horas. Por la noche, prefiere leer un libro o hablar con su familia por teléfono. Los fines de semana, ella y sus amigas van al cine o cocinan juntas.',
  gloss: [
    { es: 'el piso', en: 'the apartment' },
    { es: 'las compañeras de clase', en: 'classmates' },
    { es: 'la biblioteca', en: 'the library' },
    { es: 'los fines de semana', en: 'on weekends' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué estudia Sofía?', options: ['Medicina', 'Biología', 'Historia'], answer: 1 },
    { type: 'mcq', q: '¿Qué hace por la noche?', options: ['Ve la televisión', 'Prefiere leer o hablar con su familia', 'Sale con amigos'], answer: 1 },
    { type: 'short', q: '¿Dónde vive Sofía? (una palabra)', accept: ['piso', 'en un piso', 'apartamento'] },
    { type: 'translate', line: 'Por la noche, prefiere leer un libro o hablar con su familia por teléfono.', model: 'At night, she prefers to read a book or talk with her family on the phone.' }
  ]
},

{
  id: 'cocina', title: 'La cena de esta noche', level: 1,
  text: 'Por la noche, Andrés prepara la cena para sus padres. Primero, lava las verduras y pone el pollo en una sartén. Después, añade un poco de aceite y pone el arroz en el agua hirviendo. Mientras cocina, escucha música y baila un poco en la cocina. Su madre llega a las ocho y pregunta si necesita ayuda. Andrés responde que no, porque ya casi está listo. Cuando su padre llega, todos se sientan a la mesa y comen juntos. Es una cena sencilla, pero está muy rica.',
  gloss: [
    { es: 'la sartén', en: 'the frying pan' },
    { es: 'listo', en: 'ready' },
    { es: 'sencilla', en: 'simple' },
    { es: 'rica', en: 'tasty' }
  ],
  questions: [
    { type: 'mcq', q: '¿Para quién prepara la cena Andrés?', options: ['Para sus amigos', 'Para sus padres', 'Para su jefe'], answer: 1 },
    { type: 'mcq', q: '¿A qué hora llega la madre?', options: ['A las siete', 'A las ocho', 'A las nueve'], answer: 1 },
    { type: 'short', q: '¿Qué cocina Andrés? (una palabra)', accept: ['pollo', 'arroz', 'pollo y arroz'] },
    { type: 'translate', line: 'Cuando su padre llega, todos se sientan a la mesa y comen juntos.', model: 'When his father arrives, everyone sits at the table and eats together.' }
  ]
},

{
  id: 'cumpleanos', title: 'El cumpleaños de mi abuela', level: 2,
  text: 'El sábado pasado fue el cumpleaños de mi abuela y toda la familia llegó a su casa. Mi madre cocinó un pollo al horno y mi tía preparó una tarta de chocolate. Mis primos trajeron flores y las pusieron en la mesa. Cuando mi abuela llegó del jardín, todos cantamos y ella rió mucho. Después de la cena, bailamos y contamos historias hasta muy tarde. Fue una noche muy especial para toda la familia.',
  gloss: [
    { es: 'al horno', en: 'baked / in the oven' },
    { es: 'una tarta', en: 'a cake' },
    { es: 'trajeron', en: 'brought' },
    { es: 'contamos historias', en: 'we told stories' }
  ],
  questions: [
    { type: 'mcq', q: '¿Quién cocinó el pollo?', options: ['Mi tía', 'Mi madre', 'Mi abuela'], answer: 1 },
    { type: 'mcq', q: '¿Qué trajeron mis primos?', options: ['Flores', 'Globos', 'Regalos'], answer: 0 },
    { type: 'short', q: '¿Qué preparó la tía? (una palabra)', accept: ['tarta', 'una tarta', 'tarta de chocolate'] },
    { type: 'translate', line: 'Fue una noche muy especial para toda la familia.', model: 'It was a very special night for the whole family.' }
  ]
},

{
  id: 'ninez', title: 'Mi niñez en el pueblo', level: 2,
  text: 'Cuando era niño, vivía en un pueblo pequeño cerca de la montaña. Todos los días caminaba a la escuela con mis hermanos porque no teníamos coche. Mi abuelo trabajaba en el campo y siempre nos traía fruta fresca. Por las tardes, jugábamos en la calle con los vecinos hasta que oscurecía. Mi madre cocinaba platos deliciosos y toda la familia comía junta. Los veranos eran largos y tranquilos, y yo era muy feliz en aquella época.',
  gloss: [
    { es: 'el pueblo', en: 'the village' },
    { es: 'el campo', en: 'the countryside' },
    { es: 'oscurecía', en: 'it got dark' },
    { es: 'aquella época', en: 'that time' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde vivía de niño?', options: ['En una ciudad grande', 'En un pueblo pequeño', 'En la playa'], answer: 1 },
    { type: 'mcq', q: '¿Qué traía el abuelo?', options: ['Fruta fresca', 'Pan caliente', 'Pescado'], answer: 0 },
    { type: 'short', q: '¿Con quién caminaba a la escuela? (una palabra)', accept: ['hermanos', 'con sus hermanos', 'sus hermanos'] },
    { type: 'translate', line: 'Los veranos eran largos y tranquilos, y yo era muy feliz en aquella época.', model: 'The summers were long and calm, and I was very happy in that time.' }
  ]
},

{
  id: 'lunes-dificil', title: 'Un lunes difícil', level: 2,
  text: 'Ayer fue un día difícil para Marcos. Se levantó tarde porque el despertador no sonó. Corrió al autobús pero lo perdió por dos minutos. Por eso, llegó tarde al trabajo y su jefe no estaba muy contento. Durante la mañana, Marcos perdió unos documentos importantes y tuvo que buscarlos por toda la oficina. Al mediodía, comió rápido y volvió a su escritorio. Por la tarde, encontró los documentos debajo de una silla y respiró tranquilo. Al final, todo salió bien.',
  gloss: [
    { es: 'el despertador', en: 'the alarm clock' },
    { es: 'perdió el autobús', en: 'missed the bus' },
    { es: 'el escritorio', en: 'the desk' },
    { es: 'debajo de', en: 'underneath' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué llegó tarde Marcos?', options: ['Perdió el autobús', 'Perdió las llaves', 'Se quedó dormido en el trabajo'], answer: 0 },
    { type: 'mcq', q: '¿Qué perdió durante la mañana?', options: ['Su teléfono', 'Unos documentos', 'Su dinero'], answer: 1 },
    { type: 'short', q: '¿Dónde encontró los documentos? (una palabra)', accept: ['debajo de una silla', 'silla', 'debajo de la silla'] },
    { type: 'translate', line: 'Por la tarde, encontró los documentos debajo de una silla y respiró tranquilo.', model: 'In the afternoon, he found the documents under a chair and breathed easy.' }
  ]
},

{
  id: 'regalo-hermana', title: 'Un regalo para mi hermana', level: 2,
  text: 'Compré un regalo para mi hermana porque cumple años mañana. Fui a la tienda por la mañana y busqué algo especial durante una hora. Al final, encontré un libro de fotos por su precio y por su calidad. Pagué por el regalo con tarjeta y salí de la tienda contenta. Caminé por el centro para llegar a casa y pasé por el parque. Puse el regalo en papel azul, su color favorito, encima de la mesa.',
  gloss: [
    { es: 'cumple años', en: 'has a birthday' },
    { es: 'por su calidad', en: 'for its quality' },
    { es: 'con tarjeta', en: 'by card' },
    { es: 'encima de', en: 'on top of' }
  ],
  questions: [
    { type: 'mcq', q: '¿Para quién es el regalo?', options: ['Para su madre', 'Para su hermana', 'Para su amiga'], answer: 1 },
    { type: 'mcq', q: '¿Cómo pagó el regalo?', options: ['En efectivo', 'Con tarjeta', 'Con cheque'], answer: 1 },
    { type: 'short', q: '¿De qué color es el papel? (una palabra)', accept: ['azul', 'papel azul'] },
    { type: 'translate', line: 'Puse el regalo en papel azul, su color favorito, encima de la mesa.', model: 'I put the gift in blue paper, her favorite color, on top of the table.' }
  ]
},

{
  id: 'planes-verano', title: 'Planes para el verano', level: 3,
  text: 'En verano, mi familia y yo viajaremos a la costa por dos semanas. Ya hemos reservado un apartamento cerca de la playa y hemos comprado los billetes de tren. Mi hermano nunca ha visitado esa ciudad, así que estará muy emocionado. Comeremos mariscos frescos y nadaremos todos los días. Si hace buen tiempo, también haremos una excursión a las montañas cercanas. Sé que será un viaje inolvidable porque llevamos años esperando estas vacaciones.',
  gloss: [
    { es: 'hemos reservado', en: 'we have reserved' },
    { es: 'los billetes', en: 'the tickets' },
    { es: 'emocionado', en: 'excited' },
    { es: 'inolvidable', en: 'unforgettable' }
  ],
  questions: [
    { type: 'mcq', q: '¿Adónde viajará la familia?', options: ['A la montaña', 'A la costa', 'A otra ciudad'], answer: 1 },
    { type: 'mcq', q: '¿Cómo estará el hermano?', options: ['Aburrido', 'Emocionado', 'Preocupado'], answer: 1 },
    { type: 'short', q: '¿Qué comerán en la playa? (una palabra)', accept: ['mariscos', 'marisco'] },
    { type: 'translate', line: 'Sé que será un viaje inolvidable porque llevamos años esperando estas vacaciones.', model: 'I know it will be an unforgettable trip because we have spent years waiting for these vacations.' }
  ]
},

{
  id: 'entrevista', title: 'La entrevista de trabajo', level: 3,
  text: 'Mañana Elena tendrá una entrevista de trabajo muy importante. Ya ha preparado sus respuestas y ha comprado un traje nuevo para la ocasión. Ella preferiría llegar una hora antes para estar tranquila. Su amiga le ha dicho que sería buena idea practicar las preguntas más comunes. Si todo va bien, Elena podrá empezar el trabajo el próximo mes. Ella sabe que sería un cambio importante en su vida, pero está lista para el reto.',
  gloss: [
    { es: 'la entrevista', en: 'the interview' },
    { es: 'el traje', en: 'the suit' },
    { es: 'estar lista', en: 'to be ready' },
    { es: 'el reto', en: 'the challenge' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué compró Elena para la entrevista?', options: ['Un traje nuevo', 'Unos zapatos', 'Un ordenador'], answer: 0 },
    { type: 'mcq', q: '¿Qué le recomendó su amiga?', options: ['Llegar tarde', 'Practicar las preguntas', 'No ir a la entrevista'], answer: 1 },
    { type: 'short', q: '¿Cuándo podrá empezar el trabajo? (una palabra)', accept: ['el próximo mes', 'próximo mes', 'mes que viene'] },
    { type: 'translate', line: 'Ella sabe que sería un cambio importante en su vida, pero está lista para el reto.', model: 'She knows it would be an important change in her life, but she is ready for the challenge.' }
  ]
},

{
  id: 'consejos-amiga', title: 'Consejos para una amiga', level: 4,
  text: "Mi amiga Marta está muy estresada con su nuevo trabajo. Le digo que duerma más y que no trabaje los fines de semana. Espero que ella encuentre un buen equilibrio pronto. Cuando hablamos, siempre le recomiendo: '¡Habla con tu jefe y pide ayuda si la necesitas!' También quiero que salga con nosotros más a menudo, porque antes de este trabajo, ella había sido una persona muy alegre. Ojalá que todo mejore pronto para ella.",
  gloss: [
    { es: 'estresada', en: 'stressed' },
    { es: 'el equilibrio', en: 'the balance' },
    { es: 'ojalá', en: 'I hope / hopefully' },
    { es: 'antes de', en: 'before' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le dice el autor a Marta?', options: ['Que trabaje más', 'Que duerma más', 'Que busque otro trabajo'], answer: 1 },
    { type: 'mcq', q: '¿Qué esperaba el autor de la próxima salida?', options: ['Que Marta cocine', 'Que Marta salga con ellos', 'Que Marta viaje sola'], answer: 1 },
    { type: 'short', q: '¿Quién está estresada? (una palabra)', accept: ['marta'] },
    { type: 'translate', line: 'También quiero que salga con nosotros más a menudo, porque antes de este trabajo, ella había sido una persona muy alegre.', model: 'I also want her to go out with us more often, because before this job, she had been a very cheerful person.' }
  ]
},

{
  id: 'reunion-familiar', title: 'La reunión familiar que casi no fue', level: 4,
  text: 'Cuando llegamos a casa de mis abuelos, ya habían empezado a comer sin nosotros. Mi madre se enfadó un poco porque queríamos llegar juntos. Mi abuela explicó que ellos no habían recibido nuestro mensaje porque su teléfono no funcionaba. Yo dudaba que fuera un problema serio, pero preferí no discutir más. Espero que la próxima reunión sea más tranquila y que todos lleguemos a la misma hora. Ojalá que mi abuela compre un teléfono nuevo pronto.',
  gloss: [
    { es: 'se enfadó', en: 'got upset' },
    { es: 'habían empezado', en: 'had already started' },
    { es: 'dudaba', en: 'I doubted' },
    { es: 'ojalá', en: 'I hope' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué no habían recibido el mensaje los abuelos?', options: ['Porque no tienen teléfono', 'Porque su teléfono no funcionaba', 'Porque estaban dormidos'], answer: 1 },
    { type: 'mcq', q: '¿Qué espera el narrador para la próxima reunión?', options: ['Que sea más tranquila', 'Que sea más grande', 'Que sea en otro lugar'], answer: 0 },
    { type: 'short', q: '¿Quién se enfadó un poco? (una palabra)', accept: ['madre', 'mi madre', 'la madre'] },
    { type: 'translate', line: 'Espero que la próxima reunión sea más tranquila y que todos lleguemos a la misma hora.', model: 'I hope the next gathering is calmer and that we all arrive at the same time.' }
  ]
}

];
