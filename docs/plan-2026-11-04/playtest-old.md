# Baseline playtest of the original app (4 November 2026, before any change)

Played in headless Chromium through Playwright on a worktree at commit 25c2f521 (the state before the plan's first commit): 69 daily sessions (A1 days 1 to 30, A2 5, B1 10, B2 9, C1 15), 4 interrupted sittings, 1 desktop session, phone viewport 390x844, service worker and all outside requests blocked, the clock moved a day per session. 5,840 text dumps and 4,737 screenshots were produced in the session scratchpad and are not kept; the tables below are the durable record.

The bot answered reviews only from pairs the app had shown, guessed otherwise, pressed Reveal on typed cards it could not know, answered reading and practice correctly from the data except where untaught grammar was needed, and typed the model answer on writing tasks. Minutes are estimated at 10 s per card, 15 s per build, 45 s per write, 2 min per paragraph, 10 min per essay, lesson text at 150 wpm, passage read twice at 70 wpm (A bands) or 110 wpm (B and C).

## A. Verdict

1. Technically solid: zero JavaScript errors and zero stuck screens; "about 15 min" holds at A1 (14.9 min average).
2. The A1 lessons are the best part: clear English, real examples, an opening fortnight inside one world.
3. The stages after Learn mostly ignore the lesson: 7% of A1 Apply items and 5% of writing tasks target the day's lesson; 0% at B1, B2 and C1.
4. B1 day 1 teaches the subjunctive with no subjunctive in the reading, Apply or writing (every subjunctive drill is level 4 or higher; the lesson is level 3).
5. Review asks for words before they are shown: 66 to 82% of new review words per band, under "7 things you have met before".
6. The review queue grows without limit: 0 due on day 1, 102 on day 12, 212 on day 30, while a session clears about 20.
7. Practice repeats: 80 distinct Apply sentences fill 180 A1 slots; one sentence appears on six days.
8. Readings decay from day 14 into word lists with 4 glosses, and B1 to C1 learners mostly read level-1 texts.
9. Placement is unsafe at both ends; closing after Learn silently skips the rest of the day.
10. A learner would stay for the lessons and leave because the rest of the session is not about the lesson.

## B. Baseline numbers

| Measure | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| Sessions played | 30 | 5 | 10 | 9 | 15 |
| Estimated minutes per session | 14.9 | 16.4 | 16.6 | 20.4 | 20.4 |
| Screens per session | 74 | 73 | 76 | 81 | 90 |
| Review cards per session (incl. re-asks) | 31 | 30 | 28 | 33 | 42 |
| New review words asked before ever shown | 67% | 82% | 66% | 72% | 66% |
| Apply items on the day's lesson | 7% | 20% | 0% | 0% | 0% |
| Apply items needing untaught grammar | 26/180 | 3/30 | 0/60 | 0/54 | 0/90 |
| Writing tasks on the day's lesson | 5% | 15% | 0% | 0% | 0% |
| Apply sentences repeated from an earlier day | 100/180 | 1/30 | 8/60 | 1/54 | 8/90 |
| Writing tasks repeated | 34/120 | 0/20 | 6/50 | 2/45 | 5/71 |
| Readings at passage level 1 | n/a | 3/5 | 9/10 | 6/9 | 6/15 |
| Reading MCQs where the right answer is the longest option (chance 33%) | 55% | 60% | 75% | 78% | 73% |
| Reading MCQs right by picking the option sharing most words with the text | 75% | 90% | 100% | 83% | 80% |
| Quick-check MCQs where the right answer is the longest | 35% | 60% | 24% | 59% | 83% |
| Dashes on screen per session | 66 | 41 | 46 | 56 | 37 |
| JavaScript errors | 0 | 0 | 0 | 0 | 0 |

## C. Strengths

Lessons explain in plain English what an English speaker gets wrong ("Nobody says yo. Spanish puts the person into the verb ending"; "Spanish counts the last twenty minutes of the hour DOWN toward the next one"). The hand-picked opening fortnight reads natural short dialogues with 18 to 23 glosses. The unit frame is visible on Home. The writing checklist catches structural errors. The C1 essay flow has the right shape (situation, plan, checklist, model, rubric). Practice outside the session is rich and works offline. The phone layout is clean.

## D. Weaknesses, ranked

1. The session does not practise the lesson it just taught (only the two tense or contrast lessons in 30 days get matching items; B1 subjunctive day drills preterite; B2 "Cortesía atenuadora" is followed by "Yo ___ (nadar) en la piscina").
2. Review tests what was never taught and cannot keep up (490 items enrolled by A1 day 30; C1 from 0 to 129 due in 15 days).
3. Readings stop teaching after the fortnight and upper bands read beginner texts ("Organizando la casa" served at A1 day 18, A2 day 3, B1 day 3 and C1 day 12; B2 got "buenas tardes" as a new word).
4. Practice repeats and its vocabulary is far above the learner (gestionar las redes sociales at A1; verb days arrive after the verbs have been drilled).
5. Untaught grammar on early days (present before day 4, ser/estar choices before day 6, gerund and commands in models, 11 of 180 items with vosotros, subjunctive distractors in the word bank from day 4).
6. The writing checker passes wrong Spanish ("Yo gusto la música", "cita necesito") and blocks right short sentences ("Yo como pan"), and the checklist gives the target words away.
7. Questions answerable without reading (longest option 65% overall; word-matching 82%) or not answerable at all (typed English explanations; a bare dash as an option; placement item with options "abro / abriera / abro").
8. Placement misplaces both ends (a true beginner's first question is a B1 item in Spanish; 9 of 9 lands in C1 on 3 items).
9. Interruption loses work silently (restart doubles the day's new words; closing after Learn skips the day).
10. No look-up, no list of past readings, no verb table outside a lesson, "due" only ever a number.
11. Copy: a phantom "Lecciones" tab; mixed languages; "NAN MIN" on Jugar; the "Copy and send to Matthew" modal; 37 to 66 dashes a session; a C1 essay labelled B2.
12. Session shape: 74 to 90 screens; lessons 4,800 to 7,200 px tall on a phone; essays only on course indexes divisible by 7 (B2 got none in 9 sessions); the phone tab bar stretched across 1280 px on desktop.

## E. A1 day log (days 1 to 30)

Cards are Review / Learn check / Comprehend / Apply / Produce. "On" is Apply·Produce items the app's own matcher ties to the lesson; "Untaught" items need grammar not yet taught; "Cold" is new review words asked before being shown.

| Day | Lesson | Passage | Scr | Cards | Min | On | Untaught | Cold | Repeats |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Dos personas se conocen | En la cafetería de la facultad | 57 | 13/4/4/6/4 | 12.5 | 0·0 | 6·0 | 7 | |
| 2 | Los sonidos | En la comisaría | 75 | 32/4/4/6/4 | 15 | 0·0 | 5·0 | 4 | |
| 3 | New verbs: ser, estar, llamarse, tener, haber | Mucho carácter | 73 | 31/5/4/6/4 | 12 | 0·0 | 6·1 | 6 | 1 write |
| 4 | Presente | ¿Qué llevas en el bolso? | 74 | 30/7/4/6/4 | 14.2 | 6·3 | 0·0 | 6 | |
| 5 | Saludar | En la recepción | 83 | 33/8/4/6/4 | 17.8 | 0·0 | 1·0 | 6 | 2 apply |
| 6 | Ser vs. Estar | Cómo es Javier | 71 | 31/3/4/6/4 | 14.1 | 6·3 | 0·0 | 4 | 5 apply |
| 7 | De dónde eres y cuántos años tienes | La edad de cada uno | 78 | 31/8/4/6/4 | 18 | 0·0 | 1·0 | 5 | 4 apply, 1 write |
| 8 | Identificar | Los vecinos del piso | 72 | 28/8/4/6/4 | 17.7 | 0·0 | 0·0 | 3 | 4 apply |
| 9 | Dar las gracias | La vecina nueva | 71 | 30/4/4/6/4 | 14.5 | 0·0 | 0·0 | 5 | |
| 10 | Empezar y terminar una conversación | Hola y adiós en la escalera | 74 | 30/7/4/6/4 | 15.3 | 0·0 | 0·0 | 2 | 3 apply, 1 write |
| 11 | Preséntate | En la cafetería (repeat of day 1) | 67 | 28/4/4/6/4 | 14.7 | 0·0 | 1·0 | 0 | 3 apply, 1 write |
| 12 | Los interrogativos | En el banco | 70 | 29/4/4/6/4 | 15.8 | 0·0 | 1·0 | 5 | 5 apply |
| 13 | El acento | La tarjeta no funciona | 74 | 30/5/4/6/4 | 14.4 | 0·0 | 1·0 | 5 | 3 apply, 1 write |
| 14 | New verbs: querer, poder, ir, hacer, dar | Una excursión | 69 | 29/5/4/6/4 | 11.6 | 0·0 | 0·0 | 5 | 3 apply |
| 15 | La entonación y la cortesía | En la recepción (repeat) | 80 | 32/8/4/6/4 | 17.5 | 0·0 | 0·0 | 5 | passage, 2 apply, 2 write |
| 16 | Los pronombres sujeto | El trabajo de una traductora | 80 | 35/4/4/6/4 | 16.6 | 0·0 | 0·0 | 6 | 3 apply |
| 17 | Practice day | Un país con rey | 70 | 33/0/4/6/4 | 11.5 | 0·0 | 0·0 | 6 | 3 apply, 2 write |
| 18 | Pedir y dar información | Organizando la casa | 80 | 33/8/4/6/4 | 18.7 | 0·0 | 1·0 | 6 | 4 apply |
| 19 | Pregunta cinco cosas | Un regalo | 66 | 28/4/4/6/4 | 13.1 | 0·0 | 1·0 | 3 | 3 apply, 2 write |
| 20 | Dirigirse a alguien | En el baño | 83 | 34/8/4/6/4 | 16.6 | 0·0 | 1·1 | 5 | 3 apply, 1 write |
| 21 | New verbs: saber, conocer, ver, decir | Los vecinos y la ley | 74 | 32/5/4/6/4 | 12.1 | 0·0 | 0·0 | 6 | 4 apply, 3 write |
| 22 | Disculparse | La prensa del domingo | 71 | 30/4/4/6/4 | 13.5 | 0·0 | 0·1 | 5 | 6 apply, 2 write |
| 23 | Acuerdo y desacuerdo | Ropa para el invierno | 78 | 32/8/4/6/4 | 17.2 | 0·0 | 0·0 | 6 | 2 apply, 2 write |
| 24 | Practice day | Una vida sana | 66 | 31/0/4/6/4 | 11.3 | 0·0 | 0·0 | 5 | 6 apply, 1 write |
| 25 | Sí, no, también, tampoco | La planificación financiera | 78 | 34/4/4/6/4 | 15 | 0·0 | 0·0 | 4 | 5 apply, 2 write |
| 26 | La misma petición, tres veces | En la farmacia | 78 | 34/4/4/6/4 | 14.2 | 0·0 | 1·0 | 5 | 4 apply, 3 write |
| 27 | Cantidad | Dos amigos diferentes | 76 | 30/8/4/6/4 | 17.2 | 0·0 | 0·0 | 2 | 6 apply, 2 write |
| 28 | Los numerales | Los vecinos del piso (repeat) | 71 | 30/4/4/6/4 | 14.6 | 0·0 | 0·0 | 4 | passage, 5 apply, 1 write |
| 29 | New verbs: hablar, trabajar, vivir | El tren de las siete | 78 | 34/5/4/6/4 | 12.5 | 0·0 | 0·0 | 5 | 6 apply, 4 write |
| 30 | La hora, los días y la frecuencia | Una semana difícil de salud | 84 | 34/8/4/6/4 | 18.9 | 0·0 | 0·0 | 5 | 6 apply, 2 write |

Upper bands in brief: A2's imperfect day read a mostly preterite passage with four glosses; B1's 10 sessions had no item on any lesson and read 9 level-1 texts; B2's first reading was an A1 stair dialogue; C1's 15-lesson unit on texture, smell and colour played as a long run of word lists, with "Organizando la casa" on day 12; essay days had 3 tasks instead of 5.

## F. What a learner would change first

1. Make every stage after Learn practise that lesson, at the learner's band.
2. Never ask what was never shown, and size enrolment to what review can clear.
3. Replace word-list readings with real short texts, never reused across bands, every one glossed; questions that need the text.
4. A writing checker that says what is wrong and does not block short correct sentences.
5. Keep the learner's place; add look-up, verb tables and a list of past readings.

These are the targets the plan's Stages 1b to 4 set; the re-drive after each stage measures them against this table.
