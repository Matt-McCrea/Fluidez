# 05. Product and learner experience: lower-level journeys

Specialist: Product and Learner Experience, lower-level journeys. Audit date 2026-11-01. Target: the rebuild in `app/`, real content (`?fixtures=0`), phone viewport (390 x 844), driven in a real headless Chromium.

Short version: the app is well built and pleasant, and the teaching scripts, the scenes and the story are worth keeping. But the systems around them fail a real learner at every transition: entering the course, returning to it, and being judged by it. A perfect placement score sends you to lesson 1. A placed learner can stop getting anything new for weeks. The checker rejects correct Spanish and blames you. The generated drills teach ungrammatical Spanish as "the right version". All of these failures are on the paths real users take, and most fixes are small.

Severity counts: 4 critical, 9 high, 14 medium, 6 low.

---

## 1. What was investigated

**Played in the real app, with real content:**

| Learner | Profile / port | What was played |
|---|---|---|
| Complete beginner | `lower` / 7101 | Onboarding, 16 consecutive days, one session a day, 90% right on first try, with one deliberate recurring error (ser for estar) in every typed answer where it could occur |
| Returning learner | same profile | Stayed away 21 days, 4 sessions; stayed away another 90 days, 4 sessions. 65% right on first try, to model rust |
| Prior knowledge, about A2 | `lowera2` / 7111 | Placement answered with a probability curve by unit (see section 7), then 20 placed sessions |
| Strong learner | `lowerp` / 7113 | Placement answered perfectly, and with one miss |
| Only five minutes | `lowerq` / 7112 | Day 1 cut at 5 minutes, then 8 days of "Only five minutes?" |
| Day zero and reader | `lowerr` / 7113 | Every section before any lesson; every word of chapter 1 tapped |

**Also tested:** correct, wrong and incomplete answers; alternative valid answers (in the real UI, and in bulk through the real `sentenceCheck` and `checkTurn`); the ser/estar error over 16 sessions; leaving mid-session, resuming, "I need to stop", "Stop after this part"; Home, Story, Look up, Progress, Settings, Weak spots, Train it, Mixed drill entry, Quick review, More practice, Translate, Verb workout entry, Take a check.

**How the learners were driven.** `tools/playtest/serve.mjs` was the browser. A small external driver (scratchpad, `journeys/tools/lib.mjs`) read the live Preact tree for each card's real answer, chose an action by policy, and advanced the fake clock by a realistic amount per screen (9 s multiple choice, 20 s typed, 12 s a retry, text length for reading). It also logged every card. Nothing in `app/` was changed.

**Raw transcripts** are in the scratchpad at `/private/tmp/claude-501/-Users-Matthew-Fluidez/40ef6734-a9c2-4284-b528-c9cc038164e6/scratchpad/journeys/` (`beginner.jsonl`, `beginner-homes.txt`, `a2.jsonl`, `a2-homes.txt`, `a2-probe2.txt`, `back.jsonl`, `back21.txt`, `back90.txt`, `quick.jsonl`, `quick.txt`, `manual.txt`, `train.txt`, `weak.txt`, `reader.txt`, `check.txt`, `walk-a1.jsonl`). Screenshots are in `app/tools/playtest/.runs/shots/<profile>/`.

**One correction to my own data.** My first runs (`journeys/run2/`) answered in milliseconds of real time, and the app measures card speed from `performance.now`, so the compiler thought the learner could do a card in about a second. That inflated warm-ups (a "1 of 78" return session). I fixed the driver so measured speed follows simulated time, reran everything, and every session number below comes from the corrected run. Card text quoted from `run2/` is still valid, because content did not depend on the timing.

---

## 2. Evidence from the actual application

### 2.1 Complete beginner, 16 days (corrected run)

| Day | Min | MCQ | Typed | New items | Warm-up min | Blocks |
|---|---|---|---|---|---|---|
| 1 | 17.0 | 31 | 17 | 7 | 0.1 | warmup learn teach read personal recap |
| 2 | 19.8 | 29 | 17 | 6 | 0.1 | warmup ruleRecall structuredInput controlledOutput communicative writing learn recap |
| 3 | 17.6 | 32 | 22 | 8 | 1.0 | warmup learn teach personal recap |
| 4 | 16.4 | 28 | 31 | 9 | 1.2 | warmup ruleRecall structuredInput controlledOutput teach learn recap |
| 5 | 16.4 | 22 | 35 | 10 | 1.4 | warmup learn cuedProduction remix |
| 6 | 16.7 | 29 | 18 | 3 | 3.2 | warmup learn teach read personal |
| 7 | 17.9 | 23 | 34 | 5 | 3.6 | warmup ruleRecall structuredInput controlledOutput communicative learn recap |
| 8 | 17.7 | 26 | 25 | 4 | 4.7 | warmup learn teach personal recap |
| 9 | 17.1 | 31 | 32 | 6 | 4.5 | warmup ruleRecall structuredInput controlledOutput communicative learn recap |
| 10 | 28.6 | 18 | 29 | 11 | 5.2 | warmup learn scene writing recap |
| 11 | 16.8 | 20 | 28 | 3 | 5.3 | warmup learn teach personal recap |
| 12 | 16.6 | 26 | 33 | 6 | 4.5 | warmup ruleRecall structuredInput teach controlledOutput teach learn recap |
| 13 | 19.8 | 22 | 30 | 6 | 4.5 | warmup learn teach personal |
| 14 | 17.5 | 32 | 29 | 5 | 5.5 | warmup ruleRecall structuredInput controlledOutput teach learn recap |
| 15 | 19.5 | 25 | 28 | 5 | 3.9 | warmup learn teach personal recap |
| 16 | 16.7 | 27 | 32 | 6 | 4.2 | warmup ruleRecall structuredInput teach controlledOutput teach learn recap |

Minutes are simulated at the rates in section 1, so they are estimates. The new-item column counts "New" screens. Sessions average about 18 minutes and 50 to 60 answered cards, roughly one card every 20 seconds.

Whole-run card mix: 421 multiple choice, 187 typed English to Spanish, 79 typed Spanish to English, 174 other typed (gaps, transforms, personal answers). That is 51% typed, which is strong for a beginner app. In 16 days the beginner read three chapters: 446 words.

### 2.2 Prior knowledge, about A2

Two runs of the check placed the same simulated learner at week 21 and week 20 (`a2-probe.txt`, `a2-probe2.txt`), both from 20 to 23 items.

| Session | Min | MCQ | Typed | New word screens | Home label |
|---|---|---|---|---|---|
| 1 | 18.9 | 27 | 18 | 6 | New: guessing out loud |
| 2 | 24.0 | 17 | 30 | 3 | Practice: guessing out loud |
| 3 | 20.7 | 23 | 27 | 0 | New: promises, predictions |
| 4 | 25.3 | 19 | 37 | 0 | Practice: promises, predictions |
| 5 | 16.0 | 13 | 30 | 0 | Catch-up mix |
| 6 | 18.1 | 10 | 37 | 0 | Catch-up mix |
| 7 | 16.8 | 14 | 30 | 0 | Catch-up mix |
| 8 | 17.1 | 15 | 31 | 0 | Catch-up mix |
| 9 | 19.4 | 8 | 39 | 0 | Catch-up mix |
| 10 | 19.9 | 10 | 32 | 0 | Catch-up mix |
| 11 | 16.4 | 13 | 31 | 0 | Catch-up mix |
| 12 to 20 | 12.6 to 15.2 each | 7 to 13 | 22 to 29 | 0 | Catch-up mix, every day |

The week bar stayed at "4 of 10 lessons" from session 4 until I stopped at session 20. See finding C4.

### 2.3 Returning learner

| Return | Home said | First warm-up | Session min | Card mix |
|---|---|---|---|---|
| 21 days, session 1 | Catch-up mix, About 20 minutes | 1 of 61 | 23.5 | 8 MCQ, 56 typed |
| session 2 | Catch-up mix | 1 of 53 | 17.1 | 29 MCQ, 31 typed |
| session 3 | New: asking questions | 1 of 27 | 20.3 | first new content |
| session 4 | Practice: asking questions | 1 of 7 | 17.3 | normal |
| 90 more days, session 1 | Practice: writing it down, About 17 minutes | 1 of 30 | 19.9 | 5 MCQ, 28 typed, writing |
| session 2 | Catch-up mix | 1 of 52 | 20.8 | 7 MCQ, 49 typed |
| session 3 | New: saying what you like | 1 of 22 | 20.1 | new content |
| session 4 | Practice | 1 of 11 | 18.1 | normal |

### 2.4 Five-minute learner

| Day | Min | Cards | What it was |
|---|---|---|---|
| 1 (asked to stop at 5 min) | 12.5 | 18 after asking | Could not stop until the teach block ended |
| 2, 3, 4, 7, 8, 9 | 2.7 | 7 typed | Warm-up plus timed recall on the same few items |
| 5 | 0.8 | 5 MCQ | Warm-up only |
| 6 | 2.2 | 6 typed | Warm-up only |

After nine days: "9 days in a row." and "0 of 10 lessons".

### 2.5 Would I open this tomorrow?

| Stage | Answer | Why |
|---|---|---|
| Welcome, day 1 | Yes | Instant, no account, the parrot, a real chapter on day 1 |
| Days 2 to 4 | Yes, mildly | Busy, some monotony, pleasant sense of output |
| Day 5 | Doubtful | Promised a story, got 10 new items and 35 typed cards, including "Antes Perdón, era de Cali." |
| Days 6 to 9 | Yes | The story returns; warm-up is growing but fair |
| Day 10 | Yes | The first scene is the best moment of the fortnight, then the session runs 8 minutes long |
| Days 11 to 16 | Probably, out of habit | Competent and samey; recurring errors go undiagnosed |
| Placed A2, sessions 1 to 4 | Yes | Real grammar, real challenge, but dropped into a story mid-plot |
| Placed A2, sessions 5 to 20 | No | Sixteen days of the same mix with nothing new |
| Back after 21 days | Barely | "1 of 61". No acknowledgement I have been away |
| Only five minutes | No, by day 4 | The same seven items, and the bar never moves |

---

## 3. Specific problems discovered

### CRITICAL

#### C1. A perfect placement score sends you to lesson 1

- **Locus:** `app/src/ui/session/placement.ts`, `ladder()`, `next()` overtime rule and `result()`.
- **Evidence, in the real browser (`lowerp`):** chose "Yes, some", then "A bit", answered all 23 items right. Screen: **"We'll start at the beginning. The first lessons go quickly if some of it is familiar, and anything you already know won't come back often."** Screenshot: `.runs/shots/lowerp/002-strong-placed-a2.png`. Run through the real ladder:

| Says they are | All right | One miss in the last three items |
|---|---|---|
| Beginner | week 14 | week 14 |
| A bit | **week 1** | **week 1** |
| Intermediate | **week 1** | **week 1** |
| Advanced | week 60, the last unit | week 60 |

- **Mechanism:** two right moves the ladder up two levels. Every level therefore gets exactly two answers, but a level above A1 needs three to count as passed. When no level qualifies, `result()` returns 0. The overtime rule moves on before the third answer arrives.
- **Scale:** a simulated learner who really is mid-B1, answering 95% right on what they know, is placed at week 1 about 36% of the time after saying "A bit" (600 runs, `probe-sim2.out`).
- **Learner consequence:** the strongest users, doing everything right, get the worst outcome. They sit through "Hola." at 95% accuracy and leave. The copy tells them this was the right call. They cannot fix it: Settings only offers "Reset progress…".
- **Fix:** when no level qualifies, return the highest level reached with an unbroken record, never 0. Better, finish on a confirmation pass: after the climb stops, ask three more items at the provisional level and one level below. Add a test that all-right on any start cannot place below the last level visited.

#### C2. Generated drills teach broken Spanish and untaught tenses, and call it "the right version"

- **Locus:** `app/src/exercises/ladder.ts` `transformsOf` (lines 229 to 245), called with no tense licensing at `app/src/ui/session/cards.ts:376` and `:710`. Distractors go through `licensedTenses`; transforms do not.
- **Evidence, real screens.** Screenshot `.runs/shots/lowerp/013-antes-reveal.png`, day 5 of a complete beginner:

  > Remix. A mix of things from the last few weeks.
  > Say it was like this before: start with "Antes".
  > Medellín no es Bogotá, Tomás.
  > Here's the right version: Antes Medellín no era Bogotá, Tomás.

  The imperfect is first taught in unit 6. From the beginner's log (`beginner.jsonl`, days 4 and 5):

  | Card | Expected answer the app shows |
  |---|---|
  | Perdón, soy de Cali. (Antes) | **Antes Perdón, era de Cali.** |
  | Sí, somos de Ottawa. (Antes) | Antes sí, éramos de Ottawa. |
  | Ellos son Ana y Pedro, de Cali. (yo) | **Yo soy Ana y Pedro, de Cali.** |
  | ¿Eres tú, Tomás? (yo) | ¿Soy yo, Tomás? |

  From the placed A2 log (`run2/a2.jsonl`, day 2 warm-up):

  | Card | Expected answer the app shows |
  |---|---|
  | ¿Se puede pagar con tarjeta? (yo) | **¿Se puedo pagar con tarjeta?** |
  | Llévatelo, es tuyo. (Antes) | **Antes llévatelo, era tuyo.** |

  From the bank, by generator (`transforms-samples.json`):

  | Source | Generated answer |
  |---|---|
  | u01-0553 Hay un cliente, Vale. | **Ayer hay un cliente, Valió.** |
  | u01-0930 Claro. Listo, Vale. | **Ayer Claro. Listo, Valió.** |
  | u01-0506 ¿Cómo se dice tinto en inglés? | **¿Cómo se digo tinto en inglés?** |
  | u01-t-sounds-letters-0001 Me llamo Guillermo. | Ayer me llamé Guillermo. |
  | u18-0124 Dime cómo se llama el hostal. | Ayer dime cómo se llamó el hostal. |
  | u22-0757 Ustedes se conocen muy bien, ¿verdad? | Yo se conozco muy bien, ¿verdad? |

- **Measured:** of 15,077 sentences in units 1 to 27 with a transform, the first transform (the one the cards use) asks for a tense not yet taught at that unit in 1,132 cases. About 142 glue a time word onto a greeting, interjection or second sentence, about 48 force a *se* construction into first person, and up to 101 put a time word in front of a command or demonstrative. The last figure comes from a loose regex that also caught fine sentences such as "Antes este señor era don Hernando", so treat it as an upper bound. The beginner met 12 tense transforms in 16 days, 5 of them on day 5. The perfect headless learner met 27 "Antes" and 11 "Ayer" cards in 150 sessions.
- **Learner consequence:** this is the worst possible failure for a course whose goal is accurate production. A beginner on day 5 is asked for a tense that does not exist for them. If they fail, they are shown ungrammatical Spanish as the model, and a spaced repetition system will bring it back. It breaks the owner's "natural Spanish beats checker legality" rule. A learner with any knowledge will see "¿Cómo se digo" and stop trusting every other answer in the app.
- **Fix, in order:**
  1. Pass `taught` to transforms and drop any tense or person outside it. One line in each of two call sites, plus the filter.
  2. Refuse transforms on impersonal or passive *se*, imperatives, vocatives, greetings, multi-sentence rows, questions with *se*, and sentences whose subject is plural names.
  3. Treat `Vale` as a name in `parseClause`. It is the protagonist's name, and it also appears in the reader as "from valer, to be worth" (M8).
  4. Better: stop deriving transforms from arbitrary bank sentences. Mark sentences as `transformable` at build time through the content gate, with a model drafting and a linter checking, and hand-accept the output. A bank of 72,000 sentences can afford a strict whitelist.

#### C3. The checker rejects correct Spanish and tells the learner they are wrong about the word

- **Locus:** `app/src/check/translate/` (matcher, `hints.ts`, `canon.ts:94`); only 1,014 of 72,693 sentences have an `accept` list. `weak.ts` already admits it in a comment: sentence-level questions "are often marked wrong for synonym or phrasing reasons".
- **Evidence in the real UI, in one three-card "Where is…?" workout** (`train.txt`, screenshots `.runs/shots/lower/121-alt-word-order.png`, `122-alt-queda.png`):

  | Card | What I typed | App said |
  |---|---|---|
  | Where's the bathroom, Vale? | Vale, ¿dónde está el baño? | "Not yet. Right words, different order: check where each one goes." |
  | Where's the bathroom, Vale? | ¿Dónde queda el baño, Vale? | "'queda' isn't the word here, check the meaning." |
  | Where's the station? | (a wrong answer, to see the reveal) | "Here's the right version: ¿Dónde **queda** la estación?" |

  The same drill rejects *queda* on one card and requires it on another. The bank entry for the station (u01-1080) also rejects *¿Dónde está la estación?*, the exact pattern the workout is named after.
- **Evidence from the real checker on real bank rows** (`check-battery.ts`):

  | Bank row | Valid answer typed | App said |
  |---|---|---|
  | u01-0569 Tengo que irme. | Me tengo que ir. | There's an extra word: "me". |
  | u01-0562 Hay que pagar primero. (You have to pay first.) | Tienes que pagar primero. | "tienes" isn't the word here, check the meaning. |
  | u01-0562 | Primero hay que pagar. | Right words, different order |
  | u01-0145 Medellín es una ciudad de Colombia. (…a city in Colombia) | Medellín es una ciudad en Colombia. | "en" isn't the word here, check the meaning. |
  | u01-0495 No entiendo. | No comprendo. | "comprendo" isn't the word here |
  | u11-0466 ¿Cuánto cuesta? | ¿Cuánto vale? / ¿Cuánto es? | isn't the word here |
  | u03-0093 ¿Te gusta ayudar en el café? | ¿A ti te gusta ayudar en el café? | There's an extra word: "a". |
  | u02-0093 Vale está en el café desde las seis. (has been) | Vale ha estado en el café desde las seis. | There's an extra word: "ha". |
  | u01-0216 Unas estudiantes compran pan… (Some students…) | Unos estudiantes están comprando pan… | **Check the article: estudiantes is feminine.** (false; the English has no gender) |
  | u01-0402 La señora compra cinco panes. | La señora compra 5 panes. | **"xnum" isn't the word here, check the meaning.** |

- **Measured across real bank sentences (non-dialogue) through the real `sentenceCheck`:**

  | Valid rephrasing | Tried | Accepted |
  |---|---|---|
  | Digits for a number word | 1,066 | **0%** (1,065 show the internal token "xnum") |
  | A mí / a ti before gustar | 271 | **0%** |
  | madre, padre for mamá, papá | 52 | **0%** |
  | beber for tomar | 24 | **0%** |
  | Clitic moved in front (lo tengo que hacer) | 229 | 100% |
  | No inverted ¿ ¡ | 5,037 | 100% |
  | Subject pronoun added | 1,183 | 100% |

  (The clitic row uses a regex that skips bare *ir*, which is why *Me tengo que ir* above still fails.)
- **Contrast:** scenes are generous and feel fair. `checkTurn` accepted nearly everything reasonable (section 4). The problem is confined to translation cards, which are the backbone of the course.
- **Learner consequence:** a learner who knows more than the card expects is punished for it, and the app gives a false reason. "Check the meaning" tells them their understanding is wrong. They will either learn a false rule (that *tomar* is right and *beber* is not) or learn that the app cannot be trusted. Both are bad. The owner's "more translation everywhere" raises the stakes.
- **Fix, in order:**
  1. Today: map `xnum` back to digits, and accept digits for number words.
  2. Today: stop asserting. Unless the checker holds positive evidence that a word is wrong, say "We were expecting X" and show the answer. Reserve "isn't the word here" for known confusions.
  3. Add a deterministic **"I think mine is right"** button after a miss. It counts the card as correct (as a self-graded card) and logs input plus sentence id into a local list, exportable for content tuning. This is the strongest single trust feature available without AI. Every serious translation app ends up needing it.
  4. Build-time: generate `accept` sets through the gate for all sentences that can appear as translation cards, using synonym classes (*beber/tomar, madre/mamá, cuesta/vale/es, queda/está, comprender/entender*), natural fronting, and optional *a mí*. The cost is one burn; the benefit reaches every session.

#### C4. A placed learner can stop receiving anything new, for weeks

- **Locus:** `app/src/compiler/compile.ts:367` (when throttled, an `input` or `patterns` day converts to `review` with `advances: false`), `compile.ts:285` (throttled means due minutes above the budget), `placement.ts` `applyPlacement` (seeding), `blocks/writing.tsx` `Close` (`block.next`).
- **Evidence in the real browser (`a2-homes.txt`, `a2-days*.txt`):** the A2 learner finished four lessons, then did **16 consecutive sessions labelled "Catch-up mix"** until I stopped at session 20. New word screens: zero. The bar: "4 of 10 lessons", every day. First-try scores in the first week of this: 36/38, 37/42, 33/40, 36/42, 34/43, 29/35, 38/42. Close screens still promised **"Next time: a story."** Home day 5 screenshot: `.runs/shots/lowera2/025-a2-home-day5.png`.
- **Mechanism:** the path stops on a story or patterns day while due minutes exceed the band budget (7 minutes at A2). Seeding sizes the daily flow on a prior of 10 seconds a card (`TIMING_PRIOR_SECONDS`). Measured speed settled at about 17 seconds a card in the headless walks, which use the same per-card times as the browser run, because reviews are mostly typed. So the seeded flow alone sits near or over the budget, and any relapse pushes it past. The window for seeded cards can be up to 120 days (`SEED_MAX_WINDOW_DAYS`). I did not measure how long the condition lasts.
- **Checked headlessly with a perfect learner (never wrong, 28 sessions from each start, `walk-placed.jsonl`):**

  | Placed at | Sessions converted to review by the throttle | Longest stall | Where after 28 sessions |
  |---|---|---|---|
  | Week 8 | 0 | 0 | Week 10, day 9 |
  | Week 15 | 7 | 4 sessions | Week 17, day 1 |
  | Week 20 | 4 | 2 sessions | Week 22, day 5 |
  | Week 28 | 12 | 5 sessions | Week 29, day 6 |
  | Week 35 | 10 | 4 sessions | Week 36, day 8 |

  So even a flawless placed learner loses up to 43% of the first month at B1. A learner who gets some wrong adds relapses to the same queue: at about 80% right, the stall never ended in my test.
- **Learner consequence:** the person who proved they could skip ahead gets the dullest month of the product, at 80 to 95% accuracy, and is told each night that a story is next. From the outside the app looks broken: same label, same bar, every day. This is the moment of highest risk, a learner in their first month.
- **Fix:**
  1. Today: never hold the path on a throttled day when the session's accuracy is high. Advance anyway at 80% or better, because review debt and readiness are separate things.
  2. Today: `block.next` must come from the compiler's real decision.
  3. Seed fewer cards. A placed learner's history is an estimate, not a debt. Seed only the most recent units fully, use the learner's real measured seconds after the first week to re-spread the rest, cap seeded due cards at half the warm-up budget, and retire a seed after one good review at a long interval.
  4. Check the same logic for the non-placed path: the perfect beginner lost 2 sessions in the first 150 to it, which is fine, but a real one will lose more.

### HIGH

#### H2. Returning after three weeks is a wall, with no acknowledgement

- **Locus:** `app/src/ui/screens/home.tsx` (no absence logic), `app/src/ui/session/labels.ts` warm-up lead, `compile.ts` `warmupStd` (cap equals due minutes), `blocks/practice.tsx` ("the warm-up is never cut short"). A search of `src/ui` for any welcome-back copy found none.
- **Evidence (`back21.txt`):** after 21 days the Home says only "Hola / Today / Catch-up mix / About 20 minutes" (`.runs/shots/lower/169-back21-home-0.png`). The streak disappears silently. Then:

  > Quick warm-up
  > A few things from the last few days. Just remember them.
  > 1 of 61
  > About 19 minutes left

  It took 23.5 simulated minutes, 56 of 64 cards typed, at 64% right. The next session opened "1 of 53". Nothing new for two sessions. "Last few days" was three weeks ago, and "quick" was the whole lesson. The return after 90 days was no smarter: "Practice: writing it down" as if nothing had happened, then "Catch-up mix", then new content on session 3 with no reteaching of what had faded.
- **Learner consequence:** a learner who already feels guilty is greeted by a counter saying 61. A long break is the most likely way a learner leaves any language app, and this is the point where a good product wins them back. Sixty-one retrieval attempts on a rusty brain, mostly failed or barely passed, is the most demoralising session possible.
- **Fix:** add an absence branch at gaps over about 7 days.
  - Home: "Welcome back. It's been three weeks. Today we'll take it gently." No mention of a streak.
  - A capped return session of about 15 minutes: at most 15 to 20 of the most valuable lapsed items (highest teaching value, not longest overdue), then one rule reminder on the weakest grammar node, then one chapter re-read ("Previously…"), then something new and small to end on a win.
  - The rest of the backlog gets rescheduled, not dropped, using a soft reset that scales stability by the time away.
  - Over about 60 days: offer a three-minute re-placement inside the current band, with "go back a week" as a real option.
  - Never show a total. Show "A few to warm up" with a bar.

#### H3. Five minutes a day goes nowhere

- **Locus:** `home.tsx` `data-five` (tier `minimum`, cap 5), `compile.ts` minimum path, `store/ui.ts` `isResumable` (same day, 3 hours).
- **Evidence (`quick.txt`):** 8 consecutive days of "Only five minutes?": "9 days in a row." and "0 of 10 lessons". Each was about 2.7 minutes: 7 typed cards drawn from the same handful of items ("Hi, I'm Tomás.", "My name is Tomás."). Day 1 had no short option at all: the link needs prior reviews, "I need to stop" only appears after 10 minutes, and "Stop after this part" meant 7 more minutes in the teach block.
- **Learner consequence:** the app tells a learner their streak is safe while teaching them nothing. They never reach the story. Nothing tells them this after day 1: the streak grows, which reads as success. Settings says so honestly ("Keeps your streak, but does not move you forward"), but Home does not. The owner's "no lesson-length choice" still holds under this fix: nobody chooses a length, the lesson simply divides.
- **Fix:** make the day's lesson resumable across sittings and across days, in natural slices: words, then rule, then practice, then story. "Only five minutes?" should continue today's lesson from its saved cursor for five minutes, and stop at a slice boundary with "Lesson 3: two of four parts done". Three short sittings complete a lesson and move the bar. Keep the warm-up sprint as a fallback for the case where nothing can be taught. The saved-session code already exists; the change is the window, plus slice boundaries in the plan. Move the short option onto day 1.

#### H4. A recurring conceptual error stays invisible, and the correction is wrong

- **Locus:** `app/src/learner/weak.ts` (groups by node), `app/src/check/translate/hints.ts:26`, `app/src/check/wordhint.ts:17`.
- **Evidence.** I typed *ser* for *estar* wherever possible for 16 sessions: 36 slips (`beginner.jsonl`). After all that, the Home reads:

  > Keeps tripping you
  > How are you? Fine, and you?
  > work / job
  > Where is…?

  The app recorded one misconception as scattered chunks. *Estar* never appears as the issue. Meanwhile:
  - 6 of the 36 slips, including "¿Dónde es el baño?" four times and "El café es en La Candelaria.", got **"Almost. Check the spelling."** There is no spelling mistake. The word is right, the verb is wrong.
  - 2 got the empty "Have another look and try once more." "¿Cómo eres?" for "How are you?" means "What are you like?", which is a teachable moment the app ignores.
  - 28 got "Ser or estar? Is it what something is, or how it is right now?". That is wrong for location: "Medellín está en Colombia" is not about right now. The script teaches the correct rule ("if the answer is a place, or how you feel today, reach for estar"), so hint and lesson contradict each other.
  - On day 4 the hint names "ser" and "estar" nine days before estar is taught on day 13.
- **Train it** (`train.txt`): 3 cards, a "3:00" clock, then "0 of 3 right first time. This was practice only. Your review schedule is unchanged." No rule, no explanation, no consequence. After 0 of 3 the app has nothing more to offer.
- **Learner consequence:** the feature's promise is to find what keeps tripping you. The most common English-speaker error in Spanish can run for weeks undiagnosed. Learners who want to get better need exactly this diagnosis.
- **Fix:**
  1. Tag errors with a misconception class at the point of checking (`ser-estar`, `gender-agreement`, `personal-a`, `missing-article`, `tense-past`), and aggregate weak spots on the class as well as the node. "You've used ser where estar belongs 12 times" is deterministic.
  2. Replace the hint with one that fits the sentence: place: "Where something is takes estar." State: "How someone is takes estar."
  3. Run the same class detection on chunks so "Check the spelling" never appears for a real word.
  4. Make Train it a small lesson: the rule card first, then 8 to 10 cards on the contrast, then a verdict that changes the schedule.

#### H5. Placement items do not measure the level, and contain made-up words

- **Locus:** `placement.ts` `itemsFor`, `structuredInput` in `app/src/exercises/`. Full dump in `probe-levels.txt`.
- **Evidence.** The ladder has a level per unit, but the items are mostly basic present tense and person:
  - Week 20: "___ triste? (estar, tú)" → estás. Week 21: "___ ir contigo." (I want to go with you.) → quiero. A learner with A1 present tense can climb the whole of A2.
  - Measured over all rungs for one seed (`probe-sim2.out`): present-tense choose items, question words, person, number and gender make up 82% of A1 rungs, 81% of A2, 78% of B1, 77% of B2 and 77% of C1. At C1, 101 of 270 items are present-tense verb choice with the English shown. The sentences get longer; the thing tested does not.
  - Construct errors: "Which one is about now, or something that happens regularly?" with the answer **"¡Ánimo, Tomás! Vas a estar mejor."** That is the future. So is "¿Vas a ir a la boda de Camila?". A learner who knows the grammar has to pick the sentence that is not true to the question.
  - Invented forms are shown as options: "El client compra pan.", "El do es ingeniero.", "soy lo mesero", "La médica está en el hospital hasto los ocha.", "Las leches están aquíes.", "Te estoy escuchanda.", "Ha rayos sobre el norte.", "¡Ánimo, Tomás! Fuiste a estar mejor." A non-word distractor lets you find the answer by elimination, and it shows bad Spanish to a learner in their first three minutes.
  - The result depends more on the self-rating than on performance. True mid-A2 who says "Advanced" is placed at week 1 about 80% of the time. True end-of-B2 who says "A bit": median week 20, week 1 in 36% of runs. True week 27 who says "Beginner" (earlier run): median week 15.
  - Skipped content is never tested. Passing at week 21 "counts as known" the imperfect, the perfect, object pronouns, reflexives, por and para and commands, on the strength of a few tense-recognition items.
- **Learner consequence:** placed too high, the learner meets subjunctive on day 1 without the foundations and blames themselves. Placed too low, they are bored. Either way "The weeks before it count as known" is a claim the app cannot back up.
- **Fix:**
  - Rebuild the ladder on grammar milestones, not units: about 12 checkpoints (present, ser/estar, gustar, preterite, imperfect, pret vs imp, object pronouns, perfect, commands, future/conditional, present subjunctive, imperfect subjunctive), each with 3 hand-authored items that test that grammar and nothing else.
  - Use production, not only recognition: 2 typed items at the top of the range.
  - No generated distractors: whitelist them.
  - Show the result honestly: "You're solid on the present and the preterite. The imperfect looks shaky, so we'll start at week 8. You can start earlier or later."
  - Allow a change of level at any time in Settings, and let the app offer it after 3 poor sessions.

#### H6. A placed learner is dropped into the story with no idea who anyone is

- **Locus:** `home.tsx` story card; `screens/story.tsx` (`unlocked` means read); no recap anywhere.
- **Evidence (`a2-homes.txt`, `run2/a2.jsonl`):** Home on day 1 at week 20 or 21: **"Tomás has just landed in Bogotá. You'll read the first chapter soon."** The first chapter they read is deep in the plot. From `¿De parte de quién?`, a placed learner's first chapter at week 21:

  > Kilómetro doscientos. El bus subía otra montaña, y Vale dormía en el hombro de Tomás. Tomás tenía un papel con tres frases: «Tu mamá conocía a Rosa. Rosa buscaba a Joaquín. Tu mamá te mandó al café».

  Comprehension questions then assume the plot. The Story tab lists only chapters already read, so the chapters they skipped cannot be opened at all.
- **Learner consequence:** the story is the app's soul and strongest retention hook. For every placed learner it starts as confusing nonsense, and the Home states something false about it.
- **Fix:** write one authored "The story so far" page per unit (about 150 words in English, or simple Spanish), shown once on placement and available under Story. Unlock all earlier chapters to placed learners as optional reading: they make perfect comprehensible input at a level below their own. Correct the Home line.

#### H7. "Story" days without a story

- **Locus:** `labels.ts` (`case 'input'` fallback), `compile.ts` `inputDay`, `chapterProblem`.
- **Evidence:** Home on day 5 of unit 1: **"New words, in a story"**, week map **"Story (today)"**. The session has 10 new items, 8 cued cards and 12 remix cards, with no reading at all. Day 4's close said "Next time: a story." It is not specific to weak learners: the perfect headless learner hit it too: `diag [deferred] chapter ch002 waits for owed items`. In the first 150 sessions, 4 of 15 story days had no story (units 1, 4, 12, 14; `walk-a1.jsonl`). Day 5 of the first week is the first promise the app breaks.
- **Learner consequence:** the most-anticipated session of the first week is replaced by the most laborious, under a label that says otherwise.
- **Fix:** when a chapter is deferred, relabel the session honestly and do not let the session grow to fill the gap. Better, drop the owed-word gate for chapters: unknown words are glossed anyway (the owner's rule), so the story can always run. Authored content is the reward; never withhold it.

#### H8. "Answer for yourself" asks nonsense, then reveals nonsense

- **Locus:** `app/src/ui/session/cards.ts:605` and `:739`.
- **Evidence:** the block is headed "Talk about you. Real questions. Answer them for yourself." Real cards:
  - ¿Ustedes son Mariana y Hernando? (Are you Mariana and Hernando? (you all))
  - ¿Eres tú, Tomás? (Is that you, Tomás?)
  - ¿De dónde eres, Vale?
  - ¿Tomás salva La Esquina de Rosa?
  - ¿Qué dirá Altamira?

  Press "Show me" and the screen says **"Here's the right version: Soy …"** (`.runs/shots/lowerp/` answer-yourself series, `manual.txt`), or "Tengo …". For "¿Qué hora es?" the log expected **"Soy …"**. The line beneath is good ("Any true answer works. Just answer the way the question asks.") but a "right version" made of one word and an ellipsis is meaningless.
- **Learner consequence:** the block that should feel most personal is the one that feels most machine-made. A question addressed to a named character cannot be answered "for yourself".
- **Fix:** author a pool of real personal questions per unit (about 12 each), with one sample answer and a hint, through the gate. Stop selecting from the bank: filter out any question with a name in it, any *ustedes*, any question of fact about the story. Show "One way to answer: Soy de Toronto."

#### H9. Recognition cards can be solved without any Spanish

- **Locus:** generated distractors in `cards.ts` `reviewCard`, `learnRetrieval`, and the `pick` path in `practiceCard`.
- **Evidence:** of 74 sentence-level multiple-choice cards containing a name in the beginner log, in 63 the right answer was the only option containing that name. Examples: "Me llamo Tomás." with "I'm thirty-four. / Well, I don't know. / My name is Tomás."; "¿Usted es Rosa?" with "OK, I'm going to eat. Bye. / The lady works in a café. / Are you Rosa? (polite)". The label "(polite)" also appears only on the right option in such sets. Day 2 of the grammar practice, on *soy, eres, es*, did not test person at all on these cards.
- **Contrast, which must be preserved:** the hand-written script cards test the actual point: "Somos de Cali.": "We're from Cali. / They're from Cali. / I'm from Cali."
- **Learner consequence:** 49% of cards are multiple choice, and many of them are empty clicks. They inflate "right first time" and teach no discrimination.
- **Fix:** for sentence cards, generate minimal-pair distractors (same sentence with changed person, tense or polarity) where the engine can do it safely, and fall back to a typed card rather than random sentences. Strip disambiguating parentheticals from all options or add them to all.

#### H10. Feedback rarely explains

- **Locus:** `components/card.tsx`, `card.why` builders in `cards.ts`.
- **Evidence:** 123 multiple-choice misses across the logs: 101 (82%) show only the pair again ("Somos de Cali. → We're from Cali."), 8 say "The story says: …", and 14 say something about the form. The 2-line miss screen often says the same thing twice:

  > Not quite. It's Hi, I'm Tomás.
  > Soy Tomás. means "I'm Tomás.".

  Typed reveals use "Here is how Spanish says it.", and the transform version reads **"Here is the sentence said was like this before: start with "Antes"."** (a broken string). There is no word-level comparison between what you typed and the answer.
- **Learner consequence:** the moment of error is the moment of greatest learning value, and the app spends it restating the answer. A learner cannot see which word was wrong.
- **Fix:**
  - Show a word-level diff with the typed answer on one line, the expected below, differences highlighted. It is deterministic and cheap.
  - For form cards, give the rule: "soy is the I form; somos is we". The engine knows person and tense.
  - Link the node's lesson: "See the rule".
  - Remove lines that repeat the answer.

### MEDIUM

#### M1. A "week" is not a week, and time words are wrong in many places

- **Locus:** `onboarding.tsx`, `home.tsx`, `labels.ts`, `progress.tsx`, `writing.tsx`.
- **Evidence:** "By the end of this week you'll be able to…" then "0 of 10 lessons" with one lesson a day. The headless perfect learner averages about 10 sessions per unit. "This week: My day-to-day" runs for 10 days. "You'll start at week 21". Day 5: "Remix. A mix of things from the last few weeks." Day 6: "From last week, 2 of 2 came back." After 21 days away: "A few things from the last few days."
- **Consequence:** a pacing promise the learner can check and find false. At one a day, the course is about 20 months, not 60 weeks.
- **Fix:** rename units to "Part 21" or "Chapter", or use the theme name, and take time words out of leads or compute them from real dates. Or make a unit truly seven sessions. That is a course decision, but the copy must be true either way.

#### M2. "Try again" spends your second attempt without letting you edit

- **Locus:** `components/card.tsx` `TypeView`; `disabled={!value.trim()}`.
- **Evidence:** the wrong answer stays in the field and the button says "Try again". Pressing it at once resubmits and reveals. A learner reads "Try again" as "let me try", not as "submit this again". Seen in my day 1 walk, steps 53 to 54.
- **Fix:** disable the button until the text changes; select the text on focus; label it "Check again".

#### M3. Hints misdirect or overclaim

- **Locus:** `check/translate/hints.ts:135`, `card.tsx` `retryLead`, script `g_ser-identity`.
- **Evidence:**
  - "Hi, my name's Ana and I'm from Cali." → **"That's not the sentence yet. Start with the verb: soy…"**. The answer starts with *Hola*.
  - "Sorry, where's the bathroom?" → "Start with the verb: está…"; the answer is "Qué pena, ¿dónde está el baño?".
  - "Turn it into a question… Usted es de Cali." with the wrong sentence "Soy de Toronto." → "**Almost.** Check the verb ending: who is doing it?"
  - `g_ser-identity.json:158`: "Only the ending changes: *es* becomes *soy*." That is not an ending change, and it is the learner's first lesson.
  - "Not yet. A word is missing." for pure junk like "no sé".
- **Fix:** "Start with…" must use the expected answer's real first word, or say nothing. "Almost" needs a similarity floor. Fix the script line ("Change es to soy").

#### M4. "Which word is doing the work here?" can be wrong

- **Locus:** `session/teachflow.ts` `spotIt`, `workWords`.
- **Evidence:** in the lesson on *quiero que vengas*: options **hables / quiero / clientes**, answer **"It's quiero."** The point of the lesson is *hables*. In the first group the same lesson gave "trabajes". On day 1 the options are lower-cased names: **"tomás / bogotá / eres"**.
- **Consequence:** the noticing step, which is well designed, can fix attention on the wrong word.
- **Fix:** put the word in the script as authored data. It is one field per script, on 916 scripts, and a burn can do it. Keep proper capitals.

#### M5. Accent policy is inconsistent and unlocated

- **Locus:** `sentenceCheck` (strict) versus `chunkCheck` (lenient).
- **Evidence:** accent-free forms of 16,582 bank sentences: 34 accepted. "Vale es de Medellin" fails on the accent in a place name. By the code, the same learner typing a chunk passes with "Right. Just watch the accents" (`chunkCheck`; read, not observed on screen). The hint "Check the accents." does not say which word. `weak.ts` counts `tries === 2` as a miss, so a learner who types without accents and fixes them on retry is logged as weak.
- **Fix:** accept accent-only slips everywhere with "Right. Just watch the accents:" plus the corrected sentence and the accent highlighted. Keep strictness only where the accent changes the word (*esta/está, si/sí, tu/tú, el/él, hablo/habló*), and name that word. Do not count accent retries as weakness.

#### M6. The time promise breaks when it matters most

- **Evidence:** Day 10: "About 20 minutes", actual 28.6. Return: "About 19 minutes left" on "1 of 61", actual 23.5. On Home, a session left at 7 minutes showed "About 19 minutes left" while the session itself had said "About 15 minutes left" (`run2/resume.txt`). Settings says "About 20 to 30 minutes". Welcome says "about 20 minutes".
- **Fix:** one estimator, shared by Home and session, driven by the learner's own pace per card type. Cap the warm-up at its budget.

#### M7. Weak spots list noise

- **Locus:** `learner/weak.ts` `recentMisses`.
- **Evidence (`weak.txt`):** "¿Has estado en el café de Rosa? Está en La Candelaria." appears **four times**, then "Vale es colombiana, de Medellín." four times: one row per node credited. It shows the right sentence, not what you typed.
- **Fix:** dedupe by sentence; show "You wrote…" next to the right version.

#### M8. Reader defects

- **Locus:** `blocks/read.tsx`, `bundle.gloss`.
- **Evidence (`reader.txt`, `.runs/shots/lowerr/006-reader-gloss.png`):**
  - Tapping the character's name **Vale** gives "Vale from valer, to be worth (he or she, present)". She appears in every chapter.
  - Orphaned punctuation: "¿Y mi tinto" wraps with **"?"** alone on the next line; "Uy, no" with "." alone. At phone width, this is visible in chapter 1. Words are separate buttons with no join to following punctuation.
  - All Spanish on the page is bold and rust coloured. Fine for a prompt; tiring for a 250-word chapter.
  - "gusto" glosses as "taste (sense)" inside "Mucho gusto".
- **Fix:** name list in the gloss; wrap word and trailing punctuation in one non-breaking span; a reading style (regular weight, dark text) for chapters; phrase gloss first for chunks.

#### M9. Awkward vocabulary presentation

- **Evidence:** "el gusto: taste (sense)" with "Mucho gusto. Soy Simón." as its example, then the gap "Mucho ___. Soy Simón. (Nice to meet you. I'm Simón. (taste (sense)))". A cue meaning nothing to anyone. Also "(good, more than one)", "(day, more than one)". The Writing checklist shows raw tags: **"use soy (ser · Presente · yo)"** on day 2.
- **Fix:** let a lexeme whose first use is in a chunk be glossed by the chunk. Use "(plural)". Render constraints in plain English.

#### M10. Nothing marks the end of a unit

- **Evidence:** Day 10: "10 of 10 lessons this week / Next time: something new." and the bar resets to "0 of 9". No self-check on that day; "You can now…" on Progress gets a tick for every finished unit (`progress.tsx:68`), whatever the performance. The second unit's goal was ticked for the rusty learner at 65%.
- **Consequence:** the can-do is the product's promise, and it is awarded for attendance.
- **Fix:** end each unit with a small named moment: the can-do, a one-minute performance (the scene you just did, shown back), your best sentence from the writing. Tick the can-do only after a self-check or check result.

#### M11. Settings contradicts a standing decision, and offers no recovery

- **Locus:** `screens/settings.tsx`.
- **Evidence:** "How much each day: Just the essentials / The regular lesson / …plus extra reading" and "About 20 to 30 minutes" sit against the decision that learners do not choose lesson length. The only level control is "Reset progress…". There is no export or backup (no Blob or download code in `src/ui`), though Settings warns "Deletes your progress on this device".
- **Fix:** remove the tier choice or rewrite it. Add export and import of progress as a file: months of work should not depend on browser storage. Add "Change where I am in the course".

#### M12. The first screen of a first session is empty

- **Evidence:** Day 1: "Quick warm-up. Nothing to look back at yet, so let's go straight in. Continue". Day 2: "Nothing is due today. Straight in." Welcome had promised "Each day starts with a quick look back".
- **Fix:** skip an empty block.

#### M13. Reading is a small share of the first month

- **Evidence:** 446 words in 16 days, three chapters, under 5% of practice time. Against the goal of reading sophisticated material, reading is a side event. Chapter 1 is also the strongest material in the app.
- **Fix:** add a short reading on every session after the first week: three to six lines using today's words, drawn from the unused story material or authored mini-texts. Consider a graded reader shelf available any time (see section 5).

#### M14. Long same-format runs late in a lesson

- **Evidence:** longest same-format runs: 7 cards on day 5, 9 on day 9. Warm-ups grow from 0 to 5.5 minutes by day 14 and take about a quarter of each session. Days 15 and 16 repeated seven "Your turn" cards word for word ("Ask a woman friend: Are you busy?", "Los clientes están ___.").
- **Fix:** hold exact repeats at least two sessions apart and use a sibling item when one exists.

### LOW

- **L1.** Home has two solid green buttons (Start, Quick review) competing on the same screen (`.runs/shots/lower/004-home-day1.png`). Quick review should be secondary.
- **L2.** Tab "Look up" opens a screen titled "Reference". Search for "tengo" stays on Grammar although Verbs (1) is the best match. "Other" is the largest group on the list.
- **L3.** Quick review shows "1 of 60" with a 5:00 clock; about 17 fit.
- **L4.** "Remix" is jargon. "Story so far" heads a quiz score.
- **L5.** After "I need to stop": "Up next: New words and phrases", while the week map says "Teach (today): …".
- **L6.** On Progress, "Words and phrases that have stuck: 0" for the first two months. Honest, but a big zero. Pair it with a nearer measure, such as "words you can use today".

---

## 4. What the application does well and must be preserved

- **No sign-up, instant start, offline.** The first card is seconds away.
- **The story.** Simón the parrot shouting "¡Altamira no!", Don Hernando's missing tinto, and hooks such as "Twenty people answer it, and one of them turns up late, carrying half a bicycle." Close-screen hooks are the best retention device in the app.
- **A whole chapter on day 1.** "You just read a whole chapter in Spanish: 118 words." It delights. Keep it.
- **Phrase-level glosses** with cultural notes: "mijo: son, lad (warm, from «mi hijo»)", "¿Y mi tinto? And where's my coffee? (tinto: a small black coffee)". Only 2 of 50 distinct words in chapter 1 had no note (*Toronto*, *Simón*).
- **Scenes.** "Knocking on the glass" on day 10 is the best moment in the first fortnight. The checker is generous and intent-based: all reasonable paraphrases I tried passed ("Encantado, señor. ¿Usted es profesor?", "No señor. Trabajo como ingeniero."), and it caught real errors ("To do this, use usted (es), not tú (eres)."). Translation checking should learn from it. (Small leak: "No hay agua." passes the turn asking you to offer water.)
- **Hand-written script cards and pitfalls.** Contrast options ("We're from Cali. / They're from Cali."), and "Almost everyone slips here at first" with a struck-out wrong form, are well designed.
- **Heavy typed production.** Half of all cards are typed, from day 1, including whole sentences.
- **Coverage gating.** Of 385 production cards for the beginner, only 25 used a word form never seen, mostly inflections of taught verbs. A sophisticated guarantee that holds up.
- **The session shell.** A calm bar, "I need to stop", the Leave sheet with "Stop after this part" (`.runs/shots/lower/126-leave-sheet.png`), resuming at the exact card, with progress saved. It worked every time I tested it.
- **Honest copy in places:** "The form is right. I can't judge the meaning, so here's one for comparison". "Mostly English so far. Try it in Spanish." (`checkPersonal` caught "banana banana" and English correctly.)
- **The accent bar** that keeps the caret and focus.
- **No dashes:** zero em dashes, en dashes or spaced hyphens in anything shown across my logs.
- **Take a check:** "Week 1, Hello, this is me: 5 of 5. Week 2, My day-to-day: 9 of 10." Clear, useful, kind. It should eventually change the plan.
- **Look-up entries:** the estar page is a real reference: quick test, forms, watch-outs, sentences, practice.
- **Two-attempt typing** with both attempts shown ("You wrote: … then …").

---

## 5. Missing capabilities

What these learners wish the app could do:

1. **"I think mine is right."** See C3.
2. **Show me exactly what I got wrong.** A word-level diff. See H10.
3. **Welcome back.** See H2.
4. **Tell me what I keep doing wrong, in plain language.** Misconception-level diagnosis: "You keep using ser for where things are." See H4.
5. **A real map.** There is no view of the whole course. A learner cannot see where they are going, what A2 will let them do, or how far they are. Home shows one unit and Progress shows "A1, week 2 of 14". A scrollable road of 60 units with can-dos, marked as done, here, or next, would answer "is this worth it?".
6. **Change my level.** In either direction, at any time, with a short check. See C1, H5.
7. **The story so far.** See H6.
8. **A personal phrasebook.** "Things I'd actually say": sentences the learner wrote about themselves, kept, corrected against models, and practised. Personal sentences are currently thrown away after the session. Keeping them and bringing them back as review is the most motivating material possible, and it needs no AI.
9. **Save any sentence.** Saving exists only for words in the reader, not for sentences in cards or look-up.
10. **A week in review.** A short, shareable summary: words learned, your best sentence, the scene you finished, one thing to work on. There is nothing that gives a sense of a period closing.
11. **Reading shelf.** Graded mini-texts at the learner's level, any time. It uses the same reader and coverage logic. The Story tab today holds only chapters already read.
12. **Reminders.** A daily nudge at a chosen time, within what a PWA can do. The app has no reminder of any kind, and "would I open it tomorrow" is largely a function of that. On iOS this may be limited; a calendar file export is a cheap alternative.
13. **Backup and restore.** See M11.
14. **Spoken rehearsal without listening features.** "Say it aloud" prompts during scenes and reading, with a self-check, need no audio input or output and stay within the standing decision. The learner produces speech that the app never hears. Worth trying given that speaking confidence is an end goal.
15. **Conjugation self-test before lessons.** A placed learner could prove they own a tense in two minutes to skip a lesson.

---

## 6. Recommended improvements

Grouped by what the learner feels:

**Trust ("the app knows Spanish and is fair to me")**
- Remove every generated transform that is not whitelisted (C2).
- Add synonym classes, digits and "I think mine is right" (C3).
- Replace false hints with honest ones (C3, H4, M3).
- Replace non-word distractors (H5).

**Entry ("I'm in the right place")**
- Fix the ladder (C1), rebuild it around milestones (H5).
- Add recap and show what was skipped (H6).
- Stop seeded backlog from stalling the path (C4).

**Return ("I'm welcome here")**
- Absence branch, capped return session, soft reset (H2).

**Fit ("it fits my life")**
- Lessons divide into slices that resume across days (H3).
- Show the short option on day 1.

**Depth ("I'm actually getting better")**
- Misconception tracking and real Train it lessons (H4).
- Word-level diff and rule-based explanations (H10).
- Real personal questions (H8).
- Unit-end moments tied to real evidence (M10).
- More daily reading (M13).

**Honesty of labels**
- One rule across the product: a label must come from what the compiler actually decided (H7, C4, M1, M6).

---

## 7. Uncertainties and limitations

**Modelled, not human.** My learners are scripted policies, not people. Accuracy rates, retry behaviour and the A2 knowledge curve (95% up to unit 14, 80% to unit 20, 50% to unit 27, then 20% and 5%) are my own assumptions. Session minutes rest on assumed card times. Warm-up sizes depend on those, because the app adapts to measured speed. A slower real learner may see throttling sooner.

**The placed stall (C4)** lasted 16+ sessions for one simulated learner at about 80% accuracy and about 17 seconds a card. I stopped at session 20, so I do not know when it ends. The headless table shows a floor: a perfect learner at the same card speed. A real learner's stall will depend on accuracy and pace, and a learner much faster than 10 seconds a card would escape it. The mechanism is confirmed in code.

**Placement percentages** come from a model where knowledge is a function of the unit an item belongs to. Since items do not really test their unit (H5), real learners would score higher on upper rungs than that model. The all-right and one-miss results in C1 are exact, not modelled.

**The 142, 48 and 101 transform counts** are from regex classifiers and are approximate. The 1,132 untaught-tense count is exact for the first transform per sentence, for the course order in the content at audit time.

**Checker battery.** Rows marked as bank rows in my script were real bank sentences. Rows that were chunks were checked with `sentenceCheck` on a plain string in the battery output, so I excluded them from C3's table. Some chunk cards use the more lenient `chunkCheck`. The time-fronting rephrasing was dropped because my regex broke some sentences.

**Not inspected:**
- Real phone keyboards, iOS Safari, Android Chrome, installed PWA mode, offline use, service worker updates. The driver blocks service workers.
- Desktop layout, dark mode, screen readers, keyboard-only use, large text.
- Real reading speed and whether the humour lands for real learners.
- Units beyond about week 24 in play. Beginner play stopped at unit 3 (150 sessions headless reached unit 16).
- Sessions with an "Another" chain, the extended tier, Verb workout and Mixed drill end to end (entered, not completed), timed rerun of scenes.
- `checkpoint` days in the real UI (seen only in the headless walk).
- Long-term FSRS behaviour beyond the return tests.

**Limitations of standing decisions, stated not contested:** without listening, the only pronunciation teaching is respelling ("OH-lah"), and day 1 asks a learner to read a chapter before the pronunciation lesson on day 3. Consider moving a very short sounds card to day 1.

---

## 8. Suggested implementation priorities

**P0: this week, small and safe**

| # | Change | Finding | Effort |
|---|---|---|---|
| 1 | Fix `ladder.result()`; test all-right and one-miss on every start | C1 | Hours |
| 2 | Pass `taught` into transforms; block *se*, imperatives, greetings, multi-sentence and names; treat Vale as a name | C2 | About a day |
| 3 | Map `xnum`; accept digits for numbers | C3 | Hours |
| 4 | Soften hints: no "isn't the word here" without evidence; "Start with" uses the real first word; "Almost" floor | C3, M3 | Hours |
| 5 | "Check the spelling" never on a real word; ser/estar hint by context | H4 | Hours |
| 6 | Honest labels: story day with no story, "Next time", warm-up lead, Remix lead, "week" | H7, C4, M1 | Hours |
| 6a | Advance a throttled story or patterns day when accuracy is 80% or better | C4 | Hours |
| 7 | "Show me" on Answer for yourself: "One way to answer", never "Tengo …" | H8 | Hours |
| 8 | "Try again" needs a change; dedupe Recent misses; reader punctuation; Vale gloss; skip empty warm-up | M2, M7, M8, M12 | Hours |
| 9 | Remove the broken "said was like this before" string; fix `g_ser-identity` line 158 | H10, M3 | Minutes |

**P1: next two weeks, biggest retention gains**

| # | Change | Finding |
|---|---|---|
| 10 | "I think mine is right" with a local log | C3 |
| 11 | Absence branch, capped return session, soft reset | H2 |
| 12 | Reduce and re-spread seeded cards using measured pace | C4 |
| 13 | Story so far page per unit; unlock earlier chapters | H6 |
| 14 | Word-level diff on every miss | H10 |
| 15 | Export and import | M11 |
| 16 | Change my level | C1, H5 |

**P2: a month, deeper teaching**

| # | Change | Finding |
|---|---|---|
| 17 | Misconception classes, class-level weak spots, Train it as a small lesson | H4 |
| 18 | Accept sets through the gate; synonym classes | C3 |
| 19 | Lessons divide into slices that resume across days | H3 |
| 20 | Placement rebuilt on grammar milestones, with production | H5 |
| 21 | Minimal-pair distractors or no card | H9 |
| 22 | Authored personal question pools | H8 |
| 23 | Transform whitelist through the gate | C2 |

**P3: product growth**

| # | Change | Finding |
|---|---|---|
| 24 | Course map | Section 5 |
| 25 | Personal phrasebook from the learner's own sentences | Section 5 |
| 26 | Unit-end moment tied to evidence | M10 |
| 27 | Daily mini-reading and reading shelf | M13 |
| 28 | Week in review; reminders; spoken rehearsal | Section 5 |
