# Completion record, 4 November 2026

What the plan in `PLAN.md` asked for, what landed on `next` the same day, what the drives measured, and what is left. Commit range: 25c2f521 (the state before the plan) to the head of `next` at the time of writing, about 95 commits, all on `next`, nothing pushed.

## What landed, by stage

**Stage 0, see it with your own eyes.** The baseline drive of the old app (`playtest-old.md`, 69 sessions across five bands) and three re-drives of the rebuilt app (`redrive-1.md`, `redrive-2.md`, `redrive-3.md`), each with a ranked fix list that was then applied.

**Stage 1, foundation.** `lib/` holds the rebuild's engine (parity-tested against `js/engine.js`), tagger, graph loader, translation matcher with accept patterns and self-correction, FSRS wrapper, gloss resolver and look-up search, bundled to `js/lib.bundle.js` with 2,700 tests. `tools/gate` runs the rebuild's content checks plus list-passage, answerability and gender-agreement over `data/`. Every old item carries `requires` and a focus span (`data/requires*`), every lesson its taught nodes (`data/lesson-nodes.js`, 258 reviewed rulings), the bank (72,104 rows), serial (219 chapters), scenes (270) and contrasts (1,493 items) are in `data/`, placed on the old spine. Lessons and requires load by band.

**Stage 1b and 2, a day never lost, a fair scheduler.** Teach before test; session saved after every card and resumed; the lesson counts as studied at the day's end; Do it again repeats today; FSRS with a budget in minutes, a floor of three new cards, yesterday's success and due count steering today, two cards per word from A2, typed meaning cards from B1, I don't know everywhere; no runs over four of one shape; Five minutes as reviews plus a page of the story; no dashes in interface copy; one interface language per band; the desktop rail.

**Stage 3, the coherent day.** Node gating replaces tense gating; Apply and Produce draw on the bank with items that target the day's node; matcher-graded typed translation with one hint and one retry; trap-rule hints that name the error; the writing gate relaxed to advice; contrasts taught one side at a time and mixed in review from A2; a 14-day exposure ledger; week 1 redesigned (a real dialogue on day 1, cognates on day 2, sounds as a reference card); a new *ir a* lesson the old course never had; no more than two new words a day from one category; the Unit done card with what you can now say, the week's numbers, the unit check and the theme offer; theme weeks on the existing focus feature.

**Stage 4, reading.** The serial served on one day per unit and in Five minutes, a part a day with recap and hook in their places, a placed learner starting in their band with a story-so-far line; tap-to-gloss on every Spanish word with Save and Look up; a reading library with coverage and locked chapters ahead; all 818 passages rewritten or edited (longest-option share from 79% to 24%, answerability flags from 737 to 0, list passages to 0, rayas to one turn per line, Latin American lexis); readings gated by coverage, upper bands at their own level.

**Stage 5 and 5b, lessons and output.** Teaching scripts for every path lesson in A1 (77), A2 (58, with four typed translations each), B1 (148, with register and translate blocks), B2 (128, options rebalanced) and C1 (129 scripts for 162 lessons, with runs of same-theme lessons served by one script), each in the anatomy: hook, examples, rule under 120 words with the forms visible, read-and-pick, typed your turn, personal sentence, pitfalls, the old prose under Read more; every dash out of the old prose (5,906); scenes at the end of Produce; Build-it chains; the About me script; the sound-natural track (150 lines) for B1 and above; Latin American lexis across exercises, writing, vocabulary and idioms; the 18 stub lessons the re-sequence needs, browsable now.

**Stage 6, spine, placement, look-up, progress.** Placement rebuilt from the course's own items; Buscar; Progreso with delayed retention, words read, production share, a week map and weak spots by form; Relámpago and Uno u otro on the contrast store; the re-sequence proposal built with its legality and supply simulation, aliases and reconciliation (not applied: the calendar is the owner's decision).

## What the drives measured (A1 days 1 to 14)

| Measure | Baseline | Drive 3 |
|---|---|---|
| New words asked before being shown | 67% | 0 of 196 |
| Apply items on the day's lesson | 14% | 78% |
| Produce items on the day's lesson | 11% | 88% |
| Apply items needing untaught grammar | 22 of 84 | 0 |
| Items repeated within 14 days | 26% | 1.9% |
| Reading questions won by the longest option | 55% | 29% |
| Dashes on screen per session | 66 | 0 |
| Due on Home by day 12 | 102 | 23 |
| Minutes per session | 14.8 | 16.5 |
| Serial chapters in 14 days | 0 | 2 |
| JavaScript errors | 0 | 0 |

B1 days 1 to 3: practice on the lesson 67% and 40% (was 0%), no cold words, B1-level readings, 23 minutes a session (over the 15 to 22 target; the subjunctive day's script is long). Screens per A1 day are 80, against a target of 40, because the script lessons add 20 to 26 states; minutes stay in range.

## Open

**Owner decisions.** The re-sequence calendar (804 days strict, 640 with lighter weeks; recommended 640) in `resequence.md`; the 38 B2 notion lessons marked optional by the sequencing document; whether the report modal stays (kept by decision); a native Colombian pass on `native-check.md`.

**Known gaps.** Screens per day above target; B1 scripts run long; Build it builds on about half the grammar days; review grows after day 15 within budget but noticeably; A1 scenes start at day 46 (the old spine teaches the needed grammar late; the re-sequence fixes this); the B2 and C1 "other voices" passages are short of the 250 to 600 word aim; the library's `en` hints come from the library in English under a Spanish label at B1.

**Next after this record.** The full suite is green (29 library test files, 2,258 tests; every tools/test-*.js; the validator); `main` is fast-forwarded locally to `next`; pushing is Matthew's call because it changes the live site; Matthew plays A1 units 1 to 3 and a B1 week.

## 5 November: the re-sequence applied

The owner chose the 640-day calendar (the "no Drill after a function, notion or genre big lesson, and no Output practice day in a week with no task" variant of `resequence.md`). `nice npx tsx tools/reseq/build.ts --lean --apply` now writes the live `data/course.js`, `data/lesson-aliases.js`, the lesson status and `deeper` edits in `data/strand-lessons.js` and the node rulings; `tools/reseq/base/course.pre-reseq.js` is the old spine it reads week one and the baseline from.

**What landed.** 640 days (A1 146, A2 121, B1 158, B2 115, C1 100) in 144 units, each a week of Introduce, Drill, Input and Review with the task as the Output day where the unit has one; 405 path lessons (the 20 stubs are real lessons now, all scripted); 28 deep units holding 195 reference lessons; 94 merged lessons resolved by alias to their target and reachable from the target's page; every path lesson in every band has a teaching script (32 written today, including the Latin American pasts review and the Spain recognition lesson at B2); the scenes, contrasts and bank re-placed on the new spine (A1 scenes playable from day 47; 31,291 bank rows legal in the A1 band against 18,760 before); placement rebuilt as five rungs a band so the climb from A1 reaches B1 in 14 items; a learner on the old spine lands by studied lessons, never rewinds, and takes the lessons the new spine put before their place as a catch-up lesson on practice days.

**Suite.** 29 library files, 2,258 tests; every `tools/test-*.js` including the new alias and reconcile tests; the five script tests now read each band's path from the course; `node tools/validate-content.js` clean.

**Re-drive 4** (`redrive-4.md`, on the working tree before the commit): technically clean, 5,901 screen states, 0 errors; every lesson day served its script (A1 22/22, B1 5/5, C1 2/2, reconciled 5/5); A1 days 1 to 14 at 81 screens and 16.5 minutes, 0 cold words of 200, Apply on the lesson 80%, Produce 88%, repeats 1.9%, 0 dashes; days 15 to 30 Apply 71% and Produce 67% (drive 3: 51% and 53%), Build it on 6 of 30 days (drive 3: 1); placement from "New to Spanish" with every answer right lands at B1 in 14 items; the merged lesson opens its target. Its one blocker, every Review day stepped over because the week's lessons were all studied by then (no Unit done card after unit 2, no unit check, the catch-up queue waiting for a Drill day), is fixed in this commit: a week's Drill, Output and Review days are served unless the learner cleared the unit by hand or by unit check; the unit check draws on the topic's earlier weeks so a short week has a check to offer; the practice page names its kind and, on a Drill day, the lesson and its one-line rule; a theme is offered at a topic's first week only; a merged lesson shows ticked in Gramática; the Home counter above A2 counts lesson days; unit goals and the one merged title carry no dashes.

**Open after drive 4.** Drill and Introduce days for non-verb points (articles, plurals, adjective gender) drill verb endings because the bank items are chosen by tag, not by the gap; New today adds 12 words a day whatever is due and rarely from the lesson; B1 and above are not paced, so they never meet the week's Drill, Output and Review days (owner decision); weeks are named as units ("Unit 3 done: Ask, count, want (1 of 6)"); the interface at B1 and above is Spanish but unit titles, goals and the session summary are English; a lesson opened from Lecciones starts with New today; scenes did not fire in 30 A1 days; the old "¿Cuántos años ___ (tener) tú?" item recurs.
