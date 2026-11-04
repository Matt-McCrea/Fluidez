/* ============================================================================
 * TEACHING SCRIPTS, C1 units 1 to 6 (window.SCRIPTS_C1), keyed by lesson id.
 * Units c1-u55 "Idiom and the body", c1-u56 "Irony and implicature",
 * c1-u57 "Saying it without owning it", c1-u58 "Institutional Spanish",
 * c1-u59 "The whole verb system at once" and c1-u60 "Emotion at native
 * pitch": every lesson on the path in the first six units from
 * COURSE_BANDS.C1 (course days 493 to 584).
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
 *     so), so each keeps its own script. Units c1-u59 and c1-u60 have two
 *     neighbouring pairs, fn-obligacion-necesidad-c1 with
 *     nt-necesidad-obligacion-c1 (where a duty comes from and the least you
 *     must do; how much you need something and having no way out) and
 *     nt-reflexion-conocimiento-c1 with nt-expresion-verbal-c1 (thinking it
 *     through; the verbs of saying), and each lesson keeps its own script;
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
 * les invitamos, anejo, muy señor mío; and in units 5 and 6 confirmarais
 * vuestra, tendríais, ándale, ¡dale! read as irritation (a yes in Colombia),
 * echar un cable, móvil, coche,
 * le escribía para, ¡vaya, hombre!, estar como un flan, partirse de risa, lo
 * pasamos bien, no te cortes, me importa un pimiento, hacer ilusión, echar de
 * menos, estar de buenas for a good mood, which is being lucky in Colombia,
 * and the perfect for today taught as the default: the old
 * dc-indefinido-perfecto-c1 lesson took Spain's hoy he comido as the norm,
 * and the script teaches the Latin American preterite with the perfect for
 * what is still open). No dashes anywhere.
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
},

/* ---- unit c1-u59 · The whole verb system at once -------------------------- */

"gr-tiempos-indicativo-c1": {
  source: "merged",
  hook: {
    line: "Sunday lunch at your aunt Gloria's in Bogotá. She tells the story of the year she nearly moved to New York, guesses why her brother never wrote, and on the way out pats her pockets. Every verb she uses sits somewhere other than its own time.",
    es: "En el 85 me llega una carta de Nueva York.\nYo había pensado irme, pero al final me quedé.\n¿No me habré dejado las llaves?",
    en: "In '85 a letter arrives for me from New York.\nI had been thinking of going, but in the end I stayed.\nI haven't left my keys behind, have I?"
  },
  examples: [
    { es: "En el 85 me llega una carta de mi hermano, que ya vivía en Nueva York.", en: "In '85 a letter arrives from my brother, who was already living in New York." },
    { es: "Había pensado irme con él, pero mi mamá se enfermó y al final me quedé en Bogotá.", en: "I had been thinking of going with him, but my mum fell ill and in the end I stayed in Bogotá." },
    { es: "Mi hermano habrá tenido sus motivos, pero en diez años no nos escribió ni una carta.", en: "My brother must have had his reasons, but in ten years he didn't write us a single letter." }
  ],
  rule: "A Spanish verb can step outside its own time, and each step does a job.\nThe present for the past brings a story close: *En el 85 me llega una carta.* Choose it for the scene and stay in it.\nThe future perfect guesses about the past: *Habrá tenido sus motivos*, he must have had his reasons. With *no*, as a question, it is a worry: *¿No me habré dejado las llaves?*\nThe conditional grants a point about the past before a *pero*: *Sería muy listo, pero nunca trabajó.*\nThe pluperfect for what almost happened: *Había pensado irme, pero me quedé.* The plan existed; the trip never did.",
  readAndPick: [
    { q: "Did Gloria go to New York?", es: "Había pensado irme, pero al final me quedé.",
      options: ["Yes, for many years", "No, it never happened at all", "Yes, but she came back"], answer: 1,
      why: "*Había pensado* is a plan that existed and never happened." },
    { q: "What is she saying about her brother?", es: "Habrá tenido sus motivos, pero nunca escribió.",
      options: ["He probably had reasons", "He wrote to her every week", "He will have reasons soon"], answer: 0,
      why: "*Habrá tenido* is a guess about the past: he must have had his reasons." },
    { q: "What is she afraid of?", es: "¿No me habré dejado las llaves en la mesa?",
      options: ["Losing them on the bus later", "Someone stealing them", "Having left them behind"], answer: 2,
      why: "With *no*, as a question, the future perfect worries about something already done." },
    { q: "Is she praising her cousin?", es: "Sería muy listo, pero nunca trabajó un solo día.",
      options: ["Yes, warmly and without reserve", "She grants it, then objects", "No, she calls him slow-witted"], answer: 1,
      why: "*Sería*, before *pero*, grants the point about the past and then answers it." },
    { q: "When did the letter arrive?", es: "En el 85 me llega una carta de Nueva York.",
      options: ["Decades ago, in 1985", "Only this morning", "It's still on its way"], answer: 0,
      why: "The present tells a past story as if it were happening now; *en el 85* says when." }
  ],
  yourTurn: [
    { en: "He must have had his reasons.", es: "Habrá tenido sus motivos.", accept: ["Habrá tenido sus [motivos|razones]."] },
    { en: "I had been thinking of leaving, but in the end I stayed.", es: "Había pensado irme, pero al final me quedé.", accept: ["Había pensado [irme|marcharme], pero [al final|finalmente] me quedé."] },
    { en: "I haven't left the keys inside, have I?", es: "¿No me habré dejado las llaves adentro?", accept: ["¿No [me habré dejado|habré dejado] las llaves [adentro|dentro]?"] },
    { en: "He may well have been clever, but he never worked.", es: "Sería muy listo, pero nunca trabajó.", accept: ["Sería muy [listo|inteligente], pero nunca trabajó."] },
    { en: "In '85 a letter arrives for me from New York.", es: "En el 85 me llega una carta de Nueva York.", accept: ["En el [85|ochenta y cinco] me llega una carta de Nueva York."] }
  ],
  translate: [
    { en: "In 1985 my uncle sells the shop and leaves for New York without telling anyone.", es: "En 1985 mi tío vende la tienda y se va para Nueva York sin avisarle a nadie.", accept: ["En 1985 mi tío vende la tienda y se va [para|a] Nueva York sin [avisarle|decirle] a nadie."] },
    { en: "She must have had her reasons, but she could at least have called us.", es: "Habrá tenido sus motivos, pero por lo menos nos habría podido llamar.", accept: ["Habrá tenido sus [motivos|razones], pero [por lo menos|al menos] [nos habría podido llamar|habría podido llamarnos|podría habernos llamado|nos podría haber llamado]."] },
    { en: "I haven't left the stove on, have I? We've been out of the house for three hours.", es: "¿No habré dejado la estufa prendida? Llevamos tres horas fuera de la casa.", accept: ["¿No [habré|me habré] dejado la estufa prendida? Llevamos tres horas [fuera de la casa|fuera de casa|afuera]."] },
    { en: "Your cousin may well have been charming, but he never paid anyone back a single peso.", es: "Tu primo sería muy encantador, pero nunca le devolvió ni un peso a nadie.", accept: ["Tu primo sería muy [encantador|simpático|querido], pero nunca le devolvió ni un peso a nadie.", "Tu primo sería muy [encantador|simpático|querido], pero nunca le devolvió a nadie ni un peso."] },
    { en: "I had come close to selling the apartment when the bank called me with a better offer.", es: "Había estado a punto de vender el apartamento cuando el banco me llamó con una oferta mejor.", accept: ["Había estado a punto de vender el apartamento cuando el banco me llamó con una [oferta mejor|mejor oferta]."] },
    { en: "So I get to the airport and the flight is cancelled. I call my brother and he doesn't answer.", es: "Llego al aeropuerto y el vuelo está cancelado. Llamo a mi hermano y no me contesta.", accept: ["Llego al aeropuerto y el vuelo [está cancelado|lo cancelaron]. Llamo a mi hermano y no me [contesta|responde]."] }
  ],
  register: [
    { es: "Habrá tenido sus motivos.", en: "He must have had his reasons.", when: "a guess you would not swear to" },
    { es: "Seguro que tuvo sus motivos.", en: "I'm sure he had his reasons.", when: "in conversation, when you feel confident" },
    { es: "Es probable que haya tenido sus motivos.", en: "He probably had his reasons.", when: "in writing, or when you want to sound careful" },
    { es: "En 1948 matan a Gaitán y Bogotá arde.", en: "In 1948 Gaitán is killed and Bogotá burns.", when: "telling history or a story, to bring it close" }
  ],
  personal: {
    prompt: "Tell a family story in three lines: one scene in the present, one plan that never happened, and one guess about why someone did what they did.",
    constraints: [
      { type: "regex", pattern: "\\b(había|habías|habíamos|habían) (pensado|estado a punto)", label: "a plan that never happened: *había pensado*" },
      { type: "regex", pattern: "\\bhabr(á|é|ás|án|emos)\\s+[a-z]+(ado|ido|isto|ito|echo|icho|uesto|uelto)\\b", label: "a guess about the past: *habrá tenido*" },
      { type: "minSentences", n: 3, label: "three sentences or more" }
    ],
    model: "En el 2010 mi papá recibe una oferta en Panamá. Había pensado aceptarla, pero mi abuela se enfermó y al final se quedó. Mi tío nunca vino a visitarla; habrá tenido sus motivos."
  },
  pitfalls: [
    "*Habrá tenido sus motivos* is not about the future: it is a guess about the past, like English *must have*.",
    "Once a story is in the present, stay there: *llego y me encuentro*, not *llego y me encontré*.",
    "*Había pensado irme* does not say you went: it says you didn't. If you went, say *me fui*."
  ]
},

"gr-tiempos-subjuntivo-c1": {
  source: "merged",
  hook: {
    line: "You are leaving your job at a design studio in Medellín, and your boss wants to know why. Every answer starts with a *no*, and what follows it decides what you are admitting and what you are not.",
    es: "No me voy porque me paguen poco, sino porque aquí no puedo crecer.\nNo niego que he cometido errores.\nPero nunca dije que el equipo fuera malo.",
    en: "I'm not leaving because the pay is low, but because I can't grow here.\nI don't deny I've made mistakes.\nBut I never said the team was bad."
  },
  examples: [
    { es: "No me voy porque me paguen poco, sino porque en este estudio ya no puedo crecer.", en: "I'm not leaving because they pay me little, but because I can't grow in this studio any more." },
    { es: "No niego que llegué tarde varias veces, pero nunca dejé un proyecto sin terminar.", en: "I don't deny I was late several times, but I never left a project unfinished." },
    { es: "Yo no dije que el cliente fuera difícil; dije que pedía cambios todos los días.", en: "I didn't say the client was difficult; I said he asked for changes every day." }
  ],
  rule: "After a *no*, the mood is a choice, and the choice says what you vouch for.\n*No niego que llegué tarde*: the indicative, so you admit it happened. *No dije que fuera difícil*: the subjunctive, so nobody claims it, not even you.\nWith *porque*, the subjunctive denies the reason, not the act: *No me voy porque me paguen poco* means I am leaving, for another reason, and *sino porque* gives it. *No me voy porque me pagan bien* means I'm staying.\nA guess moves too: *se habrá enterado* becomes *no creo que se haya enterado*.\nAnd *¡Quién tuviera tus años!* wishes for what cannot be.",
  readAndPick: [
    { q: "Is the speaker leaving?", es: "No me voy porque me paguen poco.",
      options: ["Yes, but not for the pay", "No, he is staying where he is", "Yes, because of the money"], answer: 0,
      why: "*Paguen* denies the reason, not the leaving: he goes, and the real reason comes next." },
    { q: "And this time?", es: "No me voy porque me pagan bien.",
      options: ["He's leaving, pay aside", "He stays, the pay is good", "He leaves for a new job"], answer: 1,
      why: "With the plain *pagan*, the *no* falls on leaving: he stays, and the pay is why." },
    { q: "Does she admit she was late?", es: "No niego que llegué tarde varias veces.",
      options: ["No, she denies it firmly", "She isn't sure herself", "Yes, it really happened"], answer: 2,
      why: "*Llegué*, the plain past, means she vouches for it." },
    { q: "Did he say the client was difficult?", es: "Yo no dije que el cliente fuera difícil.",
      options: ["No, he never claimed that", "Yes, and he still thinks so", "Yes, but only the one time"], answer: 0,
      why: "*Fuera* says nobody vouches for it: he never made that claim." },
    { q: "What does the speaker think about Carlos?", es: "No creo que Carlos se haya enterado todavía.",
      options: ["He knew all along", "He probably hasn't heard", "He'll hear tomorrow"], answer: 1,
      why: "*Se haya enterado* is the guess *se habrá enterado*, moved under *no creo*." },
    { q: "What is the speaker wishing for?", es: "¡Quién tuviera tus años y tu energía!",
      options: ["To meet someone like you", "To earn what you do", "To be your age again"], answer: 2,
      why: "*Quién* plus the *-ra* form wishes for something that cannot happen." }
  ],
  yourTurn: [
    { en: "I'm not leaving because they pay me badly, but because I can't grow here.", es: "No me voy porque me paguen mal, sino porque aquí no puedo crecer.", accept: ["No me voy porque me paguen [mal|poco], sino porque aquí no puedo crecer.", "No me voy porque me paguen [mal|poco], sino porque no puedo crecer aquí."] },
    { en: "I don't deny I made mistakes.", es: "No niego que cometí errores.", accept: ["No niego que [cometí|he cometido] errores."] },
    { en: "I never said the team was bad.", es: "Nunca dije que el equipo fuera malo.", accept: ["(Yo) nunca dije que el equipo fuera malo.", "(Yo) no dije nunca que el equipo fuera malo."] },
    { en: "I don't think he's found out yet.", es: "No creo que se haya enterado todavía.", accept: ["No creo que [se haya enterado todavía|todavía se haya enterado|se haya enterado aún|aún se haya enterado]."] },
    { en: "If only I were your age!", es: "¡Quién tuviera tus años!", accept: ["¡Quién tuviera tu edad!"] }
  ],
  translate: [
    { en: "She isn't studying law because her parents make her, but because she likes it.", es: "No estudia derecho porque sus papás la obliguen, sino porque le gusta.", accept: ["No estudia derecho porque sus [papás|padres] la obliguen, sino porque le gusta."] },
    { en: "I saw no sign that there was any problem with the contract when I signed it.", es: "No vi que hubiera ningún problema con el contrato cuando lo firmé.", accept: ["No vi que hubiera ningún problema [con el|en el] contrato cuando lo firmé."] },
    { en: "My boss doesn't deny that the project is behind; she denies that it's our fault.", es: "Mi jefa no niega que el proyecto está atrasado; niega que sea culpa nuestra.", accept: ["Mi jefa no niega que el proyecto está [atrasado|retrasado]; niega que sea [culpa nuestra|nuestra culpa]."] },
    { en: "I don't think Andrés has read the email yet, so don't say anything to him.", es: "No creo que Andrés haya leído el correo todavía, así que no le digas nada.", accept: ["No creo que Andrés haya leído el correo [todavía|aún], así que no le digas nada.", "No creo que Andrés [todavía|aún] haya leído el correo, así que no le digas nada."] },
    { en: "I'm not saying it because you're my friend. I'm saying it because it's true: your design was the best. (to a woman)", es: "No lo digo porque seas mi amiga. Lo digo porque es verdad: tu diseño era el mejor.", accept: ["No lo digo porque seas mi amiga. Lo digo porque es verdad: tu diseño [era|fue] el mejor."] },
    { en: "If only I had your patience! In your place I would have quit a year ago.", es: "¡Quién tuviera tu paciencia! Yo en tu lugar habría renunciado hace un año.", accept: ["¡Quién tuviera tu paciencia! (Yo) en tu lugar [habría|hubiera] renunciado hace un año."] }
  ],
  register: [
    { es: "No digo que sea malo.", en: "I'm not saying it's bad.", when: "softening a criticism you still mean" },
    { es: "No es que sea malo, es que no me convence.", en: "It's not that it's bad, it just doesn't convince me.", when: "with friends, giving the real reason" },
    { es: "No se trata de que sea malo, sino de que no cumple el plazo.", en: "The point is not that it's bad, but that it misses the deadline.", when: "in a meeting or in writing" }
  ],
  personal: {
    prompt: "You are turning something down: a job, a trip, a plan. In two or three lines, deny the obvious reason, give the real one, and admit one thing you do not deny.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "porque", label: "the reason you deny, in the subjunctive: *porque me dé miedo*" },
      { type: "containsWord", word: "sino porque", label: "the real reason: *sino porque*" },
      { type: "containsAny", words: ["no niego que", "no voy a negar que", "reconozco que"], label: "something you admit: *no niego que*" }
    ],
    model: "No voy a ir a Cartagena porque me dé miedo volar, sino porque estoy sin plata. No niego que me encantaría ir."
  },
  pitfalls: [
    "*No me voy porque me pagan poco* says the opposite of what you mean: with the plain verb, you are staying.",
    "*Sino porque*, not *pero porque*: after a denied reason, Spanish corrects with *sino*.",
    "*No niego que* keeps the plain verb when you are admitting it: *no niego que llegué tarde*."
  ]
},

"dc-imperfecto-modal-c1": {
  source: "old",
  hook: {
    line: "Saturday at your sister's flat in Cali. Your nephew is glued to the television, the neighbour knocks to borrow something, and your grandmother, who you thought had gone home, walks out of the kitchen. Three past forms, and none of them is about the past.",
    es: "¿Tú no tenías examen el lunes?\nBuenas, venía a ver si me podían prestar una escalera.\n¡Uy, abuela! ¿Usted estaba aquí?",
    en: "Don't you have an exam on Monday?\nHello, I was wondering if you could lend me a ladder.\nOh, Grandma! You're here?"
  },
  examples: [
    { es: "¿Tú no tenías examen de química el lunes? Llevas toda la tarde viendo televisión.", en: "Don't you have a chemistry exam on Monday? You've been watching TV all afternoon." },
    { es: "Buenas tardes, venía a ver si me podían prestar una escalera para cambiar un bombillo.", en: "Good afternoon, I was wondering if you could lend me a ladder to change a light bulb." },
    { es: "¡Y yo qué sabía que el examen era el lunes! Nadie me dijo nada, mamá.", en: "How was I supposed to know the exam was on Monday! Nobody told me anything, Mum." }
  ],
  rule: "These *-aba* and *-ía* forms are not about the past. Each one does a job in the conversation.\nTo soften: *Quería preguntarle una cosa.* *Venía a ver si...* The wish is now; the past form makes it easy to say no. *Quiero* sounds blunt.\nTo excuse yourself: *¡Y yo qué sabía!* You go back to when not knowing was reasonable.\nTo show surprise: *¿Usted estaba aquí?* It shows what you had assumed.\nTo reproach, as a question: *¿Tú no tenías examen?* It means go and study, and *sí, lo tenía* misses the point.\nFor a firm statement, use the present: the soft form makes you sound unsure.",
  readAndPick: [
    { q: "What does the mother mean?", es: "¿Tú no tenías examen el lunes?",
      options: ["Turn that off and study", "How did last week's go?", "I'd forgotten your exam"], answer: 0,
      why: "A reproach shaped as a question: she knows about the exam and wants him studying." },
    { q: "Why does the neighbour say *venía*?", es: "Venía a ver si me podían prestar una escalera.",
      options: ["He had already come round before", "To make his request gentle", "He changed his mind about it"], answer: 1,
      why: "The past form puts distance between him and his request, so it is easy to refuse." },
    { q: "What is the boy doing?", es: "¡Y yo qué sabía que era el lunes!",
      options: ["Asking which day the exam falls on", "Admitting that he knew", "Defending himself from blame"], answer: 2,
      why: "*Y yo qué sabía* is a defence: back then, not knowing was reasonable." },
    { q: "What had she assumed?", es: "¡Uy, abuela! ¿Usted estaba aquí?",
      options: ["That her grandmother had gone", "That her grandmother was ill", "That she was on her way"], answer: 0,
      why: "The *-aba* form shows the assumption that has just been overturned." },
    { q: "Which opener fits a bank counter?", es: "En la ventanilla del banco.",
      options: ["Quise preguntarle por un cobro.", "Quería preguntarle por un cobro.", "Quiero preguntarle sobre un cobro."], answer: 1,
      why: "*Quería* is the standard polite opener; *quiero* is blunt, and *quise* reports a failed attempt." }
  ],
  yourTurn: [
    { en: "I wanted to ask you something. (to someone you call usted)", es: "Quería preguntarle una cosa.", accept: ["Quería preguntarle [una cosa|algo]."] },
    { en: "How was I supposed to know!", es: "¡Y yo qué sabía!", accept: ["¡(Y) yo qué iba a saber!"] },
    { en: "Hello, I was wondering if you could lend me a ladder. (to a neighbour you call usted)", es: "Buenas, venía a ver si me podía prestar una escalera.", accept: ["[Buenas|Buenos días|Buenas tardes], venía a ver si me podía prestar una escalera.", "[Buenas|Buenos días|Buenas tardes], venía a ver si podía prestarme una escalera."] },
    { en: "Don't you have an exam tomorrow? (to your son)", es: "¿Tú no tenías examen mañana?", accept: ["¿(Tú) no tenías (un) examen mañana?"] },
    { en: "Grandma! You're here? I thought you had left.", es: "¡Abuela! ¿Usted estaba aquí? Pensé que se había ido.", accept: ["¡Abuela! ¿Usted estaba aquí? [Pensé|Creí|Pensaba] que se había ido."] }
  ],
  translate: [
    { en: "Good morning, I wanted to ask you about a charge that appeared on my card.", es: "Buenos días, quería preguntarle por un cobro que me apareció en la tarjeta.", accept: ["Buenos días, quería preguntarle [por|sobre] un cobro que me apareció en la tarjeta.", "Buenos días, quería preguntarle [por|sobre] un cobro que apareció en mi tarjeta."] },
    { en: "How was I supposed to know the meeting was at eight! Nobody sent me the invitation.", es: "¡Y yo qué sabía que la reunión era a las ocho! Nadie me mandó la invitación.", accept: ["¡(Y) yo qué sabía que la reunión era a las ocho! Nadie me [mandó|envió] la invitación."] },
    { en: "Weren't you on a diet? That's the third piece of cake you've eaten this afternoon.", es: "¿Tú no estabas a dieta? Es el tercer pedazo de torta que te comes esta tarde.", accept: ["¿(Tú) no estabas a dieta? (Ya) es el tercer [pedazo|pedacito] de torta que te comes esta tarde."] },
    { en: "I was wondering if the doctor could see me today, even for five minutes.", es: "Venía a ver si el médico me podía atender hoy, aunque fuera cinco minutos.", accept: ["Venía a ver si el [médico|doctor] me podía atender hoy, aunque [fuera|sea] (por) cinco minutos.", "Venía a ver si el [médico|doctor] podía atenderme hoy, aunque [fuera|sea] (por) cinco minutos."] },
    { en: "Oh, you were here! I thought you'd already left for the airport.", es: "¡Uy, estabas aquí! Pensé que ya te habías ido para el aeropuerto.", accept: ["¡Uy, (tú) estabas aquí! [Pensé|Creí|Pensaba] que ya te habías ido [para el|al] aeropuerto."] },
    { en: "Weren't you the one who was going to buy the tickets? Now there are none left for Saturday.", es: "¿No eras tú el que iba a comprar las boletas? Ahora no quedan para el sábado.", accept: ["¿No eras tú [el que|quien] iba a comprar las boletas? Ahora (ya) no quedan para el sábado."] }
  ],
  register: [
    { es: "Quiero hablar con el gerente.", en: "I want to speak to the manager.", when: "when you mean to complain, and want it heard" },
    { es: "Quería hablar con el gerente, por favor.", en: "I'd like to speak to the manager, please.", when: "the ordinary polite request" },
    { es: "Venía a ver si podía hablar con el gerente.", en: "I was wondering if I might speak to the manager.", when: "very gently, when you are asking a lot" },
    { es: "Le escribo para preguntar por el estado de mi solicitud.", en: "I am writing to ask about the status of my application.", when: "in a formal email in Latin America" }
  ],
  personal: {
    prompt: "You knock on a neighbour's door to ask for something, and then find out you missed something you were told about. Write both: the soft request and the excuse.",
    constraints: [
      { type: "containsAny", words: ["quería", "venía a ver", "venía a preguntar"], label: "a soft request: *quería* or *venía a ver si*" },
      { type: "containsAny", words: ["yo qué sabía", "yo qué iba a saber"], label: "an excuse: *¡y yo qué sabía!*" }
    ],
    model: "Buenas, venía a ver si me podía prestar un taladro. ¿La reunión de vecinos era hoy? ¡Y yo qué sabía! Nadie me avisó."
  },
  pitfalls: [
    "*Quería preguntarle* is not *I wanted to ask*: the wish is present, and the past form is politeness.",
    "*¿Tú no tenías examen?* is rarely a real question: it tells you to go and study.",
    "In an email, Latin America writes *le escribo para*; *le escribía para* sounds like Spain."
  ]
},

"dc-indefinido-perfecto-c1": {
  source: "old",
  hook: {
    line: "Your Bogotá team has its Monday call with a client in Madrid. She says what she did this morning one way and you say it another, and you are both right. Where you agree is on what is still open.",
    es: "Esta mañana he hablado con el proveedor.\nYo también hablé con él esta mañana.\nEl material todavía no ha llegado.",
    en: "I spoke to the supplier this morning.\nI spoke to him this morning too.\nThe material still hasn't arrived."
  },
  examples: [
    { es: "Esta mañana hablé con el proveedor y me confirmó que el envío ya había salido de Cartagena.", en: "This morning I spoke to the supplier and he confirmed the shipment had already left Cartagena." },
    { es: "Este mes hemos tenido tres retrasos, y el cliente ya empieza a perder la paciencia.", en: "This month we've had three delays, and the client is starting to lose patience." },
    { es: "Nunca hemos trabajado con este proveedor, pero la empresa de Medellín lo recomendó mucho.", en: "We have never worked with this supplier, but the company in Medellín recommended them highly." }
  ],
  rule: "In Colombia and most of Latin America, a finished event takes the preterite, even this morning: *Hoy me levanté a las cinco.* *Esta mañana hablé con él.*\nThe perfect is for what is still open, up to now: *Este mes hemos tenido tres retrasos*, and the month goes on. *Nunca he ido a San Andrés.* *Todavía no ha llegado.* *Siempre he pensado que...*\nSo the choice is a message. *¿Ya llegó?* asks about one event; *¿Ha llegado algo?* asks what there is so far.\nIn Spain, *hoy he comido fuera* is the norm for today. Hear it as Madrid Spanish, not a mistake, and don't copy it.",
  readAndPick: [
    { q: "Is this Spanish from Bogotá a mistake?", es: "Hoy me levanté a las cinco.",
      options: ["Yes, today needs the other form", "No, it's the normal form there", "Only in very formal writing"], answer: 1,
      why: "In most of Latin America the preterite covers anything finished, even this morning." },
    { q: "Why *hemos tenido*?", es: "Este mes hemos tenido tres retrasos.",
      options: ["The month is not over yet", "The delays were long ago", "It's more polite"], answer: 0,
      why: "The perfect reaches up to now: the month, and the problem, are still open." },
    { q: "Has the speaker been to San Andrés?", es: "Nunca he ido a San Andrés.",
      options: ["Yes, once, as a little girl", "Not once, up to this day", "Only once, on a work trip"], answer: 1,
      why: "*Nunca he ido* counts experience up to now: not once so far." },
    { q: "Where is the speaker probably from?", es: "Esta mañana he hablado con el proveedor.",
      options: ["Bogotá, Colombia", "Lima, Peru", "Madrid, Spain"], answer: 2,
      why: "The perfect for this morning is the norm in Spain; in Bogotá you would hear *hablé*." },
    { q: "What is the client asking?", es: "¿Ha llegado algo del proveedor?",
      options: ["What has come in up to now", "When the parcel came in", "Who the supplier wrote to first"], answer: 0,
      why: "The perfect asks what there is up to now, not about one event." }
  ],
  yourTurn: [
    { en: "This morning I spoke to the supplier.", es: "Esta mañana hablé con el proveedor.", accept: ["Esta mañana hablé con el proveedor.", "Hablé con el proveedor esta mañana."] },
    { en: "This month we've had three delays.", es: "Este mes hemos tenido tres retrasos.", accept: ["Este mes hemos tenido tres [retrasos|demoras]."] },
    { en: "The material still hasn't arrived.", es: "El material todavía no ha llegado.", accept: ["El material [todavía|aún] no ha llegado.", "[Todavía|Aún] no ha llegado el material."] },
    { en: "I've never worked with them.", es: "Nunca he trabajado con ellos.", accept: ["Nunca he trabajado con ellos.", "No he trabajado nunca con ellos."] },
    { en: "Today I got up at five.", es: "Hoy me levanté a las cinco.", accept: ["Hoy me levanté a las cinco (de la mañana)."] }
  ],
  translate: [
    { en: "I have always thought that the decision to close the Cali office was a mistake.", es: "Siempre he pensado que la decisión de cerrar la oficina de Cali fue un error.", accept: ["Siempre he [pensado|creído] que la decisión de cerrar la oficina de Cali fue un error."] },
    { en: "Have you been to Leticia? I went last year and the flight cost me a fortune.", es: "¿Has ido a Leticia? Yo fui el año pasado y el vuelo me salió carísimo.", accept: ["¿Has ido (alguna vez) a Leticia? (Yo) fui el año pasado y el vuelo me salió [carísimo|muy caro].", "¿Has estado (alguna vez) en Leticia? (Yo) fui el año pasado y el vuelo me salió [carísimo|muy caro]."] },
    { en: "This year it has rained more than ever, and the road to the farm is still closed.", es: "Este año ha llovido más que nunca, y la carretera a la finca sigue cerrada.", accept: ["Este año ha llovido más que nunca, y la [carretera|vía] [a|hacia|de] la finca sigue cerrada."] },
    { en: "Did you speak to Laura? I called her an hour ago, but she still hasn't answered.", es: "¿Hablaste con Laura? La llamé hace una hora, pero todavía no me ha contestado.", accept: ["¿Hablaste con Laura? La llamé hace una hora, pero [todavía|aún] no me ha [contestado|respondido].", "¿Hablaste con Laura? La llamé hace una hora, pero no me ha [contestado|respondido] [todavía|aún]."] },
    { en: "We have had a difficult month. The supplier let us down twice, and the client still hasn't signed the new contract.", es: "Hemos tenido un mes difícil. El proveedor nos falló dos veces, y el cliente todavía no ha firmado el contrato nuevo.", accept: ["Hemos tenido un mes difícil. El proveedor nos falló dos veces, y el cliente [todavía|aún] no ha firmado el [contrato nuevo|nuevo contrato]."] },
    { en: "I've been in Bogotá for six years and I've never got used to the cold.", es: "Llevo seis años en Bogotá y nunca me he acostumbrado al frío.", accept: ["Llevo seis años [en Bogotá|viviendo en Bogotá] y nunca me he acostumbrado al frío.", "Hace seis años que vivo en Bogotá y nunca me he acostumbrado al frío."] }
  ],
  register: [
    { es: "Esta mañana hablé con él.", en: "I spoke to him this morning.", when: "in Colombia and most of Latin America, always" },
    { es: "Esta mañana he hablado con él.", en: "I spoke to him this morning.", when: "what you will hear in Spain, so recognise it" },
    { es: "Todavía no me ha llamado.", en: "He still hasn't called me.", when: "anywhere, for something you are still waiting for" },
    { es: "La comisión resolvió el caso el pasado martes.", en: "The committee resolved the case last Tuesday.", when: "in a formal report, keeping events closed" }
  ],
  personal: {
    prompt: "Write three lines for a work update: something you did today, something still pending, and something your team has never done before.",
    constraints: [
      { type: "regex", pattern: "(hoy|esta mañana|esta tarde)[^.]*[a-zñ](é|í|ó)(\\s|[.,;!?]|$)", label: "something finished today: *esta mañana hablé*" },
      { type: "regex", pattern: "(todavía|aún) no (ha|han|hemos|he|has)\\s", label: "something still pending: *todavía no ha llegado*" },
      { type: "regex", pattern: "nunca (he|ha|hemos|han|has)\\s", label: "something never done so far: *nunca hemos...*" }
    ],
    model: "Esta mañana hablé con el proveedor y le mandé las fotos. Todavía no ha llegado el material. Nunca hemos trabajado con un plazo tan corto."
  },
  pitfalls: [
    "*Hoy he comido fuera* is not wrong; it is Spain. In Bogotá, *hoy almorcé afuera*.",
    "*Este mes tuvimos tres retrasos* closes the month as if it were over; *hemos tenido* keeps it open.",
    "*¿Ya llegó?* is everyday Colombian Spanish: *ya* does not need the perfect."
  ]
},

"gr-nucleo-verbal-c1": {
  source: "merged",
  hook: {
    line: "You are restoring an old house in Barichara with a builder called don Abel. Talking about the house, the work and the bill uses the verb at full stretch: who built it and what it is built of, how far along you are, and the moment your father saw the invoice.",
    es: "La casa fue construida en 1890 por un maestro de Zapatoca.\nEstá construida en tapia pisada.\nLlevamos pintadas tres habitaciones; la cocina está por terminar.",
    en: "The house was built in 1890 by a master builder from Zapatoca.\nIt is built of rammed earth.\nWe've painted three rooms so far; the kitchen is still to be finished."
  },
  examples: [
    { es: "La casa fue construida en 1890 por un maestro de obra que vino de Zapatoca.", en: "The house was built in 1890 by a master builder who came from Zapatoca." },
    { es: "Llevamos pintadas tres habitaciones, pero la cocina y el patio todavía están por terminar.", en: "We've painted three rooms so far, but the kitchen and the courtyard are still to be finished." },
    { es: "Cuando mi papá vio la factura, rompió a reír y acabó por pagarla sin decir nada.", en: "When my dad saw the invoice, he burst out laughing and ended up paying it without a word." }
  ],
  rule: "The verb carries more than an action here.\n*Fue construida* is the event, and can say who did it with *por*. *Está construida en tapia* is the result, with no *por*.\n*Ser* plus a quality, then *al* and the dictionary form: the quality is that act. *Fue muy amable al quedarse.* *Estuvo muy amable* is how he was that day.\n*Llevar* or *tener* plus a participle counts what is done so far, and the participle agrees: *llevamos pintadas tres paredes*.\n*Romper a* or *echarse a*: a sudden start. *Acabar por*: in the end, after resisting.\n*Estar por*: still to be done. *Venir a costar*: roughly.",
  readAndPick: [
    { q: "Who does *por un maestro* name?", es: "La casa fue construida en 1890 por un maestro de Zapatoca.",
      options: ["The person who built it", "The town the stone came from", "The man who owns it today"], answer: 0,
      why: "With *fue construida*, *por* names who did it: it reports the event." },
    { q: "What does *está construida en tapia* tell you?", es: "La casa está construida en tapia pisada.",
      options: ["Who built it", "What it is made of", "When it was finished"], answer: 1,
      why: "*Estar* plus the participle gives the result, what the house is now, with no doer." },
    { q: "How much painting is done?", es: "Llevamos pintadas tres habitaciones.",
      options: ["None yet, it starts soon", "Three rooms, and counting", "Every room in the house"], answer: 1,
      why: "*Llevar* plus a participle counts what is done so far; *pintadas* agrees with *habitaciones*." },
    { q: "Is the kitchen finished?", es: "La cocina está por terminar.",
      options: ["It was never started", "Yes, they finished it today", "No, it is still to be done"], answer: 2,
      why: "*Estar por* plus the dictionary form: something still waiting to be done." },
    { q: "How did don Abel's kindness show?", es: "Fue muy amable al quedarse hasta las nueve.",
      options: ["In staying until nine", "He is kind by nature", "He was cheerful that day"], answer: 0,
      why: "*Ser* plus *al* and the dictionary form: the kindness was that act, staying late." },
    { q: "What did his father do?", es: "Vio la factura y rompió a reír.",
      options: ["He tore the invoice in two", "He burst out laughing", "He broke a window in anger"], answer: 1,
      why: "*Romper a* plus the dictionary form is a sudden start: nothing was broken." }
  ],
  yourTurn: [
    { en: "The house was built in 1890.", es: "La casa fue construida en 1890.", accept: ["La casa fue construida en 1890.", "La casa se construyó en 1890."] },
    { en: "We've painted three rooms so far.", es: "Llevamos pintadas tres habitaciones.", accept: ["Llevamos pintadas tres [habitaciones|piezas|alcobas].", "Llevamos tres [habitaciones|piezas|alcobas] pintadas."] },
    { en: "The kitchen is still to be finished.", es: "La cocina está por terminar.", accept: ["La cocina [todavía|aún] está por terminar.", "La cocina está [todavía|aún] por terminar."] },
    { en: "He was very kind to stay until nine. (about the builder)", es: "Fue muy amable al quedarse hasta las nueve.", accept: ["Fue muy amable [al quedarse|en quedarse|quedándose] hasta las nueve."] },
    { en: "In the end he ended up paying it. (the invoice)", es: "Al final acabó por pagarla.", accept: ["Al final [acabó|terminó] por pagarla.", "Al final [acabó|terminó] pagándola."] }
  ],
  translate: [
    { en: "The bridge was built by the Spaniards, but today it is closed to lorries.", es: "El puente fue construido por los españoles, pero hoy está cerrado a los camiones.", accept: ["El puente fue construido por los españoles, pero hoy está cerrado [a los|para los] camiones."] },
    { en: "My grandmother was very generous in lending us the house for the whole month.", es: "Mi abuela fue muy generosa al prestarnos la casa todo el mes.", accept: ["Mi abuela fue muy generosa [al prestarnos|prestándonos] la casa (durante) todo el mes."] },
    { en: "I've written three letters to the mayor's office so far, and nobody has answered me.", es: "Llevo escritas tres cartas a la alcaldía y nadie me ha contestado.", accept: ["Llevo escritas tres cartas a la alcaldía y nadie me ha [contestado|respondido].", "Llevo tres cartas escritas a la alcaldía y nadie me ha [contestado|respondido]."] },
    { en: "When she heard the news, she burst into tears and couldn't stop for an hour.", es: "Cuando oyó la noticia, rompió a llorar y no pudo parar en una hora.", accept: ["Cuando [oyó|escuchó] la noticia, [rompió|se echó] a llorar y no pudo parar [en|durante] una hora."] },
    { en: "The work comes to roughly forty million pesos. The roof is already done; the floors are still to be done.", es: "La obra viene a costar unos cuarenta millones de pesos. El techo ya está hecho; los pisos están por hacer.", accept: ["La obra viene a costar unos cuarenta millones (de pesos). El techo ya está [hecho|listo]; los pisos están por hacer.", "La obra [cuesta más o menos|sale en unos] cuarenta millones (de pesos). El techo ya está [hecho|listo]; los pisos están por hacer."] },
    { en: "After months of saying no, my father ended up selling the farm to his cousin.", es: "Después de meses diciendo que no, mi papá acabó por venderle la finca a su primo.", accept: ["Después de meses diciendo que no, mi [papá|padre] [acabó|terminó] por venderle la finca a su primo.", "Después de meses diciendo que no, mi [papá|padre] [acabó|terminó] vendiéndole la finca a su primo."] }
  ],
  register: [
    { es: "Vendieron la casa.", en: "They sold the house.", when: "everyday speech, when who sold it does not matter" },
    { es: "Se vendió la casa.", en: "The house was sold.", when: "neutral, in speech or writing" },
    { es: "La casa fue vendida en 1990.", en: "The house was sold in 1990.", when: "the news, history books and official reports" }
  ],
  personal: {
    prompt: "Describe a building you know well, or a job in progress, in three lines: who built it, what it is made of or what state it is in, and how far along something is.",
    constraints: [
      { type: "regex", pattern: "\\b(fue|fueron) [a-z]+(ado|ada|ados|adas|ido|ida|idos|idas|cho|cha|to|ta)\\b", label: "the event: *fue construida por*" },
      { type: "regex", pattern: "\\b(está|están|estaba|estaban) ([a-z]+(ado|ada|ados|adas|ido|ida|idos|idas|cho|cha|to|ta)\\b|por [a-z]+r\\b)", label: "the result or what is left: *está hecha*, *está por terminar*" },
      { type: "regex", pattern: "\\b(llevo|llevamos|lleva|llevan|tengo|tenemos|tiene) [a-z]+(ados|adas|idos|idas|ado|ada|ido|ida|tos|tas|chas|chos)\\b", label: "what is done so far: *llevamos pintadas tres*" }
    ],
    model: "El edificio de mi abuela fue construido en 1960 por un arquitecto alemán. Está hecho de ladrillo y por dentro está muy deteriorado. Llevamos arregladas dos ventanas, pero el techo está por cambiar."
  },
  pitfalls: [
    "*La casa está construida por don Abel* mixes the two: the result takes no *por*. Say *fue construida por*.",
    "*Llevamos pintado tres habitaciones*: the participle agrees with what you count, *pintadas*.",
    "*Estar por* is still to be done; *estar para* is about to, or in the mood: *no estoy para bromas*."
  ]
},

"gr-formas-no-personales-c1": {
  source: "merged",
  hook: {
    line: "The residents' meeting in your building in Bogotá has just ended. The minutes are written in the shortest, most official Spanish there is, and the talk in the lift afterwards is just as short, and nothing like official.",
    es: "Aprobado el presupuesto, se pasó a votar la pintura de la fachada.\n¿Yo, pagar otra cuota extraordinaria? ¡Ni loco!\n¡Siempre quejándose, don Julio!",
    en: "With the budget approved, the meeting moved on to vote on painting the front.\nMe, pay another special levy? No way!\nAlways complaining, don Julio!"
  },
  examples: [
    { es: "Aprobado el presupuesto, la asamblea pasó a votar la pintura de la fachada del edificio.", en: "With the budget approved, the meeting moved on to vote on painting the front of the building." },
    { es: "De haber sabido que la cuota era tan alta, no habría votado a favor en marzo.", en: "Had I known the levy was so high, I wouldn't have voted for it in March." },
    { es: "Siendo así, lo mejor es pagar en dos partes y dejar el ascensor para el próximo año.", en: "That being so, the best thing is to pay in two parts and leave the lift for next year." }
  ],
  rule: "Three verb forms with no person can stand in for a whole sentence.\nA participle first means once that was done: *Aprobado el presupuesto, se votó la pintura.* It agrees with what follows, *aprobada la cuota*, and needs no *cuando*.\nA gerund first gives a reason or a condition: *Siendo así, votemos.* *Pagando a tiempo, no hay multa.*\n*De* plus the dictionary form is an if: *De ser así...* *De haber sabido, no voto.*\nIn a reaction, no full verb at all: *¿Yo, pagar otra cuota? ¡Ni loco!* *¡Siempre quejándose!*\n*Que* plus the dictionary form needs *mucho*, *algo* or *nada* before it: *Tenemos mucho que hacer.*",
  readAndPick: [
    { q: "When did they vote on the painting?", es: "Aprobado el presupuesto, se votó la pintura.",
      options: ["Before the budget", "Once the budget was passed", "Instead of the budget"], answer: 1,
      why: "A participle at the start means once that was done: the budget came first." },
    { q: "What does *de haber sabido* mean here?", es: "De haber sabido, no habría votado a favor.",
      options: ["Had I only known", "After finding out", "Because I knew"], answer: 0,
      why: "*De* plus the dictionary form works as an if; with *haber*, it is about the past." },
    { q: "Is don Julio asking a real question?", es: "¿Yo, pagar otra cuota extraordinaria? ¡Ni loco!",
      options: ["Yes, he wants to know the amount", "Yes, he's offering to pay it all", "No, he's rejecting the idea"], answer: 2,
      why: "*Yo* plus the dictionary form echoes the idea back, and *¡ni loco!* rejects it." },
    { q: "Which sentence is right?", es: "Hay que terminar antes de diciembre.",
      options: ["Tenemos el trabajo que hacer.", "Tenemos mucho trabajo que hacer.", "Tenemos mucho trabajo que hacemos."], answer: 1,
      why: "*Que* plus the dictionary form needs a vague amount before it: *mucho*, *algo*, *nada*." },
    { q: "What does *siendo así* do?", es: "Siendo así, lo mejor es pagar en dos partes.",
      options: ["It gives the reason", "It describes a person", "It sets a firm deadline"], answer: 0,
      why: "A gerund at the start gives the reason: since that is how things are." }
  ],
  yourTurn: [
    { en: "With the budget approved, they voted on the painting.", es: "Aprobado el presupuesto, se votó la pintura.", accept: ["[Aprobado|Una vez aprobado] el presupuesto, se votó la pintura.", "[Aprobado|Una vez aprobado] el presupuesto, votaron la pintura."] },
    { en: "Me, pay another levy? No way! (a man speaking)", es: "¿Yo, pagar otra cuota? ¡Ni loco!", accept: ["¿Yo, pagar otra cuota? ¡[Ni loco|Ni de riesgos|Jamás]!"] },
    { en: "Had I known, I wouldn't have come.", es: "De haberlo sabido, no habría venido.", accept: ["De haberlo sabido, no [habría|hubiera] venido.", "Si lo hubiera sabido, no [habría|hubiera] venido."] },
    { en: "We have a lot to do.", es: "Tenemos mucho que hacer.", accept: ["Tenemos mucho que hacer.", "Tenemos muchas cosas que hacer."] },
    { en: "That being so, let's vote.", es: "Siendo así, votemos.", accept: ["[Siendo así|Si es así], votemos.", "[Siendo así|Si es así], vamos a votar."] }
  ],
  translate: [
    { en: "Once the meeting was over, the neighbours stayed at the entrance arguing about the lift.", es: "Terminada la reunión, los vecinos se quedaron en la entrada discutiendo por el ascensor.", accept: ["[Terminada|Una vez terminada|Acabada] la reunión, los vecinos se quedaron en la entrada discutiendo [por el|sobre el|del] ascensor."] },
    { en: "Paying on time, nobody gets a fine; paying late, the levy goes up ten percent.", es: "Pagando a tiempo, nadie tiene multa; pagando tarde, la cuota sube un diez por ciento.", accept: ["Pagando a tiempo, nadie tiene multa; pagando tarde, la cuota sube (un) diez por ciento.", "Si se paga a tiempo, nadie tiene multa; si se paga tarde, la cuota sube (un) diez por ciento."] },
    { en: "Me, apologise to the administrator? Not a chance. He's the one who owes us an explanation. (a woman speaking)", es: "¿Yo, pedirle disculpas al administrador? Ni loca. Él es el que nos debe una explicación.", accept: ["¿Yo, pedirle [disculpas|perdón] al administrador? [Ni loca|Ni de riesgos|Jamás]. Él es [el que|quien] nos debe una explicación."] },
    { en: "Had we known about the leak, we would have fixed it before the rainy season.", es: "De haber sabido lo de la gotera, la habríamos arreglado antes del invierno.", accept: ["De haber sabido lo de la gotera, la [habríamos|hubiéramos] arreglado antes del invierno.", "Si hubiéramos sabido lo de la gotera, la [habríamos|hubiéramos] arreglado antes del invierno."] },
    { en: "Always complaining about the noise, and then he throws parties himself every Friday!", es: "¡Siempre quejándose del ruido, y después él mismo hace fiestas todos los viernes!", accept: ["¡Siempre quejándose del ruido, y [después|luego] él mismo hace fiestas todos los viernes!"] },
    { en: "We have nothing more to discuss; the administrator is sending the minutes on Monday.", es: "No tenemos nada más que discutir; el administrador manda el acta el lunes.", accept: ["No tenemos nada más que discutir; el administrador [manda|va a mandar|enviará|envía] el acta el lunes."] }
  ],
  register: [
    { es: "Aprobado el presupuesto, se levantó la sesión.", en: "With the budget approved, the session was closed.", when: "minutes, reports and official letters" },
    { es: "Cuando aprobaron el presupuesto, se acabó la reunión.", en: "When they approved the budget, the meeting ended.", when: "telling a neighbour what happened" },
    { es: "¿Yo, pagar eso? ¡Ni loco!", en: "Me, pay that? No way!", when: "with friends and family, never with the administrator" }
  ],
  personal: {
    prompt: "Write two lines of minutes for a meeting you went to, then the line you said to a friend afterwards.",
    constraints: [
      { type: "regex", pattern: "(^|[.!?:]\\s*)(una vez )?[a-záéíóúñ]+(ado|ada|ados|adas|ido|ida|idos|idas|cho|cha|to|ta)\\s+(el|la|los|las)\\s", label: "open with a participle: *Aprobado el presupuesto*" },
      { type: "regex", pattern: "¿\\s*(yo|nosotros|nosotras|tú)\\s*,?\\s*[a-záéíóúñ]+(ar|er|ir)(le|la|lo|les|los|las|se|me|te)?\\b", label: "a reaction with no full verb: *¿Yo, pagar eso?*" }
    ],
    model: "Aprobada la cuota extraordinaria, se pasó al punto de la portería. Terminada la votación, se levantó la sesión. Después le dije a mi vecina: ¿Yo, pagar otra cuota? ¡Ni loca!"
  },
  pitfalls: [
    "*Una vez que aprobado el plan* is wrong: with a participle, no *que*. *Una vez aprobado el plan*.",
    "*Tengo el problema que resolver* fails: with *que* plus the dictionary form, say *un problema* or *mucho*.",
    "Never a gerund for what comes after: *llegó y se sentó*, not *llegó, sentándose*."
  ]
},

"gr-imperativo-c1": {
  source: "merged",
  hook: {
    line: "A Sunday at a friend's finca near Villeta. The river is cold, your friend Camilo is standing on the rock, and everyone is shouting orders at him. Not one of them is really an order.",
    es: "¡Tírate y verás que no está tan fría!\n¡Mira que eres miedoso, Camilo!\n¡Dale, hágale!",
    en: "Jump in and you'll see it isn't that cold!\nYou really are a scaredy-cat, Camilo!\nGo on, go for it!"
  },
  examples: [
    { es: "Tírate al río y verás que el agua no está tan fría como parece desde la piedra.", en: "Jump into the river and you'll see the water isn't as cold as it looks from the rock." },
    { es: "¡Mira que te lo dije! Te dije que trajeras otra muda de ropa para el regreso.", en: "I did tell you! I told you to bring a change of clothes for the trip back." },
    { es: "Dile a mi mamá que nos tiramos del puente y te mata, así que mejor no digas nada.", en: "Tell my mum we jumped off the bridge and she'll kill you, so better not say anything." }
  ],
  rule: "Some commands give no order at all.\nA command, *y*, then a result is an if: *Tírate y verás* means if you jump, you'll see. *Dile eso a mi mamá y te mata* is a warning: nobody wants you to say it.\n*Mira que* plus an ordinary sentence means you really are, or I did: *¡Mira que eres miedoso!* *¡Mira que te lo dije!* Nobody is asked to look. To someone you call usted, *mire que*.\nIn Colombia *¡dale!* says yes, go on: *¿Vamos? Dale.* *¡Hágale!* pushes someone to do it.\nTo close a discussion, an order plus *te dije*: *Sal del agua, te dije.*",
  readAndPick: [
    { q: "What is Camilo being told?", es: "Tírate y verás que no está tan fría.",
      options: ["If you jump in, you'll find out", "Jump, then look all around you", "Don't jump, the water's freezing"], answer: 0,
      why: "A command plus *y* and a result works as an if: jump and you'll see." },
    { q: "Should he tell her mum?", es: "Dile eso a mi mamá y te mata.",
      options: ["Yes, she'd like to know", "No, it's a warning", "Yes, but only later on"], answer: 1,
      why: "The command is only the if: say that, and she'll kill you." },
    { q: "Is anyone being asked to look?", es: "¡Mira que eres miedoso, Camilo!",
      options: ["Yes, at the cold river", "Yes, at the rock", "No, it's teasing him"], answer: 2,
      why: "*Mira que* plus a plain sentence means you really are: it teases, it doesn't point." },
    { q: "Your friend asks if you're leaving now and you say *¡dale!* What did you say?", es: "¿Nos vamos ya? ¡Dale!",
      options: ["Sure, let's go", "Give it to me", "Stop asking me that"], answer: 0,
      why: "In Colombia *dale* is a cheerful yes; in Spain *¡y dale!* can complain about insistence." },
    { q: "What does *te dije* add?", es: "Sal del agua, te dije.",
      options: ["It closes the discussion", "It reports what he said", "It softens the order"], answer: 0,
      why: "*Te dije* after an order adds no news: it shuts the discussion down." }
  ],
  yourTurn: [
    { en: "Try it and you'll see. (to a friend)", es: "Pruébalo y verás.", accept: ["Pruébalo y [verás|vas a ver]."] },
    { en: "You really are stubborn! (to a friend)", es: "¡Mira que eres terco!", accept: ["¡Mira que eres [terco|terca|testarudo|testaruda]!"] },
    { en: "I did tell you! (to a friend)", es: "¡Mira que te lo dije!", accept: ["¡Mira que (yo) te lo dije!"] },
    { en: "You tell her that and she'll kill you.", es: "Dile eso y te mata.", accept: ["Dile eso y te [mata|va a matar]."] },
    { en: "Get out of the water, I said. (to a friend)", es: "Sal del agua, te dije.", accept: ["Sal del agua, te dije.", "¡Que salgas del agua, te dije!"] }
  ],
  translate: [
    { en: "Call your sister and you'll see that she isn't angry with you any more.", es: "Llama a tu hermana y vas a ver que ya no está brava contigo.", accept: ["Llama a tu hermana y [vas a ver|verás] que ya no está [brava|enojada] contigo."] },
    { en: "Leave the car on the road and they'll give you a fine, so park it at the farm.", es: "Deja el carro en la vía y te ponen un comparendo, así que parquéalo en la finca.", accept: ["Deja el carro en la [vía|carretera] y te ponen [un comparendo|una multa], así que [parquéalo|déjalo] en la finca."] },
    { en: "You really are lucky! It's the second time this year you've won the raffle.", es: "¡Mira que tienes suerte! Es la segunda vez este año que te ganas la rifa.", accept: ["¡Mira que tienes suerte! Es la segunda vez este año que te ganas la rifa.", "¡Mira que tienes suerte! Es la segunda vez que te ganas la rifa este año."] },
    { en: "Shall we go to the river now? Sure, but take a towel, it gets cold later.", es: "¿Vamos al río ya? Dale, pero lleva una toalla, que más tarde hace frío.", accept: ["¿Vamos [al río ya|ya al río]? [Dale|Listo], pero lleva una toalla, que más tarde hace frío."] },
    { en: "Go on, go for it! You've been standing on that rock looking at the water for half an hour.", es: "¡Hágale, pues! Ya llevas media hora parado en esa piedra mirando el agua.", accept: ["¡[Hágale, pues|Hágale|Dale]! (Ya) llevas media hora parado en esa piedra mirando el agua."] },
    { en: "Turn off that phone and go to sleep, I said. Tomorrow we're leaving at five.", es: "Apaga ese celular y vete a dormir, te dije. Mañana salimos a las cinco.", accept: ["Apaga ese celular y [vete|ve] a dormir, te dije. Mañana salimos a las cinco.", "¡Que apagues ese celular y te vayas a dormir, te dije! Mañana salimos a las cinco."] }
  ],
  register: [
    { es: "¡Dale!", en: "Sure, go on!", when: "in Colombia, a quick yes among friends" },
    { es: "¡Listo!", en: "OK, done!", when: "in Colombia, with anyone, to agree" },
    { es: "Con mucho gusto.", en: "My pleasure.", when: "to a client or to someone you call usted" },
    { es: "¡Y dale con lo mismo!", en: "Not that again!", when: "when someone keeps insisting and you are fed up" }
  ],
  personal: {
    prompt: "A friend won't try something new: a dish, a dance, a ride. Write three lines to push them, with one command that works as an if and one *mira que*.",
    constraints: [
      { type: "regex", pattern: "[a-záéíóúñ]+\\s+y\\s+(verás|vas a ver)", label: "a command that works as an if: *pruébalo y verás*" },
      { type: "containsAny", words: ["mira que", "mire que"], label: "*mira que* plus a plain sentence" }
    ],
    model: "¡Mira que eres desconfiado! Prueba la lechona y verás que no está grasosa. ¡Dale, hágale, que se acaba!"
  },
  pitfalls: [
    "*Mira que eres terco* is not *look that you are*: nobody looks, it means *you really are*.",
    "In Spain *¡dale!* or *¡y dale!* can complain about insistence; in Colombia *dale* says yes.",
    "*Pruébalo y verás* needs *y*: with *si*, say it in full, *si lo pruebas, verás*."
  ]
},

"fn-hipotesis-posibilidad-c1": {
  source: "old",
  hook: {
    line: "You and your partner have spent years in Bogotá traffic. One Sunday, on the drive back from a weekend on the coast, one of you says it out loud: what if we moved to Santa Marta? The whole drive home is made of maybes.",
    es: "¿Y si nos fuéramos a vivir a Santa Marta?\nSi tuvieras que decidir hoy, ¿qué harías?\nPara mí que tu jefe ya sabe que te quieres ir.",
    en: "What if we moved to Santa Marta?\nIf you had to decide today, what would you do?\nIf you ask me, your boss already knows you want to leave."
  },
  examples: [
    { es: "¿Y si nos fuéramos a vivir a Santa Marta y yo trabajara desde la casa?", en: "What if we moved to Santa Marta and I worked from home?" },
    { es: "En el caso de que no consiguiéramos trabajo allá, ¿cuánto tiempo aguantaríamos con lo ahorrado?", en: "If we didn't find work there, how long would we last on our savings?" },
    { es: "Para mí que tu jefe ya sabe que te quieres ir, porque últimamente te trata distinto.", en: "If you ask me, your boss already knows you want to leave, because he's been treating you differently lately." }
  ],
  rule: "To open a scenario, *¿Y si* plus the *-ra* form: *¿Y si nos fuéramos a Santa Marta?* About the past: *¿Y si hubiéramos comprado allá hace diez años?*\nTo ask someone to imagine it: *Si tuvieras que decidir hoy, ¿qué harías?*\nMore carefully, in a meeting or in writing: *En el caso de que* plus the subjunctive: *en el caso de que no consiguiéramos trabajo*.\nFor a hunch you cannot prove: *Para mí que* plus the indicative: *Para mí que ya sabe.*\nFor a plain maybe, Colombia says *de pronto*: *De pronto nos aburrimos allá.* *A lo mejor* works too. Both take the indicative.",
  readAndPick: [
    { q: "What is she doing?", es: "¿Y si nos fuéramos a vivir a Santa Marta?",
      options: ["Putting an idea on the table", "Remembering an old move together", "Asking how to get there by car"], answer: 0,
      why: "*¿Y si* plus the *-ra* form opens a scenario for both of them to imagine." },
    { q: "How sure is he about the boss?", es: "Para mí que tu jefe ya sabe.",
      options: ["He has proof of it", "It's a hunch of his", "The boss told him"], answer: 1,
      why: "*Para mí que* gives a personal hunch, something he can't prove." },
    { q: "What does *de pronto* mean here?", es: "De pronto nos aburrimos allá.",
      options: ["Suddenly", "Soon", "Maybe"], answer: 2,
      why: "In Colombia *de pronto* is a common maybe; elsewhere it often means suddenly." },
    { q: "Is this about the future or the past?", es: "¿Y si hubiéramos comprado allá hace diez años?",
      options: ["The future, some years ahead", "A past that didn't happen", "The present moment"], answer: 1,
      why: "*Hubiéramos comprado* imagines a past that did not happen." },
    { q: "Where would you most likely hear this?", es: "En el caso de que no se aprobara el crédito, ¿qué alternativas tendríamos?",
      options: ["A meeting at the bank", "A chat over beer", "A story for a child"], answer: 0,
      why: "*En el caso de que* is the careful frame, for meetings and writing." }
  ],
  yourTurn: [
    { en: "What if we moved to Santa Marta?", es: "¿Y si nos fuéramos a vivir a Santa Marta?", accept: ["¿Y si nos [fuéramos|mudáramos|pasáramos] a (vivir a) Santa Marta?"] },
    { en: "If you had to decide today, what would you do?", es: "Si tuvieras que decidir hoy, ¿qué harías?", accept: ["Si tuvieras que [decidir|elegir|escoger] hoy, ¿qué harías?", "Si hoy tuvieras que [decidir|elegir|escoger], ¿qué harías?"] },
    { en: "If you ask me, he already knows.", es: "Para mí que ya sabe.", accept: ["Para mí que (él) ya (lo) sabe."] },
    { en: "Maybe we'll get bored there.", es: "De pronto nos aburrimos allá.", accept: ["[De pronto|A lo mejor] nos aburrimos [allá|allí]."] },
    { en: "What if we had bought there ten years ago?", es: "¿Y si hubiéramos comprado allá hace diez años?", accept: ["¿Y si hubiéramos comprado [allá|allí] hace diez años?"] }
  ],
  translate: [
    { en: "If you could live anywhere in Colombia, which city would you choose and why?", es: "Si pudieras vivir en cualquier parte de Colombia, ¿qué ciudad escogerías y por qué?", accept: ["Si pudieras vivir en cualquier [parte|lugar] de Colombia, ¿qué ciudad [escogerías|elegirías] y por qué?"] },
    { en: "What if we sold the car and used the money for the first months of rent?", es: "¿Y si vendiéramos el carro y usáramos la plata para los primeros meses de arriendo?", accept: ["¿Y si vendiéramos el carro y [usáramos|utilizáramos] la plata para los primeros meses de arriendo?"] },
    { en: "In the event that the flight were cancelled, the airline would cover the hotel.", es: "En el caso de que se cancelara el vuelo, la aerolínea cubriría el hotel.", accept: ["En [el caso de|caso de] que se cancelara el vuelo, la aerolínea cubriría el hotel.", "En [el caso de|caso de] que cancelaran el vuelo, la aerolínea cubriría el hotel."] },
    { en: "If you ask me, it's going to rain. Maybe it's better to leave the beach for tomorrow.", es: "Para mí que va a llover. De pronto es mejor dejar la playa para mañana.", accept: ["Para mí que va a llover. [De pronto|A lo mejor] es mejor dejar la playa para mañana."] },
    { en: "What if we had stayed in Bogotá? We would never have met these neighbours.", es: "¿Y si nos hubiéramos quedado en Bogotá? Nunca habríamos conocido a estos vecinos.", accept: ["¿Y si nos hubiéramos quedado en Bogotá? Nunca [habríamos|hubiéramos] conocido a estos vecinos.", "¿Y si nos hubiéramos quedado en Bogotá? No [habríamos|hubiéramos] conocido nunca a estos vecinos."] },
    { en: "If you had to choose between the sea and the mountains, which would you go for?", es: "Si tuvieras que elegir entre el mar y la montaña, ¿con cuál te quedarías?", accept: ["Si tuvieras que [elegir|escoger] entre el mar y la montaña, ¿con cuál te quedarías?"] }
  ],
  register: [
    { es: "De pronto llueve.", en: "Maybe it'll rain.", when: "in Colombia, in everyday speech" },
    { es: "A lo mejor llueve.", en: "Maybe it'll rain.", when: "anywhere in Latin America, in everyday speech" },
    { es: "Es posible que llueva.", en: "It may rain.", when: "neutral, in speech or writing" },
    { es: "Cabe la posibilidad de que llueva.", en: "There is a possibility of rain.", when: "formal: a report, a forecast, a meeting" }
  ],
  personal: {
    prompt: "Put a big change on the table for someone you live or work with. Write three lines: the proposal, a question that asks them to imagine it, and your hunch about how it would go.",
    constraints: [
      { type: "regex", pattern: "¿\\s*y si\\s", label: "open the scenario: *¿Y si...?*" },
      { type: "regex", pattern: "\\bsi [a-záéíóúñ ]*[a-z]+(ras|ra|ramos|ran|ieras|iera|iéramos|ieran)\\b", label: "ask them to imagine it: *si tuvieras que...*" },
      { type: "containsAny", words: ["para mí que", "de pronto", "a lo mejor"], label: "your hunch: *para mí que*, *de pronto*" }
    ],
    model: "¿Y si montáramos una panadería en Villa de Leyva? Si tuvieras que dejar tu trabajo mañana, ¿lo harías? Para mí que nos iría muy bien."
  },
  pitfalls: [
    "*De pronto* in Colombia usually means maybe, not suddenly: *de pronto llego tarde* is a warning, not a story.",
    "*¿Y si nos vamos?* with the present is a real suggestion for now; *¿y si nos fuéramos?* imagines it.",
    "*Para mí que* is a hunch, not a reasoned view: for that, *en mi opinión*."
  ]
},

"fn-obligacion-necesidad-c1": {
  source: "merged",
  hook: {
    line: "You are renting your first apartment in Medellín, and the agent walks you through the contract. Every line of it says where a duty comes from: you, the contract, or nowhere at all, and some say only the least you have to do.",
    es: "El contrato lo obliga a avisar con tres meses.\nNo tiene obligación de pintar al salir.\nBasta con que nos mande la carta laboral.",
    en: "The contract requires you to give three months' notice.\nYou are under no obligation to paint when you leave.\nAll you need to do is send us the letter from your employer."
  },
  examples: [
    { es: "El contrato lo obliga a avisar con tres meses de anticipación si decide no renovar.", en: "The contract requires you to give three months' notice if you decide not to renew." },
    { es: "Es obligación del arrendatario pagar la administración, pero los arreglos grandes le tocan al dueño.", en: "Paying the building fees is the tenant's duty, but the big repairs fall to the owner." },
    { es: "Para el estudio basta con que nos mande la carta laboral y los datos de un codeudor.", en: "For the background check, all you need to send us is your employment letter and a guarantor's details." }
  ],
  rule: "Spanish says where a duty comes from.\nIt is yours: *Es mi obligación* plus the dictionary form, or *estoy obligado a*. *Es obligación del arrendatario pagar la administración.*\nSomething outside imposes it: *El contrato me obliga a avisar.* *Las circunstancias nos obligaron a irnos.* *Obligar* always takes *a*.\nThere is none: *No tiene obligación de pintar.* *Nada lo obliga a renovar.* That means you don't have to, not that you can't.\nOnly the minimum: *Basta con* plus the dictionary form, or *basta con que* plus the subjunctive when someone else acts: *Basta con que nos mande la carta.* *No basta con* means it is not enough.",
  readAndPick: [
    { q: "Where does this duty come from?", es: "El contrato lo obliga a avisar con tres meses.",
      options: ["From his conscience", "From the contract he signed", "From the owner's good will"], answer: 1,
      why: "*Me obliga a* puts the source outside you: here, the contract." },
    { q: "Does he have to paint the flat when he leaves?", es: "No tiene obligación de pintar al salir.",
      options: ["No, it isn't required", "Yes, it's in the contract", "He is not allowed to"], answer: 0,
      why: "*No tiene obligación de* says you don't have to; it does not forbid it." },
    { q: "How much does she need to send?", es: "Basta con que nos mande la carta laboral.",
      options: ["Lots of papers", "Nothing at all", "Only that one letter"], answer: 2,
      why: "*Basta con que* names the minimum: that letter is all it takes." },
    { q: "What is the speaker saying?", es: "No basta con pagar a tiempo; también hay que cuidar el apartamento.",
      options: ["Paying on time is all it takes", "Paying on time is not enough", "Paying late is perfectly fine"], answer: 1,
      why: "*No basta con* says the minimum is not enough: more is needed." },
    { q: "Who chose to take on this duty?", es: "Es mi obligación avisarles a los vecinos.",
      options: ["The speaker, as his own", "The building's strict rules", "Nobody in particular"], answer: 0,
      why: "*Es mi obligación* presents the duty as your own, taken on by you." }
  ],
  yourTurn: [
    { en: "The contract requires me to give three months' notice.", es: "El contrato me obliga a avisar con tres meses.", accept: ["El contrato me obliga a avisar con tres meses (de anticipación)."] },
    { en: "You don't have to paint when you leave. (to a man you call usted)", es: "No tiene obligación de pintar al salir.", accept: ["No tiene (la) obligación de pintar al [salir|irse].", "No está obligado a pintar al [salir|irse]."] },
    { en: "All you need to do is send us the letter. (to someone you call usted)", es: "Basta con que nos mande la carta.", accept: ["Basta con que nos [mande|envíe] la carta."] },
    { en: "Nothing forces you to renew. (to a man you call usted)", es: "Nada lo obliga a renovar.", accept: ["Nada lo obliga a renovar."] },
    { en: "It's my duty to tell the neighbours.", es: "Es mi obligación avisarles a los vecinos.", accept: ["Es mi obligación [avisarles|decirles|contarles] a los vecinos."] }
  ],
  translate: [
    { en: "Circumstances forced us to leave the apartment two months before the contract ended.", es: "Las circunstancias nos obligaron a dejar el apartamento dos meses antes de que terminara el contrato.", accept: ["Las circunstancias nos obligaron a [dejar|entregar] el apartamento dos meses antes de que [terminara|se acabara|venciera] el contrato."] },
    { en: "You are not obliged to answer the survey, but it helps us improve the service. (to a man you call usted)", es: "No está obligado a responder la encuesta, pero nos ayuda a mejorar el servicio.", accept: ["No [está obligado a|tiene obligación de|tiene la obligación de] [responder|contestar] la encuesta, pero nos ayuda a mejorar el servicio."] },
    { en: "To open the account, all you need is your ID card and a utility bill.", es: "Para abrir la cuenta basta con la cédula y un recibo de servicios públicos.", accept: ["Para abrir la cuenta basta con la cédula y un recibo de servicios (públicos)."] },
    { en: "Wanting to change isn't enough. You have to sign up, go to class and do the work.", es: "No basta con querer cambiar. Hay que inscribirse, ir a clase y hacer el trabajo.", accept: ["No basta con querer cambiar. Hay que [inscribirse|matricularse], ir a clase y hacer el trabajo.", "No es suficiente con querer cambiar. Hay que [inscribirse|matricularse], ir a clase y hacer el trabajo."] },
    { en: "It wasn't her duty to look after her younger brothers, but nobody else was going to do it.", es: "No era su obligación cuidar a sus hermanos menores, pero nadie más lo iba a hacer.", accept: ["No era su obligación cuidar a sus hermanos [menores|pequeños|chiquitos], pero nadie más [lo iba a hacer|iba a hacerlo]."] },
    { en: "All you have to do is sign here and here, and the keys are yours. (to someone you call usted)", es: "Basta con que firme aquí y aquí, y las llaves son suyas.", accept: ["Basta con que firme aquí y aquí, y las llaves son suyas.", "Solo tiene que firmar aquí y aquí, y las llaves son suyas."] }
  ],
  register: [
    { es: "Me toca pagar la administración.", en: "I have to pay the building fees.", when: "in Colombia, in everyday speech" },
    { es: "Tengo que pagar la administración.", en: "I have to pay the building fees.", when: "anywhere, neutral" },
    { es: "Estoy obligado a pagar la administración.", en: "I am obliged to pay the building fees.", when: "when the rule matters more than your choice" },
    { es: "Corresponde al arrendatario el pago de la administración.", en: "Payment of the building fees falls to the tenant.", when: "in a contract or an official letter" }
  ],
  personal: {
    prompt: "Explain the rules of a place you know, a job, a flat or a club, to someone new: one duty that is theirs, one imposed from outside, and the least they have to do.",
    constraints: [
      { type: "containsAny", words: ["es tu obligación", "es su obligación", "es mi obligación", "es obligación", "estás obligado", "está obligado", "estás obligada", "está obligada"], label: "a duty that is theirs: *es su obligación*" },
      { type: "regex", pattern: "\\bobliga(n|ron|ba)?\\s+a\\s", label: "a duty imposed from outside: *el reglamento lo obliga a*" },
      { type: "containsAny", words: ["basta con"], label: "the minimum: *basta con que*" }
    ],
    model: "En el club es tu obligación dejar la cancha limpia. El reglamento nos obliga a reservar con un día de anticipación. Para entrar, basta con que muestres el carné."
  },
  pitfalls: [
    "*Obligar* always takes *a*: *me obliga a avisar*. After *tener*, *obligación* takes *de*: *no tengo obligación de*.",
    "*Basta con que* is the least you need, not an order: *tienes que* asks for more.",
    "*Nada lo obliga a renovar* means you are free to leave, not that you may not renew."
  ]
},

"nt-necesidad-obligacion-c1": {
  source: "merged",
  hook: {
    line: "The family bakery in Pasto has had a terrible year: flour up, gas up, customers down. Around the kitchen table your mother and your uncle go through the costs, from what they can do without to what they cannot, and land on the one decision nobody wanted.",
    es: "El letrero nuevo es un gasto prescindible.\nEl horno, en cambio, es imprescindible.\nNo nos quedó más remedio que subir los precios.",
    en: "The new sign is an expense we can do without.\nThe oven, on the other hand, is essential.\nWe had no choice but to put prices up."
  },
  examples: [
    { es: "El letrero nuevo es un gasto prescindible, pero sin el horno no hay panadería.", en: "The new sign is an expense we can do without, but without the oven there's no bakery." },
    { es: "Dadas las circunstancias, no nos quedó más remedio que subir el pan a mil pesos.", en: "Given the circumstances, we had no choice but to put the bread up to a thousand pesos." },
    { es: "Cerramos los lunes por necesidad, no por gusto: el gas nos estaba comiendo las ganancias.", en: "We close on Mondays out of necessity, not by choice: the gas was eating up our profits." }
  ],
  rule: "Grade how much you need something: *prescindible*, you can do without it; *conveniente*, it would help; *necesario*; *imprescindible*, you cannot do without it; *vital*, everything depends on it.\n*De primera necesidad* is for basics: food, water, medicine. Not for a phone.\nWhen there is only one door: *No nos quedó más remedio que* plus the dictionary form. In Colombia, *no queda de otra* and *nos tocó*: *Nos tocó subir los precios.*\nTo say it was forced, not chosen: *por necesidad, no por gusto*. To justify it in advance: *dadas las circunstancias*.",
  readAndPick: [
    { q: "Can they manage without the new sign?", es: "El letrero nuevo es un gasto prescindible.",
      options: ["Yes, easily", "No, never", "Only for a while"], answer: 0,
      why: "*Prescindible* is what you can do without; *imprescindible* is the opposite." },
    { q: "Did they want to put prices up?", es: "No nos quedó más remedio que subir los precios.",
      options: ["Yes, they had planned it for ages", "No, there was no way out", "They are still deciding it"], answer: 1,
      why: "*No quedar más remedio que* says every other option was gone." },
    { q: "Why do they close on Mondays?", es: "Cerramos los lunes por necesidad, no por gusto.",
      options: ["Because they like it", "Because the law says so", "Because they're forced to"], answer: 2,
      why: "*Por necesidad, no por gusto*: forced by the situation, not chosen." },
    { q: "What does *nos tocó* mean here?", es: "Nos tocó vender la camioneta.",
      options: ["It touched all of us deeply", "We were forced to do it", "It was our turn to buy one"], answer: 1,
      why: "In Colombia *me toca*, *nos tocó* is the everyday way to say you have to." },
    { q: "Which of these is *de primera necesidad*?", es: "En la tienda del barrio.",
      options: ["El arroz y el agua", "Un celular nuevo", "Una torta de cumpleaños"], answer: 0,
      why: "*De primera necesidad* is for basics: food, water, medicine." }
  ],
  yourTurn: [
    { en: "We had no choice but to raise the prices.", es: "No nos quedó más remedio que subir los precios.", accept: ["No nos quedó [más remedio|otra opción|otro remedio] que subir los precios.", "No nos quedó de otra que subir los precios."] },
    { en: "The new sign is an expense we can do without.", es: "El letrero nuevo es un gasto prescindible.", accept: ["El [letrero|aviso] nuevo es un gasto prescindible.", "El nuevo [letrero|aviso] es un gasto prescindible."] },
    { en: "The oven is essential.", es: "El horno es imprescindible.", accept: ["El horno es [imprescindible|indispensable]."] },
    { en: "We had to close on Mondays. (Colombia)", es: "Nos tocó cerrar los lunes.", accept: [] },
    { en: "We did it out of necessity, not by choice.", es: "Lo hicimos por necesidad, no por gusto.", accept: [] }
  ],
  translate: [
    { en: "Given the circumstances, the board decided to postpone the opening of the new branch until March.", es: "Dadas las circunstancias, la junta decidió aplazar la inauguración de la nueva sede hasta marzo.", accept: ["Dadas las circunstancias, la junta decidió [aplazar|posponer] la inauguración de la nueva sede hasta marzo."] },
    { en: "Rice, water and medicine are basic necessities; a new phone isn't.", es: "El arroz, el agua y los medicamentos son de primera necesidad; un celular nuevo no.", accept: ["El arroz, el agua y los [medicamentos|remedios] son de primera necesidad; un celular nuevo no."] },
    { en: "We didn't want to sell the van. But the bank didn't give us the loan, and there was no other way.", es: "No queríamos vender la camioneta. Pero el banco no nos dio el crédito, y no quedó de otra.", accept: ["No queríamos vender la camioneta. Pero el banco no nos dio el [crédito|préstamo], y no [quedó|nos quedó] [de otra|otro remedio|más remedio]."] },
    { en: "For the trip, a good pair of boots is essential; the second jacket you can do without.", es: "Para el viaje, unas buenas botas son imprescindibles; la segunda chaqueta es prescindible.", accept: ["Para el viaje, unas buenas botas son [imprescindibles|indispensables]; la segunda chaqueta es prescindible."] },
    { en: "We had to work the whole of December, so we couldn't go to my grandmother's farm. (Colombia)", es: "Nos tocó trabajar todo diciembre, así que no pudimos ir a la finca de mi abuela.", accept: ["[Nos tocó|Tuvimos que] trabajar todo (el mes de) diciembre, así que no pudimos ir a la finca de mi abuela."] },
    { en: "His help was decisive: without him we would have had to close the bakery.", es: "Su ayuda fue decisiva: sin él habríamos tenido que cerrar la panadería.", accept: ["Su ayuda fue [decisiva|fundamental|vital]: sin él [habríamos|hubiéramos] tenido que cerrar la panadería."] }
  ],
  register: [
    { es: "No queda de otra.", en: "There's nothing else for it.", when: "in Colombia, with family and friends" },
    { es: "Nos tocó.", en: "We had to.", when: "in Colombia, in everyday speech, at any age" },
    { es: "No tuvimos más remedio.", en: "We had no choice.", when: "anywhere, in speech or writing" },
    { es: "Nos vimos obligados a ajustar los precios.", en: "We were obliged to adjust our prices.", when: "a notice to customers or a formal letter" }
  ],
  personal: {
    prompt: "Something forced a change in your life or work. Write three lines: what you could do without, what you could not, and the decision that was left.",
    constraints: [
      { type: "containsAny", words: ["prescindible", "imprescindible", "indispensable", "de primera necesidad"], label: "how much you needed it: *prescindible*, *imprescindible*" },
      { type: "containsAny", words: ["más remedio", "otro remedio", "de otra", "me tocó", "nos tocó", "otra opción"], label: "no way out: *no me quedó más remedio que*, *me tocó*" }
    ],
    model: "Cuando perdí el trabajo, el gimnasio era prescindible, pero el internet era imprescindible para buscar otro. No me quedó más remedio que mudarme a la casa de mis papás."
  },
  pitfalls: [
    "*No nos quedó más remedios*: *remedio* stays singular, and the person goes before *quedó*: *nos*, *me*, *les*.",
    "*De primera necesidad* is for basic goods; for an important meeting, say *imprescindible*.",
    "*Me toca* is also *it's my turn*: *me toca a mí* in a game. The context tells which."
  ]
},

"fn-orden-instruccion-c1": {
  source: "old",
  hook: {
    line: "Your first week as coordinator of a small team in Bogotá. You need a report out of three people, a printout out of the intern and a window closed by someone who outranks you, and every request sits on a different rung.",
    es: "Les pido el favor de que me manden el informe antes del viernes.\nMe hace el favor y me imprime esto.\nUy, qué frío está haciendo aquí, ¿no?",
    en: "Please would you all send me the report before Friday.\nWould you print this for me, please.\nGosh, it's cold in here, isn't it?"
  },
  examples: [
    { es: "Les pido el favor de que me manden el informe antes del viernes al mediodía.", en: "Please would you all send me the report before Friday at noon." },
    { es: "Necesitaría que me confirmaran la asistencia hoy mismo, porque mañana cierro la lista.", en: "I'd need you to confirm your attendance today, because I'm closing the list tomorrow." },
    { es: "Convendría revisar el contrato con el abogado antes de firmarlo, por si acaso.", en: "It would be wise to go over the contract with the lawyer before signing it, just in case." }
  ],
  rule: "An order has a ladder, and you choose the rung.\nBlunt, with no room to answer: the present, *Tú te quedas aquí*, or the future, *Harás lo que te diga.*\nSoftened, the Colombian way: *Me hace el favor y* plus the present: *Me hace el favor y me imprime esto.* *Le pido el favor de que* plus the subjunctive.\nDisguised as your need: *Necesitaría que* plus the *-ra* form. As advice: *Convendría revisarlo.*\nCeremonious: *¿Sería tan amable de...?*\nHidden: a remark that is an order. *Uy, qué frío está haciendo* means close the window.\nGo up a rung for rank, distance and a big ask.",
  readAndPick: [
    { q: "Is the intern being asked or told?", es: "Me hace el favor y me imprime esto.",
      options: ["Told, in a polite way", "Asked whether he has time", "Neither, it is only a joke"], answer: 0,
      why: "*Me hace el favor y* plus the present is a polite order, and very Colombian." },
    { q: "What does the boss want?", es: "Uy, qué frío está haciendo aquí, ¿no?",
      options: ["The window shut, please", "A chat about the weather", "A hot cup of coffee"], answer: 0,
      why: "A remark can be an order: everyone knows she wants the window closed." },
    { q: "How much room is there to argue?", es: "Harás lo que te diga.",
      options: ["Plenty, it is a suggestion", "None at all, it's settled", "Some, it is only a guess"], answer: 1,
      why: "The future used as an order presents it as already decided." },
    { q: "Why *necesitaría*?", es: "Necesitaría que me confirmaran hoy.",
      options: ["It refers to next week", "It shows she's unsure of herself", "It frames the order as a need"], answer: 2,
      why: "*Necesitaría que* turns an order into the speaker's own need, which softens it." },
    { q: "Which fits a request to the general manager?", es: "Le pide que revise el informe.",
      options: ["Revíseme esto ya, ¿oyó?", "¿Sería tan amable de revisarlo?", "¿Me lo revisas, porfa?"], answer: 1,
      why: "*¿Sería tan amable de...?* is the ceremonious rung, for rank and distance." }
  ],
  yourTurn: [
    { en: "Would you print this for me, please. (to a colleague you call usted)", es: "Me hace el favor y me imprime esto.", accept: ["Me hace el favor y me imprime esto.", "¿Me hace el favor de imprimirme esto?"] },
    { en: "I'd need you all to confirm today.", es: "Necesitaría que me confirmaran hoy.", accept: ["Necesitaría que me confirmaran hoy (mismo)."] },
    { en: "It would be wise to check the contract.", es: "Convendría revisar el contrato.", accept: [] },
    { en: "Please would you all send me the report. (Colombia, to your team)", es: "Les pido el favor de que me manden el informe.", accept: ["Les pido (el) favor (de) que me [manden|envíen] el informe."] },
    { en: "Would you be so kind as to close the door? (to someone you call usted)", es: "¿Sería tan amable de cerrar la puerta?", accept: ["¿Sería tan amable de cerrar la puerta?", "¿Tendría la amabilidad de cerrar la puerta?"] }
  ],
  translate: [
    { en: "Please would you all hand in the timesheets before five, because payroll closes today.", es: "Les pido el favor de que entreguen las planillas antes de las cinco, porque hoy cierra nómina.", accept: ["Les pido (el) favor (de) que entreguen las planillas antes de las cinco, porque hoy cierra (la) nómina."] },
    { en: "If it's not too much trouble, send me the photos from the event when you can. (to a friend)", es: "Si no es mucha molestia, me mandas las fotos del evento cuando puedas.", accept: ["Si no es (mucha) molestia, me [mandas|envías] las fotos del evento cuando puedas."] },
    { en: "You're staying here until you finish, and you'll do as I say.", es: "Tú te quedas aquí hasta que termines, y harás lo que yo te diga.", accept: ["Tú te quedas aquí hasta que termines, y harás lo que (yo) te diga."] },
    { en: "It would be wise to make the summary shorter. The board won't read twenty pages.", es: "Convendría hacer el resumen más corto. La junta no va a leer veinte páginas.", accept: ["Convendría hacer el resumen más [corto|breve]. La junta no va a leer veinte páginas.", "Convendría acortar el resumen. La junta no va a leer veinte páginas."] },
    { en: "I'd need you to send me the signed contract today, because the bank closes at four. (formal)", es: "Necesitaría que me enviara hoy el contrato firmado, porque el banco cierra a las cuatro.", accept: ["Necesitaría que me [enviara|mandara] hoy el contrato firmado, porque el banco cierra a las cuatro.", "Necesitaría que me [enviara|mandara] el contrato firmado hoy, porque el banco cierra a las cuatro."] },
    { en: "Gosh, it's hot in here, isn't it? Nobody has opened a window all morning.", es: "Uy, qué calor está haciendo aquí, ¿no? Nadie ha abierto una ventana en toda la mañana.", accept: ["Uy, qué calor [está haciendo|hace] aquí, ¿no? Nadie [ha abierto|abrió] una ventana en toda la mañana."] }
  ],
  register: [
    { es: "Ciérrame la puerta.", en: "Close the door for me.", when: "to family, or to someone much younger" },
    { es: "Me hace el favor y cierra la puerta.", en: "Would you close the door, please.", when: "in Colombia, at work or with a stranger" },
    { es: "¿Será que me cierras la puerta?", en: "Could you possibly close the door?", when: "in Colombia, a soft ask among equals" },
    { es: "¿Sería tan amable de cerrar la puerta?", en: "Would you be so kind as to close the door?", when: "very formal, or ironic among friends" }
  ],
  personal: {
    prompt: "You are organising a family lunch for twenty. Give three instructions on three different rungs: one to your brother, one to an aunt you call usted, and one hidden in a remark.",
    constraints: [
      { type: "containsAny", words: ["me hace el favor", "le pido el favor", "necesitaría que", "convendría", "sería tan amable", "será que"], label: "a softened order: *me hace el favor y*, *necesitaría que*" },
      { type: "minSentences", n: 3, label: "three instructions or more" }
    ],
    model: "Juan, tú traes el hielo y las sillas. Tía Rosa, me hace el favor y me ayuda con el arroz. Uy, ya son las doce y la mesa sigue sin poner, ¿no?"
  },
  pitfalls: [
    "*Me hace el favor y me imprime esto* takes the present after *y*, not the subjunctive.",
    "*¿Sería tan amable de...?* to a friend sounds ironic: keep it for rank and distance.",
    "*Harás lo que te diga* is not a prediction: it is an order that admits no reply."
  ]
},

"fn-repetir-orden-c1": {
  source: "merged",
  hook: {
    line: "Sunday night in Bucaramanga. Your nephews should be in bed, the console is still on, and your sister has said it three times already. The fourth time, Spanish has ready-made words, and nobody expects an answer.",
    es: "¿Cuántas veces te tengo que decir que apagues eso?\nQue te vayas a bañar, te dije.\nPor última vez: a la cama.",
    en: "How many times do I have to tell you to turn that off?\nGo and have a shower, I said.\nFor the last time: bed."
  },
  examples: [
    { es: "¿Cuántas veces te tengo que decir que apagues la consola a las nueve, Santiago?", en: "How many times do I have to tell you to turn the console off at nine, Santiago?" },
    { es: "Que te vayas a bañar, te dije, que mañana hay colegio y no te levantas.", en: "Go and have a shower, I said, because there's school tomorrow and you won't get up." },
    { es: "Por última vez: o recoges los juguetes, o mañana no hay consola en todo el día.", en: "For the last time: either you pick up the toys, or there's no console all day tomorrow." }
  ],
  rule: "When an order has been ignored, it comes back in a fixed frame.\nA question nobody answers: *¿Cuántas veces te tengo que decir que* plus the subjunctive: *que apagues eso*. *¿Cómo te lo tengo que decir?*\nThe order again, with *que* and the subjunctive, then *te dije*: *Que te vayas a bañar, te dije.* The *que* says I am repeating myself.\nThe final warning: *Por última vez:* plus the order.\nTo pass the order on to someone else, *que* and the subjunctive: *Que lo recoja tu hermano.* *Que no entre nadie.*\nFor a group, *les*: *¿Cuántas veces les tengo que decir...?*",
  readAndPick: [
    { q: "What answer does his mother expect?", es: "¿Cuántas veces te tengo que decir que apagues eso?",
      options: ["A number of times", "Nothing, just obedience", "A good excuse"], answer: 1,
      why: "A complaint shaped as a question: the only answer wanted is the console off." },
    { q: "Why does she start with *que*?", es: "Que te vayas a bañar, te dije.",
      options: ["She's repeating an order", "She's wishing him luck", "She's asking very politely"], answer: 0,
      why: "*Que* plus the subjunctive, then *te dije*, repeats an order that was ignored." },
    { q: "Who is to pick up the toys?", es: "Que los recoja tu hermano.",
      options: ["You, this minute", "Your brother, not you", "Nobody, leave them"], answer: 1,
      why: "*Que* plus the subjunctive passes the order on to a third person." },
    { q: "What does *por última vez* announce?", es: "Por última vez: a la cama.",
      options: ["The very last game of the night", "A later bedtime for once", "After this, no more warnings"], answer: 2,
      why: "*Por última vez* says this is the final warning, whether or not it really is." },
    { q: "Who is being told off here?", es: "¿Cuántas veces les tengo que decir que no griten?",
      options: ["Just the one child, Santiago", "More than one child", "The neighbour next door"], answer: 1,
      why: "*Les* addresses a group; to one child, *te*." }
  ],
  yourTurn: [
    { en: "How many times do I have to tell you to turn that off? (to a child)", es: "¿Cuántas veces te tengo que decir que apagues eso?", accept: ["¿Cuántas veces te tengo que decir que apagues eso?", "¿Cuántas veces tengo que decirte que apagues eso?"] },
    { en: "Go and have a shower, I said. (to a child)", es: "Que te vayas a bañar, te dije.", accept: ["Que te vayas a bañar, te dije.", "Que te bañes, te dije."] },
    { en: "For the last time: bed.", es: "Por última vez: a la cama.", accept: ["Por última vez: (a la|para la) cama."] },
    { en: "Let your brother pick them up.", es: "Que los recoja tu hermano.", accept: ["Que los recoja tu hermano.", "Que tu hermano los recoja."] },
    { en: "How many times do I have to tell you all not to shout? (to a group of children)", es: "¿Cuántas veces les tengo que decir que no griten?", accept: ["¿Cuántas veces les tengo que decir que no griten?", "¿Cuántas veces tengo que decirles que no griten?"] }
  ],
  translate: [
    { en: "How many times do I have to tell you not to leave wet towels on the bed?", es: "¿Cuántas veces te tengo que decir que no dejes las toallas mojadas en la cama?", accept: ["¿Cuántas veces te tengo que decir que no dejes las toallas mojadas [en|sobre] la cama?", "¿Cuántas veces tengo que decirte que no dejes las toallas mojadas [en|sobre] la cama?"] },
    { en: "Sit down and eat, I said. The soup is getting cold and your grandmother is waiting.", es: "Que te sientes a comer, te dije. La sopa se enfría y tu abuela está esperando.", accept: ["Que te sientes a comer, te dije. La sopa se [enfría|está enfriando] y tu abuela [está esperando|te está esperando|te espera]."] },
    { en: "For the last time: either you turn off the television, or I take it away until Friday.", es: "Por última vez: o apagas el televisor, o te lo quito hasta el viernes.", accept: ["Por última vez: o apagas el televisor, o te lo quito hasta el viernes.", "Por última vez: o apagas la televisión, o te la quito hasta el viernes."] },
    { en: "The plumber's here. Let him in, and don't let the dog get out.", es: "Llegó el plomero. Que entre, y que no se salga el perro.", accept: ["(Ya) llegó el plomero. Que [entre|siga|pase], y que no se salga el perro."] },
    { en: "How else do I have to say it? The car keys stay in the kitchen, not in your room.", es: "¿Cómo te lo tengo que decir? Las llaves del carro se quedan en la cocina, no en tu cuarto.", accept: ["¿Cómo te lo tengo que decir? Las llaves del carro se quedan en la cocina, no en tu [cuarto|habitación|pieza].", "¿Cómo tengo que decírtelo? Las llaves del carro se quedan en la cocina, no en tu [cuarto|habitación|pieza]."] },
    { en: "Your sister is to come down right now, the bus leaves in five minutes.", es: "Que baje tu hermana ya mismo, que el bus sale en cinco minutos.", accept: ["Que baje tu hermana ya mismo, que el bus sale en cinco minutos.", "Que tu hermana baje ya mismo, que el bus sale en cinco minutos."] }
  ],
  register: [
    { es: "Apaga eso, por favor.", en: "Turn that off, please.", when: "the first time you ask" },
    { es: "Que apagues eso, te dije.", en: "Turn that off, I said.", when: "the second or third time" },
    { es: "¿Cuántas veces te lo tengo que decir?", en: "How many times do I have to tell you?", when: "when your patience has run out" },
    { es: "Se les recuerda que está prohibido fumar.", en: "You are reminded that smoking is not allowed.", when: "a written notice repeating a rule" }
  ],
  personal: {
    prompt: "Someone you live with keeps ignoring the same request. Write the second, the third and the last time you say it.",
    constraints: [
      { type: "regex", pattern: "\\bque [a-záéíóúñ ]*,\\s*te (dije|he dicho|estoy diciendo)", label: "the order again: *que* plus the subjunctive, then *te dije*" },
      { type: "containsAny", words: ["cuántas veces", "cómo te lo tengo que decir", "cómo tengo que decírtelo"], label: "the question nobody answers: *¿cuántas veces...?*" },
      { type: "containsAny", words: ["por última vez"], label: "the final warning: *por última vez*" }
    ],
    model: "Que laves los platos, te dije. ¿Cuántas veces te tengo que decir que no dejes la olla en el lavaplatos? Por última vez: o lavas, o mañana cocinas tú."
  },
  pitfalls: [
    "*Que apagas eso* is wrong: the repeated order takes the subjunctive, *que apagues*.",
    "*¿Cuántas veces...?* wants no number: answering *tres* is cheek.",
    "*Por última vez* is rarely the last time, and everyone knows it."
  ]
},

"fn-responder-orden-peticion-c1": {
  source: "old",
  hook: {
    line: "Your best friend Daniela is getting married in Cartagena in a month, and the requests have started arriving: a lift to the airport, the speech and, again, money. You answer each one on a different step, from a glad yes to a flat no.",
    es: "¿Me llevas al aeropuerto? ¡De una!\n¿Y si das tú el discurso? Bueno, siempre y cuando sea corto.\n¿Cómo así que te preste plata otra vez? Ni lo sueñes.",
    en: "Will you take me to the airport? Sure thing!\nAnd what if you gave the speech? Well, as long as it's short.\nWhat do you mean, lend you money again? Don't even dream of it."
  },
  examples: [
    { es: "¿Que si te llevo al aeropuerto el viernes? ¡De una! Paso por ti a las seis.", en: "Will I take you to the airport on Friday? Sure thing! I'll pick you up at six." },
    { es: "Listo, yo doy el discurso, siempre y cuando no tenga que hablar más de cinco minutos.", en: "OK, I'll give the speech, as long as I don't have to talk for more than five minutes." },
    { es: "Qué pena contigo, Dani, pero ese fin de semana me resulta imposible cuidarte el perro.", en: "I'm so sorry, Dani, but that weekend it's impossible for me to look after your dog." }
  ],
  rule: "Answering a request has steps too.\nA glad yes: *Con mucho gusto.* *¡Claro que sí!* *Eso está hecho.* With friends in Colombia, *¡de una!*\nYes, with a condition: *siempre y cuando* plus the subjunctive. Later: *cuando tenga un rato.* Nothing promised: *Veré qué puedo hacer.*\nA soft no: *Qué pena contigo, pero no puedo.* *Me temo que no va a ser posible.* *Sintiéndolo mucho, me resulta imposible.*\nA flat no: *Ni lo sueñes.* *Por nada del mundo.* *No tengo la menor intención de...*\nBefore answering, an echo: *¿Cómo así que te preste plata?* It can lead to a yes or a no.",
  readAndPick: [
    { q: "Will she drive her friend?", es: "¿Al aeropuerto? ¡De una!",
      options: ["Maybe, if she can find the time", "No, she has to work that day", "Yes, gladly, right away"], answer: 2,
      why: "*¡De una!* is a Colombian yes with no hesitation at all." },
    { q: "Has he promised anything?", es: "Veré qué puedo hacer.",
      options: ["Yes, this week", "Not really, nothing firm", "No, he refused outright"], answer: 1,
      why: "*Veré qué puedo hacer* sounds helpful and promises nothing." },
    { q: "What does *qué pena contigo* do here?", es: "Qué pena contigo, pero no puedo ir.",
      options: ["Apologises before a no", "Says she feels sad for him", "Says she is ashamed"], answer: 0,
      why: "In Colombia *qué pena contigo* is a soft sorry, here before a refusal." },
    { q: "Will she lend the money?", es: "¿Cómo así que te preste plata otra vez? Ni lo sueñes.",
      options: ["Yes, once she has grumbled a bit", "Only half, and next month", "No, not in his wildest dreams"], answer: 2,
      why: "*¿Cómo así que...?* echoes the request in disbelief, and *ni lo sueñes* is a flat no." },
    { q: "What is the condition?", es: "Doy el discurso siempre y cuando sea corto.",
      options: ["That the speech is short", "That someone else writes it", "That she is paid for it"], answer: 0,
      why: "*Siempre y cuando* plus the subjunctive sets the condition for a yes." }
  ],
  yourTurn: [
    { en: "Consider it done.", es: "Eso está hecho.", accept: ["Eso está hecho.", "¡Eso está hecho!"] },
    { en: "I'll see what I can do.", es: "Veré qué puedo hacer.", accept: ["[Veré|Voy a ver] [qué|lo que] puedo hacer."] },
    { en: "OK, as long as it's short.", es: "Listo, siempre y cuando sea corto.", accept: ["[Listo|Bueno|Está bien], siempre y cuando sea corto."] },
    { en: "I'm so sorry, but I can't. (Colombia, to a friend)", es: "Qué pena contigo, pero no puedo.", accept: ["(Ay,) qué pena contigo, pero no puedo."] },
    { en: "What do you mean, lend you money again? (to a friend)", es: "¿Cómo así que te preste plata otra vez?", accept: ["¿Cómo así que te preste plata [otra vez|de nuevo]?", "¿Cómo que te preste plata otra vez?"] }
  ],
  translate: [
    { en: "Will you help me with the move on Saturday? Sure thing! I'll be at your place at eight.", es: "¿Me ayudas con el trasteo el sábado? ¡De una! A las ocho estoy en tu casa.", accept: ["¿Me ayudas con el trasteo el sábado? ¡[De una|Claro que sí|Claro]! A las ocho estoy en tu casa.", "¿Me ayudas con el trasteo el sábado? ¡[De una|Claro que sí|Claro]! Estoy en tu casa a las ocho."] },
    { en: "I'm afraid it won't be possible to deliver the order before the fifteenth. (formal)", es: "Me temo que no va a ser posible entregar el pedido antes del quince.", accept: ["Me temo que no [va a ser|será] posible entregar el pedido antes del quince."] },
    { en: "I'll lend you the car as long as you bring it back with a full tank.", es: "Te presto el carro siempre y cuando me lo devuelvas con el tanque lleno.", accept: ["Te presto el carro [siempre y cuando|siempre que] me lo devuelvas con el tanque lleno."] },
    { en: "Me, sing at the wedding? Not for anything in the world. But I'll gladly give the speech.", es: "¿Yo, cantar en el matrimonio? Por nada del mundo. Pero el discurso lo doy con mucho gusto.", accept: ["¿Yo, cantar en el matrimonio? [Por nada del mundo|Ni lo sueñes|Ni de riesgos]. Pero el discurso lo doy con mucho gusto."] },
    { en: "I have no intention whatsoever of apologising for something I didn't do.", es: "No tengo la menor intención de pedir perdón por algo que no hice.", accept: ["No tengo la [menor|más mínima] intención de pedir [perdón|disculpas] por algo que no hice."] },
    { en: "Much as I regret it, I can't go with you that day: I have my brother's graduation.", es: "Sintiéndolo mucho, ese día no puedo acompañarte: tengo el grado de mi hermano.", accept: ["Sintiéndolo mucho, ese día [no puedo acompañarte|me resulta imposible acompañarte]: tengo el grado de mi hermano."] }
  ],
  register: [
    { es: "¡De una!", en: "Sure thing!", when: "in Colombia, with friends" },
    { es: "Con mucho gusto.", en: "With pleasure.", when: "in Colombia, with anyone, all day long" },
    { es: "Por mi parte no hay inconveniente.", en: "There's no problem on my side.", when: "at work, agreeing formally" },
    { es: "Lamentablemente, no nos será posible atender su solicitud.", en: "Unfortunately, we will not be able to meet your request.", when: "a formal letter or email that refuses" }
  ],
  personal: {
    prompt: "A friend asks you three favours for her wedding. Answer each on a different step: a glad yes, a yes with a condition, and a no.",
    constraints: [
      { type: "containsAny", words: ["de una", "con mucho gusto", "claro que sí", "eso está hecho"], label: "a glad yes: *¡de una!*, *con mucho gusto*" },
      { type: "containsAny", words: ["siempre y cuando", "siempre que", "cuando tenga"], label: "a yes with a condition: *siempre y cuando*" },
      { type: "containsAny", words: ["ni lo sueñes", "por nada del mundo", "qué pena contigo", "me temo que", "no tengo la menor intención", "ni de riesgos"], label: "a no: *qué pena contigo*, *ni lo sueñes*" }
    ],
    model: "¿Llevarte al aeropuerto? ¡De una! ¿Hacer el pastel? Bueno, siempre y cuando me ayudes con la decoración. ¿Bailar en la hora loca? Qué pena contigo, pero ni lo sueñes."
  },
  pitfalls: [
    "*Veré qué puedo hacer* is not a yes: in an office it often means no, politely.",
    "*Siempre y cuando* takes the subjunctive: *siempre y cuando sea corto*, not *es corto*.",
    "*Faltaría más* is heard in Spain; in Colombia the glad yes is *con mucho gusto* or *¡claro que sí!*"
  ]
},

"fn-permiso-prohibicion-c1": {
  source: "merged",
  hook: {
    line: "You are seventeen, it is February in Barranquilla, and Carnival starts on Saturday. You need permission from your parents and a signed note for school, and you have already decided you are going.",
    es: "¿Habría algún problema en que faltara el viernes de Carnaval?\nSí, pero que estés en la casa antes de la una.\nDigas lo que digas, voy a ir a la Batalla de Flores.",
    en: "Would there be any problem with my missing school on the Friday of Carnival?\nYes, but be home before one.\nWhatever you say, I'm going to the Battle of Flowers."
  },
  examples: [
    { es: "Mamá, ¿te importa que me quede donde Valentina el sábado después del desfile?", en: "Mum, do you mind if I stay at Valentina's on Saturday after the parade?" },
    { es: "Sí, puedes ir, pero que tu hermano vaya contigo y que me escribas cuando lleguen.", en: "Yes, you can go, but your brother is to go with you and you're to text me when you get there." },
    { es: "Digas lo que digas, este año voy a ir a la Batalla de Flores con mis amigos.", en: "Whatever you say, this year I'm going to the Battle of Flowers with my friends." }
  ],
  rule: "To ask, name the bother, not your wish: *¿Te molesta si abro?* with the indicative; *¿Te importa que* plus the subjunctive; *¿Habría algún problema en que* plus the *-ra* form. In writing: *Solicito autorización para...*\nTo say yes so plainly the question was not needed: *Eso ni se pregunta.* *Con toda confianza.*\nYes, with a condition: *Sí, pero que* plus the subjunctive: *pero que estés aquí a la una.*\nNo: *De ninguna manera.* In a notice: *Queda prohibido...*\nTo defy a no, the same verb twice: *Digas lo que digas, voy a ir.* *Pase lo que pase.* *Quieras o no.*",
  readAndPick: [
    { q: "What is the question about?", es: "¿Te importa que me quede donde Valentina?",
      options: ["Whether her mum would mind", "Where Valentina lives", "What Valentina thinks"], answer: 0,
      why: "*¿Te importa que* asks about the bother to the other person, not about your wish." },
    { q: "Has she got permission?", es: "Sí, pero que estés en la casa antes de la una.",
      options: ["No, not this year either", "Yes, but with a curfew", "Yes, with no limits at all"], answer: 1,
      why: "*Sí, pero que* plus the subjunctive gives permission and sets the condition." },
    { q: "Is her father asking for an answer?", es: "Eso ni se pregunta, claro que puedes quedarte.",
      options: ["Yes, he needs time to think", "No, his answer is no", "No, the yes is obvious"], answer: 2,
      why: "*Eso ni se pregunta* is a yes so plain that asking was unnecessary." },
    { q: "Can anything change her mind?", es: "Digas lo que digas, voy a ir.",
      options: ["Yes, one good argument", "No, nothing you could say", "Only what her father says"], answer: 1,
      why: "The verb said twice, *digas lo que digas*, closes off every objection in advance." },
    { q: "Where would you read this?", es: "Queda prohibido el ingreso de bebidas al estadio.",
      options: ["On a notice by the gate", "In a text from your mother", "In a note to a friend"], answer: 0,
      why: "*Queda prohibido* belongs to signs and regulations." }
  ],
  yourTurn: [
    { en: "Mum, do you mind if I stay at Valentina's?", es: "Mamá, ¿te importa que me quede donde Valentina?", accept: ["Mamá, ¿te importa que me quede [donde Valentina|en la casa de Valentina|en casa de Valentina]?", "Mamá, ¿te molesta si me quedo [donde Valentina|en la casa de Valentina|en casa de Valentina]?"] },
    { en: "Yes, but be home before one. (to your daughter)", es: "Sí, pero que estés en la casa antes de la una.", accept: ["Sí, pero que estés [en la casa|en casa] antes de la una."] },
    { en: "That goes without saying.", es: "Eso ni se pregunta.", accept: [] },
    { en: "Whatever you say, I'm going. (to your father)", es: "Digas lo que digas, voy a ir.", accept: ["Digas lo que digas, (yo) [voy a ir|voy]."] },
    { en: "Would there be any problem with my leaving early?", es: "¿Habría algún problema en que saliera temprano?", accept: ["¿Habría algún [problema|inconveniente] en que [saliera|me fuera] [temprano|antes]?"] }
  ],
  translate: [
    { en: "Do you mind if I open the window for a moment? It's very hot in here. (to someone you call usted)", es: "¿Le molesta si abro la ventana un momento? Hace mucho calor aquí.", accept: ["¿Le molesta si abro la ventana un momento? [Hace|Está haciendo] mucho calor aquí.", "¿Le importa que abra la ventana un momento? [Hace|Está haciendo] mucho calor aquí."] },
    { en: "I request your permission to leave early on Friday for a medical appointment.", es: "Solicito su autorización para retirarme temprano el viernes por una cita médica.", accept: ["Solicito su [autorización|permiso] para [retirarme|salir] temprano el viernes por una cita médica."] },
    { en: "Of course you can bring your cousin to the farm; that doesn't even need asking.", es: "Claro que puedes traer a tu primo a la finca; eso ni se pregunta.", accept: ["Claro que puedes traer a tu [primo|prima] a la finca; eso ni se pregunta."] },
    { en: "Yes, you can use the car. But don't let your father find out, and bring it back washed.", es: "Sí, puedes usar el carro. Pero que no se entere tu papá, y que lo traigas lavado.", accept: ["Sí, puedes usar el carro. Pero que no se entere tu [papá|padre], y que lo traigas lavado.", "Sí, puedes usar el carro. Pero que tu [papá|padre] no se entere, y que lo traigas lavado."] },
    { en: "Whatever happens on Saturday, we'll meet on the corner by the bakery at noon.", es: "Pase lo que pase el sábado, nos vemos en la esquina de la panadería al mediodía.", accept: [] },
    { en: "Whether you like it or not, the costume has to be ready by Friday.", es: "Quieras o no, el disfraz tiene que estar listo para el viernes.", accept: ["Quieras o no, el disfraz tiene que estar listo [para el|el|antes del] viernes."] }
  ],
  register: [
    { es: "¿Puedo salir?", en: "Can I go out?", when: "at home, to parents who know you" },
    { es: "¿Te importa que salga un rato?", en: "Do you mind if I go out for a bit?", when: "with family or friends, more gently" },
    { es: "¿Habría algún problema en que saliera temprano?", en: "Would there be any problem with my leaving early?", when: "at work, to your boss" },
    { es: "Solicito autorización para ausentarme el viernes.", en: "I request permission to be absent on Friday.", when: "a written request to an institution" }
  ],
  personal: {
    prompt: "Ask for permission for something you really want to do, get a yes with a condition, and then say you would have done it anyway.",
    constraints: [
      { type: "containsAny", words: ["te importa que", "le importa que", "te molesta si", "le molesta si", "habría algún problema", "solicito autorización"], label: "ask by naming the bother: *¿te importa que...?*" },
      { type: "regex", pattern: "\\bpero que\\s", label: "a yes with a condition: *sí, pero que...*" },
      { type: "regex", pattern: "\\b(digas|diga|digan|pase|quieras|quiera|quieran|hagas|haga) (lo que|o no)", label: "defy it in advance: *digas lo que digas*, *quieras o no*" }
    ],
    model: "Papá, ¿te importa que vaya al concierto de Carlos Vives? Sí, pero que vayas con tu prima y que me llames al salir. Igual iba a ir: digas lo que digas, es Carlos Vives."
  },
  pitfalls: [
    "*¿Te importa que salgo?* is wrong: *te importa que* takes the subjunctive, *salga*; *te molesta si* takes *salgo*.",
    "*Digas lo que digas* repeats the same verb in the same person: not *digas lo que dices*.",
    "*Eso ni se pregunta* is a yes, not a refusal to answer."
  ]
},

"fn-favor-objetos-ayuda-c1": {
  source: "old",
  hook: {
    line: "The morning of your thesis presentation at the Universidad Nacional. Your laptop is dead, your slides are in English and your shift at the café starts in an hour, so you go down the corridor asking, each time a little more carefully.",
    es: "¿Será que me prestas tu cargador un momentico?\n¿Tú no sabrás algo de inglés? Es que tengo las diapositivas en inglés.\nTe agradecería muchísimo que me cubrieras el turno.",
    en: "Could you possibly lend me your charger for a moment?\nYou wouldn't know any English, would you? It's just that my slides are in English.\nI'd be really grateful if you covered my shift."
  },
  examples: [
    { es: "¿Será que me prestas tu cargador un momentico? Se me descargó el computador y presento en una hora.", en: "Could you possibly lend me your charger for a moment? My laptop died and I present in an hour." },
    { es: "Te agradecería muchísimo que me cubrieras el turno de la tarde; te lo devuelvo el sábado.", en: "I'd be really grateful if you covered my afternoon shift; I'll do yours on Saturday." },
    { es: "¿Tú no sabrás algo de inglés? Es que tengo que corregir diez diapositivas antes de las once.", en: "You wouldn't know any English, would you? It's just that I have to fix ten slides before eleven." }
  ],
  rule: "A favour, a thing or help all climb the same ladder; only the verb changes.\n*¿Me prestas tu cargador?* Then, softer and very Colombian: *¿Será que me prestas...?* Then *¿Me harías el favor de...?* and, ceremonious, *¿Serías tan amable de...?*\n*¿Me regalas* plus a small thing asks for something you won't give back: *¿Me regalas un vaso de agua?*\nThanks in advance: *Te agradecería que* plus the *-ra* form.\n*¿Sería mucho pedir que...?* often carries a reproach.\nHidden: name the problem and let them offer. *¿Tú no sabrás inglés? Es que...*",
  readAndPick: [
    { q: "What is she really asking?", es: "¿Tú no sabrás algo de inglés? Es que tengo las diapositivas en inglés.",
      options: ["How good his English really is", "For help with her slides", "Whether he has studied abroad"], answer: 1,
      why: "Naming the problem, *es que...*, is the request: she wants help without asking for it." },
    { q: "Will she give the water back?", es: "¿Me regalas un vaso de agua?",
      options: ["Yes, she means to pay him back", "No, it is just a small favour", "Yes, she will bring another one"], answer: 1,
      why: "In Colombia *¿me regalas...?* asks for something small you won't return; nobody expects payment." },
    { q: "How does *¿será que...?* change the request?", es: "¿Será que me prestas tu cargador?",
      options: ["It turns it into a guess", "It makes it far more urgent", "It makes it sound gentler"], answer: 2,
      why: "*¿Será que...?* is a very Colombian softener: it leaves room to say no." },
    { q: "What is behind this request?", es: "¿Sería mucho pedir que, por una vez, llegaras a tiempo?",
      options: ["A complaint about the past", "A real doubt about the time", "Thanks for coming"], answer: 0,
      why: "*¿Sería mucho pedir que...?* with *por una vez* is a reproach: it has happened before." },
    { q: "When is the friend being thanked?", es: "Te agradecería muchísimo que me cubrieras el turno.",
      options: ["Now, before she even agrees", "Never, it's really an order", "Only once the shift is over"], answer: 0,
      why: "*Te agradecería que* thanks her in advance, which makes the request hard to refuse." }
  ],
  yourTurn: [
    { en: "Could you possibly lend me your charger? (Colombia, to a friend)", es: "¿Será que me prestas tu cargador?", accept: ["¿Será que me [prestas|puedes prestar] tu cargador?"] },
    { en: "Can I have a glass of water? (Colombia)", es: "¿Me regalas un vaso de agua?", accept: ["¿Me [regalas|regala] un vaso de agua?", "¿Me [regalas|regala] un vaso de agua, por favor?"] },
    { en: "I'd be very grateful if you covered my shift. (to a friend)", es: "Te agradecería mucho que me cubrieras el turno.", accept: ["Te agradecería [mucho|muchísimo] que me cubrieras el turno."] },
    { en: "You wouldn't know any English, would you? (to a friend)", es: "¿Tú no sabrás algo de inglés?", accept: ["¿(Tú) no sabrás (algo de) inglés?"] },
    { en: "Would you do me the favour of going with me to the doctor? (to a friend)", es: "¿Me harías el favor de acompañarme al médico?", accept: ["¿Me [harías|haces] el favor de acompañarme al [médico|doctor]?"] }
  ],
  translate: [
    { en: "You wouldn't happen to have a charger, would you? My phone died in the middle of the call.", es: "¿No tendrás por ahí un cargador? Se me descargó el celular en plena llamada.", accept: ["¿No tendrás por ahí un cargador? Se me descargó el celular en [plena llamada|la mitad de la llamada|medio de la llamada]."] },
    { en: "Would it be too much to ask that, for once, you washed your plates after eating?", es: "¿Sería mucho pedir que, por una vez, lavaras tus platos después de comer?", accept: ["¿Sería mucho pedir que, [por una vez|para variar], lavaras tus platos después de comer?", "¿Sería mucho pedir que lavaras tus platos después de comer, por una vez?"] },
    { en: "Could you possibly lend me your notes from Tuesday's class? I'll give them back tomorrow.", es: "¿Será que me prestas los apuntes de la clase del martes? Te los devuelvo mañana.", accept: ["¿Será que me [prestas|puedes prestar] los apuntes de la clase del martes? Te los devuelvo mañana.", "¿Me [prestas|puedes prestar] los apuntes de la clase del martes? Te los devuelvo mañana."] },
    { en: "I'd be enormously grateful if you spoke to your cousin about the job at the bank.", es: "Te agradecería enormemente que hablaras con tu primo sobre lo del trabajo en el banco.", accept: ["Te agradecería [enormemente|muchísimo] que hablaras con tu primo sobre lo del trabajo en el banco.", "Te agradecería [enormemente|muchísimo] que hablaras con tu primo del trabajo en el banco."] },
    { en: "Can you give me a hand with these boxes? They're heavy and the lift isn't working.", es: "¿Me echas una mano con estas cajas? Pesan mucho y el ascensor no sirve.", accept: ["¿Me [echas|das] una mano con estas cajas? Pesan mucho y el ascensor no [sirve|funciona].", "¿Me ayudas con estas cajas? Pesan mucho y el ascensor no [sirve|funciona]."] },
    { en: "Would you be so kind as to pass me the salt and the sauce next to you? (formal)", es: "¿Sería tan amable de pasarme la sal y la salsa que tiene a su lado?", accept: ["¿Sería tan amable de pasarme la sal y la salsa que tiene a su lado?", "¿Me haría el favor de pasarme la sal y la salsa que tiene a su lado?"] }
  ],
  register: [
    { es: "¿Me pasas la sal?", en: "Can you pass the salt?", when: "at the family table" },
    { es: "¿Será que me pasas la sal?", en: "Could you possibly pass the salt?", when: "in Colombia, to someone you don't know well" },
    { es: "¿Me regala la sal, por favor?", en: "Could I have the salt, please?", when: "in Colombia, to a waiter or a stranger" },
    { es: "¿Sería tan amable de pasarme la sal?", en: "Would you be so kind as to pass the salt?", when: "a formal lunch, or teasing a friend" }
  ],
  personal: {
    prompt: "Something has gone wrong on an important day. Ask three people for three things, a thing to borrow, some help and a favour, each more carefully than the last.",
    constraints: [
      { type: "containsAny", words: ["será que", "me prestas", "me regalas", "me harías el favor", "serías tan amable", "sería tan amable"], label: "a request on the ladder: *¿será que me prestas...?*" },
      { type: "regex", pattern: "agradecería (mucho |muchísimo |enormemente )?que\\s", label: "thanks in advance: *te agradecería que*" },
      { type: "minSentences", n: 3, label: "three requests or more" }
    ],
    model: "Juli, ¿será que me prestas tu cargador? Andrés, ¿me harías el favor de revisarme las diapositivas? Profe, le agradecería mucho que me diera cinco minutos más."
  },
  pitfalls: [
    "*¿Me regalas un tinto?* in a café is a polite order, not a request for charity.",
    "*Te agradecería que* takes the *-ra* form: *que me cubrieras*.",
    "*Echar un cable* is Spain; in Colombia, *echar una mano* or *una ayudita*."
  ]
},

"task-c1-verbos": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: about 250 words on something that got complicated, a dispute, a process or a change of mind, then one line for every verb saying why that form and not its neighbour. The model is about a meeting that started without you.",
    es: "Cuando llegué, ya habían decidido.\nNadie me dijo que la reunión se hubiera adelantado.\nSi me lo hubieran dicho, habría cambiado el vuelo.",
    en: "When I arrived, they had already decided.\nNobody told me the meeting had been brought forward.\nIf they had told me, I would have changed my flight."
  },
  examples: [
    { es: "Cuando llegué a la oficina de Cali, ya habían decidido quién se quedaba con el proyecto.", en: "When I got to the Cali office, they had already decided who would keep the project." },
    { es: "Nadie me dijo que la reunión se hubiera adelantado, aunque supongo que alguien lo habría intentado.", en: "Nobody told me the meeting had been brought forward, though I suppose someone must have tried." },
    { es: "Si me lo hubieran dicho a tiempo, habría cambiado el vuelo y habría llegado a las ocho.", en: "If they had told me in time, I would have changed my flight and arrived at eight." }
  ],
  rule: "The task: about 250 words on something that got complicated, then one line per verb: why this form and not the nearest other.\n*It is the past* is not a reason; the preterite and the imperfect are both past. A reason says what you are doing with the event:\nclosing it off, *llegué*;\ndescribing around it, *se quedaba*;\nplacing it before another, *habían decidido*;\ndeclining to assert it, *que se hubiera adelantado*, after a *no*;\nguessing about it, *lo habría intentado*;\nimagining it otherwise, *si me lo hubieran dicho, habría cambiado*.\nThen read it aloud: every verb should be a choice you could defend.",
  readAndPick: [
    { q: "Why *hubiera adelantado* and not *había adelantado*?", es: "Nadie me dijo que la reunión se hubiera adelantado.",
      options: ["It happened long ago", "Nobody vouches for it", "It is a polite form"], answer: 1,
      why: "After a denied verb of saying, the subjunctive declines to assert it." },
    { q: "What does *habían decidido* do?", es: "Cuando llegué, ya habían decidido.",
      options: ["It puts the decision first", "It shows it is still open", "It is only a guess"], answer: 0,
      why: "The pluperfect places the decision before the arrival." },
    { q: "Is the speaker sure someone tried?", es: "Supongo que alguien lo habría intentado.",
      options: ["Yes, she watched them try it", "Yes, somebody told her", "No, it is just her guess"], answer: 2,
      why: "The conditional perfect guesses about the past: someone must have tried." },
    { q: "Why *llegué* and not *llegaba*?", es: "Cuando llegué, ya habían decidido.",
      options: ["One arrival, closed off", "A habit of arriving", "An arrival still to come"], answer: 0,
      why: "The preterite closes off a single arrival; *llegaba* would describe a habit or a scene." },
    { q: "Which form completes the pair?", es: "Si me lo hubieran dicho, ___ el vuelo.",
      options: ["lo cambiaría", "habría cambiado", "había cambiado ya"], answer: 1,
      why: "A past that didn't happen pairs *hubieran dicho* with *habría cambiado*." }
  ],
  yourTurn: [
    { en: "When I arrived, they had already decided.", es: "Cuando llegué, ya habían decidido.", accept: ["Cuando llegué, ya (lo) habían decidido."] },
    { en: "Nobody told me the meeting had been brought forward.", es: "Nadie me dijo que la reunión se hubiera adelantado.", accept: ["Nadie me dijo que la reunión se hubiera adelantado.", "Nadie me dijo que [habían|hubieran] adelantado la reunión."] },
    { en: "I suppose someone must have tried.", es: "Supongo que alguien lo habría intentado.", accept: [] },
    { en: "If they had told me, I would have changed the flight.", es: "Si me lo hubieran dicho, habría cambiado el vuelo.", accept: ["Si me lo hubieran dicho, [habría|hubiera] cambiado el vuelo."] }
  ],
  translate: [
    { en: "When the lawyer arrived, the two brothers had already signed the agreement.", es: "Cuando llegó el abogado, los dos hermanos ya habían firmado el acuerdo.", accept: ["Cuando [llegó el abogado|el abogado llegó], los dos hermanos ya habían firmado el acuerdo."] },
    { en: "My sister never said she didn't like the house; she said it was too far away.", es: "Mi hermana nunca dijo que la casa no le gustara; dijo que quedaba muy lejos.", accept: ["Mi hermana nunca dijo que [la casa no le gustara|no le gustara la casa]; dijo que quedaba muy lejos."] },
    { en: "While we were discussing the price, the owner got a call and left the room.", es: "Mientras discutíamos el precio, el dueño recibió una llamada y salió de la sala.", accept: ["Mientras [discutíamos|negociábamos] el precio, el dueño recibió una llamada y salió de la sala.", "Mientras hablábamos del precio, el dueño recibió una llamada y salió de la sala."] },
    { en: "I don't think they had bad intentions. They must have thought I already knew.", es: "No creo que tuvieran malas intenciones. Habrán pensado que yo ya lo sabía.", accept: ["No creo que [tuvieran|hayan tenido] malas intenciones. [Habrán pensado|Seguramente pensaron] que (yo) ya lo sabía."] },
    { en: "If I had read the email in time, I wouldn't have gone all the way to Cali for nothing.", es: "Si hubiera leído el correo a tiempo, no habría ido hasta Cali para nada.", accept: ["Si hubiera leído el correo a tiempo, no [habría|hubiera] ido hasta Cali [para nada|en vano]."] },
    { en: "In the end we settled it like this: he keeps the project and I keep the Bogotá clients.", es: "Al final quedamos así: él se queda con el proyecto y yo con los clientes de Bogotá.", accept: ["Al final [quedamos así|llegamos a un acuerdo]: él se queda con el proyecto y yo con los clientes de Bogotá."] }
  ],
  register: [
    { es: "Cuando llegué, ya lo habían decidido.", en: "When I got there, they'd already decided.", when: "telling it to a friend" },
    { es: "A mi llegada, la decisión ya había sido tomada.", en: "On my arrival, the decision had already been taken.", when: "a formal report or a written complaint" },
    { es: "Llego, y ya lo habían decidido todo.", en: "So I get there, and they'd already decided everything.", when: "a story told for effect, among friends" }
  ],
  personal: {
    prompt: "Write the opening of your account: three or four sentences with at least four different verb forms, including one *si* with *hubiera* and one denied *dijo que*.",
    constraints: [
      { type: "distinctTenses", n: 4, label: "four different verb forms or more" },
      { type: "regex", pattern: "\\bsi [a-záéíóúñ ]*hubi(era|eras|éramos|eran)\\s", label: "a past that didn't happen: *si me lo hubieran dicho*" },
      { type: "regex", pattern: "\\b(nadie|no|nunca) [a-záéíóúñ ]*dij(o|eron|e) que\\s", label: "a denied report: *nadie me dijo que*" }
    ],
    model: "Cuando llegué a la finca, mis tíos ya habían vendido el ganado. Nadie me dijo que estuvieran pensando en venderlo. Si me lo hubieran contado, habría hablado con ellos antes."
  },
  pitfalls: [
    "*Es pasado* is never the reason: say what the form does, closing, describing, placing before, doubting, imagining.",
    "*Si me lo habrían dicho* is wrong: after *si*, *hubieran*; *habría* goes on the other side of the comma.",
    "Change the form only when the meaning changes: a story in one past is not a failure."
  ]
},

/* ---- unit c1-u60 · Emotion at native pitch -------------------------------- */

"fn-arrepentimiento-verguenza-c1": {
  source: "old",
  hook: {
    line: "Last Saturday you gave the toast at your best friend's wedding in Cartagena, and in front of two hundred guests you called the bride by the name of the groom's ex. On Monday you tell your sister all about it, and about what you would do differently.",
    es: "Me dio una pena horrible: la llamé Carolina delante de todos.\nNo debí tomarme ese tercer aguardiente.\nSi pudiera devolver el tiempo, habría escrito el discurso.",
    en: "I was horribly embarrassed: I called her Carolina in front of everyone.\nI shouldn't have had that third aguardiente.\nIf I could turn back time, I'd have written the speech down."
  },
  examples: [
    { es: "Me dio una pena horrible con los novios: llamé a Laura por el nombre de la ex.", en: "I felt horribly embarrassed in front of the couple: I called Laura by the ex's name." },
    { es: "Me arrepiento de no haber escrito el discurso; improvisar con tres aguardientes fue un error.", en: "I regret not writing the speech down; improvising after three aguardientes was a mistake." },
    { es: "Mi hermana dice que sintió pena ajena, y que quería que se la tragara la tierra.", en: "My sister says she cringed for me, and wanted the ground to swallow her up." }
  ],
  rule: "Regret what you did: *Me arrepiento de haber...* *No debí* plus the dictionary form: *No debí tomarme ese aguardiente.*\nRegret what you didn't do: *Me arrepiento de no haber...* *Debí haber escrito el discurso.* *Tenía que haberlo pensado.*\nImagine a second chance: *Si pudiera devolver el tiempo...* for one moment; *si volviera a nacer...* for a whole life.\nEmbarrassment, in Colombia: *me dio pena*, which is not sadness. *¡Qué oso!* among friends. *Quería que me tragara la tierra.* *Me puse rojo.*\nFor someone else's blunder: *pena ajena*, or *vergüenza ajena*.",
  readAndPick: [
    { q: "How did she feel?", es: "Me dio una pena horrible con los novios.",
      options: ["Sad for the happy couple", "Mortified in front of them", "Sorry about bad news"], answer: 1,
      why: "In Colombia *me dio pena* means embarrassment, not sadness." },
    { q: "What does he regret?", es: "Me arrepiento de no haber escrito el discurso.",
      options: ["Writing the whole speech out", "Giving a speech at all", "Not having written it down"], answer: 2,
      why: "*De no haber* plus a participle regrets something you didn't do." },
    { q: "Whose blunder made the sister cringe?", es: "Sentí pena ajena cuando la llamó Carolina.",
      options: ["Her own, at the wedding", "Her brother's, not hers", "Nobody's, it was a joke"], answer: 1,
      why: "*Pena ajena* is embarrassment you feel for someone else's blunder." },
    { q: "How much does she want to change?", es: "Si volviera a nacer, estudiaría música.",
      options: ["One evening", "Next week's plans", "Her whole life"], answer: 2,
      why: "*Si volviera a nacer* imagines a whole life over; *devolver el tiempo* is for one moment." },
    { q: "Is this a good thing to have done?", es: "No debí tomarme ese tercer aguardiente.",
      options: ["No, she regrets it", "Yes, it was fun", "She doesn't remember"], answer: 0,
      why: "*No debí* plus the dictionary form judges something you did as a mistake." }
  ],
  yourTurn: [
    { en: "I shouldn't have had that third drink.", es: "No debí tomarme ese tercer trago.", accept: ["No debí tomarme ese tercer trago.", "No [debí|debería] haberme tomado ese tercer trago."] },
    { en: "I regret not writing the speech.", es: "Me arrepiento de no haber escrito el discurso.", accept: [] },
    { en: "I was so embarrassed! (Colombia)", es: "¡Me dio mucha pena!", accept: ["¡Me dio [mucha|tanta|muchísima] pena!"] },
    { en: "If I could turn back time, I'd do it differently.", es: "Si pudiera devolver el tiempo, lo haría distinto.", accept: ["Si pudiera devolver el tiempo, lo haría [distinto|diferente|de otra manera]."] },
    { en: "I felt embarrassed on his behalf.", es: "Sentí pena ajena.", accept: ["[Sentí|Me dio] [pena|vergüenza] ajena."] }
  ],
  translate: [
    { en: "I regret having told her the truth like that, in front of her whole family.", es: "Me arrepiento de haberle dicho la verdad así, delante de toda su familia.", accept: ["Me arrepiento de haberle dicho la verdad así, [delante de|enfrente de|frente a] toda su familia."] },
    { en: "I should have called my grandfather more often while he was still alive.", es: "Debí haber llamado a mi abuelo más seguido cuando todavía estaba vivo.", accept: ["[Debí haber llamado|Debí llamar|Tenía que haber llamado|Debería haber llamado] a mi abuelo más [seguido|a menudo] [cuando|mientras] todavía estaba vivo."] },
    { en: "How embarrassing! I sent the message to the family group instead of to my sister. (Colombia, to a friend)", es: "¡Qué oso! Le mandé el mensaje al grupo de la familia en vez de a mi hermana.", accept: ["¡Qué [oso|pena]! (Le) mandé el mensaje al grupo de la familia en vez de a mi hermana."] },
    { en: "When the teacher read my essay aloud, I went as red as a tomato. (a man speaking)", es: "Cuando la profesora leyó mi ensayo en voz alta, me puse rojo como un tomate.", accept: ["Cuando la profesora leyó mi ensayo en voz alta, me puse [rojo|colorado] como un tomate."] },
    { en: "If I were born again, I would study music instead of law and live near the sea.", es: "Si volviera a nacer, estudiaría música en vez de derecho y viviría cerca del mar.", accept: ["Si volviera a nacer, estudiaría música en [vez|lugar] de derecho y viviría cerca del mar."] },
    { en: "I'm not ashamed of having failed; I'm ashamed of not having tried.", es: "No me da vergüenza haber fracasado; me da vergüenza no haberlo intentado.", accept: ["No me da [vergüenza|pena] haber fracasado; me da [vergüenza|pena] no haberlo intentado."] }
  ],
  register: [
    { es: "¡Qué oso!", en: "How embarrassing!", when: "in Colombia, with friends, for small blunders" },
    { es: "Me dio mucha pena.", en: "I was so embarrassed.", when: "in Colombia, with anyone" },
    { es: "Me dio mucha vergüenza.", en: "I was very embarrassed.", when: "anywhere in the Spanish-speaking world" },
    { es: "Lamento profundamente lo ocurrido.", en: "I deeply regret what happened.", when: "a formal apology or a public statement" }
  ],
  personal: {
    prompt: "Tell a friend about a moment you would like to undo. Write three lines: how embarrassing it was, what you should or shouldn't have done, and what you'd do with a second chance.",
    constraints: [
      { type: "containsAny", words: ["me dio pena", "me dio mucha pena", "qué oso", "qué pena", "vergüenza", "me puse rojo", "me puse roja", "tragara la tierra"], label: "how embarrassing it was: *me dio pena*, *¡qué oso!*" },
      { type: "regex", pattern: "\\b(debí|debería|tenía que)\\s+(haber|[a-z]+r)|arrepiento de", label: "a regret: *no debí*, *me arrepiento de no haber*" },
      { type: "regex", pattern: "\\bsi (pudiera|volviera|tuviera)\\s", label: "a second chance: *si pudiera devolver el tiempo*" }
    ],
    model: "¡Qué oso! En la entrevista llamé a la gerente por el nombre de la competencia. No debí ir sin preparar nada. Si pudiera devolver el tiempo, habría leído sobre la empresa la noche antes."
  },
  pitfalls: [
    "In Colombia *me dio pena* means I was embarrassed; for sad, *me dio tristeza* or *me dio pesar*.",
    "*Me arrepiento de no haber escrito*, with *de*: *me arrepiento no haber* drops a word.",
    "*Si volviera a nacer* is a whole life; for one evening, *si pudiera devolver el tiempo*."
  ]
},

"fn-tristeza-placer-c1": {
  source: "old",
  hook: {
    line: "Your oldest friend Laura is moving to Canada, and tonight is her farewell in Medellín. You laugh until it hurts remembering school, and then the taxi comes. Two feelings in one night, and Spanish puts both of them in the body.",
    es: "Nos morimos de la risa recordando al profe de química.\nLa pasamos delicioso hasta las tres.\nCuando se subió al taxi, se me arrugó el corazón.",
    en: "We were dying of laughter remembering the chemistry teacher.\nWe had a wonderful time until three.\nWhen she got into the taxi, my heart sank."
  },
  examples: [
    { es: "Nos morimos de la risa recordando la vez que el profe de química se quedó encerrado.", en: "We died laughing remembering the time the chemistry teacher got locked in." },
    { es: "La pasamos delicioso toda la noche, bailando y comiendo empanadas hasta las tres de la mañana.", en: "We had a wonderful time all night, dancing and eating empanadas until three in the morning." },
    { es: "Cuando se subió al taxi y me dijo adiós con la mano, se me arrugó el corazón.", en: "When she got into the taxi and waved goodbye, my heart sank." }
  ],
  rule: "Sadness goes to the chest: *se me arrugó el corazón*, very Colombian; *se me partió el alma*; *se me rompe el corazón*. The *se me* frame again: it happens to you.\n*Me da pesar* is Colombian for it makes me sad, or I feel for them: *¡Qué pesar con ella!* More formal: *me entristece que* plus the subjunctive.\nCrushed: *estoy destrozada*, *estoy deshecho*. Bleak: *la cosa está color de hormiga*.\nFun goes to the body too: *me morí de la risa*, *¡cómo nos reímos!* For a good time, Latin America says *la pasamos*: *de maravilla*, and in Colombia, *delicioso*.",
  readAndPick: [
    { q: "How did the evening go?", es: "La pasamos delicioso hasta las tres.",
      options: ["The food was excellent", "They ate until three", "They had a great time"], answer: 2,
      why: "*La pasamos delicioso* is Colombian for a wonderful time; it is not about the food." },
    { q: "What happened to her heart?", es: "Cuando se subió al taxi, se me arrugó el corazón.",
      options: ["It raced with fright", "It burned with anger", "It sank with sadness"], answer: 2,
      why: "*Se me arrugó el corazón* is a Colombian way to say your heart sank." },
    { q: "What does *¡qué pesar!* mean here?", es: "Se le murió el perro. ¡Qué pesar con ella!",
      options: ["How heavy it must have been", "That was her fault", "She has my deep sympathy"], answer: 2,
      why: "In Colombia *qué pesar* expresses sorrow or sympathy, not weight." },
    { q: "How do things look?", es: "Con el cierre de la fábrica, la cosa está color de hormiga.",
      options: ["Bright and full of hope", "Grim and rather bleak", "Neither good nor bad, just so-so"], answer: 1,
      why: "*Color de hormiga* says the situation looks grim." },
    { q: "How formal is this?", es: "Nos entristece profundamente que la sede de Cali cierre.",
      options: ["Casual, between friends", "Formal, like a statement", "Street slang, from Medellín"], answer: 1,
      why: "*Nos entristece que* plus the subjunctive is the formal way to say it saddens us." }
  ],
  yourTurn: [
    { en: "My heart sank. (Colombia)", es: "Se me arrugó el corazón.", accept: [] },
    { en: "We had a wonderful time. (Colombia)", es: "La pasamos delicioso.", accept: ["La pasamos [delicioso|de maravilla|muy bueno|súper bien]."] },
    { en: "We died laughing.", es: "Nos morimos de la risa.", accept: ["Nos morimos de (la) risa."] },
    { en: "I feel so sorry for her! (Colombia)", es: "¡Qué pesar con ella!", accept: ["¡Qué pesar con ella!", "¡Me da mucho pesar por ella!"] },
    { en: "I'm devastated. (a woman speaking)", es: "Estoy destrozada.", accept: ["Estoy [destrozada|deshecha]."] }
  ],
  translate: [
    { en: "It breaks my heart to see my grandfather so alone since my grandmother died.", es: "Se me rompe el corazón ver a mi abuelo tan solo desde que murió mi abuela.", accept: ["Se me [rompe|parte|arruga] el corazón ver a mi abuelo tan solo desde que [murió mi abuela|mi abuela murió|se murió mi abuela]."] },
    { en: "How we laughed at your uncle's stories! I hadn't laughed like that in years.", es: "¡Cómo nos reímos con las historias de tu tío! Hacía años que no me reía así.", accept: ["¡Cómo nos reímos con las [historias|anécdotas] de tu tío! Hacía años que no me reía así."] },
    { en: "It saddens us deeply that the theatre is closing its doors after fifty years. (formal)", es: "Nos entristece profundamente que el teatro cierre sus puertas después de cincuenta años.", accept: ["Nos entristece profundamente que el teatro cierre sus puertas [después de|tras] cincuenta años."] },
    { en: "We had a wonderful time at the farm. The bad part was the goodbye: my heart sank when I saw my mother cry.", es: "La pasamos delicioso en la finca. Lo malo fue la despedida: se me arrugó el corazón al ver llorar a mi mamá.", accept: ["La pasamos [delicioso|de maravilla] en la finca. Lo malo fue la despedida: se me arrugó el corazón [al ver|cuando vi] llorar a mi mamá."] },
    { en: "Since the factory closed, things in town have looked grim. (Colombia)", es: "Desde que cerró la fábrica, la cosa en el pueblo está color de hormiga.", accept: ["Desde que cerró la fábrica, [la cosa en el pueblo|en el pueblo la cosa] está color de hormiga."] },
    { en: "I've been devastated since she left, and I can't even listen to our song. (a man speaking)", es: "Estoy destrozado desde que se fue, y ni siquiera puedo oír nuestra canción.", accept: ["Estoy [destrozado|deshecho] desde que se fue, y ni siquiera puedo [oír|escuchar] nuestra canción."] }
  ],
  register: [
    { es: "Me morí de la risa.", en: "I died laughing.", when: "with friends, about anything funny" },
    { es: "Me dio mucha risa.", en: "It made me laugh a lot.", when: "anywhere, warm but not slangy" },
    { es: "Me pareció muy divertido.", en: "I found it very amusing.", when: "at work, or in writing" },
    { es: "Nos entristece profundamente su partida.", en: "We are deeply saddened by her departure.", when: "a formal message or a speech" }
  ],
  personal: {
    prompt: "Describe a night or a day that was both happy and sad: one line for the fun, one for the moment it hurt.",
    constraints: [
      { type: "containsAny", words: ["la pasamos", "morimos de la risa", "morí de la risa", "nos reímos", "de maravilla", "delicioso"], label: "the fun: *la pasamos delicioso*, *nos morimos de la risa*" },
      { type: "regex", pattern: "se me (arrugó|partió|rompió|arruga|parte|rompe|encogió)\\s|pesar|destrozad|deshech", label: "the sad moment: *se me arrugó el corazón*, *qué pesar*" }
    ],
    model: "En el grado de mi hermano la pasamos delicioso: nos morimos de la risa con el discurso de mi papá. Pero cuando vi la silla vacía de mi abuela, se me arrugó el corazón."
  },
  pitfalls: [
    "*Lo pasamos bien* is Spain; in Colombia, *la pasamos bien*, with *la*.",
    "*Me da pesar* is sadness or sympathy, not regret: for regret, *me arrepiento*.",
    "*Me morí de la risa* is for friends; in a report, *me pareció muy divertido*."
  ]
},

"fn-miedo-nerviosismo-c1": {
  source: "old",
  hook: {
    line: "You are flying from Bogotá to Leticia, in the Amazon, on a small plane. You were nervous before you boarded, and over the jungle a storm makes it worse. That night you tell your brother all about it.",
    es: "Antes de subir tenía los nervios de punta.\nCon la tormenta se me pusieron los pelos de punta.\n¡Qué susto tan tenaz! Tenía el corazón en la boca.",
    en: "Before boarding my nerves were on edge.\nIn the storm my hair stood on end.\nWhat a terrible fright! My heart was in my mouth."
  },
  examples: [
    { es: "Antes de subir a la avioneta tenía los nervios de punta y me sudaban las manos.", en: "Before getting on the small plane my nerves were on edge and my hands were sweating." },
    { es: "Cuando el avión cayó de golpe sobre la selva, se me pusieron los pelos de punta.", en: "When the plane suddenly dropped over the jungle, my hair stood on end." },
    { es: "Me pegué un susto tenaz, pero el piloto aterrizó como si nada en medio del aguacero.", en: "I got a terrible fright, but the pilot landed as if nothing were happening in the middle of the downpour." }
  ],
  rule: "Fear has a scale: *me inquieta*, it worries me a little; *me da miedo*; *me aterra*, it terrifies me. When the fear is of something that could happen, *que* plus the subjunctive: *Me da miedo que se mueva tanto.*\nA sudden fright: *¡Qué susto!* *Me pegué un susto tenaz*, very Colombian.\nFear in the body, with *se me*: *se me pusieron los pelos de punta*, *se me puso la piel de gallina*. In the chest: *tenía el corazón en la boca*.\nNerves before something: *tengo los nervios de punta*, *me sudaban las manos*, *me temblaban las piernas*, *se me hizo un nudo en la garganta*.\nAt the limit: *¡Me va a dar algo!*",
  readAndPick: [
    { q: "How scared is she?", es: "Me inquieta un poco que el piloto no diga nada.",
      options: ["Uneasy, but only slightly", "Utterly and totally terrified", "Not worried in the very least"], answer: 0,
      why: "*Me inquieta* is the low end of the scale: a little uneasy." },
    { q: "Did she decide to react this way?", es: "Se me pusieron los pelos de punta.",
      options: ["Yes, on purpose", "Yes, to scare her brother", "No, her body just did it"], answer: 2,
      why: "*Se me* frames it as something the body did on its own." },
    { q: "What does *tenaz* add here?", es: "Me pegué un susto tenaz.",
      options: ["That it was only a tiny scare", "That it was a huge one", "That it lasted for days on end"], answer: 1,
      why: "In Colombia *tenaz* intensifies: a terrible fright, a tough day." },
    { q: "When were her nerves on edge?", es: "Antes de subir tenía los nervios de punta.",
      options: ["Before she boarded", "Once they had landed", "During the storm"], answer: 0,
      why: "*Antes de subir* places the nerves before boarding." },
    { q: "What is she afraid of?", es: "Me da miedo que el vuelo se cancele otra vez.",
      options: ["Small planes", "The pilot turning up late", "The flight being cancelled"], answer: 2,
      why: "*Me da miedo que* plus the subjunctive: the fear is of something that could happen." }
  ],
  yourTurn: [
    { en: "My hair stood on end.", es: "Se me pusieron los pelos de punta.", accept: [] },
    { en: "I got a terrible fright! (Colombia)", es: "¡Me pegué un susto tenaz!", accept: ["¡Me pegué [un susto tenaz|tremendo susto|un susto horrible]!"] },
    { en: "My nerves are on edge.", es: "Tengo los nervios de punta.", accept: ["[Tengo|Estoy con] los nervios de punta."] },
    { en: "I'm afraid the flight will be cancelled.", es: "Me da miedo que se cancele el vuelo.", accept: ["Me da miedo que [se cancele el vuelo|el vuelo se cancele|cancelen el vuelo]."] },
    { en: "My heart was in my mouth.", es: "Tenía el corazón en la boca.", accept: [] }
  ],
  translate: [
    { en: "Speaking in public terrifies me: my legs shake and I get a lump in my throat.", es: "Me aterra hablar en público: me tiemblan las piernas y se me hace un nudo en la garganta.", accept: ["[Me aterra|Me da pánico] hablar en público: me tiemblan las piernas y se me hace un nudo en la garganta."] },
    { en: "What a fright you gave me! I thought there was nobody in the house.", es: "¡Qué susto me diste! Pensé que no había nadie en la casa.", accept: ["¡Qué susto me diste! [Pensé|Creí|Pensaba] que no había nadie en la casa."] },
    { en: "I'm afraid my son will get lost in the city, because he doesn't know Bogotá.", es: "Me da miedo que mi hijo se pierda en la ciudad, porque no conoce Bogotá.", accept: ["[Me da miedo|Me preocupa] que mi hijo se pierda en la ciudad, porque no conoce Bogotá."] },
    { en: "The day before the interview I was a bundle of nerves. My hands were sweating and I couldn't sleep. (a woman speaking)", es: "El día antes de la entrevista estaba muerta de los nervios. Me sudaban las manos y no podía dormir.", accept: ["[El día antes de|La víspera de] la entrevista estaba muerta de (los) nervios. Me sudaban las manos y no podía dormir."] },
    { en: "When I heard footsteps in the empty house, I got goosebumps.", es: "Cuando oí pasos en la casa vacía, se me puso la piel de gallina.", accept: ["Cuando [oí|escuché] pasos en la casa vacía, se me puso la piel de gallina."] },
    { en: "With so much work and the move on top of it, I feel like I'm going to have a fit.", es: "Con tanto trabajo y el trasteo encima, siento que me va a dar algo.", accept: ["Con tanto trabajo y (con) el trasteo encima, (siento que) me va a dar algo."] }
  ],
  register: [
    { es: "¡Qué susto tan tenaz!", en: "What a terrible fright!", when: "in Colombia, with friends" },
    { es: "Estoy muerta de los nervios.", en: "I'm a bundle of nerves.", when: "with friends and family" },
    { es: "Estoy muy nerviosa.", en: "I'm very nervous.", when: "with anyone, plain and neutral" },
    { es: "Me siento muy ansioso.", en: "I feel very anxious.", when: "to a doctor, or in writing" }
  ],
  personal: {
    prompt: "Describe something that frightened you or made you nervous: how your body reacted before, and the moment of the fright itself.",
    constraints: [
      { type: "regex", pattern: "se me (puso|pusieron|hizo|pone|ponen|hace)\\s|me (sudaban|temblaban|sudan|tiemblan)\\s|nervios de punta|corazón en la boca", label: "the body reacting: *me sudaban las manos*, *se me pusieron los pelos de punta*" },
      { type: "containsAny", words: ["susto", "me da miedo", "me dio miedo", "me aterra", "me aterró", "pánico"], label: "the fright: *¡qué susto!*, *me aterra*" }
    ],
    model: "Antes del examen de manejo me sudaban las manos y me temblaban las piernas. Cuando un perro se atravesó en la calle, me pegué un susto tenaz."
  },
  pitfalls: [
    "*Estoy como un flan* is Spain; in Colombia, *estoy muerta de los nervios* or *tengo los nervios de punta*.",
    "*Me da miedo que* takes the subjunctive: *que se cancele*, not *que se cancela*.",
    "*Tenaz* in Colombia intensifies anything hard: *un susto tenaz*, *un trancón tenaz*."
  ]
},

"fn-estado-animo-alegria-c1": {
  source: "merged",
  hook: {
    line: "For weeks your friend Mariana has been quiet and tired, waiting to hear about a master's place in Barcelona. Today she walks into the café looking different, and before she can sit down you ask what is going on.",
    es: "¿Y esa cara? ¿Pasó algo?\n¡Me aceptaron! No quepo de la felicidad.\nAy, Mari, me alegra muchísimo que te haya salido.",
    en: "What's with that face? Did something happen?\nThey accepted me! I'm over the moon.\nOh, Mari, I'm so glad it worked out for you."
  },
  examples: [
    { es: "¿Qué tal ese ánimo? Te noto rara desde hace días, y no me has contado nada.", en: "How are your spirits? You've seemed off for days, and you haven't told me anything." },
    { es: "¡Me aceptaron en la maestría! No quepo de la felicidad, todavía no me lo creo.", en: "They accepted me for the master's! I'm over the moon, I still can't believe it." },
    { es: "Me alegra muchísimo que te haya salido, y tus papás deben de estar orgullosísimos de ti.", en: "I'm so glad it worked out for you, and your parents must be terribly proud of you." }
  ],
  rule: "Asking about someone's mood climbs from casual to pressing: *¿Qué tal ese ánimo?* *¿Cómo vas con lo de la beca?* *¿Te pasa algo? Te noto rara.* *¿Y esa cara?* asks from what you can see. *¿Se puede saber qué te pasa?* insists, and sounds impatient.\nJoy, from calm to bursting: *estoy de muy buen genio*; *estoy feliz de la vida*; *no quepo de la felicidad*; *salté de la alegría*.\nFor someone else's news, the subjunctive: *Me alegra muchísimo que te haya salido.* *Estamos orgullosos de que* plus the subjunctive.\nFormal: *Tengo el gusto de presentarles a...*",
  readAndPick: [
    { q: "What prompts the question?", es: "¿Y esa cara? ¿Pasó algo?",
      options: ["Something written on her face", "Her weeks away", "A question she asked first"], answer: 0,
      why: "*¿Y esa cara?* asks from what you can see on someone's face." },
    { q: "How does this question sound?", es: "¿Se puede saber qué te pasa?",
      options: ["Light and very casual", "Formal and extremely polite", "Pressing, a bit impatient"], answer: 2,
      why: "*¿Se puede saber...?* insists: the speaker's patience is wearing thin." },
    { q: "How happy is she?", es: "No quepo de la felicidad.",
      options: ["Fairly content with it", "Bursting with joy", "Calm and relaxed"], answer: 1,
      why: "*No caber de la felicidad*: so happy she doesn't fit inside herself." },
    { q: "Why *haya salido*?", es: "Me alegra muchísimo que te haya salido.",
      options: ["She doubts it happened", "She's reacting to the news", "It is still in the future"], answer: 1,
      why: "*Me alegra que* reacts to a fact, so the subjunctive follows." },
    { q: "Where would you hear this?", es: "Tengo el gusto de presentarles a la nueva directora.",
      options: ["At an official event", "At a cousin's barbecue", "In a quick text"], answer: 0,
      why: "*Tengo el gusto de* belongs to formal introductions and speeches." }
  ],
  yourTurn: [
    { en: "What's with that face? Did something happen?", es: "¿Y esa cara? ¿Pasó algo?", accept: ["¿[Y esa cara|Por qué esa cara]? ¿[Pasó|Te pasó] algo?"] },
    { en: "I'm over the moon.", es: "No quepo de la felicidad.", accept: ["No quepo de la [felicidad|alegría].", "Estoy feliz de la vida."] },
    { en: "I'm so glad it worked out for you. (to a friend)", es: "Me alegra muchísimo que te haya salido.", accept: ["Me alegra [muchísimo|mucho] que te haya salido (bien).", "Me alegro [muchísimo|mucho] de que te haya salido (bien)."] },
    { en: "Is something wrong? You seem off. (to a woman)", es: "¿Te pasa algo? Te noto rara.", accept: ["¿Te pasa algo? Te noto [rara|extraña]."] },
    { en: "We're proud that you work here. (to a friend)", es: "Estamos orgullosos de que trabajes aquí.", accept: ["Estamos [orgullosos|orgullosas] de que trabajes aquí."] }
  ],
  translate: [
    { en: "How's it going with the scholarship? Have you heard anything from the university yet?", es: "¿Cómo vas con lo de la beca? ¿Ya te dijeron algo de la universidad?", accept: ["¿Cómo vas con lo de la beca? ¿Ya te dijeron algo [de la|desde la] universidad?", "¿Cómo vas con lo de la beca? ¿Ya te dijo algo la universidad?"] },
    { en: "When they gave her the news, she jumped for joy in the middle of the office.", es: "Cuando le dieron la noticia, saltó de la alegría en plena oficina.", accept: ["Cuando le dieron la noticia, [saltó|se puso a saltar|brincó] de (la) alegría en [plena oficina|la mitad de la oficina|medio de la oficina]."] },
    { en: "Would you mind telling me what's wrong with you? You haven't said a word all morning.", es: "¿Se puede saber qué te pasa? No has dicho ni una palabra en toda la mañana.", accept: ["¿Se puede saber qué te pasa? No [has dicho|dijiste] ni una palabra en toda la mañana."] },
    { en: "I'm in a really good mood today: I got paid, it's Friday and it isn't raining. (Colombia)", es: "Hoy estoy de muy buen genio: me pagaron, es viernes y no llueve.", accept: ["Hoy estoy de muy buen [genio|humor]: me pagaron, es viernes y no llueve."] },
    { en: "I have the pleasure of introducing the new director of the museum, Doctor Elena Ruiz.", es: "Tengo el gusto de presentarles a la nueva directora del museo, la doctora Elena Ruiz.", accept: ["Tengo el [gusto|placer] de presentarles a la nueva directora del museo, la doctora Elena Ruiz."] },
    { en: "My grandmother is over the moon: all her grandchildren came to celebrate her ninetieth.", es: "Mi abuela está feliz de la vida: todos sus nietos vinieron a celebrarle los noventa.", accept: ["Mi abuela [está feliz de la vida|no cabe de la felicidad]: todos sus nietos vinieron a celebrarle los noventa (años)."] }
  ],
  register: [
    { es: "¡Estoy feliz de la vida!", en: "I'm on top of the world!", when: "with friends and family" },
    { es: "Estoy muy contenta.", en: "I'm very happy.", when: "with anyone, plain and warm" },
    { es: "Me siento muy satisfecho con el resultado.", en: "I am very pleased with the result.", when: "at work, or in an interview" },
    { es: "Tengo el gusto de presentarles a...", en: "It is my pleasure to introduce...", when: "opening a talk or an official event" }
  ],
  personal: {
    prompt: "A friend has been down for weeks and today looks happy. Write the exchange: how you ask, how they tell you the news, and how you react to it.",
    constraints: [
      { type: "containsAny", words: ["esa cara", "qué tal ese ánimo", "te pasa algo", "te noto", "cómo vas con", "se puede saber"], label: "how you ask: *¿y esa cara?*, *te noto rara*" },
      { type: "containsAny", words: ["no quepo", "feliz de la vida", "salté de la alegría", "saltar de la alegría", "buen genio"], label: "their joy: *no quepo de la felicidad*" },
      { type: "subjunctiveAfter", trigger: "alegra", label: "your reaction: *me alegra mucho que* plus the subjunctive" }
    ],
    model: "¿Y esa cara? ¿Te pasó algo? ¡Me dieron el trabajo en Cali! No quepo de la felicidad. ¡Me alegra muchísimo que te lo hayan dado!"
  },
  pitfalls: [
    "In Colombia *estar de buenas* means to be lucky; for a good mood, *estar de buen genio*.",
    "*Me alegra que te ha salido* is wrong: reacting to news takes the subjunctive, *te haya salido*.",
    "*Ser orgulloso* is to be arrogant; proud of someone is *estar orgulloso de*."
  ]
},

"fn-decepcion-resignacion-c1": {
  source: "old",
  hook: {
    line: "You have had tickets for six months to see your favourite band at the Movistar Arena in Bogotá, and the hotel is paid. The day before, the concert is cancelled. On the group chat, everyone goes through the disappointment and out the other side.",
    es: "¡Qué embarrada! Llevaba seis meses esperando.\nEsto no es lo que nos prometieron.\nYa qué, toca esperar a que lo reprogramen.",
    en: "What a letdown! I'd been waiting six months.\nThis isn't what they promised us.\nOh well, we'll have to wait for them to reschedule it."
  },
  examples: [
    { es: "¡Qué embarrada! Llevaba seis meses esperando ese concierto y lo cancelan un día antes.", en: "What a letdown! I'd been waiting six months for that concert and they cancel it the day before." },
    { es: "Esto no es para nada lo que nos prometieron cuando compramos las boletas en mayo.", en: "This is nothing like what they promised us when we bought the tickets in May." },
    { es: "Ya qué, toca esperar a que lo reprogramen, y que sea lo que Dios quiera.", en: "Oh well, we'll have to wait for them to reschedule it, and whatever will be, will be." }
  ],
  rule: "Disappointment, from mild to sharp: *¡qué pesar!*; *¡qué embarrada!*, very Colombian; *¡qué decepción!* Measured against what you expected: *Esto no es lo que me esperaba.* *Esperaba mucho más.*\nResignation, once nothing can be done: *Ya qué*, Colombian for oh well. *Ni modo.* *Qué le vamos a hacer.* *Toca esperar*, with Colombian *tocar*.\nHanding it over: *Que sea lo que Dios quiera.* It is a fixed phrase, not a statement of faith.\nThe process of accepting: *Me resigné a perder la plata del hotel.*\nIn writing: *Lamentamos informarles que...*",
  readAndPick: [
    { q: "How does she feel about the news?", es: "¡Qué embarrada! Llevaba seis meses esperando.",
      options: ["Relieved that it's over", "Badly let down by it", "Mildly curious"], answer: 1,
      why: "*¡Qué embarrada!* is a Colombian cry of disappointment: what a letdown." },
    { q: "What is she comparing?", es: "Esto no es lo que nos prometieron.",
      options: ["Two shows she went to", "Two different hotel prices", "The facts and the promise"], answer: 2,
      why: "*Esto no es lo que...* measures what happened against what was expected." },
    { q: "What does *ya qué* express?", es: "Ya qué, toca esperar.",
      options: ["Anger at the band and the venue", "Acceptance, oh well", "A question about time"], answer: 1,
      why: "In Colombia *ya qué* is an oh well: nothing more can be done." },
    { q: "Is the speaker making a religious claim?", es: "Que sea lo que Dios quiera.",
      options: ["No, it's a set phrase", "Yes, she is praying", "Yes, she's thanking God"], answer: 0,
      why: "*Que sea lo que Dios quiera* is a fixed phrase of resignation, said by believers and others." },
    { q: "What has she accepted?", es: "Me resigné a perder la plata del hotel.",
      options: ["Losing the hotel money", "Getting a full refund", "A cheaper hotel"], answer: 0,
      why: "*Resignarse a* plus the dictionary form: accepting something it took time to accept." }
  ],
  yourTurn: [
    { en: "What a letdown! (Colombia)", es: "¡Qué embarrada!", accept: ["¡Qué embarrada!", "¡Qué decepción!"] },
    { en: "This isn't what I expected.", es: "Esto no es lo que me esperaba.", accept: ["Esto no es lo que (me) esperaba."] },
    { en: "Oh well, we'll have to wait. (Colombia)", es: "Ya qué, toca esperar.", accept: ["[Ya qué|Ni modo], (nos) toca esperar."] },
    { en: "Whatever will be, will be.", es: "Que sea lo que Dios quiera.", accept: [] },
    { en: "I've resigned myself to losing the money.", es: "Me resigné a perder la plata.", accept: ["Me [resigné|he resignado] a perder [la plata|el dinero]."] }
  ],
  translate: [
    { en: "What a disappointing match! We expected much more from the national team against such a weak side.", es: "¡Qué decepción de partido! Esperábamos mucho más de la Selección contra un equipo tan débil.", accept: ["¡[Qué decepción de partido|Qué partido tan decepcionante]! Esperábamos mucho más de la Selección contra un equipo tan débil."] },
    { en: "There's nothing more to be done; we'll have to accept the conditions and start again. (Colombia)", es: "Ya no hay nada que hacer; toca aceptar las condiciones y empezar de nuevo.", accept: ["(Ya) no hay nada que hacer; [toca|hay que|nos toca] aceptar las condiciones y empezar de [nuevo|cero]."] },
    { en: "They cancelled the flight because of the strike. Oh well: we'll have to spend another night in Cartagena.", es: "Cancelaron el vuelo por el paro. Ni modo: nos toca pasar otra noche en Cartagena.", accept: ["[Cancelaron el vuelo|El vuelo se canceló] por el paro. [Ni modo|Ya qué]: nos toca pasar otra noche en Cartagena."] },
    { en: "It took me years to resign myself to not having children, but today I'm at peace.", es: "Me costó años resignarme a no tener hijos, pero hoy estoy en paz.", accept: ["Me [costó|tomó] años resignarme a no tener hijos, pero hoy estoy en paz."] },
    { en: "We have done everything we could; now, whatever will be, will be.", es: "Hemos hecho todo lo posible; ahora, que sea lo que Dios quiera.", accept: ["[Hemos hecho|Hicimos] todo lo posible; ahora, que sea lo que [Dios quiera|tenga que ser]."] },
    { en: "We regret to inform you that the event has been cancelled for reasons beyond our control. (formal)", es: "Lamentamos informarles que el evento ha sido cancelado por motivos ajenos a nuestra voluntad.", accept: ["Lamentamos informarles que el evento [ha sido cancelado|fue cancelado|se canceló] por motivos ajenos a nuestra voluntad."] }
  ],
  register: [
    { es: "¡Qué embarrada!", en: "What a letdown!", when: "in Colombia, among friends" },
    { es: "¡Qué decepción!", en: "What a disappointment!", when: "anywhere, in speech" },
    { es: "Ni modo.", en: "Oh well.", when: "everyday speech, across much of Latin America" },
    { es: "Lamentamos informarles que...", en: "We regret to inform you that...", when: "a formal notice or email" }
  ],
  personal: {
    prompt: "Something you were looking forward to fell through. Write three lines: the disappointment, what you had expected, and how you came to accept it.",
    constraints: [
      { type: "containsAny", words: ["qué embarrada", "qué decepción", "qué pesar", "qué desilusión"], label: "the disappointment: *¡qué embarrada!*" },
      { type: "containsAny", words: ["lo que me esperaba", "lo que esperaba", "esperaba mucho más", "lo que nos prometieron"], label: "what you expected: *no es lo que me esperaba*" },
      { type: "containsAny", words: ["ya qué", "ni modo", "qué le vamos a hacer", "toca", "lo que dios quiera", "me resigné", "resignarme"], label: "acceptance: *ya qué*, *ni modo*, *toca*" }
    ],
    model: "¡Qué embarrada! Nos cancelaron el paseo a San Gil por la lluvia. Esperaba mucho más de ese fin de semana. Ya qué, toca dejarlo para enero."
  },
  pitfalls: [
    "*¡Vaya, hombre!* is Spain; in Colombia the letdown is *¡qué embarrada!* or *¡qué pesar!*",
    "*Toca* here is not touching: *toca esperar* means we'll have to wait.",
    "*Me resigné a* takes *a* and the dictionary form: *me resigné a perderla*."
  ]
},

"fn-empatia-alivio-esperanza-c1": {
  source: "merged",
  hook: {
    line: "Your friend Juliana's father has had heart surgery at a hospital in Cali, and she has been in the waiting room since seven. You keep her company by phone all day: first you listen, then the news comes, then you hope with her.",
    es: "Me imagino lo que estás pasando. No me extraña que estés agotada.\n¡Ya salió de cirugía! ¡Qué alivio!\nCruzo los dedos para que se recupere pronto.",
    en: "I can imagine what you're going through. No wonder you're exhausted.\nHe's out of surgery! What a relief!\nI've got my fingers crossed that he recovers soon."
  },
  examples: [
    { es: "Me imagino lo que estás pasando; a mí me pasó algo muy parecido con mi mamá.", en: "I can imagine what you're going through; something very similar happened to me with my mum." },
    { es: "¡Menos mal que salió bien de la cirugía! Me quitaste un peso de encima con esa noticia.", en: "Thank goodness he came through the surgery well! You took a weight off my mind with that news." },
    { es: "¡Ya era hora de que te dieran noticias! Llevabas siete horas en esa sala de espera.", en: "About time they gave you some news! You'd been in that waiting room for seven hours." }
  ],
  rule: "Empathy first, advice later. *Me imagino lo que estás pasando.* *No me extraña que estés agotada*, with the subjunctive, says her reaction makes sense. *A mí me pasó algo parecido.* *Me pongo en tus zapatos.*\nRelief: *¡Qué alivio!* *¡Menos mal!* *Me quitaste un peso de encima.* When it took too long: *¡Ya era hora de que te dieran noticias!*, with the *-ra* form.\nHope: *Ojalá* or *Dios quiera que* plus the subjunctive. *Cruzo los dedos para que se recupere.* *Toco madera.* Formal: *Confiamos en que se recupere pronto.*\n*Te compadezco* can sound distant: friends prefer the others.",
  readAndPick: [
    { q: "What is she telling her friend?", es: "No me extraña que estés agotada.",
      options: ["You shouldn't be so tired", "It's a surprise you're tired", "It makes sense you're tired"], answer: 2,
      why: "*No me extraña que* plus the subjunctive tells someone their reaction makes sense." },
    { q: "How long did the wait feel?", es: "¡Ya era hora de que te dieran noticias!",
      options: ["Far too long", "Surprisingly short", "About right"], answer: 0,
      why: "*Ya era hora* adds impatience to relief: it took too long." },
    { q: "What does *cruzo los dedos* express?", es: "Cruzo los dedos para que se recupere pronto.",
      options: ["A promise to pray", "Hope that it goes well", "Doubts about it"], answer: 1,
      why: "*Cruzo los dedos para que* plus the subjunctive is hope, half superstition." },
    { q: "What did the news do for her?", es: "Me quitaste un peso de encima.",
      options: ["It made her much more worried", "It made her a bit cross", "It took a weight off her"], answer: 2,
      why: "*Quitarse un peso de encima* is relief: a worry lifted." },
    { q: "Which answer sounds most distant?", es: "Mi papá está en el hospital.",
      options: ["Te compadezco mucho.", "Me imagino lo que sientes.", "Ay, lo siento."], answer: 0,
      why: "*Te compadezco* is correct but can sound distant, even condescending, between friends." }
  ],
  yourTurn: [
    { en: "I can imagine what you're going through. (to a friend)", es: "Me imagino lo que estás pasando.", accept: ["Me imagino lo que estás [pasando|viviendo]."] },
    { en: "No wonder you're exhausted. (to a woman)", es: "No me extraña que estés agotada.", accept: ["No me extraña (nada) que estés [agotada|cansadísima|rendida]."] },
    { en: "Thank goodness he came through the surgery well!", es: "¡Menos mal que salió bien de la cirugía!", accept: ["¡Menos mal que salió bien de la [cirugía|operación]!"] },
    { en: "About time they gave you some news!", es: "¡Ya era hora de que te dieran noticias!", accept: ["¡Ya era hora de que te dieran noticias!", "¡Ya era hora de que te dieran alguna noticia!"] },
    { en: "I've got my fingers crossed that he recovers soon.", es: "Cruzo los dedos para que se recupere pronto.", accept: ["Cruzo los dedos para que se recupere pronto.", "Tengo los dedos cruzados para que se recupere pronto."] }
  ],
  translate: [
    { en: "I hope your dad recovers soon; we're all thinking of you here.", es: "Ojalá tu papá se recupere pronto; aquí todos estamos pensando en ustedes.", accept: ["Ojalá tu [papá|padre] se recupere pronto; aquí todos estamos pensando en [ustedes|ti]."] },
    { en: "No wonder you're so upset: in your place I'd be furious. (two women)", es: "No me extraña que estés tan disgustada: yo en tu lugar estaría furiosa.", accept: ["No me extraña (nada) que estés tan [disgustada|molesta|brava]: yo en tu lugar estaría furiosa."] },
    { en: "Thank goodness you called! I've been worried since this morning. What did the doctors say? (a woman speaking)", es: "¡Menos mal que llamaste! Estoy preocupada desde esta mañana. ¿Qué dijeron los médicos?", accept: ["¡Menos mal que [llamaste|me llamaste]! [Estoy|He estado] preocupada desde esta mañana. ¿Qué dijeron los [médicos|doctores]?"] },
    { en: "Something very similar happened to me, so I can put myself in your shoes.", es: "A mí me pasó algo muy parecido, así que me pongo en tus zapatos.", accept: ["A mí me pasó algo muy parecido, así que me pongo en [tus zapatos|tu lugar]."] },
    { en: "We trust that the situation at the hospital will improve in the coming weeks. (formal)", es: "Confiamos en que la situación del hospital mejore en las próximas semanas.", accept: ["Confiamos en que la situación del hospital mejore en las [próximas|siguientes] semanas."] },
    { en: "About time they fixed the road! For two years we had to go the long way round.", es: "¡Ya era hora de que arreglaran la carretera! Durante dos años nos tocó dar la vuelta larga.", accept: ["¡Ya era hora de que arreglaran la [carretera|vía]! (Durante) dos años [nos tocó|tuvimos que] dar la vuelta larga."] }
  ],
  register: [
    { es: "Ánimo, aquí estoy.", en: "Hang in there, I'm here.", when: "a message to a close friend" },
    { es: "Me imagino lo que estás pasando.", en: "I can imagine what you're going through.", when: "with anyone you call tú" },
    { es: "Lo acompaño en este momento tan difícil.", en: "I'm with you at this very hard time.", when: "to a man you call usted, at a hospital" },
    { es: "Confiamos en que se recupere pronto.", en: "We trust he will recover soon.", when: "a card or message from a company" }
  ],
  personal: {
    prompt: "A friend is waiting for important news: an exam, a diagnosis, a visa. Write three lines: show you understand, react when the news is good, and wish them well for what comes next.",
    constraints: [
      { type: "containsAny", words: ["me imagino lo que", "no me extraña que", "me pongo en tus zapatos", "me pongo en tu lugar", "a mí me pasó"], label: "empathy: *me imagino lo que...*, *no me extraña que*" },
      { type: "containsAny", words: ["qué alivio", "menos mal", "ya era hora", "peso de encima"], label: "relief: *¡qué alivio!*, *¡ya era hora!*" },
      { type: "containsAny", words: ["ojalá", "cruzo los dedos", "dedos cruzados", "toco madera", "dios quiera"], label: "hope: *ojalá*, *cruzo los dedos*" }
    ],
    model: "Me imagino lo que estás pasando con lo de la visa. ¿Te la dieron? ¡Qué alivio! Ojalá el viaje te salga perfecto."
  },
  pitfalls: [
    "*Simpatizo contigo* means I like you, not I sympathise: say *me imagino lo que sientes*.",
    "*No me extraña que estás cansada* is wrong: after *no me extraña que*, the subjunctive, *estés*.",
    "*Ya era hora* adds a reproach that *¡por fin!* doesn't carry."
  ]
},

"fn-gustos-aversion-c1": {
  source: "merged",
  hook: {
    line: "A radio reporter is out on the Séptima in Bogotá with a microphone, asking people what they love about the city and what they cannot stand. Everyone has an answer, and nobody stops at *me gusta*.",
    es: "Adoro el centro un domingo por la mañana.\nNo soporto que me empujen en TransMilenio.\nCuanto más vivo aquí, más me gusta.",
    en: "I adore the centre on a Sunday morning.\nI can't stand people shoving me on TransMilenio.\nThe longer I live here, the more I like it."
  },
  examples: [
    { es: "Adoro caminar por el centro un domingo por la mañana, cuando cierran la Séptima a los carros.", en: "I adore walking through the centre on a Sunday morning, when they close the Séptima to cars." },
    { es: "No soporto que me empujen en TransMilenio, y menos cuando voy con el bebé.", en: "I can't stand people shoving me on TransMilenio, especially when I've got the baby with me." },
    { es: "Cuanto más tiempo llevo en Bogotá, más me gusta, aunque el frío todavía me cuesta.", en: "The longer I've been in Bogotá, the more I like it, though the cold is still hard for me." }
  ],
  rule: "Liking has a scale: *me agrada*, mild and formal; *me gusta*; *me encanta*; *me fascina*; *adoro*. So does dislike: *no me gusta mucho*; *me molesta*; *no soporto*; *detesto*; *me da asco*, which is physical.\nWhen someone else's habit is the problem, *que* plus the subjunctive: *No soporto que me empujen.* If it is your own action, no *que*: *Odio madrugar.*\nA taste that grows: *Cuanto más..., más...*: *Cuanto más la conozco, más me gusta.*\n*Me llama la atención* is interest, not liking. For people: *me cae bien*, *me cae mal*, *me cae pesado*.",
  readAndPick: [
    { q: "How strong is this dislike?", es: "Me da asco cómo dejan la basura en la calle.",
      options: ["Mild, just slightly annoying", "None at all, she doesn't care", "Physical: it disgusts her"], answer: 2,
      why: "*Me da asco* is the top of the scale: a physical disgust." },
    { q: "Why *empujen* and not *empujan*?", es: "No soporto que me empujen.",
      options: ["It only happened once", "She reacts to others doing it", "She is the one who pushes"], answer: 1,
      why: "*No soporto que* reacts to someone else's habit, so the subjunctive follows." },
    { q: "How does her liking change over time?", es: "Cuanto más la conozco, más me gusta.",
      options: ["It keeps growing", "It fades slowly", "It stays the same"], answer: 0,
      why: "*Cuanto más..., más...* links two things that grow together." },
    { q: "Does she like modern art?", es: "El arte moderno me llama la atención.",
      options: ["It catches her interest", "It's her one great passion", "She can't stand it"], answer: 0,
      why: "*Me llama la atención* is interest or curiosity; it doesn't promise liking." },
    { q: "What is she talking about?", es: "Ese señor me cae pesado.",
      options: ["How heavy that man is", "What she thinks of him", "How he fell over"], answer: 1,
      why: "*Caer bien* or *caer pesado* is how a person strikes you, built like *gustar*." }
  ],
  yourTurn: [
    { en: "I can't stand people interrupting me.", es: "No soporto que me interrumpan.", accept: [] },
    { en: "The more I know her, the more I like her.", es: "Cuanto más la conozco, más me gusta.", accept: ["Cuanto más la conozco, más me [gusta|cae bien]."] },
    { en: "I adore walking through the centre.", es: "Adoro caminar por el centro.", accept: ["Adoro [caminar|pasear] por el centro."] },
    { en: "Rubbish in the street disgusts me.", es: "Me da asco la basura en la calle.", accept: ["Me da asco la basura en [la calle|las calles]."] },
    { en: "I hate getting up early.", es: "Odio madrugar.", accept: ["Odio madrugar.", "Odio levantarme temprano."] }
  ],
  translate: [
    { en: "I can't stand it when people play music at full volume on the bus.", es: "No soporto que la gente ponga música a todo volumen en el bus.", accept: ["No soporto que la gente ponga música a todo volumen en el bus.", "No soporto que pongan música a todo volumen en el bus."] },
    { en: "The more coffee I drink in the afternoon, the worse I sleep at night.", es: "Cuanto más café tomo por la tarde, peor duermo por la noche.", accept: ["Cuanto más café tomo [por la|en la] tarde, peor duermo [por la|en la] noche."] },
    { en: "I love Bogotá, but I hate it raining every afternoon. And I'm sick of the traffic. (a woman speaking)", es: "Me encanta Bogotá, pero odio que llueva todas las tardes. Y el trancón me tiene harta.", accept: ["Me encanta Bogotá, pero [odio|no soporto] que llueva todas las tardes. Y el trancón me tiene harta."] },
    { en: "That politician really rubs me up the wrong way; the more he talks on television, the less I believe him.", es: "Ese político me cae pesadísimo; cuanto más habla en televisión, menos le creo.", accept: ["Ese político me cae [pesadísimo|muy mal|pésimo]; cuanto más habla en [televisión|la televisión], menos le creo."] },
    { en: "Classical music has always caught my attention, though I don't know much about it.", es: "La música clásica siempre me ha llamado la atención, aunque no sé mucho del tema.", accept: ["La música clásica siempre me ha llamado la atención, aunque no sé mucho [del tema|de eso|sobre eso]."] },
    { en: "The way he treats the waiters when he thinks nobody is watching disgusts me.", es: "Me da asco la forma en que trata a los meseros cuando cree que nadie lo ve.", accept: ["Me da asco la [forma|manera] en que trata a los meseros cuando cree que nadie lo ve.", "Me da asco cómo trata a los meseros cuando cree que nadie lo ve."] }
  ],
  register: [
    { es: "Me encanta.", en: "I love it.", when: "anywhere, in speech" },
    { es: "Me fascina.", en: "I'm crazy about it.", when: "with friends, when you really mean it" },
    { es: "Me agrada mucho la propuesta.", en: "I'm very pleased with the proposal.", when: "at work, or in a formal email" },
    { es: "Me da asco.", en: "It disgusts me.", when: "for real disgust, never for a late bus" }
  ],
  personal: {
    prompt: "A reporter stops you in the street: what do you love about your city, and what can't you stand? Three lines, from the top of the scale to the bottom.",
    constraints: [
      { type: "containsAny", words: ["adoro", "me fascina", "me encanta", "me agrada"], label: "something high on the scale: *adoro*, *me fascina*" },
      { type: "subjunctiveAfter", trigger: "soporto", label: "someone else's habit: *no soporto que* plus the subjunctive" },
      { type: "regex", pattern: "\\bcuanto(s|a|as)? m(á|a)s\\s", label: "a taste that grows: *cuanto más..., más...*" }
    ],
    model: "Adoro las montañas que se ven desde mi ventana. No soporto que la gente tire basura en los parques. Cuanto más camino por el centro, más me gusta."
  },
  pitfalls: [
    "*No soporto que me empujan* is wrong: reacting to others takes the subjunctive, *empujen*.",
    "*Odio que madrugar* adds a word: when the action is yours, no *que*: *odio madrugar*.",
    "*Me da asco* is strong and physical: for a dull film, *no me gustó nada*."
  ]
},

"fn-tranquilizar-animar-c1": {
  source: "old",
  hook: {
    line: "Your friend Sebastián didn't get the scholarship to study in Germany, and he says he won't apply again. You spend the evening calming him down, and then pushing him to try once more.",
    es: "Tranquilo, no es el fin del mundo.\nEl no ya lo tienes, así que inténtalo otra vez.\nNo te dé pena escribirle al profesor. ¡Hágale!",
    en: "Easy, it's not the end of the world.\nYou've already got the no, so try again.\nDon't be shy about writing to the professor. Go for it!"
  },
  examples: [
    { es: "Tranquilo, no es el fin del mundo: el año pasado aplicaron tres mil personas para diez becas.", en: "Easy, it's not the end of the world: last year three thousand people applied for ten scholarships." },
    { es: "El no ya lo tienes; si no vuelves a aplicar, seguro que no te la dan.", en: "You've already got the no; if you don't apply again, it's certain they won't give it to you." },
    { es: "No te dé pena escribirle al profesor; lo peor que puede pasar es que no conteste.", en: "Don't be shy about writing to the professor; the worst that can happen is that he doesn't answer." }
  ],
  rule: "To calm someone, take the weight off: *Tranquilo, no pasa nada.* *No es el fin del mundo.* *No te lo tomes tan a pecho.* *Tómatelo con calma.* Find the good part: *Por lo menos lo intentaste.* Look ahead: *Vas a ver que todo sale bien.*\nTo push someone, the logic of nothing to lose: *El no ya lo tienes.* *¿Qué es lo peor que puede pasar?*\nAgainst shyness, in Colombia: *No te dé pena* plus the dictionary form.\nAgainst delay: *¿Qué estás esperando?* *¿Vas a aplicar o qué?* And the shove itself: *¡Ánimo!* *¡Tú puedes!* *¡Hágale!*",
  readAndPick: [
    { q: "What is *el no ya lo tienes* for?", es: "El no ya lo tienes, así que inténtalo.",
      options: ["Comforting him after a loss", "Telling him to give up", "Pushing him to try anyway"], answer: 2,
      why: "*El no ya lo tienes* argues that trying cannot make things worse." },
    { q: "Is she saying his problem doesn't matter?", es: "No es el fin del mundo.",
      options: ["Yes, it means nothing at all", "No, she puts it in proportion", "Yes, she's bored of hearing it"], answer: 1,
      why: "*No es el fin del mundo* puts a problem in perspective without denying it." },
    { q: "What is stopping him, according to her?", es: "No te dé pena escribirle al profesor.",
      options: ["Feeling too shy", "Being very sad", "Not caring at all"], answer: 0,
      why: "In Colombia *no te dé pena* means don't be shy or embarrassed, not don't be sad." },
    { q: "How does she sound?", es: "¿Vas a aplicar o qué?",
      options: ["Very patient and calm", "Pushing, a bit impatient", "Bored by it all"], answer: 1,
      why: "*¿...o qué?* presses someone who keeps putting off a decision." },
    { q: "What good does she find in the failure?", es: "Por lo menos lo intentaste.",
      options: ["That he tried", "That he won", "That it's over"], answer: 0,
      why: "*Por lo menos* rescues something good from something bad." }
  ],
  yourTurn: [
    { en: "Easy, it's not the end of the world. (to a man)", es: "Tranquilo, no es el fin del mundo.", accept: [] },
    { en: "Don't take it so much to heart.", es: "No te lo tomes tan a pecho.", accept: [] },
    { en: "You've already got the no.", es: "El no ya lo tienes.", accept: ["El no ya lo tienes.", "Ya tienes el no."] },
    { en: "Don't be shy about asking. (Colombia, to a friend)", es: "No te dé pena preguntar.", accept: [] },
    { en: "What's the worst that can happen?", es: "¿Qué es lo peor que puede pasar?", accept: ["¿Qué es lo peor que [puede|podría] pasar?"] }
  ],
  translate: [
    { en: "At least you tried; most people don't even send the application.", es: "Por lo menos lo intentaste; la mayoría ni siquiera manda la solicitud.", accept: ["[Por lo menos|Al menos] lo intentaste; la mayoría (de la gente) ni siquiera [manda|envía] la solicitud."] },
    { en: "Take it easy, you'll see that next year everything turns out well.", es: "Tómatelo con calma, vas a ver que el año que viene todo sale bien.", accept: ["Tómatelo con calma, [vas a ver|verás] que el año que viene todo [sale|va a salir|saldrá] bien.", "Tómatelo con calma, [vas a ver|verás] que el próximo año todo [sale|va a salir|saldrá] bien."] },
    { en: "What are you waiting for? Write to her today. The worst that can happen is that she says no.", es: "¿Qué estás esperando? Escríbele hoy mismo. Lo peor que puede pasar es que te diga que no.", accept: ["¿Qué [estás esperando|esperas]? Escríbele hoy (mismo). Lo peor que [puede|podría] pasar es que te diga que no."] },
    { en: "Cheer up! You've already done the hardest part, and now there's only the interview left.", es: "¡Ánimo! Ya hiciste lo más difícil, y ahora solo queda la entrevista.", accept: ["¡Ánimo! Ya [hiciste|has hecho] lo más difícil, y ahora solo [queda|falta] la entrevista."] },
    { en: "Don't be shy about asking the teacher what you don't understand; that's what she's there for.", es: "No te dé pena preguntarle a la profesora lo que no entiendas; para eso está.", accept: ["No te dé pena preguntarle a la profesora lo que no [entiendas|entiendes]; para eso está."] },
    { en: "You can do it! I'm sure this time they'll pick you. (a woman speaking)", es: "¡Tú puedes! Estoy segura de que esta vez te van a escoger.", accept: ["¡Tú puedes! Estoy segura de que esta vez te van a [escoger|elegir|seleccionar].", "¡Tú puedes! Estoy segura de que esta vez te [escogen|eligen|seleccionan]."] }
  ],
  register: [
    { es: "Tranqui, no pasa nada.", en: "Chill, it's fine.", when: "with friends, casually" },
    { es: "Tranquilo, todo va a salir bien.", en: "Don't worry, it will all be fine.", when: "with anyone you call tú" },
    { es: "No se preocupe, eso tiene solución.", en: "Don't worry, there's a way to fix it.", when: "to someone you call usted" },
    { es: "Lo animamos a presentarse de nuevo.", en: "We encourage you to apply again.", when: "a formal letter after a rejection" }
  ],
  personal: {
    prompt: "A friend failed at something and wants to give up. Write three lines: calm them down, give them a reason to try again, and push them to do it.",
    constraints: [
      { type: "containsAny", words: ["no es el fin del mundo", "no pasa nada", "tranquilo", "tranquila", "no te lo tomes", "tómatelo con calma", "por lo menos", "al menos"], label: "calm them: *no es el fin del mundo*" },
      { type: "containsAny", words: ["el no ya lo tienes", "lo peor que puede pasar", "lo peor que podría pasar", "nada que perder"], label: "a reason to try: *el no ya lo tienes*" },
      { type: "containsAny", words: ["hágale", "ánimo", "tú puedes", "qué estás esperando", "qué esperas", "o qué", "no te dé pena"], label: "the push: *¡hágale!*, *¿qué estás esperando?*" }
    ],
    model: "Tranquila, no es el fin del mundo: el examen del pase se puede repetir. El no ya lo tienes, así que pide otra cita. ¡Hágale, que tú manejas muy bien!"
  },
  pitfalls: [
    "*No te cortes* is Spain; in Colombia, *no te dé pena* or *no te dé miedo*.",
    "*El no ya lo tienes* is not comfort after a loss: it is an argument for trying.",
    "*No es el fin del mundo* puts it in proportion; *no es nada* can sound dismissive."
  ]
},

"fn-preferencia-indiferencia-c1": {
  source: "old",
  hook: {
    line: "Four siblings are planning December on a video call: Santa Marta or the coffee region? One has a firm favourite, one couldn't care less, and one would go anywhere as long as everyone is there.",
    es: "Si me toca escoger, me quedo con Salento.\nA mí me da igual; si Juan quiere playa, que vaya.\nNo cambio un diciembre con ustedes por nada del mundo.",
    en: "If I have to choose, I'll go for Salento.\nIt's all the same to me; if Juan wants the beach, let him go.\nI wouldn't trade a December with you lot for anything in the world."
  },
  examples: [
    { es: "Si me toca escoger, me quedo con Salento: prefiero mil veces el frío a la playa.", en: "If I have to choose, I'll go for Salento: I much prefer the cold to the beach." },
    { es: "A mí me da igual el destino; si Juan quiere playa, que se vaya para Santa Marta.", en: "The destination is all the same to me; if Juan wants the beach, let him go to Santa Marta." },
    { es: "¡Qué más da dónde vayamos, si lo importante es que estemos todos juntos en diciembre!", en: "What does it matter where we go, when what counts is that we're all together in December!" }
  ],
  rule: "To ask for a choice: *¿Con cuál te quedas?* *¿Por cuál te decides?*\nTo give one: *Me quedo con...* *Me inclino por...* *Prefiero mil veces...* If you are made to choose, in Colombia: *Si me toca escoger...* The firmest of all: *No lo cambio por nada del mundo.*\nNot caring, politely: *Me da igual.* *Me da lo mismo.* *Por mí, como quieran.* Leaving the decision to them: *si* plus the indicative, then *que* plus the subjunctive: *Si quiere ir, que vaya.*\nDismissive: *¡Qué más da!* *Me importa un comino.*\nFormal: *No tengo ninguna preferencia.*",
  readAndPick: [
    { q: "How firm is her choice?", es: "No cambio Salento por nada del mundo.",
      options: ["Nothing could change it", "She could be talked round", "She hasn't chosen yet"], answer: 0,
      why: "*No lo cambio por nada del mundo* is the firmest preference there is." },
    { q: "Is she giving Juan an order?", es: "Si Juan quiere playa, que vaya.",
      options: ["Yes, he must go", "Yes, she wants him gone", "No, she doesn't mind"], answer: 2,
      why: "*Si quiere..., que vaya* leaves the decision to him: it says she doesn't mind." },
    { q: "What does *si me toca escoger* mean?", es: "Si me toca escoger, me quedo con Salento.",
      options: ["If it's my turn to pay", "If I have to choose", "If I touch the map first"], answer: 1,
      why: "In Colombia *me toca* means I have to: if the choice falls to me." },
    { q: "How polite is this?", es: "Me importa un comino adónde vayan.",
      options: ["Rather dismissive", "Warm and polite", "Formal and neutral"], answer: 0,
      why: "*Me importa un comino* is dismissive: fine with family, rude anywhere else." },
    { q: "What is she saying?", es: "¡Qué más da dónde vayamos!",
      options: ["She needs to know where", "She'd rather go alone", "The place doesn't matter"], answer: 2,
      why: "*¡Qué más da!* takes the importance out of the choice." }
  ],
  yourTurn: [
    { en: "If I have to choose, I'll go for the mountains. (Colombia)", es: "Si me toca escoger, me quedo con la montaña.", accept: ["Si me toca [escoger|elegir], me quedo con la montaña."] },
    { en: "It's all the same to me.", es: "Me da igual.", accept: ["(A mí) me da [igual|lo mismo]."] },
    { en: "If he wants to go, let him go.", es: "Si quiere ir, que vaya.", accept: ["Si (él) quiere ir, que vaya."] },
    { en: "I wouldn't trade it for anything in the world.", es: "No lo cambio por nada del mundo.", accept: ["No lo [cambio|cambiaría] por nada del mundo."] },
    { en: "Which one do you go for? (to a friend)", es: "¿Con cuál te quedas?", accept: ["¿Con cuál te [quedas|quedarías]?"] }
  ],
  translate: [
    { en: "Between the apartment in Chapinero and the house in Chía, I much prefer the apartment.", es: "Entre el apartamento de Chapinero y la casa de Chía, prefiero mil veces el apartamento.", accept: ["Entre el apartamento [de|en] Chapinero y la casa [de|en] Chía, [prefiero mil veces|me quedo con] el apartamento."] },
    { en: "If your sister wants to tell him, let her tell him; I'm not getting involved.", es: "Si tu hermana se lo quiere decir, que se lo diga; yo no me meto.", accept: ["Si tu hermana [se lo quiere decir|quiere decírselo], que se lo diga; yo no me meto."] },
    { en: "Chicken or fish? It's all the same to me, you choose. I'll eat whatever you order.", es: "¿Pollo o pescado? Me da lo mismo, escoge tú. Yo como lo que pidas.", accept: ["¿Pollo o pescado? Me da [lo mismo|igual], [escoge|elige] tú. Yo como lo que pidas."] },
    { en: "In the end I went for the red dress, although the blue one was cheaper.", es: "Al final me decidí por el vestido rojo, aunque el azul era más barato.", accept: ["Al final me [decidí por|quedé con] el vestido rojo, aunque el azul era más barato."] },
    { en: "I couldn't care less what the neighbours say about the colour of the house.", es: "Me importa un comino lo que digan los vecinos del color de la casa.", accept: ["Me importa un comino lo que digan los vecinos [del|sobre el] color de la casa."] },
    { en: "I have no preference regarding the date; whichever suits the rest of the team. (formal)", es: "No tengo ninguna preferencia en cuanto a la fecha; la que le convenga al resto del equipo.", accept: ["No tengo ninguna preferencia [en cuanto a|con respecto a|respecto a|sobre] la fecha; la que le convenga al resto del equipo."] }
  ],
  register: [
    { es: "Me importa un comino.", en: "I couldn't care less.", when: "with family, a little rudely" },
    { es: "Me da igual.", en: "I don't mind.", when: "with anyone, neutral" },
    { es: "Por mí, como quieran.", en: "Whatever you all like.", when: "in a group, leaving them to decide" },
    { es: "No tengo ninguna preferencia.", en: "I have no preference.", when: "at work, or in a formal email" }
  ],
  personal: {
    prompt: "Your family or friends can't agree on a plan. Write three lines: your firm choice for one thing, your shrug about another, and one *si quiere, que...*",
    constraints: [
      { type: "containsAny", words: ["me quedo con", "prefiero mil veces", "me inclino por", "me decido por", "por nada del mundo"], label: "a firm choice: *me quedo con*, *prefiero mil veces*" },
      { type: "containsAny", words: ["me da igual", "me da lo mismo", "qué más da", "como quieran", "me importa un comino"], label: "a shrug: *me da igual*, *¡qué más da!*" },
      { type: "regex", pattern: "\\bsi [a-záéíóúñ ]+, que [a-záéíóúñ]+", label: "leave it to them: *si quiere ir, que vaya*" }
    ],
    model: "Para el almuerzo me quedo con el sancocho, eso no se discute. La hora me da igual. Si mi primo quiere llevar a la novia, que la lleve."
  },
  pitfalls: [
    "*Me importa un pimiento* is Spain; across Latin America, *me importa un comino* or *me da igual*.",
    "*Si quiere ir, que va* is wrong: the second half takes the subjunctive, *que vaya*.",
    "*Me quedo con* is the choice; *me quedo en* is staying somewhere."
  ]
},

"fn-deseos-planes-c1": {
  source: "old",
  hook: {
    line: "New Year's Eve at your aunt's house in Cali. At midnight everyone eats twelve grapes, one wish each, and your cousin runs round the block with a suitcase so the year brings travel. Then, at the table, come the resolutions.",
    es: "¡Qué ganas tengo de que llegue el viaje a Cartagena!\nOjalá este año me den el ascenso.\nMe propuse ahorrar, y la idea es irnos en marzo.",
    en: "I can't wait for the trip to Cartagena!\nI hope they give me the promotion this year.\nI've resolved to save, and the plan is to go in March."
  },
  examples: [
    { es: "Con cada uva pedí un deseo, y el primero fue que mi abuela se mejore pronto.", en: "With each grape I made a wish, and the first was that my grandmother gets better soon." },
    { es: "Me propuse ahorrar todo el año, y la idea es irnos a Cartagena en marzo.", en: "I've resolved to save all year, and the plan is for us to go to Cartagena in March." },
    { es: "El año pasado tenía pensado aprender a bailar salsa, pero al final no me inscribí.", en: "Last year I was planning to learn to dance salsa, but in the end I didn't sign up." }
  ],
  rule: "Wishes, from urgent to impossible: *Me muero de ganas de...* *¡Qué ganas tengo de que llegue el viaje!*, with *que* and the subjunctive. *Ojalá* plus the subjunctive. *Lo ideal sería que* plus the *-ra* form. *¡Si pudiera dejarlo todo!*, left unfinished, knows it won't happen.\nFor someone else: *Que te vaya muy bien.*\nPlans, from firm to barely formed: *Me propuse* plus the dictionary form, a resolution; *tengo pensado*; *la idea es*, very Latin American; *estoy pensando en*; *estoy por renunciar*, almost decided.\nA plan that failed: *Tenía pensado..., pero...*",
  readAndPick: [
    { q: "How likely does she think this is?", es: "¡Si pudiera dejarlo todo y vivir en la playa!",
      options: ["Very likely, it's planned", "Unlikely: a daydream", "Certain, next week"], answer: 1,
      why: "*Si* plus the *-ra* form, left unfinished, is a wish she knows won't come true." },
    { q: "How firm is this plan?", es: "Estoy por renunciar al trabajo.",
      options: ["Done: she has resigned", "Not even an idea yet", "Very nearly decided"], answer: 2,
      why: "*Estar por* plus the dictionary form: an intention that is almost a decision." },
    { q: "Did she learn salsa?", es: "Tenía pensado aprender salsa, pero no me inscribí.",
      options: ["Yes, she took some classes", "No, it stayed a plan", "Yes, a little"], answer: 1,
      why: "*Tenía pensado..., pero...* is a plan that never happened." },
    { q: "What does *la idea es* introduce?", es: "La idea es irnos en marzo.",
      options: ["The actual plan", "A daydream", "An opinion about March"], answer: 0,
      why: "*La idea es* plus the dictionary form is the everyday Latin American way to say the plan is." },
    { q: "Why *llegue* and not *llega*?", es: "¡Qué ganas tengo de que llegue el viaje!",
      options: ["It was last year", "It's the polite form", "It is still to come"], answer: 2,
      why: "*Ganas de que* plus the subjunctive: the wish is for something still to come." }
  ],
  yourTurn: [
    { en: "I hope they give me the promotion this year.", es: "Ojalá este año me den el ascenso.", accept: ["Ojalá (que) este año me den el ascenso.", "Ojalá (que) me den el ascenso este año."] },
    { en: "I can't wait for the trip!", es: "¡Qué ganas tengo de que llegue el viaje!", accept: ["¡Qué ganas (tengo) de que llegue el viaje!", "¡Me muero de ganas de que llegue el viaje!"] },
    { en: "The plan is to leave in March.", es: "La idea es irnos en marzo.", accept: ["La idea es [irnos|salir|viajar] en marzo."] },
    { en: "I'm on the point of quitting. (about your job)", es: "Estoy por renunciar.", accept: ["Estoy [por|a punto de] renunciar."] },
    { en: "I hope everything goes really well for you. (to a friend)", es: "Que te vaya muy bien.", accept: ["[Que|Ojalá] te vaya muy bien."] }
  ],
  translate: [
    { en: "Ideally, they would let us work from home on Fridays.", es: "Lo ideal sería que nos dejaran trabajar desde la casa los viernes.", accept: ["Lo ideal sería que nos dejaran trabajar desde (la) casa los viernes."] },
    { en: "If only I could take a whole month off to travel round the Amazon!", es: "¡Si pudiera tomarme un mes entero de vacaciones para recorrer el Amazonas!", accept: ["¡[Si|Ojalá] pudiera tomarme un mes entero de vacaciones para recorrer el Amazonas!"] },
    { en: "This year I've resolved to read more. The plan is one book a month, starting in January.", es: "Este año me propuse leer más. La idea es un libro al mes, empezando en enero.", accept: ["Este año me [propuse|he propuesto] leer más. La idea es (leer) un libro al mes, empezando en enero.", "Este año me hice el propósito de leer más. La idea es (leer) un libro al mes, empezando en enero."] },
    { en: "I was planning to change jobs, but with the baby on the way I'd rather wait.", es: "Tenía pensado cambiar de trabajo, pero con el bebé en camino prefiero esperar.", accept: ["Tenía [pensado|planeado] cambiar de trabajo, pero con el bebé en camino prefiero esperar."] },
    { en: "I'm dying to see my nephews; I haven't seen them since they moved to Pereira.", es: "Me muero de ganas de ver a mis sobrinos; no los veo desde que se mudaron a Pereira.", accept: ["Me muero de ganas de ver a mis sobrinos; no los veo desde que se [mudaron|fueron] a Pereira."] },
    { en: "Despite having promised myself I'd go to the gym, I haven't been once this month.", es: "Pese a haberme propuesto ir al gimnasio, este mes no he ido ni una vez.", accept: ["[Pese a|A pesar de] haberme propuesto ir al gimnasio, este mes no he ido ni una (sola) vez."] }
  ],
  register: [
    { es: "¡Qué ganas de verte!", en: "I can't wait to see you!", when: "to a friend or family, warmly" },
    { es: "La idea es salir el viernes.", en: "The plan is to leave on Friday.", when: "everyday Latin American speech" },
    { es: "Tengo previsto viajar el viernes.", en: "I plan to travel on Friday.", when: "at work, or in an email" },
    { es: "Les deseamos un feliz año nuevo.", en: "We wish you a happy new year.", when: "a card or message from a company" }
  ],
  personal: {
    prompt: "It is New Year's Eve. Write three lines: a wish for yourself, one for someone else, and a plan you are making, with one plan from last year that never happened.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "ojalá", label: "a wish: *ojalá* plus the subjunctive" },
      { type: "containsAny", words: ["me propuse", "me he propuesto", "la idea es", "tengo pensado", "me hice el propósito"], label: "a plan: *me propuse*, *la idea es*" },
      { type: "regex", pattern: "\\btenía (pensado|planeado)[^.]*, pero", label: "a plan that failed: *tenía pensado..., pero*" }
    ],
    model: "Ojalá este año consiga un trabajo cerca de la casa. Que a mi mamá le vaya muy bien con la operación. Me propuse aprender a nadar; el año pasado tenía pensado hacerlo, pero nunca encontré tiempo."
  },
  pitfalls: [
    "*Ojalá que llega* is wrong: *ojalá* always takes the subjunctive, *llegue*.",
    "*Estoy por* is almost decided; *tengo pensado* is the plan; *me propuse* is a resolution.",
    "*Hacer ilusión* is Spain; in Colombia, *¡qué ganas!* or *me emociona*."
  ]
},

"fn-recordar-olvidar-c1": {
  source: "merged",
  hook: {
    line: "Twenty years after leaving school, your class meets again at a restaurant in Bucaramanga. Half the evening is spent remembering and the other half failing to: names on the tip of the tongue, faces that ring no bell, a song that takes everyone back.",
    es: "¿Cómo se llamaba la profe de química? Lo tengo en la punta de la lengua.\nEse nombre no me suena para nada.\nEsta canción me trae recuerdos de la excursión a San Gil.",
    en: "What was the chemistry teacher called? It's on the tip of my tongue.\nThat name doesn't ring a bell at all.\nThis song brings back memories of the school trip to San Gil."
  },
  examples: [
    { es: "¿Cómo se llamaba la profesora de química? Lo tengo en la punta de la lengua.", en: "What was the chemistry teacher called? It's on the tip of my tongue." },
    { es: "Que yo me acuerde, la excursión a San Gil fue en once, no en décimo.", en: "As far as I remember, the trip to San Gil was in eleventh grade, not tenth." },
    { es: "Esta canción me trae recuerdos de los buses del colegio y de las izadas de bandera.", en: "This song brings back memories of the school buses and the flag ceremonies." }
  ],
  rule: "Remembering with a margin of doubt: *Que yo me acuerde...* *Si mal no recuerdo...* After *que yo*, the subjunctive.\nA name that won't come: *Lo tengo en la punta de la lengua.* A blank: *Me quedé en blanco.* A lost thread: *Se me fue la idea.*\nRecognising, or not: *Me suena* rings a bell; *no me suena para nada* and *no me dice nada*, nothing at all.\nA near miss: *Por poco se me olvida.*\nThings that remind you do the work: *Esta canción me trae recuerdos de...* *Me vino a la memoria su cara.*\nTo make the effort: *hacer memoria*.",
  readAndPick: [
    { q: "Has he forgotten the name for good?", es: "Lo tengo en la punta de la lengua.",
      options: ["Yes, it's completely gone", "No, it just won't come", "He never knew it at all"], answer: 1,
      why: "On the tip of the tongue: he knows it, but it won't come out right now." },
    { q: "Does she know who that is?", es: "Ese nombre no me suena para nada.",
      options: ["Yes, she knows him well", "Only vaguely", "No, not in the slightest"], answer: 2,
      why: "*No me suena para nada*: it rings no bell at all." },
    { q: "How sure is he about the year?", es: "Que yo me acuerde, la excursión fue en once.",
      options: ["Fairly sure, not certain", "Certain beyond all doubt", "He has no idea at all"], answer: 0,
      why: "*Que yo me acuerde* leaves room for a faulty memory." },
    { q: "What does the song do?", es: "Esta canción me trae recuerdos de la excursión.",
      options: ["It takes her right back", "It bores her a little", "It makes her sing along"], answer: 0,
      why: "*Me trae recuerdos de*: the song does the remembering, built like *gustar*." },
    { q: "Did she forget the birthday?", es: "Por poco se me olvida el cumpleaños de Andrea.",
      options: ["Yes, completely", "Almost, but not quite", "She never knew the date"], answer: 1,
      why: "*Por poco se me olvida* is a near miss: she nearly forgot, and didn't." }
  ],
  yourTurn: [
    { en: "It's on the tip of my tongue.", es: "Lo tengo en la punta de la lengua.", accept: [] },
    { en: "That name doesn't ring a bell at all.", es: "Ese nombre no me suena para nada.", accept: ["Ese nombre no me suena para nada.", "Ese nombre no me dice nada."] },
    { en: "As far as I remember, it was in March.", es: "Que yo me acuerde, fue en marzo.", accept: ["Que yo [me acuerde|recuerde], fue en marzo.", "Si mal no recuerdo, fue en marzo."] },
    { en: "I nearly forgot!", es: "¡Por poco se me olvida!", accept: ["¡[Por poco|Casi] se me olvida!"] },
    { en: "This song brings back memories of school.", es: "Esta canción me trae recuerdos del colegio.", accept: [] }
  ],
  translate: [
    { en: "In the middle of the presentation my mind went blank and I didn't know how to go on.", es: "En plena presentación me quedé en blanco y no supe cómo seguir.", accept: ["En [plena presentación|medio de la presentación|la mitad de la presentación] me quedé en blanco y no supe cómo seguir."] },
    { en: "What was I telling you all? I've completely lost my train of thought with all this noise.", es: "¿Qué les estaba diciendo? Se me fue la idea por completo con tanto ruido.", accept: ["¿Qué les estaba diciendo? Se me fue la idea [por completo|completamente] con tanto ruido."] },
    { en: "That smell of coffee brings back memories of my grandmother's kitchen in Manizales.", es: "Ese olor a café me trae recuerdos de la cocina de mi abuela en Manizales.", accept: ["Ese olor a [café|tinto] me trae recuerdos de la cocina de mi abuela en Manizales."] },
    { en: "Do you remember Camilo, the one who sat at the back? No, that name doesn't ring a bell.", es: "¿Te acuerdas de Camilo, el que se sentaba atrás? No, ese nombre no me suena.", accept: ["¿Te acuerdas de Camilo, el que se sentaba [atrás|al fondo]? No, ese nombre no me [suena|dice nada]."] },
    { en: "Suddenly her face came back to me: we had danced at the graduation party.", es: "De repente me vino a la memoria su cara: habíamos bailado en la fiesta de grado.", accept: ["De [repente|pronto] me vino a la memoria su cara: habíamos bailado en la fiesta de grado.", "De [repente|pronto] me acordé de su cara: habíamos bailado en la fiesta de grado."] },
    { en: "Think hard: where did you last see the car keys before going out?", es: "Haz memoria: ¿dónde viste las llaves del carro por última vez antes de salir?", accept: ["Haz memoria: ¿dónde viste [las llaves del carro por última vez|por última vez las llaves del carro] antes de salir?"] }
  ],
  register: [
    { es: "¡Ni idea!", en: "No idea!", when: "with friends, when nothing comes" },
    { es: "No me acuerdo.", en: "I don't remember.", when: "with anyone, plain" },
    { es: "Que yo recuerde, no.", en: "Not as far as I recall.", when: "carefully, when you might be wrong" },
    { es: "No tengo constancia de esa reunión.", en: "I have no record of that meeting.", when: "at work, or in a formal statement" }
  ],
  personal: {
    prompt: "Write about a reunion, a trip back home or an old photo: something you remember with doubt, something that won't come back, and something that brings a memory back.",
    constraints: [
      { type: "containsAny", words: ["que yo me acuerde", "que yo recuerde", "si mal no recuerdo"], label: "a memory with doubt: *que yo me acuerde*" },
      { type: "containsAny", words: ["punta de la lengua", "en blanco", "no me suena", "no me dice nada", "se me fue", "se me olvidó"], label: "one that won't come: *lo tengo en la punta de la lengua*" },
      { type: "regex", pattern: "\\bme (trae|traen|trajo|trajeron) recuerdos|me vino a la memoria|me viene a la memoria", label: "something that brings it back: *me trae recuerdos de*" }
    ],
    model: "Que yo me acuerde, esa foto es de la finca de mi tío en Fusa. El nombre del perro lo tengo en la punta de la lengua. El olor a guayaba me trae recuerdos de esas vacaciones."
  },
  pitfalls: [
    "*Me recuerdo de* is wrong: *me acuerdo de*, or *recuerdo* without *me*.",
    "*No me suena* is recognition; *se me olvidó* is a memory you had and lost.",
    "*Que yo me acuerde* takes the subjunctive: not *que yo me acuerdo*."
  ]
},

"fn-reprochar-ofrecerse-c1": {
  source: "old",
  hook: {
    line: "Your brother lost his job three months ago and told nobody. You find out from your mother. You call him angry and worried at once, so the reproach and the offer of help come in the same breath.",
    es: "Si me hubieras contado, te habría ayudado desde el principio.\n¿Se puede saber por qué no dijiste nada?\nCuenta conmigo para lo que necesites.",
    en: "If you had told me, I'd have helped you from the start.\nWould you mind telling me why you didn't say anything?\nCount on me for whatever you need."
  },
  examples: [
    { es: "Si me hubieras contado lo del trabajo, te habría ayudado a buscar otro desde el principio.", en: "If you had told me about the job, I'd have helped you look for another from the start." },
    { es: "¿Se puede saber por qué no le dijiste nada a nadie en tres meses?", en: "Would you mind telling me why you didn't tell anyone anything for three months?" },
    { es: "No te voy a regañar más: cuenta conmigo, y ya sabes dónde estoy si necesitas algo.", en: "I won't tell you off any more: count on me, and you know where I am if you need anything." }
  ],
  rule: "A reproach about the past is often a condition: *Si me hubieras contado, te habría ayudado.* The structure itself is the complaint. Shorter: *Podrías haberme dicho.*\nPressing questions: *¿Se puede saber por qué...?* *¿Qué haces que todavía no estás listo?*\nBlame and shame, said straight: *La culpa es tuya.* *¿No te da vergüenza?*\nThen the offer, from warm to formal: *Cuenta conmigo.* *Ya sabes dónde estoy.* *¿En qué te puedo colaborar?*, very Colombian. *Estoy a la orden.* In writing: *Quedo a su disposición.* *No dude en contactarnos.*",
  readAndPick: [
    { q: "What is the sentence really doing?", es: "Si me hubieras contado, te habría ayudado.",
      options: ["Making plans", "Reproaching him for the past", "Asking him for a hand"], answer: 1,
      why: "The *si* sentence about the past works as a reproach for what already happened." },
    { q: "Is this a neutral question?", es: "¿Se puede saber por qué no dijiste nada?",
      options: ["Yes, she is merely curious", "Yes, she is being formal", "No, it carries a reproach"], answer: 2,
      why: "*¿Se puede saber...?* is a question with a reproach built in." },
    { q: "What is being offered?", es: "¿En qué te puedo colaborar?",
      options: ["Help with anything he needs", "A job at her own firm, at once", "Money to pay the rent, in cash"], answer: 0,
      why: "In Colombia *colaborar* is everyday for help: *¿en qué te puedo colaborar?*" },
    { q: "Where would you read this?", es: "Quedo a su disposición para cualquier consulta.",
      options: ["Closing a formal email", "In a quick text to her brother", "On a birthday card"], answer: 0,
      why: "*Quedo a su disposición* is the formal offer that closes letters and emails." },
    { q: "Who is to blame, according to her?", es: "La culpa es tuya por no haber avisado.",
      options: ["Nobody in particular", "He is, for not warning", "The company that fired him"], answer: 1,
      why: "*La culpa es tuya* puts the blame on him directly, with no softening." }
  ],
  yourTurn: [
    { en: "If you had told me, I'd have helped you.", es: "Si me hubieras contado, te habría ayudado.", accept: ["Si me hubieras [contado|dicho], te [habría|hubiera] ayudado."] },
    { en: "You could have told me. (to a friend)", es: "Podrías haberme dicho.", accept: ["Podrías haberme [dicho|contado].", "Me podrías haber [dicho|contado]."] },
    { en: "Count on me for whatever you need.", es: "Cuenta conmigo para lo que necesites.", accept: [] },
    { en: "How can I help you? (Colombia, to a friend)", es: "¿En qué te puedo colaborar?", accept: ["¿En qué te puedo [colaborar|ayudar]?"] },
    { en: "Aren't you ashamed?", es: "¿No te da vergüenza?", accept: ["¿No te da [vergüenza|pena]?"] }
  ],
  translate: [
    { en: "If you had left on time, we wouldn't have missed the start of the film.", es: "Si hubieras salido a tiempo, no nos habríamos perdido el comienzo de la película.", accept: ["Si hubieras salido a tiempo, no nos [habríamos|hubiéramos] perdido el [comienzo|principio] de la película."] },
    { en: "What are you up to that you're still not ready? The taxi has been waiting ten minutes. (to a man)", es: "¿Qué haces que todavía no estás listo? El taxi lleva diez minutos esperando.", accept: ["¿Qué haces que [todavía|aún] no estás listo? El taxi lleva diez minutos esperando.", "¿Qué haces que [todavía|aún] no estás listo? El taxi está esperando hace diez minutos."] },
    { en: "Aren't you ashamed of speaking to your grandmother like that in front of everyone?", es: "¿No te da vergüenza haberle hablado así a tu abuela delante de todos?", accept: ["¿No te da [vergüenza|pena] haberle hablado así a tu abuela [delante de|enfrente de|frente a] todos?"] },
    { en: "You know where I am. If you need anything, all you have to do is call me.", es: "Ya sabes dónde estoy. Si necesitas algo, no tienes más que llamarme.", accept: ["Ya sabes dónde estoy. Si necesitas algo, [no tienes más que|solo tienes que] llamarme."] },
    { en: "Thank you for your purchase. Do not hesitate to contact us if any problem arises. (formal)", es: "Gracias por su compra. No dude en contactarnos si se presenta cualquier inconveniente.", accept: ["Gracias por su compra. No dude en [contactarnos|comunicarse con nosotros] si se presenta cualquier [inconveniente|problema]."] },
    { en: "It's your fault for not checking the address before leaving.", es: "La culpa es tuya por no revisar la dirección antes de salir.", accept: ["La culpa es tuya por no [revisar|haber revisado|mirar] la dirección antes de salir."] }
  ],
  register: [
    { es: "Cuenta conmigo.", en: "Count on me.", when: "to family and friends" },
    { es: "Estoy a la orden.", en: "I'm at your service.", when: "in Colombia, to a client or a neighbour" },
    { es: "¿En qué le puedo colaborar?", en: "How can I help you?", when: "in Colombia, in a shop or an office" },
    { es: "Quedo a su disposición.", en: "I remain at your disposal.", when: "closing a formal email or letter" }
  ],
  personal: {
    prompt: "Someone close to you hid a problem from you. Write three lines: the reproach, a pressing question, and the offer of help.",
    constraints: [
      { type: "regex", pattern: "\\bsi [a-záéíóúñ ]*hubi(eras|era|eran|éramos)\\s", label: "the reproach: *si me hubieras contado...*" },
      { type: "containsAny", words: ["se puede saber", "por qué no me", "qué haces que", "no te da vergüenza", "la culpa es tuya"], label: "a pressing question: *¿se puede saber por qué...?*" },
      { type: "containsAny", words: ["cuenta conmigo", "ya sabes dónde estoy", "en qué te puedo", "a la orden", "puedes contar conmigo"], label: "the offer: *cuenta conmigo*" }
    ],
    model: "Si me hubieras dicho que estabas enferma, habría ido a cuidarte. ¿Se puede saber por qué no me llamaste? Cuenta conmigo para lo que necesites."
  },
  pitfalls: [
    "*Si me hubieras dicho* is already a reproach: adding *¡qué mal!* makes it heavy.",
    "*Estoy a la orden* is warm and Colombian; *quedo a su disposición* belongs on paper.",
    "*Colaborar* in Colombia is everyday help: *¿me colabora con esto?* is a request, not a project."
  ]
},

"nt-reflexion-conocimiento-c1": {
  source: "merged",
  hook: {
    line: "You have been offered a job in Panama City, and your mother lives alone in Tunja. For a week you can think about nothing else, and the Spanish of thinking things through is the Spanish of your head, your pillow and your conscience.",
    es: "Le he dado mil vueltas y todavía no sé.\nAnoche caí en cuenta de que tendría que vender el carro.\nVoy a consultarlo con la almohada.",
    en: "I've turned it over a thousand times and I still don't know.\nLast night it dawned on me that I'd have to sell the car.\nI'm going to sleep on it."
  },
  examples: [
    { es: "Le he dado mil vueltas a la oferta de Panamá y todavía no me decido.", en: "I've turned the Panama offer over a thousand times and I still can't make up my mind." },
    { es: "Anoche caí en cuenta de que, si me voy, mi mamá se queda sola en Tunja.", en: "Last night it dawned on me that, if I go, my mum will be left alone in Tunja." },
    { es: "Tengo cargo de conciencia, pero se me ocurrió que podría traérmela a vivir conmigo.", en: "I feel guilty, but it occurred to me that I could bring her to live with me." }
  ],
  rule: "Thinking has its own verbs, and its own body parts.\nHard thinking: *Le di mil vueltas.* *Me estoy quebrando la cabeza.* Putting it off: *Voy a consultarlo con la almohada.*\nThe idea comes to you, with *se me*: *Se me ocurrió una idea.* The idea is the subject.\nThe moment it clicks: *Caí en cuenta de que...* Plain realising: *Me di cuenta de que...*\nA feeling you can't prove: *Me da la impresión de que...* *Sospecho que...*\nKeeping it in mind: *Tenlo presente.* Getting informed: *ponerse al tanto de*.\nGuilt: *tener cargo de conciencia*. Someone absent-minded is *despistado*.",
  readAndPick: [
    { q: "Who is the subject of *ocurrió*?", es: "Se me ocurrió una idea.",
      options: ["The speaker herself", "The idea she had", "Someone else"], answer: 1,
      why: "With *ocurrírsele*, the idea is the subject: it comes to you." },
    { q: "When will he decide?", es: "Voy a consultarlo con la almohada.",
      options: ["Right now", "When his pillow arrives", "After sleeping on it"], answer: 2,
      why: "*Consultarlo con la almohada* is to sleep on a decision." },
    { q: "What kind of realising is this?", es: "Anoche caí en cuenta de que tendría que vender el carro.",
      options: ["A sudden click", "A slow, gradual one", "A mistaken one"], answer: 0,
      why: "*Caer en cuenta* is the moment it clicks; *darse cuenta* is plain realising." },
    { q: "How does she feel?", es: "Tengo cargo de conciencia por dejarla sola.",
      options: ["Guilty about it all", "In charge of her care", "Fully aware of the facts"], answer: 0,
      why: "*Tener cargo de conciencia* is to feel guilty: a moral weight." },
    { q: "How sure is she?", es: "Me da la impresión de que mi jefe ya lo sabe.",
      options: ["Completely certain", "She has a feeling", "She doesn't care"], answer: 1,
      why: "*Me da la impresión de que* is a feeling she can't prove." }
  ],
  yourTurn: [
    { en: "I'm going to sleep on it.", es: "Voy a consultarlo con la almohada.", accept: ["[Voy a consultarlo|Lo voy a consultar] con la almohada."] },
    { en: "An idea occurred to me.", es: "Se me ocurrió una idea.", accept: [] },
    { en: "It dawned on me that it was late.", es: "Caí en cuenta de que era tarde.", accept: ["Caí en (la) cuenta de que era tarde."] },
    { en: "I've turned it over a thousand times.", es: "Le he dado mil vueltas.", accept: ["Le [he dado|di] mil vueltas."] },
    { en: "I have a guilty conscience.", es: "Tengo cargo de conciencia.", accept: [] }
  ],
  translate: [
    { en: "Bear in mind that the bank closes at noon on Saturdays, so go early.", es: "Ten presente que el banco cierra al mediodía los sábados, así que ve temprano.", accept: ["Ten [presente|en cuenta] que el banco cierra al mediodía los sábados, así que ve temprano."] },
    { en: "I racked my brains all afternoon, and in the end the solution occurred to me in the shower.", es: "Me quebré la cabeza toda la tarde, y al final la solución se me ocurrió en la ducha.", accept: ["Me [quebré|rompí] la cabeza toda la tarde, y al final [la solución se me ocurrió|se me ocurrió la solución] en la ducha."] },
    { en: "I was away for two weeks. Can you bring me up to date on how the project is going?", es: "Estuve dos semanas por fuera. ¿Me pones al tanto de cómo va el proyecto?", accept: ["Estuve dos semanas [por fuera|afuera|de viaje]. ¿Me pones al [tanto|día] de cómo va el proyecto?"] },
    { en: "I get the impression my neighbour suspects something, because she doesn't say hello to me any more.", es: "Me da la impresión de que mi vecina sospecha algo, porque ya no me saluda.", accept: ["Me da la [impresión|sensación] de que mi vecina sospecha algo, porque ya no me saluda."] },
    { en: "My brother is so absent-minded that he left his ID card at the notary's office again.", es: "Mi hermano es tan despistado que dejó la cédula en la notaría otra vez.", accept: ["Mi hermano es tan despistado que [dejó la cédula en la notaría otra vez|otra vez dejó la cédula en la notaría]."] },
    { en: "Before signing, think it over twice; a twenty-year loan is no small thing.", es: "Antes de firmar, piénsalo dos veces; un crédito a veinte años no es poca cosa.", accept: ["Antes de firmar, piénsalo [dos veces|bien]; un crédito a veinte años no es poca cosa."] }
  ],
  register: [
    { es: "Déjame pensarlo.", en: "Let me think about it.", when: "with anyone, plain" },
    { es: "Lo voy a consultar con la almohada.", en: "I'll sleep on it.", when: "with friends and family, warmly" },
    { es: "Me estoy quebrando la cabeza.", en: "I'm racking my brains.", when: "informal, when it's hard going" },
    { es: "Lo estudiaremos con detenimiento.", en: "We will study it carefully.", when: "at work, answering a formal proposal" }
  ],
  personal: {
    prompt: "Think of a decision you had to make. Write three lines: how you turned it over, the moment something clicked, and what you did in the end.",
    constraints: [
      { type: "containsAny", words: ["mil vueltas", "quebrando la cabeza", "quebré la cabeza", "rompí la cabeza", "con la almohada", "pensarlo dos veces", "lo pensé"], label: "turning it over: *le di mil vueltas*, *con la almohada*" },
      { type: "containsAny", words: ["caí en cuenta", "caí en la cuenta", "se me ocurrió", "me di cuenta"], label: "the click: *caí en cuenta de que*, *se me ocurrió*" }
    ],
    model: "Le di mil vueltas a lo de estudiar en Medellín. Una noche caí en cuenta de que mi miedo era dejar a mis amigos, no la ciudad. Lo consulté con la almohada y al final me fui."
  },
  pitfalls: [
    "*Me ocurrí una idea* is wrong: the idea is the subject, *se me ocurrió una idea*.",
    "*Caer en cuenta* is the click; *darse cuenta* is plain realising: both take *de que*.",
    "*Consultarlo con la almohada* is sleeping on it, not losing sleep over it."
  ]
},

"nt-expresion-verbal-c1": {
  source: "old",
  hook: {
    line: "Monday's all-staff meeting at an insurance company in Bogotá. The manager hints at cuts without saying so, your boss says exactly what she thinks, and afterwards in the corridor everyone tells the meeting their own way.",
    es: "El gerente dejó caer que habría recortes.\nLa jefa, que no tiene pelos en la lengua, le soltó que eso era injusto.\nAl final él tuvo que aclarar que nadie se quedaba sin trabajo.",
    en: "The manager hinted that there would be cuts.\nThe boss, who never minces her words, came straight out and told him it was unfair.\nIn the end he had to make clear that nobody was losing their job."
  },
  examples: [
    { es: "El gerente dejó caer que habría recortes, pero cuando le preguntaron, dijo que no era seguro.", en: "The manager hinted that there would be cuts, but when they asked him, he said it wasn't certain." },
    { es: "Mi jefa no tiene pelos en la lengua: le soltó delante de todos que eso era injusto.", en: "My boss never minces her words: she came straight out and told him in front of everyone that it was unfair." },
    { es: "Durante la reunión sostuvo que las cifras eran buenas, pero luego tuvo que reconocer el error.", en: "During the meeting he maintained that the figures were good, but later he had to admit the mistake." }
  ],
  rule: "Spanish has a verb for each way of saying something, and choosing it is how you report fairly.\nHinting: *dejar caer que*, *dar a entender que*: said without quite saying it.\nBlurting: *soltar*: *Le soltó que era injusto.*\nHolding a position against opposition: *sostener que*, *mantener que*.\nGiving ground: *reconocer*, *admitir*. Correcting yourself: *rectificar*. Going against someone else: *contradecir*.\nMaking it clear: *aclarar*, *puntualizar*, *poner las cosas en claro*.\nTelling off: *regañar*; in Colombia, a long nagging lecture is *echar cantaleta*.\nAnd people: *no tiene pelos en la lengua*, *habla hasta por los codos*.",
  readAndPick: [
    { q: "Did the manager announce the cuts?", es: "El gerente dejó caer que habría recortes.",
      options: ["Yes, officially", "No, he denied them", "He hinted at them, no more"], answer: 2,
      why: "*Dejar caer* is to hint: he can deny later that he said it." },
    { q: "What kind of person is the boss?", es: "La jefa no tiene pelos en la lengua.",
      options: ["She speaks her mind", "She is shy and quiet", "She is often vague"], answer: 0,
      why: "*No tener pelos en la lengua* is to say what you think, bluntly." },
    { q: "Who did he correct?", es: "En la siguiente reunión, el gerente rectificó.",
      options: ["Himself, his own words", "His boss, in public", "A colleague's sums, again"], answer: 0,
      why: "*Rectificar* corrects what you said yourself; *contradecir* goes against someone else." },
    { q: "What did his mother do?", es: "Mi mamá me echó la cantaleta por llegar tarde.",
      options: ["Sang him a lullaby", "Gave him a long lecture", "Cooked him dinner"], answer: 1,
      why: "In Colombia *echar cantaleta* is a long, nagging telling-off." },
    { q: "How did the colleague behave in the meeting?", es: "Andrés habla hasta por los codos.",
      options: ["He barely spoke", "He spoke with his hands", "He talked nonstop"], answer: 2,
      why: "*Hablar hasta por los codos* is to talk without stopping." }
  ],
  yourTurn: [
    { en: "He hinted that there would be cuts.", es: "Dejó caer que habría recortes.", accept: ["[Dejó caer|Dio a entender] que [habría|iba a haber] recortes."] },
    { en: "She never minces her words.", es: "No tiene pelos en la lengua.", accept: ["(Ella) no tiene pelos en la lengua."] },
    { en: "In the end he had to admit the mistake.", es: "Al final tuvo que reconocer el error.", accept: ["Al final tuvo que [reconocer|admitir] [el|su] error."] },
    { en: "My mother gave me a long telling-off. (Colombia)", es: "Mi mamá me echó la cantaleta.", accept: ["Mi [mamá|madre] me echó (la) cantaleta."] },
    { en: "The meeting served to clear things up.", es: "La reunión sirvió para poner las cosas en claro.", accept: ["La reunión sirvió para [poner las cosas en claro|aclarar las cosas]."] }
  ],
  translate: [
    { en: "She maintained her position despite the criticism, and in the end the board agreed with her.", es: "Sostuvo su posición pese a las críticas, y al final la junta le dio la razón.", accept: ["[Sostuvo|Mantuvo] su [posición|postura] [pese a|a pesar de] las críticas, y al final la junta le dio la razón."] },
    { en: "My uncle talks nonstop; at lunch nobody else could say a thing.", es: "Mi tío habla hasta por los codos; en el almuerzo nadie más pudo decir nada.", accept: ["Mi tío habla (hasta) por los codos; en el almuerzo nadie más pudo decir nada."] },
    { en: "The minister didn't say it directly. But she let us understand that the project wouldn't continue.", es: "La ministra no lo dijo directamente. Pero nos dio a entender que el proyecto no seguiría.", accept: ["La ministra no lo dijo directamente. Pero nos [dio a entender|dejó caer] que el proyecto no [seguiría|iba a seguir|continuaría]."] },
    { en: "In the middle of dinner he came out with the news that he was moving to Spain in January.", es: "En plena comida nos soltó que se iba a vivir a España en enero.", accept: ["En [plena comida|medio de la comida|la mitad de la comida] nos soltó que se iba a vivir a España en enero."] },
    { en: "I want to clarify one detail: the meeting is on Thursday, not Friday.", es: "Quiero puntualizar un detalle: la reunión es el jueves, no el viernes.", accept: ["Quiero [puntualizar|aclarar|precisar] un detalle: la reunión es el jueves, no el viernes."] },
    { en: "The company issued an official statement and admitted that the data had been leaked.", es: "La empresa emitió un comunicado oficial y reconoció que los datos se habían filtrado.", accept: ["La empresa [emitió|publicó|sacó] un comunicado oficial y [reconoció|admitió] que los datos se habían filtrado."] }
  ],
  register: [
    { es: "Me echó la cantaleta.", en: "She nagged me no end.", when: "in Colombia, telling it to a friend" },
    { es: "Me regañó.", en: "She told me off.", when: "anywhere, plain" },
    { es: "Me llamó la atención.", en: "She gave me a warning.", when: "at work, about a formal reprimand" },
    { es: "La empresa emitió un comunicado.", en: "The company issued a statement.", when: "the news, or a formal report" }
  ],
  personal: {
    prompt: "Report a meeting, a family lunch or an argument you were part of. Use three different verbs of saying, so the reader knows exactly how each thing was said.",
    constraints: [
      { type: "containsAny", words: ["dejó caer", "dio a entender", "soltó", "sostuvo", "mantuvo", "reconoció", "admitió", "rectificó", "aclaró", "puntualizó", "contradijo", "echó la cantaleta"], label: "a precise verb of saying: *dejó caer*, *soltó*, *reconoció*" },
      { type: "regex", pattern: "(dejó caer|dio a entender|soltó|sostuvo|mantuvo|reconoció|admitió|rectificó|aclaró|puntualizó|contradijo|regañó)[\\s\\S]*(dejó caer|dio a entender|soltó|sostuvo|mantuvo|reconoció|admitió|rectificó|aclaró|puntualizó|contradijo|regañó)[\\s\\S]*(dejó caer|dio a entender|soltó|sostuvo|mantuvo|reconoció|admitió|rectificó|aclaró|puntualizó|contradijo|regañó)", label: "three of them in the report" }
    ],
    model: "En el almuerzo mi tía dejó caer que la finca estaba en venta. Mi primo, que no tiene pelos en la lengua, le soltó que eso era una locura. Al final ella aclaró que solo era una idea."
  },
  pitfalls: [
    "*Dejar caer* is not dropping: *dejó caer que* means he hinted it.",
    "*Rectificar* corrects yourself; *contradecir* contradicts someone else.",
    "*Echar cantaleta* is Colombian; elsewhere you may hear *echar un sermón*."
  ]
},

"task-c1-emocion": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: twenty sentences or more about a relationship or a decision where what you felt was mixed and hard to name. The model is about selling a family house, and it never once says *sad*.",
    es: "Cuando por fin vendimos la casa, no sentí lo que esperaba sentir.\nAl salir de la notaría se me encogió el estómago.\nSi pudiera devolver el tiempo, le tomaría una foto al jardín.",
    en: "When we finally sold the house, I didn't feel what I expected to feel.\nAs we left the notary's office, my stomach turned over.\nIf I could turn back time, I'd take a photo of the garden."
  },
  examples: [
    { es: "Durante meses dije que vender la casa me quitaría un peso de encima, y en parte fue así.", en: "For months I said selling the house would take a weight off my mind, and in part it did." },
    { es: "No es que la extrañara: era el último lugar donde mi papá había estado bien.", en: "It's not that I missed it: it was the last place where my dad had been well." },
    { es: "Me arrepiento de no haberle tomado una foto al jardín; es una bobada, ya lo sé.", en: "I regret not taking a photo of the garden; it's a silly thing, I know." }
  ],
  rule: "The task: twenty sentences or more about a feeling that was mixed and hard to name. At this level emotion is not louder; it is more exact. Four moves from this unit:\nUnderstatement: *no me emocionó mucho que digamos*, which means it didn't at all.\nThe body: *se me encogió el estómago*, *se me arrugó el corazón*.\nDenying the easy reading: *No es que la extrañara: era...*, with the subjunctive.\nRegret, in its fixed frames: *me arrepiento de no haber...*, *si pudiera devolver el tiempo...*\nShow the feeling rather than name it: *triste* once is plenty.",
  readAndPick: [
    { q: "How excited was he?", es: "No me emocionó mucho que digamos.",
      options: ["Very, he was thrilled", "A little, at first", "Not at all, really"], answer: 2,
      why: "*Que digamos* turns the phrase into understatement: it didn't excite him at all." },
    { q: "Does she miss the house?", es: "No es que la extrañara: era el último lugar donde mi papá estuvo bien.",
      options: ["Yes, very much indeed", "Not the house itself", "She never lived there"], answer: 1,
      why: "*No es que* plus the subjunctive denies the easy reading and gives the real one." },
    { q: "What happened in her body?", es: "Al salir de la notaría se me encogió el estómago.",
      options: ["She felt a sudden pang", "She was very hungry", "She felt sick from lunch"], answer: 0,
      why: "*Se me encogió el estómago*: the feeling arrives in the body before it has a name." },
    { q: "Why not just write *estaba triste*?", es: "Se me arrugó el corazón al cerrar la puerta.",
      options: ["Showing is more exact", "It's grammatically wrong", "It sounds too formal"], answer: 0,
      why: "Naming the feeling tells; the body and the moment show it, more exactly." },
    { q: "What does she regret?", es: "Me arrepiento de no haberle tomado una foto al jardín.",
      options: ["Taking too many photos", "Not taking one photo", "Selling the garden"], answer: 1,
      why: "*De no haber* plus a participle regrets something not done." }
  ],
  yourTurn: [
    { en: "It didn't exactly thrill me.", es: "No me emocionó mucho que digamos.", accept: [] },
    { en: "My stomach turned over.", es: "Se me encogió el estómago.", accept: [] },
    { en: "It's not that I missed it. (the house)", es: "No es que la extrañara.", accept: [] },
    { en: "I regret not taking a photo.", es: "Me arrepiento de no haber tomado una foto.", accept: ["Me arrepiento de no haber [tomado|sacado] una foto."] }
  ],
  translate: [
    { en: "When we finally sold the house, I didn't feel what I expected to feel.", es: "Cuando por fin vendimos la casa, no sentí lo que esperaba sentir.", accept: ["Cuando por fin vendimos la casa, no sentí lo que [esperaba|creía que iba a] sentir."] },
    { en: "The day we signed I slept eight hours straight, for the first time in a year.", es: "El día que firmamos dormí ocho horas seguidas, por primera vez en un año.", accept: ["El día (en) que firmamos dormí ocho horas seguidas, por primera vez en un año."] },
    { en: "It's a silly thing, I know. But if I could turn back time, I'd take that photo.", es: "Es una bobada, ya lo sé. Pero si pudiera devolver el tiempo, tomaría esa foto.", accept: ["Es una [bobada|tontería], ya lo sé. Pero si pudiera devolver el tiempo, [tomaría|sacaría] esa foto."] },
    { en: "The new owners were very kind, and somehow that made it harder.", es: "Los nuevos dueños fueron muy amables, y de alguna manera eso lo hizo más difícil.", accept: ["Los nuevos dueños fueron muy amables, y de alguna [manera|forma] eso lo hizo más difícil."] },
    { en: "It's not that I was sad: it was that, without the house, the family had no excuse to meet.", es: "No es que estuviera triste: es que, sin la casa, la familia ya no tenía excusa para reunirse.", accept: ["No es que estuviera triste: es que, sin la casa, la familia ya no tenía [excusa|pretexto] para reunirse.", "No es que estuviera triste, sino que, sin la casa, la familia ya no tenía [excusa|pretexto] para reunirse."] },
    { en: "My brother laughed at everything, but on the way home he didn't say a word.", es: "Mi hermano se reía de todo, pero en el camino de vuelta no dijo ni una palabra.", accept: ["Mi hermano se [reía|rió] de todo, pero en el camino de [vuelta|regreso] no dijo ni una palabra."] }
  ],
  register: [
    { es: "Estaba triste.", en: "I was sad.", when: "a plain fact, once, when nothing else will do" },
    { es: "Se me encogió el estómago.", en: "My stomach turned over.", when: "in a story, to show the moment" },
    { es: "No me emocionó mucho que digamos.", en: "It didn't exactly thrill me.", when: "with friends, as a dry understatement" },
    { es: "Fue un momento de sentimientos encontrados.", en: "It was a moment of mixed feelings.", when: "in a formal text or a speech" }
  ],
  personal: {
    prompt: "Write the opening of your piece: four or five sentences about a moment when what you felt was mixed. Show it in the body, deny the easy reading, and add one regret.",
    constraints: [
      { type: "regex", pattern: "se me (encogió|arrugó|hizo|partió|puso|pusieron)\\s", label: "the body: *se me encogió el estómago*" },
      { type: "subjunctiveAfter", trigger: "no es que", label: "deny the easy reading: *no es que* plus the subjunctive" },
      { type: "containsAny", words: ["me arrepiento de", "si pudiera devolver", "si volviera a nacer", "debí haber", "no debí"], label: "one regret: *me arrepiento de no haber...*" },
      { type: "minSentences", n: 4, label: "four sentences or more" }
    ],
    model: "Cuando mi hermana se fue a vivir a Madrid, la llevé al aeropuerto sin decir casi nada. En la puerta de embarque se me encogió el estómago. No es que no me alegrara por ella: es que la casa iba a quedar en silencio. Me arrepiento de no haberle dicho cuánto la iba a extrañar."
  },
  pitfalls: [
    "*No me hizo especial ilusión* is Spain; in Colombia, *no me emocionó mucho que digamos*.",
    "*No es que la extrañaba* is wrong: *no es que* takes the subjunctive, *extrañara*.",
    "Twenty sentences of *estaba triste* is a list, not a feeling: show it in the body at least once."
  ]
}

};
