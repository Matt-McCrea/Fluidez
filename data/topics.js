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
      models: ['Cuando era niño, mi familia vivía en un pueblo pequeño. Mis padres trabajaban mucho y mis hermanos y yo jugábamos en la calle todos los días. Éramos muy felices.'] }
  ] },

  { id: 'topic-rutina', topic: 'Tu rutina', prompts: [
    { level: 1, prompt: 'Describe what you do on a normal day.',
      hint: 'Present tense + “todos los días”, luego, después.',
      constraints: [{ type: 'containsWord', word: 'todos los días' }, { type: 'anyVerbInTense', tense: 'presente' }, { type: 'person', person: 'yo' }],
      models: ['Todos los días desayuno café y voy al trabajo. Luego como con mis compañeros y por la noche leo un libro antes de dormir.'] },
    { level: 1, prompt: 'Describe your perfect day, from morning to night, in detail.',
      hint: 'Present tense; connect your ideas with luego, después, porque, y.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'containsAny', words: ['luego', 'después', 'porque', 'y'] }, { type: 'minWords', n: 20 }],
      models: ['Por la mañana me levanto temprano y hago ejercicio. Luego desayuno tranquilo y leo un rato. Después trabajo un poco, y por la noche veo una película porque me gusta descansar.'] }
  ] },

  { id: 'topic-gustos', topic: 'Tus gustos', prompts: [
    { level: 1, prompt: 'Talk about the things you like and prefer — food, music, hobbies.',
      hint: 'Use me gusta / me gustan / prefiero / me encanta.',
      constraints: [{ type: 'containsAny', words: ['me gusta', 'me gustan', 'prefiero', 'me encanta'] }, { type: 'minWords', n: 12 }],
      models: ['Me gusta mucho la música y me gustan las películas de acción. Prefiero el café al té y me encanta viajar por el mundo.'] },
    { level: 1, prompt: 'Contrast things you like with things you don\'t like.',
      hint: 'Use pero / aunque to contrast.',
      constraints: [{ type: 'containsAny', words: ['me gusta', 'me gustan', 'prefiero'] }, { type: 'containsAny', words: ['pero', 'aunque'] }, { type: 'minWords', n: 15 }],
      models: ['Me gusta mucho la música clásica, pero no me gustan las películas de terror. Prefiero leer un buen libro, aunque a veces también veo series.'] }
  ] },

  { id: 'topic-ciudad', topic: 'Tu ciudad', prompts: [
    { level: 1, prompt: 'Describe the town or city where you live.',
      hint: 'Present tense; use hay / está / tiene.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'containsAny', words: ['hay', 'está', 'tiene'] }, { type: 'minWords', n: 12 }],
      models: ['Vivo en una ciudad pequeña cerca del mar. Hay muchos parques y tiene una playa muy bonita. La gente es amable y todo está cerca.'] },
    { level: 2, prompt: 'How has your city changed? Compare how it was before with how it is now.',
      hint: 'Imperfect (era, había) for the past, present for now.',
      constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'anyVerbInTense', tense: 'presente' }, { type: 'minWords', n: 18 }],
      models: ['Antes mi ciudad era muy tranquila y había pocos coches. Ahora hay mucho tráfico y más gente, pero todavía tiene parques bonitos y la gente es amable.'] }
  ] },

  { id: 'topic-trabajo', topic: 'Tu trabajo o estudios', prompts: [
    { level: 1, prompt: 'Talk about your job or what you study.',
      hint: 'Present tense, first person.',
      constraints: [{ type: 'anyVerbInTense', tense: 'presente' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['Trabajo en una oficina en el centro. Uso el ordenador todo el día y hablo con muchos clientes. Me gusta mi trabajo porque aprendo mucho.'] },
    { level: 2, prompt: 'Tell me what you did at work or in your studies yesterday.',
      hint: 'Preterite, first person (trabajé, escribí, hablé).',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 15 }],
      models: ['Ayer trabajé mucho en la oficina. Escribí varios correos, hablé con un cliente importante y terminé un proyecto grande. Salí muy cansado pero contento.'] }
  ] },

  { id: 'topic-finde', topic: 'El fin de semana', prompts: [
    { level: 2, prompt: 'Tell the story of last weekend — what you did and how it was.',
      hint: 'Preterite for events, imperfect for the background (weather, feelings).',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 15 }],
      models: ['El fin de semana pasado fui a la playa con mis amigos. Hacía mucho calor y el agua estaba fría, pero lo pasamos muy bien y comimos en un restaurante.'] },
    { level: 3, prompt: 'Now say what you will do next weekend.',
      hint: 'Future tense (iré, haré, comeremos).',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'minWords', n: 12 }],
      models: ['El próximo fin de semana iré a la montaña con mis amigos. Caminaremos por el bosque y comeremos en un restaurante típico. Será un fin de semana estupendo.'] }
  ] },

  { id: 'topic-vacaciones', topic: 'Unas vacaciones', prompts: [
    { level: 2, prompt: 'Describe a holiday or trip you took.',
      hint: 'Preterite, first person.',
      constraints: [{ type: 'anyVerbInTense', tense: 'preterito' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['El verano pasado viajé a Italia con mi familia. Comí comida deliciosa y saqué muchas fotos. Fue un viaje inolvidable.'] },
    { level: 2, prompt: 'Now describe the place — what it was like there.',
      hint: 'Imperfect to set the scene (era, estaba, hacía).',
      constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'minWords', n: 15 }],
      models: ['El hotel era precioso y estaba cerca de la playa. Hacía sol todos los días y la comida estaba deliciosa. La gente era muy simpática y todo estaba muy limpio.'] }
  ] },

  { id: 'topic-planes', topic: 'Tus planes y sueños', prompts: [
    { level: 3, prompt: 'Talk about your plans and hopes for the future.',
      hint: 'Future tense, first person; connect your ideas.',
      constraints: [{ type: 'anyVerbInTense', tense: 'futuro' }, { type: 'person', person: 'yo' }, { type: 'minWords', n: 12 }],
      models: ['El próximo año viajaré por Sudamérica y aprenderé a bailar. También buscaré un trabajo nuevo y estudiaré más español.'] },
    { level: 3, prompt: 'If you had more time and money, what would you do?',
      hint: 'Conditional (viajaría, aprendería, ayudaría).',
      constraints: [{ type: 'anyVerbInTense', tense: 'condicional' }, { type: 'minWords', n: 12 }],
      models: ['Si tuviera más tiempo, viajaría por todo el mundo y aprendería muchos idiomas. También pasaría más tiempo con mi familia y ayudaría a los demás.'] }
  ] }

];
