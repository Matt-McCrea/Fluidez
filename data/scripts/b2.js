/* ============================================================================
 * TEACHING SCRIPTS, B2 units 1 to 8 (window.SCRIPTS_B2), keyed by lesson id.
 * Units b2-u44 (the ladder of agreeing, opining, softening and certainty),
 * b2-u45 (building an argument and the words that hold it together), b2-u46
 * (what didn't happen and what probably did: the compound subjunctives, the
 * guess inside the verb, need, lasting and causing), b2-u47 (feelings at
 * the right strength, then degree, interest and verdicts), b2-u48 (reading
 * the news: figures, rises, shares, rough counts, events, value and time),
 * b2-u49 (reporting what people said, and knowing, guessing, doing early,
 * at once and again), b2-u50 (moving the weight in a sentence: fronting,
 * spotlights, turning it up, no, exclamations and tone) and b2-u51
 * (describing precisely: material, texture, shape, weight, wet, colour,
 * dirt, sight, sound, taste, origin and age): every lesson on the path from
 * COURSE_BANDS.B2 to the end of b2-u51 (days 353 to 449 when this was
 * written; the test reads the days from data/course.js).
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
},

/* ---- unit b2-u48 · Reading the news -------------------------------------- */

"nt-cantidad-numerica-b2": {
  source: "merged",
  hook: {
    line: "A news site in Bogotá publishes the monthly jobs figures. Every line measures something different: a rate, a total, a share, a part of a group, a rough crowd.",
    es: "La tasa de desempleo en Bogotá bajó al 9,8 % en el último trimestre.\nLa cifra de personas sin trabajo sigue por encima de las cuatrocientas mil.\nEl 40 % de los nuevos empleos son informales, según el DANE.\nTres de los cinco sectores con más contratos son de servicios.\nUn millar de jóvenes consiguió su primer empleo con el programa de la alcaldía.",
    en: "The unemployment rate in Bogotá fell to 9.8% in the last quarter.\nThe number of people out of work is still above four hundred thousand.\n40% of the new jobs are informal, according to DANE.\nThree of the five sectors with the most contracts are in services.\nAbout a thousand young people got their first job through the city's programme."
  },
  examples: [
    { es: "El índice de precios subió un 0,7 % en marzo, por el costo de los alimentos.", en: "The price index rose by 0.7% in March, because of the cost of food." },
    { es: "Dos de mis hermanos trabajan en el centro, pero el menor sigue buscando empleo desde enero.", en: "Two of my brothers work downtown, but the youngest has been looking for a job since January." },
    { es: "Centenares de personas hicieron fila desde la madrugada, y decenas se quedaron sin entrar a la feria.", en: "Hundreds of people queued from the small hours, and dozens never got into the fair." }
  ],
  rule: "News Spanish measures with a short word, then *de*, then the thing measured, usually with no article.\n*La tasa de desempleo* is a rate. *El índice de precios* is an index. *La cifra de visitantes* is a figure or total. *El porcentaje de* is a share. *Número* is never a rate.\nA percentage takes a small word in front: *subió un 5 %* (by 5%), *subió al 5 %* (to 5%), *el 40 % de los empleos* (40% of).\nColombia writes decimals with a comma: *9,8 %*.\nRough big numbers: *decenas de*, *centenares de*, *un millar de*.\nA number plus *de* picks part of a bigger group: *dos de mis hermanos* means you have more than two.",
  readAndPick: [
    { q: "How many brothers does the writer have?", es: "Dos de mis hermanos trabajan en el centro.",
      options: ["Just the two", "More than two", "Only one of them"], answer: 1,
      why: "*Dos de mis hermanos* picks two out of a bigger group. Exactly two would be *mis dos hermanos*." },
    { q: "What does *la tasa de desempleo* measure?", es: "La tasa de desempleo bajó al 9,8 %.",
      options: ["How many firms shut down", "The share out of work", "The average wage"], answer: 1,
      why: "*La tasa de* is a rate: the share of people who want work and have none." },
    { q: "How did prices change?", es: "El índice de precios subió un 0,7 % en marzo.",
      options: ["They rose by 0.7%", "They reached 0.7%", "They fell by 0.7%"], answer: 0,
      why: "*Subió un 0,7 %* is the size of the rise. *Subió al 0,7 %* would give the new level." },
    { q: "How many young people got a first job?", es: "Un millar de jóvenes consiguió su primer empleo.",
      options: ["Roughly a thousand", "Exactly a million of them", "A few dozen"], answer: 0,
      why: "*Un millar de* is about a thousand, a round figure. A million is *un millón*." },
    { q: "What share of the new jobs are informal?", es: "El 40 % de los nuevos empleos son informales.",
      options: ["Forty jobs", "Four in a hundred", "Four jobs in ten"], answer: 2,
      why: "*El 40 % de* is a share of the whole: forty in every hundred." }
  ],
  yourTurn: [
    { en: "The unemployment rate fell by 2%.", es: "La tasa de desempleo bajó un 2 %.", accept: ["La tasa de desempleo bajó un dos por ciento.", "La tasa de desempleo cayó un 2 %."] },
    { en: "Three of the candidates withdrew.", es: "Tres de los candidatos se retiraron.", accept: [] },
    { en: "Thirty percent of the customers pay by card.", es: "El 30 % de los clientes paga con tarjeta.", accept: ["El 30 % de los clientes [paga|pagan] con tarjeta.", "El treinta por ciento de los clientes [paga|pagan] con tarjeta."] },
    { en: "Hundreds of people were waiting outside.", es: "Centenares de personas esperaban afuera.", accept: ["[Centenares|Cientos] de personas esperaban [afuera|fuera]."] },
    { en: "I miscalculated the total.", es: "Calculé mal el total.", accept: [] }
  ],
  translate: [
    { en: "The pass rate went up this year.", es: "El porcentaje de aprobados subió este año.", accept: ["[El porcentaje|La tasa] de aprobados subió este año.", "Este año subió [el porcentaje|la tasa] de aprobados."] },
    { en: "Two of my cousins live in Medellín, but the rest live here in Bogotá.", es: "Dos de mis primos viven en Medellín, pero los demás viven aquí en Bogotá.", accept: ["Dos de mis primos viven en Medellín, pero [los demás|el resto] [viven|vive] [aquí|acá] en Bogotá."] },
    { en: "About a thousand people signed the letter.", es: "Un millar de personas firmó la carta.", accept: ["Un millar de personas [firmó|firmaron] la carta.", "[Alrededor de|Unas|Cerca de] mil personas firmaron la carta."] },
    { en: "Seven is an odd number.", es: "El siete es un número impar.", accept: ["Siete es un número impar."] },
    { en: "The poverty rate is still high. However, according to the city, the figure fell by 3% last year. Forty percent of the new jobs are informal.", es: "La tasa de pobreza sigue alta. Sin embargo, según la alcaldía, la cifra bajó un 3 % el año pasado. El 40 % de los nuevos empleos son informales.", accept: ["[La tasa|El índice] de pobreza sigue alt[a|o]. Sin embargo, según la alcaldía, la cifra bajó un 3 % el año pasado. El 40 % de los nuevos empleos [son|es] informales."] },
    { en: "In total, it comes to forty thousand pesos.", es: "En total, son cuarenta mil pesos.", accept: ["En total son cuarenta mil pesos.", "En total, serían cuarenta mil pesos."] }
  ],
  register: [
    { es: "Ya somos como mil.", en: "There are like a thousand of us already.", when: "chatting with friends, a rough number" },
    { es: "Hay unas cuatrocientas mil personas sin trabajo.", en: "Some four hundred thousand people are out of work.", when: "anywhere, a careful round figure" },
    { es: "La tasa de desempleo se ubicó en el 9,8 %.", en: "The unemployment rate stood at 9.8%.", when: "in a news report or an official bulletin" },
    { es: "Un millar de jóvenes se benefició del programa.", en: "About a thousand young people benefited from the programme.", when: "in a press release or a formal summary" }
  ],
  personal: {
    prompt: "Find three figures about your city or your work: a rate, a share and a rough total. Write them as a short news brief.",
    constraints: [
      { type: "regex", pattern: "(tasa|índice|indice|cifra|porcentaje) de", label: "a measure: *la tasa de*, *el índice de* or *la cifra de*" },
      { type: "regex", pattern: "\\d+(,\\d+)? ?%|por ciento", label: "a percentage: *el 40 %* or *un 3 %*" },
      { type: "containsAny", words: ["centenares de", "decenas de", "millar de", "miles de", "cientos de"], label: "a rough total: *centenares de* or *un millar de*" }
    ],
    model: "La tasa de desempleo en Cali bajó un 1,5 % este año. El 60 % de los empleos nuevos están en el comercio. Centenares de jóvenes consiguieron trabajo en diciembre."
  },
  pitfalls: [
    "*Número* is not a rate: in a report, *la tasa de desempleo*, never *el número de desempleo*.",
    "*Subió un 5 %* is the size of the rise; *subió al 5 %* is the new level. Swapping them changes the news.",
    "*Dos de mis hermanos* says you have more than two; if you have exactly two, *mis dos hermanos*."
  ]
},

"nt-aumento-disminucion-b2": {
  source: "merged",
  hook: {
    line: "A property column reports on rent in Bogotá. It says how much prices moved, names the change as an event, and spots a trend that has no end in sight.",
    es: "El arriendo en Bogotá subió un 8 % este año, el doble que la inflación.\nEn Chapinero los precios casi se duplicaron en cinco años.\nCada vez más familias se van a vivir a municipios cercanos como Chía o Mosquera.\nHubo una caída en la venta de vivienda nueva, sobre todo en el sur.\nSegún los expertos, mientras más suban las tasas, menos gente va a comprar.",
    en: "Rent in Bogotá went up 8% this year, twice the rate of inflation.\nIn Chapinero prices almost doubled in five years.\nMore and more families are moving to nearby towns like Chía or Mosquera.\nThere was a fall in sales of new housing, especially in the south.\nAccording to experts, the more interest rates rise, the fewer people will buy."
  },
  examples: [
    { es: "Las ventas de la panadería se triplicaron en diciembre, pero en enero cayeron casi a la mitad.", en: "The bakery's sales tripled in December, but in January they fell by almost half." },
    { es: "Ahora gano tres veces más que en mi primer trabajo, pero también gasto mucho más en transporte.", en: "I now earn three times more than in my first job, but I also spend much more on transport." },
    { es: "Hubo un aumento del 12 % en el precio del tinto, y la gente lo notó enseguida.", en: "There was a 12% rise in the price of black coffee, and people noticed straight away." }
  ],
  rule: "The same change has two shapes.\nA verb says it happened: *subir*, *bajar*, *crecer*, *caer*, *aumentar*, *disminuir*. *El arriendo subió un 8 %.*\nOr name it as an event, often after *hubo*: *un aumento*, *una subida*, *una caída*, *una disminución*, *un crecimiento*. *Hubo una subida del 8 %.*\nExact multiples: *se duplicó* (doubled), *se triplicó*, or *tres veces más que*.\nA trend with no end point: *cada vez más*, *cada vez menos*. *Cada vez hay más turistas.*\nTwo changes tied together: *mientras más..., más...* Colombia also says *entre más...*; books say *cuanto más...*\n*Una rebaja* is only a price cut.",
  readAndPick: [
    { q: "How much did Chapinero prices grow?", es: "En Chapinero los precios casi se duplicaron en cinco años.",
      options: ["Nearly doubled", "Rose by two percent", "Fell by half"], answer: 0,
      why: "*Casi se duplicaron*: they almost doubled. A two percent rise would be *subieron un 2 %*." },
    { q: "What is the trend in families moving out?", es: "Cada vez más familias se van a vivir a municipios cercanos.",
      options: ["Only one year", "It keeps growing", "It's slowing down now"], answer: 1,
      why: "*Cada vez más* is a trend that keeps going, with no end point in sight." },
    { q: "What does *hubo una caída* report?", es: "Hubo una caída en la venta de vivienda nueva.",
      options: ["A house fell over", "Sales went up", "Sales went down"], answer: 2,
      why: "*Una caída* is the fall named as an event; *hubo* says it happened." },
    { q: "How much more does the speaker earn?", es: "Ahora gano tres veces más que en mi primer trabajo.",
      options: ["Three percent more", "Three times as much", "Three thousand more pesos"], answer: 1,
      why: "*Tres veces más que* is an exact multiple: three times what he earned." },
    { q: "What do the experts link?", es: "Mientras más suban las tasas, menos gente va a comprar.",
      options: ["Rates up, buyers up", "Rates up, buyers down", "Rates down, sellers down too"], answer: 1,
      why: "*Mientras más..., menos...* ties two changes: as one grows, the other shrinks." },
    { q: "What is on offer here?", es: "Anunciaron una rebaja del 20 % en electrodomésticos.",
      options: ["A 20% price cut", "A 20% rise", "Fewer stores open"], answer: 0,
      why: "*Una rebaja* is always a cut in price. For fewer people, *una disminución*." }
  ],
  yourTurn: [
    { en: "Sales doubled this year.", es: "Las ventas se duplicaron este año.", accept: ["Este año las ventas se duplicaron.", "Las ventas se doblaron este año."] },
    { en: "There was a 10% rise in prices.", es: "Hubo un aumento del 10 % en los precios.", accept: ["Hubo [un aumento|una subida|un alza] del 10 % [en|de] los precios."] },
    { en: "There are more and more tourists.", es: "Cada vez hay más turistas.", accept: ["Hay cada vez más turistas."] },
    { en: "The more I work, the less I sleep.", es: "Mientras más trabajo, menos duermo.", accept: ["[Mientras|Entre|Cuanto] más trabajo, menos duermo."] },
    { en: "Fewer and fewer people are getting married.", es: "Cada vez se casa menos gente.", accept: ["Cada vez se casan menos personas.", "Cada vez menos gente se casa.", "Cada vez menos personas se casan."] }
  ],
  translate: [
    { en: "The population has decreased over the last decade.", es: "La población ha disminuido en la última década.", accept: ["La población [disminuyó|bajó|se redujo|ha bajado] en la última década."] },
    { en: "Prices fell by 10%.", es: "Los precios cayeron un 10 %.", accept: ["Los precios [cayeron|bajaron] un 10 %."] },
    { en: "Customers tripled in a week.", es: "Los clientes se triplicaron en una semana.", accept: [] },
    { en: "It's more and more expensive.", es: "Cada vez es más caro.", accept: ["Cada vez está más caro.", "[Es|Está] cada vez más caro."] },
    { en: "Rent went up 8% this year. In some neighbourhoods prices almost doubled. That's why more and more families are leaving the city.", es: "El arriendo subió un 8 % este año. En algunos barrios los precios casi se duplicaron. Por eso, cada vez más familias se van de la ciudad.", accept: ["El arriendo subió un 8 % este año. En algunos barrios los precios casi se duplicaron. Por eso, cada vez más familias se [van de|están yendo de] la ciudad."] },
    { en: "The more he earns, the more he spends.", es: "Mientras más gana, más gasta.", accept: ["[Mientras|Entre|Cuanto] más gana, más gasta."] }
  ],
  register: [
    { es: "¡Eso subió muchísimo!", en: "That's gone up a ton!", when: "with friends, complaining about a price" },
    { es: "El arriendo subió bastante este año.", en: "Rent went up quite a bit this year.", when: "anywhere, a plain report of a rise" },
    { es: "Se registró un incremento del 8 %.", en: "An 8% increase was recorded.", when: "in a news report or a company memo" },
    { es: "La demanda experimentó un crecimiento notable.", en: "Demand saw notable growth.", when: "in economic writing or an annual report" }
  ],
  personal: {
    prompt: "Pick something whose price or numbers changed where you live: rent, a bus fare, a coffee. Describe the change with a verb, then as an event with *hubo*, and add a trend with *cada vez*.",
    constraints: [
      { type: "regex", pattern: "(subi[óo]|baj[óo]|aument[óo]|cay[óo]|creci[óo]|se duplic[óo]|se triplic[óo]|subieron|bajaron|aumentaron|cayeron|crecieron|se duplicaron)", label: "the change as a verb: *subió* or *se duplicó*" },
      { type: "regex", pattern: "hubo (un|una) (aumento|subida|ca[íi]da|bajada|disminuci[óo]n|crecimiento|alza|rebaja)", label: "the change as an event: *hubo una subida*" },
      { type: "containsAny", words: ["cada vez más", "cada vez menos"], label: "a trend: *cada vez más* or *cada vez menos*" }
    ],
    model: "El pasaje de TransMilenio subió doscientos pesos en enero. Hubo una subida parecida el año pasado. Cada vez más gente prefiere ir en bicicleta."
  },
  pitfalls: [
    "*Cada vez más* is a trend over time; for two fixed points, use *más que*: *gana más que su hermano*.",
    "*Una rebaja* is a price cut. For fewer people or lower heat, say *una disminución*.",
    "*Mientras más trabajo, menos duermo* has no word for the: never *el más*."
  ]
},

"nt-proporcion-b2": {
  source: "merged",
  hook: {
    line: "Three flatmates in Bogotá sort out the electricity bill in their group chat. One proposes cutting it into parts, another says who should get which part, and the groceries are split as always.",
    es: "Laura: Llegó el recibo de la luz: 180.000 pesos.\nLaura: Propongo que lo dividamos en tres partes iguales.\nAndrés: Pero Camilo trabajó desde la casa todo el mes, así que gastó casi la mitad.\nAndrés: Entonces repartamos así: la mitad para Camilo y el resto entre Laura y yo.\nCamilo: Bueno, me parece justo. Y el mercado lo pagamos a medias, como siempre.",
    en: "Laura: The electricity bill came: 180,000 pesos.\nLaura: I suggest we divide it into three equal parts.\nAndrés: But Camilo worked from home all month, so he used almost half.\nAndrés: So let's share it out like this: half for Camilo and the rest between Laura and me.\nCamilo: OK, that seems fair. And we split the groceries half and half, as always."
  },
  examples: [
    { es: "Partimos la torta en ocho pedazos y la repartimos entre los vecinos del edificio.", en: "We cut the cake into eight pieces and shared it out among the neighbours in the building." },
    { es: "Solo una cuarta parte de los estudiantes respondió la encuesta, y casi la mitad dejó preguntas en blanco.", en: "Only a quarter of the students answered the survey, and almost half left questions blank." },
    { es: "Dos tercios de los vecinos votaron a favor, y la quinta parte no fue a la asamblea.", en: "Two thirds of the neighbours voted in favour, and a fifth didn't go to the meeting." }
  ],
  rule: "English says split for two different jobs. Spanish asks which one.\nCutting into parts: *partir* or *dividir*, with *por la mitad* or *en* and a number: *Dividimos la cuenta en tres.*\nHanding the parts out: *repartir* or *distribuir*, with *entre* and the people: *Repartimos la plata entre los dos.*\nPaying half each: *a medias*.\nA fraction works like *la mayoría de* and takes *de*: *la mitad de*, *un tercio de*, *dos tercios de*, *un cuarto de*. Beyond those, the order word and *parte*: *la quinta parte*, *la décima parte*.\n*Medio* goes straight before the thing: *medio kilo*. *La mitad* needs *de*: *la mitad del pan*.",
  readAndPick: [
    { q: "Who gets the parts here?", es: "Repartimos la torta entre los vecinos.",
      options: ["Nobody, yet", "The neighbours", "Just the cook who made it"], answer: 1,
      why: "*Repartir... entre* hands the pieces out, and the people come after *entre*." },
    { q: "How much of the bill does Camilo pay?", es: "La mitad para Camilo y el resto entre Laura y yo.",
      options: ["The whole bill", "A third", "Half of it"], answer: 2,
      why: "*La mitad para Camilo*: half is his, and *el resto* goes to the other two." },
    { q: "How many students answered?", es: "Solo una cuarta parte de los estudiantes respondió.",
      options: ["One in four", "Four of them", "A tenth"], answer: 0,
      why: "*Una cuarta parte* is a quarter, one in four. A tenth is *la décima parte*." },
    { q: "How do they pay for the groceries?", es: "El mercado lo pagamos a medias.",
      options: ["Each pays half", "One of them pays", "Monthly"], answer: 0,
      why: "*A medias* is half each. In Colombia *el mercado* is the groceries." },
    { q: "What does *partir* do here?", es: "Partimos la cuenta por la mitad.",
      options: ["Leaves it unpaid", "Pays it all", "Cuts it in two"], answer: 2,
      why: "*Partir por la mitad* cuts it into two halves; nobody is named as getting them." },
    { q: "What share stayed away?", es: "La quinta parte no fue a la asamblea.",
      options: ["One in five", "Only five", "Half the building"], answer: 0,
      why: "*La quinta parte* is a fifth: one in every five neighbours." }
  ],
  yourTurn: [
    { en: "Shall we split the bill in half?", es: "¿Partimos la cuenta por la mitad?", accept: ["¿[Partimos|Dividimos] la cuenta por la mitad?"] },
    { en: "They shared out the inheritance among the children.", es: "Repartieron la herencia entre los hijos.", accept: ["[Repartieron|Distribuyeron] la herencia entre los hijos."] },
    { en: "Two thirds of the people support the idea.", es: "Dos tercios de la gente apoya la idea.", accept: ["Dos tercios de la gente [apoya|apoyan] la idea.", "Dos tercios de las personas apoyan la idea."] },
    { en: "Half of the money is for the rent.", es: "La mitad de la plata es para el arriendo.", accept: ["La mitad [de la plata|del dinero] es para el arriendo."] },
    { en: "A fifth of the budget goes on transport.", es: "La quinta parte del presupuesto se va en transporte.", accept: ["La quinta parte del presupuesto se [va|gasta] en transporte.", "Un quinto del presupuesto se [va|gasta] en transporte."] }
  ],
  translate: [
    { en: "We divided the group into three teams.", es: "Dividimos el grupo en tres equipos.", accept: [] },
    { en: "Shall we go halves on the taxi?", es: "¿Pagamos el taxi a medias?", accept: [] },
    { en: "Only a quarter answered the survey.", es: "Solo una cuarta parte respondió la encuesta.", accept: ["Solo una cuarta parte respondió a la encuesta.", "Solo un cuarto respondió [la|a la] encuesta."] },
    { en: "I bought half a kilo of cheese.", es: "Compré medio kilo de queso.", accept: [] },
    { en: "The electricity bill came. Let's divide it into three parts. But Camilo used almost half, so he pays more.", es: "Llegó el recibo de la luz. Dividámoslo en tres partes. Pero Camilo gastó casi la mitad, así que él paga más.", accept: ["Llegó el recibo de la luz. [Dividámoslo|Vamos a dividirlo] en tres partes. Pero Camilo gastó casi la mitad, así que [él paga|paga] más."] },
    { en: "They handed out the flyers all over the neighbourhood.", es: "Repartieron los volantes por todo el barrio.", accept: ["[Repartieron|Distribuyeron] los [volantes|folletos] por todo el barrio."] }
  ],
  register: [
    { es: "¿Hacemos vaca?", en: "Shall we chip in?", when: "in Colombia, friends pooling money for something" },
    { es: "Pagamos a medias.", en: "We go halves.", when: "anywhere, splitting a cost between two" },
    { es: "Lo repartimos entre todos.", en: "We'll share it out among everyone.", when: "in a group, a fair split" },
    { es: "Dos tercios de los encuestados apoyan la medida.", en: "Two thirds of those surveyed support the measure.", when: "in a news report or a survey summary" }
  ],
  personal: {
    prompt: "Think of something you share: a flat, a bill, a family job. Say how it is cut up, who gets which part, and give one fraction.",
    constraints: [
      { type: "regex", pattern: "(partimos|partieron|partió|parten|dividimos|dividieron|dividió|dividen|divide|partir|dividir)", label: "the cutting: *partimos* or *dividimos*" },
      { type: "regex", pattern: "(reparti|repart[oe]|distribu)", label: "the sharing out: *repartimos... entre*" },
      { type: "containsAny", words: ["la mitad", "un tercio", "dos tercios", "un cuarto", "cuarta parte", "quinta parte", "a medias"], label: "a fraction: *la mitad de* or *un tercio de*" }
    ],
    model: "En mi casa dividimos el arriendo en cuatro partes. Pero repartimos la luz entre los tres que trabajan desde la casa. Mi hermano paga la mitad del internet porque juega en línea toda la noche."
  },
  pitfalls: [
    "*Partimos la herencia entre los hijos* only cuts: for who gets what, *repartimos... entre*.",
    "*Un medio de la gente* is not Spanish: half of is *la mitad de*.",
    "*La mitad del pan* takes *de*, but *medio pan* takes none."
  ]
},

"nt-cantidad-relativa-b2": {
  source: "merged",
  hook: {
    line: "A march fills the Séptima in Bogotá, and nobody agrees on how many came. The news piece gives every figure without committing to any of them.",
    es: "Según los organizadores, unas cuarenta mil personas marcharon por la carrera Séptima.\nLa Policía habló de entre quince y veinte mil.\nLa marcha duró alrededor de cuatro horas y hubo al menos tres puntos de concentración.\nUn vendedor de agua contó que vendió como quinientas botellas.\nComo máximo, el tráfico estará cerrado hasta las seis de la tarde.",
    en: "According to the organizers, some forty thousand people marched along Carrera Séptima.\nThe police spoke of between fifteen and twenty thousand.\nThe march lasted around four hours and there were at least three gathering points.\nA water seller said he sold like five hundred bottles.\nAt the latest, the road will be closed to traffic until six in the evening."
  },
  examples: [
    { es: "Le puse como trescientos gramos de harina a la masa, pero quedó un poco seca.", en: "I put like three hundred grams of flour in the dough, but it came out a bit dry." },
    { es: "Necesitamos al menos tres días para terminar el informe, y como máximo una semana.", en: "We need at least three days to finish the report, and a week at most." },
    { es: "El concierto reunió a entre treinta y cuarenta mil personas en el parque Simón Bolívar.", en: "The concert brought together between thirty and forty thousand people in Simón Bolívar park." }
  ],
  rule: "Nobody counts a crowd exactly, so Spanish has words for roughly.\nIn front of the number: *unos* or *unas* (*unas cien personas*), *alrededor de*, *aproximadamente*, *cerca de*. In writing, these.\nIn conversation: *como* (*como veinte minutos*), *más o menos*, *un montón de* for a lot.\nA range: *entre... y...*: *entre quince y veinte mil*.\nA floor: *al menos* or *por lo menos*, that many or more. A ceiling: *como máximo*, no more.\nFor a guess about the past, the news uses the conditional: *Habría unas cien personas* means there were probably about a hundred.",
  readAndPick: [
    { q: "How exact is the police figure?", es: "La Policía habló de entre quince y veinte mil.",
      options: ["An exact count", "A range, not exact", "No figure given at all"], answer: 1,
      why: "*Entre... y...* gives a range: somewhere from fifteen to twenty thousand." },
    { q: "How many gathering points were there?", es: "Hubo al menos tres puntos de concentración.",
      options: ["Three or more", "Three at most", "Exactly three"], answer: 0,
      why: "*Al menos* sets a floor: three, maybe more. A ceiling is *como máximo*." },
    { q: "What does the seller's *como* mean?", es: "Vendí como quinientas botellas.",
      options: ["Exactly", "About, roughly", "In the way that"], answer: 1,
      why: "*Como* before a number is a chatty roughly. In a report, *alrededor de*." },
    { q: "What is the latest the road reopens?", es: "Como máximo, el tráfico estará cerrado hasta las seis.",
      options: ["By six at the latest", "At six at the earliest", "Six hours from now"], answer: 0,
      why: "*Como máximo* is a ceiling: it won't stay closed past six." },
    { q: "What does the reporter mean?", es: "Habría unas cien personas en la plaza.",
      options: ["A hundred will come", "Probably about a hundred", "A hundred would come if invited"], answer: 1,
      why: "*Habría* here is a guess about the past: there were probably about a hundred." }
  ],
  yourTurn: [
    { en: "Around a hundred people attended.", es: "Asistieron alrededor de cien personas.", accept: ["Asistieron [alrededor de|unas|aproximadamente|cerca de] cien personas.", "[Alrededor de|Unas|Aproximadamente|Cerca de] cien personas asistieron."] },
    { en: "We need at least three days.", es: "Necesitamos al menos tres días.", accept: ["Necesitamos [al menos|por lo menos|mínimo] tres días."] },
    { en: "I put in like four hundred grams of flour.", es: "Le puse como cuatrocientos gramos de harina.", accept: ["[Le puse|Puse|Le eché|Eché] como cuatrocientos gramos de harina."] },
    { en: "Fifty came, at most.", es: "Vinieron cincuenta como máximo.", accept: ["Vinieron como máximo cincuenta.", "Como máximo vinieron cincuenta."] }
  ],
  translate: [
    { en: "Between thirty and forty thousand people arrived.", es: "Llegaron entre treinta y cuarenta mil personas.", accept: ["Entre treinta y cuarenta mil personas llegaron."] },
    { en: "There was a ton of people in the square.", es: "Había un montón de gente en la plaza.", accept: ["Había [un montón de|muchísima] gente en la plaza."] },
    { en: "We'll take an hour at most.", es: "Nos vamos a demorar una hora como máximo.", accept: ["[Nos vamos a demorar|Nos demoraremos|Vamos a tardar|Tardaremos] una hora como máximo.", "[Nos vamos a demorar|Nos demoraremos|Vamos a tardar|Tardaremos] como máximo una hora.", "Como máximo, [nos vamos a demorar|nos demoraremos|vamos a tardar|tardaremos] una hora."] },
    { en: "The meeting lasted about four hours.", es: "La reunión duró alrededor de cuatro horas.", accept: ["La reunión duró [alrededor de|unas|más o menos|como|cerca de] cuatro horas."] },
    { en: "According to the organizers, some forty thousand people marched. The police spoke of between fifteen and twenty thousand. There were probably about thirty thousand.", es: "Según los organizadores, marcharon unas cuarenta mil personas. La Policía habló de entre quince y veinte mil. Habría unas treinta mil.", accept: ["Según los organizadores, [marcharon unas cuarenta mil personas|unas cuarenta mil personas marcharon]. La Policía habló de entre quince y veinte mil. [Habría|Probablemente había] unas treinta mil."] },
    { en: "The hotel must have had around a hundred rooms.", es: "El hotel tendría alrededor de cien habitaciones.", accept: ["El hotel tendría [alrededor de|unas|como] cien habitaciones.", "El hotel debía de tener [alrededor de|unas] cien habitaciones."] }
  ],
  register: [
    { es: "Éramos como veinte.", en: "There were like twenty of us.", when: "telling friends about a party" },
    { es: "Había unas veinte personas.", en: "There were some twenty people.", when: "anywhere, a careful round number" },
    { es: "Asistieron aproximadamente veinte personas.", en: "Approximately twenty people attended.", when: "in minutes, a report or a formal email" },
    { es: "Habría unas veinte mil personas, según fuentes oficiales.", en: "There were reportedly some twenty thousand people, according to official sources.", when: "in the news, a figure nobody has confirmed" }
  ],
  personal: {
    prompt: "Describe a crowd or a queue you were part of: a concert, a match, a bank on a Monday. Give a rough number, a range, and a floor or a ceiling.",
    constraints: [
      { type: "containsAny", words: ["unos ", "unas ", "alrededor de", "aproximadamente", "como ", "más o menos", "cerca de"], label: "a rough number: *unas cien* or *alrededor de*" },
      { type: "regex", pattern: "entre [a-záéíóúñ0-9.]+ y [a-záéíóúñ0-9.]+", label: "a range: *entre quince y veinte*" },
      { type: "containsAny", words: ["al menos", "por lo menos", "como máximo", "como mínimo"], label: "a floor or a ceiling: *al menos* or *como máximo*" }
    ],
    model: "En el concierto de Shakira había unas sesenta mil personas. La fila para entrar duró entre dos y tres horas. Al menos cuatro amigos míos se quedaron sin boleta."
  },
  pitfalls: [
    "*Como veinte* is chat. In a report, *alrededor de veinte* or *unas veinte*.",
    "*Al menos* is a floor and *como máximo* a ceiling: swapping them reverses the promise.",
    "*El hotel tendría cien habitaciones* is a guess about the past, not would have: it probably had."
  ]
},

"gn-expositiva-b2": {
  source: "merged",
  hook: {
    line: "A science page explains the páramo to its readers. In six lines it opens with a question, defines the thing, compares it, sorts it into parts, points at what matters and closes on why it all counts.",
    es: "¿Qué es un páramo?\nSe llama páramo al ecosistema de alta montaña que está entre el bosque y la nieve.\nFunciona como una esponja: guarda el agua de la lluvia y la suelta poco a poco.\nSe divide en tres franjas: el subpáramo, el páramo propiamente dicho y el superpáramo.\nCabe destacar que Colombia tiene casi la mitad de los páramos del mundo.\nEn resumen, sin páramos, Bogotá se quedaría sin la mayor parte de su agua.",
    en: "What is a páramo?\nA páramo is the name given to the high mountain ecosystem that lies between the forest and the snow.\nIt works like a sponge: it stores rainwater and releases it little by little.\nIt is divided into three bands: the subpáramo, the páramo proper and the superpáramo.\nIt is worth noting that Colombia has almost half of the world's páramos.\nIn short, without páramos, Bogotá would lose most of its water."
  },
  examples: [
    { es: "Se llama tinto al café negro que se toma en Colombia a cualquier hora del día.", en: "Tinto is the name given to the black coffee people drink in Colombia at any time of day." },
    { es: "El sistema está formado por tres partes, y cada una se explica por separado a continuación.", en: "The system is made up of three parts, and each one is explained separately below." },
    { es: "Como pueden ver en la gráfica, las ventas bajaron en marzo y se recuperaron en junio.", en: "As you can all see on the chart, sales fell in March and recovered in June." }
  ],
  rule: "An explanation has three parts, and each has its Spanish.\nOpen a topic one of four ways: a definition (*Se llama páramo a...*), a general fact, a question you then answer (*¿Qué es un páramo?*) or a comparison (*Funciona como una esponja*).\nDevelop it by sorting: *Está formado por...*, *Se divide en...*, then each part in turn.\nPoint at what matters: *Cabe destacar que...*, *Cabe señalar que...* The fact after it stays ordinary, and it belongs on the page.\nClose by saying why it mattered, with nothing new: *En resumen,...*, *En definitiva,...*\nSpoken to a room, use *ustedes*: *Como pueden ver...*, *A continuación...*, *Para terminar...*",
  readAndPick: [
    { q: "How does the article open?", es: "¿Qué es un páramo?",
      options: ["With a joke", "With a question", "With a list of figures"], answer: 1,
      why: "A question the text then answers is one of the four ways to open a topic." },
    { q: "Which opener is this?", es: "Se llama páramo al ecosistema de alta montaña.",
      options: ["A definition", "A comparison", "A conclusion"], answer: 0,
      why: "*Se llama X a...* defines: it says what the name refers to." },
    { q: "What does *funciona como una esponja* do?", es: "Funciona como una esponja: guarda el agua y la suelta.",
      options: ["Gives a comparison", "Says it really is one", "Ends the article"], answer: 0,
      why: "*Funciona como* compares it with something every reader knows." },
    { q: "Where would you read *cabe destacar*?", es: "Cabe destacar que Colombia tiene casi la mitad de los páramos.",
      options: ["Texting a friend", "In an article", "At a party"], answer: 1,
      why: "*Cabe destacar* is written Spanish; in a chat it sounds like a press release." },
    { q: "What should *en resumen* bring?", es: "En resumen, sin páramos, Bogotá se quedaría sin la mayor parte de su agua.",
      options: ["A question to the reader", "A brand new fact", "Why it all mattered"], answer: 2,
      why: "The close adds nothing new: it reminds the reader why the topic counts." },
    { q: "Who is the speaker talking to?", es: "Como pueden ver en la gráfica, las ventas bajaron.",
      options: ["Her best friend", "A room of people", "Only to herself, quietly"], answer: 1,
      why: "*Pueden* is the *ustedes* form: she is presenting to a group." }
  ],
  yourTurn: [
    { en: "What is a paragraph?", es: "¿Qué es un párrafo?", accept: [] },
    { en: "It is worth noting that this is the first time it has happened.", es: "Cabe destacar que es la primera vez que ocurre.", accept: ["Cabe [destacar|señalar|mencionar] que es la primera vez que [ocurre|pasa|sucede]."] },
    { en: "It is divided into three parts.", es: "Se divide en tres partes.", accept: [] },
    { en: "As you can see on the screen, sales went down in March. (to a room)", es: "Como pueden ver en la pantalla, las ventas bajaron en marzo.", accept: ["Como ustedes pueden ver en la pantalla, las ventas bajaron en marzo."] },
    { en: "In short, punctuation is essential for writing.", es: "En resumen, la puntuación es fundamental para la escritura.", accept: ["[En resumen|En definitiva|En conclusión], la puntuación es [fundamental|esencial] para la escritura."] }
  ],
  translate: [
    { en: "Tinto is the name given to black coffee in Colombia.", es: "Se llama tinto al café negro en Colombia.", accept: ["Se le llama tinto al café negro en Colombia.", "En Colombia se [llama|le llama] tinto al café negro."] },
    { en: "The páramo works like a sponge.", es: "El páramo funciona como una esponja.", accept: [] },
    { en: "The system is made up of three parts.", es: "El sistema está formado por tres partes.", accept: ["El sistema está [formado|compuesto] por tres partes."] },
    { en: "Next, I'm going to show you the figures for June. (to a room)", es: "A continuación, les voy a mostrar las cifras de junio.", accept: ["A continuación, [les voy a mostrar|voy a mostrarles|les muestro] las cifras de junio."] },
    { en: "What is a páramo? It's a high mountain ecosystem. It's worth pointing out that it stores the water the cities drink.", es: "¿Qué es un páramo? Es un ecosistema de alta montaña. Cabe señalar que guarda el agua que toman las ciudades.", accept: ["¿Qué es un páramo? Es un ecosistema de alta montaña. Cabe [señalar|destacar|mencionar] que guarda el agua que [toman|beben] las ciudades."] },
    { en: "Many of you will probably know this park. (to a room)", es: "Muchos de ustedes seguramente conocerán este parque.", accept: ["Muchos de ustedes [seguramente|probablemente|ya] conocerán este parque.", "Seguramente muchos de ustedes conocen este parque."] }
  ],
  register: [
    { es: "O sea, es como una esponja.", en: "I mean, it's like a sponge.", when: "explaining it to a friend over coffee" },
    { es: "Funciona como una esponja.", en: "It works like a sponge.", when: "anywhere, a plain comparison" },
    { es: "Como pueden ver en la diapositiva...", en: "As you can see on the slide...", when: "presenting to a room, as ustedes" },
    { es: "Cabe destacar que el ecosistema es frágil.", en: "It is worth noting that the ecosystem is fragile.", when: "in an article, a report or an essay" }
  ],
  personal: {
    prompt: "Explain something you know well to a reader who doesn't: a dish, a sport, a place. Open with a definition or a question, sort it into parts, and close with *en resumen*.",
    constraints: [
      { type: "regex", pattern: "se (le )?llama [a-záéíóúñ]+ a|¿qu[ée] es|funciona como|es como (un|una)", label: "an opener: *se llama... a* or *¿qué es...?*" },
      { type: "regex", pattern: "(está|esta) (formad[oa]|compuest[oa]) por|se divide en|tiene (dos|tres|cuatro|cinco) partes", label: "the parts: *está formado por* or *se divide en*" },
      { type: "containsAny", words: ["en resumen", "en definitiva", "en conclusión", "en pocas palabras"], label: "a close: *en resumen*" }
    ],
    model: "¿Qué es el tejo? Es el deporte nacional de Colombia. Se juega en una cancha con dos tableros de barro. Cada tablero tiene mechas con pólvora, y el objetivo es hacerlas explotar con un disco de metal. El partido se divide en rondas, y cada ronda suma puntos. En resumen, es puntería, cerveza y mucho ruido."
  },
  pitfalls: [
    "An *en resumen* that adds a new fact isn't a summary: close on why the topic mattered.",
    "*Cabe destacar* is for the page; said aloud to friends it sounds like a press release.",
    "In a talk, *como puedes ver* addresses one person: to a room, *como pueden ver*."
  ]
},

"nt-realidad-ficcion-b2": {
  source: "merged",
  hook: {
    line: "A fact-checking site looks at a video everyone shared this week. Its short report sorts the real from the invented, and the truth comes out at the end.",
    es: "Circula en redes un video de un oso de anteojos dentro de un bus de TransMilenio.\nMuchos lo compartieron como si fuera real, pero el video resultó ser falso.\nEs una simulación hecha con inteligencia artificial, y el bus ni siquiera existe.\nResulta que su autor es un estudiante de diseño que solo quería probar un programa.\nÉl dice que se inventó la historia para una clase y que nunca se imaginó que llegaría tan lejos.",
    en: "A video of a spectacled bear inside a TransMilenio bus is going round on social media.\nMany people shared it as if it were real, but the video turned out to be fake.\nIt's a simulation made with artificial intelligence, and the bus doesn't even exist.\nIt turns out its author is a design student who only wanted to test a program.\nHe says he made the story up for a class and never imagined it would go so far."
  },
  examples: [
    { es: "Por fin se le cumplió el sueño de conocer el mar, a los setenta años.", en: "Her dream of seeing the sea finally came true, at seventy." },
    { es: "El personaje es completamente ficticio, aunque muchos lectores creen que la autora se inspiró en su abuela.", en: "The character is entirely fictional, although many readers believe the author based her on her grandmother." },
    { es: "El problema no es abstracto: es muy concreto, son trescientas familias sin agua desde el lunes.", en: "The problem isn't abstract: it's very concrete, three hundred families without water since Monday." }
  ],
  rule: "Words for what isn't real: *ficticio* (invented on purpose, like a character), *irreal* (not real, nobody invented it), *una simulación* (a staged fake), *surrealista* (so strange it feels like a dream, said of real life).\n*Inventarse* and *imaginarse* take *se*: *se inventó la historia*.\nA dream isn't done, it comes true, and it happens to you: *se me cumplió el sueño*, *se le cumplieron los deseos*. A promise is kept by a person, with no *se*: *cumplió su palabra*.\nWhen the truth comes out: *resultó ser falso*, or start with *Resulta que...*\n*Concreto* is touchable and specific; *abstracto* is only an idea.",
  readAndPick: [
    { q: "What happened to the video?", es: "El video resultó ser falso.",
      options: ["It turned out fake", "It went missing", "Someone proved it real"], answer: 0,
      why: "*Resultó ser* is turned out to be: the truth came out, and it was fake." },
    { q: "What did the student do with the story?", es: "Se inventó la historia para una clase.",
      options: ["He found it online", "He made it up", "He lived it"], answer: 1,
      why: "*Inventarse* is to make something up; the *se* stays with it." },
    { q: "Who is the character based on?", es: "El personaje es completamente ficticio.",
      options: ["A real neighbour of hers", "Nobody: he's made up", "The author"], answer: 1,
      why: "*Ficticio* is invented on purpose: a character who never existed." },
    { q: "What does *se le cumplió el sueño* say?", es: "Por fin se le cumplió el sueño de conocer el mar.",
      options: ["She dreamt", "She gave up the dream", "Her dream came true"], answer: 2,
      why: "The dream is the subject and it happens to her: it came true." },
    { q: "How real is the problem?", es: "El problema no es abstracto: es muy concreto.",
      options: ["Only an idea", "Specific and real", "Not worth mentioning"], answer: 1,
      why: "*Concreto* is specific and touchable; *abstracto* would be only an idea." },
    { q: "What does *surrealista* say about the scene?", es: "Esto es surrealista, no puedo creer lo que está pasando.",
      options: ["It's so odd it seems unreal", "It's dull and ordinary", "It's a museum painting from the past"], answer: 0,
      why: "Said of real life, *surrealista* is so strange it feels like a dream." }
  ],
  yourTurn: [
    { en: "The news turned out to be false.", es: "La noticia resultó ser falsa.", accept: [] },
    { en: "It turns out nobody knew anything.", es: "Resulta que nadie sabía nada.", accept: [] },
    { en: "My dream came true.", es: "Se me cumplió el sueño.", accept: ["Mi sueño se cumplió.", "Se cumplió mi sueño."] },
    { en: "He always makes up stories.", es: "Siempre se inventa historias.", accept: ["Siempre [se inventa|está inventando|está inventándose|inventa] historias."] },
    { en: "She kept her promise.", es: "Cumplió su promesa.", accept: ["Ella cumplió su promesa."] }
  ],
  translate: [
    { en: "The character is entirely fictional.", es: "El personaje es completamente ficticio.", accept: ["El personaje es [completamente|totalmente] ficticio."] },
    { en: "It was just a simulation; nobody got hurt.", es: "Fue solo una simulación; nadie salió herido.", accept: ["[Fue solo|Solo fue] una simulación[;|,|.] nadie salió herido."] },
    { en: "The concept is too abstract to explain like that.", es: "El concepto es demasiado abstracto para explicarlo así.", accept: [] },
    { en: "She used to daydream about living in another country.", es: "Soñaba despierta con vivir en otro país.", accept: [] },
    { en: "Many people shared the video as if it were real. But it turned out to be fake. It turns out the author only wanted to test a program.", es: "Mucha gente compartió el video como si fuera real. Pero resultó ser falso. Resulta que el autor solo quería probar un programa.", accept: ["[Mucha gente compartió|Muchos compartieron] el video como si fuera real. Pero resultó ser falso. Resulta que el autor solo quería probar un programa."] },
    { en: "His dream of travelling the world finally came true.", es: "Por fin se le cumplió el sueño de viajar por el mundo.", accept: ["Por fin se cumplió su sueño de viajar por el mundo.", "Por fin se le cumplió el sueño de recorrer el mundo."] }
  ],
  register: [
    { es: "¡Eso es puro cuento!", en: "That's a load of rubbish!", when: "with friends, about a story you don't believe" },
    { es: "Esa historia no es real.", en: "That story isn't real.", when: "anywhere, said plainly" },
    { es: "La información resultó ser falsa.", en: "The information turned out to be false.", when: "in a news report or a fact check" },
    { es: "Los hechos narrados son ficticios.", en: "The events described are fictional.", when: "in the small print at the start of a film" }
  ],
  personal: {
    prompt: "Write about one rumour you heard that turned out to be false, and one dream that came true for you or someone close.",
    constraints: [
      { type: "regex", pattern: "result(ó|o|aron) ser|resulta que", label: "the truth coming out: *resultó ser* or *resulta que*" },
      { type: "regex", pattern: "se (me |te |le |nos |les )?cumpli(ó|o|eron)", label: "a dream coming true: *se me cumplió*" },
      { type: "containsAny", words: ["se inventó", "se inventaron", "me inventé", "ficticio", "ficticia", "puro cuento", "simulación", "me imaginé", "se imaginó"], label: "a word for the unreal: *se inventó* or *ficticio*" }
    ],
    model: "En mi colegio decían que el rector se iba a vivir a España, pero resultó ser puro cuento. Alguien se inventó la historia en un grupo de chat. En cambio, a mi tía se le cumplió el sueño de abrir su propia panadería en Cali."
  },
  pitfalls: [
    "*Cumplí mi sueño* sounds like a task done; a dream comes true to you: *se me cumplió el sueño*.",
    "*Ficticio* is invented on purpose; for a vague not real, *irreal*.",
    "*Resultó ser* is turned out to be, not resulted in: for a consequence, *trajo como resultado*."
  ]
},

"nt-acontecimiento-b2": {
  source: "merged",
  hook: {
    line: "A local news brief covers a weekend of changed plans in Bogotá: a concert moved, a strike lifted, and a new date that lands by pure chance on the day of a big match.",
    es: "El concierto previsto para el sábado en el estadio El Campín se aplazó por la lluvia.\nLa decisión se produjo dos horas antes de abrir las puertas.\nSegún la organización, no ocurrió ningún incidente durante la evacuación.\nEl paro de transportadores, que estaba convocado para el lunes, se levantó anoche.\nY por pura casualidad, la nueva fecha coincide con el partido de la Selección.",
    en: "The concert planned for Saturday at El Campín stadium was postponed because of the rain.\nThe decision came two hours before the doors opened.\nAccording to the organizers, no incident occurred during the evacuation.\nThe truckers' strike, which had been called for Monday, was called off last night.\nAnd by pure chance, the new date clashes with the national team's match."
  },
  examples: [
    { es: "El accidente se produjo de madrugada en la autopista Norte, por causas que todavía se desconocen.", en: "The accident happened in the small hours on the Autopista Norte, for reasons still unknown." },
    { es: "Fue una casualidad que nos encontráramos en el aeropuerto: ninguno sabía que el otro viajaba.", en: "It was a coincidence that we met at the airport: neither of us knew the other was travelling." },
    { es: "Suspendieron el partido en el segundo tiempo por la tormenta, y lo van a terminar el martes.", en: "They stopped the match in the second half because of the storm, and they're going to finish it on Tuesday." }
  ],
  rule: "For happened there is a ladder. With friends: *pasar* (*¿Qué pasó?*). Neutral or written: *ocurrir*, *suceder*. In the news: *producirse*, always with *se*: *Se produjo un incendio.* The verb agrees with the event: *se produjeron dos choques*. *Producirse* is for events, never for people.\nBy chance: *por casualidad*, *¡Qué casualidad!*, and *fue una casualidad que* with the subjunctive. *Casualidad* is never a casualty; that's *una víctima*.\nWhen a plan changes: *aplazar* or *posponer* (to a later date), *suspender* (stop or call off), *cancelar* (for good). A strike in Colombia is *un paro*: you *convocar* it and *levantar* it.",
  readAndPick: [
    { q: "What happened to the concert?", es: "El concierto se aplazó por la lluvia.",
      options: ["It's on a later date now", "It went ahead", "It was cancelled for good"], answer: 0,
      why: "*Aplazar* moves it later. Cancelled for good would be *se canceló*." },
    { q: "Where would you read *se produjo*?", es: "La decisión se produjo dos horas antes.",
      options: ["Texting", "In a news report", "On a birthday card"], answer: 1,
      why: "*Producirse* is the news word for happened; with friends, *pasó*." },
    { q: "What does *por pura casualidad* say about the clash?", es: "Por pura casualidad, la nueva fecha coincide con el partido.",
      options: ["Nobody planned it", "People got hurt", "It was done on purpose"], answer: 0,
      why: "*Casualidad* is chance, never a casualty: nobody planned the clash." },
    { q: "What happened to the strike?", es: "El paro de transportadores se levantó anoche.",
      options: ["It started up", "It was called off", "It spread to other cities"], answer: 1,
      why: "A strike in Colombia is *un paro*, and *levantarlo* is to call it off." },
    { q: "What will they do with the match?", es: "Suspendieron el partido y lo van a terminar el martes.",
      options: ["Forget about it", "Replay it from the start", "Finish it Tuesday"], answer: 2,
      why: "*Suspender* stops it; the rest is played on Tuesday." }
  ],
  yourTurn: [
    { en: "What happened last night?", es: "¿Qué pasó anoche?", accept: [] },
    { en: "The accident occurred at dawn. (in the news)", es: "El accidente se produjo de madrugada.", accept: ["El accidente [se produjo|ocurrió] de madrugada."] },
    { en: "What a coincidence running into you here!", es: "¡Qué casualidad encontrarte aquí!", accept: ["¡Qué casualidad [encontrarte|verte] [aquí|acá]!"] },
    { en: "They postponed the meeting until Monday.", es: "Aplazaron la reunión para el lunes.", accept: ["[Aplazaron|Pospusieron|Corrieron|Pasaron] la reunión [para|hasta] el lunes."] },
    { en: "It happened when we least expected it.", es: "Ocurrió cuando menos lo esperábamos.", accept: ["[Ocurrió|Pasó|Sucedió] cuando menos lo esperábamos."] }
  ],
  translate: [
    { en: "Several incidents occurred during the demonstration.", es: "Se produjeron varios incidentes durante la manifestación.", accept: ["[Se produjeron|Ocurrieron|Hubo] varios incidentes durante la [manifestación|marcha]."] },
    { en: "They called off the match because of the bad weather.", es: "Suspendieron el partido por el mal tiempo.", accept: ["Suspendieron el partido [por el|debido al] mal tiempo."] },
    { en: "It was a coincidence that we met at the airport.", es: "Fue una casualidad que nos encontráramos en el aeropuerto.", accept: ["Fue una casualidad que nos [encontráramos|viéramos] en el aeropuerto.", "Fue (una) casualidad encontrarnos en el aeropuerto."] },
    { en: "The strike was lifted last night.", es: "El paro se levantó anoche.", accept: ["Anoche se levantó el paro.", "Levantaron el paro anoche."] },
    { en: "The concert was postponed because of the rain. Luckily, nothing happened during the evacuation. The new date is the 20th.", es: "El concierto se aplazó por la lluvia. Por suerte, no pasó nada durante la evacuación. La nueva fecha es el 20.", accept: ["El concierto se [aplazó|pospuso] por la lluvia. Por suerte, no [pasó|ocurrió] nada durante la evacuación. La nueva fecha es el 20."] },
    { en: "The fire broke out in a warehouse in the south of the city.", es: "El incendio se produjo en una bodega del sur de la ciudad.", accept: ["El incendio se produjo en una bodega en el sur de la ciudad.", "El incendio [ocurrió|empezó] en una bodega del sur de la ciudad."] }
  ],
  register: [
    { es: "¿Qué pasó, pues?", en: "So what happened?", when: "in Colombia, catching up with a friend" },
    { es: "¿Qué ocurrió exactamente?", en: "What exactly happened?", when: "asking for a careful account at work" },
    { es: "Se produjo un fuerte aguacero en la tarde.", en: "There was a heavy downpour in the afternoon.", when: "in a news bulletin or a weather report" },
    { es: "El evento queda aplazado hasta nuevo aviso.", en: "The event is postponed until further notice.", when: "in an official notice or a ticket email" }
  ],
  personal: {
    prompt: "Write a short news item about something that happened in your area: say what happened, whether it was chance, and what was postponed or called off.",
    constraints: [
      { type: "regex", pattern: "se produj(o|eron)|ocurri(ó|o|eron)|sucedi(ó|o|eron)", label: "the event: *se produjo* or *ocurrió*" },
      { type: "containsAny", words: ["casualidad", "coincidencia", "por suerte", "de pura suerte"], label: "chance: *por casualidad* or *fue una casualidad*" },
      { type: "regex", pattern: "(aplaz|pospus|pospon|suspend|cancel|levant)", label: "a change of plan: *se aplazó*, *suspendieron* or *se levantó*" }
    ],
    model: "El viernes se produjo un apagón en todo el barrio. Según la empresa de energía, fue una casualidad: un árbol cayó sobre los cables. Por eso suspendieron las clases en el colegio y aplazaron la feria hasta el domingo."
  },
  pitfalls: [
    "*Casualidad* is chance, never a casualty: the people hurt are *víctimas* or *heridos*.",
    "*Producirse* is for events: *se produjo un choque*, never *se produjo el alcalde*.",
    "*Aplazar* moves a date later; *cancelar* drops it for good. Don't promise a new date with *cancelar*."
  ]
},

"nt-exito-logro-b2": {
  source: "merged",
  hook: {
    line: "A newspaper profile of a runner from Cauca tells a long story in five lines: the start, the failures, what she became and how success changed her, or didn't.",
    es: "Nació en un pueblo del Cauca y empezó a correr descalza a los diez años.\nFracasó en sus dos primeros mundiales, pero nunca se rindió.\nCon los años llegó a ser una de las mejores atletas del continente.\nEn 2024 alcanzó los primeros puestos del ranking mundial.\nHoy dice que el triunfo no la volvió arrogante: se dedicó a entrenar a niñas de su pueblo.",
    en: "She was born in a village in Cauca and started running barefoot at ten.\nShe failed at her first two world championships, but she never gave up.\nOver the years she became one of the best athletes on the continent.\nIn 2024 she reached the top places in the world rankings.\nToday she says success didn't make her arrogant: she devoted herself to training girls from her village."
  },
  examples: [
    { es: "Mi abuelo empezó vendiendo empanadas en la calle y llegó a ser dueño de tres restaurantes.", en: "My grandfather started out selling empanadas in the street and ended up owning three restaurants." },
    { es: "El proyecto fracasó por falta de plata, aunque la idea era buena y el equipo trabajó duro.", en: "The project failed for lack of money, although the idea was good and the team worked hard." },
    { es: "Mi prima se hizo abogada para defender a su comunidad, y con el tiempo se volvió muy conocida.", en: "My cousin became a lawyer to defend her community, and over time she became very well known." }
  ],
  rule: "*Triunfar* and *fracasar* are big words for big goals: a career, a project, a team. For an exam, *pasar* or *aprobar*; in Colombia you fail one with *perder el examen*.\nEnglish says became for everything. Spanish chooses:\n*llegar a ser*: you got there in the end, slowly, often with effort. *Llegó a ser directora.* With *no*, someone never made it.\n*hacerse*: a change you chose or worked for, a job or a belief. *Se hizo abogada.*\n*volverse*: a deep, lasting change in character. *Se volvió arrogante.*\n*ponerse*: a passing state. *Se puso nerviosa.*\nTop of a ranking: *alcanzar los primeros puestos*.",
  readAndPick: [
    { q: "How did her career start?", es: "Fracasó en sus dos primeros mundiales.",
      options: ["With two failures", "With a big win", "With an injury that ended it"], answer: 0,
      why: "*Fracasar* is to fail at something big, like a world championship." },
    { q: "How fast did she get to the top?", es: "Con los años llegó a ser una de las mejores atletas.",
      options: ["Overnight, by sheer luck", "Slowly, over years", "Never"], answer: 1,
      why: "*Llegar a ser* is the long road: she got there in the end, *con los años*." },
    { q: "What kind of change is *se volvió muy conocida*?", es: "Con el tiempo se volvió muy conocida.",
      options: ["A job", "A mood that passed quickly", "A lasting change"], answer: 2,
      why: "*Volverse* marks a deep change that stays. A passing mood takes *ponerse*." },
    { q: "What happened in the exam?", es: "Perdió el examen de matemáticas y tiene que repetirlo.",
      options: ["He lost the paper", "He failed it", "He passed"], answer: 1,
      why: "In Colombia *perder el examen* is to fail it, not to lose the sheet." },
    { q: "Why did the project fail?", es: "El proyecto fracasó por falta de plata.",
      options: ["A lack of money", "Too few people on it", "Bad weather"], answer: 0,
      why: "*Por falta de plata*: there wasn't enough money. *Plata* is money in Colombia." },
    { q: "What did the grandfather become?", es: "Llegó a ser dueño de tres restaurantes.",
      options: ["A waiter in three of them", "The owner of three", "A cook"], answer: 1,
      why: "*Llegó a ser dueño*: after years of selling empanadas, he owned three." }
  ],
  yourTurn: [
    { en: "She became director of the company. (after years)", es: "Llegó a ser directora de la empresa.", accept: [] },
    { en: "He became a lawyer. (he studied for it)", es: "Se hizo abogado.", accept: [] },
    { en: "He became very selfish.", es: "Se volvió muy egoísta.", accept: [] },
    { en: "The team reached the top of the league.", es: "El equipo alcanzó los primeros puestos de la liga.", accept: ["El equipo [alcanzó|llegó a] los primeros puestos de la liga."] },
    { en: "She failed at first, but she didn't give up.", es: "Fracasó al principio, pero no se rindió.", accept: ["Al principio fracasó, pero no se rindió."] }
  ],
  translate: [
    { en: "He succeeded abroad before coming back to Colombia.", es: "Triunfó en el exterior antes de volver a Colombia.", accept: ["Triunfó en el [exterior|extranjero] antes de [volver|regresar] a Colombia."] },
    { en: "She never became famous.", es: "No llegó a ser famosa.", accept: ["Nunca llegó a ser famosa."] },
    { en: "I passed the exam without any trouble.", es: "Pasé el examen sin problemas.", accept: ["[Pasé|Aprobé|Gané] el examen sin problemas.", "[Pasé|Aprobé|Gané] el examen sin ningún problema."] },
    { en: "Over time, he became a leading figure in his field.", es: "Con el tiempo, llegó a ser un referente en su campo.", accept: ["Con el tiempo, llegó a ser un referente en su área."] },
    { en: "My grandfather sold empanadas in the street. He failed twice with his own business. In the end he became the owner of three restaurants.", es: "Mi abuelo vendía empanadas en la calle. Fracasó dos veces con su propio negocio. Al final llegó a ser dueño de tres restaurantes.", accept: ["Mi abuelo vendía empanadas en la calle. Fracasó dos veces con su propio negocio. [Al final|Finalmente] llegó a ser (el) dueño de tres restaurantes."] },
    { en: "She got very nervous before the race.", es: "Se puso muy nerviosa antes de la carrera.", accept: [] }
  ],
  register: [
    { es: "¡Se lució en la final!", en: "She really shone in the final!", when: "with friends, praising a great performance" },
    { es: "Le fue muy bien en el trabajo nuevo.", en: "She did very well in the new job.", when: "anywhere, a plain report of success" },
    { es: "Alcanzó los primeros puestos del ranking.", en: "She reached the top places in the rankings.", when: "in sports news or a profile" },
    { es: "El proyecto no logró los objetivos previstos.", en: "The project did not achieve its planned objectives.", when: "in a report, a polite way to say it failed" }
  ],
  personal: {
    prompt: "Tell the story of someone you admire who got somewhere slowly: where they started, a failure on the way, and what they became.",
    constraints: [
      { type: "regex", pattern: "lleg(ó|o|aron|ué) a ser", label: "the long road: *llegó a ser*" },
      { type: "regex", pattern: "fracas|perdi(ó|o) el|no le fue bien|no logr", label: "a failure on the way: *fracasó* or *no logró*" },
      { type: "regex", pattern: "se (hizo|volvi[óo]|puso)|me (hice|volví|puse)", label: "another change: *se hizo*, *se volvió* or *se puso*" }
    ],
    model: "Mi mamá empezó como secretaria en un hospital de Pereira. Quería ser enfermera, pero fracasó dos veces en el examen de ingreso. Al tercer intento pasó, y se hizo enfermera a los treinta años. Con el tiempo llegó a ser jefa de urgencias."
  },
  pitfalls: [
    "*Fracasé en el examen* is too dramatic: for an exam, *perdí el examen* or *no pasé*.",
    "*Llegó a ser* needs time; for a quick change of mood, *se puso*: *se puso feliz*.",
    "*Se hizo rico* is about effort, not speed; a change in who someone is takes *se volvió*."
  ]
},

"nt-valor-precio-b2": {
  source: "merged",
  hook: {
    line: "A used car is listed for sale online, and the comments start at once. The seller talks deals and discounts; a reader answers with the difference between spending and investing.",
    es: "Vendo carro modelo 2019, en perfecto estado, rebajado de 62 a 55 millones.\nEsta semana está en oferta: si lo compra antes del domingo, le doy un descuento del 5 %.\nComentario: Un carro no es una inversión, es un gasto: pierde valor apenas sale del concesionario.\nRespuesta: Puede ser, pero lo barato sale caro. Este carro casi no ha perdido valor.\nComentario: ¿Y el seguro? Eso también sale carísimo.",
    en: "For sale: 2019 car in perfect condition, reduced from 62 to 55 million.\nIt's on offer this week: if you buy it before Sunday, I'll give you a 5% discount.\nComment: A car isn't an investment, it's an expense: it loses value as soon as it leaves the dealership.\nReply: Maybe, but buy cheap, pay twice. This car has hardly lost any value.\nComment: And the insurance? That costs a fortune too."
  },
  examples: [
    { es: "Consideran la capacitación un gasto y no una inversión, por eso nunca hay presupuesto para cursos.", en: "They see training as an expense and not an investment, which is why there's never a budget for courses." },
    { es: "Compramos un buen colchón hace cinco años, y aunque fue caro, valió la pena cada peso.", en: "We bought a good mattress five years ago, and although it was expensive, it was worth every peso." },
    { es: "El apartamento ganó mucho valor cuando abrieron la estación del metro a dos cuadras.", en: "The flat gained a lot of value when they opened the metro station two blocks away." }
  ],
  rule: "*Un gasto* is money that goes out. *Una inversión* is money you expect back, so calling a cost an investment is a sales move.\nValue over time moves with *ganar valor* and *perder valor*, with no article: *perdió valor*. A price at one moment is just *el precio*.\nA deal: *estar en oferta* or *en promoción*, *tener un descuento del 20 %*, *estar rebajado*, which agrees: *rebajada*, *rebajados*.\nHow it turned out: *salir caro*, *salir barato*. *Lo barato sale caro.* *Rentable* is profitable.\nWorth it is *valer la pena*: *valió la pena*.",
  readAndPick: [
    { q: "Why does the commenter call the car an expense?", es: "Pierde valor apenas sale del concesionario.",
      options: ["It's worth less at once", "It breaks down every month", "Fuel"], answer: 0,
      why: "*Pierde valor* is worth less over time, starting the day you buy it." },
    { q: "What does *lo barato sale caro* mean?", es: "Puede ser, pero lo barato sale caro.",
      options: ["Always buy cheap", "Cheap ends up costing more", "Cheap things sell out quickly every time"], answer: 1,
      why: "*Salir caro* is how it turns out: the cheap choice costs more in the end." },
    { q: "How much is the discount?", es: "Le doy un descuento del 5 %.",
      options: ["Five percent off", "Five million pesos off", "Half price"], answer: 0,
      why: "*Un descuento del 5 %* takes five percent off the price." },
    { q: "What happened to the flat?", es: "El apartamento ganó mucho valor.",
      options: ["It's worth much more now", "It won a design prize", "It lost a lot of its value"], answer: 0,
      why: "*Ganar valor* is to be worth more over time; no prize was won." },
    { q: "Was the mattress worth it?", es: "Aunque fue caro, valió la pena cada peso.",
      options: ["No, too dear", "They returned it", "Yes, every peso"], answer: 2,
      why: "*Valió la pena* weighs cost against result: worth every peso." },
    { q: "How is the car's price described?", es: "Rebajado de 62 a 55 millones.",
      options: ["Raised to 62 million", "Cut to 55 million", "Fixed"], answer: 1,
      why: "*Rebajado* means the price has been cut, here from 62 down to 55." }
  ],
  yourTurn: [
    { en: "It's not an expense, it's an investment.", es: "No es un gasto, es una inversión.", accept: [] },
    { en: "These shoes are on sale this week.", es: "Estos zapatos están en oferta esta semana.", accept: ["Estos zapatos están en [oferta|promoción] esta semana.", "Esta semana estos zapatos están en [oferta|promoción]."] },
    { en: "The house has gained a lot of value in ten years.", es: "La casa ha ganado mucho valor en diez años.", accept: ["La casa ganó mucho valor en diez años."] },
    { en: "Buy cheap, pay twice.", es: "Lo barato sale caro.", accept: [] },
    { en: "There's a 15% discount.", es: "Hay un descuento del 15 %.", accept: ["Tiene un descuento del 15 %.", "Hay un 15 % de descuento."] }
  ],
  translate: [
    { en: "It was an unnecessary expense.", es: "Fue un gasto innecesario.", accept: [] },
    { en: "The car loses value the moment you leave the dealership.", es: "El carro pierde valor en cuanto sales del concesionario.", accept: ["El carro pierde valor [en cuanto|apenas|tan pronto como] [sales|sale] del concesionario."] },
    { en: "We invested in a good mattress and it was worth it.", es: "Invertimos en un buen colchón y valió la pena.", accept: [] },
    { en: "The flight turned out cheaper than the bus.", es: "El vuelo salió más barato que el bus.", accept: ["El vuelo [salió|resultó] más barato que el bus."] },
    { en: "The price has gone up 15% this year. But the jacket is on sale, so it's reduced. In the end it came out cheaper.", es: "El precio subió un 15 % este año. Pero la chaqueta está en oferta, así que está rebajada. Al final salió más barata.", accept: ["El precio [subió|ha subido] un 15 % este año. Pero la chaqueta está en [oferta|promoción], así que está rebajada. Al final salió más barata."] },
    { en: "Is this business profitable?", es: "¿Este negocio es rentable?", accept: ["¿Es rentable este negocio?"] }
  ],
  register: [
    { es: "¡Eso está regalado!", en: "That's a steal!", when: "with friends, about a great price" },
    { es: "Está en oferta esta semana.", en: "It's on sale this week.", when: "in a shop, anywhere" },
    { es: "Le hago una rebajita si lleva dos.", en: "I'll knock a bit off if you take two.", when: "a market seller in Colombia, bargaining" },
    { es: "El inmueble se ha valorizado un 20 %.", en: "The property has appreciated by 20%.", when: "in a property listing or a financial report" }
  ],
  personal: {
    prompt: "Think of something you bought that was worth it, or wasn't. Say whether it was an expense or an investment, how its value changed, and how it turned out.",
    constraints: [
      { type: "containsAny", words: ["gasto", "inversión", "invertí", "invertimos"], label: "*un gasto* or *una inversión*" },
      { type: "regex", pattern: "(gan|perd|pierde|gana)[a-záéíóú]* (mucho |poco |algo de )?valor", label: "value over time: *ganó valor* or *perdió valor*" },
      { type: "regex", pattern: "sali(ó|o|eron) (más |muy )?(car|barat)|val(ió|io|e) la pena", label: "how it turned out: *salió caro* or *valió la pena*" }
    ],
    model: "Hace tres años compré un computador muy caro para trabajar desde la casa. Mi papá dijo que era un gasto, pero para mí fue una inversión. Ya perdió mucho valor, pero valió la pena: con él conseguí mis mejores clientes."
  },
  pitfalls: [
    "*Mereció la pena* is Spain; in Colombia, *valió la pena*.",
    "*Está de oferta* is Spain too: here, *está en oferta* or *en promoción*.",
    "*Perdió el valor* can mean lost its nerve; for price, *perdió valor*, with no article."
  ]
},

"nt-referencias-generales-b2": {
  source: "merged",
  hook: {
    line: "A boss and an employee in Bogotá fix a deadline over chat. Every line places something in time: first thing, the middle of the week, around nine, the last minute.",
    es: "Jefe: Necesito el informe a primera hora del lunes.\nAna: Uy, no me alcanza el tiempo. A mediados de semana sí puedo.\nJefe: El cliente llega el miércoles hacia las nueve, entonces el martes a última hora.\nAna: Listo. Le voy a dedicar todo el fin de semana.\nJefe: Gracias. Y no pierda tiempo con los gráficos, eso lo hace Camilo.",
    en: "Boss: I need the report first thing on Monday.\nAna: Oh, I won't have enough time. Midweek I can.\nBoss: The client arrives on Wednesday around nine, so Tuesday, last thing.\nAna: OK. I'll devote the whole weekend to it.\nBoss: Thanks. And don't waste time on the charts, Camilo does those."
  },
  examples: [
    { es: "A finales de mes nos pagan el sueldo, y a principios del siguiente ya no queda nada.", en: "At the end of the month we get our pay, and by the start of the next there's nothing left." },
    { es: "No me dio tiempo de desayunar, porque el bus pasó a las seis de la mañana.", en: "I didn't have time to have breakfast, because the bus came at six in the morning." },
    { es: "Me gustaría dedicarle más tiempo a mi familia, pero el trabajo me ocupa hasta los domingos.", en: "I'd like to devote more time to my family, but work takes up even my Sundays." }
  ],
  rule: "Time does the acting, like *gustar*, and you receive it. *No me alcanza el tiempo para terminar* is the everyday Latin American way to decline. *¿Te da tiempo de pasar?* asks if there's time. Never *yo doy tiempo*.\n*Dedicar tiempo a* is a choice: *le dedico una hora al día*. *Perder* and *aprovechar el tiempo* judge how it was spent.\nParts of a period: *a principios de*, *a mediados de*, *a finales de* + *mes*, *semana*, *año*.\nEdges, with no article: *a primera hora*, *a última hora*, *de madrugada*, *en el último minuto*.\nAround a time: *hacia las nueve* (written), *a eso de las nueve*, *como a las nueve* (chat).",
  readAndPick: [
    { q: "When does the boss want the report?", es: "Necesito el informe a primera hora del lunes.",
      options: ["Monday, first thing", "Monday, late at night", "Sometime on Monday"], answer: 0,
      why: "*A primera hora* is first thing, the start of the working day." },
    { q: "Why does Ana say no?", es: "No me alcanza el tiempo.",
      options: ["She simply doesn't want to", "There's not enough time", "Her watch broke"], answer: 1,
      why: "*No me alcanza el tiempo* blames the clock, not her interest." },
    { q: "When does the client arrive?", es: "El cliente llega el miércoles hacia las nueve.",
      options: ["At nine sharp", "After nine", "Around nine"], answer: 2,
      why: "*Hacia las nueve* is a rough time; sharp would be *a las nueve en punto*." },
    { q: "When do they get paid?", es: "A finales de mes nos pagan el sueldo.",
      options: ["Right at the start", "At the end of the month", "In the middle of every month"], answer: 1,
      why: "*A finales de mes* is the last days of the month." },
    { q: "What happened to breakfast?", es: "No me dio tiempo de desayunar.",
      options: ["There was no time for it", "It was cold", "She skipped it on purpose"], answer: 0,
      why: "*No me dio tiempo de* says the time ran out, so it didn't happen." }
  ],
  yourTurn: [
    { en: "I don't have enough time to finish today.", es: "No me alcanza el tiempo para terminar hoy.", accept: ["Hoy no me alcanza el tiempo para terminar.", "No me da tiempo de terminar hoy."] },
    { en: "We left first thing in the morning.", es: "Salimos a primera hora de la mañana.", accept: [] },
    { en: "They cancelled at the last minute.", es: "Cancelaron a última hora.", accept: ["Cancelaron [a última hora|en el último minuto]."] },
    { en: "He arrived midweek.", es: "Llegó a mediados de semana.", accept: ["Llegó a mediados de la semana."] },
    { en: "Don't waste time on excuses. (to a friend)", es: "No pierdas el tiempo con excusas.", accept: ["No pierdas tiempo con excusas."] }
  ],
  translate: [
    { en: "I'd like to devote more time to my family.", es: "Me gustaría dedicarle más tiempo a mi familia.", accept: ["Me gustaría dedicar más tiempo a mi familia."] },
    { en: "They reckon they'll be here around nine.", es: "Calculan que van a estar aquí hacia las nueve.", accept: ["Calculan que [van a estar|estarán] [aquí|acá] [hacia|a eso de|como a] las nueve.", "Calculan que [van a llegar|llegarán] [hacia|a eso de|como a] las nueve."] },
    { en: "As usual, he arrived at the last minute.", es: "Como siempre, llegó en el último minuto.", accept: ["Como siempre, llegó [en el último minuto|a última hora]."] },
    { en: "Will you have time to drop by? (to a friend)", es: "¿Te da tiempo de pasar?", accept: ["¿Te da tiempo [de|para] pasar?", "¿Te alcanza el tiempo para pasar?"] },
    { en: "At the beginning of the year I enrolled in a course. By the middle of the year I didn't have enough time. Now I study in the small hours.", es: "A principios de año me inscribí en un curso. A mediados de año ya no me alcanzaba el tiempo. Ahora estudio de madrugada.", accept: ["A principios de año me [inscribí|metí] en un curso. A mediados de año ya no me [alcanzaba|alcanzó] el tiempo. Ahora estudio de madrugada."] },
    { en: "Let's make the most of the time we have.", es: "Aprovechemos el tiempo que tenemos.", accept: ["Vamos a aprovechar el tiempo que tenemos."] }
  ],
  register: [
    { es: "Nos vemos como a las nueve.", en: "See you around nine.", when: "texting a friend in Colombia" },
    { es: "Nos vemos a eso de las nueve.", en: "See you at about nine.", when: "anywhere, a relaxed plan" },
    { es: "La reunión será hacia las nueve.", en: "The meeting will be at around nine.", when: "in a work email or a written notice" },
    { es: "Lamentablemente, esta semana no tengo disponibilidad.", en: "Unfortunately, I have no availability this week.", when: "declining formally, in a letter or email" }
  ],
  personal: {
    prompt: "Describe your week to a colleague: what you'll do first thing, what you won't have time for, and roughly when something will happen.",
    constraints: [
      { type: "containsAny", words: ["a primera hora", "a última hora", "de madrugada", "en el último minuto"], label: "an edge of the day: *a primera hora* or *a última hora*" },
      { type: "regex", pattern: "(me|te|le|nos|les) (alcanza|alcanzó|alcanzaba|da|dio|daba) (el )?tiempo", label: "time as the subject: *no me alcanza el tiempo*" },
      { type: "containsAny", words: ["hacia las", "a eso de las", "como a las", "hacia la", "a eso de la", "como a la"], label: "a rough time: *hacia las nueve* or *como a las nueve*" }
    ],
    model: "El lunes tengo una reunión a primera hora. No me alcanza el tiempo para preparar todo el domingo, así que voy a madrugar. El cliente llega hacia las diez."
  },
  pitfalls: [
    "*Yo no doy tiempo* says you won't grant time: for not enough time, *no me alcanza el tiempo*.",
    "*A la última hora* adds an article English has but Spanish doesn't: *a última hora*.",
    "*Hacia las nueve* is a guess; for an appointment, say *a las nueve*."
  ]
},

"nt-localizacion-tiempo-b2": {
  source: "merged",
  hook: {
    line: "A newspaper feature follows a former taxi driver around Bogotá. His life is measured in stretches of time: what he hasn't done for years, what he has done for years, and what he plans.",
    es: "Don Hernán lleva doce años sin manejar.\nDe joven tenía un taxi, y en los años noventa recorría Bogotá de madrugada.\nAntiguamente, dice, la ciudad se cruzaba en media hora.\nHoy en día prefiere la bicicleta, y lleva cinco años pedaleando hasta su trabajo.\nA corto plazo no piensa comprar carro; a largo plazo, tampoco.",
    en: "Don Hernán hasn't driven for twelve years.\nAs a young man he had a taxi, and in the nineties he drove around Bogotá in the small hours.\nIn the old days, he says, you could cross the city in half an hour.\nNowadays he prefers the bike, and he's been pedalling to work for five years.\nIn the short term he doesn't plan to buy a car; in the long term, neither."
  },
  examples: [
    { es: "Llevo tres semanas sin tomar café, y todavía me duele la cabeza por las tardes.", en: "I haven't had coffee for three weeks, and I still get headaches in the afternoons." },
    { es: "Llevamos dos años estudiando juntas, pero llevamos un mes sin vernos por el trabajo.", en: "We've been studying together for two years, but we haven't seen each other for a month because of work." },
    { es: "A mediano plazo queremos abrir otra tienda en Medellín, y a largo plazo, exportar el café.", en: "In the medium term we want to open another shop in Medellín, and in the long term, export the coffee." }
  ],
  rule: "*Llevar* + a stretch of time says how long something has been going on. Add the *-ando* form for what you've been doing: *Llevo un año estudiando.* Add *sin* + the plain verb for what you haven't done: *Llevo un año sin estudiar.* No *no*: *sin* already is the not. For the past, *llevaba*: hadn't, for.\nFar back: *antiguamente*, *en los años noventa*, *de niño*, *de joven*.\nNow: *hoy en día*, *en la actualidad*, *aún no* or *todavía no*.\nAhead: *el año que viene*, *el próximo año*, and how soon, *a corto plazo*, *a mediano plazo*, *a largo plazo*. Spain says *a medio plazo*.",
  readAndPick: [
    { q: "Does Don Hernán drive now?", es: "Don Hernán lleva doce años sin manejar.",
      options: ["Yes, every single day", "No, not for years", "Only at night"], answer: 1,
      why: "*Lleva doce años sin manejar*: twelve years and counting without driving." },
    { q: "How long has he cycled to work?", es: "Lleva cinco años pedaleando hasta su trabajo.",
      options: ["Five years and counting", "Five years once, then he stopped", "Not yet"], answer: 0,
      why: "*Llevar* + time + *pedaleando* is still going on now." },
    { q: "When did he have the taxi?", es: "De joven tenía un taxi.",
      options: ["Never", "When he was young", "Just since last year"], answer: 1,
      why: "*De joven* places it in his youth: as a young man." },
    { q: "What does *a corto plazo* tell you?", es: "A corto plazo no piensa comprar carro.",
      options: ["How much it matters to him", "How soon it would be", "Where"], answer: 1,
      why: "*A corto plazo* sorts the future by how soon: the near term." },
    { q: "What has the speaker not done for three weeks?", es: "Llevo tres semanas sin tomar café.",
      options: ["Work", "Sleep a full night", "Drink coffee"], answer: 2,
      why: "*Sin tomar café*: the thing not done comes after *sin*." }
  ],
  yourTurn: [
    { en: "I haven't smoked for three weeks.", es: "Llevo tres semanas sin fumar.", accept: [] },
    { en: "We haven't spoken for a month.", es: "Llevamos un mes sin hablar.", accept: ["Llevamos un mes sin hablarnos."] },
    { en: "I've been studying Spanish for two years.", es: "Llevo dos años estudiando español.", accept: [] },
    { en: "Nowadays everything is easier.", es: "Hoy en día todo es más fácil.", accept: ["[Hoy en día|Hoy día|En la actualidad|Actualmente], todo es más fácil."] },
    { en: "There's no solution in the short term.", es: "A corto plazo no hay solución.", accept: ["No hay solución a corto plazo."] }
  ],
  translate: [
    { en: "In the old days people thought the Earth was flat.", es: "Antiguamente se pensaba que la Tierra era plana.", accept: ["Antiguamente la gente pensaba que la Tierra era plana.", "Antes se pensaba que la Tierra era plana."] },
    { en: "As a young man he had a beard.", es: "De joven tenía barba.", accept: ["De joven llevaba barba."] },
    { en: "I still haven't read that novel.", es: "Todavía no he leído esa novela.", accept: ["Aún no he leído esa novela."] },
    { en: "In the medium term, we hope to open a second shop.", es: "A mediano plazo, esperamos abrir una segunda tienda.", accept: ["A mediano plazo, esperamos abrir [una segunda|otra] tienda."] },
    { en: "I had gone two years without seeing my grandmother. When I arrived, she was cooking. She had been living alone for ten years.", es: "Llevaba dos años sin ver a mi abuela. Cuando llegué, estaba cocinando. Llevaba diez años viviendo sola.", accept: ["Llevaba dos años sin ver a mi abuela. Cuando llegué, (ella) estaba cocinando. Llevaba diez años viviendo sola."] },
    { en: "How long have you gone without sleeping well? (to a friend)", es: "¿Cuánto llevas sin dormir bien?", accept: ["¿Cuánto tiempo llevas sin dormir bien?"] }
  ],
  register: [
    { es: "Llevo rato sin verte.", en: "I haven't seen you in ages.", when: "in Colombia, greeting a friend you've missed" },
    { es: "Hace tiempo que no te veo.", en: "It's been a while since I saw you.", when: "anywhere, a warm hello" },
    { es: "En la actualidad, la empresa tiene doscientos empleados.", en: "At present, the company has two hundred employees.", when: "in a report or a company profile" },
    { es: "La medida tendrá efectos a largo plazo.", en: "The measure will have long-term effects.", when: "in the news or a policy document" }
  ],
  personal: {
    prompt: "Write about a habit you gave up or picked up: how long you've gone without it or been doing it, what it was like before, and what you plan in the long term.",
    constraints: [
      { type: "regex", pattern: "llev(o|as|a|amos|an|aba|ábamos|aban) [a-záéíóúñ0-9 ]+ sin [a-záéíóúñ]+(r|rlo|rla|rlos|rlas|rme|rte|rse|rnos|rle|rles)\\b", label: "time without: *llevo un año sin fumar*" },
      { type: "regex", pattern: "llev(o|as|a|amos|an|aba|ábamos|aban) [a-záéíóúñ0-9 ]+ [a-záéíóúñ]+(ando|iendo|yendo)\\b", label: "time doing: *llevo dos años estudiando*" },
      { type: "containsAny", words: ["antes", "antiguamente", "de niño", "de niña", "de joven", "en los años"], label: "the past: *antes* or *de joven*" },
      { type: "containsAny", words: ["a corto plazo", "a mediano plazo", "a largo plazo"], label: "the future: *a largo plazo*" }
    ],
    model: "Llevo un año sin comer carne. De niña comía carne todos los días, porque en mi casa era normal. Ahora llevo seis meses aprendiendo a cocinar con lentejas y fríjoles. A largo plazo, quiero abrir un restaurante vegetariano."
  },
  pitfalls: [
    "*Llevo un año no fumando* isn't Spanish: *llevo un año sin fumar*.",
    "*A medio plazo* is Spain; in Colombia and most of Latin America, *a mediano plazo*.",
    "*Llevo dos años estudiando* is still going on; if you stopped, *estudié dos años*."
  ]
},

"task-b2-noticia": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: summarise a real news item in six sentences of your own, then comment on it in eight more. The model starts on a report about cycling in Bogotá.",
    es: "Según un informe de la alcaldía, los viajes en bicicleta en Bogotá se duplicaron en cinco años.\nHoy, en torno a un millón de personas usan la bici a diario, casi la décima parte de los viajes.\nAl parecer, el aumento se produjo sobre todo después de la pandemia.\nSin embargo, los robos de bicicletas también subieron un 30 %.\nUn funcionario habría recibido dinero para frenar una nueva ciclorruta, según fuentes del concejo.\nPara mí, la noticia muestra un cambio real, pero cabe preguntarse si la ciudad es segura para los ciclistas.",
    en: "According to a city report, bike trips in Bogotá doubled in five years.\nToday, around a million people use a bike every day, almost a tenth of all trips.\nApparently, the rise came mostly after the pandemic.\nHowever, bike thefts also went up by 30%.\nAn official allegedly took money to block a new bike lane, according to council sources.\nFor me, the news shows a real change, but it's worth asking whether the city is safe for cyclists."
  },
  examples: [
    { es: "El arriendo en Medellín ha subido en torno a un 12 % en el último año.", en: "Rent in Medellín has risen by around 12% in the last year." },
    { es: "Según fuentes del ministerio, la reforma se presentará al Congreso a mediados de marzo.", en: "According to ministry sources, the reform will be presented to Congress in mid March." },
    { es: "El exgerente habría cobrado comisiones por adjudicar los contratos, aunque él lo niega.", en: "The former manager allegedly took commissions for awarding the contracts, although he denies it." }
  ],
  rule: "Two jobs, in order. First summarise the item in six sentences in your own words; then comment on it in eight more.\nReuse the unit's moves. Figures: *se duplicó*, *un tercio de*, *en torno a*, *un aumento del 30 %*.\nWhere it comes from: *según fuentes de...*, *según un informe de...*, *al parecer*.\nDistance from a claim nobody has proved: *presuntamente*, and the conditional, *habría cobrado*, allegedly took. Colombian news uses it every day.\nIn the comment, say what you make of it: *para mí*, *cabe preguntarse si...*, *lo que me llama la atención es...*\nCopying the article's phrases is not summarising.",
  readAndPick: [
    { q: "What does *habría recibido* signal?", es: "Un funcionario habría recibido dinero, según fuentes del concejo.",
      options: ["Nobody's confirmed it", "He'll get money", "It definitely happened"], answer: 0,
      why: "In the news the conditional distances the paper from a claim: allegedly." },
    { q: "Which part names the source?", es: "Según un informe de la alcaldía, los viajes se duplicaron.",
      options: ["*se duplicaron*", "*según un informe*", "*los viajes en bicicleta*"], answer: 1,
      why: "*Según un informe de* says where the figure comes from." },
    { q: "How much did bike trips grow?", es: "Los viajes en bicicleta se duplicaron en cinco años.",
      options: ["They doubled", "They halved", "They rose a bit"], answer: 0,
      why: "*Se duplicaron* is doubled: twice as many trips." },
    { q: "What is the writer doing with *cabe preguntarse*?", es: "Cabe preguntarse si la ciudad es segura para los ciclistas.",
      options: ["Giving a new figure", "Quoting the mayor directly", "Raising a fair doubt"], answer: 2,
      why: "*Cabe preguntarse si* opens the comment with a question worth asking." },
    { q: "What share of trips is by bike?", es: "Casi la décima parte de los viajes.",
      options: ["Exactly ten", "Nearly one in ten", "A tenth of a million"], answer: 1,
      why: "*La décima parte* is a tenth, and *casi* says a little less." }
  ],
  yourTurn: [
    { en: "Rent has risen by around 12%.", es: "El arriendo ha subido en torno a un 12 %.", accept: ["El arriendo [ha subido|subió] [en torno a|alrededor de|cerca de] un 12 %."] },
    { en: "According to ministry sources, the reform will be presented in March.", es: "Según fuentes del ministerio, la reforma se presentará en marzo.", accept: ["Según fuentes del ministerio, la reforma se [presentará|va a presentar] en marzo."] },
    { en: "The accused allegedly took commissions.", es: "El acusado habría cobrado comisiones.", accept: ["El acusado presuntamente cobró comisiones."] },
    { en: "Apparently, the rise came after the pandemic.", es: "Al parecer, el aumento se produjo después de la pandemia.", accept: ["[Al parecer|Por lo visto], el aumento [se produjo|ocurrió|llegó] después de la pandemia."] }
  ],
  translate: [
    { en: "A third of the city's buses are electric.", es: "Un tercio de los buses de la ciudad son eléctricos.", accept: ["La tercera parte de los buses de la ciudad son eléctricos."] },
    { en: "Bike thefts also rose by 30%.", es: "Los robos de bicicletas también subieron un 30 %.", accept: ["Los robos de bicicletas también [subieron|aumentaron] un 30 %."] },
    { en: "The former manager denies it.", es: "El exgerente lo niega.", accept: [] },
    { en: "What strikes me is that nobody resigned.", es: "Lo que me llama la atención es que nadie renunció.", accept: ["Lo que me llama la atención es que nadie [renunció|haya renunciado]."] },
    { en: "According to a city report, bike trips doubled in five years. However, thefts rose too. It's worth asking whether the city is safe for cyclists.", es: "Según un informe de la alcaldía, los viajes en bicicleta se duplicaron en cinco años. Sin embargo, los robos también subieron. Cabe preguntarse si la ciudad es segura para los ciclistas.", accept: ["Según un informe de la alcaldía, los viajes en bicicleta se duplicaron en cinco años. Sin embargo, los robos también [subieron|aumentaron]. Cabe preguntarse si la ciudad es segura para los ciclistas."] },
    { en: "The mayor allegedly knew about the contracts.", es: "El alcalde habría sabido de los contratos.", accept: ["El alcalde presuntamente sabía de los contratos."] }
  ],
  register: [
    { es: "Dizque el alcalde sabía todo.", en: "Supposedly the mayor knew everything.", when: "in Colombia, passing on gossip you doubt" },
    { es: "Al parecer, el alcalde lo sabía.", en: "Apparently, the mayor knew.", when: "anywhere, passing on what you've heard" },
    { es: "El alcalde habría tenido conocimiento de los hechos.", en: "The mayor allegedly had knowledge of the events.", when: "in a news report, a claim not yet proven" },
    { es: "Según fuentes de la Fiscalía, la investigación sigue abierta.", en: "According to sources in the prosecutor's office, the investigation remains open.", when: "in the news, naming where a claim comes from" }
  ],
  personal: {
    prompt: "Find a real Spanish news item. Summarise it in six sentences of your own, then comment on it in eight more: fourteen sentences or more in all.",
    constraints: [
      { type: "minSentences", n: 14, label: "fourteen sentences or more" },
      { type: "containsAny", words: ["según", "al parecer", "por lo visto", "de acuerdo con"], label: "a source: *según* or *al parecer*" },
      { type: "regex", pattern: "se duplic|se triplic|un tercio|la mitad|en torno a|alrededor de|un aumento|una subida|una caída|\\d+ ?%|por ciento", label: "a figure: *se duplicó*, *un tercio de* or *en torno a*" },
      { type: "regex", pattern: "presuntamente|habr(ía|ían) [a-záéíóúñ]+(ado|ido|to|cho)", label: "distance from an unproved claim: *habría cobrado* or *presuntamente*" }
    ],
    model: "Según un informe de la alcaldía, los viajes en bicicleta en Bogotá se duplicaron en cinco años. Hoy, en torno a un millón de personas usan la bici todos los días. Al parecer, el cambio empezó durante la pandemia. La ciudad construyó más de cien kilómetros de ciclorrutas nuevas. Sin embargo, los robos de bicicletas subieron un 30 %. Además, un funcionario habría recibido dinero para frenar una ciclorruta en el norte. Para mí, la noticia muestra un cambio real en la ciudad. Yo misma empecé a ir en bici al trabajo hace dos años. Lo que me llama la atención es que el informe casi no habla de seguridad. Cabe preguntarse si la ciudad está preparada para tantos ciclistas. En mi barrio, por ejemplo, no hay parqueaderos para bicicletas. Tampoco hay suficiente luz en las ciclorrutas de noche. Creo que la alcaldía debería invertir en eso antes de celebrar. Si no, mucha gente va a volver al carro."
  },
  pitfalls: [
    "Copying the article's sentences is not a summary: change the words, keep the facts.",
    "*Habría cobrado* in the news is not would have taken: it is allegedly took.",
    "A comment with no source for its figures reads as rumour: *según* and a name."
  ]
},

/* ---- unit b2-u49 · Reporting what people said ---------------------------- */

"dc-cita-b2": {
  source: "merged",
  hook: {
    line: "Sofía has just spoken to her landlord, and her mother wants the whole conversation. Sofía passes on what he said, what he asked, a message for her mother, and a rumour she can't vouch for.",
    es: "Mamá: ¿Qué te dijo el dueño del apartamento?\nSofía: Que el arriendo sube en enero.\nSofía: Me dijo que ya había hablado con los otros inquilinos y que al día siguiente me mandaría el contrato.\nSofía: Y me preguntó si pensaba quedarme otro año.\nSofía: Ah, y dice que si le puedes devolver el taladro.\nSofía: Por lo visto, piensa vender el edificio, según dicen los vecinos.",
    en: "Mom: What did the landlord say to you?\nSofía: That the rent goes up in January.\nSofía: He told me he had already spoken to the other tenants and that he'd send me the contract the next day.\nSofía: And he asked me if I was planning to stay another year.\nSofía: Oh, and he's asking whether you can give him back the drill.\nSofía: Apparently, he's planning to sell the building, or so the neighbours say."
  },
  examples: [
    { es: "Me dijo que vendría el lunes, pero hoy es miércoles y todavía no ha llegado.", en: "He told me he'd come on Monday, but today is Wednesday and he still hasn't arrived." },
    { es: "Le pregunté cuándo llegaría su papá, y me contestó que no sabía nada del vuelo.", en: "I asked her when her dad would arrive, and she answered that she knew nothing about the flight." },
    { es: "Según dicen, el precio de la gasolina va a subir otra vez el mes que viene.", en: "They say the price of petrol is going to go up again next month." }
  ],
  rule: "Retelling moves three things back at once: the verb, the person and the place or time.\n*Vengo* becomes *venía*, *vendré* becomes *vendría*, *hablé* becomes *había hablado* (or stays if the order is clear).\n*Yo* becomes *él*, *aquí* becomes *allá*, *mañana* becomes *al día siguiente*, *ayer* becomes *el día anterior*.\nIf it's still true now, the verb can stay: *Dijo que el arriendo sube en enero.*\nA yes or no question takes *si*: *Me preguntó si pensaba quedarme.*\nTo relay fast, start with *que*: *¿Qué dijo? Que no.* *Dice que si...* passes on a question.\nNews you don't own: *por lo visto*, *según dicen*, *parece que*.",
  readAndPick: [
    { q: "What did the landlord say about January?", es: "Que el arriendo sube en enero.",
      options: ["The rent stays", "The rent goes up then", "He's selling the whole building"], answer: 1,
      why: "A reply that starts with *que* passes on what he said: the rent goes up." },
    { q: "What is the landlord asking Sofía's mom?", es: "Dice que si le puedes devolver el taladro.",
      options: ["She can keep it", "He's lending her one more", "Whether she'll return it"], answer: 2,
      why: "*Dice que si* passes on a question: he's asking whether she can give it back." },
    { q: "When was the contract coming?", es: "Me dijo que al día siguiente me mandaría el contrato.",
      options: ["The day after he spoke", "Tomorrow from now", "The week before he said it"], answer: 0,
      why: "*Al día siguiente* is his tomorrow, moved back: the day after the conversation." },
    { q: "How sure is Sofía about the sale?", es: "Por lo visto, piensa vender el edificio, según dicen los vecinos.",
      options: ["She read it in the contract", "Heard it second hand", "He told her"], answer: 1,
      why: "*Por lo visto* and *según dicen* pass it on without owning it." },
    { q: "What kind of question did he ask?", es: "Me preguntó si pensaba quedarme otro año.",
      options: ["A yes or no one", "One about the date", "None at all"], answer: 0,
      why: "*Si* carries a yes or no question into the retelling." },
    { q: "What does *dice que sí*, with the accent, mean?", es: "Le pregunté y dice que sí.",
      options: ["She's asking whether", "No", "She says yes"], answer: 2,
      why: "With the accent, *sí* is yes. Without it, *dice que si...* asks whether." }
  ],
  yourTurn: [
    { en: "He said he would come.", es: "Dijo que vendría.", accept: ["Dijo que iba a venir."] },
    { en: "She asked me if I had liked the present.", es: "Me preguntó si me había gustado el regalo.", accept: ["Me preguntó si me [había gustado|gustó] el regalo."] },
    { en: "What did he say? That he can't today.", es: "¿Qué dijo? Que hoy no puede.", accept: ["¿Qué dijo? Que no puede hoy."] },
    { en: "He told me he had already called three times.", es: "Me dijo que ya había llamado tres veces.", accept: [] },
    { en: "Apparently, the restaurant closed.", es: "Por lo visto, el restaurante cerró.", accept: ["[Por lo visto|Al parecer], el restaurante cerró.", "Parece que el restaurante cerró."] }
  ],
  translate: [
    { en: "He said that the next day he was going to Medellín.", es: "Dijo que al día siguiente se iba para Medellín.", accept: ["Dijo que al día siguiente se iba [a|para] Medellín."] },
    { en: "My mom is asking whether you're coming for lunch.", es: "Mi mamá dice que si vienes a almorzar.", accept: ["Mi mamá pregunta si vienes a almorzar."] },
    { en: "She asked him when his father would arrive.", es: "Le preguntó cuándo llegaría su papá.", accept: ["Le preguntó cuándo llegaría su [papá|padre].", "Le preguntó que cuándo llegaría su [papá|padre]."] },
    { en: "They say the price is going up next month.", es: "Según dicen, el precio va a subir el mes que viene.", accept: ["Según dicen, el precio va a subir el [mes que viene|próximo mes].", "Dicen que el precio va a subir el [mes que viene|próximo mes]."] },
    { en: "He told me he had spoken to the tenants. He also said he would send me the contract the next day. Apparently, he wants to sell.", es: "Me dijo que había hablado con los inquilinos. También dijo que me mandaría el contrato al día siguiente. Por lo visto, quiere vender.", accept: ["Me dijo que había hablado con los inquilinos. También dijo que me [mandaría|enviaría|iba a mandar] el contrato al día siguiente. [Por lo visto|Al parecer], quiere vender."] },
    { en: "It seems they've already finished the project.", es: "Parece que ya terminaron el proyecto.", accept: ["Parece que ya [terminaron|han terminado|acabaron] el proyecto."] }
  ],
  register: [
    { es: "Dizque ya vendió el edificio.", en: "Supposedly he's already sold the building.", when: "in Colombia, passing on talk you half believe" },
    { es: "Dice que ya viene.", en: "She says she's on her way.", when: "relaying a quick message at home" },
    { es: "Me comentó que el arriendo subiría en enero.", en: "He mentioned to me that the rent would go up in January.", when: "reporting a conversation at work" },
    { es: "El propietario manifestó que el contrato se enviaría al día siguiente.", en: "The owner stated that the contract would be sent the following day.", when: "in a written complaint or official minutes" }
  ],
  personal: {
    prompt: "Report a real conversation you had this week: what the other person told you, one question they asked, and something you've only heard second hand.",
    constraints: [
      { type: "regex", pattern: "(dijo|contó|comentó|explicó) que", label: "what they said: *me dijo que*" },
      { type: "regex", pattern: "pregunt(ó|o) (si|qué|cuándo|dónde|cómo|cuánto|por qué|quién)", label: "a question passed on: *me preguntó si*" },
      { type: "containsAny", words: ["por lo visto", "según dicen", "al parecer", "parece que", "dizque"], label: "second hand: *por lo visto* or *según dicen*" }
    ],
    model: "El lunes hablé con mi jefe. Me dijo que el proyecto se había aplazado y que me llamaría al día siguiente. También me preguntó si podía viajar a Cali en diciembre. Por lo visto, la empresa piensa abrir una oficina allá."
  },
  pitfalls: [
    "Moving only the verb leaves the rest behind: *mañana* becomes *al día siguiente*, *aquí* becomes *allá*.",
    "*Dice que puede ayudarte* is a statement; *dice que si puede ayudarte* passes on a question.",
    "*Dice que sí*, with the accent, is she says yes; *dice que si...* asks whether."
  ]
},

"nt-expresion-verbal-b2": {
  source: "merged",
  hook: {
    line: "The minutes of a residents' meeting in a Bogotá building never say who said what. They say who proposed, who insisted, who suggested, who denied and who finally admitted it.",
    es: "Acta de la reunión de copropietarios, 12 de marzo.\nLa administradora propuso cambiar la empresa de vigilancia.\nEl señor Rojas insistió en que primero se revisaran los costos.\nLa señora Pardo sugirió que se votara en la próxima asamblea.\nEl celador negó haber dejado la puerta abierta, y la administradora confirmó que la cámara estaba dañada.\nAl final, el señor Gómez reconoció que había perdido las llaves del parqueadero.",
    en: "Minutes of the owners' meeting, 12 March.\nThe administrator proposed changing the security company.\nMr Rojas insisted that the costs be checked first.\nMrs Pardo suggested that it be put to a vote at the next meeting.\nThe guard denied having left the door open, and the administrator confirmed that the camera was broken.\nIn the end, Mr Gómez admitted that he had lost the car park keys."
  },
  examples: [
    { es: "Me prometió que lo haría antes del viernes, pero todavía no lo ha hecho.", en: "He promised me he'd do it before Friday, but he still hasn't done it." },
    { es: "El informe destaca tres problemas principales y concluye con una propuesta para el próximo año.", en: "The report highlights three main problems and concludes with a proposal for next year." },
    { es: "Negó que fuera su culpa, aunque después reconoció que no había revisado los números.", en: "She denied it was her fault, although later she admitted she hadn't checked the numbers." }
  ],
  rule: "*Decir* reports; a sharper verb also tells the reader how it was said.\n*Sugerir* (gently) and *proponer* (with a plan): *Sugirió que votáramos.*\n*Insistir en*: again, against resistance: *Insistió en que la acompañáramos.*\n*Prometer*: a commitment. *Confirmar*: removes a doubt.\n*Afirmar*: states as fact. *Negar*: denies. *Reconocer*, *admitir*, *confesar*: accept a fact, and *confesar* hints they didn't want to.\nAfter *negar que*, the subjunctive: *negó que fuera su culpa*. About yourself, the plain verb: *negó haber estado allí*. After *reconocer que*, the ordinary form.\nFor a text: *destacar*, *subrayar*, *resumir*, *concluir*.",
  readAndPick: [
    { q: "How did Mr Rojas say it?", es: "El señor Rojas insistió en que primero se revisaran los costos.",
      options: ["Once, just in passing", "Firmly, more than once", "As a quiet joke to a friend"], answer: 1,
      why: "*Insistir en* is to press the point, usually against resistance." },
    { q: "What does *confesó* add to *dijo*?", es: "Al final confesó que había sido él.",
      options: ["Nothing at all", "He was proud of it and said so loudly", "He was reluctant"], answer: 2,
      why: "*Confesar* hints he didn't want to say it, and held out for a while." },
    { q: "What did the guard do?", es: "El celador negó haber dejado la puerta abierta.",
      options: ["He admitted the whole thing", "He denied it", "He forgot"], answer: 1,
      why: "*Negó haber dejado*: he denied it, with the plain verb because it's about himself." },
    { q: "Does she accept the blame?", es: "Negó que fuera su culpa.",
      options: ["She denies it's hers", "She says so", "She isn't sure either way"], answer: 0,
      why: "*Negar que* rejects the idea, so the verb after it takes the subjunctive: *fuera*." },
    { q: "What does *propuso* bring?", es: "La administradora propuso cambiar la empresa de vigilancia.",
      options: ["A complaint", "A threat to leave the building", "A concrete plan"], answer: 2,
      why: "*Proponer* puts a concrete plan on the table; *sugerir* is gentler." },
    { q: "What does the report do with three problems?", es: "El informe destaca tres problemas principales.",
      options: ["Hides them", "Highlights them", "Solves them all at once"], answer: 1,
      why: "*Destacar* makes them stand out, the way a text points at what matters." }
  ],
  yourTurn: [
    { en: "She suggested we leave it for another day.", es: "Sugirió que lo dejáramos para otro día.", accept: ["Sugirió dejarlo para otro día."] },
    { en: "He insisted that we go with her.", es: "Insistió en que la acompañáramos.", accept: [] },
    { en: "In the end he confessed it had been him.", es: "Al final confesó que había sido él.", accept: ["Al final confesó que fue él."] },
    { en: "He flatly denied having been there.", es: "Negó rotundamente haber estado allí.", accept: ["Negó rotundamente haber estado [allí|allá|ahí]."] },
    { en: "He promised he would do it.", es: "Prometió que lo haría.", accept: ["Prometió hacerlo.", "Prometió que lo iba a hacer."] }
  ],
  translate: [
    { en: "The president confirmed the news this morning.", es: "El presidente confirmó la noticia esta mañana.", accept: ["El presidente confirmó la noticia [esta mañana|hoy en la mañana]."] },
    { en: "She proposed a solution that convinced everyone.", es: "Propuso una solución que convenció a todos.", accept: [] },
    { en: "He denies that it's his fault.", es: "Niega que sea su culpa.", accept: [] },
    { en: "She admitted that she hadn't checked the figures.", es: "Reconoció que no había revisado las cifras.", accept: ["[Reconoció|Admitió] que no había revisado las cifras.", "[Reconoció|Admitió] que no revisó las cifras."] },
    { en: "The administrator proposed changing the company. Mr Rojas insisted that we check the costs first. In the end, everyone agreed.", es: "La administradora propuso cambiar la empresa. El señor Rojas insistió en que primero revisáramos los costos. Al final, todos estuvieron de acuerdo.", accept: ["La administradora propuso cambiar la empresa. El señor Rojas insistió en que primero [revisáramos|se revisaran] los costos. Al final, todos estuvieron de acuerdo."] },
    { en: "The text concludes with a personal reflection.", es: "El texto concluye con una reflexión personal.", accept: ["El texto [concluye|termina] con una reflexión personal."] }
  ],
  register: [
    { es: "Soltó que se iba de la empresa.", en: "He blurted out that he was leaving the company.", when: "telling a friend about an awkward moment" },
    { es: "Nos contó que se iba de la empresa.", en: "He told us he was leaving the company.", when: "anywhere, a plain report" },
    { es: "Comunicó su decisión de retirarse de la empresa.", en: "He announced his decision to leave the company.", when: "in a company email or formal minutes" },
    { es: "El informe subraya la necesidad de actuar.", en: "The report underlines the need to act.", when: "summarising a document in writing" }
  ],
  personal: {
    prompt: "Write up a meeting you were in, or a family argument, as if for the minutes: who proposed, who insisted, who denied and who admitted something.",
    constraints: [
      { type: "containsAny", words: ["propuso", "sugirió", "propusieron", "sugirieron"], label: "a proposal: *propuso* or *sugirió*" },
      { type: "containsAny", words: ["insistió en", "insistieron en"], label: "insisting: *insistió en que*" },
      { type: "regex", pattern: "neg(ó|o|aron)|reconoci(ó|o|eron)|admiti(ó|o|eron)|confes(ó|o|aron)", label: "a denial or an admission: *negó* or *reconoció*" },
      { type: "subjunctiveAfter", trigger: "en que", label: "the subjunctive after *insistió en que*" }
    ],
    model: "En la reunión de la familia, mi tía propuso vender la finca. Mi hermano insistió en que primero la arregláramos. Mi abuela negó que la finca valiera tan poco. Al final, mi papá reconoció que nadie tenía tiempo para cuidarla."
  },
  pitfalls: [
    "*Decir* five times flattens a report; each sharper verb tells the reader how it was said.",
    "*Negó que era su culpa* keeps the ordinary form: after *negar que*, *fuera*.",
    "*Confesar* says they didn't want to say it; for a neutral statement, *afirmó* or *explicó*."
  ]
},

"dc-perspectiva-temporal-b2": {
  source: "merged",
  hook: {
    line: "A friend tells a story over chat about a present nobody thanked her for. She tells the past as if it were happening now, guesses at why, and keeps losing her thread.",
    es: "Te cuento: el sábado le hago un regalo carísimo a mi cuñado y no me da ni las gracias.\nPensaba decirle algo, pero al final me quedé callada.\nHoy no vino al almuerzo. Estará bravo, o se habrá quedado dormido.\nBueno, ¿en qué íbamos? Ah, sí, te estaba contando lo del regalo.\nIba a llamarlo esta tarde, pero mejor espero a que él me llame.",
    en: "Listen to this: on Saturday I give my brother-in-law a really expensive present and he doesn't even say thank you.\nI was going to say something, but in the end I kept quiet.\nToday he didn't come to lunch. He's probably angry, or he must have overslept.\nAnyway, where were we? Oh yes, I was telling you about the present.\nI was going to call him this afternoon, but I'd better wait for him to call me."
  },
  examples: [
    { es: "Voy caminando por la calle y de repente me encuentro con mi profesor del colegio.", en: "I'm walking down the street and suddenly I run into my old school teacher." },
    { es: "No contesta el teléfono; estará todavía en la reunión, o se le habrá descargado el celular.", en: "He's not answering the phone; he's probably still in the meeting, or his phone must have died." },
    { es: "Pensaba ir al cine con Laura, pero al final me quedé en la casa viendo series.", en: "I was planning to go to the cinema with Laura, but in the end I stayed at home watching series." }
  ],
  rule: "A verb can change the angle without changing the time.\nThe present can tell a past story to make it feel close: *El sábado le hago un regalo y no me da ni las gracias.* It still happened on Saturday.\nThe future can guess about now: *Estará en la reunión.* The future perfect guesses about the past: *Se habrá quedado dormido*, he must have overslept. Nothing is predicted.\nThe imperfect leaves a plan hanging: *Pensaba ir, pero...*, *Iba a llamarte, pero...* With it, the plan almost always didn't happen; what did comes in the preterite.\nIt also picks up a thread that was cut: *¿Qué te estaba diciendo?* *¿En qué íbamos?*",
  readAndPick: [
    { q: "When did the present happen?", es: "El sábado le hago un regalo carísimo y no me da ni las gracias.",
      options: ["Next Saturday", "Last Saturday, told as now", "Every single Saturday of the year"], answer: 1,
      why: "The present tells a past story to bring it close; it's already happened." },
    { q: "What does *se habrá quedado dormido* do?", es: "Hoy no vino al almuerzo; se habrá quedado dormido.",
      options: ["Predicts what happens next", "States a fact", "Guesses about earlier"], answer: 2,
      why: "The future perfect guesses about the past: he must have overslept." },
    { q: "Did she say something to him?", es: "Pensaba decirle algo, pero al final me quedé callada.",
      options: ["No, she kept quiet", "Yes, she told him off", "She wrote to him"], answer: 0,
      why: "*Pensaba* leaves the plan hanging; *me quedé callada* is what happened." },
    { q: "What is she doing with *¿en qué íbamos?*", es: "Bueno, ¿en qué íbamos? Ah, sí, te estaba contando lo del regalo.",
      options: ["Ending the chat now", "Picking the story back up", "Asking for directions to the house"], answer: 1,
      why: "The imperfect picks up a thread that was cut: where were we?" },
    { q: "Where is he, probably?", es: "No contesta el teléfono; estará todavía en la reunión.",
      options: ["On his way home", "At the meeting tomorrow", "Still in the meeting"], answer: 2,
      why: "*Estará* guesses about now: he's probably still there." }
  ],
  yourTurn: [
    { en: "He's not answering; he's probably still in the meeting.", es: "No contesta; estará todavía en la reunión.", accept: ["No contesta[;|,|.] [estará|debe estar] todavía en la reunión.", "No contesta[;|,|.] todavía estará en la reunión."] },
    { en: "They must have overslept.", es: "Se habrán quedado dormidos.", accept: [] },
    { en: "I was going to call you, but I forgot.", es: "Iba a llamarte, pero se me olvidó.", accept: ["Iba a llamarte, pero [se me olvidó|me olvidé].", "Te iba a llamar, pero [se me olvidó|me olvidé]."] },
    { en: "What was I telling you?", es: "¿Qué te estaba diciendo?", accept: ["¿Qué te decía?"] },
    { en: "I was planning to go to the cinema, but in the end I stayed at home.", es: "Pensaba ir al cine, pero al final me quedé en la casa.", accept: ["Pensaba ir al cine, pero al final me quedé en casa."] }
  ],
  translate: [
    { en: "They didn't come this morning; they must have overslept.", es: "Esta mañana no vinieron; se habrán quedado dormidos.", accept: ["Esta mañana no vinieron[;|,|.] se habrán quedado dormidos."] },
    { en: "They must have been dancing all night; look how sleepy they are.", es: "Habrán estado bailando toda la noche; mira la cara de sueño que tienen.", accept: ["Habrán estado bailando toda la noche[;|,|.] mira [la cara de sueño que tienen|qué cara de sueño tienen]."] },
    { en: "Where were we?", es: "¿En qué íbamos?", accept: [] },
    { en: "I'm walking down the street and suddenly I run into my old teacher.", es: "Voy caminando por la calle y de repente me encuentro con mi antiguo profesor.", accept: ["Voy caminando por la calle y de repente me encuentro [con|a] mi [antiguo|viejo] profesor."] },
    { en: "On Saturday I give him a present and he doesn't even thank me. I was going to say something, but I kept quiet. He must have been tired.", es: "El sábado le doy un regalo y no me da ni las gracias. Iba a decirle algo, pero me quedé callada. Habrá estado cansado.", accept: ["El sábado le [doy|hago] un regalo y no me da ni las gracias. [Iba a decirle|Le iba a decir|Pensaba decirle] algo, pero me quedé [callada|callado]. [Habrá estado|Estaría] cansado."] },
    { en: "I was planning to stay, but I left.", es: "Pensaba quedarme, pero salí.", accept: ["Pensaba quedarme, pero [salí|me fui]."] }
  ],
  register: [
    { es: "Se le habrá olvidado, tranquila.", en: "He must have forgotten, don't worry.", when: "calming a friend about a missed call" },
    { es: "Iba a llamarte, pero no me alcanzó el tiempo.", en: "I was going to call you, but I ran out of time.", when: "a polite excuse to anyone" },
    { es: "Pensaba asistir, pero me surgió un compromiso.", en: "I was planning to attend, but something came up.", when: "excusing yourself in a work email" },
    { es: "¿En qué íbamos?", en: "Where were we?", when: "after an interruption, at a table or a meeting" }
  ],
  personal: {
    prompt: "Tell a friend about a small disaster from last week as if it were happening now, then say what you were going to do and didn't, and guess why someone acted as they did.",
    constraints: [
      { type: "containsAny", words: ["el sábado", "el viernes", "el domingo", "el lunes", "ayer", "anoche", "la semana pasada"], label: "a past day, told in the present: *el sábado le hago...*" },
      { type: "regex", pattern: "(iba a|pensaba) [a-záéíóúñ]+.*pero", label: "a plan left hanging: *iba a llamarte, pero...*" },
      { type: "regex", pattern: "habr(á|án) [a-záéíóúñ]+(ado|ido|to|cho)|estar(á|án|ía|ían) [a-záéíóúñ]+", label: "a guess: *se habrá quedado dormido* or *estaría cansada*" }
    ],
    model: "El viernes voy al banco y la cajera me dice que el sistema no funciona. Espero una hora y nada. Iba a quejarme, pero preferí irme. La cajera estaría cansada, o se habrá dañado el sistema otra vez."
  },
  pitfalls: [
    "*Se habrá quedado dormido* is a guess about the past, not a prediction: he must have overslept.",
    "*Pensaba ir* says you didn't go; if you went, *fui*.",
    "Spain says *esta mañana no han venido*; in Colombia, *esta mañana no vinieron*."
  ]
},

"dc-mantenimiento-referente-b2": {
  source: "merged",
  hook: {
    line: "A short news item about a rescue on the páramo names the same dog three ways and never says dog twice. The volunteers are counted the same way.",
    es: "Un perro rescató a una niña que se había perdido en el páramo de Sumapaz.\nEl animal, un labrador de nueve años, la encontró después de diez horas de búsqueda.\nNadie lo esperaba de un rescatista tan veterano.\nDe los cuatro voluntarios que lo acompañaban, tres llegaron esa misma noche al pueblo.\nLos de la Defensa Civil llegaron al día siguiente.",
    en: "A dog rescued a girl who had got lost on the Sumapaz páramo.\nThe animal, a nine-year-old labrador, found her after ten hours of searching.\nNobody expected it of such a veteran rescuer.\nOf the four volunteers who were with him, three reached the village that same night.\nThe ones from Civil Defence arrived the next day."
  },
  examples: [
    { es: "¿Viste mis llaves? Las de la casa, no las del carro, que esas las tengo aquí.", en: "Have you seen my keys? The house ones, not the car ones, I've got those here." },
    { es: "El gobierno anunció una reforma tributaria. La medida entrará en vigor en enero del próximo año.", en: "The government announced a tax reform. The measure will take effect in January next year." },
    { es: "Voy a una clase de español a las seis y luego a una de francés a las ocho.", en: "I'm going to a Spanish class at six and then to a French one at eight." }
  ],
  rule: "In writing, don't name the same thing twice. Three ways round it.\nDrop the thing and keep the article: *el de*, *la de*, *los del* plus a detail: *las de la casa*, *una de francés*. The article matches what you dropped. With a number: *tres de los cuatro*, or just *tres* once it's clear.\nName it again with another word and *el* or *la*: a synonym (*la copa*, then *el trofeo*) or a broader word (*el perro*, then *el animal*; *la reforma*, then *la medida*).\nSum the person up: *No lo esperábamos de un hombre tan discreto.* This *un* points back only with a describing word like *tan discreto*.\nOnly drop what the reader can recover.",
  readAndPick: [
    { q: "Who is *el animal*?", es: "El animal, un labrador de nueve años, la encontró.",
      options: ["The girl", "The same dog", "A second animal entirely"], answer: 1,
      why: "*El animal* is a broader word for the dog already named, so it isn't repeated." },
    { q: "Who does *un rescatista tan veterano* refer to?", es: "Nadie lo esperaba de un rescatista tan veterano.",
      options: ["A new person in the story", "One", "The dog again"], answer: 2,
      why: "With *tan veterano*, this *un* points back at the dog instead of bringing in someone new." },
    { q: "Which keys is she looking for?", es: "Las de la casa, no las del carro.",
      options: ["The house keys", "The car ones", "Every key she owns"], answer: 0,
      why: "*Las de la casa* drops *llaves* and keeps the article and the detail." },
    { q: "What is *la medida*?", es: "El gobierno anunció una reforma tributaria. La medida entrará en vigor en enero.",
      options: ["The tax reform", "A ruler", "A new law in March"], answer: 0,
      why: "*La medida* names the reform again with a broader word." },
    { q: "How many volunteers reached the village?", es: "De los cuatro voluntarios, tres llegaron esa misma noche.",
      options: ["All four", "Three of the four", "Three others who joined later"], answer: 1,
      why: "*Tres* alone is clear because *los cuatro voluntarios* came just before." },
    { q: "What does *una de francés* leave out?", es: "Voy a una clase de español y luego a una de francés.",
      options: ["*clase*", "*español*", "*voy*"], answer: 0,
      why: "*Una de francés* is *una clase de francés* with *clase* dropped." }
  ],
  yourTurn: [
    { en: "Which one is your car? The one on the corner.", es: "¿Cuál es tu carro? El de la esquina.", accept: [] },
    { en: "The house keys? No, the car ones.", es: "¿Las llaves de la casa? No, las del carro.", accept: [] },
    { en: "Three of the guests already left.", es: "Tres de los invitados ya se fueron.", accept: ["Tres de los invitados ya se [fueron|han ido]."] },
    { en: "Juan took his dog to the vet. The animal had a broken leg.", es: "Juan llevó a su perro al veterinario. El animal tenía una pata rota.", accept: ["Juan llevó su perro al veterinario. El animal tenía una pata rota."] }
  ],
  translate: [
    { en: "I'm going to a Spanish class and then to a French one.", es: "Voy a una clase de español y luego a una de francés.", accept: ["Voy a una clase de español y [luego|después] a una de francés."] },
    { en: "The government announced a tax reform. The measure will take effect in January.", es: "El gobierno anunció una reforma tributaria. La medida entrará en vigor en enero.", accept: ["El gobierno anunció una reforma tributaria. La medida [entrará|va a entrar] en vigor en enero."] },
    { en: "We didn't expect it from such a discreet man.", es: "No lo esperábamos de un hombre tan discreto.", accept: [] },
    { en: "Some of the boys had already left when we arrived.", es: "Algunos de los muchachos ya se habían ido cuando llegamos.", accept: ["Algunos de los [muchachos|chicos] ya se habían ido cuando llegamos."] },
    { en: "The president handed the cup to the winners. The trophy was made of silver. The ones from the second team didn't come to the ceremony.", es: "El presidente les entregó la copa a los ganadores. El trofeo era de plata. Los del segundo equipo no fueron a la ceremonia.", accept: ["El presidente [les entregó|entregó] la copa a los ganadores. El trofeo era de plata. Los del segundo equipo no [fueron|vinieron] a la ceremonia."] },
    { en: "Who are the ones in the red shirt?", es: "¿Quiénes son los de la camiseta roja?", accept: [] }
  ],
  register: [
    { es: "¿Cuál? ¿La de rayas?", en: "Which one? The striped one?", when: "pointing something out in a shop or at home" },
    { es: "Pásame la de arriba, por fa.", en: "Pass me the top one, please.", when: "with family or friends, asking for something" },
    { es: "El vehículo fue hallado en el sur de la ciudad.", en: "The vehicle was found in the south of the city.", when: "in a police report or the news, after naming the car" },
    { es: "Dicha medida entrará en vigor en enero.", en: "The said measure will take effect in January.", when: "in legal or very formal writing" }
  ],
  personal: {
    prompt: "Write a short news item about an animal, a car or a new rule, naming it three times without repeating the word, and use one *el de* or *los de*.",
    constraints: [
      { type: "containsAny", words: ["el animal", "el vehículo", "la medida", "el aparato", "el trofeo", "el premio", "la norma", "el felino", "la mascota"], label: "the thing named again: *el animal* or *la medida*" },
      { type: "regex", pattern: "\\b(el|la|los|las) (de|del) ", label: "the thing dropped: *los de la Defensa Civil*" },
      { type: "minSentences", n: 3, label: "three sentences or more" }
    ],
    model: "Un gato pasó tres días encerrado en una bodega de Chapinero. El animal sobrevivió tomando agua de una gotera. Los del edificio de al lado lo oyeron maullar el domingo. Hoy la mascota está bien y ya volvió a su casa."
  },
  pitfalls: [
    "*Juan llevó a su perro al veterinario. El perro...* repeats itself; the second time, *el animal*.",
    "*Un hombre* with nothing after it brings in a new person; to point back, *un hombre tan discreto*.",
    "*Las de la casa* only works when the listener knows you mean keys: drop only what can be recovered."
  ]
},

"fn-dar-informacion-b2": {
  source: "merged",
  hook: {
    line: "Julián has heard the office trip is off. Paula puts him right, gently, line by line: what really happened, why a colleague isn't going, who couldn't have cancelled the hotel, and why she's telling him at all.",
    es: "Julián: Me dijeron que el viaje a Cartagena se canceló.\nPaula: No, no es eso exactamente. Lo que pasa es que lo aplazaron para marzo.\nJulián: ¿Y es verdad que Andrés no va?\nPaula: No es que no quiera ir; es que no le dan permiso en el trabajo.\nPaula: Y él no pudo cancelar el hotel, porque estaba conmigo toda la tarde.\nPaula: Te lo cuento para que no le digas nada a nadie todavía.",
    en: "Julián: They told me the trip to Cartagena was cancelled.\nPaula: No, that's not quite it. The thing is, they postponed it until March.\nJulián: And is it true that Andrés isn't going?\nPaula: It's not that he doesn't want to go; it's that they won't give him time off at work.\nPaula: And he can't have cancelled the hotel, because he was with me all afternoon.\nPaula: I'm telling you so that you don't say anything to anyone yet."
  },
  examples: [
    { es: "No pudo llegar tarde, porque la vi en la oficina a las ocho en punto.", en: "She can't have arrived late, because I saw her in the office at eight sharp." },
    { es: "No es que no queramos entregarlo, lo que pasa es que vamos un poco atrasados.", en: "It's not that we don't want to hand it in, it's just that we're running a bit behind." },
    { es: "Saqué plata del cajero por si queremos salir esta noche, ya que mañana es festivo.", en: "I took out cash from the machine in case we want to go out tonight, since tomorrow is a holiday." }
  ],
  rule: "A correction lands better in two steps: reject the premise gently, then give the real story.\n*No, no es eso exactamente; es que...* *Lo que pasa es que...* (the thing is) cushions it.\n*No es que* + the subjunctive names the reason you reject; then *es que* or *sino que* + the ordinary form gives the real one: *No es que no quiera; es que no puedo.*\n*Poder* in the past softens a flat no: *No pudo llegar tarde*, she can't have.\nWhy, with the ordinary form: *ya que*, *debido a que*, *como*. What for: *para que* + the subjunctive: *Te lo cuento para que no digas nada.*\n*Por si* is in case: *por si queremos salir*.",
  readAndPick: [
    { q: "What is Paula correcting?", es: "No, no es eso exactamente. Lo que pasa es que lo aplazaron para marzo.",
      options: ["That it was ever planned at all", "It's postponed, not off", "Nothing, she agrees"], answer: 1,
      why: "*No es eso exactamente* rejects the premise gently; *lo que pasa es que* gives the real story." },
    { q: "Why isn't Andrés going?", es: "No es que no quiera ir; es que no le dan permiso en el trabajo.",
      options: ["He doesn't feel like it", "He's ill", "Work won't let him"], answer: 2,
      why: "*No es que* rejects one reason; *es que* brings the real one." },
    { q: "How sure is she that he didn't cancel it?", es: "Él no pudo cancelar el hotel, porque estaba conmigo.",
      options: ["Sure: he was with her", "She thinks he did it", "She has no idea at all"], answer: 0,
      why: "*No pudo cancelar* is he can't have: she has proof, and says it softly." },
    { q: "Why is she telling him?", es: "Te lo cuento para que no le digas nada a nadie todavía.",
      options: ["So he'll spread it", "So he keeps quiet", "Because he asked"], answer: 1,
      why: "*Para que* + *digas* gives the purpose: so that he says nothing yet." },
    { q: "Why did he take out cash?", es: "Saqué plata del cajero por si queremos salir esta noche.",
      options: ["In case they go out", "Because they're going out", "To pay a debt"], answer: 0,
      why: "*Por si* is in case: the plan isn't certain." }
  ],
  yourTurn: [
    { en: "It's not that I don't want to; it's that I can't.", es: "No es que no quiera; es que no puedo.", accept: ["No es que no quiera[;|,|.] es que no puedo.", "No es que no quiera, sino que no puedo."] },
    { en: "No, that's not quite it. The thing is, I arrived late.", es: "No, no es eso exactamente. Lo que pasa es que llegué tarde.", accept: [] },
    { en: "She can't have arrived late; I saw her at eight.", es: "No pudo llegar tarde; la vi a las ocho.", accept: ["No pudo [llegar|haber llegado] tarde[;|,|.] la vi a las ocho."] },
    { en: "I'm telling you so that you know.", es: "Te lo cuento para que lo sepas.", accept: ["Te lo digo para que lo sepas."] },
    { en: "I took out some money in case we want to go out tonight.", es: "Saqué plata por si queremos salir esta noche.", accept: ["Saqué [plata|dinero] por si queremos salir esta noche."] }
  ],
  translate: [
    { en: "It's not that we don't want to hand it in; it's just that we're behind.", es: "No es que no queramos entregarlo; lo que pasa es que vamos atrasados.", accept: ["No es que no queramos entregarlo[;|,|.] [lo que pasa es que|es que] vamos atrasados."] },
    { en: "I think you're mistaken; she's his cousin, not his sister.", es: "Creo que te equivocas; es su prima, no su hermana.", accept: ["Creo que [te equivocas|estás equivocado|estás equivocada][;|,|.] es su prima, no su hermana."] },
    { en: "Not only did it not rain, but the weather was wonderful.", es: "No solo no llovió, sino que hizo un tiempo buenísimo.", accept: ["No solo no llovió, sino que hizo un [tiempo|clima] [buenísimo|magnífico|espectacular]."] },
    { en: "I changed schools because my parents moved to Cali.", es: "Cambié de colegio debido a que mis papás se mudaron a Cali.", accept: ["Cambié de colegio [debido a que|porque|ya que] mis [papás|padres] se [mudaron|trasladaron|fueron] a Cali."] },
    { en: "No, it isn't in Lima. It's in Quito. I'm telling you so you don't buy the wrong ticket.", es: "No, no está en Lima. Está en Quito. Te lo digo para que no compres el tiquete equivocado.", accept: ["No, no está en Lima. Está en Quito. Te lo [digo|cuento] para que no compres el [tiquete|pasaje] equivocado."] },
    { en: "Since tomorrow is a holiday, the bank will be closed.", es: "Como mañana es festivo, el banco va a estar cerrado.", accept: ["[Como|Ya que] mañana es festivo, el banco [va a estar|estará] cerrado."] }
  ],
  register: [
    { es: "Nooo, eso no fue así.", en: "Nooo, that's not how it went.", when: "correcting a friend, half laughing" },
    { es: "Lo que pasa es que llegué tarde.", en: "The thing is, I arrived late.", when: "explaining yourself to anyone" },
    { es: "No es eso exactamente; es que el plazo cambió.", en: "That's not quite it; the deadline changed.", when: "correcting a colleague gently" },
    { es: "Me permito aclarar que la reunión no se canceló.", en: "Allow me to clarify that the meeting was not cancelled.", when: "correcting formally, in an email or letter" }
  ],
  personal: {
    prompt: "Someone has the wrong story about you: a missed party, a late report. Correct them in two steps, say why, and say what you'll do so that they forgive you.",
    constraints: [
      { type: "containsAny", words: ["no es eso exactamente", "lo que pasa es que", "no es que"], label: "a soft correction: *lo que pasa es que* or *no es que*" },
      { type: "subjunctiveAfter", trigger: "para que", label: "a purpose: *para que* + the subjunctive" },
      { type: "containsAny", words: ["ya que", "debido a que", "porque", "como "], label: "a reason: *ya que* or *debido a que*" }
    ],
    model: "No, no es eso exactamente. No es que no quisiera ir a tu fiesta; lo que pasa es que tuve que trabajar, ya que mi compañera se enfermó. Te voy a invitar a almorzar para que me perdones."
  },
  pitfalls: [
    "A bare *no, eso es mentira* can sound like an accusation: start with *no es eso exactamente*.",
    "*No es que no quiero* keeps the ordinary form: after *no es que*, *quiera*.",
    "*Para que* always takes the subjunctive; *ya que* and *debido a que* never do."
  ]
},

"fn-conocimiento-b2": {
  source: "merged",
  hook: {
    line: "Two colleagues swap a rumour about their company. In six lines they ask whether the other heard, say when they found out, check a detail, admit what they don't know and confirm what they do.",
    es: "Diana: ¿Te enteraste de que van a vender la empresa?\nLuis: Sí, ya me había enterado. Me enteré por el de sistemas.\nDiana: ¿Y es verdad eso de que cierran la sede de Cali?\nLuis: Ni idea. No tenía ni idea de que la querían cerrar.\nDiana: Bueno, sabes que mañana hay reunión con el gerente, imagino.\nLuis: Pues claro que lo sé. Y no hay duda de que nos va a explicar todo.",
    en: "Diana: Did you hear they're going to sell the company?\nLuis: Yes, I'd already heard. I found out from the IT guy.\nDiana: And is it true, this thing about closing the Cali office?\nLuis: No idea. I had no idea they wanted to close it.\nDiana: Well, you know there's a meeting with the manager tomorrow, I imagine.\nLuis: Of course I know. And there's no doubt he's going to explain everything."
  },
  examples: [
    { es: "Me enteré de la noticia por un amigo, porque en el periódico todavía no habían dicho nada.", en: "I found out about the news from a friend, because the paper still hadn't said anything." },
    { es: "Tengo nociones de programación, aunque no soy experta y siempre le pido ayuda a mi hermano.", en: "I know the basics of programming, although I'm no expert and I always ask my brother for help." },
    { es: "¿Podría confirmarme si la reserva sigue en pie para el viernes a las ocho de la noche?", en: "Could you confirm whether the reservation still stands for Friday at eight in the evening?" }
  ],
  rule: "*Saber* is the state; *enterarse de* is the moment the news reached you, often through someone: *Me enteré por Luis.* Keep the *de*: *me enteré de que...* Already knew: *Ya me había enterado.* *Estar al tanto de* is up to date; *tener nociones de* is a little.\nAsking: *¿Te enteraste de...?* guesses they don't know; *Sabes que..., imagino* guesses they do.\nNot knowing: *No sé*, *ni idea*, *no tengo ni idea de...*; formally, *desconozco*.\nChecking: *¿Es verdad que...?*, *..., ¿no es cierto?*, *¿Quieres decir que...?*; formally, *¿Podría confirmarme...?*\nConfirming: *Pues claro que sí*, *Por supuesto que no*, *No hay duda de que...*",
  readAndPick: [
    { q: "What does Diana assume?", es: "¿Te enteraste de que van a vender la empresa?",
      options: ["Luis already knows", "Luis may not know", "Luis sold it"], answer: 1,
      why: "*¿Te enteraste de...?* opens with news the other person may not have heard." },
    { q: "When did Luis learn the news?", es: "Sí, ya me había enterado.",
      options: ["Just now, from her", "He still hasn't heard a thing", "Before she told him"], answer: 2,
      why: "*Ya me había enterado*: the finding out came before her question." },
    { q: "How much does Luis know about Cali?", es: "Ni idea. No tenía ni idea de que la querían cerrar.",
      options: ["Everything about it", "Nothing at all", "A little"], answer: 1,
      why: "*Ni idea* is a strong, chatty don't know: nothing at all." },
    { q: "What does *imagino* at the end do?", es: "Sabes que mañana hay reunión, imagino.",
      options: ["Assumes he knows", "Asks him", "Invents a whole meeting"], answer: 0,
      why: "A trailing *imagino* assumes the listener already knows." },
    { q: "How does Luis sound here?", es: "Pues claro que lo sé.",
      options: ["Unsure of himself", "Firm, a bit put out", "Formal and very distant"], answer: 1,
      why: "*Pues claro que* confirms firmly, as if the question needn't be asked." },
    { q: "Where would you say this?", es: "¿Podría confirmarme si la reserva sigue en pie?",
      options: ["Texting your brother at night", "To a dog", "Calling the hotel"], answer: 2,
      why: "*¿Podría confirmarme...?* is the polite, formal check for a service call." }
  ],
  yourTurn: [
    { en: "I found out about the news from a friend.", es: "Me enteré de la noticia por un amigo.", accept: [] },
    { en: "Did you hear that Ana is moving? (to a friend)", es: "¿Te enteraste de que Ana se muda?", accept: ["¿Te enteraste de que Ana se va a mudar?", "¿Supiste que Ana se [muda|va a mudar]?"] },
    { en: "I have no idea what time it is.", es: "No tengo ni idea de qué hora es.", accept: [] },
    { en: "Is it true that your sister is getting married? (to a friend)", es: "¿Es verdad que tu hermana se casa?", accept: ["¿Es [verdad|cierto] que tu hermana se [casa|va a casar]?"] },
    { en: "Of course not.", es: "Por supuesto que no.", accept: ["Claro que no."] }
  ],
  translate: [
    { en: "I'd already heard, thanks.", es: "Ya me había enterado, gracias.", accept: [] },
    { en: "We're aware that the purchase is being negotiated.", es: "Estamos informados de que se está negociando la compra.", accept: ["Estamos [informados|al tanto] de que se está negociando la compra."] },
    { en: "You saw it, isn't that right? (to a friend)", es: "Lo viste, ¿no es cierto?", accept: ["Lo viste, ¿[no es cierto|no es así|verdad|cierto]?"] },
    { en: "Do you mean you'd rather go alone? (to a friend)", es: "¿Quieres decir que prefieres ir solo?", accept: ["¿Quieres decir que prefieres ir [solo|sola]?"] },
    { en: "Did you hear about the meeting? Of course I heard. But I had no idea they were going to close the office.", es: "¿Te enteraste de lo de la reunión? Pues claro que me enteré. Pero no tenía ni idea de que iban a cerrar la oficina.", accept: ["¿Te enteraste de lo de la reunión? [Pues claro que|Claro que] me enteré. Pero no tenía ni idea de que [iban a cerrar|fueran a cerrar] la oficina."] },
    { en: "I am not aware of the reasons for that decision. (formal)", es: "Desconozco los motivos de esa decisión.", accept: ["Desconozco [los motivos|las razones] de esa decisión."] }
  ],
  register: [
    { es: "¡Ni idea!", en: "No idea!", when: "with friends, a quick shrug" },
    { es: "No sé, la verdad.", en: "I don't know, honestly.", when: "anywhere, said plainly" },
    { es: "No estoy al tanto de eso.", en: "I'm not up to date on that.", when: "at work, when it isn't your area" },
    { es: "Desconozco los detalles del contrato.", en: "I'm not aware of the details of the contract.", when: "in a formal reply or an official email" }
  ],
  personal: {
    prompt: "Write a short exchange with a colleague about some news: one of you asks if the other heard, one doesn't know part of it, one asks for confirmation, and one confirms firmly.",
    constraints: [
      { type: "regex", pattern: "enter(é|e|aste|ó|o|amos|aron)|había enterado", label: "finding out: *me enteré* or *¿te enteraste?*" },
      { type: "containsAny", words: ["ni idea", "no tengo idea", "no tenía idea", "desconozco"], label: "not knowing: *ni idea* or *desconozco*" },
      { type: "containsAny", words: ["es verdad que", "es cierto que", "no es cierto", "quieres decir que", "podría confirmarme", "verdad?"], label: "a check: *¿es verdad que...?*" },
      { type: "containsAny", words: ["claro que", "por supuesto", "no hay duda de que"], label: "a firm yes: *claro que* or *por supuesto*" }
    ],
    model: "¿Te enteraste de que Marta renunció? Sí, me enteré ayer, pero no tengo ni idea de por qué. ¿Es verdad que se va para España? Por supuesto que sí, ya compró el tiquete."
  },
  pitfalls: [
    "*Me enteré que* drops a *de* that writing keeps: *me enteré de que*.",
    "*Ni idea* with a client sounds careless; there, *desconozco* or *no tengo esa información*.",
    "*Pues claro que sí* can sound put out, as if the question was silly: with a stranger, *sí, claro*."
  ]
},

"nt-reflexion-conocimiento-b2": {
  source: "merged",
  hook: {
    line: "A small business owner writes in her blog about the week the penny dropped. Every line comes at knowing from a different side: an idea arriving, a long awareness, a click, news from outside.",
    es: "Anoche, mientras lavaba los platos, se me ocurrió una idea para el negocio.\nHace meses que soy consciente de que vendemos poco por internet.\nPero solo ayer me di cuenta de por qué: la página no funciona en el celular.\nMe enteré por una clienta, que me escribió muy molesta.\nAhora tengo que reflexionar sobre cómo explicárselo a mi socio, que se cree experto en todo.",
    en: "Last night, while I was washing the dishes, an idea for the business came to me.\nFor months I've been aware that we sell very little online.\nBut only yesterday did I realise why: the website doesn't work on phones.\nI found out from a customer, who wrote to me very upset.\nNow I have to think about how to explain it to my partner, who thinks he's an expert in everything."
  },
  examples: [
    { es: "No se me ocurrió preguntar antes, y ahora el vuelo ya salió sin nosotros.", en: "It didn't occur to me to ask earlier, and now the flight has already left without us." },
    { es: "Me di cuenta de la hora cuando vi que la cafetería estaba cerrando las puertas.", en: "I realised what time it was when I saw the café was closing its doors." },
    { es: "Es consciente del problema desde hace tiempo, pero nunca ha planteado una duda en las reuniones.", en: "He's been aware of the problem for a while, but he has never raised a question in the meetings." }
  ],
  rule: "With *ocurrírsele*, the idea is the subject and arrives to you: *se* + *me*, *te*, *le*, *nos*, *les* + *ocurrió*. *Se me ocurrió una idea.* Plural ideas, plural verb: *se nos ocurrieron dos*. With a plain verb: *No se me ocurrió llamarte.* *¿Cómo se te ocurre...?* is a reproach.\nWhere did the knowing come from? *Darse cuenta de*: it clicked in your own head. *Enterarse de*: it reached you from outside. Both keep *de*.\n*Ser consciente de* is a lasting state of awareness.\n*Creerse* has an edge: *se cree experto*, he thinks he is one.\nThinking it through: *reflexionar sobre*, *analizar*, *plantear una duda*.",
  readAndPick: [
    { q: "Where did the idea come from?", es: "Mientras lavaba los platos, se me ocurrió una idea.",
      options: ["Someone told it to her", "It just came to her", "Online"], answer: 1,
      why: "*Se me ocurrió*: the idea is the subject, and it simply arrived." },
    { q: "How did she learn the site was broken?", es: "Me enteré por una clienta.",
      options: ["She noticed it on her own", "Her partner", "A customer told her"], answer: 2,
      why: "*Enterarse* is news from outside, and *por* names who brought it." },
    { q: "What does *me di cuenta* say?", es: "Solo ayer me di cuenta de por qué.",
      options: ["It finally clicked", "Someone else told her", "She forgot"], answer: 0,
      why: "*Darse cuenta* is the click in your own head; nobody had to tell her." },
    { q: "What does the writer think of her partner?", es: "Mi socio se cree experto en todo.",
      options: ["He truly is an expert", "He thinks he knows it all", "He's honest about what he doesn't know"], answer: 1,
      why: "*Creerse* has a critical edge: he thinks he's an expert, and she doubts it." },
    { q: "How long has she known sales were low?", es: "Hace meses que soy consciente de que vendemos poco.",
      options: ["Since yesterday", "For months", "Not yet"], answer: 1,
      why: "*Ser consciente de* is a lasting state, here for months." },
    { q: "What is the speaker doing?", es: "¿Cómo se te ocurre salir sin chaqueta con este frío?",
      options: ["Asking him for an idea", "Telling him off", "Weather"], answer: 1,
      why: "*¿Cómo se te ocurre...?* isn't a real question: it's a reproach." }
  ],
  yourTurn: [
    { en: "A solution came to me while I was sleeping.", es: "Se me ocurrió una solución mientras dormía.", accept: [] },
    { en: "It didn't occur to him to ask.", es: "No se le ocurrió preguntar.", accept: [] },
    { en: "I didn't realise what time it was.", es: "No me di cuenta de la hora.", accept: ["No me di cuenta de qué hora era."] },
    { en: "He's aware that he made a mistake.", es: "Es consciente de que se equivocó.", accept: [] },
    { en: "We came up with two ideas.", es: "Se nos ocurrieron dos ideas.", accept: [] }
  ],
  translate: [
    { en: "We found out about the meeting too late.", es: "Nos enteramos tarde de la reunión.", accept: ["Nos enteramos de la reunión [demasiado tarde|muy tarde|tarde]."] },
    { en: "She raised a very interesting question in class.", es: "Planteó una duda muy interesante en clase.", accept: ["Planteó una [duda|pregunta] muy interesante en [clase|la clase]."] },
    { en: "He reflected on his decision for days.", es: "Reflexionó sobre su decisión durante días.", accept: ["Reflexionó [sobre|acerca de] su decisión durante días."] },
    { en: "How can you even think of saying that? (to a friend)", es: "¿Cómo se te ocurre decir eso?", accept: [] },
    { en: "I didn't notice anything. Then I found out from my sister. Now I'm aware that I have to change.", es: "No me di cuenta de nada. Después me enteré por mi hermana. Ahora soy consciente de que tengo que cambiar.", accept: ["No me di cuenta de nada. [Después|Luego] me enteré por mi hermana. Ahora soy consciente de que tengo que cambiar."] },
    { en: "He thinks he's an expert in everything.", es: "Se cree experto en todo.", accept: ["Se cree un experto en todo."] }
  ],
  register: [
    { es: "¡Se me prendió el bombillo!", en: "A light bulb went on!", when: "in Colombia, with friends, a sudden idea" },
    { es: "Se me ocurrió una idea.", en: "An idea came to me.", when: "anywhere, offering a suggestion" },
    { es: "Soy consciente de las dificultades.", en: "I'm aware of the difficulties.", when: "in a meeting or a formal reply" },
    { es: "Quisiera plantear una duda sobre el presupuesto.", en: "I'd like to raise a question about the budget.", when: "in a meeting, before an objection" }
  ],
  personal: {
    prompt: "Think of a moment when something clicked for you. Say what you'd been aware of for a while, when you realised the rest or found it out, and what idea came to you.",
    constraints: [
      { type: "regex", pattern: "se (me|te|le|nos|les) ocurri(ó|o|eron)", label: "an idea arriving: *se me ocurrió*" },
      { type: "regex", pattern: "(me|te|se|nos) (di|diste|dio|dimos|dieron) cuenta|enter(é|aste|ó|amos|aron)", label: "how you knew: *me di cuenta* or *me enteré*" },
      { type: "regex", pattern: "(soy|era|es|eres|somos|son|estaba) consciente", label: "awareness: *soy consciente de*" }
    ],
    model: "Hace años que soy consciente de que duermo poco. Pero el mes pasado me di cuenta de que el celular era el problema. Entonces se me ocurrió dejarlo en la cocina por la noche."
  },
  pitfalls: [
    "*Yo ocurrí una idea* is not Spanish: the idea is the subject, *se me ocurrió una idea*.",
    "Your own tiredness clicks inside you, so *me di cuenta de que estaba cansada*, not *me enteré*.",
    "In writing, *se cree que* is usually it is believed; for he thinks he's, *se cree experto*."
  ]
},

"nt-anticipacion-b2": {
  source: "merged",
  hook: {
    line: "A family plans a trip in their group chat. Every message is about doing things early: getting up before dawn, paying ahead, arriving with time to spare, moving a meeting forward.",
    es: "Papá: El vuelo es a las seis de la mañana, así que nos toca madrugar.\nMamá: Y anoche trasnochamos por la maleta. ¡Qué combinación!\nPapá: El hotel se paga por adelantado; ya lo pagué.\nMamá: Lleguen al aeropuerto con tiempo. Mi reloj está adelantado diez minutos, ojo.\nPapá: Y la reunión del lunes la adelanté para el viernes, para no perder el vuelo de regreso.",
    en: "Dad: The flight is at six in the morning, so we have to get up really early.\nMom: And last night we stayed up late because of the suitcase. What a combination!\nDad: The hotel is paid in advance; I've already paid it.\nMom: Get to the airport with time to spare. My watch is ten minutes fast, careful.\nDad: And I moved Monday's meeting forward to Friday, so as not to miss the flight back."
  },
  examples: [
    { es: "Tuve que madrugar para tomar el primer vuelo, y llegué a la reunión antes de la hora.", en: "I had to get up very early to catch the first flight, and I got to the meeting ahead of time." },
    { es: "Adelantamos la cita médica para el martes, porque el doctor se va de vacaciones el miércoles.", en: "We moved the doctor's appointment forward to Tuesday, because the doctor goes on holiday on Wednesday." },
    { es: "El bebé nació antes de tiempo, pero ya pesa tres kilos y está muy bien.", en: "The baby was born early, but he already weighs three kilos and is doing very well." }
  ],
  rule: "*Adelantar* moves something earlier; *aplazar* or *posponer*, later. In Colombia *correr* does either: *corrimos la cita*. The new date goes after *para*: *la adelanté para el viernes*.\nOnce moved, it is ahead: *Mi reloj está adelantado*, my watch is fast.\n*Madrugar* is getting up very early, in the dark; *trasnochar* is staying up late. *Me toca madrugar*: it's my turn, I have to. *Toca* works like *gustar*.\n*Con tiempo* is with time to spare, the good kind of early. *Por adelantado* is paid or done in advance. *Antes de tiempo* is too soon: a birth, a decision. *Antes de la hora* is ahead of schedule.",
  readAndPick: [
    { q: "What does *nos toca madrugar* mean?", es: "El vuelo es a las seis, así que nos toca madrugar.",
      options: ["They must be up before dawn", "Sleep in", "They'll stay up all night again"], answer: 0,
      why: "*Madrugar* is getting up very early, and *nos toca* says they have to." },
    { q: "When was the hotel paid?", es: "El hotel se paga por adelantado; ya lo pagué.",
      options: ["After the stay", "Before the stay", "Half at the door, half later"], answer: 1,
      why: "*Por adelantado* is paid in advance, before you arrive." },
    { q: "What's wrong with Mom's watch?", es: "Mi reloj está adelantado diez minutos.",
      options: ["It's ten minutes behind", "It's stopped", "It's ten minutes fast"], answer: 2,
      why: "*Está adelantado* is ahead: it shows a later time than the real one." },
    { q: "Which way did the meeting move?", es: "La reunión del lunes la adelanté para el viernes.",
      options: ["Earlier, to Friday", "Later, to next Monday", "Nowhere"], answer: 0,
      why: "*Adelantar* moves it earlier; the new date comes after *para*." },
    { q: "Is *antes de tiempo* good news here?", es: "El bebé nació antes de tiempo.",
      options: ["Neutral, just early", "Too soon, a worry", "On the exact day"], answer: 1,
      why: "*Antes de tiempo* is premature; for good planning, *con tiempo*." },
    { q: "What does Mom want?", es: "Lleguen al aeropuerto con tiempo.",
      options: ["Stay home", "Arrive at the very last minute", "Arrive with time spare"], answer: 2,
      why: "*Con tiempo* is the good kind of early: with time to spare." }
  ],
  yourTurn: [
    { en: "We moved the meeting forward to Monday.", es: "Adelantamos la reunión para el lunes.", accept: ["Adelantamos la reunión [para el|al] lunes."] },
    { en: "I think your watch is ten minutes fast. (to a friend)", es: "Creo que tu reloj está adelantado diez minutos.", accept: [] },
    { en: "Leave home with plenty of time. (to a friend)", es: "Sal de la casa con tiempo.", accept: ["Sal de [la casa|casa] con tiempo.", "Sal de la casa con suficiente tiempo."] },
    { en: "The deposit has to be paid in advance.", es: "Hay que pagar el depósito por adelantado.", accept: ["El depósito se [paga|tiene que pagar] por adelantado."] },
    { en: "I have to get up early tomorrow.", es: "Mañana me toca madrugar.", accept: ["Me toca madrugar mañana.", "Mañana tengo que madrugar."] }
  ],
  translate: [
    { en: "The flight left ahead of the scheduled time.", es: "El vuelo salió antes de la hora prevista.", accept: ["El vuelo salió antes de la hora [prevista|programada]."] },
    { en: "Book the hotel in advance to get a better price. (to a friend)", es: "Reserva el hotel por adelantado para conseguir mejor precio.", accept: ["Reserva el hotel [por adelantado|con anticipación] para conseguir [mejor precio|un mejor precio]."] },
    { en: "We pay the rent in advance.", es: "Pagamos el arriendo por adelantado.", accept: ["Pagamos el arriendo anticipado."] },
    { en: "We gained time by leaving before the traffic.", es: "Ganamos tiempo saliendo antes del tráfico.", accept: ["Ganamos tiempo saliendo antes del [tráfico|trancón]."] },
    { en: "Last night I stayed up late, and today I had to get up very early. The meeting was moved forward to eight. I got there on time, but half asleep.", es: "Anoche trasnoché, y hoy me tocó madrugar. La reunión la adelantaron para las ocho. Llegué a tiempo, pero medio dormido.", accept: ["Anoche trasnoché, y hoy me tocó madrugar. [La reunión la adelantaron|Adelantaron la reunión] para las ocho. Llegué a tiempo, pero medio [dormido|dormida]."] },
    { en: "He arrived early, without warning.", es: "Llegó antes de tiempo, sin avisar.", accept: ["Llegó [antes de tiempo|antes de la hora|temprano], sin avisar."] }
  ],
  register: [
    { es: "¡Uy, me tocó madrugar!", en: "Ugh, I had to get up at the crack of dawn!", when: "complaining to friends about an early start" },
    { es: "¿Podemos correr la cita para el martes?", en: "Can we move the appointment to Tuesday?", when: "in Colombia, rearranging plans with anyone" },
    { es: "Le propongo adelantar la reunión para el lunes.", en: "I suggest we bring the meeting forward to Monday.", when: "in a work email, as usted" },
    { es: "El pago debe realizarse por adelantado.", en: "Payment must be made in advance.", when: "in a contract, a booking or terms and conditions" }
  ],
  personal: {
    prompt: "Write about a week when your plans moved: something brought forward or put off, an early start or a late night, and something paid or done in advance.",
    constraints: [
      { type: "regex", pattern: "adelant(é|e|aron|ó|o|amos|ar)\\b|aplaz|pospus|pospon|corr(imos|ieron|ió) (la|el)", label: "a plan moved: *la adelanté* or *la aplazaron*" },
      { type: "containsAny", words: ["madrug", "trasnoch"], label: "an early start or a late night: *madrugar* or *trasnochar*" },
      { type: "containsAny", words: ["por adelantado", "con tiempo", "antes de tiempo", "antes de la hora"], label: "ahead of time: *por adelantado* or *con tiempo*" }
    ],
    model: "El lunes me tocó madrugar porque adelantaron mi turno en el hospital. El martes trasnoché terminando un informe. El viernes aplazamos la cena con mis amigos, pero yo ya había pagado la reserva por adelantado."
  },
  pitfalls: [
    "*Madrugar* is getting up early, not arriving early: for that, *llegar temprano*.",
    "*Antes de tiempo* sounds premature; for good planning, *con tiempo*.",
    "For a plan changed today, Colombia says *adelantamos la reunión*; *hemos adelantado* sounds like Spain."
  ]
},

"nt-simultaneidad-b2": {
  source: "merged",
  hook: {
    line: "A parenting blog describes Tuesday mornings in one Bogotá flat. Things happen at once, side by side, by chance, and the two parents agree on one thing.",
    es: "Los martes nuestros horarios coinciden: los dos salimos a las siete.\nYo preparo el desayuno; mientras tanto, mi esposo viste a los niños.\nMi hija mayor desayuna y repasa para el examen a la vez.\nPor pura coincidencia, el bus del colegio y el mío pasan al mismo tiempo.\nMi esposo y yo coincidimos en que es el día más caótico de la semana.",
    en: "On Tuesdays our schedules coincide: we both leave at seven.\nI make breakfast; meanwhile, my husband dresses the kids.\nMy eldest daughter eats breakfast and revises for her exam at the same time.\nBy pure coincidence, the school bus and mine come at the same time.\nMy husband and I agree that it's the most chaotic day of the week."
  },
  examples: [
    { es: "Estudia y trabaja a la vez, así que solo tiene libre el domingo por la tarde.", en: "She studies and works at the same time, so she only has Sunday afternoon free." },
    { es: "Coincido contigo en que el plan es caro, pero no en que debamos cancelarlo.", en: "I agree with you that the plan is expensive, but not that we should cancel it." },
    { es: "La traducción simultánea permite seguir la conferencia en tiempo real, aunque no hables el idioma.", en: "Simultaneous translation lets you follow the lecture in real time, even if you don't speak the language." }
  ],
  rule: "*A la vez* or *al mismo tiempo*: usually one person, two things at once, at the end: *Desayuna y repasa a la vez.*\n*Mientras tanto*, or *entretanto* in writing: the camera moves to someone else during that time. It opens the second half, after a semicolon or a full stop: *Yo cocino; mientras tanto, él pone la mesa.*\n*Simultáneo* and *simultáneamente*: running in parallel, often by design: *traducción simultánea*.\n*Coincidir* is lining up, often by chance: *Nuestros horarios coinciden.* It's also meeting by chance, and agreeing: *coincidir con* + person + *en* + the point. *Coincido contigo en que es caro.* With *nosotros*: *coincidimos en todo*.",
  readAndPick: [
    { q: "Who does two things at once?", es: "Mi hija desayuna y repasa para el examen a la vez.",
      options: ["Her daughter", "Her husband", "Nobody, they take turns"], answer: 0,
      why: "*A la vez* sits with one person doing two things together." },
    { q: "Who dresses the kids?", es: "Yo preparo el desayuno; mientras tanto, mi esposo viste a los niños.",
      options: ["She does it later on", "Her husband, meanwhile", "The kids do it all by themselves"], answer: 1,
      why: "*Mientras tanto* moves to another person during the same stretch of time." },
    { q: "Did anyone plan the buses?", es: "Por pura coincidencia, los dos buses pasan al mismo tiempo.",
      options: ["Yes, the school did", "She planned it", "No, it's chance"], answer: 2,
      why: "*Por pura coincidencia* says nobody arranged it." },
    { q: "What do she and her husband do?", es: "Mi esposo y yo coincidimos en que es el día más caótico.",
      options: ["Argue", "They agree on it", "Meet by chance in town"], answer: 1,
      why: "*Coincidir en que* is to agree on a point." },
    { q: "How far does the speaker agree?", es: "Coincido contigo en que es caro, pero no en que debamos cancelarlo.",
      options: ["In part", "Fully", "Not at all"], answer: 0,
      why: "She agrees on the cost and not on cancelling: *coincido... pero no en que*." }
  ],
  yourTurn: [
    { en: "She studies and works at the same time.", es: "Estudia y trabaja a la vez.", accept: ["Estudia y trabaja al mismo tiempo."] },
    { en: "I was making dinner; meanwhile, she was setting the table.", es: "Yo preparaba la comida; mientras tanto, ella ponía la mesa.", accept: ["Yo [preparaba|hacía] la [comida|cena][;|,|.] mientras tanto, ella ponía la mesa."] },
    { en: "Our schedules coincide on Tuesdays.", es: "Nuestros horarios coinciden los martes.", accept: ["Los martes nuestros horarios coinciden."] },
    { en: "I agree with you on almost everything. (to a friend)", es: "Coincido contigo en casi todo.", accept: [] },
    { en: "You can't do everything at once.", es: "No se puede hacer todo a la vez.", accept: ["No se puede hacer todo al mismo tiempo.", "No puedes hacer todo a la vez."] }
  ],
  translate: [
    { en: "Our holidays coincided by chance.", es: "Nuestras vacaciones coincidieron por casualidad.", accept: [] },
    { en: "They organised both events simultaneously on purpose.", es: "Organizaron los dos eventos simultáneamente a propósito.", accept: ["Organizaron los dos eventos [simultáneamente|al mismo tiempo] a propósito."] },
    { en: "He cooks and listens to music at the same time.", es: "Cocina y escucha música a la vez.", accept: ["Cocina y escucha música al mismo tiempo."] },
    { en: "We agree that the problem is transport.", es: "Coincidimos en que el problema es el transporte.", accept: [] },
    { en: "I was packing; meanwhile, he was calling a taxi. By coincidence, my sister arrived at the same time. In the end she took us to the airport.", es: "Yo hacía las maletas; mientras tanto, él pedía un taxi. Por coincidencia, mi hermana llegó al mismo tiempo. Al final, ella nos llevó al aeropuerto.", accept: ["Yo [hacía|empacaba] las maletas[;|,|.] mientras tanto, él [pedía|llamaba] un taxi. Por [coincidencia|casualidad], mi hermana llegó al mismo tiempo. Al final, ella nos llevó al aeropuerto."] },
    { en: "I ran into Laura at the bank.", es: "Coincidí con Laura en el banco.", accept: ["Me encontré [con|a] Laura en el banco."] }
  ],
  register: [
    { es: "Hago mil cosas al tiempo.", en: "I'm doing a thousand things at once.", when: "in Colombia, chatting about a busy day" },
    { es: "Hago dos cosas a la vez.", en: "I'm doing two things at once.", when: "anywhere, said plainly" },
    { es: "Coincido con usted en lo fundamental.", en: "I agree with you on the essentials.", when: "in a meeting, as usted" },
    { es: "Ambos eventos se realizarán simultáneamente.", en: "Both events will take place simultaneously.", when: "in an official announcement or programme" }
  ],
  personal: {
    prompt: "Describe a busy moment in your home or office: who does two things at once, what someone else does meanwhile, and something you all agree on.",
    constraints: [
      { type: "containsAny", words: ["a la vez", "al mismo tiempo", "al tiempo", "simultáneamente"], label: "two things at once: *a la vez*" },
      { type: "containsAny", words: ["mientras tanto", "entretanto"], label: "meanwhile: *mientras tanto*" },
      { type: "regex", pattern: "coincid", label: "lining up or agreeing: *coincidimos en que*" }
    ],
    model: "Los lunes en mi oficina todo pasa a la vez. Mi jefa contesta correos y habla por teléfono al mismo tiempo. Yo preparo el informe; mientras tanto, mi compañero organiza la sala. Todos coincidimos en que el lunes debería empezar a las diez."
  },
  pitfalls: [
    "*Mientras tanto* moves to another person or place; for one person doing two things, *a la vez*.",
    "*Coincido de que* is not Spanish: *coincido contigo en que*.",
    "*Simultáneo* suggests a plan; for chance, *coincidir*."
  ]
},

"nt-repeticion-b2": {
  source: "merged",
  hook: {
    line: "A humorous column lists a boyfriend's habits, from the healthy to the maddening. The writer keeps count of what he does again, and again, and again.",
    es: "Mi novio tiene la manía de revisar el celular cada cinco minutos.\nLe he dicho una y otra vez que lo deje en la mesa cuando comemos.\nPromete que no lo va a volver a hacer, y al día siguiente vuelve a hacerlo.\nTiene la costumbre de correr todas las mañanas, eso sí, y nunca falla.\nY su único vicio es el tinto: se toma seis al día.",
    en: "My boyfriend has a habit of checking his phone every five minutes.\nI've told him over and over to leave it on the table when we eat.\nHe promises he won't do it again, and the next day he does it again.\nHe's in the habit of running every morning, I'll give him that, and he never misses.\nAnd his only vice is black coffee: he has six a day."
  },
  examples: [
    { es: "Lo intentamos una y otra vez hasta que la puerta por fin se abrió a las tres.", en: "We tried over and over until the door finally opened at three." },
    { es: "Perdí todo el documento y tuve que empezar de nuevo, esta vez guardando cada diez minutos.", en: "I lost the whole document and had to start over, saving every ten minutes this time." },
    { es: "Nunca volvió a llamar después de esa cena, y yo nunca volví a ese restaurante.", en: "He never called again after that dinner, and I never went back to that restaurant." }
  ],
  rule: "For again, Spanish often puts *volver a* in front: *volvió a llamar*. Only *volver* changes; the second verb stays plain. *Nunca volvió a llamar* is never again. With no verb after it, *volver* is come back.\nAlso: *otra vez*, *de nuevo* (everyday), *nuevamente* (written), *una vez más*, *una y otra vez* (over and over).\nHabits carry a judgement: *tener la costumbre de* (neutral), *tener la manía de* (a quirk, almost an obsession), *tener el vicio de* (a bad habit). *Tienes la manía de...* sounds like an accusation.\nA *ciclo* closes and starts again; a *ritmo* is the pace. A job can be *rutinario* or *repetitivo*.",
  readAndPick: [
    { q: "How does the writer see the phone checking?", es: "Tiene la manía de revisar el celular cada cinco minutos.",
      options: ["A healthy routine", "An odd, fixed quirk", "Something he did once"], answer: 1,
      why: "*La manía de* is a quirk close to an obsession, and it sounds like a complaint." },
    { q: "What happens the next day?", es: "Al día siguiente vuelve a hacerlo.",
      options: ["He stops for good", "He apologises", "He does it again"], answer: 2,
      why: "*Vuelve a hacerlo* is he does it again; only *volver* changes." },
    { q: "How is his running described?", es: "Tiene la costumbre de correr todas las mañanas.",
      options: ["As a plain habit", "As a vice", "As a quirk to hide"], answer: 0,
      why: "*La costumbre de* is neutral: just something he always does." },
    { q: "How many times did they try?", es: "Lo intentamos una y otra vez hasta que funcionó.",
      options: ["Once", "Over and over", "Exactly twice, then gave up"], answer: 1,
      why: "*Una y otra vez* is over and over, until it worked." },
    { q: "Did he ever call again?", es: "Nunca volvió a llamar después de esa cena.",
      options: ["Yes, the next morning", "No, never again", "Yes"], answer: 1,
      why: "*Nunca volvió a llamar* is never again." },
    { q: "What does *empezar de nuevo* mean?", es: "Tuve que empezar de nuevo.",
      options: ["Start over", "Begin a new job", "Stop"], answer: 0,
      why: "*De nuevo* is again: she started the document over." }
  ],
  yourTurn: [
    { en: "He called again.", es: "Volvió a llamar.", accept: ["Llamó otra vez.", "Llamó de nuevo."] },
    { en: "She never wrote again.", es: "Nunca volvió a escribir.", accept: ["No volvió a escribir nunca.", "Nunca más escribió."] },
    { en: "He has a habit of checking his phone every five minutes.", es: "Tiene la manía de revisar el celular cada cinco minutos.", accept: ["Tiene la [manía|costumbre] de revisar el celular cada cinco minutos."] },
    { en: "We tried over and over until it worked.", es: "Lo intentamos una y otra vez hasta que funcionó.", accept: [] },
    { en: "Smoking is a hard vice to give up.", es: "Fumar es un vicio difícil de dejar.", accept: [] }
  ],
  translate: [
    { en: "I lost the whole document and had to start over.", es: "Perdí todo el documento y tuve que empezar de nuevo.", accept: ["Perdí todo el documento y tuve que [empezar de nuevo|volver a empezar|empezar otra vez]."] },
    { en: "The rhythm of the music made people want to dance.", es: "El ritmo de la música invitaba a bailar.", accept: [] },
    { en: "It's just a quirk of his; don't make a big deal of it.", es: "Es una manía suya; no le des importancia.", accept: ["Es una manía suya[;|,|.] no le des importancia."] },
    { en: "A repetitive job can be exhausting.", es: "Un trabajo repetitivo puede ser agotador.", accept: ["Un trabajo repetitivo puede [ser|resultar] agotador."] },
    { en: "I've told him over and over. He promises he won't do it again. And the next day he does it again.", es: "Se lo he dicho una y otra vez. Promete que no lo va a volver a hacer. Y al día siguiente vuelve a hacerlo.", accept: ["Se lo [he dicho|dije] una y otra vez. Promete que no [lo va a volver a hacer|va a volver a hacerlo|lo volverá a hacer]. Y al día siguiente [vuelve a hacerlo|lo vuelve a hacer]."] },
    { en: "The museum wanted to recreate the atmosphere of the nineteenth century.", es: "El museo quiso recrear el ambiente del siglo XIX.", accept: ["El museo quiso recrear el ambiente del siglo diecinueve."] }
  ],
  register: [
    { es: "¡Otra vez la misma cantaleta!", en: "The same old nagging again!", when: "in Colombia, fed up with a repeated complaint" },
    { es: "Lo hizo otra vez.", en: "He did it again.", when: "anywhere, said plainly" },
    { es: "Le recuerdo nuevamente que el plazo vence el lunes.", en: "I remind you once again that the deadline is Monday.", when: "in a formal reminder email" },
    { es: "El proceso es cíclico y se repite cada año.", en: "The process is cyclical and repeats every year.", when: "in a report or a textbook" }
  ],
  personal: {
    prompt: "Write about the habits of someone you live or work with: one neutral habit, one quirk or vice, and something they keep doing again.",
    constraints: [
      { type: "containsAny", words: ["la costumbre de", "el hábito de"], label: "a neutral habit: *tiene la costumbre de*" },
      { type: "containsAny", words: ["la manía de", "el vicio de", "un vicio", "una manía", "su único vicio"], label: "a quirk or a vice: *la manía de* or *el vicio de*" },
      { type: "regex", pattern: "(vuelve|vuelven|volvió|volvieron|vuelvo|volví|volver) a [a-záéíóúñ]+r\\b|una y otra vez", label: "again: *vuelve a hacerlo* or *una y otra vez*" }
    ],
    model: "Mi hermana tiene la costumbre de leer antes de dormir. También tiene la manía de ordenar los libros por colores. Su único vicio es el chocolate. Le dije que lo dejara, pero cada noche vuelve a comer una barra entera."
  },
  pitfalls: [
    "*Volvió llamar* drops the *a*: *volvió a llamar*.",
    "*Hábito*, *manía* and *vicio* are not interchangeable: the word carries the judgement.",
    "*Nuevamente* reads as written; in conversation, *otra vez* or *de nuevo*."
  ]
},

"task-b2-citar": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: an account of a real disagreement, sixteen sentences or more, with *decir* twice at most. The model reports a heated project meeting, and every verb takes a side.",
    es: "En la reunión del martes, la gerente afirmó que el proyecto iba bien.\nAndrés argumentó que el calendario era inviable y que necesitaban dos semanas más.\nElla sostuvo que no había tiempo, pero él insistió en que se revisaran las fechas.\nEntonces Carolina insinuó que el problema era otro: que el equipo estaba agotado.\nAndrés soltó que nadie le había preguntado nada antes de firmar el contrato.\nLa gerente se limitó a responder que lo revisaría al día siguiente.",
    en: "At Tuesday's meeting, the manager stated that the project was going well.\nAndrés argued that the schedule was unworkable and that they needed two more weeks.\nShe held that there was no time, but he insisted that the dates be reviewed.\nThen Carolina implied that the problem was something else: that the team was exhausted.\nAndrés blurted out that nobody had asked him anything before the contract was signed.\nThe manager merely replied that she would look into it the next day."
  },
  examples: [
    { es: "Argumentó que el calendario era inviable, aunque reconoció que el cliente tenía prisa.", en: "She argued that the schedule was unworkable, although she admitted the client was in a hurry." },
    { es: "Insinuó que el problema era otro, pero no quiso decir quién tenía la culpa.", en: "He implied the problem was something else, but he wouldn't say who was to blame." },
    { es: "Se limitó a responder que lo revisaría, y salió de la sala sin despedirse de nadie.", en: "She merely replied that she would look at it, and left the room without saying goodbye to anyone." }
  ],
  rule: "Report a real disagreement in sixteen sentences or more, with *decir* twice at most.\nThe verb carries your judgement, so choose it:\n*afirmó*: stated, neutral and formal. *explicó*: neutral.\n*argumentó*: gave reasons. *sostuvo*: held the line.\n*insinuó*: hinted, wouldn't commit. *soltó*: it came out badly.\n*se limitó a responder que*: merely replied, and no more.\nBackshift as you go: *era*, *había firmado*, *revisaría*. After *insistió en que*, the subjunctive: *se revisaran*.\nKeep track of who said what with names, *ella*, *él*, *la gerente*: never three *dijo* in a row.\nPretending the verb is neutral is naive.",
  readAndPick: [
    { q: "Which verb says she wouldn't commit?", es: "Carolina insinuó que el problema era otro.",
      options: ["*afirmó*", "*insinuó*", "*se limitó a responder*"], answer: 1,
      why: "*Insinuar* hints at something without saying it straight out." },
    { q: "How did Andrés's remark come out?", es: "Andrés soltó que nadie le había preguntado nada.",
      options: ["Calm, and well prepared", "As a question", "Badly, in a burst"], answer: 2,
      why: "*Soltar* says it came out suddenly, and not in the best way." },
    { q: "What did the manager do at the end?", es: "Se limitó a responder que lo revisaría.",
      options: ["Gave a long, careful answer", "Said that and no more", "Refused"], answer: 1,
      why: "*Se limitó a* is merely: she said that much and nothing else." },
    { q: "What does *sostuvo* add?", es: "Ella sostuvo que no había tiempo.",
      options: ["She held her ground", "She changed her mind", "She was joking"], answer: 0,
      why: "*Sostener* is to keep a position under pressure." },
    { q: "What did Andrés do with his view?", es: "Andrés argumentó que el calendario era inviable.",
      options: ["Backed it with reasons", "Agreed with every point", "Left"], answer: 0,
      why: "*Argumentar* gives reasons, not just an opinion." }
  ],
  yourTurn: [
    { en: "She argued that the schedule was unworkable.", es: "Argumentó que el calendario era inviable.", accept: ["Argumentó que el [calendario|cronograma] era inviable."] },
    { en: "He implied that the problem was something else.", es: "Insinuó que el problema era otro.", accept: [] },
    { en: "She merely replied that she would look at it.", es: "Se limitó a responder que lo revisaría.", accept: ["Se limitó a responder que lo iba a revisar."] },
    { en: "He insisted that the dates be reviewed.", es: "Insistió en que se revisaran las fechas.", accept: ["Insistió en que [revisaran|revisáramos] las fechas."] }
  ],
  translate: [
    { en: "The manager stated that the project was going well.", es: "La gerente afirmó que el proyecto iba bien.", accept: ["La gerente afirmó que el proyecto [iba|estaba yendo|marchaba] bien."] },
    { en: "He held that there was no time.", es: "Sostuvo que no había tiempo.", accept: [] },
    { en: "She blurted out that nobody had asked her.", es: "Soltó que nadie le había preguntado.", accept: ["Soltó que nadie le había preguntado nada."] },
    { en: "He explained that the client was in a hurry.", es: "Explicó que el cliente tenía prisa.", accept: ["Explicó que el cliente tenía afán."] },
    { en: "Andrés argued that they needed two more weeks. The manager held that there was no time. In the end she merely replied that she would look at it.", es: "Andrés argumentó que necesitaban dos semanas más. La gerente sostuvo que no había tiempo. Al final se limitó a responder que lo revisaría.", accept: ["Andrés argumentó que necesitaban dos semanas más. La gerente sostuvo que no había tiempo. Al final, se limitó a responder que lo [revisaría|iba a revisar]."] },
    { en: "Nobody had asked him anything before signing.", es: "Nadie le había preguntado nada antes de firmar.", accept: [] }
  ],
  register: [
    { es: "Y él me salió con que no sabía nada.", en: "And he came out with saying he knew nothing.", when: "telling a friend about an argument" },
    { es: "Me explicó que no sabía nada.", en: "He explained that he knew nothing.", when: "anywhere, a neutral report" },
    { es: "El funcionario sostuvo que desconocía los hechos.", en: "The official maintained that he was unaware of the events.", when: "in a news report" },
    { es: "La parte demandada manifestó no tener conocimiento del asunto.", en: "The defendant stated that they had no knowledge of the matter.", when: "in a legal document or court report" }
  ],
  personal: {
    prompt: "Write an account of a real disagreement between two people, reporting what each said: sixteen sentences or more, with *decir* twice at most.",
    constraints: [
      { type: "minSentences", n: 16, label: "sixteen sentences or more" },
      { type: "containsAny", words: ["argumentó", "sostuvo", "insinuó", "soltó", "se limitó a"], label: "a verb that judges: *sostuvo*, *insinuó* or *soltó*" },
      { type: "regex", pattern: "(afirm|explic|coment|reconoci|neg|insisti|propus|sugir|admiti)[a-záéíóú]*", label: "another speech verb: *afirmó* or *reconoció*" }
    ],
    model: "El domingo, en el almuerzo familiar, mi tío Jorge y mi prima Valentina discutieron por la finca. Mi tío afirmó que había que venderla antes de diciembre. Argumentó que nadie la visitaba y que los impuestos eran muy altos. Valentina sostuvo que la finca era de la abuela y que no se podía vender sin ella. Mi tío insinuó que la abuela ya no entendía bien los papeles. Entonces Valentina soltó que él solo quería la plata. Hubo un silencio largo. Mi mamá explicó que la abuela había firmado un documento hace dos años. Mi tío reconoció que no lo conocía. Valentina insistió en que lo leyeran todos juntos. Mi tío se limitó a responder que lo pensaría. Después, mi abuela dijo que estaba cansada de tanta discusión. Nadie se atrevió a contestarle. Al final, mi papá propuso hablar con un abogado en enero. Todos estuvieron de acuerdo, aunque mi tío no parecía convencido. Yo creo que la discusión va a volver en Navidad."
  },
  pitfalls: [
    "Three *dijo* in a row flatten the story; each sharper verb tells the reader what you think.",
    "*Soltó* and *insinuó* are judgements, not facts: use them only when you mean them.",
    "*Dijo que el calendario es inviable* keeps it true now; in a story, backshift: *era*."
  ]
},

/* ---- unit b2-u50 · Putting the weight where you want it ------------------ */

"dc-rematizacion-tematizacion-b2": {
  source: "merged",
  hook: {
    line: "Camila and Pablo sort out who paid what on their new flat. Every reply moves the weight: the known thing first, the news last, one piece put under a spotlight.",
    es: "Camila: ¿Quién firmó el contrato del arriendo?\nPablo: El contrato lo firmé yo. La plata la puso tu mamá.\nCamila: ¿Y lo del depósito? No entiendo nada.\nPablo: Fue en marzo cuando lo pagamos, no en abril.\nCamila: Lo que no entiendo es por qué nadie me avisó.\nPablo: A tu mamá le dije que te contara. Fue ella quien se olvidó.",
    en: "Camila: Who signed the rental contract?\nPablo: The contract, I signed. The money, your mom put in.\nCamila: And the deposit business? I don't understand a thing.\nPablo: It was in March that we paid it, not in April.\nCamila: What I don't understand is why nobody told me.\nPablo: Your mom, I told her to tell you. It was her who forgot."
  },
  examples: [
    { es: "El informe lo terminé yo anoche, pero la presentación todavía la está haciendo Laura.", en: "The report, I finished last night, but the presentation Laura is still doing." },
    { es: "Fue en el parque de la 93 donde nos conocimos, un sábado de lluvia hace diez años.", en: "It was in the park on 93rd Street that we met, one rainy Saturday ten years ago." },
    { es: "Lo de la reunión del lunes es un lío, y eso de madrugar tanto tampoco me gusta.", en: "The business with Monday's meeting is a mess, and this getting up so early thing I don't like either." }
  ],
  rule: "What comes first is treated as known; what comes last is the news.\nPut the thing first, then repeat it with *lo*, *la*, *los*, *las* before the verb: *El contrato lo firmé yo.* For a person add *a*: *A mi mamá la llamo mañana.* For told or gave, *le*: *A tu mamá le dije.* Without the repeat it isn't Spanish. A bare word with no article takes none: *Plata no tengo.*\nTo spotlight one piece, frame it with *ser*: *Fue ella quien se olvidó.* *Fue en marzo cuando lo pagamos.* *Es aquí donde vivo.* *Lo que no entiendo es por qué.*\n*Lo de* + a known matter: *lo del depósito*. *Eso de* + a verb: *eso de madrugar*.",
  readAndPick: [
    { q: "Who signed the contract?", es: "El contrato lo firmé yo.",
      options: ["Pablo himself", "Camila's own mother", "Nobody"], answer: 0,
      why: "The contract is known, so it goes first; the news, *yo*, comes last." },
    { q: "What is Pablo highlighting?", es: "Fue en marzo cuando lo pagamos, no en abril.",
      options: ["Who paid it", "When they paid it", "How much they paid"], answer: 1,
      why: "*Fue en marzo cuando* puts the time under the spotlight." },
    { q: "What does *lo del depósito* point at?", es: "¿Y lo del depósito? No entiendo nada.",
      options: ["Something brand new to both", "A shop", "The deposit matter"], answer: 2,
      why: "*Lo de* picks up a matter both people already know about." },
    { q: "Who forgot?", es: "Fue ella quien se olvidó.",
      options: ["Pablo, as always", "Camila's mom", "Camila"], answer: 1,
      why: "*Fue ella quien* spotlights the person: it was her mom, not Pablo." },
    { q: "What is Camila's main point?", es: "Lo que no entiendo es por qué nadie me avisó.",
      options: ["Why nobody told her", "What a deposit is for", "When"], answer: 0,
      why: "*Lo que no entiendo es* saves the real point for the end." },
    { q: "Why is there no repeated *la* here?", es: "Plata no tengo.",
      options: ["It's a typo", "*Plata* has no article", "Questions never take one at all"], answer: 1,
      why: "A bare word with no article goes first without the repeat: *plata no tengo*." }
  ],
  yourTurn: [
    { en: "The contract, I signed it.", es: "El contrato lo firmé yo.", accept: [] },
    { en: "My sister, I called her last night.", es: "A mi hermana la llamé anoche.", accept: [] },
    { en: "It was María who found the letter.", es: "Fue María quien encontró la carta.", accept: ["Fue María la que encontró la carta."] },
    { en: "What I don't understand is why.", es: "Lo que no entiendo es por qué.", accept: [] },
    { en: "That business with the money is a mess.", es: "Lo de la plata es un lío.", accept: ["Lo [de la plata|del dinero] es un lío."] }
  ],
  translate: [
    { en: "The book, Juan bought it last week.", es: "El libro lo compró Juan la semana pasada.", accept: [] },
    { en: "It was yesterday that I last saw him.", es: "Fue ayer cuando lo vi por última vez.", accept: [] },
    { en: "This is where it all began.", es: "Es aquí donde todo empezó.", accept: ["Fue aquí donde todo empezó.", "Aquí fue donde todo empezó."] },
    { en: "That word, how is it pronounced?", es: "Esa palabra, ¿cómo se pronuncia?", accept: [] },
    { en: "The report, Laura finished it. The slides, I'm doing them. And the meeting business, nobody understands it.", es: "El informe lo terminó Laura. Las diapositivas las estoy haciendo yo. Y lo de la reunión no lo entiende nadie.", accept: ["El informe lo terminó Laura. Las diapositivas las [estoy haciendo|hago] yo. Y lo de la reunión no lo entiende nadie."] },
    { en: "As for what you said yesterday, I have my doubts.", es: "En cuanto a lo que dijiste ayer, tengo mis dudas.", accept: ["En cuanto a lo que [dijiste|comentabas] ayer, tengo mis dudas."] }
  ],
  register: [
    { es: "Eso de madrugar no es lo mío.", en: "This getting up early thing isn't for me.", when: "with friends, about a habit you dislike" },
    { es: "Lo de la reunión ya está resuelto.", en: "The meeting business is sorted now.", when: "anywhere, picking up a shared topic" },
    { es: "En cuanto al presupuesto, tengo algunas dudas.", en: "As for the budget, I have a few doubts.", when: "in a meeting, opening a new point" },
    { es: "Fue la junta directiva la que tomó la decisión.", en: "It was the board that took the decision.", when: "in a formal statement, pointing at who decided" }
  ],
  personal: {
    prompt: "Write three sentences about a mix-up at home or work: put an object first and repeat it, spotlight who did it with *fue... quien*, and pick up a shared topic with *lo de*.",
    constraints: [
      { type: "regex", pattern: "(^|[.!?] )(el|la|los|las) [a-záéíóúñ]+( [a-záéíóúñ]+)? (lo|la|los|las) [a-záéíóúñ]+", label: "an object first, repeated: *el contrato lo firmé yo*" },
      { type: "regex", pattern: "(fue|es|fueron|son) [a-záéíóúñ ]+ (quien|quienes|el que|la que|los que|las que|cuando|donde)", label: "a spotlight: *fue ella quien...*" },
      { type: "containsAny", words: ["lo de ", "lo del ", "eso de "], label: "a shared topic: *lo de* or *eso de*" }
    ],
    model: "Las llaves las dejé en la oficina. Fue mi jefe quien cerró la puerta con todo adentro. Y lo de la alarma mejor no te lo cuento."
  },
  pitfalls: [
    "*El contrato firmé yo* is missing the repeat: *el contrato lo firmé yo*.",
    "Each frame lights up a different piece: *fue ella quien* is who, *fue en marzo cuando* is when.",
    "*Lo de* needs shared ground; if the listener has no idea, tell the story."
  ]
},

"dc-focalizacion-b2": {
  source: "merged",
  hook: {
    line: "Juana announces her wedding in a chat, and Ana can't believe a word of it. Each surprise comes back as an echo, and small words point at exactly what matters.",
    es: "Juana: Me caso en diciembre.\nAna: ¿Te casas cuándo? ¿Y con quién?\nJuana: Con Simón. Y la fiesta es en Leticia, precisamente porque allá nos conocimos.\nAna: ¿La fiesta es dónde? Eso queda lejísimos, incluso para ti.\nJuana: La invitación se la mandé a tu mamá también, sobre todo para que te convenza.\nAna: La idea es algo loca, pero me encanta.",
    en: "Juana: I'm getting married in December.\nAna: You're getting married WHEN? And to who?\nJuana: To Simón. And the party is in Leticia, precisely because that's where we met.\nAna: The party is WHERE? That's miles away, even for you.\nJuana: The invitation, I sent it to your mom too, mainly so she'll talk you into it.\nAna: The idea is a bit crazy, but I love it."
  },
  examples: [
    { es: "Precisamente por eso decidimos esperar un poco más antes de firmar el contrato del local.", en: "That's precisely why we decided to wait a bit longer before signing the lease on the shop." },
    { es: "Es un hotel impresionante; incluso tiene piscina en la terraza y desayuno incluido hasta mediodía.", en: "It's a stunning hotel; it even has a pool on the roof terrace and breakfast included until noon." },
    { es: "La carta se la di a María en persona, para que nadie más la leyera.", en: "The letter, I gave it to María in person, so that nobody else would read it." }
  ],
  rule: "Small words put a spotlight on what comes right after them:\n*incluso*: even, the surprising extreme. *sobre todo*, *especialmente*: above all, without leaving the rest out. *precisamente*, *justamente*: exactly that. *concretamente*: specifically.\n*Algo* before a describing word turns it down to the minimum: *es algo pesado*, a little heavy going.\nPut the thing first and repeat it with the little words before the verb: *La carta se la di a María.*\nSurprised by one piece? Keep the sentence and put the question word where the surprise was, at the end: *¿Te casas cuándo?* *¿La fiesta es dónde?* It's casual and a little dramatic.",
  readAndPick: [
    { q: "What surprises Ana?", es: "¿Te casas cuándo?",
      options: ["Where the wedding is", "When the wedding is", "Who the guests are"], answer: 1,
      why: "The question word sits where the surprise was: the date." },
    { q: "Why Leticia, of all places?", es: "La fiesta es en Leticia, precisamente porque allá nos conocimos.",
      options: ["It's cheap", "Ana's mom lives there now", "That's where they met"], answer: 2,
      why: "*Precisamente porque* points at the exact reason." },
    { q: "What does *incluso* do here?", es: "Eso queda lejísimos, incluso para ti.",
      options: ["Adds a surprising case", "Leaves Juana out of it", "Turns it into a long question"], answer: 0,
      why: "*Incluso* adds the extreme case: far even for someone who loves travelling." },
    { q: "How crazy is the idea?", es: "La idea es algo loca, pero me encanta.",
      options: ["Totally, utterly mad", "A little crazy", "Not crazy"], answer: 1,
      why: "*Algo* before a describing word turns it down: a little crazy." },
    { q: "What did Juana send to Ana's mom?", es: "La invitación se la mandé a tu mamá también.",
      options: ["The invitation", "A cake", "The rings for the wedding"], answer: 0,
      why: "*La invitación* comes first and is repeated by *la* before the verb." },
    { q: "Is the hotel just fine?", es: "Es un hotel impresionante; incluso tiene piscina en la terraza.",
      options: ["Yes, very average", "It has no pool at all, sadly", "Better than expected"], answer: 2,
      why: "*Incluso* adds a surprising extra: it even has a pool on the roof." }
  ],
  yourTurn: [
    { en: "That's precisely why we decided to wait.", es: "Precisamente por eso decidimos esperar.", accept: ["[Precisamente|Justamente] por eso decidimos esperar."] },
    { en: "You're getting married WHEN? (to a friend)", es: "¿Te casas cuándo?", accept: [] },
    { en: "I'm interested in history, especially this century's.", es: "Me interesa la historia, sobre todo la de este siglo.", accept: ["Me interesa la historia, [sobre todo|especialmente] la de este siglo."] },
    { en: "The letter, I gave it to María in person.", es: "La carta se la di a María en persona.", accept: [] },
    { en: "This book is a bit heavy going.", es: "Este libro es algo pesado.", accept: ["Este libro es un poco pesado."] }
  ],
  translate: [
    { en: "It's a stunning hotel; it even has a TV in the bathroom.", es: "Es un hotel impresionante; incluso tiene televisor en el baño.", accept: ["Es un hotel impresionante[;|,|.] incluso tiene [televisor|televisión|tele] en el baño."] },
    { en: "Hernando lives WHERE?", es: "¿Hernando vive dónde?", accept: [] },
    { en: "Specifically, I need the March figures.", es: "Concretamente, necesito las cifras de marzo.", accept: [] },
    { en: "The keys, I left them with the doorman.", es: "Las llaves se las dejé al portero.", accept: ["Las llaves se las dejé [al portero|al celador]."] },
    { en: "I love the city, above all the old town. The food is a bit expensive, but it's worth it. Even the coffee is excellent.", es: "Me encanta la ciudad, sobre todo el centro histórico. La comida es algo cara, pero vale la pena. Incluso el café es excelente.", accept: ["Me encanta la ciudad, [sobre todo|especialmente] el centro histórico. La comida es algo cara, pero vale la pena. Incluso el [café|tinto] es excelente."] },
    { en: "Juana bought HOW many?", es: "¿Juana compró cuántos?", accept: [] }
  ],
  register: [
    { es: "¿Que te casas?", en: "You're getting married?!", when: "with friends, hearing surprising news" },
    { es: "¿Perdón? ¿Cuándo dijiste?", en: "Sorry? When did you say?", when: "politely checking what you didn't catch" },
    { es: "Precisamente por eso lo propongo.", en: "That's exactly why I'm proposing it.", when: "in a meeting, backing your own point" },
    { es: "Cabe destacar, en particular, el aumento de las ventas.", en: "Particularly worth noting is the rise in sales.", when: "in a written report" }
  ],
  personal: {
    prompt: "A friend gives you surprising news. React to two pieces of it with an echo question, and answer with sentences that use *incluso* or *precisamente*.",
    constraints: [
      { type: "regex", pattern: "¿[^?¿]*\\b(cuándo|dónde|quién|quiénes|cuántos|cuántas|cuánto|qué|cómo)\\?", label: "an echo question: *¿te casas cuándo?*" },
      { type: "containsAny", words: ["incluso", "precisamente", "justamente", "sobre todo", "concretamente"], label: "a spotlight word: *incluso* or *precisamente*" },
      { type: "minSentences", n: 3, label: "three sentences or more" }
    ],
    model: "¿Te vas a vivir dónde? ¿Y te vas con quién? Precisamente ayer te dije que no te fueras sin avisarme. Incluso tu mamá lo sabía antes que yo."
  },
  pitfalls: [
    "An echo question isn't a normal question: keep the sentence and swap only the surprising piece.",
    "*Algo pesado* is a little heavy; *muy pesado* is very. Don't mix them up when being polite.",
    "Spain says *¿que has visto a quién?*; in Colombia, *¿viste a quién?*"
  ]
},

"dc-intensificacion-b2": {
  source: "merged",
  hook: {
    line: "Andrés can't stop raving about the café on his corner, and Lina isn't buying it. Between them they turn everything up: a glued-on word, a doubled one, a promise, a scolding.",
    es: "Andrés: El café de la esquina es superbueno. Allá sí sirven café café, no ese tinto aguado de la oficina.\nAndrés: Te juro que el pandebono estaba bueníiisimo.\nLina: Ay, tú siempre exageras.\nAndrés: ¿Exagerar, yo? Te aseguro que es el mejor de Bogotá.\nLina: Bueno, bueno. ¡Y que me devuelvas el paraguas de una vez!",
    en: "Andrés: The café on the corner is super good. There they serve real coffee, not that watery stuff from the office.\nAndrés: I swear the pandebono was amaaazing.\nLina: Oh, you always exaggerate.\nAndrés: ME, exaggerate? I assure you it's the best in Bogotá.\nLina: OK, OK. And give me back my umbrella, I said, once and for all!"
  },
  examples: [
    { es: "Es un muchacho rebueno para las matemáticas; seguro que pasa el examen sin estudiar.", en: "He's a really good kid at maths; he's sure to pass the exam without studying." },
    { es: "Le aseguro que le devolvió hasta el último peso, porque yo misma vi la transferencia.", en: "I assure you he paid her back every last peso, because I saw the transfer myself." },
    { es: "¡Que no lo toques! Te lo dije mil veces, ese cable no se puede tocar.", en: "Don't touch it, I said! I've told you a thousand times, that cable mustn't be touched." }
  ],
  rule: "Past *muy* and *-ísimo*, Spanish turns it up several ways.\nGlue on *super-* (*superbueno*) or, more casual and very Colombian, *re-* (*rebueno*). Also *archi-*, *ultra-*, *extra-*.\nSay the word twice for the real thing: *café café*, proper coffee.\nPut your own word behind it: *te juro que*, *te aseguro que*, *está claro que*.\nRepeat an ignored order with *que* + the subjunctive: *¡Que me devuelvas el paraguas!* It means I said. Add *de una vez* or *ya*. It's sharp: family, not your boss.\nThrow a word back in disbelief: *¿Miedo, yo?*\nStretch the letters in chat: *bueníiisimo*, *pueees*. Speech and chat only.",
  readAndPick: [
    { q: "What does *café café* mean?", es: "Allá sí sirven café café.",
      options: ["Two cups of it, always", "Real, proper coffee", "Coffee"], answer: 1,
      why: "Saying the word twice means the real thing, not the watery kind." },
    { q: "How good was the pandebono?", es: "Te juro que el pandebono estaba bueníiisimo.",
      options: ["Amazing, really", "So-so", "Far too dry to eat"], answer: 0,
      why: "*Te juro* backs it with his word, and the stretched letters turn it up." },
    { q: "What is Andrés doing with *¿Exagerar, yo?*", es: "¿Exagerar, yo? Te aseguro que es el mejor de Bogotá.",
      options: ["Admitting it all", "Asking a genuine question about it", "Rejecting it, outraged"], answer: 2,
      why: "Throwing the word back with *yo* rejects it in disbelief." },
    { q: "What does the *que* in front tell you?", es: "¡Que me devuelvas el paraguas de una vez!",
      options: ["The first time she's asked", "She already asked", "Polite"], answer: 1,
      why: "*Que* + the subjunctive repeats an order that was ignored: I said." },
    { q: "Where does *superbueno* belong?", es: "El café de la esquina es superbueno.",
      options: ["A legal contract", "With friends", "News"], answer: 1,
      why: "*Super-* glued on is warm and casual: with friends, not in a contract." },
    { q: "How sure is the speaker?", es: "Le aseguro que le devolvió hasta el último peso.",
      options: ["Completely sure", "Not very sure", "Only half sure of it"], answer: 0,
      why: "*Le aseguro* puts her own word behind it." }
  ],
  yourTurn: [
    { en: "This place is super good.", es: "Este sitio es superbueno.", accept: ["Este [sitio|lugar] es [superbueno|súper bueno]."] },
    { en: "I swear it's true.", es: "Te juro que es verdad.", accept: ["Te juro que es [verdad|cierto]."] },
    { en: "Be quiet, I said! (to a sibling)", es: "¡Que te calles!", accept: ["¡Que te calles ya!", "¡Que te calles de una vez!"] },
    { en: "Don't touch it, I said!", es: "¡Que no lo toques!", accept: [] },
    { en: "Here they serve real coffee.", es: "Aquí sirven café café.", accept: ["Acá sirven café café."] }
  ],
  translate: [
    { en: "I assure you he paid back every last peso. (formal)", es: "Le aseguro que devolvió hasta el último peso.", accept: ["Le aseguro que le devolvió hasta el último peso."] },
    { en: "It's crystal clear that he isn't interested in the job.", es: "Está clarísimo que no le interesa el trabajo.", accept: [] },
    { en: "Scared, ME?", es: "¿Miedo, yo?", accept: [] },
    { en: "He's a super clever kid; he's sure to pass.", es: "Es un muchacho superinteligente; seguro que pasa.", accept: ["Es un [muchacho|niño] [superinteligente|súper inteligente|muy inteligente][;|,|.] seguro que pasa."] },
    { en: "The food was amazing. I swear it's the best restaurant in the city. And give me back my book, I said!", es: "La comida estaba buenísima. Te juro que es el mejor restaurante de la ciudad. ¡Y que me devuelvas el libro!", accept: ["La comida estaba [buenísima|superbuena|deliciosa]. Te juro que es el mejor restaurante de la ciudad. ¡Y que me devuelvas el libro!"] },
    { en: "It wasn't just good; it was amazing.", es: "No estaba bueno; estaba buenísimo.", accept: ["No estaba bueno[;|,|.] estaba buenísimo."] }
  ],
  register: [
    { es: "¡Está rebueno!", en: "It's really good!", when: "in Colombia, with friends, about food or a plan" },
    { es: "Está buenísimo.", en: "It's really good.", when: "anywhere, warm praise" },
    { es: "Le aseguro que no volverá a ocurrir.", en: "I assure you it won't happen again.", when: "to a client or a boss, as usted" },
    { es: "Resulta evidente que el proyecto no es viable.", en: "It is evident that the project is not viable.", when: "in a report, strong but formal" }
  ],
  personal: {
    prompt: "Write a short rave to a friend about a place you love, then tell someone off for ignoring a request.",
    constraints: [
      { type: "containsAny", words: ["super", "súper", "rebueno", "rebuena", "archi", "ultra", "ísimo", "ísima"], label: "turned up: *superbueno*, *rebueno* or *-ísimo*" },
      { type: "containsAny", words: ["te juro", "te aseguro", "le aseguro", "está claro que", "de verdad"], label: "your word behind it: *te juro que*" },
      { type: "regex", pattern: "¡que [a-záéíóúñ ]+!", label: "an ignored order: *¡que me devuelvas...!*" }
    ],
    model: "Ayer fui a una panadería en Usaquén. ¡Te juro que el pan estaba buenísimo! Sirven café café, y la dueña es superamable. Ah, y Carlos: ¡que me devuelvas el cargador de una vez!"
  },
  pitfalls: [
    "*¡Que te calles!* assumes you already asked once; as a first request it sounds rude.",
    "Stretched letters like *bueníiisimo* are for speech and chat, never a formal email.",
    "*Te juro* on every line wears out: save it for what you really need believed."
  ]
},

"gr-orden-interrogativos-b2": {
  source: "merged",
  hook: {
    line: "A radio presenter interviews the couple who opened a restaurant in Leticia. Her questions show where the question word goes, what follows it, and what happens when an answer surprises her.",
    es: "Locutora: ¿Dónde y cuándo se conocieron ustedes dos?\nSimón: En Leticia, hace tres años.\nLocutora: ¿Y quién propuso abrir el restaurante?\nJuana: Lo propuso Simón.\nLocutora: ¿Por qué Simón no quería cocinar al principio?\nJuana: Porque no sabía. Ahora cocina mejor que yo.\nLocutora: ¿Cocina mejor que quién?",
    en: "Presenter: Where and when did you two meet?\nSimón: In Leticia, three years ago.\nPresenter: And who suggested opening the restaurant?\nJuana: Simón did.\nPresenter: Why didn't Simón want to cook at first?\nJuana: Because he didn't know how. Now he cooks better than me.\nPresenter: He cooks better than WHO?"
  },
  examples: [
    { es: "¿Cuándo llegan los clientes de Japón, y quién los va a recoger en el aeropuerto?", en: "When do the customers from Japan arrive, and who's going to pick them up at the airport?" },
    { es: "¿Cómo y por qué cambió de opinión el alcalde, si la semana pasada decía lo contrario?", en: "How and why did the mayor change his mind, if last week he was saying the opposite?" },
    { es: "¿Quién llega primero a la oficina? Normalmente llega don Hernando, a las seis y media.", en: "Who gets to the office first? Usually Don Hernando does, at half past six." }
  ],
  rule: "A question with a question word puts it first, then the verb, then the person: *¿Dónde vive Juana?* *¿Cuándo llegan los clientes?* *¿Dónde Juana vive?* sounds foreign. After *por qué*, the person may come first: *¿Por qué Simón no quería?*\nAfter the verb, the rest is loose: put last what reads best.\nTwo question words go up front together: *¿Dónde y cuándo se conocieron?* *¿Cómo y por qué cambió?*\nYes or no questions keep the plain order; the marks and your voice do the work: *¿Juana vive aquí?*\nIn answers, the new piece goes last: *¿Quién llega? Llega don Hernando.*\nSurprised? Put the question word at the end, where the surprise was: *¿Cocina mejor que quién?*",
  readAndPick: [
    { q: "What does the presenter want to know?", es: "¿Dónde y cuándo se conocieron ustedes dos?",
      options: ["Only the place it was", "Where and when", "Why they met"], answer: 1,
      why: "Two question words up front together ask for both pieces at once." },
    { q: "What comes right after *dónde*?", es: "¿Dónde vive Juana?",
      options: ["The verb", "The person", "Nothing"], answer: 0,
      why: "Question word, then verb, then the person: *¿dónde vive Juana?*" },
    { q: "What is the presenter doing at the end?", es: "¿Cocina mejor que quién?",
      options: ["Asking a normal question", "Change", "Showing surprise"], answer: 2,
      why: "The question word moves to the end, where the surprise was: an echo." },
    { q: "Where does the new information sit?", es: "¿Quién propuso abrir el restaurante? Lo propuso Simón.",
      options: ["Right at the very start", "At the end: Simón", "Nowhere"], answer: 1,
      why: "In an answer, the new piece goes last: *lo propuso Simón*." },
    { q: "Is this order possible?", es: "¿Por qué Simón no quería cocinar?",
      options: ["Yes, after *por qué*", "No, never", "Only in old poems and songs"], answer: 0,
      why: "After *por qué*, the person can come before the verb, and often does." }
  ],
  yourTurn: [
    { en: "Where does Juana live?", es: "¿Dónde vive Juana?", accept: [] },
    { en: "When do the customers arrive?", es: "¿Cuándo llegan los clientes?", accept: [] },
    { en: "Where and when did you two meet?", es: "¿Dónde y cuándo se conocieron ustedes dos?", accept: ["¿Dónde y cuándo se conocieron?"] },
    { en: "Who usually arrives first?", es: "¿Quién llega primero normalmente?", accept: ["¿Quién llega normalmente primero?", "¿Quién suele llegar primero?", "¿Normalmente quién llega primero?"] },
    { en: "You're going WHERE? (to a friend)", es: "¿Vas adónde?", accept: ["¿Vas para dónde?", "¿Te vas para dónde?", "¿Vas a dónde?"] }
  ],
  translate: [
    { en: "Who often does exercise?", es: "¿Quién hace ejercicio a menudo?", accept: ["¿Quién hace ejercicio [con frecuencia|seguido]?"] },
    { en: "How and why did he change his mind?", es: "¿Cómo y por qué cambió de opinión?", accept: [] },
    { en: "Why didn't Luis say anything?", es: "¿Por qué Luis no dijo nada?", accept: ["¿Por qué no dijo nada Luis?"] },
    { en: "Does Juana live here?", es: "¿Juana vive aquí?", accept: ["¿Vive Juana aquí?", "¿Juana vive acá?"] },
    { en: "Who opened the café? Rosa opened it. And when did she open it? She opened it in 2010.", es: "¿Quién abrió el café? Lo abrió Rosa. ¿Y cuándo lo abrió? Lo abrió en 2010.", accept: ["¿Quién abrió el café? Lo abrió Rosa. ¿Y cuándo lo abrió? Lo abrió en el 2010."] },
    { en: "She bought HOW many?", es: "¿Compró cuántos?", accept: ["¿Compró cuántas?"] }
  ],
  register: [
    { es: "¿Pa' dónde vas?", en: "Where are you off to?", when: "in Colombia, very casual, to a friend" },
    { es: "¿Dónde vive tu hermana?", en: "Where does your sister live?", when: "anywhere, a plain question" },
    { es: "¿Podría indicarme dónde queda la oficina?", en: "Could you tell me where the office is?", when: "asking a stranger or at a reception desk" },
    { es: "¿Cuándo y dónde se firmará el acuerdo?", en: "When and where will the agreement be signed?", when: "at a press conference or in an interview" }
  ],
  personal: {
    prompt: "You're interviewing someone about their business for a local paper. Write four questions or more: one with two question words, one with *por qué*, and one echo question when an answer surprises you.",
    constraints: [
      { type: "regex", pattern: "¿(dónde|cuándo|cómo|por qué|quién|qué) y (dónde|cuándo|cómo|por qué|quién|qué)", label: "two question words together: *¿dónde y cuándo...?*" },
      { type: "containsAny", words: ["¿por qué"], label: "a question with *por qué*" },
      { type: "regex", pattern: "¿[^?¿]*\\b(cuándo|dónde|quién|quiénes|cuántos|cuántas|cuánto|qué|cómo)\\?", label: "an echo question: *¿cocina mejor que quién?*" },
      { type: "minSentences", n: 4, label: "four questions or more" }
    ],
    model: "¿Dónde y cuándo abrió su primera panadería? ¿Por qué decidió vender solo pan de maíz? ¿Cuántos clientes tiene al día? ¿Vende quinientas arepas? ¿Y las hace quién?"
  },
  pitfalls: [
    "*¿Dónde Juana vive?* sounds foreign: question word, verb, then the person.",
    "With two question words, both go up front: *¿dónde y cuándo...?*",
    "An echo question puts the question word last; it repeats, it doesn't ask fresh."
  ]
},

"dc-negacion-b2": {
  source: "merged",
  hook: {
    line: "Tomás's mother wants to know if he's going to a party on Saturday. He says no every way Spanish allows: flatly, firmly, with a protest, with a hedge, and over and over.",
    es: "Mamá: ¿Vas a ir a la fiesta de Andrés el sábado?\nTomás: ¡Ni hablar! De ningún modo pienso ir.\nMamá: ¿No te pones bravo si no te invita la próxima vez?\nTomás: No, de ninguna manera. ¡Si ni siquiera me cae bien!\nMamá: ¿Y llegó alguna invitación para tu hermana?\nTomás: No, que yo sepa. ¡Que no, mamá, que no voy!",
    en: "Mom: Are you going to Andrés's party on Saturday?\nTomás: No way! There's no way I'm going.\nMom: Won't you be upset if he doesn't invite you next time?\nTomás: No, not at all. I don't even like him!\nMom: And did an invitation come for your sister?\nTomás: Not as far as I know. No, Mom, I'm telling you, I'm not going!"
  },
  examples: [
    { es: "No, que yo sepa no hay ningún motivo para cambiar de opinión a estas alturas del proyecto.", en: "No, as far as I know there's no reason to change our minds at this stage of the project." },
    { es: "No vino turista alguno en todo el fin de semana, a pesar de la publicidad en redes.", en: "Not a single tourist came all weekend, despite the advertising on social media." },
    { es: "¡Pues claro que no pienso aceptar esas condiciones! Me pagan menos y trabajo más horas.", en: "Of course I'm not going to accept those conditions! They pay me less and I work longer hours." }
  ],
  rule: "A plain *no* is one rung. There are more.\nConfirming a negative question: *¿No te pones bravo? No, de ninguna manera.*\nRepeating for someone who won't listen: *¡Que no, que no voy!*\nTurning it up: *¡Ni hablar!*, *de ningún modo*, *¡Claro que no!*, *¡Pues claro que no!*, and the rude-ish *no me da la gana*.\nProtesting with *si* at the start, which isn't if here: *¡Si ni siquiera me cae bien!*\nSoftening, by limiting it to what you know: *No, que yo sepa.* You might be wrong.\nFor the strongest written no, put *alguno* after the thing, with *no* before the verb: *No hay motivo alguno.*",
  readAndPick: [
    { q: "How firmly does Tomás refuse?", es: "¡Ni hablar! De ningún modo pienso ir.",
      options: ["He might still go after all", "As firmly as he can", "Politely"], answer: 1,
      why: "*¡Ni hablar!* and *de ningún modo* are near the top of the ladder." },
    { q: "What does *no, de ninguna manera* do here?", es: "¿No te pones bravo? No, de ninguna manera.",
      options: ["Confirms he won't be", "Says he will be upset", "Changes the subject"], answer: 0,
      why: "It confirms the negative question: no, he won't be upset at all." },
    { q: "What is the *si* doing?", es: "¡Si ni siquiera me cae bien!",
      options: ["Meaning if, as it usually does", "Yes", "Protesting with a reason"], answer: 2,
      why: "*Si* at the start of an exclamation protests: but I don't even like him!" },
    { q: "How sure is Tomás about the invitation?", es: "No, que yo sepa.",
      options: ["Completely, totally sure", "As far as he knows", "He has no idea"], answer: 1,
      why: "*Que yo sepa* limits the no to what he knows; he might be wrong." },
    { q: "How many tourists came?", es: "No vino turista alguno en todo el fin de semana.",
      options: ["Not a single one", "A handful", "Some of them, on Sunday only"], answer: 0,
      why: "*Alguno* after the thing, with *no* before the verb, is the strongest no." },
    { q: "Why does Tomás repeat *que no*?", es: "¡Que no, mamá, que no voy!",
      options: ["He's unsure", "He's making a joke out of it", "She won't take no"], answer: 2,
      why: "Repeating *que no* insists, for a listener who isn't convinced." }
  ],
  yourTurn: [
    { en: "No way! (to a friend)", es: "¡Ni hablar!", accept: ["¡Ni loco!", "¡Ni loca!"] },
    { en: "Not as far as I know.", es: "No, que yo sepa.", accept: ["Que yo sepa, no."] },
    { en: "Of course I'm not going to accept!", es: "¡Claro que no voy a aceptar!", accept: ["¡[Claro que|Pues claro que|Por supuesto que] no voy a aceptar!"] },
    { en: "I just don't feel like it. (blunt)", es: "No me da la gana.", accept: [] },
    { en: "There's no reason at all to change.", es: "No hay motivo alguno para cambiar.", accept: ["No hay [motivo alguno|ningún motivo|razón alguna|ninguna razón] para cambiar."] }
  ],
  translate: [
    { en: "Did any letter come for me?", es: "¿Llegó alguna carta para mí?", accept: [] },
    { en: "No, not at all, it doesn't bother me.", es: "No, de ninguna manera, no me molesta.", accept: ["No, [de ninguna manera|para nada|en absoluto], no me molesta."] },
    { en: "There's no way I'm apologising.", es: "De ningún modo pienso disculparme.", accept: ["De [ningún modo|ninguna manera] pienso [disculparme|pedir perdón]."] },
    { en: "But I already told you!", es: "¡Si ya te lo dije!", accept: [] },
    { en: "Are you going to the party? No way. I don't even like Andrés. And as far as I know, my sister isn't going either.", es: "¿Vas a ir a la fiesta? Ni hablar. Ni siquiera me cae bien Andrés. Y que yo sepa, mi hermana tampoco va.", accept: ["¿Vas a ir a la fiesta? [Ni hablar|Ni loco|Ni loca]. Ni siquiera me cae bien Andrés. Y que yo sepa, mi hermana tampoco va."] },
    { en: "Not a single tourist came, despite the advertising.", es: "No vino turista alguno, a pesar de la publicidad.", accept: ["No vino [turista alguno|ningún turista|ni un turista], a pesar de la publicidad."] }
  ],
  register: [
    { es: "¡Ni de vainas!", en: "No chance!", when: "in Colombia, among close friends, very casual" },
    { es: "No, gracias, de verdad.", en: "No, thanks, really.", when: "anywhere, a firm but kind no" },
    { es: "Lamentablemente, no nos es posible aceptar.", en: "Unfortunately, we are not able to accept.", when: "declining in a formal letter or email" },
    { es: "No existe prueba alguna de esa afirmación.", en: "There is no evidence whatsoever for that claim.", when: "in a report or a legal reply" }
  ],
  personal: {
    prompt: "Someone keeps pushing you to do something you won't do. Write the exchange: refuse three different ways, from soft to blunt, and soften one answer with *que yo sepa*.",
    constraints: [
      { type: "containsAny", words: ["ni hablar", "de ningún modo", "de ninguna manera", "no me da la gana", "claro que no", "ni loco", "ni loca", "ni de vainas"], label: "a strong no: *ni hablar* or *de ningún modo*" },
      { type: "containsAny", words: ["que yo sepa"], label: "a softened no: *que yo sepa*" },
      { type: "regex", pattern: "¡que no|que no,|no, no", label: "a repeated no: *¡que no, que no voy!*" }
    ],
    model: "¿Vas a prestarle el carro a tu primo? Ni hablar. ¿Y si te lo pide tu tía? No, de ninguna manera. ¿Él ya tiene licencia? No, que yo sepa. ¡Que no, mamá, que no se lo presto!"
  },
  pitfalls: [
    "*No, que yo sepa* is not a flat no: it admits you might be wrong.",
    "*Hay libro alguno* needs its *no*: *no hay libro alguno*.",
    "*¿No te enfadas?* is Spain; in Colombia, *¿no te pones bravo?* or *¿no te enojas?*"
  ]
},

"gr-exclamativos-b2": {
  source: "merged",
  hook: {
    line: "A grandmother greets her granddaughter at a surprise party. Every line is a reaction: to a fact, to a crowd, to an action, to a year of change, and one wish of her own.",
    es: "¡Qué bien que hayas venido, mija!\n¡Qué sorpresa tan bonita! ¡Y cuánta gente!\n¡Cómo has crecido! ¡Cuánto sabes ya de música!\n¡Quién lo hubiera dicho! Hace un año no sabías ni tocar una nota.\n¡Ay, quién tuviera tu edad otra vez!",
    en: "How lovely that you came, sweetheart!\nWhat a lovely surprise! And so many people!\nHow you've grown! You know so much about music already!\nWho would have thought it! A year ago you couldn't even play a note.\nOh, if only I were your age again!"
  },
  examples: [
    { es: "¡Qué bien canta tu hermana! No sabía que había estudiado música en el conservatorio de Tunja.", en: "How well your sister sings! I didn't know she'd studied music at the conservatory in Tunja." },
    { es: "¡Cuántas cosas trajiste! Con todo eso podemos hacer almuerzo para veinte personas.", en: "So many things you brought! With all that we can make lunch for twenty people." },
    { es: "¡Si lo hubiera sabido! Habría comprado los tiquetes para el domingo, no para el sábado.", en: "If only I'd known! I would have bought the tickets for Sunday, not for Saturday." }
  ],
  rule: "The accent turns a question word into a reaction.\n*¡Qué* + a quality: *¡Qué bonito!* + a thing: *¡Qué sorpresa!* Both: *¡Qué sorpresa tan bonita!* No word for English what a.\nReact to a whole fact with *que* and the subjunctive: *¡Qué bien que hayas venido!*\n*¡Cómo* + a verb is how it's done: *¡Cómo canta!* *¡Qué bien canta!* works too.\n*¡Cuánto* + a verb never changes: *¡Cuánto sabes!* Before a thing it agrees: *¡Cuánta gente!*, *¡Cuántas cosas!*\nNothing goes between the word and the verb: *¡Cómo canta esa mujer!*\nWishes: *¡Quién tuviera tu edad!* *¡Si lo hubiera sabido!* *¡Quién lo hubiera dicho!* is surprise, not regret.",
  readAndPick: [
    { q: "What is the grandmother reacting to?", es: "¡Qué bien que hayas venido, mija!",
      options: ["The good weather outside", "The visit itself", "A gift"], answer: 1,
      why: "*¡Qué bien que...!* reacts to a whole fact: that she came." },
    { q: "What amazes her about the music?", es: "¡Cuánto sabes ya de música!",
      options: ["How much she knows", "How loudly she plays it", "Little"], answer: 0,
      why: "*¡Cuánto* before a verb is how much, and it never changes." },
    { q: "What does *¡quién lo hubiera dicho!* express?", es: "¡Quién lo hubiera dicho! Hace un año no sabías ni tocar una nota.",
      options: ["Bitter regret", "A real question", "Happy surprise"], answer: 2,
      why: "It's a fixed way to say who'd have thought it: surprise, not regret." },
    { q: "What does she wish?", es: "¡Ay, quién tuviera tu edad otra vez!",
      options: ["To be young again", "To know who is that age", "To have a party"], answer: 0,
      why: "*¡Quién tuviera...!* means I wish I had; *quién* here is the speaker." },
    { q: "Why *cuánta* and not *cuánto*?", es: "¡Y cuánta gente!",
      options: ["It sits before a verb", "It matches *gente*", "It's a question"], answer: 1,
      why: "Before a thing, *cuánto* agrees with it: *gente* takes *cuánta*." },
    { q: "What does *¡Si lo hubiera sabido!* say?", es: "¡Si lo hubiera sabido! Habría comprado los tiquetes para el domingo.",
      options: ["She knew all along", "She didn't know, sadly", "She'll find out next week, she says"], answer: 1,
      why: "*¡Si* + *hubiera sabido* wishes about a past that can't change now." }
  ],
  yourTurn: [
    { en: "What a lovely surprise!", es: "¡Qué sorpresa tan bonita!", accept: ["¡Qué bonita sorpresa!", "¡Qué sorpresa tan linda!", "¡Qué linda sorpresa!"] },
    { en: "How well your sister sings! (to a friend)", es: "¡Qué bien canta tu hermana!", accept: ["¡Cómo canta tu hermana!"] },
    { en: "So many people!", es: "¡Cuánta gente!", accept: [] },
    { en: "How lovely that you're here! (to a friend)", es: "¡Qué bien que estés aquí!", accept: ["¡Qué bien que estés acá!", "¡Qué bueno que estés [aquí|acá]!"] },
    { en: "If only I had your energy!", es: "¡Quién tuviera tu energía!", accept: [] }
  ],
  translate: [
    { en: "How much he knows about history!", es: "¡Cuánto sabe de historia!", accept: [] },
    { en: "It's really pouring today!", es: "¡Cómo llueve hoy!", accept: ["¡Cómo está lloviendo hoy!"] },
    { en: "How wonderful that you've come!", es: "¡Qué maravilla que hayas venido!", accept: ["¡Qué maravilla que vinieras!"] },
    { en: "Who would have thought it!", es: "¡Quién lo hubiera dicho!", accept: ["¡Quién lo iba a decir!", "¡Quién lo hubiera pensado!"] },
    { en: "What a long day! So many meetings and so little coffee! If only I had known, I would have stayed at home.", es: "¡Qué día tan largo! ¡Cuántas reuniones y qué poco café! Si lo hubiera sabido, me habría quedado en la casa.", accept: ["¡Qué día tan largo! ¡Cuántas reuniones y qué poco café! Si lo hubiera sabido, me [habría|hubiera] quedado en [la casa|casa]."] },
    { en: "How you've grown! (to a child)", es: "¡Cómo has crecido!", accept: ["¡Cómo creciste!", "¡Qué grande estás!"] }
  ],
  register: [
    { es: "¡Tan lindo!", en: "How sweet!", when: "in Colombia, about a baby, a gift or a kind gesture" },
    { es: "¡Qué bonito!", en: "How lovely!", when: "anywhere, warm and simple" },
    { es: "¡Qué gusto verla, doña Inés!", en: "How nice to see you, Doña Inés!", when: "greeting an older person, as usted" },
    { es: "¡Cuán equivocados estábamos!", en: "How wrong we were!", when: "in writing or a speech, old-fashioned and literary" }
  ],
  personal: {
    prompt: "Write what you'd exclaim at a family reunion: at a person, at the food, at how much has changed, and one wish.",
    constraints: [
      { type: "regex", pattern: "¡qu[ée] [a-záéíóúñ]+", label: "a reaction with *¡qué...!*" },
      { type: "regex", pattern: "¡(cómo|cuánto|cuánta|cuántos|cuántas) ", label: "a reaction with *¡cómo...!* or *¡cuánto...!*" },
      { type: "regex", pattern: "¡(ay, )?(quién|si|ojalá) [a-záéíóúñ ]*(tuviera|pudiera|fuera|estuviera|supiera|hubiera)", label: "a wish: *¡quién tuviera...!* or *¡si lo hubiera sabido!*" }
    ],
    model: "¡Qué bien que vinieron todos! ¡Cómo han crecido los sobrinos! ¡Y cuánta comida trajo mi tía! ¡Quién tuviera la energía de mi abuela!"
  },
  pitfalls: [
    "*¡Qué maravilla que estás aquí!* isn't standard: after *qué... que*, *estés*.",
    "*¡Cuántos sabe!* agrees with nothing: before a verb it stays *¡cuánto sabe!*",
    "*¡Qué una sorpresa!* adds an English a: *¡qué sorpresa!*"
  ]
},

"dc-entonacion-b2": {
  source: "merged",
  hook: {
    line: "Two colleagues chat about a presentation and a file. Half of what they mean is in the tone, and in a chat the tone is written down: a stretched letter, a tag at the end, capitals.",
    es: "Laura: ¿Qué te pareció la presentación de Ana?\nCarlos: Pueees, bien... aunque a veces se perdía.\nLaura: Vienes a la reunión, ¿verdad?\nCarlos: Sí, sí. Y porfaaa, mándame el archivo antes.\nLaura: Ya te lo mandé. Y te dije que NO-LO-TO-QUES sin avisarme.\nCarlos: Bueeeno, está bien.",
    en: "Laura: What did you think of Ana's presentation?\nCarlos: Weeell, fine... though she lost her way at times.\nLaura: You're coming to the meeting, right?\nCarlos: Yes, yes. And pleeease, send me the file beforehand.\nLaura: I already sent it. And I told you: DON'T. TOUCH. IT. without telling me.\nCarlos: Ooookay, fine."
  },
  examples: [
    { es: "Y caminábamos y caminábamos, y no encontrábamos la salida, y ya era de noche, y entonces...", en: "And we walked and walked, and we couldn't find the way out, and it was already dark, and then..." },
    { es: "Vienes con nosotros el sábado, ¿verdad? Ya le dije a mi mamá que eras parte del plan.", en: "You're coming with us on Saturday, right? I already told my mom you were part of the plan." },
    { es: "No se lo preeestes, que después no te lo devuelve y te toca comprar otro.", en: "Don't you dare lend it to him, he never gives it back and you end up buying another." }
  ],
  rule: "Tone does work words don't, and chat writes it down.\nA yes or no question can ask for news or for a yes. *¿Vienes a la reunión?*, voice rising, really asks. *Vienes, ¿verdad?* or *¿no?*, voice falling, expects a yes.\nA string of *y... y... y...*, the voice held up, keeps a story moving and builds worry.\nStretched letters change meaning with context: *pueees, bien* is a polite doubt; *bueeeno* is reluctant; *porfaaa* pleads; *no se lo preeestes* scolds.\nCapitals and beats, *NO-LO-TO-QUES*, repeat an order already ignored. So does *¡Que no lo toques!*\nAll of it is for speech and chat, never a formal email.",
  readAndPick: [
    { q: "What does Carlos really think of the talk?", es: "Pueees, bien... aunque a veces se perdía.",
      options: ["It was simply brilliant", "Not so good, politely", "He missed it"], answer: 1,
      why: "A stretched *pueees* before *bien* signals a polite doubt." },
    { q: "What does Laura expect?", es: "Vienes a la reunión, ¿verdad?",
      options: ["A yes", "A no", "Any answer at all"], answer: 0,
      why: "A statement with *¿verdad?* at the end expects agreement." },
    { q: "What does *porfaaa* do?", es: "Y porfaaa, mándame el archivo antes.",
      options: ["Gives a sharp order", "Thanks", "Pleads, softly"], answer: 2,
      why: "Stretching *porfa* softens the request into a plea." },
    { q: "Why the capitals and beats?", es: "Te dije que NO-LO-TO-QUES sin avisarme.",
      options: ["It's the first request", "She already said it", "She's joking"], answer: 1,
      why: "Beat by beat repeats an order that was already given and ignored." },
    { q: "How does Carlos agree?", es: "Bueeeno, está bien.",
      options: ["Reluctantly", "Happily, at once", "He doesn't"], answer: 0,
      why: "A stretched *bueeeno* agrees without any enthusiasm." },
    { q: "What does the string of *y* do?", es: "Y caminábamos y caminábamos, y no encontrábamos la salida.",
      options: ["Ends it", "Builds the tension", "Lists every shop they passed"], answer: 1,
      why: "*Y... y... y...* with the voice held up keeps the story moving and the worry growing." }
  ],
  yourTurn: [
    { en: "You're coming with us, right? (to a friend)", es: "Vienes con nosotros, ¿verdad?", accept: ["Vienes con nosotros, ¿[verdad|no|cierto]?"] },
    { en: "Don't lend it to him; he never gives it back.", es: "No se lo prestes; nunca lo devuelve.", accept: ["No se lo prestes[;|,|.] nunca lo devuelve.", "No se lo prestes, que nunca te lo devuelve."] },
    { en: "Well, fine, though she lost her way at times.", es: "Pues, bien, aunque a veces se perdía.", accept: ["Pues, bien, aunque a veces se enredaba."] },
    { en: "Please help me with this. (pleading, to a friend)", es: "Por favor, ayúdame con esto.", accept: ["Porfa, ayúdame con esto.", "Ayúdame con esto, por favor."] }
  ],
  translate: [
    { en: "Do you want me to come with you?", es: "¿Quieres que te acompañe?", accept: [] },
    { en: "Will you come to the wedding? (to a friend)", es: "¿Vienes al matrimonio?", accept: ["¿Vas a venir al matrimonio?", "¿Vienes a la boda?", "¿Vendrás al matrimonio?"] },
    { en: "And we kept walking and walking without seeing the end.", es: "Y seguíamos caminando y caminando sin ver el final.", accept: [] },
    { en: "I told you not to touch it.", es: "Te dije que no lo tocaras.", accept: [] },
    { en: "What did you think of the teacher? Well, fine, although sometimes she gets distracted. But she's very kind.", es: "¿Qué te pareció la profesora? Pues, bien, aunque a veces se distrae. Pero es muy amable.", accept: ["¿Qué te pareció la profesora? Pues, bien, aunque a veces se [distrae|despista]. Pero es muy [amable|querida|buena gente]."] },
    { en: "She's coming tomorrow, isn't she?", es: "Viene mañana, ¿no?", accept: ["Viene mañana, ¿[no|verdad|cierto]?"] }
  ],
  register: [
    { es: "Bueeeno, listo.", en: "Ooookay, fine.", when: "in a chat, agreeing without enthusiasm" },
    { es: "Porfa, ¿me ayudas?", en: "Please, will you help me?", when: "asking a friend a favour, warmly" },
    { es: "¿Vienes, cierto?", en: "You're coming, right?", when: "in Colombia, checking a plan you expect" },
    { es: "Le agradecería que me enviara el archivo.", en: "I would be grateful if you sent me the file.", when: "in a formal email, where the words carry the tone" }
  ],
  personal: {
    prompt: "Write a short chat with a friend where the tone does the work: a question that expects a yes, a stretched word that shows doubt or pleading, and an order repeated because it was ignored.",
    constraints: [
      { type: "regex", pattern: ", ¿(verdad|no|cierto)\\?", label: "a question that expects a yes: *..., ¿verdad?*" },
      { type: "regex", pattern: "([aeiou])\\1\\1", label: "a stretched word: *pueees* or *porfaaa*" },
      { type: "regex", pattern: "¡que (no )?[a-záéíóúñ]+|[a-záéíóúñ]{2,}-[a-záéíóúñ]{2,}-[a-záéíóúñ]{2,}", label: "an ignored order: *¡que no lo toques!*" }
    ],
    model: "Vienes el sábado, ¿verdad? Porfaaa, no me dejes sola con mis primos. Y ¡que me devuelvas la chaqueta de una vez!"
  },
  pitfalls: [
    "Stretched letters and capitals belong in chat; in a formal email the words must carry the tone.",
    "*Vienes, ¿verdad?* expects a yes; for a real question, just *¿vienes?*",
    "In Spain *no se lo dejes* means don't lend it; in Colombia, *no se lo prestes*."
  ]
},

"nt-presencia-ausencia-b2": {
  source: "merged",
  hook: {
    line: "The minutes of a school parents' meeting in Bogotá record who was there, who was missing, who joined from far away, and what was left where everyone could see it.",
    es: "A la reunión de padres asistieron cuarenta y dos personas.\nFaltaron los representantes de tres cursos, sin avisar.\nLa señora Díaz participó a distancia, desde Medellín.\nEl rector habló de los estudiantes que faltan a clase más de tres veces al mes.\nLos documentos se firmaron en presencia de la tesorera y quedaron a la vista de todos en la cartelera.",
    en: "Forty-two people attended the parents' meeting.\nThe representatives of three classes were missing, without notice.\nMrs Díaz took part remotely, from Medellín.\nThe head teacher spoke about the students who miss class more than three times a month.\nThe documents were signed in the presence of the treasurer and left in plain view of everyone on the noticeboard."
  },
  examples: [
    { es: "Faltó a clase tres veces esta semana, y el profesor ya llamó a sus papás para preguntar.", en: "He missed class three times this week, and the teacher has already called his parents to ask." },
    { es: "Hizo un curso a distancia mientras trabajaba en Leticia, y lo terminó en solo cuatro meses.", en: "She did a distance course while working in Leticia, and finished it in just four months." },
    { es: "Tu celular está a la vista, encima de la mesa del comedor, al lado de las llaves.", en: "Your phone is in plain sight, on the dining table, next to the keys." }
  ],
  rule: "*Asistir a* is to attend, never to assist; for helping, *ayudar*. *Asistí a la boda.* The people there are *los asistentes*. *Participar en* is taking an active part.\n*Faltar a* is missing something you were expected at: *faltó a la reunión*, *faltó tres veces a clase*. Both keep *a*.\nIn the news, *asistieron* + a number gives the crowd: *Asistieron dos mil personas.*\nWays of being there with no verb: *a distancia* (remotely), *a la vista* (in plain sight), *en presencia de* (formal: *en presencia de un notario*), *en ausencia de*.",
  readAndPick: [
    { q: "How many people were at the meeting?", es: "A la reunión de padres asistieron cuarenta y dos personas.",
      options: ["Forty-two helped", "Forty-two of them came", "Forty-two missed it, sadly"], answer: 1,
      why: "*Asistir a* is to attend: forty-two were there." },
    { q: "What did three classes' representatives do?", es: "Faltaron los representantes de tres cursos, sin avisar.",
      options: ["They came late", "They sent a long note", "They didn't come"], answer: 2,
      why: "*Faltar* is to be missing from something you were expected at." },
    { q: "Where was Mrs Díaz?", es: "La señora Díaz participó a distancia, desde Medellín.",
      options: ["In the room", "In Medellín, online", "Nowhere, she missed it"], answer: 1,
      why: "*A distancia* is remotely: she took part from Medellín." },
    { q: "What does *a la vista de todos* mean?", es: "Los documentos quedaron a la vista de todos en la cartelera.",
      options: ["Where anyone can see", "Hidden in a drawer", "Sent by email to all the parents"], answer: 0,
      why: "*A la vista* is in plain sight, where anyone can see it." },
    { q: "What does *asistí* mean here?", es: "Asistí a la boda de mi prima en Cali.",
      options: ["I helped", "I was a guest", "I organised all of it"], answer: 1,
      why: "*Asistir a* is to attend, not to assist; helping is *ayudar*." }
  ],
  yourTurn: [
    { en: "He missed class three times this week.", es: "Faltó a clase tres veces esta semana.", accept: ["Faltó tres veces a clase esta semana."] },
    { en: "I attended the conference in Medellín.", es: "Asistí a la conferencia en Medellín.", accept: ["Asistí al congreso en Medellín."] },
    { en: "She did a distance course.", es: "Hizo un curso a distancia.", accept: ["Hizo un curso virtual."] },
    { en: "Your phone is in plain sight, on the table. (to a friend)", es: "Tu celular está a la vista, encima de la mesa.", accept: ["Tu celular está a la vista, [encima de|sobre] la mesa."] }
  ],
  translate: [
    { en: "Attendees at the conference exceeded a thousand.", es: "Los asistentes al congreso superaron las mil personas.", accept: ["Los asistentes al [congreso|evento] [superaron|pasaron] las mil personas."] },
    { en: "She participated actively in the debate.", es: "Participó activamente en el debate.", accept: [] },
    { en: "He missed the meeting without notice.", es: "Faltó a la reunión sin avisar.", accept: [] },
    { en: "The signing took place in the presence of a notary.", es: "La firma se realizó en presencia de un notario.", accept: ["La firma se [realizó|hizo] en presencia de un notario."] },
    { en: "About two thousand people attended the concert. Some came from other cities. Only the singer was missing: she was ill.", es: "Al concierto asistieron unas dos mil personas. Algunas vinieron de otras ciudades. Solo faltó la cantante: estaba enferma.", accept: ["[Al concierto asistieron unas dos mil personas|Unas dos mil personas asistieron al concierto]. Algunas vinieron de otras ciudades. Solo faltó la cantante[:|;|,|.] estaba enferma."] },
    { en: "Two students were absent from the exam.", es: "Faltaron dos estudiantes al examen.", accept: ["Dos estudiantes faltaron al examen.", "Faltaron dos alumnos al examen."] }
  ],
  register: [
    { es: "No pude ir, me tocó trabajar.", en: "I couldn't go, I had to work.", when: "in Colombia, telling a friend why you missed it" },
    { es: "No pude asistir a la reunión.", en: "I couldn't attend the meeting.", when: "anywhere, a polite apology" },
    { es: "Lamento no haber podido asistir.", en: "I regret not having been able to attend.", when: "in a formal email after you missed something" },
    { es: "La audiencia se celebró en ausencia del acusado.", en: "The hearing was held in the absence of the accused.", when: "in a court report or the news" }
  ],
  personal: {
    prompt: "Write the minutes of a meeting, class or party you went to: how many attended, who was missing, who took part from far away, and what was left in plain sight.",
    constraints: [
      { type: "regex", pattern: "asist(ieron|ió|io|í|imos)|los asistentes", label: "attendance: *asistieron*" },
      { type: "regex", pattern: "falt(ó|o|aron|é|amos) a", label: "missing it: *faltó a*" },
      { type: "containsAny", words: ["a distancia", "a la vista", "en presencia de", "en ausencia de"], label: "a way of being there: *a distancia* or *a la vista*" }
    ],
    model: "A la clase de yoga asistieron doce personas. Faltó a la clase la profesora titular, y la reemplazó un estudiante. Dos compañeras participaron a distancia desde Cali. Al final, alguien dejó una chaqueta roja a la vista de todos en la entrada."
  },
  pitfalls: [
    "*Asistí al profesor* says you attended him: for helping, *ayudé al profesor*.",
    "*Faltó a la fiesta* means he was expected; for a party you never planned to go to, *no fue*.",
    "*Falté la reunión* drops the *a*: *falté a la reunión*."
  ]
},

"nt-disponibilidad-b2": {
  source: "merged",
  hook: {
    line: "A hotel in Cartagena answers a booking request by email. It says what's left, what has sold out, what the hotel has, and what the guest can count on.",
    es: "Gracias por escribirnos. Para esas fechas solo quedan dos habitaciones disponibles.\nLas habitaciones con vista al mar ya se agotaron.\nEl hotel cuenta con piscina, gimnasio y parqueadero gratuito.\nTodas las habitaciones disponen de aire acondicionado, y los huéspedes tienen acceso a la playa privada.\nSi le sobra tiempo, le recomendamos el tour de las islas. Cuente con nosotros para cualquier cosa.",
    en: "Thank you for writing to us. For those dates there are only two rooms left available.\nThe sea-view rooms have already sold out.\nThe hotel has a pool, a gym and free parking.\nAll the rooms have air conditioning, and guests have access to the private beach.\nIf you have time to spare, we recommend the islands tour. Count on us for anything."
  },
  examples: [
    { es: "Las boletas para el concierto se agotaron en dos horas, y ahora las revenden al triple.", en: "The concert tickets sold out in two hours, and now they're being resold at three times the price." },
    { es: "Nos faltan diez sillas para la fiesta, pero nos sobran como treinta vasos del año pasado.", en: "We're ten chairs short for the party, but we have about thirty glasses left over from last year." },
    { es: "El cargo de director quedó vacante en marzo, y todavía no hay nadie dispuesto a aceptarlo.", en: "The director's post fell vacant in March, and there's still nobody willing to take it." }
  ],
  rule: "What's left, missing or extra works like *gustar*: *Nos quedan dos cupos.* *Nos faltan diez sillas.* *Nos sobran tres boletas.* *Faltar* and *sobrar* are opposites.\nSold out or run out: *agotarse*: *Se agotaron las boletas.*\nAvailable: *disponible* for things and people, *vacante* for a job, *libre* or *desocupado* for a seat or a room. Ready: *estar listo*. Willing: *estar dispuesto a*.\nIn formal Spanish, *tener* has polished stand-ins, each with its own small word: *contar con* (*cuenta con piscina*), *disponer de* (*dispone de parqueadero*), *tener acceso a*. *Disponer* goes like *poner*: *dispongo*.\n*Cuenta conmigo* is count on me.",
  readAndPick: [
    { q: "How many rooms can still be booked?", es: "Para esas fechas solo quedan dos habitaciones disponibles.",
      options: ["Two, no more", "None at all", "Two hundred or so"], answer: 0,
      why: "*Solo quedan dos* is what's left: two rooms." },
    { q: "What happened to the sea-view rooms?", es: "Las habitaciones con vista al mar ya se agotaron.",
      options: ["They're being cleaned", "They're on offer", "They're all taken"], answer: 2,
      why: "*Se agotaron* is sold out: none left." },
    { q: "What does *cuenta con piscina* mean?", es: "El hotel cuenta con piscina, gimnasio y parqueadero gratuito.",
      options: ["It counts its pools", "It has a pool", "Pool"], answer: 1,
      why: "*Contar con* is the polished way to say it has; nothing is counted." },
    { q: "What's the problem with chairs and glasses?", es: "Nos faltan diez sillas, pero nos sobran treinta vasos.",
      options: ["Short of chairs, spare glasses", "Spare chairs and too few glasses for everyone", "Fine"], answer: 0,
      why: "*Faltar* is missing and *sobrar* is extra: opposites." },
    { q: "What can be *vacante*?", es: "El cargo de director quedó vacante en marzo.",
      options: ["A hotel room", "A job or post", "A seat on the bus"], answer: 1,
      why: "*Vacante* is for a job; a free room or seat is *libre*." },
    { q: "What is the hotel offering at the end?", es: "Cuente con nosotros para cualquier cosa.",
      options: ["Help whenever needed", "A discount", "A count of the guests"], answer: 0,
      why: "*Contar con* someone is to rely on them: count on us." }
  ],
  yourTurn: [
    { en: "There's nobody available right now.", es: "No hay nadie disponible en este momento.", accept: ["No hay nadie disponible [ahora mismo|ahorita|en este momento]."] },
    { en: "The tickets sold out in two hours.", es: "Las boletas se agotaron en dos horas.", accept: ["Las [boletas|entradas] se agotaron en dos horas."] },
    { en: "We're ten chairs short.", es: "Nos faltan diez sillas.", accept: [] },
    { en: "We have three tickets spare.", es: "Nos sobran tres boletas.", accept: ["Nos sobran tres [boletas|entradas]."] },
    { en: "Count on me. (to a friend)", es: "Cuenta conmigo.", accept: [] }
  ],
  translate: [
    { en: "It's the last seat left.", es: "Es el último puesto que queda.", accept: ["Es el último [puesto|asiento|cupo] que queda."] },
    { en: "We have the support of the whole team.", es: "Contamos con el apoyo de todo el equipo.", accept: [] },
    { en: "We don't have access to that data yet.", es: "Todavía no tenemos acceso a esos datos.", accept: ["No tenemos acceso a esos datos todavía.", "Aún no tenemos acceso a esos datos."] },
    { en: "He's not willing to change his mind.", es: "No está dispuesto a cambiar de opinión.", accept: [] },
    { en: "The car is ready; we can leave this afternoon. There are only two places left on the tour. And the flat has parking.", es: "El carro ya está listo; podemos salir esta tarde. Solo quedan dos cupos en el tour. Y el apartamento dispone de parqueadero.", accept: ["El carro ya está listo[;|,|.] podemos salir esta tarde. Solo quedan dos cupos en el tour. Y el apartamento [dispone de|tiene|cuenta con] parqueadero."] },
    { en: "The director's post has fallen vacant.", es: "El cargo de director quedó vacante.", accept: ["El cargo de director [quedó|ha quedado] vacante."] }
  ],
  register: [
    { es: "Ya no hay, se acabaron.", en: "There aren't any more, they ran out.", when: "anywhere, at a shop or a stall" },
    { es: "Listo, cuenta conmigo.", en: "Sure, count me in.", when: "in Colombia, saying yes to a plan" },
    { es: "Por el momento no tenemos disponibilidad.", en: "At the moment we have no availability.", when: "a hotel or a clinic, on the phone" },
    { es: "El inmueble dispone de dos parqueaderos.", en: "The property has two parking spaces.", when: "in a listing or a formal description" }
  ],
  personal: {
    prompt: "You're organising a party or a trip. Write a message saying what's missing or extra, what sold out, and what the place has.",
    constraints: [
      { type: "regex", pattern: "(me|te|le|nos|les) (quedan|queda|faltan|falta|sobran|sobra)", label: "left, missing or extra: *nos faltan* or *nos sobra*" },
      { type: "regex", pattern: "se agot(ó|o|aron)|agotad[oa]s?", label: "sold out: *se agotaron*" },
      { type: "regex", pattern: "cuenta con|cuentan con|dispone de|disponen de|tiene acceso|tienen acceso", label: "what the place has: *cuenta con* or *dispone de*" }
    ],
    model: "Para el paseo a Villa de Leyva nos faltan dos personas para llenar el bus. Nos sobra comida, así que no traigan nada. Las boletas del museo se agotaron, pero el hotel cuenta con piscina y zona de juegos."
  },
  pitfalls: [
    "*Me falta* and *me sobra* are opposites: mixing them up reverses the whole message.",
    "*Vacante* is for a job; a free room or seat is *libre* or *desocupado*.",
    "*Contar con* here means to have, not to count; *cuenta con piscina* is it has a pool."
  ]
},

"task-b2-enfasis": {
  source: "old",
  hook: {
    line: "This is the unit's own exercise: take six plain sentences of your own and rewrite each three ways, saying in one line what question each version answers. The model does it for one sentence about a report.",
    es: "Marta envió el informe el viernes.\nFue Marta quien envió el informe el viernes. (¿Quién lo envió?)\nEl informe lo envió Marta el viernes. (¿Y el informe?)\nFue el viernes cuando Marta envió el informe. (¿Cuándo lo envió?)\nLo que envió Marta el viernes fue el informe. (¿Qué envió?)\nY lo de Marta se resolvió el lunes. (¿Y el asunto de Marta?)",
    en: "Marta sent the report on Friday.\nIt was Marta who sent the report on Friday. (Who sent it?)\nThe report, Marta sent on Friday. (And the report?)\nIt was on Friday that Marta sent the report. (When did she send it?)\nWhat Marta sent on Friday was the report. (What did she send?)\nAnd the Marta business was settled on Monday. (And the Marta matter?)"
  },
  examples: [
    { es: "Fue Marta quien envió el informe, aunque el jefe cree que lo mandé yo.", en: "It was Marta who sent the report, although the boss thinks I sent it." },
    { es: "El informe lo envió Marta el viernes, y la presentación la terminé yo el sábado.", en: "The report, Marta sent on Friday, and the presentation, I finished on Saturday." },
    { es: "Lo de Marta se resolvió el lunes, pero lo de la oficina nueva sigue sin fecha.", en: "The Marta business was settled on Monday, but the new office business still has no date." }
  ],
  rule: "Take six plain sentences of your own. Rewrite each three ways, and say in one line what question each version answers.\nWhat comes first is treated as known; what comes last is the news.\nThe devices:\nPut the thing first and repeat it: *El informe lo envió Marta.* (And the report?)\nFrame one piece with *ser*: *Fue Marta quien...* (who), *Fue el viernes cuando...* (when), *Lo que envió fue...* (what).\nPick up a shared matter: *Lo de Marta se resolvió.*\nCushion an explanation: *Lo que pasa es que...*\nEvery version is a choice about what your listener already knows.",
  readAndPick: [
    { q: "Which question does this version answer?", es: "Fue Marta quien envió el informe.",
      options: ["When it happened", "Who did it", "What"], answer: 1,
      why: "*Fue Marta quien* puts the person under the spotlight: it answers who." },
    { q: "What is treated as known here?", es: "El informe lo envió Marta el viernes.",
      options: ["The report", "Marta herself", "Friday"], answer: 0,
      why: "What comes first, repeated by *lo*, is the known topic: the report." },
    { q: "What is the news in this version?", es: "Fue el viernes cuando Marta envió el informe.",
      options: ["The report", "Marta", "The day"], answer: 2,
      why: "*Fue el viernes cuando* spotlights the day; the rest is already known." },
    { q: "What does *lo de Marta* point at?", es: "Lo de Marta se resolvió el lunes.",
      options: ["A matter both know about", "Marta's new house in Chía", "News"], answer: 0,
      why: "*Lo de* picks up a known matter without retelling it." },
    { q: "What is missing from *el informe envió Marta*?", es: "El informe lo envió Marta.",
      options: ["Nothing at all", "The repeated *lo*", "A question mark at the end"], answer: 1,
      why: "Put the thing first and you must repeat it before the verb: *lo envió*." }
  ],
  yourTurn: [
    { en: "It was Marta who sent the report.", es: "Fue Marta quien envió el informe.", accept: ["Fue Marta la que envió el informe."] },
    { en: "The report, Marta sent it.", es: "El informe lo envió Marta.", accept: [] },
    { en: "It was on Friday that she sent it.", es: "Fue el viernes cuando lo envió.", accept: [] },
    { en: "What she sent was the report.", es: "Lo que envió fue el informe.", accept: [] }
  ],
  translate: [
    { en: "The Marta business was settled on Friday.", es: "Lo de Marta se resolvió el viernes.", accept: [] },
    { en: "It was my brother who paid the bill.", es: "Fue mi hermano quien pagó la cuenta.", accept: ["Fue mi hermano el que pagó la cuenta."] },
    { en: "The cake, my grandmother made it.", es: "La torta la hizo mi abuela.", accept: [] },
    { en: "What I need is a week off.", es: "Lo que necesito es una semana de descanso.", accept: ["Lo que necesito es una semana [de descanso|libre|de vacaciones]."] },
    { en: "Marta didn't send the report; it was Pablo who sent it. And the slides, I made them. The thing is, nobody asked me.", es: "Marta no envió el informe; fue Pablo quien lo envió. Y las diapositivas las hice yo. Lo que pasa es que nadie me preguntó.", accept: ["Marta no envió el informe[;|,|.] fue Pablo [quien|el que] lo envió. Y las diapositivas las hice yo. Lo que pasa es que nadie me preguntó."] },
    { en: "It was here that it all started.", es: "Fue aquí donde todo empezó.", accept: ["Fue acá donde todo empezó.", "Aquí fue donde todo empezó."] }
  ],
  register: [
    { es: "Eso lo hice yo, ¿oyó?", en: "I did that, you hear?", when: "in Colombia, claiming credit among friends" },
    { es: "Fue Marta quien lo envió.", en: "It was Marta who sent it.", when: "anywhere, setting the record straight" },
    { es: "En cuanto al informe, lo envió Marta.", en: "As for the report, Marta sent it.", when: "in a meeting, taking up a point" },
    { es: "Fue la gerencia la que tomó la decisión.", en: "It was management that took the decision.", when: "in a formal statement or a letter" }
  ],
  personal: {
    prompt: "Take one plain sentence of your own about something that happened this week. Rewrite it three ways, each answering a different question: who, when, and what about the thing itself.",
    constraints: [
      { type: "regex", pattern: "(fue|es|fueron) [a-záéíóúñ ]+ (quien|quienes|el que|la que|los que|las que)", label: "who, spotlighted: *fue Marta quien...*" },
      { type: "regex", pattern: "(fue|es) [a-záéíóúñ ]+ (cuando|donde)", label: "when or where, spotlighted: *fue el viernes cuando...*" },
      { type: "regex", pattern: "(^|[.!?] )(el|la|los|las) [a-záéíóúñ]+( [a-záéíóúñ]+)? (lo|la|los|las) [a-záéíóúñ]+", label: "the thing first, repeated: *el informe lo envió Marta*" }
    ],
    model: "Mi hermana compró la torta el sábado. Fue mi hermana quien compró la torta. Fue el sábado cuando la compró. La torta la compró mi hermana, no yo."
  },
  pitfalls: [
    "Fronting without the repeat, *el informe envió Marta*, isn't Spanish: *el informe lo envió Marta*.",
    "*Fue Marta que lo envió* is common in speech; in writing, *fue Marta quien* or *la que*.",
    "Each version answers a different question; choose the one your listener is actually asking."
  ]
},

/* ---- unit b2-u51 · Describing precisely ---------------------------------- */

"nt-consistencia-resistencia-b2": {
  source: "merged",
  hook: {
    line: "An online shop lists a backpack and a thermos. Every line tells you how the thing behaves: what it resists, which parts bend, which part breaks, and a customer who wants to know exactly how waterproof it is.",
    es: "Morral de viaje, modelo Páramo: tela resistente al agua y al desgaste.\nLa base es rígida, pero los lados son flexibles y se doblan fácilmente.\nTermo de acero: resiste golpes y temperaturas extremas.\nLa tapa es de vidrio, así que es más frágil: no lo deje caer.\nPregunta de un cliente: ¿Es a prueba de agua o solo resistente a la lluvia?",
    en: "Travel backpack, Páramo model: fabric resistant to water and wear.\nThe base is rigid, but the sides are flexible and fold easily.\nSteel thermos: withstands knocks and extreme temperatures.\nThe lid is glass, so it's more fragile: don't drop it.\nA customer's question: Is it waterproof or just rain-resistant?"
  },
  examples: [
    { es: "La principal ventaja de este reloj es su resistencia al agua: aguanta hasta cincuenta metros.", en: "The main advantage of this watch is its water resistance: it holds up to fifty metres." },
    { es: "La salsa quedó demasiado espesa, así que le eché un poco de agua para que quedara más fluida.", en: "The sauce turned out too thick, so I added a little water to make it runnier." },
    { es: "El puente resistió el terremoto sin daños, gracias a la flexibilidad de su estructura de acero.", en: "The bridge withstood the earthquake undamaged, thanks to the flexibility of its steel frame." }
  ],
  rule: "Name the quality, or describe the thing: *la dureza*, *duro*; *la fragilidad*, *frágil*; *la flexibilidad*, *flexible*; *la rigidez*, *rígido*; *la elasticidad*, *elástico*.\nResistant always says to what, with *a*: *resistente al agua*, *resistencia al calor*. *A* + *el* becomes *al*. A bare *es resistente* leaves the reader asking: to what?\nThe verb *resistir* takes the threat straight, with no *a*: *resiste el calor*. In Colombia *aguantar* is the everyday twin: *aguanta el agua*.\nProof against: *a prueba de*: *a prueba de agua*, *a prueba de balas*.\nFor liquids and mixtures, a scale: *espeso* or *denso* (thick), *fluido* (runny). For solids, *duro* and *blando*.",
  readAndPick: [
    { q: "What is the backpack's fabric good against?", es: "Tela resistente al agua y al desgaste.",
      options: ["Water and wear", "Heat and nothing else", "Nothing"], answer: 0,
      why: "*Resistente a* names what it holds out against: water and wear." },
    { q: "Which part bends?", es: "La base es rígida, pero los lados son flexibles.",
      options: ["The base", "The sides", "Neither of them"], answer: 1,
      why: "*Rígida* doesn't bend; *flexibles* do." },
    { q: "Why be careful with the lid?", es: "La tapa es de vidrio, así que es más frágil.",
      options: ["It's heavy", "It's hot to touch", "It breaks easily"], answer: 2,
      why: "*Frágil* breaks easily; glass is the weak point." },
    { q: "What is the customer asking?", es: "¿Es a prueba de agua o solo resistente a la lluvia?",
      options: ["Its price, in pesos", "How fully it keeps water out", "What colours it comes in, if several"], answer: 1,
      why: "*A prueba de agua* is fully proof; *resistente a la lluvia* only holds out against rain." },
    { q: "How did the sauce turn out?", es: "La salsa quedó demasiado espesa.",
      options: ["Too thick", "Too runny", "Too salty"], answer: 0,
      why: "*Espeso* is thick; runny would be *fluido* or *aguado*." },
    { q: "What did the bridge do?", es: "El puente resistió el terremoto sin daños.",
      options: ["It collapsed in the end", "It held up fine", "It shook"], answer: 1,
      why: "*Resistir* takes the threat straight: it withstood the earthquake." }
  ],
  yourTurn: [
    { en: "It's water-resistant.", es: "Es resistente al agua.", accept: [] },
    { en: "This material withstands extreme temperatures.", es: "Este material resiste temperaturas extremas.", accept: ["Este material [resiste|aguanta] temperaturas extremas."] },
    { en: "Glass is very fragile.", es: "El vidrio es muy frágil.", accept: [] },
    { en: "The fabric has good stretch.", es: "La tela tiene buena elasticidad.", accept: [] },
    { en: "The sauce turned out too thick.", es: "La salsa quedó demasiado espesa.", accept: ["La salsa quedó muy espesa."] }
  ],
  translate: [
    { en: "The main feature of this model is its water resistance.", es: "La principal característica de este modelo es su resistencia al agua.", accept: ["La característica principal de este modelo es su resistencia al agua."] },
    { en: "The diamond's hardness makes it almost indestructible.", es: "La dureza del diamante lo hace casi indestructible.", accept: [] },
    { en: "Is it waterproof?", es: "¿Es a prueba de agua?", accept: ["¿Es impermeable?"] },
    { en: "It's a dense oil; it hardly spills.", es: "Es un aceite denso; casi no se derrama.", accept: ["Es un aceite [denso|espeso][;|,|.] casi no se [derrama|riega]."] },
    { en: "The base is rigid, but the sides are flexible. The fabric is resistant to rain. It's not waterproof, though.", es: "La base es rígida, pero los lados son flexibles. La tela es resistente a la lluvia. Eso sí, no es a prueba de agua.", accept: ["La base es rígida, pero los lados son flexibles. La tela es resistente a la lluvia. [Eso sí|Pero], no es a prueba de agua."] },
    { en: "The bridge withstood the earthquake.", es: "El puente resistió el terremoto.", accept: ["El puente [resistió|aguantó] el terremoto."] }
  ],
  register: [
    { es: "Eso aguanta lo que le echen.", en: "That can take anything you throw at it.", when: "in Colombia, praising something tough" },
    { es: "Es muy resistente.", en: "It's very tough.", when: "anywhere, a quick verdict" },
    { es: "El producto es resistente al agua y a los golpes.", en: "The product is resistant to water and knocks.", when: "in a product description or a listing" },
    { es: "El material presenta una alta resistencia a la tracción.", en: "The material shows high tensile strength.", when: "in a technical sheet or engineering report" }
  ],
  personal: {
    prompt: "Describe something you own that has to be tough: a bag, a phone case, a pair of boots. Say what it resists, which part is rigid or flexible, and what it can't take.",
    constraints: [
      { type: "regex", pattern: "resistentes? a(l)? |resistencia a(l)? |a prueba de", label: "resistant to what: *resistente al agua*" },
      { type: "containsAny", words: ["rígido", "rígida", "flexible", "flexibles", "frágil", "duro", "dura", "blando", "blanda", "elástico", "elástica"], label: "a quality: *rígido*, *flexible* or *frágil*" },
      { type: "regex", pattern: "resist(e|en|ió|io)|aguant(a|an|ó|o)", label: "the verb: *resiste el calor* or *aguanta*" }
    ],
    model: "Mis botas de montaña son resistentes al agua y al barro. La suela es rígida, pero la parte de arriba es flexible. Aguantan muy bien el frío del páramo, aunque no resisten el fuego."
  },
  pitfalls: [
    "*Es resistente* alone leaves the reader asking to what: *resistente al agua*.",
    "*Resiste al calor* adds an *a* the verb doesn't take: *resiste el calor*.",
    "*Espeso* and *fluido* are for liquids; for solids, *duro* and *blando*."
  ]
},

"nt-textura-acabado-b2": {
  source: "merged",
  hook: {
    line: "A furniture restorer posts the before and after of an old table. The post is all about touch and finish: how the wood felt, what it took, and what covers it now.",
    es: "Así llegó esta mesa: la madera estaba áspera y llena de manchas.\nPrimero la lijamos hasta dejarla lisa y suave al tacto.\nDespués le dimos dos manos de pintura blanca y una capa de barniz mate.\nLas manijas están bañadas en bronce, y no se oxidan.\nToquen la superficie: parece seda, pero es madera de pino.",
    en: "This is how this table arrived: the wood was rough and full of stains.\nFirst we sanded it until it was smooth and soft to the touch.\nThen we gave it two coats of white paint and a layer of matte varnish.\nThe handles are bronze-plated, and they don't rust.\nTouch the surface: it feels like silk, but it's pine."
  },
  examples: [
    { es: "La camisa salió toda arrugada de la maleta, así que tuve que plancharla en el hotel.", en: "The shirt came out of the suitcase all creased, so I had to iron it at the hotel." },
    { es: "Le dieron dos manos de pintura a la fachada, pero la humedad ya está saliendo otra vez.", en: "They gave the façade two coats of paint, but the damp is already coming through again." },
    { es: "Esta tela es suave al tacto, aunque parece áspera cuando la miras de lejos.", en: "This fabric is soft to the touch, although it looks rough when you see it from a distance." }
  ],
  rule: "How a surface feels: *áspero* (rough), *rugoso* (bumpy), *liso* (smooth), *suave* (soft), *sedoso* (silky), *pegajoso* (sticky), *peludo* (furry), *arrugado* (creased).\nAdd *al tacto* to say it's about touch, not looks: *suave al tacto*. The describing word agrees; *al tacto* never changes: *la madera es áspera al tacto*.\nA coat of paint is *una mano*, never *un abrigo*: *dos manos de pintura*. Any other layer is *una capa*: *una capa de barniz*.\nFinishes: *mate* or *brillante*, *bañado en oro* (gold-plated), *plastificar* (laminate), *impermeabilizar* (waterproof).",
  readAndPick: [
    { q: "How did the wood feel at first?", es: "La madera estaba áspera y llena de manchas.",
      options: ["Smooth and silky", "Rough to the touch", "Sticky with old glue"], answer: 1,
      why: "*Áspero* is rough; smooth would be *liso*." },
    { q: "How many coats of paint did it get?", es: "Le dimos dos manos de pintura blanca.",
      options: ["Two coats of it", "Two people", "Two different colours"], answer: 0,
      why: "*Una mano de pintura* is one coat; *dos manos*, two." },
    { q: "What does *suave al tacto* tell you?", es: "La dejamos lisa y suave al tacto.",
      options: ["How it looks from afar", "Smell", "How it feels"], answer: 2,
      why: "*Al tacto* says the judgement comes from touch, not from looking." },
    { q: "What are the handles?", es: "Las manijas están bañadas en bronce.",
      options: ["Solid bronze all through", "Coated in bronze", "Painted"], answer: 1,
      why: "*Bañado en bronce* is plated: a thin metal coat over something else." },
    { q: "What finish does the varnish give?", es: "Una capa de barniz mate.",
      options: ["Matte", "Glossy and shiny", "Wet"], answer: 0,
      why: "*Mate* has no shine; the opposite is *brillante*." },
    { q: "What does the shirt need?", es: "La camisa salió toda arrugada de la maleta.",
      options: ["An iron", "A wash in cold water", "Sewing"], answer: 0,
      why: "*Arrugada* is creased, so it needs ironing." }
  ],
  yourTurn: [
    { en: "The fabric was all creased.", es: "La tela estaba toda arrugada.", accept: [] },
    { en: "They gave the façade a coat of paint.", es: "Le dieron una mano de pintura a la fachada.", accept: ["Le dieron a la fachada una mano de pintura."] },
    { en: "It's soft to the touch.", es: "Es suave al tacto.", accept: [] },
    { en: "The ring is gold-plated.", es: "El anillo está bañado en oro.", accept: [] },
    { en: "They laminated the ID card so it would last longer.", es: "Plastificaron el carné para que durara más.", accept: ["[Plastificaron|Laminaron] el carné para que durara más."] }
  ],
  translate: [
    { en: "The wood is rough to the touch.", es: "La madera es áspera al tacto.", accept: [] },
    { en: "He touched the fabric to check the texture.", es: "Tocó la tela para comprobar la textura.", accept: ["Tocó la tela para [comprobar|revisar|sentir] la textura."] },
    { en: "They waterproofed the roof before the rainy season.", es: "Impermeabilizaron el techo antes de la temporada de lluvias.", accept: [] },
    { en: "The medal is silver-plated.", es: "La medalla está bañada en plata.", accept: [] },
    { en: "First we sanded the table until it was smooth. Then we gave it two coats of paint. Finally, a layer of matte varnish.", es: "Primero lijamos la mesa hasta dejarla lisa. Después le dimos dos manos de pintura. Por último, una capa de barniz mate.", accept: ["Primero lijamos la mesa hasta dejarla lisa. [Después|Luego] le dimos dos manos de pintura. [Por último|Al final|Finalmente], una capa de barniz mate."] },
    { en: "It's a very furry animal.", es: "Es un animal muy peludo.", accept: [] }
  ],
  register: [
    { es: "¡Qué tela tan rica!", en: "What lovely fabric!", when: "in Colombia, about something that feels nice" },
    { es: "Es suave y no se arruga.", en: "It's soft and doesn't crease.", when: "anywhere, describing clothes" },
    { es: "Acabado mate, resistente a la humedad.", en: "Matte finish, moisture-resistant.", when: "on a paint tin or a product label" },
    { es: "La superficie presenta una textura rugosa.", en: "The surface has a rough texture.", when: "in a technical or museum description" }
  ],
  personal: {
    prompt: "Describe a piece of furniture or clothing you've fixed, painted or looked after: how it felt before and after, and what finish it has now.",
    constraints: [
      { type: "containsAny", words: ["áspero", "áspera", "liso", "lisa", "suave", "rugoso", "rugosa", "sedoso", "sedosa", "pegajoso", "pegajosa", "arrugado", "arrugada"], label: "a texture: *áspero*, *liso* or *suave*" },
      { type: "containsAny", words: ["al tacto"], label: "touch, not looks: *al tacto*" },
      { type: "regex", pattern: "(una|dos|tres) manos? de|una capa de|capas de|bañad[oa]", label: "a finish: *una mano de pintura* or *una capa de*" }
    ],
    model: "Mi abuela me regaló una silla vieja de madera. Estaba áspera al tacto y tenía la pintura pelada. La lijé un fin de semana entero hasta dejarla lisa. Después le di dos manos de pintura verde y una capa de barniz brillante."
  },
  pitfalls: [
    "A coat of paint is *una mano*, never *un abrigo*: *dos manos de pintura*.",
    "*Suave al tacto* is about touch; for how it looks, *se ve suave*.",
    "*Impermeabilizar* keeps water out; *plastificar* covers paper in plastic. Different jobs."
  ]
},

"nt-materia-b2": {
  source: "merged",
  hook: {
    line: "A craft stall at a market in Ráquira labels everything it sells. Each card says what the thing is made of, or what it contains, and the wording changes with the kind of thing.",
    es: "Olla de barro hecha a mano en Ráquira, Boyacá.\nEstas tazas son de cerámica, no de plástico, y aguantan el microondas.\nEl jabón artesanal contiene miel y avena, sin químicos.\nLa ruana está fabricada con lana virgen de oveja.\nLos aretes son de cobre, y la cadena es de plata.",
    en: "Clay pot handmade in Ráquira, Boyacá.\nThese mugs are ceramic, not plastic, and they can go in the microwave.\nThe handmade soap contains honey and oats, no chemicals.\nThe ruana is made of pure sheep's wool.\nThe earrings are copper, and the chain is silver."
  },
  examples: [
    { es: "La estatua de la plaza es de bronce, pero la base está hecha de mármol traído de Italia.", en: "The statue in the square is bronze, but the base is made of marble brought from Italy." },
    { es: "Esta crema contiene manzanilla y avena, así que se puede usar en la piel de los bebés.", en: "This cream contains chamomile and oats, so it can be used on babies' skin." },
    { es: "La chaqueta está fabricada con una mezcla de algodón y poliéster, y viene rellena de plumas.", en: "The jacket is made from a blend of cotton and polyester, and comes filled with feathers." }
  ],
  rule: "What a thing is made of: *ser de*, with no article: *es de cuero*, *son de algodón*. Right after the thing too: *un suéter de lana*, *una olla de barro*. To ask: *¿De qué es?*\nOn a label or in a catalogue: *estar fabricado con* or *hecho de*. *Fabricado* agrees: *fabricada*, *fabricados*.\nWhat a food, cream or soap has inside: *contener*: *contiene miel*. A jacket doesn't *contener* polyester.\nStuffed with: *relleno de*: *rellena de plumas*.\nMaterials: *barro*, *cerámica*, *ladrillo*, *cemento*, *mármol*, *bronce*, *cobre*, *plomo*. *La materia prima* is the raw material before processing.\nIn Colombia *plata* is silver and money.",
  readAndPick: [
    { q: "What are the mugs made of?", es: "Estas tazas son de cerámica, no de plástico.",
      options: ["Hard plastic", "Ceramic", "Glass"], answer: 1,
      why: "*Ser de* + the material, with no article: *son de cerámica*." },
    { q: "What is in the soap?", es: "El jabón artesanal contiene miel y avena.",
      options: ["Honey and oats", "Chemicals", "Wax and nothing else"], answer: 0,
      why: "*Contener* names what a substance has inside it." },
    { q: "Why *fabricada* and not *fabricado*?", es: "La ruana está fabricada con lana virgen.",
      options: ["It matches *lana*", "It's always that way", "It matches *ruana*"], answer: 2,
      why: "*Fabricado* agrees with the thing made: *la ruana*, so *fabricada*." },
    { q: "What could *plata* mean on this stall?", es: "La cadena es de plata.",
      options: ["Silver", "Money", "Plastic"], answer: 0,
      why: "*De plata* is the metal here; in Colombia *plata* is also money." },
    { q: "What is the pot made of?", es: "Olla de barro hecha a mano en Ráquira.",
      options: ["Cast iron", "Clay", "Tin"], answer: 1,
      why: "*Una olla de barro* is a clay pot: *de* plus the material, straight after the thing." },
    { q: "What is the statue's base made of?", es: "La estatua es de bronce, pero la base está hecha de mármol.",
      options: ["Bronze too", "Tin", "Marble"], answer: 2,
      why: "*Está hecha de mármol*: the base is a different material from the statue." }
  ],
  yourTurn: [
    { en: "The statue is bronze.", es: "La estatua es de bronce.", accept: [] },
    { en: "This cream contains chamomile and oats.", es: "Esta crema contiene manzanilla y avena.", accept: [] },
    { en: "What's this bag made of?", es: "¿De qué es este bolso?", accept: ["¿De qué está hecho este bolso?", "¿De qué material es este bolso?"] },
    { en: "It's made from a blend of cotton and lycra.", es: "Está fabricado con una mezcla de algodón y licra.", accept: ["Está [fabricado|hecho] con una mezcla de algodón y licra.", "Está hecho de una mezcla de algodón y licra."] },
    { en: "The duvet is filled with feathers.", es: "El edredón está relleno de plumas.", accept: ["El edredón está relleno con plumas."] }
  ],
  translate: [
    { en: "The cables are copper.", es: "Los cables son de cobre.", accept: [] },
    { en: "This piece is ceramic, not plastic.", es: "Esta pieza es de cerámica, no de plástico.", accept: [] },
    { en: "The soap contains glycerine.", es: "El jabón contiene glicerina.", accept: [] },
    { en: "A wool sweater and leather boots.", es: "Un suéter de lana y unas botas de cuero.", accept: ["Un saco de lana y unas botas de cuero."] },
    { en: "The pot is made of clay. The mugs are ceramic. And the soap contains honey, not chemicals.", es: "La olla es de barro. Las tazas son de cerámica. Y el jabón contiene miel, no químicos.", accept: ["La olla es de barro. Las tazas son de cerámica. Y el jabón contiene miel, no [químicos|productos químicos]."] },
    { en: "Cotton is the raw material for this fabric.", es: "El algodón es la materia prima de esta tela.", accept: [] }
  ],
  register: [
    { es: "Es de cuero cuero, no sintético.", en: "It's real leather, not synthetic.", when: "a seller in a Colombian market, insisting" },
    { es: "Es de algodón.", en: "It's cotton.", when: "anywhere, answering what it's made of" },
    { es: "Fabricado con materiales reciclados.", en: "Made with recycled materials.", when: "on a label or on packaging" },
    { es: "Composición: 80 % algodón, 20 % poliéster.", en: "Composition: 80% cotton, 20% polyester.", when: "on a clothing label" }
  ],
  personal: {
    prompt: "Describe three things in your home: what each is made of, what one of them contains, and how the label on one of them puts it.",
    constraints: [
      { type: "regex", pattern: "(es|son) de [a-záéíóúñ]+", label: "made of: *es de madera*" },
      { type: "regex", pattern: "contien(e|en)", label: "what's inside: *contiene*" },
      { type: "regex", pattern: "(fabricad|hech)[oa]s? (con|de)|rellen[oa]s? de", label: "label talk: *fabricado con* or *relleno de*" }
    ],
    model: "Mi mesa de comedor es de madera de cedro. El cojín del sofá está relleno de espuma. Mi champú contiene romero, y la etiqueta dice que está fabricado con ingredientes naturales."
  },
  pitfalls: [
    "*La chaqueta contiene poliéster* sounds like a food label: for objects, *es de* or *está fabricada con*.",
    "*Es de un algodón* adds an article: *es de algodón*.",
    "*Un suéter lana* drops the *de*: *un suéter de lana*."
  ]
},

"nt-formas-figuras-b2": {
  source: "merged",
  hook: {
    line: "A listing for a country house near Bogotá sells it on its shapes: the plot, the pool, the ceiling, the garden and a lake that looks like something from above.",
    es: "Finca en venta en Anapoima: lote de forma irregular, con un frente de cuarenta metros.\nLa piscina tiene forma de riñón y está rodeada de palmas.\nEl techo de la sala forma un arco de madera.\nEl jardín es rectangular, y el camino de entrada hace una curva suave hasta la casa.\nDesde arriba, el lago del fondo tiene forma de corazón.",
    en: "Country house for sale in Anapoima: irregularly shaped plot, with a forty-metre frontage.\nThe pool is kidney-shaped and surrounded by palms.\nThe living room ceiling forms a wooden arch.\nThe garden is rectangular, and the drive makes a gentle curve up to the house.\nFrom above, the lake at the back is heart-shaped."
  },
  examples: [
    { es: "La isla tiene forma de media luna, y en el centro hay una playa pequeña de arena blanca.", en: "The island is crescent-shaped, and in the middle there's a small white-sand beach." },
    { es: "Compramos una mesa de forma rectangular para el comedor, porque la redonda no cabía en la esquina.", en: "We bought a rectangular table for the dining room, because the round one didn't fit in the corner." },
    { es: "El ruedo de la falda quedó desigual, así que la costurera tuvo que coserlo otra vez.", en: "The hem of the skirt came out uneven, so the dressmaker had to sew it again." }
  ],
  rule: "English says heart-shaped. Spanish says a thing has a shape: *tiene forma de corazón*. With a thing you can picture, use *de*: *forma de estrella*, *forma de huevo*, *forma de media luna*.\nWith a describing word, no *de*: *forma rectangular*, *forma redonda*, *forma irregular*. Or say it straight: *es circular*, *es cuadrado*.\nTo ask: *¿Qué forma tiene?*\nFor lines and outlines: *una curva*, *un arco*, *una onda* (a wave), *el perfil* (the outline). *Forma un arco*: it makes an arch.\n*Irregular* and *desigual* have no fixed pattern; *desigual* also means uneven, like a hem: *el ruedo quedó desigual*.",
  readAndPick: [
    { q: "What shape is the plot of land?", es: "Lote de forma irregular, con un frente de cuarenta metros.",
      options: ["A perfect square", "No regular shape", "Round like a coin"], answer: 1,
      why: "*Forma irregular* has no fixed geometric pattern." },
    { q: "What does the pool look like?", es: "La piscina tiene forma de riñón.",
      options: ["A kidney", "A heart", "A rectangle"], answer: 0,
      why: "*Tener forma de* + a thing you can picture: a kidney." },
    { q: "What does the ceiling do?", es: "El techo de la sala forma un arco de madera.",
      options: ["Lies perfectly flat and level", "Waves", "Curves into an arch"], answer: 2,
      why: "*Forma un arco*: it makes an arch." },
    { q: "What shape is the garden?", es: "El jardín es rectangular.",
      options: ["Round, like a big plate", "Four straight sides", "Heart-shaped"], answer: 1,
      why: "*Rectangular* has four straight sides and right angles." },
    { q: "What went wrong with the skirt?", es: "El ruedo de la falda quedó desigual.",
      options: ["The hem is uneven", "The colour faded badly", "Too long"], answer: 0,
      why: "*Desigual* is uneven; *el ruedo* is the Colombian word for the hem." }
  ],
  yourTurn: [
    { en: "The lake has an irregular shape.", es: "El lago tiene una forma irregular.", accept: ["El lago tiene forma irregular."] },
    { en: "The pool is kidney-shaped.", es: "La piscina tiene forma de riñón.", accept: [] },
    { en: "What shape is it?", es: "¿Qué forma tiene?", accept: [] },
    { en: "The bridge forms a perfect arch.", es: "El puente forma un arco perfecto.", accept: [] },
    { en: "The island is crescent-shaped.", es: "La isla tiene forma de media luna.", accept: [] }
  ],
  translate: [
    { en: "It's a circular table.", es: "Es una mesa circular.", accept: ["Es una mesa redonda."] },
    { en: "The ceiling forms a gentle curve.", es: "El techo forma una curva suave.", accept: [] },
    { en: "The hem of the skirt is uneven.", es: "El ruedo de la falda es desigual.", accept: ["El ruedo de la falda [está|quedó] desigual."] },
    { en: "The biscuits are star-shaped.", es: "Las galletas tienen forma de estrella.", accept: [] },
    { en: "The plot has an irregular shape. The pool is kidney-shaped. And from above, the lake looks like a heart.", es: "El lote tiene una forma irregular. La piscina tiene forma de riñón. Y desde arriba, el lago parece un corazón.", accept: ["El lote tiene [una forma irregular|forma irregular]. La piscina tiene forma de riñón. Y desde arriba, el lago [parece un corazón|tiene forma de corazón]."] },
    { en: "He folded the corner of the paper carefully.", es: "Dobló la esquina del papel con cuidado.", accept: ["Dobló con cuidado la esquina del papel."] }
  ],
  register: [
    { es: "Es como una bolita.", en: "It's like a little ball.", when: "chatting, describing something small and round" },
    { es: "Tiene forma de corazón.", en: "It's heart-shaped.", when: "anywhere, a clear description" },
    { es: "Lote de forma irregular, de 1.200 metros cuadrados.", en: "Irregularly shaped plot of 1,200 square metres.", when: "in a property listing" },
    { es: "La figura presenta un perfil ondulado.", en: "The figure has a wavy outline.", when: "in a technical or art description" }
  ],
  personal: {
    prompt: "Describe the shapes of three things you can see from where you are: one with *tiene forma de*, one with a shape word like *rectangular*, and one curve or arch.",
    constraints: [
      { type: "regex", pattern: "forma de [a-záéíóúñ]+", label: "compared to a thing: *tiene forma de corazón*" },
      { type: "regex", pattern: "(forma |es |son )(rectangular|redond[oa]|circular|cuadrad[oa]|irregular|ovalad[oa]|triangular)", label: "a shape word: *forma rectangular*" },
      { type: "containsAny", words: ["curva", "arco", "onda", "ondulad", "curvo"], label: "a line: *una curva* or *un arco*" }
    ],
    model: "La lámpara de mi cuarto tiene forma de pera. La ventana es rectangular y da a la calle. Encima de la puerta, la pared forma un arco pequeño."
  },
  pitfalls: [
    "*Es una piscina riñón* isn't Spanish: *tiene forma de riñón*.",
    "*Forma de rectangular* adds a *de*: with a describing word, *forma rectangular*.",
    "*El bajo de la falda* is Spain; in Colombia, *el ruedo*."
  ]
},

"nt-peso-b2": {
  source: "merged",
  hook: {
    line: "A family moves house, and the group chat is all about weight: the truck's load, the fridge, the boxes someone weighed, what to unload first, and a phone that died.",
    es: "Mamá: El camión de la mudanza llega a las ocho. Lleva una carga de casi dos toneladas.\nPapá: La nevera pesa como ochenta kilos; no la cargues solo.\nHijo: Ya pesé las cajas de libros: cada una pesa unos veinte kilos.\nMamá: Descarguen primero las camas, por favor.\nHijo: Y se me descargó el celular, así que no me llamen.",
    en: "Mom: The moving truck arrives at eight. It's carrying a load of almost two tonnes.\nDad: The fridge weighs about eighty kilos; don't carry it on your own.\nSon: I've already weighed the boxes of books: each one weighs about twenty kilos.\nMom: Unload the beds first, please.\nSon: And my phone died, so don't call me."
  },
  examples: [
    { es: "Me peso todos los lunes por la mañana, antes de desayunar, en la báscula del baño.", en: "I weigh myself every Monday morning, before breakfast, on the bathroom scale." },
    { es: "El peso exacto del paquete es 4,3 kilos, pero en la factura pusieron el peso aproximado.", en: "The exact weight of the parcel is 4.3 kilos, but on the invoice they put the approximate weight." },
    { es: "Se demoraron dos horas descargando el camión, porque la carga venía mal acomodada.", en: "It took them two hours to unload the truck, because the load had been badly packed." }
  ],
  rule: "A thing weighs an amount: *pesa 23 kilos*. Never *es 23 kilos*. To ask: *¿Cuánto pesa?*\n*Pesar* is also putting something on the scale: *pesamos el paquete*. Yourself, with *me*, *te*, *se*: *me peso los lunes*.\nBig weights: *una tonelada* (1,000 kilos); *una carga* is a load, what one truck or animal carries.\n*Peso exacto* is for a contract or a scale; *peso aproximado* is a working guess.\n*Cargar* is to load, to carry and to charge; *descargar* is to unload, to download, and a battery dying: *se me descargó el celular*, where the phone is the subject and you're who it happened to.",
  readAndPick: [
    { q: "How heavy is the fridge?", es: "La nevera pesa como ochenta kilos.",
      options: ["Around eighty kilos", "Exactly eight kilos, no more", "Eighty tonnes"], answer: 0,
      why: "*Pesa como ochenta kilos*: about eighty, with a chatty *como*." },
    { q: "What did the son do with the boxes?", es: "Ya pesé las cajas de libros.",
      options: ["He carried them downstairs", "He weighed them", "Packed"], answer: 1,
      why: "*Pesar* + a thing is putting it on the scale." },
    { q: "What happened to his phone?", es: "Se me descargó el celular.",
      options: ["He downloaded an app", "He lost it", "The battery died"], answer: 2,
      why: "*Se me descargó*: the phone ran flat, and it happened to him." },
    { q: "What does Mom want first?", es: "Descarguen primero las camas, por favor.",
      options: ["Load the beds on", "Unload the beds", "Sell"], answer: 1,
      why: "*Descargar* takes things off the truck; *cargar* puts them on." },
    { q: "Who does *me peso* weigh?", es: "Me peso todos los lunes por la mañana.",
      options: ["Her baby boy", "Herself", "Fruit"], answer: 1,
      why: "*Pesarse* with *me* is weighing yourself." },
    { q: "Which weight goes in a contract?", es: "El peso exacto del paquete es 4,3 kilos.",
      options: ["The exact one", "The rough guess", "Neither"], answer: 0,
      why: "*El peso exacto* is the scale's figure; *el aproximado* is a working guess." }
  ],
  yourTurn: [
    { en: "How much does the suitcase weigh?", es: "¿Cuánto pesa la maleta?", accept: [] },
    { en: "I weigh myself once a week.", es: "Me peso una vez a la semana.", accept: ["Me peso una vez por semana."] },
    { en: "My phone died.", es: "Se me descargó el celular.", accept: [] },
    { en: "It took them two hours to unload the truck.", es: "Se demoraron dos horas en descargar el camión.", accept: ["Se demoraron dos horas descargando el camión.", "Tardaron dos horas en descargar el camión."] },
    { en: "The box weighs twenty kilos.", es: "La caja pesa veinte kilos.", accept: [] }
  ],
  translate: [
    { en: "The ship carries thousands of tonnes of grain.", es: "El barco transporta miles de toneladas de grano.", accept: ["El barco [transporta|lleva] miles de toneladas de grano."] },
    { en: "What is the approximate weight of the parcel?", es: "¿Cuál es el peso aproximado del paquete?", accept: [] },
    { en: "Each truck carries a full load of wood.", es: "Cada camión lleva una carga completa de madera.", accept: [] },
    { en: "I need to charge my phone.", es: "Necesito cargar el celular.", accept: ["Tengo que cargar el celular.", "Necesito cargar mi celular."] },
    { en: "The suitcase weighs 26 kilos. The limit is 23. So I took out the shoes and weighed it again.", es: "La maleta pesa 26 kilos. El límite es de 23. Así que saqué los zapatos y la pesé otra vez.", accept: ["La maleta pesa 26 kilos. El límite es [de 23|23]. Así que saqué los zapatos y la [pesé otra vez|volví a pesar|pesé de nuevo]."] },
    { en: "Download the app before the trip. (to a friend)", es: "Descarga la aplicación antes del viaje.", accept: ["Descárgate la aplicación antes del viaje.", "Descarga la app antes del viaje."] }
  ],
  register: [
    { es: "Eso pesa una tonelada.", en: "That weighs a ton.", when: "anywhere, complaining about something heavy" },
    { es: "¿Me ayudas a cargar esto?", en: "Can you help me carry this?", when: "in Colombia, asking a friend for a hand" },
    { es: "El equipaje no debe superar los 23 kilos.", en: "Luggage must not exceed 23 kilos.", when: "on an airline website or ticket" },
    { es: "Peso neto: 500 gramos.", en: "Net weight: 500 grams.", when: "on a food label" }
  ],
  personal: {
    prompt: "Describe a move, a trip or a delivery: what weighed what, what you weighed, and what you loaded, unloaded or charged.",
    constraints: [
      { type: "regex", pattern: "pes(a|an|aba|aban|ó|o) (como |unos |unas |casi |más de |menos de )?[0-9a-záéíóúñ]+ (kilos|gramos|toneladas|libras)", label: "what it weighs: *pesa veinte kilos*" },
      { type: "regex", pattern: "(me|te|se|nos) pes(o|as|a|amos|an|é|ó)|pes(é|amos|aron|ó) (el|la|los|las)", label: "weighing: *me peso* or *pesé la maleta*" },
      { type: "regex", pattern: "(des)?carg", label: "loading or charging: *cargar* or *descargar*" }
    ],
    model: "Cuando me mudé a Cali, el camión llevaba una carga de casi una tonelada. Mi escritorio pesaba unos cuarenta kilos. Pesé las cajas en la báscula del edificio. Al final, se me descargó el celular y no pude llamar a nadie."
  },
  pitfalls: [
    "*Es veinte kilos* isn't Spanish for weight: *pesa veinte kilos*.",
    "*Peso cada lunes* weighs something else; for yourself, *me peso*.",
    "In Colombia *el almacén* is a shop; a warehouse is *la bodega*."
  ]
},

"nt-humedad-sequedad-b2": {
  source: "merged",
  hook: {
    line: "A travel blogger compares two Colombias: rainy Bogotá, where she got soaked yesterday, and dry La Guajira, where water vanishes as soon as it falls.",
    es: "En Bogotá el clima es húmedo casi todo el año, y por la tarde casi siempre llueve.\nAyer salí sin paraguas y llegué a la oficina empapada.\nLos zapatos todavía están mojados, y la chaqueta de cuero la tengo que llevar a lavar en seco.\nEn cambio, en La Guajira hay sequía: no llueve desde hace ocho meses.\nAllá el agua se evapora apenas cae, y hay que tomar mucha para no deshidratarse.",
    en: "In Bogotá the climate is humid almost all year, and in the afternoon it almost always rains.\nYesterday I went out without an umbrella and got to the office soaked.\nMy shoes are still wet, and I have to take the leather jacket to be dry-cleaned.\nIn La Guajira, on the other hand, there's a drought: it hasn't rained for eight months.\nThere, water evaporates as soon as it falls, and you have to drink a lot so as not to get dehydrated."
  },
  examples: [
    { es: "La toalla de microfibra absorbe muy bien el agua y se seca en menos de una hora.", en: "The microfibre towel absorbs water very well and dries in under an hour." },
    { es: "El río se desbordó con las lluvias de abril e inundó las casas más cercanas a la orilla.", en: "The river overflowed with the April rains and flooded the houses nearest the bank." },
    { es: "Humedece un poco la tela antes de plancharla, pero no la empapes, porque se mancha.", en: "Dampen the fabric a little before ironing it, but don't soak it, because it stains." }
  ],
  rule: "From least to most water: *húmedo* (damp, humid), *mojado* (wet), *empapado* (soaked through), *inundado* (flooded).\n*Húmedo* is a lasting condition, so *ser* for a climate: *el clima es húmedo*. *Mojado* is wet right now, so *estar*: *los zapatos están mojados*. They agree: *mojada*, *empapados*.\nThe verbs follow the scale: *humedecer* (dampen), *mojar*, *empapar*, *inundar*. *Absorber* takes water in; *evaporarse* makes it vanish; *secarse* dries.\nThe body: *sudar*, more formally *transpirar*; *hidratarse*, *deshidratarse*.\nNo rain for months is *una sequía*.\n*En seco* is a method without water: *lavar en seco*, dry-clean.",
  readAndPick: [
    { q: "What is Bogotá's climate like?", es: "En Bogotá el clima es húmedo casi todo el año.",
      options: ["Humid", "Dry", "Freezing"], answer: 0,
      why: "*Húmedo* with *ser* is a lasting condition of the climate." },
    { q: "How wet did she get?", es: "Llegué a la oficina empapada.",
      options: ["Just a little damp", "Soaked through", "Dry"], answer: 1,
      why: "*Empapada* is soaked through, the top of the scale before flooded." },
    { q: "Why *están* with *mojados*?", es: "Los zapatos todavía están mojados.",
      options: ["It's what shoes are like", "Habit", "Wet for now"], answer: 2,
      why: "*Mojado* is wet right now, a passing state, so *estar*." },
    { q: "What does *lavar en seco* mean?", es: "La chaqueta la tengo que llevar a lavar en seco.",
      options: ["Clean it with no water", "Wash it in very hot water", "Dry"], answer: 0,
      why: "*En seco* is a method without water: dry-cleaning." },
    { q: "What's the problem in La Guajira?", es: "En La Guajira hay sequía: no llueve desde hace ocho meses.",
      options: ["Floods", "A long drought", "Too much humidity in the air"], answer: 1,
      why: "*Una sequía* is a long stretch with no rain." },
    { q: "What should you do to the fabric?", es: "Humedece un poco la tela, pero no la empapes.",
      options: ["Dampen it lightly", "Soak it fully in water", "Burn"], answer: 0,
      why: "*Humedecer* is a light dampening; *empapar* would soak it." }
  ],
  yourTurn: [
    { en: "The clothes were completely soaked.", es: "La ropa estaba completamente empapada.", accept: [] },
    { en: "The climate is humid.", es: "El clima es húmedo.", accept: [] },
    { en: "My shoes are wet.", es: "Tengo los zapatos mojados.", accept: ["Mis zapatos están mojados."] },
    { en: "This towel absorbs water very well.", es: "Esta toalla absorbe muy bien el agua.", accept: ["Esta toalla absorbe el agua muy bien."] },
    { en: "It needs to be dry-cleaned.", es: "Hay que lavarlo en seco.", accept: ["Hay que [lavarlo|llevarlo a lavar] en seco."] }
  ],
  translate: [
    { en: "The water evaporated quickly in this heat.", es: "El agua se evaporó rápido con este calor.", accept: ["El agua se evaporó rápidamente con este calor."] },
    { en: "Skin perspires to regulate body temperature.", es: "La piel transpira para regular la temperatura del cuerpo.", accept: ["La piel transpira para regular la temperatura corporal."] },
    { en: "Drink water so you don't get dehydrated. (to a friend)", es: "Toma agua para no deshidratarte.", accept: ["Bebe agua para no deshidratarte."] },
    { en: "Sweat soaked his shirt.", es: "El sudor le empapó la camisa.", accept: ["El sudor le empapaba la camisa."] },
    { en: "Yesterday I went out without an umbrella. I got home soaked. Today my shoes are still wet.", es: "Ayer salí sin paraguas. Llegué a la casa empapado. Hoy los zapatos todavía están mojados.", accept: ["Ayer salí sin [paraguas|sombrilla]. Llegué a [la casa|casa] [empapado|empapada]. Hoy [los zapatos|mis zapatos] todavía están mojados."] },
    { en: "The river overflowed and flooded the town.", es: "El río se desbordó e inundó el pueblo.", accept: [] }
  ],
  register: [
    { es: "¡Quedé ensopada!", en: "I got drenched!", when: "in Colombia, telling friends about a downpour" },
    { es: "Estoy mojada de la lluvia.", en: "I'm wet from the rain.", when: "anywhere, said plainly" },
    { es: "Lavar en seco. No usar secadora.", en: "Dry-clean only. Do not tumble dry.", when: "on a clothing label" },
    { es: "La región atraviesa una sequía prolongada.", en: "The region is going through a prolonged drought.", when: "in the news or a weather report" }
  ],
  personal: {
    prompt: "Describe a day when the weather caught you out, too wet or too dry: how wet you got, what stayed damp or wet, and what dried or soaked it up.",
    constraints: [
      { type: "containsAny", words: ["empapado", "empapada", "ensopado", "ensopada", "mojado", "mojada", "mojados", "mojadas", "húmedo", "húmeda"], label: "a degree of wet: *mojado* or *empapado*" },
      { type: "regex", pattern: "(est(oy|aba|á|án|aban)|qued(é|ó|aron|amos)|lleg(ué|ó|amos)( a [a-záéíóúñ ]+)?) (empapad|mojad|ensopad|sec)", label: "how you ended up: *llegué empapada* or *quedaron mojados*" },
      { type: "containsAny", words: ["se evapor", "absorb", "secar", "se secó", "se secaron", "lavar en seco", "sequía", "hidrat"], label: "what the water did: *se secó* or *absorbe*" }
    ],
    model: "El sábado fuimos a caminar en el páramo y nos cayó un aguacero. Llegué al carro empapada. Los zapatos quedaron mojados por dos días, aunque los puse a secar al sol."
  },
  pitfalls: [
    "*Estoy húmedo* sounds like a damp wall: after the rain, *estoy mojado*.",
    "*El clima está húmedo* is today; for the climate in general, *es húmedo*.",
    "*Limpieza en seco* is Spain's label; in Colombia, *lavado en seco*."
  ]
},

"nt-color-b2": {
  source: "merged",
  hook: {
    line: "An online clothes shop confirms an order, and the customer writes back: the blue isn't the blue she ordered. Every line names a colour exactly.",
    es: "Pedido 4512: dos camisas azul marino, talla M.\nUn saco verde oliva y unos pantalones gris oscuro.\nNota de la clienta: las camisas que llegaron son azules, pero de un azul claro, no marino.\nRespuesta: Disculpe. Hoy le enviamos las de color azul marino, sin costo.\nY si prefiere un tono más alegre, también las tenemos en rojo vino.",
    en: "Order 4512: two navy blue shirts, size M.\nAn olive green sweater and a pair of dark grey trousers.\nCustomer's note: the shirts that arrived are blue, but a light blue, not navy.\nReply: We apologise. Today we're sending you the navy blue ones, at no cost.\nAnd if you'd like a brighter shade, we also have them in wine red."
  },
  examples: [
    { es: "Pintaron las paredes de la sala de un tono gris perla, y los marcos de blanco mate.", en: "They painted the living room walls a pearl grey shade, and the frames matte white." },
    { es: "Mi abuela se tiñó el pelo de rojo a los setenta, y nadie lo podía creer.", en: "My grandmother dyed her hair red at seventy, and nobody could believe it." },
    { es: "Esa película de los años cuarenta está en blanco y negro, pero la versión nueva es en color.", en: "That film from the forties is in black and white, but the new version is in colour." }
  ],
  rule: "A plain colour agrees like any describing word: *cortinas verdes*, *camisas azules*.\nA shade made of two words stays fixed, whatever it describes: *camisas azul marino*, *paredes verde claro*, *pantalones gris oscuro*, *un saco verde oliva*. Never *azules marinas*.\nTo state a colour plainly: *es de color naranja*, *las de color azul*. The same frame gives size and shape: *es de tamaño grande*.\nColour as character: *un color alegre* or *triste*, *cálido* or *frío*, and the finish, *mate* or *brillante*.\n*Teñir* is to dye: *se tiñó el pelo de rojo*. *Colorear* is colouring in a drawing.\nPhotos and films: *en color* or *en blanco y negro*.",
  readAndPick: [
    { q: "Why *azul marino* and not *azules marinas*?", es: "Dos camisas azul marino, talla M.",
      options: ["It's a mistake", "Two-word shades never change", "Shirts never agree with colours at all"], answer: 1,
      why: "A shade made of two words stays fixed, whatever it describes." },
    { q: "What went wrong with the order?", es: "Son azules, pero de un azul claro, no marino.",
      options: ["The wrong shade", "The wrong size", "They didn't come"], answer: 0,
      why: "*Azul claro* is light blue; she ordered *azul marino*, navy." },
    { q: "What colour are the trousers?", es: "Unos pantalones gris oscuro.",
      options: ["Light grey", "Black", "Dark grey"], answer: 2,
      why: "*Gris oscuro* is dark grey, and it stays fixed with *pantalones*." },
    { q: "What did the grandmother do?", es: "Mi abuela se tiñó el pelo de rojo a los setenta.",
      options: ["Dyed her hair red", "Cut her hair", "Painted a picture red"], answer: 0,
      why: "*Teñirse el pelo* is to dye your hair." },
    { q: "What's the old film like?", es: "Esa película de los años cuarenta está en blanco y negro.",
      options: ["In bright colour", "Black and white", "Grey"], answer: 1,
      why: "*En blanco y negro* is black and white; colour film is *en color*." },
    { q: "How are the frames painted?", es: "Pintaron los marcos de blanco mate.",
      options: ["Matte white", "Glossy white", "White"], answer: 0,
      why: "*Mate* has no shine; *brillante* would be glossy." }
  ],
  yourTurn: [
    { en: "It's orange in colour.", es: "Es de color naranja.", accept: [] },
    { en: "She was wearing navy blue shoes.", es: "Llevaba unos zapatos azul marino.", accept: ["Tenía puestos unos zapatos azul marino.", "Llevaba puestos unos zapatos azul marino."] },
    { en: "Olive green curtains.", es: "Unas cortinas verde oliva.", accept: ["Cortinas verde oliva."] },
    { en: "She dyed her hair blonde.", es: "Se tiñó el pelo de rubio.", accept: ["Se pintó el pelo de [rubio|mono]."] },
    { en: "I prefer warm colours for the living room.", es: "Prefiero los colores cálidos para la sala.", accept: [] }
  ],
  translate: [
    { en: "The walls are light green.", es: "Las paredes son verde claro.", accept: ["Las paredes son de color verde claro."] },
    { en: "That old film is in black and white.", es: "Esa película vieja está en blanco y negro.", accept: ["Esa película [vieja|antigua] [está|es] en blanco y negro."] },
    { en: "It's a matte colour, not a shiny one.", es: "Es un color mate, no brillante.", accept: [] },
    { en: "These two shades go well together.", es: "Estos dos tonos combinan bien.", accept: ["Estos dos tonos combinan bien entre sí."] },
    { en: "I ordered two navy blue shirts. The ones that arrived are light blue. I'm sending them back today.", es: "Pedí dos camisas azul marino. Las que llegaron son azul claro. Hoy las devuelvo.", accept: ["Pedí dos camisas azul marino. Las que llegaron son [azul claro|de color azul claro]. [Hoy las devuelvo|Las voy a devolver hoy]."] },
    { en: "The children coloured in the drawing.", es: "Los niños colorearon el dibujo.", accept: [] }
  ],
  register: [
    { es: "¡Qué color tan bonito!", en: "What a lovely colour!", when: "anywhere, warm praise" },
    { es: "Es como un verde clarito.", en: "It's sort of a pale green.", when: "chatting, when you can't name the shade" },
    { es: "Disponible en azul marino y gris perla.", en: "Available in navy blue and pearl grey.", when: "in a catalogue or an online shop" },
    { es: "Tonalidad: blanco hueso, acabado mate.", en: "Shade: bone white, matte finish.", when: "on a paint tin or a technical sheet" }
  ],
  personal: {
    prompt: "Describe an outfit or a room you like, naming at least one two-word shade, one colour stated with *de color*, and one colour by its character: warm, cold, cheerful or sad.",
    constraints: [
      { type: "regex", pattern: "(azul|verde|gris|rojo|rosado|amarillo|morado|café|blanco|negro) (marino|claro|oscuro|oliva|limón|perla|vino|cielo|pastel|hueso|petróleo|militar|turquesa|mate)", label: "a two-word shade: *azul marino* or *verde oliva*" },
      { type: "regex", pattern: "(cálid|frí|alegre|trist|brillante|mate|vivo|apagad)", label: "colour as character: *cálido*, *alegre* or *mate*" },
      { type: "containsAny", words: ["de color"], label: "a colour stated plainly: *es de color...*" }
    ],
    model: "Mi cuarto tiene las paredes verde claro y una cortina azul marino. La cobija es de color naranja, un color alegre y cálido. El escritorio es blanco mate."
  },
  pitfalls: [
    "*Camisas azules marinas* agrees a shade that never changes: *camisas azul marino*.",
    "*Teñir* is to dye; for colouring in, *colorear*.",
    "*El salón* is Spain's living room; in Colombia, *la sala*."
  ]
},

"nt-limpieza-b2": {
  source: "merged",
  hook: {
    line: "A note left on the fridge for a flatmate. It names a stain, how dirty the kitchen got, who got dirty, and the cleaning that has to happen this weekend.",
    es: "Querido Andrés: la cocina estaba asquerosa cuando llegué.\nHabía una mancha de café en el mesón y el piso estaba lleno de barro.\nYa sé que te manchaste la camisa con salsa, pero no la dejes en el lavaplatos.\nEste fin de semana toca limpiar el apartamento a fondo, entre los dos.\nY la chaqueta de cuero no se lava en la lavadora: solo se puede lavar en seco.",
    en: "Dear Andrés: the kitchen was disgusting when I got home.\nThere was a coffee stain on the counter and the floor was covered in mud.\nI know you got sauce on your shirt, but don't leave it in the sink.\nThis weekend we have to give the flat a thorough clean, the two of us.\nAnd the leather jacket doesn't go in the washing machine: it can only be dry-cleaned."
  },
  examples: [
    { es: "Me manché la camisa de café justo antes de la entrevista, y tuve que comprar otra.", en: "I got coffee on my shirt just before the interview, and had to buy another." },
    { es: "Los niños se ensuciaron las manos jugando en el parque, así que los mandé derecho al baño.", en: "The kids got their hands dirty playing in the park, so I sent them straight to the bathroom." },
    { es: "Quitar esa mancha de vino tinto del mantel no va a ser fácil, aunque usemos bicarbonato.", en: "Getting that red wine stain out of the tablecloth won't be easy, even if we use baking soda." }
  ],
  rule: "*La suciedad* is dirt in general; *una mancha* is one stain: *una mancha de café*.\nWhen the stain lands on you or your own clothes, use *me*, and no *mi*: *Me manché la camisa de café.* Pattern: *me manché* + the item + *de* or *con* + the stuff. Same with *ensuciarse*: *se ensució las manos*.\nFor something not on you, plain *manchar*: *Manché el mantel con vino.*\nHow dirty: *un poco sucio*, *sucio*, and the strong *asqueroso*, kept for real filth.\nHow thoroughly: *limpiar a fondo* or *en profundidad*, *por completo*. Clothes that can't take water: *lavar en seco*.\nTo remove a stain: *quitar* or *sacar una mancha*.",
  readAndPick: [
    { q: "How bad was the kitchen?", es: "La cocina estaba asquerosa cuando llegué.",
      options: ["A little untidy, no more", "Truly disgusting", "Spotless"], answer: 1,
      why: "*Asqueroso* is the strong end of the scale: real filth." },
    { q: "Whose shirt is it?", es: "Te manchaste la camisa con salsa.",
      options: ["Andrés's own", "A friend's", "The flatmate's"], answer: 0,
      why: "*Te manchaste la camisa*: the stain landed on his own shirt." },
    { q: "What kind of clean is planned?", es: "Toca limpiar el apartamento a fondo.",
      options: ["A quick tidy", "A full repaint of every wall", "A thorough one"], answer: 2,
      why: "*A fondo* is thoroughly, every corner." },
    { q: "How should the jacket be cleaned?", es: "Solo se puede lavar en seco.",
      options: ["Without water", "In the machine", "By hand"], answer: 0,
      why: "*Lavar en seco* is dry-cleaning, with no water." },
    { q: "Where was the coffee stain?", es: "Había una mancha de café en el mesón.",
      options: ["On his white shirt", "On the counter", "Floor"], answer: 1,
      why: "*El mesón* is the kitchen counter in Colombia." },
    { q: "Why *me manché* and not *manché mi*?", es: "Me manché la camisa de café.",
      options: ["It's simply more polite", "It landed on me", "Past"], answer: 1,
      why: "When the stain lands on you or your clothes, Spanish uses *me* and drops *mi*." }
  ],
  yourTurn: [
    { en: "I got coffee on my shirt.", es: "Me manché la camisa de café.", accept: ["Me manché la camisa con café."] },
    { en: "He has a coffee stain on his shirt.", es: "Tiene una mancha de café en la camisa.", accept: [] },
    { en: "We need to give the kitchen a thorough clean this weekend.", es: "Hay que limpiar la cocina a fondo este fin de semana.", accept: ["Hay que limpiar a fondo la cocina este fin de semana.", "Este fin de semana [hay que|toca] limpiar la cocina a fondo."] },
    { en: "The bathroom was disgusting.", es: "El baño estaba asqueroso.", accept: [] },
    { en: "I stained the tablecloth with wine.", es: "Manché el mantel con vino.", accept: ["Manché el mantel de vino."] }
  ],
  translate: [
    { en: "He got his trousers dirty playing in the mud.", es: "Se ensució los pantalones jugando en el barro.", accept: ["Se [ensució|manchó] los pantalones jugando en el barro."] },
    { en: "Getting that red wine stain out won't be easy.", es: "Quitar esa mancha de vino tinto no va a ser fácil.", accept: ["[Quitar|Sacar] esa mancha de vino tinto no va a ser fácil."] },
    { en: "This coat can only be dry-cleaned.", es: "Este abrigo solo se puede lavar en seco.", accept: [] },
    { en: "The cleaning staff come by every night.", es: "El personal de aseo pasa todas las noches.", accept: ["El personal de [aseo|limpieza] pasa [todas las noches|cada noche]."] },
    { en: "The kitchen was dirty. There was a stain on the counter. So we gave the whole flat a thorough clean.", es: "La cocina estaba sucia. Había una mancha en el mesón. Así que limpiamos todo el apartamento a fondo.", accept: ["La cocina estaba sucia. Había una mancha en el mesón. Así que limpiamos [todo el apartamento a fondo|a fondo todo el apartamento]."] },
    { en: "The kids got their hands dirty.", es: "Los niños se ensuciaron las manos.", accept: [] }
  ],
  register: [
    { es: "¡Qué cochinada!", en: "How gross!", when: "in Colombia, with friends, about real filth" },
    { es: "Está un poco sucio.", en: "It's a bit dirty.", when: "anywhere, a mild complaint" },
    { es: "Se ruega mantener limpias las zonas comunes.", en: "Please keep the common areas clean.", when: "on a notice in a building" },
    { es: "Se requiere una limpieza a fondo de las instalaciones.", en: "A thorough cleaning of the premises is required.", when: "in an inspection report" }
  ],
  personal: {
    prompt: "Write a note to someone you live with about a mess: a stain, how dirty it got, who got dirty, and what cleaning has to happen.",
    constraints: [
      { type: "containsAny", words: ["mancha", "manchas"], label: "a stain: *una mancha de café*" },
      { type: "regex", pattern: "(me|te|se|nos) (manch|ensuci)", label: "it landed on someone: *me manché* or *se ensució*" },
      { type: "containsAny", words: ["a fondo", "en profundidad", "por completo", "en seco"], label: "how thoroughly: *a fondo* or *en seco*" }
    ],
    model: "Mateo: el sofá tiene una mancha de chocolate enorme. Ya sé que te manchaste la camiseta también. El sábado toca limpiar la sala a fondo, y el cojín hay que lavarlo en seco."
  },
  pitfalls: [
    "*Manché mi camisa* sounds as if the shirt were someone else's business: *me manché la camisa*.",
    "*Asqueroso* is for real filth; for a little mess, *un poco sucio*.",
    "In Colombia *el piso* is the floor; a flat is *el apartamento*."
  ]
},

"gn-descriptiva-objetos-b2": {
  source: "merged",
  hook: {
    line: "An encyclopedia entry describes the sombrero vueltiao in three steps: what it is, what it's made of and how it's built, and how it compares, with its origin added because the text is formal.",
    es: "El sombrero vueltiao es uno de los símbolos culturales de Colombia.\nEstá hecho de una fibra vegetal, la caña flecha, que se trenza a mano.\nEstá compuesto por la copa, que es alta y redonda, y el ala, ancha y plana.\nSu valor depende del número de vueltas: los hay de quince, diecinueve y hasta veintiuna.\nA diferencia del sombrero de paja común, es flexible y se puede doblar sin que se dañe.\nSu origen está en el pueblo zenú, en la región del Caribe.",
    en: "The sombrero vueltiao is one of Colombia's cultural symbols.\nIt's made of a plant fibre, caña flecha, which is braided by hand.\nIt's made up of the crown, which is tall and round, and the brim, wide and flat.\nIts value depends on the number of turns: there are ones with fifteen, nineteen and even twenty-one.\nUnlike the ordinary straw hat, it's flexible and can be folded without being damaged.\nIt originated with the Zenú people, in the Caribbean region."
  },
  examples: [
    { es: "El tomate es una fruta originaria de América, y su nombre viene de la palabra náhuatl tomatl.", en: "The tomato is a fruit native to the Americas, and its name comes from the Nahuatl word tomatl." },
    { es: "Está compuesto por tres partes: la piel, la pulpa y las semillas, que están en el centro.", en: "It's made up of three parts: the skin, the flesh and the seeds, which are in the middle." },
    { es: "En comparación con el modelo anterior, este celular pesa menos y la batería dura casi el doble.", en: "Compared with the previous model, this phone weighs less and the battery lasts almost twice as long." }
  ],
  rule: "Describing an object takes three steps.\nAnchor it: say what it is. *El sombrero vueltiao es un símbolo de Colombia.*\nTake it apart: material and parts. *Está hecho de una fibra vegetal.* *Está compuesto por la copa y el ala.* Then each part, with precise describing words.\nRelate it to others: kinds and comparisons. *Los hay de quince y de veintiuna vueltas.* *A diferencia de* for opposites, *en comparación con* for more or less.\nA formal text can add a pure fact a personal one skips: the origin or the history of the name. *Su origen está en...* *Su nombre viene de...*\nA personal description anchors it in a story instead.",
  readAndPick: [
    { q: "Which step is this?", es: "El sombrero vueltiao es uno de los símbolos culturales de Colombia.",
      options: ["Saying what it is", "Listing every part in detail", "A comparison"], answer: 0,
      why: "The anchor comes first: it tells the reader what the thing is." },
    { q: "What is the hat made of?", es: "Está hecho de una fibra vegetal, la caña flecha.",
      options: ["Plastic and wire", "A plant fibre", "Leather"], answer: 1,
      why: "*Está hecho de* gives the material: caña flecha, a plant fibre." },
    { q: "What does *a diferencia de* set up?", es: "A diferencia del sombrero de paja común, es flexible.",
      options: ["A list of parts", "Its price", "A contrast"], answer: 2,
      why: "*A diferencia de* sets two things against each other as opposites." },
    { q: "What decides the hat's value?", es: "Su valor depende del número de vueltas.",
      options: ["The number of turns", "Its colour", "Who wore it first, long ago"], answer: 0,
      why: "*Depende del número de vueltas*: more turns, more value." },
    { q: "Where would you read *su origen está en el pueblo zenú*?", es: "Su origen está en el pueblo zenú, en la región del Caribe.",
      options: ["A quick text to a friend", "A formal description", "A list"], answer: 1,
      why: "Origin and history are the facts a formal description adds." },
    { q: "What does *en comparación con* measure?", es: "En comparación con el modelo anterior, este pesa menos.",
      options: ["More or less", "Total opposites", "Nothing"], answer: 0,
      why: "*En comparación con* measures more or less; for opposites, *a diferencia de*." }
  ],
  yourTurn: [
    { en: "It's made up of three parts.", es: "Está compuesto por tres partes.", accept: ["Está formado por tres partes.", "Tiene tres partes."] },
    { en: "It's made of a plant fibre.", es: "Está hecho de una fibra vegetal.", accept: ["Es de una fibra vegetal."] },
    { en: "Unlike the old model, this one is flexible.", es: "A diferencia del modelo anterior, este es flexible.", accept: ["A diferencia del modelo [anterior|viejo], este es flexible."] },
    { en: "Its name comes from the Nahuatl word tomatl.", es: "Su nombre viene de la palabra náhuatl tomatl.", accept: ["Su nombre [viene|proviene] de la palabra náhuatl tomatl."] }
  ],
  translate: [
    { en: "The tomato is a plant native to the Andes.", es: "El tomate es una planta nativa de los Andes.", accept: ["El tomate es una planta [nativa|originaria] de los Andes."] },
    { en: "It can be eaten with its skin or without it.", es: "Se puede comer con la piel o sin ella.", accept: ["Se puede comer con cáscara o sin ella.", "Se puede comer con su piel o sin ella."] },
    { en: "Compared with yesterday, today is much colder.", es: "En comparación con ayer, hoy hace mucho más frío.", accept: [] },
    { en: "There are hats with fifteen, nineteen and twenty-one turns.", es: "Hay sombreros de quince, diecinueve y veintiuna vueltas.", accept: [] },
    { en: "The sombrero vueltiao is a symbol of Colombia. It's made of a plant fibre. Unlike other hats, it can be folded without damaging it.", es: "El sombrero vueltiao es un símbolo de Colombia. Está hecho de una fibra vegetal. A diferencia de otros sombreros, se puede doblar sin dañarlo.", accept: ["El sombrero vueltiao es un símbolo de Colombia. Está hecho de una fibra vegetal. A diferencia de otros sombreros, se puede doblar sin [dañarlo|que se dañe]."] },
    { en: "If I had to paint a tomato, I would draw a red heart.", es: "Si tuviera que pintar un tomate, dibujaría un corazón rojo.", accept: [] }
  ],
  register: [
    { es: "Es como un sombrero de playa, pero más bonito.", en: "It's like a beach hat, but nicer.", when: "describing it to a friend" },
    { es: "Es un sombrero típico de la costa.", en: "It's a typical hat from the coast.", when: "anywhere, a plain description" },
    { es: "La pieza está elaborada en caña flecha.", en: "The piece is crafted from caña flecha.", when: "on a museum label or a craft certificate" },
    { es: "El término proviene de la lengua zenú.", en: "The term comes from the Zenú language.", when: "in an encyclopedia or a formal text" }
  ],
  personal: {
    prompt: "Describe a typical object from your country or region for someone who has never seen it: what it is, what it's made of and its parts, how it compares, and where it comes from.",
    constraints: [
      { type: "regex", pattern: "(es|son) (un|una|el|la|uno|una de)\\b", label: "the anchor: what it is" },
      { type: "regex", pattern: "(hech|compuest|formad|fabricad)[oa]s? (de|por|con)|es de [a-záéíóúñ]+|tiene (dos|tres|cuatro) partes", label: "material and parts: *está hecho de* or *está compuesto por*" },
      { type: "containsAny", words: ["a diferencia de", "en comparación con", "comparado con", "más que", "menos que"], label: "a comparison: *a diferencia de* or *en comparación con*" },
      { type: "containsAny", words: ["origen", "viene de", "proviene de", "procede de", "nació en"], label: "where it comes from: *su origen está en*" }
    ],
    model: "La ruana es una prenda típica de Boyacá. Está hecha de lana de oveja y tiene forma rectangular, con una abertura en el centro para la cabeza. A diferencia de una chaqueta, no tiene mangas. Su origen está en las mantas que usaban los campesinos para protegerse del frío."
  },
  pitfalls: [
    "Listing parts with no anchor leaves the reader lost: say first what it is.",
    "Origin and the history of the name suit a formal text; in a personal one they sound like a lecture.",
    "*A diferencia de* is for opposites; to measure more or less, *en comparación con*."
  ]
},

"nt-visibilidad-vision-b2": {
  source: "merged",
  hook: {
    line: "A neighbour gives a statement to the police about something she saw from her window at night. She is careful to say what she saw, what she only just made out, and what was only a first impression.",
    es: "Desde mi ventana se ve la calle de lejos, pero de noche no se distingue mucho.\nA primera vista, pensé que eran dos vecinos discutiendo.\nNo alcancé a ver la cara del hombre, porque llevaba gorra.\nSí alcancé a distinguir el color de la moto: era roja.\nA simple vista no se notaba ningún daño en el carro, pero después vi el vidrio roto.",
    en: "From my window you can see the street from far off, but at night you can't make out much.\nAt first sight, I thought it was two neighbours arguing.\nI didn't manage to see the man's face, because he was wearing a cap.\nI did manage to make out the colour of the motorbike: it was red.\nTo the naked eye there was no damage to the car, but later I saw the broken glass."
  },
  examples: [
    { es: "Mi mamá no ve bien de cerca, así que siempre me pide que le lea los mensajes.", en: "My mom can't see well close up, so she always asks me to read her messages to her." },
    { es: "A primera vista parece un apartamento pequeño, pero tiene tres cuartos y un balcón enorme.", en: "At first sight it looks like a small flat, but it has three bedrooms and a huge balcony." },
    { es: "Desde aquí no distingo si es mi hermano o su amigo, porque los dos están de negro.", en: "From here I can't tell whether it's my brother or his friend, because they're both in black." }
  ],
  rule: "*Ver* is just seeing. *Distinguir* claims more: telling one thing from another. *No distingo si es él.*\n*Alcanzar a* + *ver*, *leer* or *distinguir* is just managing to: *alcancé a ver la moto*, *no alcancé a ver la cara*.\n*A primera vista* is a first impression you haven't checked, and it sets up a *pero*: *A primera vista parece pequeño, pero...* Use *parece*, not *es*.\n*A simple vista* is with the naked eye: *a simple vista no se nota*.\nWhat can be seen from a place takes *se*: *La torre se ve de lejos.* *De cerca* is close up.\n*La vista* is eyesight: *tengo buena vista*. *Ciego* is blind.",
  readAndPick: [
    { q: "Could the witness see the man's face?", es: "No alcancé a ver la cara del hombre.",
      options: ["Yes, clearly", "No, not quite", "Only in a photo"], answer: 1,
      why: "*No alcancé a ver* is she didn't quite manage to see it." },
    { q: "How sure was her first impression?", es: "A primera vista, pensé que eran dos vecinos discutiendo.",
      options: ["Checked and fully certain", "Photo", "A quick guess"], answer: 2,
      why: "*A primera vista* is an impression she hadn't checked yet." },
    { q: "What does *distinguir* claim?", es: "Sí alcancé a distinguir el color de la moto.",
      options: ["She told it apart", "A blurry glimpse, no more", "Nothing"], answer: 0,
      why: "*Distinguir* claims more than *ver*: she could tell the colour." },
    { q: "Could you see the damage easily?", es: "A simple vista no se notaba ningún daño en el carro.",
      options: ["Not with the naked eye", "Yes, straight away", "Only from far away, in the dark"], answer: 0,
      why: "*A simple vista* is with the naked eye, without a close look." },
    { q: "What is Mom's problem?", es: "Mi mamá no ve bien de cerca.",
      options: ["Seeing far off", "Seeing close up", "Hearing her phone ring"], answer: 1,
      why: "*De cerca* is close up; far off would be *de lejos*." }
  ],
  yourTurn: [
    { en: "Fortunately I have good eyesight.", es: "Por suerte tengo buena vista.", accept: ["Afortunadamente tengo buena vista."] },
    { en: "From here I can't tell if it's him or not.", es: "Desde aquí no distingo si es él o no.", accept: ["Desde [aquí|acá] no distingo si es él o no.", "Desde [aquí|acá] no alcanzo a distinguir si es él o no."] },
    { en: "The tower can be seen from far away.", es: "La torre se ve de lejos.", accept: ["La torre se ve desde lejos."] },
    { en: "At first sight it looks new.", es: "A primera vista parece nuevo.", accept: ["A simple vista parece nuevo."] },
    { en: "I didn't manage to see his face.", es: "No alcancé a verle la cara.", accept: ["No alcancé a ver su cara."] }
  ],
  translate: [
    { en: "The darkness made it impossible to make anything out.", es: "La oscuridad no dejaba distinguir nada.", accept: [] },
    { en: "He noticed a small detail that everyone else had missed.", es: "Se fijó en un pequeño detalle que a los demás se les había escapado.", accept: [] },
    { en: "To the naked eye you can't tell the difference.", es: "A simple vista no se nota la diferencia.", accept: [] },
    { en: "He's been completely blind since birth.", es: "Es completamente ciego de nacimiento.", accept: ["Es ciego de nacimiento."] },
    { en: "At first sight it looks like a small flat. But up close, it has three bedrooms. And from the balcony you can see the hills.", es: "A primera vista parece un apartamento pequeño. Pero de cerca, tiene tres cuartos. Y desde el balcón se ven los cerros.", accept: ["A primera vista parece un apartamento pequeño. Pero de cerca, tiene tres [cuartos|habitaciones]. Y desde el balcón se ven [los cerros|las montañas]."] },
    { en: "I just managed to read the sign.", es: "Alcancé a leer el letrero.", accept: ["Alcancé a leer el aviso."] }
  ],
  register: [
    { es: "¡No veo ni papa!", en: "I can't see a thing!", when: "chatting, in the dark or without your glasses" },
    { es: "No alcanzo a ver desde aquí.", en: "I can't quite see from here.", when: "anywhere, at a show or in a classroom" },
    { es: "A primera vista, el proyecto parece viable.", en: "At first sight, the project seems viable.", when: "in a meeting, before the details" },
    { es: "El daño no es apreciable a simple vista.", en: "The damage is not visible to the naked eye.", when: "in an inspection or insurance report" }
  ],
  personal: {
    prompt: "You saw something happen from a distance: a crash, a lost dog, a delivery. Write what you could and couldn't make out, and what your first impression was.",
    constraints: [
      { type: "regex", pattern: "alcanc(é|e|ó|o|aron) a (ver|distinguir|leer|oír)|alcanz(o|a|an) a (ver|distinguir|leer)", label: "just managing: *alcancé a ver*" },
      { type: "containsAny", words: ["a primera vista", "a simple vista"], label: "a first impression: *a primera vista*" },
      { type: "regex", pattern: "distingu|se ve|se veía|de lejos|de cerca", label: "seeing at a distance: *se veía de lejos* or *no distinguí*" }
    ],
    model: "Desde el bus vi un choque en la Séptima. A primera vista parecía grave, pero después vi que nadie estaba herido. Alcancé a ver un taxi con el vidrio roto. No distinguí la placa, porque estaba muy lejos."
  },
  pitfalls: [
    "*A primera vista es nuevo* states a fact you haven't checked: *a primera vista parece nuevo*.",
    "*Vi* and *distinguí* aren't the same: *distinguir* claims you told them apart.",
    "*En la primera vista* adds words: *a primera vista*, no article."
  ]
},

"nt-audibilidad-audicion-b2": {
  source: "merged",
  hook: {
    line: "A phone call between two friends keeps breaking up. They talk about the line, a noise, the neighbours' music and a song that rings a bell.",
    es: "Aló, ¿Marta? No te oigo bien, se oye muy mal.\n¿Qué es ese ruido? ¿Sonó la alarma del edificio?\nNo, son los vecinos: ponen la música a todo volumen y hablan a gritos.\nAh, y esa canción me suena. ¿No es la de la novela?\nBueno, háblame más alto, o mejor te escribo, que así no te escucho.",
    en: "Hello, Marta? I can't hear you well, the line is really bad.\nWhat's that noise? Did the building alarm go off?\nNo, it's the neighbours: they play music at full blast and talk at the top of their voices.\nOh, and that song sounds familiar. Isn't it the one from the soap opera?\nOK, speak louder, or better, I'll text you, because I can't hear you like this."
  },
  examples: [
    { es: "De pronto sonó el timbre, y todos nos quedamos callados porque no esperábamos a nadie.", en: "Suddenly the doorbell rang, and we all went quiet because we weren't expecting anyone." },
    { es: "¿Le puedes bajar a la música, por favor? Mañana madrugo y no puedo dormir con ese ruido.", en: "Can you turn the music down, please? I'm up early tomorrow and I can't sleep with that noise." },
    { es: "Grabaron toda la entrevista en video, pero el sonido quedó tan bajo que casi no se oye.", en: "They recorded the whole interview on video, but the sound came out so low you can hardly hear it." }
  ],
  rule: "The thing making the noise is the subject of *sonar*: *sonó el timbre*, *suena el celular*. The listener *oye* or *escucha*: *oí el timbre*. *Me suena* is it rings a bell.\nHow well you hear: *no te oigo bien*; on the phone, *escuchar* is just as common. About the line or the place, add *se*: *se oye mal*, *aquí no se oye nada*.\nLoudness: *a gritos* (shouting), *a todo volumen* (full blast), *pegar un grito* (let out a shout). *En voz alta*, *en voz baja*; *más alto* is louder.\nTurning it down or up, the everyday Latin American way: *bajarle a la música*, *subirle al volumen*.\n*Sordo* can't hear; *mudo* can't speak, and *el cine mudo* is silent film.",
  readAndPick: [
    { q: "What's wrong with the call?", es: "No te oigo bien, se oye muy mal.",
      options: ["The line is bad", "She's shouting", "It's switched off"], answer: 0,
      why: "*Se oye mal* is about the line, not about either person." },
    { q: "Who or what made the noise?", es: "¿Sonó la alarma del edificio?",
      options: ["The neighbours", "The alarm", "Marta"], answer: 1,
      why: "The thing making the noise is the subject of *sonar*: the alarm." },
    { q: "How loud is the music?", es: "Ponen la música a todo volumen.",
      options: ["Soft, in the background", "Off", "At full blast"], answer: 2,
      why: "*A todo volumen* is full blast." },
    { q: "What does *me suena* mean here?", es: "Esa canción me suena.",
      options: ["It rings in her ear", "It sounds familiar", "It's too loud"], answer: 1,
      why: "*Me suena* is it rings a bell: she's heard it before." },
    { q: "What does the speaker want?", es: "¿Le puedes bajar a la música, por favor?",
      options: ["Less volume", "A new song", "More volume, please"], answer: 0,
      why: "*Bajarle a* is turning it down; up is *subirle a*." },
    { q: "Is there a problem with the video?", es: "El sonido quedó tan bajo que casi no se oye.",
      options: ["It's too loud", "There's no picture", "It's too quiet"], answer: 2,
      why: "*Casi no se oye*: the sound is too low to hear." }
  ],
  yourTurn: [
    { en: "Suddenly the doorbell rang.", es: "De pronto sonó el timbre.", accept: ["De repente sonó el timbre."] },
    { en: "I can't hear you well. (on the phone, to a friend)", es: "No te oigo bien.", accept: ["No te escucho bien."] },
    { en: "Can you turn the music down? (to a friend)", es: "¿Le puedes bajar a la música?", accept: ["¿Puedes bajarle a la música?", "¿Le bajas a la música?"] },
    { en: "My neighbours talk at the top of their voices all day.", es: "Mis vecinos hablan a gritos todo el día.", accept: [] },
    { en: "That name sounds familiar.", es: "Ese nombre me suena.", accept: [] }
  ],
  translate: [
    { en: "The alarm went off at three in the morning.", es: "La alarma sonó a las tres de la mañana.", accept: ["La alarma sonó a las tres de la madrugada."] },
    { en: "Why do you always play music at full blast? (to a friend)", es: "¿Por qué siempre pones la música a todo volumen?", accept: [] },
    { en: "He went deaf after the accident.", es: "Se quedó sordo después del accidente.", accept: ["Se quedó sordo tras el accidente."] },
    { en: "His voice is very deep.", es: "Tiene la voz muy grave.", accept: ["Su voz es muy grave."] },
    { en: "Hello? I can't hear you. The line is very bad. Speak louder, please.", es: "¿Aló? No te oigo. Se oye muy mal. Habla más alto, por favor.", accept: ["¿Aló? No te [oigo|escucho]. Se oye muy mal. Habla más [alto|duro], por favor."] },
    { en: "She let out a scream when she saw the mouse.", es: "Pegó un grito cuando vio el ratón.", accept: [] }
  ],
  register: [
    { es: "¡Bájale a eso, que no oigo nada!", en: "Turn that down, I can't hear a thing!", when: "at home, to a sibling with the TV on" },
    { es: "Perdón, ¿me repite? No le escuché.", en: "Sorry, could you repeat that? I didn't hear you.", when: "politely, to someone you call usted" },
    { es: "Se ruega guardar silencio.", en: "Please keep quiet.", when: "on a sign in a library or a hospital" },
    { es: "El nivel de ruido supera los límites permitidos.", en: "The noise level exceeds the permitted limits.", when: "in a formal complaint or an inspection report" }
  ],
  personal: {
    prompt: "Complain about noise twice: first in a quick message to the neighbour, then in a formal note to the building's administration.",
    constraints: [
      { type: "containsAny", words: ["a todo volumen", "a gritos", "a voces", "pegó un grito", "pegan gritos"], label: "how loud: *a todo volumen* or *a gritos*" },
      { type: "regex", pattern: "(bájale|bajarle|bajen|bajar a la|bajar el volumen|le bajas|le baja)", label: "asking to turn it down: *bájale a la música*" },
      { type: "regex", pattern: "(se oye|se escucha|no oigo|no escucho|son(ó|aron|aba))", label: "what's heard: *se oye* or *sonó*" }
    ],
    model: "Vecino, ¿le puede bajar a la música? Se oye hasta mi cuarto. Señora administradora: le informo que el apartamento 502 pone música a todo volumen todas las noches, y anoche sonó hasta las tres de la mañana."
  },
  pitfalls: [
    "*Sonar* belongs to the source: *sonó el celular*; the person hears it, *lo oí*.",
    "*Mudo* is unable to speak, not to hear: that's *sordo*.",
    "*En gritos* uses the wrong small word: *a gritos*."
  ]
},

"nt-sabor-olor-b2": {
  source: "merged",
  hook: {
    line: "A diner leaves a review of a Colombian restaurant on a food app. It's all taste and smell: what a dish lacked, what was sour, what the place smelled of.",
    es: "Ajiaco: sabroso, pero al caldo le faltaba sal y un poco de guascas.\nLa posta negra tenía un toque agridulce delicioso, con panela y un poquito de vinagre.\nEl jugo de lulo estaba agrio, y mi esposo le tuvo que echar azúcar.\nDesde la puerta huele a leña, y el tinto tiene un aroma buenísimo.\nLo único malo: el arroz estaba desabrido y un poco pasado.",
    en: "Ajiaco: tasty, but the broth needed salt and a bit more guascas.\nThe posta negra had a delicious sweet-and-sour touch, with panela and a little vinegar.\nThe lulo juice was sour, and my husband had to add sugar.\nFrom the door it smells of woodsmoke, and the coffee has a wonderful aroma.\nThe only bad thing: the rice was bland and a bit overcooked."
  },
  examples: [
    { es: "La sopa está muy desabrida; le falta sal y un poco de cilantro para que sepa a algo.", en: "The soup is very bland; it needs salt and a bit of coriander so that it tastes of something." },
    { es: "Huele a quemado. ¿Dejaste algo en la estufa? Ve a mirar antes de que se queme la olla.", en: "It smells burnt. Did you leave something on the stove? Go and look before the pan burns." },
    { es: "La casa olía a pintura fresca, así que dormimos con todas las ventanas abiertas.", en: "The house smelled of fresh paint, so we slept with all the windows open." }
  ],
  rule: "What something smells or tastes of takes *a*: *huele a café*, *sabe a limón*, with no article for a substance: *sabe a ajo*. *Tiene sabor a* says the same.\nWithout *a*, a verdict follows: *huele rico*, *sabe feo*. *Oler* changes its stem: *huelo, hueles, huele, olemos, huelen*.\nWhat a dish lacks works like *gustar*: *A la sopa le falta sal.* Plural, plural verb: *le faltan especias*.\nHow it tastes now, with *estar*: *está salado*, *picante*, *amargo*, *agrio* (sour), *dulce*. *Agridulce* is sweet and sour. Bland is *desabrido* or *simple* in Colombia, *insípido* in writing, *soso* in Spain.\n*Un aroma* is a pleasant smell; *un olor* can go either way.",
  readAndPick: [
    { q: "What did the ajiaco need?", es: "Al caldo le faltaba sal y un poco de guascas.",
      options: ["More salt and herbs", "Less salt in it", "Water, more water and more water"], answer: 0,
      why: "*Le faltaba sal*: salt was missing from the broth, like *gustar*." },
    { q: "What kind of flavour is *agridulce*?", es: "La posta negra tenía un toque agridulce delicioso.",
      options: ["Only bitter", "Sweet and sour", "Hot, spicy and smoky"], answer: 1,
      why: "*Agridulce* joins *agrio* and *dulce*: sweet and sour." },
    { q: "Why add sugar to the juice?", es: "El jugo de lulo estaba agrio.",
      options: ["It was too sweet", "It was cold", "It was too sour"], answer: 2,
      why: "*Agrio* is sour, so it needed sugar." },
    { q: "What is the smell at the door?", es: "Desde la puerta huele a leña.",
      options: ["Fresh bread", "Woodsmoke", "Nothing"], answer: 1,
      why: "*Huele a* names what it smells of: firewood burning." },
    { q: "How was the rice?", es: "El arroz estaba desabrido.",
      options: ["Burnt", "Tasteless", "Far too salty to eat"], answer: 1,
      why: "*Desabrido* is the Colombian word for bland." },
    { q: "What does *aroma* suggest that *olor* doesn't?", es: "El tinto tiene un aroma buenísimo.",
      options: ["It's pleasant", "It's very strong and bitter", "Bad"], answer: 0,
      why: "*Aroma* is a pleasant smell; *olor* can be good or bad." }
  ],
  yourTurn: [
    { en: "The soup needs salt.", es: "A la sopa le falta sal.", accept: ["Le falta sal a la sopa.", "La sopa necesita sal."] },
    { en: "It smells burnt.", es: "Huele a quemado.", accept: [] },
    { en: "This tastes of lemon.", es: "Esto sabe a limón.", accept: ["Esto tiene sabor a limón."] },
    { en: "The coffee has a wonderful aroma.", es: "El café tiene un aroma buenísimo.", accept: ["El [café|tinto] tiene un aroma [buenísimo|delicioso|riquísimo]."] },
    { en: "The rice is bland.", es: "El arroz está desabrido.", accept: ["El arroz está [insípido|simple]."] }
  ],
  translate: [
    { en: "Lemon is too sour to eat on its own.", es: "El limón es demasiado agrio para comerlo solo.", accept: [] },
    { en: "The house smelled of fresh paint.", es: "La casa olía a pintura fresca.", accept: [] },
    { en: "This dish is tasty but a bit spicy.", es: "Este plato es sabroso, pero un poco picante.", accept: ["Este plato [es|está] [sabroso|rico], pero un poco picante."] },
    { en: "That strong smell gives me a headache.", es: "Ese olor tan fuerte me da dolor de cabeza.", accept: ["Ese olor tan [fuerte|intenso] me da dolor de cabeza."] },
    { en: "The broth was tasty, but it needed salt. The juice was sour. And the whole restaurant smelled of woodsmoke.", es: "El caldo estaba sabroso, pero le faltaba sal. El jugo estaba agrio. Y todo el restaurante olía a leña.", accept: [] },
    { en: "It smells nice in here.", es: "Aquí huele rico.", accept: ["Acá huele rico.", "Huele rico aquí."] }
  ],
  register: [
    { es: "¡Uy, qué rico huele!", en: "Ooh, that smells good!", when: "in Colombia, walking into a kitchen" },
    { es: "Está un poco simple, ¿no?", en: "It's a bit bland, isn't it?", when: "in Colombia, gently criticising food" },
    { es: "El plato tiene un sabor equilibrado.", en: "The dish has a balanced flavour.", when: "in a restaurant review" },
    { es: "Notas de cata: aroma a frutos rojos y final amargo.", en: "Tasting notes: aroma of red berries and a bitter finish.", when: "on a coffee bag or a wine label" }
  ],
  personal: {
    prompt: "Review a meal you ate recently: what it smelled of, how two dishes tasted, and what one of them lacked.",
    constraints: [
      { type: "regex", pattern: "(huele|olía|olían|huelen) a ", label: "a smell: *huele a leña*" },
      { type: "regex", pattern: "(le|les) falta(ba|ban|n)?", label: "something missing: *le faltaba sal*" },
      { type: "containsAny", words: ["salado", "salada", "picante", "amargo", "amarga", "agrio", "agria", "dulce", "agridulce", "desabrido", "desabrida", "sabroso", "sabrosa", "insípido", "simple"], label: "a taste: *picante*, *agrio* or *desabrido*" }
    ],
    model: "El domingo almorzamos en un restaurante en La Candelaria. Desde la entrada olía a pan recién hecho. La sopa estaba sabrosa, pero le faltaba un poco de sal. El jugo de maracuyá estaba muy agrio."
  },
  pitfalls: [
    "*Huele quemado* drops the *a*: what it smells of is *huele a quemado*.",
    "*Sabe al ajo* adds an article: a substance takes none, *sabe a ajo*.",
    "*Soso* is Spain; in Colombia, *desabrido* or *simple*."
  ]
},

"nt-origen-b2": {
  source: "merged",
  hook: {
    line: "A bag of coffee from Huila tells its own story on the back: where the beans come from, where the money comes from, how far back the tradition goes, and the root of a problem.",
    es: "Café de origen: Huila, Colombia.\nEste café procede de pequeñas fincas a 1.800 metros de altura.\nLa mayor parte de nuestros ingresos proviene de la exportación a Japón.\nLa tradición cafetera de la región se remonta al siglo XIX.\nSegún los caficultores, la raíz del problema de los precios está en los intermediarios.",
    en: "Single-origin coffee: Huila, Colombia.\nThis coffee comes from small farms at 1,800 metres of altitude.\nMost of our income comes from exports to Japan.\nThe region's coffee-growing tradition dates back to the nineteenth century.\nAccording to the growers, the root of the price problem lies with the middlemen."
  },
  examples: [
    { es: "Hay que atacar la raíz del problema y no solo los síntomas, o en un año estaremos igual.", en: "You have to tackle the root of the problem and not just the symptoms, or in a year we'll be in the same place." },
    { es: "Muchas palabras del español provienen del árabe, como almohada, azúcar y aceite.", en: "Many Spanish words come from Arabic, like almohada, azúcar and aceite." },
    { es: "La noche de las velitas tiene su origen en el siglo XIX, según los historiadores.", en: "The night of the little candles has its origin in the nineteenth century, according to historians." }
  ],
  rule: "To say where something comes from in writing, use *proceder de* or *provenir de*: *El café procede del Huila.* *Muchas palabras provienen del árabe.* They agree with what comes: *proviene*, *provienen*. *Provenir* goes like *venir*. In conversation, *venir de* does the job.\nThe word for it is *la procedencia*: *de procedencia italiana*. *De origen* on a label is single origin.\nBack in time: *tener su origen en* and *remontarse a*: *se remonta al siglo XIX*.\n*La raíz del problema* is its root cause, a fixed image; for the plain origin of a product, *el origen* or *la procedencia*.",
  readAndPick: [
    { q: "Where does the coffee come from?", es: "Este café procede de pequeñas fincas.",
      options: ["Small farms", "A big factory", "Japan"], answer: 0,
      why: "*Proceder de* is the written come from: small farms." },
    { q: "What brings in most money?", es: "La mayor parte de nuestros ingresos proviene de la exportación a Japón.",
      options: ["Local shops", "Exports to Japan", "Coffee tours on the farm"], answer: 1,
      why: "*Proviene de* names where the income comes from." },
    { q: "How old is the tradition?", es: "La tradición cafetera se remonta al siglo XIX.",
      options: ["Two years", "It started last decade", "From the 1800s"], answer: 2,
      why: "*Remontarse a* is to date back to: the nineteenth century." },
    { q: "What does *la raíz del problema* mean?", es: "La raíz del problema está en los intermediarios.",
      options: ["The root cause", "How to fix it quickly", "A plant"], answer: 0,
      why: "*La raíz* here is the root cause, not a plant." },
    { q: "Where would you say *viene de*?", es: "Este café viene del Huila.",
      options: ["Only in a formal report", "Anywhere, chatting", "Never"], answer: 1,
      why: "*Venir de* is the everyday choice; *proceder de* is for writing." }
  ],
  yourTurn: [
    { en: "You have to attack the root of the problem.", es: "Hay que atacar la raíz del problema.", accept: [] },
    { en: "Most of the income comes from online sales.", es: "La mayor parte de los ingresos procede de las ventas por internet.", accept: ["La mayor parte de los ingresos [procede|proviene|viene] de las ventas [por internet|en línea]."] },
    { en: "The origin of these objects is unknown.", es: "Se desconoce la procedencia de estos objetos.", accept: ["Se desconoce el origen de estos objetos."] },
    { en: "The custom dates back to the Middle Ages.", es: "La costumbre se remonta a la Edad Media.", accept: ["La costumbre tiene su origen en la Edad Media."] },
    { en: "This wine comes from Chile.", es: "Este vino procede de Chile.", accept: ["Este vino [proviene|viene] de Chile."] }
  ],
  translate: [
    { en: "Where does this come from?", es: "¿De dónde viene esto?", accept: ["¿De dónde sale esto?"] },
    { en: "His family is of Italian origin.", es: "Su familia es de procedencia italiana.", accept: ["Su familia es de origen italiano."] },
    { en: "The conflict has its roots in an old land dispute.", es: "El conflicto tiene su raíz en una vieja disputa por tierras.", accept: ["El conflicto tiene sus raíces en una vieja disputa por tierras."] },
    { en: "Many words come from Arabic.", es: "Muchas palabras provienen del árabe.", accept: ["Muchas palabras [vienen|proceden] del árabe."] },
    { en: "This coffee comes from Huila. The tradition dates back to the nineteenth century. Today most of the income comes from exports.", es: "Este café procede del Huila. La tradición se remonta al siglo XIX. Hoy la mayor parte de los ingresos proviene de las exportaciones.", accept: ["Este café [procede|proviene|viene] del Huila. La tradición se remonta al siglo [XIX|diecinueve]. Hoy la mayor parte de los ingresos [proviene|procede|viene] de las exportaciones."] },
    { en: "Modern medicine has its origin in ancient times.", es: "La medicina moderna tiene su origen en la Antigüedad.", accept: [] }
  ],
  register: [
    { es: "¿Y eso de dónde salió?", en: "And where did that come from?", when: "chatting, about something unexpected" },
    { es: "Mi familia viene de Santander.", en: "My family comes from Santander.", when: "anywhere, talking about roots" },
    { es: "Producto de origen colombiano.", en: "Product of Colombian origin.", when: "on a label or a package" },
    { es: "Los fondos provienen de la cooperación internacional.", en: "The funds come from international cooperation.", when: "in a report or a press release" }
  ],
  personal: {
    prompt: "Write the story of a food, a word or a tradition from your region: where it comes from, how far back it goes, and the root of a problem around it today.",
    constraints: [
      { type: "regex", pattern: "(proced|provien|proven|viene|vienen|procede)", label: "where it comes from: *procede de* or *proviene de*" },
      { type: "containsAny", words: ["se remonta", "tiene su origen", "tienen su origen", "su origen está"], label: "how far back: *se remonta a* or *tiene su origen en*" },
      { type: "containsAny", words: ["la raíz", "raíces"], label: "the root: *la raíz del problema*" }
    ],
    model: "La arepa proviene de los pueblos indígenas de lo que hoy es Colombia y Venezuela. Su historia se remonta a antes de la llegada de los españoles. Hoy hay un problema: mucha gente compra harina industrial, y la raíz del problema es el precio del maíz local."
  },
  pitfalls: [
    "*Proceder de* sounds written; in conversation, *venir de*.",
    "*Las palabras proviene del árabe* forgets the plural: *provienen*.",
    "*La raíz* is a root cause; for the plain origin of a product, *la procedencia* or *el origen*."
  ]
},

"nt-edad-vejez-b2": {
  source: "merged",
  hook: {
    line: "A family chat on a birthday in December. The messages are full of time: the age someone is turning, things used for the first time, things just done, and news that only just arrived.",
    es: "Tía Gloria: ¡Feliz cumpleaños, Juancho! ¿Cuántos cumples?\nJuancho: Cumplo cuarenta. Ya soy un señor de mediana edad.\nTía Gloria: ¡Nada de eso! Y cuéntame, ¿estrenaste el carro?\nJuancho: Sí, lo estrené ayer. Y el apartamento está recién pintado.\nMamá: Y no se les olvide que los recién casados llegan el sábado. Recién me enteré.",
    en: "Aunt Gloria: Happy birthday, Juancho! How old are you turning?\nJuancho: I'm turning forty. I'm a middle-aged man now.\nAunt Gloria: Nonsense! And tell me, have you taken the car out for the first time?\nJuancho: Yes, I drove it for the first time yesterday. And the flat has just been painted.\nMom: And don't forget the newlyweds arrive on Saturday. I only just found out."
  },
  examples: [
    { es: "El pan está recién hecho; si quieren, llévense unos para el desayuno de mañana.", en: "The bread is freshly baked; if you like, take some for tomorrow's breakfast." },
    { es: "En diciembre todo el mundo estrena algo, aunque sea una camiseta o unos zapatos baratos.", en: "In December everyone wears something new, even if it's just a T-shirt or cheap shoes." },
    { es: "Mi abuelo cumplió noventa años en marzo, y todavía camina todas las mañanas por el parque.", en: "My grandfather turned ninety in March, and he still walks in the park every morning." }
  ],
  rule: "*Recién* + a participle is a fresh result: *recién pintado*, *recién hecho*, *los recién casados*, *un recién nacido*. The participle agrees: *paredes recién pintadas*. In Latin America *recién* also goes before an ordinary past: *Recién llegué*, I've just arrived. *Recién me enteré.*\n*Tener* + years is how old you are: *tengo cuarenta años*. *Cumplir* + years is reaching that age: *cumplo cuarenta el sábado*. *¿Cuántos cumples?*\n*Estrenar* is using or wearing something for the first time: *estrené el carro*, *estrenó vestido*. A film opening: *se estrena el viernes*.\nFood: *fresco* or *podrido*. People: *joven*, *de mediana edad*, *maduro*, *mayor*; *anciano* sounds blunt.",
  readAndPick: [
    { q: "What is Juancho celebrating?", es: "Cumplo cuarenta hoy.",
      options: ["Turning forty today", "He's been forty a while", "Forty"], answer: 0,
      why: "*Cumplir* + years is the moment you reach that age." },
    { q: "What did he do with the car?", es: "Sí, lo estrené ayer.",
      options: ["Sold it on", "Drove it for the first time", "Crashed it into a wall, sadly"], answer: 1,
      why: "*Estrenar* is using something for the very first time." },
    { q: "How new is the paint?", es: "El apartamento está recién pintado.",
      options: ["Years old", "Not yet started at all", "Painted just now"], answer: 2,
      why: "*Recién pintado* is freshly painted, a result that has just happened." },
    { q: "When did Mom find out?", es: "Recién me enteré.",
      options: ["Only just now", "A long time ago", "Never"], answer: 0,
      why: "In Latin America *recién* before a past verb is only just." },
    { q: "Who arrives on Saturday?", es: "Los recién casados llegan el sábado.",
      options: ["The newborns", "The newlyweds", "The new tenants"], answer: 1,
      why: "*Los recién casados* are the newlyweds; a newborn is *un recién nacido*." },
    { q: "Can you eat this apple?", es: "Esa manzana ya está podrida, tírala.",
      options: ["Yes, it's very fresh", "No, it's rotten", "Cooked"], answer: 1,
      why: "*Podrida* is rotten, the opposite of *fresca*." }
  ],
  yourTurn: [
    { en: "He's a newborn; he's only two days old.", es: "Es un recién nacido; solo tiene dos días.", accept: ["Es un recién nacido[;|,|.] solo tiene dos días."] },
    { en: "I've just arrived.", es: "Recién llegué.", accept: ["Acabo de llegar."] },
    { en: "My grandfather turned ninety in March.", es: "Mi abuelo cumplió noventa años en marzo.", accept: ["Mi abuelo cumplió noventa en marzo."] },
    { en: "She wore the dress for the first time at her sister's wedding.", es: "Estrenó el vestido en el matrimonio de su hermana.", accept: ["Estrenó el vestido en la boda de su hermana."] },
    { en: "The fish has to be fresh.", es: "El pescado tiene que estar fresco.", accept: [] }
  ],
  translate: [
    { en: "The newlyweds went on their honeymoon.", es: "Los recién casados se fueron de luna de miel.", accept: [] },
    { en: "The film premieres on Friday.", es: "La película se estrena el viernes.", accept: [] },
    { en: "She looks younger than she is.", es: "Aparenta menos edad de la que tiene.", accept: ["Parece más joven de lo que es."] },
    { en: "How old are you turning? (to a friend)", es: "¿Cuántos años cumples?", accept: ["¿Cuántos cumples?"] },
    { en: "The bread has just been made. The walls have just been painted. And today we're wearing new clothes for the first time: it's Christmas.", es: "El pan está recién hecho. Las paredes están recién pintadas. Y hoy estrenamos ropa: es Navidad.", accept: ["El pan está recién hecho. Las paredes están recién pintadas. Y hoy estrenamos ropa[:|;|,|.] es Navidad."] },
    { en: "He's a mature man, about fifty.", es: "Es un hombre maduro, de unos cincuenta años.", accept: [] }
  ],
  register: [
    { es: "¡Uy, estrenando pinta!", en: "Ooh, new outfit!", when: "in Colombia, teasing a friend in new clothes" },
    { es: "Es una persona mayor.", en: "He's an older person.", when: "anywhere, the polite way to say old" },
    { es: "Pintura fresca. Recién pintado.", en: "Wet paint. Freshly painted.", when: "on a sign" },
    { es: "La población de la tercera edad sigue en aumento.", en: "The elderly population continues to grow.", when: "in a report or the news" }
  ],
  personal: {
    prompt: "Write about the last birthday or holiday in your family: who turned how old, what someone wore or used for the first time, and something that had just been done.",
    constraints: [
      { type: "regex", pattern: "cumpl(ió|io|e|o|ieron|í|imos|en) [a-záéíóúñ0-9]+", label: "reaching an age: *cumplió noventa*" },
      { type: "regex", pattern: "estren(ó|o|é|e|amos|aron|ar|ando)", label: "a first use: *estrenó*" },
      { type: "regex", pattern: "recién [a-záéíóúñ]+", label: "just done: *recién pintado* or *recién llegué*" }
    ],
    model: "En diciembre mi abuela cumplió ochenta y cinco años. Toda la familia fue a su casa, que estaba recién pintada. Mi primo estrenó carro ese día y llevó a la abuela a dar una vuelta. Recién llegamos, mi tía sacó la torta."
  },
  pitfalls: [
    "*Tengo cuarenta el sábado* mixes two ideas: reaching the age is *cumplo cuarenta*.",
    "Spanish has one verb for using something the first time: *estrené el carro*.",
    "*Anciano* can sound blunt; for an older person, *una persona mayor*."
  ]
},

"task-b2-precision": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a process you know well, in fifteen sentences or more, with no vague words at all. The model is a loaf of bread, described so a reader could check every step.",
    es: "Mezclo quinientos gramos de harina con agua tibia, sal y levadura.\nAmaso unos diez minutos, hasta que la masa queda elástica y deja de estar pegajosa.\nLa dejo reposar en torno a hora y media, hasta que dobla su volumen.\nLe doy forma de bola y la meto al horno a doscientos grados.\nSé que está lista cuando la corteza está dorada y la base suena hueca al golpearla.\nPor dentro, la miga debe quedar suave al tacto y húmeda, no empapada.",
    en: "I mix five hundred grams of flour with warm water, salt and yeast.\nI knead for about ten minutes, until the dough is elastic and stops being sticky.\nI leave it to rest for around an hour and a half, until it doubles in size.\nI shape it into a ball and put it in the oven at two hundred degrees.\nI know it's ready when the crust is golden and the base sounds hollow when tapped.\nInside, the crumb should be soft to the touch and moist, not soggy."
  },
  examples: [
    { es: "Amaso la masa unos diez minutos, hasta que queda elástica y deja de estar pegajosa.", en: "I knead the dough for about ten minutes, until it turns elastic and stops being sticky." },
    { es: "La base suena hueca al golpearla con los dedos, y la corteza tiene un color dorado oscuro.", en: "The base sounds hollow when you tap it with your fingers, and the crust is a dark golden colour." },
    { es: "La dejo reposar en torno a hora y media, hasta que dobla su volumen bajo un trapo húmedo.", en: "I leave it to rest for around an hour and a half, until it doubles in size under a damp cloth." }
  ],
  rule: "Describe a process you know well, cooking, fixing or a routine at work, in fifteen sentences or more, with no vague words at all.\nBanned: *bueno*, *malo*, *bonito*, *feo*, *grande*, *pequeño*, *mucho*, *muy*. Each has a precise stand-in, and finding it is the exercise.\nUse the unit: texture (*elástico*, *pegajoso*, *liso*, *áspero al tacto*), consistency (*espeso*, *fluido*), wet and dry (*húmedo*, *empapado*), colour (*dorado*, *verde oliva*), sound (*suena hueco*), smell and taste (*huele a*, *agridulce*), weight and size in numbers (*pesa*, *unos diez centímetros*), shape (*tiene forma de*).\nOrder the steps with *primero*, *después*, *hasta que*, *cuando*.",
  readAndPick: [
    { q: "Which is precise rather than vague?", es: "La masa queda elástica y deja de estar pegajosa.",
      options: ["*buena*", "*elástica*", "*muy, muy rica*"], answer: 1,
      why: "*Elástica* says something a reader can check; *buena* says nothing." },
    { q: "How do you know the bread is ready?", es: "La base suena hueca al golpearla.",
      options: ["It sounds hollow", "It smells", "It turns black on top"], answer: 0,
      why: "*Suena hueca* is a test anyone can do: tap it and listen." },
    { q: "How long does it rest?", es: "La dejo reposar en torno a hora y media.",
      options: ["Exactly an hour", "Overnight, about twelve hours", "About ninety minutes"], answer: 2,
      why: "*En torno a* is around: roughly an hour and a half." },
    { q: "What should the inside be like?", es: "La miga debe quedar suave al tacto y húmeda, no empapada.",
      options: ["Moist, not soggy", "Dry and very hard", "Soaked"], answer: 0,
      why: "*Húmeda* is moist; *empapada* would be soaked through." },
    { q: "What does *dobla su volumen* mean?", es: "Hasta que dobla su volumen.",
      options: ["It folds in half", "It gets twice as big", "It turns up the sound"], answer: 1,
      why: "*Doblar su volumen* is to double in size, not to fold." }
  ],
  yourTurn: [
    { en: "I knead until the dough is elastic.", es: "Amaso hasta que la masa queda elástica.", accept: ["Amaso hasta que la masa [queda|está|quede|esté] elástica."] },
    { en: "The base sounds hollow when you tap it.", es: "La base suena hueca al golpearla.", accept: ["La base suena hueca cuando la golpeas."] },
    { en: "I leave it to rest for around an hour and a half.", es: "La dejo reposar en torno a hora y media.", accept: ["La dejo reposar [en torno a|alrededor de] una hora y media.", "La dejo reposar alrededor de hora y media."] },
    { en: "It stops being sticky.", es: "Deja de estar pegajosa.", accept: ["Ya no está pegajosa."] }
  ],
  translate: [
    { en: "The crust is golden and crunchy.", es: "La corteza está dorada y crujiente.", accept: [] },
    { en: "It doubles in size.", es: "Dobla su volumen.", accept: ["Duplica su volumen."] },
    { en: "The sauce should be thick, not runny.", es: "La salsa debe quedar espesa, no líquida.", accept: ["La salsa debe [quedar|estar] espesa, no [líquida|fluida|aguada]."] },
    { en: "It weighs about eight hundred grams.", es: "Pesa unos ochocientos gramos.", accept: ["Pesa [alrededor de|como] ochocientos gramos."] },
    { en: "First I mix the flour with warm water. Then I knead until the dough is smooth. Finally, I leave it to rest until it doubles in size.", es: "Primero mezclo la harina con agua tibia. Después amaso hasta que la masa queda lisa. Por último, la dejo reposar hasta que dobla su volumen.", accept: ["Primero mezclo la harina con agua tibia. [Después|Luego] amaso hasta que la masa [queda|está|quede] lisa. [Por último|Al final|Finalmente], la dejo reposar hasta que [dobla|doble|duplica|duplique] su volumen."] },
    { en: "It's ready when it smells of toasted bread.", es: "Está listo cuando huele a pan tostado.", accept: [] }
  ],
  register: [
    { es: "Le echas harina hasta que no se pegue.", en: "You add flour until it stops sticking.", when: "explaining a recipe to a friend in the kitchen" },
    { es: "Amasar durante diez minutos.", en: "Knead for ten minutes.", when: "in a written recipe" },
    { es: "Hornear a 200 °C durante 35 minutos.", en: "Bake at 200 °C for 35 minutes.", when: "in a recipe or on packaging" },
    { es: "La mezcla debe alcanzar una consistencia homogénea.", en: "The mixture must reach an even consistency.", when: "in a technical manual or a lab procedure" }
  ],
  personal: {
    prompt: "Describe a process you know well, cooking, fixing something or a routine at work, in fifteen sentences or more, with none of the vague words.",
    constraints: [
      { type: "minSentences", n: 15, label: "fifteen sentences or more" },
      { type: "avoidsAny", words: ["bueno", "buena", "malo", "mala", "bonito", "bonita", "feo", "fea", "grande", "pequeño", "pequeña", "mucho", "mucha", "muy"], label: "no vague words: no *bueno*, *grande* or *muy*" },
      { type: "containsAny", words: ["al tacto", "pegajos", "elástic", "espes", "húmed", "crujiente", "dorad", "suena", "huele a", "sabe a", "forma de", "pesa"], label: "precise words from the unit: *pegajoso*, *suena hueco* or *huele a*" },
      { type: "containsAny", words: ["hasta que", "cuando", "primero", "después", "luego"], label: "the steps in order: *primero* or *hasta que*" }
    ],
    model: "Así preparo las arepas de queso en mi casa. Primero pongo en un recipiente dos tazas de harina de maíz precocida. Le agrego una cucharadita de sal y cien gramos de queso campesino rallado. Después echo agua tibia poco a poco, mientras mezclo con la mano. Amaso unos cinco minutos, hasta que la masa queda lisa y deja de estar pegajosa. Si se agrieta en los bordes, le falta agua. Si se pega a los dedos, le sobra. Luego divido la masa en ocho bolas de unos sesenta gramos cada una. Aplasto cada bola entre las palmas hasta que tiene forma de disco de un centímetro de grosor. Caliento una sartén de hierro a fuego medio, sin aceite. Pongo las arepas y las dejo unos seis minutos por cada lado. Sé que están listas cuando la superficie está dorada y suena hueca al golpearla. Por dentro, la masa debe quedar húmeda y suave al tacto. Al final, les pongo un poco de mantequilla encima. Huelen a maíz tostado, y el queso se derrite en el centro."
  },
  pitfalls: [
    "*Muy bueno* says nothing a reader can check: say *crujiente*, *dorado*, *suena hueco*.",
    "*Grande* is a guess; a number is a description: *unos diez centímetros*, *pesa ochocientos gramos*.",
    "Steps without *hasta que* or *cuando* leave the reader asking how they'll know it's done."
  ]
}

};
