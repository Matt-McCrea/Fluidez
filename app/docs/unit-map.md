# Fluidez 2 — unit map (for review)

The curriculum architect's map: 60 weekly units, A1→C1, neutral Latin American Spanish with the story set in Bogotá. Machine-readable versions live in `app/content/graph/*.json` (the skill graph) and `app/content/units/uNN.json` (one file per unit). Every node and unit parses against `src/content/schema.ts`, and a check confirms that no node's priority comes before anything it requires.

**What's in the graph.** 172 grammar points, 640 patterns, 395 chunks, 94 contrasts and 269 can-dos, across 593 sessions:

| Band | Units | Sessions | Grammar | Bank quota |
|---|---|---|---|---|
| A1 | 1–14 | 1–133 | 43 | 6,673 |
| A2 | 15–27 | 134–263 | 39 | 5,133 |
| B1 | 28–41 | 264–403 | 42 | 6,720 |
| B2 | 42–51 | 404–503 | 28 | 5,794 |
| C1 | 52–60 | 504–593 | 20 | 5,456 |
| **Total** | **60** | **593** | **172** | **29,776** |

Across all units the quotas also call for 219 story chapters, 108 scenes and 241 writing tasks. Lexemes are left to the vocab rebuild: each unit's `theme` field names its PCIC area, followed by the vocab themes for that unit.

**The week.**
- **A1–A2** use the BLUEPRINT rhythm with a third grammar point added: Introduce, Drill, Introduce, Drill, Input, (Patterns), Introduce, Drill, Output, Review. That gives three grammar points every 9–10 sessions, about 2.3 a week.
- **Unit 1** has four grammar points and no review day, because there is nothing to review yet.
- **B1** moves Input forward (Introduce, Drill, Input, …) and always has a Patterns day.
- **B2 and C1** introduce 2–3 points per unit. They have two Input or two Output days and Patterns days of up to ten frames, because upper-band lessons should be few and long.
- **Every fourth unit ends on a checkpoint** (✓ in the tables).

**The compiler's rules hold everywhere.**
- At most one grammar point is introduced per day.
- Introduce days are never consecutive.
- Every Introduce day is followed by a Drill within 1–3 sessions.
- New chunks are capped at 3 on Introduce days, 4 on Drill days and 5 on Input and Patterns days. Output, Review and Checkpoint days add no new items.
- Contrasts are drilled only after both sides have been taught.
- Each unit's can-do is dated no earlier than its last grammar point.

**The cast** (the story is the reason to come back):
- **Tomás Herrera** (34) was born in Bogotá and raised in Toronto. He is a laid-off software tester whose Spanish is rusty, like the learner's.
- **Valentina "Vale" Ospina** (28) is a sharp pastry chef from Medellín who ran the café with his grandmother.
- **Don Hernando Pacheco** (71) is a retired taxi driver and a regular for forty years. He tells terrible jokes and secretly loved Rosa.
- **Mariana Cifuentes** (33) is an investigative journalist and Tomás's childhood friend.
- **Simón** is the café parrot. He repeats chunks at the worst possible moment.

**The stakes.** Tomás inherits *La Esquina de Rosa* in La Candelaria just as Ricardo Altamira's hotel group is buying up the block. An unsent 1978 letter from Rosa to her estranged brother Joaquín leads the cast to Medellín and the Caribbean coast. It also leads to a heritage hearing, a cooperative and, slowly, Tomás and Vale.

## Grammar milestones (session index, standard tier)

| Milestone | Session | Plan target |
|---|---|---|
| present -ar (with irregular chunks from session 1) | 8 | 1 |
| gender and articles | 6 | ≤8 |
| stem-changers (boot verbs) | 22 | ≤26 |
| **preterite as a system** (-ar 29, -er/-ir 31, fui/hice 34, irregulars 50, spelling 98) | **29** | ~30 |
| imperfect of states (era, estaba, tenía, había) | 48 | ~45 |
| perfecto for experience and "not yet" only | 67 | ~60 |
| lo/la/los/las | 92 | — |
| full imperfect / preterite vs imperfect | 96 / 105 | ~95 |
| tú / usted commands | 115 / 117 | — |
| future (guesses first) / conditional | 184 / 190 | — |
| **present subjunctive** (wanting: *quiero que*) | **194** | ~175 |
| subjunctive of opinion and doubt | 264 / 274 | — |
| pluperfect | 294 | — |
| imperfect subjunctive / *si tuviera* | 384 / 387 | — |
| *si hubiera…, habría…* | 421 | — |
| Spain recognition (vosotros, *hoy he ido*) / voseo recognition | 494 / 574 | — |

## Supply quotas: the formula

```
bankSentences = 40 × grammar points introduced in the unit
              + 15 × patterns introduced
              +  6 × chunks introduced
              +  6 × expected new lexemes   (A1 35, A2 32, B1 30, B2 27, C1 25 per unit)
chapters      = number of days in the unit that carry a chapter id
                (A1 u01–04: 2; A1–A2: 3; B1: 3; B2–C1: 5)
scenes        = Output day (a) + second Output or last Drill from B1 (b) + checkpoint (c)
writingTasks  = max(3, band index + 2)  →  A1 3, A2 3, B1 4, B2 5, C1 6
```

**Why these multipliers.**
- **Reviews never repeat a cue** (plan §1). Every review of a word or grammar point uses a sentence the learner hasn't seen.
- **Grammar needs 40 sentences.** FSRS gives each grammar point about 8–10 scored retrievals in its first 2–3 months, in both directions. On top of that come drill days, the review-day remix and checkpoints. 40 sentences cover about 3× the simulator's expected consumption.
- **Patterns need 15.** They get about 5 scored contacts, and 15 sentences cover 3× that.
- **Chunks and lexemes need 6.** That is the plan's floor.
- **Contrasts get no separate quota.** They draw on the sentences of both sides.
- **Phase 3 calibrates these numbers.** The simulator should replace the constants once it reports real consumption, and supply must stay at least 3×.

# The units

One line per unit: the can-do, the grammar it introduces (with the session it lands on), its key patterns and the story beat. ✓ marks a checkpoint unit.

## A1 — the engine and every time frame

Units 1–14 · sessions 1–133 (133 sessions)

| Unit | Can-do | Grammar introduced (session) | Key patterns | Story beat |
|---|---|---|---|---|
| **u01 Hello — who I am** | greet someone, say who I am, where I'm from and what I do, and ask them the same. | ser-identity (1), sounds-letters (3), gender-articles (6), present-ar (8) | Saying someone's job: es profesora (no 'a') | Tomás lands at El Dorado with a headache from the altitude and one suitcase. |
| **u02 My day-to-day** | say where I live and work, what I do on a normal day and how I am, and ask simple questions. | present-er-ir (11), estar-location-states (13), questions (16) | Saying you're hungry, cold or sleepy: tengo ha…; Talking to vs about someone: Buenos días, seño…; Well vs good: está bien, canta mal, un libro b… (+1) | Vale walks Tomás through a normal day at the café: she opens at six, bakes, serves, does the accounts Rosa never did. |
| **u03 Likes, wants and plans** | say what I like, want and can do, and what I'm going to do this weekend. | gustar-basic (20), stem-boot (22), ir-a-plans (25) | Me too, me neither: yo también / yo tampoco; Asking someone to choose: ¿Prefieres té o café?; Asking what kind: ¿Qué tipo de música te gusta? (+3) | Vale confronts him and offers a bet instead: if the café takes two million pesos in its first month, he keeps it open for a year. |
| **u04 The weekend** ✓ | say what I did yesterday and last weekend, in order. | preterite-ar (29), preterite-er-ir (31), preterite-ser-ir-hacer (34) | What it costs vs what you paid: cuesta, pagué……; Last week, next week: la semana pasada, el mes…; Thanking for something: gracias por todo, grac… (+1) | Saturday is chaos. On Friday Tomás went to Paloquemao market and bought forty kilos of the wrong flour; the espresso machine died at 7:05; Vale made coffee in a pot li… |
| **u05 People in my life** | describe my family and friends: who they are, what they look like, what they're like and how old they are. | yo-irregular (38), adjective-agreement (40), possessives (44) | People need 'a': conozco a tu hermano; 21, 31, 100: veintiún libros, treinta y una ca…; There are four of us: somos cuatro (+9) | Vale video-calls her sister Camila in Medellín and her mother, who wants to know whether "el canadiense" is handsome (Camila thinks so; Vale says he is "normal"). |
| **u06 How it was** | describe what a place or a person was like and say what happened there and how long ago. | imperfect-states (48), preterite-irregular-strong (50), hace-ago (53) | The whole family: los García; Old: viejo, antiguo or mayor?; Dates and years: el 5 de mayo de 1998 (+1) | Hernando tells them how the café was when he first came in 1979: there was a jukebox, Rosa was thirty and had a temper, and the whole street smelled of her pandeyucas. |
| **u07 Where I live** | say what there is in my home and neighbourhood, where things are, and how much of everything there is. | hay-vs-esta (57), demonstratives (59), quantifiers (63) | First, second, third floor: el primer piso, la…; Next to, opposite, behind: al lado de la drogu…; Where a place is: queda cerca, queda a dos cua… (+7) | Tomás leaves the hostel and rents a room from Doña Gloria above a bakery, two blocks away: a bed, a desk, a window onto the cathedral, and a shower that works one day … |
| **u08 Have you ever…?** ✓ | talk about places I've been and things I've done or haven't done yet, and say what I can and know how to do. | perfecto-experience (67), negation-words (69), verb-infinitive (72) | Knowing a fact vs knowing a person or place: s…; Feeling like doing something: tengo ganas de…; In order to: para + verb (+1) | Vale and Hernando are horrified by everything Tomás has never done: never tried ajiaco, never played tejo, never climbed Monserrate. |
| **u09 My routine** | describe my whole day, say what I'm doing right now and what I have to do. | reflexive-routine (76), estar-gerund (78), tener-que-hay-que (82) | Washing your hands, brushing your teeth: me la…; In the morning, on Tuesday afternoon: por la m…; It's late, it's night: es tarde, ya es de noche (+9) | Tomás's new life starts at five: shower (cold), bakery, café, accounts, chess with Hernando, bed. |
| **u10 Food and ordering** | order food and drink, say what I and other people like, and ask for what's missing. | gustar-full (86), stem-e-i (88), direct-objects (92) | Fixing a time and place: ¿nos vemos a las siet…; Asking for things: ¿me trae…?, ¿me pasas…?; A bottle of, a pound of: una botella de agua (+4) | To win Vale back Tomás helps her plan a new menu: ajiaco on Saturdays, jugos with whatever is in season, her buñuelos all day. |
| **u11 How life used to be** | describe what my life used to be like and compare it with now. | imperfect-habitual (96), preterite-spelling-stem (98), comparatives (101) | Looking like someone: me parezco a mi papá; How tall, how heavy: mide 1,80, pesa dos kilos; Stopping a habit: dejé de fumar (+2) | Tomás remembers Sundays at the café when he was six: he used to sit on the counter while Rosa sang, and his father used to take him to see the planes. |
| **u12 Telling a story** ✓ | tell a short story: what happened, what it was like, and what was going on when it happened. | pret-vs-imperfect (105), imperfect-progressive (107), that-clauses (111) | Talking about the weather: hace frío, está llo…; Doing something again: volvió a llamar | One night in the rainy season the power goes out. Tomás was closing up and Vale was counting the money when they heard a noise at the back: someone was trying to pull … |
| **u13 Around the city** | ask for and give directions, use public transport, and tell a friend or a stranger what to do. | commands-tu (115), commands-usted (117), indirect-objects (121) | Addresses in Bogotá: queda en la carrera Sépti…; Go vs come: ¿vienes a mi casa?, ¡ya voy!; By bus, on foot: en bus, a pie (+5) | Tomás crosses the city to the notary's office in the north to find the property papers: two TransMilenios, the wrong direction, a street vendor who gives perfect direc… |
| **u14 Joining it up** | write a connected message with reasons and details instead of short separate sentences. | relative-que (125), cause-result (127), prep-pronouns (130) | Saying what for: estudio español para trabajar…; Giving your view: para mí… | Tomás writes Vale a long message, the first one with reasons and details instead of short sentences: the lease that Altamira has bought expires in a year, but the lett… |

## A2 — doing things, and the first wish

Units 15–27 · sessions 134–263 (130 sessions)

| Unit | Can-do | Grammar introduced (session) | Key patterns | Story beat |
|---|---|---|---|---|
| **u15 How are you feeling?** | say how I and others feel, physically and emotionally, and say what I think of things. | ser-estar-adjectives (134), estar-participle (136), parecer-quedar (140) | Saying what hurts: me duele la cabeza; Too much, not at all: es demasiado caro, no es…; Saying what hurts: me duele la cabeza (+1) | Tomás comes down with a terrible flu and spends three days feverish at Doña Gloria's, who feeds him aguapanela and gossip. |
| **u16 Shopping** ✓ | shop for clothes and other things: ask, compare, try on, pay and return something. | object-pronoun-position (144), superlatives (146), double-pronouns (150) | What it's made of: es de cuero; Your size: ¿qué talla usa?, ¿qué número calza?; Changing vs exchanging: cambiar de trabajo, ca… (+3) | With the café doing well, Vale and Tomás go shopping in San Victorino for uniforms, chairs and a new grinder. |
| **u17 Making plans** | make, accept and turn down plans, and talk about conditions and timing. | si-present (154), prep-infinitive (156), cuando-indicative (160) | I don't know what to do: no sé qué hacer; So, then: entonces / o sea que; How about…?: ¿qué tal si vamos a cine? (+5) | Invitations multiply: Mariana invites Tomás to a salsa night, if he can learn three steps by Friday; Vale invites him to her sister's engagement party in Medellín next… |
| **u18 On the road** | travel by bus or plane, book a room, and sort out tickets, luggage and directions. | por-para-1 (164), commands-with-pronouns (166), possessives-stressed (170) | Take vs bring: llévele esto, tráigame eso | The trip to Medellín: the Salitre bus terminal at dawn, nine hours of curves, a lost suitcase and a hotel with a view of the cable cars. |
| **u19 Work and studies** | talk about my job and studies, read a job ad, and say what a workplace needs. | se-impersonal (174), relatives-donde-lo-que (176), article-uses (180) | Giving a short talk: hoy les voy a hablar de…; Working as (for now): trabaja de mesero | Back in Bogotá they need help. They post their first job ad and hire Jhon Fredy, nineteen, an engineering student who works fast and talks faster. |
| **u20 Guesses and predictions** ✓ | guess what's going on, make predictions and promises, and give advice with "would" and "should". | future-conjecture (184), future-promises (186), conditional (190) | — | Simón disappears. Where can he be? |
| **u21 What I want you to do** | ask someone to do something, say what I need from them, and tell them not to do something. | subj-wanting (194), subj-irregulars (196), negative-commands (200) | Would you mind…? ¿Te importaría…? / ¿Podrías…? | Tomás asks Vale to become his partner in the café, fifty-fifty. |
| **u22 Good news, bad news** | congratulate, wish someone well, react to good and bad news, and send a warm message. | subj-wishes (204), exclamations (206), diminutives (210) | Congratulating: ¡felicitaciones por el trabajo…; Each other: se conocieron, nos queremos | A week of news. Good: Vale's birthday, a surprise party with Mariana and Jhon Fredy, and the partnership is signed. |
| **u23 Sorting things out** | deal with a bank, a phone company or a repair: explain the problem, how long it's lasted, and what I need. | que-vs-cual (214), indefinites (216), hace-que-desde (220) | — | Paperwork week: the bank wants three documents that require four other documents; the phone company has been charging Rosa's old line for twelve years; the deeds offic… |
| **u24 Reasons and choices** ✓ | explain a decision, weigh reasons for and against, and correct what someone assumed. | pero-sino (224), aunque-indicative (226), tanto-como (230) | It depends: depende del precio, depende de si …; Selling points of a flat: tiene mucha luz, tie…; Saying which you prefer: prefiero esto a aquello | Altamira makes a generous offer: a bigger, modern space in Chapinero, rent-free for two years, if they leave the corner. |
| **u25 Places and people in detail** | describe a place and a person in detail and pass on what someone told me. | le-doubling (234), adverbs-mente (236), reported-past-basic (240) | The girl with blue eyes: la chica de los ojos … | Second trip to Medellín, for the Feria de las Flores. The city is all flowers, music and steep hills. |
| **u26 Telling it well** | tell an anecdote in a clear order, say how it happened, and react to someone else's. | gerund-ways (244), time-sequence (246), acabar-de-ya-todavia (250) | Having a good or awful time: la pasé genial / …; Piling it up: horas y horas, kilómetros y kiló…; Suddenly starting: se puso a llorar (+1) | At a long dinner Hernando tells his best anecdote: the day in 1983 when Rosa threw a bucket of mop water over a senator who refused to pay. |
| **u27 Writing it down** | write a short email, review or message at paragraph length, with a purpose and reactions. | written-register-a2 (254), para-que (256), subj-emotion-intro (260) | Saying why you're writing: le escribo para…; Two shapes for one wish: que te diviertas / di…; Signs and instructions: No fumar. Marcar el nú… | Everyone is writing: Tomás answers online reviews, Vale writes the café's first newsletter, Mariana sends her draft article about Altamira's purchases for comments. |

## B1 — opinions, the subjunctive, longer stories

Units 28–41 · sessions 264–403 (140 sessions)

| Unit | Can-do | Grammar introduced (session) | Key patterns | Story beat |
|---|---|---|---|---|
| **u28 What I think** ✓ | give and ask for opinions, judge situations, and say what I don't think. | subj-opinion-negated (264), subj-value (267), lo-adjective (270) | Talking about the usual case: en general, por …; Picking out the main case: sobre todo; Giving a verdict on something: lo encuentro ca… (+9) | The neighbourhood holds a meeting about Altamira's plan for a hotel taking up the whole block. |
| **u29 Agreeing and arguing** | agree, disagree, doubt and concede without turning it into a fight. | subj-doubt (274), quizas-a-lo-mejor (277), conditional-past-guess (280) | Saying you don't mind: me da igual, me da lo m…; Maybe, the casual way: de pronto, igual; Probably, surely: seguramente, probablemente (+8) | Vale and Tomás argue about whether to accept Altamira's money if the legal fight looks hopeless. |
| **u30 Feelings** | say how other people's actions make me feel, and describe how people change. | subj-emotion (284), verbs-of-change (287), se-meaning-change (290) | Feeling sorry about it: me da pena que / qué p…; Being hurt emotionally: me duele que…; Saying what makes you mad: me da rabia que… (+13) | Feelings run high. It scares Vale that they could lose everything; it infuriates Hernando that Tomás is even considering the money; it surprises Tomás how much he cares. |
| **u31 A longer story** | tell a story that reaches back before its own beginning, and report what people said. | pluperfect (294), narrative-pasts (297), reported-backshift (300) | Closing a story: al final vs en resumen; Saying how long you've been doing something: l…; Eating it all up: me comí toda la torta (+13) | Tomás finally reads all of Rosa's letters to Joaquín, never sent. |
| **u32 Advice and plans** ✓ | give advice at different levels of directness and talk about plans that depend on when things happen. | subj-influence (304), subj-cuando-future (307), subj-purpose-full (310) | Hoping with confidence: confío en que…; Proposing formally: te propongo que…; How hard to push: podríamos / deberíamos / ten… (+13) | A lawyer, Dra. Beatriz Uribe, gives them clear advice: if they find Joaquín or his heirs, the family can claim the building and Altamira's lease is worthless. |
| **u33 Looking for something** | describe exactly what I'm looking for, even when I don't know if it exists. | subj-relative (314), relatives-prepositions (317), cada-cualquier (320) | Saying how far away it is: queda a cinco cuadras; Just done: recién pintado, recién llegado; Full vs free: lleno / vacío vs libre / ocupado (+13) | The search begins. They are looking for anyone who knew a Joaquín Herrera who arrived in Santa Marta around 1978. |
| **u34 Mishaps** | explain an accident or a mishap, what got lost or broken, and ask for help. | se-accidental (324), possessive-dative (327), subj-perfect (330) | Charging and running out: se me descargó el ce…; Finding things in a state: encontré la puerta …; Getting something dirty: me manché la camisa (+8) | Everything goes wrong at once. Tomás's phone gets stolen on the bus, the espresso machine breaks again, Vale cuts her finger slicing guava, and someone throws a stone … |
| **u35 At the doctor** | explain symptoms, understand advice and instructions, and talk about rules. | por-para-2 (334), impersonal-obligation (337), deber-modal (340) | Early and late nights: me toca madrugar; Letting and advising with an infinitive: me pe…; Asking if they mind: ¿te importa si…? (+7) | Hernando collapses behind the chess table. At the clinic the doctor explains his heart problem in words Tomás has to ask her to repeat, and tells him to rest, eat less… |
| **u36 Work and money** ✓ | talk about money, prices and results, compare figures and draw conclusions. | passive-se (344), comparatives-advanced (347), consequence-connectors (350) | Counting on someone: cuento contigo; More than you'd think: más de lo que esperaba; Prices, distances and temperatures: ¿a cómo es… (+7) | Tomás and Vale go through the numbers: sales have doubled since the blogger's review, Vale's pastries are half the income, but the fines and the lawyer have eaten the … |
| **u37 Keeping a conversation going** | keep a conversation going: show interest, interrupt, check I understood and pass on messages. | questions-prepositions (354), reported-requests (357), indirect-questions (360) | Asking for someone on the phone: ¿podría habla…; Polite past: quería…, venía por…, ¿qué necesit…; Interrupting politely: perdona que te interrum… (+6) | Phone calls, messages and voice notes fly to the coast: a cousin of a friend of Hernando's knows a fisherman in Taganga whose grandfather was called Herrera. |
| **u38 In the news** | follow a news story, say what happened and why, and react to it. | passive-ser (364), causal-advanced (367), concession-despite (370) | Have you heard…? oír hablar de vs oír que; Finding out: enterarse de / ¿te enteraste?; Saying an event takes place: tuvo lugar, se re… (+5) | Mariana's investigation is published: Grupo Altamira bought six buildings in La Candelaria using permits signed by the same official, and two old houses were demolishe… |
| **u39 Joining ideas** | write a connected text with an introduction, a development and a conclusion. | infinitive-subject (374), discourse-structure (377), referring-back (380) | Hard to believe, easy to fix: difícil de + verb; Opening a talk: hoy les voy a hablar de… prime…; Closing a talk or text: para terminar, en resu… (+6) | The heritage committee asks for a written statement explaining why the café matters. |
| **u40 If things were different** ✓ | talk about imaginary situations and say what I would do. | imperfect-subj (384), si-hypothetical (387), como-si (390) | Dreaming of it: sueño con…, mi sueño es…; Giving the temperature: estamos a 30 grados; Humid vs wet: un clima húmedo, la ropa mojada | Tomás, Vale and Mariana travel to the Caribbean coast. Santa Marta is hot, slow and blindingly blue. |
| **u41 Wishes and regrets** | say what I wish were different and report what people asked me to do. | subj-past-triggers (394), ojala-past (397), reported-commands-past (400) | Would you mind if I…? ¿te importaría que + pas…; Gentle reproach: podrías haberme avisado; Toasting: brindo por…, ¡por los novios! (+2) | Yesid's grandmother tells them that Joaquín wished he had gone back to Bogotá, and that he asked her, before he died, to make sure the family made peace. |

## B2 — hypotheticals, register, argument

Units 42–51 · sessions 404–503 (100 sessions)

| Unit | Can-do | Grammar introduced (session) | Key patterns | Story beat |
|---|---|---|---|---|
| **u42 One thing, five ways** | make the same request at five levels of formality and know which one fits. | register-ladder (404), softening (409) | It's not necessary: no hace falta que… / no ti…; Offering to help: déjame que te ayude / permít…; Referring to a known matter: lo de… / ¿cómo va… (+18) | Now they need everyone: a notary who must be asked very formally, a judge's clerk who must be asked even more formally, Yesid who must be asked as a friend, and Altami… |
| **u43 What would have happened** | talk about what would have happened if things had gone differently, and hedge about what probably did. | pluperfect-subj (414), conditional-perfect (417), si-past-unreal (421) | It's a shame that…: es una lástima que / ¡qué …; Being let down or hurt: me decepcionó que… / m…; Having a hard (or great) time: la pasé muy mal (+17) | If Rosa had posted one of those letters, would Joaquín have come back? |
| **u44 Making the case** ✓ | argue a position with evidence, conditions and concessions. | subj-concessive (424), subj-conditions (427), argument-markers (431) | Asking views on an action: ¿qué opinas de que……; Evaluating something just mentioned: lo veo di…; Starting with the fact you're judging: que lo … (+19) | The public hearing at the heritage institute. Altamira's lawyers argue that the building is unsafe and has no value; Tomás, Yesid and the neighbours argue that it does… |
| **u45 The news** | follow and write a news report, including what is only alleged. | future-perfect (434), conditional-rumour (437), impersonal-register (441) | No idea: no tengo ni idea de…; Being informed: estar al tanto de… / estar inf…; Checking a claim: ¿es verdad eso de que…? / …,… (+19) | Mariana's source says that Altamira allegedly paid the suspended official; the official reportedly has left the country. |
| **u46 Who said what** | report a whole conversation accurately, and distance myself from what was said. | reported-speech-full (444), reporting-verbs-mood (447), subj-perception-negated (451) | Remembering: recuerdo X / me acuerdo de X; Insisting you haven't forgotten: no me he olvi…; Changing the subject: por cierto vs hablando de… (+19) | Vale discovers that Yesid had a meeting with Altamira, and confronts him. |
| **u47 Putting the weight where you want it** | move the emphasis in a sentence so my point lands where I want it. | cleft-focus (454), topic-fronting (457), lo-que-intensity (461) | What sets your mood: me pone de buen / mal genio; Pride and admiration: estoy orgullosa de ti / …; Surprise: me extraña que… / qué raro que… (+16) | Mariana records a podcast episode about the café: it was Rosa who kept the corner alive, it is the neighbours who are fighting for it, and what nobody expected is that… |
| **u48 Describing precisely** ✓ | describe objects, places and processes precisely in writing. | relatives-formal (464), participle-gerund-clauses (467), infinitive-perfect (471) | Commenting on the whole thing: …, lo que me mo…; Not repeating the noun in writing: el animal, …; Defining and classifying: se le llama… a… / se… (+17) | An architect surveys the 1920s building: adobe walls sixty centimetres thick, original tiles, a cracked beam caused by the vibrations of the demolition next door. |
| **u49 Formal writing** | write a formal letter: an application, a complaint and a request. | formal-letter-grammar (474), verbs-prepositions (479) | Weighing options in a report: entre las ventaj…; Talking about your abilities: se me da bien…, …; Giving something up, resigning: renunciar a… (+13) | Formal writing week: a complaint to the mayor's office about the demolition, an application for heritage protection, and a formal letter to Yesid's family proposing a … |
| **u50 Hard conversations** | handle a conversation where we want different things, and keep it civil. | subj-free-relatives (484), subj-future-in-past (487), que-wishes-commands (491) | Reproaching: ¿a qué esperas para…? / no entien…; Advising: lo mejor sería que… / si yo fuera tú…; Warnings, from 'watch out' to threats: ¡ojo co… (+17) | Vale gets an offer: an investor in Medellín will finance her own bakery. |
| **u51 Spanish beyond Colombia** | read Spanish from Spain and other countries, and understand vosotros and Spain's use of the past. | vosotros-recognition (494), spain-pasts (497), se-form-recognition (501) | Adapting: adaptarse al clima; Where it comes from: proviene de, tiene su ori… | Lucía, a food blogger from Madrid, visits with friends who say "vosotros", "vale" and "hoy he desayunado" every two sentences; Tomás realises he understands everything… |

## C1 — nuance, voice and variation

Units 52–60 · sessions 504–593 (90 sessions)

| Unit | Can-do | Grammar introduced (session) | Key patterns | Story beat |
|---|---|---|---|---|
| **u52 The whole verb system** ✓ | choose any tense or mood deliberately and explain why I chose it. | tense-modal-uses (506), mood-choice-fine (511) | Doing the whole thing: me comí un pollo entero…; Hooking the listener: no te imaginas lo que me…; That's your thing / I had my share: lo tuyo, p… (+10) | With Vale away, Hernando asks Tomás to help him write his memoir: fifty years of Bogotá from the front seat of a taxi and the corner table of a café. |
| **u53 Saying it without owning it** | report claims, rumours and other people's ideas without vouching for them. | hedging-distance (516), reformulation (521) | Correcting a statement vs fixing a thing: rect…; Fishing for confirmation: tengo entendido que…; Reporting with a verdict: me soltó que…, me re… (+21) | Rumours everywhere: that the café will close, that Altamira has a judge in his pocket, that Tomás is going back to Canada. |
| **u54 Irony and what's left unsaid** | use and catch irony, understatement and implied meaning. | emphatic-structures (526), wish-exclamatives (531) | Judging a person in one noun: es un lince, es …; Praise nobody could mean: ¡Qué detalle! / Grac…; Trailing off ironically: Sí, como viene tanto… (+21) | Altamira opens the hotel next door anyway, with a rooftop bar overlooking the café's patio. |
| **u55 Institutional Spanish** | read and write institutional and legal Spanish without sounding like a form. | cuyo-relatives (534), nominalisation (537), absolute-constructions (541) | Where the duty comes from: es mi obligación vs…; Just the minimum: basta con que firmes aquí; Institutional disapproval: condena rotundamente… (+21) | The heritage decision arrives: the building is protected. Now the family must formalise ownership: Tomás, Yesid and the descendants of Rosa and Joaquín create a cooper… |
| **u56 The essay** ✓ | write a sustained argumentative essay and defend it. | concessive-advanced (546), consecutive-advanced (551) | Foreseeing vs preventing: prever / prevenir; At the same time as (often in contrast): al ti…; Trends: va en aumento, se disparó, cayó en pic… (+21) | A city newspaper runs an essay competition on "La ciudad y la memoria". |
| **u57 Emotion at native pitch** | express complex emotions precisely: regret, resignation, relief, mixed feelings. | conditional-advanced (556), comparative-advanced-c1 (561) | Pulling through: salir adelante; Emotion through the body: se me partió el cora…; Who's the subject of the feeling: me sorprende… (+21) | Hernando dies in his sleep the week his memoir goes to print. |
| **u58 Precision** | describe the physical and temporal world with native precision. | temporal-advanced (564), agreement-tricky (567), ser-estar-c1 (571) | Picking up speed vs at full speed: agarrar vel…; Which way a place faces: la ventana da a la ca…; Anchoring a description: lo primero que llama … (+20) | The restoration begins: the cracked beam replaced, the original tiles cleaned, the jukebox repaired. |
| **u59 Voices of Colombia** | understand regional Colombian voices and adapt my own register to who I'm talking to. | voseo-recognition (576), future-subj-recognition (581) | Permission with a condition: sí, pero que no s…; Advising from a distance: lo más recomendable …; Reproaching what someone didn't do: ¡me hubier… (+12) | To celebrate, the group travels: Carnaval in Barranquilla with Yesid's family, a week in Medellín with Vale's, a night in a village in Boyacá where everyone says "sume… |
| **u60 A critical voice** ✓ | write and defend a critical review in my own voice. | word-order-style (586), evaluative-adverbs (591) | Approving what someone does: haces bien en…; The verdict line of a review: lo mejor de… es……; Signposting a talk: a lo largo de esta charla…… (+14) | La Esquina de Rosa reopens as a café and cultural space, with Hernando's book on the counter and Rosa's letters framed on the wall. |

## Where this map departs from SEQ and BLUEPRINT, and why

1. **Latin American past tenses (overrules SEQ).**
   - The preterite is the first and main past: it starts at session 29 and is used even for today (*Hoy fui al banco*). SEQ had the perfecto at day 33 and the indefinido at 60.
   - The imperfect of states comes at 48, the full imperfect at 96, and the contrast at 105, spread over two units and then re-drilled on every other review day to C1.
   - The perfecto arrives at 67, for experience, *ya / todavía no* and open situations only.
   - SEQ's perfecto/indefinido contrast lesson is replaced by `x:pret-perfecto-latam`. Spain's "today" past is recognition-only at u51 (`g:spain-pasts`).
2. **All three pasts are in A1, though the PCIC puts them at A2.** They are marked `teaching_choice` on the nodes, 48 grammar nodes in all. The plan asked for this so learners can tell a story by week 5. Chunks (*fui, comí, era, ¿ya comiste?*) carry the past from session 7.
3. **The future is taught through guessing.**
   - *Ir a* is the everyday future from session 25, unpacked from a session-6 chunk.
   - The *-ré* forms arrive at 184 through conjecture (*¿Dónde estará Simón?*), then promises and forecasts (186). SEQ taught them as a plain future at 175.
   - The conditional follows at 190. Its polite chunks (*me gustaría, ¿podría?*) are in use from session 3.
4. **The subjunctive comes at 194, not ~175.** It enters at the end of A2 with one trigger (*quiero que*) and the forms learners already know from usted commands. The PCIC places it at B1, so it is marked `teaching_choice`. It lands later than the plan's target because A1 now holds every past tense (A1 = 133 sessions, against SEQ's 107). The full set of triggers runs through B1 in BLUEPRINT's order: opinion/doubt, emotion, influence, *cuando*, relatives.
5. **The imperfect subjunctive and *si tuviera* close B1 (384–387).** SEQ had them at B1 day 238 and BLUEPRINT at B2. *Si hubiera…* comes at B2 (421).
6. **Commands follow Colombian usage.**
   - The usted and ustedes command (*siga, voltee, vengan*) is its own node at 117, right after tú commands (115). In Colombia usted is everyday, and directions to strangers use it.
   - Ustedes is the only plural taught. Vosotros is recognition-only at u51; voseo (paisa, Argentine) is recognition-only at u59.
7. **lo/la are standard.** All leísmo notes from SEQ and the old lessons are dropped.
8. **New grammar nodes not in SEQ:**
   - Colombian diminutives (*tintico, ahorita*)
   - *hace / desde hace / llevo* for "for"
   - softening (*¿será que…?*, the imperfect of politeness)
   - the register ladder
   - formal-letter grammar
   - reporting verbs and mood
9. **Numbers, telling the time and dates are patterns, not grammar.** They are lexico-grammatical frames, and moving them freed three Introduce slots in A1.
10. **Pronunciation is one A1 node.** `g:sounds-letters` (session 3) covers it, backed by one written sound tip per lesson. Intonation and prosody lessons were skipped, since the app has no listening.
11. **SEQ's day-1 irregular-verb chunks become a 50-chunk survival kit** spread over sessions 1–11. It covers identity, wants, every time frame, obligation, asking for help, linking and social formulas. 43 of the 50 name the grammar node that later unpacks them; the other 7 are pure social formulas.
12. **Nothing is shelved.**
    - SEQ made 125 lessons optional, including about 70 C1 notion lessons and 38 B2 notion lessons. Here every lesson was triaged on its own merits, and all but 10 feed at least one node.
    - The B1 emotion run keeps SEQ's four hubs as can-dos, but every emotion frame is its own pattern (*me da rabia que, me pone nervioso, estar harto de, no soporto que*).
13. **BLUEPRINT's AI chat and outside-listening pieces are replaced** by scripted scenes (108 of them) and graded story chapters (219), per the standing decision.
14. **Fewer grammar nodes than the brief's 200–250.** There are 172, and the cause is the rhythm rules: one point per Introduce day, never on consecutive days, each followed by a Drill. Within those rules, 9–10-session units hold three points, and B2/C1 hold two or three. Finer distinctions live as patterns: 640 of them, over the 400–600 target, because every frame that teaches something was kept. See the decisions below.
15. **Some A2 Patterns days became Input days.** In u18, u20, u21, u23 and u25 the miners found fewer than two A2 frames, so those days carry more story and more words instead. A2 is chunk-heavy (92 chunks), and that is where its formulas live.

## Per-node notion triage

Every one of the 798 old lessons was triaged individually, by reading it, never by its strand or title:

| Verdict | Lessons |
|---|---|
| patterns | 220 |
| function (frames + a can-do) | 213 |
| mixed (frames + a word list) | 116 |
| duplicate (covered by a grammar node or another lesson) | 64 |
| task | 63 |
| genre | 55 |
| chunks | 47 |
| skip (terminology or prosody only) | 13 |
| wordlist | 7 |

**The notion strand alone (189 lessons):**
- 78 lessons are patterns and 101 are mixed.
- 3 are duplicates and 1 is chunks.
- **6 are pure word lists:** C1 colour, smell, matter, shapes, types of movement and duration. These are the only lessons that feed no node; they become vocab themes.
- **Patterns kept from notion lessons: 235, plus 89 chunks.** That is against 113 word-list themes passed to the vocab rebuild.
- The B2 notion run that SEQ made optional, including the physical-property lessons, produced patterns from every single lesson. Examples: *ser de + material*, *húmedo / mojado*, *medir / pesar + cantidad*, *oler a / saber a*, *tener forma de*.

**Lessons that feed no node (10):**
- the 6 C1 word lists above
- fn-silencio-a1
- dc-deixis-b1 (terminology)
- dc-mantenimiento-referente-c1 (covered by `g:referring-back`)
- gr-nucleo-verbal-tipos-a2 (terminology)

**Peninsular conversions made during mining** (sample):
- vale → *listo / de una*
- coger → *tomar*
- apetecer → *tener ganas de / ¿te provoca?*
- enfadarse → *enojarse / estar bravo*
- echar de menos → *extrañar*
- ¿dígame? → *¿aló?*
- estar tirado → *estar regalado*
- ser un hacha → *ser un duro / un crack*
- importar un pimiento → *importar un comino*
- cola → *fila*
- entradas → *boletas*

About 15 Spain-only idioms with no Latin American equivalent were dropped. Each one is named in its lesson's triage note.

## Decisions for Matthew

1. **Grammar density: 172 nodes or ~210?** Reaching the brief's 200–250 means putting four Introduce days into some A2/B1 units (I-D-I-D-In-I-D-I-D-O). That is denser than BLUEPRINT's two a week. I recommend keeping 172 and letting patterns carry the fine grain.
2. **A1 runs to 133 sessions**, about 19 weeks at one session a day, against the ~16-week target. It is long because the past tenses moved in. The simulator's "do another" rate decides whether this is acceptable. If not, the cheapest cut is the six A1 Patterns days (u05, u07, u09, u10, u12, u13): fold them into neighbouring days, saving 6 sessions.
3. **When the subjunctive starts:** the end of A2 (194, as mapped) or the opening of B1 (264, matching the PCIC)?
4. **Volume:** 640 patterns and 94 contrasts, both over target. Trim to about 550 by merging second-tier B2/C1 formal and emotion frames, or keep them all?
5. **The story:** Don Hernando dies in u57 (C1, "Emotion at native pitch"), the week his memoir goes to print. Tomás and Vale are a slow burn: an almost-kiss at u40, a fight at u50, and only a hint at u60. Are both OK?
6. **Colombian items flagged by the miners for a native check:**
   - *de pronto* (= maybe)
   - *correr la cita*
   - *alcanzar a + infinitive*
   - *me toca*
   - *ser un duro*
   - *todero*
   - *manos de mantequilla*
   - *la pasamos delicioso*
   - *déjame te ayudo* (recognition only)
   - *me cayó muy mal que…*
   - *donde el diablo perdió el poncho* (more Andean; *la Cochinchina* is also given)
