/* ============================================================================
 * TEACHING SCRIPTS, B1 units 1 to 12 (window.SCRIPTS_B1), keyed by lesson id.
 * Units b1-u27 "What I think", b1-u28 "Agreeing and arguing", b1-u29 "Plans
 * and predictions", b1-u30 "Advice and what I would do", b1-u31 "What I want
 * from you", b1-u32 "Asking, refusing, forbidding", b1-u33 "Good feelings",
 * b1-u34 "When it goes wrong", b1-u35 "Likes and how you are", b1-u36
 * "Telling a longer story", b1-u37 "Holding a conversation" and b1-u38
 * "Describing at length": every lesson on the path from COURSE_BANDS.B1, the
 * present subjunctive first.
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
 *
 * Units 9 to 12 add three dates, each the first day whose lesson teaches the
 * node (tools/test-scripts-b1.js reads them from data/lesson-nodes.js): había
 * and the -ado or -ido form from gr-pluscuamperfecto-b1, the first day of
 * b1-u36; ponerse a and a verb from nt-ciclo-accion-b1; indirect questions
 * (No sé dónde, ¿Sabe si...?, Me preguntó si) from fn-pedir-informacion-b1 in
 * b1-u37. Volver a and a verb, the past subjunctive and the perfect
 * subjunctive still wait for later units, so the old lessons' ¿Te importaría
 * que abriera...?, no se parece a nada que haya leído and No he oído que esté
 * enfermo are replaced by ¿Te importaría abrir...?, que yo sepa and the
 * ordinary form. News is told in the plain past (¿Supiste que...?, Oí que...);
 * the perfect stays for experience (¿Has oído hablar de...?) and not yet.
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
},

/* ---- unit b1-u35 · Likes and how you are --------------------------------- */

"fn-expresar-gustos-b1": {
  source: "merged",
  hook: {
    line: "Your new roommate in Medellín asks what makes living together easy for you. The answer isn't the things you like. It's the things other people do, and Spanish marks that change in the verb.",
    es: "Me gusta que la casa esté en silencio por la mañana.\nY me encanta que me avisen antes de traer visita.",
    en: "I like it when the house is quiet in the morning.\nAnd I love it when people tell me before bringing guests over."
  },
  examples: [
    { es: "Me gusta el silencio.", en: "I like silence." },
    { es: "Me gusta que haya silencio.", en: "I like it when it's quiet." },
    { es: "Me encanta cocinar, pero no me gusta que me miren mientras cocino.", en: "I love cooking, but I don't like people watching me while I cook." }
  ],
  rule: "A thing you like: *me gusta* and the thing. *Me gusta el silencio.*\nSomething you do yourself: the dictionary form. *Me encanta cocinar.*\nSomething someone else does: *que* and the subjunctive. *Me gusta que haya silencio.* *Me encanta que me llames.*\nCover *me gusta que* and read what is left: *haya silencio*, *me llames*. You aren't reporting it, you're saying how you feel about it.\n*Me interesa que*, *me molesta que* and *no me gusta que* work the same way.\n*No me importa* and a thing needs no *que*: *No me importa el precio.*\nBefore *que*, *gusta* stays singular: *Me gustan las flores*, but *Me gusta que me regalen flores*.",
  readAndPick: [
    { q: "Who does the calling?", es: "Me encanta que me llames los domingos.",
      options: ["I call you", "You call me", "We call each other"], answer: 1,
      why: "*Que me llames*: the calling is yours, and she is saying how she feels about it." },
    { q: "What doesn't she mind?", es: "No me importa el precio, me importa la calidad.",
      options: ["How good it is", "How much it costs", "How long it will last"], answer: 1,
      why: "*No me importa el precio*: a thing, so no *que* and no change in the verb." },
    { q: "Why *haya* and not *hay*?", es: "Me gusta que haya flores en la mesa.",
      options: ["Because it happened last week", "It's how she feels about it", "Because there are many flowers"], answer: 1,
      why: "Cover *me gusta que*: *haya flores* isn't reported, it's what she likes." },
    { q: "Who gets home late?", es: "A mi mamá no le gusta que lleguemos tarde.",
      options: ["My mom does", "They do", "We do"], answer: 2,
      why: "*Lleguemos* ends in *-emos*: we do. *Le gusta* is my mom's feeling about it." },
    { q: "Who is going to learn?", es: "Me interesa mucho aprender a bailar salsa.",
      options: ["Someone else", "His teacher", "He is"], answer: 2,
      why: "*Aprender*, the dictionary form: he's the one learning, so no *que*." }
  ],
  yourTurn: [
    { en: "I love it when you call me. (to a friend)", es: "Me encanta que me llames.", accept: ["Me gusta mucho que me llames."] },
    { en: "I like it when it's quiet.", es: "Me gusta que haya silencio.", accept: [] },
    { en: "My parents don't like us arriving late for dinner.", es: "A mis papás no les gusta que lleguemos tarde a cenar.", accept: ["A mis [papás|padres] no les gusta que lleguemos tarde a [cenar|la cena|comer]."] },
    { en: "I love cooking.", es: "Me encanta cocinar.", accept: [] },
    { en: "It bothers me when people don't say hello.", es: "Me molesta que la gente no salude.", accept: ["Me molesta que la gente no [salude|diga hola]."] }
  ],
  translate: [
    { en: "I like silence.", es: "Me gusta el silencio.", accept: [] },
    { en: "I love it when you come and visit me. (to a friend)", es: "Me encanta que vengas a visitarme.", accept: ["Me encanta que me vengas a visitar."] },
    { en: "I don't mind waiting a bit.", es: "No me importa esperar un poco.", accept: [] },
    { en: "We love it when the neighbours invite us over.", es: "Nos encanta que los vecinos nos inviten.", accept: ["Nos encanta que los vecinos nos inviten a su casa."] },
    { en: "I don't like people watching me while I cook.", es: "No me gusta que me miren mientras cocino.", accept: [] }
  ],
  register: [
    { es: "Me gusta que me avisen.", en: "I like being told in advance.", when: "plain and friendly, with anyone" },
    { es: "Me encanta que me llames.", en: "I love it when you call me.", when: "warm, to someone close" },
    { es: "Me fascina que la gente baile en la calle.", en: "I love that people dance in the street.", when: "very enthusiastic, common in Colombia" },
    { es: "Agradezco que me informen con tiempo.", en: "I appreciate being told in good time.", when: "formal, at work or in an email" }
  ],
  personal: {
    prompt: "Think of the people you live or work with. Write two things you like them to do and one thing that bothers you.",
    constraints: [
      { type: "subjunctiveAfter", trigger: "me gusta que", label: "*me gusta que* and the subjunctive" },
      { type: "containsAny", words: ["me molesta que", "no me gusta que", "me choca que"], label: "one thing that bothers you: *me molesta que*" }
    ],
    model: "Me gusta que mis compañeros me saluden por la mañana. Me encanta que alguien traiga tinto para todos. Pero me molesta que hablen por celular en las reuniones."
  },
  pitfalls: [
    "*Me gusta que me llamas* keeps the ordinary form: how you feel about someone's action takes *que me llames*.",
    "*Me gustan que...* is a common slip: before *que*, the verb stays *gusta*.",
    "For your own action, drop *que*: *Me gusta cocinar*, never *me gusta que cocino*."
  ]
},

"fn-preguntar-gustos-b1": {
  source: "merged",
  hook: {
    line: "You're staying with a family in Cali for a week and want to get things right. Asking whether they like a thing is easy. Asking whether they like or mind something someone does takes one more step.",
    es: "¿Qué les parecen las arepas de aquí?\n¿Les molesta que ponga música por la mañana?",
    en: "What do you think of the arepas here?\nDo you mind if I play music in the morning?"
  },
  examples: [
    { es: "¿Te gusta este perfume?", en: "Do you like this perfume?" },
    { es: "¿Te gusta que te regalen perfume?", en: "Do you like it when people give you perfume?" },
    { es: "¿Qué te pareció la nueva profesora?", en: "What did you think of the new teacher?" }
  ],
  rule: "About a thing: *¿Te gusta...?* and the thing. *¿Te gusta este perfume?* Several things, *gustan*: *¿Te gustan las flores?*\nAbout something people do: *¿Te gusta que...?* and the subjunctive. *¿Te gusta que te regalen flores?* *¿Les molesta que ponga música?*\nFor a view rather than a pleasure: *¿Qué te parece...?* *¿Qué te parecen estos zapatos?* About something already over, Latin Americans use the past: *¿Qué te pareció la película?*\nFor food, just: *¿Está rico?*\nTo check a plan is fine: *¿Te parece bien que nos veamos a las ocho?*\nTo *usted*: *¿Le gusta...?* To a group: *¿Les gusta...?*",
  readAndPick: [
    { q: "What is she asking about?", es: "¿Te gusta que te llamen por tu apodo?",
      options: ["The nickname itself", "Who chose the name", "Being called by it"], answer: 2,
      why: "*Que te llamen*: an action people do, so *que* and the subjunctive." },
    { q: "What does he want to know?", es: "¿Está rica la sopa?",
      options: ["If you like soup in general", "If the soup tastes good", "If the soup is hot enough"], answer: 1,
      why: "*¿Está rica?* asks about the taste of this soup, right now." },
    { q: "Who is talking to whom?", es: "¿Les molesta que abra la ventana?",
      options: ["One friend to another", "A guest to the family", "A boss to all the workers"], answer: 1,
      why: "*Les* asks several people; *abra* is the speaker, who wants to open it." },
    { q: "When did the film happen?", es: "¿Qué te pareció la película?",
      options: ["It's on tonight", "You're choosing one", "You already saw it"], answer: 2,
      why: "*Pareció*, the past: the film is over, and she wants your verdict." },
    { q: "What is being checked?", es: "¿Te parece bien que nos veamos a las ocho?",
      options: ["Where you live", "That eight works for you", "Whether you've had dinner yet"], answer: 1,
      why: "*¿Te parece bien que...?* checks a plan: meeting at eight." }
  ],
  yourTurn: [
    { en: "Do you like it when people give you flowers? (to a friend)", es: "¿Te gusta que te regalen flores?", accept: [] },
    { en: "What do you think of these shoes? (to a friend)", es: "¿Qué te parecen estos zapatos?", accept: [] },
    { en: "Is the soup tasty?", es: "¿Está rica la sopa?", accept: ["¿Está [rica|buena] la sopa?", "¿La sopa está [rica|buena]?"] },
    { en: "Do you mind if I play music? (to a friend)", es: "¿Te molesta que ponga música?", accept: ["¿Te importa que ponga música?"] },
    { en: "What did you think of the movie? (to a friend)", es: "¿Qué te pareció la película?", accept: [] }
  ],
  translate: [
    { en: "Do you like this perfume? (to a friend)", es: "¿Te gusta este perfume?", accept: [] },
    { en: "Don't you like it when your uncle comes for dinner? (to a friend)", es: "¿No te gusta que tu tío venga a comer?", accept: ["¿No te gusta que tu tío venga a cenar?", "¿No te gusta que venga tu tío a [comer|cenar]?"] },
    { en: "Is it OK with you if we meet at eight? (to a friend)", es: "¿Te parece bien que nos veamos a las ocho?", accept: [] },
    { en: "Do you like your kids helping you in the kitchen? (to a friend)", es: "¿Te gusta que tus hijos te ayuden en la cocina?", accept: [] },
    { en: "What do you all think of the new teacher?", es: "¿Qué les parece la nueva profesora?", accept: ["¿Qué les parece la profesora nueva?"] },
    { en: "Do you like it when it rains? (to someone you call usted)", es: "¿Le gusta que llueva?", accept: [] }
  ],
  register: [
    { es: "¿Te gusta?", en: "Do you like it?", when: "short and casual, pointing at the thing" },
    { es: "¿Qué te parece?", en: "What do you think?", when: "asking for a view, with anyone you call tú" },
    { es: "¿Está rico?", en: "Is it tasty?", when: "only about food, at the table" },
    { es: "¿Le parece bien que empecemos?", en: "Is it all right with you if we start?", when: "polite, to someone you call usted" },
    { es: "¿Qué opinión le merece la propuesta?", en: "What is your view of the proposal?", when: "formal, at a meeting or in writing" }
  ],
  personal: {
    prompt: "You're staying with a host family. Write two questions: one about something they like, and one asking whether they mind something you'd like to do.",
    constraints: [
      { type: "containsAny", words: ["¿te gusta", "¿le gusta", "¿les gusta", "¿qué te parece", "¿qué le parece", "¿qué les parece"], label: "a question about their taste: *¿Les gusta...?*" },
      { type: "regex", pattern: "(molesta|importa|parece bien) que", label: "*¿Les molesta que...?* or *¿Les parece bien que...?*" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive after it" }
    ],
    model: "¿Les gusta el ajiaco? ¿Les molesta que cocine yo el domingo?"
  },
  pitfalls: [
    "*¿Te gusta que te regalan flores?* keeps the ordinary form: asking about what people do takes *regalen*.",
    "*¿Qué te parece?* asks for a view; *¿Te gusta?* asks whether it pleases you. A dish can be good and still not to your taste.",
    "*¿Qué te ha parecido?* is how Spain asks about something just over. In Colombia: *¿Qué te pareció?*"
  ]
},

"fn-preferencia-b1": {
  source: "merged",
  hook: {
    line: "Your friend Juliana is choosing between two apartments in Bogotá and asks which one you'd pick. A preference in Spanish compares with a small word English speakers never expect: *a*.",
    es: "Prefiero el apartamento de Chapinero al de Suba.\nLo que más me gusta es la luz.",
    en: "I prefer the apartment in Chapinero to the one in Suba.\nWhat I like most is the light."
  },
  examples: [
    { es: "Prefiero el tinto al café con leche.", en: "I prefer black coffee to coffee with milk." },
    { es: "Prefiero caminar a esperar el bus.", en: "I'd rather walk than wait for the bus." },
    { es: "Prefiero que decidas tú.", en: "I'd rather you decided." }
  ],
  rule: "*Preferir* compares with *a*, like English to: *Prefiero el tinto al café.* Not *que*: that belongs to *más que*. *A* and *el* join up as *al*.\nTwo actions work the same way: *Prefiero caminar a esperar.*\nWhen it's someone else's action: *prefiero que* and the subjunctive. *Prefiero que decidas tú.* *Me gusta más que* works the same: *Me gusta más que vengas tú.*\nTo single out the favourite: *Lo que más me gusta es...* The least: *Lo que menos me gusta es...* With more than one thing, *son*: *Lo que más me gusta son los domingos.*\nSofter, now that you have the *-ría* form: *Preferiría quedarme en casa.*",
  readAndPick: [
    { q: "What does she like better?", es: "Prefiero el mar a la montaña.",
      options: ["The mountains", "Both the same", "The sea"], answer: 2,
      why: "What comes first is the one she prefers; *a* brings in the other." },
    { q: "Who is going to decide?", es: "Prefiero que decidas tú.",
      options: ["You are", "I am", "We both are"], answer: 0,
      why: "*Que decidas*: the deciding is handed to you, so *que* and the subjunctive." },
    { q: "What does he like least?", es: "Lo que menos me gusta de mi trabajo son las reuniones.",
      options: ["His boss", "The meetings", "The long commute"], answer: 1,
      why: "*Lo que menos me gusta*: the bottom of the list. *Son* agrees with *las reuniones*." },
    { q: "How is she putting it?", es: "Preferiría quedarme en casa esta noche.",
      options: ["Gently", "As a flat no", "As a house rule"], answer: 0,
      why: "*Preferiría*, the *-ría* form, softens it: she'd rather, if that's all right." },
    { q: "Which choice is he making?", es: "Prefiero ir en bus a pagar un taxi.",
      options: ["Taking the bus", "Paying for a taxi", "Walking there"], answer: 0,
      why: "*Prefiero* the bus *a* the taxi: the first one wins." }
  ],
  yourTurn: [
    { en: "I prefer fish to meat.", es: "Prefiero el pescado a la carne.", accept: [] },
    { en: "I'd rather you decided. (to a friend)", es: "Prefiero que decidas tú.", accept: ["Prefiero que tú decidas."] },
    { en: "What I like most about Bogotá is the Sunday ciclovía.", es: "Lo que más me gusta de Bogotá es la ciclovía de los domingos.", accept: ["Lo que más me gusta de Bogotá son los domingos de ciclovía."] },
    { en: "I'd rather walk than wait for the bus.", es: "Prefiero caminar a esperar el bus.", accept: [] },
    { en: "What I like least is Monday mornings.", es: "Lo que menos me gusta son los lunes por la mañana.", accept: ["Lo que menos me gusta son las mañanas de los lunes."] }
  ],
  translate: [
    { en: "I'd rather stay home than go out in this weather.", es: "Prefiero quedarme en casa a salir con este clima.", accept: ["Prefiero quedarme en (la) casa a salir con este [clima|tiempo]."] },
    { en: "I like it better if you come. (to a friend)", es: "Me gusta más que vengas tú.", accept: ["Me gusta más que tú vengas."] },
    { en: "The manager prefers reports to be handed in before Friday.", es: "El gerente prefiere que los informes se entreguen antes del viernes.", accept: ["El gerente prefiere que entreguen los informes antes del viernes."] },
    { en: "We prefer a quiet neighbourhood to a noisy one.", es: "Preferimos un barrio tranquilo a uno ruidoso.", accept: [] },
    { en: "I'd rather not go out tonight.", es: "Preferiría no salir esta noche.", accept: ["Prefiero no salir esta noche."] }
  ],
  register: [
    { es: "Prefiero el té.", en: "I prefer tea.", when: "plain and direct, anywhere" },
    { es: "Me gusta más el té.", en: "I like tea better.", when: "everyday, a little softer than prefiero" },
    { es: "Me quedo con el té.", en: "I'll go for the tea.", when: "choosing between two things, casual" },
    { es: "Preferiría el té, si no es molestia.", en: "I'd rather have tea, if it's no trouble.", when: "polite, as a guest or with a stranger" },
    { es: "El equipo prefiere que la reunión sea el martes.", en: "The team prefers the meeting to be on Tuesday.", when: "at work, a group's choice" }
  ],
  personal: {
    prompt: "Think about where you live. Write one preference with *prefiero... a...*, and what you like most and least about the place.",
    constraints: [
      { type: "regex", pattern: "prefier\\w* .+ (a|al) ", label: "a preference: *prefiero... a...*" },
      { type: "containsWord", word: "lo que más", label: "the favourite: *lo que más me gusta*" },
      { type: "containsWord", word: "lo que menos", label: "the least: *lo que menos me gusta*" }
    ],
    model: "Prefiero caminar a tomar el bus. Lo que más me gusta de mi barrio son los parques. Lo que menos me gusta es el ruido de los sábados."
  },
  pitfalls: [
    "*Prefiero el té que el café* borrows the *más que* shape: with *preferir* it's *a*, so *Prefiero el té al café*.",
    "*Lo que más me gusta es los domingos*: the verb follows what comes after it, so *son los domingos*.",
    "*Prefiero que decides tú* keeps the ordinary form: someone else's action takes *decidas*."
  ]
},

"fn-preguntar-preferencias-b1": {
  source: "merged",
  hook: {
    line: "You're planning a Saturday trip out of Bogotá with two friends, and nobody wants to be the one who decides. The questions that help put both options on the table.",
    es: "¿Prefieres ir a Villa de Leyva o a Guatavita?\n¿O prefieres que decida yo?",
    en: "Would you rather go to Villa de Leyva or to Guatavita?\nOr would you rather I decided?"
  },
  examples: [
    { es: "¿Cuál prefieres, el rojo o el azul?", en: "Which do you prefer, the red one or the blue one?" },
    { es: "¿Con quién prefieres ir, con ella o conmigo?", en: "Who would you rather go with, her or me?" },
    { es: "¿Qué es lo que más te gusta de tu trabajo?", en: "What do you like most about your job?" }
  ],
  rule: "Name both options and let the other person choose: *¿Prefieres el tren o el bus?* *¿Cuál prefieres, el rojo o el azul?* A bare *¿Qué prefieres?* works, but naming them is friendlier and faster.\nTo ask for the favourite: *¿Qué es lo que más te gusta de...?* The worst: *lo que menos*.\nWhen an option is someone doing something: *¿Prefieres que...?* and the subjunctive. *¿Prefieres que vaya yo?* *¿Prefieres que te llame o que te escriba?*\n*¿Qué eliges?* and *¿Con cuál te quedas?* ask for a decision now.\nTo *usted*: *¿Prefiere...?* To a group: *¿Prefieren...?*",
  readAndPick: [
    { q: "Who would do the going?", es: "¿Prefieres que vaya yo?",
      options: ["The speaker", "The listener", "Someone else"], answer: 0,
      why: "*Que vaya yo*: she offers to go herself, so *que* and the subjunctive." },
    { q: "What is being compared?", es: "¿Prefieres que te llame o que te escriba?",
      options: ["Two different times of day", "A call or a text", "Two people"], answer: 1,
      why: "*Llame* or *escriba*: two things she could do, both after *que*." },
    { q: "What is he asking for?", es: "¿Qué es lo que menos te gusta de vivir aquí?",
      options: ["The worst part", "The best part", "How long you've been here"], answer: 0,
      why: "*Lo que menos*: the bottom of the scale, the thing you like least." },
    { q: "What does she want from you?", es: "Hay dos camisas. ¿Con cuál te quedas?",
      options: ["A decision now", "A comparison of the prices", "Where you're staying"], answer: 0,
      why: "*¿Con cuál te quedas?* asks you to pick one, right now." },
    { q: "Who is being asked?", es: "¿Prefieren que empecemos ya o que esperemos a Andrés?",
      options: ["One friend", "Andrés", "A group"], answer: 2,
      why: "*Prefieren* asks several people. *Empecemos* and *esperemos* are things we would do." }
  ],
  yourTurn: [
    { en: "Do you prefer the train or the bus? (to a friend)", es: "¿Prefieres el tren o el bus?", accept: [] },
    { en: "Would you rather I went? (to a friend)", es: "¿Prefieres que vaya yo?", accept: [] },
    { en: "What do you like most about your job? (to a friend)", es: "¿Qué es lo que más te gusta de tu trabajo?", accept: ["¿Qué te gusta más de tu trabajo?", "¿Qué es lo que más te gusta de tu trabajo?"] },
    { en: "Which do you prefer, the red one or the blue one? (to a friend)", es: "¿Cuál prefieres, el rojo o el azul?", accept: ["¿Cuál prefieres: el rojo o el azul?"] },
    { en: "Who would you rather go with, her or me? (to a friend)", es: "¿Con quién prefieres ir, con ella o conmigo?", accept: ["¿Con quién prefieres ir: con ella o conmigo?"] }
  ],
  translate: [
    { en: "Would you rather I called you or wrote to you? (to a friend)", es: "¿Prefieres que te llame o que te escriba?", accept: ["¿Prefieres que te llame o te escriba?"] },
    { en: "What do you like least about living here? (to a friend)", es: "¿Qué es lo que menos te gusta de vivir aquí?", accept: ["¿Qué es lo que menos te gusta de vivir acá?"] },
    { en: "Would you all rather we started now or waited for Andrés?", es: "¿Prefieren que empecemos ya o que esperemos a Andrés?", accept: ["¿Prefieren que empecemos ya o esperemos a Andrés?", "¿Prefieren que empecemos ahora o que esperemos a Andrés?"] },
    { en: "Which one do you choose? (to a friend)", es: "¿Cuál eliges?", accept: ["¿Cuál eliges tú?"] },
    { en: "Would you rather go to the mountains or the beach? (to someone you call usted)", es: "¿Prefiere ir a la montaña o a la playa?", accept: [] }
  ],
  register: [
    { es: "¿Cuál prefieres?", en: "Which do you prefer?", when: "open, when the options are already in view" },
    { es: "¿Tinto o aromática?", en: "Black coffee or herbal tea?", when: "quick, offering two things at home" },
    { es: "¿Con cuál te quedas?", en: "Which one are you going with?", when: "pushing for a decision, among friends" },
    { es: "¿Qué prefiere, ventana o pasillo?", en: "Which would you prefer, window or aisle?", when: "polite service, at a counter or a desk" },
    { es: "¿Cuál de las dos opciones le parece más conveniente?", en: "Which of the two options seems better to you?", when: "formal, at work or in writing" }
  ],
  personal: {
    prompt: "Plan a weekend with a friend. Write two questions: one that names both options, and one offering to do something yourself.",
    constraints: [
      { type: "regex", pattern: "prefier\\w*[^?]* o [^?]*\\?", label: "both options named: *¿Prefieres... o...?*" },
      { type: "subjunctiveAfter", trigger: "prefieres que", label: "*¿Prefieres que...?* and the subjunctive" }
    ],
    model: "¿Prefieres ir al cine o a comer? ¿Prefieres que yo compre las boletas?"
  },
  pitfalls: [
    "*¿Prefieres que voy yo?* keeps the ordinary form: an option someone would carry out takes *vaya*.",
    "*¿Qué prefieres, el rojo o el azul?* works, but *¿Cuál?* is the usual choice when the options are right in front of you.",
    "In Spain you'll hear *¿Os gusta más...?* for a group. In Colombia: *¿Les gusta más...?*"
  ]
},

"fn-sensaciones-fisicas-b1": {
  source: "merged",
  hook: {
    line: "You've just walked up Monserrate, over three thousand metres above the sea. You're hot, you're thirsty, your legs ache and your head is spinning a little. Each of those has its own shape in Spanish.",
    es: "Tengo mucha sed y me duelen las piernas.\nY me siento un poco mareada.",
    en: "I'm really thirsty and my legs hurt.\nAnd I feel a bit dizzy."
  },
  examples: [
    { es: "Tengo frío y tengo sueño.", en: "I'm cold and I'm sleepy." },
    { es: "Estoy muy cansado de caminar.", en: "I'm very tired from walking." },
    { es: "Me duele la cabeza desde ayer.", en: "I've had a headache since yesterday." }
  ],
  rule: "Four shapes for how your body feels.\n*Tener* and a thing: *tengo hambre*, *sed*, *frío*, *calor*, *sueño*. Make it bigger with *mucha* or *mucho*, never *muy*: *tengo mucha hambre*, *mucho frío*.\n*Estar* and a describing word: *estoy cansado*, *estoy mareada*. Never *soy cansado*.\n*Doler* works like *gustar*: what hurts decides the verb. *Me duele la cabeza.* *Me duelen las piernas.* Body parts take *la*, not *mi*.\n*Sentirse* for how you are overall: *Me siento mal.* *Me siento mucho mejor.*\nIn Colombia, feeling vaguely unwell is often *me siento maluco*.",
  readAndPick: [
    { q: "Why *duelen* and not *duele*?", es: "Me duelen mucho los pies.",
      options: ["Several people are in pain", "The feet are plural", "It's in the past"], answer: 1,
      why: "What hurts decides the verb: *los pies*, more than one, so *duelen*." },
    { q: "What does she need?", es: "Tengo mucha sed.",
      options: ["A drink", "A sweater", "A nap"], answer: 0,
      why: "*Sed* is thirst. A sweater would be for *frío*, a nap for *sueño*." },
    { q: "How is he doing overall?", es: "Ya me siento mucho mejor, gracias.",
      options: ["Worse than before", "Better than before", "Exactly the same as last week"], answer: 1,
      why: "*Me siento mucho mejor*: how he is overall, and it's a change for the good." },
    { q: "Why *mucho* and not *muy*?", es: "Tengo mucho frío.",
      options: ["Cold is a thing here", "It sounds more polite to say", "It's very cold outside"], answer: 0,
      why: "With *tener*, cold is a thing you have, so *mucho*. *Muy* goes with describing words." },
    { q: "Who is tired?", es: "Estamos cansados de caminar.",
      options: ["We are", "They are", "You are"], answer: 0,
      why: "*Estamos*: we are. *De caminar* says what tired us out." }
  ],
  yourTurn: [
    { en: "I'm really hungry.", es: "Tengo mucha hambre.", accept: ["Tengo muchísima hambre."] },
    { en: "My ears hurt a lot.", es: "Me duelen mucho los oídos.", accept: ["Me duelen muchísimo los oídos.", "Los oídos me duelen mucho."] },
    { en: "I'm very tired.", es: "Estoy muy cansado.", accept: ["Estoy muy cansada."] },
    { en: "I don't feel well.", es: "No me siento bien.", accept: ["No me siento muy bien."] },
    { en: "We were very thirsty after the walk.", es: "Teníamos mucha sed después de la caminata.", accept: [] }
  ],
  translate: [
    { en: "Their throats hurt a bit.", es: "Les duele un poco la garganta.", accept: ["Les duele la garganta un poco."] },
    { en: "I'm cold and I'm sleepy.", es: "Tengo frío y tengo sueño.", accept: ["Tengo frío y sueño."] },
    { en: "I've felt really bad since yesterday.", es: "Me siento muy mal desde ayer.", accept: [] },
    { en: "When I climb stairs, I don't get tired at all.", es: "Cuando subo escaleras, no me canso nada.", accept: ["Cuando subo (las) escaleras, no me canso para nada."] },
    { en: "I'm hot, can you open the window? (to a friend)", es: "Tengo calor, ¿puedes abrir la ventana?", accept: ["Tengo calor, ¿me abres la ventana?"] }
  ],
  register: [
    { es: "Me siento maluco.", en: "I feel a bit off.", when: "Colombian and everyday, for feeling vaguely unwell" },
    { es: "No me siento bien.", en: "I don't feel well.", when: "plain, with anyone" },
    { es: "Me siento fatal.", en: "I feel awful.", when: "strong, heard more in Spain than in Colombia" },
    { es: "Tengo un malestar general.", en: "I feel generally unwell.", when: "at the doctor's, careful and precise" }
  ],
  personal: {
    prompt: "You've just come back from a long walk in the heat. Write three lines: something you have, something that hurts, and how you feel overall.",
    constraints: [
      { type: "containsAny", words: ["tengo hambre", "tengo sed", "tengo calor", "tengo frío", "tengo sueño", "tengo mucha", "tengo mucho", "tengo muchísima", "tengo muchísimo"], label: "something you have: *tengo sed* or *tengo calor*" },
      { type: "containsAny", words: ["me duele", "me duelen"], label: "something that hurts: *me duele* or *me duelen*" },
      { type: "containsAny", words: ["me siento", "estoy cansad", "estoy maluc"], label: "how you feel overall: *me siento* or *estoy cansado*" }
    ],
    model: "Tengo muchísima sed y mucho calor. Me duelen los pies. Me siento cansada, pero contenta."
  },
  pitfalls: [
    "*Me duele los pies*: the verb follows what hurts, so *me duelen los pies*.",
    "*Tengo muy hambre*: hunger is a thing you have, so *mucha hambre*.",
    "*Soy cansado* would make tiredness who you are: *estoy cansado*."
  ]
},

"fn-preguntar-estado-animo-b1": {
  source: "old",
  hook: {
    line: "Your coworker Felipe has been quiet all morning and hasn't touched his tinto. You want to check on him without prying. Spanish opens with questions that name no feeling at all, so he decides how much to say.",
    es: "¿Todo bien, Felipe?\nTe veo como raro hoy.",
    en: "Everything OK, Felipe?\nYou seem kind of off today."
  },
  examples: [
    { es: "¿Qué te pasa? Llevas toda la mañana callado.", en: "What's wrong? You've been quiet all morning." },
    { es: "¿No estás bravo conmigo?", en: "You're not angry with me, are you?" },
    { es: "¿Seguro que no te pasa nada?", en: "Are you sure nothing's wrong?" }
  ],
  rule: "Start wide, naming no feeling, so they choose how much to tell you:\n*¿Todo bien?* *¿Estás bien?* *¿Te pasa algo?* *¿Qué te pasa?*\nSay what you notice: *Te veo cansado.* *Te noto preocupada.*\nIf they say *nada* and you're not convinced, press gently: *¿Seguro que no te pasa nada?*\nOnly then name a guess: *¿Estás bravo conmigo?* *¿Estás triste por lo de ayer?* A guess can land badly, so it comes last.\nTo someone you call *usted*: *¿Le pasa algo?* *¿Se siente bien?*\nAnd leave the door open: *Si quieres hablar, aquí estoy.*",
  readAndPick: [
    { q: "Does she name a feeling?", es: "¿Te pasa algo? Te noto distinto.",
      options: ["Yes, she means anger", "No, she leaves it open", "Yes, she's naming sadness for him"], answer: 1,
      why: "*¿Te pasa algo?* names nothing: he decides what to tell her." },
    { q: "When would you say this?", es: "¿Seguro que no te pasa nada?",
      options: ["At the very start of the day", "After he said he's fine", "When he's clearly in a good mood"], answer: 1,
      why: "*¿Seguro?* presses after a denial: he said *nada*, she isn't convinced." },
    { q: "What is she guessing?", es: "¿Estás brava conmigo?",
      options: ["You're angry with her", "You're tired", "You're bored of her company"], answer: 0,
      why: "*Brava* is how Colombians say angry. *Conmigo*: with her." },
    { q: "Who is she speaking to?", es: "Don Jorge, ¿se siente bien?",
      options: ["A close friend of hers", "An older man, politely", "Her little brother Mateo"], answer: 1,
      why: "*Don* and *se siente*: the *usted* form, polite and respectful." },
    { q: "What is she doing?", es: "Si quieres hablar, aquí estoy.",
      options: ["Leaving the door open", "Ending the conversation", "Asking for a favour"], answer: 0,
      why: "She isn't pushing: she's there if he wants to talk." }
  ],
  yourTurn: [
    { en: "Is something wrong? (to a friend)", es: "¿Te pasa algo?", accept: [] },
    { en: "Everything OK?", es: "¿Todo bien?", accept: [] },
    { en: "You're not angry with me, are you? (to a friend)", es: "¿No estás bravo conmigo?", accept: ["¿No estás [brava|bravo|molesto|molesta|enojado|enojada] conmigo?"] },
    { en: "You seem tired. (to a friend)", es: "Te veo cansado.", accept: ["Te veo cansada.", "Te noto [cansado|cansada]."] },
    { en: "Are you sure nothing's wrong? (to a friend)", es: "¿Seguro que no te pasa nada?", accept: [] }
  ],
  translate: [
    { en: "What's wrong? You've been quiet all morning. (to a friend)", es: "¿Qué te pasa? Llevas toda la mañana callado.", accept: ["¿Qué te pasa? Llevas toda la mañana callada."] },
    { en: "Aren't you upset about yesterday? (to a friend)", es: "¿No estás molesta por lo de ayer?", accept: ["¿No estás [molesto|molesta|brava|bravo] por lo de ayer?"] },
    { en: "Do you feel all right, ma'am?", es: "¿Se siente bien, señora?", accept: [] },
    { en: "If you want to talk, I'm here. (to a friend)", es: "Si quieres hablar, aquí estoy.", accept: ["Si quieres hablar, acá estoy."] },
    { en: "You seem worried, is something wrong? (to a friend)", es: "Te noto preocupado, ¿te pasa algo?", accept: ["Te [noto|veo] [preocupado|preocupada], ¿te pasa algo?"] }
  ],
  register: [
    { es: "¿Todo bien?", en: "All good?", when: "light, in passing, with anyone" },
    { es: "¿Te pasa algo?", en: "Is something up?", when: "gentle, leaves them room to say no" },
    { es: "¿Qué te pasa?", en: "What's wrong?", when: "direct, when something clearly is wrong" },
    { es: "¿Se encuentra bien?", en: "Are you all right?", when: "polite, to a stranger or someone older" },
    { es: "¿Estás bravo conmigo?", en: "Are you mad at me?", when: "naming a guess, only with someone close" }
  ],
  personal: {
    prompt: "A friend has been quiet all day. Write three lines: an open question, what you notice, and an open door.",
    constraints: [
      { type: "containsAny", words: ["¿todo bien", "¿estás bien", "¿te pasa algo", "¿qué te pasa"], label: "an open question: *¿Todo bien?* or *¿Te pasa algo?*" },
      { type: "containsAny", words: ["te veo", "te noto"], label: "what you notice: *te veo* or *te noto*" },
      { type: "containsAny", words: ["aquí estoy", "acá estoy", "cuenta conmigo", "si quieres hablar"], label: "an open door: *si quieres hablar, aquí estoy*" }
    ],
    model: "¿Todo bien? Te noto un poco triste hoy. Si quieres hablar, aquí estoy."
  },
  pitfalls: [
    "*¿No estás enfadado?* is how Spain says it. In Colombia: *¿No estás bravo?* or *¿molesto?*",
    "Naming a feeling first (*¿Estás deprimida?*) can sound like an accusation: start with *¿Todo bien?*",
    "*¿Seguro que no te pasa nada?* only works after they've said they're fine."
  ]
},

"fn-responder-estado-b1": {
  source: "old",
  hook: {
    line: "Doña Marta, your neighbour, asks how you are every morning in the hallway. In Colombia the answer is never a single word: you say how it's really going, at the right size, and you hand the question back.",
    es: "Ahí vamos, doña Marta. ¿Y usted cómo está?",
    en: "Getting by, doña Marta. And how are you?"
  },
  examples: [
    { es: "Muy bien, gracias. Mañana salgo a vacaciones.", en: "Very well, thanks. I go on holiday tomorrow." },
    { es: "Pues, ahí vamos. Con mucho trabajo.", en: "Well, getting by. Lots of work." },
    { es: "Mucho mejor que la semana pasada, gracias.", en: "Much better than last week, thanks." }
  ],
  rule: "Answer at the size of the truth, then hand it back.\nFine: *Bien, gracias.* *Muy bien.*\nIn between: *Ahí vamos.* *Más o menos.* *Regular.* *Pues, normal.*\nBetter than before: *Mucho mejor, gracias.*\nNot good: *No muy bien, la verdad.* *Mal, la verdad.*\nThen return it: *¿Y tú?* *¿Y usted?* *¿Y tú qué tal?* Leaving it out sounds as if you don't care.\nIf you want to talk, add the news: *Bien, gracias, mañana salgo a vacaciones.*\n*Ahí vamos* is very Colombian: getting by, nothing much to report.",
  readAndPick: [
    { q: "How is she really doing?", es: "Ahí vamos, con mucho trabajo.",
      options: ["Getting by", "Really wonderful", "Quite ill today"], answer: 0,
      why: "*Ahí vamos*: getting by. The work is the reason it isn't better." },
    { q: "What is missing from this answer?", es: "Muy bien, gracias.",
      options: ["A word of greeting", "A polite apology", "Asking it back"], answer: 2,
      why: "Without *¿y tú?* or *¿y usted?* it can sound as if you don't care." },
    { q: "What does *mucho mejor* tell you?", es: "Mucho mejor, gracias. ¿Y tú?",
      options: ["She's always been fine", "She was unwell before", "She's not well at all today"], answer: 1,
      why: "*Mejor* compares with before: she has been ill or down." },
    { q: "Who is he talking to?", es: "Bien, gracias. ¿Y usted cómo está?",
      options: ["His best friend from school", "A neighbour, politely", "His little sister"], answer: 1,
      why: "*¿Y usted?* hands the question back politely, to someone he calls *usted*." },
    { q: "Why add the news?", es: "Bien, gracias, mañana salgo a vacaciones.",
      options: ["To end the chat as quickly as possible", "To open a real conversation", "To complain about work"], answer: 1,
      why: "The news gives the other person something to pick up and talk about." }
  ],
  yourTurn: [
    { en: "Very well, thanks, and you? (to a friend)", es: "Muy bien, gracias, ¿y tú?", accept: ["Muy bien, gracias. ¿Y tú?"] },
    { en: "Getting by. And how are you? (to someone you call usted)", es: "Ahí vamos. ¿Y usted cómo está?", accept: ["Ahí vamos. ¿Y usted?"] },
    { en: "Much better, thanks.", es: "Mucho mejor, gracias.", accept: [] },
    { en: "Not very well, to be honest.", es: "No muy bien, la verdad.", accept: [] },
    { en: "So-so. Very busy these days.", es: "Más o menos. Con mucho trabajo estos días.", accept: ["Regular. Con mucho trabajo estos días."] }
  ],
  translate: [
    { en: "Very well, thanks, and yours? (about the family)", es: "Muy bien, gracias, ¿y la tuya?", accept: [] },
    { en: "Much better than last week, honestly.", es: "Mucho mejor que la semana pasada, la verdad.", accept: [] },
    { en: "Fine, thanks: tomorrow I go on holiday.", es: "Bien, gracias: mañana salgo a vacaciones.", accept: ["Bien, gracias, mañana salgo [a|de] vacaciones.", "Bien, gracias. Mañana salgo [a|de] vacaciones."] },
    { en: "Well, normal. And you, how are things? (to a friend)", es: "Pues, normal. ¿Y tú qué tal?", accept: ["Pues normal. ¿Y tú qué tal?"] },
    { en: "Bad, to be honest. My mother is in hospital.", es: "Mal, la verdad. Mi mamá está en el hospital.", accept: ["Mal, la verdad. Mi [mamá|madre] está en el hospital."] }
  ],
  register: [
    { es: "¡Súper bien!", en: "Really great!", when: "enthusiastic, with friends" },
    { es: "Bien, gracias, ¿y usted?", en: "Fine, thanks, and you?", when: "the safe answer, with anyone" },
    { es: "Ahí vamos.", en: "Getting by.", when: "Colombian and honest, nothing much to report" },
    { es: "Ahí, en la lucha.", en: "Hanging in there.", when: "Colombian, when things are a bit hard" },
    { es: "Muy bien, gracias por preguntar.", en: "Very well, thank you for asking.", when: "polite, at work or with someone older" }
  ],
  personal: {
    prompt: "Someone you call usted asks how you are. Answer honestly in two or three lines, add one piece of news, and hand the question back.",
    constraints: [
      { type: "containsAny", words: ["bien", "mejor", "ahí vamos", "más o menos", "regular", "normal", "mal"], label: "how you are, at the right size" },
      { type: "containsAny", words: ["¿y usted", "¿y a usted"], label: "the question handed back: *¿Y usted?*" },
      { type: "minSentences", n: 2, label: "two lines or more" }
    ],
    model: "Ahí vamos, gracias. Esta semana tengo mucho trabajo, pero el viernes salgo a vacaciones. ¿Y usted cómo está?"
  },
  pitfalls: [
    "Not handing it back (*¿y tú?*) can sound cold, even in a quick hello in the hallway.",
    "*Así así* is understood everywhere, but in Colombia you'll hear *más o menos* or *ahí vamos* far more."
  ]
},

"nt-evaluacion-valor-b1": {
  source: "merged",
  hook: {
    line: "Saturday morning at the Paloquemao market in Bogotá: prices change by the stall and by the day, and everyone has a verdict on everything. You need to ask what something's going for, and say what you think of it.",
    es: "¿A cuánto está el aguacate hoy?\nMe parece un poco caro para lo que es.",
    en: "What are avocados going for today?\nIt seems a bit expensive to me for what it is."
  },
  examples: [
    { es: "Esta chaqueta está en oferta: tiene un veinte por ciento de descuento.", en: "This jacket is on sale: it's twenty per cent off." },
    { es: "Me parecen carísimos, pero la calidad es buenísima.", en: "They seem really expensive to me, but the quality is excellent." },
    { es: "Esos zapatos te quedan muy bien.", en: "Those shoes look really good on you." }
  ],
  rule: "*Me parece* works like *me gusta*: what you judge decides the verb, and *me* says who judges. *Me parece caro.* *Me parecen caros.* *¿Qué te parece?*\n*Lo encuentro caro* says the same with a little more weight. *Te queda bien* says it suits you.\nSpanish prefers one vivid word to a pile of *muy*: *buenísimo*, *carísimo*, *una maravilla*, *un desastre*.\nFor prices that move (the market, the dollar): *¿A cuánto está el aguacate?* *Está a cinco mil el kilo.* A fixed price is *¿Cuánto cuesta?*\nA deal: *está en oferta*, *tiene un 20 % de descuento*, *está rebajada*.\nAnd *vale la pena* says it's worth it.",
  readAndPick: [
    { q: "Why *parecen*?", es: "Me parecen carísimos estos zapatos.",
      options: ["She is talking to a group", "The shoes are plural", "It was yesterday"], answer: 1,
      why: "What you judge decides the verb: *estos zapatos*, so *parecen*." },
    { q: "What kind of price is this?", es: "¿A cuánto están los tomates hoy?",
      options: ["A price fixed by the shop", "A discount", "One that changes daily"], answer: 2,
      why: "*¿A cuánto está?* is for prices that move, like the market's." },
    { q: "Is it worth buying?", es: "Es caro, pero vale la pena.",
      options: ["Yes, despite the price", "No, it's far too expensive", "Only when it's on sale"], answer: 0,
      why: "*Vale la pena*: it's worth it, even though it's *caro*." },
    { q: "What do they think of the plan?", es: "Nos parece perfecto el plan.",
      options: ["They love it", "They have doubts", "They haven't seen it"], answer: 0,
      why: "*Nos parece perfecto*: the plan seems perfect to us." },
    { q: "What happened to the price?", es: "La camisa está rebajada.",
      options: ["It went up", "It was cut", "It's the usual"], answer: 1,
      why: "*Rebajada*: the price has been brought down. It matches *la camisa*." }
  ],
  yourTurn: [
    { en: "It seems very expensive to me.", es: "Me parece muy caro.", accept: ["Me parece carísimo.", "Lo encuentro muy caro."] },
    { en: "What are the tomatoes going for today?", es: "¿A cuánto están los tomates hoy?", accept: ["¿A cuánto están hoy los tomates?"] },
    { en: "What do you think of the proposal? (to a friend)", es: "¿Qué te parece la propuesta?", accept: [] },
    { en: "The juice is on sale.", es: "El jugo está en oferta.", accept: ["El jugo está en promoción."] },
    { en: "It's expensive, but it's worth it.", es: "Es caro, pero vale la pena.", accept: [] }
  ],
  translate: [
    { en: "I find it a bit expensive for what it is.", es: "Lo encuentro un poco caro para lo que es.", accept: ["Me parece un poco caro para lo que es."] },
    { en: "The plan seems perfect to us.", es: "Nos parece perfecto el plan.", accept: ["El plan nos parece perfecto."] },
    { en: "Avocados are five thousand a kilo.", es: "El aguacate está a cinco mil el kilo.", accept: ["Los aguacates están a cinco mil el kilo."] },
    { en: "This jacket is twenty per cent off.", es: "Esta chaqueta tiene un veinte por ciento de descuento.", accept: ["Esta chaqueta tiene veinte por ciento de descuento."] },
    { en: "The concert was a disaster.", es: "El concierto fue un desastre.", accept: [] },
    { en: "Those shoes look really good on you. (to a friend)", es: "Esos zapatos te quedan muy bien.", accept: [] }
  ],
  register: [
    { es: "¡Está buenísimo!", en: "It's really good!", when: "enthusiastic, with friends" },
    { es: "¡Está muy chévere!", en: "It's really great!", when: "Colombian, warm and everyday" },
    { es: "Me parece bien.", en: "It seems fine to me.", when: "plain approval, anywhere" },
    { es: "Lo encuentro algo caro.", en: "I find it somewhat expensive.", when: "measured, in a shop or a review" },
    { es: "Considero que el precio es elevado.", en: "I consider the price to be high.", when: "formal, in writing or a complaint" }
  ],
  personal: {
    prompt: "Think of something you bought or saw recently. Give your verdict with *me parece* or *me pareció*, and say whether it was worth it.",
    constraints: [
      { type: "containsAny", words: ["me parece", "me parecen", "me pareció", "me parecieron", "lo encuentro", "la encuentro"], label: "your verdict: *me parece* or *me pareció*" },
      { type: "containsAny", words: ["vale la pena", "valió la pena"], label: "*vale la pena* or *no vale la pena*" }
    ],
    model: "Me pareció carísimo el celular nuevo, pero la cámara es una maravilla. Creo que valió la pena."
  },
  pitfalls: [
    "*Yo parezco caro* makes you the expensive one: *me parece caro*.",
    "*Merece la pena* is how Spain says it. In Colombia: *vale la pena*.",
    "*¿A cuánto cuesta?* mixes the two: a moving price is *¿A cuánto está?*, a fixed one *¿Cuánto cuesta?*"
  ]
},

"nt-exito-utilidad-importancia-b1": {
  source: "merged",
  hook: {
    line: "Your nephew has a new phone and is showing you what every button is for, what doesn't work, and how good he is with all of it. Spanish says what a thing is for with *servir para*, and what a person does well with *ser bueno para*.",
    es: "¿Y este botón para qué sirve?\nTú sí eres bueno para la tecnología.",
    en: "And what's this button for?\nYou really are good with technology."
  },
  examples: [
    { es: "Este cargador ya no sirve.", en: "This charger doesn't work any more." },
    { es: "Mi hermana es muy buena para los idiomas.", en: "My sister is very good at languages." },
    { es: "Intentó ganar el concurso y lo logró.", en: "She tried to win the contest, and she managed it." }
  ],
  rule: "What a thing is for: *servir para* and the dictionary form. *¿Para qué sirve esto?* *Sirve para abrir botellas.* *No sirve* says it doesn't work.\nWhether it works right now: *funcionar*. *La app no funciona.*\nWhat a person is good at: *ser bueno para* an activity, *en* a subject. *Es bueno para cocinar.* *Es buena en matemáticas.*\nTrying and succeeding are two steps: *intentar*, then *lograr* or *conseguir*. *Lo intenté, pero no lo logré.*\nHow much it matters: *tiene mucha importancia*, *no le des importancia*.\nA judgement takes the subjunctive: *Es raro que llegue tarde.*",
  readAndPick: [
    { q: "What's wrong with the charger?", es: "Este cargador ya no sirve.",
      options: ["It's the wrong colour for the phone", "It's too slow", "It doesn't work any more"], answer: 2,
      why: "*No sirve*, with nothing after it, is how Colombians say it's broken." },
    { q: "What is she good at?", es: "Mi hermana es muy buena para cocinar.",
      options: ["Eating out", "Cooking", "Shopping"], answer: 1,
      why: "*Buena para* and an activity: *cocinar*, cooking." },
    { q: "Did they win?", es: "Intentaron ganar el partido, pero no lo lograron.",
      options: ["Yes, easily", "They tried and lost", "They didn't even try to win"], answer: 1,
      why: "*Intentaron* is the attempt, *no lo lograron* the result: no win." },
    { q: "What is he telling her?", es: "No le des importancia, fue un chiste.",
      options: ["Not to worry about it", "To laugh more often", "To tell the joke again"], answer: 0,
      why: "*No le des importancia*: don't make a big deal of it." },
    { q: "Why *llegue*?", es: "Es raro que Andrés llegue tarde, siempre es puntual.",
      options: ["She's judging it", "He comes tomorrow", "She's sure he's late"], answer: 0,
      why: "*Es raro que* is a judgement, so the verb after it takes the subjunctive." }
  ],
  yourTurn: [
    { en: "What's this button for?", es: "¿Para qué sirve este botón?", accept: ["¿Este botón para qué sirve?"] },
    { en: "She's very good at maths.", es: "Es muy buena en matemáticas.", accept: ["Es muy buena para las matemáticas."] },
    { en: "This app doesn't work well on my phone.", es: "Esta aplicación no funciona bien en mi celular.", accept: ["Esta app no funciona bien en mi celular."] },
    { en: "They tried to win the contest but didn't manage it.", es: "Intentaron ganar el concurso, pero no lo lograron.", accept: ["Intentaron ganar el concurso, pero no lo consiguieron."] },
    { en: "Don't make a big deal of it. (to a friend)", es: "No le des importancia.", accept: [] }
  ],
  translate: [
    { en: "It's for opening bottles.", es: "Sirve para abrir botellas.", accept: [] },
    { en: "It's quite unusual for him to be late, he's usually punctual.", es: "Es bastante raro que llegue tarde, normalmente es puntual.", accept: [] },
    { en: "That doesn't matter.", es: "Eso no tiene importancia.", accept: [] },
    { en: "I don't mind whether we go to the cinema or stay home.", es: "Me da igual ir al cine o quedarnos en la casa.", accept: ["Me da igual ir al cine o quedarnos en casa.", "Me da igual si vamos al cine o nos quedamos en (la) casa."] },
    { en: "He's a genius with languages.", es: "Es un genio para los idiomas.", accept: [] },
    { en: "This old phone still works.", es: "Este celular viejo todavía sirve.", accept: ["Este celular viejo todavía funciona."] }
  ],
  register: [
    { es: "No sirve.", en: "It doesn't work.", when: "everyday Colombian, for anything broken" },
    { es: "Se dañó.", en: "It broke down.", when: "Colombian, for a machine that stopped working" },
    { es: "No funciona.", en: "It isn't working.", when: "neutral, anywhere" },
    { es: "El equipo presenta una falla.", en: "The device has a fault.", when: "formal, a complaint or a technical report" }
  ],
  personal: {
    prompt: "Write about an object you use every day and a person you know: what the object is for, and what the person is good at.",
    constraints: [
      { type: "containsAny", words: ["sirve para", "sirven para"], label: "what it's for: *sirve para*" },
      { type: "regex", pattern: "buen[oa]s? (para|en) ", label: "what they're good at: *es bueno para* or *en*" }
    ],
    model: "Mi bicicleta vieja sirve para ir al trabajo sin trancón. Mi hermano es muy bueno para arreglarla."
  },
  pitfalls: [
    "*Es bueno de matemáticas* swaps the little word: *bueno en matemáticas*, *bueno para cocinar*.",
    "*Mi celular no trabaja* is word for word: phones *no sirven* or *no funcionan*.",
    "*Es raro que llega tarde* keeps the ordinary form: a judgement takes *que llegue*."
  ]
},

"task-b1-gustos": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: your tastes in something you care about, at B1 depth. Not only what you like, but what you like other people to do, what you'd rather, and what you can't stand.",
    es: "Me gusta que la gente venga a la casa.\nLo que no soporto es que traigan postre sin avisar.",
    en: "I like it when people come over.\nWhat I can't stand is them bringing dessert without telling me."
  },
  examples: [
    { es: "Prefiero cocinar dos horas un domingo a hacer algo rápido cada noche.", en: "I'd rather cook for two hours on a Sunday than make something quick every night." },
    { es: "Me pone nervioso que lleguen antes de que todo esté listo.", en: "It makes me nervous when they arrive before everything is ready." }
  ],
  rule: "Build the piece from the moves of the unit.\nWhat you like doing: *Me encanta cocinar.*\nWhat you like others to do, with *que* and the subjunctive: *Me gusta que la gente venga.* *Me molesta que lleguen tarde.*\nA preference with *a*: *Prefiero el arroz a la papa.*\nThe top and the bottom: *Lo que más me gusta es...* *Lo que no soporto es...*\nWhat doesn't matter: *Me da igual si traen vino o jugo.*\nA turn with *pero* or *en cambio*.\nTen sentences or more, and at least three about what other people do.",
  readAndPick: [
    { q: "What bothers him?", es: "Me molesta que traigan postre sin avisar.",
      options: ["Having to make the dessert himself", "Dessert turning up unannounced", "People arriving late"], answer: 1,
      why: "*Que traigan postre sin avisar*: what other people do, so the subjunctive." },
    { q: "Which does he prefer?", es: "Prefiero cocinar el domingo a hacer algo rápido cada noche.",
      options: ["A quick dish every night", "Eating out on weekdays", "One long Sunday session"], answer: 2,
      why: "What comes before *a* wins: cooking on Sunday." },
    { q: "Why does *esté* change?", es: "Me pone nervioso que lleguen antes de que todo esté listo.",
      options: ["Nothing is ready yet then", "It all happened many years ago", "He's a nervous person"], answer: 0,
      why: "After *antes de que* it hasn't happened yet, so the subjunctive." },
    { q: "What doesn't matter to him?", es: "Me da igual si traen vino o jugo.",
      options: ["What drink they bring", "What time they come over", "Who comes along with them"], answer: 0,
      why: "*Me da igual si...*: wine or juice, it's all the same to him." },
    { q: "What does she like best?", es: "De todo lo que cocino, lo que más me gusta es el arroz.",
      options: ["The rice", "The desserts", "The soups"], answer: 0,
      why: "*Lo que más me gusta es el arroz*: the top of her list." }
  ],
  yourTurn: [
    { en: "I like it when people come over.", es: "Me gusta que la gente venga a la casa.", accept: ["Me gusta que la gente venga a casa.", "Me gusta que venga gente a la casa."] },
    { en: "It annoys me when they arrive late.", es: "Me molesta que lleguen tarde.", accept: [] },
    { en: "What I like most is the rice.", es: "Lo que más me gusta es el arroz.", accept: [] },
    { en: "I don't mind if they bring wine or juice.", es: "Me da igual si traen vino o jugo.", accept: [] }
  ],
  translate: [
    { en: "What I can't stand is cooking in a hurry.", es: "Lo que no soporto es cocinar con afán.", accept: ["Lo que no soporto es cocinar [con prisa|de afán]."] },
    { en: "I'd rather cook for two hours on a Sunday than make something quick every night.", es: "Prefiero cocinar dos horas un domingo a hacer algo rápido cada noche.", accept: [] },
    { en: "It makes me nervous when they arrive before everything is ready.", es: "Me pone nervioso que lleguen antes de que todo esté listo.", accept: ["Me pone [nervioso|nerviosa] que lleguen antes de que esté todo listo.", "Me pone nerviosa que lleguen antes de que todo esté listo."] },
    { en: "My father made it better, but I don't tell anyone that.", es: "Mi papá lo hacía mejor, pero eso no se lo digo a nadie.", accept: ["Mi padre lo hacía mejor, pero eso no se lo digo a nadie."] },
    { en: "I love it when my friends stay until late.", es: "Me encanta que mis amigos se queden hasta tarde.", accept: [] }
  ],
  register: [
    { es: "Me encanta que vengan.", en: "I love it when they come.", when: "warm, to friends or family" },
    { es: "No me gusta mucho que lleguen tarde.", en: "I'm not too keen on them being late.", when: "a gentle complaint, said kindly" },
    { es: "Me choca que lleguen tarde.", en: "It really bugs me when they're late.", when: "Colombian and colloquial, among friends" },
    { es: "No soporto que lleguen tarde.", en: "I can't stand them being late.", when: "strong, when it really bothers you" },
    { es: "Les pido el favor de llegar a tiempo.", en: "Please be on time.", when: "polite, in a group message or a notice" }
  ],
  personal: {
    prompt: "Write about your tastes in something you care about, like food, music or your home: ten sentences or more, with at least three things you like or dislike other people doing.",
    constraints: [
      { type: "minSentences", n: 10, label: "ten sentences or more" },
      { type: "regex", pattern: "(gusta|encanta|molesta|choca|soporto|importa) que", label: "*me gusta que* or *me molesta que*" },
      { type: "anyVerbInTense", tense: "presubj", label: "the subjunctive after it" },
      { type: "regex", pattern: "prefier\\w* .+ (a|al) ", label: "a preference: *prefiero... a...*" },
      { type: "containsAny", words: ["lo que más", "lo que menos", "lo que no soporto"], label: "the top or the bottom: *lo que más me gusta*" }
    ],
    model: "Me encanta cocinar, pero solo cuando tengo tiempo. Lo que no soporto es cocinar con afán. Prefiero pasar dos horas en la cocina un domingo a hacer algo rápido cada noche. Me gusta que la gente venga a la casa a almorzar. Eso sí, me pone nervioso que lleguen antes de que todo esté listo. Me da igual si traen vino o jugo. Lo que me molesta es que traigan postre sin avisar, porque yo ya hice uno. Me encanta que se queden hasta tarde hablando. De todo lo que cocino, lo que más me gusta es el arroz con coco. Mi papá lo hacía mejor, pero eso no se lo digo a nadie."
  },
  pitfalls: [
    "*Me gusta que vienen* keeps the ordinary form: what others do takes *vengan*.",
    "*Ya he hecho uno* is how Spain says it. In Colombia, the plain past: *ya hice uno*."
  ]
},

/* ---- unit b1-u36 · Telling a longer story -------------------------------- */

"gr-pluscuamperfecto-b1": {
  source: "merged",
  hook: {
    line: "Your friend Santiago got to the airport in Cartagena and found his plane gone. To tell it, you need a past that reaches behind another past: one thing was already over when the other happened.",
    es: "Cuando llegamos al aeropuerto, el avión ya había salido.",
    en: "When we got to the airport, the plane had already left."
  },
  examples: [
    { es: "Cuando llegué, ya se había ido.", en: "When I arrived, he had already left." },
    { es: "Cuando llegué, se fue.", en: "When I arrived, he left." },
    { es: "Nunca había visto un lugar tan bonito.", en: "I had never seen such a beautiful place." }
  ],
  rule: "Two past moments, and one was already over before the other: *había* and the *-ado* or *-ido* form.\n*había, habías, había, habíamos, habían* + *hablado*, *comido*, *salido*.\nThe odd ones are the ones you know: *hecho*, *dicho*, *visto*, *escrito*, *puesto*, *vuelto*, *abierto*.\n*Cuando llegué, ya se había ido*: he left first. *Cuando llegué, se fue*: I arrived, then he left.\n*Ya*, *nunca* and *todavía no* go in front: *ya se había ido*, *todavía no había comido*. Nothing goes between the two parts.\nIt always looks back from another past moment. On its own, *Ayer fui al mercado* is just the plain past.",
  readAndPick: [
    { q: "What happened first?", es: "Cuando llegamos, ya se había ido.",
      options: ["We arrived", "He left", "Both at once"], answer: 1,
      why: "*Se había ido*: his leaving was already over when we arrived." },
    { q: "Was he still there when I arrived?", es: "Cuando llegué, se fue.",
      options: ["Yes, he left after that", "No, he'd already gone home", "He never came at all"], answer: 0,
      why: "Two plain pasts tell it in order: I arrived, then he left." },
    { q: "Had she been there before?", es: "Nunca había visto un lugar tan bonito.",
      options: ["Many times", "Once, as a little child", "Never, until then"], answer: 2,
      why: "*Nunca había visto*: up to that moment in the past, never." },
    { q: "When did he make the mistake?", es: "Se dio cuenta de que había cometido un error.",
      options: ["After he noticed it", "Before he noticed", "While he was asleep"], answer: 1,
      why: "*Había cometido* steps back: the mistake came before the realising." },
    { q: "Had they eaten when he called?", es: "Ya habíamos cenado cuando llamó.",
      options: ["No, not yet", "They ate together", "Yes, already"], answer: 2,
      why: "*Ya habíamos cenado*: dinner was over before the call." }
  ],
  yourTurn: [
    { en: "When I arrived, he had already left.", es: "Cuando llegué, ya se había ido.", accept: ["Cuando llegué, él ya se había ido.", "Cuando llegué ya se había ido."] },
    { en: "I had never seen so many people.", es: "Nunca había visto tanta gente.", accept: ["No había visto nunca tanta gente."] },
    { en: "We hadn't eaten yet.", es: "Todavía no habíamos comido.", accept: ["Aún no habíamos comido."] },
    { en: "Had you already spoken with Andrés? (to a friend)", es: "¿Ya habías hablado con Andrés?", accept: ["¿Habías hablado ya con Andrés?"] },
    { en: "When the class started, I had already done the homework.", es: "Cuando empezó la clase, ya había hecho la tarea.", accept: [] }
  ],
  translate: [
    { en: "We had already had dinner when he called.", es: "Ya habíamos cenado cuando llamó.", accept: ["Ya habíamos comido cuando llamó."] },
    { en: "He realised he had made a mistake.", es: "Se dio cuenta de que había cometido un error.", accept: ["Se dio cuenta de que se había equivocado."] },
    { en: "When I arrived, he left.", es: "Cuando llegué, se fue.", accept: [] },
    { en: "When I called, Felipe still hadn't left.", es: "Cuando llamé, Felipe todavía no había salido.", accept: ["Cuando llamé, Felipe aún no había salido."] },
    { en: "I didn't know you had lived in Cali. (to a friend)", es: "No sabía que habías vivido en Cali.", accept: [] },
    { en: "Yesterday I went to the market.", es: "Ayer fui al mercado.", accept: ["Ayer fui a la plaza de mercado."] }
  ],
  register: [
    { es: "Cuando llegué, ya se había ido.", en: "When I arrived, he had already left.", when: "the clear way, in any story" },
    { es: "Cuando llegué, se acababa de ir.", en: "When I arrived, he had just left.", when: "a tiny gap, a moment before" },
    { es: "Para cuando llegué, ya se había ido.", en: "By the time I arrived, he'd already gone.", when: "stressing that you were too late" },
    { es: "Al llegar, comprobamos que el vuelo había salido.", en: "On arrival, we found the flight had left.", when: "formal, in a report or a complaint" }
  ],
  personal: {
    prompt: "Think of a time you arrived somewhere too late. Write two or three lines: when you arrived, and what had already happened.",
    constraints: [
      { type: "anyVerbInTense", tense: "plusc", label: "what had already happened: *había* and the *-ado* or *-ido* form" },
      { type: "containsAny", words: ["cuando llegué", "cuando llegamos", "cuando llegó"], label: "the other past moment: *cuando llegué*" }
    ],
    model: "Cuando llegué a la fiesta, ya se había acabado la torta. Todos los invitados se habían ido a bailar."
  },
  pitfalls: [
    "*Cuando llegué, ya se fue* loses the order: if it was over before, *ya se había ido*.",
    "*Había escribido* is not a form: *había escrito*, the same odd one as after *he*.",
    "*Ya había se ido* splits the pair: little words go in front, *ya se había ido*."
  ]
},

"gn-narrar-estructura-b1": {
  source: "merged",
  hook: {
    line: "A friend asks what happened at the beach last weekend, and you want to tell it the way people do: calm at first, then the scare, what you did, how it ended, and what it means now. The shape matters as much as the verbs.",
    es: "Estaba tranquila en la playa, y de pronto oí que alguien gritaba.",
    en: "I was relaxing on the beach, and suddenly I heard someone shouting."
  },
  examples: [
    { es: "Aquella tarde todo estaba muy tranquilo hasta que sonó la alarma.", en: "That afternoon everything was very calm until the alarm went off." },
    { es: "Me contó que había perdido el vuelo y que tendría que esperar hasta el día siguiente.", en: "He told me he had missed his flight and would have to wait until the next day." },
    { es: "Al final resultó que todo había sido un malentendido.", en: "In the end it turned out it had all been a misunderstanding." }
  ],
  rule: "A story has five parts:\nthe calm start, with the scene in *-aba* and *-ía*: *Era domingo y hacía sol.*\nthe trouble, in the plain past: *De pronto oí un grito.*\nwhat you did: *Corrimos hacia el agua.*\nhow it settled: *El salvavidas lo sacó.*\na closing thought, often in the present: *Todavía me acuerdo de ese día.*\nFold what people said into the story: *Me dijo que estaba de vacaciones.* *Me contó que había perdido el vuelo.* *Prometió que llamaría.*\nEach verb has a job: moving the story, painting the scene, or stepping back with *había*.",
  readAndPick: [
    { q: "Which part of the story is this?", es: "Era domingo y la playa estaba casi vacía.",
      options: ["The calm start", "The trouble", "The closing thought"], answer: 0,
      why: "*Era* and *estaba* paint the scene: nothing has happened yet." },
    { q: "Which part of the story is this?", es: "De pronto oí que alguien gritaba en el agua.",
      options: ["The calm start", "The closing thought", "The trouble"], answer: 2,
      why: "*De pronto* and the plain past *oí*: something breaks the calm." },
    { q: "What were her own words?", es: "Me dijo que estaba de vacaciones.",
      options: ["I'm on holiday", "I was on holiday", "I'll be on holiday"], answer: 0,
      why: "She said *estoy de vacaciones*; told from the past, it steps back to *estaba*." },
    { q: "What had happened to him?", es: "Me contó que había perdido el vuelo.",
      options: ["He'll miss it tomorrow", "He missed it earlier", "He's on the plane"], answer: 1,
      why: "*Había perdido*: the missing came before he told me about it." },
    { q: "When is this sentence set?", es: "Al final todo salió bien, aunque todavía me acuerdo de ese día.",
      options: ["Only in the past", "The past, then now", "Only in the future"], answer: 1,
      why: "*Salió* closes the story; *todavía me acuerdo* brings it to today." }
  ],
  yourTurn: [
    { en: "It was Sunday and it was raining.", es: "Era domingo y llovía.", accept: ["Era domingo y estaba lloviendo."] },
    { en: "Suddenly I heard a shout.", es: "De pronto oí un grito.", accept: ["De repente oí un grito."] },
    { en: "She told me she was on holiday.", es: "Me dijo que estaba de vacaciones.", accept: [] },
    { en: "He promised he would call.", es: "Prometió que llamaría.", accept: ["Me prometió que llamaría."] },
    { en: "In the end everything turned out fine.", es: "Al final todo salió bien.", accept: ["Al final, todo salió bien."] }
  ],
  translate: [
    { en: "That afternoon everything was very calm until the alarm went off.", es: "Aquella tarde todo estaba muy tranquilo hasta que sonó la alarma.", accept: ["Esa tarde todo estaba muy tranquilo hasta que sonó la alarma."] },
    { en: "He told me he had missed his flight.", es: "Me contó que había perdido el vuelo.", accept: ["Me dijo que había perdido el vuelo."] },
    { en: "In the end it turned out it had all been a misunderstanding.", es: "Al final resultó que todo había sido un malentendido.", accept: [] },
    { en: "I was reading when the phone rang.", es: "Estaba leyendo cuando sonó el celular.", accept: ["Estaba leyendo cuando sonó el teléfono."] },
    { en: "I still remember that day.", es: "Todavía me acuerdo de ese día.", accept: ["Aún me acuerdo de ese día.", "Todavía recuerdo ese día."] }
  ],
  register: [
    { es: "El otro día me pasó algo...", en: "The other day something happened to me...", when: "casual, starting an anecdote" },
    { es: "Pues resulta que...", en: "So it turns out that...", when: "with a friend, to launch the story" },
    { es: "Total, que al final no fuimos.", en: "So anyway, in the end we didn't go.", when: "closing a story, casually" },
    { es: "Los hechos ocurrieron el domingo en la tarde.", en: "The events took place on Sunday afternoon.", when: "formal, in a report or a statement" }
  ],
  personal: {
    prompt: "Tell a short story that happened to you, in five or six sentences: a calm start, the trouble, what you did, how it ended and a closing thought. Fold in one thing someone said.",
    constraints: [
      { type: "minSentences", n: 5, label: "five sentences or more" },
      { type: "anyVerbInTense", tense: "imperfecto", label: "the scene: *era*, *estaba*, *hacía*" },
      { type: "anyVerbInTense", tense: "preterito", label: "the events in the plain past" },
      { type: "regex", pattern: "(dijo|contó|explicó|prometió) que", label: "what someone said: *me dijo que*" }
    ],
    model: "Era sábado y estaba en un bus hacia Villa de Leyva. De repente el bus se varó en plena carretera. Todos nos bajamos y esperamos casi dos horas. El conductor nos dijo que otro bus venía en camino. Al final llegamos de noche, cansados pero contentos. Todavía me río cuando me acuerdo de ese viaje."
  },
  pitfalls: [
    "*Era domingo y llovió* puts the weather among the events: the scene takes *llovía*.",
    "*Me dijo que está de vacaciones* can sound as if it's still true now: in a past story, *estaba*.",
    "A row of events isn't yet a story: give it a start, a turn and an ending."
  ]
},

"fn-introducir-tema-relato-b1": {
  source: "old",
  hook: {
    line: "Something unbelievable happened to you on the Transmilenio this morning, and your friend is scrolling on her phone. Before you tell the story, you need her attention, and Spanish has set phrases for exactly that.",
    es: "Oye, tengo que contarte una cosa.\nNo te lo vas a creer.",
    en: "Hey, I have to tell you something.\nYou're not going to believe it."
  },
  examples: [
    { es: "¿Tienes un minuto? Te cuento lo que me pasó.", en: "Have you got a minute? I'll tell you what happened to me." },
    { es: "Te cuento que me ascendieron.", en: "Let me tell you: I got promoted." },
    { es: "Escucha un momento, por favor, es importante.", en: "Listen for a moment, please, it's important." }
  ],
  rule: "Before a story, ask for the floor.\nPromise something good: *No te lo vas a creer.* *¡Te tengo un chisme!*\nSay there's something to tell: *Tengo que contarte una cosa.* *Te cuento que...* is very Colombian, and goes straight to the news.\nCheck they have time: *¿Tienes un minuto?* *¿Tienes un momento?*\nAsk for attention outright: *Oye...* *Mira...* *Escucha un momento, por favor.*\nTo *usted*: *¿Tiene un momento? Le quiero contar algo.*\nThen start the story, often with *Pues...* or *Resulta que...*",
  readAndPick: [
    { q: "What is she doing?", es: "Oye, ¿tienes un minuto? Tengo que contarte algo.",
      options: ["Asking you what time it is", "Ending the chat", "Checking you have time"], answer: 2,
      why: "*¿Tienes un minuto?* checks you're free before the story starts." },
    { q: "What does she expect you to say?", es: "No te lo vas a creer.",
      options: ["Nothing yet, just listen", "That you don't believe her", "That you already know"], answer: 0,
      why: "It isn't a real claim: it promises a good story and asks you to listen." },
    { q: "What comes right after *Te cuento que*?", es: "Te cuento que me ascendieron.",
      options: ["A question for you", "The news itself", "An apology"], answer: 1,
      why: "*Te cuento que* goes straight to the news: no waiting." },
    { q: "Who is she talking to?", es: "¿Tiene un momento? Le quiero contar algo.",
      options: ["Her younger sister, Ana", "An older colleague", "Her son, who is six"], answer: 1,
      why: "*Tiene* and *le*: the polite forms, for someone she calls *usted*." },
    { q: "What is coming?", es: "¡Te tengo un chisme buenísimo!",
      options: ["A complaint about work", "A present for you", "A juicy bit of news"], answer: 2,
      why: "*Un chisme* is a bit of gossip, and *buenísimo* says it's a good one." }
  ],
  yourTurn: [
    { en: "Hey, I have to tell you something. (to a friend)", es: "Oye, tengo que contarte una cosa.", accept: ["Oye, tengo que contarte algo.", "Oye, te tengo que contar [una cosa|algo]."] },
    { en: "You're not going to believe it. (to a friend)", es: "No te lo vas a creer.", accept: ["No me lo vas a creer."] },
    { en: "Have you got a minute? (to a friend)", es: "¿Tienes un minuto?", accept: ["¿Tienes un momento?"] },
    { en: "Listen for a moment, please, it's important.", es: "Escucha un momento, por favor, es importante.", accept: ["Escúchame un momento, por favor, es importante."] }
  ],
  translate: [
    { en: "Let me tell you: I got promoted. (to a friend)", es: "Te cuento que me ascendieron.", accept: [] },
    { en: "Have you got a moment? I want to tell you something. (to someone you call usted)", es: "¿Tiene un momento? Le quiero contar algo.", accept: ["¿Tiene un momento? Quiero contarle algo."] },
    { en: "Hey, have you got a minute? I want to tell you something. (to a friend)", es: "Oye, ¿tienes un minuto? Quiero contarte una cosa.", accept: ["Oye, ¿tienes un minuto? Te quiero contar una cosa.", "Oye, ¿tienes un minuto? Quiero contarte algo."] },
    { en: "I've got some gossip for you! (to a friend)", es: "¡Te tengo un chisme!", accept: ["¡Te tengo un chisme buenísimo!"] },
    { en: "Listen, I have to tell you something incredible. (to a friend)", es: "Escucha, tengo que contarte algo increíble.", accept: ["Mira, tengo que contarte algo increíble."] }
  ],
  register: [
    { es: "¡Te tengo un chisme!", en: "I've got gossip for you!", when: "playful, among close friends" },
    { es: "Te cuento que...", en: "Let me tell you...", when: "Colombian and friendly, straight into the news" },
    { es: "Oye, tengo que contarte una cosa.", en: "Hey, I have to tell you something.", when: "everyday, with anyone you call tú" },
    { es: "¿Tiene un momento? Le quiero comentar algo.", en: "Have you got a moment? I'd like to mention something.", when: "polite, at work or with someone older" }
  ],
  personal: {
    prompt: "Something surprising happened to you. Write the first two lines you'd say to a friend before telling it: get their attention and check they have time.",
    constraints: [
      { type: "containsAny", words: ["oye", "mira", "escucha", "te cuento", "no te lo vas a creer", "te tengo un chisme"], label: "get their attention: *oye* or *no te lo vas a creer*" },
      { type: "containsAny", words: ["¿tienes un minuto", "¿tienes un momento", "¿tienes tiempo", "¿tiene un momento"], label: "check they have time: *¿tienes un minuto?*" }
    ],
    model: "Oye, ¿tienes un minuto? No te lo vas a creer, pero me encontré a mi profesora del colegio en el Transmilenio."
  },
  pitfalls: [
    "Spain opens with *¿Sabes qué ha pasado?* In Colombia the past is plain, and the opener is usually *Te cuento que...* or *No te lo vas a creer*.",
    "*Te cuento que* goes straight to the news: don't wait for an answer after it."
  ]
},

"fn-introducir-hecho-b1": {
  source: "merged",
  hook: {
    line: "You're halfway through telling your cousin about the night of the blackout in your building. Every new fact needs a little word in front: one says it was the next step, the other says nobody saw it coming.",
    es: "Estábamos comiendo y, de repente, se fue la luz.\nEntonces me di cuenta de que no tenía velas.",
    en: "We were eating and, suddenly, the power went out.\nThen I realised I had no candles."
  },
  examples: [
    { es: "Entonces decidimos regresar a la casa.", en: "So then we decided to go back home." },
    { es: "De pronto alguien tocó la puerta.", en: "Suddenly someone knocked on the door." },
    { es: "Pues resulta que llegamos tarde al aeropuerto.", en: "Well, it turns out we got to the airport late." }
  ],
  rule: "English has one *then*. Spanish splits the next fact two ways.\nThe next step, as expected: *entonces*, *luego*, *después*. *Entonces llamé a mi hermano.*\nSomething nobody saw coming: *de repente* or *de pronto*. *De repente se fue la luz.*\nBoth take the plain past for the new fact: *se fue*, *llamé*.\nTo get going or move along: *Pues nada, salí de la casa como siempre.*\nFor a twist: *Resulta que el vuelo era al otro día.*\nFor the moment it clicks: *me di cuenta de* and a thing, or *de que* and a sentence. *Me di cuenta de que no tenía las llaves.*",
  readAndPick: [
    { q: "Was it expected?", es: "De repente se apagaron todas las luces.",
      options: ["Yes, it was all planned", "No, it was a surprise", "It happened every day"], answer: 1,
      why: "*De repente* breaks the flow: nobody saw it coming." },
    { q: "What does *entonces* tell you here?", es: "Entonces decidimos regresar a la casa.",
      options: ["A sudden shock", "A long wait", "The next step"], answer: 2,
      why: "*Entonces* moves on to what came next, as you'd expect." },
    { q: "What did he notice?", es: "Me di cuenta de que había dejado las llaves adentro.",
      options: ["He'd locked his keys in", "He'd found the keys at last", "He had lost the house"], answer: 0,
      why: "*Me di cuenta de que*: the moment it clicked. *Había dejado* came before." },
    { q: "What is *resulta que* doing?", es: "Resulta que el vuelo era al otro día.",
      options: ["Ending the story", "Adding a twist", "Asking a question"], answer: 1,
      why: "*Resulta que* brings in something surprising: the flight was the next day." },
    { q: "Why *pues nada*?", es: "Pues nada, salí de la casa como siempre y...",
      options: ["To say nothing happened", "To change the subject", "To move the story along"], answer: 2,
      why: "*Pues nada* is a filler that gets the story going." }
  ],
  yourTurn: [
    { en: "Suddenly the power went out.", es: "De repente se fue la luz.", accept: ["De pronto se fue la luz."] },
    { en: "Then I called my brother.", es: "Entonces llamé a mi hermano.", accept: ["Luego llamé a mi hermano."] },
    { en: "I realised I didn't have the keys.", es: "Me di cuenta de que no tenía las llaves.", accept: [] },
    { en: "Suddenly someone knocked on the door.", es: "De pronto alguien tocó la puerta.", accept: ["De repente alguien tocó la puerta.", "De pronto tocaron la puerta."] },
    { en: "It turns out the flight was the next day.", es: "Resulta que el vuelo era al otro día.", accept: ["Resulta que el vuelo era al día siguiente."] }
  ],
  translate: [
    { en: "And then I realised I had lost my keys.", es: "Y entonces me di cuenta de que había perdido las llaves.", accept: [] },
    { en: "So then we decided to go back home.", es: "Entonces decidimos regresar a la casa.", accept: ["Entonces decidimos regresar a casa.", "Entonces decidimos volver a la casa."] },
    { en: "Well, it turns out we got to the airport late.", es: "Pues resulta que llegamos tarde al aeropuerto.", accept: [] },
    { en: "Did you notice the price? (to a friend)", es: "¿Te diste cuenta del precio?", accept: [] },
    { en: "Suddenly it started to rain.", es: "De pronto empezó a llover.", accept: ["De repente empezó a llover."] }
  ],
  register: [
    { es: "Y entonces...", en: "And then...", when: "the next step, in any story" },
    { es: "De repente...", en: "Suddenly...", when: "the surprise, spoken or written" },
    { es: "Pues resulta que...", en: "Well, it turns out...", when: "casual, for a twist among friends" },
    { es: "Acto seguido, se evacuó el edificio.", en: "Immediately afterwards, the building was evacuated.", when: "formal, on the news or in a report" }
  ],
  personal: {
    prompt: "Tell three moments of something that happened to you: one with *entonces*, one with *de repente*, and the moment you realised something.",
    constraints: [
      { type: "containsAny", words: ["entonces", "luego", "después"], label: "the next step: *entonces* or *luego*" },
      { type: "containsAny", words: ["de repente", "de pronto"], label: "the surprise: *de repente*" },
      { type: "containsAny", words: ["me di cuenta de", "nos dimos cuenta de"], label: "the click: *me di cuenta de que*" }
    ],
    model: "Estaba en la cocina preparando el almuerzo. De repente sonó la alarma del edificio. Entonces salí corriendo con el perro. En la calle me di cuenta de que había dejado la estufa prendida."
  },
  pitfalls: [
    "*Entonces* for a surprise sounds flat: a shock needs *de repente*.",
    "*Me di cuenta que* drops a word: *me di cuenta de que*.",
    "*Realicé mi error* is a false friend: *realizar* is to carry out. To realise is *darse cuenta de*."
  ]
},

"fn-concluir-relato-b1": {
  source: "merged",
  hook: {
    line: "Your story about the bus that broke down has gone on long enough, and your friends are waiting for the end. Spanish closes a story three ways: how it turned out, what the point was, or a casual shrug.",
    es: "Total, que llegamos a las once de la noche.\nEn resumen, fue un viaje caótico, pero bonito.",
    en: "So anyway, we got there at eleven at night.\nIn short, it was a chaotic trip, but a lovely one."
  },
  examples: [
    { es: "Al final, todo salió mejor de lo esperado.", en: "In the end, everything turned out better than expected." },
    { es: "En resumen, fue una tarde para el recuerdo.", en: "In short, it was an afternoon to remember." },
    { es: "Y bueno, eso fue lo que pasó.", en: "And well, that's what happened." }
  ],
  rule: "Three ways out of a story.\nHow it turned out: *al final* or *finalmente*, usually with the plain past. *Al final todo salió bien.* *Finalmente alcanzamos el último bus.*\nThe point of it all: *en resumen* or *en conclusión*. *En resumen, fue un día muy largo.*\nA casual shrug that jumps to the outcome: *total, que...* *Total, que no fuimos.*\nAnd to say you've finished: *Y eso fue todo.* *Y bueno, eso fue lo que pasó.*\nWatch the *de*: *al final de la calle* is at the end of the street.",
  readAndPick: [
    { q: "What is she giving you?", es: "Al final, todo se solucionó.",
      options: ["A summary of the point", "The outcome", "A new problem"], answer: 1,
      why: "*Al final* tells you how things turned out." },
    { q: "What is she giving you?", es: "En resumen, fue un día bastante caótico.",
      options: ["The last thing that happened", "An excuse for it all", "The point of the story"], answer: 2,
      why: "*En resumen* boils the whole story down to what it meant." },
    { q: "How does this sound?", es: "Total, que no fuimos.",
      options: ["Formal and careful", "Casual, a shrug", "Angry"], answer: 1,
      why: "*Total, que* skips the details and jumps to the outcome." },
    { q: "Where is the café?", es: "El café está al final de la calle.",
      options: ["At the end of the street", "At the end of the day, finally", "On the street, at last"], answer: 0,
      why: "With *de* and a place, *al final de* is at the end of." },
    { q: "What does she mean?", es: "Finalmente alcanzamos el último bus.",
      options: ["They missed it by a minute", "They took a taxi instead", "They caught it in the end"], answer: 2,
      why: "*Finalmente* and *alcanzamos*: after all that, they made it." }
  ],
  yourTurn: [
    { en: "In the end everything turned out better than expected.", es: "Al final todo salió mejor de lo esperado.", accept: ["Al final, todo salió mejor de lo esperado."] },
    { en: "In short, it was a very long day.", es: "En resumen, fue un día muy largo.", accept: [] },
    { en: "So anyway, we didn't go.", es: "Total, que no fuimos.", accept: [] },
    { en: "And well, that's what happened.", es: "Y bueno, eso fue lo que pasó.", accept: [] }
  ],
  translate: [
    { en: "We finally caught the last bus.", es: "Finalmente alcanzamos el último bus.", accept: ["Al final alcanzamos el último bus.", "Finalmente tomamos el último bus."] },
    { en: "In short, it was an afternoon to remember.", es: "En resumen, fue una tarde para el recuerdo.", accept: ["En resumen, fue una tarde para recordar."] },
    { en: "The café is at the end of the street.", es: "El café está al final de la calle.", accept: [] },
    { en: "In conclusion, the incident was resolved without any further problems.", es: "En conclusión, el incidente se resolvió sin más problemas.", accept: [] },
    { en: "And that was that.", es: "Y eso fue todo.", accept: [] }
  ],
  register: [
    { es: "Total, que...", en: "So anyway...", when: "casual, jumping to the outcome" },
    { es: "Al final...", en: "In the end...", when: "the outcome, in any story" },
    { es: "En resumen...", en: "In short...", when: "the point, said or written" },
    { es: "En conclusión...", en: "In conclusion...", when: "formal, in a talk or a written piece" }
  ],
  personal: {
    prompt: "Close the last story you told a friend in two ways: one line with *al final* for how it turned out, and one with *en resumen* for the point.",
    constraints: [
      { type: "containsAny", words: ["al final", "finalmente"], label: "how it turned out: *al final*" },
      { type: "containsAny", words: ["en resumen", "en conclusión"], label: "the point: *en resumen*" }
    ],
    model: "Al final el bus llegó a las once de la noche. En resumen, fue un viaje largo, pero muy divertido."
  },
  pitfalls: [
    "*En el final* is word for word: *al final*.",
    "*Al final* tells what happened last; *en resumen* tells what it all meant. They aren't the same closer.",
    "*Para terminar, os diré...* is from Spain: to a group in Colombia, *les digo*."
  ]
},

"dc-marcadores-discurso-b1": {
  source: "merged",
  hook: {
    line: "Your boss in Bogotá asks for a short message explaining why the team wants to move the meeting. Good reasons aren't enough: Spanish signposts each one, so the reader knows what comes first, what is added, and what follows.",
    es: "En primer lugar, el lunes es festivo.\nAdemás, la mitad del equipo está de viaje, así que proponemos el jueves.",
    en: "Firstly, Monday is a public holiday.\nWhat's more, half the team is away, so we suggest Thursday."
  },
  examples: [
    { es: "Estaba muy cansado, así que me quedé en la casa.", en: "I was very tired, so I stayed home." },
    { es: "Me encanta el cine, sobre todo las películas de miedo.", en: "I love films, especially horror films." },
    { es: "Por un lado, el apartamento es barato; por otro, queda muy lejos.", en: "On the one hand, the apartment is cheap; on the other, it's a long way away." }
  ],
  rule: "Small words that tell the listener where you're going.\nAdding: *además*, *también*, and *sobre todo* for the main one.\nA result: *así que* in speech, *por lo tanto* in writing.\nA reason: *como* at the start, *es que* to explain yourself. *Como llovía, no salimos.* *Es que estaba cansado.*\nThe other side: *pero*, *aunque*, *sin embargo*.\nOrder: *en primer lugar*, *en segundo lugar*, *por último*. Two sides: *por un lado... por otro...*\nSaying it again more clearly: *o sea*, *es decir*.\nZooming in: *en concreto*, *en particular*.\n*Pues* opens a spoken turn: *Pues, yo no estoy de acuerdo.*",
  readAndPick: [
    { q: "What is *así que* doing?", es: "Llovía mucho, así que nos quedamos en la casa.",
      options: ["Adding a point", "Giving the result", "Giving the other side"], answer: 1,
      why: "*Así que* brings in what followed from the rain." },
    { q: "What is *es que* doing?", es: "No fui a la fiesta. Es que estaba muy cansada.",
      options: ["Explaining why", "Adding a point", "Changing the subject"], answer: 0,
      why: "*Es que* gives the reason, a little apologetically." },
    { q: "What does *o sea* bring in?", es: "Trabajo desde la casa, o sea, no tengo que salir.",
      options: ["A brand new topic of conversation", "A complaint about it", "The same idea, put plainly"], answer: 2,
      why: "*O sea* says it again more plainly: working from home means no going out." },
    { q: "Where would you read this?", es: "Por lo tanto, proponemos aplazar la reunión.",
      options: ["In a chat with a friend", "In a work email", "On a birthday card"], answer: 1,
      why: "*Por lo tanto* is the written, careful way to give a result." },
    { q: "Which does she like most?", es: "Me gusta la música latina, sobre todo la salsa.",
      options: ["Salsa", "All of it the same", "Pop"], answer: 0,
      why: "*Sobre todo* singles out the main one: salsa." }
  ],
  yourTurn: [
    { en: "I was very tired, so I stayed home.", es: "Estaba muy cansado, así que me quedé en la casa.", accept: ["Estaba muy [cansado|cansada], así que me quedé en (la) casa."] },
    { en: "On the one hand it's cheap; on the other, it's a long way away.", es: "Por un lado es barato; por otro, queda muy lejos.", accept: ["Por un lado es barato; por otro lado, queda muy lejos.", "Por un lado es barato, por otro, queda muy lejos.", "Por un lado es barato; por otro, está muy lejos."] },
    { en: "I didn't go, it's just that it was raining a lot.", es: "No fui, es que estaba lloviendo mucho.", accept: ["No fui, es que llovía mucho."] },
    { en: "Firstly, we need to book the tickets.", es: "En primer lugar, hay que reservar las boletas.", accept: ["En primer lugar, hay que comprar las boletas.", "En primer lugar, tenemos que reservar las boletas."] },
    { en: "I love films, especially horror films.", es: "Me encanta el cine, sobre todo las películas de miedo.", accept: ["Me encanta el cine, sobre todo las películas de terror."] }
  ],
  translate: [
    { en: "In conclusion, the project needs more time.", es: "En conclusión, el proyecto necesita más tiempo.", accept: [] },
    { en: "As it was raining, we didn't go out.", es: "Como llovía, no salimos.", accept: ["Como estaba lloviendo, no salimos."] },
    { en: "Sales fell; therefore, we close on Mondays.", es: "Las ventas bajaron; por lo tanto, cerramos los lunes.", accept: [] },
    { en: "I'll go with you to the concert, although I don't like that kind of music. (to a friend)", es: "Voy contigo al concierto, aunque no me gusta ese tipo de música.", accept: ["Iré contigo al concierto, aunque no me gusta ese tipo de música."] },
    { en: "I work from home, that is, I don't have to go out.", es: "Trabajo desde la casa, es decir, no tengo que salir.", accept: ["Trabajo desde (la) casa, o sea, no tengo que salir.", "Trabajo desde casa, es decir, no tengo que salir."] },
    { en: "What's more, the neighbourhood supports us.", es: "Además, el barrio nos apoya.", accept: [] }
  ],
  register: [
    { es: "O sea...", en: "I mean...", when: "spoken, and very frequent in Colombia" },
    { es: "Así que...", en: "So...", when: "a result, in speech or a message" },
    { es: "Por lo tanto...", en: "Therefore...", when: "a result, in writing or at a meeting" },
    { es: "Es decir...", en: "That is to say...", when: "putting it more clearly, spoken or written" },
    { es: "En primer lugar...", en: "Firstly...", when: "ordering points in a talk or an email" }
  ],
  personal: {
    prompt: "Write three or four lines to your team explaining a decision: a first reason, an added one, and what follows from them.",
    constraints: [
      { type: "containsAny", words: ["en primer lugar", "primero"], label: "the first reason: *en primer lugar*" },
      { type: "containsAny", words: ["además", "también", "sobre todo"], label: "an added point: *además*" },
      { type: "containsAny", words: ["así que", "por lo tanto", "de modo que"], label: "what follows: *así que* or *por lo tanto*" }
    ],
    model: "En primer lugar, el lunes es festivo. Además, la mitad del equipo está de viaje esa semana. Por lo tanto, proponemos pasar la reunión al jueves."
  },
  pitfalls: [
    "*Pues* opens a spoken turn; a formal email starts with *En primer lugar* or a plain sentence.",
    "*Es decir* says the same idea more clearly; *en resumen* boils down a longer stretch. They don't swap.",
    "*En la otra mano* is word for word: *por otro lado*, or just *por otro*."
  ]
},

"dc-mantenimiento-referente-b1": {
  source: "old",
  hook: {
    line: "You're writing to a friend about a weekend in Salento, and every sentence starts with the town's name. Spanish keeps track of things without repeating them: a little word, a verb that stands in, or *the* for something the reader can already picture.",
    es: "Fuimos a una finca cafetera y nos sentamos en el corredor.\nEl dueño nos explicó todo el proceso, y lo hizo con mucha paciencia.",
    en: "We went to a coffee farm and sat on the veranda.\nThe owner explained the whole process to us, and he did it very patiently."
  },
  examples: [
    { es: "Tú crees que se equivoca, pero yo no lo creo.", en: "You think he's wrong, but I don't think so." },
    { es: "Dijo que vendría, y lo hizo.", en: "He said he would come, and he did." },
    { es: "La policía intervino en la pelea. La intervención fue rápida.", en: "The police stepped in to the fight. The intervention was quick." }
  ],
  rule: "Don't repeat the name: point back to it.\nA thing or person already named: *lo*, *la*, *los*, *las*. *Compré el libro y lo leí en dos días.*\nA whole idea: *lo* or *eso*. *Tú crees que se equivoca, pero yo no lo creo.*\nA whole action: *hacerlo*. *Dijo que vendría, y lo hizo.* *Seguro que lo hace.*\n*The* for things the reader can picture: *Fuimos a una finca y nos sentamos en el corredor.* A farm has a veranda, so *el*, even the first time.\nIn writing, a related word picks the idea up: *La policía intervino. La intervención fue rápida.*",
  readAndPick: [
    { q: "What does *lo hizo* stand for?", es: "Dijo que llamaría, y lo hizo.",
      options: ["He said it again", "He called", "He didn't call"], answer: 1,
      why: "*Lo hizo* stands in for the whole action: he called." },
    { q: "Why *el corredor*, the first time it appears?", es: "Llegamos a una finca y nos sentamos en el corredor.",
      options: ["There's only one in the whole town", "It's a slip", "A farm has one"], answer: 2,
      why: "A farm comes with a veranda, so *el* works even on first mention." },
    { q: "What does *lo* point back to?", es: "Compré el libro y lo leí en dos días.",
      options: ["The book", "Two days", "The shop"], answer: 0,
      why: "*Lo* is the book, already named: no need to say it again." },
    { q: "What is *eso* here?", es: "Tú crees que es culpa mía, pero yo no pienso eso.",
      options: ["That you're right about it", "That it's my fault", "That he's wrong"], answer: 1,
      why: "*Eso* points back to the whole idea: that it's my fault." },
    { q: "Where would you read this?", es: "El gobierno anunció una reforma. La medida afectará a miles de trabajadores.",
      options: ["In a recipe", "In a chat with friends", "In a news report"], answer: 2,
      why: "*La medida* picks up *una reforma* with a related word: the style of the news." }
  ],
  yourTurn: [
    { en: "I bought the book and read it in two days.", es: "Compré el libro y lo leí en dos días.", accept: [] },
    { en: "He said he would come, and he did.", es: "Dijo que vendría, y lo hizo.", accept: ["Dijo que iba a venir, y lo hizo.", "Dijo que vendría y vino."] },
    { en: "You think he's wrong, but I don't think so. (to a friend)", es: "Tú crees que se equivoca, pero yo no lo creo.", accept: ["Crees que se equivoca, pero yo no lo creo.", "Tú crees que está equivocado, pero yo no lo creo."] },
    { en: "We went into the hotel and asked at reception.", es: "Entramos al hotel y preguntamos en la recepción.", accept: ["Entramos en el hotel y preguntamos en la recepción."] }
  ],
  translate: [
    { en: "We went to a coffee farm and sat on the veranda.", es: "Fuimos a una finca cafetera y nos sentamos en el corredor.", accept: ["Fuimos a una finca de café y nos sentamos en el corredor."] },
    { en: "The police stepped in. The intervention was quick.", es: "La policía intervino. La intervención fue rápida.", accept: [] },
    { en: "He promised to fix it. I'm sure he will.", es: "Prometió arreglarlo. Seguro que lo hace.", accept: ["Prometió arreglarlo. Seguro que lo hará."] },
    { en: "The government announced a reform. The measure will affect thousands of workers.", es: "El gobierno anunció una reforma. La medida afectará a miles de trabajadores.", accept: [] },
    { en: "Did you see the photos? I sent them to you yesterday. (to a friend)", es: "¿Viste las fotos? Te las mandé ayer.", accept: ["¿Viste las fotos? Te las envié ayer."] }
  ],
  register: [
    { es: "Y lo hizo.", en: "And he did.", when: "everyday, standing in for an action" },
    { es: "Eso no lo creo.", en: "That I don't believe.", when: "spoken, pointing back at an idea with weight" },
    { es: "La intervención fue rápida.", en: "The intervention was quick.", when: "news and reports, an action turned into a thing" },
    { es: "Dicha medida entrará en vigor en enero.", en: "The said measure will come into force in January.", when: "formal writing, legal or official" }
  ],
  personal: {
    prompt: "Write three or four lines about a place you visited without repeating its name: point back to it with *lo* or *la*, and stand in for an action with *lo hice*.",
    constraints: [
      { type: "minSentences", n: 3, label: "three lines or more" },
      { type: "regex", pattern: "\\b(lo|la|los|las) (vi|vimos|visité|visitamos|conocí|conocimos|compré|compramos|probé|probamos|recorrí|recorrimos|recomiendo)(?![a-záéíóúñ])", label: "a place or thing pointed back to: *lo recorrimos*" },
      { type: "regex", pattern: "\\blo (hice|hizo|hicimos|hicieron)\\b", label: "an action stood in for: *lo hice* or *lo hicimos*" }
    ],
    model: "El año pasado fuimos a Salento. Lo recorrimos a pie en un día. Nos quedamos en una finca y desayunábamos en el corredor. Mi hermana quería subir al mirador, y lo hicimos el último día."
  },
  pitfalls: [
    "Starting every sentence with the same name reads as clumsy: point back with *lo*, *la* or *eso*.",
    "*The* on first mention only works when the reader can picture it: a café has *la barra*, a park doesn't have *el piano*.",
    "*La intervención policial* sounds like the news: in a chat with a friend, just say *la policía*."
  ]
},

"nt-ciclo-accion-b1": {
  source: "merged",
  hook: {
    line: "An old classmate asks about the things you used to do: do you still play football, did you ever quit smoking, when did you finally get down to studying? Spanish has a small verb for each stage of an action.",
    es: "Sigo jugando fútbol los sábados.\nY dejé de fumar hace dos años.",
    en: "I still play football on Saturdays.\nAnd I stopped smoking two years ago."
  },
  examples: [
    { es: "Por fin me puse a estudiar para el examen.", en: "I finally got down to studying for the exam." },
    { es: "Seguimos esperando la respuesta.", en: "We're still waiting for the answer." },
    { es: "Al principio me costó mucho, pero después me acostumbré.", en: "At first it was really hard, but then I got used to it." }
  ],
  rule: "One action, from start to finish.\nStarting: *empezar a* and the dictionary form. *Empezó a llover.* With a push, or out of nowhere: *ponerse a*. *Me puse a estudiar.* *Se puso a llorar.*\nCarrying on: *seguir* and the *-ndo* form. *Sigo trabajando aquí.* Still not: *sigo sin* and the dictionary form. *Sigo sin entender.*\nStopping: *dejar de* and the dictionary form. *Dejé de fumar.* Without *de*, *dejar* means to leave or to let.\nAround it: *al principio*, *después*, *al otro día*, *dos años más tarde*.",
  readAndPick: [
    { q: "Does she still go?", es: "Sigo yendo al gimnasio tres veces por semana.",
      options: ["She stopped", "Yes, still", "She's about to start"], answer: 1,
      why: "*Sigo yendo*: still going, three times a week." },
    { q: "Does he still smoke?", es: "Dejó de fumar hace un año.",
      options: ["Yes, a lot", "He's starting", "No, he quit"], answer: 2,
      why: "*Dejó de fumar*: he stopped, a year ago." },
    { q: "How did the crying start?", es: "De repente el niño se puso a llorar.",
      options: ["All of a sudden", "Slowly, over hours", "It never stopped"], answer: 0,
      why: "*Se puso a llorar*: it kicked off, out of nowhere." },
    { q: "What does she still not do?", es: "Sigo sin entender el contrato.",
      options: ["Read the whole contract through", "Sign the contract", "Understand the contract"], answer: 2,
      why: "*Sigo sin entender*: she still doesn't understand it." },
    { q: "What does *dejé* mean here?", es: "Dejé las llaves en la mesa.",
      options: ["I left", "I stopped", "I let"], answer: 0,
      why: "No *de* and a thing after it: *dejar* is to leave something somewhere." }
  ],
  yourTurn: [
    { en: "I still play football on Saturdays.", es: "Sigo jugando fútbol los sábados.", accept: ["Sigo jugando al fútbol los sábados."] },
    { en: "He finally stopped smoking.", es: "Por fin dejó de fumar.", accept: ["Dejó de fumar por fin."] },
    { en: "I got down to studying at eight.", es: "Me puse a estudiar a las ocho.", accept: [] },
    { en: "I still don't understand the contract.", es: "Sigo sin entender el contrato.", accept: [] },
    { en: "It started to rain.", es: "Empezó a llover.", accept: ["Se puso a llover."] }
  ],
  translate: [
    { en: "We're still waiting for the answer.", es: "Seguimos esperando la respuesta.", accept: [] },
    { en: "At first it was really hard for me to adjust.", es: "Al principio me costó mucho adaptarme.", accept: [] },
    { en: "Why did you stop playing football? (to a friend)", es: "¿Por qué dejaste de jugar fútbol?", accept: ["¿Por qué dejaste de jugar al fútbol?"] },
    { en: "We saw each other again two years later.", es: "Nos vimos de nuevo dos años más tarde.", accept: ["Nos vimos otra vez dos años más tarde."] },
    { en: "The concert ended after midnight.", es: "El concierto terminó pasada la medianoche.", accept: ["El concierto terminó después de la medianoche.", "El concierto se acabó después de la medianoche."] },
    { en: "Suddenly everybody started singing.", es: "De repente todos se pusieron a cantar.", accept: ["De pronto todos se pusieron a cantar."] }
  ],
  register: [
    { es: "Me puse a estudiar.", en: "I got down to studying.", when: "everyday, with a push or a decision" },
    { es: "Empecé a estudiar.", en: "I started studying.", when: "neutral, anywhere" },
    { es: "Sigo trabajando allá.", en: "I'm still working there.", when: "everyday, still doing it" },
    { es: "Continúo trabajando en la empresa.", en: "I continue to work at the company.", when: "a little more formal, in writing" },
    { es: "Ya no fumo.", en: "I don't smoke any more.", when: "plain, seen from today" }
  ],
  personal: {
    prompt: "Write about your habits: one thing you still do, one thing you stopped doing, and one thing you recently got down to.",
    constraints: [
      { type: "regex", pattern: "\\b(sigo|sigue|seguimos|siguen) [a-záéíóúñ]*(ando|iendo|yendo)\\b|\\bsigo sin\\b", label: "still doing: *sigo* and the *-ndo* form" },
      { type: "regex", pattern: "\\b(dejé|dejó|dejamos|dejaron) de\\b", label: "stopped: *dejé de*" },
      { type: "regex", pattern: "\\b(me puse|se puso|nos pusimos) a\\b", label: "got down to it: *me puse a*" }
    ],
    model: "Sigo yendo a clases de baile los jueves. Dejé de tomar gaseosa hace seis meses. Y la semana pasada por fin me puse a escribir mi hoja de vida."
  },
  pitfalls: [
    "*Sigo trabajar* uses the wrong form: after *seguir*, the *-ndo* form, *sigo trabajando*.",
    "*Dejé fumar* without *de* sounds as if you let someone smoke: *dejé de fumar*.",
    "*Me puse estudiar* drops the *a*: *me puse a estudiar*."
  ]
},

"nt-orientacion-orden-b1": {
  source: "merged",
  hook: {
    line: "A tourist outside the Museo del Oro asks you the way, and then your cousin wants your hogao recipe. One is a route, the other is a list of steps, and Spanish has a fixed way to give each.",
    es: "Siga por la Séptima hasta la calle Once.\nPrimero se pica la cebolla, luego el tomate.",
    en: "Carry on along Seventh Avenue as far as Eleventh Street.\nFirst you chop the onion, then the tomato."
  },
  examples: [
    { es: "Suba por esa calle y voltee a la derecha.", en: "Go up that street and turn right." },
    { es: "En Colombia se maneja por la derecha.", en: "In Colombia people drive on the right." },
    { es: "Había una fila enorme para entrar.", en: "There was a huge queue to get in." }
  ],
  rule: "A route takes *por*: the verb gives the direction, *por* names the road.\n*seguir por*, *subir por*, *bajar por*, *caminar por*, *manejar por*. *Siga por la Séptima.*\n*Por* picks the side too: *por la derecha*. For a fixed spot, *en*: *Estoy en la Séptima.*\nSteps in order: *primero*, *luego*, *después*, *a continuación*, *por último*. In a formal text, *en primer lugar*, *en segundo lugar*. Pick one set and keep to it.\nA line of people is *una fila*, and in Colombia you *hacen fila*.\nThings in order: *ordenado*, *organizado*. Out of order: *desordenado*.",
  readAndPick: [
    { q: "What does *por* do here?", es: "Siga por la avenida hasta el semáforo.",
      options: ["Says why you're going there", "Names the road", "Says where you end up"], answer: 1,
      why: "*Por* names the road; *hasta* says where to stop." },
    { q: "Which step comes second?", es: "Primero se pica la cebolla, luego se sofríe y por último se agrega el tomate.",
      options: ["Frying the onion", "Adding the tomato", "Chopping the onion"], answer: 0,
      why: "*Primero*, then *luego*: the frying comes second." },
    { q: "Where would you see this?", es: "En primer lugar, llene el formulario. En segundo lugar, adjunte la foto.",
      options: ["In a chat with a friend", "In a love letter", "On an official form"], answer: 2,
      why: "*En primer lugar* and *usted* commands: the formal set." },
    { q: "What are they doing?", es: "Hicimos fila una hora para entrar.",
      options: ["Queuing", "Dancing", "Arguing"], answer: 0,
      why: "*Hacer fila* is how Colombians say to queue." },
    { q: "What is his desk like?", es: "Mi escritorio siempre está muy desordenado.",
      options: ["Very tidy and clean", "Brand new", "Very messy"], answer: 2,
      why: "*Desordenado*: out of order, messy." }
  ],
  yourTurn: [
    { en: "Carry on along Seventh Avenue to 72nd Street. (to someone you call usted)", es: "Siga por la Séptima hasta la calle 72.", accept: ["Siga por la Séptima hasta la calle setenta y dos."] },
    { en: "Go up that street and turn right. (to a friend)", es: "Sube por esa calle y voltea a la derecha.", accept: ["Sube por esa calle y [gira|dobla] a la derecha."] },
    { en: "In Colombia people drive on the right.", es: "En Colombia se maneja por la derecha.", accept: [] },
    { en: "First we chop the onion, then we fry it.", es: "Primero picamos la cebolla, luego la sofreímos.", accept: ["Primero picamos la cebolla y luego la sofreímos.", "Primero picamos la cebolla, después la sofreímos."] },
    { en: "There was a huge queue to get in.", es: "Había una fila enorme para entrar.", accept: [] }
  ],
  translate: [
    { en: "We queued for an hour to get in.", es: "Hicimos fila una hora para entrar.", accept: ["Hicimos fila durante una hora para entrar."] },
    { en: "Next, fill in the form. (to someone you call usted)", es: "A continuación, llene el formulario.", accept: ["A continuación, diligencie el formulario."] },
    { en: "My desk is always very messy.", es: "Mi escritorio siempre está muy desordenado.", accept: ["Mi escritorio está siempre muy desordenado."] },
    { en: "Go down this street to the park. (to someone you call usted)", es: "Baje por esta calle hasta el parque.", accept: [] },
    { en: "I was walking along the street when it happened.", es: "Iba caminando por la calle cuando pasó.", accept: ["Caminaba por la calle cuando pasó."] },
    { en: "Lastly, we need more time.", es: "Por último, necesitamos más tiempo.", accept: [] }
  ],
  register: [
    { es: "Siga derecho.", en: "Go straight on.", when: "directions to anyone, polite" },
    { es: "Sigue por aquí.", en: "Carry on this way.", when: "to a friend, pointing" },
    { es: "Hay que hacer fila.", en: "You have to queue.", when: "Colombian, everyday" },
    { es: "En primer lugar..., en segundo lugar...", en: "Firstly..., secondly...", when: "formal steps, in writing or a talk" }
  ],
  personal: {
    prompt: "Give a visitor directions from your home to a place nearby, then a three-step recipe for something simple.",
    constraints: [
      { type: "regex", pattern: "\\b(sig\\w*|sub\\w*|baj\\w*|camin\\w*|manej\\w*) por ", label: "a route with *por*: *siga por*" },
      { type: "containsWord", word: "primero", label: "the first step: *primero*" },
      { type: "containsAny", words: ["luego", "después", "a continuación", "por último"], label: "the next steps: *luego*, *por último*" }
    ],
    model: "Siga por esta calle hasta la panadería y voltee a la izquierda. Para el hogao, primero se pica la cebolla larga. Luego se sofríe con un poco de aceite. Por último se agrega el tomate."
  },
  pitfalls: [
    "*Siga la Séptima* drops the road's *por*: *siga por la Séptima*.",
    "*Hacer cola* is how Spain says it. In Colombia: *hacer fila*.",
    "Mixing *primero, luego* with *en segundo lugar* in one text sounds patchy: keep to one set."
  ]
},

"task-b1-relato": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a story with a proper shape, and with a before. *Había* lets you reach back to something that happened before the story's own start, so you can explain without telling things out of order.",
    es: "Cuando llegué, la ceremonia ya había empezado.\nHabía dejado el traje en la casa de mi mamá.",
    en: "When I arrived, the ceremony had already started.\nI had left my suit at my mom's house."
  },
  examples: [
    { es: "Había estado allí una vez de niño, pero no me acordaba de nada.", en: "I had been there once as a child, but I didn't remember anything." },
    { es: "A los diez minutos me di cuenta de que me había equivocado de boda.", en: "Ten minutes later I realised I had got the wrong wedding." }
  ],
  rule: "Five parts: the calm start, the trouble, what you did, how it ended, and what it means now.\nReach back with *había* and the *-ado* or *-ido* form, for what was already over: *Ya había empezado.* *Había dejado el traje en la casa.*\nPaint the scene with *-aba* and *-ía*; move the story with the plain past.\nFold in speech: *Me dijo que no pasaba nada.*\nOpen with *No te lo vas a creer*, move with *entonces* and *de repente*, close with *al final* or *total, que*.\nSixteen sentences or more, at least three of them reaching back.",
  readAndPick: [
    { q: "Had the ceremony started when he arrived?", es: "Cuando llegué, la ceremonia ya había empezado.",
      options: ["No, it only started later on", "Yes, it had already begun", "There was no ceremony"], answer: 1,
      why: "*Ya había empezado*: it began before he got there." },
    { q: "When had he been to the town?", es: "Había estado allí una vez de niño.",
      options: ["Years before the story", "On the day of the wedding itself", "Never"], answer: 0,
      why: "*Había estado* reaches back before the story, to his childhood." },
    { q: "Why did he leave late?", es: "Salí tarde porque había dejado el traje en la casa de mi mamá.",
      options: ["He'd forgotten the address", "The bus broke down", "He'd left his suit behind"], answer: 2,
      why: "*Había dejado* explains the delay with something that came earlier." },
    { q: "Which part of the story is this?", es: "Todavía me lo recuerdan en cada reunión familiar.",
      options: ["What it means now", "The calm start of it all", "The trouble"], answer: 0,
      why: "*Todavía* and the present: the closing thought, seen from today." },
    { q: "What had gone wrong?", es: "Me di cuenta de que me había equivocado de boda.",
      options: ["He had the wrong suit on", "He was in the wrong city entirely", "He was at the wrong wedding"], answer: 2,
      why: "*Me había equivocado de boda*: the wrong wedding, and he'd only just noticed." }
  ],
  yourTurn: [
    { en: "When I arrived, the ceremony had already started.", es: "Cuando llegué, la ceremonia ya había empezado.", accept: ["Cuando llegué, ya había empezado la ceremonia."] },
    { en: "I had been there once as a child.", es: "Había estado allí una vez de niño.", accept: ["Había estado [ahí|allá] una vez de niño.", "Había estado allí una vez de niña."] },
    { en: "I realised I had got the wrong wedding.", es: "Me di cuenta de que me había equivocado de boda.", accept: [] },
    { en: "They still remind me of it.", es: "Todavía me lo recuerdan.", accept: ["Aún me lo recuerdan."] }
  ],
  translate: [
    { en: "I left Bogotá late because I had left my suit at my mom's house.", es: "Salí tarde de Bogotá porque había dejado el traje en la casa de mi mamá.", accept: ["Salí tarde de Bogotá porque había dejado el traje donde mi mamá."] },
    { en: "I sat down next to a lady I didn't know.", es: "Me senté al lado de una señora que no conocía.", accept: ["Me senté junto a una señora que no conocía."] },
    { en: "The lady laughed so much that everyone turned to look.", es: "La señora se rio tanto que todos voltearon a mirar.", accept: ["La señora se rió tanto que todos voltearon a mirar."] },
    { en: "In the end she took me there herself, and I arrived just in time for dessert.", es: "Al final ella misma me llevó, y llegué justo para el postre.", accept: [] },
    { en: "You're not going to believe what happened to me.", es: "No vas a creer lo que me pasó.", accept: [] }
  ],
  register: [
    { es: "No te lo vas a creer.", en: "You won't believe it.", when: "opening a story with friends" },
    { es: "Resulta que...", en: "It turns out...", when: "the twist, in speech" },
    { es: "Total, que...", en: "So anyway...", when: "jumping to the end, casual" },
    { es: "Hasta el día de hoy me lo recuerdan.", en: "To this day they remind me of it.", when: "the closing thought, with a smile" }
  ],
  personal: {
    prompt: "Tell a story that reaches back before its own start: sixteen sentences or more, in five parts, with at least three things that had already happened.",
    constraints: [
      { type: "minSentences", n: 16, label: "sixteen sentences or more" },
      { type: "anyVerbInTense", tense: "plusc", label: "reaching back: *había* and the *-ado* or *-ido* form" },
      { type: "regex", pattern: "(hab(ía|ías|íamos|ían) [a-záéíóúñ]+(ado|ido|to|cho)\\b[\\s\\S]*){3}", label: "at least three of them" },
      { type: "containsAny", words: ["al final", "total, que", "finalmente"], label: "an ending: *al final* or *total, que*" },
      { type: "containsAny", words: ["todavía", "hoy", "ahora", "desde entonces"], label: "what it means now: *todavía* or *desde entonces*" }
    ],
    model: "El año pasado fui a la boda de un primo en un pueblo de Boyacá. Había estado allí una vez de niño, pero no me acordaba de nada. Ese sábado salí tarde de Bogotá. Había dejado el traje en la casa de mi mamá y tuve que ir por él. Había mucho trancón en la autopista Norte. Cuando llegué al pueblo, la ceremonia ya había empezado. Entré a la iglesia por detrás, sin hacer ruido. Me senté al lado de una señora que no conocía. Ella me sonrió y me preguntó en voz baja por la familia del novio. Le dije que era su primo, muy seguro. A los diez minutos me di cuenta de que me había equivocado de boda. Mi primo se casaba en la otra iglesia, la del parque. La señora se rio tanto que todos voltearon a mirar. Al final ella misma me llevó en su carro. Llegué justo para el postre. Todavía me lo recuerdan en cada reunión familiar."
  },
  pitfalls: [
    "A story told only in order can't explain itself: *había* lets you step back without breaking the flow.",
    "*Volver a por él* is from Spain. In Colombia: *ir por él*.",
    "*Coche* is Spain's word. In Colombia: *carro*."
  ]
},

/* ---- unit b1-u37 · Holding a conversation -------------------------------- */

"fn-seguir-relato-interes-b1": {
  source: "old",
  hook: {
    line: "Your friend Natalia is telling you about her disastrous first date, and you want her to keep going. In Spanish, listening is noisy: little words every few sentences show you're with her, and silence reads as boredom.",
    es: "¿En serio? ¿Y entonces qué pasó?",
    en: "Seriously? And then what happened?"
  },
  examples: [
    { es: "Se me varó el carro en plena autopista.\n¡Uy, no! ¿Y qué hiciste?", en: "My car broke down right on the motorway.\nOh no! And what did you do?" },
    { es: "Ajá, sí, sigue, sigue.", en: "Uh-huh, yes, go on, go on." },
    { es: "¡No me digas! No me lo esperaba.", en: "You don't say! I wasn't expecting that." }
  ],
  rule: "While someone tells a story, keep them going without taking over.\nTiny signals: *ajá*, *sí, sí*, *claro*, *ya*.\nAsk for more: *¿Y entonces?* *¿Y qué pasó?* *¿Y qué hiciste?*\nSurprise that wants more: *¿En serio?* *¿De verdad?* *¡No me digas!*\nFeel it with them: *¡Qué bien!* *¡Qué horror!* *¡Uy, no!* *¡Qué pesar!*, the Colombian what a shame.\nPush them on: *Sigue, sigue.* *¿Y después?*\nWith *usted*: *Entiendo, siga, por favor.*\nSpanish expects a signal every few sentences. Silence can sound like boredom.",
  readAndPick: [
    { q: "What does *ajá* add?", es: "Ajá, sí, sigue.",
      options: ["Just that you're listening", "A strong opinion of her own", "A polite correction"], answer: 0,
      why: "*Ajá* carries no view of its own, so it never takes the floor." },
    { q: "How does she mean *¿En serio?* here?", es: "¿En serio? ¿Y qué pasó después?",
      options: ["She doesn't believe a word", "She wants to hear more", "She's bored"], answer: 1,
      why: "Followed by *¿Y qué pasó después?*, it's interest, not doubt." },
    { q: "What is *qué pesar*?", es: "¡Qué pesar! ¿Y tu abuela cómo sigue?",
      options: ["What a weight", "How heavy", "What a shame"], answer: 2,
      why: "*¡Qué pesar!* is how Colombians say what a shame, for sad news." },
    { q: "Who keeps talking?", es: "Sigue, sigue, que esto se pone bueno.",
      options: ["The listener", "The storyteller", "Nobody"], answer: 1,
      why: "*Sigue, sigue* pushes the storyteller on: it's getting good." },
    { q: "Which reaction fits?", es: "Y entonces perdí el celular en el bus.",
      options: ["¡Qué bien, me alegro!", "¡Uy, no! ¿Y qué hiciste?", "¡Felicitaciones!"], answer: 1,
      why: "Bad news: feel it with them, then ask for more." }
  ],
  yourTurn: [
    { en: "Seriously? And what happened next?", es: "¿En serio? ¿Y qué pasó después?", accept: ["¿En serio? ¿Y después qué pasó?", "¿De verdad? ¿Y qué pasó después?"] },
    { en: "You don't say!", es: "¡No me digas!", accept: [] },
    { en: "Go on, go on. (to a friend)", es: "Sigue, sigue.", accept: [] },
    { en: "Oh no! And what did you do? (to a friend)", es: "¡Uy, no! ¿Y qué hiciste?", accept: ["¡Ay, no! ¿Y qué hiciste?"] },
    { en: "How awful, I'm so sorry!", es: "¡Qué horror, cuánto lo siento!", accept: ["¡Qué horror, lo siento mucho!"] }
  ],
  translate: [
    { en: "Really? I wasn't expecting that.", es: "¿De verdad? No me lo esperaba.", accept: ["¿En serio? No me lo esperaba."] },
    { en: "Uh-huh, yes, go on. (to a friend)", es: "Ajá, sí, sigue.", accept: [] },
    { en: "What a shame! And how is your grandmother doing? (to a friend)", es: "¡Qué pesar! ¿Y tu abuela cómo sigue?", accept: ["¡Qué pena! ¿Y tu abuela cómo sigue?", "¡Qué pesar! ¿Y cómo sigue tu abuela?"] },
    { en: "I understand, please go on. (to someone you call usted)", es: "Entiendo, siga, por favor.", accept: ["Entiendo, continúe, por favor."] },
    { en: "And then? (to a friend)", es: "¿Y entonces?", accept: ["¿Y después?"] }
  ],
  register: [
    { es: "Ajá.", en: "Uh-huh.", when: "the smallest signal, while they talk" },
    { es: "¿Y entonces?", en: "And then?", when: "asking for more, with friends" },
    { es: "¡No me digas!", en: "You don't say!", when: "surprise, everywhere" },
    { es: "¡Uy, qué pesar!", en: "Oh, what a shame!", when: "Colombian, when the news is sad" },
    { es: "Entiendo, continúe.", en: "I see, go on.", when: "polite, with someone you call usted" }
  ],
  personal: {
    prompt: "A friend tells you they missed their flight. Write your side of the conversation: four reactions that keep them talking.",
    constraints: [
      { type: "containsAny", words: ["¿en serio", "¿de verdad", "no me digas"], label: "surprise: *¿En serio?* or *¡No me digas!*" },
      { type: "containsAny", words: ["¿y entonces", "¿y qué pasó", "¿y qué hiciste", "¿y después"], label: "ask for more: *¿Y entonces?*" },
      { type: "containsAny", words: ["qué horror", "qué pesar", "qué pena", "¡uy", "¡ay"], label: "feel it with them: *¡Uy, no!* or *¡Qué pesar!*" },
      { type: "minSentences", n: 4, label: "four reactions" }
    ],
    model: "¿En serio? ¡Uy, no! ¿Y qué hiciste? ¿Y entonces te tocó dormir en el aeropuerto?"
  },
  pitfalls: [
    "*Vaya* is common in Spain; in Colombia you'll hear *¡Uy!*, *¡Qué pesar!* or *¡No me digas!* far more.",
    "Said with interest, *¿En serio?* asks for more; said flat, it sounds as if you doubt them.",
    "Jumping in with your own story (*A mí me pasó algo peor*) takes the floor away: ask *¿Y entonces?* first."
  ]
},

"fn-interrumpir-b1": {
  source: "merged",
  hook: {
    line: "At a family lunch in Bogotá, five people are talking at once and nobody waits for a full stop. To get a word in, say sorry first, keep it short, then say why.",
    es: "Perdón que te interrumpa, pero ya llegó el taxi.",
    en: "Sorry to interrupt you, but the taxi's here."
  },
  examples: [
    { es: "Disculpe que lo interrumpa, pero es urgente.", en: "Sorry to interrupt you, but it's urgent." },
    { es: "Un momento, ¿puedo decir una cosa?", en: "Just a moment, can I say something?" },
    { es: "Solo una cosa, antes de que sigas.", en: "Just one thing, before you go on." }
  ],
  rule: "Say sorry first, then break in, then give the reason.\n*Perdón* or *perdona que te interrumpa, pero...* to a friend. *Disculpe que lo interrumpa* to a man you call *usted*, *que la interrumpa* to a woman, *que los interrumpa* to a group.\n*Interrumpa* is the subjunctive: you're apologising for what you're doing.\nKeep it small: *Un momento, ¿puedo decir algo?* *Solo una cosa.* *Antes de que sigas...*\nAsk to add: *¿Puedo agregar algo?*\nVery Colombian, and very polite: *Qué pena interrumpirte.*\nThen hand the floor back: *Perdón, sigue.*",
  readAndPick: [
    { q: "When does the apology come?", es: "Perdona que te interrumpa, pero ya es tarde.",
      options: ["Before breaking in", "After the interruption", "Never: it's rude"], answer: 0,
      why: "*Perdona que te interrumpa* opens the sentence: sorry first, then the reason." },
    { q: "Who is she interrupting?", es: "Disculpe que la interrumpa, pero tiene una llamada.",
      options: ["A close friend of hers", "A woman she calls usted", "A whole group of people"], answer: 1,
      why: "*Disculpe* and *la*: one woman, addressed as *usted*." },
    { q: "How big is the interruption?", es: "Solo una cosa, antes de que sigas.",
      options: ["A long speech", "A change of topic", "Very small"], answer: 2,
      why: "*Solo una cosa*: just one thing, then you can go on." },
    { q: "What does *qué pena* mean here?", es: "Qué pena interrumpirte, pero te llaman.",
      options: ["How sad it all is", "Sorry to bother you", "What a terrible pity"], answer: 1,
      why: "In Colombia, *qué pena* is a polite sorry, a little embarrassed." },
    { q: "What is he doing now?", es: "Perdón, sigue, te interrumpí.",
      options: ["Handing the floor back", "Interrupting again", "Leaving"], answer: 0,
      why: "*Sigue*: go on, the floor is yours again." }
  ],
  yourTurn: [
    { en: "Sorry to interrupt you, but it's already late. (to a friend)", es: "Perdona que te interrumpa, pero ya es tarde.", accept: ["[Perdón|Disculpa] que te interrumpa, pero ya es tarde."] },
    { en: "Sorry to interrupt you, but it's urgent. (to a man you call usted)", es: "Disculpe que lo interrumpa, pero es urgente.", accept: ["[Perdone|Perdón] que lo interrumpa, pero es urgente."] },
    { en: "Just a moment, can I say something?", es: "Un momento, ¿puedo decir algo?", accept: ["Un momento, ¿puedo decir una cosa?"] },
    { en: "Sorry, go on. (to a friend)", es: "Perdón, sigue.", accept: ["Perdona, sigue."] }
  ],
  translate: [
    { en: "Just one thing, before you go on. (to a friend)", es: "Solo una cosa, antes de que sigas.", accept: ["Una sola cosa, antes de que sigas."] },
    { en: "Sorry to interrupt you all, but the food is here.", es: "Perdón que los interrumpa, pero ya llegó la comida.", accept: ["[Disculpen|Perdonen] que los interrumpa, pero ya llegó la comida."] },
    { en: "Can I add something?", es: "¿Puedo agregar algo?", accept: ["¿Puedo añadir algo?"] },
    { en: "Sorry to interrupt you, but you have a call. (to a woman you call usted)", es: "Disculpe que la interrumpa, pero tiene una llamada.", accept: ["Perdone que la interrumpa, pero tiene una llamada."] },
    { en: "Sorry to cut in, but someone's calling you. (to a friend)", es: "Qué pena interrumpirte, pero te llaman.", accept: ["Qué pena interrumpirte, pero te están llamando."] }
  ],
  register: [
    { es: "Un momento...", en: "One moment...", when: "quick, in a lively conversation" },
    { es: "Perdón que te interrumpa.", en: "Sorry to interrupt you.", when: "the safe way, with friends" },
    { es: "Qué pena interrumpirte.", en: "Sorry to cut in.", when: "Colombian, warm and apologetic" },
    { es: "Disculpe que lo interrumpa.", en: "Excuse me for interrupting.", when: "polite, with someone you call usted" },
    { es: "Si me permite, me gustaría agregar algo.", en: "If I may, I'd like to add something.", when: "formal, at a meeting" }
  ],
  personal: {
    prompt: "You're at a meeting and need to say something right now. Write what you'd say: the apology, the reason, and handing the floor back.",
    constraints: [
      { type: "regex", pattern: "(perdón|perdona|perdone|disculpa|disculpe|perdonen|disculpen) que (te|lo|la|los|las) interrump", label: "the apology: *perdón que te interrumpa*" },
      { type: "containsWord", word: "pero", label: "the reason, after *pero*" },
      { type: "containsAny", words: ["sigue", "siga", "sigan", "continúa", "continúe"], label: "hand the floor back: *sigue* or *siga*" }
    ],
    model: "Disculpe que lo interrumpa, pero tenemos que salir de la sala a las once. Perdón, siga."
  },
  pitfalls: [
    "*Perdona que te interrumpo* keeps the ordinary form: you're apologising, so *interrumpa*.",
    "*Disculpe que te interrumpa* mixes two forms: with *usted*, *lo* or *la*.",
    "Saying sorry after you've barged in is too late: the apology goes first."
  ]
},

"fn-controlar-atencion-b1": {
  source: "old",
  hook: {
    line: "You're explaining your new address to your aunt over a terrible phone line, then showing a colleague how the coffee machine works. One is about the line, the other about understanding, and Spanish checks each differently.",
    es: "¿Aló? ¿Me escuchas? Se está cortando.\nMira, esto es importante, ¿me explico?",
    en: "Hello? Can you hear me? It's cutting out.\nLook, this is important, do you see what I mean?"
  },
  examples: [
    { es: "¿Sigues ahí? No te escucho.", en: "Are you still there? I can't hear you." },
    { es: "Es facilito, ¿sí me entiendes?", en: "It's really easy, you get me, right?" },
    { es: "¿Me sigue, señora?", en: "Are you following me, ma'am?" }
  ],
  rule: "Face to face, check they understand:\n*¿Me entiendes?* *¿Me explico?* Or a tag at the end: *Es fácil, ¿no?* *¿sí?*\nGrab attention: *Mira...* *Oye...*\nOn the phone, check the line itself:\n*¿Aló?* *¿Me escuchas?* *¿Sigues ahí?* *No te escucho bien.* *Se está cortando.* *Se cortó.*\nIn Latin America, *escuchar* is the everyday verb for hearing on the phone.\nTo *usted*: *¿Me escucha?* *¿Me sigue?*\nIf you missed it: *¿Cómo?* *¿Perdón?*",
  readAndPick: [
    { q: "What is the problem?", es: "¿Me escuchas? Se está cortando.",
      options: ["She doesn't understand", "The line is bad", "She's angry"], answer: 1,
      why: "*Se está cortando*: the call is breaking up, a problem with the line." },
    { q: "What is he checking?", es: "Mira, es muy fácil, ¿me explico?",
      options: ["That the line is working", "That you've understood him", "That you're still in the room"], answer: 1,
      why: "*¿Me explico?* checks you followed, not that you can hear." },
    { q: "When would you say this?", es: "¿Aló? ¿Aló? Se cortó.",
      options: ["At the start of a meeting", "When you don't understand", "When a call drops"], answer: 2,
      why: "*Se cortó*: the call has dropped." },
    { q: "Who is he talking to?", es: "¿Me sigue, don Jorge?",
      options: ["An older man, politely", "A friend his own age", "His son"], answer: 0,
      why: "*Don* and *me sigue*, the *usted* form: polite and respectful." },
    { q: "What does she want?", es: "¿Cómo? Perdón, no te escuché.",
      options: ["To change the subject", "For you to say it again", "To end the call now"], answer: 1,
      why: "*¿Cómo?* here asks you to repeat it: she didn't catch it." }
  ],
  yourTurn: [
    { en: "Can you hear me? (to a friend, on the phone)", es: "¿Me escuchas?", accept: ["¿Me oyes?"] },
    { en: "It's cutting out.", es: "Se está cortando.", accept: ["Se corta."] },
    { en: "Are you still there? I can't hear you. (to a friend)", es: "¿Sigues ahí? No te escucho.", accept: ["¿Sigues ahí? No te oigo."] },
    { en: "Look, this is important, do you understand? (to a friend)", es: "Mira, esto es importante, ¿me entiendes?", accept: [] },
    { en: "Sorry, I didn't hear you. (to a friend)", es: "Perdón, no te escuché.", accept: ["Perdón, no te oí.", "Perdona, no te escuché."] }
  ],
  translate: [
    { en: "Hello? Can you hear me? I can't hear anything. (to someone you call usted)", es: "¿Aló? ¿Me escucha? No se escucha nada.", accept: ["¿Aló? ¿Me oye? No se oye nada."] },
    { en: "Are you following me, ma'am?", es: "¿Me sigue, señora?", accept: [] },
    { en: "It's easy, isn't it?", es: "Es fácil, ¿no?", accept: ["Es fácil, ¿verdad?"] },
    { en: "The call dropped.", es: "Se cortó la llamada.", accept: ["Se cayó la llamada."] },
    { en: "I can hardly hear you, can you hear me? (to a friend)", es: "Te escucho muy mal, ¿tú me escuchas?", accept: ["Te escucho muy mal, ¿me escuchas?", "Te oigo muy mal, ¿me oyes?"] }
  ],
  register: [
    { es: "¿Me escuchas?", en: "Can you hear me?", when: "on the phone, everyday Latin American" },
    { es: "¿Me explico?", en: "Do you see what I mean?", when: "checking understanding, a little emphatic" },
    { es: "¿Sí me entiendes?", en: "You do get me, right?", when: "Colombian, friendly and warm" },
    { es: "¿Me sigue?", en: "Are you following me?", when: "polite, with someone you call usted" }
  ],
  personal: {
    prompt: "You're on a bad phone line explaining how to get to your house. Write three lines: check the line, explain one step, and check they understood.",
    constraints: [
      { type: "containsAny", words: ["¿me escuchas", "¿me oyes", "¿sigues ahí", "¿aló", "se está cortando", "se corta", "¿me escucha"], label: "check the line: *¿Me escuchas?*" },
      { type: "containsAny", words: ["¿me entiendes", "¿me explico", "¿me sigues", "¿sí?", "¿no?", "¿me sigue"], label: "check they understood: *¿me explico?*" }
    ],
    model: "¿Aló? ¿Me escuchas? Se está cortando un poco. Mira, te bajas en la estación de la calle 45 y caminas dos cuadras, ¿me explico?"
  },
  pitfalls: [
    "*¿Se ha cortado?* is from Spain. In Colombia: *¿Se cortó?*",
    "*¿Oiga?* answers the phone in Spain; in Colombia it's *¿Aló?*",
    "*Te oigo fatal* sounds Spanish: in Colombia, *te escucho muy mal*."
  ]
},

"fn-has-oido-b1": {
  source: "merged",
  hook: {
    line: "At the café on the corner, news travels faster than the tinto. Spanish keeps two questions apart: have you heard this bit of news, and have you ever come across this name at all?",
    es: "¿Supiste que cerraron la panadería de la esquina?\n¿Y has oído hablar de Débora Arango?",
    en: "Did you hear they closed the bakery on the corner?\nAnd have you heard of Débora Arango?"
  },
  examples: [
    { es: "¿Te enteraste de lo de Andrés?", en: "Did you hear about Andrés?" },
    { es: "Oí que van a cerrar la calle el sábado.", en: "I heard they're going to close the street on Saturday." },
    { es: "¿Ha oído hablar de esta empresa?", en: "Have you heard of this company?" }
  ],
  rule: "Two questions, two jobs.\nNews takes the plain past: *¿Supiste que...?* *¿Viste que...?* *¿Te enteraste de...?* *Oí que cerraron la panadería.* After *que*, the news is an ordinary sentence.\n*Lo de* points at a story without retelling it: *¿Te enteraste de lo de Andrés?*\nWhether someone has ever come across a name: *oír hablar de* and the perfect, for experience. *¿Has oído hablar de Débora Arango?* *Nunca he oído hablar de ese barrio.*\nKeep the *de*: *me enteré de que se casan*.\nTo *usted*: *¿Supo que...?* *¿Ha oído hablar de...?*",
  readAndPick: [
    { q: "What is she asking?", es: "¿Has oído hablar de Totó la Momposina?",
      options: ["If you know the name at all", "If you heard her sing yesterday", "If you've met her"], answer: 0,
      why: "*Oír hablar de* and the perfect: have you ever come across her?" },
    { q: "What is he passing on?", es: "¿Supiste que Laura se va a casar?",
      options: ["An old family story", "A rumour about a singer", "A fresh bit of news"], answer: 2,
      why: "*¿Supiste que...?* brings news, in the plain past." },
    { q: "What does *lo de* point to?", es: "¿Te enteraste de lo del accidente?",
      options: ["A place somewhere nearby", "A story you both know of", "A brand new word for it"], answer: 1,
      why: "*Lo del accidente*: the business with the accident, without retelling it." },
    { q: "Who is she asking?", es: "¿Ha oído hablar de esta empresa?",
      options: ["A friend of hers", "A client, politely", "Her kids"], answer: 1,
      why: "*¿Ha oído?*: the *usted* form, for a client." },
    { q: "When did she find out?", es: "Me enteré ayer por Mariana.",
      options: ["Today, on the news", "She hasn't yet", "Yesterday, from Mariana"], answer: 2,
      why: "*Me enteré*: I found out. *Por Mariana* says who told her." }
  ],
  yourTurn: [
    { en: "Did you hear they closed the street? (to a friend)", es: "¿Supiste que cerraron la calle?", accept: ["¿Viste que cerraron la calle?", "¿Te enteraste de que cerraron la calle?"] },
    { en: "Have you heard of Botero? (to a friend)", es: "¿Has oído hablar de Botero?", accept: [] },
    { en: "I heard they closed the bakery.", es: "Oí que cerraron la panadería.", accept: ["Supe que cerraron la panadería."] },
    { en: "Did you hear about Andrés? (to a friend)", es: "¿Te enteraste de lo de Andrés?", accept: ["¿Supiste lo de Andrés?"] },
    { en: "I've never heard of that neighbourhood.", es: "Nunca he oído hablar de ese barrio.", accept: ["No he oído hablar nunca de ese barrio."] }
  ],
  translate: [
    { en: "I found out about the sale from the newspaper.", es: "Me enteré de la venta por el periódico.", accept: [] },
    { en: "Have you heard of this company? (to someone you call usted)", es: "¿Ha oído hablar de esta empresa?", accept: [] },
    { en: "Did you see they're building a new metro line? (to a friend)", es: "¿Viste que están construyendo una nueva línea del metro?", accept: ["¿Supiste que están construyendo una nueva línea del metro?"] },
    { en: "When did you find out? (to a friend)", es: "¿Cuándo te enteraste?", accept: [] },
    { en: "Have you heard the latest gossip? (to a friend)", es: "¿Ya oíste el último chisme?", accept: ["¿Supiste el último chisme?"] }
  ],
  register: [
    { es: "¿Supiste que...?", en: "Did you hear that...?", when: "news, everyday Colombian" },
    { es: "¿Viste que...?", en: "Did you see that...?", when: "news, very casual" },
    { es: "¿Te enteraste de lo de...?", en: "Did you hear about...?", when: "pointing at a story everyone's talking about" },
    { es: "¿Ha oído hablar de...?", en: "Have you heard of...?", when: "polite, about a name or a company" }
  ],
  personal: {
    prompt: "Share one piece of news you heard this week, and ask a friend whether they've heard of someone famous from your country.",
    constraints: [
      { type: "containsAny", words: ["¿supiste que", "¿viste que", "¿te enteraste", "oí que", "me enteré de"], label: "the news: *¿Supiste que...?* or *Oí que...*" },
      { type: "containsAny", words: ["has oído hablar de", "ha oído hablar de", "han oído hablar de"], label: "a name: *¿Has oído hablar de...?*" }
    ],
    model: "¿Supiste que van a abrir un parque nuevo en el barrio? Y otra cosa, ¿has oído hablar de Débora Arango? Es una pintora de Medellín."
  },
  pitfalls: [
    "*¿Has oído que...?* for fresh news is how Spain asks. In Colombia, the plain past: *¿Supiste que...?*",
    "*¿Has oído hablar que...?* mixes the two: *hablar de* takes a name, news takes *oí que*.",
    "*Me enteré que* drops a word you should write: *me enteré de que*."
  ]
},

"fn-conocimiento-desconocimiento-b1": {
  source: "merged",
  hook: {
    line: "Your coworker asks about the new boss, the office move and whether Friday's meeting is cancelled. You know some of it, you heard some of it, and some of it you have no idea about. Spanish gives each its own shape.",
    es: "Sé que llega el lunes. Oí que es de Cali.\nY de la reunión, ni idea.",
    en: "I know she arrives on Monday. I heard she's from Cali.\nAnd about the meeting, no idea."
  },
  examples: [
    { es: "Sé un poco de música clásica.", en: "I know a bit about classical music." },
    { es: "No sabía que tus papás vivían en Pereira.", en: "I didn't know your parents lived in Pereira." },
    { es: "Que yo sepa, la reunión sigue en pie.", en: "As far as I know, the meeting is still on." }
  ],
  rule: "What you know: *sé que* and an ordinary sentence. *Sé que llega el lunes.* A topic: *sé algo de*, *sé mucho de*, *no sé nada de*.\nWhat you heard: *oí que*, *me dijeron que*, *leí que*, then the news as it is. *Oí que es de Cali.*\nWhat you didn't know until now: *no sabía que* and the ordinary form. *No sabía que vivías aquí.*\nAs far as you know: *que yo sepa*, with the subjunctive built in. *Que yo sepa, sigue en pie.*\nNo idea at all: *ni idea*, *no tengo ni idea*. Strong and casual.\nNot your area: *De eso no sé nada.*",
  readAndPick: [
    { q: "How sure is he?", es: "Que yo sepa, la reunión sigue en pie.",
      options: ["Certain: he checked it twice", "Fairly sure, not certain", "He has no idea at all"], answer: 1,
      why: "*Que yo sepa*: as far as he knows, with room to be wrong." },
    { q: "What didn't she know?", es: "No sabía que tus papás vivían en Pereira.",
      options: ["Who your parents are", "That your parents had left", "Where your parents live"], answer: 2,
      why: "*No sabía que* and the ordinary *vivían*: the fact is true, she just didn't know." },
    { q: "Where did the news come from?", es: "Me dijeron que el jefe nuevo es de Cali.",
      options: ["Someone told her", "She read it somewhere", "She's only guessing"], answer: 0,
      why: "*Me dijeron que*: somebody told her, and she passes it on as it is." },
    { q: "How does *ni idea* sound?", es: "¿Y la clave del wifi? Ni idea.",
      options: ["Formal and polite", "Casual and blunt", "Very apologetic"], answer: 1,
      why: "*Ni idea* is short and blunt: fine with friends, curt at work." },
    { q: "How much does he know about films?", es: "Pedro no sabe nada de cine.",
      options: ["A lot", "A little", "Nothing"], answer: 2,
      why: "*No sabe nada de*: nothing at all about the topic." }
  ],
  yourTurn: [
    { en: "I know a bit about classical music.", es: "Sé un poco de música clásica.", accept: ["Sé algo de música clásica."] },
    { en: "I heard she's from Cali.", es: "Oí que es de Cali.", accept: ["Me dijeron que es de Cali."] },
    { en: "I didn't know you lived here. (to a friend)", es: "No sabía que vivías aquí.", accept: ["No sabía que vivías acá."] },
    { en: "As far as I know, the meeting is still on.", es: "Que yo sepa, la reunión sigue en pie.", accept: [] },
    { en: "I have no idea.", es: "No tengo ni idea.", accept: ["Ni idea."] }
  ],
  translate: [
    { en: "I know perfectly well that he arrives on Monday.", es: "Sé perfectamente que llega el lunes.", accept: [] },
    { en: "Pedro knows nothing about film.", es: "Pedro no sabe nada de cine.", accept: [] },
    { en: "I read that some universities help you find a job.", es: "Leí que algunas universidades te ayudan a buscar trabajo.", accept: ["Leí que algunas universidades te ayudan a conseguir trabajo."] },
    { en: "I didn't know they had moved.", es: "No sabía que se habían mudado.", accept: ["No sabía que se habían trasteado."] },
    { en: "I don't know anything about that.", es: "De eso no sé nada.", accept: ["No sé nada de eso."] }
  ],
  register: [
    { es: "Ni idea.", en: "No idea.", when: "casual and blunt, among friends" },
    { es: "No tengo ni idea.", en: "I have no idea.", when: "everyday, a little stronger" },
    { es: "Que yo sepa, no.", en: "Not as far as I know.", when: "careful, when you aren't sure" },
    { es: "No tengo conocimiento de eso.", en: "I have no knowledge of that.", when: "formal, at work or officially" }
  ],
  personal: {
    prompt: "Someone asks you about a change at your work or school. Write three lines: one thing you know, one thing you heard, and one thing you have no idea about.",
    constraints: [
      { type: "regex", pattern: "(^|[^a-záéíóúñ])sé (que|algo|mucho|un poco)", label: "what you know: *sé que*" },
      { type: "containsAny", words: ["oí que", "me dijeron que", "leí que", "me enteré de que"], label: "what you heard: *oí que* or *me dijeron que*" },
      { type: "containsAny", words: ["ni idea", "no sé nada"], label: "what you don't know: *ni idea*" }
    ],
    model: "Sé que la oficina nueva queda en Chapinero. Me dijeron que nos trasteamos en marzo. Y del parqueadero, ni idea."
  },
  pitfalls: [
    "*He oído que* is how Spain reports news. In Colombia: *oí que* or *me dijeron que*.",
    "*Que yo sé* is a common slip: the set phrase is *que yo sepa*.",
    "*No tengo ni idea* is strong and casual: at work, *no tengo conocimiento* or *no estoy seguro*."
  ]
},

"gn-llamada-transaccional-b1": {
  source: "old",
  hook: {
    line: "You're calling a hotel in Santa Marta to book a room for a long weekend. A call like this has a shape: say why you're calling, compare options, ask for advice, choose, and close it properly instead of just hanging up.",
    es: "Buenos días, llamaba para preguntar por una habitación para el puente.",
    en: "Good morning, I was calling to ask about a room for the long weekend."
  },
  examples: [
    { es: "¿Y cuál me recomienda, la sencilla o la doble?", en: "And which do you recommend, the single or the double?" },
    { es: "Perfecto, me quedo con esa. Eso sería todo, muchas gracias.", en: "Perfect, I'll take that one. That'd be all, thank you very much." }
  ],
  rule: "A booking call has five moves.\nHello and why you're calling: *Buenos días, llamaba para preguntar por...* The *-aba* softens it.\nInformation: *¿Tienen habitaciones para el fin de semana?* *¿Cuánto vale la noche?*\nOptions and advice: *¿Cuál me recomienda?* *Yo le recomendaría la doble.*\nYour choice: *Me quedo con esa.* *Prefiero la que da al mar.*\nThe close, in small steps: *Perfecto, muchas gracias.* *Eso sería todo.* *¿Algo más? No, nada más.* *Que tenga buen día.* *Igualmente.*\nHanging up straight after the price sounds abrupt.",
  readAndPick: [
    { q: "Why *llamaba* and not *llamo*?", es: "Buenos días, llamaba para preguntar por una habitación.",
      options: ["The call is already over", "It softens the request", "She called yesterday"], answer: 1,
      why: "The *-aba* form makes the opening softer and more polite." },
    { q: "What is he asking for?", es: "¿Y cuál me recomienda?",
      options: ["Advice", "The price", "A room number"], answer: 0,
      why: "*¿Cuál me recomienda?* asks the other person to advise." },
    { q: "What does she mean?", es: "Me quedo con la que da al mar.",
      options: ["She'll stay by the sea all week", "She wants to see the sea first", "She'll take the sea-view one"], answer: 2,
      why: "*Me quedo con* is I'll take; *la que da al mar* is the one facing the sea." },
    { q: "What is *eso sería todo* doing?", es: "Perfecto. Eso sería todo, muchas gracias.",
      options: ["Starting the call", "Asking for more", "Closing the call"], answer: 2,
      why: "*Eso sería todo* says you have everything you need: the close begins." },
    { q: "What does the receptionist say?", es: "Con mucho gusto. Que tenga un buen día.",
      options: ["You're welcome, have a good day", "See you tomorrow at the hotel", "Please call back a bit later"], answer: 0,
      why: "*Con mucho gusto* answers thanks in Colombia; *que tenga un buen día* closes it." }
  ],
  yourTurn: [
    { en: "Good morning, I was calling to ask about a room.", es: "Buenos días, llamaba para preguntar por una habitación.", accept: [] },
    { en: "Which one do you recommend? (to someone you call usted)", es: "¿Cuál me recomienda?", accept: [] },
    { en: "I'll take that one.", es: "Me quedo con esa.", accept: ["Me quedo con esa habitación."] },
    { en: "That would be all, thank you very much.", es: "Eso sería todo, muchas gracias.", accept: [] }
  ],
  translate: [
    { en: "Do you have rooms for the weekend?", es: "¿Tienen habitaciones para el fin de semana?", accept: ["¿Tienen habitaciones disponibles para el fin de semana?"] },
    { en: "How much is a night, with breakfast included?", es: "¿Cuánto vale la noche, con desayuno incluido?", accept: ["¿Cuánto cuesta la noche, con desayuno incluido?"] },
    { en: "I'd rather have the one with a sea view.", es: "Prefiero la que tiene vista al mar.", accept: ["Prefiero la que da al mar."] },
    { en: "No, nothing else, thank you.", es: "No, nada más, gracias.", accept: [] },
    { en: "You're welcome. Have a good day.", es: "Con mucho gusto. Que tenga un buen día.", accept: ["Con gusto. Que tenga un buen día."] }
  ],
  register: [
    { es: "¿Aló? Buenas.", en: "Hello? Hi.", when: "answering among friends or family" },
    { es: "Hotel Las Palmas, buenos días, habla con Diana.", en: "Las Palmas Hotel, good morning, Diana speaking.", when: "answering the phone at work" },
    { es: "Llamaba para preguntar por...", en: "I was calling to ask about...", when: "opening a request, politely" },
    { es: "Eso sería todo.", en: "That would be all.", when: "Colombian, closing a call or an order" },
    { es: "Con mucho gusto.", en: "You're welcome.", when: "Colombian, the warm reply to thanks" }
  ],
  personal: {
    prompt: "Write your side of a call booking a table or a room: say why you're calling, ask for one recommendation, choose, and close the call properly.",
    constraints: [
      { type: "containsAny", words: ["llamaba para", "quería preguntar por"], label: "why you're calling: *llamaba para...*" },
      { type: "containsAny", words: ["¿cuál me recomienda", "¿qué me recomienda", "¿cuál recomienda"], label: "ask for advice: *¿Cuál me recomienda?*" },
      { type: "containsAny", words: ["me quedo con", "prefiero"], label: "your choice: *me quedo con*" },
      { type: "containsAny", words: ["eso sería todo", "nada más", "que tenga buen día", "que tenga un buen día"], label: "the close: *eso sería todo*" }
    ],
    model: "Buenos días, llamaba para preguntar por una mesa para el sábado en la noche. Somos cuatro. ¿Cuál me recomienda, adentro o en la terraza? Perfecto, me quedo con la terraza. Eso sería todo, muchas gracias. Que tenga un buen día."
  },
  pitfalls: [
    "*¿Dígame?* answers the phone in Spain. In Colombia: *¿Aló?*, or the company's name at work.",
    "Hanging up straight after the price sounds abrupt: close with *eso sería todo* and *que tenga buen día*.",
    "Prices in Colombia are in pesos, often in thousands: *ciento ochenta mil la noche*."
  ]
},

"fn-preguntar-persona-telefono-b1": {
  source: "old",
  hook: {
    line: "You call your friend's office to speak to her, and the receptionist answers. There are only a few ways the call can go: you're put through, she's out, you've got the wrong number, or you leave a message. Each has its set phrase.",
    es: "Buenas tardes, ¿podría hablar con la doctora Valencia?\n¿De parte de quién?",
    en: "Good afternoon, could I speak to Dr Valencia?\nWho's calling?"
  },
  examples: [
    { es: "Ya se la paso, un momento.", en: "I'll put you through to her, one moment." },
    { es: "Lo siento, no se encuentra en este momento.", en: "I'm sorry, she isn't in at the moment." },
    { es: "Creo que está equivocado de número.", en: "I think you've got the wrong number." }
  ],
  rule: "Asking for someone: *¿Podría hablar con...?* *¿Está Andrés?* *Quería hablar con la señora Valencia.*\nThe other side has a short list:\nWho's calling: *¿De parte de quién?* *De parte de Laura.*\nPutting you through: *Ya se lo paso.* *Un momento, por favor.*\nNot there: *No se encuentra.* *No está en este momento.*\nBusy right now: *En este momento no puede pasar.*\nWrong number: *Está equivocado.* *Marcó mal.*\nA message: *¿Quiere dejarle un mensaje?* *¿Le digo que llamó?*\nIf the call is for you: *Con ella habla*, or *con él habla*.",
  readAndPick: [
    { q: "What does the receptionist want to know?", es: "¿De parte de quién?",
      options: ["Who you want to speak to", "Who's calling", "Where you're calling from"], answer: 1,
      why: "*¿De parte de quién?*: who should I say is calling?" },
    { q: "Will you speak to her now?", es: "Ya se la paso, un momento.",
      options: ["Yes, in a moment", "No, she's out today", "No, it's the wrong number"], answer: 0,
      why: "*Ya se la paso*: I'm putting you through to her." },
    { q: "What has happened?", es: "Creo que marcó mal, aquí no hay ninguna Laura.",
      options: ["Laura is out", "Laura is busy", "You dialled wrong"], answer: 2,
      why: "*Marcó mal*: you dialled the wrong number. There's no Laura there." },
    { q: "Who is answering?", es: "¿Laura? Con ella habla.",
      options: ["Her assistant", "Laura herself", "Her mother"], answer: 1,
      why: "*Con ella habla*: you're speaking to her." },
    { q: "What is she offering?", es: "No se encuentra. ¿Quiere dejarle un mensaje?",
      options: ["To call you back now", "To give you her number", "To take a message"], answer: 2,
      why: "*¿Quiere dejarle un mensaje?* is the usual offer once the person is out." }
  ],
  yourTurn: [
    { en: "Good afternoon, could I speak to Andrés, please?", es: "Buenas tardes, ¿podría hablar con Andrés, por favor?", accept: ["Buenas tardes, ¿puedo hablar con Andrés, por favor?"] },
    { en: "Who's calling?", es: "¿De parte de quién?", accept: [] },
    { en: "I'm sorry, he isn't in at the moment.", es: "Lo siento, no se encuentra en este momento.", accept: ["Lo siento, no está en este momento."] },
    { en: "Would you like to leave him a message? (to someone you call usted)", es: "¿Quiere dejarle un mensaje?", accept: ["¿Le quiere dejar un mensaje?"] },
    { en: "Speaking. (when you are the woman they asked for)", es: "Con ella habla.", accept: [] }
  ],
  translate: [
    { en: "I'll put you through to him, one moment.", es: "Ya se lo paso, un momento.", accept: [] },
    { en: "I think you've got the wrong number.", es: "Creo que está equivocado de número.", accept: ["Creo que marcó mal.", "Creo que está equivocada de número."] },
    { en: "Shall I tell her you called? (to someone you call usted)", es: "¿Le digo que llamó?", accept: [] },
    { en: "She can't come to the phone right now.", es: "En este momento no puede pasar.", accept: ["Ahora no puede pasar."] },
    { en: "It's Laura calling. (answering who's calling)", es: "De parte de Laura.", accept: [] }
  ],
  register: [
    { es: "¿Está Andrés?", en: "Is Andrés there?", when: "casual, to a home or a friend's phone" },
    { es: "¿Podría hablar con Andrés?", en: "Could I speak to Andrés?", when: "polite, to an office" },
    { es: "¿Me comunica con el área de ventas?", en: "Could you put me through to sales?", when: "formal, at a company switchboard" },
    { es: "Con él habla.", en: "Speaking.", when: "Colombian, when the call is for you" }
  ],
  personal: {
    prompt: "You answer the phone at work. The caller wants a colleague who is out. Write your side: ask who's calling, say they're out, and offer to take a message.",
    constraints: [
      { type: "containsWord", word: "de parte de quién", label: "who's calling: *¿De parte de quién?*" },
      { type: "containsAny", words: ["no se encuentra", "no está"], label: "they're out: *no se encuentra*" },
      { type: "containsAny", words: ["mensaje", "¿le digo que"], label: "take a message: *¿Quiere dejarle un mensaje?*" }
    ],
    model: "Buenos días, ¿de parte de quién? Lo siento, la ingeniera Rojas no se encuentra en este momento. ¿Quiere dejarle un mensaje?"
  },
  pitfalls: [
    "*No está* means the right number at the wrong moment; a wrong number is *está equivocado* or *marcó mal*.",
    "*Se ha confundido de número* is how Spain says it. In Colombia: *está equivocado* or *marcó mal*.",
    "*Dejar un recado* sounds Spanish: in Colombia, *dejar un mensaje*."
  ]
},

"fn-pedir-informacion-b1": {
  source: "merged",
  hook: {
    line: "You're new in Medellín and need to ask strangers things all day: where the station is, whether the museum opens on Mondays, what time the last metro leaves. Wrapping the question inside *¿Sabe...?* or *¿Me podría decir...?* makes it polite.",
    es: "Disculpe, ¿sabe si el museo abre los lunes?\n¿Y me podría decir dónde queda la estación?",
    en: "Excuse me, do you know if the museum opens on Mondays?\nAnd could you tell me where the station is?"
  },
  examples: [
    { es: "No sé dónde dejé las llaves.", en: "I don't know where I left the keys." },
    { es: "Quería saber cuánto cuesta el curso.", en: "I wanted to know how much the course costs." },
    { es: "Me preguntó si quería ir con ellos.", en: "He asked me if I wanted to go with them." }
  ],
  rule: "Put the question inside another sentence: *¿Sabe...?*, *¿Me podría decir...?*, *Quería saber...*, *No sé...*, *Me preguntó...*\nA question word keeps its accent: *dónde*, *cuánto*, *a qué hora*. *¿Me podría decir a qué hora cierra?*\nA yes or no question takes *si*, with no accent: *¿Sabe si abre los lunes?*\nThe verb comes straight after the question word: *dónde queda la estación*, not *dónde la estación queda*.\nOnly the outer question gets question marks: *No sé dónde está.*\n*¿Sabes...?* is for friends; with strangers, *¿Sabe...?* or *¿Me podría decir...?*\n*Queda* is how Colombians ask where a place is.",
  readAndPick: [
    { q: "Who is he asking?", es: "Disculpe, ¿me podría decir dónde queda la estación?",
      options: ["A friend of his", "His boss, rudely", "A stranger, politely"], answer: 2,
      why: "*Disculpe* and *podría*: polite forms, for someone he doesn't know." },
    { q: "Why *si* here?", es: "¿Sabe si el museo abre los lunes?",
      options: ["It sets up a condition", "A yes or no question", "It's another way to say yes"], answer: 1,
      why: "The inner question is yes or no, so *si*, whether, with no accent." },
    { q: "What doesn't she know?", es: "No sé dónde dejé las llaves.",
      options: ["Where she left the keys", "Whose keys they are", "If she has any keys"], answer: 0,
      why: "*No sé dónde*: the question where is tucked inside, accent and all." },
    { q: "What did he ask me?", es: "Me preguntó si quería ir con ellos.",
      options: ["Where I was going", "Why I didn't go", "Whether I wanted to go"], answer: 2,
      why: "*Si quería*: a yes or no question, reported from the past." },
    { q: "Why is the word order right?", es: "¿Sabes a qué hora sale el último metro?",
      options: ["The verb follows the question word", "The subject comes first", "Either order is the same"], answer: 0,
      why: "*A qué hora sale el último metro*: verb first, then who or what." }
  ],
  yourTurn: [
    { en: "Do you know if it's open? (to someone you call usted)", es: "¿Sabe si está abierto?", accept: [] },
    { en: "Could you tell me where the station is? (to someone you call usted)", es: "¿Me podría decir dónde queda la estación?", accept: ["¿Me podría decir dónde está la estación?", "¿Podría decirme dónde [queda|está] la estación?", "¿Me puede decir dónde [queda|está] la estación?"] },
    { en: "I don't know where I left the keys.", es: "No sé dónde dejé las llaves.", accept: [] },
    { en: "I wanted to know how much the course costs.", es: "Quería saber cuánto cuesta el curso.", accept: ["Quería saber cuánto vale el curso."] },
    { en: "Do you know how to make arepas? (to a friend)", es: "¿Sabes cómo se hacen las arepas?", accept: ["¿Sabes hacer arepas?"] }
  ],
  translate: [
    { en: "Could you tell me what time the next train leaves? (to someone you call usted)", es: "¿Me podría decir a qué hora sale el próximo tren?", accept: ["¿Podría decirme a qué hora sale el próximo tren?"] },
    { en: "He asked me if I wanted to go with them.", es: "Me preguntó si quería ir con ellos.", accept: [] },
    { en: "I don't know if Valentina is coming.", es: "No sé si viene Valentina.", accept: ["No sé si Valentina viene.", "No sé si va a venir Valentina."] },
    { en: "Do you know who that man is? (to a friend)", es: "¿Sabes quién es ese señor?", accept: [] },
    { en: "Excuse me, do you know if this bus goes downtown? (to someone you call usted)", es: "Disculpe, ¿sabe si este bus va al centro?", accept: [] },
    { en: "Where is the station? (to someone you call usted)", es: "¿Dónde queda la estación?", accept: ["¿Dónde está la estación?"] }
  ],
  register: [
    { es: "¿Dónde queda la estación?", en: "Where's the station?", when: "direct, fine in a hurry" },
    { es: "¿Sabes dónde queda?", en: "Do you know where it is?", when: "with a friend" },
    { es: "¿Me podría decir dónde queda?", en: "Could you tell me where it is?", when: "polite, to a stranger" },
    { es: "Quería saber si tienen cupo.", en: "I wanted to know if you have a place.", when: "on the phone, a soft request" },
    { es: "Le agradezco informarme si el curso sigue abierto.", en: "Please let me know whether the course is still open.", when: "formal, in an email" }
  ],
  personal: {
    prompt: "You're calling a language school. Write three polite questions: one with *¿Sabe si...?*, one with *¿Me podría decir...?*, and one with *Quería saber...*",
    constraints: [
      { type: "containsAny", words: ["¿sabe si", "¿sabes si"], label: "*¿Sabe si...?*" },
      { type: "containsAny", words: ["me podría decir", "podría decirme", "me puede decir"], label: "*¿Me podría decir...?*" },
      { type: "containsWord", word: "quería saber", label: "*Quería saber...*" }
    ],
    model: "Buenos días, ¿sabe si todavía hay cupo en el curso de los sábados? ¿Me podría decir a qué hora empieza? Y quería saber cuánto cuesta el mes."
  },
  pitfalls: [
    "*¿Sabe sí está abierto?*: *si* meaning whether has no accent; *sí* is yes.",
    "*No sé donde está* drops the accent: question words keep it inside a sentence too, *dónde*.",
    "*¿Sabes dónde la estación está?* keeps English order: the verb comes first, *dónde está la estación*."
  ]
},

"dc-valores-ilocutivos-b1": {
  source: "merged",
  hook: {
    line: "At a friend's house in Barranquilla it's hot, and you'd like the window open. You could ask a question, but what you want is a favour. Spanish questions often do something else: ask permission, invite, offer, or share news.",
    es: "¿Te importa si abro la ventana?\n¿Te ayudo con los platos?",
    en: "Do you mind if I open the window?\nShall I help you with the dishes?"
  },
  examples: [
    { es: "¿Será que Ana está en la casa?", en: "Do you think Ana is home?" },
    { es: "¿Cenamos juntos mañana?", en: "Shall we have dinner together tomorrow?" },
    { es: "¿Sabes que ayer me encontré a María?", en: "You know I ran into María yesterday?" }
  ],
  rule: "A question isn't always a question. Listen for what it does.\nAsking permission: *¿Te importa si abro la ventana?* *¿Te importa que abra la ventana?* A *sí* means it bothers them; *No, para nada* means go ahead.\nAsking someone else, softly: *¿Te importaría cerrar la puerta?*\nInviting: *¿Cenamos juntos mañana?* *¿Y si vamos al cine?*\nOffering: *¿Te ayudo?* *¿Quiere que le ayude con las maletas?*\nSharing news: *¿Sabes que me encontré a María?* Answer the news, not the question.\nWondering aloud, very Colombian: *¿Será que Ana está en la casa?*\nAsking them to repeat: *¿Cómo?* *¿Perdón?*",
  readAndPick: [
    { q: "What does she want?", es: "¿Te importa si abro la ventana?",
      options: ["Information", "Permission", "An apology"], answer: 1,
      why: "*¿Te importa si...?* asks permission, not a real yes or no." },
    { q: "What is the reply if you don't mind?", es: "¿Le importa si me siento aquí?",
      options: ["Sí, me importa", "Sí, claro", "No, para nada"], answer: 2,
      why: "The question is whether it bothers you, so go ahead is *no*." },
    { q: "What is he really doing?", es: "¿Cenamos juntos mañana?",
      options: ["Inviting you", "Asking about your diet", "Asking where you eat"], answer: 0,
      why: "A plain present *¿Cenamos...?* is an invitation dressed as a question." },
    { q: "Who is she really asking?", es: "¿Será que Ana está en la casa?",
      options: ["Ana herself", "The neighbour", "Mostly herself"], answer: 2,
      why: "*¿Será que...?* wonders aloud: she doesn't expect you to know." },
    { q: "How should you answer?", es: "¿Sabes que ayer me encontré a María?",
      options: ["React to the news", "Say yes or no", "Ask who María is"], answer: 0,
      why: "It introduces news: *¡No me digas!* fits, a bare *no* doesn't." }
  ],
  yourTurn: [
    { en: "Do you mind if I open the window? (to a friend)", es: "¿Te importa si abro la ventana?", accept: ["¿Te importa que abra la ventana?"] },
    { en: "No, not at all.", es: "No, para nada.", accept: ["No, para nada, tranquilo.", "Claro que no."] },
    { en: "Shall I help you? (to a friend)", es: "¿Te ayudo?", accept: [] },
    { en: "What if we try another way?", es: "¿Y si probamos de otra manera?", accept: ["¿Y si lo intentamos de otra manera?", "¿Y si probamos de otra forma?"] },
    { en: "Would you mind closing the door? (to a friend)", es: "¿Te importaría cerrar la puerta?", accept: [] }
  ],
  translate: [
    { en: "Do you mind if I sit here? (to someone you call usted)", es: "¿Le importa si me siento aquí?", accept: ["¿Le importa si me siento acá?"] },
    { en: "Would you like me to help you with the bags? (to someone you call usted)", es: "¿Quiere que le ayude con las maletas?", accept: ["¿Quiere que [lo|la] ayude con las maletas?"] },
    { en: "Shall we have dinner together tomorrow?", es: "¿Cenamos juntos mañana?", accept: ["¿Comemos juntos mañana?"] },
    { en: "Do you think Ana is home?", es: "¿Será que Ana está en la casa?", accept: ["¿Será que Ana está en casa?"] },
    { en: "You know I ran into María yesterday? (to a friend)", es: "¿Sabes que ayer me encontré a María?", accept: ["¿Sabes que me encontré a María ayer?"] }
  ],
  register: [
    { es: "¿Abro la ventana?", en: "Shall I open the window?", when: "quick, with friends or family" },
    { es: "¿Te importa si abro la ventana?", en: "Do you mind if I open the window?", when: "polite, with anyone you call tú" },
    { es: "¿Le molesta si abro la ventana?", en: "Does it bother you if I open the window?", when: "polite, to someone you call usted" },
    { es: "¿Te importaría cerrar la ventana?", en: "Would you mind closing the window?", when: "the softest way to ask someone else" }
  ],
  personal: {
    prompt: "You're a guest in someone's home. Write three questions that aren't really questions: ask permission, offer help, and suggest a plan.",
    constraints: [
      { type: "regex", pattern: "(importa|molesta) (si|que)", label: "permission: *¿Te importa si...?*" },
      { type: "containsAny", words: ["¿te ayudo", "¿le ayudo", "¿quieres que te ayude", "¿quiere que le ayude"], label: "an offer: *¿Te ayudo?*" },
      { type: "containsAny", words: ["¿y si", "¿vamos", "¿cenamos", "¿salimos", "¿comemos"], label: "a plan: *¿Y si...?* or *¿Vamos...?*" }
    ],
    model: "¿Te importa si me baño primero? ¿Te ayudo con el almuerzo? ¿Y si vamos a la playa por la tarde?"
  },
  pitfalls: [
    "To *¿Te importa si...?* a plain *sí* means it bothers you: to say go ahead, *no, para nada*.",
    "*¿Sabes que...?* bringing news wants a reaction (*¡No me digas!*), not *sí* or *no*.",
    "*¿Te importaría si abro?* is common but loose: ask *¿Te importa si abro?*, or ask them to do it, *¿Te importaría abrir...?*"
  ]
},

"nt-reflexion-expresion-b1": {
  source: "merged",
  hook: {
    line: "Your uncle tells the same joke at every family lunch, and this time you finally realise why everyone laughs: it isn't the joke, it's the telling. Spanish has verbs for thinking, realising and telling, and one of them does two jobs.",
    es: "Mi tío cuenta el mismo chiste en cada almuerzo.\nPor fin me di cuenta de que lo gracioso es cómo lo cuenta.",
    en: "My uncle tells the same joke at every family lunch.\nI finally realised the funny part is how he tells it."
  },
  examples: [
    { es: "Me di cuenta de mi error demasiado tarde.", en: "I realised my mistake too late." },
    { es: "La cajera contó la plata dos veces.", en: "The cashier counted the money twice." },
    { es: "Se quedó callado durante toda la reunión.", en: "He stayed quiet through the whole meeting." }
  ],
  rule: "*Contar* does two jobs: tell a story, a joke or news (*cuenta chistes*, *cuéntame todo*), or count (*contó la plata*, *cuenta hasta diez*). What follows decides which. It changes like *poder*: *cuento*, *cuentas*.\n*Darse cuenta de* is to realise or notice: *Me di cuenta de mi error.* *Me di cuenta de que era tarde.* Keep the *de*; *realizar* means to carry out.\nThinking verbs: *entender* or *comprender*, *suponer* (*supongo que llega a las ocho*), *adivinar*, *pensar en*.\nAt the two ends of the volume: *gritar* and *quedarse callado*.",
  readAndPick: [
    { q: "What is she doing?", es: "La cajera contó la plata dos veces.",
      options: ["Counting money", "Telling a story", "Saving money"], answer: 0,
      why: "*Contar* with money after it: counting." },
    { q: "What does he want?", es: "Cuéntame todo, ¿qué pasó?",
      options: ["A number to call", "A joke to laugh at", "The whole story"], answer: 2,
      why: "*Cuéntame* with a story to tell: tell me." },
    { q: "When did she notice?", es: "Me di cuenta de mi error demasiado tarde.",
      options: ["Right away", "Too late", "Never"], answer: 1,
      why: "*Me di cuenta de*: I realised, and *demasiado tarde* says when." },
    { q: "How sure is he?", es: "Supongo que llega a las ocho.",
      options: ["It's a guess", "He's certain", "He knows it's false"], answer: 0,
      why: "*Supongo que*: I suppose, a reasonable guess." },
    { q: "What did he do in the meeting?", es: "Se quedó callado durante toda la reunión.",
      options: ["He shouted", "He left early", "He said nothing"], answer: 2,
      why: "*Se quedó callado*: he stayed quiet the whole time." }
  ],
  yourTurn: [
    { en: "I realised my mistake too late.", es: "Me di cuenta de mi error demasiado tarde.", accept: [] },
    { en: "He always tells really good jokes.", es: "Siempre cuenta unos chistes buenísimos.", accept: ["Siempre cuenta chistes buenísimos."] },
    { en: "Will you tell me everything? (to a friend)", es: "¿Me cuentas todo?", accept: ["¿Me cuentas todo lo que pasó?"] },
    { en: "I suppose he'll arrive in an hour.", es: "Supongo que llega en una hora.", accept: ["Supongo que [llegará|va a llegar] en una hora."] },
    { en: "Did you notice it's already late? (to a friend)", es: "¿Te diste cuenta de que ya es tarde?", accept: [] }
  ],
  translate: [
    { en: "The cashier counted the money twice.", es: "La cajera contó la plata dos veces.", accept: ["La cajera contó el dinero dos veces."] },
    { en: "He stayed quiet through the whole meeting.", es: "Se quedó callado durante toda la reunión.", accept: ["Se quedó callado toda la reunión."] },
    { en: "I don't understand this explanation well.", es: "No entiendo bien esta explicación.", accept: [] },
    { en: "Count to ten. (to a friend)", es: "Cuenta hasta diez.", accept: [] },
    { en: "I left him a message on WhatsApp.", es: "Le dejé un mensaje por WhatsApp.", accept: ["Le mandé un mensaje por WhatsApp."] },
    { en: "Guess who called me. (to a friend)", es: "Adivina quién me llamó.", accept: [] }
  ],
  register: [
    { es: "Me di cuenta.", en: "I realised.", when: "everyday, the moment it clicks" },
    { es: "Caí en cuenta.", en: "It dawned on me.", when: "Colombian and colloquial" },
    { es: "Me percaté del error.", en: "I noticed the error.", when: "careful, in writing" },
    { es: "Cuéntame.", en: "Tell me.", when: "warm, inviting a story" }
  ],
  personal: {
    prompt: "Write three lines: a story or joke someone you know always tells, something you realised recently, and something you counted.",
    constraints: [
      { type: "regex", pattern: "(^|[^a-záéíóúñ])(cuenta|cuentan|cuento|contó|conté|contaron)(?![a-záéíóúñ])", label: "*contar*, for a story or for counting" },
      { type: "containsAny", words: ["me di cuenta de", "nos dimos cuenta de", "me doy cuenta de", "caí en cuenta"], label: "what you realised: *me di cuenta de que*" }
    ],
    model: "Mi abuelo siempre cuenta la historia de cómo conoció a mi abuela. Ayer me di cuenta de que nunca la cuenta igual. Esta mañana conté las monedas del frasco: había más de cien."
  },
  pitfalls: [
    "*Realicé mi error* is a false friend: to realise is *darse cuenta de*.",
    "*Me di cuenta que* drops the *de*: *me di cuenta de que*.",
    "*Le dejé un recado en el contestador* sounds dated and Spanish: in Colombia, *le dejé un mensaje*."
  ]
},

"task-b1-conversar": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: a long conversation in which one person tells a story and the other keeps it going without taking over. Fluency here is turn-taking: noises that show you're listening, questions, one polite interruption.",
    es: "No me digas. ¿Y qué tal está?\nEspera, que esto es lo mejor.",
    en: "You don't say. And how is he?\nHang on, this is the best bit."
  },
  examples: [
    { es: "Ya, ya. Tampoco me extraña.", en: "Right, right. I'm not surprised, either." },
    { es: "¿Ah, sí? ¿Y a qué se dedica ahora?", en: "Oh, really? And what does he do now?" }
  ],
  rule: "Twenty turns or more: one person tells, the other keeps it going.\nThe listener's noises, every few lines: *¿Ah, sí?* *¿En serio?* *No me digas.* *Ya, ya.* *Claro.*\nQuestions that ask for more: *¿Y qué pasó?* *¿Y a qué se dedica ahora?*\nOne interruption that doesn't take over: *Perdón que te interrumpa, pero...*, then *sigue*.\nThe teller holds the floor: *Espera, que esto es lo mejor.* *Pues resulta que...* *Total, que...*\nAnd checks the listener is still there: *¿Me entiendes?*",
  readAndPick: [
    { q: "What does this line do?", es: "¿Ah, sí? ¿Y qué pasó?",
      options: ["It takes over the story", "It asks for more", "It ends the chat"], answer: 1,
      why: "A signal and a question: the teller keeps the floor." },
    { q: "Who says this?", es: "Espera, que esto es lo mejor.",
      options: ["A stranger", "The listener", "The teller"], answer: 2,
      why: "*Espera, que esto es lo mejor*: the teller holding the floor for the best bit." },
    { q: "How often does Spanish expect a signal like this?", es: "Ya, ya. Claro.",
      options: ["Every few lines", "Once in the whole talk", "Only at the end"], answer: 0,
      why: "Every few lines: without them, you sound bored." },
    { q: "What is this reply doing?", es: "Pues a mí me pasó algo peor.",
      options: ["Showing sympathy", "Taking the floor away", "Asking for more"], answer: 1,
      why: "Jumping in with your own story takes over: save it for later." },
    { q: "What does *tampoco me extraña* mean?", es: "Ya, ya. Tampoco me extraña.",
      options: ["I'm not surprised either", "I miss him too, honestly", "I don't know who he is"], answer: 0,
      why: "*Extrañar* here is to surprise: it doesn't surprise me either." }
  ],
  yourTurn: [
    { en: "You don't say. And how is he?", es: "No me digas. ¿Y qué tal está?", accept: ["¡No me digas! ¿Y qué tal está?", "No me digas. ¿Y cómo está?"] },
    { en: "Hang on, this is the best bit. (to a friend)", es: "Espera, que esto es lo mejor.", accept: [] },
    { en: "Oh, really? And what does he do now?", es: "¿Ah, sí? ¿Y a qué se dedica ahora?", accept: [] },
    { en: "Right, right. I'm not surprised, either.", es: "Ya, ya. Tampoco me extraña.", accept: [] }
  ],
  translate: [
    { en: "I ran into Luis on the Transmilenio.", es: "Me encontré a Luis en el Transmilenio.", accept: ["Me encontré con Luis en el Transmilenio."] },
    { en: "I hadn't seen him for four years.", es: "Hacía cuatro años que no lo veía.", accept: ["No lo veía desde hacía cuatro años."] },
    { en: "It turns out he left everything and went to Portugal.", es: "Resulta que lo dejó todo y se fue a Portugal.", accept: ["Resulta que dejó todo y se fue a Portugal."] },
    { en: "He says he earns less, but he's much better off.", es: "Dice que gana menos, pero que está muchísimo mejor.", accept: ["Dice que gana menos, pero que está mucho mejor."] },
    { en: "I swear. (to a friend)", es: "Te lo juro.", accept: [] }
  ],
  register: [
    { es: "¿Ah, sí?", en: "Oh, really?", when: "the listener's everyday signal" },
    { es: "¡No me digas!", en: "You don't say!", when: "surprise, anywhere" },
    { es: "¡Mentiras!", en: "No way!", when: "Colombian, playful disbelief among friends" },
    { es: "¡Qué oso!", en: "How embarrassing!", when: "Colombian slang, among friends" },
    { es: "¡No, qué locura!", en: "No, that's crazy!", when: "amazed, with friends" }
  ],
  personal: {
    prompt: "Write a conversation of twenty turns or more: one person tells a long story, the other keeps it going with listening signals, questions and one polite interruption.",
    constraints: [
      { type: "minSentences", n: 20, label: "twenty turns or more" },
      { type: "containsAny", words: ["¿ah, sí", "¿en serio", "no me digas", "ya, ya", "¿de verdad"], label: "listening signals: *¿Ah, sí?* or *No me digas*" },
      { type: "containsAny", words: ["¿y qué pasó", "¿y entonces", "¿y a qué", "¿y qué tal", "¿y después"], label: "a question that asks for more: *¿Y qué pasó?*" },
      { type: "regex", pattern: "(perdón|perdona|disculpa) que te interrump", label: "one interruption: *perdón que te interrumpa*" }
    ],
    model: "¿Sabes lo que me pasó ayer?\nNo, ¿qué?\nIba para el trabajo y me encontré a Luis en el Transmilenio.\n¿Luis? ¿El de la oficina de antes?\nEse mismo. Hacía cuatro años que no lo veía.\nNo me digas. ¿Y qué tal está?\nPues resulta que lo dejó todo y se fue a Portugal.\n¿Ah, sí? ¿Y a qué se dedica ahora?\nEspera, que esto es lo mejor: arregla bicicletas.\n¿Bicicletas? ¿En serio?\nTe lo juro. Tiene un taller cerca del mar.\nPerdón que te interrumpa, pero ¿Luis no era contador?\nSí, contador. Dice que gana menos, pero que está muchísimo mejor.\nYa, ya. Tampoco me extraña, con el jefe que teníamos.\nEso mismo le dije yo.\n¿Y vino de vacaciones?\nNo, vino a vender el apartamento.\n¿Y entonces se va otra vez?\nEl viernes. Total, que lo invité a almorzar el jueves.\n¡Qué bien! ¿Puedo ir yo también?\nClaro, él preguntó por ti."
  },
  pitfalls: [
    "*¡Qué fuerte!* is Spain's reaction. In Colombia: *¡No me digas!* or *¡Qué locura!*",
    "*Anda ya* is Spanish disbelief; in Colombia, *¿en serio?* or *¡mentiras!*",
    "Going quiet for many lines reads as boredom: drop in *¿Ah, sí?* or *¿Y qué pasó?*"
  ]
},

/* ---- unit b1-u38 · Describing at length ---------------------------------- */

"gr-relativas-b1": {
  source: "merged",
  hook: {
    line: "You're showing a friend photos from Cartagena, and every picture needs a detail: the friend who lives there, the restaurant where you ate. Spanish hangs the detail on the person or thing with *que*, *donde* and *quien*, and never drops the *que* the way English drops that.",
    es: "Esta es Ana, la amiga que vive en Cartagena.\nY ese es el restaurante donde comimos el mejor pescado.",
    en: "This is Ana, the friend who lives in Cartagena.\nAnd that's the restaurant where we ate the best fish."
  },
  examples: [
    { es: "El carro que compré es rojo.", en: "The car I bought is red." },
    { es: "Mi carro, que es rojo, está en el parqueadero.", en: "My car, which is red, is in the car park." },
    { es: "La persona con quien trabajo es de Pasto.", en: "The person I work with is from Pasto." }
  ],
  rule: "*Que* hangs detail on a person or a thing: *la amiga que vive en Cartagena*, *el libro que me prestaste*. English can drop that; Spanish never drops *que*.\nNo commas: it picks out which one. *El carro que compré es rojo.*\nBetween commas: extra detail about one already known. *Mi carro, que es rojo, está afuera.*\n*Donde* for places: *el restaurante donde comimos*.\n*Quien* for people after a little word like *con*, *a* or *para*: *la persona con quien trabajo*. Right after a person, plain *que*: *el señor que vende arepas*.\n*Lo que* is the thing that: *Lo que necesito es tiempo.*",
  readAndPick: [
    { q: "Which car does she mean?", es: "El carro que compré el año pasado es rojo.",
      options: ["Her only car, which happens to be red", "The one she bought last year", "A red car she wants to buy"], answer: 1,
      why: "No commas: *que compré el año pasado* picks out which car." },
    { q: "What do the commas tell you?", es: "Mi hermana, que vive en Chile, viene en diciembre.",
      options: ["He has one sister, and this is extra detail", "He has several sisters in Chile", "She is moving to Chile"], answer: 0,
      why: "Between commas, the detail is extra: we already know which sister." },
    { q: "Why *quien* here?", es: "La persona con quien hablé fue muy amable.",
      options: ["Any person at all", "A person, after con", "A place"], answer: 1,
      why: "After a little word like *con*, a person takes *quien*." },
    { q: "What does *lo que* mean here?", es: "Lo que más me gusta de Cartagena es el mar.",
      options: ["Which one of the two cities", "Asking a question about it", "What, as in the thing that"], answer: 2,
      why: "*Lo que* is the thing that: the thing I like most is the sea." },
    { q: "Where did they meet?", es: "Ese es el café donde nos conocimos.",
      options: ["At a friend's house", "At a café", "At work"], answer: 1,
      why: "*Donde* links to *el café*: that's where they met." }
  ],
  yourTurn: [
    { en: "The books you lent me are excellent. (to a friend)", es: "Los libros que me prestaste son excelentes.", accept: [] },
    { en: "I have a friend who lives in Medellín.", es: "Tengo una amiga que vive en Medellín.", accept: ["Tengo un amigo que vive en Medellín."] },
    { en: "This is the town where I was born.", es: "Este es el pueblo donde nací.", accept: ["Este es el pueblo en el que nací."] },
    { en: "What I need is time.", es: "Lo que necesito es tiempo.", accept: [] },
    { en: "The person I work with is from Pasto.", es: "La persona con quien trabajo es de Pasto.", accept: ["La persona con la que trabajo es de Pasto."] }
  ],
  translate: [
    { en: "Ana, who lives in Chile, is coming to visit us in December.", es: "Ana, que vive en Chile, viene a visitarnos en diciembre.", accept: ["Ana, quien vive en Chile, viene a visitarnos en diciembre."] },
    { en: "The man who sells arepas is my neighbour.", es: "El señor que vende arepas es mi vecino.", accept: [] },
    { en: "I don't understand what you're saying. (to a friend)", es: "No entiendo lo que dices.", accept: ["No entiendo lo que estás diciendo."] },
    { en: "That's the café where we met.", es: "Ese es el café donde nos conocimos.", accept: [] },
    { en: "The letter I found is from my grandmother.", es: "La carta que encontré es de mi abuela.", accept: [] }
  ],
  register: [
    { es: "la persona con la que trabajo", en: "the person I work with", when: "everyday speech" },
    { es: "la persona con quien trabajo", en: "the person I work with", when: "a little more careful, spoken or written" },
    { es: "la persona con la cual trabajo", en: "the person with whom I work", when: "formal writing, reports and letters" },
    { es: "Mi jefa, quien es de Pasto, llega mañana.", en: "My boss, who is from Pasto, arrives tomorrow.", when: "written news style, after a comma" }
  ],
  personal: {
    prompt: "Describe two people and one place that matter to you, each in one sentence with *que*, *quien* or *donde*.",
    constraints: [
      { type: "regex", pattern: "(amig[oa]s?|herman[oa]s?|persona|señora?|mamá|papá|abuel[oa]s?|tí[oa]s?|prim[oa]s?|vecin[oa]s?|jef[ea]s?)(,)? (que|quien) ", label: "a person, with *que* or *quien*" },
      { type: "containsWord", word: "donde", label: "a place, with *donde*" }
    ],
    model: "Tengo una amiga que trabaja en un hospital de Cali. Mi abuelo, que tiene noventa años, todavía camina todos los días. Y el parque donde jugaba de niño queda a dos cuadras de mi casa."
  },
  pitfalls: [
    "*El libro me prestaste* drops the *que* English drops: *el libro que me prestaste*.",
    "*El señor quien vende arepas*: right after a person, plain *que*.",
    "*Qué necesito es tiempo* asks instead of tells: *lo que necesito es tiempo*."
  ]
},

"gr-adverbios-relativos-b1": {
  source: "merged",
  hook: {
    line: "You're texting a friend: you did it the way she said, you left when they arrived, you're where you always are. The same three words also ask questions, and in writing only the accent tells you which job they're doing.",
    es: "Lo hice como me dijiste.\n¿Cómo lo hiciste tan rápido?",
    en: "I did it the way you told me.\nHow did you do it so fast?"
  },
  examples: [
    { es: "Me fui cuando llegaron.", en: "I left when they arrived." },
    { es: "¿Cuándo llegaron?", en: "When did they arrive?" },
    { es: "Vive donde vivía su abuela.", en: "He lives where his grandmother used to live." }
  ],
  rule: "*Como*, *cuando* and *donde* join two ideas, with no accent: *Lo hice como me dijiste.* *Me fui cuando llegaron.* *Vive donde vivía su abuela.*\nWith an accent, they ask: *¿Cómo lo hiciste?* *¿Cuándo llegaron?* *¿Dónde vives?* They keep it inside a sentence too: *No sé dónde vive.*\nThey exclaim as well: *¡Cómo llueve!*\nIn speech you hear the difference as a stronger beat; in writing, only the accent shows it.\n*Adónde* asks where to, with movement: *¿Adónde vas?* For where something is: *¿Dónde está?*",
  readAndPick: [
    { q: "Is this a question?", es: "Me fui cuando llegaron.",
      options: ["No, it joins two ideas", "Yes, it asks when", "It's an exclamation"], answer: 0,
      why: "No accent and no question marks: *cuando* joins my leaving to their arriving." },
    { q: "Why the accent on *cómo*?", es: "¿Cómo lo hiciste?",
      options: ["It joins two ideas", "It asks a question", "It starts the sentence"], answer: 1,
      why: "A question word carries its accent: *cómo*, how." },
    { q: "Where does he live?", es: "Vive donde vivía su abuela.",
      options: ["In his grandmother's old home", "Near his grandmother", "With his grandmother now"], answer: 0,
      why: "*Donde vivía su abuela*: the place where she used to live." },
    { q: "Why *adónde* and not *dónde*?", es: "¿Adónde va este bus?",
      options: ["It's more polite", "It asks where the bus is right now", "It asks about the destination"], answer: 2,
      why: "*Adónde* asks where to: the bus is moving." },
    { q: "What is she doing?", es: "¡Cómo llueve hoy!",
      options: ["Asking how it rains", "Exclaiming at the rain", "Saying when it rains"], answer: 1,
      why: "*¡Cómo llueve!* exclaims: look at it pour." }
  ],
  yourTurn: [
    { en: "I did it the way you told me. (to a friend)", es: "Lo hice como me dijiste.", accept: [] },
    { en: "How did you do it? (to a friend)", es: "¿Cómo lo hiciste?", accept: [] },
    { en: "I left when they arrived.", es: "Me fui cuando llegaron.", accept: [] },
    { en: "Where are you going? (to a friend)", es: "¿Adónde vas?", accept: ["¿A dónde vas?"] },
    { en: "I don't know where he lives.", es: "No sé dónde vive.", accept: [] }
  ],
  translate: [
    { en: "He lives where his grandmother used to live.", es: "Vive donde vivía su abuela.", accept: [] },
    { en: "Where did you leave the keys? (to a friend)", es: "¿Dónde dejaste las llaves?", accept: [] },
    { en: "When did they arrive?", es: "¿Cuándo llegaron?", accept: [] },
    { en: "Call me when you get there. (to a friend)", es: "Llámame cuando llegues.", accept: ["Llámame cuando llegues allá."] },
    { en: "Where does this bus go?", es: "¿Adónde va este bus?", accept: ["¿A dónde va este bus?"] }
  ],
  register: [
    { es: "¿Dónde queda?", en: "Where is it?", when: "Colombian, asking where a place is" },
    { es: "¿Adónde vas?", en: "Where are you going?", when: "movement, asking the destination" },
    { es: "¿Pa' dónde vas?", en: "Where you off to?", when: "Colombian and very casual, spoken only" },
    { es: "Lo hice tal como me dijiste.", en: "I did it exactly as you said.", when: "stressing that you followed the instructions" }
  ],
  personal: {
    prompt: "Write three lines about your day: something you did the way someone told you, something that happened when something else did, and a question with *dónde* or *adónde*.",
    constraints: [
      { type: "regex", pattern: "\\bcomo (me|te|le|nos|les|dijo|dijiste|dije)\\b", label: "the way: *como me dijiste*" },
      { type: "regex", pattern: "\\bcuando [a-záéíóúñ]+", label: "when, joining two ideas: *cuando llegaron*" },
      { type: "regex", pattern: "¿(a )?(d|ad)ónde", label: "a question: *¿Dónde...?* or *¿Adónde...?*" }
    ],
    model: "Hice el arroz como me dijo mi mamá. Mi hermano llegó cuando ya estábamos comiendo. ¿Adónde vamos mañana?"
  },
  pitfalls: [
    "*Lo hice cómo me dijiste* adds an accent: joining two ideas, *como* has none.",
    "*¿Donde vives?* drops it: a question needs *dónde*.",
    "*Lo he hecho como dijiste* is how Spain tells it. In Colombia: *lo hice como dijiste*."
  ]
},

"fn-identificar-b1": {
  source: "merged",
  hook: {
    line: "At a family wedding your friend asks who everyone is. Pointing only goes so far: Spanish identifies with *el que*, *la que* and a detail, so there's no doubt which person you mean.",
    es: "¿Cuál es tu prima?\nLa que está bailando con mi tío.",
    en: "Which one is your cousin?\nThe one dancing with my uncle."
  },
  examples: [
    { es: "El apartamento que vi ayer no tenía ascensor.", en: "The apartment I saw yesterday had no lift." },
    { es: "¿Quién es Marcos? El de la camisa azul.", en: "Who's Marcos? The one in the blue shirt." },
    { es: "Es una actriz que nació en Cali.", en: "She's an actress who was born in Cali." }
  ],
  rule: "To pick something out, attach the detail to it: *el apartamento que vi ayer*.\nOnce the thing is clear, drop it and keep the little word: *el que vi ayer*, *la que tiene balcón*, *los que viven aquí*. The article matches what you dropped: *la casa*, so *la que*.\n*El de* and a detail is shorter still: *el de la camisa azul*, *la del pelo largo*.\nA describing word can go first: *la morena que está con Pablo*.\nTo identify in a fuller, neutral way: *Es una actriz que nació en Cali.*\nNever drop the article: *que tiene balcón* on its own doesn't work.",
  readAndPick: [
    { q: "Which one is her cousin?", es: "Mi prima es la que está bailando con mi tío.",
      options: ["The woman dancing with her uncle", "The one sitting at the table", "Her uncle's wife, by the bar"], answer: 0,
      why: "*La que está bailando con mi tío*: the detail picks her out." },
    { q: "Why *el que* and not *la que*?", es: "¿Cuál cuarto prefieres? El que tiene ventana.",
      options: ["It goes with the window", "Cuarto is el cuarto", "It sounds better"], answer: 1,
      why: "The article matches the word you dropped: *el cuarto*, so *el que*." },
    { q: "Who is Marcos?", es: "¿Marcos? El de la camisa azul.",
      options: ["Marcos's brother", "The man who sells shirts", "The man in the blue shirt"], answer: 2,
      why: "*El de* and a detail: the one with the blue shirt." },
    { q: "Where would you read this?", es: "Es una actriz que nació en Cali.",
      options: ["In a text from a friend", "In a short biography", "On a shop sign"], answer: 1,
      why: "*Es una... que...*: a fuller, neutral way to identify someone." },
    { q: "Who is she talking about?", es: "Los que viven en este edificio conocen a doña Marta.",
      options: ["The people living in this building", "The whole building next door", "Doña Marta's own family"], answer: 0,
      why: "*Los que viven aquí*: the people who live here, with no need to name them." }
  ],
  yourTurn: [
    { en: "The one with the red roof.", es: "La que tiene el techo rojo.", accept: ["La del techo rojo."] },
    { en: "My sister is the one talking to Pablo.", es: "Mi hermana es la que está hablando con Pablo.", accept: ["Mi hermana es la que habla con Pablo."] },
    { en: "The apartment I saw yesterday had no lift.", es: "El apartamento que vi ayer no tenía ascensor.", accept: [] },
    { en: "Who's Marcos? The one in the blue shirt.", es: "¿Quién es Marcos? El de la camisa azul.", accept: [] },
    { en: "I prefer the one with a window. (the room)", es: "Prefiero el que tiene ventana.", accept: ["Prefiero el de la ventana."] }
  ],
  translate: [
    { en: "The book you recommended to me was really good. (to a friend)", es: "El libro que me recomendaste era buenísimo.", accept: ["El libro que me recomendaste estuvo buenísimo."] },
    { en: "She's an actress who was born in Cali.", es: "Es una actriz que nació en Cali.", accept: [] },
    { en: "The ones who live here know doña Marta.", es: "Los que viven aquí conocen a doña Marta.", accept: ["Los que viven acá conocen a doña Marta."] },
    { en: "The dark-haired girl talking to Pablo is my cousin.", es: "La morena que está hablando con Pablo es mi prima.", accept: [] },
    { en: "Which is your house? That one. (to a friend)", es: "¿Cuál es tu casa? Esa.", accept: [] }
  ],
  register: [
    { es: "Esa.", en: "That one.", when: "pointing, when it's right there" },
    { es: "La del techo rojo.", en: "The one with the red roof.", when: "quick and natural in speech" },
    { es: "La que tiene el techo rojo.", en: "The one that has the red roof.", when: "clear, spoken or written" },
    { es: "Es una casa de techo rojo que se construyó en 1920.", en: "It's a red-roofed house that was built in 1920.", when: "a description in writing, like a guidebook" }
  ],
  personal: {
    prompt: "Describe three people at a party you went to without using their names: *el que...*, *la que...*, *el de...*",
    constraints: [
      { type: "regex", pattern: "\\b(el|la|los|las) que ", label: "*el que* or *la que*" },
      { type: "regex", pattern: "\\b(el|la|los|las) del? ", label: "*el de* or *la del*" },
      { type: "minSentences", n: 3, label: "three people" }
    ],
    model: "Mi jefe es el que está cerca de la puerta. Su esposa es la del vestido verde. Y el de la guitarra es mi primo Felipe."
  },
  pitfalls: [
    "*Que vi ayer* on its own isn't enough: keep the article, *el que vi ayer*.",
    "The article matches what you dropped: *la casa*, *la que*; *el cuarto*, *el que*.",
    "*El piso que vi* is Spain's flat: in Colombia, *el apartamento que vi*."
  ]
},

"gn-describir-persona-b1": {
  source: "merged",
  hook: {
    line: "Your friend asks about your cousin Pedro, whom she's about to meet. You could list the facts, or say what you really think of him, and either way one small story says more than a list.",
    es: "Pedro es alto, tiene el pelo crespo y se parece mucho a su papá.\nYo creo que antes era más tímido.",
    en: "Pedro is tall, has curly hair and looks a lot like his dad.\nI think he used to be shyer."
  },
  examples: [
    { es: "Era un hombre tranquilo, aunque algo en él me inquietaba.", en: "He was a calm man, though something about him unsettled me." },
    { es: "Con los años cambió mucho: antes era tímido y ahora habla con cualquiera.", en: "He changed a lot over the years: he used to be shy and now he talks to anyone." },
    { es: "Un día se puso a llorar en plena reunión.", en: "One day she burst into tears in the middle of a meeting." }
  ],
  rule: "Two ways to describe someone.\nThe facts: age, looks, character. *Tenía veinte años, era alto y tenía los ojos oscuros.* *Se parece a su mamá.*\nWhat you think, and how they changed: *Me parece que antes estaba mejor.* *Con los años cambió mucho: antes era tímido y ahora habla con cualquiera.*\n*Parecerse a* is who they look like: *Me parezco a mi papá.* *Parecer* is the impression: *Parece cansado.*\nThen a small story that shows it, in the plain past: *Un día se puso a llorar en plena reunión.*\nIn a past description, the traits take *-aba* and *-ía*: *era*, *tenía*, *llevaba*.",
  readAndPick: [
    { q: "Is this a fact or a view?", es: "Tenía un aspecto horrible esa mañana.",
      options: ["A view: the speaker is judging", "A plain fact, like her age", "A question about her"], answer: 0,
      why: "*Horrible* is the speaker's judgement, not a fact anyone could check." },
    { q: "Who does Pedro look like?", es: "Pedro se parece mucho a su papá.",
      options: ["His uncle", "His father", "His older brother"], answer: 1,
      why: "*Se parece a su papá*: a likeness, with *se* and *a*." },
    { q: "What changed?", es: "Antes era muy tímido y ahora habla con cualquiera.",
      options: ["He's still very shy", "He has always been chatty", "He used to be shy, now he's chatty"], answer: 2,
      why: "*Antes era... ahora...*: how he was, and how he is now." },
    { q: "How did the crying start?", es: "Un día se puso a llorar en plena reunión.",
      options: ["Suddenly, in a meeting", "Slowly, at home over weeks", "She never cried at all"], answer: 0,
      why: "*Se puso a llorar*: it started all at once, *en plena reunión*." },
    { q: "Why *tenía* and *era*?", es: "Tenía veinte años, era alto y tenía los ojos oscuros.",
      options: ["Things that happened once", "They describe how he was", "Plans for the future"], answer: 1,
      why: "A past description paints how he was, so *-ía* forms: *era*, *tenía*." }
  ],
  yourTurn: [
    { en: "He looks a lot like his dad.", es: "Se parece mucho a su papá.", accept: ["Se parece mucho a su padre."] },
    { en: "He used to be shy and now he talks to anyone.", es: "Antes era tímido y ahora habla con cualquiera.", accept: [] },
    { en: "She seems tired today.", es: "Parece cansada hoy.", accept: ["Hoy parece cansada."] },
    { en: "One day she burst into tears in the middle of a meeting.", es: "Un día se puso a llorar en plena reunión.", accept: ["Un día se puso a llorar en medio de una reunión."] },
    { en: "Who do you look like? (to a friend)", es: "¿A quién te pareces?", accept: [] }
  ],
  translate: [
    { en: "He was twenty, tall, and had dark eyes.", es: "Tenía veinte años, era alto y tenía los ojos oscuros.", accept: [] },
    { en: "He changed a lot over the years.", es: "Con los años cambió mucho.", accept: ["Cambió mucho con los años."] },
    { en: "My brother and I aren't alike at all.", es: "Mi hermano y yo no nos parecemos nada.", accept: ["Mi hermano y yo no nos parecemos en nada."] },
    { en: "He was a calm man, though something about him unsettled me.", es: "Era un hombre tranquilo, aunque algo en él me inquietaba.", accept: [] },
    { en: "I think he was better before.", es: "Yo creo que antes estaba mejor.", accept: ["Creo que antes estaba mejor."] }
  ],
  register: [
    { es: "Es muy buena gente.", en: "She's a really nice person.", when: "Colombian, warm and everyday" },
    { es: "Es un poco cansón.", en: "He's a bit of a pain.", when: "Colombian and colloquial, among friends" },
    { es: "Es una persona muy reservada.", en: "She's a very reserved person.", when: "neutral, polite about anyone" },
    { es: "Se trata de un hombre de carácter firme.", en: "He is a man of firm character.", when: "formal, in a reference or a report" }
  ],
  personal: {
    prompt: "Describe someone you know well in five or six sentences: the facts, what you think, how they've changed, and one small story that shows what they're like.",
    constraints: [
      { type: "minSentences", n: 5, label: "five sentences or more" },
      { type: "regex", pattern: "\\b(se|nos) parec[a-záéíóúñ]*|\\bme parezco\\b|\\bte pareces\\b", label: "a likeness: *se parece a*" },
      { type: "containsAny", words: ["antes", "ahora"], label: "a change: *antes... ahora...*" },
      { type: "anyVerbInTense", tense: "preterito", label: "a small story, in the plain past" }
    ],
    model: "Mi tía Gloria tiene sesenta años y se parece mucho a mi abuela. Es bajita, tiene el pelo blanco y siempre está riéndose. Antes era muy seria, pero ahora es la más divertida de la familia. Yo creo que la jubilación le cambió la vida. Una vez, en un matrimonio, se puso a bailar sola en la mitad de la pista, y al final todos terminaron bailando con ella."
  },
  pitfalls: [
    "*Parece a su papá* drops a piece: who someone looks like is *se parece a*.",
    "*Ha engordado y se ha cortado el pelo* is how Spain tells a change. In Colombia, the plain past: *engordó*, *se cortó el pelo*.",
    "*Se enfadó muchísimo* sounds Spanish: in Colombia, *se puso bravísimo*."
  ]
},

"gn-describir-lugar-b1": {
  source: "old",
  hook: {
    line: "A friend asks why you love your tiny apartment in La Candelaria. You could list the rooms, but a real description gives reasons, walks through the place in order, and defends the flaws as part of the charm.",
    es: "Mi apartamento es muy luminoso por dos razones: por una parte, tiene muchas ventanas, y por otra, está en lo más alto del edificio.",
    en: "My apartment is very bright for two reasons: on the one hand, it has lots of windows, and on the other, it's at the very top of the building."
  },
  examples: [
    { es: "A otros les parecería pequeño, pero para mí es perfecto.", en: "Others would find it small, but for me it's perfect." },
    { es: "Al entrar, a la derecha está la cocina, y al fondo, la sala.", en: "As you go in, the kitchen is on the right, and at the far end, the living room." },
    { es: "El día que colgué las cortinas nuevas, por fin sentí que era mi casa.", en: "The day I hung the new curtains, I finally felt it was my home." }
  ],
  rule: "A good description of a place has three moves.\nReasons first: *Es muy luminoso por dos razones: por una parte..., y por otra...*\nThen a tour in order: *Al entrar, a la derecha está la cocina. Al fondo está la sala. Al lado del baño hay un cuarto pequeño.* *Está* says where a known room is; *hay* says what there is.\nThen your view, defending the flaws: *A otros les parecería pequeño, pero para mí es perfecto.* *Lo que más me gusta es la luz.*\nA short moment brings it to life: *El día que colgué las cortinas, sentí que era mi casa.*",
  readAndPick: [
    { q: "How many reasons does she give?", es: "Es muy luminoso por dos razones: tiene muchas ventanas y está en lo más alto.",
      options: ["One", "Three", "Two"], answer: 2,
      why: "*Por dos razones*: the windows and the height." },
    { q: "Why *está* and not *hay*?", es: "Al fondo está la sala.",
      options: ["It says where a known room is", "It says what exists there", "It's in the past"], answer: 0,
      why: "*La sala* is already known, so *está* says where it is." },
    { q: "What is she doing with the small size?", es: "A otros les parecería pequeño, pero para mí es perfecto.",
      options: ["Complaining about how small it is", "Turning it into a virtue", "Hiding it from her friend"], answer: 1,
      why: "*A otros les parecería... pero para mí...*: the flaw becomes part of the charm." },
    { q: "Where is the kitchen?", es: "Al entrar, a la derecha está la cocina.",
      options: ["On the right as you go in", "At the far end of the flat", "Upstairs"], answer: 0,
      why: "*Al entrar, a la derecha*: the first thing on your right." },
    { q: "What does this moment add?", es: "El día que colgué las cortinas, por fin sentí que era mi casa.",
      options: ["The price of the place", "Directions to it", "A feeling tied to the place"], answer: 2,
      why: "A small story, in the plain past, gives the place a feeling." }
  ],
  yourTurn: [
    { en: "It's a noisy apartment for two reasons.", es: "Es un apartamento ruidoso por dos razones.", accept: ["Es un apartamento ruidoso por dos motivos."] },
    { en: "Others would find it small, but for me it's perfect.", es: "A otros les parecería pequeño, pero para mí es perfecto.", accept: [] },
    { en: "At the far end is the living room.", es: "Al fondo está la sala.", accept: [] },
    { en: "What I like most is the light.", es: "Lo que más me gusta es la luz.", accept: [] }
  ],
  translate: [
    { en: "It's close to the main avenue and it has old windows.", es: "Queda cerca de la avenida principal y tiene ventanas viejas.", accept: ["Está cerca de la avenida principal y tiene ventanas viejas.", "Queda cerca de la avenida principal y tiene ventanas antiguas."] },
    { en: "As you go in, the kitchen is on the right.", es: "Al entrar, a la derecha está la cocina.", accept: ["Al entrar, la cocina está a la derecha."] },
    { en: "There's a small room next to the bathroom.", es: "Al lado del baño hay un cuarto pequeño.", accept: ["Hay un cuarto pequeño al lado del baño."] },
    { en: "The day I hung the new curtains, I finally felt it was my home.", es: "El día que colgué las cortinas nuevas, por fin sentí que era mi casa.", accept: [] },
    { en: "The other day I bought another shelf.", es: "El otro día compré otro estante.", accept: ["El otro día compré otra repisa."] }
  ],
  register: [
    { es: "Es un apartamento muy acogedor.", en: "It's a very cosy apartment.", when: "warm, describing your own place" },
    { es: "Es un apartamento bacano.", en: "It's a cool apartment.", when: "Colombian slang, among friends" },
    { es: "Queda en un sector tranquilo.", en: "It's in a quiet area.", when: "Colombian, neutral and everyday" },
    { es: "Inmueble de dos habitaciones con excelente iluminación.", en: "Two-bedroom property with excellent light.", when: "a property ad, in note form" }
  ],
  personal: {
    prompt: "Describe the place where you live in six sentences or more: two reasons it is the way it is, a short tour, what you think of it, and one moment you remember there.",
    constraints: [
      { type: "minSentences", n: 6, label: "six sentences or more" },
      { type: "containsAny", words: ["por dos razones", "por dos motivos", "por una parte", "por un lado"], label: "the reasons: *por dos razones*" },
      { type: "containsAny", words: ["al fondo", "a la derecha", "a la izquierda", "al lado de", "al entrar"], label: "the tour: *al entrar*, *al fondo*" },
      { type: "containsAny", words: ["para mí", "me parece", "lo que más me gusta"], label: "your view: *para mí* or *lo que más me gusta*" }
    ],
    model: "Mi apartamento es pequeño, pero muy luminoso por dos razones: por una parte, tiene ventanas grandes, y por otra, está en lo más alto del edificio. Al entrar, a la izquierda está la cocina. Al fondo está la sala, con un balcón que da a la calle. A otros les parecería ruidoso, pero para mí el ruido es parte de la vida del barrio. Lo que más me gusta es tomar tinto en el balcón por la mañana. El día que llegué con mis cajas, me senté en el suelo y me puse a reír de felicidad."
  },
  pitfalls: [
    "*Piso* for an apartment is Spain's word. In Colombia: *apartamento*.",
    "*Hay la cocina a la derecha* mixes two jobs: *hay* for what there is, *está* for where a known thing is.",
    "A list of rooms isn't a description yet: give reasons, a route, and what it means to you."
  ]
},

"gn-describir-objeto-b1": {
  source: "merged",
  hook: {
    line: "You're describing a mochila wayuu to a friend abroad. You can do it like a guidebook, with where it comes from, who makes it and what it's for, or like a riddle, keeping its name back until the very end.",
    es: "Viene de La Guajira y la tejen a mano las mujeres wayuu.\nSirve para cargar cosas, pero es mucho más que un bolso.",
    en: "It comes from La Guajira, and Wayuu women weave it by hand.\nIt's for carrying things, but it's much more than a bag."
  },
  examples: [
    { es: "Es redonda, blanca, y casi todos la comemos al desayuno, pero no es pan.", en: "It's round and white, and nearly all of us eat it at breakfast, but it isn't bread." },
    { es: "La mesa es de madera, y las sillas están hechas de metal.", en: "The table is made of wood, and the chairs are made of metal." },
    { es: "De niña me quemé con una olla, y desde entonces le tengo respeto.", en: "As a girl I burned myself on a pot, and I've been wary of them ever since." }
  ],
  rule: "Two ways to describe an object.\nLike a guidebook: where it comes from, what it's made of, what it's for, what it means. *Viene de La Guajira.* *Es de hilo*, or *está hecha de hilo*. *Sirve para cargar cosas.*\n*Hecho* matches the thing: *la mesa está hecha de madera*.\nLike a riddle: describe it and keep its name back. *Es redonda y blanca, pero no es pan... Es una arepa.*\nA memory can back up what you say: *De niña me quemé con una olla, y desde entonces le tengo respeto.*\n*No sirve*, with nothing after it, says it doesn't work.",
  readAndPick: [
    { q: "Who makes it?", es: "La mochila wayuu está hecha a mano por mujeres de La Guajira.",
      options: ["A factory in Bogotá", "Women in La Guajira, by hand", "Tourists on holiday"], answer: 1,
      why: "*Hecha a mano por*: made by hand, and *por* says who made it." },
    { q: "What kind of description is this?", es: "Es redonda, blanca, y la comemos al desayuno, pero no es pan.",
      options: ["A guidebook entry", "A recipe", "A riddle"], answer: 2,
      why: "It describes the arepa and holds back its name: a riddle." },
    { q: "Why *hecha*?", es: "La mesa está hecha de madera.",
      options: ["It matches la mesa", "It's in the past", "It's a question"], answer: 0,
      why: "*Hecho* describes the table, so it matches it: *hecha*." },
    { q: "What is it for?", es: "Esta olla sirve para hacer arroz.",
      options: ["Serving soup at the table", "Making rice", "Storing water for later"], answer: 1,
      why: "*Sirve para* and the dictionary form: what it's for." },
    { q: "What does the memory do?", es: "De niña me quemé con una olla, y desde entonces le tengo respeto.",
      options: ["It backs up what she says", "It gives the price", "It explains the recipe"], answer: 0,
      why: "A small story from childhood explains why she's careful with pots." }
  ],
  yourTurn: [
    { en: "It's made of wood.", es: "Es de madera.", accept: ["Está [hecho|hecha] de madera."] },
    { en: "The chairs are made of metal.", es: "Las sillas están hechas de metal.", accept: ["Las sillas son de metal."] },
    { en: "What's it for?", es: "¿Para qué sirve?", accept: [] },
    { en: "It comes from La Guajira.", es: "Viene de La Guajira.", accept: ["Es de La Guajira."] },
    { en: "This phone doesn't work.", es: "Este celular no sirve.", accept: ["Este celular no funciona."] }
  ],
  translate: [
    { en: "It's for keeping the sun off. (a hat)", es: "Sirve para protegerse del sol.", accept: [] },
    { en: "The cups are handmade.", es: "Las tazas están hechas a mano.", accept: [] },
    { en: "It's round and white, but it isn't bread.", es: "Es redonda y blanca, pero no es pan.", accept: [] },
    { en: "As a child I burned myself on a pot.", es: "De niño me quemé con una olla.", accept: ["De niña me quemé con una olla.", "Cuando era [niño|niña] me quemé con una olla."] },
    { en: "Tomatoes come from America.", es: "El tomate viene de América.", accept: ["Los tomates vienen de América."] },
    { en: "My shirt is made of cotton.", es: "Mi camisa es de algodón.", accept: ["Mi camisa está hecha de algodón."] }
  ],
  register: [
    { es: "Es de madera.", en: "It's wooden.", when: "short and everyday" },
    { es: "Está hecho a mano.", en: "It's handmade.", when: "praising how it was made" },
    { es: "Es un cosito que sirve para abrir latas.", en: "It's a little thing for opening tins.", when: "casual, when you don't know the name" },
    { es: "Tejida a mano por artesanas wayuu de La Guajira.", en: "Handwoven by Wayuu craftswomen from La Guajira.", when: "a label or a museum card" }
  ],
  personal: {
    prompt: "Describe an object that matters to you in four or five sentences: where it comes from, what it's made of, what it's for, and one memory linked to it.",
    constraints: [
      { type: "regex", pattern: "\\b(es|son) de [a-záéíóúñ]+|hech[oa]s? de", label: "what it's made of: *es de* or *está hecho de*" },
      { type: "containsAny", words: ["sirve para", "sirven para"], label: "what it's for: *sirve para*" },
      { type: "anyVerbInTense", tense: "preterito", label: "a memory, in the plain past" }
    ],
    model: "Tengo una ruana que era de mi abuelo. Es de lana virgen y viene de Boyacá. Sirve para el frío de las mañanas en Bogotá. Una vez me la puse en un viaje al páramo, y fue lo único que me salvó del frío."
  },
  pitfalls: [
    "*La mesa es hecha de madera* takes the wrong verb: *está hecha de madera*, or just *es de madera*.",
    "*Sirve para abre botellas*: after *para*, the dictionary form, *abrir*.",
    "*Zumo de tomate* is Spain's juice. In Colombia: *jugo de tomate*."
  ]
},

"gr-pronombres-combinados-b1": {
  source: "merged",
  hook: {
    line: "Your friend wants to borrow your bike, then the charger, then the umbrella. In Spanish, every it and to me becomes two little words side by side, in a fixed order, and one of them changes shape.",
    es: "¿Me prestas la bicicleta?\nSí, claro, te la presto.",
    en: "Will you lend me the bike?\nYes, sure, I'll lend it to you."
  },
  examples: [
    { es: "Se lo expliqué a mis papás ayer.", en: "I explained it to my parents yesterday." },
    { es: "Te lo voy a dar mañana.", en: "I'm going to give it to you tomorrow." },
    { es: "Está explicándomelo con mucha paciencia.", en: "She's explaining it to me very patiently." }
  ],
  rule: "Person first, then thing: *me lo*, *te la*, *nos los*. Never *lo te*.\n*Le* and *les* can't sit in front of *lo*, *la*, *los*, *las*: they become *se*. *Se lo di.* Never *le lo*. Add *a ella* or *a usted* if it's unclear: *Se lo di a ella.*\nThe pair travels together. With two verbs, both go in front or both glue on: *Te lo voy a dar* or *Voy a dártelo*. Never split them: not *te voy a darlo*.\nGlued on, the word keeps its beat with an accent: *dártelo*, *explicándomelo*, *dámelo*.\nCommands glue on too: *Dámelo.* With *no*, they go in front: *No me lo des.*",
  readAndPick: [
    { q: "Who gets it?", es: "Se lo di a Juan.",
      options: ["Me", "Juan", "Himself"], answer: 1,
      why: "*Se* stands for *le*, and *a Juan* says who: Juan got it." },
    { q: "Which order is right?", es: "Te lo presto mañana.",
      options: ["Thing, then person", "Either order works", "Person, then thing"], answer: 2,
      why: "*Te* (to you) comes before *lo* (it), every time." },
    { q: "Why *se* and not *le*?", es: "¿La plata? Ya se la di a la señora.",
      options: ["Le turns into se before la", "It's something she did to herself", "It's a reflexive verb"], answer: 0,
      why: "*Le* can't sit before *la*, so it becomes *se*: *se la di*." },
    { q: "Where can the pair go?", es: "Te lo voy a dar. Voy a dártelo.",
      options: ["Only in front of voy", "Both places work", "Only glued on"], answer: 1,
      why: "In front of the first verb or glued to the second: both are right." },
    { q: "Who is she explaining it to?", es: "Está explicándomelo con mucha paciencia.",
      options: ["To them", "To you", "To me"], answer: 2,
      why: "*Explicándomelo*: *me* (to me) then *lo* (it), glued on, with an accent." }
  ],
  yourTurn: [
    { en: "Will you lend it to me? (the bike, to a friend)", es: "¿Me la prestas?", accept: [] },
    { en: "I gave it to him yesterday. (the money)", es: "Se la di ayer.", accept: [] },
    { en: "I'm going to give it to you tomorrow. (the book, to a friend)", es: "Te lo voy a dar mañana.", accept: ["Voy a dártelo mañana."] },
    { en: "Pass it to me. (the key, to a friend)", es: "Pásamela.", accept: ["Dámela."] },
    { en: "Don't tell him. (it, to a friend)", es: "No se lo digas.", accept: [] }
  ],
  translate: [
    { en: "I explained it to my parents yesterday.", es: "Se lo expliqué a mis papás ayer.", accept: ["Se lo expliqué ayer a mis papás.", "Se lo expliqué a mis padres ayer."] },
    { en: "The photos? I'll send them to you tonight. (to a friend)", es: "¿Las fotos? Te las mando esta noche.", accept: ["¿Las fotos? Te las envío esta noche."] },
    { en: "I'm going to tell her tomorrow. (it)", es: "Se lo voy a decir mañana.", accept: ["Voy a decírselo mañana."] },
    { en: "They sold them to us really cheap.", es: "Nos los vendieron muy baratos.", accept: ["Nos los vendieron baratísimos."] },
    { en: "She's explaining it to me very patiently.", es: "Está explicándomelo con mucha paciencia.", accept: ["Me lo está explicando con mucha paciencia."] }
  ],
  register: [
    { es: "¿Me lo prestas?", en: "Will you lend it to me?", when: "to a friend, everyday" },
    { es: "¿Me lo presta, por favor?", en: "Could you lend it to me, please?", when: "polite, to someone you call usted" },
    { es: "¿Me lo regala?", en: "Could I have it?", when: "Colombian, asking for something in a shop" },
    { es: "Se lo hago llegar mañana.", en: "I'll get it to you tomorrow.", when: "polite service, at work" }
  ],
  personal: {
    prompt: "A friend asks to borrow three of your things. Say yes to two and no to one, using two little words together each time.",
    constraints: [
      { type: "cliticCluster", label: "two little words together: *te lo*, *te la*" },
      { type: "regex", pattern: "\\bno (te|se|me) (lo|la|los|las)\\b", label: "a no: *no te lo presto*" }
    ],
    model: "¿La bicicleta? Claro, te la presto. ¿El cargador? Te lo dejo en la mesa. ¿El carro? No, qué pena, no te lo presto."
  },
  pitfalls: [
    "*Le lo di* is the slip every learner makes: before *lo*, *le* becomes *se*. *Se lo di.*",
    "*Te voy a darlo* splits the pair: *te lo voy a dar* or *voy a dártelo*.",
    "*Lo te doy* puts the thing first: person first, *te lo doy*."
  ]
},

"nt-cualidad-generalidad-b1": {
  source: "merged",
  hook: {
    line: "A friend visiting Colombia asks what people are like here. You can't speak for everyone, but you can say what's usually true, what someone seems like, and who looks like whom.",
    es: "En general, la gente aquí es muy amable.\nTu hijo se parece mucho a ti, pero parece más tranquilo.",
    en: "In general, people here are very friendly.\nYour son looks a lot like you, but he seems calmer."
  },
  examples: [
    { es: "Por lo general llego a las ocho.", en: "I usually get in at eight." },
    { es: "La mayoría de mis amigos vive en el exterior.", en: "Most of my friends live abroad." },
    { es: "Es una persona con muchas cualidades.", en: "She's a person with a lot of good qualities." }
  ],
  rule: "For what is usually true: *en general*, *por lo general*. *En general, la gente es amable.* Note the *lo* in *por lo general*.\n*La mayoría de* and a group: *La mayoría de mis amigos vive en el exterior.*\n*La gente* is singular: *la gente es amable*.\n*Parecer* gives an impression: *Parece cansado.* *Parece un adolescente.*\n*Parecerse a* is a likeness, with *se* and *a*: *Se parece a su papá.* *Nos parecemos mucho.*\nKinds and shapes: *¿Qué tipo de música te gusta?* *¿Qué forma tiene?* *Es redondo.*\n*Suele* and the dictionary form says what someone usually does: *Suele llegar tarde.*",
  readAndPick: [
    { q: "Is this about one particular day?", es: "En general, el bus pasa cada diez minutos.",
      options: ["No, it's what usually happens", "Yes, it's about today only", "It's a question about the bus"], answer: 0,
      why: "*En general* is about the usual case, not one day." },
    { q: "What does he mean?", es: "Se parece mucho a su mamá.",
      options: ["He seems like a mother", "He looks like his mum", "He likes his mum"], answer: 1,
      why: "*Parecerse a*, with *se* and *a*: a likeness." },
    { q: "What does she mean?", es: "Parece cansado hoy.",
      options: ["He looks like someone who's tired", "He is always tired", "He seems tired today"], answer: 2,
      why: "*Parecer* without *se*: an impression, here and now." },
    { q: "Why *es* and not *son*?", es: "La gente del barrio es muy amable.",
      options: ["La gente is singular", "It's about one person only", "It's in the past"], answer: 0,
      why: "*La gente* is one word in the singular, so *es*." },
    { q: "What does *suele* tell you?", es: "Mi hermano suele llegar tarde.",
      options: ["It happened just once", "It's a habit of his", "It's a plan for later"], answer: 1,
      why: "*Suele llegar*: he usually arrives late." }
  ],
  yourTurn: [
    { en: "In general, people here are very friendly.", es: "En general, la gente aquí es muy amable.", accept: ["En general, la gente acá es muy amable.", "Por lo general, la gente aquí es muy amable."] },
    { en: "He seems tired today.", es: "Parece cansado hoy.", accept: ["Hoy parece cansado."] },
    { en: "He looks a lot like his father.", es: "Se parece mucho a su papá.", accept: ["Se parece mucho a su padre."] },
    { en: "I usually get in at eight.", es: "Por lo general llego a las ocho.", accept: ["Por lo general, llego a las ocho.", "Suelo llegar a las ocho."] },
    { en: "What shape is that building?", es: "¿Qué forma tiene ese edificio?", accept: [] }
  ],
  translate: [
    { en: "Most of my friends live abroad.", es: "La mayoría de mis amigos vive en el exterior.", accept: ["La mayoría de mis amigos viven en el exterior."] },
    { en: "She's a person with a lot of good qualities.", es: "Es una persona con muchas cualidades.", accept: [] },
    { en: "We look very much alike.", es: "Nos parecemos mucho.", accept: [] },
    { en: "He looks like a teenager.", es: "Parece un adolescente.", accept: [] },
    { en: "I don't like that kind of boots.", es: "No me gusta ese tipo de botas.", accept: [] },
    { en: "It's a very original novel; it isn't like any other.", es: "Es una novela muy original, no se parece a ninguna otra.", accept: [] }
  ],
  register: [
    { es: "Por lo general...", en: "Generally...", when: "everyday, spoken or written" },
    { es: "En general...", en: "In general...", when: "neutral, anywhere" },
    { es: "Por regla general...", en: "As a rule...", when: "careful, at work or in writing" },
    { es: "Es igualito a su papá.", en: "He's the spitting image of his dad.", when: "Colombian and warm, among family" }
  ],
  personal: {
    prompt: "Describe what people are usually like where you live, then compare two people in your family: who looks like whom, and how one of them seems lately.",
    constraints: [
      { type: "containsAny", words: ["en general", "por lo general", "la mayoría"], label: "the usual case: *en general*" },
      { type: "regex", pattern: "\\b(se|nos) parec[a-záéíóúñ]*|\\bme parezco\\b|\\bte pareces\\b", label: "a likeness: *se parece a*" },
      { type: "containsAny", words: ["parece cansad", "parece feliz", "parece más", "parece muy", "parece un", "parece una", "parece tranquil", "parece content", "parece preocupad", "parece mayor", "parece joven"], label: "an impression: *parece cansado*" }
    ],
    model: "En general, la gente de mi ciudad es muy amable y habla mucho. La mayoría madruga para ir a trabajar. Mi hermana se parece mucho a mi mamá. Últimamente parece más tranquila que antes."
  },
  pitfalls: [
    "*Por general* drops a word: *por lo general*.",
    "*La gente son amables*: *la gente* is singular in Spanish, *la gente es amable*.",
    "*Se parece cansado* mixes the two: an impression is *parece cansado*; a likeness, *se parece a*."
  ]
},

"nt-edad-vejez-b1": {
  source: "merged",
  hook: {
    line: "Your grandmother turns ninety on Saturday, and the family is planning the party. Spanish keeps apart the age someone is and the moment they reach it, and a dream that comes true happens to you.",
    es: "Mi abuela cumple noventa años el sábado.\nSe le cumplió el sueño de reunir a toda la familia.",
    en: "My grandmother turns ninety on Saturday.\nHer dream of getting the whole family together came true."
  },
  examples: [
    { es: "Tengo treinta años.", en: "I'm thirty." },
    { es: "El mes que viene cumplimos diez años de casados.", en: "Next month we'll have been married ten years." },
    { es: "Aunque tiene sesenta, parece mucho más joven.", en: "Although she's sixty, she looks much younger." }
  ],
  rule: "*Tener* and *años* is how old someone is: *Tengo treinta años.*\n*Cumplir* and *años* is the moment they reach it: *Cumple noventa años el sábado.* *¿Cuántos años cumples?* On its own, *cumplir años* is to have a birthday.\nIt counts other years too: *Cumplimos diez años de casados.* *Un aniversario* is any yearly date, not only a birthday.\nA dream comes true by itself, and happens to you: *Se me cumplió el sueño.* *A mi abuela se le cumplió el sueño.*\nA promise is kept by a person: *Cumplió su promesa.*\n*Parecer* gives the age someone looks: *Parece más joven.*",
  readAndPick: [
    { q: "How old is she today?", es: "Mi hermana cumple veinte años mañana.",
      options: ["Nineteen", "Twenty", "Twenty-one"], answer: 0,
      why: "*Cumple veinte mañana*: she reaches twenty tomorrow, so today she's nineteen." },
    { q: "What happened to the dream?", es: "A Rosa se le cumplió el sueño de tener un café.",
      options: ["She gave it up", "It came true", "She's still waiting"], answer: 1,
      why: "*Se le cumplió*: it came true for her." },
    { q: "What are they celebrating?", es: "Este mes cumplimos diez años de casados.",
      options: ["A birthday party", "A new job", "A wedding anniversary"], answer: 2,
      why: "*Diez años de casados*: ten years married." },
    { q: "Who kept the promise?", es: "Mi papá cumplió su promesa.",
      options: ["My father did", "The promise did", "Nobody did"], answer: 0,
      why: "A person keeps a promise, so no *se*: *cumplió su promesa*." },
    { q: "How old does she look?", es: "Aunque tiene sesenta, parece mucho más joven.",
      options: ["Older than sixty", "Exactly sixty", "Younger than sixty"], answer: 2,
      why: "*Parece mucho más joven*: the impression is younger than her age." }
  ],
  yourTurn: [
    { en: "My sister turns twenty tomorrow.", es: "Mi hermana cumple veinte años mañana.", accept: [] },
    { en: "How old are you turning this year? (to a friend)", es: "¿Cuántos años cumples este año?", accept: [] },
    { en: "I'm thirty.", es: "Tengo treinta años.", accept: [] },
    { en: "My dream of living in Bogotá came true.", es: "Se me cumplió el sueño de vivir en Bogotá.", accept: [] },
    { en: "Although she's sixty, she looks much younger.", es: "Aunque tiene sesenta, parece mucho más joven.", accept: ["Aunque tiene sesenta años, parece mucho más joven."] }
  ],
  translate: [
    { en: "Next month we'll have been married ten years.", es: "El mes que viene cumplimos diez años de casados.", accept: ["El próximo mes cumplimos diez años de casados."] },
    { en: "We celebrated their wedding anniversary.", es: "Celebramos su aniversario de bodas.", accept: ["Celebramos su aniversario de matrimonio."] },
    { en: "In those clothes he looks like a teenager.", es: "Con esa ropa parece un adolescente.", accept: [] },
    { en: "He kept his promise.", es: "Cumplió su promesa.", accept: [] },
    { en: "I hope all your wishes come true. (to a friend)", es: "Ojalá se te cumplan todos tus deseos.", accept: ["Espero que se te cumplan todos tus deseos."] },
    { en: "My cousin turned twenty-eight yesterday.", es: "Mi primo cumplió veintiocho años ayer.", accept: [] }
  ],
  register: [
    { es: "¡Feliz cumpleaños!", en: "Happy birthday!", when: "to anyone, on the day" },
    { es: "¡Que cumplas muchos más!", en: "Many happy returns!", when: "warm, after the birthday wishes" },
    { es: "Es una persona mayor.", en: "She's an older person.", when: "polite, instead of vieja" },
    { es: "Está muy viejito.", en: "He's getting on a bit.", when: "Colombian and affectionate, about someone close" },
    { es: "Atención preferencial al adulto mayor", en: "Priority service for senior citizens", when: "official, on signs and forms in Colombia" }
  ],
  personal: {
    prompt: "Write about someone's birthday coming up: their age now, the age they're turning, and a dream of theirs that came true or that you hope will.",
    constraints: [
      { type: "regex", pattern: "\\b(tiene|tengo|tienes|tenemos|tienen) .{1,30} años", label: "their age now: *tiene... años*" },
      { type: "regex", pattern: "\\bcumpl(e|o|es|imos|en)\\b", label: "the age they're turning: *cumple*" },
      { type: "containsAny", words: ["se le cumplió", "se me cumplió", "se te cumpla", "se le cumpla", "se les cumpla", "se le cumplan", "se te cumplan"], label: "a dream that comes true: *se le cumplió el sueño*" }
    ],
    model: "Mi abuelo tiene ochenta y nueve años. El domingo cumple noventa, y vamos a hacerle una fiesta en la finca. Siempre quiso conocer el mar, y el año pasado por fin se le cumplió el sueño."
  },
  pitfalls: [
    "*Mi hermana tiene veinte años mañana*: the moment is *cumple*; *tiene* is her age already.",
    "*Mi sueño cumplió* leaves out the *se*: a dream comes true by itself, *se cumplió*.",
    "*Vieja* can sound rude about a person: *mayor* is the polite word."
  ]
},

"nt-localizacion-posicion-b1": {
  source: "merged",
  hook: {
    line: "You've turned your apartment upside down looking for your keys, and your roommate wants to help. You need to say exactly where you've looked, where things are, and that the keys are nowhere.",
    es: "No encuentro las llaves por ningún lado.\nYa busqué junto a la puerta y al fondo del clóset.",
    en: "I can't find my keys anywhere.\nI've already looked by the door and at the back of the wardrobe."
  },
  examples: [
    { es: "Había gente por todas partes.", en: "There were people everywhere." },
    { es: "La mesa está en medio de la sala.", en: "The table is in the middle of the living room." },
    { es: "Hay un parque frente al edificio.", en: "There's a park opposite the building." }
  ],
  rule: "Nowhere takes two negatives: *no* before the verb, and *por ningún lado* or *en ninguna parte* after it. *No las encuentro por ningún lado.*\nEverywhere: *por todas partes*, *por todos lados*.\n*Parte* goes with *la*, so *ninguna*, *todas*; *lado* goes with *el*, so *ningún*, *todos*.\nPrecise spots keep their little *de* or *a*: *al fondo del pasillo*, *en medio de la sala*, *junto a la ventana*, *frente al edificio*, *alrededor de la casa*.\nDrop the place and you drop the *de*: *El baño está al fondo.*\nWhere a place is in the city: *céntrico*, *en las afueras*. *¿En qué sector vives?*",
  readAndPick: [
    { q: "Where are the keys?", es: "No encuentro las llaves por ningún lado.",
      options: ["Nowhere she can find", "Everywhere in the flat", "By the front door"], answer: 0,
      why: "*No... por ningún lado*: two negatives, one meaning, nowhere." },
    { q: "How many people were there?", es: "Había gente por todas partes.",
      options: ["Hardly anyone at all", "Lots, everywhere", "Only in one room"], answer: 1,
      why: "*Por todas partes*: everywhere you looked." },
    { q: "Where is the bathroom?", es: "El baño está al fondo del pasillo.",
      options: ["At the start of the hallway", "Opposite the kitchen", "At the end of the hallway"], answer: 2,
      why: "*Al fondo del pasillo*: at the far end." },
    { q: "Why *ningún* and not *ninguna*?", es: "No lo veo por ningún lado.",
      options: ["Because it's el lado", "It's a question", "It sounds more polite"], answer: 0,
      why: "*El lado*, so *ningún*; with *la parte* it would be *ninguna*." },
    { q: "Where is the park?", es: "Hay un parque frente al edificio.",
      options: ["Behind the building", "Opposite the building", "Inside the building"], answer: 1,
      why: "*Frente al edificio*: facing it, across the way." }
  ],
  yourTurn: [
    { en: "I can't find my phone anywhere.", es: "No encuentro mi celular por ningún lado.", accept: ["No encuentro mi celular en ninguna parte.", "No encuentro el celular por ningún lado."] },
    { en: "There were people everywhere.", es: "Había gente por todas partes.", accept: ["Había gente por todos lados."] },
    { en: "The kitchen is at the end of the hallway.", es: "La cocina está al fondo del pasillo.", accept: [] },
    { en: "Put the plant next to the window. (to a friend)", es: "Pon la planta junto a la ventana.", accept: ["Pon la planta al lado de la ventana."] },
    { en: "There are trees around the house.", es: "Hay árboles alrededor de la casa.", accept: [] }
  ],
  translate: [
    { en: "The table is in the middle of the living room.", es: "La mesa está en medio de la sala.", accept: ["La mesa está en la mitad de la sala."] },
    { en: "What area do you live in? (to a friend)", es: "¿En qué sector vives?", accept: ["¿En qué [barrio|zona] vives?"] },
    { en: "The left side of the building is under construction.", es: "El lado izquierdo del edificio está en obra.", accept: ["El lado izquierdo del edificio está en construcción."] },
    { en: "I haven't seen her anywhere.", es: "No la he visto por ningún lado.", accept: ["No la he visto en ninguna parte."] },
    { en: "There's a park opposite the building.", es: "Hay un parque frente al edificio.", accept: ["Hay un parque enfrente del edificio."] }
  ],
  register: [
    { es: "Por ningún lado.", en: "Nowhere.", when: "everyday Latin American" },
    { es: "En ninguna parte.", en: "Nowhere.", when: "neutral, spoken or written" },
    { es: "Queda en todo el centro.", en: "It's right in the centre.", when: "Colombian, everyday" },
    { es: "Ubicado en una zona céntrica.", en: "Located in a central area.", when: "an ad or a formal description" }
  ],
  personal: {
    prompt: "Something of yours is lost at home. Write three lines: where you've looked, exactly, and that it's nowhere.",
    constraints: [
      { type: "containsAny", words: ["por ningún lado", "en ninguna parte", "por ninguna parte", "en ningún lado"], label: "nowhere: *por ningún lado*" },
      { type: "containsAny", words: ["al fondo de", "al fondo del", "en medio de", "junto a", "frente a", "frente al", "alrededor de", "debajo de", "debajo del", "encima de", "detrás de"], label: "exact places: *al fondo del*, *junto a*" }
    ],
    model: "Busqué el control del televisor debajo del sofá y junto a la ventana. También miré al fondo del cajón de la cocina. No está por ningún lado."
  },
  pitfalls: [
    "*Veo mi celular en ninguna parte* drops the *no*: Spanish needs both, *no veo... en ninguna parte*.",
    "*Al fondo el pasillo* drops the *de*: *al fondo del pasillo*.",
    "*Piso céntrico* is Spain's flat: in Colombia, *apartamento céntrico*."
  ]
},

"nt-distancia-movimiento-b1": {
  source: "merged",
  hook: {
    line: "You're telling the police what you saw outside your building: a car came up to the house, a man moved away from the door, a girl fell off her bike. Spanish says toward and away with two matched verbs, each with its own little word.",
    es: "El carro se acercó lentamente a la casa.\nY el señor se alejó de la puerta sin decir nada.",
    en: "The car slowly came up to the house.\nAnd the man moved away from the door without saying anything."
  },
  examples: [
    { es: "La niña se cayó de la bicicleta, pero no se lastimó.", en: "The girl fell off her bike, but she didn't get hurt." },
    { es: "¿A cuánto queda el aeropuerto del centro?", en: "How far is the airport from downtown?" },
    { es: "Vamos a dar una vuelta por el parque.", en: "Let's go for a walk round the park." }
  ],
  rule: "Toward and away: *acercarse a*, *alejarse de*. *Se acercó a la casa.* *Se alejó de la puerta.* Each keeps its own little word.\nThe *se* means the subject moves itself. Without it, you move something else: *Acercó la silla.* *¿Me acercas la sal?*\nHow far: *estar a* or *quedar a*. *El aeropuerto queda a media hora del centro.* *Estamos a tres cuadras.*\nFalling by accident: *caerse*, with *de* for what from. *Se cayó de la bicicleta.* Getting hurt: *lastimarse*. *Me lastimé la rodilla.*\nGetting around: *montar en bicicleta*, *montar a caballo*, *dar una vuelta*.",
  readAndPick: [
    { q: "Which way did the car go?", es: "El carro se acercó a la casa.",
      options: ["Away from the house", "Toward the house", "Right past the house"], answer: 1,
      why: "*Acercarse a*: getting closer to." },
    { q: "Why *de* after *alejarse*?", es: "Se alejó de la puerta.",
      options: ["Away from always takes de", "The door belongs to him", "It's a question"], answer: 0,
      why: "*Alejarse de*: away from. Toward would be *acercarse a*." },
    { q: "Was she hurt?", es: "Se cayó de la bicicleta, pero no se lastimó.",
      options: ["Yes, quite badly", "We don't know yet", "No, she was fine"], answer: 2,
      why: "*No se lastimó*: she fell but didn't get hurt." },
    { q: "What does she want?", es: "¿Me acercas la sal?",
      options: ["For you to pass the salt", "To sit closer to you", "To buy more salt"], answer: 0,
      why: "No *se*: you move the salt closer to her." },
    { q: "How far is it?", es: "El aeropuerto queda a media hora del centro.",
      options: ["An hour and a half", "Half an hour away", "Right next to the centre"], answer: 1,
      why: "*Queda a media hora*: half an hour away." }
  ],
  yourTurn: [
    { en: "The car came up to the house.", es: "El carro se acercó a la casa.", accept: [] },
    { en: "He moved away from the door without saying anything.", es: "Se alejó de la puerta sin decir nada.", accept: [] },
    { en: "She fell off her bike, but she didn't get hurt.", es: "Se cayó de la bicicleta, pero no se lastimó.", accept: ["Se cayó de la bicicleta, pero no se hizo daño."] },
    { en: "Can you pass me the salt? (to a friend)", es: "¿Me acercas la sal?", accept: ["¿Me pasas la sal?"] },
    { en: "We're three blocks away.", es: "Estamos a tres cuadras.", accept: ["Quedamos a tres cuadras."] }
  ],
  translate: [
    { en: "How far is the airport from downtown?", es: "¿A cuánto queda el aeropuerto del centro?", accept: ["¿A cuánto está el aeropuerto del centro?"] },
    { en: "Let's go for a walk round the park.", es: "Vamos a dar una vuelta por el parque.", accept: [] },
    { en: "I hit my head.", es: "Me golpeé la cabeza.", accept: ["Me pegué en la cabeza."] },
    { en: "The boat was slowly approaching the port.", es: "El barco se acercaba poco a poco al puerto.", accept: ["El barco se acercaba lentamente al puerto."] },
    { en: "We stopped for a while before we carried on driving.", es: "Paramos un rato antes de seguir manejando.", accept: [] },
    { en: "Have you ever ridden a horse? (to a friend)", es: "¿Alguna vez has montado a caballo?", accept: ["¿Has montado a caballo alguna vez?"] }
  ],
  register: [
    { es: "¿Me acercas la sal?", en: "Can you pass me the salt?", when: "at the table, with family or friends" },
    { es: "Me caí, pero no me pasó nada.", en: "I fell, but I'm fine.", when: "reassuring someone, everyday" },
    { es: "Me di un totazo.", en: "I took a real knock.", when: "Colombian slang, a hard fall or bump" },
    { es: "El vehículo se aproximó a la vivienda.", en: "The vehicle approached the dwelling.", when: "a police report or the news" }
  ],
  personal: {
    prompt: "Tell a small incident you saw in the street, in four sentences: someone came closer, someone moved away, and someone fell.",
    constraints: [
      { type: "regex", pattern: "acerc[a-záéíóúñ]* al?\\b", label: "toward: *se acercó a*" },
      { type: "regex", pattern: "alej[a-záéíóúñ]* del?\\b", label: "away: *se alejó de*" },
      { type: "regex", pattern: "\\b(se cayó|me caí|se cayeron|nos caímos)", label: "a fall: *se cayó*" }
    ],
    model: "Ayer un perro se acercó a una señora en el parque. La señora se asustó y se alejó del perro muy rápido. En ese momento un niño se cayó de la patineta. Por suerte no se lastimó."
  },
  pitfalls: [
    "*Se acercó de la ventana* swaps the little words: toward is *a*, away is *de*.",
    "*Me hice daño* is understood everywhere, but in Colombia you'll hear *me lastimé* far more.",
    "*Conducir* is Spain's verb. In Colombia: *manejar*."
  ]
},

"task-b1-describir": {
  source: "old",
  hook: {
    line: "This is the unit's own piece of writing: three short portraits, of a person, a place and an object, each one paragraph long. Words like *que*, *donde* and *quien* let a description keep adding detail without starting a new sentence every time.",
    es: "Mi tía Gloria es una mujer que nunca se está quieta.\nEs la persona a quien llamo cuando algo se daña.",
    en: "My aunt Gloria is a woman who's never still.\nShe's the person I call when something breaks."
  },
  examples: [
    { es: "La panadería donde desayuno huele a pandebono desde las seis.", en: "The bakery where I have breakfast smells of pandebono from six o'clock." },
    { es: "Tengo un reloj que era de mi abuelo.", en: "I have a watch that belonged to my grandfather." }
  ],
  rule: "Three paragraphs: a person, a place, an object.\nKeep adding with *que*: *una mujer que nunca se está quieta*, *un reloj que era de mi abuelo*.\n*Donde* for places: *la panadería donde desayuno*.\n*Quien* for people after a little word: *la persona a quien llamo*, *el amigo con quien viajé*.\n*Lo que* sums up: *Lo que más me gusta es su risa.*\n*El que* and *la que* point out: *Es la que siempre llega primero.*\nIn each paragraph, one detail only you would notice. Don't start two sentences in a row the same way.",
  readAndPick: [
    { q: "Who does she call?", es: "Es la persona a quien llamo cuando algo se daña.",
      options: ["A plumber she found online", "Her aunt, when something breaks", "Her neighbour, for gossip"], answer: 1,
      why: "*A quien llamo*: the person I call, with *a* before *quien*." },
    { q: "What does the bakery smell of?", es: "La panadería donde desayuno huele a pandebono.",
      options: ["Strong coffee", "Rain on the street", "Pandebono"], answer: 2,
      why: "*Huele a pandebono*: the cheese bread baked there every morning." },
    { q: "Whose watch was it?", es: "Tengo un reloj que era de mi abuelo.",
      options: ["Her grandfather's", "Her father's", "A shop's"], answer: 0,
      why: "*Que era de mi abuelo*: it belonged to her grandfather." },
    { q: "Which word links to a place?", es: "Es el parque donde aprendí a montar en bicicleta.",
      options: ["quien", "donde", "cual"], answer: 1,
      why: "*Donde* hangs the detail on *el parque*." },
    { q: "What does *lo que* sum up?", es: "Lo que más me gusta de ella es su risa.",
      options: ["Her laugh, the best thing", "Her house and garden", "Her job at the bank"], answer: 0,
      why: "*Lo que más me gusta*: the thing I like most, her laugh." }
  ],
  yourTurn: [
    { en: "She's a woman who's never still.", es: "Es una mujer que nunca se está quieta.", accept: ["Es una mujer que nunca está quieta."] },
    { en: "She's the person I call when something breaks.", es: "Es la persona a quien llamo cuando algo se daña.", accept: ["Es la persona a la que llamo cuando algo se daña.", "Es la persona a quien llamo cuando algo se rompe."] },
    { en: "The bakery where I have breakfast is close by.", es: "La panadería donde desayuno queda cerca.", accept: ["La panadería donde desayuno está cerca."] },
    { en: "I have a watch that belonged to my grandfather.", es: "Tengo un reloj que era de mi abuelo.", accept: [] }
  ],
  translate: [
    { en: "She has a laugh you can hear from the street.", es: "Tiene una risa que se oye desde la calle.", accept: ["Tiene una risa que se escucha desde la calle."] },
    { en: "It's the kind of place that wouldn't be in any guidebook.", es: "Es el típico sitio que no saldría en ninguna guía.", accept: ["Es el típico lugar que no saldría en ninguna guía."] },
    { en: "You have to wind it every morning.", es: "Hay que darle cuerda todas las mañanas.", accept: ["Hay que darle cuerda cada mañana."] },
    { en: "It's the only thing of his that I still have.", es: "Es lo único suyo que conservo.", accept: ["Es lo único de él que conservo.", "Es lo único suyo que todavía tengo."] },
    { en: "What I like most about her is her laugh.", es: "Lo que más me gusta de ella es su risa.", accept: [] }
  ],
  register: [
    { es: "Es una persona muy especial.", en: "She's a very special person.", when: "warm, spoken or written" },
    { es: "Es un duro para arreglar cosas.", en: "He's a whiz at fixing things.", when: "Colombian and colloquial, among friends" },
    { es: "Es el típico sitio de barrio.", en: "It's your typical neighbourhood place.", when: "everyday, somewhere unpretentious" },
    { es: "Se trata de un reloj de bolsillo de principios del siglo veinte.", en: "It's an early twentieth-century pocket watch.", when: "formal, a catalogue or a museum card" }
  ],
  personal: {
    prompt: "Write three paragraphs: a person, a place and an object you know well. Use at least five links with *que*, *donde* or *quien*, and give each one a detail only you would notice.",
    constraints: [
      { type: "minSentences", n: 9, label: "three paragraphs, nine sentences or more" },
      { type: "containsWord", word: " donde ", label: "a place, with *donde*" },
      { type: "regex", pattern: "\\b(a|con|para|de) quien", label: "a person, with *a quien* or *con quien*" },
      { type: "regex", pattern: "(\\bque\\b[\\s\\S]*){5}", label: "five links with *que* or more" }
    ],
    model: "Mi tía Gloria es una mujer que nunca se está quieta. Es la persona a quien llamo cuando algo se daña, porque lo arregla todo. Tiene una risa que se oye desde la calle. Lo que más me gusta de ella es que siempre llega con algo de comer.\n\nLa panadería donde desayuno es el típico sitio que no saldría en ninguna guía. Es estrecha, huele a pandebono desde las seis y tiene una vitrina que nadie limpia. El señor que atiende ya sabe cómo me gusta el tinto.\n\nTengo un reloj que era de mi abuelo. Hay que darle cuerda todas las mañanas, lo cual es un poco molesto. Pero es lo único suyo que conservo, y lo uso todos los días."
  },
  pitfalls: [
    "*La persona quien llamo* needs its little word: *a quien llamo*.",
    "*Lo cual es un incordio* is from Spain; in Colombia, *lo cual es un poco molesto*, or among friends *es una cansonería*.",
    "Starting every sentence with *Es...* flattens a description: vary the openings."
  ]
}

};
