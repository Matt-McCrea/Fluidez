# Re-drive 4 of the app on the re-sequenced course (5 November 2026, working tree on ba7ae372)

Same method as drive 3, on the uncommitted working tree that carries the 640-day course (copied with rsync, served from 127.0.0.1, every other host blocked so the league never reached Supabase). A1 from placement "New to Spanish" through days 1 to 30, wrong answers on the drive-3 schedule, Five minutes after days 10 and 22, the Unit done cards; a placed B1 learner for five days from day 267; a placed C1 learner for two days from day 540; a learner reconciled from the old course at beginnerDay 60; Lecciones with a merged lesson, the library, Buscar, Progreso, the placement ladder answering everything right; a desktop pass at 1280 of two A1 days and one B1 day. 5,901 logged screen states. Zero page errors, console errors, overflow or app-caused stuck screens. No file in js/ was changed.

## Verdict

1. Technically clean, and every lesson day served its script: 22 of 22 A1 lesson days, 5 of 5 B1, 2 of 2 C1, 5 of 5 reconciled, 0 fell back to the prose page. The cross-band load works: the reconciled learner's day 71, `fn-preguntar-preferencias-a2`, loaded its script from the A2 file (day 39's `gr-presente-irregular-a2` is the first such A1 day and is past day 30; a static check finds a script for every path lesson in all five bands).
2. The worst finding: **no Review day is ever served on the paced path.** `doneAlready` in `pickFocus` (js/session.js, line 446) skips any practice day whose unit has every lesson studied, and by a week's Review day every lesson of the week is studied. Days 23, 28 and 33 of the course (the Review days of a1-w003, w004, w005) were each skipped the morning after the week's last lesson. So after unit 2 the learner never sees a Unit done card, never gets the unit check, and the week shape is Introduce, Drill, Input and straight on. In 30 sessions the A1 learner walked 5 Introduce, 3 Drill, 3 Input, 0 Review, 0 Output days and finished on course day 32. A probe with the skip removed (in the drive copy only, reverted) served w003's Review day with the Unit done card "Unit 3 done: Ask, count, want (1 of 6)".
3. The same skip starves the reconciled learner: it lands on course day 70 (a1-w014, `fn-cortesia-condicional-a1`), not 67 or 68, with the expected catch-up queue of 10 lessons in spine order, but the first catch-up lesson is served only on session 5, when a Drill day comes round; the four practice days before it were skipped. With the probe fix, session 1 is w013's Review day and it serves `fn-no-entiendo-a1`.
4. Drill days drill the week's lesson only when the lesson is a verb point. By tags all 18 Drill Apply items hit the Introduce lesson, but the gaps tell a different story: the Gender and articles drill asked six verb endings (alquilar, conectar, gestionar, estar, reciclar) and one negation; the adjective-gender drill asked tener, an article and two "who is doing it"; only the yo-irregular drill was on point. The Introduce days for articles, plurals and adjective gender have the same gap.
5. A Drill day says two things: Home reads "Drill: Gender & articles", the Learn page reads "Practice & review day. No new grammar today", there is no recap of the rule, and New today still adds 12 unrelated words.
6. Teach before test still holds everywhere: 0 of 418 new A1 words asked before shown, 0 of 76 at B1, 0 of 6 at C1, none for the reconciled learner.
7. Sessions: days 1 to 14 at 81 screens and 16.5 minutes, as drive 3; days 15 to 30 at 91 and 18.7. In the new weeks an Introduce day is 107 screens and 22.1 minutes (up to 24.5), a Drill day 73 and 13.5, an Input day 95 and 19.9. Due on Home sits at 27 to 40 from day 20.
8. Drive-3 fixes held: New today clears on Got it; read-and-pick no longer advances after a wrong pick and after a right one waits 2.6 to 5.2 s for a 9 to 19 word why (B1 and C1, all advanced); Five minutes no longer re-asks the day's phrases (day 10: a chapter page, 0 cards; day 22: a re-read); a read-the-form item with two finite verbs now bolds the one it asks about; C1 reads level 8 and 9 passages (drive 3: level 1); the A1 theme offer is six themes; Build it fired on 6 of 30 days (drive 3: 1).
9. B1 and up never see the week shape: those profiles are not paced (`usesCurriculum` is false above A2), so they walk the next unstudied lesson and the course's Drill and Review days do not exist for them. Home counts "DÍA 1 DE 4" then "DÍA 3 DE 4".
10. The interface is Spanish from B1 (commit 1c5851e0), but unit titles, goals, the session summary and parts of Progreso are still English under it.
11. The placement ladder from "New to Spanish", every answer right, lands at B1 (b1-w058, "Start at B1, unit 58") in 14 items; from "I have studied it" it lands at C1 unit 122.
12. Merges work: `fn-disculparse-a2` opens `fn-agradecer-a1`, and Dar las gracias lists Disculparse under Understand this better.

## Numbers (A1 days 1 to 14)

| Measure | Baseline | Drive 1 | Drive 2 | Drive 3 | Drive 4 |
|---|---|---|---|---|---|
| Screens | 72.0 | 67.4 | 93.2 | 80.2 | 81.1 |
| Minutes | 14.8 | 15.8 | 16.7 | 16.5 | 16.5 |
| Due on Home | 0 to 102 | 12 to 25 | 10 to 25 | 12 to 23 | 12 to 23 |
| Cold words | 67% | 0/217 | 15/199 | 0/196 | 0/200 |
| Apply on node | 14% | 51% | 79% | 78% | 80% |
| Produce on node | 11% | 63% | 82% | 88% | 88% |
| Untaught Apply | 22/84 | 0 | 0 | 0 | 0 |
| Readings in gate | n/a | 0/14 | 14/14 | 14/14 | 14/14 |
| Repeats within 14 days | 26% | 45% | 1.3% | 1.9% | 1.9% |
| Longest right, reading / read-and-pick | 55% | 36% | 32% / 23% | 29% / 23% | 32% / 23% |
| Longest run of one shape | | 4 | 6 | 4 | 4 |
| Dashes per session | 66 | 22.6 | 2.1 | 0 | 0 |
| Chapters served | 0 | 0 | 2 | 2 | 1 |
| JavaScript errors | 0 | 0 | 0 | 0 | 0 |

A1 days 15 to 30 (drive 3 in brackets): 91 screens (89), 18.7 minutes (18.7), due on Home 12 to 44, review 31.5 cards a session (32.3), 0 cold of 218, Apply on node 71% (51%), Produce 67% (53%), 13/16 readings in gate, repeats 1.7%, 0 dashes, chapters on days 15, 22, 26 and 29, Build it on days 20, 23 and 26 (6 of 30 in all, drive 3: 1), scenes 0, About me 4, longest right 30% reading and 20% read-and-pick.

The new weeks, days 20 to 30: Apply on node 94% and Produce 86% by tags (Drill days 18/18 and 11/12 on the Introduce lesson), 0 untaught, 0 cold of 146, repeats 0.8%, 8/11 readings in gate, New today 12 words every day.

B1 from day 267, five days: 95 screens, 24.5 minutes (19.6 to 28.5), due 0, 15, 27, 23, 28, 0 cold of 76, Apply on node 53%, Produce 32% (day 3, Ser impersonal, 0/6 and 0/5), readings level 3 with 3/5 in gate, B1 chapters 1 and 2 of the story on days 2 and 4, longest right 1/16 reading and 4/24 read-and-pick, 3 dashes (one lesson title), 0 errors. C1 from day 540, two days: 81 screens, 23.9 minutes, passages level 8 and 9 (0/2 in gate), Apply on node 4/12, Produce 2/10 (day 2 0/6 and 0/5). Reconciled, five sessions: 65 to 129 screens, 15.1 to 23.6 minutes, 0 cold words, 0 errors.

## The first five weeks now

Weeks one and two are unchanged (a1-u01, days 1 to 12, a1-u02, days 13 to 19) and Unit done arrives on days 12 and 19 as before, the theme picked at 19. From day 20 the learner meets the new weeks, but without their last day:

| Day | Course day | Week | Kind | Served |
|---|---|---|---|---|
| 20 | 20 | a1-w003 | Introduce | Gender and articles (script, Build it) |
| 21 | 21 | a1-w003 | Drill | "Drill: Gender & articles" on Home, practice page in the session |
| 22 | 22 | a1-w003 | Input | No entiendo: frases para sobrevivir (script, chapter) |
| | 23 | a1-w003 | Review | skipped |
| 23 | 24 | a1-w004 | Introduce | Tengo, hago, pongo, salgo (script, Build it) |
| 24 | 25 | a1-w004 | Drill | Drill: the yo irregular |
| 25 | 26 | a1-w004 | Input | New verbs: hablar, trabajar, vivir, llamar, quedar |
| 26 | 27 | a1-w004 | Introduce | El plural de los sustantivos (script, Build it, chapter) |
| | 28 | a1-w004 | Review | skipped |
| 27 | 29 | a1-w005 | Introduce | El género del adjetivo (script) |
| 28 | 30 | a1-w005 | Drill | Drill: El género del adjetivo |
| 29 | 31 | a1-w005 | Input | Cantidad: números, más y menos (script, chapter) |
| 30 | 32 | a1-w005 | Introduce | Sí, no, también, tampoco (script) |
| | 33 | a1-w005 | Review | skipped; day 31's Home opens a1-w006 |

## The reconciled learner

Seeded with the old course's progress (beginnerDay 60, A1, the 44 lessons of old days 0 to 59 studied, the old A1 fingerprint). On first open the app re-fingerprints, keeps all 44 marks, and writes `catchUp`: fn-no-entiendo-a1, gr-presente-yo-irregular-a1, gr-numero-sustantivos-a1, gr-presente-irregular-a2, gr-infinitivo-usos-a1, gr-imperfecto-estados-a1, nt-existencia-inexistencia-a2, gr-pronombres-me-te-nos-a1, gr-articulo-definido-a1, dc-conectores-a1. `reconcileProg` puts them on course day 68 (fn-acuerdo-a1, studied); the skip loop then passes it and w013's Review day and Home opens on day 70, a1-w014, Me gustaría, quería, ¿podría…? Sessions 1 to 4 were Introduce or Input days (w014's Output and Review days and w015's Review day were skipped too). Session 5, the Drill day of El pronombre se, became the catch-up lesson No entiendo, as a script, Home labelled with its title; the queue went to 9 and the week lost its drill. At one catch-up per surviving practice day the queue takes about ten weeks.

## Broken screens

1. Every Review day is skipped (`doneAlready`, js/session.js 446), so no Unit done card after unit 2, no unit check, and the catch-up queue waits (above).
2. The Drill day's Learn page says "Practice & review day. No new grammar today" (js/views/learn.js 893) under a Home card that says "Drill: <lesson>"; the session summary says "Lesson: Drill day".
3. A lesson opened from Lecciones or by a merged id starts with "New today · 12" unrelated words before the lesson.
4. At B1 the Home card counts days 1 then 3 of a week (practice days are not served above A2).
5. Gramática shows a merged lesson (Disculparse) as its own unticked L2 lesson although the learner studied its target (grammar.js reads `studied[l.id]`, not `Lessons.isStudied`).
6. The B1 lesson title "Estar de acuerdo — y no estarlo" carries an em dash onto the opener, the close and the summary.

## What a learner notices

Good: a script every lesson day, Colombian and well made, including the A2 one on an A1 day; nothing asked cold; the yo-irregular week is the best of the new weeks, its drill asks tengo, salgo, tienes and who is doing it; the bolded verb in two-verb sentences; the why after a right pick now stays long enough to read and a wrong one stays until you move on; Five minutes is a story page, not a re-ask; Build it is back on the lesson days; the C1 learner reads C1 texts; the placement ladder can now reach B1 and C1; the desktop layout holds at 1280 on every screen type.

Bad: the week never closes, so after day 19 there is no "unit done" moment at all; "Drill" on Home turns into "Practice & review day, no new grammar" on the next screen, and the gender drill is verb endings; 12 new words every day whatever is due (40 on day 23), unrelated to the lesson (tío, pierna, árbol and flor on the yo-irregular day), as a 1,452 px card on desktop; a theme offer on Home at every week start (every four or five days at A1, every second session at B1); weeks are called units ("Unit 3 done: Ask, count, want (1 of 6)", "Unit 6 of 30", six rows of "Ask, count, want" in Lecciones, "0 of 1 lessons"); goals that read as generated ("I can know whether a noun takes el or la", "I can use tiempos verbales de indicativo as C1 uses it"); at B1 and C1 a Spanish interface with English unit titles, goals, session summary ("Reviewed 0 items", "Quick check") and Progreso blurbs; the old "¿Cuántos años ___ (tener) tú?" again on day 30; a preterite distractor (logré) on day 20.

## Fixes made during the drive

None in js/. In the bot only (scratchpad redrive4/bot):

1. `pagebot.js`: Apply and review choice prompts compared without the `*stars*` that mark the asked verb in two-verb read items; without it the bot stood on "Who is doing it?" (days 5, 7, 9 aborted) and then could not reach Five minutes on day 10.
2. `instrument.js` and `pagebot.js`: B1 and up show Spanish chrome, so the bot records every `Profile.term` pair and reads Spanish buttons and headings as their English, never translating learner content (word chips, options, cloze text, cards); the review box's placeholder is "escribe en inglés".
3. `runner.js`: read-and-pick advance measured up to 12 s instead of 4 s (A1 figures were taken with the 4 s cap; B1 and C1 with 12 s).
4. `a1.js`: back to Home before Five minutes if a session ends elsewhere; `a1.js` and `placedAt.js` log `Session.today()` (kind, label, catch-up); the audit records the Drill day's Introduce lesson and which items hit it.
5. New drivers: `reconcile.js`, `tours4.js` (Lecciones rows inside closed units are clicked through the DOM; Sound natural left out), `desk5.js`, `probe-review.js`, `analyze4.js`.

The probe that removed the Review-day skip was a one-line change in the served copy of js/session.js, reverted straight after and checked identical to the repo.

## Fix list (ranked)

1. Serve the Review day: in `pickFocus`, never skip a practice day with a `kind` because its unit's lessons are studied; keep the skip only for a unit the learner cleared by hand or by unit check before reaching it (a flag written by `UnitCheck.setUnit`), and check the Unit done card offers the unit check on a Review day (the probe's card did not show "Take the unit check"; day 12's did). This also lets catch-up lessons arrive weekly from the first session.
2. Drill days and Introduce days for non-verb points: pick bank items whose gap is the lesson's own token (the article, the plural ending, the adjective ending, también or tampoco), not any row that contains one; the tag hit rate (94%) hides this.
3. Make the Drill day say it is a drill: name the lesson, show its rule card, and hold New today to zero or to the lesson's words.
4. New today: tie the count to the due count (12 a day with 27 to 44 due) and draw it from the lesson first; cap the card's height.
5. Catch-up: serve it on Review days rather than in place of the week's drill, and say on Home that it is a lesson from earlier in the course.
6. Decide whether B1 and up should walk the paced week; if not, drop "día N de M" from their Home card.
7. Offer a theme at a topic's first week only, not at every week.
8. Names: a week is "week 2 of 6 of Ask, count, want", not a unit with its own number; Lecciones groups the weeks of one topic; rewrite the generated goals; "0 of 1 lessons".
9. One language at B1 and up: unit titles and goals, the session summary, Progreso's blurbs and the unit strip.
10. Gramática and the review pool: mark a merged lesson studied through its target and say it is now part of it.
11. Lesson titles without dashes (B1 Estar de acuerdo).
12. Carried over: "¿Cuántos años ___ (tener) tú?" recurring; preterite distractors before the preterite; scenes 0 in 30 days; B1 day 3 and C1 day 2 with nothing on the lesson node; review at about 32 cards a session from day 15.
