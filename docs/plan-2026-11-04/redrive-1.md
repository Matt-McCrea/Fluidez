# Re-drive 1 of the rebuilt app (4 November 2026, commit bd9dfedb)

Headless Chromium drive of `next` at bd9dfedb (36 commits after the baseline), same method as `playtest-old.md`: placement three ways, A1 days 1 to 14, "Do it again", "Five minutes", three interruptions, tap-to-gloss, the library, Buscar, Progreso, both new games, a placed B1 learner's days 1 to 3, a desktop pass. About 2,000 screens, 1,600 screenshots (session scratchpad, not kept).

## Verdict

1. Zero page errors and zero console errors anywhere; no screen traps the learner; no request leaves the machine.
2. Teach before test works: 0 of 217 new A1 review words and 0 of 36 B1 words asked before being shown (baseline 66 to 82%). Due on Home stays at 12 to 25 a day (baseline 102 by day 12).
3. The day's lesson drives practice: Apply on the day's node 51% at A1 (was 14%) and 67% at B1 (was 0%); Produce 63% and 40%. The B1 subjunctive day drills the subjunctive.
4. Nothing is lost: closing during Review, after Learn, or via Look up resumes on the same card; "Do it again" replays today and the counter stays.
5. Two features never reach a learner: the serial (`data/story/index.js` is not loaded by `index.html`; injected, chapter 1 served at 92% coverage) and scenes (every legal day is 312 or later).
6. Practice repeats 45% within 14 days (target under 5%): the authored pool is spent by day 5 and the bank fills only half; bank items never repeated (0 of 51).
7. Missed targets: 67 screens per A1 day (target under 40); 22.6 dashes a session, all from lesson content; no A1 reading passes the node gate (ungated fallback daily); B1 still reads level-1 texts.
8. The writing check calls correct models telegrams ("¿Dónde vives?", "Como ensalada y bebo agua.").
9. Minutes are right: 15.8 at A1, 18.1 at B1.
10. Placement: nothing right lands in unit 1 after 2 items; all right from "New" lands at B1 unit 27, from "studied a while" at B2 unit 48.

## Numbers

| Measure | Baseline A1 d1–14 | Now A1 d1–14 | Baseline B1 | Now B1 d1–3 | Target |
|---|---|---|---|---|---|
| Screens per session | 72.0 | 67.4 | 76 | 69.3 | under 40 |
| Minutes (range) | 14.8 (11.6–18.0) | 15.8 (12.3–18.8) | 16.6 | 18.1 (15.4–20.6) | 15–22 |
| Cards R/LC/C/A/P | 28.9/5.4/4/6/4 | 19.3/5.4/5/6/4.1 + 11.6 new-today | 28/–/4/6/5 | 15.3/7.7/5/6.7/5 + 8.7 new | |
| Due on Home | 0 to 102 by day 12 | 12 to 25 | | 0 to 19 | |
| New words asked before shown | 63 (67%) | 0 / 217 | 66% | 0 / 36 | 0 |
| Apply on the day's node | 14% | 51% | 0% | 67% | ≥ 50% |
| Produce on the day's node | 11% | 63% | 0% | 40% | ≥ 50% |
| Apply needing untaught nodes | 22/84 | 0/82 | 0/60 | 0/18 | 0 |
| Readings inside the node gate | n/a | 0/14 | n/a | 3/3 (A1 texts) | |
| Items repeated within 14 days | 26% | 45% (authored 66/88, bank 0/51) | 13% | 0/36 | under 5% |
| Longest-option right (reading MCQ) | 55% | 36% | 75% | 17% | about 33% |
| Longest run of one shape A / P | | 4 / 2 | | 3 / 2 | ≤ 4 |
| Dashes per session | 66 | 22.6 | 46 | 33 | 0 |
| Scenes served | | 0 | | 0 | |
| Serial chapters served | | 0 (2 with the index injected) | | 0 | |
| JavaScript errors | 0 | 0 | 0 | 0 | 0 |

## Broken or wrong screens

1. No serial anywhere: `index.html` lacks `data/story/index.js`; `js/session.js` and `js/library.js` read `STORY_INDEX` and find nothing.
2. No scene below B2: legal days in `data/scenes/*.js` start at 312.
3. Choice rows overflow the phone: `.row-controls` does not wrap and "Continuar" is appended to the row.
4. The telegram warning fires on correct models (`substantial()` in produce.js), and advises adding "yo".
5. A read-and-pick item teaches a wrong tense: bank row u21-0583's span on "notaría" read as the conditional of *notar*.
6. Noun slots treated as verb clozes ("el ___ (desarrollar) urbano"): no determiner check in `bankitems.cloze`.
7. Look up on a glossed phrase passes the phrase with punctuation.
8. Five minutes builds tomorrow's day and marks its picks seen.
9. A typed quick-check question expects an English explanation.
10. "NAN MIN · 1 VIDAS" on the Supervivencia card.
11. The library calls every passage "harder" (known share credits too little).
12. Buscar "subjuntivo" at A1 misses the B1 lesson (lazy band).
13. The unit task checklist repeats one line eight times.
14. The review counter is stale after a resume.

## What a learner notices first

Good: day 1 is honest and gentle; practice is plainly about the day; closing is safe; tap-to-gloss ("invita: invitar / to invite / he or she, present / in this phrase: invita a") with Save and Look up; Buscar "pudimos"; the Unit done card ("Unit 1 done: Meet someone", five can-dos, the theme offer); Progreso's headlines; Uno u otro's reasons; the desktop rail.

Bad: onboarding still says Palabras; Home pushes a present-tense quick review three days before the present is taught; day 1's writing task is a repair-service note; correct Spanish called a telegram; the same practice keeps coming back; lessons about 7,000 px tall with raya dialogue in the old prose; the report modal after every session; the off-screen Continuar; no story; tight family word sets on days 7, 9 and 10; B1 reads A1 texts.

## Fix list (ranked, as dispatched after this drive)

1. Load the story index and add a gate check that every global the app reads is loaded or injected.
2. Re-place the scenes on the current spine or draw from the learner's band and below; hide the loading flash.
3. Stop rejecting correct Spanish in Produce; drop the "yo" advice.
4. Top Apply and Produce up from the bank when the authored pool is reused.
5. Reject bank spans preceded by a determiner; re-tag the noun homographs.
6. Gate readings by coverage, not nodes; prefer the band's own level from B1.
7. Wrap choice rows; put Continuar below.
8. Five minutes uses the last completed day and marks nothing unseen.
9. Dashes in lesson content (84 of 94 A1 lesson records).
10. Word-bank distractors and early conjugation limited to taught tenses.
11. Metalinguistic quick-check items as choices.
12. Small fixes: NaN minutes, gloss lemma, library known share, Buscar across bands, onboarding "Buscar", review badge names, opener count, unit-task checklist, two-right-answer placement item, tight word sets on days 7, 9, 10.
