/* ============================================================================
 * TEACHING SCRIPTS, A2 units a2-u15, a2-u16, a2-u18 to a2-u23
 * (window.SCRIPTS_A2), keyed by lesson id.
 *
 * Same anatomy as data/scripts/a1.js, which documents the shape in full:
 *   hook        { line (English), es, en }  es/en may hold several lines (\n)
 *   examples    [{ es, en }]                2 or 3, before the rule
 *   rule        plain English, under 120 words, lines split by \n
 *   readAndPick [{ q, es, options, answer, why }]   4 to 6; the right option
 *                                           is first in the data and the view
 *                                           shuffles it
 *   yourTurn    [{ en, es, accept }]        3 to 5, graded by the matcher
 *   personal    { prompt, constraints (js/checker.js), model }
 *   pitfalls    [string]                    0 to 3
 *   source      'old' | 'merged' | 'rebuild'
 * Spanish inside English prose is marked *like this*; the view italicises it.
 *
 * A2 is the past-tense band. Latin American use throughout: the event past
 * (*llegué*, *comió*) is the everyday past, and *he* plus *-ado* is kept for
 * experience and not yet (*nunca he ido*, *todavía no he terminado*). Where the
 * old lesson used Spain's recent-past *ha llegado*, the script says so once.
 * No dashes, no vosotros, Colombian words where Spain has its own.
 *
 * Checked by tools/test-scripts-a2.js. Loaded on demand by js/views/learn.js.
 * ========================================================================== */
window.SCRIPTS_A2 = {

/* ---- unit 15 · How things used to be ----------------------------------- */

"imperfecto": {
  source: "merged",
  hook: {
    line: "Ask Laura's grandmother what Bogotá was like fifty years ago and she will talk for an hour. Spanish has a past made for exactly that: how things were, and what people used to do. It is also the easiest past to build.",
    es: "Sam: ¿Cómo era Bogotá antes?\nAbuela: Era más pequeña. No había tantos carros.\nAbuela: Los domingos íbamos al centro en bus y comíamos ajiaco.",
    en: "Sam: What was Bogotá like before?\nGrandmother: It was smaller. There weren't so many cars.\nGrandmother: On Sundays we used to go downtown by bus and eat ajiaco."
  },
  examples: [
    { es: "De niño vivía en Cali y jugaba fútbol en la calle.", en: "As a boy I lived in Cali and played football in the street." },
    { es: "Mi abuela era muy alta y tenía el pelo negro.", en: "My grandmother was very tall and had black hair." },
    { es: "¿Dónde trabajabas antes?", en: "Where did you use to work? (to a friend)" }
  ],
  rule: "This past describes: what things were like, and what used to happen again and again. English says “was”, “used to” or “would”; Spanish puts it in the ending.\n*-ar* verbs take *-aba*: *trabajaba, trabajabas, trabajaba, trabajábamos, trabajaban*\n*-er* and *-ir* verbs take *-ía*: *comía, comías, comía, comíamos, comían*, and *vivía* the same way\nOnly three verbs break the pattern: *ser* gives *era, éramos, eran*; *ir* gives *iba, íbamos, iban*; *ver* gives *veía*.\n*Hay* becomes *había*: there was, there were.\nI and he or she share one form: *vivía* is I lived or she lived.\nCompare: *Ayer comí arepa* is one time. *Comía arepa todos los días* was a habit.",
  readAndPick: [
    { q: "Is Diego talking about now, or about back then?", es: "Vivía en Medellín.",
      options: ["Back then", "Right now", "Next year"], answer: 0,
      why: "*-ía* puts it in the past: I used to live, or I lived." },
    { q: "One Saturday, or every Saturday?", es: "Mi papá cocinaba los sábados.",
      options: ["Every Saturday", "Last Saturday only", "Next Saturday"], answer: 0,
      why: "*Cocinaba* is a habit. One Saturday would be *cocinó*." },
    { q: "Who used to work in a bank?", es: "Trabajábamos en un banco.",
      options: ["We did", "They did", "I did"], answer: 0,
      why: "*-ábamos* is we." },
    { q: "Who is being asked about the past?", es: "¿Ibas al colegio en bus?",
      options: ["A friend", "A whole group", "A stranger"], answer: 0,
      why: "*Ibas*, with *-s*: *tú*, one person you know well." },
    { q: "What is the speaker describing?", es: "En el pueblo no había internet.",
      options: ["How the town was then", "What the town has now", "A plan for the town"], answer: 0,
      why: "*Había* is the past of *hay*: there was, there wasn't." }
  ],
  yourTurn: [
    { en: "I used to live in Cali.", es: "Vivía en Cali.", accept: ["Yo vivía en Cali.", "Antes vivía en Cali."] },
    { en: "On Sundays we used to eat at my grandmother's house.", es: "Los domingos comíamos en la casa de mi abuela.", accept: ["Los domingos comíamos en casa de mi abuela."] },
    { en: "My grandmother was very tall.", es: "Mi abuela era muy alta.", accept: [] },
    { en: "There weren't many cars.", es: "No había muchos carros.", accept: [] },
    { en: "Where did you use to work? (to a friend)", es: "¿Dónde trabajabas?", accept: ["¿Dónde trabajabas antes?"] }
  ],
  personal: {
    prompt: "Think of when you were about ten. Write two true things: where you lived or what your home was like, and something you used to do every week.",
    constraints: [
      { type: "anyVerbInTense", tense: "imperfecto", label: "a verb in this past: *vivía*, *era*, *jugaba*…" },
      { type: "containsAny", words: ["todos los", "todas las", "los domingos", "los sábados", "los lunes", "siempre", "cada"], label: "how often: *siempre*, *los sábados*, *cada semana*…" },
      { type: "minWords", n: 6, label: "at least six words" }
    ],
    model: "Cuando tenía diez años vivía en Toronto. Los sábados jugaba hockey con mi hermano."
  },
  pitfalls: [
    "English “used to” is not *usar*: *Yo usaba vivir en Cali* means nothing. The ending does the job: *Vivía en Cali.*",
    "The we form carries a mark: *trabajábamos*, *íbamos*, *éramos*.",
    "*Había* stays the same for one thing or many, like *hay*: *había muchos carros*, never *habían*."
  ]
},

"nt-localizacion-tiempo-a2": {
  source: "merged",
  hook: {
    line: "Two numbers come up with every new friend: how long ago you arrived, and how long you have been here. English needs “ago” and “have been”; Spanish does both with one small word, *hace*.",
    es: "Llegué a Bogotá hace dos años.\nVivo aquí desde hace dos años.",
    en: "I arrived in Bogotá two years ago.\nI have been living here for two years."
  },
  examples: [
    { es: "Trabajo de lunes a viernes, desde las ocho hasta las cinco.", en: "I work Monday to Friday, from eight until five." },
    { es: "Laura llegó hace rato.", en: "Laura got here a while ago." },
    { es: "Estuvimos en Cartagena durante una semana.", en: "We were in Cartagena for a week." }
  ],
  rule: "Ask one question: is it over, or still going?\nOver: a past verb, then *hace* and the time. That is ago: *Llegué hace dos años.*\nStill going: a present verb, then *desde hace* and the time: *Vivo aquí desde hace dos años.* Spanish keeps the present, because you still live here.\n*Hace* never changes: *hace un mes, hace diez años*. *Hace rato* is a while ago.\nA stretch of time has two ends:\n*desde las ocho hasta las cinco*: from eight until five\n*de lunes a viernes*: Monday to Friday\nKeep the pairs together: *desde* with *hasta*, *de* with *a*.\n*Durante* gives the whole length, with no ends: *durante una semana*, for a week.",
  readAndPick: [
    { q: "Does Sam still live in Bogotá?", es: "Sam vive en Bogotá desde hace un año.",
      options: ["Yes, he still lives there", "No, he left a year ago", "He moves there next year"], answer: 0,
      why: "*Vive* with *desde hace*: it started a year ago and is still going." },
    { q: "When did Laura arrive?", es: "Laura llegó hace diez minutos.",
      options: ["Ten minutes ago", "In ten minutes", "For ten minutes"], answer: 0,
      why: "*Llegó* is over, and *hace* counts back from now: ago." },
    { q: "When is the café open?", es: "El café abre de lunes a sábado.",
      options: ["Monday to Saturday", "Mondays and Saturdays", "Every day but Monday"], answer: 0,
      why: "*De* and *a* name both ends of the stretch." },
    { q: "Is the trip over?", es: "Estuvimos en Cartagena durante una semana.",
      options: ["Yes, it lasted a week", "No, they're still there", "It starts in a week"], answer: 0,
      why: "*Estuvimos* is over, and *durante* gives its whole length." },
    { q: "How long ago did she leave?", es: "Se fue hace rato.",
      options: ["A while ago", "Just this second", "In a little while"], answer: 0,
      why: "*Hace rato*: a while ago, counted back from now." }
  ],
  yourTurn: [
    { en: "I arrived two years ago.", es: "Llegué hace dos años.", accept: [] },
    { en: "I have been living in Bogotá for two years.", es: "Vivo en Bogotá desde hace dos años.", accept: ["Hace dos años que vivo en Bogotá."] },
    { en: "I work from eight until five.", es: "Trabajo desde las ocho hasta las cinco.", accept: ["Trabajo de ocho a cinco."] },
    { en: "We were in Cartagena for a week.", es: "Estuvimos en Cartagena durante una semana.", accept: ["Estuvimos una semana en Cartagena.", "Estuvimos en Cartagena una semana."] }
  ],
  personal: {
    prompt: "Write two true lines about where you live: when you arrived, with a past verb and *hace*, and how long you have been there, with *desde hace*.",
    constraints: [
      { type: "anyVerbInTense", tense: "preterito", label: "when you arrived, in the past: *llegué hace…*" },
      { type: "regex", pattern: "desde hace\\s+\\S+", label: "how long so far, with *desde hace*" }
    ],
    model: "Llegué a Toronto hace cinco años. Vivo en el centro desde hace dos años."
  },
  pitfalls: [
    "*Vivo aquí hace dos años* is missing a word: for something still going, *desde hace*.",
    "In Spain you will hear *ha llegado hace un rato* for something today. In Latin America the everyday past does it: *llegó hace un rato*.",
    "In Colombia *ahorita* can mean right now or in a little while, so if it matters, ask."
  ]
},

"nt-frecuencia-a2": {
  source: "merged",
  hook: {
    line: "How often do you go to the gym, call your mother, buy coffee? Spanish counts it the way English does, so many times a week. The slips are in the small words in between.",
    es: "Antes iba al gimnasio tres veces a la semana.\nAhora voy una vez al mes.",
    en: "I used to go to the gym three times a week.\nNow I go once a month."
  },
  examples: [
    { es: "Llamo a mi mamá todos los días.", en: "I call my mom every day." },
    { es: "Tomo tinto dos veces al día.", en: "I have a black coffee twice a day." },
    { es: "Compro una libra de café cada semana.", en: "I buy a pound of coffee every week." }
  ],
  rule: "Count the times, then say per what:\n*una vez*: once. *dos veces*: twice. *tres veces*: three times.\nThen *al día*, *a la semana*, *al mes*, *al año*. Only *semana* takes *a la*; the others are *el* words, and *a el* becomes *al*.\nOne *vez*, two *veces*: the *z* turns into *c*.\n*Todos los días* is every single day, no gaps. *Cada semana* says each week, one after another.\nTo ask: *¿Cuántas veces a la semana…?*\nFor how much, the container comes first, then *de*: *una botella de agua*, *un paquete de arroz*, *una libra de café*.\nClothes have a *talla*, shoes a *número*: *talla M*, *número 38*.",
  readAndPick: [
    { q: "How often does Ana go to the pool?", es: "Ana va a la piscina dos veces a la semana.",
      options: ["Twice a week", "Every two weeks", "Two weeks a year"], answer: 0,
      why: "*Dos veces*: two times. *A la semana*: each week." },
    { q: "Does Diego ever skip a day?", es: "Diego corre todos los días.",
      options: ["No, never a day", "Yes, now and then", "Yes, weekends"], answer: 0,
      why: "*Todos los días* is every single day, with no gaps." },
    { q: "Is this a habit they have now, or one from before?", es: "Antes comíamos afuera una vez al mes.",
      options: ["One from before", "One they have now", "A plan for next month"], answer: 0,
      why: "*Antes* and *comíamos*: how it used to be." },
    { q: "What is Sam asking about?", es: "¿Tiene estos zapatos en número 42?",
      options: ["Shoes in size 42", "Forty-two pairs of shoes", "A shirt in size 42"], answer: 0,
      why: "*Número* is a shoe size; clothes take *talla*." },
    { q: "How often does Laura call home?", es: "Laura llama a su familia cada domingo.",
      options: ["Every Sunday", "Some Sundays", "One Sunday"], answer: 0,
      why: "*Cada domingo*: each Sunday, one after another." }
  ],
  yourTurn: [
    { en: "I go to the gym three times a week.", es: "Voy al gimnasio tres veces a la semana.", accept: [] },
    { en: "I call my mom every day.", es: "Llamo a mi mamá todos los días.", accept: ["Llamo a mi mamá cada día.", "Llamo a mi madre todos los días."] },
    { en: "Ask a friend: How many times a week do you go to the gym?", es: "¿Cuántas veces a la semana vas al gimnasio?", accept: ["¿Cuántas veces vas al gimnasio a la semana?"] },
    { en: "A bottle of water, please.", es: "Una botella de agua, por favor.", accept: [] },
    { en: "I used to eat out once a month.", es: "Comía afuera una vez al mes.", accept: ["Comía fuera una vez al mes.", "Antes comía afuera una vez al mes."] }
  ],
  personal: {
    prompt: "Write two true lines about how often you do things: one with *vez* or *veces*, and one with *todos los días* or *cada*.",
    constraints: [
      { type: "regex", pattern: "\\b(vez|veces)\\s+(al|a la)\\b", label: "how many times, with *vez* or *veces* and *al* or *a la*" },
      { type: "containsAny", words: ["todos los", "todas las", "cada"], label: "*todos los días* or *cada*" }
    ],
    model: "Voy al gimnasio dos veces a la semana y tomo tinto todos los días."
  },
  pitfalls: [
    "*Dos vez* is a slip: more than one is *veces*.",
    "*Al semana* is a slip: *semana* is a *la* word, so *a la semana*.",
    "A container needs *de*: *una botella de agua*, never *una botella agua*."
  ]
},

"task-a2-antes": {
  source: "old",
  hook: {
    line: "This week ends with a picture, not a story. You describe your life ten years ago: where you lived, what it was like, what you did every week. Nothing happens in it at all.",
    es: "Hace diez años vivía en un pueblo pequeño.\nTrabajaba en una tienda y los sábados jugaba fútbol.",
    en: "Ten years ago I lived in a small town.\nI worked in a shop and on Saturdays I played football."
  },
  examples: [
    { es: "La casa era vieja y tenía un patio grande.", en: "The house was old and had a big yard." },
    { es: "Tenía un perro que se llamaba Toco.", en: "I had a dog called Toco." },
    { es: "Antes no me gustaba el café. Ahora lo tomo todos los días.", en: "I didn't use to like coffee. Now I drink it every day." }
  ],
  rule: "A picture of the past has four parts, and each one takes the describing past:\nWhere and when: *Hace diez años vivía en Cali.*\nWhat it was like: *La casa era pequeña. Había un parque cerca.*\nWhat you used to do: *Trabajaba en un banco. Los domingos iba al cine.*\nHow you felt, what you liked: *Estaba contento. No me gustaba el frío.*\nAge goes with *tener*: *Tenía veinte años.*\nNothing happens in this text, so there is no *fui* and no *comí*: those are for events.\nClose with how it is now, with *ya no* or *ahora*: *Ya no vivo allí.*",
  readAndPick: [
    { q: "Part of the picture, or something that happened once?", es: "Los sábados íbamos al río.",
      options: ["Part of the picture", "Something that happened", "A plan for Saturday"], answer: 0,
      why: "*Íbamos* with *los sábados*: a habit, part of how things were." },
    { q: "Which verb is an event, not part of the picture?", es: "Vivía en Cali. Trabajaba en un banco. Un día conocí a Laura.",
      options: ["conocí", "vivía", "trabajaba"], answer: 0,
      why: "*Conocí* happened once. In a picture of the past, the verbs end in *-aba* or *-ía*." },
    { q: "How old was the speaker then?", es: "Hace diez años tenía veinte años.",
      options: ["Twenty, ten years ago", "Ten, twenty years ago", "Thirty, ten years ago"], answer: 0,
      why: "*Tenía veinte años*: was twenty. *Hace diez años*: ten years ago." },
    { q: "Does she still live there?", es: "Ya no vivo allí.",
      options: ["Not any more", "Yes, still", "Not yet"], answer: 0,
      why: "*Ya no*: not any more." },
    { q: "How did the speaker feel about school?", es: "No me gustaba el colegio.",
      options: ["Didn't like it then", "Doesn't like it now", "Liked it a lot"], answer: 0,
      why: "*Gustaba*: how it was back then, not now." }
  ],
  yourTurn: [
    { en: "Ten years ago I lived in a small town.", es: "Hace diez años vivía en un pueblo pequeño.", accept: [] },
    { en: "The house was old.", es: "La casa era vieja.", accept: [] },
    { en: "On Saturdays I used to play football.", es: "Los sábados jugaba fútbol.", accept: ["Los sábados jugaba al fútbol."] },
    { en: "I was twenty.", es: "Tenía veinte años.", accept: [] },
    { en: "I don't live there any more.", es: "Ya no vivo allí.", accept: ["Ya no vivo ahí.", "Ya no vivo allá."] }
  ],
  personal: {
    prompt: "Describe your life ten years ago in three or four short lines: where you lived, what it was like, what you used to do. Nothing happens, only how things were.",
    constraints: [
      { type: "anyVerbInTense", tense: "imperfecto", label: "verbs in the describing past: *vivía*, *era*, *iba*…" },
      { type: "regex", pattern: "hace\\s+\\S+\\s+años", label: "when: *hace diez años*…" },
      { type: "minSentences", n: 3, label: "at least three sentences" }
    ],
    model: "Hace diez años vivía en Toronto. Mi apartamento era pequeño, pero había un parque cerca. Los domingos iba al parque con mi perro."
  },
  pitfalls: [
    "One event slips in easily: *un día conocí a…* belongs in a story, and this text is a picture.",
    "Age is *tener*: *tenía veinte años*, never *era veinte años*.",
    "Only *ser*, *ir* and *ver* are odd: *era*, *iba*, *veía*. Every other verb is regular here."
  ]
},

/* ---- unit 16 · Telling a story ----------------------------------------- */

"preterite-imperfect": {
  source: "merged",
  hook: {
    line: "Ask a Colombian what happened last night and the answer comes in two layers: first the scene, then the thing that happened in it. Spanish gives each layer its own past, and the ending tells you which one you are hearing.",
    es: "Sam: ¿Qué pasó anoche?\nLaura: Era tarde y llovía mucho. Estaba sola en casa.\nLaura: De repente se fue la luz.",
    en: "Sam: What happened last night?\nLaura: It was late and it was raining hard. I was home alone.\nLaura: Suddenly the power went out."
  },
  examples: [
    { es: "Comía a las dos.\nComí a las dos.", en: "I used to eat at two.\nI ate at two." },
    { es: "Estaba en la cocina cuando llegó Diego.", en: "I was in the kitchen when Diego arrived." },
    { es: "De niño iba a la playa en diciembre. Este año fui en julio.", en: "As a boy I went to the beach in December. This year I went in July." }
  ],
  rule: "Two pasts, two jobs.\nThe event past (*llegué, comió, fue*): it happened and it is done, one step in the story.\nThe describing past (*llegaba, comía, era*) puts you in the middle: what was going on, what things were like, what used to happen.\n*Llovía cuando llegué.* It was raining when I arrived.\n*Llovió toda la noche.* It rained all night.\nThe test: if the English still works with “was doing” or “used to”, use the describing past. If it works with “and then” in front, use the event past.\nTime, weather, age and feelings set the scene: *Eran las diez. Tenía frío.*\nA total wraps it up as one event: *toda la noche, tres veces, diez años*.",
  readAndPick: [
    { q: "A habit, or one time?", es: "Comía en la casa de mi abuela.",
      options: ["A habit", "One time", "A plan"], answer: 0,
      why: "*Comía*: the describing past, what used to happen." },
    { q: "A habit, or one time?", es: "Comí en la casa de mi abuela.",
      options: ["One time", "A habit", "A plan"], answer: 0,
      why: "*Comí*: the event past. It happened once and it is done." },
    { q: "Which part of the story is this?", es: "Eran las once y no había nadie en la calle.",
      options: ["Setting the scene", "What happened next", "The end"], answer: 0,
      why: "The time and an empty street: *eran* and *había* paint the scene." },
    { q: "Which part of the story is this?", es: "De repente se fue la luz.",
      options: ["What happened", "The scene around it", "How things used to be"], answer: 0,
      why: "*De repente* and *se fue*: an event drops into the scene." },
    { q: "Was Ana still on the phone when Diego came in?", es: "Ana hablaba por teléfono cuando entró Diego.",
      options: ["Yes, she was", "No, she had hung up", "No, she called later"], answer: 0,
      why: "*Hablaba* was going on; *entró* cut across it." },
    { q: "Was it still raining in the morning?", es: "Llovió toda la noche.",
      options: ["No, it had stopped", "Yes, it was", "It never rained"], answer: 0,
      why: "*Llovió toda la noche* wraps the whole night up as one finished event." }
  ],
  yourTurn: [
    { en: "It was late and it was raining.", es: "Era tarde y llovía.", accept: [] },
    { en: "Suddenly the phone rang.", es: "De repente sonó el teléfono.", accept: ["De repente el teléfono sonó."] },
    { en: "I was in the kitchen when Laura arrived.", es: "Estaba en la cocina cuando llegó Laura.", accept: ["Estaba en la cocina cuando Laura llegó."] },
    { en: "As a child I played football every day.", es: "De niño jugaba fútbol todos los días.", accept: ["De niño jugaba al fútbol todos los días.", "Cuando era niño jugaba fútbol todos los días.", "De niña jugaba fútbol todos los días."] },
    { en: "Yesterday I played football with Diego.", es: "Ayer jugué fútbol con Diego.", accept: ["Ayer jugué al fútbol con Diego."] }
  ],
  personal: {
    prompt: "Think of a night something surprising happened to you. Write the scene in a line or two (*era*, *estaba*, *había*, *llovía*), then the event, starting with *De repente*.",
    constraints: [
      { type: "anyVerbInTense", tense: "imperfecto", label: "the scene, in the describing past: *era*, *estaba*, *había*…" },
      { type: "anyVerbInTense", tense: "preterito", label: "the event, in the event past: *sonó*, *llegó*, *vi*…" },
      { type: "containsWord", word: "de repente", label: "*de repente*, where the event starts" }
    ],
    model: "Era tarde y estaba solo en casa. Llovía mucho. De repente alguien tocó la puerta."
  },
  pitfalls: [
    "Time words do not decide: *ayer* goes with both. *Ayer fui al banco. Ayer llovía cuando salí.*",
    "Length does not decide either: *Fue profesor cuarenta años* wraps forty years up as one finished stretch.",
    "Age in a story is part of the scene: *Tenía siete años cuando nos fuimos de Cali*, not *tuve*."
  ]
},

"gn-narrar-anecdota-a2": {
  source: "old",
  hook: {
    line: "A good anecdote has a shape as fixed as a joke: a calm scene, something goes wrong, what you did, how it ended. Spanish storytellers mark each turn with a few set words, and listeners wait for them.",
    es: "Resulta que estaba en la playa y no había nadie.\nDe repente, un señor empezó a gritar.\nEntonces corrí a ver qué pasaba.\nTotal, que era un amigo de mi papá.",
    en: "So I was on the beach and there was nobody around.\nSuddenly a man started shouting.\nSo I ran to see what was going on.\nAnyway, it turned out he was a friend of my dad's."
  },
  examples: [
    { es: "Una vez perdí el último bus.", en: "Once I missed the last bus." },
    { es: "Me preguntó: ¿Usted es de aquí? Y yo dije: No, soy de Canadá.", en: "He asked me: Are you from here? And I said: No, I'm from Canada." },
    { es: "Al final nos reímos mucho.", en: "In the end we laughed a lot." }
  ],
  rule: "An anecdote moves in five steps, and each has its words:\nThe scene, in the describing past: *Era sábado. Estaba en la playa.* Open with *Resulta que…* or *Una vez…*\nSomething goes wrong: *De repente…*\nWhat you did: *Entonces…*\nHow it ended: *Al final…*, or chatting, *Total, que…*\nHow things were after: *Desde ese día…*\nThe scene waits; the events move. Every step after the first takes the event past: *empezó, corrí, fuimos*.\nTo quote someone, pause the story and give their words: *Me dijo: ¿Usted es de aquí?*\n*Empezar a* plus the dictionary form marks a new action: *empezó a llover*.",
  readAndPick: [
    { q: "Where in the story is this line?", es: "Era domingo y estábamos en el parque.",
      options: ["The opening", "The problem", "The ending"], answer: 0,
      why: "*Era* and *estábamos* set the scene, so the story is only starting." },
    { q: "What does the listener now expect?", es: "De repente, alguien gritó mi nombre.",
      options: ["Trouble, after a calm start", "The end of the story", "A description of the place"], answer: 0,
      why: "*De repente* marks the turn: calm until now, then this." },
    { q: "Is the speaker giving an event or the scene?", es: "Entonces llamamos a la policía.",
      options: ["An event", "The scene", "A habit"], answer: 0,
      why: "*Llamamos* is the event past, and *entonces* says what came next." },
    { q: "What does *total, que* do here?", es: "Total, que no fuimos a la fiesta.",
      options: ["Sums up how it ended", "Adds up what it cost", "Starts a new story"], answer: 0,
      why: "*Total, que*: anyway, in the end. It closes the story." },
    { q: "What did the woman ask?", es: "Me preguntó: ¿Usted es de aquí?",
      options: ["If I was from here", "Where I was from", "If I lived nearby"], answer: 0,
      why: "After the colon come her own words: *¿Usted es de aquí?*" }
  ],
  yourTurn: [
    { en: "Suddenly someone started shouting.", es: "De repente, alguien empezó a gritar.", accept: [] },
    { en: "It was Saturday and we were at the beach.", es: "Era sábado y estábamos en la playa.", accept: [] },
    { en: "So we called my dad.", es: "Entonces llamamos a mi papá.", accept: ["Entonces llamamos a mi padre."] },
    { en: "In the end we laughed a lot.", es: "Al final nos reímos mucho.", accept: [] },
    { en: "It started to rain.", es: "Empezó a llover.", accept: [] }
  ],
  personal: {
    prompt: "Tell the start and the turn of a real story in two or three lines: the scene first, then *de repente* and what happened.",
    constraints: [
      { type: "anyVerbInTense", tense: "imperfecto", label: "the scene: *era*, *estaba*, *había*…" },
      { type: "containsWord", word: "de repente", label: "the turn, with *de repente*" },
      { type: "anyVerbInTense", tense: "preterito", label: "what happened, in the event past" }
    ],
    model: "Resulta que era lunes y yo estaba en el bus. De repente, el bus paró y todos se bajaron."
  },
  pitfalls: [
    "A story told all in the event past reads like a list: give the scene first, in the describing past.",
    "*Total, que* is for chatting; in writing, close with *al final*.",
    "*Empezar a* needs its *a*: *empezó a llover*, never *empezó llover*."
  ]
},

"dc-estructuradores-a2": {
  source: "old",
  hook: {
    line: "When you explain something out loud, a few small words do the work of a numbered list. And when the answer is no, Spanish says it twice on purpose: *no* and then *nadie*, *nada* or *nunca*.",
    es: "Mira, primero fuimos al centro, luego comimos y por último volvimos en bus.\nNo vimos a nadie conocido.",
    en: "Look, first we went downtown, then we ate and finally we came back by bus.\nWe didn't see anyone we knew."
  },
  examples: [
    { es: "No tenía plata. Por eso no fui.", en: "I didn't have any money. That's why I didn't go." },
    { es: "Además, el hotel era muy barato.", en: "What's more, the hotel was really cheap." },
    { es: "Todavía no he terminado.", en: "I haven't finished yet." }
  ],
  rule: "To put things in order:\n*primero*: first. *luego*, *después*: then. *por último* or *al final*: finally.\n*además*: what's more. *por eso*: that's why.\n*Mira* and *oye* open: look, listen. They ask for attention, not an action.\nFor a strong no:\n*nunca*: never. *nada*: nothing. *nadie*: nobody. *en mi vida*: never in my life. *ni siquiera*: not even.\nBefore the verb, the word stands alone: *Nunca voy. Nadie vino.*\nAfter the verb, *no* goes in front as well: *No voy nunca. No vino nadie. No dije nada.*\nTwo negatives here are correct, not a mistake.\n*Todavía no* is not yet: *Todavía no he terminado.*",
  readAndPick: [
    { q: "Did anybody come?", es: "No vino nadie.",
      options: ["No, nobody did", "Yes, one person", "Nobody knows"], answer: 0,
      why: "*No* and *nadie*: nobody came. Two negatives make one strong no." },
    { q: "Has Laura finished?", es: "Laura todavía no ha terminado.",
      options: ["Not yet", "Yes, just now", "She never will"], answer: 0,
      why: "*Todavía no*: not yet. She is still on it." },
    { q: "What does *por eso* tell you?", es: "Estaba enfermo. Por eso no fue.",
      options: ["Why he didn't go", "When he went", "Who went with him"], answer: 0,
      why: "*Por eso*: that's why. The first sentence is the reason." },
    { q: "Which step is this?", es: "Por último, guardamos todo en el carro.",
      options: ["The last step", "The first", "A step in the middle"], answer: 0,
      why: "*Por último* closes a list of steps." },
    { q: "How often does Diego cook?", es: "Diego no cocina nunca.",
      options: ["Never", "Every day", "Now and then"], answer: 0,
      why: "*No* and *nunca*: never. After the verb, the *no* in front is needed." },
    { q: "Is *mira* an order to look at something?", es: "Mira, yo creo que tienes razón.",
      options: ["No, it just opens", "Yes, look at this", "Yes, look at me"], answer: 0,
      why: "*Mira* here opens what you say, like look or listen in English." }
  ],
  yourTurn: [
    { en: "Nobody came.", es: "No vino nadie.", accept: ["Nadie vino."] },
    { en: "I never go.", es: "Nunca voy.", accept: ["No voy nunca."] },
    { en: "I didn't say anything.", es: "No dije nada.", accept: [] },
    { en: "First we ate, then we went downtown.", es: "Primero comimos, luego fuimos al centro.", accept: ["Primero comimos y luego fuimos al centro.", "Primero comimos, después fuimos al centro.", "Primero comimos y después fuimos al centro."] },
    { en: "I haven't finished yet.", es: "Todavía no he terminado.", accept: ["No he terminado todavía."] }
  ],
  personal: {
    prompt: "Write two true lines about somewhere you have never been or something you never do, with a strong no. Add a reason with *por eso* if you like.",
    constraints: [
      { type: "containsAny", words: ["nunca", "en mi vida", "nadie", "nada"], label: "a strong no: *nunca*, *nada*, *nadie* or *en mi vida*" },
      { type: "minSentences", n: 2, label: "two sentences" }
    ],
    model: "Nunca he estado en Cartagena. No tengo vacaciones largas, por eso no viajo mucho."
  },
  pitfalls: [
    "*Dije nada* is missing its *no*: after the verb, *No dije nada.*",
    "*Todavía* in a yes sentence means still: *Todavía vivo aquí.* With *no* it means not yet.",
    "Spain uses *he* far more for today's news, *hoy no ha venido*; in Latin America that is *hoy no vino*. Keep *he* for not yet and never: *todavía no he terminado*, *nunca he ido*."
  ]
},

"task-a2-anecdota": {
  source: "old",
  hook: {
    line: "This is what the last two weeks were for: a real story, with a scene that waits and events that move. Most learner stories jump straight to the events. Yours starts with the picture.",
    es: "Era sábado y llovía muchísimo.\nEstaba en la cocina cuando sonó el timbre.",
    en: "It was Saturday and it was pouring.\nI was in the kitchen when the doorbell rang."
  },
  examples: [
    { es: "Abrí la puerta y no había nadie.", en: "I opened the door and there was nobody there." },
    { es: "Mientras esperábamos, hablamos dos horas.", en: "While we waited, we talked for two hours." },
    { es: "Al final fue un día muy bonito.", en: "In the end it was a really lovely day." }
  ],
  rule: "Build it in three layers.\nThe scene first, in the describing past: where, when, the weather, who was there, how you felt. *Era sábado. Llovía. Estaba solo.*\nThen the events, in the event past and in order: *Sonó el timbre. Abrí la puerta.*\nThen a closing line: *Al final…* or *Desde ese día…*\nOne shape is worth learning whole: something going on, then an event that cuts across it.\n*Estaba en la cocina cuando sonó el teléfono.*\n*Mientras* goes with what was going on: *Mientras esperábamos, hablamos dos horas.*\nAim for twelve to sixteen sentences, and open with at least two lines of scene before anything happens.",
  readAndPick: [
    { q: "Where was the speaker when the bell rang?", es: "Estaba en la cocina cuando sonó el timbre.",
      options: ["In the kitchen", "At the door", "Out in the street"], answer: 0,
      why: "*Estaba en la cocina*: the scene. *Sonó*: the event that cut across it." },
    { q: "Which verb moves the story on?", es: "Era tarde, llovía y salimos.",
      options: ["salimos", "llovía", "era"], answer: 0,
      why: "*Salimos* is the event past. *Era* and *llovía* only paint the scene." },
    { q: "When did they talk?", es: "Mientras esperábamos, hablamos dos horas.",
      options: ["During the wait", "Before the wait", "After it ended"], answer: 0,
      why: "*Mientras*: while. The talking filled the wait." },
    { q: "Is this the start of the story, or the end?", es: "Al final, fue un día muy bonito.",
      options: ["The ending", "The start", "The middle part"], answer: 0,
      why: "*Al final* closes it, and *fue* sums up the whole day." },
    { q: "Was anybody at the door?", es: "Abrí la puerta y no había nadie.",
      options: ["No, nobody", "Yes, a friend", "Yes, the police"], answer: 0,
      why: "*No había nadie*: there was nobody. Opening the door is the event." }
  ],
  yourTurn: [
    { en: "It was Saturday and it was raining a lot.", es: "Era sábado y llovía mucho.", accept: [] },
    { en: "I was in the kitchen when the doorbell rang.", es: "Estaba en la cocina cuando sonó el timbre.", accept: ["Estaba en la cocina cuando el timbre sonó."] },
    { en: "I opened the door and there was nobody there.", es: "Abrí la puerta y no había nadie.", accept: [] },
    { en: "While we waited, we talked for two hours.", es: "Mientras esperábamos, hablamos dos horas.", accept: ["Mientras esperábamos, hablamos durante dos horas."] }
  ],
  personal: {
    prompt: "Start your own story: a line or two of scene, then one event that cuts across it with *cuando*.",
    constraints: [
      { type: "anyVerbInTense", tense: "imperfecto", label: "the scene, in the describing past" },
      { type: "anyVerbInTense", tense: "preterito", label: "an event, in the event past" },
      { type: "containsWord", word: "cuando", label: "*cuando*, where the event cuts in" }
    ],
    model: "Era domingo y hacía mucho calor. Estaba en el parque con mi hermana cuando empezó a llover."
  },
  pitfalls: [
    "Do not skip the scene: a story that opens with *fui* reads like a list.",
    "*Mientras* takes the describing past for what was going on: *mientras esperábamos*.",
    "Close the story: one line with *al final* tells the listener it is over."
  ]
},

/* ---- unit 18 · It, him, her, them -------------------------------------- */

"gr-objeto-indirecto-a2": {
  source: "merged",
  hook: {
    line: "All day you give, tell, send and lend things to people. Spanish names that person with a small word in front of the verb, and keeps it even when the name comes too.",
    es: "¿Le escribiste a tu mamá?\nSí, le mandé un mensaje anoche.",
    en: "Did you write to your mom?\nYes, I sent her a message last night."
  },
  examples: [
    { es: "Les di mi número a los vecinos.", en: "I gave the neighbours my number." },
    { es: "Me robaron la billetera en el bus.", en: "They stole my wallet on the bus." },
    { es: "¿Me prestas tu lapicero?", en: "Can you lend me your pen? (to a friend)" }
  ],
  rule: "When you give, tell, send or lend something to someone, that person gets a small word before the verb:\n*me*: to me. *te*: to you, a friend.\n*le*: to him, to her, to you (*usted*).\n*nos*: to us. *les*: to them, to you all.\n*Le* and *les* are the same for a man or a woman: *Le di la llave* is I gave him the key, or her.\nName the person and *le* stays: *Le escribí a Laura. Les compré dulces a los niños.* Spanish names the person twice, and that is normal.\nFor your body and your things, *me* already says whose, so the thing takes *el* or *la*: *Me robaron la billetera. Me duele la cabeza.*",
  readAndPick: [
    { q: "Who got the key?", es: "Le di la llave a Laura.",
      options: ["Laura got it", "The speaker kept it", "Nobody"], answer: 0,
      why: "*Le* and *a Laura*: Laura is the one it went to." },
    { q: "Who wrote to whom?", es: "A Laura le escribió Diego.",
      options: ["Diego wrote to Laura", "Laura wrote to Diego", "They both wrote"], answer: 0,
      why: "*A Laura le*: the one it went to, even though she comes first. Diego wrote." },
    { q: "Who did the speaker write to?", es: "Les escribí a mis papás.",
      options: ["Both my parents", "Only my father", "My mom and my aunt"], answer: 0,
      why: "*Les*: to them. *Mis papás* is my parents." },
    { q: "Whose wallet was stolen?", es: "Le robaron la billetera a Diego.",
      options: ["Diego's", "The speaker's", "Nobody's yet"], answer: 0,
      why: "*Le* and *a Diego*: it happened to Diego. Spanish says *la billetera*, not *su*." },
    { q: "Whose head hurts?", es: "¿Te duele la cabeza?",
      options: ["The listener's", "The speaker's", "Someone else's"], answer: 0,
      why: "*Te*: you. Your head, though Spanish says *la cabeza*." }
  ],
  yourTurn: [
    { en: "I gave Laura the key.", es: "Le di la llave a Laura.", accept: ["Le di a Laura la llave."] },
    { en: "I wrote to my parents.", es: "Les escribí a mis papás.", accept: ["Les escribí a mis padres."] },
    { en: "They stole my wallet.", es: "Me robaron la billetera.", accept: [] },
    { en: "Can you lend me your pen? (to a friend)", es: "¿Me prestas tu lapicero?", accept: ["¿Me puedes prestar tu lapicero?", "¿Me prestas tu esfero?"] },
    { en: "My head hurts.", es: "Me duele la cabeza.", accept: [] }
  ],
  personal: {
    prompt: "Who did you last give something to, or write to? Say it with the person's name and *le* or *les*.",
    constraints: [
      { type: "regex", pattern: "\\b(le|les)\\s+\\S+", label: "*le* or *les* before the verb" },
      { type: "regex", pattern: "\\sa\\s+\\S+|\\sal\\s+\\S+", label: "the person too, with *a*: *a Laura*, *a mi hermano*" },
      { type: "anyVerbInTense", tense: "preterito", label: "what you did, in the past: *di*, *escribí*, *mandé*…" }
    ],
    model: "Ayer le mandé un mensaje a mi hermana."
  },
  pitfalls: [
    "*Di la llave a Laura* sounds bare: keep the small word, *Le di la llave a Laura.*",
    "For more than one person, *les*: *Les escribí a mis papás.*",
    "*Me robaron mi billetera* says whose twice: *me* is enough, *Me robaron la billetera.*"
  ]
},

"gr-pronombres-atonos-a2": {
  source: "merged",
  hook: {
    line: "Ask a friend to lend you their car and they will not say the car again. Two small words do it, the person first and then the thing, both in front of the verb.",
    es: "¿Me prestas el carro?\nSí, claro, te lo presto.",
    en: "Will you lend me the car?\nYes, of course, I'll lend it to you."
  },
  examples: [
    { es: "¿Las llaves? Te las dejo en la mesa.", en: "The keys? I'll leave them for you on the table." },
    { es: "¿Y el libro? Se lo di a Diego.", en: "And the book? I gave it to Diego." },
    { es: "Lo vi en la esquina y le dije la verdad.", en: "I saw him on the corner and told him the truth." }
  ],
  rule: "The thing, or a person the action lands on: *lo, la, los, las*. They match the thing: *el carro*, *lo*; *la llave*, *la*.\nThe person something goes to: *le, les*, the same for men and women.\n*Me, te, nos* do both jobs: *me ve*, sees me; *me da el libro*, gives me the book.\nTwo together: the person first, then the thing, both before the verb: *Te lo presto. Me la dio.*\nOne swap: *le* or *les* right before *lo, la, los, las* becomes *se*. *Le doy el libro* turns into *Se lo doy*, never *le lo*.\nThat *se* can be him, her, *usted* or them; add *a Diego* when it is not clear.",
  readAndPick: [
    { q: "What is Laura lending?", es: "¿El carro? Sí, te lo presto.",
      options: ["The car", "Keys", "Some money"], answer: 0,
      why: "*Lo* stands for *el carro*, the *el* word in the question." },
    { q: "Who is getting the book?", es: "Se lo di a Diego.",
      options: ["Diego", "The speaker", "Ana"], answer: 0,
      why: "*Se* is *le* before *lo*: to him. *A Diego* says who." },
    { q: "What does *la* stand for here?", es: "¿La llave? Ya se la di a tu mamá.",
      options: ["The key", "Mom", "The front door"], answer: 0,
      why: "*La* is the thing, *la llave*. *Se* is the person, your mom." },
    { q: "Did the speaker see the man, or give him something?", es: "Lo vi en la esquina.",
      options: ["Saw him there", "Paid him", "Gave him something"], answer: 0,
      why: "*Lo*: the seeing landed straight on him. Telling him would be *le*." },
    { q: "How many keys are there?", es: "¿Las llaves? Te las dejo aquí.",
      options: ["More than one", "Just one", "None at all"], answer: 0,
      why: "*Las*: them, for a *las* word like *las llaves*." },
    { q: "Who saw whom?", es: "A Diego lo vio Laura.",
      options: ["Laura saw Diego", "Diego saw Laura", "They saw each other"], answer: 0,
      why: "*A Diego lo*: Diego is the one seen, even though he comes first." }
  ],
  yourTurn: [
    { en: "Yes, I'll lend it to you. (the car)", es: "Sí, te lo presto.", accept: [] },
    { en: "I gave it to Diego. (the book)", es: "Se lo di a Diego.", accept: [] },
    { en: "I saw her yesterday. (Laura)", es: "La vi ayer.", accept: ["Ayer la vi."] },
    { en: "I'll leave them for you on the table. (the keys)", es: "Te las dejo en la mesa.", accept: [] },
    { en: "I told him the truth.", es: "Le dije la verdad.", accept: [] }
  ],
  personal: {
    prompt: "Think of something you lent or gave someone. Say it twice: once with the thing named, *Le di…*, then with the two small words, *Se lo di* or *Se la di*.",
    constraints: [
      { type: "regex", pattern: "\\b(le|les)\\s+\\S+", label: "first with the thing named: *Le di…*" },
      { type: "cliticCluster", label: "then with two small words: *se lo*, *se la*…" }
    ],
    model: "Le presté mi bicicleta a Diego. Se la presté el sábado."
  },
  pitfalls: [
    "*Le lo di* is the classic slip: before *lo* or *la*, *le* turns into *se*.",
    "The person comes first: *te lo*, *me la*, never *lo te*.",
    "In much of Spain you will hear *le vi* for a man. In Latin America seeing someone is *lo vi* or *la vi*."
  ]
},

"gr-pronombres-tonicos-a2": {
  source: "merged",
  hook: {
    line: "After *para*, *sin* and *con*, the words for me and you change shape. You already know two of them from *a mí me gusta*.",
    es: "¿Este café es para mí?\nSí, es para ti. ¿Vienes conmigo al parque?",
    en: "Is this coffee for me?\nYes, it's for you. Are you coming to the park with me?"
  },
  examples: [
    { es: "No puedo vivir sin ti.", en: "I can't live without you." },
    { es: "Siempre habla de mí.", en: "She's always talking about me." },
    { es: "A ella le encanta el jazz; a mí, el rock.", en: "She loves jazz; I love rock." }
  ],
  rule: "After little words like *para*, *sin*, *de* and *a*:\n*yo* becomes *mí*: *para mí, sin mí, de mí*\n*tú* becomes *ti*: *para ti, sin ti*\nEveryone else keeps the shape you know: *para él, para ella, para usted, para nosotros, para ellos*.\n*Con* glues onto me and you: *conmigo*, with me; *contigo*, with you. Then it is back to normal: *con él, con usted*.\n*Mí* with a mark is me; *mi* without one is my: *Mi café es para mí.* *Ti* never has a mark.\n*A mí* and *a ti* add weight next to *me* and *te*; they never replace them: *A mí me gusta, a ti no.*",
  readAndPick: [
    { q: "Who is the coffee for?", es: "Este café es para ti.",
      options: ["For you", "For me", "For her"], answer: 0,
      why: "*Ti*: you, after *para*." },
    { q: "Who is Diego going with?", es: "Diego va conmigo.",
      options: ["With me", "With you", "With her"], answer: 0,
      why: "*Conmigo*: with me, one word." },
    { q: "Who does the sister talk about?", es: "Mi hermana habla mucho de mí.",
      options: ["About me", "About herself", "About you"], answer: 0,
      why: "*De mí*, with a mark: about me. *Mi hermana*, without one: my sister." },
    { q: "Who loves rock?", es: "A ella le encanta el jazz; a mí, el rock.",
      options: ["The speaker", "She does", "Both of them"], answer: 0,
      why: "*A mí, el rock*: and to me, rock. The speaker." },
    { q: "Who can't manage without whom?", es: "No puedo vivir sin ti.",
      options: ["I can't, without you", "You can't, without me", "Nobody can"], answer: 0,
      why: "*Sin ti*: without you. *Puedo*: I can." }
  ],
  yourTurn: [
    { en: "This coffee is for you. (to a friend)", es: "Este café es para ti.", accept: [] },
    { en: "Are you coming with me? (to a friend)", es: "¿Vienes conmigo?", accept: [] },
    { en: "Yes, I'm going with you.", es: "Sí, voy contigo.", accept: [] },
    { en: "She always talks about me.", es: "Siempre habla de mí.", accept: ["Ella siempre habla de mí."] },
    { en: "I like coffee, but she doesn't.", es: "A mí me gusta el café, pero a ella no.", accept: ["Me gusta el café, pero a ella no."] }
  ],
  personal: {
    prompt: "Write two true lines: who you like going out with, with *con*, and something you would buy for a friend, with *para*. Try *conmigo* or *contigo* if it fits.",
    constraints: [
      { type: "regex", pattern: "\\bcon(migo|tigo)?\\b", label: "*con*, *conmigo* or *contigo*" },
      { type: "regex", pattern: "\\bpara\\s+\\S+", label: "who it is for, with *para*" }
    ],
    model: "Los sábados salgo con mi hermano. Este libro es para ti, Laura."
  },
  pitfalls: [
    "*Con mí* and *con ti* do not exist: *conmigo*, *contigo*.",
    "*Para tú* is a slip: after *para*, *ti*.",
    "*A mí gusta* is missing the small word: *A mí me gusta.*"
  ]
},

"gr-posesivos-tonicos-a2": {
  source: "merged",
  hook: {
    line: "Fifty bags come off the bus at the terminal and a man holds one up: is this yours? *Mi* cannot answer, because it needs a thing after it. You need mine.",
    es: "¿Esta maleta es suya?\nNo, la mía es la roja.",
    en: "Is this suitcase yours?\nNo, mine is the red one."
  },
  examples: [
    { es: "¿Estas llaves son tuyas?\nSí, son mías.", en: "Are these keys yours?\nYes, they're mine." },
    { es: "Un amigo mío vive en Cali.", en: "A friend of mine lives in Cali." },
    { es: "Mi carro es azul; el tuyo es rojo.", en: "My car is blue; yours is red." }
  ],
  rule: "*Mi, tu, su* only work right in front of a thing: *mi maleta*. The long forms work everywhere else:\n*mío*: mine. *tuyo*: yours, to a friend. *suyo*: his, hers, theirs, or yours to *usted*. *nuestro*: ours.\nThey match the thing, not the owner: *mío, mía, míos, mías*. Sam says *la maleta es mía* because *maleta* is a *la* word.\nWhere they go:\nafter *es* or *son*: *Es mía.*\nafter the thing: *un amigo mío*, a friend of mine\nwith *el* or *la* and no thing: *la mía*, mine\nAsked whose, one word does it: *¿De quién es? Mío.*",
  readAndPick: [
    { q: "Whose keys are they?", es: "Sí, son mías.",
      options: ["The speaker's", "The listener's", "Someone else's"], answer: 0,
      why: "*Mías*: mine. It ends in *-as* to match *las llaves*." },
    { q: "Who lives in Cali?", es: "Un amigo mío vive en Cali.",
      options: ["A friend of mine", "My best friend", "My friend's family"], answer: 0,
      why: "*Un amigo mío*: one of my friends, a friend of mine." },
    { q: "Which car is red?", es: "Mi carro es azul; el tuyo es rojo.",
      options: ["Yours", "Mine", "Both cars"], answer: 0,
      why: "*El tuyo*: yours. *El* stands for *el carro*." },
    { q: "Is the man asked politely, or as a friend?", es: "Señor, ¿esta maleta es suya?",
      options: ["In a polite way", "As a friend", "As one of a group"], answer: 0,
      why: "*Suya* goes with *usted*: yours, said politely." },
    { q: "Is the speaker a man or a woman?", es: "¿La maleta? Es mía.",
      options: ["No way to tell", "A woman, surely", "A man, surely"], answer: 0,
      why: "*Mía* matches *la maleta*, not the owner. Anyone can say it." }
  ],
  yourTurn: [
    { en: "Are these keys yours? (to a friend)", es: "¿Estas llaves son tuyas?", accept: ["¿Son tuyas estas llaves?"] },
    { en: "Yes, they're mine. (the keys)", es: "Sí, son mías.", accept: [] },
    { en: "A friend of mine lives in Cali.", es: "Un amigo mío vive en Cali.", accept: ["Una amiga mía vive en Cali."] },
    { en: "My car is blue; yours is red. (to a friend)", es: "Mi carro es azul; el tuyo es rojo.", accept: ["Mi carro es azul y el tuyo es rojo."] },
    { en: "Sir, is this suitcase yours?", es: "Señor, ¿esta maleta es suya?", accept: ["¿Esta maleta es suya, señor?"] }
  ],
  personal: {
    prompt: "Compare something of yours with a friend's, *Mi celular es… y el tuyo es…*, or name a friend of yours who lives far away: *Un amigo mío vive en…*",
    constraints: [
      { type: "regex", pattern: "\\b(m[ií]os?|m[ií]as?|tuy[oa]s?|suy[oa]s?|nuestr[oa]s?)\\b", label: "a long form: *mío*, *tuyo*, *suyo*, *nuestro*…" },
      { type: "minWords", n: 5, label: "at least five words" }
    ],
    model: "Mi celular es viejo y el tuyo es nuevo. Una amiga mía vive en Londres."
  },
  pitfalls: [
    "*Es mi* with nothing after it does not work: *Es mío.*",
    "*Un amigo de mí* is a slip: *un amigo mío*.",
    "Never *el mi libro*: the short one never takes *el*. *El mío* stands in for the thing."
  ]
},

"task-a2-pronombres": {
  source: "old",
  hook: {
    line: "Every learner writes *Compré el libro y leí el libro y le di el libro a mi hermana*. A Spanish speaker names the book once. This week ends by taking the repeats out.",
    es: "Compré el libro, lo leí en dos días y se lo di a mi hermana.",
    en: "I bought the book, read it in two days and gave it to my sister."
  },
  examples: [
    { es: "¿La torta? La hice yo.", en: "The cake? I made it." },
    { es: "Voy a llamarla mañana.", en: "I'm going to call her tomorrow." },
    { es: "¿Las fotos? Se las mandé a Laura.", en: "The photos? I sent them to Laura." }
  ],
  rule: "Name it once, then let a small word carry it.\nThe thing, or the person acted on: *lo, la, los, las*. *Compré el libro y lo leí.*\nThe person it goes to: *le, les*. *Le di el libro a Ana.*\nBoth together: *le* turns into *se*. *Se lo di.*\nWhere they go:\nbefore a verb with an ending: *lo compré, no lo leí*\nwith a pair like *voy a comprar*, before the pair or glued onto its end: *Lo voy a comprar* or *Voy a comprarlo*. Both are right.\nThe task: write a short paragraph that repeats one word four or five times, then rewrite it with the small words. Keep both.",
  readAndPick: [
    { q: "What did the speaker read in two days?", es: "Compré un libro y lo leí en dos días.",
      options: ["The book they bought", "Two different books", "A letter"], answer: 0,
      why: "*Lo* carries *un libro* from the first half of the sentence." },
    { q: "Who got the photos?", es: "¿Las fotos? Se las mandé a Laura.",
      options: ["Laura", "The speaker", "Laura's mom"], answer: 0,
      why: "*Se las*, then *a Laura*: them, to her." },
    { q: "Who is the speaker going to call?", es: "Voy a llamarla mañana.",
      options: ["Her, a woman", "Him, a man", "A whole group"], answer: 0,
      why: "*Llamarla*: *la* glued onto the end, so a woman." },
    { q: "Which says the same as *Voy a comprarlo*?", es: "Voy a comprarlo.",
      options: ["Lo voy a comprar.", "Voy a lo comprar.", "Voy lo a comprar."], answer: 0,
      why: "The small word goes before the pair or on the end, never in the middle." },
    { q: "What does *la* stand for?", es: "¿La torta? La hice yo.",
      options: ["The cake", "The speaker", "A woman"], answer: 0,
      why: "*La* carries *la torta*: I made it." }
  ],
  yourTurn: [
    { en: "I bought the book and read it in two days.", es: "Compré el libro y lo leí en dos días.", accept: [] },
    { en: "I gave it to my sister. (the book)", es: "Se lo di a mi hermana.", accept: [] },
    { en: "I'm going to buy it tomorrow. (the shirt)", es: "Voy a comprarla mañana.", accept: ["La voy a comprar mañana."] },
    { en: "The photos? I sent them to Laura.", es: "¿Las fotos? Se las mandé a Laura.", accept: ["Se las mandé a Laura."] }
  ],
  personal: {
    prompt: "Write two lines about something you bought or made recently: name it once, then use *lo* or *la* for it.",
    constraints: [
      { type: "regex", pattern: "(^|[.;,]\\s*|\\by\\s+|\\bno\\s+)(lo|la|los|las)\\s+\\S+|\\w{3,}(r|ndo)(lo|la|los|las)\\b", label: "the small word for it: *lo*, *la*, *los* or *las*" },
      { type: "minSentences", n: 2, label: "two sentences" }
    ],
    model: "Compré una camisa el sábado. La compré en el centro y la uso mucho."
  },
  pitfalls: [
    "The small word goes before the pair or on the end, never in the middle: *voy a comprarlo*, not *voy a lo comprar*.",
    "*Le lo di* is still a slip here: *se lo di*.",
    "Take out every repeat but one: a reader needs the name once to know what *lo* is."
  ]
},

/* ---- unit 19 · Asking nicely ------------------------------------------- */

"gr-imperativo-forma-a2": {
  source: "merged",
  hook: {
    line: "A friend gives you directions one way and a stranger in Bogotá another. The command for a friend is a form you already know; the one for *usted* swaps a vowel.",
    es: "Laura: Sal temprano y toma el bus en la esquina.\nUn señor: Siga dos cuadras y tome el bus en la esquina.",
    en: "Laura: Leave early and catch the bus at the corner.\nA man: Go on two blocks and catch the bus at the corner."
  },
  examples: [
    { es: "Habla más despacio, por favor.", en: "Speak more slowly, please. (to a friend)" },
    { es: "Pase, señora. Siéntese.", en: "Come in, madam. Have a seat." },
    { es: "Dime la verdad.", en: "Tell me the truth. (to a friend)" }
  ],
  rule: "To a friend, use the he or she form of the present as it is: *Laura habla*, Laura speaks; *Laura, habla*, Laura, speak. So *mira, espera, come, escribe*.\nEight short ones to learn as a set: *ven, ten, pon, sal, haz, di, ve, sé*.\nTo *usted*, swap the vowel: *-ar* verbs take *e* (*tome, espere*), *-er* and *-ir* verbs take *a* (*coma, escriba*).\nOdd verbs start from the I form: *tengo*, *tenga*; *hago*, *haga*; *salgo*, *salga*. *Ir* gives *vaya*.\nFor a group, add *n*: *tomen, vengan*.\nSmall words glue onto the end, with an accent mark to keep the weight where it was: *dime, siéntese, cómpralo*.\nThis is only for do it; don't do it comes later.",
  readAndPick: [
    { q: "Who is being told?", es: "Espere aquí, por favor.",
      options: ["Someone called usted", "A close friend", "A group of friends"], answer: 0,
      why: "*Espere*: an *-ar* verb with its vowel swapped, so *usted*." },
    { q: "Who is being told?", es: "Ven mañana a las ocho.",
      options: ["A friend", "A stranger", "A whole group"], answer: 0,
      why: "*Ven* is one of the eight short ones, for a friend." },
    { q: "How many people are being told?", es: "Vengan temprano, por favor.",
      options: ["More than one", "Just one", "Nobody yet"], answer: 0,
      why: "*Vengan* ends in *n*: a group." },
    { q: "Is this an instruction, or a fact?", es: "Laura, toma el bus.",
      options: ["An instruction to Laura", "A fact about Laura", "A question for Laura"], answer: 0,
      why: "The comma after her name makes *toma* an instruction: take the bus." },
    { q: "What does the waiter want you to do with the menu?", es: "¿La carta? Mírela con calma.",
      options: ["Take your time over it", "Give it back now", "Order straight away"], answer: 0,
      why: "*Mírela*: look at it, with *la* glued on for *la carta*. *Con calma*: no hurry." }
  ],
  yourTurn: [
    { en: "Speak more slowly, please. (to a friend)", es: "Habla más despacio, por favor.", accept: [] },
    { en: "Speak more slowly, please. (polite)", es: "Hable más despacio, por favor.", accept: [] },
    { en: "Come here! (to a friend)", es: "¡Ven aquí!", accept: ["¡Ven acá!"] },
    { en: "Tell me the truth. (to a friend)", es: "Dime la verdad.", accept: [] },
    { en: "Come in and sit down, madam.", es: "Pase y siéntese, señora.", accept: ["Siga y siéntese, señora."] }
  ],
  personal: {
    prompt: "Give a friend two instructions to get from your door to the nearest café or bus stop. Try *sal*, *camina* or *cruza*.",
    constraints: [
      { type: "anyVerbInTense", tense: "imperativo", label: "commands for a friend: *sal*, *camina*, *cruza*…" },
      { type: "minWords", n: 6, label: "at least six words" }
    ],
    model: "Sal de la casa, camina dos cuadras y cruza la calle."
  },
  pitfalls: [
    "*Hablas más despacio* is a statement, not a command: drop the *s*, *Habla más despacio*.",
    "Use the you you already use with that person: if she is *usted* in your questions, she is *usted* in your commands.",
    "In Colombia *¡Siga!* means come in or go ahead, not only keep going."
  ]
},

"fn-atenuar-orden-a2": {
  source: "merged",
  hook: {
    line: "At a Colombian table a bare order sounds rude, even with *por favor*. People ask a small question instead, and the question does more of the work than the please.",
    es: "¿Me regala un tinto, por favor?\n¿Me trae la cuenta?",
    en: "Could I have a black coffee, please?\nCould you bring me the bill?"
  },
  examples: [
    { es: "¿Me pasas la sal?", en: "Can you pass me the salt? (to a friend)" },
    { es: "¿Puede cerrar la ventana, por favor?", en: "Can you close the window, please? (polite)" },
    { es: "¿Me hace el favor de esperar un momento?", en: "Would you mind waiting a moment? (polite)" }
  ],
  rule: "Turn the order into a question. The verb stays in the plain present:\n*¿Me trae…?* to a waiter or a stranger, *¿Me traes…?* to a friend. For the whole table: *¿Nos trae la cuenta?*\nIn Colombia, ordering or buying: *¿Me regala…?* It means may I have; you still pay.\nOne step up: *¿Puede…?* or *¿Puedes…?* plus the dictionary form: *¿Puede cerrar la ventana?*\nHigher still: *¿Me hace el favor de…?* and *¿Podría…?*, could you. Learn *podría* as a set phrase for now.\n*Hay que* names nobody: *Hay que pagar en la caja.*\nThe softest of all asks nothing: *No tengo lapicero.* The listener offers.",
  readAndPick: [
    { q: "Who is the speaker asking?", es: "¿Me traes un vaso de agua?",
      options: ["A good friend", "A waiter", "The whole table"], answer: 0,
      why: "*Traes*, with an *s*: a friend. To a waiter, *¿me trae…?*" },
    { q: "Will the speaker pay for the coffee?", es: "¿Me regala un tinto, por favor?",
      options: ["Yes, as usual", "No, it's a gift", "Only if it's good"], answer: 0,
      why: "In Colombia *¿me regala…?* is just how you order. You still pay." },
    { q: "Which line leaves the most room to say no?", es: "Cierra la ventana.\n¿Puedes cerrar la ventana?\n¿Me hace el favor de cerrar la ventana?",
      options: ["The last one", "The middle one", "The first"], answer: 0,
      why: "*¿Me hace el favor de…?* is the highest step; a bare command is the lowest." },
    { q: "What does the speaker really want?", es: "Uy, no tengo lapicero.",
      options: ["To borrow a pen", "To sell you a pen", "To give you a pen"], answer: 0,
      why: "No question at all: they state the problem and let you offer." },
    { q: "Who is the bill for?", es: "¿Nos trae la cuenta, por favor?",
      options: ["The whole table", "Just the speaker", "The waiter"], answer: 0,
      why: "*Nos*: us. The speaker asks for everyone." }
  ],
  yourTurn: [
    { en: "Could you bring me the bill, please? (to a waiter)", es: "¿Me trae la cuenta, por favor?", accept: ["¿Nos trae la cuenta, por favor?"] },
    { en: "Can you pass me the salt? (to a friend)", es: "¿Me pasas la sal?", accept: ["¿Me pasas la sal, por favor?"] },
    { en: "Can you close the window, please? (polite)", es: "¿Puede cerrar la ventana, por favor?", accept: ["¿Me puede cerrar la ventana, por favor?"] },
    { en: "Order a black coffee the Colombian way.", es: "¿Me regala un tinto, por favor?", accept: ["¿Me regala un tinto?"] },
    { en: "Would you mind waiting a moment? (polite)", es: "¿Me hace el favor de esperar un momento?", accept: [] }
  ],
  personal: {
    prompt: "Picture your favourite café. Ask the waiter for one thing you always want, as a question.",
    constraints: [
      { type: "question", label: "as a question, with *¿* and *?*" },
      { type: "regex", pattern: "\\b(me|nos)\\s+(trae|regala|da|pasa|puede|hace)\\b", label: "*¿me trae…?*, *¿me regala…?* or *¿me puede…?*" }
    ],
    model: "¿Me regala un tinto y un pandebono, por favor?"
  },
  pitfalls: [
    "*Tráeme la cuenta* to a waiter is an order, however you say it: *¿Me trae la cuenta?*",
    "After *puede*, the dictionary form: *¿Puede cerrar…?*, never *¿Puede cierra…?*",
    "Spain often orders with *¿Me pones un café?*; in Colombia that sounds odd. Ask *¿Me regala un tinto?* or *¿Me da un tinto?*"
  ]
},

"fn-acceder-peticion-a2": {
  source: "old",
  hook: {
    line: "Saying yes is easy. Saying no is where Colombians are kind: they say sorry first and give a reason, and a bare *no* lands much harder than it does in English.",
    es: "¿Me ayudas con las maletas?\nClaro, con mucho gusto.\n¿Y mañana me ayudas a pintar?\nQué pena, pero no puedo. Es que trabajo.",
    en: "Will you help me with the suitcases?\nSure, happy to.\nAnd will you help me paint tomorrow?\nI'm so sorry, but I can't. The thing is, I'm working."
  },
  examples: [
    { es: "Listo, ya voy.", en: "OK, I'm coming." },
    { es: "Bueno, está bien, pero llego tarde.", en: "Fine, all right, but I'll be late." },
    { es: "Bueno, no sé. Tengo que pensarlo.", en: "Well, I don't know. I have to think about it." }
  ],
  rule: "A yes has degrees:\n*Sí, claro. Claro que sí. Con mucho gusto.* Warm and complete.\n*Listo* or *dale*: OK, done, between friends.\n*Bueno, está bien*, said slowly: yes, but you would rather not.\n*Bueno, no sé…*: neither yes nor no. People hear it as a polite maybe.\nA kind no comes in three parts: sorry, the no, a reason.\n*Lo siento* or the very Colombian *qué pena*, then *pero no puedo*, then *es que…*, the thing is:\n*Qué pena, pero no puedo. Es que tengo una cita.*\n*No quiero* or *no puedo* alone, with nothing around it, sounds like a door closing.",
  readAndPick: [
    { q: "Is Diego happy to help?", es: "Claro, con mucho gusto.",
      options: ["Yes, gladly", "Not really", "He can't"], answer: 0,
      why: "*Claro* and *con mucho gusto*: a warm, full yes." },
    { q: "Is Ana coming?", es: "Bueno, está bien, pero llego tarde.",
      options: ["Yes, without joy", "No, she can't", "She doesn't know yet"], answer: 0,
      why: "*Bueno, está bien* is a yes, but a slow one, and she adds a but." },
    { q: "What is Laura's answer?", es: "Bueno, no sé. Tengo que pensarlo.",
      options: ["A polite maybe", "Yes", "A clear no, sorry"], answer: 0,
      why: "*Bueno, no sé*: neither yes nor no, a polite maybe." },
    { q: "Why can't Sam help?", es: "Qué pena, pero no puedo. Es que tengo una cita.",
      options: ["He has an appointment", "He doesn't want to", "He feels ashamed"], answer: 0,
      why: "*Es que* brings the reason, *tengo una cita*. *Qué pena* here just means sorry." },
    { q: "How does this refusal sound?", es: "No quiero.",
      options: ["Blunt", "Kind", "Unsure"], answer: 0,
      why: "No sorry and no reason: a bare *no quiero* sounds like a door closing." }
  ],
  yourTurn: [
    { en: "Sure, happy to.", es: "Claro, con mucho gusto.", accept: ["Sí, claro, con mucho gusto.", "Claro que sí, con mucho gusto."] },
    { en: "I'm sorry, but I can't. (the Colombian way)", es: "Qué pena, pero no puedo.", accept: [] },
    { en: "I'm sorry, but I can't. The thing is, I have to work.", es: "Lo siento, pero no puedo. Es que tengo que trabajar.", accept: ["Qué pena, pero no puedo. Es que tengo que trabajar."] },
    { en: "Well, I don't know. I have to think about it.", es: "Bueno, no sé. Tengo que pensarlo.", accept: ["Bueno, no sé. Lo tengo que pensar."] },
    { en: "OK, I'm coming. (to a friend)", es: "Listo, ya voy.", accept: ["Dale, ya voy."] }
  ],
  personal: {
    prompt: "A friend asks you a favour you can't do this weekend. Say no the kind way: sorry, the no, and a real reason with *es que*.",
    constraints: [
      { type: "containsAny", words: ["lo siento", "qué pena", "que pena"], label: "sorry first: *lo siento* or *qué pena*" },
      { type: "negation", label: "the no itself: *no puedo*…" },
      { type: "containsWord", word: "es que", label: "a reason, with *es que*" }
    ],
    model: "Qué pena, pero no puedo. Es que el sábado voy a la casa de mis papás."
  },
  pitfalls: [
    "*Qué pena* in Colombia is how sorry sounds, not shame: *Qué pena con usted* is I'm so sorry.",
    "A refusal with a reason lands softly; *no puedo* alone sounds curt.",
    "In Spain you will hear *vale* for OK. In Colombia, say *listo*, *dale* or *bueno*."
  ]
},

"dc-atenuacion-1apersona-a2": {
  source: "merged",
  hook: {
    line: "Asking if you can come in puts you in the spotlight. *¿Se puede?* asks the same thing with nobody in the sentence, and in Colombia you hear it at every office door.",
    es: "¿Se puede?\nSiga, siga.",
    en: "May I come in?\nCome in, come in."
  },
  examples: [
    { es: "¿Se puede pagar con tarjeta?", en: "Can you pay by card here?" },
    { es: "Hay que llegar a las ocho.", en: "We need to be there by eight." },
    { es: "Uy, aquí hace mucho frío.", en: "Wow, it's really cold in here." }
  ],
  rule: "Three ways to ask or tell with nobody named.\n*Se* plus the he or she form means people in general: *¿Se puede pasar?* May I come in? *Aquí no se puede fumar.* You can't smoke here. After *se puede*, the dictionary form.\n*Hay que* plus the dictionary form: it has to be done, by nobody in particular. *Tienes que estudiar más* points at one person; *Hay que estudiar más* points at no one.\nA plain fact can carry a request: *Aquí hace frío* asks for the window to be shut. *A esta sopa le falta sal* asks for the salt.\n*Perdone* and *disculpe* look like commands, but they are only courtesy now.",
  readAndPick: [
    { q: "Who wants to come in?", es: "¿Se puede pasar?",
      options: ["The speaker", "A group", "The person listening"], answer: 0,
      why: "*Se puede*: can one. Nobody is named, but the speaker means themselves." },
    { q: "Who has to study more?", es: "Hay que estudiar más.",
      options: ["Nobody in particular", "Only the listener", "Only the speaker"], answer: 0,
      why: "*Hay que* names no one: it is a rule for everybody." },
    { q: "What does Laura want, sitting by the open window?", es: "Uy, aquí hace mucho frío.",
      options: ["The window shut", "A weather report", "To go outside"], answer: 0,
      why: "A plain fact, but the request is clear: shut the window." },
    { q: "Can anyone smoke here?", es: "Aquí no se puede fumar.",
      options: ["No, nobody can", "Yes, anyone", "Only the staff here"], answer: 0,
      why: "*No se puede*: it isn't allowed, for anyone." },
    { q: "What is the speaker asking about?", es: "¿Se puede pagar con tarjeta?",
      options: ["Paying by card", "Paying in cash", "Getting a new card"], answer: 0,
      why: "*Se puede* plus *pagar*: is it OK to pay by card here." }
  ],
  yourTurn: [
    { en: "May I come in? (nobody named)", es: "¿Se puede?", accept: ["¿Se puede pasar?"] },
    { en: "Can you pay by card here?", es: "¿Se puede pagar con tarjeta?", accept: ["¿Se puede pagar con tarjeta aquí?"] },
    { en: "You can't smoke here.", es: "Aquí no se puede fumar.", accept: ["No se puede fumar aquí."] },
    { en: "We need to be there by eight. (nobody named)", es: "Hay que llegar a las ocho.", accept: [] },
    { en: "This soup needs salt. (a fact that asks)", es: "A esta sopa le falta sal.", accept: ["Le falta sal a esta sopa."] }
  ],
  personal: {
    prompt: "Write two signs for a place you know well, your home, your office or your street: one thing people can do there and one thing they can't.",
    constraints: [
      { type: "regex", pattern: "(?<!no )\\bse puede\\b", label: "what people can do: *se puede…*" },
      { type: "containsWord", word: "no se puede", label: "what they can't: *no se puede…*" }
    ],
    model: "En mi casa se puede comer en la sala, pero no se puede fumar."
  },
  pitfalls: [
    "After *se puede*, the dictionary form: *¿Se puede pagar…?*, never *¿Se puede pago…?*",
    "*Hay que* needs its *que*: *Hay que llegar*, not *Hay llegar*.",
    "A fact works as a request only when the need is obvious; with no context, *hace frío* is just the weather."
  ]
},

"gn-instrucciones-a2": {
  source: "old",
  hook: {
    line: "A recipe, the way to the bus, how to work the coffee machine: instructions have one right order. Spanish marks each step and gives it as a command, start to finish.",
    es: "Primero, llena el tanque de agua.\nLuego, pon el café en el filtro.\nPor último, aprieta el botón rojo.\n¡Ojo! La jarra está muy caliente.",
    en: "First, fill the tank with water.\nThen put the coffee in the filter.\nFinally, press the red button.\nCareful! The jug is very hot."
  },
  examples: [
    { es: "Primero, abre la aplicación.", en: "First, open the app. (to a friend)" },
    { es: "Después, escriba su número y espere el mensaje.", en: "Then type your number and wait for the message. (polite)" },
    { es: "Aprieta el botón durante tres segundos.", en: "Press the button for three seconds. (to a friend)" }
  ],
  rule: "Instructions have one right order, so the order words carry meaning:\n*primero*: first\n*luego* or *después*: then\n*por último*: finally\nEach step is a command, and every step uses the same you:\nto a friend: *abre, pon, aprieta, espera*\nto *usted*: *abra, ponga, apriete, espere*\nDon't switch halfway: a text that starts with *abre* keeps *tú* to the end.\nOne step, one verb, near the front: *Aprieta el botón rojo durante tres segundos.*\n*¡Ojo!* flags a warning, watch out: *¡Ojo! El agua está muy caliente.*",
  readAndPick: [
    { q: "Which step is this?", es: "Por último, guarda los cambios.",
      options: ["The final step", "Step one", "A step in the middle"], answer: 0,
      why: "*Por último*: finally, the last step." },
    { q: "Who are these instructions for?", es: "Abra la aplicación y escriba su número.",
      options: ["Someone called usted", "A close friend", "A group of people"], answer: 0,
      why: "*Abra*, *escriba* and *su*: all *usted*." },
    { q: "What does *ojo* do here?", es: "¡Ojo! El agua está muy caliente.",
      options: ["Warns you", "Asks you to look", "Names the water"], answer: 0,
      why: "*¡Ojo!* flags a warning: watch out." },
    { q: "What is wrong with these two steps?", es: "Primero, abre la caja. Luego, saque el filtro.",
      options: ["They mix tú and usted", "Nothing at all", "The order is backwards"], answer: 0,
      why: "*Abre* is *tú* and *saque* is *usted*: keep one you to the end." },
    { q: "How long do you press the button?", es: "Aprieta el botón durante tres segundos.",
      options: ["Three seconds", "Three times", "For three days"], answer: 0,
      why: "*Durante tres segundos*: for three seconds." }
  ],
  yourTurn: [
    { en: "First, open the app. (to a friend)", es: "Primero, abre la aplicación.", accept: [] },
    { en: "Then put the coffee in the filter. (to a friend)", es: "Luego, pon el café en el filtro.", accept: ["Después, pon el café en el filtro."] },
    { en: "Finally, press the red button. (polite)", es: "Por último, apriete el botón rojo.", accept: [] },
    { en: "Careful! The water is very hot.", es: "¡Ojo! El agua está muy caliente.", accept: [] }
  ],
  personal: {
    prompt: "Write the first three steps of something you know how to make or do, for a friend: *primero…*, *luego…*, *por último…*",
    constraints: [
      { type: "containsWord", word: "primero", label: "*primero*" },
      { type: "containsAny", words: ["luego", "después"], label: "*luego* or *después*" },
      { type: "anyVerbInTense", tense: "imperativo", label: "each step as a command: *pon*, *abre*, *corta*…" }
    ],
    model: "Primero, calienta el agua. Luego, pon dos cucharadas de café en el filtro. Por último, sirve el tinto."
  },
  pitfalls: [
    "Keep one you from start to finish: *abre… pon… aprieta*, or *abra… ponga… apriete*.",
    "Without the order words, a set of steps reads like a list of chores.",
    "Don't do it needs a different form, which comes later; for now, warn with *¡Ojo!*"
  ]
},

"task-a2-pedir": {
  source: "old",
  hook: {
    line: "One request, five ways: to your brother, a friend, a colleague, your boss, a stranger at the bank. What you ask stays the same. What changes is how much room you leave them to say no.",
    es: "Abre la ventana.\n¿Abres la ventana?\n¿Puedes abrir la ventana?\n¿Me hace el favor de abrir la ventana?\n¿Será que me puede abrir la ventana?",
    en: "Open the window.\nWill you open the window?\nCan you open the window?\nWould you mind opening the window?\nDo you think you could possibly open the window?"
  },
  examples: [
    { es: "¿Podría ayudarme un momento?", en: "Could you help me for a moment? (polite)" },
    { es: "¿Será que me puede explicar este formulario?", en: "Could you possibly explain this form to me? (polite)" },
    { es: "Lo siento, es que hace mucho ruido afuera.", en: "Sorry, it's just that it's very noisy outside." }
  ],
  rule: "Each step up leaves the other person more room to say no:\nA command, only for family and close friends: *Abre la ventana, por favor.*\nA plain question: *¿Abres la ventana?*\n*Poder*: *¿Puedes abrir…?* or, to *usted*, *¿Puede abrir…?*\n*¿Me hace el favor de abrir…?* or *¿Podría abrir…?*\nThe Colombian top step: *¿Será que me puede abrir…?*, could you possibly…\nPick the step for the person, then keep their you: *tú* for a friend, *usted* for a stranger or a boss.\nSaying no needs the same care: *Lo siento, es que…* or *Qué pena, pero…*\nThe task: write one real request five ways and note who you would say each one to.",
  readAndPick: [
    { q: "Who would you say this to?", es: "¿Será que me puede ayudar con este formulario?",
      options: ["A stranger at a desk", "Your little brother", "Your best friend"], answer: 0,
      why: "*¿Será que…?* with *puede*: the top step, for someone you call *usted*." },
    { q: "Who would you say this to?", es: "Pásame la sal.",
      options: ["Family at dinner", "A waiter you don't know", "Your boss"], answer: 0,
      why: "A bare command with *tú*: only for people very close to you." },
    { q: "Which is the more careful of the two?", es: "¿Puede abrir la ventana?\n¿Me hace el favor de abrir la ventana?",
      options: ["The second", "The first", "They're the same"], answer: 0,
      why: "*¿Me hace el favor de…?* is a step above *¿Puede…?*" },
    { q: "Is the speaker saying yes or no?", es: "Lo siento, es que hace mucho ruido afuera.",
      options: ["No, with a reason", "Yes, gladly", "Yes, but later on"], answer: 0,
      why: "*Lo siento* and *es que*: a no, cushioned by the reason." },
    { q: "Is this to a friend or to someone called usted?", es: "¿Podrías ayudarme un momento?",
      options: ["A friend", "Usted", "A group"], answer: 0,
      why: "*Podrías* ends in *s*: *tú*. To *usted*, *¿podría…?*" }
  ],
  yourTurn: [
    { en: "Open the window, please. (to your brother)", es: "Abre la ventana, por favor.", accept: [] },
    { en: "Can you open the window? (to a friend)", es: "¿Puedes abrir la ventana?", accept: [] },
    { en: "Would you mind opening the window? (polite)", es: "¿Me hace el favor de abrir la ventana?", accept: [] },
    { en: "Could you possibly open the window? (the Colombian top step)", es: "¿Será que me puede abrir la ventana?", accept: ["¿Será que puede abrir la ventana?"] },
    { en: "Sorry, it's just that it's very noisy outside.", es: "Lo siento, es que hace mucho ruido afuera.", accept: ["Lo siento, es que hay mucho ruido afuera.", "Lo siento, es que hace mucho ruido fuera."] }
  ],
  personal: {
    prompt: "Pick one real request you need to make this week. Write it twice: once for a friend, and once for a stranger or your boss.",
    constraints: [
      { type: "regex", pattern: "\\b(puedes|podr[ií]as|me haces|me pasas|me prestas|me ayudas|me das)\\b", label: "one for a friend, with *tú*: *¿puedes…?*, *¿me prestas…?*" },
      { type: "regex", pattern: "\\b(puede|podr[ií]a|me hace|ser[aá] que|me presta|me ayuda|me da)\\b", label: "one for *usted*: *¿puede…?*, *¿será que…?*" },
      { type: "question", label: "as questions, with *¿* and *?*" }
    ],
    model: "¿Me prestas tu carro el sábado? ¿Será que me puede dar el viernes libre?"
  },
  pitfalls: [
    "A bare command to a stranger sounds rude in Colombia, even with *por favor*.",
    "Keep the person's you on every step: *¿Puede…?* and *¿Podría…?* to *usted*, *¿Puedes…?* and *¿Podrías…?* to a friend.",
    "After *¿Será que…?* the verb stays ordinary: *¿Será que me puede…?*"
  ]
},

/* ---- unit 20 · How are you feeling? ----------------------------------- */

"fn-preguntar-estado-animo-a2": {
  source: "merged",
  hook: {
    line: "Ask *¿Cómo estás?* in Bogotá and you get *bien, ¿y tú?*, whatever the truth. When a friend looks unwell you need a real question, and they need the words for what is wrong.",
    es: "Laura: Sam, te veo pálido. ¿Estás bien?\nSam: La verdad, no. Me siento mal.\nSam: Me duele la cabeza y tengo frío.\nLaura: ¡Qué pesar! ¡Que te mejores!",
    en: "Laura: Sam, you look pale. Are you OK?\nSam: Honestly, no. I feel ill.\nSam: My head hurts and I'm cold.\nLaura: Oh, poor you! Get well soon!"
  },
  examples: [
    { es: "¿Cómo estás?\nBien, gracias, ¿y tú?", en: "How are you?\nFine, thanks, and you?" },
    { es: "Tengo sueño y me duelen los pies.", en: "I'm sleepy and my feet hurt." },
    { es: "¿Te duele mucho?\nUn poco. Tengo dolor de estómago.", en: "Does it hurt a lot?\nA little. I've got a stomach ache." }
  ],
  rule: "*¿Cómo estás?* and *¿Qué tal?* are hellos. The answer is *bien, ¿y tú?*, and nobody expects more.\n*¿Estás bien?* and *¿Te pasa algo?* are real questions, for when you notice something.\nTo answer honestly:\n*Me siento mal*: I feel ill. *Estoy cansado*: I'm tired.\n*Tengo* plus what your body feels: *tengo hambre, sueño, frío, calor*.\n*Me duele* plus the body part, *me duelen* for more than one: *me duele la cabeza, me duelen los pies*.\nHow much: *mucho* or *un poco*, never *muy*. Not any more: *ya no me duele*.\nOr the pain as something you have: *tengo dolor de cabeza*.\nTo someone ill: *¡Qué pesar!* and *¡Que te mejores!*, get well soon. Take that one whole.",
  readAndPick: [
    { q: "Is Diego asking for news, or saying hello?", es: "¡Hola, Ana! ¿Qué tal?",
      options: ["Just saying hello", "Asking what's wrong", "Asking her name"], answer: 0,
      why: "*¿Qué tal?* is a hello. *Bien, ¿y tú?* is all it needs." },
    { q: "Why does Laura ask this?", es: "Te veo pálido. ¿Estás bien?",
      options: ["He looks unwell", "Just to say hi", "She wants a favour"], answer: 0,
      why: "*¿Estás bien?* checks on a real problem: she noticed his face." },
    { q: "What does Sam want?", es: "Tengo mucha hambre.",
      options: ["Something to eat", "Something to drink", "A place to sleep"], answer: 0,
      why: "*Hambre* is hunger, and it goes with *tener*: *tengo hambre*, I'm hungry." },
    { q: "How many feet hurt?", es: "Me duelen los pies.",
      options: ["Both feet", "Just one", "Neither of them"], answer: 0,
      why: "*Duelen*, with *-n*, for *los pies*: more than one." },
    { q: "How bad is Laura's headache?", es: "Me duele un poco la cabeza.",
      options: ["Not too bad", "Really bad", "It's gone now"], answer: 0,
      why: "*Un poco*: a little. A lot would be *mucho*." },
    { q: "Does Ana's knee still hurt?", es: "Ya no me duele la rodilla.",
      options: ["No, not any more", "Yes, a lot", "Yes, a little bit"], answer: 0,
      why: "*Ya no*: not any more." }
  ],
  yourTurn: [
    { en: "Are you OK? (to a friend)", es: "¿Estás bien?", accept: [] },
    { en: "I feel ill.", es: "Me siento mal.", accept: ["Me siento enfermo.", "Me siento enferma."] },
    { en: "My head hurts a lot.", es: "Me duele mucho la cabeza.", accept: ["La cabeza me duele mucho."] },
    { en: "I'm cold and sleepy.", es: "Tengo frío y sueño.", accept: ["Tengo frío y tengo sueño."] },
    { en: "I've got a stomach ache.", es: "Tengo dolor de estómago.", accept: ["Me duele el estómago."] }
  ],
  personal: {
    prompt: "How are you today, really? Write two honest lines: how you feel, and one thing your body wants or one thing that hurts.",
    constraints: [
      { type: "containsAny", words: ["me siento", "estoy"], label: "how you feel: *me siento…* or *estoy…*" },
      { type: "regex", pattern: "\\bme duelen?\\b|\\btengo\\s+(mucha\\s+|mucho\\s+|un poco de\\s+)?(hambre|sed|sue[ñn]o|fr[ií]o|calor|dolor)", label: "what your body says: *tengo sueño*, *me duele…*" }
    ],
    model: "Hoy estoy un poco cansado. Tengo sueño y me duele la espalda."
  },
  pitfalls: [
    "A hello is not a check-up: *¿Qué tal?* gets *bien, ¿y tú?*, even on a bad day. Save *¿Estás bien?* for when something looks wrong.",
    "*Estoy hambre* is a slip: hunger, thirst, cold and sleep are things you have. *Tengo hambre.*",
    "In Colombia *qué pena* is mostly sorry, as in excuse me. For bad news, *¡Qué pesar!* or *¡Qué lástima!*"
  ]
},

"fn-felicitar-a2": {
  source: "merged",
  hook: {
    line: "Laura got the job she wanted, and she is telling everyone. A nod won't do: Spanish wants a quick, loud reaction first, then congratulations for the thing itself.",
    es: "Laura: ¡Me dieron el trabajo!\nSam: ¡Qué bien! ¡Felicitaciones!\nSam: Me alegro mucho por ti.",
    en: "Laura: I got the job!\nSam: That's great! Congratulations!\nSam: I'm really happy for you."
  },
  examples: [
    { es: "¡Felicitaciones por el bebé!", en: "Congratulations on the baby!" },
    { es: "Te felicito por pasar el examen.", en: "Well done on passing the exam. (to a friend)" },
    { es: "¡Feliz Navidad y feliz año!", en: "Merry Christmas and happy New Year!" }
  ],
  rule: "Good news gets a reaction first, short and loud: *¡Qué bien! ¡Qué bueno! ¡Qué alegría!* In Colombia, *¡Qué chévere!*, how great.\n*¡Qué* plus one word does it, with no *un* or *una*: *¡Qué suerte!*\nThen congratulate: *¡Felicitaciones!* or *¡Felicidades!*, always plural.\nWhat for takes *por*: *por el trabajo nuevo, por el bebé*. With an action, *por* plus the dictionary form: *por pasar el examen*.\nTo one person: *Te felicito* to a friend, *Lo felicito* or *La felicito* to *usted*.\nDates have their own line: *¡Feliz cumpleaños! ¡Feliz Navidad! ¡Feliz año!*\nTo share the joy: *Me alegro mucho*, I'm so glad, or *Me alegro por ti*.",
  readAndPick: [
    { q: "What is Ana reacting to?", es: "¡Qué bien! ¡Felicitaciones por el bebé!",
      options: ["A new baby", "A birthday party", "A new job"], answer: 0,
      why: "*Por el bebé*: what the congratulations are for." },
    { q: "Is Diego pleased or sorry?", es: "¡Qué chévere! Me alegro mucho.",
      options: ["Pleased", "Sorry", "Not sure yet"], answer: 0,
      why: "*¡Qué chévere!* is Colombian for how great, and *me alegro* is I'm glad." },
    { q: "When would you say this?", es: "¡Feliz cumpleaños!",
      options: ["On a birthday", "After a hard exam", "When a baby arrives"], answer: 0,
      why: "*Feliz* plus the day: it marks a date." },
    { q: "Who is being congratulated?", es: "Señora Pérez, la felicito.",
      options: ["Mrs Pérez, politely", "A good friend", "The speaker"], answer: 0,
      why: "*La felicito*: I congratulate you, to a woman you call *usted*." },
    { q: "What did Sam do?", es: "¡Felicitaciones por pasar el examen!",
      options: ["He passed an exam", "He has an exam soon", "He failed it"], answer: 0,
      why: "*Por pasar el examen*: for passing it. After *por*, the dictionary form." }
  ],
  yourTurn: [
    { en: "Congratulations on the new job!", es: "¡Felicitaciones por el trabajo nuevo!", accept: ["¡Felicidades por el trabajo nuevo!", "¡Felicitaciones por el nuevo trabajo!", "¡Felicidades por el nuevo trabajo!"] },
    { en: "That's great! I'm really happy for you. (to a friend)", es: "¡Qué bien! Me alegro mucho por ti.", accept: ["¡Qué bueno! Me alegro mucho por ti.", "¡Qué chévere! Me alegro mucho por ti."] },
    { en: "Happy birthday, Laura!", es: "¡Feliz cumpleaños, Laura!", accept: [] },
    { en: "Congratulations on passing the exam! (to a friend)", es: "¡Felicitaciones por pasar el examen!", accept: ["¡Felicidades por pasar el examen!", "Te felicito por pasar el examen."] },
    { en: "How lucky!", es: "¡Qué suerte!", accept: [] }
  ],
  personal: {
    prompt: "Someone you know had good news lately: a job, a baby, a trip, an exam. Write what you would say to them: a reaction, then congratulations for the thing itself.",
    constraints: [
      { type: "containsAny", words: ["qué bien", "qué bueno", "qué chévere", "qué alegría", "qué suerte"], label: "a reaction: *¡Qué bien!*, *¡Qué chévere!*…" },
      { type: "regex", pattern: "\\b(felicitaciones|felicidades|felicito)\\s+(a\\s+\\S+\\s+)?por\\s+\\S+", label: "congratulations, with *por* and what for" }
    ],
    model: "¡Qué chévere, Ana! ¡Felicitaciones por el apartamento nuevo!"
  },
  pitfalls: [
    "Congratulations “on” is *por*, never *en*: *¡Felicitaciones por el bebé!*",
    "In Spain you will hear *¡Enhorabuena!* for something earned. In Colombia *felicitaciones* covers it all.",
    "*¡Qué una suerte!* is a slip: after *qué*, no *un* or *una*."
  ]
},

"fn-preguntar-deseos-a2": {
  source: "old",
  hook: {
    line: "Laura's family has a finca outside Bogotá, and she wants Sam to come. *¿Quieres…?* is a plain question; *¿Te gustaría…?* turns it into an invitation. And trips and meals always get a wish.",
    es: "Laura: ¿Quieres un tinto?\nSam: No, gracias.\nLaura: ¿Y te gustaría venir a la finca el sábado?\nSam: ¡Sí, me encantaría!",
    en: "Laura: Do you want a black coffee?\nSam: No, thanks.\nLaura: And would you like to come to the farm on Saturday?\nSam: Yes, I'd love to!"
  },
  examples: [
    { es: "¿Te provoca algo de tomar?", en: "Do you feel like something to drink? (to a friend)" },
    { es: "¡Buen viaje! Y mucha suerte en la entrevista.", en: "Have a good trip! And good luck in the interview." },
    { es: "Buen provecho.\nGracias, igualmente.", en: "Enjoy your meal.\nThanks, you too." }
  ],
  rule: "*¿Quieres…?* asks plainly: *¿Quieres un tinto?* Fine for things on the table.\n*¿Te gustaría…?* turns it into an invitation: *¿Te gustaría venir a la finca?* To *usted*: *¿Le gustaría…?*\nIn Colombia you also hear *¿Te provoca…?*: do you feel like…\nTake *gustaría* and *encantaría* whole for now; their ending belongs to a form that comes later.\nTo say yes warmly: *Sí, me encantaría.* To say what you want: *Me gustaría…*\nSome moments always get a wish:\nsomeone leaves on a trip: *¡Buen viaje!*\nsomeone is eating, even a stranger: *¡Buen provecho!* The answer is *Gracias, igualmente.*\nbefore an exam or an interview: *¡Mucha suerte!* or *¡Muchos éxitos!*",
  readAndPick: [
    { q: "Which sounds more like an invitation?", es: "¿Quieres venir?\n¿Te gustaría venir?",
      options: ["The second", "The first", "They're the same"], answer: 0,
      why: "*¿Te gustaría…?* softens the question into an invitation." },
    { q: "When do people say this?", es: "¡Buen provecho!",
      options: ["When someone eats", "When someone leaves", "When someone wins"], answer: 0,
      why: "*Buen provecho*: enjoy your meal. Said even to strangers at the next table." },
    { q: "What is Ana offering?", es: "¿Te provoca un jugo?",
      options: ["A drink", "A snack later", "A lift home"], answer: 0,
      why: "*¿Te provoca…?*: do you feel like… *Jugo* is juice." },
    { q: "Is Sam saying yes or no?", es: "Sí, me encantaría.",
      options: ["Yes, gladly", "No, thanks", "Maybe later on"], answer: 0,
      why: "*Me encantaría*: I'd love to. A warm yes." },
    { q: "Where is Laura going?", es: "¡Buen viaje, Laura!",
      options: ["On a trip", "Out to eat", "To an interview"], answer: 0,
      why: "*Buen viaje*: have a good trip." },
    { q: "How does the man answer the wish?", es: "Buen provecho.\nGracias, igualmente.",
      options: ["Thanks, you too", "Thanks, it's good", "No, thank you"], answer: 0,
      why: "*Igualmente*: the same to you. The usual answer to a wish." }
  ],
  yourTurn: [
    { en: "Would you like to come to the party? (to a friend)", es: "¿Te gustaría venir a la fiesta?", accept: [] },
    { en: "Yes, I'd love to!", es: "¡Sí, me encantaría!", accept: [] },
    { en: "Have a good trip!", es: "¡Buen viaje!", accept: [] },
    { en: "Good luck in the interview!", es: "¡Mucha suerte en la entrevista!", accept: ["¡Suerte en la entrevista!"] },
    { en: "What would you like to do on Saturday? (to a friend)", es: "¿Qué te gustaría hacer el sábado?", accept: [] }
  ],
  personal: {
    prompt: "Invite a friend to something real this week, the soft way, and add a wish for the moment: a trip, an exam, a meal.",
    constraints: [
      { type: "containsAny", words: ["te gustaría", "le gustaría", "te provoca", "le provoca"], label: "the invitation: *¿Te gustaría…?* or *¿Te provoca…?*" },
      { type: "question", label: "as a question, with *¿* and *?*" },
      { type: "containsAny", words: ["buen viaje", "buen provecho", "suerte", "éxitos"], label: "a wish: *¡Buen viaje!*, *¡Mucha suerte!*…" }
    ],
    model: "¿Te gustaría ir a cine el viernes? ¡Y mucha suerte en el examen!"
  },
  pitfalls: [
    "*¿Te gusta venir?* asks if you enjoy coming. An invitation is *¿Te gustaría venir?*",
    "In Spain they ask *¿Te apetece…?* and wish *¡Que aproveche!* In Colombia: *¿Te provoca…?* and *¡Buen provecho!*",
    "A wish wants an answer: *Gracias, igualmente.*"
  ]
},

"fn-acuerdo-a2": {
  source: "merged",
  hook: {
    line: "Over lunch Diego has an opinion about everything, and agreeing is half the conversation. Go past a nod: say you think so too, say it depends, or grade it with *demasiado* and *nada*.",
    es: "Diego: Este restaurante es demasiado caro.\nLaura: Sí, tienes razón.\nSam: Depende. La comida no es nada mala.\nLaura: Es verdad. ¡Qué rico este ajiaco!",
    en: "Diego: This restaurant is too expensive.\nLaura: Yes, you're right.\nSam: It depends. The food isn't bad at all.\nLaura: That's true. This ajiaco is delicious!"
  },
  examples: [
    { es: "Yo también creo que es muy caro.", en: "I think it's very expensive too." },
    { es: "Sí, estoy de acuerdo contigo.", en: "Yes, I agree with you. (to a friend)" },
    { es: "El examen no fue nada fácil.", en: "The exam wasn't easy at all." }
  ],
  rule: "To agree, open with *sí*, then say how:\n*Sí, es verdad.* Yes, that's true.\n*Tienes razón.* You're right. To *usted*: *Tiene razón.*\n*Estoy de acuerdo.* I agree. With you: *contigo*.\n*Yo también creo que…* says you got there on your own.\nHalf agreeing: *Depende*, or *Sí, pero…*\nTo grade a verdict, put a word before the describing word:\n*muy caro*: very expensive, a plain fact\n*demasiado caro*: too expensive, more than you want\n*no es muy caro*: not very, a soft verdict\n*no es nada caro*: not at all\n*Demasiado* and *nada* never change: *demasiado caras*.\nWith food: *¡Qué rico!*, delicious.",
  readAndPick: [
    { q: "Is Ana complaining about the price?", es: "Los zapatos son demasiado caros.",
      options: ["Yes, it's too much", "No, it's a fact", "No, she likes it"], answer: 0,
      why: "*Demasiado*: more than you want. It is almost always a complaint." },
    { q: "Does Diego agree with Laura?", es: "Laura: Bogotá es muy fría.\nDiego: Sí, tienes razón.",
      options: ["Yes", "Only in part", "Not at all"], answer: 0,
      why: "*Tienes razón*: you're right." },
    { q: "How easy was the exam?", es: "El examen no fue nada fácil.",
      options: ["It was really hard", "It was quite easy", "A bit tricky"], answer: 0,
      why: "*No… nada fácil*: not easy at all. Stronger than *no muy fácil*." },
    { q: "Does Sam agree?", es: "Depende del día.",
      options: ["Only partly", "Yes, fully", "No, never"], answer: 0,
      why: "*Depende*: it depends. Neither yes nor no." },
    { q: "What does Laura think of the soup?", es: "¡Qué rica está la sopa!",
      options: ["It tastes great", "It's too hot", "It needs more salt"], answer: 0,
      why: "*Rico* with food is delicious." },
    { q: "Is this Laura's own view, or just a nod?", es: "Sí, yo también creo que es una buena idea.",
      options: ["Her own view too", "Just a polite nod", "A question back"], answer: 0,
      why: "*Yo también creo que…*: she thinks so too." }
  ],
  yourTurn: [
    { en: "Yes, you're right. (to a friend)", es: "Sí, tienes razón.", accept: [] },
    { en: "I agree with you. (to a friend)", es: "Estoy de acuerdo contigo.", accept: ["Sí, estoy de acuerdo contigo."] },
    { en: "It's too expensive.", es: "Es demasiado caro.", accept: ["Está demasiado caro."] },
    { en: "The exam wasn't easy at all.", es: "El examen no fue nada fácil.", accept: [] },
    { en: "I think it's a good idea too.", es: "Yo también creo que es una buena idea.", accept: ["También creo que es una buena idea."] }
  ],
  personal: {
    prompt: "Someone says *El centro es demasiado caro.* Answer them: agree or half agree, then give your view of a place you know, graded with *muy*, *demasiado* or *nada*.",
    constraints: [
      { type: "containsAny", words: ["tienes razón", "tiene razón", "es verdad", "de acuerdo", "depende", "también creo", "sí, pero"], label: "agree or half agree: *tienes razón*, *depende*…" },
      { type: "regex", pattern: "\\b(muy|demasiado|nada)\\s+\\S+", label: "a verdict graded with *muy*, *demasiado* or *nada*" }
    ],
    model: "Sí, tienes razón. Pero mi barrio no es nada caro y es muy tranquilo."
  },
  pitfalls: [
    "*Demasiado* means more than you want, so *demasiado bonito* can sound like a problem. Colombians do say *¡demasiado bueno!* as praise, but to grade, keep it for too much.",
    "*No es fácil nada* follows the English order: *nada* goes right before the describing word, *no es nada fácil*.",
    "*Estoy de acuerdo con ti* is a slip: *contigo*."
  ]
},

"task-a2-animo": {
  source: "old",
  hook: {
    line: "Silence after news sounds like you don't care. This week ends with five pieces of news and five reactions, each the right size, each followed by a question that keeps the person talking.",
    es: "Ana: ¡Me caso en junio!\nSam: ¡No me digas! ¡Qué alegría! ¿Y dónde?\nDiego: Mi papá está en el hospital.\nSam: ¡Qué pesar! Lo siento mucho. ¿Cómo está?",
    en: "Ana: I'm getting married in June!\nSam: No way! How wonderful! And where?\nDiego: My dad is in hospital.\nSam: Oh no, how awful. I'm so sorry. How is he?"
  },
  examples: [
    { es: "Me dieron el trabajo.\n¡Felicitaciones! ¿Cuándo empiezas?", en: "I got the job.\nCongratulations! When do you start?" },
    { es: "Perdí el examen.\nTranquila, no pasa nada. Lo puedes repetir.", en: "I failed the exam.\nDon't worry, it's fine. You can take it again." },
    { es: "Me subieron el sueldo, pero también las horas.\nBueno, algo es algo.", en: "They raised my pay, but my hours too.\nWell, it's better than nothing." }
  ],
  rule: "Write five short exchanges: two good, two bad, one mixed. Someone tells you something; you react, then ask.\nMatch the size of the news:\nbig and good: *¡No me digas! ¡Qué alegría!*\nsmall and good: *¡Ah, qué bien! ¡Qué chévere!*\nbad: *¡Qué pesar! Lo siento mucho.*\nsmall and bad: *Tranquilo, no pasa nada.*\nmixed: *Bueno, algo es algo.*\nA big reaction to small news sounds like you're making fun.\nThen a question, so they keep talking: *¿Cuándo empiezas? ¿Y cómo está? ¿Y dónde?*\nWhat someone earned gets *¡Felicitaciones!*",
  readAndPick: [
    { q: "How big is this reaction?", es: "¡No me digas! ¡Qué alegría!",
      options: ["Big and happy", "Small and polite", "Sad but kind"], answer: 0,
      why: "*¡No me digas!* is for big news: you can hardly believe it." },
    { q: "What kind of news did Ana just hear?", es: "¡Qué pesar! Lo siento mucho.",
      options: ["Bad news", "Good news", "No news at all"], answer: 0,
      why: "*¡Qué pesar!* and *lo siento*: sympathy for bad news." },
    { q: "Why does Sam add a question?", es: "¡Felicitaciones! ¿Cuándo empiezas?",
      options: ["To keep her talking", "To end the chat", "To change the topic"], answer: 0,
      why: "A reaction alone closes the talk; a question keeps it open." },
    { q: "Did Laura pass?", es: "Perdí el examen de inglés.",
      options: ["No, she failed", "Yes, just", "She lost the paper"], answer: 0,
      why: "In Colombia *perder un examen* is to fail it." },
    { q: "How does Diego feel about the news?", es: "Bueno, algo es algo.",
      options: ["Half pleased", "Very happy", "Really upset"], answer: 0,
      why: "*Algo es algo*: it's something. Neither good nor bad." }
  ],
  yourTurn: [
    { en: "No way! How wonderful!", es: "¡No me digas! ¡Qué alegría!", accept: [] },
    { en: "I'm so sorry. How is he?", es: "Lo siento mucho. ¿Cómo está?", accept: ["Lo siento mucho. ¿Y cómo está?"] },
    { en: "Congratulations! When do you start? (to a friend)", es: "¡Felicitaciones! ¿Cuándo empiezas?", accept: ["¡Felicidades! ¿Cuándo empiezas?"] },
    { en: "Don't worry, it's fine. (to a man)", es: "Tranquilo, no pasa nada.", accept: [] },
    { en: "Well, it's better than nothing.", es: "Bueno, algo es algo.", accept: [] }
  ],
  personal: {
    prompt: "Write two of your five exchanges: one piece of good news and one bad, each with a reaction and a question.",
    constraints: [
      { type: "containsAny", words: ["qué bien", "qué alegría", "no me digas", "felicitaciones", "felicidades", "qué chévere"], label: "a reaction to good news: *¡Qué alegría!*…" },
      { type: "containsAny", words: ["qué pesar", "lo siento", "qué lástima", "tranquilo", "tranquila"], label: "a reaction to bad news: *¡Qué pesar!*, *lo siento*…" },
      { type: "question", label: "a question after the reaction" }
    ],
    model: "Me caso en junio. ¡Qué alegría! ¿Y dónde? Perdí el celular. ¡Qué pesar! ¿Dónde fue?"
  },
  pitfalls: [
    "A big reaction to small news, *¡No me digas!* for a sunny day, sounds like you're making fun.",
    "*¿Cómo es?* asks what someone is like. For how a sick person is doing: *¿Cómo está?*",
    "In Spain you will hear *¡Qué fuerte!* for big news. In Colombia: *¡No me digas!* or *¡No puede ser!*"
  ]
},

/* ---- unit 21 · Comparing ----------------------------------------------- */

"gr-comparativos-a2": {
  source: "merged",
  hook: {
    line: "Laura has lived in Bogotá and in Medellín, and she has views on both. English often adds “-er” to compare; Spanish puts *más* in front and *que* after.",
    es: "Laura: En Medellín hace más calor que en Bogotá.\nLaura: Bogotá es más grande, pero no es tan cara como dicen.\nLaura: Y el ajiaco de Bogotá es mejor.",
    en: "Laura: It's warmer in Medellín than in Bogotá.\nLaura: Bogotá is bigger, but it isn't as expensive as people say.\nLaura: And Bogotá's ajiaco is better."
  },
  examples: [
    { es: "Mi hermano es menos serio que yo.", en: "My brother is less serious than me." },
    { es: "No tengo tanto tiempo como antes.", en: "I don't have as much time as before." },
    { es: "Mi hermana mayor trabaja tanto como mi papá.", en: "My older sister works as much as my dad." }
  ],
  rule: "English adds “-er” or says “more”. Spanish always says *más*: *más alto que*, taller than.\n*más … que*: more … than. *menos … que*: less … than.\n*tan … como*: as … as, with a describing word. *Tan* never changes: *tan cara como*.\nWith a thing, *tanto* matches it: *tanto tiempo, tanta gente, tantos carros, tantas cosas*, then *como*.\nAfter a verb, plain *tanto como*: *Trabaja tanto como yo.*\nFour words skip *más*: *mejor*, better; *peor*, worse; *mayor*, older; *menor*, younger. For size, *más grande*.\nMuch better is *mucho mejor*, never *muy mejor*.\nAfter *que* and *como* come *yo* and *tú*: *más alto que yo*.",
  readAndPick: [
    { q: "Who is taller?", es: "Diego es más alto que Sam.",
      options: ["Diego", "Sam", "Neither of them"], answer: 0,
      why: "*Más alto que*: taller than. Diego comes first." },
    { q: "Is the new apartment cheaper?", es: "El apartamento nuevo no es tan caro como el otro.",
      options: ["Yes, it's cheaper", "No, it costs more", "They cost the same"], answer: 0,
      why: "*No es tan caro como*: not as expensive as. So it's cheaper." },
    { q: "Is Laura's brother older, or bigger?", es: "Mi hermano mayor vive en Cali.",
      options: ["Older than her", "Taller", "Younger than her"], answer: 0,
      why: "*Mayor* in a family is older. Bigger would be *más grande*." },
    { q: "How many people came this year?", es: "No había tanta gente como el año pasado.",
      options: ["Fewer than last year", "More than last year", "The same number"], answer: 0,
      why: "*No había tanta gente como*: not as many people as. *Tanta* matches *gente*." },
    { q: "Which is better, the coffee or the tea?", es: "El café de aquí es mucho mejor que el té.",
      options: ["The coffee", "The tea, by far", "Neither"], answer: 0,
      why: "*Mucho mejor*: much better. *Mejor* replaces *más bueno*." },
    { q: "Who works more?", es: "Ana trabaja tanto como su jefe.",
      options: ["Neither, the same", "Ana works more", "Her boss does"], answer: 0,
      why: "*Tanto como* after a verb: as much as. Neither works more." }
  ],
  yourTurn: [
    { en: "Bogotá is colder than Medellín.", es: "Bogotá es más fría que Medellín.", accept: [] },
    { en: "This coffee is better than the other one.", es: "Este café es mejor que el otro.", accept: [] },
    { en: "My sister is as tall as me.", es: "Mi hermana es tan alta como yo.", accept: [] },
    { en: "There aren't as many cars as before.", es: "No hay tantos carros como antes.", accept: [] },
    { en: "My younger brother lives in Cali.", es: "Mi hermano menor vive en Cali.", accept: [] }
  ],
  personal: {
    prompt: "Compare yourself with someone in your family: one way you are more or less, and one way you are just the same.",
    constraints: [
      { type: "regex", pattern: "\\b(m[aá]s|menos|mejor|peor|mayor|menor)\\b[^.?!]*\\bque\\b", label: "*más… que*, *menos… que* or *mejor que*" },
      { type: "regex", pattern: "\\btan\\b[^.?!]*\\bcomo\\b|\\btant[oa]s?\\b[^.?!]*\\bcomo\\b", label: "*tan… como* or *tanto… como*" }
    ],
    model: "Mi hermana es más alta que yo, pero yo soy tan paciente como ella."
  },
  pitfalls: [
    "*Más bueno* and *más malo* are slips for quality: *mejor*, *peor*.",
    "*Tan* goes with describing words, *tanto* with things: *tan cara*, but *tanta gente*.",
    "*Tan alta que yo* is a slip: *tan* pairs with *como*; *que* goes with *más* and *menos*."
  ]
},

"nt-cualidad-material-a2": {
  source: "merged",
  hook: {
    line: "Sam bought a jacket at a market in Usaquén, and it's too small. Back at the stall he needs two things: what it is made of, and how to swap it for another.",
    es: "Sam: Buenas. Compré esta chaqueta ayer, pero me queda pequeña.\nSam: ¿La puedo cambiar por una más grande?\nVendedor: Claro. ¿Otra de cuero, o una de algodón?",
    en: "Sam: Hello. I bought this jacket yesterday, but it's too small for me.\nSam: Can I exchange it for a bigger one?\nSeller: Of course. Another leather one, or a cotton one?"
  },
  examples: [
    { es: "La mesa es de madera y las sillas son de plástico.", en: "The table is wooden and the chairs are plastic." },
    { es: "¿De qué es este anillo?\nEs de plata.", en: "What's this ring made of?\nIt's silver." },
    { es: "Laura cambió de trabajo en enero.", en: "Laura changed jobs in January." }
  ],
  rule: "What something is made of uses the *ser de* you know from *soy de Canadá*: *Es de madera. Son de algodón.*\nNo *un* or *el* after *de*: *de lana*, never *de una lana*.\nRight after the thing, keep the *de*: *una mesa de madera, un anillo de plata*. English puts the material first; Spanish never does.\nTo ask: *¿De qué es?*\n*Cambiar* has two jobs:\n*cambiar de* plus a thing: switch to a different one. *Cambié de trabajo. Cambió de opinión.* No *mi* or *su*, no *el*.\n*cambiar* one thing *por* another: a real swap, one out, one in. *Cambiar dólares por pesos. ¿La puedo cambiar por otra?*",
  readAndPick: [
    { q: "What is the table made of?", es: "La mesa es de madera.",
      options: ["Wood", "Metal", "Plastic"], answer: 0,
      why: "*Ser de* plus the material: *de madera*, wooden." },
    { q: "Is Diego swapping something, or just switching?", es: "Diego cambió de apartamento.",
      options: ["A new home", "A house swap", "Home repairs"], answer: 0,
      why: "*Cambiar de*: switch to a different one. No swap." },
    { q: "What does Sam want at the counter?", es: "Quiero cambiar estos zapatos por otros.",
      options: ["A different pair", "Two pairs of shoes", "His money back"], answer: 0,
      why: "*Cambiar… por*: one pair out, another in." },
    { q: "What is Laura asking?", es: "¿De qué es esta camisa?",
      options: ["What it's made of", "Whose shirt it is", "Where it's from"], answer: 0,
      why: "*¿De qué es?*: made of what. Whose would be *¿de quién?*" },
    { q: "What did Ana change?", es: "Ana cambió de opinión.",
      options: ["Her mind", "Her job", "Her clothes"], answer: 0,
      why: "*Opinión*: her mind. *Cambiar de*, with no *su*." }
  ],
  yourTurn: [
    { en: "The shirt is cotton.", es: "La camisa es de algodón.", accept: [] },
    { en: "I want a wooden table.", es: "Quiero una mesa de madera.", accept: [] },
    { en: "I changed jobs last year.", es: "Cambié de trabajo el año pasado.", accept: [] },
    { en: "Where can I change dollars into pesos?", es: "¿Dónde puedo cambiar dólares por pesos?", accept: [] },
    { en: "Can I exchange it for a bigger one? (the jacket)", es: "¿La puedo cambiar por una más grande?", accept: ["¿Puedo cambiarla por una más grande?"] }
  ],
  personal: {
    prompt: "Describe one thing you own and love: what it is made of. Then say one thing you changed in the last few years, with *cambiar de*.",
    constraints: [
      { type: "regex", pattern: "\\b(es|son|era|eran)\\s+de\\s+\\S+|\\s+de\\s+(madera|cuero|lana|algod[oó]n|plata|oro|pl[aá]stico|metal|vidrio)\\b", label: "what it is made of: *es de…*" },
      { type: "regex", pattern: "\\bcambi\\S*\\s+de\\s+\\S+", label: "a switch, with *cambiar de*: *cambié de…*" }
    ],
    model: "Mi reloj favorito es de plata. Hace dos años cambié de apartamento."
  },
  pitfalls: [
    "*La camisa es algodón* is missing a word: *es de algodón*.",
    "*Cambié mi trabajo* sounds odd: switching jobs is *cambié de trabajo*.",
    "At the counter, a swap takes *por*: *cambiarla por otra*, not *de otra*."
  ]
},

"gn-describir-persona-a2": {
  source: "merged",
  hook: {
    line: "Ask Laura about her grandmother and you get a portrait: what she is like, who she looks like, and one story from long ago. The story goes in the past; the portrait comes back to now.",
    es: "Mi abuela es bajita, alegre y un pan de Dios.\nSe parece mucho a mi mamá, pero es más seria.\nUna vez, cuando yo tenía ocho años, me llevó a ver el mar.",
    en: "My grandmother is short, cheerful and has a heart of gold.\nShe looks a lot like my mom, but she's more serious.\nOnce, when I was eight, she took me to see the sea."
  },
  examples: [
    { es: "Me parezco a mi papá, pero tengo los ojos de mi mamá.", en: "I look like my dad, but I have my mom's eyes." },
    { es: "Cuando la conocí, tenía el pelo mucho más corto.", en: "When I met her, her hair was much shorter." },
    { es: "Mi hermano y yo no nos parecemos nada.", en: "My brother and I aren't alike at all." }
  ],
  rule: "A fuller portrait has three moves.\nWho they are and what they are like, in the present: *Es alta, alegre, un poco tímida.*\nThen place them against someone you know, with *parecerse a*: *me parezco, te pareces, se parece, nos parecemos, se parecen*. *Se parece a su mamá.* Two people alike, no *a*: *Nos parecemos mucho.*\nOr compare: *Es más seria que mi mamá.*\nThen one short moment from the past: the scene in the describing past, the event in the event past. *Cuando la conocí, tenía el pelo corto.*\nThen back to the present. The moment is a detour, not the whole text.\nIn Colombia, *es un pan de Dios*: a heart of gold.",
  readAndPick: [
    { q: "Who does Diego look like?", es: "Diego se parece mucho a su papá.",
      options: ["His father", "His older brother", "No one"], answer: 0,
      why: "*Se parece a*: looks like. *A su papá*: his dad." },
    { q: "Are the two sisters alike?", es: "Las dos hermanas no se parecen nada.",
      options: ["Not at all", "Very much so", "Only a little"], answer: 0,
      why: "*No… nada*: not at all. Two people alike take no *a*." },
    { q: "Which verb sets the scene?", es: "Cuando la conocí, tenía el pelo corto.",
      options: ["tenía", "conocí", "Both of them"], answer: 0,
      why: "*Tenía* paints how she was then. *Conocí* is the event." },
    { q: "What is Laura saying about her neighbour?", es: "Doña Marta es un pan de Dios.",
      options: ["She's very kind", "She bakes bread", "She goes to church"], answer: 0,
      why: "*Un pan de Dios*: Colombian for a heart of gold." },
    { q: "Is this mostly about now, or about then?", es: "Es alta y alegre. Una vez me llevó al mar. Ahora vive en Cali.",
      options: ["Now, with a memory", "All about the past", "A plan for later"], answer: 0,
      why: "The present carries it; *una vez me llevó* is one moment from the past." }
  ],
  yourTurn: [
    { en: "I look a lot like my mom.", es: "Me parezco mucho a mi mamá.", accept: ["Me parezco mucho a mi madre."] },
    { en: "My brother and I aren't alike at all.", es: "Mi hermano y yo no nos parecemos nada.", accept: [] },
    { en: "When I met her, she had short hair.", es: "Cuando la conocí, tenía el pelo corto.", accept: [] },
    { en: "She's more serious than my mom.", es: "Es más seria que mi mamá.", accept: ["Ella es más seria que mi mamá.", "Es más seria que mi madre."] },
    { en: "Who do you look like? (to a friend)", es: "¿A quién te pareces?", accept: [] }
  ],
  personal: {
    prompt: "Describe someone you love in three or four lines: what they are like now, who they look like or how they compare, and one moment you remember.",
    constraints: [
      { type: "regex", pattern: "\\b(me parezco|te pareces|se parece|nos parecemos|se parecen)\\b|\\b(m[aá]s|menos|tan)\\b[^.?!]*\\b(que|como)\\b", label: "who they look like, or a comparison: *se parece a…*, *más… que*" },
      { type: "anyVerbInTense", tense: "preterito", label: "one moment from the past: *una vez me llevó…*" },
      { type: "minSentences", n: 3, label: "at least three sentences" }
    ],
    model: "Mi hermana es alta y muy divertida. Se parece a mi papá. Una vez, cuando éramos niños, me enseñó a nadar."
  },
  pitfalls: [
    "Looking like someone is not *mirar*: *Me parezco a mi papá.*",
    "*Parecerse* needs its *a* before the person: *se parece a su mamá*.",
    "Keep the present as the base. A whole portrait in the past sounds as if the person is gone."
  ]
},

"gn-describir-objeto-a2": {
  source: "merged",
  hook: {
    line: "Sam finds an odd wooden thing in Laura's grandmother's kitchen and holds it up. Describing something you have no word for is a real skill: what it's made of, its parts, and above all what it's for.",
    es: "Sam: ¿Para qué sirve esto?\nLaura: Es un molinillo. Sirve para batir el chocolate.\nLaura: Es de madera y tiene un palo largo.",
    en: "Sam: What's this for?\nLaura: It's a molinillo. It's for whisking hot chocolate.\nLaura: It's made of wood and it has a long handle."
  },
  examples: [
    { es: "La silla tiene cuatro patas y un asiento de cuero.", en: "The chair has four legs and a leather seat." },
    { es: "Este celular ya no sirve.", en: "This phone doesn't work any more." },
    { es: "Es más pequeña que las otras, pero es más fuerte.", en: "It's smaller than the others, but it's stronger." }
  ],
  rule: "Describe a thing in four steps.\nWhat it is, and its main feature: *Es una lámpara. Es redonda y es de vidrio.*\nIts parts, with *tiene*: *Tiene una base, un cable y un botón.*\nWhat it's for: *sirve para* plus the dictionary form, or plus a thing. *Sirve para abrir botellas. Sirve para el chocolate.*\nTo ask: *¿Para qué sirve?*, or *¿Para qué sirven?* for more than one.\nClose by comparing it with others of its kind: *Es más pequeña que las otras.*\nIf you have a story about it, tell it in the past: *Una vez la llevé a la playa.*\n*No sirve*, with nothing after it, is the everyday Colombian way to say “it doesn't work”.",
  readAndPick: [
    { q: "What does Laura want to know?", es: "¿Para qué sirve este botón?",
      options: ["What it does", "Where it is", "What it costs"], answer: 0,
      why: "*¿Para qué sirve?*: what is it for." },
    { q: "Is Diego's phone working?", es: "Mi celular no sirve.",
      options: ["No, it's broken", "Yes, it's fine", "It's not his phone"], answer: 0,
      why: "*No sirve*: it doesn't work. The everyday Colombian way to say broken." },
    { q: "What is the big cup for?", es: "La taza grande sirve para el chocolate.",
      options: ["Hot chocolate", "Black coffee", "Soup"], answer: 0,
      why: "*Sirve para* plus a thing: what it's meant to hold." },
    { q: "Which line gives the parts?", es: "Es de madera.\nTiene cuatro patas y un asiento.\nEs mejor que la otra.",
      options: ["The second", "The first", "The last one"], answer: 0,
      why: "*Tiene* plus the pieces: the parts. The others give the material and a comparison." },
    { q: "What is the speaker doing here?", es: "Es más pequeña que las otras, pero es más fuerte.",
      options: ["Comparing it", "Telling a story", "Saying what it's for"], answer: 0,
      why: "*Más… que*: it is set against others of its kind." }
  ],
  yourTurn: [
    { en: "What's this for?", es: "¿Para qué sirve esto?", accept: [] },
    { en: "It's for opening bottles.", es: "Sirve para abrir botellas.", accept: [] },
    { en: "The chair has four legs.", es: "La silla tiene cuatro patas.", accept: [] },
    { en: "This phone doesn't work.", es: "Este celular no sirve.", accept: ["Este celular no funciona."] },
    { en: "It's smaller than the others, but stronger. (the lamp)", es: "Es más pequeña que las otras, pero más fuerte.", accept: ["Es más pequeña que las otras, pero es más fuerte."] }
  ],
  personal: {
    prompt: "Describe something in your home without naming it, so a friend could guess: what it's made of, its parts, and what it's for.",
    constraints: [
      { type: "regex", pattern: "\\b(es|son)\\s+de\\s+\\S+", label: "what it's made of: *es de…*" },
      { type: "regex", pattern: "\\btiene\\s+\\S+", label: "its parts, with *tiene*" },
      { type: "containsWord", word: "sirve para", label: "what it's for: *sirve para…*" }
    ],
    model: "Es de metal y de vidrio. Tiene una puerta y un botón. Sirve para calentar la comida."
  },
  pitfalls: [
    "After *para*, the dictionary form: *sirve para abrir*, never *sirve para abre*.",
    "English leaves “for” at the end; Spanish puts it first: *¿Para qué sirve?*",
    "A machine that doesn't work *no sirve* or *no funciona*. *Trabajar* is for people."
  ]
},

"task-a2-comparar": {
  source: "old",
  hook: {
    line: "Sam is choosing between two apartments, one in Chapinero and one on the edge of the city. This week ends with a real comparison: four points, all three ways of comparing, and a choice with a reason.",
    es: "El de Chapinero es más caro que el otro, pero está mejor ubicado.\nEl de las afueras es igual de bonito y tiene más luz.\nMe quedo con el de Chapinero porque está cerca del trabajo.",
    en: "The Chapinero one is more expensive than the other, but it's in a better spot.\nThe one on the outskirts is just as nice and has more light.\nI'll take the Chapinero one because it's close to work."
  },
  examples: [
    { es: "Es el más barato de todos.", en: "It's the cheapest of all." },
    { es: "El celular nuevo es igual de rápido que el viejo.", en: "The new phone is just as fast as the old one." },
    { es: "Este barrio es menos ruidoso, pero queda más lejos.", en: "This neighbourhood is less noisy, but it's further away." }
  ],
  rule: "Pick two real things: two neighbourhoods, two phones, two jobs. Compare them on four points, then choose.\nUse all three ways of comparing:\nmore or less: *más caro que, menos ruidoso que*\nthe same: *tan bonito como*, or *igual de bonito que*\nthe most: *el más barato de todos*, with *el* or *la* in front and *de* after\nBring in the four that skip *más*: *mejor, peor, mayor, menor*.\n*Pero* and *en cambio*, on the other hand, carry the contrast.\nThen choose, with a reason: *Me quedo con el de Chapinero porque está cerca.*\n*El de Chapinero* saves repeating the thing: the one in Chapinero.",
  readAndPick: [
    { q: "Which apartment is cheaper?", es: "El de Chapinero es más caro que el del centro.",
      options: ["The one downtown", "The Chapinero one", "They're the same"], answer: 0,
      why: "*Más caro que*: the Chapinero one costs more." },
    { q: "Is the new phone faster?", es: "El celular nuevo es igual de rápido que el viejo.",
      options: ["No, just as fast", "Yes, much faster", "No, it's slower now"], answer: 0,
      why: "*Igual de… que*: just as. Neither is faster." },
    { q: "What does *el de las afueras* mean here?", es: "El de las afueras tiene más luz.",
      options: ["The one on the outskirts", "The edge of town", "The light outside"], answer: 0,
      why: "*El de…* stands in for the apartment: the one on the outskirts." },
    { q: "Has Sam decided?", es: "Me quedo con el de Chapinero porque está cerca.",
      options: ["Yes, Chapinero", "No, not yet", "Yes, the other one"], answer: 0,
      why: "*Me quedo con*: I'll take. *Porque* gives his reason." },
    { q: "How cheap is it?", es: "Es el más barato de todos.",
      options: ["The cheapest of all", "Cheaper than one", "As cheap as the rest"], answer: 0,
      why: "*El más… de todos*: the most, out of the whole group." }
  ],
  yourTurn: [
    { en: "It's more expensive than the other one, but it's better.", es: "Es más caro que el otro, pero es mejor.", accept: [] },
    { en: "The new one is just as fast as the old one.", es: "El nuevo es igual de rápido que el viejo.", accept: ["El nuevo es tan rápido como el viejo."] },
    { en: "It's the cheapest of all.", es: "Es el más barato de todos.", accept: [] },
    { en: "I'll take the one in Chapinero because it's close.", es: "Me quedo con el de Chapinero porque está cerca.", accept: [] }
  ],
  personal: {
    prompt: "Compare two real options you have: two places, two phones, two jobs. Give at least two points, then choose one with *porque*.",
    constraints: [
      { type: "regex", pattern: "\\b(m[aá]s|menos)\\b[^.?!]*\\bque\\b", label: "*más… que* or *menos… que*" },
      { type: "regex", pattern: "\\b(mejor|peor|mayor|menor)\\b", label: "one of the four: *mejor*, *peor*, *mayor*, *menor*" },
      { type: "containsWord", word: "porque", label: "your choice, with *porque*" }
    ],
    model: "El trabajo nuevo es más interesante que el viejo, pero paga peor. Me quedo con el nuevo porque aprendo más."
  },
  pitfalls: [
    "The most takes *de*, not *que*: *el más barato de todos*.",
    "*Igual de* pairs with *que*; *tan* pairs with *como*: *igual de caro que*, *tan caro como*.",
    "Make the choice: a comparison with no decision is only a list."
  ]
},

/* ---- unit 22 · Getting things done ------------------------------------- */

"gn-conversacion-transaccional-a2": {
  source: "old",
  hook: {
    line: "Buying a sweater in a Bogotá shop takes more than *¿Cuánto cuesta?* The assistant shows you options and asks what you think, you try things on, and if you pay by card there is one question few other countries ask.",
    es: "Vendedora: Buenas tardes, ¿en qué le puedo servir?\nSam: Quería un suéter de lana, talla M.\nVendedora: Tenemos estos dos. ¿Se los quiere medir?\nSam: Sí, gracias. ¿Dónde está el probador?",
    en: "Assistant: Good afternoon, how can I help you?\nSam: I'd like a wool sweater, size M.\nAssistant: We have these two. Would you like to try them on?\nSam: Yes, thanks. Where's the fitting room?"
  },
  examples: [
    { es: "¿Cómo le queda?\nMe queda un poco grande.", en: "How does it fit?\nIt's a bit big on me." },
    { es: "¿Con tarjeta? ¿A cuántas cuotas?\nA una, por favor.", en: "By card? How many instalments?\nJust one, please." },
    { es: "¿La factura a nombre de quién?\nA nombre de Sam Taylor.", en: "Whose name should the receipt be in?\nIn Sam Taylor's name." }
  ],
  rule: "The shop now has a middle, not just ask, pay, leave.\nThe assistant opens: *¿En qué le puedo servir?* How can I help you?\nYou ask with *quería*: *Quería un suéter.* At a counter it sounds softer than *quiero*.\nThey show you options: *¿Le gustan?* Compare before you choose: *Este es más bonito, pero el otro es de lana.*\nIn Colombia you try clothes on with *medirse*: *¿Me lo puedo medir?*\nThe fit goes with *quedar*: *Me queda grande. Me queda bien.*\nPaying by card, the cashier asks *¿A cuántas cuotas?*: how many monthly payments. *A una* pays it all at once.\nClose with a word about something else, the traffic or the rain, then *gracias, muy amable*.",
  readAndPick: [
    { q: "What is the assistant asking?", es: "¿En qué le puedo servir?",
      options: ["How she can help", "What size you wear", "How you'll pay"], answer: 0,
      why: "*¿En qué le puedo servir?*: how can I help you. The usual shop opening in Colombia." },
    { q: "Does the shirt fit Sam?", es: "Me queda pequeña.",
      options: ["No, it's too small", "Yes, it fits well", "He hasn't tried it"], answer: 0,
      why: "*Quedar* is how clothes fit: *me queda pequeña*, it's small on me." },
    { q: "What does Sam want to do?", es: "¿Me lo puedo medir?",
      options: ["Try it on", "Measure the room", "Pay for it now"], answer: 0,
      why: "In Colombia *medirse* clothes is to try them on." },
    { q: "Why does the cashier ask this?", es: "¿A cuántas cuotas?",
      options: ["You're paying by card", "You're paying cash", "You want a discount"], answer: 0,
      why: "Card payments in Colombia can be split: *cuotas* are monthly payments." },
    { q: "Is *quería* about the past here?", es: "Quería un suéter de lana.",
      options: ["No, it's a polite ask", "Yes, he wanted one once", "No, it's a complaint"], answer: 0,
      why: "*Quería* softens a request at a counter: I'd like." }
  ],
  yourTurn: [
    { en: "I'd like a wool sweater. (in a shop)", es: "Quería un suéter de lana.", accept: [] },
    { en: "Can I try it on? (the sweater)", es: "¿Me lo puedo medir?", accept: ["¿Puedo medírmelo?", "¿Me lo puedo probar?", "¿Puedo probármelo?"] },
    { en: "It's a bit big on me.", es: "Me queda un poco grande.", accept: [] },
    { en: "Just one instalment, please.", es: "A una cuota, por favor.", accept: ["A una, por favor."] },
    { en: "How can I help you? (to a customer)", es: "¿En qué le puedo servir?", accept: ["¿En qué puedo servirle?", "¿En qué le puedo ayudar?"] }
  ],
  personal: {
    prompt: "You're in a clothes shop in Bogotá. Write your side: ask for something with *quería*, ask to try it on, and say how it fits.",
    constraints: [
      { type: "containsWord", word: "quería", label: "ask with *quería*" },
      { type: "containsAny", words: ["medir", "probar"], label: "ask to try it on: *¿Me lo puedo medir?*" },
      { type: "regex", pattern: "\\bme\\s+queda(n)?\\b", label: "how it fits: *me queda…*" }
    ],
    model: "Quería una chaqueta negra, talla L. ¿Me la puedo medir? Me queda un poco grande. ¿La tiene en M?"
  },
  pitfalls: [
    "*Quiero un suéter* is not wrong, but at a counter *quería* sounds softer.",
    "Fit is *quedar*, not *ser*: *me queda grande* is big on me.",
    "To pay in one go, answer *¿A cuántas cuotas?* with *a una*."
  ]
},

"fn-responder-telefono-a2": {
  source: "old",
  hook: {
    line: "In Colombia the phone is answered with a word that sounds almost English, *¿Aló?* And when someone asks for you by name, you don't say “it's me”. You say “with him”, or “with her”.",
    es: "Laura: ¿Aló?\nDiego: Buenas, ¿hablo con Laura?\nLaura: Sí, con ella. ¿Con quién hablo?\nDiego: Con Diego. Oye, ¿te cuento algo?",
    en: "Laura: Hello?\nDiego: Hi, is that Laura?\nLaura: Yes, speaking. Who's this?\nDiego: It's Diego. Hey, can I tell you something?"
  },
  examples: [
    { es: "¿Está la señora Gómez?\n¿De parte de quién?", en: "Is Mrs Gómez there?\nWho's calling, please?" },
    { es: "No está. ¿Quiere dejarle un mensaje?", en: "She's not in. Would you like to leave her a message?" },
    { es: "¿Te cuento algo?\nSí, claro, cuéntame.", en: "Can I tell you something?\nSure, tell me." }
  ],
  rule: "Pick up with *¿Aló?*\nAsked for by name: *Sí, con él* or *Sí, con ella*. That means speaking.\nNot sure who it is: *¿Con quién hablo?*, or more politely, *¿De parte de quién?*\nIt's for someone else: *Un momento, ya se lo paso*, or *se la paso* for a woman.\nThey're out: *No está. ¿Quiere dejarle un mensaje?* Colombians also say *dejar razón*.\nWrong number: *Está equivocado.*\nWhen a friend asks *¿Te cuento algo?*, open the floor: *Sí, claro, cuéntame.* Keep them going with *¿Sí?* or *¿Y qué pasó?*\nNo time? Sorry and a reason: *Qué pena, es que estoy en el trabajo.*",
  readAndPick: [
    { q: "Who is speaking?", es: "¿Está Laura?\nSí, con ella.",
      options: ["Laura herself", "Laura's mother", "A friend of hers"], answer: 0,
      why: "*Con ella*, with her: Colombian for speaking." },
    { q: "What is the person who answered asking?", es: "¿De parte de quién?",
      options: ["Who's calling", "Where you are", "What you want"], answer: 0,
      why: "*¿De parte de quién?*: on behalf of whom. The polite who's calling." },
    { q: "Is Diego there?", es: "No está. ¿Quiere dejarle un mensaje?",
      options: ["No, he's out", "Yes", "Yes, but he's busy"], answer: 0,
      why: "*No está*: he isn't in. Then an offer to take a message." },
    { q: "What does Ana want to do?", es: "Oye, ¿te cuento algo?",
      options: ["Tell you some news", "Ask you a favour", "Hang up"], answer: 0,
      why: "*¿Te cuento algo?*: can I tell you something. A story is coming." },
    { q: "Will Sam listen now?", es: "Qué pena, es que estoy en el trabajo. Luego hablamos.",
      options: ["No, later", "Yes, right away", "No, not ever"], answer: 0,
      why: "Sorry, a reason with *es que*, then *luego hablamos*: we'll talk later." }
  ],
  yourTurn: [
    { en: "Hello? (answering the phone)", es: "¿Aló?", accept: [] },
    { en: "Yes, speaking. (a woman answering)", es: "Sí, con ella.", accept: [] },
    { en: "Who's calling, please?", es: "¿De parte de quién?", accept: [] },
    { en: "One moment, I'll put her on.", es: "Un momento, ya se la paso.", accept: ["Un momento, se la paso."] },
    { en: "Sure, tell me. (to a friend)", es: "Sí, claro, cuéntame.", accept: ["Claro, cuéntame."] }
  ],
  personal: {
    prompt: "Someone calls for a housemate who is out. Write your side of the call: pick up, ask who is calling, and offer to take a message.",
    constraints: [
      { type: "containsWord", word: "aló", label: "pick up: *¿Aló?*" },
      { type: "containsAny", words: ["de parte de quién", "con quién hablo"], label: "ask who it is" },
      { type: "containsAny", words: ["mensaje", "razón"], label: "offer a message: *¿Quiere dejarle un mensaje?*" }
    ],
    model: "¿Aló? No, Diego no está. ¿De parte de quién? ¿Quiere dejarle un mensaje?"
  },
  pitfalls: [
    "*Sí, yo* sounds unfinished. Asked for by name: *Sí, con él* or *Sí, con ella*.",
    "*¿Quién eres?* on the phone sounds blunt: *¿De parte de quién?*",
    "In Spain you will hear *¿Dígame?* and *dejar un recado*. In Colombia: *¿Aló?*, and *dejar un mensaje* or *dejar razón*."
  ]
},

"fn-pedir-informacion-a2": {
  source: "merged",
  hook: {
    line: "*¿Te gusta la música?* gets you a yes. *¿Qué tipo de música te gusta?* gets you a conversation. Questions get sharper now, and the answers match their shape.",
    es: "Sam: ¿Qué tipo de música te gusta?\nLaura: El vallenato y la salsa.\nSam: ¿Y cuál es tu canción favorita?\nLaura: Uy, ¡son muchas!",
    en: "Sam: What kind of music do you like?\nLaura: Vallenato and salsa.\nSam: And what's your favourite song?\nLaura: Oh, there are so many!"
  },
  examples: [
    { es: "¿Con quién vives?\nCon mis papás.", en: "Who do you live with?\nWith my parents." },
    { es: "¿Cómo vienes al trabajo?\nEn bus.", en: "How do you get to work?\nBy bus." },
    { es: "¿De quién son estas llaves?", en: "Whose keys are these?" }
  ],
  rule: "*¿Qué tipo de…?* asks for a kind: *¿Qué tipo de música te gusta?* No *el* or *la* after *de*. A plural kind takes a plural verb: *¿Qué tipo de películas te gustan?*\n*Cuál* picks one from a set: *¿Cuál es tu color favorito?* Before *es*, it is almost always *cuál*, even where English says “what”.\nEnglish leaves the small word at the end; Spanish puts it first: *¿Con quién vives? ¿De quién es? ¿Para qué es?* Who with, whose, what for.\nAnswer in the shape of the question; no full sentence needed:\nwhere: *Cerca de la estación.*\nhow: *En bus.*\nwho with: *Con mis papás.*\nhow long: *Desde hace dos años.*",
  readAndPick: [
    { q: "What kind of answer does Diego want?", es: "¿Qué tipo de comida te gusta?",
      options: ["A kind of food", "One single dish", "A place to eat"], answer: 0,
      why: "*¿Qué tipo de…?* asks for a kind: Italian, Mexican, food from the coast." },
    { q: "What is Ana asking?", es: "¿De quién es este celular?",
      options: ["Whose phone it is", "Where it's from", "What it's made of"], answer: 0,
      why: "*¿De quién?*: whose. Where from would be *¿de dónde?*" },
    { q: "Laura asks *¿Cómo vienes al trabajo?* Which answer fits?", es: "Cerca de la estación.\nEn bus.\nA las ocho.",
      options: ["En bus.", "Cerca de la estación.", "A las ocho."], answer: 0,
      why: "*¿Cómo?* asks how: *en bus*. The others answer where and when." },
    { q: "What does Sam want to know?", es: "¿Para qué necesitas el español?",
      options: ["What it's for", "Since when", "Who with"], answer: 0,
      why: "*¿Para qué?*: what for. The answer starts with *para*: *para trabajar*." },
    { q: "How long has Laura lived there?", es: "¿Desde cuándo vives aquí?\nDesde hace dos años.",
      options: ["Two years so far", "Two years ago, not now", "In two years"], answer: 0,
      why: "*Desde hace*: for two years, and still going." }
  ],
  yourTurn: [
    { en: "What kind of music do you like? (to a friend)", es: "¿Qué tipo de música te gusta?", accept: ["¿Qué clase de música te gusta?"] },
    { en: "What kind of films do you like? (to a friend)", es: "¿Qué tipo de películas te gustan?", accept: ["¿Qué clase de películas te gustan?"] },
    { en: "What's your favourite colour? (to a friend)", es: "¿Cuál es tu color favorito?", accept: [] },
    { en: "Who do you live with? (to a friend)", es: "¿Con quién vives?", accept: [] },
    { en: "By bus.", es: "En bus.", accept: [] }
  ],
  personal: {
    prompt: "Write three questions you would ask someone new at a party: one with *¿Qué tipo de…?*, one with *¿Cuál…?*, and one with the small word first, like *¿Con quién…?*",
    constraints: [
      { type: "containsWord", word: "qué tipo de", label: "*¿Qué tipo de…?*" },
      { type: "regex", pattern: "¿\\s*cu[aá]l", label: "*¿Cuál…?*" },
      { type: "regex", pattern: "¿\\s*(con|de|para|a|en)\\s+(qui[eé]n|qu[eé]|d[oó]nde)", label: "the small word first: *¿Con quién…?*, *¿Para qué…?*" }
    ],
    model: "¿Qué tipo de música te gusta? ¿Cuál es tu restaurante favorito? ¿Con quién vives?"
  },
  pitfalls: [
    "*¿Qué es tu color favorito?* sounds foreign: before *es*, picking one is *cuál*.",
    "No *el* or *la* after *tipo de*: *¿Qué tipo de música?*",
    "*¿Quién vives con?* follows the English: the small word goes first, *¿Con quién vives?*"
  ]
},

"fn-preguntar-preferencias-a2": {
  source: "merged",
  hook: {
    line: "A Colombian host offers you a choice every five minutes. Answering takes one word. Asking takes *preferir*, or *gustar* with *más*.",
    es: "Laura: ¿Prefieres tinto o jugo?\nSam: Jugo, gracias.\nLaura: ¿Y te gusta más el jugo de mango o el de mora?\nSam: Me gusta más el de mora.",
    en: "Laura: Would you rather have a black coffee or a juice?\nSam: Juice, thanks.\nLaura: And do you like mango juice or blackberry juice more?\nSam: I like the blackberry one more."
  },
  examples: [
    { es: "¿Cuál prefieres, el rojo o el azul?\nEl azul.", en: "Which one do you prefer, the red or the blue?\nThe blue one." },
    { es: "Me gusta más caminar que ir en carro.", en: "I like walking more than going by car." },
    { es: "Nos gustan más los perros que los gatos.", en: "We like dogs more than cats." }
  ],
  rule: "*Preferir* changes inside, like *querer*: *prefiero, prefieres, prefiere, preferimos, prefieren*.\nTo offer a choice, name both with *o*: *¿Prefieres tinto o jugo?* Among friends, just *¿Tinto o jugo?*\nAnswer by picking one: *Jugo, gracias.* A yes is not an answer.\nWhen both are in front of you: *¿Cuál prefieres?*\nWith *gustar*, put *más* right after the verb and *que* before the other side: *Me gusta más el tinto que el té.*\n*Más* comes once. Keep both sides the same kind, two things or two actions: *Me gusta más leer que ver televisión.*\nMore than one thing: *Me gustan más los perros que los gatos.*\nDon't mind? *Me da igual.*",
  readAndPick: [
    { q: "What does Sam want?", es: "¿Tinto o jugo?\nJugo, gracias.",
      options: ["Juice", "Black coffee", "Neither one"], answer: 0,
      why: "An either-or question wants one of the two: *jugo*." },
    { q: "Which does Laura like more?", es: "Me gusta más el campo que la ciudad.",
      options: ["The country", "The city", "Both the same"], answer: 0,
      why: "*Más* goes with what comes first, *el campo*. *Que* brings in the other side." },
    { q: "Does Diego mind which?", es: "¿El sábado o el domingo?\nMe da igual.",
      options: ["No, either is fine", "Yes, Saturday", "Yes, Sunday"], answer: 0,
      why: "*Me da igual*: it's all the same to me." },
    { q: "Who prefers Saturday?", es: "Preferimos el sábado.",
      options: ["We do", "They do", "I do"], answer: 0,
      why: "*Preferimos*: we. Only the we form keeps the plain *e*." },
    { q: "What does Ana enjoy more?", es: "Me gusta más cocinar que lavar los platos.",
      options: ["Cooking", "Washing up", "Eating out"], answer: 0,
      why: "*Más* follows *gusta*; the first action is the one she likes more." },
    { q: "Has Diego answered the question?", es: "¿Prefieres cine o fútbol?\nSí.",
      options: ["No, he must pick one", "Yes, he likes both", "Yes, cinema"], answer: 0,
      why: "An either-or question wants one of the two, not yes." }
  ],
  yourTurn: [
    { en: "Do you prefer black coffee or juice? (to a friend)", es: "¿Prefieres tinto o jugo?", accept: ["¿Prefieres un tinto o un jugo?"] },
    { en: "Juice, thanks.", es: "Jugo, gracias.", accept: [] },
    { en: "I like the countryside more than the city.", es: "Me gusta más el campo que la ciudad.", accept: [] },
    { en: "I like reading more than watching TV.", es: "Me gusta más leer que ver televisión.", accept: ["Me gusta más leer que ver tele."] },
    { en: "We like dogs more than cats.", es: "Nos gustan más los perros que los gatos.", accept: [] }
  ],
  personal: {
    prompt: "Write two true lines: a choice you would offer a guest, with *o*, and something you like more than something else, with *me gusta más… que*.",
    constraints: [
      { type: "regex", pattern: "¿[^?]*\\s+o\\s+[^?]*\\?", label: "a choice for a guest, with *o*: *¿Tinto o jugo?*" },
      { type: "regex", pattern: "\\bgustan?\\s+m[aá]s\\b[^.?!]*\\bque\\b", label: "*me gusta más… que*" }
    ],
    model: "¿Prefieres tinto o aromática? A mí me gusta más el té que el café."
  },
  pitfalls: [
    "*Más* comes once: *me gusta más el té que el café*, never *más el té más que el café*.",
    "*Prefero* is a slip: *prefiero*, like *quiero*.",
    "Asked *¿Tinto o jugo?*, a *sí* is not an answer: pick one."
  ]
},

"nt-necesidad-obligacion-a2": {
  source: "old",
  hook: {
    line: "Laura is packing for a weekend at her family's finca and asks what Sam needs. Two small sets of words do the job: what is needed, and what will do.",
    es: "Laura: ¿Necesitas algo para el viaje?\nSam: Me hace falta un vestido de baño. Allá hace calor.\nLaura: ¿Salimos a las siete o a las ocho?\nSam: Me da igual. A las siete está bien.",
    en: "Laura: Do you need anything for the trip?\nSam: I need a swimsuit. It's hot there.\nLaura: Shall we leave at seven or at eight?\nSam: I don't mind. Seven is fine."
  },
  examples: [
    { es: "No hace falta reservar.", en: "There's no need to book." },
    { es: "Para entrar es necesario mostrar el pasaporte.", en: "To get in you have to show your passport." },
    { es: "¿Nos vemos a las ocho?\nListo, de acuerdo.", en: "Shall we meet at eight?\nOK, agreed." }
  ],
  rule: "Three ways to say what is needed:\n*necesitar*, with you as the one who needs: *Necesito descansar. Necesitamos más tiempo.*\n*hace falta*, which works like *gustar*: the thing that is needed does the work. *Me hace falta un abrigo. Me hacen falta dos sillas.*\n*es necesario* plus the dictionary form, with nobody named: *Es necesario reservar.*\nNo need: *No hace falta*, often with *gracias*.\nTo say yes to a plan: *Está bien. De acuerdo. Listo. Claro.* None of them says how good it is; they just say yes.\nIt's all the same to you: *Me da igual.*\n*No me importa* also means “I don't mind”, but on its own it can sound like “I don't care”.",
  readAndPick: [
    { q: "Who needs a jacket?", es: "A Diego le hace falta una chaqueta.",
      options: ["Diego does", "The speaker", "Nobody"], answer: 0,
      why: "*A Diego le hace falta*: Diego needs it. *Hacer falta* works like *gustar*." },
    { q: "Do they have to book?", es: "No hace falta reservar.",
      options: ["No, there's no need", "Yes, they must", "Only at weekends"], answer: 0,
      why: "*No hace falta*: there's no need." },
    { q: "Is Ana saying the plan is good, or just yes?", es: "¿Nos vemos a las ocho?\nListo.",
      options: ["Just yes", "That it's great", "That it's too late"], answer: 0,
      why: "*Listo* agrees to the plan. It says nothing about how good it is." },
    { q: "Does Sam care which day?", es: "¿El sábado o el domingo?\nMe da igual.",
      options: ["No, either is fine", "Yes, Saturday", "Yes, Sunday"], answer: 0,
      why: "*Me da igual*: it's all the same to me." },
    { q: "Who has to show a passport?", es: "Para entrar es necesario mostrar el pasaporte.",
      options: ["Everyone", "Only the speaker", "Only foreigners"], answer: 0,
      why: "*Es necesario* names nobody: it's a rule for everyone." },
    { q: "How many chairs are missing?", es: "Nos hacen falta dos sillas.",
      options: ["Two", "One", "None"], answer: 0,
      why: "*Hacen*, with *-n*, because two chairs are needed." }
  ],
  yourTurn: [
    { en: "I need a jacket.", es: "Me hace falta una chaqueta.", accept: ["Necesito una chaqueta."] },
    { en: "There's no need, thanks.", es: "No hace falta, gracias.", accept: [] },
    { en: "You have to book in advance. (nobody named)", es: "Es necesario reservar antes.", accept: ["Hay que reservar antes."] },
    { en: "I don't mind. (it's all the same to me)", es: "Me da igual.", accept: [] },
    { en: "OK, agreed.", es: "Listo, de acuerdo.", accept: ["Está bien, de acuerdo."] }
  ],
  personal: {
    prompt: "You're going away for a weekend. Write what you need, with *necesito* or *me hace falta*, and one thing there's no need to take.",
    constraints: [
      { type: "containsAny", words: ["necesito", "me hace falta", "me hacen falta"], label: "what you need: *necesito…* or *me hace falta…*" },
      { type: "containsAny", words: ["no hace falta", "no es necesario", "no necesito"], label: "what there's no need for: *no hace falta…*" }
    ],
    model: "Necesito un vestido de baño y bloqueador. No hace falta llevar chaqueta."
  },
  pitfalls: [
    "*Hacer falta* works like *gustar*: *me hacen falta dos sillas*, with *-n* for more than one.",
    "*Listo* says yes to a plan. To say how something was, use *estuvo bien* or *estuvo muy bueno*.",
    "*No me importa* on its own can sound like “I don't care”. *Me da igual* is the friendly “I don't mind”."
  ]
},

"fn-preguntar-conocimiento-a2": {
  source: "merged",
  hook: {
    line: "At the bus stop a woman asks Sam whether he knows when the bus comes, and later Ana asks whether he knows Cartagena. Both are “know” in English. In Spanish, the word after the verb decides: *saber* or *conocer*.",
    es: "Una señora: ¿Sabe a qué hora pasa el bus?\nSam: No sé, señora. Ni idea, la verdad.\nAna: ¿Conoces Cartagena?\nSam: No, pero conozco un poco la costa.",
    en: "A woman: Do you know what time the bus comes?\nSam: I don't know, ma'am. No idea, honestly.\nAna: Have you been to Cartagena?\nSam: No, but I know the coast a little."
  },
  examples: [
    { es: "Sé nadar, pero no sé bailar salsa.", en: "I can swim, but I can't dance salsa." },
    { es: "No conozco a tu hermano.", en: "I don't know your brother. (to a friend)" },
    { es: "Hablo un poco de francés y no sé nada de fútbol.", en: "I speak a little French and I know nothing about football." }
  ],
  rule: "Look at what comes after the verb.\n*saber* plus a verb: a skill. *Sé nadar*, I can swim. There is no word for “how to”.\n*saber* plus *qué, cuándo, dónde, a qué hora*: a fact. *¿Sabes dónde queda?*\n*conocer* plus a place: you've been there. *¿Conoces Cartagena?*\n*conocer* plus *a* and a person: you've met them. *No conozco a tu hermano.*\nThe I forms are *sé* and *conozco*.\nSpanish speakers soften what they know: *un poco, bastante bien, muy bien*. Before a thing, *un poco de*: *un poco de francés*.\nNothing at all: *No sé nada de fútbol.*\nNot knowing: *No sé. No estoy seguro. Creo que sí.* *Ni idea* is blunt but friendly.",
  readAndPick: [
    { q: "What is the woman asking?", es: "¿Sabe a qué hora pasa el bus?",
      options: ["When the bus comes", "Where it stops", "If it's full"], answer: 0,
      why: "*Saber* plus *a qué hora*: a fact she needs." },
    { q: "Has Ana been to Cartagena?", es: "No, no conozco Cartagena.",
      options: ["No, never", "Yes", "She lives there"], answer: 0,
      why: "*Conocer* plus a place: to have been there." },
    { q: "Can Diego dance salsa?", es: "Diego no sabe bailar salsa.",
      options: ["No, he can't", "Yes, a bit", "He won't dance"], answer: 0,
      why: "*Saber* plus a verb is a skill: he can't dance it." },
    { q: "How well does Laura know Medellín?", es: "Conozco bastante bien Medellín.",
      options: ["Quite well", "Not at all", "Only a tiny bit"], answer: 0,
      why: "*Bastante bien*: quite well. A soft but real yes." },
    { q: "How sure is Sam?", es: "Ni idea.",
      options: ["Not at all", "Fairly sure", "Totally sure"], answer: 0,
      why: "*Ni idea*: no idea. Blunt, but friendly." },
    { q: "Has Sam met Laura's brother?", es: "No conozco a tu hermano.",
      options: ["No, never", "Yes, they've met", "Only on the phone"], answer: 0,
      why: "*Conocer a* a person: to have met them." }
  ],
  yourTurn: [
    { en: "I can swim.", es: "Sé nadar.", accept: ["Yo sé nadar."] },
    { en: "Have you been to Cartagena? (to a friend)", es: "¿Conoces Cartagena?", accept: [] },
    { en: "I don't know your brother. (to a friend)", es: "No conozco a tu hermano.", accept: [] },
    { en: "I speak a little French.", es: "Hablo un poco de francés.", accept: [] },
    { en: "Do you know what time the bus comes? (polite)", es: "¿Sabe a qué hora pasa el bus?", accept: ["¿Sabe a qué hora viene el bus?", "¿Usted sabe a qué hora pasa el bus?"] }
  ],
  personal: {
    prompt: "Write two true lines about what you know: one skill with *sé* or *no sé*, and one place or person with *conozco*, softened with *un poco* or *bastante bien*.",
    constraints: [
      { type: "regex", pattern: "\\bs[eé]\\s+\\S+(ar|er|ir)\\b", label: "a skill: *sé…* or *no sé…*" },
      { type: "regex", pattern: "\\bconozco\\b", label: "a place or a person: *conozco…*" },
      { type: "containsAny", words: ["un poco", "bastante", "muy bien", "nada"], label: "how much: *un poco*, *bastante bien*…" }
    ],
    model: "Sé cocinar, pero no sé bailar. Conozco un poco Bogotá."
  },
  pitfalls: [
    "There's no “how to”: *Sé nadar*, never *Sé cómo nadar*.",
    "A person after *conocer* takes *a*: *Conozco a tu hermano.*",
    "A bare *Hablo francés* can sound like a big claim; add *un poco* or *bastante bien*."
  ]
},

"task-a2-gestion": {
  source: "old",
  hook: {
    line: "Three conversations go wrong on every trip: a phone call, a return at a shop, a question at a desk. Each one has a fixed shape, and this week ends with all three.",
    es: "Sam: Buenos días. Llamo por el apartamento del anuncio.\nSam: Quería cambiar esta camisa. Es que me queda pequeña.\nSam: Disculpe, ¿sabe si hay un bus al aeropuerto?",
    en: "Sam: Good morning. I'm calling about the apartment in the ad.\nSam: I'd like to exchange this shirt. The thing is, it's too small.\nSam: Excuse me, do you know if there's a bus to the airport?"
  },
  examples: [
    { es: "¿Lo puedo ver esta semana?\n¿Le sirve el jueves a las seis?", en: "Can I see it this week?\nDoes Thursday at six work for you?" },
    { es: "¿Tiene la factura?\nSí, aquí está.", en: "Do you have the receipt?\nYes, here it is." },
    { es: "Muchas gracias, muy amable.", en: "Thank you very much, that's very kind." }
  ],
  rule: "Write three short exchanges.\nThe phone call: *¿Aló?*, who you are, why you're calling, a time, thanks. *Buenos días, habla Sam. Llamo por el apartamento.*\nThe shop: say what you want, then the problem with *es que*. *Quería cambiar esta camisa. Es que me queda pequeña.* *Es que* turns a complaint into an explanation.\nThe desk: a question about something you don't know. *¿Sabe si hay un bus al aeropuerto?* Softer still: *¿Me podría decir…?*\nUse *usted* with strangers, and keep it to the end.\nClose all three politely; none just stops: *Muchas gracias, muy amable.*",
  readAndPick: [
    { q: "Why is Sam calling?", es: "Buenos días, habla Sam. Llamo por el apartamento.",
      options: ["About the apartment", "To ask for Sam", "To pay the rent"], answer: 0,
      why: "*Llamo por*: I'm calling about. *Habla Sam* says who is speaking." },
    { q: "What does *es que* do here?", es: "Quería cambiar estos zapatos. Es que me quedan grandes.",
      options: ["Gives the reason", "Makes it a question", "Asks for money back"], answer: 0,
      why: "*Es que*: the thing is. It explains the problem instead of complaining." },
    { q: "Does Thursday work?", es: "¿Le sirve el jueves a las seis?\nSí, perfecto.",
      options: ["Yes, it does", "No", "Maybe Friday instead"], answer: 0,
      why: "*¿Le sirve…?*: does it work for you. *Perfecto*: yes." },
    { q: "What does the assistant ask for?", es: "¿Tiene la factura?",
      options: ["The receipt", "Your size", "Your card"], answer: 0,
      why: "*La factura*: the receipt, needed to change something." },
    { q: "Is Sam asking for a fact, or a favour?", es: "¿Sabe si hay un bus al aeropuerto?",
      options: ["A fact", "A favour", "A price"], answer: 0,
      why: "*¿Sabe si…?*: do you know if. He needs a piece of information." }
  ],
  yourTurn: [
    { en: "Good morning, this is Sam. I'm calling about the apartment.", es: "Buenos días, habla Sam. Llamo por el apartamento.", accept: ["Buenos días, soy Sam. Llamo por el apartamento."] },
    { en: "I'd like to exchange this shirt. The thing is, it's too small.", es: "Quería cambiar esta camisa. Es que me queda pequeña.", accept: [] },
    { en: "Excuse me, do you know if there's a bus to the airport?", es: "Disculpe, ¿sabe si hay un bus al aeropuerto?", accept: ["Perdone, ¿sabe si hay un bus al aeropuerto?"] },
    { en: "Thank you very much, that's very kind.", es: "Muchas gracias, muy amable.", accept: [] }
  ],
  personal: {
    prompt: "Write the shop exchange: you want to return or change something, and *es que* gives the problem. Add the assistant's reply, and close politely.",
    constraints: [
      { type: "containsWord", word: "quería", label: "what you want, with *quería*" },
      { type: "containsWord", word: "es que", label: "the problem, with *es que*" },
      { type: "containsAny", words: ["gracias", "muy amable"], label: "a polite close" }
    ],
    model: "Quería cambiar este suéter. Es que me queda grande. Claro, ¿tiene la factura? Sí, aquí está. Muchas gracias, muy amable."
  },
  pitfalls: [
    "*Llamo para el apartamento* is a slip: calling about something is *llamo por*.",
    "Don't drop *usted* halfway: if you opened with *¿Sabe…?*, keep *¿Me podría…?*",
    "Close it. A call or a return that just stops sounds rude."
  ]
},

/* ---- unit 23 · Reasons and conditions ---------------------------------- */

"gr-causales-a2": {
  source: "merged",
  hook: {
    line: "Sam missed Laura's party and owes her an explanation. A reason can come after the news with *porque*, or before it with *como*, and only one of them can move.",
    es: "Laura: ¿Por qué no viniste anoche?\nSam: Porque estaba enfermo.\nSam: Y como no tenía tu número, no te pude llamar.",
    en: "Laura: Why didn't you come last night?\nSam: Because I was ill.\nSam: And since I didn't have your number, I couldn't call you."
  },
  examples: [
    { es: "Llegamos tarde porque había mucho trancón.", en: "We were late because there was a lot of traffic." },
    { es: "No fui por la lluvia.", en: "I didn't go because of the rain." },
    { es: "Estoy cansado, así que me voy a la casa.", en: "I'm tired, so I'm going home." }
  ],
  rule: "Two words give the reason:\n*porque*, because, after the news: *No fui porque estaba enfermo.*\n*como*, since, at the very start: *Como estaba enfermo, no fui.*\n*Como* only works at the front. If the reason comes second, switch to *porque*.\nA short reason with no verb takes *por*: *No fui por la lluvia*, because of the rain.\nTwo words give the result, after a comma:\n*por eso*: that's why. *Estaba enfermo, por eso no fui.*\n*así que*: so. *Estoy cansado, así que me voy.*\nThe question is two words with a mark: *¿Por qué?* The answer is one word with none: *porque*.",
  readAndPick: [
    { q: "Why didn't Diego come?", es: "Diego no vino porque tenía que trabajar.",
      options: ["He had to work", "He was ill", "He forgot"], answer: 0,
      why: "*Porque* brings the reason, after the news." },
    { q: "Which line is right?", es: "Como llovía, no salimos.\nNo salimos, como llovía.",
      options: ["The first", "The second", "Both of them"], answer: 0,
      why: "*Como* only works at the front. Second, it has to be *porque*." },
    { q: "What is the result?", es: "No tenía plata, por eso no fui.",
      options: ["He didn't go", "He had no money", "He went"], answer: 0,
      why: "*Por eso*: that's why. What comes after it is the result." },
    { q: "What made them late?", es: "Llegamos tarde por el trancón.",
      options: ["The traffic", "The rain", "Their car"], answer: 0,
      why: "*Por* plus a thing: because of. A *trancón* is a traffic jam." },
    { q: "Is Laura asking or answering?", es: "¿Por qué estás tan cansado?",
      options: ["Asking why", "Giving a reason", "Saying so"], answer: 0,
      why: "*Por qué*, two words with a mark, asks why. *Porque* answers." }
  ],
  yourTurn: [
    { en: "I didn't go because I was ill.", es: "No fui porque estaba enfermo.", accept: ["No fui porque estaba enferma."] },
    { en: "Since it was raining, we didn't go out.", es: "Como llovía, no salimos.", accept: [] },
    { en: "I didn't go because of the rain.", es: "No fui por la lluvia.", accept: [] },
    { en: "I'm tired, so I'm going home.", es: "Estoy cansado, así que me voy a la casa.", accept: ["Estoy cansada, así que me voy a la casa.", "Estoy cansado, así que me voy a casa.", "Estoy cansada, así que me voy a casa."] },
    { en: "I didn't have any money, that's why I didn't go.", es: "No tenía plata, por eso no fui.", accept: ["No tenía dinero, por eso no fui."] }
  ],
  personal: {
    prompt: "Explain why you missed something lately: once with *porque*, and once starting with *como*.",
    constraints: [
      { type: "containsWord", word: "porque", label: "the reason after the news, with *porque*" },
      { type: "regex", pattern: "(^|[.!?]\\s*)como\\s+[^.?!]+,", label: "a sentence that opens with *como*, then a comma" }
    ],
    model: "No fui al gimnasio porque estaba cansado. Como llovía, me quedé en la casa."
  },
  pitfalls: [
    "*Como* never comes second: *No salimos porque llovía*, not *No salimos, como llovía*.",
    "*¿Porque estás cansado?* is a slip: the question is *¿Por qué…?*",
    "*Así* alone means “like this”. For “so”, *así que*."
  ]
},

"por-para": {
  source: "merged",
  hook: {
    line: "English says “for” for nearly everything. At the bus terminal at dawn, Diego hands Sam a bag of arepas, and a few lines need both Spanish words.",
    es: "Diego: Toma, son para el viaje.\nSam: ¡Gracias por todo, Diego!\nSam: Salgo para Medellín a las seis. El bus pasa por Honda.",
    en: "Diego: Here, these are for the trip.\nSam: Thanks for everything, Diego!\nSam: I'm leaving for Medellín at six. The bus goes through Honda."
  },
  examples: [
    { es: "Este regalo es para ti.", en: "This present is for you. (to a friend)" },
    { es: "Pagué cien mil pesos por el tiquete.", en: "I paid a hundred thousand pesos for the ticket." },
    { es: "Necesito el informe para el lunes.", en: "I need the report by Monday." }
  ],
  rule: "Ask one question: is it the target?\n*para* points at a target:\nwho gets it: *Es para ti.*\nwhere it's heading: *Salgo para Medellín.*\nwhat it's for, often with the dictionary form: *Estudio para trabajar aquí.*\nwhen it's due: *Es para el lunes.*\n*por* is everything else:\nthe reason: *No vino por la lluvia.*\nthe route: *El bus pasa por Honda.*\nthe swap or the price: *Pagué cien mil por el tiquete.*\nthe rate: *treinta mil por persona*\nthe way: *por teléfono*\nSome you learn whole: *gracias por, por favor, por la mañana, por fin*.\nThe test: draw an arrow from the action. If it ends right there, *para*.",
  readAndPick: [
    { q: "Who gets the present?", es: "Este regalo es para Laura.",
      options: ["Laura", "The speaker", "Laura's mom"], answer: 0,
      why: "*Para* points at who gets it." },
    { q: "Is the bus going to Honda, or through it?", es: "El bus pasa por Honda.",
      options: ["Through it", "To it", "Away from it"], answer: 0,
      why: "*Por* plus a place: through it, on the way." },
    { q: "When is the report due?", es: "Necesito el informe para el viernes.",
      options: ["By Friday", "Every Friday", "Since last Friday"], answer: 0,
      why: "*Para* plus a day: the deadline." },
    { q: "Why didn't Ana come?", es: "Ana no vino por la lluvia.",
      options: ["Because of the rain", "To rest at home", "She forgot"], answer: 0,
      why: "*Por* plus a reason: because of." },
    { q: "How much is it for two people?", es: "Son treinta mil por persona.",
      options: ["Sixty thousand", "Thirty thousand", "Fifteen thousand"], answer: 0,
      why: "*Por persona*: per person. Two people, sixty thousand." },
    { q: "Why is Sam studying Spanish?", es: "Estudio español para trabajar en Bogotá.",
      options: ["To work in Bogotá", "Because of work", "While in Bogotá"], answer: 0,
      why: "*Para* plus the dictionary form: the goal he is aiming at." }
  ],
  yourTurn: [
    { en: "Thanks for the present.", es: "Gracias por el regalo.", accept: [] },
    { en: "This present is for you. (to a friend)", es: "Este regalo es para ti.", accept: [] },
    { en: "I'm leaving for Medellín on Friday.", es: "Salgo para Medellín el viernes.", accept: ["Me voy para Medellín el viernes."] },
    { en: "I paid fifty thousand pesos for the ticket.", es: "Pagué cincuenta mil pesos por el tiquete.", accept: [] },
    { en: "I need it by Monday.", es: "Lo necesito para el lunes.", accept: [] }
  ],
  personal: {
    prompt: "Think of something you bought for someone. Say who it was for, and what you paid for it.",
    constraints: [
      { type: "regex", pattern: "\\bpara\\s+\\S+", label: "who it was for, with *para*" },
      { type: "regex", pattern: "\\bpor\\s+\\S+", label: "what you paid for it, with *por*" }
    ],
    model: "Compré un libro para mi hermana. Pagué cuarenta mil pesos por él."
  },
  pitfalls: [
    "Thanks is always *gracias por*.",
    "Paying for something is a swap: *pagué… por el tiquete*, never *para*.",
    "Some verbs already have “for” inside: *busco a Laura*, *espero el bus*, *pedí la cuenta*. No *por*, no *para*."
  ]
},

"gr-condicionales-a2": {
  source: "merged",
  hook: {
    line: "This weekend everybody wants Sam somewhere, and every plan comes with a condition. Spanish hangs each one on *si*, and keeps both halves in the present.",
    es: "Laura: Si llueve, no vamos a la finca.\nDiego: Si quieres, vamos a cine.\nAna: Y si tienes tiempo el domingo, ven a almorzar.",
    en: "Laura: If it rains, we're not going to the farm.\nDiego: If you want, we'll go to the cinema.\nAna: And if you have time on Sunday, come for lunch."
  },
  examples: [
    { es: "Si no entiendes, pregúntame.", en: "If you don't understand, ask me. (to a friend)" },
    { es: "Si hace sol, vamos a ir a la playa.", en: "If it's sunny, we're going to go to the beach." },
    { es: "Te llamo si llego tarde.", en: "I'll call you if I'm late. (to a friend)" }
  ],
  rule: "*Si* plus the plain present sets the condition: *si llueve, si quieres, si tienes tiempo*.\nThe other half can be:\nthe present: *Si llueve, no vamos.*\n*ir a* plus the dictionary form: *Si llueve, vamos a ver una película.*\na command: *Si tienes tiempo, ven.*\nEnglish says “we'll go”; Spanish is happy with *vamos*. That is normal, not lazy.\nThe *si* half can come first, with a comma, or second, with none: *Te llamo si llego tarde.*\nAfter *si* comes a verb with a person in it, never the dictionary form: *si llueve*, not *si llover*.\nSpelling: *si* with no mark is “if”. *Sí* with a mark is “yes”.",
  readAndPick: [
    { q: "Are they going to the farm?", es: "Si llueve, no vamos a la finca.",
      options: ["Only if it's dry", "Yes, rain or shine", "No, not at all"], answer: 0,
      why: "*Si llueve*: if it rains. The trip hangs on the weather." },
    { q: "What does Diego want Sam to do if he has time?", es: "Si tienes tiempo, ven al parque.",
      options: ["Come to the park", "Call him later", "Stay at home"], answer: 0,
      why: "The other half is a command: *ven*, come." },
    { q: "Which word means yes?", es: "Sí, si quieres vamos mañana.",
      options: ["The first one", "The second", "Neither of them"], answer: 0,
      why: "*Sí*, with a mark, is yes. *Si*, with none, is if." },
    { q: "When will Laura call?", es: "Te llamo si llego tarde.",
      options: ["If she's late", "When she gets there", "Every night"], answer: 0,
      why: "*Si llego tarde*: if I'm late. The *si* half can come second, with no comma." },
    { q: "Is the beach trip certain?", es: "Si hace sol, vamos a ir a la playa.",
      options: ["No, it depends", "Yes, they've decided", "No, it's off"], answer: 0,
      why: "*Si hace sol*: it depends on the sun." }
  ],
  yourTurn: [
    { en: "If you want, we'll go to the cinema. (to a friend)", es: "Si quieres, vamos a cine.", accept: ["Si quieres, vamos al cine.", "Si quieres, vamos a ir a cine.", "Si quieres, vamos a ir al cine."] },
    { en: "If it rains, we'll stay at home.", es: "Si llueve, nos quedamos en la casa.", accept: ["Si llueve, nos quedamos en casa."] },
    { en: "If you don't understand, ask me. (to a friend)", es: "Si no entiendes, pregúntame.", accept: ["Si no entiendes, me preguntas."] },
    { en: "I'll call you if I'm late. (to a friend)", es: "Te llamo si llego tarde.", accept: [] },
    { en: "If you have time, come to the café. (to a friend)", es: "Si tienes tiempo, ven al café.", accept: [] }
  ],
  personal: {
    prompt: "Write two plans for this weekend that depend on something: the weather, money, time.",
    constraints: [
      { type: "regex", pattern: "\\bsi\\s+\\S+", label: "a condition with *si*" },
      { type: "minSentences", n: 2, label: "two plans, two sentences" }
    ],
    model: "Si hace sol, voy a caminar por el parque. Si llueve, me quedo en la casa y leo."
  },
  pitfalls: [
    "*Si llover* is a slip: after *si*, a verb with a person in it, *si llueve*.",
    "“If” has no mark: *si quieres*. With a mark, *sí* is “yes”.",
    "For things that might really happen, the present does it: *si tengo tiempo, voy*."
  ]
},

"fn-aconsejar-a2": {
  source: "merged",
  hook: {
    line: "Diego looks exhausted, and Laura has advice, from a gentle option to a firm push. Then she does what Colombians do when a friend is struggling: she offers to help before he asks.",
    es: "Laura: Diego, trabajas demasiado. Tienes que descansar.\nLaura: Puedes tomar unos días libres.\nLaura: ¿Te ayudo con el informe?",
    en: "Laura: Diego, you work too much. You have to rest.\nLaura: You could take a few days off.\nLaura: Shall I help you with the report?"
  },
  examples: [
    { es: "Debes ir al médico.", en: "You should go to the doctor. (to a friend)" },
    { es: "Hay que dormir ocho horas.", en: "You need eight hours of sleep. (anyone)" },
    { es: "Señora, ¿le ayudo con las bolsas?", en: "Madam, shall I help you with the bags?" }
  ],
  rule: "Advice comes in steps, from soft to firm:\n*puedes*: an option. *Puedes tomar unos días.*\n*debes*: what's right. *Debes ir al médico.*\n*tienes que*: a push. *Tienes que descansar.*\n*hay que*: a rule for anyone, pointing at nobody. *Hay que dormir más.*\n*lo mejor es*: the best thing is. *Lo mejor es esperar.*\nAll of them take the dictionary form next.\nA command with a reason after it sounds like care, not an order: *Come algo. Estás muy pálido.*\nThe trap is the no. *No tienes que venir*: you don't need to. *No debes venir*: you shouldn't.\nTo offer help: *¿Te ayudo?* To *usted*: *¿Le ayudo?* Or, taken whole: *¿Quieres que te ayude?*",
  readAndPick: [
    { q: "Which advice points at nobody?", es: "Tienes que estudiar más.\nHay que estudiar más.",
      options: ["The second", "The first", "Both of them"], answer: 0,
      why: "*Hay que* names no one: a rule for everybody." },
    { q: "Does Sam have to come?", es: "No tienes que venir.",
      options: ["He doesn't need to", "He mustn't come at all", "Yes, he really must"], answer: 0,
      why: "*No tienes que*: you don't need to. You mustn't would be *no debes*." },
    { q: "How firm is this advice?", es: "Puedes tomar un taxi.",
      options: ["Just an option", "A firm push", "A rule for all"], answer: 0,
      why: "*Puedes*: you could. The softest step." },
    { q: "What is Diego offering the lady?", es: "Señora, ¿le ayudo con las bolsas?",
      options: ["To carry her bags", "To sell her bags", "To find her bags"], answer: 0,
      why: "*¿Le ayudo?*: shall I help you. *Le* for *usted*." },
    { q: "Why does Laura add the second line?", es: "Come algo. Estás muy pálido.",
      options: ["To show she cares", "To give an order", "To change the subject"], answer: 0,
      why: "A reason after a command turns an order into advice." }
  ],
  yourTurn: [
    { en: "You have to rest. (to a friend)", es: "Tienes que descansar.", accept: [] },
    { en: "You should go to the doctor. (to a friend)", es: "Debes ir al médico.", accept: [] },
    { en: "You need to book in advance. (anyone)", es: "Hay que reservar antes.", accept: ["Hay que reservar con tiempo."] },
    { en: "Shall I help you? (to a friend)", es: "¿Te ayudo?", accept: ["¿Quieres que te ayude?"] },
    { en: "You don't need to come. (to a friend)", es: "No tienes que venir.", accept: [] }
  ],
  personal: {
    prompt: "A friend says *Estoy muy cansado y tengo mucho trabajo.* Give two pieces of advice at different strengths, and offer to help.",
    constraints: [
      { type: "containsAny", words: ["puedes", "debes", "lo mejor es"], label: "a softer step: *puedes…*, *debes…*" },
      { type: "containsAny", words: ["tienes que", "hay que"], label: "a firmer step: *tienes que…* or *hay que…*" },
      { type: "containsAny", words: ["te ayudo", "le ayudo", "que te ayude"], label: "an offer: *¿Te ayudo?*" }
    ],
    model: "Puedes dormir un poco más. Tienes que trabajar menos. ¿Te ayudo con algo?"
  },
  pitfalls: [
    "*No tienes que* is you don't need to. For you mustn't, say *no debes*.",
    "*Hay que* never takes a person: *Hay que pagar*, not *Yo hay que pagar*.",
    "Don't wait to be asked. With heavy bags or someone who looks lost, Colombians offer straight away: *¿Le ayudo?*"
  ]
},

"fn-proponer-sugerir-a2": {
  source: "merged",
  hook: {
    line: "Friday afternoon, and nobody has a plan. In Bogotá the first question is *¿Qué plan?*, and the answers are gentle proposals, never orders.",
    es: "Diego: ¿Qué plan para hoy?\nLaura: ¿Qué tal si vamos a cine?\nSam: ¿Y por qué no comemos algo primero?\nDiego: ¡Listo, dale!",
    en: "Diego: What's the plan for today?\nLaura: How about we go to the cinema?\nSam: And why don't we get something to eat first?\nDiego: Great, let's do it!"
  },
  examples: [
    { es: "¿Nos vemos el sábado a las ocho?", en: "Shall we meet on Saturday at eight?" },
    { es: "¿Y si pedimos una pizza?", en: "What if we order a pizza?" },
    { es: "Sí, pero más tarde. Primero tengo que terminar esto.", en: "Yes, but later. First I have to finish this." }
  ],
  rule: "Most proposals use the we form, so you're in the plan too: *¿Vamos a bailar? ¿Nos vemos el viernes?*\nThree softer openers, with the plain present after them:\n*¿Qué tal si…?* how about…: *¿Qué tal si vamos a cine?*\n*¿Por qué no…?* why don't we…: *¿Por qué no comemos algo?*\n*¿Y si…?* what if…: *¿Y si pedimos una pizza?*\nEnglish says “how about going”; Spanish needs a verb with a person: *si vamos*.\nIn the past, *¿Por qué no viniste?* is a real question, often a complaint.\nTo accept: *¡Listo! ¡Dale! Me parece bien.*\nYes, with a condition: *Sí, pero más tarde.* That is still a yes.\nTo decline: *Qué pena, no puedo. ¿Otro día?*",
  readAndPick: [
    { q: "Who is in Laura's plan?", es: "¿Vamos a bailar el sábado?",
      options: ["Both of them", "Only Laura", "Only her friend"], answer: 0,
      why: "*Vamos*: we. A proposal that includes the speaker." },
    { q: "Is Sam asking why, or proposing?", es: "¿Por qué no tomamos un tinto?",
      options: ["Proposing", "Asking why", "Complaining"], answer: 0,
      why: "*¿Por qué no…?* with the present: a suggestion, not a real why." },
    { q: "Is this a real question, or a plan?", es: "¿Por qué no viniste a la fiesta?",
      options: ["A real question", "A plan for later", "An invitation"], answer: 0,
      why: "In the past, *¿por qué no…?* really asks why. Often a complaint." },
    { q: "Did Ana say yes?", es: "Sí, pero más tarde.",
      options: ["Yes, on her terms", "No, politely", "She didn't answer"], answer: 0,
      why: "A condition after *pero* is still a yes." },
    { q: "What does Diego want to know?", es: "¿Qué plan para hoy?",
      options: ["What we're doing", "If you like plans", "What time it is"], answer: 0,
      why: "*¿Qué plan?*: Colombian for what are we doing." }
  ],
  yourTurn: [
    { en: "How about we go to the cinema?", es: "¿Qué tal si vamos a cine?", accept: ["¿Qué tal si vamos al cine?"] },
    { en: "Why don't we have a coffee?", es: "¿Por qué no tomamos un tinto?", accept: ["¿Por qué no tomamos un café?"] },
    { en: "What if we order a pizza?", es: "¿Y si pedimos una pizza?", accept: [] },
    { en: "Shall we meet on Friday?", es: "¿Nos vemos el viernes?", accept: [] },
    { en: "Yes, but later.", es: "Sí, pero más tarde.", accept: [] }
  ],
  personal: {
    prompt: "Propose a plan for this weekend to a friend, gently, with *¿Qué tal si…?* or *¿Por qué no…?*, and write their answer.",
    constraints: [
      { type: "containsAny", words: ["qué tal si", "por qué no", "y si"], label: "*¿Qué tal si…?*, *¿Por qué no…?* or *¿Y si…?*" },
      { type: "question", label: "as a question, with *¿* and *?*" },
      { type: "containsAny", words: ["listo", "dale", "me parece bien", "claro", "qué pena", "pero"], label: "their answer: *¡Listo!*, *Sí, pero…*, *Qué pena…*" }
    ],
    model: "¿Qué tal si vamos a Monserrate el domingo? ¡Listo, dale!"
  },
  pitfalls: [
    "English “how about going” is not *yendo*: *¿Qué tal si vamos?*",
    "*¿Por qué no fuimos?* is a real question about the past. To suggest, the present: *¿Por qué no vamos?*",
    "*Sí, pero más tarde* means you're coming. Don't read a condition as a no."
  ]
},

"task-a2-razones": {
  source: "old",
  hook: {
    line: "Up to now you have said what is. This week ends with why: a real decision you made, three reasons for it, what it was for, and advice for someone in the same spot.",
    es: "El año pasado dejé mi trabajo en Toronto.\nLo dejé porque estaba cansado y no aprendía nada nuevo.\nVine a Bogotá para estudiar español.",
    en: "Last year I left my job in Toronto.\nI left it because I was tired and I wasn't learning anything new.\nI came to Bogotá to study Spanish."
  },
  examples: [
    { es: "Como el apartamento era muy caro, buscamos otro.", en: "Since the apartment was very expensive, we looked for another one." },
    { es: "Si me ofrecen un buen trabajo aquí, me quedo.", en: "If they offer me a good job here, I'll stay." },
    { es: "Mi consejo: lo mejor es ahorrar primero.", en: "My advice: the best thing is to save first." }
  ],
  rule: "Explain one real decision in ten to fourteen sentences.\nSay what you decided, in the event past: *Dejé mi trabajo. Me fui de Toronto.*\nGive at least three reasons, with *porque* after the news or *como* at the start. Reasons often describe how things were: *porque estaba cansado*.\nGive one goal with *para* plus the dictionary form: *para estudiar español*.\nAdd one condition with *si*: *Si me ofrecen un trabajo aquí, me quedo.*\nClose by advising someone in the same spot: *Lo mejor es ahorrar primero. ¿Por qué no lo intentas?*\nKeep *porque* for the reason and *para* for the goal: *Estudio porque me gusta. Estudio para trabajar aquí.*",
  readAndPick: [
    { q: "Is this a reason, or a goal?", es: "Estudio español para trabajar en Bogotá.",
      options: ["A goal", "A reason", "A condition"], answer: 0,
      why: "*Para* plus the dictionary form: what he is aiming at." },
    { q: "Is this a reason, or a goal?", es: "Lo dejé porque estaba cansado.",
      options: ["A reason", "A goal", "A condition"], answer: 0,
      why: "*Porque*: the cause behind it." },
    { q: "Will Sam stay?", es: "Si me ofrecen un buen trabajo aquí, me quedo.",
      options: ["Only with a job", "Yes, he's decided", "No, he's leaving"], answer: 0,
      why: "*Si*: the stay depends on the offer." },
    { q: "What is Laura doing in this line?", es: "Lo mejor es ahorrar primero.",
      options: ["Giving advice", "Giving a reason", "Telling a story"], answer: 0,
      why: "*Lo mejor es*: the best thing is. Advice for someone else." },
    { q: "Why did they look for another apartment?", es: "Como el apartamento era muy caro, buscamos otro.",
      options: ["It cost too much", "It was too small", "It was far away"], answer: 0,
      why: "*Como* opens with the reason: it was very expensive." }
  ],
  yourTurn: [
    { en: "I left it because I was tired. (my job)", es: "Lo dejé porque estaba cansado.", accept: ["Lo dejé porque estaba cansada."] },
    { en: "I came to Bogotá to study Spanish.", es: "Vine a Bogotá para estudiar español.", accept: ["Vine a Bogotá a estudiar español."] },
    { en: "If they offer me a good job here, I'll stay.", es: "Si me ofrecen un buen trabajo aquí, me quedo.", accept: ["Si me ofrecen un buen trabajo acá, me quedo."] },
    { en: "The best thing is to save first.", es: "Lo mejor es ahorrar primero.", accept: [] }
  ],
  personal: {
    prompt: "Explain one real decision in a few lines: what you decided, one reason with *porque*, one goal with *para*, and one piece of advice for someone else.",
    constraints: [
      { type: "containsWord", word: "porque", label: "a reason, with *porque*" },
      { type: "regex", pattern: "\\bpara\\s+\\S+(ar|er|ir)\\b", label: "a goal: *para* plus the dictionary form" },
      { type: "containsAny", words: ["lo mejor es", "tienes que", "puedes", "por qué no", "hay que", "debes"], label: "advice for someone else: *lo mejor es…*" }
    ],
    model: "Hace dos años empecé a estudiar español. Empecé porque me gusta viajar y para hablar con mis vecinos. Lo mejor es practicar todos los días."
  },
  pitfalls: [
    "*Porque* gives the cause, *para* the goal: *Estudio para trabajar aquí*, not *porque trabajar*.",
    "After *si*, the plain present: *si me ofrecen…*, never a will form.",
    "Reasons usually describe how things were: *estaba cansado*, *no aprendía nada*."
  ]
}

};
