# Second-language acquisition and cognitive science audit of Fluidez

Specialist report 03. Date: 1 November 2026. Target: the rebuild in `app/` on branch `rebuild`.

## Verdict

Fluidez is not a recognition toy. In real sessions 55 to 61% of cards are typed and a quarter to a third are whole sentences typed from English, which is a much heavier production diet than most apps offer. The explicit teaching scripts are good, the reading gate is rigorous, and the spacing machinery is sound. All of that should stay.

The system has a different problem: it is built to teach discrimination and independent construction, but what it measures and rewards is reproducing one stored sentence. Five mechanisms carry that failure:

1. **The checker punishes valid Spanish and then calls it wrong for a false reason.** I wrote 91 valid alternatives to real bank sentences. The real checker accepted 5. It told a learner that `"tenemos" isn't the word here` for "We have to wait", in Unit 1, and that `"dijo" isn't the word here` for "Hernando said". Each rejection becomes an FSRS lapse on the target node.
2. **The 94 contrast nodes are delivered as flashcards.** No session ever shows a contrast script. No bank sentence (0 of 72,693) targets a contrast. A contrast review is the same fixed sentence every time.
3. **The output ladder does not exist where it matters.** For the subjunctive family only 6% of a node's own sentences can produce a gap; 30 grammar nodes, including `g:pret-vs-imperfect` and `g:si-hypothetical`, produce none. Where gaps exist, they mostly test an unrelated verb. The recombination "mastery test" fired 0 times in 120 perfect sessions.
4. **Errors do not change what the learner practises next.** A miss in controlled output is not re-asked, is not rescheduled and does not reach the grammar node it reveals. Free answers pass with no grammar check: `Dudo que Vale viene mañana` passes on the very day the lesson warns against it.
5. **The time model is off by a factor of two or three.** The scheduler assumes 10 seconds per review; a large share of reviews are sentences to type. At the app's own per-item budget, a learner placed at u45 spent 19 of 21 sessions in review-only mode and advanced 2 days.

Three dose findings also matter. Time on language-focused study is 69 to 84% of a session against Nation's guideline of about 25%. The whole story is 87,000 tokens, under the 171,000 Nation estimates for 12 meetings of the second thousand words. The course gives 197 hours to the end of B2 and 242 to the end of C1, against Cambridge's indicative 500 to 600 and 700 to 800 guided hours for English. The CEFR labels describe what is covered, not what a learner will be able to do.

None of this is a reason to rebuild. Most of it comes down to one missing data field, one missing verdict state and one wrong constant.

## 1. What was investigated

### Method

- **Literature.** I searched for and checked each source myself, and fetched the full text of Nation (2014) and Cepeda et al. (2008). Most other sources were confirmed at abstract or secondary level. The Appendix lists each reference and how far I verified it. Where I could not confirm an effect size I give only the direction.
- **Code read in full:** `src/compiler/{compile,budget,content}.ts`, `src/exercises/{spanish,input,ladder,recombine,translation,index}.ts`, `src/learner/{learner,scheduler,policy,weak,metrics}.ts`, `src/ui/session/{cards,runner,order,recap,teachflow,attribute,scene}.ts`, `src/check/translate/*`, `src/check/personal.ts`, the first 120 lines of `src/check/writing.ts`, and parts of `src/ui/blocks/*`, `src/ui/session/freeplay.ts`, `tools/sim/*`, `tests/ui/driver.ts`.
- **Real sessions.** Using the app's own headless driver (same card builders, checkers and runner as the UI), I played:
  - 120 sessions from zero with every answer right (reaches u13);
  - 14 sessions each for learners placed at u8, u20, u35, u45 and u58, logging every card (10,048 cards in total with the zero run);
  - `render.ts` output at those units, right answers, plus wrong-answer runs at u8 and u35, which I read directly;
  - the same engine at slower paces: 150 sessions from zero, and 21 sessions at u20 and u45.
- **Purpose-built measurements**, all run through real app code:
  - exercise mix and requested versus delivered exercise, per block;
  - generator coverage for all 172 grammar, 94 contrast and 650 pattern nodes, on up to 60 of each node's own target rows (34,340 rows checked);
  - 91 valid alternatives to real bank rows through the real checker;
  - 50 typical English-speaker errors through the real hint engine;
  - 14 ungrammatical free answers through `respondCheck` and `checkPersonal`;
  - the FSRS cost of one false lapse;
  - the simulator on real A1 and A2 content at 10, 18 and 25 seconds per review;
  - reading volume and word recycling across all 219 chapters.

Throwaway scripts and raw output are in `/private/tmp/claude-501/-Users-Matthew-Fluidez/40ef6734-a9c2-4284-b528-c9cc038164e6/scratchpad/acq/`. I did not read other specialists' reports.

### What an outstanding system should achieve

Knowing a rule and using it are different achievements, and the research treats them as such. The stages below are the yardstick for the rest of this report.

| Stage | What the learner can do | How to observe it | What the research says |
|---|---|---|---|
| 1. Recognise | Notice and interpret the form in input | Pick the meaning when the form is the only clue | Input practice builds comprehension; effects are skill-specific (DeKeyser & Sokalski 1996) |
| 2. Understand | State or apply the explanation when reminded | Say why one option is right | Explicit instruction beats implicit overall (Norris & Ortega 2000; Goo et al. 2015), for simple and complex features (Spada & Tomita 2010) |
| 3. Apply with guidance | Produce with the choice narrowed | Cloze, sentence frames, tiles | The declarative stage of skill acquisition (DeKeyser 1997) |
| 4. Produce independently | Build the sentence with no scaffold | Translate or express from a meaning | Production-based instruction shows a long-term advantage on productive measures (Shintani et al. 2013). Output makes learners notice gaps (Swain 1985; Swain & Lapkin 1995) |
| 5. Use in unfamiliar contexts | Transfer to new content and purposes | New tasks, delayed | Testing supports transfer (Butler 2010). Transfer depends on overlap between practice and use (Morris et al. 1977) |
| 6. Use naturally and fluently | Do it quickly, under load, without attention | Speed with accuracy; free tasks | Automatisation is gradual and skill-specific (DeKeyser 1997). Fluency needs its own practice on easy material (Nation 2007) |

Five principles decide most of the design questions here.

- **Retrieval beats restudy.** Repeated testing produced large gains and repeated study did not (Karpicke & Roediger 2008). Meta-analyses put testing around g = 0.5 to 0.6 (Rowland 2014; Adesope et al. 2017; both figures from secondary summaries). Harder retrieval tends to help more: with feedback, short answer beat multiple choice (Kang et al. 2007). Multiple choice is not worthless, though. Classroom work titled "Both multiple-choice and short-answer quizzes enhance later exam performance" (McDermott et al. 2014) is why this report objects to weak distractors, not to multiple choice as such.
- **Spacing works and the best gap grows with the retention goal.** The optimal gap falls from about 20 to 40% of a one-week delay to about 5 to 10% of a one-year delay (Cepeda et al. 2008). L2 work agrees (Bird 2010; Kim & Webb 2022), with individual differences (Suzuki & DeKeyser 2017).
- **Interleaving helps discrimination, under conditions.** Pan et al. (2019), on the Spanish preterite and imperfect, found no benefit in a single session and a substantial benefit when practice ran across sessions. Nakata & Suzuki (2019) studied grammar exercises directly. Discrimination between confusable categories is the proposed mechanism, though Birnbaum et al. (2013) studied exactly how far that explains it. A 2024 master's replication on the same tenses found no difference, so treat this as useful, not guaranteed.
- **Corrective feedback works, and prompting the learner to repair is at least as good as being told.** Li (2010) found a medium effect that lasted. Lyster & Saito (2010) found larger effects for prompts than recasts, most apparent on free constructed responses, though a later multisite replication found no such advantage. The Lyster & Ranta (1997) taxonomy separates feedback that makes the learner repair from feedback that does the repair for them.
- **Time on task needs balance.** Nation's four strands give roughly equal time to meaning-focused input, meaning-focused output, language-focused learning and fluency, with no more than about 25% on direct study (Nation 2007; the 25% wording is from a Cambridge excerpt of Nation's vocabulary book).

### Claims to treat with care

These are widely repeated and weaker than they sound. I do not lean on them.

- **The 98% coverage threshold** (Hu & Nation 2000). A registered replication could not fully reproduce it (Kremmel et al. 2023), and an internal reanalysis challenged its arithmetic. Keep the gate as a sensible rule, not as law.
- **"Ten encounters" as a threshold** (Webb 2007). The repetition effect is real but only r = .34 overall, and the maximum repetitions tested ranged from 2 to 20 (Uchihara et al. 2019, via secondary sources).
- **Involvement load** (Laufer & Hulstijn 2001). Supported, but a secondary source reports it explains only about 15% of the variance (Yanagisawa & Webb 2021, not verified at source).
- **Processing Instruction's superiority.** Disputed (VanPatten & Cadierno 1993; DeKeyser & Prieto Botana 2015, whose conclusions I could not read at source). Shintani et al. (2013) found both approaches work, with different strengths. Structured input is worth having. It is not a replacement for production.
- **"Mechanical drills are useless"** (Wong & VanPatten 2003). A strong position, itself challenged. My objection in P11 is to meaningless output, not to drilling.
- **Translation as harmful.** Laufer & Girsai (2008) found the opposite for vocabulary, though a 2022 replication questioned its methods. The owner's preference for more translation is defensible.
- **Learning styles.** No adequate evidence base (Pashler et al. 2008). Nothing in the app depends on them, and nothing should.
- **FSRS as proof of learning.** FSRS predicts recall of flashcards well on large Anki logs. That is memory prediction on repeated identical prompts. It is not evidence about language outcomes, and it says nothing about abstract skills tested in changing sentences.
- **CEFR labels as measures.** The scales rest largely on teacher judgement rather than SLA research (Hulstijn 2007), and North (2007) himself describes them as intended for profiling, not levelling. Fluidez should use them as reference only.

## 2. Evidence from the actual application

All percentages are of cards played unless stated. "Zero" is the 120-session run from a new learner (u1 to u13). The others are 14 sessions after placement. All answers were right, so these are best-case runs. The driver does not play scenes, writing or the personal sentence as cards; they appear in the time table instead.

### 2.1 Exercise mix

| Share of cards | Zero (A1) | u8 | u20 | u35 | u45 | u58 |
|---|---|---|---|---|---|---|
| Cards per session | 51 | 48 | 50 | 56 | 64 | 67 |
| **All recognition (multiple choice)** | 41 | 42 | 38 | 36 | 37 | 42 |
| **All typed** | 57 | 55 | 59 | 60 | 61 | 57 |
| **Free answer cards** | 1.3 | 2.7 | 2.3 | 1.8 | 1.2 | 0.8 |
| Typed en to es, whole sentence | 25.7 | 25.0 | 28.5 | 29.5 | 33.1 | 35.0 |
| Typed es to en | 8.9 | 9.2 | 11.2 | 11.1 | 10.1 | 12.1 |
| Typed cloze | 8.4 | 8.9 | 9.9 | 8.4 | 8.4 | 4.5 |
| Script "Your turn" | 7.4 | 6.0 | 4.6 | 4.8 | 4.3 | 3.2 |
| Transform | 3.2 | 3.9 | 4.3 | 5.3 | 2.8 | 2.2 |
| Recombine | 0 | 0 | 0 | 0 | 0 | 0 |
| Structured input, real minimal pair | 2.9 | 4.6 | 1.6 | 4.5 | 0.8 | 2.3 |
| Multiple choice form in a gap | 1.5 | 2.5 | 0.9 | 2.2 | 0.4 | 1.4 |
| Story comprehension | 2.9 | 5.1 | 6.5 | 6.6 | 5.7 | 6.6 |

Typing load grows with level: mean answer length rises from 5.1 words (zero) to 9.2 (u58), and typed Spanish per session from 66 to 209 words, not counting writing and scenes.

**Which exercise types exist:**

| Type | Exists? | Where |
|---|---|---|
| Multiple choice | Yes | Learn, read and pick, warm-up, story |
| Cloze | Yes | Verb gap and word gap; typed and multiple choice |
| Translation both ways | Yes, the dominant format | Warm-up and practice |
| Transform | Yes | Person, tense, negation, pronoun |
| Reading comprehension | Yes | Story questions; checkpoint meaning check |
| Vocabulary retrieval | Yes | Learn rounds, recap |
| Free production | Yes, constraint-checked or unchecked | Scene, writing, "Say something true", "Answer for yourself" |
| Conjugation | Only outside the session | Free practice and weak-spot workouts |
| Recombination | Code exists, not reached in daily sessions | Also used in free-practice checkpoint |
| Sentence construction or word ordering | **No** | |
| Error identification | **No** | |
| Error correction | **No** | |

### 2.2 Requested versus delivered exercise

The compiler plans an operation and the card builder quietly falls back when it cannot build it. So the plan is not what the learner gets.

| Block and requested op | Zero | u8 | u20 | u35 | u45 | u58 |
|---|---|---|---|---|---|---|
| Structured input: real minimal pair delivered | 47% | 69% | 31% | 81% | 16% | 65% |
| Structured input: fell back to a random meaning question | 53% | 31% | 69% | 19% | **84%** | 35% |
| Controlled output "choose": multiple choice form delivered | 34% | 44% | 19% | 44% | 10% | 33% |
| Controlled output "choose": fell to full sentence translation | 66% | 56% | 81% | 56% | 90% | 67% |
| Controlled output "transform": transform delivered | 53% | 92% | 11% | 89% | 33% | 33% |

The heading of that block tells the learner "First choose, then type, then change it around" (`labels.ts`). For most nodes that is not what happens.

### 2.3 What the generators can build from each node's own sentences

Share of each node's target rows that can produce each item. "On target" is the share of verb gaps whose answer actually belongs to the node (its own forms, or its tense for tense nodes), using a rule modelled on the app's `answerBelongs`.

| Nodes | Rows checked | Choose or type gap | Transform | Structured input | Recombine production | Gaps on target |
|---|---|---|---|---|---|---|
| Grammar A1 (45) | 2,665 | 37% | 56% | 58% | 26% | 43% |
| Grammar A2 (37) | 2,013 | 22% | 39% | 43% | 15% | 34% |
| Grammar B1 (42) | 2,264 | 11% | 30% | 29% | 9% | 27% |
| Grammar B2 (28) | 1,344 | 10% | 27% | 24% | 10% | 13% |
| Grammar C1 (20) | 950 | 16% | 29% | 35% | 4% | 13% |
| **Subjunctive family (27)** | 1,556 | **6%** | 12% | 11% | 2% | 10% |
| Compound tenses (12) | 720 | 6% | 23% | 19% | 10% | 48% |
| **Contrast (94)** | **0: no rows exist** | none | none | none | none | none |

Thirty grammar nodes have no gap at all, among them `g:gustar-basic`, `g:imperfect-states`, `g:perfecto-experience`, `g:pret-vs-imperfect`, `g:parecer-quedar`, `g:negative-commands`, `g:subj-wishes`, `g:subj-doubt`, `g:subj-value`, `g:subj-emotion`, `g:subj-influence`, `g:subj-relative`, `g:imperfect-subj`, `g:si-hypothetical`, `g:pluperfect`, `g:pluperfect-subj` and `g:conditional-perfect`.

The causes are in the code. `analyseGap` (`ladder.ts:107`) rejects compound verbs (`c.participle >= 0`) and every subjunctive (`LADDER_TENSES` has none). `parseClause` returns null when a sentence has more than one finite verb (`spanish.ts:403`), and every subjunctive sentence has two.

### 2.4 Contrast nodes

- Bank rows targeting or requiring any `x:` node: **0 of 72,693**. So `pickContrast` selects a contrast, `pickSentences` finds nothing, and the block carries a `contrast` field with no contrast items in it.
- Contrast items appear only in warm-up, learn and recap: 174 of 10,048 cards (1.7%), none in controlled output or remix.
- `teach()` is called only for grammar on introduce days and for up to three patterns on patterns days (`compile.ts:841`, `1115`). Contrast nodes go through `takeNew` into the learn pool. **Script cards across all runs: grammar 1,115, pattern 182, contrast 0.**
- So 800 authored read-and-pick items, 671 your-turn items and 310 pitfalls for contrasts are shown in no session. They are reachable only through look-up.
- Warm-up contrast reviews are bare cards from the node's first example. `rv:x:pret-perfecto-latam:productive:bare` asked "I went to the bank today." 5 times across these runs.

### 2.5 Warm-up reviews

Warm-up is the core of the session at 30 to 38% of time. Its delivered formats at u45 (452 cards): typed en to es sentence 42%, "Which one says this?" 21%, typed es to en 15%, typed cloze 10%, meaning multiple choice 6%, transform 3%. Other units are similar.

- "Which one says this?" uses three random sentences from the same unit as distractors (`otherSpanish`, `cards.ts:99`).
- **Bare reviews are 19.8% of warm-up cards** (818 of 4,132): chunks 262, lexemes 221, patterns 170, contrasts 126, grammar 39. A bare review is a fixed example, not a fresh sentence.
- Some reviews are not retrieval at all. `rv:p:te-presento-a:productive:bare` renders "Remember this one?", a read card. `ReadView` returns `correct: true` (`card.tsx:191`), so FSRS records Good.

### 2.6 Feedback

The line shown under a revealed answer, by how it was generated:

| Why line | u8 | u20 | u35 | u45 | u58 |
|---|---|---|---|---|---|
| A gloss ("X means Y", or "Y is X") | 46% | 46% | 41% | 50% | 51% |
| "It uses <node title>" | 15% | 17% | 21% | 19% | 20% |
| "Here is how Spanish says it." | 6% | 9% | 6% | 9% | 8% |
| Restates the sentence | 7% | 5% | 6% | 5% | 4% |
| Tense and person label from the engine | 5% | 5% | 3% | 2% | 2% |
| Authored or rule-bearing reason | 10% | 6% | 11% | 6% | 6% |

An authored or rule-bearing reason accompanies at most 6 to 11% of cards. A gloss is a fair reason on a vocabulary card, so the concern is the grammar and sentence cards, where "It uses <title>" and "Here is how Spanish says it." name the topic without saying why.

### 2.7 Time by strand

Minutes played, at driver pace, using Nation's four strands. I counted warm-up as language-focused, reading and reading checks as meaning-focused input, and writing, scenes, the personal sentence and "Answer for yourself" as meaning-focused output. Timed rereads and reruns count as fluency.

| Strand | Guideline | Zero | u8 | u20 | u35 | u45 | u58 |
|---|---|---|---|---|---|---|---|
| Language-focused | ~25% | **84** | **76** | **69** | **69** | **72** | **74** |
| Meaning-focused input | ~25% | 8 | 13 | 13 | 11 | 10 | 12 |
| Meaning-focused output | ~25% | 8 | 11 | 16 | 14 | 13 | 8 |
| Fluency | ~25% | 1 | 0 | 3 | 5 | 4 | 6 |

Listening is excluded by the owner's decision, so a true four-strand balance is out of reach. A warm-up sentence translation also has some meaning focus. Even so, the imbalance is large.

### 2.8 Reading and recycling

- Story tokens across all 219 chapters: 87,034 (A1 6,625; A2 11,207; B1 14,572; B2 22,236; C1 32,394).
- Short practice sentences add more: roughly 50 cards at about 7 words over 593 sessions is on the order of 200,000 tokens. This is my rough estimate. It supplies repetition of frequent words, but it is short, intensive and not reading for meaning.
- Nation (2014, Table 3): about 171,000 tokens to meet the second 1,000 word families around 12 times, 300,000 for the third, about 3 million for the ninth. That is an English estimate on family counts, so read it as an order of magnitude.
- Chapters containing a word after it is taught (median): A1 words 8, A2 words 2.5, B1, B2 and C1 words 1. Share of words that appear in fewer than 3 later chapters: A1 27%, A2 50%, B1 70%, B2 80%, C1 92%.
- Of 4,554 lexemes, 2,528 are scheduled on a unit day. The other 2,026 are allowed in sentences from their priority session with no card.

The reading gate itself is strict and sound: at most 2% unknown unglossed words, and 5 to 20% unknown in total depending on position (`tools/gate/checks.ts:426`). The compiler also delays a chapter when too many of its words are slipping (`coverage`, `compile.ts:562`). Comprehensibility is well controlled. Volume is the gap.

### 2.9 Course dose

Session counts times session minutes give cumulative hours: end of A1 44, A2 92, B1 150, B2 197, C1 242. Cambridge's indicative cumulative guided hours for English are about 90 to 100, 180 to 200, 350 to 400, 500 to 600 and 700 to 800. These are classroom hours for English, and Spanish is relatively easy for English speakers, so the comparison is rough. Still, a practice hour would need to be about three times as effective as a guided hour for the course minutes alone to reach B2 or C1 outcomes.

### 2.10 What a perfect learner's memory state looks like

After 120 sessions, zero run: `g:present-ar` has 3 productive reviews with stability 126 days; `g:preterite-ar` 3 reviews, 90 days; 35 of 41 grammar nodes are at rung 3. So nodes that describe whole paradigms reach "learned" status (stability of at least 60 days plus one pass on an unseen sentence) after about three scored productive reviews. Note also that 480 of 549 nodes have a "novel pass", because any unseen sentence counts as novel.

### 2.11 Pace and throttling

I re-ran the same sessions with honest timings, set from the app's own budget constants (`SECONDS` in `budget.ts`: pick 15, translate 35, type 25) rather than the driver's. All answers still right.

| Run | Seconds (mcq, typed, retry) | Sessions | Converted to review by throttle | Path moved |
|---|---|---|---|---|
| From zero | 9, 20, 32 | 120 | 0 | u1 d0 to u13 d5 |
| From zero | 15, 30, 45 | 150 | 24 (16%) | u1 d0 to u14 d1 |
| Placed u20 | 9, 20, 32 | 14 | 2 | u20 d0 to u21 d1 |
| Placed u20 | 15, 30, 45 | 21 | **16 (76%)** | u20 d0 to u20 d5 |
| Placed u45 | 9, 20, 32 | 14 | 2 | u45 d0 to u46 d2 |
| Placed u45 | 15, 30, 45 | 21 | **19 (90%)** | u45 d0 to u45 d2 |

The simulator, on real A1 and A2 content with the average profile over 365 days, agrees in direction:

| Seconds per review | Throttle conversions | A1 finished on day | A2 finished |
|---|---|---|---|
| 10 (the profile's value) | 3% | 154 | day 308 |
| 18 | 15% | 168 | not within 365 |
| 25 | 22% | 212 | not within 365 |

### 2.12 What the simulator can and cannot tell you

The simulator (`tools/sim`) is a good tool for load, calendar and supply, and it found real problems. It cannot say whether anyone learns. Its answer model is `P = R^exponent + noise`, so retention is an input, as its own report says: "circular by design". It has no notion of format difficulty, target skill, false rejection, transfer or fluency. It also runs only on A1 and A2 real content. The checked-in `content/_reports/sim-summary.md` has empty Targets, Calendar, Retention and Repeats tables, so it currently evidences nothing about calendar or retention.

## 3. Specific problems discovered

Each problem gives severity, locus, evidence, consequence, fix and evidence tier. The tiers are: **Strong** (strong research support), **Established** (established pedagogical practice), **Hypothesis** (reasonable but uncertain), **Novel** (needs experimentation).

### P1. Critical: valid Spanish is rejected, with false reasons, and the rejection becomes a lapse

**Locus.** `src/check/translate/{match,variants,hints}.ts`, `cards.ts:184` (`sentenceCheck`), `runner.ts:33` (`gradeOf`), `attribute.ts:141`.

**Evidence.** The answer to the audit's direct question: yes, 1.4% accept coverage makes production practice punishing, and more than the figure suggests.

I took real bank rows from the sessions above and wrote 91 alternatives that a native speaker would accept as correct translations of the English. I gave the checker every advantage, adding `corpusAlternatives` even though warm-up reviews do not use it. **It accepted 5 of 91.**

| Kind of alternative | Accepted |
|---|---|
| Everyday synonym | 1 of 34 |
| The most literal rendering of the English | 0 of 28 |
| Valid tense or periphrasis | 0 of 7 |
| Word order | 3 of 12 |
| Other structure | 1 of 10 |

All 86 rejections told the learner they had made a mistake. Real examples, with the hint shown:

| Bank row | English | Learner typed | App says |
|---|---|---|---|
| `u01-0564` | We have to wait. | Tenemos que esperar. | "tenemos" isn't the word here, check the meaning. |
| `u01-1047` | I have a coffee with Hernando. | Tomo un café con Hernando. | "café" isn't the word here, check the meaning. |
| `u01-0375` | I work with Vale at the café. | Trabajo con Vale en la cafetería. | Check the article: café is masculine. |
| `u06-0157` | We arrived in Bogotá two weeks ago. | Hace dos semanas llegamos a Bogotá. | Right words, different order. |
| `u19-0026` | Just a moment, please. | Un momento, por favor. | Check the spelling. |
| `u20-0112` | Tomorrow I'll pay everything I owe. | Mañana voy a pagar todo lo que debo. | There's an extra word: "voy". |
| `u34-0381` | Sorry, I didn't mean to bother anybody. | Perdón, no quise molestar a nadie. | A word is missing. |
| `u41-0677` | I did not want to flirt, I just wanted to talk. | No quería coquetear, solo quería hablar. | "coquetear" isn't the word here. (The model uses Peninsular *ligar*.) |
| `u46-t-reported-speech-full-0002` | Hernando said he had already left the bank that morning. | Hernando dijo que ya había salido del banco esa mañana. | "dijo" isn't the word here, check the meaning. (The model uses *contó*.) |
| `u58-0060` | As soon as he smelled the bread, Simón asked for a cracker. | En cuanto olió el pan, Simón pidió una galleta. | "en" isn't the word here, check the meaning. |

Some of these (the future, the subjunctive of a drilled node) deserve a nudge towards the target form. None deserves "wrong word".

The code already knows. `weak.ts:2` says: "Sentence-level questions (translate, respond, scene turns) are often marked wrong for synonym or phrasing reasons, so they only LOCATE a weak tense or feature". The weak-spots screen therefore distrusts this evidence, but FSRS takes it at full weight. For a single-target review, `attributeGrades` returns the uniform grade (`attribute.ts:143`), so a rejected sentence is Hard on retry or Again on reveal.

**Cost of one false lapse.** With the app's FSRS parameters and its 365-day cap, a card answered Good every time needs 5 reviews in its first year. One false Again at the third or fourth review raises that to 9 or 10, and the interval falls from 35 or 101 days back to 5 or 8 (intervals 3, 11, 35, 0, 5, 14, 36, 86, 195). One rejected sentence nearly doubles that card's first-year cost. Sessions contain roughly 8 (u8) to 14 (u58) whole-sentence warm-up reviews, so even a modest false-rejection rate adds up. If 20% of those were rejected falsely (my assumption, not a measurement), that is 2 to 3 false lapses a session, each adding about 4 future reviews.

**Learner consequence.** Three harms compound. A strong learner who generalises is punished more than one who memorises the bank's wording, so the app trains guessing the stored sentence. The false reason teaches something untrue ("tenemos isn't the word"), and that kind of error is worse than no feedback. And the review load rises, which feeds P8 and pushes out new learning. The damage grows with level, exactly where the owner wants more production, because longer sentences have more valid forms.

**Proposed fix: stop judging a sentence and start judging the target.** Four layers, deterministic throughout.

1. **Three verdicts, not two.** *Right*; *Wrong*; and *Can't confirm: compare*. When the answer fails but overlaps the model well, or contains no diagnosed error, show the model beside the learner's answer and ask "Same meaning?" Self-grading against a model is how Anki-style review has always worked, and it fits the no-AI rule.
2. **Score the target, not the string.** Use the existing `align` to decide whether the target word or form appears correctly in the learner's answer. If yes, the target passes, whatever else differs. Non-target differences become a calm note: "We'd say *…*". This extends the logic `attributeGrades` already applies to multi-target items, down to single targets.
3. **Grow acceptance at engine level, for free.** In `expandAccepted`: simple future and *ir a* + infinitive; preterite and perfecto where the English allows both; *tener que*, *deber*, *hay que* where the English allows; movable *hace* + time and fronted place phrases; a curated LatAm synonym table with article and gender handling (café and cafetería, cuarto and habitación, plaza and mercado, médico and doctor). `INTERCHANGEABLE` already holds 22 sets but is used only for a Hard grade (`cards.ts:168`).
4. **Grow acceptance in content, at build time.** Add a burn job that drafts 3 to 8 accepted variants for every production-eligible row, reviewed by the gate. Include a `targetSpan` (see P3). Start with the rows at C1 and B2, where variety is highest. Remove idiom-only rows such as `u54-0352` ("There were hardly any of us" for *Éramos cuatro gatos*) from production or re-cue them, since no one can derive an idiom from a plain English gloss.

Also change every hint that asserts an error the checker cannot prove. `"X" isn't the word here` should only appear when X is known to be wrong for this meaning. Otherwise: "Close to what we had. We'd say …".

**Evidence tier.** Accurate feedback and accepting valid answers: Established. Self-comparison against a model: Established (the writing checker's own header cites it). Size of the damage: Hypothesis, since no learner data exists.

### P2. Critical: contrast teaching is not delivered

**Locus.** `compile.ts:693` (`takeNew`), `841`, `1040` (`pickContrast`), `990` to `1004`; `content/bank/*`; `content/scripts/x_*`.

**Evidence.** Section 2.4. Here is the whole learner experience of `x:hay-esta`, "There is or it's there?", from the zero run:

```
ln:x:hay-esta#0  What does this mean?: Hay un banco cerca.
                 It's very expensive. | There's a bank nearby. | Swimming is good.
ln:x:hay-esta#1  How do you say this in Spanish?: There's a bank nearby.
                 Tengo hambre. | Nadar es bueno. | Hay un banco cerca.
ln:x:hay-esta#2  How do you say this in Spanish?: There's a bank nearby.  (typed)
```

The other half of the contrast (*El banco está cerca*) is never put against it, and the distractors are the other contrasts' example sentences. A good script exists for this: `x:ser-estar-adj` has a hook, side-by-side examples, a one-question rule, and meaning-flip pairs. The learner never sees it in a lesson.

`budget.ts` and `compile.ts:979` claim controlled output is "~60% latest, ~40% older points + a known contrast". The contrast share is 0%, since `pickSentences` has no rows to return.

**Learner consequence.** English speakers' hardest Spanish problems are choices the L1 does not make: ser or estar, preterite or imperfect, por or para, subjunctive or indicative. Contrast nodes exist for these. Instead the learner memorises one sentence for each side. They can type "Hay un banco cerca" on cue and still say *está un banco* in a free sentence, and the app will show "learned".

**Proposed fix.**

1. **Run the contrast script.** A contrast node's first appearance should be a teach block (full script), on its drill day, right after both sides are known. Its 800 read-and-pick and 671 your-turn items then count as in-lesson learning. The script needs no new content.
2. **Author contrast practice rows at build time.** For each of the 94 contrasts, 40 to 80 rows, tagged `targets: [x:...]`, with a `forcedChoice: { gap, options, why }`. These become the "known contrast" share of drills and remix, and the contrast's fresh review contexts. Sentences must carry the clue in meaning, not in a time word alone: time words are exactly what `TIME_WORDS` removes for tenses in structured input, so reuse that logic.
3. **Schedule them across sessions.** Pan et al. (2019) found the benefit only across sessions, so contrasts belong in warm-up and remix, repeatedly, not in one block.
4. **Rotate review contexts** so that no bare card repeats.

**Evidence tier.** Interleaved discrimination for Spanish tense across sessions: Strong but not unanimous (Pan et al. 2019; Nakata & Suzuki 2019; one null replication). Explicit instruction of the contrast: Strong. Forced-choice practice as an intermediate step: Established.

### P3. Critical: the output ladder collapses for the structures that need it most

**Locus.** `ladder.ts:107` (`analyseGap`), `spanish.ts:398` (`parseClause`), `cards.ts:697` to `709`, `compile.ts:914` (`ladderOps`), `924` (`ladderOp`).

**Evidence.** Sections 2.2 and 2.3. The drill for `g:pret-vs-imperfect`, played at A1 in the zero run:

- Block "Read and pick. Read carefully: the small words matter." All 9 cards are meaning questions with random English distractors. Every one has the same reason: `Era tarde y llovía. means "It was late and it was raining."`, whichever sentence was on screen.
- Block "Your turn. First choose, then type, then change it around." Nothing is chosen. Every "choose" became a whole sentence: "When I called Vale, she was in a meeting." → *Cuando llamé a Vale, estaba en una reunión.*, with the reason "Here is how Spanish says it."

So the decision that defines this lesson, scene or event, is never isolated in a drill. `g:subj-wanting` shows the same pattern at u21.

There are three separate faults.

1. **Gaps are always on the main verb, never on the taught feature.** For the 132 grammar nodes with no tense (articles, adjectives, pronouns, prepositions, relatives, comparatives) a gap tests an unrelated verb. At u8, an older item on `g:quantifiers` (node for *mucho*, *bastante*, *demasiado*) was `Esos vecinos ___ demasiado.` (hablar), card `choose:u07-0227`: the learner conjugates *hablar* and never touches the quantifier. The `answerBelongs` guard exists in reviews (`cards.ts:384`) but not in practice (`cards.ts:697`, `707`). The rung still moves: `stepLadder` uses `item.op`, so conjugating *hablar* climbs the ladder for `g:quantifiers`, and a fallback translation counts as a "choose" pass.
2. **Multi-clause and compound sentences are unparseable,** which is every subjunctive and every pret-imperfect sentence. Most upper-level grammar is multi-clause by nature.
3. **Recombine is unreachable.** Rung 3 practice exists only for a node drilled at rung 3 (`ladderOps`), and each node is normally drilled once, at rung 0. Older points go through `ladderOp`, which turns recombine into transform ("nothing to re-inflect"). In 120 perfect sessions, with 35 grammar nodes at rung 3 and 41 drills, the op appeared **0 times**. The earlier audit's fix wired the op. It records a scripted test that climbs a node "in four sessions", and `tests/compiler/ladder.test.ts` constructs a node at rung 3. Neither covers the real unit sequence, where a node is normally drilled once.

**Learner consequence.** The scaffold that DeKeyser's skill account needs (declarative knowledge, then guided proceduralisation) exists on the teach day through authored your-turn items. Then it disappears. The next day the learner goes from reading to translating a two-clause sentence, with a generic reason on failure. That is a large jump, it sits at the highest cognitive load, and it lands on the hardest material. The easy structures, by contrast, get the full ladder.

**Proposed fix: add one field and author it.**

Add to `BankSentence` an optional `focus`: `{ span: [from, to], node, options?: string[], why? }`. It marks where in the Spanish the node's feature lies, and optionally the plausible wrong forms.

- At build time, a burn job fills `focus` for every target row of grammar and contrast nodes (about 20,000 rows), reviewed by the gate. The gate can verify the span and that the distractors are real forms.
- `chooseItem` and `typeFormItem` read `focus` first and fall back to the verb only for tense nodes. This gives gaps in any clause, on any feature: *Dudo que Vale ___ hoy* (venga, viene), *Trabajo ___ la mañana*, *el ___ que* (cual, que).
- Cue with meaning, not with the infinitive alone, when the feature is a choice.
- Make `recombine` reachable: when a known node at rung 3 appears as an older point, re-serve one of its seen sentences for re-inflection, instead of forcing an unseen one. Keep the "novel pass" requirement honest by renaming it, or tie it to a real recombination.
- Give the ladder a rung between cloze and free translation for multi-clause work: *sentence building* from tiles (P10).
- Make the fallback chain visible. A compile diagnostic should report when a planned rung cannot be delivered, and the gate should fail a node with too few rungs available.

**Evidence tier.** Guided practice before independent production: Established. Skill specificity (practice what you will need): Strong (DeKeyser 1997; DeKeyser & Sokalski 1996). The field and its gate: engineering.

### P4. High: structured input falls back to tests that can be passed without reading the form

**Locus.** `cards.ts:685` to `695`, `input.ts`, `compile.ts:976`.

**Evidence.** Section 2.2: at u45, 84% of the structured input block fell back. The fallback is `meaningCard`: three English options, two taken at random from the same unit. For *Nadie ha llegado todavía.* the distractors were a question about the lease and "We haven't been to a coastal town yet", so one known word is enough. The reason shown is for a different sentence: `¿Has estado en Cartagena? means "Have you been to Cartagena?"`.

Where it works it is excellent. "Which one is said to one friend: *¿Dónde has estado este año?* / *¿Dónde he estado este año?* / *¿Dónde hemos estado este año?*" is a textbook form-meaning mapping task, with the time words stripped so the verb carries the signal. But `structuredInput` covers 8 features and tries them at random. The 19,405 items it could build from the rows I checked are 66% tense and 20% person; mood accounts for 3.5%, por or para 1%, copula 0.3%. Those are the features that matter most at B1 to C1.

**Learner consequence.** Input practice is meant to force attention to the form that carries meaning. Against random distractors, the learner skims for a known word, so nine cards of "Read carefully: the small words matter" teach them not to.

**Proposed fix.** Remove the random-distractor fallback from structured input. In order of preference: use the `focus` field to build a real minimal pair; use the node's authored read-and-pick items (they are designed for this, and a re-serve is allowed); else skip the card and spend the time elsewhere. Fix the reason line: never show a reason naming another sentence. For the mood feature, extend `MOOD_FRAMES` beyond *aunque*, *cuando* and *decir que* to the taught frames, using `focus`.

**Evidence tier.** Structured input with form-meaning mapping: Established (the strong claim that it beats output practice is disputed). Removing a useless test: common sense.

### P5. High: feedback rarely says why, and for the subjunctive it says the wrong thing

**Locus.** `hints.ts:80` (`classifySub`), `cards.ts:585`, `cards.ts:355`.

**Evidence.** Section 2.6: an authored or rule-bearing reason accompanies at most 6 to 11% of cards. I then ran 50 typical English-speaker errors through the real checker. These are my judgements on what each hint does:

| Outcome | Count | Examples |
|---|---|---|
| Names the real cause | 18 | ser or estar; agreement; article gender; por or para |
| Locates the slip, not the cause | 13 | `Hací la tarea` → Check the spelling. `Ayer comía pan` → when does it happen? |
| Misleading or false | 19 | see below |

Misleading cases:

| Typed | True cause | App says |
|---|---|---|
| Quiero que vienes. | Indicative for subjunctive | Check the verb ending: when does it happen? |
| Busco a alguien que habla inglés. | Unknown antecedent needs subjunctive | Check the verb ending: **who** is doing it? |
| Es importante que estudias. | Indicative for subjunctive | when does it happen? |
| Si tendría dinero, viajaría. | Conditional in the *si* clause | when does it happen? |
| No hablas. (for "Don't talk") | Negative command | when does it happen? |
| Ellos dormen mucho. | Missing stem change | There's an extra word: "ellos". |
| He escribido una carta. | Irregular participle | "escribido" isn't the word here, check the meaning. |
| Nadando es bueno. | Gerund as subject | "nadando" isn't the word here, check the meaning. |
| Voy a el banco. | Contraction | There's an extra word: "a". |
| He estado aquí por dos años. | Calque for *llevo* or *hace* | Right words, different order. |

There is no concept of mood, aspect, stem change, irregular form, or construction in `HintKind`. `sameTense ? 'who' : 'when'` is the only distinction available for a verb. So the subjunctive, the largest grammar topic from A2 to C1 (27 nodes), gets a hint that points the learner at the wrong dimension.

**What is good here.** The retry itself. One prompt, then the answer, is a sound form of feedback, and it must stay. The problem is the prompt's content.

**Learner consequence.** A learner who wrote *Quiero que vienes* is told to think about time. They change a tense, fail, and get "Here is how Spanish says it." The right lesson, "after *quiero que*, a different person needs the wish form", was taught two days earlier and is not connected. Feedback at the moment of error, when attention is highest, is wasted.

**Proposed fix: use the analyser.** Everything needed is available at runtime and deterministic.

1. `analyzeToken` on both the typed and expected verb gives tense, mood and person for each. Add kinds:
   - `mood`: "You used the plain form. After *dudo que* we need the wish form." The trigger can be read from the expected sentence with the existing `subjunctiveAfter` logic, or from `focus`.
   - `aspect`: preterite against imperfect: "Is this the scene, or what happened next?", which reuses the lesson's own language.
   - `stem-change`, `irregular-form`, `participle`: "Right verb, right tense. This one is irregular: *escrito*." The expected form's irregularity can be read from the engine.
   - `form-of-verb`: gerund, infinitive, or finite, in a noun slot.
   - `contraction`: *a el*, *de el*.
2. Link feedback to teaching. Each script has pitfalls (660 grammar, 310 contrast, 1,963 pattern, 2,933 in all), each with `wrong`, `right`, `why`. When the learner's answer aligns with a pitfall's wrong form for that node, show that pitfall's `why`. It is an authored reason, in the course's voice, already written.
3. Replace "Here is how Spanish says it." with the node's trick line (`ruleLayers(script.rule).trick`) or a one-line rule, as `usesWhy` could also do. A gloss is not a reason.

**Evidence tier.** Corrective feedback: Strong (Li 2010). Prompts over reformulation: Strong but contested (Lyster & Saito 2010, with a null multisite replication). Metalinguistic feedback in software: Established (Nagata 1993; Heift 2004, both confirmed only as citations).

### P6. High: errors do not change what the learner practises next

**Locus.** `runner.ts:372` to `429` (`scoreItem`, `noteLapse`), `compile.ts:902`, `recap.ts`.

**Evidence.**

- `noteLapse` returns early unless `item.op === 'review'`, so a miss in structured input, controlled output, remix, cued production or communicative never reaches "Before you go".
- In a practice block only the first item on a node is scored `review`; the rest are `exposure`. Failing 8 of 11 drill items has no effect on FSRS.
- `expose` counts exposure and "never moves a card". The only trace of a miss in practice is one rung step and a row for weak spots.
- `hintKind` is computed for every typed error and thrown away, except for display and multi-target splitting. If a learner's translation fails on gender agreement while the target is a word, `g:adjective-agreement` learns nothing. `creditSentence` says so explicitly: "a failed sentence never penalises the non-targets". Fair for a lapse. But the diagnosis was available.

**Learner consequence.** A learner who fails most of a drill sees the same plan next day as one who aced it, unless a threshold is crossed in weak spots and they choose to train it. The system claims adaptivity. For drills, it has little.

**Proposed fix.**

1. **Re-ask practice misses.** Any first-try miss in a practice block joins the recap queue, in a fresh sentence for the same node.
2. **Drill-level outcome.** If first-try accuracy on the drilled node is under about 60%, the node stays in `pendingDrills` for a second, shorter drill in the next session or two, with the rung reduced. This is successive relearning: retrieve to a criterion, then again across sessions.
3. **Error-to-skill routing.** A confident `hintKind` (`agreement`, `ser-estar`, `por-para`, `mood`, `aspect`) records an event against the matching grammar node, as evidence only. It does not need to be a full lapse. Accumulated events feed `remediate` and weak spots, so that a persistent agreement problem surfaces even though no lesson on it was ever "due". `attribute.ts` already contains most of this mapping.
4. **Show the learner the pattern.** "This week: 6 of your misses were about *ser* and *estar*." That is honest, motivating and diagnostic.

**Evidence tier.** Retrieval to criterion across sessions: Strong for memory (the successive relearning work of Rawson & Dunlosky; I confirmed the paper, not its numbers). Error-tagged learner models: Established in intelligent tutoring, Hypothesis in this form.

### P7. High: FSRS treats very different evidence as the same, and abstract skills as flashcards

**Locus.** `learner.ts:454`, `471`, `589` (`isLearned`), `cards.ts:444` (`reviewCard`), `compile.ts:460`.

**Evidence.**

- A receptive review passed on "Which one says this?" with random distractors earns the same Good as a typed es to en translation. These formats are 16 to 22% of warm-up cards.
- A read-only "Remember this one?" card earns Good with no retrieval (section 2.5).
- 19.8% of reviews are bare, repeating one example. So a chunk can be reviewed on the same prompt while the design promises a fresh context, and the "no repeats" rule has been traded away silently.
- FSRS was fitted on repeated identical prompts. Here the prompt varies in format, sentence and word load, so its difficulty estimate absorbs noise from the sentence rather than the node.
- "Learned" needs stability of 60 days and one "novel pass". As section 2.10 shows, that can be three productive reviews for a whole verb paradigm, and a novel pass is any unseen sentence (480 of 549 nodes). Progress shows this number (`progress.tsx:20`).
- `novelPasses` is documented as "recombination" (`state.ts`), and `isLearned`'s comment says "≥ 1 passed recombination review". No recombination happened (P3).
- The constant block headed "Recognition-only maintenance" describes the reverse: the productive card survives and the receptive card is suspended. `TUNING_LOG` repeats the wrong name.

**Learner consequence.** The memory model is less sure than it looks, in both directions: inflated by weak recognition passes, deflated by false lapses. "Learned" overstates ability, which risks the illusion of knowing (Soderstrom & Bjork 2015 on performance versus learning).

**Proposed fix.**

1. **Weight evidence by format.** A random-distractor recognition pass grades Hard at most, and only for its own direction. Better: replace those distractors with near neighbours (`englishVariants`, other forms of the same word, or same-frame sentences), so a pass means something.
2. **No free passes.** A read-only card scores exposure only. Fix the nodes with no segments (`p:te-presento-a`, `x:saber-poder`).
3. **Rotate `segments(node)`** for bare cards, as `learnRetrieval` already does (`cards.ts:519`), and report bare share as a gate metric.
4. **Separate word memory from grammar skill.** Keep FSRS for lexemes and chunks, where it fits. For grammar and contrast nodes, add a mastery estimate: accuracy over the last N diverse attempts across at least K different verbs or frames and at least 2 formats, plus latency (P9). Mastery, not stability, should decide "learned" for a grammar node.
5. **Rename honestly.** "Novel pass" should mean a new sentence; "recombination" should mean recombination.

**Evidence tier.** Better distractors: Established. Skill practice over many varied exemplars: Strong in outline (DeKeyser 1997). The specific mastery estimate: Hypothesis. Worth testing against the log.

### P8. High: the time model is unrealistic, and honest timing stalls the course for placed learners

**Locus.** `learner.ts:72` (`TIMING_PRIOR_SECONDS = 10`), `compile.ts:283`, `budget.ts`, `tools/sim/profiles.ts`, `placement.ts` (`perDayBudget`).

**Evidence.** Section 2.11. The review budget is computed from `secondsPerReview`, whose prior is 10 seconds, and the average simulator profile is 10 seconds. Yet the same file sets `translate: 35`, `type: 25`, `transform: 30`. Whole-sentence typed items are about 40% of warm-up, and the mean answer at u45 is over 7 words, on a phone. `TUNING_LOG` records one correction of this kind already ("`SECONDS.learn` 35→55: what the player really takes").

At 15, 30 and 45 seconds, a placed learner spent 76% (u20) and 90% (u45) of 21 sessions in review-only mode. I ran only 21 days, so I cannot say when it ends. In the simulator, moving from 10 to 25 seconds adds 38% to the A1 calendar. Placement's window is sized by `secondsPerReview` at its 10-second prior, which is why "day-1 due 1.9 min" looked safe.

The live learner's measured pace will correct this estimate, which is the problem: once the pace is measured, the throttle fires. Nothing corrects the intake.

**Learner consequence.** Someone placed at B1 or B2 gets weeks of reviews and no new content, right after placement, when motivation is highest. Worse, the review diet is the one in P1. Note that the owner wants B2 and C1 sessions to be long, not throttled.

**Proposed fix.**

1. Cost each review by its planned format. Replace the single `spr` with per-format seconds, measured per learner and blended with the `SECONDS` priors. Use them in `dueMinutes`.
2. Set the simulator's `secs` by format and level, and re-tune `BAND_WARMUP_MINUTES` and new-item caps against honest numbers. This will likely lower intake or raise warm-up budgets. Both are real trade-offs, and the owner should choose them with data.
3. Let the warm-up mix respond to load. Under backlog, prefer cloze and recognition on high-stability cards and keep sentence production for at-risk cards (lower retrievability).
4. Re-tune placement: seed fewer active cards. Seed-known nodes could stay suspended until first encountered in a sentence, so the review load is driven by actual use.
5. Never let a day be fully review. Keep a floor of reading and one new item, except under severe backlog.
6. Add a diagnostic: a "stall" alert in the simulator for placed learners.

**Evidence tier.** Measured timing rather than assumption: Established. Effects on learners: Hypothesis.

### P9. High: dose and strand balance fall short of what the labels imply

**Locus.** `budget.ts`, unit map, `content/story`.

**Evidence.** Sections 2.7, 2.8, 2.9.

**Learner consequence.** Reading is how vocabulary depth, collocation and grammar-in-context develop beyond explicit study, and it is how a learner meets a word in many uses. A word taught at B1 is met in a median of one later chapter. So B1 to C1 words depend entirely on flashcard-like review. A learner who finishes the course will have read about one short novel (87,000 tokens; Nation counts 120,000 tokens per novel). That is too little to read "increasingly sophisticated material" comfortably, and far short of the amounts that drive incidental growth. Fluency is close to zero: the learner rarely does anything they already know, quickly.

**Proposed fix.**

1. **Build a graded reading library at build time**, separate from lessons and from the story path. Target at least 500,000 tokens, A1 to C1, written to the existing gate. Short graded books in many genres (news, history, crónica, how-to, opinion, travel, Colombian regional stories), with no cards or scoring. This is the largest single gain in input, and it fits the owner's rule that build-time model drafting goes through the gate. Reading at 150 words a minute, 15 minutes a day gives about 800,000 tokens a year.
2. **Recycle on purpose.** Have the library's generator prefer words taught in the last 200 days, so B1 and later words appear 8 to 12 times after teaching. Measure with the script used here.
3. **Reward reading minutes** on the home screen and count them in streaks, so that reading is not a chore after the lesson. Read-only days should be legitimate days.
4. **Say what the CEFR labels mean.** "Covers C1 content" and "tested at C1" are different claims. Until a validated measure exists, avoid implying the second.
5. **Give fluency a place.** See P10.

**Evidence tier.** Graded reading supports vocabulary: Strong (Nation 2014; Uchihara et al. 2019), with the caveat that per-word gains are modest (14 to 43% in Pellicer-Sánchez & Schmitt 2010, via a secondary source) and that reading is complementary to deliberate study, not a replacement. Balanced strands: Established.

### P10. Medium: missing formats, no fluency practice, and no latency in grading

**Locus.** `src/exercises/*`, `runner.ts:33`, `budget.ts:158`.

**Evidence.** Section 2.1 lists what is absent. `gradeOf` uses tries only. `ms` is recorded but never used for grading. Timed recall exists only on minimum tier, which most learners rarely use. Timed reread and scene rerun are fluency tasks, and they are skippable (`softBlock`).

**Learner consequence.** A correct answer in 5 seconds and one in 40 seconds are treated alike, though only the first suggests an automatised skill. Skill acquisition is gradual, skill-specific, and shows up as speed before it shows up in free use. There is no step between gap-fill and free translation. Learners also cannot practise noticing errors, a skill useful for self-editing at B2 and above.

**Proposed fix.**

1. **Sentence building** from tiles, as a rung between cloze and translation, for multi-clause structures. Include one or two distractor tiles (the wrong mood form). It is the only way to scaffold word order, clitic placement and clause structure without typing load.
2. **Fix-the-sentence.** The 2,933 authored pitfalls are ready-made error-correction items. Present `wrong`, ask the learner to retype it right, and show `why`. Use from B1, after the structure is taught, so that the error is recognised rather than taught.
3. **Sprints.** A two-minute timed run of known material, at the end of drill days: easy forms, all retrieved fast, scored by rate. Nation's fluency condition is that material is already known.
4. **Latency-aware review for grammar.** At high mastery, a slow correct answer counts as "not yet automatic". Use each learner's own distribution, and never penalise typing speed: compare within format.
5. **Protect the rereads.** They are the app's main fluency work and should not be first to go.

**Evidence tier.** Fluency needs dedicated practice on known material: Established (Nation 2007; Nation 1989 on repetition under time pressure). Repeated reading raises speed: Established (Taguchi, Gorsuch and colleagues). Latency as a mastery signal: Hypothesis (Suzuki & DeKeyser 2017 distinguish automatised explicit knowledge from implicit knowledge, and the timed-test literature is contested). Error correction practice: Hypothesis. Sentence tiles: Established in apps, with little direct research. Keep them as scaffolding, not an end state.

### P11. Medium: mechanical transforms produce meaningless Spanish

**Locus.** `ladder.ts:215` (`transformsOf`).

**Evidence.** Of 335 transforms played, 71 (21%) were on questions, with results like:

- *¿Usted es profesor o estudiante?* → *¿Yo soy profesor o estudiante?*
- *¿Cuántos años tienes, Simón?* → *¿Cuántos años tengo, Simón?*
- *¿Cómo están ustedes?* → *¿Cómo estoy yo?*
- *¿Y tú, Simón? ¿Cómo estás?* → *¿Y tú, Simón? ¿Cómo no estás?*

Also, three instructions ("Say it about yourself", "Say it to a friend", "Make it negative") account for 70% of transforms. Fragment hints call names and non-verbs verbs: "Start with the verb: vale…", "tomás…", "cómo…", "para…", "nada…".

**Learner consequence.** The learner conjugates with no meaning attached and sees sentences no one would say. Mechanical practice may build form accuracy but not form-meaning mapping, and it undermines trust.

**Proposed fix.** Drop person transforms on questions (keep *tú* to *usted* register shifts, which have a real purpose). Drop negation on wh-questions. Give transforms a reason: "Now you're telling Vale", "He disagrees". Fix fragment hints with `finiteCandidates` and name detection.

**Evidence tier.** Meaning-bearing practice over meaningless drill: Established, though the strong "drills are out" claim is contested.

### P12. Medium: free production is not checked for the point being taught

**Locus.** `check/personal.ts:170`, `cards.ts:598`, `blocks/teach.tsx` (`Personal`).

**Evidence.** I ran 14 test answers containing a clear error. 13 passed:

| Check | Input | Result |
|---|---|---|
| Personal, `g:subj-doubt` | Dudo que Vale viene mañana. | Pass, with "The form is right." This is the script's own listed pitfall. |
| Personal, `g:estar-gerund` | Estoy comer pan. | Pass |
| Personal, `g:perfecto-experience` | Yo he ir a Cartagena muchas vez. | Pass |
| Respond, *¿Qué has hecho en tu vida?* | He comer mucho en Bogotá. | Pass |
| Respond, *¿De dónde eres?* | Soy Toronto de la. | Pass |
| Respond, *¿Dónde vives?* | Vivo en casa grande y blanco muy bonita son. | Pass |

The only failure was a tense mismatch. `checkPersonal` looks for any form of the node's verb, so *dudo* satisfies `g:subj-doubt`, and the screen then says "The form is right." (`teach.tsx`), which here is false. It does show the script's hook sentence for comparison. "Answer for yourself" shows no model: after a pass, `answer` is the learner's own input. This is a limit of the no-AI rule, but less of one than it appears. `checkWriting` already has `subjunctiveAfter`, `anyVerbInTense` and `verbForm`.

**Learner consequence.** Output's value is noticing the gap (Swain 1985; Swain & Lapkin 1995). Telling the learner "The form is right" about the exact error the lesson warned against removes that noticing, right after teaching against it. Repeated uncorrected output risks entrenching the error.

**Proposed fix.** Give each grammar node a declarative check: its target constraint for `personal` and `respond`, taken from the writing checker's vocabulary (`subjunctiveAfter: dudo que`). Check learner text against the node's pitfall `wrong` patterns. Always show a model after a pass, on both cards. Say plainly what was checked: "Your *venga* is right. We can't check the rest." Never say "The form is right" unless the form was actually checked. This keeps the honest stance the file's header already takes.

**Evidence tier.** Output with noticing: Established. Rule-based constraint feedback: Established here (the app's own writing checker).

### P13. Medium: transfer is never measured

**Locus.** `compile.ts:1171` (`checkpointDay`), `blocks/writing.tsx:122`, `learner/metrics.ts`.

**Evidence.** The checkpoint's reading check is `comprehend`, a meaning question with two random English distractors, scored as exposure. Self-check is self-report. Scenes and writing produce exposure only ("Reading, scenes, writing: implicit exposure, never a scored review"). `delayedAccuracy7d` and `28d` measure review accuracy, in the same format as practice. Nothing tests a taught structure in a new task after a delay, and nothing reports it.

**Learner consequence.** Neither the learner nor the owner can tell whether the app's objective has been met. Passing reviews may mean only that the review task has been learned (Morris et al. 1977 would predict exactly this).

**Proposed fix.** Add a spaced transfer probe: 28 and 90 days after a node is introduced, one task in a context never used in practice, chosen from scenes or writing tasks whose `focus` is that node, scored on the node's constraint. Report it as the main outcome metric. The redesign document already names this as "the main metric" ("accuracy on delayed retrieval and on new recombinations"), but the app doesn't measure the recombination half. Failed probes feed `remediate`. Also add a periodic unassisted reading speed and comprehension check on an unseen text.

**Evidence tier.** Retrieval supports transfer: Strong (Butler 2010). The probe design: Established assessment practice. Its use as a product metric: Novel.

### P14. Medium: new-word teaching spends the same effort on easy and hard words

**Locus.** `cards.ts:517` (`learnRetrieval`), `order.ts`, `otherNodes`.

**Evidence.** From u8: *la idea* is presented, then asked with "potato | idea | crow", then typed in English, then gapped. *el hotel* is asked with "plate | people", typed as "hotel", gapped, and so on. *el aeropuerto* the same. Each costs 3 retrievals, about a minute. Distractors are random nodes of the same kind, scored only for length and band. The first two rounds are recognition or es to en, so one of three is production. `LEARNING_STEPS_MIN` is 3, stopping after two correct in a row.

**Learner consequence.** Cognates, which English speakers learn more easily (de Groot & Keijzer 2000), take the same minute as opaque words. Random distractors make round 0 trivial. Nakata (2017, from a secondary summary) found 5 within-session L1 to L2 retrievals beat 3; 3 mostly-recognition retrievals are less than that, though the recap and spaced reviews partly make up for it.

**Proposed fix.** Flag transparent cognates at build time. Present them in a sentence, with one production retrieval, and spend the saved time on opaque, high-frequency words. Teach the systematic patterns (-ción, -dad, -oso) once, as an explicit tool. Choose distractors by near meaning or form. For opaque productive words, raise the rule to at least 2 production retrievals.

**Evidence tier.** Cognate advantage: Strong in outline (confirmed via secondary sources). Efficiency gain from skipping steps: Hypothesis.

### P15. Medium: confirmed crash for a learner placed at unit 2

**Locus.** `learner.ts:386` to `393` (`seedKnown`), `learner.ts:508`, `placement.ts:414`.

**Evidence.** `npx vite-node tools/playtest/render.ts 2 7` fails on day 2 every time with `FSRSValidationError: Invalid delta_t "-1"` at `Learner.creditSentence`. `seedKnown` sets `last_review = dueAt − stability`. At u2, stability is 10 and the window is at least 14 days, so some cards have `last_review` in the future. Partial credit then calls `next()` on them. `run.score` is called from an event handler with no guard. Placements at u3 to u7 did not crash in 8 sessions, but the condition (window larger than stability) is not excluded for them.

**Learner consequence.** A placed learner's session can break mid-card, the first time a partial credit hits such a card.

**Proposed fix.** In `seedKnown`: `last_review: Math.min(spec.at, c.dueAt − days × DAY_MS)`. Add a regression test placing at each of u2 to u10. I did not change anything.

**Evidence tier.** Bug.

### P16. Low: interleaving is by look, not by structure, in most of the session

**Locus.** `order.ts:110` (`interleave`), `compile.ts:1002`.

**Evidence.** `interleave` mixes card formats, not structures. Drills include about 40% older items, but these are mainly verb gaps off target (P3), and remix is on 2 to 4 review days in 14 at most, 2 to 4% of time. The cumulative warm-up is a true mixed retrieval across sessions, which is the condition under which Pan et al. found the benefit.

**Consequence and fix.** Warm-up gives most of the benefit already, so this is low. Once `focus` exists, older items become on-target, and remix can add near-neighbour structures: subjunctive frames together, past tenses together.

**Evidence tier.** Strong to Established, conditions as in section 1.

### P17. Low to medium: cognitive load is well managed at the start of a lesson, less so at the end of a day's effort

**Locus.** `teachflow.ts`, `budget.ts`, script `yourTurn` prompts.

**Evidence.** Intrinsic load is handled well: one grammar point a session, new items three at a time, the rule split into a trick and a rest (`ruleLayers`), examples before the rule. Worked examples before problems is what cognitive load theory recommends (Sweller 1988; Sweller et al. 2019).

Two sources of avoidable load remain. Sessions grow from 48 cards at A1 to 67 at C1, while most of the new load is typing: 66 words a session rising to 209, before writing. And many script items ask for a one-word decision but require the whole sentence (291 of 1,297 grammar your-turn items, 22%, say so outright): "Pick and type the whole sentence: *Nunca ___ montado a caballo.* (*he* or *ha*)". On a phone, typing *Todavía no he leído el contrato* to choose *leído* spends attention on the keyboard rather than the choice. Scaffolding is also the same at every level. There is no fading for strong learners, and the expertise reversal effect suggests guidance that helps novices can stop helping or even hurt as knowledge grows (Kalyuga 2007).

**Fix.** In your-turn items, accept the single word for a choice item at rung 0 and ask for the sentence later. Once `focus` exists this is free. Fade by rung: learners at rung 2 or above skip read-and-pick and go to production. Budget sessions by keystrokes as well as cards (P8).

**Evidence tier.** Cognitive load and worked examples: Established. Fading by expertise: Established outside L2, Hypothesis here.

### Principle scorecard

| Principle | Verdict | Basis |
|---|---|---|
| Comprehensible input | **Honoured** for quality; **violated** for volume | Reading gate strong; 87,000 tokens; 10 to 13% of time |
| Explicit instruction | **Honoured** for grammar; **not delivered** for contrasts and most patterns | 172 full scripts; 0 contrast script cards; patterns light or none |
| Active recall | **Honoured** | 55 to 61% typed |
| Spaced repetition | **Honoured** in schedule; **weakened** by evidence quality | FSRS intervals sound; P1, P7 |
| Retrieval practice | **Honoured**, target misaligned | Whole-sentence recall, marked against one model |
| Interleaving | **Partly** | Warm-up yes; drills mostly off target; contrasts absent |
| Desirable difficulty | **Honoured** by generation and spacing; **violated** by unwinnable items | A difficulty is desirable only if the learner can respond to it (Bjork & Bjork 2011, via summaries). *Éramos cuatro gatos* from a plain gloss, or a false "wrong word", is not |
| Cognitive load | **Mostly honoured** | P17 |
| Skill progression | **Honoured at A1, violated above A2** | Sections 2.2 and 2.3 |
| Productive versus receptive | **Honoured** | Two cards, policy, unlock |
| Memory and retention | **Honoured** for words; **unproven** for grammar skills | P7 |
| Error correction | **Partly** | Good retry flow; 38% of diagnoses misleading in my test; no error-contingent practice |
| Transfer | **Not measured** | P13 |
| Reading and contextual learning | **Quality high, recycling low** | Median 1 later chapter for B1 and up |
| Vocabulary acquisition | **Honoured** for direct learning | Learn rounds; review; cognates wasteful |
| Balance of strands | **Violated** | 69 to 84% language-focused |

### Where the code claims what it does not deliver

| Claim | Where | Reality |
|---|---|---|
| "~60% latest, ~40% older points + a known contrast" | `compile.ts:979`, `budget.ts:149` | No contrast rows exist, so the contrast share is 0 |
| "contrasts only once both sides are known" | `compile.ts:11` | True, and unreachable as practice |
| "First choose, then type, then change it around." | `labels.ts` | Most "choose" items are full translations above A2 |
| "Read carefully: the small words matter." | `labels.ts` | At u45, 84% of cards were random meaning questions |
| "Recombine (the mastery test)" | `cards.ts:635`, `recombine.ts:2` | 0 cards in 120 perfect daily sessions. Reachable in free-practice checkpoint |
| "Learned = … ≥ 1 passed recombination review" | `learner.ts:586` | Any unseen sentence counts |
| `novelPasses // (recombination)` | `state.ts` | Same |
| "Recognition-only maintenance" | `learner.ts:26`, `TUNING_LOG` | The receptive card is suspended; production is what remains |
| "The form is right." | `teach.tsx` | Passes *Dudo que Vale viene* |
| "no repeats" | `compile.ts:20` | True of ledgered content; 19.8% of warm-up cards are bare examples outside the ledger |
| "Every card carries its own checker and ONE plain-English reason" | `cards.ts:4` | Carries a line; often not a reason (section 2.6) |
| "a scripted runner test climbs a node from choose to recombine" | `docs/rebuild-audit.md:225` | True of the scripted test. Not of the real unit sequence |
| Comment concedes false rejections | `weak.ts:2` | FSRS still takes them at full weight |
| Retention, Calendar and Targets tables | `content/_reports/sim-summary.md` | Empty |

## 4. What the application does well and must be preserved

These are not compliments. Each protects something that a careless fix could damage.

| Keep | Why it matters | Support |
|---|---|---|
| **Production as the default.** 55 to 61% typed, a quarter to a third whole sentences | Most of what P1 to P3 fix depends on this. Do not "solve" false rejection by moving to multiple choice | Strong (Karpicke & Roediger 2008; Kang et al. 2007; Shintani et al. 2013) |
| **One retry with a hint, then the answer** | A prompt asks the learner to repair; this is the best-supported part of the feedback design. Improve the hint, not the flow | Strong but contested |
| **Tries map to grades** (Good, Hard, Again) | Simple and honest | Established |
| **Separate receptive and productive cards, with unlock on a later day** | Respects skill specificity and sequences recognition before production | Strong (Webb 2005; DeKeyser & Sokalski 1996) |
| **Productive policy.** Frequent words productive; rare words receptive only | Spends production effort where it pays | Established (Nation) |
| **The teaching scripts.** Hook, examples, rule, trick, pitfalls in plain language, each rule with a usable test ("try putting *and then* in front") | Explicit instruction is the strongest single finding in this field. These are compact, which is right for cognitive load | Strong (Norris & Ortega 2000; Spada & Tomita 2010) |
| **One grammar point a session, drilled within 3 sessions** | Limits intrinsic load and gives spacing from day one | Established |
| **Rule recall before the reminder** (`RuleRecall`) | Retrieval of a known example before re-exposure | Strong in principle |
| **The content gate.** `requires ⊆ known`, reading coverage, and the compiler's delay when words are slipping | Few apps can say what the learner has been taught at every word. It is the foundation for `focus`, recycling and transfer probes | Established; the threshold itself is contested |
| **Chunks before grammar, with `unpacks`** | Lets learners say useful things early, and later analyse them | Established (Boers et al. 2006; Boers & Lindstromberg 2012 note intervention limits) |
| **Warm-up as cumulative retrieval** | Mixed, spaced, lowest retrievability first. This is the condition under which interleaving worked for Spanish tense (Pan et al. 2019) | Strong |
| **Structured input where it works.** Time words stripped so the verb carries the signal | A careful design that a less thoughtful fix would drop. Extend it with `focus` | Established |
| **Repeated reading and scene reruns** | The app's main fluency work | Established |
| **Attribution honesty** in `attribute.ts` and `weak.ts` | "A miss that cannot be pinned on one node stays a miss". Extend this thinking to FSRS | Good engineering |
| **Determinism and the event log** | Every experiment proposed here needs them | Enabling |
| **The story** | Sustained narrative gives reading a reason. It should remain the spine; the library in P9 is additional | Motivation evidence not reviewed here |

The FSRS choice also stands. The intervals of 3, 11, 35 and 101 days are consistent with Cepeda et al. for long retention. The issue in P7 is what counts as evidence, not the scheduler.

## 5. Missing capabilities

1. A third verdict: a valid answer that the checker cannot confirm.
2. Scoring that judges the target within a sentence.
3. A marked focus on each target sentence, which enables gaps on any feature, in any clause.
4. Authored contrast practice, and contrast teaching in the session.
5. Error taxonomy with mood, aspect, irregularity and construction.
6. Error-contingent practice: misses that come back.
7. A grammar mastery estimate separate from word memory.
8. Sentence building, error correction, fluency sprints.
9. Per-format timing in the compiler and simulator.
10. A graded reading library, with deliberate recycling of taught words.
11. Transfer probes and a transfer outcome metric.
12. An evaluation loop. There is no way to tell whether a change improves learning. `metrics.ts` and the event log are a good start, but the app has no controlled comparison and no outcome beyond review accuracy.

## 6. Recommended improvements

Ranked by expected effect on the owner's objective: a learner who understands, remembers, builds sentences and uses them. Cost is rough: S is days, M is weeks, L is a burn or larger.

| # | Change | Fixes | Cost | Support |
|---|---|---|---|---|
| 1 | **Target-scored production with three verdicts, plus engine-level acceptance** | P1, part of P7, P8 | M | Established; size of effect Hypothesis |
| 2 | **Teach contrasts in the session, using the existing scripts** | P2 | S | Strong |
| 3 | **`focus` field: burn over grammar target rows; node-aware gaps** | P3, P4, P5, P16 | L | Established, Strong for skill specificity |
| 4 | **Contrast rows: 40 to 80 per contrast, forced choice** | P2 | L | Strong but not unanimous |
| 5 | **Feedback from the analyser and pitfalls** | P5, P12 | M | Strong for feedback in general |
| 6 | **Misses come back; repeat a failed drill; route errors to grammar nodes** | P6 | M | Strong for relearning; Hypothesis for routing |
| 7 | **Per-format time costs; re-tune budgets, intake and placement** | P8 | M | Established |
| 8 | **Evidence-weighted review; no free passes; better distractors; rotate bare cards** | P7 | S to M | Established |
| 9 | **Grammar mastery estimate over diverse attempts** | P7 | M | Strong in outline; Hypothesis in detail |
| 10 | **Graded reading library, 500,000 tokens with recycling** | P9 | L | Strong, with modest per-word gains |
| 11 | **Sentence building and fix-the-sentence, from existing pitfalls** | P3, P10 | M | Established, Hypothesis |
| 12 | **Sprints and latency-aware mastery** | P10 | M | Established, Hypothesis |
| 13 | **Transfer probes at 28 and 90 days as the main metric** | P13 | M | Strong for the principle; Novel as a metric |
| 14 | **Cognate fast path** | P14 | S to M | Strong in outline, Hypothesis on gain |
| 15 | **Meaningful transforms** | P11 | S | Established |

Where evidence is weakest, test rather than assume. The event log and determinism allow a simple within-learner design: hold out a random, stable 10% of nodes from a change, and compare delayed first-try accuracy and transfer probes against the rest. That is a **Novel** use of the app's architecture, inexpensive, and it would make Fluidez one of very few apps that can show its own effects.

### How the stages look now, and after these changes

| Stage | Now | After |
|---|---|---|
| 1. Recognise | Good on teach day; drill often falls back to random meaning questions | Real minimal pairs for every grammar and contrast node |
| 2. Understand | Strong for grammar; absent in session for contrasts and most patterns | Contrasts taught; rule reminders at the point of error |
| 3. Apply with guidance | Authored on teach day, then mostly gone above A2 | Focused gaps and sentence building on any feature |
| 4. Produce independently | Plentiful, but judged against one sentence | Judged on the target, with a fair path for alternatives |
| 5. Unfamiliar contexts | Scenes and writing exist; unmeasured | Spaced transfer probes that feed remediation |
| 6. Natural and fluent | Rereads and reruns only; no speed signal | Sprints, latency-aware mastery, much more reading. Speech stays out of scope by owner decision |

### Does the app produce genuine learning or short-term recognition?

Mostly genuine retrieval, with spaced, typed production well above typical levels. It is not short-term recognition. The honest worry is what is being retrieved. For words and chunks, retrieval is direct and will work. For grammar choices, the learner mostly retrieves a remembered translation of a sentence, is rewarded for matching the bank, and is rarely made to decide between two forms for a reason. That builds a stock of memorised sentences and vocabulary, which is valuable. It builds the ability to construct novel accurate sentences less well than it could, and the app cannot currently tell the difference.

## 7. Uncertainties and limitations

**The biggest one: no real learners.** Everything here comes from code, content, simulation and research. I have no data on real learners' answers, error rates, time per card or retention. Claims about learning effects are inferences.

**The tests are mine.**

- The paraphrase test is purposive, not a random sample of learner answers. It shows the checker's capacity to accept valid alternatives, not how often real learners produce them. My alternatives are my own judgement of valid Spanish. I excluded 9 of 100 as debatable before counting, and others may still disagree. The rate of false rejection in real use is unknown.
- The hint classification (18, 13, 19) is my judgement on 50 errors I chose as typical.
- Timing at 15, 30 and 45 seconds is an assumption drawn from the app's constants, not a measurement. Placed runs lasted 21 days, so I cannot say how long the stall lasts. All runs used perfect answers; real error rates would add load.
- The 14-session samples show what came up in those sessions. Percentages such as "84% fallback at u45" depend on which nodes were drilled, so read them as indicative of the pattern. Generator coverage in section 2.3 is the more stable measure.
- The on-target measure is an approximation of `answerBelongs` that I wrote.
- Strand percentages use driver pace and my classification of blocks. Honest pace would raise language-focused time further.

**What I did not inspect.**

- I did not drive the browser UI. Cards came through the headless driver, and block behaviour was read in code, with parts of `blocks/*` unread.
- I read the teaching scripts only as a sample: about 5 grammar scripts in full or nearly so, 1 contrast, and aggregate statistics for all 916. Quality judgements on scripts are from that sample.
- Story chapters were analysed quantitatively, not read for pedagogy. Scenes and writing were sampled by structure only.
- I did not evaluate vocabulary selection against a Spanish frequency list, or the order of grammar. Other specialists cover those.
- I did not run the gate or the test suite. Nothing in `app/` was changed.
- `sim-summary.md` is stale; I ran my own simulator pass on A1 and A2 only.

**Limits of the sources.** Many sources were confirmed at abstract or secondary level only, marked in the Appendix. I could not confirm effect sizes for Norris & Ortega, Goo et al., Li, Kim & Webb or Lyster & Saito from what I could access, so I give directions only. Most research concerns classrooms, English as L2, or word lists, not self-study Spanish apps. The Cambridge hours are for English.

**Limits set by standing decisions.** No listening means one of Nation's strands is half absent and no aural processing or speaking fluency develops. Stage 6 can only be partial, and a learner who finishes will still need a large amount of listening elsewhere. No runtime AI means free production cannot get general correction. Constraint checks narrow the gap but will not close it. Both are legitimate choices, and users should be told about them plainly.

## 8. Suggested implementation priorities

**Do now (days). No content needed.**

1. Fix the placement crash (P15).
2. Rewrite false hints: no `"X" isn't the word here` without proof; "Close. We'd say…" instead (P1).
3. Stop grading read-only cards as Good, and rotate segments on bare cards (P7).
4. Remove the random fallback from structured input; use authored read-and-pick instead; fix the reason line (P4).
5. Teach contrasts with the existing scripts on their drill day (P2).
6. Drop person transforms on questions and negation on wh-questions (P11).
7. Stop saying "The form is right" unless it was checked; show a model after "Answer for yourself" (P12).
8. Correct misleading names and comments (`Recognition-only maintenance`, recombination in `isLearned` and `state.ts`, the block lead "First choose, then type…" when not true), and regenerate or delete `sim-summary.md`.

**Next (weeks). Engine work.**

9. Target scoring, three verdicts, engine-level acceptance (P1). Do this before any further tuning, since it changes review load.
10. Per-format timing, then re-tune budgets and placement with the simulator set honestly (P8).
11. Analyser-based hints: mood, aspect, irregular, construction; pitfall matching (P5).
12. Practice misses return; repeat a failed drill; route errors to grammar nodes (P6).
13. Fix-the-sentence from the 2,933 pitfalls (P10).
14. Node-level constraints for personal and respond (P12).

**Then (burns). Content through the gate.**

15. `focus` on grammar target rows (P3), accepted alternatives on production rows (P1), and contrast rows (P2). These three can share one burn over the same files.
16. Graded reading library, with recycling targets (P9). Largest content cost and the largest gain in input.

**After that. Measure and extend.**

17. Transfer probes and the outcome metric (P13).
18. Grammar mastery estimate and latency (P7, P10). Validate against probes before showing it to learners.
19. Sentence building (P10), cognate fast path (P14).
20. Holdout comparison for each change where evidence is weakest.

**Order matters in two places.** Fix the checker (item 9) before tuning time budgets (item 10), since false lapses inflate the load being tuned. And add `focus` (item 15) before investing further in the ladder, since the ladder is unreachable without it.

## Appendix: references and how far each was verified

Key: **F** full text fetched and read. **A** abstract or publisher record seen. **S** findings seen only in secondary sources. **C** citation confirmed, findings not seen.

| Reference | Used for | Verified |
|---|---|---|
| Adesope, O., Trevisan, D. & Sundararajan, N. (2017). Rethinking the use of tests: a meta-analysis of practice testing. *Review of Educational Research*. https://doi.org/10.3102/0034654316689306 | Testing effect | S |
| Bird, S. (2010). Effects of distributed practice on the acquisition of second language English syntax. *Applied Psycholinguistics* 31, 635 to 650. https://research.uaeu.ac.ae/en/publications/effects-of-distributed-practice-on-the-acquisition-of-second-lang/ | Spacing in L2 grammar | S |
| Birnbaum, M., Kornell, N., Bjork, E. & Bjork, R. (2013). Why interleaving enhances inductive learning. *Memory & Cognition* 41(3), 392 to 402. https://doi.org/10.3758/s13421-012-0272-7 | Discrimination | S |
| Bjork, E. & Bjork, R. (2011). Making things hard on yourself, but in a good way. In *Psychology and the Real World*. https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-introducing-desirable-difficulties-into-practice-and-instruction-bjork-and-bjork.pdf | Desirable difficulties | S |
| Boers, F., Eyckmans, J., Kappel, J., Stengers, H. & Demecheleer, M. (2006). Formulaic sequences and perceived oral proficiency. *Language Teaching Research* 10(3), 245 to 261 | Chunks | S |
| Boers, F. & Lindstromberg, S. (2012). Experimental and intervention studies on formulaic sequences. *Annual Review of Applied Linguistics* 32, 83 to 110. https://www.cambridge.org/core/journals/annual-review-of-applied-linguistics/article/experimental-and-intervention-studies-on-formulaic-sequences-in-a-second-language/A2ACDF54604CFAC4443240748360C403 | Chunks | S |
| Butler, A. (2010). Repeated testing produces superior transfer of learning. *JEP: LMC* 36(5), 1118 to 1133. https://profiles.wustl.edu/en/publications/repeated-testing-produces-superior-transfer-of-learning-relative-/ | Transfer | A |
| Cambridge English. Guided learning hours. https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours | Dose | A, figures partly secondary |
| Cepeda, N., Vul, E., Rohrer, D., Wixted, J. & Pashler, H. (2008). Spacing effects in learning: a temporal ridgeline of optimal retention. *Psychological Science* 19(11), 1095 to 1102. https://www.evullab.org/pdf/CepedaVulRohrerWixtedPashler-PS-2008.pdf | Spacing | F (abstract and front matter read) |
| de Groot, A. & Keijzer, R. (2000). What is hard to learn is easy to forget. *Language Learning* 50, 1 to 56 | Cognates | S |
| DeKeyser, R. (1997). Beyond explicit rule learning. *SSLA* 19, 195 to 221. https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/beyond-explicit-rule-learning/B71581638BF89873F61F03EA1E747E5A | Skill acquisition | A |
| DeKeyser, R. & Prieto Botana, G. (2015). The effectiveness of processing instruction in L2 grammar acquisition: a narrative review. *Applied Linguistics* 36, 290 to 305. https://doi.org/10.1093/applin/amu071 | Processing instruction debate | C |
| DeKeyser, R. & Sokalski, K. (1996). The differential role of comprehension and production practice. *Language Learning* 46(4), 613 to 642 | Skill specificity | S |
| Ellis, R. (2005). Measuring implicit and explicit knowledge of a second language. *SSLA* 27(2), 141 to 172. https://doi.org/10.1017/S0272263105050096 | Timed measures | A |
| Goo, J., Granena, G., Yilmaz, Y. & Novella, M. (2015). Implicit and explicit instruction in L2 learning. In *Implicit and Explicit Learning of Languages*, 443 to 482. https://doi.org/10.1075/sibil.48.18goo | Explicit instruction | A |
| Heift, T. (2004). Corrective feedback and learner uptake in CALL. *ReCALL* 16(2), 416 to 431 | Software feedback | C |
| Hu, M. & Nation, P. (2000). Unknown vocabulary density and reading comprehension. *Reading in a Foreign Language*. https://nflrc.hawaii.edu/rfl/item/43 | Coverage | S |
| Hulstijn, J. (2007). The shaky ground beneath the CEFR. *Modern Language Journal* 91, 662 to 666. https://dare.uva.nl/id/3786d3ae-2321-4c82-9158-9f6af8efb234 | CEFR limits | S |
| Kalyuga, S. (2007). Expertise reversal effect and its implications for learner-tailored instruction. *Educational Psychology Review* 19(4), 509 to 539. https://doi.org/10.1007/s10648-007-9054-3 | Fading | A |
| Kang, S., McDermott, K. & Roediger, H. (2007). Test format and corrective feedback modify the effect of testing. *European Journal of Cognitive Psychology* 19(4 to 5), 528 to 558. https://www.gwern.net/docs/spaced-repetition/2007-kang.pdf | Recall over recognition | S |
| Karpicke, J. & Roediger, H. (2008). The critical importance of retrieval for learning. *Science* 319, 966 to 968. https://pubmed.ncbi.nlm.nih.gov/18276894/ | Retrieval | A |
| Kim, S. & Webb, S. (2022). The effects of spaced practice on second language learning: a meta-analysis. *Language Learning* 72(1), 269 to 319 | Spacing | S |
| Kremmel, B. et al. (2023). Unknown vocabulary density and the 98% figure, replicating Hu & Nation (2000). *Language Learning*. https://doi.org/10.1111/lang.12622 | Coverage caution | A |
| Laufer, B. & Girsai, N. (2008). A case for contrastive analysis and translation. *Applied Linguistics* 29(4), 694 to 716. https://doi.org/10.1093/applin/amn018 | Translation | S |
| Laufer, B. & Hulstijn, J. (2001). The construct of task-induced involvement. *Applied Linguistics* 22(1), 1 to 26 | Involvement load | S |
| Li, S. (2010). The effectiveness of corrective feedback in SLA: a meta-analysis. *Language Learning* 60(2), 309 to 365. https://researchspace.auckland.ac.nz/handle/2292/24985 | Feedback | A |
| Lyster, R. & Ranta, L. (1997). Corrective feedback and learner uptake. *SSLA* 19, 37 to 66 | Feedback types | S |
| Lyster, R. & Saito, K. (2010). Oral feedback in classroom SLA: a meta-analysis. *SSLA* 32, 265 to 302. https://doi.org/10.1017/S0272263109990520 | Prompts | A |
| McDermott, K. et al. (2014). Both multiple-choice and short-answer quizzes enhance later exam performance. *JEP: Applied*. https://doi.org/10.1037/xap0000004 | Multiple choice | C |
| Morris, C., Bransford, J. & Franks, J. (1977). Levels of processing versus transfer appropriate processing. *JVLVB* 16, 519 to 533 | Transfer | S |
| Nagata, N. (1993). Intelligent computer feedback for second language instruction. *Modern Language Journal* 77(3), 330 to 339 | Software feedback | S |
| Nakata, T. (2017). Does repeated practice make perfect? *SSLA* 39(4), 653 to 679. https://resolve.cambridge.org/core/journals/studies-in-second-language-acquisition/article/does-repeated-practice-make-perfect-the-effects-of-withinsession-repeated-retrieval-on-second-language-vocabulary-learning/F14BA8A576CD2563D14CEA46E35D842E | Retrieval count | S |
| Nakata, T. & Suzuki, Y. (2019). Mixing grammar exercises facilitates long-term retention. *Modern Language Journal* | Interleaving grammar | S (title and context only) |
| Nation, P. (1989). Improving speaking fluency. *System* 17(3), 377 to 384 | Fluency | S |
| Nation, P. (2007). The four strands. *Innovation in Language Learning and Teaching* 1(1), 2 to 13. https://openaccess.wgtn.ac.nz/articles/journal_contribution/The_four_strands/12552167 | Strand balance | S |
| Nation, P. (2014). How much input do you need to learn the most frequent 9,000 words? *Reading in a Foreign Language* 26(2), 1 to 16. https://files.eric.ed.gov/fulltext/EJ1044345.pdf | Input volume | F |
| Norris, J. & Ortega, L. (2000). Effectiveness of L2 instruction. *Language Learning* 50, 417 to 528 | Explicit instruction | S |
| North, B. (2007). The CEFR Common Reference Levels: validated reference points and local strategies. Council of Europe. https://rm.coe.int/16805c3896 | CEFR | S |
| Pan, S., Tajran, J., Lovelett, J., Osuna, J. & Rickard, T. (2019). Does interleaved practice enhance foreign language learning? *Journal of Educational Psychology* 111(7), 1172 | Spanish tense interleaving | S (with a 2024 TCU null replication, https://repository.tcu.edu/handle/116099117/66764) |
| Pashler, H., McDaniel, M., Rohrer, D. & Bjork, R. (2008). Learning styles: concepts and evidence. *PSPI* 9(3). https://digitalcommons.usf.edu/psy_facpub/1765/ | Learning styles | A |
| Pellicer-Sánchez, A. & Schmitt, N. (2010). Incidental vocabulary acquisition from an authentic novel. *Reading in a Foreign Language* 22(1), 31 to 55. https://nflrc.hawaii.edu/rfl/item-detail/207 | Reading gains | S |
| Rawson, K. & Dunlosky, J. (2011). Optimizing schedules of retrieval practice. *JEP: General*. https://doi.org/10.1037/a0023956 | Successive relearning | C |
| Rohrer, D. & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science* 35. https://www.gwern.net/doc/psychology/spaced-repetition/2007-rohrer.pdf | Interleaving | S |
| Rowland, C. (2014). The effect of testing versus restudy on retention. *Psychological Bulletin*. https://doi.org/10.1037/a0037559 | Testing effect | S |
| Shintani, N., Li, S. & Ellis, R. (2013). Comprehension-based versus production-based instruction. *Language Learning* 63(2), 296 to 329 | Input and output | S |
| Soderstrom, N. & Bjork, R. (2015). Learning versus performance. *Perspectives on Psychological Science* 10(2), 176 to 199 | Performance is not learning | S |
| Spada, N. & Tomita, Y. (2010). Interactions between type of instruction and type of language feature. *Language Learning* 60(2), 263 to 308. https://www.eas.utoronto.ca/node/790 | Explicit instruction | A |
| Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science* 12, 257 to 285 | Cognitive load | C |
| Sweller, J., van Merriënboer, J. & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review* 31, 261 to 292. https://link.springer.com/article/10.1007/s10648-019-09465-5 | Cognitive load | A |
| Suzuki, Y. & DeKeyser, R. (2017). Exploratory research on second language practice distribution. *Applied Psycholinguistics* 38(1), 27 to 56 | Spacing and aptitude | A |
| Swain, M. (1985). Communicative competence: some roles of comprehensible input and comprehensible output. In Gass & Madden (eds.) | Output | S |
| Swain, M. & Lapkin, S. (1995). Problems in output and the cognitive processes they generate. *Applied Linguistics* 16, 371 to 391 | Noticing | S |
| Taguchi, E., Gorsuch, G., Takayasu-Maass, M. & Snipp, K. (2012). Assisted repeated reading. *Reading in a Foreign Language* 24(1), 30 to 55. https://nflrc.hawaii.edu/rfl/item-detail/252 | Repeated reading | S |
| Uchihara, T., Webb, S. & Yanagisawa, A. (2019). The effects of repetition on incidental vocabulary learning. *Language Learning* 69(3), 559 to 599. https://doi.org/10.1111/lang.12343 | Repetition | S |
| VanPatten, B. & Cadierno, T. (1993). Explicit instruction and input processing. *SSLA* 15, 225 to 244 | Structured input | C |
| Webb, S. (2005). Receptive and productive vocabulary learning. *SSLA* 27, 33 to 52. https://cambridge.org/core/journals/studies-in-second-language-acquisition/article/receptive-and-productive-vocabulary-learning-the-effects-of-reading-and-writing-on-word-knowledge/DDF362AE7B13D1949B1CD591DA2F3414 | Skill direction | A |
| Webb, S. (2007). The effects of repetition on vocabulary knowledge. *Applied Linguistics* 28, 46 to 65 | Repetition | S |
| Wong, W. & VanPatten, B. (2003). The evidence is IN: drills are OUT. *Foreign Language Annals* 36(3), 403 to 423. https://web.pdx.edu/~fischerw/courses/advanced/methods_docs/pdf_doc/wbf_collection/0351_0400/0385abs_FLA_Wong_DrillsAreOUT.pdf | Drills debate | A |
| Yanagisawa, A. & Webb, S. (2021). To what extent does the involvement load hypothesis predict incidental L2 vocabulary learning? *Language Learning* 71(2) | Involvement load | S |
| Ye, J., Su, J. & Cao, Y. (2022). A stochastic shortest path algorithm for optimizing spaced repetition scheduling. *KDD 2022*, 4381 to 4390. FSRS benchmark: https://github.com/open-spaced-repetition/fsrs4anki/wiki/abc-of-fsrs | FSRS | A |
