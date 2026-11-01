# Unified roadmap

Written for: the owner, deciding what happens next. Every task carries the eight required fields. The order inside each class is the order to do them. `00-lead-rulings.md` settles what the specialists disputed. `completion-record.md` says what has actually landed.

Sizes: **S** is under a day for one agent, **M** is days, **L** is weeks or a content burn. "Depends on" names other tasks by id.

The rule behind the order: **fix what makes the app lie first, then what loses data, then what stops teaching reaching the learner, and only then add anything new.** The biggest learning gains found by this audit sit in the minutes learners already spend, not in new features.

## How the classes relate

Safety work (C1 to C6) unlocks every curriculum move. Checker work (C7, F5, F6) pays for everything else in learner minutes, because each false rejection adds reviews. Contrast work (F1 to F3) is the largest teaching gap. Budget tuning comes after both, because they change what is being timed.

---

## Class 1. Critical corrections

### C1. One failed write ends all saving
- **Problem:** `Learner.touch` chains saves on one promise. One rejected IndexedDB write skips every later save and leaves `saveQueued` true, so the session hangs and progress silently stops.
- **Solution:** Catch per save, retry once, clear the queue flag, surface a human message if saving is failing.
- **Benefit:** A learner never loses a week of work to one transient error.
- **Files:** `src/learner/learner.ts`, `src/learner/store.ts`.
- **Depends on:** Nothing.
- **Size:** S.
- **Testing:** Inject a store that rejects once, then succeeds; assert later saves land and nothing hangs.
- **Success:** No code path leaves saving dead after a single failure.

### C2. An interrupted lesson loses what it presented
- **Problem:** Leaving a lesson after a teach block marks the grammar point as presented with no scheduled practice, so it is permanently lost (`teach.tsx:81`, `runner.ts:329`, `:536`).
- **Solution:** A sweep on abandon and resume that hands unpractised nodes back to the compiler.
- **Benefit:** An interruption, the commonest event on a phone, stops costing grammar.
- **Files:** `src/ui/session/runner.ts`, `src/ui/session/attribute.ts`, `src/learner/*`, `tools/sim`.
- **Depends on:** Nothing.
- **Size:** M.
- **Testing:** Abandon at every block on real plans; simulator abandon profile.
- **Success:** No node ends up presented, unscheduled and unpractised.

### C3. Corrupted or newer documents brick the app
- **Problem:** A newer document strands a learner on "Try again". There is no snapshot before migrating.
- **Solution:** Tolerant reader, human message, a pre-migration snapshot per version.
- **Benefit:** Protects every later schema change.
- **Files:** `src/learner/store.ts`, `src/ui/store/ui.ts`.
- **Depends on:** Nothing.
- **Size:** M.
- **Testing:** Golden learners, a newer-version fixture, corrupted documents.
- **Success:** A bad or newer document never blocks reading what can be read.

### C4. No backup
- **Problem:** Progress lives on one device. Clearing site data ends 19 months of work.
- **Solution:** Export and restore a file, by an allowlist of keys, through migrations, with a dry run, a pre-restore copy, and a refusal in human words for a newer backup.
- **Benefit:** Removes the largest risk a long-course learner carries, and gives the owner real data to rehearse with.
- **Files:** new `src/learner/backup.ts`, `src/ui/screens/settings.tsx`.
- **Depends on:** C3.
- **Size:** M.
- **Testing:** Round trip on golden learners, a newer backup, a broken file.
- **Success:** Export, wipe, restore gives an identical learner.

### C5. Saved progress has no link to the course version
- **Problem:** Saved progress uses integer indexes and positional ids, so any resequencing corrupts real learners.
- **Solution:** Stable day keys, a shipped path snapshot, an append-only content migration table, a pure and idempotent `reconcile` at boot, `contentVersion` on saved sessions, and a gate error if an id vanishes.
- **Benefit:** Makes every curriculum improvement in this roadmap safe.
- **Files:** new `src/learner/reconcile.ts`, `content/_shipped/`, `content/_migrations/`, `tools/gate`.
- **Depends on:** C1, C2, C3, C4.
- **Size:** L.
- **Testing:** A synthetic moved course against golden learners, property tests for idempotence.
- **Success:** Moving a day leaves no learner losing a node or a rep.

### C6. Green does not mean green
- **Problem:** `npm test` exits 1 with all tests passing. `publish.yml` ships anything that typechecks, with no tests or gate. There is no CI on this branch.
- **Solution:** Index the corpus scans, add CI, work on `next`, fast-forward `rebuild` only at stage ends.
- **Benefit:** A wrong commit can no longer reach learners unnoticed.
- **Files:** `src/exercises/translation.ts`, `.github/workflows/ci.yml`.
- **Depends on:** Nothing.
- **Size:** S.
- **Testing:** `npm test` exit code, golden learners.
- **Success:** Exit 0 on a clean tree; CI runs typecheck, tests, gate and build.

### C7. The checker refuses correct Spanish and names a false reason
- **Problem:** The rule-based matcher refused 8 of 10 valid answers in the lead's run, 41 of 47 and 17 of 21 in others, and 86 of 91 in acquisition's battery, with reasons that are false ("There's an extra word: a" for *A ella le gusta el café*). Each counts as a lapse. It leaks `xnum`, reports *soy* for *estoy* as spelling, and `splitEnclitic` never splits *irme*.
- **Solution:** Stage 0: fix `irme` and `xnum`, add `mood` and `aspect` hint kinds, stop asserting what cannot be proved. Then F5.
- **Benefit:** The largest controllable load in the product. Modelled at 7.6 reviews per card over 540 days, against 11.3 at 10% false rejection.
- **Files:** `src/check/translate/*`, `src/check/wordhint.ts`, `src/exercises/spanish.ts`.
- **Depends on:** Nothing.
- **Size:** M.
- **Testing:** The four batteries become one regression file, with negatives.
- **Success:** Zero false reasons on the battery, zero false accepts.

### C8. The two classic gustar errors pass
- **Problem:** *Yo me gusta el café* and *Ella le gusta el café* both pass: the checker drops subject pronouns, so the commonest error an English speaker makes is confirmed as right.
- **Solution:** Reject a subject pronoun on a person mismatch with the verb's experiencer, without failing *Él no me cae bien* or *Tú te quedas aquí*.
- **Benefit:** The app stops teaching the error it exists to remove.
- **Files:** `src/check/translate/*`.
- **Depends on:** C7.
- **Size:** S.
- **Testing:** Both directions in the battery.
- **Success:** Both errors fail with the right reason; both correct sentences pass.

### C9. Generated exercises teach broken Spanish
- **Problem:** Tense transforms prepend *Ayer* or *Antes* to anything parsed as a present clause, giving "right answers" such as *Ayer cuidá a tu hermano mientras yo salí*, *Poco no me sirvió, la verdad*, *¿Cómo se digo*.
- **Solution:** Allow a transform only on a licensed clause in a taught tense, with refusals. Never person-shift imperatives or pronouns.
- **Benefit:** No exercise displays wrong Spanish as correct.
- **Files:** `src/exercises/ladder.ts`, `src/exercises/recombine.ts`.
- **Depends on:** Nothing.
- **Size:** M.
- **Testing:** Sweep every generated transform across the corpus and lint it.
- **Success:** Zero malformed outputs in a full corpus sweep.

### C10. Placement fails in both directions
- **Problem:** A perfect score from "A bit" gives "We'll start at the beginning". 21 easy items reach week 60. Failing mood reaches week 44. 91% of items test tense recognition.
- **Solution:** Stage 0: fix `ladder.result`. Full rebuild is L2.
- **Benefit:** First impressions, and no wasted weeks.
- **Files:** `src/ui/session/placement.ts`.
- **Depends on:** Nothing for the fix.
- **Size:** S.
- **Testing:** Scripted all-right and all-wrong runs at each entry level.
- **Success:** A perfect run never returns week 1.

### C11. The reader shows wrong or absurd glosses
- **Problem:** Tapping *Ana* shows "anus". *Tomás* shows "to take". *Vale* shows "to be worth". 30 to 32% of taps show a note from a different position.
- **Solution:** Names first, reject loose matches, and refuse any phrase gloss not covering the tapped token.
- **Benefit:** The reader is the app's strongest surface and must be trustworthy.
- **Files:** `src/ui/data/bundle.ts`, `src/ui/blocks/read.tsx`.
- **Depends on:** Nothing.
- **Size:** S.
- **Testing:** An all-chapters test: every token's gloss belongs to that token.
- **Success:** Zero name glosses, zero phrase notes off their token.

### C12. Self-graded reads earn Good
- **Problem:** Read cards grade Good with no retrieval, so reviews pass with no evidence.
- **Solution:** Read cards are exposure only. A due card must be retrieved or stay due.
- **Benefit:** FSRS gets honest input.
- **Files:** `src/ui/session/cards.ts`, `src/ui/session/runner.ts`.
- **Depends on:** Nothing.
- **Size:** S.
- **Testing:** Grade assertions per op.
- **Success:** No read-only path produces a Good.

### C13. Evidence claims the learner did not earn
- **Problem:** Progress ticks "You can now" after "Not yet". Placement ticks 60 can-dos. Scene verdict says "They understood you" after five *no sé*. Writing accepted English nonsense and scored 3 of 4, and the text is thrown away.
- **Solution:** Ticks need a check or a self-mark; "Covered, not yet checked"; "Skipped at placement" apart from "Earned". Scene and writing verdicts need Spanish on the required point.
- **Benefit:** The third half of the product's promise: nothing is yours until you have used it.
- **Files:** `src/ui/screens/progress.tsx`, `src/ui/session/scene.ts`, `src/check/writing.ts`.
- **Depends on:** Nothing.
- **Size:** S.
- **Testing:** English nonsense, *no sé*, empty.
- **Success:** None of those earns a pass.

### C14. Language defects
- **Problem:** 701 claims raised, 548 survived refutation with fixes, 75 need a rewrite, 10 need a native speaker.
- **Solution:** Apply verified fixes. Rewrite the 56 in content by reading the whole script. Hand native-check items to the owner.
- **Benefit:** Explanations stop contradicting the course.
- **Files:** `content/scripts`, `graph`, `bank`, `story`, `scenes`, `writing`.
- **Depends on:** Nothing.
- **Size:** M.
- **Testing:** Gate, tests.
- **Success:** Zero errors in the gate; every claim accounted for in `verdicts/final.jsonl`.

### C15. `x:subj-present-past` states the reverse of the truth
- **Problem:** "Look at the first verb, not the clock" is refuted by at least 18 rows, and it goes live the moment contrasts run.
- **Solution:** Rewrite on time, not harmony (R5).
- **Benefit:** Prevents a critical error being shipped by F1.
- **Files:** `content/scripts/x_subj-present-past.json`.
- **Depends on:** Blocks F1.
- **Size:** S.
- **Testing:** Linguist-level read of the sentence set.
- **Success:** The rule predicts all 18 rows.

### C16. Placement crash at unit 2
- **Problem:** `render.ts 2 7` throws `FSRSValidationError: Invalid delta_t "-1"` at `learner.ts:508`. A learner placed near the start can crash a session.
- **Solution:** Find the negative interval at its source. Clamping is not enough if the date is wrong.
- **Benefit:** No crash for a placed beginner.
- **Files:** `src/learner/learner.ts`.
- **Depends on:** Nothing.
- **Size:** S.
- **Testing:** Sweep placements at every unit, seven days each.
- **Success:** No throw at any unit.

### C17. Wave-introduced faults block the first push
- **Problem:** Report B's comparison of `ee6aaec` with `5f916ec` shows that the placement ladder bug, the `xnum` leak, the "Start with the verb" hint, the five-minute loop and the Weak spots attribution exist only since the waves. A push ships them.
- **Solution:** All five are fixed before any fast-forward of `rebuild`.
- **Benefit:** The first release improves on the live site in every respect.
- **Files:** `src/ui/session/placement.ts`, `src/check/*`, `src/ui/session/cards.ts`, `src/compiler/compile.ts`, `src/ui/screens/weak.tsx`.
- **Depends on:** C7, C10.
- **Size:** M.
- **Testing:** The reproductions in Report B, section 6.
- **Success:** Each reproduction now gives the right result.

### C18. Chunk cards pair the wrong lines
- **Problem:** 6 to 9 chunks pair the English with the wrong Spanish line, and 378 of 607 chunk forms never reach a card. `Lo tengo clarísimo.` is refused for its own prompt.
- **Solution:** Fix `alignedPairs` for chunk forms, and read `forms` as the schema promises.
- **Benefit:** Translation cards obey the exact-pair rule.
- **Files:** `src/exercises/pairs.ts`.
- **Depends on:** Nothing.
- **Size:** S.
- **Testing:** All chunk cards generated and checked for pair alignment.
- **Success:** Zero misaligned pairs.

---

## Class 2. Foundational educational improvements

### F1. Contrast scripts are never taught
- **Problem:** All 94 contrast scripts never run: 0 of 252 teach blocks. Review-day `focus` is ignored in 75 listings. 84 of 94 contrasts have one aligned pair.
- **Solution:** Teach block for a new contrast in `drill()`; `reviewDay` runs a deliberate return. Script fixes ship in the same release (C15). A contrast day moves `communicative` and the freer `writing` off the day (R21).
- **Benefit:** The hardest English-to-Spanish choices finally get taught.
- **Files:** `src/compiler/compile.ts`, `src/compiler/types.ts`, `src/ui/session/labels.ts`.
- **Depends on:** C15, F9, F10.
- **Size:** M.
- **Testing:** A property that a new contrast yields a teach block and stays in budget; a simulator metric of contrasts taught against listed.
- **Success:** All 94 reachable. Plans near budget in the simulator.

### F2. Contrast reviews do not contrast
- **Problem:** A due contrast is one memorised sentence, or a read card for nodes with no segments. Contrasts are 1.7% of cards.
- **Solution:** Rotate the script's own read-and-pick and your-turn items now (1,471 of them), using a session number. `x_*` scripts become core content.
- **Benefit:** Interleaved retrieval on the highest-value nodes, at no minutes.
- **Files:** `src/compiler/compile.ts`, `src/ui/data/*`.
- **Depends on:** F1.
- **Size:** M.
- **Testing:** A due contrast yields a different item across sessions.
- **Success:** No contrast review is a read card.

### F3. One contrast store
- **Problem:** Drills do not test their distinction: ser/estar minimal pairs 1 in 31,096 cards, por/para 8, lo/le 11. The scripts hold 255 authored twin sets and 2,933 pitfalls that feed no exercise.
- **Solution:** `ContrastItem` in `content/contrasts/x_<id>.json`. A deterministic derive tool first, then top-ups. Format by what decides the contrast (R10). Fix `x:por-para`'s one-sided `contrasts` field.
- **Benefit:** One source for reviews, Train it, placement, benchmark, Uno u otro.
- **Files:** `src/content/schema.ts`, `loader.ts`, `tools/gate`, `tools/sim/load.ts`, `vite.config.ts`, new `tools/contrast/derive.ts`.
- **Depends on:** F2.
- **Size:** L.
- **Testing:** Guess Test and Cue Test in CI, gate fixture, gating property.
- **Success:** Forced choice cannot be beaten by tapping or a cue table.

### F4. Practice often tests an unrelated verb
- **Problem:** `chooseItem` gaps any verb. Structured input falls back to random-distractor meaning (84% at u45). The subjunctive gaps on 6% of rows.
- **Solution:** Computed `focus` span, written by `gate --fix`. Author only the 37 blind nodes.
- **Benefit:** 12 to 15% of card time starts practising the actual decision.
- **Files:** `src/content/schema.ts`, `tools/gate/checks.ts`, `src/exercises/ladder.ts`.
- **Depends on:** Re-tag, 200-span sample.
- **Size:** L.
- **Testing:** Sample, then an off-target card rate.
- **Success:** Target coverage above 90% on grammar rows.

### F5. Acceptance engine with swap reporting
- **Problem:** Word order, *ir a* against future, preterite against perfecto, *-ra* and *-se*, gender, *tú*, optional *a mí* are all refused.
- **Solution:** Variants generated in `variants.ts`, each carrying what it swapped. A swap touching the card's target gives a pass with a note, never silent. Only 1,014 of 72,693 rows have an `accept`, so the sidecar burn follows, sized by what fails.
- **Benefit:** Honest verdicts, fewer reviews, a real sense of being understood.
- **Files:** `src/check/translate/variants.ts`, `canon.ts`, `match.ts`.
- **Depends on:** C7.
- **Size:** L.
- **Testing:** Acceptance must rise with 0 false accepts, and a latency budget.
- **Success:** Battery above 85% accepted, 0 false accepts.

### F6. Named traps at the miss
- **Problem:** Of 249 real errors the feedback named the cause for 46 and misled on 46.
- **Solution:** One `src/check/traps/` module with four outcomes (R14), pitfalls scoped to card nodes, plus the node's trick line.
- **Benefit:** Corrective feedback at the moment of highest attention, at zero net minutes.
- **Files:** `src/check/traps/*`, `src/ui/components/card*`.
- **Depends on:** F5, C14.
- **Size:** L.
- **Testing:** A misleading battery and a correct-answer battery in the gate.
- **Success:** 0 misleading; useful hint rate above 60%.

### F7. Misses come back
- **Problem:** A miss in practice changes nothing, and failed drills do not repeat.
- **Solution:** A miss queues a fresh sentence for the same target, later in the session and next session.
- **Benefit:** Retrieval to criterion, well supported.
- **Files:** `src/compiler/compile.ts`, `src/ui/session/runner.ts`.
- **Depends on:** Attempt seam (M2).
- **Size:** M.
- **Testing:** Miss then assert a distinct-sentence retest.
- **Success:** Every miss on a target returns.

### F8. Real distractors and no free passes
- **Problem:** 2.2 to 4.1 minutes a session of choice cards have no feature; the longest option is correct 88 to 92% from B1.
- **Solution:** Near-neighbour distractors, equal lengths.
- **Benefit:** Clicks become discrimination, at no time cost.
- **Files:** `src/exercises/*`.
- **Depends on:** Nothing.
- **Size:** M.
- **Testing:** Guess Test on real sessions.
- **Success:** Longest-option strategy near chance.

### F9. One subjunctive model and one name
- **Problem:** Nine-plus names, "wish form" false for most triggers, "plain" means two things, and the "same person" reason is stated as the cause.
- **Solution:** R1 and R2, grown door by door.
- **Benefit:** The most difficult topic gets one reusable mental model.
- **Files:** `content/scripts/g_subj-*`, `src/exercises/input.ts`, `src/ui/session/tenses.ts`, `tools/burn/brief.md`.
- **Depends on:** Owner may revert (O1).
- **Size:** M.
- **Testing:** A grep of forbidden labels, a read by a linguist-role reviewer.
- **Success:** No script uses a retired label. u21 no longer gives "same person" as the reason for mood.

### F10. The six hard contrasts, rewritten
- **Problem:** Today's tests fail on the course's own bank.
- **Solution:** Paste in the contrastive review's text: ser and estar, preterite and imperfect, indicative and subjunctive, por and para, gustar-type, se family. Repaired tests for -ing and lo/le.
- **Benefit:** Reusable models for what defeats English speakers.
- **Files:** Named scripts in `cross-review/contrastive-reviews-explanations.md`.
- **Depends on:** Blocks F1.
- **Size:** M.
- **Testing:** Each test against the listed sentences.
- **Success:** Each model predicts its table, with stated leaks.

### F11. Grammar taught once and dropped
- **Problem:** 105 of 172 nodes never return in later focus. 168 of 172 last scheduled within 15 sessions. 40 thin nodes.
- **Solution:** Spiral returns in `reviewDay`. Thread days as a later content pass.
- **Benefit:** Spaced practice on grammar, not only sentences.
- **Files:** `content/units/*`, `src/compiler/compile.ts`.
- **Depends on:** C5, F4.
- **Size:** L.
- **Testing:** Report of the last-seen gap per node.
- **Success:** Every grammar node returns at least three times after introduction.

### F12. Ladder above A2 and first contact
- **Problem:** Recombine fired 0 times in 120 sessions above A2. First contact is passive.
- **Solution:** With `focus`, gaps exist. A typed first contact for B1 and up, a cognate fast path (20 to 38% of lexemes).
- **Benefit:** Saves minutes and raises retrieval.
- **Files:** `src/exercises/*`, `src/compiler/compile.ts`.
- **Depends on:** F4.
- **Size:** M.
- **Testing:** Ladder coverage by band.
- **Success:** Rung 3 reached above A2.

### F13. Connected verb gaps from chapters
- **Problem:** Aspect is decided by discourse, and no exercise practises that. Always-preterite scores 82% on single sentences.
- **Solution:** Verbs gapped in a chapter passage, with an authored also-valid list.
- **Benefit:** The only format that practises aspect where it is decided.
- **Files:** New `src/exercises/passage.ts`, `tools/burn`.
- **Depends on:** F4.
- **Size:** L.
- **Testing:** Valid rebuild battery.
- **Success:** No valid alternative rejected.

### F14. Curriculum moves and gaps
- **Problem:** Eight moves, about 25 gaps. Essential: por si, quisiera, verb-subject order, adjective position, *no sabía que* against *no creo que*, *lo bueno es que* against *es bueno que*.
- **Solution:** The linguist's corrected moves, cross-review section 4. Add `p:cuando-llegues` at u26 to u27.
- **Benefit:** Fewer holes and better ordering.
- **Files:** `content/graph/*`, `content/units/*`, `tools/nodemap`.
- **Depends on:** C5, re-tag.
- **Size:** L.
- **Testing:** Gate, reconcile, simulator.
- **Success:** No graph violation, no learner loses anything.

### F15. Lexeme rebuild and word delivery
- **Problem:** Average learner gets 19 of 380 B2 and 11 of 332 C1 words, 706 never reached, frequency ranks corrupted by homographs (*coser* 94), 145 verbs missing from the engine, gender wrong on -ista nouns.
- **Solution:** Rebuild ranks, lemmas and families together. Reserve word time.
- **Benefit:** The vocabulary the course claims to teach gets delivered.
- **Files:** `tools/vocab/build.ts`, `content/graph/lexemes.json`, `src/engine/verbs.json`.
- **Depends on:** Re-tag.
- **Size:** L.
- **Testing:** Coverage against real texts.
- **Success:** Planned words delivered, measured by the simulator.

### F16. Few and long at B2 and C1
- **Problem:** B2 and C1 rules are shorter than A1. `SESSION_MINUTES` still says 28 and 30, contradicting a standing decision.
- **Solution:** Raise minutes (cheap, M8: 389 new, 0 owed). Topic lessons later.
- **Benefit:** Upper-band depth.
- **Files:** `src/compiler/budget.ts`.
- **Depends on:** C5 for the larger part.
- **Size:** S for minutes, L for lessons.
- **Testing:** Simulator at B2.
- **Success:** No owed queue for a placed B2 learner.

---

## Class 3. High-value learner experience

### L1. Debt policy and re-entry
- **Problem:** Return after 21 days gives "1 of 61" with no welcome. Placed learners run review-only for 76 to 90% of 21 sessions, with 16 straight Catch-up sessions.
- **Solution:** Split fresh and debt, cap debt, no throttle from old debt, a card cap, a return plan ending on the next story beat (R18).
- **Benefit:** Fixes four reports' findings with one compiler change.
- **Files:** `src/compiler/compile.ts`, `src/compiler/budget.ts`, `src/ui/screens/home.tsx`.
- **Depends on:** Absence and placed profiles in the simulator.
- **Size:** M.
- **Testing:** Simulator profiles, a re-drive.
- **Success:** No learner goes more than two sessions without something new.

### L2. Placement rebuild
- **Problem:** See C10. Also no skill detail, items answerable from cognates.
- **Solution:** Staged, per-skill, on `ContrastItem` and typed sentences. Failed skill stays unseeded so `reconcile` owes it.
- **Benefit:** Right start for the second and third learner profiles.
- **Files:** `src/ui/session/placement.ts`, content item file.
- **Depends on:** F3, F5, C5.
- **Size:** L.
- **Testing:** Simulated learners with known profiles.
- **Success:** Known profile placed within one band.

### L3. Availability lane
- **Problem:** A fresh open drops chapters outside the window. Placed learners start at ch001. Home says Tomás has just landed. Missing content fails silently.
- **Solution:** A derived `library.json`, by-node index, async `prepare` before compile.
- **Benefit:** Placed learners read the right chapter.
- **Files:** `src/ui/data/*`, `tools/build/*`.
- **Depends on:** C6.
- **Size:** M.
- **Testing:** Real boot window, not the whole corpus.
- **Success:** Placed learner meets the right chapter with a recap.

### L4. Lessons that divide across days
- **Problem:** Today's same-day, 3-hour resume breaks long lessons.
- **Solution:** Parts that survive midnight.
- **Benefit:** Required for few-and-long.
- **Files:** `src/ui/store/ui.ts`, `src/ui/session/*`.
- **Depends on:** C2, C5.
- **Size:** M.
- **Testing:** Resume across days.
- **Success:** Part two resumes the next morning.

### L5. Look up, weak spots and five-minute days
- **Problem:** Look up cannot find "preterite" or "conditional". Every contrast Train it is a dead end at "week 165". Weak spots drill the wrong things. Five minutes a day gives a 9-day streak and 0 lessons.
- **Solution:** Aliases, working Train it on contrast items, weak spots on Assert hits (R14), short days chained so they finish lessons.
- **Benefit:** The reference and repair surfaces do what they promise.
- **Files:** `src/ui/screens/reference/*`, `weak.tsx`, `src/ui/session/freeplay.ts`.
- **Depends on:** F3 for Train it.
- **Size:** M.
- **Testing:** Query battery, re-drive.
- **Success:** Standard tense names are found.

### L6. First ten minutes
- **Problem:** Day 1 opens with about 50 cards of phrase drilling before any teaching.
- **Solution:** Chapter 1 lands by about minute 8.
- **Benefit:** Retention at the point of highest drop-off.
- **Files:** `src/compiler/compile.ts`, `content/units/u01.json`.
- **Depends on:** Nothing.
- **Size:** S.
- **Testing:** Render day 1, re-drive.
- **Success:** First chapter by minute 8 at modelled pace.

### L7. The story is rationed
- **Problem:** Only 39 of 120 sessions contain a chapter or scene. Scenes come on sessions 10 and 65.
- **Solution:** Serialise chapters into daily beats, stop gating scenes on owed words.
- **Benefit:** The app's real engagement reaches most days.
- **Files:** `src/compiler/compile.ts`, `src/ui/session/beats.ts`.
- **Depends on:** F1 budget work.
- **Size:** M.
- **Testing:** Simulator story-day share.
- **Success:** More than 70% of sessions contain story.

### L8. Better feedback mechanics
- **Problem:** "Try again" spends a second attempt without allowing an edit. Word-level diffs are missing, although `align` already computes them. Close screen offers nothing to do with misses.
- **Solution:** Edit-in-place retry, word-level diff.
- **Benefit:** Feedback locates the mistake.
- **Files:** `src/ui/components/card*`.
- **Depends on:** None.
- **Size:** S.
- **Testing:** Component tests.
- **Success:** Diff on every miss.

### L9. Course shape in the shell
- **Problem:** CEFR claims, no unit-end marker, a course-end cliff, a Settings control contradicting the rule on lesson length.
- **Solution:** Stage labels (R24), unit-end marker, a real ending, remove the tier control.
- **Benefit:** Honest orientation.
- **Files:** `src/ui/screens/*`.
- **Depends on:** None.
- **Size:** S.
- **Testing:** Copy test.
- **Success:** No CEFR claim without evidence.

### L10. Accessibility, keyboard, desktop
- **Problem:** P15 gaps.
- **Solution:** Labels, focus, routes.
- **Benefit:** Works for more people and devices.
- **Files:** `src/ui/*`.
- **Depends on:** None.
- **Size:** M.
- **Testing:** Playwright.
- **Success:** Keyboard-only session.

---

## Class 4. Important missing capabilities

### M1. Saved writing
- **Problem:** Everything a learner writes is thrown away.
- **Solution:** Own KV key, including personal answers. Capture now, view later.
- **Benefit:** A record of growth, and data for F6.
- **Files:** New store, `src/ui/blocks/writing.tsx`.
- **Depends on:** C4.
- **Size:** S.
- **Testing:** Round trip, included in backup.
- **Success:** Text survives and exports.

### M2. Attempt seam and attempts log
- **Problem:** Data not logged today cannot be recovered: the given answer, the error kind, the format, the first-key time, the content revision.
- **Solution:** One attempt seam for 12 runner sites, 5 in freeplay, 15 in the simulator. A separate capped log, not `ReviewEvent`. A fingerprint rollup.
- **Benefit:** Enables F6, F7 and every later evaluation.
- **Files:** New `src/ui/session/attempt.ts`, `src/learner/*`.
- **Depends on:** C1.
- **Size:** M.
- **Testing:** Golden learners, grading unchanged.
- **Success:** Every answer logged once, grading identical.

### M3. Per-format timing and `Policy`
- **Problem:** Time constants are guesses; `SECONDS` drives 28 sites.
- **Solution:** Honest priors, a `timing.byFormat` rollup, one `cost(op)`, constants as a `Policy`.
- **Benefit:** The app stops cutting its best parts.
- **Files:** `src/compiler/budget.ts`, `compile.ts`.
- **Depends on:** F1, F4, F5.
- **Size:** M.
- **Testing:** Simulator tables for the owner.
- **Success:** Estimates within 15% of measured time.

### M4. Reader capabilities
- **Problem:** No next chapter, no per-sentence English, no tap to card, no known share. 71% of receptive words never appear in story.
- **Solution:** Open reader, a save creates a card, at most three a day (R25). Chapter English after chapter fixes.
- **Benefit:** Reading becomes a place to go.
- **Files:** `src/ui/screens/story.tsx`, `src/ui/blocks/read.tsx`.
- **Depends on:** C11, L3.
- **Size:** M.
- **Testing:** Re-drive.
- **Success:** Learner can read on without a lesson.

### M5. Store split
- **Problem:** Every answer rewrites the whole learner: 1.3 s on the main thread at 2 years on a throttled device.
- **Solution:** New database, copy, verify, flip, keep old for two releases. Ships alone.
- **Benefit:** Keeps old learners fast.
- **Files:** `src/learner/store.ts`.
- **Depends on:** C3, C4.
- **Size:** L.
- **Testing:** Property test on random operations.
- **Success:** Save under 50 ms at 2 years.

### M6. Transfer probes and fixed instruments
- **Problem:** Nothing measures learning. Practice measures practice.
- **Solution:** Quarantined rows, a C-test, a cold read, a same-prompt writing sample.
- **Benefit:** The only honest outcome measures.
- **Files:** `tools/gate`, new content.
- **Depends on:** F4, M2.
- **Size:** L.
- **Testing:** Gate quarantine.
- **Success:** Probe results exportable.

### M7. Gate triage
- **Problem:** 6,800 warnings hide the few that matter; a one-line warning hides 5,687 ungated rows.
- **Solution:** Classes, `detectable`, one chapter length table.
- **Benefit:** Warnings get read.
- **Files:** `tools/gate*`.
- **Depends on:** None.
- **Size:** S.
- **Testing:** Gate fixtures.
- **Success:** Under 100 actionable warnings.

---

## Class 5. Product innovation opportunities

### I1. Relámpago
- **Problem:** No short activity exists, and no reason to open the app for two minutes.
- **Solution:** Timed conjugation and word speed on known items, exposure only, personal best.
- **Benefit:** Automaticity with no schedule damage.
- **Files:** `src/games/*`, `src/ui/games/*`.
- **Depends on:** C4, M2.
- **Size:** M.
- **Testing:** Blind tapping cannot beat knowledge; `ms` never reaches `recordTime`.
- **Success:** Lessons per week not reduced.

### I2. Uno u otro
- **Problem:** Choices are what defeat English speakers.
- **Solution:** Forced choice on balanced decks, no clock on discourse decks.
- **Benefit:** Extra contrast practice, never the only return.
- **Files:** `src/games/*`.
- **Depends on:** F3.
- **Size:** M.
- **Testing:** Guess and Cue tests.
- **Success:** Careful knowledge beats any strategy.

### I3. De corrido
- **Problem:** Reading rate is never trained.
- **Solution:** Timed rereads of known chapters, with personal bests.
- **Benefit:** Fluency in reading.
- **Files:** `src/games/*`, reader.
- **Depends on:** C11.
- **Size:** S.
- **Testing:** Words per minute logged.
- **Success:** Learners reread.

### I4. Rescate
- **Problem:** Due cards feel like debt.
- **Solution:** Due cards, no clock, real grades.
- **Benefit:** A game that does real reviews.
- **Files:** `src/games/credit.ts`.
- **Depends on:** C4.
- **Size:** S.
- **Testing:** Grades only through the proper path.
- **Success:** No FSRS corruption.

### I5. A reason at the miss, and Why? in the reader
- **Problem:** No sentence can explain itself.
- **Solution:** Lazy tagger chunk (146 KB gzip), whitelisted feature families. Reason pushed on a miss first, the panel later.
- **Benefit:** The sentence accounts for itself.
- **Files:** New `src/explain/*`.
- **Depends on:** Re-tag precision.
- **Size:** L.
- **Testing:** A frozen corpus pass.
- **Success:** No false statement in a sample.

### I6. Mis trampas
- **Problem:** Errors are invisible to the learner.
- **Solution:** Named misconceptions over the fingerprint, above 95% precision only.
- **Benefit:** Personalisation with a reason.
- **Files:** `src/ui/screens/weak.tsx`.
- **Depends on:** F6, M2.
- **Size:** M.
- **Testing:** Precision battery.
- **Success:** Routed practice improves probes.

### I7. The library the plot names
- **Problem:** The plot cites texts nobody can read. C1 prose runs at 8.4 words a sentence; real text coverage is 74 to 86%.
- **Solution:** Hernando's notebooks, fares, documents, and a real book at the end.
- **Benefit:** A destination, and a reason to choose this app.
- **Files:** New `content/reading/*`.
- **Depends on:** F15, O4, O6.
- **Size:** L.
- **Testing:** Colombian editor, a pilot of thirty fares.
- **Success:** Editor's verdict and learner return.

### I8. Paste any Spanish
- **Problem:** No exit from the course to real Spanish.
- **Solution:** Graded concordance of pasted text against what the learner owns.
- **Benefit:** A yardstick and an exit, from B2.
- **Files:** `src/explain/*`.
- **Depends on:** I5.
- **Size:** M.
- **Testing:** Known texts.
- **Success:** Reports sensible coverage.

### I9. An interface that turns Spanish
- **Problem:** The shell stays English forever.
- **Solution:** Forty commonest strings turn as the learner owns the words.
- **Benefit:** Effortless exposure.
- **Files:** `src/ui/*`.
- **Depends on:** None.
- **Size:** M.
- **Testing:** A gate check on owned words.
- **Success:** No string turns before it is owned.

---

## Class 6. Longer-term experiments

Each carries a kill rule, because none has evidence behind it yet.

### E1. One document-led lesson at u45
- **Problem:** B2 and C1 are competent, not compelling.
- **Solution:** Build u45 from documents, then test against today's u45 with three strong learners.
- **Benefit:** May redefine the upper band.
- **Files:** New content, multi-day resume.
- **Depends on:** L4, O5.
- **Size:** L.
- **Testing:** Side-by-side play.
- **Success:** Obviously better, or stop and keep the units.

### E2. Say-it card
- **Problem:** Typed sentences cost 42 s at C1.
- **Solution:** An untyped, self-graded translation at 13 s, for stable cards from B1, with every fourth typed.
- **Benefit:** More translation per minute.
- **Files:** Cards.
- **Depends on:** O3.
- **Size:** M.
- **Testing:** Owner's own play; typed-check failure rate.
- **Success:** Typed checks hold. Kill if they fall.

### E3. Reading pays reviews
- **Problem:** Untapped words read in context get no credit.
- **Solution:** Bounded partial credit on receptive cards.
- **Benefit:** Fewer reviews.
- **Files:** `src/ui/session/attribute.ts`.
- **Depends on:** M4.
- **Size:** M.
- **Testing:** Paired trial, stated stop rule.
- **Success:** Recall holds with fewer reviews.

### E4. El Caso
- **Problem:** Evidence-style grammar items are engaging, but the frame doubles time per item.
- **Solution:** Move items into decks. Pilot five cases.
- **Benefit:** Possible engagement above B1.
- **Files:** New.
- **Depends on:** F3.
- **Size:** M.
- **Testing:** Five-case pilot.
- **Success:** Return rate, with a stated kill.

### E5. El tinto
- **Problem:** No daily ritual.
- **Solution:** One sentence with a character, after target scoring.
- **Benefit:** A habit bet with no learning claim.
- **Files:** `src/games/*`.
- **Depends on:** F5.
- **Size:** M.
- **Testing:** Habit measure.
- **Success:** Lessons per week rise.

### E6. Real adults
- **Problem:** Every minute figure in this audit is a model, and no real learner has been measured.
- **Solution:** Put eight to twelve adults through the app. Time a real session on a phone.
- **Benefit:** The most valuable missing evidence in the project.
- **Files:** None.
- **Depends on:** C1 to C4 live.
- **Size:** M.
- **Testing:** The export.
- **Success:** A real seconds-per-format table.

### E7. Mastery model
- **Problem:** No learner-facing mastery estimate is honest yet.
- **Solution:** Run silently until it beats FSRS stability on transfer probes.
- **Benefit:** Honest progress.
- **Files:** `src/learner/*`.
- **Depends on:** M6.
- **Size:** L.
- **Testing:** Prediction on probes.
- **Success:** Beats FSRS, or never shown.

---

## Stage order

| Stage | Contents | Exit |
|---|---|---|
| 0 Safe ground | C1, C2, C3, C4, C6, C7, C8, C9, C10, C11, C12, C13, C16, C17, C18 | Tests exit 0, gate clean, golden learners pass, played session |
| 1 Seams and capture | C5, M1, M2, L3, L8, L9, M7 | `reconcile` proved on a moved course |
| 2 Repair the core | C14, C15, F1, F2, F5, F6, F8, F9, F10, F16 minutes, L1, L6, L7 | Battery up, 0 false accepts, every contrast reachable, placed learner does not stall |
| 3 Tagger window | Re-tag, F4, F15, F14 | Gate clean, spans sampled |
| 4 Burns | F3, accept sidecars, F13 | One runner at a time, each pilot reviewed |
| 5 Time and shape | M3, F11, F12, L4, F16 lessons, M5 | Simulator tables decided by the owner |
| 6 Proof and entry | L2, M6, E6 | Real numbers exist |
| Free running | I1, I3, I4 after stage 1; I2 after F3; I5, I7 after stage 3 | Each on its own test |
