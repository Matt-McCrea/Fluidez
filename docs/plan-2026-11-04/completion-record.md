# Completion record, 4 November 2026

What the plan in `PLAN.md` asked for, what landed on `next` the same day, what the drives measured, and what is left. Commit range: 25c2f521 (the state before the plan) to the head of `next` at the time of writing, about 95 commits, all on `next`, nothing pushed.

## What landed, by stage

**Stage 0, see it with your own eyes.** The baseline drive of the old app (`playtest-old.md`, 69 sessions across five bands) and three re-drives of the rebuilt app (`redrive-1.md`, `redrive-2.md`, `redrive-3.md`), each with a ranked fix list that was then applied.

**Stage 1, foundation.** `lib/` holds the rebuild's engine (parity-tested against `js/engine.js`), tagger, graph loader, translation matcher with accept patterns and self-correction, FSRS wrapper, gloss resolver and look-up search, bundled to `js/lib.bundle.js` with 2,700 tests. `tools/gate` runs the rebuild's content checks plus list-passage, answerability and gender-agreement over `data/`. Every old item carries `requires` and a focus span (`data/requires*`), every lesson its taught nodes (`data/lesson-nodes.js`, 258 reviewed rulings), the bank (72,104 rows), serial (219 chapters), scenes (270) and contrasts (1,493 items) are in `data/`, placed on the old spine. Lessons and requires load by band.

**Stage 1b and 2, a day never lost, a fair scheduler.** Teach before test; session saved after every card and resumed; the lesson counts as studied at the day's end; Do it again repeats today; FSRS with a budget in minutes, a floor of three new cards, yesterday's success and due count steering today, two cards per word from A2, typed meaning cards from B1, I don't know everywhere; no runs over four of one shape; Five minutes as reviews plus a page of the story; no dashes in interface copy; one interface language per band; the desktop rail.

**Stage 3, the coherent day.** Node gating replaces tense gating; Apply and Produce draw on the bank with items that target the day's node; matcher-graded typed translation with one hint and one retry; trap-rule hints that name the error; the writing gate relaxed to advice; contrasts taught one side at a time and mixed in review from A2; a 14-day exposure ledger; week 1 redesigned (a real dialogue on day 1, cognates on day 2, sounds as a reference card); a new *ir a* lesson the old course never had; no more than two new words a day from one category; the Unit done card with what you can now say, the week's numbers, the unit check and the theme offer; theme weeks on the existing focus feature.

**Stage 4, reading.** The serial served on one day per unit and in Five minutes, a part a day with recap and hook in their places, a placed learner starting in their band with a story-so-far line; tap-to-gloss on every Spanish word with Save and Look up; a reading library with coverage and locked chapters ahead; all 818 passages rewritten or edited (longest-option share from 79% to 24%, answerability flags from 737 to 0, list passages to 0, rayas to one turn per line, Latin American lexis); readings gated by coverage, upper bands at their own level.

**Stage 5 and 5b, lessons and output.** Teaching scripts for every path lesson in A1 (77), A2 (58, with four typed translations each), B1 (148, with register and translate blocks), B2 (128) and C1 (units 55 to 60 at the time of writing, 61 to 63 in flight), each in the anatomy: hook, examples, rule under 120 words with the forms visible, read-and-pick, typed your turn, personal sentence, pitfalls, the old prose under Read more; every dash out of the old prose (5,906); scenes at the end of Produce; Build-it chains; the About me script; the sound-natural track (150 lines) for B1 and above; Latin American lexis across exercises, writing, vocabulary and idioms; the 18 stub lessons the re-sequence needs, browsable now.

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

**Next after this record.** The last C1 scripts and the B2 option rebalance land; the full suite runs green; `main` is fast-forwarded so the live site updates; Matthew plays A1 units 1 to 3 and a B1 week.
