/* ============================================================================
 * TEACHING SCRIPTS, A2 units a2-u15, a2-u16, a2-u18 to a2-u26
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
 *   translate   [{ en, es, accept }]        4 more typed translations, English
 *                                           to Spanish, each the exact English
 *                                           of its Spanish, graded the same way
 *   register    [{ es, en, when }]          3, function lessons (fn-) only: with
 *                                           a friend, to usted, at work
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
  translate: [
    { en: "As a boy I lived in Cali and played football in the street.", es: "De niño vivía en Cali y jugaba fútbol en la calle.", accept: ["De niño vivía en Cali y jugaba (al) fútbol en la calle.", "Cuando era niño, vivía en Cali y jugaba (al) fútbol en la calle."] },
    { en: "My dad used to cook on Saturdays.", es: "Mi papá cocinaba los sábados.", accept: ["Mi [papá|padre] cocinaba los sábados.", "Los sábados mi [papá|padre] cocinaba."] },
    { en: "Did you use to go to school by bus? (to a friend)", es: "¿Ibas al colegio en bus?", accept: [] },
    { en: "There was no internet in the village.", es: "En el pueblo no había internet.", accept: ["No había internet en el pueblo."] }
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
  translate: [
    { en: "Laura got here a while ago.", es: "Laura llegó hace rato.", accept: ["Laura llegó hace (un) rato."] },
    { en: "I've been studying Spanish for two months.", es: "Estudio español desde hace dos meses.", accept: ["Hace dos meses que estudio español."] },
    { en: "The café opens Monday to Saturday.", es: "El café abre de lunes a sábado.", accept: [] },
    { en: "She left ten minutes ago.", es: "Se fue hace diez minutos.", accept: [] }
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
  translate: [
    { en: "I have a black coffee twice a day.", es: "Tomo tinto dos veces al día.", accept: ["Tomo (un) tinto dos veces al día."] },
    { en: "I buy a pound of coffee every week.", es: "Compro una libra de café cada semana.", accept: ["Compro una libra de café [cada semana|todas las semanas]."] },
    { en: "Ana goes to the pool twice a week.", es: "Ana va a la piscina dos veces a la semana.", accept: [] },
    { en: "I used to go to the gym three times a week. Now I go once a month.", es: "Antes iba al gimnasio tres veces a la semana. Ahora voy una vez al mes.", accept: ["(Antes) iba al gimnasio tres veces a la semana. Ahora voy una vez al mes."] }
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
  translate: [
    { en: "The house was old and had a big yard.", es: "La casa era vieja y tenía un patio grande.", accept: [] },
    { en: "I had a dog called Toco.", es: "Tenía un perro que se llamaba Toco.", accept: [] },
    { en: "I didn't use to like coffee. Now I drink it every day.", es: "Antes no me gustaba el café. Ahora lo tomo todos los días.", accept: ["(Antes) no me gustaba el café. Ahora lo tomo todos los días."] },
    { en: "On Saturdays we used to go to the river.", es: "Los sábados íbamos al río.", accept: ["Íbamos al río los sábados."] }
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
  translate: [
    { en: "Suddenly the power went out.", es: "De repente se fue la luz.", accept: [] },
    { en: "It rained all night.", es: "Llovió toda la noche.", accept: [] },
    { en: "Ana was talking on the phone when Diego came in.", es: "Ana hablaba por teléfono cuando entró Diego.", accept: ["Ana hablaba por teléfono cuando Diego entró."] },
    { en: "It was eleven o'clock and there was nobody in the street.", es: "Eran las once y no había nadie en la calle.", accept: [] }
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
  translate: [
    { en: "Once I missed the last bus.", es: "Una vez perdí el último bus.", accept: [] },
    { en: "It was Sunday and we were in the park.", es: "Era domingo y estábamos en el parque.", accept: [] },
    { en: "Suddenly someone shouted my name.", es: "De repente, alguien gritó mi nombre.", accept: [] },
    { en: "Anyway, we didn't go to the party.", es: "Total, que no fuimos a la fiesta.", accept: [] }
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
  translate: [
    { en: "I didn't have any money. That's why I didn't go.", es: "No tenía plata. Por eso no fui.", accept: ["No tenía [plata|dinero]. Por eso no fui."] },
    { en: "What's more, the hotel was really cheap.", es: "Además, el hotel era muy barato.", accept: [] },
    { en: "Diego never cooks.", es: "Diego no cocina nunca.", accept: ["Diego nunca cocina."] },
    { en: "Finally, we put everything away in the car.", es: "Por último, guardamos todo en el carro.", accept: ["[Por último|Al final], guardamos todo en el carro."] }
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
  translate: [
    { en: "In the end it was a really lovely day.", es: "Al final fue un día muy bonito.", accept: ["Al final fue un día muy [bonito|lindo]."] },
    { en: "It was late, it was raining and we went out.", es: "Era tarde, llovía y salimos.", accept: [] },
    { en: "It was Sunday and it was very hot.", es: "Era domingo y hacía mucho calor.", accept: [] },
    { en: "I was in the park with my sister when it started to rain.", es: "Estaba en el parque con mi hermana cuando empezó a llover.", accept: [] }
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
  translate: [
    { en: "Did you write to your mom? (to a friend)", es: "¿Le escribiste a tu mamá?", accept: ["¿Le escribiste a tu [mamá|madre]?"] },
    { en: "Yes, I sent her a message last night.", es: "Sí, le mandé un mensaje anoche.", accept: ["Sí, le [mandé|envié] un mensaje anoche."] },
    { en: "I gave the neighbours my number.", es: "Les di mi número a los vecinos.", accept: ["Les di a los vecinos mi número."] },
    { en: "They stole Diego's wallet.", es: "Le robaron la billetera a Diego.", accept: ["A Diego le robaron la billetera."] }
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
  translate: [
    { en: "The key? I already gave it to your mom.", es: "¿La llave? Ya se la di a tu mamá.", accept: ["¿La llave? Ya se la di a tu [mamá|madre]."] },
    { en: "I saw him on the corner and told him the truth.", es: "Lo vi en la esquina y le dije la verdad.", accept: [] },
    { en: "I explained it to him twice.", es: "Se lo expliqué dos veces.", accept: [] },
    { en: "The photos? She sent them to me yesterday.", es: "¿Las fotos? Me las mandó ayer.", accept: ["¿Las fotos? Me las [mandó|envió] ayer."] }
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
  translate: [
    { en: "I can't live without you. (to your partner)", es: "No puedo vivir sin ti.", accept: [] },
    { en: "She loves jazz; I love rock.", es: "A ella le encanta el jazz; a mí, el rock.", accept: ["A ella le encanta el jazz y a mí me encanta el rock."] },
    { en: "Is there a message for me?", es: "¿Hay un mensaje para mí?", accept: ["¿Hay [un|algún] mensaje para mí?"] },
    { en: "Diego is going with me.", es: "Diego va conmigo.", accept: [] }
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
  translate: [
    { en: "No, mine is the red one. (the suitcase)", es: "No, la mía es la roja.", accept: [] },
    { en: "Our house is small, but theirs is huge.", es: "Nuestra casa es pequeña, pero la suya es enorme.", accept: ["Nuestra casa es pequeña, pero la de ellos es enorme."] },
    { en: "The suitcase? It's mine.", es: "¿La maleta? Es mía.", accept: [] },
    { en: "Whose is it? Mine. (the book)", es: "¿De quién es? Mío.", accept: ["¿De quién es? Es mío."] }
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
  translate: [
    { en: "The cake? I made it.", es: "¿La torta? La hice yo.", accept: [] },
    { en: "I'm going to call her tomorrow.", es: "Voy a llamarla mañana.", accept: ["La voy a llamar mañana."] },
    { en: "I bought a shirt on Saturday and I wear it a lot.", es: "Compré una camisa el sábado y la uso mucho.", accept: ["El sábado compré una camisa y la uso mucho."] },
    { en: "I gave the book to Ana. I gave it to her on Monday.", es: "Le di el libro a Ana. Se lo di el lunes.", accept: ["Le di el libro a Ana. El lunes se lo di."] }
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
  translate: [
    { en: "Leave early and catch the bus at the corner. (to a friend)", es: "Sal temprano y toma el bus en la esquina.", accept: [] },
    { en: "Wait here, please. (polite)", es: "Espere aquí, por favor.", accept: ["Espere [aquí|acá], por favor."] },
    { en: "Come early, please. (to a group)", es: "Vengan temprano, por favor.", accept: [] },
    { en: "Go on two blocks and catch the bus at the corner. (polite)", es: "Siga dos cuadras y tome el bus en la esquina.", accept: [] }
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
  translate: [
    { en: "Can you bring me a glass of water? (to a friend)", es: "¿Me traes un vaso de agua?", accept: [] },
    { en: "You have to pay at the till. (nobody named)", es: "Hay que pagar en la caja.", accept: [] },
    { en: "Could you turn the volume down a little? (polite)", es: "¿Podría bajar un poco el volumen?", accept: ["¿Podría bajar el volumen un poco?", "¿Me podría bajar un poco el volumen?"] },
    { en: "Oh, I haven't got a pen.", es: "Uy, no tengo lapicero.", accept: ["Uy, no tengo [lapicero|esfero]."] }
  ],
  register: [
    { es: "¿Me prestas un lapicero?", en: "Can you lend me a pen?", when: "with a friend" },
    { es: "¿Me hace el favor de prestarme un lapicero?", en: "Would you mind lending me a pen?", when: "to someone you call usted" },
    { es: "¿Me podría enviar el documento, por favor?", en: "Could you send me the document, please?", when: "in a message or at work" }
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
  translate: [
    { en: "Fine, all right, but I'll be late.", es: "Bueno, está bien, pero llego tarde.", accept: ["Bueno, está bien, pero voy a llegar tarde."] },
    { en: "I'm so sorry, but I can't. The thing is, I have an appointment.", es: "Qué pena, pero no puedo. Es que tengo una cita.", accept: ["[Qué pena|Lo siento], pero no puedo. Es que tengo una cita."] },
    { en: "Will you help me with the suitcases? (to a friend)", es: "¿Me ayudas con las maletas?", accept: [] },
    { en: "Yes, of course, no problem.", es: "Sí, claro, sin problema.", accept: ["Sí, claro, no hay problema."] }
  ],
  register: [
    { es: "Listo, dale.", en: "OK, sure.", when: "with a friend" },
    { es: "Claro que sí, con mucho gusto.", en: "Of course, happy to.", when: "to someone you call usted" },
    { es: "Con gusto, se lo envío hoy.", en: "Happy to, I'll send it to you today.", when: "in a message or at work" }
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
  translate: [
    { en: "Wow, it's really cold in here.", es: "Uy, aquí hace mucho frío.", accept: [] },
    { en: "We need to study more. (nobody named)", es: "Hay que estudiar más.", accept: [] },
    { en: "You have to wear a tie. (nobody named)", es: "Hay que llevar corbata.", accept: ["Hay que [llevar|usar] corbata."] },
    { en: "You can't park here.", es: "Aquí no se puede parquear.", accept: ["Aquí no se puede [parquear|estacionar]."] }
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
  translate: [
    { en: "First, fill the tank with water. (to a friend)", es: "Primero, llena el tanque de agua.", accept: [] },
    { en: "Then type your number and wait for the message. (polite)", es: "Después, escriba su número y espere el mensaje.", accept: ["[Después|Luego], escriba su número y espere el mensaje."] },
    { en: "Press the button for three seconds. (to a friend)", es: "Aprieta el botón durante tres segundos.", accept: ["Aprieta el botón (durante) tres segundos."] },
    { en: "Finally, save the changes. (to a friend)", es: "Por último, guarda los cambios.", accept: [] }
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
  translate: [
    { en: "Could you help me for a moment? (polite)", es: "¿Podría ayudarme un momento?", accept: ["¿Me podría ayudar un momento?"] },
    { en: "Could you possibly explain this form to me? (the Colombian top step)", es: "¿Será que me puede explicar este formulario?", accept: [] },
    { en: "Pass me the salt. (to your brother)", es: "Pásame la sal.", accept: [] },
    { en: "Will you lend me your car on Saturday? (to a friend)", es: "¿Me prestas tu carro el sábado?", accept: [] }
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
  translate: [
    { en: "You look pale. Are you OK? (to a friend)", es: "Te veo pálido. ¿Estás bien?", accept: ["Te veo [pálido|pálida]. ¿Estás bien?"] },
    { en: "I'm sleepy and my feet hurt.", es: "Tengo sueño y me duelen los pies.", accept: [] },
    { en: "It doesn't hurt any more.", es: "Ya no me duele.", accept: [] },
    { en: "Oh, poor you! Get well soon! (to a friend)", es: "¡Qué pesar! ¡Que te mejores!", accept: ["¡Qué pesar! ¡Que te mejores (pronto)!"] }
  ],
  register: [
    { es: "¿Qué más? ¿Todo bien?", en: "How's it going? All good?", when: "with a friend" },
    { es: "¿Cómo está, señora? ¿Se siente mejor?", en: "How are you, madam? Are you feeling better?", when: "to someone you call usted" },
    { es: "Hola, ¿cómo sigues? ¿Ya te sientes mejor?", en: "Hi, how are you doing? Are you feeling better now?", when: "in a message to a workmate who was ill" }
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
  translate: [
    { en: "Congratulations on the baby!", es: "¡Felicitaciones por el bebé!", accept: ["¡[Felicitaciones|Felicidades] por el bebé!"] },
    { en: "Merry Christmas and happy New Year!", es: "¡Feliz Navidad y feliz año!", accept: ["¡Feliz Navidad y feliz año (nuevo)!"] },
    { en: "Mrs Pérez, congratulations.", es: "Señora Pérez, la felicito.", accept: ["Señora Pérez, [felicitaciones|felicidades]."] },
    { en: "I got the job!", es: "¡Me dieron el trabajo!", accept: [] }
  ],
  register: [
    { es: "¡Qué chévere! ¡Felicitaciones!", en: "How great! Congratulations!", when: "with a friend" },
    { es: "Lo felicito por el trabajo nuevo, señor Gómez.", en: "Congratulations on the new job, Mr Gómez.", when: "to someone you call usted" },
    { es: "¡Felicitaciones a todo el equipo por el proyecto!", en: "Congratulations to the whole team on the project!", when: "in a message or at work" }
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
  translate: [
    { en: "Do you feel like something to drink? (to a friend)", es: "¿Te provoca algo de tomar?", accept: ["¿Te provoca algo [de|para] tomar?"] },
    { en: "Enjoy your meal. Thanks, you too.", es: "Buen provecho. Gracias, igualmente.", accept: [] },
    { en: "Would you like to come to the farm on Saturday? (polite)", es: "¿Le gustaría venir a la finca el sábado?", accept: [] },
    { en: "Do you want a black coffee? (to a friend)", es: "¿Quieres un tinto?", accept: [] }
  ],
  register: [
    { es: "¿Te provoca un tinto?", en: "Fancy a coffee?", when: "with a friend" },
    { es: "¿Le gustaría tomar algo?", en: "Would you like something to drink?", when: "to someone you call usted" },
    { es: "¿Les gustaría almorzar con el equipo el viernes?", en: "Would you all like to have lunch with the team on Friday?", when: "in a message to the people you work with" }
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
  translate: [
    { en: "This ajiaco is delicious!", es: "¡Qué rico este ajiaco!", accept: ["¡Qué rico (está) este ajiaco!"] },
    { en: "It depends. The food isn't bad at all.", es: "Depende. La comida no es nada mala.", accept: [] },
    { en: "Yes, that's true.", es: "Sí, es verdad.", accept: ["Sí, es [verdad|cierto]."] },
    { en: "The shoes are too expensive.", es: "Los zapatos son demasiado caros.", accept: ["Los zapatos están demasiado caros."] }
  ],
  register: [
    { es: "Sí, tienes razón.", en: "Yes, you're right.", when: "with a friend" },
    { es: "Sí, señor, tiene toda la razón.", en: "Yes, sir, you're absolutely right.", when: "to someone you call usted" },
    { es: "Estoy de acuerdo con la propuesta.", en: "I agree with the proposal.", when: "in a message or at a meeting" }
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
  translate: [
    { en: "I'm getting married in June!", es: "¡Me caso en junio!", accept: [] },
    { en: "My dad is in hospital.", es: "Mi papá está en el hospital.", accept: ["Mi [papá|padre] está en el hospital."] },
    { en: "I failed the exam.", es: "Perdí el examen.", accept: ["[Perdí|Reprobé] el examen."] },
    { en: "They raised my pay, but my hours too.", es: "Me subieron el sueldo, pero también las horas.", accept: ["Me subieron el [sueldo|salario], pero también las horas."] }
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
  translate: [
    { en: "It's warmer in Medellín than in Bogotá.", es: "En Medellín hace más calor que en Bogotá.", accept: [] },
    { en: "My brother is less serious than me.", es: "Mi hermano es menos serio que yo.", accept: [] },
    { en: "I don't have as much time as before.", es: "No tengo tanto tiempo como antes.", accept: [] },
    { en: "Ana works as much as her boss.", es: "Ana trabaja tanto como su jefe.", accept: ["Ana trabaja tanto como su [jefe|jefa]."] }
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
  translate: [
    { en: "The table is wooden and the chairs are plastic.", es: "La mesa es de madera y las sillas son de plástico.", accept: [] },
    { en: "What's this ring made of? It's silver.", es: "¿De qué es este anillo? Es de plata.", accept: [] },
    { en: "Laura changed jobs in January.", es: "Laura cambió de trabajo en enero.", accept: [] },
    { en: "Ana changed her mind.", es: "Ana cambió de opinión.", accept: [] }
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
  translate: [
    { en: "I look like my dad, but I have my mom's eyes.", es: "Me parezco a mi papá, pero tengo los ojos de mi mamá.", accept: ["Me parezco a mi [papá|padre], pero tengo los ojos de mi [mamá|madre]."] },
    { en: "Diego looks a lot like his dad.", es: "Diego se parece mucho a su papá.", accept: ["Diego se parece mucho a su [papá|padre]."] },
    { en: "The two sisters aren't alike at all.", es: "Las dos hermanas no se parecen nada.", accept: [] },
    { en: "Once, when I was eight, she took me to see the sea.", es: "Una vez, cuando yo tenía ocho años, me llevó a ver el mar.", accept: ["Una vez, cuando (yo) tenía ocho años, me llevó a ver el mar."] }
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
  translate: [
    { en: "It's made of wood and it has a long handle.", es: "Es de madera y tiene un palo largo.", accept: [] },
    { en: "What's this button for?", es: "¿Para qué sirve este botón?", accept: [] },
    { en: "The big mug is for hot chocolate.", es: "La taza grande sirve para el chocolate.", accept: ["La taza grande [sirve|es] para el chocolate."] },
    { en: "It's for heating up food.", es: "Sirve para calentar la comida.", accept: [] }
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
  translate: [
    { en: "This neighbourhood is less noisy, but it's further away.", es: "Este barrio es menos ruidoso, pero queda más lejos.", accept: ["Este barrio es menos ruidoso, pero [queda|está] más lejos."] },
    { en: "The one on the outskirts has more light.", es: "El de las afueras tiene más luz.", accept: [] },
    { en: "The Chapinero one is more expensive than the one downtown.", es: "El de Chapinero es más caro que el del centro.", accept: [] },
    { en: "The new job is more interesting than the old one, but it pays worse.", es: "El trabajo nuevo es más interesante que el viejo, pero paga peor.", accept: ["El [trabajo nuevo|nuevo trabajo] es más interesante que el [viejo|anterior], pero paga peor."] }
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
  translate: [
    { en: "We have these two. Would you like to try them on? (to a customer)", es: "Tenemos estos dos. ¿Se los quiere medir?", accept: ["Tenemos estos dos. ¿Se los quiere [medir|probar]?", "Tenemos estos dos. ¿Quiere [medírselos|probárselos]?"] },
    { en: "Where's the fitting room?", es: "¿Dónde está el probador?", accept: [] },
    { en: "It's too small for me. (the jacket)", es: "Me queda pequeña.", accept: [] },
    { en: "This one is nicer, but the other one is wool.", es: "Este es más bonito, pero el otro es de lana.", accept: [] }
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
  translate: [
    { en: "Hi, is that Laura?", es: "Buenas, ¿hablo con Laura?", accept: ["[Buenas|Hola], ¿hablo con Laura?"] },
    { en: "She's not in. Would you like to leave her a message? (polite)", es: "No está. ¿Quiere dejarle un mensaje?", accept: ["No está. ¿Le quiere dejar un mensaje?"] },
    { en: "Is Mrs Gómez there?", es: "¿Está la señora Gómez?", accept: [] },
    { en: "Who am I speaking to?", es: "¿Con quién hablo?", accept: [] }
  ],
  register: [
    { es: "Hola, ¿qué más? Cuéntame.", en: "Hi, what's up? Tell me.", when: "with a friend" },
    { es: "Buenas tardes, ¿con quién tengo el gusto?", en: "Good afternoon, who am I speaking to?", when: "to someone you call usted" },
    { es: "Buenos días, oficina de la doctora Ruiz, ¿en qué le puedo servir?", en: "Good morning, Dr Ruiz's office, how can I help you?", when: "answering the phone at work" }
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
  translate: [
    { en: "How do you get to work? (to a friend)", es: "¿Cómo vienes al trabajo?", accept: ["¿Cómo [vienes|vas] al trabajo?"] },
    { en: "Whose keys are these?", es: "¿De quién son estas llaves?", accept: [] },
    { en: "What do you need Spanish for? (to a friend)", es: "¿Para qué necesitas el español?", accept: [] },
    { en: "When is your birthday? (to a friend)", es: "¿Cuándo es tu cumpleaños?", accept: [] }
  ],
  register: [
    { es: "¿Qué música te gusta?", en: "What music do you like?", when: "with a friend" },
    { es: "Disculpe, ¿qué documentos necesito?", en: "Excuse me, what documents do I need?", when: "to someone you call usted" },
    { es: "Buenos días. Quería saber el horario de la oficina, por favor.", en: "Good morning. I'd like to know the office hours, please.", when: "in an email or a message" }
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
  translate: [
    { en: "Which one do you prefer, the red or the blue? (to a friend)", es: "¿Cuál prefieres, el rojo o el azul?", accept: [] },
    { en: "I like walking more than going by car.", es: "Me gusta más caminar que ir en carro.", accept: [] },
    { en: "We prefer Saturday.", es: "Preferimos el sábado.", accept: [] },
    { en: "Saturday or Sunday? I don't mind.", es: "¿El sábado o el domingo? Me da igual.", accept: [] }
  ],
  register: [
    { es: "¿Tinto o jugo?", en: "Coffee or juice?", when: "with a friend" },
    { es: "¿Qué prefiere, tinto o aromática?", en: "Which do you prefer, coffee or herbal tea?", when: "to someone you call usted" },
    { es: "¿Qué día prefieren para la reunión?", en: "Which day do you all prefer for the meeting?", when: "in a message to a group at work" }
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
  translate: [
    { en: "There's no need to book.", es: "No hace falta reservar.", accept: [] },
    { en: "To get in you have to show your passport. (nobody named)", es: "Para entrar es necesario mostrar el pasaporte.", accept: ["Para entrar [es necesario|hay que] mostrar el pasaporte."] },
    { en: "We need two chairs.", es: "Nos hacen falta dos sillas.", accept: ["Necesitamos dos sillas."] },
    { en: "I need to rest a little.", es: "Necesito descansar un poco.", accept: [] }
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
  translate: [
    { en: "I can swim, but I can't dance salsa.", es: "Sé nadar, pero no sé bailar salsa.", accept: [] },
    { en: "I know nothing about football.", es: "No sé nada de fútbol.", accept: [] },
    { en: "I know Medellín quite well.", es: "Conozco bastante bien Medellín.", accept: ["Conozco Medellín bastante bien."] },
    { en: "Do you know where it is? (to a friend)", es: "¿Sabes dónde queda?", accept: ["¿Sabes dónde [queda|está]?"] }
  ],
  register: [
    { es: "Ni idea.", en: "No idea.", when: "with a friend" },
    { es: "Qué pena, señora, no sé.", en: "I'm sorry, madam, I don't know.", when: "to someone you call usted" },
    { es: "No estoy seguro, pero lo averiguo y le cuento.", en: "I'm not sure, but I'll find out and let you know.", when: "at work, when you need time to check" }
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
  translate: [
    { en: "Can I see it this week? (the apartment)", es: "¿Lo puedo ver esta semana?", accept: ["¿Puedo verlo esta semana?"] },
    { en: "Does Thursday at six work for you? (polite)", es: "¿Le sirve el jueves a las seis?", accept: [] },
    { en: "Do you have the receipt? Yes, here it is. (polite)", es: "¿Tiene la factura? Sí, aquí está.", accept: ["¿Tiene la factura? Sí, [aquí|acá] está."] },
    { en: "I'd like to exchange these shoes. The thing is, they're too big.", es: "Quería cambiar estos zapatos. Es que me quedan grandes.", accept: [] }
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
  translate: [
    { en: "We were late because there was a lot of traffic.", es: "Llegamos tarde porque había mucho trancón.", accept: ["Llegamos tarde porque había mucho [trancón|tráfico]."] },
    { en: "Since I didn't have your number, I couldn't call you. (to a friend)", es: "Como no tenía tu número, no te pude llamar.", accept: ["Como no tenía tu número, no pude llamarte."] },
    { en: "Why are you so tired? (to a friend)", es: "¿Por qué estás tan cansado?", accept: ["¿Por qué estás tan [cansado|cansada]?"] },
    { en: "Diego didn't come because he had to work.", es: "Diego no vino porque tenía que trabajar.", accept: [] }
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
  translate: [
    { en: "Thanks for everything, Diego!", es: "¡Gracias por todo, Diego!", accept: [] },
    { en: "The bus goes through Honda.", es: "El bus pasa por Honda.", accept: [] },
    { en: "It's thirty thousand per person.", es: "Son treinta mil por persona.", accept: ["Son treinta mil (pesos) por persona."] },
    { en: "I'm studying Spanish to work in Bogotá.", es: "Estudio español para trabajar en Bogotá.", accept: [] }
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
  translate: [
    { en: "If it rains, we're not going to the farm.", es: "Si llueve, no vamos a la finca.", accept: [] },
    { en: "If it's sunny, we're going to go to the beach.", es: "Si hace sol, vamos a ir a la playa.", accept: [] },
    { en: "If you have time this afternoon, call me. (to a friend)", es: "Si tienes tiempo esta tarde, llámame.", accept: [] },
    { en: "If it rains, I stay at home and read.", es: "Si llueve, me quedo en la casa y leo.", accept: ["Si llueve, me quedo en (la) casa y leo."] }
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
  translate: [
    { en: "You could take a few days off. (to a friend)", es: "Puedes tomar unos días libres.", accept: [] },
    { en: "Madam, shall I help you with the bags?", es: "Señora, ¿le ayudo con las bolsas?", accept: [] },
    { en: "Eat something. You're very pale. (to a friend)", es: "Come algo. Estás muy pálido.", accept: ["Come algo. Estás muy [pálido|pálida]."] },
    { en: "The best thing is to wait.", es: "Lo mejor es esperar.", accept: [] }
  ],
  register: [
    { es: "Tienes que descansar, en serio.", en: "You have to rest, seriously.", when: "with a friend" },
    { es: "Lo mejor es ir al médico, señor.", en: "The best thing is to go to the doctor, sir.", when: "to someone you call usted" },
    { es: "Hay que revisar el informe antes del lunes.", en: "The report has to be checked before Monday.", when: "at work, pointing at nobody" }
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
  translate: [
    { en: "And why don't we eat something first?", es: "¿Y por qué no comemos algo primero?", accept: [] },
    { en: "Shall we meet at your place at eight? (to a friend)", es: "¿Nos vemos en tu casa a las ocho?", accept: [] },
    { en: "Shall we go dancing on Saturday?", es: "¿Vamos a bailar el sábado?", accept: [] },
    { en: "Why didn't you come to the party? (to a friend)", es: "¿Por qué no viniste a la fiesta?", accept: [] }
  ],
  register: [
    { es: "¿Y si vamos a cine?", en: "What if we go to the cinema?", when: "with a friend" },
    { es: "¿Qué tal si nos reunimos el lunes, señora Pérez?", en: "How about we meet on Monday, Mrs Pérez?", when: "to someone you call usted" },
    { es: "¿Por qué no hacemos la reunión el jueves?", en: "Why don't we have the meeting on Thursday?", when: "in a message or at work" }
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
  translate: [
    { en: "Last year I left my job in Toronto.", es: "El año pasado dejé mi trabajo en Toronto.", accept: [] },
    { en: "I wasn't learning anything new.", es: "No aprendía nada nuevo.", accept: [] },
    { en: "Since the apartment was very expensive, we looked for another one.", es: "Como el apartamento era muy caro, buscamos otro.", accept: [] },
    { en: "I study because I like it.", es: "Estudio porque me gusta.", accept: [] }
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
},

/* ---- unit 24 · Getting around ------------------------------------------ */

"nt-posicion-relativa-distancia-a2": {
  source: "merged",
  hook: {
    line: "Sam is looking at a flat in Chapinero, and the owner shows him round. Every selling point is a place or a distance: what is at the back, what is around the building, how far the station is.",
    es: "Doña Marta: La cocina está al fondo, y tiene mucha luz.\nDoña Marta: Alrededor del edificio hay tiendas y una panadería.\nSam: ¿Y qué tan lejos queda la estación?\nDoña Marta: A cinco minutos a pie, a dos cuadras.",
    en: "Doña Marta: The kitchen is at the back, and it gets lots of light.\nDoña Marta: Around the building there are shops and a bakery.\nSam: And how far is the station?\nDoña Marta: Five minutes on foot, two blocks away."
  },
  examples: [
    { es: "Las llaves están dentro del cajón.", en: "The keys are inside the drawer." },
    { es: "Laura te espera afuera.", en: "Laura is waiting for you outside." },
    { es: "Desde mi casa hasta la oficina hay veinte minutos en bus.", en: "From my house to the office it's twenty minutes by bus." }
  ],
  rule: "Four more place words, each with *de* before the landmark:\n*dentro de*: inside. *dentro del cajón*\n*fuera de*: outside. *fuera de la ciudad*\n*alrededor de*: around. *alrededor de la mesa*\n*al fondo de*: at the back, at the far end. *al fondo del pasillo*\nWith no landmark, the *de* goes, and Colombians say *adentro* and *afuera*: *Te espero afuera.*\nWhere a place is, counted from here, takes *a*: *Queda a dos cuadras. Está a diez minutos a pie.* To ask: *¿Qué tan lejos queda?*\nBoth ends: *desde mi casa hasta la oficina*.\nA flat *tiene mucha luz*, gets lots of light, and *tiene vista a* the park or the hills. Keep *luz* singular: *luces* are lamps.",
  readAndPick: [
    { q: "Where is the kitchen?", es: "La cocina está al fondo del pasillo.",
      options: ["At the end of the hall", "Next to the front door", "Up the stairs"], answer: 0,
      why: "*Al fondo de*: at the back, at the far end." },
    { q: "How far is the bakery?", es: "La panadería queda a tres cuadras.",
      options: ["Three blocks away", "On the third floor", "Three minutes by car"], answer: 0,
      why: "Counted from here with *a*: *a tres cuadras*, three blocks away." },
    { q: "Where is Laura waiting?", es: "Laura te espera afuera.",
      options: ["Outside", "Inside", "Upstairs"], answer: 0,
      why: "*Afuera*, with no landmark after it: outside." },
    { q: "Does the flat get much light?", es: "El apartamento tiene poca luz.",
      options: ["Not much daylight", "Yes, plenty of it", "It has few lamps"], answer: 0,
      why: "*Poca luz*: not much daylight. Few lamps would be *pocas luces*." },
    { q: "What does Diego want?", es: "Un tinto, por favor.",
      options: ["A black coffee", "A glass of red wine", "A cup of tea"], answer: 0,
      why: "In Colombia *un tinto* is a small black coffee. Red wine is *vino tinto*." },
    { q: "What can you see from the flat?", es: "Tiene vista a los cerros.",
      options: ["The hills", "The street", "The river"], answer: 0,
      why: "*Tiene vista a*: it looks out onto. The *cerros* are the hills east of Bogotá." }
  ],
  yourTurn: [
    { en: "The keys are inside the drawer.", es: "Las llaves están dentro del cajón.", accept: [] },
    { en: "I'll wait for you outside. (to a friend)", es: "Te espero afuera.", accept: [] },
    { en: "The bank is two blocks away.", es: "El banco queda a dos cuadras.", accept: ["El banco está a dos cuadras."] },
    { en: "How far is the station?", es: "¿Qué tan lejos queda la estación?", accept: ["¿Qué tan lejos está la estación?", "¿A qué distancia [queda|está] la estación?"] },
    { en: "The flat gets lots of light.", es: "El apartamento tiene mucha luz.", accept: [] }
  ],
  translate: [
    { en: "The kitchen is at the back, and it gets lots of light.", es: "La cocina está al fondo, y tiene mucha luz.", accept: [] },
    { en: "Around the building there are shops and a bakery.", es: "Alrededor del edificio hay tiendas y una panadería.", accept: ["Hay tiendas y una panadería alrededor del edificio."] },
    { en: "From my house to the office it's twenty minutes by bus.", es: "Desde mi casa hasta la oficina hay veinte minutos en bus.", accept: ["[Desde mi casa hasta|De mi casa a] la oficina hay veinte minutos en bus."] },
    { en: "It has a view of the hills.", es: "Tiene vista a los cerros.", accept: [] }
  ],
  personal: {
    prompt: "Describe where you live for a friend who is coming to visit: one thing inside it or around it, and how far it is from something useful.",
    constraints: [
      { type: "containsAny", words: ["dentro", "adentro", "afuera", "fuera de", "alrededor", "al fondo"], label: "a place word: *dentro de*, *alrededor de*, *al fondo*…" },
      { type: "regex", pattern: "\\ba\\s+(\\S+\\s+)?(cuadras?|minutos?|metros|kil[oó]metros)\\b", label: "how far, with *a*: *a dos cuadras*, *a diez minutos*" }
    ],
    model: "Vivo en un apartamento pequeño. Al fondo hay un balcón con vista al parque, y la estación queda a cinco minutos a pie."
  },
  pitfalls: [
    "*Dentro la caja* drops a word: with a landmark after it, *dentro de la caja*.",
    "Where a place is needs its *a*: *queda a dos cuadras*, not *queda dos cuadras*.",
    "In Colombia *un tinto* is black coffee. Red wine is *vino tinto*, never *vino rojo*."
  ]
},

"nt-movimiento-estabilidad-a2": {
  source: "merged",
  hook: {
    line: "Sam is going to lunch at Laura's family's house, and she gives him the route by phone. On a Bogotá bus there's no bell to press: you tell the driver where you're getting off.",
    es: "Laura: Te subes al bus en la 72 y te bajas en la 45.\nLaura: Luego cruzas la calle y sigues derecho una cuadra.\nSam: Listo. ¿Llevo algo?\nLaura: Si quieres, trae pan.",
    en: "Laura: You get on the bus at 72nd Street and get off at 45th.\nLaura: Then you cross the street and go straight on for a block.\nSam: OK. Shall I bring anything?\nLaura: If you like, bring some bread."
  },
  examples: [
    { es: "Me bajo en la próxima, por favor.", en: "I'm getting off at the next stop, please." },
    { es: "¿Me llevas al aeropuerto?", en: "Will you take me to the airport? (to a friend)" },
    { es: "El domingo me quedé en la casa.", en: "On Sunday I stayed at home." }
  ],
  rule: "Getting on and off takes *subirse* and *bajarse*, with *me, te, se*:\n*Me subo al bus.* On takes *a*.\n*Me bajo del bus.* Off takes *de*.\nThe stop takes *en*: *Me bajo en la próxima.* To take the bus is *tomar*: *Tomo el bus.*\nEnglish says bring both ways. Spanish asks which way the thing moves:\n*traer*, towards here, like *venir*: *Tráeme un tinto.*\n*llevar*, away from here, like *ir*: *Lleva esto a la cocina.*\nSo on your way to a friend's house you ask *¿Llevo algo?*, and the host says *trae pan*.\nI bring is *traigo*; brought is *traje, trajo*.\nNot moving at all is *quedarse*: *Hoy me quedo en la casa.*",
  readAndPick: [
    { q: "Is Ana getting on or off?", es: "Ana se baja en la próxima.",
      options: ["Getting off soon", "Getting on now", "Staying on the bus"], answer: 0,
      why: "*Bajarse*: to get off. *En la próxima*: at the next stop." },
    { q: "Where is the coffee going?", es: "Tráeme un tinto, por favor.",
      options: ["To the speaker", "Away from the speaker", "Back to the kitchen"], answer: 0,
      why: "*Traer* moves things towards here, like *venir*." },
    { q: "What does Sam want from his friend?", es: "¿Me llevas al aeropuerto?",
      options: ["A ride to the airport", "A ride back home", "Directions to it"], answer: 0,
      why: "*Llevar* moves away from here, like *ir*: to the airport." },
    { q: "Did Diego go out on Sunday?", es: "El domingo me quedé en la casa.",
      options: ["No, he stayed home", "Yes, to his mom's", "Yes, but not for long"], answer: 0,
      why: "*Quedarse*: to stay put, the opposite of going out." },
    { q: "Which way did the arepas travel?", es: "Diego trajo arepas de Medellín.",
      options: ["From Medellín to here", "From here to Medellín", "Around Medellín"], answer: 0,
      why: "*Trajo*, from *traer*: brought, towards here." }
  ],
  yourTurn: [
    { en: "I'm getting off at the next stop, please.", es: "Me bajo en la próxima, por favor.", accept: ["Me bajo en el próximo paradero, por favor."] },
    { en: "Bring me a black coffee, please. (to a friend)", es: "Tráeme un tinto, por favor.", accept: [] },
    { en: "Will you take me to the airport? (to a friend)", es: "¿Me llevas al aeropuerto?", accept: [] },
    { en: "I got on the bus at 72nd Street.", es: "Me subí al bus en la 72.", accept: ["Me subí al bus en la calle 72."] },
    { en: "Today I'm staying at home.", es: "Hoy me quedo en la casa.", accept: ["Hoy me quedo en casa."] }
  ],
  translate: [
    { en: "You get on the bus at 72nd Street and get off at 45th. (to a friend)", es: "Te subes al bus en la 72 y te bajas en la 45.", accept: ["Te subes al bus en la (calle) 72 y te bajas en la (calle) 45."] },
    { en: "Shall I bring anything?", es: "¿Llevo algo?", accept: [] },
    { en: "On Sunday I stayed at home.", es: "El domingo me quedé en la casa.", accept: ["El domingo me quedé en (la) casa."] },
    { en: "Diego brought arepas from Medellín.", es: "Diego trajo arepas de Medellín.", accept: [] }
  ],
  personal: {
    prompt: "Give a friend the route to your place from the nearest bus or train: where to get on or off, and what to bring.",
    constraints: [
      { type: "containsAny", words: ["te subes", "te bajas", "súbete", "bájate"], label: "getting on or off: *te subes al…*, *te bajas en…*" },
      { type: "containsAny", words: ["trae", "lleva", "traigo", "llevo"], label: "what to bring: *trae…*" }
    ],
    model: "Te subes al bus en la 72 y te bajas en la 45. Si quieres, trae algo de tomar."
  },
  pitfalls: [
    "Off takes *de*: *me bajo del bus*, not *me bajo el bus*.",
    "*Llévame un tinto* sends the coffee away from you. If it's coming to you: *tráeme*.",
    "On your way to someone's house, it's *¿Llevo algo?*, even where English says bring."
  ]
},

"gn-describir-lugar-a2": {
  source: "old",
  hook: {
    line: "A list of rooms is not a description. Sam's sister wants to picture his new place in Bogotá, so he walks her through it, says how it felt the first day, and compares it with home.",
    es: "Al entrar, a la derecha, está la cocina, y al fondo está mi cuarto.\nCuando lo vi por primera vez, no me gustó: era oscuro y estaba sucio.\nAhora me encanta. Es más pequeño que mi apartamento de Toronto, pero tiene mucha más luz.",
    en: "As you come in, the kitchen is on the right, and my room is at the back.\nWhen I first saw it, I didn't like it: it was dark and it was dirty.\nNow I love it. It's smaller than my flat in Toronto, but it gets a lot more light."
  },
  examples: [
    { es: "Al fondo del pasillo, a la izquierda, está el baño.", en: "At the end of the hall, on the left, is the bathroom." },
    { es: "Cuando llegué, el barrio era muy tranquilo.", en: "When I arrived, the neighbourhood was very quiet." },
    { es: "Medellín tiene muy buen clima.", en: "Medellín has really good weather." }
  ],
  rule: "Don't list the rooms: walk your reader through them.\nStart at the door: *Al entrar…*, as you come in.\nThen place words, in the order you would walk: *a la derecha, a la izquierda, al fondo, al lado de*.\nThen a memory of the first day. What happened takes the event past: *Cuando lo vi, no me gustó.* How it was takes the describing past: *Era oscuro. No había muebles.*\nThen how it is now: *Ahora me encanta.*\nClose by comparing it with somewhere you know: *Es más pequeño que mi casa, pero está mejor ubicado.*\nGood weather is something a place has: *Medellín tiene muy buen clima.*",
  readAndPick: [
    { q: "Where is the bathroom?", es: "Al fondo del pasillo, a la izquierda, está el baño.",
      options: ["End of the hall, left", "By the door, on the right", "Upstairs, on the left"], answer: 0,
      why: "*Al fondo*: at the far end. *A la izquierda*: on the left." },
    { q: "Did Sam like the flat the first time?", es: "Cuando lo vi por primera vez, no me gustó.",
      options: ["No, not at first", "Yes, straight away", "He never saw it"], answer: 0,
      why: "*No me gustó*: the event past, his reaction that day. It changed later." },
    { q: "Is this how the place was, or something that happened?", es: "Era oscuro y no había muebles.",
      options: ["How it was then", "What happened", "How it is now"], answer: 0,
      why: "*Era* and *había*: the describing past paints how it was." },
    { q: "What is Laura saying about Medellín?", es: "Medellín tiene muy buen clima.",
      options: ["The weather is lovely", "The people are kind", "It has a good mayor"], answer: 0,
      why: "*Tiene buen clima*: the weather is good there." },
    { q: "What does Sam like about this flat?", es: "Es más pequeño que el otro, pero está mejor ubicado.",
      options: ["Where it is", "How big it is", "How cheap it is"], answer: 0,
      why: "*Mejor ubicado*: in a better spot. It's smaller, so it isn't the size." }
  ],
  yourTurn: [
    { en: "As you come in, on the right, there's the kitchen.", es: "Al entrar, a la derecha, está la cocina.", accept: ["Al entrar, a la derecha está la cocina.", "Al entrar, la cocina está a la derecha."] },
    { en: "At the back there's a small balcony.", es: "Al fondo hay un balcón pequeño.", accept: ["Al fondo hay un pequeño balcón."] },
    { en: "When I first saw it, I didn't like it. (the flat)", es: "Cuando lo vi por primera vez, no me gustó.", accept: ["La primera vez que lo vi, no me gustó."] },
    { en: "It was very dark. (the flat)", es: "Era muy oscuro.", accept: ["Estaba muy oscuro."] },
    { en: "Medellín has very good weather.", es: "Medellín tiene muy buen clima.", accept: ["Medellín tiene un clima muy bueno."] }
  ],
  translate: [
    { en: "At the end of the hall, on the left, is the bathroom.", es: "Al fondo del pasillo, a la izquierda, está el baño.", accept: [] },
    { en: "When I arrived, the neighbourhood was very quiet.", es: "Cuando llegué, el barrio era muy tranquilo.", accept: [] },
    { en: "It was dark and there was no furniture.", es: "Era oscuro y no había muebles.", accept: ["[Era|Estaba] oscuro y no había muebles."] },
    { en: "It's smaller than the other one, but it's in a better spot.", es: "Es más pequeño que el otro, pero está mejor ubicado.", accept: [] }
  ],
  personal: {
    prompt: "Describe a place you know well for someone who has never been: walk them through it, say how it was the first time, and compare it with another place.",
    constraints: [
      { type: "containsAny", words: ["a la derecha", "a la izquierda", "al fondo", "al lado", "al entrar", "enfrente"], label: "walk them through: *al entrar*, *a la derecha*, *al fondo*…" },
      { type: "anyVerbInTense", tense: "imperfecto", label: "how it was, in the describing past: *era*, *había*…" },
      { type: "containsAny", words: ["más", "menos", "mejor", "peor"], label: "a comparison: *más… que*, *mejor*…" }
    ],
    model: "Al entrar, a la derecha, está la cocina, y al fondo está mi cuarto. Cuando llegué, no había muebles y era muy oscuro. Ahora es más bonito que mi apartamento anterior."
  },
  pitfalls: [
    "A list with *hay* is a start, not a description. Walk your reader through, in order.",
    "How the place was takes the describing past: *era oscuro*, *no había luz*. Your reaction that day takes the event past: *no me gustó*.",
    "*Buen* goes before the word, *bueno* after it: *buen clima*, *un clima bueno*."
  ]
},

"fn-dirigirse-a2": {
  source: "merged",
  hook: {
    line: "At a Sunday market a man walks off without his umbrella, and a minute later Laura runs into her boss. Two moments, two jobs: stop a stranger politely, then introduce your friend.",
    es: "Sam: ¡Señor, disculpe! ¿Esta sombrilla es suya?\nSeñor: ¡Ay, sí! Gracias, joven.\nLaura: Doctora Ruiz, le presento a Sam, un amigo de Canadá.\nDoctora Ruiz: Mucho gusto, Sam.\nSam: El gusto es mío.",
    en: "Sam: Sir, excuse me! Is this umbrella yours?\nMan: Oh, yes! Thank you, young man.\nLaura: Dr Ruiz, this is Sam, a friend from Canada.\nDr Ruiz: Nice to meet you, Sam.\nSam: The pleasure is mine."
  },
  examples: [
    { es: "Disculpe, ¿sabe dónde queda la estación?", en: "Excuse me, do you know where the station is?" },
    { es: "Oye, Diego, ¿tienes un minuto?", en: "Hey, Diego, have you got a minute?" },
    { es: "Te presento a Ana, una amiga del trabajo.", en: "This is Ana, a friend from work. (to a friend)" }
  ],
  rule: "To stop a stranger, open softly, then ask:\n*Disculpe* or *Perdón*: excuse me. *Disculpe, ¿sabe dónde queda el banco?*\n*Señor*, *señora*, or *joven* for someone young.\n*Oye*, to a friend, is hey. To a stranger, *oiga* alone sounds rough, so add *disculpe*: *Oiga, disculpe…*\nTo introduce someone, say who they are to you: *Te presento a Ana, una amiga del trabajo.* To *usted*: *Le presento a Sam.*\nA title goes with the surname: *el señor Gómez*, *la doctora Ruiz*. In Colombia *doctor* is respect for any professional, not just a medic.\nThe reply is *Mucho gusto*, and back, *Igualmente* or *El gusto es mío*.",
  readAndPick: [
    { q: "Who is Laura talking to?", es: "Oye, ¿me pasas la sal?",
      options: ["A friend at the table", "A waiter she doesn't know", "Her new boss"], answer: 0,
      why: "*Oye* and *pasas*: the friendly hey, and *tú*." },
    { q: "How does this sound to a stranger?", es: "Oiga, disculpe, ¿sabe qué hora es?",
      options: ["Polite", "Rude", "Very casual"], answer: 0,
      why: "*Disculpe* softens *oiga*, and *sabe* is for *usted*." },
    { q: "Who is Ana to Diego?", es: "Diego, te presento a Ana, una amiga del trabajo.",
      options: ["A friend from work", "His sister from Cali", "A friend from school"], answer: 0,
      why: "*Una amiga del trabajo*: who she is to the speaker." },
    { q: "Who is Laura introducing Sam to?", es: "Doctora Ruiz, le presento a Sam.",
      options: ["Someone she calls usted", "Her little sister", "A school friend"], answer: 0,
      why: "*Le presento* and a title with the surname: someone she calls *usted*." },
    { q: "What is Sam saying back?", es: "El gusto es mío.",
      options: ["The pleasure is mine", "I like it a lot", "It's my turn to speak"], answer: 0,
      why: "The answer to *mucho gusto*: the pleasure is mine." },
    { q: "Is Doctor Gómez a medic?", es: "El doctor Gómez es el jefe de Laura.",
      options: ["Not necessarily", "Yes, always", "No, never"], answer: 0,
      why: "In Colombia *doctor* is respect for bosses and professionals, not only medics." }
  ],
  yourTurn: [
    { en: "Excuse me, do you know where the bank is? (to a stranger)", es: "Disculpe, ¿sabe dónde queda el banco?", accept: ["[Disculpe|Perdón], ¿sabe dónde [queda|está] el banco?"] },
    { en: "Hey, Diego, have you got a minute?", es: "Oye, Diego, ¿tienes un minuto?", accept: [] },
    { en: "This is Ana, a friend from work. (to a friend)", es: "Te presento a Ana, una amiga del trabajo.", accept: [] },
    { en: "Mr Gómez, may I introduce Laura.", es: "Señor Gómez, le presento a Laura.", accept: [] },
    { en: "The pleasure is mine.", es: "El gusto es mío.", accept: [] }
  ],
  translate: [
    { en: "Sir, excuse me! Is this umbrella yours?", es: "¡Señor, disculpe! ¿Esta sombrilla es suya?", accept: [] },
    { en: "Dr Ruiz, this is Sam, a friend from Canada.", es: "Doctora Ruiz, le presento a Sam, un amigo de Canadá.", accept: ["[Doctora|Doctor] Ruiz, le presento a Sam, un amigo de Canadá."] },
    { en: "Hey, excuse me, do you know what time it is? (to a stranger)", es: "Oiga, disculpe, ¿sabe qué hora es?", accept: [] },
    { en: "Hey, can you pass me the salt? (to a friend)", es: "Oye, ¿me pasas la sal?", accept: [] }
  ],
  register: [
    { es: "Oye, Laura, ¿me ayudas un momento?", en: "Hey, Laura, can you help me for a moment?", when: "with a friend" },
    { es: "Disculpe, señora, ¿me puede ayudar?", en: "Excuse me, madam, can you help me?", when: "to someone you call usted" },
    { es: "Estimada doctora Ruiz:", en: "Dear Dr Ruiz,", when: "to open an email at work" }
  ],
  personal: {
    prompt: "Introduce someone in your life to a friend: their name and who they are to you. Then write what your friend says back.",
    constraints: [
      { type: "regex", pattern: "\\b(te|le) presento a", label: "*te presento a…* or *le presento a…*" },
      { type: "containsAny", words: ["mucho gusto", "encantado", "encantada", "igualmente", "el gusto es"], label: "the reply: *mucho gusto*, *igualmente*…" }
    ],
    model: "Laura, te presento a Tom, un amigo del colegio. ¡Mucho gusto, Tom!"
  },
  pitfalls: [
    "*Oiga* alone can sound like a shout. To a stranger, soften it, or just say *Disculpe*.",
    "A title goes with the surname: *el señor Gómez*, never *el señor Antonio*.",
    "*Te presento Ana* drops a word: before a person, *a*. *Te presento a Ana.*"
  ]
},

"task-a2-sitio": {
  source: "old",
  hook: {
    line: "A friend from Canada is visiting, and Sam wants to show off his barrio. This week ends with a walk you write down: a route someone could follow, three places worth a stop, and how far each one is.",
    es: "Empezamos en el parque, que queda enfrente de mi edificio.\nAlrededor del parque hay tres cafés; el del fondo es el mejor.\nDesde ahí seguimos derecho dos cuadras. El mercado queda a cinco minutos.",
    en: "We start at the park, which is opposite my building.\nAround the park there are three cafés; the one at the far end is the best.\nFrom there we go straight on for two blocks. The market is five minutes away."
  },
  examples: [
    { es: "Justo al lado de la panadería hay una droguería.", en: "Right next to the bakery there's a pharmacy." },
    { es: "Un poco más allá, a la izquierda, está el mercado.", en: "A bit further on, on the left, is the market." },
    { es: "Hay que ir el domingo, porque hay música en vivo.", en: "You have to go on a Sunday, because there's live music." }
  ],
  rule: "Guide someone along one route in ten to fourteen sentences, with three places worth a stop.\nStart somewhere easy to find: *Empezamos en el parque.*\nMove in order, with *luego*, *después* and *desde ahí*.\nPlace each stop: *al lado de, enfrente de, alrededor de, al fondo, un poco más allá*.\nHow far you walk takes no *a*: *seguimos derecho dos cuadras*. Where a place is, counted from here, does: *queda a dos cuadras*, *a cinco minutos a pie*.\nGive a reason to go: *Hay que probar el pan, porque es buenísimo.*\n*Hay* brings in a place your friend doesn't know yet; *está* finds one they do: *Hay un mercado. El mercado está al fondo.*",
  readAndPick: [
    { q: "How far is the market?", es: "El mercado queda a diez minutos a pie.",
      options: ["Ten minutes' walk", "Ten blocks away", "Ten minutes by bus"], answer: 0,
      why: "*A diez minutos a pie*: ten minutes on foot." },
    { q: "Where is the pharmacy?", es: "Justo al lado de la panadería hay una droguería.",
      options: ["Next door to the bakery", "Across from the bakery", "Inside the bakery itself"], answer: 0,
      why: "*Justo al lado de*: right next to. A *droguería* is a pharmacy in Colombia." },
    { q: "Which café is the best?", es: "Hay tres cafés; el del fondo es el mejor.",
      options: ["The one at the end", "The first one", "The middle one"], answer: 0,
      why: "*El del fondo*: the one at the far end." },
    { q: "Has Sam's friend heard of the market before?", es: "Un poco más allá hay un mercado.",
      options: ["No, it's news", "Yes, she knows it well", "She works there"], answer: 0,
      why: "*Hay* brings in a new place. One she knew would take *está*." },
    { q: "Why go on a Sunday?", es: "Hay que ir el domingo, porque hay música en vivo.",
      options: ["For the live music", "Because it's quiet", "It's open late"], answer: 0,
      why: "*Porque* gives the reason: *música en vivo*, live music." }
  ],
  yourTurn: [
    { en: "We start at the park, opposite my building.", es: "Empezamos en el parque, enfrente de mi edificio.", accept: ["Empezamos en el parque, que [queda|está] enfrente de mi edificio."] },
    { en: "From there we go straight on for two blocks.", es: "Desde ahí seguimos derecho dos cuadras.", accept: ["[Desde allí|De ahí] seguimos derecho dos cuadras."] },
    { en: "The market is ten minutes' walk away.", es: "El mercado queda a diez minutos a pie.", accept: ["El mercado está a diez minutos a pie."] },
    { en: "A bit further on, there's a bakery.", es: "Un poco más allá hay una panadería.", accept: ["Un poco más allá, hay una panadería."] }
  ],
  translate: [
    { en: "Right next to the bakery there's a pharmacy.", es: "Justo al lado de la panadería hay una droguería.", accept: [] },
    { en: "A bit further on, on the left, is the market.", es: "Un poco más allá, a la izquierda, está el mercado.", accept: [] },
    { en: "You have to go on a Sunday, because there's live music. (nobody named)", es: "Hay que ir el domingo, porque hay música en vivo.", accept: [] },
    { en: "Around the park there are three cafés; the one at the far end is the best.", es: "Alrededor del parque hay tres cafés; el del fondo es el mejor.", accept: [] }
  ],
  personal: {
    prompt: "Guide a friend from your door to one place worth a visit near you: the route, how far it is, and why it's worth going.",
    constraints: [
      { type: "containsAny", words: ["derecho", "a la derecha", "a la izquierda", "enfrente", "al lado", "al fondo", "alrededor", "más allá"], label: "the route, with place words: *derecho*, *enfrente de*…" },
      { type: "regex", pattern: "\\ba\\s+(\\S+\\s+)?(cuadras?|minutos?)\\b", label: "how far it is: *a dos cuadras*, *a cinco minutos*" },
      { type: "containsWord", word: "porque", label: "a reason to go, with *porque*" }
    ],
    model: "Sales de mi edificio y sigues derecho dos cuadras. Enfrente del parque hay una panadería, a cinco minutos de mi casa. Hay que ir porque el pan es buenísimo."
  },
  pitfalls: [
    "Where a place is takes *a*: *queda a cinco minutos*. How far you walk doesn't: *sigues dos cuadras*.",
    "*Cuadra* is a block in Colombia; in Spain you'll read *manzana*.",
    "*Derecho* is straight on; *a la derecha* is right. Check them twice before you send the route."
  ]
},

/* ---- unit 25 · Writing it down ----------------------------------------- */

"gr-gerundio-a2": {
  source: "merged",
  hook: {
    line: "Laura calls at the worst moment. Sam needs one line for busy right now, and Spanish builds it the way English does, with *estar* and an *-ando* word. The difference is how much less Spanish uses it.",
    es: "Laura: ¿Qué estás haciendo?\nSam: Estoy cocinando. Te llamo luego.\nLaura: ¿Tú, cocinando? ¡Qué milagro!",
    en: "Laura: What are you doing?\nSam: I'm cooking. I'll call you later.\nLaura: You, cooking? That's a miracle!"
  },
  examples: [
    { es: "Diego está durmiendo.", en: "Diego is sleeping." },
    { es: "Estoy aprendiendo español.", en: "I'm learning Spanish." },
    { es: "Estaba leyendo cuando sonó el teléfono.", en: "I was reading when the phone rang." }
  ],
  rule: "For something in progress, Spanish uses *estar* plus an *-ando* or *-iendo* word:\n*-ar*: *hablar*, *estoy hablando*\n*-er* and *-ir*: *comer*, *está comiendo*; *salir*, *estamos saliendo*\nA few bend: *leyendo, durmiendo, diciendo, pidiendo*.\nIt's for right now, or around now: *Estoy aprendiendo español.* With *estaba*, it was going on when something happened: *Estaba leyendo cuando llamaste.*\nIt's not for what's generally true: I live in Bogotá is *Vivo en Bogotá*. Not for plans either: I'm going tomorrow is *Mañana voy*.\n*Lo, la, me* go before *estar*, or on the end with an accent: *Lo estoy leyendo*, *Estoy leyéndolo*. Same with *voy a*: *Te voy a llamar*, *Voy a llamarte*.",
  readAndPick: [
    { q: "Is Diego asleep at this moment?", es: "Diego está durmiendo.",
      options: ["Yes, right now", "He sleeps a lot", "He's off to bed later"], answer: 0,
      why: "*Está durmiendo*: in progress as we speak." },
    { q: "Right now, or in general?", es: "Diego duerme mucho.",
      options: ["In general", "Right now", "Only tonight"], answer: 0,
      why: "The plain present: what's true of Diego, not what he's doing now." },
    { q: "Which was already going on?", es: "Laura estaba leyendo cuando sonó el teléfono.",
      options: ["The reading", "The phone ringing", "Neither of them"], answer: 0,
      why: "*Estaba leyendo* was going on; *sonó* cut across it." },
    { q: "Is Ana doing this now, or planning it?", es: "Mañana voy a Cali.",
      options: ["A plan for tomorrow", "Happening right now", "Her weekly habit"], answer: 0,
      why: "A plan takes the plain present. English says I'm going; Spanish says *voy*." },
    { q: "What is Sam doing these days?", es: "Estoy aprendiendo a cocinar.",
      options: ["Learning to cook", "Cooking dinner", "Teaching cooking"], answer: 0,
      why: "Around now, for a while: *estoy aprendiendo*, not only this minute." },
    { q: "The letter? What is Laura doing with it?", es: "¿La carta? La estoy escribiendo.",
      options: ["Writing it", "Reading it to us", "Sending it"], answer: 0,
      why: "*La* is the letter, in front of *estoy*. *Estoy escribiéndola* says the same." }
  ],
  yourTurn: [
    { en: "What are you doing? (to a friend)", es: "¿Qué estás haciendo?", accept: [] },
    { en: "I'm working, I'll call you later. (to a friend)", es: "Estoy trabajando, te llamo luego.", accept: ["Estoy trabajando. Te llamo luego.", "Estoy trabajando, te llamo más tarde.", "Estoy trabajando. Te llamo más tarde."] },
    { en: "I was reading when you called. (to a friend)", es: "Estaba leyendo cuando llamaste.", accept: ["Estaba leyendo cuando me llamaste.", "Leía cuando llamaste."] },
    { en: "I'm going to Medellín tomorrow.", es: "Mañana voy a Medellín.", accept: ["Voy a Medellín mañana.", "Mañana voy a ir a Medellín.", "Voy a ir a Medellín mañana.", "Mañana me voy para Medellín."] },
    { en: "The contract? I'm reading it.", es: "¿El contrato? Lo estoy leyendo.", accept: ["¿El contrato? Estoy leyéndolo."] }
  ],
  translate: [
    { en: "Diego is sleeping.", es: "Diego está durmiendo.", accept: [] },
    { en: "I'm learning Spanish.", es: "Estoy aprendiendo español.", accept: [] },
    { en: "I'm cooking. I'll call you later. (to a friend)", es: "Estoy cocinando. Te llamo luego.", accept: ["Estoy cocinando. Te llamo [luego|más tarde]."] },
    { en: "She's writing a letter to her grandmother.", es: "Le está escribiendo una carta a su abuela.", accept: ["Está escribiéndole una carta a su abuela."] }
  ],
  personal: {
    prompt: "What are you doing right now, and what is someone you know probably doing at this moment? Two lines, each with *estar* and an *-ando* or *-iendo* word.",
    constraints: [
      { type: "regex", pattern: "\\bestoy\\s+\\S+(ando|iendo|yendo)\\b", label: "you: *estoy* plus *-ando* or *-iendo*" },
      { type: "regex", pattern: "\\best(á|a|án|an)\\s+\\S+(ando|iendo|yendo)\\b", label: "someone else: *está* plus *-ando* or *-iendo*" }
    ],
    model: "Estoy estudiando español en la cocina. Mi hermana está trabajando en Toronto."
  },
  pitfalls: [
    "English uses -ing for plans; Spanish doesn't: *Mañana voy a Medellín*, not *estoy yendo*.",
    "English -ing as a thing is the dictionary form in Spanish: *Me gusta nadar*, *Nadar es bueno*.",
    "On the end, the word takes an accent to keep its sound: *leyéndolo*, *escuchándome*."
  ]
},

"gr-adverbios-circunstanciales-a2": {
  source: "merged",
  hook: {
    line: "The detail in a story lives in small words: where, in what order, how much. Laura tells Sam about an evening that went wrong, and nearly every line leans on one.",
    es: "Laura: Primero cenamos en un sitio cerca de la oficina.\nLaura: Después de comer, fuimos a un bar, pero estaba lleno.\nLaura: Al final nos fuimos a la casa. ¡No me gustó nada!",
    en: "Laura: First we had dinner at a place near the office.\nLaura: After eating, we went to a bar, but it was full.\nLaura: In the end we went home. I didn't like it at all!"
  },
  examples: [
    { es: "Vivo cerca de la universidad, pero Ana vive lejos.", en: "I live near the university, but Ana lives far away." },
    { es: "Te espero abajo, en la entrada.", en: "I'll wait for you downstairs, at the entrance. (to a friend)" },
    { es: "Antes de salir, cierra la ventana.", en: "Before you go out, close the window. (to a friend)" }
  ],
  rule: "Three kinds of small word add the detail.\nWhere. On their own: *Vivo cerca. Te espero abajo.* With a place after them, add *de*: *cerca de la universidad*, *debajo de la mesa*. *Arriba* is upstairs or above, *abajo* downstairs or below.\nWhen, in order: *primero, luego, después, al final*. Before or after an action, *antes de* or *después de* plus the dictionary form: *después de comer*, *antes de salir*.\nHow much: *mucho, poco, bastante*. And after *no*, *nada* means not at all: *No me gustó nada.*\n*Nunca* works the same way: *No voy nunca*, or *Nunca voy*.",
  readAndPick: [
    { q: "Where will Diego be?", es: "Te espero abajo.",
      options: ["Downstairs", "Upstairs", "Outside the door"], answer: 0,
      why: "*Abajo*: downstairs. Upstairs would be *arriba*." },
    { q: "When did they go to the bar?", es: "Después de comer, fuimos a un bar.",
      options: ["After dinner", "Before dinner", "During dinner"], answer: 0,
      why: "*Después de* plus *comer*: after eating." },
    { q: "How much did Laura like it?", es: "No me gustó nada.",
      options: ["Not at all", "Not much", "A little"], answer: 0,
      why: "*No… nada* around the verb: not at all." },
    { q: "Does Ana live near the university?", es: "Ana vive lejos de la universidad.",
      options: ["No, far from it", "Yes, very near", "Yes, right next to it"], answer: 0,
      why: "*Lejos de*: far from. Near would be *cerca de*." },
    { q: "What should you do first?", es: "Antes de salir, cierra la ventana.",
      options: ["Close the window", "Go out", "Open the window"], answer: 0,
      why: "*Antes de salir*: before going out. The window comes first." },
    { q: "How often does Sam go to the gym?", es: "No voy nunca al gimnasio.",
      options: ["Never", "Every day", "Now and then"], answer: 0,
      why: "*No… nunca*: never. With *nunca* first, the *no* goes: *Nunca voy*." }
  ],
  yourTurn: [
    { en: "I live near the university.", es: "Vivo cerca de la universidad.", accept: [] },
    { en: "I'll wait for you downstairs. (to a friend)", es: "Te espero abajo.", accept: [] },
    { en: "After eating, we went to a bar.", es: "Después de comer, fuimos a un bar.", accept: ["Después de comer fuimos a un bar."] },
    { en: "I didn't like it at all.", es: "No me gustó nada.", accept: [] },
    { en: "I never go to the gym.", es: "No voy nunca al gimnasio.", accept: ["Nunca voy al gimnasio.", "No voy al gimnasio nunca."] }
  ],
  translate: [
    { en: "Ana lives far from the university.", es: "Ana vive lejos de la universidad.", accept: [] },
    { en: "Before you go out, close the window. (to a friend)", es: "Antes de salir, cierra la ventana.", accept: [] },
    { en: "First we had dinner and then we watched a film.", es: "Primero cenamos y luego vimos una película.", accept: ["Primero cenamos y [luego|después] vimos una película."] },
    { en: "The cat is under the bed.", es: "El gato está debajo de la cama.", accept: [] }
  ],
  personal: {
    prompt: "Tell a friend what you did last night, in three steps and in order.",
    constraints: [
      { type: "containsWord", word: "primero", label: "the first step, with *primero*" },
      { type: "regex", pattern: "\\b(despu[eé]s|antes) de\\s+\\S+(ar|er|ir)\\b", label: "*después de* or *antes de* plus the dictionary form" },
      { type: "containsAny", words: ["al final", "luego", "más tarde"], label: "how it ended: *al final*, *luego*…" }
    ],
    model: "Primero cociné arroz. Después de comer, vi una película. Al final me acosté tarde."
  },
  pitfalls: [
    "*Cerca la universidad* drops a word: with a place after it, *cerca de*.",
    "*Después comer* drops one too: *después de comer*, with the verb in the dictionary form.",
    "*Me gustó nada* is a slip: after the verb, *nada* needs *no* in front. *No me gustó nada.*"
  ]
},

"gn-generos-escritos-a2": {
  source: "old",
  hook: {
    line: "Sam is answering an ad for a flat. Ads, forecasts and emails each have a shape you can predict, so you can read them fast and write one that looks right.",
    es: "Se arrienda apartamento en Chapinero. Dos habitaciones, mucha luz.\nBuenos días, señora Pérez:\nLe escribo por el apartamento de Chapinero. ¿Todavía está disponible?\nAdjunto le envío mis datos. Un cordial saludo, Sam Lee",
    en: "Flat for rent in Chapinero. Two bedrooms, lots of light.\nGood morning, Mrs Pérez,\nI'm writing about the flat in Chapinero. Is it still available?\nPlease find my details attached. Kind regards, Sam Lee"
  },
  examples: [
    { es: "Se necesita mesero con experiencia.", en: "Waiter needed, with experience." },
    { es: "Mañana, lluvias por la tarde en Bogotá.", en: "Tomorrow, rain in the afternoon in Bogotá." },
    { es: "Quedo atento a su respuesta.", en: "I look forward to your reply." }
  ],
  rule: "Everyday texts are short and predictable, so read for the piece you need.\nAn ad: *Se necesita*, *Se busca*, *Se arrienda*, *Se vende*, then the details, often with no verb: *Dos habitaciones, mucha luz.*\nA forecast: the day, then the weather: *Mañana, lluvias por la tarde.*\nA semi-formal email:\nOpen with *Buenos días, señora Pérez:*, with a colon.\nSay why you write: *Le escribo por…* or *Le escribo para…*\nTo attach: *Adjunto le envío…*\nClose: *Quedo atento a su respuesta. Un cordial saludo.* A woman writes *atenta*.\nKeep *usted* from start to finish: *le escribo*, *su respuesta*.",
  readAndPick: [
    { q: "What is this ad looking for?", es: "Se necesita mesero con experiencia.",
      options: ["Someone to work", "A flat for rent", "A used car"], answer: 0,
      why: "*Se necesita*: needed. A *mesero* waits on tables." },
    { q: "When will it rain?", es: "Mañana, lluvias por la tarde.",
      options: ["Tomorrow afternoon", "This morning", "All day tomorrow"], answer: 0,
      why: "A forecast gives the day, then the weather: tomorrow, in the afternoon." },
    { q: "Why is Sam writing?", es: "Le escribo por el apartamento de Chapinero.",
      options: ["About the flat", "To complain", "To pay the rent"], answer: 0,
      why: "*Le escribo por*: I'm writing about." },
    { q: "Who is writing this?", es: "Quedo atenta a su respuesta.",
      options: ["A woman", "A man", "A company"], answer: 0,
      why: "*Atenta*, with *-a*: the writer is a woman." },
    { q: "What came with the email?", es: "Adjunto le envío mi hoja de vida.",
      options: ["His CV", "A photo of him", "His home address"], answer: 0,
      why: "*Adjunto*: attached. In Colombia a CV is a *hoja de vida*." },
    { q: "Is this email to a friend?", es: "Estimado señor Gómez:",
      options: ["No, it's formal", "Yes, a close one", "Yes, to his brother"], answer: 0,
      why: "*Estimado* and a surname: a formal opening. A friend gets *Hola, Diego*." }
  ],
  yourTurn: [
    { en: "Waiter needed.", es: "Se necesita mesero.", accept: ["Se busca mesero."] },
    { en: "I'm writing about the flat. (to usted)", es: "Le escribo por el apartamento.", accept: ["Le escribo sobre el apartamento."] },
    { en: "Please find my CV attached. (to usted)", es: "Adjunto le envío mi hoja de vida.", accept: ["Le envío adjunta mi hoja de vida."] },
    { en: "I look forward to your reply. Kind regards. (to usted)", es: "Quedo atento a su respuesta. Un cordial saludo.", accept: ["Quedo atenta a su respuesta. Un cordial saludo.", "Quedo [atento|atenta] a su respuesta. Cordial saludo."] }
  ],
  translate: [
    { en: "Flat for rent in Chapinero.", es: "Se arrienda apartamento en Chapinero.", accept: [] },
    { en: "Tomorrow, rain in the afternoon in Bogotá.", es: "Mañana, lluvias por la tarde en Bogotá.", accept: ["Mañana, [lluvias|lluvia] por la tarde en Bogotá."] },
    { en: "Is it still available? (the flat)", es: "¿Todavía está disponible?", accept: ["¿Está disponible todavía?"] },
    { en: "Car for sale, in very good condition.", es: "Se vende carro en muy buen estado.", accept: [] }
  ],
  personal: {
    prompt: "Write the start of a short email to the owner of a flat you saw advertised: the greeting, why you're writing, and one question.",
    constraints: [
      { type: "containsAny", words: ["buenos días", "buenas tardes", "estimado", "estimada"], label: "a semi-formal greeting: *Buenos días, señora…:*" },
      { type: "containsWord", word: "le escribo", label: "why you write: *Le escribo por…*" },
      { type: "question", label: "one question, with *¿* and *?*" },
      { type: "avoidsPerson", person: "tú", label: "*usted* all the way: no *tú*" }
    ],
    model: "Buenos días, señora Pérez: Le escribo por el apartamento de Chapinero. ¿Todavía está disponible? Quedo atento a su respuesta."
  },
  pitfalls: [
    "Halfway through a *usted* email, a *te* or a *tu* slips in easily. Read it once just for that.",
    "*Un abrazo* closes to a friend. To an owner or an office: *Un cordial saludo*.",
    "In Colombia a CV is a *hoja de vida*, and to rent is *arrendar*: *Se arrienda*."
  ]
},

"gn-presentacion-publica-a2": {
  source: "merged",
  hook: {
    line: "Sam's Spanish class ends the month with a two minute talk about your home town. The good news: nearly every short talk in Spanish runs on the same few lines.",
    es: "Buenos días a todos. Hoy les voy a hablar de Toronto.\nEn primer lugar, es una ciudad muy grande. Además, hace mucho frío.\nPor último, aquí tienen una foto del lago. Muchas gracias. ¿Alguna pregunta?",
    en: "Good morning, everyone. Today I'm going to talk to you about Toronto.\nFirst of all, it's a very big city. Also, it's very cold.\nFinally, here's a photo of the lake. Thank you very much. Any questions?"
  },
  examples: [
    { es: "Hoy les voy a hablar de mi familia.", en: "Today I'm going to talk to you about my family." },
    { es: "En esta foto pueden ver el centro.", en: "In this photo you can see downtown." },
    { es: "Para terminar, les voy a mostrar un video corto.", en: "To finish, I'm going to show you a short video." }
  ],
  rule: "A short talk has three parts, and each part has its line.\nOpen: *Buenos días a todos. Hoy les voy a hablar de…*\nTwo or three points, one idea each: *En primer lugar…*, *Además…*, *Por último…*\nClose: *Para terminar…*, then *Muchas gracias. ¿Alguna pregunta?*\n*Les* is all of you, so the room is in the sentence: *les voy a hablar*, *les voy a mostrar*. The verb for the room is the *ustedes* one: *pueden ver*, *aquí tienen*.\nLet a photo carry the names and numbers: *En esta foto pueden ver…* Your Spanish only has to link the points.",
  readAndPick: [
    { q: "Which part of the talk is this?", es: "Hoy les voy a hablar de mi barrio.",
      options: ["The opening", "A middle point", "The close"], answer: 0,
      why: "*Hoy les voy a hablar de…*: the line that opens a talk." },
    { q: "Which part of the talk is this?", es: "Para terminar, les voy a mostrar una foto.",
      options: ["The close", "The opening", "The first point"], answer: 0,
      why: "*Para terminar*: to finish. The close is coming." },
    { q: "Who is *les* here?", es: "Hoy les voy a hablar de Cali.",
      options: ["The whole room", "One friend", "The speaker"], answer: 0,
      why: "*Les*: to all of you, the people listening." },
    { q: "What is the speaker doing here?", es: "Además, la comida es muy buena.",
      options: ["Adding a point", "Closing the talk", "Asking a question"], answer: 0,
      why: "*Además*: also. One more point in the middle." },
    { q: "What does the speaker want now?", es: "Muchas gracias. ¿Alguna pregunta?",
      options: ["Your questions", "Some applause", "A short break"], answer: 0,
      why: "*¿Alguna pregunta?*: any questions? The talk is over." }
  ],
  yourTurn: [
    { en: "Good morning, everyone. Today I'm going to talk to you about Bogotá.", es: "Buenos días a todos. Hoy les voy a hablar de Bogotá.", accept: ["Buenos días a todos. Hoy voy a hablarles de Bogotá."] },
    { en: "First of all, it's a very big city.", es: "En primer lugar, es una ciudad muy grande.", accept: [] },
    { en: "To finish, I'm going to show you some photos.", es: "Para terminar, les voy a mostrar unas fotos.", accept: ["Para terminar, voy a mostrarles unas fotos.", "Para terminar, les voy a mostrar algunas fotos."] },
    { en: "Thank you very much. Any questions?", es: "Muchas gracias. ¿Alguna pregunta?", accept: ["Muchas gracias. ¿[Tienen|Hay] alguna pregunta?"] }
  ],
  translate: [
    { en: "Today I'm going to talk to you about my family. (to an audience)", es: "Hoy les voy a hablar de mi familia.", accept: ["Hoy voy a hablarles de mi familia."] },
    { en: "In this photo you can see downtown. (to an audience)", es: "En esta foto pueden ver el centro.", accept: [] },
    { en: "Also, the food is very good.", es: "Además, la comida es muy buena.", accept: [] },
    { en: "Finally, here's a photo of the lake. (to an audience)", es: "Por último, aquí tienen una foto del lago.", accept: [] }
  ],
  personal: {
    prompt: "Plan a one minute talk about your city or your job: the opening line, two points, and the close.",
    constraints: [
      { type: "regex", pattern: "les voy a hablar de|voy a hablarles de", label: "the opening: *Hoy les voy a hablar de…*" },
      { type: "containsAny", words: ["en primer lugar", "además", "por último"], label: "the points: *En primer lugar…*, *Además…*" },
      { type: "containsAny", words: ["para terminar", "muchas gracias", "alguna pregunta"], label: "the close: *Muchas gracias. ¿Alguna pregunta?*" }
    ],
    model: "Hoy les voy a hablar de Toronto. En primer lugar, es una ciudad muy grande. Además, tiene un lago enorme. Muchas gracias. ¿Alguna pregunta?"
  },
  pitfalls: [
    "*Les voy hablar* drops a word: going to is always *voy a*. *Les voy a hablar.*",
    "*Primero* shortens before *lugar*: *en primer lugar*, never *en primero lugar*.",
    "Don't read out a list of facts. Let the photo show the names and numbers; your sentences link them."
  ]
},

"task-a2-escribir": {
  source: "old",
  hook: {
    line: "Up to now you have written messages. This week ends with two texts that need a middle: a short review of a place you went, and an email asking an office for something.",
    es: "El viernes fuimos a un restaurante nuevo en el centro.\nLa comida estaba muy rica, pero el servicio fue lento.\nMientras estábamos comiendo, empezó a llover en la terraza.\nEn resumen: buena comida, pero hay que tener paciencia.",
    en: "On Friday we went to a new restaurant downtown.\nThe food was delicious, but the service was slow.\nWhile we were eating, it started raining on the terrace.\nIn short: good food, but you need patience."
  },
  examples: [
    { es: "Buenos días. Le escribo para cambiar mi cita del lunes.", en: "Good morning. I'm writing to change my Monday appointment." },
    { es: "Es que el lunes tengo que trabajar.", en: "The thing is, I have to work on Monday." },
    { es: "¿Es posible el martes a la misma hora?", en: "Is Tuesday at the same time possible?" }
  ],
  rule: "Write two texts, each of six sentences or more.\nA review of somewhere you went. When and where, in the event past: *El viernes fuimos a…* How things were, in the describing past: *La comida estaba rica. Había mucha gente.* One good thing and one bad, joined with *pero*. One moment in progress: *Mientras estábamos comiendo, empezó a llover.* Then a verdict: *En resumen…*\nAn email to an office, asking for something. Open: *Buenos días.* Say why: *Le escribo para…* Give the reason: *Es que…* Ask: *¿Es posible…?* Close: *Quedo atento a su respuesta. Un cordial saludo.*\nIn the email, *usted* all the way: *le*, *su*, *puede*.",
  readAndPick: [
    { q: "Good news or bad about the place?", es: "La comida estaba muy rica.",
      options: ["Good: tasty food", "Bad: slow service", "Bad: too expensive"], answer: 0,
      why: "*Rica*: delicious. A good thing for the review." },
    { q: "Which line is the verdict?", es: "Fuimos el viernes por la noche.\nEn resumen, buena comida.",
      options: ["The second", "The first", "Both of them"], answer: 0,
      why: "*En resumen*: in short. The verdict closes the review." },
    { q: "What was already going on when the rain started?", es: "Mientras estábamos comiendo, empezó a llover.",
      options: ["They were eating", "They had paid", "They were outside"], answer: 0,
      why: "*Estábamos comiendo* was going on; *empezó* is what happened." },
    { q: "Why is Ana writing?", es: "Le escribo para cambiar mi cita.",
      options: ["To move her appointment", "To cancel her order", "To ask for a refund"], answer: 0,
      why: "*Para cambiar mi cita*: to change her appointment." },
    { q: "Which closing fits an email to an office?", es: "Un abrazo.\nUn cordial saludo.",
      options: ["The second", "The first", "Either one"], answer: 0,
      why: "*Un abrazo* is for friends. An office gets *un cordial saludo*." },
    { q: "Who is Sam writing to?", es: "¿Me puede confirmar la hora, por favor?",
      options: ["Someone he calls usted", "A good friend", "His little sister"], answer: 0,
      why: "*Puede*, not *puedes*: he is writing to *usted*." }
  ],
  yourTurn: [
    { en: "On Friday we went to a new restaurant.", es: "El viernes fuimos a un restaurante nuevo.", accept: ["El viernes fuimos a un nuevo restaurante.", "Fuimos a un restaurante nuevo el viernes."] },
    { en: "The food was delicious, but the service was slow.", es: "La comida estaba rica, pero el servicio fue lento.", accept: ["La comida estaba [rica|deliciosa|muy rica], pero el servicio [fue|era|estuvo] lento."] },
    { en: "While we were eating, it started to rain.", es: "Mientras estábamos comiendo, empezó a llover.", accept: ["Mientras comíamos, empezó a llover.", "Cuando estábamos comiendo, empezó a llover."] },
    { en: "I'm writing to change my appointment. (to usted)", es: "Le escribo para cambiar mi cita.", accept: [] },
    { en: "The thing is, I have to work on Monday.", es: "Es que el lunes tengo que trabajar.", accept: ["Es que tengo que trabajar el lunes."] }
  ],
  translate: [
    { en: "Is Tuesday at the same time possible?", es: "¿Es posible el martes a la misma hora?", accept: [] },
    { en: "In short: good food, but you need patience. (nobody named)", es: "En resumen: buena comida, pero hay que tener paciencia.", accept: [] },
    { en: "On Saturday I went to a café in Chapinero.", es: "El sábado fui a un café en Chapinero.", accept: [] },
    { en: "Can you confirm the time, please? (polite)", es: "¿Me puede confirmar la hora, por favor?", accept: ["¿Puede confirmarme la hora, por favor?"] }
  ],
  personal: {
    prompt: "Write a short review of somewhere you went recently: when you went, one good thing, one bad thing, and your verdict.",
    constraints: [
      { type: "anyVerbInTense", tense: "preterito", label: "when you went, in the event past: *fui*, *fuimos*…" },
      { type: "containsWord", word: "pero", label: "one good and one bad, joined with *pero*" },
      { type: "containsAny", words: ["en resumen", "en general", "lo recomiendo"], label: "a verdict: *En resumen…*" }
    ],
    model: "El sábado fui a un café en Chapinero. El café estaba muy rico, pero había demasiada gente. En resumen, lo recomiendo para un día tranquilo."
  },
  pitfalls: [
    "A review set all in the event past reads like a police report. How things were takes the describing past: *estaba rica*, *había gente*.",
    "In the email, one *tú* breaks it: *le escribo*, *su respuesta*, never *te* or *tu*.",
    "*Es que* gives the reason before you ask. It's how Colombians soften a request."
  ]
},

/* ---- unit 26 · The grammar under it ------------------------------------ */

"gr-presente-irregular-a2": {
  source: "merged",
  hook: {
    line: "After weeks in the past, back to the present, where the busiest verbs bend. Laura wants Sam for football on Saturday, and every line of his answer has one.",
    es: "Laura: ¿Quieres jugar fútbol el sábado?\nSam: No puedo. Los sábados duermo hasta las diez.\nSam: Y después hago mercado y salgo con Diego.\nLaura: Bueno, ¿y si jugamos el domingo?",
    en: "Laura: Do you want to play football on Saturday?\nSam: I can't. On Saturdays I sleep until ten.\nSam: And then I do the food shopping and go out with Diego.\nLaura: OK, what if we play on Sunday?"
  },
  examples: [
    { es: "Queremos un jugo, pero Laura quiere un tinto.", en: "We want a juice, but Laura wants a black coffee." },
    { es: "Siempre pido lo mismo.", en: "I always order the same thing." },
    { es: "Conozco Cali, pero no conozco la costa.", en: "I know Cali, but I don't know the coast." }
  ],
  rule: "Most verbs that bend in the present follow one of two patterns.\nOne changes a vowel inside the verb, in every form except *nosotros*:\n*e* to *ie*: *quiero, quieres, quiere, queremos, quieren*. Also *empiezo, entiendo, pienso, prefiero*.\n*o* to *ue*: *puedo, duermo, vuelvo, cuesta*. *Jugar* does it with *u*: *juego, jugamos*.\n*e* to *i*, in some *-ir* verbs: *pido, sirvo, repito, sigo*.\nThe other changes only I:\n*-go*: *tengo, hago, salgo, pongo, traigo, vengo, digo*\n*-zco*: *conozco, parezco, ofrezco*\nand *sé, doy, veo*.\nSome do both: *tengo, tienes; vengo, vienes; digo, dices*.\nThe dictionary form won't warn you, so check the I form once when you meet a new verb.",
  readAndPick: [
    { q: "Who wants to go out?", es: "Queremos salir esta noche.",
      options: ["We do", "I do", "They do"], answer: 0,
      why: "*Queremos*: we. The we form keeps the plain *e*." },
    { q: "Which one is right?", es: "Nosotros podemos.\nNosotros puedemos.",
      options: ["The first", "The second", "Both of them"], answer: 0,
      why: "*Nosotros* never changes the vowel: *podemos*." },
    { q: "Who is ordering?", es: "Siempre pido lo mismo.",
      options: ["The speaker", "A friend", "The waiter"], answer: 0,
      why: "*Pido*, with *-o*: I. From *pedir*, *e* to *i*." },
    { q: "What does Sam know?", es: "Conozco Cali, pero no conozco la costa.",
      options: ["Cali, not the coast", "The coast, not Cali", "Both places"], answer: 0,
      why: "*Conozco*: I know, the odd I form of *conocer*." },
    { q: "One person, or a group?", es: "Vienen a las ocho.",
      options: ["A group", "One person", "Just me"], answer: 0,
      why: "*Vienen*, with *-n*: they. From *venir*: *vengo, vienes, vienen*." }
  ],
  yourTurn: [
    { en: "We want a juice.", es: "Queremos un jugo.", accept: [] },
    { en: "On Saturdays I sleep until ten.", es: "Los sábados duermo hasta las diez.", accept: [] },
    { en: "I always order the same thing.", es: "Siempre pido lo mismo.", accept: [] },
    { en: "I don't know your brother. (to a friend)", es: "No conozco a tu hermano.", accept: [] },
    { en: "I go out at eight and come back at six.", es: "Salgo a las ocho y vuelvo a las seis.", accept: [] }
  ],
  translate: [
    { en: "Laura wants a black coffee.", es: "Laura quiere un tinto.", accept: [] },
    { en: "Then I do the food shopping and go out with Diego.", es: "Después hago mercado y salgo con Diego.", accept: ["[Después|Luego] hago mercado y salgo con Diego."] },
    { en: "I know Cali, but I don't know the coast.", es: "Conozco Cali, pero no conozco la costa.", accept: [] },
    { en: "They're coming at eight.", es: "Vienen a las ocho.", accept: [] }
  ],
  personal: {
    prompt: "Describe your weekend in two lines, with at least two verbs that bend: *duermo, juego, salgo, hago, quiero…*",
    constraints: [
      { type: "containsAny", words: ["quiero", "puedo", "duermo", "juego", "vuelvo", "empiezo", "prefiero", "pido", "sigo", "pienso", "entiendo"], label: "a verb that changes a vowel: *duermo*, *juego*, *prefiero*…" },
      { type: "containsAny", words: ["tengo", "hago", "salgo", "pongo", "traigo", "vengo", "digo", "conozco"], label: "an odd I form: *tengo*, *hago*, *salgo*…" }
    ],
    model: "Los sábados duermo hasta tarde y después hago mercado. Los domingos salgo con amigos o juego fútbol."
  },
  pitfalls: [
    "*Nosotros* never changes the vowel: *queremos, podemos, dormimos, pedimos*.",
    "Only the vowel inside changes. The endings are the ones you already know.",
    "*Sé*, I know, carries a mark. Without it, *se* is a different word."
  ]
},

"gr-articulo-definido-distribucion-a2": {
  source: "merged",
  hook: {
    line: "Sam stops at a shop after football, and the very first word trips him up: *agua* is a *la* word, so why does everyone say *el agua*?",
    es: "Sam: ¿Me regala un agua fría, por favor?\nTendero: Claro. El agua fría está en la nevera, al fondo.\nSam: Gracias. Es que jugamos fútbol toda la mañana.",
    en: "Sam: Could I have a cold water, please?\nShopkeeper: Sure. The cold water is in the fridge, at the back.\nSam: Thanks. We played football all morning, you see."
  },
  examples: [
    { es: "Tengo mucha hambre.", en: "I'm really hungry." },
    { es: "¿Juegas al tenis?", en: "Do you play tennis? (to a friend)" },
    { es: "Trabajo todos los días, pero el domingo duermo todo el día.", en: "I work every day, but on Sunday I sleep all day." }
  ],
  rule: "Three places where *el* and *la* behave oddly.\n*El agua.* *Agua* is a *la* word, but *la agua* runs two a's together where the voice leans, so Spanish says *el agua*, *un agua*. Same with *el hambre*, *el área*. Everything else stays *la*: *el agua fría*, *mucha hambre*, *las aguas*. *La arepa* keeps *la*: the voice leans on *re*.\nGames and sports: *jugar al fútbol*, or in Colombia just *jugar fútbol*. Both are right.\n*Todo* goes before *el*, *la*, *los*, *las*: *todos los días* is every day, *todo el día* is all day. Never *los todos*.\nA number goes after: *los dos amigos*, *mis tres hermanas*.",
  readAndPick: [
    { q: "Which one is right?", es: "El agua está fría.\nEl agua está frío.",
      options: ["The first", "The second", "Both of them"], answer: 0,
      why: "*Agua* is still a *la* word, so *fría*. The *el* is only for the sound." },
    { q: "Every day, or all day?", es: "Trabajo todo el día.",
      options: ["All day long", "Every day", "Every other day"], answer: 0,
      why: "*Todo el día*, singular: the whole day." },
    { q: "Every day, or all day?", es: "Trabajo todos los días.",
      options: ["Every day", "All day long", "Once a day"], answer: 0,
      why: "*Todos los días*, plural: every day." },
    { q: "How hungry is Diego?", es: "Tengo mucha hambre.",
      options: ["Very hungry", "A bit hungry", "Not hungry"], answer: 0,
      why: "*Mucha*, because *hambre* is a *la* word, even with *el hambre*." },
    { q: "Are both of these right in Colombia?", es: "Juego al fútbol.\nJuego fútbol.",
      options: ["Yes, both of them", "Only the first", "Only the second"], answer: 0,
      why: "With or without *al*, both are everyday Colombian Spanish." }
  ],
  yourTurn: [
    { en: "The water is very cold.", es: "El agua está muy fría.", accept: [] },
    { en: "I'm very hungry.", es: "Tengo mucha hambre.", accept: [] },
    { en: "Do you play football? (to a friend)", es: "¿Juegas fútbol?", accept: ["¿Juegas al fútbol?"] },
    { en: "I work every day.", es: "Trabajo todos los días.", accept: [] },
    { en: "We slept all day.", es: "Dormimos todo el día.", accept: [] }
  ],
  translate: [
    { en: "The cold water is in the fridge, at the back.", es: "El agua fría está en la nevera, al fondo.", accept: [] },
    { en: "Do you play tennis? (to a friend)", es: "¿Juegas al tenis?", accept: ["¿Juegas (al) tenis?"] },
    { en: "I work every day, but on Sunday I sleep all day.", es: "Trabajo todos los días, pero el domingo duermo todo el día.", accept: ["Trabajo todos los días, pero [el domingo|los domingos] duermo todo el día."] },
    { en: "My three sisters live in Cali.", es: "Mis tres hermanas viven en Cali.", accept: [] }
  ],
  personal: {
    prompt: "Write two true lines: something you do every day, and a day you spent doing one thing the whole day.",
    constraints: [
      { type: "regex", pattern: "\\btod[oa]s (los|las)\\s+\\S+", label: "every: *todos los días*, *todas las noches*" },
      { type: "regex", pattern: "\\btod[oa] (el|la)\\s+\\S+", label: "the whole of one: *todo el día*, *toda la tarde*" }
    ],
    model: "Tomo café todos los días. El domingo pasado dormí toda la mañana."
  },
  pitfalls: [
    "*El agua* is still a *la* word: *el agua fría*, never *frío*.",
    "*Todos días* drops a word Spanish needs: *todos los días*.",
    "*Todo el día* is the whole day; *todos los días* is every day."
  ]
},

"gr-cuantificadores-a2": {
  source: "merged",
  hook: {
    line: "Diego never stops at one tinto, and asking for more has a trap for English speakers: Spanish puts no *un* in front of *otro*.",
    es: "Diego: ¿Me regala otro tinto, por favor?\nMesera: Claro. ¿Algo más?\nDiego: No, nada más. Bueno, otra arepa también.\nLaura: ¡Diego, comes demasiado!",
    en: "Diego: Could I have another black coffee, please?\nWaitress: Of course. Anything else?\nDiego: No, nothing else. Well, another arepa too.\nLaura: Diego, you eat too much!"
  },
  examples: [
    { es: "Todo el mundo conoce a Diego.", en: "Everybody knows Diego." },
    { es: "Cada día aprendo algo nuevo.", en: "Every day I learn something new." },
    { es: "La otra mesa está libre.", en: "The other table is free." }
  ],
  rule: "*Otro* already has the an inside it, so never put *un* in front: *otro tinto*, *otra arepa*. With *el* or *la*, it's the other one: *la otra mesa*. Two more is *otros dos*. Again is *otra vez*.\n*Todo el mundo* is everybody, with the he or she verb: *Todo el mundo sabe.*\n*Cada* is each or every, and never changes: *cada día*, *cada semana*, *cada uno*.\n*Algo* is something, or anything in a question: *¿Quieres algo?* After *no*, it becomes *nada*: *No quiero nada.*\n*Demasiado* is too much, a complaint. It matches a thing, *demasiada gente*, but not a describing word: *demasiado caro*.",
  readAndPick: [
    { q: "Has Diego already had a coffee?", es: "¿Me regala otro tinto?",
      options: ["Yes, at least one", "No, not yet", "He's ordering for two"], answer: 0,
      why: "*Otro*: one more, so he has had one already." },
    { q: "Which table is free?", es: "La otra mesa está libre.",
      options: ["The other one", "Another one", "This one here"], answer: 0,
      why: "With *la*, *otra* is the other one, not just any." },
    { q: "How many people know?", es: "Todo el mundo sabe.",
      options: ["Everybody", "Nobody yet", "Just one person"], answer: 0,
      why: "*Todo el mundo*: everybody, with a singular verb." },
    { q: "Does Ana want anything?", es: "No, gracias, no quiero nada.",
      options: ["No, nothing", "Yes, something", "Only a little"], answer: 0,
      why: "After *no*, anything is *nada*." },
    { q: "Is Laura pleased about the crowd?", es: "Hay demasiada gente aquí.",
      options: ["No, it's too much", "Yes, it's lively", "She doesn't mind"], answer: 0,
      why: "*Demasiado* is more than you want: a complaint." },
    { q: "How often does Sam learn something new?", es: "Cada día aprendo algo nuevo.",
      options: ["Every day", "Some days", "Once a week"], answer: 0,
      why: "*Cada día*: each day, every day." }
  ],
  yourTurn: [
    { en: "Could I have another black coffee, please?", es: "¿Me regala otro tinto, por favor?", accept: ["¿Me [da|trae|regala] otro [tinto|café], por favor?"] },
    { en: "The other table is free.", es: "La otra mesa está libre.", accept: [] },
    { en: "Everybody knows Diego.", es: "Todo el mundo conoce a Diego.", accept: ["Todos conocen a Diego."] },
    { en: "I don't want anything, thanks.", es: "No quiero nada, gracias.", accept: [] },
    { en: "There are too many people.", es: "Hay demasiada gente.", accept: [] }
  ],
  translate: [
    { en: "Every day I learn something new.", es: "Cada día aprendo algo nuevo.", accept: ["[Cada día|Todos los días] aprendo algo nuevo."] },
    { en: "No, nothing else. Well, another arepa too.", es: "No, nada más. Bueno, otra arepa también.", accept: [] },
    { en: "Diego, you eat too much!", es: "¡Diego, comes demasiado!", accept: [] },
    { en: "This exam is too difficult.", es: "Este examen es demasiado difícil.", accept: [] }
  ],
  personal: {
    prompt: "You're at a café with a friend. Order one more of something, and say that one thing is too much.",
    constraints: [
      { type: "regex", pattern: "\\botr[oa]s?\\s+\\S+", label: "one more: *otro…* or *otra…*" },
      { type: "avoidsAny", words: ["un otro", "una otra"], label: "no *un* or *una* before it" },
      { type: "containsAny", words: ["demasiado", "demasiada", "demasiados", "demasiadas"], label: "too much: *demasiado…*" }
    ],
    model: "¿Me regala otra arepa, por favor? Este café es demasiado fuerte."
  },
  pitfalls: [
    "*Un otro café* is English talking: *otro café*.",
    "*Todo el mundo* is one crowd: *todo el mundo sabe*, never *saben*.",
    "*No quiero algo* is a slip: after *no*, anything is *nada*."
  ]
},

"gr-interrogativos-exclamativos-a2": {
  source: "merged",
  hook: {
    line: "Sam is opening a bank account, and the clerk's questions all begin with what in English. In Spanish, half of them begin with *cuál*. Then she reacts to his Spanish.",
    es: "Empleada: ¿Cuál es su dirección?\nSam: Calle 45, número 12. ¿Qué documentos necesito?\nEmpleada: Solo el pasaporte. ¡Qué bien habla español!",
    en: "Clerk: What's your address?\nSam: 45th Street, number 12. What documents do I need?\nClerk: Just your passport. You speak Spanish so well!"
  },
  examples: [
    { es: "¿Cuál prefieres, el rojo o el azul?", en: "Which do you prefer, the red one or the blue one? (to a friend)" },
    { es: "¿Qué es una cédula?", en: "What is a cédula?" },
    { es: "¡Qué casa tan bonita!", en: "What a lovely house!" }
  ],
  rule: "English has one what; Spanish has two.\nBefore *es* or *son*, think what you want back. A piece of information, like a number, a name or an address: *¿Cuál es tu número?* What a word means: *¿Qué es una cédula?*\nRight before a thing, *qué*: *¿Qué documentos necesito?*\nChoosing from things you can see: *¿Cuál quieres?* More than one: *¿Cuáles?*\nTo react, the same *qué*, with its mark:\n*¡Qué bonito! ¡Qué rico!*\n*¡Qué* plus a thing plus *tan* plus a describing word: *¡Qué casa tan bonita!*, with no *una*.\n*¡Qué bien* plus a verb: *¡Qué bien cocinas!*\n*¡Cuánto!* matches its thing: *¡Cuánta gente! ¡Cuánto tiempo!*",
  readAndPick: [
    { q: "What does the clerk want?", es: "¿Cuál es su número de cédula?",
      options: ["Your card number", "What the card is", "Your full name"], answer: 0,
      why: "*¿Cuál es…?* asks for a piece of information: the number itself." },
    { q: "What does Sam want to know?", es: "¿Qué es una cédula?",
      options: ["What it is", "Where to get it", "How much it costs"], answer: 0,
      why: "*¿Qué es…?* asks what a word means." },
    { q: "Is Laura asking or reacting?", es: "¡Cuánta gente!",
      options: ["Reacting to a crowd", "Asking how many", "Counting the people"], answer: 0,
      why: "The *¡ !* marks a reaction: so many people! A question needs *¿ ?*." },
    { q: "How many things does Diego expect you to pick?", es: "¿Cuáles prefieres?",
      options: ["More than one", "Just one", "None at all"], answer: 0,
      why: "*Cuáles*, with *-es*: which ones. More than one." },
    { q: "What does Ana think of the house?", es: "¡Qué casa tan bonita!",
      options: ["It's lovely", "It's very big", "It isn't hers"], answer: 0,
      why: "*¡Qué casa tan bonita!*: what a lovely house." },
    { q: "What does Laura think of Sam's cooking?", es: "¡Qué bien cocinas!",
      options: ["It's very good", "It's too salty", "It's quick"], answer: 0,
      why: "*¡Qué bien* plus the verb: you cook so well." }
  ],
  yourTurn: [
    { en: "What's your phone number? (to a friend)", es: "¿Cuál es tu número de celular?", accept: ["¿Cuál es tu número?", "¿Cuál es tu celular?"] },
    { en: "What documents do I need?", es: "¿Qué documentos necesito?", accept: [] },
    { en: "Which one do you want? (to a friend, choosing between two)", es: "¿Cuál quieres?", accept: [] },
    { en: "What a lovely house!", es: "¡Qué casa tan bonita!", accept: ["¡Qué casa [tan|más] [bonita|linda]!", "¡Qué bonita casa!"] },
    { en: "So many people!", es: "¡Cuánta gente!", accept: ["¡Cuánta gente hay!"] }
  ],
  translate: [
    { en: "What's your address? (polite)", es: "¿Cuál es su dirección?", accept: [] },
    { en: "What is a cédula?", es: "¿Qué es una cédula?", accept: [] },
    { en: "You cook so well! (to a friend)", es: "¡Qué bien cocinas!", accept: [] },
    { en: "Which ones do you prefer? (to a friend)", es: "¿Cuáles prefieres?", accept: [] }
  ],
  personal: {
    prompt: "Ask a new friend two questions, one with *¿Cuál es…?* and one with *¿Qué…?* before a thing. Then react to an answer with *¡Qué…!*",
    constraints: [
      { type: "regex", pattern: "¿\\s*cu[aá]l(es)?\\s+(es|son)\\b", label: "a question with *¿Cuál es…?*" },
      { type: "regex", pattern: "¿\\s*qu[eé]\\s+\\S+", label: "a question with *¿Qué…?* before a thing" },
      { type: "regex", pattern: "¡\\s*(qu[eé]|cu[aá]nt)", label: "a reaction: *¡Qué…!*" }
    ],
    model: "¿Cuál es tu comida favorita? ¿Qué música escuchas? ¡Qué chévere!"
  },
  pitfalls: [
    "*¿Qué es tu nombre?* asks what a name is. For the name itself: *¿Cuál es tu nombre?*, or *¿Cómo te llamas?*",
    "*¡Qué una sorpresa!* is English talking: no *una*. *¡Qué sorpresa!*",
    "The mark makes it a reaction: *¡Qué bien!*, never *que bien*."
  ]
},

"gr-demostrativos-valores-a2": {
  source: "merged",
  hook: {
    line: "Laura's grandmother is telling the story of the day she met her husband. Watch how she points at time: *esta* for the week she is in, *ese* and *aquel* for the days in her story.",
    es: "Abuela: Esta semana cumplimos cincuenta años de casados.\nAbuela: Lo conocí en 1974. Ese día llovía mucho.\nAbuela: En aquella época no había celulares, ¿sabes?",
    en: "Grandmother: This week is our fiftieth wedding anniversary.\nGrandmother: I met him in 1974. That day it was raining hard.\nGrandmother: Back then there were no mobile phones, you know?"
  },
  examples: [
    { es: "Esta mañana fui al médico.", en: "This morning I went to the doctor." },
    { es: "Ese día no fui a trabajar.", en: "That day I didn't go to work." },
    { es: "¿Este es tu libro?\nNo, ese no. El mío es el azul.", en: "Is this your book?\nNo, not that one. Mine is the blue one." }
  ],
  rule: "*Este, ese, aquel* also point at time.\n*este, esta*: the stretch you are in now: *esta mañana, esta semana, este año*. In Latin America, what happened this morning takes the event past: *Esta mañana fui al médico.*\n*ese, esa*: the day or night in your story: *ese día, esa noche*. Not *este día*.\n*aquel, aquella*: further back, often with the describing past: *En aquella época no había celulares.* *En esa época* works too.\n*Eso* points back at what someone just said: *Eso es verdad. Por eso no fui.*\nTo turn down a thing already on the table: *No, ese no.* No need to name it again.",
  readAndPick: [
    { q: "When did Sam go to the doctor?", es: "Esta mañana fui al médico.",
      options: ["Earlier today", "Yesterday morning", "Tomorrow morning"], answer: 0,
      why: "*Esta mañana*: the morning we are in. *Fui*: it's done." },
    { q: "Which day is the grandmother talking about?", es: "Ese día llovía mucho.",
      options: ["The day in the story", "Today, right now", "Every rainy day"], answer: 0,
      why: "*Ese día*: the day she is telling, not today." },
    { q: "Is she talking about now, or long ago?", es: "En aquella época no había celulares.",
      options: ["Long ago", "Nowadays", "Next year"], answer: 0,
      why: "*Aquella época*: back then, far from now." },
    { q: "What does *eso* point at?", es: "Diego dijo que no viene. ¿Eso es verdad?",
      options: ["What Diego said", "Diego himself", "A thing on the table"], answer: 0,
      why: "*Eso* points back at an idea: what was just said." },
    { q: "Does Laura want that shirt?", es: "No, esa no. La otra.",
      options: ["No, a different one", "Yes, that one", "She wants both"], answer: 0,
      why: "*Esa no*: not that one. The shirt is already on the table, so no need to name it." },
    { q: "Which is right for a day in a story?", es: "Este día llovió.\nEse día llovió.",
      options: ["The second", "The first", "Both of them"], answer: 0,
      why: "The day you're telling is *ese día*, or *aquel día*." }
  ],
  yourTurn: [
    { en: "This morning I went to the doctor.", es: "Esta mañana fui al médico.", accept: [] },
    { en: "That day it was raining hard.", es: "Ese día llovía mucho.", accept: ["Aquel día llovía mucho."] },
    { en: "Back then there were no mobile phones.", es: "En esa época no había celulares.", accept: ["En aquella época no había celulares.", "En ese tiempo no había celulares."] },
    { en: "That's true.", es: "Eso es verdad.", accept: ["Eso es cierto."] },
    { en: "No, not that one. (a shirt)", es: "No, esa no.", accept: [] }
  ],
  translate: [
    { en: "This week is our fiftieth wedding anniversary.", es: "Esta semana cumplimos cincuenta años de casados.", accept: [] },
    { en: "That day I didn't go to work.", es: "Ese día no fui a trabajar.", accept: ["[Ese|Aquel] día no fui a trabajar."] },
    { en: "Is this your book? No, not that one. Mine is the blue one. (to a friend)", es: "¿Este es tu libro? No, ese no. El mío es el azul.", accept: ["¿Es este tu libro? No, ese no. El mío es el azul."] },
    { en: "This year we're not going to go to the beach.", es: "Este año no vamos a ir a la playa.", accept: [] }
  ],
  personal: {
    prompt: "Write two lines: something you did this week, and something about a time long ago, with *ese día* or *en esa época*.",
    constraints: [
      { type: "regex", pattern: "\\b(esta|este)\\s+(mañana|tarde|noche|semana|año|mes|fin)", label: "now: *esta semana*, *este año*…" },
      { type: "regex", pattern: "\\b(ese|esa|aquel|aquella)\\s+(d[ií]a|noche|época|año|tiempo|tarde|mañana|semana|vez)", label: "back then: *ese día*, *en esa época*…" }
    ],
    model: "Esta semana fui dos veces al gimnasio. De niño vivía en Ottawa; en esa época no hablaba español."
  },
  pitfalls: [
    "What happened this morning takes the event past in Latin America: *esta mañana fui*. Spain says *he ido*.",
    "In a story, the day you're telling is *ese día* or *aquel día*, not *este día*.",
    "*Eso* points at an idea, and never changes: *Eso es verdad*, not *Ese es verdad*."
  ]
},

"task-a2-repaso": {
  source: "old",
  hook: {
    line: "You have written a weekend, a childhood, an anecdote, a comparison, a decision and a review. The last A2 task is your own work, read three times for three things. This paragraph has been through all three passes.",
    es: "Era sábado y llovía mucho.\nFui a una librería, compré un libro y lo leí en dos días.\nMi hermana lo quería, así que se lo di.",
    en: "It was Saturday and it was raining hard.\nI went to a bookshop, bought a book and read it in two days.\nMy sister wanted it, so I gave it to her."
  },
  examples: [
    { es: "Cuando llegué, Laura estaba en la cocina.", en: "When I arrived, Laura was in the kitchen." },
    { es: "¿Las llaves? Las dejé en la mesa.", en: "The keys? I left them on the table." },
    { es: "Las casas eran pequeñas y blancas.", en: "The houses were small and white." }
  ],
  rule: "Open three things you wrote earlier in A2. Read each one three times, looking for one thing only on each pass.\nFirst, the two pasts. Is every event in the event past and every scene in the describing past? *Era sábado y llovía* sets the scene; *sonó el teléfono* is what happened.\nSecond, the little words. Any thing named twice? Swap it: *compré un libro y lo leí*. Any *le lo*? It's *se lo*.\nThird, agreement. Does every *el*, *la*, *-o*, *-a* and *-s* match its thing? *las casas pequeñas*.\nThen write the corrected version and keep the old one next to it.",
  readAndPick: [
    { q: "Setting the scene: which is right?", es: "Era sábado y llovía.\nFue sábado y llovió.",
      options: ["The first", "The second", "Both of them"], answer: 0,
      why: "The scene takes the describing past: *era*, *llovía*." },
    { q: "Which line repeats less?", es: "Compré un libro y leí el libro.\nCompré un libro y lo leí.",
      options: ["The second", "The first", "Both are fine"], answer: 0,
      why: "*Lo* stands in for *el libro*, so you don't say it twice." },
    { q: "How should this end?", es: "Mi hermana lo quería, así que…",
      options: ["se lo di", "le lo di", "lo le di"], answer: 0,
      why: "Before *lo*, *le* becomes *se*: *se lo di*." },
    { q: "Which describes the houses?", es: "Las casas eran pequeño.\nLas casas eran pequeñas.",
      options: ["The second", "The first", "Both of them"], answer: 0,
      why: "*Casas* is a *la* word and plural: *pequeñas*." },
    { q: "Scene or event?", es: "Laura estaba en la cocina.",
      options: ["A scene", "An event", "A plan"], answer: 0,
      why: "*Estaba*: the describing past, where things stood." },
    { q: "Scene or event?", es: "De repente, sonó el teléfono.",
      options: ["An event", "A scene", "A habit"], answer: 0,
      why: "*De repente* and *sonó*: something happened." }
  ],
  yourTurn: [
    { en: "It was Saturday and it was raining.", es: "Era sábado y llovía.", accept: ["Era sábado y estaba lloviendo."] },
    { en: "I bought a book and read it.", es: "Compré un libro y lo leí.", accept: [] },
    { en: "My sister wanted it, so I gave it to her. (the book)", es: "Mi hermana lo quería, así que se lo di.", accept: ["Mi hermana lo quería, [entonces|por eso] se lo di."] },
    { en: "The houses were small and white.", es: "Las casas eran pequeñas y blancas.", accept: [] }
  ],
  translate: [
    { en: "When I arrived, Laura was in the kitchen.", es: "Cuando llegué, Laura estaba en la cocina.", accept: [] },
    { en: "The keys? I left them on the table.", es: "¿Las llaves? Las dejé en la mesa.", accept: [] },
    { en: "I went to a bookshop, bought a book and read it in two days.", es: "Fui a una librería, compré un libro y lo leí en dos días.", accept: [] },
    { en: "Then I saw Laura and invited her for a coffee.", es: "Después vi a Laura y la invité a un café.", accept: ["[Después|Luego] vi a Laura y la invité a (tomar) un café."] }
  ],
  personal: {
    prompt: "Write three lines about a day out: set the scene, say what happened, and use *lo* or *la* so a thing isn't named twice. Then read it back three times, once for each pass.",
    constraints: [
      { type: "anyVerbInTense", tense: "imperfecto", label: "the scene, in the describing past: *era*, *hacía*…" },
      { type: "anyVerbInTense", tense: "preterito", label: "what happened, in the event past: *fui*, *compré*…" },
      { type: "regex", pattern: "\\b(lo|la|los|las)\\s+(\\S*(é|í|ó|aste|iste|amos|imos|aron|ieron)|di|dio|vi|vio)(?![a-záéíóúñ])", label: "*lo* or *la* in place of a thing: *lo compré*, *la vi*" }
    ],
    model: "Era domingo y hacía sol. Compré un helado y me lo comí en el parque. Después vi a Laura y la invité a un café."
  },
  pitfalls: [
    "A scene told in the event past reads like a police report: *era*, *estaba*, *había* set it.",
    "Two little words together: *le* becomes *se* before *lo*. *Se lo di*, never *le lo di*.",
    "Keep the old version next to the new one. Seeing the two side by side is what makes it stick."
  ]
},

/* ---- lessons the re-sequenced course places on the A2 path ------------- */

/* week · Yesterday, in full (1 of 2) */

"gr-indefinido-irregular-a2": {
  source: "rebuild",
  hook: {
    line: "You already tell your day with *trabajé* and *comí*, plus *fui* and *hice*. The verbs people use most in a story change their middle in this past: *tuve*, *pude*, *vino*, *dijo*. Here they are, as one family.",
    es: "Laura: ¿Por qué no viniste anoche?\nDiego: Tuve que trabajar hasta tarde y no pude salir.\nDiego: Te escribí, pero el mensaje no llegó.",
    en: "Laura: Why didn't you come last night?\nDiego: I had to work late and I couldn't go out.\nDiego: I texted you, but the message didn't arrive."
  },
  examples: [
    { es: "El sábado tuve que trabajar, pero el domingo pude descansar.", en: "On Saturday I had to work, but on Sunday I managed to rest." },
    { es: "¿Qué te dijo el médico?\nMe dijo que tengo que dormir más.", en: "What did the doctor tell you?\nShe told me I have to sleep more." },
    { es: "Llegué tarde porque el bus no vino.", en: "I got there late because the bus didn't come." }
  ],
  rule: "These verbs take a new middle, then share one set of endings with no accent mark: *-e, -iste, -o, -imos, -ieron*.\n*tener*: *tuve, tuviste, tuvo, tuvimos, tuvieron*\n*estar*: *estuve*. *poder*: *pude*. *poner*: *puse*. *querer*: *quise*. *venir*: *vine*.\n*hacer*: *hice*, and *hizo* for he or she.\n*decir* and *traer* end in *j*, and the they form drops its *i*: *dije, dijeron*; *traje, trajeron*.\nThree spellings change in the I form only, to keep the sound: *busqué, llegué, empecé*.\n*Leer* writes a *y*: *leyó, leyeron*.\nThe *-ir* verbs that change in the present change for he, she and they: *pidió, pidieron, durmió, durmieron*.",
  readAndPick: [
    { q: "Who couldn't come?", es: "No pudo venir.",
      options: ["Someone else", "A whole group", "The speaker"], answer: 0,
      why: "*Pudo* ends in *-o* with no accent mark: he or she. I couldn't is *no pude*." },
    { q: "Who ordered the soup?", es: "Yo pedí arroz y mi hermana pidió sopa.",
      options: ["The sister", "The speaker", "Both of them"], answer: 0,
      why: "*Pidió*: the *e* becomes *i* for he or she. The I form stays *pedí*." },
    { q: "Did the speaker bring the wine?", es: "Traje el vino, pero no traje el pan.",
      options: ["Yes, but not the bread", "No, only the bread", "Yes, and the bread"], answer: 0,
      why: "*Traje* is I brought, from *traer*. The wine came; the bread didn't." },
    { q: "Has she started the new job?", es: "Empecé el trabajo nuevo el lunes.",
      options: ["Yes, on Monday", "Not yet", "No, next Monday"], answer: 0,
      why: "*Empecé* is the past of *empezar*: the *z* is written *c* before *é*, same sound." },
    { q: "What did they tell her?", es: "Me dijeron la verdad.",
      options: ["The truth", "A lie", "Nothing at all"], answer: 0,
      why: "*Dijeron*, from *decir*: they told. No *i* after the *j*." }
  ],
  yourTurn: [
    { en: "I had to work on Saturday.", es: "Tuve que trabajar el sábado.", accept: ["(Yo) tuve que trabajar el sábado.", "El sábado (yo) tuve que trabajar.", "(Yo) tuve que trabajar el sábado pasado."] },
    { en: "She couldn't come.", es: "No pudo venir.", accept: ["(Ella) no pudo venir.", "(Ella) no pudo ir.", "(Ella) no alcanzó a venir."] },
    { en: "What did he tell you? (to a friend)", es: "¿Qué te dijo?", accept: ["¿Qué te dijo (él)?", "¿(Él) qué te dijo?", "¿Qué fue lo que te dijo?"] },
    { en: "I brought the wine.", es: "Traje el vino.", accept: ["(Yo) traje el vino.", "(Yo) ya traje el vino.", "El vino lo traje yo."] },
    { en: "My sister ordered soup.", es: "Mi hermana pidió sopa.", accept: ["Mi hermana pidió (una) sopa.", "Mi hermana pidió la sopa.", "Mi hermana se pidió una sopa."] }
  ],
  translate: [
    { en: "On Saturday I had to work, but on Sunday I managed to rest.", es: "El sábado tuve que trabajar, pero el domingo pude descansar.", accept: ["El sábado (yo) tuve que trabajar, pero el domingo (yo) pude descansar.", "El sábado tuve que trabajar, pero el domingo alcancé a descansar.", "Tuve que trabajar el sábado, pero el domingo pude descansar."] },
    { en: "I got there late because the bus didn't come.", es: "Llegué tarde porque el bus no vino.", accept: ["(Yo) llegué tarde porque el bus no [vino|pasó|llegó].", "(Yo) llegué tarde porque no [vino|pasó|llegó] el bus.", "(Yo) llegué tarde porque el bus nunca [vino|pasó|llegó]."] },
    { en: "They told me the truth.", es: "Me dijeron la verdad.", accept: ["(Ellos) me dijeron la verdad.", "(Ellas) me dijeron la verdad.", "La verdad me la dijeron (ellos)."] },
    { en: "She read the whole book in two days.", es: "Leyó todo el libro en dos días.", accept: ["(Ella) leyó todo el libro en dos días.", "(Ella) leyó el libro completo en dos días.", "(Ella) se leyó todo el libro en dos días."] }
  ],
  personal: {
    prompt: "Think of a day last week that didn't go to plan. Write two true sentences: something you had to do, and something you couldn't do or didn't do.",
    constraints: [
      { type: "containsAny", words: ["tuve", "estuve", "pude", "hice", "dije", "vine", "traje", "puse", "quise"], label: "one of this lesson's pasts: *tuve*, *pude*, *hice*…" },
      { type: "negation", label: "something that didn't happen, with *no*" },
      { type: "minWords", n: 8, label: "at least eight words" }
    ],
    model: "El martes tuve que ir al médico, así que no pude ir al gimnasio y no hice la tarea."
  },
  pitfalls: [
    "*Tení*, *hací* and *podí* follow the regular pattern, and for these verbs it's wrong: *tuve*, *hice*, *pude*.",
    "No accent mark on the new forms: *tuve*, *pudo*, *hizo*, never *tuvé* or *pudó*.",
    "After *j*, no *i*: *dijeron*, *trajeron*. *Dijieron* is the most common slip with these verbs."
  ]
},

"dc-deixis-temporal-a2": {
  source: "rebuild",
  hook: {
    line: "*Ayer* only means something if you know when it was said. Tell a story about another day and the time words move with it: *ese día*, *el día anterior*, *al día siguiente*.",
    es: "Hoy estoy en Bogotá. Ayer llegué de Cali y mañana voy a Medellín.\nEse día estaba en Bogotá. El día anterior llegué de Cali y al día siguiente fui a Medellín.",
    en: "Today I'm in Bogotá. I got here from Cali yesterday and tomorrow I'm going to Medellín.\nThat day I was in Bogotá. I got there from Cali the day before and the next day I went to Medellín."
  },
  examples: [
    { es: "Llegué a Bogotá en 2020. Ese año conocí a Laura.", en: "I arrived in Bogotá in 2020. That year I met Laura." },
    { es: "Llegamos a la finca el viernes y al día siguiente fuimos al río.", en: "We got to the farm on Friday and the next day we went to the river." },
    { es: "Anoche no pude dormir.", en: "I couldn't sleep last night." }
  ],
  rule: "*Ahora, hoy, ayer, mañana, este año* point from the moment you're talking.\nTell a story set on another day and they move with it:\n*ahora*: now. *entonces* or *en ese momento*: then\n*hoy*: today. *ese día*: that day\n*ayer*: yesterday. *el día anterior*: the day before\n*mañana*: tomorrow. *al día siguiente*: the next day\n*esta semana*: this week. *esa semana*: that week\n*este año*: this year. *ese año* or *aquel año*: that year\n*Anoche* is last night; in a story, *la noche anterior*.\nTo put two events in order, *antes de* and *después de*, plus the dictionary form or a thing: *antes de salir*, *después del almuerzo*.",
  readAndPick: [
    { q: "Laura is telling a story about a trip. When did they go to the beach?", es: "Llegamos el sábado y al día siguiente fuimos a la playa.",
      options: ["The Sunday", "Saturday", "Friday night"], answer: 0,
      why: "*Al día siguiente*: the next day, counted from the Saturday in the story." },
    { q: "Which day is *el día anterior* here?", es: "El examen fue el martes. El día anterior estudié diez horas.",
      options: ["The Monday before", "The Wednesday", "That Tuesday"], answer: 0,
      why: "*El día anterior*: the day before the Tuesday in the story, so Monday." },
    { q: "Is Diego talking about today?", es: "Ese día llovió mucho y no salimos.",
      options: ["No, another day", "Yes, this morning", "Yes, today"], answer: 0,
      why: "*Ese día*: that day, in the story. Today would be *hoy*." },
    { q: "When did the speaker meet Laura?", es: "Llegué a Bogotá en 2020. Ese año conocí a Laura.",
      options: ["In 2020, that year", "Just this year", "The year after"], answer: 0,
      why: "*Ese año* points back to 2020. This year would be *este año*." },
    { q: "What came first?", es: "Antes de salir, cerré las ventanas.",
      options: ["The windows", "Going out", "Both at the same time"], answer: 0,
      why: "*Antes de salir*: before going out. The windows came first." }
  ],
  yourTurn: [
    { en: "That day it rained a lot.", es: "Ese día llovió mucho.", accept: ["[Ese|Aquel] día llovió mucho.", "Llovió mucho [ese|aquel] día.", "Ese día llovió muchísimo."] },
    { en: "The next day we went to the river.", es: "Al día siguiente fuimos al río.", accept: ["Al [día siguiente|otro día] (nosotros) fuimos al río.", "(Nosotros) fuimos al río al [día siguiente|otro día].", "Al día siguiente nos fuimos al río."] },
    { en: "The day before, I studied ten hours.", es: "El día anterior estudié diez horas.", accept: ["El día anterior (yo) estudié diez horas.", "El día antes (yo) estudié diez horas.", "(Yo) estudié diez horas el día anterior."] },
    { en: "I couldn't sleep last night.", es: "Anoche no pude dormir.", accept: ["Anoche (yo) no pude dormir.", "(Yo) no pude dormir anoche.", "(Yo) anoche no pude dormir."] },
    { en: "Before going out, I closed the windows.", es: "Antes de salir, cerré las ventanas.", accept: ["Antes de salir, (yo) cerré las ventanas.", "(Yo) cerré las ventanas antes de salir.", "Antes de salir (yo) cerré las ventanas."] }
  ],
  translate: [
    { en: "I arrived in Bogotá in 2020. That year I met Laura.", es: "Llegué a Bogotá en 2020. Ese año conocí a Laura.", accept: ["(Yo) llegué a Bogotá en 2020. [Ese|Aquel] año (yo) conocí a Laura.", "Llegué a Bogotá en 2020 y ese año conocí a Laura.", "Llegué a Bogotá en el 2020. Ese año conocí a Laura."] },
    { en: "We got to the farm on Friday and the next day we went to the river.", es: "Llegamos a la finca el viernes y al día siguiente fuimos al río.", accept: ["(Nosotros) llegamos a la finca el viernes y al [día siguiente|otro día] fuimos al río.", "El viernes llegamos a la finca y al [día siguiente|otro día] fuimos al río.", "Llegamos a la finca el viernes, y al día siguiente fuimos al río."] },
    { en: "At that moment the phone rang.", es: "En ese momento sonó el teléfono.", accept: ["En ese momento sonó el [teléfono|celular].", "Justo en ese momento sonó el [teléfono|celular].", "En ese momento el [teléfono|celular] sonó."] },
    { en: "See you after lunch.", es: "Nos vemos después del almuerzo.", accept: ["Nos vemos después del almuerzo.", "Nos vemos después de almorzar.", "Después del almuerzo nos vemos."] }
  ],
  personal: {
    prompt: "Think of a trip or a special day. Write two sentences about it: what happened that day, and what happened the day before or the day after.",
    constraints: [
      { type: "containsAny", words: ["ese día", "aquel día", "esa noche", "ese año"], label: "the day of the story: *ese día*, *esa noche*…" },
      { type: "containsAny", words: ["el día anterior", "al día siguiente", "al otro día", "la noche anterior"], label: "*el día anterior* or *al día siguiente*" },
      { type: "anyVerbInTense", tense: "preterito", label: "what happened, in the event past" }
    ],
    model: "Ese día llegué a Cartagena con mi esposa. Al día siguiente fuimos a la playa y comimos pescado."
  },
  pitfalls: [
    "In a story set on another day, *ayer* and *mañana* point to the wrong day. Say *el día anterior* and *al día siguiente*.",
    "*Al día siguiente*, with *al*: the next day. In Colombia you'll also hear *al otro día*.",
    "After *antes de* and *después de*, the dictionary form: *antes de salir*, never *antes de salí*."
  ]
},

/* week · Yesterday, in full (2 of 2) */

"gr-perfecto-vs-indefinido-a2": {
  source: "rebuild",
  hook: {
    line: "A course from Spain teaches *hoy he comido*. In Bogotá people say *hoy comí*: if it's over, it takes the event past, even if it was this morning. The *he* form keeps two jobs, and both are useful.",
    es: "Laura: ¿Ya almorzaste?\nSam: Sí, almorcé con Diego hace un rato.\nLaura: ¿Has probado alguna vez la bandeja paisa?\nSam: No, nunca. Todavía no he ido a Medellín.",
    en: "Laura: Have you had lunch yet?\nSam: Yes, I had lunch with Diego a little while ago.\nLaura: Have you ever tried bandeja paisa?\nSam: No, never. I haven't been to Medellín yet."
  },
  examples: [
    { es: "Esta mañana fui al banco y después almorcé con Carlos.", en: "This morning I went to the bank and then had lunch with Carlos." },
    { es: "¿Has estado alguna vez en Cartagena?", en: "Have you ever been to Cartagena?" },
    { es: "Todavía no he leído el libro, pero vi la película el sábado.", en: "I haven't read the book yet, but I saw the film on Saturday." }
  ],
  rule: "Ask one question: is it a finished event, at a moment you could name?\nThen the event past, even for today: *Hoy fui al banco. Esta mañana desayuné con mi hermana. ¿Ya comiste?*\nThe *he* form has two jobs.\nYour life so far, with no date: *¿Has estado en Cartagena? Nunca he probado el ajiaco.* It goes with *alguna vez* and *nunca*.\nNot yet: *Todavía no he comido.*\nName the moment and you're back to the event past: *Fui a Cartagena en 2019.*\nIn Spain you'll hear *hoy he ido* for things done today. That's Spain only: understand it, don't copy it.\nOnly *he, has, ha, hemos, han* change; *ido* stays the same.",
  readAndPick: [
    { q: "Is Laura asking about one meal, or about ever?", es: "¿Has probado el ajiaco?",
      options: ["Ever, in his life", "Today's lunch", "Last night's dinner"], answer: 0,
      why: "*Has probado*, with no date: have you ever tried it." },
    { q: "When did she go to the doctor?", es: "Hoy fui al médico.",
      options: ["Earlier today", "Not yet", "Some time in her life"], answer: 0,
      why: "It's finished, so the event past, even with *hoy*. Spain would say *hoy he ido*." },
    { q: "Has the speaker eaten?", es: "Todavía no he comido, ¿y tú?",
      options: ["No, not yet", "Yes, early", "Yes, twice"], answer: 0,
      why: "*Todavía no he comido*: not yet. Not yet takes the *he* form." },
    { q: "Which sentence says when?", es: "Nunca he ido a Cartagena.\nFui a Cartagena en 2019.",
      options: ["The second one", "The first one", "Neither"], answer: 0,
      why: "*En 2019* names the moment, so *fui*. *Nunca he ido* has no date: a whole life." },
    { q: "What is Laura asking?", es: "¿Ya almorzaste?",
      options: ["If you've had lunch", "Where you had lunch", "If you like lunch"], answer: 0,
      why: "*¿Ya almorzaste?* is the everyday have you had lunch yet. In Colombia *ya* goes with the event past." }
  ],
  yourTurn: [
    { en: "Today I went to the bank.", es: "Hoy fui al banco.", accept: ["Hoy (yo) fui al banco.", "(Yo) fui al banco hoy.", "(Yo) hoy fui al banco."] },
    { en: "Have you ever been to Cartagena? (to a friend)", es: "¿Has estado alguna vez en Cartagena?", accept: ["¿(Tú) has estado (alguna vez) en Cartagena?", "¿Alguna vez has estado en Cartagena?", "¿(Tú) has ido (alguna vez) a Cartagena?", "¿Alguna vez has ido a Cartagena?"] },
    { en: "I haven't eaten yet.", es: "Todavía no he comido.", accept: ["(Yo) todavía no he comido.", "(Yo) no he comido todavía.", "Aún no he comido.", "(Yo) todavía no comí."] },
    { en: "I have never tried ajiaco.", es: "Nunca he probado el ajiaco.", accept: ["(Yo) nunca he probado (el) ajiaco.", "(Yo) no he probado nunca (el) ajiaco.", "(Yo) jamás he probado (el) ajiaco."] },
    { en: "I went to Cartagena last year.", es: "Fui a Cartagena el año pasado.", accept: ["(Yo) fui a Cartagena el año pasado.", "El año pasado (yo) fui a Cartagena.", "(Yo) estuve en Cartagena el año pasado."] }
  ],
  translate: [
    { en: "This morning I went to the bank and then had lunch with Carlos.", es: "Esta mañana fui al banco y después almorcé con Carlos.", accept: ["Esta mañana (yo) fui al banco y [después|luego] almorcé con Carlos.", "Hoy en la mañana fui al banco y [después|luego] almorcé con Carlos.", "(Yo) fui al banco esta mañana y [después|luego] almorcé con Carlos."] },
    { en: "I haven't read the book yet, but I saw the film on Saturday.", es: "Todavía no he leído el libro, pero vi la película el sábado.", accept: ["(Yo) todavía no he leído el libro, pero (yo) vi la película el sábado.", "(Yo) no he leído el libro todavía, pero vi la película el sábado.", "Aún no he leído el libro, pero vi la película el sábado."] },
    { en: "Have you had lunch yet? (to a friend)", es: "¿Ya almorzaste?", accept: ["¿(Tú) ya almorzaste?", "¿Almorzaste ya?", "¿Ya has almorzado?"] },
    { en: "She has been to Mexico twice.", es: "Ha estado dos veces en México.", accept: ["(Ella) ha estado dos veces en México.", "(Ella) ha estado en México dos veces.", "(Ella) ha ido dos veces a México.", "(Ella) ha ido a México dos veces."] }
  ],
  personal: {
    prompt: "Write two true sentences: one thing you did today, and one thing you have never done.",
    constraints: [
      { type: "anyVerbInTense", tense: "preterito", label: "something finished, in the event past: *fui*, *comí*…" },
      { type: "regex", pattern: "\\b(he|has|ha|hemos|han)\\s+\\S+(ado|ido|to|cho)\\b", label: "the *he* form: *he ido*, *he visto*…" },
      { type: "containsAny", words: ["nunca", "todavía no", "alguna vez", "jamás"], label: "*nunca*, *todavía no* or *alguna vez*" }
    ],
    model: "Hoy fui al gimnasio antes del trabajo. Nunca he visto un partido de fútbol en un estadio."
  },
  pitfalls: [
    "Don't copy English *have* into every sentence with today or yet: *hoy fui* and *¿ya comiste?* are the normal forms in Colombia.",
    "A date or a named moment takes the event past: *fui a Bogotá en 2020*, never *he ido a Bogotá en 2020*.",
    "For not yet you'll also hear *todavía no comí*. Both are fine; the *he* form is the safe one."
  ]
},

"task-a2-hoy-ayer": {
  source: "rebuild",
  hook: {
    line: "This week ends with your own week, told to a friend: what you did, day by day, and what you still haven't got round to. Every verb asks the same question: is it finished, or is it not yet and never?",
    es: "El lunes trabajé hasta tarde.\nEl miércoles, por fin, fui al gimnasio.\nHoy fui al supermercado.\nTodavía no he llamado a mi abuela.",
    en: "On Monday I worked late.\nOn Wednesday I finally went to the gym.\nToday I went to the supermarket.\nI haven't called my grandmother yet."
  },
  examples: [
    { es: "Hoy fui al supermercado y después limpié la casa.", en: "Today I went to the supermarket and then cleaned the house." },
    { es: "El jueves mi hermano vino a cenar.", en: "On Thursday my brother came over for dinner." },
    { es: "Nunca he ido a un partido de fútbol.", en: "I've never been to a football match." }
  ],
  rule: "Write eight to ten sentences, from Monday to today.\nMost of them say what you did: a time word, then the event past. *El lunes trabajé hasta tarde. Anoche cené con unos amigos. Hoy fui al supermercado.*\nOne or two say what you haven't done yet: *Todavía no he llamado a mi mamá.*\nOne is about your life so far: *Nunca he ido a un partido de fútbol.*\nThe word *hoy* decides nothing. Finished takes the event past, whatever the day.\nThe new pasts will come up all the time: *tuve, hice, pude, vine, dije*.\nFor how you felt, *estaba*: *Estaba cansada, pero fui.*",
  readAndPick: [
    { q: "Finished, or not yet?", es: "Todavía no he pagado el arriendo.",
      options: ["Not yet, still to do", "Paid last week", "Paid today"], answer: 0,
      why: "*Todavía no he pagado*: not done yet. *El arriendo* is the rent." },
    { q: "When did this happen?", es: "Anoche cené con unos amigos.",
      options: ["Last night", "Tonight", "Every night"], answer: 0,
      why: "*Anoche* is last night, and *cené* is done. Tonight would be *esta noche*." },
    { q: "One day, or his whole life?", es: "Nunca he montado a caballo.",
      options: ["All his life", "Just yesterday", "This week"], answer: 0,
      why: "*Nunca he montado*: never, in his life so far. No date, so the *he* form." },
    { q: "Why does she write *fui* and not *he ido*?", es: "Hoy fui a clase de baile.",
      options: ["Because it's over", "Because of *hoy*", "Because it's a habit"], answer: 0,
      why: "Over and done, so the event past. *Hoy* decides nothing on its own." },
    { q: "What did his brother do on Thursday?", es: "El jueves mi hermano vino a cenar.",
      options: ["Came for dinner", "Cooked for everyone", "Asked him out"], answer: 0,
      why: "*Vino* is the past of *venir*: he came. *A cenar*: for dinner." }
  ],
  yourTurn: [
    { en: "On Monday I worked late.", es: "El lunes trabajé hasta tarde.", accept: ["El lunes (yo) trabajé hasta tarde.", "(Yo) trabajé hasta tarde el lunes.", "El lunes (yo) trabajé tarde."] },
    { en: "Today I went to the supermarket.", es: "Hoy fui al supermercado.", accept: ["Hoy (yo) fui al [supermercado|súper].", "(Yo) fui al [supermercado|súper] hoy.", "(Yo) hoy fui al [supermercado|súper]."] },
    { en: "I haven't called my grandmother yet.", es: "Todavía no he llamado a mi abuela.", accept: ["(Yo) todavía no he llamado a mi abuela.", "(Yo) no he llamado a mi abuela todavía.", "Aún no he llamado a mi abuela.", "(Yo) todavía no llamé a mi abuela."] },
    { en: "On Thursday my brother came over for dinner.", es: "El jueves mi hermano vino a cenar.", accept: ["El jueves mi hermano vino a [cenar|comer].", "Mi hermano vino a [cenar|comer] el jueves.", "El jueves vino mi hermano a [cenar|comer]."] },
    { en: "I've never been to a football match.", es: "Nunca he ido a un partido de fútbol.", accept: ["(Yo) nunca he ido a un partido de fútbol.", "(Yo) no he ido nunca a un partido de fútbol.", "(Yo) nunca he estado en un partido de fútbol."] }
  ],
  translate: [
    { en: "Today I went to the supermarket and then cleaned the house.", es: "Hoy fui al supermercado y después limpié la casa.", accept: ["Hoy (yo) fui al supermercado y [después|luego] limpié la casa.", "Hoy fui al súper y [después|luego] limpié la casa.", "(Yo) fui al supermercado hoy y [después|luego] limpié la casa."] },
    { en: "Last night I had dinner with some friends.", es: "Anoche cené con unos amigos.", accept: ["Anoche (yo) cené con unos amigos.", "(Yo) cené con unos amigos anoche.", "Anoche (yo) comí con unos amigos."] },
    { en: "On Wednesday I finally went to the gym.", es: "El miércoles, por fin, fui al gimnasio.", accept: ["El miércoles (yo) por fin fui al gimnasio.", "Por fin (yo) fui al gimnasio el miércoles.", "El miércoles (yo) al fin fui al gimnasio."] },
    { en: "I was tired, but I went.", es: "Estaba cansado, pero fui.", accept: ["(Yo) estaba [cansado|cansada], pero fui.", "(Yo) estaba [cansado|cansada], pero igual fui.", "(Yo) estaba [cansado|cansada], pero (yo) fui."] }
  ],
  personal: {
    prompt: "Tell a friend about your week in three sentences: one day and what you did, one thing you haven't done yet, and one thing you have never done.",
    constraints: [
      { type: "anyVerbInTense", tense: "preterito", label: "what you did, in the event past: *fui*, *trabajé*…" },
      { type: "containsWord", word: "todavía no", label: "something not done yet, with *todavía no*" },
      { type: "containsWord", word: "nunca", label: "something you have never done, with *nunca*" },
      { type: "minSentences", n: 3, label: "at least three sentences" }
    ],
    model: "El martes tuve una reunión muy larga. Todavía no he limpiado el apartamento. Nunca he probado el chontaduro."
  },
  pitfalls: [
    "*Hoy* decides nothing: *hoy fui*, *hoy trabajé*. The *he* form waits for not yet and never.",
    "Keep dates out of the *he* sentences: *el sábado fui*, never *el sábado he ido*.",
    "Open with the day, then the verb: *El jueves vino mi hermano.* It keeps the week in order."
  ]
},

/* week · How things used to be (2 of 2) */

"gr-ser-estar-adjetivos-a2": {
  source: "rebuild",
  hook: {
    line: "Diego's class is boring, and by the end so is Diego, in a different way. Spanish keeps the two apart: *es aburrida* says what the class is like, *está aburrido* says how he is right now.",
    es: "Laura: ¿Qué tal la clase de historia?\nDiego: La clase es aburrida, y yo estoy aburrido.\nLaura: Bueno, ¿estás listo? Vamos a almorzar.",
    en: "Laura: How's the history class?\nDiego: The class is boring, and I'm bored.\nLaura: Well, are you ready? Let's go and have lunch."
  },
  examples: [
    { es: "Mi hermana es muy tranquila, pero hoy está nerviosa por el examen.", en: "My sister is very calm, but today she's nervous about the exam." },
    { es: "¡Qué rico está este jugo!", en: "This juice tastes great!" },
    { es: "¿Ya estás lista?\nSí, lista, vamos.", en: "Are you ready yet?\nYes, ready, let's go." }
  ],
  rule: "*Ser* says what someone or something is like. *Estar* says how they are now, which could change by tomorrow.\n*Don Hernando es tranquilo, pero hoy está nervioso.*\nA few describing words change their meaning:\n*es aburrido*: boring. *está aburrido*: bored\n*es listo*: clever. *está listo*: ready\n*es rico*: rich. *está rico*: tastes good\n*es seguro*: safe. *está seguro*: sure\nWith the food in front of you, *estar*: *La sopa está deliciosa.*\nIn Colombia *listo* alone means OK, done: *¿A las tres? Listo.*\nThe rest still holds: *ser* for who and where from, *estar* for where. Events take *ser*: *La fiesta es en mi casa.*",
  readAndPick: [
    { q: "Is Ana a boring person?", es: "Ana está aburrida en la fiesta.",
      options: ["No, she's just bored", "Yes, very", "She isn't at the party"], answer: 0,
      why: "*Está aburrida*: bored right now. A boring person *es aburrida*." },
    { q: "What is Laura saying about the soup?", es: "¡Uy, la sopa está muy rica!",
      options: ["It tastes great", "It's expensive", "It's a rich dish"], answer: 0,
      why: "*Está rica*: it tastes good, this bowl, now. *Es rico*, said of a person, means he has money." },
    { q: "Clever, or ready?", es: "Ya estoy listo, vamos.",
      options: ["He's ready", "He's clever", "He's late"], answer: 0,
      why: "*Estar listo* is to be ready. *Ser listo* is to be clever." },
    { q: "What does the speaker mean?", es: "Mi jefe es muy rico.",
      options: ["He's got lots of money", "He's in a good mood", "He's very kind"], answer: 0,
      why: "*Ser rico*, said of a person: rich. It's who he is, not how he is today." },
    { q: "Why *es* here, and not *está*?", es: "La fiesta es en la casa de Laura.",
      options: ["A party is an event", "The house is big", "Laura lives there"], answer: 0,
      why: "Events take *ser*, even with a place: *la fiesta es en…*, *la reunión es en…*" }
  ],
  yourTurn: [
    { en: "I'm bored.", es: "Estoy aburrido.", accept: ["(Yo) estoy [aburrido|aburrida].", "(Yo) estoy muy [aburrido|aburrida].", "Me estoy aburriendo."] },
    { en: "The film is boring.", es: "La película es aburrida.", accept: ["La película es (muy) aburrida.", "Esta película es aburrida.", "La película es bien aburrida."] },
    { en: "Are you ready? (to a friend)", es: "¿Estás listo?", accept: ["¿(Tú) estás [listo|lista]?", "¿Ya estás [listo|lista]?", "¿Estás [listo|lista] ya?"] },
    { en: "This juice tastes great.", es: "Este jugo está muy rico.", accept: ["Este jugo está (muy) [rico|delicioso].", "El jugo está (muy) [rico|delicioso].", "¡Qué rico está este jugo!"] },
    { en: "My sister is calm, but today she's nervous.", es: "Mi hermana es tranquila, pero hoy está nerviosa.", accept: ["Mi hermana es (muy) tranquila, pero hoy está nerviosa.", "Mi hermana es tranquila, pero hoy está (muy) nerviosa.", "Mi hermana es calmada, pero hoy está nerviosa."] }
  ],
  translate: [
    { en: "My boss is very rich.", es: "Mi jefe es muy rico.", accept: ["Mi jefe es (muy) rico.", "Mi jefa es (muy) rica.", "Mi jefe tiene mucha plata."] },
    { en: "Are you sure? (to a friend)", es: "¿Estás seguro?", accept: ["¿(Tú) estás [seguro|segura]?", "¿Estás [seguro|segura] de eso?", "¿[Seguro|Segura]?"] },
    { en: "The party is at my house.", es: "La fiesta es en mi casa.", accept: ["La fiesta es en mi casa.", "La rumba es en mi casa.", "La fiesta es en la casa mía."] },
    { en: "Dinner is ready.", es: "La comida está lista.", accept: ["La [comida|cena] está lista.", "Ya está lista la [comida|cena].", "La [comida|cena] ya está lista."] }
  ],
  personal: {
    prompt: "Describe someone you know in one or two sentences: what they are like, and how they are today.",
    constraints: [
      { type: "regex", pattern: "\\b(es|son)\\b", label: "what they're like, with *es*" },
      { type: "regex", pattern: "\\best(á|án)(?=[\\s.,;!?]|$)", label: "how they are now, with *está*" },
      { type: "minWords", n: 8, label: "at least eight words" }
    ],
    model: "Mi hermano es muy divertido, pero hoy está cansado porque trabajó hasta tarde."
  },
  pitfalls: [
    "*Soy aburrido* tells people you're a boring person. Bored is *estoy aburrido*.",
    "*Está rico* is about how food tastes now. *Es rico*, said of a person, means he has plata.",
    "Events take *ser*, even with a place: *la reunión es en la sala 3*."
  ]
},

/* week · Comparing (2 of 2) */

"gr-modificadores-adverbios-b1": {
  source: "rebuild",
  hook: {
    line: "After *más que* and *tan como*, Spanish has a few more ways to size things up: *el doble*, *carísimo*, *perfectamente*. Laura's new apartment needs two of them.",
    es: "Laura: El apartamento nuevo es enorme, pero el arriendo cuesta el doble.\nDiego: ¿El doble? ¡Carísimo!\nLaura: Sí, pero el barrio es lindísimo.",
    en: "Laura: The new apartment is huge, but the rent costs twice as much.\nDiego: Twice as much? That's really expensive!\nLaura: Yes, but the neighbourhood is gorgeous."
  },
  examples: [
    { es: "Este celular cuesta el doble que el otro.", en: "This phone costs twice as much as the other one." },
    { es: "El examen fue facilísimo.", en: "The exam was really easy." },
    { es: "Habla inglés perfectamente.", en: "She speaks English perfectly." }
  ],
  rule: "Three ways to give a size or a manner.\nHow many times: *el doble*, twice as much; *el triple*; *la mitad*, half. *Cuesta el doble que el otro. Hoy todo está a mitad de precio.*\nVery, in one word: add *-ísimo*. *caro*, *carísimo*; *bueno*, *buenísimo*; *fácil*, *facilísimo*. It already means very, so no *muy* in front.\nSome words are big already: *enorme*, *precioso*. *Muy enorme* says it twice.\nHow you do something: take the *-a* form and add *-mente*. *perfecta*, *perfectamente*; *rápida*, *rápidamente*; *fácil*, *fácilmente*.\nTwo in a row, and only the last one keeps it: *clara y sencillamente*.",
  readAndPick: [
    { q: "How much does the new one cost?", es: "El nuevo cuesta el doble.",
      options: ["Twice the price", "Half the price", "Almost the same price"], answer: 0,
      why: "*El doble*: twice as much. Half would be *la mitad*." },
    { q: "How easy was the exam?", es: "El examen fue facilísimo.",
      options: ["Very, very easy", "A bit easy", "Not that easy"], answer: 0,
      why: "*-ísimo* says very in one word: *facilísimo*, very easy." },
    { q: "Which line sounds wrong?", es: "Es una casa enorme.\nEs una casa muy enorme.\nEs una casa muy grande.",
      options: ["The middle one", "The very first", "The one at the end"], answer: 0,
      why: "*Enorme* is already very big, so *muy* adds nothing." },
    { q: "How does she speak English?", es: "Habla inglés perfectamente.",
      options: ["Perfectly", "Badly", "Only a little"], answer: 0,
      why: "*-mente* turns *perfecta* into how she does it: *perfectamente*, perfectly." },
    { q: "What does Diego think of the shoes?", es: "¡Están carísimos!",
      options: ["They cost a lot", "They're cheap", "They're lovely shoes"], answer: 0,
      why: "*Carísimos*: very expensive. The ending matches *los zapatos*: *-ísimos*." }
  ],
  yourTurn: [
    { en: "This phone costs twice as much as the other one.", es: "Este celular cuesta el doble que el otro.", accept: ["Este celular cuesta el doble que el otro.", "Este celular es el doble de caro que el otro.", "Este celular cuesta el doble del otro."] },
    { en: "The exam was really easy.", es: "El examen fue facilísimo.", accept: ["El examen [fue|estuvo] facilísimo.", "El examen [fue|estuvo] muy fácil.", "El examen [fue|estuvo] súper fácil."] },
    { en: "Their house is huge.", es: "Su casa es enorme.", accept: ["Su casa es enorme.", "La casa de [ellos|ellas] es enorme.", "Su casa es grandísima."] },
    { en: "She speaks English perfectly.", es: "Habla inglés perfectamente.", accept: ["(Ella) habla inglés perfectamente.", "(Ella) habla perfectamente (el) inglés.", "(Ella) habla el inglés perfectamente."] },
    { en: "She explained it clearly and simply.", es: "Lo explicó clara y sencillamente.", accept: ["(Ella) lo explicó clara y sencillamente.", "(Ella) lo explicó de forma clara y sencilla.", "(Ella) lo explicó de manera clara y sencilla."] }
  ],
  translate: [
    { en: "Today everything is half price.", es: "Hoy todo está a mitad de precio.", accept: ["Hoy todo está a mitad de precio.", "Todo está a mitad de precio hoy.", "Hoy todo cuesta la mitad."] },
    { en: "The shoes are really expensive.", es: "Los zapatos están carísimos.", accept: ["Los zapatos [están|son] carísimos.", "Los zapatos están muy caros.", "Los zapatos están carísimos."] },
    { en: "The neighbourhood is gorgeous.", es: "El barrio es precioso.", accept: ["El barrio es precioso.", "El barrio es lindísimo.", "El barrio es bellísimo."] },
    { en: "Fortunately, the bus came quickly.", es: "Afortunadamente, el bus pasó rápido.", accept: ["Afortunadamente, el bus [pasó|llegó|vino] rápido.", "Afortunadamente, el bus [pasó|llegó|vino] rápidamente.", "Por suerte, el bus [pasó|llegó|vino] rápido."] }
  ],
  personal: {
    prompt: "Compare two prices or two places you know in one or two sentences, with *el doble*, *la mitad* or a word in *-ísimo*.",
    constraints: [
      { type: "containsAny", words: ["el doble", "el triple", "la mitad", "ísimo", "ísima", "ísimos", "ísimas"], label: "*el doble*, *la mitad* or *-ísimo*" },
      { type: "minWords", n: 8, label: "at least eight words" }
    ],
    model: "En Toronto un café cuesta el doble que en Bogotá, y el de Bogotá es buenísimo."
  },
  pitfalls: [
    "No *muy* with *-ísimo* or with *enorme*: *carísimo* or *muy caro*, never *muy carísimo*.",
    "*-mente* goes on the *-a* form: *rápidamente*, *tranquilamente*, never *rápidomente*.",
    "Two in a row, and only the last one takes it: *clara y sencillamente*."
  ]
},

/* week · It, him, her, them (2 of 2) */

"gr-posesivo-dativo-b1": {
  source: "rebuild",
  hook: {
    line: "English says whose with *my* and *his*: they stole his phone. Spanish says who it happened to, with the little word before the verb, and the thing just takes *el* or *la*.",
    es: "Laura: ¿Qué le pasó a Diego?\nSam: Le robaron el celular en el bus.\nLaura: ¡Qué pesar! ¿Y él cómo está?",
    en: "Laura: What happened to Diego?\nSam: Someone stole his phone on the bus.\nLaura: Oh no! And how is he?"
  },
  examples: [
    { es: "A mi hijo le duele el estómago.", en: "My son's stomach hurts." },
    { es: "Le cortaron el pelo muy corto.", en: "They cut his hair very short." },
    { es: "Se me cayó el celular y se me rompió la pantalla.", en: "I dropped my phone and the screen broke." }
  ],
  rule: "When something happens to someone's body or things, Spanish names the person with the little word, and the thing takes *el* or *la*:\n*Le robaron el celular.* They stole his phone.\n*¿Te lavo la camisa?* Shall I wash your shirt?\n*Su celular* or *mi cabeza* here sounds translated.\nFor accidents, *se* comes first: *Se me cayó el vaso.* I dropped the glass. *Se le olvidaron las llaves.* He forgot his keys. *Se nos dañó el carro.* Our car broke down.\nThe verb matches the thing, not the person: *se me cayó el vaso*, *se me cayeron los vasos*.\n*Mío* and *tuyo* stay for telling owners apart: *No es el mío, es el tuyo.*",
  readAndPick: [
    { q: "Whose phone was stolen?", es: "A Laura le robaron el celular.",
      options: ["Laura's own phone", "The speaker's", "The thief's"], answer: 0,
      why: "*Le* and *a Laura* say who it happened to. No *su* needed." },
    { q: "What happened to the speaker's phone?", es: "Se me cayó el celular.",
      options: ["She dropped it", "It got stolen", "She threw it away"], answer: 0,
      why: "*Se me cayó*: it fell, and it happened to me. An accident, not on purpose." },
    { q: "Who had the haircut?", es: "Ayer le cortaron el pelo a mi hijo.",
      options: ["My son did", "I did", "The hairdresser did"], answer: 0,
      why: "*Le* points to *a mi hijo*: it was done to him." },
    { q: "How many glasses broke?", es: "Se me rompieron dos vasos.",
      options: ["Two glasses", "Only one", "None of them"], answer: 0,
      why: "*Rompieron* matches *dos vasos*. One glass would be *se me rompió*." },
    { q: "Which line sounds the most natural?", es: "Me duele mi cabeza.\nMe duele la cabeza.\nDuele mi cabeza.",
      options: ["The middle one", "The top one", "The bottom line"], answer: 0,
      why: "*Me* already says whose head, so it's *la cabeza*." }
  ],
  yourTurn: [
    { en: "They stole his phone.", es: "Le robaron el celular.", accept: ["(A él) le robaron el celular.", "Le robaron el [celular|teléfono].", "Le robaron el celular a él."] },
    { en: "I dropped my phone.", es: "Se me cayó el celular.", accept: ["Se me cayó el [celular|teléfono].", "(A mí) se me cayó el celular.", "El celular se me cayó."] },
    { en: "My son's stomach hurts.", es: "A mi hijo le duele el estómago.", accept: ["A mi hijo le duele el estómago.", "Le duele el estómago a mi hijo.", "A mi hijo le está doliendo el estómago."] },
    { en: "Shall I wash your shirt? (to a friend)", es: "¿Te lavo la camisa?", accept: ["¿(Yo) te lavo la camisa?", "¿Te lavo la camisa (yo)?", "¿Te lavo esa camisa?"] },
    { en: "He forgot his keys.", es: "Se le olvidaron las llaves.", accept: ["(A él) se le olvidaron las llaves.", "Se le olvidaron las llaves a él.", "(A él) se le quedaron las llaves."] }
  ],
  translate: [
    { en: "I dropped my phone and the screen broke.", es: "Se me cayó el celular y se me rompió la pantalla.", accept: ["Se me cayó el [celular|teléfono] y se me rompió la pantalla.", "(A mí) se me cayó el celular y se me rompió la pantalla.", "Se me cayó el celular y se rompió la pantalla."] },
    { en: "They cut his hair very short.", es: "Le cortaron el pelo muy corto.", accept: ["Le cortaron el pelo muy corto.", "(A él) le cortaron el pelo muy corto.", "Le cortaron el pelo bien corto."] },
    { en: "Our car broke down on the way.", es: "Se nos dañó el carro en el camino.", accept: ["Se nos dañó el carro en el camino.", "Se nos varó el carro en el camino.", "Se nos dañó el carro por el camino."] },
    { en: "That jacket isn't mine, it's hers.", es: "Esa chaqueta no es mía, es de ella.", accept: ["Esa chaqueta no es mía, es de ella.", "Esa chaqueta no es la mía, es la de ella.", "Esa chaqueta no es mía, es suya."] }
  ],
  personal: {
    prompt: "Think of a small accident you had: something you dropped, broke, lost or forgot. Write one or two sentences about it.",
    constraints: [
      { type: "regex", pattern: "\\bse\\s+(me|te|le|nos|les)\\s+\\S+", label: "*se me* plus what happened: *se me cayó*, *se me olvidó*…" },
      { type: "anyVerbInTense", tense: "preterito", label: "in the event past: *cayó*, *rompió*…" },
      { type: "minWords", n: 6, label: "at least six words" }
    ],
    model: "La semana pasada se me cayó el celular en la calle y se me rompió la pantalla."
  },
  pitfalls: [
    "*Me duele mi cabeza* says whose twice. *Me* is enough: *me duele la cabeza*.",
    "*Robaron su celular* sounds translated from English. Say who it happened to: *le robaron el celular*.",
    "In accidents the verb matches the thing, not the person: *se me cayeron las llaves*."
  ]
},

/* week · Asking nicely (1 of 2) */

"gr-pronombres-posicion-a2": {
  source: "rebuild",
  hook: {
    line: "Laura has the book Sam wants. Watch where *lo* goes in each line: in front of the verb, on the end of it, or glued to a request.",
    es: "Sam: ¿Tienes el libro? Lo quiero leer.\nLaura: Sí, pero estoy leyéndolo yo.\nSam: Listo, préstamelo el lunes.",
    en: "Sam: Do you have the book? I want to read it.\nLaura: Yes, but I'm reading it myself.\nSam: OK, lend it to me on Monday."
  },
  examples: [
    { es: "Tengo que llamar a mi mamá. La voy a llamar esta noche.", en: "I have to call my mom. I'm going to call her tonight." },
    { es: "¿Dónde está el libro?\nNo sé, estoy buscándolo.", en: "Where's the book?\nI don't know, I'm looking for it." },
    { es: "Si necesitas algo, llámame.", en: "If you need anything, call me." }
  ],
  rule: "With one ordinary verb, the little word goes in front: *Lo veo. Me llamó anoche.*\nWith two verbs, *voy a, tengo que, quiero, puedo, estoy* plus another, pick an end: in front of the first, or glued to the end of the second.\n*Lo voy a ver* or *Voy a verlo*. *Te quiero invitar* or *Quiero invitarte*. *Lo estoy leyendo* or *Estoy leyéndolo*.\nNever in the middle: not *voy lo a ver*.\n*Hay que* takes only the end: *Hay que hacerlo.*\nTelling someone to do it, the little word goes on the end, always: *Llámame. Cómpralo. Dámelo.* The accent mark keeps the weight where it was.\nTwo of them: the person first, then the thing: *me lo*, *te la*.",
  readAndPick: [
    { q: "Which line has the little word in the wrong place?", es: "Lo voy a llamar.\nVoy a llamarlo.\nVoy lo a llamar.",
      options: ["The last one", "The first", "The middle"], answer: 0,
      why: "It goes at one end: *lo voy a llamar* or *voy a llamarlo*, never in the middle." },
    { q: "Do these two mean the same?", es: "Te quiero invitar.\nQuiero invitarte.",
      options: ["Yes, they do", "No, they don't", "Only in writing"], answer: 0,
      why: "Same meaning. With two verbs, either end works." },
    { q: "Who gets the salt?", es: "Laura: Pásame la sal, por favor.",
      options: ["Laura", "Sam", "Nobody yet"], answer: 0,
      why: "*Pásame*: pass it to me. The *me* on the end is Laura." },
    { q: "What is Laura doing with the book?", es: "Estoy leyéndolo.",
      options: ["Reading it now", "Buying it", "Lending it to Sam"], answer: 0,
      why: "*Leyéndolo*: reading it. *Lo* is glued to the end, with an accent mark on the *é*." },
    { q: "Is this right?", es: "Lo hay que hacer hoy.",
      options: ["No: hay que hacerlo", "Yes, it's fine", "No: hay lo que hacer"], answer: 0,
      why: "With *hay que*, only the end works: *hay que hacerlo hoy*." }
  ],
  yourTurn: [
    { en: "I'm going to call her tonight.", es: "La voy a llamar esta noche.", accept: ["(Yo) la voy a llamar esta noche.", "(Yo) voy a llamarla esta noche.", "Esta noche (yo) la voy a llamar.", "Esta noche (yo) voy a llamarla."] },
    { en: "I'm looking for it.", es: "Estoy buscándolo.", accept: ["(Yo) estoy [buscándolo|buscándola].", "(Yo) lo estoy buscando.", "(Yo) la estoy buscando."] },
    { en: "Call me tomorrow. (to a friend)", es: "Llámame mañana.", accept: ["Llámame mañana.", "Mañana llámame.", "Llámame mañana, por favor."] },
    { en: "Give it to me, please. (the book, to a friend)", es: "Dámelo, por favor.", accept: ["Dámelo, por favor.", "Por favor, dámelo.", "Pásamelo, por favor."] },
    { en: "You have to do it today. (nobody named)", es: "Hay que hacerlo hoy.", accept: ["Hay que hacerlo hoy.", "Hoy hay que hacerlo.", "Hay que hacerlo hoy mismo."] }
  ],
  translate: [
    { en: "I have to call my mom. I'm going to call her tonight.", es: "Tengo que llamar a mi mamá. La voy a llamar esta noche.", accept: ["(Yo) tengo que llamar a mi [mamá|madre]. [La voy a llamar|Voy a llamarla] esta noche.", "Tengo que llamar a mi mamá. Esta noche [la voy a llamar|voy a llamarla].", "Tengo que llamar a mi mamá. Voy a llamarla hoy en la noche."] },
    { en: "If you need anything, call me.", es: "Si necesitas algo, llámame.", accept: ["Si (tú) necesitas algo, llámame.", "Llámame si necesitas algo.", "Si necesitas cualquier cosa, llámame."] },
    { en: "Can you help me? (to a friend)", es: "¿Me puedes ayudar?", accept: ["¿(Tú) me puedes ayudar?", "¿Puedes ayudarme?", "¿Me ayudas?"] },
    { en: "Do you want to try them on? (the shoes, to a friend)", es: "¿Te los quieres medir?", accept: ["¿Te los quieres [medir|probar]?", "¿Quieres [medírtelos|probártelos]?", "¿(Tú) te los quieres medir?"] }
  ],
  personal: {
    prompt: "Write two sentences: something you have to do soon, with the little word at either end, and a request to a friend with it glued on the end.",
    constraints: [
      { type: "regex", pattern: "\\b(voy a|vas a|tengo que|quiero|puedo|hay que)\\s+\\S+(lo|la|los|las|me|te|le|les|nos)\\b|\\b(lo|la|los|las|me|te|le|les|nos)\\s+(voy a|tengo que|quiero|puedo)\\b", label: "two verbs and a little word: *la voy a llamar*, *tengo que hacerlo*…" },
      { type: "anyVerbInTense", tense: "imperativo", label: "a request with the little word on the end: *llámame*, *ayúdame*…" }
    ],
    model: "Tengo que llamar a mi jefe. Lo voy a llamar mañana. Diego, ayúdame con la maleta, por favor."
  },
  pitfalls: [
    "Never in the middle: *voy a verlo* or *lo voy a ver*, never *voy lo a ver*.",
    "On the end it's one word, no space: *verlo*, *llámame*. Longer ones take an accent mark: *dámelo*, *buscándolo*.",
    "*Lo hay que hacer* is wrong, even though *lo tengo que hacer* is fine: *hay que hacerlo*."
  ]
},

/* week · Getting things done (2 of 2) */

"gr-se-multiuso-b1": {
  source: "rebuild",
  hook: {
    line: "Walk down any street in Bogotá and the signs talk to nobody in particular. That *se* means someone, anyone, and it's one of three jobs the little word does this week.",
    es: "Se arrienda apartamento.\nSe venden empanadas.\nAquí se habla inglés.",
    en: "Apartment for rent.\nEmpanadas for sale.\nEnglish spoken here."
  },
  examples: [
    { es: "En este restaurante se come muy bien.", en: "You eat really well in this restaurant." },
    { es: "Laura y Diego se conocieron en la universidad.", en: "Laura and Diego met at university." },
    { es: "Nos vemos el viernes.", en: "See you on Friday." }
  ],
  rule: "*Se* does three jobs here.\nSomeone, anyone: *se* plus the he or she form. *Aquí se habla español. ¿Se puede pagar con tarjeta?* The verb matches the thing after it: *se vende carro*, *se venden carros*.\nEach other: *se* for they, *nos* for we. *Se conocieron en 2015*: they met. *Nos escribimos todos los días*: we write to each other. *Nos vemos el lunes*: see you Monday.\nWeather has nobody at all: *Llueve. Está lloviendo. Hace frío.* No *it*, and no *se*.\nTo tell the first two apart, look for the people: two acting on each other, or nobody named.",
  readAndPick: [
    { q: "What does the sign tell you?", es: "Se habla inglés.",
      options: ["English works here", "English classes", "Don't speak English"], answer: 0,
      why: "*Se habla*: it's spoken here, by someone, anyone. Nobody in particular." },
    { q: "What happened between Laura and Diego?", es: "Se conocieron en la universidad.",
      options: ["They met at university", "They taught there", "They both studied there"], answer: 0,
      why: "*Se conocieron*: they met each other. Two people, each acting on the other." },
    { q: "Why *venden* and not *vende*?", es: "Se venden dos carros.",
      options: ["It matches the cars", "There are two sellers", "It's more polite"], answer: 0,
      why: "The verb matches the thing after it: *se vende un carro*, *se venden dos carros*." },
    { q: "What does Laura mean?", es: "Nos vemos el lunes.",
      options: ["See you on Monday", "We saw it on Monday", "Look at Monday"], answer: 0,
      why: "*Nos vemos*: we see each other. It's the everyday see you." },
    { q: "What's the weather doing?", es: "Está lloviendo mucho.",
      options: ["Raining a lot", "Cloudy, no rain", "Sunny and hot"], answer: 0,
      why: "*Llover* has nobody doing it: no *it* and no *se*." }
  ],
  yourTurn: [
    { en: "English is spoken here.", es: "Aquí se habla inglés.", accept: ["[Aquí|Acá] se habla inglés.", "Se habla inglés [aquí|acá].", "Se habla inglés."] },
    { en: "Can you pay by card here? (anyone)", es: "¿Se puede pagar con tarjeta?", accept: ["¿[Aquí|Acá] se puede pagar con tarjeta?", "¿Se puede pagar con tarjeta [aquí|acá]?", "¿Puedo pagar con tarjeta?"] },
    { en: "Laura and Diego met at university.", es: "Laura y Diego se conocieron en la universidad.", accept: ["Laura y Diego se conocieron en la [universidad|U].", "Diego y Laura se conocieron en la [universidad|U].", "Laura y Diego se conocieron en la universidad."] },
    { en: "We write to each other every week.", es: "Nos escribimos todas las semanas.", accept: ["(Nosotros) nos escribimos todas las semanas.", "Nos escribimos cada semana.", "(Nosotras) nos escribimos todas las semanas."] },
    { en: "See you on Friday.", es: "Nos vemos el viernes.", accept: ["Nos vemos el viernes.", "Nos vemos el viernes, entonces.", "Entonces nos vemos el viernes."] }
  ],
  translate: [
    { en: "You eat really well in this restaurant.", es: "En este restaurante se come muy bien.", accept: ["En este restaurante se come (muy) [bien|rico|delicioso].", "Se come muy bien en este restaurante.", "Se come (muy) [bien|rico] en este restaurante."] },
    { en: "Apartment for rent.", es: "Se arrienda apartamento.", accept: ["Se arrienda (un) apartamento.", "Apartamento en arriendo.", "Se arrienda apartamento."] },
    { en: "They love each other a lot.", es: "Se quieren mucho.", accept: ["Se quieren mucho.", "(Ellos) se quieren mucho.", "Se aman mucho."] },
    { en: "It rained all night.", es: "Llovió toda la noche.", accept: ["Llovió toda la noche.", "Estuvo lloviendo toda la noche.", "Toda la noche llovió."] }
  ],
  personal: {
    prompt: "Write two true sentences: something that is sold or done where you live, and someone you met, and where.",
    constraints: [
      { type: "sePassive", label: "*se* for anyone: *se habla*, *se venden*…" },
      { type: "regex", pattern: "\\b(nos|se)\\s+conoc\\w+", label: "who you met: *nos conocimos*, *se conocieron*" },
      { type: "minWords", n: 10, label: "at least ten words" }
    ],
    model: "En mi barrio se venden empanadas muy buenas. Mi esposa y yo nos conocimos en un bus en Toronto."
  },
  pitfalls: [
    "The verb matches the thing after it: *se venden empanadas*, not *se vende empanadas*.",
    "Weather needs no *it* and no *se*: *llueve*, *está lloviendo*, *hace frío*.",
    "Two people and *se*: each other. Nobody named: anyone. Look for who is in the sentence."
  ]
},

/* week · How are you feeling? (2 of 2) */

"gr-formulas-subjuntivo-a2": {
  source: "rebuild",
  hook: {
    line: "Diego has a cold and Laura has an interview tomorrow. Spanish has a ready phrase for each, and for now you take them whole, like *buen provecho*.",
    es: "Diego: Estoy enfermo, tengo gripa.\nLaura: ¡Ay, que te mejores! Descansa.\nDiego: Gracias. ¿Y tu entrevista?\nLaura: Es mañana. ¡Ojalá que me vaya bien!",
    en: "Diego: I'm ill, I've got a cold.\nLaura: Oh, get well soon! Get some rest.\nDiego: Thanks. And your interview?\nLaura: It's tomorrow. I hope it goes well!"
  },
  examples: [
    { es: "Mañana tengo la entrevista.\n¡Que te vaya muy bien! No te preocupes.", en: "I have the interview tomorrow.\nAll the best! Don't worry." },
    { es: "¿Crees que va a llover el sábado?\nOjalá que no, tenemos un asado.", en: "Do you think it's going to rain on Saturday?\nLet's hope not, we're having a barbecue." },
    { es: "Perdón, llegué tarde.\nTranquila, no pasa nada.", en: "Sorry I'm late.\nDon't worry, it's fine." }
  ],
  rule: "These are wishes and comfort, and you learn them whole. The ending looks odd because it belongs to a form you'll meet at B1.\n*¡Que te mejores!* Get well soon. *¡Que te vaya bien!* All the best, to someone leaving or starting something.\n*¡Que la pases bien!* Have a good time. *¡Que descanses!* Sleep well.\nTo *usted*, *te* becomes *le* or *se*: *¡Que le vaya bien! ¡Que se mejore!*\n*Ojalá* is I hope so: *Ojalá que sí*, let's hope so; *Ojalá que no*, let's hope not.\nTo calm someone: *No te preocupes*, and to *usted*, *No se preocupe*. Also *No pasa nada*, and *Tranquilo* or *Tranquila*, which you'll hear all day in Colombia.",
  readAndPick: [
    { q: "Who is Laura talking to?", es: "¡Que se mejore, don Hernando!",
      options: ["Don Hernando, politely", "A friend of his", "His whole family"], answer: 0,
      why: "*Se mejore* goes with *usted*. To a friend: *que te mejores*." },
    { q: "When would you say this?", es: "¡Que te vaya bien!",
      options: ["A friend is leaving", "Someone is sick in bed", "Before lunch"], answer: 0,
      why: "May it go well for you: for a trip, an exam, or just goodbye." },
    { q: "Does the speaker want rain?", es: "¿Va a llover? Ojalá que no.",
      options: ["No, not at all", "Yes, a lot", "She doesn't care"], answer: 0,
      why: "*Ojalá que no*: let's hope not." },
    { q: "What is Diego telling Laura?", es: "Tranquila, no pasa nada.",
      options: ["It's all right", "Hurry up, please", "Nothing is happening"], answer: 0,
      why: "*No pasa nada*: no harm done. *Tranquila* says relax, to a woman." },
    { q: "Which wish fits a friend with the flu?", es: "Tengo gripa. Me duele todo.",
      options: ["¡Que te mejores!", "¡Que te vaya bien!", "¡Buen provecho!"], answer: 0,
      why: "To someone ill: *que te mejores*, get well soon." }
  ],
  yourTurn: [
    { en: "Get well soon! (to a friend)", es: "¡Que te mejores!", accept: ["¡Que te mejores!", "¡Que te mejores pronto!", "Ojalá que te mejores pronto."] },
    { en: "Get well soon! (to usted)", es: "¡Que se mejore!", accept: ["¡Que se mejore!", "¡Que se mejore pronto!", "Ojalá que se mejore pronto."] },
    { en: "All the best! (to a friend)", es: "¡Que te vaya bien!", accept: ["¡Que te vaya (muy) bien!", "¡Que te vaya súper bien!", "Que te vaya bien."] },
    { en: "Don't worry. (to usted)", es: "No se preocupe.", accept: ["No se preocupe.", "[Tranquilo|Tranquila], no se preocupe.", "No se preocupe, no pasa nada."] },
    { en: "Let's hope so!", es: "¡Ojalá que sí!", accept: ["¡Ojalá que sí!", "¡Ojalá!", "Ojalá que sí."] }
  ],
  translate: [
    { en: "Oh, get well soon! Get some rest.", es: "¡Ay, que te mejores! Descansa.", accept: ["¡Ay, que te mejores! Descansa (un poco).", "¡Que te mejores! Descansa (un poco).", "Ay, que te mejores. Descansa mucho."] },
    { en: "Let's hope not, we're having a barbecue.", es: "Ojalá que no, tenemos un asado.", accept: ["Ojalá que no, tenemos un asado.", "Ojalá no, tenemos un asado.", "Ojalá que no, vamos a hacer un asado."] },
    { en: "Don't worry, it's fine. (to a friend)", es: "Tranquilo, no pasa nada.", accept: ["[Tranquilo|Tranquila], no pasa nada.", "No te preocupes, no pasa nada.", "No te preocupes, todo bien."] },
    { en: "All the best, sir.", es: "Que le vaya bien, señor.", accept: ["Que le vaya (muy) bien, señor.", "Señor, que le vaya (muy) bien.", "Que le vaya bien, caballero."] }
  ],
  personal: {
    prompt: "A friend writes: *Mañana tengo un examen y estoy nerviosa.* Answer in one or two lines: wish her well and calm her down.",
    constraints: [
      { type: "containsAny", words: ["que te vaya", "ojalá"], label: "a wish: *que te vaya bien*, *ojalá*…" },
      { type: "containsAny", words: ["no te preocupes", "tranquila", "no pasa nada"], label: "something calming: *no te preocupes*, *tranquila*…" }
    ],
    model: "¡Que te vaya muy bien! Tranquila, no te preocupes, tú estudiaste mucho."
  },
  pitfalls: [
    "*¡Que te mejoras!* uses the everyday ending. The wish needs the other one: *¡Que te mejores!*",
    "*No te preocupes* is for a friend. To your boss or an older stranger: *No se preocupe*.",
    "Write *ojalá* with the accent mark on the last *a*."
  ]
}

};
