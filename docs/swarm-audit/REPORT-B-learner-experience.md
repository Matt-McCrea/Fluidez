# Report B: Learner Experience and Functional Audit

Fluidez Spanish course audit, 1 November 2026. Written for the app's owner. App audited at commit `5f916ec`. Binding rulings are in `docs/swarm-audit/00-lead-rulings.md`, cited here as R1 to R32 and O1 to O12.

**None of this is live.** The live site is at `ee6aaec`, six commits behind `rebuild`. Waves 1 to 3 have never been deployed. Everything observed in this report was on the local dev server with real content (`?fixtures=0`). `publish.yml` runs no tests and no gate, so a push ships whatever typechecks.

That cuts both ways. Waves 1 to 3 fixed real faults the live site still has, and they also added some of the bugs below. Section 6 says which is which.

**Nothing here was tested on a real phone, in Safari, on a real learner, or with real timing.** The learners were scripts in headless Chromium.

Every item carries one of three marks.

| Mark | Meaning |
|---|---|
| **Observed** | A scripted learner met it on screen in the real app on the dev server. This is an observation of the software, not of a person |
| **Measured** | Run through the real code or counted over the real content, without being played on screen |
| **Modelled** | Rests on assumptions: simulated pace, simulated memory, or a judgement of how a person would react |

Under R32, every minute figure is modelled, even when its screen was observed. Every statement about what a learner would feel or do is modelled too.

## 1. The verdict in a page

A true beginner who does one lesson a day and never stops gets something rare: a story from day 1, half the cards typed, and good explicit teaching. Everyone else meets a failure at a join: entering the course, coming back to it, or being judged by it.

| Stage | Would they stay? (Modelled) | Why not |
|---|---|---|
| First open and day 1 | Yes | Instant, no account, a real chapter. The drag is 42 cards before that chapter |
| Days 2 to 4 | Yes, mildly | Busy, some monotony |
| Day 5 | Doubtful | Promised a story, got 10 new items, 35 typed cards and "Antes Perdón, era de Cali." |
| Days 6 to 10 | Yes | The story returns, and the first scene on day 10 is the best moment of the fortnight |
| Days 11 to 16 | Probably, from habit | No chapter after day 6, the same session shape, errors undiagnosed |
| Weeks 4 to 27, steady path | Unknown | Not played live on a steady path. The second scene arrives at session 65 |
| B1 and up, steady path | Doubtful | Warm-up crowds out the best parts, and false rejection rises with level |
| Placed at A2, sessions 1 to 4 | Yes | Real grammar, real challenge, though the story starts mid-plot |
| Placed at A2, sessions 5 to 20 | No | Sixteen sessions of "Catch-up mix" with nothing new |
| Strong learner told "We'll start at the beginning" | No | "Hola." at 95% accuracy, with no way to move |
| Placed at B1 to C1 | No | Wrong level, A1 chapters, valid answers refused |
| Back after three weeks | Barely | "1 of 61", no acknowledgement of the gap |
| Five minutes a day | No, by day 4 | The same seven items, and the bar never moves |
| After the last lesson | No | "You've finished the course. Reviews keep it all fresh." |

Four failures drive most of those answers.

**The checker marks right answers wrong and blames the learner.** Only 1.4% of bank rows have an accept list. Across purposive batteries, 5 of 91, 6 of 47 and 4 of 21 valid answers passed, each refusal with a stated reason, and the hint is often false. This punishes learners most for knowing more.

**Placement does not measure the level, and what follows it is worse.** A perfect score can send a learner to lesson 1. A stronger result can stop new content for weeks. The story then starts in the wrong place.

**Breaks are punished and short days go nowhere.** Nothing in the app knows a learner has been away, and five minutes a day never moves the course.

**The learner's record is fragile.** An interrupted lesson can lose its grammar point for good, one failed write stops all saving, and no backup exists. This failure stays invisible until it costs someone months.

Do not read the number of defects as a case against A1. A1 is roughly on budget (modelled), its teaching is sound, and the product review warns against rebuilding it.

## 2. How the app was driven

### The eight learner profiles

| Profile | Journey (port) | Setup | What was played |
|---|---|---|---|
| Complete beginner | `lower` (7101) | New learner, 90% right first try, ser for estar wherever possible | 16 consecutive days, one session a day |
| Some prior knowledge | `lowera2` (7111), `lowerp` (7113) | Placement by a knowledge curve; placement perfect, then with one miss | 20 placed sessions; the strong learner's result screen |
| Intermediate with grammar weaknesses | `mid` (7121), `desk` (7123) | Rated Intermediate, right on tense items, "I don't know" on mood | Placed at week 44: 3 lessons, reader, More practice, Translate, reload, back. `desk` placed at week 32 |
| Struggling with por/para or preterite/imperfect | `pp` (7122) | Steered to week 18 | 6 days of deliberate por/para swaps, weak spots, Train it. Preterite/imperfect by direct call to `weakSpots` and one live workout, not six days of play |
| Advanced seeking accuracy | `upper` (7102) | Rated Advanced, 21 of 21 right | Placed at week 60, all 10 lessons, course end, Look up, Progress, Settings, checkpoint |
| Returning learner who forgot | `lower` continued, `pp` | 65% right to model rust | Away 21 days, then 90 more, 4 sessions each. `pp` away 25 days |
| 5 to 10 minutes only | `lowerq` (7112) | Day 1 cut at 5 minutes | 8 days of "Only five minutes?". Nobody played a ten-minute pattern |
| Extended immersive session | `upper` | "Do another" repeated | 10 lessons in one sitting. The extended tier was read in code and simulated, not played |

Also driven: `lowerr` (every section before any lesson, every word of chapter 1 tapped) and `vr-reader` (placed at week 45, then the reader). Headless sessions through the app's own card builders ran at units 5, 8, 20, 34, 35, 45, 56 and 58, with 10,048 cards logged by the acquisition specialist.

**The drivers.** `tools/playtest/serve.mjs` was the browser, with a fake clock and fixed time per screen (9 s multiple choice, 20 s typed, 12 s retry). The lower driver was corrected so measured speed follows simulated time. The upper driver was not.

**Surfaces covered.** Welcome, goal, placement, Home, week map, every session block, reader, Story, Look up, Progress, Settings, Weak spots, Train it, Quick review, More practice, Translate, Take a check. Verb workout and Mixed drill were entered, not finished.

### Break tests (Observed)

| Test | Result |
|---|---|
| Correct, wrong and incomplete answers | One retry with a hint, then reveal. Sound design |
| Empty input | Check disabled, Enter does nothing |
| 7,200 characters | Handled. "You wrote:" prints it all |
| Triple tap on Continue | No crash |
| Reload mid-card | "Pick up where you left off", same card |
| Leave and resume, same day | Works |
| Leave and return next calendar day | Silently gone, even 230 steps in |
| English in a translate field | Treated as wrong, no "that's English" line. Scenes have one |
| Browser back | Leaves the app. `history.back()` went to about:blank from a card |
| Offline during onboarding | A B2 claim silently checks week 1 items, with no message |
| Keyboard at 1280 px | Everything reachable, Enter advances, no number keys |
| Secondary text contrast | 5.5 to 6.1:1. Passes |

### Desktop and mobile

Phone was the main surface, at 390 x 844 with touch. Shell measurements ran at 390, 360 and 320 px. `desk` ran at 1280 px: a 560 px column, with the session header wider than the card below it. On a phone, fonts were comfortable and tap targets are 48 px.

### Corrections applied

| Source claim | What this report uses | Why |
|---|---|---|
| Warm-up of 490 cards after 25 days (05 Upper C2) | Largely a bot-speed artefact. The real-pace evidence is 61 cards | The app measures pace, and a bot answers in about a second. The cap is still right |
| 47 cards on `pp` day 6, 51 on `mid` day 4 | Not relied on | Same uncorrected driver. My inference, not a reviewed finding |
| "2 to 3 times too fast" | True of reviews. Sessions run 1.05, 1.2 and 1.3 times over at A1, B1, C1 | Product cross-review, re-costed card by card |
| Tab bar mid-page on full-page screenshots | Capture artefact, not a bug | `serve.mjs` shoots with `fullPage: true` |
| Beginner read "three chapters, 446 words" in 16 days (05 Lower 2.1, M13) | Two chapters, 270 words | Found while drafting. The figure is from the withdrawn `run2`. The corrected run's Home reads "2 chapters read" through day 16 |

### Rulings that overrule the reports

| Report's position | Ruling |
|---|---|
| "I think mine is right" counts as correct (05 Lower C3); Good when the target aligned, no compare step at A2 (product cross-review) | R9: Hard, whole-sentence cards, A2 up, never when a named trap fired |
| Soft reset that scales stability on return (05 Lower H2) | R18: no soft reset. A compiler debt policy instead, simulated before it ships |
| A tap creates a card (04 R9) | R25: taps stay free. A save creates a card, at most three a day |
| Chapters wait for words; rewrite chapters to a prose specification (04 R7, R6) | R26: gloss instead, and neither |
| Downgrade recognition passes; latency-aware mastery (03 P7, P10) | R16, R17: recognition grades unchanged, latency never affects a grade |
| Reto semanal, Contrarreloj, Frase rota (05 Upper) | R23: Relámpago, Uno u otro, De corrido and Rescate first |
| `focus` burned over 20,000 rows (03 P3) | R12: computed. Only 37 blind nodes need authoring |
| Hint copy using "wish form" and "plain form" (03 P5) | R2: "subjunctive" and "the ordinary form" |

## 3. What works and must be preserved

| Keep | Evidence | Mark |
|---|---|---|
| No sign-up, instant start | First card is seconds away | Observed |
| A whole chapter on day 1 | "You just read a whole chapter in Spanish: 118 words." | Observed |
| The story and its close-screen hooks | "Hernando still has no tinto, and Tomás still hasn't opened Altamira's letter." Whether the humour lands on people is unknown | Observed |
| Scenes | "Knocking on the glass" on day 10. `checkTurn` passed every reasonable paraphrase tried in play and caught real errors ("To do this, use usted (es), not tú (eres).") | Observed |
| Hand-written script cards and pitfalls | "We're from Cali. / They're from Cali. / I'm from Cali." tests the actual point | Observed |
| Heavy typed production | 51% of cards typed in the beginner run, 55 to 61% across headless runs | Observed, Measured |
| One retry, then "You wrote: X, then Y" | Worked on every miss | Observed |
| The located hint | "Not yet. Por or para? Check that little word." (`pp/003-pp-wrong1.png`) | Observed |
| Coverage gating | 25 of 385 production cards used a word form never seen | Observed |
| The session shell | The ✕ dialog, "Stop after this part", resume at the exact card | Observed |
| Look up on verbs and two reference pages | *anduve, cupiera, quepa* handled well. The estar and por/para pages are real references | Observed |
| Take a check | "Week 1, Hello, this is me: 5 of 5." Clear and kind | Observed |
| The engine and the pure compiler | 162 of 162 hard forms right. A plan is plain JSON that can be replayed | Measured |

**The reader needs a caveat.** Both journey reports praise the glosses, and 05 Upper found nothing wrong on its sample. The vocabulary and linguistics reports measured about a third of taps as showing a note about a different sentence. These agree once you see that the journeys counted whether a note appeared, not whether it was about the tapped word. Keep phrase notes such as "mijo: son, lad (warm, from «mi hijo»)" and "salía from salir, to leave". Fix what selects them (F7).

**One praised line is dropped.** 05 Lower lists "The form is right. I can't judge the meaning" as honest copy. Acquisition showed it passes *Dudo que Vale viene mañana*, the lesson's own listed pitfall. It belongs in section 8.

## 4. What is confusing

| What the learner meets | Journey and screen | Why it confuses | Mark |
|---|---|---|---|
| "By the end of this week..." then "0 of 10 lessons" at one a day | `lower`, Welcome, Home | A week is ten sessions, and the learner can check | Observed |
| "A mix of things from the last few weeks." on day 5 | `lowerp/013-antes-reveal.png`, Remix | Time words are written into leads, not computed | Observed |
| "A few things from the last few days." after 21 days | `lower`, warm-up, `back21.txt` | Same cause | Observed |
| "Tomás has just landed in Bogotá. You'll read the first chapter soon." at week 20 | `lowera2`, Home | False for this learner | Observed |
| First chapter opens "Kilómetro doscientos. El bus subía otra montaña..." | `lowera2`, reader | No recap, and skipped chapters cannot be opened | Observed |
| Same lesson labelled "Nuestra esquina", then "Un tinto, por favor" | `pp`, Home, after a reload | The chapter chosen depends on what the tab loaded | Observed |
| "Try again" with the wrong answer still in the field | `lower`, day 1, steps 53 to 54 | It resubmits and spends the second attempt | Observed |
| "Start with the verb: soy…" when the answer starts with *Hola* | `lower`, typed cards | The hint came with wave 1's junk-input fix and misfires on fragments too ("tomás…", "para…") | Observed |
| "Almost. Check the spelling." for "¿Dónde es el baño?" | `lower`, 6 of 36 ser/estar slips | The word is spelled right. The verb is wrong | Observed |
| A hint naming ser and estar on day 4 | `lower`, day 4 | Estar is taught on day 13 | Observed |
| "Which word is doing the work here?": *hables / quiero / clientes*, answer quiero | Subjunctive lesson, `manual.txt` | The lesson's point is *hables*. A residue of earlier finding B2, fixed for "tomás" only | Observed |
| "Answer for yourself": "¿Eres tú, Tomás?", "¿Tomás salva La Esquina de Rosa?" | `lower`, Talk about you | A question to a character cannot be answered for yourself. Show me gives "Here's the right version: Soy …" | Observed |
| "Mucho ___. Soy Simón. (... (taste (sense)))" and "use soy (ser · Presente · yo)" | `lower`, day 2, Learn and Writing | Raw data on screen | Observed |
| "Week 1, Hello, this is me: 0 of 1" after a C1 sentence | `upper`, checkpoint | The sentence was chosen to carry a week 1 node | Observed |
| "How much each day" tiers, "About 20 to 30 minutes" | `lower`, Settings | Contradicts both Welcome and the rule that learners do not choose length | Observed |
| "The weeks before it count as known." | Placement result | The check did not test them | Observed |
| "Look up" opens "Reference"; "Remix"; "Story so far" over a quiz score | `lower`, tabs and blocks | Labels do not say what the thing is | Observed |

## 5. What is frustrating

| Frustration | Evidence | Mark |
|---|---|---|
| Correct Spanish refused | F3. The largest single source of frustration | Observed, Measured |
| The return wall | `lower` after 21 days: "1 of 61", 56 of 64 cards typed, 64% right, 23.5 minutes against "About 19 minutes left". Next session "1 of 53". Nothing new for two sessions | Observed |
| Repeats | Seven "Your turn" cards word for word on days 15 and 16. 6 to 19 repeated prompts a session at weeks 45 and 58. One sentence up to 6 times at week 20. "I went to the bank today." 5 times across headless runs | Observed, Measured |
| No way to say "I know this" | `upper`, week 60: *la creatividad*, options twenty-one, to turn on, creativity. About 135 taps before the chapter on one lesson. 371 of 850 C1 lexemes are near-identical to their gloss | Observed, Measured |
| Same-format runs | 7 cards on day 5, 9 on day 9 | Observed |
| A whole sentence typed for a one-word choice | 291 of 1,297 grammar your-turn items say so outright | Measured |
| Accent strictness | 34 of 16,582 accent-free sentences accepted. "Vale es de Medellin" fails on a place name. Hint "Check the accents." does not say where. R15 settles it: right with a note unless the accent changes the word | Measured |
| False time promises | Day 10 "About 20 minutes", 28.6 simulated. Home said "About 19", the session said "About 15" for the same state | Observed |
| No clean stop | Day 1, "Stop after this part" meant 7 more minutes. "I need to stop" appears only after 10 minutes | Observed |
| Work gone at midnight | `upper`: 230 steps in, next day a plain "Start" and no note | Observed |
| Train it ends in nothing | `lower`: "0 of 3 right first time. This was practice only. Your review schedule is unchanged." | Observed |
| Noise in Recent misses | One sentence four times, one row per node, showing the right sentence and not what you typed | Observed |
| Quick review oversold | "1 of 60" with a 5:00 clock. About 17 fit | Observed |
| More practice picker | A 10,678 px page on a phone (`mid/007-more-practice.png`) | Observed |

## 6. What is broken

Setup for browser reproductions, from `app/`:

```
npm run dev
node tools/playtest/serve.mjs <profile> 7103
curl -s -X POST localhost:7103 -d '[{"goto":"http://127.0.0.1:5173/?fixtures=0"},{"dump":"home"}]'
```

Delete `tools/playtest/.runs/profiles/<profile>` to start again, and move days with `{"clock":"..."}`. Screenshots are under `tools/playtest/.runs/shots/`.

Severity: **Critical** loses learner work, teaches wrong Spanish, or blocks a whole class of learner. **High** is a common path giving a false result or a dead end. **Medium** is wrong but recoverable.

### Critical

**F1. A perfect placement score sends the learner to lesson 1.** Observed; the table is measured through the real ladder.
Reproduce: new profile, Get started, any goal, Next, "Yes, some", then "A bit". Answer every item right.
Result: "We'll start at the beginning." (`lowerp/002-strong-placed-a2.png`). Settings offers only "Reset progress…".

| Rates themselves | All right | One miss in the last three |
|---|---|---|
| Beginner | week 14 | week 14 |
| A bit | **week 1** | **week 1** |
| Intermediate | **week 1** | **week 1** |
| Advanced | week 60 | week 60 |

Cause: two right moves up two levels, so each level gets two answers while a level above A1 needs three. When no level qualifies, `result()` returns 0. Rated Intermediate with misses, `mid` landed at week 44 and `desk` at week 32, so getting some wrong can beat getting all right. In a model, a true mid-B1 learner who says "A bit" lands at week 1 about 36% of the time.

**F2. Generated drills teach ungrammatical Spanish as "the right version".** Observed and measured.
Reproduce: play `lower` from zero to day 5. In Remix, card 1 of 12 reads `Say it was like this before: start with "Antes".` Type anything wrong.
Result: "Here's the right version: Antes Medellín no era Bogotá, Tomás." (`lowerp/013-antes-reveal.png`). The imperfect is taught in unit 6. Logged answers from the same generator include "Antes Perdón, era de Cali.", "Yo soy Ana y Pedro, de Cali." and "¿Se puedo pagar con tarjeta?". From the bank: "Ayer hay un cliente, Valió.", "¿Cómo se digo tinto en inglés?".
Scale: 1,132 of 15,077 first transforms in units 1 to 27 ask for an untaught tense. Cause: `transformsOf` (`ladder.ts`) has no tense licence at `cards.ts:376` and `:710`. Failing such a card leaves it in spaced repetition.

**F3. The checker refuses correct Spanish and gives a false reason.** Observed and measured.
Reproduce: Home, Keeps tripping you, Train it on "Where is…?". Card "Where's the bathroom, Vale?":
- Type `Vale, ¿dónde está el baño?`. Result: "Not yet. Right words, different order: check where each one goes." (`lower/121-alt-word-order.png`)
- Type `¿Dónde queda el baño, Vale?`. Result: `"queda" isn't the word here, check the meaning.` (`lower/122-alt-queda.png`)
- The next card's right version is "¿Dónde queda la estación?".

| Battery, purposive, not a rate | Passed |
|---|---|
| Acquisition, valid alternatives on real rows | 5 of 91 |
| 05 Upper, B1 to C1 | 6 of 47 |
| Architecture | 4 of 21 |
| Lead, real `matchTranslation` with no accept list | 2 of 10 |

The lead's run also passed *Ella le gusta el café* and *Yo me gusta el café*, so the checker fails in both directions. False reasons include `"tenemos" isn't the word here` for "We have to wait" and "Check the verb ending" for *hubiese*, the C1 form the course teaches. Each refusal is a full FSRS lapse (see section 12). Whole classes also fail:

| Valid form | Result | Mark |
|---|---|---|
| Digits for number words | 0 of 1,066 pass, and 1,065 show `"xnum" isn't the word here` | Measured |
| *A mí* or *a ti* before gustar | 0 of 271 | Measured |
| *beber* for *tomar*, *madre* for *mamá* | 0 of 24, 0 of 52 | Measured |
| Feminine answer: "Estoy enferma, Vale." for "I'm ill, Vale." | Refused on about 160 first-person rows | Measured |
| *Quieres* against model *quiere* on untagged English | Refused on 131 of 131 tested | Measured |
| The "(polite)" tag | Does nothing on 1,920 rows, so tú passes | Measured |

A woman typing correct Spanish about herself can be marked wrong. R13 and R15 govern the fix, and "Mine says the same thing" follows R9.

**F4. A placed learner can stop receiving anything new for weeks.** Observed.
Reproduce: `lowera2`, placed at week 20 or 21, one session a day at about 17 s a card and 80 to 90% right.
Result: sessions 5 to 20 are all "Catch-up mix", zero new word screens, and the bar stays at "4 of 10 lessons" (`lowera2/025-a2-home-day5.png`). First-try scores in the first week of it: 36/38, 37/42, 33/40. Close screens still say "Next time: a story." I stopped at session 20 and do not know when it ends.
Floor, a perfect learner over 28 sessions (Measured): placed at week 15, 7 sessions converted; week 28, 12; week 35, 10. At 15, 30 and 45 s a card, 76% of sessions at u20 and 90% at u45 go review-only (Modelled).
Cause: `compile.ts:285` and `:367`, seeded on a 10-second prior. R18's debt policy addresses it and has not been run.

**F5. An interrupted lesson permanently loses its grammar point.** Measured with `SessionRunner` on real content. Not walked in the browser.
Reproduce: compile u07 day 0, open the teach block for `g:hay-vs-esta`, abandon, compile the next day.
Result: `introduced true, has card false, never due in 40 days`. The teach block is gone from the next plan.
Expected in the UI: open a lesson, read the hook, close the tab, return after three hours or next day, or tap "Start over". The compiler then treats the node as known, so its sentences appear with the grammar untaught. Cause: `teach.tsx:81`, `runner.ts:536`.

**F6. One failed write ends saving and hangs the session.** Measured, reproduced by the lead.
Reproduce: run `Learner` over a store that throws once.
Result: later saves never run, `flush` and `commit` reject, `exposures in memory 3 on disk 0`. By code, the screen then stays on "Saving…" (`session.tsx:161`), which no journey saw. Cause: no catch on the chain at `learner.ts:185`.

**F7. A third of reader taps show the wrong note.** Observed and measured.
Reproduce: open chapter 1 ("Hola, Bogotá"). Tap *la* in *Tomás lleva una carta en la mano.*
Result: "en la puerta del café de Rosa: at the door of Rosa's café…". Tap *Vale*: "from valer, to be worth" (`lowerr/006-reader-gloss.png`).
Scale: 25,024 of 77,820 word tokens (32.2%) get a note from another sentence. *Tomás* gives "to take" (1,347 tokens), *Ana* gives "anus" (20 tokens, ch214). *del, al* and *hay* get no note. Cause: `gloss()` in `bundle.ts`, plus `looseLemma`.

**F8. The story forgets the learner after a fresh open, and placed learners read the wrong chapters.** Observed.
Reproduce: `upper`, read 4 chapters, reload.
Result: Story says "Your first chapter comes with your first lesson." (`upper/021-story-tab.png`), and Home says "Tomás has just landed in Bogotá."
Cause: `bundle.index.chapters` holds only the window, 2 units before and 3 after. At `path.unit` 30, the library holds u29 to u34 only.
Placed learners: week 60 got "Hola, Bogotá" (`upper`), week 45 got ch001 (`vr-reader`), `mid` got ch125 "Cinco tintos". In simulation, a learner placed at u45 reads ch001 to ch105 over 206 sessions, 0 at B2 or C1 (Modelled).

### High

| # | Fault | Reproduction | Mark |
|---|---|---|---|
| F9 | Placement crash at unit 2 | From `app/`: `npx vite-node tools/playtest/render.ts 2 7`. Day 2 throws `FSRSValidationError: Invalid delta_t "-1"` at `learner.ts:508`. Re-run for this report: same result. No journey placed at week 2 in a browser | Measured |
| F10 | Every contrast Train it is a dead end | `pp`, Home, See all, Train it on "por or para?". "Not yet... It comes up in week 165." (`pp/005-week-165.png`). The course has 60 weeks. 0 of 94 contrasts have bank rows | Observed |
| F11 | Train it trains the wrong thing | `pp`, Train it on por/para: `Atención, por favor: el bus a Medellín ___ por la puerta cuatro. (salir)`, with por already printed (`pp/002-train-pp.png`). "Preterite: a workout" opens with "Type the form (valer, tú, the past)" | Observed |
| F12 | Weak spots charge every node in a sentence | `pp`: "Preterite, missed 15 of 15" with its preterites right. Rests on the transcript and on code | Observed |
| F13 | Story day with no story | `lower`, day 5: Home "New words, in a story", week map "Story (today)", no reading. Day 4 close: "Next time: a story." 4 of 15 story days in 150 headless sessions | Observed |
| F14 | Writing passes junk | `upper`, week 60: 212 words of `Yo gato al tiempo que perro... the cat sat on the mat`. 3 of 4 ticks, "You can send it" (`upper/017-writing-gibberish.png`). `spanishShare` exists and writing does not use it | Observed |
| F15 | False scene verdict | `upper`, reply "no sé" five times: "They understood you. 0 of 5 replies landed first time, and you fixed the rest." Close then said "6 of 6 right first time" | Observed |
| F16 | Credit not earned | `upper`, one sitting: 60 can-do ticks, including an argumentative essay, with 76 of 181 right first time across nine captured close screens | Observed |
| F17 | Missing content fails silently and the path advances | Learner cached u16 to u21, offline, path moved to u22. Home shows "New: what or which", u22 d0 teaches with no script and advances. Only trace: `net::ERR_FAILED` in the console | Measured |
| F18 | Back leaves the app | On any card, browser back or `history.back()` | Observed |
| F19 | Raw asterisks in the personal prompt | Any Teach lesson: `...that starts with *Mucho* or *Poco*`. 898 of 916 scripts. `teach.tsx:288` | Observed |
| F20 | Chunk cards pair wrong lines | `mid`: "How do you say: I'm absolutely clear on that", answer "no voy a cambiar de opinión." `Lo tengo clarísimo.` refused (`mid/005-chunk-misalign.png`). Also "Perdimos el bus." on "What can you do?". 9 chunks affected, 21 more partial | Observed, Measured |
| F21 | Look-up search fails on standard names | `upper`, search *preterite*, *conditional*, *pluperfect*, *gerund*: "Nothing you have met matches that." *fuese*: Verbs (0). Breaks a standing decision | Observed |

### Medium

| # | Fault | Reproduction | Mark |
|---|---|---|---|
| F22 | Read-only card grades Good | `rv:p:te-presento-a:productive:bare` renders "Remember this one?". `ReadView` returns correct | Measured |
| F23 | Writing constraints blind to accents | "Me enteré", "para mí", "no sé", "Si Tomás hubiera" fail. 148 of 1,955 regex constraints affected. "Turistas" counts as tú | Measured |
| F24 | Scenes refuse natural replies | `checkTurn`: "Me alegra que estés aquí." on sc-u30-c, "Prohibido fumar." on sc-u27-c, "Vivo en la calle 11." on sc-u02-b and 11 more turns | Measured |
| F25 | Broken strings | "Here is the sentence said was like this before: start with "Antes"."; "...del todo.. Same sentence, new person."; `tu` for `tú` gives "There's an extra word: tu" | Observed |
| F26 | Newer or corrupt document strands the learner | Open a v3 state in a v2 build: `learner state v3 is newer than this build (v2)` with only "Try again". No error boundary | Measured |
| F27 | Two tabs overwrite each other | No `BroadcastChannel` or locks in `src`. Read from code, not run | Measured |

**Not bugs.** The tab bar mid-page on full-page screenshots is the capture. The 490-card screen was real, but a person would not see that number.

### Which build has what

From comparing `ee6aaec` with `5f916ec` for this report. Code comparison only, since nobody drove the live site.

| In the live code too | Only since the waves, so a push ships them |
|---|---|
| F5 interrupted lesson, F6 failed write, F7 reader taps, F8 Story tab and chapter window, F10 week 165, F20 chunk pairs, the transform generator behind F2 | F1 placement ladder (wave 2), `xnum` in F3 (wave 1), "Start with the verb" hint (wave 1), the five-minute loop (wave 3), the Weak spots screen (wave 3) |

## 7. What is incomplete

| Missing | Evidence | Mark |
|---|---|---|
| Backup and restore | No `Blob`, `createObjectURL` or `navigator.share` in `src`. R27 puts it before any game | Measured |
| Welcome back | No absence logic in `src/ui`. Home says "Catch-up mix" and the streak disappears silently | Observed |
| Next chapter and a library | Story lists only chapters read. No "next chapter". `upper` ended with 215 of 219 unread and no route to them | Observed |
| The story so far | None anywhere, for placed or returning learners | Observed |
| Change my level | Settings offers only "Reset progress…". No "this is too hard" | Observed |
| A post-course mode | After the last lesson, only "Catch-up mix" | Observed |
| Lessons that survive a break | `isResumable` needs the same day and under 3 hours | Measured |
| A unit ending | "10 of 10 lessons this week / Next time: something new." The bar resets. No moment, no check | Observed |
| Saved writing | `WritingMark` keeps `words`, `met`, `rubric`, never the text. Personal sentences are thrown away too | Measured |
| Upper writing brief | 242 B2 and C1 tasks ask for 100+ words under "A few sentences of your own." | Observed, Measured |
| Saved words as cards | A manual drill, 12 nodes, exposure only. R25 sets the design | Measured |
| Sentence English in the reader | `EN` control on 16 of 11,385 chapter sentences | Measured |
| Readings beyond the serial | All 219 readings are one story. The news text behind "follow a news story" is about 40 words | Measured |
| A course map | Home shows one unit. No view of where the course goes | Observed |
| Navigation history | No hash routes, no deep links. Android back in a PWA would exit (untested) | Observed |
| Desktop as a real surface | 560 px column, left rail above 900 px, no number keys, no writing view | Observed |
| Accessibility | A 400-word chapter is 400 tab stops. Component borders 1.42:1. Focus is not moved on block change. No `h1`. Body text ignores the browser's size setting | Measured |
| Reminders | None. A calendar file is the honest server-free option | Observed |
| Games | None. R23 sets four first, and only due-card, no-clock play touches FSRS | Measured |

## 8. What is educationally ineffective

The app is not a recognition toy. The worry is what gets retrieved: for grammar choices, the learner mostly retrieves a remembered sentence, and is rarely made to decide between two forms for a reason.

| Mechanism | Evidence | Why it fails | Mark |
|---|---|---|---|
| Contrasts never taught in a session | Script cards across all runs: grammar 1,115, pattern 182, contrast 0. 0 of 72,693 rows target a contrast. 800 read-and-pick and 671 your-turn items unseen | Ser/estar, por/para and preterite/imperfect are delivered as flashcards. These scripts have never been played, and `x:subj-present-past` states the reverse of the truth, so R5's rewrite must ship with them | Measured |
| The ladder collapses where it matters | Gaps possible on 6% of subjunctive rows. 30 grammar nodes have none, including `g:pret-vs-imperfect` and `g:si-hypothetical`. Recombine fired 0 times in 120 perfect sessions | The learner jumps from reading to translating two clauses. R10 sets formats by what decides the contrast | Measured |
| Labels promise other work | "First choose, then type, then change it around." At u45, 10% of "choose" items were choices. 84% of structured input fell back to random meaning questions (sample dependent) | "Read carefully: the small words matter" over cards passed by one known word | Measured |
| Gaps off target | At B1 and up, 13 to 27% of gaps test the node. `g:quantifiers` drilled on *hablar*, and the rung still climbs | The practised skill is not the named one | Measured |
| Feedback rarely explains | 101 of 123 multiple-choice misses only repeat the pair. Authored reasons on 6 to 11% of cards. Of 50 typical errors, 18 hints named the cause, 13 located it, 19 misled (one rater) | *Quiero que vienes* gets "when does it happen?". R14 sets when a hint may assert | Observed, Measured |
| A misconception stays invisible | `lower`: 36 ser/estar slips, and Home lists "How are you? Fine, and you?", "work / job", "Where is…?". 28 slips got "Is it what something is, or how it is right now?", which is wrong for location and contradicts the script | The commonest English-speaker error runs undiagnosed. R3 refuses that framing | Observed |
| Errors do not change the plan | `pp`: 31 of 36 por/para misses, next lessons unchanged. `noteLapse` returns unless the op is `review`. `hintKind` is thrown away. `withRemediate` runs only from the self-check and reading check | A learner who fails a drill gets the same next day as one who aced it | Observed, Measured |
| Choice cards need no Spanish | 63 of 74 name-bearing sentence cards are solved by the only option with that name. "(polite)" often appears only on the answer | 49% of beginner cards are multiple choice, and many are empty clicks | Observed |
| Comprehension checks do not check | Always picking the longest option scores 88 to 92% on first reads from B1. All 1,632 questions are multiple choice | A reader who reads nothing can pass | Measured |
| Free production unchecked | 13 of 14 erroneous answers passed. *Dudo que Vale viene mañana* gets "The form is right." | Removes noticing straight after teaching. Any fix must fail open | Measured |
| Placement tests little | 91% of upper-band items are tense or form, por/para 0.65%, ser/estar 0.1%. Non-words shown: "hasto los ocha", "Las leches están aquíes" | "Count as known" is not earned | Measured, Observed |
| Words not delivered | Default tier teaches 1,822 of 2,528 planned words, 19 of 380 at B2, 11 of 332 at C1. A C1 chapter is 82.4% known to the average learner against 97.3% in plan | B2 and C1 vocabulary mostly never arrives | Modelled |
| Little reading | 82,164 words in the course. Fluency work is close to zero. Language study takes 69 to 84% of session time. O4 is open | Without listening, reading is the only input | Measured, Modelled |
| Upper text is not upper | Mean sentence 5.1 words at A1, 8.5 at C1. Word rarity flat. R26 keeps chapters as they are, so the gain must come from elsewhere | C1 chapters are comfortable reading | Measured |
| Transfer never measured | No delayed task in a new context. "Learned" can mean three reviews and any unseen sentence. Can-do ticks reward attendance | Neither learner nor owner can tell if the goal is met | Measured |
| Dose against labels | 242 hours to the end of C1 against 700 to 800 Cambridge guided hours (English, rough). R24 replaces CEFR claims with stage labels | "C1" describes coverage, not ability | Measured |

## 9. Where the learner journey breaks

Calendar assumes one session a day, never missed: 593 sessions, 19.5 months (session counts from `content/units`, so the mapping is modelled). The simulator's ordinary learner takes about 26 months.

| When | What goes wrong | Located at | Mark |
|---|---|---|---|
| First open | Fast: 0.9 s, or 2.2 s at a 6x throttle. Offline, a B2 claim silently gets week 1 items | `placement.ts` | Measured, Observed |
| Placement, minutes 1 to 3 | One self-rating tap outweighs performance. F1 | `placement.ts` `ladder`, `result`, `itemsFor` | Observed |
| Session 1, minutes 0 to 14 | Empty warm-up, then 42 cards before the chapter. Grammar at minute 6 | Block order in `compile.ts` | Observed, Modelled |
| Day 1 | No short option. The five-minute link is hidden until reviews exist | `home.tsx` `data-five` | Observed |
| Day 2 on, short days | Warm-up and timed recall only. Streak grows, bar stays at 0 | `compile.ts` minimum path | Observed |
| Day 5 | The first broken promise and the first bad Spanish. F13, F2 | `compile.ts` `inputDay`, `ladder.ts` | Observed |
| Days 6 to 16 | No chapter after day 6. Warm-up grows from 0 to 5.5 minutes. Cards repeat | `chapterProblem`, session order | Observed |
| Day 10 | Best moment of the fortnight, then 8 minutes over | Single time estimate | Observed |
| Week 2 | Recurring error stays undiagnosed. Train it gives 3 cards and no rule | `weak.ts`, `hints.ts:26`, `wordhint.ts:17` | Observed |
| Any day | Interrupted lesson (F5), failed write (F6), past midnight loses the session | `teach.tsx:81`, `learner.ts:185`, `isResumable` | Measured, Observed |
| Any break over a week | "Quick warm-up", "1 of 61" | `home.tsx`, `blocks/practice.tsx`, `warmupStd` | Observed |
| From about week 4 | Earlier chapters leave the library on each fresh open. Seen at weeks 18 and 60; week 4 is inferred from the window | `loader.ts`, `story.tsx` | Observed, Modelled |
| Month 1 to 2 | One scene in 64 sessions: session 10, then 65. 39 of 120 sessions have any story | Owed-queue gating | Measured |
| Month 4.4, A2 begins (session 134) | Owed queue at 255 and rising. Warm-up 10.2 minutes against 7 by u20 | `fitToBudget` | Modelled |
| Month 5.4, por/para (u18) | Taught well on the day, then F10 to F12 | `freeplay.ts`, `weak.ts` | Observed |
| Month 6.4, subjunctive (u21) | 6% of rows can gap, hints point at time. R2's naming not yet applied | `ladder.ts:107`, `hints.ts:80` | Measured |
| Month 8.7, B1 (session 264) | The real squeeze: no long lesson, no spare time. Warm-up 12.9 against 8. New words, "Say something true" and recap cut on most days. Plateau risk | `runner.ts` `softBlock`, `outOfTimeFor` | Modelled |
| Month 12 | Each answer blocks the main thread 0.7 s on a mid-range proxy. Events over 365 days drop | `learner.ts:181`, `store.ts:81` | Measured |
| Month 13.3, B2 (session 404) | Most valid answers refused. Writing is a word count. Few B2 words delivered | `check/translate/*`, `blocks/writing.tsx` | Observed, Modelled |
| Month 16.6, C1 (session 504) | Session models at 40 minutes against 30. Warm-up 18 against 9. Coverage drops back to 82.4% | `budget.ts`, `compile.ts` | Modelled |
| Month 19.5, last lesson | "You've finished the course." Then review only. Each answer now costs about 1.3 s at two years | `home.tsx`, `compile.ts`, `learner.ts` | Observed, Measured |
| Any month | A lost phone or cleared site data ends the record. Safari eviction untested | `settings.tsx`, `app.tsx:46` | Measured |

## 10. What is compelling and what is unappealing

**Compelling** (all modelled as judgements, on observed screens):

- **One button.** The app decides, and adults arrive tired.
- **The story's voice and the hook on Close.** Serial fiction beats any streak.
- **A chapter on day 1,** and a parrot shouting "¡Altamira no!".
- **Scenes.** The most active thing in the product.
- **"From last week, X of Y came back."** It reports memory, not attendance.
- **A finite day.** "That's plenty for today. Your reviews need a rest to work." Rare, adult, and the best sentence in the app.
- **Colombian texture.** *Sumercé, tintico, a la orden, mijo*, with cultural notes.
- **The first real exchange at C1 level.** Week 58 drill sentences such as "The closer the date gets, the less I can sleep." are real challenge.

**Unappealing:**

- **The hook is off the first screen.** Home is 1,328 px tall at 390 wide, 787 px visible, and the story card starts at 1,093 px (Observed).
- **Twelve minutes of "Hola" between the welcome and the chapter.**
- **Every session is the same machine.** 37 to 77 cards of the same shape, over 19 months.
- **Counters as greetings.** "1 of 61", "1 of 60". "Words and phrases that have stuck: 0" for two months.
- **Reading styled like a prompt.** All Spanish bold and rust coloured, with a lone "?" orphaned on the next line at phone width (Observed).
- **Machine-made personal questions.** "Answer for yourself" is the most impersonal block in the app.
- **Praise that does not match.** F15 and F16. A demanding adult sees through it.
- **The upper levels feel like the lower ones.** A learner at week 60 gets the same shape with longer sentences, and a re-read of an A1 chapter: "Same story, a little faster."

R22 applies here: no falling number on return, no "behind your lessons".

## 11. Results by learner profile

### Complete beginner

`lower`, 16 days at about 18 simulated minutes, 50 to 60 cards. Well served. Scenes, typing and the teaching scripts all held up. The faults: day 5's broken promise and its "Antes" cards, two chapters and 270 words in 16 days, and 36 ser/estar slips with no diagnosis. Likely stays through the fortnight. Past that, untested in a browser.

### Some prior knowledge

`lowera2` placed at week 20 or 21 in two runs, from 20 to 23 items. Sessions 1 to 4 were good: real grammar at about the right level, though mid-plot with Home saying Tomás has just landed. Then F4: 16 sessions of "Catch-up mix". `lowerp`, the same kind of learner answering perfectly, was sent to lesson 1 (F1). Likely leaves.

### Intermediate with grammar weaknesses

`mid` rated Intermediate and said "I don't know" on both mood items. Placed at week 44, whose first lesson is concessive subjunctive, built on what they just said they lack. No item tested por/para, ser/estar or preterite/imperfect. "The weeks before it count as known." No "this is too hard", no way back except Reset. Their first chapter involved a character they had never met. Likely leaves.

### Struggling with por/para or preterite/imperfect

`pp`. The lesson and the located hint are good. Then the system sees the symptom and treats the wrong thing: weak spots reports 31 of 36 misses correctly, charges false misses elsewhere (F12), the por/para workout tests *salir* (F11), the contrast workout says "week 165" (F10), and the plan does not change. For preterite/imperfect, a learner who knows every form is sent to drill forms: "Type the form (valer, tú, the past)". The hint says "when does it happen?", and both tenses are past. This is the core intermediate case, and it is where faith goes.

### Advanced seeking accuracy

`upper`, 21 of 21, placed at week 60 on evidence no higher than recognising tenses. Day 1: 70 taps of phrases, then "Hola, Bogotá" and a re-read of it. Cognates drilled through rungs. Valid paraphrases refused: "Durante esta charla veremos tres casos." The prompt "I've learned a lot here." expects "Mucho he aprendido aquí." with no cue for fronting. One sitting later: course finished, 60 ticks, 59 weeks written off. The C1 sentence content is good. The grading wastes it. Leaves within a session.

### Returning learner who forgot

`lower` after 21 days: Home said "Catch-up mix, About 20 minutes", then "1 of 61", 23.5 simulated minutes, 64% right, then "1 of 53", with new content on session 3. After 90 more days: "Practice: writing it down" as if nothing had happened, "1 of 30", then "1 of 52", then new content with no reteaching. No welcome, no story recap. R18's debt policy and a capped return are the agreed design, not yet simulated. Barely stays at three weeks.

### 5 to 10 minutes only

`lowerq`. Day 1 asked to stop at 5 minutes and ran 12.5, because it could not stop until the teach block ended. Then 8 days of "Only five minutes?": about 2.7 minutes each, 7 typed cards from the same few items ("Hi, I'm Tomás."). Result: "9 days in a row." and "0 of 10 lessons". Settings admits it does not move you forward. Home does not. Never reaches the story. Quick review: "1 of 60" on a 5:00 clock. No ten-minute pattern was played. Leaves by day 4.

### Extended immersive session

`upper` did 10 lessons in a sitting, so supply is not the problem. Every "another" is the same machine: warm-up, new-word ladder, teach or drill, close. You cannot just read, though the reader is the most absorbing thing in the app. There is no "next chapter", and chapters come only inside a lesson, behind drilling. The extra-reading tier adds isolated bank sentences, not connected text (read in code). An hour of absorbing work is not on offer.

## 12. The arithmetic of a day

All of this is modelled (R32). Nobody has timed a person. Sessions come from a perfect driver, re-costed card by card: a whole typed sentence at 29 s at A1, 35 at B1, 42 at C1.

| Where | Budget | Cards | Typed sentences | Typed words | Mid estimate | Range | Warm-up | Warm-up budget |
|---|---|---|---|---|---|---|---|---|
| A1, sessions 17 to 60 | 20 | 49 | 20.5 | 118 | 20.0 | 15.8 to 24.3 | 6.9 | 7 |
| A1, sessions 61 to 120 | 20 | 51 | 21.1 | 132 | 22.0 | 17.4 to 26.8 | 8.2 | 7 |
| A2, unit 20 | 22 | 50 | 22.4 | 154 | 23.7 | 19.1 to 28.6 | 10.2 | 7 |
| B1, unit 35 | 25 | 56 | 26.1 | 202 | 30.6 | 24.5 to 37.1 | 12.9 | 8 |
| B2, unit 45 | 28 | 64 | 30.4 | 248 | 36.9 | 29.1 to 45.3 | 15.2 | 9 |
| C1, unit 58 | 30 | 67 | 33.5 | 309 | 39.9 | 31.1 to 49.6 | 17.9 | 9 |

So A1 is roughly honest. The overrun scales with typing: typed words rise 2.6 times from A1 to C1 while the budget rises 1.5 times. Nearly all of it is the warm-up, which "is never cut short".

**What gets cut.** When time runs out, `outOfTimeFor` stops new items first, which feeds the owed queue. Then `softBlock` drops `personal` ("Say something true"), `recap`, `sceneRerun`, `extraReading`, `leech` and the fluency re-read. At the mid estimate this happens on most days from B1 up. The 706 owed words, the stall and the skipped personal sentence are one event seen from different reports.

**The price of one item.** About 55 s to teach, then 7.6 reviews over 18 months, or 4.7 minutes at 30 s a review. The plan carries 3,676 carded items over 593 sessions, 6.2 a day. As planned, this is a 35 to 45 minute course sold as 20.

**What false rejection costs.** This is the only lever with negative minutes, so it pays for the others. The simulation applies one rate to every review, while the real rate is unknown.

| False rejection on recalled reviews | Reviews per card, 540 days |
|---|---|
| 0% | 7.6 |
| 5% | 9.1 |
| 10% | 11.3 |
| 20% | 23.0 |

**What the proposals add.** Kept as written, they turn sessions into 31 minutes at A1, 48 at B1 and 65 at C1, before any game. The whole course goes from 242 hours to about 470, 3.5 years for someone giving 25 minutes on 88% of days. R20 is the answer: five parts (warm up, new, practise, read, use), and every addition names what it replaces.

**What the simulator says about specific moves.** One seed, one profile, indicative only.

| Change | Result |
|---|---|
| Teach contrasts in full | Plans go from 21.2 to 28.0 minutes against 21.4. 100% of contrast days over. R21 moves `communicative` and freer `writing` off the day, recovering about 6 of the 6.6 minutes. Not yet run |
| Honest pace, 10 to 17 s | New items down 19%, owed up 33%, throttled sessions 23.7% to 49.7% |
| B2 and C1 at 45 and 52 minutes, placed at u45 | 285 to 389 new items, owed 117 to 0. Warm-up 14 as well: 476 new. R20 allows raising these early |
| "Mine says the same thing" at Good | Recall falls to 0.898 for a typical overclaimer, hence Hard under R9 |

**The trap in the proposed fix.** The product review's ship days fit at A1 (39 cards, 20 minutes) and B1 (43 cards, 25 minutes), but the B1 warm-up leans on 8 say-it cards at about 13 s each. That is O3, not built, and acquisition objects to any self-grade earning Good. Without it, B1 does not fit as drawn. If honest timing says 27 minutes, set 27 and say so on Home.

The honest long-run budget is about 105 to 135 hours a year for someone giving 20 to 25 minutes on 88% of days.

## 13. What this audit could not establish

**Never tested:**

- **Real learners.** Not one. Every "would stay" here is a judgement about a script.
- **Real timing.** Seconds per typed sentence on a phone is the most valuable number the project lacks.
- **Real phones.** The 6x throttle is a proxy. iOS keyboards, Android Chrome and real flash storage are unmeasured.
- **Safari.** Storage eviction and `persist()` are from general knowledge.
- **The live site.** Nobody drove it. Section 6's build table is a code comparison.
- **Installed PWA.** Install, update flow, home-screen behaviour.
- **Screen readers.** Assessed from code only.

**Not played in a browser:**

- Any steady-path unit past week 3. Live play covered weeks 1 to 3, 18, 20 to 21, 32, 44, 45 and 60 only.
- The extended tier, the "Keep going" offer, a ten-minute daily pattern, Reset progress.
- Verb workout and Mixed drill to completion, Translate by unit, Practise saved words, timed scene rerun.
- F5 and F6 end to end on screen, and F9 through the UI.

**Unknown even with the evidence:**

- **The real false-rejection rate.** The batteries were written to probe capacity and are not a sample of learner answers. The scale of F3's cost rests on that unknown.
- **How long the placed stall lasts.** Stopped at session 20.
- **Whether anyone learns.** The simulator takes retention as an input, and FSRS predicts flashcard recall, not language ability.
- **Whether the story, the humour or the hooks work on people.** Only about 28 chapters were read by a specialist, and the rest measured.
- **The `pp` attribution in full.** The persona used "no sé" where its oracle had no answer, so some non-target misses are real. Whether a "tricky ones" block appeared is unconfirmed.
- **Placement percentages.** They come from a model of knowledge by unit, and only the all-right and one-miss results are exact.
- **Whether real learners exist yet.** Every safety finding assumes they might.

**Designs in this report that nobody has run:** R18's debt policy, R21's contrast day, R1's subjunctive test on a learner, the say-it card, lessons that divide, and every "ship day" budget.

**Where the app stands.** Content files are being edited in the working tree while this was written. Findings describe commit `5f916ec`. `app/src` had no uncommitted changes, and I re-ran F9 on it. I also checked F1, F2, F3, F10 and F14 against their screenshots, and the beginner, return, placed and five-minute journeys against the raw transcripts. Other figures are taken from the specialist reports as recorded.
