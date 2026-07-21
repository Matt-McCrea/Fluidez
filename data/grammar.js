/* ============================================================================
 * CONCEPT LESSONS — hand-written grammar lessons for concepts that aren't a
 * single tense (contrasts, agreement, prepositions). The 13 tense lessons are
 * GENERATED from data/grammar-docs.js by js/lessons.js, which also assembles
 * the full ordered syllabus (window.GRAMMAR_LESSONS) from both sources.
 *
 * Shape:
 *   { id, title, level, summary,
 *     sections:[{h, html}], contrasts:[{es,en,note}], pitfalls:[html],
 *     examples:[{es,en}], recall:[{id, front, back}] }
 * ========================================================================== */
window.CONCEPT_LESSONS = [

{
  id: 'ser-estar', title: 'Ser vs. Estar', level: 1,
  summary: 'Spanish splits "to be" into two verbs. Ser is for identity and essence; estar is for states, locations and conditions. Getting this right changes your meaning, not just your accuracy.',
  sections: [
    { h: 'The core idea', html: '<b>Ser</b> = what something fundamentally <i>is</i> (identity, origin, defining traits, time). <b>Estar</b> = what condition or place it is <i>in</i> right now (states, feelings, location).' },
    { h: 'Use SER for', html: '<ul><li>Identity: <i>Soy profesor.</i></li><li>Origin: <i>Es de México.</i></li><li>Defining traits: <i>Ella es alta.</i></li><li>Time/dates: <i>Son las tres.</i></li></ul>' },
    { h: 'Use ESTAR for', html: '<ul><li>Location: <i>Estoy en casa.</i></li><li>Feelings/conditions: <i>Estás cansado.</i></li><li>Ongoing actions: <i>Está lloviendo.</i></li></ul>' }
  ],
  contrasts: [
    { es: 'Es aburrido.', en: 'He is boring.', note: 'ser = character' },
    { es: 'Está aburrido.', en: 'He is bored.', note: 'estar = current state' },
    { es: 'Es rico.', en: 'He is rich.', note: 'ser = trait' },
    { es: 'Está rico.', en: 'It (food) is delicious.', note: 'estar = condition' }
  ],
  pitfalls: [
    'Feelings are almost always <b>estar</b>: <i>estoy feliz, estoy triste</i> — not <i>soy</i>.',
    'Location of a thing/person uses <b>estar</b>, but location of an <i>event</i> uses <b>ser</b>: <i>La fiesta es en mi casa.</i>'
  ],
  examples: [
    { es: 'Soy de Escocia, pero estoy en España.', en: 'I am from Scotland, but I am in Spain.' },
    { es: 'La sopa está fría.', en: 'The soup is cold.' },
    { es: 'Mi hermana es muy simpática.', en: 'My sister is very nice.' }
  ],
  recall: [
    { id: 'g:serestar:feeling', front: '“to be” for feelings (estoy triste)', back: 'estar' },
    { id: 'g:serestar:origin', front: '“to be” for origin (soy de…)', back: 'ser' },
    { id: 'g:serestar:location', front: '“to be” for location of a person', back: 'estar' }
  ]
},

{
  id: 'gender-articles', title: 'Gender & articles', level: 1,
  summary: 'Every Spanish noun has a gender, and the words around it must agree. Learn the patterns and the agreement chain becomes automatic.',
  sections: [
    { h: 'The patterns', html: 'Most nouns ending in <b>-o</b> are masculine (<i>el libro</i>); most ending in <b>-a</b> are feminine (<i>la casa</i>). Learn each noun <i>with</i> its article — that\'s why our vocab shows <i>el / la</i>.' },
    { h: 'The four articles', html: '“the” = <b>el, la, los, las</b>. “a/an” = <b>un, una</b>; “some” = <b>unos, unas</b>. They agree in gender <i>and</i> number with the noun.' },
    { h: 'Agreement chain', html: 'Article + noun + adjective all agree: <i>l<b>a</b>s cas<b>a</b>s blanc<b>a</b>s</i> (the white houses). Change one, change all.' }
  ],
  contrasts: [
    { es: 'el problema', en: 'the problem', note: '-ma words are often masculine!' },
    { es: 'la mano', en: 'the hand', note: 'exception: -o but feminine' },
    { es: 'el día', en: 'the day', note: 'exception: -a but masculine' }
  ],
  pitfalls: [
    'Adjectives ending in <b>-e</b> or a consonant usually don\'t change for gender: <i>un coche verde, una casa verde</i>.',
    'Watch the common exceptions: <i>el día, la mano, el mapa, el problema, la foto</i>.'
  ],
  examples: [
    { es: 'La niña pequeña tiene un gato negro.', en: 'The little girl has a black cat.' },
    { es: 'Los coches rojos son rápidos.', en: 'The red cars are fast.' }
  ],
  recall: [
    { id: 'g:gender:the-fem-pl', front: '“the” for feminine plural (las casas)', back: 'las' },
    { id: 'g:gender:a-fem', front: '“a” for a feminine noun (una mesa)', back: 'una' }
  ]
},

{
  id: 'preterite-imperfect', title: 'Preterite vs. Imperfect', level: 2,
  summary: 'Spanish has two past tenses and English blurs them. The preterite is a finished event; the imperfect is the background, the ongoing, the habitual. Choosing between them is a meaning decision.',
  sections: [
    { h: 'Preterite = the event', html: 'A completed action, often at a specific moment: <i>Ayer comí paella.</i> Think: "what happened?" A dot on the timeline.' },
    { h: 'Imperfect = the backdrop', html: 'What <i>was</i> happening, used to happen, or set the scene: <i>Cuando era niño, comía paella los domingos.</i> Think: "what was going on?" A line, not a dot.' },
    { h: 'They work together', html: 'The imperfect paints the scene; the preterite drops the event into it: <i>Llovía cuando salí.</i> (It was raining when I left.)' }
  ],
  contrasts: [
    { es: 'Comí a las dos.', en: 'I ate at two.', note: 'preterite: a finished event' },
    { es: 'Comía a las dos.', en: 'I used to eat at two.', note: 'imperfect: a habit' },
    { es: 'Fui a España.', en: 'I went to Spain.', note: 'a trip that happened' },
    { es: 'Iba a España cada verano.', en: 'I used to go to Spain every summer.', note: 'a repeated background' }
  ],
  pitfalls: [
    'Time markers hint at the choice: <i>ayer, anoche, el lunes</i> → preterite; <i>siempre, todos los días, mientras</i> → imperfect.',
    'Age, time, weather and feelings in the past are usually <b>imperfect</b>: <i>Tenía diez años. Eran las tres. Hacía frío.</i>'
  ],
  examples: [
    { es: 'Mientras estudiaba, sonó el teléfono.', en: 'While I was studying, the phone rang.' },
    { es: 'De niña, vivía en Madrid y visitaba a mis abuelos.', en: 'As a girl, I lived in Madrid and visited my grandparents.' }
  ],
  recall: [
    { id: 'g:pretimp:habit', front: 'Past tense for a repeated habit ("used to")', back: 'imperfecto' },
    { id: 'g:pretimp:event', front: 'Past tense for a finished event ("ayer…")', back: 'preterito' }
  ]
},

{
  id: 'por-para', title: 'Por vs. Para', level: 2,
  summary: 'Both often translate as "for", but they point in different directions. Para looks forward to a goal, destination or deadline; por looks at cause, exchange, duration and movement through.',
  sections: [
    { h: 'PARA = destination / purpose', html: '<ul><li>Goal: <i>Estudio para aprender.</i></li><li>Recipient: <i>Es para ti.</i></li><li>Destination: <i>Salgo para Madrid.</i></li><li>Deadline: <i>Para el lunes.</i></li></ul>' },
    { h: 'POR = cause / exchange / through', html: '<ul><li>Reason: <i>Lo hago por amor.</i></li><li>Exchange: <i>Pagué diez euros por el libro.</i></li><li>Duration: <i>Estudié por dos horas.</i></li><li>Movement through: <i>Camino por el parque.</i></li></ul>' }
  ],
  contrasts: [
    { es: 'Trabajo para mi jefe.', en: 'I work for my boss.', note: 'para = the goal/recipient' },
    { es: 'Trabajo por dinero.', en: 'I work for (the sake of) money.', note: 'por = the motive' }
  ],
  pitfalls: [
    'Fixed phrases just have to be learned: <i>por favor, por supuesto, por fin, para siempre</i>.',
    '"Thanks for…" is <b>gracias por</b>, always.'
  ],
  examples: [
    { es: 'Este regalo es para mi madre.', en: 'This gift is for my mother.' },
    { es: 'Gracias por tu ayuda.', en: 'Thanks for your help.' }
  ],
  recall: [
    { id: 'g:porpara:goal', front: '“for” pointing to a goal/deadline', back: 'para' },
    { id: 'g:porpara:cause', front: '“for” meaning a cause/in exchange', back: 'por' }
  ]
},

{
  id: 'impneg', title: 'Imperativo negativo', level: 4,
  summary: 'Negative commands ("don\'t speak!") are built entirely from the present subjunctive — including tú, which has its own special form in the affirmative but switches to the subjunctive here.',
  sections: [
    { h: 'How it forms', html: 'Take the <b>presente de subjuntivo</b> form for the person you\'re addressing and put <b>no</b> in front: <i>no hables, no hable, no hablemos, no habléis, no hablen</i>.' },
    { h: 'The one thing that changes', html: '<ul><li>Affirmative tú has its own form: <i>¡Habla!</i>, <i>¡Ven!</i></li><li>Negative tú switches to the subjunctive: <i>¡No hables!</i>, <i>¡No vengas!</i></li><li>Every other person (usted, nosotros, vosotros, ustedes) is already subjunctive-shaped in the affirmative too, so those don\'t change between positive and negative.</li></ul>' },
    { h: 'When to use it', html: '<ul><li>Telling someone not to do something: <i>No corras.</i></li><li>Group instructions: <i>No lleguéis tarde.</i></li></ul>' }
  ],
  contrasts: [
    { es: 'Habla más despacio.', en: 'Speak more slowly.', note: 'affirmative tú — its own irregular form' },
    { es: 'No hables tan rápido.', en: 'Don\'t speak so fast.', note: 'negative tú — subjunctive form instead' },
    { es: 'Ven aquí.', en: 'Come here.', note: 'affirmative tú, irregular' },
    { es: 'No vengas tarde.', en: 'Don\'t come late.', note: 'negative tú, subjunctive' }
  ],
  pitfalls: [
    'Negative tú is NOT the same shape as affirmative tú: <i>¡Habla!</i> but <i>¡No hables!</i> — saying <i>no habla</i> is a very common mistake.',
    'Object pronouns attach to the END in the affirmative (<i>¡Dímelo!</i>) but come BEFORE the verb in the negative (<i>¡No me lo digas!</i>).'
  ],
  examples: [
    { es: 'No hables con la boca llena.', en: 'Don\'t speak with your mouth full.' },
    { es: 'No comas tanto azúcar.', en: 'Don\'t eat so much sugar.' },
    { es: 'No vayáis solos.', en: 'Don\'t go alone (you all).' }
  ],
  recall: [
    { id: 'g:impneg:mood', front: 'Negative commands (no hables, no coma, no vayamos) are built from which mood?', back: 'subjuntivo' },
    { id: 'g:impneg:tu', front: 'Negative tú command of "hablar" — no ___', back: 'hables' },
    { id: 'g:impneg:nosotros', front: 'Negative nosotros command of "comer" ("let\'s not eat") — no ___', back: 'comamos' }
  ]
}

];
