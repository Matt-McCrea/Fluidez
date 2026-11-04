/* ============================================================================
 * TEACHING SCRIPTS, B1 units 1 to 4 (window.SCRIPTS_B1), keyed by lesson id.
 * Units b1-u27 "What I think", b1-u28 "Agreeing and arguing", b1-u29 "Plans
 * and predictions" and b1-u30 "Advice and what I would do": every lesson on
 * the path from COURSE_BANDS.B1, the present subjunctive first.
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
 * that lesson's day. Units 1 and 2 use no future or conditional. The future
 * arrives on the first day of b1-u29 ("futuro") and is called "the -ré form";
 * the conditional arrives on the first day of b1-u30 ("condicional") and is
 * called "the -ría form". Before that day only the A2 politeness chunks
 * (podríamos, deberías, me gustaría) appear. No past subjunctive, no
 * pluperfect, no perfect subjunctive anywhere in these four units.
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
},

/* ---- unit b1-u29 · Plans and predictions --------------------------------- */

"futuro": {
  source: "merged",
  hook: {
    line: "Your friend Andrés has just moved to Bogotá and is worried about everything: the new job, the rent, the cold. You want to promise him it will all work out, and Spanish has a verb ending that sounds like a promise.",
    es: "Tranquilo, todo saldrá bien.\nYo te ayudaré con la mudanza.",
    en: "Relax, everything will turn out fine.\nI'll help you with the move."
  },
  examples: [
    { es: "Te llamaré esta noche.", en: "I'll call you tonight." },
    { es: "Mañana lloverá en Bogotá.", en: "It will rain in Bogotá tomorrow." },
    { es: "No contesta. Estará en una reunión.", en: "He isn't answering. He's probably in a meeting." }
  ],
  rule: "Keep the whole dictionary form and add one ending: *-é, -ás, -á, -emos, -án*.\n*llamar*: *llamaré, llamarás, llamará, llamaremos, llamarán*\nA few verbs shorten first: *tendré, podré, saldré, vendré, sabré, haré, diré, pondré, querré*, and *hay* becomes *habrá*.\nJob one, what will happen: promises (*Te llamaré*), forecasts (*Lloverá*), the news. For everyday plans, Colombians still say *voy a*: *Mañana voy a trabajar.*\nJob two, a guess about right now: *Estará en una reunión*, he's probably in a meeting. No *probablemente* needed: the ending carries it.\nThe test: a time word like *mañana* makes it a prediction; puzzling over now makes it a guess.",
  readAndPick: [
    { q: "When is she talking about?", es: "No contesta. Estará en la oficina.",
      options: ["Tomorrow morning", "Right now", "Last night"], answer: 1,
      why: "No time word, and a puzzle about now: *estará* is a guess. She's probably at the office." },
    { q: "Who will call?", es: "Te llamaremos mañana.",
      options: ["I will", "They will", "We will"], answer: 2,
      why: "*-emos* is we: *llamaremos*." },
    { q: "What is this?", es: "Mañana hará frío en Tunja.",
      options: ["A forecast", "A guess about this minute", "A habit, every day"], answer: 0,
      why: "*Mañana* is a future time, so *hará* predicts the weather." },
    { q: "How old is the neighbour?", es: "Tendrá unos setenta años.",
      options: ["Exactly seventy, she knows", "About seventy, she guesses", "Seventy on his next birthday"], answer: 1,
      why: "*Tendrá* with *unos*: a guess about his age right now." },
    { q: "Which verb is behind *saldremos*?", es: "Saldremos a las seis.",
      options: ["saltar, to jump", "salir, to leave", "saber, to know"], answer: 1,
      why: "*Salir* shortens to *saldr-*: *saldremos*, we'll leave." }
  ],
  yourTurn: [
    { en: "I promise I'll call you tonight. (to a friend)", es: "Te prometo que te llamaré esta noche.", accept: ["Te prometo que [te llamaré|te voy a llamar|te llamo] esta noche.", "Te prometo que esta noche te [llamaré|voy a llamar|llamo]."] },
    { en: "It won't be easy.", es: "No será fácil.", accept: ["No va a ser fácil."] },
    { en: "We'll be back on Monday.", es: "Volveremos el lunes.", accept: ["[Volveremos|Regresaremos|Vamos a volver|Vamos a regresar] el lunes."] },
    { en: "He must be about seventy.", es: "Tendrá unos setenta años.", accept: ["Tendrá [unos|como] setenta años."] },
    { en: "Where can Camila be?", es: "¿Dónde estará Camila?", accept: [] }
  ],
  translate: [
    { en: "Everything will turn out fine.", es: "Todo saldrá bien.", accept: ["Todo va a salir bien."] },
    { en: "What time can it be? It must be about eleven.", es: "¿Qué hora será? Serán las once.", accept: ["¿Qué hora será? Serán [las once|como las once]."] },
    { en: "Will you help me with the move? (to a friend)", es: "¿Me ayudarás con la mudanza?", accept: ["¿Me [ayudarás|vas a ayudar|ayudas] con la mudanza?"] },
    { en: "The museum will open at nine.", es: "El museo abrirá a las nueve.", accept: ["El museo [abrirá|va a abrir] a las nueve."] },
    { en: "There must be about twenty people in the park.", es: "Habrá unas veinte personas en el parque.", accept: ["Habrá [unas|como] veinte personas en el parque."] },
    { en: "I'll tell you tomorrow. (to a friend)", es: "Te lo diré mañana.", accept: ["Mañana te lo diré.", "Te lo [digo|voy a decir] mañana."] }
  ],
  register: [
    { es: "Mañana te llamo.", en: "I'll call you tomorrow.", when: "with friends, a casual plan" },
    { es: "Mañana te voy a llamar.", en: "I'm going to call you tomorrow.", when: "for any plan you have already made" },
    { es: "Mañana te llamaré.", en: "I will call you tomorrow.", when: "when you want it to sound like a promise" },
    { es: "La tienda abrirá el lunes.", en: "The shop will open on Monday.", when: "in notices, the news and formal plans" }
  ],
  personal: {
    prompt: "Make one promise to someone in your life with *Te prometo que*, then guess where someone you know is right now.",
    constraints: [
      { type: "containsWord", word: "prometo", label: "a promise: *te prometo que*" },
      { type: "anyVerbInTense", tense: "futuro", label: "a verb with the *-ré* or *-rá* ending" }
    ],
    model: "Te prometo que te llamaré el domingo. Mi hermano estará en el trabajo."
  },
  pitfalls: [
    "*Teneré* is the slip: *tener* shortens to *tendr-*, so *tendré*.",
    "*Será las once* misses the plural: hours take *serán*, as in *son las once*.",
    "*Voy a llamaré* is two futures at once: *voy a llamar* or *llamaré*."
  ]
},

"fn-expresar-planes-b1": {
  source: "merged",
  hook: {
    line: "A colleague asks what you are doing over the long weekend. You haven't quite decided, and last weekend's plan fell through. Spanish lets you say how firm a plan is, and what you meant to do but didn't.",
    es: "¿Qué piensas hacer en el puente?\nEstoy pensando en ir a Villa de Leyva, pero no sé.",
    en: "What are you planning to do over the long weekend?\nI'm thinking about going to Villa de Leyva, but I don't know."
  },
  examples: [
    { es: "Pienso terminar el informe esta semana.", en: "I plan to finish the report this week." },
    { es: "Estoy pensando en cambiar de trabajo.", en: "I'm thinking about changing jobs." },
    { es: "Iba a llamarte, pero no tuve tiempo.", en: "I was going to call you, but I didn't have time." }
  ],
  rule: "Every plan word goes straight to the dictionary form:\n*Pienso ir*: a firm plan.\n*Estoy pensando en ir*: still weighing it up, with *en*.\n*Tengo la intención de ir*: the same plan, said formally.\n*No pienso ir*: a flat refusal, so use it with care.\nTo ask: *¿Piensas ir?* *¿Qué piensas hacer?*\nA plan that fell through takes two verbs: *pensaba* or *iba a* for the plan, then *pero* and what happened in the plain past: *Iba a llamarte, pero no tuve tiempo.* *Pensaba* and *iba* leave the plan hanging; the plain past is what got in the way.\n*¿En qué piensas?* asks what is on your mind, not what you plan.",
  readAndPick: [
    { q: "How firm is the plan?", es: "Estoy pensando en vender el carro.",
      options: ["Already done", "Still weighing it up", "Already decided"], answer: 1,
      why: "*Estoy pensando en* is a plan still being weighed. A firm one is *pienso vender*." },
    { q: "Did she call?", es: "Iba a llamarte, pero se me hizo tarde.",
      options: ["Yes, but much later", "Yes, she called twice", "No, she ran out of time"], answer: 2,
      why: "*Iba a* leaves the call hanging; *se me hizo tarde* is what got in the way." },
    { q: "What is he saying?", es: "No pienso firmar nada.",
      options: ["He won't sign anything", "He doesn't think he signed", "He isn't sure he'll sign"], answer: 0,
      why: "*No pienso* plus a verb is a flat refusal, not a doubt." },
    { q: "What is she asking?", es: "¿En qué piensas?",
      options: ["What you plan to do", "What's on your mind", "What you thought of it"], answer: 1,
      why: "*Pensar en* is thinking about something. For plans: *¿qué piensas hacer?*" },
    { q: "What happened to the beach plan?", es: "Íbamos a ir a la playa, pero llovió todo el fin de semana.",
      options: ["They went, in the rain", "They will go next weekend", "They never went"], answer: 2,
      why: "*Íbamos a ir* is the plan; *llovió* is what stopped it." }
  ],
  yourTurn: [
    { en: "I plan to finish the report this week.", es: "Pienso terminar el informe esta semana.", accept: ["Esta semana pienso terminar el informe."] },
    { en: "I'm thinking about changing jobs.", es: "Estoy pensando en cambiar de trabajo.", accept: ["Estoy pensando en cambiar de [trabajo|empleo]."] },
    { en: "Are you planning to go to the meeting? (to a friend)", es: "¿Piensas ir a la reunión?", accept: ["¿Tú piensas ir a la reunión?"] },
    { en: "I was going to call you, but I didn't have time. (to a friend)", es: "Iba a llamarte, pero no tuve tiempo.", accept: ["[Iba a llamarte|Te iba a llamar|Pensaba llamarte], pero no tuve tiempo."] },
    { en: "I have no intention of selling the car.", es: "No pienso vender el carro.", accept: [] }
  ],
  translate: [
    { en: "We were going to go to the beach, but it rained all weekend.", es: "Íbamos a ir a la playa, pero llovió todo el fin de semana.", accept: ["Pensábamos ir a la playa, pero llovió todo el fin de semana."] },
    { en: "I intend to stay here at least two more months.", es: "Tengo la intención de quedarme aquí al menos dos meses más.", accept: ["Tengo la intención de quedarme aquí [al menos|por lo menos] dos meses más.", "Mi intención es quedarme aquí [al menos|por lo menos] dos meses más."] },
    { en: "What are you planning to do over the long weekend? (to a friend)", es: "¿Qué piensas hacer en el puente?", accept: ["¿Qué piensas hacer [en el|este] puente?"] },
    { en: "I was planning to stay at home, but my sister called me and we went out.", es: "Pensaba quedarme en la casa, pero me llamó mi hermana y salimos.", accept: ["[Pensaba|Iba a] quedarme en (la) casa, pero [me llamó mi hermana|mi hermana me llamó] y salimos."] },
    { en: "Do you intend to stay longer? (polite)", es: "¿Tiene la intención de quedarse más tiempo?", accept: ["¿Usted tiene la intención de quedarse más tiempo?", "¿Piensa quedarse más tiempo?"] }
  ],
  register: [
    { es: "Estoy pensando en ir.", en: "I'm thinking about going.", when: "when you haven't decided yet" },
    { es: "Pienso ir.", en: "I'm planning to go.", when: "a plan you have made, in everyday talk" },
    { es: "Voy a ir, seguro.", en: "I'm going, for sure.", when: "to a friend who doubts you will show up" },
    { es: "Tengo la intención de ir.", en: "I intend to go.", when: "at work or in writing, a little formal" },
    { es: "No pienso ir.", en: "I have no intention of going.", when: "a flat refusal, so use it with care" }
  ],
  personal: {
    prompt: "Write one real plan for this month with *pienso*, and one thing you were going to do this week and didn't.",
    constraints: [
      { type: "regex", pattern: "\\bpienso [a-záéíóúñ]+(ar|er|ir)\\b", label: "a plan: *pienso* and the dictionary form" },
      { type: "regex", pattern: "\\b(iba a|íbamos a|pensaba)\\b[^.]*\\bpero\\b", label: "a plan that fell through: *iba a* or *pensaba*, then *pero*" }
    ],
    model: "Este mes pienso aprender a hacer arepas. Iba a ir al gimnasio el martes, pero me quedé trabajando hasta tarde."
  },
  pitfalls: [
    "*Pienso a viajar* has one word too many: *pienso viajar*, straight to the verb.",
    "*Estoy pensando de viajar* follows English thinking of: say *pensando en*.",
    "*Pensé quedarme, pero salí* sounds like a decision carried out: for a plan left hanging, *pensaba*."
  ]
},

"gr-temporales-b1": {
  source: "merged",
  hook: {
    line: "Your sister flies in from Toronto next week and wants to know the plan. Everything you tell her hangs on moments that haven't come yet: when she lands, as soon as you leave work. Spanish marks those moments in the verb.",
    es: "Cuando llegues, llámame.\nApenas salga del trabajo, voy por ti.",
    en: "When you get here, call me.\nAs soon as I get out of work, I'll come and get you."
  },
  examples: [
    { es: "Cuando llego a la casa, me quito los zapatos.", en: "When I get home, I take my shoes off." },
    { es: "Cuando llegue a la casa, te escribo.", en: "When I get home, I'll text you." },
    { es: "Cuando llegué, ya estaban comiendo.", en: "When I arrived, they were already eating." }
  ],
  rule: "Ask one question: has it happened yet?\nA habit, or something that already happened, keeps the ordinary verb: *Cuando llego, me quito los zapatos.* *Cuando llegué, ya estaban comiendo.*\nA moment still to come takes the subjunctive: *Cuando llegue, te escribo.* Cover *cuando* and nobody claims *llegue*: it hasn't happened.\nThe same goes for *en cuanto* and *apenas* (as soon as) and *hasta que* (until): *Espera hasta que vuelva.*\nNever the *-ré* form after *cuando*: *cuando llegue*, not *cuando llegaré*. English agrees: nobody says when I will arrive.\nThe other half can be the plain present, *voy a*, a *-ré* form or a request.",
  readAndPick: [
    { q: "Is this a habit or one time to come?", es: "Cuando salgo del trabajo, paso por el parque.",
      options: ["One time, still to come", "A habit", "One time, last week"], answer: 1,
      why: "*Salgo* is the ordinary verb: every time I leave work." },
    { q: "When will she call?", es: "Te llamo en cuanto sepa algo.",
      options: ["Now, she already knows", "Every time she hears", "As soon as she knows"], answer: 2,
      why: "*Sepa* is the subjunctive of *saber*: the knowing hasn't happened yet." },
    { q: "Has he arrived?", es: "Cuando llegó, ya estábamos comiendo.",
      options: ["Yes, we were eating", "Not yet, he's coming", "He comes every day"], answer: 0,
      why: "*Llegó*, with its accent, is the plain past: it already happened." },
    { q: "How long will you wait?", es: "Espera aquí hasta que vuelva.",
      options: ["Five minutes at most", "Ever since I left", "Until I get back"], answer: 2,
      why: "*Hasta que vuelva*: until a return that hasn't happened yet." },
    { q: "Why *termines* and not *terminas*?", es: "¿Qué vas a hacer cuando termines la carrera?",
      options: ["It's a habit", "It's still to come", "It already happened"], answer: 1,
      why: "Finishing the degree is ahead, so *cuando* takes the subjunctive." }
  ],
  yourTurn: [
    { en: "When you get here, call me. (to a friend)", es: "Cuando llegues, llámame.", accept: ["Llámame cuando llegues."] },
    { en: "As soon as I know anything, I'll let you know. (to a friend)", es: "En cuanto sepa algo, te aviso.", accept: ["[En cuanto|Apenas|Tan pronto como] sepa algo, te [aviso|voy a avisar|avisaré].", "Te aviso [en cuanto|apenas|tan pronto como] sepa algo."] },
    { en: "Wait until your mom gets here. (to a friend)", es: "Espera hasta que llegue tu mamá.", accept: ["Espera hasta que [llegue tu mamá|tu mamá llegue]."] },
    { en: "When I get home, I take my shoes off.", es: "Cuando llego a la casa, me quito los zapatos.", accept: ["Cuando llego a (la) casa, me quito los zapatos."] },
    { en: "When I finished, I called my sister.", es: "Cuando terminé, llamé a mi hermana.", accept: [] }
  ],
  translate: [
    { en: "What are you going to do when you finish your degree? (to a friend)", es: "¿Qué vas a hacer cuando termines la carrera?", accept: ["¿Qué vas a hacer cuando termines [la|tu] carrera?"] },
    { en: "When we have the money, we'll buy a car.", es: "Cuando tengamos la plata, vamos a comprar un carro.", accept: ["Cuando tengamos [(la) plata|(el) dinero], [vamos a comprar|compraremos|compramos] un carro."] },
    { en: "As soon as I get out of work, I'll come and get you. (to a friend)", es: "Apenas salga del trabajo, voy por ti.", accept: ["[Apenas|En cuanto] salga del trabajo, [voy por ti|paso por ti|te recojo]."] },
    { en: "When I was a kid, I lived in Cali.", es: "Cuando era niño, vivía en Cali.", accept: ["Cuando era [niño|niña], vivía en Cali.", "De [niño|niña] vivía en Cali."] },
    { en: "I'll wait for you here until you come back. (to a friend)", es: "Te espero aquí hasta que vuelvas.", accept: ["[Te espero|Te voy a esperar|Te esperaré] aquí hasta que [vuelvas|regreses]."] }
  ],
  register: [
    { es: "Cuando llegues, me avisas.", en: "When you get here, let me know.", when: "the everyday way, with anyone you call tú" },
    { es: "Apenas llegues, me avisas.", en: "As soon as you get here, let me know.", when: "in Colombia, quick and natural in speech" },
    { es: "En cuanto llegues, avísame.", en: "As soon as you arrive, let me know.", when: "anywhere Spanish is spoken, a little more careful" },
    { es: "Le escribo tan pronto como llegue el paquete.", en: "I'll write to you as soon as the package arrives.", when: "in a work email, to someone you call usted" }
  ],
  personal: {
    prompt: "Write about your coming week: one thing you will do when something happens, and one thing you always do when something else happens.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "cuando", label: "something still to come: *cuando* and the subjunctive" },
      { type: "containsAny", words: ["siempre", "todos los días", "cada vez que", "todas las mañanas", "todas las noches"], label: "a habit, with *siempre* or *todos los días*" }
    ],
    model: "Cuando termine este curso, voy a viajar a Cartagena. Siempre que llego a la casa, llamo a mi mamá."
  },
  pitfalls: [
    "*Cuando llegaré* is the slip: after *cuando*, never the *-ré* form. Say *cuando llegue*.",
    "*Cuando llego mañana* treats tomorrow as a habit: still to come is *cuando llegue mañana*.",
    "*Llegue* and *llegué* differ by one accent: *llegué* is I arrived, *llegue* is still to come."
  ]
},

"gr-modalidad-b1": {
  source: "merged",
  hook: {
    line: "You and a friend are racing to the airport in Bogotá traffic, and she asks if you'll make it. Nobody knows, but you have a good guess. English surely sounds certain; the Spanish word that looks like it is only a strong guess.",
    es: "¿Llegamos a tiempo?\nSeguramente sí, pero no es seguro.",
    en: "Will we make it on time?\nMost likely, but it isn't certain."
  },
  examples: [
    { es: "Seguramente está en la oficina.", en: "She's most likely at the office." },
    { es: "Probablemente llueva esta tarde.", en: "It'll probably rain this afternoon." },
    { es: "¿Viene Carlos?\nPosiblemente.", en: "Is Carlos coming?\nPossibly." }
  ],
  rule: "Three guess words, from strong to weak:\n*seguramente*: most likely. Not surely: if you know, just say it.\n*probablemente*: probably.\n*posiblemente*: possibly.\nAfter *seguramente*, keep the ordinary form: *Seguramente está en la oficina.*\nAfter *probablemente* and *posiblemente* you choose: the ordinary form if you are fairly confident, the subjunctive if less: *Probablemente llueva.*\nEach works alone as an answer: *¿Viene? Posiblemente.*\nNo *es* and no *que* in front: *Probablemente viene*. With *que*, the frame is *Es probable que venga*, always with the subjunctive.\nThe guess you already have, *Estará en la oficina*, sits close to *seguramente*.",
  readAndPick: [
    { q: "How sure is she?", es: "Seguramente está en la casa.",
      options: ["Certain, she saw her", "Not sure at all", "Fairly sure, a strong guess"], answer: 2,
      why: "*Seguramente* is most likely, not surely: a strong guess." },
    { q: "Which is the weakest guess?", es: "Posiblemente lleguemos un poco tarde.",
      options: ["Weak: it might happen", "Strong: it will happen", "Certain: it happened"], answer: 0,
      why: "*Posiblemente* is the weakest of the three, and *lleguemos* adds that she isn't sure." },
    { q: "Why *llueva* and not *llueve*?", es: "Probablemente llueva esta tarde.",
      options: ["It's raining now", "She's less sure", "It rains every day"], answer: 1,
      why: "After *probablemente* the subjunctive is a choice, and it sounds less sure." },
    { q: "Is the speaker certain?", es: "Estará en una reunión.",
      options: ["Yes, she checked", "It's a plan for later", "No, it's a guess"], answer: 2,
      why: "No time word: *estará* is a guess about right now." },
    { q: "What is he answering?", es: "¿Vienes el sábado?\nProbablemente.",
      options: ["Probably yes", "Certainly not", "Every Saturday"], answer: 0,
      why: "*Probablemente* stands alone as a full answer: probably." }
  ],
  yourTurn: [
    { en: "She's most likely at the office.", es: "Seguramente está en la oficina.", accept: [] },
    { en: "It'll probably rain this afternoon.", es: "Probablemente llueva esta tarde.", accept: ["Probablemente [llueva|llueve|va a llover] esta tarde.", "Esta tarde probablemente [llueva|llueve|va a llover]."] },
    { en: "We'll possibly arrive a bit late.", es: "Posiblemente lleguemos un poco tarde.", accept: ["Posiblemente [lleguemos|llegamos|vamos a llegar] un poco tarde."] },
    { en: "You're probably right. (to a friend)", es: "Probablemente tienes razón.", accept: ["Probablemente [tienes|tengas] razón."] },
    { en: "It's most likely not true.", es: "Seguramente no es verdad.", accept: ["Seguramente no es [verdad|cierto]."] }
  ],
  translate: [
    { en: "He's most likely asleep.", es: "Seguramente está dormido.", accept: ["Estará dormido."] },
    { en: "It's probable that they're closing early.", es: "Es probable que cierren temprano.", accept: [] },
    { en: "Is Carlos coming tomorrow? Probably.", es: "¿Carlos viene mañana? Probablemente.", accept: ["¿Viene Carlos mañana? Probablemente."] },
    { en: "Most likely she doesn't know yet.", es: "Seguramente todavía no lo sabe.", accept: ["Seguramente [todavía|aún] no (lo) sabe.", "Seguramente no (lo) sabe [todavía|aún]."] },
    { en: "Maybe he's at home, but I'm not sure.", es: "A lo mejor está en la casa, pero no estoy seguro.", accept: ["[A lo mejor|De pronto] está en (la) casa, pero no estoy [seguro|segura].", "[Tal vez|Quizás|Quizá] [esté|está] en (la) casa, pero no estoy [seguro|segura]."] }
  ],
  register: [
    { es: "Está en la oficina.", en: "She's at the office.", when: "when you know it for a fact" },
    { es: "Seguramente está en la oficina.", en: "She's most likely at the office.", when: "a strong guess, in any conversation" },
    { es: "Estará en la oficina.", en: "She must be at the office.", when: "thinking aloud, when you have no way to check" },
    { es: "A lo mejor está en la oficina.", en: "Maybe she's at the office.", when: "a loose guess, with friends" },
    { es: "Posiblemente esté en la oficina.", en: "She may possibly be at the office.", when: "a weak guess, careful or written" }
  ],
  personal: {
    prompt: "Someone you know isn't with you right now. Make a strong guess about where they are with *seguramente*, then a weaker one about tomorrow.",
    constraints: [
      { type: "containsWord", word: "seguramente", label: "a strong guess with *seguramente*" },
      { type: "containsAny", words: ["posiblemente", "probablemente"], label: "a weaker guess with *posiblemente* or *probablemente*" }
    ],
    model: "Seguramente mi hermano está en el trabajo. Posiblemente venga a comer mañana."
  },
  pitfalls: [
    "*Seguramente está aquí* is a guess, not a certainty. If you know, say *Está aquí*.",
    "*Es probablemente que venga* blends two frames: *probablemente viene* or *es probable que venga*."
  ]
},

"nt-acontecimiento-b1": {
  source: "merged",
  hook: {
    line: "The local news in Medellín has three stories: the Flower Fair starts next week, there was a protest downtown, and a concert was called off. Each event gets its own verb, and the one in the paper is not the one you use with friends.",
    es: "¿Qué pasó en el centro?\nHubo una manifestación.",
    en: "What happened downtown?\nThere was a protest."
  },
  examples: [
    { es: "La Feria de las Flores se celebra en agosto.", en: "The Flower Fair is held in August." },
    { es: "La reunión tuvo lugar el martes.", en: "The meeting took place on Tuesday." },
    { es: "El accidente ocurrió de madrugada.", en: "The accident happened in the early hours." }
  ],
  rule: "There is a ladder for happened.\nWith friends: *pasar*. *¿Qué pasó?* *Hubo un accidente.*\nNeutral and written: *ocurrir* or *suceder*. *El accidente ocurrió anoche.*\nIn the news: *producirse*, always with *se*: *Se produjo un incendio.*\nFor a planned event, say when and where with *tener lugar* or *celebrarse*: *La reunión tuvo lugar el martes.* *La boda se celebró en una finca.* Only *tener* changes; *lugar* stays bare.\nEach verb agrees with the event: *Los robos ocurrieron anoche.*\nCalled off: *Se canceló el concierto.*\nIn conversation, *ser* does the job: *La reunión es el martes.* And *hay* announces one, with no *la*: *Mañana hay reunión.*",
  readAndPick: [
    { q: "Where would you read this?", es: "Se produjo un incendio en una bodega del centro.",
      options: ["In a text to a friend", "In a news report", "On a birthday card"], answer: 1,
      why: "*Se produjo* is the news verb; with friends you would say *hubo un incendio*." },
    { q: "What happened to the concert?", es: "Se canceló el concierto por la lluvia.",
      options: ["It went indoors", "It started late", "It was called off"], answer: 2,
      why: "*Se canceló*: it was cancelled, because of the rain." },
    { q: "When was the wedding?", es: "La boda se celebró el sábado en una finca.",
      options: ["On Saturday", "Next Saturday", "Every Saturday"], answer: 0,
      why: "*Se celebró* is the plain past: it was held last Saturday." },
    { q: "How many protests were there?", es: "Las protestas tuvieron lugar en varias ciudades.",
      options: ["Just one", "None so far", "Several"], answer: 2,
      why: "*Las protestas* is plural, so *tuvieron*. *Lugar* stays as it is." },
    { q: "What is she announcing?", es: "Mañana hay reunión a las nueve.",
      options: ["A meeting tomorrow", "A meeting that ended", "A meeting every day"], answer: 0,
      why: "*Hay reunión*, with no *la*, announces an event." }
  ],
  yourTurn: [
    { en: "What happened last night?", es: "¿Qué pasó anoche?", accept: ["¿Qué [pasó|ocurrió|sucedió] anoche?"] },
    { en: "The meeting took place on Tuesday.", es: "La reunión tuvo lugar el martes.", accept: ["La reunión [tuvo lugar|se realizó|se celebró|fue] el martes."] },
    { en: "The accident happened in the early hours.", es: "El accidente ocurrió de madrugada.", accept: ["El accidente [ocurrió|sucedió|pasó|se produjo] [de madrugada|en la madrugada]."] },
    { en: "The concert was cancelled.", es: "Se canceló el concierto.", accept: ["El concierto se canceló.", "Cancelaron el concierto."] },
    { en: "The protests took place in several cities.", es: "Las protestas tuvieron lugar en varias ciudades.", accept: ["Las protestas [tuvieron lugar|se realizaron] en varias ciudades."] }
  ],
  translate: [
    { en: "The Flower Fair is held every year in August.", es: "La Feria de las Flores se celebra todos los años en agosto.", accept: ["La Feria de las Flores se [celebra|realiza] [todos los años|cada año] en agosto."] },
    { en: "When will the ceremony take place?", es: "¿Cuándo tendrá lugar la ceremonia?", accept: ["¿Cuándo [tendrá lugar|va a tener lugar|será] la ceremonia?"] },
    { en: "There's a meeting tomorrow at nine.", es: "Mañana hay reunión a las nueve.", accept: ["Mañana hay (una) reunión a las nueve.", "Hay (una) reunión mañana a las nueve."] },
    { en: "Nothing interesting ever happens in this town.", es: "Nunca pasa nada interesante en este pueblo.", accept: ["En este pueblo nunca pasa nada interesante."] },
    { en: "Nobody knows how it happened.", es: "Nadie sabe cómo pasó.", accept: ["Nadie sabe cómo [pasó|ocurrió|sucedió]."] },
    { en: "A fire broke out in a warehouse.", es: "Se produjo un incendio en una bodega.", accept: [] }
  ],
  register: [
    { es: "¿Qué pasó?", en: "What happened?", when: "with anyone, in conversation" },
    { es: "Hubo un accidente en la autopista.", en: "There was an accident on the highway.", when: "telling someone the news in everyday talk" },
    { es: "El accidente ocurrió a las seis.", en: "The accident happened at six.", when: "in a neutral account, spoken or written" },
    { es: "Se produjo un accidente en la autopista.", en: "An accident occurred on the highway.", when: "in a news report" }
  ],
  personal: {
    prompt: "Tell about a real event from this month, like a meeting, a match or a party: when and where it took place, and one thing that happened there.",
    constraints: [
      { type: "containsAny", words: ["tuvo lugar", "tuvieron lugar", "se celebró", "se celebraron", "se realizó"], label: "when and where: *tuvo lugar* or *se celebró*" },
      { type: "containsAny", words: ["pasó", "ocurrió", "sucedió", "hubo", "se produjo"], label: "what happened: *pasó*, *ocurrió* or *hubo*" }
    ],
    model: "La fiesta de mi prima se celebró el sábado en una finca. A medianoche pasó algo chistoso: se fue la luz y bailamos a oscuras."
  },
  pitfalls: [
    "*Hay la reunión el martes* is the slip: *hay* takes no *la*. Say *hay reunión* or *la reunión es el martes*.",
    "*Tuvo un lugar* has one word too many: *tuvo lugar*.",
    "*El incendio se celebró* sounds like a party: *celebrarse* is for planned events only."
  ]
},

"fn-proponer-sugerir-b1": {
  source: "merged",
  hook: {
    line: "It's Friday and your group chat is trying to decide on Saturday. Someone has to put a plan on the table, and how hard you push decides whether people feel invited or ordered about.",
    es: "¿Qué tal si vamos a Monserrate el sábado?\nPodríamos subir temprano.",
    en: "How about we go to Monserrate on Saturday?\nWe could go up early."
  },
  examples: [
    { es: "¿Y si pedimos una pizza?", en: "What if we order a pizza?" },
    { es: "Deberíamos salir antes de las seis.", en: "We should leave before six." },
    { es: "¿Por qué no vamos en bus?", en: "Why don't we go by bus?" }
  ],
  rule: "Proposals come at different strengths.\nSoft, as a question: *¿Qué tal si vamos?* *¿Y si pedimos pizza?* After *si*, the plain present, usually the we form.\nAn option: *Podríamos ir a la montaña.*\nA nudge: *Deberíamos salir ya.*\nFirm, close to an order: *Tenemos que salir ya.*\nDirect, with friends: *¡Vamos a cine!* or a plain command: *Prueba esto.*\n*Podríamos* and *deberíamos* go straight to the dictionary form; only *tenemos que* has *que*.\nEnglish says how about going; Spanish says how about if we go: *¿Qué tal si vamos?*, never *yendo*.\n*¿Por qué no vamos en bus?* sounds friendly, not like a challenge.",
  readAndPick: [
    { q: "How hard is she pushing?", es: "Podríamos ir a la montaña este fin de semana.",
      options: ["Hard: it's an order", "Not much: it's an option", "Not at all: she refuses"], answer: 1,
      why: "*Podríamos* puts an option on the table and leaves the choice open." },
    { q: "How does this land?", es: "Tenemos que salir ya.",
      options: ["Close to an order", "As a gentle option", "As friendly advice"], answer: 0,
      why: "*Tenemos que* is the firmest: there is no real choice." },
    { q: "Who would make the call?", es: "¿Qué tal si llamas a tu tía?",
      options: ["The speaker would", "Both of them would", "You would"], answer: 2,
      why: "*Llamas* is you: she suggests something you could do." },
    { q: "What does *¿Y si...?* do here?", es: "¿Y si cerramos temprano hoy?",
      options: ["Gives an order", "Floats an idea", "Asks for a fact"], answer: 1,
      why: "*¿Y si...?* floats an idea the others can turn down." },
    { q: "What is he doing?", es: "Deberíamos hablar con ella antes.",
      options: ["Nudging: we should", "Reporting a fact", "Giving an order"], answer: 0,
      why: "*Deberíamos* is advice with a nudge, softer than *tenemos que*." }
  ],
  yourTurn: [
    { en: "How about we go to the movies on Saturday?", es: "¿Qué tal si vamos a cine el sábado?", accept: ["¿[Qué tal si|Y si] vamos [a cine|al cine] el sábado?"] },
    { en: "We could go to the mountains.", es: "Podríamos ir a la montaña.", accept: [] },
    { en: "We should talk to him.", es: "Deberíamos hablar con él.", accept: [] },
    { en: "What if we order a pizza?", es: "¿Y si pedimos una pizza?", accept: ["¿[Y si|Qué tal si] pedimos (una) pizza?"] },
    { en: "We have to leave now.", es: "Tenemos que salir ya.", accept: ["Tenemos que [salir|irnos] [ya|ahora]."] }
  ],
  translate: [
    { en: "We shouldn't sign today.", es: "No deberíamos firmar hoy.", accept: ["Hoy no deberíamos firmar."] },
    { en: "How about you invite your cousin? (to a friend)", es: "¿Qué tal si invitas a tu primo?", accept: ["¿[Qué tal si|Y si] invitas a tu [primo|prima]?"] },
    { en: "Why don't we go by bus?", es: "¿Por qué no vamos en bus?", accept: [] },
    { en: "What could we do this weekend?", es: "¿Qué podríamos hacer este fin de semana?", accept: [] },
    { en: "Try this, it's delicious. (to a friend)", es: "Prueba esto, está delicioso.", accept: ["Prueba esto, está [delicioso|buenísimo|riquísimo]."] },
    { en: "Let's go to the movies!", es: "¡Vamos a cine!", accept: ["¡Vamos [a cine|al cine]!"] }
  ],
  register: [
    { es: "¿Qué tal si vamos a cine?", en: "How about we go to the movies?", when: "the friendly default, easy to say no to" },
    { es: "Podríamos ir a cine.", en: "We could go to the movies.", when: "to put one option on the table" },
    { es: "Deberíamos ir a cine.", en: "We should go to the movies.", when: "when you think it is the right call" },
    { es: "¡Vamos a cine!", en: "Let's go to the movies!", when: "with close friends, when the plan is easy" },
    { es: "Les propongo ir a cine el viernes.", en: "I suggest we go to the movies on Friday.", when: "to a group, at work or in a message" }
  ],
  personal: {
    prompt: "Propose a real plan for this weekend to some friends: one soft proposal with *¿Qué tal si...?* or *¿Y si...?*, and one option with *podríamos*.",
    constraints: [
      { type: "regex", pattern: "(qu[eé] tal|\\by) si ", label: "a soft proposal: *¿Qué tal si...?* or *¿Y si...?*" },
      { type: "regex", pattern: "\\bpodr[ií]amos [a-záéíóúñ]+(ar|er|ir)\\b", label: "an option: *podríamos* and the dictionary form" }
    ],
    model: "¿Qué tal si vamos a la ciclovía el domingo? Después podríamos almorzar en la casa de Juli."
  },
  pitfalls: [
    "*¿Qué tal yendo a cine?* follows English: say *¿Qué tal si vamos a cine?*",
    "*Deberíamos que hablar* has one word too many: only *tenemos que* takes *que*.",
    "*¿Y si vayamos?* is not Spanish: after *si*, the plain present, *¿y si vamos?*"
  ]
},

"fn-aceptar-propuesta-b1": {
  source: "old",
  hook: {
    line: "A friend texts to ask if you're coming to dinner at her place on Friday. You can say yes three ways: thrilled, fine, or only because she keeps asking. Colombians have a word for each, and the wrong one sends the wrong message.",
    es: "¿Vienes a comer el viernes?\n¡De una! ¿A qué hora?",
    en: "Are you coming for dinner on Friday?\nAbsolutely! What time?"
  },
  examples: [
    { es: "¿Vamos a cine?\nDale, ¿a qué hora?", en: "Shall we go to the movies?\nSure, what time?" },
    { es: "Perfecto, nos vemos a las ocho.", en: "Perfect, see you at eight." },
    { es: "Bueno, si insistes.", en: "Well, if you insist." }
  ],
  rule: "A yes comes in three temperatures.\nThrilled: *¡De una!* (right away, in Colombia), *¡Perfecto!*, *¡Qué buena idea!* It works alone; no reason needed.\nFine, just confirming: *Dale.* *Listo.* *Bueno, de acuerdo.* *Me parece bien.* Then get practical: *¿A qué hora?* *¿Dónde nos vemos?*\nGiving in: *Bueno, si insistes.* *Bueno, está bien.* This says you agree because they pushed. Say it to something you really want and you sound grudging.\nTo someone you call *usted*: *Con mucho gusto.* *Claro que sí.*\n*Dale* and *listo* are everyday Colombian; *de una* is for friends.",
  readAndPick: [
    { q: "How keen is she?", es: "¡De una! ¿A qué hora paso por ti?",
      options: ["She's unsure", "Very keen", "Not keen at all"], answer: 1,
      why: "*¡De una!* is a thrilled yes, and she is already asking for details." },
    { q: "Why is he saying yes?", es: "Bueno, si insistes.",
      options: ["He's thrilled", "He has no plans", "They pushed him"], answer: 2,
      why: "*Si insistes* says he is giving in, not keen." },
    { q: "Who is she talking to?", es: "Con mucho gusto, doctora.",
      options: ["Someone she calls usted", "A close friend of hers", "Her little brother"], answer: 0,
      why: "*Con mucho gusto* and the title *doctora*: polite, to someone she calls *usted*." },
    { q: "What does *dale* mean here?", es: "¿Nos vemos a las siete?\nDale.",
      options: ["Give it to him", "Sure, OK", "Not today"], answer: 1,
      why: "In Colombia *dale* is an everyday yes: sure, OK." },
    { q: "What comes after this yes?", es: "Listo. ¿Dónde nos vemos?",
      options: ["A polite excuse to leave", "A complaint about the time", "A question about details"], answer: 2,
      why: "A practical yes moves straight on to where and when." }
  ],
  yourTurn: [
    { en: "Sure, what time?", es: "Dale, ¿a qué hora?", accept: ["[Dale|Listo|Bueno], ¿a qué hora?"] },
    { en: "Perfect, see you at eight.", es: "Perfecto, nos vemos a las ocho.", accept: [] },
    { en: "Well, if you insist. (to a friend)", es: "Bueno, si insistes.", accept: [] },
    { en: "With pleasure.", es: "Con mucho gusto.", accept: [] },
    { en: "What a good idea!", es: "¡Qué buena idea!", accept: ["¡Qué [buena idea|idea tan buena]!"] }
  ],
  translate: [
    { en: "Absolutely, I'll go with you! (to a friend)", es: "¡De una, yo voy contigo!", accept: ["¡De una, voy contigo!"] },
    { en: "OK, agreed. Where shall we meet?", es: "Bueno, de acuerdo. ¿Dónde nos vemos?", accept: ["[Bueno|Listo|Dale], de acuerdo. ¿Dónde nos vemos?"] },
    { en: "That sounds good to me. I'll bring the drinks.", es: "Me parece bien. Yo llevo las bebidas.", accept: ["Me parece bien. Yo [llevo|traigo|llevaré] las bebidas."] },
    { en: "Great! I'll be there.", es: "¡Perfecto! Allá estaré.", accept: ["¡[Perfecto|Genial]! [Allá|Allí|Ahí] estaré."] },
    { en: "Of course, with pleasure.", es: "Claro que sí, con mucho gusto.", accept: [] }
  ],
  register: [
    { es: "¡De una!", en: "Absolutely!", when: "with friends in Colombia, when you are keen" },
    { es: "Dale.", en: "Sure.", when: "the everyday Colombian yes, with anyone you call tú" },
    { es: "Listo, nos vemos.", en: "All set, see you.", when: "to close the plan quickly" },
    { es: "Con mucho gusto.", en: "With pleasure.", when: "to someone you call usted" },
    { es: "Bueno, si insistes.", en: "Well, if you insist.", when: "when you agree only because they pushed" }
  ],
  personal: {
    prompt: "A friend invites you to two things this weekend: one you love and one you don't. Accept both, so she can hear the difference.",
    constraints: [
      { type: "containsAny", words: ["de una", "perfecto", "qué buena idea", "genial"], label: "a keen yes, like *¡De una!* or *¡Qué buena idea!*" },
      { type: "containsAny", words: ["si insistes", "bueno, está bien"], label: "a grudging yes, like *Bueno, si insistes*" }
    ],
    model: "¿El concierto? ¡De una! ¿Y el almuerzo con tu jefe? Bueno, si insistes."
  },
  pitfalls: [
    "*Bueno, si insistes* to something you want sounds grudging: say *¡De una!* or *¡Perfecto!*",
    "*Vale* is what you hear in Spain. In Colombia, *dale* or *listo*."
  ]
},

"fn-ofrecer-invitar-b1": {
  source: "merged",
  hook: {
    line: "A friend drops by your apartment on a cold Bogotá afternoon. Before her coat is off, you are offering her things: a seat, a coffee, something to eat. Colombians offer warmly, often say it twice, and an offer can be a plain command.",
    es: "Pasa, pasa. ¿Te provoca un tinto?",
    en: "Come in, come in. Do you feel like a coffee?"
  },
  examples: [
    { es: "¿Te provoca ir a comer algo?", en: "Do you feel like going to eat something?" },
    { es: "Siéntate, siéntate, estás en tu casa.", en: "Sit down, sit down, make yourself at home." },
    { es: "Tranquila, hoy invito yo.", en: "Don't worry, today it's on me." }
  ],
  rule: "To offer, ask what they feel like: *¿Te provoca un tinto?* *¿Te provoca salir?* In Colombia *provocar* is the everyday word; *¿Quieres...?* works anywhere.\nA plain command can be the offer itself, often with a reason: *Prueba esto, está delicioso.* *Ven con nosotros.*\nSay it twice and it turns warm: *Pasa, pasa.* *Siéntate, siéntate.* The same word, with a comma.\nTo pay for someone: *Te invito.* *Hoy invito yo.*\nTo someone you call *usted*: *¿Le provoca un café?* *¿Le gustaría acompañarnos?* *Siga, siga.*\nTo turn one down politely: *No, gracias, muy amable.*",
  readAndPick: [
    { q: "What is she offering?", es: "¿Te provoca un tinto?",
      options: ["A glass of red wine", "A small black coffee", "A cup of hot tea"], answer: 1,
      why: "In Colombia *un tinto* is a small black coffee, and *¿te provoca?* asks if you feel like it." },
    { q: "Is this an order?", es: "Prueba esto, está buenísimo.",
      options: ["No, it's an offer", "Yes, he's strict", "No, it's a question"], answer: 0,
      why: "A command with a reason after it is the offer itself." },
    { q: "Why does he say it twice?", es: "Siéntate, siéntate.",
      options: ["He's in a hurry", "He's annoyed", "He's being warm"], answer: 2,
      why: "A doubled welcome is warm insistence, not urgency." },
    { q: "Who is paying?", es: "Tranquilo, hoy invito yo.",
      options: ["You are", "The speaker is", "Each of you"], answer: 1,
      why: "*Invito yo*: I'm paying. *Te invito* means the same." },
    { q: "Who is being waved in?", es: "Siga, siga, por favor.",
      options: ["A friend she calls tú", "Someone she calls usted", "A whole group"], answer: 1,
      why: "*Siga* is the *usted* form; to a friend it would be *sigue* or *pasa*." }
  ],
  yourTurn: [
    { en: "Do you feel like a coffee? (to a friend)", es: "¿Te provoca un tinto?", accept: ["¿Te provoca un [tinto|café]?", "¿Quieres un [tinto|café]?"] },
    { en: "Come in, come in. (to a friend)", es: "Pasa, pasa.", accept: ["¡Pasa, pasa!", "Sigue, sigue."] },
    { en: "Today it's on me.", es: "Hoy invito yo.", accept: ["Hoy [invito yo|yo invito|te invito]."] },
    { en: "Have some more, there's plenty. (to a friend)", es: "Sírvete más, hay de sobra.", accept: ["Sírvete más, hay [de sobra|bastante]."] },
    { en: "Would you like to join us for dinner? (polite)", es: "¿Le gustaría acompañarnos a comer?", accept: ["¿Le [gustaría|provoca] acompañarnos a [comer|cenar]?"] }
  ],
  translate: [
    { en: "Sit down, sit down, make yourself at home. (to a friend)", es: "Siéntate, siéntate, estás en tu casa.", accept: ["Siéntate, siéntate, [estás en tu casa|como en tu casa]."] },
    { en: "Do you all feel like going out tonight?", es: "¿Les provoca salir esta noche?", accept: ["¿Les provoca salir [esta noche|hoy en la noche]?", "¿Quieren salir esta noche?"] },
    { en: "Come with us, we're going for a walk. (to a friend)", es: "Ven con nosotros, vamos a dar una vuelta.", accept: ["[Ven|Vente] con nosotros, vamos a dar una vuelta."] },
    { en: "No, thank you, that's very kind.", es: "No, gracias, muy amable.", accept: ["No, muchas gracias, muy amable."] },
    { en: "Try the arepas, they're delicious. (to a friend)", es: "Prueba las arepas, están deliciosas.", accept: ["Prueba las arepas, están [deliciosas|buenísimas|riquísimas]."] }
  ],
  register: [
    { es: "¿Quieres un café?", en: "Do you want a coffee?", when: "anywhere, the plain way" },
    { es: "¿Te provoca un tinto?", en: "Do you feel like a coffee?", when: "in Colombia, warm and everyday" },
    { es: "Toma, prueba esto.", en: "Here, try this.", when: "with friends, the offer as a command" },
    { es: "¿Le gustaría tomar algo?", en: "Would you like something to drink?", when: "to a guest you call usted, a little formal" },
    { es: "Hoy invito yo.", en: "Today it's on me.", when: "when you are paying, said before the bill comes" }
  ],
  personal: {
    prompt: "Someone is visiting you today. Welcome them in with a doubled word, then offer them two things.",
    constraints: [
      { type: "regex", pattern: "([a-záéíóúñ]+), \\1(?![a-záéíóúñ])", label: "a warm welcome: the same word twice, like *pasa, pasa*" },
      { type: "containsAny", words: ["te provoca", "le provoca", "quieres", "le gustaría", "prueba", "sírvete"], label: "an offer, like *¿Te provoca...?* or *prueba*" }
    ],
    model: "Pasa, pasa, estás en tu casa. ¿Te provoca un tinto? Prueba estas galletas, están buenísimas."
  },
  pitfalls: [
    "*¿Te apetece?* is what you hear in Spain; in Colombia, *¿te provoca?* or *¿quieres?*",
    "*Siéntate, siéntese* mixes two people: repeat the exact same word.",
    "*Te invito* means I'm paying, not just come along. Say it and the bill is yours."
  ]
},

"nt-puntualidad-retraso-b1": {
  source: "old",
  hook: {
    line: "You are meeting a client at nine in Medellín, the metro is packed, and your phone says 8:55. You need to say you're running late, that the train was delayed, and how long you'll be. Each of those is a different word.",
    es: "Qué pena, se me hizo tarde.\nLlego en diez minutos.",
    en: "I'm so sorry, I'm running late.\nI'll be there in ten minutes."
  },
  examples: [
    { es: "El vuelo salió con retraso por la lluvia.", en: "The flight left late because of the rain." },
    { es: "Apúrate, que vamos a llegar tarde.", en: "Hurry up, we're going to be late." },
    { es: "¿Cuánto te demoras en llegar?", en: "How long will it take you to get here?" }
  ],
  rule: "Three different facts, three different words.\nThe schedule slips: *El bus llegó con retraso.* *El vuelo está retrasado.* On time is *a tiempo* or *puntual*.\nHow long something takes: *demorarse* in Colombia, *tardar* anywhere. *Me demoro diez minutos.* *¿Cuánto tarda el bus?*\nThe person running late: *Llego tarde.* *Voy tarde.* *Se me hizo tarde* is the everyday excuse: it got late on me, nobody's fault.\nTo hurry someone: *Apúrate*, and to *usted*, *apúrese*. To calm them: *Tranquilo, no hay afán.*\nEarly is *temprano*: *Llegué temprano.* Well ahead of time: *con anticipación*.",
  readAndPick: [
    { q: "What is late?", es: "El tren llegó con retraso.",
      options: ["The speaker", "The train", "The driver"], answer: 1,
      why: "*Con retraso* is about the schedule: the train ran late." },
    { q: "What is she asking?", es: "¿Cuánto te demoras en llegar?",
      options: ["Why you're so late", "When you left home", "How long you'll take"], answer: 2,
      why: "*Demorarse* is how long something takes, the everyday verb in Colombia." },
    { q: "What does he want?", es: "Apúrate, que vamos a llegar tarde.",
      options: ["You to hurry", "You to calm down", "You to wait"], answer: 0,
      why: "*Apúrate* is hurry up; *que* gives the reason." },
    { q: "Who is she blaming?", es: "Qué pena, se me hizo tarde.",
      options: ["The traffic on the way", "Her boss at the office", "Nobody: it got late"], answer: 2,
      why: "*Se me hizo tarde* makes the lateness something that happened to her." },
    { q: "When did she arrive?", es: "Llegué temprano, antes que todos.",
      options: ["Early", "Late", "Right on the dot"], answer: 0,
      why: "*Temprano* is early, before everyone else." }
  ],
  yourTurn: [
    { en: "Sorry, I'm running late.", es: "Perdón, se me hizo tarde.", accept: ["[Perdón|Disculpa|Disculpe|Qué pena], se me hizo tarde."] },
    { en: "Hurry up, we're going to be late. (to a friend)", es: "Apúrate, que vamos a llegar tarde.", accept: ["Apúrate, (que) [vamos a llegar|llegamos] tarde."] },
    { en: "The flight left late because of the rain.", es: "El vuelo salió con retraso por la lluvia.", accept: ["El vuelo salió [con retraso|tarde|retrasado] por la lluvia."] },
    { en: "How long does the bus take?", es: "¿Cuánto se demora el bus?", accept: ["¿Cuánto [se demora|tarda|demora] el bus?"] },
    { en: "Relax, there's no rush. (to a friend)", es: "Tranquilo, no hay afán.", accept: ["[Tranquilo|Tranquila], no hay [afán|prisa]."] }
  ],
  translate: [
    { en: "I'll be there in ten minutes.", es: "Llego en diez minutos.", accept: ["[Llego|Voy a llegar|Llegaré] en diez minutos."] },
    { en: "The train arrived on time, not a minute late.", es: "El tren llegó a tiempo, ni un minuto tarde.", accept: ["El tren llegó [a tiempo|puntual], ni un minuto tarde."] },
    { en: "You took a long time to answer. (to a friend)", es: "Te demoraste mucho en contestar.", accept: ["[Te demoraste|Tardaste] mucho en [contestar|responder]."] },
    { en: "We're sorry about the delay.", es: "Lamentamos el retraso.", accept: [] },
    { en: "Hurry up, the bus is leaving. (polite)", es: "Apúrese, que el bus ya se va.", accept: ["Apúrese, (que) el bus [ya se va|se va|ya sale]."] }
  ],
  register: [
    { es: "Voy tarde, ya llego.", en: "I'm running late, I'm almost there.", when: "a quick text to a friend" },
    { es: "Perdón, se me hizo tarde.", en: "Sorry, I'm running late.", when: "the everyday excuse, with anyone" },
    { es: "Qué pena, voy a llegar unos minutos tarde.", en: "I'm so sorry, I'll be a few minutes late.", when: "in Colombia, to a client or a boss" },
    { es: "Le pido disculpas por el retraso.", en: "I apologize for the delay.", when: "in writing, or to someone you call usted" }
  ],
  personal: {
    prompt: "Text someone who is waiting for you: say you're late, say why, and say how long you'll be.",
    constraints: [
      { type: "containsAny", words: ["se me hizo tarde", "voy tarde", "llego tarde", "llegar tarde", "retraso"], label: "that you are late, like *se me hizo tarde*" },
      { type: "containsWord", word: "minutos", label: "how long, in minutes" }
    ],
    model: "Qué pena, se me hizo tarde y el metro va lleno. Llego en quince minutos."
  },
  pitfalls: [
    "*Date prisa* is what you hear in Spain; in Colombia, *apúrate*.",
    "*Estoy tarde* is English in disguise: say *voy tarde* or *llego tarde*.",
    "*Retraso* is a schedule slipping. For a person, *llegó tarde*."
  ]
},

"nt-tiempo-referencias-futuro-pasado-presente-b1": {
  source: "merged",
  hook: {
    line: "A new colleague asks how long you've lived in Colombia, what you do now, and when your family first came. Each answer needs a different kind of time word, and one of them looks like English but isn't.",
    es: "Llevo tres años viviendo en Cali.\nActualmente trabajo en un colegio.",
    en: "I've been living in Cali for three years.\nI currently work at a school."
  },
  examples: [
    { es: "Mis papás se conocieron a finales de los ochenta.", en: "My parents met in the late eighties." },
    { es: "En realidad no soy de aquí, soy de Pereira.", en: "Actually, I'm not from here, I'm from Pereira." },
    { es: "Dentro de dos semanas empiezan las vacaciones.", en: "The holidays start in two weeks." }
  ],
  rule: "Started in the past and still true: *llevar*, the time, and the *-ando* or *-iendo* form: *Llevo tres años viviendo aquí.* Or, as you know: *Vivo aquí desde hace tres años.*\nA stretch that is over takes the plain past: *Viví tres años en Cali* (and left).\nFrom now on: *dentro de dos semanas* (in two weeks), *a partir del lunes* (from Monday on).\n*Actualmente* means at the moment, never actually. Actually is *en realidad* or *de hecho*. Lately is *últimamente*.\nDecades: *en los ochenta*. Early, mid, late: *a principios de*, *a mediados de*, *a finales de*. *Siglo XX* is said *siglo veinte*.",
  readAndPick: [
    { q: "Does she still live there?", es: "Llevo dos años viviendo en Bogotá.",
      options: ["No, she left", "Yes, still", "Not yet"], answer: 1,
      why: "*Llevo* plus *viviendo*: it started two years ago and is still true." },
    { q: "And here?", es: "Viví dos años en Bogotá.",
      options: ["Yes, still", "She will soon", "No, that's over"], answer: 2,
      why: "The plain past closes the stretch: she lived there, then left." },
    { q: "What does *actualmente* mean here?", es: "Actualmente trabajo desde la casa.",
      options: ["At the moment", "Actually", "Eventually"], answer: 0,
      why: "*Actualmente* is a false friend: at the moment, nowadays." },
    { q: "When do the holidays start?", es: "Dentro de dos semanas empiezan las vacaciones.",
      options: ["Two weeks ago", "Two weeks from now", "For two weeks"], answer: 1,
      why: "*Dentro de* counts forward from now: in two weeks." },
    { q: "When did they meet?", es: "Se conocieron a mediados de los noventa.",
      options: ["In the late nineties", "In the early nineties", "In the mid nineties"], answer: 2,
      why: "*A mediados de* is mid: around 1995." }
  ],
  yourTurn: [
    { en: "I've been living in Cali for three years.", es: "Llevo tres años viviendo en Cali.", accept: ["Vivo en Cali desde hace tres años.", "Hace tres años que vivo en Cali."] },
    { en: "I currently work at a school.", es: "Actualmente trabajo en un colegio.", accept: ["Actualmente trabajo en [un colegio|una escuela]."] },
    { en: "Actually, it's not that expensive.", es: "En realidad, no es tan caro.", accept: ["[En realidad|De hecho], no es tan caro.", "En realidad no es tan caro."] },
    { en: "My parents met in the late eighties.", es: "Mis papás se conocieron a finales de los ochenta.", accept: ["Mis [papás|padres] se conocieron a finales de los (años) ochenta."] },
    { en: "The holidays start in two weeks.", es: "Dentro de dos semanas empiezan las vacaciones.", accept: ["Las vacaciones empiezan dentro de dos semanas.", "En dos semanas empiezan las vacaciones."] }
  ],
  translate: [
    { en: "I've had a lot of work lately.", es: "Últimamente tengo mucho trabajo.", accept: ["Últimamente he tenido mucho trabajo."] },
    { en: "From Monday on, the store opens at eight.", es: "A partir del lunes, la tienda abre a las ocho.", accept: ["A partir del lunes, la tienda [abre|va a abrir|abrirá] a las ocho."] },
    { en: "We've been waiting for an hour.", es: "Llevamos una hora esperando.", accept: ["Estamos esperando desde hace una hora.", "Hace una hora que estamos esperando."] },
    { en: "The house was built in the early twentieth century.", es: "La casa se construyó a principios del siglo veinte.", accept: ["La casa [se construyó|fue construida] a principios del siglo [veinte|XX]."] },
    { en: "I worked in Medellín for two years.", es: "Trabajé dos años en Medellín.", accept: ["Trabajé (durante) dos años en Medellín.", "Trabajé en Medellín (durante) dos años."] },
    { en: "Nowadays everyone has a cell phone.", es: "Hoy en día todo el mundo tiene celular.", accept: ["[Hoy en día|Actualmente] todo el mundo tiene (un) celular."] }
  ],
  register: [
    { es: "Llevo tres años aquí.", en: "I've been here three years.", when: "in conversation, the most natural" },
    { es: "Llevo tres años viviendo aquí.", en: "I've been living here for three years.", when: "to name what you have been doing" },
    { es: "Vivo aquí desde hace tres años.", en: "I've lived here for three years.", when: "anywhere, spoken or written" },
    { es: "Resido en Cali desde 2022.", en: "I have resided in Cali since 2022.", when: "on forms and in formal writing" }
  ],
  personal: {
    prompt: "Write two true lines about yourself: how long you have been doing something, and what you currently do.",
    constraints: [
      { type: "regex", pattern: "\\b(llevo|llevamos)\\b|desde hace", label: "how long: *llevo* or *desde hace*" },
      { type: "containsWord", word: "actualmente", label: "what you do now, with *actualmente*" }
    ],
    model: "Llevo dos años estudiando español. Actualmente trabajo en una empresa de software en Toronto."
  },
  pitfalls: [
    "*Actualmente es barato* means it's cheap at the moment. For actually, *en realidad*.",
    "*Llevo tres años vivir aquí* needs the *-iendo* form: *viviendo*.",
    "*A final de los setenta* drops a letter: the phrase is plural, *a finales de*."
  ]
},

"task-b1-planes": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: ten sentences or more about a real plan. Say what you have decided, what you think will happen, what you guess about it now, and what might go wrong.",
    es: "En marzo voy a pasar tres semanas en Colombia.\nCreo que será temporada de lluvias, así que llevaré botas.",
    en: "In March I'm going to spend three weeks in Colombia.\nI think it'll be the rainy season, so I'll take boots."
  },
  examples: [
    { es: "Cuando llegue a Cartagena, me quedaré en la casa de una amiga.", en: "When I get to Cartagena, I'll stay at a friend's house." },
    { es: "Serán unos seiscientos kilómetros, más o menos.", en: "It must be about six hundred kilometres, more or less." }
  ],
  rule: "A plan piece makes five moves, and you have the Spanish for each one.\nWhat you have decided: *voy a* or *pienso*: *Voy a pasar tres semanas en Colombia.*\nWhat you think will happen: the *-ré* form: *Será temporada de lluvias.*\nA moment still to come: *cuando* and the subjunctive: *Cuando llegue, te escribo.*\nA guess about now: *Serán unos seiscientos kilómetros.*\nWhat might go wrong: *A lo mejor llueve*, or *si* and the plain present: *Si llueve, iremos a un museo.*\nJoin it with *primero*, *después*, *así que* and *pero*, so it reads as one trip, not a list.",
  readAndPick: [
    { q: "What is this sentence doing?", es: "Voy a empezar por Bogotá.",
      options: ["Guessing about now", "Stating a decided plan", "Saying what went wrong"], answer: 1,
      why: "*Voy a* is a plan already made." },
    { q: "What is she doing here?", es: "Serán unos seiscientos kilómetros.",
      options: ["Promising", "Complaining", "Guessing"], answer: 2,
      why: "*Serán* with *unos*: a guess at the distance, not a forecast." },
    { q: "Why *llegue*?", es: "Cuando llegue a Cartagena, me quedaré con una amiga.",
      options: ["The arrival is still to come", "She arrived yesterday", "She arrives every year"], answer: 0,
      why: "After *cuando*, a moment still to come takes the subjunctive." },
    { q: "What might go wrong?", es: "Si llueve mucho, no podremos ir a la playa.",
      options: ["The money runs out", "Too much rain", "A missed flight"], answer: 1,
      why: "*Si llueve mucho*: the rain is the condition, and the beach is what is lost." },
    { q: "What does *así que* do?", es: "Será temporada de lluvias, así que llevaré botas.",
      options: ["Adds a doubt", "Changes the topic", "Gives the result"], answer: 2,
      why: "*Así que* is so: the boots follow from the rain." }
  ],
  yourTurn: [
    { en: "I'm going to spend three weeks in Colombia.", es: "Voy a pasar tres semanas en Colombia.", accept: [] },
    { en: "When I get to Cartagena, I'll stay at a friend's house.", es: "Cuando llegue a Cartagena, me quedaré en la casa de una amiga.", accept: ["Cuando llegue a Cartagena, me [quedaré|voy a quedar|quedo] en (la) casa de una amiga."] },
    { en: "It'll be the rainy season, so I'll take boots.", es: "Será temporada de lluvias, así que llevaré botas.", accept: ["Será temporada de lluvias, así que [llevaré|voy a llevar] botas."] },
    { en: "If it rains, we'll go to a museum.", es: "Si llueve, iremos a un museo.", accept: ["Si llueve, [iremos|vamos a ir|vamos] a un museo."] }
  ],
  translate: [
    { en: "Her brother works as a guide, so he'll most likely take us somewhere.", es: "Su hermano trabaja como guía, así que seguramente nos llevará a algún lugar.", accept: ["Su hermano trabaja [como|de] guía, así que seguramente nos [llevará|va a llevar] a algún [lugar|sitio]."] },
    { en: "What I don't know is whether I'll have time to see the south.", es: "Lo que no sé es si tendré tiempo de ver el sur.", accept: ["Lo que no sé es si [tendré|voy a tener] tiempo [de|para] ver el sur."] },
    { en: "It must be about six hundred kilometres.", es: "Serán unos seiscientos kilómetros.", accept: ["Serán [unos|como] seiscientos kilómetros."] },
    { en: "First I'll go to Bogotá, and then I'll go down to the coast.", es: "Primero iré a Bogotá y después bajaré a la costa.", accept: ["Primero [iré|voy a ir|voy] a Bogotá y [después|luego] [bajaré|voy a bajar|bajo] a la costa."] },
    { en: "I don't want to spend the trip on buses.", es: "No quiero pasar el viaje en buses.", accept: ["No quiero pasarme el viaje en buses."] }
  ],
  register: [
    { es: "Voy a viajar en marzo.", en: "I'm going to travel in March.", when: "a plan you have already decided" },
    { es: "Pienso viajar en marzo.", en: "I'm planning to travel in March.", when: "a plan, said as your intention" },
    { es: "Viajaré en marzo.", en: "I will travel in March.", when: "in writing, or to sound like a promise" },
    { es: "Si todo sale bien, viajo en marzo.", en: "If all goes well, I'm traveling in March.", when: "when the plan still depends on something" }
  ],
  personal: {
    prompt: "Write the opening of your own piece: one decided plan with *voy a*, one prediction with a *-ré* form, and one moment still to come with *cuando*.",
    constraints: [
      { type: "containsAny", words: ["voy a", "vamos a", "pienso"], label: "a decided plan: *voy a* or *pienso*" },
      { type: "anyVerbInTense", tense: "futuro", label: "a prediction with the *-ré* form" },
      { type: "subjunctiveAfter", trigger: "cuando", label: "a moment still to come: *cuando* and the subjunctive" }
    ],
    model: "En diciembre voy a visitar a mi familia en Ottawa. Hará mucho frío, seguro. Cuando llegue, mi mamá va a preparar su sopa de siempre."
  },
  pitfalls: [
    "*Cuando llegaré* is the slip to watch: after *cuando*, the subjunctive, *cuando llegue*.",
    "A piece that only says *voy a* reads like a list: mix in a *-ré* prediction and a guess."
  ]
},

/* ---- unit b1-u30 · Advice and what I would do ---------------------------- */

"condicional": {
  source: "merged",
  hook: {
    line: "Your cousin has been offered a job in Barranquilla and can't decide. She asks what you would do. English needs would or could as a separate word; Spanish folds it into one ending.",
    es: "Yo aceptaría, pero primero hablaría con mi familia.",
    en: "I'd accept, but first I'd talk to my family."
  },
  examples: [
    { es: "¿Podrías ayudarme con esto?", en: "Could you help me with this?" },
    { es: "Me encantaría ir, pero no puedo.", en: "I'd love to go, but I can't." },
    { es: "Serían las diez cuando llegó.", en: "It must have been about ten when he arrived." }
  ],
  rule: "Take the same stem as the *-ré* form and add *-ía*:\n*hablar*: *hablaría, hablarías, hablaría, hablaríamos, hablarían*\nThe short stems come along: *tendría, podría, haría, diría, saldría, vendría, sabría, habría*.\nIts everyday jobs:\npolite requests: *¿Podrías ayudarme?*\nwishes: *Me gustaría ir.* *Me encantaría.*\nadvice and what you would do: *Deberías descansar.* *Yo aceptaría.*\na guess about the past: *Serían las diez*, it must have been about ten. *Serán* guesses about now; *serían* takes one step back.\nCareful: would for an old habit is *iba* (*Íbamos los domingos*), and could for was able to is *podía*.",
  readAndPick: [
    { q: "What is she asking?", es: "¿Podrías cerrar la ventana?",
      options: ["Did you close the window?", "Could you close the window?", "Will you close the window?"], answer: 1,
      why: "*Podrías* is could you: a softer request than *¿puedes?*" },
    { q: "Who would accept?", es: "Aceptaríamos, pero no hay plata.",
      options: ["They would", "I would", "We would"], answer: 2,
      why: "*-íamos* is we: *aceptaríamos*, we would accept." },
    { q: "Is she talking about now or about then?", es: "Tendría unos veinte años en esa foto.",
      options: ["About then: a guess", "About now: a fact", "About later: a plan"], answer: 0,
      why: "*Tendría* guesses about a past moment: she must have been about twenty." },
    { q: "What does *íbamos* mean here?", es: "De niños, íbamos a la finca todos los domingos.",
      options: ["We would go, if we could", "We will go next week", "We would go, every week"], answer: 2,
      why: "Would for an old habit is the past form *íbamos*, not *iríamos*." },
    { q: "Which verb is behind *diría*?", es: "Yo no diría eso delante de ella.",
      options: ["dar, to give", "decir, to say", "deber, to owe"], answer: 1,
      why: "*Decir* shortens to *dir-*, as in *diré*: *diría*, I would say." }
  ],
  yourTurn: [
    { en: "Could you help me? (to a friend)", es: "¿Podrías ayudarme?", accept: ["¿Me podrías ayudar?"] },
    { en: "I'd love to go.", es: "Me encantaría ir.", accept: [] },
    { en: "What would you do? (to a friend)", es: "¿Qué harías tú?", accept: ["¿Tú qué harías?", "¿Qué harías?"] },
    { en: "It would be better to wait.", es: "Sería mejor esperar.", accept: [] },
    { en: "It must have been about ten when he arrived.", es: "Serían las diez cuando llegó.", accept: ["Serían [las diez|como las diez] cuando llegó."] }
  ],
  translate: [
    { en: "I'd like a coffee, please.", es: "Me gustaría un tinto, por favor.", accept: ["Me gustaría un [tinto|café], por favor."] },
    { en: "I wouldn't say that in front of her.", es: "Yo no diría eso delante de ella.", accept: ["No diría eso delante de ella."] },
    { en: "You should rest more. (to a friend)", es: "Deberías descansar más.", accept: [] },
    { en: "She said she would come.", es: "Dijo que vendría.", accept: ["Ella dijo que vendría."] },
    { en: "As a child, I could sleep anywhere.", es: "De niño, podía dormir en cualquier parte.", accept: ["De [niño|niña], podía dormir en cualquier [parte|lado|lugar].", "Cuando era [niño|niña], podía dormir en cualquier [parte|lado|lugar]."] },
    { en: "Would you like a coffee? (polite)", es: "¿Le gustaría un tinto?", accept: ["¿Le gustaría un [tinto|café]?"] }
  ],
  register: [
    { es: "Ayúdame.", en: "Help me.", when: "with close friends, when it's urgent" },
    { es: "¿Me ayudas?", en: "Will you help me?", when: "everyday, with anyone you call tú" },
    { es: "¿Me podrías ayudar?", en: "Could you help me?", when: "a little softer, for a bigger favour" },
    { es: "¿Me podría ayudar, por favor?", en: "Could you help me, please?", when: "to someone you call usted" },
    { es: "Le agradecería mucho su ayuda.", en: "I would be very grateful for your help.", when: "in a formal email" }
  ],
  personal: {
    prompt: "A friend has a decision to make this month. Tell them what you would do, then ask them for something politely.",
    constraints: [
      { type: "anyVerbInTense", tense: "condicional", label: "what you would do, with a *-ría* verb" },
      { type: "containsAny", words: ["podrías", "podría", "me gustaría"], label: "a polite request, like *¿Podrías...?*" }
    ],
    model: "Yo hablaría con tu jefe antes de decidir. ¿Me podrías contar cómo te va?"
  },
  pitfalls: [
    "*Podería* and *hacería* are the slips: the stems shorten as in the *-ré* form, *podría*, *haría*.",
    "*De niño iría al parque* says something else: an old habit is *iba*.",
    "The *í* always carries its accent: *gustaría*, *tendría*."
  ]
},

"fn-aconsejar-b1": {
  source: "merged",
  hook: {
    line: "A friend tells you her landlord in Bogotá wants to raise the rent a lot, and she asks what to do. You can nudge her gently, tell her straight, or put yourself in her shoes, and each one sounds different.",
    es: "Yo que tú, hablaría con él antes de firmar nada.",
    en: "If I were you, I'd talk to him before signing anything."
  },
  examples: [
    { es: "Podrías buscar otro apartamento.", en: "You could look for another apartment." },
    { es: "Deberías leer bien el contrato.", en: "You should read the contract carefully." },
    { es: "Lo mejor sería no decidir nada esta semana.", en: "The best thing would be not to decide anything this week." }
  ],
  rule: "Advice comes at three strengths, each followed by the dictionary form:\n*Podrías*: you could. An option.\n*Deberías*: you should. Clear advice.\n*Tendrías que*: you'd have to. The firmest, almost no choice.\nStep into their shoes with *Yo que tú* or *Yo en tu lugar*, then the *-ría* form: *Yo que tú, hablaría con él.* Not *voy*, not *vaya*.\nMake it general: *Lo mejor es* or *Lo mejor sería*, plus the dictionary form.\nAfter *te aconsejo* or *te recomiendo*, use the dictionary form or *que* and the subjunctive: *Te recomiendo que leas el contrato.*\nSoftest of all, a question: *¿Y si hablas con él?*",
  readAndPick: [
    { q: "How strong is this advice?", es: "Podrías hablar con tu jefe.",
      options: ["Firm: no choice", "Gentle: an option", "Not advice at all"], answer: 1,
      why: "*Podrías* leaves the choice open: you could." },
    { q: "What is she saying?", es: "Yo que tú, no firmaría nada.",
      options: ["She signed nothing herself", "She won't let you sign", "In your place, she wouldn't sign"], answer: 2,
      why: "*Yo que tú* plus *firmaría*: what she would do in your shoes." },
    { q: "How firm is this?", es: "Tendrías que ir al médico hoy mismo.",
      options: ["Almost no choice", "A gentle hint", "A mild option"], answer: 0,
      why: "*Tendrías que* is the firmest of the three." },
    { q: "Who should read the contract?", es: "Te recomiendo que leas bien el contrato.",
      options: ["The speaker should", "You should", "The landlord should"], answer: 1,
      why: "*Que leas*: the reading is yours, so *que* and the subjunctive." },
    { q: "What kind of advice is this?", es: "Lo mejor sería esperar una semana.",
      options: ["An order to wait", "A memory of waiting", "General, not personal"], answer: 2,
      why: "*Lo mejor sería* frames it as the best option, not as you must." }
  ],
  yourTurn: [
    { en: "If I were you, I'd talk to him.", es: "Yo que tú, hablaría con él.", accept: ["[Yo que tú|Yo en tu lugar], hablaría con él."] },
    { en: "You should read the contract carefully. (to a friend)", es: "Deberías leer bien el contrato.", accept: ["Deberías leer el contrato con cuidado."] },
    { en: "You could look for another apartment. (to a friend)", es: "Podrías buscar otro apartamento.", accept: [] },
    { en: "You'd have to go to the doctor. (to a friend)", es: "Tendrías que ir al médico.", accept: [] },
    { en: "The best thing would be to wait.", es: "Lo mejor sería esperar.", accept: [] }
  ],
  translate: [
    { en: "If I were you, I wouldn't sign anything.", es: "Yo que tú, no firmaría nada.", accept: ["[Yo que tú|Yo en tu lugar], no firmaría nada."] },
    { en: "I recommend that you read the contract carefully. (to a friend)", es: "Te recomiendo que leas bien el contrato.", accept: ["Te recomiendo [que leas|leer] bien el contrato.", "Te recomiendo que leas el contrato con cuidado."] },
    { en: "You should sleep a bit more. (to a friend)", es: "Deberías dormir un poco más.", accept: [] },
    { en: "What if you tell him everything that happened? (to a friend)", es: "¿Y si le cuentas todo lo que pasó?", accept: ["¿[Y si|Qué tal si] le cuentas todo lo que pasó?"] },
    { en: "It's important that you drink a lot of water. (to a friend)", es: "Es importante que tomes mucha agua.", accept: ["Es importante que [tomes|bebas] mucha agua."] },
    { en: "In your place, I'd ask first.", es: "Yo en tu lugar, preguntaría primero.", accept: ["[Yo en tu lugar|Yo que tú], preguntaría primero."] }
  ],
  register: [
    { es: "¿Y si hablas con él?", en: "What if you talk to him?", when: "the softest, a question they can turn down" },
    { es: "Podrías hablar con él.", en: "You could talk to him.", when: "a gentle option, with anyone you call tú" },
    { es: "Yo que tú, hablaría con él.", en: "If I were you, I'd talk to him.", when: "with a friend, as what you would do" },
    { es: "Deberías hablar con él.", en: "You should talk to him.", when: "clear advice, when you are sure" },
    { es: "Le recomiendo hablar con él.", en: "I recommend you talk to him.", when: "to a client or someone you call usted" }
  ],
  personal: {
    prompt: "A friend has a real problem with money, work or a flatmate. Give two pieces of advice at different strengths, one of them with *Yo que tú*.",
    constraints: [
      { type: "containsAny", words: ["yo que tú", "yo en tu lugar"], label: "*yo que tú* or *yo en tu lugar*" },
      { type: "anyVerbInTense", tense: "condicional", label: "a *-ría* verb for what you would do" },
      { type: "containsAny", words: ["podrías", "deberías", "tendrías que", "lo mejor"], label: "a second piece: *podrías*, *deberías* or *tendrías que*" }
    ],
    model: "Yo que tú, hablaría con el dueño del apartamento. También podrías buscar algo más barato cerca del trabajo."
  },
  pitfalls: [
    "*Yo que tú, voy* is the slip: after *yo que tú*, the *-ría* form, *iría*.",
    "*Deberías que hablar* and *tendrías hablar* swap the *que*: *deberías hablar*, *tendrías que hablar*.",
    "*Te aconsejo que ir* blends two frames: *te aconsejo ir* or *te aconsejo que vayas*."
  ]
},

"gr-condicionales-b1": {
  source: "merged",
  hook: {
    line: "You and a friend are planning a Sunday trip to a finca outside Medellín, and everything depends on the weather. Every plan comes with an if, and in Spanish the if half never takes the *-ré* form, just as in English.",
    es: "Si llueve, nos quedamos en la casa.\nSi hace sol, iremos a la finca.",
    en: "If it rains, we'll stay home.\nIf it's sunny, we'll go to the finca."
  },
  examples: [
    { es: "Si tienes tiempo, ven a almorzar.", en: "If you have time, come over for lunch." },
    { es: "Te llamaré si encuentro las llaves.", en: "I'll call you if I find the keys." },
    { es: "No sé si vendrá.", en: "I don't know if she'll come." }
  ],
  rule: "*Si* plus the plain present sets up a condition that could really happen: *si llueve*, *si tienes tiempo*.\nThe other half can be:\nthe present: *Si llueve, nos quedamos.*\n*voy a* or the *-ré* form: *Si llueve, iremos a un museo.*\na request: *Si tienes tiempo, ven.*\nThe *si* half never takes the *-ré* form. English agrees: nobody says if it will rain.\nThe order can flip: *Te llamo si encuentro las llaves.* With *si* first, use a comma.\nOne *si* is different: whether. *No sé si vendrá* is fine, as in English: I don't know if she'll come.\nAnd *si* is if; *sí*, with an accent, is yes.",
  readAndPick: [
    { q: "What does *si* mean here?", es: "No sé si vendrá mañana.",
      options: ["If, as a condition", "Yes, of course", "Whether"], answer: 2,
      why: "After *no sé*, *si* is whether, and then the *-ré* form is fine." },
    { q: "When will she call?", es: "Te llamo si encuentro las llaves.",
      options: ["Every morning", "Only if she finds them", "As soon as she loses them"], answer: 1,
      why: "The *si* half is the condition: finding the keys." },
    { q: "Why *llueve* and not *lloverá*?", es: "Si llueve, no iré.",
      options: ["The *si* half keeps the present", "It's raining right now", "It rains every day"], answer: 0,
      why: "A real condition keeps the plain present after *si*; the *-ré* form goes in the other half." },
    { q: "What is she telling you to do?", es: "Si tienes hambre, come algo.",
      options: ["Cook something for her", "Eat something", "Wait until dinner"], answer: 1,
      why: "The other half is a plain command: *come algo*." },
    { q: "What is she answering?", es: "¿Vas a venir?\nSí, si salgo temprano.",
      options: ["Yes, if she leaves early", "Only if you come too", "No, she's leaving early"], answer: 0,
      why: "*Sí* with an accent is yes; *si* without one is if." }
  ],
  yourTurn: [
    { en: "If it rains, we'll stay home.", es: "Si llueve, nos quedamos en la casa.", accept: ["Si llueve, nos [quedamos|vamos a quedar|quedaremos] en (la) casa."] },
    { en: "If you have time, come over for lunch. (to a friend)", es: "Si tienes tiempo, ven a almorzar.", accept: ["Si tienes tiempo, [ven|vente] a almorzar."] },
    { en: "I'll call you if I find the keys. (to a friend)", es: "Te llamaré si encuentro las llaves.", accept: ["Te [llamaré|llamo|voy a llamar] si encuentro las llaves."] },
    { en: "If it's sunny, we'll go to the finca.", es: "Si hace sol, iremos a la finca.", accept: ["Si hace sol, [iremos|vamos a ir|vamos] a la finca."] },
    { en: "I don't know if she'll come.", es: "No sé si vendrá.", accept: ["No sé si [vendrá|va a venir|viene]."] }
  ],
  translate: [
    { en: "If you don't understand something, ask me. (to a friend)", es: "Si no entiendes algo, pregúntame.", accept: [] },
    { en: "If I pass the exam, I'll celebrate with my friends.", es: "Si paso el examen, celebraré con mis amigos.", accept: ["Si [paso|apruebo] el examen, [celebraré|voy a celebrar|celebro] con mis amigos."] },
    { en: "Will you come if I invite you? (to a friend)", es: "¿Vendrás si te invito?", accept: ["¿[Vendrás|Vienes|Vas a venir] si te invito?"] },
    { en: "If she comes, we'll make arepas.", es: "Si ella viene, haremos arepas.", accept: ["Si (ella) viene, [haremos|vamos a hacer|hacemos] arepas."] },
    { en: "If you can, help me tomorrow. (to a friend)", es: "Si puedes, ayúdame mañana.", accept: [] }
  ],
  register: [
    { es: "Si quieres, vamos.", en: "If you want, we'll go.", when: "with friends, an easy offer" },
    { es: "Si puedes, ven temprano.", en: "If you can, come early.", when: "a gentle request that leaves an out" },
    { es: "Si llueve, se cancela el partido.", en: "If it rains, the match is cancelled.", when: "for rules and announcements" },
    { es: "Si tiene alguna pregunta, me escribe.", en: "If you have any questions, write to me.", when: "to someone you call usted, at work" }
  ],
  personal: {
    prompt: "Plan your coming weekend both ways: one line with *Si hace sol,* and one with *Si llueve,*.",
    constraints: [
      { type: "regex", pattern: "\\bsi hace (sol|buen tiempo)", label: "*Si hace sol* and what you will do" },
      { type: "regex", pattern: "\\bsi llueve", label: "*Si llueve* and what you will do" }
    ],
    model: "Si hace sol, iré a montar en bicicleta por la ciclovía. Si llueve, me quedaré en la casa viendo una película."
  },
  pitfalls: [
    "*Si lloverá* is the slip: the *si* half keeps the present, *si llueve*.",
    "*Iré si podré* flips the order but not the rule: *iré si puedo*.",
    "*Sí llueve* says yes, it's raining: if has no accent."
  ]
},

"dc-atenuacion-b1": {
  source: "merged",
  hook: {
    line: "You walk into a bank in Cali to ask about an account, and later you have to tell a client the order won't arrive this week. Both times, Spanish softens by taking a small step back before it says the thing.",
    es: "Buenos días, quería preguntar por una cuenta de ahorros.",
    en: "Good morning, I wanted to ask about a savings account."
  },
  examples: [
    { es: "¿Qué necesitaba?", en: "What did you need?" },
    { es: "Me temo que no va a poder ser esta semana.", en: "I'm afraid it won't be possible this week." },
    { es: "Yo diría que es mejor esperar.", en: "I'd say it's better to wait." }
  ],
  rule: "Spanish softens by stepping back.\nInto the past, with no past meaning: *Quería preguntar por una cuenta.* *Venía por lo del anuncio.* A clerk asks *¿Qué necesitaba?* All of it is about right now.\nInto the *-ría* form: *¿Podría ayudarme?* For a view that might clash: *Yo diría que no es así.*\nInto a short opener before bad news: *Me temo que no tenemos mesa.* It means sorry to say, not fear, and the verb after it stays ordinary.\nInto *va a ser*: *Va a ser difícil* lands softer than *es imposible*. *No va a poder ser* is a gentle no.\nAnd *creo que* or *me parece que* turns a fact into your view.",
  readAndPick: [
    { q: "When does he want to ask?", es: "Quería preguntar por el precio.",
      options: ["Yesterday, but he forgot", "Right now", "Every week"], answer: 1,
      why: "*Quería* is a polite step back: the question is being asked now." },
    { q: "What is the clerk asking?", es: "¿Qué necesitaba?",
      options: ["What you needed last week", "Why you came so late", "What she can do for you now"], answer: 2,
      why: "The past form softens a question about right now." },
    { q: "Is she frightened?", es: "Me temo que no tenemos mesa.",
      options: ["No, she's sorry to say it", "Yes, very", "No, she's annoyed"], answer: 0,
      why: "*Me temo que* is sorry to say, not fear." },
    { q: "How does this answer land?", es: "Va a ser difícil, la verdad.",
      options: ["Like a flat no", "Like a firm yes", "Like a soft no"], answer: 2,
      why: "*Va a ser difícil* says no without slamming the door." },
    { q: "Why *diría* and not *digo*?", es: "Yo diría que no es buena idea.",
      options: ["To talk about later", "To sound less blunt", "To talk about yesterday"], answer: 1,
      why: "The *-ría* form makes a view that might clash sound tentative." }
  ],
  yourTurn: [
    { en: "I wanted to ask you a favour. (polite)", es: "Quería pedirle un favor.", accept: ["Le quería pedir un favor."] },
    { en: "I've come about the ad.", es: "Venía por lo del anuncio.", accept: ["Venía por lo del [anuncio|aviso]."] },
    { en: "I'm afraid we don't have a table.", es: "Me temo que no tenemos mesa.", accept: [] },
    { en: "I'm afraid it won't be possible this week.", es: "Me temo que no va a poder ser esta semana.", accept: ["Me temo que no va a [poder ser|ser posible] esta semana."] },
    { en: "I'd say it's better to wait.", es: "Yo diría que es mejor esperar.", accept: ["Diría que es mejor esperar."] }
  ],
  translate: [
    { en: "We wanted to book a table for four.", es: "Queríamos reservar una mesa para cuatro.", accept: [] },
    { en: "Could you help me, please? (polite)", es: "¿Podría ayudarme, por favor?", accept: ["¿Me podría ayudar, por favor?"] },
    { en: "I'm afraid the doctor has already left.", es: "Me temo que la doctora ya salió.", accept: ["Me temo que [la doctora|el doctor] ya [salió|se fue]."] },
    { en: "I think it's going to be difficult.", es: "Creo que va a ser difícil.", accept: ["[Creo|Me parece] que va a ser difícil."] },
    { en: "Sorry, what was your name again? (to a friend)", es: "Perdón, ¿cómo te llamabas?", accept: ["[Perdón|Disculpa], ¿cómo te llamabas?"] }
  ],
  register: [
    { es: "Quiero abrir una cuenta.", en: "I want to open an account.", when: "correct but blunt, with a stranger" },
    { es: "Quería abrir una cuenta.", en: "I wanted to open an account.", when: "the polite default at any counter" },
    { es: "¿Me regala información sobre las cuentas?", en: "Could I have some information about the accounts?", when: "in Colombia, everyday and friendly" },
    { es: "Me gustaría abrir una cuenta.", en: "I'd like to open an account.", when: "polite and a little more formal" }
  ],
  personal: {
    prompt: "Think of a favour you need from a neighbour or a colleague. Ask for it politely, then give one piece of mild bad news with *Me temo que*.",
    constraints: [
      { type: "containsAny", words: ["quería", "queríamos", "venía", "podría", "me gustaría"], label: "a soft request: *quería*, *venía* or *¿podría...?*" },
      { type: "containsWord", word: "me temo que", label: "mild bad news with *me temo que*" }
    ],
    model: "Quería pedirle un favor: ¿podría recibir un paquete mañana? Me temo que no voy a estar en la casa."
  },
  pitfalls: [
    "*Quise pedirle un favor* sounds like you tried once and gave up: the soft step back is *quería*.",
    "*Me temo que no tengamos mesa* is the slip: bad news after *me temo que* stays ordinary, *tenemos*.",
    "*Tengo miedo de que* is real fear: for sorry to say, *me temo que*."
  ]
},

"fn-valorar-b1": {
  source: "merged",
  hook: {
    line: "You've just come back from a weekend in Salento and everyone asks how it was. A trip, a meal, a film: giving a verdict is half of small talk, and Spanish has a whole scale for it, from *pésimo* to *espectacular*.",
    es: "¿Qué tal Salento?\n¡Estuvo espectacular! Aunque el hotel no estuvo tan bueno.",
    en: "How was Salento?\nIt was amazing! Although the hotel wasn't that good."
  },
  examples: [
    { es: "La película me pareció muy aburrida.", en: "I found the movie really boring." },
    { es: "El restaurante no está nada mal.", en: "The restaurant isn't bad at all." },
    { es: "Cancelar el viaje fue un error.", en: "Cancelling the trip was a mistake." }
  ],
  rule: "For an experience that is over, use *estuvo* or *me pareció*: *La fiesta estuvo buenísima.* *La película me pareció aburrida.*\nFor how something is now: *es* or *está* and a word from the scale:\n*espectacular*, *excelente*, *muy bueno*, *no está nada mal*, *regular*, *malo*, *pésimo*.\n*No está nada mal* is warmer than it looks: it means pretty good.\nTo judge an action in general: the dictionary form. *Cancelar el viaje fue un error.*\nTo judge what someone else does: *que* and the subjunctive. *Es un error que canceles el viaje.* *¡Qué bien que vengas!*\nNow you can soften it too: *Sería un error cancelar.*",
  readAndPick: [
    { q: "How was the party?", es: "La fiesta estuvo buenísima.",
      options: ["Not great", "Really good", "Still going on"], answer: 1,
      why: "*Estuvo buenísima*: over, and really good." },
    { q: "What does she think of the restaurant?", es: "No está nada mal.",
      options: ["It's pretty good", "It's terrible", "It's closed today"], answer: 0,
      why: "*No está nada mal* is praise: not bad at all." },
    { q: "Who is cancelling?", es: "Me parece un error que canceles el viaje.",
      options: ["The speaker is", "The airline is", "You are"], answer: 2,
      why: "*Canceles* ends in *-s*: you. Someone else's action after *que* takes the subjunctive." },
    { q: "Where on the scale is this?", es: "El servicio fue pésimo.",
      options: ["The very top", "The very bottom", "The middle"], answer: 1,
      why: "*Pésimo* is the bottom: terrible." },
    { q: "When is she judging the movie?", es: "La película me pareció aburrida.",
      options: ["After seeing it", "Before seeing it", "While buying tickets"], answer: 0,
      why: "*Me pareció* is the plain past: a verdict on something over." }
  ],
  yourTurn: [
    { en: "The party was really good.", es: "La fiesta estuvo buenísima.", accept: ["La fiesta estuvo [buenísima|muy buena]."] },
    { en: "I found the movie really boring.", es: "La película me pareció muy aburrida.", accept: ["La película me pareció [muy aburrida|aburridísima]."] },
    { en: "The restaurant isn't bad at all.", es: "El restaurante no está nada mal.", accept: [] },
    { en: "Cancelling the trip was a mistake.", es: "Cancelar el viaje fue un error.", accept: [] },
    { en: "It's great that you're coming! (to a friend)", es: "¡Qué bien que vengas!", accept: ["¡Qué [bien|bueno|chévere] que vengas!"] }
  ],
  translate: [
    { en: "The service was terrible.", es: "El servicio fue pésimo.", accept: ["El servicio [fue|estuvo] pésimo."] },
    { en: "It's a mistake for you to cancel the trip. (to a friend)", es: "Es un error que canceles el viaje.", accept: [] },
    { en: "The experience was excellent.", es: "La experiencia fue excelente.", accept: ["La experiencia [fue|estuvo] excelente."] },
    { en: "It would be a mistake to sell the house now.", es: "Sería un error vender la casa ahora.", accept: [] },
    { en: "It's a good idea for you to rest a bit. (to a friend)", es: "Es buena idea que descanses un poco.", accept: ["Es (una) buena idea que descanses un poco."] },
    { en: "The concert was amazing!", es: "¡El concierto estuvo espectacular!", accept: ["¡El concierto [estuvo|fue] espectacular!"] }
  ],
  register: [
    { es: "¡Estuvo delicioso!", en: "It was delicious!", when: "with anyone, warm and safe" },
    { es: "Estuvo muy chévere.", en: "It was really great.", when: "in Colombia, everyday and friendly" },
    { es: "No estuvo nada mal.", en: "It wasn't bad at all.", when: "low key praise, a little dry" },
    { es: "Estuvo regular.", en: "It was so-so.", when: "to say it was not great, kindly" },
    { es: "La comida fue excelente.", en: "The food was excellent.", when: "in a written review or a formal thank you" }
  ],
  personal: {
    prompt: "Give your verdict on something you did recently, like a trip, a meal or a film. Then react to something someone else is doing with *¡Qué bien que...!*",
    constraints: [
      { type: "containsAny", words: ["estuvo", "me pareció", "fue"], label: "a verdict on something over: *estuvo* or *me pareció*" },
      { type: "subjunctiveAfter", trigger: "bien que", label: "what someone else does: *qué bien que* and the subjunctive" }
    ],
    model: "El viaje a Salento estuvo espectacular. ¡Qué bien que mi hermana venga en diciembre!"
  },
  pitfalls: [
    "*Es un error que cancelas* is the slip: someone else's action after *que* takes the subjunctive, *canceles*.",
    "*No está nada mal* is praise, not a complaint.",
    "*Fue un error que cancelar* blends two frames: *fue un error cancelar*."
  ]
},

"fn-pedir-valoracion-b1": {
  source: "merged",
  hook: {
    line: "You've cooked for friends for the first time, or shown a colleague your slides before a big meeting. Now you want their verdict, and maybe their OK for what comes next. Spanish asks for both with one verb, *parecer*.",
    es: "¿Qué te pareció el ajiaco?\n¿Te parece bien que la próxima vez haga bandeja paisa?",
    en: "What did you think of the ajiaco?\nIs it OK with you if next time I make bandeja paisa?"
  },
  examples: [
    { es: "¿Qué tal estuvo la reunión?", en: "How did the meeting go?" },
    { es: "¿Cómo lo ves?", en: "How do you see it?" },
    { es: "¿Les parece bien que empecemos ya?", en: "Is it OK with you all if we start now?" }
  ],
  rule: "For a verdict on something over, use the plain past: *¿Qué te pareció la película?* *¿Qué tal estuvo el viaje?* *¿Te gustó?*\nFor something now: *¿Qué tal está la sopa?* *¿Cómo lo ves?*\nIn context, *¿Qué tal?* alone is enough: you hold out the dish and they know what you mean.\nTo check that a plan is OK with them, use *¿Te parece bien que...?* and the subjunctive, because you hold your idea up for approval: *¿Te parece bien que empecemos?*\nFor an action in general, the dictionary form: *¿Te parece bien empezar ya?*\nFor *usted*, *¿Le parece bien...?*; for a group, *¿Les parece bien...?*",
  readAndPick: [
    { q: "When was the meeting?", es: "¿Qué tal estuvo la reunión?",
      options: ["It's tomorrow", "It's over", "It's going on now"], answer: 1,
      why: "*Estuvo* is the plain past: she asks about a meeting that is over." },
    { q: "Who would start?", es: "¿Les parece bien que empecemos ya?",
      options: ["You all would", "They would", "We would"], answer: 2,
      why: "*Empecemos* is we, and *les* is the group being asked." },
    { q: "Who is being asked?", es: "¿Le parece bien el horario?",
      options: ["Someone she calls usted", "A close friend of hers", "A whole group of people"], answer: 0,
      why: "*Le* is the *usted* form; a friend would get *¿te parece bien?*" },
    { q: "What is she asking about?", es: "Te traje un postre. ¿Qué tal?",
      options: ["How you are feeling", "When you want to eat", "What you think of the dessert"], answer: 2,
      why: "With the dessert in front of you, *¿Qué tal?* alone asks for a verdict." },
    { q: "What does *¿Cómo lo ves?* ask for?", es: "Este es el plan. ¿Cómo lo ves?",
      options: ["Whether you can see it", "Your view of the plan", "Where the plan is"], answer: 1,
      why: "*¿Cómo lo ves?* asks how it looks to you: your view." }
  ],
  yourTurn: [
    { en: "What did you think of the movie? (to a friend)", es: "¿Qué te pareció la película?", accept: ["¿Qué tal te pareció la película?"] },
    { en: "How did the meeting go?", es: "¿Qué tal estuvo la reunión?", accept: ["¿[Qué tal|Cómo] [estuvo|fue|salió] la reunión?"] },
    { en: "Is it OK with you if we start now? (to a friend)", es: "¿Te parece bien que empecemos ya?", accept: ["¿Te parece bien que empecemos [ya|ahora]?"] },
    { en: "Did you like it? (to a friend)", es: "¿Te gustó?", accept: [] },
    { en: "Is the schedule OK with you? (polite)", es: "¿Le parece bien el horario?", accept: [] }
  ],
  translate: [
    { en: "Is it OK with you all if we meet at eight?", es: "¿Les parece bien que nos veamos a las ocho?", accept: [] },
    { en: "How's the soup?", es: "¿Qué tal está la sopa?", accept: ["¿Qué tal la sopa?", "¿Cómo está la sopa?"] },
    { en: "Do you think it's a good idea to invite both of them? (to a friend)", es: "¿Te parece buena idea invitarlos a los dos?", accept: ["¿Te parece (una) buena idea [invitarlos a los dos|invitar a los dos]?"] },
    { en: "Here's the plan. How do you see it? (to a friend)", es: "Este es el plan. ¿Cómo lo ves?", accept: ["[Este es|Aquí está] el plan. ¿(Tú) cómo lo ves?"] },
    { en: "What did you think of the hotel? (polite)", es: "¿Qué le pareció el hotel?", accept: [] }
  ],
  register: [
    { es: "¿Qué tal?", en: "How is it?", when: "in context, when they can see what you mean" },
    { es: "¿Te gustó?", en: "Did you like it?", when: "with friends, simple and direct" },
    { es: "¿Qué te pareció?", en: "What did you think of it?", when: "with anyone you call tú, for a real opinion" },
    { es: "¿Qué le pareció la presentación?", en: "What did you think of the presentation?", when: "to someone you call usted, at work" },
    { es: "¿Les parece bien el plan?", en: "Is the plan OK with you all?", when: "to a group, before you go ahead" }
  ],
  personal: {
    prompt: "Write two questions for people you'll see this week: one asking what they thought of something, and one checking a plan of yours.",
    constraints: [
      { type: "regex", pattern: "(qu[eé] (te|le|les) pareci[oó]|qu[eé] tal estuvo|te gust[oó])", label: "a verdict question, like *¿Qué te pareció...?*" },
      { type: "subjunctiveAfter", trigger: "parece bien que", label: "a plan to check: *¿Te parece bien que...?* and the subjunctive" }
    ],
    model: "¿Qué te pareció el concierto del sábado? ¿Te parece bien que nos veamos el jueves para almorzar?"
  },
  pitfalls: [
    "*¿Te parece bien que nos vemos?* is the slip: a plan held up for approval takes *veamos*.",
    "*¿Qué te ha parecido?* is what you hear in Spain; in Colombia, *¿qué te pareció?*",
    "Bare *¿Qué tal?* needs the thing in front of them; in a message, name it."
  ]
},

"task-b1-consejo": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a message from someone asking for your advice, and your reply. Give three suggestions that grow firmer, and end with reassurance, not one more instruction.",
    es: "No sé qué hacer. Me ofrecieron un trabajo que paga mejor, pero en otra ciudad.",
    en: "I don't know what to do. They offered me a job that pays better, but in another city."
  },
  examples: [
    { es: "Yo que tú, preguntaría primero si puedes trabajar desde la casa.", en: "If I were you, I'd ask first if you can work from home." },
    { es: "Lo mejor sería hablarlo con calma con tu familia.", en: "The best thing would be to talk it over calmly with your family." }
  ],
  rule: "A reply that helps makes four moves.\nShow you heard: *¡Uy, qué dilema!* *Te entiendo.*\nGive three suggestions that grow firmer:\n*Podrías pedir unos meses de prueba.*\n*Yo que tú, preguntaría si puedes trabajar desde la casa.*\n*Lo mejor sería no decidir nada esta semana.*\nBack each one with a reason: *porque*, *así*, *además*.\nEnd with reassurance, not one more instruction: *Tranquila, todo va a salir bien.*\n*Deberías* and *tendrías que* push harder, so match them to how well you know the person. Three in a row sound like a telling off.",
  readAndPick: [
    { q: "How hard is this pushing?", es: "Podrías pedir unos meses de prueba.",
      options: ["Firmly: almost an order", "Softly: an option", "Not at all: a question"], answer: 1,
      why: "*Podrías* offers an option and leaves the choice to them." },
    { q: "What is she doing?", es: "Te entiendo, es una decisión difícil.",
      options: ["Giving an order", "Changing the subject", "Showing she heard"], answer: 2,
      why: "*Te entiendo* shows you heard before you advise." },
    { q: "What does the reply end with?", es: "Tranquila, todo va a salir bien.",
      options: ["Reassurance", "Another instruction", "A question"], answer: 0,
      why: "*Tranquila* and *todo va a salir bien* reassure; nothing more to do." },
    { q: "What is he imagining?", es: "Yo en tu lugar, no me mudaría todavía.",
      options: ["Your old job", "Being in your place", "Moving next week"], answer: 1,
      why: "*Yo en tu lugar* puts him in your shoes, then *mudaría*." },
    { q: "Why does *sería* soften this?", es: "Lo mejor sería esperar unos días.",
      options: ["It sounds like a past event", "It turns it into a question", "It says would, not is"], answer: 2,
      why: "*Sería* frames the advice as would be, which leaves them room." }
  ],
  yourTurn: [
    { en: "You could ask for a few months' trial. (to a friend)", es: "Podrías pedir unos meses de prueba.", accept: [] },
    { en: "If I were you, I'd ask first.", es: "Yo que tú, preguntaría primero.", accept: ["[Yo que tú|Yo en tu lugar], preguntaría primero."] },
    { en: "The best thing would be to talk it over calmly.", es: "Lo mejor sería hablarlo con calma.", accept: ["Lo mejor sería hablarlo [con calma|tranquilamente]."] },
    { en: "Relax, everything is going to turn out fine. (to a friend)", es: "Tranquila, todo va a salir bien.", accept: ["[Tranquila|Tranquilo], todo [va a salir|saldrá] bien."] }
  ],
  translate: [
    { en: "I don't know what to do. They offered me a job that pays better, but in another city.", es: "No sé qué hacer. Me ofrecieron un trabajo que paga mejor, pero en otra ciudad.", accept: ["No sé qué hacer. Me ofrecieron un [trabajo|puesto] que paga mejor, pero en otra ciudad."] },
    { en: "If I were you, I wouldn't move yet.", es: "Yo que tú, no me mudaría todavía.", accept: ["[Yo que tú|Yo en tu lugar], [no me mudaría todavía|todavía no me mudaría]."] },
    { en: "I understand you, it's a hard decision. (to a friend)", es: "Te entiendo, es una decisión difícil.", accept: [] },
    { en: "You should ask if you can work from home some days. (to a friend)", es: "Deberías preguntar si puedes trabajar desde la casa algunos días.", accept: ["Deberías preguntar si puedes trabajar desde (la) casa algunos días."] },
    { en: "And if it doesn't work out, it's no big deal.", es: "Y si no sale, no pasa nada.", accept: ["Y si no [sale|funciona], no pasa nada."] }
  ],
  register: [
    { es: "¡Uy, qué dilema!", en: "Oh, what a dilemma!", when: "with a friend, to show you feel it too" },
    { es: "Te entiendo perfectamente.", en: "I understand you completely.", when: "with anyone you call tú, warm and calm" },
    { es: "Entiendo su situación.", en: "I understand your situation.", when: "to someone you call usted, or at work" },
    { es: "Gracias por contarme.", en: "Thanks for telling me.", when: "to thank them for trusting you first" }
  ],
  personal: {
    prompt: "Write your reply to the message: three suggestions that grow firmer, and a last line of reassurance.",
    constraints: [
      { type: "containsAny", words: ["podrías", "yo que tú", "yo en tu lugar", "lo mejor sería", "deberías", "tendrías que"], label: "suggestions with *podrías*, *yo que tú* or *lo mejor sería*" },
      { type: "anyVerbInTense", tense: "condicional", label: "at least one *-ría* verb" },
      { type: "minSentences", n: 4, label: "four sentences or more" }
    ],
    model: "Te entiendo, es una decisión difícil. Podrías pedir unos meses de prueba. Yo que tú, preguntaría si puedes trabajar desde la casa algunos días. Tranquila, todo va a salir bien."
  },
  pitfalls: [
    "Three *deberías* in a row sound like a telling off: mix *podrías*, *yo que tú* and *lo mejor sería*.",
    "A reply that ends with one more instruction leaves them with homework: end with reassurance."
  ]
}

};
