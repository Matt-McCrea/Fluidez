# Research brief: restructure the Fluidez Spanish course

*Paste this whole document into a new Claude chat with web search / research
turned on. The course tables are at the end.*

---

## Your task

I'm building **Fluidez**, a self-study Spanish app that takes an English-speaking
adult from zero to C1. I need you to research how a course like this should be
sequenced, then restructure the current course using what you find. The goal is
a defensible answer to one question for every lesson: **when should this be
taught, and should it be taught at all?**

Please do real research before restructuring. Search the literature and
well-regarded teaching resources, and cite what you use with links. Separate
what has strong evidence behind it from what is convention, and say so when
you are not sure. Don't invent citations.

## What the app is

- **Format.** One structured session a day: review (spaced repetition), one
  lesson, a short reading, a gap-fill exercise, and a writing task. About 15
  minutes a day at A1, rising to about 30 at B2 and above. A learner can take
  more than one lesson a day if they want.
- **Learner.** An English-speaking adult beginner, studying alone, motivated
  and intelligent. They should get grammar tools early and use them, rather
  than memorise phrases for months without knowing how the language works.
- **Variety.** Peninsular Spanish (teaches *vosotros*).
- **How the course is built.** The syllabus was generated from the Plan
  Curricular del Instituto Cervantes (PCIC). Most lessons map to PCIC inventory
  items: grammar, functions (*funciones*), general notions (*nociones
  generales*), pragmatic tactics (*tácticas pragmáticas*) and genres (*géneros
  discursivos*). There are also *verb days* (meet five new verbs), *practice
  days* (no new content) and *tasks* (a real-world activity that pulls a unit
  together).
- **Current size.** 663 course days: 573 lessons, 28 verb days and 62 practice
  days. A1 is days 0–106, A2 107–187, B1 188–352, B2 353–491, C1 492–662.
  There are also 12 optional "deep" units (67 lessons) offered when a learner
  struggles, and 34 written lessons not placed anywhere.
- **Content gating.** Readings and exercises are filtered by which tenses the
  learner has been taught, so moving a tense earlier unlocks material earlier.
  Moving a lesson earlier may also mean its examples need rewriting if they use
  grammar not yet taught.

## What we already think is wrong

1. **Core grammar arrives far too late.** Noun gender and articles are fully
   taught only by day 99; the irregular and stem-changing present (*quiero,
   puedo*) at day 179; *se lo* at day 304. The last of the main tenses lands on
   day 342.
2. **The PCIC was followed too literally.** Many lessons are one PCIC inventory
   line each, so they bundle unrelated points or cover tiny ones. There are 17
   separate emotion lessons at B1, and about 60 C1 lessons that are idiom lists
   per PCIC notion (texture, smell, weight, shape…).
3. **Beginner lessons are overloaded** with unrelated topics in one lesson
   (time, days of the week, parts of the day, frequency adverbs and double
   negatives in one A1 lesson), while B1+ lessons ask for almost no written
   production.

## Our draft target: the grammar spine

This is a first proposal, not settled. Please challenge it with evidence.

| Tool | Draft target day | Day taught now |
|---|---|---|
| Present tense, regular verbs | 3 | 3 |
| Ser and estar | 5 | 5 |
| Gender, articles, plurals | 6 | 99 |
| Adjective agreement | 8 | 52 |
| Questions and negation | 8 | 11 |
| Irregular and stem-changing present | 12 | 179 |
| *Gustar* and verbs like it | 15 | 33 |
| *Ir a* + infinitive | 15 | no lesson |
| Reflexive verbs | 18 | 75 |
| Possessives and demonstratives | 20 | 57 |
| Direct object pronouns, personal *a* | 25 | 121 |
| Preterite | 30 | 46 |
| Imperfect | 40 | 107 |
| Preterite vs imperfect | 45 | 113 |
| Indirect object pronouns, *se lo* | 50 | 304 |
| Present perfect | 50 | 69 |
| Affirmative commands | 55 | 126 |
| Comparatives; *por* and *para* | 60 | 159 |
| Present subjunctive | 80 | 188 |
| Future and conditional | 90 | 217 |
| Negative commands; relative clauses | 100 | 297 |
| Imperfect subjunctive, compound tenses | 130 | 342 |

One open question: in Spain the present perfect is the everyday past for
"today" and recent events, and several Spain-based courses teach it before the
preterite. Should Fluidez?

## What to research

Cover at least these, and add anything else that matters:

1. **Explicit grammar instruction for adults.** How strong is the evidence that
   explicit instruction speeds adult learning (e.g. the Norris & Ortega and
   Spada & Tomita meta-analyses, and later work)? What does it say about how
   early, and in what form?
2. **Acquisition order and processability.** What do developmental-sequence
   studies and Processability Theory say about the order learners of Spanish
   acquire structures in (ser/estar, object pronouns, past tenses, subjunctive),
   and does teaching order need to follow it?
3. **Frequency.** Which structures and verbs carry the most weight in real
   Spanish (e.g. corpus-based frequency dictionaries)? Use this to rank what
   must come first.
4. **How established courses sequence it.** Compare the order of major
   Spanish-as-a-foreign-language courses and textbooks: Spain-based (Aula
   Internacional, Gente, Nuevo Prisma, Español en marcha) and widely used
   university courses. Where do they agree, and where do they differ?
5. **Formulaic language.** What role should fixed phrases play in the first
   weeks, and when should they be unpacked into grammar?
6. **Spacing, interleaving and review.** How far apart should related grammar
   points sit, and how often should they come back?
7. **Hours and levels.** Typical guided learning hours to reach A1, A2, B1, B2
   and C1, and what that implies for a 15–30 minute daily course.
8. **The PCIC itself.** How the Instituto Cervantes intends the PCIC inventories
   to be used. Is it meant as a teaching sequence or a reference? What do
   course designers take from it?

## What I want back

1. **Research summary** (about one page): the findings that should drive the
   structure, each with its source and how strong the evidence is.
2. **A revised grammar spine**: every core tool with a recommended target day
   (or day range), the reason, and what changed from our draft.
3. **The restructured course**, as a table covering every lesson in the
   inventory below, with these columns:
   `lesson id | action | new day (or range) | new unit | reason`
   where action is one of: keep, move, merge (into which id), split (into
   what), make optional, cut. Keep the existing lesson ids so the result can be
   applied to the code. Put the full table in one CSV code block at the end so
   I can copy it.
4. **New lessons needed**: anything missing (for example *ir a* + infinitive,
   *estar* + gerund early, *tener que*), each with a suggested id, title,
   target day and one line on what it teaches.
5. **Unit structure**: the new units for A1 and A2 at least, with a theme and
   can-do goal for each, and where verb and practice days fall.
6. **Risks**: what breaks when lessons move earlier (examples using untaught
   grammar, readings that unlock too early), and what to check.

Ratings in the inventory below ("Place" and "Imp.") are my own quick
judgements, not research. Treat them as a starting point to verify or overrule.

**Place**: ok · ↑ earlier · ↓ later · merge · cut/optional.
**Imp.** (importance): 5 core (grammar spine or survival) · 4 high value ·
3 useful · 2 niche at this band · 1 low.
**PCIC refs**: which PCIC inventory the lesson was built from and at which
level, with the number of inventory items (func = funciones, noc = nociones
generales, gram = gramática, tact = tácticas pragmáticas, gen = géneros
discursivos). **Divergence**: the PCIC puts these items at a different level
from where the course teaches them.

---

## Inventory 1: the units, in course order

| Unit | Band | Starts day | Title | Goal |
|---|---|---|---|---|
| a1-u01 | A1 | 0 | Meet someone | I can greet someone, say who I am and where I am from, and ask them the same. |
| a1-u02 | A1 | 11 | Ask a question | I can ask for a name, a place, a price and a repeat — and say when I have not understood. |
| a1-u03 | A1 | 19 | Be polite | I can apologise, agree, disagree, and choose between tú and usted. |
| a1-u04 | A1 | 26 | Numbers, time and money | I can say how many, what time, what day and how much. |
| a1-u05 | A1 | 33 | Say what you like | I can say what I like and hate, and react to what someone else likes. |
| a1-u06 | A1 | 40 | Order and buy | I can order food and drink, buy something and pay for it. |
| a2-u14 | A1 | 46 | Tell me what happened | I can say what happened, in order, in the past. |
| a1-u07 | A1 | 52 | Describe people and things | I can describe a person, a place or an object so that someone recognises it. |
| a1-u08 | A1 | 62 | Where things are | I can say where something is and give directions to it. |
| a2-u17 | A1 | 69 | Have you ever…? | I can talk about experience — what I have and have not done. |
| a1-u09 | A1 | 75 | Your day | I can describe my daily routine and say how often I do things. |
| a1-u10 | A1 | 82 | Want, need, ask for | I can say what I want, what I need and what I have to do — and ask for help. |
| a1-u11 | A1 | 88 | Join it up | I can join short sentences so I sound connected rather than chopped up. |
| a1-u12 | A1 | 95 | The words behind the words | I understand why Spanish nouns have a gender, and I can find my own agreement mistakes. |
| a1-u13 | A1 | 102 | Everyday writing | I can write the short texts people actually send. |
| a2-u15 | A2 | 107 | How things used to be | I can describe how things were and what I used to do. |
| a2-u16 | A2 | 113 | Telling a story | I can tell an anecdote with both a background and a sequence of events. |
| a2-u18 | A2 | 119 | It, him, her, them | I can stop repeating the noun. |
| a2-u19 | A2 | 126 | Asking nicely | I can make the same request from blunt to very polite, and refuse without offence. |
| a2-u20 | A2 | 134 | How are you feeling? | I can react to good and bad news the way a person actually does. |
| a2-u21 | A2 | 141 | Comparing | I can compare two things and justify which I would pick. |
| a2-u22 | A2 | 148 | Getting things done | I can handle a phone call, a shop and a desk — including when something is wrong. |
| a2-u23 | A2 | 157 | Reasons and conditions | I can explain why I did something and what would have changed it. |
| a2-u24 | A2 | 165 | Getting around | I can guide someone through a place and describe what is there. |
| a2-u25 | A2 | 172 | Writing it down | I can write at paragraph length — a review and a semi-formal email. |
| a2-u26 | A2 | 179 | The grammar under it | I understand the machinery behind what I have been writing, and can correct my own work. |
| b1-u27 | B1 | 188 | What I think | I can state an opinion and say what I do NOT think. |
| b1-u28 | B1 | 196 | Agreeing and arguing | I can disagree without it becoming a row. |
| b1-u29 | B1 | 205 | Plans and predictions | I can talk about the future and guess about the present. |
| b1-u30 | B1 | 217 | Advice and what I would do | I can advise someone at three levels of directness. |
| b1-u31 | B1 | 225 | What I want from you | I can say what I want someone else to do. |
| b1-u32 | B1 | 233 | Asking, refusing, forbidding | I can ask at four levels, refuse without offence, and forbid clearly. |
| b1-u33 | B1 | 243 | Good feelings | I can express pleasure, pride and affection at the right intensity. |
| b1-u34 | B1 | 252 | When it goes wrong | I can express anger, worry and indifference — and calm someone else down. |
| b1-u35 | B1 | 263 | Likes and how you are | I can talk about liking what other people do, and how I am feeling. |
| b1-u36 | B1 | 274 | Telling a longer story | I can tell a story that reaches back before its own beginning. |
| b1-u37 | B1 | 285 | Holding a conversation | I can keep a long conversation going without taking it over. |
| b1-u38 | B1 | 297 | Describing at length | I can sustain a description for a paragraph. |
| b1-u39 | B1 | 310 | Joining ideas up | I can link ideas by cause, result, concession and comparison. |
| b1-u40 | B1 | 319 | Courtesy and celebrations | I can handle the social moments where the formula is visible. |
| b1-u41 | B1 | 330 | Writing at length | I can write a composition with a thesis, a development and a conclusion. |
| b1-u42 | B1 | 339 | If things had been different | I can talk about what is not the case, and what would have been. |
| b1-u43 | B1 | 346 | Describing the physical world | I can describe an object precisely — its size, shape, material, state and whether it is available. |
| b2-u44 | B2 | 353 | The register ladder | I can say the same thing in five registers and know which room each belongs to. |
| b2-u45 | B2 | 363 | Building an argument | I can argue a case with evidence, a counter-argument and a reservation. |
| b2-u46 | B2 | 374 | What would have happened | I can talk about what did not happen, and hedge about what probably did. |
| b2-u47 | B2 | 385 | Emotion, measured | I can express emotion with precision rather than volume. |
| b2-u48 | B2 | 397 | Reading the news | I can follow journalistic Spanish and say what I make of it. |
| b2-u49 | B2 | 410 | Reporting what people said | I can report speech and let my choice of verb carry my judgement. |
| b2-u50 | B2 | 422 | Putting the weight where you want it | I can move the emphasis in a sentence without changing the words. |
| b2-u51 | B2 | 433 | Describing precisely | I can describe properties, quantities and processes exactly. |
| b2-u52 | B2 | 449 | Formal writing | I can write a formal letter that reads as formal rather than pompous. |
| b2-u53 | B2 | 462 | Difficult conversations | I can manage a conversation where we want different things. |
| b2-u54 | B2 | 475 | The band in review | I can take my own writing up and down the register ladder. |
| c1-u55 | C1 | 492 | Idiom and the body | I can tell a story entirely in idiom, the way a native would. |
| c1-u56 | C1 | 508 | Irony and implicature | I can say the opposite of what I mean, and hear it done to me. |
| c1-u57 | C1 | 520 | Saying it without owning it | I can criticise firmly without attributing the criticism to myself. |
| c1-u58 | C1 | 535 | Institutional Spanish | I can write in institutional register without sounding like a form. |
| c1-u59 | C1 | 551 | The whole verb system at once | I can choose any tense or mood deliberately and say why. |
| c1-u60 | C1 | 568 | Emotion at native pitch | I can express an emotion that has no single word for it. |
| c1-u61 | C1 | 584 | The argumentative essay | I can sustain an argument for a thousand words. |
| c1-u62 | C1 | 603 | Precision | I can describe the physical and temporal world the way a native writer does. |
| c1-u63 | C1 | 637 | A critical voice | I can judge something in public, in my own voice. |

## Inventory 2: every course day, in order

Verb days and practice days are included so the day numbers line up.

| Day | Band | Unit | Lesson id | Title | Strand | PCIC refs | Divergence | Place | Imp. | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | A1 | a1-u01 | dlg-presentarse | Dos personas se conocen | dialogue |  |  | ok | 5 | model lesson |
| 1 | A1 | a1-u01 | gr-sonidos-a1 | Los sonidos: cinco vocales y nada más | grammar |  |  | ok | 4 | pronunciation; keep short |
| 2 | A1 | a1-u01 |  | Verb day: ser, estar, llamarse, tener, haber | verbs |  |  |  |  |  |
| 3 | A1 | a1-u01 | presente | Presente (Present) | tense |  |  | ok | 5 |  |
| 4 | A1 | a1-u01 | fn-responder-saludo-a2 | Saludar: en persona y por escrito | function | func A2×7 | PCIC A2 → taught A1 | ↑ earlier | 5 | greetings belong on day 0-1 |
| 5 | A1 | a1-u01 | ser-estar | Ser vs. Estar | concept |  |  | ok | 5 |  |
| 6 | A1 | a1-u01 | nt-origen-a1 | De dónde eres y cuántos años tienes | notion | noc A1×7 |  | ok | 5 | name/age/origin: survival |
| 7 | A1 | a1-u01 | fn-identificar-a1 | Identificar: qué es y quién es | function | func A1×10 |  | ok | 4 |  |
| 8 | A1 | a1-u01 | fn-agradecer-a1 | Dar las gracias | function |  |  | ↑ earlier | 5 | thanks belongs in week 1 |
| 9 | A1 | a1-u01 | fn-establecer-comunicacion-a1 | Empezar y terminar una conversación | function | func A1×12 |  | ok | 4 |  |
| 10 | A1 | a1-u01 | task-presentarse | Preséntate | task |  |  | ok | 4 |  |
| 11 | A1 | a1-u02 | gr-interrogativos-a1 | Los interrogativos: qué, quién, cuánto, dónde, cómo | grammar | gram A1×8 |  | ok | 5 | question words: spine target day 8 |
| 12 | A1 | a1-u02 | gr-acentuacion-a1 | El acento: dónde cae la fuerza y cuándo se escribe | grammar |  |  | merge | 2 | merge stress/written accent into sounds lesson; reading-aloud aid, not grammar |
| 13 | A1 | a1-u02 |  | Verb day: querer, poder, ir, hacer, dar | verbs |  |  |  |  |  |
| 14 | A1 | a1-u02 | dc-entonacion-a1 | La entonación y la cortesía | discourse | tact A1×9 |  | merge | 2 | merge intonation into question-words lesson |
| 15 | A1 | a1-u02 | gr-pronombre-sujeto-a1 | Los pronombres sujeto | grammar | gram A1×5 |  | ok | 4 |  |
| 16 | A1 | a1-u02 |  | Practice day | practice |  |  |  |  |  |
| 17 | A1 | a1-u02 | fn-pedir-informacion-a1 | Pedir y dar información | function | func A1×13 |  | ok | 4 |  |
| 18 | A1 | a1-u02 | task-preguntar | Pregunta cinco cosas | task |  |  | ok | 3 |  |
| 19 | A1 | a1-u03 | fn-dirigirse-a1 | Dirigirse a alguien y responder | function | func A1×7 |  | ok | 4 | tú/usted |
| 20 | A1 | a1-u03 |  | Verb day: saber, conocer, ver, decir, poner | verbs |  |  |  |  |  |
| 21 | A1 | a1-u03 | fn-disculparse-a2 | Disculparse | function | func A2×3 | PCIC A2 → taught A1 | ↑ earlier | 4 | sorry/perdón is week-1 survival |
| 22 | A1 | a1-u03 | fn-acuerdo-a1 | Acuerdo y desacuerdo | function | func A1×6 |  | ok | 3 |  |
| 23 | A1 | a1-u03 |  | Practice day | practice |  |  |  |  |  |
| 24 | A1 | a1-u03 | gr-adverbios-afirmacion-negacion-a1 | Sí, no, también, tampoco | grammar | gram A1×3 |  | ↑ earlier | 5 | negation: spine target day 8 |
| 25 | A1 | a1-u03 | task-cortesia | La misma petición, tres veces | task |  |  | ok | 3 |  |
| 26 | A1 | a1-u04 | nt-cantidad-numerica-a1 | Cantidad: números, más y menos | notion | noc A1×9 |  | ok | 5 | numbers |
| 27 | A1 | a1-u04 | gr-numerales-a1 | Los numerales: cardinales y ordinales | grammar | gram A1×4 |  | merge | 3 | merge with numbers lesson (day 26) |
| 28 | A1 | a1-u04 |  | Verb day: hablar, trabajar, vivir, llamar, quedar | verbs |  |  |  |  |  |
| 29 | A1 | a1-u04 | nt-referencias-generales-a1 | La hora, los días y la frecuencia | notion | noc A1×14 |  | ok | 5 | split: time / days / frequency are three lessons |
| 30 | A1 | a1-u04 |  | Practice day | practice |  |  |  |  |  |
| 31 | A1 | a1-u04 | nt-valor-precio-a1 | Precio y tamaño | notion | noc A1×6 |  | ok | 5 | prices: survival |
| 32 | A1 | a1-u04 | task-quedar | Queda con alguien | task |  |  | ok | 3 |  |
| 33 | A1 | a1-u05 | gr-verbos-predicativos-tipos-a2 | Verbos que funcionan al revés: encantar, doler | grammar | gram A2×3 | PCIC A2 → taught A1 | ↑ earlier | 5 | gustar: spine target day 15 |
| 34 | A1 | a1-u05 | fn-preguntar-gustos-a2 | Preguntar y expresar gustos | function | func A2×11 | PCIC A2 → taught A1 | merge | 4 | merge with gustar lesson (day 33) |
| 35 | A1 | a1-u05 |  | Verb day: comer, beber, comprar, necesitar, esperar | verbs |  |  |  |  |  |
| 36 | A1 | a1-u05 | nt-evaluacion-general-a1 | Bueno, malo y los colores | notion | noc A1×7 |  | ok | 4 |  |
| 37 | A1 | a1-u05 |  | Practice day | practice |  |  |  |  |  |
| 38 | A1 | a1-u05 | fn-valorar-a1 | Valorar y hablar de lo que haces | function | func A1×8 |  | cut/optional | 2 | thin; overlaps day 36 |
| 39 | A1 | a1-u05 | task-gustos | Cinco cosas que te gustan | task |  |  | ok | 3 |  |
| 40 | A1 | a1-u06 | gn-conversacion-transaccional-a1 | La conversación transaccional: comprar algo | genre | gen A1×13 |  | ok | 4 | buying things |
| 41 | A1 | a1-u06 | gr-articulo-indefinido-a1 | El artículo indefinido: un, una, unos, unas | grammar | gram A1×4 |  | ↑ earlier | 5 | articles: spine target day 6 |
| 42 | A1 | a1-u06 |  | Verb day: venir, salir, volver, empezar, terminar | verbs |  |  |  |  |  |
| 43 | A1 | a1-u06 | nt-existencia-a1 | Hay, está, y entrar o salir | notion | noc A1×7 |  | ↑ earlier | 5 | hay: very early survival |
| 44 | A1 | a1-u06 |  | Practice day | practice |  |  |  |  |  |
| 45 | A1 | a1-u06 | task-cafe | Pide en un café | task |  |  | ok | 4 |  |
| 46 | A1 | a2-u14 | preterito | El pretérito indefinido: qué pasó y cuándo | tense | gram A2×6 | PCIC A2 → taught A1 | ↑ earlier | 5 | preterite: spine target day 30 |
| 47 | A1 | a2-u14 |  | Verb day: mejorar, empeorar, aumentar, evitar, crear | verbs |  |  |  |  |  |
| 48 | A1 | a2-u14 | dc-deixis-temporal-a2 | Deixis temporal y el hilo del relato | discourse | tact A2×7 | PCIC A2 → taught A1 | ↓ later | 2 | temporal deixis is a discourse topic; A2+ |
| 49 | A1 | a2-u14 | nt-expresion-verbal-a2 | Expresión verbal: preguntar, contestar, decir | notion | noc A2×4 | PCIC A2 → taught A1 | ↓ later | 2 | speech verbs beyond decir: B1 |
| 50 | A1 | a2-u14 |  | Practice day | practice |  |  |  |  |  |
| 51 | A1 | a2-u14 | task-a2-ayer | Cuenta qué hiciste el fin de semana | task |  |  | ok | 4 |  |
| 52 | A1 | a1-u07 | gr-genero-adjetivo-a1 | El género del adjetivo | grammar | gram A1×4 |  | ↑ earlier | 5 | adjective agreement: spine target day 8 |
| 53 | A1 | a1-u07 | gr-adjetivos-calificativos-a1 | Adjetivos calificativos | grammar | gram A1×3 |  | merge | 3 | merge with day 52 |
| 54 | A1 | a1-u07 |  | Verb day: entrar, pasar, llevar, tomar, dejar | verbs |  |  |  |  |  |
| 55 | A1 | a1-u07 | gr-posesivos-forma-a1 | Los posesivos: mi, tu, su y dónde van | grammar | gram A1×8 |  | ↑ earlier | 5 | possessives: spine target day 20 |
| 56 | A1 | a1-u07 |  | Practice day | practice |  |  |  |  |  |
| 57 | A1 | a1-u07 | gr-demostrativos-distribucion-a1 | Los demostrativos: este, ese, aquel — y dónde van | grammar | gram A1×7 |  | ↑ earlier | 4 | demonstratives: spine target day 20 |
| 58 | A1 | a1-u07 | nt-familia-a1 | La familia: quién es quién | notion |  |  | ↑ earlier | 5 | family: classic week-2 topic |
| 59 | A1 | a1-u07 | gn-describir-persona-a1 | Describir a una persona | genre | gen A1×8 |  | ok | 4 |  |
| 60 | A1 | a1-u07 | gn-describir-objeto-a1 | Describir un objeto | genre | gen A1×7 |  | ok | 3 |  |
| 61 | A1 | a1-u07 | task-describir | Describe a alguien hasta que lo adivinen | task |  |  | ok | 3 |  |
| 62 | A1 | a1-u08 | nt-localizacion-a1 | Dónde están las cosas | notion | noc A1×10 |  | ok | 4 |  |
| 63 | A1 | a1-u08 | dc-deixis-espacial-a1 | Esto, eso y el orden de la información | discourse | tact A1×10 |  | merge | 3 | aquí/ahí/allí + ir/venir: merge with location (62) and directions (65) |
| 64 | A1 | a1-u08 |  | Verb day: mirar, escuchar, ayudar, usar, estudiar | verbs |  |  |  |  |  |
| 65 | A1 | a1-u08 | nt-movimiento-estabilidad-a1 | Ir, venir y dar direcciones | notion | noc A1×9 |  | ok | 4 |  |
| 66 | A1 | a1-u08 |  | Practice day | practice |  |  |  |  |  |
| 67 | A1 | a1-u08 | gn-describir-lugar-a1 | Describir un lugar | genre | gen A1×6 |  | ok | 3 |  |
| 68 | A1 | a1-u08 | task-direcciones | Lleva a alguien hasta allí | task |  |  | ok | 3 |  |
| 69 | A1 | a2-u17 | gr-preterito-perfecto-a2 | El pretérito perfecto: haber + participio | grammar | gram A2×9 | PCIC A2 → taught A1 | ↑ earlier | 5 | present perfect: Peninsular default for today/recent past; many Spain-based courses teach it before the preterite |
| 70 | A1 | a2-u17 |  | Verb day: imaginar, dudar, notar, observar, comparar | verbs |  |  |  |  |  |
| 71 | A1 | a2-u17 | nt-anterioridad-a2 | Ya, todavía no, y el principio y el fin | notion | noc A2×9 | PCIC A2 → taught A1 | ok | 3 | ya / todavía no |
| 72 | A1 | a2-u17 | nt-existencia-inexistencia-a2 | Nacer, morir y las edades | notion | noc A2×7 | PCIC A2 → taught A1 | ↓ later | 2 | born/died/ages is niche at A1 |
| 73 | A1 | a2-u17 |  | Practice day | practice |  |  |  |  |  |
| 74 | A1 | a2-u17 | task-a2-experiencia | ¿Alguna vez has…? | task |  |  | ok | 4 |  |
| 75 | A1 | a1-u09 | gr-pronombre-se-a1 | El pronombre se: usos reflexivos | grammar | gram A1×4 |  | ↑ earlier | 5 | reflexives: spine target day 18 |
| 76 | A1 | a1-u09 | gr-presente-indicativo-valores-a1 | El presente: de qué habla realmente | grammar | gram A1×6 |  | merge | 2 | uses of the present: fold into presente (day 3) |
| 77 | A1 | a1-u09 |  | Verb day: preguntar, contestar, cocinar, lavar, limpiar | verbs |  |  |  |  |  |
| 78 | A1 | a1-u09 | gr-adverbios-lugar-tiempo-cantidad-a1 | Adverbios de lugar, tiempo y cantidad | grammar | gram A1×9 |  | ok | 3 |  |
| 79 | A1 | a1-u09 |  | Practice day | practice |  |  |  |  |  |
| 80 | A1 | a1-u09 | nt-duracion-transcurso-a1 | Antes, después y cuándo pasa | notion | noc A1×11 |  | ok | 4 |  |
| 81 | A1 | a1-u09 | task-rutina | Cuenta un día entero | task |  |  | ok | 4 | daily routine: pair with reflexives |
| 82 | A1 | a1-u10 | gr-infinitivo-usos-a1 | El infinitivo: cuándo se usa solo | grammar | gram A1×6 |  | ↑ earlier | 5 | querer/poder/tener que + infinitive: core toolkit; ir a + infinitive belongs here too |
| 83 | A1 | a1-u10 | gr-oraciones-finales-a1 | Oraciones finales: para + infinitivo | grammar | gram A1×8 |  | ok | 3 |  |
| 84 | A1 | a1-u10 |  | Verb day: ordenar, preparar, cuidar, aprender, subir | verbs |  |  |  |  |  |
| 85 | A1 | a1-u10 | fn-corregir-informacion-a1 | Corregir y decir que no sabes | function | func A1×9 |  | ok | 3 |  |
| 86 | A1 | a1-u10 |  | Practice day | practice |  |  |  |  |  |
| 87 | A1 | a1-u10 | task-pedir | Pide tres favores | task |  |  | ok | 4 |  |
| 88 | A1 | a1-u11 | dc-conectores-a1 | Conectores y negación | discourse | tact A1×10 |  | ↑ earlier | 5 | y / pero / porque: needed from week 2 |
| 89 | A1 | a1-u11 | gr-relativo-que-a1 | El relativo que: una palabra, tres trabajos | grammar | gram A1×11 |  | ok | 3 |  |
| 90 | A1 | a1-u11 |  | Verb day: bajar, correr, caminar, viajar, visitar | verbs |  |  |  |  |  |
| 91 | A1 | a1-u11 | gr-objeto-directo-a1 | La a personal: Veo a María | grammar | gram A1×3 |  | ↑ earlier | 3 | personal a: teach with lo/la (spine day 25) |
| 92 | A1 | a1-u11 |  | Practice day | practice |  |  |  |  |  |
| 93 | A1 | a1-u11 | gr-cuantificadores-no-universales-a1 | Poco y mucho | grammar | gram A1×3 |  | ok | 3 |  |
| 94 | A1 | a1-u11 | task-contar | Une las frases | task |  |  | ok | 3 |  |
| 95 | A1 | a1-u12 | gender-articles | Gender & articles | concept |  |  | ↑ earlier | 5 | gender & articles: spine target day 6 |
| 96 | A1 | a1-u12 | gr-genero-sustantivos-a1 | El género de los sustantivos | grammar | gram A1×5 |  | ↑ earlier | 5 | noun gender: merge with day 95, move to week 1 |
| 97 | A1 | a1-u12 |  | Verb day: invitar, cantar, bailar, nadar, cambiar | verbs |  |  |  |  |  |
| 98 | A1 | a1-u12 | gr-numero-sustantivos-a1 | El plural de los sustantivos | grammar | gram A1×5 |  | ↑ earlier | 5 | plurals: week 1 |
| 99 | A1 | a1-u12 | gr-articulo-definido-a1 | El artículo definido: distribución | grammar | gram A1×6 |  | ↑ earlier | 4 | definite article use: week 2 |
| 100 | A1 | a1-u12 |  | Practice day | practice |  |  |  |  |  |
| 101 | A1 | a1-u12 | task-revisar | Corrige tu propio español | task |  |  | ok | 3 |  |
| 102 | A1 | a1-u13 | gn-generos-escritos-a1 | Textos breves de cada día | genre | gen A1×7 |  | ok | 3 |  |
| 103 | A1 | a1-u13 |  | Verb day: ganar, gastar, ahorrar, firmar, reservar | verbs |  |  |  |  |  |
| 104 | A1 | a1-u13 |  | Verb day: alquilar, olvidar, explicar, enseñar, aceptar | verbs |  |  |  |  |  |
| 105 | A1 | a1-u13 |  | Practice day | practice |  |  |  |  |  |
| 106 | A1 | a1-u13 | task-escribir | Escribe cuatro textos breves | task |  |  | ok | 3 |  |
| 107 | A2 | a2-u15 | imperfecto | El pretérito imperfecto: cómo era y qué solía pasar | tense | gram A2×6 |  | ↑ earlier | 5 | imperfect: spine target day 40 |
| 108 | A2 | a2-u15 |  | Verb day: formar, tratar, resultar, señalar, indicar | verbs |  |  |  |  |  |
| 109 | A2 | a2-u15 | nt-localizacion-tiempo-a2 | Situar en el tiempo: desde, hasta, durante | notion | noc A2×18 |  | ok | 3 |  |
| 110 | A2 | a2-u15 | nt-frecuencia-a2 | Cuántas veces y cuánta cantidad | notion | noc A2×7 |  | merge | 2 | frequency overlaps day 29 |
| 111 | A2 | a2-u15 |  | Practice day | practice |  |  |  |  |  |
| 112 | A2 | a2-u15 | task-a2-antes | Cómo era tu vida hace diez años | task |  |  | ok | 4 |  |
| 113 | A2 | a2-u16 | preterite-imperfect | Preterite vs. Imperfect | concept |  |  | ↑ earlier | 5 | preterite vs imperfect: spine target day 45 |
| 114 | A2 | a2-u16 |  | Verb day: ocupar, asegurar, expresar, comentar, opinar | verbs |  |  |  |  |  |
| 115 | A2 | a2-u16 | gn-narrar-anecdota-a2 | Contar una anécdota | genre | gen A2×10 |  | ok | 4 |  |
| 116 | A2 | a2-u16 | dc-estructuradores-a2 | Estructuradores y negación reforzada | discourse | tact A2×7 |  | ↓ later | 2 | discourse organisers: B1 |
| 117 | A2 | a2-u16 |  | Practice day | practice |  |  |  |  |  |
| 118 | A2 | a2-u16 | task-a2-anecdota | Cuenta una anécdota | task |  |  | ok | 4 |  |
| 119 | A2 | a2-u18 | gr-objeto-indirecto-a2 | El objeto indirecto | grammar | gram A2×6 |  | ↑ earlier | 4 | indirect object le/les: spine target day 50; pair with gustar |
| 120 | A2 | a2-u18 |  | Verb day: resumir, anunciar, publicar, celebrar, organizar | verbs |  |  |  |  |  |
| 121 | A2 | a2-u18 | gr-pronombres-atonos-a2 | Pronombres átonos: OD y OI | grammar | gram A2×6 |  | ↑ earlier | 4 | split: lo/la first (day ~25), se lo later; rewrite (rubric example) |
| 122 | A2 | a2-u18 | gr-pronombres-tonicos-a2 | Pronombres tónicos: mí, ti, conmigo | grammar | gram A2×4 |  | ok | 3 |  |
| 123 | A2 | a2-u18 |  | Practice day | practice |  |  |  |  |  |
| 124 | A2 | a2-u18 | gr-posesivos-tonicos-a2 | Los posesivos tónicos: mío, tuyo, suyo | grammar | gram A2×8 |  | ↓ later | 2 | mío/tuyo: lower frequency, A2 end or B1 |
| 125 | A2 | a2-u18 | task-a2-pronombres | Reescríbelo sin repetir el nombre | task |  |  | ok | 3 |  |
| 126 | A2 | a2-u19 | gr-imperativo-forma-a2 | El imperativo afirmativo: forma y uso | grammar | gram A2×4 |  | ↑ earlier | 5 | affirmative commands: spine target day 55 |
| 127 | A2 | a2-u19 |  | Verb day: participar, colaborar, reciclar, contaminar, reparar | verbs |  |  |  |  |  |
| 128 | A2 | a2-u19 | fn-atenuar-orden-a2 | Pedir algo con cortesía | function | func A2×7 |  | ok | 4 |  |
| 129 | A2 | a2-u19 | fn-acceder-peticion-a2 | Decir que sí y decir que no | function | func A2×7 |  | ok | 4 |  |
| 130 | A2 | a2-u19 |  | Practice day | practice |  |  |  |  |  |
| 131 | A2 | a2-u19 | dc-atenuacion-1apersona-a2 | Atenuar: se impersonal e indirectas | discourse | tact A2×5 |  | ↓ later | 2 | impersonal se as softening: B1 |
| 132 | A2 | a2-u19 | gn-instrucciones-a2 | Dar instrucciones breves | genre | gen A2×1 |  | ok | 3 |  |
| 133 | A2 | a2-u19 | task-a2-pedir | Pide lo mismo de cinco maneras | task |  |  | ok | 3 |  |
| 134 | A2 | a2-u20 | fn-preguntar-estado-animo-a2 | Cómo estás: ánimo y sensaciones | function | func A2×9 |  | ok | 4 |  |
| 135 | A2 | a2-u20 |  | Verb day: solicitar, entregar, cobrar, reclamar, vender | verbs |  |  |  |  |  |
| 136 | A2 | a2-u20 | fn-felicitar-a2 | Felicitar y alegrarse | function | func A2×8 |  | ok | 3 |  |
| 137 | A2 | a2-u20 | fn-preguntar-deseos-a2 | Deseos: los tuyos y los que se ofrecen | function | func A2×9 |  | ok | 3 |  |
| 138 | A2 | a2-u20 |  | Practice day | practice |  |  |  |  |  |
| 139 | A2 | a2-u20 | fn-acuerdo-a2 | Acuerdo y valoración | function | func A2×10 |  | merge | 2 | overlaps day 22 agree/disagree |
| 140 | A2 | a2-u20 | task-a2-animo | Reacciona a cinco noticias | task |  |  | ok | 3 |  |
| 141 | A2 | a2-u21 | gr-comparativos-a2 | Comparativos: los tres marcos y los irregulares | grammar | gram A2×7 |  | ↑ earlier | 4 | comparatives: spine target day 60 |
| 142 | A2 | a2-u21 |  | Verb day: funcionar, durar, faltar, suceder, practicar | verbs |  |  |  |  |  |
| 143 | A2 | a2-u21 | nt-cualidad-material-a2 | De qué es y cambiarlo por otro | notion | noc A2×8 |  | ok | 2 |  |
| 144 | A2 | a2-u21 | gn-describir-persona-a2 | Describir a una persona: comparar y narrar un momento | genre | gen A2×6 |  | ok | 3 |  |
| 145 | A2 | a2-u21 |  | Practice day | practice |  |  |  |  |  |
| 146 | A2 | a2-u21 | gn-describir-objeto-a2 | Describir un objeto: partes, una anécdota y una comparación | genre | gen A2×4 |  | cut/optional | 2 | third describe-an-object lesson |
| 147 | A2 | a2-u21 | task-a2-comparar | Compara dos opciones y elige | task |  |  | ok | 3 |  |
| 148 | A2 | a2-u22 | gn-conversacion-transaccional-a2 | La conversación transaccional en la tienda de ropa | genre | gen A2×21 |  | ok | 4 | clothes shopping |
| 149 | A2 | a2-u22 |  | Verb day: entrenar, montar, aparcar, arrancar, frenar | verbs |  |  |  |  |  |
| 150 | A2 | a2-u22 | fn-responder-telefono-a2 | Al teléfono y escuchando un relato | function | func A2×11 |  | ok | 4 | phone calls |
| 151 | A2 | a2-u22 | fn-pedir-informacion-a2 | Pedir y dar información (A2) | function | func A2×13 |  | merge | 2 | repeats day 17 |
| 152 | A2 | a2-u22 |  | Practice day | practice |  |  |  |  |  |
| 153 | A2 | a2-u22 | fn-preguntar-preferencias-a2 | Preferencias: qué te gusta más | function | func A2×8 |  | ok | 3 |  |
| 154 | A2 | a2-u22 | nt-necesidad-obligacion-a2 | Necesidad y conformidad: hace falta, vale | notion | noc A2×7 |  | ↑ earlier | 4 | hace falta / tener que: obligation is core A1 |
| 155 | A2 | a2-u22 | fn-preguntar-conocimiento-a2 | Saber y no saber | function | func A2×9 |  | ok | 3 |  |
| 156 | A2 | a2-u22 | task-a2-gestion | Resuelve tres gestiones | task |  |  | ok | 4 |  |
| 157 | A2 | a2-u23 | gr-causales-a2 | Causales: porque, como, por | grammar | gram A2×5 |  | ↑ earlier | 4 | porque/como: needed early |
| 158 | A2 | a2-u23 |  | Verb day: cruzar, doblar, girar, parar, avisar | verbs |  |  |  |  |  |
| 159 | A2 | a2-u23 | por-para | Por vs. Para | concept |  |  | ↑ earlier | 4 | por/para: spine target day 60 |
| 160 | A2 | a2-u23 | gr-condicionales-a2 | Condicionales: si + presente | grammar | gram A2×4 |  | ↑ earlier | 4 | si + present: A1-A2 early |
| 161 | A2 | a2-u23 |  | Practice day | practice |  |  |  |  |  |
| 162 | A2 | a2-u23 | fn-aconsejar-a2 | Aconsejar y ofrecerse | function | func A2×8 |  | ok | 4 |  |
| 163 | A2 | a2-u23 | fn-proponer-sugerir-a2 | Proponer, sugerir y aceptar | function | func A2×11 |  | ok | 4 | making plans (quedar) |
| 164 | A2 | a2-u23 | task-a2-razones | Explica una decisión | task |  |  | ok | 3 |  |
| 165 | A2 | a2-u24 | nt-posicion-relativa-distancia-a2 | Dentro, fuera y a la vista | notion | noc A2×10 |  | ok | 2 |  |
| 166 | A2 | a2-u24 |  | Verb day: informar, consultar, confirmar, cancelar, retrasar | verbs |  |  |  |  |  |
| 167 | A2 | a2-u24 | nt-movimiento-estabilidad-a2 | Moverse y dar direcciones (A2) | notion | noc A2×10 |  | merge | 2 | repeats directions (day 65) |
| 168 | A2 | a2-u24 | gn-describir-lugar-a2 | Describir un lugar: recorrido, anécdota y comparación | genre | gen A2×4 |  | ok | 2 |  |
| 169 | A2 | a2-u24 |  | Practice day | practice |  |  |  |  |  |
| 170 | A2 | a2-u24 | fn-dirigirse-a2 | Dirigirse a alguien y presentarlo | function | func A2×7 |  | ok | 3 |  |
| 171 | A2 | a2-u24 | task-a2-sitio | Lleva a alguien por tu barrio | task |  |  | ok | 3 |  |
| 172 | A2 | a2-u25 | gr-gerundio-a2 | El gerundio: -ando, -iendo | grammar | gram A2×5 |  | ↑ earlier | 5 | estar + gerund: core toolkit, target ~day 25 |
| 173 | A2 | a2-u25 |  | Verb day: adelantar, pesar, calcular, sumar, restar | verbs |  |  |  |  |  |
| 174 | A2 | a2-u25 | gr-adverbios-circunstanciales-a2 | Adverbios circunstanciales: lugar, tiempo y cantidad | grammar | gram A2×10 |  | merge | 2 | repeats adverbs (day 78) |
| 175 | A2 | a2-u25 | gn-generos-escritos-a2 | Textos breves de cada día (A2) | genre | gen A2×7 |  | ok | 3 |  |
| 176 | A2 | a2-u25 |  | Practice day | practice |  |  |  |  |  |
| 177 | A2 | a2-u25 | gn-presentacion-publica-a2 | Una presentación pública breve | genre | gen A2×1 |  | ok | 2 |  |
| 178 | A2 | a2-u25 | task-a2-escribir | Escribe una reseña y un correo | task |  |  | ok | 3 |  |
| 179 | A2 | a2-u26 | gr-presente-irregular-a2 | El presente irregular: la bota y el yo raro | grammar | gram A2×4 |  | ↑ earlier | 5 | irregular and stem-changing present: spine target day 12; biggest single misplacement |
| 180 | A2 | a2-u26 |  | Verb day: conectar, navegar, actualizar, instalar, suspender | verbs |  |  |  |  |  |
| 181 | A2 | a2-u26 | gr-articulo-definido-distribucion-a2 | El artículo definido: el agua, jugar al tenis, todos los libros | grammar | gram A2×7 |  | ok | 3 |  |
| 182 | A2 | a2-u26 | gr-cuantificadores-a2 | Cuantificadores: todo, otro, demasiado, nada | grammar | gram A2×6 |  | ok | 3 |  |
| 183 | A2 | a2-u26 |  | Practice day | practice |  |  |  |  |  |
| 184 | A2 | a2-u26 | gr-interrogativos-exclamativos-a2 | Interrogativos y exclamativos: qué, cuál, cómo | grammar | gram A2×6 |  | ↑ earlier | 3 | qué vs cuál: A1-A2 |
| 185 | A2 | a2-u26 | gr-demostrativos-valores-a2 | Los demostrativos: uso anafórico y temporal | grammar | gram A2×1 |  | ↓ later | 1 | anaphoric demonstratives: B1+ discourse |
| 186 | A2 | a2-u26 |  | Verb day: aprobar, quejarse, enfadarse, alegrarse, preocuparse | verbs |  |  |  |  |  |
| 187 | A2 | a2-u26 | task-a2-repaso | Revisa lo que has escrito en A2 | task |  |  | ok | 3 |  |
| 188 | B1 | b1-u27 | gr-presente-subjuntivo-b1 | El subjuntivo: cómo se forma y cuándo aparece | grammar | gram B1×6 |  | ↑ earlier | 5 | present subjunctive: spine target day 80 |
| 189 | B1 | b1-u27 | fn-dar-opinion-b1 | Dar y pedir una opinión | function | func B1×10 |  | ok | 4 |  |
| 190 | B1 | b1-u27 | fn-certeza-evidencia-b1 | Certeza y falta de certeza: dónde se rompe el indicativo | function | func B1×13 |  | ok | 3 |  |
| 191 | B1 | b1-u27 | nt-certeza-realidad-b1 | Certeza e incertidumbre: seguro, tal vez, imaginario | notion | noc B1×6 |  | merge | 2 | merge with day 190 |
| 192 | B1 | b1-u27 |  | Practice day | practice |  |  |  |  |  |
| 193 | B1 | b1-u27 | fn-estoy-de-acuerdo-b1 | Estar de acuerdo — y no estarlo | function | func B1×8 |  | ok | 4 |  |
| 194 | B1 | b1-u27 | nt-conformidad-correccion-precision-b1 | Conformidad y corrección: aceptar, error, claro | notion | noc B1×6 |  | ok | 2 |  |
| 195 | B1 | b1-u27 | task-b1-opinion | Defiende una opinión | task |  |  | ok | 4 |  |
| 196 | B1 | b1-u28 | fn-aprobacion-desaprobacion-b1 | Expresar aprobación y desaprobación (B1) | function | func B1×3 |  | ok | 2 |  |
| 197 | B1 | b1-u28 | fn-posicionarse-b1 | Posicionarse a favor o en contra | function | func B1×3 |  | ok | 3 |  |
| 198 | B1 | b1-u28 | fn-contraargumento-b1 | Presentar un contraargumento | function | func B1×4 |  | ok | 3 |  |
| 199 | B1 | b1-u28 | fn-preguntar-si-acuerdo-b1 | Preguntar si se está de acuerdo | function | func B1×3 |  | merge | 2 | merge into opinion cluster |
| 200 | B1 | b1-u28 |  | Practice day | practice |  |  |  |  |  |
| 201 | B1 | b1-u28 | fn-mostrar-escepticismo-b1 | Mostrar escepticismo | function | func B1×4 |  | ok | 2 |  |
| 202 | B1 | b1-u28 | dc-intensificar-acuerdo-desacuerdo-b1 | Intensificar el acuerdo o el desacuerdo: claro, claro | discourse | tact B1×4 |  | merge | 2 | merge into opinion cluster |
| 203 | B1 | b1-u28 | fn-respuesta-afirmativa-b1 | Corregir con no... sino | function | func B1×3 |  | ok | 3 |  |
| 204 | B1 | b1-u28 | task-b1-debate | Discute con alguien que no está de acuerdo | task |  |  | ok | 3 |  |
| 205 | B1 | b1-u29 | futuro | El futuro: forma, predicción y conjetura | tense | gram B1×9 |  | ↑ earlier | 5 | future: spine target day 90 |
| 206 | B1 | b1-u29 | fn-expresar-planes-b1 | Planes e intenciones: contarlos y preguntarlos | function | func B1×10 |  | ok | 4 | plans: link to ir a + infinitive |
| 207 | B1 | b1-u29 | gr-temporales-b1 | Temporales: cuando + subjuntivo para el futuro | grammar | gram B1×6 |  | ↑ earlier | 5 | cuando + subjunctive: with present subjunctive |
| 208 | B1 | b1-u29 | gr-modalidad-b1 | Modalidad: posiblemente, seguramente, probablemente | grammar | gram B1×4 |  | ok | 3 |  |
| 209 | B1 | b1-u29 |  | Practice day | practice |  |  |  |  |  |
| 210 | B1 | b1-u29 | nt-acontecimiento-b1 | Acontecimiento: tener lugar, celebrarse | notion | noc B1×4 |  | ok | 2 |  |
| 211 | B1 | b1-u29 | fn-proponer-sugerir-b1 | Proponer y sugerir: seis formas, una escala de fuerza | function | func B1×10 |  | ok | 3 |  |
| 212 | B1 | b1-u29 | fn-aceptar-propuesta-b1 | Aceptar una propuesta: entusiasmo y aceptación con reparos | function | func B1×8 |  | merge | 2 | merge with day 211 |
| 213 | B1 | b1-u29 | fn-ofrecer-invitar-b1 | Ofrecer e invitar | function | func B1×3 |  | ↑ earlier | 4 | invitations: A2 |
| 214 | B1 | b1-u29 | nt-puntualidad-retraso-b1 | Puntualidad y retraso: llegar a tiempo, con retraso | notion | noc B1×4 |  | ok | 2 |  |
| 215 | B1 | b1-u29 | nt-tiempo-referencias-futuro-pasado-presente-b1 | El tiempo: siglos, décadas y el presente que dura | notion | noc B1×8 |  | ok | 4 | llevar + gerund |
| 216 | B1 | b1-u29 | task-b1-planes | Cuenta tus planes y predice algo | task |  |  | ok | 3 |  |
| 217 | B1 | b1-u30 | condicional | El condicional: forma, cortesía y modestia | tense | gram B1×10 |  | ↑ earlier | 5 | conditional: spine target day 90 |
| 218 | B1 | b1-u30 | fn-aconsejar-b1 | Aconsejar: del condicional a "yo que tú" | function | func B1×10 |  | ok | 4 |  |
| 219 | B1 | b1-u30 | gr-condicionales-b1 | Condicionales reales: si + futuro, si + imperativo | grammar | gram B1×5 |  | ok | 4 |  |
| 220 | B1 | b1-u30 | dc-atenuacion-b1 | Atenuación: desplazar el tiempo verbal para suavizar | discourse | tact B1×10 |  | ok | 2 |  |
| 221 | B1 | b1-u30 |  | Practice day | practice |  |  |  |  |  |
| 222 | B1 | b1-u30 | fn-valorar-b1 | Valorar: hechos en indicativo, ajenos en subjuntivo | function | func B1×15 |  | ok | 3 |  |
| 223 | B1 | b1-u30 | fn-pedir-valoracion-b1 | Pedir valoración | function | func B1×5 |  | merge | 2 | merge with day 222 |
| 224 | B1 | b1-u30 | task-b1-consejo | Aconseja a alguien que te lo pide | task |  |  | ok | 3 |  |
| 225 | B1 | b1-u31 | gr-subordinadas-sustantivas-b1 | Subordinadas sustantivas: infinitivo o que + verbo | grammar | gram B1×5 |  | ↑ earlier | 5 | querer que + subjunctive: the core subjunctive trigger |
| 226 | B1 | b1-u31 | fn-expresar-deseos-b1 | Expresar deseos | function | func B1×10 |  | merge | 4 | merge with day 225 |
| 227 | B1 | b1-u31 | fn-espero-esperanza-b1 | Espero... / Expresar esperanza | function | func B1×6 |  | ↑ earlier | 4 | ojalá / espero que |
| 228 | B1 | b1-u31 | fn-preguntar-deseos-b1 | Preguntar por deseos: te apetece, tienes ganas de | function | func B1×7 |  | ↑ earlier | 3 | ¿te apetece?: A1-A2 everyday |
| 229 | B1 | b1-u31 |  | Practice day | practice |  |  |  |  |  |
| 230 | B1 | b1-u31 | fn-posibilidad-b1 | Expresar posibilidad: quiénes exigen subjuntivo y quiénes no | function | func B1×7 |  | ok | 3 |  |
| 231 | B1 | b1-u31 | nt-necesidad-obligacion-b1 | Necesidad y obligación: depender de, ser obligatorio | notion | noc B1×5 |  | ok | 2 |  |
| 232 | B1 | b1-u31 | task-b1-deseos | Di lo que quieres que pase | task |  |  | ok | 3 |  |
| 233 | B1 | b1-u32 | fn-pedir-ayuda-b1 | Pedir: ayuda, permiso, favores y cosas | function | func B1×25 |  | ok | 4 |  |
| 234 | B1 | b1-u32 |  | Practice day | practice |  |  |  |  |  |
| 235 | B1 | b1-u32 | fn-responder-orden-b1 | Responder a una petición: aceptar, dudar, negarse | function | func B1×10 |  | ok | 3 |  |
| 236 | B1 | b1-u32 | fn-rechazar-b1 | Rechazar una propuesta, ofrecimiento o invitación | function | func B1×6 |  | ↑ earlier | 4 | declining an invitation: A2 |
| 237 | B1 | b1-u32 | fn-ordenar-directo-b1 | Dar una orden de forma directa | function | func B1×3 |  | ok | 2 |  |
| 238 | B1 | b1-u32 | impneg | Imperativo negativo | concept |  |  | ↑ earlier | 5 | negative commands: spine target day 100 |
| 239 | B1 | b1-u32 | fn-prohibir-b1 | Prohibir | function | func B1×7 |  | ok | 2 |  |
| 240 | B1 | b1-u32 | fn-obligacion-necesidad-b1 | Expresar obligación y necesidad | function | func B1×3 |  | ↑ earlier | 4 | obligation tener que/hay que: A1 |
| 241 | B1 | b1-u32 | fn-habilidad-b1 | Expresar habilidad para hacer algo | function | func B1×4 |  | ok | 2 |  |
| 242 | B1 | b1-u32 | task-b1-pedir | Pide, niégate y prohíbe | task |  |  | ok | 3 |  |
| 243 | B1 | b1-u33 | fn-contento-encantado-b1 | Estoy contento / encantado... | function | func B1×3 |  | merge | 3 | emotion cluster (243-261, 17 lessons): merge to about four |
| 244 | B1 | b1-u33 | fn-me-alegro-b1 | Me alegro | function | func B1×3 |  | ok | 4 | me alegro (de que) |
| 245 | B1 | b1-u33 | fn-placer-diversion-b1 | Expresar placer y diversión | function | func B1×4 |  | merge | 2 |  |
| 246 | B1 | b1-u33 | fn-admiracion-orgullo-b1 | Expresar admiración y orgullo | function | func B1×4 |  | merge | 2 |  |
| 247 | B1 | b1-u33 |  | Practice day | practice |  |  |  |  |  |
| 248 | B1 | b1-u33 | fn-afecto-b1 | Expresar afecto | function | func B1×5 |  | merge | 2 |  |
| 249 | B1 | b1-u33 | fn-tristeza-afliccion-b1 | Expresar tristeza y aflicción | function | func B1×7 |  | ok | 3 |  |
| 250 | B1 | b1-u33 | fn-me-duele-b1 | Me duele (emocional) | function | func B1×3 |  | cut/optional | 1 | overlaps 249 |
| 251 | B1 | b1-u33 | task-b1-alegria | Cuenta algo que te hizo feliz | task |  |  | ok | 3 |  |
| 252 | B1 | b1-u34 | fn-enfado-indignacion-b1 | Expresar enfado e indignación | function | func B1×8 |  | ok | 3 |  |
| 253 | B1 | b1-u34 | fn-miedo-ansiedad-preocupacion-b1 | Expresar miedo, ansiedad y preocupación | function | func B1×7 |  | ok | 4 | me preocupa |
| 254 | B1 | b1-u34 | fn-aversion-b1 | Expresar aversión | function | func B1×4 |  | merge | 2 |  |
| 255 | B1 | b1-u34 | fn-aburrimiento-b1 | Expresar aburrimiento | function | func B1×4 |  | merge | 2 |  |
| 256 | B1 | b1-u34 |  | Practice day | practice |  |  |  |  |  |
| 257 | B1 | b1-u34 | fn-no-me-importa-b1 | No me importa (indiferencia) | function | func B1×3 |  | ok | 3 | me da igual |
| 258 | B1 | b1-u34 | fn-sorpresa-extraneza-b1 | Expresar sorpresa y extrañeza | function | func B1×8 |  | ok | 3 |  |
| 259 | B1 | b1-u34 | fn-empatia-b1 | Expresar empatía | function | func B1×6 |  | merge | 3 |  |
| 260 | B1 | b1-u34 | fn-tranquilizar-consolar-b1 | Tranquilizar y consolar | function | func B1×4 |  | merge | 3 |  |
| 261 | B1 | b1-u34 | fn-animar-b1 | Animar | function | func B1×3 |  | merge | 2 |  |
| 262 | B1 | b1-u34 | task-b1-enfado | Cuenta algo que salió mal | task |  |  | ok | 3 |  |
| 263 | B1 | b1-u35 | fn-expresar-gustos-b1 | Expresar gustos e intereses sobre acciones ajenas | function | func B1×3 |  | ok | 4 | me gusta que + subjunctive |
| 264 | B1 | b1-u35 | fn-preguntar-gustos-b1 | Preguntar por gustos: ¿te gusta que + subjuntivo? | function | func B1×3 |  | merge | 2 | merge with day 263 |
| 265 | B1 | b1-u35 | fn-preferencia-b1 | Expresar preferencia | function | func B1×4 |  | ok | 3 |  |
| 266 | B1 | b1-u35 | fn-preguntar-preferencias-b1 | Preguntar por preferencias: comparando dos opciones | function | func B1×4 |  | merge | 2 | merge with day 265 |
| 267 | B1 | b1-u35 |  | Practice day | practice |  |  |  |  |  |
| 268 | B1 | b1-u35 | fn-sensaciones-fisicas-b1 | Expresar sensaciones físicas: tener, sentir, estar, doler | function | func B1×9 |  | ↑ earlier | 4 | tengo hambre/frío: A1 survival |
| 269 | B1 | b1-u35 | fn-preguntar-estado-animo-b1 | Preguntar por el estado de ánimo | function | func B1×6 |  | merge | 2 | repeats day 134 |
| 270 | B1 | b1-u35 | fn-responder-estado-b1 | Responder cuando preguntan cómo van las cosas | function | func B1×8 |  | merge | 2 | merge with day 269 |
| 271 | B1 | b1-u35 | nt-evaluacion-valor-b1 | Evaluación y precio: parecerle, estar a, rebajas | notion | noc B1×6 |  | ok | 3 |  |
| 272 | B1 | b1-u35 | nt-exito-utilidad-importancia-b1 | Éxito, utilidad e importancia: servir para, dar igual | notion | noc B1×6 |  | ok | 3 |  |
| 273 | B1 | b1-u35 | task-b1-gustos | Habla de lo que te gusta hacer | task |  |  | ok | 3 |  |
| 274 | B1 | b1-u36 | gr-pluscuamperfecto-b1 | Pretérito pluscuamperfecto: había hablado | grammar | gram B1×4 |  | ok | 4 | pluperfect |
| 275 | B1 | b1-u36 | gn-narrar-estructura-b1 | La estructura de una anécdota: cinco partes, no una lista de hechos | genre | gen B1×7 |  | ok | 4 |  |
| 276 | B1 | b1-u36 | fn-introducir-tema-relato-b1 | Introducir el tema de un relato | function | func B1×3 |  | merge | 2 | story-management functions 276-279: merge into one |
| 277 | B1 | b1-u36 | fn-introducir-hecho-b1 | Introducir un hecho dentro de un relato | function | func B1×3 |  | merge | 2 |  |
| 278 | B1 | b1-u36 |  | Practice day | practice |  |  |  |  |  |
| 279 | B1 | b1-u36 | fn-concluir-relato-b1 | Concluir un relato | function | func B1×5 |  | merge | 2 |  |
| 280 | B1 | b1-u36 | dc-marcadores-discurso-b1 | Marcadores del discurso: las cinco familias del B1 | discourse | tact B1×12 |  | ok | 4 |  |
| 281 | B1 | b1-u36 | dc-mantenimiento-referente-b1 | Mantener el referente sin repetir el nombre | discourse | tact B1×5 |  | ok | 3 |  |
| 282 | B1 | b1-u36 | nt-ciclo-accion-b1 | El ciclo de una acción: empezar, seguir, dejar de | notion | noc B1×8 |  | ok | 4 | empezar a / seguir / dejar de |
| 283 | B1 | b1-u36 | nt-orientacion-orden-b1 | Orientación y orden: seguir por, primero, luego | notion | noc B1×6 |  | ok | 2 |  |
| 284 | B1 | b1-u36 | task-b1-relato | Cuenta una historia con un antes | task |  |  | ok | 4 |  |
| 285 | B1 | b1-u37 | fn-seguir-relato-interes-b1 | Indicar que se sigue el relato con interés | function | func B1×6 |  | ok | 3 |  |
| 286 | B1 | b1-u37 | fn-interrumpir-b1 | Interrumpir | function | func B1×3 |  | ok | 3 |  |
| 287 | B1 | b1-u37 | fn-controlar-atencion-b1 | Controlar la atención del interlocutor | function | func B1×11 |  | merge | 2 |  |
| 288 | B1 | b1-u37 | fn-has-oido-b1 | ¿Has oído...? | function | func B1×3 |  | merge | 2 |  |
| 289 | B1 | b1-u37 |  | Practice day | practice |  |  |  |  |  |
| 290 | B1 | b1-u37 | fn-conocimiento-desconocimiento-b1 | Conocimiento y desconocimiento: oír que + indicativo/subjuntivo | function | func B1×12 |  | ok | 2 |  |
| 291 | B1 | b1-u37 | gn-llamada-transaccional-b1 | La llamada telefónica transaccional (B1) | genre | gen B1×17 |  | ok | 3 |  |
| 292 | B1 | b1-u37 | fn-preguntar-persona-telefono-b1 | Preguntar por una persona y responder al teléfono | function | func B1×13 |  | ok | 3 |  |
| 293 | B1 | b1-u37 | fn-pedir-informacion-b1 | Pedir información con preguntas indirectas | function | func B1×13 |  | ok | 4 | indirect questions |
| 294 | B1 | b1-u37 | dc-valores-ilocutivos-b1 | Lo que realmente hace una pregunta | discourse | tact B1×9 |  | ↓ later | 2 | illocutionary values: B2 |
| 295 | B1 | b1-u37 | nt-reflexion-expresion-b1 | Reflexión y expresión: darse cuenta de, contar un chiste | notion | noc B1×6 |  | ok | 3 |  |
| 296 | B1 | b1-u37 | task-b1-conversar | Mantén una conversación larga | task |  |  | ok | 4 |  |
| 297 | B1 | b1-u38 | gr-relativas-b1 | Oraciones de relativo: que, quien, donde | grammar | gram B1×5 |  | ↑ earlier | 5 | relative clauses: spine target day 100 |
| 298 | B1 | b1-u38 | gr-adverbios-relativos-b1 | Como, cuando, donde: relativos vs interrogativos | grammar | gram B1×4 |  | merge | 2 | merge with day 297 |
| 299 | B1 | b1-u38 | fn-identificar-b1 | Identificar con una oración de relativo | function | func B1×3 |  | merge | 2 | merge with day 297 |
| 300 | B1 | b1-u38 | gn-describir-persona-b1 | Describir a una persona: objetivo vs subjetivo, y una anécdota narrada | genre | gen B1×7 |  | ok | 3 |  |
| 301 | B1 | b1-u38 |  | Practice day | practice |  |  |  |  |  |
| 302 | B1 | b1-u38 | gn-describir-lugar-b1 | Describir un lugar: razones objetivas, cariño subjetivo | genre | gen B1×7 |  | ok | 2 |  |
| 303 | B1 | b1-u38 | gn-describir-objeto-b1 | Describir un objeto: origen objetivo o acertijo subjetivo | genre | gen B1×7 |  | cut/optional | 2 | fourth describe-an-object lesson |
| 304 | B1 | b1-u38 | gr-pronombres-combinados-b1 | Combinación de pronombres átonos: te lo, se lo | grammar | gram B1×4 |  | ↑ earlier | 5 | se lo: spine target day 50; currently day 304 |
| 305 | B1 | b1-u38 | nt-cualidad-generalidad-b1 | Cualidad y generalidad: tipo, forma, en general | notion | noc B1×6 |  | ok | 3 |  |
| 306 | B1 | b1-u38 | nt-edad-vejez-b1 | Edad: cumplir años, aniversario | notion | noc B1×4 |  | ok | 2 |  |
| 307 | B1 | b1-u38 | nt-localizacion-posicion-b1 | Localización y posición: junto a, al fondo, en ninguna parte | notion | noc B1×6 |  | ok | 3 |  |
| 308 | B1 | b1-u38 | nt-distancia-movimiento-b1 | Distancia y movimiento: acercarse, alejarse, caerse | notion | noc B1×6 |  | ok | 2 |  |
| 309 | B1 | b1-u38 | task-b1-describir | Describe algo con detalle | task |  |  | ok | 3 |  |
| 310 | B1 | b1-u39 | gr-causales-b1 | Causales: como, por + infinitivo | grammar | gram B1×4 |  | ok | 3 |  |
| 311 | B1 | b1-u39 | gr-consecutivas-b1 | Consecutivas: entonces, así que, o sea que | grammar | gram B1×5 |  | ok | 4 | así que / entonces |
| 312 | B1 | b1-u39 | gr-concesivas-b1 | Concesivas: aunque + indicativo | grammar | gram B1×4 |  | ↑ earlier | 4 | aunque |
| 313 | B1 | b1-u39 | gr-comparativas-b1 | Comparativas: igual de... que, más de | grammar | gram B1×5 |  | ok | 2 |  |
| 314 | B1 | b1-u39 |  | Practice day | practice |  |  |  |  |  |
| 315 | B1 | b1-u39 | gr-perifrasis-verbales-b1 | Perífrasis verbales: soler, volver a, dejar de | grammar | gram B1×4 |  | ↑ earlier | 4 | soler / volver a: A2 |
| 316 | B1 | b1-u39 | nt-cantidad-numerica-relativa-b1 | Cantidad: en total, por ciento, la mayoría de | notion | noc B1×6 |  | ok | 3 |  |
| 317 | B1 | b1-u39 | nt-aumento-proporcion-grado-b1 | Aumento y proporción: subida, la mitad, sobre todo | notion | noc B1×6 |  | ok | 2 |  |
| 318 | B1 | b1-u39 | task-b1-unir | Une un texto entero | task |  |  | ok | 4 |  |
| 319 | B1 | b1-u40 | fn-felicitar-b1 | Felicitar: por un logro y en fechas señaladas | function | func B1×6 |  | ok | 3 |  |
| 320 | B1 | b1-u40 | fn-responder-felicitaciones-b1 | Responder a felicitaciones y buenos deseos | function | func B1×3 |  | merge | 2 |  |
| 321 | B1 | b1-u40 | fn-buenos-deseos-b1 | Formular buenos deseos: dos formas, un mismo deseo | function | func B1×6 |  | ok | 3 |  |
| 322 | B1 | b1-u40 | fn-brindis-b1 | Proponer un brindis | function | func B1×3 |  | cut/optional | 2 | toasts: niche |
| 323 | B1 | b1-u40 |  | Practice day | practice |  |  |  |  |  |
| 324 | B1 | b1-u40 | fn-saludar-responder-b1 | Saludar y responder: la lengua escrita añade un registro | function | func B1×9 |  | ok | 2 |  |
| 325 | B1 | b1-u40 | fn-disculparse-b1 | Disculparse con una razón: "es que..." | function | func B1×3 |  | ok | 4 | es que |
| 326 | B1 | b1-u40 | fn-responder-disculpa-b1 | Responder a una disculpa | function | func B1×5 |  | ok | 3 |  |
| 327 | B1 | b1-u40 | fn-reprochar-b1 | Reprochar | function | func B1×3 |  | ok | 2 |  |
| 328 | B1 | b1-u40 | fn-advertir-b1 | Advertir | function | func B1×3 |  | ok | 2 |  |
| 329 | B1 | b1-u40 | task-b1-cortesia | Escribe en cinco ocasiones sociales | task |  |  | ok | 3 |  |
| 330 | B1 | b1-u41 | gn-composicion-escrita-b1 | La composición escrita (B1) | genre | gen B1×7 |  | ok | 4 |  |
| 331 | B1 | b1-u41 | gn-exponer-tema-b1 | Exponer un tema: presente, ejemplos y esquemas | genre | gen B1×16 |  | ok | 3 |  |
| 332 | B1 | b1-u41 | gn-carta-personal-b1 | La carta personal (B1) | genre | gen B1×8 |  | ok | 3 |  |
| 333 | B1 | b1-u41 | gn-presentacion-publica-b1 | Una presentación pública (B1) | genre | gen B1×22 |  | ok | 2 |  |
| 334 | B1 | b1-u41 |  | Practice day | practice |  |  |  |  |  |
| 335 | B1 | b1-u41 | fn-despedida-escrita-b1 | Despedirse por escrito | function | func B1×4 |  | ok | 3 |  |
| 336 | B1 | b1-u41 | fn-destacar-elemento-b1 | Destacar un elemento por escrito | function | func B1×3 |  | cut/optional | 1 | highlighting in writing: typographic, not language |
| 337 | B1 | b1-u41 | gn-generos-escritos-b1 | Reconocer géneros escritos: la forma predice el registro | genre | gen B1×10 |  | ok | 2 |  |
| 338 | B1 | b1-u41 | task-b1-escribir | Escribe una composición | task |  |  | ok | 4 |  |
| 339 | B1 | b1-u42 | impsubj | Imperfecto de subjuntivo (Imperfect Subjunctive) | tense |  |  | ↑ earlier | 5 | imperfect subjunctive: spine target day 130 (PCIC: B2) |
| 340 | B1 | b1-u42 | futperf | Futuro perfecto (Future Perfect) | tense |  |  | ↓ later | 3 | future perfect: low frequency; PCIC B2 |
| 341 | B1 | b1-u42 | condperf | Condicional perfecto (Conditional Perfect) | tense |  |  | ok | 4 | conditional perfect: needed for si hubiera; PCIC B2 |
| 342 | B1 | b1-u42 | perfsubj | Pretérito perfecto de subjuntivo (Present Perfect Subjunctive) | tense |  |  | ok | 3 | PCIC B2 |
| 343 | B1 | b1-u42 |  | Practice day | practice |  |  |  |  |  |
| 344 | B1 | b1-u42 | gr-imperativo-valores-b1 | El imperativo: más allá de la orden | grammar | gram B1×4 |  | ok | 2 |  |
| 345 | B1 | b1-u42 | task-b1-hipotesis | Imagina que las cosas fueran de otra manera | task |  |  | ok | 4 |  |
| 346 | B1 | b1-u43 | nt-medidas-tamano-superficie-b1 | Medidas: medir, tamaño, metros cuadrados | notion | noc B1×5 |  | ok | 2 |  |
| 347 | B1 | b1-u43 | nt-formas-materia-b1 | Formas y materia: círculo, estar hecho de | notion | noc B1×6 |  | ok | 2 |  |
| 348 | B1 | b1-u43 | nt-temperatura-velocidad-volumen-b1 | Temperatura, velocidad y volumen: grados, km por hora | notion | noc B1×6 |  | ok | 2 |  |
| 349 | B1 | b1-u43 | nt-existencia-disponibilidad-b1 | Existencia y disponibilidad: vacío, libre, ocupado | notion | noc B1×6 |  | ok | 2 |  |
| 350 | B1 | b1-u43 | nt-acabado-b1 | Acabado: el resultado de una acción terminada | notion | noc B1×4 |  | ok | 3 |  |
| 351 | B1 | b1-u43 |  | Practice day | practice |  |  |  |  |  |
| 352 | B1 | b1-u43 | task-b1-fisico | Describe algo con precisión | task |  |  | ok | 3 |  |
| 353 | B2 | b2-u44 | fn-acuerdo-b2 | Acuerdo y desacuerdo: de "sin ninguna duda" a "en absoluto" | function | func B2×40 |  | ok | 4 |  |
| 354 | B2 | b2-u44 | fn-dar-opinion-b2 | Opinar y valorar: darla, pedirla, matizarla | function | func B2×23 |  | ok | 4 |  |
| 355 | B2 | b2-u44 | dc-atenuacion-b2 | Cortesía atenuadora en B2: desplazar la persona, aplazar el tiempo | discourse | tact B2×30 |  | ok | 3 |  |
| 356 | B2 | b2-u44 | fn-expresar-certeza-b2 | Certeza, duda y escepticismo | function | func B2×19 |  | ok | 4 |  |
| 357 | B2 | b2-u44 |  | Practice day | practice |  |  |  |  |  |
| 358 | B2 | b2-u44 | nt-certeza-b2 | Certeza e incertidumbre: el vocabulario, más allá del modo | notion | noc B2×8 |  | merge | 2 | merge with day 356 |
| 359 | B2 | b2-u44 | fn-aprobacion-desaprobacion-b2 | Aprobar, desaprobar y reprochar | function | func B2×8 |  | ok | 3 |  |
| 360 | B2 | b2-u44 | nt-adecuacion-b2 | Adecuación: adaptarse, apropiado | notion | noc B2×3 |  | ok | 2 |  |
| 361 | B2 | b2-u44 | nt-correccion-precision-b2 | Corrección y precisión: fallo, exacto, verlo claro | notion | noc B2×8 |  | ok | 2 |  |
| 362 | B2 | b2-u44 | task-b2-registro | Di lo mismo en cinco salas | task |  |  | ok | 4 | register |
| 363 | B2 | b2-u45 | gn-argumentativa-b2 | Argumentar en B2: tesis, fuente, contraargumentación, reserva | genre | gen B2×11 |  | ok | 4 |  |
| 364 | B2 | b2-u45 | gn-composicion-argumentativa-b2 | La composición argumentativa (B2) | genre | gen B1×10 | PCIC B1 → taught B2 | ok | 4 |  |
| 365 | B2 | b2-u45 | dc-marcadores-discurso-b2 | Marcadores del discurso B2: contraargumentativos y reformuladores | discourse | tact B2×19 |  | ok | 4 |  |
| 366 | B2 | b2-u45 | gr-adverbios-evaluativos-b2 | Adverbios evaluativos: un comentario sobre toda la frase | grammar | gram B2×4 |  | ok | 3 |  |
| 367 | B2 | b2-u45 |  | Practice day | practice |  |  |  |  |  |
| 368 | B2 | b2-u45 | gr-adverbios-enunciacion-b2 | Adverbios de enunciación: comentar sobre las propias palabras | grammar | gram B2×3 |  | ok | 3 |  |
| 369 | B2 | b2-u45 | nt-importancia-normalidad-b2 | Importancia y normalidad: dar lo mismo, por norma | notion | noc B2×7 |  | ok | 2 |  |
| 370 | B2 | b2-u45 | nt-generalidad-especificidad-b2 | Generalidad y especificidad: concretar, particular, en general | notion | noc B2×8 |  | ok | 2 |  |
| 371 | B2 | b2-u45 | nt-cualidad-general-b2 | Cualidad general: propiedades, categorías, composición | notion | noc B2×7 |  | ok | 2 |  |
| 372 | B2 | b2-u45 | gr-subordinadas-sustantivas-b2 | Subordinadas sustantivas: el verbo principal decide el modo | grammar | gram B2×8 |  | ok | 4 | mood choice by main verb |
| 373 | B2 | b2-u45 | task-b2-argumento | Construye un argumento completo | task |  |  | ok | 4 |  |
| 374 | B2 | b2-u46 | gr-pluscuamsubj-b2 | El pretérito pluscuamperfecto de subjuntivo: hubiera/hubiese + participio | grammar | gram B2×3 |  | ok | 4 | pluperfect subjunctive |
| 375 | B2 | b2-u46 | gr-condicional-compuesto-b2 | El condicional compuesto: habría + participio | grammar | gram B2×5 |  | merge | 3 | repeats condperf (day 341) |
| 376 | B2 | b2-u46 | gr-futuro-perfecto-b2 | El futuro perfecto: habré + participio | grammar | gram B2×4 |  | merge | 2 | repeats futperf (day 340) |
| 377 | B2 | b2-u46 | gr-perfsubj-valores-b2 | El pretérito perfecto de subjuntivo: haya + participio | grammar | gram B2×3 |  | merge | 3 | repeats perfsubj (day 342) |
| 378 | B2 | b2-u46 |  | Practice day | practice |  |  |  |  |  |
| 379 | B2 | b2-u46 | gr-impsubj-valores-b2 | El imperfecto de subjuntivo: más allá del "si tuviera" | grammar | gram B2×6 |  | ok | 4 |  |
| 380 | B2 | b2-u46 | fn-posibilidad-b2 | Expresar posibilidad: el futuro y condicional de conjetura | function | func B2×10 |  | ok | 4 | conjecture |
| 381 | B2 | b2-u46 | nt-necesidad-contingencia-b2 | Necesidad y azar: imprescindible, inevitablemente, por casualidad | notion | noc B2×4 |  | ok | 2 |  |
| 382 | B2 | b2-u46 | nt-permanencia-b2 | Permanencia: estable, fijo, sobrevivir | notion | noc B2×4 |  | ok | 2 |  |
| 383 | B2 | b2-u46 | nt-existencia-b2 | Existencia e inexistencia: crear, eliminar, provocar | notion | noc B2×7 |  | ok | 2 |  |
| 384 | B2 | b2-u46 | task-b2-hipotesis | Cuenta lo que no pasó | task |  |  | ok | 4 |  |
| 385 | B2 | b2-u47 | fn-enfado-indignacion-b2 | Enfado, hartazgo y aversión | function | func B2×25 |  | merge | 2 | B2 emotion cluster (385-392): merge |
| 386 | B2 | b2-u47 | fn-alegria-satisfaccion-b2 | Alegría, placer, afecto y orgullo | function | func B2×20 |  | merge | 2 |  |
| 387 | B2 | b2-u47 | fn-tristeza-afliccion-b2 | Tristeza, decepción y arrepentimiento | function | func B2×13 |  | ok | 3 | regret |
| 388 | B2 | b2-u47 | fn-miedo-ansiedad-b2 | Miedo, nervios y vergüenza | function | func B2×17 |  | merge | 2 |  |
| 389 | B2 | b2-u47 |  | Practice day | practice |  |  |  |  |  |
| 390 | B2 | b2-u47 | fn-expresar-alivio-b2 | Alivio, esperanza y resignación | function | func B2×14 |  | merge | 2 |  |
| 391 | B2 | b2-u47 | fn-empatia-b2 | Consolar, animar y acompañar | function | func B2×15 |  | merge | 2 |  |
| 392 | B2 | b2-u47 | fn-sorpresa-extraneza-b2 | Expresar sorpresa: qué raro que, no puede ser | function | func B2×6 |  | ok | 3 |  |
| 393 | B2 | b2-u47 | nt-grado-b2 | Grado: intensificadores más allá de "muy" | notion | noc B2×7 |  | ok | 2 |  |
| 394 | B2 | b2-u47 | nt-interes-b2 | Interés: motivación, aburrir, centro de interés | notion | noc B2×5 |  | ok | 2 |  |
| 395 | B2 | b2-u47 | nt-evaluacion-general-b2 | Evaluación general: salirle/irle algo a alguien, valer la pena | notion | noc B2×7 |  | ok | 2 |  |
| 396 | B2 | b2-u47 | task-b2-emocion | Cuenta algo con la emoción medida | task |  |  | ok | 3 |  |
| 397 | B2 | b2-u48 | nt-cantidad-numerica-b2 | Cantidad numérica: cifras, índices, "número + de" | notion | noc B2×5 |  | ok | 2 |  |
| 398 | B2 | b2-u48 | nt-aumento-disminucion-b2 | Aumento y disminución: crecer, duplicarse, cada vez más | notion | noc B2×6 |  | ok | 2 |  |
| 399 | B2 | b2-u48 | nt-proporcion-b2 | Proporción: partir, repartir, la sexta parte | notion | noc B2×6 |  | ok | 2 |  |
| 400 | B2 | b2-u48 | nt-cantidad-relativa-b2 | Cantidad relativa: aproximar sin comprometerse | notion | noc B2×7 |  | ok | 2 |  |
| 401 | B2 | b2-u48 |  | Practice day | practice |  |  |  |  |  |
| 402 | B2 | b2-u48 | gn-expositiva-b2 | Exponer un tema en B2: presentar, desarrollar, concluir | genre | gen B2×10 |  | ok | 3 |  |
| 403 | B2 | b2-u48 | nt-realidad-ficcion-b2 | Realidad y ficción: inventar, simular, cumplirse | notion | noc B2×8 |  | ok | 2 |  |
| 404 | B2 | b2-u48 | nt-acontecimiento-b2 | Acontecimiento: ocurrir, casualidad, suspender | notion | noc B2×4 |  | ok | 2 |  |
| 405 | B2 | b2-u48 | nt-exito-logro-b2 | Éxito y logro: triunfar, fracasar, llegar a ser | notion | noc B2×5 |  | ok | 2 |  |
| 406 | B2 | b2-u48 | nt-valor-precio-b2 | Valor y precio: invertir, estar en oferta, ganar/perder valor | notion | noc B2×7 |  | ok | 2 |  |
| 407 | B2 | b2-u48 | nt-referencias-generales-b2 | Referencias temporales: dedicar tiempo, a mediados de, hacia | notion | noc B2×9 |  | ok | 2 |  |
| 408 | B2 | b2-u48 | nt-localizacion-tiempo-b2 | Situar en el tiempo: llevar sin, antiguamente, a corto/largo plazo | notion | noc B2×11 |  | ok | 2 |  |
| 409 | B2 | b2-u48 | task-b2-noticia | Resume y comenta una noticia | task |  |  | ok | 4 | news |
| 410 | B2 | b2-u49 | dc-cita-b2 | Procedimientos de cita: estilo indirecto y citas encubiertas | discourse | tact B2×14 |  | ok | 4 | reported speech |
| 411 | B2 | b2-u49 | nt-expresion-verbal-b2 | Expresión verbal: variar el verbo de habla más allá de "decir" | notion | noc B2×8 |  | ok | 2 |  |
| 412 | B2 | b2-u49 | dc-perspectiva-temporal-b2 | Desplazar el tiempo verbal: presente, futuro de probabilidad, imperfecto | discourse | tact B2×5 |  | ok | 3 |  |
| 413 | B2 | b2-u49 | dc-mantenimiento-referente-b2 | Mantener el referente: elipsis, sinónimos, hiperónimos | discourse | tact B2×10 |  | ok | 3 |  |
| 414 | B2 | b2-u49 |  | Practice day | practice |  |  |  |  |  |
| 415 | B2 | b2-u49 | fn-dar-informacion-b2 | Dar información: corregir con matiz, modo y finalidad | function | func B2×10 |  | ok | 3 |  |
| 416 | B2 | b2-u49 | fn-conocimiento-b2 | Saber, no saber y confirmar | function | func B2×27 |  | ok | 3 |  |
| 417 | B2 | b2-u49 | nt-reflexion-conocimiento-b2 | Reflexión y conocimiento: ocurrírsele, ser consciente de, enterarse | notion | noc B2×7 |  | ok | 2 |  |
| 418 | B2 | b2-u49 | nt-anticipacion-b2 | Anticipación: adelantar, con tiempo, por adelantado | notion | noc B2×7 |  | ok | 2 |  |
| 419 | B2 | b2-u49 | nt-simultaneidad-b2 | Simultaneidad: mientras tanto, a la vez, coincidir | notion | noc B2×5 |  | ok | 2 |  |
| 420 | B2 | b2-u49 | nt-repeticion-b2 | Repetición: rutina, ciclo, una y otra vez | notion | noc B2×9 |  | ok | 2 |  |
| 421 | B2 | b2-u49 | task-b2-citar | Cuenta lo que dijeron | task |  |  | ok | 4 |  |
| 422 | B2 | b2-u50 | dc-rematizacion-tematizacion-b2 | Rematización y tematización en B2: ecuacionales y "lo de" | discourse | tact B2×16 |  | ok | 3 |  |
| 423 | B2 | b2-u50 | dc-focalizacion-b2 | Focalizar en B2: reduplicación del pronombre y ecos | discourse | tact B2×9 |  | ok | 3 |  |
| 424 | B2 | b2-u50 | dc-intensificacion-b2 | Intensificar en B2: prefijos, verbos performativos, alargamientos | discourse | tact B2×21 |  | ok | 3 |  |
| 425 | B2 | b2-u50 | gr-orden-interrogativos-b2 | El orden en las preguntas: lo que puede moverse | grammar | gram B2×4 |  | ok | 3 |  |
| 426 | B2 | b2-u50 |  | Practice day | practice |  |  |  |  |  |
| 427 | B2 | b2-u50 | dc-negacion-b2 | Matices de la negación: reiterada, enfática, artificiosa | discourse | tact B2×7 |  | ok | 3 |  |
| 428 | B2 | b2-u50 | gr-exclamativos-b2 | Los exclamativos: qué, cómo, cuánto y quién | grammar | gram B2×5 |  | ok | 3 |  |
| 429 | B2 | b2-u50 | dc-entonacion-b2 | Entonación y alargamientos: lo que dice el tono | discourse | tact B2×11 |  | ok | 3 |  |
| 430 | B2 | b2-u50 | nt-presencia-ausencia-b2 | Presencia y ausencia: asistir, faltar, a la vista | notion | noc B2×8 |  | ok | 2 |  |
| 431 | B2 | b2-u50 | nt-disponibilidad-b2 | Disponibilidad: agotarse, contar con, estar listo | notion | noc B2×9 |  | ok | 2 |  |
| 432 | B2 | b2-u50 | task-b2-enfasis | Pon el peso donde quieras | task |  |  | ok | 3 |  |
| 433 | B2 | b2-u51 | nt-consistencia-resistencia-b2 | Consistencia y resistencia: denso, frágil, resistente a | notion | noc B2×8 |  | cut/optional | 1 | physical-property notion run (433-447): keep as optional vocab |
| 434 | B2 | b2-u51 | nt-textura-acabado-b2 | Textura y acabado: áspero, arrugado, una mano de pintura | notion | noc B2×7 |  | cut/optional | 1 |  |
| 435 | B2 | b2-u51 | nt-materia-b2 | Materia: estar fabricado con, contener un ingrediente | notion | noc B2×7 |  | cut/optional | 1 |  |
| 436 | B2 | b2-u51 | nt-formas-figuras-b2 | Formas y figuras: geometría cotidiana | notion | noc B2×7 |  | cut/optional | 1 |  |
| 437 | B2 | b2-u51 |  | Practice day | practice |  |  |  |  |  |
| 438 | B2 | b2-u51 | nt-peso-b2 | El peso: tonelada, carga, pesarse | notion | noc B2×5 |  | cut/optional | 1 |  |
| 439 | B2 | b2-u51 | nt-humedad-sequedad-b2 | Humedad y sequedad: empapado, transpirar, en seco | notion | noc B2×7 |  | cut/optional | 1 |  |
| 440 | B2 | b2-u51 | nt-color-b2 | Color: tonos compuestos, ser de color, en blanco y negro | notion | noc B2×7 |  | cut/optional | 1 |  |
| 441 | B2 | b2-u51 | nt-limpieza-b2 | Limpieza: mancha, ensuciar, limpiar a fondo | notion | noc B2×6 |  | cut/optional | 1 |  |
| 442 | B2 | b2-u51 | gn-descriptiva-objetos-b2 | Describir objetos en B2: del tomate al desarrollo formal | genre | gen B2×10 |  | ok | 3 |  |
| 443 | B2 | b2-u51 | nt-visibilidad-vision-b2 | Visibilidad y visión: a simple vista, distinguir, de lejos | notion | noc B2×8 |  | cut/optional | 2 |  |
| 444 | B2 | b2-u51 | nt-audibilidad-audicion-b2 | Audibilidad: sonar, a gritos, a todo volumen | notion | noc B2×7 |  | cut/optional | 2 |  |
| 445 | B2 | b2-u51 | nt-sabor-olor-b2 | Sabor y olor: soso, agridulce, oler a | notion | noc B2×6 |  | ok | 2 |  |
| 446 | B2 | b2-u51 | nt-origen-b2 | Origen: raíz, procedencia, proceder de | notion | noc B2×4 |  | cut/optional | 1 |  |
| 447 | B2 | b2-u51 | nt-edad-vejez-b2 | Edad y vejez: recién + participio, fresco/podrido, estrenar | notion | noc B2×7 |  | ok | 2 |  |
| 448 | B2 | b2-u51 | task-b2-precision | Describe con precisión técnica | task |  |  | ok | 3 |  |
| 449 | B2 | b2-u52 | gn-carta-solicitud-trabajo-b2 | La carta de solicitud de trabajo | genre | gen B1×16 | PCIC B1 → taught B2 | ok | 4 | job application |
| 450 | B2 | b2-u52 | gn-reclamacion-b2 | La carta de reclamación | genre | gen B2×2 |  | ok | 4 | complaint letter |
| 451 | B2 | b2-u52 | gn-generos-escritos-b2 | Géneros escritos en B2: cartas al director, informes, biografías | genre | gen B2×10 |  | ok | 3 |  |
| 452 | B2 | b2-u52 | gr-pronombre-personal-b2 | El pronombre personal: se accidental y la jerarquía de clíticos | grammar | gram B2×7 |  | ok | 4 | accidental se |
| 453 | B2 | b2-u52 |  | Practice day | practice |  |  |  |  |  |
| 454 | B2 | b2-u52 | fn-pedir-ayuda-b2 | Pedir: ayuda, favores y cosas — y responder | function | func B2×35 |  | ok | 3 |  |
| 455 | B2 | b2-u52 | fn-pedir-permiso-b2 | Permiso y prohibición: pedirlo, darlo, negarlo | function | func B2×26 |  | ok | 3 |  |
| 456 | B2 | b2-u52 | fn-falta-obligacion-b2 | Expresar falta de obligación: no hace falta que... | function | func B2×3 |  | ok | 3 |  |
| 457 | B2 | b2-u52 | nt-utilidad-uso-b2 | Utilidad y uso: utilizar/emplear, fuera de servicio | notion | noc B2×5 |  | ok | 2 |  |
| 458 | B2 | b2-u52 | nt-capacidad-competencia-b2 | Capacidad y competencia: dársele bien, ser capaz de | notion | noc B2×7 |  | ok | 2 |  |
| 459 | B2 | b2-u52 | nt-facilidad-b2 | Facilidad y dificultad: complejo, facilitar, con facilidad | notion | noc B2×6 |  | ok | 2 |  |
| 460 | B2 | b2-u52 | gr-complemento-preposicional-regido-b2 | Verbos con preposición fija: decidirse a, contar con | grammar | gram B2×4 |  | ok | 4 | verbs with fixed prepositions |
| 461 | B2 | b2-u52 | task-b2-formal | Escribe tres cartas formales | task |  |  | ok | 4 |  |
| 462 | B2 | b2-u53 | fn-introducir-nuevo-tema-b2 | Manejar el tema: introducirlo, interrumpir, cerrarlo | function | func B2×25 |  | ok | 3 |  |
| 463 | B2 | b2-u53 | fn-solicitar-comienzo-relato-b2 | Contar algo: abrir, seguir y cerrar el relato | function | func B2×19 |  | ok | 3 |  |
| 464 | B2 | b2-u53 | fn-proponer-sugerir-b2 | Proponer, aceptar, rechazar y suponer | function | func B2×19 |  | ok | 3 |  |
| 465 | B2 | b2-u53 | fn-aconsejar-b2 | Aconsejar, advertir y amenazar | function | func B2×12 |  | ok | 3 |  |
| 466 | B2 | b2-u53 |  | Practice day | practice |  |  |  |  |  |
| 467 | B2 | b2-u53 | fn-disculparse-b2 | Disculparse y responder a una disculpa | function | func B2×9 |  | ok | 3 |  |
| 468 | B2 | b2-u53 | fn-saludar-responder-b2 | Saludar, despedirse y dar la bienvenida | function | func B2×22 |  | ok | 3 |  |
| 469 | B2 | b2-u53 | fn-preguntar-persona-telefono-b2 | Al teléfono y "¿cómo va todo?" | function | func B2×9 |  | ok | 3 |  |
| 470 | B2 | b2-u53 | gn-llamada-transaccional-b2 | La llamada telefónica transaccional (B2): una cadena más larga | genre | gen B2×15 |  | ok | 3 |  |
| 471 | B2 | b2-u53 | gn-generos-orales-b2 | Géneros orales en B2: qué debes entender, qué debes producir | genre | gen B2×13 |  | ok | 3 |  |
| 472 | B2 | b2-u53 | nt-orientacion-direccion-b2 | Orientación y dirección: dirigirse a, empujar/tirar, a domicilio | notion | noc B2×7 |  | ok | 2 |  |
| 473 | B2 | b2-u53 | nt-orden-b2 | Orden: puesto, colocado/descolocado, por orden | notion | noc B2×7 |  | ok | 2 |  |
| 474 | B2 | b2-u53 | task-b2-conversar | Lleva una conversación difícil | task |  |  | ok | 4 |  |
| 475 | B2 | b2-u54 | gn-narrativa-b2 | La macrofunción narrativa en B2: las cinco etapas del relato | genre | gen B2×9 |  | ok | 3 |  |
| 476 | B2 | b2-u54 | gn-descriptiva-personas-b2 | Describir personas en B2: anclaje, aspectualización, puesta en relación | genre | gen B2×10 |  | ok | 3 |  |
| 477 | B2 | b2-u54 | gn-descriptiva-lugares-b2 | Describir lugares en B2: de la planta a la anécdota | genre | gen B2×10 |  | ok | 3 |  |
| 478 | B2 | b2-u54 | gn-presentacion-publica-b2 | Una presentación pública (B2) | genre | gen B1×13 | PCIC B1 → taught B2 | ok | 3 |  |
| 479 | B2 | b2-u54 |  | Practice day | practice |  |  |  |  |  |
| 480 | B2 | b2-u54 | fn-agradecer-b2 | Agradecer y desear | function | func B2×9 |  | ok | 3 |  |
| 481 | B2 | b2-u54 | fn-deseos-b2 | Deseos, gustos, preferencias y planes | function | func B2×32 |  | ok | 3 |  |
| 482 | B2 | b2-u54 | fn-habilidad-b2 | Habilidad: se me da bien, soy un negado | function | func B2×10 |  | ok | 3 |  |
| 483 | B2 | b2-u54 | fn-expresar-recordar-b2 | Recordar y olvidar: me acuerdo, me suena, ni idea | function | func B2×17 |  | ok | 3 |  |
| 484 | B2 | b2-u54 | fn-sensaciones-fisicas-b2 | Expresar sensaciones físicas: pasar hambre/frío, me agota | function | func B2×5 |  | ok | 3 |  |
| 485 | B2 | b2-u54 | fn-identificar-b2 | Identificar: el/los que, lo de, se trata de | function | func B2×5 |  | ok | 3 |  |
| 486 | B2 | b2-u54 | nt-localizacion-b2 | Localización: situado, quedar, hallarse | notion | noc B2×5 |  | ok | 2 |  |
| 487 | B2 | b2-u54 | nt-posicion-relativa-b2 | Posición relativa: delantero/trasero, a lo largo de, al otro lado | notion | noc B2×8 |  | ok | 2 |  |
| 488 | B2 | b2-u54 | nt-posicion-absoluta-b2 | Posición absoluta: tumbado, de rodillas, del revés | notion | noc B2×6 |  | ok | 2 |  |
| 489 | B2 | b2-u54 | nt-distancia-b2 | Distancia: acercar(se), alejar(se), a distancia | notion | noc B2×7 |  | ok | 2 |  |
| 490 | B2 | b2-u54 | nt-movimiento-estabilidad-b2 | Movimiento y estabilidad: un verbo por cada fase | notion | noc B2×10 |  | ok | 2 |  |
| 491 | B2 | b2-u54 | task-b2-repaso | Reescribe algo tuyo en dos registros | task |  |  | ok | 4 |  |
| 492 | C1 | c1-u55 | fn-afecto-sensaciones-c1 | Afecto y sensaciones físicas en C1: "estoy hecho polvo" y "no puedo con mi alma" | function | func C1×18 |  | ok | 2 |  |
| 493 | C1 | c1-u55 | nt-temperatura-c1 | Temperatura en C1: de "un frío que pela" a "al rojo vivo" | notion | noc C1×16 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 494 | C1 | c1-u55 | nt-sabor-c1 | Sabor en C1: catar, saborear y "estar para chuparse los dedos" | notion | noc C1×4 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 495 | C1 | c1-u55 | nt-olor-c1 | Olor en C1: de "fragancia" a "peste" | notion | noc C1×7 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 496 | C1 | c1-u55 |  | Practice day | practice |  |  |  |  |  |
| 497 | C1 | c1-u55 | nt-textura-c1 | Textura en C1: rugoso, sedoso y "al tacto" | notion | noc C1×9 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 498 | C1 | c1-u55 | nt-visibilidad-vision-c1 | Visibilidad y visión en C1: "saltar a la vista" y "mirar por encima del hombro" | notion | noc C1×17 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 499 | C1 | c1-u55 | nt-audibilidad-audicion-c1 | Audibilidad y audición en C1: de "susurro" a "dar gritos" | notion | noc C1×20 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 500 | C1 | c1-u55 | fn-hartazgo-enfado-c1 | Hartazgo y enfado en C1: "hasta la coronilla" y "de un humor de perros" | function | func C1×9 |  | ok | 2 |  |
| 501 | C1 | c1-u55 | nt-color-c1 | Color en C1: matices, gamas y verbos que cambian el color | notion | noc C1×7 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 502 | C1 | c1-u55 | nt-consistencia-resistencia-c1 | Consistencia y resistencia en C1: "fuerte como un roble", "duro como una piedra" | notion | noc C1×15 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 503 | C1 | c1-u55 | nt-humedad-sequedad-c1 | Humedad y sequedad en C1: "ponerse como una sopa" y cocinar "al vapor" | notion | noc C1×17 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 504 | C1 | c1-u55 | nt-acabado-c1 | Acabado en C1: de "en bruto" a "metalizado" | notion | noc C1×10 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 505 | C1 | c1-u55 | nt-accesibilidad-limpieza-c1 | Accesibilidad y limpieza en C1: "obstruido" y "estar hecho un asco" | notion | noc C1×12 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 506 | C1 | c1-u55 | nt-edad-vejez-c1 | Edad y vejez en C1: novato, veterano y "no pasar los años por alguien" | notion | noc C1×13 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 507 | C1 | c1-u55 | task-c1-idiom | Cuenta un mal día sin una sola palabra neutra | task |  |  | ok | 3 |  |
| 508 | C1 | c1-u56 | dc-ironia-c1 | Indicadores de ironía: cómo se marca que no lo dices en serio | discourse | tact C1×6 |  | ok | 3 |  |
| 509 | C1 | c1-u56 | dc-valores-ilocutivos-c1 | Lo que hace una pregunta en C1: saludo, crítica, eco recapitulativo | discourse | tact C1×11 |  | ok | 2 |  |
| 510 | C1 | c1-u56 | dc-metaforas-c1 | Metáforas: el juicio escondido en la gramática | discourse | tact C1×5 |  | ok | 2 |  |
| 511 | C1 | c1-u56 | dc-intensificacion-c1 | Intensificar en C1: sufijos, entonación suspendida, el "que" que insiste | discourse | tact C1×24 |  | ok | 2 |  |
| 512 | C1 | c1-u56 |  | Practice day | practice |  |  |  |  |  |
| 513 | C1 | c1-u56 | fn-escepticismo-contraargumento-c1 | Escepticismo y contraargumento en C1: "no te falta razón, pero..." | function | func C1×7 |  | ok | 2 |  |
| 514 | C1 | c1-u56 | fn-sorpresa-admiracion-c1 | Sorpresa y admiración en C1: "me quedo con la boca abierta" | function | func C1×14 |  | ok | 2 |  |
| 515 | C1 | c1-u56 | nt-atractivo-calidad-c1 | Atractivo y calidad en C1: de "apuesto" a "vulgar", de "deficiente" a "superior" | notion | noc C1×5 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 516 | C1 | c1-u56 | nt-normalidad-c1 | Normalidad en C1: de lo "convencional" a "un fuera de serie" | notion | noc C1×11 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 517 | C1 | c1-u56 | nt-interes-c1 | Interés en C1: de "apasionante" a "morirse de aburrimiento" | notion | noc C1×10 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 518 | C1 | c1-u56 | fn-estado-general-cosas-c1 | Preguntar por el estado general de las cosas: la pregunta que se devuelve | function | func C1×12 |  | ok | 2 |  |
| 519 | C1 | c1-u56 | task-c1-ironia | Di lo contrario de lo que quieres decir | task |  |  | ok | 3 |  |
| 520 | C1 | c1-u57 | dc-citas-encubiertas-c1 | Citas encubiertas: decirlo sin responder de ello | discourse | tact C1×6 |  | ok | 3 |  |
| 521 | C1 | c1-u57 | dc-atenuacion-c1 | Atenuación: decirlo sin señalar a nadie | discourse | tact C1×4 |  | ok | 3 |  |
| 522 | C1 | c1-u57 | dc-atenuacion-dialogica-c1 | Atenuación dialógica: discrepar sin romper nada | discourse | tact C1×4 |  | ok | 3 |  |
| 523 | C1 | c1-u57 | dc-negacion-c1 | Negación en C1: velada, diluida, obviada | discourse | tact C1×11 |  | ok | 2 |  |
| 524 | C1 | c1-u57 |  | Practice day | practice |  |  |  |  |  |
| 525 | C1 | c1-u57 | dc-estilo-indirecto-c1 | Estilo indirecto: el verbo que interpreta | discourse | tact C1×6 |  | ok | 3 |  |
| 526 | C1 | c1-u57 | dc-reformuladores-c1 | Reformuladores: volver a decirlo mejor | discourse | tact C1×4 |  | ok | 3 |  |
| 527 | C1 | c1-u57 | fn-expresar-desacuerdo-c1 | Expresar desacuerdo en C1: de "no me convence" a "¡de eso nada!" | function | func C1×15 |  | ok | 3 |  |
| 528 | C1 | c1-u57 | fn-expresar-acuerdo-c1 | Expresar acuerdo en C1: de "algo de razón tienes" a "¡exactamente!" | function | func C1×15 |  | ok | 3 |  |
| 529 | C1 | c1-u57 | fn-pedir-confirmacion-c1 | Pedir confirmación en C1: de "¿a que sí?" a "tengo entendido que..." | function | func C1×14 |  | ok | 2 |  |
| 530 | C1 | c1-u57 | fn-confirmar-informacion-previa-c1 | Confirmar información previa en C1: "así es", "¡y tanto!" y "de hecho" | function | func C1×4 |  | ok | 2 |  |
| 531 | C1 | c1-u57 | fn-conocimiento-desconocimiento-c1 | Conocimiento y desconocimiento en C1: de "¿te has enterado de...?" a "lo ignoro" | function | func C1×12 |  | ok | 2 |  |
| 532 | C1 | c1-u57 | nt-certeza-incertidumbre-c1 | Certeza e incertidumbre en C1: de "cabe la posibilidad" a "sin lugar a dudas" | notion | noc C1×13 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 533 | C1 | c1-u57 | nt-realidad-ficcion-c1 | Realidad y ficción en C1: idealizar, disimular y volver a la realidad | notion | noc C1×17 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 534 | C1 | c1-u57 | task-c1-decirlo | Dilo sin responder de ello | task |  |  | ok | 3 |  |
| 535 | C1 | c1-u58 | gn-carta-comercial-c1 | La carta comercial: atención, interés, deseo, acción | genre | gen C1×14 |  | ok | 3 |  |
| 536 | C1 | c1-u58 | gn-trabajo-academico-c1 | El trabajo académico: de lo general a lo no resuelto | genre | gen C1×11 |  | ok | 4 | academic writing |
| 537 | C1 | c1-u58 | gn-generos-escritos-c1 | Géneros escritos en C1: el informe extenso y la reseña propia | genre | gen C1×6 |  | ok | 3 |  |
| 538 | C1 | c1-u58 | fn-saludar-c1 | Saludar en C1: de "¿qué es de tu vida?" a "señora ministra" | function | func C1×6 |  | ok | 2 |  |
| 539 | C1 | c1-u58 |  | Practice day | practice |  |  |  |  |  |
| 540 | C1 | c1-u58 | fn-felicitar-despedirse-c1 | Felicitar y despedirse en C1: "estás de enhorabuena" y "sin otro particular" | function | func C1×12 |  | ok | 2 |  |
| 541 | C1 | c1-u58 | fn-responder-saludo-dirigirse-c1 | Responder a un saludo y dirigirse a alguien en C1: "seguimos tirando" y "¿te acuerdas de mí?" | function | func C1×10 |  | ok | 2 |  |
| 542 | C1 | c1-u58 | gn-generos-orales-c1 | Géneros orales en C1: intervenir en tu especialidad | genre | gen C1×5 |  | ok | 3 |  |
| 543 | C1 | c1-u58 | fn-pedir-informacion-c1 | Pedir información en C1: de "¿qué es lo que...?" a "¿me permites...?" | function | func C1×15 |  | ok | 2 |  |
| 544 | C1 | c1-u58 | fn-dar-informacion-c1 | Dar información en C1: de las subordinadas de lugar a "¡¿Cómo que no?!" | function | func C1×15 |  | ok | 2 |  |
| 545 | C1 | c1-u58 | gn-carta-reclamacion-c1 | La carta de reclamación: motivo, argumento, solución | genre | gen C1×5 |  | ok | 3 |  |
| 546 | C1 | c1-u58 | gn-composicion-escrita-c1 | La composición escrita: título, hoja de ruta, síntesis | genre | gen C1×8 |  | ok | 4 |  |
| 547 | C1 | c1-u58 | gn-presentacion-publica-c2 | La presentación pública: el nivel más pulido | genre | gen C1×13 |  | ok | 3 |  |
| 548 | C1 | c1-u58 | fn-agradecer-pesame-c1 | Agradecer y dar el pésame en C1: "¿qué haría yo sin ti?" y "mi más sentido pésame" | function | func C1×14 |  | ok | 2 |  |
| 549 | C1 | c1-u58 | fn-disculparse-responder-c1 | Disculparse y responder en C1: "mil perdones" y "por esta vez pase, pero..." | function | func C1×9 |  | ok | 2 |  |
| 550 | C1 | c1-u58 | task-c1-formal | Escribe para una institución | task |  |  | ok | 4 |  |
| 551 | C1 | c1-u59 | gr-tiempos-indicativo-c1 | Tiempos verbales de indicativo en C1: cada tiempo, su objeción | grammar | gram C1×13 |  | ok | 4 | tense review; canDo text is machine-generated |
| 552 | C1 | c1-u59 | gr-tiempos-subjuntivo-c1 | Tiempos verbales de subjuntivo en C1: lo que decide la negación | grammar | gram C1×10 |  | ok | 4 | canDo text is machine-generated |
| 553 | C1 | c1-u59 | dc-imperfecto-modal-c1 | El imperfecto que no habla del pasado | discourse | tact C1×4 |  | ok | 3 |  |
| 554 | C1 | c1-u59 | dc-indefinido-perfecto-c1 | Indefinido o perfecto: acercar y alejar lo ocurrido | discourse | tact C1×4 |  | ok | 4 | indefinido vs perfecto |
| 555 | C1 | c1-u59 |  | Practice day | practice |  |  |  |  |  |
| 556 | C1 | c1-u59 | gr-nucleo-verbal-c1 | El núcleo del sintagma verbal en C1: pasivas, perífrasis y el reparto ser/estar | grammar | gram C1×16 |  | ok | 3 | canDo machine-generated |
| 557 | C1 | c1-u59 | gr-formas-no-personales-c1 | Formas no personales en C1: infinitivo, gerundio y participio fuera del verbo | grammar | gram C1×11 |  | ok | 3 |  |
| 558 | C1 | c1-u59 | gr-imperativo-c1 | El imperativo en C1: cuando no manda nada | grammar | gram C1×6 |  | ok | 2 |  |
| 559 | C1 | c1-u59 | fn-hipotesis-posibilidad-c1 | Formular hipótesis y expresar posibilidad en C1: "¿y si...?" y "para mí que..." | function | func C1×7 |  | ok | 3 |  |
| 560 | C1 | c1-u59 | fn-obligacion-necesidad-c1 | Obligación y necesidad en C1: de "es mi obligación" a "basta con que..." | function | func C1×10 |  | ok | 2 |  |
| 561 | C1 | c1-u59 | nt-necesidad-obligacion-c1 | Necesidad, contingencia y obligación en C1: de lo prescindible a "no quedar más remedio" | notion | noc C1×12 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 562 | C1 | c1-u59 | fn-orden-instruccion-c1 | Dar una orden en C1: de "tú te callas" a la orden encubierta | function | func C1×17 |  | ok | 2 |  |
| 563 | C1 | c1-u59 | fn-repetir-orden-c1 | Repetir una orden en C1: "¿cuántas veces tengo que repetirte que...?" | function | func C1×4 |  | ok | 2 |  |
| 564 | C1 | c1-u59 | fn-responder-orden-peticion-c1 | Responder a una petición en C1: de "faltaría más" a "¡ni lo sueñes!" | function | func C1×15 |  | ok | 2 |  |
| 565 | C1 | c1-u59 | fn-permiso-prohibicion-c1 | Permiso y prohibición en C1: "eso ni se pregunta" y "digas lo que digas..." | function | func C1×15 |  | ok | 2 |  |
| 566 | C1 | c1-u59 | fn-favor-objetos-ayuda-c1 | Pedir favores, objetos y ayuda en C1: la misma escalera de cortesía | function | func C1×16 |  | ok | 2 |  |
| 567 | C1 | c1-u59 | task-c1-verbos | Justifica cada tiempo verbal que usas | task |  |  | ok | 4 |  |
| 568 | C1 | c1-u60 | fn-arrepentimiento-verguenza-c1 | Arrepentimiento y vergüenza en C1: "si volviera a nacer..." y "vergüenza ajena" | function | func C1×14 |  | ok | 2 |  |
| 569 | C1 | c1-u60 | fn-tristeza-placer-c1 | Tristeza y placer en C1: "se me rompe el corazón" y "me parto de risa" | function | func C1×11 |  | ok | 2 |  |
| 570 | C1 | c1-u60 | fn-miedo-nerviosismo-c1 | Miedo y nerviosismo en C1: "el corazón en un puño" y "los pelos de punta" | function | func C1×17 |  | ok | 2 |  |
| 571 | C1 | c1-u60 | fn-estado-animo-alegria-c1 | Preguntar por el ánimo y expresar alegría en C1: "estoy como loco de contento" | function | func C1×14 |  | ok | 2 |  |
| 572 | C1 | c1-u60 |  | Practice day | practice |  |  |  |  |  |
| 573 | C1 | c1-u60 | fn-decepcion-resignacion-c1 | Decepción y resignación en C1: "¡vaya, hombre!" y "que sea lo que Dios quiera" | function | func C1×7 |  | ok | 2 |  |
| 574 | C1 | c1-u60 | fn-empatia-alivio-esperanza-c1 | Empatía, alivio y esperanza en C1: "me pongo en tu lugar" y "cruzo los dedos" | function | func C1×15 |  | ok | 2 |  |
| 575 | C1 | c1-u60 | fn-gustos-aversion-c1 | Gustos y aversión en C1: de "adoro" a "me da náuseas" | function | func C1×9 |  | ok | 2 |  |
| 576 | C1 | c1-u60 | fn-tranquilizar-animar-c1 | Tranquilizar y animar en C1: "el no ya lo tienes" y "no es el fin del mundo" | function | func C1×15 |  | ok | 2 |  |
| 577 | C1 | c1-u60 | fn-preferencia-indiferencia-c1 | Preferencia e indiferencia en C1: "no cambio... por nada del mundo" | function | func C1×12 |  | ok | 2 |  |
| 578 | C1 | c1-u60 | fn-deseos-planes-c1 | Deseos y planes en C1: "¡quién tuviera...!" y "estoy por..." | function | func C1×12 |  | ok | 2 |  |
| 579 | C1 | c1-u60 | fn-recordar-olvidar-c1 | Recordar y olvidar en C1: "lo tengo en la punta de la lengua" | function | func C1×14 |  | ok | 2 |  |
| 580 | C1 | c1-u60 | fn-reprochar-ofrecerse-c1 | Reprochar y ofrecerse en C1: "¿no te da vergüenza?" y "cuenta conmigo" | function | func C1×16 |  | ok | 2 |  |
| 581 | C1 | c1-u60 | nt-reflexion-conocimiento-c1 | Reflexión y conocimiento en C1: "consultar con la almohada" y "romperse la cabeza" | notion | noc C1×25 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 582 | C1 | c1-u60 | nt-expresion-verbal-c1 | Expresión verbal en C1: de "dejar caer" a "poner algo en claro" | notion | noc C1×21 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 583 | C1 | c1-u60 | task-c1-emocion | Expresa una emoción complicada | task |  |  | ok | 3 |  |
| 584 | C1 | c1-u61 | gn-argumentativa-c1 | Argumentar: de la cuestión polémica a la reserva final | genre | gen C1×12 |  | ok | 4 |  |
| 585 | C1 | c1-u61 | gn-argumentativa-conectores-c1 | El repertorio del ensayo argumentativo | genre | gen C1×10 |  | ok | 4 |  |
| 586 | C1 | c1-u61 | gn-expositiva-c1 | Exponer un tema: presentar, desarrollar, concluir | genre | gen C1×11 |  | ok | 3 |  |
| 587 | C1 | c1-u61 | fn-pedir-dar-opinion-c1 | Pedir y dar opinión en C1: "a mi entender" y "en mi modesta opinión" | function | func C1×8 |  | ok | 3 |  |
| 588 | C1 | c1-u61 |  | Practice day | practice |  |  |  |  |  |
| 589 | C1 | c1-u61 | fn-certeza-evidencia-c1 | Certeza y su ausencia en C1: de "sin lugar a dudas" a "juraría que..." | function | func C1×16 |  | ok | 2 |  |
| 590 | C1 | c1-u61 | fn-aprobacion-desaprobacion-c1 | Expresar aprobación y desaprobación en C1: de "apruebo" a "¡así se hace!" | function | func C1×9 |  | ok | 2 |  |
| 591 | C1 | c1-u61 | fn-valorar-c1 | Valorar en C1: "de pésimo gusto" y "resulta vergonzoso" | function | func C1×3 |  | ok | 2 |  |
| 592 | C1 | c1-u61 | fn-proponer-ofrecer-confirmar-c1 | Proponer, ofrecer y confirmar en C1: "no puedes faltar" y "¿te apuntas?" | function | func C1×12 |  | ok | 2 |  |
| 593 | C1 | c1-u61 | fn-aceptar-rechazar-propuesta-c1 | Aceptar y rechazar propuestas en C1: "no te voy a decir que no" y "¡ni atado!" | function | func C1×11 |  | ok | 2 |  |
| 594 | C1 | c1-u61 | fn-aconsejar-advertir-amenazar-c1 | Aconsejar, advertir y amenazar en C1: "allá tú" cambia de sentido según el contexto | function | func C1×14 |  | ok | 2 |  |
| 595 | C1 | c1-u61 | nt-importancia-c1 | Importancia en C1: de "trascendencia" a "importarle un pimiento" | notion | noc C1×5 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 596 | C1 | c1-u61 | nt-adecuacion-c1 | Adecuación en C1: "guardar las formas" y "estar contraindicado para" | notion | noc C1×9 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 597 | C1 | c1-u61 | nt-aceptabilidad-c1 | Aceptabilidad en C1: de "razonable" a "disparate", y "no paso por eso" | notion | noc C1×10 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 598 | C1 | c1-u61 | nt-conformidad-c1 | Conformidad en C1: "hacer la vista gorda" y "no quedar más remedio" | notion | noc C1×7 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 599 | C1 | c1-u61 | nt-correccion-c1 | Corrección en C1: de "un acierto" a "a la perfección" | notion | noc C1×14 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 600 | C1 | c1-u61 | nt-generalidad-especificidad-c1 | Generalidad y especificidad en C1: de "por lo general" a "centrarse en" | notion | noc C1×13 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 601 | C1 | c1-u61 | nt-cualidad-general-c1 | Cualidad general en C1: naturaleza, apariencia y composición | notion | noc C1×9 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 602 | C1 | c1-u61 | task-c1-ensayo | Escribe un ensayo argumentativo | task |  |  | ok | 4 |  |
| 603 | C1 | c1-u62 | nt-medidas-generales-tamano-c1 | Medidas generales, talla y tamaño en C1: de "a ojo" a "gigantesco" | notion | noc C1×15 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 604 | C1 | c1-u62 | nt-peso-superficie-c1 | Peso y superficie en C1: de "peso bruto" a "de norte a sur" | notion | noc C1×13 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 605 | C1 | c1-u62 | nt-volumen-capacidad-presion-c1 | Volumen, capacidad y presión en C1: de "dar volumen al cabello" a "estar a tope" | notion | noc C1×14 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 606 | C1 | c1-u62 | nt-formas-figuras-c1 | Formas y figuras en C1: de la "silueta" al "zigzag" | notion | noc C1×12 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 607 | C1 | c1-u62 |  | Practice day | practice |  |  |  |  |  |
| 608 | C1 | c1-u62 | nt-materia-c1 | Materia en C1: de la seda al cartón piedra | notion | noc C1×8 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 609 | C1 | c1-u62 | nt-proporcion-c1 | Proporción en C1: fracciones, cuotas y "tres de cada diez" | notion | noc C1×5 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 610 | C1 | c1-u62 | nt-precision-claridad-c1 | Precisión y claridad en C1: de "matemático" a "un lío" | notion | noc C1×15 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 611 | C1 | c1-u62 | nt-localizacion-c1 | Localización en C1: ubicar, situar y "en paradero desconocido" | notion | noc C1×8 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 612 | C1 | c1-u62 | nt-cantidad-numerica-c1 | Cantidad numérica en C1: calcular "por lo alto" o "por lo bajo" | notion | noc C1×4 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 613 | C1 | c1-u62 | nt-cantidad-relativa-c1 | Cantidad relativa en C1: colectivos, porciones y cantidades hiperbólicas | notion | noc C1×13 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 614 | C1 | c1-u62 | nt-aumento-disminucion-c1 | Aumento y disminución en C1: de "ir en aumento" a "dispararse" | notion | noc C1×11 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 615 | C1 | c1-u62 | nt-grado-c1 | Grado en C1: de "lo grande que es" a "por todo lo alto" | notion | noc C1×9 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 616 | C1 | c1-u62 | nt-referencias-generales-c1 | Referencias temporales generales en C1: de "a primeros de mes" a "entre horas" | notion | noc C1×15 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 617 | C1 | c1-u62 | nt-localizacion-presente-c1 | Localizar en el tiempo en C1: presente, pasado y futuro | notion | noc C1×35 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 618 | C1 | c1-u62 | nt-simultaneidad-c1 | Simultaneidad en C1: "al tiempo que" y "en el mismo instante en que" | notion | noc C1×7 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 619 | C1 | c1-u62 | nt-anterioridad-c1 | Anterioridad en C1: precedentes, antepasados y "de antemano" | notion | noc C1×8 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 620 | C1 | c1-u62 | nt-posterioridad-c1 | Posterioridad en C1: de "apenas" a "con posterioridad" | notion | noc C1×13 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 621 | C1 | c1-u62 | nt-puntualidad-singularidad-c1 | Puntualidad y singularidad en C1: "por los pelos" y "sin precedentes" | notion | noc C1×5 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 622 | C1 | c1-u62 | nt-anticipacion-c1 | Anticipación en C1: prever, predecir y "por anticipado" | notion | noc C1×14 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 623 | C1 | c1-u62 | nt-retraso-c1 | Retraso en C1: atraso, demora y aplazamiento | notion | noc C1×6 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 624 | C1 | c1-u62 | nt-duracion-transcurso-c1 | Duración en C1: de lo "fugaz" a lo "perpetuo" | notion | noc C1×14 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 625 | C1 | c1-u62 | nt-frecuencia-c1 | Frecuencia en C1: de "rara vez" a "el pan de cada día" | notion | noc C1×12 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 626 | C1 | c1-u62 | nt-repeticion-c1 | Repetición en C1: recurrente, turnarse y "erre que erre" | notion | noc C1×9 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 627 | C1 | c1-u62 | nt-inicio-c1 | Inicio en C1: de "dar comienzo" a "¡manos a la obra!" | notion | noc C1×14 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 628 | C1 | c1-u62 | nt-finalizacion-c1 | Finalización en C1: caducar, vencer y "acabar por volverme loco" | notion | noc C1×14 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 629 | C1 | c1-u62 | nt-continuacion-c1 | Continuación en C1: retomar, perseverar y "sin cesar" | notion | noc C1×13 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 630 | C1 | c1-u62 | nt-cambio-c1 | Cambio en C1: transiciones, transformaciones y verbos derivados de adjetivo | notion | noc C1×17 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 631 | C1 | c1-u62 | nt-permanencia-c1 | Permanencia en C1: lo imborrable, lo inalterable y "conservar la calma" | notion | noc C1×8 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 632 | C1 | c1-u62 | nt-existencia-inexistencia-c1 | Existencia e inexistencia en C1: nacer, formarse y dejar de ser | notion | noc C1×17 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 633 | C1 | c1-u62 | nt-presencia-ausencia-c1 | Presencia y ausencia en C1: de "estar hasta arriba" a "cuatro gatos" | notion | noc C1×17 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 634 | C1 | c1-u62 | nt-disponibilidad-c1 | Disponibilidad en C1: desde "a mano" hasta "no estar para nadie" | notion | noc C1×9 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 635 | C1 | c1-u62 | nt-acontecimiento-c1 | Acontecimiento en C1: de la odisea al hecho aislado | notion | noc C1×5 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 636 | C1 | c1-u62 | task-c1-precision | Describe algo con precisión nativa | task |  |  | ok | 3 |  |
| 637 | C1 | c1-u63 | gn-resena-c1 | La reseña crítica | genre | gen C1×1 |  | ok | 4 |  |
| 638 | C1 | c1-u63 | gn-narrativa-c1 | Contar una anécdota: las cinco etapas | genre | gen C1×9 |  | ok | 3 |  |
| 639 | C1 | c1-u63 | gn-descriptiva-personas-c1 | Describir a una persona: anclar, detallar, relacionar | genre | gen C1×12 |  | ok | 3 |  |
| 640 | C1 | c1-u63 | gn-descriptiva-lugares-c1 | Describir un lugar: de fuera adentro, con un porqué | genre | gen C1×12 |  | ok | 3 |  |
| 641 | C1 | c1-u63 |  | Practice day | practice |  |  |  |  |  |
| 642 | C1 | c1-u63 | gn-descriptiva-objetos-c1 | Describir un objeto: del hecho general a la vivencia propia | genre | gen C1×11 |  | ok | 3 |  |
| 643 | C1 | c1-u63 | gn-presentacion-publica-c1 | La presentación pública: la estructura completa | genre | gen C1×15 |  | ok | 3 |  |
| 644 | C1 | c1-u63 | fn-identificar-c1 | Identificar en C1: "el que suscribe" y las hendidas "lo que... es..." | function | func C1×7 |  | ok | 2 |  |
| 645 | C1 | c1-u63 | nt-posicion-absoluta-c1 | Posición absoluta en C1: inclinado, torcido, empinado | notion | noc C1×12 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 646 | C1 | c1-u63 | nt-posicion-relativa-c1 | Posición relativa en C1: "a la vuelta de la esquina" y "al alcance de la mano" | notion | noc C1×19 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 647 | C1 | c1-u63 | nt-distancia-c1 | Distancia en C1: de "manzanas" a "acortar distancias" | notion | noc C1×12 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 648 | C1 | c1-u63 | nt-distancia-velocidad-c1 | Distancia y velocidad en C1: del "año luz" al "exceso de velocidad" | notion | noc C1×10 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 649 | C1 | c1-u63 | nt-movimiento-estabilidad-sustantivos-c1 | Movimiento en C1: nombrarlo, decirlo, y las locuciones | notion | noc C1×36 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 650 | C1 | c1-u63 | nt-orientacion-direccion-c1 | Orientación y dirección en C1: "con rumbo a" y "sin rumbo fijo" | notion | noc C1×11 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 651 | C1 | c1-u63 | nt-orden-c1 | Orden en C1: series, secuencias y "por orden de prioridad" | notion | noc C1×8 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 652 | C1 | c1-u63 | nt-origen-c1 | Origen en C1: la "semilla" y la "raíz" de las cosas | notion | noc C1×5 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 653 | C1 | c1-u63 | nt-evaluacion-general-c1 | Evaluación general en C1: de "pasable" a "catastrófico" | notion | noc C1×14 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 654 | C1 | c1-u63 | nt-valor-precio-c1 | Valor y precio en C1: de "estar tirado" a "precio de coste" | notion | noc C1×15 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 655 | C1 | c1-u63 | nt-exito-logro-c1 | Éxito y logro en C1: de "estar en pleno auge" a "ganar por los pelos" | notion | noc C1×21 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 656 | C1 | c1-u63 | nt-utilidad-uso-c1 | Utilidad y uso en C1: de "hacer uso de" a "ser un trasto" | notion | noc C1×20 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 657 | C1 | c1-u63 | nt-capacidad-competencia-c1 | Capacidad y competencia en C1: ser "un hacha" o "un manazas" | notion | noc C1×10 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 658 | C1 | c1-u63 | nt-facilidad-c1 | Facilidad en C1: "fácil de entender" y los verbos que facilitan o dificultan | notion | noc C1×4 |  | ok | 1 | one of ~60 C1 notion lessons: idiom lists by PCIC notion; candidate to turn into an optional vocabulary track |
| 659 | C1 | c1-u63 | fn-habilidad-c1 | Expresar habilidad en C1: de "soy un hacha" a "soy patoso para..." | function | func C1×5 |  | ok | 2 |  |
| 660 | C1 | c1-u63 | fn-introducir-relato-atencion-c1 | Introducir un relato y controlar la atención en C1: "¿me sigues?" y "¿no te he liado?" | function | func C1×13 |  | ok | 2 |  |
| 661 | C1 | c1-u63 | fn-destacar-silencio-tema-cierre-c1 | Destacar, pedir silencio, cambiar de tema y cerrar en C1 | function | func C1×14 |  | ok | 2 |  |
| 662 | C1 | c1-u63 | task-c1-final | Escribe una reseña crítica | task |  |  | ok | 4 |  |

## Inventory 3: optional deep units (not on the daily path)

| Optional unit | Band | Lesson id | Title | Strand | PCIC refs |
|---|---|---|---|---|---|
| Ser and estar, properly | A1 | gr-atributo-a1 | El atributo con ser | grammar | gram A1×3 |
| Ser and estar, properly | A1 | gr-nucleo-verbal-a1 | Ser y estar sin adjetivo: el núcleo del predicado | grammar | gram A1×11 |
| El or la? | A1 | gr-nombres-propios-a1 | Nombres propios: con o sin artículo | grammar | gram A1×6 |
| El or la? | A1 | gr-masculino-a2 | Más sustantivos masculinos: colores y casos aislados | grammar | gram A2×3 |
| El or la? | A1 | gr-sustantivos-especiales-a2 | Nombres propios con artículo fijo y nombres eventivos | grammar | gram A2×6 |
| El or la? | A1 | gr-numero-sustantivos-b2 | Plurales irregulares: invariables, tónicos y léxicos | grammar | gram B2×8 |
| El or la? | A1 | gr-posesivos-b2 | Los posesivos: forma tónica, fórmulas fijas | grammar | gram B2×5 |
| El or la? | A1 | gr-concordancia-sn-verbo-b2 | Concordancia del sujeto con el verbo: los casos difíciles | grammar | gram B2×4 |
| The article, where English has none | A2 | gr-articulo-definido-valores-a2 | El artículo definido: usos más allá de "the" | grammar | gram A2×5 |
| The article, where English has none | A2 | gr-articulo-indefinido-valores-a2 | El artículo indefinido: valor aproximativo | grammar | gram A2×5 |
| The article, where English has none | A2 | gr-nombres-escuetos-a2 | Nombres escuetos: sin artículo ni cuantificador | grammar | gram A2×3 |
| The article, where English has none | A2 | gr-restrictivos-nominales-a2 | La casa mía, una película apasionante, calle Alcalá | grammar | gram A2×3 |
| The article, where English has none | A2 | gr-articulo-definido-valores-b2 | El artículo definido: valor genérico y "lo" sustantivador | grammar | gram B2×5 |
| The article, where English has none | A2 | gr-articulo-indefinido-valores-b2 | El artículo indefinido: restricciones sutiles | grammar | gram B2×6 |
| The article, where English has none | A2 | gr-nombres-escuetos-b2 | Nombres escuetos: sin artículo, con reglas propias | grammar | gram B2×4 |
| What a noun and an adjective can carry | B2 | gr-complementos-sa-b2 | Complementos del adjetivo: difícil de, interesado en | grammar | gram B2×4 |
| What a noun and an adjective can carry | B2 | gr-complementos-nominales-b2 | Complementos del nombre: ambiguos, no restrictivos, y sus límites | grammar | gram B2×4 |
| Relative clauses, the whole system | B2 | gr-que-explicativo-b2 | "Que" explicativo: la coma que añade, no que elige | grammar | gram B2×3 |
| Relative clauses, the whole system | B2 | gr-subordinadas-relativas-tipos-b2 | Relativas: especificativas, explicativas y sus restricciones | grammar | gram B2×10 |
| Relative clauses, the whole system | B2 | gr-el-que-relativos-b2 | El que, la que, los que, las que: el relativo tras preposición | grammar | gram B2×8 |
| Relative clauses, the whole system | B2 | gr-quien-quienes-b2 | Quien / quienes: solo para personas | grammar | gram B2×4 |
| Relative clauses, the whole system | B2 | gr-relativo-donde-b2 | Donde como relativo: lugares sin repetir "en el que" | grammar | gram B2×4 |
| Relative clauses, the whole system | B2 | gr-subordinadas-lugar-b2 | Oraciones subordinadas de lugar: donde con indicativo o subjuntivo | grammar | gram B2×6 |
| Relative clauses, the whole system | B2 | gr-subordinadas-modo-b2 | Oraciones subordinadas de modo: como y según | grammar | gram B2×4 |
| Adverbs, quantifiers and where they sit | B2 | gr-adverbios-nucleares-b2 | Adverbios: combinaciones, cuantificadores y equivalencia adjetival | grammar | gram B2×6 |
| Adverbs, quantifiers and where they sit | B2 | gr-adverbios-frecuencia-topico-b2 | Adverbios de frecuencia y el adverbio-tópico | grammar | gram B2×7 |
| Adverbs, quantifiers and where they sit | B2 | gr-cuantificadores-numerales-cualquier-b2 | Numerales partitivos/multiplicativos y cualquier/cualquiera | grammar | gram B2×10 |
| Adverbs, quantifiers and where they sit | B2 | gr-nucleo-verbal-copulativos-b2 | Auxiliares, copulativos y pseudocopulativos avanzados | grammar | gram B2×8 |
| Infinitive, gerund and participle beyond the basics | B2 | gr-formas-no-personales-b2 | Infinitivo, gerundio y participio: valores avanzados | grammar | gram B2×8 |
| Infinitive, gerund and participle beyond the basics | B2 | gr-imperativo-valores-b2 | El imperativo: valores más allá de la orden | grammar | gram B2×5 |
| Deixis, implicature and fixed metaphor | B2 | dc-deixis-b2 | La deixis en B2: pronombre enfático, "se" mitigador | discourse | tact B2×5 |
| Deixis, implicature and fixed metaphor | B2 | dc-valores-ilocutivos-b2 | Lo que hace una pregunta en B2: dudas, ecos y retóricas | discourse | tact B2×14 |
| Deixis, implicature and fixed metaphor | B2 | dc-significados-interpretados-b2 | Metáforas fijas: comparaciones con animales y verbos de cambio | discourse | tact B2×4 |
| Discourse structure at C1 | C1 | dc-deixis-c1 | La deixis en C1: el pronombre que desambigua, el que despecia | discourse | tact C1×9 |
| Discourse structure at C1 | C1 | dc-focalizacion-c1 | Focalizar en C1: el artículo que exclama, la dislocación que aclara | discourse | tact C1×8 |
| Discourse structure at C1 | C1 | dc-rematizacion-tematizacion-c1 | Rematización y tematización en C1: el orden que hace la pregunta | discourse | tact C1×11 |
| Discourse structure at C1 | C1 | dc-mantenimiento-referente-c1 | Mantener el referente: proformas globalizadoras | discourse | tact C1×7 |
| The subordinate clause, exhaustively | C1 | gr-sub-adv-causales-c1 | Subordinadas causales en C1: énfasis con "porque" antepuesto, y tres conectores con matiz propio | grammar | gram C1×5 |
| The subordinate clause, exhaustively | C1 | gr-sub-adv-comparativas-c1 | Subordinadas comparativas en C1: cuatro comparaciones con el mismo patrón, y el límite que cuenta o no | grammar | gram C1×13 |
| The subordinate clause, exhaustively | C1 | gr-sub-adv-concesivas-c1 | Subordinadas concesivas en C1: reduplicación universal, ponderación y el escalar "ni siquiera" | grammar | gram C1×7 |
| The subordinate clause, exhaustively | C1 | gr-sub-adv-condicionales-c1 | Subordinadas condicionales en C1: registros, matices y la prótasis que no acaba | grammar | gram C1×10 |
| The subordinate clause, exhaustively | C1 | gr-sub-adv-consecutivas-c1 | Subordinadas consecutivas en C1: intensidad, suspensión y la familia de "de ahí" | grammar | gram C1×18 |
| The subordinate clause, exhaustively | C1 | gr-sub-adv-lugar-modo-c1 | Subordinadas de lugar y de modo en C1: "para donde" y el matiz condicional de "como si" | grammar | gram C1×4 |
| The subordinate clause, exhaustively | C1 | gr-sub-adv-finales-c1 | Subordinadas finales en C1: cuando "para" deja de ser sobre el propósito | grammar | gram C1×13 |
| The subordinate clause, exhaustively | C1 | gr-sub-adv-temporales-c1 | Subordinadas temporales en C1: "antes de" hiperbólico y el filo entre "cuando" y "mientras" | grammar | gram C1×13 |
| The subordinate clause, exhaustively | C1 | gr-sub-sustantivas-c1 | Subordinadas sustantivas en C1: cuándo el infinitivo reemplaza a "que + verbo" | grammar | gram C1×8 |
| The subordinate clause, exhaustively | C1 | gr-sub-adjetivas-relativo-c1 | Subordinadas de relativo en C1: antecedentes especiales y construcciones que se apilan | grammar | gram C1×16 |
| The subordinate clause, exhaustively | C1 | gr-relativos-c1 | Relativos en C1: el cual, quien, y el "que" que rechaza un antecedente entero | grammar | gram C1×15 |
| The noun phrase at C1 | C1 | gr-articulo-definido-c1 | El artículo definido en C1: valor enfático y sustantivador | grammar | gram C1×11 |
| The noun phrase at C1 | C1 | gr-articulo-indefinido-c1 | El artículo indefinido en C1: convertir un nombre propio en un tipo | grammar | gram C1×8 |
| The noun phrase at C1 | C1 | gr-genero-sustantivos-c1 | El género que cambia el significado: el fruto / la fruta | grammar | gram C1×5 |
| The noun phrase at C1 | C1 | gr-numero-sustantivos-c1 | El número en C1: dónde se mueve el acento, qué cambia de sentido | grammar | gram C1×6 |
| The noun phrase at C1 | C1 | gr-demostrativos-c1 | Los demostrativos en C1: proximidad discursiva, condescendencia | grammar | gram C1×7 |
| The noun phrase at C1 | C1 | gr-posesivos-c1 | Los posesivos en C1: cuantificador, sufrimiento, y el "mío" que apela | grammar | gram C1×6 |
| The noun phrase at C1 | C1 | gr-nombres-escuetos-c1 | Nombres escuetos: sin artículo, aunque el verbo lo pida | grammar | gram C1×5 |
| The noun phrase at C1 | C1 | gr-clases-adjetivos-c1 | Cuyo, los adjetivos de color compuestos y el relacional que también califica | grammar | gram C1×5 |
| The noun phrase at C1 | C1 | gr-cuantificadores-propios-c1 | Cuantificadores propios en C1: cuanto, cada uno, cualquiera | grammar | gram C1×20 |
| The noun phrase at C1 | C1 | gr-exclamativos-c1 | Los exclamativos en C1: cuánto + valorativo, dónde, y el orden fijo | grammar | gram C1×6 |
| The noun phrase at C1 | C1 | gr-interrogativos-c1 | Los interrogativos en C1: cuándo se separan, cuándo se coordinan | grammar | gram C1×7 |
| Complements, clitics and agreement at C1 | C1 | gr-complementos-adjetival-c1 | Complementos del adjetivo en C1: interrogativas, superlativos con "lo" y cuantificadores coloquiales | grammar | gram C1×4 |
| Complements, clitics and agreement at C1 | C1 | gr-complementos-nominal-c1 | Complementos del nombre en C1: la ambigüedad como norma | grammar | gram C1×4 |
| Complements, clitics and agreement at C1 | C1 | gr-complementos-verbales-c1 | Complementos verbales en C1: leísmo, laísmo, loísmo y el predicativo del objeto | grammar | gram C1×13 |
| Complements, clitics and agreement at C1 | C1 | gr-concordancia-oracional-c1 | Concordancia ad sensum en C1: cuando el sentido gana a la gramática | grammar | gram C1×4 |
| Complements, clitics and agreement at C1 | C1 | gr-pronombre-personal-c1 | El pronombre personal en C1: desambiguar, personificar, la voz media | grammar | gram C1×14 |
| Complements, clitics and agreement at C1 | C1 | gr-adverbios-conjuntivos-c1 | Adverbios conjuntivos: matizar una coordinación sin ser una conjunción | grammar | gram C1×5 |
| Complements, clitics and agreement at C1 | C1 | gr-adverbios-externos-c1 | Adverbios externos al dictum: el punto de vista que envuelve la frase | grammar | gram C1×4 |
| Complements, clitics and agreement at C1 | C1 | gr-adverbios-nucleares-c1 | Adverbios nucleares en C1: dónde va el modo, y por qué | grammar | gram C1×10 |

## Inventory 4: lessons written but not placed in the course

| Lesson id | CEFR | Title | Strand | Status | PCIC refs |
|---|---|---|---|---|---|
| fn-silencio-a1 | A1 | Pedir silencio | function | reference | func A1×3 |
| fn-identificar-a2 | A2 | Identificar (A2) | function | reference | func A2×3 |
| dc-deixis-personal-a2 | A2 | Deixis personal | discourse | reference | tact A2×4 |
| dc-tematizacion-a2 | A2 | Tematización | discourse | reference | tact A2×3 |
| dc-interrogativos-neutros-a2 | A2 | Preguntas con función neutra | discourse | reference | tact A2×6 |
| gr-interrogativos-b1 | B1 | Interrogativos: qué, quién, cuál + preposición | grammar | reference | gram B1×5 |
| nt-textura-consistencia-b1 | B1 | Textura y consistencia: duro, blando, húmedo | notion | reference | noc B1×7 |
| nt-sentidos-b1 | B1 | Los sentidos: ver, oír, saber a, oler a | notion | reference | noc B1×8 |
| gr-ser-impersonal-b1 | B1 | Ser impersonal: es de noche, es una pena que | grammar | reference | gram B1×4 |
| gr-se-multiuso-b1 | B1 | Se: recíproco, impersonal, meteorológico | grammar | reference | gram B1×5 |
| gr-indefinidos-negativos-b1 | B1 | Algo, alguien, alguno — nada, nadie, ninguno | grammar | reference | gram B1×4 |
| gr-articulo-anaforico-escuetos-b1 | B1 | El artículo anafórico y los nombres escuetos | grammar | reference | gram B1×4 |
| gr-posesivo-dativo-b1 | B1 | El dativo posesivo: le cortaron el pelo | grammar | reference | gram B1×3 |
| gr-modificadores-adverbios-b1 | B1 | Modificadores: el doble de, -mente, elativos | grammar | reference | gram B1×4 |
| gr-participio-adjetival-a1 | A1 | El participio como adjetivo | grammar | reference | gram A1×4 |
| gr-oraciones-actitud-hablante-a1 | A1 | Tipos de oración según la actitud del hablante | grammar | reference | gram A1×4 |
| gr-nucleo-verbal-tipos-a2 | A2 | Tipos de verbo: predicativo, auxiliar, copulativo | grammar | reference | gram A2×3 |
| gr-cuantificadores-b1 | B1 | Cuantificadores B1: cada, alguien/algo/alguno, más de | grammar | reference | gram B1×14 |
| gr-complementos-modificadores-b1 | B1 | La chica de los ojos azules, la construcción del edificio | grammar | reference | gram B1×3 |
| dc-intensificacion-discurso-b1 | B1 | Intensificar: el más... de, -ísimo, kilómetros y kilómetros | discourse | reference | tact B1×5 |
| dc-focalizacion-b1 | B1 | Focalización: solo, sobre todo, ¡qué bien habla! | discourse | reference | tact B1×6 |
| gn-reconocer-generos-orales-b1 | B1 | Reconocer géneros orales: boletín, deportes, contestador | genre | reference | gen B1×4 |
| dc-entonacion-b1 | B1 | Más allá de las palabras: pausas, alargamientos y énfasis | discourse | reference | tact B1×7 |
| gr-subordinadas-sustantivas-a1 | A1 | Oraciones subordinadas sustantivas: infinitivo y "que" | grammar | reference | gram A1×6 |
| gr-oraciones-simples-a2 | A2 | Tipos de oraciones simples: disyuntivas, exclamativas, reflexivas, impersonales | grammar | reference | gram A2×7 |
| gr-nombres-propios-b1 | B1 | Familias, accidentes geográficos y títulos de obras | grammar | reference | gram B1×7 |
| gr-genero-especial-b1 | B1 | Nombres epicenos y cambio de género con cambio de significado | grammar | reference | gram B1×5 |
| gr-numero-sustantivos-b1 | B1 | Singularia y pluralia tantum, y el plural en -y | grammar | reference | gram B1×4 |
| gr-adverbios-modo-cantidad-b1 | B1 | Adverbios de tiempo, cantidad y modo: posición y matiz | grammar | reference | gram B1×13 |
| gr-formas-no-personales-b1 | B1 | Usos independientes del infinitivo, gerundio y participio | grammar | reference | gram B1×17 |
| dc-deixis-b1 | B1 | La deixis: espacial, temporal y personal | discourse | reference | tact B1×10 |
| dc-rematizacion-tematizacion-b1 | B1 | Rematización y tematización: reordenar para destacar | discourse | reference | tact B1×7 |
| dc-negacion-refuerzo-b1 | B1 | Refuerzo de la negación: nadie, hasta, desde | discourse | reference | tact B1×4 |
| gn-generos-orales-b1 | B1 | Reconocer géneros orales: qué exige entender, qué exige producir | genre | reference | gen B1×11 |
