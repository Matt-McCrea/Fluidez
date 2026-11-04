/* ============================================================================
 * TEACHING SCRIPTS, C1 units 1 to 4 (window.SCRIPTS_C1), keyed by lesson id.
 * Units c1-u55 "Idiom and the body", c1-u56 "Irony and implicature",
 * c1-u57 "Saying it without owning it" and c1-u58 "Institutional Spanish":
 * every lesson on the path from COURSE_BANDS.C1 (day 492 to day 550).
 *
 * Same anatomy and shape as data/scripts/b1.js and b2.js (tools/test-scripts-c1.js
 * checks every rule), with what the owner asked of C1:
 *   - fewer, deeper lessons. Where consecutive notion lessons are one theme,
 *     one script carries the first lesson's id and lists the others it
 *     should also serve in `serves` (course.js is not changed here; the
 *     owner decides whether those days merge, as js/lessons.js MERGES does):
 *       nt-sabor-c1                     serves nt-olor-c1
 *       nt-consistencia-resistencia-c1  serves nt-humedad-sequedad-c1, nt-acabado-c1
 *       nt-atractivo-calidad-c1         serves nt-normalidad-c1, nt-interes-c1
 *     Units c1-u57 and c1-u58 have one run of notion lessons,
 *     nt-certeza-incertidumbre-c1 and nt-realidad-ficcion-c1, and they teach
 *     different things (how sure you are; what is real and what only seems
 *     so), so each keeps its own script;
 *   - the words taught inside real use, not as lists: a review, a complaint,
 *     a message to a neighbour, a story, an argument (evidence rule 13: group
 *     by scenario, not by category). The old notion lessons were word lists;
 *     each script here teaches the pattern under them (oler a against huele
 *     rico, un frío que, se me plus the body, quedar plus the result);
 *   - the hook's line is a human line in plain English; its Spanish is often
 *     a short real text, one line per pair;
 *   - examples are real-text sentences of 12 to 18 words;
 *   - six translate items per script, from one sentence of 12 to 18 words to
 *     a short paragraph, and typed production everywhere;
 *   - register as a choice with a reason: every register line says when.
 *
 * The subjunctive and the indicative may be named in a rule, never in a hook.
 * By day 492 the course has built every tense, so all of them are used. Latin
 * American Spanish, Colombian where usage differs: the -ra past subjunctive
 * only (no -se forms), the preterite as the everyday past, no vosotros, and
 * Peninsular idiom replaced where Latin America says it differently (un frío
 * que pela, hecho un asco, ponerse como una sopa, de un humor de perros,
 * hasta las narices, menudo lío, crío, chaval, bocadillo, enhorabuena; and in
 * units 3 and 4 ¡y tanto!, ¿a que sí?, seguimos tirando, faltaría más, vale,
 * les invitamos, anejo, muy señor mío). No dashes anywhere.
 * ========================================================================== */
window.SCRIPTS_C1 = {

/* ---- unit c1-u55 · Idiom and the body ------------------------------------- */

"fn-afecto-sensaciones-c1": {
  source: "merged",
  hook: {
    line: "You spent Saturday helping your sister move into a fourth-floor flat in Bogotá with no lift. That night a friend calls to ask how it went. In Spanish your whole body tells the story, and nobody just says they are tired.",
    es: "¿Cómo te fue con el trasteo?\nEstoy muerta. Me duele todo, se me cierran los ojos y me muero de hambre.",
    en: "How did the move go?\nI'm dead. Everything hurts, my eyes are closing and I'm starving."
  },
  examples: [
    { es: "Después del trasteo quedé molido: me duelen la espalda, los brazos y hasta las piernas.", en: "After the move I was shattered: my back, my arms and even my legs hurt." },
    { es: "En la mitad de la película se me cerraban los ojos, así que me fui a acostar.", en: "Halfway through the film my eyes kept closing, so I went to bed." },
    { es: "Cargando la última caja me dio un dolor horrible en la espalda y tuve que sentarme.", en: "Carrying the last box, I got a horrible pain in my back and had to sit down." }
  ],
  rule: "Spanish rarely says *estoy cansado* when it really means it. It shows the feeling in three frames.\n*Morirse de* plus the feeling, as an exaggeration: *me muero de hambre*, *de sueño*, *de frío*. Nobody is in danger.\n*Se me* plus what the body does on its own: *se me cierran los ojos*, *se me duermen las piernas*. The verb agrees with the body part.\n*Me dio* plus something sudden: *me dio un calambre*, *me dio sueño*. It hit you; you did nothing.\nFor tiredness, pick the strength: *cansado*, *agotado*, *rendido*, and with friends *muerto* or *molido*.\nFor fondness that is not romance: *le tengo mucho cariño*.",
  readAndPick: [
    { q: "Is anyone in danger?", es: "Me muero de sueño.",
      options: ["Yes, she feels faint and dizzy", "No, she's just very sleepy", "Yes, she can't wake up"], answer: 1,
      why: "*Morirse de* is an exaggeration: it only means very. Nobody is dying." },
    { q: "Who is closing her eyes?", es: "Se me cierran los ojos.",
      options: ["Nobody, it just happens", "She is, on purpose", "Her friend is, gently"], answer: 0,
      why: "*Se me* says the body does it on its own: she is fighting to keep them open." },
    { q: "What happened to his back?", es: "Levantando la nevera me dio un dolor en la espalda.",
      options: ["It has hurt him for years now", "He hurt it on purpose", "A pain came on suddenly"], answer: 2,
      why: "*Me dio un dolor*: something sudden hit him while he was lifting." },
    { q: "How tired is she?", es: "Estoy rendida, pero contenta.",
      options: ["A little sleepy", "Worn out but happy", "Not tired at all"], answer: 1,
      why: "*Rendida* is near the top of the scale, one step below *muerta*." },
    { q: "What does he feel for his old teacher?", es: "Le tengo mucho cariño a mi antiguo profesor.",
      options: ["Warm fondness", "Romantic love", "Some fear"], answer: 0,
      why: "*Tenerle cariño a alguien* is warm fondness; it says nothing about romance." }
  ],
  yourTurn: [
    { en: "I'm starving, I haven't eaten anything all day.", es: "Me muero de hambre, no he comido nada en todo el día.", accept: ["Me [muero|estoy muriendo] de hambre, no [he comido|comí] nada (en todo el día)."] },
    { en: "My eyes are closing, I'm going to bed.", es: "Se me cierran los ojos, me voy a acostar.", accept: ["Se me [cierran|están cerrando] los ojos, [me voy a acostar|me voy a dormir|me voy a la cama|voy a acostarme]."] },
    { en: "Carrying the boxes, I got a horrible pain in my back.", es: "Cargando las cajas me dio un dolor horrible en la espalda.", accept: ["[Cargando|Mientras cargaba|Al cargar] las cajas me dio un dolor [horrible|terrible] en la espalda."] },
    { en: "I'm really fond of my grandmother.", es: "Le tengo mucho cariño a mi abuela.", accept: ["(Yo) le tengo mucho cariño a mi abuela.", "A mi abuela le tengo mucho cariño."] },
    { en: "After the move I'm dead, everything hurts. (a man speaking)", es: "Después del trasteo estoy muerto, me duele todo.", accept: ["Después [del trasteo|de la mudanza] estoy [muerto|molido|rendido], me duele todo."] }
  ],
  translate: [
    { en: "I've been on my feet since six in the morning and I can't take any more.", es: "Llevo de pie desde las seis de la mañana y ya no puedo más.", accept: ["[Llevo|Estoy] [de pie|parado|parada] desde las seis de la mañana y (ya) no puedo más."] },
    { en: "In the middle of the meeting I got so sleepy that my eyes kept closing.", es: "En plena reunión me dio tanto sueño que se me cerraban los ojos.", accept: ["[En plena reunión|En la mitad de la reunión|En medio de la reunión|A mitad de la reunión] me dio tanto sueño que se me cerraban los ojos."] },
    { en: "We carried the sofa up the stairs to the fourth floor, and now my arms are shaking.", es: "Subimos el sofá por las escaleras hasta el cuarto piso y ahora me tiemblan los brazos.", accept: ["Subimos el [sofá|sillón] por las escaleras hasta el cuarto piso y ahora me tiemblan los brazos.", "Subimos el [sofá|sillón] hasta el cuarto piso por las escaleras y ahora me tiemblan los brazos."] },
    { en: "My mum gets tired very quickly when she walks, so we go everywhere by taxi.", es: "Mi mamá se cansa muy rápido cuando camina, así que vamos a todas partes en taxi.", accept: ["Mi [mamá|madre] se [cansa|fatiga] muy rápido [cuando camina|al caminar], así que vamos a todas partes en taxi.", "Mi [mamá|madre] se [cansa|fatiga] muy rápido [cuando camina|al caminar], así que vamos en taxi a todas partes."] },
    { en: "Suddenly I got a really bad pain in my neck and I couldn't turn my head.", es: "De repente me dio un dolor muy fuerte en el cuello y no podía voltear la cabeza.", accept: ["[De repente|De pronto] me dio un dolor muy fuerte en el cuello y no podía [voltear|girar|mover] la cabeza."] },
    { en: "I'm very fond of my neighbours. They looked after my dog for a whole month when I was ill. (a man speaking)", es: "Les tengo mucho cariño a mis vecinos. Me cuidaron el perro un mes entero cuando estuve enfermo.", accept: ["[Les|Le] tengo mucho cariño a mis vecinos. Me cuidaron el perro (durante) un mes entero cuando estuve enfermo.", "A mis vecinos les tengo mucho cariño. Me cuidaron el perro (durante) un mes entero cuando estuve enfermo."] }
  ],
  register: [
    { es: "Estoy muerto.", en: "I'm dead.", when: "with friends, anywhere Spanish is spoken" },
    { es: "Estoy mamado.", en: "I'm wiped out.", when: "in Colombia, only with people you are close to" },
    { es: "Estoy rendido.", en: "I'm worn out.", when: "with anyone, warm but not slangy" },
    { es: "Estoy agotado.", en: "I'm exhausted.", when: "at work, or to someone you call usted" },
    { es: "Me siento muy fatigado.", en: "I feel very fatigued.", when: "to a doctor, describing a symptom" }
  ],
  personal: {
    prompt: "Write two lines about the most tiring day you had recently: how your body felt that evening, and one thing that came on suddenly.",
    constraints: [
      { type: "containsAny", words: ["me muero de", "me moría de", "nos moríamos de", "se me"], label: "how your body felt: *me moría de* or *se me*" },
      { type: "regex", pattern: "\\bme (dio|dieron|daba)\\b", label: "something that came on suddenly: *me dio*" }
    ],
    model: "El sábado, después del trasteo, me moría de hambre y se me cerraban los ojos. Además, cargando una caja me dio un dolor horrible en la espalda."
  },
  pitfalls: [
    "*Estoy muriendo de hambre* is the English frame. Spanish says *me muero de hambre*, or *me estoy muriendo*.",
    "*Me duele mi espalda* has one word too many: the *me* already says whose, so *me duele la espalda*.",
    "In Colombia and most of Latin America, *te amo* is also said to parents and children, not only to a partner; *te quiero* works for all of them."
  ]
},

"nt-temperatura-c1": {
  source: "old",
  hook: {
    line: "You fly from Cartagena, where the air is wet and heavy, to Bogotá, two and a half thousand metres up, on the same afternoon. Colombians describe that jump so that you feel it, and 'it's hot' and 'it's cold' are only the start.",
    es: "En Cartagena hacía un calor que no se aguantaba.\nEn Bogotá hacía un frío que calaba los huesos.",
    en: "In Cartagena it was unbearably hot.\nIn Bogotá the cold went right through to your bones."
  },
  examples: [
    { es: "Apenas salimos del aeropuerto de Cartagena nos dio un calor que no se aguantaba.", en: "The moment we left Cartagena airport, we were hit by an unbearable heat." },
    { es: "En Bogotá, al salir del restaurante, me entró un frío que me caló los huesos.", en: "In Bogotá, as I came out of the restaurant, a cold came over me that went right to my bones." },
    { es: "La reunión con el dueño del apartamento se puso al rojo vivo cuando hablamos del arriendo.", en: "The meeting with the owner of the flat reached boiling point when we talked about the rent." }
  ],
  rule: "To make heat or cold felt, Spanish uses one frame: *un frío* or *un calor*, then *que* and what it does to you.\n*Hace un frío que cala los huesos.* *Hacía un calor que no se aguantaba.*\nWhen it comes over you, use *me entró* or *me dio*: *Me entró frío.* *Me dio calor.* You did nothing; it reached you.\n*Tibio* is in between, neither hot nor cold: *agua tibia*, *un tinto tibio*.\n*Al rojo vivo* is red-hot metal, and far more often a situation about to blow: *La discusión se puso al rojo vivo.*\nIn a forecast: *temperaturas elevadas*.\nOn the coast, heavy wet heat is *bochorno*, and strong sun *un solazo*.",
  readAndPick: [
    { q: "How hot was it?", es: "Hacía un calor que no se aguantaba.",
      options: ["Pleasantly warm", "Unbearably hot", "Hot indoors only"], answer: 1,
      why: "The *que* part says what the heat did, and here it was too much to bear." },
    { q: "Did she do anything to get cold?", es: "Al bajar del avión me entró frío.",
      options: ["No, the cold came over her", "Yes, she opened a window", "Yes, she took off her heavy coat"], answer: 0,
      why: "*Me entró frío* puts the cold in charge: it reached her, she did nothing." },
    { q: "How is the coffee?", es: "Este tinto ya está tibio.",
      options: ["Too hot to drink", "Too strong to drink", "Neither hot nor cold"], answer: 2,
      why: "*Tibio* is in between. In Colombia a *tinto* is a small black coffee." },
    { q: "Was there a fire at the meeting?", es: "En la asamblea de vecinos, el tema del parqueadero se puso al rojo vivo.",
      options: ["Yes, a small one", "No, tempers flared", "No, the heating broke"], answer: 1,
      why: "*Al rojo vivo* about a topic means tempers reached boiling point." },
    { q: "Where would you read this?", es: "Se esperan temperaturas elevadas durante todo el fin de semana.",
      options: ["In a weather report", "In a text to a friend", "In a children's story"], answer: 0,
      why: "*Temperaturas elevadas* is the language of forecasts. A friend says *va a hacer un calor...*" }
  ],
  yourTurn: [
    { en: "It's a bone-chilling cold today.", es: "Hoy hace un frío que cala los huesos.", accept: ["Hoy hace un frío que (te) cala (hasta) los huesos.", "Hace un frío que (te) cala (hasta) los huesos hoy."] },
    { en: "It was unbearably hot in Cartagena.", es: "En Cartagena hacía un calor que no se aguantaba.", accept: ["En Cartagena hacía un calor que no se [aguantaba|soportaba].", "Hacía un calor que no se [aguantaba|soportaba] en Cartagena."] },
    { en: "When I opened the door I suddenly felt cold.", es: "Cuando abrí la puerta me entró frío.", accept: ["[Cuando abrí|Al abrir] la puerta me [entró|dio] frío."] },
    { en: "The soup is lukewarm. Could you heat it up for me? (to a waiter)", es: "La sopa está tibia. ¿Me la puede calentar?", accept: ["La sopa está tibia. ¿Me la [puede|podría] calentar(, por favor)?", "La sopa está tibia. ¿[Puede|Podría] calentármela(, por favor)?"] }
  ],
  translate: [
    { en: "In Bogotá it gets cold at night, so always carry a jacket even if it's sunny. (to a friend)", es: "En Bogotá hace frío por la noche, así que siempre lleva una chaqueta aunque haga sol.", accept: ["En Bogotá hace frío [por la noche|de noche|en la noche], así que siempre [lleva|carga] una chaqueta aunque haga sol."] },
    { en: "As soon as I got off the bus in Santa Marta I felt terribly hot and looked for some shade.", es: "Apenas me bajé del bus en Santa Marta me dio un calor horrible y busqué una sombra.", accept: ["[Apenas|En cuanto|Tan pronto como] me bajé del bus en Santa Marta me [dio|entró] un calor [horrible|terrible] y busqué (una) sombra."] },
    { en: "The baby has a fever. The nurse is going to take her temperature again in an hour.", es: "La bebé tiene fiebre. La enfermera le va a tomar la temperatura otra vez en una hora.", accept: ["La bebé tiene fiebre. La enfermera [le va a tomar|va a tomarle] la temperatura [otra vez|de nuevo] en una hora."] },
    { en: "The forecast says there will be high temperatures all week on the Caribbean coast.", es: "El pronóstico dice que habrá temperaturas elevadas toda la semana en la costa Caribe.", accept: ["El pronóstico dice que [habrá|va a haber] temperaturas [elevadas|altas] (durante) toda la semana en la costa Caribe."] },
    { en: "The argument about the rent reached boiling point and the neighbours came out to see what was happening.", es: "La discusión por el arriendo se puso al rojo vivo y los vecinos salieron a ver qué pasaba.", accept: ["La discusión [por el|sobre el|del] arriendo [se puso|estaba] al rojo vivo y los vecinos salieron a ver qué pasaba."] },
    { en: "To bring a child's fever down, the bath water should be lukewarm, never hot.", es: "Para bajarle la fiebre a un niño, el agua del baño debe estar tibia, nunca caliente.", accept: ["Para bajarle la fiebre a un niño, el agua del baño [debe|tiene que|debería] estar tibia, nunca caliente.", "El agua del baño [debe|tiene que|debería] estar tibia, nunca caliente, para bajarle la fiebre a un niño."] }
  ],
  register: [
    { es: "¡Qué frío tan tenaz!", en: "This cold is brutal!", when: "in Colombia, with friends" },
    { es: "Hace un frío que cala los huesos.", en: "It's a bone-chilling cold.", when: "anywhere, in conversation or telling a story" },
    { es: "Está haciendo mucho frío.", en: "It's very cold.", when: "with anyone, plain and safe" },
    { es: "Se registraron temperaturas muy bajas.", en: "Very low temperatures were recorded.", when: "in the news or a report" }
  ],
  personal: {
    prompt: "Describe the hottest or coldest place you have been, and the moment it got to you.",
    constraints: [
      { type: "regex", pattern: "\\bun (fr[ií]o|calor) que\\b", label: "the heat or the cold: *un frío que* or *un calor que*" },
      { type: "regex", pattern: "\\bme (entr[oó]|dio|daba|entraba)(?![a-záéíóúñ])", label: "the moment it reached you: *me entró* or *me dio*" }
    ],
    model: "En Villa de Leyva hacía un frío que calaba los huesos. Por la noche me entró tanto frío que dormí con dos cobijas."
  },
  pitfalls: [
    "*Un frío que pela* is what Spain says. In Colombia you will hear *un frío que cala los huesos*, or with friends *un frío tenaz*.",
    "*Tengo frío* is you, *hace frío* is the weather, *está frío* is a thing, like the soup. *Estoy frío* says your body is cold to the touch.",
    "Colombia has no winter in the European sense: *invierno* usually means the rainy season."
  ]
},

"nt-sabor-c1": {
  source: "merged",
  serves: ["nt-olor-c1"],
  hook: {
    line: "A friend in Medellín wants to know if the new place on her corner is worth taking her parents to. You loved the smell from the street and the coconut rice, and the fish needed salt. This is the review you would post.",
    es: "Desde la calle huele delicioso, a leña y a plátano maduro.\nEl arroz con coco está para chuparse los dedos.\nEso sí, el pescado estaba un poco simple: le faltaba sal.",
    en: "From the street it smells delicious, of woodsmoke and ripe plantain.\nThe coconut rice is finger-licking good.\nThat said, the fish was a bit bland: it needed salt."
  },
  examples: [
    { es: "Toda la casa huele a café recién hecho desde que mi papá se levanta a las cinco.", en: "The whole house smells of fresh coffee from the moment my dad gets up at five." },
    { es: "La sopa sabe rico, pero le falta sal y el pollo está un poco duro.", en: "The soup tastes good, but it needs salt and the chicken is a bit tough." },
    { es: "El perro olfateó la maleta un buen rato, y el policía nos pidió que la abriéramos.", en: "The dog sniffed the suitcase for a good while, and the police officer asked us to open it." }
  ],
  rule: "To say what something tastes or smells of, put *a* and the thing, with no *el* or *la*:\n*Sabe a coco.* *Huele a quemado.* *Huele a café recién hecho.*\nTo give a verdict, drop the *a*: *sabe rico*, *huele delicioso*, *huele feo*. In Colombia, *sabe maluco* is it tastes bad.\n*Oler* adds an *h* where the stem changes: *huelo, hueles, huele, huelen*, but *olemos*.\nThree ways to taste: *probar* (try it), *saborear* (enjoy it slowly), *catar* (judge it, like a coffee).\nTop of the scale: *está para chuparse los dedos*. Bottom: *le falta sal*, or in Colombia *está simple*.\n*Olfatear* is sniffing on purpose; *apestar* is to stink.",
  readAndPick: [
    { q: "What does the kitchen smell of?", es: "La cocina huele a quemado.",
      options: ["Something burnt", "Fresh bread", "Cleaning stuff"], answer: 0,
      why: "*Huele a* plus *quemado*: of something burnt. The *a* names what it smells of." },
    { q: "What is she saying about the soup?", es: "La sopa huele rico, pero no sabe a nada.",
      options: ["It smells off but it tastes wonderful", "It smells good but has no flavour", "It smells of nothing at all"], answer: 1,
      why: "*Huele rico* is a verdict; *no sabe a nada* says there is no flavour to name." },
    { q: "Why did the expert taste the coffees?", es: "La experta cató cinco cafés del Huila antes de elegir uno.",
      options: ["To enjoy them with friends", "To sell them in her shop", "To judge their quality"], answer: 2,
      why: "*Catar* is tasting to judge quality. Enjoying it slowly is *saborear*." },
    { q: "Is this good or bad?", es: "Ese pescado sabe maluco.",
      options: ["Good, it's delicious", "Bad, it tastes off", "Fine, a bit salty"], answer: 1,
      why: "*Maluco* is Colombian for bad or unpleasant. With no *a*, it is a verdict." },
    { q: "What is the dog doing?", es: "El perro olfateó cada rincón del parque antes de echarse.",
      options: ["Sniffing on purpose", "Smelling bad himself", "Sleeping in a corner"], answer: 0,
      why: "*Olfatear* is sniffing on purpose. *Oler* can also just mean a smell reached you." },
    { q: "How good is the stew?", es: "Ese sancocho está para chuparse los dedos.",
      options: ["Only just edible", "Too spicy to finish", "Really delicious"], answer: 2,
      why: "*Para chuparse los dedos*: so good you would lick your fingers." }
  ],
  yourTurn: [
    { en: "This juice tastes of mango.", es: "Este jugo sabe a mango.", accept: ["Este jugo [sabe a|tiene sabor a] mango."] },
    { en: "The whole apartment smells of paint.", es: "Todo el apartamento huele a pintura.", accept: ["Todo el apartamento huele a pintura.", "El apartamento entero huele a pintura."] },
    { en: "It smells delicious in your kitchen. (to a friend)", es: "Huele delicioso en tu cocina.", accept: ["Huele [delicioso|rico|muy rico] en tu cocina.", "Tu cocina huele [delicioso|rico|muy rico]."] },
    { en: "The rice is bland, it needs salt.", es: "El arroz está simple, le falta sal.", accept: ["El arroz está [simple|desabrido|soso], le falta sal."] },
    { en: "My sneakers stink after the game.", es: "Mis tenis apestan después del partido.", accept: ["Mis [tenis|zapatillas] apestan después del partido."] }
  ],
  translate: [
    { en: "From the street it already smells of coconut rice, and it tastes even better than it smells.", es: "Desde la calle ya huele a arroz con coco, y sabe todavía mejor de lo que huele.", accept: ["Desde la calle ya huele a arroz con coco, y sabe [todavía|aún|incluso] mejor de lo que huele."] },
    { en: "The fish was fresh, but it was a bit bland, and the rice needed salt.", es: "El pescado estaba fresco, pero un poco simple, y al arroz le faltaba sal.", accept: ["El pescado estaba fresco, pero (estaba) un poco [simple|desabrido|soso], y al arroz le faltaba sal."] },
    { en: "Every Saturday they hold a coffee tasting where experts judge beans from all over Colombia.", es: "Todos los sábados hacen una cata de café donde los expertos califican granos de toda Colombia.", accept: ["Todos los sábados hacen una cata de café [donde|en la que] (los) expertos [califican|evalúan|juzgan] granos de toda Colombia."] },
    { en: "I like to savour the first coffee of the day slowly, without looking at my phone.", es: "Me gusta saborear despacio el primer tinto del día, sin mirar el celular.", accept: ["Me gusta saborear despacio el primer [tinto|café] del día, sin [mirar|ver] el celular.", "Me gusta saborear el primer [tinto|café] del día despacio, sin [mirar|ver] el celular."] },
    { en: "The basement smelled of damp, and the dog wouldn't stop sniffing the corners.", es: "El sótano olía a humedad, y el perro no dejaba de olfatear las esquinas.", accept: ["El sótano olía a humedad, y el perro no [dejaba|paraba] de olfatear las esquinas."] },
    { en: "That perfume gives off a very soft fragrance. I love it, but my sister thinks it stinks.", es: "Ese perfume desprende una fragancia muy suave. A mí me encanta, pero a mi hermana le parece que apesta.", accept: ["Ese perfume [desprende|despide] una fragancia muy suave. (A mí) me encanta, pero a mi hermana le parece que apesta."] }
  ],
  register: [
    { es: "¡Qué delicia!", en: "How delicious!", when: "at the table, as you take the first bite" },
    { es: "Está para chuparse los dedos.", en: "It's finger-licking good.", when: "with friends and family, warmly" },
    { es: "Está muy rico.", en: "It's very good.", when: "anywhere in Latin America, with anyone" },
    { es: "El plato tiene un sabor muy equilibrado.", en: "The dish has a very balanced flavour.", when: "in a written review, or to the chef" }
  ],
  personal: {
    prompt: "Write a two-line review of a place you eat often: what it smells or tastes of, and one verdict.",
    constraints: [
      { type: "regex", pattern: "\\b(huele|huelen|ol[ií]a|ol[ií]an|sabe|saben|sab[ií]a|sab[ií]an) a\\b", label: "what it smells or tastes of: *huele a* or *sabe a*" },
      { type: "regex", pattern: "\\b(huele|huelen|ol[ií]a|sabe|saben|sab[ií]a) (rico|delicioso|feo|maluco|horrible|divino|bien|mal)\\b", label: "a verdict with no *a*: *huele rico*, *sabe maluco*" }
    ],
    model: "En la panadería de mi barrio todo huele a pan recién hecho. Los buñuelos saben delicioso, pero el café sabe maluco."
  },
  pitfalls: [
    "*Sabe al ajo* has a word too many: a substance takes no *el*, so *sabe a ajo*.",
    "*Huele quemado* drops the *a*: what it smells of needs it, so *huele a quemado*.",
    "*Oleo* is not a form: the stem change brings an *h*, so *huelo*."
  ]
},

"nt-textura-c1": {
  source: "merged",
  hook: {
    line: "The jacket in the photo looked like soft leather. The one that arrived feels like a plastic bag. You are writing to the seller, and you need to say exactly how it feels in your hand, and that it is not what you saw.",
    es: "Buenas tardes. La chaqueta llegó ayer.\nA simple vista parece de cuero, pero al tacto es áspera y como de plástico.\nQuisiera devolverla.",
    en: "Good afternoon. The jacket arrived yesterday.\nAt first glance it looks like leather, but to the touch it's rough and sort of plasticky.\nI would like to return it."
  },
  examples: [
    { es: "La tela de la camisa es suave y sedosa al tacto, pero se arruga apenas me la pongo.", en: "The shirt's fabric is soft and silky to the touch, but it creases as soon as I put it on." },
    { es: "Cuando llueve, el piso de la entrada queda tan resbaloso que alguien siempre se cae.", en: "When it rains, the floor at the entrance gets so slippery that someone always falls." },
    { es: "El cuero del sillón de mi abuelo ya está muy gastado de tantos años de uso.", en: "The leather on my grandfather's armchair is very worn now from so many years of use." }
  ],
  rule: "*Al tacto* says your judgement comes from your hand, not your eyes. It goes after the description: *suave al tacto*, *fría al tacto*.\nSet it against *a simple vista*, at first glance: *A simple vista parece nueva; al tacto, está gastada.*\nThe words come in opposite pairs, so learn them together:\n*liso* (smooth) and *áspero* (rough)\n*sedoso* (silky) and *rugoso* (coarse, ridged)\n*resbaloso* (slippery) and *pegajoso* (sticky)\nThey agree with the thing: *la tela es áspera*, *el papel es áspero*.\nFor what time and use do: *gastado*, *un cuero gastado*.\nIn Colombia *liso* also means slippery: *el piso está liso*.",
  readAndPick: [
    { q: "How does she know the fabric is soft?", es: "La tela es suave al tacto.",
      options: ["She saw it in a photo", "She touched it", "The label says so"], answer: 1,
      why: "*Al tacto* names the hand as the source of the judgement." },
    { q: "What is the problem with the floor?", es: "Cuidado, que el piso está resbaloso.",
      options: ["It is sticky", "It is dirty", "It is slippery"], answer: 2,
      why: "*Resbaloso* makes you slide. Its opposite, sticky, is *pegajoso*." },
    { q: "What did the buyer find?", es: "A simple vista parecía de cuero, pero al tacto es plástico.",
      options: ["It looked like leather but isn't", "It is real leather but it looks fake", "It is plastic and looks it"], answer: 0,
      why: "*A simple vista* is how it looked; *al tacto* is the truth in the hand." },
    { q: "Why is the armchair soft now?", es: "El cuero del sillón está gastado de tanto uso.",
      options: ["It was made that way", "Years of use wore it", "Someone cleaned it"], answer: 1,
      why: "*Gastado* is worn by use over time, not how it was made." },
    { q: "What does the door handle do?", es: "La manija de la puerta quedó pegajosa después de la fiesta.",
      options: ["It slips right out of your hand", "It is very cold", "It sticks to your fingers"], answer: 2,
      why: "*Pegajosa* clings to your fingers. Slippery is *resbalosa*." }
  ],
  yourTurn: [
    { en: "The fabric is silky to the touch.", es: "La tela es sedosa al tacto.", accept: [] },
    { en: "Careful, the floor is slippery.", es: "Cuidado, el piso está resbaloso.", accept: ["Cuidado, (que) el piso está [resbaloso|liso|resbaladizo]."] },
    { en: "At first glance it looks new, but it's very worn.", es: "A simple vista parece nuevo, pero está muy gastado.", accept: ["A [simple|primera] vista parece nuevo, pero está muy gastado."] },
    { en: "His hands were rough from working in the fields.", es: "Tenía las manos ásperas de trabajar en el campo.", accept: ["Tenía las manos ásperas [de|por] trabajar en el campo.", "Sus manos estaban ásperas [de|por] trabajar en el campo."] }
  ],
  translate: [
    { en: "In the photo the bag looked like leather, but to the touch it's a hard, rough plastic.", es: "En la foto la cartera parecía de cuero, pero al tacto es un plástico duro y áspero.", accept: ["En la foto [la cartera|el bolso] parecía de cuero, pero al tacto es (un) plástico duro y áspero."] },
    { en: "This cream leaves your skin soft and silky, and it isn't greasy at all.", es: "Esta crema deja la piel suave y sedosa, y no es nada grasosa.", accept: ["Esta crema deja la piel suave y sedosa, y no es (para) nada [grasosa|aceitosa|grasienta]."] },
    { en: "After the rain the stairs were so slippery that two people fell on the way in.", es: "Después de la lluvia, las escaleras estaban tan resbalosas que dos personas se cayeron al entrar.", accept: ["Después de la lluvia, las escaleras estaban tan [resbalosas|lisas|resbaladizas] que dos personas se cayeron al entrar."] },
    { en: "The old bread was hard and gritty, so we gave it to the pigeons in the park.", es: "El pan viejo estaba duro y arenoso, así que se lo dimos a las palomas del parque.", accept: ["El pan viejo estaba duro y arenoso, así que se lo dimos a las palomas [del|en el] parque."] },
    { en: "Sandpaper is rough to the touch, but the wood ends up smooth after you sand it.", es: "La lija es áspera al tacto, pero la madera queda lisa después de lijarla.", accept: ["La lija es áspera al tacto, pero la madera queda lisa después de lijarla.", "El papel de lija es áspero al tacto, pero la madera queda lisa después de lijarla."] },
    { en: "I would like to return the sofa. The fabric is rough to the touch and doesn't look like the one in the photo.", es: "Quisiera devolver el sofá. La tela es áspera al tacto y no se parece a la de la foto.", accept: ["[Quisiera|Me gustaría|Quiero] devolver el sofá. La tela es áspera al tacto y no se parece a la de la foto."] }
  ],
  register: [
    { es: "Esa chaqueta es una estafa.", en: "That jacket is a rip-off.", when: "venting to a friend, not to the seller" },
    { es: "No se parece nada a la de la foto.", en: "It looks nothing like the one in the photo.", when: "in a chat with the seller, direct but fair" },
    { es: "El material no corresponde a la descripción.", en: "The material does not match the description.", when: "in a written complaint or on a return form" },
    { es: "Quisiera solicitar la devolución del producto.", en: "I would like to request a return of the product.", when: "in a formal email to customer service" }
  ],
  personal: {
    prompt: "Describe something you own that looks one way and feels another.",
    constraints: [
      { type: "containsAny", words: ["a simple vista", "a primera vista"], label: "how it looks: *a simple vista*" },
      { type: "containsWord", word: "al tacto", label: "how it feels: *al tacto*" }
    ],
    model: "A simple vista mi saco parece de lana fina, pero al tacto es áspero y pica un montón."
  },
  pitfalls: [
    "*Suave en el tacto* is the slip: the phrase is fixed as *al tacto*.",
    "*Resbaloso* and *pegajoso* are opposites, and neither just means wet: wet is *mojado*.",
    "*Gastado* is the safe word for worn by use. You will read *sobado* in books from Spain."
  ]
},

"nt-visibilidad-vision-c1": {
  source: "merged",
  hook: {
    line: "In your building, the administrator's accounts never quite added up, and everyone knew it. When it finally came out, the neighbours' group chat was full of the language of sight: who saw, who chose not to, and who had been looking down on everyone.",
    es: "Saltaba a la vista que algo andaba mal con las cuentas.\nPero durante años todos se hicieron los de la vista gorda.\nHasta que doña Marta las revisó con lupa.",
    en: "It was obvious that something was wrong with the accounts.\nBut for years everyone turned a blind eye.\nUntil Doña Marta went over them with a fine-tooth comb."
  },
  examples: [
    { es: "Durante años la junta del edificio miró para otro lado, aunque todos sabíamos lo que pasaba.", en: "For years the building's board looked the other way, even though we all knew what was going on." },
    { es: "Cuando una vecina revisó las facturas con lupa, la verdad salió a la luz en una semana.", en: "When a neighbour went over the bills with a fine-tooth comb, the truth came out within a week." },
    { es: "El administrador nos miraba a todos por encima del hombro, como si el edificio fuera suyo.", en: "The administrator looked down on all of us, as if the building were his." }
  ],
  rule: "These phrases are fixed: change the verb, never the picture.\n*Saltar a la vista*: to be obvious. What is obvious does the jumping: *Su error salta a la vista.* *Salta a la vista que miente.*\n*Hacer la vista gorda*, or very often here *hacerse el de la vista gorda*: to see something wrong and pretend you did not. A woman *se hace la de la vista gorda*. *Mirar para otro lado* says the same.\n*Revisar con lupa*: to go over every detail.\n*Salir a la luz*: to come out, said of the truth.\n*Mirar por encima del hombro*: to look down on someone.\n*A simple vista* and *en apariencia* describe the surface, and usually wait for a *pero*.",
  readAndPick: [
    { q: "Did people notice the problem?", es: "Todos se hicieron los de la vista gorda.",
      options: ["No, nobody could see it", "Yes, but they ignored it", "Yes, and they reported it"], answer: 1,
      why: "*Hacerse el de la vista gorda* is a choice: you saw it and pretend you did not." },
    { q: "How obvious was her nervousness?", es: "Su nerviosismo saltaba a la vista.",
      options: ["Plain for anyone to see", "Hidden behind a smile", "Only her sister noticed"], answer: 0,
      why: "*Saltar a la vista*: it jumps at your eyes, so anyone could see it." },
    { q: "How does he treat the staff?", es: "El gerente mira a todo el mundo por encima del hombro.",
      options: ["He keeps a very close eye on them", "He avoids looking at them", "He thinks he's better than them"], answer: 2,
      why: "*Mirar por encima del hombro* is looking down on people, not where you look." },
    { q: "What did the lawyers do?", es: "Revisaron el contrato con lupa antes de firmar.",
      options: ["Signed it without reading", "Went over every detail", "Lost it before signing"], answer: 1,
      why: "*Con lupa*, with a magnifying glass: every line, every detail." },
    { q: "What happened to the truth?", es: "La verdad salió a la luz dos años después.",
      options: ["It became public", "It was finally forgotten", "It was hidden again"], answer: 0,
      why: "*Salir a la luz* is coming out into the open." }
  ],
  yourTurn: [
    { en: "It was obvious that he was lying.", es: "Saltaba a la vista que mentía.", accept: ["Saltaba a la vista que (él) [mentía|estaba mintiendo]."] },
    { en: "The police turned a blind eye.", es: "La policía se hizo la de la vista gorda.", accept: ["La policía [se hizo la de la vista gorda|hizo la vista gorda|miró para otro lado]."] },
    { en: "The truth came to light much later.", es: "La verdad salió a la luz mucho después.", accept: ["La verdad salió a la luz mucho (tiempo) después.", "La verdad salió a la luz mucho más tarde."] },
    { en: "We lost sight of him in the shopping centre.", es: "Lo perdimos de vista en el centro comercial.", accept: ["Lo perdimos de vista en el centro comercial.", "Le perdimos la pista en el centro comercial."] }
  ],
  translate: [
    { en: "The problem was plain for all to see, but the mayor preferred to turn a blind eye until the elections.", es: "El problema saltaba a la vista, pero el alcalde prefirió hacer la vista gorda hasta las elecciones.", accept: ["El problema saltaba a la vista, pero el alcalde prefirió [hacer la vista gorda|hacerse el de la vista gorda|mirar para otro lado] hasta las elecciones."] },
    { en: "A neighbour went over the accounts with a fine-tooth comb and found three payments nobody could explain.", es: "Una vecina revisó las cuentas con lupa y encontró tres pagos que nadie podía explicar.", accept: ["[Una vecina|Un vecino] revisó las cuentas con lupa y encontró tres pagos que nadie [podía|pudo|sabía] explicar."] },
    { en: "On the surface the building was well run, but the truth came out in March.", es: "En apariencia el edificio estaba bien administrado, pero la verdad salió a la luz en marzo.", accept: ["[En apariencia|A simple vista] el edificio estaba bien administrado, pero la verdad salió a la luz en marzo."] },
    { en: "I don't like people looking down on me just because I don't speak perfectly.", es: "No me gusta que me miren por encima del hombro solo porque no hablo perfecto.", accept: ["No me gusta que me miren por encima del hombro solo porque no hablo [perfecto|perfectamente]."] },
    { en: "In the fog we lost sight of the car in front, and we had to stop on the hard shoulder.", es: "Con la neblina perdimos de vista el carro de adelante y tuvimos que parar en la berma.", accept: ["Con la [neblina|niebla] perdimos de vista [el|al] carro de adelante y tuvimos que parar en la berma."] },
    { en: "She looked like she hadn't slept. Even so, she insisted that everything was fine and that she didn't need help.", es: "Tenía cara de no haber dormido. Aun así, insistía en que todo estaba bien y en que no necesitaba ayuda.", accept: ["[Tenía cara|Tenía pinta|Tenía toda la pinta] de no haber dormido. Aun así, insistía en que todo estaba bien y (en) que no necesitaba ayuda."] }
  ],
  register: [
    { es: "Se hicieron los de la vista gorda.", en: "They turned a blind eye.", when: "in conversation, anywhere in Latin America" },
    { es: "Miraron para otro lado.", en: "They looked the other way.", when: "in conversation or a newspaper, a little plainer" },
    { es: "Prefirieron no darse por enterados.", en: "They chose to act as if they didn't know.", when: "when you want to sound measured, even at work" },
    { es: "Las autoridades no actuaron pese a las denuncias.", en: "The authorities did not act despite the complaints.", when: "in a formal complaint or a news report" }
  ],
  personal: {
    prompt: "Write about something at work, at school or in your city that was obvious and that people chose to ignore.",
    constraints: [
      { type: "containsAny", words: ["salta a la vista", "saltaba a la vista", "saltó a la vista"], label: "what was obvious: *saltaba a la vista*" },
      { type: "containsAny", words: ["vista gorda", "para otro lado"], label: "who ignored it: *la vista gorda* or *para otro lado*" }
    ],
    model: "En mi barrio saltaba a la vista que el parque estaba abandonado, pero la alcaldía se hizo la de la vista gorda durante años."
  },
  pitfalls: [
    "*Hicieron las vistas gordas* is never right: the picture is fixed, *la vista gorda*, singular.",
    "*Mirar por encima del hombro* is attitude, not a place: nobody is standing behind anyone.",
    "*Hacerse el de la vista gorda* agrees with who does it: *ella se hizo la de la vista gorda*."
  ]
},

"nt-audibilidad-audicion-c1": {
  source: "merged",
  hook: {
    line: "Your upstairs neighbour has been drilling since seven, and through the wall you can hear every word of someone else's phone call. You want to write in the building's chat, firmly but without starting a war.",
    es: "Buenos días, vecinos. Desde las siete se oye un taladro ensordecedor.\n¿Alguien sabe hasta cuándo va la obra?\nY por las noches se oye todo a través de las paredes.",
    en: "Good morning, neighbours. Since seven there's been a deafening drill.\nDoes anyone know how long the work will go on?\nAnd at night you can hear everything through the walls."
  },
  examples: [
    { es: "Las paredes de este edificio son tan delgadas que se oye todo lo que dicen los vecinos.", en: "The walls in this building are so thin that you can hear everything the neighbours say." },
    { es: "Anoche sonó la alarma de un carro a las tres de la mañana y nadie la apagó.", en: "Last night a car alarm went off at three in the morning and nobody turned it off." },
    { es: "Hablen en voz baja, por favor, que el bebé por fin se quedó dormido en el cuarto.", en: "Speak quietly, please, the baby has finally fallen asleep in the bedroom." }
  ],
  rule: "Spanish grades how loud someone speaks in steps:\n*en un susurro*, *en voz baja*, *levantar la voz*, *pegar gritos*.\n*Levantar la voz* is raising it a notch; *pegar gritos* is shouting, usually in anger or panic.\nFor sound that reaches you: *se oye todo*, *se oye la música del vecino*. The *se* leaves the listener out.\n*Traspasar* is going through a wall; *resonar* is echoing; *insonorizar* is soundproofing.\nIn Colombia the everyday word for racket is *bulla*: *¡Qué bulla!* An alarm *suena* or *se dispara*, and a driver *pita*.\nTo have an ear for music: *tener buen oído*.",
  readAndPick: [
    { q: "How loud was he?", es: "Me lo dijo en un susurro.",
      options: ["Shouting at her", "Barely audible", "In a normal voice"], answer: 1,
      why: "*En un susurro*: a whisper, the bottom of the scale." },
    { q: "How angry is she?", es: "Empezó a pegar gritos en plena reunión.",
      options: ["Very angry", "Slightly annoyed", "Not angry at all"], answer: 0,
      why: "*Pegar gritos* is the top of the scale: shouting, usually in anger." },
    { q: "What can you hear through the wall?", es: "Se oye todo lo que dicen los vecinos.",
      options: ["Only loud noises", "Nothing at all", "Every word they say"], answer: 2,
      why: "*Se oye todo*: everything carries, and *se* leaves out who is listening." },
    { q: "What is there a lot of in the street?", es: "Hay mucha bulla en la calle.",
      options: ["Traffic police", "Noise", "Rubbish bins"], answer: 1,
      why: "*Bulla* is everyday Latin American Spanish for noise, a racket." },
    { q: "What is special about her?", es: "Tiene muy buen oído para la música.",
      options: ["She plays very loudly", "She picks up tunes easily", "She hears the neighbours"], answer: 1,
      why: "*Tener buen oído para la música* is a gift for music, not just sharp ears." }
  ],
  yourTurn: [
    { en: "You can hear everything through these walls.", es: "Se oye todo a través de estas paredes.", accept: ["Se oye todo [a través de|por] estas paredes.", "Con estas paredes se oye todo."] },
    { en: "Please don't raise your voice. (polite)", es: "Por favor, no levante la voz.", accept: ["Por favor, no [levante|alce|suba] la voz.", "No [levante|alce|suba] la voz, por favor."] },
    { en: "A car alarm went off at three in the morning.", es: "Sonó la alarma de un carro a las tres de la mañana.", accept: ["[Sonó|Se disparó] la alarma de un carro a las tres de la mañana.", "La alarma de un carro [sonó|se disparó] a las tres de la mañana."] },
    { en: "What a racket there is in this restaurant!", es: "¡Qué bulla hay en este restaurante!", accept: ["¡Qué [bulla|ruido] hay en este restaurante!"] }
  ],
  translate: [
    { en: "The walls are so thin that you can hear the neighbour's television until midnight.", es: "Las paredes son tan delgadas que se oye el televisor del vecino hasta la medianoche.", accept: ["Las paredes son tan delgadas que se oye [el televisor|la televisión|la tele] del vecino hasta (la) medianoche."] },
    { en: "The drill was making such a deafening noise that I couldn't even hear my own voice on the phone.", es: "El taladro hacía un ruido tan ensordecedor que no oía ni mi propia voz por teléfono.", accept: ["El taladro hacía un ruido tan ensordecedor que no [oía|escuchaba] ni mi propia voz [por teléfono|en el teléfono]."] },
    { en: "He didn't shout, but he raised his voice enough for the whole office to turn around.", es: "No gritó, pero levantó la voz lo suficiente para que toda la oficina se volteara.", accept: ["No gritó, pero [levantó|alzó|subió] la voz lo suficiente para que toda la oficina se [volteara|diera la vuelta]."] },
    { en: "We soundproofed the recording studio so that the music wouldn't go through the building's walls.", es: "Insonorizamos el estudio de grabación para que la música no traspasara las paredes del edificio.", accept: ["Insonorizamos el estudio de grabación para que la música no [traspasara|atravesara|pasara] las paredes del edificio."] },
    { en: "After a month in the city I don't even notice the noise of the buses any more.", es: "Después de un mes en la ciudad ya ni noto el ruido de los buses.", accept: ["Después de un mes en la ciudad ya [ni|no] [noto|siento|oigo] el ruido de los buses."] },
    { en: "Neighbours, the drilling starts at seven. Could we agree on a later time, please?", es: "Vecinos, el taladro empieza a las siete. ¿Podríamos acordar una hora más tarde, por favor?", accept: ["Vecinos, el taladro [empieza|arranca] a las siete. ¿Podríamos [acordar|ponernos de acuerdo en] una hora más tarde, por favor?"] }
  ],
  register: [
    { es: "¡Qué bulla! Bájenle, ¿sí?", en: "What a racket! Turn it down, will you?", when: "to friends or family in Colombia" },
    { es: "¿Le puede bajar un poquito a la música?", en: "Could you turn the music down a little?", when: "to a neighbour at the door, polite and warm" },
    { es: "Les pedimos guardar silencio durante la función.", en: "We ask you to remain silent during the performance.", when: "in a theatre announcement or a printed notice" },
    { es: "Se recuerda a los residentes que las obras solo se permiten de ocho a cinco.", en: "Residents are reminded that building work is only allowed from eight to five.", when: "in a notice from the building's administration" }
  ],
  personal: {
    prompt: "Write a short message to a neighbour about a noise that bothers you: what you can hear, and a polite request.",
    constraints: [
      { type: "regex", pattern: "\\bse (oye|oyen|escucha|escuchan)\\b", label: "what reaches you: *se oye*" },
      { type: "question", label: "a polite request, as a question" }
    ],
    model: "Hola, vecino. Desde mi cuarto se oye la música hasta la una de la mañana. ¿Le podría bajar un poco entre semana?"
  },
  pitfalls: [
    "*Levantar la voz* and *pegar gritos* are not the same: the first is a notch louder, the second is shouting.",
    "In Spain an alarm *salta*; in Colombia it *suena* or *se dispara*.",
    "*Oír* is sound reaching you and *escuchar* is listening on purpose, but in everyday Latin American speech *escuchar* often covers both."
  ]
},

"fn-hartazgo-enfado-c1": {
  source: "old",
  hook: {
    line: "For the third week running, your flatmate has left the dishes and promised to do them tomorrow. Tonight you are going to tell him you have had enough, and Spanish lets you say exactly how much.",
    es: "Estoy hasta la coronilla de tus excusas.\nHasta aquí llegué: o lavas los platos hoy o hablamos con el dueño.",
    en: "I'm fed up to the back teeth with your excuses.\nThat's it: either you wash the dishes today or we talk to the landlord."
  },
  examples: [
    { es: "Me saca de quicio que deje la ropa tirada en el baño y nunca la recoja.", en: "It drives me up the wall that he leaves his clothes lying around the bathroom and never picks them up." },
    { es: "Mi jefe llegó de mal genio y se puso bravo con todo el mundo por nada.", en: "My boss came in in a foul mood and got angry with everyone over nothing." },
    { es: "Es indignante que cobren por un servicio que no funciona desde hace un mes.", en: "It is outrageous that they charge for a service that hasn't worked for a month." }
  ],
  rule: "Being fed up puts the limit on your body: *estoy hasta la coronilla de* plus a thing or an action, *de tus excusas*, *de esperar*. *Estoy harto de* is the plain version.\nWhen someone else's habit is the problem, use *me saca de quicio que*, *me da rabia que* or *me irrita que*, and the subjunctive: *Me da rabia que no avises.* You are reacting, not reporting.\nTo draw the line: *Hasta aquí llegué.* *Por ahí no paso.* *No pienso aguantar más.*\nFor anger itself, Colombia says *ponerse bravo* and *estar de mal genio*.\nIn writing, *es indignante que* plus the subjunctive keeps it firm and civil.",
  readAndPick: [
    { q: "How does she feel about his excuses?", es: "Estoy hasta la coronilla de sus excusas.",
      options: ["She finds them funny", "She has had enough", "She believes them"], answer: 1,
      why: "*Hasta la coronilla*, up to the crown of the head: there is no room for more." },
    { q: "Why is it *avise* and not *avisa*?", es: "Me da rabia que no avise.",
      options: ["She is reacting to it", "She doubts it happens", "It is about later"], answer: 0,
      why: "After *me da rabia que* you react to the fact, so the subjunctive, even when it is true." },
    { q: "What is he doing with this line?", es: "Hasta aquí llegué, no pienso aguantar más.",
      options: ["Giving directions", "Asking for patience", "Drawing a final line"], answer: 2,
      why: "*Hasta aquí llegué*: this far and no further." },
    { q: "What kind of day is the boss having?", es: "El jefe está de mal genio desde la mañana.",
      options: ["A good one, oddly", "A foul-tempered one", "A very busy one"], answer: 1,
      why: "*De mal genio* is a bad mood. In Colombia *genio* is temper." },
    { q: "Where would this sentence fit best?", es: "Es indignante que la empresa no haya respondido a nuestras quejas.",
      options: ["A formal complaint", "A shout in the kitchen", "A joke with friends"], answer: 0,
      why: "*Es indignante que* is firm but civil, so it suits writing." }
  ],
  yourTurn: [
    { en: "I'm fed up with waiting.", es: "Estoy harto de esperar.", accept: ["Estoy [harto|harta|hasta la coronilla] de esperar."] },
    { en: "It drives me up the wall that he never answers.", es: "Me saca de quicio que nunca conteste.", accept: ["Me saca de quicio que (él) nunca [conteste|responda].", "Me saca la piedra que (él) nunca [conteste|responda]."] },
    { en: "That's it, I'm not putting up with any more.", es: "Hasta aquí llegué, no pienso aguantar más.", accept: ["Hasta aquí [llegué|hemos llegado], no [pienso|voy a] aguantar más."] },
    { en: "My dad got angry because we arrived late.", es: "Mi papá se puso bravo porque llegamos tarde.", accept: ["Mi [papá|padre] se [puso bravo|enojó|molestó] porque llegamos tarde."] }
  ],
  translate: [
    { en: "I'm fed up to the back teeth with your excuses. This week you promised me three times to wash the dishes.", es: "Estoy hasta la coronilla de tus excusas. Esta semana me prometiste tres veces lavar los platos.", accept: ["Estoy hasta la coronilla de tus excusas. Esta semana me [prometiste|has prometido] tres veces lavar los platos.", "Estoy hasta la coronilla de tus excusas. Esta semana me [prometiste|has prometido] lavar los platos tres veces."] },
    { en: "It makes me really angry that you never let me know when you're going to be late for dinner. (to a friend)", es: "Me da mucha rabia que nunca avises cuando vas a llegar tarde a la comida.", accept: ["Me da (mucha) rabia que nunca avises cuando vas a llegar tarde a [la comida|comer]."] },
    { en: "I've been waiting in this queue for an hour and I've had it up to here.", es: "Llevo una hora esperando en esta fila y ya estoy hasta la coronilla.", accept: ["Llevo una hora esperando en esta fila y ya estoy [hasta la coronilla|harto|harta]."] },
    { en: "We feel enormous helplessness at seeing very serious crimes go unpunished year after year.", es: "Sentimos una enorme impotencia al ver que delitos gravísimos quedan impunes año tras año.", accept: ["Sentimos una [enorme|gran] impotencia al ver que [delitos gravísimos|delitos muy graves] quedan impunes año tras año."] },
    { en: "I won't stand for that: shouting at an employee in front of the customers is a total lack of respect.", es: "Por ahí no paso: gritarle a una empleada delante de los clientes es una falta de respeto total.", accept: ["Por ahí no paso: gritarle a [una empleada|un empleado] delante de los clientes es una [falta de respeto total|total falta de respeto]."] },
    { en: "It is outrageous that, after three letters, the company still hasn't answered our complaints. (formal)", es: "Es indignante que, después de tres cartas, la empresa todavía no haya respondido a nuestras quejas.", accept: ["Es indignante que, [después de|tras] tres cartas, la empresa [todavía|aún] no haya respondido a nuestras quejas."] }
  ],
  register: [
    { es: "Me tiene mamado.", en: "I'm sick of him.", when: "in Colombia, only with close friends" },
    { es: "Estoy hasta la coronilla.", en: "I've had it up to here.", when: "with friends and family, anywhere" },
    { es: "Ya me cansé de esto.", en: "I'm tired of this now.", when: "with anyone, firm and plain" },
    { es: "No estoy dispuesto a seguir tolerándolo.", en: "I am not prepared to keep tolerating it.", when: "at work, or to someone you call usted" },
    { es: "Es inaceptable que esta situación continúe.", en: "It is unacceptable for this situation to continue.", when: "in a formal letter or complaint" }
  ],
  personal: {
    prompt: "Write two or three lines to someone whose habit drives you mad: the habit, and the line you are drawing.",
    constraints: [
      { type: "regex", pattern: "(saca de quicio|da rabia|irrita|molesta|saca la piedra) que\\b", label: "the habit: *me saca de quicio que* or *me da rabia que*" },
      { type: "containsAny", words: ["hasta aquí", "por ahí no paso", "no pienso aguantar", "no voy a aguantar", "ya no aguanto"], label: "the line you draw: *hasta aquí llegué* or *por ahí no paso*" }
    ],
    model: "Me saca de quicio que dejes la ropa tirada en el baño. Hasta aquí llegué: o la recoges o la boto."
  },
  pitfalls: [
    "*Me da rabia que no avisas* is the slip: after a reaction, the subjunctive, *que no avises*.",
    "*De un humor de perros* is what Spain says. In Colombia, *de mal genio*; anywhere, *de malas pulgas*.",
    "*Impotencia* here is not physical: it is the frustration of not being able to change something unfair."
  ]
},

"nt-color-c1": {
  source: "merged",
  hook: {
    line: "You washed your favourite white shirt with a new red towel, and now it is pink. Then your cousin comes back from the salon with highlights the colour of a carrot. Colour in Spanish is mostly about what happened to it.",
    es: "Se me destiñó la toalla roja y la camisa blanca quedó rosada.\nY a mi prima los rayitos le quedaron color zanahoria.",
    en: "My red towel ran and the white shirt came out pink.\nAnd my cousin's highlights came out carrot-coloured."
  },
  examples: [
    { es: "Pintamos la sala de verde claro y las puertas de gris oscuro, y quedó preciosa.", en: "We painted the living room light green and the doors dark grey, and it turned out lovely." },
    { es: "El sol de la tarde decoloró las cortinas de la sala en apenas unos meses.", en: "The afternoon sun bleached the living room curtains in just a few months." },
    { es: "Se puso roja como un tomate cuando todos le cantaron el cumpleaños en la oficina.", en: "She went as red as a tomato when everyone sang her happy birthday at the office." }
  ],
  rule: "Most of colour is change, and each change has its verb.\n*Desteñirse* is losing colour you wanted to keep, in the wash or the sun. With *se me* it happened to you: *Se me destiñó la camisa.*\n*Decolorar* and *teñir* are on purpose: bleach and dye.\n*Quedar* plus a colour says how it ended up: *quedó rosada*.\nShades of two words never change: *paredes verde claro*, *camisas azul oscuro*.\n*Chillón* is garish, a criticism; *llamativo* is just eye-catching.\nPeople *se ponen rojos* with embarrassment; in writing, they *enrojecen*.\nIn a Colombian salon highlights are *rayitos*; in Spain, *mechas*.",
  readAndPick: [
    { q: "Did she bleach the shirt on purpose?", es: "Se me destiñó la camisa negra.",
      options: ["Yes, she wanted it lighter", "No, it faded by accident", "Yes, she dyed it black"], answer: 1,
      why: "*Desteñirse* is unwanted, and *se me* says it happened to her." },
    { q: "What colour are the walls?", es: "Las paredes son verde claro.",
      options: ["Light green", "Clear glass", "Bright green"], answer: 0,
      why: "*Verde claro* is light green. A two-word shade stays as it is, even with *paredes*." },
    { q: "What does the speaker think of the jacket?", es: "Esa chaqueta es de un amarillo chillón.",
      options: ["It is soft and pale", "It is in good taste", "It is loud and tacky"], answer: 2,
      why: "*Chillón* is a criticism: too bright, in poor taste." },
    { q: "Why did his face change colour?", es: "Se puso rojo cuando le preguntaron por su novia.",
      options: ["He was embarrassed", "He was in the sun", "He was very cold"], answer: 0,
      why: "*Ponerse rojo* after a question about his girlfriend: embarrassment." },
    { q: "How did her hair turn out?", es: "Los rayitos le quedaron demasiado claros.",
      options: ["Too dark", "Just right", "Too light"], answer: 2,
      why: "*Quedar* says how it ended up; *demasiado claros*, too light." }
  ],
  yourTurn: [
    { en: "My white shirt came out pink.", es: "Mi camisa blanca quedó rosada.", accept: ["Mi camisa blanca quedó [rosada|rosa]."] },
    { en: "We want the walls light grey.", es: "Queremos las paredes gris claro.", accept: ["Queremos las paredes (de) (color) gris claro."] },
    { en: "The sun bleached the curtains.", es: "El sol decoloró las cortinas.", accept: ["El sol [decoloró|destiñó] las cortinas."] },
    { en: "She went red when she heard her name.", es: "Se puso roja cuando oyó su nombre.", accept: ["Se puso roja [cuando oyó|al oír|cuando escuchó] su nombre.", "Se sonrojó [cuando oyó|al oír|cuando escuchó] su nombre."] }
  ],
  translate: [
    { en: "I washed a new pair of jeans with the white shirts, and now they have all come out light blue.", es: "Lavé un jean nuevo con las camisas blancas, y ahora todas quedaron azul claro.", accept: ["Lavé [un jean|unos jeans|un bluyín] nuevo con las camisas blancas, y ahora todas [quedaron|han quedado] azul [claro|clarito].", "Lavé unos jeans nuevos con las camisas blancas, y ahora todas [quedaron|han quedado] azul [claro|clarito]."] },
    { en: "The jacket faded after three washes, even though the label said it doesn't fade.", es: "La chaqueta se destiñó después de tres lavadas, aunque la etiqueta decía que no se destiñe.", accept: ["La chaqueta se destiñó después de tres [lavadas|lavados], aunque la etiqueta decía que no se [destiñe|destiñía]."] },
    { en: "My cousin wanted soft highlights. They came out a garish orange, and now she doesn't want to leave the house.", es: "Mi prima quería unos rayitos suaves. Le quedaron de un naranja chillón, y ahora no quiere salir de la casa.", accept: ["Mi prima quería unos [rayitos|reflejos] suaves. Le quedaron de un [naranja|anaranjado] chillón, y ahora no quiere salir de (la) casa.", "Mi prima quería unas mechas suaves. Le quedaron de un [naranja|anaranjado] chillón, y ahora no quiere salir de (la) casa."] },
    { en: "For the baby's room we chose pastel colours: pale blue walls and white furniture.", es: "Para el cuarto del bebé escogimos colores pastel: paredes azul claro y muebles blancos.", accept: ["Para el cuarto del bebé [escogimos|elegimos] colores pastel: paredes azul [claro|pálido|cielo] y muebles blancos."] },
    { en: "When the teacher read his poem out loud, he went red to the tips of his ears.", es: "Cuando la profesora leyó su poema en voz alta, se puso rojo hasta las orejas.", accept: ["Cuando [la profesora|el profesor] leyó su poema en voz alta, se puso rojo hasta las orejas."] },
    { en: "In the afternoon the sky suddenly darkened, and a few minutes later there was a downpour.", es: "Por la tarde el cielo se oscureció de repente y a los pocos minutos cayó un aguacero.", accept: ["[Por la tarde|En la tarde] el cielo se oscureció de repente y a los pocos minutos cayó un aguacero."] }
  ],
  register: [
    { es: "¡Qué color tan horrible!", en: "What a horrible colour!", when: "with a close friend who can take it" },
    { es: "Es un poco chillón, ¿no?", en: "It's a bit loud, isn't it?", when: "when you want to soften it with a question" },
    { es: "Yo lo habría escogido un poco más sobrio.", en: "I would have chosen something a little more subdued.", when: "giving an honest view without hurting anyone" },
    { es: "El tono no corresponde al de la muestra.", en: "The shade doesn't match the sample.", when: "to a painter or a shop, as a complaint" }
  ],
  personal: {
    prompt: "Tell the story of something whose colour went wrong: a shirt, a wall or your hair.",
    constraints: [
      { type: "regex", pattern: "\\bse (me|te|le|nos|les) [a-záéíóúñ]+(ó|aron|ieron)(?![a-záéíóúñ])", label: "what happened to it: *se me destiñó*, *se me manchó*" },
      { type: "regex", pattern: "\\bqued(ó|aron|aba|aban)\\b", label: "how it ended up: *quedó* plus the colour" }
    ],
    model: "Se me destiñó un jean nuevo en la lavadora y todas mis medias blancas quedaron azules."
  },
  pitfalls: [
    "*Paredes verdes claras* is the slip: a two-word shade never changes, *paredes verde claro*.",
    "*Desteñir* is the accident and *decolorar* is the plan: you bleach on purpose and fade by mistake.",
    "*Chillón* is never praise: for bright and good, say *llamativo* or *vivo*."
  ]
},

"nt-consistencia-resistencia-c1": {
  source: "merged",
  serves: ["nt-humedad-sequedad-c1", "nt-acabado-c1"],
  hook: {
    line: "You and your partner have bought an old house in La Candelaria, and the builder is walking you round it. Water is getting in, some of the wood can be saved, and one wall sounds hollow. To follow him, and to argue about the price, you need the language of materials.",
    es: "Por esa grieta se filtra el agua, y esta pared está hueca.\nPero las vigas están duras como una piedra.\nEso sí, hay que impermeabilizar la terraza antes de que empiecen las lluvias.",
    en: "Water seeps in through that crack, and this wall is hollow.\nBut the beams are as hard as rock.\nThat said, the terrace has to be waterproofed before the rains start."
  },
  examples: [
    { es: "Cuando llueve fuerte hay una gotera en la cocina, y el piso queda lleno de charcos.", en: "When it rains hard there's a leak in the kitchen, and the floor ends up full of puddles." },
    { es: "Vamos a lijar y barnizar los pisos de madera, pero las vigas las dejamos al natural.", en: "We're going to sand and varnish the wooden floors, but we'll leave the beams untreated." },
    { es: "El maestro de obra es muy joven, pero todos dicen que es un diamante en bruto.", en: "The builder is very young, but everyone says he's a diamond in the rough." }
  ],
  rule: "For what things are like, Spanish leans on fixed pictures: *duro como una piedra*, *fuerte como un roble*, *liviano como una pluma*. The picture never changes; the first word agrees: *la viga está dura*.\nFor what happens to them, the verbs carry *se*: *el agua se filtra*, *la madera se hincha*, *el yeso se endurece*, *el chocolate se derrite*.\nFor how it ends up, *quedar*: *quedé ensopado*, *el piso quedó lijado y barnizado*.\n*Al natural* is finished but untreated: *madera al natural*. *En bruto* is not worked yet, and of a person, raw talent: *un diamante en bruto*.\n*Hay una gotera*: the roof leaks.",
  readAndPick: [
    { q: "What is the problem with the wall?", es: "Toque aquí: esta pared está hueca.",
      options: ["It's soaking wet from the rain", "There's nothing inside it", "It's made of stone"], answer: 1,
      why: "*Hueca*: empty inside, so it sounds hollow when you knock." },
    { q: "What is the water doing?", es: "El agua se filtra por una grieta del techo.",
      options: ["Seeping in slowly", "Pouring down in a stream", "Drying on the roof"], answer: 0,
      why: "*Filtrarse* is passing slowly through something. Pouring down is *chorrear*." },
    { q: "Is the wood treated?", es: "Preferimos dejar la madera al natural.",
      options: ["Yes, sanded and varnished", "Yes, painted white", "No, it is left as it is"], answer: 2,
      why: "*Al natural*: with nothing added on top, no paint or varnish." },
    { q: "What does the builder think of the young man?", es: "Ese muchacho es un diamante en bruto.",
      options: ["He has raw talent", "He costs too much", "He is very stubborn"], answer: 0,
      why: "*Un diamante en bruto* is talent that has not been polished yet." },
    { q: "What happened to him in the rain?", es: "Salió sin paraguas y quedó ensopado.",
      options: ["He stayed dry", "He got soaked", "He got lost"], answer: 1,
      why: "*Quedar ensopado* is soaked to the skin, the everyday word in Colombia." },
    { q: "What is the grandfather like?", es: "A sus ochenta años, mi abuelo sigue fuerte como un roble.",
      options: ["Old and fragile", "Stubborn as a mule", "Strong and healthy"], answer: 2,
      why: "*Fuerte como un roble* is the fixed picture for strength." }
  ],
  yourTurn: [
    { en: "This bread is as hard as a rock.", es: "Este pan está duro como una piedra.", accept: [] },
    { en: "There's a leak in the kitchen.", es: "Hay una gotera en la cocina.", accept: [] },
    { en: "I went out without an umbrella and got soaked.", es: "Salí sin paraguas y quedé ensopado.", accept: ["Salí sin [paraguas|sombrilla] y (me) quedé [ensopado|ensopada|empapado|empapada].", "Salí sin [paraguas|sombrilla] y me [ensopé|empapé]."] },
    { en: "The floor ended up sanded and varnished.", es: "El piso quedó lijado y barnizado.", accept: [] },
    { en: "The chocolate melted in the car.", es: "El chocolate se derritió en el carro.", accept: ["El chocolate se derritió en el carro.", "Se derritió el chocolate en el carro."] }
  ],
  translate: [
    { en: "Every time it rains, water seeps in through a crack in the roof and drips onto the bed.", es: "Cada vez que llueve, el agua se filtra por una grieta del techo y gotea sobre la cama.", accept: ["Cada vez que llueve, el agua se filtra por una grieta [del|en el] techo y gotea [sobre|en] la cama."] },
    { en: "The builder says this wall is hollow and that the beams are as hard as rock.", es: "El maestro dice que esta pared está hueca y que las vigas están duras como una piedra.", accept: ["[El maestro de obra|El maestro|El constructor] dice que esta pared está hueca y que las vigas están duras como una piedra."] },
    { en: "Plaster gets firm as it dries, so you have to work quickly.", es: "El yeso adquiere consistencia al secarse, así que hay que trabajar rápido.", accept: ["El yeso [adquiere consistencia|se endurece] al secarse, así que [hay que|toca|tienes que] trabajar rápido."] },
    { en: "If the wall is damp, the paint peels within a few weeks, however much you touch it up.", es: "Si la pared está húmeda, la pintura se descascara en pocas semanas, por mucho que la retoques.", accept: ["Si la pared está húmeda, la pintura se [descascara|pela|cae] en pocas semanas, por mucho que la retoques."] },
    { en: "She has never studied music, but her teacher says she is a diamond in the rough.", es: "Nunca ha estudiado música, pero su profesor dice que es un diamante en bruto.", accept: ["Nunca [ha estudiado|estudió] música, pero su [profesor|profesora] dice que es un diamante en bruto."] },
    { en: "On the way back from the farm we got caught in a downpour. We got home completely soaked and frozen stiff.", es: "De regreso de la finca nos agarró un aguacero. Llegamos a la casa completamente ensopados y muertos de frío.", accept: ["[De regreso|Volviendo|De vuelta] de la finca nos agarró un aguacero. Llegamos a (la) casa completamente [ensopados|empapados] y muertos de frío."] }
  ],
  register: [
    { es: "Eso está duro como una piedra.", en: "That's as hard as a rock.", when: "in conversation, about bread, wood or a mattress" },
    { es: "Es una casa muy sólida.", en: "It's a very solid house.", when: "with anyone, a plain judgement" },
    { es: "La estructura está en perfecto estado.", en: "The structure is in perfect condition.", when: "from a builder, or in a sale listing" },
    { es: "El material soporta cargas de hasta cien toneladas.", en: "The material can bear loads of up to a hundred tonnes.", when: "in a technical report or a specification" }
  ],
  personal: {
    prompt: "Describe a place you know that needs fixing: one thing that is happening to it, and how something ended up.",
    constraints: [
      { type: "regex", pattern: "\\bse [a-záéíóúñ]+(a|e|an|en|aba|ía|aban|ían)\\b", label: "a change with *se*: *el agua se filtra*, *la madera se hincha*" },
      { type: "regex", pattern: "\\bqued(ó|aron|a|an)(?![a-záéíóúñ])", label: "how it ended up: *quedó*" }
    ],
    model: "En el baño de mi apartamento el agua se filtra por la pared, y la pintura quedó llena de manchas."
  },
  pitfalls: [
    "*Fuerte como un pino* means nothing to anyone: the pictures are fixed, *fuerte como un roble*.",
    "*Al natural* and *en bruto* are not the same: one is finished but untreated, the other not worked yet.",
    "*Ponerse como una sopa* is Spain's soaked; in Colombia people *quedan ensopados* or *empapados*."
  ]
},

"nt-accesibilidad-limpieza-c1": {
  source: "merged",
  hook: {
    line: "You are handing back the keys to a flat you rented for two years. The owner says it was left a mess and wants to keep the deposit. You left it spotless, and you have the photos. Now you need to say so, first to a friend and then in writing.",
    es: "La dueña dice que el apartamento quedó hecho un desastre y que no nos devuelve el depósito.\n¡Pero si lo dejamos impecable!\nY tenemos fotos de todo.",
    en: "The owner says the flat was left a total mess and that she won't give us back the deposit.\nBut we left it spotless!\nAnd we have photos of everything."
  },
  examples: [
    { es: "Antes de irnos sacudimos los tapetes y dejamos la cocina impecable, como la encontramos.", en: "Before we left we shook out the rugs and left the kitchen spotless, just as we found it." },
    { es: "El lavaplatos estaba tapado desde que llegamos, y se lo dijimos a la dueña por escrito.", en: "The kitchen sink had been blocked since we arrived, and we told the owner in writing." },
    { es: "El edificio es precioso, pero no tiene acceso para silla de ruedas ni ascensor.", en: "The building is beautiful, but it has no wheelchair access and no lift." }
  ],
  rule: "The state of a place is a result, so it takes *estar*, *quedar* or *dejar*.\n*Estar hecho un desastre* or, more colloquially, *un chiquero*: a total mess. *Hecho* agrees with the place: *la cocina quedó hecha un desastre*.\n*Dejar* plus the place plus the state: *lo dejamos impecable*, *la dejaron como nueva*.\n*Limpiar a fondo* or *de arriba abajo* is cleaning thoroughly, every corner.\nA blocked pipe or sink is *tapado* in everyday speech, *obstruido* in a report.\nFor access: *tiene acceso para silla de ruedas*, *no es accesible*.\n*Impecable* is spotless, the top of the scale.",
  readAndPick: [
    { q: "What state did they leave the kitchen in?", es: "Dejaron la cocina impecable.",
      options: ["Not a mark on it", "Clean on the surface", "In a terrible state"], answer: 0,
      why: "*Impecable* is the top of the scale: not one mark." },
    { q: "Why is the sink a problem?", es: "El lavaplatos está tapado otra vez.",
      options: ["It is leaking", "The water won't drain", "It is too small"], answer: 1,
      why: "*Tapado* is blocked: the water has nowhere to go." },
    { q: "How did the party leave the flat?", es: "Después de la fiesta, el apartamento quedó hecho un chiquero.",
      options: ["Clean and tidy", "Full of guests", "A total pigsty"], answer: 2,
      why: "*Hecho un chiquero* is a total mess, and colloquial: a *chiquero* is a pigsty." },
    { q: "How thorough was the cleaning?", es: "Limpiamos de arriba abajo.",
      options: ["Only the floors", "Every single corner", "Just the windows"], answer: 1,
      why: "*De arriba abajo*, from top to bottom: nothing left out." },
    { q: "Who can't get in?", es: "La oficina no es accesible para personas en silla de ruedas.",
      options: ["Visitors after six", "Anyone without a key", "Wheelchair users"], answer: 2,
      why: "*Accesible* is about getting in; here, for people in wheelchairs." }
  ],
  yourTurn: [
    { en: "His room is a total mess.", es: "Su cuarto está hecho un desastre.", accept: ["Su cuarto está hecho un [desastre|chiquero]."] },
    { en: "We left the apartment spotless.", es: "Dejamos el apartamento impecable.", accept: [] },
    { en: "The bathroom sink is blocked.", es: "El lavamanos está tapado.", accept: ["El lavamanos está [tapado|obstruido]."] },
    { en: "The kitchen ended up a total mess.", es: "La cocina quedó hecha un desastre.", accept: ["La cocina quedó hecha un [desastre|chiquero]."] }
  ],
  translate: [
    { en: "The owner says the flat was left a mess, but we have photos where it looks spotless.", es: "La dueña dice que el apartamento quedó hecho un desastre, pero tenemos fotos donde se ve impecable.", accept: ["[La dueña|El dueño] dice que el apartamento quedó hecho un desastre, pero tenemos fotos [donde|en las que] se ve impecable."] },
    { en: "After the party the living room was left a pigsty, with bottles everywhere.", es: "Después de la fiesta la sala quedó hecha un chiquero, con botellas por todas partes.", accept: ["Después de la fiesta la sala quedó hecha un [chiquero|desastre], con botellas por todas partes."] },
    { en: "The kitchen has to be cleaned thoroughly before the new tenants arrive on Monday.", es: "Hay que limpiar la cocina a fondo antes de que lleguen los nuevos inquilinos el lunes.", accept: ["[Hay que|Toca|Tenemos que] limpiar [la cocina a fondo|a fondo la cocina] antes de que lleguen los nuevos inquilinos el lunes."] },
    { en: "The new library has wheelchair access and lifts to every floor.", es: "La nueva biblioteca tiene acceso para silla de ruedas y ascensores a todos los pisos.", accept: ["La nueva biblioteca tiene acceso para [silla|sillas] de ruedas y [ascensores|ascensor] a todos los pisos."] },
    { en: "The property was handed over in perfect condition, as the attached photographs show. (formal)", es: "El inmueble se entregó en perfecto estado, como lo demuestran las fotografías adjuntas.", accept: ["El inmueble se entregó en perfecto estado, como (lo) [demuestran|muestran] las fotografías adjuntas."] },
    { en: "The shower drain is blocked again. Could you send someone this week, please? (polite)", es: "El desagüe de la ducha está tapado otra vez. ¿Podría mandar a alguien esta semana, por favor?", accept: ["El desagüe de la ducha está tapado [otra vez|de nuevo]. ¿[Podría|Puede] [mandar|enviar] a alguien esta semana(, por favor)?"] }
  ],
  register: [
    { es: "Quedó como una tacita de plata.", en: "It was left as clean as a new pin.", when: "with family, warm and a little old-fashioned" },
    { es: "Lo dejamos impecable.", en: "We left it spotless.", when: "with anyone, firm and clear" },
    { es: "Quedó como nuevo.", en: "It was left like new.", when: "in conversation, about a place or a thing" },
    { es: "El inmueble se entregó en perfecto estado.", en: "The property was handed over in perfect condition.", when: "in a written reply about a deposit" }
  ],
  personal: {
    prompt: "Describe a place you once left very clean or very messy, and the state it was in.",
    constraints: [
      { type: "regex", pattern: "\\b(dej[eéó]|dejamos|dejaron|qued[óo]|quedaron|qued[eé])(?![a-záéíóúñ])", label: "*dejar* or *quedar*: how you left it, or how it ended up" },
      { type: "containsAny", words: ["impecable", "hecho un", "hecha un", "como nuevo", "como nueva", "de arriba abajo", "a fondo"], label: "the state: *impecable*, *hecho un desastre*, *como nuevo*" }
    ],
    model: "Cuando me fui de la residencia, dejé el cuarto impecable, pero la cocina común quedó hecha un desastre."
  },
  pitfalls: [
    "*La cocina está hecho un desastre* is the slip: *hecha*, because it agrees with *cocina*.",
    "*Estar hecho un asco* is what Spain says. Here, *hecho un desastre* or *un chiquero*.",
    "*Atascado* for a blocked pipe is Spain's word; in Colombia a drain is *tapado*."
  ]
},

"nt-edad-vejez-c1": {
  source: "merged",
  hook: {
    line: "Twenty years after school, you walk into the reunion and your old desk mate looks exactly the same. Later, the youngest person in your new office turns out to know more than anyone. Age in Spanish is often about time and experience, not birthdays.",
    es: "¡Juliana, estás igualita! Por ti no pasan los años.\nY tú, ¿sigues en el banco? Ya eres toda una veterana.",
    en: "Juliana, you haven't changed a bit! The years don't touch you.\nAnd you, still at the bank? You're a real old hand by now."
  },
  examples: [
    { es: "Es un novato en la empresa, aunque tiene cuarenta años y mucha experiencia en otros sectores.", en: "He's new at the company, although he's forty and has a lot of experience in other sectors." },
    { es: "Mi tía tiene sesenta años y está igualita a como era en las fotos de la universidad.", en: "My aunt is sixty and looks just the same as in her university photos." },
    { es: "La leche de la nevera ya está vencida, así que mejor no la uses para el café.", en: "The milk in the fridge is past its date, so you'd better not use it for the coffee." }
  ],
  rule: "*Novato* and *veterano* measure experience, not age: a twenty-five-year-old can be *una veterana* in her job.\nTo praise someone who looks young: *Por ti no pasan los años*, or in Colombia, *¡Estás igualito!*\n*Conservarse bien* works for people and things: *se conserva muy bien*.\nPapers and food *se vencen*. With *se me* it happened to you: *Se me venció la cédula.* Once it has, it *está vencida*. Then you *renuevas* it.\nTo do up a house in Latin America, *remodelar*; to bring knowledge up to date, *actualizar*.\nA child in Colombia is often *un pelado* or *una pelada*.",
  readAndPick: [
    { q: "How old is the veteran?", es: "Tiene veintiocho años, pero es toda una veterana en el hospital.",
      options: ["Old, close to retiring", "Young but experienced", "Young and brand new"], answer: 1,
      why: "*Veterana* is experience: years in the job, not years of age." },
    { q: "What is she saying to her old friend?", es: "¡Por ti no pasan los años!",
      options: ["You look just the same", "You look much older", "Time flies so fast"], answer: 0,
      why: "*Por ti no pasan los años* is always praise: the years have not touched you." },
    { q: "What happened to the passport?", es: "Se me venció el pasaporte.",
      options: ["I lost it on a trip", "Someone took it", "It's out of date"], answer: 2,
      why: "*Vencerse* is running out. *Se me* says it happened to you, not that you did it." },
    { q: "Who is playing in the street?", es: "Los pelados del barrio juegan fútbol en la calle.",
      options: ["The bald men", "The kids", "The neighbours"], answer: 1,
      why: "In Colombia *pelado* is an everyday word for a kid or a young person." },
    { q: "What do they want to do with the house?", es: "Quieren remodelar la casa antes de venderla.",
      options: ["Do it up before selling", "Sell it as it is", "Rent it out for a year"], answer: 0,
      why: "*Remodelar* is renovating. Spain says *reformar*." }
  ],
  yourTurn: [
    { en: "My ID card has expired.", es: "Se me venció la cédula.", accept: ["Se me venció la cédula.", "La cédula se me venció."] },
    { en: "You haven't changed a bit! (to a male friend)", es: "¡Estás igualito!", accept: ["¡Estás igualito!", "¡Estás igual!"] },
    { en: "She's still a beginner in this job.", es: "Todavía es novata en este trabajo.", accept: ["[Todavía|Aún] es (una) novata en este trabajo.", "Sigue siendo (una) novata en este trabajo."] },
    { en: "The car is very well preserved for its age.", es: "El carro se conserva muy bien para su edad.", accept: ["El carro se conserva muy bien para [su edad|los años que tiene]."] }
  ],
  translate: [
    { en: "At the reunion everyone told Juliana that she hadn't changed at all in twenty years.", es: "En el reencuentro todos le dijeron a Juliana que no había cambiado nada en veinte años.", accept: ["En [el reencuentro|la reunión] todos le dijeron a Juliana que no había cambiado nada en veinte años."] },
    { en: "He's only thirty, but he's a veteran at the company: he started there at eighteen.", es: "Solo tiene treinta años, pero es un veterano en la empresa: empezó allí a los dieciocho.", accept: ["Solo tiene treinta (años), pero es un veterano en la empresa: empezó [allí|ahí] a los dieciocho (años)."] },
    { en: "My passport expired last month, so I have to renew it before the trip in June.", es: "Se me venció el pasaporte el mes pasado, así que tengo que renovarlo antes del viaje de junio.", accept: ["[Se me venció el pasaporte|El pasaporte se me venció] el mes pasado, así que [tengo que renovarlo|lo tengo que renovar] antes del viaje [de|en] junio."] },
    { en: "My grandfather drives as if he were twenty, and the years don't seem to touch him.", es: "Mi abuelo maneja como si tuviera veinte, y por él no pasan los años.", accept: ["Mi abuelo maneja como si tuviera veinte (años), y [por él no pasan los años|los años no pasan por él]."] },
    { en: "The house is a hundred years old, but it's very well preserved; we're only going to renovate the kitchen.", es: "La casa tiene cien años, pero se conserva muy bien; solo vamos a remodelar la cocina.", accept: ["La casa tiene cien años, pero se conserva muy bien; solo [vamos a remodelar|remodelaremos] la cocina."] },
    { en: "There is a clear generational conflict in that family. The grandparents and the grandchildren hardly understand each other.", es: "En esa familia hay un claro conflicto generacional. Los abuelos y los nietos casi no se entienden.", accept: ["[En esa familia hay un claro conflicto generacional|Hay un claro conflicto generacional en esa familia]. Los abuelos y los nietos [casi no|apenas] se entienden."] }
  ],
  register: [
    { es: "¡Estás igualito!", en: "You haven't changed a bit!", when: "in Colombia, to a friend you haven't seen in years" },
    { es: "Por ti no pasan los años.", en: "The years don't touch you.", when: "anywhere, warm praise at any age" },
    { es: "Se ve muy bien, de verdad.", en: "You look really well, honestly.", when: "to someone you call usted, like an older relative" },
    { es: "Usted se conserva muy bien.", en: "You've kept yourself very well.", when: "to an older person, never to someone young" }
  ],
  personal: {
    prompt: "Write about someone you know who is a veteran at something despite their age, or who never seems to get older.",
    constraints: [
      { type: "containsAny", words: ["veterano", "veterana", "novato", "novata", "no pasan los años", "igualito", "igualita", "se conserva"], label: "experience or age: *veterano*, *novato*, *no pasan los años*" },
      { type: "minWords", n: 12, label: "at least twelve words" }
    ],
    model: "Mi tía Rosa tiene setenta años, pero por ella no pasan los años: sigue manejando su tienda y es toda una veterana en el barrio."
  },
  pitfalls: [
    "*Veterano* is not old: it is someone with years in an activity, whatever their age.",
    "*Yo vencí el pasaporte* is the slip: it ran out on its own, so *se me venció*.",
    "*Caducado* is Spain's word; in Colombia milk and papers are *vencidos*."
  ]
},

"task-c1-idiom": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a genuinely bad day, told the way a Colombian friend would tell it over a coffee. Every state and reaction should be idiom, because the neutral version is what gives a foreigner away.",
    es: "Desde que me levanté, todo me salió al revés.\nA mediodía ya estaba hasta la coronilla.",
    en: "From the moment I got up, everything went wrong.\nBy midday I'd had it up to here."
  },
  examples: [
    { es: "Para completar, se me fue el santo al cielo en plena presentación y me quedé en blanco.", en: "To top it all, I lost my thread in the middle of the presentation and my mind went blank." },
    { es: "Mi vecina, que es un amor, me había dejado una nota y una sopa en la puerta.", en: "My neighbour, who is a sweetheart, had left me a note and some soup at the door." }
  ],
  rule: "A bad day told in idiom makes four moves.\nSet the scene with a picture, not a fact: *hacía un frío que calaba los huesos*, *el bus iba repleto*.\nPile it up with *para completar* or *encima*: *Y encima, se me fue el santo al cielo.*\nPut each state in the body: *estaba hasta la coronilla*, *llegué hecho polvo*, *me moría de hambre*.\nEnd on a turn: *Eso sí me salvó el día.*\nThe test for every line: would a Colombian friend say this, or is it correct Spanish nobody says? *Estaba muy cansado* is never wrong, and it is always the foreigner's version.",
  readAndPick: [
    { q: "What happened in the presentation?", es: "Se me fue el santo al cielo en plena presentación.",
      options: ["She lost her thread", "She got very nervous", "Someone interrupted her"], answer: 0,
      why: "*Se me fue el santo al cielo*: what you were going to say flew off." },
    { q: "What does *encima* do here?", es: "Llovía, y encima se me dañó el celular.",
      options: ["Says where the phone was", "Adds one more bad thing", "Brings in the ending"], answer: 1,
      why: "*Encima* piles it on: on top of everything else." },
    { q: "How was the bus?", es: "El bus iba repleto.",
      options: ["Late, as usual", "Almost empty", "Packed full"], answer: 2,
      why: "*Repleto*: full to bursting." },
    { q: "What was he doing at the meeting?", es: "En esa reunión yo estaba pintado.",
      options: ["Painting the walls", "Leading the talk", "Just sitting there"], answer: 2,
      why: "In Colombia, *estar pintado* is being there for show, with nothing to do." },
    { q: "How did he get home?", es: "Llegué a la casa hecho polvo.",
      options: ["Covered in dust", "Completely worn out", "Very late at night"], answer: 1,
      why: "*Hecho polvo* is worn out, not dusty: read the idiom, not the words." }
  ],
  yourTurn: [
    { en: "By midday I'd had it up to here.", es: "A mediodía ya estaba hasta la coronilla.", accept: ["[A mediodía|Al mediodía] ya estaba hasta la coronilla."] },
    { en: "I got home completely worn out. (a man speaking)", es: "Llegué a la casa hecho polvo.", accept: ["Llegué a (la) casa [hecho polvo|muerto|molido|rendido]."] },
    { en: "To top it all, my mind went blank in front of thirty people.", es: "Para completar, me quedé en blanco delante de treinta personas.", accept: ["[Para completar|Para colmo|Encima], me quedé en blanco [delante de|frente a] treinta personas."] },
    { en: "My neighbour is a sweetheart. (about a woman)", es: "Mi vecina es un amor.", accept: ["Mi vecina es un [amor|sol|ángel]."] }
  ],
  translate: [
    { en: "I woke up to a bone-chilling cold, and the water heater wouldn't come on.", es: "Me desperté con un frío que calaba los huesos, y el calentador no prendía.", accept: ["Me desperté con un frío que (me) calaba (hasta) los huesos, y el calentador no [prendía|encendía|quería prender]."] },
    { en: "I left without breakfast and, to top it all, the bus was packed and I only just made it.", es: "Salí sin desayunar y, para completar, el bus iba repleto y llegué de milagro.", accept: ["Salí sin desayunar y, [para completar|para colmo|encima], el bus iba [repleto|lleno] y llegué [de milagro|por un pelo]."] },
    { en: "The boss was in a foul mood and spent the whole morning looking down on us.", es: "El jefe estaba de mal genio y se pasó toda la mañana mirándonos por encima del hombro.", accept: ["El jefe estaba de mal genio y se pasó [toda la mañana|la mañana entera] mirándonos por encima del hombro."] },
    { en: "Lunch was so bland that I left half of it, and by four I was starving.", es: "El almuerzo estaba tan simple que dejé la mitad, y a las cuatro me moría de hambre.", accept: ["El almuerzo estaba tan [simple|desabrido] que dejé la mitad, y a las cuatro (ya) me moría de hambre."] },
    { en: "I got home worn out, had some soup and was asleep by eight. (a man speaking)", es: "Volví a la casa hecho polvo, me comí una sopa y a las ocho ya estaba dormido.", accept: ["[Volví|Llegué] a (la) casa hecho polvo, me comí una sopa y a las ocho ya estaba dormido."] },
    { en: "That really did save my day. That night I went to bed feeling much better, and ready to laugh at it all.", es: "Eso sí que me salvó el día. Esa noche me acosté sintiéndome mucho mejor y con ganas de reírme de todo.", accept: ["Eso sí (que) me salvó el día. Esa noche me acosté sintiéndome mucho mejor(,) y con ganas de reírme de todo."] }
  ],
  register: [
    { es: "Tuve un día de perros.", en: "I had a rotten day.", when: "anywhere, with friends or colleagues" },
    { es: "Hoy todo me salió al revés.", en: "Everything went wrong for me today.", when: "with anyone, in conversation" },
    { es: "¡Qué día tan pesado!", en: "What a heavy day!", when: "with friends, as you collapse on the sofa" },
    { es: "Fue un día bastante complicado.", en: "It was a rather difficult day.", when: "at work, when you don't want to complain" },
    { es: "La jornada presentó varios contratiempos.", en: "The day brought several setbacks.", when: "in a written report about work" }
  ],
  personal: {
    prompt: "Write the opening of your own bad day, four sentences or more, with no neutral state: put the scene in a picture and at least two states in the body.",
    constraints: [
      { type: "minSentences", n: 4, label: "four sentences or more" },
      { type: "containsAny", words: ["hecho polvo", "hecha polvo", "hasta la coronilla", "me moría de", "me muero de", "se me fue el santo", "de mal genio", "me quedé en blanco", "un frío que", "un calor que", "para completar", "encima"], label: "idiom where a neutral word would do" },
      { type: "avoidsAny", words: ["muy cansado", "muy cansada", "muy enojado", "muy enojada", "muy aburrido", "muy aburrida"], label: "no neutral states: no *muy cansado*, no *muy enojado*" }
    ],
    model: "Me desperté con un frío que calaba los huesos. El calentador no prendía y me tocó bañarme con agua helada. Para completar, el bus iba repleto y llegué de milagro. A mediodía ya estaba hasta la coronilla."
  },
  pitfalls: [
    "*Bocadillo* in Colombia is guava paste, not a sandwich: lunch was a *sándwich* or an *almuerzo*.",
    "An idiom used twice stops being colour: pick a different one for each state.",
    "*Estaba muy cansado* is never an error, which is why it is the trap: nothing marks it as foreign except that nobody would say it."
  ]
},

/* ---- unit c1-u56 · Irony and implicature ---------------------------------- */

"dc-ironia-c1": {
  source: "old",
  hook: {
    line: "Your colleague Andrés turns up forty minutes late to the meeting he called, for the third time this month. Someone at the table says something lovely about his punctuality, and everyone laughs except you. Irony in Spanish leaves marks, and once you know them you stop missing it.",
    es: "Ya llegó Andrés.\nSí, puntualísimo, como siempre.",
    en: "Andrés is here.\nYes, as punctual as ever."
  },
  examples: [
    { es: "Gracias por tu ayuda con el trasteo, de verdad, no sé qué habría hecho sin ti.", en: "Thanks for your help with the move, really, I don't know what I'd have done without you." },
    { es: "La reunión duró cuatro horas y resolvimos, cómo no, absolutamente nada de lo que importaba.", en: "The meeting lasted four hours and we resolved, needless to say, absolutely nothing that mattered." },
    { es: "Le pregunté si le pedía ayuda a Javier y me dijo: sí, como él ayuda tanto...", en: "I asked whether I should ask Javier for help and she said: yes, since he helps so much..." }
  ],
  rule: "Irony in Spanish leaves marks. Learn to hear them before you use them.\nThe sentence that trails off: *Sí, como viene tanto...* The missing half is the meaning.\nPraise nobody could mean, against a fact everyone knows: *puntualísimo* for someone always late. The *-ísimo* is often the giveaway.\nA word set against a figure: *Costó una bobadita: tres millones de pesos.*\nA small aside in the middle: *resolvimos, cómo no, nada*.\nIn writing it goes quiet: *No deja de ser curioso que...*\nIf every word makes sense and the whole does not fit the facts, assume irony first.",
  readAndPick: [
    { q: "Does he think Andrés is punctual?", es: "Sí, puntualísimo, como siempre.",
      options: ["Yes, he is always early", "No, he is always late", "He has no idea at all"], answer: 1,
      why: "Praise against a fact everyone knows: *puntualísimo* for someone who is always late." },
    { q: "How much did the bag cost, in her view?", es: "Costó una bobadita: tres millones de pesos.",
      options: ["Far too much", "Almost nothing", "A fair price"], answer: 0,
      why: "*Una bobadita*, a trifle, set against three million: the figure does the work." },
    { q: "What is the unsaid half?", es: "Sí, como Javier ayuda tanto...",
      options: ["Javier will gladly help", "Javier is very busy", "Javier never helps"], answer: 2,
      why: "The sentence trails off and leaves the opposite unsaid: he never does." },
    { q: "How much did they resolve?", es: "Resolvimos, cómo no, absolutamente nada.",
      options: ["Nothing, as expected", "Everything, at last", "Only the budget"], answer: 0,
      why: "*Cómo no* in the middle says: of course, as always, nothing." },
    { q: "What is the writer doing here?", es: "No deja de ser curioso que el informe apareciera justo después de las elecciones.",
      options: ["Praising the report", "Hinting at a cover-up", "Asking for the date it came out"], answer: 1,
      why: "*No deja de ser curioso* is written irony: it points without accusing." }
  ],
  yourTurn: [
    { en: "Thanks for your help, I don't know what I'd have done without you. (to a friend)", es: "Gracias por tu ayuda, no sé qué habría hecho sin ti.", accept: ["Gracias por tu ayuda, no sé qué [habría|hubiera] hecho sin ti."] },
    { en: "Yes, as punctual as ever.", es: "Sí, puntualísimo, como siempre.", accept: ["Sí, [puntualísimo|puntualísima], como siempre."] },
    { en: "It cost a trifle: three million pesos.", es: "Costó una bobadita: tres millones de pesos.", accept: ["Costó una [bobadita|bobada|miseria]: tres millones de pesos."] },
    { en: "We resolved, needless to say, absolutely nothing.", es: "Resolvimos, cómo no, absolutamente nada.", accept: ["Resolvimos, [cómo no|como siempre|por supuesto], absolutamente nada."] }
  ],
  translate: [
    { en: "Andrés arrived forty minutes late to his own meeting, and Laura said: as punctual as ever.", es: "Andrés llegó cuarenta minutos tarde a su propia reunión, y Laura dijo: puntualísimo, como siempre.", accept: [] },
    { en: "The new boss cancelled the whole team's holidays. What a lovely gesture to start the year!", es: "El nuevo jefe canceló las vacaciones de todo el equipo. ¡Qué detalle tan bonito para empezar el año!", accept: ["[El nuevo jefe|El jefe nuevo] canceló las vacaciones de todo el equipo. ¡Qué detalle tan [bonito|lindo] para empezar el año!"] },
    { en: "They charged us a trifle to fix the car: two million pesos and three weeks of waiting.", es: "Nos cobraron una bobadita por arreglar el carro: dos millones de pesos y tres semanas de espera.", accept: ["Nos cobraron una [bobadita|bobada|miseria] por arreglar el carro: dos millones de pesos y tres semanas de espera."] },
    { en: "It is striking that nobody on the board remembered such an important detail. (formal)", es: "No deja de ser llamativo que nadie en la junta recordara un detalle tan importante.", accept: ["No deja de ser [llamativo|curioso] que nadie en la junta [recordara|haya recordado] un detalle tan importante."] },
    { en: "One must congratulate those responsible for their extraordinary foresight. The bridge fell down a week after it opened. (formal)", es: "Cabe felicitar a los responsables por su extraordinaria previsión. El puente se cayó una semana después de la inauguración.", accept: ["Cabe felicitar a los responsables por su extraordinaria previsión. El puente se cayó una semana después de [la inauguración|inaugurarlo|abrirse]."] },
    { en: "She said it was a brilliant idea, but ironically, and her boss took it seriously.", es: "Dijo que era una idea genial, pero con ironía, y su jefe se lo tomó en serio.", accept: ["Dijo que era una idea [genial|buenísima], pero [con ironía|irónicamente], y su jefe se lo tomó en serio."] }
  ],
  register: [
    { es: "Ajá, sí, claro.", en: "Uh huh, yeah, sure.", when: "with friends, to show you don't believe a word" },
    { es: "¡Muy bonito!", en: "Very nice!", when: "to someone who has just done something wrong" },
    { es: "Gracias por tu ayuda, ¿eh?", en: "Thanks for your help, eh?", when: "to a friend who did nothing, half joking" },
    { es: "No deja de ser curioso que nadie lo supiera.", en: "It is rather curious that nobody knew.", when: "in writing, to point without accusing" },
    { es: "Cabe felicitar a los responsables por su previsión.", en: "Those responsible deserve congratulations on their foresight.", when: "in an opinion column, as formal irony" }
  ],
  personal: {
    prompt: "Write an ironic line you could say to a friend who has done something obviously foolish, and then the plain version of what you mean.",
    constraints: [
      { type: "containsAny", words: ["ísimo", "ísima", "como siempre", "cómo no", "muy bonito", "gracias por", "qué detalle", "..."], label: "a mark of irony: *-ísimo*, *como siempre*, *cómo no*, a trailing *...*" },
      { type: "minWords", n: 10, label: "at least ten words" }
    ],
    model: "Llegaste dos horas tarde y sin regalo. Puntualísimo y generosísimo, como siempre. En serio, la próxima vez avísame."
  },
  pitfalls: [
    "Irony is not a word you can look up: when every word makes sense and the whole does not fit the facts, assume irony.",
    "In a formal setting, irony read straight is a compliment: if they may not catch it, say it plainly.",
    "*Enhorabuena* in an ironic line sounds like Spain; here people say *felicitaciones*."
  ]
},

"dc-valores-ilocutivos-c1": {
  source: "merged",
  hook: {
    line: "Your colleague in Bogotá passes your desk and asks 'what else?'. You start listing what else you have to do today, and she laughs: it was hello. Most questions in Spanish are not after information at all.",
    es: "¿Qué más? ¿Cómo vas?\nBien, ¿y tú qué más?",
    en: "What's up? How are you doing?\nGood, and what's up with you?"
  },
  examples: [
    { es: "Cuando mi compañera pasa por mi escritorio y me dice «¿qué más?», solo me está saludando.", en: "When my colleague walks past my desk and says 'what's up?', she's only saying hello." },
    { es: "¿Que si me gusta el ajiaco? ¡Me encanta, mi abuela lo hacía todos los domingos!", en: "Do I like ajiaco? I love it, my grandmother used to make it every Sunday!" },
    { es: "¿Cómo que me vaya? ¡Si acabo de llegar y ni siquiera me he quitado la chaqueta!", en: "What do you mean, I should leave? I've only just arrived and I haven't even taken my jacket off!" }
  ],
  rule: "A question can greet, offer, ask leave, criticise or push back, and none of these wants a literal answer.\nGreeting: in Colombia, *¿Qué más?* is hello. Answer *Bien, ¿y tú qué más?*\nOffers and permission take the present: *¿Te ayudo?* *¿Le molesta si abro la ventana?*\nThe echo: *¿Que si...?* repeats the question to launch a big yes: *¿Que si me gusta? ¡Me encanta!*\nPush back with *¿Cómo que...?* and their words. After an order, the subjunctive: *¡Vete!* becomes *¿Cómo que me vaya?* Then the reason with *si*: *¡Si acabo de llegar!*\n*¿Es que no te cae bien?* offers an explanation and doubts it at once.",
  readAndPick: [
    { q: "What does she want when she says this?", es: "¿Qué más, Laura? ¿Cómo vas?",
      options: ["To hear what else Laura has", "Just to say hello", "To end the call"], answer: 1,
      why: "In Colombia, *¿Qué más?* is a greeting. Nobody wants a list." },
    { q: "What is he doing?", es: "¿Te ayudo con la maleta?",
      options: ["Offering to help", "Asking for help", "Refusing to help"], answer: 0,
      why: "*¿Te ayudo?* in the present is an offer: shall I?" },
    { q: "Does she like the food?", es: "¿Que si me gusta? ¡Me encanta!",
      options: ["She isn't sure", "Not really", "Very much"], answer: 2,
      why: "The echo *¿Que si...?* repeats the question only to launch a bigger yes." },
    { q: "What is he doing with the order?", es: "¿Cómo que me vaya? ¡Si acabo de llegar!",
      options: ["Agreeing to leave now", "Asking where to go", "Refusing to leave"], answer: 2,
      why: "*¿Cómo que...?* plus her words pushes back; *si* gives his reason." },
    { q: "Is this a real question?", es: "¿Por qué siempre tienes que ser tan negativo?",
      options: ["Yes, she wants the reason", "No, it is a reproach", "Yes, she is worried"], answer: 1,
      why: "Said fast, with the voice falling, it is a criticism: no answer is expected." },
    { q: "What is the speaker suggesting?", es: "Le hablaste muy feo. ¿Es que no te cae bien?",
      options: ["That he dislikes him", "That he is tired", "That he is shy"], answer: 0,
      why: "*¿Es que...?* offers an explanation and questions it at once." }
  ],
  yourTurn: [
    { en: "Shall I help you with the boxes? (to a friend)", es: "¿Te ayudo con las cajas?", accept: ["¿Te ayudo con las cajas?", "¿Te [doy|echo] una mano con las cajas?"] },
    { en: "Do you mind if I open the window? (polite)", es: "¿Le molesta si abro la ventana?", accept: ["¿Le [molesta|importa] si abro la ventana?"] },
    { en: "Do I like it? I love it!", es: "¿Que si me gusta? ¡Me encanta!", accept: ["¿Que si me gusta? ¡Me [encanta|fascina]!"] },
    { en: "What do you mean, you're not coming? You promised! (to a friend)", es: "¿Cómo que no vienes? ¡Si lo prometiste!", accept: ["¿Cómo que no vienes? ¡Si (me) lo prometiste!"] },
    { en: "What's up? How are you doing? (in Colombia)", es: "¿Qué más? ¿Cómo vas?", accept: ["¿Qué más? ¿Cómo vas?", "¿Quiubo? ¿Cómo vas?"] }
  ],
  translate: [
    { en: "Do you mind if I close the window? The noise from the street won't let me concentrate. (polite)", es: "¿Le molesta si cierro la ventana? El ruido de la calle no me deja concentrarme.", accept: ["¿Le [molesta|importa] si cierro la ventana? El ruido de la calle no me deja concentrarme."] },
    { en: "Do I like dancing? I've been going to salsa classes in Cali every Saturday for ten years!", es: "¿Que si me gusta bailar? ¡Llevo diez años yendo a clases de salsa en Cali todos los sábados!", accept: ["¿Que si me gusta bailar? ¡Llevo diez años yendo [a clases de salsa en Cali todos los sábados|todos los sábados a clases de salsa en Cali]!"] },
    { en: "What do you mean, the coffee's run out? But I bought two kilos at the corner shop yesterday!", es: "¿Cómo que se acabó el café? ¡Si ayer compré dos kilos en la tienda de la esquina!", accept: ["¿Cómo que [se acabó el café|no hay más café|ya no hay café]? ¡Si ayer compré dos kilos en la tienda de la esquina!", "¿Cómo que [se acabó el café|no hay más café|ya no hay café]? ¡Si compré dos kilos en la tienda de la esquina ayer!"] },
    { en: "You spoke to him very coldly in the meeting. Is it that you don't trust him any more?", es: "Le hablaste muy fríamente en la reunión. ¿Es que ya no confías en él?", accept: ["Le hablaste [muy fríamente|con mucha frialdad] en la reunión. ¿Es que ya no confías en él?"] },
    { en: "Shall I help you carry the bags to the car, or would you rather I waited here? (to a friend)", es: "¿Te ayudo a cargar las bolsas hasta el carro, o prefieres que te espere aquí?", accept: ["¿Te ayudo a [cargar|llevar] las bolsas hasta el carro, o prefieres que te espere [aquí|acá]?"] },
    { en: "Why do you always have to be so negative? Not everything goes wrong, you know. (to a friend)", es: "¿Por qué siempre tienes que ser tan negativo? No todo sale mal, ¿sabes?", accept: ["¿Por qué [siempre tienes que ser|tienes que ser siempre] tan [negativo|negativa|pesimista]? No todo sale mal, ¿sabes?"] }
  ],
  register: [
    { es: "¿Te ayudo?", en: "Shall I help?", when: "to anyone you call tú, the everyday offer" },
    { es: "¿Te doy una mano?", en: "Shall I give you a hand?", when: "with friends, warm and casual" },
    { es: "¿Le colaboro con algo?", en: "Can I help you with anything?", when: "in Colombia, in shops and offices" },
    { es: "¿Necesita que le ayude con algo?", en: "Do you need me to help you with anything?", when: "to someone you call usted, careful and kind" },
    { es: "Quedo atento a cualquier cosa que necesite.", en: "I remain at your disposal for anything you need.", when: "closing a work email in Colombia" }
  ],
  personal: {
    prompt: "Write a two-line exchange: someone asks you something obvious about a thing you love, and you answer with the echo and a big yes.",
    constraints: [
      { type: "regex", pattern: "¿\\s*que si\\b", label: "the echo: *¿Que si...?*" },
      { type: "regex", pattern: "¡[^!]+!", label: "a big answer: *¡...!*" }
    ],
    model: "¿Que si me gusta el café? ¡Me tomo cinco tintos al día!"
  },
  pitfalls: [
    "*¿Cómo no vienes?* drops the *que*: pushing back is *¿Cómo que no vienes?*",
    "After an order, the echo takes the subjunctive: *¿Cómo que me vaya?*, not *me voy*.",
    "*Si* in *¡Si lo prometiste!* has no accent: it is not yes, it is a protest."
  ]
},

"dc-metaforas-c1": {
  source: "merged",
  hook: {
    line: "Your friend Mariana wants to know what her new team is like before she starts on Monday. Nobody describes a colleague with a list of qualities. They hand down a verdict in one picture.",
    es: "La jefa es una fiera para los números.\nEl de sistemas es un pan de Dios.\nY cuidado con Felipe, que es un sapo.",
    en: "The boss is a whiz with numbers.\nThe IT guy has a heart of gold.\nAnd watch out for Felipe, he's a snitch."
  },
  examples: [
    { es: "Mi hermano mayor habla de política como si fuera ministro, y nunca ha leído un periódico.", en: "My older brother talks about politics as if he were a minister, and he has never read a newspaper." },
    { es: "Ese viaje a San Andrés nos costó un ojo de la cara, pero valió cada peso.", en: "That trip to San Andrés cost us an arm and a leg, but it was worth every peso." },
    { es: "Mi abuela es un pan de Dios: le presta plata a todo el barrio y nunca cobra.", en: "My grandmother has a heart of gold: she lends money to the whole neighbourhood and never asks for it back." }
  ],
  rule: "Spanish often judges a person with a picture, not a description: *ser* plus *un* or *una* and a thing or an animal.\n*Es una fiera para los números.* *Es un lince.* *Es un pan de Dios.* In Colombia *un sapo* is a snitch.\nThe picture keeps its own *un* or *una*, whoever you mean: a man can be *una fiera*. A few insults switch for a man: *es un gallina*.\nTo say what at, add *para*: *una máquina para vender*.\n*Como si* sets up a picture that is not true, so the past subjunctive follows: *Habla como si fuera el dueño.*\nSome pictures are frozen: *costar un ojo de la cara*, *tomarle el pelo a alguien*.",
  readAndPick: [
    { q: "What is the boss good at?", es: "La jefa es una fiera para los números.",
      options: ["Shouting at people", "Working with figures", "Looking after animals"], answer: 1,
      why: "*Una fiera para* is formidable at something: here, numbers." },
    { q: "Is he the owner?", es: "Habla como si fuera el dueño.",
      options: ["No, he only acts like it", "Yes, he bought it last year", "Yes, and he says so"], answer: 0,
      why: "*Como si fuera*: a picture that is not true, so the past subjunctive." },
    { q: "Should you tell Felipe a secret?", es: "No le cuentes nada a Felipe, que es un sapo.",
      options: ["Yes, he is very quiet", "Yes, he gives good advice", "No, he'll tell others"], answer: 2,
      why: "In Colombia, *un sapo* is someone who tells on people." },
    { q: "Who is the coward?", es: "Mi hermano es un gallina: no se atreve a hablar con ella.",
      options: ["My sister", "My brother", "Her boss"], answer: 1,
      why: "*Un gallina*: one of the few insults that switch to *un* for a man." },
    { q: "Is she being serious?", es: "Tranquilo, te estoy tomando el pelo.",
      options: ["No, she's joking", "Yes, completely", "She's cutting hair"], answer: 0,
      why: "*Tomarle el pelo a alguien* is pulling their leg, not their hair." },
    { q: "How much did the roof cost?", es: "Arreglar el techo nos costó un ojo de la cara.",
      options: ["Almost nothing", "A fair amount", "A huge amount"], answer: 2,
      why: "*Un ojo de la cara*, an eye from your face: a fortune." }
  ],
  yourTurn: [
    { en: "She's a whiz with numbers.", es: "Es una fiera para los números.", accept: ["Es una [fiera|máquina] para los números.", "Es un genio para los números."] },
    { en: "He talks as if he owned the company.", es: "Habla como si fuera el dueño de la empresa.", accept: ["Habla como si fuera el dueño de la empresa.", "Habla como si la empresa fuera suya."] },
    { en: "My brother is a chicken: he doesn't dare to call her.", es: "Mi hermano es un gallina: no se atreve a llamarla.", accept: [] },
    { en: "That car cost us an arm and a leg.", es: "Ese carro nos costó un ojo de la cara.", accept: [] },
    { en: "Your grandmother has a heart of gold. (to a friend)", es: "Tu abuela es un pan de Dios.", accept: [] }
  ],
  translate: [
    { en: "The new accountant is a whiz with numbers, but she's terrible at explaining what she does.", es: "La nueva contadora es una fiera para los números, pero es malísima para explicar lo que hace.", accept: ["[La nueva contadora|La contadora nueva] es una fiera para los números, pero es [malísima|pésima|muy mala] para explicar lo que hace."] },
    { en: "Don't tell Felipe about the party: he's a snitch and tells the boss everything.", es: "No le cuentes a Felipe lo de la fiesta: es un sapo y le dice todo al jefe.", accept: ["No le cuentes [a Felipe lo de la fiesta|lo de la fiesta a Felipe]: es un sapo y le [dice|cuenta] todo al jefe.", "No le cuentes [a Felipe lo de la fiesta|lo de la fiesta a Felipe], [que|porque] es un sapo y le [dice|cuenta] todo al jefe."] },
    { en: "She looked at us as if she didn't understand anything, but she had planned it all.", es: "Nos miró como si no entendiera nada, pero lo había planeado todo.", accept: ["Nos miró como si no entendiera nada, pero lo había planeado todo.", "Nos miró como si no entendiera nada, pero (ella) había planeado todo."] },
    { en: "After the argument, he came into the office as if nothing had happened and greeted everyone.", es: "Después de la pelea, entró a la oficina como si nada y saludó a todo el mundo.", accept: ["Después de la [pelea|discusión], entró a la oficina [como si nada|como si no hubiera pasado nada] y saludó a [todo el mundo|todos]."] },
    { en: "Relax, I was pulling your leg. The meeting isn't at six, it's at eight. (to a woman)", es: "Tranquila, te estaba tomando el pelo. La reunión no es a las seis, sino a las ocho.", accept: ["Tranquila, te estaba tomando el pelo. La reunión no es a las seis, [sino a las ocho|es a las ocho]."] },
    { en: "You have to keep your feet on the ground. An apartment in that neighbourhood costs an arm and a leg.", es: "Hay que tener los pies en la tierra. Un apartamento en ese barrio cuesta un ojo de la cara.", accept: ["[Hay que|Tienes que] tener los pies en la tierra. Un apartamento en ese barrio cuesta un ojo de la cara."] }
  ],
  register: [
    { es: "Es un lince.", en: "He's razor-sharp.", when: "with friends, as admiring slang" },
    { es: "Es una fiera para eso.", en: "She's a whiz at that.", when: "in conversation, about a real talent" },
    { es: "Es muy hábil.", en: "She's very skilful.", when: "with anyone, plain and safe" },
    { es: "Tiene una capacidad analítica excepcional.", en: "She has an exceptional analytical ability.", when: "in a reference letter or an evaluation" }
  ],
  personal: {
    prompt: "Describe two people you know, each with one picture: what they are like, and one thing they do as if something were true.",
    constraints: [
      { type: "regex", pattern: "\\b(es|eres|son) (un|una) [a-záéíóúñ]+", label: "a verdict in one picture: *es un* or *es una*" },
      { type: "subjunctiveAfter", trigger: "como si", within: 3, label: "*como si* and the past subjunctive" }
    ],
    model: "Mi primo Andrés es un lince para los negocios. Mi jefa, en cambio, maneja como si estuviera en una carrera."
  },
  pitfalls: [
    "*Como si es el dueño* is the slip: *como si* always takes the past subjunctive, *como si fuera*.",
    "*Ella es fiera para los números* drops the *una*: the picture needs it.",
    "*¡Menudo lío!* is what Spain says. Here, *¡Qué lío!* or *¡Tremendo lío!*"
  ]
},

"dc-intensificacion-c1": {
  source: "merged",
  hook: {
    line: "Your cousin is telling you about the final in Barranquilla: the goal in the last minute, the face the goalkeeper pulled, the rain. Half of what makes his story vivid is what he leaves unsaid.",
    es: "¡Qué golazo, primo!\n¡Y la cara que puso el arquero!\nLlovía tanto...",
    en: "What a goal, cousin!\nAnd the face the goalkeeper pulled!\nIt was raining so hard..."
  },
  examples: [
    { es: "No sabes lo mal que la pasamos esa noche, esperando el bus bajo un aguacero.", en: "You have no idea what a bad time we had that night, waiting for the bus in a downpour." },
    { es: "¡Llovía tanto aquella tarde en Barranquilla...! Mejor ni te cuento cómo llegamos a la casa.", en: "It was raining so hard that afternoon in Barranquilla...! I'd better not even tell you how we got home." },
    { es: "Que sí, mamá, que ya te llamo apenas llegue al hotel, no te preocupes.", en: "Yes, Mom, I told you, I'll call you as soon as I get to the hotel, don't worry." }
  ],
  rule: "Spanish turns things up with small pieces and with what it leaves out.\n*-azo* makes it huge: *un golazo*, *un aguacerazo*. A little *-ito* can turn it up too: *vale su platica* says it costs a fair bit.\n*La* or *lo* with *que* makes a whole exclamation: *¡La cara que puso!* *No sabes lo cansada que estoy.*\nCut off the result and the listener supplies it: *¡Llovía tanto...!*\n*Como* plus the subjunctive, left hanging, is a threat: *Como me entere de que no fuiste...*\nA *que* in front repeats what you already said, with impatience: *Que sí, mamá, que ya voy.*",
  readAndPick: [
    { q: "How good was the goal?", es: "¡Qué golazo metió Díaz!",
      options: ["Lucky but ugly", "Spectacular", "Disallowed"], answer: 1,
      why: "*-azo* makes it huge: not just a goal, a great goal." },
    { q: "Is the bracelet cheap?", es: "Me gustaría regalársela, pero vale su platica.",
      options: ["No, it costs a fair bit", "Yes, it's a bargain", "It was a free gift"], answer: 0,
      why: "*Su platica* sounds small, but it says the price is quite high." },
    { q: "What does she leave out?", es: "¡Llovía tanto aquella tarde...!",
      options: ["Where she was", "What the rain caused", "Who was with her"], answer: 1,
      why: "A cut-off *tanto...* leaves the result to you: it was too much." },
    { q: "What is the mother doing?", es: "Como me entere de que no fuiste a clase...",
      options: ["Asking about class", "Praising her son", "Warning her son"], answer: 2,
      why: "*Como* plus the subjunctive, left hanging, is a threat." },
    { q: "How many times has he said yes?", es: "Que sí, mamá, que ya te llamo.",
      options: ["At least twice", "This is the first", "Never before"], answer: 0,
      why: "The *que* in front says: I already told you." },
    { q: "How tired is she?", es: "No sabes lo cansada que estoy.",
      options: ["A little tired", "Not tired at all", "Extremely tired"], answer: 2,
      why: "*Lo* plus *que* turns the whole sentence into an exclamation: very tired." }
  ],
  yourTurn: [
    { en: "The face he pulled when you told him! (to a friend)", es: "¡La cara que puso cuando se lo dijiste!", accept: ["¡[La cara que|Qué cara] puso cuando se lo dijiste!"] },
    { en: "You have no idea what a bad time we had. (to a friend)", es: "No sabes lo mal que la pasamos.", accept: ["No [sabes|te imaginas] lo mal que [la|lo] pasamos."] },
    { en: "Yes, Mom, I told you, I'm coming.", es: "Que sí, mamá, que ya voy.", accept: ["Que sí, mamá, (que) ya voy."] },
    { en: "If I find out you didn't go to class, you'll see. (to your son)", es: "Como me entere de que no fuiste a clase, vas a ver.", accept: ["Como me entere de que no fuiste a clase, [vas a ver|ya verás]."] }
  ],
  translate: [
    { en: "In the last minute Díaz scored a stunning goal, and you should have seen the face the goalkeeper pulled.", es: "En el último minuto Díaz metió un golazo, y hubieras visto la cara que puso el arquero.", accept: ["En el último minuto Díaz metió un golazo, y [hubieras visto|tenías que ver] la cara que puso el arquero."] },
    { en: "I'd like to give her the bracelet, but it costs a fair bit and I'm short of money this month.", es: "Me gustaría regalarle la pulsera, pero vale su platica y este mes estoy corto de plata.", accept: ["Me gustaría regalarle la pulsera, pero vale su platica y este mes [estoy|ando] [corto|corta] de plata."] },
    { en: "You have no idea what a fright we got. The plane started shaking right over the mountains.", es: "No sabes el susto que nos dimos. El avión empezó a temblar justo encima de las montañas.", accept: ["No [sabes|te imaginas] el susto que nos [dimos|pegamos]. El avión empezó a [temblar|moverse|sacudirse] justo encima de las montañas."] },
    { en: "If I find out you went to the party without telling me, you'll see. (to your daughter)", es: "Como me entere de que fuiste a la fiesta sin avisarme, vas a ver.", accept: ["Como me entere de que fuiste a la fiesta sin [avisarme|decirme], [vas a ver|ya verás]."] },
    { en: "Yes, Grandma, I told you, I've already taken the pills, all three, with breakfast.", es: "Que sí, abuela, que ya me tomé las pastillas, las tres, con el desayuno.", accept: ["Que sí, abuela, que ya me [tomé|he tomado] las pastillas, las tres, con el desayuno."] },
    { en: "I have not the slightest doubt that everything possible was done to save the building. (formal)", es: "No me cabe la menor duda de que se hizo todo lo posible por salvar el edificio.", accept: ["[No me cabe|No tengo] la menor duda de que se hizo todo lo posible [por|para] salvar el edificio."] }
  ],
  register: [
    { es: "Que sí, que sí.", en: "Yes, yes, I said yes.", when: "to family, when they ask for the third time" },
    { es: "¡Claro que sí!", en: "Of course!", when: "with anyone, an eager yes" },
    { es: "Por supuesto, cuente con eso.", en: "Of course, you can count on it.", when: "to a client, or anyone you call usted" },
    { es: "No me cabe la menor duda.", en: "I have not the slightest doubt.", when: "in a formal statement or a meeting" }
  ],
  personal: {
    prompt: "Write two lines about something that happened to you: one exclamation built with *lo* or *la* and *que*, and one sentence you leave hanging.",
    constraints: [
      { type: "regex", pattern: "\\b(la|el|lo|los|las) [a-záéíóúñ]+ que\\b", label: "an exclamation: *la cara que puso*, *lo mal que la pasamos*" },
      { type: "regex", pattern: "(\\.\\.\\.|…)", label: "a sentence left hanging, with *...*" }
    ],
    model: "¡No sabes lo mal que la pasamos en ese bus! Hacía un calor tan horrible..."
  },
  pitfalls: [
    "*Vale su platica* is not cheap: the little ending softens the tone, not the price.",
    "*Que sí* only works when you said it before: the first time, just *sí*.",
    "*Lo pasamos mal* is what Spain says; in Colombia, *la pasamos mal*."
  ]
},

"fn-escepticismo-contraargumento-c1": {
  source: "old",
  hook: {
    line: "At the team meeting, a colleague presents a plan to save money by moving every client meeting online. Some of it makes sense, and some of it worries you. To be taken seriously, you grant the good part first and then bring in the doubt.",
    es: "No te falta razón en lo del presupuesto.\nAhora bien, tengo mis dudas sobre lo demás.\nYo no digo que sea mala idea, pero hay clientes que no lo van a aceptar.",
    en: "You have a point about the budget.\nThat said, I have my doubts about the rest.\nI'm not saying it's a bad idea, but some clients won't accept it."
  },
  examples: [
    { es: "Yo no digo que sea mala idea, pero faltan detalles importantes sobre el presupuesto y los plazos.", en: "I'm not saying it's a bad idea, but important details about the budget and the deadlines are missing." },
    { es: "No hay duda de que la campaña funcionó, a no ser que los datos estén mal.", en: "There's no doubt the campaign worked, unless the data is wrong." },
    { es: "No sé qué decirte, a mí la propuesta no me convence del todo, la verdad.", en: "I don't know what to tell you, the proposal doesn't fully convince me, to be honest." }
  ],
  rule: "A counterargument that lands concedes something first, then turns.\nTo doubt without saying no: *Tengo mis dudas.* *No me convence del todo.* *No sé qué decirte.*\nTo concede: *No te falta razón*, *En eso me convenciste*, then *pero*, *sin embargo* or, more formally, *ahora bien*.\nTo rule out the extreme reading first: *Yo no digo que sea mala idea, pero...* After *no digo que*, the subjunctive, because you are not claiming it.\nTo leave one door open: *No hay duda de que funciona, a no ser que* plus the subjunctive: *a no ser que cambien las condiciones*.\nThe part after *pero* is the message.",
  readAndPick: [
    { q: "Does she accept the plan?", es: "No me convence del todo.",
      options: ["Fully, with no doubts", "Partly, with doubts", "Not at all, it's bad"], answer: 1,
      why: "*Del todo* makes it partial: not a no, not a yes." },
    { q: "Which part matters most?", es: "No te falta razón, ahora bien, hay que pensar en el costo.",
      options: ["The cost", "That you are right", "The time it takes"], answer: 0,
      why: "The concession opens; what follows *ahora bien* is the real point." },
    { q: "Is he calling it a bad idea?", es: "Yo no digo que sea mala idea, pero faltan datos.",
      options: ["Yes, clearly", "Yes, but kindly", "No, he rules that out"], answer: 2,
      why: "*No digo que sea*: he rules out the extreme reading, then turns." },
    { q: "What could undo the claim?", es: "No hay duda de que fue un éxito, a no ser que los datos estén manipulados.",
      options: ["A bad press review", "Fake data", "A change of boss"], answer: 1,
      why: "*A no ser que* opens one exception, and it takes the subjunctive." },
    { q: "What has she been convinced of?", es: "En eso me convenciste, pero quedan otros puntos.",
      options: ["Everything you said", "Nothing so far", "One point only"], answer: 2,
      why: "*En eso* concedes one point; *pero* keeps the rest open." }
  ],
  yourTurn: [
    { en: "I have my doubts about it.", es: "Tengo mis dudas al respecto.", accept: ["(Yo) tengo mis dudas (al respecto)."] },
    { en: "You have a point, but it needs to be qualified. (to a friend)", es: "No te falta razón, pero hay que matizarlo.", accept: ["No te falta razón, pero hay que [matizarlo|matizar]."] },
    { en: "I'm not saying it's bad, but important details are missing.", es: "No digo que sea malo, pero faltan detalles importantes.", accept: ["(Yo) no digo que sea malo, pero faltan detalles importantes."] },
    { en: "There's no doubt he's guilty, unless someone has lied to us.", es: "No hay duda de que es culpable, a no ser que alguien nos haya mentido.", accept: ["No hay duda de que es (el) culpable, [a no ser que|salvo que|a menos que] alguien nos haya mentido."] }
  ],
  translate: [
    { en: "I have my doubts about whether this will really work with such a small team.", es: "Tengo mis dudas sobre si esto va a funcionar de verdad con un equipo tan pequeño.", accept: ["Tengo mis dudas [sobre|de] si esto va a [funcionar|servir] de verdad con un equipo tan pequeño."] },
    { en: "You have a point; however, before deciding we need to weigh up what it will cost. (to a colleague)", es: "No te falta razón; sin embargo, antes de decidir hay que valorar lo que va a costar.", accept: ["No te falta razón; sin embargo, antes de decidir hay que [valorar|evaluar|pensar] lo que va a costar."] },
    { en: "I'm not saying he isn't a great scientist, but so far he hasn't proved it.", es: "No digo que no sea un gran científico, pero hasta ahora no lo ha demostrado.", accept: ["(Yo) no digo que no sea un gran científico, pero hasta ahora no lo ha demostrado."] },
    { en: "You convinced me on that. Even so, there are other points still to resolve before we sign the contract.", es: "En eso me convenciste. Aun así, quedan otros puntos por resolver antes de firmar el contrato.", accept: ["En eso me [convenciste|has convencido]. Aun así, quedan otros puntos por resolver antes de firmar el contrato."] },
    { en: "There's no doubt the plan is solid, unless the market changes soon.", es: "No hay duda de que el plan es sólido, a no ser que el mercado cambie pronto.", accept: ["No hay duda de que el plan es sólido, [a no ser que|salvo que|a menos que] [el mercado cambie|cambie el mercado] pronto."] },
    { en: "I don't know what to tell you; I didn't think the film was that good, though the music was excellent.", es: "No sé qué decirte, a mí no me pareció tan buena la película, aunque la música era excelente.", accept: ["No sé qué decirte, a mí no me pareció tan buena la película, aunque la música [era|fue] excelente.", "No sé qué decirte, a mí la película no me pareció tan buena, aunque la música [era|fue] excelente."] }
  ],
  register: [
    { es: "No sé qué decirte.", en: "I don't know what to tell you.", when: "with a friend, to doubt without saying no" },
    { es: "No me convence del todo.", en: "I'm not fully convinced.", when: "with anyone, an honest partial no" },
    { es: "Tengo mis dudas al respecto.", en: "I have my doubts about it.", when: "at work, measured and calm" },
    { es: "Comparto el objetivo; ahora bien, el método me preocupa.", en: "I share the aim; that said, the method worries me.", when: "in a meeting or a written reply" },
    { es: "Discrepo de ese planteamiento.", en: "I disagree with that approach.", when: "in formal writing, firm but civil" }
  ],
  personal: {
    prompt: "Someone near you is pushing a plan you half agree with. Grant one point, then bring in your doubt.",
    constraints: [
      { type: "containsAny", words: ["no te falta razón", "no le falta razón", "en eso me convenciste", "en eso tienes razón", "en eso tiene razón", "no digo que"], label: "a concession: *no te falta razón* or *no digo que*" },
      { type: "containsAny", words: ["ahora bien", "sin embargo", "pero", "aunque", "aun así"], label: "the turn: *ahora bien*, *sin embargo* or *pero*" }
    ],
    model: "No te falta razón en lo del horario. Ahora bien, no creo que trabajar desde la casa funcione para el equipo nuevo."
  },
  pitfalls: [
    "*No te falta razón* is a part concession, not agreement: the listener waits for the *pero*.",
    "*No digo que es malo* is the slip: you are not claiming it, so *que sea malo*.",
    "*A no ser que* always takes the subjunctive: *a no ser que cambie*, never *cambia*."
  ]
},

"fn-sorpresa-admiracion-c1": {
  source: "old",
  hook: {
    line: "Your neighbour's daughter, who nearly left school at fifteen, has just graduated top of her class in medicine. Her mother tells you at the door, and you want to say how amazed and how proud you are, not just 'wow'.",
    es: "¡Parece mentira que ya sea médica!\nMe quedé con la boca abierta cuando me contaste.\nDígale que estamos orgullosísimos de ella.",
    en: "It's hard to believe she's a doctor already!\nMy jaw dropped when you told me.\nTell her we're incredibly proud of her."
  },
  examples: [
    { es: "Me sorprende que nadie se haya dado cuenta del error en tres meses de reuniones.", en: "I'm surprised nobody has noticed the mistake in three months of meetings." },
    { es: "Nos quedamos de piedra cuando anunciaron que el equipo más pequeño había ganado el torneo.", en: "We were stunned when they announced that the smallest team had won the tournament." },
    { es: "Me llena de orgullo que hayas terminado la carrera trabajando de noche en una panadería.", en: "It fills me with pride that you finished your degree while working nights in a bakery." }
  ],
  rule: "Surprise can come from the fact or from you, and the frame shows which.\nThe fact does the surprising: *me sorprende que* plus the subjunctive: *Me sorprende que no haya llamado.* In the past, *me sorprendió que no llamara*.\nYou do the reacting: *me sorprendí con*: *Me sorprendí con la noticia.*\nIn the body: *me quedé de piedra*, *me quedé con la boca abierta*.\nFor something hard to believe: *¡Parece mentira que ya sea médica!*\n*¡Quién lo iba a decir!* is for what nobody saw coming.\nPride: *me llena de orgullo que* plus the subjunctive, or *estoy orgullosísima de ti*.",
  readAndPick: [
    { q: "What did the surprising?", es: "Me sorprende que no haya llamado.",
      options: ["The speaker herself", "The fact he didn't call", "Somebody else entirely"], answer: 1,
      why: "*Me sorprende que*: the fact is what surprises, so the subjunctive." },
    { q: "How surprised were they?", es: "Nos quedamos de piedra.",
      options: ["Completely stunned", "Mildly curious", "Not at all"], answer: 0,
      why: "*De piedra*, turned to stone: too stunned to move." },
    { q: "What does she find hard to believe?", es: "¡Parece mentira que ya haya pasado un año!",
      options: ["That it is a lie", "That a year was long", "That a year has gone"], answer: 2,
      why: "*Parece mentira que* is hard to believe, not a lie, and takes the subjunctive." },
    { q: "What is the father feeling?", es: "Me llena de orgullo que te gradúes con honores.",
      options: ["Envy", "Pride", "Worry"], answer: 1,
      why: "*Me llena de orgullo que* puts the cause of the pride after *que*." },
    { q: "Did anyone see it coming?", es: "¡Quién lo iba a decir! Ganó el equipo más pequeño.",
      options: ["No, nobody did", "Yes, everyone did", "Only the coach did"], answer: 0,
      why: "*¡Quién lo iba a decir!*: who would have thought it?" }
  ],
  yourTurn: [
    { en: "I'm surprised nobody has noticed.", es: "Me sorprende que nadie se haya dado cuenta.", accept: ["Me [sorprende|extraña] que nadie se haya dado cuenta."] },
    { en: "My jaw dropped when I saw the result.", es: "Me quedé con la boca abierta cuando vi el resultado.", accept: ["(Me) quedé con la boca abierta [cuando vi|al ver] el resultado."] },
    { en: "It's hard to believe it's already December!", es: "¡Parece mentira que ya sea diciembre!", accept: ["¡Parece mentira que ya [sea|estemos en] diciembre!"] },
    { en: "I'm very proud of you. (a woman speaking, to a friend)", es: "Estoy orgullosísima de ti.", accept: ["Estoy [orgullosísima|muy orgullosa] de ti."] }
  ],
  translate: [
    { en: "I was surprised that the station was so empty on a Monday morning.", es: "Me sorprendió que la estación estuviera tan vacía un lunes por la mañana.", accept: ["Me sorprendió que la estación estuviera tan vacía un lunes [por la mañana|en la mañana]."] },
    { en: "When I opened the door and saw my whole family, my jaw dropped.", es: "Cuando abrí la puerta y vi a toda mi familia, me quedé con la boca abierta.", accept: ["Cuando abrí la puerta y vi a toda mi familia, (me) quedé con la boca abierta."] },
    { en: "It's hard to believe that injustices like that still happen nowadays in such a rich country.", es: "Parece mentira que hoy en día todavía se den injusticias así en un país tan rico.", accept: ["Parece mentira que hoy en día todavía [se den|pasen|ocurran] injusticias así en un país tan rico."] },
    { en: "Who would have thought it! The girl who nearly left school is now a doctor.", es: "¡Quién lo iba a decir! La muchacha que casi deja el colegio ahora es médica.", accept: ["¡Quién lo iba a decir! La [muchacha|chica|niña] que casi [deja|dejó] el colegio ahora es médica."] },
    { en: "It fills me with pride that you took part in a project of that scale. (to a friend)", es: "Me llena de orgullo que hayas participado en un proyecto de esa magnitud.", accept: ["Me llena de orgullo que [hayas participado|participaras] en un proyecto de esa [magnitud|envergadura|dimensión]."] },
    { en: "Her capacity for work dazzles me: she runs two companies and still finds time to teach.", es: "Me deslumbra su capacidad de trabajo: dirige dos empresas y aún encuentra tiempo para enseñar.", accept: ["Me deslumbra su capacidad de trabajo: dirige dos empresas y [aún|todavía] encuentra tiempo para [enseñar|dar clases]."] }
  ],
  register: [
    { es: "¡No me digas!", en: "No way!", when: "with anyone, the instant reaction" },
    { es: "¡Quedé loca!", en: "I was blown away!", when: "in Colombia, with friends, a woman speaking" },
    { es: "¡Qué maravilla!", en: "How wonderful!", when: "warmly, with family or friends" },
    { es: "Me quedé sin palabras.", en: "I was left speechless.", when: "with anyone, when it truly moved you" },
    { es: "Es admirable lo que han logrado.", en: "What they have achieved is admirable.", when: "in a speech or a formal message" }
  ],
  personal: {
    prompt: "Write about news that genuinely surprised you this year: what surprised you, and how you reacted.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "sorprendió que", within: 5, label: "*me sorprendió que* and the subjunctive" },
      { type: "containsAny", words: ["quedé", "boca abierta", "de piedra", "sin palabras", "quién lo iba a decir", "parece mentira"], label: "how you reacted: *me quedé de piedra*, *sin palabras*" }
    ],
    model: "Me sorprendió que mi hermano consiguiera trabajo en Japón. Me quedé con la boca abierta cuando me contó."
  },
  pitfalls: [
    "*Me sorprende que no ha llamado* is the slip: you are reacting to the fact, so *haya llamado*.",
    "*Parece mentira* does not call anything a lie: it means it is hard to believe.",
    "*Flipar* and *alucinar con* are Spain's slang; in Colombia people *quedan locos* or *impresionados*."
  ]
},

"nt-atractivo-calidad-c1": {
  source: "merged",
  serves: ["nt-normalidad-c1", "nt-interes-c1"],
  hook: {
    line: "You have just come back from a weekend at a hotel in Santa Marta that looked wonderful online. The beach was out of this world, the room was nothing like the photos, and the welcome talk went on for an hour. You are writing the review, and 'good' and 'bad' will not do.",
    es: "Tiene una playa fuera de serie, pero el cuarto no se ajusta a lo que anuncian.\nEl desayuno, pasable.\nY la charla de bienvenida fue pesadísima.",
    en: "It has an outstanding beach, but the room doesn't match what they advertise.\nThe breakfast, passable.\nAnd the welcome talk was incredibly tedious."
  },
  examples: [
    { es: "La comida es de calidad dudosa y el servicio, en el mejor de los casos, pasable.", en: "The food is of questionable quality and the service is, at best, passable." },
    { es: "El guía fue un fuera de serie: hizo amena una caminata de seis horas bajo el sol.", en: "The guide was one of a kind: he made a six-hour walk in the sun enjoyable." },
    { es: "La charla del congreso fue tan amena que nadie miró el celular en dos horas.", en: "The conference talk was so engaging that nobody looked at their phone for two hours." }
  ],
  rule: "A review judges on three scales, and each has its frame.\nQuality: *de calidad* plus a word that agrees with *calidad*: *de calidad dudosa*, *de calidad superior*. Or *de buena* or *mala calidad*. *Pasable* is barely acceptable, never praise.\nNormal or not: *del montón* is run of the mill; *fuera de lo común* is unusual; *fuera de serie* goes after what it praises and never changes: *una playa fuera de serie*.\nHow it felt to sit through: *ameno* (easy, pleasant), *pesado* (tedious), *apasionante* (gripping). With *-ísimo*, drop the *muy*: *pesadísimo*.\nAgainst a promise: *no se ajusta a lo anunciado*.",
  readAndPick: [
    { q: "Is *pasable* praise?", es: "El desayuno fue pasable.",
      options: ["Yes, it was very good", "No, barely acceptable", "Yes, the best part"], answer: 1,
      why: "*Pasable* is just about acceptable. Nobody recommends a place for it." },
    { q: "How good is the guide?", es: "El guía es un fuera de serie.",
      options: ["Outstanding", "Out of order", "Off duty"], answer: 0,
      why: "*Un fuera de serie* is someone in a league of their own." },
    { q: "What is wrong with the room?", es: "El cuarto no se ajusta a lo que anuncian en la página.",
      options: ["It's much too small for two people", "It's too far away", "It's not as advertised"], answer: 2,
      why: "*No se ajusta a* says it falls short of a promise or a rule." },
    { q: "How was the talk?", es: "La charla fue amenísima.",
      options: ["Easy to enjoy", "Hard to follow", "Far too long"], answer: 0,
      why: "*Ameno* is easy and pleasant to follow, and *-ísima* already means very." },
    { q: "How special is the hotel?", es: "Es un hotel del montón.",
      options: ["One of the best", "Almost empty", "Nothing special"], answer: 2,
      why: "*Del montón*, from the pile: ordinary, like many others." },
    { q: "What does the reviewer think of the furniture?", es: "Los muebles son de calidad dudosa.",
      options: ["Clearly excellent", "Probably poor", "Brand new"], answer: 1,
      why: "*De calidad dudosa*: you doubt it, which in a review means poor." }
  ],
  yourTurn: [
    { en: "The materials are of questionable quality.", es: "Los materiales son de calidad dudosa.", accept: [] },
    { en: "She's a singer in a league of her own.", es: "Es una cantante fuera de serie.", accept: [] },
    { en: "The talk was very engaging.", es: "La charla fue muy amena.", accept: ["La charla fue [muy amena|amenísima]."] },
    { en: "The room doesn't match what they advertise.", es: "El cuarto no se ajusta a lo que anuncian.", accept: ["[El cuarto|La habitación] no se ajusta a lo que anuncian."] },
    { en: "It's a run-of-the-mill restaurant, nothing out of the ordinary.", es: "Es un restaurante del montón, nada fuera de lo común.", accept: [] }
  ],
  translate: [
    { en: "The hotel has an outstanding beach, but the rooms don't match what was advertised.", es: "El hotel tiene una playa fuera de serie, pero los cuartos no se ajustan a lo anunciado.", accept: ["El hotel tiene una playa fuera de serie, pero [los cuartos|las habitaciones] no se ajustan a [lo anunciado|lo que anuncian]."] },
    { en: "The welcome talk was so tedious that half the guests left before the end.", es: "La charla de bienvenida fue tan pesada que la mitad de los huéspedes se fue antes del final.", accept: ["La charla de bienvenida fue tan pesada que la mitad de los huéspedes se [fue|fueron] antes del final."] },
    { en: "It isn't a bad place, but it's run of the mill. For that price I expected something out of the ordinary.", es: "No es un mal sitio, pero es del montón. Por ese precio esperaba algo fuera de lo común.", accept: ["No es un mal [sitio|lugar], pero es del montón. Por ese precio esperaba algo fuera de lo común."] },
    { en: "The play started off tedious, but the second act was gripping from start to finish.", es: "La obra de teatro empezó pesada, pero el segundo acto fue apasionante de principio a fin.", accept: ["La obra (de teatro) [empezó|arrancó] pesada, pero el segundo acto fue apasionante de principio a fin."] },
    { en: "My piano teacher was one of a kind, and her classes were never tedious.", es: "Mi profesora de piano era una fuera de serie y sus clases nunca eran pesadas.", accept: ["Mi profesora de piano era una fuera de serie y sus clases nunca [eran|fueron] pesadas."] },
    { en: "The company guarantees the quality of its products, but the chair I received fell apart in a week.", es: "La empresa garantiza la calidad de sus productos, pero la silla que recibí se desarmó en una semana.", accept: ["La empresa garantiza la calidad de sus productos, pero la silla que recibí se [desarmó|dañó|rompió] en una semana."] }
  ],
  register: [
    { es: "¡Qué hotel tan bacano!", en: "What a great hotel!", when: "in Colombia, with friends, very casual" },
    { es: "Es un sitio fuera de serie.", en: "It's a place in a league of its own.", when: "anywhere, strong praise you mean" },
    { es: "Lo recomiendo sin dudarlo.", en: "I recommend it without hesitation.", when: "in a written review for strangers" },
    { es: "La calidad del servicio es excepcional.", en: "The quality of the service is exceptional.", when: "in a formal evaluation or a letter to the manager" }
  ],
  personal: {
    prompt: "Write a three-line review of a place, a show or a course you know: one line on quality, one on how ordinary or special it is, one on how it felt to sit through.",
    constraints: [
      { type: "containsAny", words: ["calidad", "pasable"], label: "quality: *de calidad dudosa*, *de buena calidad*, *pasable*" },
      { type: "containsAny", words: ["fuera de serie", "fuera de lo común", "del montón"], label: "special or ordinary: *fuera de serie*, *del montón*" },
      { type: "containsAny", words: ["ameno", "amena", "pesado", "pesada", "apasionante", "amenísim", "pesadísim"], label: "how it felt: *ameno*, *pesado*, *apasionante*" }
    ],
    model: "El curso de cocina es de muy buena calidad. La profesora es una fuera de serie. Las clases son amenísimas, aunque la parte de teoría es un poco pesada."
  },
  pitfalls: [
    "*Muy amenísima* says very twice: *amenísima* or *muy amena*.",
    "*Pasable* sounds polite in English and faint in Spanish: it says barely acceptable.",
    "In Colombia *ordinario* means crude or tacky, not ordinary: for ordinary, *del montón* or *común*."
  ]
},

"fn-estado-general-cosas-c1": {
  source: "merged",
  hook: {
    line: "You call an old friend in Cali you have not spoken to in months. You know her father was in hospital and that she was waiting to hear about a job. This conversation has a shape in Spanish: you ask, she places her answer on a scale, and she hands the question back.",
    es: "¿Cómo sigue tu papá?\nYa pasó lo peor, gracias a Dios.\n¿Y lo tuyo del trabajo, qué tal?",
    en: "How's your dad doing?\nThe worst is over, thank God.\nAnd how's your work thing going?"
  },
  examples: [
    { es: "¿Cómo te fue en la entrevista de ayer? Cuéntame todo, que estuve pensando en ti.", en: "How did yesterday's interview go? Tell me everything, I was thinking about you." },
    { es: "Ahí vamos, no ha sido un mes fácil con lo de mi papá en el hospital.", en: "Getting by, it hasn't been an easy month with all the business of my dad being in hospital." },
    { es: "Bien, gracias a Dios. Los niños ya entraron al colegio y yo por fin conseguí trabajo.", en: "Fine, thank God. The kids have started school and I finally found a job." }
  ],
  rule: "Asking how things are has three moves, and the last one matters most.\nAsk about someone else with *¿Cómo sigue...?* if they were ill, or about an event with *¿Cómo te fue en...?*\nAnswer on a scale: *Todo bien, gracias a Dios*, *Sin novedad*, *Ahí vamos*, *Qué te digo, ha sido un mes complicado*. The last one tells without telling.\nFor things improving: *Ya pasó lo peor*, *Parece que ya pasó la mala racha*.\nThen hand it back, naming their news with *lo de* or *lo tuyo*: *¿Y lo tuyo del trabajo, qué tal?* *¿Y lo de tu mamá?*\n*Gracias a Dios* is relief, whatever your faith.",
  readAndPick: [
    { q: "Who is she asking about?", es: "¿Cómo sigue tu abuela?",
      options: ["The friend herself", "A grandmother who was ill", "A grandmother living abroad"], answer: 1,
      why: "*¿Cómo sigue?* asks about someone who has been ill: how is she now?" },
    { q: "How are things for him?", es: "Qué te digo, ha sido un mes complicado.",
      options: ["Not great, without details", "Wonderful, as ever", "Exactly as before"], answer: 0,
      why: "*Qué te digo* hints that things are not good, without saying more yet." },
    { q: "What is she asking about?", es: "¿Y lo del apartamento, en qué quedó?",
      options: ["Where his flat is", "How big the flat is", "How the flat story ended"], answer: 2,
      why: "*Lo de* is the business you both know about; *¿en qué quedó?* is how it ended." },
    { q: "Is she religious?", es: "Mucho mejor, gracias a Dios.",
      options: ["We can't tell", "Yes, very", "No, not at all"], answer: 0,
      why: "*Gracias a Dios* marks relief, whatever the speaker believes." },
    { q: "What is he doing with the last part?", es: "Bien, sin novedad. ¿Y tú qué más?",
      options: ["Ending the call", "Changing the subject", "Handing it back"], answer: 2,
      why: "After answering, you return the question: *¿Y tú qué más?*" }
  ],
  yourTurn: [
    { en: "How's your dad doing? (after an illness)", es: "¿Cómo sigue tu papá?", accept: ["¿Cómo sigue tu [papá|padre]?", "¿Cómo va tu [papá|padre]?"] },
    { en: "How did the interview go? (to a friend)", es: "¿Cómo te fue en la entrevista?", accept: ["¿[Cómo|Qué tal] te fue en la entrevista?"] },
    { en: "The worst is over, thank God.", es: "Ya pasó lo peor, gracias a Dios.", accept: ["Ya pasó lo peor, gracias a Dios.", "Gracias a Dios, ya pasó lo peor."] },
    { en: "And how's your work thing going? (to a friend)", es: "¿Y lo tuyo del trabajo, qué tal?", accept: ["¿Y lo [tuyo del|del] trabajo, qué tal?", "¿Y lo tuyo del trabajo, cómo va?"] }
  ],
  translate: [
    { en: "How is your mum doing after the operation? I hope she's feeling better now. (to a friend)", es: "¿Cómo sigue tu mamá después de la operación? Espero que ya se sienta mejor.", accept: ["¿Cómo sigue tu [mamá|madre] después de la [operación|cirugía]? [Espero que|Ojalá] (ya) se sienta mejor."] },
    { en: "Well, not great, but we're getting by. And how about you, how are things?", es: "Bueno, no muy bien, pero ahí vamos. ¿Y lo tuyo, qué tal?", accept: ["Bueno, no muy bien, pero ahí vamos. ¿Y lo tuyo, [qué tal|cómo va]?"] },
    { en: "Much better, thank God: the worst is over and he's going home on Friday.", es: "Mucho mejor, gracias a Dios: ya pasó lo peor y el viernes se va para la casa.", accept: ["Mucho mejor, gracias a Dios: ya pasó lo peor y el viernes se va [para la casa|a la casa|para su casa|a casa]."] },
    { en: "Well, what can I say, it's been a complicated month, but it seems the bad patch is over.", es: "Bueno, qué te digo, ha sido un mes complicado, pero parece que ya pasó la mala racha.", accept: ["Bueno, qué te digo, [ha sido|fue] un mes complicado, pero parece que ya pasó la mala racha."] },
    { en: "Nothing new around here. And what happened with the apartment you wanted to buy?", es: "Por aquí, sin novedad. ¿Y lo del apartamento que querías comprar, en qué quedó?", accept: ["Por [aquí|acá], sin novedad. ¿Y lo del apartamento que querías comprar, en qué quedó?", "Por [aquí|acá], sin novedad. ¿Y qué pasó con el apartamento que querías comprar?"] },
    { en: "I'm calling to ask how your family is; I heard about your brother and I was worried. (to a friend)", es: "Te llamo para preguntarte cómo está tu familia; supe lo de tu hermano y me quedé preocupada.", accept: ["Te llamo para preguntarte cómo está tu familia; [supe|me enteré de] lo de tu hermano y me quedé [preocupada|preocupado]."] }
  ],
  register: [
    { es: "Ahí vamos.", en: "Getting by.", when: "with anyone you know, honest and light" },
    { es: "Ahí, en la lucha.", en: "Hanging in there.", when: "in Colombia, with friends or neighbours" },
    { es: "Qué te digo, no ha sido fácil.", en: "What can I say, it hasn't been easy.", when: "to a friend who will ask you more" },
    { es: "Bien, gracias, sin novedad.", en: "Fine, thanks, nothing new.", when: "to a colleague or a neighbour, polite and brief" },
    { es: "Bien, gracias. ¿Y usted cómo ha estado?", en: "Fine, thank you. And how have you been?", when: "to an older person, or anyone you call usted" }
  ],
  personal: {
    prompt: "Write the start of a call to a friend you have not spoken to for months: ask about something you know is going on in their life, answer for yourself on the scale, and hand the question back.",
    constraints: [
      { type: "containsAny", words: ["cómo sigue", "cómo te fue", "cómo va", "qué tal"], label: "ask about their news: *¿Cómo sigue...?* or *¿Cómo te fue en...?*" },
      { type: "regex", pattern: "\\blo (de|del|tuyo|suyo)\\b", label: "name it with *lo de* or *lo tuyo*" },
      { type: "question", label: "hand it back, as a question" }
    ],
    model: "¡Hola, Caro! ¿Cómo sigue tu papá? Por aquí, ahí vamos, ha sido un mes complicado. ¿Y lo tuyo del trabajo, en qué quedó?"
  },
  pitfalls: [
    "*¿Cómo sigue?* is only for someone who has been ill or in trouble: for a healthy friend, *¿cómo está?*",
    "*¿Y el tuyo del trabajo?* is the slip: the business is *lo tuyo*, never *el tuyo*.",
    "Answering without handing it back sounds cold: the question is half the ritual."
  ]
},

"task-c1-ironia": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a conversation between two people who know each other well, in which at least six lines mean the opposite of what they say. The model is two sisters in Cali, the day their brother cancels Christmas, again.",
    es: "Llamó Felipe. Dice que no viene.\n¡Qué sorpresa!\nTres meses diciendo que venía. Qué detalle de su parte.",
    en: "Felipe called. He says he's not coming.\nWhat a surprise!\nThree months saying he was coming. How thoughtful of him."
  },
  examples: [
    { es: "Qué detalle de su parte avisarnos con tanta anticipación: nos escribió anoche a las once.", en: "How thoughtful of him to give us so much notice: he wrote to us last night at eleven." },
    { es: "Ay, sí, qué belleza: tres meses diciendo que venía y cancela el día antes.", en: "Oh yes, lovely: three months saying he was coming and he cancels the day before." }
  ],
  rule: "Irony that is not marked is just a lie, so every ironic line needs a signal the listener can catch.\nPraise too big for the facts: *¡Qué detalle!* for a slight, *puntualísimo* for someone late.\nThe line that trails off: *Ya, ya...* *Sí, como siempre cumple...*\nA cheerful frame around bad news: *¡Qué belleza!* *Ay, sí, divino.*\nA *¿no?* on something nobody could agree with: *Muy considerado, ¿no?*\nThen let the other person show it landed: a laugh, *Muy chistosa*, or irony back.\nBoth speakers should use it, and at least once, someone should answer it.",
  readAndPick: [
    { q: "Is she really surprised?", es: "¿Felipe no viene? ¡Qué sorpresa!",
      options: ["Yes, she is shocked", "No, she expected it", "Yes, and pleased"], answer: 1,
      why: "*¡Qué sorpresa!* about something that always happens is irony." },
    { q: "What does she think of how he told them?", es: "Qué detalle de su parte avisarnos con tanta anticipación.",
      options: ["It was very late notice", "It was thoughtful", "It was early enough"], answer: 0,
      why: "Praise too big for the facts: he told them at the last minute." },
    { q: "What does *¡Qué belleza!* mean here?", es: "Se fue la luz en plena novena. ¡Qué belleza!",
      options: ["How pretty the lights are", "How lovely the novena is", "How annoying this is"], answer: 2,
      why: "A cheerful frame around bad news: in Colombia *¡qué belleza!* is often ironic." },
    { q: "Does she expect her brother to agree?", es: "Muy considerado, ¿no?",
      options: ["Yes, she expects a yes", "No, nobody could agree", "She wants his real view"], answer: 1,
      why: "A *¿no?* on something nobody could agree with marks the irony." },
    { q: "What does the second line show?", es: "¿Le guardo un puesto por si acaso?\nMuy chistosa.",
      options: ["She took it seriously", "She set another place", "The joke landed"], answer: 2,
      why: "*Muy chistosa* answers the irony: it was caught." }
  ],
  yourTurn: [
    { en: "What a surprise!", es: "¡Qué sorpresa!", accept: [] },
    { en: "How thoughtful of him to let us know so far in advance.", es: "Qué detalle de su parte avisarnos con tanta anticipación.", accept: ["(Qué) detalle de su parte avisarnos con tanta [anticipación|antelación]."] },
    { en: "Very considerate, don't you think?", es: "Muy considerado, ¿no crees?", accept: ["Muy considerado, ¿no [crees|te parece]?", "Muy considerado, ¿no?"] },
    { en: "Very funny. (to a woman)", es: "Muy chistosa.", accept: ["Muy [chistosa|graciosa]."] }
  ],
  translate: [
    { en: "Felipe swore that this time he really was coming for Christmas, and today he wrote to say he can't.", es: "Felipe juró que esta vez sí venía para Navidad, y hoy nos escribió que no puede.", accept: ["Felipe juró que esta vez sí venía [para|en] Navidad, y hoy nos escribió que no [puede|podía]."] },
    { en: "Oh yes, lovely: the power went out in the middle of the novena and the food went cold.", es: "Ay, sí, qué belleza: se fue la luz en plena novena y la comida se enfrió.", accept: ["Ay, sí, qué belleza: se fue la luz en [plena novena|la mitad de la novena|medio de la novena] y la comida se enfrió."] },
    { en: "Shall I keep him a place at the table, just in case he changes his mind?", es: "¿Le guardo un puesto en la mesa, por si acaso cambia de opinión?", accept: ["¿Le guardo un puesto en la mesa, por si (acaso) cambia de [opinión|idea]?"] },
    { en: "Of course, he was terribly busy. He only had three months to buy a plane ticket.", es: "Claro, estaba ocupadísimo. Solo tuvo tres meses para comprar un tiquete de avión.", accept: ["Claro, estaba ocupadísimo. Solo tuvo tres meses para comprar un [tiquete|pasaje|boleto] (de avión)."] },
    { en: "He never answers the phone, but I'm sure this year will be different, don't you think?", es: "Nunca contesta el teléfono, pero seguro que este año va a ser diferente, ¿no crees?", accept: ["Nunca contesta el [teléfono|celular], pero seguro que este año va a ser [diferente|distinto], ¿no [crees|te parece]?"] },
    { en: "When I told her they had cancelled the party, she said: what a shame, and I was so looking forward to it.", es: "Cuando le dije que habían cancelado la fiesta, me dijo: qué lástima, con las ganas que tenía.", accept: ["Cuando le dije que [habían cancelado la fiesta|la fiesta se había cancelado|se había cancelado la fiesta], me dijo: qué lástima, con las ganas que tenía."] }
  ],
  register: [
    { es: "Muy chistoso.", en: "Very funny.", when: "with friends, dry, back at them" },
    { es: "Ja, ja, qué gracioso.", en: "Ha ha, how funny.", when: "teasing, when the joke was on you" },
    { es: "Ya entendí el chiste.", en: "I got the joke.", when: "when you want to show it landed, plainly" },
    { es: "Lo dices con ironía, ¿verdad?", en: "You're being ironic, aren't you?", when: "when you're not sure, to check politely" }
  ],
  personal: {
    prompt: "Write the first six turns of your own conversation between two people who know each other well. Put each turn on its own line, and make at least two of them ironic.",
    constraints: [
      { type: "minSentences", n: 6, label: "six turns or more" },
      { type: "containsAny", words: ["qué sorpresa", "qué detalle", "qué belleza", "ísimo", "ísima", "¿no?", "ya, ya", "como siempre", "divino", "muy chistos"], label: "a signal of irony the reader can catch" }
    ],
    model: "Llamó Felipe. Dice que no viene.\n¡Qué sorpresa!\nYa, ya.\nTres meses diciendo que venía. Qué detalle de su parte.\nMuy considerado, ¿no?\n¿Le guardo un puesto por si acaso?\nMuy chistosa."
  },
  pitfalls: [
    "Irony that carries no signal reads as a lie: give every ironic line one mark.",
    "In Colombia *¡qué pena!* means sorry or how embarrassing, not what a shame: for that, *¡qué lástima!*",
    "*Pues sí que estamos bien* is Spain's irony; here, *¡Ay, sí, qué belleza!*"
  ]
},

/* ---- unit c1-u57 · Saying it without owning it ---------------------------- */

"dc-citas-encubiertas-c1": {
  source: "merged",
  hook: {
    line: "The office WhatsApp group is buzzing: a new manager starts on Monday. Nobody has met her, and everybody knows something about her. Spanish lets you pass on what you heard without signing your name under it, and one way it does that is a past form about the future.",
    es: "La nueva gerente llegaba el lunes, ¿no?\nAsí dicen. Por lo visto venía de una empresa en Medellín.\nSerá muy preparada, pero ya nos mandó tres correos.",
    en: "The new manager was starting on Monday, wasn't she?\nSo they say. Apparently she was coming from a company in Medellín.\nShe may well be highly qualified, but she's already sent us three emails."
  },
  examples: [
    { es: "Según me dicen, la gerente nueva llegaba el lunes y traía a su propio equipo de Medellín.", en: "From what I'm told, the new manager was starting on Monday and bringing her own team from Medellín." },
    { es: "Por lo visto, la reunión con los clientes se aplazó otra vez, aunque nadie nos avisó oficialmente.", en: "Apparently the meeting with the clients was postponed again, though nobody told us officially." },
    { es: "Será muy buena con los números, pero en dos semanas no ha aprendido el nombre de nadie.", en: "She may well be good with numbers, but in two weeks she hasn't learned anyone's name." }
  ],
  rule: "Three ways to pass something on without vouching for it.\nA past form about the future: *La gerente llegaba el lunes.* The *-aba* form next to *el lunes* says: I was told this, and I don't guarantee it. *Llegará el lunes* would be your own claim.\nA tag that names no source: *por lo visto*, *al parecer*, *según me dicen*, and *supuestamente*, which raises an eyebrow. The press lives on *al parecer*.\nThe future that grants a point before a *pero*: *Será muy preparada, pero...* is not about tomorrow. It means: she may well be, and so what.\nFor your own plans the *-aba* form sounds evasive. Keep it for other people's news.",
  readAndPick: [
    { q: "When is the manager starting?", es: "La gerente llegaba el lunes, según me dicen.",
      options: ["She already started last Monday", "Next Monday, from what I hear", "Monday, and I can promise it"], answer: 1,
      why: "*Llegaba* next to *el lunes* is about the future, passed on and not promised." },
    { q: "Is the speaker sure the meeting moved?", es: "Por lo visto, la reunión se aplazó.",
      options: ["No, she heard it somewhere", "Yes, she changed it herself", "Yes, she read the memo"], answer: 0,
      why: "*Por lo visto* passes on what she heard without vouching for it." },
    { q: "What does *será* do here?", es: "Será muy preparada, pero no conoce a los clientes.",
      options: ["Predicts what she'll become", "Asks whether it's true", "Grants it, then objects"], answer: 2,
      why: "This future grants the point; the *pero* that follows is the real message." },
    { q: "How does the writer feel about the claim?", es: "Supuestamente, el nuevo sistema nos va a ahorrar tiempo.",
      options: ["Fully convinced of it", "A little doubtful", "Openly furious"], answer: 1,
      why: "*Supuestamente* passes the claim on with a raised eyebrow." },
    { q: "Where does the newspaper stand?", es: "Al parecer, no se informó a los vecinos antes de la obra.",
      options: ["It confirms the fact as true", "It names the source openly", "It reports it, unconfirmed"], answer: 2,
      why: "*Al parecer* is the press tag for a claim nobody has confirmed yet." }
  ],
  yourTurn: [
    { en: "The manager was starting on Monday, wasn't she?", es: "La gerente llegaba el lunes, ¿no?", accept: ["La gerente llegaba el lunes, ¿[no|cierto|verdad]?", "La gerente empezaba el lunes, ¿[no|cierto|verdad]?"] },
    { en: "Apparently, the meeting was postponed again.", es: "Por lo visto, la reunión se aplazó otra vez.", accept: ["[Por lo visto|Al parecer], la reunión se aplazó otra vez.", "[Por lo visto|Al parecer], la reunión se volvió a aplazar."] },
    { en: "She may well be very bright, but she doesn't know the clients.", es: "Será muy inteligente, pero no conoce a los clientes.", accept: [] },
    { en: "Supposedly, the new system will save us time.", es: "Supuestamente, el nuevo sistema nos va a ahorrar tiempo.", accept: ["Supuestamente, el [nuevo sistema|sistema nuevo] nos va a ahorrar tiempo.", "Supuestamente, el [nuevo sistema|sistema nuevo] nos ahorrará tiempo."] }
  ],
  translate: [
    { en: "From what I'm told, the new manager was bringing her own team from Medellín.", es: "Según me dicen, la nueva gerente traía a su propio equipo de Medellín.", accept: ["Según me dicen, la [nueva gerente|gerente nueva] traía (a) su propio equipo de Medellín."] },
    { en: "Apparently the residents were not told before the building works began. (news report)", es: "Al parecer, no se informó a los vecinos antes del inicio de las obras.", accept: ["Al parecer, no se [informó|avisó] a los vecinos antes [del inicio de las obras|de que empezaran las obras]."] },
    { en: "She may well be highly qualified, but she has never run a team. We'll see how she gets on with ours.", es: "Será muy preparada, pero nunca ha dirigido un equipo. Ya veremos cómo le va con el nuestro.", accept: ["Será muy preparada, pero nunca ha [dirigido|manejado] un equipo. Ya veremos cómo le va con el nuestro."] },
    { en: "The concert was on Saturday, wasn't it? That's what Camila told me, at least.", es: "El concierto era el sábado, ¿no? Eso fue lo que me dijo Camila, por lo menos.", accept: ["El concierto era el sábado, ¿[no|cierto|verdad]? Eso [fue lo que|es lo que] me dijo Camila, [por lo menos|al menos]."] },
    { en: "Supposedly they were finishing the bridge in March, but nobody believes it any more.", es: "Supuestamente terminaban el puente en marzo, pero ya nadie se lo cree.", accept: ["Supuestamente [terminaban el puente|el puente lo terminaban] en marzo, pero ya nadie (se) lo cree.", "Supuestamente [iban a terminar el puente|el puente lo iban a terminar] en marzo, pero ya nadie (se) lo cree."] },
    { en: "Apparently the company was closing its Cali office. I don't know if it's true, but that's what they're saying.", es: "Por lo visto, la empresa cerraba la oficina de Cali. No sé si es cierto, pero eso es lo que dicen.", accept: ["[Por lo visto|Al parecer], la empresa cerraba la oficina de Cali. No sé si es [cierto|verdad], pero eso es lo que dicen."] }
  ],
  register: [
    { es: "Dizque viene el lunes.", en: "Supposedly she's coming on Monday.", when: "in Colombia, with friends, when you doubt it" },
    { es: "Por lo visto, viene el lunes.", en: "Apparently she's coming on Monday.", when: "anywhere, passing on news you heard" },
    { es: "Según me dicen, viene el lunes.", en: "I'm told she's coming on Monday.", when: "at work, when your source should stay vague" },
    { es: "Al parecer, la gerente asumirá el cargo el lunes.", en: "It appears the manager will take up the post on Monday.", when: "in a news report or a formal email" }
  ],
  personal: {
    prompt: "Pass on a piece of news about someone at work or in your building without vouching for it, then grant them one point before your *pero*.",
    constraints: [
      { type: "containsAny", words: ["por lo visto", "al parecer", "según me dicen", "según dicen", "supuestamente", "dizque"], label: "a tag that passes it on: *por lo visto*, *al parecer*, *dizque*" },
      { type: "regex", pattern: "(será|serán|tendrá|tendrán|sabrá|sabrán)\\s[^.!?]*,\\s*pero\\b", label: "the future that grants a point: *será..., pero*" }
    ],
    model: "Por lo visto, el vecino del cuarto piso se iba para Canadá el mes entrante. Será muy buena gente, pero nunca saluda en el ascensor."
  },
  pitfalls: [
    "*La gerente llegaba el lunes* is about next Monday: the *-aba* form passes the news on, it does not move it into the past.",
    "About your own plans the *-aba* form sounds like hiding something: *Yo llegaba el lunes* invites *¿llegas o no?*",
    "*Será muy preparada* is not a forecast: a *pero* is almost always on its way."
  ]
},

"dc-atenuacion-c1": {
  source: "old",
  hook: {
    line: "Julián's report is full of mistakes and the client sees it tomorrow. You need it fixed tonight, and you need Julián still speaking to you next week. Spanish lets the criticism stay while the pointing finger disappears.",
    es: "Tienes que corregir el informe.\n¿Y si revisamos juntos el informe antes de mandarlo?\nHabría que revisar las cifras de la segunda parte.",
    en: "You have to correct the report.\nWhat if we go over the report together before we send it?\nThe figures in the second part ought to be checked."
  },
  examples: [
    { es: "¿Y si dejamos la presentación para el jueves y así revisamos las cifras con calma?", en: "What if we leave the presentation until Thursday, so we can check the figures calmly?" },
    { es: "Habría que revisar los datos de ventas antes de mandarle el informe al cliente.", en: "Someone ought to check the sales data before the report goes to the client." },
    { es: "Uno trabaja todo el fin de semana y al final nadie se toma el trabajo de leerlo.", en: "You work all weekend and in the end nobody even bothers to read it." }
  ],
  rule: "A criticism names someone. Soften it by moving the person.\nFrom *you* to *we*: *¿Y si lo revisamos?* means revise it, but nobody was told to. Teachers and doctors live here: *Vamos a ver qué hicimos aquí.*\nFrom someone to nobody: *Habría que revisarlo*, *Convendría esperar*, *Se ruega no fumar*. The conditional alone is not enough: *Podrías revisarlo* still points at you. Losing the person is what softens.\nFrom *I* to *uno*: *Uno trabaja todo el fin de semana y...* turns your complaint into everyone's.\nIn writing, object with *Cabría preguntarse si...*\nOverdo it and you sound evasive: sometimes *you* is fair.",
  readAndPick: [
    { q: "A boss says this to the person who made the slides. Who redoes them?", es: "¿Y si rehacemos las diapositivas antes de la reunión?",
      options: ["The two of them, side by side", "The listener, in practice", "Nobody, it's cancelled"], answer: 1,
      why: "*¿Y si...?* with *we* names no one, but the job is the listener's." },
    { q: "Who is being told to check it?", es: "Habría que revisarlo antes del lunes.",
      options: ["Nobody in particular", "Only the speaker himself", "The client"], answer: 0,
      why: "*Habría que* has no person at all: the job stays, the finger goes." },
    { q: "Whose complaint is this really?", es: "Uno se esfuerza y nadie lo nota.",
      options: ["Everyone's in general", "The speaker's own", "The boss's"], answer: 1,
      why: "*Uno* dresses a personal complaint as a general truth." },
    { q: "Why might this adult patient be annoyed?", es: "¿Cómo estamos hoy? ¿Ya nos tomamos la pastilla?",
      options: ["It sounds patronising", "It's far too formal for her", "It's openly rude"], answer: 0,
      why: "From a stranger, the caring *we* to an adult often grates." },
    { q: "What is the writer doing?", es: "Cabría preguntarse si el plazo era realista desde el principio.",
      options: ["Asking a real question", "Praising the plan", "Raising an objection"], answer: 2,
      why: "*Cabría preguntarse si* is how a written argument objects without saying *I*." }
  ],
  yourTurn: [
    { en: "What if we leave it until tomorrow?", es: "¿Y si lo dejamos para mañana?", accept: [] },
    { en: "Someone ought to check the figures.", es: "Habría que revisar las cifras.", accept: ["Habría que revisar [las cifras|los números|los datos]."] },
    { en: "Let's see what we did here.", es: "Vamos a ver qué hicimos aquí.", accept: ["Vamos a ver qué [hicimos|hemos hecho] [aquí|acá]."] },
    { en: "It might be advisable to wait a few days.", es: "Convendría esperar unos días.", accept: ["[Quizás convendría|Quizá convendría|Tal vez convendría|Convendría] esperar unos días."] }
  ],
  translate: [
    { en: "What if we go over the report together before we send it to the client tomorrow?", es: "¿Y si revisamos juntos el informe antes de mandárselo mañana al cliente?", accept: ["¿Y si revisamos [juntos el informe|el informe juntos] antes de [mandárselo|enviárselo] mañana al cliente?", "¿Y si revisamos [juntos el informe|el informe juntos] antes de [mandárselo|enviárselo] al cliente mañana?"] },
    { en: "The sales figures ought to be checked before anyone presents them to the board.", es: "Habría que revisar las cifras de ventas antes de que alguien las presente a la junta.", accept: ["Habría que revisar las cifras de ventas antes de que alguien las presente [a|ante] la junta."] },
    { en: "You work all weekend on a project. Then, on Monday, nobody even bothers to open it.", es: "Uno trabaja todo el fin de semana en un proyecto. Después, el lunes, nadie se toma el trabajo de abrirlo.", accept: ["Uno trabaja todo el fin de semana en un proyecto. [Después|Luego], el lunes, nadie se toma [el trabajo|la molestia] de abrirlo."] },
    { en: "It might be advisable to rethink the project's approach before investing more resources in it. (in a meeting)", es: "Quizás convendría replantear el enfoque del proyecto antes de invertir más recursos en él.", accept: ["[Quizás|Quizá|Tal vez] convendría replantear el enfoque del proyecto antes de invertir más recursos (en él)."] },
    { en: "Please refrain from smoking anywhere in the building, including the balconies and the car park. (a sign)", es: "Se ruega no fumar en ninguna parte del edificio, incluidos los balcones y el parqueadero.", accept: ["[Se ruega|Favor] no fumar en ninguna parte del edificio, [incluidos|incluyendo] los balcones y el parqueadero."] },
    { en: "One might ask whether the deadline set in January was realistic from the start. (written report)", es: "Cabría preguntarse si el plazo que se fijó en enero era realista desde el principio.", accept: ["Cabría preguntarse si el plazo [que se fijó|fijado] en enero era realista desde el [principio|comienzo]."] }
  ],
  register: [
    { es: "Tienes que rehacerlo.", en: "You have to redo it.", when: "when you mean it and the person can take it" },
    { es: "¿Y si lo rehacemos?", en: "What if we redo it?", when: "with a colleague, to share the job" },
    { es: "Habría que rehacerlo.", en: "It ought to be redone.", when: "in a meeting, when nobody should feel accused" },
    { es: "Favor no fumar.", en: "Please do not smoke.", when: "on a sign in Colombia" },
    { es: "Cabría preguntarse si conviene rehacerlo.", en: "One might ask whether it should be redone.", when: "in a written report, to object" }
  ],
  personal: {
    prompt: "A flatmate keeps leaving the kitchen in a mess. Write two lines that get it fixed without accusing anyone.",
    constraints: [
      { type: "regex", pattern: "(¿\\s*y si\\b|habría que|convendría|cabría|vamos a ver)", label: "move the person: *¿Y si...?*, *habría que*, *convendría*" },
      { type: "avoidsAny", words: ["tienes que", "deberías", "tú siempre"], label: "no finger: no *tienes que*, no *deberías*" }
    ],
    model: "La cocina quedó otra vez llena de platos. ¿Y si hacemos un horario para lavarlos? Habría que dejarla limpia antes de acostarse."
  },
  pitfalls: [
    "*Podrías revisarlo* is softer, but it still names you: *habría que revisarlo* names nobody.",
    "The caring *we* from a stranger grates: *¿Cómo estamos hoy?* to an adult patient sounds like a nursery.",
    "*Merece la pena* is Spain's: in Colombia and most of Latin America, *vale la pena*."
  ]
},

"dc-atenuacion-dialogica-c1": {
  source: "merged",
  hook: {
    line: "In the Monday meeting the director says the project is on schedule. You know it is two weeks behind. Disagreeing with your boss in Spanish starts with a small ceremony, and skipping it sounds like a challenge rather than a fact.",
    es: "Con todo respeto, doctor Ruiz, puede que me equivoque.\nPero, según mis cuentas, vamos dos semanas atrasados.",
    en: "With all due respect, Dr Ruiz, I may be wrong.\nBut by my count, we're two weeks behind."
  },
  examples: [
    { es: "Puede que me equivoque, pero las cifras de marzo no coinciden con las del informe anterior.", en: "I may be wrong, but the March figures don't match the ones in the previous report." },
    { es: "Sí, bueno, no es eso exactamente; es que sin los permisos no podemos empezar la obra.", en: "Yes, well, that's not exactly it; the thing is, without the permits we can't start the work." },
    { es: "Bueno, no creas: la carretera a Villa de Leyva está bastante bien desde que la arreglaron.", en: "Well, not really: the road to Villa de Leyva has been pretty good since they fixed it." }
  ],
  rule: "Disagreement in Spanish comes with a preface, and the preface keeps the conversation open.\nGrant part of it, then turn: *Sí, bueno, pero...* *Ya, pero...* *No es eso exactamente, es que...*\nPut the doubt in yourself: *Puede que me equivoque, pero...* *Puede que tengas razón, pero...* After *puede que*, the subjunctive.\nShrink their claim instead of denying it: *Bueno, no creas.* *Tampoco tanto.*\nWith your boss or in a formal setting, announce it: *Con todo respeto...* *Si me permite una observación...* These are stronger than they look: everyone knows a no is coming.\nA bare *No estoy de acuerdo* is correct, and it sounds like a challenge.",
  readAndPick: [
    { q: "Is she agreeing?", es: "Sí, bueno, pero eso no resuelve lo de los permisos.",
      options: ["Yes, completely", "No, and she's furious", "Only on the surface"], answer: 2,
      why: "*Sí, bueno, pero* grants a little only to turn." },
    { q: "What does *no creas* do here?", es: "¿La carretera es mala? Bueno, no creas, está bastante bien.",
      options: ["Calls him a liar", "Asks him for proof", "Softens his claim"], answer: 2,
      why: "*No creas* shrinks the other person's claim instead of contradicting it." },
    { q: "What usually comes after this opening?", es: "Con todo respeto, doctor Ruiz...",
      options: ["A disagreement", "A compliment on his work", "A thank you"], answer: 0,
      why: "*Con todo respeto* announces that a disagreement is on its way." },
    { q: "Where does he put the doubt?", es: "Puede que me equivoque, pero esas cifras no cuadran.",
      options: ["In the figures on the table", "In himself, for politeness", "In his boss's memory"], answer: 1,
      why: "*Puede que me equivoque* places the doubt in the speaker: a polite fiction." },
    { q: "How expensive is it, in her view?", es: "¿Carísimo? Tampoco tanto.",
      options: ["Even dearer than that", "Not that expensive", "Almost free of charge"], answer: 1,
      why: "*Tampoco tanto* grants the direction and denies the size: not that much." }
  ],
  yourTurn: [
    { en: "I may be wrong, but the figures don't add up.", es: "Puede que me equivoque, pero las cifras no cuadran.", accept: ["Puede que me equivoque, pero [las cifras|los números] no cuadran."] },
    { en: "That's not exactly it; the thing is, I need it for tomorrow.", es: "No es eso exactamente, es que lo necesito para mañana.", accept: ["No es [eso exactamente|exactamente eso], es que lo necesito para mañana."] },
    { en: "Well, not really, it's pretty good.", es: "Bueno, no creas, está bastante bien.", accept: [] },
    { en: "With all due respect, I think there's a mistake. (formal)", es: "Con todo respeto, creo que hay un error.", accept: ["Con todo (el) respeto, creo que hay un error."] }
  ],
  translate: [
    { en: "I may be wrong, but that figure doesn't match the one in last month's report.", es: "Puede que me equivoque, pero esa cifra no coincide con la del informe del mes pasado.", accept: ["Puede que me equivoque, pero esa cifra no [coincide|cuadra] con la del informe del mes pasado."] },
    { en: "You may be right, but we would need twice the time and twice the people.", es: "Puede que tengas razón, pero necesitaríamos el doble de tiempo y el doble de gente.", accept: ["Puede que tengas razón, pero necesitaríamos el doble de tiempo y el doble de [gente|personas]."] },
    { en: "Yes, well, the hotel is lovely. The thing is, it's two hours from the beach and we don't have a car.", es: "Sí, bueno, el hotel es muy lindo. Lo que pasa es que queda a dos horas de la playa y no tenemos carro.", accept: ["Sí, bueno, el hotel es muy [lindo|bonito]. [Lo que pasa es que|Es que] queda a dos horas de la playa y no tenemos carro."] },
    { en: "If I may make an observation, the calculation on page four isn't correct. (formal)", es: "Si me permite una observación, el cálculo de la página cuatro no es correcto.", accept: ["Si me permite (hacer) una observación, el cálculo de la página cuatro no [es correcto|está bien]."] },
    { en: "No, I'm not saying it's bad, but I wouldn't do it like that. (a little hurt)", es: "No, si yo no digo que esté mal, pero yo no lo haría así.", accept: ["No, si yo no digo que [esté mal|sea malo], pero yo no lo haría así."] },
    { en: "With all due respect, Dr Ruiz, the client hasn't approved the second phase yet. (formal)", es: "Con todo respeto, doctor Ruiz, el cliente todavía no ha aprobado la segunda fase.", accept: ["Con todo (el) respeto, doctor Ruiz, el cliente [todavía|aún] no ha aprobado la segunda fase."] }
  ],
  register: [
    { es: "Ya, pero...", en: "Right, but...", when: "with friends, quick and casual" },
    { es: "Tampoco tanto.", en: "Not that much.", when: "with anyone you know, to shrink a claim" },
    { es: "Puede que me equivoque, pero...", en: "I may be wrong, but...", when: "at work, with colleagues or your boss" },
    { es: "Con todo respeto, esa cifra no es correcta.", en: "With all due respect, that figure isn't right.", when: "to your boss, in a formal meeting" },
    { es: "Sin ánimo de contradecirlo, creo que hay un error.", en: "Without wishing to contradict you, I think there's a mistake.", when: "formal, to someone you call usted" }
  ],
  personal: {
    prompt: "A friend says the restaurant you both went to was terrible. You liked it. Disagree in two lines without turning it into a fight.",
    constraints: [
      { type: "containsAny", words: ["no creas", "tampoco tanto", "tampoco así", "puede que", "sí, bueno", "ya, pero", "no es eso exactamente"], label: "a preface: *bueno, no creas*, *ya, pero*, *puede que me equivoque*" },
      { type: "minWords", n: 12, label: "at least twelve words" }
    ],
    model: "Bueno, no creas, a mí me gustó bastante. Puede que me equivoque, pero la sopa era la mejor que he probado este año."
  },
  pitfalls: [
    "*No digo que está mal* is the slip: you are not claiming it, so *que esté mal*.",
    "*Sin ánimo de contradecirlo* among friends sounds sarcastic: keep it for formal settings.",
    "*Hombre, tanto como eso no* sounds like Spain; in Colombia, *tampoco tanto* or *tampoco así*."
  ]
},

"dc-negacion-c1": {
  source: "old",
  hook: {
    line: "Your cousin asks whether you got the job in Bogotá, whether you are coming to the farm for the long weekend, and whether she can borrow your car. Three answers, all of them no, and the word does not have to appear once.",
    es: "¿Te dieron el trabajo? ¡Qué va! Ni me llamaron.\n¿Vienes a la finca este puente? Ni pensarlo, tengo turno.\n¿Me prestas el carro? Ni de riesgos.",
    en: "Did you get the job? Not a chance! They didn't even call me.\nAre you coming to the farm this long weekend? Out of the question, I'm on shift.\nWill you lend me the car? No way."
  },
  examples: [
    { es: "¿Que si me dieron el puesto? ¡Qué va! Ni siquiera me llamaron para la segunda entrevista.", en: "Did I get the job? Not a chance! They didn't even call me for the second interview." },
    { es: "En mi vida había visto un trancón como el de anoche en la Autopista Norte.", en: "Never in my life had I seen a traffic jam like last night's on the Autopista Norte." },
    { es: "En ningún momento se informó a los pasajeros del cambio de horario del vuelo.", en: "At no point were the passengers told about the change to the flight time." }
  ],
  rule: "Spanish can say no without the word.\nA fixed exclamation: *¡Qué va!* *¡Ni de riesgos!* *Ni pensarlo.* *Ni loco.* *Para nada.* Often followed by what did happen: *¡Qué va! Ni me llamaron.*\nA negative word first, and the *no* disappears: *En mi vida había visto algo así.* *En ningún momento se informó a nadie.* *Nunca* and *nadie* work the same way. Put them after the verb and the *no* comes back: *No había visto algo así en mi vida.*\nSome phrases only live with a *no* before the verb: *no es gran cosa*, *no tengo la menor idea*.\n*No es que..., sino que...* denies one reason to give the real one, with the subjunctive after *no es que*.",
  readAndPick: [
    { q: "Did she get the job?", es: "¿El trabajo? ¡Qué va! Ni me llamaron.",
      options: ["Yes, they called her", "She's still waiting", "No, not even a call"], answer: 2,
      why: "*¡Qué va!* says no, and *ni me llamaron* adds that nothing happened at all." },
    { q: "Will he lend her the car?", es: "¿El carro? Ni de riesgos.",
      options: ["Under no circumstances", "Only if she drives safely", "Yes, with some care"], answer: 0,
      why: "In Colombia *ni de riesgos* is a flat, friendly no." },
    { q: "Where is the negation in this sentence?", es: "En ningún momento se informó a los pasajeros.",
      options: ["In a *no* before the verb", "In the opening phrase", "In a *no* at the end"], answer: 1,
      why: "*En ningún momento* comes first, so it carries the whole negation." },
    { q: "Which reason is the real one?", es: "No es que no quiera ir, sino que tengo turno.",
      options: ["Not wanting to go", "Not being invited", "Being on shift"], answer: 2,
      why: "*No es que* rules one reason out; *sino que* gives the real one." },
    { q: "How good was the film?", es: "La película no fue gran cosa.",
      options: ["Very good indeed", "Nothing special", "Far too long"], answer: 1,
      why: "*No... gran cosa* means nothing much, and the phrase needs its *no*." },
    { q: "Has he ever seen anything like it?", es: "En mi vida había visto algo así.",
      options: ["Never before", "Once, years ago", "All his life"], answer: 0,
      why: "*En mi vida* before the verb means never, with no *no*." }
  ],
  yourTurn: [
    { en: "Not a chance! They didn't even call me.", es: "¡Qué va! Ni me llamaron.", accept: ["¡[Qué va|Para nada]! Ni (siquiera) me llamaron."] },
    { en: "Never in my life had I seen anything like it.", es: "En mi vida había visto algo así.", accept: ["En mi vida había visto algo [así|igual|parecido]."] },
    { en: "It's not that I don't want to, it's that I can't.", es: "No es que no quiera, sino que no puedo.", accept: ["No es que no quiera, [sino que|es que] no puedo."] },
    { en: "Lend you the car? No way. (Colombia, to a friend)", es: "¿Prestarte el carro? Ni de riesgos.", accept: ["¿Prestarte el carro? [Ni de riesgos|Ni loco|Ni loca|Ni pensarlo]."] }
  ],
  translate: [
    { en: "Did they give you the job? Not a chance! They didn't even call me for the second interview.", es: "¿Te dieron el trabajo? ¡Qué va! Ni siquiera me llamaron para la segunda entrevista.", accept: ["¿Te dieron el [trabajo|puesto]? ¡[Qué va|Para nada]! Ni (siquiera) me llamaron para la segunda entrevista."] },
    { en: "At no point were the passengers told that the flight had been cancelled. (formal)", es: "En ningún momento se informó a los pasajeros de que el vuelo se había cancelado.", accept: ["En ningún momento se informó a los pasajeros (de) que el vuelo [se había cancelado|había sido cancelado].", "En ningún momento se les [informó|avisó|dijo] a los pasajeros que el vuelo [se había cancelado|había sido cancelado]."] },
    { en: "It's not that I don't like your cousin, it's that we have nothing in common.", es: "No es que no me caiga bien tu prima, sino que no tenemos nada en común.", accept: ["No es que no me caiga bien tu [prima|primo], [sino que|es que] no tenemos nada en común.", "No es que tu [prima|primo] no me caiga bien, [sino que|es que] no tenemos nada en común."] },
    { en: "The hotel was nothing special, and I haven't the faintest idea why people like it so much.", es: "El hotel no era gran cosa y no tengo la menor idea de por qué gusta tanto.", accept: ["El hotel no [era|fue] gran cosa y no tengo la [menor|más mínima|más remota] idea de por qué [gusta tanto|le gusta tanto a la gente]."] },
    { en: "Never in my life have I eaten an ajiaco as good as your grandmother's.", es: "En mi vida me he comido un ajiaco tan bueno como el de tu abuela.", accept: ["En mi vida [me he comido|he comido|me comí|comí] un ajiaco tan [bueno|rico] como el de tu abuela."] },
    { en: "Me, go to the office party? No way, not even if they paid me. This weekend I'm off to the farm.", es: "¿Yo, ir a la fiesta de la oficina? Ni loco, ni aunque me pagaran. Este fin de semana me voy para la finca.", accept: ["¿Yo, ir a la fiesta de la oficina? [Ni loco|Ni loca|Ni de riesgos|Ni pensarlo], ni aunque me pagaran. Este fin de semana me voy [para la|a la] finca."] }
  ],
  register: [
    { es: "¡Ni de riesgos!", en: "No way!", when: "in Colombia, with friends, a cheerful flat no" },
    { es: "¡Qué va!", en: "Not at all!", when: "in conversation, when the answer surprises them" },
    { es: "Para nada.", en: "Not at all.", when: "anywhere informal, calm and firm" },
    { es: "En absoluto.", en: "Absolutely not.", when: "formal or serious, a no with no room left" },
    { es: "En ningún momento se autorizó ese gasto.", en: "At no point was that expense authorised.", when: "in a formal letter or a public statement" }
  ],
  personal: {
    prompt: "Someone asks you three favours you will not do. Ask each one back and answer it, without the word *no* anywhere.",
    constraints: [
      { type: "containsAny", words: ["qué va", "ni de riesgos", "ni loco", "ni loca", "ni pensarlo", "para nada", "en absoluto", "en mi vida", "ni aunque"], label: "a no without no: *¡qué va!*, *ni de riesgos*, *ni pensarlo*" },
      { type: "regex", pattern: "^(?![\\s\\S]*\\bno\\b)[\\s\\S]*\\w", label: "the word *no* nowhere" },
      { type: "minSentences", n: 3, label: "three sentences or more" }
    ],
    model: "¿Prestarte el carro? Ni de riesgos. ¿Cuidarte el perro un mes? Ni pensarlo. ¿Ir a tu fiesta de disfraces? ¡Ni loca, ni aunque me pagaran!"
  },
  pitfalls: [
    "*Tengo la menor idea* is not Spanish: the phrase needs a *no* before the verb.",
    "*En mi vida* first drops the *no*; *en mi vida* last needs it: *No lo había visto en mi vida.*",
    "*Ni de broma* sounds like Spain; in Colombia, *ni de riesgos*."
  ]
},

"dc-estilo-indirecto-c1": {
  source: "old",
  hook: {
    line: "Yesterday the landlord finally came round about the broken water heater. Tonight you are telling your sister what he said, and every verb you choose tells her what you think of him.",
    es: "Me aclaró que él no había dañado nada.\nMe advirtió que no volviera a llamarlo a esas horas.\nY me soltó que, si no me gustaba, me fuera.",
    en: "He made it clear that he hadn't broken anything.\nHe warned me not to call him at that hour again.\nAnd he came out with it: if I didn't like it, I could leave."
  },
  examples: [
    { es: "El dueño me aclaró que el calentador ya estaba dañado cuando nos pasamos al apartamento.", en: "The landlord made it clear that the water heater was already broken when we moved into the apartment." },
    { es: "Me reprochó que no lo hubiera llamado antes de mandar al técnico a revisar el calentador.", en: "He reproached me for not calling him before I sent the technician to look at the heater." },
    { es: "Me dijo que volvería al día siguiente, y el muy descarado no apareció en toda la semana.", en: "He told me he would come back the next day, and the shameless man didn't show up all week." }
  ],
  rule: "Reporting is never neutral: the verb you choose is your reading of what was said.\n*Dijo que* reports. *Aclaró que* presents it as clearing up a doubt. *Advirtió que* makes it a warning. *Reprochó que* makes it an accusation. *Soltó que* makes it blunt and unwelcome.\nAn order reported takes the subjunctive: *Llámame* becomes *me dijo que lo llamara*. After *reprochar*, *advertir* or *pedir*, the same: *me advirtió que no volviera*.\nTime and place move with you: *mañana* becomes *al día siguiente*, *aquí* becomes *allá*.\nYour own verdict can ride on a phrase: *el muy descarado*, *la pobre*.",
  readAndPick: [
    { q: "How does the speaker present what he said?", es: "Me reprochó que no lo hubiera llamado.",
      options: ["As a friendly reminder", "As an accusation", "As a clarification"], answer: 1,
      why: "*Reprochar* turns his words into an accusation: that is the reporter's reading." },
    { q: "What did the landlord actually say?", es: "Me advirtió que no volviera a llamarlo tan tarde.",
      options: ["Don't call me so late again", "Call me back a little later on", "I won't call you late again"], answer: 0,
      why: "A warning reported keeps its order in the subjunctive: *que no volviera*." },
    { q: "When was he coming back?", es: "Me dijo que volvería al día siguiente.",
      options: ["Tomorrow, counting from today", "The day after he spoke", "At some point next week"], answer: 1,
      why: "*Al día siguiente* counts from when he spoke, not from today." },
    { q: "What does the speaker think of him?", es: "El muy descarado me dijo que no era su problema.",
      options: ["That he was right", "That he was confused", "That he's shameless"], answer: 2,
      why: "*El muy descarado* is the reporter's own verdict, slipped into the report." },
    { q: "How did his remark come across?", es: "Y me soltó que, si no me gustaba, me fuera.",
      options: ["Blunt and unwelcome", "Calm and very helpful", "Shy and rather unsure"], answer: 0,
      why: "*Soltar* marks the words as sudden and rude." }
  ],
  yourTurn: [
    { en: "He told me to call him the next day.", es: "Me dijo que lo llamara al día siguiente.", accept: [] },
    { en: "She warned us not to leave anything valuable in the car.", es: "Nos advirtió que no dejáramos nada de valor en el carro.", accept: ["Nos advirtió (de) que no dejáramos nada de valor en el carro."] },
    { en: "He made it clear that he hadn't signed anything.", es: "Me aclaró que no había firmado nada.", accept: ["Me aclaró que (él) no había firmado nada."] },
    { en: "She reproached him for not having gone to the meeting.", es: "Le reprochó que no hubiera ido a la reunión.", accept: ["Le reprochó que no [hubiera ido|fuera] a la reunión."] }
  ],
  translate: [
    { en: "The minister made it clear that the measure would not affect contracts already signed.", es: "La ministra aclaró que la medida no afectaría los contratos ya firmados.", accept: ["[La ministra|El ministro] aclaró que la medida no afectaría (a) los contratos ya firmados."] },
    { en: "The landlord told me he would come back the next day, and he didn't show up all week.", es: "El dueño me dijo que volvería al día siguiente, y no apareció en toda la semana.", accept: ["El [dueño|arrendador] me dijo que [volvería|vendría] al día siguiente, y no apareció en toda la semana."] },
    { en: "My boss reproached me for having made the decision without consulting anyone. In fact, I had consulted three people.", es: "Mi jefe me reprochó que hubiera tomado la decisión sin consultar a nadie. En realidad, yo había consultado a tres personas.", accept: ["Mi [jefe|jefa] me reprochó que hubiera tomado la decisión sin consultar a nadie. [En realidad|De hecho], (yo) había consultado a tres personas."] },
    { en: "The nurse warned me not to eat anything after ten at night.", es: "La enfermera me advirtió que no comiera nada después de las diez de la noche.", accept: ["La enfermera me advirtió (de) que no comiera nada después de las diez de la noche."] },
    { en: "And then the shameless man came out with the line that the leak was our fault.", es: "Y entonces el muy descarado me soltó que la gotera era culpa nuestra.", accept: ["Y entonces el muy descarado (me) soltó que la gotera era [culpa nuestra|nuestra culpa]."] },
    { en: "The undersigned state that they were not informed of the changes to the contract. (official letter)", es: "Los abajo firmantes hacen constar que no fueron informados de los cambios en el contrato.", accept: ["Los abajo firmantes hacen constar que no fueron informados de los cambios [en el|del] contrato."] }
  ],
  register: [
    { es: "Me dijo que no venía.", en: "He told me he wasn't coming.", when: "when you want to report, not judge" },
    { es: "Me soltó que no venía.", en: "He came out with it: he wasn't coming.", when: "telling a friend, when it annoyed you" },
    { es: "Me reprochó que no lo llamara.", en: "He reproached me for not calling him.", when: "when you take his words as an accusation" },
    { es: "Los abajo firmantes hacen constar que...", en: "The undersigned state that...", when: "in an official letter or a formal complaint" }
  ],
  personal: {
    prompt: "Tell a friend, in two or three sentences, what someone said to you this week. Pick verbs that show what you thought of it, and report one order or warning.",
    constraints: [
      { type: "containsAny", words: ["aclaró", "advirtió", "reprochó", "soltó", "insistió", "juró", "confesó"], label: "a verb with a verdict: *aclaró*, *advirtió*, *reprochó*, *soltó*" },
      { type: "anyVerbInTense", tense: "impsubj", label: "an order or warning reported: *que lo llamara*, *que no volviera*" }
    ],
    model: "Mi jefa me advirtió que no volviera a llegar tarde. Después me aclaró que no era nada personal. Y al final me soltó que el viernes también tenía que trabajar."
  },
  pitfalls: [
    "*Me dijo llamarlo* is the slip: an order reported is *me dijo que lo llamara*.",
    "*Me dijo que venía mañana* only works if tomorrow is still ahead; otherwise, *al día siguiente*.",
    "A loaded verb is your claim: *reprochó* or *soltó* in an email can be held against you."
  ]
},

"dc-reformuladores-c1": {
  source: "merged",
  hook: {
    line: "The apartment you wanted in Chapinero has fallen through, and your partner wants to know why. You explain, correct yourself, sum up, and finally wave the whole story away. Each of those moves has its own small phrase in Spanish.",
    es: "El dueño subió el arriendo; o sea, ya no nos alcanza.\nBueno, lo subió un poco; mejor dicho, un montón.\nEn cualquier caso, hay que seguir buscando.",
    en: "The owner put the rent up; in other words, we can't afford it any more.\nWell, he put it up a bit; or rather, a lot.\nIn any case, we have to keep looking."
  },
  examples: [
    { es: "El dueño subió el arriendo un treinta por ciento; o sea, ya no nos alcanza para pagarlo.", en: "The owner put the rent up thirty percent; in other words, we can't afford to pay it any more." },
    { es: "El apartamento era pequeño; mejor dicho, era un cuarto con cocina y una ventana al patio.", en: "The apartment was small; or rather, it was one room with a kitchen and a window onto the yard." },
    { es: "Es caro y queda lejos del trabajo. En cualquier caso, es lo único que hay en el barrio.", en: "It's expensive and it's far from work. In any case, it's the only thing there is in the neighbourhood." }
  ],
  rule: "These phrases announce that what follows replaces what came before, and each one says why.\nTo explain: *o sea* when talking, *es decir* anywhere, *dicho de otro modo* or *en otras palabras* in writing and talks.\nTo correct yourself: *mejor dicho* withdraws what you said and puts something stronger: *Llegó tarde; mejor dicho, no llegó.* To soften instead, say *bueno* or *en realidad*.\nTo sum up: *en resumidas cuentas*, *en definitiva*, and *al fin y al cabo*, which appeals to the obvious.\nTo wave it all aside: *en cualquier caso*, *de todos modos*. The objections may be true, and none of them changes the conclusion.\n*O sea* in every sentence makes you sound vague.",
  readAndPick: [
    { q: "What does *mejor dicho* do here?", es: "Llegó tarde; mejor dicho, no llegó.",
      options: ["Softens 'late' a bit", "Repeats 'late'", "Replaces 'late'"], answer: 2,
      why: "*Mejor dicho* withdraws the first claim and puts a stronger one in its place." },
    { q: "What happens to his objections?", es: "Es caro y está lejos. En cualquier caso, es lo único que hay.",
      options: ["They are set aside", "They are answered one by one", "They are accepted in full"], answer: 0,
      why: "*En cualquier caso* grants that they may be true and rules them irrelevant." },
    { q: "Which one belongs in a written report?", es: "El informe está incompleto.",
      options: ["O sea, no se entrega.", "Es decir, no se entrega.", "Ya, no se entrega."], answer: 1,
      why: "*Es decir* is safe in writing; *o sea* belongs to talk." },
    { q: "What is she doing with *al fin y al cabo*?", es: "Al fin y al cabo, nadie lo obligó a firmar.",
      options: ["Asking him a genuine question", "Changing the subject", "Appealing to the obvious"], answer: 2,
      why: "*Al fin y al cabo* sums up by pointing at what everyone already knows." },
    { q: "What does *o sea* bring in?", es: "Nos subieron el arriendo; o sea, nos tenemos que mudar.",
      options: ["A brand new topic", "What it comes down to", "An apology to him"], answer: 1,
      why: "*O sea* spells out what the first part means in practice." }
  ],
  yourTurn: [
    { en: "In other words, we have to start again.", es: "Es decir, tenemos que empezar de nuevo.", accept: ["[Es decir|O sea|En otras palabras], tenemos que empezar de [nuevo|cero]."] },
    { en: "He arrived late; or rather, he didn't arrive.", es: "Llegó tarde; mejor dicho, no llegó.", accept: [] },
    { en: "In any case, the decision has already been made.", es: "En cualquier caso, la decisión ya está tomada.", accept: ["[En cualquier caso|De todos modos|En todo caso], la decisión ya está tomada."] },
    { en: "After all, nobody forced him to sign.", es: "Al fin y al cabo, nadie lo obligó a firmar.", accept: [] }
  ],
  translate: [
    { en: "The report is incomplete; that is, we can't present it to the client on Monday.", es: "El informe está incompleto; es decir, no podemos presentárselo al cliente el lunes.", accept: ["El informe está incompleto; [es decir|o sea], no podemos [presentárselo|presentarlo] al cliente el lunes."] },
    { en: "It was a misunderstanding; or rather, nobody bothered to ask what had happened.", es: "Fue un malentendido; mejor dicho, nadie se tomó el trabajo de preguntar qué había pasado.", accept: ["Fue un malentendido; mejor dicho, nadie se tomó [el trabajo|la molestia] de preguntar qué había pasado."] },
    { en: "It's expensive and it's far from the office. Even so, it's the only option we have this month.", es: "Es caro y queda lejos de la oficina. De todos modos, es la única opción que tenemos este mes.", accept: ["Es caro y [queda|está] lejos de la oficina. [De todos modos|En cualquier caso|Aun así], es la única opción que tenemos este mes."] },
    { en: "In short, the trip didn't turn out the way we had hoped, but we learned a lot.", es: "En resumidas cuentas, el viaje no salió como esperábamos, pero aprendimos mucho.", accept: ["[En resumidas cuentas|En definitiva|En resumen], el viaje no salió como [esperábamos|lo esperábamos|habíamos esperado], pero aprendimos mucho."] },
    { en: "After all, it wasn't only his fault: the whole team knew about the problem.", es: "Al fin y al cabo, la culpa no fue solo suya: todo el equipo sabía del problema.", accept: ["Al fin y al cabo, la culpa no fue solo suya: todo el equipo sabía [del problema|lo del problema]."] },
    { en: "Put another way, the plan doesn't hold up if the dollar keeps rising. (in a talk)", es: "Dicho de otro modo, el plan no se sostiene si el dólar sigue subiendo.", accept: ["[Dicho de otro modo|Dicho de otra manera|En otras palabras], el plan no se sostiene si el dólar sigue subiendo."] }
  ],
  register: [
    { es: "O sea, que no vienes.", en: "So you're not coming, then.", when: "talking with friends, to spell it out" },
    { es: "Es decir, no vienes.", en: "That is, you're not coming.", when: "anywhere, careful and exact" },
    { es: "Dicho de otro modo, el plan no funciona.", en: "Put another way, the plan doesn't work.", when: "in writing or a prepared talk" },
    { es: "Esto es, el contrato quedó sin efecto.", en: "That is to say, the contract was void.", when: "in formal writing only" }
  ],
  personal: {
    prompt: "Explain to a friend why a plan of yours fell through. Correct yourself once, then wave the details aside and say what happens now.",
    constraints: [
      { type: "containsAny", words: ["mejor dicho"], label: "correct yourself: *mejor dicho*" },
      { type: "containsAny", words: ["en cualquier caso", "de todos modos", "en todo caso", "de cualquier modo"], label: "wave it aside: *en cualquier caso*, *de todos modos*" }
    ],
    model: "El viaje a Cartagena se canceló porque subieron los tiquetes; mejor dicho, se triplicaron. En cualquier caso, nos vamos para la finca de mi tía."
  },
  pitfalls: [
    "*Mejor dicho* says your first version was wrong. To soften it, use *bueno* or *en realidad*.",
    "*En cualquier caso* answers nothing: where an answer is expected, it sounds evasive.",
    "*O sea* every other sentence reads as filler, and in a report as vague."
  ]
},

"fn-expresar-desacuerdo-c1": {
  source: "old",
  hook: {
    line: "At the residents' meeting, the building manager proposes doubling the monthly fee to repaint the building. One neighbour doubts it, one is quietly against it, and one is about to explode. Spanish has words for every step on that scale.",
    es: "Esa propuesta no me convence.\nNo coincido con usted en que sea urgente.\n¿Doblar la cuota? ¡Eso no tiene ni pies ni cabeza!",
    en: "That proposal doesn't convince me.\nI don't agree with you that it's urgent.\nDouble the fee? That makes no sense at all!"
  },
  examples: [
    { es: "No coincido con usted en que la pintura sea urgente; el ascensor está mucho peor.", en: "I don't agree with you that the painting is urgent; the elevator is in much worse shape." },
    { es: "No se puede decir que la administración no lo haya intentado, pero el presupuesto no da.", en: "You can't say the management hasn't tried, but the budget doesn't stretch that far." },
    { es: "¿Doblar la cuota de administración en un año? Eso no tiene ni pies ni cabeza.", en: "Double the service charge in one year? That makes no sense at all." }
  ],
  rule: "Disagreement has a scale, and at this level you pick the step on purpose.\nDoubt: *Esa propuesta no me convence.*\nMeasured: *No comparto esa idea.* *Yo no diría eso.* *No coincido contigo en que* plus the subjunctive: *no coincido en que sea urgente*. For an action, *en lo de* plus the verb: *no coincido en lo de subir la cuota*.\nPartial: *No se puede decir que no lo hayan intentado* grants a fact the other person left out.\nFlat: *¡Para nada!* *¡Pero qué dices!* *¡Eso sí que no!* And for the logic itself: *Eso no tiene ni pies ni cabeza.*\nThe higher the step, the more personal it sounds.",
  readAndPick: [
    { q: "How strongly does she disagree?", es: "Esa propuesta no me convence.",
      options: ["She has doubts", "She is outraged", "She agrees in part"], answer: 0,
      why: "*No me convence* is the bottom of the scale: doubt, with no confrontation." },
    { q: "Which point is she rejecting?", es: "No coincido con usted en que sea urgente.",
      options: ["That it's needed", "That it's expensive", "That it's urgent"], answer: 2,
      why: "*No coincido en que* names exactly the point she rejects." },
    { q: "What does he grant?", es: "No se puede decir que no lo hayan intentado.",
      options: ["That they tried", "That they failed", "That they lied"], answer: 0,
      why: "*No se puede decir que no...* grants a fact the other person left out." },
    { q: "What is wrong with the plan, in his view?", es: "Eso no tiene ni pies ni cabeza.",
      options: ["It costs too much", "It makes no sense", "It takes too long"], answer: 1,
      why: "*Ni pies ni cabeza*: neither feet nor head, no logic at all." },
    { q: "Is this a mild objection?", es: "¿Pagar el doble? ¡Eso sí que no!",
      options: ["Yes, a gentle doubt", "Yes, a partial yes", "No, a flat refusal"], answer: 2,
      why: "*¡Eso sí que no!* shuts a proposal down completely." }
  ],
  yourTurn: [
    { en: "That proposal doesn't convince me.", es: "Esa propuesta no me convence.", accept: [] },
    { en: "I don't agree with you that it's urgent. (formal)", es: "No coincido con usted en que sea urgente.", accept: ["No [coincido|estoy de acuerdo] con usted en que sea urgente."] },
    { en: "That makes no sense at all.", es: "Eso no tiene ni pies ni cabeza.", accept: ["Eso no tiene [ni pies ni cabeza|ningún sentido]."] },
    { en: "Not at all! That's not what happened.", es: "¡Para nada! Eso no fue lo que pasó.", accept: ["¡Para nada! Eso no [fue lo que|es lo que] pasó."] }
  ],
  translate: [
    { en: "I don't agree with you that the painting is urgent; the elevator is in much worse shape. (formal)", es: "No coincido con usted en que la pintura sea urgente; el ascensor está mucho peor.", accept: ["No [coincido|estoy de acuerdo] con usted en que la pintura sea urgente; el ascensor está mucho peor."] },
    { en: "You can't say the building manager hasn't tried, but the budget doesn't stretch to everything.", es: "No se puede decir que el administrador no lo haya intentado, pero el presupuesto no alcanza para todo.", accept: ["No se puede decir que el administrador no lo haya intentado, pero el presupuesto no [alcanza|da] para todo."] },
    { en: "What are you talking about! That's not what happened at the meeting. I was there and I heard it all.", es: "¡Pero qué dices! Eso no fue lo que pasó en la reunión. Yo estaba ahí y lo oí todo.", accept: ["¡Pero qué dices! Eso no [fue lo que|es lo que] pasó en la reunión. Yo estaba [ahí|allí|allá] y lo [oí|escuché] todo."] },
    { en: "I don't share your way of seeing the problem at all, but I respect it.", es: "No comparto en absoluto tu forma de ver el problema, pero la respeto.", accept: ["No comparto [en absoluto|para nada] tu [forma|manera] de ver el problema, pero la respeto."] },
    { en: "Pay twice as much for the same service? Absolutely not. We'll pay what's fair and not a peso more.", es: "¿Pagar el doble por el mismo servicio? Eso sí que no. Pagaremos lo justo y ni un peso más.", accept: ["¿Pagar el doble por el mismo servicio? [Eso sí que no|De ninguna manera|Para nada]. [Pagaremos|Vamos a pagar] lo justo y ni un peso más."] },
    { en: "I wouldn't say the same: the new building manager has done things pretty well, honestly.", es: "Yo no diría lo mismo: la nueva administradora ha hecho las cosas bastante bien, la verdad.", accept: ["(Yo) no diría lo mismo: la [nueva administradora|administradora nueva] ha hecho las cosas bastante bien, la verdad.", "(Yo) no diría lo mismo: la [nueva administradora|administradora nueva] lo ha hecho bastante bien, la verdad."] }
  ],
  register: [
    { es: "¡Pero qué dices!", en: "What are you talking about!", when: "with friends or family, loud and close" },
    { es: "No me convence.", en: "It doesn't convince me.", when: "anywhere, to doubt without a fight" },
    { es: "No comparto esa postura.", en: "I don't share that position.", when: "in a meeting, firm and civil" },
    { es: "Me permito discrepar de la propuesta.", en: "Allow me to disagree with the proposal.", when: "in a formal letter or an assembly" }
  ],
  personal: {
    prompt: "Your building wants to raise the monthly fee to build a gym you will never use. Write three lines that climb the scale: a doubt, a measured no, then a flat one.",
    constraints: [
      { type: "containsAny", words: ["no me convence", "tengo mis dudas", "no estoy segur"], label: "a doubt: *no me convence*" },
      { type: "containsAny", words: ["no comparto", "no coincido", "yo no diría", "no estoy de acuerdo"], label: "a measured no: *no comparto*, *no coincido en que*" },
      { type: "containsAny", words: ["para nada", "eso sí que no", "qué dices", "ni pies ni cabeza", "de ninguna manera"], label: "a flat no: *¡eso sí que no!*, *ni pies ni cabeza*" }
    ],
    model: "La verdad, la idea del gimnasio no me convence. No coincido con ustedes en que sea una prioridad. ¿Subir la cuota para eso? ¡Eso sí que no!"
  },
  pitfalls: [
    "*No coincido en que es urgente* is the slip: you reject the claim, so *que sea urgente*.",
    "*Ni un euro más* is Spain's money: here, *ni un peso más*.",
    "*¡Pero qué dices!* aimed at a neighbour in a meeting is personal: keep it for people you know well."
  ]
},

"fn-expresar-acuerdo-c1": {
  source: "old",
  hook: {
    line: "You and your two sisters are planning your parents' fortieth anniversary on a video call. You agree with Carolina about almost everything and with Laura about almost nothing. Agreeing well is as precise as disagreeing: all of it, most of it, or just a bit.",
    es: "¿Hacemos la fiesta en la finca? ¡De una!\nCoincido contigo en que hay que invitar a los tíos.\nEstoy de acuerdo en todo, salvo en lo del mariachi.",
    en: "Shall we have the party at the farm? Absolutely!\nI agree with you that we have to invite our aunts and uncles.\nI agree with everything except the mariachi idea."
  },
  examples: [
    { es: "Coincido contigo en que la finca es el mejor sitio: cabe toda la familia y hay piscina.", en: "I agree with you that the farm is the best place: the whole family fits and there's a pool." },
    { es: "Algo de razón tienes con lo del presupuesto, pero un mariachi no cuesta tanto como crees.", en: "You've got a point about the budget, but a mariachi band doesn't cost as much as you think." },
    { es: "Estoy de acuerdo en todo, salvo en la fecha: el primer fin de semana de diciembre es imposible.", en: "I agree with everything except the date: the first weekend in December is impossible." }
  ],
  rule: "Agreement has steps too.\nFull: *¡Exacto!* *¡Así es!* *Totalmente de acuerdo.* With friends in Colombia, *¡Obvio!*, and to say yes to a plan, *¡De una!*\nPrecise: *Coincido contigo en que* plus a plain statement: *coincido en que es el mejor sitio*. For an action, *en lo de* plus the verb: *coincido en lo de invitar a los tíos*. For something said: *coincido con lo que dijiste ayer*.\nPartial: *Algo de razón tienes.* *Estoy de acuerdo en todo, salvo en...* names the one point left out.\nAgreeing with a negative: *Yo tampoco diría que sea fácil.*\nAfter *coincido en que*, the plain form: you are claiming it too.",
  readAndPick: [
    { q: "Is she agreeing to the plan?", es: "¿Nos vamos el viernes? ¡De una!",
      options: ["Yes, right away", "Only in part", "She'll think about it"], answer: 0,
      why: "In Colombia *¡de una!* is an immediate yes to a plan." },
    { q: "How much does he agree?", es: "Algo de razón tienes.",
      options: ["Completely", "Not at all", "In part"], answer: 2,
      why: "*Algo de razón* grants some of the point, not all of it." },
    { q: "Which point does she leave out?", es: "Estoy de acuerdo en todo, salvo en la fecha.",
      options: ["The place", "The date", "The budget"], answer: 1,
      why: "*Salvo en* names the exception inside an overall yes." },
    { q: "What is he agreeing about?", es: "Coincido contigo en lo de invitar a los tíos.",
      options: ["An action to take", "A fact already known", "Something said last week"], answer: 0,
      why: "*En lo de* plus the verb agrees about an action." },
    { q: "Is he agreeing or disagreeing?", es: "No, yo tampoco diría que sea fácil.",
      options: ["Disagreeing politely", "Agreeing with a negative", "Changing the subject"], answer: 1,
      why: "*Yo tampoco* agrees with a negative claim: I wouldn't either." }
  ],
  yourTurn: [
    { en: "I agree with you that the farm is the best place.", es: "Coincido contigo en que la finca es el mejor sitio.", accept: ["[Coincido contigo|Estoy de acuerdo contigo] en que la finca es el mejor [sitio|lugar]."] },
    { en: "You've got a point, but not entirely.", es: "Algo de razón tienes, pero no del todo.", accept: ["Algo de razón tienes, [pero|aunque] no del todo."] },
    { en: "I agree with everything except the date.", es: "Estoy de acuerdo en todo, salvo en la fecha.", accept: ["Estoy de acuerdo en todo, [salvo|menos|excepto] en la fecha."] },
    { en: "Exactly! That's just what I think too.", es: "¡Exacto! Eso es justo lo que pienso yo también.", accept: ["¡[Exacto|Exactamente]! Eso es [justo|exactamente] lo que pienso yo también.", "¡[Exacto|Exactamente]! Eso es [justo|exactamente] lo que (yo) pienso también."] }
  ],
  translate: [
    { en: "I agree with you that the project needs more funding, but not about the deadline.", es: "Coincido contigo en que el proyecto necesita más financiación, pero no en el plazo.", accept: ["[Coincido contigo|Estoy de acuerdo contigo] en que el proyecto necesita más financiación, pero no en el plazo."] },
    { en: "I completely agree with what you told me yesterday about Mum and Dad's party.", es: "Coincido totalmente con lo que me dijiste ayer sobre la fiesta de mis papás.", accept: ["[Coincido totalmente|Estoy totalmente de acuerdo] con lo que me dijiste ayer sobre la fiesta de [mis papás|papá y mamá|nuestros papás]."] },
    { en: "Shall we leave at six to avoid the traffic? Absolutely! And let's stop for breakfast on the way.", es: "¿Salimos a las seis para evitar el trancón? ¡De una! Y paramos a desayunar en el camino.", accept: ["¿Salimos a las seis para evitar el [trancón|tráfico]? ¡[De una|Claro|Obvio]! Y paramos a desayunar en el camino."] },
    { en: "You've got a point about the music, but Grandma will want a mariachi band no matter what.", es: "Algo de razón tienes con lo de la música, pero la abuela querrá mariachi sí o sí.", accept: ["Algo de razón tienes [con|en] lo de la música, pero la abuela [querrá|va a querer] (un) mariachi sí o sí."] },
    { en: "No, I wouldn't say they're synonyms either: one is formal and the other isn't.", es: "No, yo tampoco diría que sean sinónimos: uno es formal y el otro no.", accept: ["No, yo tampoco diría que [sean|son] sinónimos: uno es formal y el otro no."] },
    { en: "Obviously the proposal needs some adjustments, and of that there is no doubt at all. (formal)", es: "Evidentemente, la propuesta necesita algunos ajustes, y de eso no hay ninguna duda.", accept: ["Evidentemente, la propuesta necesita algunos ajustes, y de eso no hay (ninguna) duda."] }
  ],
  register: [
    { es: "¡Obvio!", en: "Obviously!", when: "in Colombia, with friends" },
    { es: "¡De una!", en: "Let's do it!", when: "in Colombia, saying yes to a plan" },
    { es: "Totalmente de acuerdo.", en: "Totally agree.", when: "anywhere, warm and clear" },
    { es: "Comparto plenamente su preocupación.", en: "I fully share your concern.", when: "formal, in a meeting or a letter" }
  ],
  personal: {
    prompt: "A friend proposes a weekend trip and lists four ideas. Agree with most of it, then name the one thing you would change.",
    constraints: [
      { type: "containsAny", words: ["de una", "coincido", "totalmente de acuerdo", "exacto", "así es", "obvio"], label: "a clear yes: *¡de una!*, *coincido en que*" },
      { type: "containsAny", words: ["salvo en", "menos en", "excepto en", "algo de razón"], label: "the exception: *salvo en...*" }
    ],
    model: "¡De una! Coincido contigo en que Villa de Leyva es perfecto para dos días. Estoy de acuerdo en todo, salvo en lo de salir el sábado a las cuatro de la mañana."
  },
  pitfalls: [
    "*Coincido en que sea* is the slip: you are claiming it too, so *coincido en que es*.",
    "*Algo de razón tienes* is a half yes: the listener waits for the *pero*.",
    "*Desde luego* sounds very Spanish; in Colombia, *claro*, *obvio* or *por supuesto*."
  ]
},

"fn-pedir-confirmacion-c1": {
  source: "old",
  hook: {
    line: "Two people have told you that your friend Mateo is leaving the band and moving abroad, and he hasn't said a word to you. You call him. You want the truth without accusing him of anything, at least not yet.",
    es: "Tengo entendido que te vas para Madrid, ¿cierto?\nPero ¿tú no tenías contrato aquí hasta diciembre?\n¿No estarás insinuando que me iba a ir sin avisarte?",
    en: "I understand you're moving to Madrid, right?\nBut didn't you have a contract here until December?\nYou're not suggesting I was going to leave without telling you?"
  },
  examples: [
    { es: "Tengo entendido que te vas para Madrid en enero, ¿cierto? Me lo contó Sofía el sábado.", en: "I understand you're moving to Madrid in January, right? Sofía told me on Saturday." },
    { es: "No entendí bien si te vas para siempre o solo por los seis meses del contrato.", en: "I didn't quite get whether you're leaving for good or just for the six months of the contract." },
    { es: "¿Me juras que no le has contado nada a nadie de la banda todavía?", en: "Do you swear you haven't told anyone in the band anything yet?" }
  ],
  rule: "Checking what you heard runs from a tag to an accusation.\nA tag on the end: *¿cierto?* (very Colombian), *¿verdad?*, *¿no?*, or *¿me equivoco?*, which puts the doubt in you.\nDrop a fact you already know and let them confirm it: *Tengo entendido que...* *Me enteré por Sofía de que...* No question needed: the pause does the asking.\nCheck one detail: *No entendí bien si...* *¿Te refieres a que...?*\nSurprise at a contradiction, with a past verb: *Pero ¿tú no vivías en Cali?*\nAsk for a promise: *¿Me juras que...?*\nSuspicion: *¿No estarás insinuando que...?* The future here guesses, and it is nearly a reproach.",
  readAndPick: [
    { q: "Is she really asking?", es: "Tengo entendido que te vas para Madrid.",
      options: ["Yes, it invites a reply", "No, it's just a statement", "No, it's an accusation"], answer: 0,
      why: "*Tengo entendido que* drops what she heard and waits for him to confirm it." },
    { q: "What surprises her?", es: "Pero ¿tú no vivías en Cali?",
      options: ["That he lives in Cali", "That Cali is far away", "That he's left Cali"], answer: 2,
      why: "*Pero ¿tú no...?* with a past verb checks something that contradicts what she believed." },
    { q: "How does he take her question?", es: "¿No estarás insinuando que fui yo?",
      options: ["As a fair question", "As a suspicion", "As a compliment"], answer: 1,
      why: "*¿No estarás insinuando?* guesses at her meaning and pushes back: nearly a reproach." },
    { q: "What does he want to know?", es: "No entendí bien si viene tu hermano o vienes tú.",
      options: ["Who is coming", "When they arrive", "Why she's coming"], answer: 0,
      why: "*No entendí bien si...* checks one detail: here, which of them." },
    { q: "Where does *¿me equivoco?* put the doubt?", es: "Ustedes ya se conocían, ¿me equivoco?",
      options: ["In the listener", "In a third person", "In the speaker"], answer: 2,
      why: "*¿Me equivoco?* checks politely by casting the doubt on yourself." }
  ],
  yourTurn: [
    { en: "I understand you're moving to Madrid, right?", es: "Tengo entendido que te vas para Madrid, ¿cierto?", accept: ["Tengo entendido que te vas [para|a] Madrid, ¿[cierto|no|verdad]?"] },
    { en: "But didn't you live in Cali?", es: "Pero ¿tú no vivías en Cali?", accept: [] },
    { en: "Do you swear you haven't told anyone?", es: "¿Me juras que no se lo has contado a nadie?", accept: ["¿Me juras que no [se lo has contado|le has contado nada|se lo contaste|le contaste nada] a nadie?"] },
    { en: "You're not suggesting it was me, are you?", es: "¿No estarás insinuando que fui yo?", accept: ["¿No estarás insinuando que [fui yo|fue culpa mía|fue mi culpa]?"] }
  ],
  translate: [
    { en: "I didn't quite understand whether you're leaving for good or just for six months.", es: "No entendí bien si te vas para siempre o solo por seis meses.", accept: ["No [entendí|he entendido] bien si te vas para siempre o solo por seis meses."] },
    { en: "I heard from Sofía that you were leaving the band. Is that true?", es: "Me enteré por Sofía de que te ibas de la banda. ¿Es cierto?", accept: ["Me enteré por Sofía (de) que te ibas de la banda. ¿Es [cierto|verdad]?", "Supe por Sofía que te ibas de la banda. ¿Es [cierto|verdad]?"] },
    { en: "You were late again this morning, weren't you? Your boss called the house twice.", es: "Llegaste tarde otra vez esta mañana, ¿cierto? Tu jefe llamó dos veces a la casa.", accept: ["Llegaste tarde otra vez esta mañana, ¿[cierto|no|verdad]? Tu [jefe|jefa] llamó [dos veces a la casa|a la casa dos veces]."] },
    { en: "Do you mean we have to pay the whole amount now, before signing? (formal)", es: "¿Se refiere a que tenemos que pagarlo todo ahora, antes de firmar?", accept: ["¿Se refiere (usted) a que [tenemos que|hay que] pagarlo todo ahora, antes de firmar?"] },
    { en: "Am I supposed to believe you haven't said anything to Jorge in three weeks?", es: "¿Tengo que creerme que no le has dicho nada a Jorge en tres semanas?", accept: ["¿Tengo que [creerme|creer] que no le [has dicho|dijiste] nada a Jorge en tres semanas?"] },
    { en: "You two already knew each other from before the English course, am I wrong?", es: "Ustedes dos ya se conocían desde antes del curso de inglés, ¿me equivoco?", accept: ["Ustedes dos ya se conocían (desde) antes del curso de inglés, ¿me equivoco?"] }
  ],
  register: [
    { es: "¿Cierto?", en: "Right?", when: "in Colombia, at the end of almost anything" },
    { es: "¿Verdad que sí?", en: "Isn't it, though?", when: "with friends, hoping for a yes" },
    { es: "Tengo entendido que se aplazó.", en: "I understand it was postponed.", when: "at work, to check without asking outright" },
    { es: "¿Me confirma si la reunión sigue en pie?", en: "Could you confirm whether the meeting is still on?", when: "in a work email or call" }
  ],
  personal: {
    prompt: "You heard a rumour about a friend from someone else. Write the first two lines of your call: drop what you heard, then check one detail.",
    constraints: [
      { type: "containsAny", words: ["tengo entendido", "me enteré", "supe por", "me contaron"], label: "drop what you heard: *tengo entendido que*, *me enteré por... de que*" },
      { type: "question", label: "check one detail, as a question" }
    ],
    model: "Tengo entendido que te vas a vivir a Medellín. No entendí bien si es por el trabajo o por tu novia, ¿me cuentas?"
  },
  pitfalls: [
    "*¿A que sí?* is heard in Spain; in Colombia the tag is *¿cierto?* or *¿verdad?*",
    "*Tengo entendido que...* needs no question mark: the pause does the asking.",
    "*¿No estarás insinuando...?* is not a neutral question: expect the other person to bristle."
  ]
},

"fn-confirmar-informacion-previa-c1": {
  source: "old",
  hook: {
    line: "Your mother has called three times about tomorrow's flight to Cartagena, and each time she asks the same things. You confirm, and confirm again, and by the third call your yes has changed shape.",
    es: "¿Seguro que reservaste el hotel? Sí, de hecho ya lo pagué.\n¿Y te acuerdas de la hora del vuelo? ¡Cómo no me voy a acordar!\n¿Seguro, seguro? Que sí, mamá, que ya está todo listo.",
    en: "Are you sure you booked the hotel? Yes, in fact I've already paid for it.\nAnd do you remember the flight time? How could I not remember!\nReally sure? Yes, Mum, really, everything's ready."
  },
  examples: [
    { es: "Sí, de hecho ya pagué el hotel y mandé los pasaportes escaneados por correo esta mañana.", en: "Yes, in fact I've already paid for the hotel and emailed the scanned passports this morning." },
    { es: "Que sí, mamá, que el vuelo sale a las seis y que ya hice el registro en línea.", en: "Yes, Mum, really, the flight leaves at six and I've already checked in online." },
    { es: "Así es: tal como le indicamos por teléfono, la reserva incluye el desayuno y el traslado.", en: "That's right: as we told you on the phone, the booking includes breakfast and the transfer." }
  ],
  rule: "Confirming has its own range, from the office to the kitchen.\nFormal: *Así es.* *Efectivamente.* *En efecto.* In writing: *Le confirmo que...* *Tal como le indicamos...*\n*De hecho* confirms and adds a detail that proves it: *Sí, de hecho ya lo pagué.* It is not just a longer yes.\nTo someone who keeps doubting: *Que sí, que...* and, with feeling, *Que sí, mamá, que sí.* Only with people close to you.\nEmphatic, about something nobody could forget: *¡Claro que me acuerdo!* *¡Cómo no me voy a acordar!*\n*¡Y tanto!* is heard in Spain; in Colombia the emphatic yes is *¡claro que sí!* or *¡obvio!*",
  readAndPick: [
    { q: "What does *de hecho* add?", es: "¿Reservaste? Sí, de hecho ya lo pagué.",
      options: ["Proof that it's done", "A doubt about it", "A change of plan"], answer: 0,
      why: "*De hecho* confirms and adds the detail that backs it up." },
    { q: "Who would say this?", es: "Así es, la reserva incluye el desayuno.",
      options: ["A child to a parent at home", "A hotel clerk to a guest", "A friend at a party"], answer: 1,
      why: "*Así es* is a formal yes, at home in offices and service calls." },
    { q: "How does she feel about the repeated question?", es: "Que sí, mamá, que ya está todo listo.",
      options: ["Patient and pleased", "A bit fed up", "Unsure herself"], answer: 1,
      why: "*Que sí, que...* answers someone who keeps doubting, with a trace of impatience." },
    { q: "Does he remember the day?", es: "¡Cómo no me voy a acordar de ese día!",
      options: ["Barely at all", "He isn't sure", "Of course he does"], answer: 2,
      why: "*¡Cómo no me voy a acordar!* is an emphatic yes: forgetting is unthinkable." },
    { q: "What is the email doing?", es: "Le confirmo que su cita sigue en pie para el jueves.",
      options: ["Moving the appointment to Friday", "Cancelling it", "Saying it still stands"], answer: 2,
      why: "*Le confirmo que* and *sigue en pie*: nothing has changed." }
  ],
  yourTurn: [
    { en: "Yes, in fact, I've already paid for it.", es: "Sí, de hecho, ya lo pagué.", accept: ["Sí, de hecho(,) ya lo [pagué|he pagado]."] },
    { en: "That's right, they told him yesterday. (formal)", es: "Así es, se lo dijeron ayer.", accept: ["[Así es|Efectivamente|En efecto], se lo dijeron ayer."] },
    { en: "Of course I remember that day!", es: "¡Claro que me acuerdo de ese día!", accept: ["¡Claro que me acuerdo de ese día!", "¡Cómo no me voy a acordar de ese día!", "¡Claro que recuerdo ese día!"] },
    { en: "Yes, Mum, really, everything's ready.", es: "Que sí, mamá, que ya está todo listo.", accept: ["Que sí, mamá, que (ya) está todo listo."] }
  ],
  translate: [
    { en: "That's right: as we told you on the phone, the room includes breakfast and the airport transfer. (formal)", es: "Así es: tal como le indicamos por teléfono, la habitación incluye el desayuno y el traslado al aeropuerto.", accept: ["[Así es|Efectivamente|En efecto]: tal como le [indicamos|dijimos] por teléfono, la habitación incluye el desayuno y el traslado al aeropuerto."] },
    { en: "I can confirm that your appointment is still on for Thursday at ten in the morning. (email)", es: "Le confirmo que su cita sigue en pie para el jueves a las diez de la mañana.", accept: ["Le confirmo que su cita sigue en pie para el jueves a las diez (de la mañana)."] },
    { en: "Did it rain a lot in Bogotá? Of course it did! The streets around the office flooded.", es: "¿Llovió mucho en Bogotá? ¡Claro que llovió! Se inundaron las calles alrededor de la oficina.", accept: ["¿Llovió mucho en Bogotá? ¡[Claro que llovió|Claro que sí|Uf, cómo llovió]! Se inundaron las calles [alrededor de|cerca de] la oficina."] },
    { en: "Yes, in fact we had already thought of that ourselves last week.", es: "Sí, de hecho ya habíamos pensado en eso mismo la semana pasada.", accept: ["Sí, de hecho(,) ya habíamos pensado en eso (mismo) la semana pasada."] },
    { en: "Yes, really, he left a good while ago; he said he'd call you from the bus.", es: "Que sí, que se fue hace un buen rato; dijo que te llamaba desde el bus.", accept: ["Que sí, que se fue hace un buen rato; dijo que te [llamaba|llamaría] desde el bus."] },
    { en: "Indeed, the payment was received on the fifth, as shown on the attached receipt. (formal)", es: "En efecto, el pago se recibió el día cinco, como consta en el recibo adjunto.", accept: ["[En efecto|Efectivamente|Así es], el pago se recibió el (día) cinco, como consta en el [recibo|comprobante] adjunto."] }
  ],
  register: [
    { es: "Que sí, que ya voy.", en: "Yes, yes, I'm coming.", when: "at home, to someone who keeps asking" },
    { es: "¡Claro que sí!", en: "Of course!", when: "anywhere, a warm emphatic yes" },
    { es: "Así es.", en: "That's right.", when: "at work or on a service call" },
    { es: "Le confirmo que su solicitud fue aprobada.", en: "I can confirm that your application was approved.", when: "in a formal email or letter" }
  ],
  personal: {
    prompt: "Someone who worries about you asks for the third time whether you have done something. Answer with a detail that proves it, and then with a little impatience.",
    constraints: [
      { type: "containsAny", words: ["de hecho"], label: "a yes with proof: *de hecho*" },
      { type: "regex", pattern: "que s[ií],\\s*(mamá|papá|abuela|abuelo|amor|[a-záéíóúñ]+,\\s*)?que", label: "the impatient yes: *que sí, que...*" }
    ],
    model: "Sí, de hecho ya saqué la cita y la pagué. Que sí, mamá, que el lunes voy al médico."
  },
  pitfalls: [
    "*De hecho* is not a longer *sí*: it needs the detail that proves the point.",
    "*Que sí, que...* to a client sounds rude: keep it for family and friends.",
    "*¡Y tanto!* sounds like Spain; in Colombia, *¡claro que sí!* or *¡obvio!*"
  ]
},

"fn-conocimiento-desconocimiento-c1": {
  source: "merged",
  hook: {
    line: "Money has gone missing from the office petty cash. By lunchtime everyone has heard, and by four o'clock the company has sent out a statement. The same not knowing sounds very different at the coffee machine and in the official email.",
    es: "¿Te enteraste de lo de la caja menor?\nNi idea, ¿qué pasó?\nLa empresa tiene conocimiento de lo ocurrido y desconoce, por ahora, la identidad de los responsables.",
    en: "Did you hear about the petty cash business?\nNo idea, what happened?\nThe company is aware of what happened and does not, for now, know who is responsible."
  },
  examples: [
    { es: "¿Te enteraste de lo de la caja menor? Dicen que faltan dos millones desde el viernes.", en: "Did you hear about the petty cash business? They say two million has been missing since Friday." },
    { es: "No tengo ni la menor idea de quién tenía la llave del cajón ese fin de semana.", en: "I haven't the faintest idea who had the key to the drawer that weekend." },
    { es: "La empresa tiene conocimiento de que faltan fondos, pero desconoce por ahora quiénes son los responsables.", en: "The company is aware that funds are missing, but does not yet know who is responsible." }
  ],
  rule: "Knowing and not knowing change words as the setting gets formal.\nGossip and news: *¿Te enteraste de lo de...?* *Enterarse* always has its *me, te, se* and its *de*: *Me enteré de que se casan.* *Lo de* points at a story you both know.\nHalfway: *Estoy enterada de todo.* *¿Tienes idea de si...?*\nNot at all: *No tengo ni idea*, *ni la menor idea*, *ni la más remota idea*. These need the *no*.\nFormal: *Tenemos conocimiento de que...* *Desconocemos los motivos.* *Lo ignoro.* Here *ignorar* means not knowing, not taking no notice.\n*¿Te enteraste?* is the everyday past here; *¿te has enterado?* sounds like Spain.",
  readAndPick: [
    { q: "Where would you hear this?", es: "¿Te enteraste de lo de Pedro?",
      options: ["In an official statement", "At the coffee machine", "In a court ruling"], answer: 1,
      why: "*¿Te enteraste de lo de...?* is news and gossip between people who know each other." },
    { q: "What does *lo ignoro* mean here?", es: "¿Dónde está el informe? Lo ignoro.",
      options: ["I don't know", "I'm not interested", "I refuse to look"], answer: 0,
      why: "In formal Spanish *ignorar* means you lack the information, not that you take no notice." },
    { q: "How much does she know?", es: "No tengo ni la más remota idea.",
      options: ["Only a little", "Almost everything", "Nothing at all"], answer: 2,
      why: "*Ni la más remota idea* is the strongest way to know nothing." },
    { q: "What is the company admitting?", es: "Desconocemos el paradero de los responsables.",
      options: ["Where they are, exactly", "That it can't find them", "That it is hiding them"], answer: 1,
      why: "*Desconocer* and *el paradero*: they do not know where those responsible are." },
    { q: "How did she find out?", es: "Me enteré por el periódico de que cerraban la fábrica.",
      options: ["From the newspaper", "From a friend", "From the factory"], answer: 0,
      why: "*Enterarse por* names the source; *de que* brings the news." }
  ],
  yourTurn: [
    { en: "Did you hear about the petty cash business?", es: "¿Te enteraste de lo de la caja menor?", accept: [] },
    { en: "I haven't the faintest idea.", es: "No tengo ni la menor idea.", accept: ["No tengo ni la [menor|más mínima|más remota] idea."] },
    { en: "We do not know the reasons. (formal)", es: "Desconocemos los motivos.", accept: ["[Desconocemos|Ignoramos] [los motivos|las razones]."] },
    { en: "I found out from Marta that they're getting married.", es: "Me enteré por Marta de que se casan.", accept: ["Me enteré por Marta (de) que se [casan|van a casar]."] }
  ],
  translate: [
    { en: "The company is aware that several cases have been detected in the Medellín office. (formal)", es: "La empresa tiene conocimiento de que se detectaron varios casos en la oficina de Medellín.", accept: ["La empresa tiene conocimiento de que se [detectaron|han detectado] varios casos en la oficina de Medellín."] },
    { en: "Do you have any idea whether there's a pharmacy open around here at this time?", es: "¿Tienes idea de si hay una droguería abierta por aquí a esta hora?", accept: ["¿Tienes idea de si hay una [droguería|farmacia] abierta por [aquí|acá] a esta hora?"] },
    { en: "Did you hear about Pedro? He's leaving the company. I found out this morning from his secretary.", es: "¿Te enteraste de lo de Pedro? Se va de la empresa. Me enteré esta mañana por su secretaria.", accept: ["¿[Te enteraste de lo de|Supiste lo de] Pedro? Se va de la empresa. Me enteré esta mañana por su secretaria."] },
    { en: "I'm aware of everything that happened in the meeting; nobody needs to explain it to me again.", es: "Estoy enterado de todo lo que pasó en la reunión; nadie tiene que volver a explicármelo.", accept: ["Estoy [enterado|enterada] de todo lo que pasó en la reunión; nadie tiene que volver a explicármelo.", "Estoy [enterado|enterada] de todo lo que pasó en la reunión; nadie me lo tiene que volver a explicar."] },
    { en: "For the moment, the police do not know the whereabouts of those responsible for the robbery.", es: "Por el momento, la policía desconoce el paradero de los responsables del robo.", accept: ["[Por el momento|Por ahora|De momento], la policía desconoce el paradero de los responsables del robo."] },
    { en: "I haven't the faintest idea who had the key that weekend; ask the building manager.", es: "No tengo ni la menor idea de quién tenía la llave ese fin de semana; pregúntale al administrador.", accept: ["No tengo ni la [menor|más mínima|más remota] idea de quién tenía la llave ese fin de semana; pregúntale [al administrador|a la administradora]."] }
  ],
  register: [
    { es: "Ni idea.", en: "No idea.", when: "with anyone you know, quick and casual" },
    { es: "¿Supiste lo de Pedro?", en: "Did you hear about Pedro?", when: "in Colombia, passing on news among friends" },
    { es: "No tengo conocimiento de eso.", en: "I have no knowledge of that.", when: "at work, careful and on the record" },
    { es: "Desconocemos los motivos de su renuncia.", en: "We do not know the reasons for his resignation.", when: "in a statement or a formal email" }
  ],
  personal: {
    prompt: "A colleague asks you about something odd that happened at work. Answer as you would to a friend, then as you would in an email to the boss.",
    constraints: [
      { type: "containsAny", words: ["ni idea", "ni la menor idea", "ni la más remota", "ni la más mínima", "me enteré", "te enteraste", "supiste"], label: "the friendly version: *ni idea*, *me enteré de...*" },
      { type: "containsAny", words: ["desconozco", "desconocemos", "ignoro", "ignoramos", "tengo conocimiento", "tenemos conocimiento"], label: "the formal version: *desconozco*, *no tengo conocimiento*" }
    ],
    model: "¿Lo de la caja menor? Ni idea, me enteré esta mañana. Para el correo: desconozco los detalles de lo ocurrido y no tengo conocimiento de quién tenía la llave."
  },
  pitfalls: [
    "*Me enteré que* is common in speech; in writing keep the *de*: *me enteré de que*.",
    "*Tengo la menor idea* is not Spanish: *no tengo la menor idea*.",
    "*Lo ignoro* in an office means I don't know; *me ignoró* at a party means he took no notice of me."
  ]
},

"nt-certeza-incertidumbre-c1": {
  source: "merged",
  hook: {
    line: "A video saying that forty people got sick after eating at a famous Bogotá restaurant has a million views. You are the journalist writing it up, and your editor wants every sentence to say exactly how sure you are.",
    es: "No cabe duda de que hubo intoxicados.\nCabe la posibilidad de que la causa fuera el agua, no la comida.\nY nadie sabe a ciencia cierta quién grabó el video.",
    en: "There is no doubt that people were poisoned.\nIt's possible that the cause was the water, not the food.\nAnd nobody knows for certain who filmed the video."
  },
  examples: [
    { es: "Cabe la posibilidad de que el video se haya grabado en otro restaurante con el mismo nombre.", en: "It's possible that the video was filmed in another restaurant with the same name." },
    { es: "Sus declaraciones sembraron dudas entre los clientes, aunque nadie sabe a ciencia cierta qué pasó.", en: "His statements sowed doubt among the customers, although nobody knows for certain what happened." },
    { es: "Sin lugar a dudas, el informe del laboratorio es la prueba más sólida que tenemos hasta ahora.", en: "Without a doubt, the lab report is the strongest evidence we have so far." }
  ],
  rule: "Formal Spanish grades certainty step by step, and the verb shows the step.\nCertain: *sin lugar a dudas*, *no cabe (la menor) duda de que*, *sé a ciencia cierta que*. The verb stays plain: *no cabe duda de que es grave*.\nPossible: *cabe la posibilidad de que*, *no se descarta que*. Not sure, so the subjunctive: *cabe la posibilidad de que sea el agua*.\nSuspected: *sospecho que*, and *me temo que* for bad news, both with a plain verb.\nDoubt as an action: *poner en duda* questions a claim; *sembrar dudas* plants it in others. *Dar por sentado* takes it for granted.\nUse *sin lugar a dudas* for what is only probable and you lose the reader.",
  readAndPick: [
    { q: "How sure is the writer?", es: "Cabe la posibilidad de que la causa fuera el agua.",
      options: ["Completely certain", "It's one possibility", "It has been ruled out"], answer: 1,
      why: "*Cabe la posibilidad de que* opens a possibility, hence the subjunctive *fuera*." },
    { q: "What did his statements do?", es: "Sus declaraciones sembraron dudas entre los clientes.",
      options: ["Made customers doubt", "Put minds at rest", "Proved what happened"], answer: 0,
      why: "*Sembrar dudas*: to plant doubt in other people, often on purpose." },
    { q: "What does the paper say about the owner?", es: "No se descarta que el dueño conociera el problema.",
      options: ["He surely knew", "He may have known", "He couldn't have known"], answer: 1,
      why: "*No se descarta que* keeps a possibility open, with the subjunctive." },
    { q: "What does *dar por sentado* mean here?", es: "Todos dieron por sentado que la comida era la culpable.",
      options: ["They proved it with tests", "They doubted it at first", "They assumed it unchecked"], answer: 2,
      why: "*Dar por sentado*: to assume without checking." },
    { q: "Is she expecting good news?", es: "Me temo que ya es demasiado tarde para cerrar el local.",
      options: ["Yes, she's really quite hopeful", "No, she expects bad news", "She has no view at all"], answer: 1,
      why: "*Me temo que* brings in bad news, with a plain verb." }
  ],
  yourTurn: [
    { en: "It's possible that this is a mistake. (formal)", es: "Cabe la posibilidad de que se trate de un error.", accept: ["Cabe la posibilidad de que [se trate de|sea] un error."] },
    { en: "Without a doubt, it's her best novel.", es: "Sin lugar a dudas, es su mejor novela.", accept: ["Sin lugar a dudas, [es|se trata de] su mejor novela."] },
    { en: "Nobody knows for certain what happened.", es: "Nadie sabe a ciencia cierta qué pasó.", accept: ["Nadie sabe a ciencia cierta [qué pasó|lo que pasó|qué ocurrió]."] },
    { en: "I suspect he isn't telling us the whole truth.", es: "Sospecho que no nos está contando toda la verdad.", accept: ["Sospecho que no nos está [contando|diciendo] toda la verdad.", "Sospecho que no nos [cuenta|dice] toda la verdad."] }
  ],
  translate: [
    { en: "There is not the slightest doubt that the owner acted in good faith. (formal)", es: "No cabe la menor duda de que el dueño actuó de buena fe.", accept: ["No cabe la menor duda de que el dueño [actuó|ha actuado] de buena fe."] },
    { en: "It isn't ruled out that the minister knew about the contract before it was signed. (news)", es: "No se descarta que el ministro conociera el contrato antes de que se firmara.", accept: ["No se descarta que [el ministro|la ministra] [conociera|hubiera conocido] el contrato antes de que se firmara."] },
    { en: "We're facing a classic dilemma: price or quality. And frankly, I fear it's already too late to have both.", es: "Estamos ante un dilema clásico: precio o calidad. Y, francamente, me temo que ya es demasiado tarde para tener las dos cosas.", accept: ["Estamos ante un dilema clásico: precio o calidad. Y, francamente, me temo que ya es (demasiado) tarde para tener las dos cosas."] },
    { en: "Her statements called into question everything the company had said until then.", es: "Sus declaraciones pusieron en duda todo lo que la empresa había dicho hasta entonces.", accept: ["Sus declaraciones pusieron en duda todo lo que la empresa había [dicho|afirmado] hasta [entonces|ese momento]."] },
    { en: "We took it for granted that the flight would leave on time, and we missed the connection.", es: "Dimos por sentado que el vuelo saldría a tiempo, y perdimos la conexión.", accept: ["Dimos por sentado que el vuelo [saldría|iba a salir] a tiempo, y perdimos la conexión."] },
    { en: "In the hypothetical case that he won, what would he do with all that money?", es: "En el caso hipotético de que ganara, ¿qué haría con toda esa plata?", accept: ["En el caso hipotético de que ganara, ¿qué haría con [toda esa plata|todo ese dinero]?"] }
  ],
  register: [
    { es: "A lo mejor fue el agua.", en: "Maybe it was the water.", when: "talking with friends, a loose guess" },
    { es: "Puede ser que haya sido el agua.", en: "It could be that it was the water.", when: "anywhere, a careful guess" },
    { es: "Cabe la posibilidad de que haya sido el agua.", en: "It is possible that it was the water.", when: "in a report or the news" },
    { es: "No cabe duda de que fue el agua.", en: "There is no doubt it was the water.", when: "when you have the proof in hand" }
  ],
  personal: {
    prompt: "Something strange happened in your building or your town. Write three sentences: one thing that is certain, one that is only possible, and one you suspect.",
    constraints: [
      { type: "containsAny", words: ["sin lugar a dudas", "no cabe duda", "no cabe la menor duda", "a ciencia cierta"], label: "certain: *no cabe duda de que*" },
      { type: "subjunctiveAfter", trigger: "posibilidad de que", label: "possible: *cabe la posibilidad de que* plus the subjunctive" },
      { type: "containsAny", words: ["sospecho", "me temo", "me imagino"], label: "suspected: *sospecho que*, *me temo que*" }
    ],
    model: "No cabe duda de que alguien rompió la puerta del parqueadero. Cabe la posibilidad de que haya sido un camión al dar reversa. Sospecho que el vecino del tercer piso sabe algo."
  },
  pitfalls: [
    "*Cabe la posibilidad de que es* is the slip: it is only possible, so *que sea*.",
    "*No cabe duda de que sea* is the opposite slip: certain, so *que es*.",
    "*Sembrar dudas* is not having doubts: it is planting them in other people."
  ]
},

"nt-realidad-ficcion-c1": {
  source: "merged",
  hook: {
    line: "For a whole year, a man in Cali passed himself off as a surgeon. He had a white coat, a forged diploma and patients who adored him. You are telling the story to friends, and Spanish has words for every layer between what he seemed and what he was.",
    es: "En apariencia era un médico como cualquier otro.\nSe hizo pasar por cirujano durante un año.\nY lo más inverosímil es que nadie sospechó nada.",
    en: "On the surface he was a doctor like any other.\nHe passed himself off as a surgeon for a year.\nAnd the most implausible thing is that nobody suspected a thing."
  },
  examples: [
    { es: "En apariencia todo iba bien en la clínica, pero las cuentas no cuadraban desde hacía meses.", en: "On the surface everything was fine at the clinic, but the accounts hadn't added up for months." },
    { es: "Se hizo pasar por cirujano con un diploma falso y una seguridad que convencía a cualquiera.", en: "He passed himself off as a surgeon with a fake diploma and a confidence that convinced anyone." },
    { es: "Su sueño de abrir una clínica propia nunca se hizo realidad, por suerte para los pacientes.", en: "His dream of opening his own clinic never came true, luckily for the patients." }
  ],
  rule: "Between what is real and what only seems real, Spanish has a word for each layer.\nLooks: *en apariencia*, with no article, warns that the truth may differ, and a *pero* usually follows. *Tiene toda la pinta de ser un error* says it looks very much like one. *Tiene cara de no haber dormido* is for faces.\nPretending: *fingir* a feeling or a state, *hacerse pasar por* someone, *simular* a situation.\nBelievable or not: *verosímil*, *inverosímil*.\nDreams: a *utopía* can never be reached; a dream that comes true *se hace realidad*.\nAttitude: *tener los pies en la tierra* is being realistic; *cerrar los ojos ante la realidad* refuses to see; after a holiday you *vuelves a la realidad*.",
  readAndPick: [
    { q: "What does *en apariencia* warn the reader?", es: "En apariencia todo iba bien en la clínica.",
      options: ["That all was fine", "That it may not be so", "That the clinic closed"], answer: 1,
      why: "*En apariencia* describes the surface and hints that the truth may differ." },
    { q: "What did he do?", es: "Se hizo pasar por cirujano durante un año.",
      options: ["Faked being a surgeon", "Trained as a surgeon", "Worked for a surgeon"], answer: 0,
      why: "*Hacerse pasar por*: to pass yourself off as someone you are not." },
    { q: "How does the story strike her?", es: "Me parece una historia totalmente inverosímil.",
      options: ["Very moving", "Easy to believe", "Hard to believe"], answer: 2,
      why: "*Inverosímil*: it does not look true." },
    { q: "What does she think of her friend?", es: "Ana tiene los pies en la tierra.",
      options: ["She's realistic", "She's a dreamer", "She's very tired"], answer: 0,
      why: "*Tener los pies en la tierra*: to keep a realistic view of things." },
    { q: "What does the speaker think happened?", es: "Eso tiene toda la pinta de ser un malentendido.",
      options: ["A deliberate lie to them", "Most likely a mix-up", "A real crime"], answer: 1,
      why: "*Tiene toda la pinta de*: it looks very much like." },
    { q: "What does *idealizar* suggest about his memories?", es: "Idealiza demasiado su infancia en el campo.",
      options: ["They're accurate and very clear", "They're rosier than it was", "They're painful to recall"], answer: 1,
      why: "*Idealizar* gives something qualities it never had, usually out of fondness." }
  ],
  yourTurn: [
    { en: "On the surface everything was going well.", es: "En apariencia todo iba bien.", accept: ["En apariencia(,) todo iba bien."] },
    { en: "He passed himself off as a doctor.", es: "Se hizo pasar por médico.", accept: [] },
    { en: "It's time to get back to reality.", es: "Es hora de volver a la realidad.", accept: [] },
    { en: "It looks very much like a misunderstanding.", es: "Tiene toda la pinta de ser un malentendido.", accept: ["Tiene toda la pinta de (ser) un malentendido."] }
  ],
  translate: [
    { en: "On the surface the contract is fair, but the small print hides a trap.", es: "En apariencia el contrato es justo, pero la letra menuda esconde una trampa.", accept: ["En apariencia(,) el contrato es justo, pero la letra [menuda|pequeña|chiquita] esconde una trampa."] },
    { en: "He passed himself off as a surgeon for a year, and nobody at the hospital suspected a thing.", es: "Se hizo pasar por cirujano durante un año, y nadie en el hospital sospechó nada.", accept: ["Se hizo pasar por cirujano (durante) un año, y nadie en el hospital sospechó nada."] },
    { en: "She pretended to be ill so as not to go to the wedding. Nobody believed her, but nobody said anything either.", es: "Fingió estar enferma para no ir al matrimonio. Nadie le creyó, pero nadie dijo nada tampoco.", accept: ["Fingió estar enferma para no ir al [matrimonio|casamiento]. Nadie le creyó, pero [nadie dijo nada tampoco|tampoco nadie dijo nada|nadie dijo nada]."] },
    { en: "After years of effort, their dream of opening a bakery in Manizales came true.", es: "Después de años de esfuerzo, su sueño de abrir una panadería en Manizales se hizo realidad.", accept: ["[Después de|Tras] años de esfuerzo, su sueño de abrir una panadería en Manizales se hizo realidad."] },
    { en: "The government can't keep turning a blind eye to the reality of the coffee growers.", es: "El gobierno no puede seguir cerrando los ojos ante la realidad de los caficultores.", accept: [] },
    { en: "You look as if you haven't slept at all. Did you stay up studying again last night?", es: "Tienes cara de no haber dormido nada. ¿Te quedaste estudiando otra vez anoche?", accept: ["Tienes cara de no haber dormido nada. ¿Te quedaste [estudiando otra vez|otra vez estudiando] anoche?"] }
  ],
  register: [
    { es: "¡Qué mentira tan grande!", en: "What a huge lie!", when: "with friends, when a story is clearly false" },
    { es: "Eso no me suena muy creíble.", en: "That doesn't sound very believable to me.", when: "politely, when you doubt a story" },
    { es: "La versión resulta poco verosímil.", en: "The account is hardly plausible.", when: "in a review, a report or a court" },
    { es: "Hay que tener los pies en la tierra.", en: "We have to keep our feet on the ground.", when: "anywhere, to call for realism" }
  ],
  personal: {
    prompt: "Describe someone or something that seemed one thing and turned out to be another, in two or three sentences.",
    constraints: [
      { type: "containsAny", words: ["en apariencia", "aparentemente", "tenía toda la pinta", "tiene toda la pinta", "parecía"], label: "how it looked: *en apariencia*, *tenía toda la pinta de*" },
      { type: "containsAny", words: ["fingí", "fingía", "fingió", "se hacía pasar", "se hizo pasar", "simul", "inverosímil", "en realidad"], label: "what it was: *se hacía pasar por*, *fingía*, *en realidad*" }
    ],
    model: "En apariencia, mi vecino era un señor tranquilo que regaba las matas. En realidad, se hacía pasar por abogado y les cobraba a los vecinos consultas falsas."
  },
  pitfalls: [
    "*En la apariencia* is the slip: *en apariencia*, with no article.",
    "*Utopía* is not any wish: it is an ideal that can never come true.",
    "*Fingir* takes a state or a feeling; for a person, *hacerse pasar por*: *se hizo pasar por médico*."
  ]
},

"task-c1-decirlo": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: an internal memo that criticises a decision firmly without the criticism belonging to anyone. The model is about a schedule that everyone knows was set too early, and that nobody wants to be the one to say so.",
    es: "Se ha planteado en varias ocasiones la conveniencia de revisar el calendario.\nAl parecer, la fecha se fijó antes de conocer el alcance del proyecto.\nNo es que el plan sea inviable; es que se diseñó para otro supuesto.",
    en: "The advisability of reviewing the schedule has been raised on several occasions.\nApparently, the date was set before the scope of the project was known.\nIt's not that the plan is unworkable; it's that it was designed for a different scenario."
  },
  examples: [
    { es: "Se ha planteado en varias ocasiones, y no solo desde este departamento, la conveniencia de revisar el calendario.", en: "It has been raised on several occasions, and not only by this department, that the schedule should be reviewed." },
    { es: "Al parecer, la fecha se fijó antes de conocer el alcance del proyecto, lo cual explicaría los retrasos.", en: "Apparently, the date was set before the scope of the project was known, which would explain the delays." },
    { es: "Cabría valorar si no sería más prudente reconsiderar los plazos antes de que el problema se resuelva solo.", en: "It might be worth considering whether it would be wiser to rethink the deadlines before the problem solves itself." }
  ],
  rule: "The task: a memo, the minutes of a meeting or a comment on a proposal, about 150 words, that criticises firmly and belongs to nobody.\nUse the whole unit.\nThe impersonal *se*: *Se ha planteado que...* *Se fijó la fecha...*\nA covert quotation: *al parecer*, *por lo visto*, *según se ha comentado*.\nA conditional that does not assert: *lo cual explicaría...* *Cabría valorar si...*\nA negation by implication: *No es que sea inviable; es que...*\nA concession before the cut: *Puede que el equipo haya hecho lo posible, pero...*\nNo names, no *yo creo*, no *ustedes*. The reader should finish knowing exactly what is wrong and unable to say who said it.",
  readAndPick: [
    { q: "Who raised the issue?", es: "Se ha planteado en varias ocasiones la conveniencia de revisar el calendario.",
      options: ["The writer alone", "Nobody is named", "The director"], answer: 1,
      why: "The impersonal *se* says it was raised and names nobody." },
    { q: "Is the writer asserting the explanation?", es: "La fecha se fijó demasiado pronto, lo cual explicaría los retrasos.",
      options: ["No, only suggesting it", "Yes, as a known fact", "No, rejecting it"], answer: 0,
      why: "*Explicaría*: the conditional offers the explanation without claiming it." },
    { q: "What does the writer really say about the plan?", es: "No es que el plan sea inviable; es que se diseñó para otro supuesto.",
      options: ["It can't work", "It's perfect as it is", "It no longer fits"], answer: 2,
      why: "*No es que...; es que...* denies the harsh reading and gives the real problem." },
    { q: "What is this sentence asking for?", es: "Cabría valorar si no sería más prudente reconsiderar los plazos.",
      options: ["New deadlines", "A bigger budget", "A new team leader"], answer: 0,
      why: "Wrapped in *cabría valorar si*, the request is plain: change the deadlines." },
    { q: "What does the concession do here?", es: "Puede que el equipo haya hecho lo posible, pero el resultado no es aceptable.",
      options: ["Excuses the team completely", "Softens before the cut", "Blames the client"], answer: 1,
      why: "Granting the effort first makes the *pero* land without an attack." }
  ],
  yourTurn: [
    { en: "It has been suggested that the schedule should be reviewed.", es: "Se ha planteado la conveniencia de revisar el calendario.", accept: ["Se ha planteado la conveniencia de revisar el calendario.", "Se ha planteado que [convendría|conviene|habría que] revisar el calendario."] },
    { en: "Which would explain the delays.", es: "Lo cual explicaría los retrasos.", accept: ["[Lo cual|Lo que] explicaría los retrasos."] },
    { en: "It's not that it's unworkable; it's that the premise no longer holds.", es: "No es que sea inviable; es que el supuesto ya no se da.", accept: ["No es que sea inviable; es que el supuesto ya no se [da|cumple]."] },
    { en: "Apparently, the date was set too early.", es: "Al parecer, la fecha se fijó demasiado pronto.", accept: ["[Al parecer|Por lo visto], la fecha se fijó [demasiado pronto|antes de tiempo]."] }
  ],
  translate: [
    { en: "It has been pointed out on several occasions that the new system takes longer than the old one.", es: "Se ha señalado en varias ocasiones que el nuevo sistema tarda más que el anterior.", accept: ["Se ha señalado en varias ocasiones que el [nuevo sistema|sistema nuevo] tarda más que el anterior."] },
    { en: "Apparently the decision was taken before the results of the pilot were known. (memo)", es: "Al parecer, la decisión se tomó antes de que se conocieran los resultados del piloto.", accept: ["[Al parecer|Por lo visto], la decisión se tomó antes de [que se conocieran|conocer] los resultados del piloto."] },
    { en: "It isn't that the team hasn't tried. It's that it has been asked to do in three months what would take six.", es: "No es que el equipo no lo haya intentado. Es que se le ha pedido hacer en tres meses lo que requeriría seis.", accept: ["No es que el equipo no lo haya intentado. Es que se le [ha pedido|pidió] hacer en tres meses lo que [requeriría|exigiría] seis."] },
    { en: "This would explain, at least in part, the complaints received from clients in recent weeks.", es: "Esto explicaría, al menos en parte, las quejas recibidas de los clientes en las últimas semanas.", accept: ["[Esto|Lo cual] explicaría, al menos en parte, las quejas [recibidas|que se recibieron] de los clientes en las últimas semanas."] },
    { en: "It might be worth considering whether it would be wiser to postpone the launch until March.", es: "Cabría valorar si no sería más prudente aplazar el lanzamiento hasta marzo.", accept: ["Cabría [valorar|considerar|preguntarse] si no sería más prudente aplazar el lanzamiento hasta marzo."] },
    { en: "The team may have done what it could, but the result does not match what was agreed.", es: "Puede que el equipo haya hecho lo posible, pero el resultado no se ajusta a lo acordado.", accept: ["Puede que el equipo haya hecho lo posible, pero el resultado no se ajusta a lo [acordado|pactado]."] }
  ],
  register: [
    { es: "Esto quedó mal hecho.", en: "This was badly done.", when: "talking with a colleague you trust" },
    { es: "Habría que revisarlo.", en: "It ought to be reviewed.", when: "in a meeting, criticising nobody in particular" },
    { es: "Se ha detectado un error en el informe.", en: "An error has been detected in the report.", when: "in a memo or the minutes" },
    { es: "Cabría valorar otras alternativas.", en: "Other options might be worth considering.", when: "in formal writing, to push back" }
  ],
  personal: {
    prompt: "Write the core of your memo: three or four sentences criticising a real decision at work, at school or in your building. Name nobody, and say nothing in the first person.",
    constraints: [
      { type: "sePassive", label: "an impersonal *se*: *se ha planteado*, *se fijó*" },
      { type: "containsAny", words: ["al parecer", "por lo visto", "según se ha comentado", "según parece", "parece ser que"], label: "a covert quotation: *al parecer*, *por lo visto*" },
      { type: "anyVerbInTense", tense: "condicional", label: "a conditional that does not assert: *explicaría*, *cabría*" },
      { type: "avoidsAny", words: ["yo creo", "creo que", "pienso que", "en mi opinión"], label: "no *yo creo*, no *en mi opinión*" },
      { type: "minSentences", n: 3, label: "three sentences or more" }
    ],
    model: "Se ha comentado en varias reuniones que el nuevo horario de la portería no funciona. Al parecer, se decidió sin consultar a los residentes, lo cual explicaría tantas quejas. No es que el cambio sea malo; es que se aplicó sin aviso. Cabría valorar si no sería más prudente volver al horario anterior mientras se discute."
  },
  pitfalls: [
    "One *yo creo* undoes the whole memo: once the criticism has an owner, it can be answered as a person.",
    "Too many *se* in a row reads like a machine: vary with *al parecer*, a conditional, a concession.",
    "Impersonal is not vague: the problem itself must be named exactly."
  ]
},

/* ---- unit c1-u58 · Institutional Spanish ---------------------------------- */

"gn-carta-comercial-c1": {
  source: "old",
  hook: {
    line: "You work for a small company in Medellín that makes compostable packaging, and you are writing to a chain of coffee shops that has never heard of you. A sales letter that jumps from hello to the price list goes straight in the bin. This one earns each step.",
    es: "Asunto: Empaques compostables para sus tiendas\nRespetados señores:\nSabemos que cada vez más clientes eligen dónde tomarse un café según lo que pasa con el vaso.",
    en: "Subject: Compostable packaging for your shops\nDear Sir or Madam,\nWe know that more and more customers choose where to have a coffee by what happens to the cup."
  },
  examples: [
    { es: "Nos permitimos presentarles nuestra nueva línea de vasos compostables, fabricados en Medellín con fibra de bambú.", en: "We are pleased to introduce our new line of compostable cups, made in Medellín from bamboo fibre." },
    { es: "Sabemos que la sostenibilidad se ha convertido en un criterio decisivo para sus clientes.", en: "We know that sustainability has become a deciding factor for your customers." },
    { es: "Los invitamos a solicitar una muestra gratuita antes de fin de mes, sin ningún compromiso de compra.", en: "We invite you to request a free sample before the end of the month, with no obligation to buy." }
  ],
  rule: "A sales letter has four moves, in order, and skipping one costs the sale.\nAttention: one line the reader cares about, not your company's history.\nInterest: why this product matters to this reader: *Sabemos que...*\nDesire: a concrete gain, named exactly: *la reducción de costos*, *la entrega sin cargo*.\nAction: one easy step: *Los invitamos a solicitar una muestra.*\nThe frame: *Asunto* first, then *Respetados señores:* or *Apreciada señora Gómez:*. In Colombia business letters often open with *Nos permitimos...* and close with *Quedamos atentos* and *Cordialmente*.\nName any attachment: *Anexo: catálogo*.\n*Los invitamos*, not *les invitamos*: *invitar* takes *lo* and *los*.",
  readAndPick: [
    { q: "Which move is this?", es: "Los invitamos a solicitar una muestra gratuita antes del 30 de junio.",
      options: ["Getting the reader's attention", "Building desire", "Asking for action"], answer: 2,
      why: "*Los invitamos a* plus one easy step closes the letter with action." },
    { q: "Where does this line go?", es: "Asunto: Empaques compostables para sus tiendas",
      options: ["Before the greeting", "After the signature", "In the final paragraph"], answer: 0,
      why: "The subject line sums up the letter before the greeting." },
    { q: "What does *anexo* tell the reader?", es: "Anexo: catálogo de productos y lista de precios.",
      options: ["The prices have changed since", "A document comes with it", "A meeting is proposed"], answer: 1,
      why: "*Anexo* names what comes with the letter, so it is not missed." },
    { q: "How does this close sound in Colombia?", es: "Quedamos atentos a cualquier inquietud. Cordialmente,",
      options: ["Cold and curt", "Standard and polite", "Far too chatty and familiar"], answer: 1,
      why: "*Quedamos atentos* and *Cordialmente* are the everyday close of a Colombian business letter." },
    { q: "What does the reader gain, in this line?", es: "Nuestra línea les permite reducir costos sin perder resistencia.",
      options: ["A bigger discount later on", "Faster delivery times to all shops", "Lower costs, same strength"], answer: 2,
      why: "Desire: a concrete gain for this reader, before any request." }
  ],
  yourTurn: [
    { en: "We are pleased to introduce our new product line. (Colombian business letter)", es: "Nos permitimos presentarles nuestra nueva línea de productos.", accept: ["[Nos permitimos presentarles|Nos complace presentarles|Les escribimos para presentarles] nuestra nueva línea de productos."] },
    { en: "We invite you to request a free sample.", es: "Los invitamos a solicitar una muestra gratuita.", accept: ["Los invitamos a [solicitar|pedir] una muestra gratuita."] },
    { en: "We remain at your disposal for any questions.", es: "Quedamos atentos a cualquier inquietud.", accept: ["Quedamos atentos a cualquier [inquietud|consulta|pregunta].", "Quedamos a su disposición para cualquier [inquietud|consulta|pregunta]."] },
    { en: "Attachment: product catalogue.", es: "Anexo: catálogo de productos.", accept: [] }
  ],
  translate: [
    { en: "We know that sustainability has become a deciding factor for your customers when they choose a café.", es: "Sabemos que la sostenibilidad se ha convertido en un criterio decisivo para sus clientes al elegir un café.", accept: ["Sabemos que la sostenibilidad se ha convertido en un [criterio|factor] decisivo para sus clientes [al elegir|a la hora de elegir] un café."] },
    { en: "Our cups break down in ninety days and cost the same as conventional plastic ones.", es: "Nuestros vasos se descomponen en noventa días y cuestan lo mismo que los de plástico convencional.", accept: ["Nuestros vasos se [descomponen|degradan] en noventa días y cuestan lo mismo que los de plástico convencional."] },
    { en: "We invite you to request a free sample before the end of the month. There is no obligation to buy.", es: "Los invitamos a solicitar una muestra gratuita antes de fin de mes. No hay ningún compromiso de compra.", accept: ["Los invitamos a [solicitar|pedir] una muestra gratuita antes [de|del] fin de mes. No hay ningún compromiso de compra."] },
    { en: "The switch to compostable packaging will mean a reduction in costs and a better brand image.", es: "El cambio a empaques compostables supondrá una reducción de costos y una mejor imagen de marca.", accept: ["El cambio a empaques compostables [supondrá|significará|implicará] una reducción de costos y una mejor imagen de (su) marca."] },
    { en: "Several coffee chains in Bogotá and Cali have already adopted this line in the last year.", es: "Varias cadenas de cafés de Bogotá y Cali ya adoptaron esta línea en el último año.", accept: ["Varias cadenas de [cafés|cafeterías] [de|en] Bogotá y Cali ya [adoptaron|han adoptado] esta línea en el último año."] },
    { en: "We look forward to your reply and to any questions you may have. Kind regards, Laura Restrepo.", es: "Quedamos atentos a su respuesta y a cualquier inquietud que tengan. Cordialmente, Laura Restrepo.", accept: ["Quedamos atentos a su respuesta y a cualquier [inquietud|consulta|pregunta] que tengan. Cordialmente, Laura Restrepo."] }
  ],
  register: [
    { es: "¡Hola! Te cuento que sacamos vasos nuevos.", en: "Hi! Just so you know, we've brought out new cups.", when: "a message to a client you know well" },
    { es: "Les escribimos para presentarles nuestra nueva línea.", en: "We are writing to introduce our new line.", when: "a first email to a company" },
    { es: "Nos permitimos presentarles nuestra nueva línea.", en: "We are pleased to introduce our new line.", when: "a formal letter in Colombia" },
    { es: "Cordialmente,", en: "Kind regards,", when: "closing almost any business letter in Colombia" }
  ],
  personal: {
    prompt: "Write the body of a short sales letter for something you could sell: four sentences, one for each move.",
    constraints: [
      { type: "containsAny", words: ["sabemos que", "seguramente", "usted sabe", "ustedes saben"], label: "interest: why it matters to them, *sabemos que...*" },
      { type: "containsAny", words: ["los invitamos", "la invitamos", "lo invitamos", "las invitamos", "solicite", "solicitar"], label: "action: *los invitamos a...*" },
      { type: "minSentences", n: 4, label: "four sentences, one per move" }
    ],
    model: "¿Cuánto tiempo pierde su equipo buscando documentos? Sabemos que en una oficina pequeña cada hora cuenta. Nuestro sistema permite la búsqueda de cualquier archivo en segundos. Los invitamos a probarlo gratis durante un mes, sin ningún compromiso."
  },
  pitfalls: [
    "*Les invitamos* is Spain's: in Latin America, *los invitamos*.",
    "*Anejo* is a Spanish legal word: in Colombia an attachment is an *anexo*.",
    "*Muy señores míos* sounds like an old letter from Spain: in Colombia, *Respetados señores*."
  ]
},

"gn-trabajo-academico-c1": {
  source: "old",
  hook: {
    line: "You are writing up a study for your master's: how teachers in Bogotá correct adult learners' mistakes. Your supervisor sent back the introduction with one comment: where am I? Narrow it down before you tell me what you are doing.",
    es: "El aprendizaje de lenguas en adultos ha sido objeto de numerosos estudios.\nDentro de este campo, el presente trabajo se centra en la corrección de errores en el aula.",
    en: "Language learning in adults has been the subject of numerous studies.\nWithin this field, the present paper focuses on error correction in the classroom."
  },
  examples: [
    { es: "Dentro de este campo, el presente trabajo se centra en la corrección de errores orales en adultos.", en: "Within this field, the present paper focuses on the correction of spoken errors in adults." },
    { es: "En primer lugar se revisará la literatura; a continuación, se presentarán los datos de tres academias de idiomas.", en: "First the literature will be reviewed; next, the data from three language schools will be presented." },
    { es: "Si bien los datos sugieren un patrón claro, queda por establecer si se mantiene en clases virtuales.", en: "Although the data suggest a clear pattern, it remains to be established whether it holds in online classes." }
  ],
  rule: "An academic paper narrows twice before it says what it will do.\nIntroduction: the broad field (*ha sido objeto de numerosos estudios*), then your angle (*Dentro de este campo, el presente trabajo se centra en...*), then the aim (*El objetivo de este trabajo es...*), then the map, in the future with *se*: *En primer lugar se revisará...; a continuación, se presentarán...; por último, se discutirán...*\nConclusion: sum up (*Los datos sugieren que...*), weigh the consequences (*Estos hallazgos podrían...*) and name what is still open (*Queda por establecer si...*).\nCarry a concession inside the sentence: *Si bien los datos son claros, la muestra es pequeña.* After *si bien*, the plain verb.\nThen the bibliography and any annexes.",
  readAndPick: [
    { q: "Which part of the introduction is this?", es: "El aprendizaje de lenguas en adultos ha sido objeto de numerosos estudios.",
      options: ["The broad field", "The paper's aim", "The final result"], answer: 0,
      why: "It sets the general context before the paper narrows to its own angle." },
    { q: "What does *el presente trabajo* refer to?", es: "El presente trabajo se centra en la corrección de errores.",
      options: ["A job held right now", "Current research in general", "This very paper"], answer: 2,
      why: "*El presente trabajo*: the paper you are reading now." },
    { q: "What is the writer admitting?", es: "Si bien los datos son claros, la muestra es pequeña.",
      options: ["The data are rather unclear", "The sample is limited", "The study has failed"], answer: 1,
      why: "*Si bien* grants one thing inside the sentence and then limits the claim." },
    { q: "What does this sentence do in a conclusion?", es: "Queda por establecer si el patrón se mantiene en clases virtuales.",
      options: ["Names an open question", "Repeats the aim of the paper", "Thanks the reader"], answer: 0,
      why: "*Queda por establecer si* names what remains unresolved for future work." },
    { q: "Why the future with *se* here?", es: "En primer lugar se revisará la literatura existente.",
      options: ["It's a prediction", "It's a guess", "It maps the paper"], answer: 2,
      why: "The future with *se* lays out the route the paper will follow, with no *I*." }
  ],
  yourTurn: [
    { en: "The present paper focuses on error correction.", es: "El presente trabajo se centra en la corrección de errores.", accept: ["[El presente trabajo|Este trabajo] se centra en la corrección de errores."] },
    { en: "First, the existing literature will be reviewed.", es: "En primer lugar, se revisará la literatura existente.", accept: ["En primer lugar(,) se revisará la literatura existente."] },
    { en: "It remains to be established whether the pattern holds.", es: "Queda por establecer si el patrón se mantiene.", accept: ["Queda por [establecer|determinar|resolver] si el patrón se mantiene."] },
    { en: "Although the data are clear, the sample is small.", es: "Si bien los datos son claros, la muestra es pequeña.", accept: ["Si bien los datos son claros, la muestra es [pequeña|reducida]."] }
  ],
  translate: [
    { en: "Adult language learning has been the subject of numerous studies over the last few decades.", es: "El aprendizaje de lenguas en adultos ha sido objeto de numerosos estudios en las últimas décadas.", accept: ["El aprendizaje de lenguas en adultos ha sido objeto de numerosos estudios en las últimas décadas."] },
    { en: "The aim of this paper is to analyse which kinds of correction work best at each level.", es: "El objetivo de este trabajo es analizar qué tipos de corrección resultan más eficaces en cada nivel.", accept: ["El objetivo [de este trabajo|del presente trabajo] es analizar qué tipos de corrección [resultan|son] más eficaces en cada nivel."] },
    { en: "First, the literature will be reviewed. Next, the data will be presented and, finally, the implications for teaching will be discussed.", es: "En primer lugar, se revisará la literatura. A continuación, se presentarán los datos y, por último, se discutirán las implicaciones para la enseñanza.", accept: ["En primer lugar, se revisará la literatura. A continuación, se presentarán los datos y, [por último|finalmente], se discutirán las implicaciones [para la enseñanza|pedagógicas]."] },
    { en: "The data suggest that explicit correction is more effective at beginner levels.", es: "Los datos sugieren que la corrección explícita resulta más eficaz en los niveles iniciales.", accept: ["Los datos sugieren que la corrección explícita [resulta|es] más eficaz en los niveles iniciales."] },
    { en: "These findings could influence the design of teaching materials for adults.", es: "Estos hallazgos podrían influir en el diseño de materiales didácticos para adultos.", accept: [] },
    { en: "Although the sample is small, the results point in the same direction as earlier studies.", es: "Si bien la muestra es pequeña, los resultados apuntan en la misma dirección que estudios anteriores.", accept: ["Si bien la muestra es [pequeña|reducida], los resultados apuntan en la misma dirección que (los) estudios anteriores."] }
  ],
  register: [
    { es: "En este trabajo voy a hablar de la corrección.", en: "In this paper I'm going to talk about correction.", when: "a class presentation, never the written paper" },
    { es: "El presente trabajo se centra en la corrección.", en: "The present paper focuses on correction.", when: "the introduction of a paper or a thesis" },
    { es: "Queda por establecer si el patrón se mantiene.", en: "It remains to be established whether the pattern holds.", when: "the conclusion, naming open questions" },
    { es: "Cabe señalar que la muestra es pequeña.", en: "It should be noted that the sample is small.", when: "academic writing, to flag a limit" }
  ],
  personal: {
    prompt: "Write the opening of a short paper on a topic you know: the broad field, your angle and your aim, in three sentences.",
    constraints: [
      { type: "containsAny", words: ["ha sido objeto", "se ha estudiado", "numerosos estudios", "en las últimas décadas", "en los últimos años"], label: "the broad field: *ha sido objeto de numerosos estudios*" },
      { type: "containsAny", words: ["el presente trabajo", "este trabajo", "este estudio", "el presente estudio"], label: "your angle: *el presente trabajo se centra en...*" },
      { type: "containsAny", words: ["el objetivo", "se propone", "pretende"], label: "the aim: *el objetivo de este trabajo es...*" }
    ],
    model: "El turismo en el Caribe colombiano ha sido objeto de numerosos estudios en los últimos años. Dentro de este campo, el presente trabajo se centra en el impacto de los alquileres por días en el centro de Cartagena. El objetivo es analizar cómo ha cambiado el precio de la vivienda para los residentes."
  },
  pitfalls: [
    "*Si bien sea* is the slip: *si bien* takes the plain verb, *si bien es*.",
    "*En este trabajo voy a...* is fine aloud; on the page the paper speaks with *se*: *se analizará*.",
    "A conclusion that adds new data is a second development: sum up, weigh, and name what is open."
  ]
},

"gn-generos-escritos-c1": {
  source: "old",
  hook: {
    line: "Your book club in Bogotá publishes a short review each month, and this month it is your turn: a first novel everybody is talking about. Retelling the plot is easy. The job is to judge it, with reasons, and to say who should read it.",
    es: "La novela se lee de un tirón, pese a un final algo apresurado.\nLos personajes secundarios, en cambio, se quedan flojos.\nSe la recomiendo a los lectores que disfrutan de una buena intriga.",
    en: "The novel is a page-turner, despite a somewhat rushed ending.\nThe secondary characters, on the other hand, are weak.\nI recommend it to readers who enjoy a good mystery."
  },
  examples: [
    { es: "La novela destaca por su ritmo narrativo, aunque los personajes secundarios se quedan algo flojos.", en: "The novel stands out for its narrative pace, although the secondary characters are rather weak." },
    { es: "Pese a un final apresurado, la historia se lee de un tirón y deja con ganas de más.", en: "Despite a rushed ending, the story is a page-turner and leaves you wanting more." },
    { es: "La autora reconstruye la Barranquilla de los años setenta con una precisión que sorprende en una primera novela.", en: "The author recreates the Barranquilla of the seventies with a precision that is surprising in a first novel." }
  ],
  rule: "A review is not a summary: it is a judgment with reasons.\nTwo or three lines of plot at most, with no ending given away.\nThen the judgment, each claim tied to the book: *destaca por su ritmo narrativo*, *los personajes secundarios se quedan flojos*, *el final resulta apresurado*.\nCarry the balance inside the sentence: *Pese a un final apresurado, se lee de un tirón.* *Aunque* works too, but *pese a* plus a thing is tighter.\nClose with who should read it: *Se la recomiendo a los lectores que...*\nIn a work report the same moves turn impersonal: *El presente informe analiza...* *Se recomienda una implantación gradual.*",
  readAndPick: [
    { q: "Is this praise or criticism?", es: "Los personajes secundarios se quedan flojos.",
      options: ["Praise for the whole cast of characters", "A summary of the plot", "Criticism of a weak part"], answer: 2,
      why: "*Flojo* is weak, underdeveloped: a criticism with a precise target." },
    { q: "What does *se lee de un tirón* say?", es: "La historia se lee de un tirón.",
      options: ["It's hard to finish", "It's a page-turner", "It's very short"], answer: 1,
      why: "*De un tirón*: in one go, because you can't put it down." },
    { q: "What does *pese a* do here?", es: "Pese a un final apresurado, la novela convence.",
      options: ["Grants a flaw, then praises", "Blames the ending and nothing else", "Recommends the ending"], answer: 0,
      why: "*Pese a* carries the concession inside the sentence." },
    { q: "Where would you find this sentence?", es: "Se recomienda una implantación gradual, comenzando por un piloto de tres meses.",
      options: ["In a novel review", "In a work report", "In a love letter"], answer: 1,
      why: "*Se recomienda* and *implantación* belong to a report's recommendations." },
    { q: "What is the reviewer praising?", es: "La autora reconstruye la Barranquilla de los setenta con gran precisión.",
      options: ["Its portrait of a city", "The many twists of the plot", "The book's cover"], answer: 0,
      why: "Rebuilding a city *con gran precisión* praises the setting, with a reason." }
  ],
  yourTurn: [
    { en: "The novel stands out for its narrative pace.", es: "La novela destaca por su ritmo narrativo.", accept: ["La novela [destaca|se destaca] por su ritmo narrativo."] },
    { en: "The secondary characters are rather weak.", es: "Los personajes secundarios se quedan algo flojos.", accept: ["Los personajes secundarios [se quedan|quedan|son] [algo|un poco] flojos."] },
    { en: "Despite a rushed ending, it's a page-turner.", es: "Pese a un final apresurado, se lee de un tirón.", accept: ["[Pese a|A pesar de] un final apresurado, se lee de un tirón."] },
    { en: "A gradual rollout is recommended. (report)", es: "Se recomienda una implantación gradual.", accept: [] }
  ],
  translate: [
    { en: "The author recreates the Barranquilla of the seventies with surprising precision for a first novel.", es: "La autora reconstruye la Barranquilla de los setenta con una precisión sorprendente para una primera novela.", accept: ["La autora reconstruye la Barranquilla de los (años) setenta con una precisión sorprendente para una primera novela."] },
    { en: "Despite a slow start, the story gains strength in the second half.", es: "Pese a un comienzo lento, la historia gana fuerza en la segunda mitad.", accept: ["[Pese a|A pesar de] un comienzo lento, la historia gana fuerza en la segunda mitad."] },
    { en: "It isn't a perfect novel. The secondary characters are weak and the ending is rushed. Even so, I recommend it.", es: "No es una novela perfecta. Los personajes secundarios se quedan flojos y el final resulta apresurado. Aun así, la recomiendo.", accept: ["No es una novela perfecta. Los personajes secundarios [se quedan|quedan|son] flojos y el final [resulta|es] apresurado. [Aun así|De todos modos|Sin embargo], la recomiendo."] },
    { en: "The present report analyses the viability of moving customer service to a hybrid model.", es: "El presente informe analiza la viabilidad de trasladar el servicio al cliente a un modelo mixto.", accept: ["[El presente informe|Este informe] analiza la viabilidad de [trasladar|pasar] el servicio al cliente a un modelo [mixto|híbrido]."] },
    { en: "A gradual rollout is recommended, starting with a three-month pilot in the Cali office.", es: "Se recomienda una implantación gradual, comenzando por un piloto de tres meses en la oficina de Cali.", accept: ["Se recomienda una implantación gradual, [comenzando|empezando] por un piloto de tres meses en la oficina de Cali."] },
    { en: "I recommend it to readers who enjoy a good mystery set in the Caribbean.", es: "Se la recomiendo a los lectores que disfrutan de una buena intriga ambientada en el Caribe.", accept: ["(Se) la recomiendo a los lectores que disfrutan (de) una buena intriga ambientada en el Caribe."] }
  ],
  register: [
    { es: "¡Léanla, está buenísima!", en: "Read it, it's brilliant!", when: "a message to your friends" },
    { es: "La recomiendo sin reservas.", en: "I recommend it without reservation.", when: "a review for strangers" },
    { es: "La obra destaca por su ritmo narrativo.", en: "The work stands out for its narrative pace.", when: "a review in a magazine or journal" },
    { es: "Se recomienda una implantación gradual.", en: "A gradual rollout is recommended.", when: "the recommendations of a work report" }
  ],
  personal: {
    prompt: "Write a four-sentence review of a book, film or series you know: one line of plot, two of judgment with a reason, and who should see it.",
    constraints: [
      { type: "containsAny", words: ["destaca", "flojo", "floja", "se lee", "resulta", "logra", "falla"], label: "a judgment tied to the work: *destaca por*, *se queda floja*" },
      { type: "containsAny", words: ["pese a", "a pesar de", "aunque", "si bien"], label: "the balance inside a sentence: *pese a...*" },
      { type: "containsAny", words: ["recomiendo", "recomendaría", "ideal para"], label: "who should read or see it" }
    ],
    model: "La serie sigue a una familia de cafeteros en Caldas durante la crisis de los noventa. Destaca por la fotografía y por unos diálogos muy naturales. Pese a un final apresurado, la segunda temporada mejora mucho. La recomiendo sobre todo a los amantes del drama familiar."
  },
  pitfalls: [
    "A review that only retells the plot is a summary: every paragraph needs a judgment.",
    "*Pese a* comes before a thing, *pese a que* before a whole sentence: *pese a un final flojo*, *pese a que el final es flojo*.",
    "*Me gustó mucho* tells the reader about you; *destaca por su ritmo* tells them about the book."
  ]
},

"fn-saludar-c1": {
  source: "old",
  hook: {
    line: "At a wedding in Medellín you run into a classmate you have not seen in ten years, and twenty minutes later the bride's father introduces you to the Minister of Culture. Two greetings, two worlds, and the wrong one in either place would be noticed.",
    es: "¡Juliana! ¡Qué milagro! ¿Qué es de tu vida?\nSeñora ministra, es un placer conocerla.",
    en: "Juliana! Look who it is! What have you been up to?\nMinister, it's a pleasure to meet you."
  },
  examples: [
    { es: "¡Qué milagro verte por aquí! ¿Qué es de tu vida? La última vez fue en el grado.", en: "What a surprise to see you here! What have you been up to? The last time was at graduation." },
    { es: "¡Estás perdidísimo, Andrés! ¿Hace cuánto no nos veíamos? ¿Desde el grado del colegio?", en: "You've completely vanished, Andrés! How long has it been? Since our school graduation?" },
    { es: "Buenas noches, doctor Restrepo. Es un placer saludarlo de nuevo después de tanto tiempo.", en: "Good evening, Dr Restrepo. It's a pleasure to see you again after so long." }
  ],
  rule: "How you greet sets the tone for the whole conversation.\nAfter years apart: *¡Qué milagro!* *¡Cuánto tiempo!* *¿Qué es de tu vida?* asks about everything since, never about today. *¡Estás perdidísimo!* is a warm complaint that they vanished. *¿Hace cuánto no nos veíamos?*\nEveryday, between friends: *¿Quiubo?* *¿Cómo andas?* No full answer is expected.\nFormal, with a title: *señora ministra*, *señor alcalde*, and in Colombia *doctor* or *doctora* plus the surname for lawyers, managers and anyone senior, degree or not.\n*Es un placer conocerla* the first time; *es un placer saludarla* when you have met before.\nWith a title comes *usted*, and *lo* or *la* follows: *saludarlo*, *saludarla*.",
  readAndPick: [
    { q: "When would you say this?", es: "¿Qué es de tu vida?",
      options: ["To a colleague each morning", "After years apart", "To a stranger in a shop"], answer: 1,
      why: "*¿Qué es de tu vida?* asks about everything since you last met." },
    { q: "What is she saying with *¡Estás perdidísimo!*?", es: "¡Estás perdidísimo! Nadie sabe nada de ti.",
      options: ["He got lost on the way there", "He's been out of touch", "He looks very tired"], answer: 1,
      why: "*Estar perdido* is a warm complaint: you vanished from our lives." },
    { q: "Is the man she calls *doctor* a physician?", es: "Buenas tardes, doctor Restrepo.",
      options: ["Not necessarily", "Yes, always", "No, never"], answer: 0,
      why: "In Colombia *doctor* is a courtesy title for lawyers, managers and senior people." },
    { q: "Have they met before?", es: "Señora ministra, es un placer saludarla de nuevo.",
      options: ["No, this is the first time", "We can't tell from this", "Yes, they have"], answer: 2,
      why: "*Saludarla de nuevo*: he has met her before; the first time is *conocerla*." },
    { q: "What answer does *¿Quiubo?* expect?", es: "¿Quiubo, parce? ¿Cómo andas?",
      options: ["A short, easy reply", "A full update on life", "A formal introduction"], answer: 0,
      why: "*¿Quiubo?* is a greeting, not a question: *bien, ¿y tú?* is plenty." }
  ],
  yourTurn: [
    { en: "What a surprise to see you here! (to a friend)", es: "¡Qué milagro verte por aquí!", accept: ["¡Qué milagro verte por [aquí|acá]!"] },
    { en: "What have you been up to all these years?", es: "¿Qué es de tu vida después de tantos años?", accept: ["¿Qué es de tu vida después de tantos años?", "¿Qué [ha sido|es] de tu vida en todos estos años?"] },
    { en: "Minister, it's a pleasure to meet you.", es: "Señora ministra, es un placer conocerla.", accept: ["Señora ministra, es un placer conocerla.", "Señor ministro, es un placer conocerlo."] },
    { en: "How long has it been since we last saw each other?", es: "¿Hace cuánto no nos veíamos?", accept: ["¿Hace cuánto (tiempo) no nos veíamos?"] }
  ],
  translate: [
    { en: "Juliana, it's been so long since I last saw you! What have you been up to since graduation?", es: "¡Juliana, cuánto tiempo sin verte! ¿Qué es de tu vida desde el grado?", accept: ["¡Juliana, cuánto tiempo sin verte! ¿[Qué es de tu vida|Qué has hecho] desde el grado?"] },
    { en: "Good evening, Dr Restrepo. It's a pleasure to see you again after so long.", es: "Buenas noches, doctor Restrepo. Es un placer saludarlo de nuevo después de tanto tiempo.", accept: ["Buenas noches, doctor Restrepo. Es un placer saludarlo [de nuevo|otra vez] después de tanto tiempo."] },
    { en: "You've completely vanished! Nobody has heard from you for months. How have you been?", es: "¡Estás perdidísimo! Nadie sabe nada de ti desde hace meses. ¿Cómo has estado?", accept: ["¡Estás perdidísimo! Nadie sabe nada de ti desde hace meses. ¿Cómo has estado?", "¡Estás perdidísimo! Hace meses que nadie sabe nada de ti. ¿Cómo has estado?"] },
    { en: "Mayor, thank you for receiving us; it is an honour to greet you on behalf of the neighbourhood. (formal)", es: "Señor alcalde, gracias por recibirnos; es un honor saludarlo en nombre del barrio.", accept: ["Señor alcalde, gracias por recibirnos; es un honor saludarlo en nombre del barrio.", "Señora alcaldesa, gracias por recibirnos; es un honor saludarla en nombre del barrio."] },
    { en: "Hey, mate, what's up? How are you doing? I heard you've already started the new job. (Colombia)", es: "¿Quiubo, parce? ¿Cómo andas? Me contaron que ya empezaste en el trabajo nuevo.", accept: ["¿Quiubo, parce? ¿Cómo [andas|vas]? Me contaron que ya empezaste en el [trabajo nuevo|nuevo trabajo]."] },
    { en: "Good morning, Dr Gómez. We met at the conference in Cartagena; it's a pleasure to see you again.", es: "Buenos días, doctora Gómez. Nos conocimos en el congreso de Cartagena; es un placer saludarla otra vez.", accept: ["Buenos días, doctora Gómez. Nos conocimos en el congreso de Cartagena; es un placer saludarla [otra vez|de nuevo]."] }
  ],
  register: [
    { es: "¿Quiubo?", en: "What's up?", when: "in Colombia, with friends, very casual" },
    { es: "¡Qué milagro!", en: "Look who it is!", when: "seeing someone you haven't seen in ages" },
    { es: "Buenas tardes, doctora.", en: "Good afternoon, ma'am.", when: "in Colombia, to anyone senior or official" },
    { es: "Señora ministra, es un honor saludarla.", en: "Minister, it is an honour to greet you.", when: "at a formal event, with a public official" }
  ],
  personal: {
    prompt: "At a party you meet an old friend and, a minute later, someone very senior. Write one greeting for each.",
    constraints: [
      { type: "containsAny", words: ["qué milagro", "cuánto tiempo", "qué es de tu vida", "perdid", "hace cuánto"], label: "the reunion: *¡qué milagro!*, *¿qué es de tu vida?*" },
      { type: "regex", pattern: "(señor|señora|doctor|doctora)\\s+[a-záéíóúñ]+", label: "a title: *señora ministra*, *doctor* plus the surname" },
      { type: "containsAny", words: ["saludarlo", "saludarla", "conocerlo", "conocerla"], label: "*saludarlo* or *conocerla*, with usted" }
    ],
    model: "¡Felipe, qué milagro! ¿Qué es de tu vida? Doctora Ramírez, buenas noches, es un placer saludarla de nuevo."
  },
  pitfalls: [
    "*¿Qué es de tu vida?* to someone you saw last week sounds odd: it is for long absences.",
    "*Es un placer saludarle* is Spain's: in Latin America, *saludarlo* or *saludarla*.",
    "*¿Qué pasa, tío?* is Spain's street greeting: in Colombia, *¿quiubo, parce?*"
  ]
},

"fn-felicitar-despedirse-c1": {
  source: "old",
  hook: {
    line: "Daniela, who sat next to you for six years, has been promoted and moves to the Lima office on Friday. Today you congratulate her, on Friday you say goodbye, and on Monday you write to the Lima director about her handover. Three rituals, three registers.",
    es: "¡Felicitaciones, Dani! Te lo mereces más que nadie.\nSeguimos en contacto, ya sabes dónde encontrarme.\nSin otro particular, me despido atentamente.",
    en: "Congratulations, Dani! You deserve it more than anyone.\nLet's stay in touch, you know where to find me.\nWith nothing further to add, I remain yours sincerely."
  },
  examples: [
    { es: "¡Felicitaciones por el ascenso! Te lo mereces más que nadie después de seis años aguantándonos.", en: "Congratulations on the promotion! You deserve it more than anyone after six years of putting up with us." },
    { es: "No sé si nos volveremos a ver pronto, pero ha sido un placer trabajar contigo todos estos años.", en: "I don't know if we'll see each other again soon, but it's been a pleasure working with you all these years." },
    { es: "Sin otro particular, aprovecho la ocasión para enviarle un cordial saludo y quedo atenta a su respuesta.", en: "With nothing further to add, I take this opportunity to send you my kind regards, and I look forward to your reply." }
  ],
  rule: "Congratulating and saying goodbye each run from a hug to a letterhead.\nCongratulating: *¡Felicitaciones!* or *¡Felicidades!*, then the reason: *por el ascenso*. *Te lo mereces* makes it personal. Birthdays: *¡Que cumplas muchos más!* The season: *Felices fiestas y próspero año nuevo.*\nA goodbye that keeps the door open: *Seguimos en contacto.* *Nos estamos hablando*, very Colombian. *Ya sabes dónde encontrarme.*\nA goodbye with no promise: *No sé si nos volveremos a ver, pero ha sido un placer...*\nIn writing only: *Sin otro particular, me despido atentamente.* In Colombia, *Cordialmente* closes most work emails. Never say these aloud.",
  readAndPick: [
    { q: "Where would you see this line?", es: "Sin otro particular, me despido atentamente.",
      options: ["At the end of a letter", "At a farewell party at the office", "On a birthday card"], answer: 0,
      why: "*Sin otro particular* belongs to formal writing only, never to speech." },
    { q: "What does *nos estamos hablando* promise?", es: "Bueno, Dani, nos estamos hablando.",
      options: ["A phone call later tonight", "A loose keep in touch", "A meeting tomorrow"], answer: 1,
      why: "In Colombia *nos estamos hablando* is a warm, open goodbye with no date." },
    { q: "When would you say this?", es: "¡Que cumplas muchos más!",
      options: ["At a funeral", "On New Year's Eve", "On someone's birthday"], answer: 2,
      why: "*Que cumplas muchos más* wishes many more birthdays." },
    { q: "What is she unsure of?", es: "No sé si nos volveremos a ver, pero ha sido un placer.",
      options: ["Whether they'll meet again", "Whether she enjoyed the time", "Whether he's really leaving"], answer: 0,
      why: "The goodbye admits the next meeting is uncertain, and values the time anyway." },
    { q: "What makes this congratulation personal?", es: "¡Felicitaciones por el ascenso! Te lo mereces.",
      options: ["Naming the promotion itself", "Saying she deserves it", "The exclamation marks"], answer: 1,
      why: "*Te lo mereces* turns a formula into something said to her." }
  ],
  yourTurn: [
    { en: "Congratulations on the promotion! You deserve it.", es: "¡Felicitaciones por el ascenso! Te lo mereces.", accept: ["¡[Felicitaciones|Felicidades] por el ascenso! Te lo mereces."] },
    { en: "Let's stay in touch; you know where to find me.", es: "Seguimos en contacto; ya sabes dónde encontrarme.", accept: ["[Seguimos|Sigamos|Estamos] en contacto; ya sabes dónde encontrarme."] },
    { en: "Many happy returns! (birthday)", es: "¡Que cumplas muchos más!", accept: [] },
    { en: "Happy holidays and a prosperous New Year.", es: "Felices fiestas y próspero año nuevo.", accept: ["Felices fiestas y (un) próspero año nuevo."] }
  ],
  translate: [
    { en: "Congratulations on your daughter's graduation! You must be very proud of her. (to a woman)", es: "¡Felicitaciones por el grado de tu hija! Debes estar muy orgullosa de ella.", accept: ["¡[Felicitaciones|Felicidades] por el grado de tu hija! Debes (de) estar muy orgullosa de ella."] },
    { en: "I don't know if we'll see each other again, but it has been a real pleasure working with you.", es: "No sé si nos volveremos a ver, pero ha sido un verdadero placer trabajar contigo.", accept: ["No sé si nos volveremos a ver, pero ha sido un [verdadero|auténtico] placer trabajar contigo."] },
    { en: "Well, Dani, I'm off now. We'll be in touch, and send me photos of Lima.", es: "Bueno, Dani, ya me voy. Nos estamos hablando, y mándame fotos de Lima.", accept: ["Bueno, Dani, ya me voy. Nos estamos hablando, y [mándame|envíame] fotos de Lima."] },
    { en: "With nothing further to add, I take this opportunity to send you my very kind regards. (formal letter)", es: "Sin otro particular, aprovecho la ocasión para enviarle un saludo muy cordial.", accept: ["Sin otro particular, aprovecho la [ocasión|oportunidad] para [enviarle|mandarle] un saludo muy cordial.", "Sin otro particular, aprovecho la [ocasión|oportunidad] para [enviarle|mandarle] un muy cordial saludo."] },
    { en: "It has been a true pleasure sharing these three days with all of you. (closing a speech)", es: "Ha sido un verdadero placer compartir estos tres días con todos ustedes.", accept: ["Ha sido un [verdadero|auténtico] placer compartir estos tres días con todos ustedes."] },
    { en: "Happy holidays and a prosperous New Year to you and all your family. (card to a client)", es: "Felices fiestas y próspero año nuevo para usted y toda su familia.", accept: ["Felices fiestas y (un) próspero año nuevo para usted y (para) toda su familia."] }
  ],
  register: [
    { es: "¡Qué nota, felicitaciones!", en: "How great, congratulations!", when: "in Colombia, with friends" },
    { es: "¡Felicitaciones! Te lo mereces.", en: "Congratulations! You deserve it.", when: "to a friend or colleague, warm" },
    { es: "Nos estamos hablando.", en: "We'll be in touch.", when: "in Colombia, a warm goodbye with no date" },
    { es: "Le reitero mis felicitaciones por el nombramiento.", en: "Once again, my congratulations on your appointment.", when: "a formal letter to someone senior" },
    { es: "Atentamente,", en: "Yours sincerely,", when: "closing a formal letter" }
  ],
  personal: {
    prompt: "A friend is moving to another city for a new job. Write the congratulation and the goodbye, then the last line of a formal email to their new boss.",
    constraints: [
      { type: "containsAny", words: ["felicitaciones", "felicidades", "te lo mereces"], label: "the congratulation: *¡felicitaciones!*, *te lo mereces*" },
      { type: "containsAny", words: ["seguimos en contacto", "nos estamos hablando", "sigamos en contacto", "dónde encontrarme", "ha sido un placer"], label: "the goodbye: *seguimos en contacto*, *nos estamos hablando*" },
      { type: "containsAny", words: ["atentamente", "cordialmente", "sin otro particular"], label: "the written close: *atentamente*, *cordialmente*" }
    ],
    model: "¡Felicitaciones, Camilo, te lo mereces! Nos estamos hablando, y ya sabes dónde encontrarme. Para el correo: Sin otro particular, me despido atentamente."
  },
  pitfalls: [
    "*Sin otro particular* aloud at a party sounds like someone reading a letter.",
    "*Enhorabuena* is Spain's: in Colombia, *felicitaciones* or *felicidades*.",
    "*Felicidades* also works for birthdays; for an achievement, *felicitaciones* is the safer choice."
  ]
},

"fn-responder-saludo-dirigirse-c1": {
  source: "merged",
  hook: {
    line: "In the departures hall at El Dorado airport, a woman waves at you with a huge smile. She knows you; you are not sure you know her. You need to check who she is without hurting her, and then answer her questions without telling her your whole life.",
    es: "Perdona, tú eres Marcela, ¿cierto?\n¡Sí! ¿Te acuerdas de mí? Estudiamos juntas en la Nacional.\n¡Claro! Recuerdo perfectamente tu risa.",
    en: "Sorry, you're Marcela, aren't you?\nYes! Do you remember me? We studied together at the Nacional.\nOf course! I remember your laugh perfectly."
  },
  examples: [
    { es: "Perdona, tú eres Marcela, ¿cierto? Creo que nos conocimos en el matrimonio de Ana en Cali.", en: "Sorry, you're Marcela, aren't you? I think we met at Ana's wedding in Cali." },
    { es: "Me acuerdo perfectamente de esa tarde: llovía tanto que nos quedamos encerradas en la biblioteca.", en: "I remember that afternoon perfectly: it rained so hard that we got stuck in the library." },
    { es: "¿Cómo me ha ido? No me puedo quejar, la verdad: tengo buen trabajo y la familia está bien.", en: "How have I been? Can't complain, honestly: I've got a good job and the family is well." }
  ],
  rule: "Two small rituals: answering *¿cómo estás?* and getting a name right.\nAnswers on a scale: *Bien, gracias a Dios.* *No me puedo quejar*, quietly content. *Ahí vamos*, getting by. *¿Para qué te cuento?* warns of a long, sad story; ask more only if you want it.\nNot sure who someone is: *Perdona, tú eres Marcela, ¿cierto?* They may not remember you: *¿Te acuerdas de mí?* Then the clue: *Nos conocimos en...*\nTwo verbs for remember: *recordar algo*, or *acordarse de algo*, always with *me, te, se* and *de*. Never mix them.\nTerms of affection, *mi amor*, *mi vida*, *mija*, are for family and people very close.",
  readAndPick: [
    { q: "How are things for her?", es: "¿Cómo estás? No me puedo quejar.",
      options: ["Quietly good", "Very bad", "Wonderful"], answer: 0,
      why: "*No me puedo quejar*: content, without boasting." },
    { q: "What is he warning her?", es: "¿Cómo me ha ido? ¿Para qué te cuento?",
      options: ["That all is fine", "That he forgot her", "That it's a sad story"], answer: 2,
      why: "*¿Para qué te cuento?* warns that the news is bad, and waits to be asked." },
    { q: "Which answer is correct?", es: "¿Te acuerdas de Marcela?",
      options: ["Sí, la recuerdo de ella.", "Sí, me acuerdo de ella.", "Sí, me acuerdo a ella."], answer: 1,
      why: "*Acordarse* takes *me* and *de*; *recordar* takes neither: *la recuerdo*." },
    { q: "Who would she call *mija*?", es: "Mija, ¿ya comiste?",
      options: ["Her daughter", "Her boss", "The bank manager"], answer: 0,
      why: "*Mija*, from *mi hija*, is for daughters and people very close." },
    { q: "Why does he mention the wedding?", es: "¿Te acuerdas de mí? Nos conocimos en el matrimonio de Ana.",
      options: ["To invite her to it", "To change the subject", "To give her a clue"], answer: 2,
      why: "After *¿te acuerdas de mí?*, a clue saves the other person from embarrassment." }
  ],
  yourTurn: [
    { en: "Sorry, you're Marcela, aren't you?", es: "Perdona, tú eres Marcela, ¿cierto?", accept: ["[Perdona|Perdón|Disculpa], tú eres Marcela, ¿[cierto|no|verdad]?"] },
    { en: "Do you remember me? We met at Ana's wedding.", es: "¿Te acuerdas de mí? Nos conocimos en el matrimonio de Ana.", accept: ["¿[Te acuerdas de mí|Me recuerdas]? Nos conocimos en el [matrimonio|casamiento] de Ana."] },
    { en: "Can't complain, honestly.", es: "No me puedo quejar, la verdad.", accept: ["[No me puedo quejar|No puedo quejarme], la verdad."] },
    { en: "I remember your laugh perfectly.", es: "Recuerdo perfectamente tu risa.", accept: ["Recuerdo perfectamente tu risa.", "Me acuerdo perfectamente de tu risa.", "Recuerdo tu risa perfectamente."] }
  ],
  translate: [
    { en: "Did you remember to bring the photos from the trip to Santa Marta? Marcela wants to see them.", es: "¿Te acordaste de traer las fotos del viaje a Santa Marta? Marcela quiere verlas.", accept: [] },
    { en: "How have I been? Can't complain: a good job, a quiet neighbourhood and the family well.", es: "¿Cómo me ha ido? No me puedo quejar: buen trabajo, un barrio tranquilo y la familia bien.", accept: ["¿Cómo me ha ido? [No me puedo quejar|No puedo quejarme]: buen trabajo, un barrio tranquilo y la familia bien."] },
    { en: "Sorry, you're Andrés's brother, aren't you? We met at his birthday, at the farm.", es: "Perdona, tú eres el hermano de Andrés, ¿cierto? Nos conocimos en su cumpleaños, en la finca.", accept: ["[Perdona|Perdón|Disculpa], tú eres el hermano de Andrés, ¿[cierto|no|verdad]? Nos conocimos en su cumpleaños, en la finca."] },
    { en: "How's it going? Well, don't even ask: it's been a hard year with my dad's illness.", es: "¿Cómo te va? Bueno, ¿para qué te cuento? Ha sido un año duro con la enfermedad de mi papá.", accept: ["¿Cómo te va? Bueno, ¿para qué te cuento? [Ha sido|Fue] un año [duro|difícil] con la enfermedad de mi [papá|padre]."] },
    { en: "Honey, have you seen the remote? It was on the sofa a minute ago.", es: "Mi amor, ¿has visto el control? Hace un momento estaba en el sofá.", accept: ["Mi amor, ¿[has visto|viste] el control (de la tele)? Hace un momento estaba en el [sofá|sillón]."] },
    { en: "I don't remember what she's called, but I remember her face perfectly.", es: "No recuerdo cómo se llama, pero me acuerdo perfectamente de su cara.", accept: ["No [recuerdo|me acuerdo de] cómo se llama, pero [me acuerdo perfectamente de su cara|recuerdo perfectamente su cara]."] }
  ],
  register: [
    { es: "Bien, gracias a Dios.", en: "Fine, thank God.", when: "to anyone, the everyday warm answer" },
    { es: "No me puedo quejar.", en: "Can't complain.", when: "to friends or colleagues, quietly content" },
    { es: "¿Para qué te cuento?", en: "Don't even ask.", when: "to a friend, when you want them to ask more" },
    { es: "Muy bien, gracias, doctora. ¿Y usted?", en: "Very well, thank you, ma'am. And you?", when: "to someone senior or older" }
  ],
  personal: {
    prompt: "Someone greets you warmly in the street and you are not sure who they are. Write the check, their clue, and your answer to how you have been.",
    constraints: [
      { type: "regex", pattern: "tú eres|usted es", label: "check who they are: *tú eres..., ¿cierto?*" },
      { type: "containsAny", words: ["te acuerdas", "se acuerda", "me recuerdas", "me recuerda", "nos conocimos"], label: "the clue: *¿te acuerdas de mí?*, *nos conocimos en...*" },
      { type: "containsAny", words: ["no me puedo quejar", "gracias a dios", "ahí vamos", "para qué te cuento"], label: "the answer on the scale: *no me puedo quejar*" }
    ],
    model: "Perdona, tú eres Carlos, ¿cierto? ¡Claro! ¿Te acuerdas de mí? Nos conocimos en la clase de salsa. ¿Y cómo has estado? No me puedo quejar, la verdad."
  },
  pitfalls: [
    "*Recuerdo de su cara* and *me acuerdo su cara* are both slips: *recuerdo su cara* or *me acuerdo de su cara*.",
    "*Seguimos tirando* is Spain's answer; in Colombia *tirar* is slang for sex, so say *ahí vamos*.",
    "*Guapa* and *cariño* as terms of address sound like Spain; in Colombia, *mi amor*, *mi vida*, *mija*."
  ]
},

"gn-generos-orales-c1": {
  source: "old",
  hook: {
    line: "In the monthly project committee, the chair is about to close the point on the schedule. You think three weeks is too tight, and in this room you cannot just say so: you ask for the floor, give a reason, and propose something concrete.",
    es: "Antes de pasar al siguiente punto, ¿alguien quiere añadir algo?\nSí, si me permite. Propondría ampliar el plazo a cuatro semanas.\n¿Alguna objeción? Ninguna por mi parte, me parece razonable.",
    en: "Before we move on to the next item, does anyone want to add anything?\nYes, if I may. I would propose extending the deadline to four weeks.\nAny objections? None from me, it seems reasonable."
  },
  examples: [
    { es: "Propondría ampliar el plazo a cuatro semanas, dado el volumen de revisiones que tenemos pendientes.", en: "I would propose extending the deadline to four weeks, given the volume of revisions we have pending." },
    { es: "Si me permite, quisiera retomar lo que decía la doctora Ortiz sobre el presupuesto del segundo semestre.", en: "If I may, I'd like to come back to what Dr Ortiz was saying about the budget for the second half of the year." },
    { es: "El debate giró en torno a si la medida beneficiaba realmente a la mayoría de los usuarios.", en: "The debate revolved around whether the measure really benefited the majority of users." }
  ],
  rule: "A formal meeting has a script, and following it is what gets you heard.\nTake the floor: *Si me permite...* *Quisiera añadir algo sobre...* *Pido la palabra.*\nLink to what was said: *Retomando lo que decía la doctora Ortiz...*\nPropose softly, in the conditional: *Propondría ampliar el plazo.* *Sugeriría revisar...*\nGive the reason as a phrase: *dado el volumen de revisiones*, *teniendo en cuenta que dos personas estarán de vacaciones*.\nConcede inside the sentence: *Aun reconociendo el esfuerzo del equipo, el plazo es ajustado.*\nClose the point: *¿Alguna objeción?* *Ninguna por mi parte.*\nA long lecture you only need to follow; a meeting you must take part in.",
  readAndPick: [
    { q: "What is she doing?", es: "Si me permite, quisiera añadir algo sobre el calendario.",
      options: ["Taking the floor", "Closing the meeting", "Leaving the room"], answer: 0,
      why: "*Si me permite* asks for the floor before speaking." },
    { q: "Why the conditional *propondría*?", es: "Propondría ampliar el plazo a cuatro semanas.",
      options: ["It's a firm demand on the chair", "It's a polite proposal", "It's about the past"], answer: 1,
      why: "The conditional proposes without imposing, which is what a committee expects." },
    { q: "What does *dado el volumen de* give?", es: "Dado el volumen de revisiones pendientes, el plazo es ajustado.",
      options: ["A deadline date", "A person's name", "A reason"], answer: 2,
      why: "*Dado* plus a thing gives the reason in a phrase, without a *porque*." },
    { q: "What does he concede?", es: "Aun reconociendo el esfuerzo del equipo, el plazo es demasiado ajustado.",
      options: ["The team has worked hard", "The deadline is perfectly fine", "The team has failed"], answer: 0,
      why: "*Aun reconociendo* grants the effort inside the sentence before the objection." },
    { q: "What did the debate centre on?", es: "El debate giró en torno a la seguridad del barrio.",
      options: ["A walk around the block", "Safety in the area", "The annual budget"], answer: 1,
      why: "*Girar en torno a*: to revolve around a topic." }
  ],
  yourTurn: [
    { en: "If I may, I'd like to add something.", es: "Si me permite, quisiera añadir algo.", accept: ["Si me [permite|permiten], quisiera [añadir|agregar] algo."] },
    { en: "I would propose extending the deadline.", es: "Propondría ampliar el plazo.", accept: ["[Propondría|Sugeriría] ampliar el plazo."] },
    { en: "Any objections? None from me.", es: "¿Alguna objeción? Ninguna por mi parte.", accept: [] },
    { en: "The debate revolved around the budget.", es: "El debate giró en torno al presupuesto.", accept: [] }
  ],
  translate: [
    { en: "I would propose extending the deadline to four weeks, given the number of pending revisions.", es: "Propondría ampliar el plazo a cuatro semanas, dado el número de revisiones pendientes.", accept: ["[Propondría|Sugeriría] ampliar el plazo a cuatro semanas, dado el [número|volumen] de revisiones pendientes."] },
    { en: "If I may, I'd like to come back to what Dr Ortiz was saying about the budget.", es: "Si me permite, quisiera retomar lo que decía la doctora Ortiz sobre el presupuesto.", accept: ["Si me [permite|permiten], quisiera retomar lo que [decía|dijo] la doctora Ortiz sobre el presupuesto."] },
    { en: "Before we move on to the next item, does anyone want to add anything? If not, we'll close the point on the schedule.", es: "Antes de pasar al siguiente punto, ¿alguien quiere añadir algo? Si no, cerramos el punto del calendario.", accept: ["Antes de pasar al siguiente punto, ¿alguien quiere [añadir|agregar] algo? Si no, [cerramos|damos por cerrado] el punto del calendario."] },
    { en: "While recognising the team's effort, the deadline is too tight for a project of this size.", es: "Aun reconociendo el esfuerzo del equipo, el plazo es demasiado ajustado para un proyecto de este tamaño.", accept: ["Aun reconociendo el esfuerzo del equipo, el plazo es demasiado ajustado para un proyecto de este [tamaño|alcance]."] },
    { en: "Taking into account that two members will be on holiday, four weeks seems more realistic to me.", es: "Teniendo en cuenta que dos miembros estarán de vacaciones, cuatro semanas me parece más realista.", accept: ["Teniendo en cuenta que dos [miembros|personas del equipo] estarán de vacaciones, cuatro semanas me [parece más realista|parecen más realistas]."] },
    { en: "The debate revolved around whether the new rule really benefited the residents.", es: "El debate giró en torno a si la nueva norma beneficiaba realmente a los residentes.", accept: ["El debate giró en torno a si la [nueva norma|norma nueva] [beneficiaba realmente|realmente beneficiaba] a los residentes."] }
  ],
  register: [
    { es: "Oigan, una cosita.", en: "Hey, one little thing.", when: "a meeting among close colleagues" },
    { es: "Si me permiten, quisiera añadir algo.", en: "If I may, I'd like to add something.", when: "a formal meeting, to take the floor" },
    { es: "Pido la palabra.", en: "I ask for the floor.", when: "a very formal assembly or council" },
    { es: "Ninguna objeción por mi parte.", en: "No objection from me.", when: "closing a point in a formal meeting" }
  ],
  personal: {
    prompt: "In a formal meeting about something you know well, take the floor, give a reason, and propose one concrete change.",
    constraints: [
      { type: "containsAny", words: ["si me permite", "si me permiten", "quisiera añadir", "quisiera agregar", "pido la palabra"], label: "take the floor: *si me permite*, *quisiera añadir*" },
      { type: "containsAny", words: ["propondría", "sugeriría", "plantearía"], label: "propose in the conditional: *propondría*" },
      { type: "containsAny", words: ["dado", "teniendo en cuenta", "en vista de"], label: "the reason as a phrase: *dado...*, *teniendo en cuenta que...*" }
    ],
    model: "Si me permiten, quisiera añadir algo sobre el horario. Dado el número de quejas de los padres, propondría abrir la biblioteca hasta las seis."
  },
  pitfalls: [
    "*Propongo ampliar el plazo* is correct, but in a committee it sounds like an order: *propondría*.",
    "Opening your turn with *yo pienso que...* sounds like a classroom: take the floor first.",
    "*Ninguna por mi parte* closes a point politely; a bare *no tengo nada* sounds blunt in that room."
  ]
},

"fn-pedir-informacion-c1": {
  source: "merged",
  hook: {
    line: "It is your first week at a new office in Bogotá. You need to know where things are, why nobody told you about a meeting, and why your colleague looks so annoyed, and you would like to ask your boss something delicate. Each question has a softer and a sharper shape.",
    es: "¿Tienes idea de si hay una droguería por aquí?\n¿Cómo es que nadie me avisó de la reunión?\n¿Puedo hacerle una pregunta un poco personal?",
    en: "Do you have any idea whether there's a pharmacy around here?\nHow come nobody told me about the meeting?\nMay I ask you a slightly personal question?"
  },
  examples: [
    { es: "¿Tienes idea de si la cafetería del tercer piso abre los sábados o solo entre semana?", en: "Do you have any idea whether the cafeteria on the third floor opens on Saturdays or only on weekdays?" },
    { es: "¿Cómo es que nadie me avisó de la reunión si estoy en la lista de correos?", en: "How come nobody told me about the meeting if I'm on the mailing list?" },
    { es: "¿A qué se debe el cambio de horario? Nos lo anunciaron sin ninguna explicación el viernes.", en: "What is the reason for the change of hours? They announced it on Friday without any explanation." }
  ],
  rule: "Asking for information has softer and sharper shapes.\nSoft and indirect: *¿Tienes idea de si...?* *¿Me dice a qué hora...?* After *si*, *dónde* or *a qué hora*, keep the order of a statement: *¿Sabe dónde queda la notaría?*\nPrecise: *¿Qué es lo que...?* *¿Cuál de los que...?*\nThe reason, neutral: *¿A qué se debe...?* With a reproach: *¿A qué viene esa cara?*\nSurprise: *¿Cómo es que...?* plus a plain verb: how come. Formal: *¿Cómo se explica que...?* plus the subjunctive.\nBefore something delicate, ask to ask: *¿Puedo hacerte una pregunta?* *¿Me permite un comentario?*\nOffer the other road: *¿...o, por el contrario, ...?*",
  readAndPick: [
    { q: "What does she want to know?", es: "¿Cómo es que no viniste el sábado?",
      options: ["Why he didn't come", "How he got there that day", "When he'll come"], answer: 0,
      why: "*¿Cómo es que...?* is how come: surprise, and a request for the reason." },
    { q: "How does this question sound?", es: "¿A qué viene esa cara larga?",
      options: ["Neutral and perfectly calm", "Slightly reproachful", "Very formal"], answer: 1,
      why: "*¿A qué viene...?* asks the reason with a touch of reproach." },
    { q: "The flight is three hours late. Which is the calm, polite question?", es: "El vuelo sale tres horas tarde.",
      options: ["¿A qué viene el retraso?", "¿A qué se debe el retraso?", "¿Y ese retraso tan largo?"], answer: 1,
      why: "*¿A qué se debe...?* asks the cause calmly, with no reproach." },
    { q: "What is he doing before asking?", es: "¿Puedo hacerte una pregunta un poco personal?",
      options: ["Refusing to answer", "Ending the talk", "Asking leave to ask"], answer: 2,
      why: "Before a delicate question, Spanish asks permission to ask it." },
    { q: "What does the speaker find hard to explain?", es: "¿Cómo se explica que nadie avisara a tiempo?",
      options: ["Why nobody warned them", "How to warn people in time", "Who will warn them"], answer: 0,
      why: "*¿Cómo se explica que...?* formally asks why something hard to justify happened." }
  ],
  yourTurn: [
    { en: "Do you have any idea whether the bank opens on Saturdays?", es: "¿Tienes idea de si el banco abre los sábados?", accept: ["¿Tienes idea de si [el banco abre|abre el banco] los sábados?"] },
    { en: "How come you didn't come on Saturday?", es: "¿Cómo es que no viniste el sábado?", accept: [] },
    { en: "What's the reason for the delay? (polite)", es: "¿A qué se debe el retraso?", accept: ["¿A qué se debe [el retraso|la demora]?"] },
    { en: "Can I ask you a question? (to a friend)", es: "¿Puedo hacerte una pregunta?", accept: ["¿[Puedo hacerte|Te puedo hacer] una pregunta?"] }
  ],
  translate: [
    { en: "Could you tell me, please, what time the notary's office closes on Friday afternoons? (to a stranger)", es: "¿Me dice, por favor, a qué hora cierra la notaría los viernes por la tarde?", accept: ["¿Me [dice|podría decir], por favor, a qué hora cierra la notaría los viernes por la tarde?"] },
    { en: "How come nobody told me about the meeting if I'm on the list?", es: "¿Cómo es que nadie me avisó de la reunión si estoy en la lista?", accept: ["¿Cómo es que nadie me [avisó de|dijo nada de] la reunión si estoy en la lista?"] },
    { en: "What's with that long face? Did something happen with your boss this morning?", es: "¿A qué viene esa cara larga? ¿Pasó algo con tu jefe esta mañana?", accept: ["¿A qué viene esa cara larga? ¿(Te) pasó algo con tu [jefe|jefa] esta mañana?"] },
    { en: "How can it be explained that the company made so much money in so little time? (formal)", es: "¿Cómo se explica que la empresa ganara tanto dinero en tan poco tiempo?", accept: ["¿Cómo se explica que la empresa [ganara|haya ganado] tanto dinero en tan poco tiempo?"] },
    { en: "Should I change the criteria or, on the contrary, carry on along the same lines?", es: "¿Debo cambiar los criterios o, por el contrario, seguir en la misma línea?", accept: ["¿Debo [cambiar|modificar] los criterios o, por el contrario, seguir en la misma línea?"] },
    { en: "May I give you some advice? Don't sign anything until a lawyer has read it. (polite)", es: "¿Me permite darle un consejo? No firme nada hasta que lo lea un abogado.", accept: ["¿Me permite [darle un consejo|un consejo]? No firme nada hasta que [lo lea un abogado|un abogado lo lea|lo haya leído un abogado]."] }
  ],
  register: [
    { es: "¿Qué es lo que pasa?", en: "What exactly is going on?", when: "with someone you know, a little impatient" },
    { es: "¿Tienes idea de dónde queda?", en: "Do you have any idea where it is?", when: "with a colleague or friend, softly" },
    { es: "¿Me podría indicar dónde queda la notaría?", en: "Could you tell me where the notary's office is?", when: "to a stranger or at an office counter" },
    { es: "¿A qué se debe el cambio de horario?", en: "What is the reason for the change of hours?", when: "at work or in a formal email, neutral" }
  ],
  personal: {
    prompt: "Something strange is going on at your work or school. Write three questions: one soft and indirect, one that shows surprise, and one delicate question you ask permission for first.",
    constraints: [
      { type: "containsAny", words: ["tienes idea de", "tiene idea de", "sabes si", "sabe si", "me dice"], label: "soft and indirect: *¿tienes idea de si...?*" },
      { type: "containsAny", words: ["cómo es que", "a qué viene", "cómo se explica"], label: "surprise: *¿cómo es que...?*" },
      { type: "containsAny", words: ["puedo hacerte", "puedo hacerle", "te puedo hacer", "le puedo hacer", "me permites", "me permite"], label: "permission first: *¿puedo hacerte una pregunta?*" }
    ],
    model: "¿Tienes idea de si el jefe viene hoy? ¿Cómo es que nadie sabe nada del proyecto nuevo? ¿Puedo hacerte una pregunta un poco personal? ¿Piensas renunciar?"
  },
  pitfalls: [
    "*¿Tienes idea de dónde está el banco?* keeps the order of a statement inside: no second *¿*.",
    "*¿A qué viene...?* to a stranger sounds like a reproach: use *¿a qué se debe...?*",
    "*¿Cómo es que* takes a plain verb; *¿cómo se explica que* takes the subjunctive."
  ]
},

"fn-dar-informacion-c1": {
  source: "merged",
  hook: {
    line: "Your sister is staying at your apartment while you are away, and you are giving her instructions on the phone. Then she says your partner never lifts a finger, and you cannot let that pass.",
    es: "Parquea donde encuentres espacio y trae lo que quieras.\n¿Cómo que Julián no hace nada? ¡Si es el que cocina todos los días!\nUna cosa es que sea desordenado y otra muy distinta que no haga nada.",
    en: "Park wherever you find a space and bring whatever you like.\nWhat do you mean, Julián does nothing? He's the one who cooks every day!\nIt's one thing for him to be messy and quite another for him to do nothing."
  },
  examples: [
    { es: "Parquea donde encuentres espacio y sube con lo que quieras, que la nevera está vacía.", en: "Park wherever you find a space and come up with whatever you like, because the fridge is empty." },
    { es: "Una cosa es que llegue tarde y otra muy distinta que no avise a nadie del equipo.", en: "It's one thing for him to arrive late and quite another for him not to tell anyone on the team." },
    { es: "Le escribí con idea de que se lo pensara mejor, pero ni siquiera me contestó el mensaje.", en: "I wrote to him with the idea that he'd think it over, but he didn't even answer the message." }
  ],
  rule: "Giving information precisely, and correcting it when someone gets it wrong.\nA place, time or way not yet known: *donde*, *cuando*, *como* or *lo que* plus the subjunctive: *Parquea donde encuentres espacio.* *Trae lo que quieras.* When it is known, the plain verb: *Parqueo donde siempre.*\nPurpose: *con idea de que* plus the subjunctive: *con idea de que se lo pensara*.\nCause, with a feeling: *a causa de* is neutral, *gracias a* good, *por culpa de* bad.\nCorrecting: repeat their words with *¿Cómo que...?* and give the fact with *si*: *¡Si es el que cocina!*\nSeparating two claims: *Una cosa es que sea desordenado y otra muy distinta que no haga nada*, subjunctive in both halves.",
  readAndPick: [
    { q: "Does he know where she'll park?", es: "Parquea donde encuentres espacio.",
      options: ["Yes, in his own usual space", "No, wherever she finds one", "Yes, at the corner"], answer: 1,
      why: "*Donde* plus the subjunctive: a place nobody knows yet." },
    { q: "What is she separating?", es: "Una cosa es que sea desordenado y otra que no haga nada.",
      options: ["Being messy from doing nothing", "Messy rooms from the tidy ones nearby", "Cooking from cleaning"], answer: 0,
      why: "*Una cosa es que... y otra...* splits what is fair from what is not." },
    { q: "How does she see the cause?", es: "Perdimos el vuelo por culpa del trancón.",
      options: ["As a good thing", "As neutral", "As a bad thing"], answer: 2,
      why: "*Por culpa de* marks a cause as bad; *gracias a*, as good." },
    { q: "What is *si* doing here?", es: "¿Cómo que no hace nada? ¡Si es el que cocina!",
      options: ["Asking if he cooks", "Giving the fact against it", "Setting a condition for the future"], answer: 1,
      why: "This *si* is not if: it brings the fact that contradicts what was said." },
    { q: "Why did he write?", es: "Le escribí con idea de que se lo pensara mejor.",
      options: ["So she would think again", "Because she asked him to", "To end things for good"], answer: 0,
      why: "*Con idea de que* gives the purpose, with the subjunctive." },
    { q: "Is the place known here?", es: "Siempre parqueo donde me dice el portero.",
      options: ["No, any space at all", "No, he never parks", "Yes, the usual spot"], answer: 2,
      why: "A known place takes the plain verb: *donde me dice*." }
  ],
  yourTurn: [
    { en: "Park wherever you find a space.", es: "Parquea donde encuentres espacio.", accept: ["[Parquea|Estaciona] donde encuentres [espacio|un espacio|lugar|un lugar|puesto|un puesto]."] },
    { en: "Bring whatever you like.", es: "Trae lo que quieras.", accept: [] },
    { en: "What do you mean, he does nothing? He's the one who cooks!", es: "¿Cómo que no hace nada? ¡Si es el que cocina!", accept: ["¿Cómo que no hace nada? ¡Si (él) es el que cocina!"] },
    { en: "It's one thing to be late and quite another not to call.", es: "Una cosa es llegar tarde y otra muy distinta no llamar.", accept: ["Una cosa es llegar tarde y otra (muy) [distinta|diferente] (es) no [llamar|avisar]."] }
  ],
  translate: [
    { en: "When you get to the apartment, leave the keys wherever you like and call me when you can.", es: "Cuando llegues al apartamento, deja las llaves donde quieras y llámame cuando puedas.", accept: ["Cuando llegues al apartamento, deja las llaves donde quieras y [llámame|me llamas] cuando puedas."] },
    { en: "It's one thing for you to disagree, and quite another for you to insult him.", es: "Una cosa es que no estés de acuerdo y otra muy distinta que lo insultes.", accept: ["Una cosa es que no estés de acuerdo y otra muy [distinta|diferente] (es) que lo insultes."] },
    { en: "You didn't know? But he said so on Tuesday at the meeting, in front of everyone!", es: "¿Que no lo sabías? ¡Si lo dijo el martes en la reunión, delante de todos!", accept: ["¿(Que) no lo sabías? ¡Si lo dijo el martes en la reunión, delante de todos!"] },
    { en: "They chose me thanks to my experience in a similar job in Barranquilla.", es: "Me eligieron gracias a mi experiencia en un puesto parecido en Barranquilla.", accept: ["Me [eligieron|escogieron] gracias a mi experiencia en un [puesto|cargo|trabajo] [parecido|similar] en Barranquilla."] },
    { en: "The flight was delayed because of a fault in one of the engines. (formal)", es: "El vuelo se retrasó a causa de una falla en uno de los motores.", accept: ["El vuelo se [retrasó|demoró] a causa de una [falla|avería] en uno de los motores."] },
    { en: "They're very much in love, but I wouldn't say they're going to get married, honestly.", es: "Están muy enamorados, pero yo no diría que se vayan a casar, la verdad.", accept: ["Están muy enamorados, pero yo no diría que se [vayan|van] a casar, la verdad."] }
  ],
  register: [
    { es: "Que no, mijo, que no.", en: "No, dear, I'm telling you, no.", when: "with family or close friends who insist" },
    { es: "¿Cómo que no? ¡Si lo vi!", en: "What do you mean, no? I saw it!", when: "with people you know, when you're sure" },
    { es: "Una cosa es que llegue tarde y otra que no venga.", en: "Arriving late is one thing; not coming is another.", when: "anywhere, to separate two claims calmly" },
    { es: "El retraso se debió a una falla técnica.", en: "The delay was due to a technical fault.", when: "a formal notice or statement" }
  ],
  personal: {
    prompt: "A relative is staying at your place while you are away. Leave instructions where you don't know the details yet, then correct one wrong thing they said about someone you love.",
    constraints: [
      { type: "containsAny", words: ["donde quieras", "cuando puedas", "lo que quieras", "lo que necesites", "como prefieras", "donde encuentres", "cuando llegues"], label: "the unknown, with the subjunctive: *donde quieras*, *lo que necesites*" },
      { type: "containsAny", words: ["cómo que", "una cosa es"], label: "the correction: *¿cómo que...?* or *una cosa es que...*" }
    ],
    model: "Come lo que quieras de la nevera, riega las matas cuando puedas y deja la ropa donde encuentres espacio. Y ¿cómo que mi novio es antipático? ¡Si te ayudó con el trasteo!"
  },
  pitfalls: [
    "*Trae lo que quieres* is the slip when you don't know what she'll bring: *lo que quieras*.",
    "*Que le insultes* is Spain's: in Latin America, *que lo insultes*.",
    "*¿Cómo que...?* is loud and personal: with a client, *Disculpe, pero creo que hay un error*."
  ]
},

"gn-carta-reclamacion-c1": {
  source: "old",
  hook: {
    line: "You ordered five office chairs online from a supplier in Bogotá. Two arrived with the backs cracked, and one of them is unusable. You could write 'this is unacceptable' in capital letters, or you could write the letter that actually gets the chairs replaced.",
    es: "En relación con el pedido número 48213, me permito exponer lo siguiente.\nDe las cinco sillas, dos llegaron con el espaldar roto.\nPor lo anterior, solicito su reposición en un plazo máximo de diez días hábiles.",
    en: "Regarding order number 48213, I am writing to set out the following.\nOf the five chairs, two arrived with broken backs.\nFor the above reasons, I request their replacement within ten working days at most."
  },
  examples: [
    { es: "En relación con el pedido número 48213, recibido el pasado 3 de marzo, me permito exponer lo siguiente.", en: "Regarding order number 48213, received on 3 March, I am writing to set out the following." },
    { es: "De las cinco sillas solicitadas, dos llegaron con el espaldar roto y una de ellas resultó inservible.", en: "Of the five chairs ordered, two arrived with broken backs and one of them turned out to be unusable." },
    { es: "Solicito la reposición de las dos unidades en diez días hábiles o, en su defecto, el reembolso correspondiente.", en: "I request the replacement of both units within ten working days or, failing that, the corresponding refund." }
  ],
  rule: "A complaint that only lists what went wrong leaves the solution to the other side. This one walks them to it.\nContext with data: *En relación con el pedido número 48213, recibido el pasado 3 de marzo...*\nFacts that can be checked, not feelings: *dos llegaron con el espaldar roto*, not *todo llegó fatal*.\nA concession, if fair, inside the sentence: *Si bien la entrega fue puntual, el embalaje era insuficiente.*\nThe solution, with a deadline and a fallback: *Solicito la reposición en un plazo máximo de diez días hábiles o, en su defecto, el reembolso.*\nClose: *Quedo atento a su respuesta. Cordialmente,*\nName each action as a thing: *la reposición*, *el reembolso*, *la devolución*.",
  readAndPick: [
    { q: "What makes this line strong in a complaint?", es: "Dos de las cinco sillas llegaron con el espaldar roto.",
      options: ["It's very polite", "It can be checked", "It's full of emotion"], answer: 1,
      why: "A precise, checkable fact is harder to dispute than a feeling." },
    { q: "What does *en su defecto* bring in?", es: "Solicito la reposición o, en su defecto, el reembolso.",
      options: ["A fallback option", "A second complaint", "A legal threat"], answer: 0,
      why: "*En su defecto*: failing that, the second solution." },
    { q: "Where does this line go?", es: "En relación con el pedido número 48213, recibido el pasado 3 de marzo.",
      options: ["In the closing lines", "In the final request", "At the very start"], answer: 2,
      why: "The data that locate the case come first, before any complaint." },
    { q: "What does the writer grant?", es: "Si bien la entrega fue puntual, el embalaje era insuficiente.",
      options: ["It arrived on time", "The packaging was fine", "The chairs were good ones"], answer: 0,
      why: "*Si bien* grants a fair point inside the sentence, then the problem." },
    { q: "How does this close sound?", es: "Quedo atento a su respuesta. Cordialmente,",
      options: ["Angry and curt", "Correct and firm", "Far too chatty and familiar"], answer: 1,
      why: "A calm close keeps the pressure on the request, not on the tone." }
  ],
  yourTurn: [
    { en: "Regarding order number 48213, I am writing to set out the following.", es: "En relación con el pedido número 48213, me permito exponer lo siguiente.", accept: ["[En relación con el|Con relación al|Con respecto al] pedido número 48213, me permito exponer lo siguiente."] },
    { en: "I request the replacement of the damaged unit.", es: "Solicito la reposición de la unidad dañada.", accept: ["Solicito [la reposición|el cambio|la sustitución] de la unidad dañada."] },
    { en: "Or, failing that, the corresponding refund.", es: "O, en su defecto, el reembolso correspondiente.", accept: [] },
    { en: "I look forward to your reply. (formal)", es: "Quedo atento a su respuesta.", accept: ["Quedo [atento a|atenta a|a la espera de] su respuesta."] }
  ],
  translate: [
    { en: "Of the five chairs ordered, two arrived with broken backs and one of them is unusable.", es: "De las cinco sillas solicitadas, dos llegaron con el espaldar roto y una de ellas es inservible.", accept: ["De las cinco sillas [solicitadas|pedidas], dos llegaron con el espaldar roto y una de ellas [es|resultó] inservible."] },
    { en: "Although the delivery was on time, the packaging was clearly insufficient for this kind of product.", es: "Si bien la entrega fue puntual, el embalaje era claramente insuficiente para este tipo de producto.", accept: ["Si bien la entrega fue puntual, el embalaje [era|fue] claramente insuficiente para este tipo de producto."] },
    { en: "For the above reasons, I request the replacement of both chairs within ten working days. Failing that, I request a full refund.", es: "Por lo anterior, solicito la reposición de las dos sillas en un plazo de diez días hábiles. En su defecto, solicito el reembolso total.", accept: ["[Por lo anterior|Por todo lo anterior], solicito [la reposición|el cambio] de las dos sillas en un plazo de diez días hábiles. En su defecto, solicito el reembolso total."] },
    { en: "Attached to this letter are photographs of the damage and a copy of the invoice.", es: "Adjunto a esta carta fotografías de los daños y una copia de la factura.", accept: ["[Adjunto|Anexo] a esta carta (las) fotografías de los daños y una copia de la factura."] },
    { en: "I called customer service three times last week, and nobody gave me a case number.", es: "Llamé tres veces a servicio al cliente la semana pasada y nadie me dio un número de radicado.", accept: ["Llamé tres veces [a servicio al cliente|al servicio al cliente] la semana pasada(,) y nadie me dio un número de [radicado|referencia|caso]."] },
    { en: "Thank you in advance for your attention; I look forward to your prompt reply. Kind regards, Javier Roldán.", es: "Agradezco de antemano su atención y quedo atento a su pronta respuesta. Cordialmente, Javier Roldán.", accept: ["Agradezco de antemano su atención y quedo [atento a|a la espera de] su pronta respuesta. Cordialmente, Javier Roldán."] }
  ],
  register: [
    { es: "¡Esto es el colmo, me llegó todo dañado!", en: "This is the last straw, it all arrived broken!", when: "venting to a friend, never in the letter" },
    { es: "Les escribo porque el pedido llegó con problemas.", en: "I'm writing because the order arrived with problems.", when: "a quick first email to the shop" },
    { es: "Me permito presentar una reclamación formal.", en: "I hereby submit a formal complaint.", when: "a formal letter in Colombia" },
    { es: "Solicito el reembolso en un plazo de diez días hábiles.", en: "I request a refund within ten working days.", when: "the request in a formal complaint" }
  ],
  personal: {
    prompt: "Write the core of a complaint about something that went wrong with a purchase or a service: the data, the facts, and the solution with a deadline.",
    constraints: [
      { type: "containsAny", words: ["en relación con", "con relación a", "con respecto a"], label: "the context: *en relación con...*" },
      { type: "containsAny", words: ["solicito", "solicitamos"], label: "the request: *solicito...*" },
      { type: "containsAny", words: ["plazo", "días hábiles", "antes del"], label: "a deadline: *en un plazo de...*" }
    ],
    model: "En relación con la factura del mes de mayo, me permito exponer lo siguiente. Se me cobró dos veces el servicio de internet, como consta en el extracto adjunto. Por lo anterior, solicito la devolución del cobro duplicado en un plazo máximo de cinco días hábiles."
  },
  pitfalls: [
    "A list of complaints with no request leaves the decision to them: end with *solicito...*",
    "*Muy señor mío* sounds like an old letter from Spain: in Colombia, *Respetados señores*.",
    "Capitals and exclamation marks weaken a complaint: the facts carry the force."
  ]
},

"gn-composicion-escrita-c1": {
  source: "old",
  hook: {
    line: "Your writing course asks for a five-paragraph essay on remote work. Your first draft opened with 'nowadays many people work from home' and wandered for a page. This time the title, the first paragraph and the last one each do a precise job.",
    es: "El teletrabajo, ¿libertad o aislamiento?\nEste escrito se propone examinar tanto sus ventajas como sus riesgos.\nEn conclusión, el teletrabajo no es en sí mismo ni liberador ni aislante.",
    en: "Remote work: freedom or isolation?\nThis essay sets out to examine both its advantages and its risks.\nIn conclusion, remote work is in itself neither liberating nor isolating."
  },
  examples: [
    { es: "El teletrabajo se ha extendido enormemente en la última década, y con él ha surgido un debate.", en: "Remote work has spread enormously in the last decade, and with it a debate has arisen." },
    { es: "Este escrito se propone examinar tanto las ventajas como los riesgos del teletrabajo para la vida familiar.", en: "This essay sets out to examine both the advantages and the risks of remote work for family life." },
    { es: "En conclusión, el teletrabajo no es en sí mismo ni liberador ni aislante: depende de cada persona.", en: "In conclusion, remote work is in itself neither liberating nor isolating: it depends on each person." }
  ],
  rule: "An essay the reader can follow says where it is going before it goes.\nTitle: the actual question, not a label. *El teletrabajo, ¿libertad o aislamiento?*, never *Ensayo*.\nIntroduction, three steps: the context (*se ha extendido enormemente...*), the aim (*Este escrito se propone examinar tanto... como...*), the map (*En primer lugar se expondrán...; a continuación...; finalmente...*).\nDevelopment: one idea per paragraph, each opened by the marker you promised.\nConclusion: back to the main idea and the balance, with nothing new: *En conclusión, no es en sí mismo ni... ni...*\nPairs keep the balance visible: *tanto... como...* for both, *ni... ni...* for neither.",
  readAndPick: [
    { q: "Which is the better title?", es: "Tema del ensayo: el trabajo desde la casa.",
      options: ["Ensayo de opinión sobre el trabajo en casa", "El teletrabajo, ¿libertad o aislamiento?", "Composición número dos para la clase"], answer: 1,
      why: "A title that asks the essay's own question tells the reader what is at stake." },
    { q: "What does this sentence give the reader?", es: "En primer lugar se expondrán los beneficios; a continuación, los riesgos; finalmente, una valoración.",
      options: ["The conclusion of the essay", "The map of the essay", "The title"], answer: 1,
      why: "The map names each step before the development starts." },
    { q: "What is wrong with this conclusion?", es: "En conclusión, hay que añadir que el teletrabajo también afecta el tráfico.",
      options: ["It's much too short", "It's far too formal", "It adds a new idea"], answer: 2,
      why: "A conclusion sums up; a new idea belongs in the development." },
    { q: "What does *tanto... como...* do here?", es: "El ensayo examina tanto las ventajas como los riesgos.",
      options: ["Covers both sides", "Compares two sizes", "Prefers the risks"], answer: 0,
      why: "*Tanto... como...* announces that both sides will be treated." },
    { q: "What does *en sí mismo* add?", es: "El teletrabajo no es en sí mismo ni bueno ni malo.",
      options: ["By its own nature", "In the same place", "In the meantime"], answer: 0,
      why: "*En sí mismo*: in itself, apart from how it is used." }
  ],
  yourTurn: [
    { en: "This essay sets out to examine both the advantages and the risks.", es: "Este escrito se propone examinar tanto las ventajas como los riesgos.", accept: ["[Este escrito|Este ensayo] se propone examinar tanto las ventajas como los riesgos."] },
    { en: "First, the most often cited benefits will be set out.", es: "En primer lugar, se expondrán los beneficios más citados.", accept: ["En primer lugar(,) se expondrán los beneficios más citados."] },
    { en: "In conclusion, it is in itself neither good nor bad.", es: "En conclusión, no es en sí mismo ni bueno ni malo.", accept: [] },
    { en: "Remote work has spread enormously in the last decade.", es: "El teletrabajo se ha extendido enormemente en la última década.", accept: ["El teletrabajo se [ha extendido|extendió] enormemente en la última década."] }
  ],
  translate: [
    { en: "This essay sets out to analyse both the benefits and the costs of living in a small town.", es: "Este ensayo se propone analizar tanto los beneficios como los costos de vivir en una ciudad pequeña.", accept: ["[Este ensayo|Este escrito] se propone analizar tanto los beneficios como los costos de vivir en una ciudad pequeña."] },
    { en: "First, the most often cited benefits will be set out and, next, the less visible risks. Finally, an overall assessment will be offered.", es: "En primer lugar, se expondrán los beneficios más citados y, a continuación, los riesgos menos visibles. Finalmente, se ofrecerá una valoración conjunta.", accept: ["En primer lugar, se expondrán los beneficios más citados y, a continuación, los riesgos menos visibles. [Finalmente|Por último], se ofrecerá una valoración [conjunta|general]."] },
    { en: "Remote work has spread enormously in the last decade. With it, a debate has arisen about its real effects on those who do it.", es: "El teletrabajo se ha extendido enormemente en la última década. Con él ha surgido un debate sobre sus efectos reales en quienes lo practican.", accept: ["El teletrabajo se ha extendido enormemente en la última década. Con él(,) ha surgido un debate sobre sus efectos reales en quienes lo practican."] },
    { en: "Remote work is in itself neither liberating nor isolating: it depends on how each person sets limits.", es: "El teletrabajo no es en sí mismo ni liberador ni aislante: depende de cómo cada persona ponga límites.", accept: ["El teletrabajo no es en sí mismo ni liberador ni aislante: depende de cómo cada persona [ponga|pone] (los) límites."] },
    { en: "Neither the company nor the worker comes out ahead if the working day never ends.", es: "Ni la empresa ni el trabajador salen ganando si la jornada no termina nunca.", accept: ["Ni la empresa ni el trabajador [salen|sale] ganando si la jornada [no termina nunca|nunca termina]."] },
    { en: "Each of these points will be developed in a separate paragraph, with examples from Colombian companies.", es: "Cada uno de estos puntos se desarrollará en un párrafo aparte, con ejemplos de empresas colombianas.", accept: [] }
  ],
  register: [
    { es: "Hoy en día mucha gente trabaja en la casa.", en: "Nowadays a lot of people work at home.", when: "talking, or a draft you will rewrite" },
    { es: "Este escrito se propone examinar el teletrabajo.", en: "This essay sets out to examine remote work.", when: "the introduction of a formal essay" },
    { es: "En primer lugar se expondrán los beneficios.", en: "First, the benefits will be set out.", when: "the map at the end of the introduction" },
    { es: "A modo de cierre, cabe recordar la pregunta inicial.", en: "By way of a close, it is worth recalling the opening question.", when: "a formal conclusion, a little more elegant" }
  ],
  personal: {
    prompt: "Write the introduction to an essay on a question you care about: a title that asks it, the context, the aim with *tanto... como...*, and the map.",
    constraints: [
      { type: "question", label: "a title that asks the question" },
      { type: "containsAny", words: ["se propone", "pretende", "el objetivo"], label: "the aim: *este escrito se propone...*" },
      { type: "regex", pattern: "tanto\\s[^.]*\\scomo\\s", label: "both sides: *tanto... como...*" },
      { type: "containsAny", words: ["en primer lugar"], label: "the map: *en primer lugar...*" }
    ],
    model: "Las redes sociales, ¿nos acercan o nos aíslan? En la última década, las redes se han convertido en el principal medio de comunicación de los jóvenes. Este escrito se propone examinar tanto sus beneficios como sus riesgos. En primer lugar, se expondrán los argumentos a favor; a continuación, los riesgos; finalmente, se ofrecerá una valoración."
  },
  pitfalls: [
    "*Hoy en día* as the first words of an essay is the opening every reader expects: start with the real context.",
    "A map you announce and then do not follow is worse than no map.",
    "With *ni... ni...* before the verb there is no extra *no*: *Ni la empresa ni el trabajador ganan*."
  ]
},

"gn-presentacion-publica-c2": {
  source: "merged",
  hook: {
    line: "You are giving a twenty-minute talk on cycling in Bogotá to urban planners who know the subject better than most. Explaining what a cycle lane is would bore them. The polished version assumes what they know, maps where you are going, and earns its closing line.",
    es: "Ustedes conocen sobradamente la ciclovía de los domingos, así que no me voy a detener en lo básico.\nComenzaremos por la historia, lo que nos llevará a las dos posturas actuales.\nPara terminar, una frase de una colega: las buenas preguntas duran más que las respuestas fáciles.",
    en: "You all know the Sunday ciclovía very well, so I won't dwell on the basics.\nWe'll begin with the history, which will lead us to the two current positions.\nTo finish, a line from a colleague: good questions last longer than easy answers."
  },
  examples: [
    { es: "Muchos de ustedes seguramente conocerán la ciclovía de los domingos, así que no me detendré en ella.", en: "Many of you will probably know the Sunday ciclovía, so I won't dwell on it." },
    { es: "Comenzaremos por el contexto histórico, lo que nos llevará a las dos posturas que hoy dividen el debate.", en: "We'll begin with the historical context, which will lead us to the two positions that divide the debate today." },
    { es: "En suma, ninguna de las dos posturas resuelve el problema por sí sola, y eso es lo interesante.", en: "In short, neither of the two positions solves the problem on its own, and that is what's interesting." }
  ],
  rule: "A polished talk has four moves, and each has its phrase.\nAssume what they know: *Ustedes conocen sobradamente...* *Muchos de ustedes seguramente conocerán...*, a future that guesses. Then say so: *no me voy a detener en lo básico*.\nMap the route and why it runs that way: *A lo largo de esta charla veremos...* *Comenzaremos por..., lo que nos llevará a...* *Por un lado..., por otro...*\nSignpost as you go: *Como pueden ver...* *A continuación...*\nClose with one summing up phrase, not three: *En suma*, *Para terminar*. Then a line that earns warmth, a quote or real thanks: *Muchas gracias por su atención.*\nTo a room, always *ustedes*: *como pueden ver*, *presentarles*.",
  readAndPick: [
    { q: "What does *conocerán* mean here?", es: "Muchos de ustedes seguramente conocerán la ciclovía.",
      options: ["They will get to know it", "They probably know it", "They knew it once"], answer: 1,
      why: "This future guesses about the present: you probably know it already." },
    { q: "What is the speaker doing?", es: "Ustedes conocen sobradamente el debate, así que no me voy a detener en lo básico.",
      options: ["Assuming what they know", "Apologising for the delay", "Asking them a question"], answer: 0,
      why: "Presupposing the basics frees the talk for the harder part." },
    { q: "What does *lo que nos llevará a* show?", es: "Comenzaremos por la historia, lo que nos llevará a las posturas actuales.",
      options: ["Where the nearest exit is", "How long the whole talk will last", "Why the order makes sense"], answer: 2,
      why: "The map links the steps, so the audience knows why each comes next." },
    { q: "What is wrong with this closing?", es: "Así pues, en suma, sintetizando lo anterior: ninguna postura basta.",
      options: ["It's far too short", "It sums up three times", "It's in the wrong language"], answer: 1,
      why: "One closing phrase is enough: *así pues*, *en suma* and *sintetizando* say the same." },
    { q: "Who is *ustedes* in a talk?", es: "Como pueden ver en la gráfica, los viajes en bicicleta se duplicaron.",
      options: ["One person at the front", "The whole audience", "The organisers only"], answer: 1,
      why: "To a room, the plural: *como pueden ver*, never *como puedes ver*." }
  ],
  yourTurn: [
    { en: "Many of you will probably know the ciclovía.", es: "Muchos de ustedes seguramente conocerán la ciclovía.", accept: ["Muchos de ustedes [seguramente|probablemente] conocerán la ciclovía."] },
    { en: "Over the course of this talk we will see three cases.", es: "A lo largo de esta charla veremos tres casos.", accept: ["A lo largo de esta [charla|presentación|conferencia] veremos tres casos."] },
    { en: "As you can see on the screen, trips doubled.", es: "Como pueden ver en la pantalla, los viajes se duplicaron.", accept: ["Como pueden ver en la pantalla, los viajes se [duplicaron|han duplicado]."] },
    { en: "Thank you very much for your attention.", es: "Muchas gracias por su atención.", accept: [] }
  ],
  translate: [
    { en: "You all know this debate very well, so I won't dwell on the most basic points.", es: "Ustedes conocen sobradamente este debate, así que no me voy a detener en lo más básico.", accept: ["Ustedes conocen sobradamente este debate, así que no me [voy a detener|detendré] en lo más básico."] },
    { en: "We will begin with the historical context, which will lead us to the two main positions.", es: "Comenzaremos por el contexto histórico, lo que nos llevará a las dos posturas principales.", accept: ["[Comenzaremos|Empezaremos] por el contexto histórico, lo que nos llevará a las dos posturas principales."] },
    { en: "On the one hand, there are those who defend stricter rules. On the other, those who trust the sector to regulate itself.", es: "Por un lado, están quienes defienden una regulación más estricta. Por otro, quienes confían en que el sector se regule solo.", accept: ["Por un lado, están quienes defienden una regulación más estricta. Por (el) otro, quienes confían en que el sector se [regule solo|autorregule]."] },
    { en: "In short, neither of the two positions solves the problem on its own.", es: "En suma, ninguna de las dos posturas resuelve el problema por sí sola.", accept: ["[En suma|En resumen|En definitiva], ninguna de las dos posturas resuelve el problema por sí sola."] },
    { en: "First of all, I'd like to thank the organisers for the invitation and all of you for coming.", es: "Antes que nada, quisiera darles las gracias a los organizadores por la invitación y a ustedes por venir.", accept: ["Antes que nada, quisiera darles las gracias a los organizadores por la invitación y a (todos) ustedes por venir.", "Antes que nada, quisiera agradecer a los organizadores (por) la invitación y a (todos) ustedes por venir."] },
    { en: "To finish, I'll leave you with a question: what kind of city do we want in twenty years?", es: "Para terminar, les dejo una pregunta: ¿qué ciudad queremos tener dentro de veinte años?", accept: ["Para terminar, les dejo una pregunta: ¿qué [ciudad|tipo de ciudad] queremos (tener) [dentro de|en] veinte años?"] }
  ],
  register: [
    { es: "Bueno, arranquemos.", en: "Right, let's get started.", when: "a talk to colleagues you know well" },
    { es: "Antes que nada, quisiera agradecerles la invitación.", en: "First of all, I'd like to thank you for the invitation.", when: "opening a formal talk" },
    { es: "Para ir cerrando, quisiera volver a la pregunta inicial.", en: "As I wrap up, I'd like to return to the opening question.", when: "signalling the end of a talk" },
    { es: "Muchas gracias por su atención.", en: "Thank you very much for your attention.", when: "the last words of a formal talk" }
  ],
  personal: {
    prompt: "Write the opening and the map of a ten-minute talk on a subject you know well, to an audience that already knows the basics.",
    constraints: [
      { type: "containsAny", words: ["conocen sobradamente", "seguramente conocerán", "ya conocen", "conocerán"], label: "assume what they know: *ustedes conocen sobradamente...*" },
      { type: "containsAny", words: ["a lo largo de", "comenzaremos", "empezaremos"], label: "the map: *a lo largo de esta charla*, *comenzaremos por*" },
      { type: "containsAny", words: ["lo que nos llevará", "por un lado"], label: "why the order: *lo que nos llevará a...*" }
    ],
    model: "Antes que nada, quisiera agradecerles la invitación. Muchos de ustedes seguramente conocerán el café del Huila, así que no me voy a detener en lo básico. Comenzaremos por la historia de las fincas, lo que nos llevará a los retos que tienen hoy los pequeños productores."
  },
  pitfalls: [
    "*Como puedes ver* to a room is the slip: *como pueden ver*, with *ustedes*.",
    "*Así pues, en suma, sintetizando lo anterior* says the same thing three times: pick one.",
    "*El contexto, que nos conducirán* was a slip: one context, so *que nos llevará*."
  ]
},

"fn-agradecer-pesame-c1": {
  source: "old",
  hook: {
    line: "Lucía from your team has lost her mother. You go to the funeral home in Teusaquillo, and you have never offered condolences in Spanish. Two weeks later she thanks you for coming, and you need to answer that too.",
    es: "Lucía, mi más sentido pésame. Cuenta conmigo para lo que necesites.\nNo sabes cuánto te agradezco que hayas venido.\nNo hay nada que agradecer. Para eso estamos.",
    en: "Lucía, my deepest condolences. Count on me for anything you need.\nYou don't know how grateful I am that you came.\nThere's nothing to thank me for. That's what friends are for."
  },
  examples: [
    { es: "Lucía, lo siento muchísimo. Mi más sentido pésame a ti y a toda tu familia.", en: "Lucía, I'm so very sorry. My deepest condolences to you and all your family." },
    { es: "No sabes cuánto te agradezco que hayas venido, y las flores que mandaron los del equipo.", en: "You don't know how grateful I am that you came, and for the flowers the team sent." },
    { es: "No te hubieras molestado con la comida; con que vinieras ya era suficiente para nosotros.", en: "You shouldn't have gone to the trouble with the food; just your coming was enough for us." }
  ],
  rule: "Thanks and condolences both have fixed words, and the fixed words are a kindness: nobody has to invent anything.\nCondolences: *Mi más sentido pésame.* *Lo siento muchísimo.* *Te acompaño en este momento tan difícil.* Then an offer: *Cuenta conmigo para lo que necesites.* Short is better than clever.\nDeep thanks: *No sabes cuánto te agradezco que hayas venido*, with the subjunctive. *¿Qué haría yo sin ti?* *Te estoy muy agradecida.*\nFor a gift or a favour: *No te hubieras molestado*, the Latin American you shouldn't have.\nAnswering thanks: *Con mucho gusto*, the Colombian default. After a loss: *No hay nada que agradecer.* *Para eso estamos.*",
  readAndPick: [
    { q: "When would you say this?", es: "Mi más sentido pésame.",
      options: ["At a wedding", "At a funeral", "At a birthday party"], answer: 1,
      why: "*Mi más sentido pésame* is the fixed formula of condolence." },
    { q: "What is she really saying?", es: "¡Ay, no te hubieras molestado!",
      options: ["Thank you, how kind", "You've really annoyed me", "Please leave now"], answer: 0,
      why: "*No te hubieras molestado* thanks warmly by pretending the effort wasn't needed." },
    { q: "How does he answer her thanks?", es: "No hay nada que agradecer. Para eso estamos.",
      options: ["He's offended by it", "He wants a favour back", "He plays it down"], answer: 2,
      why: "He makes the favour natural: that is what friends are for." },
    { q: "What is she grateful for?", es: "No sabes cuánto te agradezco que hayas venido.",
      options: ["That he came", "That he phoned her", "That he wrote to her"], answer: 0,
      why: "*Agradecer que* plus the subjunctive: thanks for the fact that he came." },
    { q: "What is he offering?", es: "Cuenta conmigo para lo que necesites.",
      options: ["Some money, nothing else", "Help of any kind", "A ride home tonight"], answer: 1,
      why: "*Lo que necesites*, with the subjunctive: whatever it turns out to be." }
  ],
  yourTurn: [
    { en: "My deepest condolences.", es: "Mi más sentido pésame.", accept: [] },
    { en: "You don't know how grateful I am that you came.", es: "No sabes cuánto te agradezco que hayas venido.", accept: ["No sabes cuánto te agradezco que [hayas venido|vinieras]."] },
    { en: "You shouldn't have gone to the trouble! (Latin America)", es: "¡No te hubieras molestado!", accept: ["¡No te hubieras molestado!", "¡No tenías que molestarte!"] },
    { en: "Count on me for anything you need.", es: "Cuenta conmigo para lo que necesites.", accept: [] }
  ],
  translate: [
    { en: "I'm so very sorry about your father, Andrés. I'm with you at this difficult time.", es: "Siento muchísimo lo de tu papá, Andrés. Te acompaño en este momento tan difícil.", accept: ["[Siento muchísimo|Lamento mucho] lo de tu [papá|padre], Andrés. Te acompaño en este momento tan difícil."] },
    { en: "I would like to express my deepest condolences on the loss of your mother. (formal)", es: "Quisiera expresarle mi más sentido pésame por la pérdida de su mamá.", accept: ["Quisiera expresarle mi más sentido pésame por la pérdida de su [mamá|madre|señora madre]."] },
    { en: "What would I do without you? Thanks a million for looking after the children all week.", es: "¿Qué haría yo sin ti? Mil gracias por cuidar a los niños toda la semana.", accept: ["¿Qué haría yo sin ti? [Mil gracias|Un millón de gracias] por cuidar a los niños toda la semana."] },
    { en: "You shouldn't have gone to the trouble! These are the flowers my mum liked best.", es: "¡No te hubieras molestado! Son las flores que más le gustaban a mi mamá.", accept: ["¡No te hubieras molestado! Son las flores que más le gustaban a mi [mamá|madre]."] },
    { en: "Thank you in advance for all your help with the estate documents. (email)", es: "Le agradezco de antemano toda su ayuda con los documentos de la sucesión.", accept: ["Le agradezco de antemano toda su ayuda con los documentos de la sucesión.", "Gracias de antemano por toda su ayuda con los documentos de la sucesión."] },
    { en: "There's nothing to thank me for, Lucía. That's what friends are for, and I'm here for whatever you need.", es: "No hay nada que agradecer, Lucía. Para eso están los amigos, y aquí estoy para lo que necesites.", accept: [] }
  ],
  register: [
    { es: "¡Mil gracias, eres un sol!", en: "Thanks a million, you're a star!", when: "to a friend, for a favour" },
    { es: "Con mucho gusto.", en: "You're very welcome.", when: "in Colombia, the default reply to thanks" },
    { es: "Te acompaño en tu dolor.", en: "I share your grief.", when: "condolences to someone you know" },
    { es: "Reciba mis más sinceras condolencias.", en: "Please accept my most sincere condolences.", when: "a formal card or letter" }
  ],
  personal: {
    prompt: "A colleague has lost someone close. Write what you say at the funeral home, then your reply when, weeks later, they thank you for coming.",
    constraints: [
      { type: "containsAny", words: ["pésame", "lo siento", "lo lamento", "condolencias", "te acompaño"], label: "the condolence: *mi más sentido pésame*" },
      { type: "containsAny", words: ["cuenta conmigo", "lo que necesites", "aquí estoy"], label: "an offer: *cuenta conmigo para lo que necesites*" },
      { type: "containsAny", words: ["nada que agradecer", "para eso estamos", "para eso están", "con mucho gusto"], label: "the reply to thanks: *no hay nada que agradecer*" }
    ],
    model: "Camilo, mi más sentido pésame. Cuenta conmigo para lo que necesites. Y no hay nada que agradecer, para eso estamos."
  },
  pitfalls: [
    "*Faltaría más* answers thanks in Spain; in Colombia, *con mucho gusto* or *no hay de qué*.",
    "*No sabes cuánto te agradezco que viniste* is the slip: *que hayas venido* or *que vinieras*.",
    "At a funeral, keep it short: a long story about your own losses is the classic mistake."
  ]
},

"fn-disculparse-responder-c1": {
  source: "old",
  hook: {
    line: "You promised to pick your best friend up from the airport at midnight, and you fell asleep on the sofa. She waited two hours and took a taxi. This apology has to admit how bad it was, explain without excusing, and hope she lets it go.",
    es: "Valentina, mil disculpas. No sé cómo disculparme.\nTienes que perdonarme, pero es que me quedé dormida en el sofá.\nBueno, por esta vez pase, pero que no se repita.",
    en: "Valentina, I'm so, so sorry. I don't know how to apologise.\nYou have to forgive me, but the thing is, I fell asleep on the sofa.\nWell, just this once, but don't let it happen again."
  },
  examples: [
    { es: "Mil disculpas por lo de anoche: me quedé dormida en el sofá y no oí el celular.", en: "I'm so sorry about last night: I fell asleep on the sofa and didn't hear my phone." },
    { es: "Disculpa que no te haya contestado antes; estaba en una reunión que se alargó hasta las nueve.", en: "Sorry I didn't answer sooner; I was in a meeting that ran on until nine." },
    { es: "Lamentamos los inconvenientes que este cambio le haya podido causar y le ofrecemos un bono de descuento.", en: "We regret any inconvenience this change may have caused you and offer you a discount voucher." }
  ],
  rule: "An apology at this level admits, explains and hands the decision to the other person.\nAdmit the size: *Mil disculpas.* *No sé cómo disculparme.* *No tengo perdón.*\nExplain without excusing: *Tienes que perdonarme, pero es que...*\nFor something you did or failed to do: *Disculpa que no te haya contestado*, with the subjunctive. For a nuisance: *Disculpe las molestias.*\nHand it over: *Espero que puedas perdonarme.*\nFormal and written: *Le pido disculpas por...* *Lamentamos los inconvenientes que esto le haya podido causar.*\nAnswering: *Tranquila, no pasa nada.* *Olvídalo.* *Estás perdonada.* With a warning: *Bueno, por esta vez pase, pero que no se repita.*",
  readAndPick: [
    { q: "How serious does she think it was?", es: "No sé cómo disculparme.",
      options: ["Quite minor", "Very serious", "Not her fault"], answer: 1,
      why: "*No sé cómo disculparme* admits that words fall short of the harm." },
    { q: "Is this a full pardon?", es: "Bueno, por esta vez pase, pero que no se repita.",
      options: ["Yes, with no conditions", "No, she refuses it", "No, it comes with a warning"], answer: 2,
      why: "*Por esta vez pase* forgives once and warns about next time." },
    { q: "What is she apologising for?", es: "Disculpa que no te haya contestado antes.",
      options: ["Not replying sooner", "Calling far too late", "Forgetting a date"], answer: 0,
      why: "*Disculpa que* plus the subjunctive apologises for something she did or failed to do." },
    { q: "Who would write this?", es: "Lamentamos los inconvenientes que esto le haya podido causar.",
      options: ["A friend by text message", "A company to a client", "A child to a teacher"], answer: 1,
      why: "*Lamentamos los inconvenientes* is the written, formal apology of an institution." },
    { q: "What does *tranquila, no pasa nada* do?", es: "Tranquila, no pasa nada, a todos nos ha pasado.",
      options: ["Closes it kindly", "Demands an explanation", "Accepts with a warning"], answer: 0,
      why: "It forgives fully and makes the mistake ordinary." }
  ],
  yourTurn: [
    { en: "I'm so sorry, I don't know how to apologise.", es: "Mil disculpas, no sé cómo disculparme.", accept: ["[Mil disculpas|Mil perdones], no sé cómo disculparme."] },
    { en: "Sorry I didn't answer sooner. (to a friend)", es: "Disculpa que no te haya contestado antes.", accept: ["[Disculpa|Perdona] que no te haya contestado antes.", "Perdón por no haberte contestado antes."] },
    { en: "Don't worry, it's fine, it happens to everyone. (to a woman)", es: "Tranquila, no pasa nada, a todos nos pasa.", accept: ["Tranquila, no pasa nada, a todos nos [pasa|ha pasado]."] },
    { en: "Please excuse the inconvenience. (formal sign)", es: "Disculpe las molestias.", accept: ["[Disculpe|Disculpen] las molestias."] }
  ],
  translate: [
    { en: "Forgive me for the delay; the traffic on the Séptima was impossible this morning.", es: "Perdóname el retraso; el trancón en la Séptima estaba imposible esta mañana.", accept: ["[Perdóname|Disculpa|Perdona] [el retraso|la demora]; el trancón en la Séptima estaba imposible esta mañana."] },
    { en: "You have to forgive me, but the thing is, my phone battery died and I couldn't call you.", es: "Tienes que perdonarme, pero es que se me descargó el celular y no pude llamarte.", accept: ["Tienes que perdonarme, pero es que se me [descargó|murió] el celular y no pude llamarte."] },
    { en: "We apologise for the inconvenience. The service will be restored within the next two hours.", es: "Le pedimos disculpas por las molestias. El servicio se restablecerá en las próximas dos horas.", accept: ["[Le pedimos|Les pedimos] disculpas por las molestias. El servicio se restablecerá en las próximas dos horas.", "Disculpe las molestias. El servicio se restablecerá en las próximas dos horas."] },
    { en: "I hope you can forgive me for not letting you know about the change of plans earlier.", es: "Espero que puedas perdonarme por no haberte avisado antes del cambio de planes.", accept: ["Espero que puedas [perdonarme|disculparme] por no haberte avisado antes del cambio de [planes|plan]."] },
    { en: "Well, okay, just this once, but next time at least send me a message.", es: "Bueno, listo, por esta vez pase, pero la próxima vez por lo menos mándame un mensaje.", accept: ["Bueno, listo, por esta vez pase, pero la próxima vez [por lo menos|al menos] [mándame|envíame] un mensaje."] },
    { en: "We regret any inconvenience this change may have caused you and we are offering you a discount. (formal)", es: "Lamentamos los inconvenientes que este cambio le haya podido causar y le ofrecemos un descuento.", accept: ["Lamentamos los inconvenientes que este cambio le haya podido [causar|ocasionar] y le ofrecemos un descuento."] }
  ],
  register: [
    { es: "¡Qué pena contigo!", en: "I'm so sorry, how embarrassing!", when: "in Colombia, a small slip with a friend" },
    { es: "Mil disculpas, no tengo perdón.", en: "I'm so sorry, there's no excuse.", when: "to a friend, when it was bad" },
    { es: "Le pido disculpas por la demora.", en: "I apologise for the delay.", when: "to a client or someone you call usted" },
    { es: "Lamentamos los inconvenientes ocasionados.", en: "We regret the inconvenience caused.", when: "a company's written notice" }
  ],
  personal: {
    prompt: "You forgot something important that a friend was counting on. Write your apology with the size, the reason and the hope, then their answer with a warning.",
    constraints: [
      { type: "containsAny", words: ["mil disculpas", "mil perdones", "no sé cómo disculparme", "no tengo perdón", "perdóname"], label: "the size: *mil disculpas*, *no sé cómo disculparme*" },
      { type: "containsAny", words: ["pero es que", "es que"], label: "the reason: *pero es que...*" },
      { type: "containsAny", words: ["por esta vez", "que no se repita"], label: "their answer with a warning: *por esta vez pase*" }
    ],
    model: "Mil disculpas, Juan, no sé cómo disculparme. Tienes que perdonarme, pero es que se me olvidó por completo la cita. Bueno, por esta vez pase, pero que no se repita."
  },
  pitfalls: [
    "*Disculpa que no te contesté* is the slip: *que no te haya contestado*.",
    "*Vale, por esta vez pase* sounds like Spain; in Colombia, *bueno, listo, por esta vez pase*.",
    "In Colombia *¡qué pena!* is a small sorry; for a real wrong, *mil disculpas* or *perdóname*."
  ]
},

"task-c1-formal": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a sales letter and a short abstract, about two hundred words each, in a tone that holds for the whole page. The model letter sells a catalogue to a publisher, and it never once sounds like a form.",
    es: "Pocas decisiones comprometen tanto un proyecto editorial como la elección del proveedor de impresión.\nNo es un folleto comercial: es el resultado de dieciocho meses de pruebas.\nBasta con que responda a este correo indicando una dirección de envío.",
    en: "Few decisions affect a publishing project as much as the choice of printer.\nIt is not a sales brochure: it is the result of eighteen months of testing.\nYou need only reply to this email with a delivery address."
  },
  examples: [
    { es: "Pocas decisiones comprometen tanto el resultado de un libro como la elección del proveedor de impresión.", en: "Few decisions affect how a book turns out as much as the choice of printer." },
    { es: "Si bien el catálogo es gratuito, su elaboración nos llevó dieciocho meses de pruebas en condiciones idénticas.", en: "Although the catalogue is free, producing it took us eighteen months of testing under identical conditions." },
    { es: "La revisión del calendario resulta inaplazable, pese a que el proyecto ha avanzado según lo previsto.", en: "A review of the schedule cannot be postponed, even though the project has progressed as planned." }
  ],
  rule: "The task: a sales letter and a short abstract, about 200 words each. Formal Spanish at this level is not longer words; it has its own grammar.\nName actions as things: *la revisión del calendario*, not *revisar el calendario*; *su elaboración nos llevó...*\nCarry the concession in the sentence, without *aunque*: *Si bien el catálogo es gratuito, ...* *Pese a que el proyecto ha avanzado, ...*\nUse the passive with *se*: *se analizaron cuarenta casos*.\nHold one tone for the whole page: no *¡hola!* at the top and no *súper* in the middle.\nMake it easy to act: *Basta con que responda indicando...*\nThen read it aloud: if it sounds like a form, rewrite the first line.",
  readAndPick: [
    { q: "What makes this line formal?", es: "La revisión del calendario resulta inaplazable.",
      options: ["The action named as a thing", "A long and very rare word", "A polite, careful request"], answer: 0,
      why: "*La revisión* turns the action into a thing: the heart of formal Spanish." },
    { q: "What is *si bien* carrying here?", es: "Si bien el catálogo es gratuito, su elaboración costó meses.",
      options: ["A cause", "A concession", "A condition for the offer"], answer: 1,
      why: "*Si bien* grants a point inside the sentence, with no *aunque* needed." },
    { q: "What does *basta con que* make easy?", es: "Basta con que responda indicando una dirección de envío.",
      options: ["Refusing politely", "Asking for a discount", "Taking the next step"], answer: 2,
      why: "*Basta con que* plus the subjunctive: all you need to do is this." },
    { q: "In a letter that opened *Estimada señora Iriarte*, which line breaks the tone?", es: "Carta a la señora Iriarte, de la editorial Altamar.",
      options: ["Le enviamos el catálogo sin compromiso.", "El catálogo está súper bueno.", "Quedamos atentos a su respuesta."], answer: 1,
      why: "*Súper bueno* belongs to a chat, not to a letter that opened so formally." },
    { q: "What is the closing doing?", es: "Si no, no volveremos a molestarla.",
      options: ["Promising not to insist", "Threatening her politely", "Asking for money up front"], answer: 0,
      why: "Promising not to insist is a quiet courtesy that makes the offer easier to accept." }
  ],
  yourTurn: [
    { en: "A review of the schedule cannot be put off.", es: "La revisión del calendario resulta inaplazable.", accept: ["La revisión del calendario [resulta|es] inaplazable."] },
    { en: "We send it to you with no obligation whatsoever.", es: "Se lo enviamos sin compromiso alguno.", accept: ["Se lo enviamos sin [compromiso alguno|ningún compromiso]."] },
    { en: "You need only reply with an address.", es: "Basta con que responda indicando una dirección.", accept: ["Basta con que [responda|conteste] [indicando|con] una dirección."] },
    { en: "Forty cases were analysed. (abstract)", es: "Se analizaron cuarenta casos.", accept: [] }
  ],
  translate: [
    { en: "Our catalogue brings together, for the first time, real performance data for eleven different finishes.", es: "Nuestro catálogo reúne, por primera vez, datos reales de rendimiento de once acabados distintos.", accept: ["Nuestro catálogo reúne, por primera vez, (los) datos reales de rendimiento de once acabados [distintos|diferentes]."] },
    { en: "It is not a sales brochure: it is the result of eighteen months of testing. We send it to you with no obligation.", es: "No es un folleto comercial: es el resultado de dieciocho meses de pruebas. Se lo enviamos sin compromiso alguno.", accept: ["No es un folleto comercial: es el resultado de dieciocho meses de pruebas. Se lo enviamos sin [compromiso alguno|ningún compromiso]."] },
    { en: "If you think it may be useful, you need only reply with a delivery address. If not, we will not bother you again.", es: "Si considera que puede resultarle útil, basta con que responda indicando una dirección de envío. Si no, no volveremos a molestarla.", accept: ["Si considera que puede resultarle útil, basta con que responda indicando una dirección de envío. Si no, no volveremos a [molestarla|molestarlo]."] },
    { en: "The present study analyses the effect of error correction on forty adult learners in Medellín. (abstract)", es: "El presente estudio analiza el efecto de la corrección en cuarenta estudiantes adultos de Medellín.", accept: ["[El presente estudio|Este estudio] analiza el efecto de la corrección (de errores) en cuarenta estudiantes adultos de Medellín."] },
    { en: "Although the sample is limited, the results suggest a clear pattern by level. (abstract)", es: "Si bien la muestra es limitada, los resultados sugieren un patrón claro según el nivel.", accept: ["Si bien la muestra es [limitada|reducida|pequeña], los resultados sugieren un patrón claro según el nivel."] },
    { en: "Despite the fact that the project has progressed as planned, a review of the budget cannot be postponed.", es: "Pese a que el proyecto ha avanzado según lo previsto, la revisión del presupuesto resulta inaplazable.", accept: ["[Pese a que|A pesar de que] el proyecto ha avanzado según lo previsto, la revisión del presupuesto [resulta|es] inaplazable."] }
  ],
  register: [
    { es: "¡Hola, Marta! Te mando el catálogo.", en: "Hi Marta! I'm sending you the catalogue.", when: "a message to a client who is a friend" },
    { es: "Estimada señora Iriarte:", en: "Dear Ms Iriarte,", when: "opening a formal letter to a named person" },
    { es: "Le adjunto el catálogo para su consideración.", en: "I attach the catalogue for your consideration.", when: "a formal email with an attachment" },
    { es: "Se analizaron cuarenta casos.", en: "Forty cases were analysed.", when: "an abstract or a report" }
  ],
  personal: {
    prompt: "Write the opening paragraph of your sales letter: the line that catches attention, then the interest, with one action named as a thing and one concession without *aunque*.",
    constraints: [
      { type: "regex", pattern: "[a-záéíóúñ]+(ción|sión|miento)\\b", label: "an action named as a thing: *la revisión*, *la elaboración*" },
      { type: "containsAny", words: ["si bien", "pese a", "a pesar de", "aun cuando"], label: "a concession without *aunque*: *si bien*, *pese a que*" },
      { type: "avoidsAny", words: ["aunque", "súper"], label: "no *aunque*, no *súper*" }
    ],
    model: "Estimada señora Iriarte: Pocas decisiones afectan tanto la calidad de un libro como la elección de su papel. Si bien el precio suele ser el criterio decisivo, la resistencia del papel determina cuánto dura una edición. Nuestro catálogo reúne los resultados de un año de pruebas, y se lo enviamos sin compromiso alguno."
  },
  pitfalls: [
    "*Revisar el calendario es inaplazable* is correct but flat: *la revisión del calendario resulta inaplazable* is the institutional voice.",
    "Every sentence nominalised reads like a machine: one or two per paragraph is the dose.",
    "*Aunque* is not wrong, but the task asks for *si bien* or *pese a que* to carry the concession."
  ]
}

};
