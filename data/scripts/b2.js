/* ============================================================================
 * TEACHING SCRIPTS, B2 units 1 to 4 (window.SCRIPTS_B2), keyed by lesson id.
 * Units b2-u44 (the ladder of agreeing, opining, softening and certainty),
 * b2-u45 (building an argument and the words that hold it together), b2-u46
 * (what didn't happen and what probably did: the compound subjunctives, the
 * guess inside the verb, need, lasting and causing) and b2-u47 (feelings at
 * the right strength, then degree, interest and verdicts): every lesson on
 * the path from COURSE_BANDS.B2 to the end of b2-u47 (days 353 to 396 when
 * this was written; the test reads the days from data/course.js).
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
 * are used here. The pluperfect subjunctive (hubiera hecho) and the -se twin
 * of the past subjunctive come with gr-pluscuamsubj-b2, the first day of
 * b2-u46: they are absent before it and used from it on, the -se forms
 * for reading only (accepted when typed, never asked for), since Colombia
 * says -ra. No dashes, no vosotros, Latin American Spanish (Colombia), the
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
},

/* ---- unit b2-u46 · What didn't happen, and what probably did -------------- */

"gr-pluscuamsubj-b2": {
  source: "merged",
  hook: {
    line: "Your friend Paula slept through the concert you had both waited months for, and the next morning she messages you. Every line looks back at a past that went the wrong way, and one small form carries all of it.",
    es: "Paula: ¡Qué rabia! Ojalá me hubieras llamado más temprano.\nTú: Te llamé tres veces. Pensé que ya habías salido.\nPaula: Si hubiera oído el celular, habría llegado a tiempo.\nTú: Nadie creía que te hubieras quedado dormida.\nPaula: La próxima vez pongo dos alarmas.",
    en: "Paula: How annoying! I wish you had called me earlier.\nYou: I called you three times. I thought you had already left.\nPaula: If I had heard my phone, I would have got there in time.\nYou: Nobody could believe you had overslept.\nPaula: Next time I'm setting two alarms."
  },
  examples: [
    { es: "Si me hubieras avisado con tiempo, te habría guardado una boleta en la primera fila.", en: "If you had let me know in time, I would have saved you a ticket in the front row." },
    { es: "Me sorprendió que los organizadores no hubieran avisado del cambio de horario hasta el último momento.", en: "I was surprised the organisers hadn't announced the change of time until the last minute." },
    { es: "Ojalá hubiéramos salido de la casa media hora antes; con el trancón no llegamos al principio.", en: "I wish we had left the house half an hour earlier; with the traffic jam we missed the start." }
  ],
  rule: "*Hubiera* plus a participle looks back at a past that is already closed.\nAfter a past feeling or doubt, it stands where *había* would: *Pensé que habías salido*, but *No creí que hubieras salido.* *Me sorprendió que no hubieran avisado.*\nAfter *si*, it imagines a past that never happened, and the other half takes *habría*: *Si hubiera oído el celular, habría llegado.* Never *habría* after *si*.\nAfter *ojalá*, it wishes too late: *Ojalá me hubieras llamado.*\nThe forms: *hubiera*, *hubieras*, *hubiera*, *hubiéramos*, *hubieran*, then the participle, which never changes.\nBooks and the news use a twin, *hubiese*, with the same meaning. Read it; say *hubiera*.",
  readAndPick: [
    { q: "Did Paula hear her phone?", es: "Si hubiera oído el celular, habría llegado a tiempo.",
      options: ["Yes, but too late", "No, she never did", "Yes, all three times"], answer: 1,
      why: "*Si hubiera oído* imagines what did not happen: she didn't hear it, so she didn't arrive." },
    { q: "What did the speaker believe at the time?", es: "No creí que hubieran vendido todas las boletas.",
      options: ["That some were left", "That all had gone", "That none were printed"], answer: 0,
      why: "*No creí que hubieran vendido* reports a past doubt: she thought tickets were still left." },
    { q: "Can this wish still come true?", es: "Ojalá me hubieras llamado más temprano.",
      options: ["Yes, if she calls tomorrow", "Only in theory", "No, it's too late"], answer: 2,
      why: "*Ojalá* with *hubiera* wishes about a closed past. *Ojalá me llames* would still be possible." },
    { q: "What does *hubiese* mean in this news line?", es: "Si el puente se hubiese cerrado antes, no habría habido heridos.",
      options: ["It will close very soon", "The same as hubiera", "It is closed today"], answer: 1,
      why: "*Hubiese* is the written twin of *hubiera*: if the bridge had been closed earlier." },
    { q: "Who hadn't given notice?", es: "Me sorprendió que no hubieran avisado.",
      options: ["I hadn't", "They hadn't", "None of us had"], answer: 1,
      why: "*Hubieran* ends in *-n*: they. Their silence came first, the surprise after it." },
    { q: "Is this wish about now or about then?", es: "Ojalá hubiera tenido más tiempo para prepararlo.",
      options: ["About right now", "About next week", "About back then"], answer: 2,
      why: "*Hubiera tenido* looks back. A wish about now would be *ojalá tuviera más tiempo*." }
  ],
  yourTurn: [
    { en: "I wish you had called me earlier. (to a friend)", es: "Ojalá me hubieras llamado más temprano.", accept: ["Ojalá (que) me hubieras llamado [más temprano|antes]."] },
    { en: "If I had heard my phone, I would have arrived on time.", es: "Si hubiera oído el celular, habría llegado a tiempo.", accept: ["Si [hubiera|hubiese] oído el [celular|teléfono], [habría|hubiera] llegado a tiempo.", "[Habría|Hubiera] llegado a tiempo si hubiera oído el [celular|teléfono]."] },
    { en: "I didn't think they had sold all the tickets.", es: "No creí que hubieran vendido todas las boletas.", accept: ["No [creí|pensé] que [hubieran|hubiesen] vendido todas las boletas."] },
    { en: "I was surprised that they hadn't let us know.", es: "Me sorprendió que no nos hubieran avisado.", accept: ["Me sorprendió que no nos [hubieran|hubiesen] avisado."] },
    { en: "I wish we hadn't sold the car.", es: "Ojalá no hubiéramos vendido el carro.", accept: ["Ojalá (que) no [hubiéramos|hubiésemos] vendido el carro."] }
  ],
  translate: [
    { en: "If you had told me, I would have gone with you. (to a friend)", es: "Si me hubieras dicho, habría ido contigo.", accept: ["Si me (lo) hubieras dicho, [habría|hubiera] ido contigo."] },
    { en: "Nobody thought she had left so early.", es: "Nadie pensó que se hubiera ido tan temprano.", accept: ["Nadie [pensó|creyó] que se [hubiera|hubiese] ido tan temprano."] },
    { en: "It bothered him that we hadn't invited him.", es: "Le molestó que no lo hubiéramos invitado.", accept: ["Le molestó que no lo [hubiéramos|hubiésemos] invitado."] },
    { en: "I wish I had studied more for the exam.", es: "Ojalá hubiera estudiado más para el examen.", accept: ["Ojalá (que) hubiera estudiado más para el examen."] },
    { en: "We arrived late to the concert. If we had left the house earlier, we would have seen the beginning. I wish we hadn't stopped to eat.", es: "Llegamos tarde al concierto. Si hubiéramos salido de la casa más temprano, habríamos visto el principio. Ojalá no hubiéramos parado a comer.", accept: ["Llegamos tarde al concierto. Si hubiéramos salido de (la) casa [más temprano|antes], [habríamos|hubiéramos] visto el principio. Ojalá no hubiéramos parado a comer."] },
    { en: "If it had rained, we would have stayed at home.", es: "Si hubiera llovido, nos habríamos quedado en la casa.", accept: ["Si hubiera llovido, nos [habríamos|hubiéramos] quedado en (la) casa."] }
  ],
  register: [
    { es: "Si hubiera sabido, hubiera venido.", en: "If I'd known, I'd have come.", when: "in everyday speech, with hubiera in both halves" },
    { es: "Si hubiera sabido, habría venido.", en: "If I had known, I would have come.", when: "anywhere, and the safe choice in writing" },
    { es: "Si lo hubiese sabido, habría venido.", en: "Had I known it, I would have come.", when: "in books, the news and formal letters" },
    { es: "De haberlo sabido, habría venido.", en: "Had I known, I would have come.", when: "in writing, a compact and formal version" }
  ],
  personal: {
    prompt: "Think of a plan from last year that went wrong. Write what would have happened if you had done one thing differently, and one wish about it.",
    constraints: [
      { type: "regex", pattern: "si (no )?(me |te |le |lo |la |nos |les |se )*(hubiera|hubieras|hubi[eé]ramos|hubieran|hubiese) [a-záéíóúñ]+(ado|ido|to|cho|so)\\b", label: "an if: *si hubiera* and a participle" },
      { type: "containsAny", words: ["habría", "habríamos", "habrías", "habrían"], label: "the result with *habría*" },
      { type: "regex", pattern: "ojal[aá] (que )?(no )?(me |te |le |lo |la |nos |les |se )*(hubiera|hubieras|hubi[eé]ramos|hubieran)", label: "a wish too late: *ojalá hubiera*" }
    ],
    model: "Si hubiera reservado el hotel en enero, habría pagado la mitad. Ojalá no hubiera esperado tanto."
  },
  pitfalls: [
    "*Si habría sabido* is English *if I would have known*: after *si*, always *hubiera*.",
    "*Ojalá tuviera tiempo* wishes about now; for yesterday, *ojalá hubiera tenido tiempo*.",
    "*Ojalá hubiera vino* uses the wrong piece: after *hubiera* comes the participle, *venido*."
  ]
},

"gr-condicional-compuesto-b2": {
  source: "merged",
  hook: {
    line: "A guest reviews a hotel in Cartagena, and the manager answers. Both of them talk about what would have happened, what someone promised would be done, and what they themselves would have done.",
    es: "Reseña: Habría sido más fácil avisar antes de cerrar la piscina.\nReseña: En la recepción nos dijeron que para las tres la habrían arreglado.\nReseña: Yo en su lugar habría ofrecido un descuento.\nRespuesta: Tiene razón. Nos habría gustado resolverlo ese mismo día.\nRespuesta: Con más personal, lo habríamos hecho.",
    en: "Review: It would have been easier to tell us before closing the pool.\nReview: At reception they told us they would have fixed it by three.\nReview: In your place I would have offered a discount.\nReply: You're right. We would have liked to solve it that same day.\nReply: With more staff, we would have done it."
  },
  examples: [
    { es: "Con un poco más de tiempo, habría revisado el informe otra vez antes de mandarlo al cliente.", en: "With a little more time, I would have checked the report again before sending it to the client." },
    { es: "Me dijo que para el viernes ya habría hablado con el jefe, pero todavía no lo ha hecho.", en: "She told me that by Friday she would have spoken to the boss, but she still hasn't done it." },
    { es: "Cuando llegamos a la finca ya se habrían ido, porque la casa estaba cerrada y oscura.", en: "When we got to the farm they must have already left, because the house was shut and dark." }
  ],
  rule: "*Habría* plus a participle is *would have*: *habría ido*, *habrías dicho*, *habríamos hecho*, *habrían visto*.\nIt does four jobs.\nWhat would have happened, with or without *si*: *Con más tiempo, lo habría revisado.* *Si hubiera podido, habría ido.*\nAdvice after the fact, and soft regret: *Yo en tu lugar habría llamado.* *Me habría gustado ir.*\nA promise reported from the past: *Dijo que para el viernes habría terminado.*\nA guess about a past before a past moment: *Cuando llegamos, ya se habrían ido.*\n*No*, *lo* and *me* go before *habría*: *No lo habría dicho.*\nAfter *si* it is *hubiera*; *habría* is the other half.",
  readAndPick: [
    { q: "Did the hotel offer a discount?", es: "Yo en su lugar habría ofrecido un descuento.",
      options: ["Yes, a big one", "No, it didn't", "Only to regulars"], answer: 1,
      why: "*Yo en su lugar habría* says what the guest would have done; the hotel didn't." },
    { q: "How does the speaker know they had left?", es: "Cuando llegamos, ya se habrían ido.",
      options: ["She's guessing", "She saw them leave", "They phoned her"], answer: 0,
      why: "*Se habrían ido* guesses from a past moment: the house was dark, so probably." },
    { q: "What did reception promise?", es: "Nos dijeron que para las tres la habrían arreglado.",
      options: ["Closed until three", "Fixed by three", "Fixed the next day"], answer: 1,
      why: "*Habrían arreglado* reports a promise: by three, the job would be done." },
    { q: "Did the manager solve it that day?", es: "Nos habría gustado resolverlo ese mismo día.",
      options: ["Yes, at once", "Yes, by noon the next day", "No, they didn't"], answer: 2,
      why: "*Nos habría gustado* is a soft regret: they would have liked to, and didn't." },
    { q: "Which word belongs after *si* here?", es: "Si ___ podido, habría ido.",
      options: ["habríamos", "había", "hubiera"], answer: 2,
      why: "After *si*, *hubiera*; *habría* belongs to the other half." }
  ],
  yourTurn: [
    { en: "I would have said no.", es: "Yo habría dicho que no.", accept: ["(Yo) [habría|hubiera] dicho que no."] },
    { en: "In your place I would have called the doctor. (to a friend)", es: "Yo en tu lugar habría llamado al médico.", accept: ["(Yo) en tu lugar habría llamado [al médico|a la médica|al doctor|a la doctora].", "Yo que tú habría llamado [al médico|al doctor]."] },
    { en: "We would have liked to go.", es: "Nos habría gustado ir.", accept: ["Nos hubiera gustado ir."] },
    { en: "He said he would have finished by Friday.", es: "Dijo que para el viernes habría terminado.", accept: ["Dijo que habría terminado para el viernes."] },
    { en: "I wouldn't have done it.", es: "No lo habría hecho.", accept: ["Yo no lo habría hecho.", "(Yo) no lo hubiera hecho."] }
  ],
  translate: [
    { en: "It would have been easier to let us know beforehand.", es: "Habría sido más fácil avisar antes.", accept: ["[Habría|Hubiera] sido más fácil avisar(nos) antes."] },
    { en: "What would you have done? (to a friend)", es: "¿Qué habrías hecho tú?", accept: ["¿Qué habrías hecho?", "¿Tú qué habrías hecho?", "¿Qué hubieras hecho (tú)?"] },
    { en: "With more staff, we would have solved it that same day.", es: "Con más personal, lo habríamos resuelto ese mismo día.", accept: ["Con más personal, lo [habríamos|hubiéramos] [resuelto|solucionado] ese mismo día."] },
    { en: "When I called, they must have already gone to bed.", es: "Cuando llamé, ya se habrían acostado.", accept: ["Cuando llamé, ya se habrían [acostado|ido a dormir]."] },
    { en: "I didn't go to the meeting. I would have liked to go, but I was sick. In my place, you would have stayed home too. (to a friend)", es: "No fui a la reunión. Me habría gustado ir, pero estaba enfermo. En mi lugar, tú también te habrías quedado en la casa.", accept: ["No fui a la reunión. Me [habría|hubiera] gustado ir, pero estaba [enfermo|enferma]. En mi lugar, tú también te [habrías|hubieras] quedado en (la) casa."] },
    { en: "If you had asked me, I would have helped you. (to a friend)", es: "Si me hubieras preguntado, te habría ayudado.", accept: ["Si me hubieras preguntado, te hubiera ayudado.", "Si me lo hubieras pedido, te [habría|hubiera] ayudado."] }
  ],
  register: [
    { es: "Yo habría llamado.", en: "I would have called.", when: "giving your view plainly, after the fact" },
    { es: "Yo en tu lugar habría llamado.", en: "In your place I would have called.", when: "advice to a friend, gently, once it's too late" },
    { es: "Me habría gustado que me llamaras.", en: "I would have liked you to call me.", when: "a soft complaint, at home or at work" },
    { es: "Habría sido conveniente informar con antelación.", en: "It would have been advisable to give notice in advance.", when: "in a formal email or a written complaint" }
  ],
  personal: {
    prompt: "Think of something a friend or colleague did recently that you would have done differently. Write what you would have done, and one thing you would have liked.",
    constraints: [
      { type: "regex", pattern: "(habr[ií]a|habr[ií]as|habr[ií]amos|habr[ií]an) [a-záéíóúñ]+(ado|ido|to|cho|so)\\b", label: "would have: *habría* and a participle" },
      { type: "containsAny", words: ["en tu lugar", "en su lugar", "yo que tú", "yo que usted"], label: "advice: *yo en tu lugar*" },
      { type: "containsAny", words: ["me habría gustado", "nos habría gustado", "me hubiera gustado", "nos hubiera gustado"], label: "a soft regret: *me habría gustado*" }
    ],
    model: "Yo en tu lugar habría hablado con la jefa antes de renunciar. Me habría gustado que me lo contaras."
  },
  pitfalls: [
    "*Si habría podido* is English *if I would have*: after *si*, *hubiera*.",
    "*Habría lo dicho* splits the pair: *lo* goes first, *lo habría dicho*.",
    "*Había ido* is had gone, a fact; *habría ido* is would have gone, and it never happened."
  ]
},

"gr-futuro-perfecto-b2": {
  source: "merged",
  hook: {
    line: "Your cousins are flying into Bogotá tonight and the family chat is waiting. Half the messages guess at what has probably happened by now; the other half look ahead to what will be done by a certain time.",
    es: "Mamá: Son las nueve. Ya habrán aterrizado, ¿no?\nPapá: No contestan. Se les habrá descargado el celular.\nMamá: O estarán haciendo la fila de migración.\nLaura: Tranquilos, para cuando lleguen a la casa, ya habremos hecho la comida.\nPapá: ¿Y dónde habré dejado las llaves del carro?",
    en: "Mom: It's nine. They'll have landed by now, won't they?\nDad: They're not answering. Their phone must have died.\nMom: Or they'll be standing in line at immigration.\nLaura: Relax, by the time they get to the house, we'll have made dinner.\nDad: And where could I have left the car keys?"
  },
  examples: [
    { es: "Para diciembre ya habremos terminado la obra del baño y podremos recibir a la familia.", en: "By December we'll have finished the work on the bathroom and we'll be able to have the family over." },
    { es: "No contesta el celular; se habrá quedado dormido después del turno de noche en el hospital.", en: "He's not answering his phone; he must have fallen asleep after the night shift at the hospital." },
    { es: "¿Quién habrá dejado la puerta abierta? Esta mañana yo la cerré con llave antes de salir.", en: "Who could have left the door open? This morning I locked it before going out." }
  ],
  rule: "*Habré* plus a participle does two jobs.\nA deadline ahead: done before a point still to come. *Para diciembre habremos terminado.* *Para cuando llegues, ya habré salido.*\nA guess about now: what has probably already happened. *Ya habrán aterrizado.* *Se habrá quedado dormido.* English says *must have*; the form alone carries the guess, with no *quizás*.\nThe forms: *habré*, *habrás*, *habrá*, *habremos*, *habrán*, then the participle, which never changes.\nIn a question it wonders: *¿Dónde habré dejado las llaves?*\n*Se quedó dormido* states it; *se habrá quedado dormido* guesses it.\nLooking back from a past moment, the guess moves to *habría*: *Cuando llamé, ya se habrían ido.*",
  readAndPick: [
    { q: "Does Mom know they've landed?", es: "Ya habrán aterrizado, ¿no?",
      options: ["Yes, they told her", "No, she's guessing", "They land tomorrow"], answer: 1,
      why: "*Habrán aterrizado* guesses about now. If she knew, she'd say *ya aterrizaron*." },
    { q: "When will dinner be made?", es: "Para cuando lleguen a la casa, ya habremos hecho la comida.",
      options: ["Before they arrive", "After they've arrived", "While they all eat"], answer: 0,
      why: "*Para cuando lleguen* sets the point ahead; *habremos hecho* is done before it." },
    { q: "What is Dad doing?", es: "¿Dónde habré dejado las llaves del carro?",
      options: ["Saying where they are", "Asking Laura to drive him", "Wondering where they are"], answer: 2,
      why: "*¿Dónde habré dejado?* wonders aloud: where could I have left them?" },
    { q: "Is it a fact or a guess?", es: "Se habrá quedado dormido.",
      options: ["A fact", "A guess", "A promise"], answer: 1,
      why: "*Habrá* turns the fact into a guess; the fact would be *se quedó dormido*." },
    { q: "When will the work be done?", es: "Para diciembre ya habremos terminado la obra.",
      options: ["By December", "After December", "Every December"], answer: 0,
      why: "*Para diciembre* with *habremos terminado*: finished before December comes." }
  ],
  yourTurn: [
    { en: "They'll have landed by now.", es: "Ya habrán aterrizado.", accept: ["Habrán aterrizado ya."] },
    { en: "By the time you arrive, I'll have already left. (to a friend)", es: "Para cuando llegues, ya habré salido.", accept: ["Para cuando llegues, ya me habré ido.", "Cuando llegues, ya [habré salido|me habré ido]."] },
    { en: "He must have fallen asleep.", es: "Se habrá quedado dormido.", accept: ["Se habrá dormido."] },
    { en: "Where could I have left my keys?", es: "¿Dónde habré dejado las llaves?", accept: ["¿Dónde habré dejado mis llaves?"] },
    { en: "By December we'll have finished the work.", es: "Para diciembre habremos terminado la obra.", accept: ["Para diciembre ya habremos terminado la obra."] }
  ],
  translate: [
    { en: "She's not answering; she must have lost her phone again.", es: "No contesta; habrá perdido el celular otra vez.", accept: ["No contesta[;|,|.] [habrá perdido|se le habrá perdido] el celular [otra vez|de nuevo]."] },
    { en: "By eight we'll have had dinner.", es: "Para las ocho ya habremos comido.", accept: ["Para las ocho habremos comido."] },
    { en: "Who could have called at this hour?", es: "¿Quién habrá llamado a esta hora?", accept: [] },
    { en: "You'll have read the message by now. (to a friend)", es: "Ya habrás leído el mensaje.", accept: [] },
    { en: "The bus is two hours late. There must have been an accident on the road. By the time it arrives, the meeting will have finished.", es: "El bus lleva dos horas de retraso. Habrá habido un accidente en la carretera. Para cuando llegue, la reunión ya habrá terminado.", accept: ["El bus [lleva|tiene|va con] dos horas de [retraso|demora]. Habrá habido un accidente en la carretera. Para cuando llegue, [la reunión ya habrá terminado|ya habrá terminado la reunión]."] },
    { en: "They must have gone out; the lights are off.", es: "Habrán salido; las luces están apagadas.", accept: ["Habrán salido[;|,|.] las luces están apagadas."] }
  ],
  register: [
    { es: "Ya aterrizaron.", en: "They've landed.", when: "when you know it for a fact" },
    { es: "Ya habrán aterrizado.", en: "They'll have landed by now.", when: "a confident guess about now" },
    { es: "Seguramente ya aterrizaron.", en: "They've probably landed already.", when: "in conversation, the everyday way to guess" },
    { es: "Para el viernes habremos concluido el proyecto.", en: "By Friday we will have concluded the project.", when: "in a work email, promising a deadline" }
  ],
  personal: {
    prompt: "Someone you know hasn't answered you today. Guess two things that have probably happened, and say what you will have done by tonight.",
    constraints: [
      { type: "regex", pattern: "(habr[aá]|habr[aá]n) [a-záéíóúñ]+(ado|ido|to|cho|so)\\b", label: "a guess: *habrá* and a participle" },
      { type: "regex", pattern: "(habr[eé]|habremos) [a-záéíóúñ]+(ado|ido|to|cho|so)\\b", label: "your deadline: *habré* and a participle" },
      { type: "containsAny", words: ["para esta noche", "para las", "para cuando", "para mañana", "para el"], label: "the point ahead: *para esta noche* or *para cuando*" }
    ],
    model: "Mi hermana no contesta. Habrá salido a correr o se habrá quedado sin batería. Para esta noche ya habré terminado el informe."
  },
  pitfalls: [
    "*Habrá perdido el celular* is a guess about now, not a future: she must have lost it.",
    "*Habrá ya llegado* splits the pair: *ya habrá llegado*.",
    "*Ayer habré visto a Ana* is not a memory: for what you know happened, *ayer vi a Ana*."
  ]
},

"gr-perfsubj-valores-b2": {
  source: "merged",
  hook: {
    line: "Before she leaves on holiday, your team lead sends one last email. She hopes, doubts and asks about things that are already done or will be done by a certain point, and the same small form carries every one of them.",
    es: "Asunto: Antes de irme\nEspero que hayan recibido el informe del lunes.\nNo creo que el cliente lo haya leído todavía.\nCuando lo haya revisado, nos llamará para la reunión.\nEn cuanto hayan terminado el presupuesto, mándenmelo, por favor.\nMe alegra que hayamos cerrado el año sin retrasos.",
    en: "Subject: Before I go\nI hope you have all received Monday's report.\nI don't think the client has read it yet.\nOnce he has gone over it, he'll call us for the meeting.\nAs soon as you've finished the budget, send it to me, please.\nI'm glad we've closed the year without delays."
  },
  examples: [
    { es: "Espero que hayas llegado bien a Medellín y que el vuelo no se haya retrasado mucho.", en: "I hope you got to Medellín safely and that the flight wasn't delayed much." },
    { es: "Dudo que el técnico haya arreglado la nevera, porque sigue haciendo el mismo ruido de ayer.", en: "I doubt the technician has fixed the fridge, because it's still making the same noise as yesterday." },
    { es: "Cuando hayas terminado la tarea, puedes salir a jugar un rato con tus primos al parque.", en: "Once you've finished your homework, you can go out and play in the park with your cousins for a while." }
  ],
  rule: "*Haya* plus a participle is the subjunctive of *ha hecho*: something already done, seen from now.\nAfter hope, doubt or a feeling, it replaces *ha* and *han*: *Ha llegado*, but *Espero que haya llegado.* *No creo que lo hayan leído.* *Me alegra que hayas venido.*\nAfter *cuando*, *en cuanto* or *hasta que*, it marks a job finished before a point ahead: *Cuando hayas terminado, avísame.* Plain *cuando termines* is just when you finish.\nThe forms: *haya*, *hayas*, *haya*, *hayamos*, *hayan*.\nSeen from a past moment, the same idea moves to *hubiera*: *Esperaba que hubiera llegado.*",
  readAndPick: [
    { q: "Has the client read the report?", es: "No creo que el cliente lo haya leído todavía.",
      options: ["She thinks not yet", "She's quite sure he has", "He read it twice"], answer: 0,
      why: "*No creo que... haya leído* doubts something done up to now: she thinks he hasn't." },
    { q: "When will he call?", es: "Cuando lo haya revisado, nos llamará.",
      options: ["Before he reads it", "Once he's read it", "While he reads it"], answer: 1,
      why: "*Cuando lo haya revisado*: the reading is finished first, then the call." },
    { q: "What is she glad about?", es: "Me alegra que hayamos cerrado el año sin retrasos.",
      options: ["A plan for next year", "A year that went badly", "A year closed on time"], answer: 2,
      why: "*Hayamos cerrado* looks at something already done: the year closed without delays." },
    { q: "What is the speaker hoping?", es: "Espero que hayas dormido bien.",
      options: ["You'll sleep well tonight", "You slept well last night", "You sleep well every night"], answer: 1,
      why: "*Hayas dormido* hopes about something already over: last night's sleep." },
    { q: "Did the technician fix the fridge?", es: "Dudo que haya arreglado la nevera.",
      options: ["Probably not", "He fixed it today", "He'll fix it soon"], answer: 0,
      why: "*Dudo que haya arreglado*: a doubt about something that should be done by now." }
  ],
  yourTurn: [
    { en: "I hope you got there safely. (to a friend)", es: "Espero que hayas llegado bien.", accept: [] },
    { en: "I don't think they've read it yet.", es: "No creo que lo hayan leído todavía.", accept: ["No creo que lo hayan leído aún.", "No creo que todavía lo hayan leído."] },
    { en: "Once you've finished, let me know. (to a friend)", es: "Cuando hayas terminado, avísame.", accept: ["En cuanto hayas terminado, avísame.", "Avísame cuando hayas terminado."] },
    { en: "I'm glad you came. (to a friend)", es: "Me alegra que hayas venido.", accept: ["Me alegro de que hayas venido.", "Qué bueno que hayas venido."] },
    { en: "I doubt he has noticed.", es: "Dudo que se haya dado cuenta.", accept: [] }
  ],
  translate: [
    { en: "I hope nothing has happened to them.", es: "Espero que no les haya pasado nada.", accept: ["Ojalá no les haya pasado nada."] },
    { en: "It's strange that she hasn't called yet.", es: "Es raro que no haya llamado todavía.", accept: ["Es raro que todavía no haya llamado.", "Qué raro que no haya llamado todavía.", "Es raro que no haya llamado aún."] },
    { en: "As soon as you've finished the budget, send it to me, please. (to a group)", es: "En cuanto hayan terminado el presupuesto, mándenmelo, por favor.", accept: ["En cuanto hayan terminado el presupuesto, [mándenmelo|envíenmelo], por favor."] },
    { en: "We won't sign until the lawyer has read the contract.", es: "No vamos a firmar hasta que el abogado haya leído el contrato.", accept: ["No firmaremos hasta que el abogado haya leído el contrato.", "No vamos a firmar hasta que la abogada haya leído el contrato."] },
    { en: "I don't think the package has arrived. It's possible that they sent it to the wrong address. Let me know when you've checked. (to a friend)", es: "No creo que el paquete haya llegado. Es posible que lo hayan mandado a la dirección equivocada. Avísame cuando hayas revisado.", accept: ["No creo que el paquete haya llegado. Es posible que lo hayan [mandado|enviado] a [la dirección equivocada|otra dirección]. Avísame cuando (lo) hayas revisado."] },
    { en: "I'm sorry you've had to wait so long.", es: "Siento que hayas tenido que esperar tanto.", accept: ["Siento mucho que hayas tenido que esperar tanto.", "Lamento que hayas tenido que esperar tanto."] }
  ],
  register: [
    { es: "Espero que hayas llegado bien.", en: "I hope you got there safely.", when: "to a friend, after a trip" },
    { es: "¿Ya llegaste?", en: "Are you there yet?", when: "a quick text to someone close" },
    { es: "Ojalá ya hayas llegado.", en: "I hope you've arrived by now.", when: "when you're a bit worried and want to know" },
    { es: "Esperamos que haya disfrutado su estadía.", en: "We hope you enjoyed your stay.", when: "a hotel or a company writing to a customer" }
  ],
  personal: {
    prompt: "Someone close to you has just done something big: a trip, an exam, a first day at work. Write one hope and one feeling about it, then ask them to tell you once something is done.",
    constraints: [
      { type: "regex", pattern: "(espero|ojal[aá]) que (no )?(me |te |le |se |nos |les |lo |la )*(haya|hayas|hayamos|hayan) ", label: "a hope: *espero que* with *haya*" },
      { type: "regex", pattern: "(me alegra|me alegro de|qu[eé] bueno|me encanta|siento|qu[eé] pena|qu[eé] l[aá]stima) que (no )?(me |te |le |se |nos |les |lo |la )*(haya|hayas|hayamos|hayan) ", label: "a feeling: *me alegra que* with *haya*" },
      { type: "regex", pattern: "(cuando|en cuanto|apenas) (me |te |lo |la |se )*(haya|hayas|hayan) ", label: "a job done first: *cuando hayas* and a participle" }
    ],
    model: "Espero que te haya ido bien en el examen. Me alegra que hayas estudiado tanto. Cuando hayas visto la nota, avísame."
  },
  pitfalls: [
    "*Espero que has llegado* keeps the ordinary helper: after *espero que*, *hayas llegado*.",
    "*Cuando hayas terminado* and *cuando termines* are both right; the first insists the job is done first.",
    "Looking back from a past moment, use *hubiera*: *esperaba que hubiera llegado*."
  ]
},

"gr-impsubj-valores-b2": {
  source: "merged",
  hook: {
    line: "A colleague passes on what the manager said in a meeting you missed, then copies in the email she sent to a supplier. Instructions passed on, a polite request and a maybe all lean on the same *-ra* form.",
    es: "Carolina: La gerente nos pidió que llegáramos a las siete mañana.\nCarolina: Quería que alguien llamara al proveedor antes del mediodía.\nCarolina: Habló como si fuera culpa nuestra, la verdad.\nCarolina: Quizá tuviera razón, no sé.\nCorreo: Quisiera confirmar el pedido del jueves, si fuera posible.",
    en: "Carolina: The manager asked us to get in at seven tomorrow.\nCarolina: She wanted someone to call the supplier before noon.\nCarolina: She talked as if it were our fault, honestly.\nCarolina: Maybe she was right, I don't know.\nEmail: I would like to confirm Thursday's order, if possible."
  },
  examples: [
    { es: "El médico me pidió que dejara el café una semana y que caminara media hora al día.", en: "The doctor asked me to give up coffee for a week and to walk half an hour a day." },
    { es: "Buenas tardes, quisiera reservar una mesa para cuatro personas el sábado a las ocho, por favor.", en: "Good afternoon, I'd like to book a table for four people on Saturday at eight, please." },
    { es: "Mi abuelo maneja como si las calles de Bogotá fueran suyas y nadie más tuviera prisa.", en: "My grandfather drives as if the streets of Bogotá were his and nobody else were in a hurry." }
  ],
  rule: "The *-ra* form you know from *si tuviera* has four more jobs.\nA request passed on from the past: *Me pide que llegue*, but *Me pidió que llegara.* *Quería que lo llamáramos.*\nPoliteness: *quisiera* softens *quiero*. *Quisiera reservar una mesa.*\n*Como si*, always with *-ra*: *Habla como si fuera el jefe.*\nA maybe about the past: *Quizá tuviera razón.* After *quizá* or *tal vez* either form works; *a lo mejor* keeps the ordinary one: *A lo mejor tenía razón.*\nIn books and formal letters you'll meet a twin in *-se*: *tuviese*, *fuese*, *hablase*. Same meaning. Read it; say *-ra*.",
  readAndPick: [
    { q: "Who has to call the supplier?", es: "Quería que alguien llamara al proveedor.",
      options: ["The manager herself", "Someone on the team", "The supplier, calling back"], answer: 1,
      why: "*Quería que alguien llamara*: she wanted someone else to make the call." },
    { q: "Was it really their fault?", es: "Habló como si fuera culpa nuestra.",
      options: ["Not necessarily", "Yes, she proved it", "Yes, they admitted it"], answer: 0,
      why: "*Como si fuera* is as if: she talked that way, whether or not it was." },
    { q: "How does this request sound?", es: "Quisiera confirmar el pedido del jueves.",
      options: ["Rude and abrupt", "Unsure of the right date", "Polite and careful"], answer: 2,
      why: "*Quisiera* softens *quiero*: the polite way to ask in an email or a shop." },
    { q: "What does *fuese* mean in this newspaper line?", es: "El alcalde pidió que la obra fuese revisada.",
      options: ["It was checked first", "The same as fuera", "It will be checked"], answer: 1,
      why: "*Fuese* is the written twin of *fuera*: he asked for the work to be checked." },
    { q: "What did the doctor ask?", es: "Me pidió que dejara el café.",
      options: ["That she quit coffee", "That I give up coffee", "That I drink more of it"], answer: 1,
      why: "*Me pidió que dejara*: a request passed on from the past, for me to act." },
    { q: "Which form follows *a lo mejor*?", es: "A lo mejor ___ razón.",
      options: ["tuviera", "tenía", "tenga"], answer: 1,
      why: "*A lo mejor* always takes the ordinary form: *a lo mejor tenía razón*." }
  ],
  yourTurn: [
    { en: "She asked us to arrive at seven.", es: "Nos pidió que llegáramos a las siete.", accept: ["Nos pidió que [llegáramos|llegásemos] a las siete."] },
    { en: "I'd like to book a table for two, please.", es: "Quisiera reservar una mesa para dos, por favor.", accept: ["Quisiera reservar una mesa para dos (personas), por favor."] },
    { en: "He talks as if he were the boss.", es: "Habla como si fuera el jefe.", accept: ["(Él) habla como si [fuera|fuese] el jefe."] },
    { en: "Maybe she was right.", es: "Quizá tuviera razón.", accept: ["[Quizá|Quizás|Tal vez] [tuviera|tenía|tuviese] razón.", "A lo mejor tenía razón."] },
    { en: "They wanted me to call them.", es: "Querían que los llamara.", accept: ["Querían que (yo) [los|las] llamara."] }
  ],
  translate: [
    { en: "My mother told me to take an umbrella.", es: "Mi mamá me dijo que llevara una sombrilla.", accept: ["Mi mamá me dijo que [llevara|sacara] [una sombrilla|un paraguas]."] },
    { en: "I'd like to speak with the manager, if possible.", es: "Quisiera hablar con el gerente, si fuera posible.", accept: ["Quisiera hablar con [el gerente|la gerente], si [fuera|es] posible."] },
    { en: "It was normal for him to be tired after the trip.", es: "Era normal que estuviera cansado después del viaje.", accept: [] },
    { en: "She walked in as if nothing had happened.", es: "Entró como si no hubiera pasado nada.", accept: ["Entró como si nada hubiera pasado.", "Entró como si no hubiese pasado nada."] },
    { en: "The teacher asked us to read the first chapter. She also wanted us to write a summary. Maybe she forgot that we had an exam on Monday.", es: "La profesora nos pidió que leyéramos el primer capítulo. También quería que escribiéramos un resumen. A lo mejor se le olvidó que teníamos examen el lunes.", accept: ["La profesora nos pidió que leyéramos el primer capítulo. También quería que escribiéramos un resumen. [A lo mejor se le olvidó|Quizá se le olvidó|Tal vez se le olvidó|Quizá se le olvidara] que teníamos (un) examen el lunes."] },
    { en: "I asked him to let me know if anything happened.", es: "Le pedí que me avisara si pasaba algo.", accept: [] }
  ],
  register: [
    { es: "Quiero un café.", en: "I want a coffee.", when: "blunt, fine with family but abrupt with strangers" },
    { es: "¿Me regala un café, por favor?", en: "Could I have a coffee, please?", when: "in a Colombian café or shop, everyday and polite" },
    { es: "Quisiera un café, por favor.", en: "I'd like a coffee, please.", when: "polite anywhere, a little more careful" },
    { es: "Quisiera solicitar información sobre el curso.", en: "I would like to request information about the course.", when: "in a formal email or letter" }
  ],
  personal: {
    prompt: "Think of the last time someone asked you to do something: a boss, a parent or a doctor. Pass on what they asked, then write one polite request of your own.",
    constraints: [
      { type: "regex", pattern: "(pidi[oó]|dijo|quer[ií]a|recomend[oó]|aconsej[oó]) que (no )?(me |te |le |nos |les |lo |la )?[a-záéíóúñ]+(ara|iera|aras|ieras|aran|ieran|áramos|iéramos)\\b", label: "a request passed on: *me pidió que* and the *-ra* form" },
      { type: "containsWord", word: "quisiera", label: "a polite request with *quisiera*" }
    ],
    model: "Mi jefe me pidió que terminara el informe antes del viernes. Quisiera pedirle un día más."
  },
  pitfalls: [
    "*Me pidió que llego temprano* keeps the ordinary form; a request passed on takes *llegara*.",
    "*A lo mejor tuviera razón* is not Spanish: after *a lo mejor*, *tenía*.",
    "*Hablase* and *hablara* mean the same; in Colombia people say *hablara*, so keep *-se* for reading."
  ]
},

"fn-posibilidad-b2": {
  source: "merged",
  hook: {
    line: "Two friends spot Lucía at the mall with her leg in a cast and start guessing in the chat. Each guess carries its own degree of confidence, and some of them are built into the verb itself.",
    es: "Diana: Vi a Lucía en el centro comercial con la pierna enyesada.\nAndrés: Se habrá caído de la moto; siempre maneja muy rápido.\nDiana: Y no me saludó.\nAndrés: No te vería. Es un poco miope.\nDiana: Debe de estar aburrida en la casa. A lo mejor la llamo esta noche.",
    en: "Diana: I saw Lucía at the mall with her leg in a cast.\nAndrés: She must have come off her motorbike; she always rides really fast.\nDiana: And she didn't say hi to me.\nAndrés: She probably didn't see you. She's a bit short-sighted.\nDiana: She must be bored at home. Maybe I'll call her tonight."
  },
  examples: [
    { es: "Seguramente estaría hablando por teléfono cuando la llamaste, porque a esa hora siempre llama a su mamá.", en: "She was probably on the phone when you called her, because at that time she always calls her mom." },
    { es: "Lo más probable es que el vuelo salga con retraso, porque está lloviendo muy fuerte en Bogotá.", en: "Most likely the flight will leave late, because it's raining very hard in Bogotá." },
    { es: "¿Las llaves? Deben de estar en el carro, porque anoche las dejé en el asiento de atrás.", en: "The keys? They must be in the car, because last night I left them on the back seat." }
  ],
  rule: "Spanish can put the guess inside the verb, with no *quizás*.\nAbout now, the future: *Estará en la casa.* She's probably home.\nAbout something just done, *habrá* and a participle: *Se habrá caído.* She must have fallen.\nAbout a past moment, the *-ría* form: *No te vería.* She probably didn't see you. *Serían las diez.*\n*Deber de* guesses too: *Debe de estar cerca.* *Debe* alone can guess or oblige; with *de* it only guesses, so never add *de* to an order.\nAs a frame, with the subjunctive: *Lo más probable es que llueva.* *Hay muchas probabilidades de que gane.*\nWhen you have no idea: *¿Quién sabe?* *A saber.*",
  readAndPick: [
    { q: "Does Andrés know what happened?", es: "Se habrá caído de la moto.",
      options: ["No, he's guessing", "Yes, she told him", "Yes, he was there with her"], answer: 0,
      why: "*Se habrá caído* guesses about something already done; the fact would be *se cayó*." },
    { q: "Why didn't Lucía say hi, according to Andrés?", es: "No te vería. Es un poco miope.",
      options: ["She was very angry with Diana", "She was in a hurry", "She probably didn't see her"], answer: 2,
      why: "The *-ría* form guesses about a past moment: she probably didn't see you." },
    { q: "Is this a guess or an order?", es: "Deben de estar en el carro.",
      options: ["An order to fetch them", "A guess", "A promise"], answer: 1,
      why: "*Deber de* only guesses: they must be in the car." },
    { q: "How likely is rain, going by this frame?", es: "Lo más probable es que llueva esta tarde.",
      options: ["Very unlikely indeed", "Quite likely", "Already raining"], answer: 1,
      why: "*Lo más probable es que* puts it as the likeliest outcome, with the subjunctive *llueva*." },
    { q: "What time was it, roughly?", es: "Cuando llegó, serían las diez.",
      options: ["Ten, more or less", "Ten o'clock sharp", "Ten o'clock tomorrow"], answer: 0,
      why: "*Serían las diez* guesses the time at a past moment: around ten." }
  ],
  yourTurn: [
    { en: "She must have fallen off her motorbike.", es: "Se habrá caído de la moto.", accept: [] },
    { en: "They must be in the car.", es: "Deben de estar en el carro.", accept: ["Deben estar en el carro.", "Estarán en el carro."] },
    { en: "Most likely it will rain this afternoon.", es: "Lo más probable es que llueva esta tarde.", accept: ["Lo más [probable|seguro] es que llueva esta tarde."] },
    { en: "She probably didn't see you. (to a friend)", es: "No te vería.", accept: ["Seguramente no te vio.", "No te habrá visto.", "A lo mejor no te vio."] },
    { en: "Who knows?", es: "¿Quién sabe?", accept: ["¡A saber!"] }
  ],
  translate: [
    { en: "There's a good chance that will happen.", es: "Hay muchas probabilidades de que eso pase.", accept: ["Hay muchas probabilidades de que eso [pase|suceda|ocurra]."] },
    { en: "It must have been about ten when she arrived.", es: "Serían las diez cuando llegó.", accept: ["Serían como las diez cuando llegó.", "Cuando llegó serían (como) las diez."] },
    { en: "He's not answering; he'll be in a meeting.", es: "No contesta; estará en una reunión.", accept: ["No contesta[;|,|.] [estará|debe de estar|debe estar] en una reunión."] },
    { en: "It's unlikely that there will be any progress this year.", es: "Es poco probable que haya avances este año.", accept: ["Es [poco probable|improbable] que haya (algún) avance este año.", "Es [poco probable|improbable] que haya avances este año."] },
    { en: "Carlos didn't come to class. He must have got sick, because yesterday he was coughing a lot. Most likely he'll come back on Monday.", es: "Carlos no vino a clase. Se habrá enfermado, porque ayer tosía mucho. Lo más probable es que vuelva el lunes.", accept: ["Carlos no vino a clase. [Se habrá enfermado|Debe de estar enfermo|Estará enfermo], porque ayer tosía mucho. Lo más [probable|seguro] es que vuelva el lunes."] },
    { en: "Maybe she's at home.", es: "A lo mejor está en la casa.", accept: ["[A lo mejor|Quizás|Quizá|Tal vez] está en (la) casa.", "[Quizás|Quizá|Tal vez] esté en (la) casa."] }
  ],
  register: [
    { es: "A lo mejor está en la casa.", en: "Maybe she's at home.", when: "in everyday talk, the most common maybe" },
    { es: "Estará en la casa.", en: "She'll be at home, probably.", when: "a confident guess, no extra word needed" },
    { es: "Debe de estar en la casa.", en: "She must be at home.", when: "when the clues all point one way" },
    { es: "Es probable que se encuentre en su domicilio.", en: "She is probably at her residence.", when: "in a formal report or an official note" }
  ],
  personal: {
    prompt: "A friend has gone quiet today: no messages, no calls. Write three guesses with different confidence: one about now, one about something already done, and the likeliest explanation.",
    constraints: [
      { type: "containsAny", words: ["estará", "estarán", "tendrá", "andará", "debe de estar"], label: "a guess about now: *estará* or *debe de estar*" },
      { type: "regex", pattern: "habr[aá]n? [a-záéíóúñ]+(ado|ido|to|cho|so)\\b", label: "a guess about something done: *se habrá* and a participle" },
      { type: "containsAny", words: ["lo más probable es que", "lo más seguro es que", "es probable que", "hay muchas probabilidades de que"], label: "the likeliest: *lo más probable es que*" }
    ],
    model: "Estará en una reunión larga. O se le habrá descargado el celular. Lo más probable es que me escriba esta noche."
  },
  pitfalls: [
    "*Quizás se habrá caído* says it twice: the form alone already makes it a guess.",
    "*Debe de* only guesses; for an order, *debe* alone: *debes pagar*, not *debes de pagar*.",
    "*A lo mejor esté* is the slip: *a lo mejor* takes the ordinary form, *a lo mejor está*."
  ]
},

"nt-necesidad-contingencia-b2": {
  source: "merged",
  hook: {
    line: "An apartment for rent in Chapinero, posted online, and the first message it gets. The listing ranks what you need from essential to optional, and the message asks its question by chance.",
    es: "Se arrienda apartamento de dos habitaciones, cerca de la Javeriana.\nRequisitos: es imprescindible presentar un codeudor con finca raíz.\nEs fundamental que el inquilino tenga contrato laboral.\nNo es necesario dejar depósito.\nMensaje: Buenas tardes, ¿de casualidad el apartamento todavía está disponible?",
    en: "Two-bedroom apartment for rent, near the Javeriana university.\nRequirements: a co-signer who owns property is essential.\nIt is key that the tenant has an employment contract.\nThere is no need to leave a deposit.\nMessage: Good afternoon, is the apartment by any chance still available?"
  },
  examples: [
    { es: "Para firmar el contrato es imprescindible que traigas la cédula original y dos referencias personales.", en: "To sign the contract it's essential that you bring your original ID card and two personal references." },
    { es: "Con tanta lluvia era inevitable que se inundara la calle, como pasa todos los años en abril.", en: "With so much rain it was inevitable that the street would flood, as happens every year in April." },
    { es: "Nos encontramos por casualidad en el aeropuerto de Cali, después de diez años sin vernos.", en: "We ran into each other by chance at the Cali airport, after ten years without seeing each other." }
  ],
  rule: "Need comes in steps: *conviene* (it's a good idea), *es necesario*, then *es imprescindible*, *es fundamental*, *es esencial*: nothing works without it.\nIn general, with the plain verb: *Es imprescindible firmar.* Naming who, with *que* and the subjunctive: *Es imprescindible que firmes.*\nWhat you can do without: *prescindir de*. *No podemos prescindir de ella.*\nWhat could not be avoided: *inevitablemente*, or *era inevitable que* with the *-ra* form: *Era inevitable que se inundara.*\nNo plan at all: *por casualidad*. The reaction: *¡Qué casualidad!*\nIn a question, *por casualidad* or *de casualidad* softens it: *¿De casualidad tienes un cargador?*",
  readAndPick: [
    { q: "Can you rent it without a co-signer?", es: "Es imprescindible presentar un codeudor.",
      options: ["No, not at all", "Yes, easily", "Only if you pay more"], answer: 0,
      why: "*Imprescindible* is the top of the ladder: without a co-signer, no apartment." },
    { q: "Do you have to leave a deposit?", es: "No es necesario dejar depósito.",
      options: ["Yes, a big one up front", "No, you don't", "Only in cash"], answer: 1,
      why: "*No es necesario* says it isn't required. It doesn't forbid it." },
    { q: "Why does the writer add *de casualidad*?", es: "¿De casualidad el apartamento todavía está disponible?",
      options: ["To doubt the landlord's word", "To sound rude", "To soften the question"], answer: 2,
      why: "*De casualidad* in a question means by any chance: it makes a no easy to give." },
    { q: "Did they plan to meet?", es: "Nos encontramos por casualidad en el aeropuerto.",
      options: ["No, by chance", "Yes, for weeks", "Yes, at the gate, at noon"], answer: 0,
      why: "*Por casualidad* says nobody planned it." },
    { q: "Could the flood have been avoided?", es: "Era inevitable que se inundara la calle.",
      options: ["Yes, quite easily", "Only by luck", "No, it was bound to"], answer: 2,
      why: "*Era inevitable que* says it was bound to happen, with *inundara* after a past frame." },
    { q: "What can't the team do?", es: "No podemos prescindir de Marta.",
      options: ["Hire a second Marta", "Work without Marta", "Talk to Marta"], answer: 1,
      why: "*Prescindir de* is to do without: Marta is essential." }
  ],
  yourTurn: [
    { en: "It's essential that you bring your ID. (to a friend)", es: "Es imprescindible que traigas la cédula.", accept: ["Es [imprescindible|fundamental|esencial] que traigas [la|tu] cédula."] },
    { en: "Do you happen to have a charger? (to a friend)", es: "¿De casualidad tienes un cargador?", accept: ["¿Por casualidad tienes un cargador?", "¿Tienes (un) cargador, [por|de] casualidad?"] },
    { en: "We can't do without her.", es: "No podemos prescindir de ella.", accept: [] },
    { en: "Inevitably, the price will go up.", es: "Inevitablemente, el precio va a subir.", accept: ["Inevitablemente, el precio [va a subir|subirá]."] },
    { en: "What a coincidence!", es: "¡Qué casualidad!", accept: [] }
  ],
  translate: [
    { en: "It's not necessary to leave a deposit.", es: "No es necesario dejar depósito.", accept: ["No es necesario dejar (un) depósito.", "No hace falta dejar (un) depósito."] },
    { en: "Trust is essential in any relationship.", es: "La confianza es fundamental en cualquier relación.", accept: ["La confianza es [fundamental|esencial|imprescindible] en cualquier relación."] },
    { en: "It was inevitable that someone would tell him.", es: "Era inevitable que alguien se lo dijera.", accept: ["Era inevitable que alguien se lo [dijera|contara]."] },
    { en: "I found the photo by chance in an old book.", es: "Encontré la foto por casualidad en un libro viejo.", accept: ["Encontré la foto [por|de] casualidad en un libro viejo.", "Por casualidad encontré la foto en un libro viejo."] },
    { en: "To travel, it's essential to have a valid passport. A visa isn't necessary. Do you happen to know where the consulate is? (to a friend)", es: "Para viajar, es imprescindible tener el pasaporte vigente. No es necesaria la visa. ¿De casualidad sabes dónde queda el consulado?", accept: ["Para viajar, es [imprescindible|fundamental|esencial] tener (el) pasaporte vigente. [No es necesaria la visa|La visa no es necesaria|No hace falta la visa]. ¿[De|Por] casualidad sabes dónde [queda|está] el consulado?"] },
    { en: "The company can't do without his experience.", es: "La empresa no puede prescindir de su experiencia.", accept: [] }
  ],
  register: [
    { es: "Hace falta una firma.", en: "A signature is needed.", when: "in everyday talk, plainly" },
    { es: "Es necesario firmar aquí.", en: "It's necessary to sign here.", when: "at an office counter or in instructions" },
    { es: "Es imprescindible presentar la cédula.", en: "Presenting your ID is essential.", when: "in a listing, a notice or a formal requirement" },
    { es: "¿De casualidad tienes un esfero?", en: "Do you happen to have a pen?", when: "asking a small favour, leaving room for a no" }
  ],
  personal: {
    prompt: "You're writing the requirements for something you organise: a trip, a class or a room to rent. Rank what is essential and what isn't, then ask someone a favour by chance.",
    constraints: [
      { type: "containsAny", words: ["imprescindible", "fundamental", "esencial"], label: "the top step: *imprescindible* or *fundamental*" },
      { type: "containsAny", words: ["no es necesario", "no es necesaria", "no hace falta"], label: "something optional: *no es necesario*" },
      { type: "containsAny", words: ["de casualidad", "por casualidad"], label: "a soft question with *de casualidad*" }
    ],
    model: "Para el paseo es imprescindible llevar impermeable. No es necesario llevar comida. ¿De casualidad tienes una carpa?"
  },
  pitfalls: [
    "*Es imprescindible para ti firmar* follows English: Spanish says *es imprescindible que firmes*.",
    "*Imprescindible* for a routine detail overstates it; *conviene* or *es necesario* fit everyday needs.",
    "*Por casualidad* in a question is politeness, not doubt about the person."
  ]
},

"nt-permanencia-b2": {
  source: "merged",
  hook: {
    line: "Natalia gets a job offer by email and talks it over with her brother. The words for what lasts and what doesn't decide whether she takes it, and one of them means the opposite of what an English speaker expects.",
    es: "Oferta: Cargo de analista con contrato a término indefinido.\nOferta: Horario fijo de lunes a viernes, de ocho a cinco.\nNatalia: ¿Indefinido? ¡Por fin un trabajo estable!\nHermano: El mío es a término fijo, o sea, solo por un año.\nNatalia: La empresa sobrevivió a la pandemia, así que parece sólida.",
    en: "Offer: Analyst position with a permanent contract.\nOffer: Fixed hours Monday to Friday, from eight to five.\nNatalia: Permanent? A stable job at last!\nBrother: Mine is fixed term, I mean, only for one year.\nNatalia: The company survived the pandemic, so it looks solid."
  },
  examples: [
    { es: "Después de cinco años de contratos temporales, por fin consiguió un trabajo estable en un hospital.", en: "After five years of temporary contracts, she finally got a stable job at a hospital." },
    { es: "El puente resistió el terremoto sin daños, pero las casas viejas del centro no aguantaron.", en: "The bridge withstood the earthquake without damage, but the old houses in the centre didn't hold up." },
    { es: "La panadería de mi abuela sobrevivió a dos crisis y sigue abierta en el mismo barrio.", en: "My grandmother's bakery survived two crises and is still open in the same neighbourhood." }
  ],
  rule: "What lasts:\n*estable* for a situation: *un trabajo estable*, *una relación estable*.\n*fijo* for what doesn't move: *un horario fijo*, *una dirección fija*.\n*permanente* and *duradero* for what stays; *temporal* for what doesn't.\nIn a Colombian contract, *a término indefinido* is permanent and *a término fijo* has an end date: fixed means temporary here.\nComing through:\n*sobrevivir a*, keeping the *a*, when it could have ended you: *sobrevivió a la crisis*.\n*resistir* when something holds up under pressure: *resistió el terremoto*.\n*aguantar* in everyday talk: *No aguanto el frío.*\nStaying: *mantenerse*, *seguir*, and in writing, *permanecer*.",
  readAndPick: [
    { q: "How long is the brother's contract?", es: "El mío es a término fijo.",
      options: ["Until a set date", "For life", "Until he retires at sixty"], answer: 0,
      why: "*A término fijo* has an end date. Permanent would be *a término indefinido*." },
    { q: "What kind of hours does the job have?", es: "Horario fijo de lunes a viernes.",
      options: ["A new rota every week", "Weekends only", "The same every week"], answer: 2,
      why: "*Fijo* for a schedule means it doesn't move." },
    { q: "Could the company have closed?", es: "La empresa sobrevivió a la pandemia.",
      options: ["No, it was never at any risk", "It closed for good", "Yes, but it came through"], answer: 2,
      why: "*Sobrevivir a* means it came through something that could have ended it." },
    { q: "What did the bridge do?", es: "El puente resistió el terremoto.",
      options: ["It fell down", "It held up", "It was rebuilt later"], answer: 1,
      why: "*Resistir* is to hold up under pressure, with no *a*." },
    { q: "What is the speaker saying?", es: "Ya no aguanto este frío.",
      options: ["She can't stand the cold", "She survived the cold", "She'll stay out in the cold"], answer: 0,
      why: "*No aguanto* is the everyday I can't stand it any more." }
  ],
  yourTurn: [
    { en: "She finally has a stable job.", es: "Por fin tiene un trabajo estable.", accept: ["Por fin tiene un [trabajo|empleo] estable.", "Ya tiene un trabajo estable por fin."] },
    { en: "The company survived the crisis.", es: "La empresa sobrevivió a la crisis.", accept: [] },
    { en: "The bridge withstood the earthquake.", es: "El puente resistió el terremoto.", accept: [] },
    { en: "I have a permanent contract.", es: "Tengo un contrato a término indefinido.", accept: ["Tengo (un) contrato a término indefinido.", "Tengo un contrato indefinido."] },
    { en: "I can't stand the heat anymore.", es: "Ya no aguanto el calor.", accept: ["No aguanto más el calor.", "Ya no soporto el calor."] }
  ],
  translate: [
    { en: "We need a fixed address to apply for the permit.", es: "Necesitamos una dirección fija para solicitar el permiso.", accept: ["Necesitamos [una dirección fija|un domicilio fijo] para [solicitar|pedir|tramitar] el permiso."] },
    { en: "His fame seems immortal, decades later.", es: "Su fama parece inmortal, décadas después.", accept: ["Su fama parece inmortal décadas después."] },
    { en: "The species has managed to survive thanks to its ability to adapt.", es: "La especie ha logrado sobrevivir gracias a su capacidad de adaptación.", accept: ["La especie [ha logrado|logró] sobrevivir gracias a su capacidad de adaptación."] },
    { en: "It's a temporary job, only for three months.", es: "Es un trabajo temporal, solo por tres meses.", accept: ["Es un trabajo temporal, solo [por|de|para] tres meses."] },
    { en: "My sister has had a fixed-term contract for two years. She wants something more stable. The company is solid: it survived two crises.", es: "Mi hermana lleva dos años con un contrato a término fijo. Quiere algo más estable. La empresa es sólida: sobrevivió a dos crisis.", accept: ["Mi hermana lleva dos años con (un) contrato a término fijo. Quiere algo más estable. La empresa es sólida[:|,|;|.] [sobrevivió|ha sobrevivido] a dos crisis."] },
    { en: "The material withstands high temperatures.", es: "El material resiste altas temperaturas.", accept: ["El material resiste temperaturas altas."] }
  ],
  register: [
    { es: "Ya no aguanto más.", en: "I can't take any more.", when: "in conversation, when you've reached your limit" },
    { es: "Resistió la presión.", en: "He withstood the pressure.", when: "anywhere, for holding up under strain" },
    { es: "Sobrevivió a la crisis.", en: "It survived the crisis.", when: "when something could have ended it" },
    { es: "La situación permanece estable.", en: "The situation remains stable.", when: "in a news report or a medical update" }
  ],
  personal: {
    prompt: "Think of something in your life that has lasted: a job, a friendship, a place, a habit. Say what makes it stable, and what it has survived or put up with.",
    constraints: [
      { type: "containsAny", words: ["estable", "fijo", "fija", "permanente", "duradero", "duradera"], label: "what lasts: *estable* or *fijo*" },
      { type: "regex", pattern: "sobreviv[a-záéíóúñ]* a |resist[a-záéíóúñ]+|aguant[a-záéíóúñ]+", label: "coming through: *sobrevivir a*, *resistir* or *aguantar*" }
    ],
    model: "Mi amistad con Camila es muy estable. Sobrevivió a dos mudanzas y a mil kilómetros de distancia."
  },
  pitfalls: [
    "*Sobrevivió la crisis* drops the *a*: *sobrevivió a la crisis*.",
    "In Colombia a *contrato a término fijo* ends on a set date; permanent is *a término indefinido*.",
    "*Sobrevivir* for a bridge sounds as if it were alive: buildings and materials *resisten*."
  ]
},

"nt-existencia-b2": {
  source: "merged",
  hook: {
    line: "A short news item from Cali after a night of heavy rain. Read it for the verbs: what caused what, what was set up, and what was done away with.",
    es: "Las fuertes lluvias de anoche ocasionaron inundaciones en el sur de Cali.\nUn árbol caído provocó un trancón de tres horas en la autopista.\nLa alcaldía estableció un punto de atención en el coliseo.\nVarios vecinos montaron una cocina comunitaria para las familias afectadas.\nEl gobierno eliminó el cobro del peaje para los vecinos de la zona.",
    en: "Last night's heavy rain caused flooding in the south of Cali.\nA fallen tree caused a three-hour traffic jam on the highway.\nThe city government set up an assistance point at the sports arena.\nSeveral neighbours set up a community kitchen for the families affected.\nThe government dropped the toll charge for local residents."
  },
  examples: [
    { es: "El terremoto ocasionó graves daños en la zona, aunque por fortuna no hubo víctimas.", en: "The earthquake caused serious damage in the area, although fortunately there were no casualties." },
    { es: "Sus declaraciones en la radio provocaron una gran polémica y al día siguiente tuvo que disculparse.", en: "His statements on the radio provoked a big controversy, and the next day he had to apologise." },
    { es: "Hace dos años mi prima montó un negocio de domicilios y ya tiene cuatro empleados.", en: "Two years ago my cousin set up a delivery business and she already has four employees." }
  ],
  rule: "To say one thing made another happen, the cause is the subject: *La lluvia causó inundaciones.*\n*causar* is neutral; *ocasionar* a little more formal; *provocar* suggests something stirred up, like a controversy; *generar* is everywhere in the news.\nThe verb agrees with the cause: *Sus declaraciones provocaron una polémica.* Effect first: *fue provocado por un cigarrillo.*\nMaking something exist: *crear*, *fundar* (a company, a town), *establecer* (a rule), *montar* (a business), *dar a luz* (a baby).\nMaking it stop: *eliminar* (a charge, a rule), *borrar* (a file, a trace), and on its own, *desaparecer*.\nWhat isn't there at all: *inexistente*.",
  readAndPick: [
    { q: "What caused the traffic jam?", es: "Un árbol caído provocó un trancón de tres horas.",
      options: ["The rain on its own", "A fallen tree", "A bridge"], answer: 1,
      why: "The cause is the subject of *provocó*: the fallen tree." },
    { q: "What did the neighbours do?", es: "Varios vecinos montaron una cocina comunitaria.",
      options: ["Set up a kitchen", "Closed a kitchen", "Ate in a big restaurant"], answer: 0,
      why: "*Montar* is to set something up: a business, a kitchen, a stall." },
    { q: "Why does the reporter choose *provocaron*?", es: "Sus declaraciones provocaron una gran polémica.",
      options: ["It's the only verb that works", "It sounds more neutral", "It hints they stirred it up"], answer: 2,
      why: "*Provocar* hints at something stirred up; *ocasionar* would stay neutral." },
    { q: "What happened to the toll?", es: "El gobierno eliminó el cobro del peaje.",
      options: ["It went up a lot", "It was dropped", "It doubled"], answer: 1,
      why: "*Eliminar* removes a charge or a rule. *Borrar* is for files and traces." },
    { q: "What started the fire?", es: "El incendio fue provocado por un cigarrillo.",
      options: ["A neighbour's stove", "The heat wave", "A cigarette"], answer: 2,
      why: "With the effect first, *por* names the cause: a cigarette." }
  ],
  yourTurn: [
    { en: "The delay caused a lot of complaints.", es: "El retraso ocasionó muchas quejas.", accept: ["El retraso [ocasionó|causó|provocó|generó] muchas quejas."] },
    { en: "His statements provoked a controversy.", es: "Sus declaraciones provocaron una polémica.", accept: ["Sus declaraciones [provocaron|generaron|causaron] una polémica."] },
    { en: "They set up a delivery business.", es: "Montaron un negocio de domicilios.", accept: ["Montaron un negocio de [domicilios|entregas a domicilio]."] },
    { en: "The law establishes new safety rules.", es: "La ley establece nuevas normas de seguridad.", accept: ["La ley establece [nuevas normas|normas nuevas] de seguridad."] },
    { en: "The fire was caused by a cigarette.", es: "El incendio fue provocado por un cigarrillo.", accept: ["El incendio fue [provocado|causado|ocasionado] por un cigarrillo."] }
  ],
  translate: [
    { en: "The rain caused floods in the south of the city.", es: "La lluvia ocasionó inundaciones en el sur de la ciudad.", accept: ["La lluvia [ocasionó|causó|provocó] inundaciones en el sur de la ciudad.", "Las lluvias [ocasionaron|causaron|provocaron] inundaciones en el sur de la ciudad."] },
    { en: "She gave birth to twins at the central hospital.", es: "Dio a luz a mellizos en el hospital central.", accept: ["Dio a luz [a mellizos|a gemelos] en el hospital central."] },
    { en: "I deleted the file by mistake.", es: "Borré el archivo por error.", accept: ["Borré el archivo [por error|sin querer]."] },
    { en: "In this region the rains are almost nonexistent.", es: "En esta región las lluvias son casi inexistentes.", accept: [] },
    { en: "My grandfather founded the company fifty years ago. Years later, the crisis caused many problems. My mother eliminated two departments and created a new one.", es: "Mi abuelo fundó la empresa hace cincuenta años. Años después, la crisis ocasionó muchos problemas. Mi mamá eliminó dos departamentos y creó uno nuevo.", accept: ["Mi abuelo fundó la empresa hace cincuenta años. Años después, la crisis [ocasionó|causó|generó|provocó] muchos problemas. Mi mamá eliminó dos departamentos y creó uno nuevo."] },
    { en: "The new rule generated a lot of debate.", es: "La nueva norma generó mucho debate.", accept: ["La nueva norma [generó|provocó|causó] mucho debate."] }
  ],
  register: [
    { es: "La lluvia causó inundaciones.", en: "The rain caused floods.", when: "anywhere, the neutral way to say it" },
    { es: "La lluvia ocasionó inundaciones.", en: "The rain brought about floods.", when: "in a report or on the news" },
    { es: "Sus palabras provocaron una polémica.", en: "His words provoked a controversy.", when: "when someone stirred things up" },
    { es: "La medida generó malestar entre los vecinos.", en: "The measure generated unease among residents.", when: "in a news item or an official statement" }
  ],
  personal: {
    prompt: "Write a short news item about something that happened in your town or at your work: what caused it, and what someone set up or got rid of because of it.",
    constraints: [
      { type: "containsAny", words: ["ocasionó", "provocó", "causó", "generó", "ocasionaron", "provocaron", "causaron", "generaron"], label: "a cause: *ocasionó*, *provocó* or *generó*" },
      { type: "containsAny", words: ["estableció", "establecieron", "montó", "montaron", "creó", "crearon", "fundó", "eliminó", "eliminaron"], label: "something set up or removed: *estableció*, *montó* or *eliminó*" }
    ],
    model: "La protesta de los transportadores ocasionó un trancón enorme. La empresa estableció el trabajo desde la casa por dos días."
  },
  pitfalls: [
    "*Sus declaraciones provocó* forgets the cause is plural: *provocaron*.",
    "*Borrar* a law sounds like rubbing it off a board: laws and charges are *eliminados*.",
    "*Fue provocado de un cigarrillo* takes the wrong word: after the effect, the cause goes with *por*."
  ]
},

"task-b2-hipotesis": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: twelve sentences or more about a decision that went wrong, or nearly did. What happened, what would have happened otherwise, and what you suspect was going on that you didn't know. The model is about a contract.",
    es: "Firmamos el contrato en marzo sin leer la cláusula doce.\nSi la hubiéramos leído, no habríamos firmado, o al menos habríamos pedido una revisión.\nEl abogado la habría visto; es imposible que se le pasara.\nPuede que pensara que era estándar, o que no quisiera retrasar el negocio.\nHabrá tenido sus razones.\nEn septiembre nos cobraron una plata que no esperábamos, y para entonces ya no había nada que hacer.",
    en: "We signed the contract in March without reading section twelve.\nIf we had read it, we wouldn't have signed, or at least we would have asked for a review.\nThe lawyer must have seen it; there's no way he missed it.\nMaybe he thought it was standard, or didn't want to hold up the deal.\nHe must have had his reasons.\nIn September they charged us money we weren't expecting, and by then there was nothing to be done."
  },
  examples: [
    { es: "Si la hubiéramos leído con calma, no habríamos firmado, o al menos habríamos pedido una revisión.", en: "If we had read it calmly, we wouldn't have signed, or at least we would have asked for a review." },
    { es: "Puede que el abogado pensara que era una cláusula estándar y por eso no dijo nada.", en: "Maybe the lawyer thought it was a standard section, and that's why he didn't say anything." },
    { es: "Habrá tenido sus razones, pero ojalá nos hubiera avisado antes de la reunión con el banco.", en: "He must have had his reasons, but I wish he had warned us before the meeting with the bank." }
  ],
  rule: "Four moves, each with its forms.\nWhat happened, in the preterite and the imperfect: *Firmamos sin leer.*\nWhat would have happened: *si hubiera* plus a participle, then *habría*: *Si la hubiéramos leído, no habríamos firmado.* Use it at least twice.\nWhat you suspect, with the guess inside the verb: *Habrá tenido sus razones* guesses from now; *la habría visto* guesses from then. *Puede que pensara* is a maybe about the past.\nA wish or a verdict: *Ojalá nos hubiera avisado.* *Habría sido mejor esperar.*\nSpanish puts how sure you are into the verb, where English adds probably or must have.",
  readAndPick: [
    { q: "Did they read section twelve?", es: "Si la hubiéramos leído, no habríamos firmado.",
      options: ["No, they didn't", "Yes, before signing it", "Yes, but too late"], answer: 0,
      why: "*Si la hubiéramos leído* imagines what didn't happen: they never read it." },
    { q: "How sure is the writer about the lawyer's reasons?", es: "Habrá tenido sus razones.",
      options: ["He knows them for sure", "It's his guess", "He has no idea at all"], answer: 1,
      why: "*Habrá tenido* guesses about the past from now: he must have had them." },
    { q: "What is *puede que pensara* doing?", es: "Puede que pensara que era estándar.",
      options: ["Stating a fact", "Giving him an order", "Offering a maybe"], answer: 2,
      why: "*Puede que* with *pensara* is a maybe about the past." },
    { q: "Did the lawyer warn them?", es: "Ojalá nos hubiera avisado antes.",
      options: ["Yes, in March", "No, he didn't", "Yes, twice, by email"], answer: 1,
      why: "*Ojalá* with *hubiera* wishes about a closed past: he didn't warn them." },
    { q: "Which form belongs after *si* here?", es: "Si ___ esperado, habríamos pagado menos.",
      options: ["hubiéramos", "habríamos", "habremos"], answer: 0,
      why: "After *si*, *hubiéramos*; *habríamos* goes in the other half." }
  ],
  yourTurn: [
    { en: "If we had read it, we wouldn't have signed.", es: "Si la hubiéramos leído, no habríamos firmado.", accept: ["Si [la|lo] hubiéramos leído, no [habríamos|hubiéramos] firmado.", "No habríamos firmado si [la|lo] hubiéramos leído."] },
    { en: "He must have had his reasons.", es: "Habrá tenido sus razones.", accept: [] },
    { en: "Maybe he thought it was standard.", es: "Puede que pensara que era estándar.", accept: ["Puede que [pensara|creyera] que era (algo) estándar.", "A lo mejor pensó que era estándar."] },
    { en: "It would have been better to wait.", es: "Habría sido mejor esperar.", accept: ["Hubiera sido mejor esperar."] }
  ],
  translate: [
    { en: "I wish he had warned us.", es: "Ojalá nos hubiera avisado.", accept: ["Ojalá nos hubiera [avisado|advertido]."] },
    { en: "If I had known, I would have asked for a review.", es: "Si lo hubiera sabido, habría pedido una revisión.", accept: ["Si lo hubiera sabido, [habría|hubiera] pedido una revisión."] },
    { en: "There's no way he missed it.", es: "Es imposible que se le pasara.", accept: ["Es imposible que se le [pasara|haya pasado|hubiera pasado]."] },
    { en: "By then there was nothing to be done.", es: "Para entonces ya no había nada que hacer.", accept: ["Para entonces no había nada que hacer."] },
    { en: "We bought the house in a rush. If we had waited a month, we would have paid less. The seller must have known that the price was going to drop.", es: "Compramos la casa a las carreras. Si hubiéramos esperado un mes, habríamos pagado menos. El vendedor sabría que el precio iba a bajar.", accept: ["Compramos la casa [a las carreras|con afán|muy rápido]. Si hubiéramos esperado un mes, [habríamos|hubiéramos] pagado menos. El vendedor [sabría|habrá sabido|seguramente sabía|debía de saber] que el precio iba a bajar."] },
    { en: "If it had been up to me, I would have taken it to court.", es: "Si hubiera sido por mí, lo habría llevado a juicio.", accept: ["Si hubiera sido por mí, lo hubiera llevado a juicio.", "Si hubiera dependido de mí, lo [habría|hubiera] llevado a juicio."] }
  ],
  register: [
    { es: "Me equivoqué, la verdad.", en: "I got it wrong, honestly.", when: "owning a mistake with friends" },
    { es: "Habría sido mejor esperar.", en: "It would have been better to wait.", when: "a calm verdict, at home or at work" },
    { es: "Si me hubieran avisado, no habría pasado esto.", en: "If they had warned me, this wouldn't have happened.", when: "complaining firmly but politely" },
    { es: "De haberlo sabido, no habríamos firmado.", en: "Had we known, we would not have signed.", when: "in a formal letter or a report" }
  ],
  personal: {
    prompt: "Write the story of a decision of your own that went wrong, or nearly did: twelve sentences or more. Say what happened, what would have happened otherwise, what you suspect, and one wish.",
    constraints: [
      { type: "minSentences", n: 12, label: "twelve sentences or more" },
      { type: "regex", pattern: "si (no )?(me |te |le |lo |la |nos |les |se )*(hubiera|hubieras|hubi[eé]ramos|hubieran|hubiese) [a-záéíóúñ]+(ado|ido|to|cho|so)\\b", label: "what would have happened: *si hubiera* and a participle" },
      { type: "containsAny", words: ["habría", "habríamos", "habrías", "habrían"], label: "the result with *habría*" },
      { type: "containsAny", words: ["habrá ", "puede que", "lo más probable"], label: "a guess: *habrá tenido* or *puede que*" },
      { type: "regex", pattern: "ojal[aá] (que )?(no )?(me |te |le |lo |la |nos |les |se )*(hubiera|hubieras|hubi[eé]ramos|hubieran)", label: "a wish: *ojalá hubiera*" }
    ],
    model: "El año pasado acepté un trabajo en otra ciudad sin visitarla antes. Me pareció una gran oportunidad. El sueldo era bueno y el cargo también. Pero el primer mes fue muy duro. No conocía a nadie y el apartamento era carísimo. Si hubiera visitado la ciudad antes, habría buscado un barrio más barato. Si hubiera hablado con otros empleados, habría sabido que el jefe era difícil. El analista anterior habrá tenido sus razones para irse. Puede que tampoco aguantara el ambiente. Lo más probable es que nadie le dijera nada. Al final me quedé seis meses y volví a Bogotá. Ojalá hubiera esperado un poco más antes de decir que sí."
  },
  pitfalls: [
    "*Si habría* never: after *si*, *hubiera*.",
    "*Habrá tenido sus razones* is a guess; *tuvo sus razones* is a fact. Choose by how sure you are.",
    "Twelve sentences of *hubiera* tire the reader: tell what happened plainly first."
  ]
},

/* ---- unit b2-u47 · Feelings, at the right strength ----------------------- */

"fn-enfado-indignacion-b2": {
  source: "merged",
  hook: {
    line: "The neighbours in a building in Medellín have had enough of the parties in flat 502. Watch the anger climb in the group chat, from mild to furious, and then watch it go calm in the letter to the management.",
    es: "Sofía: Me molesta un poco el ruido, pero bueno.\nIván: A mí me da rabia que pongan música a las tres de la mañana.\nMarta: Estoy harta de que nadie haga nada. ¡No aguanto más!\nIván: Y me indigna que la administración no conteste.\nCarta: Les escribimos porque la situación resulta ya insostenible para los residentes.",
    en: "Sofía: The noise bothers me a little, but oh well.\nIván: It makes me furious that they play music at three in the morning.\nMarta: I'm sick of nobody doing anything. I can't take any more!\nIván: And it outrages me that the management doesn't answer.\nLetter: We are writing to you because the situation has now become unsustainable for the residents."
  },
  examples: [
    { es: "Me da rabia que el bus pase lleno y no pare, sobre todo cuando está lloviendo.", en: "It makes me furious when the bus goes by full and doesn't stop, especially when it's raining." },
    { es: "Mi papá está bravo conmigo porque llegué tarde y no le avisé que me iba a demorar.", en: "My dad is angry with me because I got home late and didn't tell him I'd be late." },
    { es: "Me indigna que hayan despedido a tanta gente sin explicación mientras los directivos se suben el sueldo.", en: "It outrages me that they've laid off so many people without explanation while the executives raise their own pay." }
  ],
  rule: "Anger climbs a ladder; pick the rung that fits.\n*Me molesta que*, *me fastidia que*: it bothers me.\n*Me da rabia que*, *¡qué rabia!*: it makes me furious, personally.\n*Me indigna que*: something unjust, not a late bus.\n*Estoy harto de que*, *no aguanto que*, *no soporto que*: my patience has run out. Same person? The plain verb: *Estoy harta de esperar.*\nAfter *que*, the subjunctive: *Me da rabia que no pare.*\nIn Colombia, angry is *bravo*: *Está brava conmigo.* *Se puso bravo.*\nTo cut it off: *¡Ya basta!* *¡No puedo más!*\nDisgust is physical: *me da asco*. Boredom: *¡qué pereza!*\nIn writing, calm: *resulta inaceptable*.",
  readAndPick: [
    { q: "How angry is Sofía?", es: "Me molesta un poco el ruido, pero bueno.",
      options: ["Furious about it", "Mildly bothered", "Truly outraged"], answer: 1,
      why: "*Me molesta un poco* is the bottom rung, and *pero bueno* lets it go." },
    { q: "What has Marta reached?", es: "Estoy harta de que nadie haga nada. ¡No aguanto más!",
      options: ["The end of her patience", "A deal with the neighbours", "A mild annoyance"], answer: 0,
      why: "*Harta de que* and *no aguanto más*: her patience has run out." },
    { q: "Why *me indigna* here, not *me molesta*?", es: "Me indigna que la administración no conteste.",
      options: ["It is meant as a joke", "It is only about noise", "It feels unjust"], answer: 2,
      why: "*Indignar* is for something unfair: the people paid to answer don't." },
    { q: "What does the Colombian speaker mean?", es: "Mi papá está bravo conmigo.",
      options: ["My father is very brave", "My father is angry with me", "My father is proud of me now"], answer: 1,
      why: "In Colombia *estar bravo* means to be angry. Brave is *valiente*." },
    { q: "Where does this sentence belong?", es: "La situación resulta ya insostenible para los residentes.",
      options: ["A text to a close friend", "A formal letter", "A shout in the hall"], answer: 1,
      why: "*Resulta insostenible* is calm, written anger: no exclamation, no *rabia*." },
    { q: "What is she saying about the meeting?", es: "¡Qué pereza ir a esa reunión!",
      options: ["She can't be bothered", "She's angry at the boss for it", "She's excited"], answer: 0,
      why: "*¡Qué pereza!* is Colombia's everyday ugh, what a drag." }
  ],
  yourTurn: [
    { en: "It makes me furious that they don't answer.", es: "Me da rabia que no contesten.", accept: ["Me da rabia que no [contesten|respondan]."] },
    { en: "I'm sick of you always arriving late. (to a friend)", es: "Estoy harto de que siempre llegues tarde.", accept: ["Estoy [harto|harta] de que siempre llegues tarde.", "Estoy [harto|harta] de que llegues siempre tarde."] },
    { en: "I can't stand being interrupted.", es: "No soporto que me interrumpan.", accept: ["No [soporto|aguanto] que me interrumpan."] },
    { en: "My mom is angry with me.", es: "Mi mamá está brava conmigo.", accept: ["Mi mamá está [brava|enojada] conmigo."] },
    { en: "That's enough!", es: "¡Ya basta!", accept: ["¡Basta ya!", "¡Basta!"] }
  ],
  translate: [
    { en: "It outrages me that they fired so many people without a reason.", es: "Me indigna que hayan despedido a tanta gente sin motivo.", accept: ["Me indigna que [hayan despedido|despidieran] a tanta gente sin [motivo|razón|explicación]."] },
    { en: "It bothered me that they judged me without knowing the facts.", es: "Me molestó que me juzgaran sin conocer los hechos.", accept: ["Me [molestó|fastidió] que me juzgaran sin conocer los hechos."] },
    { en: "That smell disgusts me.", es: "Me da asco ese olor.", accept: ["Ese olor me da asco."] },
    { en: "How boring, always the same people!", es: "¡Qué aburrimiento, siempre la misma gente!", accept: ["¡Qué [aburrimiento|aburrición|pereza], siempre la misma gente!"] },
    { en: "I'm sick of the noise. Last night they played music until four. It outrages me that the management doesn't do anything.", es: "Estoy harto del ruido. Anoche pusieron música hasta las cuatro. Me indigna que la administración no haga nada.", accept: ["Estoy [harto|harta] del ruido. Anoche pusieron música hasta las cuatro (de la mañana). Me indigna que la administración no haga nada."] },
    { en: "He got angry when he saw the bill.", es: "Se puso bravo cuando vio la cuenta.", accept: ["Se puso [bravo|furioso] cuando vio la cuenta.", "Se enojó cuando vio la cuenta."] }
  ],
  register: [
    { es: "Me molesta un poco, la verdad.", en: "It bothers me a bit, honestly.", when: "a gentle first complaint, to keep the peace" },
    { es: "¡Qué rabia!", en: "How infuriating!", when: "with friends, letting off steam" },
    { es: "Estoy harta de este trancón.", en: "I'm sick of this traffic jam.", when: "in everyday talk, when it keeps happening" },
    { es: "Me indigna que nadie responda.", en: "It outrages me that nobody answers.", when: "when something feels unfair, at work or in public" },
    { es: "Esta situación resulta inaceptable.", en: "This situation is unacceptable.", when: "in a formal complaint or a letter" }
  ],
  personal: {
    prompt: "Think of something that really gets to you: in traffic, at work, at home. Write one line to a friend about it, then the same complaint calmly, as you would write it to someone in charge.",
    constraints: [
      { type: "containsAny", words: ["me da rabia que", "me molesta que", "me fastidia que", "me indigna que", "no soporto que", "no aguanto que", "estoy harto de que", "estoy harta de que"], label: "a frame with *que*: *me da rabia que* or *no soporto que*" },
      { type: "containsAny", words: ["inaceptable", "insostenible", "les escribo", "le escribo", "quisiera"], label: "the calm version: *resulta inaceptable* or *quisiera*" }
    ],
    model: "Me da rabia que los vecinos parqueen en mi puesto. Les escribo porque esta situación resulta inaceptable."
  },
  pitfalls: [
    "*Me indigna* for a late bus overstates it: what's unjust *indigna*, small things *molestan*.",
    "*Estoy harto de que llegas* keeps the ordinary form: after *de que*, *llegues*.",
    "In Colombia *estar bravo* is to be angry, not brave: brave is *valiente*."
  ]
},

"fn-alegria-satisfaccion-b2": {
  source: "merged",
  hook: {
    line: "Your cousin Camila has just graduated, and the family chat fills up. Joy, pleasure, pride and affection each have their own words, and her grandmother uses nearly all of them.",
    es: "Abuela: ¡Qué orgullo, mi niña! Estoy tan orgullosa de ti.\nRaúl: ¡Qué bueno que te hayan dado la mención de honor!\nCamila: Me alegra mucho que hayan venido todos. La pasé súper bien.\nAbuela: Te extraño, mi amor. Ven a almorzar el domingo.\nMamá: ¡Qué foto tan bonita! Me pone de buen genio verlos juntos.",
    en: "Grandma: So proud, my girl! I'm so proud of you.\nRaúl: How great that they gave you the honours mention!\nCamila: I'm so glad you all came. I had a great time.\nGrandma: I miss you, my love. Come for lunch on Sunday.\nMom: What a lovely photo! It puts me in a good mood to see you all together."
  },
  examples: [
    { es: "Me alegra muchísimo que hayas conseguido el trabajo, porque llevabas meses mandando hojas de vida.", en: "I'm so glad you got the job, because you'd been sending out CVs for months." },
    { es: "Los domingos de sol me ponen de buen genio, sobre todo si salimos a montar en bicicleta.", en: "Sunny Sundays put me in a good mood, especially if we go out cycling." },
    { es: "Disfrutamos mucho el concierto, aunque estuvimos de pie tres horas y terminamos muertos de cansancio.", en: "We really enjoyed the concert, although we were on our feet for three hours and ended up dead tired." }
  ],
  rule: "Four feelings, each with its frame.\nJoy at news: *me alegra que*, *qué bueno que*, *estoy feliz de que*, then the subjunctive: *Me alegra que hayas venido.*\nWhat reliably lifts you: *me pone de buen genio* (or *de buen humor*): *El sol me pone de buen genio.*\nPleasure: *disfrutar*, often with no *de* in Colombia (*disfruté el concierto*), *la pasé muy bien*, *estar a gusto*.\nPride: *estoy orgulloso de ti*, *¡qué orgullo!*, *estoy orgullosa de que lo hayas logrado*.\nAdmiration: *¡Qué foto tan bonita!* with no *una* after *qué*.\nAffection, from calm to strong: *me importas*, *te quiero*, *te adoro*, and *te extraño* for missing someone.",
  readAndPick: [
    { q: "What is Raúl reacting to?", es: "¡Qué bueno que te hayan dado la mención de honor!",
      options: ["A gift he bought for her", "A piece of good news", "A plan for next year"], answer: 1,
      why: "*Qué bueno que* reacts to news, with *hayan dado* for something already done." },
    { q: "What does her grandmother feel?", es: "Te extraño, mi amor.",
      options: ["She misses her", "She's angry", "She's worried about her"], answer: 0,
      why: "*Extrañar* is to miss someone. *Mi amor* is warm address, not a declaration." },
    { q: "How often does the sun lift her mood?", es: "El sol me pone de buen genio.",
      options: ["Only on Sundays", "Most of the time", "Never, these days"], answer: 1,
      why: "*Me pone de buen genio* names a trigger that works again and again." },
    { q: "Whose achievement is it?", es: "Estoy orgullosa de que lo hayas logrado.",
      options: ["Mine", "Theirs, all of them", "Yours"], answer: 2,
      why: "*Hayas* ends in *-s*: you. Pride in someone else's success takes *de que*." },
    { q: "How does Mom react to the photo?", es: "¡Qué foto tan bonita!",
      options: ["She admires it", "She dislikes it a lot", "She asks for it"], answer: 0,
      why: "*Qué* plus the thing plus *tan* plus the quality: full admiration." },
    { q: "Which is the quieter, deeper feeling?", es: "Me importas mucho.",
      options: ["A passing crush", "A burst of anger", "A lasting care"], answer: 2,
      why: "*Me importas* is calm and lasting; *me vuelves loco* is intensity." }
  ],
  yourTurn: [
    { en: "I'm so glad you came. (to a friend)", es: "Me alegra mucho que hayas venido.", accept: ["Me alegro mucho de que hayas venido.", "Qué bueno que hayas venido.", "Me alegra mucho que vinieras."] },
    { en: "I'm proud of you. (to a friend)", es: "Estoy orgulloso de ti.", accept: ["Estoy [orgulloso|orgullosa] de ti.", "Me siento [orgulloso|orgullosa] de ti."] },
    { en: "I miss you a lot. (to a friend)", es: "Te extraño mucho.", accept: [] },
    { en: "What a spectacular view!", es: "¡Qué vista tan espectacular!", accept: ["¡Qué vista más espectacular!"] },
    { en: "Rain puts me in a bad mood.", es: "La lluvia me pone de mal genio.", accept: ["La lluvia me pone de mal [genio|humor]."] }
  ],
  translate: [
    { en: "We had a great time at the party.", es: "La pasamos súper bien en la fiesta.", accept: ["La pasamos [súper bien|genial|muy bien|delicioso] en la fiesta.", "Nos divertimos mucho en la fiesta."] },
    { en: "I feel very comfortable in my new job.", es: "Me siento muy a gusto en mi nuevo trabajo.", accept: ["Estoy muy a gusto en mi nuevo trabajo.", "Me siento muy a gusto en mi trabajo nuevo."] },
    { en: "It meant a lot to me that you remembered my birthday. (to a friend)", es: "Me emocionó mucho que te acordaras de mi cumpleaños.", accept: ["Me [emocionó|alegró] mucho que te acordaras de mi cumpleaños.", "Me emocionó mucho que te hayas acordado de mi cumpleaños."] },
    { en: "It's admirable, the passion she puts into everything.", es: "Es admirable la pasión que pone en todo.", accept: ["Es admirable la pasión que le pone a todo."] },
    { en: "We were all very proud that she had come so far. Her grandmother cried with joy. What a beautiful day!", es: "Todos estábamos muy orgullosos de que hubiera llegado tan lejos. Su abuela lloró de alegría. ¡Qué día tan bonito!", accept: ["Todos estábamos muy orgullosos de que hubiera llegado tan lejos. Su abuela lloró de alegría. ¡Qué día tan [bonito|lindo|hermoso]!"] },
    { en: "I enjoyed the concert a lot.", es: "Disfruté mucho el concierto.", accept: ["Disfruté mucho del concierto.", "Disfruté muchísimo el concierto."] }
  ],
  register: [
    { es: "¡Qué chévere!", en: "How cool!", when: "with friends in Colombia, quick and warm" },
    { es: "¡Qué bueno que viniste!", en: "So glad you came!", when: "in Colombian speech, greeting someone who just arrived" },
    { es: "Me alegra mucho que hayas venido.", en: "I'm very glad you came.", when: "anywhere, warmly and with care" },
    { es: "La pasamos delicioso.", en: "We had a lovely time.", when: "in Colombia, a warm and very local way to say it" },
    { es: "Nos complace informarle que su solicitud fue aprobada.", en: "We are pleased to inform you that your application was approved.", when: "in a formal letter from an office or company" }
  ],
  personal: {
    prompt: "Think of someone close who achieved something recently. Write them a short message: your joy at the news, your pride, and one line of affection.",
    constraints: [
      { type: "regex", pattern: "(me alegra|me alegro de|qu[eé] bueno|estoy feliz de|me encanta) que", label: "joy at the news: *me alegra que* or *qué bueno que*" },
      { type: "containsAny", words: ["orgulloso", "orgullosa", "orgullosos", "qué orgullo"], label: "pride: *estoy orgullosa de ti* or *qué orgullo*" },
      { type: "containsAny", words: ["te quiero", "te extraño", "me importas", "te adoro", "mi amor", "mi vida"], label: "affection: *te quiero* or *te extraño*" }
    ],
    model: "¡Qué bueno que te hayan aceptado en la universidad! Estoy muy orgullosa de ti. Te extraño, ven pronto."
  },
  pitfalls: [
    "After *me alegra que*, the subjunctive: *hayas venido*. Only the quick *¡qué bueno que viniste!* bends it in speech.",
    "*¡Qué una vista!* adds the *una* English needs: *¡Qué vista tan bonita!*",
    "*Me importas* is not you're important: it says I care about you."
  ]
},

"fn-tristeza-afliccion-b2": {
  source: "merged",
  hook: {
    line: "Andrés moved to Toronto a month ago and writes to an old friend in Bogotá. In one short email he is sad, disappointed and sorry, and each feeling has its own frame.",
    es: "Me da tristeza que ya no nos veamos los viernes.\nEs una pena que no hayas podido venir a la despedida.\nLa pasé muy mal las primeras semanas, la verdad.\nMe decepcionó un poco que el trabajo no fuera como me lo pintaron.\nMe arrepiento de no haber aprendido inglés antes. Ojalá te hubiera hecho caso.",
    en: "It makes me sad that we don't see each other on Fridays anymore.\nIt's a shame you couldn't come to the farewell party.\nI had a really hard time the first few weeks, honestly.\nI was a bit disappointed that the job wasn't what they made it out to be.\nI regret not learning English sooner. I wish I had listened to you."
  },
  examples: [
    { es: "Me dolió mucho que no me invitaran al matrimonio, porque fuimos amigas desde el colegio.", en: "It really hurt that they didn't invite me to the wedding, because we'd been friends since school." },
    { es: "¡Qué decepción! Esperaba mucho más de la película, después de todo lo que dijeron las críticas.", en: "What a letdown! I expected much more from the film, after everything the reviews said." },
    { es: "Siento no haberte llamado el día de tu cumpleaños; se me pasó por completo con el trasteo.", en: "I'm sorry I didn't call you on your birthday; it completely slipped my mind with the move." }
  ],
  rule: "Sadness at a fact: *me da tristeza que*, *es una pena que*, *qué lástima que*, then the subjunctive: *Es una pena que no hayas podido venir.*\nHurt, which claims real pain: *me dolió que*.\nA hard stretch, not one fact: *la pasé muy mal*, *fue muy duro*.\nDisappointment: *me decepcionó que*, *¡qué decepción!*, *estoy decepcionado con el resultado*.\nRegret about yourself: *me arrepiento de*, or *siento no haber* plus a participle: *Siento no haberte llamado.* Too late: *ojalá hubiera*.\nIn Colombia *me da pena* means I'm embarrassed, and *qué pena* is sorry. For sadness, say *me da tristeza*.",
  readAndPick: [
    { q: "Did the friend come to the farewell?", es: "Es una pena que no hayas podido venir.",
      options: ["Yes, for a while at least", "No, he couldn't", "Yes, but late"], answer: 1,
      why: "*Que no hayas podido* states the fact he regrets: the friend couldn't come." },
    { q: "Is Andrés talking about one moment or a period?", es: "La pasé muy mal las primeras semanas.",
      options: ["A whole period", "One phone call", "A single bad day"], answer: 0,
      why: "*La pasé mal* covers a stretch of time, not one piece of news." },
    { q: "What is he sorry about?", es: "Siento no haberte llamado.",
      options: ["Calling too often", "That you never called", "Not calling you"], answer: 2,
      why: "*Siento no haber* with the same person: he is sorry about his own silence." },
    { q: "In Bogotá, what does this mean?", es: "Qué pena, ¿me repite la dirección?",
      options: ["How sad about the address", "Sorry, could you repeat it?", "What a shame, the address is lost"], answer: 1,
      why: "In Colombia *qué pena* opens an apology or a request: sorry, excuse me." },
    { q: "How strong is the feeling?", es: "Me dolió mucho que no me invitaran.",
      options: ["Real hurt", "A slight letdown", "Mild surprise"], answer: 0,
      why: "*Me dolió* claims real pain; a slight letdown would be *me decepcionó un poco*." },
    { q: "Can his wish still come true?", es: "Ojalá te hubiera hecho caso.",
      options: ["Yes, next week", "Maybe, if he tries hard", "No, it's too late"], answer: 2,
      why: "*Ojalá* with *hubiera* wishes about a closed past." }
  ],
  yourTurn: [
    { en: "It makes me sad that you're leaving. (to a friend)", es: "Me da tristeza que te vayas.", accept: ["Me pone triste que te vayas.", "Qué tristeza que te vayas."] },
    { en: "It's a shame they didn't invite us.", es: "Es una pena que no nos hayan invitado.", accept: ["Es una [pena|lástima] que no nos [hayan invitado|invitaran]."] },
    { en: "I'm sorry I didn't call you. (to a friend)", es: "Siento no haberte llamado.", accept: ["Siento mucho no haberte llamado.", "Lamento no haberte llamado.", "Perdón por no haberte llamado."] },
    { en: "I regret not studying more.", es: "Me arrepiento de no haber estudiado más.", accept: [] },
    { en: "I'm quite disappointed with the result.", es: "Estoy bastante decepcionado con el resultado.", accept: ["Estoy bastante [decepcionado|decepcionada] con el resultado."] }
  ],
  translate: [
    { en: "It hurt me that he treated me that way.", es: "Me dolió que me tratara de esa forma.", accept: ["Me dolió que me tratara [de esa forma|así|de esa manera]."] },
    { en: "What a letdown, we didn't win!", es: "¡Qué desilusión, no ganamos!", accept: ["¡Qué [desilusión|decepción], no ganamos!"] },
    { en: "It disappoints me that they didn't keep their word.", es: "Me decepciona que no hayan cumplido su palabra.", accept: ["Me decepciona que no [hayan cumplido|cumplieran] su palabra."] },
    { en: "We deeply regret what happened.", es: "Lamentamos profundamente lo ocurrido.", accept: ["Lamentamos profundamente lo que pasó.", "Lamentamos mucho lo ocurrido."] },
    { en: "I had a terrible time when we broke up. It was very hard. I wish I had talked to you sooner. (to a friend)", es: "La pasé fatal cuando terminamos. Fue muy duro. Ojalá hubiera hablado contigo antes.", accept: ["La pasé [fatal|muy mal|horrible] cuando [terminamos|nos separamos]. Fue muy duro. Ojalá hubiera hablado contigo antes."] },
    { en: "Listening to this kind of music makes me sad.", es: "Escuchar este tipo de música me pone triste.", accept: ["Oír este tipo de música me pone triste.", "Escuchar este tipo de música me da tristeza."] }
  ],
  register: [
    { es: "Qué tristeza.", en: "How sad.", when: "reacting to bad news, with feeling" },
    { es: "Es una pena que no puedas venir.", en: "It's a shame you can't come.", when: "anywhere, a calm regret" },
    { es: "Me arrepiento de no haber ido.", en: "I regret not going.", when: "owning your own mistake honestly" },
    { es: "Lamentamos las molestias ocasionadas.", en: "We regret the inconvenience caused.", when: "a company's formal apology in writing" }
  ],
  personal: {
    prompt: "Think of something that went worse than you hoped this year: a trip, a job, a goodbye. Write one sad line, one about a disappointment, and one regret about yourself.",
    constraints: [
      { type: "containsAny", words: ["me da tristeza que", "es una pena que", "qué lástima que", "es una lástima que", "qué tristeza que", "me pone triste que"], label: "sadness at a fact: *es una pena que*" },
      { type: "containsAny", words: ["me decepcionó", "me decepciona", "qué decepción", "decepcionado", "decepcionada", "qué desilusión"], label: "disappointment: *me decepcionó que*" },
      { type: "containsAny", words: ["me arrepiento de", "siento no haber", "ojalá hubiera", "ojalá no hubiera", "lamento no haber"], label: "your own regret: *me arrepiento de* or *ojalá hubiera*" }
    ],
    model: "Es una pena que mi hermano no haya podido venir en diciembre. Me decepcionó que el hotel estuviera tan sucio. Me arrepiento de no haber reservado otro."
  },
  pitfalls: [
    "In Colombia *me da pena* means I'm embarrassed; for sadness say *me da tristeza*.",
    "*Siento que no fui* is the slip: same person, so *siento no haber ido*.",
    "*Lo pasé fatal* is how Spain says it; Latin America says *la pasé fatal*."
  ]
},

"fn-miedo-ansiedad-b2": {
  source: "merged",
  hook: {
    line: "It's the night before Laura's first job interview in Spanish, and she messages her friend Felipe. Fear, worry, nerves and embarrassment all come out, each with its own words.",
    es: "Laura: Me da miedo que me hagan preguntas técnicas.\nFelipe: Tranquila. ¿Qué es lo que más te preocupa?\nLaura: Me preocupa que no entiendan mi acento.\nLaura: Y cuando me pongo nerviosa, me pongo roja como un tomate. ¡Qué oso!\nFelipe: Me pasa igual. Me daba pena hablar en las reuniones, y ya ves.",
    en: "Laura: I'm scared they'll ask me technical questions.\nFelipe: Relax. What worries you most?\nLaura: I'm worried they won't understand my accent.\nLaura: And when I get nervous, I go as red as a tomato. How embarrassing!\nFelipe: Same here. I used to be embarrassed to speak in meetings, and look at me now."
  },
  examples: [
    { es: "Tengo miedo de que el avión se retrase y pierda la conexión en Panamá esta noche.", en: "I'm afraid the plane will be delayed and I'll miss the connection in Panama tonight." },
    { es: "Me pone nerviosa que no contestes los mensajes cuando sales de noche en moto.", en: "It makes me nervous when you don't answer messages when you go out on the motorbike at night." },
    { es: "Me dio mucha pena llegar tarde a la reunión con el cliente y encima sin el computador.", en: "I was really embarrassed to arrive late to the meeting with the client, and without the computer on top of that." }
  ],
  rule: "Fear and worry: *me da miedo que*, *tengo miedo de que*, *me preocupa que*, then the subjunctive: *Me preocupa que no entiendan.* Same person? The plain verb: *Me da miedo manejar.*\nClimbing: *miedo*, *pánico*, *terror*. A sudden fright: *¡Qué susto!*\nNerves: *estoy nerviosa*, *¡qué nervios!*, *me pone nervioso que*. When it breaks: *perdí la paciencia*.\nEmbarrassment works like *gustar*: *me da vergüenza*. In Colombia *me da pena* says the same, and *¡qué oso!* is how embarrassing.\nShame about yourself: *me avergüenzo de*, with *de*.\nBlushing: *se puso rojo como un tomate*.",
  readAndPick: [
    { q: "What is Laura worried about?", es: "Me preocupa que no entiendan mi acento.",
      options: ["Not understanding their questions", "Them not getting her accent", "Getting there late"], answer: 1,
      why: "*Entiendan* ends in *-n*: they. The worry is about the interviewers." },
    { q: "What does Laura mean, in Colombia?", es: "¡Qué oso!",
      options: ["That's terrifying!", "How embarrassing!", "What a big bear!"], answer: 1,
      why: "*¡Qué oso!* is Colombian for how embarrassing; *hacer el oso* is to make a fool of yourself." },
    { q: "What did Felipe use to feel in meetings?", es: "Me daba pena hablar en las reuniones.",
      options: ["Shy about speaking up", "Sorry for his colleagues", "Bored by the speeches"], answer: 0,
      why: "In Colombia *me da pena* is embarrassment, and *daba* says it used to happen." },
    { q: "How strong is this fear?", es: "Me da terror que le pase algo.",
      options: ["Mild", "Over now", "Extreme"], answer: 2,
      why: "*Terror* is the top of the ladder: *miedo*, *pánico*, *terror*." },
    { q: "Who feels the shame here?", es: "Me avergüenzo de mi comportamiento.",
      options: ["The speaker", "The neighbours, mostly", "Nobody at all"], answer: 0,
      why: "*Me avergüenzo de* makes the speaker the one ashamed of his own behaviour." },
    { q: "What happened to him?", es: "Perdió la paciencia después de una hora esperando.",
      options: ["He kept very calm", "He fell asleep", "He snapped"], answer: 2,
      why: "*Perder la paciencia* names the moment composure breaks." }
  ],
  yourTurn: [
    { en: "I'm afraid they'll ask me technical questions.", es: "Tengo miedo de que me hagan preguntas técnicas.", accept: ["[Tengo miedo de que|Me da miedo que] me hagan preguntas técnicas."] },
    { en: "It worries me that he doesn't answer.", es: "Me preocupa que no conteste.", accept: ["Me preocupa que no [conteste|responda]."] },
    { en: "I'm embarrassed to speak in public.", es: "Me da vergüenza hablar en público.", accept: ["Me da [vergüenza|pena] hablar en público."] },
    { en: "What a fright you gave me! (to a friend)", es: "¡Qué susto me diste!", accept: ["¡Qué susto me pegaste!"] },
    { en: "I'm so nervous before the exam!", es: "¡Qué nervios antes del examen!", accept: ["¡Qué nervios tengo antes del examen!", "¡Estoy muy [nervioso|nerviosa] antes del examen!"] }
  ],
  translate: [
    { en: "It would terrify me if something like that happened again.", es: "Me daría terror que volviera a pasar algo así.", accept: ["Me daría [terror|pánico] que volviera a [pasar|ocurrir] algo así."] },
    { en: "Job interviews make me nervous.", es: "Las entrevistas de trabajo me ponen nerviosa.", accept: ["Las entrevistas de trabajo me ponen [nervioso|nerviosa]."] },
    { en: "He turned as red as a tomato when we found out.", es: "Se puso rojo como un tomate cuando nos enteramos.", accept: ["Se puso rojo como un tomate cuando [nos enteramos|lo descubrimos]."] },
    { en: "I'm not ashamed of being who I am.", es: "No me avergüenzo de ser quien soy.", accept: [] },
    { en: "I was very much on edge during exam season. I was afraid of failing maths. Now I laugh, but at the time I was scared to death.", es: "Estuve muy nerviosa durante la época de exámenes. Tenía miedo de perder matemáticas. Ahora me río, pero en ese momento estaba muerta de miedo.", accept: ["Estuve muy [nerviosa|nervioso|estresada|estresado|tensa|tenso] durante la época de exámenes. Tenía miedo de [perder|reprobar] matemáticas. Ahora me río, pero en ese momento estaba [muerta|muerto] de miedo."] },
    { en: "It scares them to think about what might happen.", es: "Les da miedo pensar en lo que podría pasar.", accept: ["Les asusta pensar en lo que podría pasar.", "Les da miedo pensar en lo que puede pasar."] }
  ],
  register: [
    { es: "¡Qué oso!", en: "How embarrassing!", when: "with friends in Colombia, laughing at yourself" },
    { es: "Me da pena con usted.", en: "I'm so sorry, how embarrassing.", when: "in Colombia, apologising politely to someone you call usted" },
    { es: "Me da vergüenza.", en: "I'm embarrassed.", when: "anywhere in the Spanish-speaking world" },
    { es: "Estoy muerta de miedo.", en: "I'm scared to death.", when: "with friends, exaggerating for effect" },
    { es: "Nos preocupa que no se haya tomado ninguna medida.", en: "We are concerned that no measures have been taken.", when: "in a formal letter or a public statement" }
  ],
  personal: {
    prompt: "Think of something coming up that makes you nervous: an exam, a trip, a conversation. Write what scares you about it, what worries you, and an embarrassing moment you'd like to avoid.",
    constraints: [
      { type: "containsAny", words: ["me da miedo", "tengo miedo de", "me da pánico", "me asusta"], label: "fear: *me da miedo que* or *tengo miedo de*" },
      { type: "containsAny", words: ["me preocupa", "estoy preocupado", "estoy preocupada"], label: "worry: *me preocupa que*" },
      { type: "containsAny", words: ["me da vergüenza", "me da pena", "qué oso", "hacer el oso", "me avergüenza"], label: "embarrassment: *me da pena* or *qué oso*" }
    ],
    model: "Me da miedo que el examen sea muy largo. Me preocupa no terminar a tiempo. Y me da pena quedarme en blanco delante de todos."
  },
  pitfalls: [
    "In Colombia *me da pena* is embarrassment, not sadness: *me da pena pedirle plata*.",
    "*Estoy embarazada* means pregnant: embarrassed is *me da vergüenza*.",
    "*Me avergüenzo que* drops a word: *me avergüenzo de que*, or *me avergüenza que*."
  ]
},

"fn-expresar-alivio-b2": {
  source: "merged",
  hook: {
    line: "Julián has been waiting all week for the results of his medical tests, and his sister checks in. Relief, hope and acceptance follow one another in a handful of messages.",
    es: "Hermana: ¿Ya te dieron los resultados?\nJulián: Sí, ¡todo salió bien! ¡Qué alivio!\nHermana: ¡Gracias a Dios! ¿Y el viaje a Cartagena?\nJulián: Toca aplazarlo. El médico quiere que descanse un mes.\nHermana: Ni modo, otra vez será. Ojalá puedan ir en diciembre.",
    en: "Sister: Did they give you the results yet?\nJulián: Yes, everything came out fine! What a relief!\nSister: Thank God! And the trip to Cartagena?\nJulián: We'll have to put it off. The doctor wants me to rest for a month.\nSister: Oh well, maybe next time. I hope you can go in December."
  },
  examples: [
    { es: "¡Menos mal que llevé la sombrilla! Empezó a llover justo cuando salimos del cine.", en: "Thank goodness I took the umbrella! It started raining just as we came out of the cinema." },
    { es: "Ojalá que no llueva el sábado, porque tenemos el asado en la finca de mis suegros.", en: "I hope it doesn't rain on Saturday, because we have the barbecue at my in-laws' farm." },
    { es: "No hay nada que hacer: el vuelo ya salió, así que toca esperar el de mañana.", en: "There's nothing to be done: the flight has already left, so we have to wait for tomorrow's." }
  ],
  rule: "Relief: *¡Menos mal!* (everyday), *¡Qué alivio!*, *¡Gracias a Dios!* (said whatever you believe). With a fact: *Menos mal que llegaste.* Calmly: *me siento más tranquila*. When it's over: *ya pasó*.\nHope: *espero que*, *ojalá (que)*, then the subjunctive. *Ojalá llueva*: it could happen. *Ojalá lloviera*: unlikely. *Ojalá hubiera llovido*: too late.\nAs a reply: *Eso espero.* *Ojalá que sí.* *Si Dios quiere.*\nAcceptance: *Ni modo.* *¡Qué le vamos a hacer!* *Otra vez será.* *No hay nada que hacer.*\nIn Colombia, *toca* is the shrug of what has to be done: *Toca esperar.*",
  readAndPick: [
    { q: "How does Julián feel about the results?", es: "Sí, ¡todo salió bien! ¡Qué alivio!",
      options: ["Worried", "Relieved", "Resigned to it"], answer: 1,
      why: "*¡Qué alivio!* names the feeling once the worry is over." },
    { q: "What does *toca aplazarlo* tell you?", es: "Toca aplazarlo. El médico quiere que descanse.",
      options: ["They want to go now", "They have to put it off", "The trip is cancelled forever"], answer: 1,
      why: "*Toca* is Colombian for it has to be done: the trip waits." },
    { q: "How does his sister take the change?", es: "Ni modo, otra vez será.",
      options: ["She's furious about it all", "She's thrilled", "She shrugs it off"], answer: 2,
      why: "*Ni modo* and *otra vez será* accept it lightly: maybe next time." },
    { q: "How likely does the speaker think rain is?", es: "Ojalá lloviera esta semana.",
      options: ["Quite likely", "Not very likely", "It already rained"], answer: 1,
      why: "*Ojalá* with the *-ra* form wishes for something unlikely. *Ojalá llueva* would be a real hope." },
    { q: "What is she replying to?", es: "¿Crees que vamos a llegar a tiempo? Eso espero.",
      options: ["A hope he just raised", "A plan she made herself", "A promise"], answer: 0,
      why: "*Eso espero* answers a hope someone else raised, without repeating it." },
    { q: "Can this wish still come true?", es: "Ojalá hubiéramos salido más temprano.",
      options: ["No, it's too late", "Yes, tomorrow", "Yes, if we really hurry"], answer: 0,
      why: "*Hubiéramos salido* looks back at a past that is closed." }
  ],
  yourTurn: [
    { en: "Thank goodness you arrived on time! (to a friend)", es: "¡Menos mal que llegaste a tiempo!", accept: [] },
    { en: "What a relief, we're done!", es: "¡Qué alivio, ya terminamos!", accept: ["¡Qué alivio, por fin terminamos!"] },
    { en: "I hope so.", es: "Eso espero.", accept: ["Ojalá que sí.", "Ojalá."] },
    { en: "There's nothing to be done.", es: "No hay nada que hacer.", accept: [] },
    { en: "We'll have to wait.", es: "Toca esperar.", accept: ["Nos toca esperar.", "Hay que esperar.", "Tenemos que esperar."] }
  ],
  translate: [
    { en: "I hope everything turns out well.", es: "Espero que todo salga bien.", accept: ["Ojalá (que) todo salga bien."] },
    { en: "Oh well, maybe next time.", es: "Ni modo, otra vez será.", accept: ["[Ni modo|En fin|Qué le vamos a hacer], otra vez será."] },
    { en: "I feel much calmer after talking to the doctor.", es: "Me siento mucho más tranquila después de hablar con el médico.", accept: ["Me siento mucho más [tranquila|tranquilo|aliviada|aliviado] después de hablar con [el médico|la médica|el doctor|la doctora]."] },
    { en: "I wish I had had more time to prepare it.", es: "Ojalá hubiera tenido más tiempo para prepararlo.", accept: [] },
    { en: "They cancelled the flight. What can you do! At least they gave us a hotel. I hope we can leave tomorrow.", es: "Cancelaron el vuelo. ¡Qué le vamos a hacer! Por lo menos nos dieron hotel. Espero que podamos salir mañana.", accept: ["Cancelaron el vuelo. ¡Qué le vamos a hacer! [Por lo menos|Al menos] nos dieron (un) hotel. [Espero que|Ojalá] podamos salir mañana."] },
    { en: "He's resigned to not getting the promotion this year.", es: "Está resignado a no conseguir el ascenso este año.", accept: ["Está resignado a no [conseguir|recibir|tener] el ascenso este año."] }
  ],
  register: [
    { es: "¡Uf, menos mal!", en: "Phew, thank goodness!", when: "in conversation, the everyday relief" },
    { es: "¡Gracias a Dios!", en: "Thank God!", when: "anywhere in Colombia, whatever you believe" },
    { es: "Si Dios quiere.", en: "God willing.", when: "about plans, a very common Colombian hope" },
    { es: "Ni modo.", en: "Oh well.", when: "accepting something small you can't change" },
    { es: "Lamentablemente, no es posible modificar la fecha.", en: "Unfortunately, it is not possible to change the date.", when: "in a formal reply, closing the matter politely" }
  ],
  personal: {
    prompt: "Think of something that worried you and turned out fine, and something you had to accept. Write your relief, one hope for what comes next, and how you shrug off the rest.",
    constraints: [
      { type: "containsAny", words: ["menos mal", "qué alivio", "gracias a dios", "ya pasó"], label: "relief: *menos mal* or *qué alivio*" },
      { type: "containsAny", words: ["espero que", "ojalá", "eso espero", "si dios quiere"], label: "a hope: *ojalá* or *espero que*" },
      { type: "containsAny", words: ["ni modo", "qué le vamos a hacer", "otra vez será", "no hay nada que hacer", "toca", "en fin"], label: "acceptance: *ni modo* or *otra vez será*" }
    ],
    model: "¡Menos mal que el examen de manejo salió bien! Ojalá me den la licencia pronto. El carro de mi papá no está disponible este mes, pero ni modo."
  },
  pitfalls: [
    "*Ojalá llueva* and *ojalá lloviera* are different hopes: possible, then unlikely.",
    "*Eso espero* only answers a hope someone else raised; it can't open a conversation.",
    "*Ni modo* and *otra vez será* are light; for a real loss, *lo siento mucho*."
  ]
},

"fn-empatia-b2": {
  source: "merged",
  hook: {
    line: "Valentina tells her friend Sergio that she has just lost her job. His replies move through three things a good friend does: understand, comfort and encourage.",
    es: "Valentina: Me quedé sin trabajo. Cerraron toda la oficina.\nSergio: ¡Ay, qué pesar! Lo siento mucho, Valen.\nSergio: Te entiendo perfectamente; a mí me pasó lo mismo hace dos años.\nSergio: Tranquila, todo tiene solución. Ya verás que vas a encontrar algo mejor.\nSergio: No tengas miedo de buscar en otra ciudad. Cuenta conmigo.",
    en: "Valentina: I lost my job. They closed the whole office.\nSergio: Oh, what a shame! I'm so sorry, Valen.\nSergio: I understand completely; the same thing happened to me two years ago.\nSergio: Don't worry, there's a way out of everything. You'll see, you'll find something better.\nSergio: Don't be afraid to look in another city. Count on me."
  },
  examples: [
    { es: "Siento mucho que hayas tenido que pasar por todo esto sola, sin tu familia cerca.", en: "I'm so sorry you've had to go through all this alone, without your family nearby." },
    { es: "A mí me pasa lo mismo con las presentaciones: la noche antes casi no duermo.", en: "The same happens to me with presentations: the night before I hardly sleep." },
    { es: "No te rindas ahora, que ya casi terminas la tesis y todos estamos muy orgullosos.", en: "Don't give up now, you've almost finished your thesis and we're all very proud." }
  ],
  rule: "Three moves, in this order.\nShow you understand: *Te entiendo.* *Sé cómo te sientes.* Share it only if it's true: *A mí me pasó lo mismo.* Sympathy: *¡Ay, pobrecita!* *¡Qué pesar!* (Colombia). *Siento mucho que*, with the subjunctive: *Siento que hayas tenido que pasar por esto.*\nComfort: *Tranquilo.* *Ya pasó.* *Todo va a salir bien.* *Todo tiene solución.* Match the time: *ya pasó* for what's over, *va a salir bien* for what's ahead.\nEncourage: name the fear, then push. *No tengas miedo de equivocarte.* *¡Atrévete a intentarlo!* *No te rindas.* *Tú puedes.* *¡Ánimo!* *¡Hágale!*\nWith *usted*: *No se preocupe.* *No se rinda.*",
  readAndPick: [
    { q: "What is Sergio claiming?", es: "Te entiendo perfectamente; a mí me pasó lo mismo.",
      options: ["That he pities her a lot", "He lived it too", "She caused it"], answer: 1,
      why: "*A mí me pasó lo mismo* claims a shared experience, a stronger move than *te entiendo*." },
    { q: "What does *qué pesar* express here?", es: "¡Ay, qué pesar! Lo siento mucho.",
      options: ["Sympathy", "Heavy work ahead", "Impatience"], answer: 0,
      why: "*¡Qué pesar!* is Colombian sympathy for bad news: what a shame." },
    { q: "Is Sergio's comfort about the past or the future?", es: "Ya verás que vas a encontrar algo mejor.",
      options: ["The past, mostly", "Right now", "The future"], answer: 2,
      why: "*Vas a encontrar* looks ahead; *ya pasó* would close something already over." },
    { q: "Why does he name the fear?", es: "No tengas miedo de buscar en otra ciudad.",
      options: ["To scare her a little more", "To make the push land", "To blame her"], answer: 1,
      why: "Naming the fear, *miedo de buscar*, lands better than a bare *tú puedes*." },
    { q: "Who is this said to?", es: "No se preocupe, todo se va a arreglar.",
      options: ["A close friend of yours", "Someone you call usted", "Your little brother"], answer: 1,
      why: "*No se preocupe* is the *usted* form; to a friend, *no te preocupes*." },
    { q: "When is *ya pasó* the right thing to say?", es: "Ya pasó, ya pasó. Estás bien.",
      options: ["When it's over", "Before it even starts", "While it goes on"], answer: 0,
      why: "*Ya pasó* closes a trouble that has ended. For one still going on, *todo va a salir bien*." }
  ],
  yourTurn: [
    { en: "I know exactly how you feel. (to a friend)", es: "Sé exactamente cómo te sientes.", accept: [] },
    { en: "The same thing happened to me.", es: "A mí me pasó lo mismo.", accept: ["Me pasó lo mismo."] },
    { en: "Don't be afraid of making mistakes. (to a friend)", es: "No tengas miedo de equivocarte.", accept: [] },
    { en: "Don't give up, you're almost there. (to a friend)", es: "No te rindas, ya casi lo logras.", accept: ["No te rindas, ya casi lo [logras|tienes|consigues]."] },
    { en: "I'm so sorry you've had to go through this. (to a friend)", es: "Siento mucho que hayas tenido que pasar por esto.", accept: ["Lamento mucho que hayas tenido que pasar por esto."] }
  ],
  translate: [
    { en: "Don't worry, everything will work out. (to someone you call usted)", es: "No se preocupe, todo se va a arreglar.", accept: ["No se preocupe, todo se [va a arreglar|arreglará|va a solucionar]."] },
    { en: "Dare to try it! (to a friend)", es: "¡Atrévete a intentarlo!", accept: [] },
    { en: "Come on, you can do it, I believe in you. (to a friend)", es: "Vamos, tú puedes, confío en ti.", accept: ["[Vamos|Dale|Ánimo], tú puedes, [confío|creo] en ti."] },
    { en: "Oh, poor thing, what bad luck!", es: "¡Ay, pobrecito, qué mala suerte!", accept: ["¡Ay, [pobrecito|pobrecita|pobre], qué mala suerte!"] },
    { en: "Relax, it's over now. Everything has a solution. Tomorrow we'll go to the clinic together. (to a friend)", es: "Tranquila, ya pasó. Todo tiene solución. Mañana vamos juntas a la clínica.", accept: ["[Tranquila|Tranquilo], ya pasó. Todo tiene solución. Mañana vamos [juntas|juntos] a la clínica.", "[Tranquila|Tranquilo], ya pasó. Todo tiene solución. Mañana [iremos|vamos a ir] [juntas|juntos] a la clínica."] },
    { en: "There's nothing to fear, everything will turn out fine.", es: "No hay nada que temer, todo va a salir bien.", accept: ["No hay nada que temer, todo [va a salir|saldrá] bien."] }
  ],
  register: [
    { es: "Tranqui, no pasa nada.", en: "Chill, it's nothing.", when: "with friends, for a small upset" },
    { es: "¡Qué pesar!", en: "What a shame!", when: "in Colombia, sympathy for someone's bad news" },
    { es: "¡Hágale, que usted puede!", en: "Go for it, you can do it!", when: "in Colombia, a warm push, even between friends" },
    { es: "Te acompaño en tu dolor.", en: "I'm with you in your grief.", when: "spoken condolences, to someone who lost a loved one" },
    { es: "Mi más sentido pésame.", en: "My deepest condolences.", when: "in writing or formally, after a death" }
  ],
  personal: {
    prompt: "A friend has just had bad news: a failed exam, a breakup or a lost job. Write three lines to them: show you understand, comfort them, and push them to take a step.",
    constraints: [
      { type: "containsAny", words: ["te entiendo", "sé cómo te sientes", "me pasó lo mismo", "me pasa lo mismo", "qué pesar", "lo siento", "siento mucho"], label: "understanding: *te entiendo* or *qué pesar*" },
      { type: "containsAny", words: ["tranquilo", "tranquila", "ya pasó", "todo va a salir bien", "todo tiene solución", "no te preocupes"], label: "comfort: *tranquila* or *todo tiene solución*" },
      { type: "containsAny", words: ["no tengas miedo de", "atrévete", "no te rindas", "tú puedes", "ánimo", "hágale"], label: "a push: *no te rindas* or *atrévete*" }
    ],
    model: "Qué pesar, te entiendo. Tranquila, todo tiene solución. No tengas miedo de presentarte otra vez en junio."
  },
  pitfalls: [
    "*A mí me pasó lo mismo* only helps if it's true; if not, *te entiendo* is safer.",
    "*Ya pasó* for a problem that's still going on sounds dismissive.",
    "*No tienes miedo* states a fact; the push is *no tengas miedo de*."
  ]
},

"fn-sorpresa-extraneza-b2": {
  source: "merged",
  hook: {
    line: "Simón texts his flatmate a piece of neighbourhood news that nobody saw coming. The replies run from a quick gasp to a slow, puzzled *that's odd*, and after the puzzled ones the verb changes shape.",
    es: "Simón: ¿Supiste? Don Carlos vendió la tienda de la esquina.\nMateo: ¡No me digas! ¿En serio?\nSimón: Sí, y se va a vivir a Santa Marta.\nMateo: ¡No puede ser! Me extraña que no nos haya dicho nada.\nSimón: Qué raro que la vendiera tan rápido, ¿no?",
    en: "Simón: Did you hear? Don Carlos sold the corner shop.\nMateo: You're kidding! Seriously?\nSimón: Yes, and he's moving to Santa Marta.\nMateo: That can't be! It's strange that he hasn't said anything to us.\nSimón: Odd that he sold it so fast, isn't it?"
  },
  examples: [
    { es: "Me sorprendió muchísimo que hubiera llegado tan temprano, porque siempre es el último en llegar.", en: "I was really surprised that he had arrived so early, because he's always the last to arrive." },
    { es: "Me llama la atención que nadie haya dicho nada sobre el cambio de horario del colegio.", en: "It strikes me that nobody has said anything about the school's change of schedule." },
    { es: "¡Qué casualidad encontrarte aquí! Justo ayer le pregunté a tu hermana cómo estabas.", en: "What a coincidence running into you here! Just yesterday I asked your sister how you were." }
  ],
  rule: "A quick gasp: *¡No me digas!* *¿En serio?* *¡No puede ser!* *¡No te creo!* *¡Qué casualidad!* None of them means its words; each one just reacts.\nA slower, puzzled reaction: *me extraña que*, *me sorprende que*, *me llama la atención que*, *¡qué raro que!*, *es increíble que*. The next verb goes into the subjunctive, even when the fact is true: *Me extraña que no haya llamado.*\nMatch the time: *que no conteste* (now), *que no haya llamado* (done by now), *que la vendiera* (back then).\nAbout a thing or a person: *estoy sorprendida de*, with *de*.\nFor what nobody expected: *¿Quién iba a pensar que...?*",
  readAndPick: [
    { q: "Does Mateo think Simón is lying?", es: "¡No me digas! ¿En serio?",
      options: ["Yes, he thinks so", "No, it's just a gasp", "Yes, and he's very angry"], answer: 1,
      why: "*¡No me digas!* and *¿en serio?* react with surprise; they don't doubt the speaker." },
    { q: "Is it true that Don Carlos said nothing?", es: "Me extraña que no nos haya dicho nada.",
      options: ["Yes, he said nothing", "No, he told them all", "Nobody knows"], answer: 0,
      why: "The fact is true; the subjunctive *haya dicho* comes from *me extraña*, not from doubt." },
    { q: "When did he sell the shop?", es: "Qué raro que la vendiera tan rápido.",
      options: ["Next month, maybe", "He's selling it now", "It's already done"], answer: 2,
      why: "*Vendiera* is the *-ra* form after a reaction: the sale is already done." },
    { q: "What does she find striking?", es: "Me llama la atención que nadie haya dicho nada.",
      options: ["That nobody said a word", "That everybody complained loudly", "That she was told"], answer: 0,
      why: "*Me llama la atención que* points at something odd: here, the silence." },
    { q: "How did he react to the website?", es: "Estoy sorprendido de la calidad de la página.",
      options: ["Deeply bored by it", "Surprised by it", "Offended by it"], answer: 1,
      why: "*Estar sorprendido de* describes the reaction to a thing, here its quality." },
    { q: "What does the speaker mean?", es: "¿Quién iba a pensar que ganarían?",
      options: ["Everyone knew it", "They'll win next year", "Nobody expected it"], answer: 2,
      why: "*¿Quién iba a pensar que...?* is not a real question: nobody saw it coming." }
  ],
  yourTurn: [
    { en: "You're kidding! (to a friend)", es: "¡No me digas!", accept: ["¡No te creo!", "¿En serio?"] },
    { en: "It's strange that he hasn't called.", es: "Me extraña que no haya llamado.", accept: ["Es raro que no haya llamado.", "Qué raro que no haya llamado.", "Me parece raro que no haya llamado."] },
    { en: "How odd that she isn't answering!", es: "¡Qué raro que no conteste!", accept: ["¡Qué raro que no [conteste|responda]!"] },
    { en: "What a coincidence running into you here! (to a friend)", es: "¡Qué casualidad encontrarte aquí!", accept: [] },
    { en: "It surprises me that you're here. (to a friend)", es: "Me sorprende que estés aquí.", accept: [] }
  ],
  translate: [
    { en: "I was surprised he arrived so soon.", es: "Me sorprendió que llegara tan pronto.", accept: ["Me sorprendió que [llegara|hubiera llegado] tan [pronto|rápido|temprano]."] },
    { en: "It's incredible that he had time to do it all.", es: "Es increíble que tuviera tiempo de hacerlo todo.", accept: ["Es increíble que tuviera tiempo [de|para] hacerlo todo.", "Es increíble que haya tenido tiempo de hacerlo todo."] },
    { en: "It's surprising how well he plays the piano.", es: "Es sorprendente lo bien que toca el piano.", accept: [] },
    { en: "That can't be!", es: "¡No puede ser!", accept: [] },
    { en: "Did you hear? Ana got married in Cartagena. It strikes me that she didn't invite anyone from the office. Who would have thought it?", es: "¿Supiste? Ana se casó en Cartagena. Me llama la atención que no invitara a nadie de la oficina. ¿Quién lo iba a pensar?", accept: ["¿Supiste? Ana se casó en Cartagena. Me llama la atención que no [invitara|haya invitado|hubiera invitado] a nadie de la oficina. ¿Quién lo iba a pensar?", "¿Supiste? Ana se casó en Cartagena. Me llama la atención que no [invitara|haya invitado|hubiera invitado] a nadie de la oficina. ¿Quién iba a pensarlo?"] },
    { en: "I'm surprised at the quality of their website.", es: "Estoy sorprendido de la calidad de su página web.", accept: ["Estoy [sorprendido|sorprendida] [de|con|por] la calidad de su página web."] }
  ],
  register: [
    { es: "¿En serio?", en: "Seriously?", when: "with anyone, a quick check you heard right" },
    { es: "¡No me digas!", en: "You don't say!", when: "in conversation, to keep the story coming" },
    { es: "Me extraña que no haya llamado.", en: "It's strange he hasn't called.", when: "when something odd worries you a little" },
    { es: "Llama la atención que no se haya informado a los vecinos.", en: "It is striking that residents were not informed.", when: "in a formal letter or a newspaper column" }
  ],
  personal: {
    prompt: "Think of a piece of news that surprised you lately. Write your first quick reaction, then a slower line about what seems odd to you.",
    constraints: [
      { type: "containsAny", words: ["no me digas", "en serio", "no puede ser", "no te creo", "qué casualidad"], label: "a quick reaction: *¡no me digas!* or *¿en serio?*" },
      { type: "containsAny", words: ["me extraña que", "me sorprende que", "me sorprendió que", "qué raro que", "me llama la atención que", "es increíble que", "es raro que"], label: "a puzzled frame: *me extraña que* or *qué raro que*" }
    ],
    model: "¿En serio? Mi jefe renunció ayer. Me extraña que no nos haya dicho nada."
  },
  pitfalls: [
    "*Me extraña que no ha llamado* keeps the ordinary form: after *me extraña que*, *haya llamado*.",
    "*¡No me digas!* isn't an order to stop talking: it means go on, I'm amazed.",
    "*Estoy sorprendido que* drops a word: *estoy sorprendido de que*."
  ]
},

"nt-grado-b2": {
  source: "merged",
  hook: {
    line: "A review of a small hotel in Villa de Leyva, posted online. The writer never says *muy* twice: every word of degree is chosen for its strength.",
    es: "El hotel es realmente bonito y el desayuno, buenísimo.\nLa habitación era un poco pequeña, pero súper limpia.\nEl wifi, en cambio, es totalmente inútil.\nPara ser tan caro, el servicio fue bastante lento.\nEn general, es una experiencia sumamente recomendable.",
    en: "The hotel is really pretty and the breakfast is excellent.\nThe room was a bit small, but super clean.\nThe wifi, on the other hand, is completely useless.\nFor somewhere so expensive, the service was rather slow.\nOn the whole, it's a highly recommendable experience."
  },
  examples: [
    { es: "La película fue realmente divertida; no me lo esperaba, porque las críticas eran malísimas.", en: "The film was genuinely funny; I wasn't expecting it, because the reviews were terrible." },
    { es: "Mi sobrino está muy alto para su edad y ya usa los zapatos de su papá.", en: "My nephew is very tall for his age, and he already wears his dad's shoes." },
    { es: "Esa arepa de la esquina está demasiado buena; la próxima vez pido dos de una vez.", en: "That arepa from the corner is so good; next time I'm ordering two straight away." }
  ],
  rule: "Instead of *muy*, choose by strength.\nReal emphasis: *realmente*, *increíblemente*, or *-ísimo*: *buenísimo*, *carísimo*.\nWords with no middle, like *falso*, *imposible*, *inútil*, *seguro*: *totalmente*, *completamente*, *absolutamente*, never *muy*.\nCasual: *súper*, as in *súper limpio*. Formal: *sumamente*, *extremadamente*.\nLess: *bastante* (quite), *un poco* (a bit, often a complaint), *algo*, *ligeramente*; none at all: *no es nada caro*.\nToo much: *demasiado*. In Colombia it also praises: *está demasiado bueno*, it's really good.\n*Muy... para* is high for what you'd expect: *muy alto para su edad*.",
  readAndPick: [
    { q: "How bad is the wifi?", es: "El wifi es totalmente inútil.",
      options: ["Slow at times", "Useless, full stop", "Fine after midnight"], answer: 1,
      why: "*Totalmente* goes with words that have no middle: useless is useless." },
    { q: "What is the writer complaining about?", es: "La habitación era un poco pequeña.",
      options: ["The size, a little", "The view, a lot", "The price, above all else"], answer: 0,
      why: "*Un poco* with a quality is often a soft complaint: a bit small." },
    { q: "In Colombia, what does this mean?", es: "Esa arepa está demasiado buena.",
      options: ["It's too greasy to eat", "It's not worth it", "It's really, really good"], answer: 2,
      why: "In Colombia *demasiado* can praise: *demasiado buena* is delicious, not too good to eat." },
    { q: "Which word fits a formal report?", es: "Es una propuesta ___ interesante.",
      options: ["sumamente", "súper", "demasiado"], answer: 0,
      why: "*Sumamente* is formal. *Súper* belongs to speech, and *demasiado* is too much, or friendly Colombian praise." },
    { q: "How expensive is it?", es: "No es nada caro.",
      options: ["A bit", "Very much so", "Not at all"], answer: 2,
      why: "*No... nada* with a quality means not at all." },
    { q: "Is he tall in general?", es: "Está muy alto para su edad.",
      options: ["No, he's short", "Yes, for anyone", "For his age, yes"], answer: 2,
      why: "*Muy... para* measures against what you'd expect: tall for a child his age." }
  ],
  yourTurn: [
    { en: "It was really fun.", es: "Fue realmente divertido.", accept: ["Fue [realmente|súper|muy] divertido.", "Fue divertidísimo."] },
    { en: "What they're saying is completely false.", es: "Es totalmente falso lo que dicen.", accept: ["Lo que dicen es [totalmente|completamente] falso.", "Es completamente falso lo que dicen."] },
    { en: "It's too late to call.", es: "Es demasiado tarde para llamar.", accept: ["Ya es demasiado tarde para llamar."] },
    { en: "It's not expensive at all.", es: "No es nada caro.", accept: ["No es caro para nada."] },
    { en: "This exam is super hard.", es: "Este examen es súper difícil.", accept: ["Este examen es [súper difícil|superdifícil|dificilísimo]."] }
  ],
  translate: [
    { en: "The breakfast was delicious and incredibly cheap.", es: "El desayuno estuvo delicioso e increíblemente barato.", accept: ["El desayuno [estuvo|fue|era] delicioso e increíblemente barato."] },
    { en: "I trust him completely.", es: "Confío en él por completo.", accept: ["Confío [completamente|totalmente] en él.", "Confío en él [completamente|totalmente]."] },
    { en: "He's very tall for his age.", es: "Está muy alto para su edad.", accept: ["Es muy alto para su edad."] },
    { en: "It's a highly recommendable experience.", es: "Es una experiencia sumamente recomendable.", accept: ["Es una experiencia [sumamente|altamente|muy] recomendable."] },
    { en: "The room was a bit small but super clean. The service, on the other hand, was rather slow. Overall, it's really worth it.", es: "La habitación era un poco pequeña, pero súper limpia. El servicio, en cambio, fue bastante lento. En general, vale mucho la pena.", accept: ["La habitación era un poco pequeña, pero súper limpia. El servicio, en cambio, fue bastante lento. En general, vale [mucho|muchísimo|realmente] la pena."] },
    { en: "That's completely impossible.", es: "Eso es completamente imposible.", accept: ["Eso es [completamente|totalmente|absolutamente] imposible."] }
  ],
  register: [
    { es: "¡Está buenísimo!", en: "It's so good!", when: "with anyone, about food or a plan" },
    { es: "Está demasiado bueno.", en: "It's really, really good.", when: "in Colombia, praising something among friends" },
    { es: "Es súper fácil.", en: "It's super easy.", when: "in chat and speech, never in a report" },
    { es: "Es sumamente importante.", en: "It is extremely important.", when: "in formal writing or a speech" }
  ],
  personal: {
    prompt: "Write a short review of a place you know: a café, a hotel or a shop. Use words of degree other than *muy*, and soften one complaint with *un poco*.",
    constraints: [
      { type: "containsAny", words: ["realmente", "increíblemente", "totalmente", "completamente", "absolutamente", "súper", "sumamente", "bastante", "demasiado", "ísimo", "ísima"], label: "a strong word of degree: *realmente* or *-ísimo*" },
      { type: "containsWord", word: "un poco", label: "a soft complaint with *un poco*" },
      { type: "minSentences", n: 3, label: "three sentences or more" }
    ],
    model: "El café de la esquina es realmente acogedor. Los postres están buenísimos. La música es un poco fuerte, pero vale la pena."
  },
  pitfalls: [
    "*Muy imposible* doesn't work: words with no middle take *totalmente* or *completamente*.",
    "*Demasiado* is too much; only in friendly Colombian talk does it praise.",
    "*Súper* in a formal email sounds like a chat: write *sumamente*."
  ]
},

"nt-interes-b2": {
  source: "merged",
  hook: {
    line: "At the end of a cooking course in Bogotá, the students fill in an evaluation form. Their comments say what caught their interest, what bored them, and what kept them going.",
    es: "Me interesó mucho la parte de cocina del Pacífico.\nMe llamó la atención lo fácil que es hacer pan en casa.\nLas clases teóricas me aburrían un poco; eran demasiado largas.\nLa profesora es muy entretenida y nos motiva a probar cosas nuevas.\nNoté cierta falta de interés en el grupo de los sábados.",
    en: "I was very interested in the Pacific cooking section.\nIt struck me how easy it is to make bread at home.\nThe theory classes bored me a bit; they were too long.\nThe teacher is very entertaining and motivates us to try new things.\nI noticed a certain lack of interest in the Saturday group."
  },
  examples: [
    { es: "Me aburren las reuniones de los lunes, porque siempre hablamos de lo mismo durante dos horas.", en: "Monday meetings bore me, because we always talk about the same thing for two hours." },
    { es: "Mi hija está aburrida en vacaciones, pero no es una niña aburrida: le encanta leer.", en: "My daughter is bored on holiday, but she isn't a boring girl: she loves reading." },
    { es: "La exposición despertó mucho interés entre los estudiantes, sobre todo la sala de fotografía antigua.", en: "The exhibition aroused a lot of interest among the students, especially the old photography room." }
  ],
  rule: "*Interesar*, *aburrir*, *motivar*, *cansar* and *llamar la atención* work like *gustar*: the thing is the subject, and you are *me*.\n*Me aburre la clase.* *Me aburren las reuniones.* *Me motiva el proyecto.* *Me llama la atención que nadie lo diga.*\nSay *yo aburro* and you're the boring one.\n*Ser* or *estar* changes the meaning: *estoy aburrido*, I'm bored; *soy aburrido*, I'm boring.\nWhat holds attention: *interesante*, *entretenido* (fun to follow), *sorprendente*.\nFor the person: *interesarse por*, *estar motivado*.\nIn writing: *despertar interés*, *falta de interés*, *el centro de interés*.",
  readAndPick: [
    { q: "Did the theory classes bore the student?", es: "Las clases teóricas me aburrían un poco.",
      options: ["Yes, a bit", "No, never", "Only the very first"], answer: 0,
      why: "*Me aburrían un poco*: the classes bored her a little, more than once." },
    { q: "Who is boring here?", es: "Mi hija está aburrida, pero no es aburrida.",
      options: ["The daughter, all the time", "No one; she's bored now", "The long school holidays"], answer: 1,
      why: "*Está aburrida* is a state, bored now; *no es aburrida* says she isn't a boring person." },
    { q: "What caught this student's attention?", es: "Me llamó la atención lo fácil que es hacer pan.",
      options: ["How hard bread is", "How cheap bread is", "How easy bread is"], answer: 2,
      why: "*Lo fácil que es* is how easy it is; *me llamó la atención* says it struck her." },
    { q: "What does the teacher do for the group?", es: "Nos motiva a probar cosas nuevas.",
      options: ["She drives them on", "She bores them stiff", "She tires them out"], answer: 0,
      why: "*Nos motiva a* works like *gustar*: she is what pushes them to try things." },
    { q: "How strong is the lack of interest?", es: "Noté cierta falta de interés en el grupo.",
      options: ["Total", "Huge interest", "Quite mild"], answer: 2,
      why: "*Falta de interés* is milder than *aburrimiento*: some of them weren't engaged." }
  ],
  yourTurn: [
    { en: "Meetings bore me.", es: "Me aburren las reuniones.", accept: ["Las reuniones me aburren."] },
    { en: "I'm bored. (a woman speaking)", es: "Estoy aburrida.", accept: [] },
    { en: "It struck me that nobody said anything.", es: "Me llamó la atención que nadie dijera nada.", accept: ["Me llamó la atención que nadie [dijera|hubiera dicho|haya dicho] nada."] },
    { en: "The project motivates her a lot.", es: "Le motiva mucho el proyecto.", accept: ["El proyecto la motiva mucho.", "El proyecto le motiva mucho.", "La motiva mucho el proyecto."] },
    { en: "I'm very interested in Colombian history.", es: "Me interesa mucho la historia de Colombia.", accept: ["Me interesa mucho la historia colombiana."] }
  ],
  translate: [
    { en: "Overly long films bore him.", es: "Le aburren las películas demasiado largas.", accept: ["Las películas demasiado largas lo aburren.", "Las películas demasiado largas le aburren.", "Lo aburren las películas demasiado largas."] },
    { en: "Her lack of interest in the project was obvious.", es: "Su falta de interés en el proyecto era evidente.", accept: ["Su falta de interés [en|por] el proyecto era [evidente|obvia]."] },
    { en: "This novel is very entertaining.", es: "Esta novela es muy entretenida.", accept: [] },
    { en: "He's not boring, he's just tired.", es: "No es aburrido, solo está cansado.", accept: ["No es aburrido, [solo|simplemente] está cansado.", "No es aburrido, está cansado."] },
    { en: "Driving at night tires me. But the trip interests me a lot, so I'm going to go by bus. It's slower, but more relaxing.", es: "Me cansa manejar de noche. Pero el viaje me interesa mucho, así que voy a ir en bus. Es más lento, pero más tranquilo.", accept: ["Me cansa manejar de noche. Pero el viaje me interesa mucho, así que [voy a ir|iré] en bus. Es más lento, pero más [tranquilo|relajante]."] },
    { en: "The talk aroused a lot of interest.", es: "La charla despertó mucho interés.", accept: ["La charla [despertó|generó] mucho interés."] }
  ],
  register: [
    { es: "¡Qué aburrición!", en: "How boring!", when: "in Colombia, among friends, about a dull plan" },
    { es: "Me aburre un poco.", en: "It bores me a bit.", when: "a gentle way to say it to anyone" },
    { es: "Me llama mucho la atención.", en: "It really catches my interest.", when: "showing interest politely, at work or with strangers" },
    { es: "El tema despertó un gran interés entre los asistentes.", en: "The topic aroused great interest among those attending.", when: "in a report or an official summary" }
  ],
  personal: {
    prompt: "Fill in your own course evaluation for something you've studied: a class, an app, a workshop. Say what interested you, what bored you, and what kept you motivated.",
    constraints: [
      { type: "regex", pattern: "me (interes[oóa]|interesaron|interesaba|llam[oóa] la atenci[oó]n)", label: "interest: *me interesó* or *me llamó la atención*" },
      { type: "regex", pattern: "me aburr(e|en|ía|ían|ió|ieron)|estaba aburrid[oa]|qu[eé] aburrici[oó]n", label: "boredom: *me aburría* or *me aburrieron*" },
      { type: "regex", pattern: "motiv", label: "motivation: *me motivaba* or *estaba motivado*" }
    ],
    model: "Me interesó mucho la parte de gramática. Me aburrían un poco los videos largos. Me motivaba ver que cada semana entendía más."
  },
  pitfalls: [
    "*Yo aburro las reuniones* says you bore the meetings: *me aburren las reuniones*.",
    "*Soy aburrido* is I'm boring; for I'm bored, *estoy aburrido*.",
    "*Me aburre las reuniones* forgets the plural: the verb follows the thing, *me aburren*."
  ]
},

"nt-evaluacion-general-b2": {
  source: "merged",
  hook: {
    line: "Daniel had a job interview this morning, and his mother wants to hear everything. Their messages judge how it went, whether it was worth it, and what was absurd.",
    es: "Mamá: ¿Cómo te fue en la entrevista?\nDaniel: Me fue bien, creo. La prueba técnica me salió regular.\nMamá: ¿Y valió la pena ir hasta Chía?\nDaniel: Sí, la oficina no está nada mal y el equipo es excelente.\nDaniel: Lo absurdo fue esperar una hora en la recepción.",
    en: "Mom: How did the interview go?\nDaniel: It went well, I think. The technical test went so-so.\nMom: And was it worth going all the way to Chía?\nDaniel: Yes, the office isn't bad at all and the team is excellent.\nDaniel: The absurd part was waiting an hour at reception."
  },
  examples: [
    { es: "Al final le fue muy bien en la entrevista y la llamaron para empezar el lunes.", en: "In the end her interview went really well and they called her to start on Monday." },
    { es: "No vale la pena discutir por algo tan pequeño, sobre todo a estas horas de la noche.", en: "It's not worth arguing over something so small, especially at this time of night." },
    { es: "La torta no me salió tan bonita como en la foto, pero quedó deliciosa.", en: "The cake didn't come out as pretty as in the photo, but it turned out delicious." }
  ],
  rule: "How something went for someone works like *gustar*: the thing is the subject, and the person is *me*, *te*, *le*.\n*¿Cómo te fue?* *Me fue bien.* For a whole event, *ir*: *¿Cómo les fue en el viaje?*\nFor something you made or did, *salir*: *La prueba me salió mal.* Plural things, plural verb: *Me salieron bien las fotos.*\nWhether it was worth it: *valer la pena*. *Valió la pena.* *No vale la pena discutir.* It weighs the effort, not just the quality.\nThe scale: *excelente*, *muy bien*, *no está nada mal* (better than it sounds), *regular* (so-so), *mal*, *absurdo*.",
  readAndPick: [
    { q: "How did the technical test go?", es: "La prueba técnica me salió regular.",
      options: ["Brilliantly", "Very badly indeed", "So-so"], answer: 2,
      why: "*Regular* answers how it went with a shrug: not good, not bad." },
    { q: "What does Daniel think of the office?", es: "La oficina no está nada mal.",
      options: ["It's quite good", "It's awful", "It's too far away"], answer: 0,
      why: "*No está nada mal* is an understated yes: better than fine." },
    { q: "What is Mom asking?", es: "¿Y valió la pena ir hasta Chía?",
      options: ["How long the bus ride took", "If he paid for the bus", "If the trip was worth it"], answer: 2,
      why: "*Valer la pena* weighs the effort against the result: was the trip worth it?" },
    { q: "Who is the interview about?", es: "Al final le fue muy bien en la entrevista.",
      options: ["Someone else", "The speaker", "The listener"], answer: 0,
      why: "*Le fue* puts the person as *le*: it went well for her or him." },
    { q: "What does the speaker mean?", es: "No vale la pena discutir por esto.",
      options: ["It's not worth the fight", "It's a great argument to have", "It costs too much"], answer: 0,
      why: "*No vale la pena* says the effort isn't justified: let it go." },
    { q: "Did the photos come out well?", es: "Me salieron muy bien las fotos.",
      options: ["No, badly", "Only one of them", "Yes, very well"], answer: 2,
      why: "*Me salieron bien* agrees with the photos, the things that turned out." }
  ],
  yourTurn: [
    { en: "How did the exam go? (to a friend)", es: "¿Cómo te fue en el examen?", accept: [] },
    { en: "It went really well for them.", es: "Les fue muy bien.", accept: ["Les fue súper bien."] },
    { en: "It's not worth getting angry over this.", es: "No vale la pena ponerse bravo por esto.", accept: ["No vale la pena [ponerse bravo|ponerse brava|enojarse] por esto."] },
    { en: "It's not bad at all for a first try.", es: "No está nada mal para ser la primera vez.", accept: ["No está nada mal para la primera vez."] },
    { en: "The cake didn't come out well for me.", es: "La torta no me salió bien.", accept: ["No me salió bien la torta."] }
  ],
  translate: [
    { en: "It was an absurd proposal from the start.", es: "Fue una propuesta absurda desde el principio.", accept: [] },
    { en: "Is it really worth paying so much for this?", es: "¿De verdad vale la pena pagar tanto por esto?", accept: ["¿Sí vale la pena pagar tanto por esto?", "¿Realmente vale la pena pagar tanto por esto?", "¿Vale la pena pagar tanto por esto?"] },
    { en: "My photos came out really well.", es: "Me salieron muy bien las fotos.", accept: ["Las fotos me salieron muy bien.", "Me salieron súper bien las fotos."] },
    { en: "It's silly to argue over something so small.", es: "Es una tontería discutir por algo tan pequeño.", accept: ["Es una bobada discutir por algo tan pequeño."] },
    { en: "How did the trip go for you all? It went great for us. The hotel wasn't bad at all, and the beach was worth it.", es: "¿Cómo les fue en el viaje? Nos fue súper bien. El hotel no estaba nada mal y la playa valió la pena.", accept: ["¿Cómo les fue en el viaje? Nos fue [súper bien|genial|muy bien]. El hotel no estaba nada mal y la playa valió la pena."] },
    { en: "In the end the interview went great for him.", es: "Al final le fue genial en la entrevista.", accept: ["Al final le fue [genial|muy bien|súper bien] en la entrevista."] }
  ],
  register: [
    { es: "¿Qué tal?", en: "How was it?", when: "anywhere, the quickest way to ask" },
    { es: "Regular.", en: "So-so.", when: "a short, honest answer to how it went" },
    { es: "No estuvo nada mal.", en: "It wasn't bad at all.", when: "praise that sounds modest" },
    { es: "El balance general es positivo.", en: "The overall assessment is positive.", when: "in a report or a meeting summary" }
  ],
  personal: {
    prompt: "Think of something you did recently: an exam, a trip, a recipe, an interview. Say how it went for you, what came out well or badly, and whether it was worth it.",
    constraints: [
      { type: "regex", pattern: "(me|nos|le|les|te) fue", label: "how it went: *me fue bien*" },
      { type: "regex", pattern: "(me|nos|le|les|te) sali(ó|o|eron)", label: "what came out: *me salió*" },
      { type: "containsAny", words: ["vale la pena", "valió la pena"], label: "worth it: *valió la pena*" }
    ],
    model: "Me fue bien en el examen de inglés. El ensayo me salió regular, pero la parte oral me salió muy bien. Valió la pena estudiar el fin de semana."
  },
  pitfalls: [
    "*¿Cómo fuiste en el examen?* makes you the subject: *¿cómo te fue en el examen?*",
    "*Me salió bien las fotos* forgets the plural: *me salieron bien*.",
    "*No está nada mal* is praise, not a complaint."
  ]
},

"task-b2-emocion": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: fourteen sentences or more about something that left you with a mixed reaction, relief and anger, or pride and embarrassment, with no feeling word used twice. The model is about a place on a course.",
    es: "Cuando por fin me llamaron para decirme que había cupo, sentí sobre todo alivio.\nLlevaba cinco meses esperando y ya daba el asunto por perdido.\nPero mientras colgaba, me fue subiendo una especie de fastidio.\nEl cupo estaba disponible desde julio, y a mí en julio me dijeron que no había nada.\nNo es que me indigne, tampoco es para tanto, pero sí me deja un mal sabor.\nMe da rabia sobre todo por la gente que se rindió antes que yo.",
    en: "When they finally called to tell me there was a place, I felt relief above all.\nI'd been waiting five months and had already given it up for lost.\nBut as I hung up, a sort of irritation crept up on me.\nThe place had been there since July, and in July they told me there was nothing.\nIt's not that it outrages me, it's not that big a deal, but it does leave a bad taste.\nIt makes me angry mostly for the people who gave up before I did."
  },
  examples: [
    { es: "Llevaba cinco meses esperando la respuesta y ya daba el asunto por perdido cuando me llamaron.", en: "I'd been waiting five months for the answer and had already given it up for lost when they called me." },
    { es: "Estaba orgullosa de mi hijo, aunque me dio un poco de pena que llorara delante de todos.", en: "I was proud of my son, although I was a little embarrassed that he cried in front of everyone." },
    { es: "Al principio me hizo gracia, después me molestó, y al final ya estaba harta de la broma.", en: "At first I found it funny, then it bothered me, and in the end I was fed up with the joke." }
  ],
  rule: "At B1 you could say you were angry. At B2 the skill is the right word.\nChoose by strength and by cause: *me molesta* (mild), *me fastidia* (irritated), *estoy harto de* (it keeps happening), *me indigna* (it's unfair).\nMix two feelings and let them pull: *sentí alivio, pero...*\nWalk one back: *No es que me indigne, pero...*, with the subjunctive after *no es que*. *Tampoco es para tanto.*\nShow it change over time: *me fue subiendo una especie de fastidio*.\nNever the same feeling word twice.\nReaching straight for the strongest word is the B1 habit.",
  readAndPick: [
    { q: "What did the writer feel first?", es: "Sentí sobre todo alivio.",
      options: ["Mostly relief", "Mostly anger", "Mostly shame"], answer: 0,
      why: "*Sobre todo alivio*: relief came first, before the irritation." },
    { q: "How did the irritation arrive?", es: "Me fue subiendo una especie de fastidio.",
      options: ["Suddenly, all at once", "Little by little", "It never came"], answer: 1,
      why: "*Me fue subiendo* is a feeling that grows bit by bit." },
    { q: "What does *no es que me indigne* do?", es: "No es que me indigne, pero me deja un mal sabor.",
      options: ["Makes it much stronger", "Changes the subject", "Walks the feeling back"], answer: 2,
      why: "*No es que* with the subjunctive denies the strong word before giving a milder one." },
    { q: "Who is the writer angry for?", es: "Me da rabia sobre todo por la gente que se rindió.",
      options: ["For the others", "For himself only", "For the caller on the phone"], answer: 0,
      why: "*Sobre todo por la gente que se rindió*: the anger is on behalf of others." },
    { q: "How strong is this?", es: "Me molesta un poco que no avisen.",
      options: ["Outraged", "Fed up for good", "Mildly bothered"], answer: 2,
      why: "*Me molesta un poco* is the bottom of the ladder: mild and fixable." }
  ],
  yourTurn: [
    { en: "It's not that it outrages me, but it leaves a bad taste.", es: "No es que me indigne, pero me deja un mal sabor.", accept: ["No es que me indigne, pero me deja (un) mal sabor (de boca)."] },
    { en: "It's not that big a deal.", es: "Tampoco es para tanto.", accept: ["No es para tanto."] },
    { en: "I felt relief above all.", es: "Sentí sobre todo alivio.", accept: ["Sentí alivio sobre todo.", "Sobre todo sentí alivio."] },
    { en: "A sort of irritation crept up on me.", es: "Me fue subiendo una especie de fastidio.", accept: [] }
  ],
  translate: [
    { en: "It makes me angry mostly for the others.", es: "Me da rabia sobre todo por los demás.", accept: [] },
    { en: "I had been waiting five months.", es: "Llevaba cinco meses esperando.", accept: ["Había esperado cinco meses."] },
    { en: "At first it was funny, then it bothered me.", es: "Al principio me hizo gracia, después me molestó.", accept: ["Al principio me hizo gracia, [después|luego] me molestó.", "Al principio me pareció chistoso, [después|luego] me molestó."] },
    { en: "I was proud, but also a bit embarrassed.", es: "Estaba orgullosa, pero también me daba un poco de pena.", accept: ["Estaba [orgulloso|orgullosa], pero también me daba un poco de [pena|vergüenza].", "Me sentía [orgulloso|orgullosa], pero también me daba un poco de [pena|vergüenza]."] },
    { en: "When they called me, I felt relief. But it bothered me that they hadn't told me the truth in July. In the end, it's not worth dwelling on it.", es: "Cuando me llamaron, sentí alivio. Pero me molestó que no me hubieran dicho la verdad en julio. Al final, no vale la pena darle más vueltas.", accept: ["Cuando me llamaron, sentí alivio. Pero me molestó que no me [hubieran dicho|dijeran] la verdad en julio. [Al final|En fin], no vale la pena darle más vueltas."] },
    { en: "It made me happy and sad at the same time.", es: "Me dio alegría y tristeza al mismo tiempo.", accept: ["Me dio alegría y tristeza a la vez.", "Me puso feliz y triste al mismo tiempo."] }
  ],
  register: [
    { es: "Me dio mucha rabia.", en: "It made me really angry.", when: "telling a friend the story afterwards" },
    { es: "No es que me moleste, pero...", en: "It's not that it bothers me, but...", when: "softening a complaint before you make it" },
    { es: "Tampoco es para tanto.", en: "It's not that big a deal.", when: "calming someone down, or yourself" },
    { es: "Debo manifestar mi inconformidad con la decisión.", en: "I must state my disagreement with the decision.", when: "putting strong feeling into a formal letter" }
  ],
  personal: {
    prompt: "Write about something that left you with a mixed reaction: fourteen sentences or more. Use at least four different feeling words, two strengths of the same feeling, and walk one back with *no es que*.",
    constraints: [
      { type: "minSentences", n: 14, label: "fourteen sentences or more" },
      { type: "regex", pattern: "no es que (me |te |le |nos )?[a-záéíóúñ]+", label: "a feeling walked back: *no es que me indigne*" },
      { type: "containsAny", words: ["alivio", "rabia", "fastidio", "orgullo", "orgulloso", "orgullosa", "pena", "vergüenza", "tristeza", "alegría", "indigna", "molesta", "harto", "harta"], label: "feeling words like *alivio*, *rabia* or *orgullo*" },
      { type: "containsAny", words: ["pero", "aunque", "sin embargo"], label: "a turn between feelings: *pero* or *aunque*" }
    ],
    model: "El sábado mi hermana se graduó de la universidad. Sentí un orgullo enorme cuando dijeron su nombre. Ella fue la primera de la familia en terminar una carrera. Mi mamá lloró de alegría durante toda la ceremonia. Pero al final pasó algo que me dejó un mal sabor. El rector se equivocó y la llamó con otro apellido. Al principio me hizo gracia. Después me empezó a molestar. Mi hermana se puso roja y me dio pena por ella. No es que me indigne, tampoco es para tanto. Pero sí me fastidia que nadie le pidiera perdón. Mi papá, en cambio, estaba furioso. Yo preferí no darle más vueltas. Al fin y al cabo, fue un día feliz."
  },
  pitfalls: [
    "*No es que me indigna* keeps the ordinary form: *no es que* takes *me indigne*.",
    "Using *me indigna* for everything is shouting; save it for what's unfair.",
    "Repeating *molesto* five times flattens the story: change the word as the feeling changes."
  ]
}

};
