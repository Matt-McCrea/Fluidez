/* ============================================================================
 * TEACHING SCRIPTS, B1 units 1 and 2 (window.SCRIPTS_B1), keyed by lesson id.
 * Units b1-u27 "What I think" and b1-u28 "Agreeing and arguing": every lesson
 * on the path from COURSE_BANDS.B1, the present subjunctive first.
 *
 * Same anatomy as data/scripts/a1.js (a human reason, two or three examples
 * BEFORE the rule, a rule card with the forms on it, read-and-pick that needs
 * the form, typed production, one true sentence, pitfalls), plus two blocks
 * the upper bands need:
 *   register   [{ es, en, when }]   3 to 5 ways to say it, each with WHEN you
 *                                   would choose it, in one plain line
 *   translate  [{ en, es, accept }] 4 to 6 extra typed translations drawn from
 *                                   the lesson's exponents and examples
 *
 * Shape (tools/test-scripts-b1.js checks every rule below):
 *   hook        { line (English), es, en }  es/en may hold several lines (\n)
 *   examples    [{ es, en }]                2 or 3
 *   rule        plain English, under 120 words, lines split by \n
 *   readAndPick [{ q, es, options, answer, why }]   4 to 6
 *   yourTurn    [{ en, es, accept }]        3 to 5; en is the exact English of
 *                                           es; accept uses ( ) optional and
 *                                           [a|b] alternatives
 *   personal    { prompt, constraints (js/checker.js), model }
 *   pitfalls    [string]                    0 to 3
 *   register, translate                     as above
 *   source      'old' | 'merged' | 'rebuild'
 * Spanish inside English prose is marked *like this*; the view italicises it.
 *
 * The subjunctive is taught as the rebuild's ruling R1 has it: the ordinary
 * verb says something is so, the subjunctive holds an idea up without saying
 * it is so, and the test is to cover the opening and read what is left. It is
 * called "the subjunctive" from its first day (R2), never in a hook; the
 * indicative is "the ordinary form". No dashes, no vosotros, Latin American
 * Spanish (Colombia) throughout; no verb form the course has not built by
 * these days (no future, conditional or past subjunctive).
 * ========================================================================== */
window.SCRIPTS_B1 = {

/* ---- unit b1-u27 · What I think ------------------------------------------ */

"gr-presente-subjuntivo-b1": {
  source: "merged",
  hook: {
    line: "Your friend Camila starts a new job in Medellín on Monday, and she is nervous. Everything you want to tell her is something you hope, doubt or judge, not something you know, and Spanish shows that in the verb.",
    es: "Espero que te vaya bien el lunes.\nNo creo que sea tan difícil.",
    en: "I hope it goes well for you on Monday.\nI don't think it'll be that hard."
  },
  examples: [
    { es: "Quiero que me llames más tarde.", en: "I want you to call me later." },
    { es: "Dudo que llegue a tiempo con este trancón.", en: "I doubt she'll make it on time in this traffic jam." },
    { es: "Es normal que estés nerviosa.", en: "It's normal for you to be nervous." }
  ],
  rule: "Cover the opening and read what is left: *me llames*, *llegue a tiempo*, *estés nerviosa*. Nobody claims any of it: you want it, doubt it or judge it.\nThat verb shape is the subjunctive: it holds an idea up without saying it is so. It is your *usted* command: from the I form, *-ar* verbs take *e*, *-er* and *-ir* verbs take *a*:\n*llamar*: *llame, llames, llamen*\n*tener*: *tenga, tengas, tengan*\nSix to learn by heart: *sea, esté, vaya, sepa, dé, haya*.\nThree openings bring it: wanting (*quiero que, espero que*), doubting (*no creo que, dudo que*), judging (*es normal que*). A judgement takes it even when it is true.\nFor your own action, no *que*: *Quiero ir.*",
  readAndPick: [
    { q: "Who will do the calling?", es: "Quiero que me llames mañana.",
      options: ["You will call", "She will call", "They will call"], answer: 0,
      why: "*Que* plus *llames* hands the calling to you. For herself she would say *quiero llamar*." },
    { q: "Which verb is behind *vaya*?", es: "Espero que te vaya bien el lunes.",
      options: ["ser, to be", "ver, to see", "ir, to go"], answer: 2,
      why: "*Vaya* is one of the six to learn by heart: *ir* becomes *vaya*." },
    { q: "Is the speaker saying the job is hard?", es: "No creo que el trabajo sea tan duro.",
      options: ["Yes, she is sure of it", "No, she doubts it", "Yes, but just a bit"], answer: 1,
      why: "Cover *no creo que*: *el trabajo sea tan duro* is held up, not claimed." },
    { q: "She can see you really are nervous. Why does the verb still change?", es: "Es normal que estés nerviosa.",
      options: ["She doubts you are", "It is about later", "She is judging it"], answer: 2,
      why: "A judgement like *es normal que* takes the subjunctive even when the rest is true." },
    { q: "Who needs to know?", es: "Es importante que lo sepan.",
      options: ["They do", "I do", "One friend does"], answer: 0,
      why: "*Sepan* ends in *-n*: they. *Saber* becomes *sepa*." }
  ],
  yourTurn: [
    { en: "I want you to call me tonight. (to a friend)", es: "Quiero que me llames esta noche.", accept: ["Quiero que (tú) me llames esta noche."] },
    { en: "I don't think it's that hard.", es: "No creo que sea tan difícil.", accept: ["No [creo|me parece] que sea tan [difícil|duro]."] },
    { en: "It's normal for you to be nervous. (to a friend)", es: "Es normal que estés nervioso.", accept: ["Es normal que estés [nervioso|nerviosa]."] },
    { en: "I hope you have a good day. (to a friend)", es: "Espero que tengas un buen día.", accept: ["[Espero que|Ojalá] tengas un buen día."] },
    { en: "I doubt there is time.", es: "Dudo que haya tiempo.", accept: [] }
  ],
  translate: [
    { en: "I hope you get better soon. (to a friend)", es: "Espero que te mejores pronto.", accept: ["[Espero que|Ojalá] te mejores pronto."] },
    { en: "I doubt he'll arrive on time with this traffic.", es: "Dudo que llegue a tiempo con este tráfico.", accept: ["Dudo que llegue a tiempo con este [tráfico|trancón]."] },
    { en: "It's important for you to know. (to a friend)", es: "Es importante que lo sepas.", accept: ["Es importante que (lo) sepas."] },
    { en: "I think she's coming.", es: "Creo que viene.", accept: ["Creo que [viene|va a venir]."] },
    { en: "I don't think she's coming.", es: "No creo que venga.", accept: [] },
    { en: "I want to go, and I want you to come too. (to a friend)", es: "Quiero ir y quiero que vengas también.", accept: ["Quiero ir y quiero que vengas (tú) también.", "Quiero ir y quiero que tú también vengas.", "Quiero ir y que vengas (tú) también."] }
  ],
  register: [
    { es: "¡Que te vaya bien!", en: "Hope it goes well!", when: "with a friend, as you say goodbye" },
    { es: "Espero que te vaya bien.", en: "I hope it goes well for you.", when: "with anyone you call tú, in person or by message" },
    { es: "Espero que le vaya muy bien.", en: "I hope it goes very well for you.", when: "to someone you call usted, like a client" },
    { es: "Ojalá te vaya bien.", en: "I really hope it goes well for you.", when: "when you care a lot and are not sure it will" },
    { es: "Le deseamos mucho éxito en su nuevo cargo.", en: "We wish you every success in your new position.", when: "in writing, from a team or a company" }
  ],
  personal: {
    prompt: "Write two lines to someone you know who has something hard coming up: one hope with *Espero que* and one doubt with *No creo que*.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "espero que", label: "a hope: *espero que* and the subjunctive" },
      { type: "subjunctiveAfter", trigger: "no creo que", label: "a doubt: *no creo que* and the subjunctive" }
    ],
    model: "Espero que te vaya bien en la entrevista. No creo que sea tan difícil."
  },
  pitfalls: [
    "*No creo que tienes razón* is the slip everyone makes: a *no* in front of *creo* changes the verb to *tengas*.",
    "*Creo que no viene* keeps the ordinary form: the *no* sits after *que*, inside what you claim.",
    "For your own action, drop *que*: *Quiero ir*, never *quiero que yo vaya*."
  ]
},

"fn-dar-opinion-b1": {
  source: "merged",
  hook: {
    line: "A friend asks what you thought of the new restaurant everyone on your street is talking about. You liked it, mostly. The skill is saying what you think and what you don't, so it sounds like your view and not a verdict.",
    es: "A mí me parece que es bueno, pero no creo que valga lo que cuesta.",
    en: "I think it's good, but I don't think it's worth what it costs."
  },
  examples: [
    { es: "En mi opinión, el libro es mejor que la película.", en: "In my opinion, the book is better than the movie." },
    { es: "A mí no me parece que eso sea tan grave.", en: "I don't think that's so serious." },
    { es: "Pensamos que es mejor vernos mañana.", en: "We think it's better to meet tomorrow." }
  ],
  rule: "When you think something, the verb after *que* stays ordinary, because you are saying it is so:\n*Creo que tienes razón.* *Me parece que es caro.* *Pienso que es mejor.*\nPut a *no* in front of the opinion and the next verb takes the subjunctive, because now you hold the idea up without claiming it:\n*No creo que tengas razón.* *No me parece que sea caro.*\nA *no* after *que* changes nothing: *Creo que no es caro.*\nTo lead with your view: *Para mí*, *En mi opinión* or *Desde mi punto de vista*, each followed by a comma.\n*Te equivocas* on its own is blunt; *Creo que te equivocas* softens it.\nThen ask for theirs: *¿Y tú qué piensas?*",
  readAndPick: [
    { q: "Does she think you're right?", es: "No me parece que tengas razón.",
      options: ["Yes, she says so", "No, she doubts it", "She hasn't decided"], answer: 1,
      why: "A *no* in front of *me parece* holds the idea up: *tengas*, not *tienes*." },
    { q: "What is the speaker doing?", es: "Creo que es caro.",
      options: ["Asking if it is expensive", "Saying it is expensive", "Doubting it is expensive"], answer: 1,
      why: "*Creo que* with the ordinary *es* puts the claim on the table." },
    { q: "What is her view?", es: "Creo que no viene.",
      options: ["She thinks he won't come", "She doubts he will come", "She hopes he won't come"], answer: 0,
      why: "The *no* is after *que*: she claims he isn't coming, so *viene* stays." },
    { q: "How does this sound to the other person?", es: "Te equivocas.",
      options: ["Soft", "Polite", "Blunt"], answer: 2,
      why: "*Te equivocas* alone is a verdict. *Creo que te equivocas* makes it a view." },
    { q: "Where does this opening sound most at home?", es: "Desde mi punto de vista, la decisión fue acertada.",
      options: ["In a measured written piece", "In a quick text to a friend", "Shouting at a football match"], answer: 0,
      why: "*Desde mi punto de vista* sounds measured. With friends, *para mí* or *me parece que*." }
  ],
  yourTurn: [
    { en: "I think you're wrong. (to a friend)", es: "Creo que te equivocas.", accept: ["[Creo|Me parece] que te equivocas.", "[Creo|Me parece] que estás [equivocado|equivocada]."] },
    { en: "I don't think you're right. (to a friend)", es: "No creo que tengas razón.", accept: ["No [creo|me parece] que tengas razón."] },
    { en: "For me, the movie is better than the book.", es: "Para mí, la película es mejor que el libro.", accept: [] },
    { en: "I don't think that's so serious.", es: "No creo que eso sea tan grave.", accept: ["[No creo|No me parece|A mí no me parece] que eso sea tan grave."] },
    { en: "And what do you think? (to a friend)", es: "¿Y tú qué piensas?", accept: ["¿Y tú qué [piensas|opinas|crees]?", "¿Y qué [piensas|opinas|crees] tú?"] }
  ],
  translate: [
    { en: "From my point of view, the decision was the right one.", es: "Desde mi punto de vista, la decisión fue acertada.", accept: ["Desde mi punto de vista, la decisión fue [acertada|la correcta|la acertada]."] },
    { en: "We think it's better to meet tomorrow.", es: "Pensamos que es mejor vernos mañana.", accept: ["[Pensamos|Creemos] que es mejor vernos mañana."] },
    { en: "In my opinion, it's better to wait a little longer.", es: "En mi opinión, es mejor esperar un poco más.", accept: [] },
    { en: "We don't think it's a good idea.", es: "No creemos que sea una buena idea.", accept: ["No [creemos|pensamos] que sea (una) buena idea."] },
    { en: "I think it's expensive, but I don't think it's bad.", es: "Creo que es caro, pero no creo que sea malo.", accept: ["[Creo|Me parece] que es caro, pero no [creo|me parece] que sea malo."] }
  ],
  register: [
    { es: "Para mí, es caro.", en: "For me, it's expensive.", when: "with friends, short and direct" },
    { es: "Me parece que es caro.", en: "It seems to me it's expensive.", when: "in everyday talk, with anyone" },
    { es: "En mi opinión, es caro.", en: "In my opinion, it's expensive.", when: "at a meeting, so it is heard as your view" },
    { es: "Desde mi punto de vista, el precio es alto.", en: "From my point of view, the price is high.", when: "in writing, or when you want to sound measured" }
  ],
  personal: {
    prompt: "Give your honest view on something people around you argue about, like a team, a show or your city's buses: one thing you think and one thing you don't.",
    constraints: [
      { type: "containsAny", words: ["creo que", "me parece que", "pienso que", "en mi opinión", "para mí"], label: "what you think: *creo que*, *me parece que* or *para mí*" },
      { type: "subjunctiveAfter", trigger: "no creo que", label: "what you don't think: *no creo que* and the subjunctive" }
    ],
    model: "Para mí, el metro de Medellín es muy bueno, pero no creo que sea barato."
  },
  pitfalls: [
    "*No creo que es caro* is the slip to watch: the *no* in front of *creo* asks for *sea*.",
    "*Creo que sea caro* goes the other way: with no *no*, you are claiming it, so *es*."
  ]
},

"fn-certeza-evidencia-b1": {
  source: "merged",
  hook: {
    line: "Your flight out of Bogotá says delayed, and your friend is sure you will miss the connection. You are sure you won't. Spanish lets you choose how sure you sound, from a casual bet to proven fact, and every sure version keeps the ordinary verb.",
    es: "Tranquila, seguro que salimos en una hora.",
    en: "Relax, I bet we leave in an hour."
  },
  examples: [
    { es: "Estoy segura de que esta no es la carretera.", en: "I'm sure this isn't the road." },
    { es: "Está claro que se equivocó.", en: "It's clear he made a mistake." },
    { es: "No es verdad que cancelen el vuelo.", en: "It's not true that they're cancelling the flight." }
  ],
  rule: "When you are sure, you are saying it is so, and the verb stays ordinary:\n*Estoy seguro de que tiene razón.* (*segura* for a woman)\n*Seguro que llega tarde.* (casual, like I bet)\n*Sé que es verdad.* *Está claro que es así.* *Es evidente que está cansada.*\n*Está demostrado que el ejercicio ayuda.* (there is evidence)\nDeny the certainty and the verb takes the subjunctive, because now nobody claims it:\n*No estoy seguro de que sea posible.* *No es verdad que cancelen el vuelo.*\n*No dudo que* means you are sure, so the ordinary form is natural: *No dudo que tienes razón.*\nKeep the two frames apart: *estoy seguro de que*, but *seguro que* with no *de*.",
  readAndPick: [
    { q: "How sure is he?", es: "Seguro que llega tarde.",
      options: ["He doubts she'll be late", "He bets she'll be late", "He hopes she won't be late"], answer: 1,
      why: "*Seguro que* is the casual bet, and the ordinary *llega* says it is so." },
    { q: "Is the speaker saying it's possible?", es: "No estoy seguro de que sea posible.",
      options: ["Yes, and he has proof", "Yes, he is sure it is", "No, he isn't sure it is"], answer: 2,
      why: "Denying the certainty holds the idea up, so *sea*, not *es*." },
    { q: "Why is it *es* here, not *sea*?", es: "Es evidente que es así.",
      options: ["She presents it as fact", "She is judging it", "She hopes it is so"], answer: 0,
      why: "Cover *es evidente que*: *es así* is claimed outright." },
    { q: "What is she saying about the flight?", es: "No es verdad que cancelen el vuelo.",
      options: ["It was cancelled today", "It might be cancelled", "It is not cancelled"], answer: 2,
      why: "She denies the rumour. Nobody claims the cancelling, so *cancelen*." },
    { q: "How does this opening sound?", es: "Está demostrado que el ejercicio mejora el ánimo.",
      options: ["Like a casual bet", "Like there is proof", "Like a wish for later"], answer: 1,
      why: "*Está demostrado* leans on evidence, so it suits work and writing." }
  ],
  yourTurn: [
    { en: "I'm sure she's right. (a man speaking)", es: "Estoy seguro de que tiene razón.", accept: ["Estoy seguro de que (ella) tiene razón."] },
    { en: "I bet he comes back soon.", es: "Seguro que vuelve pronto.", accept: ["Seguro que [vuelve|regresa] pronto."] },
    { en: "It's obvious she's tired.", es: "Es evidente que está cansada.", accept: ["[Es evidente|Está claro|Es obvio] que está cansada."] },
    { en: "I'm not sure it's possible. (a woman speaking)", es: "No estoy segura de que sea posible.", accept: [] },
    { en: "I don't doubt you're right. (to a friend)", es: "No dudo que tienes razón.", accept: ["No dudo (de) que [tienes|tengas] razón."] }
  ],
  translate: [
    { en: "I'm completely sure this isn't the road. (a man speaking)", es: "Estoy totalmente seguro de que esta no es la carretera.", accept: ["Estoy [totalmente|completamente] seguro de que esta no es la carretera."] },
    { en: "It's been proven that exercise improves your mood.", es: "Está demostrado que el ejercicio mejora el ánimo.", accept: ["Está [demostrado|comprobado] que el ejercicio mejora el ánimo."] },
    { en: "I know perfectly well who is going to win.", es: "Sé perfectamente quién va a ganar.", accept: ["Sé [perfectamente|muy bien] quién va a ganar."] },
    { en: "It's not true that they're closing the park.", es: "No es verdad que cierren el parque.", accept: ["No es [verdad|cierto] que cierren el parque."] },
    { en: "I don't doubt you're going to manage it. (to a friend)", es: "No dudo que lo vas a lograr.", accept: ["No dudo (de) que lo vas a [lograr|conseguir]."] }
  ],
  register: [
    { es: "Seguro que gana.", en: "I bet she wins.", when: "with friends, a quick casual bet" },
    { es: "Estoy seguro de que va a ganar.", en: "I'm sure she's going to win.", when: "anywhere, when you mean it firmly" },
    { es: "Está claro que va a ganar.", en: "It's clear she's going to win.", when: "in a discussion, to put it beyond argument" },
    { es: "Está demostrado que funciona.", en: "It's been proven that it works.", when: "at work or in writing, with evidence behind you" },
    { es: "Te lo aseguro.", en: "I assure you.", when: "face to face, to reassure someone" }
  ],
  personal: {
    prompt: "Think about tomorrow. Write one thing you are completely sure of, and one thing you are not sure of.",
    constraints: [
      { type: "containsAny", words: ["estoy seguro de que", "estoy segura de que", "seguro que", "está claro que", "sé que"], label: "something you are sure of, with *estoy seguro de que* or *seguro que*" },
      { type: "subjunctiveAfter", trigger: "no estoy", within: 6, label: "something you are not sure of: *no estoy seguro de que* and the subjunctive" }
    ],
    model: "Estoy seguro de que mañana voy a estar cansado. No estoy seguro de que haya reunión."
  },
  pitfalls: [
    "*Seguro de que llega* blends two frames: say *estoy seguro de que llega* or *seguro que llega*.",
    "*Es evidente que sea así* is wrong: a sure opening claims the rest, so *es*."
  ]
},

"nt-certeza-realidad-b1": {
  source: "merged",
  hook: {
    line: "Your friends are deciding whether Saturday's trip to the finca is still on, and nobody knows what the weather will do. People in Colombia have four everyday ways to say maybe, and they do not all treat the next verb the same way.",
    es: "De pronto llueve, pero tal vez haga sol por la tarde.",
    en: "Maybe it'll rain, but maybe it'll be sunny in the afternoon."
  },
  examples: [
    { es: "A lo mejor viene más tarde.", en: "Maybe he'll come later." },
    { es: "Tal vez llueva esta tarde.", en: "It might rain this afternoon." },
    { es: "Es imposible que lo sepa.", en: "It's impossible for her to know." }
  ],
  rule: "Sure things keep the ordinary form: *Es evidente que estudió.* *Está claro que no viene.*\nFor maybe, the word you pick decides the verb.\n*A lo mejor* and, in Colombia, *de pronto* keep the ordinary form: *A lo mejor viene.* *De pronto llueve.*\n*Tal vez* and *quizás* usually take the subjunctive: *Tal vez llueva.*\n*Es posible que*, *puede que* and *es imposible que* always do: *Es posible que cierren temprano.* Cover the opening: nobody says it is so.\n*A lo mejor viene* and *tal vez venga* mean the same thing. That pair is one to memorise, not to reason out.\nFor what is real: *real* is real, *realista* is sensible, *imaginario* is made up.",
  readAndPick: [
    { q: "What does *de pronto* mean here?", es: "De pronto llueve más tarde.",
      options: ["Suddenly it rained", "It rains every afternoon", "Maybe it'll rain later"], answer: 2,
      why: "In Colombia, *de pronto* with a present verb is maybe. Suddenly it rained is *de pronto llovió*." },
    { q: "Who might know?", es: "Tal vez lo sepas.",
      options: ["You might", "She might", "They might"], answer: 0,
      why: "*Sepas* ends in *-s*: you. *Saber* becomes *sepa*." },
    { q: "Who can't possibly know?", es: "Es imposible que lo sepan.",
      options: ["We can't", "They can't", "Only she can't"], answer: 1,
      why: "*Sepan* ends in *-n*: they. *Es imposible que* always takes the subjunctive." },
    { q: "What is the speaker's sister like?", es: "Mi hermana es muy realista.",
      options: ["Real, not imaginary at all", "Sensible and practical", "Always full of big dreams"], answer: 1,
      why: "*Realista* is sensible; *real* is real. They are different words." },
    { q: "Is the speaker sure she studied?", es: "Es evidente que estudió mucho.",
      options: ["Yes, it's obvious", "No, she doubts it", "She only hopes so"], answer: 0,
      why: "*Es evidente que* claims it, so the ordinary *estudió*." }
  ],
  yourTurn: [
    { en: "Maybe it'll rain this afternoon.", es: "Tal vez llueva esta tarde.", accept: ["[Tal vez|Quizás|Quizá] llueva esta tarde.", "[A lo mejor|De pronto] llueve esta tarde."] },
    { en: "Maybe he'll come later.", es: "A lo mejor viene más tarde.", accept: ["[A lo mejor|De pronto] viene más tarde.", "[Tal vez|Quizás|Quizá] venga más tarde."] },
    { en: "It's impossible for her to know.", es: "Es imposible que lo sepa.", accept: ["Es imposible que (lo) sepa."] },
    { en: "As a child, I dreamed of being a pilot.", es: "De niño soñaba con ser piloto.", accept: ["De [niño|niña] soñaba con ser piloto.", "Cuando era [niño|niña], soñaba con ser piloto."] },
    { en: "That character is completely imaginary.", es: "Ese personaje es completamente imaginario.", accept: [] }
  ],
  translate: [
    { en: "It's clear he's not coming.", es: "Está claro que no va a venir.", accept: ["[Está claro|Es evidente] que no [va a venir|viene]."] },
    { en: "I doubt we have time for everything.", es: "Dudo que tengamos tiempo para todo.", accept: [] },
    { en: "It's possible they're closing early.", es: "Es posible que cierren temprano.", accept: ["[Es posible|Puede] que cierren temprano."] },
    { en: "Maybe she's at home.", es: "A lo mejor está en la casa.", accept: ["[A lo mejor|De pronto] está en (la) casa.", "[Tal vez|Quizás|Quizá] [esté|está] en (la) casa."] },
    { en: "It's not realistic to finish today.", es: "No es realista terminar hoy.", accept: [] }
  ],
  register: [
    { es: "De pronto llueve.", en: "Maybe it'll rain.", when: "in Colombia, in everyday talk" },
    { es: "A lo mejor llueve.", en: "Maybe it'll rain.", when: "anywhere Spanish is spoken, safe in any chat" },
    { es: "Tal vez llueva.", en: "Perhaps it'll rain.", when: "in writing, or to sound a little careful" },
    { es: "Es posible que llueva.", en: "It's possible it'll rain.", when: "at work or in a forecast, weighing a real chance" }
  ],
  personal: {
    prompt: "Write about your coming weekend: one thing that might happen with *a lo mejor* or *de pronto*, and one with *tal vez*.",
    constraints: [
      { type: "containsAny", words: ["a lo mejor", "de pronto"], label: "a maybe with *a lo mejor* or *de pronto*" },
      { type: "subjunctiveAfter", trigger: "tal vez", within: 4, label: "a maybe with *tal vez* and the subjunctive" }
    ],
    model: "A lo mejor voy a la finca de mis papás. Tal vez llueva, pero no importa."
  },
  pitfalls: [
    "*A lo mejor venga* is the slip: *a lo mejor* keeps the ordinary form, *viene*.",
    "*Es imposible que* rules something out, so it takes the subjunctive: *es imposible que lo sepa*.",
    "A *persona realista* is sensible, not real."
  ]
},

"fn-estoy-de-acuerdo-b1": {
  source: "merged",
  hook: {
    line: "At work someone proposes moving the weekly meeting to Monday at seven in the morning. You agree with her that it has to move, just not to seven. Spanish uses one small word for who you agree with and another for what about.",
    es: "Estoy de acuerdo contigo en que hay que moverla, pero no a las siete.",
    en: "I agree with you that it has to move, but not to seven."
  },
  examples: [
    { es: "Estoy de acuerdo con la nueva ley.", en: "I agree with the new law." },
    { es: "Estamos de acuerdo en vernos el lunes.", en: "We agree to meet on Monday." },
    { es: "Estoy de acuerdo en que hay que cambiar el horario.", en: "I agree that the schedule has to change." }
  ],
  rule: "*Estar de acuerdo* is to agree, always with *estar*. The next small word depends on what follows.\n*con* for a person or a thing: *Estoy de acuerdo con Ana.* *No estoy de acuerdo con la decisión.* With *tú* it is *contigo*; with *yo*, *conmigo*.\n*en* for an action or a whole statement: *Estamos de acuerdo en vernos.* *Estoy de acuerdo en que es caro.*\nBoth at once: *Estoy de acuerdo contigo en que es caro.*\nAfter *en que*, agreeing that something is so keeps the ordinary form. Agreeing to let something happen takes the subjunctive: *Estoy de acuerdo en que vengas.*\nTo say no, put *no* before *estoy*.",
  readAndPick: [
    { q: "Who does he agree with?", es: "Estoy de acuerdo contigo.",
      options: ["With me", "With them", "With you"], answer: 2,
      why: "*Contigo* is *con* plus you. With me is *conmigo*." },
    { q: "What is she agreeing to?", es: "Estoy de acuerdo en que vengas.",
      options: ["Letting you come", "The fact you came", "Coming herself"], answer: 0,
      why: "*En que* plus *vengas*: she agrees to let it happen, not that it did." },
    { q: "What have they agreed?", es: "Estamos de acuerdo en vernos el lunes.",
      options: ["That they met Monday", "To meet on Monday", "To skip Monday"], answer: 1,
      why: "*En* plus the dictionary form *vernos*: the action they both agree to." },
    { q: "Who is being asked?", es: "¿Están de acuerdo con la propuesta?",
      options: ["One close friend", "The speaker herself", "A group of people"], answer: 2,
      why: "*Están*, asked face to face: you all." }
  ],
  yourTurn: [
    { en: "I agree with you. (to a friend)", es: "Estoy de acuerdo contigo.", accept: ["(Yo) estoy de acuerdo contigo."] },
    { en: "I don't agree with that decision.", es: "No estoy de acuerdo con esa decisión.", accept: [] },
    { en: "We agree that the schedule has to change.", es: "Estamos de acuerdo en que hay que cambiar el horario.", accept: ["Estamos de acuerdo en que [hay que|tenemos que] cambiar el horario.", "Estamos de acuerdo en que el horario tiene que cambiar."] },
    { en: "I agree with you all on almost everything.", es: "Estoy de acuerdo con ustedes en casi todo.", accept: [] },
    { en: "Do you agree with this decision? (polite)", es: "¿Está de acuerdo con esta decisión?", accept: ["¿Usted está de acuerdo con esta decisión?", "¿Está usted de acuerdo con esta decisión?"] }
  ],
  translate: [
    { en: "I fully agree with your position. (polite)", es: "Coincido plenamente con su planteamiento.", accept: ["Coincido [plenamente|totalmente] con su [planteamiento|posición].", "Estoy [totalmente|completamente|plenamente] de acuerdo con su [planteamiento|posición]."] },
    { en: "I agree to take part in the project.", es: "Estoy de acuerdo en participar en el proyecto.", accept: [] },
    { en: "You're right.", es: "Tienes razón.", accept: ["Tiene razón."] },
    { en: "I see it that way too.", es: "Yo también lo veo así.", accept: ["Yo lo veo así también.", "También lo veo así."] },
    { en: "Do you all agree?", es: "¿Están de acuerdo?", accept: ["¿Ustedes están de acuerdo?", "¿Están ustedes de acuerdo?"] }
  ],
  register: [
    { es: "Exacto.", en: "Exactly.", when: "with a friend, in the middle of a conversation" },
    { es: "Estoy de acuerdo contigo.", en: "I agree with you.", when: "with anyone you call tú, said plainly" },
    { es: "Estoy de acuerdo con usted.", en: "I agree with you.", when: "to a client, a boss or an older neighbour" },
    { es: "Coincido plenamente con su planteamiento.", en: "I fully share your position.", when: "at a formal meeting or in a written reply" },
    { es: "Yo también lo veo así.", en: "I see it that way too.", when: "to show you reached the same view yourself" }
  ],
  personal: {
    prompt: "Someone near you has proposed something, like a new rule at work or a plan for the holidays. Say who you agree with, and on what.",
    constraints: [
      { type: "containsWord", word: "de acuerdo con", label: "who you agree with: *de acuerdo con* or *de acuerdo contigo*" },
      { type: "regex", pattern: "\\ben (que |[a-záéíóúñ]+(ar|er|ir)(nos|lo|la|se)?\\b)", label: "what about: *en* plus an action, or *en que*" }
    ],
    model: "Estoy de acuerdo con mi jefa en que hay que mover la reunión, pero no a las siete."
  },
  pitfalls: [
    "*Soy de acuerdo* is never right: agreeing always takes *estar*.",
    "You will read *de acuerdo a la ley*, according to the law. Agreeing with someone is *de acuerdo con*.",
    "*Estoy de acuerdo con ir* mixes them up: an action takes *en*, so *de acuerdo en ir*."
  ]
},

"nt-conformidad-correccion-precision-b1": {
  source: "merged",
  hook: {
    line: "At the checkout in a Cali supermarket the cashier keeps offering more: a bag, points, a donation. You want to say that's all without sounding rude. Then, on the way home, you notice you got on the wrong bus, and you need to say that too.",
    es: "¿Algo más?\nNo, así está bien, gracias.",
    en: "Anything else?\nNo, that's fine, thanks."
  },
  examples: [
    { es: "Perdón, me equivoqué de bus.", en: "Sorry, I took the wrong bus." },
    { es: "Repasé el informe y corregí dos errores.", en: "I checked over the report and fixed two mistakes." },
    { es: "Su explicación fue difícil de seguir.", en: "Her explanation was hard to follow." }
  ],
  rule: "To close politely, use a set phrase: *Así está bien, gracias.* *Nada más, gracias.* In Colombia, *Listo, gracias.* You decline more without turning anything down.\n*Equivocarse* is to make a mistake, and it always carries *me*, *te* or *se*: *me equivoqué*, *te equivocaste*, *se equivocó*.\nTo pick the wrong one, add *de* and the thing, with no *el* or *la*: *me equivoqué de bus*, *de número*, *de día*. A slip inside something takes *en*: *Me equivoqué en la cuenta.*\nYou *repasar* first (check over), then *corregir* (fix) what you find.\nFor how clear something is: *claro*, *sencillo*, *complicado*. Hard to follow is *difícil de seguir*, with *de*.",
  readAndPick: [
    { q: "What happened?", es: "Me equivoqué de bus.",
      options: ["He took the wrong bus", "The driver made a mistake", "He missed the last bus"], answer: 0,
      why: "*Equivocarse de* plus a thing is picking the wrong one." },
    { q: "What went wrong?", es: "Me equivoqué en la cuenta.",
      options: ["She went into the wrong bank", "The waiter brought two bills", "She added up the bill wrong"], answer: 2,
      why: "*En* points inside: a slip in the sum, not the wrong choice of thing." },
    { q: "The waiter offers more bread. What does she mean?", es: "No, así está bien, gracias.",
      options: ["Yes, more like before", "No more, thank you", "The bread is good"], answer: 1,
      why: "*Así está bien* is a set way to decline more, politely." },
    { q: "What did he do first?", es: "Repasé el informe y corregí dos errores.",
      options: ["He fixed the errors", "He sent it off", "He checked it over"], answer: 2,
      why: "*Repasé* comes first: checking over is how he found what to *corregir*." },
    { q: "What does she think of the talk?", es: "Fue muy difícil de seguir.",
      options: ["Hard to follow", "Too short", "Easy to follow"], answer: 0,
      why: "*Difícil de seguir*: hard to follow, with *de* before the action." }
  ],
  yourTurn: [
    { en: "No, that's fine, thanks.", es: "No, así está bien, gracias.", accept: ["No, [así está bien|está bien así], (muchas) gracias."] },
    { en: "Sorry, I got the wrong number.", es: "Perdón, me equivoqué de número.", accept: ["[Perdón|Disculpe|Disculpa|Lo siento], me equivoqué de número."] },
    { en: "She fixed the mistake before handing in the report.", es: "Corrigió el error antes de entregar el informe.", accept: [] },
    { en: "The explanation is very clear.", es: "La explicación es muy clara.", accept: [] },
    { en: "His speech was hard to follow.", es: "Su discurso fue difícil de seguir.", accept: ["Su discurso fue [difícil|complicado] de seguir."] }
  ],
  translate: [
    { en: "It's a very common mistake among students.", es: "Es un error muy común entre estudiantes.", accept: ["Es un error muy común entre (los) estudiantes."] },
    { en: "Nothing else, thanks.", es: "Nada más, gracias.", accept: ["Nada más, (muchas) gracias."] },
    { en: "You have to check over the text before sending it.", es: "Hay que repasar el texto antes de enviarlo.", accept: ["[Hay que|Tienes que] repasar el texto antes de [enviarlo|mandarlo]."] },
    { en: "We took the wrong street.", es: "Nos equivocamos de calle.", accept: [] },
    { en: "It's three o'clock, more or less.", es: "Son las tres, más o menos.", accept: ["Son más o menos las tres."] }
  ],
  register: [
    { es: "Así está bien, gracias.", en: "That's fine, thanks.", when: "at a shop or a restaurant, with anyone" },
    { es: "Nada más, gracias.", en: "Nothing else, thanks.", when: "as the short answer to *¿algo más?*" },
    { es: "Listo, gracias.", en: "All set, thanks.", when: "in Colombia, everyday and friendly" },
    { es: "Con eso es suficiente, muchas gracias.", en: "That's enough, thank you very much.", when: "to someone you call usted, a little more careful" }
  ],
  personal: {
    prompt: "Write about a real mistake you made recently: what you got wrong, with *me equivoqué de*, and what you did next.",
    constraints: [
      { type: "regex", pattern: "equivoqu[eé] de ", label: "*me equivoqué de* and the thing you got wrong" },
      { type: "minWords", n: 8, label: "at least eight words" }
    ],
    model: "Ayer me equivoqué de bus y llegué tarde, pero llamé a mi jefe y le expliqué."
  },
  pitfalls: [
    "*Me equivoqué de el bus* has one word too many: after *de*, no *el* or *la*.",
    "*Equivoqué* alone is not Spanish: the verb always carries *me*, *te* or *se*."
  ]
},

"task-b1-opinion": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: twelve sentences or more on something you really hold a view on. The model is about working from home. Notice how much of it is about what the writer does not think.",
    es: "Creo que el teletrabajo funciona, pero no creo que sea la solución para todo el mundo.",
    en: "I think working from home works, but I don't think it's the solution for everyone."
  },
  examples: [
    { es: "No digo que no haya problemas, pero las ventajas pesan más.", en: "I'm not saying there are no problems, but the advantages count for more." },
    { es: "Lo que sí está claro es que ahorra tiempo.", en: "What is clear is that it saves time." }
  ],
  rule: "A piece that argues makes five moves, and you have the Spanish for each one.\nState your position early, with *En mi opinión* or *A mí me parece que*.\nGive three reasons and join them with *por un lado*, *por otro* and *además*.\nSay two things you do not think: *No creo que sea la solución.* *No pienso que funcione para todos.*\nGrant something before you turn: *No digo que no haya problemas, pero...*\nClose it with *En conclusión* or *Por eso*.\nThe contrast to get right is one verb. *Creo que funciona* claims it; *No creo que funcione* holds it up without claiming it.",
  readAndPick: [
    { q: "What is the writer saying about new teams?", es: "No creo que funcione en equipos nuevos.",
      options: ["She's sure it works there", "She doubts it works there", "She wants it to work there"], answer: 1,
      why: "*No creo que* plus *funcione*: held up, not claimed." },
    { q: "What is she admitting?", es: "No digo que no haya problemas.",
      options: ["That everything is fine", "That there are problems", "That she has no doubts"], answer: 1,
      why: "*No digo que no haya*: two negatives, so she grants there are problems." },
    { q: "What does *además* do here?", es: "Además, la gente rinde más en casa.",
      options: ["Adds a reason", "Brings in a doubt", "Ends the whole piece"], answer: 0,
      why: "*Además* stacks one more reason on the pile." },
    { q: "Where does this sentence belong?", es: "En conclusión, las ventajas pesan más.",
      options: ["Near the start", "In the middle part", "At the very end"], answer: 2,
      why: "*En conclusión* closes the piece." },
    { q: "How many sides does she give?", es: "Por un lado ahorra tiempo; por otro, es difícil conocer a la gente.",
      options: ["Two: one good, one bad", "Only the good side", "Three separate reasons"], answer: 0,
      why: "*Por un lado, por otro* sets two sides against each other." }
  ],
  yourTurn: [
    { en: "I think it works.", es: "Creo que funciona.", accept: ["[Creo|Pienso|Me parece] que funciona."] },
    { en: "I don't think it works.", es: "No creo que funcione.", accept: ["No [creo|pienso|me parece] que funcione."] },
    { en: "I'm not saying there are no problems.", es: "No digo que no haya problemas.", accept: [] },
    { en: "I don't think it's the solution.", es: "No creo que sea la solución.", accept: ["No [creo|pienso|me parece] que sea la solución."] }
  ],
  translate: [
    { en: "In my opinion, it saves a lot of time.", es: "En mi opinión, ahorra mucho tiempo.", accept: [] },
    { en: "On the one hand it's cheaper; on the other, it's slower.", es: "Por un lado es más barato; por otro, es más lento.", accept: ["Por un lado es más barato; por otro lado, es más lento.", "Por un lado es más barato, por otro (lado) es más lento."] },
    { en: "What's more, people get more done at home.", es: "Además, la gente rinde más en casa.", accept: ["Además, la gente rinde más en (la) casa."] },
    { en: "I don't think it works for teams that are just starting.", es: "No creo que funcione para equipos que están empezando.", accept: ["No creo que funcione [para|en] (los) equipos que están empezando."] },
    { en: "In conclusion, the advantages count for more.", es: "En conclusión, las ventajas pesan más.", accept: [] }
  ],
  register: [
    { es: "Para mí, funciona.", en: "For me, it works.", when: "with friends, in conversation" },
    { es: "Creo que funciona.", en: "I think it works.", when: "anywhere, the plain way" },
    { es: "En mi opinión, funciona.", en: "In my opinion, it works.", when: "at the start of a written piece" },
    { es: "Estoy convencido de que funciona.", en: "I'm convinced it works.", when: "in a debate, when you want to sound firm" },
    { es: "Todo indica que funciona.", en: "Everything suggests it works.", when: "in a report, when you lean on evidence" }
  ],
  personal: {
    prompt: "Write the opening of your own piece: your position in one sentence, then one thing you do not think.",
    constraints: [
      { type: "containsAny", words: ["creo que", "en mi opinión", "me parece que", "para mí", "desde mi punto de vista"], label: "your position, stated early" },
      { type: "subjunctiveAfter", trigger: "no creo que", label: "one thing you don't think: *no creo que* and the subjunctive" }
    ],
    model: "En mi opinión, el transporte público en Bogotá está mejor que antes, pero no creo que sea suficiente."
  },
  pitfalls: [
    "Mixing the two is the commonest slip in a piece like this: *creo que es*, but *no creo que sea*.",
    "A position that arrives in sentence ten is a summary, not an argument: say it early."
  ]
},

/* ---- unit b1-u28 · Agreeing and arguing ---------------------------------- */

"fn-aprobacion-desaprobacion-b1": {
  source: "merged",
  hook: {
    line: "Your housemate goes out most nights, which is fine by you. What isn't fine is that she never lets you know, so you wait up. You want to say both things clearly, without starting a fight.",
    es: "Me parece bien que salgas, pero me parece mal que no me avises.",
    en: "I think it's fine that you go out, but I think it's wrong that you don't let me know."
  },
  examples: [
    { es: "Está muy bien que participes en el proyecto.", en: "It's great that you're taking part in the project." },
    { es: "Me parece fatal que cancelen vuelos sin avisar.", en: "I think it's awful that they cancel flights without warning." },
    { es: "¡Qué bueno que estés aquí!", en: "It's so good that you're here!" }
  ],
  rule: "To judge a thing, just name it: *Me parece bien tu decisión.*\nTo judge an action in general, use the dictionary form: *Está mal mentir.*\nTo judge what someone else does, use *que* and the subjunctive: *Me parece mal que mientas.* This holds even when it is true. She really does go out, and still *que salgas*: you are judging it, not reporting it.\nSet the strength: *genial*, *muy bien*, *bien*, *mal*, *fatal*.\nChange the judge with *te*, *le*, *nos*, *les*: *A mi mamá le parece mal que fume.*\n*¡Qué bueno que...!* is warmer; keep it for real reactions. About something already over, you will hear the plain past: *¡Qué bueno que viniste!*",
  readAndPick: [
    { q: "Who is coming?", es: "Me parece bien que vengas.",
      options: ["The speaker is", "You are", "Some friends are"], answer: 1,
      why: "*Que* plus *vengas*: you come, and she approves." },
    { q: "Who is she talking about?", es: "Está mal mentir.",
      options: ["You, right now", "Herself, last night", "People in general"], answer: 2,
      why: "The dictionary form *mentir* judges the act itself, not one person." },
    { q: "Who disapproves?", es: "A mi mamá le parece fatal que fume.",
      options: ["My mother does", "I do", "The neighbour does"], answer: 0,
      why: "*A mi mamá le parece*: the judge is my mother. *Fume* is the one who smokes." },
    { q: "How strong is this?", es: "Me parece fatal que cancelen vuelos sin avisar.",
      options: ["A little against it", "Very much in favour", "Strongly against it"], answer: 2,
      why: "*Fatal* is the bottom of the scale: awful." },
    { q: "How does the speaker feel?", es: "¡Qué bueno que tengas tiempo!",
      options: ["Sorry you're busy", "Glad you have time", "Unsure you're free"], answer: 1,
      why: "*¡Qué bueno que!* is a warm reaction, so *tengas* even though it is true." }
  ],
  yourTurn: [
    { en: "I think it's wrong that you don't let me know. (to a friend)", es: "Me parece mal que no me avises.", accept: ["Me parece (muy) mal que no me avises."] },
    { en: "It's wrong to lie.", es: "Está mal mentir.", accept: ["[Está mal|Es malo] mentir."] },
    { en: "I think your decision is good. (to a friend)", es: "Me parece bien tu decisión.", accept: ["Me parece (muy) bien tu decisión.", "Tu decisión me parece (muy) bien."] },
    { en: "It's great that you're taking part in the project. (to a friend)", es: "Está muy bien que participes en el proyecto.", accept: ["[Está muy bien|Me parece muy bien] que participes en el proyecto."] },
    { en: "It's so good that you're here! (to a friend)", es: "¡Qué bueno que estés aquí!", accept: ["¡Qué [bueno|bien] que estés aquí!"] }
  ],
  translate: [
    { en: "I think it's awful that they want to close the park.", es: "Me parece fatal que quieran cerrar el parque.", accept: [] },
    { en: "It's good to help others.", es: "Está bien ayudar a los demás.", accept: ["Está (muy) bien ayudar a los demás.", "Es bueno ayudar a los demás."] },
    { en: "My mother thinks it's wrong that I smoke.", es: "A mi mamá le parece mal que fume.", accept: ["A mi [mamá|madre] le parece mal que (yo) fume."] },
    { en: "We think it's great that you're studying more. (to a friend)", es: "Nos parece muy bien que estudies más.", accept: ["Nos parece [muy bien|genial] que estudies más."] },
    { en: "It's so good that you came!", es: "¡Qué bueno que viniste!", accept: ["¡Qué [bueno|bien] que viniste!"] }
  ],
  register: [
    { es: "¡Qué bueno que estudies medicina!", en: "How great that you're studying medicine!", when: "with family or friends, when you are truly glad" },
    { es: "Me parece genial que estudies medicina.", en: "I think it's great that you're studying medicine.", when: "with friends, warm and keen" },
    { es: "Me parece bien que estudie medicina.", en: "I think it's fine that you're studying medicine.", when: "to someone you call usted, calm and measured" },
    { es: "Me parece fatal que dejes la carrera.", en: "I think it's awful that you're dropping out.", when: "with friends only, when it really annoys you" }
  ],
  personal: {
    prompt: "Think of a decision someone close to you made this year. Say what you think of it, and name who decided.",
    constraints: [
      { type: "regex", pattern: "parece (muy )?(bien|mal|genial|fatal) que", label: "*me parece bien que* or *me parece mal que*" },
      { type: "subjunctiveAfter", trigger: "parece", within: 8, label: "the subjunctive for what they do" }
    ],
    model: "Me parece muy bien que mi hermana estudie medicina, pero me parece mal que trabaje tanto."
  },
  pitfalls: [
    "*Me parece bien que vienes* is the slip: you are judging, so *vengas*, even if it is true.",
    "For your own action, skip *que*: *me parece bien ir*, not *me parece bien que yo vaya*.",
    "*¡Qué bueno!* is a real reaction. For calm feedback at work, *me parece bien* sounds right."
  ]
},

"fn-posicionarse-b1": {
  source: "merged",
  hook: {
    line: "Your building in Bogotá votes on Saturday about banning parking in the courtyard. Nobody wants to know whether you agree with one particular neighbour. They want to know which side you are on.",
    es: "¿Usted está a favor o en contra?\nEstoy en contra de que prohíban parquear.",
    en: "Are you for or against?\nI'm against them banning parking."
  },
  examples: [
    { es: "Estoy a favor de reducir la jornada laboral.", en: "I'm in favour of shortening the working day." },
    { es: "Estoy en contra de que cierren la biblioteca.", en: "I'm against them closing the library." },
    { es: "No estoy de acuerdo con lo que dijiste, pero estoy a favor de la idea.", en: "I don't agree with what you said, but I'm in favour of the idea." }
  ],
  rule: "To take a side on an issue, use *estar a favor de* or *estar en contra de*, always with *estar*. After *de* comes one of three things:\na thing: *a favor del parque* (*de* and *el* make *del*)\nan action: *en contra de vender*\n*que* and what others would do, in the subjunctive: *en contra de que cierren*. Nobody has closed anything yet; you hold the idea up and take a side on it.\n*Estar de acuerdo* is narrower: it answers one claim or one person. You can be in favour of an idea and still not agree with how someone put it.\nPraise is short: *¡Bien dicho!* for what someone said, *¡Bien hecho!* for what they did.",
  readAndPick: [
    { q: "Who would close the park?", es: "Estoy en contra de que cierren el parque.",
      options: ["I would", "You would, my friend", "They would"], answer: 2,
      why: "*Cierren* ends in *-n*: they. She takes a side on what they plan to do." },
    { q: "Your friend has just made a sharp point at the meeting. What are you praising?", es: "¡Bien dicho!",
      options: ["What she said", "What she did", "How she looks"], answer: 0,
      why: "*Dicho* is said. For something done, *¡Bien hecho!*" },
    { q: "What does she think?", es: "No estoy de acuerdo contigo, pero estoy a favor de la idea.",
      options: ["She is against the idea and against you", "She likes the idea, not your point", "She agrees with you on every single point"], answer: 1,
      why: "*A favor de la idea* takes the side; *no estoy de acuerdo contigo* answers your point." },
    { q: "What is being asked?", es: "¿Están a favor del nuevo horario?",
      options: ["Whether they like the boss", "Which side they take", "When the hours begin"], answer: 1,
      why: "*A favor* asks for a side: for or against the new hours." }
  ],
  yourTurn: [
    { en: "I'm in favour of shortening the working day.", es: "Estoy a favor de reducir la jornada laboral.", accept: ["Estoy a favor de [reducir|acortar] la jornada (laboral)."] },
    { en: "I'm against them closing the library.", es: "Estoy en contra de que cierren la biblioteca.", accept: [] },
    { en: "Are you for or against the proposal? (to a friend)", es: "¿Estás a favor o en contra de la propuesta?", accept: [] },
    { en: "Well said!", es: "¡Bien dicho!", accept: [] },
    { en: "I'm against them privatizing healthcare.", es: "Estoy en contra de que privaticen la salud.", accept: ["Estoy en contra de que [privaticen|se privatice] la salud."] }
  ],
  translate: [
    { en: "Well done, you did it! (to a friend)", es: "¡Bien hecho, lo lograste!", accept: ["¡Bien hecho, lo [lograste|conseguiste]!"] },
    { en: "I agree with what you said. (to a friend)", es: "Estoy de acuerdo con lo que dijiste.", accept: [] },
    { en: "We're against selling the building.", es: "Estamos en contra de vender el edificio.", accept: [] },
    { en: "I'm in favour of the new park.", es: "Estoy a favor del nuevo parque.", accept: [] },
    { en: "Most of the neighbours are against it.", es: "La mayoría de los vecinos está en contra.", accept: ["La mayoría de los vecinos [está|están] en contra."] }
  ],
  register: [
    { es: "Yo estoy con Carlos en esto.", en: "I'm with Carlos on this.", when: "with friends, to back someone up" },
    { es: "Estoy a favor.", en: "I'm in favour.", when: "anywhere, to give your side plainly" },
    { es: "Apoyo la propuesta.", en: "I support the proposal.", when: "at work or a meeting, short and clear" },
    { es: "Me opongo a que cierren la biblioteca.", en: "I'm opposed to them closing the library.", when: "at a formal meeting or in a letter" }
  ],
  personal: {
    prompt: "Pick a real issue where you live or work. Say which side you are on, and one thing you are against with *en contra de que*.",
    constraints: [
      { type: "containsWord", word: "a favor de", label: "what you are in favour of, with *a favor de*" },
      { type: "subjunctiveAfter", trigger: "en contra de que", label: "what you are against: *en contra de que* and the subjunctive" }
    ],
    model: "Estoy a favor de más ciclovías, pero estoy en contra de que cierren la avenida todos los días."
  },
  pitfalls: [
    "*Soy en contra* is not Spanish: taking a side is always *estar*.",
    "*En contra que cierren* drops a word: keep the *de* before *que*."
  ]
},

"fn-contraargumento-b1": {
  source: "merged",
  hook: {
    line: "Your friend wants the expensive running shoes and you think the cheap ones will do. Say a flat no and the conversation is over. Grant her something first, and she will actually hear the rest.",
    es: "Tienes razón, son mejores, pero no tenemos plata.",
    en: "You're right, they're better, but we don't have the money."
  },
  examples: [
    { es: "Es cierto que es caro, pero también dura mucho más.", en: "It's true that it's expensive, but it also lasts much longer." },
    { es: "Tienes razón en lo del precio, aunque la calidad lo justifica.", en: "You're right about the price, although the quality justifies it." },
    { es: "Sí, pero por otra parte, no todos pueden pagarlo.", en: "Yes, but on the other hand, not everyone can pay for it." }
  ],
  rule: "A good counter grants something first, then turns. A bare *pero* sounds like a flat no.\nGrant it fully: *Tienes razón, pero...* Say what about: *Tienes razón en que es lejos* or *en lo del precio*.\nGrant a fact: *Es cierto que es caro, pero...* At work or in writing, *sin embargo* is the careful turn.\nAdd a competing fact: *Sí, pero también es verdad que...*\nOpen another angle with *por otra parte*: it widens the question instead of attacking the point.\nSoften the turn with *aunque*, and what follows sounds like a side note.\nName what was missed: *Hay que tener en cuenta el precio.*",
  readAndPick: [
    { q: "Does she accept your point?", es: "Tienes razón, pero es muy caro.",
      options: ["Yes, and then she objects", "No, she rejects it outright", "Yes, and she agrees fully"], answer: 0,
      why: "*Tienes razón* grants it; *pero* turns it." },
    { q: "What kind of reply is this?", es: "No, eso no es así.",
      options: ["A point given first", "A question back to you", "Flat disagreement"], answer: 2,
      why: "Nothing is granted before the no, so it lands as a flat contradiction." },
    { q: "What is he granting?", es: "Tienes razón en que es lejos, pero el arriendo es más barato.",
      options: ["That it is far away", "That rent is cheap", "That he was wrong"], answer: 0,
      why: "*Tienes razón en que* names the point granted: it is far." },
    { q: "What does *por otra parte* bring in?", es: "Sí, aunque por otra parte hay que tener en cuenta el precio.",
      options: ["A much harder attack", "Another angle on it", "Her full agreement"], answer: 1,
      why: "*Por otra parte* widens the question instead of attacking the point." },
    { q: "What has nobody mentioned yet?", es: "Hay que tener en cuenta lo que cuesta.",
      options: ["How good it is", "How long it takes", "What it costs"], answer: 2,
      why: "*Tener en cuenta* names what was missed: what it costs." }
  ],
  yourTurn: [
    { en: "You're right, but they have to ask before deciding.", es: "Tienes razón, pero tienen que preguntar antes de decidir.", accept: ["Tiene razón, pero tienen que preguntar antes de decidir."] },
    { en: "Yes, that's true, but we don't have time.", es: "Sí, es cierto, pero no tenemos tiempo.", accept: ["Sí, es [cierto|verdad], pero no tenemos tiempo."] },
    { en: "You're right that it's far, but the rent is cheaper. (to a friend)", es: "Tienes razón en que es lejos, pero el arriendo es más barato.", accept: ["Tienes razón en que [es|queda] lejos, pero el [arriendo|alquiler] es más barato."] },
    { en: "You have to take the price into account.", es: "Hay que tener en cuenta el precio.", accept: ["[Hay que|Tienes que] tener en cuenta el precio.", "Hay que tener el precio en cuenta."] },
    { en: "Yes, but it's also true that you've never tried it. (to a friend)", es: "Sí, pero también es cierto que nunca lo intentaste.", accept: ["Sí, pero también es [cierto|verdad] que [nunca lo intentaste|nunca lo has intentado|no lo has intentado nunca]."] }
  ],
  translate: [
    { en: "Yes, although on the other hand the time has to be taken into account.", es: "Sí, aunque por otra parte hay que tener en cuenta el tiempo.", accept: ["Sí, aunque, por otra parte, hay que tener en cuenta el tiempo."] },
    { en: "That's true; however, we don't have the money.", es: "Es cierto; sin embargo, no tenemos la plata.", accept: ["Es [cierto|verdad]; sin embargo, no tenemos [la plata|el dinero]."] },
    { en: "Yes, that's true, but it's more a political problem than a social one.", es: "Sí, es cierto, pero es un problema más político que social.", accept: [] },
    { en: "You're right, although I see it differently. (to a friend)", es: "Tienes razón, aunque yo lo veo distinto.", accept: ["Tienes razón, aunque yo lo veo [distinto|diferente|de otra manera]."] },
    { en: "We have to take the neighbours into account.", es: "Tenemos que tener en cuenta a los vecinos.", accept: [] }
  ],
  register: [
    { es: "Sí, pero es caro.", en: "Yes, but it's expensive.", when: "with friends, quick and light" },
    { es: "Tienes razón, pero es caro.", en: "You're right, but it's expensive.", when: "to grant a real point before you push back" },
    { es: "Es cierto; sin embargo, es caro.", en: "That's true; however, it's expensive.", when: "at work or in writing, a little more careful" },
    { es: "Entiendo su punto, pero es caro.", en: "I understand your point, but it's expensive.", when: "to someone you call usted, to stay polite" },
    { es: "Por otra parte, hay que tener en cuenta lo que cuesta.", en: "On the other hand, what it costs has to be taken into account.", when: "in a meeting, to bring in what nobody mentioned" }
  ],
  personal: {
    prompt: "Someone tells you: *Vivir en el centro es mejor.* Grant them one real point, then turn it.",
    constraints: [
      { type: "regex", pattern: "(tienes razón|tiene razón|es cierto|es verdad)[^.]*\\b(pero|aunque|sin embargo)\\b", label: "a real point granted, then *pero*, *aunque* or *sin embargo*" },
      { type: "minWords", n: 8, label: "at least eight words" }
    ],
    model: "Tienes razón, es más cómodo, pero el arriendo en el centro es carísimo."
  },
  pitfalls: [
    "A bare *pero* with nothing granted sounds like a flat no, even when you meant it kindly.",
    "*Tienes razón que es lejos* drops a word: *tienes razón en que*."
  ]
},

"fn-preguntar-si-acuerdo-b1": {
  source: "merged",
  hook: {
    line: "You've just told your team you think Friday's event should be called off. Now you need to know if they are with you, without sounding as if you are pushing. Asking what someone thinks and asking if they think the same are two different moves.",
    es: "Creo que hay que cancelarlo. ¿Piensas lo mismo?",
    en: "I think it has to be cancelled. Do you think the same?"
  },
  examples: [
    { es: "El jefe anunció cambios en el equipo. ¿Tú qué opinas?", en: "The boss announced changes to the team. What do you think?" },
    { es: "¿A ti qué te parece la nueva política de la empresa?", en: "What do you make of the company's new policy?" },
    { es: "¿Coincide usted con esta valoración?", en: "Do you agree with this assessment?" }
  ],
  rule: "Two moves, and they do different jobs.\nOpen the floor when nothing is on the table yet: *¿Tú qué piensas?* *¿Tú qué opinas?* *¿A ti qué te parece?* *¿Qué opinas del plan?* (*de* and *el* make *del*).\nCheck whether they are with you, once you have said yours: *¿Piensas lo mismo?* *¿Estás de acuerdo?* Or add it at the end: *Es buena idea, ¿no crees?*, which hopes for a yes.\nIn the open questions the person often comes first: *¿Tú qué crees?* For *usted*: *¿Usted qué opina?* For a group: *¿Ustedes qué piensan?*\nAt a formal meeting: *¿Coincide usted con esta idea?*",
  readAndPick: [
    { q: "What has the speaker already done?", es: "¿Piensas lo mismo que yo?",
      options: ["Given her own view", "Asked for the facts", "Changed the subject"], answer: 0,
      why: "*Lo mismo que yo* only works once her view is on the table." },
    { q: "Who is being asked?", es: "¿Usted qué opina?",
      options: ["A friend she calls tú", "Everyone in the room", "Someone she calls usted"], answer: 2,
      why: "*Usted* and *opina*: one person she speaks to formally." },
    { q: "What answer is she hoping for?", es: "Es buena idea, ¿no crees?",
      options: ["No", "Yes", "Either one"], answer: 1,
      why: "A tag like *¿no crees?* leans toward a yes." },
    { q: "What is she asking about?", es: "¿Qué opinas del nuevo horario?",
      options: ["The new boss", "The old schedule", "The new schedule"], answer: 2,
      why: "*Del* is *de* and *el*: of the new schedule." },
    { q: "What does this question do?", es: "¿Tú qué opinas?",
      options: ["It asks for a view", "It checks agreement", "It closes the topic"], answer: 0,
      why: "It opens the floor: nothing has to be on the table yet." }
  ],
  yourTurn: [
    { en: "What do you think? (to a friend)", es: "¿Tú qué piensas?", accept: ["¿Tú qué [piensas|opinas|crees]?", "¿Qué [piensas|opinas|crees] (tú)?"] },
    { en: "Do you think the same as me? (to a friend)", es: "¿Piensas lo mismo que yo?", accept: ["¿Tú piensas lo mismo que yo?"] },
    { en: "What do you make of the company's new policy? (to a friend)", es: "¿A ti qué te parece la nueva política de la empresa?", accept: ["¿Qué te parece la nueva política de la empresa?"] },
    { en: "What do you think? (polite)", es: "¿Usted qué opina?", accept: ["¿Usted qué [opina|piensa|cree]?", "¿Qué [opina|piensa|cree] (usted)?"] },
    { en: "It's a good idea, don't you think?", es: "Es una buena idea, ¿no crees?", accept: ["Es (una) buena idea, ¿no [crees|cree|te parece|le parece]?"] }
  ],
  translate: [
    { en: "Do you agree with this assessment? (polite)", es: "¿Coincide usted con esta valoración?", accept: ["¿Usted [coincide|está de acuerdo] con esta valoración?", "¿[Coincide|Está de acuerdo] con esta valoración?", "¿Está usted de acuerdo con esta valoración?"] },
    { en: "The boss announced changes to the team. What do you think? (to a friend)", es: "El jefe anunció cambios en el equipo. ¿Tú qué opinas?", accept: ["El jefe anunció cambios en el equipo. ¿(Tú) qué [opinas|piensas]?"] },
    { en: "What do you all think of the new schedule?", es: "¿Ustedes qué piensan del nuevo horario?", accept: ["¿Ustedes qué [piensan|opinan] del nuevo horario?", "¿Qué [piensan|opinan] (ustedes) del nuevo horario?"] },
    { en: "Do you agree? (to a friend)", es: "¿Estás de acuerdo?", accept: [] },
    { en: "What do you think of Medellín? (to a friend)", es: "¿Qué opinas de Medellín?", accept: ["¿Qué [opinas|piensas] de Medellín?"] }
  ],
  register: [
    { es: "¿Tú qué crees?", en: "What do you reckon?", when: "with a friend, casual" },
    { es: "¿A ti qué te parece?", en: "What do you make of it?", when: "with anyone you call tú, a little softer" },
    { es: "¿Usted qué opina?", en: "What's your opinion?", when: "to a client, a boss or an older person" },
    { es: "¿Coincide usted con esta valoración?", en: "Do you agree with this assessment?", when: "at a formal meeting or in a written survey" },
    { es: "Es buena idea, ¿no crees?", en: "It's a good idea, don't you think?", when: "when you hope they will say yes" }
  ],
  personal: {
    prompt: "Write a short message to a friend: give your view on a plan, then check whether they agree.",
    constraints: [
      { type: "containsAny", words: ["creo que", "me parece que", "para mí", "en mi opinión", "pienso que"], label: "your view first" },
      { type: "regex", pattern: "¿[^?]*(lo mismo|de acuerdo|no crees|no te parece|qué piensas|qué opinas|qué crees)[^?]*\\?", label: "then a question that checks, like *¿piensas lo mismo?* or *¿no crees?*" }
    ],
    model: "Creo que es mejor salir temprano para Villa de Leyva. ¿Piensas lo mismo?"
  },
  pitfalls: [
    "*¿Qué tú piensas?* is normal in the Caribbean; elsewhere, say *¿Tú qué piensas?* or *¿Qué piensas tú?*",
    "*¿Piensas lo mismo?* before you have said anything leaves the other person guessing what *lo mismo* is."
  ]
},

"fn-mostrar-escepticismo-b1": {
  source: "merged",
  hook: {
    line: "A coworker swears the new manager is going to give everyone Fridays off. You don't believe a word of it, but you don't want to call him a liar either. Spanish gives you a whole ladder of doubt, from a raised eyebrow to a flat no.",
    es: "¿Tú crees? Dudo que sea tan fácil.",
    en: "You think so? I doubt it's that easy."
  },
  examples: [
    { es: "Todo va a salir perfecto.\nBueno, depende.", en: "Everything is going to go perfectly.\nWell, it depends." },
    { es: "Dudo que haya una solución tan sencilla.", en: "I doubt there's such a simple solution." },
    { es: "Nadie se va a dar cuenta.\n¿Tú crees?", en: "Nobody is going to notice.\nYou think so?" }
  ],
  rule: "Doubt comes in steps, from soft to strong:\n*Bueno, depende.* You hesitate.\n*Puede ser, pero...* You half grant it.\n*¿Tú crees?* You throw the claim back.\n*No me convence.* The idea does not win you over.\n*Lo dudo.* *Dudo que...* You say it.\n*No me lo creo.* Flat disbelief.\n*Dudo que* always takes the subjunctive: *Dudo que sea verdad.* Cover the opening and nobody is claiming the rest.\n*No dudo que* says you are sure, so the ordinary form is natural: *No dudo que tienes razón.*\n*Me extraña que* (I find it odd that) reacts, so it takes the subjunctive too: *Me extraña que no llame.*",
  readAndPick: [
    { q: "She doubts that someone knows. Who?", es: "Dudo que lo sepan.",
      options: ["You do", "They do", "He does"], answer: 1,
      why: "*Sepan* ends in *-n*: they. After *dudo que*, always the subjunctive." },
    { q: "How sure is he that you're right?", es: "No dudo que tienes razón.",
      options: ["He doubts it", "He is sure", "He hopes so"], answer: 1,
      why: "*No dudo que* is certainty, so the ordinary *tienes*." },
    { q: "How does she take the idea?", es: "Puede ser, pero no me convence.",
      options: ["She isn't persuaded", "She loves it", "She's angry about it"], answer: 0,
      why: "*Puede ser* half grants it; *no me convence* says it does not win her over." },
    { q: "What does she find odd?", es: "Me extraña que no llame.",
      options: ["That he called twice", "That she can't call him", "That he doesn't call"], answer: 2,
      why: "*Me extraña que* reacts to it, so *llame*, though it is true." },
    { q: "Your friend says nobody will notice. What are you doing?", es: "¿Tú crees?",
      options: ["Doubting it", "Asking for facts", "Agreeing"], answer: 0,
      why: "*¿Tú crees?* throws the claim back: you doubt it, without saying so." }
  ],
  yourTurn: [
    { en: "I doubt there's such a simple solution.", es: "Dudo que haya una solución tan sencilla.", accept: ["Dudo que haya una solución tan [sencilla|fácil]."] },
    { en: "You think so? (to a friend)", es: "¿Tú crees?", accept: ["¿Crees?", "¿Tú lo crees?"] },
    { en: "I doubt it's that easy.", es: "Dudo que sea tan fácil.", accept: [] },
    { en: "It doesn't convince me.", es: "No me convence.", accept: [] },
    { en: "Maybe, but I doubt they know.", es: "Puede ser, pero dudo que lo sepan.", accept: ["Puede ser, pero dudo que (lo) sepan."] }
  ],
  translate: [
    { en: "I don't believe it.", es: "No me lo creo.", accept: ["No (me) lo creo."] },
    { en: "I doubt the boss will give us Friday off.", es: "Dudo que el jefe nos dé el viernes libre.", accept: [] },
    { en: "Well, it depends.", es: "Bueno, depende.", accept: ["Pues, depende."] },
    { en: "I find it odd that she doesn't call.", es: "Me extraña que no llame.", accept: [] },
    { en: "No way! That's not true.", es: "¡Qué va! Eso no es verdad.", accept: ["¡Qué va! Eso no es [verdad|cierto]."] }
  ],
  register: [
    { es: "¿En serio?", en: "Really?", when: "with anyone, the lightest doubt" },
    { es: "¿Tú crees?", en: "You think so?", when: "with a friend, to throw the claim back" },
    { es: "No me convence.", en: "It doesn't convince me.", when: "at work too: you doubt the idea, not the person" },
    { es: "Lo dudo mucho.", en: "I very much doubt it.", when: "when you want your doubt on record" },
    { es: "No me lo creo.", en: "I don't believe it.", when: "with friends, flat disbelief" }
  ],
  personal: {
    prompt: "Someone tells you something hard to believe: a rumour at work, a friend's big plan. Throw it back, then say what you doubt.",
    constraints: [
      { type: "containsAny", words: ["tú crees", "en serio", "no me convence", "puede ser", "depende", "lo dudo"], label: "a first step of doubt: *¿tú crees?*, *¿en serio?* or *puede ser*" },
      { type: "subjunctiveAfter", trigger: "dudo que", label: "what you doubt: *dudo que* and the subjunctive" }
    ],
    model: "¿En serio? Dudo que el jefe nos dé el viernes libre."
  },
  pitfalls: [
    "*Dudo que tienes razón* is the slip: *dudo que* always asks for *tengas*.",
    "*¿Tú crees?* said flatly is real doubt, not a friendly check. The tone carries it."
  ]
},

"dc-intensificar-acuerdo-desacuerdo-b1": {
  source: "merged",
  hook: {
    line: "Your neighbour asks whether you're coming to her daughter's quinceañera. A single *sí* sounds lukewarm. People double the word or reach for a fixed phrase, and the same tricks make a no sound final.",
    es: "¿Vienes a la fiesta?\nClaro, claro, ahí nos vemos.",
    en: "Are you coming to the party?\nOf course, of course, see you there."
  },
  examples: [
    { es: "¿Fuiste tú quien lo rompió?\nNo, no, yo no fui.", en: "Was it you who broke it?\nNo, no, it wasn't me." },
    { es: "¿Es difícil el examen?\n¡Qué va! Es bastante fácil.", en: "Is the exam hard?\nNot at all! It's pretty easy." },
    { es: "¿Me ayudas?\n¡Cómo no!", en: "Will you help me?\nOf course!" }
  ],
  rule: "Say the short word twice, with a comma: *claro, claro*, *sí, sí*, *no, no*. The meaning stays the same; the force goes up.\nFixed phrases do the same job.\nFor a strong yes: *¡Cómo no!* *Por supuesto.* *Sin duda.*\nFor a strong no: *¡Qué va!* *Para nada.* *Ni hablar.* *En absoluto.*\nTurn up agreement with *totalmente* or *completamente*: *Estoy totalmente de acuerdo.*\nTwo traps. *¡Qué va!* disagrees, while *¡Cómo no!* agrees. And *en absoluto* on its own means not at all, never absolutely.",
  readAndPick: [
    { q: "Does she think he'll win?", es: "¡Qué va! No tiene ninguna posibilidad.",
      options: ["Yes, easily", "Not at all", "Maybe, with luck"], answer: 1,
      why: "*¡Qué va!* is a strong no, and the next line backs it up." },
    { q: "Does it bother her?", es: "¿Te molesta?\nEn absoluto.",
      options: ["Absolutely", "A little", "Not at all"], answer: 2,
      why: "*En absoluto* alone means not at all. It looks like absolutely, but it is a no." },
    { q: "What is he saying?", es: "¡Cómo no, siga!",
      options: ["Of course, come in", "How? Please go on", "No, please stay out"], answer: 0,
      why: "*¡Cómo no!* is a warm yes; *siga* waves you in." },
    { q: "How much did she like it?", es: "Sí, sí, muchísimo.",
      options: ["Not so much", "Not at all", "A great deal"], answer: 2,
      why: "The doubled *sí* and *muchísimo* both turn it up." },
    { q: "What kind of answer is this?", es: "¿Me prestas el carro?\nNi hablar.",
      options: ["A warm yes", "A firm no", "A maybe"], answer: 1,
      why: "*Ni hablar* shuts the door: no way." }
  ],
  yourTurn: [
    { en: "Of course, of course, see you there.", es: "Claro, claro, ahí nos vemos.", accept: ["Claro, claro, [ahí|allá] nos vemos."] },
    { en: "No, no, it wasn't me.", es: "No, no, yo no fui.", accept: ["No, no, no fui yo.", "No, no, no fui."] },
    { en: "Not at all! It's pretty easy.", es: "¡Qué va! Es bastante fácil.", accept: ["¡[Qué va|Para nada]! Es bastante fácil."] },
    { en: "Without any doubt, it's the best option.", es: "Sin duda alguna, es la mejor opción.", accept: ["Sin [duda alguna|ninguna duda|duda], es la mejor opción."] },
    { en: "Of course, come in!", es: "¡Cómo no, siga!", accept: ["¡[Cómo no|Claro], [siga|sigue|pase|pasa|adelante]!"] }
  ],
  translate: [
    { en: "I completely agree.", es: "Estoy totalmente de acuerdo.", accept: ["Estoy [totalmente|completamente] de acuerdo."] },
    { en: "Not in the slightest.", es: "Para nada.", accept: ["En absoluto."] },
    { en: "No way, I'm not going.", es: "Ni hablar, no voy.", accept: ["[Ni hablar|Para nada], no voy."] },
    { en: "Yes, yes, I loved it.", es: "Sí, sí, me encantó.", accept: [] },
    { en: "It doesn't bother me at all.", es: "No me molesta en absoluto.", accept: ["No me molesta [en absoluto|para nada|nada]."] }
  ],
  register: [
    { es: "Claro, claro.", en: "Of course, of course.", when: "with anyone, warm and quick" },
    { es: "¡Cómo no!", en: "Of course!", when: "to a request, friendly and generous" },
    { es: "¡Ni de riesgos!", en: "No way!", when: "in Colombia, with friends only" },
    { es: "Por supuesto.", en: "Certainly.", when: "at work, or with people you call usted" },
    { es: "En absoluto.", en: "Not at all.", when: "polite and firm, in speech or in writing" }
  ],
  personal: {
    prompt: "A friend asks you two things: *¿Vienes el sábado?* and *¿Te molesta si llevo a mi primo?* Answer both with force.",
    constraints: [
      { type: "regex", pattern: "([a-záéíóúñ]+), \\1(?![a-záéíóúñ])", label: "a word said twice, with a comma" },
      { type: "containsAny", words: ["cómo no", "por supuesto", "para nada", "en absoluto", "qué va", "ni hablar", "sin duda"], label: "a fixed phrase, like *para nada* or *¡cómo no!*" }
    ],
    model: "Claro, claro, ahí nos vemos. ¿Tu primo? No me molesta para nada."
  },
  pitfalls: [
    "*En absoluto* answers no: *¿Te molesta? En absoluto.* For a strong yes, say *totalmente* or *¡claro que sí!*",
    "*¡Qué va!* is a strong no. Said to a request for help, it sounds like a refusal."
  ]
},

"fn-respuesta-afirmativa-b1": {
  source: "merged",
  hook: {
    line: "A visitor tells you, very confidently, that Medellín is the capital of Colombia. You don't just want to say no. You want to put the right answer in its place, in the same breath, and Spanish has one small word for exactly that.",
    es: "La capital no es Medellín, sino Bogotá.",
    en: "The capital isn't Medellín, it's Bogotá."
  },
  examples: [
    { es: "No es profesor, sino investigador.", en: "He isn't a teacher, he's a researcher." },
    { es: "No fue ayer, sino anteayer.", en: "It wasn't yesterday, it was the day before yesterday." },
    { es: "No es caro, pero queda lejos.", en: "It isn't expensive, but it's far." }
  ],
  rule: "English uses but for two jobs, and Spanish splits them.\n*sino* swaps: the first half says no, and the second gives the right piece instead. *No es profesor, sino investigador.* It only comes after a negative, and you do not repeat the verb.\n*pero* adds: both halves are true. *No es caro, pero queda lejos.*\nThe test: if instead or it's actually fits your English, use *sino*. If but still or but also fits, use *pero*.\nWatch the spelling: *sino* is one word. *Si no*, two words, means if not: *Si no vienes, te llamo.*\nIn speech you can also correct by repeating the *no*: *No, no, no está en Cali.*",
  readAndPick: [
    { q: "What is it?", es: "No es caro, sino barato.",
      options: ["Not cheap, but good", "Expensive but worth it", "Cheap, not expensive"], answer: 2,
      why: "*Sino* swaps the wrong word for the right one: not expensive, cheap." },
    { q: "Is the place far?", es: "No es caro, pero queda lejos.",
      options: ["Yes, though it's cheap", "No, it's close and cheap", "No, it's cheap instead"], answer: 0,
      why: "*Pero* adds a second fact; both halves are true." },
    { q: "Where does he live?", es: "No vivo en Cali, sino en Pereira.",
      options: ["In Cali", "In Pereira", "In both cities"], answer: 1,
      why: "After *sino* comes the right answer: Pereira." },
    { q: "When will she call?", es: "Si no vienes, te llamo.",
      options: ["Instead of coming", "If you don't come", "Once you arrive"], answer: 1,
      why: "*Si no*, two words, means if not. *Sino*, one word, swaps." },
    { q: "What does the doubled *no* do?", es: "No, no, no está en Cartagena.",
      options: ["Makes the no firmer", "Asks a real question", "Turns it into a yes"], answer: 0,
      why: "Repeating *no* turns up the denial, the way *claro, claro* turns up a yes." }
  ],
  yourTurn: [
    { en: "He isn't a teacher, he's a researcher.", es: "No es profesor, sino investigador.", accept: [] },
    { en: "It wasn't yesterday, it was the day before yesterday.", es: "No fue ayer, sino anteayer.", accept: ["No fue ayer, sino [anteayer|antier|antes de ayer]."] },
    { en: "I don't want coffee, I want water.", es: "No quiero café, sino agua.", accept: [] },
    { en: "It isn't expensive, but it's far.", es: "No es caro, pero queda lejos.", accept: ["No es caro, pero [queda|es|está] lejos."] },
    { en: "If you don't come, I'll call you. (to a friend)", es: "Si no vienes, te llamo.", accept: ["Si no vienes, te [llamo|voy a llamar]."] }
  ],
  translate: [
    { en: "Cali isn't in Antioquia, it's in the Valle del Cauca.", es: "Cali no está en Antioquia, sino en el Valle del Cauca.", accept: ["Cali no está en Antioquia, sino en el Valle (del Cauca)."] },
    { en: "No, no, it isn't in Cartagena.", es: "No, no, no está en Cartagena.", accept: [] },
    { en: "She isn't a doctor, she's a nurse.", es: "No es médica, sino enfermera.", accept: ["No es [médica|doctora], sino enfermera."] },
    { en: "I'm not from Bogotá, I'm from Toronto.", es: "No soy de Bogotá, sino de Toronto.", accept: [] },
    { en: "It wasn't on Tuesday, it was on Wednesday.", es: "No fue el martes, sino el miércoles.", accept: [] }
  ],
  register: [
    { es: "No, no, es en Cali.", en: "No, no, it's in Cali.", when: "with friends, quick and firm" },
    { es: "No es en Medellín, sino en Cali.", en: "It isn't in Medellín, it's in Cali.", when: "anywhere, to swap the wrong piece cleanly" },
    { es: "Perdón, pero creo que es en Cali.", en: "Sorry, but I think it's in Cali.", when: "to a stranger, to correct softly" },
    { es: "Me parece que se equivoca: es en Cali.", en: "I think you're mistaken: it's in Cali.", when: "to someone you call usted, careful and polite" },
    { es: "En realidad, es en Cali.", en: "Actually, it's in Cali.", when: "at work or in writing, neutral and calm" }
  ],
  personal: {
    prompt: "Correct something people often get wrong about you: where you're from, where you live or what you do. Use *no* and then *sino*.",
    constraints: [
      { type: "regex", pattern: "\\bno\\b[^.]*\\bsino\\b", label: "*no* first, then *sino* with the right piece" },
      { type: "minWords", n: 6, label: "at least six words" }
    ],
    model: "No soy de Estados Unidos, sino de Canadá, y no vivo en Toronto, sino en Montreal."
  },
  pitfalls: [
    "*No es caro, sino lejos* breaks the swap: far does not replace expensive. Both are true, so *pero queda lejos*.",
    "*Sino* is one word. *Si no*, two words, is if not."
  ]
},

"task-b1-debate": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a conversation of twelve turns or more between two people who disagree. Both of them give ground at some point, and nobody just repeats themselves. That is what keeps it from turning into a row.",
    es: "Tienes razón en lo de la contaminación, no lo discuto.\nPero mucha gente mayor no puede ir caminando.",
    en: "You're right about the pollution, I won't argue with that.\nBut a lot of older people can't go on foot."
  },
  examples: [
    { es: "En eso no estoy de acuerdo.", en: "I don't agree with that." },
    { es: "Estoy de acuerdo en parte, pero primero hay que arreglar el transporte.", en: "I partly agree, but first the transport has to be fixed." },
    { es: "Bueno, eso sí es verdad.", en: "Well, that much is true." }
  ],
  rule: "Each turn has to move the argument. These are the moves.\nDisagree calmly: *En eso no estoy de acuerdo.*\nGrant something real: *Tienes razón en lo de la contaminación.* *No lo discuto.*\nPush back: *Pues sí, pero...* *Sin embargo,*\nAgree in part: *Estoy de acuerdo en parte.*\nBack it up: *porque*, *además*.\nGive ground near the end: *Bueno, eso sí es verdad.* *En eso sí te doy la razón.*\nIn those last two, *sí* does not mean yes. It underlines the point: that one, at least, you grant.\nGranting a point is not weakness. It is what earns you the right to be heard.",
  readAndPick: [
    { q: "What is he doing?", es: "Pues sí, pero para eso está el transporte público.",
      options: ["Agreeing with every point", "Changing the subject now", "Pushing back with a reason"], answer: 2,
      why: "*Pues sí, pero* grants a little, then a reason pushes back." },
    { q: "What does she do here?", es: "Bueno, eso sí es verdad.",
      options: ["Grants one point", "Rejects his point", "Asks a question"], answer: 0,
      why: "*Eso sí es verdad*: that point, at least, she grants." },
    { q: "How much does he agree?", es: "Estoy de acuerdo en parte.",
      options: ["Fully", "In part", "Not at all"], answer: 1,
      why: "*En parte*: partly, which leaves room for a *pero*." },
    { q: "What is she granting?", es: "Tienes razón en lo de la contaminación.",
      options: ["Every single argument", "Nothing at all so far", "The pollution point"], answer: 2,
      why: "*En lo de* names the one point granted: the pollution." },
    { q: "What does *sí* add here?", es: "En eso sí te doy la razón.",
      options: ["It underlines that one point", "It turns it into a question", "It makes it negative"], answer: 0,
      why: "This *sí* is not yes: it underlines the one point she gives in on." }
  ],
  yourTurn: [
    { en: "I don't agree with that.", es: "En eso no estoy de acuerdo.", accept: ["No estoy de acuerdo [en eso|con eso]."] },
    { en: "You're right about the pollution, but the bus comes every half hour. (to a friend)", es: "Tienes razón en lo de la contaminación, pero el bus pasa cada media hora.", accept: ["Tienes razón en lo de la contaminación, pero el [bus|autobús] pasa cada media hora."] },
    { en: "I partly agree.", es: "Estoy de acuerdo en parte.", accept: ["En parte estoy de acuerdo."] },
    { en: "On that, I'll grant you're right. (to a friend)", es: "En eso sí te doy la razón.", accept: [] }
  ],
  translate: [
    { en: "First you have to fix the transport, and then ban the cars.", es: "Primero hay que arreglar el transporte y después prohibir los carros.", accept: ["Primero hay que arreglar el transporte y [después|luego] prohibir los [carros|coches]."] },
    { en: "Why not? There's a huge amount of pollution.", es: "¿Por qué no? Hay muchísima contaminación.", accept: [] },
    { en: "I think cars have to be banned in the centre.", es: "Creo que hay que prohibir los carros en el centro.", accept: ["Creo que hay que prohibir los [carros|coches] en el centro."] },
    { en: "However, a lot of older people can't go on foot.", es: "Sin embargo, mucha gente mayor no puede ir caminando.", accept: ["Sin embargo, mucha gente mayor no puede ir [caminando|a pie]."] },
    { en: "Well, that much is true.", es: "Bueno, eso sí es verdad.", accept: ["Bueno, eso sí es [verdad|cierto]."] }
  ],
  register: [
    { es: "Pues, no sé.", en: "Well, I don't know.", when: "to disagree softly with a friend" },
    { es: "Sí, pero no es tan fácil.", en: "Yes, but it's not that easy.", when: "in a quick back and forth" },
    { es: "En eso no estoy de acuerdo.", en: "I don't agree with that.", when: "anywhere, firm but calm" },
    { es: "Con todo respeto, no comparto esa idea.", en: "With all due respect, I don't share that view.", when: "to someone you call usted, or at work" },
    { es: "¡Para nada!", en: "Not at all!", when: "with friends, when you strongly disagree" }
  ],
  personal: {
    prompt: "Write the first four turns of an argument about something real, like a rule at work or a family plan. Put each turn on its own line, and make one person grant a point.",
    constraints: [
      { type: "minSentences", n: 4, label: "four turns or more" },
      { type: "containsAny", words: ["tienes razón", "es cierto", "es verdad", "en parte", "te doy la razón", "no lo discuto"], label: "a point granted" },
      { type: "containsAny", words: ["pero", "sin embargo"], label: "a push back with *pero* or *sin embargo*" }
    ],
    model: "Creo que hay que trabajar los sábados.\nPues, en eso no estoy de acuerdo.\n¿Por qué no? Hay mucho trabajo.\nTienes razón en lo del trabajo, pero la gente está cansada."
  },
  pitfalls: [
    "Repeating your first point louder is not a turn. Each line needs a new reason or a point granted.",
    "*Tienes razón en lo de* grants one point, not the whole argument, so a *pero* can follow."
  ]
}

};
