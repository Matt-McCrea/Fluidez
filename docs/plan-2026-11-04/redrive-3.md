# Re-drive 3 of the rebuilt app (4 November 2026, commit 7ddee83b)

Same method as drives 1 and 2. A1 days 1 to 30 with Five minutes after days 10 and 22 and the Unit done cards at days 12 and 19 (a theme picked at 19); the first scene day (51); placed learners at A2 unit 15, B1 units 27 and 31, B2 unit 44, C1 unit 55 (days 1 and 4); Sound natural, the library, Buscar, Progreso; a desktop pass. 4,971 logged screen states. Zero page errors, console errors, overflow or app-caused stuck screens.

## Verdict

1. Technically clean.
2. Every lesson appears: day 22 "Disculparse", day 51 "Expresión verbal", and day 30's new "Voy a + verbo", whose Apply drills it.
3. One regression, the worst since the baseline: the one-card New today is never removed; Got it stays live and a second tap mounts a second copy of the lesson. On every Learn stage with new words.
4. Teach before test is solved: 0 of 429 new A1 words asked before shown (drive 2: 15 of 199); 0 at every other band; "Phrases you met" is exactly what review later asks.
5. Sessions: days 1 to 14 at 80 screens and 16.5 minutes (drive 2: 93 and 16.7); days 15 to 30 at 89 screens and 18.7 minutes because review doubles to 32 cards and due on Home climbs to 29 to 44.
6. Practice follows the lesson: Apply 78%, Produce 88% in the first fortnight; days 15 to 30 fall to 51% and 53%, mostly on days without a grammar node and on theme-focus days.
7. Drive 2 fixes held: 0 dashes everywhere, no vosotros, no run over 4, the library locks and counts, Buscar at A1, placed learners' serial in their band, New today one card, quick check not re-asked, B1 Now translate capped.
8. Read-and-pick advances itself 1.5 s after any tap, so the why (10 to 18 words) vanishes before it can be read, worst after a wrong pick.
9. Five minutes re-asks the closing page's phrases, enrolled due today.
10. Upper bands read beginner texts again (B2 a level-2 passage, C1 level 1, each logged passage-below-band); the C1 shared script replays word for word on the day it serves.
11. Build it fired on 1 day of 30.

## Numbers (A1 days 1 to 14)

| Measure | Baseline | Drive 1 | Drive 2 | Drive 3 |
|---|---|---|---|---|
| Screens | 72.0 | 67.4 | 93.2 | 80.2 |
| Minutes | 14.8 | 15.8 | 16.7 | 16.5 |
| Due on Home | 0 to 102 | 12 to 25 | 10 to 25 | 12 to 23 |
| Cold words | 67% | 0/217 | 15/199 | 0/196 |
| Apply on node | 14% | 51% | 79% | 78% |
| Produce on node | 11% | 63% | 82% | 88% |
| Untaught Apply | 22/84 | 0 | 0 | 0 |
| Readings in gate | n/a | 0/14 | 14/14 | 14/14 |
| Repeats within 14 days | 26% | 45% | 1.3% | 1.9% |
| Longest right, reading / read-and-pick | 55% | 36% | 32% / 23% | 29% / 23% |
| Longest run of one shape | | 4 | 6 | 4 |
| Dashes per session | 66 | 22.6 | 2.1 | 0 |
| Chapters served | 0 | 0 | 2 | 2 |
| JavaScript errors | 0 | 0 | 0 | 0 |

A1 days 15 to 30: 89 screens, 18.7 minutes, 0 cold of 233, Apply 51%, Produce 53%, 16/16 readings in gate, repeats 1.7%, 0 dashes, chapters on days 15, 22 and 30, Build it 0, About me 5. B1 unit 27: 92 screens, 23 minutes, 0 cold, Apply 67%, Produce 40%, readings two level-3 texts and B1 chapter 83 with a recap, 0 dashes. Script coverage at this commit: A1 77/77, A2 58/58, B1 67/148, B2 40/128, C1 55/162 (B1 and B2 are now complete in later commits).

## Broken screens

1. The New today card never leaves (`teachNew` calls `done()` without clearing the host).
2. The read-and-pick why disappears after 1.5 s.
3. Five minutes asks the closing-page phrases taught ten minutes earlier (`enrolPhrases` enrols due today).
4. A served C1 day replays the serving script whole under a new title.
5. The report modal after every session (kept by decision).
6. One read-the-form item with two finite verbs and no highlighted verb.
7. About me accepts any three words; its tense label still carries a tag.

## What a learner notices

Good: the lesson is there every day; day 30's new lesson is the best A1 page in the drive; corrections are kind and specific; nothing is asked cold; the Unit done card and the theme pick work as moments; the serial meets placed learners in their band with a story-so-far line in their language; the B2 and C1 scripts are real Colombian scenes; Sound natural catches the stiff line; the text is clean.

Bad: the word card that will not go away; the why that vanishes; New today often unrelated to the lesson (farm animals above the present tense); review keeps growing after day 15; Five minutes re-asks today's phrases; a theme pulls practice off the lesson on three days; the theme offer shows 20 chips to a beginner; About me checks nothing; Build it almost disappeared; placed learners at the top read beginner texts after long openings; the B1 chrome still half Spanish; Spain leaks into authored Apply (Madrid, España, Sevilla); a subjunctive slip where the indicative belongs gets the person hint.

## Fix list (ranked, as dispatched after this drive)

1. Clear the New today card and disable Got it after one tap; a test for every Learn path.
2. Never auto-advance after a wrong pick; after a right one wait about 300 ms a word with a 2.5 s floor.
3. Enrol "Phrases you met" for tomorrow.
4. A served C1 day plays only what is new (the register and translate blocks and a fresh set of picks), or the served days merge in the course.
5. Upper-band readings at the learner's band before any fallback.
6. Cap review growth: tie New today's count to the due count, draw New today from the lesson first.
7. Build it: a validator listing days whose chain is null; ser/estar and ir a must build.
8. Theme focus keeps half the items on the lesson; the A1 theme offer shows a handful of concrete themes.
9. About me checks the point it names; strip tags from its labels.
10. Mood hint: same verb and person in the other mood says "right person, wrong mood".
11. Read-the-form items reject rows with two finite verbs.
12. Library serial for placed learners starts at their band; passage repeats within 14 days on days 12, 17, 19; Spain place names in authored Apply; the recurring "¿Cuántos años ___ (tener) tú?"; chapter numbering for placed learners; Unit done's right share without the quick-check stamps.
