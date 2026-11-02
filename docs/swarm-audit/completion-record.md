# Completion record

Written for: the owner, and for any session that continues this work. Updated as stages land. This file says what is true, including what fell short.

## State of the code

Everything is on the local branch `next`. **Nothing has been pushed.** `rebuild` is untouched at `5f916ec`, and the live site was at `ee6aaec` when the audit ran. Publishing is one fast-forward of `rebuild`, and it is the owner's decision (O2).

Last verified by the lead on `next`: typecheck clean, 5,251 tests pass with exit 0, gate 0 errors, production build succeeds. A real browser session restored a backup, played Rescate and Relámpago, reached the reveal screen and the returning-learner Home, with no console errors.

## Investigations

**Completed**
- All 172 grammar scripts and all 94 contrast scripts read in full.
- All 404 chunks read; 60 scenes and 180 writing tasks read by eye; every scene and writing task scanned by script.
- 24 lints over all 103,451 strings. 540 stratified bank rows read by eye, and all 72,693 run through the real matcher.
- 701 claims raised, each adversarially verified, with a second teacher lens on the 98 critical and high ones. Final: 326 confirmed, 222 amended, 75 rewrite-needed, 10 native-check, 68 refuted.
- Six cross-reviews. Eight learner profiles driven in headless Chromium on the dev server.
- Architecture measurements: bundle, startup, state growth, save cost, offline behaviour.

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

## Fell short of its own target

| Item | Target | Result |
|---|---|---|
| F5 acceptance | Above 85% of the battery | 49 of 192, 25.5%. What remains is mostly other words and constructions, which need written accept lists |
| F6 useful hints | Above 60% | 35% of 263 known errors get a named cause. 9 of 41 rules are not shipped |
| L1 | Nobody over two sessions without something new | 1 of 24 simulated runs reaches 3 |
| L1 cost | | Debt policy trades recall for progress: up to 2.9 to 4.2 points for slow placed learners, more through C1. **An owner decision** |
| L7 | More than 70% of sessions contain story | 40 to 43% |
| F3 volume | 40 items a contrast, 150 for the big five | Median 5, big five 6 to 25, derived, not read by anyone |
| C17 | Short days add up | Only on input days. A five-minute learner stops at the first grammar lesson |

## Known problems left open

- 10 native-check verdicts plus 11 more usage questions from the language lane need a Colombian speaker. See `verdicts/final.jsonl` and the language lane's list.
- Chapter comprehension options: the longest is still right 68 to 83% of the time, 161 of 219 chapters warn.
- Rule text for `x:relative-ind-subj` (472 words) and `g:passive-se` (441 words) carries text waiting for days that do not exist yet.
- "Week" means a unit of ten lessons in about 25 strings. A word choice for the owner.
- A failed module import may stay cached on Safari. Chromium retries. WebKit was not available to test, so Home offers a reload.

## Deferred, with the reason

| Item | Why |
|---|---|
| Accept sidecar burn | The claim button now softens a false rejection, and real claims will show which alternatives matter, so harvest before burning 3,600 jobs |
| M5 store split | One-way door. It ships alone, after backups exist on real devices |
| I5 Why? panel, I6 Mis trampas, I8, I9 | Acquisition ranks them below the fixes, and they want the re-tag |
| I7 library, E1 document lessons | Owner decisions O4, O5, O6 |
| E2 say-it card | Owner decision O3 |

## Remaining priorities

1. Eight to twelve real adults, and a real timed session on a phone (E6). The most valuable missing evidence in the project.
2. A Colombian editor reads the native-check list and the rewritten contrasts.
3. Everything still marked planned in `ROADMAP.md`.
