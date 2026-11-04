/* ============================================================================
 * TEACHING SCRIPTS, B2 units 1 and 2 (window.SCRIPTS_B2), keyed by lesson id.
 * Units b2-u44 (the ladder of agreeing, opining, softening and certainty) and
 * b2-u45 (building an argument and the words that hold it together): every
 * lesson on the path from COURSE_BANDS.B2, day 353 to day 373.
 *
 * Same anatomy and shape as data/scripts/b1.js (tools/test-scripts-b2.js
 * checks every rule), with what the owner asked of the upper bands:
 *   - fewer, deeper lessons: each script folds in the whole old lesson and
 *     the MERGES it absorbed, so a merged B2 day is one long sitting;
 *   - document-led where a real text helps: the hook is often a short email,
 *     a review, a listing or an exchange of messages, one line per pair;
 *   - real-text sentences in the examples, 12 to 18 words each;
 *   - six translate items per lesson, from one sentence to a short paragraph,
 *     and typed production in every lesson.
 *
 * The subjunctive may be named in a rule (R2), never in a hook; the
 * indicative is still "the ordinary form". By day 353 the course has built
 * the future, the conditional, the past (-ra) subjunctive, the perfect
 * subjunctive, the future perfect and the conditional perfect, so all of them
 * are used here; the pluperfect subjunctive (hubiera hecho) comes on day 374
 * and is not. No dashes, no vosotros, Latin American Spanish (Colombia), the
 * preterite as the everyday past.
 * ========================================================================== */
window.SCRIPTS_B2 = {

/* ---- unit b2-u44 · Saying where you stand -------------------------------- */

"fn-acuerdo-b2": {
  source: "merged",
  hook: {
    line: "Your building's group chat is voting on whether to raise the monthly fee to fix the elevator. Five neighbours answer the management, and every reply sits somewhere on a ladder that runs from a full yes to a flat no.",
    es: "Administración: Proponemos subir la cuota para arreglar el ascensor antes de diciembre.\nMarta: Desde luego, cuenta conmigo.\nJorge: En líneas generales estoy de acuerdo, pero no me convence el plazo.\nLuis: No me convence la propuesta.\nAna: A mí tampoco, la verdad.\nPedro: Puede que tengan razón, pero sin ascensor la gente mayor no puede salir.",
    en: "Management: We propose raising the fee to fix the elevator before December.\nMarta: Absolutely, count me in.\nJorge: Broadly speaking I agree, but the deadline doesn't convince me.\nLuis: The proposal doesn't convince me.\nAna: Me neither, honestly.\nPedro: You may be right, but without an elevator older people can't go out."
  },
  examples: [
    { es: "Comparto su punto de vista, aunque me gustaría matizar un aspecto del presupuesto.", en: "I share your point of view, although I'd like to qualify one aspect of the budget." },
    { es: "Tienes toda la razón, debí avisarte antes de cambiar la fecha de la reunión.", en: "You're absolutely right, I should have told you before changing the date of the meeting." },
    { es: "No estoy en absoluto de acuerdo con ese análisis, porque deja por fuera a los inquilinos.", en: "I don't agree with that analysis at all, because it leaves out the tenants." }
  ],
  rule: "Agreeing runs from a nod to a formal statement. Pick the rung that fits the room.\nWith friends: *Pues sí.* *Desde luego.* *Tienes toda la razón.*\nAnywhere: *Estoy completamente de acuerdo.*\nIn a meeting or a letter: *Comparto su punto de vista.* *Coincido plenamente.*\nTo agree in part, say so, then *pero*: *En líneas generales estoy de acuerdo, pero...* *No estoy del todo de acuerdo.*\nTo disagree flatly: *No estoy en absoluto de acuerdo.* Alone, *¡En absoluto!* means not at all, never yes.\nTo give ground before you push back: *Puede que tengas razón, pero...*\nAfter a negative, agree with *tampoco*: *A mí tampoco.*",
  readAndPick: [
    { q: "How much does Jorge agree?", es: "En líneas generales estoy de acuerdo, pero no me convence el plazo.",
      options: ["With all of it", "With most of it", "With none of it"], answer: 1,
      why: "*En líneas generales* agrees broadly, and the *pero* names the part he won't sign off on." },
    { q: "Luis says the proposal doesn't convince him. What does Ana mean?", es: "A mí tampoco, la verdad.",
      options: ["She isn't convinced either", "She is fully convinced now", "She hasn't made up her mind"], answer: 0,
      why: "After a negative, agreeing takes *tampoco*. *A mí también* would say it does convince her." },
    { q: "Where would you say this?", es: "Coincido plenamente con lo expuesto.",
      options: ["To a friend at a party", "Over coffee with your sister", "In the minutes of a meeting"], answer: 2,
      why: "*Coincido plenamente con lo expuesto* is written, formal Spanish. With friends it sounds like a committee." },
    { q: "What does she mean?", es: "¡En absoluto! No pienso firmar eso.",
      options: ["Absolutely, she'll sign it", "No way, she won't sign it", "She might sign it later"], answer: 1,
      why: "*¡En absoluto!* alone means not at all, and *no pienso firmar* is I've no intention of signing." },
    { q: "What is Pedro doing?", es: "Puede que tengan razón, pero sin ascensor la gente mayor no puede salir.",
      options: ["Giving ground, then pushing back", "Agreeing with every word they said", "Changing the subject to the stairs"], answer: 0,
      why: "*Puede que tengan razón* gives ground first; the *pero* brings his own reason." },
    { q: "Who is this aimed at?", es: "Estás muy equivocado si piensas que voy a pagar más.",
      options: ["The idea only", "The other person", "Nobody in particular"], answer: 1,
      why: "*Estás equivocado* tells the person they are wrong. *No estoy de acuerdo* would aim at the idea." }
  ],
  yourTurn: [
    { en: "You're absolutely right. (to a friend)", es: "Tienes toda la razón.", accept: [] },
    { en: "Broadly speaking, I agree, but I have doubts about the deadline.", es: "En líneas generales estoy de acuerdo, pero tengo dudas sobre el plazo.", accept: ["En líneas generales estoy de acuerdo, pero tengo dudas [sobre|acerca de|con] el plazo."] },
    { en: "I don't agree with that analysis at all.", es: "No estoy en absoluto de acuerdo con ese análisis.", accept: ["No estoy de acuerdo en absoluto con ese análisis.", "No estoy para nada de acuerdo con ese análisis."] },
    { en: "I share your point of view. (polite)", es: "Comparto su punto de vista.", accept: [] },
    { en: "It doesn't seem fair to me either.", es: "A mí tampoco me parece justo.", accept: ["Tampoco me parece justo.", "A mí no me parece justo tampoco."] }
  ],
  translate: [
    { en: "You may be right, but we also have to think about the money. (to a friend)", es: "Puede que tengas razón, pero también hay que pensar en la plata.", accept: ["Puede que tengas razón, pero también [hay que|tenemos que] pensar en [la plata|el dinero]."] },
    { en: "I don't doubt that most people are happy, but my experience was terrible.", es: "No dudo que la mayoría de la gente está contenta, pero mi experiencia fue pésima.", accept: ["No dudo (de) que la mayoría de la gente [está|esté] contenta, pero mi experiencia fue [pésima|terrible|horrible]."] },
    { en: "I fully agree with what has been said, although I'd like to qualify one point.", es: "Coincido plenamente con lo expuesto, aunque me gustaría matizar un punto.", accept: ["Coincido [plenamente|totalmente] con lo expuesto, aunque me gustaría matizar un punto."] },
    { en: "Absolutely, count me in. But I don't entirely agree with the deadline; it seems very short to me. (to a friend)", es: "Desde luego, cuenta conmigo. Pero no estoy del todo de acuerdo con el plazo; me parece muy corto.", accept: ["[Desde luego|Por supuesto|Claro que sí], cuenta conmigo. Pero no estoy del todo de acuerdo con el plazo[;|,|.] me parece muy corto."] },
    { en: "No, no, that's not true. They fixed the elevator in March.", es: "No, no, eso no es cierto. Arreglaron el ascensor en marzo.", accept: ["No, no, eso no es [cierto|verdad]. Arreglaron el ascensor en marzo."] },
    { en: "I agree with you that the fee is high, but I don't see another solution. (to a friend)", es: "Estoy de acuerdo contigo en que la cuota es alta, pero no veo otra solución.", accept: [] }
  ],
  register: [
    { es: "Pues sí.", en: "Yeah, true.", when: "with friends, a quick nod in conversation" },
    { es: "Tienes toda la razón.", en: "You're absolutely right.", when: "when you want to credit the person warmly" },
    { es: "Estoy completamente de acuerdo.", en: "I completely agree.", when: "anywhere, said plainly and firmly" },
    { es: "Comparto su punto de vista.", en: "I share your point of view.", when: "at a meeting, or to anyone you call usted" },
    { es: "Coincido plenamente con lo expuesto.", en: "I fully agree with what has been said.", when: "in minutes, a formal email or a written reply" }
  ],
  personal: {
    prompt: "Your building, office or family is deciding something real. Write two replies to the proposal: one that agrees only in part, and one that gives ground before it pushes back.",
    constraints: [
      { type: "containsAny", words: ["en líneas generales", "en parte", "del todo", "con gran parte"], label: "a partial yes: *en líneas generales*, *en parte* or *no del todo*" },
      { type: "containsAny", words: ["puede que tengas razón", "puede que tenga razón", "puede que tengan razón", "no dudo que", "tienes razón", "tiene razón"], label: "ground given, like *puede que tengas razón*" },
      { type: "containsWord", word: "pero", label: "a push back with *pero*" }
    ],
    model: "En líneas generales estoy de acuerdo en subir la cuota, pero el plazo es muy corto. Puede que tengas razón con lo del ascensor, pero primero hay que pedir otra cotización."
  },
  pitfalls: [
    "*A mí también* after a negative reverses you: when someone says *no me convence*, agreeing is *a mí tampoco*.",
    "*Comparto su punto de vista* with a friend sounds like you are addressing a committee. Between friends, *tienes toda la razón*.",
    "*Estás muy equivocado* aims at the person. For a first disagreement at work, aim at the idea: *no estoy de acuerdo con ese punto*."
  ]
},

"fn-dar-opinion-b2": {
  source: "merged",
  hook: {
    line: "Your team lead emails three of you about moving the office from Chapinero to the north of Bogotá, and asks what you think. Two replies come back. Each one tells you how sure the writer is before it gives the view.",
    es: "Asunto: ¿Qué opinan de que nos traslademos al norte?\nHola a todos, ¿cómo lo ven? Quiero su opinión antes del viernes.\nCamilo: Considero que es la mejor opción, porque el arriendo es más barato.\nLaura: Yo diría que es buena idea, pero lo veo difícil para quienes viven en el sur.",
    en: "Subject: What do you think about us moving north?\nHi all, how do you see it? I want your opinion before Friday.\nCamilo: I believe it's the best option, because the rent is cheaper.\nLaura: I'd say it's a good idea, but I think it'll be hard for those who live in the south."
  },
  examples: [
    { es: "A mi modo de ver, el proyecto necesita más tiempo y un equipo un poco más grande.", en: "The way I see it, the project needs more time and a slightly bigger team." },
    { es: "¿Qué te parecería que nos fuéramos a vivir a Medellín el año que viene?", en: "How would you feel about us moving to Medellín next year?" },
    { es: "Nos parece un error que no hayan consultado a los vecinos antes de empezar la obra.", en: "We think it's a mistake that they didn't consult the neighbours before starting the work." }
  ],
  rule: "Before the view itself, Spanish tells the listener how sure you are.\nFirm: *Considero que...* *Opino que...* Personal: *A mi modo de ver,* Careful: *Yo diría que...* Someone else's: *Según los expertos,*\nAfter all of these the next verb stays ordinary: *Considero que es caro.*\nTo judge something already mentioned, put *lo* or *la* first: *Lo veo difícil.* *La encuentro cara.*\nTo judge someone's action: *me parece* or *es* plus a word, then *que* and the subjunctive: *Me parece un error que no consulten.*\nTo ask: *¿Cómo lo ves?* *¿Qué opinas de que cambien el horario?* To float an idea: *¿Qué te parecería que nos fuéramos?*\nHow it went: *¿Qué tal estuvo?* *¿Cómo te fue?*",
  readAndPick: [
    { q: "How sure does Laura sound?", es: "Yo diría que es buena idea.",
      options: ["Completely certain", "Fairly tentative", "Openly against it"], answer: 1,
      why: "*Yo diría que* is the careful frame: a view that invites a reply." },
    { q: "What is *lo* pointing at?", es: "¿El traslado? Lo veo difícil.",
      options: ["The move north", "The new office rent", "The whole team"], answer: 0,
      why: "*Lo* stands for *el traslado*, the thing just mentioned. Without it, *veo difícil* is not Spanish." },
    { q: "Who is changing the schedule?", es: "¿Qué opinas de que cambien el horario?",
      options: ["You are", "They are", "She is"], answer: 1,
      why: "*Cambien* ends in *-n*: they. *De que* plus the subjunctive asks about someone's action." },
    { q: "When is this being asked?", es: "¿Qué tal estuvo la reunión con el cliente?",
      options: ["Before it happens", "While it goes on", "After it is over"], answer: 2,
      why: "*¿Qué tal estuvo?* asks how something already finished went." },
    { q: "What is he proposing?", es: "¿Qué te parecería que nos fuéramos a vivir a Medellín?",
      options: ["They live there already", "A short visit next week", "Moving there together"], answer: 2,
      why: "*¿Qué te parecería que...?* with the *-ra* form floats an idea that has not happened." },
    { q: "What does the speaker think of their not asking?", es: "Me parece un error que no hayan consultado a los vecinos.",
      options: ["A mistake", "A good call", "A small detail"], answer: 0,
      why: "*Me parece un error que* judges their action, so the subjunctive *hayan consultado* follows." }
  ],
  yourTurn: [
    { en: "The way I see it, the solution is obvious.", es: "A mi modo de ver, la solución es evidente.", accept: ["A mi modo de ver, la solución es [evidente|obvia]."] },
    { en: "How do you see it? (to a friend)", es: "¿Cómo lo ves?", accept: ["¿Tú cómo lo ves?"] },
    { en: "What do you think about them raising the rent? (to a friend)", es: "¿Qué opinas de que suban el arriendo?", accept: ["¿Qué [opinas|piensas] de que suban el arriendo?"] },
    { en: "I'd say it's a good idea, but I think it'll be hard.", es: "Yo diría que es buena idea, pero lo veo difícil.", accept: ["Yo diría que es (una) buena idea, pero lo veo difícil."] },
    { en: "It's lucky they gave you that opportunity. (to a friend)", es: "Es una suerte que te hayan dado esa oportunidad.", accept: ["Es una suerte que te [hayan dado|dieran] esa oportunidad."] }
  ],
  translate: [
    { en: "We believe more effective measures should be adopted.", es: "Consideramos que se deberían adoptar medidas más eficaces.", accept: ["Consideramos que [se deberían adoptar|deberían adoptarse] medidas más [eficaces|efectivas]."] },
    { en: "I find it very expensive, honestly.", es: "Lo encuentro muy caro, la verdad.", accept: ["La verdad, lo encuentro muy caro.", "Lo veo muy caro, la verdad."] },
    { en: "How did it go at the interview? (to a friend)", es: "¿Cómo te fue en la entrevista?", accept: ["¿Qué tal te fue en la entrevista?", "¿Qué tal estuvo la entrevista?"] },
    { en: "According to the experts, the vaccine won't be ready this year.", es: "Según los expertos, la vacuna no va a estar lista este año.", accept: ["Según los expertos, la vacuna no [va a estar|estará] lista este año."] },
    { en: "How would you feel about us working from home on Fridays? I think we'd save a lot of time. (to a friend)", es: "¿Qué te parecería que trabajáramos desde la casa los viernes? Creo que ahorraríamos mucho tiempo.", accept: ["¿Qué te parecería que trabajáramos desde (la) casa los viernes? Creo que ahorraríamos mucho tiempo."] },
    { en: "We think it's a mistake that they didn't ask the tenants first.", es: "Nos parece un error que no les hayan preguntado primero a los inquilinos.", accept: ["Nos parece un error que no les [hayan preguntado|preguntaran] primero a los inquilinos.", "Nos parece un error que no les [hayan preguntado|preguntaran] a los inquilinos primero."] }
  ],
  register: [
    { es: "Para mí que es caro.", en: "If you ask me, it's expensive.", when: "with friends, casual and quick" },
    { es: "Yo diría que es caro.", en: "I'd say it's expensive.", when: "when you want to leave room for a reply" },
    { es: "A mi modo de ver, es caro.", en: "The way I see it, it's expensive.", when: "in a meeting, to mark it as your view" },
    { es: "Considero que el precio es excesivo.", en: "I believe the price is excessive.", when: "in a formal email or a report" }
  ],
  personal: {
    prompt: "Something is changing near you: a rule at work, a price, a plan in your building. Ask a friend what they think of it, then give your own view with a frame that shows how sure you are.",
    constraints: [
      { type: "regex", pattern: "¿\\s*qu[eé] (opinas|piensas|te parece|te parecería)", label: "a question: *¿qué opinas de que...?* or *¿qué te parece...?*" },
      { type: "containsAny", words: ["considero que", "a mi modo de ver", "yo diría que", "desde mi punto de vista", "lo veo", "la veo"], label: "your view, with *considero que*, *yo diría que* or *lo veo*" }
    ],
    model: "¿Qué opinas de que suban el arriendo de la oficina? Yo diría que es demasiado, y lo veo difícil para el equipo."
  },
  pitfalls: [
    "*Yo diría que* undersells a strong case: open a firm argument with *considero que* instead.",
    "*Lo veo difícil* needs something already on the table for *lo* to point at.",
    "*¿Qué opinas de que cambian el horario?* is the slip: asking about their action takes *cambien*."
  ]
},

"dc-atenuacion-b2": {
  source: "merged",
  hook: {
    line: "Your neighbour's dog barks every night until two, and you have to write to her. You want it to stop without starting a war on the stairs. Look at how much of the message is wrapping.",
    es: "Hola, Patricia, ¿cómo estás? Perdona que te moleste.\nQuería comentarte algo, a ver si me puedes ayudar.\nEs que uno trabaja temprano y, si el perro ladra hasta las dos, no hay quien duerma.\n¿Será que lo podemos hablar esta semana?",
    en: "Hi, Patricia, how are you? Sorry to bother you.\nI wanted to mention something, to see if you can help me.\nIt's that one works early and, if the dog barks until two, nobody can sleep.\nCould we possibly talk about it this week?"
  },
  examples: [
    { es: "En esa clínica llegas a las siete y te toca esperar tres horas antes de ver al médico.", en: "At that clinic you get there at seven and have to wait three hours before you see the doctor." },
    { es: "Le agradecería que no volviera a dejar la bicicleta en el pasillo del edificio.", en: "I'd be grateful if you didn't leave the bike in the building's hallway again." },
    { es: "Es posible que esté equivocada, pero yo lo veo de otra manera, la verdad.", en: "I may be wrong, but I see it another way, honestly." }
  ],
  rule: "Softening changes who seems to be speaking, or when.\nMake it anyone's experience: *Llegas y te toca esperar.* *Uno hace lo que puede*, and *uno* takes *le*: *todo le molesta*. The complaint is about the world, not about you.\nStep back in time: *Quería pedirte algo* is gentler than *quiero*. *Deberías descansar* is advice, not an order.\nTurn an order into thanks: *Le agradecería que no volviera a llegar tarde.*\nAnnounce it first: *¿Puedo hacerte una pregunta?* *Perdona que te moleste.*\nAdmit you might be wrong: *Es posible que esté equivocado, pero...*\nIn Colombia, *¿Será que...?* softens any question: *¿Será que me puede ayudar?*",
  readAndPick: [
    { q: "Who really waited three hours?", es: "En esa clínica llegas y te toca esperar tres horas.",
      options: ["The listener did", "The speaker did", "Nobody really"], answer: 1,
      why: "The *tú* is anyone, but the complaint is the speaker's own. It just sounds less personal." },
    { q: "What does *uno* mean here?", es: "Uno hace lo que puede con lo que tiene.",
      options: ["The number one", "Anyone, me included", "Just one other person"], answer: 1,
      why: "*Uno* turns your own case into anyone's, so nobody can say you are complaining." },
    { q: "Why *quería* and not *quiero*?", es: "Quería pedirte un favor.",
      options: ["He no longer wants it", "It happened before", "It sounds gentler"], answer: 2,
      why: "The step back in time softens the request. He still wants the favour now." },
    { q: "What is she really asking?", es: "Le agradecería que no volviera a llegar tarde.",
      options: ["Not to be late again", "To thank her later on", "To come back tomorrow"], answer: 0,
      why: "*Le agradecería que* wraps an order in thanks given in advance. It is still an order." },
    { q: "Who is most likely speaking?", es: "¿Ya nos tomamos la pastilla, don Jorge?",
      options: ["Two friends at a bar", "A boss to a new hire", "A nurse to a patient"], answer: 2,
      why: "This *nosotros* includes the speaker to sound kind. Only the patient takes the pill." }
  ],
  yourTurn: [
    { en: "I wanted to ask you a favour. (to a friend)", es: "Quería pedirte un favor.", accept: ["Te quería pedir un favor."] },
    { en: "Could you possibly help me? (polite)", es: "¿Será que me puede ayudar?", accept: ["¿Será que (usted) me puede ayudar?", "¿Será que puede ayudarme?"] },
    { en: "One does what one can.", es: "Uno hace lo que puede.", accept: [] },
    { en: "I'd be grateful if you didn't arrive late again. (polite)", es: "Le agradecería que no volviera a llegar tarde.", accept: [] },
    { en: "I may be wrong, but I see it another way. (a man speaking)", es: "Es posible que esté equivocado, pero yo lo veo de otra manera.", accept: ["[Es posible que|Puede que] esté equivocado, pero (yo) lo veo de otra [manera|forma]."] }
  ],
  translate: [
    { en: "You work all day and in the end the money isn't enough.", es: "Trabajas todo el día y al final no te alcanza la plata.", accept: ["Trabajas todo el día y al final no te alcanza [la plata|el dinero]."] },
    { en: "When you're tired, everything bothers you.", es: "Cuando uno está cansado, todo le molesta.", accept: ["Cuando estás cansado, todo te molesta."] },
    { en: "Sorry to bother you, I wanted to ask you something quickly. (to a friend)", es: "Perdona que te moleste, quería preguntarte algo rápido.", accept: ["[Perdona|Disculpa] que te moleste, quería preguntarte algo rápido.", "[Perdona|Disculpa] que te moleste, te quería preguntar algo rápido."] },
    { en: "You should be a bit more careful with money. (to a friend)", es: "Deberías ser un poco más cuidadoso con la plata.", accept: ["Deberías ser un poco más [cuidadoso|cuidadosa|prudente] con [la plata|el dinero]."] },
    { en: "They say they're going to raise the rent. I may be wrong, but I'd look for another apartment.", es: "Dicen que van a subir el arriendo. Puede que me equivoque, pero yo buscaría otro apartamento.", accept: ["Dicen que van a subir el arriendo. [Puede que me equivoque|Es posible que me equivoque|Puede que esté equivocado|Puede que esté equivocada], pero (yo) buscaría otro apartamento."] },
    { en: "Can I give you a piece of advice? I think you should rest more. (to a friend)", es: "¿Me aceptas un consejo? Creo que deberías descansar más.", accept: ["¿Te puedo dar un consejo? Creo que deberías descansar más.", "¿Puedo darte un consejo? Creo que deberías descansar más."] }
  ],
  register: [
    { es: "¿Me ayudas con esto?", en: "Will you help me with this?", when: "with a friend, no wrapping needed" },
    { es: "Quería pedirte un favor.", en: "I wanted to ask you a favour.", when: "with a friend, when the favour is big" },
    { es: "¿Será que me puede ayudar?", en: "Could you possibly help me?", when: "in Colombia, to a stranger or someone older" },
    { es: "Le agradecería que me ayudara con esto.", en: "I'd be grateful if you helped me with this.", when: "in a formal email, to someone senior" }
  ],
  personal: {
    prompt: "Write the opening of a message to a neighbour or a colleague about something that bothers you. Wrap it: announce it first, step back with *quería*, and turn the complaint into anyone's.",
    constraints: [
      { type: "containsAny", words: ["perdona que", "disculpa que", "perdone que", "disculpe que", "puedo hacerte", "puedo preguntarte", "me aceptas"], label: "an announcement first, like *perdona que te moleste*" },
      { type: "containsAny", words: ["quería", "queríamos"], label: "a step back: *quería* instead of *quiero*" },
      { type: "regex", pattern: "\\buno\\b|\\bte toca\\b|\\bse dice\\b|\\bdicen que\\b", label: "the complaint made general: *uno*, *te toca* or *dicen que*" }
    ],
    model: "Perdona que te moleste, Andrés. Quería comentarte algo: en este edificio uno llega cansado y la música no deja dormir."
  },
  pitfalls: [
    "*Uno hace lo que puedo* is the slip: *uno* takes the *él* form, so *puede*, and *le*, not *te*.",
    "*¿Puedo hacerte una pregunta?* is not a real question: nobody expects a no. It warns that something delicate is coming."
  ]
},

"fn-expresar-certeza-b2": {
  source: "merged",
  hook: {
    line: "A rumour runs through your office chat: everyone is getting a raise in January. Some colleagues are sure, one has doubts, and one is openly unconvinced. Each line shows how sure the writer is.",
    es: "Diana: Me dijeron que nos van a subir el sueldo en enero.\nFelipe: Estoy absolutamente seguro de que es verdad, lo dijo la gerente.\nSara: Yo tengo mis dudas. No estoy del todo segura de que lo aprueben.\nAndrés: Ya. A mí me dijeron lo mismo el año pasado.\nDiana: ¿Cómo puedes estar tan seguro, Felipe?",
    en: "Diana: They told me they're going to raise our salary in January.\nFelipe: I'm absolutely sure it's true, the manager said so.\nSara: I have my doubts. I'm not entirely sure they'll approve it.\nAndrés: Right. They told me the same thing last year.\nDiana: How can you be so sure, Felipe?"
  },
  examples: [
    { es: "Estoy totalmente segura de haber cerrado la puerta con llave antes de salir de la casa.", en: "I'm completely sure I locked the door before leaving the house." },
    { es: "Tengo la impresión de que la reunión de mañana va a ser más tensa de lo normal.", en: "I have the feeling that tomorrow's meeting is going to be tenser than usual." },
    { es: "No estoy del todo seguro de que oyeran el timbre, porque nadie salió a abrir.", en: "I'm not entirely sure they heard the doorbell, because nobody came to the door." }
  ],
  rule: "Turn certainty up with *absolutamente*, *totalmente* or *firmemente*: *Estoy absolutamente seguro de que es verdad.* *No me cabe duda de que...* *Sin duda alguna.*\nWhen the sure person did it: *Estoy segura de haber cerrado la puerta.*\nSure of an answer: *Estoy seguro de quién fue.*\nSure keeps the ordinary verb. Not sure takes the subjunctive, past included: *No estoy del todo seguro de que oyeran el timbre.*\nA hunch with no proof: *Tengo la impresión de que...* Doubt about one thing: *Tengo mis dudas sobre el plazo.*\nDoubt without a fight: *Si tú lo dices.* *Yo no lo veo tan claro.* A flat *Ya.*\nTo challenge: *¿Cómo puedes estar tan seguro?*",
  readAndPick: [
    { q: "Does Andrés believe the rumour?", es: "Ya. A mí me dijeron lo mismo el año pasado.",
      options: ["Yes, completely", "Not really", "He spread it"], answer: 1,
      why: "A bare *Ya* and a deflating line: he heard the claim and does not buy it." },
    { q: "Who did the locking?", es: "Estoy segura de haber cerrado la puerta con llave.",
      options: ["She did, herself", "Someone else did", "Nobody, it's open"], answer: 0,
      why: "*Segura de haber cerrado*: the same person is sure and acted, so no *que*, just *haber cerrado*." },
    { q: "What are they sure about?", es: "Estamos seguros de quién fue.",
      options: ["When it was", "Why it happened", "Who it was"], answer: 2,
      why: "*Seguros de quién* is sure of an answer: they know who it was." },
    { q: "Is there any evidence behind this?", es: "Tengo la impresión de que no va a venir.",
      options: ["Yes, solid proof", "None, just a hunch", "A message from him"], answer: 1,
      why: "*Tengo la impresión de que* disclaims proof: it is a hunch." },
    { q: "Is she agreeing with him?", es: "Si tú lo dices.",
      options: ["Yes, fully", "She's asking", "Not really"], answer: 2,
      why: "*Si tú lo dices* hands the claim back without signing it. It is doubt, kept polite." },
    { q: "Why *oyeran* and not *oyeron*?", es: "No estoy del todo seguro de que oyeran el timbre.",
      options: ["He isn't sure it happened", "It happened very long ago", "Many people heard it"], answer: 0,
      why: "Not sure holds the idea up, so the past takes the subjunctive: *oyeran*." }
  ],
  yourTurn: [
    { en: "I'm absolutely sure it's true. (a woman speaking)", es: "Estoy absolutamente segura de que es verdad.", accept: ["Estoy [absolutamente|totalmente|completamente] segura de que es [verdad|cierto]."] },
    { en: "I have my doubts about the result.", es: "Tengo mis dudas sobre el resultado.", accept: ["Tengo mis dudas [sobre|acerca de|con] el resultado."] },
    { en: "If you say so. (to a friend)", es: "Si tú lo dices.", accept: [] },
    { en: "How can you be so sure? (to a friend)", es: "¿Cómo puedes estar tan seguro?", accept: ["¿Cómo puedes estar tan [seguro|segura]?"] },
    { en: "I'm not entirely sure they heard the doorbell. (a man speaking)", es: "No estoy del todo seguro de que oyeran el timbre.", accept: ["No estoy del todo seguro de que [oyeran|hayan oído] el timbre."] }
  ],
  translate: [
    { en: "I'm completely sure I've been here before. (a man speaking)", es: "Estoy segurísimo de haber estado aquí antes.", accept: ["Estoy [segurísimo|completamente seguro|totalmente seguro] de haber estado aquí antes."] },
    { en: "I have no doubt at all that she's telling the truth.", es: "No me cabe duda de que dice la verdad.", accept: ["No me cabe (ninguna) duda de que (ella) dice la verdad.", "No tengo ninguna duda de que (ella) dice la verdad."] },
    { en: "Without a doubt, it's the best option we have.", es: "Sin duda alguna, es la mejor opción que tenemos.", accept: ["Sin [duda alguna|ninguna duda|duda], es la mejor opción que tenemos."] },
    { en: "Well, I don't see it so clearly.", es: "Bueno, yo no lo veo tan claro.", accept: ["Bueno, no lo veo tan claro."] },
    { en: "You seriously told him without warning me? How can you say it was my fault? (to a friend)", es: "¿En serio se lo dijiste sin avisarme? ¿Cómo puedes decir que fue culpa mía?", accept: ["¿[En serio|De verdad] se lo dijiste sin avisarme? ¿Cómo puedes decir que fue [culpa mía|mi culpa]?"] },
    { en: "We're not entirely convinced he's the ideal candidate.", es: "No estamos del todo convencidos de que sea el candidato ideal.", accept: [] }
  ],
  register: [
    { es: "Seguro que sí.", en: "I bet it is.", when: "with friends, a casual bet" },
    { es: "Estoy segurísimo.", en: "I'm absolutely sure.", when: "in conversation, when you would bet on it" },
    { es: "No me cabe duda.", en: "I have no doubt at all.", when: "anywhere, firm but calm" },
    { es: "Estamos firmemente convencidos de que funcionará.", en: "We are firmly convinced it will work.", when: "in a formal statement, after doubts were raised" },
    { es: "Si tú lo dices.", en: "If you say so.", when: "with friends, when you doubt it but avoid a fight" }
  ],
  personal: {
    prompt: "Think of a rumour or a plan you have heard about at work, at school or at home. Write one thing you are sure of and one you are not, and say how sure you are each time.",
    constraints: [
      { type: "containsAny", words: ["absolutamente segur", "totalmente segur", "segurísim", "no me cabe duda", "sin duda", "convencid"], label: "certainty turned up: *absolutamente seguro*, *no me cabe duda* or *sin duda*" },
      { type: "subjunctiveAfter", trigger: "no estoy", within: 7, label: "a doubt: *no estoy del todo seguro de que* and the subjunctive" }
    ],
    model: "No me cabe duda de que van a cambiar el horario. Pero no estoy del todo segura de que nos paguen más."
  },
  pitfalls: [
    "*Estoy seguro de que haya cerrado* is the slip: when you did it yourself, say *estoy seguro de haber cerrado*.",
    "*Si tú lo dices* is not a yes. Taking it as agreement misreads the tone.",
    "*Firmemente convencido* says the belief survived a challenge; for an everyday fact it overstates."
  ]
},

"nt-certeza-b2": {
  source: "merged",
  hook: {
    line: "Fog closes El Dorado airport in Bogotá on a Monday morning. The short news item about it never says yes or no: it names how certain each thing is, with words like *certeza* and *incertidumbre* as much as with verbs.",
    es: "Por la niebla, existe la posibilidad de que se cancelen algunos vuelos esta mañana.\nLa aerolínea no tiene certeza sobre la hora de salida.\nHay incertidumbre, pero los pasajeros están convencidos de que van a viajar hoy.",
    en: "Because of the fog, there's a possibility that some flights will be cancelled this morning.\nThe airline has no certainty about the departure time.\nThere's uncertainty, but the passengers are convinced they're going to travel today."
  },
  examples: [
    { es: "No tengo ninguna duda sobre su honestidad, aunque a veces llega tarde a las reuniones.", en: "I have no doubt at all about his honesty, although sometimes he's late for meetings." },
    { es: "El testigo respondió sin dudar, y eso convenció al juez de que decía la verdad.", en: "The witness answered without hesitating, and that convinced the judge he was telling the truth." },
    { es: "De pronto llegamos tarde, porque a esta hora siempre hay trancón en la Séptima.", en: "We might be late, because at this time there's always a traffic jam on Seventh Avenue." }
  ],
  rule: "The words for it: *la certeza* (certainty), *la duda*, *la incertidumbre* (uncertainty), *la posibilidad*, *la probabilidad*.\n*No tengo ninguna duda sobre...* a thing, or *de que...* a fact.\n*Existe la posibilidad de que* and *es dudoso que* take the subjunctive: *Existe la posibilidad de que cancelen el vuelo.*\n*Estar convencido de* takes a thing (*de su talento*), the dictionary form (*de ganar*) or *que* (*de que dice la verdad*).\n*Sin duda* says a fact is certain: *Fue él, sin duda.* *Sin dudar* says how someone acted: *Respondió sin dudar.*\nCasual maybe, with the ordinary verb: in Colombia *de pronto*, elsewhere also *igual*: *De pronto llueve.*",
  readAndPick: [
    { q: "What does the airline lack?", es: "La aerolínea no tiene certeza sobre la hora de salida.",
      options: ["Planes", "Certainty", "Passengers"], answer: 1,
      why: "*Certeza* is certainty: they do not know the time yet." },
    { q: "How did the witness answer?", es: "El testigo respondió sin dudar ni un segundo.",
      options: ["After a long pause", "Full of doubts", "Without hesitating"], answer: 2,
      why: "*Sin dudar* describes how he acted. *Sin duda* would claim a fact is certain." },
    { q: "What does *de pronto* mean here?", es: "De pronto no viene, está muy ocupada.",
      options: ["Maybe she won't come", "She suddenly stopped coming", "She came right away"], answer: 0,
      why: "With a present verb, *de pronto* is maybe. Suddenly needs a past: *de pronto se fue*." },
    { q: "Is the flight cancelled?", es: "Existe la posibilidad de que cancelen el vuelo.",
      options: ["It might be", "Yes, it already is", "No, never"], answer: 0,
      why: "*Existe la posibilidad de que* holds it up as possible, so the subjunctive *cancelen*." },
    { q: "What is she convinced of?", es: "Está convencida de ganar el concurso.",
      options: ["That her friend will win", "That she will win it", "That it is a fair contest"], answer: 1,
      why: "*Convencida de ganar*: the dictionary form means the same person is convinced and wins." }
  ],
  yourTurn: [
    { en: "There's a possibility that they'll cancel the flight.", es: "Existe la posibilidad de que cancelen el vuelo.", accept: ["Hay (una) posibilidad de que cancelen el vuelo."] },
    { en: "It was him, no doubt.", es: "Fue él, sin duda.", accept: ["Sin duda, fue él.", "Fue él, sin (ninguna) duda."] },
    { en: "I'm convinced he's telling the truth. (a woman speaking)", es: "Estoy convencida de que dice la verdad.", accept: ["Estoy convencida de que (él) dice la verdad."] },
    { en: "Maybe it'll rain later.", es: "De pronto llueve más tarde.", accept: ["[De pronto|Igual|A lo mejor] llueve más tarde.", "[Tal vez|Quizás|Quizá] llueva más tarde."] }
  ],
  translate: [
    { en: "I have no doubt at all about his honesty.", es: "No tengo ninguna duda sobre su honestidad.", accept: ["No tengo ninguna duda [sobre|de] su honestidad."] },
    { en: "She's absolutely convinced of her talent.", es: "Está absolutamente convencida de su talento.", accept: [] },
    { en: "The witness answered without hesitating.", es: "El testigo respondió sin dudar.", accept: ["El testigo respondió sin dudar(lo)."] },
    { en: "It's doubtful that the plan works for everyone.", es: "Es dudoso que el plan funcione para todos.", accept: [] },
    { en: "There's a lot of uncertainty about the flight. Maybe it leaves at noon, but nobody knows for sure.", es: "Hay mucha incertidumbre sobre el vuelo. De pronto sale a mediodía, pero nadie lo sabe con certeza.", accept: ["Hay mucha incertidumbre [sobre|con] el vuelo. [De pronto|A lo mejor|Igual] sale [a mediodía|al mediodía], pero nadie (lo) sabe con [certeza|seguridad]."] },
    { en: "We're convinced we're going to win.", es: "Estamos convencidos de que vamos a ganar.", accept: ["Estamos convencidos de [que vamos a ganar|ganar]."] }
  ],
  register: [
    { es: "De pronto llueve.", en: "Maybe it'll rain.", when: "in Colombia, in everyday talk" },
    { es: "Es probable que llueva.", en: "It's likely to rain.", when: "anywhere, when the odds are good" },
    { es: "Existe la posibilidad de que llueva.", en: "There's a possibility it will rain.", when: "in the news, a report or a formal email" },
    { es: "No hay ninguna duda: va a llover.", en: "There's no doubt at all: it's going to rain.", when: "when you would bet on it" }
  ],
  personal: {
    prompt: "Think of something in your week that is uncertain, like a trip, a result or the weather. Write about it with one of the words for certainty, and say one thing you are convinced of.",
    constraints: [
      { type: "containsAny", words: ["certeza", "duda", "incertidumbre", "posibilidad", "probabilidad", "dudoso"], label: "a word for how certain it is: *certeza*, *duda*, *incertidumbre* or *posibilidad*" },
      { type: "containsAny", words: ["convencido de", "convencida de", "convencidos de", "convencidas de"], label: "*convencido de* or *convencida de*" }
    ],
    model: "Hay mucha incertidumbre con el viaje a Cartagena, pero estoy convencida de que vamos a ir en diciembre."
  },
  pitfalls: [
    "*Sin duda* and *sin dudar* look alike: one says a fact is certain, the other says someone did not hesitate.",
    "*Igual* as maybe is casual and keeps the ordinary verb; in *me da igual* it means it's all the same.",
    "*De pronto se fue* is suddenly he left: with a past verb, *de pronto* is not maybe."
  ]
},

"fn-aprobacion-desaprobacion-b2": {
  source: "merged",
  hook: {
    line: "Your brother quit his job by text message the night before payday, and your mother forwards you his message. You love him, and you are going to tell him what you think of it, with the past built into the verb.",
    es: "Juan, me pareció muy mal que renunciaras por mensaje.\nNo deberías haberlo hecho sin hablar con nadie.\nPodrías haberme avisado, yo te habría ayudado.\n¿A qué esperas para llamar a tu jefe y pedirle disculpas?",
    en: "Juan, I thought it was really wrong that you quit by text.\nYou shouldn't have done it without talking to anyone.\nYou could have told me, I would have helped you.\nWhat are you waiting for to call your boss and apologize?"
  },
  examples: [
    { es: "Nos pareció pésimo que te fueras de la fiesta así, sin despedirte de nadie.", en: "We thought it was terrible that you left the party like that, without saying goodbye to anyone." },
    { es: "¡Qué bien que por fin te hayan ascendido! Te lo merecías después de tanto trabajo.", en: "How great that they've finally promoted you! You deserved it after so much work." },
    { es: "No entiendo cómo pudiste firmar ese contrato sin leerlo, después de todo lo que hablamos.", en: "I don't understand how you could sign that contract without reading it, after everything we talked about." }
  ],
  rule: "To judge an action that is over: *me pareció* plus a judgement, then *que* and the *-ra* form: *Me pareció muy mal que renunciaras.* *Nos pareció genial que vinieras.*\nReact in the moment: *¡Qué bien que te hayan ascendido!* *¡Qué pena que no fueras!*\nTo reproach what is done, add *haber* and the *-ado* form: *No deberías haberlo hecho.* *Podrías haberme avisado.* *Tendrías que haber llamado.* Without *haber*, it is advice for later: *No deberías hacerlo.*\n*No debiste hacerlo* says the same, and is very common in Latin America.\nTwo sharper ways: *No entiendo cómo pudiste...*, and the question that is really a reproach: *¿A qué esperas para llamarla?*",
  readAndPick: [
    { q: "Is she giving advice or a reproach?", es: "No deberías haberlo hecho.",
      options: ["Advice for later", "A reproach", "A compliment"], answer: 1,
      why: "*Haberlo hecho* points at something already done, so it is a reproach, not advice." },
    { q: "When did he leave?", es: "Me pareció muy mal que te fueras así.",
      options: ["He has already left", "He's leaving tonight", "He won't ever leave"], answer: 0,
      why: "*Me pareció* judges something over, and *fueras* follows: he left." },
    { q: "What is the speaker really saying?", es: "¿A qué esperas para pedirle disculpas?",
      options: ["How long will you wait?", "You should apologize now", "Please wait a bit longer"], answer: 1,
      why: "It is not a real question: the reproach is that the apology is overdue." },
    { q: "What does she think of the news?", es: "¡Qué bien que te hayan ascendido!",
      options: ["She's delighted", "She's quite worried", "She's a bit annoyed"], answer: 0,
      why: "*¡Qué bien que!* is approval on the spot, with the subjunctive after it." },
    { q: "Could he still let her know?", es: "Podrías haberme avisado.",
      options: ["Yes, still in time", "Only if she calls", "No, it is too late"], answer: 2,
      why: "*Haberme avisado* is about a chance already gone: you could have, and didn't." }
  ],
  yourTurn: [
    { en: "You shouldn't have done it. (to a friend)", es: "No deberías haberlo hecho.", accept: ["No debiste hacerlo.", "No tendrías que haberlo hecho."] },
    { en: "You could have told me. (to a friend)", es: "Podrías haberme avisado.", accept: ["Podrías haberme [avisado|dicho].", "Me podrías haber [avisado|dicho]."] },
    { en: "I thought it was really wrong that you left like that. (to a friend)", es: "Me pareció muy mal que te fueras así.", accept: [] },
    { en: "How great that they've finally promoted you! (to a friend)", es: "¡Qué bien que por fin te hayan ascendido!", accept: ["¡Qué bien que te hayan ascendido por fin!"] },
    { en: "What are you waiting for to apologize? (to a friend)", es: "¿A qué esperas para pedir disculpas?", accept: ["¿A qué esperas para [disculparte|pedir perdón]?"] }
  ],
  translate: [
    { en: "You should have called earlier. (to a friend)", es: "Tendrías que haber llamado antes.", accept: ["[Deberías|Tendrías que] haber llamado antes.", "Debiste llamar antes."] },
    { en: "We thought it was terrible that they didn't let us know.", es: "Nos pareció pésimo que no nos avisaran.", accept: ["Nos pareció [pésimo|terrible|fatal] que no nos [avisaran|hayan avisado]."] },
    { en: "I don't understand how you could do something like that. (to a friend)", es: "No entiendo cómo pudiste hacer algo así.", accept: [] },
    { en: "You all could have waited a bit.", es: "Podrían haber esperado un poco.", accept: ["Podrían haber esperado un poquito."] },
    { en: "It's very good that you told her the truth. You shouldn't have waited so long, but you did the right thing. (to a friend)", es: "Está muy bien que le hayas dicho la verdad. No deberías haber esperado tanto, pero hiciste lo correcto.", accept: ["Está muy bien que le [hayas dicho|dijeras] la verdad. No [deberías haber esperado|debiste esperar] tanto, pero hiciste lo correcto."] },
    { en: "You should have bought less milk; it's going to go bad.", es: "Deberías haber comprado menos leche; se va a dañar.", accept: ["[Deberías haber comprado|Debiste comprar] menos leche[;|,] se va a dañar."] }
  ],
  register: [
    { es: "¡Qué mal!", en: "That's awful!", when: "with friends, reacting to news on the spot" },
    { es: "No debiste hacerlo.", en: "You shouldn't have done it.", when: "with family or friends, direct and common" },
    { es: "No deberías haberlo hecho.", en: "You shouldn't have done it.", when: "anywhere, a calmer and gentler reproach" },
    { es: "Me pareció muy mal que no me avisaras.", en: "I thought it was really wrong that you didn't tell me.", when: "when you want to name exactly what hurt" },
    { es: "Nos sorprendió que no nos consultaran.", en: "We were surprised that they didn't consult us.", when: "at work, a formal and measured complaint" }
  ],
  personal: {
    prompt: "Think of something a friend or relative did recently, good or bad. Tell them how it struck you, then say what they should or could have done.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "pareció", within: 6, label: "how it struck you: *me pareció... que* and the *-ra* form" },
      { type: "regex", pattern: "(deber[ií]as|podr[ií]as|tendr[ií]as que) haber", label: "a reproach: *deberías haber*, *podrías haber* or *tendrías que haber*" }
    ],
    model: "Me pareció muy mal que no vinieras al cumpleaños de mi mamá. Podrías haberme avisado por lo menos."
  },
  pitfalls: [
    "*No deberías hacerlo* about something already done is the slip: the reproach needs *haberlo hecho*.",
    "*Me pareció mal que renunciaste* keeps the plain past: a judgement takes the subjunctive, *renunciaras*.",
    "*¿A qué esperas para...?* is not a real question; answering it literally misses the point."
  ]
},

"nt-adecuacion-b2": {
  source: "merged",
  hook: {
    line: "You start a new job at a bank branch in Medellín, and the first email from human resources is about fitting in: the first month, the clothes, what is and is not appropriate. Each of the words has its own small partner word.",
    es: "Le damos la bienvenida a la sucursal. El primer mes es un periodo de adaptación, así que no se preocupe.\nLe recomendamos ropa formal, apropiada para atender al público.\nLos jeans no son adecuados entre semana, pero los viernes sí.\nPronto se va a acostumbrar al horario.",
    en: "We welcome you to the branch. The first month is an adjustment period, so don't worry.\nWe recommend formal clothes, appropriate for dealing with the public.\nJeans aren't suitable on weekdays, but on Fridays they are.\nYou'll soon get used to the schedule."
  },
  examples: [
    { es: "Le costó adaptarse al nuevo horario, porque antes trabajaba de noche y dormía de día.", en: "He found it hard to adjust to the new schedule, because before he worked at night and slept during the day." },
    { es: "Ese comentario estuvo fuera de lugar, sobre todo delante de los clientes y del gerente.", en: "That comment was out of place, especially in front of the customers and the manager." },
    { es: "Es importante elegir un tono apropiado según la situación, y más en un correo formal.", en: "It's important to choose an appropriate tone for the situation, and even more so in a formal email." }
  ],
  rule: "Fitting in is a process: *adaptarse a* or *acostumbrarse a*, always with *me, te, se* and always with *a*: *Me adapté al horario.* *Todavía no me acostumbro al frío.* The process itself: *un periodo de adaptación*.\nWhether something suits the moment: *apropiado para* or *adecuado para*: *ropa apropiada para la entrevista*, *un lugar adecuado para niños*. They agree with the thing, and *in-* flips them: *inapropiado*. They judge the fit, not the quality.\nSomething that crossed a line *está fuera de lugar*.\n*Conveniente* is advisable: *No es conveniente firmar sin leer.*",
  readAndPick: [
    { q: "Is anything wrong with the T-shirt itself?", es: "Una camiseta no es apropiada para la entrevista.",
      options: ["Yes, it is old and torn", "No, wrong occasion", "Yes, it is the wrong size"], answer: 1,
      why: "*Apropiado* judges the fit to the moment, not quality: the shirt is fine elsewhere." },
    { q: "What is she still not used to?", es: "Todavía no me acostumbro al frío de Bogotá.",
      options: ["The cold", "The traffic", "The food"], answer: 0,
      why: "*Acostumbrarse a* plus *el frío*: the *a* and *el* join into *al*." },
    { q: "What happens in the first month?", es: "El primer mes es un periodo de adaptación.",
      options: ["You get fired", "You settle in", "You go on holiday"], answer: 1,
      why: "*Un periodo de adaptación* is the stretch while you settle in." },
    { q: "What does *conveniente* mean here?", es: "No es conveniente firmar sin leer el contrato.",
      options: ["Comfortable", "Cheap", "Advisable"], answer: 2,
      why: "*Conveniente* is advisable. For convenient in the sense of handy, say *práctico* or *cómodo*." },
    { q: "How did the comment go down?", es: "Ese comentario estuvo fuera de lugar.",
      options: ["It crossed a line", "It was really funny", "It came far too late"], answer: 0,
      why: "*Fuera de lugar* says it did not belong there: it crossed a line." }
  ],
  yourTurn: [
    { en: "I got used to the food.", es: "Me acostumbré a la comida.", accept: ["Ya me acostumbré a la comida.", "Me adapté a la comida."] },
    { en: "A T-shirt isn't appropriate for the interview.", es: "Una camiseta no es apropiada para la entrevista.", accept: ["Una camiseta no es [apropiada|adecuada] para la entrevista."] },
    { en: "This place isn't suitable for children.", es: "Este lugar no es adecuado para niños.", accept: ["Este lugar no es [adecuado|apropiado] para (los) niños."] },
    { en: "That comment was out of place.", es: "Ese comentario estuvo fuera de lugar.", accept: [] }
  ],
  translate: [
    { en: "She adapted quickly to life in the city.", es: "Se adaptó rápido a la vida en la ciudad.", accept: ["Se [adaptó|acostumbró] [rápido|rápidamente] a la vida en la ciudad."] },
    { en: "I still haven't got used to the noise in the street.", es: "Todavía no me acostumbro al ruido de la calle.", accept: ["Todavía no me [acostumbro|he acostumbrado] al ruido de la calle."] },
    { en: "That tone isn't appropriate for a formal letter.", es: "Ese tono no es apropiado para una carta formal.", accept: ["Ese tono no es [apropiado|adecuado] para una carta formal."] },
    { en: "It isn't advisable to sign without reading the contract.", es: "No es conveniente firmar sin leer el contrato.", accept: [] },
    { en: "After a short adjustment period, she began to feel comfortable. Now she wouldn't change jobs.", es: "Después de un breve periodo de adaptación, empezó a sentirse cómoda. Ahora no cambiaría de trabajo.", accept: ["[Después de|Tras] un [breve periodo|periodo corto|breve período|período corto] de adaptación, empezó a sentirse cómoda. Ahora no cambiaría de trabajo."] },
    { en: "Calling at eleven at night isn't appropriate.", es: "Llamar a las once de la noche no es apropiado.", accept: ["Llamar a las once de la noche no es [apropiado|adecuado]."] }
  ],
  register: [
    { es: "Eso no va con la ocasión.", en: "That doesn't go with the occasion.", when: "in everyday talk, about clothes or a tone" },
    { es: "No me parece apropiado.", en: "I don't think it's appropriate.", when: "anywhere, a calm objection" },
    { es: "Ese comentario estuvo fuera de lugar.", en: "That comment was out of place.", when: "when someone crossed a line, said firmly" },
    { es: "No es adecuado para este contexto.", en: "It isn't suitable for this context.", when: "in a report or a formal email" }
  ],
  personal: {
    prompt: "Think of a place you moved to, a new job or a new routine. Write one thing you got used to, or haven't yet, and one thing that is not appropriate there.",
    constraints: [
      { type: "regex", pattern: "(acostumbr|adapt)[a-záéíóú]* a", label: "getting used to it: *me acostumbré a* or *me adapté a*" },
      { type: "containsAny", words: ["apropiad", "adecuad", "fuera de lugar", "inapropiad"], label: "what fits or doesn't: *apropiado*, *adecuado* or *fuera de lugar*" }
    ],
    model: "Ya me acostumbré al calor de Barranquilla, pero el saco y la corbata no son apropiados para el clima de allá."
  },
  pitfalls: [
    "*Me adapté el horario* drops the *a*: it is *me adapté al horario*.",
    "*Apropiado* is not another word for *bueno*: it judges whether something fits the moment.",
    "*Conveniente* is advisable; for handy, say *práctico* or *cómodo*."
  ]
},

"nt-correccion-precision-b2": {
  source: "merged",
  hook: {
    line: "Your electricity bill arrives at three times the usual amount. You write to the company, they answer, and the whole exchange is about errors, exact figures and being clear about what you want.",
    es: "Buenos días: la factura de octubre tiene un error, el valor no es correcto.\nRespuesta: Tiene razón, hubo una falla en el sistema y le cobramos de más.\nNecesito la cifra exacta, no aproximada, antes de pagar.\nLo tengo clarísimo: no voy a pagar hasta que la corrijan.",
    en: "Good morning: the October bill has an error, the amount isn't correct.\nReply: You're right, there was a fault in the system and we overcharged you.\nI need the exact figure, not an approximate one, before paying.\nI'm absolutely clear about it: I'm not going to pay until you correct it."
  },
  examples: [
    { es: "Encontraron una falla en el sistema y por eso las facturas de octubre salieron mal.", en: "They found a fault in the system, and that's why the October bills came out wrong." },
    { es: "Es un plan imperfecto, pero funciona; no digo que esté equivocado, digo que se puede mejorar.", en: "It's an imperfect plan, but it works; I'm not saying it's wrong, I'm saying it can be improved." },
    { es: "Me equivoqué de dirección y llegué tarde, pero lo tengo clarísimo: no va a volver a pasar.", en: "I got the address wrong and arrived late, but I'm absolutely clear about it: it won't happen again." }
  ],
  rule: "Naming an error: *un error*, *una equivocación*, and for a machine or a system, *una falla* (in Spain, *un fallo*).\n*Correcto* is right. *Exacto* is right with no margin at all, for figures: *la cifra exacta*, not *aproximada*. *Preciso* is detailed enough.\n*Imperfecto* has room to improve; *equivocado* is actually wrong.\nPicking the wrong one: *me equivoqué de dirección*, with *de* and no *la*. A slip inside something: *me equivoqué en la cuenta*.\nFirst *revisar* (check), then *corregir* (fix): *corrijo, corriges, corrigió*.\n*Lo tengo claro* or *lo tengo clarísimo*: my mind is made up.",
  readAndPick: [
    { q: "Who or what made the mistake?", es: "Hubo una falla en el sistema.",
      options: ["A clerk", "The customer", "The system"], answer: 2,
      why: "*Una falla* is a fault in a machine or a system: no person is named." },
    { q: "What does the customer want?", es: "Necesito la cifra exacta, no aproximada.",
      options: ["A rough estimate", "The precise figure", "A quick discount now"], answer: 1,
      why: "*Exacto* promises no margin at all; *aproximado* is roughly." },
    { q: "Is the plan wrong?", es: "Es un plan imperfecto, pero funciona.",
      options: ["No, but it could be better", "Yes, it is completely wrong", "Nobody has tested it yet"], answer: 0,
      why: "*Imperfecto* leaves room to improve; *equivocado* would say it is wrong." },
    { q: "What did he get wrong?", es: "Me equivoqué de dirección.",
      options: ["The address he went to", "The spelling of a street", "His own phone number"], answer: 0,
      why: "*Equivocarse de* is picking the wrong one: he went to the wrong address." },
    { q: "How sure is she?", es: "Lo tengo clarísimo: no voy a pagar.",
      options: ["Not sure at all", "Completely sure", "A little unsure"], answer: 1,
      why: "*Lo tengo clarísimo* is not about seeing: it says her mind is made up." }
  ],
  yourTurn: [
    { en: "They found a fault in the system.", es: "Encontraron una falla en el sistema.", accept: ["Encontraron [una falla|un error|un fallo] en el sistema."] },
    { en: "I need an exact figure, not an approximate one.", es: "Necesito una cifra exacta, no aproximada.", accept: ["Necesito una cifra exacta, no (una) aproximada."] },
    { en: "I got the address wrong.", es: "Me equivoqué de dirección.", accept: [] },
    { en: "I'm very clear about it, I'm not going to change my mind.", es: "Lo tengo muy claro, no voy a cambiar de opinión.", accept: ["Lo tengo [muy claro|clarísimo], no voy a cambiar de opinión."] }
  ],
  translate: [
    { en: "His answer was correct, but not exact.", es: "Su respuesta fue correcta, pero no exacta.", accept: [] },
    { en: "It's an imperfect but workable plan.", es: "Es un plan imperfecto pero funcional.", accept: ["Es un plan imperfecto, pero funcional."] },
    { en: "I made a mistake in the bill; I'm sorry.", es: "Me equivoqué en la cuenta; lo siento.", accept: ["Me equivoqué en la cuenta, lo siento."] },
    { en: "You have to check the report before correcting it.", es: "Hay que revisar el informe antes de corregirlo.", accept: ["[Hay que|Tienes que] revisar el informe antes de corregirlo."] },
    { en: "Good morning. The October bill has an error: the amount isn't correct. I'd be grateful if you sent me the exact figure.", es: "Buenos días. La factura de octubre tiene un error: el valor no es correcto. Le agradecería que me enviara la cifra exacta.", accept: ["Buenos días. La factura de octubre tiene un error: el [valor|monto] no es correcto. Le agradecería que me [enviara|mandara] la cifra exacta."] },
    { en: "We took the wrong road and arrived an hour late.", es: "Nos equivocamos de carretera y llegamos una hora tarde.", accept: ["Nos equivocamos de [carretera|camino|vía] y llegamos una hora tarde."] }
  ],
  register: [
    { es: "Me equivoqué.", en: "I got it wrong.", when: "anywhere, owning a mistake plainly" },
    { es: "Fue culpa mía, perdón.", en: "It was my fault, sorry.", when: "with friends or colleagues, owning it warmly" },
    { es: "Hubo una falla en el sistema.", en: "There was a fault in the system.", when: "from a company, explaining without blaming anyone" },
    { es: "Le pedimos disculpas por el error en su factura.", en: "We apologize for the error in your bill.", when: "in a formal email to a customer" }
  ],
  personal: {
    prompt: "Write two lines to a company or a colleague about a real mistake: name the error precisely, and say what you are completely clear about.",
    constraints: [
      { type: "containsAny", words: ["error", "falla", "equivoc", "fallo"], label: "the error named: *un error*, *una falla* or *me equivoqué*" },
      { type: "containsAny", words: ["exact", "precis", "lo tengo claro", "lo tengo clarísimo", "lo tengo muy claro"], label: "*exacto*, *preciso* or *lo tengo clarísimo*" }
    ],
    model: "Hubo un error en mi pedido: me mandaron dos camisas en vez de una. Lo tengo clarísimo, no voy a pagar la segunda."
  },
  pitfalls: [
    "*Un fallo* is what you will read from Spain; in Colombia a machine has *una falla*.",
    "*Exacto* is stronger than *correcto*: keep it for figures and measurements.",
    "*Tenerlo claro* is about being sure, not about eyesight."
  ]
},

"task-b2-registro": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: one view you really hold, said five times, to a friend at a bar, to a colleague, in a meeting, in an email to someone senior and in a letter to a newspaper. The facts never move. Everything else does.",
    es: "Bar: No, hermano, eso no tiene ni pies ni cabeza.\nCon un colega: Yo lo veo distinto, la verdad. No me acaba de convencer.\nEn una reunión: Entiendo el planteamiento, pero creo que habría que matizarlo.\nCorreo a la gerente: Comparto el objetivo, aunque quisiera plantear una reserva sobre los plazos.\nCarta al periódico: Cabría preguntarse si la medida aborda realmente la causa del problema.",
    en: "Bar: No, man, that makes no sense at all.\nWith a colleague: I see it differently, honestly. It doesn't quite convince me.\nIn a meeting: I understand the approach, but I think it would need qualifying.\nEmail to the manager: I share the goal, although I'd like to raise a reservation about the deadlines.\nLetter to the newspaper: One might ask whether the measure really addresses the cause of the problem."
  },
  examples: [
    { es: "Oye, eso de abrir los sábados no tiene sentido, ¿quién va a venir a esa hora?", en: "Hey, this idea of opening on Saturdays makes no sense, who's going to come at that time?" },
    { es: "Entiendo la propuesta de abrir los sábados, pero creo que habría que hablarlo con el equipo.", en: "I understand the proposal to open on Saturdays, but I think we'd need to discuss it with the team." },
    { es: "Cabría preguntarse si abrir los sábados responde de verdad a lo que necesitan los clientes.", en: "One might ask whether opening on Saturdays really meets what customers need." }
  ],
  rule: "Five rooms, one view. Going up the ladder changes three things.\nHow much of you is in it: *yo lo veo distinto* at the bottom, *cabría preguntarse si* at the top, where nobody says I.\nHow you address them: *tú* and *oye* with friends, *usted* and *su* as you go up.\nWhere the softening sits: before the claim (*entiendo el planteamiento, pero...*) or after it (*..., la verdad*).\nThe softeners you have: *quisiera*, *habría que*, *no me acaba de convencer*, *cabría*.\nChoose by the room and the person, not by how strongly you feel, and keep the facts the same in all five.",
  readAndPick: [
    { q: "Which room does this belong in?", es: "Cabría preguntarse si la medida aborda la causa.",
      options: ["A bar with friends", "A newspaper letter", "A text to your mom"], answer: 1,
      why: "*Cabría preguntarse si* keeps the writer out of it: the voice of print." },
    { q: "Who is she talking to?", es: "No, hermano, eso no tiene ni pies ni cabeza.",
      options: ["A close friend", "Her new manager", "A journalist she met"], answer: 0,
      why: "*Hermano* and *ni pies ni cabeza* are for people you are close to." },
    { q: "Where does the softening sit here?", es: "Yo lo veo distinto, la verdad.",
      options: ["Before the view", "There is none", "After the view"], answer: 2,
      why: "*La verdad* at the end softens a view already given." },
    { q: "What does *no me acaba de convencer* mean?", es: "La propuesta no me acaba de convencer.",
      options: ["It has just convinced me", "I am not fully sold on it", "It convinced me in the end"], answer: 1,
      why: "*No acabar de* is not quite: a soft no. *Acabar de* without the *no* is just now." },
    { q: "Who is this written to?", es: "Quisiera plantear una reserva sobre los plazos.",
      options: ["Someone senior", "A close friend", "Her little sister"], answer: 0,
      why: "*Quisiera plantear* is careful and distant: an email upward, not a chat." }
  ],
  yourTurn: [
    { en: "I see it differently, honestly.", es: "Yo lo veo distinto, la verdad.", accept: ["(Yo) lo veo [distinto|diferente|de otra manera], la verdad.", "La verdad, (yo) lo veo [distinto|diferente|de otra manera]."] },
    { en: "It doesn't quite convince me.", es: "No me acaba de convencer.", accept: [] },
    { en: "I understand the approach, but I think it would need qualifying.", es: "Entiendo el planteamiento, pero creo que habría que matizarlo.", accept: [] },
    { en: "One might ask whether the measure really works.", es: "Cabría preguntarse si la medida funciona realmente.", accept: ["Cabría preguntarse si la medida [funciona realmente|realmente funciona|funciona de verdad]."] }
  ],
  translate: [
    { en: "Hey, that idea makes no sense. (to a friend)", es: "Oye, esa idea no tiene sentido.", accept: ["Oye, esa idea no tiene (ningún) sentido."] },
    { en: "I share the overall goal, although I have a reservation about the cost.", es: "Comparto el objetivo general, aunque tengo una reserva sobre el costo.", accept: ["Comparto el objetivo general, aunque tengo una reserva [sobre|con respecto a] el costo."] },
    { en: "We'd need to discuss it with the team first.", es: "Habría que hablarlo primero con el equipo.", accept: ["Habría que hablarlo con el equipo primero.", "Primero habría que hablarlo con el equipo."] },
    { en: "I'd be grateful if you reconsidered your decision. (polite)", es: "Le agradecería que reconsiderara su decisión.", accept: [] },
    { en: "I understand the proposal, but it doesn't quite convince me. One might ask whether opening on Saturdays is what customers need.", es: "Entiendo la propuesta, pero no me acaba de convencer. Cabría preguntarse si abrir los sábados es lo que necesitan los clientes.", accept: [] },
    { en: "With all due respect, I don't share that view.", es: "Con todo respeto, no comparto esa idea.", accept: ["Con todo (el) respeto, no comparto esa [idea|opinión|visión]."] }
  ],
  register: [
    { es: "No, hermano, eso no tiene sentido.", en: "No, man, that makes no sense.", when: "with a close friend, at a bar or in a chat" },
    { es: "Yo lo veo distinto, la verdad.", en: "I see it differently, honestly.", when: "with a colleague you get on with" },
    { es: "Entiendo el planteamiento, pero habría que matizarlo.", en: "I understand the approach, but it would need qualifying.", when: "in a meeting, to disagree without a fight" },
    { es: "Quisiera plantear una reserva sobre los plazos.", en: "I'd like to raise a reservation about the deadlines.", when: "in an email to someone senior" },
    { es: "Cabría preguntarse si la medida funciona.", en: "One might ask whether the measure works.", when: "in a letter to a newspaper or an essay" }
  ],
  personal: {
    prompt: "Take one view you really hold. Write it three times: to a friend, in a meeting and in a letter to a newspaper. Put each on its own line, with the facts the same.",
    constraints: [
      { type: "minSentences", n: 3, label: "three versions, one per line" },
      { type: "containsAny", words: ["oye", "mira", "hermano", "hermana", "parce"], label: "a version for a friend, with *oye* or *mira*" },
      { type: "containsAny", words: ["cabría", "cabe preguntarse", "habría que", "quisiera"], label: "a formal version: *cabría preguntarse*, *habría que* or *quisiera*" }
    ],
    model: "Oye, eso de cerrar la ciclovía no tiene sentido.\nEntiendo la idea, pero creo que habría que pensarlo mejor.\nCabría preguntarse si cerrar la ciclovía ayuda de verdad a la ciudad."
  },
  pitfalls: [
    "*Cabría preguntarse* to a friend sounds like you are reading a newspaper aloud.",
    "Changing the facts between rooms is not this task: only the wording moves."
  ]
},

/* ---- unit b2-u45 · Building an argument ---------------------------------- */

"gn-argumentativa-b2": {
  source: "merged",
  hook: {
    line: "A reader writes to a Bogotá newspaper about the city's car-free day. In five sentences she names the debate, takes a side, admits what is true on the other side, answers it, and ends on a limit she honestly grants.",
    es: "Hay quienes dicen que el día sin carro no sirve para nada.\nSin embargo, ese día el aire de la ciudad mejora de forma clara.\nEs cierto que muchos llegan tarde al trabajo, pero no solo hay más bicicletas, sino también menos ruido.\nSe podría objetar que es un solo día al año. De hecho, ese es el problema.\nDicho esto, habría que mejorar el transporte antes de repetirlo cada mes.",
    en: "Some people say the car-free day is useless.\nHowever, on that day the city's air clearly improves.\nIt's true that many people get to work late, but there are not only more bicycles, but also less noise.\nOne could object that it's just one day a year. In fact, that's the problem.\nThat said, transport would need to improve before repeating it every month."
  },
  examples: [
    { es: "Es cierto que el proyecto es caro, pero a largo plazo nos va a ahorrar mucho dinero.", en: "It's true that the project is expensive, but in the long run it's going to save us a lot of money." },
    { es: "Ellos quieren vender el edificio; nosotros, en cambio, queremos quedarnos y arreglarlo poco a poco.", en: "They want to sell the building; we, on the other hand, want to stay and fix it up little by little." },
    { es: "Se podría objetar que nadie usa la ciclorruta cuando llueve. Sin embargo, los datos dicen otra cosa.", en: "One could object that nobody uses the bike lane when it rains. However, the data say otherwise." }
  ],
  rule: "An argument earns trust by admitting what is true before it pushes back.\nName the debate: *Hay quienes dicen que...*\nConcede, then turn: *Es cierto que es caro, pero...* The fact after *es cierto que* stays ordinary.\nAdd proof: *De hecho,* (in fact). Add more: *No solo es barato, sino también práctico.* Before a whole new verb: *sino que también...*\nSet two sides apart: *Ellos quieren vender; nosotros, en cambio,...*\nRaise the best objection yourself, then answer it: *Se podría objetar que... Sin embargo,...*\nEnd with an honest limit: *Dicho esto,* or *Ahora bien,* plus *habría que...*\n*Actualmente* means nowadays, never actually.",
  readAndPick: [
    { q: "What is the writer doing with *es cierto que*?", es: "Es cierto que muchos llegan tarde, pero el aire mejora.",
      options: ["Admitting a point first", "Agreeing with everything", "Ending the whole letter"], answer: 0,
      why: "*Es cierto que* grants the other side's point; the *pero* turns it." },
    { q: "What does *de hecho* add?", es: "De hecho, ese día hay menos accidentes.",
      options: ["A doubt", "A piece of proof", "A change of topic"], answer: 1,
      why: "*De hecho* backs the claim up with something real: in fact." },
    { q: "What does *actualmente* mean?", es: "Actualmente, la ciudad tiene más de quinientos kilómetros de ciclorrutas.",
      options: ["Actually", "Officially", "Nowadays"], answer: 2,
      why: "*Actualmente* is nowadays. For actually, say *de hecho* or *en realidad*." },
    { q: "Why *sino* and not *pero*?", es: "No solo hay más bicicletas, sino también menos ruido.",
      options: ["It follows *no solo*", "It ends a sentence", "It sounds more formal"], answer: 0,
      why: "After *no solo*, the but becomes *sino*: not only this but also that." },
    { q: "What is *dicho esto* doing at the end?", es: "Dicho esto, habría que mejorar el transporte primero.",
      options: ["Repeating the main idea", "Adding an honest limit", "Starting a new topic"], answer: 1,
      why: "*Dicho esto* adds the reservation that keeps the argument honest." }
  ],
  yourTurn: [
    { en: "It's true that we need money, but not at any price.", es: "Es cierto que necesitamos dinero, pero no a cualquier precio.", accept: ["Es [cierto|verdad] que necesitamos [dinero|plata], pero no a cualquier precio."] },
    { en: "It's not only cheap but also practical.", es: "No solo es barato, sino también práctico.", accept: [] },
    { en: "One could object that the project is expensive.", es: "Se podría objetar que el proyecto es caro.", accept: [] },
    { en: "That said, we would need to talk to the neighbours.", es: "Dicho esto, habría que hablar con los vecinos.", accept: ["[Dicho esto|Ahora bien], habría que hablar con los vecinos."] },
    { en: "In fact, sales are going up.", es: "De hecho, las ventas suben.", accept: ["De hecho, las ventas [suben|están subiendo|van subiendo]."] }
  ],
  translate: [
    { en: "They want to sell; we, on the other hand, want to stay.", es: "Ellos quieren vender; nosotros, en cambio, queremos quedarnos.", accept: ["Ellos quieren vender[;|,] nosotros, en cambio, queremos quedarnos."] },
    { en: "Who could deny that the neighbourhood needs help?", es: "¿Quién podría negar que el barrio necesita ayuda?", accept: [] },
    { en: "Nowadays, more people go to work by bike.", es: "Actualmente, más gente va al trabajo en bicicleta.", accept: ["Actualmente, más gente va [al trabajo|a trabajar] en bicicleta."] },
    { en: "He not only sells bread, but he also teaches how to make it.", es: "No solo vende pan, sino que también enseña a hacerlo.", accept: [] },
    { en: "One could object that it's only one day a year. However, that day the air clearly improves. That said, transport would need to improve first.", es: "Se podría objetar que es solo un día al año. Sin embargo, ese día el aire mejora claramente. Dicho esto, habría que mejorar el transporte primero.", accept: ["Se podría objetar que es solo un día al año. Sin embargo, ese día el aire mejora [claramente|de forma clara]. [Dicho esto|Ahora bien], habría que mejorar el transporte primero.", "Se podría objetar que es solo un día al año. Sin embargo, ese día el aire mejora [claramente|de forma clara]. [Dicho esto|Ahora bien], primero habría que mejorar el transporte."] },
    { en: "It's true that the building is old, but it has history.", es: "Es verdad que el edificio es viejo, pero tiene historia.", accept: ["Es [verdad|cierto] que el edificio es viejo, pero tiene historia."] }
  ],
  register: [
    { es: "Sí, pero no es tan fácil.", en: "Yes, but it's not that easy.", when: "in conversation, the quick way to push back" },
    { es: "Es cierto que es caro, pero vale la pena.", en: "It's true that it's expensive, but it's worth it.", when: "anywhere, conceding before you turn" },
    { es: "Se podría objetar que es caro.", en: "One could object that it's expensive.", when: "in an essay, a debate or a letter" },
    { es: "Ahora bien, el costo es alto.", en: "That said, the cost is high.", when: "in writing, to add a reservation" }
  ],
  personal: {
    prompt: "Pick something people in your city argue about. Write three sentences: concede a point with *es cierto que*, raise the best objection with *se podría objetar que*, and add a limit with *dicho esto* or *ahora bien*.",
    constraints: [
      { type: "containsAny", words: ["es cierto que", "es verdad que"], label: "a point conceded: *es cierto que..., pero*" },
      { type: "containsWord", word: "se podría objetar que", label: "the objection: *se podría objetar que*" },
      { type: "containsAny", words: ["dicho esto", "ahora bien"], label: "an honest limit: *dicho esto* or *ahora bien*" }
    ],
    model: "Es cierto que el metro de Bogotá va a costar mucho, pero la ciudad lo necesita. Se podría objetar que va a tardar años. Dicho esto, habría que mejorar los buses mientras tanto."
  },
  pitfalls: [
    "*Pero sin embargo* says but twice: pick one.",
    "*Actualmente* is nowadays. For actually, say *de hecho* or *en realidad*.",
    "An objection raised and left unanswered hands your reader the argument."
  ]
},

"gn-composicion-argumentativa-b2": {
  source: "merged",
  hook: {
    line: "A newspaper in Cartagena invites short essays from its readers: should cars be banned from the historic centre? A good essay tells the reader its position and its plan in the first line, and then keeps that promise.",
    es: "¿Deberían prohibirse los carros en el centro histórico?\nVoy a defender que sí, por tres razones fundamentales.\nEn primer lugar, la calidad del aire mejora donde ya hay restricciones.\nSe podría objetar que esto perjudica al pequeño comercio.\nSin embargo, un centro sin carros atrae a más gente a pie.\nPara terminar, los beneficios superan con claridad el costo inicial.",
    en: "Should cars be banned in the historic centre?\nI'm going to argue that they should, for three main reasons.\nFirstly, air quality improves where there are already restrictions.\nOne could object that this harms small businesses.\nHowever, a centre without cars attracts more people on foot.\nTo conclude, the benefits clearly outweigh the initial cost."
  },
  examples: [
    { es: "Voy a defender que la educación pública debe ser gratuita, por tres razones fundamentales.", en: "I'm going to argue that public education should be free, for three main reasons." },
    { es: "En segundo lugar, el espacio que dejan los carros permite ampliar los andenes y los parques.", en: "Secondly, the space the cars leave allows the sidewalks and the parks to be widened." },
    { es: "Es una preocupación legítima; sin embargo, la experiencia de otras ciudades muestra lo contrario.", en: "It's a legitimate concern; however, the experience of other cities shows the opposite." }
  ],
  rule: "A composition is a promise kept. Five parts:\n1. A title, often a question, and a line that places the debate.\n2. Your position and your plan: *Voy a defender que..., por tres razones.* After *que*, an ordinary sentence.\n3. The reasons in order: *En primer lugar,* *En segundo lugar,* *Por último,* One reason a paragraph, each with an example.\n4. The strongest objection, stated fairly: *Se podría objetar que...* Then the answer: *Es una preocupación legítima; sin embargo,...*\n5. The close: *Para terminar,* *En conclusión,* or *En definitiva,* and one line that answers the title, not a list of everything.",
  readAndPick: [
    { q: "What does the reader learn from this line?", es: "Voy a defender que sí, por tres razones fundamentales.",
      options: ["Her side and her plan", "Only the final conclusion", "The other side's objection"], answer: 0,
      why: "*Voy a defender que* gives the position; *por tres razones* promises the shape." },
    { q: "What comes right after this sentence?", es: "Se podría objetar que esto perjudica al pequeño comercio.",
      options: ["The essay's title", "The answer to it", "A brand new reason"], answer: 1,
      why: "An objection is raised to be answered: *sin embargo* comes next." },
    { q: "Where does *por último* go?", es: "Por último, el transporte público ofrece una alternativa real.",
      options: ["In the title", "Before the first reason", "Before the last reason"], answer: 2,
      why: "*Por último* brings in the final reason, after *en primer lugar* and *en segundo lugar*." },
    { q: "What does *legítima* do in this reply?", es: "Es una preocupación legítima; sin embargo, la experiencia muestra lo contrario.",
      options: ["Admits the worry is fair", "Calls the worry rather silly", "Moves on to a new topic"], answer: 0,
      why: "Calling the concern *legítima* is fair to the other side before the *sin embargo*." },
    { q: "What does *superar* mean here?", es: "Los beneficios superan con claridad el costo inicial.",
      options: ["Are smaller than", "Outweigh", "Are equal to"], answer: 1,
      why: "*Superar* is to be greater than: the benefits outweigh the cost." }
  ],
  yourTurn: [
    { en: "I'm going to argue that education should be free.", es: "Voy a defender que la educación debe ser gratuita.", accept: ["Voy a defender que la educación [debe|debería] ser gratuita."] },
    { en: "Firstly, there's less pollution.", es: "En primer lugar, hay menos contaminación.", accept: [] },
    { en: "One could object that this harms small businesses.", es: "Se podría objetar que esto perjudica al pequeño comercio.", accept: ["Se podría objetar que esto perjudica [al pequeño comercio|a los pequeños negocios|a los pequeños comerciantes]."] },
    { en: "To conclude, the benefits clearly outweigh the cost.", es: "Para terminar, los beneficios superan claramente el costo.", accept: ["[Para terminar|En conclusión|Para concluir], los beneficios superan [claramente|con claridad] [el|al] costo."] }
  ],
  translate: [
    { en: "We are going to argue that the building should stay, for several reasons.", es: "Vamos a defender que el edificio debe quedarse, por varias razones.", accept: ["Vamos a defender que el edificio [debe|debería] quedarse, por varias razones."] },
    { en: "Secondly, the space allows the sidewalks to be widened.", es: "En segundo lugar, el espacio permite ampliar los andenes.", accept: ["En segundo lugar, el espacio permite ampliar [los andenes|las aceras]."] },
    { en: "Finally, public transport offers a real alternative.", es: "Por último, el transporte público ofrece una alternativa real.", accept: ["[Por último|Finalmente], el transporte público ofrece una alternativa real."] },
    { en: "It's a legitimate concern; however, other cities show the opposite.", es: "Es una preocupación legítima; sin embargo, otras ciudades muestran lo contrario.", accept: ["Es una preocupación legítima[;|,|.] [sin embargo|Sin embargo], otras ciudades muestran lo contrario."] },
    { en: "Should cars be banned in the centre? I'm going to argue that they should, for three reasons.", es: "¿Deberían prohibirse los carros en el centro? Voy a defender que sí, por tres razones.", accept: ["¿Se deberían prohibir los carros en el centro? Voy a defender que sí, por tres razones."] },
    { en: "All in all, the measure is worth it if the buses improve as well.", es: "En definitiva, la medida vale la pena si también mejoran los buses.", accept: ["En definitiva, la medida vale la pena si los buses también mejoran.", "En definitiva, la medida vale la pena si mejoran también los buses."] }
  ],
  register: [
    { es: "Yo creo que sí, por varias cosas.", en: "I think so, for a few reasons.", when: "in conversation, giving your side" },
    { es: "Voy a defender que sí, por tres razones.", en: "I'm going to argue yes, for three reasons.", when: "opening an essay or a short speech" },
    { es: "En este ensayo sostengo que la medida es necesaria.", en: "In this essay I maintain that the measure is necessary.", when: "in academic writing, at the very start" },
    { es: "En definitiva, la medida vale la pena.", en: "All in all, the measure is worth it.", when: "closing an essay or a report" }
  ],
  personal: {
    prompt: "Write the first lines of your own composition on a question you care about: your position with *voy a defender que* and the number of reasons, then your first reason, then the strongest objection.",
    constraints: [
      { type: "containsWord", word: "voy a defender que", label: "your position: *voy a defender que*" },
      { type: "regex", pattern: "por (dos|tres|cuatro|varias) razones", label: "the plan: *por dos razones* or *por tres razones*" },
      { type: "containsAny", words: ["en primer lugar", "para empezar"], label: "the first reason: *en primer lugar*" },
      { type: "containsAny", words: ["se podría objetar", "se puede objetar", "se podría argumentar"], label: "the objection: *se podría objetar que*" }
    ],
    model: "Voy a defender que las empresas deberían permitir el teletrabajo, por tres razones. En primer lugar, la gente pierde menos tiempo en el trancón. Se podría objetar que es más difícil trabajar en equipo."
  },
  pitfalls: [
    "Promising three reasons and giving two breaks the deal you made in the first line.",
    "A close that repeats every point is a summary; one line that answers the title is enough."
  ]
},

"dc-marcadores-discurso-b2": {
  source: "merged",
  hook: {
    line: "Your friend Valentina sends you a long message about the weekend plan, and it wanders: a contrast, a correction, a detour and a shrug. Each turn is marked by a small phrase, and each phrase does a different job.",
    es: "Al final no vamos a Villa de Leyva el sábado, a pesar de lo que dijimos.\nJuan quiere ir en bus, mientras que yo prefiero alquilar un carro.\nEl sábado, mejor dicho, el domingo, está libre la casa de mi tía.\nPor cierto, ¿ya le avisaste a Camilo?\nEn cualquier caso, yo voy, llueva o no.",
    en: "In the end we're not going to Villa de Leyva on Saturday, despite what we said.\nJuan wants to go by bus, whereas I'd rather rent a car.\nOn Saturday, or rather on Sunday, my aunt's house is free.\nBy the way, have you told Camilo yet?\nIn any case, I'm going, rain or shine."
  },
  examples: [
    { es: "El aeropuerto funcionó con normalidad a pesar de la huelga de los controladores aéreos.", en: "The airport ran normally despite the air traffic controllers' strike." },
    { es: "Este cuadro es uno de los que más me gustan; mejor dicho, es el mejor de la exposición.", en: "This painting is one of the ones I like most; or rather, it's the best in the exhibition." },
    { es: "A pesar de que llovió toda la tarde, la gente siguió bailando en la plaza.", en: "Even though it rained all afternoon, people kept dancing in the square." }
  ],
  rule: "Each small phrase does one job.\nGo ahead despite something: *a pesar de* and a thing (*a pesar de la lluvia*), *a pesar de que* and a full sentence (*a pesar de que llueve*). Or start afresh: *Sin embargo,* *Aun así,*\nJust set two things side by side, granting nothing: *Él prefiere el bus, mientras que yo prefiero el carro.*\nCorrect yourself: *mejor dicho*. Say it another way: *es decir*, *en otras palabras*.\nWander off: *por cierto*. Pick up a word just said: *hablando de...*\nWave the last point aside: *en cualquier caso*, *de todos modos*.\nPoint at the topic: *respecto a*, *en cuanto a*.",
  readAndPick: [
    { q: "Is anything being given up here?", es: "Juan quiere ir en bus, mientras que yo prefiero alquilar un carro.",
      options: ["Yes, she gives way", "No, it's a contrast", "Yes, Juan gives way to her"], answer: 1,
      why: "*Mientras que* only sets two things side by side. It grants nothing." },
    { q: "Which day is the house free?", es: "El sábado, mejor dicho, el domingo, está libre la casa.",
      options: ["Sunday", "Saturday", "Both days"], answer: 0,
      why: "*Mejor dicho* corrects what came just before: Sunday, not Saturday." },
    { q: "How does *por cierto* connect to what came before?", es: "Por cierto, ¿ya le avisaste a Camilo?",
      options: ["It sums everything up", "It corrects the last line", "It's a sudden new thought"], answer: 2,
      why: "*Por cierto* brings in something new, with no link to what was said." },
    { q: "What does the strike change?", es: "El aeropuerto funcionó con normalidad a pesar de la huelga.",
      options: ["Nothing at all", "The flight times", "Everything"], answer: 0,
      why: "*A pesar de* names an obstacle, and things went ahead anyway." },
    { q: "Why is there a *que* here?", es: "A pesar de que llovió, la gente siguió bailando.",
      options: ["It turns it into a question", "It sounds a lot more formal", "A whole sentence comes next"], answer: 2,
      why: "Before a thing, *a pesar de*; before a verb with its own subject, *a pesar de que*." }
  ],
  yourTurn: [
    { en: "Despite the rain, they came.", es: "A pesar de la lluvia, vinieron.", accept: ["Vinieron a pesar de la lluvia."] },
    { en: "He prefers the bus, whereas I prefer the car.", es: "Él prefiere el bus, mientras que yo prefiero el carro.", accept: ["Él prefiere el bus, mientras que yo prefiero el [carro|coche]."] },
    { en: "By the way, have you paid the electricity bill yet? (to a friend)", es: "Por cierto, ¿ya pagaste la luz?", accept: ["[Por cierto|A propósito], ¿ya pagaste la luz?"] },
    { en: "It's expensive; even so, it's worth it.", es: "Es caro; aun así, vale la pena.", accept: ["Es caro[;|,|.] [aun así|Aun así], vale la pena."] },
    { en: "Speaking of travel, did you hear that Ana is going to Japan?", es: "Hablando de viajes, ¿supiste que Ana se va para Japón?", accept: ["Hablando de viajes, ¿[supiste|sabías] que Ana se va [para|a] Japón?"] }
  ],
  translate: [
    { en: "Even though it rained all afternoon, people kept dancing.", es: "A pesar de que llovió toda la tarde, la gente siguió bailando.", accept: ["Aunque llovió toda la tarde, la gente siguió bailando."] },
    { en: "This painting is one of my favourites; or rather, it's the best one.", es: "Este cuadro es uno de mis favoritos; mejor dicho, es el mejor.", accept: ["Este cuadro es uno de mis favoritos[;|,] mejor dicho, es el mejor."] },
    { en: "Regarding your second question, I can't answer you yet. (polite)", es: "Respecto a su segunda pregunta, todavía no puedo responderle.", accept: ["[Respecto a|En cuanto a|Con respecto a] su segunda pregunta, todavía no [puedo responderle|le puedo responder]."] },
    { en: "I don't mind that they didn't invite me. In any case, I wasn't planning to go.", es: "No me importa que no me hayan invitado. En cualquier caso, no pensaba ir.", accept: ["No me importa que no me [hayan invitado|invitaran]. [En cualquier caso|De todos modos], no pensaba ir."] },
    { en: "In the end we're not going on Saturday, despite what we said. In any case, I'm going on Sunday.", es: "Al final no vamos el sábado, a pesar de lo que dijimos. En cualquier caso, yo voy el domingo.", accept: ["Al final no vamos el sábado, a pesar de lo que dijimos. [En cualquier caso|De todos modos], (yo) voy el domingo."] },
    { en: "Not only did he arrive late, but he also forgot the documents.", es: "No solo llegó tarde, sino que además olvidó los documentos.", accept: ["No solo llegó tarde, sino que [además|también] olvidó los documentos."] }
  ],
  register: [
    { es: "Igual voy.", en: "I'm going anyway.", when: "with friends, a quick shrug" },
    { es: "De todos modos, voy.", en: "Anyway, I'm going.", when: "anywhere, waving the last point aside" },
    { es: "Aun así, voy a ir.", en: "Even so, I'm going to go.", when: "when you go ahead against an obstacle" },
    { es: "No obstante, asistiré a la reunión.", en: "Nevertheless, I will attend the meeting.", when: "in a formal email or a report" }
  ],
  personal: {
    prompt: "Write three lines about a plan that changed: something you did *a pesar de* an obstacle, a correction with *mejor dicho*, and a detour with *por cierto*.",
    constraints: [
      { type: "containsAny", words: ["a pesar de", "aun así", "sin embargo"], label: "an obstacle: *a pesar de*, *sin embargo* or *aun así*" },
      { type: "containsAny", words: ["mejor dicho", "es decir", "en otras palabras"], label: "a correction or a rewording: *mejor dicho* or *es decir*" },
      { type: "containsAny", words: ["por cierto", "a propósito", "hablando de"], label: "a detour: *por cierto* or *hablando de*" }
    ],
    model: "Fuimos a la finca a pesar de la lluvia. Llegamos a las ocho, mejor dicho, a las nueve. Por cierto, ¿ya te devolví la sombrilla?"
  },
  pitfalls: [
    "*A pesar que llueve* drops the *de*: it is *a pesar de que*.",
    "*Pero sin embargo* says but twice.",
    "*Hablando de* needs a real link to what was just said; with none, say *por cierto*."
  ]
},

"gr-adverbios-evaluativos-b2": {
  source: "merged",
  hook: {
    line: "You leave a review of a restaurant in Cartagena on a travel site. Every sentence says what happened, and one word at the front says how you feel about it. That word does not describe the waiter; it gives your verdict.",
    es: "Fuimos a cenar el sábado. Lamentablemente, la reserva no aparecía en el sistema.\nAfortunadamente, nos dieron una mesa en la terraza en diez minutos.\nEl mesero, inteligentemente, nos recomendó el pescado del día.\nSinceramente, es el mejor arroz con coco que he probado.\nDefinitivamente vamos a volver.",
    en: "We went to dinner on Saturday. Unfortunately, the reservation wasn't showing up in the system.\nFortunately, they gave us a table on the terrace within ten minutes.\nThe waiter, wisely, recommended the fish of the day to us.\nHonestly, it's the best coconut rice I've ever tried.\nWe're definitely coming back."
  },
  examples: [
    { es: "Lamentablemente, el vuelo se canceló por el mal tiempo y tuvimos que dormir en el aeropuerto.", en: "Unfortunately, the flight was cancelled because of the bad weather and we had to sleep at the airport." },
    { es: "Inteligentemente, guardó una copia del archivo antes de enviarlo, y eso nos salvó el proyecto.", en: "Wisely, she kept a copy of the file before sending it, and that saved the project for us." },
    { es: "Necesariamente tiene que ser el lunes, porque el martes la oficina está cerrada todo el día.", en: "It necessarily has to be Monday, because on Tuesday the office is closed all day." }
  ],
  rule: "Some *-mente* words don't describe the action. They comment on the whole sentence, so they open it, with a comma.\nHow you feel about it: *Lamentablemente,* *Afortunadamente,* *Por suerte,* *Sinceramente,* *Francamente,*\nWhether it was wise: *Inteligentemente, guardó una copia* says keeping a copy was smart.\nHow sure or how bound: *Necesariamente,* *Inevitablemente,* *Definitivamente,* and *Seguramente*, which is probably, not surely.\nCompare *Habló sinceramente*, how he spoke, with *Sinceramente, no me gustó*, your honest verdict.\nBuild them on the *-a* ending: *rápida* gives *rápidamente*, and the accent stays.\nIn Colombia the everyday ones are *lamentablemente* and *desafortunadamente*.",
  readAndPick: [
    { q: "What does *sinceramente* tell you here?", es: "Sinceramente, es el mejor arroz con coco que he probado.",
      options: ["How the cook made it", "What she honestly thinks", "How politely they served it"], answer: 1,
      why: "At the front with a comma, *sinceramente* comments on the whole sentence: her honest view." },
    { q: "What does *seguramente* mean?", es: "Seguramente llega tarde, como siempre.",
      options: ["Safely", "Surely, no doubt", "Probably"], answer: 2,
      why: "*Seguramente* is probably, a good guess. For no doubt, say *sin duda*." },
    { q: "What is being judged?", es: "Inteligentemente, guardó una copia antes de enviarlo.",
      options: ["That she is clever in general", "That keeping a copy was smart", "How quickly she sent it"], answer: 1,
      why: "At the front, *inteligentemente* judges the choice she made, not her in general." },
    { q: "How did he speak?", es: "Tomás habló sinceramente con su jefe.",
      options: ["Honestly", "Very briefly", "Quite angrily"], answer: 0,
      why: "After the verb, *sinceramente* says how he spoke. At the front, it would be the speaker's verdict." },
    { q: "How does she feel about the flight?", es: "Lamentablemente, el vuelo se canceló.",
      options: ["Sorry about it", "Glad about it", "She doesn't care"], answer: 0,
      why: "*Lamentablemente* is the speaker's regret about the whole fact." }
  ],
  yourTurn: [
    { en: "Unfortunately, the café closed.", es: "Lamentablemente, el café cerró.", accept: ["[Lamentablemente|Desafortunadamente|Por desgracia|Desgraciadamente], el café cerró."] },
    { en: "Luckily, nobody was hurt.", es: "Por suerte, nadie salió herido.", accept: ["[Por suerte|Afortunadamente], nadie [salió|resultó] herido."] },
    { en: "Frankly, I'm not surprised.", es: "Francamente, no me sorprende.", accept: [] },
    { en: "She answered frankly.", es: "Respondió francamente.", accept: ["(Ella) [respondió|contestó] francamente."] },
    { en: "It necessarily has to be Monday.", es: "Necesariamente tiene que ser el lunes.", accept: ["Tiene que ser necesariamente el lunes."] }
  ],
  translate: [
    { en: "Honestly, I didn't like the play.", es: "Sinceramente, no me gustó la obra.", accept: ["Sinceramente, la obra no me gustó."] },
    { en: "She'll probably arrive late, as always.", es: "Seguramente llega tarde, como siempre.", accept: ["[Seguramente|Probablemente] [llega|va a llegar|llegará] tarde, como siempre."] },
    { en: "Wisely, he waited until he had all the data.", es: "Inteligentemente, esperó a tener todos los datos.", accept: ["Inteligentemente, esperó [a|hasta] tener todos los datos."] },
    { en: "We're definitely coming back.", es: "Definitivamente vamos a volver.", accept: ["Definitivamente [vamos a volver|volveremos|volvemos]."] },
    { en: "Unfortunately, the reservation wasn't in the system. Fortunately, they gave us a table in ten minutes.", es: "Lamentablemente, la reserva no estaba en el sistema. Afortunadamente, nos dieron una mesa en diez minutos.", accept: ["[Lamentablemente|Desafortunadamente], la reserva no estaba en el sistema. [Afortunadamente|Por suerte], nos dieron una mesa en diez minutos."] },
    { en: "He explained it calmly and clearly.", es: "Lo explicó tranquila y claramente.", accept: ["Lo explicó [con calma|tranquilamente] y claramente."] }
  ],
  register: [
    { es: "Por suerte, llegamos a tiempo.", en: "Luckily, we got there on time.", when: "in everyday talk, with anyone" },
    { es: "Afortunadamente, llegamos a tiempo.", en: "Fortunately, we got there on time.", when: "a little more careful, in writing or at work" },
    { es: "Francamente, no me sorprende.", en: "Frankly, I'm not surprised.", when: "when you are about to be blunt" },
    { es: "Lamentablemente, no podemos atender su solicitud.", en: "Unfortunately, we can't fulfil your request.", when: "in a formal email that brings bad news" }
  ],
  personal: {
    prompt: "Write two lines of a review of a place you know: a restaurant, a hotel or a shop. Open each line with one word that says how you feel about what happened.",
    constraints: [
      { type: "regex", pattern: "^\\s*(lamentablemente|afortunadamente|desafortunadamente|sinceramente|francamente|por suerte|definitivamente|desgraciadamente|honestamente)\\s*,", label: "a first word with a comma, like *Sinceramente,*" },
      { type: "regex", pattern: "[.!?]\\s*(lamentablemente|afortunadamente|desafortunadamente|sinceramente|francamente|por suerte|definitivamente|desgraciadamente|honestamente)\\b", label: "a second line opened the same way" }
    ],
    model: "Sinceramente, el servicio fue lento. Afortunadamente, el ajiaco valió la espera."
  },
  pitfalls: [
    "*Seguramente* is probably, not surely: *seguramente llueve* is a guess.",
    "After the verb, the same word changes job: *habló sinceramente* is how he spoke.",
    "With two in a row, only the last one takes *-mente*: *tranquila y claramente*."
  ]
},

"gr-adverbios-enunciacion-b2": {
  source: "merged",
  hook: {
    line: "Your colleague writes to ask why you missed the planning meeting. You reply in four lines: one word pinpoints the exact reason, one zooms in on what you need, one flags a coincidence, and one wraps it all up.",
    es: "Precisamente por eso no fui: sabía que iban a hablar del presupuesto sin datos.\nNecesito ayuda, concretamente con las cifras del segundo semestre.\nCasualmente, ayer me encontré con la gerente y me dijo lo mismo.\nEn resumen, prefiero que lo hablemos el lunes, con todo listo.",
    en: "That's exactly why I didn't go: I knew they were going to talk about the budget without data.\nI need help, specifically with the figures for the second half of the year.\nBy coincidence, yesterday I ran into the manager and she told me the same thing.\nIn short, I'd rather we discuss it on Monday, with everything ready."
  },
  examples: [
    { es: "Justamente de eso quería hablarte, porque la reunión del jueves me dejó muy preocupada.", en: "That's just what I wanted to talk to you about, because Thursday's meeting left me very worried." },
    { es: "Al final todo salió bien, aunque perdimos el bus y llegamos empapados a la boda.", en: "In the end it all went well, although we missed the bus and arrived soaked at the wedding." },
    { es: "Francamente, no entiendo por qué hay que repetir el informe si ya lo entregamos.", en: "Frankly, I don't understand why we have to redo the report if we already handed it in." }
  ],
  rule: "These words comment on what you are saying, not on what happened.\nPinpoint: *precisamente* or *justamente*, right before the point: *Precisamente por eso no fui.* *Precisamente hoy no puedo* is today of all days.\nZoom in after something general: *concretamente* or *en concreto*: *Necesito ayuda, concretamente con las cifras.*\nSay how you are speaking: *francamente*, *sinceramente*, *en serio*.\nFlag chance: *casualmente* is by coincidence, never casually.\nWrap up: *al final* (how it turned out), *en resumen* (the point), *total, que* (a shrug).\n*Al final de la calle* is the end of the street; without *de*, *al final* is in the end.",
  readAndPick: [
    { q: "What does *casualmente* mean here?", es: "Casualmente, ayer me encontré con la gerente.",
      options: ["In a relaxed way", "By coincidence", "Quite on purpose"], answer: 1,
      why: "*Casualmente* is by chance. For casually, say *de manera informal*." },
    { q: "What does *precisamente hoy* add?", es: "Precisamente hoy no puedo, tengo cita médica.",
      options: ["Today of all days", "Only this morning", "Early today"], answer: 0,
      why: "*Precisamente hoy* points at today as the worst possible day." },
    { q: "What is she asking for?", es: "Necesito ayuda, concretamente con las cifras.",
      options: ["Help with every single thing", "No help, not right now", "Help with the figures"], answer: 2,
      why: "*Concretamente* narrows a general request to the one thing she means." },
    { q: "Where is the café?", es: "El café está al final de la calle.",
      options: ["In the end, it's there", "At the end of the street", "At the start of the street"], answer: 1,
      why: "*Al final de* plus a place is the end of it. Without *de*, *al final* is in the end." },
    { q: "How does this story end?", es: "Total, que no fuimos a la boda.",
      options: ["They shrug and didn't go", "They give a long summary", "They start a new story"], answer: 0,
      why: "*Total, que* closes a story casually: so anyway." }
  ],
  yourTurn: [
    { en: "That's exactly why I didn't go.", es: "Precisamente por eso no fui.", accept: ["[Precisamente|Justamente|Justo] por eso no fui."] },
    { en: "I need help, specifically with the kitchen.", es: "Necesito ayuda, concretamente con la cocina.", accept: ["Necesito ayuda, [concretamente|en concreto] con la cocina."] },
    { en: "In the end it all worked out.", es: "Al final todo salió bien.", accept: [] },
    { en: "Today of all days I can't.", es: "Precisamente hoy no puedo.", accept: ["[Justamente|Justo] hoy no puedo."] }
  ],
  translate: [
    { en: "That's just what I wanted to talk to you about. (to a friend)", es: "Justamente de eso quería hablarte.", accept: ["[Justamente|Precisamente|Justo] de eso quería hablarte.", "[Justamente|Precisamente|Justo] de eso te quería hablar."] },
    { en: "By coincidence, we ended up in the same line.", es: "Casualmente, terminamos en la misma fila.", accept: ["[Casualmente|Por casualidad], [terminamos|quedamos] en la misma fila."] },
    { en: "In short, it was a very long day.", es: "En resumen, fue un día muy largo.", accept: [] },
    { en: "So anyway, we didn't go.", es: "Total, que no fuimos.", accept: [] },
    { en: "I wanted to talk to you about the contract, specifically about the price. In short, it seems very high to me. (to a friend)", es: "Quería hablarte del contrato, concretamente del precio. En resumen, me parece muy alto.", accept: ["Quería hablarte del contrato, en concreto del precio. En resumen, me parece muy alto.", "Te quería hablar del contrato, [concretamente|en concreto] del precio. En resumen, me parece muy alto."] },
    { en: "Frankly, I don't understand why we have to redo the report.", es: "Francamente, no entiendo por qué hay que repetir el informe.", accept: ["Francamente, no entiendo por qué [hay que|tenemos que] [repetir|volver a hacer|rehacer] el informe."] }
  ],
  register: [
    { es: "Total, que no fuimos.", en: "So anyway, we didn't go.", when: "with friends, closing a story with a shrug" },
    { es: "Al final no fuimos.", en: "In the end we didn't go.", when: "anywhere, saying how it turned out" },
    { es: "En resumen, no fue posible asistir.", en: "In short, it wasn't possible to attend.", when: "in a work email, summing up" },
    { es: "En síntesis, el proyecto se retrasó por falta de presupuesto.", en: "In summary, the project was delayed for lack of budget.", when: "in a report, at the very end" }
  ],
  personal: {
    prompt: "Tell a friend about something that went wrong this week. Pinpoint the reason with *precisamente*, and close the story with *al final* or *en resumen*.",
    constraints: [
      { type: "containsAny", words: ["precisamente", "justamente", "concretamente", "en concreto"], label: "a pinpoint: *precisamente* or *concretamente*" },
      { type: "containsAny", words: ["al final", "en resumen", "total, que", "total que"], label: "a close: *al final*, *en resumen* or *total, que*" }
    ],
    model: "Llegué tarde a la entrevista, precisamente el día que salí temprano. Al final me atendieron, y todo salió bien."
  },
  pitfalls: [
    "*Casualmente* is by coincidence, a false friend for casually.",
    "*Al final de* plus a place is a location; *al final* alone is in the end."
  ]
},

"nt-importancia-normalidad-b2": {
  source: "merged",
  hook: {
    line: "Your friends are planning a reunion dinner in a group chat. Some of them don't mind the details, one approves the plan, and one is upset about something small. The words for what matters and what doesn't do all the work.",
    es: "Carolina: ¿Nos vemos el viernes o el sábado?\nAndrés: A mí me da igual el día, pero el lugar sí me importa.\nLuisa: Me parece bien el sábado. Por lo general, los viernes salgo tarde del trabajo.\nCarolina: Daniel dice que no lo invitamos a tiempo.\nAndrés: No le des importancia, fue un malentendido.",
    en: "Carolina: Shall we meet on Friday or Saturday?\nAndrés: I don't mind the day, but the place does matter to me.\nLuisa: Saturday is fine by me. As a rule, on Fridays I leave work late.\nCarolina: Daniel says we didn't invite him in time.\nAndrés: Don't make a big deal of it, it was a misunderstanding."
  },
  examples: [
    { es: "Me da lo mismo el restaurante, pero yo no puedo manejar de noche porque no veo bien.", en: "The restaurant is all the same to me, but I can't drive at night because I don't see well." },
    { es: "La seguridad es fundamental en este trabajo; el uniforme, en cambio, es algo secundario.", en: "Safety is essential in this job; the uniform, on the other hand, is something secondary." },
    { es: "La reunión se desarrolló con normalidad, aunque al principio hubo problemas con la conexión.", en: "The meeting went ahead normally, although at first there were problems with the connection." }
  ],
  rule: "Two answers that sound close in English do different jobs.\n*Me da igual* or *me da lo mismo*: I have no preference between the options.\n*Me parece bien*: I approve of the plan.\nSay *me da igual* to someone's plan and it can sound as if you don't care about them.\nBoth work like *gustar*: *A Luisa le da igual el día.*\nTo make something matter, you give it importance: *darle importancia a algo*, often as comfort: *No le des importancia.* *No tiene importancia.*\nRanking: *fundamental* or *básico* against *secundario*.\nWhat usually happens: *por lo general*, *por norma*. What went smoothly, once: *con normalidad*.",
  readAndPick: [
    { q: "A friend proposes Saturday. What does Luisa's reply tell her?", es: "Me parece bien el sábado.",
      options: ["She approves", "She doesn't care", "She can't go"], answer: 0,
      why: "*Me parece bien* approves the plan. *Me da igual* would only say she has no preference." },
    { q: "Does Andrés care about the place?", es: "A mí me da igual el día, pero el lugar sí me importa.",
      options: ["Not at all", "Yes, he does", "Only the day"], answer: 1,
      why: "*Me da igual* covers the day only; the *sí* in *sí me importa* marks the place as different." },
    { q: "What is Andrés telling Carolina?", es: "No le des importancia, fue un malentendido.",
      options: ["To phone Daniel now", "To say sorry to him", "To let it go"], answer: 2,
      why: "*No le des importancia* is comfort: it was small, don't make a big deal of it." },
    { q: "How often does Luisa leave work late on Fridays?", es: "Por lo general, los viernes salgo tarde.",
      options: ["Never", "Usually", "Only once"], answer: 1,
      why: "*Por lo general* is what usually happens, with room for exceptions." },
    { q: "What went smoothly?", es: "La reunión se desarrolló con normalidad.",
      options: ["The meeting", "Every meeting", "The journey"], answer: 0,
      why: "*Con normalidad* says one event went as expected, with no trouble." }
  ],
  yourTurn: [
    { en: "I don't mind the time.", es: "Me da igual la hora.", accept: ["Me da lo mismo la hora."] },
    { en: "Saturday is fine by me.", es: "Me parece bien el sábado.", accept: ["El sábado me parece bien."] },
    { en: "Don't make a big deal of it, it was a misunderstanding. (to a friend)", es: "No le des importancia, fue un malentendido.", accept: [] },
    { en: "That doesn't matter.", es: "Eso no tiene importancia.", accept: ["Eso no importa."] },
    { en: "Safety is essential in this job.", es: "La seguridad es fundamental en este trabajo.", accept: ["La seguridad es [fundamental|básica|esencial] en este trabajo."] }
  ],
  translate: [
    { en: "The price doesn't matter to my dad.", es: "A mi papá le da igual el precio.", accept: ["A mi papá le da [igual|lo mismo] el precio."] },
    { en: "You attach too much importance to what people say. (to a friend)", es: "Le das demasiada importancia a lo que dice la gente.", accept: [] },
    { en: "As a rule, I don't answer emails on Sundays.", es: "Por lo general, no respondo correos los domingos.", accept: ["[Por lo general|Por norma|Normalmente], no [respondo|contesto] correos los domingos."] },
    { en: "Everything went completely smoothly.", es: "Todo transcurrió con total normalidad.", accept: ["Todo [transcurrió|se desarrolló] con total normalidad."] },
    { en: "Is it all the same to you if we close early? It's a secondary detail, but the boss asked about it. (to a friend)", es: "¿Te da igual si cerramos temprano? Es un detalle secundario, pero el jefe preguntó por eso.", accept: ["¿Te da [igual|lo mismo] si cerramos temprano? Es un detalle secundario, pero el jefe preguntó por eso."] },
    { en: "It matters a lot to me that you tell me the truth. (to a friend)", es: "Para mí tiene mucha importancia que me digas la verdad.", accept: ["Para mí es muy importante que me digas la verdad.", "Me importa mucho que me digas la verdad."] }
  ],
  register: [
    { es: "Me da igual.", en: "I don't mind.", when: "with friends, when you truly have no preference" },
    { es: "Me parece bien.", en: "That's fine by me.", when: "to say yes to someone's plan, warmly" },
    { es: "Como prefieras.", en: "Whatever you prefer.", when: "to leave the choice to the other person kindly" },
    { es: "No tengo ninguna preferencia.", en: "I have no preference at all.", when: "at work or in a formal reply" }
  ],
  personal: {
    prompt: "Someone has suggested a plan for this weekend. Approve one part of it, say what you honestly don't mind, and tell them not to worry about something small.",
    constraints: [
      { type: "containsWord", word: "me parece bien", label: "approval: *me parece bien*" },
      { type: "containsAny", words: ["me da igual", "me da lo mismo"], label: "no preference: *me da igual*" },
      { type: "containsAny", words: ["no le des importancia", "no tiene importancia", "no le dé importancia"], label: "comfort: *no le des importancia* or *no tiene importancia*" }
    ],
    model: "Me parece bien ir al cine el domingo. Me da igual la película. Y lo de la reserva no tiene importancia."
  },
  pitfalls: [
    "*Me da igual* to a friend's plan can sound like you don't care about the friend; *me parece bien* says yes.",
    "In *le das importancia a*, the *le* stays even when you name the thing.",
    "*Por norma* allows exceptions; *con normalidad* is about one event going smoothly."
  ]
},

"nt-generalidad-especificidad-b2": {
  source: "merged",
  hook: {
    line: "A supplier emails you a vague offer: soon, a good price, some units. Your boss wants details. Your reply asks for the specifics without sounding rude, and then you warn a colleague not to judge every supplier by this one.",
    es: "Gracias por la propuesta. En general nos interesa, pero necesito que concretemos algunos puntos.\nEn concreto, ¿cuántas unidades pueden entregar, y en qué fecha?\nCada pedido es particular, así que necesitamos un precio para este caso.\nFelipe, no generalices: no todos los proveedores son tan imprecisos.",
    en: "Thank you for the proposal. In general we're interested, but I need us to pin down a few points.\nSpecifically, how many units can you deliver, and on what date?\nEach order is particular, so we need a price for this case.\nFelipe, don't generalize: not all suppliers are so vague."
  },
  examples: [
    { es: "Hablaron mucho de plata en la reunión, pero al final nadie concretó la cantidad exacta.", en: "They talked a lot about money at the meeting, but in the end nobody pinned down the exact amount." },
    { es: "Por lo general el clima aquí es templado, pero en concreto este mes ha llovido muchísimo.", en: "Generally the weather here is mild, but specifically this month it has rained a huge amount." },
    { es: "Mi hijo toma clases particulares de matemáticas, porque en el colegio van muy rápido.", en: "My son takes private maths lessons, because at school they go very fast." }
  ],
  rule: "*Concretar* is to turn vague into specific: a date, an amount, a name. *Necesito que concretemos la fecha.* *¿Puedes concretar un poco más?*\nTo ask for the detail: *en concreto* or *concretamente*: *En concreto, ¿qué propone?*\nTo go wide: *en general*, *por lo general*, *en términos generales*.\n*Generalizar* usually sounds like a criticism: *No generalices.*\n*Particular* is one case: *cada caso es particular*. With classes, a school or a car, it means private: *clases particulares*. It never means fussy, which is *exigente* or *quisquilloso*.\n*Determinado* also picks out one: *en un momento determinado*.",
  readAndPick: [
    { q: "What does the writer want from the supplier?", es: "Necesito que concretemos algunos puntos.",
      options: ["More general ideas", "Specifics", "A new offer letter"], answer: 1,
      why: "*Concretar* turns something vague into dates, amounts and names." },
    { q: "What kind of classes does he take?", es: "Toma clases particulares de inglés.",
      options: ["Private lessons", "Strange lessons", "Fussy lessons"], answer: 0,
      why: "With classes, *particular* means private, one to one. It never means fussy." },
    { q: "How does *no generalices* sound?", es: "No generalices, no todos piensan igual.",
      options: ["Like warm praise", "Like a real question", "Like a criticism"], answer: 2,
      why: "*Generalizar* usually points at someone making sweeping claims." },
    { q: "What does *en concreto* do here?", es: "En general llueve poco, pero en concreto este mes ha llovido muchísimo.",
      options: ["Widens the claim", "Narrows it down", "Contradicts it"], answer: 1,
      why: "*En concreto* moves from the weather in general to this one month." },
    { q: "What is she asking for?", es: "¿Cómo así? ¿Puedes concretar un poco más?",
      options: ["More detail", "Less detail", "A short break"], answer: 0,
      why: "*¿Cómo así?* and *concretar* both ask for specifics." }
  ],
  yourTurn: [
    { en: "I need us to pin down the date.", es: "Necesito que concretemos la fecha.", accept: [] },
    { en: "Can you be a bit more specific? (to a friend)", es: "¿Puedes concretar un poco más?", accept: ["¿Puedes ser un poco más [concreto|concreta|específico|específica]?"] },
    { en: "Don't generalize, not everyone thinks the same. (to a friend)", es: "No generalices, no todos piensan igual.", accept: ["No generalices, no todos piensan [igual|lo mismo]."] },
    { en: "Specifically, what do you propose? (polite)", es: "En concreto, ¿qué propone usted?", accept: ["[En concreto|Concretamente], ¿qué propone (usted)?"] }
  ],
  translate: [
    { en: "Each case is particular and deserves its own analysis.", es: "Cada caso es particular y merece su propio análisis.", accept: [] },
    { en: "They talked about money, but nobody pinned down the amount.", es: "Hablaron de plata, pero nadie concretó la cantidad.", accept: ["Hablaron de [plata|dinero], pero nadie concretó la [cantidad|cifra]."] },
    { en: "My daughter takes private English lessons.", es: "Mi hija toma clases particulares de inglés.", accept: [] },
    { en: "Generally, the weather here is mild.", es: "Por lo general, el clima aquí es templado.", accept: ["[Por lo general|En general|Generalmente], el clima aquí es templado.", "[Por lo general|En general|Generalmente], aquí el clima es templado."] },
    { en: "In general we're interested, but we need to pin down a few things. Specifically, how many units can you deliver? (polite)", es: "En general nos interesa, pero necesitamos concretar algunas cosas. En concreto, ¿cuántas unidades puede entregar?", accept: ["En general nos interesa, pero necesitamos concretar algunas cosas. [En concreto|Concretamente], ¿cuántas unidades puede (usted) entregar?"] },
    { en: "Especially in the afternoon, the traffic gets worse.", es: "Especialmente por la tarde, el tráfico empeora.", accept: ["[Especialmente|Sobre todo] por la tarde, el [tráfico|trancón] empeora."] }
  ],
  register: [
    { es: "¿Cómo así?", en: "What do you mean?", when: "in Colombia, with friends, asking for more detail" },
    { es: "¿Puedes concretar un poco más?", en: "Can you be a bit more specific?", when: "with a colleague you call tú" },
    { es: "En concreto, ¿qué propone usted?", en: "Specifically, what do you propose?", when: "in a meeting with a client or a boss" },
    { es: "Le agradecería que concretara la fecha de entrega.", en: "I'd be grateful if you could specify the delivery date.", when: "in a formal email to a supplier" }
  ],
  personal: {
    prompt: "Think of a plan you keep leaving vague, at work or with friends. Write one line asking someone to pin it down, and one line that asks for a specific detail.",
    constraints: [
      { type: "containsAny", words: ["concretar", "concretemos", "concretes", "concretó", "concrete "], label: "*concretar*: *necesito que concretemos...*" },
      { type: "containsAny", words: ["en concreto", "concretamente"], label: "a specific question: *en concreto* or *concretamente*" }
    ],
    model: "Mariana, necesito que concretemos la fecha del viaje. En concreto, ¿salimos el viernes o el sábado?"
  },
  pitfalls: [
    "*Particular* never means fussy: that is *exigente* or *quisquilloso*. With classes, it means private.",
    "*Generalizar* sounds like a criticism, not a neutral way to state something broadly."
  ]
},

"nt-cualidad-general-b2": {
  source: "merged",
  hook: {
    line: "You are selling a sofa on a marketplace site, and buyers keep asking the same three things: what it is like, what it is made up of and what comes with it. A good listing answers before they ask.",
    es: "Vendo un sofá cama de tres puestos, de color gris oscuro.\nSe caracteriza por su tela resistente, ideal para casas con niños o mascotas.\nEl juego se compone de un sofá y dos cojines azul marino.\nLa entrega consiste en llevarlo hasta su casa, sin costo, en el norte de Bogotá.",
    en: "I'm selling a three-seat sofa bed, dark grey in colour.\nIt's characterised by its tough fabric, ideal for homes with children or pets.\nThe set is made up of a sofa and two navy blue cushions.\nDelivery consists of taking it to your home, free of charge, in the north of Bogotá."
  },
  examples: [
    { es: "El edificio se caracteriza por su fachada de ladrillo y por sus ventanas muy altas.", en: "The building is characterised by its brick façade and its very tall windows." },
    { es: "El proyecto consiste en restaurar la fachada sin cambiar nada del interior del edificio.", en: "The project consists of restoring the façade without changing anything inside the building." },
    { es: "La Candelaria forma parte del centro histórico de Bogotá y pertenece a la localidad diecisiete.", en: "La Candelaria is part of Bogotá's historic centre and belongs to district seventeen." }
  ],
  rule: "Four frames describe a thing precisely, each with its own small word.\n*Se caracteriza por*: what makes it stand out. *Se caracteriza por su tela.*\n*Se compone de* or *está compuesto por*: its parts. *El juego se compone de un sofá y dos cojines.*\n*Consiste en*: what it involves. *La entrega consiste en llevarlo.*\n*Forma parte de* or *pertenece a*: where it belongs. In Colombia also *hace parte de*.\nFor colour, size or shape, *ser de*: *es de color gris*, *es de tamaño mediano*.\nA shade in two words never changes: *cojines azul marino*, *paredes verde claro*. A colour in one word agrees: *cojines azules*.",
  readAndPick: [
    { q: "What is the set made up of?", es: "El juego se compone de un sofá y dos cojines.",
      options: ["Just one sofa bed", "Sofa plus two cushions", "Two sofas and a big table"], answer: 1,
      why: "*Se compone de* lists the parts." },
    { q: "Why doesn't *azul marino* change to *azules marinos*?", es: "Tengo dos cojines azul marino.",
      options: ["Two-word shades stay fixed", "Cushion is a singular word", "It is simply a typo"], answer: 0,
      why: "A shade made of two words stays as it is: *azul marino*, *verde claro*." },
    { q: "What does *consiste en* tell you?", es: "La entrega consiste en llevarlo hasta su casa.",
      options: ["What it's made of", "What it will cost you", "What it involves"], answer: 2,
      why: "*Consiste en* says what something involves, not what it is made of." },
    { q: "What stands out about the building?", es: "El edificio se caracteriza por su fachada de ladrillo.",
      options: ["Its great age", "Its brick front", "Its very low price"], answer: 1,
      why: "*Se caracteriza por* names the trait that sets it apart." },
    { q: "Where does she belong?", es: "Hace parte del grupo de lectura del barrio.",
      options: ["She's a member of it", "She runs it alone", "She left it last year"], answer: 0,
      why: "*Hacer parte de* is the Colombian *formar parte de*: she is a member." }
  ],
  yourTurn: [
    { en: "The building is characterised by its brick façade.", es: "El edificio se caracteriza por su fachada de ladrillo.", accept: [] },
    { en: "The committee is made up of five members.", es: "El comité se compone de cinco miembros.", accept: ["El comité está compuesto [por|de] cinco miembros."] },
    { en: "I want some light blue chairs.", es: "Quiero unas sillas azul claro.", accept: [] },
    { en: "I'm part of the sales team.", es: "Formo parte del equipo de ventas.", accept: ["[Formo|Hago] parte del equipo de ventas.", "Pertenezco al equipo de ventas."] }
  ],
  translate: [
    { en: "The project consists of restoring the façade.", es: "El proyecto consiste en restaurar la fachada.", accept: [] },
    { en: "It's orange in colour and large in size.", es: "Es de color naranja y de tamaño grande.", accept: ["Es de color naranja, de tamaño grande."] },
    { en: "My car is dark grey.", es: "Mi carro es gris oscuro.", accept: ["Mi carro es (de color) gris oscuro."] },
    { en: "They aren't part of the family.", es: "Ellos no forman parte de la familia.", accept: ["(Ellos) no [forman|hacen] parte de la familia."] },
    { en: "I'm selling a dark grey sofa bed. It's made up of a sofa and two navy blue cushions, and delivery is free.", es: "Vendo un sofá cama gris oscuro. Se compone de un sofá y dos cojines azul marino, y la entrega es gratis.", accept: ["Vendo un sofá cama (de color) gris oscuro. [Se compone de|Está compuesto por] un sofá y dos cojines azul marino, y la entrega es [gratis|gratuita|sin costo]."] },
    { en: "This species is characterised by its small size.", es: "Esta especie se caracteriza por su tamaño reducido.", accept: ["Esta especie se caracteriza por su tamaño [reducido|pequeño]."] }
  ],
  register: [
    { es: "Es gris oscuro, con dos cojines.", en: "It's dark grey, with two cushions.", when: "in conversation, describing it plainly" },
    { es: "Se compone de un sofá y dos cojines.", en: "It's made up of a sofa and two cushions.", when: "in a listing or a written description" },
    { es: "Se caracteriza por su resistencia.", en: "It stands out for how tough it is.", when: "in a catalogue, a report or a review" },
    { es: "Hace parte del equipo.", en: "She's part of the team.", when: "in Colombia, in everyday talk" }
  ],
  personal: {
    prompt: "Describe something you own or a place you know, for a listing or a guide: what makes it stand out, what it is made up of or involves, and its colour.",
    constraints: [
      { type: "containsAny", words: ["se caracteriza por", "se caracterizan por"], label: "what stands out: *se caracteriza por*" },
      { type: "containsAny", words: ["se compone de", "se componen de", "está compuesto", "consiste en", "forma parte de", "hace parte de"], label: "its parts or what it involves: *se compone de* or *consiste en*" },
      { type: "regex", pattern: "(claro|oscuro|marino|de color)", label: "a colour with a shade, or *de color...*" }
    ],
    model: "Mi bicicleta se caracteriza por su peso: es muy liviana. Se compone de un marco de aluminio y dos llantas negras, y es azul oscuro."
  },
  pitfalls: [
    "*Paredes verdes claras* changes a fixed shade: it is *paredes verde claro*.",
    "*Consiste de* mixes two frames: *consiste en*, but *se compone de*.",
    "*Se caracteriza por* is for what really sets it apart, not for any trait at all."
  ]
},

"gr-subordinadas-sustantivas-b2": {
  source: "merged",
  hook: {
    line: "Your mother comes back from the doctor and texts you the whole visit. Some of what the doctor said was a fact, some was an instruction, and one thing the doctor never said at all. The verb after *que* tells you which is which.",
    es: "La doctora me dijo que era una infección leve.\nTambién me dijo que tomara mucha agua y que descansara.\nMe recomendó que no fuera a trabajar mañana.\nPero no dijo que fuera grave, así que tranquilo.\nResulta que tu tía tenía lo mismo la semana pasada.",
    en: "The doctor told me it was a mild infection.\nShe also told me to drink lots of water and to rest.\nShe recommended that I not go to work tomorrow.\nBut she didn't say it was serious, so don't worry.\nIt turns out your aunt had the same thing last week."
  },
  examples: [
    { es: "Me advirtió que la carretera estaba cerrada y me pidió que no saliera de noche.", en: "He warned me that the road was closed, and he asked me not to leave at night." },
    { es: "Te recomiendo que hables con un abogado antes de firmar cualquier documento con esa empresa.", en: "I recommend that you talk to a lawyer before signing any document with that company." },
    { es: "No vi que estuviera enojada; si no, le habría preguntado qué le pasaba.", en: "I saw no sign that she was angry; otherwise, I would have asked her what was wrong." }
  ],
  rule: "The verb in front decides the verb after *que*.\nPassing on a fact keeps the ordinary form: *Me dijo que era leve.* *Resulta que tenía lo mismo.*\nPushing someone to act takes the subjunctive: *Te recomiendo que descanses.* *Me pidió que no fuera.* After a past verb, the *-ra* form.\n*Decir*, *advertir*, *recordar* and *insistir en* do both: *Me dijo que era leve*, a fact; *Me dijo que tomara agua*, an instruction.\nAfter *no dije*, *no vi* or *no oí*, the subjunctive means nobody vouches for it: *No dije que fuera grave.* Keep the ordinary form if it was true and someone missed it.\n*Falta que* and *basta con que* take the subjunctive: *Basta con que lo intentes.*",
  readAndPick: [
    { q: "Was this a fact or an instruction?", es: "La doctora me dijo que tomara mucha agua.",
      options: ["A fact about her", "An instruction", "A question to her"], answer: 1,
      why: "*Tomara* is the subjunctive: *dijo que* pushes her to act, it does not report a fact." },
    { q: "Was it dangerous?", es: "Me advirtió que era peligroso.",
      options: ["Yes, he said so", "He told me not to go", "He didn't know"], answer: 0,
      why: "The ordinary *era* passes on a fact: it was dangerous." },
    { q: "Did the doctor say it was serious?", es: "No dijo que fuera grave.",
      options: ["Yes, but quietly", "She said it twice", "No, she never did"], answer: 2,
      why: "With *no dijo*, the subjunctive *fuera* means nobody claimed it." },
    { q: "Who will rest?", es: "Te recomiendo que descanses más.",
      options: ["I will", "You will", "She will"], answer: 1,
      why: "*Descanses* ends in *-s*: you. The advice is about the other person's action." },
    { q: "What is enough?", es: "Basta con que lo intentes.",
      options: ["That you try", "That you win", "That you pay"], answer: 0,
      why: "*Basta con que* takes the subjunctive: trying is all it takes." },
    { q: "What does *resulta que* bring in?", es: "Resulta que tu tía tenía lo mismo.",
      options: ["A fact that turned up", "A hope for the future", "A polite instruction"], answer: 0,
      why: "*Resulta que* brings in a fact, so the ordinary *tenía*." }
  ],
  yourTurn: [
    { en: "He warned me not to go.", es: "Me advirtió que no fuera.", accept: [] },
    { en: "He warned me it was dangerous.", es: "Me advirtió que era peligroso.", accept: [] },
    { en: "I recommend that you talk to a lawyer. (to a friend)", es: "Te recomiendo que hables con un abogado.", accept: ["Te recomiendo hablar con un abogado."] },
    { en: "I didn't say it was urgent.", es: "No dije que fuera urgente.", accept: [] },
    { en: "She reminded me to call my grandmother.", es: "Me recordó que llamara a mi abuela.", accept: [] }
  ],
  translate: [
    { en: "She insisted that we pay.", es: "Insistió en que pagáramos.", accept: ["Insistió en que pagáramos nosotros."] },
    { en: "He reminded me that the meeting was at three.", es: "Me recordó que la reunión era a las tres.", accept: [] },
    { en: "I advise you all not to sign anything.", es: "Les aconsejo que no firmen nada.", accept: [] },
    { en: "It's enough for you to try. (to a friend)", es: "Basta con que lo intentes.", accept: [] },
    { en: "The doctor told me it was a mild infection. She told me to rest and recommended that I not go to work.", es: "La doctora me dijo que era una infección leve. Me dijo que descansara y me recomendó que no fuera a trabajar.", accept: [] },
    { en: "I didn't see anyone arrive.", es: "No vi que llegara nadie.", accept: ["No vi llegar a nadie."] }
  ],
  register: [
    { es: "Me dijo que descansara.", en: "She told me to rest.", when: "in conversation, passing on an instruction" },
    { es: "Te recomiendo que descanses.", en: "I recommend that you rest.", when: "to a friend, as advice" },
    { es: "Le aconsejo que descanse.", en: "I advise you to rest.", when: "to someone you call usted, like a patient" },
    { es: "Se recomienda guardar reposo durante tres días.", en: "Rest for three days is recommended.", when: "in a written medical note or a leaflet" }
  ],
  personal: {
    prompt: "Think of advice someone gave you recently: a doctor, a parent or a boss. Pass on one fact they told you and one thing they told you to do.",
    constraints: [
      { type: "regex", pattern: "(dijo|advirti[oó]|record[oó]|explic[oó]) que", label: "a fact passed on: *me dijo que* and the ordinary form" },
      { type: "regex", pattern: "(dijo|pidi[oó]|recomend[oó]|aconsej[oó]|record[oó]|insisti[oó] en) que (no )?(me |te |le |nos |les |lo |la )?[a-záéíóúñ]+(ara|iera|aras|ieras|aran|ieran|áramos|iéramos)\\b", label: "an instruction: *me pidió que* or *me dijo que* and the *-ra* form" }
    ],
    model: "Mi jefe me dijo que el proyecto era urgente. Me pidió que terminara el informe antes del viernes."
  },
  pitfalls: [
    "*Me dijo que tomo agua* is the slip: an instruction takes *tomara*.",
    "*Te recomiendo que descansas* keeps the ordinary form; advice needs *descanses*.",
    "*No dije que era grave* and *no dije que fuera grave* are both Spanish: the first admits it was, the second claims nothing."
  ]
},

"task-b2-argumento": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: 350 words or more on a question people really disagree about. Four moves carry it: a thesis, evidence with its source, the strongest objection answered, and a limit you honestly grant. The model is about cars in the city.",
    es: "Tesis: Las ciudades deberían reducir el espacio dedicado al carro particular.\nEvidencia: Según datos de la propia alcaldía, la mayor parte de las calles se usa para carros que llevan a una sola persona.\nObjeción: Se objeta, con razón, que esto perjudica a quienes viven lejos y no tienen otra opción.\nRespuesta: Es un problema real; sin embargo, la solución no son más carros, sino mejor transporte público.\nReserva: Ahora bien, quitar espacio al carro solo funciona si el transporte mejora al mismo tiempo.",
    en: "Thesis: Cities should reduce the space given over to private cars.\nEvidence: According to the city government's own data, most of the streets are used for cars that carry just one person.\nObjection: It is objected, rightly, that this harms those who live far away and have no other option.\nAnswer: It's a real problem; however, the solution isn't more cars, but better public transport.\nReservation: That said, taking space from cars only works if transport improves at the same time."
  },
  examples: [
    { es: "Según un estudio de la universidad, el sesenta por ciento de los estudiantes llega en bus.", en: "According to a study by the university, sixty percent of the students arrive by bus." },
    { es: "Si bien es cierto que cuesta mucho dinero, el beneficio para la ciudad compensa ese gasto.", en: "While it's true that it costs a lot of money, the benefit for the city makes up for that expense." },
    { es: "Ahora bien, conviene no confundir la causa con el síntoma cuando se habla de tráfico.", en: "That said, it's best not to confuse the cause with the symptom when talking about traffic." }
  ],
  rule: "Four moves, in order, each with its Spanish.\nThe thesis, early and plain: *Voy a defender que...* or *Las ciudades deberían...*\nEvidence, with where it comes from: *Según datos de...* *Un estudio de... muestra que...* Name the source; *todo el mundo sabe* is not one.\nThe strongest objection, stated fairly, then answered: *Se objeta, con razón, que... Es un problema real; sin embargo,...*\nA limit you really hold: *Ahora bien,* *Dicho esto,* *Si bien es cierto que...*\nJoin it all with at least three markers of contrast: *sin embargo*, *a pesar de*, *en cambio*, *aunque*.\nA close with no limit reads like a leaflet.",
  readAndPick: [
    { q: "Which move is this?", es: "Según un estudio de la universidad, el sesenta por ciento llega en bus.",
      options: ["The writer's thesis", "Evidence and source", "The closing limit"], answer: 1,
      why: "*Según un estudio de* names where the figure comes from: that is evidence." },
    { q: "How does the writer treat the objection?", es: "Se objeta, con razón, que esto perjudica a quienes viven lejos.",
      options: ["As fair", "As silly", "As off topic"], answer: 0,
      why: "*Con razón* grants that the objection is fair before answering it." },
    { q: "What does *si bien* mean here?", es: "Si bien es cierto que cuesta mucho, compensa.",
      options: ["If it goes well", "While, granted", "As soon as"], answer: 1,
      why: "*Si bien* is a formal although: it grants a point before the main claim." },
    { q: "Where does *ahora bien* belong in the essay?", es: "Ahora bien, quitar espacio al carro solo funciona si el transporte mejora.",
      options: ["In the title", "In the opening line", "In the reservation"], answer: 2,
      why: "*Ahora bien* adds the honest limit, near the end." },
    { q: "Why is this weak as evidence?", es: "Todo el mundo sabe que el tráfico es peor.",
      options: ["It gives no source", "It's far too formal", "It has a wrong verb"], answer: 0,
      why: "*Todo el mundo sabe* points at nobody: an essay needs *según* and a name." }
  ],
  yourTurn: [
    { en: "According to a university study, most students arrive by bus.", es: "Según un estudio de la universidad, la mayoría de los estudiantes llega en bus.", accept: ["Según un estudio de la universidad, la mayoría de los estudiantes [llega|llegan] en bus."] },
    { en: "It is objected, rightly, that this harms those who live far away.", es: "Se objeta, con razón, que esto perjudica a quienes viven lejos.", accept: ["Se objeta, con razón, que esto perjudica a [quienes|los que] viven lejos."] },
    { en: "It's a real problem; however, the solution isn't more cars.", es: "Es un problema real; sin embargo, la solución no son más carros.", accept: ["Es un problema real[;|,|.] [sin embargo|Sin embargo], la solución no [son|es] más carros."] },
    { en: "That said, it's best not to confuse the cause with the symptom.", es: "Ahora bien, conviene no confundir la causa con el síntoma.", accept: ["[Ahora bien|Dicho esto], conviene no confundir la causa con el síntoma."] }
  ],
  translate: [
    { en: "Cities should reduce the space given over to private cars.", es: "Las ciudades deberían reducir el espacio dedicado al carro particular.", accept: ["Las ciudades deberían reducir el espacio dedicado a los carros particulares."] },
    { en: "While it's true that it costs a lot, the benefit makes up for it.", es: "Si bien es cierto que cuesta mucho, el beneficio lo compensa.", accept: ["Aunque es cierto que cuesta mucho, el beneficio lo compensa."] },
    { en: "A recent study shows that eighty percent of employees prefer to work from home.", es: "Un estudio reciente muestra que el ochenta por ciento de los empleados prefiere trabajar desde la casa.", accept: ["Un estudio reciente muestra que el ochenta por ciento de los empleados [prefiere|prefieren] trabajar desde (la) casa."] },
    { en: "Despite the cost, the measure is necessary.", es: "A pesar del costo, la medida es necesaria.", accept: ["A pesar del costo, la medida es [necesaria|imprescindible]."] },
    { en: "Some say working from home reduces productivity. However, according to the company's own data, sales rose last year. That said, it doesn't work the same for every team.", es: "Hay quienes dicen que el teletrabajo reduce la productividad. Sin embargo, según los datos de la propia empresa, las ventas subieron el año pasado. Dicho esto, no funciona igual para todos los equipos.", accept: ["Hay quienes dicen que el teletrabajo reduce la productividad. Sin embargo, según los datos de la propia empresa, las ventas [subieron|aumentaron] el año pasado. [Dicho esto|Ahora bien], no funciona igual para todos los equipos."] },
    { en: "Everybody knows it, but where does the figure come from?", es: "Todo el mundo lo sabe, pero ¿de dónde sale la cifra?", accept: ["Todo el mundo lo sabe, pero ¿de dónde [sale|viene] la cifra?"] }
  ],
  register: [
    { es: "Todo el mundo sabe que es así.", en: "Everybody knows it's like that.", when: "in a chat, never as evidence in an essay" },
    { es: "Según los datos de la alcaldía, el tráfico aumentó.", en: "According to the city government's data, traffic increased.", when: "in an essay, naming your source" },
    { es: "Un estudio reciente muestra que funciona.", en: "A recent study shows that it works.", when: "in writing, when you can say which study" },
    { es: "Si bien es cierto que cuesta, vale la pena.", en: "While it's true that it costs, it's worth it.", when: "in formal writing, granting a limit" }
  ],
  personal: {
    prompt: "Write the four moves of your own argument on a question you care about, one or two sentences each: the thesis, evidence with a source, the strongest objection answered, and a limit you grant.",
    constraints: [
      { type: "minSentences", n: 5, label: "five sentences or more" },
      { type: "containsAny", words: ["según", "un estudio", "los datos", "de acuerdo con"], label: "evidence with a source: *según* or *un estudio de*" },
      { type: "containsAny", words: ["se objeta", "se podría objetar", "se podría argumentar", "es cierto que"], label: "the objection: *se objeta, con razón, que*" },
      { type: "containsAny", words: ["ahora bien", "dicho esto", "si bien"], label: "a limit: *ahora bien*, *dicho esto* or *si bien*" },
      { type: "connectorFrom", class: "contraargumentativo", n: 2, label: "two markers of contrast, like *sin embargo* and *aunque*" }
    ],
    model: "Las empresas deberían permitir el teletrabajo dos días a la semana. Según una encuesta de mi universidad, la mayoría de los empleados trabaja mejor en casa. Se objeta, con razón, que es más difícil formar a la gente nueva. Sin embargo, eso se resuelve con días fijos en la oficina. Ahora bien, no funciona igual para todos los trabajos, aunque sí para muchos."
  },
  pitfalls: [
    "*Todo el mundo sabe que* is not evidence: name the source with *según*.",
    "An objection stated weakly is easy to answer and convinces nobody; state it at its strongest.",
    "Ending with no limit reads like a leaflet, not an argument."
  ]
}

};
