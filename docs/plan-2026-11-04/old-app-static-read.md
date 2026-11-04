# The original app, read day by day (4 November 2026)

What a new learner is served on A1 days 1 to 14 and on B1 day 1, found by running the app's own selection code (`js/session.js` `buildContext`, `StageReview.pool`, `SRS.batch`, `Checker`) in a Node sandbox for a learner who finishes every stage and gets every review right. Nothing here was played in a browser (the live drive is Stage 0 of the plan). For a lesson met for the first time the Apply and Produce picks are seeded by lesson id, so those are exactly what a real learner sees; verb days, the review deck and passage tie-breaks use randomness and could differ in detail.

## A. Verdict

1. The opening unit's readings are the best thing here: short, natural, glossed, on theme.
2. The lesson prose is mostly clear and kind to a beginner, and weakens where two source lessons were stitched together.
3. The practice stages do not follow the lesson. Day 1, after a lesson on meeting someone, Apply drills the present tense of *diseñar*, *nadar*, *hacer* and *insistir*, three days before the present tense is taught, and Produce asks for "something about your training or education".
4. B1 has the same gap: day 1 teaches the present subjunctive and none of the 11 practice items uses it.
5. The review deck calls brand-new words "things you have met before" (7 of 7 on day 1) and sits at about 27 cards every day from day 2.
6. Several passages are vocabulary lists dressed as prose; days 2, 12 and 13 are near-clones of one bureaucratic template.
7. Multiple-choice questions can often be beaten without reading: the right answer is the longest option in 14 of 28.
8. Closing the app after Learn, or tapping "Do today's session again", moves the learner on to tomorrow's lesson; "Next up" skips a day.
9. The writing checker rejects good on-topic beginner sentences, and the unit's final task ("Preséntate") never gives a box to write in.
10. Promising bones, with daily practice too often unrelated to the day. About 2.8 out of 5 for the first fortnight.

## B. Strengths

- The opening unit's readings keep the learner inside the unit's world (`data/course.js` names a reading per day in units 1 and 2). Day 1: "Son las nueve de la mañana. Hay dos estudiantes en la cafetería..." ending "Bueno, un poco. Todavía no hablo rápido." Days 5, 9 and 10 are the same quality. Day 11 re-reads day 1 on purpose.
- Lessons open with "After this you can...", an optional two-line "moment", then "The words you need".
- Some prose is excellent for a real beginner: "*Gracias* on its own is complete and always enough", "You cannot say *muy gracias*", "Getting this right changes your meaning, not just your accuracy", "banana in English is three different vowel sounds; banana in Spanish is the same a three times".
- "Have a guess first" asks one question before the explanation; a wrong answer gets "No matter, that is what the lesson is for. Read on."
- New review words are drawn from that day's passage (day 2: *el banco, la cartera, el número, cuál, aquí*, all in "En la comisaría").
- Passage tense gating holds: all 14 A1 passages are present-tense only; the preterite is held to course day 47.
- Recognition-first scaffolding at A1 (ES to EN choice reviews, word bank in Apply).
- Habit copy with no guilt: "3 of 30 days"; "Welcome back. Your place is saved."
- The live writing checklist catches a real person error as you type.

## C. Weaknesses, ranked

1. **Apply and Produce ignore the day's lesson and sit above the learner's level.** Day 1 Apply: "Estoy ___ cansada hoy." (muy/mucho); "Ella ___ (diseñar) la portada de la revista."; "¿Qué ___ (hacer) vosotros los domingos?"; "Ella siempre ___ (insistir) en pagar la cuenta." Produce: "The new mayor is very young."; "I need an appointment for Monday."; "Say something about your gym or team."; "Say something about your training or education" (model "Tengo una formación en marketing digital."). The code says it is deliberate: "THE FLOOR. The present indicative is not gated". The word bank draws wrong options from other tenses, so day-1 items offer forms from tenses never seen. Over 14 days Apply uses 36 distinct verbs including *contaminar, gestionar, madrugar, reciclar*; vosotros forms recur. Produce runs ahead too: day 3 "I am saving money for a trip" (gerund never taught), "I am going to vote on Sunday" (*ir a* never taught). Day 6 (ser/estar) shows what it could be: everything aligned.
2. **B1 day 1 has the same mismatch, more sharply.** The lesson "El subjuntivo: cómo se forma y cuándo aparece" is clear. Apply: imperfect, preterite, a pronoun choice, present cloze. Produce: five unrelated tasks. The reading is an A1 present-tense list of professions, labelled "focus".
3. **The review deck tells the learner they have met words they have not, and is saturated from day 2.** Day 1: 7 cards, all new (*hola, buenos días, gracias, dos, nueve, el día, mañana*), before the lesson. Days 2 to 14: 27 or 28 cards (cap 20 plus 7 new); the deck grows about 20 to 25 items a day (7 words, 6 phrases, 2 to 5 recall, about 6 verb-tense cards); `learn.js` itself warns "would put ~25 items a day into a queue that drains 20". B1 day 1 types never-shown words EN to ES. Data errors: "la carne = the meat" from "el carné" (accent folding), "el simpático", "el primer", a bare dash as an answer with no explanation.
4. **Bugs that throw away a day.** Finishing Learn saves `beginnerDay + 1` and marks the lesson studied at once (`session.js:914-916`); the rest of the session lives in memory. "Hacerla otra vez" rebuilds from the advanced counter. `nextUp()` adds 1 to a counter that has already moved on. Closing mid-Review is safe (grades saved per card).
5. **Passage quality.** Lists in costume (day 4 bag contents; day 3 adjective list; day 14 "Hay soldados, un general y mucho ejército"). Incoherent day 7 family passage. Clone templates (days 2, 12, 13). Unnatural lines ("Hay un robo: no tengo mi cartera"; the officer at the station says "Vamos a llamar a la policía del barrio"). Question flaws: feminine options for a male brother; "¿Por qué está Tom en Madrid?" when Madrid is never named; "¿Quién vive con Daniel?" not in the text. Longest option right in 14 of 28; only option quoted verbatim in 10 of 28. The completion copy says "it stays in the rotation" but the scheduler prefers unread passages.
6. **Lesson prose: clear at the core, rough at the seams.** Day 1 promises "a whole first meeting, start to finish" under "Read it first" and shows no dialogue. Day 1 says "Nobody says *yo*", then the passage has "Yo soy Ana" and day 8 teaches "Yo soy Laura". Spanish sub-headings mark stitching seams (days 5, 7, 8, 10). Scope creep: letter openers and colon-versus-comma on day 5, stem changers on day 4. Register labels tag "¿Cómo te llamas?" as *coloquial*. "the app's voice is peninsular, so you will hear the 'th'". Bodies 167 to 330 words plus tables and 4 to 8 checks. Spanish titles at A1 ("Los sonidos: cinco vocales y nada más").
7. **Writing: a keyword gate stands in for checking.** "Compare with model" disabled until the checklist passes; "Estudio en la universidad." fails "training or education" because the gate wants *formación/especialización/maestría*; "Necesito cita lunes" passes; hints give the answer ("include 'cita'"); day 11's task "Preséntate" has no writing box.
8. **Quick-check free recall graded on exact English strings** ("bouncing the question back").
9. **Session length and monotony:** about 55 to 60 screens per A1 day against "about fifteen minutes"; 30 of 84 Apply items repeat in 14 days ("¿Qué ___ (hacer) vosotros los domingos?" four times); 6 of 56 Produce tasks repeat.
10. **Copy and tone:** dashes everywhere ("Open it, work through the five stages, and you are done — about fifteen minutes"); onboarding names a "Lecciones" tab that does not exist; placement speaks in CEFR codes and starts at B1 with subjunctive items; the post-session "Copy and send to Matthew" modal opens on its own; mixed stage names; jargon ("spaced review", "Memory strength", "by register").
11. Not assessed from reading: layout, games, arcade, league, look-up findability, timings.

## D. Day-by-day log, A1 days 1 to 14 (simulated)

| Day | Lesson | Passage | Repeated | Rating |
|---|---|---|---|---|
| 1 | Dos personas se conocen | En la cafetería de la facultad | none | 3 |
| 2 | Los sonidos: cinco vocales y nada más | En la comisaría | none | 2 |
| 3 | New verbs: ser, estar, llamarse, tener, haber | Mi hermano pequeño | none | 2 |
| 4 | Presente | ¿Qué llevas en el bolso? | none | 3 |
| 5 | Saludar: en persona y por escrito | En la recepción | Apply from days 1, 4 | 4 |
| 6 | Ser vs. Estar | Cómo es Javier, cómo está hoy | 3 cloze, 1 write | 4 |
| 7 | De dónde eres y cuántos años tienes | La edad de cada uno | 4 Apply, 1 build | 2 |
| 8 | Identificar: qué es y quién es | Los vecinos del piso | 4 Apply | 3 |
| 9 | Dar las gracias | La vecina nueva | none | 4 |
| 10 | Empezar y terminar una conversación | Hola y adiós en la escalera | "Hoy ___ martes" 3rd time | 3 |
| 11 | Preséntate (unit task) | En la cafetería (deliberate) | 1 translate | 2 |
| 12 | Los interrogativos | En el banco | 5 Apply | 3 |
| 13 | El acento | La tarjeta no funciona | 3 Apply, 1 write | 3 |
| 14 | New verbs: querer, poder, ir, hacer, dar | Guerra y paz | 2 tasks, "hacéis" 4th time | 1 |

B1 day 1: lesson "El subjuntivo", passage "Un día en distintas profesiones" (A1), no subjunctive practice, 5 never-seen typed words. Rating 2.

## E. The five changes a learner would want first

1. Make Apply and Produce come from today's lesson and today's world; give the unit task a writing box; at B1 drill the subjunctive on subjunctive day.
2. Show new words before testing them; cap the review at a visible size; fix the data faults.
3. Never lose or skip a day: save the place, make "Do it again" repeat today, fix "Next up".
4. Rewrite list-like passages as small stories with recurring people; fix the question faults; balance option lengths.
5. Let good beginner sentences through; remove dashes, register jargon, the phantom tab and the automatic modal.
