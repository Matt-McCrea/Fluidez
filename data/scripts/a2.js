/* ============================================================================
 * TEACHING SCRIPTS, A2 units a2-u15, a2-u16, a2-u18 and a2-u19
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
}

};
