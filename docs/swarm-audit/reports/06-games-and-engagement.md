# 06. Games and engagement

Role: Learning Games and Motivation Designer. Date: 1 November 2026. Target: the rebuild in `app/`, plus the old app's arcade, which this brief authorises me to audit.

**The verdict in five sentences.** The rebuild has no games, and its one score cannot work: the personal best is invisible until beaten and is keyed to an exact list of verbs, so in normal use it almost never compares like with like. The old arcade had far better game feel than the rebuild and deserves to be mined, but it must not be ported: run through its own scoring code, blind tapping beats real knowledge in its flagship contrast game, its rating falls for a learner whose skill never changes, and its "same challenge for everyone" is not the same. The rebuild's assets are better than the old app's for this job, once you use them: 255 authored minimal-pair sets in the teaching scripts, 2,933 wrong/right pitfalls, gating that works from week one, and a conjugation engine fast enough to check every keystroke. Beyond games, the biggest threat to a 19-month course is simpler: the rebuild has no backup, throws away everything the learner writes, and has no way of showing a person that they are better than they were in March. I propose nine games, four to build first, one rule set that keeps "no XP" true, and a monthly ability ledger.

---

## 1. What was investigated

**Old app, read in full:** `js/games.js`, `js/gameround.js`, `js/gamescore.js`, `js/gameitems.js`, `js/arcade.js`, `js/liga.js`, `js/quickplay.js`, `js/deck.js`, `js/essay.js`. **Read at header level (first 45 lines):** `capture.js`, `userwords.js`, `deepdive.js`, `drills.js`, `report.js`, `unitcheck.js`, `study.js`, `accepted.js`, `suggest.js`, `focus.js`, `progress.js`, `write.js`, `writer.js`, `practice.js`, `selector.js`, `speak.js`. Also `juegos/`, parts of `js/errorlog.js`, `js/srs.js`, `js/settings.js`, and the head of `tools/test-arcade.js`.

**Rebuild, read in full:** `src/ui/screens/home.tsx`, `practice.tsx`, `progress.tsx`, `session.tsx`, `story.tsx`, `weak.tsx`, `settings.tsx`, `src/ui/session/freeplay.ts`, `more.ts`, `recap.ts`, `goal.ts`, `practice-spec.ts`, `src/ui/store/ui.ts`, `src/ui/data/bundle.ts`, `src/learner/learner.ts`, `events.ts`, `metrics.ts`, `weak.ts`, `store.ts`, `src/exercises/types.ts`, `index.ts`, `rng.ts`, `src/ui/components/card.tsx`, `answer.tsx`, and `src/ui/blocks/read.tsx`. Close screen, timed recall and scene rerun read in the relevant parts.

**Driven as a learner:** a phone-viewport profile through onboarding and placement (it landed at unit 22, "Good news, bad news"), Home, More practice, a verb workout including a wrong answer, a translation run, and a production build boot.

**Measured with scripts** (all in `/private/tmp/claude-501/-Users-Matthew-Fluidez/40ef6734-a9c2-4284-b528-c9cc038164e6/scratchpad/games/`): the old scoring code under simulated players (`sim-old-score.js`), proposed scoring (`sim-new.js`), game pools over all 72,693 bank sentences by course position (`pools.ts`), contrast support and order-swap acceptance (`contrasts.ts`), five crediting policies against FSRS over 540 days (`fsrs-sim.ts`), and index build and event-log costs (`timing.ts`).

**Research:** web sources listed in section 6.1, with evidence tiers.

---

## 2. Evidence from the actual application

### 2.1 What a learner meets today

Home for the placed learner shows Today, then a Practise card with two buttons, "Quick review" and "More practice", then the week, then the story. There is no number to chase, no game, nothing that says "you nearly beat this". The line under Practise is honest and flat: "Extra work, any time. It never changes today's plan."

More practice has three sections. For the unit 22 learner the page contains **267 checkboxes, all ticked, and is 8,132 CSS pixels tall**, about ten phone screens. Every verb is pre-ticked because placement stamps every seeded node with today's date, and the picker pre-selects verbs "introduced today" (`practice.tsx:53-56`).

A verb workout then shows:

```
3:00
Type the form
(conocer, ellos, wishes and doubts)
they know (people/places)
[Check] [Show me]
```

A right answer needs **two confirmations** (Check, then Next). A wrong answer needs three or more. After a double miss the explanation was "conozcan is the form." I timed the clock across a correction: it fell from 3:00 to 2:50 while the correction sat on screen. It does not pause (`practice.tsx:152` runs an interval from `startedAt`).

### 2.2 The game-shaped things that already exist

Three timed blocks live inside lessons, and they are good ideas with no memory:

| Block | Where | Copy | What is kept |
|---|---|---|---|
| Two-minute sprint (`timedRecall`) | Minimum tier only (`compile.ts:1326`) | "As many as you can. Speed over perfection." | Nothing after the block |
| Timed re-read (`reread`, fluency) | Input days | "Same story, a little faster. Try to beat your first time." | `readSeconds` keeps the first read only |
| Timed scene rerun (`sceneRerun`) | Output days | "You know how it goes now. Try it against the clock." | Compared on screen, then gone |

### 2.3 The motivation surface today

| Element | Where | Verdict |
|---|---|---|
| Streak with earned freezes | `store/ui.ts:350`, Home lead | Good. Quiet, forgiving |
| "N of M right first time" | Close | Good, session scoped |
| "From last week, X of Y came back" | Close, `metrics.ts:84` | The best line in the app: it reports memory, not attendance |
| Week map and can-do bar | Home, Close | Good |
| Story cliffhanger | Close, Home | Very good, see section 4 |
| "Things from last week you still have: N%" | Progress | Good, honest |
| Words that have stuck, sessions, days | Progress | Fine, though most are counters |
| Any-time check | Progress | Good, though only the last result is shown |

What is absent: any chart or time axis, any month-on-month comparison, any milestone event, any recognition of crossing a band, any return flow, any sharing, any backup.

### 2.4 Measurements on the rebuild's game material

**Gating works from week one.** Sentences legal to show, by course position (requires all taught):

| Finished | u02 | u03 | u05 | u07 | u10 | u14 | u20 | u27 | u34 | u41 | u51 | u60 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Legal sentences | 1,226 | 2,263 | 3,721 | 5,524 | 9,432 | 14,397 | 21,478 | 28,489 | 37,138 | 44,029 | 56,367 | 67,005 |
| Chip-buildable (4 to 9 tokens, no repeats) | 472 | 1,081 | 1,919 | 3,054 | 5,316 | 8,079 | 11,864 | 15,834 | 20,599 | 23,703 | 29,069 | 31,865 |
| Verbs met that the engine conjugates | 47 | 67 | 90 | 110 | 164 | 228 | 315 | 432 | 558 | 655 | 733 | 820 |

5,687 of 72,692 sentences never become legal under my calculation, which is stricter than the compiler: it treats tagger ids with no graph node as unteachable. So these pools are a floor.

**Contrast material.**

- **0 of 94 contrast nodes appear in any bank sentence**, as a target or a requirement.
- **89 of 94 contrast nodes appear on exactly one day of the course.** Only five recur: `x:ser-estar-adj` (24 days), `x:creo-no-creo` (17), `x:pret-imp` (13), `x:lo-le` (13), `x:por-para` (12).
- The bank has almost no minimal pairs. Of 30,122 sentences I could gap on ser/estar, por/para or a past form, only **4 have a twin** differing by that word, and those are two pairs: `¿Cómo es Hernando?` / `¿Cómo está Hernando?` and `tuvo razón` / `tenía razón`.
- The teaching scripts are where the minimal pairs live: **7,617 read-and-pick items, 6,511 your-turn items, 2,933 pitfalls with a wrong form, a right form and a reason, and 255 authored twin sets** (same choices, different right answer), 82 of them in 46 contrast scripts. Example from `content/scripts/x_por-para.json`: `Lo hice para ti.` and `Lo hice por ti.` against "I made it for you to have." and "I did it for your sake."

**Speed is not a constraint.** `acceptedForms` plus `checkExact`: 0.009 ms per call. `matchTranslation`: 0.17 ms. Both can run on every keystroke, even allowing a phone to be ten times slower.

**Tap to first card:** a translation run took 960 ms in dev on my machine, loading the units up to the learner's position. Production boot to the first interactive screen: 1.2 to 1.8 seconds on this desktop with 142 content requests. A mid-range phone will be several times slower. I did not measure one.

**Reading material:** 219 chapters, 977 questions, 655 re-read questions, none typed. `splitBeats` already cuts a chapter into stretches of 40 words or more with their own questions.

**How much of the last chapter could you read?** A share of the word tokens in fixed chapters that the course has already taught, by position (tokens mapped to a lexeme node; 89 to 93% of tokens map):

| Finished | u02 | u05 | u07 | u10 | u14 | u20 | u27 | u34 | u41 | u51 | u60 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch170 (B2) | 67% | 72% | 79% | 85% | 88% | 91% | 95% | 97% | 97% | 100% | 100% |
| ch200 (C1) | 68% | 75% | 79% | 82% | 84% | 88% | 91% | 93% | 94% | 95% | 100% |
| ch219 (last) | 66% | 72% | 77% | 83% | 87% | 91% | 94% | 95% | 96% | 97% | 100% |

That smooth curve is a ready-made growth story. It is token coverage, so function words flatter the early numbers. Stated honestly it reads "you would need to look up about one word in three" at u02 and "about one word in twenty" at u34.

### 2.5 Measurements on the old arcade

**Blind tapping beats knowing Spanish.** I loaded the real `js/gamescore.js` and ran its award and ladder functions through a model of the real Uno u otro loop: a 60-second clock that pauses on wrong answers, a 170 ms delay on right ones, two options. 2,000 rounds per profile:

| Player | B1 learner score | A1 learner score | Items seen |
|---|---|---|---|
| Knows it, careful: 90% right, 3.0 s | 3,772 | 2,440 | 19 |
| Knows it, quick: 90% right, 1.8 s | 6,975 | 4,495 | 30 |
| Half knows: 70% right, 2.5 s | 2,588 | 1,883 | 22 |
| Cannot read Spanish: 50% right, 0.5 s a tap | **6,606** | **6,043** | 102 |
| Cannot read Spanish: 50% right, 0.3 s a tap | **10,168** | **9,339** | 156 |

The code's header claims the opposite (`gamescore.js:17-20`): "A WRONG ANSWER SCORES ZERO whatever the speed, so a fast wrong answer can never beat a slow right one, the one guarantee a timed language game has to make." True per item, false per round, because the clock pauses on every wrong answer, so wrong answers cost no time.

**The rating falls when nothing changes.** The real `GS.rate`, fed simulated rounds from an unchanging 90% player:

| Round | 1 | 50 | 100 | 200 | 300 | 600 |
|---|---|---|---|---|---|---|
| Rating | 1,007 | 950 | 927 | 840 | 783 | 592 |

In my reimplementation of the same formula with 25% round noise, a learner who genuinely **doubles** their score across 300 rounds still ends at 758, below the 1,000 start. (The simulated rounds above have 19% noise, so the real function falls more slowly but in the same direction.) The cause is arithmetic: it compares each score's logarithm to an arithmetic average, and noise makes that comparison negative on average. The code says (`gamescore.js:382-384`): "A rating falls, so it measures how you are playing now." It measures how many rounds you have played.

**What crediting does to memory.** One card, 540 days, FSRS-5 at 90% retention. A hidden true memory is compared with what the app believes. A game touch strengthens true memory only partly (30% of the time for a two-option tap, 60% for typed), which is an assumption, not a measurement. At 0.35 touches per card per week, a two-option game, a 10% speed slip:

| Policy | Calm reviews per card | Recall at review | Days below 80% recall | App's stability vs true |
|---|---|---|---|---|
| No games | 7.8 | 0.902 | 0.0% | 669 / 669 |
| Exposure only | 6.6 | 0.929 | 0.0% | 669 / 756 |
| **Old rule: hit = full credit any time, miss ignored** | 2.7 | **0.887** | **5.7%** | 846 / 736 |
| Hit and miss both count, any time | **11.4** | 0.959 | 2.0% | **108** / 781 |
| Due cards only, both count | 6.4 | 0.929 | 0.2% | 669 / 752 |
| Due cards only, miss stays due | 6.2 | 0.929 | 0.2% | 669 / 752 |

Reading: the old rule hides a shortfall (recall below target, the scheduler quietly replaced), and it is worse at low touch rates (8% of days below 80% at 0.1 touches a week). Making it fair by counting misses at any time is far worse: one slip in a speed round lapses a stable card, and calm review load rises 46%. Due-only credit is safe but changes almost nothing unless the game deliberately deals due cards. With a game trace as strong as a calm review the old rule looked harmless, so the conclusion rests on game retrieval being weaker than calm retrieval. I believe that but did not measure it.

---

## 3. Specific problems discovered

### Rebuild

**P1. Critical. No backup: 19 months of learning live in one browser's storage.**
Locus: `src/ui/screens/settings.tsx` has "Reset progress…" and no export. The old app had both (`js/settings.js:41` `exportData`, `:57` `importData`, with the warning "nothing is stored anywhere else, so export first").
Consequence: a lost phone, a cleared browser or storage eviction silently ends the course. A learner at month 14 will not restart. `navigator.storage.persist()` is requested in `app.tsx`, and that helps but does not protect against a lost device.
Fix: Export and Import in Settings, one JSON file with learner state, event log, path, UI and game documents, each through its existing migration table. Add a quiet reminder at each band end ("Save a copy of your progress"). This is the first thing to build, before any game.

**P2. High. The only score in the app cannot be compared and cannot be seen.**
Locus: `freeplay.ts:68-71`, `practice.tsx:160-166`.
Evidence: `return \`conjugate:${[...spec.verbs].sort().join(',')}|${[...spec.tenses].sort().join(',')}\`;`. The picker defaults to today's verbs, so the key changes whenever the selection does. The Pickers screen shows no bests. `translate` has a single key across "everything", any unit and any node list, so unlike runs share one number. The count is raw rights, regardless of what was dealt.
Consequence: nearly every verb run says "That is your first score to beat." The old app's rule was right (`games.js:17-19`): the best "has to be visible at the moment you are deciding whether to play".
Fix: scores belong to fixed decks (section 6.4), shown on the tile.

**P3. High. The arcade instinct was lost in free practice.**
Locus: `practice.tsx:152`, `card.tsx` TypeView, `screens/practice.tsx` Pickers.
Evidence: 267 checkboxes on an 8,132 pixel page (section 2.1); two confirmations per right answer; the clock runs through corrections, so reading feedback costs score; each card remounts by `key={card.key}`, and the input is disabled on reveal.
Consequence: the old code records why the last one matters (`gameround.js:124-136`): on iOS "the software keyboard drops when a focused element is removed and will not come back from a programmatic focus()", so "you were tapping the box, waiting for the keyboard, and typing, over and over". I could not test iOS, but the rebuild has the shape that note describes.
Fix: a game round is its own component with one input that never unmounts and resolves the moment the answer is right. Keep Practice as it is for calm work, but cut the verb picker to "Which tenses?" with a sensible verb set.

**P4. High. Contrasts have no second life.**
Locus: `content/bank` (0 of 94 contrast nodes), `content/units` (89 of 94 on one day).
Evidence: section 2.4. `x:saber-conocer`, `x:pero-sino`, `x:cuando-ind-subj` and `x:si-real-unreal` are each taught on a single day. Five contrast nodes have no aligned `forms` at all.
Consequence: contrasts are what learners still get wrong at B2, as the old code observed, and the course mentions most of them once. A review of a contrast node without a bank sentence falls back to the node's own forms. The contrast or curriculum audit should judge the course-side repair. From my side, this is the strongest learning argument for a contrast game.
Fix: Uno u otro (section 6.5), dealt from the scripts, gives every contrast a spaced return without touching the schedule.

**P5. High. No growth over time can be shown, and the data for it is being discarded.**
Locus: `progress.tsx` (no chart, no history), `store/ui.ts:59` "the last 14 days kept", `learner.ts:161` `compact(..., 365, ...)`, `store/ui.ts:53` first read only.
Consequence: the owner's own example, "you read this chapter at 40% in March and now at 95%", cannot be computed. After a year, the events that could reconstruct month one are reduced to counts. Most people stop when progress becomes invisible, and at B1 it does.
Fix: a monthly snapshot document, written on the first open of each month, plus the ability ledger in section 6.9.

**P6. High. Everything the learner writes is thrown away.**
Locus: `blocks/writing.tsx:58-62` stores `at, rubric, words, met, of`. No text. Personal sentences and scene answers are not kept either. The old app kept a journal (`js/write.js`, "so your own Spanish accumulates over time").
Consequence: the most moving evidence of growth a language learner can see, their own Spanish from a year ago beside today's, does not exist. It also rules out the old essay revision loop.
Fix: keep writing text in its own document, capped and exportable. Add "Your writing" under Progress, oldest beside newest.

**P7. Medium. Nothing marks a milestone.**
Locus: `home.tsx:123`, Close. Finishing the entire course says: "You've finished the course. Reviews keep it all fresh." Crossing from A1 to A2 at u14/u15 says nothing, and neither does any of the 593 lessons. The 15 checkpoint days use the copy "A check-in, not an exam", and their results go nowhere (`ui.state.checkpoints` is written only by the any-time check, `practice.tsx:168-171`).
Consequence: a 19-month path with no landmarks. Fix: section 6.9.

**P8. Medium. No return path after absence.**
Locus: Home. After a gap the learner sees "Hola" and whatever the throttle compiled. Silverman and Barasch found that people drop off once a logged streak breaks, and less so if they can repair it. The freeze covers two days at most. Nothing covers week three of a holiday.
Fix: after 7 or more days away, one calm card: what you still have (mean recall across known nodes), a short re-entry session, no mention of the streak.

**P9. Medium. Placed learners lose the story.**
Locus: `home.tsx:133`, `story.tsx:15`. At unit 22 my placed learner's Home says: "Tomás has just landed in Bogotá. You'll read the first chapter soon." The next chapter they meet is ch063, with no recap, and chapters are listed only once seen, so ch001 to ch062 are unreachable.
Consequence: the app's best retention asset is broken for anyone who skips ahead.
Fix: a generated "The story so far" (one authored paragraph per unit, `storyArc` already exists in each unit file) and all earlier chapters unlocked on placement.

**P10. Medium. Saved words are a dead end.**
Locus: `story.tsx:75-84`, `reference/model.ts:147-158`. "Practise saved words" keeps only words that match a graph lexeme, and a nodes drill is exposure only, so a saved word never enters the schedule. A learner cannot add a word from outside the app. The old app could (`js/userwords.js`): words were merged into the review pool.
Consequence: the words a learner cares about most are the only ones the memory model ignores. Fix: section 6.2 verdict.

**P11. Medium. No appeal when the app is wrong, which matters more once a score is at stake.**
Locus: `card.tsx` TypeView. There is no equivalent of old `js/accepted.js`, "eso también vale". The audit memory notes that sentence items "are often marked wrong for synonym or phrasing reasons".
A related hazard runs the other way: in a sample of bank sentences, **`matchTranslation` accepted 95 of 8,747 adjacent word swaps**, and at least 20 of the 70 I read are ungrammatical: `De los papeles me yo ocupo.`, `Si no ella hizo nada malo`, `Te importa Vale si y yo nos sentamos contigo`, `Por qué debes pagar la tú cuenta`, `Pasado tenemos mañana una fiesta`.
Consequence: a word-order game cannot use the matcher, and any score built on free translation will sometimes reject right answers and sometimes reward wrong ones. Fix: speed games use closed answers only. Ordena uses an explicit list of acceptable orders. Any game with a typed sentence gets "That counts too".

**P12. Medium. Reusing the exposure logger for games would swamp the event log.**
Locus: `learner.ts:531-549`. `expose(nodes, {event})` writes one event per node, and a sentence requires 6.9 to 10.7 nodes on average. Twenty-five sentence answers a round, five rounds a day: about 1,100 events a day, about 390,000 inside the 365-day window, on top of lessons. Measured on this machine: 200,000 events is 35 MB of JSON and a 0.7 second `structuredClone`; 500,000 is 88 MB and 3.6 seconds. The log is cloned on every save that has new events and on every `events()` call, which Home makes when a session changes.
Fix: games log on the item's target node only (one or two events per answer, as `nextConjugate` already does), and keep their own compact round table.

**P13. Low. Copy pulls against accuracy.**
Locus: `labels.ts:97` "Speed over perfection." Landers and colleagues' replication found leaderboards lift quantity and not quality. Speed copy should promise the opposite: "Fast, but they have to be right."

**P14. Low. A cold open is slower than a bus stop allows.**
Locus: `app.tsx` boot: 142 content requests before Home. The old build split off a separate arcade for this reason (`arcade.js:4-7`). Fix: add a Play shortcut to the manifest and defer window loading on game entry. Measure on a real phone first.

### Old app defects that must not be ported

| # | Defect | Evidence |
|---|---|---|
| O1 | Blind tapping beats knowing | Section 2.5. Pausing on a correction was right for reading and wrong for the score |
| O2 | The rating falls with no change in skill | Section 2.5 |
| O3 | "El mismo reto para todos" is false | `games.js:338` promises it. The round passes a seed, then dealing depends on the learner's rung, `startRung()` from their level, a one-in-four draw from their own error log (`gameround.js:356`), and due-card preference in `best()` (`gameitems.js:400`). Two players see different questions |
| O4 | Labels misstate the clock | "90 segundos" with `duration: 120000` (`games.js:337, 391`). "60 segundos con eso" with `duration: 90000` (`:541, :716`). "Sesenta segundos" with `duration: 90000` (`:563, :577`) |
| O5 | Hits credited at any time | `S.grade(item.id, true)` moves a Leitner box up whether or not the card was due (`gameround.js:285`, `srs.js:137-139`) |
| O6 | A miss can lapse a card after all | `window.SRS.grade(c.item.id, firstTry)` in Emparejar (`games.js:894`) sends `false`, resetting the box, against the file header's "A MISS NEVER LAPSES THE SRS". The last pair on a board is also free by elimination and still credited |
| O7 | The contrast sentence may not decide | The English appears only on the correction (`gameitems.js:1041`, `note: row.en`). The same auto-gapping on the rebuild's bank gives `Voy a cocinar ___ Vale` (u04-0447), `Tu hija ___ lindísima` (u16-0318), `Esta camisa ___ más barata que esa` (u11-0401), `Los domingos ___ cuatro en la mesa` (u05-0397). In my reading of 32 sampled ser/estar and por/para gaps, about one in five is not decided by the sentence alone. In the same run a loose verb filter produced `Trabajan ___ para pagar el arriendo (duro, duraba)`. That filter was mine and is cruder than the old one, but the risk is general |
| O8 | One right order | `var ok = built.join(' ') === item.answer;` (`gameround.js:706`). "Eso también vale" existed partly to patch this |
| O9 | Emoji-led, Spanish-only, and full of gameshow chrome | Not wrong for its time, but the rebuild's voice rule is better |

---

## 4. What the application does well and must be preserved

**In the rebuild**

- **"From last week, X of Y came back."** This is the model for every number in the app: it reports memory, and attendance cannot move it.
- **The story hooks.** They are real serial fiction. `ch038`: "Vale is back tomorrow at six, and Tomás has promised to be waiting with a coffee. But he walked home soaked to the skin, and by midnight he is shivering." `ch082`: "A letter on behalf of 'the owners' gives the café six months, and nobody knows who owns the other half." Nothing a game does will beat that as a reason to come back tomorrow. Games must borrow from it, not compete with it.
- **The streak's temperament.** It is quiet, earned freezes bridge a gap, and "I need to stop" keeps the day. Add nothing louder.
- **`requires ⊆ known` gating.** It is what makes the games below possible. The old arcade approximated this with CEFR bands and a `ceilingRung` of one band above the learner.
- **The weak-spot rule.** Free-form misses locate a weakness and are never re-served. Games should use it unchanged.
- **"It never changes today's plan."** Games must keep that promise.
- **`Progress` without points** (`progress.tsx:2`). Game scores stay on the Play tab. Only ability measures, such as reading speed, reach Progress.

**From the old arcade, as design knowledge**

| Idea | Source | Why it stays |
|---|---|---|
| Tap the tile and it starts. No setup | `games.js:15-19` | The only decision left is which game |
| The best is on the tile | `games.js:17-19` | Motivation has to be visible at the moment of choosing |
| A typed answer resolves the moment it is right | `gameround.js:21-23` | Most of what makes typing feel fast |
| One input that outlives the question | `gameround.js:124-136` | The keyboard stays up |
| Start at your own level | `gamescore.js:120-134` | Do not charge a toll on every round |
| Accent slip: half value, run kept | `gamescore.js:28-29` | A real error, but not the same error as not knowing |
| Ghost race on the score curve | `gamescore.js:228-236` | "A score you are chasing IN TIME tells you whether you are winning now" |
| Show nothing without enough evidence | `gamescore.js:281-284` | "A number computed from two rounds is noise wearing a decimal point" |
| A streak appears once earned and never warns | `gamescore.js:332-334` | "An observation" rather than "a debt" |
| Natural units | `liga.js:9-14` | The league counted words translated, not points. The best scoring idea in the old app |
| Same fixed dealer for all | `liga.js:24-27` | This is how a true shared seed works, unlike the daily |
| Wrong options are real forms of the same verb | `gameitems.js:26-30` | Every option is Spanish somebody says |
| The rematch, offered with the miss on screen | `gameround.js:870-874` | The moment it lands |
| A tense drill the minute the lesson ends | `games.js:546-552` | "Never harder than in the ten minutes after they are taught" |
| The learner can correct the app | `accepted.js` | Trust |
| A person expecting your message | `report.js:8-10` | "The cheapest accountability there is" |

---

## 5. Missing capabilities

In order of importance to a 19-month learner:

1. Backup and restore (P1).
2. Any history of ability over time: reading speed, look-ups, levels, month against month (P5).
3. A record of the learner's own Spanish (P6).
4. A games layer: rounds with stakes, decks, bests, ghosts, a daily (this report).
5. Sharing of any kind: no share string, no challenge, no "send this to a friend". One line of old-app wisdom lost with `report.js`.
6. Milestones and band transitions (P7).
7. A return path after absence (P8).
8. Story recap and unlocked back-catalogue for placed learners (P9).
9. Personal words in the memory model, including words met outside the app (P10).
10. Spaced practice of contrasts (P4).
11. A way to contest a marking ("That counts too") (P11).
12. Sentence-level speed practice with closed answers. Everything timed today is either a typed form or a free sentence.
13. A measure of reading speed. The data for words per minute exists and is never computed.
14. Offline daily reminders. There are none, which may be deliberate. A generated calendar file is a server-free option worth considering.

---

## 6. Recommended improvements

### 6.1 The evidence, tiered honestly

| Tier | Claim | Source | How far it goes |
|---|---|---|---|
| A: meta-analysis | Gamification has small positive effects: g = .49 cognitive, .36 motivational, .25 behavioural. Only the cognitive effect held up in rigorous studies. Game fiction, and competition combined with collaboration, helped behavioural outcomes | Sailer and Homner 2020 | Permission, not proof. The authors say what makes gamification work is partly unresolved |
| A: meta-analysis, contested | Tangible rewards undermine intrinsic motivation (128 studies) | Deci, Koestner and Ryan 1999. A 2023 thesis finds weaker support | Why no coins, no unlocks, no prizes |
| B: experiment | Increasing time pressure raised fluency more than constant time; accuracy and complexity did not change | Tran and Saito 2021 on 4/3/2. Later work adds accuracy-focused steps | Speaking, not typing. Transfer to typed forms is my inference |
| B: counterpoint | Repetition may matter more than the time squeeze | A task-repetition study in the TBLT series found reuse came from repetition, not pressure | Rerunning the same deck may do more than the clock |
| B: theory with data | Skill acquisition runs declarative, then procedural, then automatic. Practice needs a declarative base, and restriction to familiar items helps | DeKeyser 1997, 2007, 2010; DeKeyser and Criado 2013 | The reason a game must use only what has been taught |
| B: contested measure | Lower reaction-time variability (CV) may signal automatization | Segalowitz and Segalowitz 1993. Hulstijn et al. 2009 found no convincing evidence | Do not claim "automaticity". Report speed and accuracy |
| B: L2 English | Speed reading courses raise rates, by about 50 wpm in one Korean study, and gains may transfer. 250 wpm is a common target for easy text. Many studies do not report comprehension | Chung and Nation 2006 and Tran and Nation, both via secondary sources | Spanish, phones and short rounds are all untested. Comprehension must gate the score |
| B: experiment | Leaderboards act like difficult goals. A 2025 replication: quantity rose, quality did not | Landers, Bauer and Callan 2017 and replication | Every score must have accuracy built in |
| B: experiment | Intact logged streaks raise engagement over broken ones, especially when people blame themselves, and repair weakens the effect | Silverman and Barasch 2023 | Keep freezes. Never display a broken streak |
| B: field study, secondary only | Badges and leaderboards in a course lowered motivation and satisfaction | Hanus and Fox 2015 (I read summaries, not the paper) | Do not bolt rewards onto required work. Keep games voluntary |
| B: theory with data | Games pull through competence, autonomy and relatedness | Ryan, Rigby and Przybylski 2006 | The frame for section 6.9 |
| B: method | Elo-style rating of learner against item is simple, robust and effective | Pelánek 2016 | The fix for O2 |
| B: method | C-tests load on general language proficiency, with strong reliability. The construct is debated | Eckes and Grotjahn 2006, via citing reviews | The monthly yardstick |
| C: company data, correlational or A/B | 7-day streak: 2.4x likelier to return next day (correlational). Streak wager: +14% day 7. One lesson a day extends the streak: +3.3% day 14 | Duolingo blog and staff | Retention, not learning |
| C: absent | I found no rigorous evidence that Duolingo leagues raise learning rather than time | Search result | Do not copy leagues because Duolingo has them |
| D: design analogy | Puzzle Storm: 3 minutes, +1 per puzzle, wrong move costs 10 s and the combo, time bonuses at 5, 12, 20, 30 moves, unrated. Puzzle Streak: rising difficulty, one mistake ends it, one skip | Lichess rules pages | The clock rule below is Storm's |
| D: design analogy | Wordle: same word for everyone, once a day, a grid that brags without spoiling. The grid began with players typing it by hand | Wardle interviews, via press | Basis of El tinto |
| D: design analogy | Monkeytype: speed with accuracy, raw speed and consistency, personal bests per mode, live feedback, no friction | Third-party docs mirrors, not verified on the site | Natural units, bests per fixed mode |
| D: design analogy | GeoGuessr duels turn distance into damage. The ranked number is separate from round score | Wiki-level sources | Skill and a separate long-term level |

Sources are listed at the end of this section.

**What each compelling game actually does, and what to take.** The Tetris row is my own reading. I did not research it.

| Game | What grips people | Take | Leave |
|---|---|---|---|
| Monkeytype | One honest number with accuracy beside it, and restart with no friction | Natural units, bests per fixed mode, instant replay | Its obsession with raw speed |
| Wordle | One shared object a day, scarcity, a grid that brags without spoiling | All of it, in El tinto | Its streak |
| Chess puzzles | A rating every puzzle moves, difficulty that fits, a clock that punishes careless moves | The clock rule, the skip, an anchored rating | Unrated play counted as progress |
| Tetris | Speed rises until you fail, failure is plainly yours, and the next run is one key away | Rising difficulty, failure as information | Endless play with no learning aim |
| GeoGuessr | A score for how close you were, not right or wrong | El tinto's four marks. "Right verb, wrong ending" is closeness | Long rounds |
| Duolingo leagues | Weekly resets and near neighbours | Weekly resets, in a month-against-month ledger | Rank by volume, which is XP by another name |
| Speed reading | A visible rate and a comprehension gate | Both, plus a pacer | Reading faster than understanding allows |

**The fair summary:** gamification is a weak force, and speed practice has real but modest support for fluency and little for accuracy. So games are a retention and automaticity layer around a course. They are not a method of teaching, and a design that sells them as more than that will disappoint.

### 6.2 What the old app had, and what deserves to return

**Games**

| Old game | What it was | Rebuild today | Verdict |
|---|---|---|---|
| Conjugación | 90 s, meaning to form, typed, tense lock | Verb workout, slow | **Return as Relámpago.** The best old game |
| Uno u otro | 60 s, two options, ser/estar, por/para, pasts | Nothing | **Return, rebuilt.** The right idea with a broken score (O1) and unfair items (O7) |
| Reto de hoy | Seeded daily, 90 or 120 s | Nothing | **Return as El tinto,** truly shared |
| Racha | 3 minutes, 3 lives, mixed | Nothing | **Return as La escalera** |
| Supervivencia | One life, per-item clock shrinking from 14 s to 4.5 s | Nothing | **Merge** into La escalera as a hard mode. Its insight is right: "how far can you get" has no ceiling |
| Traducción | 2 minutes, typed under 6 words, chips above | Translate run, no stakes | **Change.** Free translation against a clock tests typing and the checker. Chips return as Ordena, typing as La frase |
| Vocabulario | 90 s, any band | Nothing | **Mostly no.** `anyBand` ignores gating. Words return through Rescate |
| Gramática | 90 s, a grab-bag of 3,000 questions | Nothing | **No.** No identity, no meaning in the score. Replaced by Uno u otro and Simón dice |
| Emparejar | Pairs, growing boards | Nothing | **Low priority.** Real game feel, but elimination does much of the work, and the last pair is free. Possibly a low-floor game for week 1 |
| El/La | Retired by the old app itself | Nothing | **Stay gone.** The old note is right: gender is arbitrary, so a miss teaches one word |
| Escucha | Listening | Nothing | **Stay gone.** Owner decision |
| Liga | Weekly friends' league, Supabase | Nothing | **Keep the ideas, drop the server.** Words as score, ten steps, shared dealer, peer review of claims. Replaced by challenge links |
| Repaso de tiempos | Two minutes every 3 days, chosen by need | Weak spots | **Merge.** A Home line offering a Relámpago deck |
| Ahora con el reloj | Offered at lesson end | Nothing | **Return.** Very cheap, very good |
| La revancha, Mis fallos | Rematch on the end screen; 1 in 4 from own misses | Train it, Practise these now | **Keep** for form items only, per the weak-spot rule |
| Estudio | Flashcards, then the same words as a round | Nothing | **No.** Learn-then-use belongs in the lesson |
| Rating | One number that moves every round | Nothing | **Replace** with the anchored level (6.4) |
| Stats panel | Best, typical, accuracy, pace, best run, band reached, sparkline | Nothing | **Keep,** with its evidence thresholds |
| Quick Play | One button, five plain rules | Quick review | **Keep the pattern:** one recommendation with a true reason |
| Arcade build | A separate app for speed | Nothing | **Not needed.** A manifest shortcut and deferred loading |

**Features**

| Old feature | Rebuild today | Verdict |
|---|---|---|
| Export and import | Nothing | **Bring back now** (P1) |
| Journal (`write.js`) | Nothing, text discarded | **Bring back,** smaller: "Your writing" (P6) |
| Essay runner: plan, draft, model, mark, revise | Draft, model, three-question rubric; no plan phase, no revision | **Bring back the revise loop** for B2 and C1. "A rubric that cannot send you back to the text is a report card" (`essay.js:28-29`) is exactly right, and it suits few and long upper-band lessons |
| User words and capture | Saved words from the reader only | **Bring back.** A learner's own words, entering FSRS as first-class cards, is a strong ownership signal. The strongest non-game feature on this list after backup |
| Error log | `weak.ts`, built from events | **Rebuild's rule is better.** Add the old log's one good habit: a mistake that stops being a mistake disappears, visibly ("Fixed") |
| Report: copy and send | Nothing | **Bring back** as share text. Removing the hard-coded recipient |
| Unit check, "Ponme a prueba" | Placement, any-time check | **Good idea.** A test-out for one week helps placed and returning learners. Not urgent |
| Focus: themed weeks | Goal used once on Home | **Good idea, later.** "I have a trip in three weeks" is the most ordinary reason an adult has. It changes words and passages, not grammar |
| Deep dive and Suggest | Reference with Practise this | **Keep the trigger, not the units.** After four misses, offer the teaching script |
| Accepted | Nothing | **Bring back** in scored games |
| Vetoed | Nothing | Medium. "Stop showing me this" |
| Drills: Conjugación | Verb workout | Have it. Fix the picker |
| Drills: Flashcards | Nothing | **No.** Passive by design |
| Progress heatmap | Nothing | **No.** It rewards attendance. Show ability instead |
| Build marker (`perf.js`) | Nothing | Low, but useful for a PWA in the field |
| Speak | Nothing | **Stay out.** Owner decision |

### 6.3 Reconciling "no XP, no hearts" with high scores

The owner's two statements do not conflict. XP measures time served. A score measures what you can do. The old code said so (`gamescore.js:382-384`), and then its rating failed the test. A claim needs a test, so here is one.

**Five tests every number must pass.** These become automated checks.

1. **The Idle Test.** If you play twice as much and do not improve, does the number rise? If it does, it is XP.
2. **The Guess Test.** Can someone who cannot read Spanish beat someone who can? The old Uno u otro fails: 10,168 to 6,975.
3. **The Repeat Test.** Can you raise it by replaying the same easy thing? If so, it needs a fixed deck or a difficulty anchor.
4. **The Rust Test.** If you stop being able to do it, can the number show that?
5. **The Plain Sentence Test.** Can you say what it means in one sentence? "41 forms in a minute" passes. "8,420 points" does not.

**Allowed:** a score in a natural unit for one fixed deck; a personal best; best today; a ghost of your past self; a level anchored to the course; a shared daily puzzle; a challenge link; strikes inside a single round.

**Banned:** XP, coins, gems; energy or hearts that stop you practising; unlocks earned by grinding; login rewards; a streak for games; league promotion by volume; any message that makes a learner feel behind; any number that rises on attendance.

**One flag for the owner.** La escalera and Simón dice use three strikes within a run. I read "no hearts" as "nothing may stop a person learning", and a strike only ends one optional round. If the owner reads it more strictly, both games work with a shrinking clock instead.

### 6.4 Shared rules for every game

**Fixed decks, not playlists.** A score belongs to a named deck that means the same thing next month: Present, Two pasts, Future and would, Subjunctive, Everything. Por and para, Ser and estar, The two pasts, Mood. A deck appears when its nodes are taught. This fixes P2.

**Natural units.** Forms right, pairs right, words a minute with comprehension, guesses used, weeks climbed. No points. The old `base × speed × combo` formula goes.

**The clock (Storm's rule).** Start at 60 seconds. A right answer scores one. A wrong answer costs time at once, then the clock stops while the correction is on screen, so reading is free and carelessness is not. Five in a row adds 2 seconds. Measured on two-option items, score = rights, 3,000 runs each:

| Wrong answer costs | 90% right, 1.8 s | 90% right, 3 s | 70% right, 2.5 s | 60% right, 2 s | Blind, 0.5 s | Blind, 0.3 s |
|---|---|---|---|---|---|---|
| Nothing, as the old game effectively did | 32.2 | 18.3 | 14.9 | 14.6 | 28.0 | **34.6** |
| 3 s | 27.4 | 16.7 | 11.4 | 9.9 | 11.9 | **12.9** |
| **6 s** | **24.0** | **15.4** | **9.4** | 7.7 | 7.8 | 7.9 |
| 8 s | 22.2 | 14.7 | 8.4 | 6.7 | 6.1 | 6.8 |

(These include 1.2 s of correction time charged to the clock, so with a free correction the penalty should be about 7 s.) At that level blind tapping falls level with a 60% learner and well under a 90% one. Typed items cannot be guessed, so their penalty can be 3 s, and it exists only to reward care.

**The anchored level, replacing the old rating.** Every closed item has a difficulty `b`: the first course week at which it is legal, which is computable from `requires`. Each track holds one number `θ`, in course weeks. After each answer:

```
expected = 1 / (1 + exp((b - θ) / 6))
θ = θ + 1.6 × (outcome - expected)
```

This is Elo in the Pelánek sense, with the course itself as the opponent, so it needs no other players. Simulated: an unchanging learner stays at 30.0 (sd 2.2) after 100, 300, 1,000 and 3,000 answers, with no drift. A learner gaining 10 weeks ends at 40.0. A rating of 30 on a learner who has rusted to 24 recovers to 24.1 in 60 answers, about three rounds. It falls when ability falls. It reads as a plain sentence: "Por and para: playing at week 31", and "That's 6 weeks behind your lessons" is the most useful line a game can say.

**Competition without accounts.**

- **Personal best** per deck, on the tile.
- **Best today,** so an ordinary day has a target.
- **Ghost:** your best run's curve, live ("2 ahead").
- **Tú de marzo:** a ghost of yourself from 30, 90 or 180 days ago. This is the league against your own past, and it is the one race that always shows growth.
- **Daily tiers:** the same puzzle for everyone on the same stretch of the course. Twelve stretches, each with a ceiling (u02, u05, u10, u14, u20, u27, u34, u41, u46, u51, u56, u60), so nobody meets something untaught.
- **Share string:** plain text, no spoilers, no account.
- **Challenge link:** a URL carrying game, deck, seed, tier and score curve. No server: the link is the data. The receiver plays the same items against the sender's ghost. If the receiver has not reached the tier, the app says so kindly and offers to send back a challenge from their own tier.

```
Fluidez tinto 212, tramo 7
4/6
🟦⬜🟩⬜🟨
🟦🟩🟩⬜🟩
🟩🟩🟩🟦🟩
🟩🟩🟩🟩🟩
```

**The end screen contract.** One number. The gap to your best. One diagnosis in plain English. One next action. "Again" has focus, so Enter replays. For example: "23 pairs. Two short of your best. You keep choosing para for 'through'. Por and para: playing at week 31."

**Reactions.** Text and motion, no audio. Numbers count up, a right answer gets a brief flash, a wrong one a shake (`prefers-reduced-motion` respected), and the ghost line moves. Reaction words come from chunks the learner has been taught ("¡Eso!", "Casi", "¡Qué bueno!"), so even the applause is comprehensible input. Simón and Hernando can comment, deterministically, from a small authored table. Sailer and Homner's moderator is game fiction, and the rebuild has a cast.

### 6.5 The games

#### 1. Relámpago (verb forms, speed)

- **Hook:** Sixty seconds. See the meaning, type the form. How many can you get right?
- **Mechanics:** Prompt in English, "they used to live". Type `vivían`. It resolves the instant it is right, with no Enter. The clock rule with a 3 s penalty. An accent slip that changes no meaning counts right but breaks the run; one that changes the form (`hablo`, `habló`) counts wrong. Subjunctive decks use a Spanish frame, `Quiero que ___ (ellos, conocer)`, because English cannot pin the mood.
- **Round:** about 60 to 90 seconds.
- **Scoring:** forms right. Secondary: forms a minute, accuracy.
- **Difficulty:** decks by tense. Within a deck, sample more often the cells that are slow or missed for this learner, from a per-cell table of tense and person. Verbs only from `verbsMet`.
- **Retrieved:** the paradigm cell from meaning, without a label. **Why:** the speed end of skill acquisition on a finite system the learner has been taught.
- **Memory:** exposure on the tense node and verb, as `nextConjugate` does. Feeds weak spots. No FSRS.
- **Competition:** best per deck, ghost, Tú de marzo, challenge link.
- **Not attendance:** a count of rights in a fixed deck. Accuracy is built in by the penalty.
- **Bus stop:** one hand, one minute, the keyboard is already up, and last time you were two short.

#### 2. Uno u otro (hard contrasts)

- **Hook:** Two Spanish sentences, one meaning. Which one says it?
- **Mechanics:** Top line: a meaning, "I did it for your sake." Two buttons: `Lo hice por ti.` and `Lo hice para ti.` Tap. A wrong tap shows the reason from the script. The clock rule with a 7 s penalty and a free correction. Later rungs show a gapped Spanish sentence with the English beneath, then remove the English where the sentence alone decides.
- **Round:** about 60 to 90 seconds.
- **Scoring:** pairs right, plus level per deck.
- **Difficulty:** decks unlock when a contrast is introduced. Rungs: meaning cue, gap with English, gap alone. Dealing leans towards this learner's most-missed sub-rule. Deck "Everything" interleaves.
- **Retrieved:** the decision that separates two real forms. **Why:** this is a decision skill, and learners need it to be fast and repeated. For 89 of 94 contrasts it is the only return they get.
- **Memory:** one exposure on the `x:` node per answer. Feeds weak spots through a new `game` op.
- **Competition:** best per deck, "playing at week N", challenge link.
- **Not attendance:** passes the Guess Test by construction, and the test runs in CI.
- **Bus stop:** two buttons, no keyboard, standing up, one thumb.

#### 3. Ordena (word order and sentence building)

- **Hook:** Build the sentence. A wrong word bounces.
- **Mechanics:** English on top, chips below, tap in order. Each chip is checked against a small tree of acceptable orders, so a wrong chip bounces and costs a second. The sentence on screen is always correct Spanish, so nobody rehearses a wrong order. Clean sentences score double.
- **Round:** 90 seconds.
- **Scoring:** sentences built, clean ones double.
- **Difficulty:** 4 to 9 tokens, then 1 to 3 trap chips (`lo` beside `le`, `es` beside `está`, a wrong person of the same verb), then a typed mode with no chips.
- **Retrieved:** the order rules: clitic before the finite verb, `no` before clitics, adjective after noun, `gustar` frames, question order. **Why:** rigid constraints can be drilled. Free order cannot, so the deck must avoid it.
- **Memory:** exposure on the sentence's target node only.
- **Competition:** best, ghost, challenge link.
- **Not attendance:** bounces make blind tapping slow, and the deck is fixed.
- **Bus stop:** no keyboard, and it feels like a small puzzle.
- **Warning:** do not use `matchTranslation` here (P11), and do not compare strings (O8). Build a deck of sentences whose order a rule decides, with listed alternatives. 8,079 candidates at u14 and 31,865 at u60 leave room to be choosy.

#### 4. De corrido (reading speed and comprehension)

- **Hook:** Read a passage against your past self, then prove you understood it.
- **Mechanics:** A passage from a chapter you read at least a week ago. A soft fade moves down the text at the pace of your ghost, about 5% above your recent best, or read freely in calm mode. Tap Done. Three questions with the text gone. Under two right, the run does not count.
- **Round:** 2 to 3 minutes. One beat at upper bands, a whole chapter at A1. A weekly long run for C1's 1,000-word chapters.
- **Scoring:** words a minute at the comprehension shown. "132 words a minute, 3 of 3."
- **Difficulty:** the text rises with the course. Speed is compared within a band, and only easy text: the chapter's coverage must be full by construction.
- **Retrieved:** word recognition and sentence parsing at speed, with meaning checked. **Why:** the fluency strand, reading known text fast. It is the only game aimed directly at "reads increasingly sophisticated material".
- **Memory:** no FSRS. A deliberate re-read in the ledger, exposure as the lesson re-read does.
- **Competition:** best per band, Tú de marzo as the pacer.
- **Not attendance:** comprehension gates the score, and re-reading the same passage within 30 days does not count.
- **Bus stop:** no typing at all. Eyes only.

#### 5. El tinto (the daily ritual)

- **Hook:** One Spanish sentence a day, six tries, the same for everyone on your stretch of the course. About as long as a small black coffee.
- **Mechanics:** The English, and a blank for each word. You type the whole sentence. Each word comes back marked: right word, right place; **right word, wrong form**; right word, wrong place; not in this sentence. The second mark is the unique bit: the engine knows `comí` and `como` are the same verb, so it can say "right verb, wrong ending", which no ordinary word game can do. If your Spanish is a valid translation, you win, even if it differs from the model, because natural Spanish beats the checker.
- **Round:** 2 to 4 minutes.
- **Scoring:** tries used. Shown as a distribution and a recent average, never a streak.
- **Difficulty:** by stretch.
- **Retrieved:** whole-sentence production, with focused feedback on form after each attempt. **Why:** pushed output plus immediate noticing, on a sentence you have to keep reworking.
- **Memory:** exposure on the sentence's target nodes. No FSRS.
- **Competition:** the share grid. It works between any two people on one stretch, with no accounts.
- **Not attendance:** a daily can be done once, and the number that persists is your average tries, which only rises with skill.
- **Bus stop:** the one thing you do every day before you open anything else. It sits in the story's world: Hernando's morning tinto is the emergency in `ch001`.

#### 6. Simón dice (error hunting)

- **Hook:** Simón the parrot picks up everything he hears, including the mistakes. Is that right? If not, which word?
- **Mechanics:** A sentence. Tap Right or Wrong. If wrong, tap the bad word, and see the fix and the reason. Three strikes.
- **Round:** 2 to 3 minutes.
- **Scoring:** run length.
- **Difficulty:** by the pitfall's node, up to the learner's position.
- **Retrieved:** monitoring against rules, the skill you use when revising writing. **Why:** a different retrieval route, and 2,933 authored wrong/right pairs are already in the scripts.
- **Memory:** exposure on the pitfall's node.
- **Competition:** best run.
- **Not attendance:** finding the wrong word cannot be guessed cheaply.
- **Bus stop:** a parrot, no keyboard. "Simón dice" is Spanish for Simon Says, and the parrot's name is Simón.
- **Warnings:** some pitfalls need context (`Vale está cansado.` is wrong only because Vale is a woman), so a build-time review must filter them. It shows wrong Spanish on purpose, so the owner should approve it.

#### 7. Rescate (the game that grades real cards)

- **Hook:** These are about to slip away. Save them.
- **Mechanics:** Only due cards, most at risk first, each with its recall chance shown as a bar. No clock per item. One attempt, "I don't know" allowed. Afterwards: "Saved 11 of 14. See you in about three weeks."
- **Round:** 3 to 5 minutes, ends when nothing is due.
- **Scoring:** cards saved, once a day by supply.
- **Difficulty:** set by the memory model.
- **Retrieved:** exactly what FSRS says is due. **Why:** real spaced retrieval, with its purpose made visible.
- **Memory:** real FSRS reviews, in the card's own direction, hits and misses both. It is Quick review with stakes on screen, through the existing `planQuick` restricted to due cards.
- **Competition:** none. It should not have any.
- **Not attendance:** no due cards, no game.
- **Bus stop:** the backlog stops being a chore and becomes a rescue. It also replaces the "Waiting for you" line with something to do about it.

#### 8. La escalera (the demanding one)

- **Hook:** Climb every week you have learned. Three strikes. How high?
- **Mechanics:** One closed item per course week, starting from week 1 or 30 weeks back, rising to your position. Three strikes, one skip, per Puzzle Streak. No clock at first. From step 20, a per-item window that tightens, which is the old Supervivencia.
- **Round:** 3 to 8 minutes.
- **Scoring:** highest week reached. Reaching your own position is a clean climb.
- **Difficulty:** the course itself.
- **Retrieved:** all of it, interleaved, in course order. **Why:** cumulative retrieval. A fall at week 17 is a real finding about week 17.
- **Memory:** exposure, and the fall offers a check on that unit.
- **Competition:** best climb, clean climbs, challenge link.
- **Not attendance:** each new week of the course makes it longer and harder.
- **Bus stop:** not really. This is the sofa game, and it gives the app a "more demanding challenge".

#### 9. Remiendo (the monthly yardstick)

- **Hook:** Rosa's letters got wet. Restore the missing letters.
- **Mechanics:** A C-test: a passage with the second half of every second word removed, about 25 gaps. Type to repair. No clock. Offered once a month. Fixed passages per band, retaken after at least three months.
- **Round:** about 5 minutes.
- **Scoring:** gaps repaired, shown against your last score on the same passage.
- **Difficulty:** one set of passages per band.
- **Retrieved:** general language knowledge in context. **Why:** the best-supported cheap proficiency measure I found, and it is text-only, deterministic and scored by exact match.
- **Memory:** none. It is a measurement.
- **Competition:** only with your own past.
- **Not attendance:** rate-limited, and the passage is the same.
- **Bus stop:** no. It is a monthly occasion.

**Availability.** Uno u otro opens at u02 day 8 (`x:tener-estar-states`). Relámpago opens when a tense has been drilled and at least six verbs have been met. El tinto opens when the first stretch is finished. Ordena and Simón dice open by unit 2. La escalera opens after two weeks. A learner in the first week sees a shelf with locked outlines and plain conditions ("After your first week"), which are progress conditions, not grind.

### 6.6 The grading contract with FSRS

The owner's brief says a game round can grade real cards. My simulation says this is true only under strict terms.

1. **Speed games never touch FSRS.** No card state changes. They log compact outcomes to the weak-spot signal and update levels.
2. **A real review requires:** the card is due; the format matches the card's direction, so a tap never credits a productive card; there is no per-item clock; an honest "I don't know" exists; both hits and misses count.
3. **Only Rescate meets those terms.** That is why it exists as a separate game.
4. **Nothing else is exempted.** Hit-only credit is off the table (recall at review fell to 0.887, target 0.90), as is any-time crediting (calm review load up 46%).

These rules fit the existing code. `Freeplay` already separates `quick` (real) from `grind` and `train` (exposure). The contract makes that separation permanent, and a test enforces it by comparing card state before and after a speed round.

A later refinement: fit FSRS weights per learner from the event log, excluding game ops. Retention metrics in `metrics.ts` already read only `scored === 'review'`, so speed games will not contaminate them.

### 6.7 The best four: implementation sketches

**Why these four.** Relámpago needs no content and builds the shell. Uno u otro addresses the course's weakest spot (P4). El tinto is the daily habit and the only social surface. De corrido serves the owner's stated objective most directly and produces the growth curve. Rescate rides along because it is an end screen on code that already exists.

**The shell, shared by all four.**

```
app/src/games/
  types.ts     GameId, DeckId, RoundItem, RoundRow, Dealer
  clock.ts     pure reducer: (state, event) => state. Time is injected, as AppCtx.now is.
  level.ts     the anchored level: update(theta, b, outcome)
  score.ts     natural-unit totals, best and gap, evidence thresholds
  store.ts     GamesStore: its own KV key 'games', versioned, same migration policy as UiStore
  credit.ts    the only place a game writes to the learner (grading contract)
  share.ts     share string; challenge link encode and decode; navigator.share, then clipboard, then a readonly textarea
  decks/       verbs.ts contrast.ts daily.ts reading.ts
app/src/ui/games/
  Board.tsx    the Play tab
  Round.tsx    timer, ghost line, one long-lived input, reaction layer
  Over.tsx     the end screen contract
  Relampago.tsx UnoUOtro.tsx Tinto.tsx Corrido.tsx
```

Why `store.ts` is separate from `UiStore`: `UiStore.update` clones the whole state and writes it on every change. Rounds would accumulate there. `UiStore.reset(extraKeys)` already takes extra keys, so `app.tsx`'s `resetAll` passes `['games']`. Export (P1) includes the document.

```ts
interface GamesDoc {
  version: 1;
  bests: Record<string, { score: number; at: number; curve?: number[] }>; // key: game:deck
  levels: Record<string, { theta: number; n: number }>;                   // key: track
  rounds: RoundRow[];         // compact, newest last, capped at about 3,000
  cells: Record<string, { n: number; ms: number; miss: number }>;         // tense:person
  daily: Record<string, { tier: number; guesses: string[]; solved: boolean }>;
  reading: { at: number; chapter: string; words: number; secs: number; right: number; of: number; taps: number }[];
}
```

Routing: add `{ play: GameSpec; key: number }` to the `Route` union in `app.tsx`, and a `'play'` tab to the tab array. Five tabs already fill a phone, so **Play replaces Settings, and Settings moves to a link on Progress.**

**Relámpago.** Reuses `taughtTenses`, `verbsMet`, `tenseNode` and the `pickCue` logic from `freeplay.ts` (lift `pickCue` into a pure function), plus `conjugate`, `acceptedForms`, `enPhrase`, `personsFor`, `PRODUCTION_PERSONS` from `src/engine`, `checkExact` from `src/check`, and `AccentBar` from `components/answer.tsx`. It does not reuse `CardView`: `Round.tsx` holds one `<input>` with `autoCapitalize="off"` for the whole round and checks on every `onInput`, 0.009 ms a check. New deck definitions map to tense sets. `decks/verbs.ts` weights the cue by the `cells` table. `credit.ts` calls `learner.expose([tenseNode, 'l:verb'], { event: { op: 'grind', ... } })`, the same call as `nextConjugate`, so weak spots light up with no change to `weak.ts`. The end screen's next action is a `PracticeSpec { kind: 'conjugate', ... }` into the existing Practice route. State: `bests`, `levels`, `cells`, `rounds`. Also add the offer at lesson end: when the session's `introduce` day taught a tense, `Close` shows "Sixty seconds on this, now?"

Tests: `tests/games/relampago.test.ts`. Every cue's tense is in `taughtTenses`, every verb in `verbsMet`; the same seed gives the same deal; `learner.toJSON()` card fields are identical before and after a round; deck PB does not change when new verbs arrive. `clock.test.ts` covers the reducer with fake time. A Playwright test plays a round with a scripted answer key and checks the input never loses focus.

**Uno u otro.** Content first. A new tool, `tools/games/contrast-deck.ts`, reads `content/scripts/*.json`, links twin `readAndPick` items by shared options (255 sets, 82 in contrast scripts), turns `yourTurn` gaps and `pitfalls` into items, and writes `content/games/contrast/<node>.json`. Schema, in `src/content/schema.ts`:

```ts
export const ContrastItem = z.object({
  id: z.string(), node: NodeId, rung: z.number().int(),   // 0 meaning cue, 1 gap with English, 2 gap alone
  cue: z.string().optional(), a: z.string(), b: z.string(), answer: z.number().int(),
  why: z.string(), use: z.string().optional(),            // sub-rule, for the end-screen diagnosis
  requires: z.array(NodeId).default([]),                  // computed by the tagger
});
```

Then one burn job per high-value contrast to top up to about 150 items for ser/estar, por/para and the pasts, and about 30 for the rest. Gate checks in `tools/gate/checks.ts`: no dashes, `requires` legal at the contrast's unit, options differ by the contrast only, and the existing per-unit LLM reviewer marks whether the item alone decides the answer. Add `games` to `CONTENT_FILES` in `loader.ts`. The deck is small enough to precache.

`decks/contrast.ts` filters to items whose node is introduced and whose `requires` are in `knownSet`. It deals with `rng(seed)`, leaning to the lowest-level sub-rule. Add `'game'` to `FORM` in `weak.ts`. `Over.tsx` reads `use` to write the diagnosis. `b` for the level comes from the node's unit.

Tests: the **Guess Test** as a real test: simulate a blind 0.3 s tapper against a 70% learner through `clock.ts` and assert the learner wins. Gating property test over random learner positions. Every item's `answer` index is valid. A dealing test for no repeats within a round while the pool lasts.

**El tinto.** A tool, `tools/games/daily-calendar.ts`, builds `content/games/daily/t<NN>.json` for the 12 tiers: bank statements of 5 to 8 unique tokens, legal at the tier's ceiling, no names as the only content, one target node inside the tier, shuffled once with a fixed seed, and append-only. The day's sentence is `list[dayNumber % list.length]`, which is deterministic, has no repeats for the list's length, and survives content growth.

`src/games/frase.ts` is pure: `gradeGuess(guess, target) => Mark[]`, with `Mark = 'hit' | 'form' | 'place' | 'miss'`. It uses `tokenize`, `analyzeToken` for lemmas (`form` when lemmas match and surface differs) and `deaccent`. Win when all marks are `hit` or `matchTranslation(guess, sentence).pass`. In-app marks use shapes as well as colour for colour-blind learners. The date key is the local calendar day. Share through `share.ts`. `Tinto.tsx` uses a normal `AnswerField`, because this is calm typing. State: `daily`. On Home, one line appears when today's is unplayed, and it is not a nag: it disappears when dismissed for the day.

Tests: a table of `gradeGuess` cases including `comí`/`como`, accent-only differences, repeated words and reordered words. A full-calendar test: every tier's list passes `requires ⊆ known at ceiling` and has no dashes. Determinism: same date, same tier, same sentence. Share string contains no spoiler text and no dash. Copy passes `tests/ui/copy.test.ts`, which already scans `src/ui`.

**De corrido.** Reuses `splitBeats`, `sentencesOf`, `wordCount`, `Passage` from `blocks/read.tsx` (export it), `useGloss`, and `questionCard`. `decks/reading.ts` picks a chapter with `learner.ledger.hasSeen('chapter', id)`, read 7 or more days ago, not used by the game in the last 30 days, and takes `rereadQuestions` (655 exist), falling back to `questions`. At upper bands it picks a beat via `splitBeats`. `Corrido.tsx` runs a CSS fade driven by a words-per-second value. It stores a `reading` row, including `taps` from `useGloss`. It calls `ledger.markSeen('chapter', id, { deliberate: true, reason: 'game' })`, and `credit.ts` logs comprehension through the same path as `logComprehension`.

A small change has value even before the game: in `blocks/read.tsx`, count taps and append a row for each read, replacing the first-read-only `readSeconds`. Then every lesson read also feeds the curve. This is the owner's own example made real: "March: 1:52, 14 words looked up. Today: 1:05, 2 words."

Tests: the WPM calculation; a run under the comprehension gate does not set a best; same-passage repeats within 30 days do not count; the pacer's rate is derived from `reading` rows only.

### 6.8 Where it lives, and how games stay in their place

- **Play tab:** one card for El tinto, then the one recommendation with a true reason, in Quick Play's order: due cards to save, today's tinto, a weak spot, a near miss on a best, otherwise the game played least. Then tiles, each with its best.
- **Lesson first, without a lock.** While today's lesson is unfinished, the top of the Play tab is the lesson. Autonomy matters more than a gate, and Hanus and Fox are a warning against compulsion.
- **Home stays calm.** One line after the lesson: the recommendation. No shelf on Home.
- **Games never advance the path, never count for the streak, and never appear in lesson minutes.**
- **Cold open.** A manifest shortcut to Play. Boot the learner and engine first, and defer the window of unit content for a Relámpago start. Test on a real mid-range phone.

### 6.9 Motivation over 19 months

**What brings a person back on day 400 is not a game.** It is wanting to know what happens at the café, feeling that their Spanish works, and not wanting to lose what they have built. Self-determination theory names the same three things: competence, autonomy, relatedness. Here is the plan by timescale.

**Daily: story and ritual.** Keep the hooks. Add El tinto. Add a small "next chapter in two lessons" line to Home, because the story is the app's strongest pull and Home currently shows only the past.

**Weekly: the week map, already good.** Add a Sunday line: "This week: reading 4 words a minute faster, por and para up 2 weeks." Only if evidence exists. Otherwise nothing.

**Monthly: the ledger.** On the first open of each month, write a snapshot and show one card:

```
October
Reading: 118 words a minute, up from 104
Things you could recall today: 2,314
Verbs: 31 forms a minute, up from 24
Por and para: week 31, your lessons are at week 37
Rosa's letter: 16 of 25, up from 11 in July
```

Snapshot fields: month, retained (sum of recall across known nodes, from `learner.retrievability`), learned count, reading speed, levels, and yardstick score. It costs almost nothing and must start now, because **data not captured today cannot be charted later.** Capture first, display later: read rows with taps, writing text, monthly snapshots.

**"Things you could recall today."** A number that falls while you are away and recovers when you review. It fails the Idle Test in the right direction: time alone lowers it. It is the honest alternative to "words learned", which only rises.

**Visible growth.** Three devices, all in Progress:

1. **Same text, then and now.** Any re-read shows every earlier read, with time and look-ups.
2. **Your writing.** Oldest piece beside newest.
3. **The last chapter.** From week 1, the app can say how much of the final chapter you could already read: "You'd look up about one word in three." It rises smoothly (section 2.4) to about one in twenty by u34. Weight it by recall so it stays honest, and it becomes a long ladder you can see from the bottom.

**Milestones that mean something.** Each states what you can now do, with evidence. Never "you opened the app 100 times."

- First chapter read with no look-ups.
- First 100 words a minute with full comprehension.
- 1,000, then 2,000, then 3,000 things you could recall today.
- A week of the course where everything came back.
- First piece of writing over 100 words, then 200, shown back to you.
- Every contrast deck above your own lesson position.
- **Band letters.** At the end of each band, a letter from a character, written with exactly that band's Spanish, with no glosses. Three questions. It is a test disguised as a gift, and passing it is the ceremony. Five authored letters through the burn. "Vale wrote to you. You can read this now."

**Bands as seasons.** The story already has arcs in `storyArc`. Give each band a title card at its start and a recap at its end. Television learned this long ago: a 19-month serial is easier to stay with in seasons.

**The plateau.** B1 lasts 14 units. New grammar feels smaller, and gains go invisible. This is when the ledger, Tú de marzo and reading speed earn their keep. It is also when a learner most needs to feel Spanish working, so offer harder reading as a choice, not a schedule.

**Absence.** After a week or more away: "Welcome back. You still have about 84% of what you knew." A short re-entry session. No streak mention. The freeze stays. Silverman and Barasch suggest not dwelling on the break, and offering a repair weakens the damage. A return without blame is the design that follows.

**Other people.** The share string, the challenge link and the old report's plain text. "A person who is expecting your message is the cheapest accountability there is." Sailer and Homner's other moderator was competition combined with collaboration. One cheap form: two friends' tintos count together towards a shared week.

**Ownership.** Personal words in the schedule, Your writing, Backup. People keep what they feel is theirs.

**What not to do.** No push notifications built on loss. No streak society, no leagues by volume, no celebrations for showing up. If a reminder is ever added, it should carry the story's hook, not a warning.

**Sources for section 6.1**

- [Sailer and Homner, The gamification of learning: a meta-analysis](https://link.springer.com/article/10.1007/s10648-019-09498-w)
- [Deci, Koestner and Ryan 1999](https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf); [2023 thesis questioning the effect](https://utupub.fi/handle/10024/173853)
- [Ryan, Rigby and Przybylski 2006](https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf)
- [Hanus and Fox 2015, summarised in a systematic review](https://doi.org/10.15359/ree.26-1.14)
- [Landers, Bauer and Callan, leaderboards as goal setting](https://experts.umn.edu/en/publications/gamification-of-task-performance-with-leaderboards-a-goal-setting/); [replication on quantity and quality](https://www.muni.cz/en/research/publications/2495997)
- [Silverman and Barasch, On or Off Track](https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb); [CU Boulder coverage](https://www.colorado.edu/business/news/2023/04/20/research-streaks-marketing-tech-barasch)
- [Tran and Saito 2021 on 4/3/2](https://discovery.ucl.ac.uk/10128571/1/LTR2021.pdf); [task repetition chapter](https://www.degruyterbrill.com/document/doi/10.1075/tblt.11.02jon/pdf)
- [DeKeyser and Criado on automatization and practice](https://digitum.um.es/digitum/bitstream/10201/142072/1/DeKeyser%20and%20Criado_Automatization_Skill%20Acquisition%20and%20Practice%20in%20Second%20Language%20Acquisition_2013.pdf)
- [Segalowitz and Segalowitz line of work](https://cambridge.org/core/journals/applied-psycholinguistics/article/assessing-the-development-of-automaticity-in-second-language-word-recognition/58465581E3C8C24144D881FD8F1ACD52); [Hulstijn et al. 2009](https://www.cambridge.org/core/journals/applied-psycholinguistics/article/automatization-in-second-language-acquisition-what-does-the-coefficient-of-variation-tell-us/554D00B8D979BD1CFF17774087D14326)
- [Speed reading review citing Chung and Nation](https://jfs.ulis.vnu.edu.vn/index.php/fs/article/view/5122); [Macalister on authentic texts](https://scholarspace.manoa.hawaii.edu/items/5e8ccae9-2c47-4614-9877-3dae5c7810ad); [Tran, speed reading and transfer](https://e-flt.nus.edu.sg/wp-content/uploads/tran.pdf)
- [Pelánek 2016, Elo in adaptive educational systems](https://www.fi.muni.cz/~xpelanek/publications/CAE-elo.pdf)
- [Eckes on C-tests](https://shop.deutsch-uni.com/gast/ondaf/info/dokumente/Eckes_onDaF_2010.pdf); [2026 systematic review of C-test studies](https://awej.org/toward-methodological-coherence-in-c-test-studies-a-systematic-review-of-scoring-validation-and-measurement-practices/)
- [Duolingo on streaks](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/); [Improving the streak](https://blog.duolingo.com/improving-the-streak); [Duolingo experiments](https://blog.duolingo.com/improving-duolingo-one-experiment-at-a-time)
- [Lichess Puzzle Storm rules](https://lichess.org/page/storm); [Puzzle Streak](https://lichess.org/streak)
- [Wardle on Wordle, NPR transcript](https://www.npr.org/transcripts/1072980440); [The New York Times story via Boston.com](https://www.boston.com/news/national-news/2022/01/04/he-made-wordle-for-his-partner-now-its-an-online-hit/)
- [Monkeytype docs mirror](https://mintlify.com/monkeytypegame/monkeytype/quickstart); [GeoGuessr duels](https://strategywiki.org/wiki/Geoguessr/Gameplay)

---

## 7. Uncertainties and limitations

**What I did not inspect.**

- `js/drills.js`, `report.js`, `unitcheck.js`, `userwords.js`, `study.js`, `deepdive.js`, `progress.js`, `selector.js`, `focus.js` and the others listed in section 1 past their header comments. My verdicts on them rest on those headers. `tools/test-arcade.js` was read only at the top. `css/` not read. `server/league.sql` not read.
- The old arcade was never played live. Its behaviour comes from code and simulations. Those simulations model the real functions but assume a tap time distribution.
- `js/errorlog.js`, `js/settings.js`, `js/srs.js`: relevant parts only.
- `content/scenes` and `content/writing` were not sampled for games. Scene turns may make a good game; I did not assess it.
- Pitfall items: I read a handful. I do not know what share need context to be wrong. Contrast items: I read three scripts in detail.
- `src/ui/blocks/scene.tsx`, `writing.tsx`, `teach.tsx`: only the relevant parts.

**What I could not measure.**

- **No real phone.** Every timing is on a desktop-class machine. Boot, keyboard behaviour on iOS, and typing speed are all estimates. P3's keyboard point comes from the old code's note and the shape of the new code, not a test on an iPhone.
- **No real players.** The app has no analytics, so nothing here can be A/B tested, and there is no way to learn whether any game retains anyone except by watching a few people play. All engagement claims are design judgement.
- **The FSRS simulation** rests on an assumed trace strength for game retrieval, and on using FSRS itself as "true memory". The ordering of policies looks stable across the rates I tried. The exact numbers should not be quoted as findings about people. With traces as strong as calm reviews, the old rule looked harmless.
- **The anchored level** assumes difficulty tracks course position. It will not do so exactly: a late sentence may be easy, and the requirement list says when an item is legal, not how hard it is. The update constants (1.6 and 6) came from simulation on the model's own terms. They need tuning on real answers. Item-level difficulty could be learned per device, but there is no population.
- **Scoring tables** assume independent answers and a fixed tap time.
- **Chapter coverage** maps 89 to 93% of tokens by rough lemma lookup and treats "taught" as "known". Real readable coverage is lower for a learner who forgets.
- **"About one in five gaps is undecided"** is my own judgement on 32 items, not a measure.

**Evidence limits.** Several sources were read only through abstracts or secondary summaries, flagged in 6.1: Hanus and Fox, Chung and Nation, Eckes and Grotjahn, Tran and Saito. The Tran and Saito PDF did not parse, so I rely on search summaries. I could not verify the 4/3/2 results against the paper. Nearly all of the speed reading research is on English. I found no evidence on typed verb-form sprints specifically, nor on Wordle-like production puzzles for language learning. El tinto is a design bet.

**Limits caused by standing decisions.** No listening means no reaction-time training on heard forms, the strongest natural fluency game there is. No AI means free production can't be scored, which keeps speed games to closed answers. Neither should change. Dialect decisions fit well: decks use Latin American forms and accept Peninsular ones.

**Decisions the owner needs to make.**

1. Are three strikes inside an optional run acceptable under "no hearts"?
2. May a game show wrong Spanish on purpose (Simón dice)?
3. May Play replace Settings as a tab?
4. Should El tinto count for the streak? I recommend not.
5. Is sharing a public link acceptable? A challenge link reveals only a score curve and a first name if given.
6. Does the friends' Liga matter enough to keep a server for it? I assumed not, per this brief.
7. Should game names be Spanish, as proposed? The UI is English, and I think Spanish names are a small daily pleasure.

---

## 8. Suggested implementation priorities

Sizes assume subagent implementation with review, per the owner's normal way of working: S is about a day, M a few days, L a week or two.

**Phase 0: protect what exists, and start capturing. Do this first, before any game.**

| Item | Size |
|---|---|
| Export and import (P1) | M |
| Keep writing text; "Your writing" list (P6) | S |
| Reading rows with look-ups, replacing first-read-only `readSeconds` | S |
| Monthly snapshot document, silent at first (P5) | S |
| Placed learners: story recap and unlocked earlier chapters (P9) | M |

**Phase 1: the shell and the first game.**

| Item | Size |
|---|---|
| `src/games` shell, Play tab, `clock.ts`, `level.ts`, `store.ts`, `credit.ts` | M |
| Relámpago with decks, ghost and end screen | M |
| The lesson-end offer, "Sixty seconds on this, now?" | S |
| Rescate, on `planQuick` | S |
| CI tests for the Five Tests | S |

**Phase 2: contrasts.**

| Item | Size |
|---|---|
| Contrast deck tool, schema, gate checks | M |
| Burn job for top-ups and "the item decides" review | M, mostly compute |
| Uno u otro | M |

**Phase 3: the daily and other people.**

| Item | Size |
|---|---|
| Calendar tool and 12 tier lists | S |
| `frase.ts` and El tinto | M |
| Share string and challenge links | M |

**Phase 4: reading and the ledger.**

| Item | Size |
|---|---|
| De corrido | M |
| Monthly card, growth views in Progress | M |
| Milestones, return card, "next chapter" line | M |
| Band letters and season cards | M, content |

**Phase 5: the rest.**

| Item | Size |
|---|---|
| Ordena, with its own deck tool | L |
| Simón dice, with pitfall review | M |
| La escalera | M |
| Remiendo | M |
| Personal words in FSRS | M |
| Essay revise loop for B2 and C1 | M |
| "That counts too" | S |

**How to tell whether it worked.** There is no telemetry, so use these on-device, owner-visible signals:

- Reading speed at equal comprehension rises month on month.
- Levels for the five big contrasts stay within a few weeks of lesson position.
- Delayed recall on Progress does not fall, and calm review load stays flat, which proves games have not damaged the schedule.
- Lessons per week do not fall after Play ships. If they do, games are eating the course, and they should move further down the app.

The last of these matters most. If games raise play and lower lessons, they have failed, however good they feel.
