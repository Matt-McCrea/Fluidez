/* ============================================================================
 * TEACHING SCRIPTS, C1 units 1 and 2 (window.SCRIPTS_C1), keyed by lesson id.
 * Units c1-u55 "Idiom and the body" and c1-u56 "Irony and implicature":
 * every lesson on the path from COURSE_BANDS.C1 (day 492 to day 519).
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
 * hasta las narices, menudo lío, crío, chaval, bocadillo, enhorabuena). No
 * dashes anywhere.
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
}

};
