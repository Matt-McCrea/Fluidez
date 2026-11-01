# Cross-review: do the learning proposals survive a real learner's day?

Reviewer: Product and Learner Experience. Date: 1 November 2026. Reviewed: reports 03, 04-curriculum, 04-vocabulary-reading, 06-innovation, 06-games and my own 05-lower and 05-upper.

## Bottom line

**Almost every proposal is right on its own, and together they do not fit.** Kept as written, they turn a 20-minute lesson into about 31 minutes at A1, a 25-minute lesson into about 48 at B1, and a 30-minute lesson into about 65 at C1, before any game. Build cost is secondary here. Learner minutes are not build cost, and "best app" does not buy more of them.

Five findings change what should be done:

1. **The "2 to 3 times too fast" figure is true of reviews, not sessions.** Re-costed card by card, sessions overrun by about 1.05 times at A1, 1.2 at B1 and 1.3 at C1. The whole overrun is the warm-up, which is never cut. At C1 it takes 18 of 40 minutes against a budget of 9.
2. **At real pace the app cuts its best parts.** When time runs out, it stops new words first, then skips "Say something true", the recap, the timed rerun and the fluency re-read. The warm-up is protected. At the mid scenario this happens on most days from B1 up.
3. **False rejection is the biggest controllable load in the product.** In a simulation with the app's FSRS weights, one card costs 7.6 reviews over 540 days. At a 10% false rejection rate it costs 11.3. Fixing the checker is the only proposal with negative minutes, so it pays for the others.
4. **B1 is the real squeeze, not C1.** C1 has the owner's "few and long" escape. B1 has neither a long lesson nor spare time, and it is where the plateau lives.
5. **The story is rationed.** In 120 sessions from zero, only 39 had a chapter or a scene. In the first 30 there were chapters on sessions 1, 6, 17, 22 and 29, and one scene, on session 10. The next scene came on session 65. Several reports measure how little reading there is, but none shows how few sessions contain any story at all.

My proposal is a fixed daily budget of five parts, with every addition naming what it replaces. It needs one new card type, the say-it card (section 3.5). A lesson must also divide into parts that survive midnight, and the product should have five tabs, with features offered at the moment they matter rather than left to be found.

## 1. How I checked

- **Re-costed real sessions.** I took the acquisition specialist's card logs (real compiler, real content, all answers right; 10,048 cards in all, 14 to 120 sessions per start point) and priced each card from what is on it. Scripts: `/private/tmp/claude-501/-Users-Matthew-Fluidez/40ef6734-a9c2-4284-b528-c9cc038164e6/scratchpad/product-learning/timecost.py` and `daytypes.py`.
- **Simulated review load** with the app's FSRS weights and 365-day cap: `load-sim.ts` in the same folder.
- **Measured the real shell** in Chromium at 390, 360 and 320 px with a throwaway profile, on the dev server with real content.
- **Read the code** for what gets cut when time runs out (`runner.ts`), resume rules (`store/ui.ts`), Close, Home, Progress, Story and onboarding.
- **Rendered** 10 sessions each at units 5, 34 and 56.

**The time model.** Nobody has timed a real learner, so I give three scenarios. The middle one prices a typed card as thinking time (5 s plus 0.5 s per word), 2.3 s per word typed, 4 s to read the result, and a 25% chance of a miss that costs about 11 s plus half a retype. A choice card is 6.5 s plus 0.25 s per word on screen. That gives whole sentences of 29 s at A1, 35 s at B1 and 42 s at C1, close to the app's own `SECONDS.translate` of 35. The low and high scenarios bracket it. Treat these as a model, not a measurement.

## 2. The arithmetic

### 2.1 What a session costs today

| Where | Budget, min | Compiler's estimate | Cards | Typed sentences | Typed words | Low | **Mid** | High | Warm-up at mid | Warm-up budget |
|---|---|---|---|---|---|---|---|---|---|---|
| A1, sessions 17 to 60 | 20 | 20.3 | 49 | 20.5 | 118 | 15.8 | **20.0** | 24.3 | 6.9 | 7 |
| A1, sessions 61 to 120 | 20 | 21.6 | 51 | 21.1 | 132 | 17.4 | **22.0** | 26.8 | 8.2 | 7 |
| A2, unit 20 | 22 | 22.4 | 50 | 22.4 | 154 | 19.1 | **23.7** | 28.6 | 10.2 | 7 |
| B1, unit 35 | 25 | 25.1 | 56 | 26.1 | 202 | 24.5 | **30.6** | 37.1 | 12.9 | 8 |
| B2, unit 45 | 28 | 27.1 | 64 | 30.4 | 248 | 29.1 | **36.9** | 45.3 | 15.2 | 9 |
| C1, unit 58 | 30 | 27.2 | 67 | 33.5 | 309 | 31.1 | **39.9** | 49.6 | 17.9 | 9 |

These are perfect-answer sessions, so they show the work the plan asks for. They are not sessions anyone would finish at that length, because a real learner hits the throttle first.

Three things follow:

- **A1 is roughly honest.** The app's promise of about 20 minutes holds for a beginner. Do not tune A1 as if it were broken.
- **The overrun scales with typing.** Typed words per session rise 2.6 times from A1 to C1 while the budget rises 1.5 times. From B1 up the warm-up runs 1.6 to 2 times over its budget. Acquisition's factor of 2 to 3 is the real cost of a review against the 10-second prior, so its P8 stands, but the session-level headline is 1.2 to 1.3.
- **The overrun lands on the wrong things.** `softBlock` in `runner.ts` lists `personal`, `recap`, `sceneRerun`, `extraReading`, `leech` and the fluency re-read as what goes first. `outOfTimeFor` stops new items, which feeds the owed queue. The warm-up "is never cut short". So every reading of V1 (706 owed words), C4 (the stall) and "Say something true" being skipped is the same event seen from different reports.

### 2.2 The price of one new item

Nobody has costed intake. One carded item costs about 55 s to teach, then 7.6 reviews over 18 months. At 30 s a review, that is 4.7 minutes per item. The course plans 3,676 carded items over 593 sessions (2,528 words, 650 patterns, 404 chunks, 94 contrasts), or 6.2 a day. If every review were a single-target typed sentence, that would be about 29 minutes a day at steady state. Multi-target grouping and recognition formats bring it down a good deal, which is why warm-ups run at 20 to 32 cards rather than 60. The remainder shows up as the owed queue and the throttle.

The vocabulary report's own table already shows this. The standard tier delivers 1,822 of 2,528 words; the extended tier, at 15 minutes more, delivers all of them. **The course as planned is a 35 to 45 minute course sold as 20.**

Three levers change the price:

| False rejection on recalled reviews | Reviews per card, 540 days | | Retention target | Reviews per card | True lapses per card |
|---|---|---|---|---|---|
| 0% | 7.6 | | 0.90 (today) | 7.6 | 0.71 |
| 5% | 9.1 | | 0.87 | 6.6 | 0.79 |
| 10% | 11.3 | | 0.85 | 6.4 | 0.86 |
| 20% | 23.0 | | 0.82 | 5.6 | 0.91 |

The false rejection column compounds because each false lapse drops a card to a short interval, where it is tested again and can be falsely rejected again. The simulation applies one rate to every review, while the real rate is unknown and applies only to typed sentences, about two thirds of warm-up cards at B1. So read this as direction and scale: acquisition's "nearly doubles that card's first-year cost" is, if anything, an undercount.

The third lever is the cost per review, in section 3.5.

### 2.3 What each proposal adds per session

Average minutes per session across day types, at the mid scenario, if kept as written.

| Addition | Source | A1 | B1 | C1 | Basis |
|---|---|---|---|---|---|
| New items at full demand | Vocab V1 | +3.8 | +3.5 | +3.0 | 6.8, 5.4, 6.8 items at 55 s, less what is spent now |
| Contrast taught on its day | Acq P2, Curr 1 | +0.6 | +0.9 | +0.5 | 4 min on 14%, 21%, 13% of sessions |
| Thread block on review days | Curr 6.2 | +0.3 | +0.3 | +0.3 | 10 cards on 7% of sessions |
| Misses return, drills repeat | Acq P6 | +1.0 | +1.0 | +1.0 | 3 cards, plus a repeat on 1 drill in 5 |
| Third verdict, word diff, rule line | Acq P1, P5 | +0.5 | +0.7 | +0.8 | About 6 s on each sentence miss |
| Real distractors | Acq P4, Vocab V12 | +1.1 | +1.1 | +1.1 | +3 s on 20 to 25 choice cards. Today's cards are quick because they are easy |
| Reading to 400,000 words | Vocab R2 | +0.9 | +4.7 | +9.4 | New words on top of the story, at 70, 100, 140 words a minute |
| Rebuild | Innov F4 | 0 | +0.7 | +0.7 | 4 min, one session in six |
| Case file | Innov F5 | 0 | +0.7 | +0.7 | 7 min, one session in ten |
| Sprint | Acq P10 | +0.6 | +0.6 | +0.6 | 2 min on drill days |
| Transfer probes | Acq P13 | +1.3 | +1.3 | +1.3 | 266 nodes twice over 593 sessions is 0.9 a session, at 1.5 min |
| Typed and Spanish questions | Vocab R5 | 0 | +0.3 | +0.6 | |
| Longer writing, revise loop | Curr, Games | 0 | +0.5 | +3.2 | One 400-word piece a unit at 12 words a minute |
| Longer notes at upper bands | Curr P5 | 0 | +0.2 | +0.3 | |
| Collocation layer, if carded | Vocab V8 | 0 | +1.1 | +1.1 | 1.2 items a session, before their reviews |
| **Added** | | **+10** | **+18** | **+25** | |
| **Session, everything kept** | | **31** | **48** | **65** | |
| Budget | | 20 | 25 | 30 | |

Outside the lesson: El tinto and one round add about 4.5 minutes a day. Five benchmarks of 45 to 60 minutes, a monthly yardstick and a cold read come on top.

Reports 03, 04-curr and 04-vocab each cost their own additions in isolation. Acquisition's P8 says the trade-off exists and leaves it to the owner. Innovation's section 6.7 is the only one that says where its time comes from, and its answer (replace 11 weak choice cards, and the re-reads) recovers about 3 minutes of an 18-minute claim at B1.

### 2.4 The whole course

| Scenario | Hours | Calendar for an ordinary learner |
|---|---|---|
| As planned | 242 | 19.5 months if never missed, 26 in the simulator |
| Today's content, honest pace | About 290 | Hidden by throttling |
| Every proposal kept | About 470 | 3.5 years at 25 minutes on 88% of days |
| The shape I propose (section 3) | About 285 | 27 to 30 months |

The honest long-run budget for someone giving 20 to 25 minutes on 88% of days is about 105 to 135 hours a year. The curriculum report wants more hours and is right about the shape, but the hours cannot come from the same daily lesson. They come from the optional library and from people who choose to do more.

## 3. A real day after all the proposals, and the day I would ship

"Everything kept" means every proposal as written. "Ship" means what I would build. Minutes are at the mid scenario, and cards exclude screens with nothing to answer.

### 3.1 A1: a teaching day in part 5, 20-minute budget

| Block | Today | Everything kept | Ship |
|---|---|---|---|
| Warm-up | 19 cards, 7.7 min | 19 cards, 8.3 min | 15 cards, 5.5 min |
| Yesterday's misses | none | 3 cards, 1.0 min | Up to 3, inside warm-up |
| New | 6 cards, 2.5 min | 7 items, 20 cards, 6.2 min | 5 items, 10 cards, 4 min |
| Teach | 17 cards, 5 min | 17 cards, 5.2 min | 11 cards, 5 min |
| Contrast | none | 2 cards, 0.6 min average | Replaces read-and-pick on its day |
| Story | 3 questions, 1.6 min, 1 day in 3.5 | 4 cards, 2.6 min | A beat every day, 1 or 2 questions, 2.5 min |
| Say something true | 1, 1.5 min | 1, 2 min, plus 1 probe, 1.3 min | 1, 2 min |
| Sprint, recap, close | 1 card, 0.5 min | 7 cards, 2.2 min | Close 0.5 min, recap only if missed |
| **Total** | **46 cards, 20 min** | **About 70 cards, 30 min** | **About 39 cards, 20 min** |

**What must go at A1:** a quarter of the intake. Five carded items a day instead of 6.8 means the rest are read and tapped, not drilled. *La mazorca* and *bucear* do not need productive cards at A1. This is an owner decision: the alternative is about 20 more sessions in A1, which the curriculum report would accept. A1 keeps its typed sentences, because spelling and accents are being built and say-it cards are not yet safe.

### 3.2 B1: an average practice day in part 34, 25-minute budget

| Block | Today | Everything kept | Ship |
|---|---|---|---|
| Warm-up | 27 cards, 13.4 min | 27 cards, 13.4 min, plus 3 misses, 1.1 min | 18 cards: 5 typed, 8 say-it, 5 pick. 7 min, misses included |
| Rule recall | 1 min | 1 min | Part of drill |
| New | Often none | 15 cards, 5 min | 4 items, 7 cards, 2.5 min |
| Drill | 20 cards, 6.5 min | 23 cards with contrast, 7.7 min | 13 cards: 5 pairs, 5 focused gaps, 3 whole sentences. 5 min |
| Talk about you | 4 cards, 1.5 min | 4 cards, 1.5 min | Moves into Use |
| Reading | Chapter 1 day in 3, 2.6 min average | 570 words, 6.7 min | Story beat plus one short piece, 450 words, 2 questions, 6.5 min |
| Use | Writing 2.1 min average | Rebuild, case, writing, probe, 5.3 min | One of: 3-line Rebuild, scene, short writing. 3.5 min |
| Sprint, recap, close | 1 min | 9 cards, 2.6 min | Close 0.5 min |
| **Total** | **51 cards, 29 min** | **About 85 cards, 45 to 48 min** | **About 43 cards, 25 min** |

The shares on the ship day are about 58% language study, 26% reading and 14% production for meaning. Nation's 25% each is not reachable in a text-only explicit course, and acquisition's strand table should be read across the week, once Read and Play count. Moving from about 70% language study to 58% is a real gain.

**What must go at B1:** typed whole sentences as the default review, the remix block, cued production, the immediate re-read, and the idea that a case file or Rebuild is added to a day. Both replace a day's Use part, or a review day. If the simulator with honest timing says 27 minutes, set 27 and say so on Home. Do not hide 2 minutes in a 25.

### 3.3 C1: one topic lesson, three parts, about 50 minutes

| Part | Content | Cards | Min |
|---|---|---|---|
| 1. The words for it | Warm-up of 20: 5 typed, 11 say-it, 4 pick. All frames for the function as one taught block | 28 | 16 |
| 2. Read it | One text of 900 to 1,300 words, 3 questions with 1 short typed answer, a contrast drill drawn from the text, 3 new words from it | 15 | 17 |
| 3. Say it yourself | 4-line Rebuild, about 180 words of writing, model comparison | 4 lines, 1 piece | 15 |
| **Total** | | **About 47** | **48** |

Compare today's 67 cards and 40 minutes at the mid scenario, and "everything kept" at about 100 cards and 65 minutes.

**The lesson is one lesson, and it must not require one sitting.** Each part ends at a natural stop, with its own close, and can fall on a different day. Someone with a free Sunday does it all at once. The owner's "depth in one sitting" is about not spreading a topic across a month of thin days, and this keeps that. It also honours the rule that learners do not choose length: nobody chooses, the lesson simply divides. `isResumable` today requires the same day and 3 hours, so this is an engine change, and without it nobody finishes a 50-minute phone lesson.

### 3.4 What must go, ranked

| # | Goes | B1 min back | C1 min back | Note |
|---|---|---|---|---|
| 1 | Typed whole sentence as the default review | 4.9 | 7.9 | Typed stays for at-risk and early cards. See 3.5 |
| 2 | False rejections | 1 to 2 | 1 to 2 | Also shrinks future load. Size unknown |
| 3 | Productive cards for everything | 1.5 | 2 | Curriculum's three pattern tiers, cognate fast path, opaque words prioritised |
| 4 | Remix and cued production as blocks | 1 | 1.5 | Replaced by thread days and new words met in the day's text |
| 5 | Same-session re-read above A2 | 0.7 | 1.1 | Moves to De corrido. A1 text at C1 is already silly (upper report) |
| 6 | Read-and-pick for learners at rung 2 and up, whole-sentence answers to one-word choices | 1 | 1 | Acq P17 |
| 7 | Recap with nothing missed | 0.4 | 1 | Keep it when something was missed |
| 8 | Collocations as cards | 1.1 | 1.1 | They go in reading and Look up |

Not added to any lesson: sprints, new probe tasks, benchmarks as long exams, and essays over 250 words.

Two more levers are worth simulating: a retention target of 0.85 for stable non-core cards, and multi-target review for words met in the day's reading. The second would make a word met in a chapter count once as a soft review, which `creditSentence` already half does.

### 3.5 The idea that makes it fit: the say-it card

**The conflict.** The owner wants more translation everywhere, and acquisition says not to retreat from production. But 21 typed sentences at 42 s is 15 of the 40 minutes at C1, on a phone keyboard. Cloze saves time but is less translation.

**The card.**

```
Say this in Spanish, out loud or in your head.

The closer the date gets, the less I can sleep.

[Show me]

Mientras más se acerca la fecha, menos puedo dormir.

[Had it]   [Not quite]
```

It takes about 13 s, a third of the typed time, so a warm-up can hold **more translations, not fewer**, with less typing. There is no keyboard and no checker, so no false rejection. It works one-handed on a bus. And it is the only speaking this product can ever ask for: the app plays nothing and hears nothing, so the no-listening and no-AI rules are untouched. Lower report item 14 suggested spoken rehearsal as a late extra. It should be central.

**Rules.** Only from B1, and only on cards already stable for three weeks and at rung 2 or higher. New, lapsing and rung-climbing cards stay typed. Every fourth review of a card is typed, as an honesty check. "Had it" is Good and "Not quite" is Again, with no retry. If typed checks fail after self-graded passes, that learner gets fewer say-it cards. Self-grading is how Anki has always worked, and P1 in the acquisition report already accepts it.

**Limits.** I recall work showing covert retrieval helps memory about as much as overt retrieval (Smith, Roediger and Karpicke 2013, from memory, not verified). It concerned memory for material, not morphology. Accents, spelling and exact endings will not be trained by these cards, which is why typed checks and the drill stay. Learners may over-credit themselves. Treat this as a strong hypothesis to test in the owner's own play first.

## 4. What would feel heavier, more school-like or more punishing

**There are ten assessment surfaces.** Today: checkpoint days, Take a check, the can-do self-mark. Proposed: stage benchmarks, thread gates, transfer probes, monthly C-test, monthly cold read, band letters, a one-unit test-out. Each is defensible, and together they make a school. Three should remain:

1. **Quiet evidence inside lessons.** Scenes, writing and Rebuild feed can-dos and the probe sample. Nothing is announced and nothing is failed.
2. **The stage finale.** The consolidation week ends with a letter from a character, the games report's best idea. The reading, use-of-language and translation sections arrive as ordinary lesson parts of about 12 minutes across that week. No hour-long sitting, no timed essay.
3. **A monthly page,** with one optional measure at most, rotating between a cold read and Remiendo.

Take a check stays in You for those who want it.

| Proposal | Why it weighs | Change |
|---|---|---|
| Benchmark, 45 to 60 min, with 40-item use-of-language section | The app's voice says "A check-in, not an exam", and this is an exam, in one phone sitting | Split as above. Never a gate |
| "You have stopped being able to do this" (Innov A1.14); unannounced cold tests | An adult who pays with their free time does not want to be ambushed or told they lost something | Use it for scheduling, silently. Say what to do, not what was lost |
| "Spanish you have today" falling visibly; "you still have about 84%" on return | Innovation asks the owner to allow it because "honesty is the brand". It greets the most fragile learner with a smaller number. It is honest but badly timed | Monthly only, never on return, never daily. Return copy has no figure: "Most of it is still there" |
| "That's 6 weeks behind your lessons" (Games 6.4) | It breaks that report's own ban on "any message that makes a learner feel behind" | "Por and para: playing at week 31", with no comparison to lessons |
| "caught you 7 of 19", "Fix this: you wrote it on Tuesday" (Innov F2) | A dated record of your failures, in the voice of a trap. Innovation's own risk note says fingerprints can demoralise | Three traps at most, led by what stopped happening. Drop the date. "People often write this. What should it be?" |
| "Covered, not yet checked" on every can-do | 60 lines of not-yet, and 30 of them on day one for a placed learner | Show earned can-dos and the next one. Collapse "Skipped when you placed" |
| Locked game shelf in week 1 | Nine grey tiles say "you have not earned this" | Hide what is closed. Each game arrives as an offer when it opens |
| Required reading track (Vocab R2) | Reading is the part learners do for pleasure. Calling it required makes it homework | Reading in lessons is simply part of the lesson. The library is free choice with no target |
| Repeat drill, new grammar held back (Acq P6, upper H2) | Failing yields more of the same, and we just spent a report removing stalls | One repeat at most, from a different angle, always with something new in the day. Offer, never hold |
| 400 to 800 word essays | At 12 words a minute, 400 words is over 30 minutes of phone typing | 250 is the ceiling in lessons. Longer pieces are optional, and desktop is their natural home |
| Close screen growth | Misses, diff, ledger, an offer, a next-chapter line, "Practise these now". It is the app's best real estate and becomes a dashboard | One result line, one miss at most, one offer, and the hook last |
| Monthly stack | Ledger, yardstick, cold read, time capsule and milestones could all land on the 1st | One page. One thing to do on it |
| Coined names on screen | Rayos X, Mis trampas, Duelos, Pruebas, Gimnasio, Mapa, Puentes | Plain English outside games: "Why?", "Your traps". Spanish names for games only |

Two proposals fix a weight the app already has, and I would raise their priority: lessons that divide, and a re-entry path.

## 5. Where linguistic rigour becomes frustration

The reports' stance is right: judge the target, not the string. The risks are in the details.

| Change | Risk | Guardrail |
|---|---|---|
| Third verdict, "Same meaning?" | A beginner cannot judge. Asking at A1 hands them the app's own uncertainty | No compare step at A1 or A2. Accept sets, then a calm "We'd say". From B1, one tap, after the retry |
| Three reports grade "Mine says the same thing" differently: Good, Hard, exposure | An appeal that still counts against you teaches learners not to appeal, and muddies FSRS | Good when the target form aligned, otherwise Hard. Never Again, never a weak spot |
| Node checks on "Say something true" (Acq P12) | This is the one free moment in the day. Deterministic checks on free text will misfire: *No dudo que viene* is correct | It fails open. Only positive notes, and one specific nudge on a known pitfall. Never a retry |
| Writing lint (upper H5) | A false flag on a sentence you wrote about your own life stings more than a bank row. The tagger read *cena* as a verb | Ship only rules at 95% precision or better on a labelled set. Phrase them as "Worth a second look?" Never scored |
| Accent handling | The largest typing annoyance on a phone. The orthography strand and game rules could tighten it | An accent-only slip is right, with a note, unless it changes the word. No retry, no lapse, no weak spot. Applies in every mode |
| Forced-choice contrast items | Games found about 1 in 5 auto-gapped items is not decided by the sentence. *Tu hija ___ lindísima* takes both | Gate rule that the item alone decides. An item where both work accepts both and says why |
| Target hidden in the prompt | "Mucho he aprendido aquí" for a plain English cue. Rigour without a cue is a guessing game | Upper C3's "Using *tras*" cue on every targeted card |
| Longer explanations (Curr P5, upper) | Rules run 100 words at C1 and feel thin to a reviewer. On a phone, 200 words is a wall, and adults skip it | Hold the main rule card at about 120 words. Depth goes in a "More" layer and Look up. Usage notes belong in the reference, one tap away |
| Feedback that explains | A wrong diagnosis is worse than none. 19 of 50 hints misled | One line, on a miss only. Name a misconception only above a precision bar on a labelled battery. Otherwise "Close. We'd say…" |
| Grading recognition passes as Hard (Acq P7) | A right answer quietly adds load | Fix distractors. Do not downgrade right answers |
| Two production retrievals for opaque words (Acq P14) | Adds 30 s to each of 3 or 4 words a day | Only where a word's review history shows it needs it |
| Latency as a mastery signal | Speed on a phone measures thumbs, posture and buses | Log it. Keep it out of grading until real data exists |
| Tap creates a card (Vocab R9); "a tap counts against you" (Innov F9) | At A1, one word in three is unknown. Thirty taps would make 30 cards, and curiosity would be punished | A tap is free and creates nothing. A save creates a card, at most 3 a day |
| Spanish hooks from B1 (Vocab R10) | A cliffhanger you half understand is not a cliffhanger, and the hook is the best retention device | English through B1. Spanish from B2, with a tap for English |
| Story band specification (Vocab R6) | See section 10 | Apply it to the library |

## 6. What a real person would never find

I measured Home today: 1,328 px tall at 390 wide, with 787 px visible above the tabs. The story card starts at 1,093 px, more than 300 px below the fold, and "This week" takes 631 px. **The hook, which three reports call the best retention device, is off the first screen.** "Keeps tripping you" pushes it further. Saved words live under Story, and checks live under Progress. Weak spots has no tab.

| Feature | Where it was proposed to live | Would anyone find it? | How it should reach them |
|---|---|---|---|
| Rayos X in the reader | "A quiet Why?" on any sentence | Rarely | Reader's tap panel gains "Why this form?" After a miss on a card, "Why?" sits beside the answer |
| More like this, Try one | Third level of a panel | No | Keep it in Look up. Do not run a detour inside a lesson |
| Tú de marzo | Game end | Only regular players | Offer it at the first anniversary of a best |
| Challenge link | Game end | A few | Share text first. Link later |
| Course map | Progress | Maybe once | Appears at each part's end, on the "what's next" screen |
| Tutor brief | Export | No | Offered once, on the page where the app says it cannot train your ear |
| Time capsule | Progress | No | The app brings it: "This is what you wrote in March" |
| Writing portfolio | Under Progress | Rarely | Close of the first writing: "Saved. It's in You." |
| Backup | Settings | Too late | Quiet reminder at each stage finale |
| Lector paste | Reference | No | A destination at stage 5 |
| Word family, word partners | Look up | Yes, for those who look | Fine. It is a look-up feature |
| El Taller | Teach block and Reference | Yes if in Reference | Reference only, as coloured verb tables first |

The rule: **nothing the lesson needs lives in a tab, and nothing in a tab is needed by the lesson.** The path pushes features at the moment they matter. Tabs are for people who come looking.

## 7. Information architecture

**Five tabs.** A sixth does not fit. Today each tab is 78 px wide at 390 and "Progress" alone is about 58 px, so six tabs give 53 px at 320 and clip, and 60 px at 360 is too tight. So games, library, portfolio and benchmarks must fit into five, and the games report's move of Settings off the bar is right.

| Tab | Question it answers | Holds |
|---|---|---|
| **Today** | What do I do now? | Today's lesson or next part, the hook, one quiet line. Nothing else |
| **Read** | I want to read | Story (next chapter, all chapters at or below your level, the story so far), Library (short pieces, real texts from B2, known-percentage labels), Your words (saved words) |
| **Play** | I have five minutes, or I'm tired | El tinto, Save these (the Rescate game, replacing Quick review), Your traps with Train it, four games, Workouts (verbs, translate) |
| **Look up** | What does this mean? | Today's reference, plus tables, Why panels, word partners and families |
| **You** | How am I doing, and what is mine? | This month, What you can do, Course map, Your Spanish (writing, your phrases), Take a check, Settings and Backup behind a gear |

"Play" holds the calm workouts too, because two places for extra work is one too many. I prefer "Play" to "Practise" because on a low day, what you tap should sound like a choice. Games stay out of the path, the streak and Progress, as the games report says.

**Today must fit on one screen.**

```
Hernando still has no tinto, and Tomás still
hasn't opened Altamira's letter.

Today
New: saying who you are
About 20 minutes
[ Start ]
Short on time?

Lesson 4 of 10 in this part ›

Today's tinto is ready
```

The second green button goes, and the Practise card and "Keeps tripping you" move to Play. The week map folds behind the one-line progress row. After a lesson, Today shows the next part or "That's plenty for today", which is the best sentence in the app and should stay.

**"Short on time?"** starts the next natural slice of today's lesson, not a separate review sprint. It replaces both "Only five minutes?" and the Settings tier control, which contradicts the owner's rule and should go.

**Close.** One result line, "From last week, X of Y came back", at most one miss with "Why?", at most one offer, and the hook at the bottom, last. Offer order: a new tense taught today (60 seconds on it), then a finished chapter (read it straight through), then today's tinto, then nothing.

**Lesson shape.** Today there are 7 day types and about 20 block kinds, and the proposals add 6 more. The learner should see one rhythm: **Warm up, New, Practise, Read, Use.** Variety lives inside Practise and Use, which also answers the owner's note about monotony. Some days have no New, and a thread day's Practise is contrast work, so the five labels are the shape rather than five mandatory blocks.

**Words.** "Week" becomes "Part", since a unit is ten lessons (M1). Stage labels keep the syllabus reference: "Stage 2 (A2 syllabus)". Adults recognise A2, and curriculum's honesty point is met by saying syllabus.

**Navigation.** Hash routes, back closes the top layer, and deep links to reference entries (upper M5). Desktop keeps the same five, with writing as its natural home.

## 8. The first ten minutes

Today, measured on a played first session at simulated pace: an empty "Quick warm-up", then 24 cards on phrases, grammar at minute 6, **the chapter at minute 14 after 42 cards**, the personal sentence at minute 16. The welcome and the chapter are delightful. The twelve minutes between them are a quiz about "Hola".

As it should feel. Same content, new order:

| Time | What happens | What it should feel like |
|---|---|---|
| 0:00 | Welcome with the concrete promise. Goal: "So we can tune the examples to you." Any Spanish before? No sign-up | "This is for adults, and it respects my time" |
| 0:40 | No empty warm-up. A door in Bogotá. *Bogotá, domingo. Tomás está en la puerta del café de Rosa.* The first three lines of chapter 1, every word tappable | "I'm reading Spanish already, and something is happening" |
| 2:00 | The three phrases the next lines need: *Me llamo, Soy de, Mucho gusto*. Pick, then type, 9 cards | "I need these to find out what happens" |
| 5:00 | Back to the door. The rest of the chapter. Hernando wants his tinto. The parrot shouts. Three questions | Laughing at a parrot in a foreign language |
| 8:00 | "You just read a whole chapter in Spanish: 118 words." | Surprise and pride, 6 minutes earlier than today |
| 8:30 | Say something true: *Me llamo … Soy de …* with their own name and city, shown back as the first entry in Your Spanish | "That's me, in Spanish" |
| 10:00 | A natural stop. "I need to stop" here is a real ending, with the Altamira hook | Free to leave, and wanting to stay |

Then the second half: how *soy, eres, es* work, and a short Your Turn, closing at about 20 minutes. Chapter 1 is almost fully glossed (2 of 50 distinct words lack a note) and uses the same first items, so this reorder needs no new content. Keep a very short sounds card early, as lower noted, because day 1 currently asks for reading before the pronunciation lesson on day 3.

**Placed learners.** Five minutes of check at most, about 15 hand-built items with up to 4 typed. Innovation's extra 10-minute probe would ask for 15 minutes before any reward. Spread it instead: the first five lessons calibrate, with visible "Too easy" and "Too hard", and the map fills in as they play. Then "The story so far", then the chapter at their level.

## 9. The first thirty days

Today's facts for a perfect learner: 182 new items, warm-up growing from 0 to 20 cards, 5 chapters, 1 scene, 3 writing tasks. Between sessions 6 and 17 there is no chapter at all, which matches the journey report's "competent and samey". Scenes wait on the owed queue, so after session 10 the next one is on session 65.

**Serialise the story.** Chapters run in beats across the sessions that follow their day. `splitBeats` exists. An A1 chapter of 175 words at one chapter per 3.5 sessions is 50 words a day, a minute of reading and a question. Later sessions only get more legal, so the gate holds. When the last beat lands, offer "Read it straight through", which also supplies the re-read. **Every session then has story in it, with no new Spanish written.** The cost is a small burn for beat-end lines, because 219 hooks exist only at chapter ends. Keep a whole chapter on day 1. Pilot on parts 1 to 5, because a beat can be dull on its own.

**Stop gating scenes on owed words.** Gloss what is missing, as with chapters. Scenes are the best thing in the fortnight, and they should run at least every 8 to 10 sessions.

| Days | How it should feel | What carries it |
|---|---|---|
| 1 to 3 | "I can say real things" | A chapter on day 1, typed sentences about yourself, a sounds card |
| 4 to 7 | Promises kept | Day 5 says story and delivers story. First "You already know this": a light cognate lesson shows hundreds of Spanish words the learner owns. False friends begin as jokes, with *embarazada* the classic |
| 8 to 10 | First real exchange | El tinto opens. The first scene, Knocking on the glass, and the first honest can-do tick. Part 1 ends with a small named moment and the writing shown back |
| 11 to 16 | Variety, where it now goes flat | A story beat every day. First game, Uno u otro or Relámpago, offered when a contrast or tense lands. Second scene. Warm-up stays under 6 minutes |
| 17 to 21 | "I keep getting things wrong" meets help | First trap, stated plainly, with a real Train it: rule first, then 8 to 10 cards. Lessons divide if a day is short. First missed day handled kindly, no streak talk |
| 22 to 26 | "I can tell yesterday" | The past arrives. A first tiny letter from Vale that the learner answers, which is writing with a reason |
| 27 to 30 | Proof | First month page: read chapter 1 again and see the two times, then and now. The sentence you wrote on day 1 beside one you write today. One thing to work on |

**What should not happen in month one:** no benchmark, no number that falls, no locked shelf, no reminder that scolds. A calendar file with a chosen time is the only reminder a server-free PWA can honestly offer. Its text should be the story's hook.

**Returning.** After 7 or more days: "Welcome back. It's been three weeks." At most 10 minutes: 8 high-value cards, five lines of "Previously" in English, then the **next** beat of the story, not a re-read as my own lower report proposed. The pull is what happens next. The rest of the backlog reschedules inside the capped warm-up. Over 60 days, offer to go back a part. Never show a total.

## 10. What is compelling, and what threatens it

| Asset | Why it works | Threat from the audit | Defence |
|---|---|---|---|
| **One button** | The app decides. Adults arrive tired, and "Start" removes the choice | Offers, trap lists, shelves and tinto on Home | Section 7 |
| **The story's voice** | Hernando and Simón are why anyone returns | Vocab R6's cap of 30% dialogue at C1 and chapters of 1,200 to 2,000 words would rewrite 95 chapters. Curriculum says do not. **I side with curriculum.** The "Name: line" form is the voice, and it reads well on a phone. Put the prose specification on the library | Fix tics (R11) lightly. Keep the parrot's catchphrase with variation, since a running joke is affection |
| **Hooks on Close** | Serial fiction beats any streak | Close becoming a dashboard. Spanish hooks too early | Hook last. English through B1 |
| **A chapter on day 1** | "You just read a whole chapter" | Reorders that delay it. Comprehension scoring | Move it earlier |
| **Scenes** | Generous, intent-based, the most active thing in the app | Curriculum removes keywords from upper prompts. Node constraints. A regex without its keyword will reject natural answers | Remove keywords only when accept sets are widened. Keep them generous. Honest endings yes (H7) |
| **"From last week, X of Y came back"** | Reports memory, not attendance | Being crowded out | Keep it as the one number on Close |
| **Quiet tone** | "That's plenty for today. Your reviews need a rest to work." | Audit copy: "caught you", "behind", "stopped being able" | Voice check on all new copy |
| **A finite day** | The day ends. That is rare and adult | Uncapped games | Games are on a separate tab. Lessons per week is the kill metric, as the games report says |
| **Instant start, no account** | Seconds to the first card | A 15-minute diagnostic | Five minutes, then calibrate |
| **Session shell and resume** | "I need to stop" always worked | Long lessons with no slices | Extend it across days |
| **Reader notes** | *mijo*, *tintico*, phrase glosses, at their best | R1 is real, but fixing it should not remove phrase notes | Word first, then "in this phrase" |
| **Hand-written script cards and pitfalls** | "Almost everyone slips here at first" | Pressure to generate everything from `focus` | Generated pairs at most in drills. Teach blocks stay authored |
| **Heavy production** | Half the cards are typed | My own say-it card, if misused | Typed stays on new and at-risk cards, every fourth review and all drills |

One caution. A learner on the steady path at A1 already gets something rare. The weight of defects in the audit should not persuade anyone that A1 needs rebuilding.

## 11. Verdicts, proposal by proposal

### Report 03, acquisition

| Proposal | Verdict | Why |
|---|---|---|
| Target scoring, three verdicts, engine acceptance | **Keep, first** | The only proposal that returns minutes. No compare step at A1 or A2 |
| Teach contrasts in session | Keep | Light block, 4 min, replacing that day's read-and-pick |
| `focus` field | Keep | A focused gap takes about 15 s against 35 to 42. It is also a time saver |
| 40 to 80 contrast rows each | Change | Games' tiers: about 150 for the big five, about 30 for the rest |
| Feedback from analyser and pitfalls | Keep | One line, on a miss, gated on a precision battery |
| Misses return, repeat drills, error routing | Keep, capped | 3 cards a session, one repeat, evidence only |
| Per-format time | **Keep, first** | Nothing else can be tuned without it |
| Evidence weighting | Change | No free passes and better distractors, yes. Downgrading right answers, no |
| Grammar mastery estimate | Keep | Hidden until validated |
| 500,000-word library | Change | 300,000 in lessons, the library is free choice with no target |
| Sentence building | Change | A rung for multi-clause work only, as it replaces typing |
| Fix the sentence | Change | Simón dice in Play. In lessons from B2 only |
| Sprints | Change | Move to Play. A lesson-end offer, not a block |
| Latency-aware mastery | **Drop for now** | Log only. Phone speed is not skill |
| Transfer probes | Change | Reuse existing scenes and writing, sample about one a week, silent |
| Cognate fast path | Keep | Saves time and flatters the learner, in the right way |
| Meaningful transforms | Keep | Also needed for trust |
| Never a fully review day | Keep | |
| Reading counts for the streak | Keep | Read-only days are real days |
| Protect the re-reads | Change | Keep at A1 and A2. Above that, move to De corrido |
| One-word answers for choices | Keep | Cuts typing where it adds nothing |
| Node checks on free answers | Change | Fail open (section 5) |
| 10% node holdout | Drop for now | There is no population. Revisit with real users |

### Report 04, curriculum

| Proposal | Verdict | Why |
|---|---|---|
| Contrast engine | Keep | |
| Evidence for can-do ticks | Keep | Show earned ones only. A scene done plus "yes" can earn it |
| Stage labels | Change | Keep the syllabus reference |
| Consolidation weeks | Keep | They are the season finales. The six sessions replace rather than add to a benchmark sitting |
| 45 to 60 minute benchmark | Change | Lesson-sized parts across the week. No timed essay. Never a gate |
| Thread gates | Drop | They duplicate the finale |
| Node weight | Keep | Buys time and removes the boredom it describes |
| Review days as thread days | Keep | Replaces remix |
| Topic lessons at B2 and C1 | Keep | With parts that span days. Target 45 to 50 minutes |
| 300,000-word reading strand | Keep | The volume I would pick. Merge with La Gaceta |
| Long writing of 250 to 800 words | Change | 250 in lessons, longer by choice |
| Recycling quota and burn | Keep | No learner minutes |
| Three pattern tiers | **Keep, raise** | The largest structural saving at upper bands |
| Two early review days | Keep | Make them story-led |
| Word formation, orthography | Keep | Light blocks. Orthography must never tighten accent grading |
| Pull-forward moves | Keep | Each A1 addition names what it displaces, since those weeks are the densest |

### Report 04, vocabulary and reading

| Proposal | Verdict | Why |
|---|---|---|
| V1 reserved word time | Change | Reserve it, but at 4 to 5 carded items, not 6.8. Deliver by tiers, and count delivered words |
| V2 report delivered words | Keep | |
| V3 coverage target of 97 to 98% | Change | A goal for optional reading, not a course promise |
| V4 to V6 ranks, glosses, senses | Keep | No minutes. Bad glosses are trust damage |
| V7 governed prepositions | Keep | A strip on the card, not more cards |
| V8 collocations | Change | Reading and Look up, not 600 to 800 cards |
| V9 false friends | Keep | Fun, memorable and cheap |
| V10 to V14 families, tags, word strip, register | Keep | One line at most on the card. Vulgar pack is the owner's call |
| R1 gloss resolution | **Keep, first** | A third of taps are wrong. Nothing built on the reader works until this does |
| R2 required reading track | Change | 300,000 in lessons, more by choice |
| R3 placed reading | Keep | |
| R4 La Gaceta | Keep | Plain name in the UI: Library. One shelf with La repisa |
| R5 question gate | Keep | One typed answer per chapter from B2 |
| R6 band specification | Change | Library only |
| R7 lexemes in coverage | Change | Auto-gloss, **never wait**. At 82% real coverage, "wait" would stall upper chapters. Lower H7 stands |
| R8 lemma per token | Keep | |
| R9 tap to card | Change | Tap is free, save is a card |
| R10 sentence English | Keep | English hooks through B1 |
| R11 to R14 | Keep | Lightly. The parrot stays |

### Report 06, innovation

| Proposal | Verdict | Why |
|---|---|---|
| F0 foundations | Keep | F0.6 arms wait for users |
| F1 Rayos X | Change | After a miss and in the reader panel. Short. No Try one inside a lesson |
| F2 engine | Keep | |
| F2 fingerprint | Change | Copy, limit of three, precision bar |
| F3 contrast sets | Keep | |
| F4 Rebuild | Keep | Replaces re-read on review days. 3 lines to B1, more above. From B1 only |
| F5 El Caso | Keep | Replaces a review day. Pilot five, as it says. The best idea for B1 engagement |
| F6 Mapa | Change | 5 minutes on day 0, the rest during lessons. Map in You |
| F7 evidence, capsule, ledger | Keep | One monthly page. No falling number |
| F8 Gimnasio | Change | Merge with Relámpago |
| F9 reader | Change | Tap is free. Keep known percentage |
| F10 Puentes | Keep | A first-week delight |
| F11 El Taller | Change | Coloured verb tables in Look up first |
| F12 Escritura | Keep | Revise from B2. Combine as a drill rung |
| F13 Verbo del día | **Drop** | One daily is enough |
| F14 Lector | Keep, late | The destination at stage 5 |
| F15 Tutor brief | Keep | Cheap, honest about the app's limit |
| F16 word partners | Keep | Look up only |

### Report 06, games

| Proposal | Verdict | Why |
|---|---|---|
| Export and import | **Keep, first** | Agree, on all counts |
| Relámpago, Uno u otro, El tinto, De corrido | Keep | The launch four |
| Rescate | Keep | Replaces Quick review and gives the backlog a purpose |
| Simón dice | Keep, later | Owner's call on showing wrong Spanish |
| Ordena, La escalera | Later | Add only if the first four are played. Nine games is a catalogue |
| Remiendo | Change | Optional, from B1. Repairing 25 half-words on a phone is punishing at low levels |
| Anchored level | Keep | Without the "behind your lessons" line |
| Five tests, FSRS contract | Keep | The best discipline in the audit |
| Play replaces Settings | Keep | |
| Locked outlines | Drop | Section 4 |
| Band letters, seasons | **Keep, raise** | A test disguised as a gift. The model for assessment here |
| Monthly ledger | Keep | Three lines, no comparison to lessons |
| Tú de marzo | Keep | The one race you always gain on |
| Share string | Keep | |
| Challenge link | Later | Needs two people on the same stretch |
| Friends' tintos counted together | Drop | Adds a social debt with no server to back it |
| Personal words in FSRS | Keep | Capped at 3 a day |
| Essay revise loop | Keep | B2 and up |

### My own reports

| Proposal | Verdict | Why |
|---|---|---|
| Lessons that divide (lower H3) | **Keep, raise** | Now the enabling feature for all upper-band design |
| Re-entry (lower H2, upper C2) | Change | Shorter than I wrote, and it ends on the next beat, not a re-read |
| Soft reset of stability | Drop | Rescheduling with a capped warm-up is enough, and FSRS already models the gap |
| Placement rebuild | Keep | At most 4 typed items, and calibrate in lessons |
| Spoken rehearsal | **Promote** | The say-it card |
| Phrasebook | Keep | Learner's sentence beside our version, so errors are not rehearsed |
| Week in review | Drop | The month page and Close are enough |
| Daily mini-reading (lower M13) | Merge | Story beats do this |
| Connected-text gap fills | Keep | The main format for thread days |
| Vale correspondence | Keep | Reframe existing writing tasks. No added minutes |
| Real texts from B2 | Keep | Library, labelled with known percentage |

## 12. Recorded disagreements

1. **With acquisition, on "more typed sentences".** It treats typed production as the thing to protect. I say typed whole sentences as the default review format are why the course does not fit, and that say-it cards deliver more translation. Owner decision, and it needs testing.
2. **With vocabulary, on story form.** R6 would rewrite upper chapters to a prose specification. I side with curriculum.
3. **With vocabulary, on word intake.** V1 reserves time for all planned words. I say 4 to 5 carded items a day is what fits, and the rest are read. Owner decision.
4. **With vocabulary and innovation, on taps.** They count a tap against the learner or create a card. I say tapping must stay free.
5. **With vocabulary against my own lower report, on chapters that wait.** Resolved: auto-gloss, never wait.
6. **With curriculum, on the 45 to 60 minute benchmark, and with innovation on the falling number.** Owner decision on both.
7. **With innovation, on Mapa's length.** Five minutes, not fifteen.
8. **Reading volume: 300,000, 400,000 or 500,000.** I pick 300,000 in lessons. The evidence favours more input, and the disagreement is about whether it can be required.
9. **Within my own reports, on the grade for "Mine says the same thing".** Lower says Good, upper says Hard, innovation says exposure. My position is in section 5.
10. **With the games report against itself,** on feeling behind.
11. **With the review brief's own framing.** "2 to 3 times too fast" should read as true of reviews. Sessions are 1.05 to 1.3 times over at the mid scenario. The low scenario has A1 running under budget, so this needs real timing.
12. **With a phrase of the owner's.** The upper-band note says "depth in one sitting". I read that as one topic in one lesson, and propose parts that can span days. Owner decision.

## 13. Uncertainties

- **No human has been timed.** Every minute here comes from a model. Validation is cheap: the owner plays 10 sessions on a phone at A2, B1 and C1 and exports `ms`, once per-format logging exists. Seconds per typed sentence on a phone is the single most valuable number the project lacks.
- **Sessions are from a perfect driver at 9 s and 20 s a card.** Real error rates add load, and real speed changes what the compiler plans.
- **The FSRS simulation** uses one card, independent errors, FSRS as true memory, and a fixed false rejection rate. The real rate is unknown.
- **Ship-day numbers are designs, not simulations.** They assume review demand falls with intake tiers and false-lapse removal. Whether warm-ups of 15 to 20 cards hold without backlog must be simulated with honest timing before anyone commits. If it fails, the first fallback is fewer carded items.
- **The add-on ledger** uses my frequency and duration assumptions, shown in the table. Its order of magnitude matters, not its decimals.
- **No outside evidence was gathered.** The shared web search budget was exhausted when I tried, so I have no source links. Phone typing speed (about 36 words a minute for copy typing, Palin et al. 2019) informed my model from memory, and the covert retrieval citation is also from memory. Both need checking.
- **Not tested:** real phones, iOS keyboards, the say-it card, serial beats, or any proposed screen. Engagement judgements here are design judgement from reading and from scripted play, not observation of people.
- **Not read:** the linguistics and contrastive reports in full (I searched them for strictness and explanation proposals) and the architecture report beyond that search.
