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
  text: 'En verano, mi familia y yo viajaremos a la costa por dos semanas. Ya hemos reservado un apartamento cerca de la playa y hemos comprado los billetes de tren. Mi hermano nunca ha visitado esa ciudad, así que estará muy emocionado. Comeremos mariscos frescos y nadaremos todos los días. Si hace buen tiempo, también haremos una excursión a las montañas cercanas. Sé que será algo inolvidable porque llevamos años esperando estas vacaciones.',
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
    { type: 'translate', line: 'Sé que será algo inolvidable porque llevamos años esperando estas vacaciones.', model: 'I know it will be something unforgettable because we have spent years waiting for these vacations.' }
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
},

{
  id: 'un-dia-normal-verbos1', title: 'Un día normal', level: 1,
  text: 'Marta trabaja en una tienda de ropa cerca de su casa. Por la mañana, habla con sus compañeros mientras organiza la ropa nueva. A mediodía, come un bocadillo rápido y bebe un café con leche. Por la tarde, estudia inglés en una academia porque quiere viajar a Londres el próximo año. Después de clase, habla con su profesor sobre gramática y bebe un poco de agua antes de volver a casa. Le gusta su rutina porque combina el trabajo y el estudio.',
  gloss: [
    { es: 'un bocadillo', en: 'a sandwich' },
    { es: 'la academia', en: 'the academy' },
    { es: 'la gramática', en: 'grammar' },
    { es: 'la rutina', en: 'the routine' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde trabaja Marta?', options: ['En un restaurante', 'En una tienda de ropa', 'En un banco'], answer: 1 },
    { type: 'mcq', q: '¿Por qué estudia inglés?', options: ['Porque quiere viajar a Londres', 'Porque es obligatorio', 'Porque le gusta la gramática'], answer: 0 },
    { type: 'short', q: '¿Qué bebe con el bocadillo? (una palabra)', accept: ['café', 'un café', 'café con leche'] },
    { type: 'translate', line: 'Le gusta su rutina porque combina el trabajo y el estudio.', model: 'She likes her routine because it combines work and study.' }
  ]
},

{
  id: 'clase-espanol-verbos2', title: 'Mi clase de español', level: 1,
  text: 'Soy estudiante de español y vivo en un piso pequeño cerca de la universidad. Cada semana aprendo palabras nuevas y escribo un texto corto para practicar. Mi profesora está muy contenta con mi progreso porque soy muy constante. Los lunes escribimos diálogos en parejas y aprendemos expresiones útiles. Vivimos momentos divertidos en clase, aunque a veces estoy un poco nerviosa antes de hablar. Aun así, sé que aprendo mucho cada día.',
  gloss: [
    { es: 'constante', en: 'consistent' },
    { es: 'en parejas', en: 'in pairs' },
    { es: 'útiles', en: 'useful' },
    { es: 'momentos divertidos', en: 'fun moments' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde vive la narradora?', options: ['En una residencia', 'En un piso pequeño', 'Con sus padres'], answer: 1 },
    { type: 'mcq', q: '¿Qué hacen los lunes?', options: ['Escriben diálogos en parejas', 'Ven películas', 'Hacen exámenes'], answer: 0 },
    { type: 'short', q: '¿Cómo está la profesora con su progreso? (una palabra)', accept: ['contenta', 'muy contenta'] },
    { type: 'translate', line: 'Aun así, sé que aprendo mucho cada día.', model: 'Even so, I know I learn a lot every day.' }
  ]
},

{
  id: 'excursion-montana-verbos3', title: 'Una excursión a la montaña', level: 2,
  text: 'El sábado pasado fuimos de excursión a la montaña. Tuvimos que salir muy temprano porque el camino era largo. Al llegar, hubo un poco de niebla, pero pudimos ver el paisaje cuando el sol salió. Hicimos una parada para comer bocadillos y descansar las piernas. Mi hermano no pudo terminar la ruta completa porque tenía una rodilla lesionada, así que volvimos juntos más despacio. Aun así, todos hicimos un esfuerzo grande y tuvimos un día inolvidable.',
  gloss: [
    { es: 'la excursión', en: 'the hike' },
    { es: 'el paisaje', en: 'the landscape' },
    { es: 'una rodilla lesionada', en: 'an injured knee' },
    { es: 'un esfuerzo', en: 'an effort' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué salieron muy temprano?', options: ['El camino era largo', 'Hacía mucho frío', 'Querían ver animales'], answer: 0 },
    { type: 'mcq', q: '¿Por qué no pudo terminar la ruta el hermano?', options: ['Tenía una rodilla lesionada', 'Estaba cansado del trabajo', 'No le gustaba caminar'], answer: 0 },
    { type: 'short', q: '¿Qué hicieron para descansar? (dos palabras)', accept: ['comer bocadillos', 'una parada', 'parar'] },
    { type: 'translate', line: 'Aun así, todos hicimos un esfuerzo grande y tuvimos un día inolvidable.', model: 'Even so, we all made a big effort and had an unforgettable day.' }
  ]
},

{
  id: 'conversacion-amigas-verbos4', title: 'Una conversación entre amigas', level: 1,
  text: 'Cuando Elena y Marta se ven, siempre hablan durante horas. Elena dice que quiere cambiar de trabajo pronto, pero no sabe cuál elegir. Marta le da algunos consejos porque conoce bien el sector. A veces, Elena no ve las cosas con claridad y quiere una segunda opinión. Marta siempre dice la verdad, aunque a veces es difícil de escuchar. Al final, Elena sabe que puede confiar en su amiga y le da las gracias por su sinceridad.',
  gloss: [
    { es: 'cambiar de trabajo', en: 'to change jobs' },
    { es: 'una segunda opinión', en: 'a second opinion' },
    { es: 'la sinceridad', en: 'honesty' },
    { es: 'confiar en', en: 'to trust' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué quiere hacer Elena?', options: ['Cambiar de trabajo', 'Mudarse de ciudad', 'Estudiar otro idioma'], answer: 0 },
    { type: 'mcq', q: '¿Por qué le da consejos Marta?', options: ['Conoce bien el sector', 'Es su jefa', 'Tiene el mismo trabajo'], answer: 0 },
    { type: 'short', q: '¿Qué le da Elena a Marta al final? (dos palabras)', accept: ['las gracias', 'gracias'] },
    { type: 'translate', line: 'Al final, Elena sabe que puede confiar en su amiga y le da las gracias por su sinceridad.', model: 'In the end, Elena knows she can trust her friend and thanks her for her honesty.' }
  ]
},

{
  id: 'fiesta-sorpresa-verbos5', title: 'Una fiesta sorpresa', level: 2,
  text: 'Para el cumpleaños de Sara, sus amigos vinieron a casa una hora antes y pusieron globos por todo el salón. Alguien trajo un pastel enorme y lo puso encima de la mesa con mucho cuidado. Cuando Sara salió de la ducha, casi se cayó de la sorpresa al ver a todos allí. Sus amigos vinieron de varias ciudades solo para esa noche. Al final, nadie salió de la fiesta antes de la medianoche.',
  gloss: [
    { es: 'los globos', en: 'the balloons' },
    { es: 'con mucho cuidado', en: 'very carefully' },
    { es: 'la sorpresa', en: 'the surprise' },
    { es: 'la medianoche', en: 'midnight' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pusieron los amigos por el salón?', options: ['Globos', 'Flores', 'Luces'], answer: 0 },
    { type: 'mcq', q: '¿Qué trajo alguien?', options: ['Un pastel enorme', 'Regalos', 'Música'], answer: 0 },
    { type: 'short', q: '¿Qué casi le pasó a Sara de la sorpresa? (dos palabras)', accept: ['se cayó', 'casi se cae', 'caerse'] },
    { type: 'translate', line: 'Al final, nadie salió de la fiesta antes de la medianoche.', model: 'In the end, nobody left the party before midnight.' }
  ]
},

{
  id: 'noche-restaurante-verbos6', title: 'Una noche en el restaurante', level: 1,
  text: 'Cuando vamos a ese restaurante, siempre pedimos el mismo plato porque es delicioso. El camarero sirve la comida muy rápido y siempre oye bien nuestros pedidos, incluso cuando hay mucho ruido. Mi abuelo dice que se muere de hambre si tarda mucho la comida, así que siempre pide primero. Después de cenar, dormimos muy bien porque comemos temprano. A veces, si la música está muy alta, no oigo bien lo que dice mi hermana.',
  gloss: [
    { es: 'el camarero', en: 'the waiter' },
    { es: 'los pedidos', en: 'the orders' },
    { es: 'el ruido', en: 'the noise' },
    { es: 'tarda mucho', en: 'takes a long time' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace el abuelo si tarda la comida?', options: ['Se va', 'Pide primero', 'Se enfada mucho'], answer: 1 },
    { type: 'mcq', q: '¿Por qué duermen bien después de cenar?', options: ['Porque comen temprano', 'Porque están cansados', 'Porque beben vino'], answer: 0 },
    { type: 'short', q: '¿Quién sirve la comida rápido? (una palabra)', accept: ['el camarero', 'camarero'] },
    { type: 'translate', line: 'A veces, si la música está muy alta, no oigo bien lo que dice mi hermana.', model: "Sometimes, if the music is very loud, I can't hear well what my sister says." }
  ]
},

{
  id: 'meta-personal-verbos7', title: 'Una meta personal', level: 1,
  text: 'Diego sigue un plan estricto para conseguir su objetivo: correr una maratón en los próximos meses. Prefiere entrenar por la mañana porque se siente con más energía. A veces repite el mismo circuito varias veces para mejorar su tiempo. Sus amigos prefieren acompañarlo los fines de semana, aunque no siguen el mismo ritmo. Diego siente que, poco a poco, consigue avanzar hacia su objetivo. Si sigue así, seguro que consigue terminar la carrera sin problemas.',
  gloss: [
    { es: 'una meta', en: 'a goal' },
    { es: 'entrenar', en: 'to train' },
    { es: 'el circuito', en: 'the loop / circuit' },
    { es: 'el ritmo', en: 'the pace' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué quiere conseguir Diego?', options: ['Correr una maratón', 'Ganar un premio', 'Aprender a nadar'], answer: 0 },
    { type: 'mcq', q: '¿Cuándo prefiere entrenar?', options: ['Por la mañana', 'Por la noche', 'Los fines de semana solamente'], answer: 0 },
    { type: 'short', q: '¿Qué hace para mejorar su tiempo? (dos palabras)', accept: ['repite el circuito', 'repetir circuito', 'repite'] },
    { type: 'translate', line: 'Diego siente que, poco a poco, consigue avanzar hacia su objetivo.', model: 'Diego feels that, little by little, he manages to move toward his goal.' }
  ]
},

{
  id: 'nuevo-vecino-verbos8', title: 'El nuevo vecino', level: 1,
  text: 'Conozco a mi nuevo vecino desde hace una semana y ya nos reímos mucho juntos. Él lee todas las noches antes de dormir y cree que es la mejor forma de relajarse. Los fines de semana, construye muebles de madera en su garaje como afición. Para mí, no es un trabajo fácil, pero él se ríe y dice que le encanta. Cuando leemos juntos en el parque, siempre construimos conversaciones interesantes sobre libros.',
  gloss: [
    { es: 'desde hace una semana', en: 'for a week now' },
    { es: 'relajarse', en: 'to relax' },
    { es: 'como afición', en: 'as a hobby' },
    { es: 'muebles de madera', en: 'wooden furniture' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace el vecino los fines de semana?', options: ['Construye muebles', 'Cocina para vecinos', 'Hace deporte'], answer: 0 },
    { type: 'mcq', q: '¿Cuándo lee el vecino?', options: ['Todas las noches', 'Solo los domingos', 'Nunca'], answer: 0 },
    { type: 'short', q: '¿Dónde leen juntos? (una palabra)', accept: ['el parque', 'en el parque', 'parque'] },
    { type: 'translate', line: 'Cuando leemos juntos en el parque, siempre construimos conversaciones interesantes sobre libros.', model: 'When we read together in the park, we always build interesting conversations about books.' }
  ]
},

{
  id: 'trabajo-traductora-verbos9', title: 'El trabajo de una traductora', level: 1,
  text: 'Clara traduce documentos legales para una empresa internacional. Piensa mucho antes de traducir cada frase porque el significado tiene que ser exacto. La empresa produce manuales técnicos en varios idiomas y Clara traduce la mayoría al español. A veces, conduce hasta la oficina central para reunirse con el equipo. Sus compañeros piensan que es muy meticulosa, y ella parece disfrutar de cada proyecto nuevo. Aunque el trabajo parece sencillo, en realidad requiere mucha concentración.',
  gloss: [
    { es: 'los documentos legales', en: 'legal documents' },
    { es: 'el significado', en: 'the meaning' },
    { es: 'meticulosa', en: 'meticulous' },
    { es: 'requiere', en: 'it requires' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué traduce Clara?', options: ['Documentos legales', 'Novelas', 'Poemas'], answer: 0 },
    { type: 'mcq', q: '¿Cómo es Clara según sus compañeros?', options: ['Muy meticulosa', 'Muy desorganizada', 'Muy impaciente'], answer: 0 },
    { type: 'short', q: '¿Adónde conduce a veces? (dos palabras)', accept: ['oficina central', 'la oficina central'] },
    { type: 'translate', line: 'Aunque el trabajo parece sencillo, en realidad requiere mucha concentración.', model: 'Although the job seems simple, it actually requires a lot of concentration.' }
  ]
},

{
  id: 'primer-dia-oficina-verbos10', title: 'El primer día en la oficina', level: 1,
  text: 'Hoy empiezo un trabajo nuevo y estoy un poco nerviosa. La reunión comienza a las nueve y todos entienden que soy nueva en el equipo. Antes de salir, siempre cierro bien la puerta de mi despacho. A veces no entiendo todos los términos técnicos, pero pregunto sin miedo. Mi jefe dice que, si me pierdo con algún proceso, siempre puedo pedir ayuda. Espero no perder la concentración durante mi primera semana.',
  gloss: [
    { es: 'el despacho', en: 'the office (room)' },
    { es: 'los términos técnicos', en: 'technical terms' },
    { es: 'sin miedo', en: 'without fear' },
    { es: 'la concentración', en: 'concentration' }
  ],
  questions: [
    { type: 'mcq', q: '¿A qué hora comienza la reunión?', options: ['A las ocho', 'A las nueve', 'A las diez'], answer: 1 },
    { type: 'mcq', q: '¿Qué hace si no entiende algo?', options: ['Pregunta sin miedo', 'Se calla', 'Se va'], answer: 0 },
    { type: 'short', q: '¿Qué cierra siempre antes de salir? (dos palabras)', accept: ['la puerta', 'puerta del despacho'] },
    { type: 'translate', line: 'Espero no perder la concentración durante mi primera semana.', model: 'I hope not to lose my concentration during my first week.' }
  ]
},

{
  id: 'fotos-antiguas-verbos11', title: 'Fotos antiguas', level: 1,
  text: 'Cada vez que vuelvo a casa de mis padres, encuentro cajas llenas de fotos antiguas. Mi madre siempre cuenta historias sobre cada foto y recuerda hasta el más mínimo detalle. Me muestra fotos de mi infancia y no recuerdo casi nada de esa época. Mi padre encuentra siempre una excusa para mostrarnos su foto favorita del ejército. Cuando volvemos a mirar el álbum juntos, contamos historias divertidas durante horas.',
  gloss: [
    { es: 'cajas llenas de', en: 'boxes full of' },
    { es: 'el más mínimo detalle', en: 'the smallest detail' },
    { es: 'una excusa', en: 'an excuse' },
    { es: 'el álbum', en: 'the album' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué encuentra la narradora en casa de sus padres?', options: ['Cajas de fotos antiguas', 'Cartas viejas', 'Ropa antigua'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace el padre siempre?', options: ['Encuentra una excusa para mostrar su foto favorita', 'Se enfada con las fotos', 'Guarda las fotos con llave'], answer: 0 },
    { type: 'short', q: '¿Quién cuenta historias sobre cada foto? (dos palabras)', accept: ['la madre', 'mi madre'] },
    { type: 'translate', line: 'Cuando volvemos a mirar el álbum juntos, contamos historias divertidas durante horas.', model: 'When we look at the album together again, we tell funny stories for hours.' }
  ]
},

{
  id: 'partido-domingo-verbos12', title: 'El partido del domingo', level: 1,
  text: 'Los domingos, mi hijo juega al fútbol en el parque con sus amigos. Siempre llegamos temprano para buscar un buen sitio y nos sentamos cerca del campo. Las entradas para los partidos profesionales cuestan bastante, así que preferimos ver los partidos locales gratis. Cuando mi hijo juega bien, todos nos sentamos más cerca para animar al equipo. Después del partido, buscamos un sitio para comer algo juntos.',
  gloss: [
    { es: 'el sitio', en: 'the spot' },
    { es: 'el campo', en: 'the field' },
    { es: 'gratis', en: 'free' },
    { es: 'animar al equipo', en: 'to cheer the team on' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde juega el hijo los domingos?', options: ['En el parque', 'En el colegio', 'En casa'], answer: 0 },
    { type: 'mcq', q: '¿Por qué ven partidos locales?', options: ['Las entradas profesionales cuestan mucho', 'No hay entradas', 'No les gusta el fútbol profesional'], answer: 0 },
    { type: 'short', q: '¿Qué hacen después del partido? (tres palabras)', accept: ['buscan un sitio', 'comer algo', 'comen juntos'] },
    { type: 'translate', line: 'Después del partido, buscamos un sitio para comer algo juntos.', model: 'After the game, we look for a place to eat something together.' }
  ]
},

{
  id: 'reparacion-coche-verbos13', title: 'La reparación del coche', level: 1,
  text: 'Cada vez que mi coche se rompe, lo llevo al mismo taller de confianza. El mecánico abre el capó, saca las piezas dañadas y las toca con cuidado para ver el problema. Al final, siempre pago con tarjeta porque es más rápido. A veces, mi hermano rompe cosas sin querer, como el espejo lateral del coche, y también paga la reparación. Menos mal que el mecánico abre el taller también los sábados.',
  gloss: [
    { es: 'el taller de confianza', en: 'the trusted repair shop' },
    { es: 'el capó', en: 'the hood' },
    { es: 'las piezas dañadas', en: 'the damaged parts' },
    { es: 'el espejo lateral', en: 'the side mirror' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo paga siempre?', options: ['Con tarjeta', 'En efectivo', 'Con cheque'], answer: 0 },
    { type: 'mcq', q: '¿Qué rompe a veces el hermano?', options: ['El espejo lateral', 'El motor', 'Las ruedas'], answer: 0 },
    { type: 'short', q: '¿Qué días abre el taller? (dos palabras)', accept: ['también sábados', 'los sábados', 'sábados'] },
    { type: 'translate', line: 'Menos mal que el mecánico abre el taller también los sábados.', model: 'Thank goodness the mechanic opens the shop on Saturdays too.' }
  ]
},

{
  id: 'noticia-cientifica-verbos14', title: 'Una noticia científica', level: 1,
  text: 'Un grupo de científicos descubre una nueva especie de pez en el océano. La noticia cubre la primera página de muchos periódicos. Los investigadores llevan meses estudiando esa zona del mar y no dejan de sorprenderse con cada hallazgo. Un periodista llama al equipo para pedir una entrevista, pero el jefe del proyecto deja esa tarea a su compañera. La nieve cubre las montañas cercanas mientras el equipo sigue trabajando sin descanso.',
  gloss: [
    { es: 'una especie', en: 'a species' },
    { es: 'el hallazgo', en: 'the finding' },
    { es: 'un periodista', en: 'a journalist' },
    { es: 'sin descanso', en: 'without rest' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué descubren los científicos?', options: ['Una nueva especie de pez', 'Un volcán', 'Una isla'], answer: 0 },
    { type: 'mcq', q: '¿A quién llama el periodista?', options: ['Al equipo de investigadores', 'Al gobierno', 'A otro periódico'], answer: 0 },
    { type: 'short', q: '¿Qué cubre las montañas cercanas? (una palabra)', accept: ['la nieve', 'nieve'] },
    { type: 'translate', line: 'La nieve cubre las montañas cercanas mientras el equipo sigue trabajando sin descanso.', model: 'The snow covers the nearby mountains while the team keeps working without rest.' }
  ]
},

{
  id: 'cita-con-amigas-verbos15', title: 'Una cita con amigas', level: 1,
  text: 'Todos los viernes, quedo con mis amigas para tomar algo en el centro. Siempre espero un poco porque alguna llega tarde. Cuando entramos en el café, buscamos la mesa de siempre cerca de la ventana. A veces pasamos horas hablando de todo un poco. Necesito estos momentos porque me ayudan a desconectar de la semana. Al final, siempre quedamos para la semana siguiente antes de despedirnos.',
  gloss: [
    { es: 'tomar algo', en: 'to grab a drink' },
    { es: 'desconectar', en: 'to unwind' },
    { es: 'despedirnos', en: 'to say goodbye' },
    { es: 'la mesa de siempre', en: 'our usual table' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuándo queda con sus amigas?', options: ['Los viernes', 'Los lunes', 'Los domingos'], answer: 0 },
    { type: 'mcq', q: '¿Por qué necesita estos momentos?', options: ['La ayudan a desconectar', 'Le dan dinero', 'Practica idiomas'], answer: 0 },
    { type: 'short', q: '¿Dónde se sientan en el café? (tres palabras)', accept: ['cerca de la ventana', 'mesa cerca ventana'] },
    { type: 'translate', line: 'Necesito estos momentos porque me ayudan a desconectar de la semana.', model: 'I need these moments because they help me unwind from the week.' }
  ]
},

{
  id: 'clases-fotografia-verbos16', title: 'Clases de fotografía', level: 1,
  text: 'Me gusta mucho la fotografía, así que tomo un curso los sábados por la mañana. El profesor nos ayuda a entender la luz y usamos cámaras diferentes cada semana. Miramos las fotos de otros estudiantes para aprender juntos. A mis compañeros les gusta mucho tomar fotos de paisajes, mientras que yo prefiero los retratos. El profesor siempre nos ayuda con paciencia cuando no entendemos algo.',
  gloss: [
    { es: 'la luz', en: 'the light' },
    { es: 'los retratos', en: 'portraits' },
    { es: 'con paciencia', en: 'patiently' },
    { es: 'los paisajes', en: 'landscapes' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuándo es el curso de fotografía?', options: ['Los sábados por la mañana', 'Los domingos por la tarde', 'Entre semana'], answer: 0 },
    { type: 'mcq', q: '¿Qué prefiere fotografiar la narradora?', options: ['Los retratos', 'Los paisajes', 'Los animales'], answer: 0 },
    { type: 'short', q: '¿Con qué les ayuda el profesor? (dos palabras)', accept: ['entender la luz', 'la luz', 'con paciencia'] },
    { type: 'translate', line: 'El profesor siempre nos ayuda con paciencia cuando no entendemos algo.', model: "The teacher always helps us patiently when we don't understand something." }
  ]
},

{
  id: 'tienda-electronica-verbos17', title: 'Una tienda de electrónica', level: 1,
  text: 'Cuando algo se rompe en casa, siempre compramos el repuesto en la misma tienda de electrónica. El dependiente pregunta primero qué necesitamos y después nos ayuda a elegir. A veces cambiamos de opinión varias veces antes de decidir. Mi pareja gana bastante dinero, así que no nos preocupa mucho el precio. Cuando terminamos de comprar, siempre preguntamos si hay garantía. Al final, terminamos contentos con la compra.',
  gloss: [
    { es: 'el repuesto', en: 'the replacement part' },
    { es: 'el dependiente', en: 'the shop assistant' },
    { es: 'cambiar de opinión', en: "to change one's mind" },
    { es: 'la garantía', en: 'the warranty' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pregunta primero el dependiente?', options: ['Qué necesitan', 'Cuánto dinero tienen', 'Si tienen tarjeta'], answer: 0 },
    { type: 'mcq', q: '¿Qué preguntan siempre al terminar de comprar?', options: ['Si hay garantía', 'Si hay descuento', 'Si hay envío gratis'], answer: 0 },
    { type: 'short', q: '¿Cómo se sienten al final? (una palabra)', accept: ['contentos', 'contenta'] },
    { type: 'translate', line: 'Al final, terminamos contentos con la compra.', model: 'In the end, we end up happy with the purchase.' }
  ]
},

{
  id: 'noche-cultural-verbos18', title: 'Una noche cultural', level: 1,
  text: 'Esta semana, un grupo de amigos viaja a un pueblo pequeño para un festival cultural. Por la noche, la gente canta y baila en la plaza principal. Nosotros caminamos por las calles estrechas mientras escuchamos la música. Un restaurante local cocina platos tradicionales para todos los visitantes. A mí me encanta bailar, aunque mis amigos prefieren solo mirar y cantar las canciones conocidas. Después del festival, caminamos de vuelta al hotel bajo las estrellas.',
  gloss: [
    { es: 'la plaza principal', en: 'the main square' },
    { es: 'las calles estrechas', en: 'the narrow streets' },
    { es: 'los visitantes', en: 'the visitors' },
    { es: 'bajo las estrellas', en: 'under the stars' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace la gente por la noche?', options: ['Canta y baila en la plaza', 'Duerme temprano', 'Ve la televisión'], answer: 0 },
    { type: 'mcq', q: '¿Qué cocina el restaurante local?', options: ['Platos tradicionales', 'Comida rápida', 'Solo postres'], answer: 0 },
    { type: 'short', q: '¿Qué prefieren hacer los amigos? (dos palabras)', accept: ['mirar y cantar', 'mirar', 'cantar'] },
    { type: 'translate', line: 'Después del festival, caminamos de vuelta al hotel bajo las estrellas.', model: 'After the festival, we walk back to the hotel under the stars.' }
  ]
},

{
  id: 'tienda-segunda-mano-verbos19', title: 'Una tienda de segunda mano', level: 1,
  text: 'Mis vecinos venden ropa que ya no usan en una tienda de segunda mano. Deben clasificar cada prenda antes de ponerla en la tienda. Cuando alguien pregunta por un precio, el dueño siempre responde con amabilidad. Yo comprendo por qué la gente prefiere comprar ropa de segunda mano: es más barata y mejor para el planeta. Los fines de semana, corro por el mercadillo buscando gangas antes de que se agoten. Al final del día, el dueño responde a todos los mensajes pendientes.',
  gloss: [
    { es: 'la segunda mano', en: 'secondhand' },
    { es: 'clasificar', en: 'to sort' },
    { es: 'las gangas', en: 'bargains' },
    { es: 'los mensajes pendientes', en: 'pending messages' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué venden los vecinos?', options: ['Ropa de segunda mano', 'Muebles', 'Libros'], answer: 0 },
    { type: 'mcq', q: '¿Por qué corre la narradora por el mercadillo?', options: ['Para buscar gangas antes de que se agoten', 'Para hacer ejercicio', 'Para vender algo'], answer: 0 },
    { type: 'short', q: '¿Cómo responde el dueño a las preguntas? (una palabra)', accept: ['amabilidad', 'con amabilidad'] },
    { type: 'translate', line: 'Yo comprendo por qué la gente prefiere comprar ropa de segunda mano: es más barata y mejor para el planeta.', model: 'I understand why people prefer to buy secondhand clothes: it is cheaper and better for the planet.' }
  ]
},

{
  id: 'mudanza-piso-nuevo-verbos20', title: 'Mudanza a un piso nuevo', level: 1,
  text: 'Cuando decidimos mudarnos, metemos todo en cajas grandes con mucho cuidado. El portero del edificio nos permite usar el ascensor de servicio para subir los muebles. Cada semana recibimos alguna caja nueva de la tienda de decoración. Mi pareja decide dónde va cada mueble y yo meto las cosas pequeñas en su sitio. El ascensor no permite subir más de cuatro personas a la vez, así que subimos por turnos.',
  gloss: [
    { es: 'el portero', en: 'the doorman' },
    { es: 'el ascensor de servicio', en: 'the service elevator' },
    { es: 'por turnos', en: 'in turns' },
    { es: 'la decoración', en: 'decoration' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué permite usar el portero?', options: ['El ascensor de servicio', 'Su coche', 'Su oficina'], answer: 0 },
    { type: 'mcq', q: '¿Quién decide dónde va cada mueble?', options: ['Mi pareja', 'El portero', 'El vecino'], answer: 0 },
    { type: 'short', q: '¿Cuántas personas permite subir el ascensor a la vez? (una palabra)', accept: ['cuatro', '4'] },
    { type: 'translate', line: 'El ascensor no permite subir más de cuatro personas a la vez, así que subimos por turnos.', model: 'The elevator does not allow more than four people up at a time, so we go up in turns.' }
  ]
},

{
  id: 'rutina-familiar-verbos21', title: 'La rutina familiar', level: 1,
  text: 'En mi familia, desayunamos todos juntos antes de partir hacia el trabajo o la escuela. Por la noche, cenamos siempre a la misma hora para hablar de nuestro día. A veces ocurre algo curioso durante la cena y todos nos reímos mucho. Creo que no existe una rutina perfecta, pero la nuestra funciona bien para todos. Cuando alguien sale a viajar, siempre desayunamos un poco antes para despedirnos con calma.',
  gloss: [
    { es: 'hacia', en: 'towards' },
    { es: 'cómo nos fue el día', en: 'how our day went' },
    { es: 'con calma', en: 'calmly' },
    { es: 'funciona bien', en: 'works well' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuándo desayunan todos juntos?', options: ['Antes de partir hacia el trabajo o la escuela', 'Los fines de semana solamente', 'Nunca'], answer: 0 },
    { type: 'mcq', q: '¿De qué hablan durante la cena?', options: ['De cómo les fue el día', 'De política', 'De dinero'], answer: 0 },
    { type: 'short', q: '¿Qué hacen cuando alguien parte de viaje? (tres palabras)', accept: ['desayunan un poco', 'despedirse con calma', 'desayunan antes'] },
    { type: 'translate', line: 'Creo que no existe una rutina perfecta, pero la nuestra funciona bien para todos.', model: 'I think there is no perfect routine, but ours works well for everyone.' }
  ]
},

{
  id: 'cena-vecinos-verbos22', title: 'Una cena con los vecinos', level: 1,
  text: 'Cada mes, invitamos a los vecinos a cenar en casa. Yo preparo el plato principal y ellos traen el postre. Cuando llegan, siempre saludamos con un abrazo porque ya somos buenos amigos. A veces olvido comprar algún ingrediente, pero mis vecinos me ayudan sin problema. Todos disfrutamos mucho de esas noches porque hablamos de todo un poco. Al final, nunca olvidamos organizar la próxima cena antes de despedirnos.',
  gloss: [
    { es: 'el plato principal', en: 'the main course' },
    { es: 'el postre', en: 'dessert' },
    { es: 'un abrazo', en: 'a hug' },
    { es: 'sin problema', en: 'no problem' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué prepara la narradora?', options: ['El plato principal', 'El postre', 'Las bebidas'], answer: 0 },
    { type: 'mcq', q: '¿Qué hacen cuando llegan los vecinos?', options: ['Saludan con un abrazo', 'Se dan la mano', 'No se saludan'], answer: 0 },
    { type: 'short', q: '¿Qué nunca olvidan hacer al final? (tres palabras)', accept: ['organizar la próxima', 'la próxima cena', 'organizar cena'] },
    { type: 'translate', line: 'Todos disfrutamos mucho de esas noches porque hablamos de todo un poco.', model: 'We all enjoy those nights a lot because we talk about a little bit of everything.' }
  ]
},

{
  id: 'clases-verano-verbos23', title: 'Clases de verano', level: 1,
  text: 'Todos los veranos, mi hija regresa al mismo campamento junto al lago. Por la mañana, nada en el lago con los otros niños. Por la tarde, dibuja en su cuaderno y aprende técnicas nuevas con la profesora de arte. Antes de irse, siempre firmamos un papel con las normas del campamento. Al volver a casa, ella lava su ropa deportiva ella misma porque quiere ser más independiente. Cada año regresamos al mismo sitio porque a todos nos encanta.',
  gloss: [
    { es: 'el campamento', en: 'the camp' },
    { es: 'el lago', en: 'the lake' },
    { es: 'las normas', en: 'the rules' },
    { es: 'independiente', en: 'independent' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde nada la hija por la mañana?', options: ['En el lago', 'En la piscina', 'En el mar'], answer: 0 },
    { type: 'mcq', q: '¿Qué firman antes de irse?', options: ['Un papel con las normas', 'Un contrato', 'Una carta'], answer: 0 },
    { type: 'short', q: '¿Qué hace ella misma al volver a casa? (dos palabras)', accept: ['lava su ropa', 'lavar ropa'] },
    { type: 'translate', line: 'Cada año regresamos al mismo sitio porque a todos nos encanta.', model: 'Every year we return to the same place because we all love it.' }
  ]
},

{
  id: 'proyecto-comunitario-verbos24', title: 'Un proyecto comunitario', level: 1,
  text: 'Los vecinos del barrio limpian el parque juntos una vez al mes. Todos participan porque creen que un barrio limpio depende del esfuerzo de todos. Cada persona promete ayudar al menos una hora, y así el grupo logra terminar rápido. El resultado depende mucho de cuántos vecinos participan ese día. Al final, siempre logramos dejar el parque impecable, y los niños prometen no tirar basura al suelo.',
  gloss: [
    { es: 'el esfuerzo', en: 'the effort' },
    { es: 'el resultado', en: 'the result' },
    { es: 'impecable', en: 'spotless' },
    { es: 'tirar basura', en: 'to litter' }
  ],
  questions: [
    { type: 'mcq', q: '¿Con qué frecuencia limpian el parque?', options: ['Una vez al mes', 'Cada semana', 'Solo en verano'], answer: 0 },
    { type: 'mcq', q: '¿De qué depende un barrio limpio?', options: ['Del esfuerzo de todos', 'Del ayuntamiento', 'De la suerte'], answer: 0 },
    { type: 'short', q: '¿Qué prometen los niños? (tres palabras)', accept: ['no tirar basura', 'no tirar', 'tirar basura no'] },
    { type: 'translate', line: 'Al final, siempre logramos dejar el parque impecable, y los niños prometen no tirar basura al suelo.', model: 'In the end, we always manage to leave the park spotless, and the children promise not to litter.' }
  ]
},

{
  id: 'reunion-vecinos-verbos25', title: 'Una reunión de vecinos', level: 1,
  text: 'Cada mes asistimos a la reunión de vecinos para hablar de los problemas del edificio. A veces discutimos mucho sobre pequeñas cosas, pero al final siempre llegamos a un acuerdo. Nunca sé qué va a suceder en esas reuniones porque siempre me sorprende algún vecino con una queja nueva. El portero esconde las llaves extra en un cajón especial por seguridad. Me sorprende ver cuántos detalles pequeños pueden generar tanta discusión.',
  gloss: [
    { es: 'llegar a un acuerdo', en: 'to reach an agreement' },
    { es: 'una queja', en: 'a complaint' },
    { es: 'un cajón', en: 'a drawer' },
    { es: 'generar', en: 'to generate' }
  ],
  questions: [
    { type: 'mcq', q: '¿Con qué frecuencia asisten a la reunión?', options: ['Cada mes', 'Cada semana', 'Una vez al año'], answer: 0 },
    { type: 'mcq', q: '¿Dónde esconde las llaves extra el portero?', options: ['En un cajón especial', 'En su bolsillo', 'En la entrada'], answer: 0 },
    { type: 'short', q: '¿Qué siempre logran al final de la reunión? (tres palabras)', accept: ['llegar a un acuerdo', 'un acuerdo', 'llegar acuerdo'] },
    { type: 'translate', line: 'Me sorprende ver cuántos detalles pequeños pueden generar tanta discusión.', model: 'It surprises me to see how many small details can generate so much discussion.' }
  ]
},

{
  id: 'reto-cocina-verbos26', title: 'Un reto de cocina', level: 1,
  text: 'Mis amigos y yo compartimos una receta nueva cada semana en un grupo de mensajes. Yo siempre añado un ingrediente diferente para hacerla más interesante. Mi amigo insiste en que la receta original es mejor sin cambios. A veces no resisto la tentación y añado demasiada pimienta. Todos cumplimos con la regla de probar la receta antes del domingo. Al final, compartimos fotos de nuestros platos y comentamos los resultados.',
  gloss: [
    { es: 'un grupo de mensajes', en: 'a messaging group' },
    { es: 'la tentación', en: 'temptation' },
    { es: 'la regla', en: 'the rule' },
    { es: 'comentamos', en: 'we discuss' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué comparten cada semana?', options: ['Una receta nueva', 'Fotos de viajes', 'Noticias'], answer: 0 },
    { type: 'mcq', q: '¿En qué insiste el amigo?', options: ['En que la receta original es mejor', 'En cambiar de grupo', 'En cocinar solo'], answer: 0 },
    { type: 'short', q: '¿Qué regla cumplen todos? (cuatro palabras)', accept: ['probar la receta antes', 'probar antes del domingo'] },
    { type: 'translate', line: 'Al final, compartimos fotos de nuestros platos y comentamos los resultados.', model: 'In the end, we share photos of our dishes and discuss the results.' }
  ]
},

{
  id: 'terapia-grupo-verbos27', title: 'Una terapia de grupo', level: 1,
  text: 'En la terapia de grupo, cada persona admite sus miedos sin vergüenza. La psicóloga escucha con atención y ayuda a definir mejor cada problema. Muchos participantes sufren de ansiedad, pero se sienten mejor al compartirlo con otros. Al final de cada sesión, la psicóloga manda una pequeña tarea para practicar en casa. Escuchar las historias de otros ayuda a definir lo que uno mismo necesita cambiar.',
  gloss: [
    { es: 'sin vergüenza', en: 'without shame' },
    { es: 'con atención', en: 'attentively' },
    { es: 'los participantes', en: 'the participants' },
    { es: 'la sesión', en: 'the session' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué admite cada persona en la terapia?', options: ['Sus miedos', 'Sus secretos', 'Sus errores del pasado'], answer: 0 },
    { type: 'mcq', q: '¿Qué manda la psicóloga al final de la sesión?', options: ['Una pequeña tarea', 'Un libro', 'Una receta'], answer: 0 },
    { type: 'short', q: '¿De qué sufren muchos participantes? (una palabra)', accept: ['ansiedad', 'de ansiedad'] },
    { type: 'translate', line: 'Escuchar las historias de otros ayuda a definir lo que uno mismo necesita cambiar.', model: "Listening to other people's stories helps define what one needs to change." }
  ]
},

{
  id: 'boda-presupuesto-verbos28', title: 'El presupuesto de la boda', level: 1,
  text: 'Laura y Carlos planean su boda para el próximo verano y organizan cada detalle con cuidado. Ahorran un poco de dinero cada mes para no gastar más de lo necesario. Deciden alquilar un salón pequeño porque prefieren gastar en comida y música. Laura organiza las invitaciones mientras Carlos planea el menú con el restaurante. Los dos juntos ahorran suficiente para no pedir ningún préstamo. Al final, gastan exactamente el dinero previsto.',
  gloss: [
    { es: 'el presupuesto', en: 'the budget' },
    { es: 'el salón', en: 'the venue' },
    { es: 'el préstamo', en: 'the loan' },
    { es: 'previsto', en: 'planned / budgeted' }
  ],
  questions: [
    { type: 'mcq', q: '¿Para cuándo planean la boda?', options: ['El próximo verano', 'Este invierno', 'El año pasado'], answer: 0 },
    { type: 'mcq', q: '¿Por qué deciden alquilar un salón pequeño?', options: ['Prefieren gastar en comida y música', 'No tienen suficiente dinero', 'Es más barato'], answer: 0 },
    { type: 'short', q: '¿Qué ahorran cada mes? (dos palabras)', accept: ['un poco', 'dinero', 'un poco de dinero'] },
    { type: 'translate', line: 'Al final, gastan exactamente el dinero previsto.', model: 'In the end, they spend exactly the planned amount of money.' }
  ]
},

{
  id: 'startup-nueva-verbos29', title: 'Una startup nueva', level: 1,
  text: 'Ana gestiona una pequeña startup de tecnología y administra el presupuesto con mucho cuidado. Cada mes contrata a una persona nueva si el proyecto crece. Antes de firmar cualquier acuerdo, siempre negocia las condiciones con calma. Para las reuniones importantes, reserva una sala tranquila en el centro. Su equipo confía en ella porque gestiona bien los conflictos y negocia soluciones justas para todos. Contratar a la persona correcta es, según Ana, la decisión más importante de la empresa.',
  gloss: [
    { es: 'el acuerdo', en: 'the agreement' },
    { es: 'las condiciones', en: 'the terms' },
    { es: 'los conflictos', en: 'the conflicts' },
    { es: 'soluciones justas', en: 'fair solutions' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué gestiona Ana?', options: ['Una startup de tecnología', 'Un restaurante', 'Una tienda'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace antes de firmar un acuerdo?', options: ['Negocia las condiciones', 'Firma sin leer', 'Pide más tiempo'], answer: 0 },
    { type: 'short', q: '¿Qué reserva para las reuniones importantes? (dos palabras)', accept: ['una sala', 'sala tranquila'] },
    { type: 'translate', line: 'Contratar a la persona correcta es, según Ana, la decisión más importante de la empresa.', model: "Hiring the right person is, according to Ana, the company's most important decision." }
  ]
},

{
  id: 'nuevo-portatil-verbos30', title: 'Un ordenador portátil nuevo', level: 1,
  text: 'Cuando compro un ordenador nuevo, siempre instalo mis programas favoritos primero. Después, configuro las opciones de privacidad y conecto todos mis dispositivos. Actualizo el sistema operativo cada semana para evitar problemas de seguridad. Al final, reciclo el ordenador viejo en un punto limpio en vez de tirarlo a la basura. Mi hermano también configura su portátil de la misma manera y conecta todo con cuidado.',
  gloss: [
    { es: 'los dispositivos', en: 'the devices' },
    { es: 'el sistema operativo', en: 'the operating system' },
    { es: 'un punto limpio', en: 'a recycling center' },
    { es: 'en vez de', en: 'instead of' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué instala primero en un ordenador nuevo?', options: ['Sus programas favoritos', 'Los juegos', 'Antivirus solamente'], answer: 0 },
    { type: 'mcq', q: '¿Dónde recicla el ordenador viejo?', options: ['En un punto limpio', 'En la basura normal', 'Lo vende'], answer: 0 },
    { type: 'short', q: '¿Con qué frecuencia actualiza el sistema? (dos palabras)', accept: ['cada semana', 'semanalmente'] },
    { type: 'translate', line: 'Al final, reciclo el ordenador viejo en un punto limpio en vez de tirarlo a la basura.', model: 'In the end, I recycle the old computer at a recycling center instead of throwing it in the trash.' }
  ]
},

{
  id: 'clinica-veterinaria-verbos31', title: 'La clínica veterinaria', level: 1,
  text: 'En la clínica, el veterinario vacuna a los cachorros nuevos cada mañana. Antes de operar a un animal, siempre respira hondo para mantener la calma. Los animales descansan en una jaula tranquila después de cada operación. El veterinario cura heridas pequeñas casi todos los días. Después de un día largo, él también necesita descansar un poco. Su equipo opera con mucho cuidado y siempre vacuna según el calendario recomendado.',
  gloss: [
    { es: 'los cachorros', en: 'the puppies' },
    { es: 'hondo', en: 'deeply' },
    { es: 'la jaula', en: 'the cage' },
    { es: 'el calendario recomendado', en: 'the recommended schedule' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace el veterinario cada mañana?', options: ['Vacuna a los cachorros nuevos', 'Limpia la clínica', 'Hace ejercicio'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace antes de operar a un animal?', options: ['Respira hondo para mantener la calma', 'Llama a la familia', 'Come algo'], answer: 0 },
    { type: 'short', q: '¿Dónde descansan los animales después de una operación? (dos palabras)', accept: ['una jaula', 'jaula tranquila'] },
    { type: 'translate', line: 'Su equipo opera con mucho cuidado y siempre vacuna según el calendario recomendado.', model: 'His team operates very carefully and always vaccinates according to the recommended schedule.' }
  ]
},

{
  id: 'equipo-disenio-verbos32', title: 'Un equipo de diseño', level: 1,
  text: 'Sara diseña la interfaz de una aplicación nueva mientras su compañero programa las funciones principales. Juntos desarrollan el proyecto durante varios meses antes de lanzarlo. Cuando algo no funciona bien, los usuarios reclaman rápido en las redes sociales. El equipo vota cada semana qué función mejorar primero. Sara también diseña los colores y las tipografías con mucho gusto. Al final, todos votan por el diseño final antes de publicarlo.',
  gloss: [
    { es: 'la interfaz', en: 'the interface' },
    { es: 'lanzarlo', en: 'to launch it' },
    { es: 'las redes sociales', en: 'social media' },
    { es: 'las tipografías', en: 'the fonts' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué diseña Sara?', options: ['La interfaz de una aplicación', 'El logotipo de la empresa', 'La página web de otra empresa'], answer: 0 },
    { type: 'mcq', q: '¿Qué hacen los usuarios si algo no funciona?', options: ['Reclaman en las redes sociales', 'Dejan de usar la app', 'Llaman por teléfono'], answer: 0 },
    { type: 'short', q: '¿Qué vota el equipo cada semana? (tres palabras)', accept: ['qué función mejorar', 'mejorar función', 'función a mejorar'] },
    { type: 'translate', line: 'Al final, todos votan por el diseño final antes de publicarlo.', model: 'In the end, everyone votes for the final design before publishing it.' }
  ]
},

{
  id: 'debate-medioambiente-verbos33', title: 'Un debate sobre el medio ambiente', level: 1,
  text: 'En clase, los estudiantes debaten sobre cómo las fábricas contaminan los ríos cercanos. Cada uno opina de forma diferente sobre las soluciones posibles. Algunos vecinos protestan frente al ayuntamiento porque quieren leyes más estrictas. Una señora mayor llora al pensar en el estado del río antes de la contaminación. El profesor opina que hablar del tema en clase ayuda a crear conciencia. Al final del debate, todos coinciden en que las fábricas contaminan demasiado.',
  gloss: [
    { es: 'las fábricas', en: 'the factories' },
    { es: 'el ayuntamiento', en: 'the city hall' },
    { es: 'leyes más estrictas', en: 'stricter laws' },
    { es: 'crear conciencia', en: 'to raise awareness' }
  ],
  questions: [
    { type: 'mcq', q: '¿Sobre qué debaten los estudiantes?', options: ['Cómo las fábricas contaminan los ríos', 'La historia local', 'Las matemáticas'], answer: 0 },
    { type: 'mcq', q: '¿Por qué protestan algunos vecinos?', options: ['Quieren leyes más estrictas', 'Quieren cerrar la escuela', 'Quieren más impuestos'], answer: 0 },
    { type: 'short', q: '¿Quién llora al recordar el río? (dos palabras)', accept: ['una señora', 'señora mayor'] },
    { type: 'translate', line: 'Al final del debate, todos coinciden en que las fábricas contaminan demasiado.', model: 'At the end of the debate, everyone agrees that the factories pollute too much.' }
  ]
},

{
  id: 'rutina-manana-verbos34', title: 'La rutina de la mañana', level: 1,
  text: 'Todos los días madrugo mucho porque empiezo a trabajar muy temprano. Antes de salir, siempre cargo mi teléfono y descargo las noticias del día para leerlas en el metro. Por la noche, apago todas las luces de la casa y mi pareja calienta el horno para preparar la cena. Los fines de semana, madrugamos menos y cargamos las pilas para la semana siguiente. Antes de dormir, siempre apago el móvil para descansar mejor.',
  gloss: [
    { es: 'el metro', en: 'the subway' },
    { es: 'las luces', en: 'the lights' },
    { es: 'cargar las pilas', en: 'to recharge' },
    { es: 'descansar mejor', en: 'to rest better' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace antes de salir de casa?', options: ['Carga el teléfono y descarga noticias', 'Desayuna con calma', 'Hace ejercicio'], answer: 0 },
    { type: 'mcq', q: '¿Quién calienta el horno por la noche?', options: ['Su pareja', 'Su madre', 'Un vecino'], answer: 0 },
    { type: 'short', q: '¿Qué hace antes de dormir? (dos palabras)', accept: ['apaga el móvil', 'apagar móvil'] },
    { type: 'translate', line: 'Los fines de semana, madrugamos menos y cargamos las pilas para la semana siguiente.', model: 'On weekends, we get up early less and recharge for the following week.' }
  ]
},

{
  id: 'reunion-inversores-verbos35', title: 'Una reunión con inversores', level: 1,
  text: 'Antes de la reunión, alguien enciende el proyector y prueba la presentación. Los inversores quieren saber si la empresa invierte bien su dinero. El director elige cuidadosamente cada palabra de su discurso porque sabe que están evaluando el proyecto. Su asistente corrige los últimos errores en las diapositivas antes de empezar. Nadie quiere despedir a nadie, pero todos saben que la empresa necesita crecer rápido para convencer a los inversores. Al final, el equipo elige presentar los datos con mucha calma.',
  gloss: [
    { es: 'los inversores', en: 'the investors' },
    { es: 'el discurso', en: 'the speech' },
    { es: 'las diapositivas', en: 'the slides' },
    { es: 'convencer', en: 'to convince' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace alguien antes de la reunión?', options: ['Enciende el proyector', 'Cierra las ventanas', 'Llama a todos'], answer: 0 },
    { type: 'mcq', q: '¿Qué corrige el asistente?', options: ['Los últimos errores en las diapositivas', 'El presupuesto', 'La lista de invitados'], answer: 0 },
    { type: 'short', q: '¿Qué elige cuidadosamente el director? (tres palabras)', accept: ['cada palabra', 'palabra de discurso', 'cada palabra de su discurso'] },
    { type: 'translate', line: 'Al final, el equipo elige presentar los datos con mucha calma.', model: 'In the end, the team chooses to present the data very calmly.' }
  ]
},

{
  id: 'directora-orquesta-verbos36', title: 'La directora de orquesta', level: 1,
  text: 'Elena dirige una orquesta pequeña desde hace cinco años. Exige mucha disciplina a los músicos, pero siempre sonríe cuando el ensayo sale bien. Antes de cada concierto, envía un mensaje de ánimo a todo el grupo. Elena anda por el escenario revisando cada instrumento antes de empezar. Sus músicos dicen que ella dirige con pasión y exige lo mejor de cada uno, aunque siempre sonríe con cariño al final del concierto.',
  gloss: [
    { es: 'la orquesta', en: 'the orchestra' },
    { es: 'la disciplina', en: 'discipline' },
    { es: 'el ensayo', en: 'the rehearsal' },
    { es: 'con cariño', en: 'affectionately' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué exige Elena a los músicos?', options: ['Mucha disciplina', 'Puntualidad solamente', 'Silencio total'], answer: 0 },
    { type: 'mcq', q: '¿Qué envía antes de cada concierto?', options: ['Un mensaje de ánimo', 'Las entradas', 'La partitura'], answer: 0 },
    { type: 'short', q: '¿Cómo anda por el escenario? (tres palabras)', accept: ['revisando cada instrumento', 'revisa instrumentos'] },
    { type: 'translate', line: 'Sus músicos dicen que ella dirige con pasión y exige lo mejor de cada uno, aunque siempre sonríe con cariño al final del concierto.', model: 'Her musicians say she conducts with passion and demands the best from everyone, although she always smiles affectionately at the end of the concert.' }
  ]
},

{
  id: 'anillo-familia-verbos37', title: 'Un anillo de familia', level: 1,
  text: 'Un anillo antiguo vale mucho para mi familia, aunque no vale mucho dinero en el mercado. Mi abuela siempre dice que las cosas más valiosas no siempre valen una fortuna. Para ella, los recuerdos valen mucho más que cualquier joya cara. Cuando le pregunto cuánto vale exactamente, ella se ríe y responde que un recuerdo así no tiene precio.',
  gloss: [
    { es: 'el anillo', en: 'the ring' },
    { es: 'valioso', en: 'valuable' },
    { es: 'una fortuna', en: 'a fortune' },
    { es: 'no tiene precio', en: "it's priceless" }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué dice la abuela sobre las cosas valiosas?', options: ['No siempre valen una fortuna', 'Siempre son caras', 'Se deben vender'], answer: 0 },
    { type: 'mcq', q: '¿Qué valen más para la abuela?', options: ['Los recuerdos', 'El dinero', 'Las joyas caras'], answer: 0 },
    { type: 'short', q: '¿Cuánto dice la abuela que vale el anillo? (dos palabras)', accept: ['no tiene precio', 'sin precio'] },
    { type: 'translate', line: 'Para ella, los recuerdos valen mucho más que cualquier joya cara.', model: 'For her, memories are worth much more than any expensive piece of jewelry.' }
  ]
},

{
  id: 'primer-dia-vecindario-vocab1', title: 'El primer día en el vecindario', level: 1,
  text: 'Cuando Marta conoce a su vecina nueva, la saluda con un alegre buenos días. La vecina responde hola y dice que está encantada de conocerla. Marta le pregunta si necesita ayuda, y ella contesta que sí, por favor. Al terminar, Marta se disculpa diciendo perdón por la prisa, y la vecina responde de nada, muchas gracias por todo. Por la noche, ambas se despiden con un simple buenas noches. Al día siguiente, se dicen adiós y prometen tomar un café juntas pronto.',
  gloss: [
    { es: 'encantada de conocerla', en: 'pleased to meet her' },
    { es: 'la prisa', en: 'the hurry' },
    { es: 'ambas', en: 'both (of them)' },
    { es: 'prometen', en: 'they promise' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo saluda Marta a su vecina?', options: ['Con un "buenos días"', 'Con un abrazo', 'Con una carta'], answer: 0 },
    { type: 'mcq', q: '¿Qué dice Marta cuando tiene prisa?', options: ['Perdón', 'Adiós', 'De nada'], answer: 0 },
    { type: 'short', q: '¿Qué se dicen por la noche? (dos palabras)', accept: ['buenas noches'] },
    { type: 'translate', line: 'Al día siguiente, se dicen adiós y prometen tomar un café juntas pronto.', model: 'The next day, they say goodbye and promise to have coffee together soon.' }
  ]
},

{
  id: 'retrato-familia-vocab2', title: 'Un retrato de familia', level: 1,
  text: 'En esta foto se ve a toda la familia reunida en el jardín. El padre sonríe al lado de la madre, que sostiene a la niña pequeña. El hijo mayor, un niño curioso, mira la cámara con atención. Al fondo, se ve al hermano de la madre con su amiga y su amigo del trabajo. Todos dicen que el hombre y la mujer que aparecen en el centro son los abuelos, aunque nadie los conoce personalmente.',
  gloss: [
    { es: 'reunida', en: 'gathered' },
    { es: 'al fondo', en: 'in the background' },
    { es: 'sostiene', en: 'holds' },
    { es: 'personalmente', en: 'personally' }
  ],
  questions: [
    { type: 'mcq', q: '¿Quién sostiene a la niña pequeña?', options: ['La madre', 'El padre', 'El hermano'], answer: 0 },
    { type: 'mcq', q: '¿Quién mira la cámara con atención?', options: ['El niño curioso', 'El padre', 'La abuela'], answer: 0 },
    { type: 'short', q: '¿Quién está con su amiga y su amigo al fondo? (dos palabras)', accept: ['el hermano', 'hermano de la madre'] },
    { type: 'translate', line: 'Todos dicen que el hombre y la mujer que aparecen en el centro son los abuelos, aunque nadie los conoce personalmente.', model: 'Everyone says that the man and the woman who appear in the center are the grandparents, although nobody knows them personally.' }
  ]
},

{
  id: 'boda-familiar-vocab3', title: 'Una boda familiar', level: 2,
  text: 'En la boda de mi hermana, vino mucha gente de toda la familia. Mi tío bailó toda la noche con mi tía, y mis primos jugaban cerca de la piscina. El abuelo y la abuela se sentaron juntos para ver a los novios. Incluso vino el jefe de mi hermana, además de varios vecinos de toda la vida. Al final, el esposo de mi tía dio un discurso muy emotivo sobre su esposa y su familia.',
  gloss: [
    { es: 'los novios', en: 'the bride and groom' },
    { es: 'un discurso', en: 'a speech' },
    { es: 'emotivo', en: 'emotional' },
    { es: 'de toda la vida', en: 'lifelong' }
  ],
  questions: [
    { type: 'mcq', q: '¿Quién bailó toda la noche?', options: ['Mi tío con mi tía', 'Los abuelos', 'El jefe'], answer: 0 },
    { type: 'mcq', q: '¿Quién dio un discurso emotivo?', options: ['El esposo de mi tía', 'El abuelo', 'Un vecino'], answer: 0 },
    { type: 'short', q: '¿Dónde jugaban los primos? (tres palabras)', accept: ['cerca de la piscina', 'piscina'] },
    { type: 'translate', line: 'Al final, el esposo de mi tía dio un discurso muy emotivo sobre su esposa y su familia.', model: "In the end, my aunt's husband gave a very emotional speech about his wife and his family." }
  ]
},

{
  id: 'abuelos-nietos-vocab4', title: 'Los abuelos y sus nietos', level: 1,
  text: 'Cada domingo, mis abuelos reciben la visita de sus nietos. Mi primo es el nieto mayor y siempre ayuda a poner la mesa. Mi prima, la nieta menor, prefiere jugar con el perro del jardín. Los abuelos dicen que sus nietos son su mayor alegría. Cuando los nietos se van, la casa se queda muy silenciosa, y los abuelos ya esperan el próximo domingo.',
  gloss: [
    { es: 'la visita', en: 'the visit' },
    { es: 'la alegría', en: 'the joy' },
    { es: 'silenciosa', en: 'quiet' },
    { es: 'próximo domingo', en: 'next Sunday' }
  ],
  questions: [
    { type: 'mcq', q: '¿Quién es el nieto mayor?', options: ['Mi primo', 'Mi hermano', 'Mi tío'], answer: 0 },
    { type: 'mcq', q: '¿Qué prefiere hacer la nieta menor?', options: ['Jugar con el perro', 'Leer libros', 'Ver la televisión'], answer: 0 },
    { type: 'short', q: '¿Cómo se queda la casa cuando los nietos se van? (una palabra)', accept: ['silenciosa', 'muy silenciosa'] },
    { type: 'translate', line: 'Los abuelos dicen que sus nietos son su mayor alegría.', model: 'The grandparents say that their grandchildren are their greatest joy.' }
  ]
},

{
  id: 'desayuno-saludable-vocab5', title: 'Un desayuno saludable', level: 1,
  text: 'Todas las mañanas, preparo un desayuno saludable con huevo, pan y fruta fresca. Bebo un vaso de leche y, a veces, también un café pequeño. Para el almuerzo, prefiero comida ligera como pollo o pescado con verdura. Como una manzana entera casi todos los días porque me da energía. Nunca bebo mucha agua por la mañana, pero sí bebo bastante durante el resto del día. La carne roja la como solo una vez por semana.',
  gloss: [
    { es: 'saludable', en: 'healthy' },
    { es: 'ligera', en: 'light' },
    { es: 'la energía', en: 'energy' },
    { es: 'el resto del día', en: 'the rest of the day' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué come en el desayuno?', options: ['Huevo, pan y fruta', 'Solo café', 'Pescado'], answer: 0 },
    { type: 'mcq', q: '¿Con qué frecuencia come carne roja?', options: ['Una vez por semana', 'Todos los días', 'Nunca'], answer: 0 },
    { type: 'short', q: '¿Qué fruta come casi todos los días? (una palabra)', accept: ['manzana', 'una manzana'] },
    { type: 'translate', line: 'Nunca bebo mucha agua por la mañana, pero sí bebo bastante durante el resto del día.', model: 'I never drink much water in the morning, but I do drink plenty during the rest of the day.' }
  ]
},

{
  id: 'cena-especial-vocab6', title: 'Una cena especial', level: 2,
  text: 'Para la cena especial de esta noche, preparo arroz con queso y verduras. Mis invitados prefieren beber vino tinto, aunque a mi hermano le gusta más la cerveza fría. No añado azúcar a ningún plato salado, solo lo uso en el postre. El desayuno de mañana es más ligero porque hoy cenamos mucho. Normalmente, el almuerzo es la comida más importante del día, pero hoy la cena gana ese honor.',
  gloss: [
    { es: 'tinto', en: 'red (wine)' },
    { es: 'salado', en: 'savory' },
    { es: 'el postre', en: 'dessert' },
    { es: 'el honor', en: 'the honor' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué preparan para la cena especial?', options: ['Arroz con queso y verduras', 'Solo ensalada', 'Pescado frito'], answer: 0 },
    { type: 'mcq', q: '¿Qué prefiere beber el hermano?', options: ['Cerveza fría', 'Vino tinto', 'Agua'], answer: 0 },
    { type: 'short', q: '¿Dónde usa el azúcar la narradora? (una palabra)', accept: ['postre', 'en el postre'] },
    { type: 'translate', line: 'Normalmente, el almuerzo es la comida más importante del día, pero hoy la cena gana ese honor.', model: 'Normally, lunch is the most important meal of the day, but today dinner earns that honor.' }
  ]
},

{
  id: 'numeros-loteria-vocab7', title: 'Los números de la lotería', level: 1,
  text: 'Cada semana, mi padre juega a la lotería con los mismos números: tres, siete y nueve. Compra un billete que cuesta diez euros y sueña con ganar cien mil euros algún día. Mi madre prefiere jugar con cinco números diferentes: uno, dos, cuatro, seis y ocho. Nunca ganan más de mil euros, pero siguen jugando cada semana con ilusión. Para ellos, jugar es más divertido que ganar.',
  gloss: [
    { es: 'la lotería', en: 'the lottery' },
    { es: 'el billete', en: 'the ticket' },
    { es: 'con ilusión', en: 'hopefully' },
    { es: 'divertido', en: 'fun' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué números juega el padre?', options: ['Tres, siete y nueve', 'Uno, dos y tres', 'Cinco, seis y siete'], answer: 0 },
    { type: 'mcq', q: '¿Cuánto cuesta el billete?', options: ['Diez euros', 'Cien euros', 'Cinco euros'], answer: 0 },
    { type: 'short', q: '¿Cuánto sueña con ganar el padre? (dos palabras)', accept: ['cien mil', 'cien mil euros'] },
    { type: 'translate', line: 'Para ellos, jugar es más divertido que ganar.', model: 'For them, playing is more fun than winning.' }
  ]
},

{
  id: 'carrera-escolar-vocab8', title: 'Una carrera escolar', level: 1,
  text: 'En la carrera de la escuela, mi hijo siempre quiere ser el primero en cruzar la línea de llegada. Actualmente, corre contra diez compañeros de su clase. Su amigo, que suele llegar último, entrena mucho para mejorar su posición. El profesor dice que lo importante no es ser el primero, sino terminar la carrera con esfuerzo. Al final, mi hijo llega segundo, y su amigo ya no llega último.',
  gloss: [
    { es: 'la línea de llegada', en: 'the finish line' },
    { es: 'entrena', en: 'trains' },
    { es: 'la posición', en: 'the position' },
    { es: 'con esfuerzo', en: 'with effort' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué quiere ser siempre el hijo?', options: ['El primero', 'El último', 'El más fuerte'], answer: 0 },
    { type: 'mcq', q: '¿Qué dice el profesor sobre ganar?', options: ['Lo importante es terminar con esfuerzo', 'Solo importa ser el primero', 'No importa participar'], answer: 0 },
    { type: 'short', q: '¿En qué posición llega el hijo al final? (una palabra)', accept: ['segundo'] },
    { type: 'translate', line: 'El profesor dice que lo importante no es ser el primero, sino terminar la carrera con esfuerzo.', model: "The teacher says that what matters isn't being first, but finishing the race with effort." }
  ]
},

{
  id: 'planificador-semanal-vocab9', title: 'Mi planificador semanal', level: 2,
  text: 'Cada día, apunto mis tareas en un planificador para organizar la semana. Hoy tengo una reunión importante, y mañana empiezo un proyecto nuevo. Ayer terminé un informe que llevaba todo el mes preparando. Ahora reviso mi calendario cada hora para no olvidar nada. Nunca dejo tareas para el último minuto, aunque a veces necesito más de un año para completar proyectos grandes. Siempre digo que la organización es la clave del éxito.',
  gloss: [
    { es: 'apunto', en: 'I jot down' },
    { es: 'el planificador', en: 'the planner' },
    { es: 'la clave del éxito', en: 'the key to success' },
    { es: 'completar', en: 'to complete' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace hoy la narradora?', options: ['Tiene una reunión importante', 'Empieza vacaciones', 'Viaja'], answer: 0 },
    { type: 'mcq', q: '¿Qué terminó ayer?', options: ['Un informe', 'Un libro', 'Una carta'], answer: 0 },
    { type: 'short', q: '¿Cada cuánto revisa su calendario? (dos palabras)', accept: ['cada hora'] },
    { type: 'translate', line: 'Siempre digo que la organización es la clave del éxito.', model: 'I always say that organization is the key to success.' }
  ]
},

{
  id: 'cuadro-pintor-vocab10', title: 'El cuadro del pintor', level: 1,
  text: 'El pintor mezcla azul y amarillo para conseguir verde. En su estudio, tiene botes de pintura roja, negra y blanca por todas partes. Para el cielo del cuadro, usa un gris suave, y para las flores, elige rosa y naranja brillante. El marco del cuadro es marrón oscuro, casi del mismo color que la mesa de trabajo. Cuando termina, todos dicen que los colores del cuadro parecen reales.',
  gloss: [
    { es: 'el estudio', en: 'the studio' },
    { es: 'los botes de pintura', en: 'paint cans' },
    { es: 'el marco', en: 'the frame' },
    { es: 'oscuro', en: 'dark' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué colores mezcla para conseguir verde?', options: ['Azul y amarillo', 'Azul y blanco', 'Amarillo y rojo'], answer: 0 },
    { type: 'mcq', q: '¿De qué color es el marco?', options: ['Marrón oscuro', 'Negro', 'Blanco'], answer: 0 },
    { type: 'short', q: '¿Qué colores elige para las flores? (dos palabras)', accept: ['rosa y naranja', 'rosa', 'naranja'] },
    { type: 'translate', line: 'Cuando termina, todos dicen que los colores del cuadro parecen reales.', model: 'When he finishes, everyone says the colors of the painting look real.' }
  ]
},

{
  id: 'un-dia-por-la-ciudad-vocab11', title: 'Un día por la ciudad', level: 1,
  text: 'Hoy salgo temprano de casa y camino por la calle principal de la ciudad. Primero, paso por el mercado para comprar fruta fresca. Después, entro en una tienda cerca de la escuela para comprar un regalo. Al mediodía, como en un restaurante pequeño cerca de la estación de tren. Por la tarde, visito el hospital para acompañar a un amigo, y luego voy directo al trabajo. Antes de volver a casa, paso por el aeropuerto a recoger a mi hermano, que llega de otro país.',
  gloss: [
    { es: 'acompañar', en: 'to accompany' },
    { es: 'recoger', en: 'to pick up' },
    { es: 'directo', en: 'straight' },
    { es: 'otro país', en: 'another country' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué compra en el mercado?', options: ['Fruta fresca', 'Ropa', 'Libros'], answer: 0 },
    { type: 'mcq', q: '¿Por qué va al hospital?', options: ['Para acompañar a un amigo', 'Está enfermo', 'Trabaja allí'], answer: 0 },
    { type: 'short', q: '¿A quién recoge en el aeropuerto? (dos palabras)', accept: ['a su hermano', 'su hermano'] },
    { type: 'translate', line: 'Antes de volver a casa, paso por el aeropuerto a recoger a mi hermano, que llega de otro país.', model: 'Before going home, I stop by the airport to pick up my brother, who is arriving from another country.' }
  ]
},

{
  id: 'paseo-domingo-vocab12', title: 'Un paseo de domingo', level: 1,
  text: 'Los domingos, me gusta pasear por el parque cerca de casa. Después, paso por la iglesia del barrio, aunque no siempre entro. Cerca de allí, hay un edificio antiguo que ahora es un museo muy visitado. Si tengo tiempo, veo una película en el cine o paseo hasta la biblioteca para leer un rato. De camino a casa, paso por el banco para sacar dinero y por la panadería para comprar pan fresco. Por la tarde, trabajo un poco en mi oficina en casa.',
  gloss: [
    { es: 'pasear', en: 'to stroll' },
    { es: 'muy visitado', en: 'much-visited' },
    { es: 'de camino a', en: 'on the way to' },
    { es: 'sacar dinero', en: 'to withdraw money' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hay cerca de la iglesia?', options: ['Un museo', 'Un hospital', 'Una estación'], answer: 0 },
    { type: 'mcq', q: '¿Qué compra en la panadería?', options: ['Pan fresco', 'Fruta', 'Leche'], answer: 0 },
    { type: 'short', q: '¿Dónde trabaja por la tarde? (dos palabras)', accept: ['en casa', 'su oficina', 'oficina en casa'] },
    { type: 'translate', line: 'De camino a casa, paso por el banco para sacar dinero y por la panadería para comprar pan fresco.', model: 'On the way home, I stop by the bank to withdraw money and by the bakery to buy fresh bread.' }
  ]
},

{
  id: 'organizando-casa-vocab13', title: 'Organizando la casa', level: 1,
  text: 'Hoy organizo toda la casa porque llegan invitados esta tarde. Limpio la cocina y el baño con cuidado. En la habitación principal, cambio las sábanas de la cama y ordeno la mesa y las sillas. Busco la llave de la puerta principal porque siempre se pierde en algún cajón. Abro la ventana para dejar entrar aire fresco. Al final, leo un libro tranquilo en el sofá y contesto el teléfono cuando suena.',
  gloss: [
    { es: 'las sábanas', en: 'the sheets' },
    { es: 'el cajón', en: 'the drawer' },
    { es: 'dejar entrar', en: 'to let in' },
    { es: 'contesto', en: 'I answer' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué organiza la casa hoy?', options: ['Llegan invitados esta tarde', 'Es su cumpleaños', 'Se muda'], answer: 0 },
    { type: 'mcq', q: '¿Qué cambia en la habitación principal?', options: ['Las sábanas de la cama', 'Las cortinas', 'El armario'], answer: 0 },
    { type: 'short', q: '¿Qué busca porque siempre se pierde? (una palabra)', accept: ['la llave', 'llave'] },
    { type: 'translate', line: 'Abro la ventana para dejar entrar aire fresco.', model: 'I open the window to let in fresh air.' }
  ]
},

{
  id: 'reforma-vecindario-vocab14', title: 'La reforma del vecindario', level: 1,
  text: 'Los vecinos del vecindario ahorran dinero cada mes para pagar una reforma del edificio. La comunidad de vecinos decide qué arreglar primero: el tejado o la fachada. Alguien guarda todos los papeles importantes en una carpeta especial. Mi reloj marca las nueve cuando empieza la reunión de la comunidad. Todos traen ropa cómoda porque después ayudan a limpiar el patio. Al final, todos están contentos con los cambios en el vecindario.',
  gloss: [
    { es: 'el tejado', en: 'the roof' },
    { es: 'la fachada', en: 'the facade' },
    { es: 'la carpeta', en: 'the folder' },
    { es: 'el patio', en: 'the courtyard' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué decide la comunidad de vecinos?', options: ['Qué arreglar primero', 'Cuánto cobrar de alquiler', 'Cuándo hacer una fiesta'], answer: 0 },
    { type: 'mcq', q: '¿Qué traen todos a la reunión?', options: ['Ropa cómoda', 'Comida', 'Herramientas'], answer: 0 },
    { type: 'short', q: '¿Para qué ahorran dinero los vecinos? (una palabra)', accept: ['la reforma', 'reforma'] },
    { type: 'translate', line: 'Al final, todos están contentos con los cambios en el vecindario.', model: 'In the end, everyone is happy with the changes in the neighborhood.' }
  ]
},

{
  id: 'clase-yoga-vocab15', title: 'Una clase de yoga', level: 1,
  text: 'En la clase de yoga, primero movemos la cabeza suavemente de un lado a otro. Después, estiramos los brazos y las piernas con calma. El profesor nos enseña a respirar hondo y a sentir el corazón latir más despacio. Cerramos los ojos y relajamos la cara poco a poco. Al final, ponemos las manos sobre el pecho y sentimos cada parte del cuerpo, desde el pie hasta la cabeza.',
  gloss: [
    { es: 'suavemente', en: 'gently' },
    { es: 'latir', en: 'to beat' },
    { es: 'relajamos', en: 'we relax' },
    { es: 'el pecho', en: 'the chest' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué movemos primero en la clase?', options: ['La cabeza', 'Los pies', 'Las manos'], answer: 0 },
    { type: 'mcq', q: '¿Qué hacemos con los ojos?', options: ['Los cerramos', 'Los abrimos mucho', 'Los movemos rápido'], answer: 0 },
    { type: 'short', q: '¿Dónde ponemos las manos al final? (una palabra)', accept: ['el pecho', 'pecho'] },
    { type: 'translate', line: 'Al final, ponemos las manos sobre el pecho y sentimos cada parte del cuerpo, desde el pie hasta la cabeza.', model: 'At the end, we put our hands on our chest and feel every part of the body, from the foot to the head.' }
  ]
},

{
  id: 'atardecer-playa-vocab16', title: 'Un atardecer en la playa', level: 1,
  text: 'Por la tarde, el sol baja poco a poco y pinta el cielo de naranja. El mar está tranquilo y solo se mueve un poco de viento suave. Cerca de la orilla, hay un árbol solitario con una flor amarilla creciendo cerca de sus raíces en la tierra. Cuando cae la noche, la luna aparece despacio en el cielo. Si hace frío, alguien enciende fuego en la arena para calentarse.',
  gloss: [
    { es: 'la orilla', en: 'the shore' },
    { es: 'solitario', en: 'solitary' },
    { es: 'las raíces', en: 'the roots' },
    { es: 'calentarse', en: 'to warm up' }
  ],
  questions: [
    { type: 'mcq', q: '¿De qué color pinta el cielo el sol?', options: ['Naranja', 'Rosa', 'Azul'], answer: 0 },
    { type: 'mcq', q: '¿Qué hay cerca de la orilla?', options: ['Un árbol solitario', 'Una casa', 'Un barco'], answer: 0 },
    { type: 'short', q: '¿Qué enciende alguien si hace frío? (una palabra)', accept: ['fuego', 'el fuego'] },
    { type: 'translate', line: 'Cuando cae la noche, la luna aparece despacio en el cielo.', model: 'When night falls, the moon slowly appears in the sky.' }
  ]
},

{
  id: 'comprando-piso-vocab17', title: 'Comprando un piso', level: 1,
  text: 'Buscamos un piso grande para toda la familia, pero los pisos grandes son muy caros. Encontramos uno pequeño y bonito, aunque un poco viejo. El agente dice que no es fácil encontrar algo bueno y barato al mismo tiempo. Visitamos otro piso nuevo, pero nos parece feo en el exterior. Al final, decidir es difícil, pero preferimos algo pequeño y barato antes que algo grande y malo por dentro.',
  gloss: [
    { es: 'el agente', en: 'the agent' },
    { es: 'al mismo tiempo', en: 'at the same time' },
    { es: 'en el exterior', en: 'on the outside' },
    { es: 'por dentro', en: 'on the inside' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo son los pisos grandes según el texto?', options: ['Muy caros', 'Muy baratos', 'Muy feos'], answer: 0 },
    { type: 'mcq', q: '¿Qué prefieren al final?', options: ['Algo pequeño y barato', 'Algo grande y caro', 'Algo nuevo y caro'], answer: 0 },
    { type: 'short', q: '¿Qué dice el agente que no es fácil? (cuatro palabras)', accept: ['encontrar algo bueno y barato', 'bueno y barato'] },
    { type: 'translate', line: 'Al final, decidir es difícil, pero preferimos algo pequeño y barato antes que algo grande y malo por dentro.', model: 'In the end, deciding is difficult, but we prefer something small and cheap rather than something big and bad on the inside.' }
  ]
},

{
  id: 'maraton-ciudad-vocab18', title: 'La maratón de la ciudad', level: 1,
  text: 'Los corredores rápidos terminan la maratón en poco tiempo, mientras los más lentos tardan mucho más. Algunos se sienten fuertes al principio, pero al final del recorrido largo se sienten débiles y cansados. Otros prefieren un recorrido más corto para no sufrir tanto. Al cruzar la línea final, unos están felices y otros están tristes porque no consiguen su objetivo. Las botellas de agua están vacías al final, y las calles están llenas de público a pesar del frío de la mañana.',
  gloss: [
    { es: 'los corredores', en: 'the runners' },
    { es: 'el recorrido', en: 'the route' },
    { es: 'a pesar de', en: 'despite' },
    { es: 'el público', en: 'the crowd' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo se sienten algunos al final del recorrido largo?', options: ['Débiles y cansados', 'Muy rápidos', 'Muy felices'], answer: 0 },
    { type: 'mcq', q: '¿Cómo están las botellas de agua al final?', options: ['Vacías', 'Llenas', 'Rotas'], answer: 0 },
    { type: 'short', q: '¿Cómo están las calles a pesar del frío? (una palabra)', accept: ['llenas', 'llenas de público'] },
    { type: 'translate', line: 'Las botellas de agua están vacías al final, y las calles están llenas de público a pesar del frío de la mañana.', model: 'The water bottles are empty at the end, and the streets are full of people despite the morning cold.' }
  ]
},

{
  id: 'entrevista-trabajo-vocab19', title: 'Una entrevista de trabajo', level: 2,
  text: 'Antes de la entrevista, pienso en las preguntas típicas: qué experiencia tengo, por qué quiero el puesto y cómo resuelvo problemas. El entrevistador también pregunta dónde estudié y cuándo empecé mi carrera. A veces pregunta cuánto tiempo llevo en el sector y cuál de mis proyectos es el más importante. Al final, pregunta quién soy aparte del trabajo, y esa pregunta me sorprende más que las demás.',
  gloss: [
    { es: 'el entrevistador', en: 'the interviewer' },
    { es: 'el sector', en: 'the industry' },
    { es: 'aparte del trabajo', en: 'outside of work' },
    { es: 'las demás', en: 'the others' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué preguntas típicas piensa antes de la entrevista?', options: ['Qué experiencia tiene y por qué quiere el puesto', 'Cuánto dinero necesita', 'Dónde vive el jefe'], answer: 0 },
    { type: 'mcq', q: '¿Qué pregunta le sorprende más?', options: ['Quién es aparte del trabajo', 'Cuánto tiempo lleva en el sector', 'Cuál es su proyecto favorito'], answer: 0 },
    { type: 'short', q: '¿Qué le pregunta el entrevistador sobre su carrera? (dos palabras)', accept: ['cuándo empezó', 'cuando empecé'] },
    { type: 'translate', line: 'Al final, pregunta quién soy aparte del trabajo, y esa pregunta me sorprende más que las demás.', model: 'In the end, he asks who I am outside of work, and that question surprises me more than the others.' }
  ]
},

{
  id: 'decision-dificil-vocab20', title: 'Una decisión difícil', level: 1,
  text: 'Quiero cambiar de trabajo porque necesito un reto nuevo, pero también me da miedo dejar la seguridad de mi puesto actual. Aunque el sueldo nuevo es mejor, sin embargo, el horario es más largo. Mientras pienso en la decisión, hablo con mi familia para escuchar otras opiniones. Además, considero que la ubicación de la oficina nueva está más lejos de casa. Entonces, decido esperar un poco más antes de tomar la decisión final.',
  gloss: [
    { es: 'un reto', en: 'a challenge' },
    { es: 'la seguridad', en: 'security' },
    { es: 'la ubicación', en: 'the location' },
    { es: 'tomar la decisión', en: 'to make the decision' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué quiere cambiar de trabajo?', options: ['Necesita un reto nuevo', 'Le pagan mal', 'Odia a su jefe'], answer: 0 },
    { type: 'mcq', q: '¿Qué le preocupa del trabajo nuevo?', options: ['El horario es más largo', 'El sueldo es bajo', 'No le gusta la gente'], answer: 0 },
    { type: 'short', q: '¿Qué decide hacer al final? (tres palabras)', accept: ['esperar un poco', 'esperar más'] },
    { type: 'translate', line: 'Entonces, decido esperar un poco más antes de tomar la decisión final.', model: 'So, I decide to wait a bit longer before making the final decision.' }
  ]
},

{
  id: 'guia-turistica-vocab21', title: 'Una guía turística', level: 1,
  text: 'Aquí, cerca del hotel, hay muy poca gente por la mañana, pero allí, en el centro, hay mucho turismo todo el año. Recomiendo comer aquí porque la comida está muy bien, aunque hay menos variedad que en otros restaurantes. Si prefieres estar lejos del ruido, aquella zona es mejor, aunque queda un poco más lejos del centro. Todo el mundo dice que la vista de allí es la mejor de la ciudad, aunque a mí no me parece mal ninguna parte.',
  gloss: [
    { es: 'el turismo', en: 'tourism' },
    { es: 'la variedad', en: 'variety' },
    { es: 'la zona', en: 'the area' },
    { es: 'la vista', en: 'the view' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo es la comida aquí según el texto?', options: ['Muy buena', 'Muy mala', 'Normal'], answer: 0 },
    { type: 'mcq', q: '¿Qué zona recomienda si prefieres estar lejos del ruido?', options: ['Aquella zona', 'El centro', 'El hotel'], answer: 0 },
    { type: 'short', q: '¿Qué dice todo el mundo sobre la vista? (tres palabras)', accept: ['la mejor de', 'mejor vista', 'mejor de la ciudad'] },
    { type: 'translate', line: 'Todo el mundo dice que la vista de allí es la mejor de la ciudad, aunque a mí no me parece mal ninguna parte.', model: 'Everyone says the view from there is the best in the city, although no part seems bad to me.' }
  ]
},

{
  id: 'casa-vacia-vocab22', title: 'Una casa vacía', level: 1,
  text: 'Cuando llego a casa y no hay nadie, siento algo extraño en el silencio. A veces pienso que alguien va a aparecer de repente, pero no pasa nada. Prefiero cuando hay alguien esperándome, incluso si es solo el gato. Si necesito algo, no tengo a nadie cerca para pedir ayuda, así que aprendo a resolver todo solo.',
  gloss: [
    { es: 'el silencio', en: 'the silence' },
    { es: 'de repente', en: 'suddenly' },
    { es: 'esperándome', en: 'waiting for me' },
    { es: 'resolver', en: 'to solve' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué siente cuando no hay nadie en casa?', options: ['Algo extraño en el silencio', 'Mucha alegría', 'Nada especial'], answer: 0 },
    { type: 'mcq', q: '¿A quién prefiere tener cerca?', options: ['A alguien, incluso si es el gato', 'A sus padres', 'A un vecino'], answer: 0 },
    { type: 'short', q: '¿Qué pasa cuando piensa que alguien va a aparecer? (dos palabras)', accept: ['no pasa nada', 'nada'] },
    { type: 'translate', line: 'Si necesito algo, no tengo a nadie cerca para pedir ayuda, así que aprendo a resolver todo solo.', model: "If I need something, I don't have anyone nearby to ask for help, so I learn to solve everything alone." }
  ]
},

{
  id: 'primer-dia-escuela-vocab23', title: 'El primer día de escuela', level: 1,
  text: 'Antes de empezar las clases, mi hija prepara su mochila con mucho cuidado. Mete un cuaderno nuevo, dos lápices y un bolígrafo azul. También lleva una goma y una regla por si acaso. En clase, la profesora escribe en la pizarra mientras los niños escuchan con atención desde su escritorio. Al final del día, mi hija guarda todo en la mochila otra vez y vuelve a casa contenta.',
  gloss: [
    { es: 'por si acaso', en: 'just in case' },
    { es: 'con atención', en: 'attentively' },
    { es: 'guarda', en: 'puts away' },
    { es: 'otra vez', en: 'again' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué mete en la mochila?', options: ['Un cuaderno, lápices y un bolígrafo', 'Solo libros', 'Su comida'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace la profesora en clase?', options: ['Escribe en la pizarra', 'Canta canciones', 'Reparte caramelos'], answer: 0 },
    { type: 'short', q: '¿Cómo vuelve a casa la hija? (una palabra)', accept: ['contenta'] },
    { type: 'translate', line: 'Al final del día, mi hija guarda todo en la mochila otra vez y vuelve a casa contenta.', model: 'At the end of the day, my daughter puts everything back in her backpack and goes home happy.' }
  ]
},

{
  id: 'semana-dificil-salud-vocab24', title: 'Una semana difícil de salud', level: 1,
  text: 'Esta semana cuido mi salud porque tengo mucho estrés en el trabajo. El lunes, siento un dolor de cabeza fuerte y voy a la farmacia a comprar medicina. El martes, tengo fiebre y sospecho que es gripe, así que descanso todo el día. El miércoles, tengo una cita médica con el dentista para revisar una muela. Mi seguro médico cubre casi todo, menos la terapia para la ansiedad, que pago aparte. Al final de la semana, me siento mucho mejor.',
  gloss: [
    { es: 'sospecho', en: 'I suspect' },
    { es: 'revisar una muela', en: 'to check a tooth' },
    { es: 'cubre', en: 'covers' },
    { es: 'pago aparte', en: 'I pay separately' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace el lunes por el dolor de cabeza?', options: ['Va a la farmacia', 'Va al hospital', 'No hace nada'], answer: 0 },
    { type: 'mcq', q: '¿Qué cubre el seguro médico?', options: ['Casi todo menos la terapia', 'Solo el dentista', 'Nada'], answer: 0 },
    { type: 'short', q: '¿Con quién tiene cita el miércoles? (una palabra)', accept: ['el dentista', 'dentista'] },
    { type: 'translate', line: 'Mi seguro médico cubre casi todo, menos la terapia para la ansiedad, que pago aparte.', model: 'My health insurance covers almost everything, except therapy for anxiety, which I pay for separately.' }
  ]
},

{
  id: 'chequeo-anual-vocab25', title: 'El chequeo anual', level: 1,
  text: 'Cada año, hago un chequeo médico completo para revisar mi salud general. El médico revisa mi corazón, mis pulmones y me hace análisis de sangre. El chequeo anual me ayuda a detectar cualquier problema a tiempo. Aunque me siento bien, siempre voy al chequeo porque prefiero prevenir antes que curar. Después del chequeo del año, el médico dice que todo está perfecto.',
  gloss: [
    { es: 'los pulmones', en: 'the lungs' },
    { es: 'el análisis de sangre', en: 'blood test' },
    { es: 'detectar', en: 'to detect' },
    { es: 'prevenir', en: 'to prevent' }
  ],
  questions: [
    { type: 'mcq', q: '¿Con qué frecuencia hace el chequeo?', options: ['Cada año', 'Cada mes', 'Solo si está enfermo'], answer: 0 },
    { type: 'mcq', q: '¿Qué revisa el médico?', options: ['El corazón y los pulmones', 'Solo los ojos', 'La piel'], answer: 0 },
    { type: 'short', q: '¿Qué prefiere hacer en vez de curar? (una palabra)', accept: ['prevenir'] },
    { type: 'translate', line: 'Aunque me siento bien, siempre voy al chequeo porque prefiero prevenir antes que curar.', model: 'Even though I feel fine, I always go to the checkup because I prefer to prevent rather than cure.' }
  ]
},

{
  id: 'rebajas-tienda-vocab26', title: 'Las rebajas de la tienda', level: 1,
  text: 'Durante las rebajas, la tienda ofrece un buen descuento en varias marcas conocidas. Reviso el precio antes de comprar para asegurarme de que es una oferta real. Después de pagar, siempre guardo el recibo por si necesito devolver algo. Mi marca favorita de zapatos tiene un descuento del cincuenta por ciento esta semana. Comparo precios en varias tiendas antes de decidir dónde comprar.',
  gloss: [
    { es: 'las rebajas', en: 'the sales' },
    { es: 'asegurarme', en: 'to make sure' },
    { es: 'devolver', en: 'to return' },
    { es: 'comparo', en: 'I compare' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace antes de comprar?', options: ['Revisa el precio', 'Pregunta a un amigo', 'Compra sin mirar'], answer: 0 },
    { type: 'mcq', q: '¿Por qué guarda el recibo?', options: ['Por si necesita devolver algo', 'Para el banco', 'Por costumbre'], answer: 0 },
    { type: 'short', q: '¿Qué descuento tiene su marca favorita de zapatos? (dos palabras)', accept: ['cincuenta por ciento', '50 por ciento'] },
    { type: 'translate', line: 'Comparo precios en varias tiendas antes de decidir dónde comprar.', model: 'I compare prices at several stores before deciding where to buy.' }
  ]
},

{
  id: 'deportes-favoritos-vocab27', title: 'Los deportes favoritos', level: 1,
  text: 'Mi hijo juega al fútbol en el equipo de la escuela y tiene un partido cada sábado. Mi hija prefiere el baloncesto porque le gusta jugar en equipo con sus amigas. Yo prefiero la natación, aunque de vez en cuando también juego al tenis con mi pareja. Los fines de semana, toda la familia va al gimnasio juntos. Cuando llueve, los niños juegan con la pelota en el salón, aunque no siempre les dejo.',
  gloss: [
    { es: 'de vez en cuando', en: 'every now and then' },
    { es: 'el salón', en: 'the living room' },
    { es: 'dejo', en: 'I allow' },
    { es: 'cada sábado', en: 'every Saturday' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué deporte prefiere la hija?', options: ['Baloncesto', 'Fútbol', 'Tenis'], answer: 0 },
    { type: 'mcq', q: '¿Adónde va toda la familia los fines de semana?', options: ['Al gimnasio', 'A la playa', 'Al cine'], answer: 0 },
    { type: 'short', q: '¿Con qué juegan los niños cuando llueve? (una palabra)', accept: ['la pelota', 'pelota'] },
    { type: 'translate', line: 'Los fines de semana, toda la familia va al gimnasio juntos.', model: 'On weekends, the whole family goes to the gym together.' }
  ]
},

{
  id: 'horario-semanal-vocab-time2', title: 'Mi horario semanal', level: 1,
  text: 'Los lunes y los martes trabajo temprano porque tengo reuniones importantes. Los miércoles suelo llegar un poco más tarde a la oficina. Los jueves y los viernes son mis días más tranquilos de la semana. Los sábados me despierto tarde y disfruto de la mañana sin prisa. Los domingos, en cambio, me levanto temprano para hacer deporte antes de empezar la semana otra vez.',
  gloss: [
    { es: 'suelo llegar', en: 'I usually arrive' },
    { es: 'sin prisa', en: 'without hurry' },
    { es: 'en cambio', en: 'on the other hand' },
    { es: 'hacer deporte', en: 'to exercise' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué días trabaja temprano?', options: ['Lunes y martes', 'Sábado y domingo', 'Solo los viernes'], answer: 0 },
    { type: 'mcq', q: '¿Cómo son los jueves y viernes?', options: ['Los días más tranquilos', 'Los más ocupados', 'Iguales que el lunes'], answer: 0 },
    { type: 'short', q: '¿Qué hace los domingos? (tres palabras)', accept: ['hacer deporte', 'se levanta temprano', 'levanta temprano'] },
    { type: 'translate', line: 'Los sábados me despierto tarde y disfruto de la mañana sin prisa.', model: 'On Saturdays I wake up late and enjoy the morning without rushing.' }
  ]
},

{
  id: 'examen-final-vocab-adj3', title: 'El examen final', level: 1,
  text: 'Antes del examen final, mi hermana está muy nerviosa porque no estudia lo suficiente. Yo, en cambio, me siento tranquilo porque practico cada día. Ella dice que está aburrida de estudiar tanto, pero sabe que debe seguir. Nuestro padre está muy ocupado con el trabajo, pero siempre encuentra tiempo para ayudarnos. Cuando llegan las notas, mi hermana se pone enferma de los nervios, pero al final está sorprendida y orgullosa de su resultado. Yo también estoy agradecido y emocionado por terminar el curso.',
  gloss: [
    { es: 'lo suficiente', en: 'enough' },
    { es: 'seguir', en: 'to keep going' },
    { es: 'se pone enferma', en: 'gets sick' },
    { es: 'los nervios', en: 'nerves' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué está nerviosa la hermana?', options: ['No estudia lo suficiente', 'Está enferma', 'No le gusta el examen'], answer: 0 },
    { type: 'mcq', q: '¿Cómo se siente el narrador?', options: ['Tranquilo', 'Nervioso', 'Aburrido'], answer: 0 },
    { type: 'short', q: '¿Cómo está la hermana al final, con las notas? (dos palabras)', accept: ['sorprendida y orgullosa', 'orgullosa', 'sorprendida'] },
    { type: 'translate', line: 'Yo también estoy agradecido y emocionado por terminar el curso.', model: 'I am also grateful and excited to finish the course.' }
  ]
},

{
  id: 'viaje-tren-vocab-travel', title: 'Un viaje en tren', level: 1,
  text: 'Para ir a la boda de mi prima, compro un billete de tren en vez de coger el avión. Prefiero el tren al autobús porque es más cómodo para llevar la maleta grande. Antes de salir, reviso el mapa para saber cómo llegar del tren al hotel. Mi coche se queda en el garaje porque no quiero conducir tan lejos. Al llegar, el hotel está cerca de la estación, así que camino con la maleta sin problema.',
  gloss: [
    { es: 'en vez de', en: 'instead of' },
    { es: 'cómodo', en: 'comfortable' },
    { es: 'el garaje', en: 'the garage' },
    { es: 'sin problema', en: 'without trouble' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué prefiere el tren al autobús?', options: ['Es más cómodo para la maleta', 'Es más barato', 'Es más rápido'], answer: 0 },
    { type: 'mcq', q: '¿Qué revisa antes de salir?', options: ['El mapa', 'El billete', 'El pasaporte'], answer: 0 },
    { type: 'short', q: '¿Dónde se queda el coche? (una palabra)', accept: ['garaje', 'el garaje'] },
    { type: 'translate', line: 'Al llegar, el hotel está cerca de la estación, así que camino con la maleta sin problema.', model: 'On arrival, the hotel is near the station, so I walk with the suitcase without trouble.' }
  ]
},

{
  id: 'cambio-tiempo-vocab-weather', title: 'Un cambio de tiempo repentino', level: 1,
  text: 'Esta mañana, el cielo está lleno de nubes grises y parece que se acerca una tormenta. Se oye un trueno lejano y el viento sopla más fuerte. Por la noche, empieza a caer nieve ligera en las montañas cercanas. Al amanecer, una niebla espesa cubre todo el valle y apenas se ve nada. Los conductores van más despacio por la niebla y evitan salir si hay tormenta.',
  gloss: [
    { es: 'se acerca', en: 'is approaching' },
    { es: 'lejano', en: 'distant' },
    { es: 'espesa', en: 'thick' },
    { es: 'el valle', en: 'the valley' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué se oye a lo lejos?', options: ['Un trueno', 'Un avión', 'Un coche'], answer: 0 },
    { type: 'mcq', q: '¿Qué cubre el valle al amanecer?', options: ['Una niebla espesa', 'Nieve', 'Lluvia fuerte'], answer: 0 },
    { type: 'short', q: '¿Qué evitan hacer los conductores con niebla? (una palabra)', accept: ['salir'] },
    { type: 'translate', line: 'Al amanecer, una niebla espesa cubre todo el valle y apenas se ve nada.', model: 'At dawn, a thick fog covers the whole valley and you can barely see anything.' }
  ]
},

{
  id: 'preparando-maleta-vocab-clothing', title: 'Preparando la maleta', level: 1,
  text: 'Para mi próximo trabajo en otra ciudad, meto dos camisas y unos pantalones oscuros en la maleta. También llevo un vestido elegante por si hay una cena formal. No olvido los zapatos cómodos para caminar por la ciudad. Como hace frío, añado un abrigo grueso encima de todo. Al final, cierro la maleta y compruebo que llevo toda la ropa necesaria para la semana.',
  gloss: [
    { es: 'de negocios', en: 'business (trip)' },
    { es: 'por si hay', en: 'in case there is' },
    { es: 'encima de todo', en: 'on top of everything' },
    { es: 'compruebo', en: 'I check' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué mete en la maleta para el viaje?', options: ['Camisas y pantalones', 'Solo zapatos', 'Un vestido de fiesta'], answer: 0 },
    { type: 'mcq', q: '¿Por qué lleva el vestido elegante?', options: ['Por si hay una cena formal', 'Para el avión', 'Para caminar'], answer: 0 },
    { type: 'short', q: '¿Qué añade porque hace frío? (una palabra)', accept: ['abrigo', 'un abrigo'] },
    { type: 'translate', line: 'Al final, cierro la maleta y compruebo que llevo toda la ropa necesaria para la semana.', model: 'In the end, I close the suitcase and check that I have all the clothes I need for the week.' }
  ]
},

{
  id: 'visita-granja-vocab-animals', title: 'Una visita a la granja', level: 1,
  text: 'En la granja, los niños ven vacas, ovejas y un caballo grande cerca del establo. Un perro guardián corre por el campo mientras un gato duerme tranquilo al sol. Un pájaro canta desde un árbol cercano y un ratón pequeño se esconde dentro de la paja. El guía explica que, aunque parece un zoológico, no hay leones ni osos en la granja, solo animales de campo. En el estanque, los niños ven peces de colores nadando tranquilamente.',
  gloss: [
    { es: 'el establo', en: 'the stable' },
    { es: 'la paja', en: 'the straw' },
    { es: 'el zoológico', en: 'the zoo' },
    { es: 'el estanque', en: 'the pond' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué animales ven cerca del establo?', options: ['Vacas, ovejas y un caballo', 'Leones y osos', 'Solo gatos'], answer: 0 },
    { type: 'mcq', q: '¿Dónde se esconde el ratón?', options: ['Dentro de la paja', 'En el estanque', 'En el árbol'], answer: 0 },
    { type: 'short', q: '¿Qué ven en el estanque? (dos palabras)', accept: ['peces de colores', 'peces'] },
    { type: 'translate', line: 'El guía explica que, aunque parece un zoológico, no hay leones ni osos en la granja, solo animales de campo.', model: 'The guide explains that, although it looks like a zoo, there are no lions or bears on the farm, only farm animals.' }
  ]
},

{
  id: 'lavando-platos-vocab-kitchen', title: 'Lavando los platos', level: 1,
  text: 'Después de cenar, lavo la sartén, los cuchillos y los tenedores con cuidado. Seco cada plato y cada cuchara antes de guardarlos en el armario. Uso un cuchillo afilado para cortar la fruta y un tenedor pequeño para el postre. La sartén necesita un lavado especial porque se pega la comida. Al final, guardo todo: platos, cucharas, tenedores y cuchillos, cada cosa en su sitio.',
  gloss: [
    { es: 'secar', en: 'to dry' },
    { es: 'afilado', en: 'sharp' },
    { es: 'se pega', en: 'sticks' },
    { es: 'cada cosa en su sitio', en: 'everything in its place' }
  ],
  questions: [
    { type: 'mcq', q: '¿Con qué lava los cuchillos y tenedores?', options: ['Con cuidado', 'Con agua fría solamente', 'No los lava'], answer: 0 },
    { type: 'mcq', q: '¿Para qué usa el cuchillo afilado?', options: ['Para cortar la fruta', 'Para cortar pan', 'Para pelar patatas'], answer: 0 },
    { type: 'short', q: '¿Por qué necesita un lavado especial la sartén? (tres palabras)', accept: ['se pega la comida', 'pega la comida'] },
    { type: 'translate', line: 'Al final, guardo todo: platos, cucharas, tenedores y cuchillos, cada cosa en su sitio.', model: 'In the end, I put everything away: plates, spoons, forks, and knives, each thing in its place.' }
  ]
},

{
  id: 'semana-trabajo-vocab-work', title: 'Una semana de trabajo intenso', level: 1,
  text: 'El lunes tengo una reunión larga para hablar del nuevo proyecto. El martes escribo un informe detallado sobre los resultados del mes. Mi hija, mientras tanto, prepara un examen importante para la escuela. Ella siempre saca buena nota porque estudia mucho. Al final de la semana, presento el proyecto en otra reunión y espero recibir buenas noticias sobre el informe.',
  gloss: [
    { es: 'detallado', en: 'detailed' },
    { es: 'mientras tanto', en: 'meanwhile' },
    { es: 'sacar buena nota', en: 'to get a good grade' },
    { es: 'las noticias', en: 'the news' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace el lunes?', options: ['Una reunión sobre el proyecto', 'Un examen', 'Vacaciones'], answer: 0 },
    { type: 'mcq', q: '¿Por qué la hija saca buena nota?', options: ['Estudia mucho', 'Tiene suerte', 'El examen es fácil'], answer: 0 },
    { type: 'short', q: '¿Qué presenta al final de la semana? (una palabra)', accept: ['el proyecto', 'proyecto'] },
    { type: 'translate', line: 'Al final de la semana, presento el proyecto en otra reunión y espero recibir buenas noticias sobre el informe.', model: 'At the end of the week, I present the project in another meeting and hope to receive good news about the report.' }
  ]
},

{
  id: 'problemas-ordenador-vocab-tech1', title: 'Problemas con el ordenador', level: 1,
  text: 'Esta mañana, mi ordenador no enciende y la pantalla se queda negra. Reviso el wifi de casa, pero el problema no es la conexión. Olvido la contraseña de mi correo electrónico y tardo un rato en recuperarla. Instalo una actualización del navegador y, por suerte, todo empieza a funcionar mejor. Antes de seguir, guardo una copia de seguridad de cada archivo importante. Mi hija, mientras tanto, revisa una aplicación nueva de una red social en su móvil.',
  gloss: [
    { es: 'recuperarla', en: 'to recover it' },
    { es: 'por suerte', en: 'luckily' },
    { es: 'seguir', en: 'to continue' },
    { es: 'mientras tanto', en: 'meanwhile' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué problema tiene el ordenador esta mañana?', options: ['No enciende y la pantalla está negra', 'Se ha roto el teclado', 'No tiene batería'], answer: 0 },
    { type: 'mcq', q: '¿Qué instala para arreglarlo?', options: ['Una actualización del navegador', 'Un antivirus', 'Más memoria'], answer: 0 },
    { type: 'short', q: '¿Qué guarda antes de seguir? (tres palabras)', accept: ['copia de seguridad', 'una copia de seguridad'] },
    { type: 'translate', line: 'Antes de seguir, guardo una copia de seguridad de cada archivo importante.', model: 'Before continuing, I save a backup of every important file.' }
  ]
},

{
  id: 'videollamada-trabajo-vocab-tech2', title: 'Una reunión virtual de trabajo', level: 1,
  text: 'Cada semana, tengo una reunión virtual con mi equipo por videollamada. Antes de empezar, reviso mi correo y borro todo el correo basura que recibo. Me preocupa la privacidad de mis datos personales, así que reviso bien cada aplicación nueva. En la reunión, hablamos de un proyecto que usa inteligencia artificial para mejorar el algoritmo de recomendaciones. Al final, todos estamos de acuerdo en que la tecnología nos ayuda mucho, aunque a veces preferimos hablar en persona.',
  gloss: [
    { es: 'borro', en: 'I delete' },
    { es: 'me preocupa', en: 'it worries me' },
    { es: 'de acuerdo', en: 'in agreement' },
    { es: 'en persona', en: 'in person' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué borra antes de empezar la reunión?', options: ['El correo basura', 'Sus archivos', 'Sus fotos'], answer: 0 },
    { type: 'mcq', q: '¿Qué le preocupa a la narradora?', options: ['La privacidad de sus datos', 'El precio del móvil', 'La velocidad del wifi'], answer: 0 },
    { type: 'short', q: '¿Para qué usa inteligencia artificial el proyecto? (tres palabras)', accept: ['mejorar el algoritmo', 'mejorar recomendaciones'] },
    { type: 'translate', line: 'Al final, todos estamos de acuerdo en que la tecnología nos ayuda mucho, aunque a veces preferimos hablar en persona.', model: 'In the end, we all agree that technology helps us a lot, although sometimes we prefer to talk in person.' }
  ]
},

{
  id: 'planificacion-financiera-vocab-fin1', title: 'La planificación financiera', level: 1,
  text: 'Cada mes, pago la hipoteca y el seguro del coche antes que cualquier otro gasto. Reviso mi presupuesto para saber cuánto ahorro me queda después de pagar el alquiler y las facturas. Pienso en abrir una inversión pequeña para el futuro, aunque todavía tengo una deuda del préstamo del coche. También pago un impuesto especial por trabajar de forma independiente. Mi salario cubre todo esto, pero ahorro poco para la jubilación.',
  gloss: [
    { es: 'el gasto', en: 'the expense' },
    { es: 'de forma independiente', en: 'self-employed' },
    { es: 'cubre', en: 'covers' },
    { es: 'todavía', en: 'still' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué paga antes que cualquier otro gasto?', options: ['La hipoteca y el seguro', 'El alquiler', 'Las facturas'], answer: 0 },
    { type: 'mcq', q: '¿Por qué paga un impuesto especial?', options: ['Trabaja de forma independiente', 'Tiene un coche nuevo', 'Vive en otro país'], answer: 0 },
    { type: 'short', q: '¿Para qué ahorra poco? (una palabra)', accept: ['la jubilación', 'jubilación'] },
    { type: 'translate', line: 'Mi salario cubre todo esto, pero ahorro poco para la jubilación.', model: 'My salary covers all of this, but I save little for retirement.' }
  ]
},

{
  id: 'declaracion-impuestos-vocab-fin2', title: 'La declaración de impuestos', level: 1,
  text: 'Cada año, en primavera, preparo la declaración del impuesto sobre la renta. Reúno todos mis documentos de salario y gastos del año anterior. El proceso me parece complicado, así que pido ayuda a un gestor. El impuesto sobre la renta depende de cuánto gano durante el año. Cuando termino, siento un gran alivio porque ya no tengo que pensar en ello hasta el año siguiente.',
  gloss: [
    { es: 'la declaración', en: 'the tax return' },
    { es: 'un gestor', en: 'an accountant / agent' },
    { es: 'el alivio', en: 'the relief' },
    { es: 'gastos', en: 'expenses' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuándo prepara la declaración?', options: ['Cada año en primavera', 'Cada mes', 'Solo una vez en la vida'], answer: 0 },
    { type: 'mcq', q: '¿A quién pide ayuda?', options: ['A un gestor', 'A un abogado', 'A un banco'], answer: 0 },
    { type: 'short', q: '¿Qué siente cuando termina? (dos palabras)', accept: ['un alivio', 'gran alivio'] },
    { type: 'translate', line: 'El impuesto sobre la renta depende de cuánto gano durante el año.', model: 'Income tax depends on how much I earn during the year.' }
  ]
},

{
  id: 'buscando-empleo-vocab-career1', title: 'Buscando un nuevo empleo', level: 1,
  text: 'Después de mi despido, empiezo a buscar un nuevo empleo con calma. Actualizo mi currículum y lo envío a varias empresas de la ciudad. En la entrevista, pregunto por el horario y el sueldo antes de firmar cualquier contrato. Un amigo en el sindicato me avisa de una huelga que puede afectar mi próximo trabajo. Al final, una empresa pequeña me ofrece un ascenso rápido, y decido aceptar sin dudarlo. Mi antiguo cliente favorito incluso me felicita por el cambio.',
  gloss: [
    { es: 'avisa', en: 'warns' },
    { es: 'afectar', en: 'to affect' },
    { es: 'sin dudarlo', en: 'without hesitation' },
    { es: 'felicita', en: 'congratulates' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué actualiza antes de buscar trabajo?', options: ['Su currículum', 'Su casa', 'Su coche'], answer: 0 },
    { type: 'mcq', q: '¿Qué le avisa un amigo del sindicato?', options: ['Una huelga próxima', 'Un ascenso', 'Un despido'], answer: 0 },
    { type: 'short', q: '¿Qué le ofrece la empresa pequeña al final? (una palabra)', accept: ['un ascenso', 'ascenso'] },
    { type: 'translate', line: 'Mi antiguo cliente favorito incluso me felicita por el cambio.', model: 'My old favorite client even congratulates me on the change.' }
  ]
},

{
  id: 'formacion-profesional-vocab-career2', title: 'La formación profesional', level: 1,
  text: 'Después de un período de desempleo, decido invertir en mi formación profesional. Empiezo una especialización en marketing digital mientras busco trabajo. Muchos amigos prefieren el teletrabajo porque permite mejor equilibrio con la jornada laboral. Un amigo emprendedor decide crear su propia startup en vez de buscar empleo tradicional. Solicito una beca para pagar el posgrado, porque la maestría es cara. Al final, encuentro un puesto excelente y compito bien en el mercado laboral gracias a mi nueva formación.',
  gloss: [
    { es: 'el equilibrio', en: 'the balance' },
    { es: 'tradicional', en: 'traditional' },
    { es: 'solicito', en: 'I apply for' },
    { es: 'gracias a', en: 'thanks to' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué decide hacer tras el desempleo?', options: ['Invertir en su formación', 'Mudarse de país', 'Jubilarse'], answer: 0 },
    { type: 'mcq', q: '¿Por qué muchos amigos prefieren el teletrabajo?', options: ['Mejor equilibrio con la jornada laboral', 'Ganan más dinero', 'Es más fácil'], answer: 0 },
    { type: 'short', q: '¿Qué crea el amigo emprendedor? (una palabra)', accept: ['una startup', 'startup'] },
    { type: 'translate', line: 'Al final, encuentro un puesto excelente y compito bien en el mercado laboral gracias a mi nueva formación.', model: 'In the end, I find an excellent position and compete well in the job market thanks to my new training.' }
  ]
},

{
  id: 'dia-profesiones-vocab-professions', title: 'Un día en distintas profesiones', level: 1,
  text: 'El médico y la médica del centro de salud atienden a muchos pacientes cada día. El profesor y la profesora de mi hijo preparan clases interesantes para los niños. Un abogado ayuda a mi vecino con un problema legal, mientras un ingeniero diseña un puente nuevo en la ciudad. El cocinero del restaurante prepara platos deliciosos, y el camarero los sirve con una sonrisa. Un policía vigila la calle principal, y un estudiante universitario estudia en la biblioteca hasta tarde.',
  gloss: [
    { es: 'atienden', en: 'they see (patients)' },
    { es: 'un puente', en: 'a bridge' },
    { es: 'vigila', en: 'patrols' },
    { es: 'universitario', en: 'university (adj.)' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hace el ingeniero?', options: ['Diseña un puente nuevo', 'Cura pacientes', 'Sirve comida'], answer: 0 },
    { type: 'mcq', q: '¿Quién sirve los platos con una sonrisa?', options: ['El camarero', 'El cocinero', 'El policía'], answer: 0 },
    { type: 'short', q: '¿Dónde estudia el estudiante hasta tarde? (una palabra)', accept: ['la biblioteca', 'biblioteca'] },
    { type: 'translate', line: 'Un policía vigila la calle principal, y un estudiante universitario estudia en la biblioteca hasta tarde.', model: 'A police officer patrols the main street, and a university student studies at the library until late.' }
  ]
},

{
  id: 'etapas-pareja-vocab-relationships', title: 'Las etapas de una pareja', level: 1,
  text: 'Después de varios años juntos, mi pareja y yo decidimos casarnos, y ahora planeamos la boda. Muchas parejas hoy prefieren una convivencia larga antes del matrimonio oficial. Mi hermana, en cambio, vive un momento difícil: su matrimonio termina en divorcio después de diez años. Otra amiga espera un bebé y disfruta mucho de su embarazo. Sabemos que la crianza de un hijo no es fácil, pero queremos formar una familia pronto.',
  gloss: [
    { es: 'la etapa', en: 'the stage' },
    { es: 'oficial', en: 'official' },
    { es: 'en cambio', en: 'on the other hand' },
    { es: 'formar una familia', en: 'to start a family' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué prefieren muchas parejas hoy?', options: ['Una convivencia larga antes del matrimonio', 'Casarse jóvenes', 'No vivir juntos nunca'], answer: 0 },
    { type: 'mcq', q: '¿Qué le pasa al matrimonio de la hermana?', options: ['Termina en divorcio', 'Sigue muy feliz', 'Tienen un hijo'], answer: 0 },
    { type: 'short', q: '¿Qué espera la amiga? (una palabra)', accept: ['un bebé', 'bebé'] },
    { type: 'translate', line: 'Sabemos que la crianza de un hijo no es fácil, pero queremos formar una familia pronto.', model: "We know that raising a child isn't easy, but we want to start a family soon." }
  ]
},

{
  id: 'noticias-locales-vocab-society', title: 'Las noticias locales', level: 1,
  text: 'Las noticias de hoy hablan mucho sobre el cambio climático y sus efectos en el medio ambiente. El gobierno local propone una nueva ley contra la contaminación de los ríos. Muchos vecinos apoyan el reciclaje y participan en una manifestación pacífica para pedir más medidas. La política del ayuntamiento también afecta la economía de la ciudad porque decide invertir en energía limpia. La ciudadanía en general apoya estos cambios, aunque algunos piensan que el proceso es demasiado lento.',
  gloss: [
    { es: 'los efectos', en: 'the effects' },
    { es: 'propone', en: 'proposes' },
    { es: 'pacífica', en: 'peaceful' },
    { es: 'energía limpia', en: 'clean energy' }
  ],
  questions: [
    { type: 'mcq', q: '¿Sobre qué hablan las noticias de hoy?', options: ['El cambio climático', 'Un partido de fútbol', 'Una boda real'], answer: 0 },
    { type: 'mcq', q: '¿Qué proponen contra la contaminación?', options: ['Una nueva ley', 'Más impuestos', 'Cerrar fábricas'], answer: 0 },
    { type: 'short', q: '¿En qué participan los vecinos? (dos palabras)', accept: ['una manifestación', 'manifestación pacífica'] },
    { type: 'translate', line: 'La ciudadanía en general apoya estos cambios, aunque algunos piensan que el proceso es demasiado lento.', model: 'The public in general supports these changes, although some think the process is too slow.' }
  ]
},

{
  id: 'tramites-oficina-vocab-bureaucracy', title: 'Trámites en la oficina', level: 1,
  text: 'Para conseguir el permiso de residencia, primero necesito varios documentos que prueban mi identidad y mi nacionalidad. Odio la burocracia, pero entiendo que cada trámite tiene su motivo. En la oficina, firmo cada documento con mi firma digital para ahorrar tiempo. El funcionario revisa todo con calma antes de aceptar mi solicitud. Al final, después de tanto trámite, consigo el permiso de residencia y respiro tranquilo.',
  gloss: [
    { es: 'prueban', en: 'prove' },
    { es: 'el motivo', en: 'the reason' },
    { es: 'el funcionario', en: 'the clerk' },
    { es: 'la solicitud', en: 'the application' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué necesita para el permiso de residencia?', options: ['Varios documentos', 'Solo su pasaporte', 'Nada especial'], answer: 0 },
    { type: 'mcq', q: '¿Con qué firma los documentos?', options: ['Con su firma digital', 'A mano siempre', 'No firma nada'], answer: 0 },
    { type: 'short', q: '¿Cómo revisa todo el funcionario? (dos palabras)', accept: ['con calma', 'todo con calma'] },
    { type: 'translate', line: 'Al final, después de tanto trámite, consigo el permiso de residencia y respiro tranquilo.', model: 'In the end, after so much paperwork, I get the residence permit and breathe easy.' }
  ]
},

{
  id: 'ser-estar-contraste', title: 'Ser y estar: dos maneras de ser', level: 1,
  text: 'Mi amiga Laura es alta, morena y muy inteligente; esas son características que no cambian. Pero hoy Laura está cansada porque trabaja mucho los fines de semana. Ser describe quién es alguien de forma permanente, mientras que estar describe cómo se encuentra en un momento concreto. Por ejemplo, Madrid es la capital de España, pero ahora mismo está lloviendo allí. Otro ejemplo: mi hermano es médico, y también está muy ocupado esta semana en el hospital. Aprender cuándo usar ser y cuándo usar estar es clave para hablar bien español.',
  gloss: [
    { es: 'de forma permanente', en: 'permanently' },
    { es: 'un momento concreto', en: 'a specific moment' },
    { es: 'la capital', en: 'the capital' },
    { es: 'clave', en: 'key' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué usamos para describir características permanentes?', options: ['Ser', 'Estar', 'Los dos igual'], answer: 0 },
    { type: 'mcq', q: '¿Qué usamos para describir un estado temporal?', options: ['Estar', 'Ser', 'Ninguno'], answer: 0 },
    { type: 'short', q: '¿Qué es Madrid? (una palabra)', accept: ['la capital', 'capital'] },
    { type: 'translate', line: 'Ser describe quién es alguien de forma permanente, mientras que estar describe cómo se encuentra en un momento concreto.', model: 'Ser describes who someone is permanently, while estar describes how they are at a specific moment.' }
  ]
},

{
  id: 'por-para-contraste', title: 'Por y para: dos preposiciones, un dolor de cabeza', level: 2,
  text: 'Estudio español para conseguir un mejor trabajo, y también para viajar sin problemas. Uso para cuando hablo de un objetivo o un destino: un tren sale para Madrid a las ocho. En cambio, uso por para hablar de una causa o un intercambio: perdí el autobús por llegar tarde. También digo gracias por tu ayuda, porque agradezco lo que alguien hizo por mí. Caminamos por el parque durante una hora, sin destino fijo. Con práctica, la diferencia entre por y para deja de ser un problema.',
  gloss: [
    { es: 'el objetivo', en: 'the goal' },
    { es: 'un destino', en: 'a destination' },
    { es: 'un intercambio', en: 'an exchange' },
    { es: 'sin destino fijo', en: 'without a fixed destination' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuándo usamos "para"?', options: ['Para un objetivo o destino', 'Para una causa', 'Para un intercambio'], answer: 0 },
    { type: 'mcq', q: '¿Por qué perdió el autobús?', options: ['Por llegar tarde', 'Por dormir mucho', 'Por no tener dinero'], answer: 0 },
    { type: 'short', q: '¿Por dónde caminan durante una hora? (una palabra)', accept: ['el parque', 'parque'] },
    { type: 'translate', line: 'Con práctica, la diferencia entre por y para deja de ser un problema.', model: 'With practice, the difference between por and para stops being a problem.' }
  ]
},

{
  id: 'preterito-imperfecto-contraste', title: 'Cuando el pasado se encuentra con el pasado', level: 2,
  text: 'Cuando era niño, vivía en un pueblo pequeño y todos los días caminaba a la escuela. Pero un día, todo cambió: mis padres decidieron mudarse a la ciudad. Antes de esa mudanza, yo jugaba en la calle con mis amigos todas las tardes; ese día, en cambio, hicimos las maletas y nos despedimos de todos. El imperfecto describe cómo era mi vida en general, mientras que el pretérito cuenta el momento exacto en que algo cambió. Todavía recuerdo ese último día en el pueblo con mucha nostalgia.',
  gloss: [
    { es: 'la mudanza', en: 'the move' },
    { es: 'nos despedimos', en: 'we said goodbye' },
    { es: 'en general', en: 'in general' },
    { es: 'la nostalgia', en: 'nostalgia' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué describe el imperfecto?', options: ['Cómo era la vida en general', 'Un momento exacto', 'El futuro'], answer: 0 },
    { type: 'mcq', q: '¿Qué cambió un día?', options: ['Sus padres decidieron mudarse', 'Cambió de escuela', 'Perdió a un amigo'], answer: 0 },
    { type: 'short', q: '¿Qué hicieron antes de irse? (dos palabras)', accept: ['las maletas', 'hicieron maletas'] },
    { type: 'translate', line: 'El imperfecto describe cómo era mi vida en general, mientras que el pretérito cuenta el momento exacto en que algo cambió.', model: 'The imperfect describes what my life was like in general, while the preterite tells the exact moment something changed.' }
  ]
},

{
  id: 'genero-articulos-contraste', title: 'El género de las palabras', level: 1,
  text: 'En español, cada sustantivo tiene un género: masculino o femenino. Decimos el libro y la mesa, el coche y la casa. Muchas palabras que terminan en -o son masculinas, como el gato, y muchas que terminan en -a son femeninas, como la flor. Pero hay excepciones importantes: decimos el día y el mapa, aunque terminan en -a, y decimos la mano, aunque termina en -o. El artículo cambia también en plural: los libros, las mesas. Aprender el género correcto de cada palabra lleva tiempo, pero con práctica se vuelve natural.',
  gloss: [
    { es: 'el sustantivo', en: 'the noun' },
    { es: 'el género', en: 'gender' },
    { es: 'una excepción', en: 'an exception' },
    { es: 'natural', en: 'natural' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué género tienen la mayoría de palabras terminadas en -o?', options: ['Masculino', 'Femenino', 'Depende'], answer: 0 },
    { type: 'mcq', q: '¿Qué palabra es una excepción, terminada en -a pero masculina?', options: ['El día', 'La flor', 'La casa'], answer: 0 },
    { type: 'short', q: '¿Cómo se dice "the hands" en plural? (dos palabras)', accept: ['las manos'] },
    { type: 'translate', line: 'Aprender el género correcto de cada palabra lleva tiempo, pero con práctica se vuelve natural.', model: 'Learning the correct gender of each word takes time, but with practice it becomes natural.' }
  ]
},

{
  id: 'ropa-invierno', title: 'Ropa para el invierno', level: 1,
  text: 'Marta necesita ropa nueva para el invierno. Va a una tienda grande en el centro con su hermana. Primero, busca un abrigo grueso y unos zapatos cómodos. Después, mira unas camisas de muchos colores: azul, verde y negro. El vestido rojo es bonito, pero es un poco caro. Al final, compra el abrigo y los zapatos. Paga con tarjeta y sale muy contenta de la tienda.',
  gloss: [
    { es: 'el abrigo', en: 'the coat' },
    { es: 'grueso', en: 'thick' },
    { es: 'cómodos', en: 'comfortable' },
    { es: 'al final', en: 'in the end' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué busca primero Marta?', options: ['Un vestido', 'Un abrigo y zapatos', 'Una camisa'], answer: 1 },
    { type: 'mcq', q: '¿De qué color es el vestido?', options: ['Azul', 'Rojo', 'Verde'], answer: 1 },
    { type: 'short', q: '¿Cómo paga Marta? (una palabra)', accept: ['tarjeta', 'con tarjeta'] },
    { type: 'translate', line: 'Al final, compra el abrigo y los zapatos.', model: 'In the end, she buys the coat and the shoes.' }
  ]
},

{
  id: 'dia-medico', title: 'Una visita al médico', level: 1,
  text: 'Pablo no se siente bien y decide ir al médico. En la sala de espera, hay muchas personas y Pablo espera media hora. La médica escucha su corazón y pregunta sobre sus síntomas. Pablo tiene un poco de fiebre y le duele la cabeza. La médica dice que necesita descansar y beber mucha agua. También recomienda una medicina para la fiebre. Pablo da las gracias y vuelve a casa a descansar.',
  gloss: [
    { es: 'la sala de espera', en: 'the waiting room' },
    { es: 'los síntomas', en: 'the symptoms' },
    { es: 'la fiebre', en: 'the fever' },
    { es: 'dar las gracias', en: 'to say thanks' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué va Pablo al médico?', options: ['Le duele la cabeza y tiene fiebre', 'Tiene hambre', 'Quiere unas vacaciones'], answer: 0 },
    { type: 'mcq', q: '¿Qué recomienda la médica?', options: ['Una medicina', 'Un viaje', 'Hacer ejercicio'], answer: 0 },
    { type: 'short', q: '¿Quién escucha el corazón de Pablo? (una palabra)', accept: ['la médica', 'médica'] },
    { type: 'translate', line: 'La médica dice que necesita descansar y beber mucha agua.', model: 'The doctor says he needs to rest and drink a lot of water.' }
  ]
},

{
  id: 'oficina-tecnologia', title: 'Un problema con el ordenador', level: 1,
  text: 'Ana trabaja en una oficina moderna y usa el ordenador todo el día. Hoy, su ordenador no funciona bien y la pantalla está negra. Ana llama a un compañero que entiende de tecnología. Él mira el ordenador y dice que necesita una actualización. Instala el programa nuevo y todo funciona otra vez. Ana da las gracias y guarda sus archivos importantes. Ahora puede terminar su trabajo sin problemas.',
  gloss: [
    { es: 'la pantalla', en: 'the screen' },
    { es: 'la actualización', en: 'the update' },
    { es: 'instala', en: 'installs' },
    { es: 'los archivos', en: 'the files' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuál es el problema?', options: ['El ordenador no funciona', 'Ana pierde su trabajo', 'La oficina está cerrada'], answer: 0 },
    { type: 'mcq', q: '¿Quién ayuda a Ana?', options: ['Un compañero', 'Su jefe', 'Un cliente'], answer: 0 },
    { type: 'short', q: '¿Qué instala el compañero? (una palabra)', accept: ['el programa', 'un programa', 'programa', 'actualización'] },
    { type: 'translate', line: 'Instala el programa nuevo y todo funciona otra vez.', model: 'He installs the new program and everything works again.' }
  ]
},

{
  id: 'videollamada-abuela', title: 'Una videollamada con la abuela', level: 1,
  text: 'Todos los domingos, Elena hace una videollamada con su abuela. Su abuela vive lejos, en otra ciudad, y no puede visitarla mucho. Durante la llamada, hablan de la familia y de la semana. La abuela pregunta por los estudios de Elena y ella responde con detalles. A veces, ven fotos juntas y se ríen mucho. La conexión no es siempre perfecta, pero las dos disfrutan mucho el tiempo juntas. Para Elena, esta hora es muy especial.',
  gloss: [
    { es: 'la videollamada', en: 'the video call' },
    { es: 'lejos', en: 'far away' },
    { es: 'la conexión', en: 'the connection' },
    { es: 'disfrutan', en: 'they enjoy' }
  ],
  questions: [
    { type: 'mcq', q: '¿Con qué frecuencia hacen la videollamada?', options: ['Todos los domingos', 'Una vez al mes', 'Todos los días'], answer: 0 },
    { type: 'mcq', q: '¿De qué hablan durante la llamada?', options: ['De política', 'De la familia y la semana', 'De dinero'], answer: 1 },
    { type: 'short', q: '¿Dónde vive la abuela? (una palabra)', accept: ['lejos', 'en otra ciudad'] },
    { type: 'translate', line: 'Para Elena, esta hora es muy especial.', model: 'For Elena, this hour is very special.' }
  ]
},

{
  id: 'mudanza', title: 'La mudanza', level: 2,
  text: 'El mes pasado, Diego y su pareja alquilaron un piso nuevo cerca del centro. Pagaron un buen precio y firmaron el contrato en una semana. Sus amigos los ayudaron a llevar las cajas y los muebles todo el sábado. Por la tarde, pidieron pizza y bailaron con música toda la noche. Diego estaba muy cansado, pero también estaba feliz porque por fin tenían más espacio. Al final del día, todos brindaron por la nueva casa.',
  gloss: [
    { es: 'alquilaron', en: 'they rented' },
    { es: 'firmaron el contrato', en: 'they signed the contract' },
    { es: 'las cajas', en: 'the boxes' },
    { es: 'brindaron', en: 'they toasted' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué alquilaron Diego y su pareja?', options: ['Una casa vieja', 'Un piso nuevo', 'Una oficina'], answer: 1 },
    { type: 'mcq', q: '¿Quién ayudó con la mudanza?', options: ['Sus amigos', 'Sus padres', 'Nadie'], answer: 0 },
    { type: 'short', q: '¿Qué pidieron por la tarde? (una palabra)', accept: ['pizza', 'una pizza'] },
    { type: 'translate', line: 'Al final del día, todos brindaron por la nueva casa.', model: 'At the end of the day, everyone toasted to the new house.' }
  ]
},

{
  id: 'primer-trabajo', title: 'Mi primer trabajo', level: 2,
  text: 'Cuando tenía dieciocho años, conseguí mi primer trabajo en un restaurante pequeño. Trabajaba los fines de semana y ganaba poco dinero, pero aprendía mucho. El dueño era muy paciente y me enseñaba todos los días. Al principio, tenía miedo de cometer errores, pero poco a poco gané confianza. Un día, serví una mesa muy grande yo solo y todo salió perfecto. Ese trabajo me enseñó el valor del esfuerzo y todavía recuerdo esa época con cariño.',
  gloss: [
    { es: 'el dueño', en: 'the owner' },
    { es: 'poco a poco', en: 'little by little' },
    { es: 'la confianza', en: 'confidence' },
    { es: 'el esfuerzo', en: 'effort' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde trabajaba el narrador?', options: ['En una tienda', 'En un restaurante', 'En una oficina'], answer: 1 },
    { type: 'mcq', q: '¿Cómo era el dueño?', options: ['Muy paciente', 'Muy estricto', 'Muy antipático'], answer: 0 },
    { type: 'short', q: '¿Qué sirvió el narrador un día? (una palabra)', accept: ['una mesa', 'mesa'] },
    { type: 'translate', line: 'Ese trabajo me enseñó el valor del esfuerzo y todavía recuerdo esa época con cariño.', model: 'That job taught me the value of effort, and I still remember that time fondly.' }
  ]
},

{
  id: 'compra-para-regalo', title: 'Un regalo por su cumpleaños', level: 2,
  text: 'Fui a la ciudad por la mañana para comprar un regalo para mi mejor amiga. Caminé por muchas tiendas durante dos horas buscando algo perfecto. Al final, compré un libro por su precio y por su tema, porque a ella le encanta la historia. Pagué por el regalo y guardé el recibo con cuidado. Salí de la tienda contenta y caminé para la estación de tren. Para mí, elegir un buen regalo siempre es un placer.',
  gloss: [
    { es: 'el recibo', en: 'the receipt' },
    { es: 'con cuidado', en: 'carefully' },
    { es: 'un placer', en: 'a pleasure' },
    { es: 'buscando algo perfecto', en: 'looking for something perfect' }
  ],
  questions: [
    { type: 'mcq', q: '¿Para quién es el regalo?', options: ['Para su madre', 'Para su mejor amiga', 'Para su jefe'], answer: 1 },
    { type: 'mcq', q: '¿Qué compró al final?', options: ['Un libro', 'Un vestido', 'Un teléfono'], answer: 0 },
    { type: 'short', q: '¿Qué guardó con cuidado? (una palabra)', accept: ['el recibo', 'recibo'] },
    { type: 'translate', line: 'Para mí, elegir un buen regalo siempre es un placer.', model: 'For me, choosing a good gift is always a pleasure.' }
  ]
},

{
  id: 'mudanza-futuro', title: 'Planes para mudarnos', level: 3,
  text: 'El año que viene, mi pareja y yo nos mudaremos a otra ciudad por su nuevo trabajo. Ya hemos buscado varios pisos por internet y hemos hablado con una agencia inmobiliaria. Necesitaremos vender algunos muebles porque el piso nuevo será más pequeño. Mis padres nos ayudarán con la mudanza y mis amigos organizarán una despedida antes de irnos. Sé que será un cambio grande, pero también será una aventura nueva. Estoy segura de que nos adaptaremos rápido a la nueva vida.',
  gloss: [
    { es: 'la agencia inmobiliaria', en: 'the real estate agency' },
    { es: 'la despedida', en: 'the farewell party' },
    { es: 'adaptarse', en: 'to adapt' },
    { es: 'una aventura', en: 'an adventure' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué se mudan?', options: ['Por el trabajo de la pareja', 'Por la familia', 'Por el clima'], answer: 0 },
    { type: 'mcq', q: '¿Qué han hecho ya?', options: ['Buscado pisos y hablado con una agencia', 'Vendido su casa', 'Comprado muebles nuevos'], answer: 0 },
    { type: 'short', q: '¿Quién organizará una despedida? (una palabra)', accept: ['los amigos', 'amigos', 'sus amigos'] },
    { type: 'translate', line: 'Sé que será un cambio grande, pero también será una aventura nueva.', model: 'I know it will be a big change, but it will also be a new adventure.' }
  ]
},

{
  id: 'nueva-dieta', title: 'Un cambio de hábitos', level: 3,
  text: 'Últimamente, María ha decidido cuidar más su salud. Ya ha empezado a comer mejor y ha dejado el azúcar por completo. A partir de mañana, hará ejercicio tres veces por semana y dormirá ocho horas cada noche. También beberá más agua y menos café. Su médica dice que, si sigue así, se sentirá mucho más fuerte en pocos meses. María está muy motivada porque sabe que estos pequeños cambios traerán grandes resultados.',
  gloss: [
    { es: 'últimamente', en: 'lately' },
    { es: 'por completo', en: 'completely' },
    { es: 'a partir de mañana', en: 'starting tomorrow' },
    { es: 'los resultados', en: 'the results' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué ha dejado María?', options: ['El café', 'El azúcar', 'El ejercicio'], answer: 1 },
    { type: 'mcq', q: '¿Cuántas veces por semana hará ejercicio?', options: ['Una vez', 'Tres veces', 'Todos los días'], answer: 1 },
    { type: 'short', q: '¿Cuántas horas dormirá cada noche? (una palabra o número)', accept: ['ocho', '8', 'ocho horas'] },
    { type: 'translate', line: 'María está muy motivada porque sabe que estos pequeños cambios traerán grandes resultados.', model: 'María is very motivated because she knows these small changes will bring great results.' }
  ]
},

{
  id: 'ascenso-trabajo', title: 'Un posible ascenso', level: 3,
  text: 'Mi jefa me ha dicho que podría tener un ascenso en los próximos meses. Si tomo el puesto nuevo, tendré más responsabilidad y ganaré un sueldo mejor. También viajaría más por trabajo, algo que me gustaría mucho. Ya he hablado con mi familia y ellos me han apoyado totalmente. Todavía no he decidido nada, pero creo que diré que sí. Sería un paso importante en mi carrera.',
  gloss: [
    { es: 'el ascenso', en: 'the promotion' },
    { es: 'el puesto', en: 'the position' },
    { es: 'la responsabilidad', en: 'responsibility' },
    { es: 'un paso importante', en: 'an important step' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le ofrece la jefa?', options: ['Un ascenso', 'Vacaciones', 'Un contrato nuevo'], answer: 0 },
    { type: 'mcq', q: '¿Con quién ha hablado ya?', options: ['Con su familia', 'Con sus amigos', 'Con nadie'], answer: 0 },
    { type: 'short', q: '¿Qué ganaría con el ascenso? (una palabra)', accept: ['más', 'un sueldo mejor', 'dinero'] },
    { type: 'translate', line: 'Todavía no he decidido nada, pero creo que diré que sí.', model: "I haven't decided anything yet, but I think I will say yes." }
  ]
},

{
  id: 'reciclaje-barrio', title: 'Un proyecto de reciclaje', level: 3,
  text: 'El próximo mes, los vecinos de mi barrio empezarán un proyecto de reciclaje. Ya hemos hablado con el ayuntamiento y hemos recibido permiso para poner contenedores nuevos. Cada familia reciclará papel, vidrio y plástico por separado. Los niños ayudarán a explicar el proyecto a los vecinos mayores. Creemos que, con nuestro esfuerzo, reduciremos mucho la basura del barrio. Será un cambio pequeño, pero muy importante para el medio ambiente.',
  gloss: [
    { es: 'el ayuntamiento', en: 'city hall' },
    { es: 'los contenedores', en: 'the containers' },
    { es: 'por separado', en: 'separately' },
    { es: 'la basura', en: 'the trash' }
  ],
  questions: [
    { type: 'mcq', q: '¿Con quién han hablado los vecinos?', options: ['Con el ayuntamiento', 'Con la policía', 'Con el gobierno central'], answer: 0 },
    { type: 'mcq', q: '¿Qué reciclará cada familia?', options: ['Papel, vidrio y plástico', 'Solo papel', 'Ropa vieja'], answer: 0 },
    { type: 'short', q: '¿Quiénes ayudarán a explicar el proyecto? (una palabra)', accept: ['los niños', 'niños'] },
    { type: 'translate', line: 'Será un cambio pequeño, pero muy importante para el medio ambiente.', model: 'It will be a small change, but a very important one for the environment.' }
  ]
},

{
  id: 'consejo-medico', title: 'El consejo del médico', level: 4,
  text: "El médico le recomienda a Jorge que duerma más y que reduzca el estrés del trabajo. Le dice: 'Camine treinta minutos cada día y beba más agua.' También quiere que Jorge deje de trabajar los fines de semana. Jorge duda que pueda cambiar tan rápido, porque antes del diagnóstico, nunca había ido al médico. Aun así, promete cambiar poco a poco. Ojalá que estos consejos le ayuden a sentirse mejor pronto.",
  gloss: [
    { es: 'reduzca el estrés', en: 'reduce the stress' },
    { es: 'dudar', en: 'to doubt' },
    { es: 'el diagnóstico', en: 'the diagnosis' },
    { es: 'poco a poco', en: 'little by little' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le recomienda el médico a Jorge?', options: ['Dormir más y reducir el estrés', 'Comer más dulces', 'Trabajar más'], answer: 0 },
    { type: 'mcq', q: '¿Qué duda Jorge?', options: ['Que pueda cambiar tan rápido', 'Que el médico tenga razón', 'Que esté enfermo'], answer: 0 },
    { type: 'short', q: '¿Qué nunca había hecho Jorge antes? (dos palabras)', accept: ['ir al médico', 'al médico'] },
    { type: 'translate', line: 'Ojalá que estos consejos le ayuden a sentirse mejor pronto.', model: 'Hopefully these pieces of advice help him feel better soon.' }
  ]
},

{
  id: 'boda-preparativos', title: 'Los preparativos de la boda', level: 4,
  text: 'Laura y Carlos se casan el próximo mes y todavía quedan muchas cosas por organizar. Laura espera que su hermana elija un buen vestido para la ceremonia. Carlos insiste en que todos lleguen temprano para las fotos. Los padres de Laura ya habían pagado el salón antes de reservar el catering. Ahora, quieren que el fotógrafo diga la hora exacta. Ojalá que no llueva ese día, porque la fiesta será en el jardín. ¡Que todo salga perfecto!',
  gloss: [
    { es: 'la ceremonia', en: 'the ceremony' },
    { es: 'el salón', en: 'the venue' },
    { es: 'el fotógrafo', en: 'the photographer' },
    { es: 'el jardín', en: 'the garden' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué espera Laura?', options: ['Que su hermana elija un buen vestido', 'Que llueva', 'Que Carlos llegue tarde'], answer: 0 },
    { type: 'mcq', q: '¿Qué habían pagado los padres antes?', options: ['El salón', 'El vestido', 'Las flores'], answer: 0 },
    { type: 'short', q: '¿Dónde será la fiesta? (una palabra)', accept: ['en el jardín', 'jardín', 'el jardín'] },
    { type: 'translate', line: 'Ojalá que no llueva ese día, porque la fiesta será en el jardín.', model: "I hope it doesn't rain that day, because the party will be in the garden." }
  ]
},

{
  id: 'nuevo-jefe', title: 'El nuevo jefe', level: 4,
  text: 'Cuando el nuevo jefe llegó, ya habíamos terminado el proyecto más difícil del año. Aun así, quiere que todos lleguemos antes de las nueve y que enviemos un informe cada viernes. Muchos compañeros temen que el jefe cambie las reglas que ya conocíamos. Yo prefiero esperar antes de opinar; espero que sea justo con todos. Si tuviera una queja, hablaría con él directamente. Por ahora, prefiero que tengamos paciencia y que creamos en el proceso.',
  gloss: [
    { es: 'las reglas', en: 'the rules' },
    { es: 'justo', en: 'fair' },
    { es: 'una queja', en: 'a complaint' },
    { es: 'la paciencia', en: 'patience' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué quiere el nuevo jefe?', options: ['Que lleguen antes de las nueve', 'Que trabajen menos', 'Que cambien de oficina'], answer: 0 },
    { type: 'mcq', q: '¿Qué haría el narrador si tuviera una queja?', options: ['Hablaría con el jefe directamente', 'Se callaría', 'Renunciaría'], answer: 0 },
    { type: 'short', q: '¿Qué espera el narrador del jefe? (una palabra)', accept: ['que sea justo', 'justo'] },
    { type: 'translate', line: 'Si tuviera una queja, hablaría con él directamente.', model: 'If I had a complaint, I would talk to him directly.' }
  ]
},

{
  id: 'reunion-antigua-amiga', title: 'Un reencuentro inesperado', level: 4,
  text: 'Ayer me encontré con una amiga que no veía desde hace años. Antes de ese día, yo ya había pensado mucho en ella, pero nunca la había buscado. Ella me contó que había cambiado de ciudad y de trabajo varias veces. Le dije que estaba muy contenta de verla y que esperaba que siguiéramos en contacto. Ella respondió que también quería que quedáramos pronto para tomar un café. Ojalá que esta vez no perdamos el contacto otra vez.',
  gloss: [
    { es: 'desde hace años', en: 'for years' },
    { es: 'quedar (con alguien)', en: 'to meet up' },
    { es: 'el contacto', en: 'contact' },
    { es: 'un reencuentro', en: 'a reunion' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué había hecho la amiga varias veces?', options: ['Cambiar de ciudad y de trabajo', 'Viajar al extranjero', 'Casarse'], answer: 0 },
    { type: 'mcq', q: '¿Qué espera el narrador?', options: ['Que sigan en contacto', 'Que se muden juntas', 'Que no se vean más'], answer: 0 },
    { type: 'short', q: '¿Qué quería hacer la amiga pronto? (dos palabras)', accept: ['tomar un café', 'quedar', 'tomar café'] },
    { type: 'translate', line: 'Ojalá que esta vez no perdamos el contacto otra vez.', model: "I hope this time we don't lose touch again." }
  ]
},

{
  id: 'boda-futuro-perfecto', title: 'Para cuando llegue el verano', level: 5,
  text: 'Para cuando llegue el verano, ya habré terminado mis estudios y habré empezado a buscar trabajo. Mis padres esperan que para entonces yo también haya ahorrado algo de dinero. Si hubiera empezado antes, habría encontrado un trabajo mejor, pero no me arrepiento del camino que elegí. Para el próximo año, habremos organizado la boda de mi hermana y yo habré terminado de pagar mi coche. Ojalá que para esa fecha todos hayamos logrado nuestras metas.',
  gloss: [
    { es: 'para entonces', en: 'by then' },
    { es: 'el camino', en: 'the path' },
    { es: 'lograr metas', en: 'to reach goals' },
    { es: 'ahorrado', en: 'saved (money)' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué habrá terminado el narrador para el verano?', options: ['Sus estudios', 'Su casa', 'Su coche'], answer: 0 },
    { type: 'mcq', q: '¿Qué esperan los padres?', options: ['Que haya ahorrado dinero', 'Que se case', 'Que viaje'], answer: 0 },
    { type: 'short', q: '¿Qué habrán organizado para el próximo año? (dos palabras)', accept: ['la boda', 'una boda', 'boda de su hermana'] },
    { type: 'translate', line: 'Ojalá que para esa fecha todos hayamos logrado nuestras metas.', model: 'I hope that by that date we will all have achieved our goals.' }
  ]
},

{
  id: 'reforma-casa-l5', title: 'Cuando terminen la reforma', level: 5,
  text: 'Cuando los obreros terminen la reforma, mis padres ya habrán vivido seis meses en un piso alquilado. Habrían preferido quedarse en su casa durante las obras, pero era imposible por el ruido. Espero que para entonces hayan elegido bien los muebles nuevos, porque gastaron mucho dinero en el proyecto. Si hubiéramos planeado mejor el presupuesto, no habríamos tenido tantos problemas con los pagos. Aun así, estoy segura de que, cuando todo termine, habrán logrado la casa de sus sueños.',
  gloss: [
    { es: 'los obreros', en: 'the workers' },
    { es: 'las obras', en: 'the construction work' },
    { es: 'el presupuesto', en: 'the budget' },
    { es: 'los pagos', en: 'the payments' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde han vivido los padres durante la reforma?', options: ['En un piso alquilado', 'En un hotel', 'Con la abuela'], answer: 0 },
    { type: 'mcq', q: '¿Qué esperaba la narradora que hubieran hecho bien?', options: ['Elegir los muebles', 'Elegir la casa', 'Elegir el color'], answer: 0 },
    { type: 'short', q: '¿Qué habrían tenido si no hubieran planeado bien? (una palabra)', accept: ['problemas', 'muchos problemas'] },
    { type: 'translate', line: 'Aun así, estoy segura de que, cuando todo termine, habrán logrado la casa de sus sueños.', model: 'Even so, I am sure that, when everything is finished, they will have achieved the house of their dreams.' }
  ]
},

{
  id: 'carrera-deportiva-l5', title: 'La carrera que casi ganó', level: 5,
  text: 'Cuando sonó el disparo de salida, Marta ya se había preparado durante meses para esa carrera. A mitad de camino, pensó que habría llegado primera si no se hubiera caído cerca del río. Sus entrenadores esperaban que, para el final de la temporada, ella hubiera ganado esa carrera, y casi lo consiguió. Si hubiera descansado un poco menos, probablemente no habría logrado clasificarse. Al terminar, sus amigos le dijeron que siempre habrá otra oportunidad.',
  gloss: [
    { es: 'el disparo de salida', en: 'the starting gun' },
    { es: 'a mitad de camino', en: 'halfway through' },
    { es: 'clasificarse', en: 'to qualify' },
    { es: 'la temporada', en: 'the season' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le pasó a Marta cerca del río?', options: ['Se cayó', 'Se perdió', 'Se cansó'], answer: 0 },
    { type: 'mcq', q: '¿Qué esperaban los entrenadores?', options: ['Que ganara la carrera', 'Que abandonara', 'Que llegara última'], answer: 0 },
    { type: 'short', q: '¿Qué no habría logrado si hubiera descansado menos? (una palabra)', accept: ['clasificarse', 'clasificar'] },
    { type: 'translate', line: 'Al terminar, sus amigos le dijeron que siempre habrá otra oportunidad.', model: 'When it was over, her friends told her there will always be another chance.' }
  ]
},

{
  id: 'jubilacion-planes-l5', title: 'Cuando llegue la jubilación', level: 5,
  text: 'Cuando mi abuelo deje de trabajar el próximo año, habrá trabajado más de cuarenta años en la misma empresa. Él dice que, si hubiera empezado su propio negocio, quizás habría ganado más dinero, pero también habría tenido mucho más estrés. Sus compañeros esperan que, para su fiesta de despedida, todos hayan preparado algo especial. Mi abuela cree que, para entonces, ya habrán terminado de pagar la casa y podrán viajar juntos por fin. Ojalá que esta nueva etapa les traiga mucha felicidad.',
  gloss: [
    { es: 'la empresa', en: 'the company' },
    { es: 'el negocio', en: 'the business' },
    { es: 'la fiesta de despedida', en: 'the farewell party' },
    { es: 'la etapa', en: 'the stage / phase' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuántos años habrá trabajado el abuelo en la misma empresa?', options: ['Veinte', 'Más de cuarenta', 'Diez'], answer: 1 },
    { type: 'mcq', q: '¿Qué esperan sus compañeros?', options: ['Que hayan preparado algo especial', 'Que llore', 'Que no vaya a la fiesta'], answer: 0 },
    { type: 'short', q: '¿Qué podrán hacer los abuelos cuando terminen de pagar la casa? (una palabra)', accept: ['viajar', 'viajar juntos'] },
    { type: 'translate', line: 'Ojalá que esta nueva etapa les traiga mucha felicidad.', model: 'I hope this new stage brings them much happiness.' }
  ]
}

];
