/* ============================================================================
 * TOPICS — "Hablar de…" (talk about X): conversational prompts that elicit
 * whole, connected sentences. Each topic has LEVELS — once you finish one, the
 * chip advances to the next (harder/longer) prompt on the same topic. Same
 * constraint machinery as writing tasks: the checklist verifies mechanics live,
 * the model shows a natural answer. Each prompt's `level` = the highest-level
 * tense it needs (keeps the tense≤level validator happy).
 * ========================================================================== */
window.TOPICS = [

  { id: 'topic-familia', topic: 'Tu familia', prompts: [
    { level: 1, prompt: 'Talk about your family — who they are and what they do.',
      hint: 'Present tense: ser, tener, trabajar. A few connected sentences.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['Tengo dos hermanos y una hermana. Mi padre es profesor y mi madre trabaja en un hospital. Somos una familia grande y feliz.'] },
    { level: 2, prompt: 'Now describe your family when you were a child — what life was like.',
      hint: 'Imperfect for how things used to be (era, vivía, jugábamos).',
      constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 15 }],
      models: ['Cuando era niño, mi familia vivía en un pueblo pequeño. Mis padres trabajaban mucho y mis hermanos y yo jugábamos en la calle todos los días. Éramos muy felices.'] },
    { level: 3, prompt: 'Talk about how you think your family will be in ten years.',
      hint: 'Future tense.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'minWords', n: 12 }],
      models: ['En diez años, mis padres estarán jubilados y viviremos todos más cerca. Mis hermanos tendrán sus propias familias y nos veremos mucho en las vacaciones.'] },
    { level: 4, prompt: 'Say what you hope for your family in the future.',
      hint: 'Espero que + subjunctive.',
      constraints: [{ type: 'regex', pattern: 'espero que', label: 'start with “espero que”' }, { type: 'anyVerbInTense', tense: 'presubj' }],
      models: ['Espero que mi familia esté siempre unida y que todos tengamos buena salud.'] }
  ] },

  { id: 'topic-rutina', topic: 'Tu rutina', prompts: [
    { level: 1, prompt: 'Describe what you do on a normal day.',
      hint: 'Present tense + “todos los días”, luego, después.',
      constraints: [{ type: 'containsWord', word: 'todos los días' }, { type: 'anyVerbInTense', tense: 'presente' }, { type: 'person', person: 'yo' }],
      models: ['Todos los días desayuno café y voy al trabajo. Luego como con mis compañeros y por la noche leo un libro antes de dormir.'] },
    { level: 1, prompt: 'Describe your perfect day, from morning to night, in detail.',
      hint: 'Present tense; connect your ideas with luego, después, porque, y.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'containsAny', words: ['luego', 'después', 'porque', 'y'] }, { type: 'minWords', n: 20 }],
      models: ['Por la mañana me levanto temprano y hago ejercicio. Luego desayuno tranquilo y leo un rato. Después trabajo un poco, y por la noche veo una película porque me gusta descansar.'] },
    { level: 2, prompt: 'Describe your routine a few years ago, and how it has changed.',
      hint: 'Imperfect for before, present for now.',
      constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'anyVerbInTense', tense: 'presente' }, { type: 'minWords', n: 15 }],
      models: ['Antes trabajaba por la noche y dormía poco. Ahora trabajo por la mañana y duermo ocho horas porque quiero estar más sano.'] },
    { level: 3, prompt: 'Say how your routine will change next year.',
      hint: 'Future tense.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'minWords', n: 12 }],
      models: ['El próximo año cambiaré de trabajo y empezaré más tarde. Dormiré más y tendré más tiempo para descansar.'] }
  ] },

  { id: 'topic-gustos', topic: 'Tus gustos', prompts: [
    { level: 1, prompt: 'Talk about the things you like and prefer — food, music, hobbies.',
      hint: 'Use me gusta / me gustan / prefiero / me encanta.',
      constraints: [{ type: 'containsAny', words: ['me gusta', 'me gustan', 'prefiero', 'me encanta'] }, { type: 'minWords', n: 12 }],
      models: ['Me gusta mucho la música y me gustan las películas de acción. Prefiero el café al té y me encanta viajar por el mundo.'] },
    { level: 1, prompt: 'Contrast things you like with things you don\'t like.',
      hint: 'Use pero / aunque to contrast.',
      constraints: [{ type: 'containsAny', words: ['me gusta', 'me gustan', 'prefiero'] }, { type: 'containsAny', words: ['pero', 'aunque'] }, { type: 'minWords', n: 15 }],
      models: ['Me gusta mucho la música clásica, pero no me gustan las películas de terror. Prefiero leer un buen libro, aunque a veces también veo series.'] },
    { level: 2, prompt: 'Say what you used to like as a child, compared to now.',
      hint: 'Imperfect + present, pero/aunque.',
      constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'containsAny', words: ['pero', 'aunque'] }, { type: 'minWords', n: 15 }],
      models: ['De niño prefería los dibujos animados, pero ahora prefiero las películas serias. Antes no comía verduras, aunque ahora las como cada día.'] },
    { level: 3, prompt: 'Say something new you would like to try.',
      hint: 'Conditional, me gustaría.',
      constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'minWords', n: 8 }],
      models: ['Me gustaría aprender a cocinar platos japoneses este año.', 'Preferiría aprender un idioma nuevo el próximo año.'] }
  ] },

  { id: 'topic-ciudad', topic: 'Tu ciudad', prompts: [
    { level: 1, prompt: 'Describe the town or city where you live.',
      hint: 'Present tense; use hay / está / tiene.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'containsAny', words: ['hay', 'está', 'tiene'] }, { type: 'minWords', n: 12 }],
      models: ['Vivo en una ciudad pequeña cerca del mar. Hay muchos parques y tiene una playa muy bonita. La gente es amable y todo está cerca.'] },
    { level: 2, prompt: 'How has your city changed? Compare how it was before with how it is now.',
      hint: 'Imperfect (era, había) for the past, present for now.',
      constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'anyVerbInTense', tense: 'presente' }, { type: 'minWords', n: 18 }],
      models: ['Antes mi ciudad era muy tranquila y había pocos coches. Ahora hay mucho tráfico y más gente, pero todavía tiene parques bonitos y la gente es amable.'] },
    { level: 3, prompt: 'Say how you think your city will change in the future.',
      hint: 'Future tense.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'minWords', n: 12 }],
      models: ['En el futuro, mi ciudad tendrá más parques y menos coches. La gente usará más la bicicleta y habrá más zonas verdes.'] }
  ] },

  { id: 'topic-trabajo', topic: 'Tu trabajo o estudios', prompts: [
    { level: 1, prompt: 'Talk about your job or what you study.',
      hint: 'Present tense, first person.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['Trabajo en una oficina en el centro. Uso el ordenador todo el día y hablo con muchos clientes. Me gusta mi trabajo porque aprendo mucho.'] },
    { level: 2, prompt: 'Tell me what you did at work or in your studies yesterday.',
      hint: 'Preterite, first person (trabajé, escribí, hablé).',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 15 }],
      models: ['Ayer trabajé mucho en la oficina. Escribí varios correos, hablé con un cliente importante y terminé un proyecto grande. Salí muy cansado pero contento.'] },
    { level: 3, prompt: 'Talk about your plans for your career or studies next year.',
      hint: 'Future tense, first person.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['El próximo año terminaré mis estudios y buscaré un trabajo mejor. También aprenderé nuevas habilidades para tener más oportunidades.'] },
    { level: 4, prompt: 'Say what you hope for regarding your job or studies.',
      hint: 'Espero que + subjunctive.',
      constraints: [{ type: 'regex', pattern: 'espero que', label: 'start with “espero que”' }, { type: 'anyVerbInTense', tense: 'presubj' }],
      models: ['Espero que mi jefe me dé un ascenso pronto.', 'Espero que mis estudios me ayuden a conseguir un buen trabajo.'] }
  ] },

  { id: 'topic-finde', topic: 'El fin de semana', prompts: [
    { level: 2, prompt: 'Tell the story of last weekend — what you did and how it was.',
      hint: 'Preterite for events, imperfect for the background (weather, feelings).',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 15 }],
      models: ['El fin de semana pasado fui a la playa con mis amigos. Hacía mucho calor y el agua estaba fría, pero lo pasamos muy bien y comimos en un restaurante.'] },
    { level: 3, prompt: 'Now say what you will do next weekend.',
      hint: 'Future tense (iré, haré, comeremos).',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'minWords', n: 12 }],
      models: ['El próximo fin de semana iré a la montaña con mis amigos. Caminaremos por el bosque y comeremos en un restaurante típico. Será un fin de semana estupendo.'] },
    { level: 4, prompt: 'Say what you hope happens this weekend.',
      hint: 'Ojalá que + subjunctive.',
      constraints: [{ type: 'regex', pattern: 'ojalá', label: 'start with “ojalá”' }, { type: 'anyVerbInTense', tense: 'presubj' }],
      models: ['Ojalá que haga buen tiempo este fin de semana.', 'Ojalá que mis amigos vengan a la fiesta.'] }
  ] },

  { id: 'topic-vacaciones', topic: 'Unas vacaciones', prompts: [
    { level: 2, prompt: 'Describe a holiday or trip you took.',
      hint: 'Preterite, first person.',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['El verano pasado viajé a Italia con mi familia. Comí comida deliciosa y saqué muchas fotos. Fue un viaje inolvidable.'] },
    { level: 2, prompt: 'Now describe the place — what it was like there.',
      hint: 'Imperfect to set the scene (era, estaba, hacía).',
      constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 15 }],
      models: ['El hotel era precioso y estaba cerca de la playa. Hacía sol todos los días y la comida estaba deliciosa. La gente era muy simpática y todo estaba muy limpio.'] },
    { level: 3, prompt: 'Talk about a trip you are planning for the future.',
      hint: 'Future tense.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'minWords', n: 12 }],
      models: ['El próximo verano viajaré a Grecia con mi pareja. Iremos a varias islas y comeremos mucha comida típica.'] }
  ] },

  { id: 'topic-planes', topic: 'Tus planes y sueños', prompts: [
    { level: 3, prompt: 'Talk about your plans and hopes for the future.',
      hint: 'Future tense, first person; connect your ideas.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['El próximo año viajaré por Sudamérica y aprenderé a bailar. También buscaré un trabajo nuevo y estudiaré más español.'] },
    { level: 3, prompt: 'If you had more time and money, what would you do?',
      hint: 'Conditional (viajaría, aprendería, ayudaría).',
      constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'minWords', n: 12 }],
      models: ['Si tuviera más tiempo, viajaría por todo el mundo y aprendería muchos idiomas. También pasaría más tiempo con mi familia y ayudaría a los demás.'] },
    { level: 4, prompt: 'Say what you hope will happen with your dreams.',
      hint: 'Espero que + subjunctive.',
      constraints: [{ type: 'regex', pattern: 'espero que', label: 'start with “espero que”' }, { type: 'anyVerbInTense', tense: 'presubj' }],
      models: ['Espero que mis sueños se hagan realidad algún día.', 'Espero que mi familia entienda mis decisiones.'] },
    { level: 5, prompt: 'Say what you will have achieved in ten years, using the futuro perfecto.',
      hint: 'habré + participio.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futperf' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 10 }],
      models: ['En diez años, habré viajado por muchos países y habré aprendido varios idiomas.', 'Para entonces, habré terminado mis estudios y habré empezado mi propio negocio.'] }
  ] },

  { id: 'topic-comida', topic: 'La comida y la cocina', prompts: [
    { level: 1, prompt: 'Talk about your favorite food and what you like to cook.',
      hint: 'Present tense, me gusta + cocinar.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'containsAny', words: ['me gusta', 'me encanta', 'prefiero'] }, { type: 'minWords', n: 12 }],
      models: ['Me encanta la comida italiana y me gusta cocinar pasta los fines de semana. También preparo ensaladas frescas en verano.'] },
    { level: 2, prompt: 'Describe a meal you cooked recently and how it turned out.',
      hint: 'Preterite, first person.',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['El fin de semana pasado cociné una paella para mis amigos. Compré ingredientes frescos y todos comieron muchísimo.'] },
    { level: 3, prompt: 'Say what you will cook for a special occasion.',
      hint: 'Future tense.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'minWords', n: 10 }],
      models: ['Para el cumpleaños de mi madre, prepararé su plato favorito y haré un pastel de chocolate.'] }
  ] },

  { id: 'topic-salud', topic: 'Tu salud', prompts: [
    { level: 1, prompt: 'Talk about what you do to stay healthy.',
      hint: 'Present tense.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 10 }],
      models: ['Como muchas verduras y bebo mucha agua todos los días. También descanso bien y camino una hora cada mañana.'] },
    { level: 2, prompt: 'Describe a time you were sick and what you did.',
      hint: 'Preterite + imperfect.',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 15 }],
      models: ['El invierno pasado tuve mucha fiebre y me sentía muy mal. Descansé varios días y bebí mucha agua hasta que mejoré.'] },
    { level: 3, prompt: 'Say what you will do to improve your health this year.',
      hint: 'Future tense.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'minWords', n: 10 }],
      models: ['Este año haré más ejercicio y dormiré más horas. También comeré menos azúcar.'] }
  ] },

  { id: 'topic-problema', topic: 'Un problema que resolviste', prompts: [
    { level: 2, prompt: 'Tell the story of a problem you solved recently.',
      hint: 'Preterite + imperfect; connect ideas.',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 15 }],
      models: ['El mes pasado tenía un problema serio con mi ordenador. Llamé a un técnico y él encontró el problema rápido. Al final, todo salió bien.'] },
    { level: 3, prompt: 'Say how you would solve a problem if you had the resources.',
      hint: 'Conditional.',
      constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'minWords', n: 10 }],
      models: ['Si tuviera más dinero, contrataría a un experto para resolver el problema rápido.'] },
    { level: 4, prompt: 'Say what you wish had been different about how a problem was handled.',
      hint: 'Ojalá + subjunctive.',
      constraints: [{ type: 'regex', pattern: 'ojalá', label: 'start with “ojalá”' }, { type: 'anyVerbInTense', tense: 'presubj' }],
      models: ['Ojalá que la próxima vez el técnico llegue más rápido.', 'Ojalá que este tipo de problemas no se repita nunca más.'] }
  ] }

];
