# Curriculum architecture audit: the journey from zero to "C1"

Audited 1 November 2026 on branch `rebuild`, in role as curriculum architect. Everything measured here is reproducible from the Python scripts in `/private/tmp/claude-501/-Users-Matthew-Fluidez/40ef6734-a9c2-4284-b528-c9cc038164e6/scratchpad/cur/`; each one reads `app/content` directly.

**Verdict in one paragraph.** The order of the course is good. The requires graph is clean, the threads are mostly sequenced the way a strong syllabus would sequence them, and the chunk-then-system design works. What is wrong sits around the order. The contrast layer the course relies on does not run: 94 written contrast lessons are never taught, no bank sentence belongs to a contrast, and the "re-drilled to C1" schedule in the unit data is read by nothing. Nothing tests competence, and the Progress screen ticks "You can now…" for any unit the path has passed, even one the learner marked "Not yet". The upper bands are not upper-band: a C1 story chapter has narrative sentences of 11.5 words, 59% of its lines are dialogue, and the whole course contains 87,000 words of reading, the length of one short novel. A learner finishing u60 will have covered a C1 grammar syllabus in about 270 hours. They will not be C1, and the app should stop implying it.

## 1. What was investigated

**Read in full:** `app/docs/unit-map.md`; `docs/research/Fluidez Spanish course sequencing.md` (the argument, not the CSV); the relevant parts of `docs/redesign.md` and `docs/product-audit.md`; `evidence/sequence.md`; `src/compiler/compile.ts` (session logic, contrast, review, checkpoint), `budget.ts`, `content.ts`; `src/ui/screens/progress.tsx`; `src/ui/blocks/writing.tsx` (self-check); `src/ui/session/freeplay.ts` (the any-time check); `src/ui/session/cards.ts` (learn cards); placement's header.

**Measured by script over all content:** all 172 grammar, 94 contrast, 650 pattern, 404 chunk and 4,554 lexeme nodes; all 60 units; all 72,693 bank rows; all 219 chapters; all 270 scenes; all 875 writing tasks.

**Run:** `tools/playtest/render.ts` at u12 (2 days) and u30 (10 days). `tools/simulate.ts --days 1100 --profiles average --tiers standard --no-write` over the full real content (985 sessions; this is the first full-course real-content run I can find, since `content/_reports/sim-summary.md` is from 29 October and covers A1 and A2 only).

**Read closely, by hand:** 17 grammar scripts on the thread nodes (listed in section 7), the contrast script for `x:pret-imp`, three checkpoint scenes, the last writing task of u28, u40, u56 and u60, one complete C1 chapter (ch175).

## 2. Evidence from the actual application

### 2.1 The size of the journey

| Band | Units | Sessions | Planned min | Planned hours | Cervantes hours for the band | App as % | New g / p / c / l / x | New nodes per hour |
|---|---|---|---|---|---|---|---|---|
| A1 | 14 | 133 | 20 | 44 | 90 | 49% | 45 / 91 / 143 / 654 / 19 | 21.5 |
| A2 | 13 | 130 | 22 | 48 | 120 | 40% | 37 / 35 / 91 / 628 / 16 | 17.0 |
| B1 | 14 | 140 | 25 | 58 | 150 | 39% | 42 / 152 / 40 / 534 / 30 | 13.6 |
| B2 | 10 | 100 | 28 | 47 | 180 | 26% | 28 / 184 / 49 / 380 / 17 | 14.1 |
| C1 | 9 | 90 | 30 | 45 | 210 | 21% | 20 / 188 / 81 / 332 / 12 | 14.1 |
| **All** | **60** | **593** | | **242** | **750** | **32%** | | |

The Cervantes figures are the ones the sequencing doc itself uses (90/210/360/540/750 cumulative). Classroom hours are not app hours, and focused solo minutes may well be denser, so read the percentages with that in mind. Even at a generous 2× the course reaches 484 of 750, and at "extended" on every single session (+15 minutes) it reaches 390 planned hours before that multiplier. The shape matters more than the total: **hours per band are flat (44, 48, 58, 47, 45) while every recognised framework has them rising.** The course is thinnest exactly where the jump is hardest.

**Calendar, real content, average profile (skips 12% of days, occasional short breaks, 10% of days a minimum session):**

| Band | Calendar days | Sessions run | Simulated min per session |
|---|---|---|---|
| A1 | 179 | 161 | 18.1 |
| A2 | 168 | 150 | 20.3 |
| B1 | 188 | 180 | 22.1 |
| B2 | 123 | 117 | 25.4 |
| C1 | 132 | 114 | 27.5 |
| **All** | **789 (26 months)** | **722** | about 267 hours |

So 593 sessions is 19.5 months only for someone who never misses, and 26 months for the simulator's ordinary learner. The simulator's retention figures are circular by its own admission (answers are drawn from the model's retrievability), so I use it for calendar and supply only.

### 2.2 The requires graph

| Test | Result |
|---|---|
| Node taught before something it requires | 0 of 916 |
| Priority differs from real session | 0 |
| Node on no day | 0 |
| Longest grammar chain | 14 (`g:ser-identity` … `g:subj-wanting` … `g:register-ladder` … `g:tense-modal-uses`) |
| Mean depth by band | A1 3.6, A2 5.5, B1 8.0, B2 10.0, C1 9.8 |
| Grammar used in content before its node (gate) | 0 errors |
| Same test by independent regex (26 structures: *cuyo, el cual, hubiera + participle, cuando + subj, se me olvidó, sino, aunque…*) | Tagger holds. Early hits are all chunks, false friends (*fuera*, *había mucho*) or sanctioned story lookahead |
| Grammar nodes no later grammar node builds on | 63, of which 43 are below C1 |
| Nodes with no tagger key, so no later row or chapter ever counts as using them | 37, including `g:ser-estar-adjectives`, `g:por-para-2`, `g:narrative-pasts`, `g:se-meaning-change`, `g:cleft-focus`, `g:topic-fronting`, `g:register-ladder` |

Graph sanity is real, and the independent regex test raises my confidence in the gate. A few edges are ordering artefacts rather than dependencies (`g:direct-objects` requires `g:gustar-basic` and `g:preterite-er-ir`; `g:possessive-dative` requires `g:se-accidental`). These do no harm while order is hand-set, but they would mislead any future automatic placement or skip logic.

### 2.3 Contrast timing and contrast reality

Timing is excellent: 87 of 94 contrasts land within 3 sessions of their second side, and the worst is `x:saber-poder` at 49. Reality is another matter; see problem 1.

| Measure | Value |
|---|---|
| Bank rows with an `x:` node in `targets` or `requires` | **0 of 72,693** |
| Contrast scripts in `content/scripts` | 94 |
| Contrast scripts a session can serve | **0** (`teach()` is called only at `compile.ts:841` for grammar and `:1115` for patterns) |
| Contrasts with no `forms` (`x:pret-imp`, `x:saber-conocer`, `x:saber-poder`, `x:para-porque`, `x:le-se-lo`) | 5, which render as "Have another look" read cards |
| Focus listings on review, output and checkpoint days | 469, of which 75 are `x:` on review days. None is read when the session is built |
| Warm-up review items with no sentence at all (simulator) | 5,592 of 30,635 (18.3%) |

### 2.4 Recycling

Deliberate scheduling stops almost at once: for 168 of 172 grammar nodes, the last day that names the node is within 15 sessions of its introduction (median 6.5). The remix block and drill interleaving draw only on `recentGrammar`, which holds the last 8 grammar points, about three units. After that, a node has FSRS (3, 11, 35, 101 days, then up to 365) and whatever turns up incidentally in sentences.

Incidental use, measured two ways. Bank rows and chapters by band, using the tagger, with the last column confirmed by independent regex:

| Structure | Taught | Bank rows A1 / A2 / B1 / B2 / C1 | Chapters using it, of 38 / 44 / 42 / 50 / 45 |
|---|---|---|---|
| Present perfect | 67 | 185 / 14 / 47 / 239 / 154 | 2 / **0** / **1** / 14 / 12 |
| estar + gerund | 69 | 187 / 73 / 56 / 39 / 53 | 4 / 4 / 6 / 4 / 8 |
| Imperfect progressive | 107 | 126 / 9 / 9 / 21 / 6 | 1 / 1 / 1 / 5 / 4 |
| Doubt and negated opinion triggers (regex) | 264–274 | 1 / 0 / 297 / 80 / 13 | 0 / 0 / 5 / 1 / **0** |
| `g:subj-conditions` | 427 | 0 / 0 / 0 / 132 / 2 | 0 / 0 / 0 / 1 / 1 |
| `g:future-perfect` | 434 | 0 / 0 / 0 / 116 / 6 | 0 / 0 / 0 / 3 / **0** |
| *sin embargo, no obstante, por lo tanto, por consiguiente, en cambio, a pesar de* (regex, hits) | 350–431 | | 0 / 0 / 0 / **3 / 4** |

What a C1 chapter actually draws on, by band of grammar node (mean per chapter; caveat in section 7, since 37 nodes are invisible to the tagger):

| Band of node | Nodes in band | Used per C1 chapter | Share of band |
|---|---|---|---|
| A1 | 45 | 32.3 | 72% |
| A2 | 37 | 10.9 | 30% |
| B1 | 42 | 6.8 | 16% |
| B2 | 28 | 1.0 | 4% |
| C1 | 20 | 0.5 | 3% |

In C1 bank sentences, 76% of grammar tags are A1 nodes and 2% are B2 nodes.

### 2.5 Reading and writing volume

| Band | Chapters | Story words | Mean / max words | Narrative words per sentence | Dialogue lines | Lexeme types above rank 3,000 | Writing: median max words | Scene model answer, words |
|---|---|---|---|---|---|---|---|---|
| A1 | 38 | 6,659 | 175 / 183 | 7.0 | 71% | 9.6% | 30 | 7.1 |
| A2 | 44 | 11,242 | 256 / 261 | 8.3 | 66% | 7.4% | 60 | 7.6 |
| B1 | 42 | 14,618 | 348 / 363 | 8.9 | 67% | 8.2% | 120 | 9.0 |
| B2 | 50 | 22,274 | 445 / 450 | 9.5 | 67% | 7.5% | 200 | 9.0 |
| C1 | 45 | 32,466 | 721 / 1,000 | 11.5 | 59% | 9.9% | 250 | 9.4 |
| **All** | **219** | **87,259** | | | | | | |

The redesign promised "several hundred thousand words of graded text", writing of 80–150 words at B1, 250 at B2 and 400+ at C1, and the sequencing doc said 400–1,000 at C1. No writing task in the course exceeds 250 words. 213 of 219 chapters are at least half dialogue. No chapter is below 25% dialogue lines; the least dialogue-heavy C1 chapter (ch202) is at 41%. A marker scan finds letters and emails embedded in 23 chapters and legal or news wording in a handful, always inside a dialogue-driven scene. So no chapter is an essay, op-ed, report or sustained literary narration. The story is delightful: ch175 is funny, natural Spanish. It is also prose a good B1 reader could follow.

### 2.6 Vocabulary

4,554 lexemes sounds like the research doc's C1 target of about 4,500. In practice 2,528 are taught on days and carded (A1 654, A2 628, B1 534, B2 380, C1 332). 1,830 are the "receptive" tier, "met in reading, not carded". With a deliberately generous stem match (any token starting with the lemma's stem), **1,282 of 1,799 testable receptive words (71%) never occur in any chapter, 790 (44%) occur in neither a chapter nor a bank row, and only 151 (8%) occur six or more times in the story.** Those words are in the graph but not in the learner's path.

## 3. Specific problems discovered

### Critical

**Problem 1. The contrast layer does not run.**
- **Locus:** `src/compiler/compile.ts:841, 1115` (only places `teach()` is called), `:1039-1049` (`pickContrast`), `:1198-1211` (`reviewDay`), `:1171-1196` (`checkpointDay`), `:1125-1144` (`outputDay`); `content/graph/contrasts.json`; `content/scripts/x_*.json`; every unit file.
- **Evidence.**
  - `x:pret-imp` has a good script: "Almost every verb has both pasts, and swapping one for the other changes the story", 9 read-and-pick items, 7 your-turn items, 3 pitfalls. A learner on its drill day (rendered at u12 day 2) sees none of it. The contrast arrives as a learn item with no `forms`, so `learnRetrieval` falls through to a read card, shown four times: `[read] Llovía cuando llegué.  //  What happened or what it was like? (the two pasts)`. The "English" is the node's title.
  - The other 89 contrasts with `forms` become flash cards of fixed example sentences: recognise, pick, type "Gracias por el regalo." Nothing asks the learner to choose between the two sides.
  - After that, the contrast's FSRS card has no sentence to draw on, because `byTarget` and `byRequire` hold nothing for any `x:` id. From the u30 render: `diag [bareReview] no usable sentence for x:ser-estar-adj: bare card`, served as "What does this mean?: Es aburrido." The learner is being quizzed on the meaning of one sentence, labelled in the data as the most important choice in Spanish.
  - `graph/contrasts.json` says of `x:pret-imp`: "Big five: re-drilled every review day from u12 to C1." The unit files do list it, along with `x:lo-le`, `x:ser-estar-adj`, `x:por-para` and `x:creo-no-creo`, 75 listings in all on review days. `reviewDay` never reads `day.focus`. Neither does `outputDay` or `checkpointDay`. Those 469 listings do nothing.
  - `pickContrast` returns the first ready contrast in map order, so even when it fires it favours the same few. Its result then goes to `pickSentences`, which returns nothing, so the slot silently shrinks to the other sources.
- **Fairness.** The structured-input engine does build real minimal pairs (`exercises/input.ts`: tense, mood, clitic, copula, por/para) on drill days for the node being drilled, and translation forces the choice implicitly. I saw "Which one says who it is meant for…? *Llegué a Bogotá y todo era nuevo para mí* / *…por mí*" at u12. So choice practice exists by accident on some days. It is not scheduled, does not return, and explains nothing.
- **Learner consequence.** Ser/estar, the two pasts, por/para, lo/le and mood are what separate an intermediate learner from an advanced one. Research in the project's own brief says separate-then-mix across sessions is what helps. A learner gets the separate half and almost none of the planned mix. An FSRS card for `g:pret-vs-imperfect` answered correctly returns perhaps five more times in 20 months.
- **Fix.** All engine work, because the content already exists:
  1. A contrast on its day gets a `teach(x, 'light')` block.
  2. `sentencesFor(x)` is the union of its sides' target rows, served through `structuredInput` with the right feature. A `choice` op presents side A and side B with a reason on reveal.
  3. `reviewDay` honours `day.focus`: the 75 listings become a real rotation, and each review day runs one contrast for 8 to 12 cards.
  4. `pickContrast` takes the least recently served ready contrast.
  5. Write `forms` for the 5 empty contrasts.
  6. Add a gate check that fails if an `x:` node cannot produce a card with two sides. That check would have caught all of this.

**Problem 2. The course implies a level it cannot deliver.**
- **Locus:** band labels in `unit-map.md`, `content/units/*.json`, Progress ("B2, week 3 of 10"), can-dos of u52 to u60.
- **Evidence.** Section 2. 242 planned hours against 750; 87,259 words of reading; writing capped at 250 words; 2,528 carded words; C1 narrative sentences of 11.5 words; no spoken or listening component (a standing decision).
- **What a finisher most plausibly is.** My estimate, not a measurement:

| Skill | Likely level at u60 as built | Why |
|---|---|---|
| Grammar knowledge (recognise, explain) | B2+ to C1 syllabus coverage | The node list is comprehensive |
| Grammar in free production | B1+ to B2 | Output is cued, single-sentence, and one focus at a time |
| Reading | B1+ to B2, on simple prose | Story level and volume; never met an essay |
| Vocabulary | Solid B1, patchy B2 | 2,528 carded; the rest mostly unmet |
| Writing | B1+ | 250-word ceiling with stated keywords |
| Listening, speaking | Unassessed | Standing decision. An honest C1 claim needs both |

  The text-only constraint means CEFR C1 as a whole cannot be claimed at any price. The honest claim the app could earn is narrower and still impressive: "reads and writes at B2 to C1". It has not earned even that yet.
- **Learner consequence.** A learner who trusts "C1" walks into Bogotá or a DELE and is blindsided. Trust is the product.
- **Fix.** Call the bands Stage 1 to 5 in the UI. Use CEFR terms only for benchmark results, and only per skill ("Reading: B2 on the check you took in March"). Say plainly in onboarding what is and is not covered. Then raise what is true, through the reading, writing and vocabulary work below.

**Problem 3. Nothing assesses competence, and the app ticks it anyway.**
- **Locus:** `src/ui/screens/progress.tsx:68`; `src/compiler/compile.ts:1171-1196`; `src/ui/blocks/writing.tsx:127`; `src/ui/session/freeplay.ts:306`; `content/scenes/sc-u*-c.json`.
- **Evidence.**
  - Progress prints `{done.map((u) => <li key={u.id}>✓ {undash(u.canDo)}</li>)}` under "You can now…", where `done` is every unit the path has passed. A learner who marks "Not yet" at the checkpoint gets the ✓ the moment the unit ends. The self-mark only shows for the unit in progress.
  - A checkpoint day (15 in the course) is a warm-up, 8 single-sentence comprehension picks on nodes 14 to 28 days old, a writing task, a scene and "Can you do this now?". There is no reported result for the check, no pass mark and no consequence except a remediation list. `scoring: 'exposure'` means it does not even count as a review.
  - All 875 writing tasks have a `focus`, so a checkpoint's task is always "use this item". The check is regex on the named feature plus word count.
  - Checkpoint scenes have 5 turns of about 9 words. `sc-u56-c` is the checkpoint for "write a sustained argumentative essay and defend it". Its intent reads "Say that however nostalgic they call you, you defend the future of the neighbourhood (use: por muy ... que or por mucho que)", and its check is that regex. `sc-u60-c`'s second turn: "Say no: you simply say what you think (use: sencillamente)." The intent contains the answer, in English, with the Spanish keyword supplied. That is cued sentence-building.
  - The any-time check (`freeplay.ts`) is good but limited: 20 cards, deliberately on *seen* sentences, scored per unit, optional, and not tied to a band.
  - The redesign's "quarterly DELE-style reading and writing benchmark requires ≥60%, with a remediation block" was not built. `advancePath` still ignores results; the throttle is the only brake.
- **Learner consequence.** The learner's real question, "am I actually B1?", has no answer in the app. Progress reports completion as ability, which is the thing the owner said he does not want.
- **Fix.** See 6.5. Immediately: change Progress so a ✓ needs evidence (a passed unit check or a "yes" self-mark), and show "Covered" for the rest. Then build stage benchmarks.

**Problem 4. Upper-band reading and output are not upper-band.**
- **Locus:** `content/story/ch125` onward, `content/writing/u42`–`u60`, `content/scenes`.
- **Evidence.** Sections 2.4 and 2.5. C1 narrative sentences average 11.5 words (news prose is typically around twice that; my estimate, not measured). *Sin embargo, no obstante, por lo tanto, por consiguiente, en cambio, a pesar de* appear 4 times across all 45 C1 chapters and 32,466 words. Doubt triggers appear in 0 C1 chapters. Lexical rarity does not rise: types above rank 3,000 are 9.6% at A1 and 9.9% at C1. Scene answers grow from 7.1 to 9.4 words over 593 sessions.
- **Learner consequence.** The B2 and C1 grammar is taught, then barely met. Connectors, conditions and hedges that define advanced text are drilled in isolated sentences, and the reader never sees them work across a paragraph. Reading ability will plateau around the story's level. The owner's objective ("reads increasingly sophisticated material") is not delivered by the current corpus at any amount of practice.
- **Fix.** A separate reading strand, not a rewrite of the story (6.4). Keep the story as the emotional spine.

### High

**Problem 5. "Few and long" was not implemented. B2 and C1 are lists of frames on flash cards.**
- **Locus:** `compile.ts:1108-1123`, `budget.ts:108-110`; units u42–u60; `content/scripts/p_*.json`.
- **Evidence.**
  - Only Patterns days teach patterns, and `PATTERNS_TAUGHT = 3`. There are 48 Patterns days, so at most about 140 of 650 pattern scripts ever run. **The other 510 (78%) are written, gated and unreachable in a session.** They appear as Look up entries. Those patterns arrive on Input, Drill, Introduce and Output days as learn cards from their `forms`. At u30 day 8 the render shows 7 new patterns and 3 `teach` blocks.
  - B2 and C1 hold 372 of the 650 patterns: about 2 per session and 4 per planned hour, more than any other band. u53 to u58 each add 23 or 24.
  - The teaching gets *thinner* as the content gets harder. Median grammar rule: A1 120 words, A2 125, B1 111, B2 99.5, C1 100. Mean your-turn items: 8.1 at A1, 7.1 at C1. `g:argument-markers` has a 77-word rule; `g:concessive-advanced` has 87.
  - The rhythm is the same I-D-I-D-In-P-I-D-O-R in unit after unit. One day reads one chapter. The owner's note says upper-band lessons should be "long and topical", "able to carry more than one passage", and that all five "remembering and forgetting" lessons belong in one lesson. Here the remembering frames are scattered: `c:que-no-se-te-olvide` at u34, `c:me-suena` at u37, `p:recordar-acordarse` and `p:no-me-olvido-de` at u46, `p:si-bien-no-olvidemos` at u56. Session length rises only from 20 to 30 minutes.
- **Learner consequence.** A motivated B2 learner meets 20 phrases a week as isolated cards with no reason to care, on top of a rhythm they have done forty times. This is the likeliest place for the course to lose them.
- **Fix.** Rebuild u42 to u60 around topic lessons (6.3). Short of that, raise `PATTERNS_TAUGHT` and group the day's frames into one composed teaching block per function.

**Problem 6. The vocabulary target is met on paper.**
- **Locus:** `content/graph/lexemes.json`, `docs/vocab-report.md`.
- **Evidence.** Section 2.6. The report's "A1 1,050 … C1 4,550, target met" counts words 71% of which the story never contains. The 4,500 figure is itself a floor from test studies, and the sequencing doc's own Nation citation says C1-level vocabulary needs "millions of words of input". The course provides 87,000. The ceiling on the graph is about 4,500 lemmas, so 95%+ coverage of unsimplified text is out of reach (my judgement from standard frequency-coverage work, not measured here).
- **Learner consequence.** An authentic Spanish article will have an unknown word every line or two. The learner has no tools for this, because word formation is not taught at all (problem 9).
- **Fix.** Make the receptive tier real: a gate rule that every receptive word occurs at least 6 times in reading within two bands of its priority, enforced when the reading strand is written. Add a word-formation strand. Raise the C1 target to 6,000 to 8,000 lemmas with most of the growth receptive. Offer tap-to-save reading words as the card route.

**Problem 7. The first past-tense can-do is blocked by a node 60 sessions too late.**
- **Locus:** `g:preterite-spelling-stem` (u11 d3, session 98); `src/engine/tagger/nodemap.ts`.
- **Evidence.** u04's can-do is "say what I did yesterday and last weekend". The bank has **zero rows** containing *llegué, busqué, pagué, empecé, jugué, toqué, saqué, almorcé* before u11, though these are among the most common things to say about yesterday. *Pidió, durmió, sintió, murió, siguió* (384 rows overall) and *leyó, oyó, cayó* (282) are also absent before u11, despite the plot opening on Rosa's death and Hernando ordering a tinto every day. `p:costar-pagar` at u04 has 0 target rows.
- **Learner consequence.** For 69 sessions the app never shows or asks for "I arrived" or "I played". The first time a learner types it on their own, the natural guess is *llegé*, and the course has given them nothing to go on.
- **Fix.** Split the node. A new `p:preterite-yo-spelling` at u04 d4 (session 32) for -car/-gar/-zar. Keep third-person stem changes and y-verbs at u11. See move 1.

**Problem 8. Threads decay after their lesson.**
- **Locus:** section 2.4; `recentGrammar` (`compile.ts:90, 1377`), `REMIX_WINDOW_DAYS`.
- **Evidence.** The present perfect is taught at session 67 and drilled in u08, then appears in **0 of 44 A2 chapters, 1 of 42 B1 chapters, and 14 A2 bank rows out of 13,263**. It is then required at session 294 (pluperfect, same participles) and 330 (*hayas llegado*). Of the B1 grammar that should saturate later content, `g:concession-despite` and `g:causal-advanced` appear in fewer than 1 in 10 later units (at least 3 rows or a chapter), and `g:discourse-structure`, `g:reported-backshift`, `g:subj-doubt`, `g:quizas-a-lo-mejor` and `g:consequence-connectors` in fewer than 1 in 5. Review days are 42 of 593 (7%).
- **Learner consequence.** Forgetting between the lesson and the moment the next layer needs it. "Three months later" is the sequencing doc's stated measure of success, and the data says that for many structures the learner will not have met them in three months.
- **Fix.** A per-node recycling quota in the gate: every grammar node must appear in at least N rows and M chapters in each later band. Then a targeted burn of cross-thread "recycling rows" for the deficits. Consolidation weeks at band ends (6.2).

**Problem 9. Syllabus gaps a real C1 course would not have.**
- **Locus:** `content/graph`. Checked by searching every node's id, title, examples and notes, then the bank.

| Missing | Evidence | Where it belongs |
|---|---|---|
| Preterite and imperfect that change meaning: *conocí/conocía, supe/sabía, pude/podía, no quise/no quería* | One line in `g:preterite-irregular-strong` on *no pude*. No node, no contrast | B1, u31 |
| Bounded duration: *viví cinco años, estuve dos horas* (the classic counter-example to "long = imperfect") | `p:durar-durante` teaches the words, not the aspect choice. No node | B1, u31 |
| Sequence of tenses as one system: *que venga / haya venido / viniera / hubiera venido* | Only `g:subj-past-triggers` and `x:subj-present-past` | B2, u50 |
| Third por/para pass (the note on `g:por-para-1` promises "third at B2") | Does not exist. Last touch is `x:por-inf-para-inf` at 368 | B2, u47 |
| Word formation: *-ción, -dad, -oso, -ero, -miento, des-, re-, in-* | **No node** in 6,143 teaches it as a system. Only *-mente*, diminutives and C1 nominalisation touch it | A2 to C1 strand |
| Written accents as a system: stress rule, diacritic pairs (*tú/tu, él/el, sí/si, sé/se, más/mas*) | `g:sounds-letters` at session 3, then scattered notes. In an app whose only channel is typed text | u05, u09 |
| *a* vs *en*, *de* vs *desde*, preposition choice beyond por/para | No contrast | A1, B1 |
| *estar a punto de* | No node. 3 bank rows, all u57–58 | A2 |
| *por si (acaso)* | No node. 4 bank rows | A2 to B1 |
| *hacía X que* | 0 bank rows, 0 chapters | B1, u31 |
| *venir / andar* + gerund, *tener / llevar* + participle | No node. 0 *andar* + gerund rows | B2 |
| *quienquiera, dondequiera* | No node | C1 |
| Summarising, mediation | No task type | B2, C1 |

**Problem 10. The ser/estar thread has a 120-session hole and a thin top.**
- **Locus:** `g:estar-location-states` (13), `x:ser-estar-adj` (135), `x:ser-estar-place` (135), `x:ser-event-estar-location` (161), `x:es-en-esta-en` (371), `g:ser-estar-c1` (571).
- **Evidence.** A1 learners use both verbs with adjectives from week 2 ("Mi hermana es muy simpática", "Vale está cansada"). No contrast exists until session 135. The only A1 protection is a pitfall ("Soy bien → Estoy bien"). `g:ser-estar-adjectives` has 21 target rows, the fewest of any A2 grammar node, and owns no tagger key, so no other row in 72,693 counts as using it. Three contrast nodes cover one rule (events *es en*, things *está en*). `g:ser-estar-c1` teaches *estar de mesero*, *es de madera*, *estar por*, *estar para*: B1/B2 material arriving at session 571.
- **Learner consequence.** *Soy cansado* fossilises in the months it matters most. VanPatten's order (ser, estar + gerund, estar + location, estar + adjective) justifies late *production* of estar + adjective. It does not justify leaving identity against state uncontrasted.
- **Fix.** Moves 9, 10 and 8.

**Problem 11. No consolidation at band ends, and an overloaded start.**
- **Locus:** u14→u15, u27→u28, u41→u42, u51→u52; u01–u03.
- **Evidence.** Each band's last unit introduces new grammar right up to its end: u27 teaches `g:subj-emotion-intro` at session 260, u41 teaches `g:reported-commands-past` at 400. Nothing consolidates. The first three units hold 12 grammar points in 28 sessions, the densest stretch of the course. The first review day is at session 47.
- **Learner consequence.** Band transitions are where a learner should find out what they have. Here they pass unnoticed.
- **Fix.** Consolidation weeks (6.2) and decision 2 in 6.7.

**Problem 12. Uniform dose, identical weeks, no way to skip.**
- **Locus:** `content/units/*.json`.
- **Evidence.** Every grammar node gets one Introduce and about two drills, whether it is `g:imperfect-subj` or `g:pero-sino`. Node weight does not exist in the data. Full lessons also go to thin deltas on things long in use: `g:questions-prepositions` at session 354 is titled "Questions with a preposition first: ¿con quién?, ¿de qué?, ¿para qué?, ¿a qué hora?", and those forms have been licensed since session 18. The real content of that lesson is the verb-governed ones (*¿En qué piensas?*), and the title hides it. The same applies to `g:exclamations` (23→206), `g:indefinites` (23→216), `g:time-sequence` (32→246), `g:acabar-de-ya-todavia` (52→250), `g:infinitive-subject` (24→374), `g:cuando-indicative` (80→160). The redesign's "prove you know it and skip the day" was not built: probes exist only for placement.
- **Learner consequence.** **Where a motivated learner gets bored:** the A2 plateau from u23 to u26 (*qué/cuál, indefinites, pero/sino, tanto/como, -mente, time words*), with almost no new patterns in u18 to u25 and a story in "paperwork week"; review days that feel the same each time; every B2 Patterns day. A1 is not where boredom lives. New grammar arrives every few days, and by week 5 they can tell a story.
- **Fix.** Add `weight: light | standard | heavy` to nodes (6.1). Light nodes get an 8-minute block on another day. Add a one-tap pre-check on Introduce days for light nodes.

### Medium

**Problem 13. Where the gate has bent the Spanish or the order.** The rule is "natural Spanish beats checker legality", and these are places it lost.
- **Plural *se*.** `g:se-impersonal`'s script at u19 teaches "*se vende carro*, but *se venden carros*". Rows with *se venden / necesitan / buscan / aceptan*: **0 before u36**, then 24 at u36. The gate keeps the taught form unpractised for 170 sessions. Fix: license plural agreement from 174 in `nodemap.ts`.
- ***le* with a named person.** `g:indirect-objects` comes at 121, `g:le-doubling` at 234, and my scan found 0 "*le di … a Vale*"-type rows before u25. For 113 sessions a learner either drops *le* or never names the recipient.
- ***No te preocupes*** is a chunk at session 194; *¡No me digas!* at 244; ***se me olvidó*** first appears at u34 and has no chunk. Each is a phrase people need in their first month in a Spanish-speaking place.
- **`g:conditional-perfect` (417):** 56% of its target rows use `g:pluperfect-subj`, so they are *si hubiera…, habría…* sentences four sessions before `g:si-past-unreal` teaches that frame.

**Problem 14. The course ends on new material.** u59 and u60 introduce at 576, 581, 586 and 591. The last grammar point in 593 sessions is `g:evaluative-adverbs` ("lamentablemente, francamente, por suerte"), B1/B2 content with **0 target rows**, one drill and no later use. A final unit should be a capstone, not the place a leftover lands.

**Problem 15. Step changes in load.** New patterns per unit: 0–2 through most of u18–u25, 16 at u30–u33, 3 at u40, 21 at u42, 2 at u51, 24 at u53–u57. A learner feels these as lurches, and the simulator's throttle varies by band too (5.3% at A2, 10.6% at B1, 5.1% at B2, 12.3% at C1), though I have not shown one causes the other. Spread frames more evenly, and keep u40 and u51 as natural breathers.

**Problem 16. Band labels overclaim from the first week.** The A1 band contains all three pasts, the contrast, commands, relatives and object pronouns: PCIC A2 by the project's own account (48 grammar nodes marked `teaching_choice`), in 44 hours. That is a defensible syllabus choice. It also means "A1 complete" states something untrue about level. The A2 band reaches the subjunctive and the B1 band closes on *si tuviera*, so the mismatch compounds. The honest measure of pace is about one grammar node per hour at A1, plus 15 words.

**Problem 17. Documents disagree with reality.** `sim-summary.md` is three days old and A1–A2 only. `unit-map.md` says 108 scenes and 241 tasks (270 and 875 exist). `x:pret-imp`'s and `g:por-para-1`'s notes promise re-drills and a third pass that do not exist. Anyone reading those files would conclude the spiral exists.

### Low

**Problem 18. Contrast count is padded.** Besides the triple above, `x:perfecto-preterito` and `x:pret-perfecto-latam` sit on the same day on the same point, and `x:commands-tu-usted` and `x:tu-usted` likewise. Some are vocabulary pairs (`x:medir-caber`, `x:antemano-antelacion`, `x:vista-gorda-pasar-por-alto`). They are useful but should not be counted beside ser/estar.

## 4. What the application does well and must be preserved

- **The graph and the gate.** 0 timing violations in 916 nodes, confirmed by an independent test. Moving anything should keep these invariants.
- **Past tenses early, through chunks.** *fui, comí, era* from session 7, a real preterite by session 29, a story by u12. This is the course's best decision for adult motivation.
- **Usted commands as the bridge to the subjunctive.** The `g:subj-wanting` script says "You already know that shape. It's the *usted* command." That is elegant and should stay exactly as it is.
- **The mood thread's order** from wanting through doubt, emotion, *cuando*, relatives and the past layer. It is close to textbook best practice, reached with chunk seeds.
- **Three spirals that really do spiral:**
  - reporting: `g:reported-past-basic` 240, `g:reported-backshift` 300, `g:reported-requests` 357, `g:reported-commands-past` 400, `g:reported-speech-full` 444, `g:reporting-verbs-mood` 447;
  - relatives: 125, 176, 314, 317, 464, 484, 534;
  - comparison: 101, 146, 230, 347, 561.
- **Pronoun order and recycling.** 1st and 2nd person before 3rd, position then doubles then commands, with dense recycling (`g:direct-objects` in 37+ chapters of every band from A2).
- **Contrast timing.** 87 of 94 within 3 sessions of the second side.
- **The contrast scripts themselves.** 452 KB of written teaching is ready to use. This is why problem 1 is cheap.
- **The minimal-pair engine.** `exercises/input.ts` already builds the choice items the contrast layer needs.
- **The story and its voice.** Hernando's "Yo no narro, mijo. Narrar es lo que hacen los de la televisión." is the reason to come back. Do not rewrite it to make it harder. Add other reading beside it.
- **The pull-forward method** (a cheap early pattern plus the existing full node). It is the right tool for most of the moves below.
- **Colombian localisation.** Every sampled script uses it naturally.

## 5. Missing capabilities

1. A way to practise a choice as a choice, with both sides present, across the whole course (the contrast engine).
2. Stage benchmarks: a long, scored, mixed assessment that says what level the evidence supports and what to do next.
3. Evidence-based can-dos, and a Progress screen that separates "covered" from "shown".
4. Threads as a data type: a thread id on nodes, a per-thread mastery view, a per-thread check.
5. Node weight, so lessons can be sized to the point.
6. Test-out on Introduce days, as designed in the redesign.
7. Topic lessons at B2 and C1: multiple passages, grouped frames, one sitting.
8. A reading strand beyond the story, with genres and rising length and sentence complexity.
9. Long writing: drafts of 250 to 800 words with model comparison and a self-marking rubric.
10. A word-formation strand and an orthography strand.
11. A recycling quota in the gate, so a node cannot silently vanish after its unit.
12. Summary and mediation tasks, which fit text-only well and are a real CEFR C1 descriptor.

## 6. Recommended improvements

### 6.1 Dependency map of the main threads

Numbers are sessions. "Seed" is first contact through a chunk or pattern, "deepen" is systematic teaching, "consolidate" is a deliberate later return.

| Thread | Seed | Deepen | Consolidate | Does the course do it? |
|---|---|---|---|---|
| **Mood** | *que te mejores*, *ojalá* 11; usted commands 117; *¿quieres que te ayude?* 165 | wanting 194, irregulars 196, negative commands 200, wishes 204, *para que* 256, emotion 260/284, opinion 264, value 267, doubt 274, *quizás* 277, influence 304, *cuando* 307, purpose 310, relative 314, perfect 330; past layer: 384, 387, 390, 394, 397, 400; 414, 421; concessive 424, conditions 427, perception 451, free relatives 484, future in past 487 | `g:mood-choice-fine` 511 (three frames only), 546, 551, 556, 564 | **Seed and deepen excellent. Consolidation weak.** No stage where triggers are mixed and the learner decides. No sequence-of-tenses node. Doubt triggers fade to 13 C1 rows and 0 C1 chapters |
| **Past** | *fui, comí, era* 7–8; preterite 29–34 | states 48, irregular 50, perfecto 67, habitual 96, spelling 98, contrast 105, progressive 107, pluperfect 294, narrative 297 | `g:narrative-pasts` 297 (32 rows, blind to tagger); `g:tense-modal-uses` 506 | **Seed superb. Hole at 29–98 (Problem 7). Perfecto vanishes after u08. No aspect deepening after A1.** The sequencing doc's B1 and C1 returns are not there in substance |
| **Pronoun** | *me llamo* 1; *me gusta* 20; *me/te/nos* 30 | lo/la 72, reflexives 76, prep pronouns 92, le 121, position 130, *se lo* 150, commands 166, doubling 234 | possessive dative 327, fronting 457 | **Best of the six.** Move doubling earlier. `x:lo-le` is inert |
| **Se** | *me llamo* 1; *se llama* 14; *¿cómo se dice?* 2 | reflexive 76, *se lo* 150, impersonal 174, reciprocal 209, meaning change 290, accidental 324, passive 344 | `x:se-three-ways` 211, which comes *before* three of the uses | **No consolidation.** No moment when a learner sorts all the *se*'s. Plural *se* gated off for 170 sessions |
| **Ser and estar** | *soy, ¿cómo estás?* 1 | estar 13, *hay/está* 57, gerund 69, adjectives 134, participle 136, events 159, passive 364 | `g:ser-estar-c1` 571, thin and mislevelled | **Hole from 13 to 134. No real top.** 21 target rows on the core node |
| **Por and para** | *para* 25; *gracias por* 33 | por/para 164, *para que* 256, second pass 334, por + inf 368 | None. Promised third pass absent | **Stops at B1.** `g:por-para-2` has 31 rows, 0 chapters by tag |
| **Connectors and text** | *porque* 9, *es que* 9 | cause 127, consequence 350, cause in writing 367, despite 370, structure 377 | argument 431, reformulation 521, consecutive 551 | **Taught, then absent from reading:** 4 connector hits in C1 chapters |
| **Word building** | *-ito* 23, *-mente* 81 | *-mente* 236, diminutives 210 | nominalisation 537 | **No system.** New strand needed |

### 6.2 Proposed architecture

**Keep the 60 units and their order.** The order is good, and a full resequence would cost far more than it would return. Change what is built on it.

1. **Five stages, each ending in a consolidation week and a benchmark.** New weeks after u14, u27, u41, u51, and u60 as capstone. About 6 sessions each:
   - two or three thread workshops, built from existing contrast scripts plus mixed cross-trigger practice;
   - one long read and one long write;
   - the benchmark (6.5).

   Net cost is about +30 sessions. Light-weighting 15 to 20 nodes (below) recovers perhaps half.

2. **Node weight.** Add `weight` to grammar nodes.
   - *Light* (about 8 minutes, inside another day, no separate drill): `g:que-vs-cual`, `g:adverbs-mente`, `g:pero-sino`, `g:tanto-como`, `g:exclamations`, `g:indefinites`, `g:time-sequence`, `g:acabar-de-ya-todavia`, `g:questions-prepositions`, `g:infinitive-subject`, `g:cada-cualquier`, `g:deber-modal`, `g:possessives-stressed`, `g:diminutives`, `g:evaluative-adverbs`, `g:se-form-recognition`, `g:future-subj-recognition`.
   - *Heavy* (an extra drill and a planned return two units later): `g:pret-vs-imperfect`, `g:ser-estar-adjectives`, `g:subj-wanting`, `g:subj-irregulars`, `g:imperfect-subj`, `g:si-hypothetical`, `g:por-para-1`, `g:direct-objects`, `g:indirect-objects`, `g:reported-speech-full`.

3. **Review days become thread days.** The rotation already in the data (`x:pret-imp`, `x:lo-le`, `x:ser-estar-adj`, `x:por-para`, `x:creo-no-creo`) becomes real, widened to all six threads and to the higher contrasts as they unlock.

4. **Thread gates.** Each thread gets a named mixed check at the end of stages 2, 3 and 4.

**Is 593 sessions the right length?** The count is fine for an adult who has two years. The problem is the mismatch between calendar and substance. An adult sees 26 months and assumes depth, while the app delivers about 270 hours. **A1 at 133 sessions is not too long; it is 44 hours and PCIC A1-plus-half-of-A2.** If anything it is too fast per hour. Fix perception with milestones (u04 "you can tell yesterday", u08, u12), not with cuts.

### 6.3 B2 and C1: few and long

Target about 80 sessions of 45 minutes at B2 and about 70 of 50 to 55 minutes at C1, instead of 100 × 28 and 90 × 30. That is roughly 60 and 62 hours against 47 and 45, and sessions drop by 40. Each lesson is one topic: "Remembering and forgetting", "Hearsay", "Registering a complaint". It holds 2 or 3 passages, one grouped frame block (all frames for the function, taught as a system, using the existing scripts), one mixed practice, and one piece of writing. Grammar nodes attach to topics rather than own days. The units stay as containers. This honours the standing decision, which the current day template does not.

Cost is high: 19 units of day plans rewritten, compiler support for multi-passage days, grouped pattern blocks, and scripts recomposed from existing ones. It should be built by the same burn, and most of the source text exists.

### 6.4 Reading strand: "La repisa" (the shelf)

Written by models through the gate, in the same world where useful, as a parallel weekly long read:

| Stage | Words per piece | Genres | Target sentence length |
|---|---|---|---|
| 2 | 250–400 | Notices, recipes, short first-person pieces | 9–11 |
| 3 | 400–800 | News, reviews, advice columns | 12–15 |
| 4 | 800–1,500 | Op-eds, reportage, short fiction with real narration | 15–20 |
| 5 | 1,500–3,000 | Essays, legal and institutional texts, literary prose | 18–25 |

Volume target: 300,000 words in total, which is what the redesign promised. Add rules to the gate: connector density, receptive-word exposure, minimum share of B1+ grammar in stage 4 and 5 pieces, and sentence-length bands. Questions test inference, not recall. Reading is the one route to C1-level input that is entirely compatible with the standing decisions.

### 6.5 Assessment design

**Stage benchmark (45 to 60 minutes, retakable with different items):**

| Section | Form | What it proves |
|---|---|---|
| Reading | 2 or 3 unseen passages at stage length; inference, purpose, and reference questions | Comprehension without gloss |
| Use of language | 40 items across all threads, mixed, cloze and choice, no focus label | Choice, unprompted |
| Translation | 12 sentences both ways, deliberately cross-thread | Controlled accuracy |
| Writing | One timed task at stage length with no named feature, then a self-mark against a rubric and model | Unprompted production |

Report per skill and per thread, in plain words: "You read at about B1. Por and para are your weakest thread. Here is a two-week block." Below threshold, build the remediation block the redesign promised and recommend it strongly. I would not hard-block the path, since an adult may have reasons to continue. Be clear about the limit: only the reading, language and translation sections are machine-scored. Writing is rule-checked and self-marked, so report it as "self-assessed". Say that speaking and listening are not assessed.

**Unit can-dos.** Replace self-rating with evidence where possible: a can-do shows ✓ only after the unit's check passes. Until then the Progress line reads "Covered, not yet checked". Each checkpoint gets a score and uses items older than the 14-to-28-day window, drawn across all finished units, and at least one writing task with no `focus`. Scene turns at stage 4 and 5 should state the goal without giving the keyword.

### 6.6 Specific moves

**Rule of cost.** Moving a node *earlier* is safe for everything after its new spot, because later content only gets more legal. It needs a script check and new rows at the new spot. Moving a node *later* makes all content between the two points illegal, so it needs rewriting. So nearly every move here is a pull-forward or an addition, as the October pass was. "Legal" counts use the node's target rows checked against the proposed session.

**Cheap and high value (no later content changes):**

| # | Node | Now | Proposed | Why | What must be written |
|---|---|---|---|---|---|
| 1 | Split `g:preterite-spelling-stem`: new `p:preterite-yo-spelling` | u11 (98) | u04 d4 (32) | *llegué, pagué, jugué, empecé* belong to u04's can-do. 5 of 119 rows legal at 33, so write fresh rows | New script, about 40 rows for u04–u10, tagger key split, trim old script |
| 2 | Chunks: `c:no-te-preocupes`, `c:no-me-digas`, new `c:se-me-olvido`, new `c:por-si-acaso`, new `p:estar-a-punto-de` | 194, 244, none | u05, u09, u09, u17, u26 | First-month phrases | Graph and day edits, 6 rows each |
| 3 | `g:passive-se` licensing: plural agreement | u36 (344) | Key moves to `g:se-impersonal` (174) | Script already teaches it at u19 | `nodemap.ts`, about 30 rows in u19–u35. u36 keeps past and future forms |
| 4 | New `p:le-doubling-basic`; full `g:le-doubling` stays | u25 (234) | u13 d7 (121) | 37 of 152 rows legal. *Le di el libro a Vale* is ordinary Spanish | Pattern, about 30 rows |
| 5 | `g:adverbs-mente`, as a light block | u25 (236) | u11 d5 (100) | Trivial rule, huge payoff in reading. 23 of 121 rows legal | Script fits; about 30 rows. Frees a u25 slot |
| 6 | `g:evaluative-adverbs` | u60 (591) | u47 or u48 | Not a closing node. Has 0 rows, so nothing to break | 30 rows |
| 7 | `g:ser-estar-c1` becomes B2 `p:estar-de-por-para` with `p:estar-por` | u58 (571) | u47 | Its content is B1/B2. 13 of 30 legal, blockers move with it | Then write a true C1 ser/estar node for u58: perception (*está muy alto para su edad*), *ser* vs *estar* + participle at the fine edge |
| 8 | New `x:ser-estar-first` | none | u05 d4 or d8 | Closes the 120-session hole | Script, forms (depends on the contrast engine) |
| 9 | Merge contrasts: `x:ser-estar-place` + `x:ser-event-estar-location` + `x:es-en-esta-en`; `x:perfecto-preterito` + `x:pret-perfecto-latam`; `x:commands-tu-usted` + `x:tu-usted` | | Keep the first, re-return the merged node at its later dates | Avoids three lessons on one rule | Data edit |
| 10 | Influence frames: `p:te-pido-que`, `p:te-recomiendo-que` | Inside `g:subj-influence` u32 (304) | u22 | Same frame as *quiero que*, no new forms. 45 of 140 rows legal. u32 keeps the formal verbs (*sugerir, exigir, aconsejar*) | 2 patterns, about 30 rows, retitle u32 |

**Medium (new nodes, no rewrites):**

| # | Addition | Where | Why |
|---|---|---|---|
| 11 | `g:past-aspect-meaning`: *conocí/conocía, supe/sabía, pude/podía, quise/quería*, bounded duration, *hacía X que* | u31, replacing `g:narrative-pasts`' empty slot or sharing it | Real B1 deepening of the past thread |
| 12 | `g:sequence-of-tenses` plus a contrast across four subjunctive tenses | u50 | The missing top of the mood thread |
| 13 | `g:por-para-3` | u47 | The promised third pass: agent, *por + inf*, *por poco*, *por si*, *para colmo*, mixed cloze |
| 14 | `x:se-all-uses` | u45 | Sorts all seven *se*'s after every use is known |
| 15 | Word-formation strand: 3 or 4 nodes | u19, u28, u39, u48 | Multiplies vocabulary. `g:nominalisation` at C1 then has a floor to stand on |
| 16 | Orthography strand: stress rule, diacritic pairs, comma use | u05, u09, u39 | Text is the only channel |
| 17 | `x:a-en` (*voy a, estoy en*) | u03 or u04 | No contrast on the commonest preposition slip |
| 18 | `p:venir-andar-gerund`, `p:tener-participle` | u47–u49 | Register and nuance at B2 |
| 19 | `g:mood-decision` thread workshops | End of stages 3 and 4 | The cross-trigger stage the mood thread lacks |
| 20 | Summary and mediation task type | From u39 | Fits text-only |

**Optional, lower value:** `g:que-vs-cual` to about u08 as a light block (the `g:questions` script already carries the pitfall, so this is not urgent; 2 of 25 rows legal). `g:cuyo-relatives` to u48 for recognition (91 of 131 legal, cheap). `g:hace-que-desde` to u12 (115 of 245 legal).

**Expensive, and I would still do them:**

| # | Change | Cost |
|---|---|---|
| 21 | Recycling burn: about 5,000 to 8,000 new rows across A2 to C1 carrying perfecto, gerund, doubt, connectors and conditions in context | Large, routine |
| 22 | Reading strand (6.4), 200,000+ new words | Largest item in this report |
| 23 | B2 and C1 topic lessons (6.3) | Large; compiler plus 19 unit plans |
| 24 | Long-writing track, with rubrics and models | Medium to large |

**Moves I considered and reject:**

- Moving the subjunctive to B1: see decision 4.
- Moving `g:pret-vs-imperfect` later: the sequencing doc wanted about 120 and the course has 105. The gain is small and the content cost is large.
- Teaching estar + adjective earlier as a full node: VanPatten's order supports it staying at u15, so the fix is the light contrast at u05.

### 6.7 Decisions for Matthew

1. **Grammar density: 172 or about 210?** **Keep about 180.** Do not add a fourth Introduce to any week. Add the 10 or so nodes in moves 11 to 19, and make 17 existing nodes light. The real problem is uniform dose, not node count.
2. **Units 2 and 3 with no review day?** **Put both back.** It costs +2 sessions. The first review day is currently session 47, and the first 28 sessions hold the densest teaching in the course, for the learners most likely to quit. The session shift is mechanical, because `teachPos` is computed from position and `priority` can be re-derived by script. Check it against the gate; I did not run that.
3. **A1 at 133 sessions?** **Accept it. Do not cut the Patterns days.** Those days carry useful frames, and six sessions are not what makes A1 feel long. Its cost in hours is 44 against a benchmark of 90. Break the length up with visible milestones and rename the band.
4. **When does the subjunctive start?** **Keep session 194, end of A2.** Forms come from usted commands, which are still fresh. The clause types it needs (that-clauses 111, relatives 125) are in place, matching Collentine. Moving to 264 would squeeze the B1 mood run and lose a motivating late-A2 goal. Do strengthen the run-up: moves 2 and 10.
5. **650 patterns and 94 contrasts?** **Keep the content, tier the treatment.** Do not delete anything, since the mining is good. Three tiers:
   - Taught (script runs, productive card): about 250.
   - Practised (learn card and sentence practice): about 200.
   - Recognised (Look up and reading, no productive card): about 200.

   That reduces review load at C1, where the simulator's throttle is highest. For contrasts: merge the 4 duplicates, add the few new ones in 6.6, and mark the vocabulary pairs as such.
6. **The story.** **Keep Hernando's death in u57.** It earns "Emotion at native pitch" and gives the course a real emotional peak. **Change the ending:** a slow burn across 20 or more months deserves a payoff rather than a hint at u60. This is a judgement about reader reward, and it is your call.
7. **Colombian items.** These need a native check, which I cannot replace. My reading, from general knowledge and not verified:
   - *de pronto* (maybe), *me toca*, *correr la cita*, *la pasamos delicioso*: Colombian, keep.
   - *alcanzar a* + infinitive: pan-Latin American, keep.
   - *ser un duro*, *todero*: Colombian usage as far as I know, keep pending check.
   - *manos de mantequilla*: understood widely, fine.
   - *déjame te ayudo*: recognition only is right.
   - *me cayó muy mal que…*: fine, but check register.
   - *donde el diablo perdió el poncho*: I associate it with the Southern Cone, so use *la Cochinchina*.

## 7. Uncertainties and limitations

- **Level estimates are judgement.** The table in Problem 2 is informed opinion. No learner has been tested, and the app has no real users' data I could use.
- **Hours.** The Cervantes figures are classroom planning figures, cited through the sequencing doc. App minutes may be denser, and I gave a 2× sensitivity. The comparison shows the shape, not a precise deficit.
- **Simulator.** One seed, one profile. Its calendar is useful, its retention is circular by design, and 5,592 bare reviews include non-contrast nodes.
- **Tagger-based usage counts understate B2 and C1.** 37 nodes have no key, so `g:cleft-focus`, `g:topic-fronting` and others cannot be seen in chapters. The 3–4% figures for B2 and C1 nodes in C1 chapters are lower bounds. I read one C1 chapter in full and confirmed the general picture, but one chapter is not proof. The regex counts for connectors, perfecto and gerund do not depend on the tagger.
- **Receptive exposure.** Stem matching overcounts (false prefixes) and may undercount irregular stems. I chose it to favour the content.
- **Rank figures** are taken from `lexemes.json`, and the lexeme field only holds words in the graph, so true rarity in chapters may be a little higher.
- **The news sentence-length comparison** is my general knowledge, not measured.
- **Legal counts for moves** check target rows only. They do not check scripts at the new position, and the tagger was not re-run on a moved graph. Treat them as estimates of scale.
- **Not inspected:** scripts beyond these 17 grammar nodes (`g:questions-prepositions`, `g:time-sequence`, `g:exclamations`, `g:cuando-indicative`, `g:infinitive-subject`, `g:deber-modal`, `g:se-meaning-change`, `g:narrative-pasts`, `g:ser-estar-adjectives`, `g:estar-location-states`, `g:ser-estar-c1`, `g:por-para-1`, `g:por-para-2`, `g:se-impersonal`, `g:passive-se`, `g:tense-modal-uses`, `g:mood-choice-fine`) plus rule text of a few others; the 94 contrast scripts' accuracy (I read one, plus all their titles and notes); bank sentence quality; 267 of 270 scenes by hand; most writing tasks by hand; chapters other than ch175 by hand; the old app. I did not run the gate or tests, and did not play the app in a browser. Linguistic accuracy of content is not the subject of this report.
- I did not read other specialists' reports.

## 8. Suggested implementation priorities

**Do first (days, engine and data only, little or no content):**

1. Make contrasts run (Problem 1): teach block, `sentencesFor(x)`, review-day focus, rotation, `forms` for 5 nodes, gate check.
2. Change Progress so ✓ needs evidence (Problem 3).
3. Stop implying CEFR level: "Stage" labels in the UI, honest onboarding copy.
4. Fix the licensing for plural *se* (move 3), and pull chunks forward (move 2).
5. Restore the two early review days (decision 2).

**Next (weeks, modest burns):**

6. Moves 1, 4, 5, 6, 7, 8, 9, 10.
7. Raise pattern scripts served per day and group them by function, as a bridge to 6.3.
8. Add node weight and the light-block format. Add test-out for light nodes.
9. Medium additions 11 to 14 and 17: the thread tops.
10. Recycling quota in the gate, and report the deficits.

**Then (the real build):**

11. Stage benchmarks and consolidation weeks (6.2, 6.5).
12. Recycling burn (21).
13. Word-formation and orthography strands (15, 16).
14. Long-writing track and summary tasks.

**Finally (the largest and most valuable):**

15. The reading strand (6.4) and receptive-word enforcement.
16. B2 and C1 topic lessons (6.3).

If only three things happen, they should be: make the contrasts run, make the can-dos honest, and build the reading strand. The first is a matter of days and turns existing, unused content into the course's most important practice. The second removes the app's one untrue statement. The third is what could move "C1" from a syllabus claim toward a reading claim that can be defended.
