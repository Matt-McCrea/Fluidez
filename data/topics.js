/* ============================================================================
 * TOPICS — "Hablar de…" (talk about X): conversational prompts that elicit
 * whole, connected sentences on an everyday subject. Used by the Practice area.
 * Same constraint machinery as writing tasks — the checklist verifies mechanics
 * live, the model shows a natural answer. `level` tags gate nothing here (it's
 * opt-in practice) but keep the tense≤level validator happy.
 * ========================================================================== */
window.TOPICS = [

  { id: 'topic-familia', topic: 'Tu familia', level: 1,
    prompt: 'Talk about your family — who they are and what they do.',
    hint: 'Present tense: ser, tener, trabajar. A few connected sentences.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 12 }
    ],
    models: ['Tengo dos hermanos y una hermana. Mi padre es profesor y mi madre trabaja en un hospital. Somos una familia grande y feliz.'] },

  { id: 'topic-rutina', topic: 'Tu rutina', level: 1,
    prompt: 'Describe what you do on a normal day.',
    hint: 'Present tense + “todos los días”, luego, después.',
    constraints: [
      { type: 'containsWord', word: 'todos los días' },
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' }
    ],
    models: ['Todos los días desayuno café y voy al trabajo. Luego como con mis compañeros y por la noche leo un libro antes de dormir.'] },

  { id: 'topic-gustos', topic: 'Tus gustos', level: 1,
    prompt: 'Talk about the things you like and prefer — food, music, hobbies.',
    hint: 'Use me gusta / me gustan / prefiero / me encanta.',
    constraints: [
      { type: 'containsAny', words: ['me gusta', 'me gustan', 'prefiero', 'me encanta'] },
      { type: 'minWords', n: 12 }
    ],
    models: ['Me gusta mucho la música y me gustan las películas de acción. Prefiero el café al té y me encanta viajar por el mundo.'] },

  { id: 'topic-ciudad', topic: 'Tu ciudad', level: 1,
    prompt: 'Describe the town or city where you live.',
    hint: 'Present tense; use hay / está / tiene to describe it.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'containsAny', words: ['hay', 'está', 'tiene'] },
      { type: 'minWords', n: 12 }
    ],
    models: ['Vivo en una ciudad pequeña cerca del mar. Hay muchos parques y tiene una playa muy bonita. La gente es amable y todo está cerca.'] },

  { id: 'topic-trabajo', topic: 'Tu trabajo o estudios', level: 1,
    prompt: 'Talk about your job or what you study.',
    hint: 'Present tense, first person.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'presente' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 12 }
    ],
    models: ['Trabajo en una oficina en el centro. Uso el ordenador todo el día y hablo con muchos clientes. Me gusta mi trabajo porque aprendo mucho.'] },

  { id: 'topic-finde', topic: 'El fin de semana pasado', level: 2,
    prompt: 'Tell the story of last weekend — what you did and how it was.',
    hint: 'Preterite for events, imperfect for the background (weather, feelings).',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'minWords', n: 15 }
    ],
    models: ['El fin de semana pasado fui a la playa con mis amigos. Hacía mucho calor y el agua estaba fría, pero lo pasamos muy bien y comimos en un restaurante.'] },

  { id: 'topic-vacaciones', topic: 'Unas vacaciones', level: 2,
    prompt: 'Describe a holiday or trip you took.',
    hint: 'Preterite, first person.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 12 }
    ],
    models: ['El verano pasado viajé a Italia con mi familia. Comí comida deliciosa y saqué muchas fotos. Fue un viaje inolvidable.'] },

  { id: 'topic-planes', topic: 'Tus planes', level: 3,
    prompt: 'Talk about your plans and hopes for the future.',
    hint: 'Future tense, first person; connect your ideas.',
    constraints: [
      { type: 'anyVerbInTense', tense: 'futuro' },
      { type: 'person', person: 'yo' },
      { type: 'minWords', n: 12 }
    ],
    models: ['El próximo año viajaré por Sudamérica y aprenderé a bailar. También buscaré un trabajo nuevo y estudiaré más español.'] }

];
