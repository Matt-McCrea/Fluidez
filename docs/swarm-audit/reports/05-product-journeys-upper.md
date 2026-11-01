# 05. Product and learner experience: upper-level journeys and the whole product surface

Audit date 2026-11-01, branch `rebuild`, dev server with real content (`?fixtures=0`). Raw transcripts: `/private/tmp/claude-501/-Users-Matthew-Fluidez/40ef6734-a9c2-4284-b528-c9cc038164e6/scratchpad/p05/` (`transcript-7102.log`, `transcript-7121.log`, `transcript-7122.log`, `transcript-7123.log`, plus per-session files and the throwaway scripts). Screenshots: `app/tools/playtest/.runs/shots/<profile>/`.

Verdict in one paragraph: the lower-level design (a story, a ladder of exercises, a resumable session, a deterministic plan) is sound, and the best surfaces (reader glosses, scenes, the por/para reference page) are genuinely good. For anyone who is not a true beginner on a steady daily habit, the product falls apart at the joins. Placement cannot measure what it claims and sends learners with holes to week 44 or week 60. The story and library break after a fresh app open. Advanced learners are graded on matching one string, and 41 of 47 valid alternatives I tried were rejected, often with a false reason. The weak-spots system sees the por/para problem, then sends the learner to a verb drill or to "week 165". A learner who is away for 25 days comes back to "Quick warm-up, 1 of 490". The app currently keeps a B1+ learner neither accurate nor interested, and tells them they have succeeded anyway.

---

## 1. What was investigated

Four real browser learners, driven with `tools/playtest/serve.mjs`:

| Profile | Port | Setup | Reached |
|---|---|---|---|
| `upper` | 7102, phone | Self-rated Advanced, answered all 21 check items right | Placed week 60; played all 10 lessons of week 60; course finished; day after; Look up; Progress; Settings; checkpoint |
| `mid` | 7121, phone | Self-rated Intermediate, right on tense items, "I don't know" on the mood items | Placed week 44; 3 lessons, reader, More practice, Translate, reload, back button |
| `pp` | 7122, phone | Self-rated "A bit", placement steered with an auto-solver to land on week 18, where por/para is taught | 6 days of deliberate por/para errors (persona: swaps por and para in typed answers, picks the wrong reading in "Read and pick"); weak spots; Train it; 25 day absence |
| `desk` | 7123, 1280 px | Self-rated Intermediate, placed week 32 | Desktop layout, keyboard, long input, English input, Quick review, leave dialog |

Headless evidence: `render.ts` at units 8, 20, 35, 45, 58 (three days each, read as card statistics, with week 58 read line by line for one day). Measurement scripts: `probe-sim.ts` (120 placement runs), `para.ts` (47 valid alternatives through the real `sentenceCheck`), `weaksim.ts`, `win.ts` (what a fresh load holds), `chunk-pairs.ts`, plus bank, script, writing and lexeme counts.

Band first weeks, measured from the course: A1 week 1, A2 week 15, B1 week 28, B2 week 42, C1 week 52.

---

## 2. Evidence from the actual application

### Learner 1, intermediate with significant weaknesses

Rated "Intermediate". Items seen, all multiple choice: which sentence "already happened" (4 times), which is "about now" (4 times), "which form fits" with the tense printed in the English (`Hernando's car is from the nineties. (ser)`: soy, es, son). Two items touched mood, and I answered "I don't know" to both. No item tested por/para, ser versus estar, or preterite versus imperfect. Result: "You'll start at week 44. Making the case" (`shots/mid/004-placed-mid.png`). Week 44's first lesson is concessive subjunctive, built on the subjunctive this learner just said they do not know.

The next screen says "The weeks before it count as known." There is no way of telling the app "this is too hard", and no way back other than Reset. Day 4 of this learner's life in the app opens with "Quick warm-up, 1 of 51".

### Learner 2, por and para

Day 1, week 18, the lesson teaches por/para well. Six days of persona errors followed. In order:

- The checker notices. A typed "Vale mandó la foto para mensaje." gets "Not yet. Por or para? Check that little word." (`shots/pp/003-pp-wrong1.png`). Good.
- On reveal the reason is "Here is how Spanish says it." Nothing about "by means of".
- The weak-spots screen notices: "For and by, part 1: para (destination, purpose, deadline) vs por (through, because of, per), missed 31 of 36". It also lists "Preterite, missed 15 of 15", "Present, missed 14 of 26", "Every noun is el or la, missed 22 of 39", "to do / to make, missed 4 of 4". Those are false: the persona's verbs and articles were right. A whole-sentence miss is charged to every grammar node in the sentence.
- Train it on por/para opens a three-card "workout". Card 1: `Atención, por favor: el bus a Medellín ___ por la puerta cuatro. (salir)`, options sales, salía, sale, salimos. The por is already printed; the learner is tested on salir (`shots/pp/002-train-pp.png`).
- Train it on "por or para?", the actual contrast node: "Not yet. por or para?: a workout. The examples for this use things you have not met yet. It comes up in week 165." (`shots/pp/005-week-165.png`). The course has 60 weeks.
- Nothing changes about what comes next. With 31 of 36 misses the plan went "New: commands with the little words", "Practice: commands", then "Story time". I saw no "tricky ones" block on those days, but my persona logs record cards rather than every block heading, so treat that as unconfirmed. `withRemediate` is called only from the self-check and the reading check, never from repeated misses.

For preterite versus imperfect I confirmed by direct call (`weaksim.ts`): misses on `g:pret-vs-imperfect` produce two spots, "Preterite: a workout" and "Imperfect: a workout", each `{ kind: 'conjugate' }`. Live, "Preterite: a workout" opened with "Type the form (valer, tú, the past), you were worth". A learner who knows every form and chooses the wrong aspect is sent to drill forms. The live hint for that error on a Translate card is "Check the verb ending: when does it happen?", and both tenses happen in the past, so this does not help either.

### Learner 3, advanced

Self-rated Advanced, 21 of 21 right, "You'll start at week 60. A critical voice" (`shots/upper/004-placed2.png`). None of the 21 items required more than recognising present, past or future, person or number, or an aunque contrast. What the real C1 learner then got on day 1:

- Lesson 1 is labelled "Story time: Hola, Bogotá" (`shots/upper/005-home-day1.png`). After more than 70 taps of drilling phrases, the story is the first A1 chapter: `Vale: Buenos días. ¿Usted es turista?`. Quiz: "What does Don Hernando want when he knocks?" Then it asks for a fluency re-read of the same A1 text: "Same story, a little faster."
- New-word cards at week 60: la creatividad, la armonía, la pirámide, la perfección, el traje, chupar. Card: `la creatividad`, options twenty-one, to turn on, creativity. No way to say "I know this". On the Story lesson, about 135 taps passed before the chapter.
- Typed valid paraphrases are rejected: "Durante esta charla veremos tres casos." and "A lo largo de esta charla vamos a ver tres casos." for "Over the course of this talk we'll look at three cases." Result: "Here's the right version".
- The C1 grammar lesson on fronting has a two-sentence explanation. The prompt "How do you say this in Spanish? I've learned a lot here." expects "Mucho he aprendido aquí." with no cue that fronting is wanted, so "He aprendido mucho aquí" cannot be right there.
- The writing task accepted 212 words of `Yo gato al tiempo que perro. Cuanto más mesa, más silla. ... the cat sat on the mat...` with three of four ticks (`shots/upper/017-writing-gibberish.png`).
- Scenes end "They understood you. 0 of 5 replies landed first time, and you fixed the rest." after five replies of "no sé".
- Check-in "Yes, I can". Ten lessons played in one sitting. Then: "You've finished the course. Reviews keep it all fresh." (`shots/upper/020-course-finished.png`). Progress shows 60 can-do ticks, including "I can write a sustained argumentative essay and defend it", and "Words and phrases that have stuck 2519".

The real challenge exists in the week 58 drill day: 77 cards, 47 typed, sentences such as "The closer the date gets, the less I can sleep." That content is good. The grading of it (finding C3) is what wastes it.

### Learner 4, an hour of absorbing work

"Do another" is uncapped except by the review backlog: `upper` did 10 lessons in a sitting and consumed the whole week. It does not run dry until the course ends, so quantity is not the problem. Three things are:

1. Every "another" is the same machine: warm-up, new-word ladder, teach or drill, close. Rendered sessions run 37 to 77 cards. I counted 6 to 19 repeated prompts per session at weeks 45 and 58, with the same sentence up to 6 times (week 20 drill day).
2. You cannot just read. The reader is the most absorbing thing in the app, and there is no "next chapter". The Story tab lists only chapters already read (`story.tsx`: `unlocked = chapters.filter(hasSeen)`). Home's story card offers only "Read again". A chapter comes only inside a lesson, behind the drilling, and in the placed learner's case at the wrong level.
3. "The regular lesson plus extra reading" adds isolated bank sentences (`compile.ts` `extraReading`, `pickFromUnit`), not connected text.

After the course: "Catch-up mix", a warm-up of 32 and nothing else. In the `upper` case 215 of 219 chapters unread, and no route to them.

### Surfaces and break tests

| Test | Result |
|---|---|
| Correct answer | Good, fast |
| Wrong answer | One retry with a hint, then reveal. Sound design |
| Incomplete answer | "Not yet. A word is missing." fine, though it fires on paraphrases too |
| Empty input | Check disabled, Enter does nothing. Good |
| 7,200 character input | Handled, "Not yet. Have another look", then "You wrote:" prints it all |
| English in a Spanish field | Treated as wrong, no "that's English" message on translate cards (scenes have one) |
| Accent omitted | One accent: "Check the accents." with a retry. `tu` for `tú`: "There's an extra word: tu", which is false |
| Triple tap on Continue | No crash |
| Reload mid-card | Excellent: "Pick up where you left off", returns to the exact card |
| Leave and resume same day | Good. Next calendar day: silently gone, even at 230 steps in (`isResumable` requires same day, 3 hours) |
| Browser back | Leaves the app. `history.back()` went to about:blank from a card |
| Offline during onboarding | B2 claim silently checks week 1 items ("Mi amiga tiene frío en el parque."). No crash, no message. Service-worker offline was not tested |
| Keyboard, 1280 px | Everything reachable with Tab, Enter advances. No number-key answers, first option not focused |
| Contrast | Measured 5.5 to 6.1:1 on secondary text. Passes. Dark mode rule exists, landmarks present. No `h1` on any screen, only `h2` |
| Fonts on phone | Comfortable |

Look up, tested on a learner with everything marked known (`upper`):

| Query | Result |
|---|---|
| anduve, cupiera, quepa, estuvieras, hablaría, habrá | Excellent: "cupiera is imperfect subjunctive (if only), yo; or ... él / ella / usted", full table, Practise this verb |
| fuese, dijese, cantase | Verbs (0). The -se forms taught in C1 are not in the verb index |
| dándomelo | "No verb found" |
| if only, wish, ojala, sin embargo, hubiera | Good |
| preterite, conditional, pluperfect, gerund, passive, relative clause, reported speech, imperfect subjunctive, future perfect, preterito | "Nothing you have met matches that." |
| subjunctive | 2 results, neither one the subjunctive |
| past perfect | 2 results, both about the imperfect |
| difference between ser and estar, nevertheless | Nothing |

---

## 3. Specific problems discovered

### Critical

**C1. Placement does not measure upper-level knowledge and over-places by weeks to years of study.**
Locus: `src/ui/session/placement.ts` (`itemsFor`, `ladder`, `result`), `exercises/input.ts`, `screens/onboarding.tsx`.
Evidence, measured over 40 all-right runs starting at B1 (920 items): verb-form-with-English 440, tense identification 393, mood 27, number 30, person 16, por/para 6, clitic 5, gender 2, ser/estar 1. So 91% are tense or form, 0.65% are por/para and 0.1% are ser/estar. In the "choose" kind the English gives the tense away: `Para Tomás, el patio ___ imprescindible. For Tomás, the courtyard is essential. (ser)`, options era, somos, es.
At C1 levels the check asks `Which one is about just one?`. A simulated shallow learner (right only on tense, number, person, gender, choose and question items) placed at: claims A2, median week 1; claims B1, median week 31 (range 1 to 47); claims B2, median week 57 (range 43 to 60). The same knowledge gets three different lives depending on one self-rating tap.
Bad items seen live: `Gracias a este dispositivo, trabajo desde cualquier ___. (partir)` with options partía, partimos, parte (the noun parte, tagged as the verb). `Esas frases me traen recuerdos de Rosa, como si ella misma me la dijese al oído.` (broken distractor, should be "las"). `Which one is about now? La boda ... va a tener lugar en Medellín.` (this is a future). `(negociar, usted)` on impersonal se. `I'm just thinking about Rosa. (polite)` on a yo sentence.
Consequence: a B1 learner with holes skips 43 weeks of the grammar they most need, on recognition evidence, and everything after assumes it. The strongest honest learner loses the whole course: 59 weeks are written off and week 60 lasts one day.
Fix, strongest version: (1) Replace the item source. For each band, hand-tagged discriminating items built from the contrast and grammar scripts: ser/estar, por/para, preterite/imperfect, subjunctive triggers, relatives, clitics, with no tense in the English. (2) Add 6 to 8 typed production sentences to the check, scored by the translation matcher with a wide accept set. (3) Place by skill, not by unit: failed skills stay un-seeded and go on the remediation list, so a learner can start at week 30 with por/para still owed. (4) Make the ceiling honest: reach week 60 only by passing C1 items, and treat "Advanced" as a start point, never a score. (5) Treat placement as provisional: the first five lessons are a calibration, with a visible "This is too hard" and "This is too easy" that move the learner. Cost: medium to large, mostly content plus a day of plumbing.

**C2. Coming back after a break meets a 490-card "Quick warm-up".**
Locus: `src/ui/blocks/practice.tsx` `ReviewRun` ("the warm-up is never cut short"), `compile.ts` `warmupStd`, `labels.ts`.
Evidence: `pp` after 25 days: Home "Hola", "New words, in a story, About 24 minutes", no mention of the gap. Tap Start: "Quick warm-up. A few things from the last few days. Just remember them. 1 of 490", header "About 24 minutes left" (`shots/pp/007-warmup-490.png`). The estimate is impossible: 490 typed or chosen cards in 24 minutes is 3 seconds each. Placed learners hit this earlier without any break: 47 cards on `pp` day 6, 51 on `mid` day 4, all "Quick".
Consequence: this is the moment of highest churn risk in a 19-month product, and the app greets it with its worst screen and three false statements (quick, few, last few days).
Fix: cap the warm-up at the budget in card count, not only in minutes, choosing the highest-value cards. Spread the rest. Add a re-entry state: "Welcome back. It's been 25 days." A short session of the most useful material, one chapter recap, then resume. Never show a card count above about 30. Cost: small to medium.

**C3. The checker grades advanced learners on matching one string.**
Locus: `src/check/translate/*`, `cards.ts` `sentenceCheck`, bank `accept` field (1,014 of 72,693 sentences, 1.4%).
Evidence: 47 valid alternatives through the real card check: 6 pass, 41 fail. List in `scratchpad/p05/para.ts`. All are natural Spanish a strong learner might write. Some of the failures:

| Expected | Valid answer typed | App says |
|---|---|---|
| Si el abogado hubiera llegado... | Si el abogado **hubiese** llegado... | Check the verb ending: when does it happen? |
| ...el juez nos habría escuchado | ...el juez nos **hubiera** escuchado | Check the verb ending: when does it happen? |
| Me conformo con lo que tengo, aunque sea poco. | Aunque sea poco, me conformo con lo que tengo. | Right words, different order |
| De todas formas, gracias... | De todos modos, gracias... | Check the ending: it has to agree |
| Estará en el centro con su fuente. | Debe de estar en el centro... | There's an extra word: "debe" |
| Terminada la reunión, Tomás se fue a casa. | Cuando terminó la reunión, Tomás se fue a casa. | There's an extra word: "cuando" |
| ¿Qué cargo tenía...? | ¿Qué puesto tenía...? | "puesto" isn't the word here, check the meaning |
| Fue Mariana quien tuvo la idea | Fue Mariana la que tuvo la idea | There's an extra word: "la" |
| A Hernando le da vergüenza... | A Hernando le da pena... (the Colombian form) | "pena" isn't the word here |

The first row is the C1 form the course teaches in `g:` "The other if only form: hubiese, fuese, tuviese".
Consequence: at high levels the right answer space is large, so the failure rate of good answers rises with proficiency. The hint then teaches something false ("check the ending") and the learner is graded Again, which pollutes FSRS and the weak-spots list. An advanced learner stops trusting the app within a session. Some of these would be fair if the card's point were one structure, but then the card must say so.
Fix, in three parts: (1) Build time: generate and gate an accept set for every B1+ sentence, which is established practice here. (2) Engine: equivalences for -ra and -se, conditional and -ra in the apodosis, clause reordering around si, aunque, cuando, mobile adverbials. (3) Runtime, deterministic and cheap: when a reveal happens, offer "Mine says the same thing". It grades as Hard rather than Again, never marks a weak spot, and stores the sentence locally for a later accept pass. Also change the hint for unmatched sentences to honest wording: "Not what we expected. Yours may be fine; this is what we were looking for." And cards with a target structure must cue it: "Using *tras*". Cost: large content pass, small UI.

**C4. The story and the reading library break after any fresh app open.**
Locus: `src/ui/data/loader.ts` window (2 before, 3 after), `screens/story.tsx`, `screens/home.tsx`, `compiler/compile.ts` `chapterFor`.
Evidence: `bundle.index.chapters` holds only the window. Measured: `path.unit` 30 has 18 chapters (u29 to u34), `path.unit` 59 has 15. After a reload with 4 chapters read, Story says "Your first chapter comes with your first lesson." (`shots/upper/021-story-tab.png`) and Home says "Tomás has just landed in Bogotá. You'll read the first chapter soon." For a learner on a steady path at week 31, every chapter before week 29 vanishes from the library after each app open, the "chapters read" count falls, and the re-read pool shrinks. Before a reload, a placed learner's tab still holds weeks 1 to 4 from boot, so `chapterFor` serves "Hola, Bogotá" at week 60 and at week 18. After a reload they jump elsewhere: `pp` Home read "Story time: Nuestra esquina" and later "Story time: Un tinto, por favor" for the same lesson. `mid` got ch125 "Cinco tintos", opening "Mientras el bus de Yesid salía de Santa Marta", with no idea who Yesid is. `render.ts` hides all this because it loads only the window, so the headless path never shows it.
Consequence: the story is the retention engine, and for most learners most of the time it silently forgets them.
Fix: put metadata for all 219 chapters in the core bundle and fetch text on demand. Fix `chapterFor` to start from the placement point. Add a one-paragraph "The story so far" for each arc, shown to placed learners and after long gaps. Add a test where the bundle is the real boot window, not the whole set. Cost: small to medium.

### High

**H1. Every contrast "Train it" is a dead end, and the message is wrong.**
Locus: `session/freeplay.ts` `tiersFor`, `laterReason`. Evidence: 0 of 94 contrast nodes appear in any bank sentence's `targets` or `requires`, so a contrast can never have material. `laterReason` prints `priority` as a week: "It comes up in week 165." Fix: tag contrast sentences at build time, or derive the pool from the two member nodes, and drill choice. Remove "week N" or compute it from the course. Cost: medium.

**H2. Weak spots find the symptom and treat the wrong thing.**
Locus: `learner/weak.ts`, `session/freeplay.ts` `planNodes`, `nodeCard`, `compiler/remediate.ts`.
Evidence in section 2. Three defects: attribution (whole-sentence misses charged to every grammar node; "Preterite, missed 15 of 15" for a learner whose preterites were all right), treatment (por/para workout tests salir; a preterite versus imperfect confusion gets conjugation of valer), and no consequence (31 of 36 misses change nothing in the plan). The screen states no cause: only "missed 31 of 36". "Recent misses" repeats "Perdón por la demora." four times.
Consequence: the feature looks intelligent and does not help. A learner struggling with por/para is the core intermediate case, and this is where they lose faith.
Fix: (1) Use the checker's located `hintKind` for attribution: charge a por-para slip to por/para only. (2) Make the training match the error kind: choice drills, gap-only, por or para as the only options, 10 to 15 items, sense-tagged. For preterite versus imperfect, a connected paragraph with the verbs gapped. (3) State the pattern: "You used para for 'by means of' 6 times. Por goes with how something travels." This needs a sense tag on por/para sentences at build time, which is a small and valuable content job. (4) Feed repeated misses into `remediate`, and hold new grammar on a shared skill for a session if the miss rate is above a threshold. Cost: medium.

**H3. Feedback after a miss usually gives no reason.**
Locus: `cards.ts` `why` lines. Evidence: "Here is how Spanish says it." 19 times across three rendered days at week 58 and 8 to 13 on any drill day. The tautology `"You're right not to rise to his provocations." is Haces bien en no responder a sus provocaciones.` The translation repeated as a reason: `Mucho ha cambiado el barrio desde entonces. → The neighbourhood has changed a lot since then.` Consequence: the learner has spent effort and been told only the answer. Fix: on any miss with a located hint, show one line from the node's script, and link to the reference page ("See the rule"). The por/para page is already good enough to link. Cost: small for the link, medium for per-sentence reasons.

**H4. Look up cannot be searched by the standard names of things.**
Locus: `screens/reference/search.ts`, `model.ts`. Evidence: the table above. "Standard tense names in look-up" is a standing decision. The Verbs tab honours it and search does not: it matches titles, and titles are written in plain English. Also: -se forms are absent from the verb index, "Nothing you have met matches that." is untrue for a learner who has met it all, the empty state lists beginner topics first for a C1 learner ("Saying hello at any time of day"), with "Show more (1270)".
Fix: add an alias field to every grammar node (preterite, pretérito, indefinido, conditional, pluperfect, gerund, ser vs estar and so on), searched at title weight. Index -se forms and clitic-attached forms. Order the default list around the learner's current band. Cost: small.

**H5. Writing is not assessed, and is not kept.**
Locus: `blocks/writing.tsx`, `check/writing.ts`, `WritingMark` in `store/ui.ts`. Evidence: junk with English passes as above. `spanishShare` exists and scenes use it; writing does not. The 242 B2 and C1 tasks ask for 100+ words and all say "A few sentences of your own." 35 long tasks have a bare "write it as a question" constraint, shown on a 150-word supportive message to Vale. The text is thrown away: `WritingMark` stores `words`, `met`, `rubric`, never the text. The rubric's answers go nowhere that a learner can see except "Last time: 2 of 3 yes".
Consequence: at the level where writing should be the centre, it is a word count. The owner's end objective includes building accurate sentences independently.
Fix within "no AI at runtime": (1) Reject non-Spanish and repetition with a human line. (2) A deterministic error lint: unknown words against the lexicon, agreement in noun phrases, mood after known triggers, ser and estar frames, missing accents, por and para frames, queísmo. Show highlights, not grades. (3) Compare by features: show which target structures the model used and the learner did not. (4) One rewrite: pick your weakest sentence and retry it. (5) Keep every text in a portfolio and bring one back after three months to rewrite. Cost: medium to large. It is the most valuable missing feature at B2+.

**H6. Advanced sessions do not respect time.**
Locus: `compile.ts` learn block, `cards.ts` `otherNodes`, `session/order.ts`. Evidence: la creatividad, la armonía, la pirámide each drilled through multiple rungs at C1. By a cognate test on `lexemes.json`, 44% of C1 lexemes (371 of 850) are near-identical to their gloss. Distractors are random parts of speech: `el auge`: curl, snail, essential, boom, rise. Full-sentence chunk MCQs can be answered from any one word. No skip, no test-out.
Fix: first contact for B1+ is one typed retrieval: right first time means graduated to long interval, wrong means the ladder. Cognates become receptive-only. Add "I know this" on a New card, and same-part-of-speech, same-domain distractors. Cost: medium.

**H7. The app awards credit it has not earned.**
Locus: `screens/progress.tsx`, `blocks/scene.tsx` line 108, `screens/home.tsx`. Evidence: 60 can-do ticks after one sitting in which the close screens I captured show 76 of 181 right first time over nine lessons; "Words and phrases that have stuck 2519"; "They understood you. 0 of 5 replies landed first time, and you fixed the rest." Scene retries that fail are not "fixed". Close screen "6 of 6 right first time" straight after a 0 of 6 scene. Consequence: a demanding adult sees through it, and a less demanding one is misled about their level. Fix: separate "Skipped at placement" from "Earned". Scene verdict must match what happened: "Three of those didn't land. Here's how they could go." Cost: small.

**H8. The end of the course is a cliff, and nothing is browsable.**
Locus: `home.tsx`, `story.tsx`, `compile.ts` (after `path.unit >= units`). Evidence: "You've finished the course. Reviews keep it all fresh.", then only a catch-up mix. 215 chapters, 265 scenes and over 860 writing tasks stay locked for a placed C1 learner. Consequence: the best material in the app is unreachable by the people most able to use it. Fix: a post-course mode and a browsable library from the first day, chapters at or below level, scenes by theme, writing by genre. See section 5. Cost: medium.

**H9. No backup on a 19-month journey.**
Locus: `screens/settings.tsx`, IndexedDB only. Evidence: Settings has three tier choices, three review choices and Reset. No export, no import. Consequence: one lost phone or cleared site data ends a year's work. Fix: export and import of the learner store as a file, plus an optional reminder monthly. Stays offline and deterministic. Cost: small.

### Medium

**M1. Raw asterisks in the personal prompt.** 898 of 916 scripts. `teach.tsx` line 288 renders `script.personal` without `Rich`. Screen: `Write one sentence about your own street or town that starts with *Mucho* or *Poco*`. Fix: use `Rich`. A one-line change that reaches almost every Teach lesson.

**M2. The hint "Start with the verb" is wrong when the sentence does not start with one.** "Not yet. That's not the sentence yet. Start with the verb: queda…" for `Poco queda del edificio original.`; "sentí…" for `Qué ridículo me sentí al leer...`. Fix: say "The verb is queda…" or give the true first word.

**M3. Misaligned pairs.** `c:lo-tengo-clarisimo` in `chunks.json`: `es` "Lo tengo clarísimo: no voy a cambiar de opinión.", `en` "I'm absolutely clear on that." `stripLabel` drops the real phrase, so the card reads "How do you say: I'm absolutely clear on that" with the answer "no voy a cambiar de opinión." I typed "Lo tengo clarísimo." and it was rejected (`shots/mid/005-chunk-misalign.png`). Same class: `c:antes-de-que-se-me-olvide`, `c:ser-todero`. Spanish longer than English: `c:a-largo-plazo`, `c:no-puedo-mas`, `c:que-es-de-tu-vida`. Also `la fa` in `lexemes.json` line 101911: notes are masculine, el fa. A breach of a standing rule, six nodes, small fix.

**M4. The More practice picker is a 10,678 pixel page on a phone** (`shots/mid/007-more-practice.png`): every verb met as a checkbox, then tenses, with Translate underneath. Fix: three plain entry cards, verbs behind "Choose verbs", default to "today's verbs".

**M5. The app has no navigation history.** Back on a card leaves the app. Android hardware back in the installed PWA exits. No deep link, so a grammar entry cannot be shared or returned to. Fix: hash routes for tabs and reference entries, and back closes the top layer.

**M6. Checkpoint attribution misleads.** "Week 1, Hello, this is me: 0 of 1" after I missed `Quieren adaptar el texto, pero no cambiarlo del todo.`, a C1 sentence chosen to carry a week 1 node. Fix: use a sentence at or near that unit's level, or do not report by week. The result also changes nothing: "This was practice only. Your review schedule is unchanged."

**M7. Abandoned work disappears across midnight.** Session at 230 steps, next day Home shows a plain "Start" with no note. Fix: one line, "Yesterday's lesson is still open. We'll pick up where it makes sense."

**M8. Copy slips.** `Quiero adaptar el texto, pero no cambiarlo del todo.. Same sentence, new person.` `It uses You won't believe it: No te lo vas a creer..` The "20 of about 20" counter holds for three items. "Quick review" shows "1 of 60" for "Five minutes". "Teach" and "Practise" as week map labels. Home is always "Hola".

**M9. Desktop is a phone layout in a browser.** 560 px column at 1280 px, the session header is wider than the card below it (`shots/desk/003-d-card.png`). No number keys for options. Typed-answer work is better on a keyboard, so this is the natural home for writing, and it gets nothing extra. Fix: side rail with the rule and notes during a lesson, keys 1 to 4, wider writing view with the model beside the text.

**M10. Time labels are unreliable.** Rendered estimates and played times agree, but only on the model's seconds per card. "About 24 minutes" with 490 cards shows the number is not tied to the content. C1 budget is 30 minutes, not the 20 stated at welcome.

### Low

- `tu` for `tú` gets "There's an extra word: tu".
- English typed in a translate field gets no "that's English" line.
- No `h1` on any screen.
- Re-read speed challenge on an A1 chapter at C1: "Same story, a little faster."
- Offline at placement silently changes the check to week 1 items.

---

## 4. What the application does well and must be preserved

- **Reader glosses.** "salía from salir, to leave / to go out (I, imperfect)", "Dame from dar, to give (you, command, with me attached)", "tintico: a little coffee (affectionate)", save word, sentence-level English toggle. Nothing was wrong here on the sample I tapped. The learning tool I would most want as a learner.
- **Verb look-up by form.** Handles rare irregulars.
- **The por/para reference page** and the discovery-style script behind it. Minimal pairs, a story moment, then two short lists.
- **The located hint.** "Por or para? Check that little word." is exactly the right size. The classifier is the asset for H2.
- **One retry, then "You wrote: X, then Y".**
- **Scenes.** Intent, three accepted answers, `require` constraints, a Spanish-share floor, a `next` field for branching. The most active thing in the product. It only needs an honest ending.
- **Resume.** Reload mid-card returns to the same card.
- **Chapter hooks.** "Hernando still has no tinto, and Tomás still hasn't opened Altamira's letter. Tomorrow Vale shows him what a real day in Rosa's café looks like, starting before sunrise." These are good and are the seed of the retention design.
- **"What tripped you today" with Practise these now,** the week map, Only five minutes, I need to stop.
- **The C1 sentence content** in drills, and the Colombian texture (sumercé, tintico, a la orden).
- **Robustness.** Empty, long and rapid input did not break anything. Contrast is fine.

---

## 5. Missing capabilities

1. **A library.** Every chapter at or below level, browsable, with a "next chapter" button and a reading log. Scenes by situation, writing by genre.
2. **Real texts.** From B2, public-domain Latin American writing, glossed at build time through the same pipeline: Horacio Quiroga, Rubén Darío, José Asunción Silva, Jorge Isaacs's *María*, Tomás Carrasquilla, Rafael Pombo. Checked against `requires` so the app can say "you know 94% of the words in this". This serves the objective of reading increasingly sophisticated material, and it gives the course a destination. Rights need checking per text and territory.
3. **A proofreader mode (El corrector).** Find and fix the error, using real learner-error patterns. At B2 and above this is more valuable than another translation card and it is fully deterministic.
4. **A rewrite mode.** Same sentence, new register. Chapter ch125 "Cinco tintos" is already this exercise as a story. Scored against authored accept sets.
5. **Connected-text production.** The learner fills the gaps in a whole paragraph of narrative, choosing tense and mood. The natural home for preterite versus imperfect, ser and estar, and subjunctive.
6. **Writing portfolio and rewrite-later.**
7. **Skill-level knowledge model.** A map of the 94 contrasts with evidence per contrast. This is what an intermediate learner actually wants to see.
8. **"This is too hard" and "This is too easy".**
9. **Backup.**
10. **Post-course programme.** Monthly essay, real-text book clubs, maintenance tiers.

---

## 6. Recommended improvements

### Games and compulsion

There are no games, and in practice it matters more than a feature list suggests. What a learner loses is not fun in the abstract. They lose **low-stakes retrieval under time pressure, a different rhythm when tired, and a way to get a little Spanish on a bad day**. Sessions run 37 to 77 cards of the same shape. Over 19 months that monotony is the real competitor. "Only five minutes" is the only low-energy door and it is more of the same. The Verb workout has a personal best, which is the small seed of the idea.

Text-only, deterministic options, using content that exists:

- **Reto semanal.** A seeded 20-item challenge, same for everyone that week. The result is a shareable text grid, in the manner of Wordle. No server, no accounts, and it gives real competition with friends. The determinism of the compiler makes this nearly free.
- **Contrarreloj.** Verb survival: right adds seconds, wrong costs them. Personal bests by tense.
- **El caso Altamira.** A detective notebook that runs through the story. Clues in chapters go into a notebook; every few weeks you answer "who wrote this letter?" in Spanish. The story already has the plot for it, and it turns reading comprehension into something a learner wants to do.
- **El corrector** as above, as a daily three-sentence puzzle.
- **Frase rota.** Reorder a long C1 sentence. Fronting and clitics in motion.

### What brings someone back every day for 19 months

A streak does not. The streak is the only return mechanism visible, and it is punished by a broken return (C2). I would build on four things in this order:

1. **Serial story as appointment.** The hooks are good. Fix C4, add "previously", use named arcs as seasons, let a learner read on when they have earned it, and tie chapters to the real calendar where natural (Día de las Velitas on 7 December, Feria de las Flores in August).
2. **Felt progress, not counted progress.** Re-read chapter 1 at month six and show the two times, which `readSeconds` already stores. Rewrite your first essay. "In March you could not write this sentence." Show the share of a real text you can read, rising.
3. **A relationship.** A correspondence with Vale that runs the whole course, one message a fortnight. It is scripted and deterministic, but the learner writes back with the lint and the checker. Her replies branch on what the learner has done.
4. **A destination.** Reading Quiroga in the original at month 18 is a better promise than "Reviews keep it all fresh".

### Upper-level design

- First contact for B1+ is a test, not a presentation.
- Make B2 and C1 days feel different from A2 days. The owner wants them few and long. They should be reading-led: a 600 word text, its grammar found in it, a contrast drill drawn from it, a written response, and only then vocabulary from that text. The current order puts up to 135 taps of isolated words first.
- Explanations at C1 can assume grammar vocabulary and give register and frequency notes. Fronting in two sentences is below the level.

---

## 7. Uncertainties and limitations

- **Time.** All sessions were played by a bot, so real minutes are unknown. Step counts are taps, and they overstate cards because a card takes two or three taps.
- **Persona limits.** The `pp` persona used "no sé" where my oracle had no answer, so some misses in non-target nodes are real persona misses, not attribution noise. The "Preterite, missed 15 of 15" reading rests on code (`tensesOfNode`, whole-event attribution) as well as on the transcript. The live pret/imp path was checked through a direct call to `weakSpots` and one live workout, not six days of play.
- **Paraphrase battery.** I wrote it, sampled by eye from the evidence packs, so the 13% is not a population estimate. A few items change a structure the card may be targeting (`tras`, absolute construction, `o sea que`). It is still a strong signal because almost none of the failures show an honest message.
- **Placement simulation.** The "shallow learner" is a model. It is good for showing what the item mix can and cannot detect, and it says little about real-learner distribution. The A2 median of week 1 reflects that model failing copula and clitic items early.
- **Live units.** Live play was at weeks 18, 32, 44 and 60. Weeks 8, 20, 35, 45 and 58 were `render.ts` only, as card statistics; only week 58 day 2 was read line by line.
- **Story chapters:** read 5 or so in the app, by bot. I did not judge their literary quality.
- **Not tested:** service-worker offline, real screen readers, iOS, PWA install and update, Reset progress, the "Keep going" offer, the "Only five minutes" session (the button was seen, not played), Translate by unit, Practise saved words, the timed scene re-run as a human.
- **Limitations from standing decisions:** no listening means that "confidence in conversation" can only be approximated by typed scenes. No runtime AI means free writing will never be judged for meaning, and the deterministic lint in H5 finds form errors only. Settings has a "How much each day" tier, which sits uneasily with "learners do not choose lesson length". I have not proposed changing it.

---

## 8. Suggested implementation priorities

**Wave 1, this week, small and high-return:**
1. M1 asterisks (one line, 898 scripts).
2. C2 warm-up cap and a welcome-back state.
3. H1 stop the week 165 dead end, even if only by routing to the member grammar node.
4. H7 honest scene verdict and separated Progress credit.
5. M2 and M8 hint and copy fixes, M3 six nodes.
6. H9 export and import.
7. H4 aliases.

**Wave 2, the joins:**
8. C4 chapter metadata in core, `chapterFor` fix, recaps, and tests on the real boot window.
9. C3 part 3: "Mine says the same thing" and honest hints, then engine equivalences.
10. H2 attribution by `hintKind`, real contrast workouts, remediation fed by misses.
11. H3 "See the rule" link.
12. H6 test-out at first contact, better distractors.

**Wave 3, the rebuild of the upper journey:**
13. C1 new placement: skill-based items, production, provisional calibration.
14. C3 part 1: accept-set pass over all B1+ sentences.
15. H5 deterministic writing lint, portfolio.
16. H8 library and post-course mode, connected-text gap fills, sense tags.

**Wave 4, the reason to stay:**
17. Reto semanal, El corrector, Contrarreloj.
18. Real-text library from B2.
19. Vale correspondence, El caso Altamira notebook, then-and-now progress.
20. Reading-led B2 and C1 lesson shape.
