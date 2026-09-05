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
  id: 'rutina', title: 'La rutina de Marta', level: 1, theme: 'trabajo',
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
  id: 'viaje', title: 'Un viaje a la montaña', level: 2, theme: 'viajes',
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
  id: 'mercado', title: 'En el mercado', level: 1, theme: 'compras',
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
  id: 'oficina', title: 'Un día en la oficina', level: 1, theme: 'trabajo',
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
  id: 'parque', title: 'Un sábado en el parque', level: 1, theme: 'ocio',
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
  id: 'estudiante', title: 'La vida de un estudiante', level: 1, theme: 'educacion',
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
  id: 'cocina', title: 'La cena de esta noche', level: 1, theme: 'alimentacion',
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
  id: 'cumpleanos', title: 'El cumpleaños de mi abuela', level: 2, theme: 'relaciones',
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
  id: 'ninez', title: 'Mi niñez en el pueblo', level: 2, theme: 'identidad',
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
  id: 'lunes-dificil', title: 'Un lunes difícil', level: 2, theme: 'trabajo',
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
  id: 'regalo-hermana', title: 'Un regalo para mi hermana', level: 2, theme: 'compras',
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
  id: 'planes-verano', title: 'Planes para el verano', level: 3, theme: 'viajes',
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
  id: 'entrevista', title: 'La entrevista de trabajo', level: 3, theme: 'trabajo',
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
  id: 'reunion-familiar', title: 'La reunión familiar que casi no fue', level: 4, theme: 'relaciones',
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
  id: 'un-dia-normal-verbos1', title: 'Un día normal', level: 1, theme: 'trabajo',
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
  id: 'clase-espanol-verbos2', title: 'Mi clase de español', level: 1, theme: 'educacion',
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
  id: 'excursion-montana-verbos3', title: 'Una excursión a la montaña', level: 2, theme: 'naturaleza',
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
  id: 'conversacion-amigas-verbos4', title: 'Una conversación entre amigas', level: 1, theme: 'relaciones',
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
  id: 'fiesta-sorpresa-verbos5', title: 'Una fiesta sorpresa', level: 2, theme: 'relaciones',
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
  id: 'noche-restaurante-verbos6', title: 'Una noche en el restaurante', level: 1, theme: 'alimentacion',
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
  id: 'meta-personal-verbos7', title: 'Una meta personal', level: 1, theme: 'ocio',
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
  id: 'nuevo-vecino-verbos8', title: 'El nuevo vecino', level: 1, theme: 'relaciones',
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
  id: 'trabajo-traductora-verbos9', title: 'El trabajo de una traductora', level: 1, theme: 'trabajo',
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
  id: 'primer-dia-oficina-verbos10', title: 'El primer día en la oficina', level: 1, theme: 'trabajo',
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
  id: 'fotos-antiguas-verbos11', title: 'Fotos antiguas', level: 1, theme: 'relaciones',
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
  id: 'partido-domingo-verbos12', title: 'El partido del domingo', level: 1, theme: 'ocio',
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
  id: 'reparacion-coche-verbos13', title: 'La reparación del coche', level: 1, theme: 'servicios',
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
  id: 'noticia-cientifica-verbos14', title: 'Una noticia científica', level: 1, theme: 'ciencia',
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
  id: 'cita-con-amigas-verbos15', title: 'Una cita con amigas', level: 1, theme: 'relaciones',
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
  id: 'clases-fotografia-verbos16', title: 'Clases de fotografía', level: 1, theme: 'arte',
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
  id: 'tienda-electronica-verbos17', title: 'Una tienda de electrónica', level: 1, theme: 'compras',
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
  id: 'noche-cultural-verbos18', title: 'Una noche cultural', level: 1, theme: 'arte',
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
  id: 'tienda-segunda-mano-verbos19', title: 'Una tienda de segunda mano', level: 4, theme: 'compras',
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
  id: 'mudanza-piso-nuevo-verbos20', title: 'Mudanza a un piso nuevo', level: 1, theme: 'vivienda',
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
  id: 'rutina-familiar-verbos21', title: 'La rutina familiar', level: 1, theme: 'relaciones',
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
  id: 'cena-vecinos-verbos22', title: 'Una cena con los vecinos', level: 1, theme: 'relaciones',
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
  id: 'clases-verano-verbos23', title: 'Clases de verano', level: 1, theme: 'educacion',
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
  id: 'proyecto-comunitario-verbos24', title: 'Un proyecto comunitario', level: 1, theme: 'politica',
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
  id: 'reunion-vecinos-verbos25', title: 'Una reunión de vecinos', level: 1, theme: 'vivienda',
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
  id: 'reto-cocina-verbos26', title: 'Un reto de cocina', level: 1, theme: 'alimentacion',
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
  id: 'terapia-grupo-verbos27', title: 'Una terapia de grupo', level: 1, theme: 'salud',
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
  id: 'boda-presupuesto-verbos28', title: 'El presupuesto de la boda', level: 1, theme: 'relaciones',
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
  id: 'startup-nueva-verbos29', title: 'Una startup nueva', level: 1, theme: 'trabajo',
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
  id: 'nuevo-portatil-verbos30', title: 'Un ordenador portátil nuevo', level: 1, theme: 'ciencia',
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
  id: 'clinica-veterinaria-verbos31', title: 'La clínica veterinaria', level: 1, theme: 'salud',
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
  id: 'equipo-disenio-verbos32', title: 'Un equipo de diseño', level: 1, theme: 'trabajo',
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
  id: 'debate-medioambiente-verbos33', title: 'Un debate sobre el medio ambiente', level: 1, theme: 'naturaleza',
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
  id: 'rutina-manana-verbos34', title: 'La rutina de la mañana', level: 1, theme: 'trabajo',
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
  id: 'reunion-inversores-verbos35', title: 'Una reunión con inversores', level: 1, theme: 'economia',
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
  id: 'directora-orquesta-verbos36', title: 'La directora de orquesta', level: 1, theme: 'arte',
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
  id: 'anillo-familia-verbos37', title: 'Un anillo de familia', level: 1, theme: 'relaciones',
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
  id: 'primer-dia-vecindario-vocab1', title: 'El primer día en el vecindario', level: 1, theme: 'relaciones',
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
  id: 'retrato-familia-vocab2', title: 'Un retrato de familia', level: 1, theme: 'relaciones',
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
  id: 'boda-familiar-vocab3', title: 'Una boda familiar', level: 2, theme: 'relaciones',
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
  id: 'abuelos-nietos-vocab4', title: 'Los abuelos y sus nietos', level: 1, theme: 'relaciones',
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
  id: 'desayuno-saludable-vocab5', title: 'Un desayuno saludable', level: 1, theme: 'alimentacion',
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
  id: 'cena-especial-vocab6', title: 'Una cena especial', level: 2, theme: 'alimentacion',
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
  id: 'numeros-loteria-vocab7', title: 'Los números de la lotería', level: 1, theme: 'ocio',
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
  id: 'carrera-escolar-vocab8', title: 'Una carrera escolar', level: 1, theme: 'educacion',
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
  id: 'planificador-semanal-vocab9', title: 'Mi planificador semanal', level: 2, theme: 'trabajo',
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
  id: 'cuadro-pintor-vocab10', title: 'El cuadro del pintor', level: 1, theme: 'arte',
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
  id: 'un-dia-por-la-ciudad-vocab11', title: 'Un día por la ciudad', level: 1, theme: 'compras',
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
  id: 'paseo-domingo-vocab12', title: 'Un paseo de domingo', level: 1, theme: 'ocio',
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
  id: 'organizando-casa-vocab13', title: 'Organizando la casa', level: 1, theme: 'vivienda',
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
  id: 'reforma-vecindario-vocab14', title: 'La reforma del vecindario', level: 1, theme: 'vivienda',
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
  id: 'clase-yoga-vocab15', title: 'Una clase de yoga', level: 1, theme: 'cuerpo',
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
  id: 'atardecer-playa-vocab16', title: 'Un atardecer en la playa', level: 1, theme: 'naturaleza',
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
  id: 'comprando-piso-vocab17', title: 'Comprando un piso', level: 1, theme: 'vivienda',
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
  id: 'maraton-ciudad-vocab18', title: 'La maratón de la ciudad', level: 1, theme: 'ocio',
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
  id: 'entrevista-trabajo-vocab19', title: 'Una entrevista de trabajo', level: 2, theme: 'trabajo',
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
  id: 'decision-dificil-vocab20', title: 'Una decisión difícil', level: 1, theme: 'trabajo',
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
  id: 'guia-turistica-vocab21', title: 'Una guía turística', level: 1, theme: 'viajes',
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
  id: 'casa-vacia-vocab22', title: 'Una casa vacía', level: 1, theme: 'vivienda',
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
  id: 'primer-dia-escuela-vocab23', title: 'El primer día de escuela', level: 1, theme: 'educacion',
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
  id: 'semana-dificil-salud-vocab24', title: 'Una semana difícil de salud', level: 1, theme: 'salud',
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
  id: 'chequeo-anual-vocab25', title: 'El chequeo anual', level: 1, theme: 'salud',
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
  id: 'rebajas-tienda-vocab26', title: 'Las rebajas de la tienda', level: 1, theme: 'compras',
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
  id: 'deportes-favoritos-vocab27', title: 'Los deportes favoritos', level: 1, theme: 'ocio',
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
  id: 'horario-semanal-vocab-time2', title: 'Mi horario semanal', level: 1, theme: 'trabajo',
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
  id: 'examen-final-vocab-adj3', title: 'El examen final', level: 1, theme: 'educacion',
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
  id: 'viaje-tren-vocab-travel', title: 'Un viaje en tren', level: 1, theme: 'viajes',
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
  id: 'cambio-tiempo-vocab-weather', title: 'Un cambio de tiempo repentino', level: 1, theme: 'naturaleza',
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
  id: 'preparando-maleta-vocab-clothing', title: 'Preparando la maleta', level: 1, theme: 'viajes',
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
  id: 'visita-granja-vocab-animals', title: 'Una visita a la granja', level: 1, theme: 'naturaleza',
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
  id: 'lavando-platos-vocab-kitchen', title: 'Lavando los platos', level: 1, theme: 'vivienda',
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
  id: 'semana-trabajo-vocab-work', title: 'Una semana de trabajo intenso', level: 1, theme: 'trabajo',
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
  id: 'problemas-ordenador-vocab-tech1', title: 'Problemas con el ordenador', level: 1, theme: 'ciencia',
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
  id: 'videollamada-trabajo-vocab-tech2', title: 'Una reunión virtual de trabajo', level: 1, theme: 'trabajo',
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
  id: 'planificacion-financiera-vocab-fin1', title: 'La planificación financiera', level: 1, theme: 'economia',
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
  id: 'declaracion-impuestos-vocab-fin2', title: 'La declaración de impuestos', level: 1, theme: 'economia',
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
  id: 'buscando-empleo-vocab-career1', title: 'Buscando un nuevo empleo', level: 1, theme: 'trabajo',
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
  id: 'formacion-profesional-vocab-career2', title: 'La formación profesional', level: 1, theme: 'educacion',
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
  id: 'dia-profesiones-vocab-professions', title: 'Un día en distintas profesiones', level: 1, theme: 'trabajo',
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
  id: 'etapas-pareja-vocab-relationships', title: 'Las etapas de una pareja', level: 1, theme: 'relaciones',
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
  id: 'noticias-locales-vocab-society', title: 'Las noticias locales', level: 1, theme: 'medios',
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
  id: 'tramites-oficina-vocab-bureaucracy', title: 'Trámites en la oficina', level: 1, theme: 'servicios',
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
  id: 'ser-estar-contraste', title: 'Ser y estar: dos maneras de ser', level: 1, theme: 'caracter',
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
  id: 'por-para-contraste', title: 'Por y para: dos preposiciones, un dolor de cabeza', level: 2, theme: 'educacion',
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
  id: 'preterito-imperfecto-contraste', title: 'Cuando el pasado se encuentra con el pasado', level: 2, theme: 'identidad',
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
  id: 'ropa-invierno', title: 'Ropa para el invierno', level: 1, theme: 'compras',
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
  id: 'dia-medico', title: 'Una visita al médico', level: 1, theme: 'salud',
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
  id: 'oficina-tecnologia', title: 'Un problema con el ordenador', level: 1, theme: 'ciencia',
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
  id: 'videollamada-abuela', title: 'Una videollamada con la abuela', level: 1, theme: 'relaciones',
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
  id: 'mudanza', title: 'La mudanza', level: 2, theme: 'vivienda',
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
  id: 'primer-trabajo', title: 'Mi primer trabajo', level: 2, theme: 'trabajo',
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
  id: 'compra-para-regalo', title: 'Un regalo por su cumpleaños', level: 2, theme: 'compras',
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
  id: 'mudanza-futuro', title: 'Planes para mudarnos', level: 3, theme: 'vivienda',
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
  id: 'nueva-dieta', title: 'Un cambio de hábitos', level: 3, theme: 'salud',
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
  id: 'ascenso-trabajo', title: 'Un posible ascenso', level: 3, theme: 'trabajo',
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
  id: 'reciclaje-barrio', title: 'Un proyecto de reciclaje', level: 3, theme: 'naturaleza',
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
  id: 'boda-preparativos', title: 'Los preparativos de la boda', level: 4, theme: 'relaciones',
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
  id: 'nuevo-jefe', title: 'El nuevo jefe', level: 4, theme: 'trabajo',
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
  id: 'boda-futuro-perfecto', title: 'Para cuando llegue el verano', level: 5, theme: 'relaciones',
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
  id: 'reforma-casa-l5', title: 'Cuando terminen la reforma', level: 5, theme: 'vivienda',
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
  id: 'carrera-deportiva-l5', title: 'La carrera que casi ganó', level: 5, theme: 'ocio',
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
  id: 'jubilacion-planes-l5', title: 'Cuando llegue la jubilación', level: 5, theme: 'trabajo',
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
},

{
  id: 'periodico-digital', title: 'El fin de un periódico centenario', level: 5, theme: 'medios',
  text: 'Ayer se anunció que el periódico más antiguo de la ciudad dejará de publicarse en papel a partir de enero. Para entonces, la empresa ya habrá despedido a la mitad de su plantilla. Muchos lectores lamentan la noticia, aunque reconocen que hace años que preferían leer las noticias en el móvil. Los expertos creen que la empresa habría evitado esta crisis con una mejor estrategia digital. Los periodistas más jóvenes esperan que la marca sobreviva solo en internet, aunque dudan que consiga los mismos ingresos que antes. Ojalá que este cambio no signifique el final de un periodismo local de calidad.',
  gloss: [
    { es: 'plantilla', en: 'staff' },
    { es: 'ingresos', en: 'income, revenue' },
    { es: 'periodismo', en: 'journalism' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pasará con el periódico a partir de enero?', options: ['Dejará de publicarse en papel', 'Subirá el precio', 'Cambiará de nombre'], answer: 0 },
    { type: 'mcq', q: '¿Qué esperan los periodistas más jóvenes?', options: ['Que la marca sobreviva en internet', 'Que el periódico cierre del todo', 'Que vuelva a imprimirse pronto'], answer: 0 },
    { type: 'short', q: '¿Dónde prefieren leer las noticias muchos lectores? (una palabra)', accept: ['móvil', 'el móvil'] },
    { type: 'translate', line: 'Los expertos creen que la empresa habría evitado esta crisis con una mejor estrategia digital.', model: 'Experts believe the company would have avoided this crisis with a better digital strategy.' }
  ]
},

{
  id: 'subida-precios', title: 'La subida de precios en el supermercado', level: 5, theme: 'economia',
  text: 'Este mes, los precios de los alimentos básicos han subido más que en los últimos diez años. Para finales de año, muchas familias ya habrán reducido su gasto en comida considerablemente. Los economistas dudan que esta subida se deba solo a la guerra en otros países; también influyen los costes de producción y transporte. Algunos creen que una mejor planificación habría evitado parte de esta subida. Las asociaciones de consumidores piden que se controlen los precios de los productos esenciales. Muchos ciudadanos habrían preferido pequeñas subidas graduales en vez de este cambio tan repentino.',
  gloss: [
    { es: 'alimentos', en: 'food' },
    { es: 'gasto', en: 'spending' },
    { es: 'subida', en: 'increase, rise' },
    { es: 'repentino', en: 'sudden' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuánto han subido los precios este mes?', options: ['Más que en los últimos diez años', 'Un poco menos que el año pasado', 'No han cambiado'], answer: 0 },
    { type: 'mcq', q: '¿Qué piden las asociaciones de consumidores?', options: ['Que se controlen los precios esenciales', 'Que bajen los impuestos', 'Que cierren los supermercados'], answer: 0 },
    { type: 'short', q: '¿Qué habrían preferido muchos ciudadanos? (dos palabras)', accept: ['subidas graduales', 'pequeñas subidas graduales'] },
    { type: 'translate', line: 'Algunos creen que una mejor planificación habría evitado parte de esta subida.', model: 'Some believe that better planning would have prevented part of this increase.' }
  ]
},

{
  id: 'maraton-lesion', title: 'El maratón que casi no corrió', level: 5, theme: 'ocio',
  text: 'Dos semanas antes del maratón, Sara se lesionó la rodilla entrenando. Para el día de la carrera, ya habrá pasado un mes desde la lesión, así que los médicos le dijeron que corriera con cuidado. Al principio, Sara dudaba que pudiera terminar los cuarenta y dos kilómetros sin parar. Sus amigos esperan que haya recuperado toda su fuerza para entonces. Los médicos creen que un descanso más largo habría acelerado la recuperación. Aun así, ella está decidida a cruzar la meta, aunque tenga que caminar los últimos kilómetros.',
  gloss: [
    { es: 'lesionó', en: 'injured' },
    { es: 'rodilla', en: 'knee' },
    { es: 'meta', en: 'finish line' },
    { es: 'aun así', en: 'even so' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le pasó a Sara dos semanas antes del maratón?', options: ['Se lesionó la rodilla', 'Perdió sus zapatillas', 'Se resfrió'], answer: 0 },
    { type: 'mcq', q: '¿Qué esperan sus amigos?', options: ['Que haya recuperado toda su fuerza', 'Que abandone la carrera', 'Que se lesione de nuevo'], answer: 0 },
    { type: 'short', q: '¿Cuántos kilómetros tiene el maratón? (un número)', accept: ['42', 'cuarenta y dos'] },
    { type: 'translate', line: 'Los médicos creen que un descanso más largo habría acelerado la recuperación.', model: 'The doctors believe that a longer rest would have sped up the recovery.' }
  ]
},

{
  id: 'vuelo-cancelado', title: 'Un vuelo cancelado en el último momento', level: 4, theme: 'viajes',
  text: 'Cuando Elena y su marido llegaron al aeropuerto, ya habían facturado las maletas cuando anunciaron que su vuelo se cancelaba por mal tiempo. La aerolínea les pidió que esperaran en una sala especial mientras buscaban una solución. Elena estaba furiosa porque llevaban meses planeando ese viaje a Portugal. Es normal que la gente se enfade en estas situaciones, dijo el empleado, intentando calmarla. Finalmente, les ofrecieron un vuelo para el día siguiente y una noche gratis en un hotel cercano. Aunque perdieron un día de vacaciones, Elena reconoce que la aerolínea gestionó bien el problema.',
  gloss: [
    { es: 'facturado', en: 'checked in (luggage)' },
    { es: 'aerolínea', en: 'airline' },
    { es: 'gestionó', en: 'handled' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué se canceló el vuelo?', options: ['Por mal tiempo', 'Por un problema técnico', 'Por una huelga'], answer: 0 },
    { type: 'mcq', q: '¿Qué les ofreció la aerolínea?', options: ['Un vuelo al día siguiente y un hotel gratis', 'Un reembolso completo', 'Nada'], answer: 0 },
    { type: 'short', q: '¿Adónde viajaban Elena y su marido? (una palabra)', accept: ['portugal', 'a portugal'] },
    { type: 'translate', line: 'Elena estaba furiosa porque llevaban meses planeando ese viaje a Portugal.', model: 'Elena was furious because they had spent months planning that trip to Portugal.' }
  ]
},

{
  id: 'amistad-reencuentro', title: 'Una amistad de toda la vida', level: 5, theme: 'relaciones',
  text: 'Cuando Rosa y Carmen se reencontraron después de veinte años, ambas habían cambiado mucho. Para entonces, Rosa ya se había casado dos veces y Carmen nunca se había mudado del pueblo donde nacieron. Al principio, dudaban que todavía tuvieran algo en común. Sin embargo, en cuanto empezaron a hablar, se dieron cuenta de que la conexión seguía intacta. Rosa dice que, para el próximo verano, ya habrán organizado un viaje juntas, algo que llevaban años prometiéndose. Espera que esta vez cumplan la promesa de verdad.',
  gloss: [
    { es: 'reencontraron', en: 'met again' },
    { es: 'mudado', en: 'moved (house)' },
    { es: 'prometiéndose', en: 'promising each other' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuánto tiempo pasó antes de que Rosa y Carmen se reencontraran?', options: ['Veinte años', 'Diez años', 'Cinco años'], answer: 0 },
    { type: 'mcq', q: '¿Qué dudaban al principio?', options: ['Que todavía tuvieran algo en común', 'Que se reconocieran', 'Que vivieran cerca'], answer: 0 },
    { type: 'short', q: '¿Qué planean organizar para el próximo verano? (una palabra)', accept: ['viaje', 'un viaje'] },
    { type: 'translate', line: 'Sin embargo, en cuanto empezaron a hablar, se dieron cuenta de que la conexión seguía intacta.', model: 'However, as soon as they started talking, they realized the connection was still intact.' }
  ]
},

{
  id: 'cambio-caracter', title: 'Un cambio de carácter', level: 4, theme: 'caracter',
  text: 'Desde que empezó a hacer yoga, mi hermana ha cambiado mucho de carácter. Antes se enfadaba por cualquier cosa, pero ahora es mucho más tranquila. Sus amigos dudaban que un simple cambio de rutina pudiera transformarla tanto. Ella dice que es importante que la gente encuentre algo que le ayude a calmarse. Mis padres esperan que yo también pruebe el yoga algún día, aunque de momento prefiero correr. Antes de este cambio, mi hermana discutía con todos por pequeñeces. Ahora, incluso en situaciones difíciles, mantiene la calma casi siempre.',
  gloss: [
    { es: 'pequeñeces', en: 'trivial things' },
    { es: 'mantiene la calma', en: 'keeps calm' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué ha cambiado en la hermana?', options: ['Su carácter', 'Su trabajo', 'Su casa'], answer: 0 },
    { type: 'mcq', q: '¿Qué esperan los padres?', options: ['Que el narrador pruebe el yoga', 'Que la hermana deje el yoga', 'Que se muden'], answer: 0 },
    { type: 'short', q: '¿Qué hace la hermana ahora para calmarse? (una palabra)', accept: ['yoga'] },
    { type: 'translate', line: 'Sus amigos dudaban que un simple cambio de rutina pudiera transformarla tanto.', model: 'Her friends doubted that a simple change in routine could transform her so much.' }
  ]
},

{
  id: 'desperdicio-comida', title: 'El desperdicio de comida', level: 5, theme: 'alimentacion',
  text: 'Cada año, las familias españolas tiran a la basura miles de toneladas de comida en buen estado. Para finales de este año, varias ciudades ya habrán aprobado leyes que obligan a los supermercados a donar los alimentos que no venden. Muchos expertos dudan que estas leyes solucionen el problema por completo, pero creen que es un buen primer paso. Si las familias planificaran mejor sus compras semanales, se reduciría bastante el desperdicio. Algunas organizaciones piden que se enseñe en las escuelas a aprovechar mejor los alimentos. Ojalá que estas iniciativas hayan cambiado la situación dentro de unos años.',
  gloss: [
    { es: 'toneladas', en: 'tons' },
    { es: 'donar', en: 'to donate' },
    { es: 'desperdicio', en: 'waste' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué tiran las familias españolas cada año?', options: ['Miles de toneladas de comida', 'Ropa vieja', 'Muebles'], answer: 0 },
    { type: 'mcq', q: '¿Qué piden algunas organizaciones?', options: ['Que se enseñe a aprovechar los alimentos', 'Que se cierren los supermercados', 'Que se prohíba cocinar'], answer: 0 },
    { type: 'short', q: '¿Qué obligan las nuevas leyes a hacer a los supermercados? (una palabra)', accept: ['donar'] },
    { type: 'translate', line: 'Si las familias planificaran mejor sus compras semanales, se reduciría bastante el desperdicio.', model: 'If families planned their weekly shopping better, food waste would be reduced quite a bit.' }
  ]
},

{
  id: 'nuevo-hobby-ceramica', title: 'Un nuevo hobby: la cerámica', level: 4, theme: 'arte',
  text: 'Hace seis meses, Julia empezó a ir a clases de cerámica los sábados por la mañana. Al principio, sus manos no sabían cómo controlar el barro y todo le salía torcido. La profesora le recomendó que practicara en casa con una pequeña rueda que se compró después. Julia nunca había hecho nada parecido antes, pero ahora dice que es la actividad que más disfruta de toda la semana. Sus amigos esperan que algún día venda sus piezas, aunque ella todavía no se atreve. Es probable que el próximo mes empiece un curso más avanzado para mejorar su técnica.',
  gloss: [
    { es: 'el barro', en: 'clay' },
    { es: 'torcido', en: 'crooked' },
    { es: 'no se atreve', en: 'does not dare' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué clases empezó a tomar Julia?', options: ['Cerámica', 'Pintura', 'Cocina'], answer: 0 },
    { type: 'mcq', q: '¿Qué le recomendó la profesora?', options: ['Que practicara en casa', 'Que dejara las clases', 'Que comprara más barro'], answer: 0 },
    { type: 'short', q: '¿Qué esperan sus amigos que haga algún día? (una palabra)', accept: ['vender', 'venda'] },
    { type: 'translate', line: 'Julia nunca había hecho nada parecido antes, pero ahora dice que es la actividad que más disfruta de toda la semana.', model: 'Julia had never done anything like it before, but now she says it is the activity she enjoys most all week.' }
  ]
},

{
  id: 'pedido-perdido', title: 'Un pedido que nunca llegó', level: 4, theme: 'compras',
  text: 'El mes pasado, Diego compró unos auriculares por internet, pero el paquete nunca llegó a su casa. Cuando escribió a la empresa, le pidieron que esperara dos semanas más antes de reclamar el dinero. Diego estaba furioso porque ya había esperado casi un mes sin ninguna explicación clara. Finalmente, un empleado le confirmó que el paquete se había perdido durante el transporte. Es normal que este tipo de errores ocurra alguna vez, le explicaron, pero Diego seguía muy enfadado. Al final, le devolvieron el dinero y le ofrecieron un descuento para la próxima compra.',
  gloss: [
    { es: 'auriculares', en: 'headphones' },
    { es: 'reclamar', en: 'to claim, to demand' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué compró Diego por internet?', options: ['Unos auriculares', 'Un teléfono', 'Un libro'], answer: 0 },
    { type: 'mcq', q: '¿Qué le pidió la empresa al principio?', options: ['Que esperara dos semanas más', 'Que cancelara el pedido', 'Que pagara otra vez'], answer: 0 },
    { type: 'short', q: '¿Qué le pasó al paquete? (dos palabras)', accept: ['se perdió', 'se había perdido'] },
    { type: 'translate', line: 'Diego estaba furioso porque ya había esperado casi un mes sin ninguna explicación clara.', model: 'Diego was furious because he had already waited almost a month with no clear explanation.' }
  ]
},

{
  id: 'telescopio-espacial', title: 'El telescopio que cambió la astronomía', level: 5, theme: 'ciencia',
  text: 'Cuando lanzaron el nuevo telescopio espacial, muchos científicos dudaban que las primeras imágenes fueran tan claras como prometían. Para el final del primer año, el telescopio ya habrá enviado miles de fotografías de galaxias nunca vistas antes. Los astrónomos creen que este descubrimiento habría sido imposible con la tecnología de hace solo diez años. Es fascinante que un instrumento tan pequeño pueda ver tan lejos en el universo. El equipo espera que estas imágenes ayuden a entender mejor cómo se formaron las primeras estrellas. Ojalá que este proyecto haya inspirado a una nueva generación de científicos.',
  gloss: [
    { es: 'lanzaron', en: 'they launched' },
    { es: 'galaxias', en: 'galaxies' },
    { es: 'el universo', en: 'the universe' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué dudaban muchos científicos al principio?', options: ['Que las imágenes fueran tan claras como prometían', 'Que el telescopio funcionara', 'Que costara tanto dinero'], answer: 0 },
    { type: 'mcq', q: '¿Qué espera el equipo?', options: ['Que las imágenes ayuden a entender las primeras estrellas', 'Que el telescopio se rompa', 'Que nadie vea las fotos'], answer: 0 },
    { type: 'short', q: '¿Qué ha fotografiado el telescopio? (una palabra)', accept: ['galaxias'] },
    { type: 'translate', line: 'Los astrónomos creen que este descubrimiento habría sido imposible con la tecnología de hace solo diez años.', model: 'Astronomers believe this discovery would have been impossible with the technology from just ten years ago.' }
  ]
},

{
  id: 'elecciones-renidas', title: 'Las elecciones más reñidas en años', level: 5, theme: 'politica',
  text: 'Las últimas elecciones municipales han sido las más reñidas de los últimos veinte años. Para cuando se cierren todos los colegios electorales, millones de ciudadanos ya habrán votado en todo el país. Los analistas dudan que se sepa el resultado final esa misma noche, debido a lo ajustado de las encuestas. Muchos votantes esperan que el nuevo ayuntamiento resuelva por fin el problema del transporte público. Algunos creen que campañas menos agresivas habrían generado más confianza en la política. Sea cual sea el resultado, está claro que la participación ha aumentado mucho respecto a las elecciones anteriores.',
  gloss: [
    { es: 'reñidas', en: 'closely contested' },
    { es: 'colegios electorales', en: 'polling stations' },
    { es: 'encuestas', en: 'polls' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo han sido las últimas elecciones?', options: ['Las más reñidas en veinte años', 'Muy tranquilas', 'Sin ningún interés'], answer: 0 },
    { type: 'mcq', q: '¿Qué esperan muchos votantes?', options: ['Que se resuelva el problema del transporte', 'Que suban los impuestos', 'Que se cancelen las elecciones'], answer: 0 },
    { type: 'short', q: '¿Qué ha aumentado respecto a elecciones anteriores? (una palabra)', accept: ['participación', 'la participación'] },
    { type: 'translate', line: 'Algunos creen que campañas menos agresivas habrían generado más confianza en la política.', model: 'Some believe that less aggressive campaigns would have generated more trust in politics.' }
  ]
},

{
  id: 'osos-pirineos', title: 'Los osos que vuelven a los Pirineos', level: 5, theme: 'naturaleza',
  text: 'Hace treinta años, casi no quedaban osos pardos en los Pirineos, pero la población ha crecido gracias a varios programas de protección. Para el próximo censo, los expertos ya habrán contado más de setenta ejemplares en la zona. Algunos ganaderos temen que los osos ataquen a sus animales, aunque los estudios muestran que estos casos son raros. Los ecologistas esperan que este éxito anime a proteger otras especies en peligro de extinción. Sin estos programas, los osos probablemente habrían desaparecido de la región para siempre. Ahora, ver un oso en libertad ya no es algo tan extraordinario como antes.',
  gloss: [
    { es: 'osos pardos', en: 'brown bears' },
    { es: 'ganaderos', en: 'livestock farmers' },
    { es: 'en peligro de extinción', en: 'endangered' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué ha pasado con la población de osos en los Pirineos?', options: ['Ha crecido', 'Ha desaparecido', 'No ha cambiado'], answer: 0 },
    { type: 'mcq', q: '¿Qué temen algunos ganaderos?', options: ['Que los osos ataquen a sus animales', 'Que los osos destruyan sus casas', 'Que se vayan a otra región'], answer: 0 },
    { type: 'short', q: '¿Cuántos osos habrán contado los expertos para el próximo censo? (una cifra)', accept: ['más de setenta', 'setenta', '70'] },
    { type: 'translate', line: 'Sin estos programas, los osos probablemente habrían desaparecido de la región para siempre.', model: 'Without these programs, the bears would probably have disappeared from the region forever.' }
  ]
},

{
  id: 'apellido-historia', title: 'Un apellido con historia', level: 5, theme: 'identidad',
  text: 'Cuando Sofía empezó a investigar el origen de su apellido, descubrió que su familia había llegado desde Italia hace más de cien años. Para cuando terminó la investigación, ya habrá encontrado documentos de al menos cinco generaciones distintas. Al principio, dudaba que encontrara información tan antigua, pero un archivo local guardaba registros sorprendentes. Sus abuelos nunca le habían contado estos detalles porque, según ellos, no eran importantes. Ahora Sofía siente que entiende mejor quién es y de dónde viene su familia. Espera que sus hijos también quieran conocer esta historia algún día.',
  gloss: [
    { es: 'apellido', en: 'surname' },
    { es: 'archivo', en: 'archive' },
    { es: 'registros', en: 'records' }
  ],
  questions: [
    { type: 'mcq', q: '¿De dónde había llegado la familia de Sofía?', options: ['Italia', 'Francia', 'Portugal'], answer: 0 },
    { type: 'mcq', q: '¿Qué dudaba Sofía al principio?', options: ['Que encontrara información tan antigua', 'Que su apellido fuera italiano', 'Que sus abuelos supieran algo'], answer: 0 },
    { type: 'short', q: '¿Cuántas generaciones encontró documentadas? (una palabra)', accept: ['cinco'] },
    { type: 'translate', line: 'Sus abuelos nunca le habían contado estos detalles porque, según ellos, no eran importantes.', model: "Her grandparents had never told her these details because, according to them, they weren't important." }
  ]
},

{
  id: 'cuadro-robado', title: 'El cuadro robado', level: 5, theme: 'arte',
  text: 'Hace treinta años, un cuadro famoso desapareció de un museo europeo sin dejar ninguna pista. Para sorpresa de todos, la policía anunció ayer que ya habrá recuperado la obra completa antes del fin de semana. Los investigadores dudaban que el cuadro siguiera en buen estado después de tanto tiempo escondido. Un coleccionista privado lo había comprado sin saber que era robado, según la policía. Los expertos del museo esperan que la restauración no dañe más el cuadro de lo que ya está. Sin este golpe de suerte, la obra probablemente habría permanecido perdida para siempre.',
  gloss: [
    { es: 'pista', en: 'clue, lead' },
    { es: 'coleccionista', en: 'collector' },
    { es: 'golpe de suerte', en: 'stroke of luck' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pasó con el cuadro hace treinta años?', options: ['Desapareció de un museo', 'Se quemó', 'Se vendió'], answer: 0 },
    { type: 'mcq', q: '¿Quién había comprado el cuadro sin saberlo?', options: ['Un coleccionista privado', 'Otro museo', 'El propio ladrón'], answer: 0 },
    { type: 'short', q: '¿Qué esperan los expertos del museo? (dos palabras)', accept: ['que no dañe', 'no dañar el cuadro'] },
    { type: 'translate', line: 'Sin este golpe de suerte, la obra probablemente habría permanecido perdida para siempre.', model: 'Without this stroke of luck, the work would probably have remained lost forever.' }
  ]
},

{
  id: 'banco-cerrado', title: 'El banco que cerró sin avisar', level: 5, theme: 'servicios',
  text: 'La semana pasada, la única sucursal bancaria del pueblo cerró sus puertas sin ningún aviso previo. Para cuando los vecinos protestaron frente al edificio, el banco ya habrá trasladado todo el personal a la ciudad más cercana. Muchos ancianos del pueblo dudan que puedan hacer sus gestiones fácilmente por internet, ya que casi nadie les enseñó a usarlo. El alcalde pidió que el banco cambiara la decisión, pero de momento no ha recibido respuesta. Es lamentable que las zonas rurales pierdan cada vez más servicios básicos como este. Sin una solución rápida, muchos vecinos habrían tenido que viajar una hora para hacer cualquier trámite.',
  gloss: [
    { es: 'sucursal', en: 'branch (of a bank)' },
    { es: 'gestiones', en: 'errands, paperwork' },
    { es: 'trámite', en: 'procedure' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué hizo la sucursal bancaria?', options: ['Cerró sin aviso previo', 'Cambió de horario', 'Contrató más personal'], answer: 0 },
    { type: 'mcq', q: '¿Qué pidió el alcalde?', options: ['Que el banco cambiara la decisión', 'Que subieran los impuestos', 'Que abrieran otra sucursal'], answer: 0 },
    { type: 'short', q: '¿Qué dudan muchos ancianos que puedan hacer? (dos palabras)', accept: ['gestiones por internet', 'hacer gestiones por internet'] },
    { type: 'translate', line: 'Sin una solución rápida, muchos vecinos habrían tenido que viajar una hora para hacer cualquier trámite.', model: 'Without a quick solution, many residents would have had to travel an hour to do any paperwork.' }
  ]
},

{
  id: 'debate-electoral', title: 'El debate que nadie vio venir', level: 5, theme: 'politica',
  text: 'Durante el debate electoral de anoche, dos candidatos que normalmente evitan discutir se enfrentaron directamente por primera vez. Los espectadores no esperaban que el debate se pusiera tan tenso desde el principio. Para cuando terminó, millones de personas ya habrán visto el debate en directo o en redes sociales. Los analistas dudan que este momento cambie mucho el resultado final de las elecciones. Algunos periodistas creen que un debate más largo habría permitido hablar más de las propuestas. Es evidente que este tipo de enfrentamientos generan mucho más interés que los discursos tradicionales.',
  gloss: [
    { es: 'se enfrentaron', en: 'confronted each other' },
    { es: 'tenso', en: 'tense' },
    { es: 'discursos', en: 'speeches' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pasó en el debate de anoche?', options: ['Dos candidatos se enfrentaron directamente', 'Un candidato no se presentó', 'Se canceló el debate'], answer: 0 },
    { type: 'mcq', q: '¿Qué dudan los analistas?', options: ['Que el debate cambie mucho el resultado', 'Que la gente lo haya visto', 'Que haya otro debate'], answer: 0 },
    { type: 'short', q: '¿Qué generan estos enfrentamientos según el texto? (una palabra)', accept: ['interés', 'mucho interés'] },
    { type: 'translate', line: 'Algunos periodistas creen que un debate más largo habría permitido hablar más de las propuestas.', model: 'Some journalists believe a longer debate would have allowed more discussion of the proposals.' }
  ]
},

{
  id: 'compra-falsa-internet', title: 'Una compra que no era lo que parecía', level: 5, theme: 'compras',
  text: 'El mes pasado, Iván compró unas zapatillas deportivas muy baratas en una página web desconocida. Cuando llegó el paquete, descubrió que las zapatillas eran falsas y de muy mala calidad. Para cuando intentó reclamar, la página web ya habrá desaparecido de internet sin dejar rastro. Iván dudaba que pudiera recuperar su dinero, pero decidió denunciarlo de todas formas. Los expertos en seguridad recomiendan que la gente compre solo en páginas web conocidas y de confianza. Una tienda oficial le habría costado más, pero le habría ahorrado todos estos problemas.',
  gloss: [
    { es: 'rastro', en: 'trace' },
    { es: 'denunciarlo', en: 'to report it' },
    { es: 'de confianza', en: 'trustworthy' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué descubrió Iván cuando llegó el paquete?', options: ['Que las zapatillas eran falsas', 'Que el paquete estaba vacío', 'Que había pagado dos veces'], answer: 0 },
    { type: 'mcq', q: '¿Qué recomiendan los expertos en seguridad?', options: ['Comprar solo en páginas web conocidas', 'No comprar nunca por internet', 'Pagar siempre en efectivo'], answer: 0 },
    { type: 'short', q: '¿Qué decidió hacer Iván de todas formas? (una palabra)', accept: ['denunciarlo', 'denunciar'] },
    { type: 'translate', line: 'Una tienda oficial le habría costado más, pero le habría ahorrado todos estos problemas.', model: 'An official shop would have cost him more, but it would have saved him all these problems.' }
  ]
},

{
  id: 'vacuna-a-tiempo', title: 'La vacuna que llegó a tiempo', level: 5, theme: 'salud',
  text: 'Cuando empezó la epidemia, los científicos dudaban que pudieran desarrollar una vacuna eficaz en menos de un año. Sin embargo, para sorpresa de todos, los laboratorios ya habrán completado las pruebas necesarias antes de lo esperado. Muchos gobiernos habían invertido grandes cantidades de dinero en la investigación desde el principio. Los expertos creen que sin esa inversión temprana, el proceso habría tardado mucho más tiempo. Ahora esperan que esta experiencia sirva para prepararse mejor ante futuras epidemias. Es admirable que la ciencia haya logrado algo así en tan poco tiempo.',
  gloss: [
    { es: 'epidemia', en: 'epidemic' },
    { es: 'eficaz', en: 'effective' },
    { es: 'inversión', en: 'investment' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué dudaban los científicos al principio?', options: ['Que pudieran desarrollar la vacuna en menos de un año', 'Que la epidemia fuera grave', 'Que la gente se vacunara'], answer: 0 },
    { type: 'mcq', q: '¿Qué habían hecho muchos gobiernos desde el principio?', options: ['Invertir grandes cantidades de dinero', 'Cerrar las fronteras', 'Ignorar la epidemia'], answer: 0 },
    { type: 'short', q: '¿Para qué esperan que sirva esta experiencia? (dos palabras)', accept: ['prepararse mejor', 'para prepararse mejor'] },
    { type: 'translate', line: 'Los expertos creen que sin esa inversión temprana, el proceso habría tardado mucho más tiempo.', model: 'Experts believe that without that early investment, the process would have taken much longer.' }
  ]
},

{
  id: 'mural-barrio', title: 'Un mural en el barrio', level: 4, theme: 'arte',
  text: 'El ayuntamiento pidió a varios artistas locales que pintaran un mural en la fachada de un edificio abandonado. Antes de este proyecto, esa pared llevaba años cubierta de pintadas sin ningún sentido artístico. Algunos vecinos dudaban que un mural pudiera cambiar realmente el aspecto del barrio. Sin embargo, después de dos semanas de trabajo, el resultado sorprendió a todos por su belleza y color. Es maravilloso que el arte pueda transformar así un espacio olvidado, comentó una vecina emocionada. Ahora el mural se ha convertido en un lugar popular para hacerse fotos.',
  gloss: [
    { es: 'fachada', en: 'facade' },
    { es: 'pintadas', en: 'graffiti' },
    { es: 'olvidado', en: 'forgotten' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pidió el ayuntamiento a los artistas locales?', options: ['Que pintaran un mural', 'Que limpiaran el edificio', 'Que lo derribaran'], answer: 0 },
    { type: 'mcq', q: '¿Qué dudaban algunos vecinos?', options: ['Que un mural pudiera cambiar el aspecto del barrio', 'Que los artistas terminaran a tiempo', 'Que el ayuntamiento pagara el proyecto'], answer: 0 },
    { type: 'short', q: '¿En qué se ha convertido el mural ahora? (dos palabras)', accept: ['lugar popular', 'un lugar popular'] },
    { type: 'translate', line: 'Sin embargo, después de dos semanas de trabajo, el resultado sorprendió a todos por su belleza y color.', model: 'However, after two weeks of work, the result surprised everyone with its beauty and color.' }
  ]
},

{
  id: 'club-lectura-inesperado', title: 'Un club de lectura inesperado', level: 4, theme: 'ocio',
  text: 'Mi vecino de setenta años, que nunca había leído una novela en su vida, decidió apuntarse a un club de lectura del barrio. Al principio, los demás miembros dudaban que fuera a durar más de una reunión. Antes de este club, mi vecino solo leía el periódico y algún artículo de vez en cuando. Ahora lee un libro entero cada dos semanas y siempre tiene opiniones muy interesantes que compartir. Es bonito que nunca sea demasiado tarde para descubrir una nueva afición, dice siempre con una sonrisa. El grupo espera que él recomiende el próximo libro que van a leer juntos.',
  gloss: [
    { es: 'apuntarse', en: 'to sign up' },
    { es: 'afición', en: 'hobby' },
    { es: 'de vez en cuando', en: 'now and then' }
  ],
  questions: [
    { type: 'mcq', q: '¿A qué decidió apuntarse el vecino de setenta años?', options: ['A un club de lectura del barrio', 'A un gimnasio', 'A clases de baile'], answer: 0 },
    { type: 'mcq', q: '¿Qué dudaban los demás miembros al principio?', options: ['Que fuera a durar más de una reunión', 'Que supiera leer bien', 'Que tuviera tiempo libre'], answer: 0 },
    { type: 'short', q: '¿Cada cuánto lee un libro entero ahora? (dos palabras)', accept: ['dos semanas', 'cada dos semanas'] },
    { type: 'translate', line: 'Es bonito que nunca sea demasiado tarde para descubrir una nueva afición, dice siempre con una sonrisa.', model: 'It is lovely that it is never too late to discover a new hobby, he always says with a smile.' }
  ]
},

{
  id: 'dos-carreras', title: 'Estudiar dos carreras a la vez', level: 5, theme: 'educacion',
  text: 'Cuando Rubén decidió estudiar Medicina y Filosofía al mismo tiempo, muchos amigos dudaban que pudiera con las dos carreras juntas. Para cuando termine ambas, ya habrá pasado casi ocho años estudiando sin apenas descanso. Sus padres nunca habían visto a nadie combinar dos carreras tan diferentes entre sí. Los profesores de filosofía dudan que muchos estudiantes de ciencias aprecien realmente su asignatura. Rubén cree que ambas carreras tienen más relación de la que la gente imagina al principio. Sin su enorme disciplina, probablemente habría abandonado una de las dos hace tiempo.',
  gloss: [
    { es: 'apenas', en: 'hardly, barely' },
    { es: 'aprecien', en: '(that they) appreciate' },
    { es: 'disciplina', en: 'discipline' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué dos carreras estudia Rubén?', options: ['Medicina y Filosofía', 'Derecho y Economía', 'Arte y Biología'], answer: 0 },
    { type: 'mcq', q: '¿Qué dudan los profesores de filosofía?', options: ['Que los estudiantes de ciencias aprecien su asignatura', 'Que Rubén apruebe el curso', 'Que la filosofía sea útil'], answer: 0 },
    { type: 'short', q: '¿Cuántos años le llevará terminar ambas carreras? (una palabra)', accept: ['ocho', 'casi ocho'] },
    { type: 'translate', line: 'Sin su enorme disciplina, probablemente habría abandonado una de las dos hace tiempo.', model: 'Without his enormous discipline, he would probably have given up one of the two a long time ago.' }
  ]
}
,
{
  id: 'tren-nocturno-b1', title: 'El tren nocturno', level: 4, theme: 'viajes',
  text: 'Cuando llegué a la estación, el tren nocturno ya había salido sin mí por segunda vez ese mes. El siguiente no pasaba hasta las seis de la mañana, así que decidí buscar un banco tranquilo para esperar. Una señora mayor, sentada a mi lado, me contó que había perdido el mismo tren tres veces en su vida, siempre por el mismo motivo: se quedaba dormida leyendo. Nos reímos juntos y compartimos un café mientras esperábamos el amanecer. Cuando por fin subí al tren, prometí comprarme un despertador nuevo antes del próximo viaje.',
  gloss: [
    { es: 'la estación', en: 'the station' },
    { es: 'el amanecer', en: 'dawn' },
    { es: 'se quedaba dormida', en: 'she would fall asleep' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué había pasado cuando llegó a la estación?', options: ['El tren ya había salido', 'El tren llegaba tarde', 'La estación estaba cerrada'], answer: 0 },
    { type: 'mcq', q: '¿Por qué perdía el tren la señora mayor?', options: ['Se quedaba dormida leyendo', 'Llegaba siempre tarde', 'No sabía la hora'], answer: 0 },
    { type: 'short', q: '¿A qué hora pasaba el siguiente tren? (dos palabras)', accept: ['las seis', 'seis de la mañana'] },
    { type: 'translate', line: 'Cuando por fin subí al tren, prometí comprarme un despertador nuevo antes del próximo viaje.', model: 'When I finally got on the train, I promised to buy myself a new alarm clock before the next trip.' }
  ]
},

{
  id: 'fabrica-primer-turno-b1', title: 'El primer turno en la fábrica', level: 4, theme: 'trabajo',
  text: 'Cuando entré en la fábrica esa mañana, mis compañeros ya habían encendido las máquinas y organizado las cajas del día. Nadie me explicó nada porque todos daban por hecho que yo conocía el proceso. Pasé la primera hora observando en silencio hasta que un compañero se dio cuenta de mi confusión y me ofreció ayuda. Me enseñó a manejar la cinta y a revisar la calidad de cada pieza, y solo después empaquetarla. Al final del turno, estaba agotado, pero orgulloso de haber aprendido tanto en un solo día. Volví a casa pensando que el segundo día sería más fácil.',
  gloss: [
    { es: 'daban por hecho', en: 'they assumed' },
    { es: 'la cinta', en: 'the conveyor belt' },
    { es: 'empaquetarla', en: 'to package it' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué habían hecho los compañeros antes de que llegara?', options: ['Habían encendido las máquinas', 'Habían limpiado la fábrica', 'Se habían ido a casa'], answer: 0 },
    { type: 'mcq', q: '¿Qué le enseñó el compañero?', options: ['A manejar la cinta y revisar piezas', 'A conducir el camión', 'A hablar con el jefe'], answer: 0 },
    { type: 'short', q: '¿Cómo estaba al final del turno? (una palabra)', accept: ['agotado', 'orgulloso'] },
    { type: 'translate', line: 'Al final del turno, estaba agotado, pero orgulloso de haber aprendido tanto en un solo día.', model: 'At the end of the shift, he was exhausted, but proud to have learned so much in a single day.' }
  ]
},

{
  id: 'incendio-bosque-cercano', title: 'El incendio del bosque cercano', level: 4, theme: 'naturaleza',
  text: 'El bosque cerca de mi pueblo nunca había sufrido un incendio tan grande hasta que llegó el verano pasado. Los bomberos trabajaron tres días sin descanso para apagar las llamas antes de que alcanzaran las primeras casas. Mis vecinos temían que el fuego llegara hasta el pueblo, así que muchos prepararon el coche por si tenían que salir corriendo. Por suerte, el viento cambió de dirección y el incendio se apagó a tiempo. Ahora el ayuntamiento planea plantar árboles nuevos en la zona quemada. Algunos vecinos dudan que el bosque recupere su aspecto original en menos de treinta años.',
  gloss: [
    { es: 'las llamas', en: 'the flames' },
    { es: 'por si', en: 'in case' },
    { es: 'quemada', en: 'burnt' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué nunca había sufrido el bosque antes del verano pasado?', options: ['Un incendio tan grande', 'Una inundación', 'Una sequía'], answer: 0 },
    { type: 'mcq', q: '¿Qué temían los vecinos?', options: ['Que el fuego llegara al pueblo', 'Que lloviera demasiado', 'Que cerraran la carretera'], answer: 0 },
    { type: 'short', q: '¿Qué planea plantar el ayuntamiento? (una palabra)', accept: ['árboles'] },
    { type: 'translate', line: 'Algunos vecinos dudan que el bosque recupere su aspecto original en menos de treinta años.', model: 'Some neighbors doubt that the forest will regain its original appearance in less than thirty years.' }
  ]
},

{
  id: 'dolor-espalda-cronico', title: 'El dolor de espalda que no se iba', level: 4, theme: 'salud',
  text: 'Elena nunca había tenido problemas de espalda hasta que empezó a trabajar desde casa hace dos años. Al principio pensaba que el dolor desaparecería solo, pero cada mes se sentía peor. Su médico le recomendó que cambiara la silla y que hiciera pausas cada hora para levantarse y estirar las piernas. También le sugirió que caminara media hora todos los días, aunque al principio le costaba encontrar el tiempo. Después de tres meses siguiendo esos consejos, Elena nota que el dolor ha bajado bastante. Ahora recomienda a todos sus compañeros que cuiden su postura desde el primer día de trabajo.',
  gloss: [
    { es: 'estirar', en: 'to stretch' },
    { es: 'le costaba', en: 'she found it hard' },
    { es: 'la postura', en: 'posture' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuándo empezaron los problemas de espalda de Elena?', options: ['Al empezar a trabajar desde casa', 'Después de un accidente', 'Cuando empezó a hacer deporte'], answer: 0 },
    { type: 'mcq', q: '¿Qué le recomendó el médico?', options: ['Cambiar la silla y hacer pausas', 'Tomar más medicinas', 'Dejar de trabajar'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo lleva siguiendo los consejos? (dos palabras)', accept: ['tres meses'] },
    { type: 'translate', line: 'Ahora recomienda a todos sus compañeros que cuiden su postura desde el primer día de trabajo.', model: 'Now she recommends that all her colleagues take care of their posture from the first day of work.' }
  ]
},

{
  id: 'tesis-doctoral-tarde', title: 'La tesis que se alargó', level: 4, theme: 'educacion',
  text: 'Marcos empezó su tesis doctoral con la idea de terminarla en tres años, pero las cosas no salieron como esperaba. Para cuando defendió el trabajo ante el tribunal, ya había cambiado de tema dos veces y había perdido casi todo el dinero de la beca. Sus compañeros de laboratorio le decían que era normal que un doctorado se retrasara, aunque a él le costaba creerlo cada vez que veía a otros compañeros graduarse antes. El día de la defensa, sin embargo, todo salió mejor de lo previsto: el tribunal elogió la originalidad de su investigación. Marcos aprendió que la ciencia rara vez sigue el calendario que uno imagina al principio.',
  gloss: [
    { es: 'el tribunal', en: 'the examining panel' },
    { es: 'la beca', en: 'the scholarship' },
    { es: 'elogió', en: 'praised' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué había pasado para cuando defendió la tesis?', options: ['Había cambiado de tema dos veces', 'Había cambiado de universidad', 'Había dejado el doctorado'], answer: 0 },
    { type: 'mcq', q: '¿Qué hizo el tribunal el día de la defensa?', options: ['Elogió la originalidad de su investigación', 'Rechazó la tesis', 'Pidió más tiempo'], answer: 0 },
    { type: 'short', q: '¿En cuántos años pensaba Marcos terminar la tesis? (una palabra)', accept: ['tres'] },
    { type: 'translate', line: 'Marcos aprendió que la ciencia rara vez sigue el calendario que uno imagina al principio.', model: 'Marcos learned that science rarely follows the schedule one imagines at the start.' }
  ]
},

{
  id: 'empresa-familiar-cierre', title: 'La empresa familiar que cerró', level: 4, theme: 'economia',
  text: 'Para cuando la familia Ortiz decidió cerrar la ferretería, el negocio ya había perdido dinero durante cuatro años seguidos. El abuelo la había abierto en 1965 y siempre soñó con que sus nietos la continuaran, pero ninguno quiso dedicarse al comercio. Los precios de los grandes almacenes cercanos habían bajado tanto que ya no podían competir. La familia lamenta la decisión, aunque entiende que no había otra opción razonable. Muchos vecinos del barrio, tristes por la noticia, prometieron comprar allí sus últimas semanas, hasta que bajara definitivamente la persiana. El local, dicen, se convertirá pronto en una cafetería.',
  gloss: [
    { es: 'la ferretería', en: 'the hardware store' },
    { es: 'competir', en: 'to compete' },
    { es: 'la persiana', en: 'the shutter' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué había pasado con el negocio antes de cerrar?', options: ['Había perdido dinero cuatro años seguidos', 'Había cambiado de dueño', 'Se había mudado de barrio'], answer: 0 },
    { type: 'mcq', q: '¿Por qué no podían competir?', options: ['Los grandes almacenes bajaron los precios', 'No tenían suficientes empleados', 'El local era muy pequeño'], answer: 0 },
    { type: 'short', q: '¿En qué año abrió el abuelo la tienda? (una palabra)', accept: ['1965'] },
    { type: 'translate', line: 'El local, dicen, se convertirá pronto en una cafetería.', model: 'The premises, they say, will soon become a café.' }
  ]
},

{
  id: 'confesion-hermano', title: 'Lo que me confesó mi hermano', level: 4, theme: 'relaciones',
  text: 'Mi hermano me llamó anoche y me dijo que había dejado su trabajo hace un mes sin decírselo a nadie de la familia. Me explicó que había estado muy infeliz durante el último año y que había preferido resolverlo solo antes de preocupar a nuestros padres. Le pregunté por qué no había confiado en mí antes, y me respondió que temía que yo tratara de convencerlo de quedarse. Le dije que entendía su decisión, aunque me habría gustado saberlo desde el principio. Ahora está buscando algo que realmente le haga feliz, y toda la familia espera que lo encuentre pronto.',
  gloss: [
    { es: 'preocupar', en: 'to worry (someone)' },
    { es: 'confiado', en: 'trusted' },
    { es: 'convencerlo', en: 'to convince him' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le dijo el hermano que había hecho?', options: ['Había dejado su trabajo', 'Se había mudado', 'Se había casado'], answer: 0 },
    { type: 'mcq', q: '¿Por qué no había confiado en la narradora antes?', options: ['Temía que tratara de convencerlo de quedarse', 'No tenía su número', 'Estaba enfadado con ella'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo hacía que había dejado el trabajo? (dos palabras)', accept: ['un mes'] },
    { type: 'translate', line: 'Le dije que entendía su decisión, aunque me habría gustado saberlo desde el principio.', model: 'I told him I understood his decision, although I would have liked to know from the start.' }
  ]
},

{
  id: 'periodista-fuente-secreta', title: 'La fuente que nadie esperaba', level: 4, theme: 'medios',
  text: 'La periodista publicó el reportaje después de meses de investigación sobre la empresa de transporte municipal. Me contó que había hablado con un exempleado que había guardado documentos internos durante años sin saber muy bien por qué. Ese empleado le dijo que había decidido hablar porque ya no soportaba ver cómo se repetían los mismos errores. El periódico protegió su identidad durante todo el proceso, como exige la ley en estos casos. Tras la publicación, el ayuntamiento anunció que abriría una investigación oficial sobre el asunto. La periodista desea que este caso anime a otras personas a denunciar irregularidades similares.',
  gloss: [
    { es: 'el reportaje', en: 'the (news) report' },
    { es: 'el exempleado', en: 'the former employee' },
    { es: 'anime', en: '(that it) encourages' }
  ],
  questions: [
    { type: 'mcq', q: '¿Con quién había hablado la periodista?', options: ['Con un exempleado', 'Con el alcalde', 'Con otro periodista'], answer: 0 },
    { type: 'mcq', q: '¿Por qué decidió hablar el exempleado?', options: ['Ya no soportaba ver los mismos errores', 'Necesitaba dinero', 'Quería ser famoso'], answer: 0 },
    { type: 'short', q: '¿Qué anunció el ayuntamiento tras la publicación? (tres palabras)', accept: ['una investigación oficial', 'investigación oficial'] },
    { type: 'translate', line: 'El periódico protegió su identidad durante todo el proceso, como exige la ley en estos casos.', model: 'The newspaper protected his identity throughout the process, as the law requires in these cases.' }
  ]
},

{
  id: 'primera-exposicion-pintora', title: 'Su primera exposición', level: 4, theme: 'arte',
  text: 'Era la primera vez que Nuria exponía sus cuadros fuera de la escuela de arte donde había estudiado. Durante semanas había pintado sin descanso, buscando el estilo que mejor la representara. La noche de la inauguración llegaron más de cien personas, muchas más de las que ella había imaginado. Un crítico local se acercó y le preguntó de dónde había sacado la inspiración para la serie sobre el puerto de su ciudad. Nuria respondió que llevaba toda la vida mirando ese puerto desde la ventana de su casa. Al final de la noche, había vendido tres cuadros, algo que jamás había esperado.',
  gloss: [
    { es: 'la inauguración', en: 'the opening (of an exhibition)' },
    { es: 'el crítico', en: 'the critic' },
    { es: 'el puerto', en: 'the harbor' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué era la primera vez que hacía Nuria?', options: ['Exponer fuera de la escuela de arte', 'Vender un cuadro', 'Pintar el puerto'], answer: 0 },
    { type: 'mcq', q: '¿De dónde sacó la inspiración para la serie?', options: ['Del puerto de su ciudad', 'De un viaje al extranjero', 'De un libro'], answer: 0 },
    { type: 'short', q: '¿Cuántos cuadros vendió al final de la noche? (una palabra)', accept: ['tres'] },
    { type: 'translate', line: 'Al final de la noche, había vendido tres cuadros, algo que jamás había esperado.', model: 'By the end of the night, she had sold three paintings, something she had never expected.' }
  ]
},

{
  id: 'concierto-al-aire-libre', title: 'El concierto que casi se cancela', level: 4, theme: 'ocio',
  text: 'Era la primera vez que el grupo tocaba en un concierto al aire libre para tanta gente. Dos horas antes, había empezado a llover y los organizadores temían que tuvieran que cancelarlo todo. El cantante propuso esperar un poco más y tomar la decisión final después, y por suerte la lluvia paró justo a tiempo. El público, que ya había esperado bajo unos paraguas durante casi una hora, recibió a la banda con un aplauso enorme. Tocaron durante dos horas seguidas sin descanso, como si quisieran recuperar el tiempo perdido. Al terminar, todos coincidían en que había sido la mejor noche del verano.',
  gloss: [
    { es: 'al aire libre', en: 'outdoors' },
    { es: 'los paraguas', en: 'umbrellas' },
    { es: 'el aplauso', en: 'the applause' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pasó dos horas antes del concierto?', options: ['Empezó a llover', 'Se fue la luz', 'Llegó poca gente'], answer: 0 },
    { type: 'mcq', q: '¿Cómo recibió el público a la banda?', options: ['Con un aplauso enorme', 'En silencio', 'Con abucheos'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo tocó la banda? (dos palabras)', accept: ['dos horas'] },
    { type: 'translate', line: 'Tocaron durante dos horas seguidas sin descanso, como si quisieran recuperar el tiempo perdido.', model: 'They played for two hours straight without a break, as if they wanted to make up for lost time.' }
  ]
},

{
  id: 'coche-segunda-mano-averiado', title: 'El coche que no era una ganga', level: 4, theme: 'compras',
  text: 'Si Diego hubiera sabido lo que le esperaba, nunca habría comprado ese coche de segunda mano por internet. El vendedor le aseguró que el motor estaba en perfecto estado, pero a la semana empezó a hacer un ruido extraño cada vez que arrancaba. El mecánico le explicó que arreglarlo costaría casi la mitad de lo que había pagado por el coche. Diego intentó contactar con el vendedor, pero el número de teléfono ya no funcionaba. Ahora aconseja a todo el mundo que revise cualquier coche con un mecánico de confianza y no pague nada hasta estar seguro. Al menos, dice riendo, aprendió la lección más cara de su vida.',
  gloss: [
    { es: 'una ganga', en: 'a bargain' },
    { es: 'arrancaba', en: 'it started (engine)' },
    { es: 'la mitad', en: 'half' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué habría hecho Diego si hubiera sabido lo que le esperaba?', options: ['Nunca habría comprado el coche', 'Habría comprado otro modelo', 'Habría pedido un descuento'], answer: 0 },
    { type: 'mcq', q: '¿Qué le pasaba al motor?', options: ['Hacía un ruido extraño al arrancar', 'No arrancaba nunca', 'Perdía aceite'], answer: 0 },
    { type: 'short', q: '¿Qué aconseja Diego ahora a todo el mundo? (tres palabras)', accept: ['revisar con un mecánico', 'revise con mecánico'] },
    { type: 'translate', line: 'Ahora aconseja a todo el mundo que revise cualquier coche con un mecánico de confianza y no pague nada hasta estar seguro.', model: 'Now he advises everyone to have any car checked by a trusted mechanic and not pay anything until they are sure.' }
  ]
},

{
  id: 'piso-con-humedades', title: 'El piso con un secreto', level: 4, theme: 'vivienda',
  text: 'Si Marta hubiera sabido que el piso tenía humedades, jamás habría firmado el contrato tan rápido. Descubrió el problema el segundo invierno, cuando una mancha oscura apareció en la pared del salón. El casero insistía en que era algo nuevo, pero un vecino le contó que el piso de abajo ya se había quejado del mismo problema años atrás. Marta contrató a un perito para que revisara el edificio entero antes de tomar cualquier decisión legal. El informe confirmó que la humedad venía de una tubería rota que nadie había reparado nunca. Ahora, con esa prueba, Marta espera que el casero por fin arregle el problema de raíz.',
  gloss: [
    { es: 'las humedades', en: 'damp problems' },
    { es: 'el casero', en: 'the landlord' },
    { es: 'el perito', en: 'the surveyor' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué habría hecho Marta si hubiera sabido lo de las humedades?', options: ['Nunca habría firmado el contrato tan rápido', 'Habría pedido un piso más grande', 'Habría vivido con sus padres'], answer: 0 },
    { type: 'mcq', q: '¿Qué confirmó el informe del perito?', options: ['Que la humedad venía de una tubería rota', 'Que el edificio era muy antiguo', 'Que no había ningún problema'], answer: 0 },
    { type: 'short', q: '¿Cuándo descubrió Marta el problema? (tres palabras)', accept: ['el segundo invierno', 'segundo invierno'] },
    { type: 'translate', line: 'El informe confirmó que la humedad venía de una tubería rota que nadie había reparado nunca.', model: 'The report confirmed that the damp came from a broken pipe that no one had ever repaired.' }
  ]
},

{
  id: 'laboratorio-cerrado-descubrimiento', title: 'El laboratorio que habían cerrado', level: 4, theme: 'ciencia',
  text: 'Los investigadores volvieron a analizar las muestras del laboratorio que habían cerrado por falta de fondos hace diez años. Nadie esperaba encontrar nada útil entre esas cajas olvidadas, pero un joven científico insistió en revisarlas en vez de tirarlas directamente a la basura. Descubrió que varias muestras contenían una bacteria que podría ayudar a desarrollar un nuevo tratamiento. El equipo publicó los resultados en una revista internacional, y varias universidades se mostraron interesadas en financiar la investigación. Es sorprendente que un descubrimiento tan importante viniera de un lugar que todos habían dado por perdido. El científico bromea diciendo que a veces la ciencia premia a los que no tiran nada.',
  gloss: [
    { es: 'las muestras', en: 'the samples' },
    { es: 'por falta de fondos', en: 'for lack of funding' },
    { es: 'dado por perdido', en: 'written off' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué habían cerrado el laboratorio?', options: ['Por falta de fondos', 'Por un accidente', 'Por falta de personal'], answer: 0 },
    { type: 'mcq', q: '¿Qué descubrió el joven científico?', options: ['Una bacteria útil para un tratamiento', 'Un nuevo planeta', 'Un error en los datos antiguos'], answer: 0 },
    { type: 'short', q: '¿Hace cuánto habían cerrado el laboratorio? (dos palabras)', accept: ['diez años'] },
    { type: 'translate', line: 'Es sorprendente que un descubrimiento tan importante viniera de un lugar que todos habían dado por perdido.', model: 'It is surprising that such an important discovery came from a place everyone had written off.' }
  ]
},

{
  id: 'ley-transporte-aprobada', title: 'La ley que habían discutido durante años', level: 4, theme: 'politica',
  text: 'El parlamento aprobó por fin la ley de transporte público que habían discutido durante casi cinco años sin llegar a un acuerdo. Los partidos de la oposición votaron en contra, alegando que el plan costaría demasiado dinero al ayuntamiento. Los defensores de la ley respondieron que el transporte gratuito para menores de dieciocho años reduciría el tráfico en el centro. Muchos vecinos, cansados de tantos debates, simplemente desean que la ley se aplique cuanto antes. El alcalde prometió que los nuevos autobuses eléctricos empezarían a circular antes de fin de año. Los periódicos locales seguirán de cerca si esa promesa se cumple.',
  gloss: [
    { es: 'el parlamento', en: 'the parliament' },
    { es: 'alegando', en: 'arguing, claiming' },
    { es: 'menores de', en: 'those under' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué habían discutido durante casi cinco años?', options: ['La ley de transporte público', 'El presupuesto municipal', 'Las elecciones locales'], answer: 0 },
    { type: 'mcq', q: '¿Qué prometió el alcalde?', options: ['Que los autobuses eléctricos circularían antes de fin de año', 'Que bajarían los impuestos', 'Que construirían un nuevo parque'], answer: 0 },
    { type: 'short', q: '¿Quién viajará gratis según la ley? (tres palabras)', accept: ['menores de dieciocho', 'menores de 18'] },
    { type: 'translate', line: 'Los periódicos locales seguirán de cerca si esa promesa se cumple.', model: 'The local newspapers will follow closely whether that promise is kept.' }
  ]
}
,
{
  id: 'si-tuviera-otro-cuerpo', title: 'Si pudiera cambiar algo', level: 4, theme: 'cuerpo',
  text: 'Mi abuela siempre dice que si tuviera veinte años menos, correría todas las mañanas por el parque como hacía antes. Ahora camina despacio porque le duelen las rodillas, pero no se queja nunca. Cada semana va a una clase de gimnasia suave pensada para personas mayores, y allí ha hecho varias amigas nuevas. El médico le explicó que mantener el cuerpo en movimiento es más importante que hacerlo rápido. A ella le gustaría tener la energía de antes, pero prefiere disfrutar de lo que su cuerpo todavía le permite hacer. Cada domingo, eso sí, insiste en subir sola las escaleras de su edificio.',
  gloss: [
    { es: 'las rodillas', en: 'the knees' },
    { es: 'la gimnasia suave', en: 'gentle exercise' },
    { es: 'las escaleras', en: 'the stairs' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué haría la abuela si tuviera veinte años menos?', options: ['Correría por el parque', 'Viajaría más', 'Trabajaría'], answer: 0 },
    { type: 'mcq', q: '¿Qué le explicó el médico?', options: ['Que mantener el cuerpo en movimiento es lo importante', 'Que debe correr todos los días', 'Que necesita operarse'], answer: 0 },
    { type: 'short', q: '¿Qué le duele a la abuela? (una palabra)', accept: ['las rodillas', 'rodillas'] },
    { type: 'translate', line: 'A ella le gustaría tener la energía de antes, pero prefiere disfrutar de lo que su cuerpo todavía le permite hacer.', model: 'She would like to have the energy she used to have, but she prefers to enjoy what her body still lets her do.' }
  ]
},

{
  id: 'si-tuviera-mas-paciencia', title: 'Un carácter que cuesta cambiar', level: 4, theme: 'caracter',
  text: 'Pablo reconoce que si tuviera más paciencia, discutiría mucho menos con sus compañeros de piso. Se enfada con facilidad cuando algo no sale como esperaba, aunque después siempre se arrepiente. Su terapeuta le sugirió que contara hasta diez y esperara un momento para responder cuando sintiera que se enfadaba. Al principio le parecía una tontería, pero con el tiempo ha notado que realmente funciona. Sus amigos dicen que Pablo ha cambiado mucho este último año, aunque él cree que todavía le queda trabajo por hacer. De momento, se conforma con discutir un poco menos cada mes.',
  gloss: [
    { es: 'se arrepiente', en: 'he regrets it' },
    { es: 'una tontería', en: 'a silly thing' },
    { es: 'se conforma', en: 'he settles for' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué haría Pablo si tuviera más paciencia?', options: ['Discutiría menos', 'Trabajaría más', 'Viajaría solo'], answer: 0 },
    { type: 'mcq', q: '¿Qué le sugirió el terapeuta?', options: ['Contar hasta diez antes de responder', 'Hacer más deporte', 'Cambiar de piso'], answer: 0 },
    { type: 'short', q: '¿Qué notan sus amigos? (dos palabras)', accept: ['ha cambiado', 'que cambió'] },
    { type: 'translate', line: 'Sus amigos dicen que Pablo ha cambiado mucho este último año, aunque él cree que todavía le queda trabajo por hacer.', model: 'His friends say Pablo has changed a lot this past year, although he thinks he still has work to do.' }
  ]
},

{
  id: 'ojala-recordara-mas', title: 'Ojalá recordara más', level: 4, theme: 'identidad',
  text: 'Ojalá recordara mejor los primeros años de mi vida, pero solo me quedan algunas imágenes sueltas. Mi madre cuenta historias que yo no recuerdo en absoluto, como el día en que aprendí a caminar en la playa. A veces me pregunto cuánto de lo que creo saber sobre mí mismo viene de mis propios recuerdos y cuánto viene de lo que me han contado otros. Un psicólogo me explicó que esto es completamente normal: casi nadie guarda recuerdos de sus primeros tres años de vida. Aun así, me habría gustado guardar más recuerdos propios de esa época tan importante. Por eso, ahora escribo un diario cada noche, para que mis hijos no tengan el mismo problema.',
  gloss: [
    { es: 'sueltas', en: 'scattered, loose' },
    { es: 'en absoluto', en: 'at all' },
    { es: 'el diario', en: 'the diary' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le explicó el psicólogo?', options: ['Que es normal no recordar antes de los tres años', 'Que debe ir a terapia', 'Que su memoria es mala'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace ahora la narradora cada noche?', options: ['Escribe un diario', 'Llama a su madre', 'Mira fotos antiguas'], answer: 0 },
    { type: 'short', q: '¿Dónde aprendió a caminar? (una palabra)', accept: ['playa', 'en la playa'] },
    { type: 'translate', line: 'Aun así, me habría gustado guardar más recuerdos propios de esa época tan importante.', model: 'Even so, I would have liked to keep more of my own memories from that very important time.' }
  ]
},

{
  id: 'ojala-supiera-cocinar', title: 'Ojalá supiera cocinar como mi padre', level: 4, theme: 'alimentacion',
  text: 'Ojalá supiera cocinar tan bien como mi padre, que preparaba platos increíbles sin usar nunca una receta escrita. Cuando le pregunto cómo consigue el punto exacto de sal o el tiempo justo de cocción, siempre responde que simplemente lo siente. Este verano decidí aprender de una vez, así que paso cada domingo en la cocina con él, tomando notas como si fuera su ayudante. Al principio confundía las cantidades y quemaba casi todo, pero poco a poco voy mejorando. Mi padre dice que la paciencia es el ingrediente que más falta en la cocina moderna. Espero que, algún día, mis propios hijos digan lo mismo de mí.',
  gloss: [
    { es: 'la cocción', en: 'the cooking (process)' },
    { es: 'confundía', en: 'I would mix up' },
    { es: 'el ingrediente', en: 'the ingredient' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué usa el padre para cocinar sus platos?', options: ['Nunca una receta escrita', 'Un libro de recetas', 'Una aplicación del móvil'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace la narradora cada domingo?', options: ['Cocina con su padre y toma notas', 'Come en un restaurante', 'Compra en el mercado'], answer: 0 },
    { type: 'short', q: '¿Qué dice el padre que falta en la cocina moderna? (una palabra)', accept: ['paciencia', 'la paciencia'] },
    { type: 'translate', line: 'Mi padre dice que la paciencia es el ingrediente que más falta en la cocina moderna.', model: 'My father says patience is the ingredient most lacking in modern cooking.' }
  ]
},

{
  id: 'me-pidio-plan-jubilacion', title: 'Lo que me pidió mi jefa', level: 4, theme: 'servicios',
  text: 'Mi jefa me pidió que organizara el archivo de reclamaciones del ayuntamiento antes de que llegara la inspección anual. Nunca había visto tantos papeles desordenados en un solo despacho, así que tardé casi una semana en clasificarlo todo por temas. Los vecinos habían presentado quejas sobre el agua, la limpieza de las calles y la recogida de basura, entre muchas otras cosas. Al terminar, mi jefa me pidió también que preparara un resumen breve para el inspector. El día de la visita, todo estuvo listo a tiempo y el inspector felicitó al departamento por el orden del archivo. Desde entonces, me han pedido que revise el sistema una vez al mes.',
  gloss: [
    { es: 'las reclamaciones', en: 'the complaints (formal)' },
    { es: 'la inspección', en: 'the inspection' },
    { es: 'la recogida de basura', en: 'garbage collection' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le pidió la jefa que hiciera?', options: ['Organizar el archivo de reclamaciones', 'Contestar el teléfono', 'Limpiar el despacho'], answer: 0 },
    { type: 'mcq', q: '¿Qué hizo el inspector el día de la visita?', options: ['Felicitó al departamento', 'Puso una multa', 'Pidió más documentos'], answer: 0 },
    { type: 'short', q: '¿Cuánto tardó en clasificar los papeles? (dos palabras)', accept: ['una semana', 'casi una semana'] },
    { type: 'translate', line: 'Los vecinos habían presentado quejas sobre el agua, la limpieza de las calles y la recogida de basura, entre muchas otras cosas.', model: 'Residents had filed complaints about the water, street cleaning, and garbage collection, among many other things.' }
  ]
},

{
  id: 'me-pidio-que-rezara', title: 'Lo que me pidió mi abuelo', level: 4, theme: 'religion',
  text: 'Poco antes del final, mi abuelo me pidió que rezara por él cada domingo, aunque yo nunca fui una persona muy religiosa. Al principio me sentía extraño haciéndolo, como si estuviera representando un papel que no me correspondía. Con el tiempo, sin embargo, ese momento de silencio se convirtió en algo importante para mí, aunque no supiera bien explicar por qué. No creo que necesite compartir las mismas creencias que tenía mi abuelo para respetar lo que me pidió. Mi madre dice que cada persona encuentra su propia forma de recordar a quienes ya no están. Yo he encontrado la mía en ese pequeño ritual de los domingos por la mañana.',
  gloss: [
    { es: 'representando un papel', en: 'playing a role' },
    { es: 'las creencias', en: 'the beliefs' },
    { es: 'el ritual', en: 'the ritual' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le pidió el abuelo antes de morir?', options: ['Que rezara por él cada domingo', 'Que cuidara de su casa', 'Que viajara más'], answer: 0 },
    { type: 'mcq', q: '¿Qué cree la madre?', options: ['Que cada persona encuentra su forma de recordar', 'Que rezar es obligatorio', 'Que su hijo debería ir a la iglesia'], answer: 0 },
    { type: 'short', q: '¿Cuándo reza la narradora? (una palabra)', accept: ['domingos', 'los domingos'] },
    { type: 'translate', line: 'No creo que necesite compartir las mismas creencias que tenía mi abuelo para respetar lo que me pidió.', model: "I don't think I need to share the same beliefs my grandfather had to respect what he asked of me." }
  ]
},

{
  id: 'como-si-nada-hubiera-pasado', title: 'Como si nada hubiera pasado', level: 4, theme: 'relaciones',
  text: 'Después de la discusión, mi compañera de trabajo me saludó al día siguiente como si nada hubiera pasado entre nosotras. Al principio pensé que seguía enfadada y que solo fingía calma, pero después de hablar entendí que de verdad lo había olvidado. Ella me explicó que prefiere no guardar rencor porque le quita energía para el resto del día. Yo, en cambio, necesito hablar las cosas para poder pasar página completamente. Aprendimos que cada una gestiona los conflictos de forma distinta, y eso está bien. Ahora, cuando discutimos por algo del proyecto, buscamos un punto intermedio entre su calma y mi necesidad de hablarlo todo.',
  gloss: [
    { es: 'fingía', en: 'she was pretending' },
    { es: 'guardar rencor', en: 'to hold a grudge' },
    { es: 'pasar página', en: 'to move on' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo saludó la compañera al día siguiente?', options: ['Como si nada hubiera pasado', 'Con frialdad', 'Sin hablarle'], answer: 0 },
    { type: 'mcq', q: '¿Por qué prefiere la compañera no guardar rencor?', options: ['Le quita energía', 'No le importa el trabajo', 'Tiene mala memoria'], answer: 0 },
    { type: 'short', q: '¿Qué necesita hacer la narradora antes de pasar página? (una palabra)', accept: ['hablar'] },
    { type: 'translate', line: 'Aprendimos que cada una gestiona los conflictos de forma distinta, y eso está bien.', model: 'We learned that each of us handles conflicts differently, and that is okay.' }
  ]
},

{
  id: 'trabajaba-como-si-fuera-suyo', title: 'Trabajaba como si el negocio fuera suyo', level: 4, theme: 'trabajo',
  text: 'Rosa llevaba solo tres meses en la empresa, pero trabajaba como si el negocio fuera suyo desde el primer día. Llegaba antes que nadie, se quedaba hasta tarde y proponía ideas que ni siquiera los dueños habían considerado. Sus compañeros bromeaban diciendo que algún día ella terminaría comprando la empresa entera. Un día, el dueño la llamó a su despacho y le ofreció un puesto de responsabilidad que normalmente tardaba años en llegar. Rosa aceptó sin dudarlo, aunque sabía que el trabajo sería mucho más exigente. Meses después, dice que nunca se arrepintió de esforzarse como si aquel negocio fuera realmente suyo.',
  gloss: [
    { es: 'proponía', en: 'she would propose' },
    { es: 'exigente', en: 'demanding' },
    { es: 'esforzarse', en: 'to make an effort' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo trabajaba Rosa desde el primer día?', options: ['Como si el negocio fuera suyo', 'Sin muchas ganas', 'Solo lo necesario'], answer: 0 },
    { type: 'mcq', q: '¿Qué le ofreció el dueño?', options: ['Un puesto de responsabilidad', 'Un aumento de sueldo', 'Vacaciones extra'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo llevaba Rosa en la empresa? (dos palabras)', accept: ['tres meses'] },
    { type: 'translate', line: 'Meses después, dice que nunca se arrepintió de esforzarse como si aquel negocio fuera realmente suyo.', model: 'Months later, she says she never regretted working as hard as if that business were really hers.' }
  ]
},

{
  id: 'aunque-fuera-dificil-emigrar', title: 'Aunque fuera difícil, se fue', level: 4, theme: 'viajes',
  text: 'Aunque fuera difícil dejar a su familia, Teresa decidió mudarse a otro país para estudiar un máster en ingeniería. Sus padres le pidieron que lo pensara bien antes de tomar una decisión tan grande a los veintitrés años. Ella respondió que, aunque fuera duro al principio, prefería intentarlo y equivocarse a quedarse siempre con la duda. Los primeros meses fueron los más complicados: no conocía a nadie y todo, hasta hacer la compra, le parecía nuevo y confuso. Con el tiempo hizo amigos en la universidad y empezó a sentirse como en casa. Ahora, un año después, le dice a cualquiera que se lo pregunte que fue la mejor decisión de su vida.',
  gloss: [
    { es: 'el máster', en: 'the master’s degree' },
    { es: 'equivocarse', en: 'to make a mistake' },
    { es: 'confuso', en: 'confusing' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué decidió hacer Teresa aunque fuera difícil?', options: ['Mudarse a otro país para estudiar', 'Cambiar de trabajo', 'Volver a su ciudad natal'], answer: 0 },
    { type: 'mcq', q: '¿Cómo fueron los primeros meses?', options: ['Los más complicados', 'Muy tranquilos', 'Aburridos'], answer: 0 },
    { type: 'short', q: '¿Qué estudia Teresa? (dos palabras)', accept: ['ingeniería', 'un máster', 'máster en ingeniería'] },
    { type: 'translate', line: 'Ella respondió que, aunque fuera duro al principio, prefería intentarlo y equivocarse a quedarse siempre con la duda.', model: 'She answered that, even if it were hard at first, she preferred to try and fail rather than always be left wondering.' }
  ]
},

{
  id: 'aunque-fuera-caro-invertir', title: 'Aunque fuera caro, invirtió', level: 4, theme: 'economia',
  text: 'Aunque fuera caro modernizar toda la maquinaria, el dueño de la fábrica decidió invertir el dinero ahorrado durante años. Sus socios dudaban de la decisión, pues temían que la empresa no recuperara la inversión a tiempo. Él insistía en que, aunque fuera un riesgo grande, quedarse con las máquinas antiguas sería un riesgo aún mayor a largo plazo. Los primeros meses fueron difíciles porque los empleados necesitaron formación para aprender a usar los equipos nuevos. Sin embargo, la producción aumentó un cuarenta por ciento en menos de un año. Ahora, sus socios reconocen que aunque pareciera arriesgado entonces, fue la decisión correcta para la empresa.',
  gloss: [
    { es: 'la maquinaria', en: 'the machinery' },
    { es: 'los socios', en: 'the business partners' },
    { es: 'arriesgado', en: 'risky' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué decidió hacer el dueño aunque fuera caro?', options: ['Modernizar la maquinaria', 'Cerrar la fábrica', 'Vender el negocio'], answer: 0 },
    { type: 'mcq', q: '¿Qué necesitaron los empleados?', options: ['Formación para usar los equipos nuevos', 'Más vacaciones', 'Un aumento de sueldo'], answer: 0 },
    { type: 'short', q: '¿Cuánto aumentó la producción? (tres palabras)', accept: ['cuarenta por ciento', 'un cuarenta por ciento'] },
    { type: 'translate', line: 'Ahora, sus socios reconocen que aunque pareciera arriesgado entonces, fue la decisión correcta para la empresa.', model: 'Now, his partners admit that although it seemed risky at the time, it was the right decision for the company.' }
  ]
},

{
  id: 'buscaba-un-medico-que-escuchara', title: 'Buscaba un médico que la escuchara', level: 4, theme: 'medios',
  text: 'La redactora buscaba a alguien que le explicara con claridad las nuevas normas de privacidad de las redes sociales, sin usar un lenguaje demasiado técnico. Después de contactar con varios expertos que solo repetían términos legales, encontró a una abogada joven especializada en tecnología. La abogada le explicó cada punto con ejemplos sencillos, comparando las normas con situaciones cotidianas que cualquier lector entendería. Gracias a esa entrevista, el artículo se convirtió en uno de los más leídos del mes en el periódico digital. Muchos lectores escribieron para agradecer que por fin alguien explicara el tema sin complicarlo innecesariamente. La redactora dice que ese es, precisamente, el trabajo que más le gusta hacer.',
  gloss: [
    { es: 'la redactora', en: 'the (female) writer/editor' },
    { es: 'cotidianas', en: 'everyday' },
    { es: 'innecesariamente', en: 'unnecessarily' }
  ],
  questions: [
    { type: 'mcq', q: '¿A quién buscaba la redactora?', options: ['A alguien que explicara las normas con claridad', 'A un famoso para entrevistar', 'A un traductor'], answer: 0 },
    { type: 'mcq', q: '¿Qué hizo la abogada?', options: ['Explicó las normas con ejemplos sencillos', 'Escribió el artículo ella misma', 'Se negó a hablar'], answer: 0 },
    { type: 'short', q: '¿En qué está especializada la abogada? (una palabra)', accept: ['tecnología'] },
    { type: 'translate', line: 'Muchos lectores escribieron para agradecer que por fin alguien explicara el tema sin complicarlo innecesariamente.', model: 'Many readers wrote in to thank her that someone had finally explained the topic without needlessly complicating it.' }
  ]
},

{
  id: 'buscaba-planta-que-resistiera', title: 'Buscaba una planta que resistiera la sequía', level: 4, theme: 'naturaleza',
  text: 'El biólogo buscaba desde hacía años una planta que resistiera largos periodos de sequía sin necesitar apenas agua. Viajó por varias regiones áridas del país tomando muestras y hablando con agricultores locales sobre las especies que mejor sobrevivían. En un pueblo pequeño, un anciano le mostró una planta silvestre que su familia usaba desde generaciones para épocas de escasez. El biólogo analizó la planta en su laboratorio y descubrió que podría adaptarse a otras zonas afectadas por el cambio climático. Publicó sus resultados con la esperanza de que ayudaran a otros agricultores a enfrentar los veranos cada vez más secos. Para él, esa planta representa una pequeña victoria frente a un problema enorme.',
  gloss: [
    { es: 'áridas', en: 'arid' },
    { es: 'silvestre', en: 'wild' },
    { es: 'la escasez', en: 'scarcity' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué buscaba el biólogo?', options: ['Una planta que resistiera la sequía', 'Un nuevo animal', 'Un río escondido'], answer: 0 },
    { type: 'mcq', q: '¿Quién le mostró la planta?', options: ['Un anciano del pueblo', 'Otro biólogo', 'Un periodista'], answer: 0 },
    { type: 'short', q: '¿Para qué podría servir la planta? (tres palabras)', accept: ['adaptarse al cambio climático', 'enfrentar veranos secos'] },
    { type: 'translate', line: 'Para él, esa planta representa una pequeña victoria frente a un problema enorme.', model: 'For him, that plant represents a small victory against a huge problem.' }
  ]
},

{
  id: 'fue-una-pena-vacunas', title: 'Fue una pena que llegara tan tarde', level: 4, theme: 'ciencia',
  text: 'Fue una pena que la vacuna llegara justo un año después de que la epidemia hubiera afectado a tantas familias en la región. Los científicos habían trabajado sin descanso, pero el proceso de pruebas necesario para garantizar la seguridad tomaba tiempo que nadie podía acelerar sin riesgo. Es normal que la gente se impaciente ante una crisis así, aunque los expertos insisten en que saltarse pasos habría sido mucho más peligroso. Cuando por fin llegó la vacuna, los hospitales de la zona respiraron aliviados por primera vez en meses. Los investigadores desean que este caso sirva para invertir más dinero en investigación, pues nadie sabe cuándo llegará la próxima crisis. Nadie quiere que se repita la misma espera.',
  gloss: [
    { es: 'la epidemia', en: 'the epidemic' },
    { es: 'se impaciente', en: '(that people) grow impatient' },
    { es: 'aliviados', en: 'relieved' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué fue una pena la llegada de la vacuna?', options: ['Llegó un año después de que la epidemia afectara a muchas familias', 'No funcionó bien', 'Costó demasiado dinero'], answer: 0 },
    { type: 'mcq', q: '¿Qué insisten los expertos?', options: ['Que saltarse pasos habría sido más peligroso', 'Que la vacuna no era necesaria', 'Que fue un error fabricarla'], answer: 0 },
    { type: 'short', q: '¿Cómo respiraron los hospitales cuando llegó la vacuna? (una palabra)', accept: ['aliviados'] },
    { type: 'translate', line: 'Los investigadores desean que este caso sirva para invertir más dinero en investigación, pues nadie sabe cuándo llegará la próxima crisis.', model: 'The researchers wish this case would lead to more money being invested in research, since no one knows when the next crisis will arrive.' }
  ]
},

{
  id: 'fue-una-pena-referendum', title: 'Fue una pena que no votara más gente', level: 4, theme: 'politica',
  text: 'Fue una pena que tan poca gente votara en el referéndum sobre el nuevo parque del barrio, después de meses de debate en las reuniones vecinales. Solo participó un veinte por ciento de los vecinos con derecho a voto, un número que decepcionó a los organizadores. Algunos vecinos explicaron que no habían recibido suficiente información sobre cuándo y dónde votar. Otros simplemente dijeron que no creían que su voto fuera a cambiar nada en una decisión ya tomada por el ayuntamiento. Los organizadores desean que la próxima consulta cuente con más participación, y proponen enviar recordatorios por mensaje de texto. Mientras tanto, el parque se construirá según lo que decidió esa minoría de votantes.',
  gloss: [
    { es: 'el referéndum', en: 'the referendum' },
    { es: 'decepcionó', en: 'disappointed' },
    { es: 'la minoría', en: 'the minority' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué porcentaje de vecinos votó?', options: ['Un veinte por ciento', 'La mitad', 'Casi todos'], answer: 0 },
    { type: 'mcq', q: '¿Qué proponen los organizadores para la próxima vez?', options: ['Enviar recordatorios por mensaje de texto', 'Cancelar las consultas', 'Votar solo por internet'], answer: 0 },
    { type: 'short', q: '¿Sobre qué era el referéndum? (dos palabras)', accept: ['el nuevo parque', 'nuevo parque'] },
    { type: 'translate', line: 'Otros simplemente dijeron que no creían que su voto fuera a cambiar nada en una decisión ya tomada por el ayuntamiento.', model: 'Others simply said they did not believe their vote would change anything in a decision already made by the city council.' }
  ]
}
,
{
  id: 'cuando-termine-el-informe', title: 'Cuando termine el informe', level: 4, theme: 'medios',
  text: 'La editora le ha dicho al redactor que, cuando termine el informe sobre la contaminación del río, lo revisarán juntos y luego lo publicarán. El tema es delicado porque implica directamente a una fábrica importante de la ciudad, así que cada dato debe estar bien comprobado. El redactor lleva dos semanas hablando con vecinos, técnicos del ayuntamiento y un exempleado de la fábrica que aceptó hablar sin dar su nombre. Cuando termine de redactar el texto, también tendrá que enviarlo al departamento legal del periódico para una última revisión. La editora confía en que el artículo, cuando por fin salga publicado, tenga un impacto real en la zona. El redactor solo espera terminar a tiempo para la edición del domingo.',
  gloss: [
    { es: 'delicado', en: 'sensitive' },
    { es: 'comprobado', en: 'verified' },
    { es: 'la edición', en: 'the edition' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué harán cuando termine el informe?', options: ['Lo revisarán juntos antes de publicarlo', 'Lo cancelarán', 'Lo publicarán sin revisar'], answer: 0 },
    { type: 'mcq', q: '¿Con quién ha hablado el redactor?', options: ['Vecinos, técnicos y un exempleado', 'Solo con el alcalde', 'Solo con la fábrica'], answer: 0 },
    { type: 'short', q: '¿Para cuándo espera terminar el redactor? (dos palabras)', accept: ['edición del domingo', 'el domingo'] },
    { type: 'translate', line: 'La editora confía en que el artículo, cuando por fin salga publicado, tenga un impacto real en la zona.', model: 'The editor trusts that the article, once it is finally published, will have a real impact on the area.' }
  ]
},

{
  id: 'para-que-el-rio-se-recupere', title: 'Para que el río se recupere', level: 4, theme: 'naturaleza',
  text: 'El ayuntamiento ha prohibido que las fábricas cercanas viertan residuos en el río, para que el agua se recupere en los próximos años. Durante décadas, casi ningún pez había sobrevivido en esa zona debido a la contaminación constante. Los biólogos instalaron sensores a lo largo del río para que los técnicos puedan medir la calidad del agua cada semana. También han empezado a plantar árboles junto a la orilla, para que las raíces ayuden a filtrar parte de la contaminación que aún queda. Los primeros resultados son prometedores: ya se han visto pequeños peces en algunos tramos del río. Los vecinos desean que el ayuntamiento mantenga la vigilancia durante muchos años más, para que el proyecto funcione del todo.',
  gloss: [
    { es: 'viertan residuos', en: '(that they) dump waste' },
    { es: 'la orilla', en: 'the riverbank' },
    { es: 'los tramos', en: 'the stretches (of a river)' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué ha prohibido el ayuntamiento?', options: ['Que las fábricas viertan residuos en el río', 'Que la gente pesque en el río', 'Que se construyan casas cerca del río'], answer: 0 },
    { type: 'mcq', q: '¿Para qué instalaron sensores los biólogos?', options: ['Para medir la calidad del agua', 'Para contar los peces', 'Para vigilar a las fábricas'], answer: 0 },
    { type: 'short', q: '¿Qué se ha visto ya en el río? (dos palabras)', accept: ['pequeños peces', 'peces pequeños'] },
    { type: 'translate', line: 'También han empezado a plantar árboles junto a la orilla, para que las raíces ayuden a filtrar parte de la contaminación que aún queda.', model: 'They have also started planting trees along the bank, so that the roots help filter some of the pollution that remains.' }
  ]
},

{
  id: 'aunque-no-sea-perfecta-la-ley', title: 'Aunque no sea perfecta la ley', level: 4, theme: 'politica',
  text: 'La diputada defendió en el debate que, aunque no sea perfecta, la nueva ley de vivienda es un paso necesario para frenar la subida de los alquileres. Sus opositores insisten en que la ley perjudica a los pequeños propietarios, que no pueden competir con los grandes fondos de inversión. La diputada respondió que ninguna ley resuelve todos los problemas de golpe, pero que esperar la solución perfecta significa no hacer nada durante años. Varias asociaciones de inquilinos, aunque no estén completamente satisfechas con el texto final, han pedido a los diputados que la aprueben cuanto antes. El próximo mes se votará en el parlamento, y todos los partidos ya han anunciado su posición. La diputada desea que, aunque no sea la ley definitiva, sirva de primer paso hacia una reforma más amplia.',
  gloss: [
    { es: 'frenar', en: 'to curb, to slow down' },
    { es: 'los propietarios', en: 'the property owners' },
    { es: 'los inquilinos', en: 'the tenants' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué defendió la diputada?', options: ['Que la ley es un paso necesario aunque no sea perfecta', 'Que la ley debe eliminarse', 'Que hay que esperar una ley perfecta'], answer: 0 },
    { type: 'mcq', q: '¿Qué han pedido las asociaciones de inquilinos?', options: ['Que se apruebe la ley cuanto antes', 'Que se rechace la ley', 'Que se congelen los alquileres'], answer: 0 },
    { type: 'short', q: '¿Qué se votará el próximo mes? (una palabra)', accept: ['la ley'] },
    { type: 'translate', line: 'Sus opositores insisten en que la ley perjudica a los pequeños propietarios, que no pueden competir con los grandes fondos de inversión.', model: 'Her opponents insist that the law harms small property owners, who cannot compete with large investment funds.' }
  ]
},

{
  id: 'no-creo-que-suba-la-bolsa', title: 'No creo que suba tanto', level: 4, theme: 'economia',
  text: 'Mi tío, que lleva veinte años invirtiendo en bolsa, dice que no cree que los precios sigan subiendo al mismo ritmo del último año. Explica que después de una subida tan rápida, es normal que el mercado se corrija en algún momento. Muchos inversores jóvenes, sin embargo, no creen que su tío tenga razón, porque han visto crecer sus ahorros mes tras mes desde que empezaron. Él les recomienda que diversifiquen sus inversiones y que no pongan todo el dinero en un solo tipo de producto. También les advierte que no crean que ganar dinero rápido sea siempre buena señal a largo plazo. Sus sobrinos escuchan sus consejos con respeto, aunque no siempre están de acuerdo con su forma más cautelosa de invertir.',
  gloss: [
    { es: 'la bolsa', en: 'the stock market' },
    { es: 'se corrija', en: '(that it) corrects itself' },
    { es: 'cautelosa', en: 'cautious' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué no cree el tío?', options: ['Que los precios sigan subiendo al mismo ritmo', 'Que sus sobrinos inviertan bien', 'Que el mercado exista'], answer: 0 },
    { type: 'mcq', q: '¿Qué les recomienda a sus sobrinos?', options: ['Que diversifiquen sus inversiones', 'Que dejen de invertir', 'Que compren solo un producto'], answer: 0 },
    { type: 'short', q: '¿Cuántos años lleva el tío invirtiendo? (dos palabras)', accept: ['veinte años'] },
    { type: 'translate', line: 'También les advierte que no crean que ganar dinero rápido sea siempre buena señal a largo plazo.', model: 'He also warns them not to think that making money quickly is always a good sign in the long run.' }
  ]
},

{
  id: 'quienquiera-que-gane-elecciones', title: 'Quienquiera que gane', level: 4, theme: 'ciencia',
  text: 'Los científicos del instituto de investigación climática han pedido que, quienquiera que gane las próximas elecciones, mantenga el presupuesto destinado a sus proyectos. Durante los últimos diez años, el equipo ha estudiado cómo el aumento de la temperatura afecta a los glaciares de la región. Los resultados han sido publicados en revistas internacionales y citados por otros grupos de investigación en varios países. Sin embargo, cada cambio de gobierno trae consigo el riesgo de recortes que podrían dejar el proyecto a medias. Los investigadores explican que quienquiera que tome la decisión debería entender que estos estudios necesitan décadas, no solo unos meses, para dar resultados fiables. Por ahora, siguen trabajando con los medios que tienen, esperando que la política no interrumpa lo que la ciencia ha construido con tanto esfuerzo.',
  gloss: [
    { es: 'el presupuesto', en: 'the budget' },
    { es: 'los glaciares', en: 'the glaciers' },
    { es: 'a medias', en: 'half-finished' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué han pedido los científicos?', options: ['Que quienquiera que gane mantenga el presupuesto', 'Que se cierre el instituto', 'Que cambien de tema de estudio'], answer: 0 },
    { type: 'mcq', q: '¿Qué estudia el equipo?', options: ['Cómo el aumento de temperatura afecta a los glaciares', 'Los volcanes de la región', 'La contaminación del aire'], answer: 0 },
    { type: 'short', q: '¿Cuántos años lleva el equipo estudiando? (dos palabras)', accept: ['diez años'] },
    { type: 'translate', line: 'Los investigadores explican que quienquiera que tome la decisión debería entender que estos estudios necesitan décadas, no solo unos meses, para dar resultados fiables.', model: 'The researchers explain that whoever makes the decision should understand that these studies need decades, not just months, to produce reliable results.' }
  ]
},

{
  id: 'hasta-que-no-firmen-acuerdo', title: 'Hasta que no firmen el acuerdo', level: 4, theme: 'trabajo',
  text: 'Los trabajadores de la fábrica han anunciado que seguirán en huelga hasta que no firmen un acuerdo salarial que consideren justo. La empresa ofrece un aumento del dos por ciento, mientras que el sindicato pide al menos un cinco por ciento para compensar la subida de los precios. Ambas partes se reunieron esta semana, pero la reunión terminó sin ningún acuerdo tras casi seis horas de negociación. Los trabajadores insisten en que no volverán a las máquinas hasta que no vean una propuesta razonable sobre la mesa. La dirección, por su parte, advierte que la huelga está afectando gravemente la producción y los pedidos internacionales. Un mediador contratado por el ayuntamiento intentará acercar posturas la próxima semana, aunque nadie sabe cuánto tiempo más durará el conflicto.',
  gloss: [
    { es: 'la huelga', en: 'the strike' },
    { es: 'el sindicato', en: 'the union' },
    { es: 'el mediador', en: 'the mediator' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué han anunciado los trabajadores?', options: ['Que seguirán en huelga hasta firmar un acuerdo justo', 'Que abandonan la fábrica', 'Que aceptan la oferta de la empresa'], answer: 0 },
    { type: 'mcq', q: '¿Qué pide el sindicato?', options: ['Al menos un cinco por ciento de aumento', 'Vacaciones más largas', 'Un nuevo director'], answer: 0 },
    { type: 'short', q: '¿Quién intentará acercar posturas? (una palabra)', accept: ['un mediador', 'mediador'] },
    { type: 'translate', line: 'La dirección, por su parte, advierte que la huelga está afectando gravemente la producción y los pedidos internacionales.', model: 'Management, for its part, warns that the strike is seriously affecting production and international orders.' }
  ]
},

{
  id: 'firme-aqui-imperativo', title: 'Firme aquí, para que quede constancia', level: 4, theme: 'servicios',
  text: 'El funcionario le explicó al ciudadano: "Firme aquí, por favor, para que quede constancia de que ha recibido toda la información." El trámite, que en teoría dura quince minutos, llevaba ya más de una hora debido a un problema con el sistema informático de la oficina. El ciudadano, cansado de esperar, preguntó si podía volver otro día para terminarlo con más calma. El funcionario le pidió que tuviera un poco más de paciencia, porque el sistema estaba a punto de volver a funcionar. Finalmente, tras otros veinte minutos de espera, pudo firmar los últimos documentos y salir de la oficina con su nuevo permiso. Al salir, comentó a su pareja que nunca había entendido por qué algo tan simple podía complicarse tanto.',
  gloss: [
    { es: 'que quede constancia', en: 'so there is a record' },
    { es: 'el trámite', en: 'the (official) procedure' },
    { es: 'el permiso', en: 'the permit' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuánto duraba el trámite en teoría?', options: ['Quince minutos', 'Una hora', 'Todo el día'], answer: 0 },
    { type: 'mcq', q: '¿Por qué se retrasó el trámite?', options: ['Por un problema con el sistema informático', 'Porque faltaban documentos', 'Porque el funcionario llegó tarde'], answer: 0 },
    { type: 'short', q: '¿Qué le pidió el funcionario al ciudadano? (dos palabras)', accept: ['más paciencia', 'tener paciencia'] },
    { type: 'translate', line: 'Al salir, comentó a su pareja que nunca había entendido por qué algo tan simple podía complicarse tanto.', model: 'On his way out, he told his partner that he had never understood why something so simple could get so complicated.' }
  ]
},

{
  id: 'cuando-abran-la-exposicion', title: 'Cuando abran la exposición', level: 4, theme: 'arte',
  text: 'El escultor ha pedido que, cuando abran la exposición el mes que viene, sus obras se coloquen cerca de la entrada para que el público las vea primero. Ha trabajado durante dos años en esta colección, inspirada en los pueblos abandonados de la región donde creció. Cada pieza está hecha con materiales que él mismo recogió de casas en ruinas: puertas viejas, ventanas rotas y trozos de tejado. El comisario de la exposición cree que, cuando la gente entienda el origen de los materiales, valorará aún más el trabajo detrás de cada escultura. Varios coleccionistas ya han mostrado interés en comprar piezas antes incluso de que se inaugure la muestra. El escultor solo espera que, cuando por fin vean su trabajo completo, la gente entienda el homenaje que quiso hacer a esos pueblos olvidados.',
  gloss: [
    { es: 'el comisario', en: 'the curator' },
    { es: 'los coleccionistas', en: 'the collectors' },
    { es: 'el homenaje', en: 'the tribute' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué ha pedido el escultor?', options: ['Que sus obras se coloquen cerca de la entrada', 'Que cambien la fecha de la exposición', 'Que no vendan sus piezas'], answer: 0 },
    { type: 'mcq', q: '¿Con qué materiales están hechas las piezas?', options: ['Materiales recogidos de casas en ruinas', 'Mármol y bronce', 'Materiales reciclados de fábricas'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo trabajó en la colección? (dos palabras)', accept: ['dos años'] },
    { type: 'translate', line: 'Varios coleccionistas ya han mostrado interés en comprar piezas antes incluso de que se inaugure la muestra.', model: 'Several collectors have already shown interest in buying pieces even before the exhibition opens.' }
  ]
},

{
  id: 'para-que-todos-disfruten-fiesta', title: 'Para que todos disfruten', level: 4, theme: 'ocio',
  text: 'Los organizadores del festival han cambiado el horario de los conciertos para que todos, incluidas las familias con niños pequeños, puedan disfrutar del evento sin problemas. Este año, los grupos con música más tranquila tocarán por la tarde, mientras que las bandas más ruidosas actuarán después de las diez de la noche. También han instalado una zona con juegos y sombra para que los más pequeños descansen entre concierto y concierto. Los vecinos del pueblo, que llevaban años quejándose del ruido hasta la madrugada, han recibido bien estos cambios. Los organizadores desean que el festival sea un evento pensado para todo tipo de público, para que siga creciendo cada año. La primera noche del festival, con el nuevo horario, tuvo la mejor asistencia de su historia.',
  gloss: [
    { es: 'la madrugada', en: 'the early hours' },
    { es: 'la asistencia', en: 'the attendance' },
    { es: 'la sombra', en: 'the shade' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué cambiaron el horario los organizadores?', options: ['Para que las familias con niños disfruten sin problemas', 'Porque el ayuntamiento lo exigió', 'Porque hubo un accidente'], answer: 0 },
    { type: 'mcq', q: '¿Cuándo tocan las bandas más ruidosas?', options: ['Después de las diez de la noche', 'Por la mañana', 'Al mediodía'], answer: 0 },
    { type: 'short', q: '¿Qué instalaron para los más pequeños? (tres palabras)', accept: ['zona con juegos', 'juegos y sombra'] },
    { type: 'translate', line: 'La primera noche del festival, con el nuevo horario, tuvo la mejor asistencia de su historia.', model: "The festival's first night, with the new schedule, had the best attendance in its history." }
  ]
},

{
  id: 'aunque-no-sea-facil-mudanza', title: 'Aunque no sea fácil vender el piso', level: 4, theme: 'vivienda',
  text: 'La agente inmobiliaria le explicó a la pareja que, aunque no sea fácil vender un piso tan pequeño en esta zona, hay maneras de hacerlo más atractivo para los compradores. Les recomendó pintar las paredes de colores claros y quitar los muebles más grandes para que las habitaciones parezcan más espaciosas. También sugirió hacer las fotos del anuncio por la mañana, cuando la luz natural entra mejor por las ventanas. La pareja, aunque no estaba convencida al principio, decidió seguir todos los consejos antes de publicar el anuncio. Tres semanas después, recibieron varias ofertas el mismo fin de semana, algo que no esperaban tan pronto. La agente sonrió y les recordó que, aunque no sea fácil, casi todo piso encuentra comprador con la estrategia correcta.',
  gloss: [
    { es: 'inmobiliaria', en: 'real estate' },
    { es: 'espaciosas', en: 'spacious' },
    { es: 'el anuncio', en: 'the listing, the ad' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué recomendó la agente inmobiliaria?', options: ['Pintar de colores claros y quitar muebles grandes', 'Bajar mucho el precio', 'Esperar un año para vender'], answer: 0 },
    { type: 'mcq', q: '¿Cuándo sugirió hacer las fotos?', options: ['Por la mañana', 'Por la noche', 'Los fines de semana'], answer: 0 },
    { type: 'short', q: '¿Cuánto tardaron en recibir ofertas? (tres palabras)', accept: ['tres semanas después', 'tres semanas'] },
    { type: 'translate', line: 'Tres semanas después, recibieron varias ofertas el mismo fin de semana, algo que no esperaban tan pronto.', model: 'Three weeks later, they received several offers on the same weekend, something they did not expect so soon.' }
  ]
},

{
  id: 'no-creo-que-cierre-la-tienda', title: 'No creo que cierre tan pronto', level: 4, theme: 'compras',
  text: 'El dueño de la tienda de barrio insiste en que no cree que su negocio cierre pronto, a pesar de la competencia de los grandes supermercados. Reconoce que las ventas han bajado en los últimos años, pero destaca que muchos clientes siguen prefiriendo un trato más cercano y personal. Sus clientes más fieles no creen que un supermercado grande pueda ofrecer nunca el mismo servicio que reciben en la tienda del barrio, donde el dueño conoce a cada familia por su nombre. Aun así, ha empezado a vender también productos por internet para llegar a más gente. No cree que esta nueva estrategia sustituya a la tienda física, pero desea que ayude a mantener el negocio a flote. Para él, cada cliente que entra por la puerta es una razón más para seguir adelante.',
  gloss: [
    { es: 'la competencia', en: 'the competition' },
    { es: 'fieles', en: 'loyal' },
    { es: 'a flote', en: 'afloat' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué no cree el dueño de la tienda?', options: ['Que su negocio cierre pronto', 'Que sus clientes sean fieles', 'Que las ventas hayan bajado'], answer: 0 },
    { type: 'mcq', q: '¿Qué ha empezado a hacer para llegar a más gente?', options: ['Vender productos por internet', 'Bajar todos los precios', 'Abrir otra tienda'], answer: 0 },
    { type: 'short', q: '¿Qué destaca el dueño sobre sus clientes? (dos palabras)', accept: ['trato cercano', 'trato personal'] },
    { type: 'translate', line: 'Sus clientes más fieles no creen que un supermercado grande pueda ofrecer nunca el mismo servicio que reciben en la tienda del barrio, donde el dueño conoce a cada familia por su nombre.', model: 'His most loyal customers do not believe a big supermarket could ever offer the same service they get at the neighborhood shop, where the owner knows every family by name.' }
  ]
},

{
  id: 'para-que-el-paciente-mejore', title: 'Para que el paciente mejore', level: 4, theme: 'salud',
  text: 'El médico ha pedido que, para que el paciente mejore más rápido, la familia lo acompañe durante las primeras semanas de recuperación en casa. La operación salió bien, pero el proceso de rehabilitación requiere paciencia y ejercicios diarios que son difíciles de hacer solo. La hija del paciente ha organizado turnos con sus hermanos para que siempre haya alguien disponible durante el día. El fisioterapeuta viene tres veces por semana y explica cada ejercicio con calma, para que la familia también sepa cómo ayudar entre visita y visita. Al principio, el paciente se sentía frustrado por lo lento del progreso, pero poco a poco ha recuperado la confianza. El médico calcula que, para que la recuperación sea completa, todavía pasarán un par de meses más de esfuerzo constante.',
  gloss: [
    { es: 'la rehabilitación', en: 'the rehabilitation' },
    { es: 'el fisioterapeuta', en: 'the physiotherapist' },
    { es: 'frustrado', en: 'frustrated' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué ha pedido el médico?', options: ['Que la familia acompañe al paciente en casa', 'Que el paciente vuelva al hospital', 'Que deje los ejercicios'], answer: 0 },
    { type: 'mcq', q: '¿Cuántas veces por semana viene el fisioterapeuta?', options: ['Tres veces', 'Una vez', 'Todos los días'], answer: 0 },
    { type: 'short', q: '¿Cómo se sentía el paciente al principio? (una palabra)', accept: ['frustrado'] },
    { type: 'translate', line: 'Al principio, el paciente se sentía frustrado por lo lento del progreso, pero poco a poco ha recuperado la confianza.', model: 'At first, the patient felt frustrated by how slow the progress was, but little by little he has regained his confidence.' }
  ]
}
,
{
  id: 'para-diciembre-habran-terminado-puente', title: 'Para diciembre, el puente estará listo', level: 5, theme: 'ciencia',
  text: 'Los ingenieros calculan que, para diciembre, ya habrán terminado la construcción del nuevo puente que conectará los dos barrios separados por el río. El proyecto, que lleva año y medio en obras, ha usado una técnica poco habitual en la región para reducir el impacto ambiental durante la construcción. Para cuando el puente abra al tráfico, los ingenieros habrán probado su resistencia con varios ensayos de carga, simulando el peso de camiones y autobuses. Los vecinos de ambos barrios llevan meses esperando este momento, ya que hasta ahora tenían que dar un rodeo de veinte minutos en coche. El ayuntamiento ha prometido que, para cuando termine el año, también habrá terminado de iluminar toda la zona cercana al puente. Los ingenieros están convencidos de que esta obra cambiará la vida diaria de miles de personas.',
  gloss: [
    { es: 'las obras', en: 'the construction works' },
    { es: 'el ensayo de carga', en: 'load test' },
    { es: 'dar un rodeo', en: 'to take a detour' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué habrán terminado los ingenieros para diciembre?', options: ['La construcción del nuevo puente', 'Un túnel', 'Una carretera nueva'], answer: 0 },
    { type: 'mcq', q: '¿Qué tenían que hacer los vecinos hasta ahora?', options: ['Dar un rodeo de veinte minutos', 'Cruzar el río a pie', 'Esperar un autobús especial'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo lleva el proyecto en obras? (tres palabras)', accept: ['año y medio'] },
    { type: 'translate', line: 'Para cuando el puente abra al tráfico, los ingenieros habrán probado su resistencia con varios ensayos de carga, simulando el peso de camiones y autobuses.', model: 'By the time the bridge opens to traffic, the engineers will have tested its strength with several load tests, simulating the weight of trucks and buses.' }
  ]
},

{
  id: 'para-junio-habre-ahorrado', title: 'Para junio, habré ahorrado lo suficiente', level: 5, theme: 'economia',
  text: 'Marina calcula que, para junio, ya habrá ahorrado lo suficiente para dar la entrada de un piso pequeño en las afueras. Lleva dos años apuntando cada gasto en una aplicación del móvil y ha reducido al mínimo las salidas a restaurantes los fines de semana. Sus padres le han ofrecido prestarle una parte del dinero, pero ella prefiere demostrarse a sí misma que puede lograrlo sola. Para cuando llegue el verano, también habrá terminado de comparar hipotecas entre varios bancos, algo que le está costando más de lo esperado. Sus amigos bromean diciendo que, para cuando por fin compre el piso, ya se habrá convertido en una experta en finanzas personales. Marina se ríe, pero admite que ha aprendido mucho sobre dinero en este proceso.',
  gloss: [
    { es: 'la entrada', en: 'the down payment' },
    { es: 'las afueras', en: 'the outskirts' },
    { es: 'la hipoteca', en: 'the mortgage' }
  ],
  questions: [
    { type: 'mcq', q: '¿Para qué habrá ahorrado suficiente Marina para junio?', options: ['Para dar la entrada de un piso', 'Para comprar un coche', 'Para un viaje largo'], answer: 0 },
    { type: 'mcq', q: '¿Qué prefiere Marina en vez de aceptar el dinero de sus padres?', options: ['Demostrarse que puede lograrlo sola', 'Pedir un préstamo al banco', 'Esperar más tiempo'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo lleva apuntando sus gastos? (dos palabras)', accept: ['dos años'] },
    { type: 'translate', line: 'Sus amigos bromean diciendo que, para cuando por fin compre el piso, ya se habrá convertido en una experta en finanzas personales.', model: 'Her friends joke that, by the time she finally buys the apartment, she will have become an expert in personal finance.' }
  ]
},

{
  id: 'para-los-juegos-habran-entrenado', title: 'Para los juegos, habrán entrenado durante años', level: 5, theme: 'ocio',
  text: 'Los organizadores calculan que, para el inicio de los juegos regionales, los atletas más jóvenes habrán entrenado durante casi cuatro años bajo el nuevo programa deportivo del ayuntamiento. El programa, pensado para niños de barrios con pocos recursos, ofrece entrenamiento gratuito y transporte hasta las instalaciones deportivas. Para cuando lleguen las primeras competiciones, varios entrenadores habrán identificado ya a los talentos con más posibilidades de representar a la ciudad en el futuro. Una de las participantes, de solo trece años, ha mejorado tanto su marca en salto de altura que ya compite con chicas de dieciséis. Sus padres, emocionados, dicen que jamás habrían imaginado que su hija llegara tan lejos en tan poco tiempo. El ayuntamiento espera que, para dentro de unos años, el programa haya cambiado por completo el deporte local.',
  gloss: [
    { es: 'las instalaciones', en: 'the facilities' },
    { es: 'la marca', en: 'the (sports) record' },
    { es: 'el salto de altura', en: 'high jump' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué habrán hecho los atletas para el inicio de los juegos?', options: ['Habrán entrenado durante casi cuatro años', 'Habrán ganado varias medallas', 'Habrán cambiado de deporte'], answer: 0 },
    { type: 'mcq', q: '¿Qué ofrece el programa deportivo?', options: ['Entrenamiento gratuito y transporte', 'Solo equipamiento deportivo', 'Becas para la universidad'], answer: 0 },
    { type: 'short', q: '¿Cuántos años tiene la participante mencionada? (una palabra)', accept: ['trece'] },
    { type: 'translate', line: 'Sus padres, emocionados, dicen que jamás habrían imaginado que su hija llegara tan lejos en tan poco tiempo.', model: 'Her parents, moved, say they never would have imagined their daughter would go so far in so little time.' }
  ]
},

{
  id: 'no-contesta-habra-salido-cita', title: 'No contesta: habrá salido ya', level: 5, theme: 'relaciones',
  text: 'Llevo toda la tarde llamando a mi hermana y no contesta, así que supongo que habrá salido sin el teléfono otra vez, como suele hacer los sábados. Quedamos para cenar juntas a las nueve, pero ya son las ocho y media y todavía no sé nada de ella. Mi madre dice que no me preocupe, que seguramente habrá perdido la noción del tiempo hablando con alguna amiga en la calle. Yo, sin embargo, empiezo a pensar que quizás se habrá olvidado por completo de nuestro plan, algo que ya ha pasado antes. Justo cuando decido llamar a un par de amigas suyas para preguntar, ella me escribe un mensaje diciendo que llega en diez minutos. Al final, resulta que se había quedado dormida después de una siesta demasiado larga.',
  gloss: [
    { es: 'la noción del tiempo', en: 'track of time' },
    { es: 'la siesta', en: 'the nap' },
    { es: 'suele hacer', en: 'she usually does' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué supone la narradora al principio?', options: ['Que su hermana habrá salido sin el teléfono', 'Que su hermana está enferma', 'Que su hermana ha cambiado de número'], answer: 0 },
    { type: 'mcq', q: '¿Qué había pasado en realidad?', options: ['Se había quedado dormida', 'Había perdido el teléfono', 'Estaba con otra amiga'], answer: 0 },
    { type: 'short', q: '¿A qué hora habían quedado para cenar? (una palabra)', accept: ['nueve', 'las nueve'] },
    { type: 'translate', line: 'Yo, sin embargo, empiezo a pensar que quizás se habrá olvidado por completo de nuestro plan, algo que ya ha pasado antes.', model: 'I, however, start to think that maybe she has completely forgotten about our plan, something that has already happened before.' }
  ]
},

{
  id: 'no-responde-el-medico-habra-terminado', title: 'El médico habrá terminado ya la consulta', level: 5, theme: 'salud',
  text: 'La recepcionista de la clínica le dice al paciente que el médico habrá terminado la consulta anterior en unos diez minutos, así que puede esperar tranquilo en la sala. El paciente, algo nervioso porque espera los resultados de unas pruebas, mira el reloj cada pocos minutos. Otra paciente, sentada a su lado, le comenta que el médico siempre se retrasa un poco porque dedica tiempo a explicar todo con calma a cada persona. Cuando por fin lo llaman, el médico le confirma que los resultados son buenos y que no hay nada de qué preocuparse. Aliviado, el paciente sale de la consulta pensando que quizás su cita habrá durado más de lo normal, pero que ha merecido la pena. De camino a casa, llama a su familia para contarles la buena noticia.',
  gloss: [
    { es: 'la recepcionista', en: 'the receptionist' },
    { es: 'se retrasa', en: 'runs late' },
    { es: 'aliviado', en: 'relieved' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le dice la recepcionista al paciente?', options: ['Que el médico habrá terminado en diez minutos', 'Que el médico no puede atenderlo hoy', 'Que debe volver mañana'], answer: 0 },
    { type: 'mcq', q: '¿Por qué se retrasa siempre el médico?', options: ['Porque dedica tiempo a explicar todo con calma', 'Porque llega tarde a trabajar', 'Porque hay demasiados pacientes'], answer: 0 },
    { type: 'short', q: '¿Cómo son los resultados de las pruebas? (una palabra)', accept: ['buenos'] },
    { type: 'translate', line: 'Aliviado, el paciente sale de la consulta pensando que quizás su cita habrá durado más de lo normal, pero que ha merecido la pena.', model: 'Relieved, the patient leaves the appointment thinking that his visit may have run longer than usual, but that it was worth it.' }
  ]
},

{
  id: 'en-cuanto-hayan-terminado-cosecha', title: 'En cuanto hayan terminado la cosecha', level: 5, theme: 'naturaleza',
  text: 'Los agricultores de la zona desean que, en cuanto hayan terminado la cosecha de este año, los precios del trigo suban un poco tras una temporada especialmente seca. Para cuando llegue octubre, ya habrán recogido casi toda la producción, aunque el rendimiento ha sido menor de lo esperado debido a la falta de lluvias. Uno de los agricultores más veteranos explica que, en cuanto hayan terminado de vender la cosecha, empezarán a planificar el próximo año con cultivos que necesiten menos agua. El gobierno regional ha prometido ayudas económicas para quienes decidan cambiar a técnicas de riego más eficientes. Los agricultores más jóvenes, sin embargo, dudan que esas ayudas lleguen a tiempo para la próxima siembra. Todos coinciden en que, para cuando pase esta crisis, el campo tendrá que adaptarse definitivamente al nuevo clima.',
  gloss: [
    { es: 'la cosecha', en: 'the harvest' },
    { es: 'el rendimiento', en: 'the yield' },
    { es: 'el riego', en: 'irrigation' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué esperan los agricultores que pase con los precios?', options: ['Que suban tras una temporada seca', 'Que bajen mucho', 'Que se mantengan iguales'], answer: 0 },
    { type: 'mcq', q: '¿Qué ha prometido el gobierno regional?', options: ['Ayudas para técnicas de riego más eficientes', 'Bajar los impuestos', 'Comprar toda la cosecha'], answer: 0 },
    { type: 'short', q: '¿Para cuándo habrán recogido casi toda la producción? (una palabra)', accept: ['octubre'] },
    { type: 'translate', line: 'Los agricultores más jóvenes, sin embargo, dudan que esas ayudas lleguen a tiempo para la próxima siembra.', model: 'The younger farmers, however, doubt that this aid will arrive in time for the next planting.' }
  ]
},

{
  id: 'habria-votado-distinto-referendum', title: 'Habría votado distinto, pero no tenía toda la información', level: 5, theme: 'politica',
  text: 'Mi vecino admite ahora que habría votado distinto en el referéndum del año pasado si hubiera tenido toda la información sobre el impacto económico de la nueva ley. En su momento, se dejó llevar por lo que decían sus amigos y por algunos titulares que después resultaron ser exagerados. Yo, en cambio, había investigado bastante antes de votar, así que mi decisión no cambió cuando aparecieron los nuevos datos. Le expliqué que habría sido mejor que se informara con varias fuentes distintas antes de decidir, en lugar de fiarse solo de una opinión. Él reconoce que, con toda la polémica de aquel momento, habría sido difícil mantenerse completamente objetivo. Ahora, antes de cualquier votación importante, dice que se toma más tiempo para leer distintas versiones de la misma noticia.',
  gloss: [
    { es: 'los titulares', en: 'the headlines' },
    { es: 'la polémica', en: 'the controversy' },
    { es: 'fiarse', en: 'to trust, to rely on' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué dice el vecino que habría hecho con más información?', options: ['Habría votado distinto', 'No habría votado', 'Habría cambiado de país'], answer: 0 },
    { type: 'mcq', q: '¿Por qué no cambió la decisión de la narradora?', options: ['Ya había investigado bastante antes de votar', 'No le interesaba el tema', 'Votó por casualidad'], answer: 0 },
    { type: 'short', q: '¿Qué dice ahora que hace antes de votar? (cuatro palabras)', accept: ['leer distintas versiones', 'se toma más tiempo'] },
    { type: 'translate', line: 'Le expliqué que habría sido mejor que se informara con varias fuentes distintas antes de decidir, en lugar de fiarse solo de una opinión.', model: 'I explained to him that it would have been better to inform himself with several different sources before deciding, instead of relying on just one opinion.' }
  ]
},

{
  id: 'dijo-que-habria-invertido-startup', title: 'Dijo que habría invertido si hubiera sabido', level: 5, theme: 'economia',
  text: 'Mi antiguo compañero de universidad me confesó que habría invertido en la empresa de mi hermano si hubiera sabido lo rápido que iba a crecer. Cuando mi hermano le pidió dinero hace cinco años para empezar el negocio, él dijo que prefería esperar a ver cómo evolucionaba antes de arriesgar sus ahorros. La empresa, sin embargo, creció mucho más rápido de lo que nadie esperaba, y hoy factura varios millones al año. Mi hermano, sin rencor, le recuerda entre risas que cualquiera habría dudado en su momento, porque el proyecto entonces parecía muy arriesgado. Mi compañero admite que, en su lugar, cualquier persona sensata habría pedido más garantías antes de invertir. Ahora, dice, presta mucha más atención a las ideas de sus amigos, aunque suenen poco realistas al principio.',
  gloss: [
    { es: 'evolucionaba', en: 'it was evolving' },
    { es: 'factura', en: 'it bills, it makes (in revenue)' },
    { es: 'sin rencor', en: 'without resentment' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué dijo el compañero que habría hecho?', options: ['Habría invertido en la empresa', 'Habría empezado su propio negocio', 'Habría avisado a otros amigos'], answer: 0 },
    { type: 'mcq', q: '¿Cómo le fue a la empresa del hermano?', options: ['Creció mucho más rápido de lo esperado', 'Cerró a los dos años', 'Se mantuvo pequeña'], answer: 0 },
    { type: 'short', q: '¿Cuánto dinero factura ahora la empresa? (dos palabras)', accept: ['varios millones'] },
    { type: 'translate', line: 'Mi compañero admite que, en su lugar, cualquier persona sensata habría pedido más garantías antes de invertir.', model: 'My friend admits that, in his place, any sensible person would have asked for more guarantees before investing.' }
  ]
},

{
  id: 'yo-que-tu-habria-consultado-medico', title: 'Yo que tú, habría consultado antes', level: 5, theme: 'salud',
  text: 'Cuando le conté a mi amiga, que es enfermera, que llevaba semanas tomando un suplemento que encontré recomendado en internet, me miró seria y me dijo: "Yo que tú, habría consultado a un médico antes de tomar nada sin receta." Me explicó que algunos suplementos pueden interactuar de forma peligrosa con otros medicamentos, incluso si parecen completamente naturales. Reconocí que no había investigado mucho, simplemente confié en los comentarios positivos que había leído en una página web. Ella insistió en que, aunque el producto pareciera inofensivo, siempre es mejor pedir opinión profesional antes de empezar un tratamiento nuevo. Al final decidí dejar de tomarlo y pedir cita con mi médico de cabecera para que revisara mi caso. Ahora entiendo que, en temas de salud, más vale prevenir que confiar ciegamente en internet.',
  gloss: [
    { es: 'el suplemento', en: 'the supplement' },
    { es: 'inofensivo', en: 'harmless' },
    { es: 'el médico de cabecera', en: 'the family doctor' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le dijo la amiga enfermera?', options: ['Que yo que tú habría consultado a un médico antes', 'Que el suplemento era muy bueno', 'Que no importaba consultar a nadie'], answer: 0 },
    { type: 'mcq', q: '¿Qué decidió hacer la narradora al final?', options: ['Dejar de tomarlo y pedir cita con su médico', 'Seguir tomándolo de todas formas', 'Comprar más suplementos'], answer: 0 },
    { type: 'short', q: '¿Dónde encontró el suplemento recomendado? (dos palabras)', accept: ['en internet', 'una página web'] },
    { type: 'translate', line: 'Ella insistió en que, aunque el producto pareciera inofensivo, siempre es mejor pedir opinión profesional antes de empezar un tratamiento nuevo.', model: 'She insisted that, even if the product seemed harmless, it is always better to get a professional opinion before starting a new treatment.' }
  ]
},

{
  id: 'dijo-que-habria-cambiado-carrera', title: 'Dijo que habría estudiado otra cosa', level: 5, theme: 'educacion',
  text: 'Mi profesor de historia nos contó un día que, si hubiera podido volver atrás, habría estudiado periodismo en lugar de historia, aunque ama profundamente su trabajo actual. Nos explicó que de joven escribía artículos para el periódico de su instituto y que disfrutaba muchísimo entrevistando a la gente del pueblo. Sus padres, sin embargo, le convencieron de que la historia ofrecía una carrera más estable, con más salidas profesionales seguras. Él siguió su consejo y, con los años, encontró en la enseñanza una forma distinta pero igualmente satisfactoria de contar historias. Aun así, admite que de vez en cuando escribe artículos para un periódico local como pasatiempo. Sus alumnos, al escuchar esto, entendieron mejor por qué sus clases siempre parecen contar una historia en vez de solo dar fechas.',
  gloss: [
    { es: 'las salidas profesionales', en: 'career prospects' },
    { es: 'la enseñanza', en: 'teaching' },
    { es: 'el pasatiempo', en: 'the hobby' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué dijo el profesor que habría estudiado?', options: ['Periodismo', 'Medicina', 'Arte'], answer: 0 },
    { type: 'mcq', q: '¿Por qué le convencieron sus padres de estudiar historia?', options: ['Ofrecía una carrera más estable', 'Era más fácil', 'Pagaban mejor los profesores'], answer: 0 },
    { type: 'short', q: '¿Qué escribe de vez en cuando el profesor? (tres palabras)', accept: ['artículos para un periódico', 'artículos periódico local'] },
    { type: 'translate', line: 'Sus alumnos, al escuchar esto, entendieron mejor por qué sus clases siempre parecen contar una historia en vez de solo dar fechas.', model: 'His students, on hearing this, understood better why his classes always seem to tell a story instead of just giving dates.' }
  ]
},

{
  id: 'yo-que-tu-habria-esperado-museo', title: 'Yo que tú, habría esperado a la nueva sala', level: 5, theme: 'arte',
  text: 'Cuando le dije a mi amiga pintora que había ido al museo el mismo fin de semana que cerraban temporalmente la sala principal, me miró sorprendida y me dijo: "Yo que tú, habría esperado un mes hasta que abrieran la nueva ampliación." Me explicó que el museo llevaba meses anunciando que la nueva sala tendría obras que llevaban décadas guardadas sin exponerse al público. Reconocí que no había leído las noticias culturales últimamente y que había ido sin comprobar el horario ni las novedades. Aun así, disfruté mucho de las salas que sí estaban abiertas, especialmente la de arte contemporáneo local. Mi amiga insistió en que volviéramos juntas cuando abriera la ampliación, para que ella misma pudiera explicarme el significado de cada obra nueva. Prometí acompañarla, esta vez comprobando antes cualquier cambio de última hora.',
  gloss: [
    { es: 'la ampliación', en: 'the extension (of a building)' },
    { es: 'guardadas', en: 'kept, stored' },
    { es: 'exponerse', en: 'to be exhibited' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le dijo la amiga pintora?', options: ['Que yo que tú habría esperado un mes', 'Que el museo era aburrido', 'Que no valía la pena ir'], answer: 0 },
    { type: 'mcq', q: '¿Qué tendrá la nueva sala del museo?', options: ['Obras guardadas durante décadas', 'Solo fotografía moderna', 'Esculturas de otros países'], answer: 0 },
    { type: 'short', q: '¿Qué sala disfrutó especialmente la narradora? (tres palabras)', accept: ['arte contemporáneo local', 'la de arte contemporáneo'] },
    { type: 'translate', line: 'Mi amiga insistió en que volviéramos juntas cuando abriera la ampliación, para que ella misma pudiera explicarme el significado de cada obra nueva.', model: 'My friend insisted that we go back together when the extension opened, so she herself could explain the meaning of each new work to me.' }
  ]
},

{
  id: 'para-cuando-el-satelite-habra-orbitado', title: 'Para entonces, el satélite ya habrá orbitado la Tierra miles de veces', level: 5, theme: 'ciencia',
  text: 'Los científicos del proyecto espacial calculan que, para cuando termine la misión dentro de tres años, el satélite ya habrá orbitado la Tierra varias decenas de miles de veces, recogiendo datos sobre el nivel de los océanos. El equipo, formado por investigadores de cinco países distintos, lleva más de una década preparando esta misión conjunta. Para cuando lleguen los primeros resultados completos, los ingenieros habrán tenido que resolver problemas técnicos que nadie había anticipado, como interferencias inesperadas en las señales. Una de las investigadoras principales explica que, en cuanto hayan analizado los primeros meses de datos, publicarán un informe preliminar para la comunidad científica internacional. Los gobiernos que financian el proyecto esperan que, para cuando concluya la misión, se hayan tomado decisiones más informadas sobre el cambio climático. El equipo trabaja con la convicción de que cada dato recogido puede marcar una diferencia real.',
  gloss: [
    { es: 'orbitado', en: 'orbited' },
    { es: 'las interferencias', en: 'interference' },
    { es: 'preliminar', en: 'preliminary' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué habrá hecho el satélite para cuando termine la misión?', options: ['Habrá orbitado la Tierra miles de veces', 'Se habrá averiado', 'Habrá caído al mar'], answer: 0 },
    { type: 'mcq', q: '¿De cuántos países son los investigadores?', options: ['Cinco', 'Dos', 'Diez'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo llevan preparando la misión? (dos palabras)', accept: ['más de una década', 'una década'] },
    { type: 'translate', line: 'Los gobiernos que financian el proyecto esperan que, para cuando concluya la misión, se hayan tomado decisiones más informadas sobre el cambio climático.', model: 'The governments funding the project hope that, by the time the mission concludes, more informed decisions will have been made about climate change.' }
  ]
}
,
{
  id: 'dolor-muela-a2', title: 'Un dolor de muela', level: 2, theme: 'cuerpo',
  text: 'Anoche me dolía mucho una muela y no pude dormir bien. Por la mañana llamé al dentista y, por suerte, tenía una hora libre a las diez. Cuando llegué, el dentista miró mi boca con cuidado y dijo que tenía una caries pequeña. Me puso una inyección para no sentir dolor y arregló la muela en veinte minutos. Después, me explicó que debía cepillarme los dientes tres veces al día. Salí de la consulta sin dolor y muy contenta.',
  gloss: [
    { es: 'la muela', en: 'the molar' },
    { es: 'una caries', en: 'a cavity' },
    { es: 'la inyección', en: 'the injection' },
    { es: 'cepillarme', en: 'to brush (my teeth)' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué no pudo dormir bien?', options: ['Le dolía una muela', 'Tenía fiebre', 'Hacía mucho calor'], answer: 0 },
    { type: 'mcq', q: '¿Qué le puso el dentista antes de arreglar la muela?', options: ['Una inyección', 'Una venda', 'Nada'], answer: 0 },
    { type: 'short', q: '¿Cuántas veces al día debe cepillarse los dientes? (una palabra)', accept: ['tres'] },
    { type: 'translate', line: 'Salí de la consulta sin dolor y muy contenta.', model: 'I left the appointment without pain and very happy.' }
  ]
},

{
  id: 'espalda-cansada-a2', title: 'La espalda cansada', level: 2, theme: 'cuerpo',
  text: 'Después de mudarnos, me dolía mucho la espalda porque cargué muchas cajas pesadas. Mi pareja me recomendó descansar y no levantar nada más ese día. Por la tarde, me puse hielo en la espalda durante quince minutos y me sentí un poco mejor. Al día siguiente, fui a una clase de estiramientos que organiza el gimnasio del barrio. La profesora nos enseñó a mover el cuerpo despacio y a respirar bien. Ahora hago esos ejercicios cada mañana antes de trabajar.',
  gloss: [
    { es: 'cargué', en: 'I carried' },
    { es: 'el hielo', en: 'ice' },
    { es: 'los estiramientos', en: 'stretches' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué le dolía la espalda?', options: ['Cargó muchas cajas pesadas', 'Durmió mal', 'Hizo mucho deporte'], answer: 0 },
    { type: 'mcq', q: '¿Qué hizo por la tarde para sentirse mejor?', options: ['Se puso hielo en la espalda', 'Tomó una pastilla', 'Se acostó todo el día'], answer: 0 },
    { type: 'short', q: '¿Dónde es la clase de estiramientos? (dos palabras)', accept: ['el gimnasio', 'gimnasio del barrio'] },
    { type: 'translate', line: 'Ahora hago esos ejercicios cada mañana antes de trabajar.', model: 'Now I do those exercises every morning before working.' }
  ]
},

{
  id: 'timido-fiesta-a2', title: 'El chico tímido de la fiesta', level: 2, theme: 'caracter',
  text: 'En la fiesta de cumpleaños de Marta, un chico nuevo se quedó solo en una esquina. Era muy tímido y no hablaba con nadie, aunque parecía simpático. Marta se acercó y le preguntó cómo se llamaba y de dónde era. Poco a poco, el chico empezó a hablar más y contó historias muy divertidas sobre su ciudad. Al final de la noche, ya se reía con todos los invitados. Marta pensó que a veces solo hace falta un poco de paciencia para conocer a alguien.',
  gloss: [
    { es: 'la esquina', en: 'the corner' },
    { es: 'tímido', en: 'shy' },
    { es: 'hace falta', en: 'it takes' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo era el chico nuevo?', options: ['Muy tímido', 'Muy hablador', 'Muy antipático'], answer: 0 },
    { type: 'mcq', q: '¿Qué le preguntó Marta?', options: ['Cómo se llamaba y de dónde era', 'Si quería bailar', 'Su número de teléfono'], answer: 0 },
    { type: 'short', q: '¿Cómo estaba el chico al final de la noche? (una palabra)', accept: ['contento', 'se reía'] },
    { type: 'translate', line: 'Marta pensó que a veces solo hace falta un poco de paciencia para conocer a alguien.', model: 'Marta thought that sometimes it just takes a little patience to get to know someone.' }
  ]
},

{
  id: 'jefa-exigente-a2', title: 'Una jefa muy exigente', level: 2, theme: 'caracter',
  text: 'Mi nueva jefa es muy exigente, pero también es justa con todo el equipo. El primer día, revisó mi trabajo con mucho detalle y me hizo varias preguntas difíciles. Al principio pensé que era demasiado estricta, pero después entendí que solo quería enseñarnos bien. Cuando cometo un error, me lo explica con paciencia en vez de enfadarse. Mis compañeros dicen que, gracias a ella, todos trabajan mejor ahora. Con el tiempo, empecé a admirar su forma de dirigir el equipo.',
  gloss: [
    { es: 'exigente', en: 'demanding' },
    { es: 'estricta', en: 'strict' },
    { es: 'dirigir', en: 'to lead, to manage' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo es la nueva jefa?', options: ['Exigente pero justa', 'Muy antipática', 'Poco organizada'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace la jefa cuando alguien comete un error?', options: ['Lo explica con paciencia', 'Se enfada mucho', 'No dice nada'], answer: 0 },
    { type: 'short', q: '¿Qué piensan los compañeros del equipo ahora? (tres palabras)', accept: ['trabajan mejor ahora', 'todos trabajan mejor'] },
    { type: 'translate', line: 'Con el tiempo, empecé a admirar su forma de dirigir el equipo.', model: 'Over time, I started to admire her way of leading the team.' }
  ]
},

{
  id: 'noticia-television-a2', title: 'Una noticia en la televisión', level: 3, theme: 'medios',
  text: 'Anoche vi una noticia interesante en la televisión sobre un nuevo parque en el centro de la ciudad. El periodista explicó que el ayuntamiento va a construir un parque grande con árboles y una zona de juegos para niños. También mostró imágenes de cómo será el parque terminado. Mis vecinos y yo estamos muy contentos porque ahora no hay ningún parque cerca de nuestras casas. La noticia dijo que las obras empezarán el mes que viene. Espero poder llevar a mis hijos allí pronto.',
  gloss: [
    { es: 'el periodista', en: 'the journalist' },
    { es: 'la zona de juegos', en: 'the play area' },
    { es: 'las obras', en: 'the construction works' }
  ],
  questions: [
    { type: 'mcq', q: '¿Sobre qué fue la noticia?', options: ['Un nuevo parque en el centro', 'Un accidente de tráfico', 'El tiempo de mañana'], answer: 0 },
    { type: 'mcq', q: '¿Qué mostró el periodista?', options: ['Imágenes de cómo será el parque', 'Fotos antiguas de la ciudad', 'Un mapa del metro'], answer: 0 },
    { type: 'short', q: '¿Cuándo empezarán las obras? (tres palabras)', accept: ['el mes que viene', 'mes que viene'] },
    { type: 'translate', line: 'La noticia dijo que las obras empezarán el mes que viene.', model: 'The news said the construction works will start next month.' }
  ]
},

{
  id: 'periodico-local-a2', title: 'El periódico del barrio', level: 3, theme: 'medios',
  text: 'Cada domingo compro el periódico local en el quiosco de la esquina. Me gusta leer las noticias del barrio porque hablan de asuntos que conozco bien. La semana pasada, el periódico publicó un artículo sobre una tienda que va a cerrar después de cuarenta años abierta. Los vecinos han escrito muchas cartas al periódico para expresar su tristeza. El director del periódico dijo que publicará más artículos sobre el tema en las próximas semanas. Creo que es importante apoyar a los periódicos pequeños del barrio.',
  gloss: [
    { es: 'el quiosco', en: 'the newsstand' },
    { es: 'las cartas', en: 'the letters' },
    { es: 'apoyar', en: 'to support' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde compra el periódico la narradora?', options: ['En el quiosco de la esquina', 'En el supermercado', 'Por internet'], answer: 0 },
    { type: 'mcq', q: '¿Sobre qué fue el artículo de la semana pasada?', options: ['Una tienda que va a cerrar', 'Un nuevo restaurante', 'Las elecciones locales'], answer: 0 },
    { type: 'short', q: '¿Cuántos años lleva abierta la tienda? (dos palabras)', accept: ['cuarenta años'] },
    { type: 'translate', line: 'Los vecinos han escrito muchas cartas al periódico para expresar su tristeza.', model: 'The neighbors have written many letters to the newspaper to express their sadness.' }
  ]
},

{
  id: 'cita-banco-a2', title: 'Una cita en el banco', level: 2, theme: 'servicios',
  text: 'Ayer tuve que ir al banco para abrir una cuenta nueva. Pedí cita por internet y me atendieron a la hora exacta, sin esperar mucho. El empleado me explicó todas las opciones y me ayudó a rellenar los papeles necesarios. Le pregunté sobre las comisiones y él respondió con mucha claridad. Al final, salí del banco con mi tarjeta nueva y un folleto con toda la información. Todo el proceso duró menos de media hora.',
  gloss: [
    { es: 'la cuenta', en: 'the (bank) account' },
    { es: 'las comisiones', en: 'the fees' },
    { es: 'el folleto', en: 'the brochure' }
  ],
  questions: [
    { type: 'mcq', q: '¿Para qué fue al banco?', options: ['Para abrir una cuenta nueva', 'Para pedir un préstamo', 'Para cambiar dinero'], answer: 0 },
    { type: 'mcq', q: '¿Cómo pidió la cita?', options: ['Por internet', 'Por teléfono', 'En persona'], answer: 0 },
    { type: 'short', q: '¿Cuánto duró todo el proceso? (tres palabras)', accept: ['menos de media hora', 'media hora'] },
    { type: 'translate', line: 'Le pregunté sobre las comisiones y él respondió con mucha claridad.', model: 'I asked him about the fees and he answered very clearly.' }
  ]
},

{
  id: 'correos-paquete-a2', title: 'Un paquete perdido', level: 3, theme: 'servicios',
  text: 'La semana pasada envié un paquete importante desde la oficina de correos. Pagué un poco más para que llegara rápido, pero después de cinco días todavía no había llegado. Llamé a la oficina y me dijeron que revisarían el problema. Al día siguiente, me informaron que el paquete se había quedado en otra ciudad por error. Por suerte, lo enviaron de nuevo y llegó dos días después sin ningún daño. La empleada me pidió disculpas y me devolvió parte del dinero que pagué.',
  gloss: [
    { es: 'la oficina de correos', en: 'the post office' },
    { es: 'el daño', en: 'the damage' },
    { es: 'pedir disculpas', en: 'to apologize' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pasó con el paquete?', options: ['Se quedó en otra ciudad por error', 'Se rompió', 'Nunca lo enviaron'], answer: 0 },
    { type: 'mcq', q: '¿Qué le devolvió la empleada?', options: ['Parte del dinero', 'El paquete completo', 'Un regalo'], answer: 0 },
    { type: 'short', q: '¿Cuántos días tardó en llegar el paquete al final? (tres palabras)', accept: ['siete días', 'cinco más dos'] },
    { type: 'translate', line: 'Por suerte, lo enviaron de nuevo y llegó dos días después sin ningún daño.', model: 'Luckily, they sent it again and it arrived two days later with no damage.' }
  ]
},

{
  id: 'robot-limpieza-a2', title: 'El robot que limpia solo', level: 2, theme: 'ciencia',
  text: 'Mi hermano compró un pequeño robot que limpia el suelo de la casa. Al principio, no confiaba mucho en la máquina porque parecía muy simple. El robot conoce toda la casa gracias a un mapa que hace la primera vez que funciona. Cada mañana, empieza a limpiar solo mientras mi hermano está en el trabajo. Cuando la batería está baja, vuelve solo a su base para cargarse. Ahora mi hermano dice que no puede vivir sin él.',
  gloss: [
    { es: 'confiaba', en: 'he trusted' },
    { es: 'el mapa', en: 'the map' },
    { es: 'la base', en: 'the (charging) base' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué compró el hermano?', options: ['Un robot que limpia el suelo', 'Un televisor nuevo', 'Un coche eléctrico'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace el robot cuando la batería está baja?', options: ['Vuelve solo a su base', 'Se apaga sin más', 'Pide ayuda'], answer: 0 },
    { type: 'short', q: '¿Cuándo limpia el robot? (tres palabras)', accept: ['cada mañana', 'mientras está trabajo'] },
    { type: 'translate', line: 'Ahora mi hermano dice que no puede vivir sin él.', model: "Now my brother says he can't live without it." }
  ]
},

{
  id: 'app-idiomas-a2', title: 'Una aplicación para aprender idiomas', level: 3, theme: 'ciencia',
  text: 'Hace tres meses empecé a usar una aplicación para aprender francés en mi teléfono. Cada día practico durante quince minutos antes de desayunar. La aplicación corrige mis errores al momento y me muestra qué palabras debo repasar. Al principio me costaba entender la pronunciación, pero ahora reconozco muchas palabras al escucharlas. Mis amigos dicen que he mejorado mucho desde que empecé. La próxima semana viajaré a París y quiero practicar todo lo que he aprendido.',
  gloss: [
    { es: 'repasar', en: 'to review' },
    { es: 'la pronunciación', en: 'the pronunciation' },
    { es: 'reconozco', en: 'I recognize' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué idioma aprende con la aplicación?', options: ['Francés', 'Alemán', 'Italiano'], answer: 0 },
    { type: 'mcq', q: '¿Qué le costaba al principio?', options: ['Entender la pronunciación', 'Escribir las palabras', 'Encontrar tiempo'], answer: 0 },
    { type: 'short', q: '¿Adónde viajará la próxima semana? (una palabra)', accept: ['parís', 'a parís'] },
    { type: 'translate', line: 'La aplicación corrige mis errores al momento y me muestra qué palabras debo repasar.', model: 'The app corrects my mistakes right away and shows me which words I should review.' }
  ]
},

{
  id: 'precio-verduras-a2', title: 'El precio de las verduras', level: 2, theme: 'economia',
  text: 'Esta semana, las verduras del mercado cuestan más que el mes pasado. El vendedor me explicó que la sequía afectó a muchas granjas de la región. Compré menos tomates de lo normal porque quería ahorrar un poco de dinero. Mi vecina me dijo que ella ahora compra verduras congeladas porque son más baratas. Creo que los precios van a bajar pronto, porque a todos nos afecta esta subida. De momento, intento cocinar con lo que tengo en casa.',
  gloss: [
    { es: 'la sequía', en: 'the drought' },
    { es: 'la granja', en: 'the farm' },
    { es: 'congeladas', en: 'frozen' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué subieron los precios de las verduras?', options: ['La sequía afectó a las granjas', 'Hubo una huelga', 'Cerraron el mercado'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace ahora la vecina?', options: ['Compra verduras congeladas', 'No compra verduras', 'Cultiva su propia comida'], answer: 0 },
    { type: 'short', q: '¿Qué compró de menos la narradora? (una palabra)', accept: ['tomates'] },
    { type: 'translate', line: 'Creo que los precios van a bajar pronto, porque a todos nos afecta esta subida.', model: 'I think prices are going to go down soon, because this increase affects all of us.' }
  ]
},

{
  id: 'sueldo-nuevo-a2', title: 'Un aumento de sueldo', level: 3, theme: 'economia',
  text: 'Después de dos años en la empresa, mi jefe me ofreció un aumento de sueldo. Al principio no podía creerlo porque no lo esperaba tan pronto. El aumento no es muy grande, pero significará mucho para mi familia. Con ese dinero extra, podré ahorrar un poco cada mes para las vacaciones de verano. También quiero guardar algo para una emergencia, como me recomendó mi padre. Mi jefe dijo que el aumento empezará a partir del próximo mes.',
  gloss: [
    { es: 'el aumento', en: 'the raise' },
    { es: 'guardar', en: 'to save, to put aside' },
    { es: 'la emergencia', en: 'the emergency' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le ofreció el jefe?', options: ['Un aumento de sueldo', 'Más vacaciones', 'Un ascenso'], answer: 0 },
    { type: 'mcq', q: '¿Para qué quiere ahorrar dinero?', options: ['Para las vacaciones de verano', 'Para comprar un coche', 'Para un viaje de trabajo'], answer: 0 },
    { type: 'short', q: '¿Cuándo empezará el aumento? (tres palabras)', accept: ['el próximo mes', 'próximo mes'] },
    { type: 'translate', line: 'Al principio no podía creerlo porque no lo esperaba tan pronto.', model: "At first I couldn't believe it because I wasn't expecting it so soon." }
  ]
},

{
  id: 'alcalde-nuevo-a2', title: 'El nuevo alcalde', level: 2, theme: 'politica',
  text: 'El mes pasado, el pueblo eligió a un alcalde nuevo después de muchos años con el mismo. Mucha gente votó porque quería cambios en el transporte público. El nuevo alcalde prometió construir más autobuses y mejorar las calles del centro. Algunos vecinos están contentos con la promesa, pero otros creen que no se va a cumplir tan rápido. La semana pasada, el alcalde organizó una reunión para escuchar las opiniones de todos. Ahora esperamos ver si los cambios llegan pronto.',
  gloss: [
    { es: 'el alcalde', en: 'the mayor' },
    { es: 'votó', en: 'voted' },
    { es: 'se cumpla', en: '(that it) will be fulfilled' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué votó mucha gente?', options: ['Quería cambios en el transporte público', 'Quería más impuestos', 'Quería un parque nuevo'], answer: 0 },
    { type: 'mcq', q: '¿Qué organizó el alcalde la semana pasada?', options: ['Una reunión para escuchar opiniones', 'Una fiesta', 'Un partido de fútbol'], answer: 0 },
    { type: 'short', q: '¿Qué prometió mejorar el alcalde? (dos palabras)', accept: ['las calles', 'los autobuses'] },
    { type: 'translate', line: 'Algunos vecinos están contentos con la promesa, pero otros creen que no se va a cumplir tan rápido.', model: 'Some neighbors are happy with the promise, but others think it will not be kept so quickly.' }
  ]
}
,
{
  id: 'museo-arte-a2', title: 'Una visita al museo', level: 2, theme: 'arte',
  text: 'El sábado pasado fui al museo de arte con mi hermana. Vimos varios cuadros de pintores españoles y también una sala nueva de fotografía. A mi hermana le gustó mucho un cuadro grande de un paisaje con montañas y un río. Yo preferí las fotografías en blanco y negro de la ciudad antigua. Compramos dos postales en la tienda del museo antes de salir. Al final del día, decidimos volver otra vez el próximo mes.',
  gloss: [
    { es: 'los pintores', en: 'the painters' },
    { es: 'el paisaje', en: 'the landscape' },
    { es: 'las postales', en: 'the postcards' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le gustó a la hermana?', options: ['Un cuadro de un paisaje', 'Una escultura', 'Un cuadro de animales'], answer: 0 },
    { type: 'mcq', q: '¿Qué prefirió la narradora?', options: ['Las fotografías en blanco y negro', 'Los cuadros modernos', 'Las esculturas'], answer: 0 },
    { type: 'short', q: '¿Qué compraron en la tienda del museo? (una palabra)', accept: ['postales'] },
    { type: 'translate', line: 'Al final del día, decidimos volver otra vez el próximo mes.', model: 'At the end of the day, we decided to come back again next month.' }
  ]
},

{
  id: 'clase-guitarra-a2', title: 'Mi primera clase de guitarra', level: 2, theme: 'arte',
  text: 'Ayer tuve mi primera clase de guitarra en una academia de música cerca de casa. El profesor me enseñó a sujetar el instrumento y a tocar tres acordes básicos. Al principio, mis dedos me dolían un poco porque no estaba acostumbrada a las cuerdas. Practiqué durante media hora antes de cenar y ya podía tocar una canción sencilla. Mi familia me escuchó y todos aplaudieron al final. Espero seguir aprendiendo más canciones cada semana.',
  gloss: [
    { es: 'sujetar', en: 'to hold' },
    { es: 'los acordes', en: 'the chords' },
    { es: 'las cuerdas', en: 'the strings' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué le enseñó el profesor?', options: ['A sujetar el instrumento y tocar acordes', 'A leer música', 'A cantar'], answer: 0 },
    { type: 'mcq', q: '¿Por qué le dolían los dedos?', options: ['No estaba acostumbrada a las cuerdas', 'Tocó demasiado fuerte', 'Se hizo daño antes'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo practicó? (dos palabras)', accept: ['media hora'] },
    { type: 'translate', line: 'Mi familia me escuchó y todos aplaudieron al final.', model: 'My family listened to me and everyone applauded at the end.' }
  ]
},

{
  id: 'boda-religiosa-a2', title: 'Una boda en la iglesia', level: 2, theme: 'religion',
  text: 'El sábado pasado fui a la boda de mi primo en una iglesia muy antigua. La ceremonia duró casi una hora y el cura habló sobre el amor y la paciencia. Muchos invitados lloraron cuando los novios dijeron sus votos delante de todos. Después de la ceremonia, salimos a la plaza y tiramos arroz a la pareja. Por la noche, celebramos con una gran cena y bailamos hasta muy tarde. Fue una boda muy bonita y emocionante.',
  gloss: [
    { es: 'el cura', en: 'the priest' },
    { es: 'los votos', en: 'the vows' },
    { es: 'tiramos arroz', en: 'we threw rice' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde fue la boda?', options: ['En una iglesia antigua', 'En un jardín', 'En un restaurante'], answer: 0 },
    { type: 'mcq', q: '¿Sobre qué habló el cura?', options: ['El amor y la paciencia', 'La familia', 'El trabajo'], answer: 0 },
    { type: 'short', q: '¿Qué tiraron a la pareja? (una palabra)', accept: ['arroz'] },
    { type: 'translate', line: 'Muchos invitados lloraron cuando los novios dijeron sus votos delante de todos.', model: 'Many guests cried when the newlyweds said their vows in front of everyone.' }
  ]
},

{
  id: 'templo-viaje-a2', title: 'Un templo antiguo', level: 3, theme: 'religion',
  text: 'Durante mi viaje a Asia, visité un templo muy antiguo en la montaña. Un monje nos explicó la historia del lugar y las tradiciones de la comunidad. Antes de entrar, tuvimos que quitarnos los zapatos y hablar en voz baja. El silencio del templo me pareció muy especial después de tanto ruido en la ciudad. Compré un pequeño recuerdo para mi abuela, que siempre habla de religión y filosofía. Fue una de las experiencias más tranquilas de todo el viaje.',
  gloss: [
    { es: 'el monje', en: 'the monk' },
    { es: 'en voz baja', en: 'quietly, in a low voice' },
    { es: 'el recuerdo', en: 'the souvenir' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué tuvieron que hacer antes de entrar?', options: ['Quitarse los zapatos', 'Pagar una entrada', 'Esperar una hora'], answer: 0 },
    { type: 'mcq', q: '¿Qué compró para su abuela?', options: ['Un pequeño recuerdo', 'Un libro', 'Ropa tradicional'], answer: 0 },
    { type: 'short', q: '¿Quién les explicó la historia del templo? (una palabra)', accept: ['un monje', 'monje'] },
    { type: 'translate', line: 'El silencio del templo me pareció muy especial después de tanto ruido en la ciudad.', model: 'The silence of the temple seemed very special to me after so much noise in the city.' }
  ]
},

{
  id: 'perro-perdido-a2', title: 'El perro perdido', level: 2, theme: 'naturaleza',
  text: 'Ayer por la tarde, un perro pequeño apareció en nuestro jardín sin dueño. Le dimos agua y un poco de comida mientras pensábamos qué hacer. Mi hijo hizo carteles con una foto del perro y los puso por todo el barrio. Dos días después, una vecina llamó porque reconoció al perro en uno de los carteles. La familia del perro vino a buscarlo y nos dieron las gracias muchas veces. Mi hijo estaba un poco triste, pero contento de haber ayudado.',
  gloss: [
    { es: 'sin dueño', en: 'without an owner' },
    { es: 'los carteles', en: 'the posters' },
    { es: 'reconoció', en: 'recognized' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde apareció el perro?', options: ['En el jardín', 'En la calle', 'En el parque'], answer: 0 },
    { type: 'mcq', q: '¿Qué hizo el hijo?', options: ['Hizo carteles con una foto', 'Llamó a la policía', 'Se quedó con el perro'], answer: 0 },
    { type: 'short', q: '¿Cuándo llamó la vecina? (tres palabras)', accept: ['dos días después'] },
    { type: 'translate', line: 'La familia del perro vino a buscarlo y nos dieron las gracias muchas veces.', model: "The dog's family came to get him and thanked us many times." }
  ]
},

{
  id: 'tormenta-noche-a2', title: 'Una tormenta por la noche', level: 2, theme: 'naturaleza',
  text: 'Anoche hubo una tormenta muy fuerte con mucho viento y lluvia. Los truenos eran tan fuertes que mi hija pequeña se despertó asustada. La abracé y le expliqué que las tormentas no duran mucho tiempo. Nos sentamos juntas cerca de la ventana y contamos los segundos entre el rayo y el trueno. Poco a poco, la tormenta se alejó y mi hija se durmió otra vez. Por la mañana, el cielo estaba limpio y el jardín olía a lluvia.',
  gloss: [
    { es: 'los truenos', en: 'the thunder' },
    { es: 'asustada', en: 'scared' },
    { es: 'el rayo', en: 'the lightning' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué se despertó la hija?', options: ['Los truenos eran muy fuertes', 'Tenía una pesadilla', 'Hacía mucho calor'], answer: 0 },
    { type: 'mcq', q: '¿Qué hicieron juntas cerca de la ventana?', options: ['Contaron los segundos entre el rayo y el trueno', 'Leyeron un cuento', 'Cantaron canciones'], answer: 0 },
    { type: 'short', q: '¿Cómo estaba el cielo por la mañana? (una palabra)', accept: ['limpio'] },
    { type: 'translate', line: 'Poco a poco, la tormenta se alejó y mi hija se durmió otra vez.', model: 'Little by little, the storm moved away and my daughter fell asleep again.' }
  ]
},

{
  id: 'primera-cita-a2', title: 'Nuestra primera cita', level: 2, theme: 'relaciones',
  text: 'Hace dos años, conocí a mi pareja en la boda de un amigo común. Hablamos toda la noche y, al final, me pidió mi número de teléfono. Una semana después, quedamos para tomar un café en el centro de la ciudad. Estaba muy nerviosa, pero la conversación fue fácil desde el primer minuto. Después del café, caminamos por el parque durante casi dos horas. Aquella tarde supe que quería seguir conociendo a esa persona.',
  gloss: [
    { es: 'un amigo común', en: 'a mutual friend' },
    { es: 'quedamos', en: 'we arranged to meet' },
    { es: 'aquella tarde', en: 'that afternoon' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde se conocieron?', options: ['En la boda de un amigo común', 'En el trabajo', 'En la universidad'], answer: 0 },
    { type: 'mcq', q: '¿Qué hicieron después del café?', options: ['Caminaron por el parque', 'Fueron al cine', 'Cenaron juntos'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo caminaron por el parque? (tres palabras)', accept: ['casi dos horas'] },
    { type: 'translate', line: 'Aquella tarde supe que quería seguir conociendo a esa persona.', model: 'That afternoon I knew I wanted to keep getting to know that person.' }
  ]
},

{
  id: 'abuela-recetas-a2', title: 'Las recetas de mi abuela', level: 3, theme: 'identidad',
  text: 'Cuando era pequeña, pasaba muchas tardes en la cocina con mi abuela. Ella me enseñaba a preparar platos que había aprendido de su propia madre. Nunca escribía las cantidades exactas porque decía que la cocina se aprende con las manos. El año pasado decidí escribir sus recetas en un cuaderno antes de que se olvidaran. Ahora cocino esos platos para mi propia familia y siento que ella sigue presente. Creo que la comida guarda una parte importante de quiénes somos.',
  gloss: [
    { es: 'las cantidades', en: 'the quantities' },
    { es: 'el cuaderno', en: 'the notebook' },
    { es: 'presente', en: 'present' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué decidió hacer el año pasado?', options: ['Escribir las recetas en un cuaderno', 'Abrir un restaurante', 'Viajar con su abuela'], answer: 0 },
    { type: 'mcq', q: '¿Por qué no escribía la abuela las cantidades?', options: ['Decía que se aprende con las manos', 'No sabía escribir', 'No le gustaba compartir recetas'], answer: 0 },
    { type: 'short', q: '¿De quién aprendió la abuela sus recetas? (dos palabras)', accept: ['su madre', 'de su madre'] },
    { type: 'translate', line: 'Creo que la comida guarda una parte importante de quiénes somos.', model: 'I think food holds an important part of who we are.' }
  ]
},

{
  id: 'primer-piso-solo-a2', title: 'Mi primer piso solo', level: 2, theme: 'vivienda',
  text: 'El mes pasado me mudé a mi primer piso completamente solo. Al principio, la casa vacía me pareció un poco extraña sin ruido de nadie más. Compré muebles poco a poco porque no quería gastar todo el dinero de golpe. Mis padres me regalaron una mesa vieja que tenían guardada en su casa. Cada fin de semana, invito a mis amigos a cenar para tener más ambiente en casa. Ahora ya me siento como en casa de verdad.',
  gloss: [
    { es: 'vacía', en: 'empty' },
    { es: 'de golpe', en: 'all at once' },
    { es: 'guardada', en: 'stored, kept' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué compró muebles poco a poco?', options: ['No quería gastar todo el dinero de golpe', 'No tenía tiempo', 'No le gustaban los muebles nuevos'], answer: 0 },
    { type: 'mcq', q: '¿Qué le regalaron sus padres?', options: ['Una mesa vieja', 'Un sofá', 'Una televisión'], answer: 0 },
    { type: 'short', q: '¿Qué hace cada fin de semana? (tres palabras)', accept: ['invita a amigos', 'invita amigos cenar'] },
    { type: 'translate', line: 'Ahora ya me siento como en casa de verdad.', model: 'Now I already feel truly at home.' }
  ]
},

{
  id: 'examen-conducir-a2', title: 'El examen de conducir', level: 3, theme: 'educacion',
  text: 'La semana pasada hice mi examen de conducir por segunda vez. La primera vez, me puse muy nerviosa y cometí varios errores pequeños. Esta vez, practiqué mucho más con mi padre los fines de semana. El examinador me pidió aparcar el coche entre dos líneas, algo que siempre me costaba. Por suerte, esta vez lo hice bien y aprobé el examen sin problemas. Ahora podré conducir sola y ya no dependeré tanto de mis padres.',
  gloss: [
    { es: 'el examinador', en: 'the examiner' },
    { es: 'aparcar', en: 'to park' },
    { es: 'dependeré', en: 'I will depend' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué pasó la primera vez que hizo el examen?', options: ['Cometió varios errores pequeños', 'No se presentó', 'Aprobó fácilmente'], answer: 0 },
    { type: 'mcq', q: '¿Con quién practicó los fines de semana?', options: ['Con su padre', 'Con una amiga', 'Con un profesor privado'], answer: 0 },
    { type: 'short', q: '¿Qué le costaba siempre? (una palabra)', accept: ['aparcar'] },
    { type: 'translate', line: 'Ahora podré conducir sola y ya no dependeré tanto de mis padres.', model: 'Now I will be able to drive alone and I will no longer depend so much on my parents.' }
  ]
},

{
  id: 'compra-online-a2', title: 'Una compra por internet', level: 2, theme: 'compras',
  text: 'La semana pasada compré unos zapatos nuevos por internet. Elegí mi talla habitual, pero cuando llegó el paquete, los zapatos me quedaban pequeños. Escribí a la tienda para pedir un cambio de talla y me respondieron el mismo día. Me explicaron que podía devolver los zapatos gratis en cualquier oficina de correos. Envié el paquete de vuelta y, cinco días después, recibí el par correcto. En general, quedé muy contenta con el servicio de la tienda.',
  gloss: [
    { es: 'la talla', en: 'the size' },
    { es: 'el cambio', en: 'the exchange' },
    { es: 'devolver', en: 'to return' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué problema tuvo con los zapatos?', options: ['Le quedaban pequeños', 'Eran de otro color', 'Llegaron rotos'], answer: 0 },
    { type: 'mcq', q: '¿Dónde podía devolver los zapatos?', options: ['En cualquier oficina de correos', 'Solo en la tienda física', 'No podía devolverlos'], answer: 0 },
    { type: 'short', q: '¿Cuántos días tardó en recibir el par correcto? (una palabra)', accept: ['cinco'] },
    { type: 'translate', line: 'En general, quedé muy contenta con el servicio de la tienda.', model: 'In general, I was very happy with the store\'s service.' }
  ]
},

{
  id: 'cena-vegetariana-a2', title: 'Una cena vegetariana', level: 2, theme: 'alimentacion',
  text: 'El viernes pasado invité a unos amigos a cenar y decidí cocinar solo platos vegetarianos. Uno de mis amigos no come carne desde hace varios años, así que preparé la cena pensando en él. Preparé una sopa de verduras, un plato de arroz con champiñones y una ensalada grande. Todos probaron los platos y, para mi sorpresa, les gustó mucho la comida. Un amigo incluso pidió la receta de la sopa para hacerla en su casa. Creo que voy a cocinar así más a menudo.',
  gloss: [
    { es: 'los champiñones', en: 'the mushrooms' },
    { es: 'la receta', en: 'the recipe' },
    { es: 'a menudo', en: 'often' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué cocinó solo platos vegetarianos?', options: ['Un amigo no come carne', 'No tenía carne en casa', 'Era más barato'], answer: 0 },
    { type: 'mcq', q: '¿Qué pidió un amigo?', options: ['La receta de la sopa', 'Más ensalada', 'El postre'], answer: 0 },
    { type: 'short', q: '¿Qué preparó con champiñones? (una palabra)', accept: ['arroz'] },
    { type: 'translate', line: 'Todos probaron los platos y, para mi sorpresa, les gustó mucho la comida.', model: 'Everyone tried the dishes and, to my surprise, they really liked the food.' }
  ]
},

{
  id: 'gripe-invierno-a2', title: 'La gripe de invierno', level: 2, theme: 'salud',
  text: 'La semana pasada tuve la gripe y no pude ir a trabajar durante tres días. Al principio solo tenía un poco de dolor de garganta, pero después me subió la fiebre. Mi madre me trajo una sopa recién hecha y me dijo que debía descansar todo lo posible. Tomé la medicina que me recetó el médico dos veces al día. Poco a poco, la fiebre bajó y empecé a sentirme mejor. El fin de semana ya pude salir a caminar un poco por el barrio.',
  gloss: [
    { es: 'la garganta', en: 'the throat' },
    { es: 'la fiebre', en: 'the fever' },
    { es: 'recetó', en: 'prescribed' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuántos días no pudo trabajar?', options: ['Tres días', 'Una semana', 'Un día'], answer: 0 },
    { type: 'mcq', q: '¿Qué le trajo su madre?', options: ['Sopa caliente', 'Medicina extra', 'Fruta'], answer: 0 },
    { type: 'short', q: '¿Cuántas veces al día tomó la medicina? (dos palabras)', accept: ['dos veces'] },
    { type: 'translate', line: 'El fin de semana ya pude salir a caminar un poco por el barrio.', model: 'By the weekend I was already able to go out and walk a little around the neighborhood.' }
  ]
}
,
{
  id: 'aeropuerto-retraso-a2', title: 'Un retraso en el aeropuerto', level: 2, theme: 'viajes',
  text: 'El mes pasado viajamos a Portugal y nuestro vuelo se retrasó tres horas. Al principio no sabíamos por qué, pero después anunciaron un problema técnico en el avión. Mis hijos se aburrieron mucho esperando en la sala del aeropuerto. Compramos unos libros en la tienda y jugamos varios juegos para pasar el tiempo. Finalmente, el avión despegó y llegamos a Lisboa ya de noche. A pesar del retraso, disfrutamos mucho de las vacaciones.',
  gloss: [
    { es: 'se retrasó', en: 'was delayed' },
    { es: 'despegó', en: 'took off' },
    { es: 'a pesar de', en: 'despite' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuánto se retrasó el vuelo?', options: ['Tres horas', 'Una hora', 'Todo el día'], answer: 0 },
    { type: 'mcq', q: '¿Qué hicieron para pasar el tiempo?', options: ['Compraron libros y jugaron', 'Durmieron en el suelo', 'Se quejaron con el personal'], answer: 0 },
    { type: 'short', q: '¿A qué ciudad llegaron? (una palabra)', accept: ['lisboa'] },
    { type: 'translate', line: 'A pesar del retraso, disfrutamos mucho de las vacaciones.', model: 'Despite the delay, we enjoyed the vacation a lot.' }
  ]
},

{
  id: 'hotel-vista-mar-a2', title: 'Un hotel con vistas al mar', level: 3, theme: 'viajes',
  text: 'Para nuestro aniversario, reservamos un hotel pequeño frente al mar. La habitación era sencilla, pero tenía un balcón enorme donde desayunábamos cada mañana. El primer día, caminamos por la playa y comimos pescado fresco en un restaurante local. El dueño del hotel nos recomendó una ruta poco conocida por los acantilados cercanos. Caminaremos esa ruta mañana temprano, cuando todavía no hace demasiado calor. Ha sido, sin duda, uno de los viajes más bonitos que hemos hecho juntos.',
  gloss: [
    { es: 'el balcón', en: 'the balcony' },
    { es: 'los acantilados', en: 'the cliffs' },
    { es: 'sin duda', en: 'without a doubt' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué tenía la habitación?', options: ['Un balcón enorme', 'Una piscina privada', 'Una cocina'], answer: 0 },
    { type: 'mcq', q: '¿Qué les recomendó el dueño?', options: ['Una ruta por los acantilados', 'Un restaurante caro', 'Una excursión en barco'], answer: 0 },
    { type: 'short', q: '¿Cuándo caminarán la ruta? (dos palabras)', accept: ['mañana temprano'] },
    { type: 'translate', line: 'Ha sido, sin duda, uno de los viajes más bonitos que hemos hecho juntos.', model: 'It has been, without a doubt, one of the loveliest trips we have taken together.' }
  ]
},

{
  id: 'reunion-antiguos-companeros-a2', title: 'Una reunión de antiguos compañeros', level: 2, theme: 'relaciones',
  text: 'El sábado pasado organicé una cena con mis antiguos compañeros de instituto. No nos veíamos desde hace más de diez años y algunos casi no los reconocí. Hablamos durante horas sobre lo que había hecho cada uno con su vida. Un compañero ahora vive en otro país y trabaja como profesor de español. Otra compañera se casó el año pasado y espera su primer hijo. Al final de la noche, prometimos no esperar tanto tiempo para vernos otra vez.',
  gloss: [
    { es: 'el instituto', en: 'high school' },
    { es: 'reconocí', en: 'I recognized' },
    { es: 'espera', en: 'is expecting' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuánto tiempo hacía que no se veían?', options: ['Más de diez años', 'Cinco años', 'Un año'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace ahora un compañero?', options: ['Trabaja como profesor de español', 'Es médico', 'Vive en el mismo barrio'], answer: 0 },
    { type: 'short', q: '¿Qué esperó una compañera el año pasado? (una palabra)', accept: ['casarse', 'un hijo'] },
    { type: 'translate', line: 'Al final de la noche, prometimos no esperar tanto tiempo para vernos otra vez.', model: 'At the end of the night, we promised not to wait so long to see each other again.' }
  ]
},

{
  id: 'nuevo-sobrino-a2', title: 'La llegada de mi sobrino', level: 2, theme: 'relaciones',
  text: 'Hace dos semanas nació mi primer sobrino y toda la familia está muy feliz. Fui al hospital el mismo día para conocerlo y llevé un regalo pequeño. Mi hermana estaba cansada, pero muy contenta con su nuevo hijo. El bebé duerme casi todo el día y solo llora cuando tiene hambre. El próximo fin de semana, toda la familia se reunirá en casa de mis padres para celebrarlo. No puedo esperar a verlo crecer poco a poco.',
  gloss: [
    { es: 'el sobrino', en: 'the nephew' },
    { es: 'el bebé', en: 'the baby' },
    { es: 'celebrarlo', en: 'to celebrate it' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cuándo nació el sobrino?', options: ['Hace dos semanas', 'Ayer', 'El mes pasado'], answer: 0 },
    { type: 'mcq', q: '¿Cuándo llora el bebé?', options: ['Cuando tiene hambre', 'Todo el tiempo', 'Solo por la noche'], answer: 0 },
    { type: 'short', q: '¿Dónde se reunirá la familia este fin de semana? (tres palabras)', accept: ['casa de mis padres', 'en casa de padres'] },
    { type: 'translate', line: 'No puedo esperar a verlo crecer poco a poco.', model: "I can't wait to see him grow up little by little." }
  ]
},

{
  id: 'entrenador-equipo-a2', title: 'El nuevo entrenador del equipo', level: 3, theme: 'ocio',
  text: 'Ahora mismo, el equipo de fútbol de mi hijo tiene un entrenador nuevo. Al principio, los niños estaban un poco nerviosos porque el entrenador anterior era muy querido. Sin embargo, el nuevo entrenador organiza los entrenamientos de forma diferente y más divertida. Cada semana, enseña una técnica nueva y deja tiempo para jugar partidos cortos. Mi hijo dice que ha aprendido más en las últimas semanas que en todo el año pasado. El sábado jugarán su primer partido con el nuevo entrenador.',
  gloss: [
    { es: 'el entrenador', en: 'the coach' },
    { es: 'querido', en: 'well-liked' },
    { es: 'los entrenamientos', en: 'the training sessions' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué estaban nerviosos los niños al principio?', options: ['El entrenador anterior era muy querido', 'El equipo perdió muchos partidos', 'Cambiaron de campo'], answer: 0 },
    { type: 'mcq', q: '¿Qué hace el nuevo entrenador cada semana?', options: ['Enseña una técnica nueva', 'Cambia a los jugadores', 'Cancela el entrenamiento'], answer: 0 },
    { type: 'short', q: '¿Cuándo jugarán su primer partido? (una palabra)', accept: ['sábado', 'el sábado'] },
    { type: 'translate', line: 'Mi hijo dice que ha aprendido más en las últimas semanas que en todo el año pasado.', model: 'My son says he has learned more in the last few weeks than in all of last year.' }
  ]
},

{
  id: 'club-lectura-a2', title: 'Mi club de lectura', level: 2, theme: 'ocio',
  text: 'Hace seis meses me apunté a un club de lectura en la biblioteca del barrio. Cada mes leemos un libro diferente y después nos reunimos para hablar de él. Al principio me daba un poco de vergüenza opinar delante de tanta gente. Ahora ya conozco a todos y espero con ganas la reunión cada mes. El mes pasado leímos una novela histórica que me gustó mucho. Ahora vamos a leer un libro de un autor sudamericano.',
  gloss: [
    { es: 'me apunté', en: 'I signed up' },
    { es: 'vergüenza', en: 'embarrassment' },
    { es: 'sudamericano', en: 'South American' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde es el club de lectura?', options: ['En la biblioteca del barrio', 'En una librería', 'En su casa'], answer: 0 },
    { type: 'mcq', q: '¿Qué sintió al principio?', options: ['Un poco de vergüenza', 'Mucho aburrimiento', 'Miedo'], answer: 0 },
    { type: 'short', q: '¿Qué leyeron el mes pasado? (dos palabras)', accept: ['novela histórica'] },
    { type: 'translate', line: 'Ahora ya conozco a todos y espero con ganas la reunión cada mes.', model: 'Now I already know everyone and I look forward to the meeting every month.' }
  ]
},

{
  id: 'primer-dia-universidad-a2', title: 'Mi primer día en la universidad', level: 2, theme: 'educacion',
  text: 'Hoy fue mi primer día en la universidad y estaba muy nerviosa. No conocía a nadie en mi clase de biología, así que me senté sola al principio. Una compañera se acercó y me preguntó si podía sentarse a mi lado. Hablamos durante toda la clase y descubrimos que vivimos en el mismo barrio. Después de clase, fuimos juntas a la cafetería para tomar algo. Creo que hoy hice mi primera amiga de la universidad.',
  gloss: [
    { es: 'la biología', en: 'biology' },
    { es: 'se acercó', en: 'came over' },
    { es: 'la cafetería', en: 'the cafeteria' }
  ],
  questions: [
    { type: 'mcq', q: '¿Cómo se sentía el primer día?', options: ['Muy nerviosa', 'Muy tranquila', 'Aburrida'], answer: 0 },
    { type: 'mcq', q: '¿Qué descubrieron las dos compañeras?', options: ['Que viven en el mismo barrio', 'Que tienen el mismo profesor favorito', 'Que estudian lo mismo'], answer: 0 },
    { type: 'short', q: '¿Adónde fueron después de clase? (una palabra)', accept: ['cafetería', 'a la cafetería'] },
    { type: 'translate', line: 'Creo que hoy hice mi primera amiga de la universidad.', model: 'I think today I made my first friend at university.' }
  ]
},

{
  id: 'beca-estudios-a2', title: 'Una beca para estudiar fuera', level: 3, theme: 'educacion',
  text: 'El año pasado pedí una beca para estudiar un semestre en otro país. El proceso fue largo: tuve que escribir una carta, conseguir buenas notas y esperar varios meses. Cuando recibí la noticia de que había ganado la beca, llamé a mis padres inmediatamente. El próximo semestre viajaré a Alemania para estudiar ingeniería en una universidad nueva. Todavía no hablo alemán muy bien, así que empezaré clases el mes que viene. Estoy nerviosa, pero también muy emocionada por esta oportunidad.',
  gloss: [
    { es: 'la beca', en: 'the scholarship' },
    { es: 'las notas', en: 'the grades' },
    { es: 'la oportunidad', en: 'the opportunity' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué tuvo que hacer para pedir la beca?', options: ['Escribir una carta y conseguir buenas notas', 'Pagar una matrícula', 'Aprobar un examen de idiomas'], answer: 0 },
    { type: 'mcq', q: '¿Adónde viajará el próximo semestre?', options: ['A Alemania', 'A Francia', 'A Italia'], answer: 0 },
    { type: 'short', q: '¿Qué estudiará allí? (una palabra)', accept: ['ingeniería'] },
    { type: 'translate', line: 'Estoy nerviosa, pero también muy emocionada por esta oportunidad.', model: 'I am nervous, but also very excited about this opportunity.' }
  ]
},

{
  id: 'entrevista-radio-a2', title: 'Una entrevista en la radio', level: 3, theme: 'medios',
  text: 'La semana pasada me invitaron a hablar en un programa de radio local sobre mi trabajo. Estaba muy nerviosa porque nunca había hablado en la radio antes. El presentador me hizo preguntas sencillas sobre mi negocio y mis planes futuros. Después del programa, varias personas me escribieron porque habían escuchado la entrevista. Algunos incluso vinieron a mi tienda esa misma semana. Creo que fue una experiencia muy buena para dar a conocer mi trabajo.',
  gloss: [
    { es: 'el presentador', en: 'the host' },
    { es: 'el negocio', en: 'the business' },
    { es: 'dar a conocer', en: 'to make known' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué estaba nerviosa?', options: ['Nunca había hablado en la radio antes', 'No sabía qué decir', 'No le gustaba hablar en público'], answer: 0 },
    { type: 'mcq', q: '¿Qué hicieron algunas personas después del programa?', options: ['Vinieron a su tienda', 'Le escribieron cartas', 'La llamaron por teléfono'], answer: 0 },
    { type: 'short', q: '¿Sobre qué le preguntó el presentador? (dos palabras)', accept: ['su negocio', 'planes futuros'] },
    { type: 'translate', line: 'Creo que fue una experiencia muy buena para dar a conocer mi trabajo.', model: 'I think it was a very good experience to make my work known.' }
  ]
},

{
  id: 'reforma-cocina-a2', title: 'La reforma de la cocina', level: 3, theme: 'vivienda',
  text: 'Hace un mes empezamos una reforma pequeña en la cocina de casa. Los obreros llegaron temprano cada día y trabajaron con mucho cuidado. Al principio, comíamos en el salón porque la cocina estaba llena de polvo y herramientas. La reforma costó más de lo que esperábamos, pero el resultado final vale la pena. Cambiamos los muebles antiguos por otros más modernos y pintamos las paredes de blanco. La semana que viene invitaremos a nuestros amigos a ver la cocina nueva.',
  gloss: [
    { es: 'los obreros', en: 'the workers' },
    { es: 'el polvo', en: 'the dust' },
    { es: 'vale la pena', en: 'is worth it' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde comían mientras duraba la reforma?', options: ['En el salón', 'En un restaurante', 'En casa de un vecino'], answer: 0 },
    { type: 'mcq', q: '¿De qué color pintaron las paredes?', options: ['Blanco', 'Azul', 'Gris'], answer: 0 },
    { type: 'short', q: '¿Qué costó más de lo esperado? (una palabra)', accept: ['la reforma', 'reforma'] },
    { type: 'translate', line: 'La reforma costó más de lo que esperábamos, pero el resultado final vale la pena.', model: 'The renovation cost more than we expected, but the final result is worth it.' }
  ]
},

{
  id: 'huerto-comunitario-a2', title: 'Un huerto comunitario', level: 2, theme: 'naturaleza',
  text: 'Hace poco, los vecinos de mi calle decidimos crear un huerto comunitario en un terreno vacío. Cada familia cuida una pequeña parte y plantamos verduras y hierbas diferentes. Los sábados por la mañana, varios vecinos se reúnen para regar las plantas juntos. Mi hija de siete años ahora sabe reconocer varias verduras solo por sus hojas. La semana pasada cosechamos los primeros tomates y los compartimos entre todos. El huerto ha unido mucho más a los vecinos de la calle.',
  gloss: [
    { es: 'el huerto', en: 'the (vegetable) garden' },
    { es: 'el terreno', en: 'the plot of land' },
    { es: 'cosechamos', en: 'we harvested' }
  ],
  questions: [
    { type: 'mcq', q: '¿Dónde crearon el huerto?', options: ['En un terreno vacío', 'En el parque', 'Detrás de la escuela'], answer: 0 },
    { type: 'mcq', q: '¿Qué hacen los vecinos los sábados?', options: ['Riegan las plantas juntos', 'Venden verduras', 'Limpian la calle'], answer: 0 },
    { type: 'short', q: '¿Qué cosecharon la semana pasada? (una palabra)', accept: ['tomates'] },
    { type: 'translate', line: 'El huerto ha unido mucho más a los vecinos de la calle.', model: 'The garden has brought the neighbors on the street much closer together.' }
  ]
},

{
  id: 'sequia-campo-a2', title: 'La sequía en el campo', level: 3, theme: 'naturaleza',
  text: 'Ha sido un verano muy seco y los agricultores de la zona están preocupados. Mi tío, que tiene un pequeño huerto, dice que nunca había visto tan poca lluvia en junio. El gobierno prometió ayuda económica para los agricultores más afectados por la sequía. Mientras tanto, muchos vecinos han empezado a usar menos agua en casa para ayudar. Los meteorólogos creen que va a llover más en las próximas semanas. Todos en el pueblo hablan del tema cada vez que se encuentran.',
  gloss: [
    { es: 'la sequía', en: 'the drought' },
    { es: 'los agricultores', en: 'the farmers' },
    { es: 'los meteorólogos', en: 'the meteorologists' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué prometió el gobierno?', options: ['Ayuda económica para los agricultores', 'Construir un pantano nuevo', 'Bajar los impuestos'], answer: 0 },
    { type: 'mcq', q: '¿Qué han empezado a hacer muchos vecinos?', options: ['Usar menos agua en casa', 'Mudarse a otra ciudad', 'Comprar agua embotellada'], answer: 0 },
    { type: 'short', q: '¿Qué tiene el tío de la narradora? (dos palabras)', accept: ['un huerto', 'pequeño huerto'] },
    { type: 'translate', line: 'Mi tío, que tiene un pequeño huerto, dice que nunca había visto tan poca lluvia en junio.', model: 'My uncle, who has a small vegetable garden, says he had never seen so little rain in June.' }
  ]
},

{
  id: 'empresa-quiebra-a2', title: 'Una empresa en dificultades', level: 3, theme: 'economia',
  text: 'La empresa donde trabaja mi vecino ha tenido problemas económicos durante los últimos meses. Las ventas bajaron mucho después de que un competidor grande abrió cerca de la fábrica. El director explicó a todos los empleados la situación en una reunión larga. Algunos compañeros de mi vecino perdieron su trabajo, pero él pudo quedarse con un sueldo menor. La empresa espera recuperarse el próximo año con un plan nuevo de ventas. Mi vecino dice que, de momento, prefiere tener un trabajo aunque gana menos dinero.',
  gloss: [
    { es: 'el competidor', en: 'the competitor' },
    { es: 'el sueldo', en: 'the salary' },
    { es: 'recuperarse', en: 'to recover' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué bajaron las ventas?', options: ['Un competidor grande abrió cerca', 'Subieron los precios', 'Cerraron una tienda'], answer: 0 },
    { type: 'mcq', q: '¿Qué le pasó al vecino?', options: ['Se quedó con un sueldo menor', 'Perdió su trabajo', 'Lo ascendieron'], answer: 0 },
    { type: 'short', q: '¿Cuándo espera recuperarse la empresa? (tres palabras)', accept: ['el próximo año', 'próximo año'] },
    { type: 'translate', line: 'Mi vecino dice que, de momento, prefiere tener un trabajo aunque gana menos dinero.', model: 'My neighbor says that, for now, he prefers to have a job even if he earns less money.' }
  ]
},

{
  id: 'debate-parque-a2', title: 'Un debate sobre el parque', level: 3, theme: 'politica',
  text: 'El ayuntamiento organizó una reunión pública para hablar sobre el futuro de un terreno vacío del barrio. Algunos vecinos quieren un parque con árboles y bancos, mientras que otros prefieren un aparcamiento nuevo. Durante la reunión, cada persona tuvo dos minutos para dar su opinión frente a todos. Una vecina mayor explicó que el barrio necesita más zonas verdes para los niños y los mayores. Al final, el ayuntamiento prometió estudiar las dos opciones antes de decidir. La próxima reunión será dentro de un mes.',
  gloss: [
    { es: 'el ayuntamiento', en: 'the city council' },
    { es: 'el aparcamiento', en: 'the parking lot' },
    { es: 'las zonas verdes', en: 'green spaces' }
  ],
  questions: [
    { type: 'mcq', q: '¿Para qué organizó el ayuntamiento la reunión?', options: ['Para hablar del futuro de un terreno vacío', 'Para hablar de impuestos', 'Para presentar al nuevo alcalde'], answer: 0 },
    { type: 'mcq', q: '¿Qué explicó la vecina mayor?', options: ['Que el barrio necesita más zonas verdes', 'Que faltan aparcamientos', 'Que el terreno es peligroso'], answer: 0 },
    { type: 'short', q: '¿Cuánto tiempo tuvo cada persona para opinar? (dos palabras)', accept: ['dos minutos'] },
    { type: 'translate', line: 'Al final, el ayuntamiento prometió estudiar las dos opciones antes de decidir.', model: 'In the end, the city council promised to study both options before deciding.' }
  ]
},

/* ============================================================================
 * B2 passages — 200-300 words, Spanish-definition glossary, mcq testing
 * inference/attitude. Batch 1 of 8 (WORKLIST.md § passages).
 * ========================================================================== */
{
  id: 'rescate-lince-naturaleza-b2', title: 'El lince que nadie esperaba encontrar', level: 6, theme: 'naturaleza',
  text: 'Nunca había visto un lince ibérico en libertad hasta aquella mañana de octubre, y no fue precisamente en las montañas donde llevaba semanas buscándolo. Trabajo como guardabosques en un parque natural de Andalucía, y llevaba tres años sin registrar ni un solo avistamiento confirmado en mi zona. La especie estuvo a punto de desaparecer hace dos décadas, cuando apenas quedaban un centenar de ejemplares en toda la península.\n\nAquel día había salido temprano para revisar unas cámaras trampa colocadas cerca de un arroyo, sin ninguna expectativa especial. Al acercarme, algo se movió entre la maleza; me quedé completamente inmóvil, convencido de que sería un zorro o, como mucho, un gato asilvestrado. Cuando el animal salió a un claro, reconocí enseguida las orejas puntiagudas y las manchas características: era un lince adulto, probablemente macho, y parecía estar en buen estado de salud.\n\nMe quedé observándolo casi diez minutos sin hacer ruido. El animal olfateó el aire, bebió agua del arroyo y desapareció de nuevo entre los matorrales, sin percatarse en ningún momento de mi presencia. Avisé de inmediato al equipo de conservación, que llevaba años esperando justamente una señal así en esta zona concreta.\n\nLos biólogos que revisaron después las fotografías de las cámaras confirmaron que se trataba de un macho joven, probablemente llegado desde un núcleo poblacional cercano en busca de nuevo territorio. Para muchos de nosotros, aquel encuentro casual demostró algo que los informes oficiales llevaban tiempo sugiriendo: la recuperación de la especie, lenta pero real, empieza por fin a notarse fuera de las zonas donde siempre se la había vigilado más de cerca.',
  gloss: [
    { es: 'el lince ibérico', en: 'un felino salvaje de la península, en grave peligro de extinción hasta hace poco' },
    { es: 'el guardabosques', en: 'la persona encargada de vigilar y proteger un bosque o parque natural' },
    { es: 'un avistamiento', en: 'el hecho de ver un animal salvaje en su hábitat' },
    { es: 'asilvestrado', en: 'un animal doméstico que vive ahora como si fuera salvaje' },
    { es: 'el núcleo poblacional', en: 'un grupo de individuos de una especie que vive junto en una misma zona' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué actitud transmite el narrador hacia el hallazgo del lince?', options: ['Indiferencia, porque los avistamientos son habituales', 'Sorpresa y satisfacción, tras años sin resultados', 'Desconfianza hacia el trabajo de los biólogos'], answer: 1 },
    { type: 'mcq', q: '¿Qué sugiere el último párrafo sobre la recuperación de la especie?', options: ['Que ha fracasado por completo', 'Que avanza lentamente pero empieza a extenderse a nuevas zonas', 'Que solo ocurre dentro de las zonas más vigiladas'], answer: 1 },
    { type: 'short', q: '¿Qué profesión tiene el narrador? (dos palabras)', accept: ['guardabosques', 'es guardabosques'] },
    { type: 'translate', line: 'Nunca había visto un lince ibérico en libertad hasta aquella mañana de octubre, y no fue precisamente en las montañas donde llevaba semanas buscándolo.', model: 'I had never seen an Iberian lynx in the wild until that October morning, and it was not, in fact, in the mountains where I had spent weeks looking for it.' }
  ]
},

{
  id: 'jefa-exigente-retrato-b2', title: 'Retrato de una jefa exigente', level: 6, theme: 'trabajo',
  text: 'Marisa lleva casi veinte años dirigiendo el departamento de diseño, y quienes trabajan con ella por primera vez tardan poco en descubrir que su fama de exigente no es exagerada. Es de esas personas que revisan cada detalle de un proyecto tres veces, y solo entonces lo dan por bueno; para ella, "está bien" es una expresión demasiado vaga para merecer una respuesta.\n\nFísicamente, nada en ella llama especialmente la atención: viste siempre de forma sencilla, con colores neutros, como si no quisiera que la ropa distrajera de lo que realmente importa. Es su forma de hablar lo que la distingue enseguida. Habla despacio, pausando entre frase y frase, y mira fijamente a quien tiene delante mientras espera una respuesta concreta, no una excusa.\n\nLo curioso es que, a pesar de su reputación, casi nadie en el equipo querría trabajar para otra persona. Sus críticas, por duras que parezcan al principio, siempre vienen acompañadas de una explicación clara de qué falla y por qué. Nunca humilla a nadie delante de los demás; guarda sus comentarios más severos para las reuniones individuales, donde puede hablar sin que nadie más escuche.\n\nEs como tener un profesor exigente que, sin embargo, consigue que aprendas más en un año que en los cinco anteriores juntos. Quienes se marchan de su equipo, casi siempre, terminan reconociendo que fue la etapa en la que más crecieron profesionalmente, aunque en su momento la vivieran con cierto agobio. Marisa lo sabe, y probablemente por eso nunca ha suavizado su forma de trabajar: sabe exactamente qué resultado produce.',
  gloss: [
    { es: 'exigente', en: 'que pide mucho a los demás y no se conforma con poco' },
    { es: 'vaga (expresión)', en: 'poco precisa, que no dice nada concreto' },
    { es: 'la reputación', en: 'la opinión general que la gente tiene de alguien' },
    { es: 'humillar', en: 'hacer sentir a alguien inferior o avergonzado delante de otros' },
    { es: 'el agobio', en: 'la sensación de estar bajo mucha presión o estrés' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué actitud tiene el equipo hacia Marisa, a pesar de sus críticas?', options: ['La evitan siempre que pueden', 'La respetan y prefieren trabajar con ella', 'La consideran injusta y cruel'], answer: 1 },
    { type: 'mcq', q: '¿Qué implica la comparación con "un profesor exigente"?', options: ['Que Marisa enseña literalmente en una escuela', 'Que su exigencia, aunque incómoda, produce un aprendizaje real', 'Que solo le interesa la teoría, no la práctica'], answer: 1 },
    { type: 'short', q: '¿Dónde guarda Marisa sus comentarios más duros? (tres palabras)', accept: ['reuniones individuales', 'en reuniones individuales', 'para las reuniones individuales'] },
    { type: 'translate', line: 'Nunca humilla a nadie delante de los demás', model: 'She never humiliates anyone in front of others' }
  ]
},

{
  id: 'vacunas-como-funcionan-b2', title: 'Cómo funcionan realmente las vacunas', level: 6, theme: 'ciencia',
  text: 'Se suele explicar que una vacuna "protege" contra una enfermedad, pero pocas veces se detalla cómo consigue exactamente ese efecto. En realidad, una vacuna no ataca al virus directamente; lo que hace es enseñarle al propio sistema inmunitario a reconocerlo antes de que llegue una infección real.\n\nPara entender el proceso, hay que dividirlo en tres fases. En primer lugar, la vacuna introduce en el cuerpo una versión debilitada, inactiva o parcial del patógeno, que resulta inofensiva por sí sola. En segundo lugar, el sistema inmunitario detecta esos fragmentos como algo extraño y fabrica anticuerpos específicos para combatirlos, exactamente como haría frente a una infección de verdad. Por último, y esto es lo más importante, una parte de esas células queda almacenada como "memoria" durante meses o incluso años.\n\nCuando el organismo se encuentra después con el virus auténtico, no necesita empezar desde cero: las células de memoria reconocen la amenaza casi al instante y producen anticuerpos mucho más rápido de lo que tardarían sin haber sido vacunadas antes. Es precisamente esa rapidez la que suele evitar que la enfermedad llegue a desarrollarse, o que lo haga solo de forma leve.\n\nEsto explica también por qué algunas vacunas requieren varias dosis: cada dosis adicional refuerza esa memoria inmunitaria, de manera que el cuerpo responda con mayor intensidad y durante más tiempo. No se trata, por tanto, de repetir el mismo procedimiento por precaución, sino de completar un proceso de aprendizaje que, en muchos casos, necesita más de un contacto para consolidarse del todo.',
  gloss: [
    { es: 'el sistema inmunitario', en: 'el conjunto de células y órganos que defienden el cuerpo de infecciones' },
    { es: 'el patógeno', en: 'un microorganismo, como un virus o bacteria, capaz de causar una enfermedad' },
    { es: 'un anticuerpo', en: 'una proteína que el cuerpo fabrica para reconocer y neutralizar una amenaza concreta' },
    { es: 'inofensivo', en: 'que no causa ningún daño' },
    { es: 'consolidarse', en: 'volverse fuerte y estable de manera duradera' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué implica el texto sobre la idea popular de que una vacuna "ataca" al virus?', options: ['Que es exactamente correcta', 'Que es una simplificación poco precisa del proceso real', 'Que el texto la confirma sin matices'], answer: 1 },
    { type: 'mcq', q: '¿Por qué requieren varias dosis algunas vacunas, según el texto?', options: ['Por pura precaución médica sin motivo biológico', 'Porque cada dosis refuerza la memoria inmunitaria ya creada', 'Porque la primera dosis normalmente falla'], answer: 1 },
    { type: 'short', q: '¿Cuántas fases tiene el proceso descrito? (una palabra)', accept: ['tres'] },
    { type: 'translate', line: 'En realidad, una vacuna no ataca al virus directamente', model: 'In reality, a vaccine does not attack the virus directly' }
  ]
},

{
  id: 'debate-voto-16-politica-b2', title: '¿Debería votarse a los dieciséis años?', level: 6, theme: 'politica',
  text: 'Se ha propuesto en varios países bajar la edad mínima para votar de dieciocho a dieciséis años, y la propuesta divide a la opinión pública casi por igual. Quienes defienden el cambio sostienen que los jóvenes de esa edad ya pagan impuestos indirectos, trabajan en muchos casos, y sufren directamente decisiones políticas como el cambio climático o el mercado laboral, sin tener ninguna forma de influir en ellas.\n\nUn argumento que se cita con frecuencia procede de Austria, uno de los pocos países europeos que ya permite votar desde los dieciséis años en elecciones nacionales. Un estudio de la universidad de Viena, publicado en 2019, mostró que la participación de los votantes de dieciséis y diecisiete años no fue menor que la de los adultos jóvenes, y que muchos de ellos declararon sentirse más comprometidos políticamente después de haber votado por primera vez a esa edad.\n\nEs cierto que no se puede afirmar que todos los adolescentes de dieciséis años tengan la madurez necesaria para evaluar programas electorales complejos; los críticos de la propuesta insisten en que la capacidad de razonamiento político sigue desarrollándose durante la adolescencia. Sin embargo, ese mismo argumento podría aplicarse igualmente a muchos adultos, y nadie propone por ello restringirles el voto según su nivel de formación.\n\nBajar la edad de voto no resolverá por sí solo la desconexión que sienten muchos jóvenes hacia la política institucional, y habría que acompañar la medida de una educación cívica real en los institutos. Aun así, los datos disponibles hasta ahora apuntan más a favor de la propuesta que en contra, aunque la decisión final siga siendo, sobre todo, una cuestión de voluntad política.',
  gloss: [
    { es: 'la edad mínima', en: 'la edad más baja permitida legalmente para hacer algo' },
    { es: 'los impuestos indirectos', en: 'el dinero que se paga al Estado al comprar productos o servicios, no sobre el sueldo' },
    { es: 'la madurez', en: 'la capacidad de pensar y decidir con responsabilidad' },
    { es: 'la desconexión', en: 'la falta de interés o de relación con algo' },
    { es: 'la educación cívica', en: 'la enseñanza sobre los derechos, deberes y funcionamiento de la sociedad' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué posición final adopta el autor del texto?', options: ['Rechaza totalmente la propuesta', 'Se muestra moderadamente favorable, con matices', 'No toma ninguna posición en absoluto'], answer: 1 },
    { type: 'mcq', q: '¿Cómo responde el texto al argumento de que los adolescentes carecen de madurez política?', options: ['Lo acepta sin objeciones', 'Señala que ese mismo argumento podría aplicarse a adultos, sin que se les restrinja el voto', 'Afirma que la madurez no importa en política'], answer: 1 },
    { type: 'short', q: '¿Qué país se cita como ejemplo? (una palabra)', accept: ['austria'] },
    { type: 'translate', line: 'Bajar la edad de voto no resolverá por sí solo la desconexión que sienten muchos jóvenes hacia la política institucional', model: 'Lowering the voting age will not by itself solve the disconnection many young people feel from institutional politics' }
  ]
},

{
  id: 'pueblo-mercado-viajes-b2', title: 'El mercado de un pueblo de montaña', level: 6, theme: 'viajes',
  text: 'El pueblo de Arenillas se despierta cada sábado antes del amanecer, cuando los primeros puestos empiezan a montarse en la plaza principal. El mercado ocupa apenas dos calles estrechas, pero durante unas horas concentra a casi todos los vecinos de los pueblos vecinos, que bajan desde las aldeas de montaña cargados de productos para vender o para comprar.\n\nLos puestos de queso y embutido se colocan siempre junto a la iglesia, a la sombra, mientras que los de fruta y verdura ocupan el centro de la plaza, donde da el sol de la mañana. Entre unos y otros circulan vendedores ambulantes de herramientas viejas, ropa de segunda mano y utensilios de cocina que ya casi nadie fabrica en las ciudades grandes. El olor a pan recién horneado se mezcla con el del café de un pequeño bar que abre sus puertas justo a las siete.\n\nLo que distingue a este mercado de otros más turísticos es que apenas ha cambiado en las últimas décadas: no hay puestos de recuerdos ni artesanía dirigida a visitantes, solo productos que la gente del lugar realmente necesita comprar cada semana. Las conversaciones entre vendedor y comprador se alargan mucho más de lo estrictamente necesario, y no es raro ver a dos personas discutiendo animadamente sobre el precio de un kilo de patatas durante diez minutos, sin que ninguna de las dos parezca tener prisa.\n\nHacia el mediodía, cuando el sol ya calienta con fuerza, los puestos empiezan a recogerse tan rápido como se montaron. Para las dos de la tarde, la plaza vuelve a estar completamente vacía, como si el mercado nunca hubiera existido, hasta el sábado siguiente.',
  gloss: [
    { es: 'el amanecer', en: 'el momento del día en que empieza a salir el sol' },
    { es: 'un puesto (de mercado)', en: 'una mesa o instalación pequeña donde se vende algo al aire libre' },
    { es: 'un vendedor ambulante', en: 'alguien que vende productos moviéndose de un sitio a otro, sin tienda fija' },
    { es: 'la artesanía', en: 'los objetos hechos a mano, de forma tradicional' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué actitud transmite el texto hacia este mercado frente a uno turístico?', options: ['Cierta añoranza y aprecio por su carácter auténtico', 'Desprecio, porque le falta modernidad', 'Indiferencia total'], answer: 0 },
    { type: 'mcq', q: '¿Qué sugiere la larga negociación por el precio de las patatas?', options: ['Que los vecinos son especialmente pobres', 'Que el ritmo social del mercado importa tanto como la propia compra', 'Que hay un conflicto real entre vendedor y comprador'], answer: 1 },
    { type: 'short', q: '¿A qué hora abre el pequeño bar? (dos palabras)', accept: ['las siete', 'a las siete'] },
    { type: 'translate', line: 'Para las dos de la tarde, la plaza vuelve a estar completamente vacía, como si el mercado nunca hubiera existido, hasta el sábado siguiente.', model: 'By two in the afternoon, the square is completely empty again, as if the market had never existed, until the following Saturday.' }
  ]
},

{
  id: 'panaderia-familiar-economia-b2', title: 'La panadería que casi cierra', level: 6, theme: 'economia',
  text: 'Para cuando Rosario decidió pedir un préstamo, la panadería familiar llevaba ya dos años perdiendo clientes frente al supermercado nuevo del barrio, que vendía pan más barato aunque de peor calidad. Su padre había abierto el negocio hace treinta y cinco años, y la idea de cerrarlo le resultaba, sencillamente, inaceptable.\n\nEl banco le ofreció un crédito a un interés razonable, pero solo lo aprobó una vez que ella presentó un plan de negocio detallado. Rosario pasó semanas enteras estudiando qué hacían las panaderías que sí sobrevivían a la competencia de las grandes cadenas: casi todas habían encontrado un nicho concreto, en lugar de intentar competir directamente en precio. Decidió entonces especializarse en pan artesano de fermentación lenta, algo que ningún supermercado de la zona podía ofrecer.\n\nLos primeros meses fueron difíciles. Había invertido gran parte del préstamo en un horno nuevo y en ingredientes de mejor calidad, y las ventas tardaron en reflejar ese cambio. Sin embargo, poco a poco, empezaron a llegar clientes de otros barrios, atraídos por las reseñas que circulaban de boca en boca y, más tarde, por internet. Un año después de pedir el crédito, la panadería ya facturaba un veinte por ciento más que en el año previo a la reforma.\n\nHoy, Rosario reconoce que estuvo a punto de rendirse varias veces durante ese primer año. Lo que finalmente la convenció de seguir adelante no fueron los números, que en su momento resultaban desalentadores, sino la certeza de que competir en calidad, y no en precio, era la única estrategia con verdadero futuro para un negocio tan pequeño frente a una cadena tan grande.',
  gloss: [
    { es: 'un préstamo', en: 'una cantidad de dinero que un banco presta, y que hay que devolver con intereses' },
    { es: 'un nicho (de mercado)', en: 'una parte pequeña y específica de un mercado, poco atendida por la competencia' },
    { es: 'artesano', en: 'hecho a mano, con métodos tradicionales, no de forma industrial' },
    { es: 'facturar', en: 'obtener una cantidad determinada de ingresos por las ventas realizadas' },
    { es: 'desalentador', en: 'que quita las ganas de continuar, que produce desánimo' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué estrategia distingue a las panaderías que sobrevivieron a la competencia, según el texto?', options: ['Bajar los precios al nivel del supermercado', 'Especializarse en un nicho que la competencia no podía ofrecer', 'Cerrar antes de perder más dinero'], answer: 1 },
    { type: 'mcq', q: '¿Qué fue lo que realmente mantuvo a Rosario en el negocio, según el último párrafo?', options: ['Los buenos resultados económicos inmediatos', 'La convicción de que la calidad era la única estrategia viable', 'La presión de su familia'], answer: 1 },
    { type: 'short', q: '¿En qué se especializó la panadería? (dos palabras)', accept: ['pan artesano', 'fermentación lenta'] },
    { type: 'translate', line: 'Para cuando Rosario decidió pedir un préstamo, la panadería familiar llevaba ya dos años perdiendo clientes', model: 'By the time Rosario decided to ask for a loan, the family bakery had already been losing customers for two years' }
  ]
},

{
  id: 'radio-antigua-objeto-b2', title: 'El aparato de radio de mi abuelo', level: 6, theme: 'medios',
  text: 'En el salón de mis abuelos, sobre un mueble de madera oscura, todavía descansa un aparato de radio de válvulas que compraron poco después de casarse, hace ya más de sesenta años. Está fabricado en baquelita marrón, con un dial circular iluminado por dentro y dos botones grandes de plástico: uno para el volumen y otro para sintonizar la emisora.\n\nA diferencia de los aparatos actuales, este tarda casi un minuto en calentarse y empezar a emitir algún sonido: primero se escucha un zumbido grave, después algunas interferencias, y solo entonces aparece, poco a poco, la voz o la música de la emisora sintonizada. El sonido que produce es cálido y algo metálico, muy distinto de la claridad limpia de un altavoz moderno, pero con un carácter que mi abuela describe como "más humano".\n\nDurante décadas, aquella radio fue la principal fuente de noticias de la familia, y mi abuelo recuerda perfectamente haber escuchado a través de ella acontecimientos históricos que después solo conoció en detalle por los periódicos del día siguiente. Hoy, la radio ya no funciona como receptor habitual: mis abuelos escuchan las noticias en una aplicación del móvil, mucho más cómoda y con mejor sonido.\n\nSin embargo, nadie en la familia se ha planteado nunca deshacerse de ella. Ocupa un lugar central en el salón, no porque siga siendo útil, sino porque representa, de una forma muy concreta, cómo ha cambiado por completo la manera en que una familia entera se informa del mundo a lo largo de una sola vida.',
  gloss: [
    { es: 'la baquelita', en: 'un tipo de plástico duro muy usado en aparatos antiguos, hoy poco común' },
    { es: 'sintonizar', en: 'ajustar un aparato para recibir una emisora concreta' },
    { es: 'un zumbido', en: 'un sonido grave y continuo, como el de un motor lejano' },
    { es: 'un altavoz', en: 'el dispositivo que reproduce el sonido de un aparato' },
    { es: 'deshacerse de algo', en: 'dejar de tener algo, normalmente tirándolo o regalándolo' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué conserva la familia la radio, según el texto?', options: ['Porque todavía funciona mejor que un móvil', 'Porque simboliza un cambio real en la forma de informarse', 'Porque piensan venderla algún día'], answer: 1 },
    { type: 'mcq', q: '¿Qué connotación tiene la palabra "cálido" aplicada al sonido de la radio?', options: ['Una crítica a su mala calidad técnica', 'Un matiz positivo y afectivo, no solo técnico', 'Una referencia literal a la temperatura del aparato'], answer: 1 },
    { type: 'short', q: '¿De qué material está fabricado el aparato? (una palabra)', accept: ['baquelita'] },
    { type: 'translate', line: 'Durante décadas, aquella radio fue la principal fuente de noticias de la familia', model: 'For decades, that radio was the family\'s main source of news' }
  ]
},

{
  id: 'sistema-inmunitario-salud-b2', title: 'Las alergias: un sistema de defensa confundido', level: 6, theme: 'salud',
  text: 'Cada primavera, millones de personas sufren estornudos, picor de ojos y congestión nasal al entrar en contacto con el polen, una sustancia que, en sí misma, resulta completamente inofensiva. La pregunta que muchos se hacen es evidente: si el polen no representa ningún peligro real, ¿por qué el cuerpo reacciona como si lo fuera?\n\nLa respuesta tiene que ver con un error de identificación por parte del sistema inmunitario. En una persona alérgica, el organismo clasifica erróneamente el polen como una amenaza, de forma parecida a como reaccionaría frente a un parásito o una bacteria peligrosa. Como consecuencia, libera histamina y otras sustancias químicas cuya función normal es defender el cuerpo, pero que en este contexto solo producen inflamación, picor y exceso de mucosidad sin ningún beneficio real.\n\nUna teoría bastante extendida entre los investigadores, conocida como la "hipótesis de la higiene", sugiere que este tipo de errores se han vuelto más frecuentes precisamente porque el sistema inmunitario moderno se enfrenta a muchos menos parásitos e infecciones reales que hace un siglo, sobre todo durante la infancia. Sin exposición temprana a según qué amenazas genuinas, el sistema inmunitario tendería a "aburrirse" y a reaccionar de forma exagerada frente a sustancias inofensivas como el polen, el polvo o determinados alimentos.\n\nEsta hipótesis no está exenta de críticas ni de matices, y los propios investigadores reconocen que probablemente explica solo una parte del aumento de las alergias registrado en las últimas décadas. Aun así, ofrece una perspectiva útil: una alergia no es, en el fondo, un sistema de defensa débil, sino uno que defiende con demasiado entusiasmo algo que nunca debería haber considerado un enemigo.',
  gloss: [
    { es: 'el polen', en: 'un polvo fino producido por las plantas, necesario para su reproducción' },
    { es: 'la histamina', en: 'una sustancia química que el cuerpo libera durante una reacción alérgica' },
    { es: 'un parásito', en: 'un organismo que vive a costa de otro, causándole daño' },
    { es: 'no estar exento de algo', en: 'no librarse de algo, seguir teniéndolo en cierta medida' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué sugiere la "hipótesis de la higiene" sobre el aumento de las alergias?', options: ['Que se debe únicamente a la contaminación del aire', 'Que la menor exposición a amenazas reales puede desregular el sistema inmunitario', 'Que las alergias siempre han existido en la misma proporción'], answer: 1 },
    { type: 'mcq', q: '¿Cómo describe el texto, en el fondo, una reacción alérgica?', options: ['Como un sistema de defensa débil e ineficaz', 'Como un sistema de defensa que reacciona con exceso de celo ante algo inofensivo', 'Como una enfermedad contagiosa'], answer: 1 },
    { type: 'short', q: '¿Cómo se llama la sustancia que el cuerpo libera durante la alergia? (una palabra)', accept: ['histamina'] },
    { type: 'translate', line: 'el polen, una sustancia que, en sí misma, resulta completamente inofensiva.', model: 'pollen, a substance that, in itself, is completely harmless.' }
  ]
},

{
  id: 'renta-basica-economia-b2', title: '¿Funciona la renta básica universal?', level: 7, theme: 'economia',
  text: 'Desde hace más de una década, distintos gobiernos han experimentado con programas de renta básica universal: un pago mensual fijo que el Estado entrega a sus ciudadanos, sin condiciones previas ni obligación de justificar en qué se gasta. Los defensores de la medida argumentan que simplificaría enormemente el sistema de ayudas sociales actual, reduciendo la burocracia y eliminando la estigmatización asociada a otros subsidios.\n\nUno de los experimentos más citados se llevó a cabo en Finlandia entre 2017 y 2018, cuando el gobierno entregó quinientos setenta euros mensuales a dos mil desempleados elegidos al azar, sin exigirles buscar trabajo activamente a cambio. Un informe oficial publicado posteriormente mostró que los participantes no encontraron empleo con más rapidez que un grupo de control equivalente, pero sí declararon niveles significativamente menores de estrés y mayor satisfacción vital durante el periodo del experimento.\n\nLos críticos de la renta básica señalan, sin embargo, que financiar un pago así para toda la población resultaría extraordinariamente caro, y que ese dinero probablemente rendiría más si se concentrara en quienes realmente lo necesitan, en lugar de repartirse también entre quienes ya disponen de ingresos elevados. Además, argumentan que eliminar por completo el vínculo entre ayuda económica y búsqueda activa de empleo podría, a largo plazo, desincentivar la incorporación al mercado laboral en algunos sectores.\n\nEs poco probable que un solo experimento, por bien diseñado que esté, resuelva un debate que combina cuestiones económicas, éticas y políticas tan distintas entre sí. Lo que sí parece cada vez más claro es que el bienestar subjetivo de las personas mejora de forma medible cuando desaparece la incertidumbre económica más básica, algo que cualquier reforma futura del sistema de ayudas sociales debería, como mínimo, tomarse en serio.',
  gloss: [
    { es: 'la burocracia', en: 'los trámites y procedimientos administrativos, a menudo lentos y complicados' },
    { es: 'la estigmatización', en: 'el hecho de marcar negativamente a alguien por su situación social' },
    { es: 'un subsidio', en: 'una ayuda económica que da el Estado a una persona o grupo concreto' },
    { es: 'un grupo de control', en: 'en un experimento, el grupo con el que se compara a quienes reciben la medida estudiada' },
    { es: 'desincentivar', en: 'reducir las ganas o los motivos de alguien para hacer algo' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué resultado del experimento finlandés sorprende más, según el texto?', options: ['Que los participantes encontraron trabajo mucho más rápido', 'Que el empleo no mejoró, pero sí el bienestar subjetivo', 'Que el experimento fue un fracaso total'], answer: 1 },
    { type: 'mcq', q: '¿Qué posición final sugiere el texto sobre el debate de la renta básica?', options: ['Que está completamente resuelto a favor de la medida', 'Que sigue abierto, aunque el bienestar subjetivo merece tomarse en serio', 'Que ningún gobierno debería volver a probarlo'], answer: 1 },
    { type: 'short', q: '¿En qué país se realizó el experimento citado? (una palabra)', accept: ['finlandia'] },
    { type: 'translate', line: 'los participantes no encontraron empleo con más rapidez que un grupo de control equivalente', model: 'participants did not find employment any faster than an equivalent control group' }
  ]
},

{
  id: 'cuadro-robado-arte-b2', title: 'El cuadro que volvió treinta años después', level: 6, theme: 'arte',
  text: 'En 1993, un pequeño museo municipal de provincias sufrió un robo que nunca llegó a resolverse: durante la noche, alguien forzó una ventana trasera y se llevó un óleo del siglo diecinueve valorado, según los peritos de la época, en unos cien mil euros. La policía interrogó a decenas de sospechosos habituales del mundo del arte y del contrabando, pero el cuadro pareció esfumarse por completo, y el caso acabó archivado pocos años después sin ningún resultado.\n\nHabrá pasado por varias manos a lo largo de estas tres décadas, especularon los investigadores cuando el caso volvió a reabrirse; probablemente cambió de dueño más de una vez, quizás vendido en subastas privadas donde nadie preguntaba demasiado por su procedencia exacta. Lo cierto es que nadie volvió a tener noticia alguna de la obra hasta el pasado mes de marzo, cuando un anticuario de una ciudad vecina alertó a la policía tras reconocer el cuadro en la vivienda de un cliente fallecido recientemente, cuya familia le había encargado tasar sus pertenencias antes de la subasta de la herencia.\n\nLa familia, que aseguró desconocer por completo el origen ilícito de la pieza, entregó el cuadro voluntariamente en cuanto se confirmó su identidad mediante un análisis pormenorizado del lienzo y del marco original. Los expertos del museo, tras compararlo con las fotografías de archivo, no tuvieron ninguna duda: era, sin ningún género de dudas, la misma obra desaparecida en 1993, con apenas algunos daños menores en el marco.\n\nEl museo ha anunciado ya que el cuadro volverá a exponerse dentro de unos meses, una vez completada su restauración, en una sala dedicada específicamente a contar la historia de su desaparición y su inesperado regreso. Para muchos vecinos de la ciudad, que crecieron oyendo hablar del robo como una leyenda local sin solución posible, la noticia ha resultado casi tan sorprendente como el propio hallazgo.',
  gloss: [
    { es: 'un óleo', en: 'una pintura hecha con un tipo de pintura espesa, tradicional en el arte clásico' },
    { es: 'un perito', en: 'un experto que evalúa el valor o el estado de algo de forma oficial' },
    { es: 'esfumarse', en: 'desaparecer por completo, sin dejar rastro' },
    { es: 'un anticuario', en: 'alguien que compra, vende o valora objetos antiguos' },
    { es: 'tasar', en: 'calcular oficialmente el valor económico de algo' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué función cumple la frase "habrá pasado por varias manos" en el texto?', options: ['Afirma un hecho comprobado con certeza', 'Expresa una conjetura de los investigadores sobre el pasado del cuadro', 'Cita una declaración textual de la familia'], answer: 1 },
    { type: 'mcq', q: '¿Qué actitud transmite el texto hacia la familia que entregó el cuadro?', options: ['Sospecha de que mintieran sobre su desconocimiento', 'Acepta sin cuestionar que actuaron de buena fe', 'Los acusa directamente del robo original'], answer: 1 },
    { type: 'short', q: '¿En qué año fue robado el cuadro? (una palabra)', accept: ['1993', 'mil novecientos noventa y tres'] },
    { type: 'translate', line: 'Habrá pasado por varias manos a lo largo de estas tres décadas', model: 'It must have passed through several hands over these three decades' }
  ]
},

/* Batch 2 of 8. */
{
  id: 'camino-santiago-religion-b2', title: 'Los últimos kilómetros del Camino', level: 6, theme: 'religion',
  text: 'Cuando emprendí el Camino de Santiago, no lo hice por motivos religiosos, sino porque necesitaba tiempo a solas después de un año especialmente difícil. Sin embargo, cuanto más avanzaba, más notaba que la experiencia se parecía menos a una simple caminata larga y más a algo que costaba definir con palabras exactas.\n\nEl último día, al acercarme a Santiago, empecé a caminar como si aquellos últimos kilómetros importaran mucho más que los cientos anteriores, aunque objetivamente no fueran distintos. A mi alrededor, otros peregrinos avanzaban en silencio, algunos claramente emocionados, otros aparentemente tan sorprendidos como yo de sentir algo tan intenso al final de una caminata que, sobre el papel, era solo eso: caminar.\n\nEn el albergue de la noche anterior había conocido a una mujer alemana que llevaba el Camino tres veces ya, y que me explicó algo que entonces no entendí del todo: cada peregrino, decía, acaba encontrando en el Camino justo aquello que necesitaba encontrar, independientemente de lo que hubiera venido buscando al principio. Yo había salido buscando silencio, y en cambio encontré una extraña sensación de pertenencia a un grupo de desconocidos unidos únicamente por el mismo esfuerzo físico.\n\nAl llegar por fin a la plaza del Obradoiro, frente a la catedral, no sentí la euforia que había imaginado, sino algo más parecido al alivio y, curiosamente, a cierta tristeza por que la experiencia hubiera terminado. Me senté en el suelo de piedra, rodeado de otros peregrinos igual de agotados, y solo entonces comprendí que lo que de verdad había cambiado no era el paisaje a mi alrededor, sino la forma en que había aprendido a estar conmigo mismo durante aquellas semanas.',
  gloss: [
    { es: 'emprender (un viaje)', en: 'empezar a hacer algo, normalmente algo largo o importante' },
    { es: 'un peregrino', en: 'una persona que hace un viaje religioso o simbólico a pie hasta un lugar sagrado' },
    { es: 'un albergue', en: 'un alojamiento sencillo y barato, típico para viajeros o peregrinos' },
    { es: 'la pertenencia (a un grupo)', en: 'la sensación de formar parte de algo junto a otras personas' },
    { es: 'la euforia', en: 'una alegría muy intensa y repentina' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué sugiere la anécdota de la mujer alemana sobre el Camino?', options: ['Que siempre se busca lo mismo y se encuentra lo mismo', 'Que cada persona encuentra algo distinto de lo que buscaba al empezar', 'Que solo tiene sentido para quienes son religiosos'], answer: 1 },
    { type: 'mcq', q: '¿Qué emoción predomina al llegar a la catedral, según el texto?', options: ['Euforia pura, tal como esperaba', 'Alivio mezclado con una tristeza inesperada', 'Decepción por el esfuerzo realizado'], answer: 1 },
    { type: 'short', q: '¿De qué nacionalidad era la mujer del albergue? (una palabra)', accept: ['alemana'] },
    { type: 'translate', line: 'cada peregrino, decía, acaba encontrando en el Camino justo aquello que necesitaba encontrar', model: 'each pilgrim, she said, ends up finding on the Camino exactly what they needed to find' }
  ]
},

{
  id: 'expatriada-identidad-b2', title: 'Ya no sé de dónde soy del todo', level: 6, theme: 'identidad',
  text: 'Lleva once años viviendo en Ámsterdam, pero Carmen sigue sin saber, cuando alguien se lo pregunta directamente, qué contestar a la pregunta "¿de dónde eres?". Nació y creció en Sevilla, se marchó a los veinticuatro años y desde entonces solo regresa a España dos o tres veces al año, normalmente en verano y por Navidad.\n\nSu español, dice ella misma con una sonrisa algo incómoda, ha empezado a sonar raro incluso a sus propios oídos: mezcla expresiones andaluzas con estructuras que ha calcado directamente del neerlandés, sin darse cuenta la mayoría de las veces. Sus amigos de Sevilla bromean con que habla "como una guiri", mientras que sus compañeros holandeses siguen notando su acento del sur de España después de más de una década.\n\nLo que más le sorprende a Carmen no es tanto la mezcla lingüística en sí, sino cómo ha cambiado su forma de entender ciertos valores. Cuando visita Sevilla, la parte social y ruidosa de las reuniones familiares, que antes le parecía completamente normal, ahora le resulta a la vez entrañable y agotadora. Y cuando está en Ámsterdam, hay días en los que echa de menos precisamente ese caos que, durante años, había querido dejar atrás.\n\nCarmen ha llegado a la conclusión de que su identidad ya no encaja del todo en ninguna de las dos categorías disponibles: ni completamente sevillana ni completamente integrada en los Países Bajos. Sospecha que esto le ocurre a la mayoría de las personas que emigran durante muchos años, aunque nadie parezca hablar demasiado abiertamente de esa incomodidad concreta, quizás porque no encaja bien en ninguna respuesta corta a una pregunta tan simple como "¿de dónde eres?".',
  gloss: [
    { es: 'calcar (una expresión)', en: 'copiar directamente la estructura de una lengua en otra, de forma poco natural' },
    { es: 'una guiri', en: 'coloquialmente en España, una persona extranjera, sobre todo turista' },
    { es: 'entrañable', en: 'que produce cariño y ternura' },
    { es: 'emigrar', en: 'dejar el propio país para vivir en otro' },
    { es: 'encajar', en: 'ajustarse bien a una categoría, una situación o un grupo' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué actitud tiene Carmen hacia su propia identidad, según el texto?', options: ['Total seguridad, se siente completamente sevillana', 'Una sensación de no encajar del todo en ninguna de las dos categorías', 'Rechazo absoluto hacia su origen español'], answer: 1 },
    { type: 'mcq', q: '¿Qué sugiere el texto sobre otras personas que emigran durante muchos años?', options: ['Que no les afecta ningún conflicto de identidad', 'Que probablemente comparten una incomodidad similar, aunque poco discutida', 'Que siempre acaban prefiriendo el país de acogida'], answer: 1 },
    { type: 'short', q: '¿En qué ciudad vive Carmen ahora? (una palabra)', accept: ['ámsterdam', 'amsterdam'] },
    { type: 'translate', line: 'Su español, dice ella misma con una sonrisa algo incómoda, ha empezado a sonar raro incluso a sus propios oídos', model: 'Her Spanish, she herself says with a somewhat uneasy smile, has started to sound strange even to her own ears' }
  ]
},

{
  id: 'agujeros-negros-ciencia-b2', title: 'Qué es realmente un agujero negro', level: 7, theme: 'ciencia',
  text: 'Cuando una estrella mucho más masiva que el Sol agota todo su combustible nuclear, ya no dispone de la energía necesaria para sostener su propia estructura, y su núcleo se derrumba sobre sí mismo bajo el efecto de la gravedad. Si la masa restante supera un determinado límite, ese colapso no se detiene en ningún punto intermedio: continúa hasta concentrar toda la materia en una región de tamaño prácticamente nulo. Eso, y no una especie de agujero literal en el espacio, es lo que los físicos llaman un agujero negro.\n\nLo que realmente define a un agujero negro no es tanto su densidad extrema, sino la existencia de lo que se conoce como horizonte de sucesos: una frontera invisible a partir de la cual ni siquiera la luz dispone de suficiente velocidad para escapar de la atracción gravitatoria. Cualquier objeto, señal o rayo de luz que cruce esa frontera quedará atrapado para siempre, sin ninguna posibilidad de salir ni de enviar información al exterior.\n\nDurante décadas, los agujeros negros se consideraron una consecuencia puramente teórica de las ecuaciones de Einstein, más una curiosidad matemática que un objeto real. No fue hasta que se detectaron señales indirectas —estrellas orbitando aparentemente alrededor de la nada, o emisiones de rayos X producidas por materia que caía hacia un objeto invisible— cuando la comunidad científica aceptó que existían de verdad en el universo observable.\n\nEn 2019, un equipo internacional consiguió algo que muchos habían dado por imposible: fotografiar, mediante una red de radiotelescopios repartidos por todo el planeta, la sombra proyectada por el horizonte de sucesos de un agujero negro supermasivo situado en el centro de una galaxia lejana. Aquella imagen borrosa, de un anillo de luz rodeando una oscuridad absoluta, confirmó de manera directa lo que la teoría llevaba prediciendo más de un siglo.',
  gloss: [
    { es: 'el combustible nuclear', en: 'el material que una estrella consume para producir energía mediante fusión' },
    { es: 'derrumbarse', en: 'caer o colapsar de forma repentina sobre sí mismo' },
    { es: 'el horizonte de sucesos', en: 'la frontera de un agujero negro más allá de la cual nada puede escapar' },
    { es: 'supermasivo', en: 'que tiene una masa extraordinariamente grande, muy superior a la habitual' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué corrige el texto sobre la idea popular de un agujero negro?', options: ['Que no es un colapso gravitatorio real', 'Que no es un "agujero" literal, sino materia colapsada con un horizonte de sucesos', 'Que no tiene relación con la gravedad'], answer: 1 },
    { type: 'mcq', q: '¿Qué importancia tiene la fotografía de 2019, según el texto?', options: ['Fue la primera predicción teórica de su existencia', 'Confirmó de forma directa y visual lo que la teoría ya predecía', 'Demostró que los agujeros negros no existen'], answer: 1 },
    { type: 'short', q: '¿En qué año se fotografió el agujero negro? (una palabra)', accept: ['2019'] },
    { type: 'translate', line: 'ni siquiera la luz dispone de suficiente velocidad para escapar de la atracción gravitatoria', model: 'not even light has enough speed to escape the gravitational pull' }
  ]
},

{
  id: 'deepfakes-medios-b2', title: '¿Se puede confiar todavía en un vídeo?', level: 7, theme: 'medios',
  text: 'Durante décadas, un vídeo funcionó como una prueba casi irrefutable: si algo se veía ocurrir en pantalla, difícilmente se podía negar que hubiera sucedido. La tecnología conocida como "deepfake", capaz de generar rostros y voces sintéticas prácticamente indistinguibles de las reales, ha empezado a poner en duda esa certeza que dábamos por garantizada.\n\nAunque algunos deepfakes se han utilizado con fines claramente cómicos o artísticos, otros han circulado con la intención expresa de engañar: vídeos falsos de políticos pronunciando declaraciones que nunca hicieron, o de directivos de empresas anunciando decisiones inventadas que llegaron a mover, durante unas horas, el precio de acciones en bolsa. No es de extrañar que muchos expertos en seguridad digital insistan en que necesitamos herramientas nuevas antes de que la desconfianza generalizada acabe siendo más peligrosa que la propia tecnología.\n\nHay quienes defienden que la solución pasa por desarrollar sistemas automáticos capaces de detectar manipulaciones, una especie de carrera armamentística técnica entre quienes crean deepfakes y quienes los detectan. Otros, sin embargo, sostienen que ninguna solución puramente tecnológica bastará mientras no cambiemos también nuestros hábitos de consumo de información: verificar la fuente original de un vídeo antes de compartirlo, por ejemplo, sigue siendo una medida más eficaz de lo que mucha gente está dispuesta a admitir.\n\nEs poco probable que dejemos de creer en las imágenes por completo; seguimos necesitando, como especie, algún tipo de prueba visual en la que confiar. Lo más realista es que aprendamos, poco a poco, a tratar cualquier vídeo sorprendente con la misma cautela con la que ya tratamos un titular sensacionalista: no como una mentira automática, sino como algo que, sencillamente, merece comprobarse antes de darlo por cierto.',
  gloss: [
    { es: 'irrefutable', en: 'que no se puede negar ni discutir' },
    { es: 'un directivo', en: 'una persona con un cargo importante en la dirección de una empresa' },
    { es: 'una carrera armamentística', en: 'una competición en la que cada bando mejora continuamente sus recursos frente al otro' },
    { es: 'sensacionalista', en: 'que exagera o dramatiza deliberadamente para atraer atención' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué posición final defiende el texto ante los deepfakes?', options: ['Que hay que dejar de confiar en cualquier imagen', 'Que conviene tratar los vídeos sorprendentes con cautela, verificando antes de creer', 'Que la tecnología resolverá el problema por sí sola'], answer: 1 },
    { type: 'mcq', q: '¿Qué comparación usa el texto para describir la actitud recomendada?', options: ['Tratar los vídeos como se trata un titular sensacionalista', 'Tratar los vídeos como pruebas judiciales', 'Tratar los vídeos como obras de ficción sin más'], answer: 0 },
    { type: 'short', q: '¿Cómo se llama la tecnología que genera rostros y voces falsas? (una palabra)', accept: ['deepfake', 'deepfakes'] },
    { type: 'translate', line: 'un vídeo funcionó como una prueba casi irrefutable', model: 'a video functioned as almost irrefutable proof' }
  ]
},

{
  id: 'glaciar-naturaleza-b2', title: 'El glaciar que se mide cada verano', level: 6, theme: 'naturaleza',
  text: 'Desde que empezó a estudiar este glaciar pirenaico hace veintidós años, la glacióloga Ana Ferrer ha regresado cada mes de agosto para medir, metro a metro, cuánto hielo ha perdido durante el año anterior. Cuando comenzó sus mediciones, el glaciar todavía cubría una extensión considerable del valle; hoy, dice ella sin ocultar su preocupación, apenas queda una fracción reducida de aquella masa de hielo original.\n\nEl método que utiliza no ha cambiado apenas desde que empezó: clava varillas metálicas en puntos concretos del hielo a principios de temporada, y vuelve a medir cuánto hielo se ha derretido alrededor de cada varilla al final del verano. Es un trabajo lento, casi artesanal, en un campo donde la mayoría de sus colegas ya dependen exclusivamente de satélites e imágenes por radar.\n\nLo que distingue a este glaciar concreto, explica Ferrer, es la velocidad a la que ha retrocedido en comparación con otros glaciares pirenaicos de tamaño similar. Mientras algunos vecinos han perdido hielo de forma relativamente gradual, este ha experimentado dos veranos especialmente cálidos que, por sí solos, provocaron casi la cuarta parte de toda la pérdida registrada en dos décadas.\n\nSegún las proyecciones más recientes del equipo de Ferrer, este glaciar concreto podría desaparecer por completo dentro de una década, mucho antes de lo que se calculaba hace apenas cinco años. Ella reconoce que, en algún momento, tendrá que aceptar que su objeto de estudio simplemente dejará de existir. Aun así, insiste en seguir midiendo cada verano, aunque solo sea, dice, para dejar un registro exacto de cómo desapareció.',
  gloss: [
    { es: 'un glaciar', en: 'una gran masa de hielo que se forma y se mueve lentamente en zonas de montaña frías' },
    { es: 'una glacióloga', en: 'una científica especializada en el estudio de los glaciares' },
    { es: 'una varilla', en: 'una barra fina y larga, normalmente metálica' },
    { es: 'retroceder (un glaciar)', en: 'perder tamaño o extensión con el tiempo' },
    { es: 'una proyección (científica)', en: 'una estimación de lo que ocurrirá en el futuro según los datos actuales' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué sigue Ferrer usando el método de las varillas, según el texto?', options: ['Porque desconfía completamente de los satélites', 'Porque es un método fiable, aunque más lento que las alternativas modernas', 'Porque es obligatorio por ley'], answer: 1 },
    { type: 'mcq', q: '¿Qué actitud transmite Ferrer ante la posible desaparición del glaciar?', options: ['Indiferencia total ante el resultado', 'Una aceptación resignada, combinada con el deseo de documentarlo bien', 'Optimismo de que el glaciar se recuperará'], answer: 1 },
    { type: 'short', q: '¿Cuántos años lleva Ferrer estudiando este glaciar? (una palabra)', accept: ['veintidós', '22'] },
    { type: 'translate', line: 'insiste en seguir midiendo cada verano, aunque solo sea, dice, para dejar un registro exacto de cómo desapareció', model: 'she insists on continuing to measure it every summer, if only, she says, to leave an exact record of how it disappeared' }
  ]
},

{
  id: 'reconciliacion-hermanos-relaciones-b2', title: 'Diez años sin hablarse', level: 6, theme: 'relaciones',
  text: 'Si alguien le hubiera dicho a Marta, hace un año, que volvería a hablar con su hermano Diego, probablemente no lo habría creído. Llevaban más de una década sin dirigirse la palabra, desde una discusión por la herencia de sus padres que, con el tiempo, había dejado de tratarse realmente sobre dinero para convertirse en algo mucho más difícil de nombrar.\n\nFue la enfermedad grave de una tía común la que finalmente los obligó a coincidir en el mismo hospital, sentados en la misma sala de espera durante horas. Al principio apenas cruzaron palabra, más allá de los saludos estrictamente necesarios. Sin embargo, algo cambió cuando Diego, sin que nadie se lo pidiera, empezó a contarle a Marta detalles de su vida de los últimos años que ella desconocía por completo: un divorcio complicado, un cambio de trabajo, una operación que había ocultado a casi toda la familia.\n\nMarta se dio cuenta, escuchándolo, de que llevaba diez años imaginando a un hermano que quizás ya no existía del todo: seguía viendo al Diego arrogante y desconsiderado de aquella discusión antigua, sin haber contemplado siquiera que la persona real podía haber cambiado en todo ese tiempo. Aquella tarde en el hospital no resolvió de golpe todos los conflictos pendientes entre ambos, pero sí abrió una grieta por la que, poco a poco, empezó a colarse algo parecido a una conversación real.\n\nHoy se llaman una vez por semana, y aunque ninguno de los dos ha mencionado directamente aquella vieja discusión, ambos parecen haber decidido, sin decirlo en voz alta, que diez años de silencio ya habían sido, de largo, un precio demasiado alto por un desacuerdo que ya casi ni recuerdan con precisión.',
  gloss: [
    { es: 'la herencia', en: 'los bienes o el dinero que se reciben de un familiar tras su muerte' },
    { es: 'desconsiderado', en: 'que no tiene en cuenta los sentimientos o las necesidades de los demás' },
    { es: 'una grieta', en: 'aquí, en sentido figurado, una pequeña abertura por la que algo empieza a cambiar' },
    { es: 'colarse', en: 'entrar de forma discreta o poco a poco en un espacio o situación' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué descubre Marta al escuchar a Diego en el hospital?', options: ['Que su hermano sigue siendo exactamente como lo recordaba', 'Que había estado imaginando a una versión desactualizada de su hermano', 'Que Diego nunca cambió de opinión sobre la herencia'], answer: 1 },
    { type: 'mcq', q: '¿Qué sugiere el último párrafo sobre la discusión original?', options: ['Que sigue siendo el tema central de sus conversaciones actuales', 'Que ambos parecen haberla dejado atrás, sin necesidad de resolverla explícitamente', 'Que Marta todavía no ha perdonado a Diego'], answer: 1 },
    { type: 'short', q: '¿Por qué motivo original dejaron de hablarse los hermanos? (dos palabras)', accept: ['la herencia', 'por la herencia'] },
    { type: 'translate', line: 'Si alguien le hubiera dicho a Marta, hace un año, que volvería a hablar con su hermano Diego, probablemente no lo habría creído.', model: 'If someone had told Marta, a year ago, that she would speak to her brother Diego again, she probably would not have believed it.' }
  ]
},

{
  id: 'caja-recetas-alimentacion-b2', title: 'La caja de recetas de la abuela', level: 6, theme: 'alimentacion',
  text: 'En el fondo de un armario de la cocina, envuelta en un paño de cocina ya descolorido, mi madre encontró la vieja caja de recetas de mi abuela: una lata de galletas oxidada, llena de fichas de cartulina escritas a mano con una letra apretada y algo temblorosa en las últimas entradas. Dentro había más de ochenta recetas, ordenadas sin ningún criterio evidente salvo, quizás, el orden en que mi abuela las había ido aprendiendo a lo largo de su vida.\n\nAlgunas fichas incluían ingredientes que hoy resultarían casi imposibles de conseguir en la misma forma: manteca de cerdo comprada directamente al carnicero, harina sin marca concreta, medidas expresadas en "un puñado" o "lo que admita la masa", en lugar de gramos exactos. Otras, en cambio, llevaban anotaciones al margen añadidas años después, con tinta de otro color: correcciones, sustituciones de ingredientes que ya no encontraba en el mercado, o simples comentarios como "a tu padre no le gustó, menos azúcar la próxima vez".\n\nLa ficha que más nos emocionó a mi madre y a mí fue la del pastel de manzana que mi abuela preparaba cada cumpleaños familiar. En una esquina, casi ilegible, había escrito: "Este es el pastel que hizo que tu abuelo me pidiera matrimonio, así que más vale que salga bien". Ninguno de los dos sabíamos aquella historia hasta ese momento.\n\nMi madre ha decidido digitalizar cada ficha en cuanto tenga tiempo, para que el papel no se deteriore aún más, aunque insiste en conservar también los originales. Para ella, aquella caja oxidada no contiene simplemente instrucciones de cocina, sino ochenta pequeños fragmentos de la vida de una mujer que, de otro modo, se habrían perdido para siempre junto con ella.',
  gloss: [
    { es: 'una ficha (de receta)', en: 'una tarjeta pequeña, normalmente de cartulina, con información escrita' },
    { es: 'oxidado', en: 'que ha desarrollado óxido, la capa que se forma en el metal con la humedad' },
    { es: 'la manteca de cerdo', en: 'la grasa animal usada tradicionalmente para cocinar' },
    { es: 'digitalizar', en: 'convertir un documento físico en un archivo digital' },
    { es: 'deteriorarse', en: 'estropearse o empeorar con el paso del tiempo' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué revela la anotación sobre el pastel de manzana?', options: ['Una receta fallida que nunca se repitió', 'Una historia familiar desconocida hasta ese momento', 'Un error de la abuela al escribir la ficha'], answer: 1 },
    { type: 'mcq', q: '¿Qué significa para la madre esta caja de recetas, según el último párrafo?', options: ['Simples instrucciones prácticas de cocina, sin más valor', 'Fragmentos personales de la vida de su propia madre', 'Un objeto que piensa tirar pronto'], answer: 1 },
    { type: 'short', q: '¿Cuántas recetas había, aproximadamente? (una palabra o número)', accept: ['ochenta', 'más de ochenta'] },
    { type: 'translate', line: 'Este es el pastel que hizo que tu abuelo me pidiera matrimonio', model: 'This is the cake that made your grandfather propose to me' }
  ]
},

{
  id: 'curva-olvido-educacion-b2', title: 'Por qué olvidamos casi todo lo que estudiamos', level: 6, theme: 'educacion',
  text: 'A finales del siglo diecinueve, el psicólogo alemán Hermann Ebbinghaus llevó a cabo un experimento tan sencillo como incómodo de aceptar: memorizó listas de sílabas sin sentido y midió, día tras día, cuánto recordaba de ellas. El resultado, conocido hoy como la "curva del olvido", mostró algo que cualquier estudiante reconoce por experiencia propia: sin ningún tipo de repaso, olvidamos la mayor parte de lo aprendido en cuestión de días, y una buena parte de ello en cuestión de horas.\n\nLo interesante del hallazgo de Ebbinghaus no es tanto que olvidemos —eso resulta bastante intuitivo—, sino la forma exacta en que lo hacemos. El olvido no avanza a un ritmo constante: la pérdida es muy rápida en las primeras veinticuatro horas después de estudiar algo, y después se ralentiza progresivamente, de modo que lo que sobrevive a la primera semana tiende a mantenerse mucho más tiempo.\n\nEsta curva tiene una implicación práctica que muchos sistemas educativos todavía no aprovechan del todo: repasar un contenido justo en el momento en que está a punto de olvidarse por completo "reinicia" la curva, y cada repaso sucesivo hace que el olvido posterior sea más lento que el anterior. Es la base científica de lo que hoy se conoce como repetición espaciada, una técnica cada vez más utilizada en aplicaciones de idiomas y de memorización en general.\n\nParadójicamente, la mayoría de los estudiantes siguen concentrando todo su estudio justo antes de un examen, exactamente la estrategia que la propia curva del olvido predice como menos eficaz a largo plazo. Distribuir el mismo número de horas de estudio a lo largo de varias semanas, en lugar de concentrarlas en una sola noche, produce sistemáticamente mejores resultados de retención, aunque exija, eso sí, bastante más disciplina y planificación previa.',
  gloss: [
    { es: 'una sílaba sin sentido', en: 'un conjunto de letras que se pronuncia como palabra pero no significa nada' },
    { es: 'ralentizarse', en: 'volverse más lento' },
    { es: 'la repetición espaciada', en: 'una técnica de estudio que reparte los repasos en el tiempo en vez de concentrarlos' },
    { es: 'la retención (de información)', en: 'la capacidad de conservar en la memoria lo aprendido' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué es lo verdaderamente novedoso del hallazgo de Ebbinghaus, según el texto?', options: ['Que olvidamos con el tiempo, algo ya obvio', 'La forma exacta y el ritmo con que se produce el olvido', 'Que la memoria humana es perfecta al principio'], answer: 1 },
    { type: 'mcq', q: '¿Qué crítica implícita hace el texto sobre el hábito de estudiar la noche anterior a un examen?', options: ['Que es la estrategia más eficaz posible', 'Que contradice justo lo que la curva del olvido recomendaría', 'Que no tiene ninguna relación con la curva del olvido'], answer: 1 },
    { type: 'short', q: '¿De qué nacionalidad era Ebbinghaus? (una palabra)', accept: ['alemán', 'aleman'] },
    { type: 'translate', line: 'sin ningún tipo de repaso, olvidamos la mayor parte de lo aprendido en cuestión de días', model: 'without any kind of review, we forget most of what we learned within a matter of days' }
  ]
},

{
  id: 'teletrabajo-productividad-trabajo-b2', title: 'El teletrabajo, ¿mito o realidad productiva?', level: 7, theme: 'trabajo',
  text: 'Cuando millones de empleados se vieron obligados a trabajar desde casa de un día para otro, muchas empresas asumieron que la productividad se desplomaría de inmediato. Sorprendentemente, varios estudios posteriores mostraron justo lo contrario: en no pocos sectores, la productividad medida por hora trabajada incluso aumentó durante los primeros meses de teletrabajo generalizado.\n\nSin embargo, atribuir ese aumento únicamente al hecho de trabajar desde casa sería, según reconocen los propios investigadores, una simplificación excesiva. Gran parte de la mejora inicial parece explicarse por factores paralelos: menos tiempo perdido en desplazamientos, horarios más flexibles adaptados al ritmo personal de cada trabajador, y una motivación inicial elevada, en parte impulsada por el miedo a perder el empleo durante una crisis económica.\n\nCon el paso de los meses, ese efecto inicial empezó a matizarse considerablemente. Algunos estudios posteriores detectaron un descenso gradual en la colaboración espontánea entre compañeros, precisamente el tipo de intercambio informal que suele generar ideas nuevas y que resulta mucho más difícil de reproducir a través de una videollamada programada. Asimismo, empleados jóvenes, recién incorporados a sus puestos, reportaron sistemáticamente más dificultades para aprender de compañeros con más experiencia sin la interacción presencial cotidiana.\n\nLa conclusión que empieza a consolidarse entre quienes estudian el fenómeno no es que el teletrabajo sea, sin más, mejor o peor que el trabajo presencial, sino que su efecto depende enormemente del tipo de tarea, del sector y de la etapa profesional de cada persona. Un modelo híbrido, que combine ambos formatos según la necesidad concreta de cada momento, parece ofrecer hoy el equilibrio más razonable entre los beneficios y los costes que ambos extremos llevan aparejados.',
  gloss: [
    { es: 'desplomarse', en: 'caer de forma brusca y repentina' },
    { es: 'un desplazamiento (al trabajo)', en: 'el trayecto que se hace habitualmente para llegar al lugar de trabajo' },
    { es: 'matizar', en: 'añadir precisiones que suavizan o corrigen una afirmación anterior' },
    { es: 'aparejado', en: 'que va unido o es consecuencia directa de otra cosa' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué matiza el texto sobre el aumento inicial de productividad en el teletrabajo?', options: ['Que se debió únicamente a trabajar desde casa', 'Que probablemente se debió a varios factores combinados, no solo al teletrabajo en sí', 'Que en realidad no existió tal aumento'], answer: 1 },
    { type: 'mcq', q: '¿Qué conclusión final propone el texto sobre el teletrabajo frente al trabajo presencial?', options: ['Que uno es claramente superior al otro en todos los casos', 'Que su efecto depende del tipo de tarea y del contexto de cada persona', 'Que ambos modelos son exactamente equivalentes'], answer: 1 },
    { type: 'short', q: '¿Qué modelo se propone como equilibrio razonable? (una palabra)', accept: ['híbrido', 'hibrido', 'un modelo híbrido'] },
    { type: 'translate', line: 'la productividad medida por hora trabajada incluso aumentó durante los primeros meses de teletrabajo generalizado', model: 'productivity measured per hour worked even increased during the first months of widespread remote work' }
  ]
},

{
  id: 'garantia-electrodomestico-servicios-b2', title: 'La batalla por una garantía de dos años', level: 6, theme: 'servicios',
  text: 'Cuando la lavadora de Pilar dejó de funcionar catorce meses después de comprarla, ella asumió que la reparación o la sustitución del aparato correrían por cuenta del fabricante, ya que la garantía legal en España cubre dos años completos desde la compra. La tienda donde la había adquirido, sin embargo, le informó de que solo ofrecían garantía comercial de un año, y que a partir de ese momento cualquier reparación correría por cuenta suya.\n\nPilar, que había trabajado brevemente en el sector de consumo años atrás, sabía que la ley española distingue precisamente entre la garantía comercial que ofrece voluntariamente cada tienda y la garantía legal, obligatoria por ley, que protege al consumidor durante dos años frente a cualquier defecto de fabricación. Aun así, la vendedora insistió varias veces en que "la garantía ya había caducado", como si el plazo legal simplemente no existiera.\n\nEn lugar de discutir más con la vendedora, Pilar decidió presentar una reclamación formal por escrito, citando expresamente el artículo correspondiente de la ley de garantías vigente. Adjuntó copia del ticket de compra y explicó con detalle la avería, un fallo en el motor que ningún uso indebido por su parte podía haber provocado.\n\nDos semanas después, recibió una llamada del servicio de atención al cliente de la cadena, disculpándose por la confusión inicial y ofreciéndole la reparación gratuita del electrodoméstico. Pilar sospecha que si hubiera aceptado sin más la primera respuesta de la vendedora, como probablemente hacen muchos consumidores por simple desconocimiento, habría acabado pagando una reparación que, legalmente, nunca le correspondía asumir.',
  gloss: [
    { es: 'la garantía legal', en: 'la protección mínima que la ley obliga a ofrecer al comprador de un producto' },
    { es: 'caducar', en: 'dejar de tener validez tras un plazo determinado' },
    { es: 'una avería', en: 'un fallo o daño que impide que algo funcione correctamente' },
    { es: 'un uso indebido', en: 'un uso incorrecto o distinto del previsto para un producto' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué error comete inicialmente la vendedora, según el texto?', options: ['Confunde la garantía comercial con la garantía legal obligatoria', 'Ofrece una garantía superior a la legal', 'Se niega a vender el producto'], answer: 0 },
    { type: 'mcq', q: '¿Qué sugiere el texto que le habría pasado a Pilar si hubiera aceptado la primera respuesta?', options: ['Habría recibido la reparación gratis de todos modos', 'Probablemente habría pagado una reparación que no le correspondía', 'La tienda la habría indemnizado igualmente'], answer: 1 },
    { type: 'short', q: '¿Cuántos meses después de comprarla se estropeó la lavadora? (una palabra)', accept: ['catorce'] },
    { type: 'translate', line: 'la garantía legal en España cubre dos años completos desde la compra', model: 'the legal warranty in Spain covers two full years from the date of purchase' }
  ]
},

/* Batch 3 of 8. */
{
  id: 'maraton-lesion-cuerpo-b2', title: 'Volver a correr después de la rotura', level: 6, theme: 'cuerpo',
  text: 'Diez meses después de romperse el tendón de Aquiles en pleno entrenamiento, Julián volvió a cruzar la línea de salida de una carrera, aunque esta vez con expectativas mucho más modestas que antaño. La lesión, una de las más temidas entre corredores de fondo, había supuesto una operación quirúrgica, semanas enteras con la pierna inmovilizada y meses de rehabilitación antes de poder siquiera caminar con normalidad.\n\nDurante la fase más dura de la recuperación, Julián apenas podía apoyar el pie en el suelo sin sentir un dolor agudo que le recorría toda la pantorrilla. El fisioterapeuta le advirtió desde el principio que la impaciencia era, con diferencia, el mayor enemigo de una recuperación como esta: forzar el tendón demasiado pronto podía provocar una nueva rotura, esta vez posiblemente definitiva para su carrera deportiva.\n\nFísicamente, Julián reconoce que ya no es el mismo corredor de antes. Ha perdido buena parte de la musculatura que tenía en la pierna afectada, y su forma de pisar ha cambiado ligeramente para compensar una rigidez que probablemente nunca desaparecerá del todo. Sin embargo, insiste en que la lesión también le enseñó algo que años de entrenamiento exigente nunca le habían enseñado: a escuchar las señales de su propio cuerpo en lugar de ignorarlas sistemáticamente por ambición.\n\nAquella carrera de vuelta la terminó casi diez minutos más lento que su mejor marca personal, un tiempo que, antes de la lesión, le habría parecido decepcionante. Cruzó la meta sonriendo de todos modos, consciente de que el verdadero logro no tenía nada que ver con el cronómetro, sino con haber vuelto a ponerse en la línea de salida después de haber dudado, más de una vez, si volvería a correr en serio alguna vez.',
  gloss: [
    { es: 'el tendón de Aquiles', en: 'el tendón que une el músculo de la pantorrilla con el talón' },
    { es: 'quirúrgico', en: 'relacionado con una operación realizada por un cirujano' },
    { es: 'la pantorrilla', en: 'la parte trasera de la pierna, entre la rodilla y el tobillo' },
    { es: 'la rigidez', en: 'la falta de flexibilidad o movimiento normal de una articulación' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué aprendió Julián a raíz de la lesión, según el texto?', options: ['A entrenar con más intensidad que antes', 'A prestar atención a las señales de su propio cuerpo', 'A dejar de correr definitivamente'], answer: 1 },
    { type: 'mcq', q: '¿Qué actitud transmite Julián al cruzar la meta más lento que antes?', options: ['Frustración por el mal resultado', 'Satisfacción, centrada en haber vuelto a competir, no en el tiempo', 'Indiferencia total hacia la carrera'], answer: 1 },
    { type: 'short', q: '¿Qué tendón se rompió Julián? (dos palabras)', accept: ['de aquiles', 'tendón de aquiles', 'el de aquiles'] },
    { type: 'translate', line: 'El fisioterapeuta le advirtió desde el principio que la impaciencia era, con diferencia, el mayor enemigo de una recuperación como esta', model: 'The physiotherapist warned him from the start that impatience was, by far, the biggest enemy of a recovery like this one' }
  ]
},

{
  id: 'introvertido-retrato-caracter-b2', title: 'El silencio de Óscar no es timidez', level: 6, theme: 'caracter',
  text: 'Quienes conocen a Óscar desde hace poco suelen confundir su silencio con timidez, o incluso con desinterés, pero quienes lo tratan desde hace años saben que se trata de algo bastante distinto. Óscar es, sencillamente, una persona profundamente introvertida: no le incomoda hablar en público cuando resulta necesario, pero necesita después largos periodos de soledad para recuperar la energía que ese tipo de situaciones le consume.\n\nEn una reunión de trabajo, mientras otros compañeros piensan en voz alta y van construyendo sus ideas sobre la marcha, Óscar prefiere escuchar primero, procesar toda la información en silencio, y solo entonces intervenir con una opinión ya bastante elaborada. Esto ha llevado, más de una vez, a que algunos jefes lo consideraran poco participativo, sin darse cuenta de que su forma de aportar simplemente sigue un ritmo distinto al de la mayoría.\n\nFuera del trabajo, Óscar tiene un grupo reducido de amigos con los que mantiene relaciones muy profundas, y evita sistemáticamente las fiestas multitudinarias que a otros les resultan estimulantes. Una noche de conversación tranquila con dos o tres personas le proporciona mucha más satisfacción que cualquier evento social masivo, por animado que este resulte para los demás asistentes.\n\nLo que distingue realmente a Óscar no es, por tanto, la falta de habilidades sociales, sino una forma distinta de gestionar su energía social: mientras que una persona extrovertida se recarga precisamente en compañía de otros, Óscar necesita la soledad para recuperarse, y el contacto social prolongado, por agradable que sea, termina agotándolo de una manera que a muchos les resulta difícil de comprender del todo.',
  gloss: [
    { es: 'introvertido', en: 'que prefiere la reflexión interior y necesita soledad para recuperar energía' },
    { es: 'participativo', en: 'que interviene activamente y con frecuencia en una conversación o actividad' },
    { es: 'multitudinario', en: 'que reúne a un gran número de personas' },
    { es: 'recargarse (de energía)', en: 'recuperar fuerzas o energía' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué malentendido sufre Óscar frecuentemente, según el texto?', options: ['Que lo consideren extrovertido en exceso', 'Que confundan su introversión con timidez o desinterés', 'Que piensen que no tiene amigos'], answer: 1 },
    { type: 'mcq', q: '¿Qué distingue realmente a una persona introvertida como Óscar, según el texto?', options: ['La falta de habilidades sociales', 'La forma en que gestiona y recupera su energía social', 'La incapacidad de hablar en público'], answer: 1 },
    { type: 'short', q: '¿Qué prefiere Óscar en una reunión antes de opinar? (una palabra)', accept: ['escuchar'] },
    { type: 'translate', line: 'Óscar es, sencillamente, una persona profundamente introvertida', model: 'Óscar is, quite simply, a deeply introverted person' }
  ]
},

{
  id: 'torneo-ajedrez-ocio-b2', title: 'El torneo que casi no gana nadie', level: 6, theme: 'ocio',
  text: 'Cuando se organizó el primer torneo de ajedrez del barrio, nadie esperaba que la final acabara decidiéndose, literalmente, por sorteo. Participaron cuarenta y dos vecinos de edades muy distintas, desde adolescentes que apenas conocían las reglas básicas hasta jubilados que llevaban jugando desde niños, y el formato elegido —eliminación directa a una sola partida— garantizaba sorpresas desde la primera ronda.\n\nLa gran sorpresa del torneo llegó en cuartos de final, cuando una chica de catorce años eliminó al que hasta entonces se consideraba favorito indiscutible, un jubilado que había jugado en competiciones federadas durante décadas. Ella misma reconoció después que ni siquiera esperaba ganar aquella partida, y que se limitó a jugar con calma mientras su rival, quizás confiado en exceso, cometía un error que ella supo aprovechar sin dudarlo.\n\nLa final, sin embargo, se complicó de una forma que nadie había previsto en el reglamento: tras casi tres horas de partida, ambos finalistas llegaron al límite de tiempo asignado con posiciones prácticamente idénticas de material, sin que ninguno lograra ninguna ventaja decisiva. El reglamento, redactado deprisa por los organizadores, no contemplaba ningún desempate para esa situación exacta.\n\nTras una breve deliberación entre los organizadores, y con el acuerdo explícito de ambos finalistas, se decidió resolver el empate lanzando una moneda al aire en mitad de la plaza, ante el aplauso y las risas de todos los espectadores presentes. El ganador, un adolescente de dieciséis años, admitió con humor que aquella era, con diferencia, la victoria menos merecida de toda su vida ajedrecística, aunque el trofeo, dijo entre risas, pesaba exactamente lo mismo que si la hubiera ganado jugando.',
  gloss: [
    { es: 'un sorteo', en: 'un método para decidir algo al azar, sin que dependa de habilidad' },
    { es: 'eliminación directa', en: 'un formato de torneo en el que perder una partida supone quedar eliminado' },
    { es: 'federado', en: 'inscrito oficialmente en una federación deportiva' },
    { es: 'un desempate', en: 'un método para decidir un ganador cuando el resultado queda igualado' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué actitud muestran los finalistas ante la resolución por sorteo?', options: ['Indignación y protesta formal', 'Aceptación tranquila, incluso con humor', 'Rechazo absoluto a participar'], answer: 1 },
    { type: 'mcq', q: '¿Qué sugiere la anécdota de la chica de catorce años sobre el favorito eliminado?', options: ['Que ella hizo trampas para ganar', 'Que el exceso de confianza del rival influyó en su derrota', 'Que el resultado fue arreglado de antemano'], answer: 1 },
    { type: 'short', q: '¿Cómo se resolvió finalmente el empate en la final? (dos palabras)', accept: ['una moneda', 'lanzando una moneda', 'con una moneda'] },
    { type: 'translate', line: 'Participaron cuarenta y dos vecinos de edades muy distintas', model: 'Forty-two neighbors of very different ages took part' }
  ]
},

{
  id: 'covivienda-mayores-vivienda-b2', title: 'Envejecer juntos, pero cada uno en su casa', level: 6, theme: 'vivienda',
  text: 'A las afueras de Zaragoza, un grupo de veintiséis personas mayores de sesenta y cinco años ha construido, literalmente desde cero, una alternativa a la residencia tradicional y a la soledad del piso individual: una cooperativa de covivienda pensada específicamente para envejecer acompañado sin renunciar a la independencia. Cada residente tiene su propio apartamento privado, con cocina y baño completos, pero el edificio comparte también amplias zonas comunes: comedor colectivo, biblioteca, huerto y una sala de cuidados para quien lo necesite temporalmente.\n\nEl edificio se distribuye en tres plantas alrededor de un patio central luminoso, con pasillos anchos pensados para sillas de ruedas y andadores, y sin ningún escalón que pudiera suponer una barrera para la movilidad reducida. Los apartamentos individuales resultan más pequeños que una vivienda convencional, pero a cambio los residentes disfrutan de espacios comunes mucho más amplios de lo que cualquiera de ellos podría permitirse viviendo solo.\n\nLa decisión más importante, según cuentan varios de los fundadores del proyecto, no fue arquitectónica sino social: establecer desde el principio unas normas claras de convivencia y turnos rotatorios para las tareas compartidas, de manera que nadie sintiera que cargaba con más responsabilidad que los demás. Cada residente dedica unas horas semanales a tareas colectivas, desde cocinar para el grupo hasta organizar actividades culturales o gestionar pequeñas reparaciones del edificio.\n\nLo que más valoran quienes viven allí no es tanto el ahorro económico, que también existe, sino la sensación de tener vecinos con quienes de verdad se puede contar en caso de enfermedad o de soledad repentina, algo que muchos de ellos, tras enviudar o ver a sus hijos mudarse lejos, habían dejado de imaginar posible a esta edad.',
  gloss: [
    { es: 'una cooperativa de covivienda', en: 'un proyecto residencial en el que los vecinos comparten propiedad y espacios comunes' },
    { es: 'un andador', en: 'un aparato de apoyo para caminar, usado por personas con movilidad reducida' },
    { es: 'rotatorio', en: 'que cambia de persona por turnos, de forma organizada' },
    { es: 'enviudar', en: 'perder al cónyuge por fallecimiento' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué distingue este proyecto de una residencia tradicional, según el texto?', options: ['Que combina independencia privada con vida comunitaria organizada', 'Que impone normas más estrictas que una residencia', 'Que no permite ninguna interacción entre vecinos'], answer: 0 },
    { type: 'mcq', q: '¿Qué valoran más los residentes, según el último párrafo?', options: ['El ahorro económico, por encima de todo', 'Contar con vecinos de confianza ante la enfermedad o la soledad', 'La arquitectura moderna del edificio'], answer: 1 },
    { type: 'short', q: '¿Cerca de qué ciudad está esta covivienda? (una palabra)', accept: ['zaragoza'] },
    { type: 'translate', line: 'Cada residente tiene su propio apartamento privado, con cocina y baño completos', model: 'Each resident has their own private apartment, with a full kitchen and bathroom' }
  ]
},

{
  id: 'moda-rapida-compras-b2', title: '¿Merece la pena una camiseta de tres euros?', level: 7, theme: 'compras',
  text: 'Se ha calculado que la industria textil produce hoy más del doble de prendas de ropa que hace apenas veinte años, impulsada en gran parte por el modelo conocido como "moda rápida": colecciones nuevas cada pocas semanas, precios extraordinariamente bajos, y una expectativa implícita de que cada prenda se use solo unas pocas veces antes de descartarse.\n\nLos defensores de este modelo argumentan que ha democratizado el acceso a la moda, permitiendo que personas con ingresos modestos vistan siguiendo tendencias que antes estaban reservadas a quienes podían permitirse ropa de diseñador. Es innegable que una camiseta de tres euros resulta, en términos puramente económicos, mucho más accesible que una alternativa producida de forma ética y sostenible, que fácilmente puede costar diez o veinte veces más.\n\nSin embargo, ese precio tan bajo esconde costes que el comprador final rara vez ve reflejados en la etiqueta. Diversas investigaciones periodísticas han documentado condiciones laborales precarias en fábricas textiles de varios países asiáticos, con jornadas extenuantes y salarios muy por debajo de lo necesario para cubrir necesidades básicas. A esto se suma el impacto ambiental: la industria textil genera, según distintas estimaciones, más emisiones de gases de efecto invernadero que los vuelos internacionales y el transporte marítimo combinados.\n\nNo se trata de sugerir que cada consumidor individual sea responsable de un sistema industrial global tan complejo, ni de negar que muchas familias dependen de esos precios bajos para vestir a sus hijos. Aun así, cada vez más voces dentro del propio sector textil defienden que comprar menos prendas, pero de mejor calidad y duración, terminaría resultando más barato a largo plazo, además de reducir de forma sustancial tanto el sufrimiento humano como el daño ambiental asociados a este modelo de consumo.',
  gloss: [
    { es: 'una prenda (de ropa)', en: 'cada pieza individual de vestimenta' },
    { es: 'democratizar (el acceso a algo)', en: 'hacer que algo antes exclusivo esté disponible para mucha más gente' },
    { es: 'extenuante', en: 'que agota física o mentalmente de forma extrema' },
    { es: 'los gases de efecto invernadero', en: 'los gases que retienen el calor en la atmósfera y contribuyen al cambio climático' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué argumento a favor de la moda rápida reconoce el texto, aunque después lo matice?', options: ['Que reduce la contaminación ambiental', 'Que ha democratizado el acceso a la moda para rentas más bajas', 'Que mejora las condiciones laborales del sector'], answer: 1 },
    { type: 'mcq', q: '¿Qué posición final adopta el texto sobre el consumo de ropa?', options: ['Defiende sin matices el modelo de moda rápida', 'Sugiere comprar menos prendas, pero de mejor calidad y duración', 'Propone prohibir legalmente la moda rápida'], answer: 1 },
    { type: 'short', q: '¿Cómo se llama el modelo descrito en el texto? (dos palabras)', accept: ['moda rápida', 'moda rapida'] },
    { type: 'translate', line: 'la industria textil produce hoy más del doble de prendas de ropa que hace apenas veinte años', model: 'the textile industry today produces more than double the clothing items it did barely twenty years ago' }
  ]
},

{
  id: 'como-se-hace-una-ley-politica-b2', title: 'El largo camino de una idea hasta convertirse en ley', level: 7, theme: 'politica',
  text: 'Cuando un ciudadano piensa en cómo se aprueba una ley, suele imaginar un proceso relativamente sencillo: un partido propone una idea, el parlamento vota, y la idea se convierte automáticamente en norma vigente. La realidad, sin embargo, resulta considerablemente más larga y llena de etapas intermedias que rara vez aparecen reflejadas en un titular de prensa.\n\nTodo empieza con un anteproyecto de ley, normalmente redactado por el ministerio competente en la materia, que debe pasar primero por un proceso de consulta pública en el que cualquier ciudadano u organización puede presentar alegaciones. Solo después de incorporar, o rechazar de forma justificada, esas alegaciones, el texto se convierte formalmente en un proyecto de ley que el gobierno remite al parlamento.\n\nEn la cámara baja, el proyecto se divide en artículos que se debaten y votan, en ocasiones, uno por uno, mientras los distintos grupos parlamentarios presentan enmiendas para modificar aspectos concretos del texto. Una vez aprobado por la cámara baja, el proyecto pasa a la cámara alta, donde puede sufrir modificaciones adicionales, y solo entonces regresa a la primera cámara para una votación final sobre esos cambios.\n\nLo que muchos ciudadanos ignoran es que, incluso después de superar todas estas fases, una ley aprobada puede todavía ser recurrida ante el tribunal constitucional si algún grupo considera que vulnera derechos fundamentales, un proceso que puede alargar la incertidumbre legal durante meses o incluso años adicionales. Entre la idea inicial de un ministerio y la aplicación efectiva de la norma en la vida cotidiana de los ciudadanos, pueden llegar a transcurrir, sin ninguna anomalía en el proceso, más de dos años completos.',
  gloss: [
    { es: 'un anteproyecto de ley', en: 'el primer borrador oficial de una futura ley, antes de su tramitación formal' },
    { es: 'una alegación', en: 'un argumento o una objeción que se presenta formalmente durante un proceso legal' },
    { es: 'una enmienda', en: 'una propuesta de cambio a un texto legal en tramitación' },
    { es: 'vulnerar (un derecho)', en: 'violar o no respetar un derecho reconocido legalmente' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué corrige el texto sobre la percepción habitual del proceso legislativo?', options: ['Que en realidad es mucho más simple de lo que parece', 'Que el proceso real es mucho más largo y con más etapas de lo que se suele imaginar', 'Que las leyes se aprueban sin ningún debate'], answer: 1 },
    { type: 'mcq', q: '¿Qué puede ocurrir incluso después de que una ley supere todas las fases parlamentarias?', options: ['Nada, el proceso queda completamente cerrado', 'Puede ser recurrida ante el tribunal constitucional', 'El gobierno puede anularla sin más trámite'], answer: 1 },
    { type: 'short', q: '¿Qué documento inicia el proceso, según el texto? (dos palabras)', accept: ['anteproyecto de ley', 'un anteproyecto de ley'] },
    { type: 'translate', line: 'La realidad, sin embargo, resulta considerablemente más larga y llena de etapas intermedias que rara vez aparecen reflejadas en un titular de prensa', model: 'The reality, however, is considerably longer and full of intermediate stages that rarely make it into a news headline' }
  ]
},

{
  id: 'estafa-cripto-economia-b2', title: 'La inversión que prometía demasiado', level: 6, theme: 'economia',
  text: 'Ramón llevaba meses viendo anuncios en redes sociales de una plataforma de inversión en criptomonedas que prometía rendimientos del quince por ciento mensual, una cifra que, como reconoce ahora con cierta vergüenza, debería haberle hecho sospechar desde el primer momento. Sin embargo, varios conocidos suyos ya habían invertido pequeñas cantidades y aseguraban estar recibiendo puntualmente los pagos prometidos.\n\nAnimado por esos testimonios, Ramón decidió invertir inicialmente mil doscientos euros, buena parte de sus ahorros disponibles en aquel momento. Durante los dos primeros meses, la plataforma cumplió exactamente lo prometido, transfiriéndole religiosamente los rendimientos anunciados a su cuenta bancaria, lo que reforzó completamente su confianza en el sistema.\n\nEnvalentonado por aquellos resultados iniciales, Ramón decidió pedir un pequeño préstamo personal para ampliar considerablemente su inversión, convencido de que estaba ante una oportunidad única que no podía dejar escapar. Fue precisamente entonces, apenas dos semanas después de ampliar su inversión, cuando la plataforma dejó de responder a los correos electrónicos, y su página web desapareció de internet sin ninguna explicación previa.\n\nLo que Ramón había vivido, según le explicó posteriormente la policía especializada en delitos económicos, era un esquema piramidal clásico: los primeros pagos se financian con el dinero de los inversores más recientes, precisamente para generar la confianza necesaria que anima a la gente a invertir sumas cada vez mayores, hasta que los organizadores desaparecen con el capital acumulado. Ramón perdió no solo sus ahorros iniciales, sino también el dinero del préstamo, y admite que lo más difícil de superar no fue tanto la pérdida económica en sí, sino aceptar cuánto se había dejado convencer por unos resultados que, mirados con perspectiva, resultaban evidentemente insostenibles.',
  gloss: [
    { es: 'el rendimiento (de una inversión)', en: 'la ganancia económica que produce una inversión' },
    { es: 'envalentonado', en: 'que ha ganado confianza o atrevimiento tras un éxito previo' },
    { es: 'un esquema piramidal', en: 'un fraude que paga a los primeros inversores con el dinero de los siguientes' },
    { es: 'insostenible', en: 'que no puede mantenerse en el tiempo de forma realista' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué función cumplieron los primeros pagos recibidos por Ramón, según la explicación policial?', options: ['Eran ganancias reales generadas por inversión legítima', 'Servían para generar confianza y atraer inversiones mayores', 'Eran un error administrativo de la plataforma'], answer: 1 },
    { type: 'mcq', q: '¿Qué es lo más difícil de aceptar para Ramón, según el texto?', options: ['La pérdida económica en sí misma', 'Haberse dejado convencer por resultados evidentemente insostenibles', 'La reacción de sus conocidos'], answer: 1 },
    { type: 'short', q: '¿Cuánto invirtió Ramón inicialmente? (una cifra en euros)', accept: ['1200', 'mil doscientos euros', 'mil doscientos'] },
    { type: 'translate', line: 'Ramón llevaba meses viendo anuncios en redes sociales de una plataforma de inversión en criptomonedas que prometía rendimientos del quince por ciento mensual', model: 'Ramón had spent months seeing social media ads for a cryptocurrency investment platform promising fifteen percent monthly returns' }
  ]
},

{
  id: 'impuesto-azucar-salud-b2', title: '¿Debería haber un impuesto sobre el azúcar?', level: 6, theme: 'salud',
  text: 'Varios países han introducido en los últimos años un impuesto especial sobre las bebidas azucaradas, con el objetivo declarado de reducir su consumo y, con ello, la incidencia de obesidad y diabetes tipo dos entre la población. México, uno de los primeros países en aplicar esta medida en 2014, ofrece hoy uno de los conjuntos de datos más completos para evaluar si la estrategia realmente funciona.\n\nUn estudio publicado por investigadores del Instituto Nacional de Salud Pública mexicano concluyó que el consumo de bebidas azucaradas descendió aproximadamente un siete por ciento durante el segundo año tras la implantación del impuesto, con una caída todavía mayor entre los hogares de menores ingresos, precisamente el grupo más vulnerable a las enfermedades asociadas al exceso de azúcar.\n\nLos críticos de este tipo de impuestos sostienen, sin embargo, que penalizan desproporcionadamente a las familias con menos recursos económicos, para quienes cualquier subida de precio representa un porcentaje mayor de sus ingresos disponibles. También señalan que muchos consumidores simplemente sustituyen las bebidas gravadas por otras alternativas igualmente poco saludables que el impuesto no contempla, como ciertos zumos industriales con azúcares añadidos.\n\nLa evidencia disponible hasta ahora sugiere que un impuesto aislado, sin más medidas complementarias, difícilmente resuelve un problema de salud pública tan complejo como la obesidad. Los países donde el impuesto se ha combinado con etiquetado nutricional claro, restricciones a la publicidad dirigida a menores, y campañas educativas sostenidas, muestran resultados considerablemente mejores que aquellos que se han limitado únicamente a subir el precio en el punto de venta.',
  gloss: [
    { es: 'la incidencia (de una enfermedad)', en: 'la frecuencia con la que aparecen nuevos casos de una enfermedad' },
    { es: 'penalizar', en: 'perjudicar o castigar de alguna forma, en este caso económicamente' },
    { es: 'gravado', en: 'sujeto a un impuesto' },
    { es: 'el etiquetado nutricional', en: 'la información sobre nutrientes que debe figurar en el envase de un alimento' }
  ],
  questions: [
    { type: 'mcq', q: '¿Qué matiz añade el texto sobre la eficacia del impuesto por sí solo?', options: ['Que resuelve por completo el problema de la obesidad', 'Que funciona mejor combinado con otras medidas complementarias', 'Que no tiene ningún efecto medible'], answer: 1 },
    { type: 'mcq', q: '¿Qué crítica plantean los detractores del impuesto sobre bebidas azucaradas?', options: ['Que no reduce en absoluto el consumo', 'Que afecta desproporcionadamente a las familias con menos recursos', 'Que solo se aplica en países ricos'], answer: 1 },
    { type: 'short', q: '¿En qué país se aplicó este impuesto por primera vez, según el texto? (una palabra)', accept: ['méxico', 'mexico'] },
    { type: 'translate', line: 'México, uno de los primeros países en aplicar esta medida en 2014, ofrece hoy uno de los conjuntos de datos más completos para evaluar si la estrategia realmente funciona.', model: 'Mexico, one of the first countries to apply this measure in 2014, today offers one of the most complete data sets for evaluating whether the strategy really works.' }
  ]
},

{
  id: 'arte-urbano-vandalismo-arte-b2', title: '¿Arte urbano o vandalismo?', level: 6, theme: 'arte',
  text: 'La pregunta de si una pintada en una pared constituye arte o vandalismo lleva décadas dividiendo a artistas, vecinos y autoridades municipales, sin que exista una respuesta única aplicable a todos los casos. La distinción, en la práctica, rara vez depende de criterios puramente estéticos, y tiene mucho más que ver con el consentimiento del propietario del muro y con el contexto legal en que se realiza la obra.\n\nSe entiende generalmente por arte urbano aquellas intervenciones realizadas con autorización explícita, ya sea del propietario del espacio o de un ayuntamiento que organiza festivales específicos para este tipo de expresión artística. En cambio, se clasifica como vandalismo cualquier intervención realizada sin consentimiento, independientemente de la calidad artística de la obra resultante, un matiz puramente legal que a menudo resulta contraintuitivo para el público general.\n\nAlgunos de los artistas urbanos más reconocidos internacionalmente empezaron precisamente pintando sin autorización, y varias de esas primeras obras, consideradas vandalismo en su momento, hoy se protegen legalmente como patrimonio artístico e incluso atraen turismo específico a los barrios donde se ubican. Esta paradoja ha llevado a algunos ayuntamientos a legalizar retroactivamente ciertas obras, mientras persiguen con dureza otras intervenciones de artistas menos conocidos, generando acusaciones de doble rasero.\n\nDetrás de este debate se esconde, en el fondo, una pregunta más amplia sobre quién tiene derecho a decidir qué imágenes ocupan el espacio público urbano: si únicamente el propietario legal de cada muro, o también la comunidad que convive diariamente con esas paredes. Ninguna legislación actual ofrece, por el momento, una respuesta completamente satisfactoria a esa tensión de fondo.',
  gloss: [
    { es: 'una pintada', en: 'un dibujo o texto pintado, normalmente en una pared, sin usar técnicas de pincel formal' },
    { es: 'el vandalismo', en: 'el daño intencionado a una propiedad pública o privada' },
    { es: 'contraintuitivo', en: 'que va en contra de lo que parecería lógico a primera vista' },
    { es: 'un doble rasero', en: 'aplicar criterios distintos e injustos a casos similares' }
  ],
  questions: [
    { type: 'mcq', q: '¿De qué depende realmente, según el texto, que algo se considere arte o vandalismo?', options: ['Únicamente de la calidad estética de la obra', 'Del consentimiento legal para realizar la obra, no de su calidad', 'De la opinión mayoritaria de los vecinos'], answer: 1 },
    { type: 'mcq', q: '¿Qué paradoja señala el texto sobre algunos artistas urbanos reconocidos?', options: ['Que nunca pintaron sin autorización', 'Que obras antes consideradas vandalismo hoy se protegen como patrimonio', 'Que todos sus trabajos fueron legales desde el principio'], answer: 1 },
    { type: 'short', q: '¿Qué genera la legalización retroactiva de unas obras y no de otras, según el texto? (dos palabras)', accept: ['doble rasero', 'acusaciones de doble rasero'] },
    { type: 'translate', line: 'Se entiende generalmente por arte urbano aquellas intervenciones realizadas con autorización explícita', model: 'Urban art is generally understood to mean interventions carried out with explicit authorization' }
  ]
},

{
  id: 'voluntarios-reforestacion-naturaleza-b2', title: 'Los árboles que plantamos después del incendio', level: 6, theme: 'naturaleza',
  text: 'Un año después de que un incendio forestal arrasara casi dos mil hectáreas de monte en la sierra, un grupo de voluntarios organizados a través de una asociación ambiental local ha empezado a replantar la zona con especies autóctonas seleccionadas cuidadosamente para resistir mejor futuros incendios. La actividad, que se repite cada fin de semana desde hace tres meses, ha reunido ya a más de trescientas personas de edades muy distintas.\n\nA diferencia de repoblaciones anteriores en la misma zona, que utilizaron principalmente pino, esta vez los técnicos forestales han priorizado especies como la encina y el roble, más resistentes al fuego y capaces de retener mejor la humedad del suelo durante los meses más secos del verano. Cada voluntario planta, en una jornada típica, entre quince y veinte árboles jóvenes, siguiendo instrucciones precisas sobre profundidad y distancia entre ejemplares.\n\nMaría, coordinadora del proyecto, reconoce que la reforestación por sí sola no basta para prevenir incendios futuros: sin un mantenimiento continuado del monte, con limpieza periódica de maleza y vigilancia activa durante los meses de mayor riesgo, los árboles recién plantados corren el mismo peligro que corrió el bosque original. Por eso, la asociación ha organizado también turnos de vigilancia voluntaria durante la temporada estival, coordinados directamente con los servicios oficiales de bomberos forestales.\n\nLos técnicos calculan que los árboles plantados este año necesitarán entre diez y quince años para alcanzar un tamaño que ofrezca una protección real contra la erosión del suelo, un plazo que muchos de los voluntarios más jóvenes, animados por María durante cada jornada, insisten en que vale absolutamente la pena esperar, aunque ellos mismos sean ya adultos para cuando el bosque recupere su aspecto anterior al incendio.',
  gloss: [
    { es: 'una repoblación (forestal)', en: 'la acción de plantar árboles nuevos en una zona deforestada' },
    { es: 'autóctono', en: 'propio u originario de una región concreta' },
    { es: 'la maleza', en: 'la vegetación baja y descontrolada que crece de forma natural' },
    { es: 'la erosión (del suelo)', en: 'el desgaste o la pérdida de tierra fértil, a menudo por lluvia o viento' }
  ],
  questions: [
    { type: 'mcq', q: '¿Por qué se han elegido encinas y robles en lugar de pinos, según el texto?', options: ['Porque crecen más rápido que los pinos', 'Porque resisten mejor el fuego y retienen mejor la humedad', 'Porque son más baratos de conseguir'], answer: 1 },
    { type: 'mcq', q: '¿Qué advierte María sobre la reforestación por sí sola?', options: ['Que es suficiente sin ninguna medida adicional', 'Que necesita mantenimiento continuado para evitar un nuevo incendio', 'Que no tiene ningún efecto real sobre el bosque'], answer: 1 },
    { type: 'short', q: '¿Cuántos voluntarios han participado hasta ahora, aproximadamente? (una cifra)', accept: ['300', 'trescientos', 'más de trescientos'] },
    { type: 'translate', line: 'Un año después de que un incendio forestal arrasara casi dos mil hectáreas de monte en la sierra', model: 'A year after a forest fire devastated nearly two thousand hectares of woodland in the mountains' }
  ]
}

];
