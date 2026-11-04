# Re-drive 2 of the rebuilt app (4 November 2026, commit 42c87843)

Same method as drive 1 (`redrive-1.md`), 20 commits later: A1 days 1 to 16 plus Five minutes, placed A2 and B1 learners for three days each, the first scene day (day 50), tours of Practicar, the library, Buscar, Progreso, the games and Sound natural, two desktop passes. About 3,050 screens. Zero page errors, console errors or 404s anywhere.

## Verdict

1. Technically clean.
2. The script lessons are the best change since the baseline: day 1 opens on the whole café dialogue, an 88-word rule card, five read-and-pick items with a why each, five typed items with a hint and a retry, a personal sentence with a live checklist; the opening page is 2,651 px against 7,485 px for the old lesson.
3. The scripts make sessions longer in screen states (93 per A1 day against 67; target under 40) though minutes stay in range at A1 (16.7); B1 is over at 22.9 with 54 Learn states on the subjunctive day.
4. Practice follows the lesson and stays fresh: Apply on the day's node 79% (drive 1: 51%), Produce 82% (63%), repeats within 14 days 1.3% (45%), no Apply item needing untaught grammar.
5. The serial reaches a beginner: chapter 1 on day 4 at 92% coverage, chapter 2 in Five minutes on day 10, chapter 3 on day 15; the cliffhangers pull.
6. Scenes play from day 50 ("The machine man", good), but that day's lesson is missing (see the bug below).
7. Severe bug: ten A1-band days (22, 34, 35, 49, 50, 52, 70, 72, 73, 75) carry lessons with `-a2` ids that live in the A2 lesson file, which an A1 learner never loads; Home says "A lesson" and Learn shows only the New today cards.
8. Teach before test slipped to 5% cold at A1 and 17% at B1: phrases from the old lesson's tables are still enrolled on script days but sit under Read more.
9. Drive 1 fixes held: no telegram warning, no overflow, no NaN, plain badges, I don't know on choices, Five minutes on the day just done, dashes down to 2.1 a session, B1 reads B1 passages.
10. Still open from drive 1: Home's present-tense quick review from day 1, the report modal, Buscar across bands, "1 vidas", vosotros in options, runs of six of one shape, Build it rarely fires.

## Numbers (A1 days 1 to 14; B1 days 1 to 3)

| Measure | Baseline A1 | Drive 1 | Drive 2 | Baseline B1 | Drive 1 | Drive 2 |
|---|---|---|---|---|---|---|
| Screen states | 72.0 | 67.4 | 93.2 | 76 | 69.3 | 109.7 |
| Minutes | 14.8 | 15.8 | 16.7 | 16.6 | 18.1 | 22.9 |
| Due on Home | 0 to 102 | 12 to 25 | 0, then 10 to 25 | | 0 to 19 | 0, 17, 32 |
| New words asked before shown | 67% | 0 | 5% (phrases under Read more) | 66% | 0 | 17% |
| Apply on the day's node | 14% | 51% | 79% | 0% | 67% | 67% |
| Produce on the day's node | 11% | 63% | 82% | 0% | 40% | 40% |
| Untaught Apply items | 22/84 | 0 | 0 | 0 | 0 | 0 |
| Readings inside the gate | n/a | 0/14 | 14/14 by coverage (8 on the slack) | n/a | 3/3 A1 texts | 3/3, two at level 3 |
| Repeats within 14 days | 26% | 45% | 1.3% | 13% | 0 | 0 |
| Longest option right (reading) | 55% | 36% | 32%; read-and-pick 23% | 75% | 17% | 56% (5 of 9); read-and-pick 20% |
| Longest run of one shape | | 4 | 6 | | 3 | 3 |
| Dashes per session | 66 | 22.6 | 2.1 | 46 | 33 | 10 |
| Overflowing screens | | 14 | 0 | | 5 | 0 |
| Chapters served | | 0 | 2 (plus a third on day 15) | | 0 | 1 |
| JavaScript errors | 0 | 0 | 0 | 0 | 0 | 0 |

Static check of the script files, read-and-pick right answer longest: A1 24%, A2 19%, B1 21%, B2 1% (at B2 "never the longest" is itself a tell).

## Broken or wrong

1. A1 days whose lesson is in the A2 file never load it (`js/session.js` builds the day without `Lessons.ensureLesson`).
2. Review asks phrases never shown (the old table's first six phrases enrolled on script days).
3. Five minutes re-asks today's quick-check items (right answers enrolled but never graded).
4. Placed learners read A1 chapter 1 (`nextChapterEntry` ignores band).
5. The library calls every chapter harder, lists future chapters with the plot inside, and shows raw unit ids.
6. "you all (vosotros)" in read-item labels and distractors, vosotros chips in the word bank, "debéis" in Relámpago, "¿y vosotros?" in a quick check.
7. A bank cloze names the wrong person on an ambiguous form ("vaya ... yo").
8. The mood hint fires on a non-mood slip ("Disculpo").
9. Runs of six Apply items of one shape when the bank tops up.
10. Build it leads read oddly, fire rarely, and chose the preterite on the imperfect day.
11. About me prompts are generic and accept the same line three times.
12. Home's present-tense card from day 1; the report modal after every session; "1 vidas"; Buscar "subjuntivo" at A1; the B1 interface half Spanish; desktop sessions keep the rail gutter; a few dashes left in old quick-check fronts and the ser/estar can-do line.

## Fix list (ranked, as dispatched after this drive)

1. Ensure the lesson's band is loaded before the day is built; a gate check that every course day's lesson resolves for its band.
2. Enrol only phrases the script shows, or show them on the closing page.
3. Stamp quick-check right answers as graded today.
4. A placed learner's serial starts at the first chapter of their band, with a recap card.
5. Library chapters: known share as the session computes it, lock beyond the next chapter, unit titles.
6. Cut Learn's screen count: New today as one card, no quick-check duplicates of your-turn, auto-advance after a why, at most four Now translate at B1.
7. Vosotros out of every distractor, label, chip and game item.
8. Vary shapes when the bank tops up; `breakRuns` keyed on type plus bank kind.
9. Build it for ser/estar, imperfect and subjunctive days, the day's own verbs, clean lead copy.
10. Bank cloze person from the subject when the form is ambiguous.
11. Mood hint only on a wrong mood after a trigger.
12. About me: unit-specific prompts, no duplicate lines.
13. Small fixes as listed above.
