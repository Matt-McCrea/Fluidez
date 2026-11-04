/* ============================================================================
 * TEACHING SCRIPTS, B1 units 1 to 8 (window.SCRIPTS_B1), keyed by lesson id.
 * Units b1-u27 "What I think", b1-u28 "Agreeing and arguing", b1-u29 "Plans
 * and predictions", b1-u30 "Advice and what I would do", b1-u31 "What I want
 * from you", b1-u32 "Asking, refusing, forbidding", b1-u33 "Good feelings"
 * and b1-u34 "When it goes wrong": every lesson on the path from
 * COURSE_BANDS.B1, the present subjunctive first.
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
 * (podríamos, deberías, me gustaría) appear.
 *
 * Units 5 to 8 add two more dates. Ojalá is taught on fn-expresar-deseos-b1,
 * and the scripts of b1-u31 to b1-u34 use it only from that day. Negative tú
 * commands (no toques, no vayas) wait for impneg in b1-u32; before it the only
 * one is No te preocupes, a whole phrase since A2. Peninsular forms the old
 * lessons used (vosotros, apetecer, enfadarse, lo pasé bien, hacer cola, coche,
 * aparcar, piso, ya he quedado) are replaced by the Colombian ones and named
 * only in pitfalls. No past subjunctive, no pluperfect, no perfect subjunctive
 * anywhere in these eight units: the old lessons' que hayas venido, que
 * abriera and que todo saliera bien are rewritten in the present.
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
    { en: "I hope you have a good day. (to a friend)", es: "Espero que tengas un buen día.", accept: ["Espero que tengas un buen día."] },
    { en: "I doubt there is time.", es: "Dudo que haya tiempo.", accept: [] }
  ],
  translate: [
    { en: "I hope you get better soon. (to a friend)", es: "Espero que te mejores pronto.", accept: ["Espero que te mejores pronto."] },
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
    { es: "Espero que todo te salga bien.", en: "I hope it all works out for you.", when: "when you care a lot and are not sure it will" },
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
      options: ["Two: one good, one bad", "Only the good side", "Three different reasons"], answer: 0,
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
},

/* ---- unit b1-u31 · What I want from you ---------------------------------- */

"gr-subordinadas-sustantivas-b1": {
  source: "merged",
  hook: {
    line: "Your sister is moving back to Bogotá after two years away. Some of what you feel is about you, and some is about what she does, and Spanish builds those two differently.",
    es: "Me encanta estar contigo.\nY me encanta que vuelvas a Bogotá.",
    en: "I love being with you.\nAnd I love that you're coming back to Bogotá."
  },
  examples: [
    { es: "Me preocupa que no tengas trabajo todavía.", en: "It worries me that you don't have a job yet." },
    { es: "Me da miedo hablar en público.", en: "I'm scared of speaking in public." },
    { es: "Es probable que llueva esta tarde.", en: "It's likely to rain this afternoon." }
  ],
  rule: "After any wanting, feeling or judging, ask one question: who does the second thing?\nThe same person, or nobody in particular: the dictionary form. *Me encanta ir al cine.* *Leer ayuda mucho.*\nSomeone else: *que* and the subjunctive. *Me encanta que me llames.* *Me preocupa que no duermas.*\nIt is the rule you know from *quiero que*, and it reaches every feeling: *me gusta que*, *me molesta que*, *me da miedo que*. Feelings work like *gustar*: *me*, *te*, *le* say who feels it.\nJudgements split the same way: *es posible que llueva*. But a claim keeps the ordinary form: *es verdad que llueve*.",
  readAndPick: [
    { q: "Who is coming back?", es: "Me encanta que vuelvas.",
      options: ["The speaker is", "You are", "Her parents are"], answer: 1,
      why: "*Que vuelvas*: the coming back is yours. For her own return she would say *me encanta volver*." },
    { q: "Who is scared, and of what?", es: "Me da miedo manejar de noche.",
      options: ["I'm scared of driving at night", "I'm scared you drive at night", "You're scared of driving at night"], answer: 0,
      why: "No *que*, just *manejar*: the one who is scared is the one who would drive." },
    { q: "Is the speaker saying it will rain?", es: "Es posible que llueva esta tarde.",
      options: ["Yes, she's quite certain", "Yes, but not this afternoon", "No, only that it might"], answer: 2,
      why: "Cover *es posible que*: *llueva esta tarde* is held up, not claimed." },
    { q: "Why does *llueve* stay ordinary here?", es: "Es verdad que llueve mucho en Bogotá.",
      options: ["It's a wish", "It's a claim of fact", "It's about the past"], answer: 1,
      why: "*Es verdad que* says it is so, so the ordinary form stays." },
    { q: "What bothers him?", es: "Le molesta que los vecinos pongan la música tan alta.",
      options: ["Playing loud music himself", "Hearing no music in the building", "The neighbours' loud music"], answer: 2,
      why: "*Que los vecinos pongan*: someone else's action, so *que* and the subjunctive." }
  ],
  yourTurn: [
    { en: "I love that you call me every Sunday. (to a friend)", es: "Me encanta que me llames todos los domingos.", accept: ["Me encanta que me llames cada domingo."] },
    { en: "It worries me that you don't sleep. (to a friend)", es: "Me preocupa que no duermas.", accept: [] },
    { en: "I'm scared of speaking in public.", es: "Me da miedo hablar en público.", accept: [] },
    { en: "It's possible that they'll close early.", es: "Es posible que cierren temprano.", accept: ["Puede que cierren temprano."] },
    { en: "It's true that it rains a lot here.", es: "Es verdad que aquí llueve mucho.", accept: ["Es [verdad|cierto] que llueve mucho [aquí|acá].", "Es cierto que aquí llueve mucho."] }
  ],
  translate: [
    { en: "Reading helps you learn words.", es: "Leer ayuda a aprender palabras.", accept: ["Leer te ayuda a aprender palabras."] },
    { en: "I like cooking for my family.", es: "Me gusta cocinar para mi familia.", accept: [] },
    { en: "I like it when my family cooks for me.", es: "Me gusta que mi familia cocine para mí.", accept: ["Me gusta que mi familia me cocine."] },
    { en: "It bothers him that the neighbours play such loud music.", es: "Le molesta que los vecinos pongan la música tan alta.", accept: ["Le molesta que los vecinos pongan (la) música tan [alta|duro|fuerte]."] },
    { en: "It's better to rest today.", es: "Es mejor descansar hoy.", accept: ["Hoy es mejor descansar."] },
    { en: "It's better for you to rest today. (to a friend)", es: "Es mejor que descanses hoy.", accept: ["Es mejor que hoy descanses."] }
  ],
  register: [
    { es: "¡Me encanta que vengas!", en: "I love that you're coming!", when: "warm, with family and friends" },
    { es: "Me alegra que vengas.", en: "I'm glad you're coming.", when: "anywhere, a little calmer" },
    { es: "¡Qué bueno que vengas!", en: "How great that you're coming!", when: "the everyday reaction in Colombia" },
    { es: "Me hace muy feliz que estés aquí.", en: "It makes me very happy that you're here.", when: "when you want to say it openly" },
    { es: "Nos complace que nos acompañe.", en: "We're pleased that you're joining us.", when: "formal, to someone you call usted" }
  ],
  personal: {
    prompt: "Write two sentences about someone close to you: one about something you love doing yourself, and one about something they do that you love or that worries you.",
    constraints: [
      { type: "regex", pattern: "\\b(encanta|gusta|preocupa|molesta|da miedo) [a-záéíóúñ]+(ar|er|ir)(me|te|se|lo|la|le)?\\b", label: "your own action: *me encanta* and the dictionary form" },
      { type: "regex", pattern: "\\b(encanta|gusta|preocupa|molesta|da miedo) que\\b", label: "their action: *me encanta que* or *me preocupa que*" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive after *que*" }
    ],
    model: "Me encanta cocinar con mi hermana. Me preocupa que trabaje tanto."
  },
  pitfalls: [
    "*Me encanta que me llamas* is the slip: after a feeling about someone else, the subjunctive, *llames*.",
    "*Me da miedo que hable en público* means someone else will speak. For your own fear: *me da miedo hablar*.",
    "*Es verdad que* and *es seguro que* claim it, so the ordinary form stays: *es verdad que llueve*."
  ]
},

"fn-expresar-deseos-b1": {
  source: "merged",
  hook: {
    line: "Your best friend from Cali is flying to Madrid for a year. At the airport everything you say is a wish: some for her, some for you, and some about things nobody controls.",
    es: "Ojalá que te vaya muy bien.\nQue tengas un buen viaje.\nY yo sueño con visitarte.",
    en: "I really hope it goes very well for you.\nHave a good trip.\nAnd I dream of visiting you."
  },
  examples: [
    { es: "Ojalá no llueva el sábado.", en: "I hope it doesn't rain on Saturday." },
    { es: "Me encantaría vivir un tiempo en otro país.", en: "I'd love to live in another country for a while." },
    { es: "Que te mejores pronto.", en: "Get well soon." }
  ],
  rule: "Wishes come in sizes.\nFor what you want someone to do: *Quiero que vengas.*\nSofter, for yourself: *Me encantaría* or *me gustaría* and the dictionary form: *Me encantaría conocer Cartagena.*\nA big dream: *Sueño con* and the dictionary form, always with *con*: *Sueño con tener una finca.*\nFor what nobody controls: *Ojalá*, with or without *que*, and always the subjunctive: *Ojalá no llueva.* It needs no other verb.\nFixed wishes keep only the *que*: *Que te vaya bien.* *Que descanses.* *Que te mejores.* *Que tengas buen viaje.*\nTo someone you call *usted*: *Que le vaya bien.* *Que se mejore.*",
  readAndPick: [
    { q: "What is she hoping for?", es: "Ojalá no llueva mañana.",
      options: ["Rain tomorrow", "No rain tomorrow", "Rain today"], answer: 1,
      why: "*Ojalá* and *no llueva*: a wish against the rain, which nobody controls." },
    { q: "When would you say this?", es: "Que te mejores pronto.",
      options: ["To someone who is ill", "To someone going on a trip", "To someone going to bed"], answer: 0,
      why: "*Que te mejores*: get well soon. A fixed wish with only the *que* left." },
    { q: "How big is this wish?", es: "Sueño con vivir junto al mar.",
      options: ["A small favour", "A plan for Monday", "A big dream"], answer: 2,
      why: "*Sueño con* is for the big things you dream of, not for Monday." },
    { q: "Who would do the coming?", es: "Quiero que vengas a mi cumpleaños.",
      options: ["I would", "You would", "Everyone but you"], answer: 1,
      why: "*Que vengas*: the coming is yours, so *que* and the subjunctive." },
    { q: "How does this sound next to *quiero ir*?", es: "Me encantaría ir con ustedes.",
      options: ["Softer, more like a wish", "Ruder, like an order", "The same, only longer"], answer: 0,
      why: "The *-ría* form turns a want into a wish, so it lands softer." }
  ],
  yourTurn: [
    { en: "I hope it doesn't rain on Saturday.", es: "Ojalá no llueva el sábado.", accept: ["Ojalá (que) no llueva el sábado."] },
    { en: "Have a good trip. (to a friend)", es: "Que tengas un buen viaje.", accept: ["Que tengas (un) buen viaje."] },
    { en: "I'd love to get to know Cartagena.", es: "Me encantaría conocer Cartagena.", accept: [] },
    { en: "I dream of having a farm.", es: "Sueño con tener una finca.", accept: [] },
    { en: "I want you to come to my party. (to a friend)", es: "Quiero que vengas a mi fiesta.", accept: [] }
  ],
  translate: [
    { en: "Get well soon. (polite)", es: "Que se mejore pronto.", accept: [] },
    { en: "I hope we see each other soon.", es: "Ojalá nos veamos pronto.", accept: ["Ojalá (que) nos veamos pronto."] },
    { en: "My dream is to open a café.", es: "Mi sueño es abrir un café.", accept: [] },
    { en: "Rest well, tomorrow is a long day. (to a friend)", es: "Que descanses, mañana es un día largo.", accept: [] },
    { en: "Hope it goes well for you. (polite)", es: "Que le vaya bien.", accept: ["Que le vaya (muy) bien."] },
    { en: "We'd love to live by the sea.", es: "Nos encantaría vivir junto al mar.", accept: ["Nos encantaría vivir [junto al|cerca del|al lado del] mar."] }
  ],
  register: [
    { es: "¡Que te vaya bien!", en: "Hope it goes well!", when: "as a friend leaves, quick and warm" },
    { es: "Ojalá te vaya muy bien.", en: "I really hope it goes very well for you.", when: "when you care and can't control it" },
    { es: "Te deseo lo mejor.", en: "I wish you the best.", when: "a little more serious, in a goodbye or a card" },
    { es: "Que le vaya muy bien.", en: "Hope it goes very well for you.", when: "to someone you call usted" },
    { es: "Le deseamos muchos éxitos.", en: "We wish you every success.", when: "in writing, from a team or a company" }
  ],
  personal: {
    prompt: "Write to someone who has something big coming up: one wish with *Ojalá*, one fixed wish with *Que*, and one dream of your own with *Sueño con*.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "ojalá", label: "a wish with *ojalá* and the subjunctive" },
      { type: "containsAny", words: ["que te vaya", "que le vaya", "que descanses", "que te mejores", "que se mejore", "que tengas", "que te diviertas"], label: "a fixed wish, like *Que te vaya bien*" },
      { type: "containsWord", word: "sueño con", label: "a dream of your own with *sueño con*" }
    ],
    model: "Ojalá te vaya muy bien en Madrid. Que tengas un buen viaje. Yo sueño con visitarte allá."
  },
  pitfalls: [
    "*Ojalá va a llover* is the slip: *ojalá* always takes the subjunctive, *ojalá llueva*.",
    "*Sueño de viajar* borrows the English of: Spanish dreams *con*, *sueño con viajar*.",
    "*Te mejores* alone is not a wish: keep the *que*, *Que te mejores*."
  ]
},

"fn-espero-esperanza-b1": {
  source: "merged",
  hook: {
    line: "Your brother has his last exam at the university tomorrow, and you're both nervous. Some hopes are about what you'll do, some are about him, and the shape changes with who acts.",
    es: "Espero llegar a tiempo para verte.\nY espero que te vaya muy bien.",
    en: "I hope I get there in time to see you.\nAnd I hope it goes really well for you."
  },
  examples: [
    { es: "Espero terminar el proyecto esta semana.", en: "I hope to finish the project this week." },
    { es: "Espero que estés bien.", en: "I hope you're well." },
    { es: "¿Va a salir bien?\nEspero que sí.", en: "Is it going to work out?\nI hope so." }
  ],
  rule: "*Espero* splits on one question: who does the hoped-for thing?\nYou do: the dictionary form. *Espero llegar a tiempo.*\nSomeone else does: *que* and the subjunctive. *Espero que llegues a tiempo.*\nFor a short answer, no verb at all: *Espero que sí.* *Espero que no.*\nTurn it up with *ojalá*: more feeling, the same subjunctive. *Ojalá que todo salga bien.*\nFirmer, and a little more formal: *confío en que* and the subjunctive. Keep the *en*: *Confío en que todo salga bien.*\nAdd luck with *Con un poco de suerte*, then a plain sentence: *Con un poco de suerte, llegamos a tiempo.*",
  readAndPick: [
    { q: "Who is hoping to arrive?", es: "Espero llegar antes de las ocho.",
      options: ["Someone else", "The speaker", "The whole family"], answer: 1,
      why: "No *que*, just *llegar*: the one hoping is the one arriving." },
    { q: "Who needs to get better?", es: "Espero que te mejores pronto.",
      options: ["You do", "I do", "We both do"], answer: 0,
      why: "*Que te mejores*: someone else's recovery, so *que* and the subjunctive." },
    { q: "What does she answer?", es: "¿Va a llover? Espero que no.",
      options: ["She hopes it will rain", "She's sure it won't rain", "She hopes it won't rain"], answer: 2,
      why: "*Espero que no*: I hope not. No verb is needed after it." },
    { q: "How does he feel about the doctor?", es: "Confío en que el médico tenga razón.",
      options: ["He trusts it's so", "He knows it is so", "He doubts it is so"], answer: 0,
      why: "*Confío en que* is a firm hope, so the verb is still the subjunctive, *tenga*." },
    { q: "How does *ojalá* compare with *espero que*?", es: "Ojalá que todo salga bien.",
      options: ["Colder and more formal", "Stronger, more heartfelt", "The same, but past"], answer: 1,
      why: "*Ojalá* carries more feeling than *espero que*, with the same subjunctive." }
  ],
  yourTurn: [
    { en: "I hope to finish this week.", es: "Espero terminar esta semana.", accept: [] },
    { en: "I hope you get there on time. (to a friend)", es: "Espero que llegues a tiempo.", accept: [] },
    { en: "I hope so.", es: "Espero que sí.", accept: [] },
    { en: "I'm confident everything will turn out fine.", es: "Confío en que todo salga bien.", accept: ["Confío en que todo [salga|va a salir|saldrá] bien."] },
    { en: "With a bit of luck, we'll arrive on time.", es: "Con un poco de suerte, llegamos a tiempo.", accept: ["Con un poco de suerte, [llegamos|vamos a llegar|llegaremos] a tiempo."] }
  ],
  translate: [
    { en: "I hope you're well. (to a friend)", es: "Espero que estés bien.", accept: [] },
    { en: "I hope not.", es: "Espero que no.", accept: [] },
    { en: "I really hope everything goes well.", es: "Ojalá que todo salga bien.", accept: ["Ojalá (que) todo salga bien."] },
    { en: "We're confident the situation will improve soon.", es: "Confiamos en que la situación mejore pronto.", accept: [] },
    { en: "I hope to see you on Saturday. (to a friend)", es: "Espero verte el sábado.", accept: [] },
    { en: "I hope you can come on Saturday. (to a friend)", es: "Espero que puedas venir el sábado.", accept: [] }
  ],
  register: [
    { es: "Espero que sí.", en: "I hope so.", when: "a quick answer, with anyone" },
    { es: "¡Ojalá!", en: "I really hope so!", when: "on its own, when you care a lot" },
    { es: "Con un poco de suerte, sí.", en: "With a bit of luck, yes.", when: "hopeful, but not counting on it" },
    { es: "Confío en que todo salga bien.", en: "I'm confident it will all go well.", when: "firmer, at work or to reassure someone" },
    { es: "Esperamos que disfrute su estadía.", en: "We hope you enjoy your stay.", when: "formal, from a hotel or a business" }
  ],
  personal: {
    prompt: "Something uncertain is coming up for you and for someone you know. Write one hope about yourself and one about them.",
    constraints: [
      { type: "regex", pattern: "\\bespero [a-záéíóúñ]+(ar|er|ir)(me|te|se|lo|la|le|nos)?\\b", label: "a hope for yourself: *espero* and the dictionary form" },
      { type: "subjunctiveAfter", trigger: "espero que", label: "a hope for them: *espero que* and the subjunctive" }
    ],
    model: "Espero terminar el curso en diciembre. Espero que mi hermano consiga el trabajo."
  },
  pitfalls: [
    "*Espero que llego a tiempo* is the slip: for your own arrival, *espero llegar*.",
    "*Espero que llegas* keeps the ordinary form: someone else's action takes *llegues*.",
    "*Confío que* drops a word: *confío en que*."
  ]
},

"fn-preguntar-deseos-b1": {
  source: "merged",
  hook: {
    line: "It's Friday night, and your flatmate in Medellín looks bored. Before you suggest anything, you ask what she feels like doing, and whether she wants you to do something for her.",
    es: "¿Qué tienes ganas de hacer esta noche?\n¿Quieres que pida una pizza?",
    en: "What do you feel like doing tonight?\nDo you want me to order a pizza?"
  },
  examples: [
    { es: "¿Te provoca un tinto?", en: "Do you feel like a coffee?" },
    { es: "¿Qué te gustaría hacer el domingo?", en: "What would you like to do on Sunday?" },
    { es: "¿Tienes ganas de que vuelva Andrés?", en: "Are you looking forward to Andrés coming back?" }
  ],
  rule: "To ask what someone feels like, Colombians say:\n*¿Tienes ganas de* plus a thing or the dictionary form: *¿Tienes ganas de salir?*\n*¿Te provoca* plus the same: *¿Te provoca un tinto?* It works like *gustar*: the thing is the subject.\n*¿Qué te gustaría hacer?* is softer and more open.\nTo offer to do it yourself: *¿Quieres que* and the subjunctive. *¿Quieres que te ayude?* means I would do the helping.\nWhen the wanted thing is someone else's action, the same switch: *¿Tienes ganas de que vuelva Andrés?*\nFor the big question: *¿Cuál es tu sueño?*",
  readAndPick: [
    { q: "Who would do the ordering?", es: "¿Quieres que pida una pizza?",
      options: ["The speaker would", "You would", "The pizza place"], answer: 0,
      why: "*Pida* is the I form after *quieres que*: she is offering to order." },
    { q: "What is being offered?", es: "¿Te provoca algo de tomar?",
      options: ["Something to eat", "A ride home later on", "Something to drink"], answer: 2,
      why: "*Algo de tomar* is something to drink, and *¿te provoca?* asks if you feel like it." },
    { q: "Who is coming back?", es: "¿Tienes ganas de que vuelva Andrés?",
      options: ["You are", "Andrés is", "We both are"], answer: 1,
      why: "*Que vuelva Andrés*: the coming back is his, so *que* and the subjunctive." },
    { q: "How open is this question?", es: "¿Qué te gustaría hacer el fin de semana?",
      options: ["Very open: anything goes", "Closed: yes or no", "Rude: far too direct"], answer: 0,
      why: "*¿Qué te gustaría?* leaves the whole choice to them." },
    { q: "What does she want to know?", es: "¿Cuál es tu sueño?",
      options: ["What you dreamt last night", "What you most want in life", "When you usually go to sleep"], answer: 1,
      why: "*Tu sueño* here is your dream in life, the big wish." }
  ],
  yourTurn: [
    { en: "Do you feel like going out tonight? (to a friend)", es: "¿Tienes ganas de salir esta noche?", accept: ["¿[Tienes ganas de|Te provoca] salir esta noche?"] },
    { en: "Do you want me to help you? (to a friend)", es: "¿Quieres que te ayude?", accept: [] },
    { en: "What would you like to do on Sunday? (to a friend)", es: "¿Qué te gustaría hacer el domingo?", accept: [] },
    { en: "Do you feel like a coffee? (to a friend)", es: "¿Te provoca un tinto?", accept: ["¿Te provoca un [tinto|café]?", "¿Tienes ganas de un [tinto|café]?"] }
  ],
  translate: [
    { en: "Would you like a coffee? (polite)", es: "¿Le provoca un tinto?", accept: ["¿Le provoca un [tinto|café]?"] },
    { en: "Do you want me to introduce you to my friends? (to a friend)", es: "¿Quieres que te presente a mis amigos?", accept: [] },
    { en: "Are you looking forward to your sister coming? (to a friend)", es: "¿Tienes ganas de que venga tu hermana?", accept: [] },
    { en: "What's your dream? (to a friend)", es: "¿Cuál es tu sueño?", accept: [] },
    { en: "Which movie do you feel like watching? (to a friend)", es: "¿Qué película tienes ganas de ver?", accept: ["¿Qué película te provoca ver?"] },
    { en: "Where would you like to study Spanish? (to a friend)", es: "¿Dónde te gustaría estudiar español?", accept: [] }
  ],
  register: [
    { es: "¿Te provoca algo?", en: "Do you feel like anything?", when: "in Colombia, a warm everyday offer" },
    { es: "¿Tienes ganas de salir?", en: "Do you feel like going out?", when: "with friends, anywhere in Latin America" },
    { es: "¿Qué te gustaría hacer?", en: "What would you like to do?", when: "softer, leaving the choice to them" },
    { es: "¿Le provoca algo de tomar?", en: "Would you like something to drink?", when: "to a guest you call usted" },
    { es: "¿Qué desea tomar?", en: "What would you like to drink?", when: "a waiter to a customer" }
  ],
  personal: {
    prompt: "Write two questions for a friend about this weekend: one about what they feel like doing, and one offering to do something for them.",
    constraints: [
      { type: "question", label: "write questions, with *¿...?*" },
      { type: "containsAny", words: ["tienes ganas de", "te provoca", "te gustaría"], label: "what they feel like: *¿tienes ganas de...?* or *¿te provoca...?*" },
      { type: "subjunctiveAfter", trigger: "quieres que", label: "an offer: *¿quieres que...?* and the subjunctive" }
    ],
    model: "¿Tienes ganas de ir a cine el sábado? ¿Quieres que compre las boletas?"
  },
  pitfalls: [
    "*Yo provoco un tinto* turns it around: like *gustar*, the thing is the subject, *me provoca un tinto*.",
    "*¿Quieres que te ayudo?* keeps the ordinary form: after *quieres que*, *te ayude*.",
    "In Spain you will hear *¿te apetece?* for this; in Colombia it's *¿te provoca?* or *¿tienes ganas de?*"
  ]
},

"fn-posibilidad-b1": {
  source: "merged",
  hook: {
    line: "A friend asks whether there will still be a bus back to Bogotá when the concert ends. You honestly don't know, and Spanish lets you say exactly how likely it is.",
    es: "Puede que haya un bus a las once.\nPero es imposible que lleguemos antes.",
    en: "There might be a bus at eleven.\nBut it's impossible for us to get there sooner."
  },
  examples: [
    { es: "A lo mejor no funciona el teléfono.", en: "Maybe the phone isn't working." },
    { es: "Seguro que todavía está en la casa de su mamá.", en: "I bet he's still at his mom's." },
    { es: "¿Qué hora es?\nNo sé, serán las cinco.", en: "What time is it?\nI don't know, it must be about five." }
  ],
  rule: "Say how possible something is, from top to bottom:\n*Seguro que* is I bet, with the ordinary form: *Seguro que llega tarde.*\n*A lo mejor* and *de pronto* are maybe, with the ordinary form: *A lo mejor llueve.*\n*Puede que*, *es posible que* and *es probable que* take the subjunctive: *Puede que llueva.*\nSo do *no estoy seguro de que* and *es imposible que*: *Es imposible que lleguemos.*\nThe test you know: cover the opening. If nobody claims what is left, it is the subjunctive.\nA guess about now needs no word at all: *Serán las cinco.* *Estará en la ducha.*\nOn their own, as answers: *Puede ser.* *Lo dudo.* *Imposible.*",
  readAndPick: [
    { q: "Does the speaker think it will rain?", es: "Puede que llueva más tarde.",
      options: ["She's sure it will", "She thinks it might", "She's quite sure it won't"], answer: 1,
      why: "*Puede que* holds the rain up as a maybe, so *llueva*." },
    { q: "Why does *funciona* keep the ordinary form?", es: "A lo mejor no funciona el teléfono.",
      options: ["*A lo mejor* takes it", "It's about the past", "It's a command"], answer: 0,
      why: "*A lo mejor* means maybe, but it keeps the ordinary form. It is one to learn." },
    { q: "What is he saying about Javier?", es: "¿Y Javier? Estará en la ducha.",
      options: ["He knows it for sure", "He'll shower later", "It's his best guess"], answer: 2,
      why: "*Estará* guesses about right now, with no maybe word at all." },
    { q: "How likely is it?", es: "Es imposible que terminemos hoy.",
      options: ["Not at all likely", "Fairly likely", "It's already been done"], answer: 0,
      why: "*Es imposible que*: no chance, and the subjunctive, *terminemos*." },
    { q: "Which answer leaves the most doubt?", es: "¿Vienes mañana? Puede ser.",
      options: ["Yes, for certain", "No, not a chance", "Maybe, maybe not"], answer: 2,
      why: "*Puede ser* on its own is could be: neither yes nor no." }
  ],
  yourTurn: [
    { en: "It might rain later.", es: "Puede que llueva más tarde.", accept: ["[Puede que|Es posible que] llueva más tarde."] },
    { en: "Maybe the phone isn't working.", es: "A lo mejor no funciona el teléfono.", accept: ["[A lo mejor|De pronto] el teléfono no funciona.", "De pronto no funciona el teléfono."] },
    { en: "It's impossible for us to finish today.", es: "Es imposible que terminemos hoy.", accept: ["Es imposible que hoy terminemos."] },
    { en: "It must be about five.", es: "Serán las cinco.", accept: ["Serán como las cinco."] }
  ],
  translate: [
    { en: "I bet he's still at home.", es: "Seguro que todavía está en la casa.", accept: ["Seguro que [todavía|aún] está en (la) casa.", "Seguro que sigue en (la) casa."] },
    { en: "It's likely that he won't come.", es: "Es probable que no venga.", accept: [] },
    { en: "I'm not sure that it's possible.", es: "No estoy seguro de que sea posible.", accept: ["No estoy [seguro|segura] de que sea posible."] },
    { en: "She's probably still at work.", es: "Estará todavía en el trabajo.", accept: ["[Estará|Seguramente está] todavía en el trabajo.", "Todavía estará en el trabajo."] },
    { en: "Maybe we'll have to change the plan.", es: "A lo mejor tenemos que cambiar el plan.", accept: ["[A lo mejor|De pronto] tenemos que cambiar el plan."] },
    { en: "I doubt it.", es: "Lo dudo.", accept: [] }
  ],
  register: [
    { es: "Seguro que sí.", en: "I'm sure it will.", when: "confident, among friends" },
    { es: "De pronto.", en: "Maybe.", when: "the everyday maybe in Colombia" },
    { es: "Puede ser.", en: "Could be.", when: "neutral, when you really don't know" },
    { es: "Lo dudo.", en: "I doubt it.", when: "polite, but clearly sceptical" },
    { es: "Es poco probable.", en: "It's unlikely.", when: "careful, at work or in writing" }
  ],
  personal: {
    prompt: "Something is uncertain this week: the weather, a delivery, a friend's plans. Write one line with *puede que* or *es posible que*, and one with *a lo mejor*.",
    constraints: [
      { type: "containsAny", words: ["puede que", "es posible que", "es probable que"], label: "*puede que* or *es posible que*" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive after it" },
      { type: "containsAny", words: ["a lo mejor", "de pronto"], label: "*a lo mejor* or *de pronto*, with the ordinary form" }
    ],
    model: "Puede que llueva el sábado. A lo mejor vamos a cine en vez de ir al parque."
  },
  pitfalls: [
    "*A lo mejor llueva* is the slip: *a lo mejor* keeps the ordinary form, *a lo mejor llueve*.",
    "*Puede que llueve* is the opposite slip: *puede que* takes the subjunctive, *llueva*.",
    "*Seguro que* is a casual I bet; *estoy seguro de que* is firm. Both keep the ordinary form."
  ]
},

"nt-necesidad-obligacion-b1": {
  source: "merged",
  hook: {
    line: "You're renewing a document at an office in Bogotá, and the woman at the window speaks in the language of rules. Half of it is what you must do, and half is what depends on something else.",
    es: "Es obligatorio traer la cédula.\nEl tiempo de espera depende del día.",
    en: "Bringing your ID card is compulsory.\nThe waiting time depends on the day."
  },
  examples: [
    { es: "¿Vienes el sábado?\nDepende del clima.", en: "Are you coming on Saturday?\nIt depends on the weather." },
    { es: "No es obligatorio, pero se recomienda.", en: "It isn't compulsory, but it's recommended." },
    { es: "Por suerte, no llovió el día del matrimonio.", en: "Luckily, it didn't rain on the day of the wedding." }
  ],
  rule: "*Depender* always takes *de*: *Depende del clima.* Before a whether, *depende de si*: *Depende de si me dan la visa.* *Depende* alone is a full answer.\n*Es obligatorio* and the dictionary form is a rule, often official: *Es obligatorio llevar casco.* No *de*, no *que*.\n*No es obligatorio* only means you don't have to. For a ban: *está prohibido*.\n*Es necesario* is softer, good advice more than law: *Es necesario reservar.*\n*Es inevitable* means it can't be avoided: *Es inevitable que haya trancón.*\nAnd when it all works out: *Por suerte, no hizo falta.*",
  readAndPick: [
    { q: "What decides whether she comes?", es: "Depende de si me dan permiso en el trabajo.",
      options: ["The weather", "Getting time off", "Her family"], answer: 1,
      why: "*Depende de si*: it hinges on whether work gives her permission." },
    { q: "Does she have to bring a photo?", es: "La foto no es obligatoria, pero ayuda.",
      options: ["No, but it helps", "Yes, it's required", "No, it's banned"], answer: 0,
      why: "*No es obligatoria* only means she doesn't have to. It isn't a ban." },
    { q: "Where would you expect to read this?", es: "Es obligatorio usar el cinturón de seguridad.",
      options: ["In a text from a friend", "On an official notice", "On a birthday card"], answer: 1,
      why: "*Es obligatorio* has the sound of a rule or a law." },
    { q: "What is she saying?", es: "Por suerte, encontramos dónde parquear.",
      options: ["They had bad luck", "They had to walk", "They were lucky"], answer: 2,
      why: "*Por suerte* is luckily: they found somewhere to park." },
    { q: "How strong is *es necesario* here?", es: "Es necesario reservar con anticipación.",
      options: ["A ban", "A rule set by law", "Strong advice"], answer: 2,
      why: "*Es necesario* is softer than *es obligatorio*: sound advice, not law." }
  ],
  yourTurn: [
    { en: "It depends on the weather.", es: "Depende del clima.", accept: ["Depende del [clima|tiempo]."] },
    { en: "It all depends on whether I get the visa in time.", es: "Todo depende de si me dan la visa a tiempo.", accept: ["Todo depende de si [me dan|consigo|recibo] la visa a tiempo."] },
    { en: "Wearing a helmet is compulsory.", es: "Es obligatorio llevar casco.", accept: ["Es obligatorio [llevar|usar] (el) casco."] },
    { en: "Luckily, it didn't rain.", es: "Por suerte, no llovió.", accept: [] }
  ],
  translate: [
    { en: "In this country, voting isn't compulsory.", es: "En este país, votar no es obligatorio.", accept: ["En este país no es obligatorio votar."] },
    { en: "It's necessary to book in advance.", es: "Es necesario reservar con anticipación.", accept: ["Es necesario reservar con [anticipación|tiempo|antelación]."] },
    { en: "The price depends on the size.", es: "El precio depende del tamaño.", accept: [] },
    { en: "It's inevitable that there'll be traffic on Friday.", es: "Es inevitable que haya trancón el viernes.", accept: ["Es inevitable que haya [trancón|tráfico] el viernes."] },
    { en: "It isn't compulsory, but it's recommended.", es: "No es obligatorio, pero se recomienda.", accept: ["No es obligatorio, pero es recomendable."] },
    { en: "Luckily, we found somewhere to park right away.", es: "Por suerte, encontramos dónde parquear enseguida.", accept: ["Por suerte, encontramos dónde parquear [enseguida|rápido|de una]."] }
  ],
  register: [
    { es: "Depende.", en: "It depends.", when: "a full answer, when you won't commit" },
    { es: "Hay que traer la cédula.", en: "You have to bring your ID.", when: "everyday, a rule for everyone" },
    { es: "Tienes que traer la cédula.", en: "You've got to bring your ID.", when: "to one friend, direct and personal" },
    { es: "Es necesario traer la cédula.", en: "It's necessary to bring your ID.", when: "a careful explanation or a notice" },
    { es: "Es obligatorio presentar la cédula.", en: "Showing your ID is compulsory.", when: "the official rule, on forms and signs" }
  ],
  personal: {
    prompt: "Think of a plan you have that isn't fixed yet. Say what it depends on, and one rule you have to follow for it.",
    constraints: [
      { type: "containsWord", word: "depende de", label: "what it depends on: *depende de*" },
      { type: "containsAny", words: ["es obligatorio", "es necesario", "hay que"], label: "a rule: *es obligatorio*, *es necesario* or *hay que*" }
    ],
    model: "El viaje a Cartagena depende de si me dan vacaciones. Es obligatorio llevar la cédula en el avión."
  },
  pitfalls: [
    "*Depende el clima* drops the *de*: *depende del clima*, and *depende de si* before a whether.",
    "*No es obligatorio* only means you don't have to. A ban is *está prohibido*.",
    "*Es obligatorio de llevar* adds a word: go straight to the dictionary form, *es obligatorio llevar*."
  ]
},

"task-b1-deseos": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a message to a friend asking for real help, and saying what you hope for. Every request is about what someone else does, and that changes the verb.",
    es: "Te escribo porque necesito que me eches una mano con el trasteo del sábado.",
    en: "I'm writing because I need you to give me a hand with the move on Saturday."
  },
  examples: [
    { es: "Quiero que veas el apartamento antes de subir los muebles.", en: "I want you to see the apartment before we carry the furniture up." },
    { es: "Ojalá no llueva, porque si llueve va a ser un desastre.", en: "I hope it doesn't rain, because if it rains it'll be a disaster." }
  ],
  rule: "A message that asks well makes five moves.\nSay why you're writing: *Te escribo porque...*\nAsk for what they do, with *que* and the subjunctive: *Necesito que me eches una mano.* *Quiero que veas el apartamento.*\nKeep your own part plain: *Quiero terminar antes del almuerzo.*\nHope out loud: *Espero que no llueva.* *Ojalá podamos terminar temprano.*\nMake it easy to say no: *Si no puedes, no pasa nada.*\nEnd warm: *Mil gracias, te debo una.*",
  readAndPick: [
    { q: "Who will give the hand?", es: "Necesito que me eches una mano.",
      options: ["The writer will", "The friend will", "Nobody has said yet"], answer: 1,
      why: "*Que me eches*: the friend does it, so *que* and the subjunctive." },
    { q: "Why does *terminar* stay in the dictionary form?", es: "Quiero terminar antes del almuerzo.",
      options: ["It's a wish for the friend", "The writer will finish", "It's in the past"], answer: 1,
      why: "The one who wants is the one who finishes, so no *que*." },
    { q: "What does this line do?", es: "Si no puedes, no pasa nada.",
      options: ["It makes saying no easy", "It sets a deadline", "It asks a second favour"], answer: 0,
      why: "*No pasa nada* tells the friend a no is fine, which makes a yes easier." },
    { q: "What does she hope?", es: "Ojalá no llueva el sábado.",
      options: ["That the move is off", "That it rains", "That it stays dry"], answer: 2,
      why: "*Ojalá no llueva*: a wish against the rain." },
    { q: "What does *te debo una* mean?", es: "Mil gracias, te debo una.",
      options: ["I owe you one", "You owe me one", "I need one more"], answer: 0,
      why: "*Te debo una*: I owe you one, a warm way to close." }
  ],
  yourTurn: [
    { en: "I need you to give me a hand on Saturday. (to a friend)", es: "Necesito que me eches una mano el sábado.", accept: ["Necesito que me [eches una mano|ayudes] el sábado."] },
    { en: "I want you to see the apartment. (to a friend)", es: "Quiero que veas el apartamento.", accept: [] },
    { en: "I hope it doesn't rain.", es: "Espero que no llueva.", accept: ["[Espero que|Ojalá (que)] no llueva."] },
    { en: "If you can't, it's no big deal. (to a friend)", es: "Si no puedes, no pasa nada.", accept: [] }
  ],
  translate: [
    { en: "I'm writing because I need you to help me with the move. (to a friend)", es: "Te escribo porque necesito que me ayudes con el trasteo.", accept: ["Te escribo porque necesito que me ayudes con [el trasteo|la mudanza]."] },
    { en: "I want to finish before lunch.", es: "Quiero terminar antes del almuerzo.", accept: [] },
    { en: "I hope we can finish early.", es: "Ojalá podamos terminar temprano.", accept: ["[Ojalá (que)|Espero que] podamos terminar temprano."] },
    { en: "Thanks a million, I owe you one. (to a friend)", es: "Mil gracias, te debo una.", accept: [] },
    { en: "Can you bring your brother's van? (to a friend)", es: "¿Puedes traer la camioneta de tu hermano?", accept: ["¿[Puedes|Podrías] traer la camioneta de tu hermano?"] }
  ],
  register: [
    { es: "¿Me echas una mano?", en: "Will you give me a hand?", when: "with a close friend, by message" },
    { es: "Necesito que me ayudes.", en: "I need you to help me.", when: "direct, when it really matters" },
    { es: "¿Podrías ayudarme el sábado?", en: "Could you help me on Saturday?", when: "softer, for a bigger favour" },
    { es: "Quería pedirle un favor.", en: "I wanted to ask you a favour.", when: "to someone you call usted" }
  ],
  personal: {
    prompt: "Write the message: ask a friend for real help with something, say what you hope for, and make it easy for them to say no.",
    constraints: [
      { type: "minSentences", n: 5, label: "five sentences or more" },
      { type: "containsAny", words: ["necesito que", "quiero que"], label: "a request: *necesito que* or *quiero que*" },
      { type: "containsAny", words: ["espero que", "ojalá"], label: "a hope with *espero que* or *ojalá*" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive for what they do" }
    ],
    model: "Hola, Juli. Te escribo porque necesito que me eches una mano con el trasteo del sábado. Quiero terminar antes del almuerzo. Ojalá no llueva. Si no puedes, no pasa nada. Mil gracias, te debo una."
  },
  pitfalls: [
    "*Necesito que me echas una mano* keeps the ordinary form: their action takes *eches*.",
    "*Quiero que yo termine* puts *que* on your own action: *quiero terminar*."
  ]
},

/* ---- unit b1-u32 · Asking, refusing, forbidding -------------------------- */

"fn-pedir-ayuda-b1": {
  source: "merged",
  hook: {
    line: "You've just moved into an apartment in Bogotá with a sofa you can't lift alone. You'll need help from your flatmate, a neighbour you've never met and the man at the hardware store, and each one gets a different way of asking.",
    es: "¿Me ayudas con el sofá?\nQué pena con usted, ¿me podría ayudar un momento?",
    en: "Will you help me with the sofa?\nSorry to bother you, could you help me for a moment?"
  },
  examples: [
    { es: "¿Te importaría prestarme el taladro?", en: "Would you mind lending me the drill?" },
    { es: "¿Me dejas usar tu computador un momento?", en: "Will you let me use your computer for a moment?" },
    { es: "Tengo que subir este sofá y no puedo solo.", en: "I have to get this sofa upstairs and I can't do it alone." }
  ],
  rule: "Asking comes in levels, from close to careful.\nA command and *por favor*: *Pásame el martillo, por favor.*\nA plain question: *¿Me ayudas?* *¿Me prestas el carro?*\nSofter: *¿Puedes...?*, then *¿Podrías...?*, then *¿Te importaría* and the dictionary form: *¿Te importaría ayudarme?* Careful: to that one, *No, para nada* means happy to.\nFor permission: *¿Puedo...?* or *¿Me dejas...?* To ask about the rule: *¿Se puede parquear aquí?*\nWith a stranger, open with *Qué pena con usted* or *Quería pedirle un favor.* In a shop: *¿Me regala una bolsa?*\nOr just say the problem and let them offer: *Esto pesa mucho y no puedo solo.*",
  readAndPick: [
    { q: "Who is she asking?", es: "¿Se puede parquear aquí?",
      options: ["Nobody in particular", "One person in particular", "The parking attendant"], answer: 0,
      why: "*Se puede* asks about the rule. To ask one person: *¿me dejas parquear aquí?*" },
    { q: "What does he want?", es: "Esto pesa muchísimo y no puedo solo.",
      options: ["Help, without asking", "To be left alone", "Nothing at all"], answer: 0,
      why: "He names the problem and leaves room for you to offer." },
    { q: "Your friend asks this and you're happy to. What do you say?", es: "¿Te importaría cerrar la ventana?",
      options: ["Sí, me importa.", "Me importaría.", "No, para nada."], answer: 2,
      why: "The question is would you mind, so *No, para nada* is the happy yes." },
    { q: "Where would you hear this?", es: "¿Me regala una bolsa, por favor?",
      options: ["A gift between friends", "Asking in a shop", "Selling something"], answer: 1,
      why: "In Colombia, *¿me regala...?* is how you ask for something in a shop. Nothing is free." },
    { q: "How careful is this opening?", es: "Qué pena con usted, ¿me podría ayudar?",
      options: ["Very careful, to a stranger", "Casual, to a sister", "Rude and far too direct"], answer: 0,
      why: "*Qué pena con usted* says sorry to bother you, and *podría* softens the rest." }
  ],
  yourTurn: [
    { en: "Will you help me with the sofa? (to a friend)", es: "¿Me ayudas con el sofá?", accept: [] },
    { en: "Would you mind lending me the drill? (to a friend)", es: "¿Te importaría prestarme el taladro?", accept: ["¿Te importaría prestarme tu taladro?"] },
    { en: "Can I park here?", es: "¿Se puede parquear aquí?", accept: ["¿Se puede parquear acá?", "¿Puedo parquear [aquí|acá]?"] },
    { en: "Will you pass me the salt? (to a friend)", es: "¿Me pasas la sal?", accept: ["¿Me puedes pasar la sal?", "¿Puedes pasarme la sal?"] },
    { en: "Sorry to bother you, could you help me? (polite)", es: "Qué pena con usted, ¿me podría ayudar?", accept: ["Qué pena con usted, ¿podría ayudarme?"] }
  ],
  translate: [
    { en: "Will you let me use your computer for a moment? (to a friend)", es: "¿Me dejas usar tu computador un momento?", accept: ["¿Me dejas usar tu [computador|computadora] un momento?"] },
    { en: "I wanted to ask you a favour. (polite)", es: "Quería pedirle un favor.", accept: [] },
    { en: "Could I have a bag, please?", es: "¿Me regala una bolsa, por favor?", accept: ["¿Me [regala|da] una bolsa, por favor?"] },
    { en: "Do you mind if I open the window? (to a friend)", es: "¿Te molesta si abro la ventana?", accept: ["¿Te [molesta|importa] si abro la ventana?"] },
    { en: "I need you to help me understand this contract. (to a friend)", es: "Necesito que me ayudes a entender este contrato.", accept: [] },
    { en: "Could you do me a favour? (to a friend)", es: "¿Me podrías hacer un favor?", accept: ["¿Podrías hacerme un favor?", "¿Me haces un favor?"] }
  ],
  register: [
    { es: "Pásame el martillo.", en: "Pass me the hammer.", when: "family and close friends, in the middle of a job" },
    { es: "¿Me pasas el martillo?", en: "Will you pass me the hammer?", when: "everyday, with anyone you call tú" },
    { es: "¿Me podrías pasar el martillo?", en: "Could you pass me the hammer?", when: "softer, when they're busy" },
    { es: "¿Le importaría pasarme el martillo?", en: "Would you mind passing me the hammer?", when: "to someone you call usted" },
    { es: "¿Me regala un martillo?", en: "Can I get a hammer?", when: "at a shop counter in Colombia" }
  ],
  personal: {
    prompt: "You need help with something real this week. Ask a friend in one line, and a neighbour you don't know well in another.",
    constraints: [
      { type: "question", label: "ask, with *¿...?*" },
      { type: "containsAny", words: ["me ayudas", "me prestas", "me pasas", "puedes", "podrías", "te importaría"], label: "the friend: *¿me ayudas?*, *¿podrías...?* or *¿te importaría...?*" },
      { type: "regex", pattern: "\\b(podría|le importaría|qué pena con usted|quería pedirle)\\b", label: "the neighbour: *¿podría...?* or *Qué pena con usted*" }
    ],
    model: "Oye, ¿me ayudas a subir el sofá esta noche? Qué pena con usted, ¿me podría prestar un taladro?"
  },
  pitfalls: [
    "*¿Te importaría ayudando?* borrows the English -ing: *¿te importaría ayudarme?*",
    "*Sí* to *¿te importaría?* means you do mind. Happy to is *No, para nada*.",
    "*¿Se puede?* asks about the rule; one person's permission is *¿me dejas?*"
  ]
},

"fn-responder-orden-b1": {
  source: "merged",
  hook: {
    line: "Your cousin asks to borrow your car for the weekend. You don't have to say yes or no straight away: Spanish gives you a yes, a yes with conditions, a maybe and a polite no.",
    es: "Sí, si me lo devuelves el domingo.\nPero cuídalo mucho, ¿sí?",
    en: "Yes, if you give it back to me on Sunday.\nBut take good care of it, okay?"
  },
  examples: [
    { es: "Lo siento, no puedo. Es que lo necesito para el trabajo.", en: "I'm sorry, I can't. It's just that I need it for work." },
    { es: "Lo voy a intentar, pero no te lo puedo prometer.", en: "I'll try, but I can't promise you." },
    { es: "No pienso prestarle el carro a nadie.", en: "I have no intention of lending the car to anyone." }
  ],
  rule: "Four answers to a request.\nYes, no strings: *Claro.* *Listo.* *Con mucho gusto.*\nYes, with a condition: *Sí, si me lo devuelves pronto.* *Bueno, pero cuídalo.*\nNot yet: *No sé, déjame pensarlo.* *Lo voy a intentar, pero no te lo puedo prometer.*\nNo, kindly: sorry first, then a reason with *es que*: *Lo siento, no puedo. Es que lo necesito.* Without the reason, *no puedo* sounds cold.\n*No pienso* and the dictionary form is a flat refusal, not a soft one: *No pienso prestarlo.* Use it only when you mean the fight.\nWithout *no* it is a firm plan, *Pienso ir*. Still deciding is *Estoy pensando en ir*.",
  readAndPick: [
    { q: "Is this a yes?", es: "Sí, si me lo devuelves antes del domingo.",
      options: ["Yes, with no strings", "Yes, with a condition", "No, but kindly"], answer: 1,
      why: "*Sí, si...*: a yes that only holds if the condition is met." },
    { q: "How does this land?", es: "No pienso prestarle el carro.",
      options: ["As a flat refusal", "As a polite maybe", "As a firm plan to lend it"], answer: 0,
      why: "*No pienso* refuses even to consider it. It is not a soft no." },
    { q: "What is *es que* doing here?", es: "Lo siento, no puedo. Es que tengo que trabajar.",
      options: ["Changing the subject", "Asking a question back", "Giving the reason"], answer: 2,
      why: "*Es que* brings in the reason, which keeps the no from sounding personal." },
    { q: "Has he said yes?", es: "Lo voy a intentar, pero no te lo puedo prometer.",
      options: ["Not yet: maybe", "Yes, for sure, today", "No, never ever"], answer: 0,
      why: "He will try, but he won't promise: a maybe that buys time." },
    { q: "Has she made up her mind?", es: "Estoy pensando en vender el carro.",
      options: ["Yes, she has decided", "No, she refuses to", "No, she's still deciding"], answer: 2,
      why: "*Estoy pensando en*: still weighing it up. *Pienso vender* would be decided." }
  ],
  yourTurn: [
    { en: "Yes, if you give it back to me soon. (to a friend)", es: "Sí, si me lo devuelves pronto.", accept: ["Sí, si me la devuelves pronto."] },
    { en: "I'm sorry, I can't. It's just that I have to work.", es: "Lo siento, no puedo. Es que tengo que trabajar.", accept: [] },
    { en: "I'll try, but I can't promise you. (to a friend)", es: "Lo voy a intentar, pero no te lo puedo prometer.", accept: ["Voy a intentarlo, pero no te lo puedo prometer.", "Lo voy a intentar, pero no puedo prometértelo.", "Voy a intentarlo, pero no puedo prometértelo."] },
    { en: "Of course, with pleasure.", es: "Claro, con mucho gusto.", accept: ["Claro, con gusto."] }
  ],
  translate: [
    { en: "I have no intention of signing that.", es: "No pienso firmar eso.", accept: [] },
    { en: "I'm thinking about selling the car.", es: "Estoy pensando en vender el carro.", accept: [] },
    { en: "I plan to go to the meeting.", es: "Pienso ir a la reunión.", accept: [] },
    { en: "Okay, but take good care of it, all right? (to a friend)", es: "Bueno, pero cuídalo mucho, ¿sí?", accept: ["Listo, pero cuídalo mucho, ¿sí?", "Bueno, pero cuídalo, ¿sí?"] },
    { en: "I don't know, let me think about it. (to a friend)", es: "No sé, déjame pensarlo.", accept: [] }
  ],
  register: [
    { es: "¡De una!", en: "Sure, right away!", when: "with friends in Colombia, an instant yes" },
    { es: "Listo.", en: "Okay, done.", when: "the everyday Colombian yes, with anyone" },
    { es: "Claro, con mucho gusto.", en: "Of course, with pleasure.", when: "warm and polite, to anyone" },
    { es: "Qué pena, pero no va a ser posible.", en: "Sorry, but it isn't going to be possible.", when: "a gentle no to someone you call usted" },
    { es: "No pienso hacerlo.", en: "I have no intention of doing it.", when: "only when you mean the fight" }
  ],
  personal: {
    prompt: "Someone asks you to work this Saturday. Write two answers: a yes with a condition, and a kind no with a reason.",
    constraints: [
      { type: "regex", pattern: "\\bs[ií],? si\\b", label: "a yes with a condition: *Sí, si...*" },
      { type: "containsAny", words: ["lo siento", "qué pena", "me encantaría"], label: "an apology first: *lo siento* or *qué pena*" },
      { type: "containsWord", word: "es que", label: "a reason with *es que*" }
    ],
    model: "Sí, si me pagan las horas extra. Lo siento, no puedo. Es que tengo un matrimonio ese día."
  },
  pitfalls: [
    "A bare *no puedo* sounds cold: add a reason with *es que*.",
    "*No pienso ir* is not a soft no: it says you won't even consider it.",
    "*Pienso de vender* adds a word: *pienso vender*, or *estoy pensando en vender*."
  ]
},

"fn-rechazar-b1": {
  source: "old",
  hook: {
    line: "A colleague invites you to her birthday dinner on Friday, the same night as your mother's. You want to say no without her feeling you just don't want to go.",
    es: "¡Qué pena! Me encantaría, pero no puedo.\nEs que ese día es el cumpleaños de mi mamá.",
    en: "What a shame! I'd love to, but I can't.\nIt's just that it's my mom's birthday that day."
  },
  examples: [
    { es: "No, muchas gracias, ya comí.", en: "No, thanks a lot, I've already eaten." },
    { es: "Gracias, pero prefiero quedarme en la casa hoy.", en: "Thanks, but I'd rather stay home today." },
    { es: "Bueno, otra vez será.", en: "Oh well, another time." }
  ],
  rule: "A no that keeps the friendship has three parts.\nThanks or regret first: *Muchas gracias*, *¡Qué pena!*, *Me encantaría, pero...*\nThe no itself: *no puedo*.\nThe reason, with *es que*: *Es que ya tengo planes.* The reason is not decoration: without it, the no sounds personal.\nOr turn it into a preference: *Prefiero quedarme en la casa, gracias.*\nClose the door gently: *Otra vez será.* *La próxima, sin falta.*\nIn writing, more formal: *Lamento no poder aceptar la invitación.*\n*¡Ni hablar!* is a strong no way, only among friends.",
  readAndPick: [
    { q: "Why add *es que*?", es: "No puedo, es que ya tengo planes.",
      options: ["So the no isn't personal", "To change the subject fast", "To say yes after all"], answer: 0,
      why: "The reason makes it about the plans, not about the person who asked." },
    { q: "Is he leaving the door open?", es: "Bueno, otra vez será.",
      options: ["No, never again", "Yes, another time", "He wants to go right now"], answer: 1,
      why: "*Otra vez será*: another time, so no hard feelings." },
    { q: "How does this sound?", es: "¡Ni hablar!",
      options: ["A polite maybe", "A warm yes", "A firm no way"], answer: 2,
      why: "*¡Ni hablar!* is no way: strong, and for friends only." },
    { q: "What does she say instead of a plain no?", es: "Gracias, pero prefiero quedarme en la casa.",
      options: ["She'd rather stay home", "She's coming a bit later", "She's already at home"], answer: 0,
      why: "*Prefiero quedarme* turns the no into a preference, and the thanks softens it." },
    { q: "Where would you read this?", es: "Lamento no poder aceptar la invitación.",
      options: ["A text to a close friend", "A formal written reply", "A shout across the street"], answer: 1,
      why: "*Lamento no poder* is careful and formal, a letter or an email." }
  ],
  yourTurn: [
    { en: "No, thanks a lot, but I can't.", es: "No, muchas gracias, pero no puedo.", accept: ["No, [muchas|mil] gracias, pero no puedo."] },
    { en: "It's just that I already have plans.", es: "Es que ya tengo planes.", accept: ["Es que ya tengo [planes|otro plan|un compromiso]."] },
    { en: "I'd rather stay home today, thanks.", es: "Prefiero quedarme en la casa hoy, gracias.", accept: ["Prefiero quedarme en (la) casa hoy, gracias.", "Hoy prefiero quedarme en (la) casa, gracias."] },
    { en: "Oh well, another time.", es: "Bueno, otra vez será.", accept: [] }
  ],
  translate: [
    { en: "What a shame! I'd love to, but I can't.", es: "¡Qué pena! Me encantaría, pero no puedo.", accept: ["¡Qué [pena|lástima]! Me encantaría, pero no puedo."] },
    { en: "I regret that I'm unable to accept the invitation.", es: "Lamento no poder aceptar la invitación.", accept: [] },
    { en: "No thanks, I'd rather not drink tonight.", es: "No, gracias, prefiero no tomar esta noche.", accept: ["No, gracias, prefiero no [tomar|beber] esta noche."] },
    { en: "I can't go, I'm really sorry.", es: "No puedo ir, lo siento mucho.", accept: ["No puedo ir, lo siento [mucho|muchísimo]."] },
    { en: "Next time, for sure.", es: "La próxima, sin falta.", accept: ["La próxima vez, sin falta.", "La próxima, seguro."] }
  ],
  register: [
    { es: "No, gracias.", en: "No, thanks.", when: "fine for small offers, like food" },
    { es: "¡Qué pena! Ya tengo planes.", en: "What a shame! I already have plans.", when: "with friends, warm and quick" },
    { es: "Me encantaría, pero no puedo.", en: "I'd love to, but I can't.", when: "anywhere, when you really would like to" },
    { es: "Muy amable, pero no voy a poder.", en: "That's very kind, but I won't be able to.", when: "to someone you call usted" },
    { es: "Lamento no poder asistir.", en: "I regret that I'm unable to attend.", when: "a formal written reply" }
  ],
  personal: {
    prompt: "A friend invites you to something you can't go to. Say no warmly: regret first, a reason with *es que*, and a door left open.",
    constraints: [
      { type: "containsAny", words: ["qué pena", "lo siento", "me encantaría", "gracias"], label: "regret or thanks first" },
      { type: "containsWord", word: "es que", label: "the reason with *es que*" },
      { type: "containsAny", words: ["otra vez será", "la próxima", "otro día"], label: "a door left open: *otra vez será* or *la próxima*" }
    ],
    model: "¡Qué pena! Me encantaría ir, pero no puedo. Es que el viernes viaja mi hermano. La próxima, sin falta."
  },
  pitfalls: [
    "A no with no reason sounds personal in Spanish: *es que* and a reason is almost always expected.",
    "*Ya he quedado* is how Spain says it. In Colombia: *ya tengo planes* or *ya tengo un compromiso*."
  ]
},

"fn-ordenar-directo-b1": {
  source: "merged",
  hook: {
    line: "You're leaving your teenage nephew alone in the apartment for the weekend, and there's no time for politeness. He needs clear instructions, in order.",
    es: "Cuando llegues del colegio, llámame.\nApaga la estufa y cierra bien la puerta.",
    en: "When you get back from school, call me.\nTurn off the stove and close the door properly."
  },
  examples: [
    { es: "¡Corre, corre, que perdemos el bus!", en: "Run, run, or we'll miss the bus!" },
    { es: "Pele las papas, córtelas y fríalas.", en: "Peel the potatoes, cut them and fry them." },
    { es: "Tienes que estar en la casa antes de las diez.", en: "You have to be home before ten." }
  ],
  rule: "When an order is what's wanted, give it plainly. The command you know does it: *Llámame.* *Cierra la puerta.* For *usted*: *Siéntese.*\nChain the steps with commas and *y*: *Apaga la estufa, cierra la puerta y llámame.*\nSay it twice for urgency, with a comma: *¡Corre, corre!* *¡Ven, ven!*\nPut the moment first with *cuando* and the subjunctive: *Cuando llegues, avísame.*\nRecipes and instructions use *usted*, even between friends: *Pele las papas y córtelas.*\n*Tienes que* and *debes* with the dictionary form are direct too, a duty more than an order: *Debes estar aquí a las diez.*",
  readAndPick: [
    { q: "What does saying it twice add?", es: "¡Corre, corre, que perdemos el bus!",
      options: ["Politeness", "Urgency", "A question"], answer: 1,
      why: "The same word twice turns up the volume: hurry." },
    { q: "When should he call?", es: "Cuando llegues a la casa, llámame.",
      options: ["Once he gets home", "Right now, at once", "Before he leaves"], answer: 0,
      why: "*Cuando llegues*: at a moment still to come, so the subjunctive." },
    { q: "Who is the recipe talking to?", es: "Pele las papas y córtelas en cuadritos.",
      options: ["Any reader, as *usted*", "A group of chefs", "A close friend only"], answer: 0,
      why: "Written instructions use *usted*: *pele*, *córtelas*." },
    { q: "What does he do last?", es: "Apaga la estufa, cierra la puerta y llámame.",
      options: ["Turn off the stove", "Close the door", "Call her"], answer: 2,
      why: "Three commands in a row, in order: *apaga*, *cierra*, and last *llámame*." },
    { q: "How direct is this?", es: "Debes estar aquí a las diez.",
      options: ["A duty, said directly", "A gentle hint", "A wish for later on"], answer: 0,
      why: "*Debes* plus the dictionary form is a duty, close to an order." }
  ],
  yourTurn: [
    { en: "When you get home, call me. (to a friend)", es: "Cuando llegues a la casa, llámame.", accept: ["Cuando llegues a (la) casa, llámame.", "Llámame cuando llegues a (la) casa."] },
    { en: "Run, run! (to a friend)", es: "¡Corre, corre!", accept: [] },
    { en: "Sit down, please. (polite)", es: "Siéntese, por favor.", accept: [] },
    { en: "Turn off the stove and close the door. (to a friend)", es: "Apaga la estufa y cierra la puerta.", accept: [] }
  ],
  translate: [
    { en: "Come, come, you have to see this! (to a friend)", es: "¡Ven, ven, tienes que ver esto!", accept: [] },
    { en: "Peel the potatoes and cut them into cubes. (polite)", es: "Pele las papas y córtelas en cuadritos.", accept: ["Pele las papas y córtelas en [cuadritos|cubos|cuadros]."] },
    { en: "You have to be home before ten. (to a friend)", es: "Tienes que estar en la casa antes de las diez.", accept: ["[Tienes que|Debes] estar en (la) casa antes de las diez."] },
    { en: "When you get to the station, let me know. (to a friend)", es: "Cuando llegues a la estación, avísame.", accept: ["Avísame cuando llegues a la estación."] },
    { en: "Add the salt and stir well. (polite)", es: "Agregue la sal y revuelva bien.", accept: ["[Agregue|Añada|Eche] la sal y revuelva bien."] },
    { en: "Come in, come in. (to a friend)", es: "Pasa, pasa.", accept: ["Sigue, sigue."] }
  ],
  register: [
    { es: "¡Ven acá ya!", en: "Come here now!", when: "urgent, with family" },
    { es: "Ven, ven.", en: "Come on, come on.", when: "a warm hurry, with friends" },
    { es: "Ven un momento, por favor.", en: "Come here a moment, please.", when: "an order softened, to anyone you call tú" },
    { es: "Siga, por favor.", en: "Come in, please.", when: "inviting someone you call usted to come in" },
    { es: "Hágale, que se hace tarde.", en: "Go on, it's getting late.", when: "a Colombian push, to someone you call usted" }
  ],
  personal: {
    prompt: "Write three instructions for someone looking after your home or your pet while you're away, in order, and one of them with *cuando*.",
    constraints: [
      { type: "anyVerbInTense", tense: "imperativo", label: "commands, like *cierra* or *llámame*" },
      { type: "subjunctiveAfter", trigger: "cuando", label: "one with *cuando* and the subjunctive" },
      { type: "minWords", n: 15, label: "fifteen words or more" }
    ],
    model: "Riega las matas los martes. Saca la basura por la noche. Cuando salgas, cierra bien la puerta."
  },
  pitfalls: [
    "*Cuando llegas, llámame* keeps the ordinary form: a moment still to come is *cuando llegues*.",
    "Repeat the very same word: *corre, corre*, never *corre, corra*.",
    "A recipe in *usted* is not cold: that is simply how instructions are written."
  ]
},

"impneg": {
  source: "merged",
  hook: {
    line: "Your little brother is about to cook for the first time while you watch. Half of what you want to say is what not to do, and the tú command you know changes shape for it.",
    es: "No toques eso, que está caliente.\nY no le eches tanta sal.",
    en: "Don't touch that, it's hot.\nAnd don't put so much salt in it."
  },
  examples: [
    { es: "No te preocupes, yo te ayudo.", en: "Don't worry, I'll help you." },
    { es: "No lo firmes todavía.", en: "Don't sign it yet." },
    { es: "No se preocupe, don Jorge.", en: "Don't worry, Don Jorge." }
  ],
  rule: "To tell someone not to do something, put *no* in front of the subjunctive.\nFor *usted* and *ustedes* nothing is new: *Firme.* *No firme.* *No firmen.*\nThe change is *tú*. The yes command has its own shape (*firma*, *ven*, *di*, *haz*), but the no switches: *no firmes*, *no vengas*, *no digas*, *no hagas*. Think of *no quiero que firmes* with the front cut off.\n*Me*, *te*, *lo* and *la* move too. With a yes they stick on the end: *Fírmalo.* *Dímelo.* With a no they go in front: *No lo firmes.* *No me lo digas.* The written accent goes with them.",
  readAndPick: [
    { q: "Is this an order?", es: "No firma nada sin leerlo.",
      options: ["Yes: don't sign", "No: he doesn't sign", "Yes: sign it all"], answer: 1,
      why: "*No firma* is the ordinary form: he doesn't sign. The order would be *no firmes*." },
    { q: "Which verb is behind *no vayas*?", es: "No vayas sola de noche.",
      options: ["ir, to go", "venir, to come", "ver, to see"], answer: 0,
      why: "*Ir* becomes *vaya*, so the tú no command is *no vayas*." },
    { q: "What is she telling him?", es: "No lo hagas todavía.",
      options: ["Do it right now", "He did it already", "Don't do it yet"], answer: 2,
      why: "*No lo hagas*: don't do it. *Lo* moves in front of the verb." },
    { q: "Who is being told?", es: "No se preocupen, ya vamos para allá.",
      options: ["One friend", "A group of people", "Someone you call usted"], answer: 1,
      why: "*Preocupen* ends in *-n*: a group, *ustedes*." },
    { q: "What does this mean?", es: "¡No me digas!",
      options: ["Don't tell anyone", "You don't say!", "Tell me now"], answer: 1,
      why: "*¡No me digas!* is also a set reaction to news: really? You don't say!" }
  ],
  yourTurn: [
    { en: "Don't touch that. (to a friend)", es: "No toques eso.", accept: [] },
    { en: "Don't sign it yet. (to a friend)", es: "No lo firmes todavía.", accept: ["Todavía no lo firmes."] },
    { en: "Don't worry. (polite)", es: "No se preocupe.", accept: [] },
    { en: "Don't go alone. (to a friend)", es: "No vayas solo.", accept: ["No vayas sola."] },
    { en: "Don't tell me that. (to a friend)", es: "No me digas eso.", accept: [] }
  ],
  translate: [
    { en: "Don't talk with your mouth full. (to a friend)", es: "No hables con la boca llena.", accept: [] },
    { en: "Don't eat so much sugar. (to a friend)", es: "No comas tanta azúcar.", accept: ["No comas tanto azúcar."] },
    { en: "Don't be late, all of you.", es: "No lleguen tarde.", accept: [] },
    { en: "Do it, but don't do it today. (to a friend)", es: "Hazlo, pero no lo hagas hoy.", accept: [] },
    { en: "Don't come home so late. (to a friend)", es: "No vengas tan tarde.", accept: ["No llegues tan tarde."] },
    { en: "Don't tell her, tell me. (to a friend)", es: "No se lo digas a ella, dímelo a mí.", accept: [] }
  ],
  register: [
    { es: "No lo hagas.", en: "Don't do it.", when: "direct, to someone you call tú" },
    { es: "Mejor no lo hagas.", en: "Better not do it.", when: "softer, more like advice" },
    { es: "Por favor, no lo haga.", en: "Please don't do it.", when: "to someone you call usted" },
    { es: "Yo que tú, no lo haría.", en: "If I were you, I wouldn't do it.", when: "advice that leaves the choice to them" },
    { es: "No lo hagan.", en: "Don't do it, any of you.", when: "to a group" }
  ],
  personal: {
    prompt: "Write three things a friend should not do on the first day at a new job, as *no* commands.",
    constraints: [
      { type: "regex", pattern: "(^|[.!¡,]\\s*)no (me |te |se |lo |la |le |les )?[a-záéíóúñ]+(es|as)\\b", label: "a *no* command for a friend, like *no llegues*" },
      { type: "minSentences", n: 3, label: "three of them" }
    ],
    model: "No llegues tarde. No hables mal del jefe. No te vayas antes de las cinco."
  },
  pitfalls: [
    "*No firma* is a statement, he doesn't sign. The order is *no firmes*.",
    "*No ve solo* borrows the yes shape: the short commands (*ve*, *ven*, *di*) only work without *no*.",
    "*No fírmalo* keeps the *lo* stuck on: with *no*, it moves in front, *no lo firmes*."
  ]
},

"fn-prohibir-b1": {
  source: "merged",
  hook: {
    line: "You're showing a new flatmate around your building in Cali, and the walls are full of rules. Some you read on signs, some you'll say yourself, and one you'll shout if he tries it.",
    es: "Aquí no se puede fumar.\nY ni se te ocurra parquear en la entrada.",
    en: "You can't smoke here.\nAnd don't even think about parking at the entrance."
  },
  examples: [
    { es: "Prohibido parquear.", en: "No parking." },
    { es: "Está prohibido dar de comer a los animales.", en: "Feeding the animals is forbidden." },
    { es: "No fumes aquí, por favor.", en: "Please don't smoke here." }
  ],
  rule: "Forbidding comes at four levels.\nSigns, with no person at all: *No fumar.* *Prohibido parquear.* *Prohibido el paso.*\nNotices: *Está prohibido*, *No está permitido* or *No se permite*, then the dictionary form: *No se permite entrar con perros.* Nothing goes between: no *de*.\nEveryday speech: *Aquí no se puede fumar.* *No puedes entrar sin boleta.*\nTo one person, a *no* command: *No fumes aquí, por favor.*\nThe strongest, between friends: *¡Ni se te ocurra!*, don't even think about it. Add what with the dictionary form: *Ni se te ocurra tocarlo.*",
  readAndPick: [
    { q: "Who is this aimed at?", es: "No fumar.",
      options: ["One person you know", "Nobody in particular", "The building manager"], answer: 1,
      why: "A bare dictionary form on a sign names nobody: it is the rule for all." },
    { q: "How strong is this?", es: "¡Ni se te ocurra tocar mi carro!",
      options: ["As strong as it gets", "A gentle request", "A question"], answer: 0,
      why: "*Ni se te ocurra* is don't even think about it: the top of the scale." },
    { q: "Where would you see this?", es: "No se permite el ingreso con mascotas.",
      options: ["In a text to a friend", "On the menu at a restaurant", "On a notice at a door"], answer: 2,
      why: "*No se permite* and *el ingreso* have the sound of an official notice." },
    { q: "Is this a ban?", es: "No es obligatorio llevar corbata.",
      options: ["Yes, ties are banned", "No, ties are optional", "Yes, ties are required"], answer: 1,
      why: "*No es obligatorio* only means you don't have to. A ban is *está prohibido*." },
    { q: "Who is being told?", es: "No fumes aquí, por favor.",
      options: ["Everyone in the building", "A person you call *usted*", "One person, as *tú*"], answer: 2,
      why: "*No fumes* is the tú no command. For *usted* it would be *no fume*." }
  ],
  yourTurn: [
    { en: "You can't smoke here.", es: "Aquí no se puede fumar.", accept: ["No se puede fumar [aquí|acá].", "Acá no se puede fumar."] },
    { en: "Feeding the animals is forbidden.", es: "Está prohibido dar de comer a los animales.", accept: ["Está prohibido darles comida a los animales."] },
    { en: "Don't even think about it! (to a friend)", es: "¡Ni se te ocurra!", accept: [] },
    { en: "Please don't smoke here. (to a friend)", es: "No fumes aquí, por favor.", accept: ["Por favor, no fumes [aquí|acá].", "No fumes acá, por favor."] }
  ],
  translate: [
    { en: "No parking.", es: "Prohibido parquear.", accept: ["No parquear."] },
    { en: "Taking photos is not allowed.", es: "No está permitido tomar fotos.", accept: ["No [está permitido|se permite|se puede] tomar fotos."] },
    { en: "You can't come in without a ticket. (to a friend)", es: "No puedes entrar sin boleta.", accept: ["No puedes entrar sin (la) boleta."] },
    { en: "Don't even think about touching my car! (to a friend)", es: "¡Ni se te ocurra tocar mi carro!", accept: [] },
    { en: "Dogs aren't allowed in.", es: "No se permite entrar con perros.", accept: ["No se permiten perros.", "No está permitido entrar con perros."] }
  ],
  register: [
    { es: "No tocar.", en: "Do not touch.", when: "on a sign, to nobody in particular" },
    { es: "Está prohibido tocar las obras.", en: "Touching the artworks is forbidden.", when: "an official notice in a museum" },
    { es: "Por favor, no toque las obras.", en: "Please don't touch the artworks.", when: "a guard to a visitor, as usted" },
    { es: "Mejor no toques eso.", en: "Better not touch that.", when: "a soft warning to a friend" },
    { es: "¡Ni se te ocurra tocarlo!", en: "Don't you dare touch it!", when: "with a friend, as strong as it gets" }
  ],
  personal: {
    prompt: "Write two rules for your home: one as a notice for visitors, and one as you would say it to a friend who is about to break it.",
    constraints: [
      { type: "containsAny", words: ["está prohibido", "no está permitido", "no se permite", "prohibido", "no se puede"], label: "a notice: *está prohibido* or *no se permite*" },
      { type: "regex", pattern: "ni se te ocurra|\\bno (lo |la |los |las |me |te |le |les |se )?[a-záéíóúñ]+(es|as)\\b", label: "to the friend: a *no* command or *¡ni se te ocurra!*" }
    ],
    model: "Está prohibido fumar dentro del apartamento. ¡Oye, ni se te ocurra fumar en el balcón!"
  },
  pitfalls: [
    "*Está prohibido de entrar* adds a word: *está prohibido entrar*.",
    "*Es prohibido* is the slip: a ban on a notice is *está prohibido*.",
    "*Aparcar* is how Spain says it. In Colombia you *parquear*."
  ]
},

"fn-obligacion-necesidad-b1": {
  source: "merged",
  hook: {
    line: "Your friend starts at a hospital in Medellín on Monday and asks what the rules are. Some things she must do, some she mustn't, and some she simply doesn't have to, and English mixes those up.",
    es: "Tienes que llegar a las siete.\nNo debes usar el celular con los pacientes.\nY no tienes que llevar uniforme el primer día.",
    en: "You have to arrive at seven.\nYou mustn't use your phone with the patients.\nAnd you don't have to wear a uniform on the first day."
  },
  examples: [
    { es: "Es necesario que todos los empleados firmen el contrato.", en: "It's necessary for all the employees to sign the contract." },
    { es: "Hay cosas que debes saber antes de empezar.", en: "There are things you need to know before you start." },
    { es: "En los hospitales no puedes hablar duro.", en: "In hospitals you can't talk loudly." }
  ],
  rule: "From strongest to weakest:\n*Es obligatorio* and the dictionary form: the rule, with nobody named.\n*Tienes que* and *hay que*: you have to, everyone has to. *Hay que firmar aquí.*\n*Debes*: a duty, close to an order. *Debes avisar si no vienes.*\n*Es necesario que* and the subjunctive names who: *Es necesario que todos firmen.*\nNow the trap. *No debes* and *no puedes* mean you mustn't. *No tienes que* means you don't have to: there is no need.\n*No debes usar el celular.* Don't.\n*No tienes que venir.* You can, but you needn't.",
  readAndPick: [
    { q: "Can she use her phone?", es: "No debes usar el celular con los pacientes.",
      options: ["Yes, if she wants to", "No, she mustn't", "Only on Mondays"], answer: 1,
      why: "*No debes* is you mustn't: a rule, not a choice." },
    { q: "Does he have to come?", es: "No tienes que venir mañana.",
      options: ["Yes, he must come", "No, he mustn't come", "No, there's no need"], answer: 2,
      why: "*No tienes que* is no need. He can come if he likes." },
    { q: "Who has to sign?", es: "Es necesario que todos firmen el contrato.",
      options: ["Only the boss", "Everyone", "Nobody yet"], answer: 1,
      why: "*Que todos firmen*: naming who brings *que* and the subjunctive." },
    { q: "What does this rule mean?", es: "En la biblioteca no puedes hablar duro.",
      options: ["You must keep quiet", "You may shout once", "Talking is required"], answer: 0,
      why: "*No puedes hablar duro* forbids the noise, so the rule is: keep quiet." },
    { q: "Who has to do it?", es: "Hay que pagar antes de entrar.",
      options: ["Just the speaker", "Only you", "Everyone"], answer: 2,
      why: "*Hay que* names nobody, so it means everyone." }
  ],
  yourTurn: [
    { en: "You have to arrive at seven. (to a friend)", es: "Tienes que llegar a las siete.", accept: [] },
    { en: "You don't have to come tomorrow. (to a friend)", es: "No tienes que venir mañana.", accept: ["Mañana no tienes que venir."] },
    { en: "You mustn't use your phone here. (to a friend)", es: "No debes usar el celular aquí.", accept: ["No [debes|puedes] usar el celular [aquí|acá]."] },
    { en: "You have to pay before going in.", es: "Hay que pagar antes de entrar.", accept: [] }
  ],
  translate: [
    { en: "It's necessary for everyone to vote.", es: "Es necesario que todos voten.", accept: [] },
    { en: "Wearing a seatbelt is compulsory.", es: "Es obligatorio usar el cinturón de seguridad.", accept: ["Es obligatorio [usar|llevar|ponerse] el cinturón (de seguridad)."] },
    { en: "There are things you need to know before signing. (to a friend)", es: "Hay cosas que debes saber antes de firmar.", accept: ["Hay cosas que [debes|tienes que] saber antes de firmar."] },
    { en: "In hospitals you can't talk loudly.", es: "En los hospitales no puedes hablar duro.", accept: ["En los hospitales no [puedes|se puede] hablar [duro|alto|fuerte]."] },
    { en: "You shouldn't leave the door open at night. (to a friend)", es: "No debes dejar la puerta abierta por la noche.", accept: ["No [debes|deberías] dejar la puerta abierta [por la noche|de noche]."] },
    { en: "You don't have to bring anything. (to a friend)", es: "No tienes que traer nada.", accept: [] }
  ],
  register: [
    { es: "Hay que firmar aquí.", en: "You have to sign here.", when: "everyday, a rule for everyone" },
    { es: "Tiene que firmar aquí.", en: "You need to sign here.", when: "to one person you call usted" },
    { es: "Es obligatorio firmar el formulario.", en: "Signing the form is compulsory.", when: "official, on forms and notices" },
    { es: "Debe firmar las tres copias.", en: "You must sign all three copies.", when: "formal instructions, often written" },
    { es: "Fírmame aquí, porfa.", en: "Sign here for me, please.", when: "with a friend, casual" }
  ],
  personal: {
    prompt: "Explain the rules of your workplace, school or home to someone new: one thing they have to do, one they mustn't, and one they don't have to.",
    constraints: [
      { type: "containsAny", words: ["tienes que", "hay que", "debes", "es obligatorio"], label: "something they have to do" },
      { type: "containsAny", words: ["no debes", "no puedes", "no se puede"], label: "something they mustn't: *no debes* or *no puedes*" },
      { type: "containsWord", word: "no tienes que", label: "something they needn't: *no tienes que*" }
    ],
    model: "Tienes que llegar a las ocho. No puedes almorzar en el escritorio. Y no tienes que trabajar los sábados."
  },
  pitfalls: [
    "*No tienes que venir* is not a ban: it means no need. A ban is *no debes venir* or *no puedes venir*.",
    "*Debes de ir* is a guess, you're probably going: for a duty, *debes ir*.",
    "*Es necesario que todos firman* keeps the ordinary form: naming who takes the subjunctive, *firmen*."
  ]
},

"fn-habilidad-b1": {
  source: "merged",
  hook: {
    line: "At a job interview in Bogotá they ask what you're good at. Say too little and you undersell yourself; say too much and it sounds like bragging. Spanish has a whole ladder in between.",
    es: "Soy bastante buena para los idiomas.\nPero para los números soy un desastre.",
    en: "I'm pretty good at languages.\nBut with numbers I'm hopeless."
  },
  examples: [
    { es: "Sé un poco de electricidad, pero no mucho.", en: "I know a bit about electricity, but not much." },
    { es: "Me gusta cocinar y no lo hago nada mal.", en: "I like cooking and I'm not bad at it at all." },
    { es: "Sonia es un genio para los computadores.", en: "Sonia is a genius with computers." }
  ],
  rule: "Claim a skill at the right size.\nA little: *Sé un poco de cocina.* *Sé algo de electricidad.*\nKnowing how: *Sé nadar.* *Sé manejar.* Not *puedo*, which is about whether you can right now.\nThe middle: *ser bueno para* or *malo para*, plus a thing or the dictionary form: *Soy bueno para cocinar.* For a school subject, *en* works too: *buena en matemáticas.* The word matches the person: *buena*, *malos*.\nA plain verdict: *Lo hago bien.* *No lo hago nada mal* means pretty well.\nThe two ends, said for effect: *Soy un genio para...* *Soy un desastre para...*\nFormal, on a CV: *Domina el inglés.*",
  readAndPick: [
    { q: "How big is the claim?", es: "Sé un poco de electricidad.",
      options: ["Modest: a little", "Huge: an expert", "None at all"], answer: 0,
      why: "*Sé un poco de* is a small, honest claim." },
    { q: "What is she saying?", es: "Sé nadar, pero hoy no puedo: estoy enferma.",
      options: ["She never learned how", "She can, but not today", "She's learning to swim"], answer: 1,
      why: "*Sé nadar* is knowing how; *no puedo* is about today." },
    { q: "Is he bragging?", es: "Soy un genio para los computadores.",
      options: ["No, he's being modest", "No, it's a complaint", "Yes, for effect"], answer: 2,
      why: "*Un genio para* is the top of the ladder, said for effect." },
    { q: "How good is she?", es: "No lo hago nada mal, la verdad.",
      options: ["Fairly good", "Really bad at it", "Not at all good"], answer: 0,
      why: "*No lo hago nada mal* sounds negative, but it means pretty well." },
    { q: "Why *buena* and not *bueno*?", es: "Mi hermana es muy buena para los idiomas.",
      options: ["It matches *idiomas*", "It matches the sister", "It's always *buena*"], answer: 1,
      why: "*Bueno* matches the person it describes: a sister is *buena*." }
  ],
  yourTurn: [
    { en: "I'm good at cooking.", es: "Soy bueno para cocinar.", accept: ["Soy [bueno|buena] para cocinar.", "Soy [bueno|buena] para la cocina."] },
    { en: "I'm hopeless with names.", es: "Soy un desastre para los nombres.", accept: [] },
    { en: "I know how to drive, but I don't have a car.", es: "Sé manejar, pero no tengo carro.", accept: [] },
    { en: "I know a bit about electricity.", es: "Sé un poco de electricidad.", accept: ["Sé algo de electricidad."] }
  ],
  translate: [
    { en: "She's very good at languages.", es: "Es muy buena para los idiomas.", accept: ["Ella es muy buena para los idiomas.", "Es muy buena [en|con] los idiomas."] },
    { en: "I'm not bad at it at all, honestly.", es: "No lo hago nada mal, la verdad.", accept: [] },
    { en: "He's a genius with computers.", es: "Es un genio para los computadores.", accept: ["Es un genio para [los computadores|las computadoras]."] },
    { en: "Tomás is good at maths.", es: "Tomás es bueno en matemáticas.", accept: ["Tomás es bueno para las matemáticas."] },
    { en: "We're bad at dancing.", es: "Somos malos para bailar.", accept: [] },
    { en: "He is fluent in several languages.", es: "Domina varios idiomas.", accept: ["Habla varios idiomas con fluidez."] }
  ],
  register: [
    { es: "Me defiendo en inglés.", en: "I get by in English.", when: "modest but useful, and very common" },
    { es: "Soy bueno para el inglés.", en: "I'm good at English.", when: "everyday, a plain claim" },
    { es: "Tengo un buen nivel de inglés.", en: "I have a good level of English.", when: "in an interview, measured" },
    { es: "Domino el inglés.", en: "I'm fluent in English.", when: "on a CV or in a formal interview" },
    { es: "Es un duro para el inglés.", en: "He's great at English.", when: "Colombian slang, praising someone else" }
  ],
  personal: {
    prompt: "Tell a new friend about your skills: one you're good at, one you only know a little about, and one you're hopeless at.",
    constraints: [
      { type: "regex", pattern: "\\b(bueno|buena|buenos|buenas) (para|en)\\b", label: "something you're good at: *soy bueno para*" },
      { type: "containsAny", words: ["sé un poco de", "sé algo de", "me defiendo"], label: "something you know a little: *sé un poco de*" },
      { type: "containsAny", words: ["un desastre para", "malo para", "mala para"], label: "something you're hopeless at" }
    ],
    model: "Soy bastante buena para cocinar. Sé un poco de jardinería. Y soy un desastre para los números."
  },
  pitfalls: [
    "*Soy bueno a cocinar* borrows the English at: *bueno para cocinar*.",
    "*Puedo nadar* is about right now; knowing how is *sé nadar*.",
    "*Soy bien para bailar* uses the wrong word: describing a person takes *bueno*."
  ]
},

"task-b1-pedir": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: four short exchanges with four different people. Someone asks a favour, someone asks permission, someone refuses and someone forbids, and nobody is rude by accident.",
    es: "¿Te importaría echarme una mano el sábado?\nUf, el sábado lo tengo complicado, es que viene mi hermana.",
    en: "Would you mind giving me a hand on Saturday?\nOof, Saturday's tricky for me, it's just that my sister's coming."
  },
  examples: [
    { es: "¿Puedo dejar la bici aquí un momento?\nSí, claro, pero no la dejes en la puerta.", en: "Can I leave the bike here for a moment?\nSure, but don't leave it by the door." },
    { es: "¿Me prestas el carro este fin de semana?\nMira, prefiero que no.", en: "Will you lend me the car this weekend?\nLook, I'd rather not." }
  ],
  rule: "Four exchanges, four relationships. Each one makes its move and gets an answer.\nA favour, softened: *¿Te importaría echarme una mano?* *¿Me podrías prestar...?*\nPermission: *¿Puedo...?* *¿Me dejas...?* *¿Se puede...?*\nA refusal with a reason: *Uf, el sábado lo tengo complicado, es que...* *Prefiero que no.* A bare *no* costs more than a clumsy request.\nA ban, at the right level: *Aquí no se puede fumar.* *No la dejes en la puerta.*\nAnd the answer to a ban: *Ah, perdón, no sabía.*\nMatch each one to the person: *tú* with a friend, *usted* with a neighbour you barely know.",
  readAndPick: [
    { q: "What is she asking for?", es: "¿Puedo dejar la bici aquí un momento?",
      options: ["Permission", "A favour from her", "An object to borrow"], answer: 0,
      why: "*¿Puedo...?* asks if she is allowed, not for anyone's help." },
    { q: "Is this a yes?", es: "Uf, el sábado lo tengo complicado.",
      options: ["Yes, gladly", "A firm yes, now", "A soft no, coming"], answer: 2,
      why: "*Lo tengo complicado* is how a polite no begins, before the reason." },
    { q: "How does he refuse?", es: "Mira, prefiero que no. El seguro no cubre a nadie más.",
      options: ["With a reason", "With an insult", "With a joke"], answer: 0,
      why: "The insurance is the reason, so the no isn't personal." },
    { q: "What does the answer do?", es: "Ah, perdón, no sabía.",
      options: ["Argues back", "Apologises", "Asks a favour"], answer: 1,
      why: "*Perdón, no sabía* accepts the rule and closes it kindly." },
    { q: "Why *usted* here?", es: "Qué pena, señora, aquí no se puede parquear.",
      options: ["She's a close friend", "She's a stranger", "She's a little girl"], answer: 1,
      why: "A stranger gets *usted* and *qué pena*, even for a ban." }
  ],
  yourTurn: [
    { en: "Would you mind giving me a hand on Saturday? (to a friend)", es: "¿Te importaría echarme una mano el sábado?", accept: ["¿Te importaría ayudarme el sábado?"] },
    { en: "Can I leave the bike here for a moment?", es: "¿Puedo dejar la bici aquí un momento?", accept: ["¿Puedo dejar la [bici|bicicleta] [aquí|acá] un momento?"] },
    { en: "Look, I'd rather not. (to a friend)", es: "Mira, prefiero que no.", accept: [] },
    { en: "Oh, sorry, I didn't know.", es: "Ah, perdón, no sabía.", accept: ["Ah, perdón, no lo sabía."] }
  ],
  translate: [
    { en: "Saturday's tricky for me, it's just that my sister is coming.", es: "El sábado lo tengo complicado, es que viene mi hermana.", accept: [] },
    { en: "Sure, but don't leave it by the door. (to a friend)", es: "Sí, claro, pero no la dejes en la puerta.", accept: [] },
    { en: "Will you lend me the car this weekend? (to a friend)", es: "¿Me prestas el carro este fin de semana?", accept: [] },
    { en: "The insurance doesn't cover anyone else.", es: "El seguro no cubre a nadie más.", accept: [] },
    { en: "You can't smoke here. It's just that there are children.", es: "Aquí no se puede fumar. Es que hay niños.", accept: ["No se puede fumar [aquí|acá]. Es que hay niños."] }
  ],
  register: [
    { es: "¿Me das una mano?", en: "Will you give me a hand?", when: "with a close friend" },
    { es: "¿Te importaría ayudarme?", en: "Would you mind helping me?", when: "a bigger favour, to anyone you call tú" },
    { es: "¿Me haría el favor de ayudarme?", en: "Would you do me the favour of helping me?", when: "to someone you call usted" },
    { es: "Prefiero que no.", en: "I'd rather not.", when: "a refusal that needs no fight" }
  ],
  personal: {
    prompt: "Write two of the four exchanges, one line for each person: a favour with *¿te importaría...?* and a refusal with a reason.",
    constraints: [
      { type: "containsAny", words: ["te importaría", "le importaría"], label: "a favour with *¿te importaría...?*" },
      { type: "containsWord", word: "es que", label: "a refusal with a reason: *es que*" },
      { type: "minSentences", n: 4, label: "four lines or more" }
    ],
    model: "¿Te importaría prestarme tu taladro el domingo?\nClaro, pero devuélvemelo el lunes.\n¿Me acompañas al médico mañana?\nQué pena, no puedo. Es que tengo una reunión."
  },
  pitfalls: [
    "A bare *no* sounds rude in Spanish: every refusal needs its reason.",
    "*¿Te vale el domingo?* is how Spain says it. In Colombia: *¿Te sirve el domingo?*"
  ]
},

/* ---- unit b1-u33 · Good feelings ----------------------------------------- */

"fn-contento-encantado-b1": {
  source: "merged",
  hook: {
    line: "Six months into your new life in Medellín, a friend from home calls and asks if you're happy. A yes isn't enough: happy with what, happy to do what, happy that someone else did what?",
    es: "Estoy muy contenta con el apartamento.\nY estoy feliz de vivir aquí.",
    en: "I'm really happy with the apartment.\nAnd I'm happy to be living here."
  },
  examples: [
    { es: "Mis papás están encantados con el colegio de los niños.", en: "My parents are delighted with the kids' school." },
    { es: "Estoy encantado de estar aquí con ustedes.", en: "I'm delighted to be here with you all." },
    { es: "Estoy contento de que vengas en diciembre.", en: "I'm happy you're coming in December." }
  ],
  rule: "English says happy with and happy to. Spanish splits the same way.\n*Contento con*, *encantado con*: what you're happy with, a thing or a person. *Estoy contenta con el apartamento.*\n*Contento de*, *encantado de*: what you're happy to do yourself, with the dictionary form. *Estoy encantado de estar aquí.*\n*Contento de que* and the subjunctive: what someone else does. *Estoy contento de que vengas.*\nThey go with *estar*, and they match the person: *contenta*, *encantados*.\n*Feliz* works the same way: *feliz con*, *feliz de*.\n*Encantado* is a step up from *contento*. *Satisfecho con* sounds like business.",
  readAndPick: [
    { q: "What is she happy with?", es: "Está muy contenta con su trabajo nuevo.",
      options: ["Her new job", "Leaving her old job", "Her boss leaving"], answer: 0,
      why: "*Contenta con* names the thing she's happy with: the new job." },
    { q: "Who is coming?", es: "Estoy contento de que vengas en diciembre.",
      options: ["The speaker is", "You are", "Nobody yet"], answer: 1,
      why: "*Que vengas*: the coming is yours, so *de que* and the subjunctive." },
    { q: "Why *de* and not *con* here?", es: "Estoy encantada de estar aquí.",
      options: ["A person follows", "An action of hers follows", "It's about the past"], answer: 1,
      why: "Before an action you do yourself, *de* and the dictionary form." },
    { q: "How happy are they?", es: "Estamos encantados con el colegio.",
      options: ["Only a little", "Not at all", "Very: delighted"], answer: 2,
      why: "*Encantados* is a step up from *contentos*." },
    { q: "Where would you hear this?", es: "Estamos muy satisfechos con los resultados.",
      options: ["A report at work", "A text to your mom", "A kid's birthday party"], answer: 0,
      why: "*Satisfechos con* has the sound of business: results, reports, clients." }
  ],
  yourTurn: [
    { en: "I'm really happy with the apartment.", es: "Estoy muy contento con el apartamento.", accept: ["Estoy muy contenta con el apartamento."] },
    { en: "I'm delighted to be here.", es: "Estoy encantado de estar aquí.", accept: ["Estoy [encantado|encantada] de estar [aquí|acá]."] },
    { en: "I'm happy you're coming in December. (to a friend)", es: "Estoy contento de que vengas en diciembre.", accept: ["Estoy [contento|contenta|feliz] de que vengas en diciembre."] },
    { en: "We're delighted with the new school.", es: "Estamos encantados con el colegio nuevo.", accept: ["Estamos [encantados|encantadas] con el [colegio nuevo|nuevo colegio]."] }
  ],
  translate: [
    { en: "She's happy to work here.", es: "Está contenta de trabajar aquí.", accept: ["Está [contenta|feliz] de trabajar [aquí|acá]."] },
    { en: "Are you happy with your job? (to a friend)", es: "¿Estás contento con tu trabajo?", accept: ["¿Estás contenta con tu trabajo?"] },
    { en: "We're very satisfied with the results.", es: "Estamos muy satisfechos con los resultados.", accept: [] },
    { en: "I'm happy that you're well. (to a friend)", es: "Estoy contento de que estés bien.", accept: ["Estoy [contento|contenta|feliz] de que estés bien."] },
    { en: "We're not happy with the offer.", es: "No estamos contentos con la oferta.", accept: [] }
  ],
  register: [
    { es: "¡Estoy feliz de la vida!", en: "I'm as happy as can be!", when: "with friends, when you're really pleased" },
    { es: "Estoy muy contento.", en: "I'm very happy.", when: "anywhere, plain and warm" },
    { es: "Estoy encantada con el cambio.", en: "I'm delighted with the change.", when: "a step up, when you really mean it" },
    { es: "Mucho gusto.", en: "Nice to meet you.", when: "meeting someone, the everyday Colombian way" },
    { es: "Estamos muy satisfechos con el servicio.", en: "We're very satisfied with the service.", when: "formal, in a review or a report" }
  ],
  personal: {
    prompt: "Tell a friend about your life right now: something you're happy with, something you're happy to do, and something someone else does that makes you glad.",
    constraints: [
      { type: "regex", pattern: "(contento|contenta|contentos|encantado|encantada|encantados|feliz) con\\b", label: "happy with: *contento con*" },
      { type: "regex", pattern: "(contento|contenta|contentos|encantado|encantada|encantados|feliz) de [a-záéíóúñ]+(ar|er|ir)\\b", label: "happy to: *contento de* and the dictionary form" },
      { type: "subjunctiveAfter", trigger: "de que", label: "happy that: *de que* and the subjunctive" }
    ],
    model: "Estoy muy contenta con mi trabajo nuevo. Estoy feliz de vivir cerca del mar. Y estoy encantada de que mi hermana venga en julio."
  },
  pitfalls: [
    "*Contento con estar aquí* uses the wrong word: before an action, *de*.",
    "*Soy contento* is the slip: a feeling right now is *estoy contento*.",
    "*Contento de que vienes* keeps the ordinary form: someone else's action takes *vengas*."
  ]
},

"fn-me-alegro-b1": {
  source: "merged",
  hook: {
    line: "Your friend Laura texts that she got the scholarship she's been chasing for a year. *Qué bien* feels too small. You want to say how glad you are, and that you're glad for her.",
    es: "¡Me alegro muchísimo por ti, Laura!\nMe alegro de que te den la beca.",
    en: "I'm so happy for you, Laura!\nI'm glad they're giving you the scholarship."
  },
  examples: [
    { es: "Me alegro de verte.", en: "I'm glad to see you." },
    { es: "Me alegro mucho de que estés bien.", en: "I'm really glad you're OK." },
    { es: "Me alegro cuando vienes a visitarme.", en: "I'm happy when you come to visit me." }
  ],
  rule: "*Me alegro* is I'm glad. What follows depends on what you're glad about.\nYour own action: *de* and the dictionary form. *Me alegro de verte.*\nSomeone else's: *de que* and the subjunctive, always, even for news you're sure of. *Me alegro de que estés bien.*\nA person: *por*. *Me alegro por ti.*\nEach time something happens: *cuando* and the ordinary form. *Me alegro cuando vienes.*\nTurn it up with *mucho*, *muchísimo* or *un montón*.\n*Me alegra que* says the same with no *de*, and you'll hear it all the time in Colombia: *Me alegra que estés bien.*",
  readAndPick: [
    { q: "Who is OK?", es: "Me alegro mucho de que estés bien.",
      options: ["You are", "I am", "They are"], answer: 0,
      why: "*Que estés bien*: you're the one who is OK." },
    { q: "Why *verte*, with no *que*?", es: "Me alegro de verte.",
      options: ["It's about the past", "The speaker sees you", "It's really a question"], answer: 1,
      why: "The one who is glad is the one who sees, so *de* and the dictionary form." },
    { q: "Who is she happy for?", es: "Me alegro por ti.",
      options: ["Herself", "Your whole family", "You"], answer: 2,
      why: "*Por ti*: on your behalf, for your news." },
    { q: "How often is he glad?", es: "Me alegro cuando vienes a visitarme.",
      options: ["Once, last week", "Each time you come", "Never, sadly"], answer: 1,
      why: "*Cuando vienes*: each time it happens, so the ordinary form." },
    { q: "Which sounds the most formal?", es: "Nos complace que acepte nuestra propuesta.",
      options: ["A text between friends", "A chat at a party", "A letter from a company"], answer: 2,
      why: "*Nos complace* and *usted* are the voice of a company letter." }
  ],
  yourTurn: [
    { en: "I'm so happy for you! (to a friend)", es: "¡Me alegro muchísimo por ti!", accept: ["¡Me alegro [mucho|un montón] por ti!"] },
    { en: "I'm glad to see you. (to a friend)", es: "Me alegro de verte.", accept: ["Qué bueno verte."] },
    { en: "I'm really glad you're OK. (to a friend)", es: "Me alegro mucho de que estés bien.", accept: ["Me alegra mucho que estés bien."] },
    { en: "I'm glad they're giving you the scholarship. (to a friend)", es: "Me alegro de que te den la beca.", accept: ["Me alegra que te den la beca."] }
  ],
  translate: [
    { en: "I'm always happy when you come to visit me. (to a friend)", es: "Siempre me alegro cuando vienes a visitarme.", accept: ["Me alegro siempre que vienes a visitarme.", "Siempre me alegro cuando me vienes a visitar."] },
    { en: "We're glad you're still here. (to a friend)", es: "Nos alegramos de que sigas aquí.", accept: ["Nos alegra que sigas [aquí|acá].", "Nos alegramos de que sigas acá."] },
    { en: "We're pleased that you accept our proposal. (polite)", es: "Nos complace que acepte nuestra propuesta.", accept: [] },
    { en: "I'm glad I can help.", es: "Me alegro de poder ayudar.", accept: [] },
    { en: "Are you glad your sister is coming? (to a friend)", es: "¿Te alegras de que venga tu hermana?", accept: ["¿Te alegra que venga tu hermana?"] }
  ],
  register: [
    { es: "¡Qué bien!", en: "Great!", when: "a quick reaction to small good news" },
    { es: "¡Qué alegría!", en: "How wonderful!", when: "warm, for news that really matters" },
    { es: "Me alegro un montón.", en: "I'm so glad.", when: "with friends, turned all the way up" },
    { es: "Me alegra mucho saberlo.", en: "I'm very glad to hear it.", when: "calm and kind, to anyone" },
    { es: "Nos complace darle la bienvenida.", en: "We're pleased to welcome you.", when: "formal letters and emails" }
  ],
  personal: {
    prompt: "A friend has just told you some good news. Write back: how glad you are, and what exactly you're glad about.",
    constraints: [
      { type: "containsAny", words: ["me alegro", "me alegra", "qué alegría"], label: "*me alegro* or *me alegra*" },
      { type: "containsAny", words: ["alegro de que", "alegra que", "alegra mucho que"], label: "what you're glad about: *me alegro de que*" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive for their news" }
    ],
    model: "¡Me alegro muchísimo por ti! Me alegro de que por fin te den el trabajo."
  },
  pitfalls: [
    "*Me alegro que estés bien* drops the *de*: *me alegro de que*, or *me alegra que* with no *de*.",
    "*Me alegro de que estás bien* keeps the ordinary form: good news you're sure of still takes *estés*.",
    "*Me alegro de ti* uses the wrong word: for a person, *me alegro por ti*."
  ]
},

"fn-placer-diversion-b1": {
  source: "merged",
  hook: {
    line: "On Monday at work everyone asks about your weekend in Santa Marta. In Colombia the answer comes with a tiny *la* that stands for nothing, and you'll need it every week.",
    es: "¡La pasamos buenísimo!\nNos reímos todo el fin de semana.",
    en: "We had a fantastic time!\nWe laughed the whole weekend."
  },
  examples: [
    { es: "¿La pasaste bien en la fiesta?", en: "Did you have a good time at the party?" },
    { es: "Me divertí mucho en el matrimonio de mi prima.", en: "I had a lot of fun at my cousin's wedding." },
    { es: "Me reí mucho, pero la pasé fatal.", en: "I laughed a lot, but I had an awful time." }
  ],
  rule: "For how a whole experience went: *la*, then *pasar*, then how. *La pasé bien.* *La pasamos genial.* *La pasaron fatal.* The *la* stands for nothing and never changes; only *pasar* changes.\nIt judges the whole thing: you can laugh and still *pasarla fatal*.\nFor one reaction: *Me divertí mucho.* *Nos reímos muchísimo.*\nFor something fun: *Es divertido* and the dictionary form, or *que* and the subjunctive for what someone else does: *Es divertido que cuentes las cosas así.*\n*Disfrutar* is a bit more careful: *Disfrutamos mucho la cena.*\nNever *tuve un buen tiempo*: that is English in Spanish clothes.",
  readAndPick: [
    { q: "How was the party?", es: "¿Qué tal la fiesta? La pasé genial.",
      options: ["Great", "Awful", "Boring"], answer: 0,
      why: "*La pasé genial*: a great time, from start to finish." },
    { q: "Is this a contradiction?", es: "Me reí mucho, pero la pasé fatal.",
      options: ["Yes, it makes no sense", "No, the night was bad", "Yes, she is joking"], answer: 1,
      why: "She laughed at moments, but *la pasé fatal* judges the whole night." },
    { q: "Who had a good time?", es: "¿La pasaron bien en Cartagena?",
      options: ["You, one friend", "Only the speaker", "You all, as a group"], answer: 2,
      why: "*Pasaron* ends in *-n*: the question is for a group." },
    { q: "What does the *la* stand for?", es: "La pasamos buenísimo.",
      options: ["Nothing at all", "The party itself", "The night out"], answer: 0,
      why: "The *la* is just part of the phrase. It never points to anything." },
    { q: "Who tells the stories?", es: "Es divertido que cuentes las cosas así.",
      options: ["The speaker", "You do", "Everyone at once"], answer: 1,
      why: "*Que cuentes*: you tell them, so *que* and the subjunctive." }
  ],
  yourTurn: [
    { en: "We had a great time.", es: "La pasamos genial.", accept: ["La pasamos [buenísimo|muy bien|delicioso]."] },
    { en: "Did you have a good time at the party? (to a friend)", es: "¿La pasaste bien en la fiesta?", accept: [] },
    { en: "I had a lot of fun.", es: "Me divertí mucho.", accept: ["Me divertí muchísimo."] },
    { en: "We laughed a lot.", es: "Nos reímos mucho.", accept: ["Nos reímos muchísimo."] }
  ],
  translate: [
    { en: "I had an awful time at the concert.", es: "La pasé fatal en el concierto.", accept: ["La pasé [horrible|muy mal] en el concierto."] },
    { en: "We really enjoyed the dinner.", es: "Disfrutamos mucho la cena.", accept: ["Disfrutamos mucho de la cena."] },
    { en: "How was the trip for you all?", es: "¿Cómo la pasaron en el viaje?", accept: [] },
    { en: "It's fun to dance with you. (to a friend)", es: "Es divertido bailar contigo.", accept: [] },
    { en: "It's funny how you tell things. (to a friend)", es: "Es divertido que cuentes las cosas así.", accept: ["Es chistoso que cuentes las cosas así."] },
    { en: "Have a good time! (to a friend)", es: "¡Que la pases bien!", accept: ["¡Que la pases [rico|delicioso]!"] }
  ],
  register: [
    { es: "¡La pasamos delicioso!", en: "We had a wonderful time!", when: "very Colombian, and not only about food" },
    { es: "Estuvo muy chévere.", en: "It was really cool.", when: "everyday, about any plan" },
    { es: "La pasé muy bien.", en: "I had a very good time.", when: "anywhere, with anyone" },
    { es: "Disfrutamos mucho la velada.", en: "We thoroughly enjoyed the evening.", when: "formal, thanking a host in writing" }
  ],
  personal: {
    prompt: "Tell a friend about the last good weekend you had: how it went as a whole, and one moment you enjoyed.",
    constraints: [
      { type: "regex", pattern: "\\bla (pasé|pasamos|pasaste|pasaron|pasó)", label: "the whole thing: *la pasé* or *la pasamos*" },
      { type: "containsAny", words: ["me divertí", "nos divertimos", "me reí", "nos reímos", "disfruté", "disfrutamos"], label: "one moment: *me divertí*, *nos reímos* or *disfruté*" }
    ],
    model: "El fin de semana fuimos a Guatapé y la pasamos genial. Nos reímos muchísimo en el bote."
  },
  pitfalls: [
    "*Tuve un buen tiempo* is English in Spanish clothes: *la pasé bien*.",
    "*Pasé genial* drops the *la*: *la pasé genial*.",
    "*Lo pasé bien* is how Spain says it; in Colombia it's *la*."
  ]
},

"fn-admiracion-orgullo-b1": {
  source: "merged",
  hook: {
    line: "Your niece plays her first piano recital in Bogotá, and afterwards you want to say more than *qué bien*. You admire how she played, and you're proud of her.",
    es: "¡Es increíble cómo tocas!\nEstoy muy orgullosa de ti.",
    en: "It's amazing how you play!\nI'm so proud of you."
  },
  examples: [
    { es: "¡Qué bien cocinas!", en: "You cook so well!" },
    { es: "Es impresionante lo rápido que aprende.", en: "It's amazing how fast she learns." },
    { es: "Estamos orgullosos de que trabajes aquí.", en: "We're proud that you work here." }
  ],
  rule: "To admire how someone does it: *¡Es increíble cómo* and the ordinary form: *¡Es increíble cómo toca!* Keep the accent on *cómo*. Shorter: *¡Qué bien* and the verb: *¡Qué bien cocinas!*\nHow much: *¡Es impresionante cuánto sabe!* How fast or how well: *lo rápido que aprende*.\n*Estar orgulloso de* is proud of. Then a person (*de ti*), your own action (*de ser colombiano*), or *que* and the subjunctive for someone else's (*de que trabajes aquí*). It matches the person: *orgullosa*.\nCareful: *ser orgulloso* is proud in the bad sense, stuck-up.",
  readAndPick: [
    { q: "What is she admiring?", es: "¡Es increíble cómo baila Mariana!",
      options: ["That Mariana dances", "How Mariana dances", "Where Mariana dances"], answer: 1,
      why: "*Cómo* admires the way she dances, not just the fact." },
    { q: "Who works here?", es: "Estamos orgullosos de que trabajes aquí.",
      options: ["We do", "Everybody does", "You do"], answer: 2,
      why: "*Que trabajes*: your work, so *de que* and the subjunctive." },
    { q: "What does *es muy orgulloso* say about him?", es: "Mi tío es muy orgulloso.",
      options: ["He's stuck-up", "He's proud of us all", "He's very happy today"], answer: 0,
      why: "*Ser orgulloso* describes a proud, stuck-up person. Pride in someone is *estar*." },
    { q: "What is impressive?", es: "Es impresionante lo rápido que aprende.",
      options: ["That she learns at all", "How fast she learns", "How much she sleeps"], answer: 1,
      why: "*Lo rápido que* admires the speed itself." },
    { q: "How does this sound?", es: "¡Qué maravilla de casa!",
      options: ["A complaint", "Plain admiration", "Sarcasm"], answer: 1,
      why: "*¡Qué maravilla de...!* is open admiration, no verb needed." }
  ],
  yourTurn: [
    { en: "It's amazing how you play! (to a friend)", es: "¡Es increíble cómo tocas!", accept: [] },
    { en: "I'm so proud of you. (to a friend)", es: "Estoy muy orgulloso de ti.", accept: ["Estoy muy orgullosa de ti."] },
    { en: "You cook so well! (to a friend)", es: "¡Qué bien cocinas!", accept: [] },
    { en: "It's amazing how much he knows!", es: "¡Es impresionante cuánto sabe!", accept: ["¡Es increíble cuánto sabe!"] }
  ],
  translate: [
    { en: "I'm proud to be Colombian.", es: "Estoy orgulloso de ser colombiano.", accept: ["Estoy orgullosa de ser colombiana."] },
    { en: "We're proud that you work here. (to a friend)", es: "Estamos orgullosos de que trabajes aquí.", accept: ["Estamos orgullosos de que trabajes acá."] },
    { en: "It's amazing how fast she learns.", es: "Es impresionante lo rápido que aprende.", accept: ["Es increíble lo rápido que aprende."] },
    { en: "I'm very impressed with your work. (to a friend)", es: "Estoy muy impresionado con tu trabajo.", accept: ["Estoy muy impresionada con tu trabajo."] },
    { en: "What a wonderful house!", es: "¡Qué maravilla de casa!", accept: [] },
    { en: "I'm not proud of that.", es: "No estoy orgulloso de eso.", accept: ["No estoy orgullosa de eso."] }
  ],
  register: [
    { es: "¡Qué lindo!", en: "How lovely!", when: "warm and everyday, very common in Colombia" },
    { es: "¡Qué bien lo haces!", en: "You do it so well!", when: "direct praise, to a friend" },
    { es: "¡Es increíble cómo lo hace!", en: "It's amazing how she does it!", when: "admiring the way, not just the result" },
    { es: "Te felicito, de verdad.", en: "Well done, really.", when: "sincere praise, to anyone you call tú" },
    { es: "Su trabajo es digno de admiración.", en: "Your work is admirable.", when: "formal, in a speech or a letter" }
  ],
  personal: {
    prompt: "Think of someone you admire: a friend, a relative, a colleague. Write one line admiring how they do something, and one saying you're proud of them.",
    constraints: [
      { type: "regex", pattern: "(incre[ií]ble|impresionante) (c[oó]mo|cu[aá]nto|lo )|qu[eé] bien [a-záéíóúñ]+", label: "admire how: *es increíble cómo* or *¡qué bien...!*" },
      { type: "regex", pattern: "orgullos[oa]s? de", label: "proud of: *orgulloso de*" }
    ],
    model: "Es increíble cómo mi abuela cuida a toda la familia. Estoy muy orgullosa de ella."
  },
  pitfalls: [
    "*Es increíble como toca* loses the accent: it is still the how word, *cómo*.",
    "*Soy orgulloso de ti* says the wrong thing: pride in someone is *estoy orgulloso de ti*.",
    "*Orgulloso que trabajes* drops the *de*: *orgulloso de que trabajes*."
  ]
},

"fn-afecto-b1": {
  source: "merged",
  hook: {
    line: "Your partner's family in Barranquilla has adopted you, and you want to say what you feel without sounding translated: who you like, who you love, and who you miss when you're away.",
    es: "Tu familia me cae muy bien.\nY a ti te extraño cuando no estás.",
    en: "I really like your family.\nAnd I miss you when you're not here."
  },
  examples: [
    { es: "Me caen súper bien tus primos.", en: "I really like your cousins." },
    { es: "Me enamoré de ella apenas la vi.", en: "I fell in love with her as soon as I saw her." },
    { es: "Mi amor, ¿ya estás lista?", en: "Honey, are you ready yet?" }
  ],
  rule: "*Me cae bien* is how you like a person, and it works like *gustar*: the person is the subject. *Tu hermano me cae bien.* *Me caen bien tus amigos.* *Me cae mal* is the opposite.\n*Te quiero* is love for family, friends and partners. *Te amo* is stronger, and mostly romantic.\n*Me enamoré de* is the moment; *estoy enamorado de* is the state. Both take *de*.\n*Extrañar* is to miss: *Te extraño.* *Extraño a mi abuela*, with *a* for a person.\nTo call someone you love: *mi amor*, *mi vida*, *corazón*. In Colombia you'll hear them from shopkeepers too.",
  readAndPick: [
    { q: "Why *caen* and not *cae*?", es: "Me caen muy bien tus amigos.",
      options: ["It agrees with *me*", "It agrees with *amigos*", "It's in the past"], answer: 1,
      why: "Like *gustar*, the people liked are the subject, and *amigos* is plural." },
    { q: "Is this the moment or the state?", es: "Estoy enamorado de ella desde hace años.",
      options: ["The moment he fell", "A wish for later", "The state he's in"], answer: 2,
      why: "*Estoy enamorado*: the state, which has lasted years." },
    { q: "Who does the missing?", es: "Mis papás me extrañan mucho.",
      options: ["My parents do", "I do", "We all do"], answer: 0,
      why: "*Extrañan* goes with *mis papás*; *me* is the one they miss." },
    { q: "Who is she talking to?", es: "Mi amor, ¿ya estás lista?",
      options: ["Her boss", "Someone she loves", "A stranger on the bus"], answer: 1,
      why: "*Mi amor* is how you call someone you love." },
    { q: "How strong is it?", es: "Te amo.",
      options: ["Deep, romantic love", "Polite liking", "Friendly thanks"], answer: 0,
      why: "*Te amo* is stronger than *te quiero*, and mostly romantic." }
  ],
  yourTurn: [
    { en: "I really like your brother. (to a friend)", es: "Tu hermano me cae muy bien.", accept: ["Me cae muy bien tu hermano."] },
    { en: "I miss you a lot. (to a friend)", es: "Te extraño mucho.", accept: [] },
    { en: "I fell in love with her as soon as I saw her.", es: "Me enamoré de ella apenas la vi.", accept: ["Me enamoré de ella [en cuanto|cuando] la vi."] },
    { en: "I don't like the neighbours.", es: "Los vecinos me caen mal.", accept: ["Me caen mal los vecinos."] }
  ],
  translate: [
    { en: "He's deeply in love with her.", es: "Está profundamente enamorado de ella.", accept: [] },
    { en: "I miss my grandmother.", es: "Extraño a mi abuela.", accept: [] },
    { en: "We fell in love at university.", es: "Nos enamoramos en la universidad.", accept: [] },
    { en: "I love you so much. (to a friend)", es: "Te quiero muchísimo.", accept: [] },
    { en: "Honey, are you ready yet?", es: "Mi amor, ¿ya estás lista?", accept: ["Mi amor, ¿ya estás listo?"] },
    { en: "I miss living there.", es: "Extraño vivir allá.", accept: [] }
  ],
  register: [
    { es: "Me cae bien.", en: "I like him.", when: "how a person strikes you, anywhere" },
    { es: "Te quiero mucho.", en: "I love you a lot.", when: "family and close friends" },
    { es: "Te amo.", en: "I love you.", when: "a partner, or very deep love" },
    { es: "Te extraño, mi amor.", en: "I miss you, honey.", when: "a partner who is far away" },
    { es: "Le tengo mucho cariño.", en: "I'm very fond of her.", when: "calm affection, for an older relative or friend" }
  ],
  personal: {
    prompt: "Write two lines to someone you love who is far away: one saying you miss them, one about someone you've met there that you like.",
    constraints: [
      { type: "regex", pattern: "\\b(te|lo|la|los|las) extraño\\b|extraño a ", label: "you miss them: *te extraño*" },
      { type: "regex", pattern: "\\b(me|nos) caen? (muy |súper )?bien", label: "someone you like: *me cae bien*" }
    ],
    model: "Te extraño mucho, mi amor. Mis compañeros de trabajo me caen muy bien."
  },
  pitfalls: [
    "*Me cae bien tus amigos* agrees with the wrong thing: the friends are the subject, *me caen bien*.",
    "*Me enamoré con ella* borrows the English with: *me enamoré de ella*.",
    "*Echar de menos* is how Spain says I miss you. In Colombia it's *extrañar*."
  ]
},

"fn-tristeza-afliccion-b1": {
  source: "merged",
  hook: {
    line: "Your best friend from your Spanish class is moving back to Lima next month. You're happy for her and sad for you, and Spanish has a word for each kind of sad.",
    es: "Me da mucha pena que te vayas.\nMe pongo triste cada vez que lo pienso.",
    en: "It makes me so sad that you're leaving.\nI get sad every time I think about it."
  },
  examples: [
    { es: "Últimamente estoy un poco deprimido.", en: "I've been feeling a bit down lately." },
    { es: "¡Qué lástima que no puedas venir!", en: "What a shame you can't come!" },
    { es: "Lamento mucho su pérdida.", en: "I'm very sorry for your loss." }
  ],
  rule: "A state right now: *Estoy triste.* *Estoy un poco deprimida.* *Me siento mal.*\nA reaction each time something happens: *Me pongo triste cuando* and the ordinary form: *Me pongo triste cuando escucho esa canción.*\nSad about someone else's news: *Me da pena que* and the subjunctive: *Me da pena que te vayas.* *Lástima* means the same.\nA quick reaction: *¡Qué pena que...!* *¡Qué lástima que...!* *Es una lástima que...*\nCareful: in Colombia, *me da pena* with the dictionary form often means I'm embarrassed: *Me da pena hablar en público.* *Lástima* is always sadness.\nFor a death, formally: *Lamento mucho su pérdida.*",
  readAndPick: [
    { q: "Does this happen once or every time?", es: "Me pongo triste cuando escucho esa canción.",
      options: ["Once, last night", "Every time she hears it", "Never again"], answer: 1,
      why: "*Me pongo triste cuando*: a reaction that comes back each time." },
    { q: "What does she feel?", es: "Me da pena hablar delante de todos.",
      options: ["Sad for somebody", "Angry at everyone", "Embarrassed to speak"], answer: 2,
      why: "In Colombia, *me da pena* and the dictionary form is usually embarrassment." },
    { q: "Who can't come?", es: "¡Qué lástima que no puedas venir!",
      options: ["You", "The speaker", "Nobody at all"], answer: 0,
      why: "*Que no puedas*: you can't, so *que* and the subjunctive." },
    { q: "Where would you say this?", es: "Lamento mucho su pérdida.",
      options: ["At a birthday", "At a funeral", "At a job interview"], answer: 1,
      why: "*Lamento su pérdida* is for a death: formal and kind." },
    { q: "What is the speaker's state?", es: "Últimamente estoy un poco deprimida.",
      options: ["Angry since today", "Happy again now", "A bit down lately"], answer: 2,
      why: "*Estoy deprimida*: a state, and *últimamente* says it has lasted a while." }
  ],
  yourTurn: [
    { en: "It makes me so sad that you're leaving. (to a friend)", es: "Me da mucha pena que te vayas.", accept: ["Me da mucha [tristeza|lástima] que te vayas."] },
    { en: "What a shame you can't come! (to a friend)", es: "¡Qué lástima que no puedas venir!", accept: ["¡Qué pena que no puedas venir!"] },
    { en: "I get sad when I think about it.", es: "Me pongo triste cuando lo pienso.", accept: ["Me pongo triste cuando pienso en eso."] },
    { en: "I've been feeling a bit down lately.", es: "Últimamente estoy un poco deprimido.", accept: ["Últimamente estoy un poco deprimida."] }
  ],
  translate: [
    { en: "I'm very sorry for your loss. (polite)", es: "Lamento mucho su pérdida.", accept: [] },
    { en: "It's a shame they're closing the café.", es: "Es una lástima que cierren el café.", accept: ["Es una pena que cierren el café."] },
    { en: "It makes me very sad to see her like that.", es: "Me da mucha tristeza verla así.", accept: ["Me da mucha pena verla así."] },
    { en: "I'm embarrassed to speak in public.", es: "Me da pena hablar en público.", accept: ["Me da vergüenza hablar en público."] },
    { en: "I haven't been feeling well since yesterday.", es: "Me siento mal desde ayer.", accept: ["Desde ayer me siento mal."] }
  ],
  register: [
    { es: "¡Qué pesar!", en: "How sad!", when: "Colombian, warm sympathy for bad news" },
    { es: "¡Qué pena!", en: "What a shame!", when: "a quick reaction, with anyone" },
    { es: "Me da mucha tristeza.", en: "It makes me very sad.", when: "plain, when it really hurts" },
    { es: "Lo siento mucho.", en: "I'm so sorry.", when: "for someone's bad news, anywhere" },
    { es: "Mi más sentido pésame.", en: "My deepest condolences.", when: "for a death, formal or written" }
  ],
  personal: {
    prompt: "Someone you know has bad news, or is leaving. Write one line about how you feel, and one reaction to their news.",
    constraints: [
      { type: "containsAny", words: ["me pongo triste", "estoy triste", "me siento", "me da tristeza", "me da pena"], label: "how you feel: *me pongo triste* or *me da pena*" },
      { type: "containsAny", words: ["qué pena que", "qué lástima que", "me da pena que", "es una lástima que", "me da tristeza que", "me da mucha pena que"], label: "their news: *qué lástima que* and the subjunctive" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive for their news" }
    ],
    model: "Me pongo triste cuando pienso en el viaje. ¡Qué lástima que te vayas tan pronto!"
  },
  pitfalls: [
    "*Me da pena que estás sola* keeps the ordinary form: someone else's news takes *estés*.",
    "*Tengo pena* is not how sadness works here: it is given to you, *me da pena*.",
    "In Colombia *me da pena hablar* is embarrassment. For pure sadness, *tristeza* or *lástima*."
  ]
},

"fn-me-duele-b1": {
  source: "merged",
  hook: {
    line: "Your oldest friend forgot your birthday, and then said it was no big deal. It isn't your head that hurts, and Spanish uses the same verb anyway.",
    es: "Me duele que digas eso.\nPara mí sí es importante.",
    en: "It hurts that you say that.\nTo me it really matters."
  },
  examples: [
    { es: "Me duele mucho su actitud.", en: "Her attitude really hurts me." },
    { es: "Me duele no poder ayudarte más.", en: "It hurts that I can't help you more." },
    { es: "Me dolió mucho lo que pasó.", en: "What happened hurt me a lot." }
  ],
  rule: "It is the grammar of *me duele la cabeza*: what hurts is the subject, and *me*, *te*, *le* say who feels it.\nA thing that hurts: *Me duele su actitud.* With several things, *duelen*: *Me duelen sus palabras.*\nYour own inability: the dictionary form. *Me duele no poder ayudarte.*\nSomeone else's action: *que* and the subjunctive, and the verb stays *duele*. *Me duele que no me llames.*\nFor something that is over: *Me dolió mucho lo que dijo.*\nIt is heavier than *me da pena*: it is about hurt, not only sadness.",
  readAndPick: [
    { q: "Whose attitude hurts?", es: "Me duele mucho tu actitud.",
      options: ["Mine", "Nobody's", "Yours"], answer: 2,
      why: "*Tu actitud*: your attitude is what hurts." },
    { q: "Why *duelen* here?", es: "Me duelen sus palabras.",
      options: ["It agrees with *palabras*", "It agrees with *me*", "It's in the past"], answer: 0,
      why: "What hurts is the subject, and *palabras* is plural." },
    { q: "What hurts her?", es: "Me duele no poder ayudarte.",
      options: ["That you won't help", "That she can't help", "Her back"], answer: 1,
      why: "No *que*, just *no poder*: her own inability." },
    { q: "Is this about the body?", es: "Me duele que no confíes en mí.",
      options: ["Yes, a pain somewhere", "No, hurt feelings", "Yes, a headache"], answer: 1,
      why: "Same verb as a headache, but here it's about trust." },
    { q: "When did it hurt?", es: "Me dolió mucho lo que dijiste.",
      options: ["When it was said", "It hurts every day", "It will hurt later"], answer: 0,
      why: "*Dolió* is the plain past: it hurt when you said it." }
  ],
  yourTurn: [
    { en: "It hurts that you say that. (to a friend)", es: "Me duele que digas eso.", accept: [] },
    { en: "It hurts that I can't help you. (to a friend)", es: "Me duele no poder ayudarte.", accept: [] },
    { en: "Her attitude really hurts me.", es: "Me duele mucho su actitud.", accept: [] },
    { en: "What he said hurt me a lot.", es: "Me dolió mucho lo que dijo.", accept: [] }
  ],
  translate: [
    { en: "It hurts that you don't trust me. (to a friend)", es: "Me duele que no confíes en mí.", accept: [] },
    { en: "Their silence hurts us.", es: "Nos duele su silencio.", accept: [] },
    { en: "It really hurts me to see you like this. (to a friend)", es: "Me duele mucho verte así.", accept: [] },
    { en: "My head hurts.", es: "Me duele la cabeza.", accept: [] },
    { en: "Does it hurt you that they don't call? (to a friend)", es: "¿Te duele que no llamen?", accept: ["¿Te duele que no te llamen?"] }
  ],
  register: [
    { es: "Eso me dolió.", en: "That hurt.", when: "direct, to the person who said it" },
    { es: "Me duele que pienses así.", en: "It hurts that you think that way.", when: "honest but calm, with someone close" },
    { es: "Me sentí muy mal con lo que pasó.", en: "I felt really bad about what happened.", when: "softer, without blaming anyone" },
    { es: "Nos duele profundamente esta decisión.", en: "This decision pains us deeply.", when: "formal, in a statement or a letter" }
  ],
  personal: {
    prompt: "Write calmly to someone who hurt you: say what hurts, and one thing you can't do that hurts you too.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "me duele que", label: "what they do: *me duele que* and the subjunctive" },
      { type: "regex", pattern: "duele no [a-záéíóúñ]+(ar|er|ir)\\b", label: "your own: *me duele no poder* and the dictionary form" }
    ],
    model: "Me duele que no me escuches. Y me duele no poder hablar contigo como antes."
  },
  pitfalls: [
    "*Me duele que no puedo ayudarte* adds a *que*: for your own inability, *me duele no poder ayudarte*.",
    "*Yo duelo* turns it around: what hurts is the subject, *me duele*.",
    "*Me duele que dices eso* keeps the ordinary form: *que digas*."
  ]
},

"task-b1-alegria": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: something good that really happened, told so the size of your reaction fits the size of the news. Too big for small news sounds sarcastic.",
    es: "Cuando me llamó, no sabes la emoción que me dio.",
    en: "When she called me, you have no idea how excited I was."
  },
  examples: [
    { es: "Estoy orgullosísima de ella.", en: "I'm so proud of her." },
    { es: "Me encantó ver a toda la familia otra vez.", en: "I loved seeing the whole family again." }
  ],
  rule: "The skill is the size of the reaction.\nSmall news: *¡Qué bien!* *Me alegro.*\nBigger: *Me alegro muchísimo.* *¡Qué alegría!*\nHuge: *No sabes cuánto me alegro.* *No sabes la emoción que me dio.*\nTurn a word up with *-ísimo*: *orgullosísima*, *contentísimo*.\nTell it in order: what happened, how you heard, how you reacted, how the others reacted.\nUse the pasts you know: *Me llamó*, *lloré*, *lo celebramos* for events; *estaba nerviosa*, *hacía años que no...* for how things were.\nThe biggest phrase for small news reads as sarcasm, so match it to the news.",
  readAndPick: [
    { q: "How big is this reaction?", es: "No sabes cuánto me alegro.",
      options: ["Small, polite", "Huge", "Sarcastic"], answer: 1,
      why: "*No sabes cuánto* is the top of the scale, for big news." },
    { q: "What does *-ísima* add?", es: "Estoy orgullosísima de ella.",
      options: ["It makes it formal", "It means very", "It makes it past"], answer: 1,
      why: "*-ísima* turns *orgullosa* all the way up: so proud." },
    { q: "What happens if you say this about a free coffee?", es: "¡No sabes la emoción que me dio!",
      options: ["It sounds formal", "It sounds shy", "It sounds sarcastic"], answer: 2,
      why: "A huge reaction to small news reads as a joke at its expense." },
    { q: "What is she describing?", es: "Hacía años que no nos reuníamos todos.",
      options: ["How things were", "A plan for later", "A single moment"], answer: 0,
      why: "*Hacía* and *nos reuníamos* set the scene: how things had been." },
    { q: "What happened?", es: "Lloré de la emoción, la verdad.",
      options: ["She stopped crying", "She cried every day", "She cried from joy"], answer: 2,
      why: "*Lloré de la emoción*: she cried because she was so moved." }
  ],
  yourTurn: [
    { en: "You have no idea how glad I am. (to a friend)", es: "No sabes cuánto me alegro.", accept: [] },
    { en: "I'm so proud of her.", es: "Estoy orgullosísimo de ella.", accept: ["Estoy orgullosísima de ella.", "Estoy muy [orgulloso|orgullosa] de ella."] },
    { en: "I loved seeing them again.", es: "Me encantó verlos otra vez.", accept: ["Me encantó verlos de nuevo."] },
    { en: "We celebrated it with the whole family.", es: "Lo celebramos con toda la familia.", accept: [] }
  ],
  translate: [
    { en: "Last month my sister passed the exam for the public university.", es: "El mes pasado mi hermana pasó el examen de la universidad pública.", accept: ["El mes pasado mi hermana pasó el examen [de|para] la universidad pública."] },
    { en: "When she called me, I cried from the excitement.", es: "Cuando me llamó, lloré de la emoción.", accept: [] },
    { en: "It had been years since we'd all got together.", es: "Hacía años que no nos reuníamos todos.", accept: ["Hacía años que no nos juntábamos todos."] },
    { en: "My mom was even more excited than me.", es: "Mi mamá estaba todavía más emocionada que yo.", accept: ["Mi mamá estaba aún más emocionada que yo."] },
    { en: "What great news!", es: "¡Qué buena noticia!", accept: ["¡Qué noticia tan buena!"] }
  ],
  register: [
    { es: "¡Qué bueno!", en: "Great!", when: "small good news, every day" },
    { es: "¡Me alegro un montón!", en: "I'm so glad!", when: "real news, with friends" },
    { es: "¡No sabes cuánto me alegro!", en: "You have no idea how glad I am!", when: "big news, said with feeling" },
    { es: "¡Felicitaciones!", en: "Congratulations!", when: "anyone's success, the Colombian word" }
  ],
  personal: {
    prompt: "Write about something good that happened to you or someone close: what happened, how you heard, and how you and the others reacted. Eight sentences or more.",
    constraints: [
      { type: "minSentences", n: 8, label: "eight sentences or more" },
      { type: "containsAny", words: ["me alegr", "qué alegría", "orgullos", "contento", "contenta", "encant", "emoción", "feliz"], label: "a feeling: *me alegro*, *orgulloso*, *feliz*..." },
      { type: "regex", pattern: "ísim[oa]s?\\b|no sabes cu[aá]nto", label: "one turned up: *-ísimo* or *no sabes cuánto*" },
      { type: "anyVerbInTense", tense: "preterito", label: "what happened, in the past" }
    ],
    model: "El mes pasado mi hermana pasó el examen de la universidad pública. Estudió dos años para ese examen. Cuando me llamó, no sabes la emoción que me dio. Lloré de la emoción, la verdad. Mi mamá estaba todavía más emocionada que yo. Le dije a mi hermana que estaba orgullosísima de ella. Lo celebramos el sábado con toda la familia. Hacía años que no nos reuníamos todos."
  },
  pitfalls: [
    "The biggest phrase for small news reads as sarcasm: match the size of the reaction to the news.",
    "*Me hizo mucha ilusión* is how Spain says it. In Colombia: *no sabes la emoción que me dio*, or *me puse feliz*."
  ]
},

/* ---- unit b1-u34 · When it goes wrong ------------------------------------ */

"fn-enfado-indignacion-b1": {
  source: "merged",
  hook: {
    line: "Your landlord in Bogotá kept your deposit for a scratch that was already there. You're angry, and Colombians will want to know two things: angry with whom, and about what.",
    es: "Estoy brava con el dueño por lo del depósito.\n¡Qué rabia!",
    en: "I'm angry with the landlord about the deposit.\nHow infuriating!"
  },
  examples: [
    { es: "Me da rabia que no me contesten.", en: "It makes me mad that they don't answer me." },
    { es: "Se enojó con su hermano por el carro.", en: "He got angry with his brother about the car." },
    { es: "Hoy estoy de mal genio.", en: "I'm in a bad mood today." }
  ],
  rule: "Anger has two parts, who and why: *con* for the person, *por* for the reason. *Estoy brava con el dueño por el depósito.*\nThe state: *estar bravo*, everyday in Colombia, or *estar enojado*. The moment it starts: *me puse bravo*, *me enojé*.\nA mood aimed at nobody: *estoy de mal genio*.\nSomeone else's action: *Me da rabia que* and the subjunctive. On its own: *¡Qué rabia!*\nStrongest: *furioso*, or *furiosísimo*. The *-ísimo* is already the top, so never *muy furiosísimo*.\nFormal outrage: *Nos indigna que* and the subjunctive.",
  readAndPick: [
    { q: "Who is she angry with?", es: "Está brava conmigo por la torta.",
      options: ["With the cake", "With me", "With herself"], answer: 1,
      why: "*Con* names the person, *conmigo*. *Por la torta* is the reason." },
    { q: "Is this the state or the moment?", es: "Me puse bravo cuando lo vi.",
      options: ["The moment it began", "How he always is with people", "A plan for later"], answer: 0,
      why: "*Me puse bravo*: the moment the anger started." },
    { q: "What does *mal genio* describe?", es: "Hoy estoy de mal genio.",
      options: ["A clever idea", "Anger at one person", "A bad mood"], answer: 2,
      why: "*De mal genio* is a mood, aimed at nobody in particular." },
    { q: "Why no *muy* here?", es: "Estoy furiosísima con esta situación.",
      options: ["*-ísima* is already the top", "It's too informal for *muy*", "It's in the past"], answer: 0,
      why: "*-ísima* already means as far as it goes, so *muy* has nowhere to go." },
    { q: "Where would you read this?", es: "Nos indigna que no se respeten los derechos de los vecinos.",
      options: ["A text to your sister", "A love letter to her husband", "A neighbours' statement"], answer: 2,
      why: "*Nos indigna que* is formal outrage, for a public statement." }
  ],
  yourTurn: [
    { en: "I'm angry with the landlord.", es: "Estoy bravo con el dueño.", accept: ["Estoy [bravo|brava|enojado|enojada] con el dueño."] },
    { en: "It makes me mad that they don't answer me.", es: "Me da rabia que no me contesten.", accept: ["Me da rabia que no me respondan."] },
    { en: "He got angry with his brother.", es: "Se enojó con su hermano.", accept: ["Se puso bravo con su hermano."] },
    { en: "I'm in a bad mood today.", es: "Hoy estoy de mal genio.", accept: ["Estoy de mal genio hoy.", "Hoy estoy de mal humor."] }
  ],
  translate: [
    { en: "How infuriating!", es: "¡Qué rabia!", accept: [] },
    { en: "She's angry with me about the cake.", es: "Está brava conmigo por la torta.", accept: ["Está enojada conmigo por la torta."] },
    { en: "I got furious when I found out it was all a lie.", es: "Me puse furioso cuando supe que todo era mentira.", accept: ["Me puse [furioso|furiosa] cuando [supe|descubrí] que todo era mentira."] },
    { en: "Are you angry with me? (to a friend)", es: "¿Estás bravo conmigo?", accept: ["¿Estás [brava|enojado|enojada] conmigo?"] },
    { en: "We're outraged that they don't respect the neighbours.", es: "Nos indigna que no respeten a los vecinos.", accept: [] }
  ],
  register: [
    { es: "¡Qué rabia!", en: "How infuriating!", when: "a quick burst, with friends" },
    { es: "Estoy muy brava.", en: "I'm really angry.", when: "everyday Colombian, with anyone close" },
    { es: "Estoy molesto por la situación.", en: "I'm annoyed about the situation.", when: "calmer, at work or with strangers" },
    { es: "Me parece inaceptable.", en: "I find it unacceptable.", when: "a formal complaint, written or to a manager" },
    { es: "Nos indigna esta decisión.", en: "This decision outrages us.", when: "a public statement, formal" }
  ],
  personal: {
    prompt: "Something made you angry recently. Say who you were angry with and why, and one thing someone does that makes you mad.",
    constraints: [
      { type: "regex", pattern: "(brav[oa]s?|enojad[oa]s?|furios[oa]s?) con\\b", label: "who: *bravo con* or *enojado con*" },
      { type: "regex", pattern: "\\bpor (el|la|los|las|lo|que|eso)\\b", label: "why: *por* and the reason" },
      { type: "subjunctiveAfter", trigger: "me da rabia que", label: "*me da rabia que* and the subjunctive" }
    ],
    model: "Ayer me puse brava con mi vecino por el ruido. Me da rabia que ponga música a las dos de la mañana."
  },
  pitfalls: [
    "*Estoy bravo a Tomás* borrows the English at: the person takes *con*.",
    "*Estoy bravo con el ruido* uses *con* for a reason: *por el ruido*.",
    "*Enfadado* is how Spain says it. In Colombia: *bravo* or *enojado*."
  ]
},

"fn-miedo-ansiedad-preocupacion-b1": {
  source: "merged",
  hook: {
    line: "Your younger brother just got his driving licence and wants to take the car to the coast at night. You're scared, and you need to say what scares you without sounding dramatic.",
    es: "Me da miedo que manejes de noche.\nY me preocupa que vayas solo.",
    en: "It scares me that you'll drive at night.\nAnd it worries me that you're going alone."
  },
  examples: [
    { es: "Me dan miedo las alturas.", en: "Heights scare me." },
    { es: "Estoy preocupada por el examen.", en: "I'm worried about the exam." },
    { es: "Me pone nervioso hablar en público.", en: "Speaking in public makes me nervous." }
  ],
  rule: "Fear comes two ways.\nYou have it: *Tengo miedo de* plus a thing or the dictionary form. *Tengo miedo de perder el trabajo.*\nIt is given to you, like *gustar*: *Me da miedo manejar.* With a plural thing, *dan*: *Me dan miedo las alturas.*\nWorry works the second way: *Me preocupa el examen.* Or with *estar*: *Estoy preocupado por el examen.*\nSomeone else's action takes *que* and the subjunctive after any of them: *Me da miedo que manejes.* *Tengo miedo de que no vuelvas.*\nNerves: *Me pone nervioso* plus the cause. *Me pone nerviosa la entrevista.*\nAfter a scare: *¡Qué susto!*",
  readAndPick: [
    { q: "Why *dan*?", es: "Me dan miedo las arañas.",
      options: ["It agrees with *me*", "It agrees with *arañas*", "It's a command"], answer: 1,
      why: "What scares you is the subject, and *arañas* is plural." },
    { q: "Who is driving?", es: "Me da miedo que manejes tan rápido.",
      options: ["You are", "The speaker is", "Nobody yet"], answer: 0,
      why: "*Que manejes*: your driving, so *que* and the subjunctive." },
    { q: "What is she worried about?", es: "Estoy preocupada por mi mamá.",
      options: ["Her job", "Herself", "Her mom"], answer: 2,
      why: "*Preocupada por*: worried about, and the worry is her mom." },
    { q: "What makes him nervous?", es: "Me ponen nervioso las reuniones con el jefe.",
      options: ["One meeting", "Meetings with the boss", "The boss's whole family at home"], answer: 1,
      why: "*Ponen* agrees with *las reuniones*: meetings, plural." },
    { q: "When would you say this?", es: "¡Qué susto!",
      options: ["After a fright", "After good news", "Before a meal"], answer: 0,
      why: "*¡Qué susto!* is what a scare leaves behind: what a fright!" }
  ],
  yourTurn: [
    { en: "Heights scare me.", es: "Me dan miedo las alturas.", accept: [] },
    { en: "It scares me that you drive so fast. (to a friend)", es: "Me da miedo que manejes tan rápido.", accept: [] },
    { en: "I'm worried about the exam.", es: "Estoy preocupado por el examen.", accept: ["Estoy preocupada por el examen.", "Me preocupa el examen."] },
    { en: "I'm afraid of losing my job.", es: "Tengo miedo de perder el trabajo.", accept: ["Tengo miedo de perder [el|mi] trabajo.", "Me da miedo perder [el|mi] trabajo."] }
  ],
  translate: [
    { en: "It worries me that he doesn't call.", es: "Me preocupa que no llame.", accept: [] },
    { en: "I'm afraid you won't come back. (to a friend)", es: "Tengo miedo de que no vuelvas.", accept: ["Me da miedo que no vuelvas."] },
    { en: "The interview makes me nervous.", es: "Me pone nervioso la entrevista.", accept: ["Me pone nerviosa la entrevista.", "La entrevista me pone [nervioso|nerviosa]."] },
    { en: "What a fright! I thought it was a thief.", es: "¡Qué susto! Pensé que era un ladrón.", accept: ["¡Qué susto! Creí que era un ladrón."] },
    { en: "Does driving at night scare you? (to a friend)", es: "¿Te da miedo manejar de noche?", accept: [] },
    { en: "We are deeply concerned about the situation.", es: "Nos preocupa profundamente la situación.", accept: ["Nos preocupa mucho la situación."] }
  ],
  register: [
    { es: "¡Qué susto!", en: "What a fright!", when: "right after a scare" },
    { es: "Me da miedo.", en: "It scares me.", when: "plain and honest, with anyone" },
    { es: "Estoy un poco preocupado.", en: "I'm a bit worried.", when: "calm, so nobody gets alarmed" },
    { es: "Estoy muerta de miedo.", en: "I'm scared to death.", when: "with friends, exaggerating for effect" },
    { es: "Nos preocupa la situación.", en: "We're concerned about the situation.", when: "formal, in a statement or an email" }
  ],
  personal: {
    prompt: "Write about one fear you have, and one worry about someone close to you.",
    constraints: [
      { type: "containsAny", words: ["tengo miedo", "me da miedo", "me dan miedo"], label: "a fear: *tengo miedo de* or *me da miedo*" },
      { type: "subjunctiveAfter", trigger: "me preocupa que", label: "a worry: *me preocupa que* and the subjunctive" }
    ],
    model: "Me dan miedo los aviones. Me preocupa que mi papá trabaje tanto."
  },
  pitfalls: [
    "*Me da miedo las alturas* agrees with the wrong thing: heights are plural, *me dan miedo*.",
    "*Tengo miedo que no vuelvas* drops the *de*: *tengo miedo de que*.",
    "*Me hace nervioso* uses the wrong verb: a mood is put on you, *me pone nervioso*."
  ]
},

"fn-aversion-b1": {
  source: "merged",
  hook: {
    line: "Your new flatmate in Bogotá asks what bothers you, so you can live together in peace. Some things bother you a little and some you can't stand, and Spanish has a dial for one and a wall for the other.",
    es: "Me molesta un poco que dejes los platos sucios.\nPero no soporto que fumes adentro.",
    en: "It bothers me a bit when you leave the dishes dirty.\nBut I can't stand you smoking indoors."
  },
  examples: [
    { es: "Odio hacer fila.", en: "I hate standing in line." },
    { es: "No soporto el ruido de la construcción.", en: "I can't stand the construction noise." },
    { es: "¡Qué asco! Hay una cucaracha.", en: "Gross! There's a cockroach." }
  ],
  rule: "Two ways to complain, and only one has a volume knob.\n*Me molesta* comes in sizes: *un poco*, *bastante*, *muchísimo*. It works like *gustar*: *Me molestan los ruidos.*\n*Odio* and *no soporto* are already the top. No *un poco*: you can stand it, or you can't.\nAll three take a thing (*el ruido*), your own action with the dictionary form (*odio madrugar*), or someone else's with *que* and the subjunctive (*no soporto que me interrumpan*).\nFor a quick reaction: *¡Qué horror!* And for something gross: *¡Qué asco!*\nFormal: *Me resulta muy desagradable.*",
  readAndPick: [
    { q: "How much does it bother her?", es: "Me molesta un poco que hablen tan duro.",
      options: ["Not at all", "A little", "More than anything"], answer: 1,
      why: "*Un poco* sets the dial low: a small complaint." },
    { q: "Can you add *un poco* to this?", es: "No soporto que me griten.",
      options: ["Yes, to make it sound softer", "Only when writing", "No, it's already the top"], answer: 2,
      why: "*No soporto* has no sizes. For a little, use *me molesta un poco*." },
    { q: "Who does the interrupting?", es: "No soporto que me interrumpan.",
      options: ["Other people", "The speaker", "Nobody yet"], answer: 0,
      why: "*Que me interrumpan*: they interrupt, so *que* and the subjunctive." },
    { q: "When would you say this?", es: "¡Qué asco!",
      options: ["At good news", "At something gross", "At a nice view from a window"], answer: 1,
      why: "*¡Qué asco!* is disgust: something dirty, smelly or gross." },
    { q: "What does she hate?", es: "Odio madrugar los lunes.",
      options: ["Staying up late", "Mondays off work", "Getting up early"], answer: 2,
      why: "*Madrugar* is getting up early, and she hates it." }
  ],
  yourTurn: [
    { en: "I hate standing in line.", es: "Odio hacer fila.", accept: [] },
    { en: "I can't stand being interrupted.", es: "No soporto que me interrumpan.", accept: [] },
    { en: "It bothers me a bit that they talk so loudly.", es: "Me molesta un poco que hablen tan duro.", accept: ["Me molesta un poco que hablen tan [fuerte|alto]."] },
    { en: "Gross!", es: "¡Qué asco!", accept: [] }
  ],
  translate: [
    { en: "I can't stand the construction noise.", es: "No soporto el ruido de la construcción.", accept: ["No soporto el ruido de la obra."] },
    { en: "It really bothers me when you're late without warning. (to a friend)", es: "Me molesta mucho que llegues tarde sin avisar.", accept: ["Me molesta muchísimo que llegues tarde sin avisar."] },
    { en: "I hate getting up early on Mondays.", es: "Odio madrugar los lunes.", accept: [] },
    { en: "How awful, what a bad time you had! (to a friend)", es: "¡Qué horror, qué mal la pasaste!", accept: [] },
    { en: "I find that attitude very unpleasant.", es: "Me resulta muy desagradable esa actitud.", accept: ["Esa actitud me resulta muy desagradable."] }
  ],
  register: [
    { es: "¡Qué asco!", en: "Gross!", when: "something disgusting, among friends" },
    { es: "Me choca que me hablen así.", en: "I hate it when people talk to me like that.", when: "Colombian, casual and strong" },
    { es: "Me molesta un poco.", en: "It bothers me a bit.", when: "a mild complaint that leaves room to joke" },
    { es: "No soporto eso.", en: "I can't stand that.", when: "the limit, said firmly" },
    { es: "Me resulta bastante desagradable.", en: "I find it rather unpleasant.", when: "careful, at work or in writing" }
  ],
  personal: {
    prompt: "Write two lines for a new flatmate: one thing that bothers you a little, and one you can't stand.",
    constraints: [
      { type: "regex", pattern: "molestan? (un poco|bastante|mucho|much[ií]simo)", label: "something with a size: *me molesta un poco*" },
      { type: "containsAny", words: ["no soporto", "odio"], label: "the limit: *no soporto* or *odio*" }
    ],
    model: "Me molesta un poco que dejes la luz prendida. Pero no soporto que pongas música a las seis de la mañana."
  },
  pitfalls: [
    "*No soporto un poco* puts a size on a wall: for a little, *me molesta un poco*.",
    "*No soporto que me interrumpen* keeps the ordinary form: *que me interrumpan*.",
    "*Hacer cola* is how Spain says it. In Colombia you *hacer fila*."
  ]
},

"fn-aburrimiento-b1": {
  source: "merged",
  hook: {
    line: "It's a rainy Sunday in Bogotá and there's nothing to do. English says bored and boring with nearly the same word, and mixing them up in Spanish tells people you're a dull person.",
    es: "Me aburro muchísimo los domingos.\n¡Y qué pereza salir con esta lluvia!",
    en: "I get so bored on Sundays.\nAnd what a drag, going out in this rain!"
  },
  examples: [
    { es: "Esta serie me aburre.", en: "This series bores me." },
    { es: "Estoy aburrida, ¿hacemos algo?", en: "I'm bored, shall we do something?" },
    { es: "Me da pereza cocinar hoy.", en: "I can't be bothered to cook today." }
  ],
  rule: "Bored and boring are different words in Spanish.\n*Me aburro*: I get bored. *Me aburro en las reuniones largas.*\n*Estoy aburrido*: I'm bored right now. *Aburrida* for a woman.\n*Es aburrido*: it is boring, a quality. *La película es aburrida.* So *soy aburrido* would mean you're a dull person.\nThe cause can come first, like *gustar*: *Me aburre esta serie.* *Me aburren las reuniones.*\nFor something you can't be bothered to do, Colombians say *¡Qué pereza!*, or *me da pereza* and the dictionary form: *Me da pereza salir.*",
  readAndPick: [
    { q: "Is she bored or boring?", es: "Estoy aburrida.",
      options: ["A boring person", "Bored right now", "Bored of you"], answer: 1,
      why: "*Estoy* tells how she feels now. *Soy aburrida* would make her dull." },
    { q: "What is boring?", es: "Me aburren las reuniones tan largas.",
      options: ["Long meetings", "The speaker", "Short meetings"], answer: 0,
      why: "The cause comes first, like *gustar*: the long meetings bore her." },
    { q: "What does he mean?", es: "Me da pereza salir con esta lluvia.",
      options: ["He's afraid of the rain", "He'd love to go out", "He can't be bothered"], answer: 2,
      why: "*Me da pereza* is can't be bothered, the Colombian way." },
    { q: "What is she saying about herself?", es: "Me aburro los domingos por la tarde.",
      options: ["She gets bored then", "She bores people then", "She's boring on Sundays"], answer: 0,
      why: "*Me aburro*: it happens to her. Without *me*, she'd bore other people." },
    { q: "What does this say about Hernán?", es: "Hernán es muy aburrido.",
      options: ["He's bored today", "He's tired today", "He's a dull person"], answer: 2,
      why: "*Es aburrido* is a quality: he's dull, not just bored." }
  ],
  yourTurn: [
    { en: "I'm bored, shall we do something? (to a friend)", es: "Estoy aburrido, ¿hacemos algo?", accept: ["Estoy aburrida, ¿hacemos algo?"] },
    { en: "I get so bored on Sundays.", es: "Me aburro muchísimo los domingos.", accept: ["Los domingos me aburro muchísimo."] },
    { en: "This series bores me.", es: "Esta serie me aburre.", accept: ["Me aburre esta serie."] },
    { en: "I can't be bothered to cook today.", es: "Me da pereza cocinar hoy.", accept: ["Hoy me da pereza cocinar."] }
  ],
  translate: [
    { en: "The movie is boring.", es: "La película es aburrida.", accept: [] },
    { en: "What a drag!", es: "¡Qué pereza!", accept: [] },
    { en: "They get bored in history class.", es: "Se aburren en la clase de historia.", accept: ["Se aburren en clase de historia."] },
    { en: "Long meetings bore me.", es: "Me aburren las reuniones largas.", accept: [] },
    { en: "Do you get bored at home? (to a friend)", es: "¿Te aburres en la casa?", accept: ["¿Te aburres en casa?"] }
  ],
  register: [
    { es: "¡Qué pereza!", en: "What a drag!", when: "very Colombian, for anything you dread doing" },
    { es: "¡Qué jartera!", en: "How tedious!", when: "Colombian slang, among friends only" },
    { es: "Estoy aburrido.", en: "I'm bored.", when: "plain, anywhere" },
    { es: "La charla fue algo pesada.", en: "The talk was rather heavy going.", when: "polite, in a review or a report" }
  ],
  personal: {
    prompt: "Write about a moment that bores you every week, and one thing you can't be bothered to do.",
    constraints: [
      { type: "containsAny", words: ["me aburro", "me aburre", "me aburren", "estoy aburrid"], label: "boredom: *me aburro* or *me aburre*" },
      { type: "containsAny", words: ["qué pereza", "me da pereza"], label: "*¡qué pereza!* or *me da pereza*" }
    ],
    model: "Me aburro mucho en las reuniones de los lunes. Y me da pereza hacer mercado los domingos."
  },
  pitfalls: [
    "*Soy aburrido* says you're a dull person: for how you feel, *estoy aburrido*.",
    "*Aburro los domingos* drops the *me*: without it, you bore other people.",
    "*¡Qué rollo!* is how Spain says it. In Colombia: *¡qué pereza!*"
  ]
},

"fn-no-me-importa-b1": {
  source: "old",
  hook: {
    line: "Your friends are planning Saturday night and keep asking what you prefer: pizza or arepas, nine or ten. Honestly, you don't mind, and Spanish has a scale for that too.",
    es: "¿Pizza o arepas? Me da igual.\nY no me importa la hora.",
    en: "Pizza or arepas? I don't mind.\nAnd I don't care about the time."
  },
  examples: [
    { es: "No me importa esperar un rato más.", en: "I don't mind waiting a bit longer." },
    { es: "Me da igual si llueve o no.", en: "I don't mind whether it rains or not." },
    { es: "No me importa que lleguen tarde.", en: "I don't mind if they arrive late." }
  ],
  rule: "*No me importa* and *me da igual* both say you don't mind. They work like *gustar*.\nA thing: *Me da igual el sitio.* A choice: *¿Té o café? Me da igual.*\nYour own action, the dictionary form: *No me importa esperar.*\nSomeone else's action, *que* and the subjunctive: *No me importa que lleguen tarde.*\nWhether or not: *si* and the ordinary form. *Me da igual si llueve.*\nTo hand them the choice, kindly: *Como quieras.*\nWatch the volume: *No me importa nada* and *me importa un comino* say you don't care at all, and can sound cold.",
  readAndPick: [
    { q: "Is she annoyed?", es: "¿Té o café? Me da igual.",
      options: ["Yes, very", "No, either is fine", "Yes, a little annoyed by it"], answer: 1,
      why: "*Me da igual*: either one is fine with her." },
    { q: "Who might be late?", es: "No me importa que lleguen tarde.",
      options: ["They might", "The speaker", "Nobody"], answer: 0,
      why: "*Que lleguen*: their arrival, so *que* and the subjunctive." },
    { q: "Why *llueve* and not *llueva*?", es: "Me da igual si llueve o no.",
      options: ["It's about the past", "*Si* takes the ordinary form", "It's a command, not a statement"], answer: 1,
      why: "After *si*, whether, the verb stays ordinary." },
    { q: "How does this sound?", es: "Me importa un comino lo que dice.",
      options: ["Kind and patient", "Worried about it", "Cold: not at all"], answer: 2,
      why: "*Un comino* is a tiny seed: I couldn't care less." },
    { q: "What is he doing?", es: "Como quieras, tú decides.",
      options: ["Handing you the choice", "Refusing to go", "Choosing for you"], answer: 0,
      why: "*Como quieras* gives the choice away, kindly." }
  ],
  yourTurn: [
    { en: "Tea or coffee, I don't mind.", es: "Té o café, me da igual.", accept: ["Té o café, no me importa."] },
    { en: "I don't mind waiting a bit longer.", es: "No me importa esperar un rato más.", accept: ["No me importa esperar un poco más."] },
    { en: "I don't mind whether it rains or not.", es: "Me da igual si llueve o no.", accept: ["No me importa si llueve o no."] },
    { en: "Whatever you like. (to a friend)", es: "Como quieras.", accept: [] }
  ],
  translate: [
    { en: "I don't mind if they arrive late.", es: "No me importa que lleguen tarde.", accept: ["Me da igual que lleguen tarde."] },
    { en: "I don't care about the result, just taking part.", es: "No me importa el resultado, solo participar.", accept: ["Me da igual el resultado, solo participar."] },
    { en: "Whatever you like, you decide. (to a friend)", es: "Como quieras, tú decides.", accept: [] },
    { en: "The place doesn't matter to me.", es: "Me da igual el sitio.", accept: ["[Me da igual|No me importa] el [sitio|lugar]."] },
    { en: "It's all the same to me.", es: "Me da lo mismo.", accept: [] }
  ],
  register: [
    { es: "Me da igual.", en: "I don't mind.", when: "relaxed, with no preference" },
    { es: "Como quieras.", en: "Whatever you like.", when: "kind, handing over the choice" },
    { es: "Me da lo mismo.", en: "It's all the same to me.", when: "neutral, anywhere" },
    { es: "Me importa un comino.", en: "I couldn't care less.", when: "strong and cold, so use it with care" },
    { es: "Para mí es indiferente.", en: "It makes no difference to me.", when: "careful, at work or in a meeting" }
  ],
  personal: {
    prompt: "Your friends are choosing where to eat tonight. Say you don't mind about two things, and hand them the choice.",
    constraints: [
      { type: "containsAny", words: ["me da igual", "no me importa", "me da lo mismo"], label: "*me da igual* or *no me importa*" },
      { type: "containsAny", words: ["como quieras", "como quieran", "ustedes deciden", "tú decides"], label: "the choice handed over: *como quieras*" }
    ],
    model: "Me da igual el sitio y no me importa la hora. Como quieran, ustedes deciden."
  },
  pitfalls: [
    "*No me importa que vienen* keeps the ordinary form: someone else's action takes *vengan*.",
    "*Me importa un comino* is not a relaxed I don't mind: it says you don't care at all.",
    "*Yo no importo* turns it around: like *gustar*, *no me importa*."
  ]
},

"fn-sorpresa-extraneza-b1": {
  source: "old",
  hook: {
    line: "A coworker tells you that Andrés from accounting quit yesterday to open a bakery in Salento. You did not see that coming, and Spanish has a reaction for every size of surprise.",
    es: "¿En serio? ¡No me digas!\nMe sorprende que se vaya así, tan de repente.",
    en: "Seriously? You don't say!\nI'm surprised he's leaving like that, so suddenly."
  },
  examples: [
    { es: "¡Qué sorpresa verte por aquí!", en: "What a surprise to see you here!" },
    { es: "Es raro que no conteste.", en: "It's strange that he isn't answering." },
    { es: "Renunció al trabajo.\n¿De verdad?", en: "He quit his job.\nReally?" }
  ],
  rule: "Quick reactions need no verb: *¡Qué sorpresa!* *¡Qué raro!* *¡No me digas!* *¡No me lo puedo creer!*\nTo ask if it's true: *¿En serio?* or *¿De verdad?* *¿Ah, sí?* is milder, and said flat it can sound doubtful.\nFor the surprising fact, *me sorprende que*, *me extraña que* or *es raro que*, and the subjunctive: *Me sorprende que se vaya.* *Es raro que no conteste.* Even when it's true, it is held up as surprising.\nYour own experience takes the dictionary form: *¡Qué sorpresa verte!*\n*Me extraña* is surprise with a hint that something is off.",
  readAndPick: [
    { q: "What does she want?", es: "¿En serio?",
      options: ["Confirmation", "To end the chat", "To hear it again"], answer: 0,
      why: "*¿En serio?* asks if it's really true, the way seriously? does." },
    { q: "Is he really not answering?", es: "Es raro que no conteste.",
      options: ["No, he just did", "Yes, oddly", "Nobody has called"], answer: 1,
      why: "It's true, but *es raro que* holds it up as strange: *conteste*." },
    { q: "What does *me extraña* add?", es: "Me extraña que no haya nadie.",
      options: ["She's delighted", "She's bored with the party", "Something seems wrong"], answer: 2,
      why: "*Me extraña* is surprise with a hint that something is off." },
    { q: "Who is she surprised to see?", es: "¡Qué sorpresa verte por aquí!",
      options: ["You", "Herself", "Your brother"], answer: 0,
      why: "*Verte*: seeing you. Her own experience, so the dictionary form." },
    { q: "How strong is it?", es: "¡No me lo puedo creer!",
      options: ["Mild interest", "Huge surprise", "Boredom"], answer: 1,
      why: "*No me lo puedo creer* is the big one: I can't believe it!" }
  ],
  yourTurn: [
    { en: "Seriously?", es: "¿En serio?", accept: ["¿De verdad?"] },
    { en: "What a surprise to see you here! (to a friend)", es: "¡Qué sorpresa verte por aquí!", accept: ["¡Qué sorpresa verte por acá!"] },
    { en: "It's strange that he isn't answering.", es: "Es raro que no conteste.", accept: ["Es raro que no responda."] },
    { en: "I can't believe it!", es: "¡No me lo puedo creer!", accept: ["¡No lo puedo creer!", "¡No puedo creerlo!"] }
  ],
  translate: [
    { en: "I'm surprised he's leaving so suddenly.", es: "Me sorprende que se vaya tan de repente.", accept: [] },
    { en: "He quit his job. Really?", es: "Renunció al trabajo. ¿De verdad?", accept: ["Renunció al trabajo. ¿En serio?", "Dejó el trabajo. ¿[De verdad|En serio]?"] },
    { en: "How strange!", es: "¡Qué raro!", accept: ["¡Qué extraño!"] },
    { en: "It seems odd to me that there's nobody here.", es: "Me extraña que no haya nadie.", accept: ["Me extraña que no haya nadie [aquí|acá]."] },
    { en: "She's getting married next month. You don't say!", es: "Se casa el mes que viene. ¡No me digas!", accept: ["Se casa el próximo mes. ¡No me digas!"] }
  ],
  register: [
    { es: "¡No me digas!", en: "You don't say!", when: "news from a friend, warm surprise" },
    { es: "¿En serio?", en: "Seriously?", when: "everyday, with anyone" },
    { es: "¡Uy, qué sorpresa!", en: "Oh, what a surprise!", when: "a happy surprise, with a very Colombian uy" },
    { es: "¡No puede ser!", en: "No way!", when: "big news, good or bad" },
    { es: "Me sorprende mucho la noticia.", en: "The news really surprises me.", when: "calm, at work or in writing" }
  ],
  personal: {
    prompt: "A friend tells you surprising news about someone you both know. React in two lines: a quick reaction, then what surprises you.",
    constraints: [
      { type: "containsAny", words: ["en serio", "de verdad", "no me digas", "qué sorpresa", "qué raro", "no puede ser", "no me lo puedo creer"], label: "a quick reaction, like *¿en serio?*" },
      { type: "containsAny", words: ["me sorprende que", "me extraña que", "es raro que"], label: "what surprises you: *me sorprende que*" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive after it" }
    ],
    model: "¿En serio? ¡No me digas! Me sorprende que Laura se case tan pronto."
  },
  pitfalls: [
    "*Me sorprende que se va* keeps the ordinary form: a surprising fact is held up, *se vaya*.",
    "News from yesterday takes the plain past in Colombia: *Renunció ayer*, not *ha renunciado*.",
    "*¿Ah, sí?* said flat can sound doubtful: for warm surprise, *¡No me digas!*"
  ]
},

"fn-empatia-b1": {
  source: "merged",
  hook: {
    line: "Your friend calls, upset: her boss gave her project to someone else. She doesn't want advice yet. She wants to feel heard, and Spanish shows that in one ending.",
    es: "Ay, me imagino. Entiendo que estés molesta.\nYo también estaría muy brava.",
    en: "Oh, I can imagine. I understand that you're upset.\nI'd be really angry too."
  },
  examples: [
    { es: "Siento mucho lo que te pasó.", en: "I'm so sorry about what happened to you." },
    { es: "Entiendo perfectamente que necesites tiempo.", en: "I completely understand that you need time." },
    { es: "Perdí el vuelo.\n¡Qué horror!", en: "I missed my flight.\nHow awful!" }
  ],
  rule: "Showing you're with someone, from small to full.\nSmall signals while they talk: *Claro, claro.* *Sí, te entiendo.* *Me imagino.*\nShare the feeling in two words: *¡Qué pena!* *¡Qué horror!* *¡Qué rabia!* Or the good kind: *¡Qué bien!*\nSay it makes sense, with *entiendo que* and the subjunctive: *Entiendo que estés molesta.* The ending says the feeling is reasonable.\nWith the ordinary form it is only news: *Entiendo que llegas mañana*, I gather you arrive tomorrow.\n*Comprendo que* works the same way. Formal: *Comprendo perfectamente su preocupación.*\nThen, and only then: *¿Qué necesitas?*",
  readAndPick: [
    { q: "What is she saying?", es: "Entiendo que estés molesta.",
      options: ["She just heard the news", "Your upset makes sense", "She is upset with you"], answer: 1,
      why: "*Estés*, the subjunctive, says the feeling is reasonable." },
    { q: "And here?", es: "Entiendo que llegas el lunes.",
      options: ["She's taken in a fact", "Arriving makes sense", "She hopes you arrive"], answer: 0,
      why: "With the ordinary *llegas*, *entiendo que* only reports news: I gather." },
    { q: "What is *me imagino* doing?", es: "Ay, me imagino.",
      options: ["Changing the subject", "Asking a question", "Showing she's with you"], answer: 2,
      why: "*Me imagino*: I can imagine. A small signal that she's listening." },
    { q: "When would you say this?", es: "¡Qué horror, lo siento muchísimo!",
      options: ["After good news", "After bad news", "Before a meal"], answer: 1,
      why: "*¡Qué horror!* shares the shock of bad news." },
    { q: "Where would you hear this?", es: "Comprendo perfectamente su preocupación.",
      options: ["Between close friends", "A child's game in the park", "A customer service call"], answer: 2,
      why: "*Comprendo* and *su* are the careful voice of someone at work." }
  ],
  yourTurn: [
    { en: "I understand that you're upset. (to a friend)", es: "Entiendo que estés molesto.", accept: ["Entiendo que estés molesta."] },
    { en: "I can imagine.", es: "Me imagino.", accept: [] },
    { en: "I'm so sorry about what happened to you. (to a friend)", es: "Siento mucho lo que te pasó.", accept: ["Lamento mucho lo que te pasó."] },
    { en: "I completely understand that you need time. (to a friend)", es: "Entiendo perfectamente que necesites tiempo.", accept: ["Entiendo perfectamente que necesites un poco de tiempo."] }
  ],
  translate: [
    { en: "I gather you're arriving on Monday. (to a friend)", es: "Entiendo que llegas el lunes.", accept: [] },
    { en: "I completely understand your concern. (polite)", es: "Comprendo perfectamente su preocupación.", accept: ["Entiendo perfectamente su preocupación."] },
    { en: "I missed my flight. How awful!", es: "Perdí el vuelo. ¡Qué horror!", accept: [] },
    { en: "I understand that you don't want to talk now. (to a friend)", es: "Entiendo que no quieras hablar ahora.", accept: ["Comprendo que no quieras hablar ahora."] },
    { en: "Of course, of course. I'd be angry too.", es: "Claro, claro. Yo también estaría bravo.", accept: ["Claro, claro. Yo también estaría [brava|molesto|molesta]."] }
  ],
  register: [
    { es: "Claro, claro.", en: "Of course, of course.", when: "while they talk, to show you follow" },
    { es: "Me imagino.", en: "I can imagine.", when: "warm and short, with anyone" },
    { es: "Te entiendo perfectamente.", en: "I completely understand you.", when: "a full sentence of support, to a friend" },
    { es: "Comprendo su situación.", en: "I understand your situation.", when: "to someone you call usted, or a client" },
    { es: "Lamento mucho lo sucedido.", en: "I'm very sorry for what happened.", when: "formal, in writing" }
  ],
  personal: {
    prompt: "A friend tells you something went badly for them today. Write a reply that shows you understand, before any advice.",
    constraints: [
      { type: "containsAny", words: ["me imagino", "te entiendo", "claro", "qué pena", "qué horror", "qué rabia"], label: "a small signal: *me imagino* or *qué pena*" },
      { type: "subjunctiveAfter", trigger: "entiendo que", label: "*entiendo que* and the subjunctive" }
    ],
    model: "Ay, qué rabia, me imagino. Entiendo que estés brava con tu jefe."
  },
  pitfalls: [
    "*Entiendo que estás molesta* only reports a fact: to say the feeling makes sense, *estés*.",
    "Jump to advice too soon and they feel unheard: the feeling first, then *¿qué necesitas?*",
    "Something that happened today takes the plain past: *lo que te pasó*, not *lo que te ha pasado*."
  ]
},

"fn-tranquilizar-consolar-b1": {
  source: "old",
  hook: {
    line: "Your friend dropped her phone in the river on your trip to San Gil, and she's about to cry. You can't fix the phone, but you can calm her down, and Spanish has a whole set of phrases for it.",
    es: "Tranquila, no llores.\nSon cosas que pasan. Ya verás que todo sale bien.",
    en: "Easy, don't cry.\nThese things happen. You'll see, it'll all work out."
  },
  examples: [
    { es: "No te preocupes, no es para tanto.", en: "Don't worry, it's not that big a deal." },
    { es: "No te pongas así, seguro que se soluciona.", en: "Don't get like that, I'm sure it'll get sorted." },
    { es: "No se preocupe, nosotros nos encargamos de todo.", en: "Don't worry, we'll take care of everything." }
  ],
  rule: "Calming someone has three moves.\nSpeak to the feeling, often with a *no* command: *No te preocupes.* *No llores.* *No te pongas así.* Or just *Tranquilo*, *tranquila*.\nShrink the problem: *No pasa nada.* *No es para tanto.* *Son cosas que pasan.*\nPoint to later: *Ya verás que todo sale bien.* *Todo va a salir bien.* *Ya pasó.*\nTo someone you call *usted*: *No se preocupe.* *Tranquilo, señor.*\nDon't shrink something big. For a death or a breakup, *No es para tanto* is cruel. There, say *Estoy contigo*, I'm here for you.",
  readAndPick: [
    { q: "What does this do?", es: "Son cosas que pasan.",
      options: ["Makes it normal", "Makes it bigger", "Blames someone"], answer: 0,
      why: "*Son cosas que pasan*: these things happen to everyone." },
    { q: "Who is being told?", es: "No se preocupe, nosotros nos encargamos.",
      options: ["A close friend", "A group of kids at school", "Someone you call usted"], answer: 2,
      why: "*No se preocupe* is the *usted* shape. A friend gets *no te preocupes*." },
    { q: "When should you not say this?", es: "Tranquila, no es para tanto.",
      options: ["After a funeral", "A spilled coffee", "A lost umbrella"], answer: 0,
      why: "*No es para tanto* shrinks the problem. For a death, that is cruel." },
    { q: "What is she promising?", es: "Ya verás que todo sale bien.",
      options: ["It already went badly", "It will turn out fine", "You'll see it tomorrow"], answer: 1,
      why: "*Ya verás*: you'll see, it'll all work out." },
    { q: "What is *tranquila* doing here?", es: "Tranquila, ya pasó.",
      options: ["Describing her", "Saying goodbye", "Calming her down"], answer: 2,
      why: "*Tranquila* on its own is easy, relax: it calms." }
  ],
  yourTurn: [
    { en: "Don't worry, it's not that big a deal. (to a friend)", es: "No te preocupes, no es para tanto.", accept: [] },
    { en: "These things happen.", es: "Son cosas que pasan.", accept: [] },
    { en: "You'll see, everything will work out. (to a friend)", es: "Ya verás que todo sale bien.", accept: ["Ya verás que todo [va a salir|saldrá] bien."] },
    { en: "Don't worry, we'll take care of everything. (polite)", es: "No se preocupe, nosotros nos encargamos de todo.", accept: ["No se preocupe, nosotros nos ocupamos de todo."] }
  ],
  translate: [
    { en: "Easy, don't cry. (to a friend)", es: "Tranquila, no llores.", accept: ["Tranquilo, no llores."] },
    { en: "It's okay, it's over now.", es: "No pasa nada, ya pasó.", accept: ["[Tranquilo|Tranquila], ya pasó."] },
    { en: "Don't get like that, I'm sure it'll get sorted. (to a friend)", es: "No te pongas así, seguro que se soluciona.", accept: ["No te pongas así, seguro que se arregla."] },
    { en: "Don't get angry, it wasn't my intention. (to a friend)", es: "No te pongas bravo, no fue mi intención.", accept: ["No te pongas brava, no fue mi intención.", "No te enojes, no fue mi intención."] },
    { en: "I'm here for you. (to a friend)", es: "Estoy contigo.", accept: ["Aquí estoy contigo."] }
  ],
  register: [
    { es: "Tranquilo, no pasa nada.", en: "Relax, it's fine.", when: "small problems, with anyone" },
    { es: "No te preocupes.", en: "Don't worry.", when: "everyday, to anyone you call tú" },
    { es: "Ya verás que todo sale bien.", en: "You'll see, it'll all work out.", when: "a hopeful push, for bigger worries" },
    { es: "Estoy contigo.", en: "I'm here for you.", when: "big pain, when nothing can be fixed" },
    { es: "No se preocupe, señora.", en: "Don't worry, ma'am.", when: "to someone you call usted" }
  ],
  personal: {
    prompt: "A friend has just failed their driving test. Write three short lines to calm them down: one to the feeling, one to shrink the problem, one about later.",
    constraints: [
      { type: "containsAny", words: ["no te preocupes", "tranquilo", "tranquila", "no llores", "no te pongas así"], label: "to the feeling: *no te preocupes* or *tranquilo*" },
      { type: "containsAny", words: ["no pasa nada", "no es para tanto", "son cosas que pasan"], label: "shrink it: *no es para tanto*" },
      { type: "containsAny", words: ["ya verás", "va a salir bien", "la próxima"], label: "about later: *ya verás* or *la próxima*" }
    ],
    model: "Tranquilo, no te preocupes. Son cosas que pasan. Ya verás que la próxima vez lo pasas."
  },
  pitfalls: [
    "*No te preocupas* is a statement, you don't worry: the comfort is *no te preocupes*.",
    "*No es para tanto* about something big sounds cruel: there, *Estoy contigo*.",
    "*No te enfades* is how Spain says it. In Colombia: *no te pongas bravo* or *no te enojes*."
  ]
},

"fn-animar-b1": {
  source: "old",
  hook: {
    line: "Your friend has wanted to sing at the open mic in a bar in Cali for months, and tonight she's frozen at the bottom of the stage steps. You need to push her gently, without pushing too hard.",
    es: "¡Dale, tú puedes!\nNo tengas miedo, nadie te va a juzgar.",
    en: "Go on, you can do it!\nDon't be scared, nobody's going to judge you."
  },
  examples: [
    { es: "¡Ánimo, ya casi terminas!", en: "Keep going, you're almost done!" },
    { es: "Inténtalo, no pasa nada si te sale mal.", en: "Try it, it's fine if it goes wrong." },
    { es: "¡Hágale, que usted puede!", en: "Go for it, you can do it!" }
  ],
  rule: "Encouragement comes three ways.\nA push, short and loud: *¡Dale!* *¡Ánimo!* *¡Anímate!* *¡Tú puedes!* To someone you call *usted*, very Colombian: *¡Hágale!* *¡Usted puede!*\nA command with a reason: *Inténtalo, te va a encantar.* *Prueba, hombre*: the *hombre* softens the push, whoever you're talking to.\nOr remove the fear instead of pushing: *No tengas miedo.* *No pasa nada si sale mal.* *Yo ya lo hice y no pasó nada.*\n*¡Ánimo!* also keeps someone going in the middle of something hard.\nIn writing, formal: *Lo animamos a participar.*",
  readAndPick: [
    { q: "What is *¡Dale!* doing here?", es: "¡Dale, tú puedes!",
      options: ["Telling her to stop", "Pushing her to go", "Asking for a hit"], answer: 1,
      why: "*¡Dale!* is go on, go for it: a push." },
    { q: "Is he only talking to men?", es: "¡Prueba, hombre, está delicioso!",
      options: ["No, it softens the push", "Yes, it's only said to men", "No, it's an insult"], answer: 0,
      why: "This *hombre* works on anyone, the way come on does in English." },
    { q: "Who is being encouraged?", es: "¡Hágale, que usted puede!",
      options: ["A close friend, as tú", "A group of children", "Someone called usted"], answer: 2,
      why: "*Hágale* and *usted puede* are the *usted* shapes." },
    { q: "How does this encourage?", es: "No pasa nada si te sale mal.",
      options: ["By pushing harder", "By removing the fear", "By changing the plan"], answer: 1,
      why: "It takes away the risk instead of pushing." },
    { q: "When would you say this?", es: "¡Ánimo, ya casi llegamos!",
      options: ["Halfway up a hard climb", "At the end of a party", "Before breakfast on a Sunday"], answer: 0,
      why: "*¡Ánimo!* keeps someone going in the middle of something hard." }
  ],
  yourTurn: [
    { en: "Go on, you can do it! (to a friend)", es: "¡Dale, tú puedes!", accept: ["¡[Ánimo|Vamos], tú puedes!"] },
    { en: "Don't be scared. (to a friend)", es: "No tengas miedo.", accept: [] },
    { en: "Try it, it's fine if it goes wrong. (to a friend)", es: "Inténtalo, no pasa nada si te sale mal.", accept: ["Inténtalo, no pasa nada si sale mal."] },
    { en: "Keep going, you're almost done! (to a friend)", es: "¡Ánimo, ya casi terminas!", accept: [] }
  ],
  translate: [
    { en: "Go for it, you can do it! (polite)", es: "¡Hágale, que usted puede!", accept: ["¡Hágale, usted puede!", "¡Ánimo, usted puede!"] },
    { en: "Go for it, I'm sure you'll love it! (to a friend)", es: "¡Anímate, seguro que te va a encantar!", accept: ["¡Anímate, seguro que te encantará!"] },
    { en: "There's no danger, I've done it before.", es: "No hay peligro, yo ya lo hice antes.", accept: ["No hay peligro, yo ya lo he hecho antes.", "No hay peligro, ya lo hice antes."] },
    { en: "Jump, I've got you! (to a friend)", es: "¡Salta, que yo te agarro!", accept: ["¡Salta, yo te agarro!"] },
    { en: "We encourage you to take part. (polite)", es: "Lo animamos a participar.", accept: ["La animamos a participar.", "Le animamos a participar."] }
  ],
  register: [
    { es: "¡Dale!", en: "Go on!", when: "with friends, a quick push" },
    { es: "¡Ánimo!", en: "Keep it up!", when: "in the middle of something hard" },
    { es: "¡Tú puedes!", en: "You can do it!", when: "before a big moment" },
    { es: "¡Hágale!", en: "Go for it!", when: "very Colombian, often with usted" },
    { es: "Lo animamos a postularse.", en: "We encourage you to apply.", when: "formal, in a job notice or an email" }
  ],
  personal: {
    prompt: "A friend is nervous about something new: a job interview, a dance class, a trip alone. Write three lines: a push, one fear removed, and a reason.",
    constraints: [
      { type: "containsAny", words: ["dale", "ánimo", "anímate", "tú puedes", "hágale"], label: "a push: *¡dale!* or *¡ánimo!*" },
      { type: "containsAny", words: ["no tengas miedo", "no pasa nada", "no hay peligro"], label: "a fear removed: *no tengas miedo*" },
      { type: "minSentences", n: 3, label: "three lines or more" }
    ],
    model: "¡Dale, tú puedes! No tengas miedo de la entrevista. Te preparaste muchísimo y te va a ir muy bien."
  },
  pitfalls: [
    "*No tienes miedo* is a statement, you're not scared: the push is *no tengas miedo*.",
    "*¡Venga!* is how Spain says it. In Colombia: *¡dale!*"
  ]
},

"task-b1-enfado": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: something that went badly, told honestly, and ending with someone trying to calm you down. Under-reacting in Spanish can read as cold, so let the feeling show.",
    es: "Me indigna que te traten así.\nTranquila, que esto se arregla.",
    en: "It infuriates me that they treat you like that.\nEasy, this'll get sorted."
  },
  examples: [
    { es: "Ya estoy harta de llamar.", en: "I'm fed up with calling." },
    { es: "Me llegó una factura de trescientos mil pesos.", en: "I got a bill for three hundred thousand pesos." }
  ],
  rule: "Tell it in order, and let the feeling grow with the story.\nWhat happened, in the past: *Me llegó una factura enorme.* *Llamé cinco veces.*\nHow things kept going: *Cada vez me decían otra cosa.*\nThe feeling, at the right size: *Me dio mucha rabia.* *Me indigna que* and the subjunctive: *Me indigna que te traten así.* *Ya estoy harto.*\nWhat you did about it: *Puse una queja por escrito.*\nThen someone calms you down: *Tranquilo, que esto se arregla.* *A mí me pasó lo mismo.*\nIndifference is a feeling too: *me da igual* is mild, *me importa un comino* is cold.",
  readAndPick: [
    { q: "What is this sentence for?", es: "Cada vez me decían otra cosa.",
      options: ["A single moment", "How things kept going", "A plan for later in the week"], answer: 1,
      why: "*Decían* and *cada vez*: what kept happening, again and again." },
    { q: "How big is the feeling?", es: "Ya estoy harta.",
      options: ["Fed up", "Mild interest", "Slightly bored"], answer: 0,
      why: "*Harta* is fed up: she has had enough." },
    { q: "Who treats who badly?", es: "Me indigna que te traten así.",
      options: ["You treat them badly", "I treat you badly", "They treat you badly"], answer: 2,
      why: "*Que te traten*: they treat you, so *que* and the subjunctive." },
    { q: "What is the neighbour doing?", es: "Tranquilo, que esto se arregla.",
      options: ["Calming him", "Blaming him for it", "Saying goodbye"], answer: 0,
      why: "*Tranquilo* and *esto se arregla*: it'll get sorted, relax." },
    { q: "Why does she say this?", es: "A mí me pasó lo mismo el año pasado.",
      options: ["To change the subject", "To show it can be fixed", "To complain about herself"], answer: 1,
      why: "Her own story shows it can work out, which calms him down." }
  ],
  yourTurn: [
    { en: "It infuriates me that they treat you like that. (to a friend)", es: "Me indigna que te traten así.", accept: ["Me da rabia que te traten así."] },
    { en: "I'm fed up.", es: "Ya estoy harto.", accept: ["Ya estoy harta.", "Estoy [harto|harta]."] },
    { en: "Easy, this'll get sorted. (to a friend)", es: "Tranquilo, que esto se arregla.", accept: ["[Tranquilo|Tranquila], esto se arregla.", "Tranquila, que esto se arregla."] },
    { en: "I called five times.", es: "Llamé cinco veces.", accept: [] }
  ],
  translate: [
    { en: "I got a bill for three hundred thousand pesos.", es: "Me llegó una factura de trescientos mil pesos.", accept: [] },
    { en: "Every time they told me something different.", es: "Cada vez me decían otra cosa.", accept: ["Cada vez me decían algo [distinto|diferente]."] },
    { en: "In the end I made a complaint in writing.", es: "Al final puse una queja por escrito.", accept: [] },
    { en: "The same thing happened to me last year.", es: "A mí me pasó lo mismo el año pasado.", accept: ["Me pasó lo mismo el año pasado."] },
    { en: "And in the end they gave it all back to me.", es: "Y al final me lo devolvieron todo.", accept: ["Y al final me devolvieron todo."] }
  ],
  register: [
    { es: "Me molestó bastante.", en: "It bothered me quite a lot.", when: "a measured complaint" },
    { es: "Me dio mucha rabia.", en: "It made me really mad.", when: "honest anger, with friends" },
    { es: "Estoy hasta la coronilla.", en: "I've had it up to here.", when: "fed up, colloquial and strong" },
    { es: "Me parece una falta de respeto.", en: "I think it's a lack of respect.", when: "a firm complaint to a company or a manager" }
  ],
  personal: {
    prompt: "Write about something that went badly, eight sentences or more, ending with someone calming you down.",
    constraints: [
      { type: "minSentences", n: 8, label: "eight sentences or more" },
      { type: "containsAny", words: ["me indigna que", "me da rabia que", "no soporto que", "me molesta que"], label: "*me indigna que* or *no soporto que*" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive after it" },
      { type: "containsAny", words: ["tranquilo", "tranquila", "no te preocupes", "no pasa nada", "se arregla"], label: "someone calms you down at the end" }
    ],
    model: "Hace dos meses que peleo con la empresa del gas. Me llegó una factura de trescientos mil pesos por un apartamento donde vivo solo. Llamé cinco veces. Cada vez me decían otra cosa. La última vez me colgaron. Me indigna que te traten así. Al final puse una queja por escrito. Mi vecina me dijo: \"Tranquilo, que esto se arregla. A mí me pasó lo mismo el año pasado.\""
  },
  pitfalls: [
    "Under-reacting can sound cold in Spanish: let the feeling show, at the size the story deserves.",
    "*Me indigna que te tratan así* keeps the ordinary form: *que te traten*."
  ]
}

};
