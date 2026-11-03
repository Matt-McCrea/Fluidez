# Completion record

Written for: the owner, and for any session that continues this work. Updated as stages land. This file says what is true, including what fell short.

## State of the code

Everything is on the local branch `next`. **Nothing has been pushed.** `rebuild` is untouched at `5f916ec`, and the live site was at `ee6aaec` when the audit ran. Publishing is one fast-forward of `rebuild`, and it is the owner's decision (O2).

Last verified by the lead on `next`, on the final tree: typecheck clean, 5,340 tests pass with exit 0, gate 0 errors and 7,194 warnings, production build succeeds with 340 precache entries (7.7 MB). Real browser sessions restored a backup, played Rescate, Relámpago and Uno u otro with right and wrong answers, took placement through 20 items, read a story beat in a lesson, pressed the claim button at A2 and reached the returning-learner Home, with no console errors. Headless Chromium at phone size only.

## Investigations

**Completed**
- All 172 grammar scripts and all 94 contrast scripts read in full.
- All 404 chunks read; 60 scenes and 180 writing tasks read by eye; every scene and writing task scanned by script.
- 24 lints over all 103,451 strings. 540 stratified bank rows read by eye, and all 72,693 run through the real matcher.
- 701 claims raised, each adversarially verified, with a second teacher lens on the 98 critical and high ones. Final: 326 confirmed, 222 amended, 75 rewrite-needed, 10 native-check, 68 refuted.
- Six cross-reviews. Eight learner profiles driven in headless Chromium on the dev server.
- Architecture measurements: bundle, startup, state growth, save cost, offline behaviour.
- All 999 authored contrast items read for language by one Opus reader. Placement, a lesson with a story beat, Rescate, Uno u otro and the claim button driven by the lead in headless Chromium at phone size, with no console errors.

**Not completed, or sampled only**
- The 650 pattern scripts and the 72,693 bank rows were sampled by eye, not read.
- Nothing was tested on a real phone, in Safari, or as an installed PWA.
- **No real learner has used any of this.** Every minute, retention and learning figure is modelled.
- rae.es refused fetches, so many DPD and NGLE citations are from memory. A web search limit also cut the later cross-reviews off from outside sources.
- Competitor knowledge comes from public reviews.
- Nobody drove the live site. The comparison with it is a code comparison.

## Implemented

| Id | What landed | Verified by |
|---|---|---|
| C1 to C4 | Saves survive refusal, tolerant documents, snapshots, backup and restore | Tests, review, restore in a real browser |
| C5 | Stable day keys, shipped snapshot, migrations, `reconcile`, gate on vanished ids | Golden learners, synthetic moved course, property tests, review |
| C6 | `npm test` exits 0, CI workflow written (never run on GitHub), local trunk `next` | Exit code seen by the lead |
| C7, C8 | Honest hints, `irme`, `xnum`, both gustar errors fail | Regression battery, bank-wide diff by the reviewer |
| C9 | Licensed transforms: 3,557 more malformed sentences found and removed by review, 0 of 187,650 in the sweep | Sweep, reviewer read 199,490 generated sentences |
| C10 | A perfect placement never returns week 1 | Monotonicity test |
| C11 | Glosses belong to the tapped word, names are names | All 87,041 tap positions replayed |
| C12 | Read cards never earn Good | Tests, review found and fixed the Quick review path |
| C13 | Scene and writing verdicts, progress ticks need evidence | Tests |
| C14 | 548 verified fixes, the rewrites, siblings | Gate |
| C15, F9, F10 | `x:subj-present-past` rewritten, one subjunctive name and model, the six hard contrasts | Gate. No native speaker has read them |
| C16 to C18 | Unit 2 crash, wave-introduced faults, chunk card pairs | Tests, re-run by the lead |
| F1, F2 | All 94 contrasts taught, reviews rotate real items | Simulator, review, contrast lesson rendered |
| F3 | One contrast store, deterministic derive, Guess and Cue tests, Train it and Weak spots use it | CI tests, review |
| F5 | Acceptance engine with swap notes: battery 19 to 49 of 192 | Bank-wide diff, 80,000 mutated calls in review |
| F6 | Traps module with Assert, Ask, Note, Silent | Batteries, review found false Asserts and fixed them |
| F7 | A miss returns in an unseen sentence, in the recap and next session | Tests |
| F8 | Near-neighbour distractors, Guess Test over real sessions | CI test |
| F16 | B2 45 and C1 52 minutes | Simulator table |
| L1 | Debt policy and a gentle return | Simulator, Home seen in a real browser |
| L3 | Library metadata, `prepare`, kinds registry, honest offline | Tests, review |
| L6 | First chapter around minute 8, before the lesson | Block order, estimate |
| L8 | Editable retry, word-level diff | Browser |
| M1, M2 | Attempt seam, attempts log, saved writing, read rows, monthly snapshot | Replay digests, golden learners |
| I1, I3, I4 | Relámpago, De corrido, Rescate | Scripted players against knowledge, review. Relámpago and Rescate played in a browser |
| I2 | Uno u otro: decks of a contrast, balanced per pair, opened only if a cue table loses, no clock on discourse contrasts | Tests. Played in a browser by the lead, who read the code. **No independent review**: the placement reviewer ran out of scope for it |
| F3 again | Contrast store rebuilt: 1,493 items, 914 of them authored, median 17 a contrast (was 5) | Gate, Guess and Cue tests, a language read of all 999 authored items by Opus: 126 faults fixed or dropped. No native speaker has read them |
| F4, F12 | Focus spans on bank rows: a gap tests the taught word in any clause. Clitic, article and particle gaps tightened by review. First contact is typed from B1, and a cognate skips rungs | Gate, ladder tests, 250 sampled cards, all 5,724 dialogue rows land on the right turn |
| L2 | Placement rebuilt on the contrast store: skills missed below the result stay owed (capped at 6), overclaiming falls fast, simulated learners land within a band | Simulated learners, review, 20 items driven in a browser. Still all multiple choice, see below |
| L8, L9 | Self-claim in Rescate and Quick review, from A2 up, graded Hard; reason lines about the sentence on screen; unit, not week; Home and close offer one game each | Tests. Claim button seen and pressed in a browser at A2 |
| L5 | Free-form misses count toward a weak spot only where the checker asserted a named error; Practise this on a grammar node opens its contrast | Tests |
| F2 again | A known contrast mixed into a drill or remix gets a real item from the store | Tests, simulator |
| L4 | A saved lesson survives midnight and a week; Home says whether a short session finished the lesson | Tests |
| L7 | Chapters read a beat a day, with the recap giving up two cards on those days | Simulator. A beat seen in a browser: Part 1 of 3 |

## Fell short of its own target

| Item | Target | Result |
|---|---|---|
| F5 acceptance | Above 85% of the battery | 49 of 192, 25.5%. What remains is mostly other words and constructions, which need written accept lists |
| F6 useful hints | Above 60% | 35% of 263 known errors get a named cause. 9 of 41 rules are not shipped |
| L1 | Nobody over two sessions without something new | 1 of 24 simulated runs reaches 3 |
| L1 cost | | Debt policy trades recall for progress: up to 2.9 to 4.2 points for slow placed learners, more through C1. **An owner decision** |
| L7 | More than 70% of sessions contain story | 56 to 70% by simulated profile, up from 40 to 43%. An early report of 85 to 95% was measured before review kept beats inside the day's minutes. More would cost new words or warm-up, which is **an owner decision** |
| F3 volume | 40 items a contrast, 150 for the big five | Median 17. Big five 20 to 46. Of 1,130 written, 914 kept. The preterite against perfect decks stay at 2 and 3 on purpose: in Latin America both are right, so no fair item of one right answer exists for most sentences |
| C17, L4 | Short days add up | Partly. A long lesson can now be left and picked up on later days, and Home says so. It is not planned as slices: `shortSlice` still returns nothing on grammar and contrast days, and lesson parts were not built |
| L2 typed items | Typed sentences in placement | Not built. They need accept lists first, or they fail good learners |

## Known problems left open

- 10 native-check verdicts plus 11 more usage questions from the language lane need a Colombian speaker. See `verdicts/final.jsonl` and the language lane's list.
- Chapter comprehension options: 960 right answers in 219 chapters were shortened on 3 Nov 2026 (Sonnet trims, two Sonnet review passes, a re-trim of rows the review made long again). The longest is now right 25 to 31% of the time by band (was 68 to 83%, chance 25%) and the shortest 12 to 17%. The gate makes it an error above chance plus 8%. The wrong options are unchanged and some are weak, and a native speaker has not read the shortened answers.
- Rule text for `x:relative-ind-subj` (472 words) and `g:passive-se` (441 words) carries text waiting for days that do not exist yet.
- `x:pena-vs-rabia`: "me da pena" reads as embarrassment in Bogotá. Four authored items now say "me da tristeza", but the contrast's own script still sets pena against rabia. A Colombian should rule on it.
- Placement: a pure guesser who claims C1 and never taps I don't know still lands around unit 40 (was 50). A strong learner can owe a skill on one mis-tap, at the cost of one quick reteach. The self-rating tap still sets where the check starts.
- A gap's span follows `targets[0]`, which is alphabetical, not always the node being practised. 7,457 cards on later targets fall back to the old verb gap. Per-target spans would need a corpus-wide field.
- Typed near-synonym cards accept only the written answer: `x:tardar-llegar-tarde` expects Me demoro and refuses Tardo, which `p:tardar-en` teaches. The claim button softens it from A2 up. Items have no accept list.
- Some contrasts have one side in the graph, so a miss is charged to that side whichever was right, and weak-spot labels can be off.
- A story beat shown and then abandoned counts as read, so a dropped lesson can skip about 55 words of story.
- Simulator volume rose 6 to 22% when contrast items joined drills. Shorter cards fit more in the minutes is the likely reason, not confirmed.
- `recentMisses` still lists unnamed free-form misses. The Rescate result does not mention claimed cards. Uno's end screen has no practise link. `src/games/uno.ts` imports from `tools/contrast/cue.ts`.
- The cognate rule in first contact is a heuristic with no check against the real word list, and the 30 seconds for a typed first contact is an estimate.
- A failed module import may stay cached on Safari. Chromium retries. WebKit was not available to test, so Home offers a reload.

## Deferred, with the reason

| Item | Why |
|---|---|
| Accept sidecar burn | The claim button now softens a false rejection, and real claims will show which alternatives matter, so harvest before burning 3,600 jobs |
| M5 store split | One-way door. It ships alone, after backups exist on real devices |
| I5 Why? panel, I6 Mis trampas, I8, I9 | Acquisition ranks them below the fixes, and they want the re-tag |
| I7 library, E1 document lessons | Owner decisions O4, O5, O6 |
| E2 say-it card | Owner decision O3 |
| Lesson parts, wider `shortSlice` | One long lesson now resumes across days, so the need is smaller. Slicing a grammar day is a compiler change, and real timing should come first |

## Remaining priorities

1. Eight to twelve real adults, and a real timed session on a phone (E6). The most valuable missing evidence in the project.
2. A Colombian editor reads the native-check list and the rewritten contrasts.
3. Everything still marked planned in `ROADMAP.md`.
