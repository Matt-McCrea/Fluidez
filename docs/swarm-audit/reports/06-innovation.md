# 06. Product Innovation and Competitive Research

Role: Product Innovation and Competitive Research Specialist.
Date: 2026-11-01. Branch: rebuild.

Status of this file: written in sections as the work proceeded. Part A was written first, before I had opened any Fluidez content or code, so that it would not be anchored on what the app already does. Its only inputs were the brief's standing decisions and what I already knew about language learning.

---

## Part A. The blank page (written before looking closely at Fluidez)

The question: if I were designing the ideal Spanish app for an English-speaking adult from nothing, under these constraints (no listening, no AI at runtime, text only, deterministic, offline, neutral Latin American Spanish, learners do not choose lesson length), what would it contain?

### A0. The thesis

The failure of nearly every language app is not bad content. It is that the app measures the wrong thing. Apps measure exposure and completion; the goal is unprompted, accurate, fast retrieval of forms and meanings in new sentences. A learner can finish a Duolingo tree, or pass a Babbel review, and still be unable to build a sentence they have not seen.

So the blank-page product starts from one decision: **the thing being optimised is the distance between what the learner can recognise and what they can build unaided, in a sentence they have never seen, weeks after they last practised it.** Everything else is in service of closing that gap and proving it closed.

Second decision: **adults are not children. They want to understand the machine.** An English-speaking adult has a strong model of English and a weak or absent model of grammar terminology. The best teaching of Spanish to that adult is contrastive, explicit and short, then immediately converted into use. The right mental picture is a good private tutor who explains in two sentences why, then makes you do it twenty times in different sentences, and comes back to it next Thursday without warning.

### A1. What the ideal product contains

**1. A knowledge model that distinguishes five states, not one.** For every form, word, pattern and contrast: (a) recognised in a text, (b) understood in context, (c) produced when cued, (d) produced unprompted in a new sentence, (e) produced fast. Almost every product collapses these into "learned". The whole product hangs off this. Progress displays, session building and promotion all use it. "Mastered" means state (d) survived a delay, not that a lesson was completed.

**2. A real diagnostic.** Not a placement test that picks a starting unit, but an adaptive probe across a skill graph that returns a map: here is what you own, what you half own, what you have never met. Fifteen minutes. Every later session keeps refining it, so placement is never a one-time verdict and a mistaken one heals itself.

**3. Grammar as a machine you can operate.** Reading a grammar explanation is low value; operating one is high value. For any sentence, the learner can turn dials: person, number, tense, polarity, object pronoun, formality. The Spanish changes in front of them with the changed parts lit, and the English changes in step. A learner discovers that "lo" jumps in front of the verb, that the stem change disappears in nosotros, that the subjunctive arrives when "creo" gets a "no". This is possible only if the app owns a real generator of Spanish. Explanation becomes a few sentences plus an instrument.

**4. Meaning contrasts as the core exercise.** The grammar of Spanish that defeats English speakers is mostly not forms but choices: ser/estar, por/para, preterite/imperfect, subjunctive/indicative, se, personal a. These are taught best by forcing the learner to attach different meanings to two forms: two sentences differing by one choice, and the learner must say what each means, or pick which fits a situation. This is processing instruction. It precedes production, and it returns at every level with subtler cases. The contrast is the lesson, not an afterthought.

**5. A sentence builder that goes from scaffold to nothing.** Progression for each structure: read it, choose it, assemble it from tiles, fill the crucial part, type the whole thing from English, build it from a situation with no English at all. The scaffold is withdrawn per learner, per skill, based on evidence, not by lesson position. This is scaffold fading done by a machine, and is exactly what a textbook cannot do.

**6. Translation as the backbone of production, done honestly.** English prompts with exact, aligned translations, accepting all legitimate variants. With free-form input, the app must say precisely what differed. Word-level alignment, so a wrong word is shown against the right one. This is the only form of production a deterministic app can grade reliably, so it should be excellent.

**7. Diagnosis of misconceptions, not marking of errors.** A library of named bugs, most of them L1 transfer: "am hungry" as "estoy hambriento", "go to + infinitive" dropped "a", "por" for "for" in every sense, adjective before noun, "me gusta" with the English subject, false friends. The app's feedback names the bug and asks the learner to repair the answer first, rather than giving the answer. Over time the learner has a personal fingerprint: "you do not drop subject pronouns; you confuse gender on abstract nouns; you put object pronouns after the conjugated verb". The fingerprint decides what they practise.

**8. A personal reading life.** A graded library so large the learner never runs out, ordered by their own known-word coverage rather than a generic level. Every text is at 95 to 98 percent known. Every word, phrase and grammar form is tappable and explained in context. Tapping is itself signal: the app learns what was not known without asking. A serial story gives the reason to come back. Reading speed and coverage are tracked. A word met in reading flows into the personal vocabulary queue with that sentence as its context.

**9. "Explain this sentence" everywhere.** Any Spanish sentence, anywhere in the app, can be opened into a structural view: what the verb is and why this tense, what each pronoun refers to, which word is the subject when it comes after the verb, what is a fixed chunk. It is the patient tutor who answers "but why is it that way here?", which is the question adults most ask and apps never answer.

**10. Vocabulary that is never a list.** Words taught as collocations and frames, with their grammar: "depender de", "soñar con", "tomar una decisión", "hacer falta". Depth beyond the first meaning. Frequency ordered at the bottom, domain and interest ordered higher up. Retrieval in context with spacing, and cloze against sentences the learner has not seen, so memory is not bound to one sentence.

**11. Fluency as a separate, deliberate strand.** Speed is a skill. Dedicated sessions on material already known, under gentle time pressure: conjugating, sentence building, reading. Personal records. A learner sees that "tuviera" went from 6 seconds to 1.2. Typing as a proxy for speaking is imperfect but real. There would also be rehearsal aloud, self graded, because the learner must eventually say this.

**12. Progressive writing with honest feedback.** Short constrained tasks up to multi-paragraph argument. Without AI, feedback comes from constraint checks (did you use the target forms, did the verbs agree, known error patterns), self-assessment against a rubric, and comparing with a model answer in a way that forces noticing. Reformulation is powerful and can be scripted: show the model, have the learner mark what is better, then rewrite from memory.

**13. Spaced review that is invisible and honest.** No separate review chore. Sessions are compiled with due material woven in. Grammar and contrasts are scheduled as well as words. Implicit credit: practising a hard skill refreshes the easier skills inside it, so nobody grinds what they demonstrably already use.

**14. Proof of progress that is real.** No points. Evidence: a C1 sentence you can now build; a text you could not read in March and can now read at twice the speed; your error rate on the subjunctive in a chart; a cold can-do test that you passed on a Tuesday with nothing warning you. Periodic unannounced delayed checks. Honest statements such as "you have stopped being able to do this."

**15. Motivation built on identity and a small daily ritual.** Strava, not slot machine. A story you want to finish. One short daily puzzle that has real language in it. A week map. Personal records in fluency. Streaks, if any, forgiving. No leagues.

**16. A complete look-up layer.** Conjugator, dictionary, grammar reference, and searchable example corpus, all offline, all connected: a word in a story links to its grammar; a misconception links to its explanation; the reference shows you which parts you have already learned.

**17. Transfer to life.** Situational scenes (ordering, arguing with a landlord, emails, a complaint) in which the learner chooses and types. Consequences in the story. Near the top, register: formal and informal, written and spoken, Colombian and pan-Hispanic.

**18. An exit to real Spanish.** At some level the learner must leave the app. The ideal product pushes them out: a pasted text analyser that reads any real article against what they know, reading recommendations, and a printable brief for a human tutor saying exactly what to drill. (The brief for a tutor is my own guess at a good idea; see later whether it survives.)

### A2. What the ideal product deliberately does not contain

Leagues, hearts, gems, lessons that are mostly tapping, matching games with no language load, mascots, word lists as primary content, grammar rules without practice, choice of lesson length, generic streak shame, an uneven level system that says "B1" because the unit number is high.

### A3. The five properties I would hold any Spanish app to

1. Every minute has language load: the learner is retrieving or comprehending, not tapping.
2. The app knows what the learner can do unaided, and shows it, and is right.
3. The explanation of a choice is always one tap away, and is true.
4. Production gets harder as the learner gets better, and support disappears on evidence.
5. The learner reads a lot of Spanish they actually want to read.

### A4. The hypotheses I expect to test against Fluidez

Written before inspection, so that I can be proved wrong:

- H1. Fluidez's real assets (generator, tagger, graph, bank) are under-exposed to the learner: it probably uses them to build sessions but does not let the learner operate them.
- H2. The learner's knowledge state probably collapses to a smaller number of states than the five above.
- H3. "Explain this sentence" probably does not exist as a universal view, because the data would have to be carried to the runtime.
- H4. There is probably no explicit fluency strand with time as a measured dimension.
- H5. Misconceptions are probably catalogued in the checker but not surfaced as a personal fingerprint.
- H6. Reading is probably a story only, not ordered by personal coverage.
- H7. Reviews may be in the session but not credited implicitly through hierarchy.

---

## Part B. The audit

## 1. What was investigated

**Competitive and research evidence.** About 50 web searches and page fetches on the products named in the brief, three more I added because they turned out to be the closest rivals (Kwiziq, Bunpro, Satori Reader), and two adjacent tools (Lichess, Keybr). I favoured independent reviews, forums and papers. Most review sites are affiliate-driven, so I treat their ratings as opinion. Research claims carry a verification status in section 9.

**Fluidez, read as code.** `src/learner` (state, events, weak, metrics, policy), `src/check` (hints, match, personal, writing), `src/exercises` (input, reinflect, recombine, ladder), `src/engine` (analyze, tagger types and lexicon), `src/compiler/compile.ts` (review grouping, drill, remix, contrast picking), `src/ui` (read, teach, writing, practice, card, weak, progress, story, home, reference, settings, bundle, placement, attribute, store).

**Fluidez, measured.** Seven throwaway scripts in the scratchpad ran the real engine, tagger, checker and content, for about a dozen measurements. Results are in 2.3.

**Fluidez, played.** `tools/playtest/render.ts` at unit 34 (2 days) and unit 14 (16 consecutive days, 2,612 lines of cards). I did not drive the browser UI for this report; I read the components and ran the same code paths headlessly.

## 2. Evidence

### 2.1 What the market teaches, and what is worth stealing

Reference numbers in square brackets point to section 9. "Steal" is judged for this learner: an English-speaking adult who wants real command of Spanish, text only.

| Product | What it really does well | Where it falls short | Lesson for Fluidez | Verdict |
|---|---|---|---|---|
| Duolingo | Habit formation at scale. | Best-known efficacy paper: n=48, about 27 hours, two of three authors are Duolingo staff [1]. In July 2026 a course upgrade marked unlearned content as done and scrambled progress; a clear majority of poll respondents said they were hurt [2]. | The danger is silently rewriting what a learner is assumed to know. Fluidez rebuilds on a 20-minute schedule, and a learner's record sits in one browser, so a content change can do the same. | Steal nothing mechanical. Take the warning. |
| Babbel | Explicit grammar inside lessons, by reviewers' consensus [3]. | Thin past early levels in the reviews I could find; evidence weak. | Fluidez already goes well beyond this. | Nothing to steal. |
| Busuu | Native speakers correct your writing [3]. | Feedback covers scripted exercises; grammar called shallow by some reviewers [3]. | A human is the only honest grader of open meaning. | Steal the idea, not the feature: see F15, tutor brief. |
| Pimsleur | Anticipation: you answer before you hear it. | Very small vocabulary, weak literacy (reviews, some from competitors) [4]. | Retrieval before reveal, which Fluidez already does. | Nothing new. |
| Rosetta Stone | Early engagement. | No L1 support. In Nielson's study of US government staff attrition was severe [5]; a secondary source reports only 14% passed 10 hours and one finished the protocol (unconfirmed by me). | Unsupported self-study software loses nearly everyone. L1-free immersion is not a virtue for adults. | Take the warning. |
| Anki and Spanish decks | The memory engine. | Cards train the card. The popular Top 5000 deck has the highest thumbs-down share of the large decks in one comparison (vendor source) [6]. | FSRS is already here. Fluidez's bank is the answer to "cards train the card", except for contrasts (P1). | Done. |
| MorphMan (Anki) | Orders sentences so each has one unknown [7]. | Segmentation errors. | The compiler's retained-coverage gate is this idea, and stronger. | Already stolen. |
| Clozemaster | Huge sentence volume, good for vocabulary in context at upper levels [8]. | No grammar explanation, by its own admission [8]. | Volume without explanation plateaus. Fluidez has both halves. | Steal the feel of volume for B2/C1 fluency, F8. |
| Lingvist | Clean adaptive cloze [9]. | "Teaches in a vacuum": no grammar, monotonous [9]. | As above. | Nothing new. |
| LingQ | Known-word percentage on every text; import anything [10]. | Buggy; reading progress can mark words known by accident [10]. | Personal coverage percentage is the number a reader wants. Import is the road to real Spanish. | Steal the percentage (F9) and import (F14). |
| Readlang | Better in-context explanation than LingQ, say users [10]. | Weak status tracking [10]. | Explanation beats tracking while reading. | Steal: sentence-level rescue, F0.3 and F1. |
| Memrise | Community courses people loved. | Moved them off the app in 2024 and took real backlash [11]. | A learner's own collection is sacred. | Keep saved words durable and exportable. |
| Language Transfer | Builds thousands of sentences from a few bridges from English [12]. | One-person project; evidence is testimonial; audio [12]. | The insight is transfer rules: English already gives you Spanish. Fluidez does not teach this at all (P9). | Steal the idea, F10. |
| Dreaming Spanish | An hours ledger and a roadmap make input feel like progress [13]. | A library, not a learning system; no recall (partly competitor claims) [13]. | A cumulative ledger toward a named milestone works, with no gamification. | Steal for reading words: F7. |
| Lingoda | Real teachers, Sprint commitment deal [14]. | Refund terms disputed and strict [14]. | Commitment devices create resentment. | Reject. |
| Seedlang | Tapping a word you got wrong shows its grammar (developer's description) [15]. | Video-based, so out of scope. | Grammar should be one tap from an error. | Part of F1. |
| Conjuguemos | Timed, self-graded conjugation, teacher-friendly [16]. | No independent evidence; many SEO pages. | Timed drilling is a commodity. Generation is not. | Nothing beyond F8. |
| SpanishDict | Dictionary, conjugator and lessons in one place [17]. | Lessons less polished than the tools [17]. | One search box: Fluidez's Reference already does this. | Done. |
| StudySpanish | Clear, tested grammar, and verb drills [17]. | Dated, self-motivated [17]. | Plain clarity wins. Fluidez's scripts share this. | Done. |
| Practice Makes Perfect | Volume of written exercises, 2,500+ [18]. | Static; answers missing for some activities [18]. | A book cannot adapt or check. | Nothing new. |
| Aula Internacional | Action-oriented course [19]. | I could not confirm its method from independent sources; what I say next is from my own knowledge. Discovery of rules from samples, then communicative tasks. | Fluidez's "Read these. Spot what they have in common." is this move. | Keep. |
| ¡Dímelo tú!, Gramática de uso, Butt and Benjamin | My searches found nothing usable, so this is my own unverified knowledge. Gramática de uso is the model of left-page rule, right-page contrastive practice. Butt and Benjamin is the reference for why a native chose a form. | Static. | The reference standard for C1 explanation: usage notes, not rules. | Inform F1 at C1. |
| **Kwiziq** (added) | Brain map of grammar points, retests what you lack [20]. The closest real rival for diagnosis. | Grammar only, dense text, nothing on production; quiz-based [20]. | It infers weakness from quizzes. Fluidez can infer it from typed production. | Beat it: F2, F6. |
| **Bunpro** (added) | Grammar SRS with cloze and nuance hints [21]. | "Being able to do Bunpro grammar does not translate into writing output." "I ended up memorizing the example sentences." [21] | Both failures are avoidable here because of the bank and the ladder. | Take the warning: it describes Fluidez's contrasts today (P1). |
| **Satori Reader** (added) | Graded reading, sense-correct glosses, one-click SRS from reading [22]. | Hand-made, so scarce; not truly graded [22]. | The gold standard for explained reading, and it is written by humans. Fluidez could generate most of this. | Steal: F1, F9. |
| Math Academy | Diagnostic that returns a knowledge profile; spaced repetition across a hierarchy; picks reviews that knock out several due topics [23]. | No formal studies of FIRe, by its author; encompassing graph is hand-built; critic says it reinforces shallow understanding [23]. | Diagnostic as a map, not a cut. Fluidez's multi-target reviews and bounded partial credit already do most of the rest. | Steal the diagnostic: F6. Reject the encompassing graph. |
| Khan Academy | Four honest skill levels; Mastered needs a unit test or challenge; skills can drop on quizzes, not on practice [24]. | Effects appear only for the roughly 5% who use it as prescribed [25]. | Demotion on tests only is a good rule. Expect adherence to be the real problem. | Steal the level logic: F6, F7. |
| Brilliant | Every screen asks you to do something [26]. | Depth uneven; reviewers suspect engagement outruns rigor; no rigorous study found [26]. | Interaction must force a prediction, or it is decoration. | Steal the rule, F11. |
| Lichess, chess.com | Accuracy by tactical theme; rating that moves with difficulty and speed; a timed rush that does not touch the rating [27]. | Themes hidden or limited for some users [27]. | Three distinct modes: rated truth, themed weakness, timed fun. | Steal: F2 themes, F8 rush. |
| Wordle | One a day, same for everyone, about 3 minutes, shareable and spoiler-free [28]. | Commentary, mostly secondary. | Scarcity is a design tool. | Test: F13. |
| Strava | Fixed segments make a personal record mean something [29]. | Comparison can sour the activity [29]. | A record needs a fixed course. Fluidez's bests are keyed to an arbitrary verb set, so they cannot be compared (P11). | Steal segments: F8. |
| Monkeytype | Saves results locally, plots speed and consistency over a test [30]. | Heatmap unconfirmed. | A single honest number per run, and a trend. | Steal: F8. |
| Keybr | Generates practice aimed at your weakest keys, unlocks new letters only at target speed [31]. | Algorithm detail from ports, not from Keybr. | This is exactly what a conjugation engine allows for verbs. | Steal: F8. |

The clearest single finding: **nobody sells what Fluidez could sell.** Products with explanation have little practice (Kwiziq, Satori, grammar books). Products with practice have little explanation (Clozemaster, Lingvist, Bunpro). LLM-backed explanation is available from several apps but cannot be trusted to be right or the same twice. A deterministic system that can explain any sentence it shows, truthfully, offline, and remember how a person went wrong has no direct competitor that I could find. Absence from my searches is not proof, so treat that as a strong impression.

### 2.2 The blank page against Fluidez

| # | Ideal (Part A) | Fluidez today | Verdict |
|---|---|---|---|
| 1 | Five knowledge states | Receptive and productive cards, `rung` 0 to 3 (choose, type, transform, recombine), `novelPasses`. No speed. Grammar states never shown to the learner. | **Better than I predicted**; hidden |
| 2 | Diagnostic returns a map | 20-item ladder returns one unit number (`Probe.result(): number`); `applyPlacement` seeds everything before it | Partial |
| 3 | Grammar you can operate | Verb tables and workouts only | Missing |
| 4 | Contrasts at the core | Superb structured-input generator for 8 features; the 94 authored contrasts are disconnected from it (P1) | Split: best and worst of the app |
| 5 | Scaffold withdrawn on evidence | The output ladder does this per node | **Strong** |
| 6 | Honest translation | Variant expansion, one prompted retry, closest answer shown | **Strong** |
| 7 | Misconceptions named and remembered | Hint categories only, discarded after display (P2, P3) | Weak |
| 8 | Personal reading life | 219 linear chapters, good reader, no sentence English (P5), no personal ordering | Partial |
| 9 | Explain this sentence | Absent. The tagger runs only at build time and its spans are thrown away | Missing |
| 10 | Words with their grammar | 124 patterns carry verb-plus-preposition frames; lexemes have no collocation field; Reference shows bank examples for grammar, not words | Partial |
| 11 | Fluency as a strand | Sprint, verb workout, timed re-read exist; `ms` affects nothing (P8) | Partial |
| 12 | Progressive writing | 875 tasks with live constraints and models; learner's text discarded (P4) | Good, with a hole |
| 13 | Invisible, honest review | Multi-target reviews, per-node blame, bounded partial credit | **Strong, ahead of most** |
| 14 | Proof of progress | Delayed accuracy and checks are good; "You can now" is a completion tick (P6) | Mixed |
| 15 | Motivation without tricks | Story, streak with freezes, no leagues. No ritual | Good, thin |
| 16 | Complete look-up | Reference is strong and personal | **Strong** |
| 17 | Transfer to life | 270 scenes with branching turns | Good |
| 18 | Exit to real Spanish | Nothing. No import, no export, not even a backup (P10) | Missing |

Hypotheses from A4: H1 and H3 and H6 confirmed. H2 and H4 half wrong: the state model is richer and fluency work exists, but speed is unmeasured. H5 was too generous: the checker has no catalogue; the catalogue sits unused in the content (2,933 pitfalls). H7 was wrong: `creditSentence` already gives capped partial credit from real evidence in the sentence, which I prefer to Math Academy's hand-weighted graph.

### 2.3 Measurements

| What | Result | How |
|---|---|---|
| Re-inflection, the raw material for dials | At least one safe transform: A1 59%, A2 48%, B1 36%, B2 34%, C1 38%. Two or more: 47, 38, 28, 25, 29%. Tense is the most available, pronoun the least (2 to 4%). | Every 10th bank sentence (7,270) through `parseClause`, `changePerson`, `changeTense`, `negate`, `pronominalise` |
| Tagger as a runtime component | 1.1 to 1.5 ms per sentence in Node. Unknown part of speech 0.1 to 0.5%. 4.6 to 6.2 grammar features per sentence, each with a token span and a graph node. Pure TypeScript with JSON data, no Node imports in `src/engine/tagger`. | Every 25th bank sentence (2,908) and all 11,316 story sentences |
| Hand check of an X-ray view | 59 features on 25 random story sentences, 5 per band, limited to the tense, clitic, subjunctive, ser, estar, reflexive, periphrasis, relative, gustar, conditional, negation families. Form right: 57 of 59. Explanation also fits this use: 52 of 59. | My own judgement, small sample. Errors: *cena* read as a verb in «21:00: cena con Vale»; *No es por nada* tagged as double negation; *llovía*, *quería*, *entraba* all labelled "What used to happen"; *se sentó* and *darse cuenta* labelled "Your daily routine" |
| Subjunctive with a named trigger | 44 to 45% of subjunctive features carry `trigger` | Same runs |
| Reader's "EN" sentence control | Offered on 0.7, 0.3, 0.0, 0.0, 0.0% of story sentences, A1 to C1 | `bundle.englishOf` over all chapters through the reader's own `sentencesOf` |
| Tap-to-gloss | Meaning on 92.6 to 93.8% of word tokens. Verb form plus explanation on 13 to 18%. Top misses besides names: *del* 353, *al* 264, *hay* 119, *veces* 59, *primer* 39, *mirando* 26 | `bundle.gloss` on every token of every chapter |
| Checker against real misconceptions | My 30-item battery of classic English-speaker errors. All 30 rejected. **Named the misconception: 0.** Helpful direction: 11. Vague: 6. **Misleading: 13.** | Real `matchTranslation`; classification is my judgement; full table in P3 |
| Pitfalls as a ready library | 2,933 authored wrong, right, why triples (g 660, p 1,963, x 310). A raw diff-signature lookup hits 20 of 30 on the battery. Of those 20, 11 give a fitting explanation, 4 partial, 5 wrong. | Diff signature from `align`; unscoped, which is why wrong hits occur |
| Contrast nodes in the bank | 94 contrast nodes: **0** bank sentences as `targets` or `requires` | Full bank scan |
| Contrast review pool | 7 contrasts have 0 aligned pairs, 84 have exactly 1. Forms plus all script items: 22 to 29 sentences | `bundle.segments`, scripts |
| Verbs the engine lacks | 145 of 973 verb lexemes (15%) have no engine entry even after removing -se: *odiar, juzgar, controlar, castigar, reportar, pelear, explorar*. `analyzeToken("odiaba")` returns nothing | Graph against `verbByInf` |
| Teaching scripts | 916 scripts, 0 with any table; no field for one. Rule text median 85 words | Script scan |
| Cognates | Rough edit-distance rule: 25, 30, 36, 20, 35% of lexemes by band. "cognate" appears once in all 916 scripts, "-tion" never, "-ción" twice | `isCognate` from `placement.ts`; rough, includes some false matches |
| Story grammar mix | Past tenses about half of finite verbs from A2. Single-clause parseable 40 to 46% | Tagger, `parseClause` |
| Mining word partners | Works, with noise. Of 394 verbs with 10+ uses, 134 have a dominant preposition, 94 have 3+ recurring noun partners. Examples in F16 | Tagger over half the bank (36,347 sentences) |

## 3. Specific problems discovered

Eleven, chosen because each one blocks a capability that matters. Numbered P1 to P11.

### P1. Critical. Contrasts are not reviewed. Some reviews are free passes.

**Locus.** `content/bank/*` (no `x:` node in any `requires` or `targets`); `src/compiler/compile.ts` `pickContrast`, the `oldSources` loop in the drill, `remix()`, and the review grouping at lines 516 to 540; `src/ui/session/cards.ts` `reviewCard`; `src/ui/components/card.tsx:191`.

**Evidence.** Contrast nodes have no sentences, so `pickSentences(contrast, 1)` returns nothing. The drill and remix code that promises "~40% older points + a known contrast" silently gets no item from the contrast. A due contrast gets `{ targets: [card.node] }` with no sentence and falls to the bare card. For `x:pret-imp` and `x:saber-conocer`, `segments` is empty, so `reviewCard` returns:

```
{ type: 'read', ask: 'Remember this one?', es: 'Llovía cuando llegué.' }
```

and `ReadView` ends with `onDone({ correct: true, tries: 1, ms: ms() })`. Pressing Next grades a Good. In the 16-day walk from unit 14, `[read] Llovía cuando llegué.` appears on two days, and `Ven, siéntate.` and `¿Quieres algo?` on two others. The other 84 contrasts have exactly one pair, so `x:lo-le` asks "I saw her yesterday." every time, for the rest of the course.

**Consequence.** The preterite and imperfect contrast is the hardest choice an English speaker faces in Spanish, and the app's own script says "It comes back in every review from here on." It does not. It returns as a sentence to look at, and FSRS records a success. The warm-up passes the outcome to `run.score`, `gradeOf` returns Good, and FSRS extends the interval on no evidence at all. The other 84 train memory of one sentence, which is the Bunpro failure in its pure form [21]. Note the generator work in `input.ts` does give real practice on eight features, so the learner is not without contrast work. The problem is that the 94 taught contrasts, the most valuable nodes in the graph, are outside it.

**Fix.** Today: a read card must never report `correct`; route it to an exposure, or better, serve script items (each contrast has 22 to 29 sentences). Next: F3, contrast sets in the bank, 40 to 60 minimal pairs per contrast, targets set to the `x:` node. Add a gate rule: a node with reviews must have a supply.

### P2. High. The most valuable data in the product is thrown away.

**Locus.** `src/learner/events.ts` `ReviewEvent`; `src/check/translate/match.ts:159`; `src/ui/components/card.tsx:25`; `src/ui/session/attribute.ts` `Evidence`.

**Evidence.** `diagnose()` computes a `HintKind` on every miss. It is used to choose a retry lead and to blame a node, then dropped. `ReviewEvent` has `at, node, dir, grade, ms, sentence, op, tries, novel, session, r, scored`. There is no field for what the learner typed or what kind of mistake it was.

**Consequence.** No error fingerprint can be built, even retrospectively. A learner's first year of mistakes is the best signal the app will ever have about them, and it is gone. Every day this stays unfixed loses data that cannot be recovered.

**Fix.** Add optional `given?: string` and `err?: string` to the event now, before any feature uses them. Cap at the last 20,000 misses if storage worries you. This is about ten lines.

### P3. High. Hints send the learner the wrong way on the hardest grammar.

**Locus.** `src/check/translate/hints.ts`, `classifySub`:

```ts
const sameTense = same.some((x) => ra.some((y) => y.tense === x.tense));
return { kind: 'verb-ending', hint: sameTense ? 'Check the verb ending: who is doing it?' : 'Check the verb ending: when does it happen?', at };
```

**Evidence.** Mood is treated as a tense, and aspect as time.

| Learner wrote | Expected | Hint | Why it misleads |
|---|---|---|---|
| Cuando llegaré, te llamaré. | Cuando llegue | "when does it happen?" | In the future. That is exactly the learner's reasoning. |
| Si tendría dinero, viajaría. | Si tuviera | "when does it happen?" | Not a time question at all. |
| Quiero que vienes. | Quiero que vengas | "when does it happen?" | The issue is mood. |
| Creo que esté aquí. | Creo que está aquí | "who is doing it?" | Same person. Mood again. |
| Caminé cuando llamó. | Caminaba | "when does it happen?" | Both are past. The issue is aspect. |
| Me gusta los libros. | Me gustan | "who is doing it?" | The learner's answer is "I am", which is the very misconception. |
| Está embarazosa. | embarazada | "Check the spelling." | It is a real word with another meaning. |
| Yo gusto el libro. | Me gusta el libro | "A small word is missing." | The structure is inverted. |
| Lavo mis manos. | Me lavo las manos | "A small word is missing." | The possessive is the problem. |
| Le lo di. | Se lo di | "who or what does it stand for?" | The referent is right. It is a sound rule. |

Thirteen of thirty were misdirecting in this way (my judgement), six were vague, eleven were useful.

**Consequence.** The hint is the moment the learner is working hardest. Prompting beats recasting exactly because the learner has to do the repair [32]. A prompt that points at the wrong dimension spends that moment on the wrong thought, and on "when does it happen?" it actively reinforces the error.

**Fix.** Immediately: split the verb branch using the analyser, which already knows: same person and tense family but subjunctive against indicative gives a mood hint; preterite against imperfect gives an aspect hint ("Both are past. Is this an event, or the background?"); conditional or future in a `si` or `cuando` clause gives its own hint. Then F2.

### P4. High. The learner's writing is discarded.

**Locus.** `src/ui/store/ui.ts`: `interface WritingMark { at: number; rubric: RubricAnswer[]; words: number; met: number; of: number }`. `src/ui/blocks/writing.tsx` `remember()`. `Personal` in `teach.tsx` keeps nothing either.

**Consequence.** A learner can write for two years and own nothing. No revision, no time capsule, no complexity trend, nothing to show a tutor. The most moving proof of progress an app can offer is your own Spanish from a year ago, and this app deletes it.

**Fix.** Store `text` in a separate IndexedDB key, not in the UI document. Do this now; it needs no feature to justify it.

### P5. High. A stuck reader has no way out.

**Locus.** `src/ui/blocks/read.tsx` `Passage`: "a small EN control after a sentence the bank can translate". `bundle.englishOf` matches exact bank strings. `StoryChapter` has `id, unit, title, text, gloss, questions, hook, rereadQuestions, requires, lexemes`, and no English.

**Evidence.** The control appears on 0.7% of A1 sentences and on none from B1 up. The code for this feature exists and works, but it has essentially no data.

**Consequence.** At B2 a 450-word chapter with one opaque sentence offers word glosses only. "More translation everywhere" is a standing decision, and 87,000 words of the best reading in the app have none. Sentence-aligned English is also the prerequisite for F4.

**Fix.** Add per-sentence `en` to chapters at build time, gated: 11,316 sentences. Hide it behind a tap; keep it off in timed re-reads, as now.

### P6. High. "You can now" means "you got past this".

**Locus.** `src/ui/screens/progress.tsx`:

```ts
const done = units.slice(0, Math.min(ui.path.unit, units.length));
...
{done.map((u) => <li key={u.id}>✓ {undash(u.canDo)}</li>)}
```

`applyPlacement` sets `path.unit`, so a learner placed at unit 30 sees thirty ticks under "You can now…" on day one, none of them earned.

**Consequence.** The owner's objective is explicit: understanding and independent use, not completing lessons. This is the one screen that says what you can do, and it reports completion. The same screen's definition of a word that has stuck is admirably strict, so the contrast is sharp.

**Fix.** A can-do is ticked only by evidence: its scene or writing task passed unaided, or a delayed novel production on its serving nodes (the graph already has `serves`). Show three states: done with evidence, you said yes, placed past it. See F7.

### P7. Medium. Tapping and saving teach the system nothing.

**Locus.** `useGloss.tap` in `read.tsx` writes nothing. `finishReading` calls `run.expose([...requires, ...chapter.lexemes])`, crediting exposure on every word of the chapter, including the ones the learner just had to look up. `grep saved src/compiler` finds nothing: saved words never enter the schedule. The Practice end screen says "This was practice only. Your review schedule is unchanged."

**Consequence.** A tap is the cleanest evidence of not knowing that the app ever receives: the learner stops reading to say so. Currently it counts in the learner's favour. Saved words are a list that goes nowhere, the failure LingQ and Satori solved years ago [10, 22].

**Fix.** A tap on a known node records a soft signal; repeated taps schedule it. Saved words join the queue. F9.

### P8. Medium. Speed is recorded and ignored.

**Locus.** `ms` is on every event; `gradeOf` uses only `correct` and `tries`; `metrics.ts` has no latency measure; `recordTime` feeds only the minute budget. `TimedRecall` shows a score and keeps no record of the run.

**Consequence.** Fluency is half the distance between knowing and using. A form produced in nine seconds counts the same as one in two. The learner never sees automaticity arrive.

**Fix.** F8.

### P9. Medium. Transfer from English is untaught.

**Locus.** Script and graph scan. Only three word-formation nodes in 916 grammar, pattern and contrast nodes (`g:diminutives`, `g:adverbs-mente`, `g:nominalisation`). "cognate" appears once in all scripts.

**Consequence.** An English speaker owns thousands of Spanish words they do not know they own. Language Transfer's whole appeal is this [12]. At A1 it is the biggest confidence gift available, and at B2 and C1 word formation is how you read past your vocabulary.

**Fix.** F10.

### P10. Medium. A multi-year record has no backup.

**Locus.** `src/ui/screens/settings.tsx` has reset only. `grep "storage.persist"` over `src` finds nothing. Everything is in IndexedDB on one device.

**Consequence.** A lost phone or a cleared browser erases the learner. From memory, unverified here: Safari can evict site storage after a period without use unless the app is installed. Worth checking. An app that asks for hundreds of hours cannot hold them this loosely. It also means Fluidez has no way to learn from anyone's use (section 7).

**Fix.** Call `navigator.storage.persist()`, add export and import of a single JSON file. Half a day.

### P11. Low. Personal bests are not comparable.

**Locus.** `bestKey`: `conjugate:${verbs}|${tenses}`. A different verb selection is a different record. Translate has one global key whose difficulty changes with what you know.

**Consequence.** Strava's lesson [29]: a record needs a fixed course. These are noise, so nobody will care about them.

**Fix.** Fixed benchmarks, F8.

## 4. What Fluidez does well and must preserve

- **The honesty of `isLearned`.** A word "sticks" only with long stability *and* a pass in a sentence never seen. No competitor I examined has a definition this strict. It is the seed of the product's identity.
- **Generators that refuse.** "Each function returns null when it is not sure" (`reinflect.ts`). The discipline of round-tripping every form through the analyser is what makes everything below trustworthy. This is the moat. An LLM cannot make this promise.
- **`input.ts`.** Minimal pairs where the feature is the only evidence, time words stripped. This is processing instruction done properly and automatically. I expected a weaker version.
- **The output ladder.** Scaffold withdrawn per node on evidence is the thing the blank page wanted.
- **One prompted retry before reveal.** It matches the research on prompts [32]. The copy is good too. The hints need fixing, the flow does not.
- **`attribute.ts`.** "A miss that cannot be pinned on one node stays a miss for every node without positive evidence, never a free pass." Exactly the right instinct, which makes P1's literal free pass an accident worth fixing fast.
- **Bounded partial credit and multi-target review.** Better than Math Academy's approach for this domain. Do not build an encompassing graph.
- **Plain copy that admits limits.** "The form is right. I can't judge the meaning, so here's one for comparison." Keep this voice in every new feature. "That's plenty for today. Your reviews need a rest to work."
- **Fair placement rules.** No cognates or names can give an item away.
- **The story.** A running legal fight over a café in La Candelaria is an unusually good frame for what comes next (F5).
- **No leagues, no hearts, no gems.** Silverman and Barasch found broken streaks reduce later engagement across seven studies [33]; the freeze design is the right mitigation, and copy that does not shame.

## 5. Missing capabilities

In the order that they matter.

1. A record of how the learner goes wrong, and any feature built on it.
2. Any explanation of a specific sentence, as opposed to a rule.
3. Grammar that is visual or operable. Zero tables in 916 scripts, and no script field for one.
4. Text-level production: everything typed is one sentence or one free task. Nothing between.
5. Sentence-level English in reading.
6. A skill-level picture of the learner, for them and for placement.
7. Fluency as a measured dimension.
8. A personal corpus: search everything you have read; see a word across twenty known-level sentences.
9. Word formation and cognate transfer.
10. Word-level grammar: which verbs take which prepositions as a property of the word, not a separate pattern.
11. Any exit: import of real text, export of the learner's record, a bridge to a human.
12. Any way to tell whether a feature works.

## 6. Recommended improvements

### 6.0 The argument in one paragraph

Fluidez has built, at great expense, the three things competitors cannot build: a generator that never lies, a tagger that knows why every word is there, and a learner record that knows what each person has met. It then uses all three only behind the curtain, to choose which sentence to show next. The tagger's knowledge is discarded at build time. The checker's diagnosis is discarded at answer time. The learner's own Spanish is discarded at the end of each task. **The strategy is to stop throwing it away and turn it to face the learner.**

### 6.1 Foundations first (F0)

Not features. Each is small, most are urgent because data is being lost, and the features below rest on them.

| ID | Do this | Size |
|---|---|---|
| F0.1 | Log `given` and `err` on every missed event (P2). Log taps and "why" opens. | Hours |
| F0.2 | Store written text (P4). `navigator.storage.persist()`, export and import a JSON file (P10). | Half a day |
| F0.3 | Per-sentence English on all chapters, gated (P5). 11,316 sentences. | Content burn |
| F0.4 | Add the 145 missing verbs. Gerund and participle reading in `analyzeToken` paths used by the gloss. Closed-class gloss table for *del, al, hay, primer*. | Days |
| F0.5 | No read card may report `correct` (P1). Mood and aspect hints (P3). | Hours |
| F0.6 | A way to evaluate. Stable per-node A/B arms from `hash32(node)`, and an optional analysis script over exported logs. See 7.2. | Days |

### 6.2 The four ideas that would make Fluidez distinctive

These four are the answer to "why this and not Duolingo, Anki or a tutor with ChatGPT?". All four are text-only, deterministic and honest, and a competitor would need Fluidez's assets to copy them.

---

#### F1. Rayos X: "Why?" on any Spanish sentence, with "More like this"

**Distinctive.** Satori Reader writes this by hand for its own texts [22]. LLM explainers can be wrong and differ each time. Nobody offers a true, generated explanation for every sentence offline.

1. **Problem.** The adult's most common question is "but why is it that form here?", and the app can only answer with a lesson about a rule. After a wrong answer the learner gets the right sentence and one line. In reading, they get one word at a time.
2. **Why it matters.** Depth of understanding is the owner's first objective. Fluidez teaches 266 grammar and contrast nodes, but the learner rarely sees them operating in the wild sentence by sentence, and nothing connects the sentence in front of them to what they were taught.
3. **How it should work.** A quiet "Why?" after every answered card and on any sentence in the reader. Opening it shows the sentence with its working parts:

```
Mi abuela quería que viniera usted, no un abogado.

quería    querer, past (imperfect), she
          "She wanted." Wanting is a state, so the describing past.

viniera   venir, past subjunctive, you (usted)
          Built from vinieron: drop -ron, add -ra.

quería que   Wanting something of someone else sends the second
             verb into the subjunctive. Past wanting, past form.
             You learned this in week 31.     See it again

More like this: 14 sentences you can already read
```

   (The sentence is real, from ch119. The tagger output is real. The wording and the week number are illustrative.)

   Layers, in order of trust. **Anatomy** comes from the engine and is always right. **Triggers** come from tagger features that carry `trigger` (44% of subjunctives today; raise this). **Why here** is shown only when certain, and for story sentences can be authored at build time and gated. Keep the codebase's own rule: refuse when not sure. My hand check found form identification reliable (57 of 59) and the node title sometimes wrong as an explanation of use (52 of 59), so the panel must state facts about the form and offer the lesson, never assert a reason from a node title. Show only a whitelist of feature families. A node not yet taught reads "Coming in week 34", and teaches nothing out of order.

   **More like this** is a graded concordance. `exampleSentences` already finds sentences the learner can read for a node; it stops at three, in one place. Extend it to any node or word, with search in Reference, listing sentences seen first. A panel is passive, so it ends with **Try one**: a single fresh item on that node.

   Engineering: `src/engine/tagger` has no Node imports and runs at about 1 ms per sentence in Node. Its data files are about 82 KB gzipped, plus the code. Load it as a lazy chunk.
4. **Acquisition.** Metalinguistic information tied to a learner's own problem. Noticing, but pulled rather than pushed. The evidence warns that highlighting alone improves noticing but not necessarily learning [34, 35], which is why the panel is on request and ends in retrieval. The concordance is data-driven learning: d=0.95 across controlled comparisons in Boulton and Cobb, with durability under-tested [36]. DDL's practical barrier is that corpora are too hard for learners. A corpus filtered to one learner's known words removes it. I found no product that does this.
5. **Fit.** A new `Explain` component reused in card feedback, reader and Reference. No compiler change. Opening logs a soft signal (F0.1).
6. **Evaluation.** Open rate by band. Next-attempt success on a node after opening, against not opening, with the selection effect stated. Hash-armed trial: half of nodes offer Try one. Primary outcome: first-try production on `recombine` items 28 days later.

**Evidence tier:** established practice for glossing and metalinguistic help, strong research for concordancing with caveats, novel experiment as a generated universal view.

---

#### F2. Mis trampas: a named misconception engine and a personal fingerprint

**Distinctive.** Kwiziq has a map from quizzes [20]. Lichess has themes from puzzles [27]. Nobody identifies named misconceptions from typed sentences deterministically and tracks them for years.

1. **Problem.** P2 and P3. All 30 classic errors were caught and none was named. 13 got a hint pointing the wrong way. "Weak spots" says "missed 3 of 5" on a tense, which is a symptom.
2. **Why it matters.** Persistent errors are what stop intermediate learners. An English speaker's errors are remarkably predictable. A good tutor is mostly a person who has seen your exact mistake many times.
3. **How it should work.** Three detection layers run after the checker fails, using what the code already computes: alignment against the closest answer, analyser readings of both tokens, and tagger features of the expected sentence.

   **Layer one, about 40 hand-written rules** for the great transfer errors, each with an id, a prompt that does not give the answer, an explanation, and a training spec:

| Rule | Detects | Prompt (before reveal) |
|---|---|---|
| `mood-after-trigger` | Indicative where expected has a `subj.*` feature, same verb | "Look at what comes before the second verb. Does it state a fact?" |
| `subj-overuse` | Subjunctive where expected is indicative after creer, pensar | "Is the speaker saying this is true?" |
| `aspect-swap` | Preterite and imperfect of the same verb | "Both are past. Is this an event, or the background?" |
| `will-after-when` | Future where expected has `conj.cuando` plus subjunctive | "English never says 'when I will arrive'. Spanish agrees." |
| `would-after-if` | Conditional in a `si` clause | "After si, not the would form." |
| `gustar-subject` | `yo gusto`, or number mismatch on gustar-type verbs | "What is doing the pleasing?" |
| `be-for-have` | ser or estar where expected has `p:tener-hambre` | "In Spanish you have hunger. You aren't hungry." |
| `body-possessive` | *mi mano*, *mis manos* with a body noun | "Whose hand is already clear." |
| `clitic-after-verb`, `se-lo` | Clitic position, *le lo* | Short, specific |
| `false-friend` | Pairs from a table: *embarazosa, actualmente, asistir, realizar* | "That is a real word. It means something else." |

   **Layer two, the 2,933 pitfalls already written.** A diff signature, scoped to the card's own nodes. Unscoped it hits 20 of 30 with 5 wrong explanations; the wrong ones came from other nodes' pitfalls, such as *Voy comer* matching a personal-a pitfall. Scoping is required. **Layer three,** the improved generic hint.

   Graduated prompts, in the dynamic assessment tradition [37]: locate, then name, then reveal. How much help a learner needed is a better measure than right or wrong, so log it.

   The **fingerprint** replaces the Weak spots screen:

```
Your traps

The verb follows the thing, not you        caught you 7 of 19
gustar, encantar, doler                     was 11 of 20 last month
                                                         Train it
Saying what you know after "quiero que"     caught you 4 of 9
                                                         Train it
Holding back the subjunctive: you've stopped doing this  ✓ 12 clean in a row
```

   **Train it** uses Keybr's idea [31]: engine-generated practice aimed at the weakness. Sentences are picked by tagger feature, not by unit. This respects the standing decision that free-form misses are signal and training goes through form drills on fresh material.

   **Your own mistakes come back.** Three days and two weeks later, the learner's own wrong sentence appears as "Fix this: you wrote it on Tuesday." Error correction has a known risk of teaching the wrong form [38], so this only uses errors the learner already produced.
4. **Acquisition.** Prompts beat recasts, especially on free production [32]. Metalinguistic feedback beats "try again" in parser-based CALL [39]. Scaffolded automatic feedback beat plain corrective feedback in FeedBook's school study [40]. Errors followed by correction improve later memory [41].
5. **Fit.** New `src/check/traps.ts`, called from the card check. `err` on the event. Weak spots screen rebuilt. Bug table as content, gate-checked with a regression battery: my 30 items become a test that fails on any misleading hint.
6. **Evaluation.** Recurrence per opportunity over 30 days, named against generic, hash-armed by rule. Self-repair rate on the one retry. Share of misses that reach a named rule. Battery: target 0 misleading, at least 25 of 30 named.

**Evidence tier:** strong research for prompts and metalinguistic feedback. Fingerprint-driven training is an uncertain hypothesis.

---

#### F4. Reconstruye: rebuild the story from English

**Distinctive.** Benjamin Franklin's method, automated. Sentence-level translation is everywhere; paragraph-level reconstruction of a text you care about, checked line by line against aligned variants, I did not find anywhere.

1. **Problem.** Between one-sentence translation and free writing there is nothing. Learners never produce connected Spanish with a right answer to compare against. A chapter you read is never used again except as a re-read.
2. **Why it matters.** "Builds accurate sentences independently" is the objective, and real language is connected: pronouns referring back, tense sequence, connectors. Aspect cannot be practised properly in isolated sentences, because context decides it.
3. **How it should work.** A day or more after reading a chapter, a new block takes one beat of 3 to 6 consecutive sentences:

```
Rebuild this from yesterday's chapter.

1. It was raining a lot that night, and Tomás had no jacket.   ✓
2. He went into the first café he saw.                         
   ┌─────────────────────────────────┐
   │ Entró en el primer café que vio.│
   └─────────────────────────────────┘
```

   (Illustrative; line 1 is a real sentence from ch038, line 2 is invented.)

   Each line is checked with `matchTranslation` against the original plus `accept`. After the beat, the learner sees their whole version aligned against the original, with differences marked, which is where the noticing happens. Long free sentences have many valid versions, so a line the checker cannot pass gets "Mine says the same thing" or "Mine is off", self-graded, and scores as exposure. Exact or variant matches score as productive.

   Difficulty rises with evidence: with key words given, then English only, and from B2 a three-line summary only. The same machinery does **Retell**: change the narrator, change the tense, tú to usted, with keys authored at build time. Engine-only transformation is not enough here, because only 40 to 46% of story sentences parse as single clauses.
4. **Acquisition.** Output forces syntactic processing and reveals gaps; in Izumi's study output with input beat reading the same input [34]. Reconstruction of meaningful text is the logic of dictogloss without audio. The comparison step is noticing the gap, which the writing checker's header already cites. It also spaces and retrieves story vocabulary in its original context.
5. **Fit.** New block `rebuild`, after a read, on output and review days. Requires F0.3. Replaces some `extraReading` and re-read time. Each English line must be the exact translation of its Spanish, already a standing rule. The learner's rebuilt text joins the store from F0.2.
6. **Evaluation.** First-try line accuracy. Against a control of re-reading: delayed production of the chapter's target nodes, hash-armed by chapter. Self-grading calibration: how often "says the same thing" agrees with the checker on lines the checker can judge.

**Evidence tier:** established practice in the classroom, novel experiment at this scale in an app.

---

#### F5. El Caso: grammar as evidence

**Distinctive.** A game that cannot be played without the grammar, set inside the story. Most language games wrap drills in a skin. Here the grammar is the clue.

1. **Problem.** From B1, the hardest grammar is about what a sentence commits the speaker to: does this lawyer exist, did she sign, is it raining. Translation into English often hides it, and multiple choice on form never reaches it.
2. **Why it matters.** "Reads increasingly sophisticated material" depends on it, and it is what separates B2 from C1. The story already has what it needs: a legal fight, a will, a notary, depositions.
3. **How it should work.** At the end of a B1 to C1 unit, a case file: statements, emails, a letter. The learner pins facts to a board by answering questions only the grammar answers. Wrong pins get contradicted by a later statement, not by a red cross. No lives, no timer. Examples of the distinction, in the world of the Altamira dispute:

| Statement | Question | What decides it |
|---|---|---|
| No quiso firmar. / No quería firmar. | Did he refuse, or did he only not want to? Could he have signed anyway? | Preterite as refusal |
| Conoció a Rosa en 1983. / Conocía a Rosa en 1983. | Did they meet that year, or did he know her already? | The meaning shift |
| Si hubiera estado allí, lo habría visto. | Was she there? | Counterfactual |
| Aunque llueve, abrimos. / Aunque llueva, abrimos. | Is it raining? | Mood after aunque |
| Busco un abogado que habla inglés. / que hable inglés. | Does she have a particular lawyer in mind? | Mood in a relative clause |
| Lo vio Mariana. | Who saw whom? | First-noun trap [the blueprint cites it] |
| Se le perdieron las llaves. / Perdió las llaves. | Accident, or his doing? | Accidental se |
| Dijo que vendría. / Dijo que venía. | Same promise? | Tense sequence |

   All content is authored at build time and goes through the gate, with `x:` and grammar targets. Forty to sixty cases of eight statements, about 400 items.
4. **Acquisition.** This is processing instruction [42] with a reason to care: form-meaning mapping under a comprehension task, the same logic as `input.ts`, at the level where it matters most. Contrasting cases support transfer [43]. The game wrapper itself is unproven.
5. **Fit.** A new block on checkpoint and review days, drawing on the contrast sets from F3. Fits the arc in `storyArc`. Results feed F2 themes and FSRS as receptive evidence on the `x:` nodes.
6. **Evaluation.** Accuracy on fresh contrast items two weeks later, cases against the same contrast items without the frame, hash-armed by contrast. Completion and voluntary replay rates are the motivation signal.

**Evidence tier:** strong research for the core mechanism, novel experiment for the frame.

---

### 6.3 The competent core: necessary, not distinctive

#### F3. Duelos: contrast sets in the bank

1. **Problem.** P1. 2. **Why.** These 94 nodes are the point of the course for an English speaker. 3. **How.** Build-time: 40 to 60 minimal pairs per contrast across bands, in the bank, `targets` set to the `x:` node, gated on the learner's known words. Format: two sentences that differ in one choice and a question only that choice answers, as `input.ts` does, then typed production of the less obvious side. A "why" pick after a miss: choose the reason from three, using the script's own language. 4. **Acquisition.** Processing instruction [42]; interleaving of preterite and imperfect helped across sessions, not within one, in the one study directly on Spanish verbs [44]; contrast comparison [43]. Reassuringly, this matches the app's existing schedule. 5. **Fit.** No code change beyond the gate rule. `pickContrast` starts working as written. 6. **Evaluation.** Delayed accuracy on `x:` nodes, currently unmeasurable. Share of reviews with a fresh sentence.
**Tier:** strong research. **Copy or distinctive:** the idea is old, but nobody ships it at this depth. Rank it first regardless, because it repairs a critical fault.

#### F6. Mapa: a diagnostic that returns a map

1. **Problem.** `Probe.result()` returns one number and `applyPlacement` assumes everything earlier is known. The likeliest adult here is a false beginner with patchy knowledge, for whom a single cut is wrong in both directions. 2. **Why.** Wrong seeding wastes months or demoralises. Also no learner can see the shape of what they know. 3. **How.** Keep the fair-item rules. After the ladder, spend 10 more minutes probing 30 high-yield skills in and below the placed band. Seed per node, not per unit. Show the result as a map by topic with four honest states from existing data: Met, Can choose it (rung 0), Can build it (rung 2), Holds up in new sentences (`novelPasses`). Khan's rule: practice cannot lower a state; a check can [24]. Individual paths follow from this: any unit can offer a ten-minute test-out, so a learner who already owns its nodes skips the teaching days and keeps the story. 4. **Acquisition.** Indirect: targeting. 5. **Fit.** `placement.ts`, a new Map view in Progress beside Reference. 6. **Evaluation.** Lapse rate on seeded nodes in the first 30 days, per-node seeding against unit seeding.
**Tier:** established practice. **Copy,** of Math Academy and Kwiziq.

#### F7. Pruebas: proof, not points

1. **Problem.** P6. 2. **Why.** Motivation for adults comes from competence they can verify. Adherence is the real enemy [25]. 3. **How.** (a) Can-dos ticked by evidence only. (b) **Cold read** each month: a text never seen, at a fixed length, with words per minute and comprehension, charted. (c) **Time capsule:** every few months, your own writing from then beside a rewrite now, with measures the tagger can compute: sentence length, subordinate clauses, tenses used, connectors. (d) **Spanish you have today:** the sum of `retrievability` across nodes, an honest number that falls if you stop. Forecast it the way Strava forecasts fitness. (e) A reading ledger toward named milestones, as Dreaming Spanish does with hours [13]: 10,000, 50,000, 100,000, 500,000 words. 4. **Acquisition.** Motivational, plus delayed testing is itself retrieval. 5. **Fit.** Progress screen; needs F0.2. 6. **Evaluation.** Survival curves: return rate after a two-week gap for learners shown the number and those not, if there are ever enough learners. Otherwise self-report.
**Tier:** established practice for delayed checks, uncertain hypothesis for the number. **Distinctive in part:** the time capsule.

#### F8. Gimnasio: fluency as a measured strand

1. **Problem.** P8, P11. 2. **Why.** Automaticity is the difference between knowing and using; the Monkeytype audience shows how compelling one honest speed number can be. 3. **How.** **Fixed segments:** the same benchmark every time (the 60 commonest verbs in the taught tenses; 30 known chunks; a 200-word text). Records mean something. **Adaptive set:** per-cell latency from `ms`, normalised per character against the learner's baseline so slow typists are not punished. Keybr's rule: a new tense joins a person's speed set only when the current set hits target speed [31]. Generated by the engine. **Rush,** three misses and out, never touching FSRS, as Puzzle Rush keeps away from the rating [27]. Clozemaster-style volume mode for B2 and C1 lexis. Say it aloud option, self-graded. 4. **Acquisition.** Fluency development is one of Nation's four strands (from memory). Practice that is spaced and retrieval-based supports automatization [45]. 5. **Fit.** Replaces Verb workout's bests. Sprint results saved. 6. **Evaluation.** Median ms per character on benchmark cells over months; whether latency at review predicts later lapse, which could feed FSRS.
**Tier:** established practice. **Copy,** but the verb version needs the engine.

#### F9. A reader that learns

1. **Problem.** P5, P7; reading is linear only. 2. **Why.** Extensive reading has moderate support [46]. A reader is where the distance from A2 to C1 gets covered. 3. **How.** A tap counts against you, softly. Saved words enter the queue with their sentence. A `form+how` note on every token, not 13 to 18%. Sense-specific gloss where a chapter provides it. **Known percentage** on each text as LingQ does [10], computed from retrievability. A library of short texts ordered by that percentage at the 95 to 98% level (from memory: Hu and Nation). Words per minute shown on re-reads and cold reads. Anchor cards: "You met this when Rosa's letter arrived." 4. **Acquisition.** Glossing helps vocabulary and comprehension; meeting a word in a remembered episode is plausible but unproven. 5. **Fit.** `read.tsx`, `bundle.gloss`, a `tap` signal in the learner. New short texts by build-time drafting. 6. **Evaluation.** Taps per 100 words falling over time on similar-level texts; retention of tapped words against untapped words.
**Tier:** established practice. **Copy,** but the percentage is more honest here because it reads FSRS.

#### F16. Perfil de palabra: partners and frames, mined from the bank

1. **Problem.** Lexemes have no collocation or government data. A learner can know *confiar* and still write *confiar a*. 2. **Why.** Much advanced error is lexical grammar: which noun goes with which verb, which preposition a verb takes. 3. **How.** At build time, mine partners with the tagger and show them on each word in Reference, in Rayos X and in the gloss panel. I tested this on half the bank (36,347 sentences). It works: *dar* miedo 58, rabia 46, pena 35, vergüenza 23; *tener* razón 135, miedo 108, ganas 45; *cumplir* años 14, promesa 8, palabra 7, sueño 6; *confiar en* 61 of 65 uses; *soñar con* 37 of 50; *atreverse a* 24 of 32. Of 394 verbs with 10 or more uses, 134 have one preposition taking at least 15% of uses, and 94 have three or more noun partners seen three times. It has noise (*hacer pan*), so a person or a build-time model must curate. Practise whole phrases by retrieval, and do not use matching exercises: learners pick up the distractors [38]. 4. **Acquisition.** Intact phrases did best at delayed post-test in Boers and colleagues' replication [38]. 5. **Fit.** A `frames` field on lexemes, generated and gated. Patterns stay as they are. 6. **Evaluation.** Preposition errors per opportunity in F2.
**Tier:** established practice. **Part distinctive:** the data comes from the learner's own course, so every example is readable.

#### F10. Puentes: transfer from English and word building

1. **Problem.** P9. 2. **Why.** Cheapest large vocabulary gain available. 3. **How.** A1: five small lessons on rules: -tion to -ción, -ty to -dad, -ous to -oso, -ly to -mente, -ize to -izar, -ic to -ico. Each with instant exercises where the learner *guesses* Spanish words from English and reads a text full of them. False friends as named traps in F2. B1 to C1: word families and affixes as a strand: *des-, re-, -miento, -dor, -ante*, using the lexeme graph. Word-family view in Reference. 4. **Acquisition.** Cognate awareness instruction improved vocabulary in several studies [47], mostly in the opposite direction, Spanish speakers learning English. 5. **Fit.** New grammar nodes, scripts, a `family` field on lexemes. 6. **Evaluation.** Unseen-cognate recognition test at week 2. Guessing accuracy on unknown derived words while reading.
**Tier:** established practice. **Copy** of Language Transfer's best idea.

#### F12. Escritura: revise and combine

1. **Problem.** Writing ends at one attempt. Nothing bridges simple sentences to complex ones. 2. **Why.** Syntactic complexity at B1 to C1 needs its own practice. 3. **How.** **Revise:** after the model, the learner marks three things the model does that they did not, then rewrites from memory. **Combine:** two or three short sentences into one with a relative clause, *aunque*, a gerund, with authored keys. **Register:** tú to usted, spoken to written, for B2 and C1. 4. **Acquisition.** Models help learners notice and solve problems they did not know they had; reformulation helps with those they did; error correction may produce more direct uptake [48]. Evidence is mixed, so offer models and F2's named corrections, not one or the other. Sentence combining has good L1 support (from memory: Graham and Perin 2007). 5. **Fit.** `writing.tsx`, a new `combine` op in the ladder at rung 3 and above. 6. **Evaluation.** The time capsule's measures; rung pass rates.
**Tier:** established practice.

### 6.4 Experiments

#### F11. El Taller: grammar you can operate

1. **Problem.** No visual or operable grammar anywhere. 2. **Why.** An adult who sees how the machine works has a schema to hang everything on. 3. **How.** A sentence with dials: person, tense, no/yes, object to pronoun, formal/informal. The changed parts light up and the verb's anatomy is shown. **Predict first:** before the dial moves, the learner types or picks what will change, then turns it. Script fields for slot diagrams: clitic order as fixed slots, the aspect timeline. A lesson in Reference verb tables first: colour stem and ending, highlight what changes. Coverage: at least one safe dial on 34 to 59% of the bank, two or more on 25 to 47%, plenty as a source. English for tense changes is not generated (`recombine.ts` keeps those as recognition), so show `enPhrase` for the verb only. 4. **Acquisition.** Concept-based instruction with diagrams has shown promise for Spanish aspect, on small samples [49]. Comparing cases helps [43]. Attempting before instruction helped in a large meta-analysis, though mostly on conceptual maths and not on procedures [50]. Unguided exploration does not help, by general findings (from memory), hence predict first, as Brilliant's best screens do [26]. 5. **Fit.** A widget in `teach.tsx`, plus Reference. 6. **Evaluation.** Prediction accuracy across a session; a post-test on clitic placement and agreement.
**Tier:** novel experiment. **Distinctive,** and the best demo in the product, but ranked below F1 to F5 because a toy that does not force retrieval is the likeliest way to spend effort on delight rather than learning. Prototype small.

#### F13. Verbo del día

Date-seeded, offline, the same for everyone in a band. Mastermind for verb forms: you guess a form, and the engine answers by dimension (right verb, right tense, right person, right mood). Six tries; a text share grid. 1. **Problem.** No daily ritual beyond the lesson. 2. **Why.** Wordle's lesson on scarcity [28]. 3. **How.** Three minutes, one a day, from the Home card. 4. **Acquisition.** Paradigm retrieval, modest. 5. **Fit.** One screen, no compiler. 6. **Evaluation.** Days with a puzzle but no lesson against streak loss.
**Tier:** uncertain hypothesis. **Distinctive:** my search found Spanish Wordle clones on letters and daily sudoku, no game with morphological feedback; I would not swear to it.

#### F14. Lector: paste any Spanish

Paste an email, an article, a song. The app shows your known percentage, tap-gloss, Rayos X and a list of new words to save. 1. **Problem.** No exit to real Spanish. 2. **Why.** At B2 and above the app must hand you on. 3. **How.** Runs the tagger in the browser. Glossing needs a much bigger lexicon: 4,554 lexemes will not cover real text, so a build-time 30,000-lemma gloss list is needed. 4. **Acquisition.** Self-chosen reading. 5. **Fit.** Reuses `Passage` and F1. 6. **Evaluation.** Use at B2 and above, known percentage of what they paste.
**Tier:** established practice. **Copy** of LingQ and Readlang, with a grammar lens they lack.

#### F15. Tutor brief

One page, printable, from F2 and F6: what I own, what is shaky, my three traps, ten sentences to drill, questions for a conversation. 1. **Problem.** The standing decisions rule out listening and AI. A learner still needs a human ear. 2. **Why.** It turns that limit into an honest bridge. 3. **How.** An export. 4. **Acquisition.** Makes speaking time targeted. 5. **Fit.** Half a day after F2. 6. **Evaluation.** Do people use it?
**Tier:** novel experiment. Cheap enough to try.

### 6.5 The ranking

Cost is shown, and did not decide the order. S is days, M is a week or two of agent work, L is a content burn.

| Rank | Idea | Distinctive or copy | Tier | Cost | Why here |
|---|---|---|---|---|---|
| 0 | F0 foundations | n/a | n/a | S + L | Data is being lost daily |
| 1 | F3 Duelos | Old idea, rare execution | Strong research | L | Repairs the critical fault |
| 2 | F2 Mis trampas | **Distinctive** | Strong for feedback; hypothesis for fingerprint | M | Fixes the weakest teaching moment; 2,933 pitfalls waiting |
| 3 | F1 Rayos X | **Distinctive** | Established, novel at scale | M | Every sentence becomes a lesson |
| 4 | F4 Reconstruye | **Distinctive** | Established, novel at scale | M + L | The missing rung between sentence and essay |
| 5 | F7 Pruebas | Part distinctive | Established | S to M | Honest progress is the identity of the product |
| 6 | F9 Reader | Copy | Established | M + L | Reading is the road to C1 |
| 7 | F6 Mapa | Copy | Established | M | False beginners |
| 8 | F5 El Caso | **Distinctive** | Strong core, novel frame | L | Highest ceiling, needs F3 first |
| 9 | F8 Gimnasio | Copy with engine | Established | M | Cheap, long-term compelling |
| 10 | F10 Puentes | Copy | Established | M | Cheap, early confidence |
| 11 | F16 Perfil de palabra | Part distinctive | Established | M | Lexical grammar at B1 and above |
| 12 | F12 Escritura | Competent | Established | M | Needs F0.2 |
| 13 | F11 El Taller | **Distinctive** | Novel | M to L | Prove it small first |
| 14 | F14 Lector | Copy plus | Established | L | Upper-band exit |
| 15 | F15 Tutor brief | Experiment | Novel | S | After F2 |
| 16 | F13 Verbo del día | Experiment | Hypothesis | S | A retention bet |

**The four that make Fluidez distinctive:** Rayos X, Mis trampas, Reconstruye, El Caso. The first two are not merely features; together they change what the app is, from a course that shows you sentences to a tutor that can account for every sentence and remembers how you, in particular, get them wrong. In one line for the owner: *every sentence can explain itself, and the app knows your mistakes by name.*

### 6.6 Considered and rejected

- **Math Academy's encompassing graph.** Hand-built, no formal evidence [23], and bounded sentence credit already covers the need.
- **A global Elo rating for items.** Simple and proven in adaptive systems [51], but it needs cross-learner data that does not exist. A local per-theme rating would only restate F2.
- **Leagues, hearts, gems, XP.** Standing identity; streak harms noted [33].
- **Word tiles as a main mode.** The ladder's typed rungs are stronger. Possibly as a scaffold for true beginners on mobile, but not worth building now.
- **Mnemonic mems.** Not evidenced as a good fit here, and content cost is large.
- **Diglot weave stories.** Low evidence, and "Natural Spanish beats checker legality" points the other way.
- **Commitment money.** Lingoda's experience [14].
- **Peer correction.** Needs a community and a server; Busuu's advantage is its network.
- **Confidence ratings on answers.** Extra taps per card for little gain over latency.
- **Video, audio, speech, chat.** Standing decisions.
- **Interleaving more within a session.** The Spanish-verb evidence says the gain comes across sessions [44], which the schedule already gives.

### 6.7 Where the time comes from

Sessions are about 20 minutes and learners do not choose. New blocks must replace something, not lengthen the day. The obvious source: in the unit 34 render, 11 of the first 16 cards are multiple choice on new words with unrelated distractors (*condenar*: "employee (on contract)", "to convict, to sentence", "to charge, to get paid"). At B1 and above these carry little language load. A Duelo or a Reconstruye beat in those minutes is a better use of them. Re-reads and `extraReading` are the other candidates for F4.

## 7. Uncertainties and limitations

### 7.1 What I did not inspect or could not verify

- **No competitor was used hands-on.** Everything in 2.1 comes from reviews, forums, app-store text and vendors' own pages. Many review sites are affiliate-funded and several criticisms come from competitors. I have marked the worst cases.
- **Textbooks.** Searches found nothing usable on ¡Dímelo tú!, Gramática de uso or Butt and Benjamin, and nothing confirming Aula Internacional's discovery sequence. What I say about them is my unverified knowledge. I did not establish which "Butt and Benjamin workbook" the brief means.
- **The browser.** I did not drive the live UI for this report. I read components and ran the same code paths headlessly. A real phone was not tested, so tagger speed on a phone is an inference from Node timing.
- **Content.** I read code in depth and content only through targeted samples and scans: `x:pret-imp`'s script, one scene, generated sessions at units 14 and 34. I did not read the 916 scripts, nor judge Spanish quality. Other specialists cover that.
- **Hand judgements are mine alone.** The 59-feature check and the sorting of 30 hints into helpful, vague, misleading are single-rater and small. The 30-item battery is a set I wrote, not a sample of real learner errors, so it may flatter or punish the checker. Treat 13 of 30 as "many", not as a rate.
- **Cognate percentages are rough.** The edit-distance rule catches some false friends and misses others.
- **P1 was shown** in a real walk for four sentences and by direct calls for `x:pret-imp` and others. How often it fires over a whole course I did not simulate. The 16-day walk used a learner placed at unit 14, whose contrast nodes were seeded by placement. I did not separately check a learner who reached them by teaching, though the code path is the same.
- **Spanish examples in F5** are mine and need a native reviewer. Distinctions such as *no quiso* and *dijo que venía* carry nuance in Colombian usage that a test item must get exactly right.
- **Costs** are rough orders of magnitude.

### 7.2 The largest unknown: Fluidez cannot learn from its own use

There is no telemetry and no server. Learner data stays in one browser (P10). `tools/sim` models schedules, not learning. So no feature in this report can currently be validated, and every "evaluation" above needs F0.6. The practical design: arms decided by `hash32(node)` so each learner is their own control, an export button, and a small analysis script. With a handful of users the numbers will be weak. Be honest about that. Adopt on research and owner judgement, and use data to catch failures, not to prove wins. Holt's "5 percent" analysis applies: strong effects in efficacy papers come from the few who keep going, so adherence, not pedagogy, may be the binding constraint [25].

### 7.3 Limits caused by standing decisions

Stated once, as the brief allows, not as proposals to reverse them.

- **No listening.** "Uses the language confidently" cannot be delivered by this app alone, because conversation needs an ear trained on real speech. Typed production is a partial proxy for speaking. A learner can finish C1 here and still be unable to follow a fast taxi driver in Bogotá. The app should say so plainly at a suitable moment, and F15 is a mitigation.
- **No AI at runtime.** Open meaning cannot be graded. F4's self-grading and F12's model comparison inherit this. Self-assessment by learners is known to be imperfect. The app's existing candour about this is the right response.
- **Learners do not choose lesson length.** New work competes for the same 20 minutes (6.7).

### 7.4 Risks in my own proposals

- **Rayos X may become a crutch.** Explanation on demand can replace retrieval. Hence the Try one step and the rule that no panel opens before an answer.
- **Fix this cards show wrong Spanish.** Boers's finding is a real warning [38]. Limit to errors the learner made, and only after the correct form has been seen.
- **A fingerprint can demoralise.** Keep it to three traps and lead with what has stopped happening.
- **F4's self-grading can be gamed,** which is why those lines score only as exposure.
- **El Caso depends on writing quality.** A dull case is worse than a good drill.

## 8. Suggested implementation priorities

**This week. Stop the losses.**
1. F0.5: read cards never pass as correct. Mood and aspect hints.
2. F0.1: `given` and `err` on events; tap and why signals.
3. F0.2: store writing text, `storage.persist`, export and import.
4. P6: can-dos no longer tick from position.

**Next. Repair the core, and start the two ideas that need data.**
5. F3 burn: contrast sets, plus the gate rule that a scheduled node must have supply.
6. F2 version one: 40 rules, scoped pitfalls, the 30-item battery as a test, fingerprint screen.
7. F0.3 burn: chapter English. F0.4: engine and gloss gaps.
8. F0.6: arms and an analysis script, before F1 ships, so its first trial is real.

**Then. Turn the assets to face the learner.**
9. F1 version one: lazy tagger, anatomy and triggers, More like this, Try one.
10. F4: rebuild block.
11. F7: evidence can-dos, cold read, time capsule.

**After that. Fill out the course around them.**
12. F9 reader, F6 map, F8 gym, F10 transfer lessons, F16 word profiles, F12 writing.

**Finally, on evidence so far.**
13. F5 El Caso, once F3 exists. A pilot of five cases first, then a burn.
14. F11 prototype in Reference. F14, F13, F15 as appetite allows.

**Decisions for the owner.** (a) Is learner self-grading acceptable in F4? (b) Should "Spanish you have today" be allowed to fall visibly? I think yes: it is honest, and honesty is the brand. (c) At what moment should the app tell a learner that it cannot train their ear? (d) The feature names here are working titles; on screen, plain English such as "Why?" and "Your traps" will probably serve better.

## 9. References

Status key. **Read:** I read the source text. **Abstract:** I saw an abstract or search excerpt, not the paper. **Secondary:** I saw only reports of it. **Memory:** cited from my own knowledge, not checked in this work.

**Products**

1. Smith, Jiang and Peters (2024), Language Learning and Technology 28(1), [article](https://www.lltjournal.org/item-detail/1152/). Abstract. Per-skill numbers not seen.
2. Android Authority on the 2026 course upgrade: [complaints](https://www.androidauthority.com/duolingo-course-upgrade-complaints-3685447/), [poll](https://androidauthority.com/duolingo-course-updates-poll-results-3690803). Secondary.
3. [Langoly, Busuu vs Babbel](https://www.langoly.com/busuu-vs-babbel/); [All Language Resources](https://www.alllanguageresources.com/babbel-vs-busuu/); [Actual Fluency on Busuu](https://actualfluency.com/busuu-review). Affiliate reviews.
4. Pimsleur reviews: [FluentU](https://www.fluentu.com/blog/reviews/pimsleur-review/), [Kaufmann on LingQ](https://www.lingq.com/en/learn-english-online/courses/150164/pimsleur-review-407870/), a competitor.
5. Nielson (2011), Language Learning and Technology 15(3), [article](https://www.lltjournal.org/item-detail/593/). Abstract. Engagement figures from [EnGen](https://getengen.com/blog-posts/ask-dr-katie-can-an-app-really-teach-me-a-language), a competitor, unconfirmed.
6. [Migaku on Spanish Anki decks](https://migaku.com/blog/spanish/best-spanish-anki-decks), a vendor; [Ferriss](https://tim.blog/2014/06/19/drawing-a-penny/).
7. [MorphMan](https://github.com/dmgerman/MorphMan).
8. Clozemaster: [Language Closet](https://thelanguagecloset.com/2024/01/06/its-time-for-a-new-review-clozemaster/), [FluentU](https://fluentu.com/blog/reviews/clozemaster), [own comparison](https://www.clozemaster.com/blog/clozemaster-vs-busuu/).
9. Lingvist: [FluentU](https://www.fluentu.com/blog/lingvist-review/), [Mezzoguild](https://www.mezzoguild.com/lingvist-review/).
10. [Readlang forum on LingQ](https://forum.readlang.com/t/anyone-here-use-used-lingq-or-any-other-alternatives/123); [All Language Resources](https://www.alllanguageresources.com/lingq-review/); [Actual Fluency](https://actualfluency.com/lingq).
11. Memrise: [own post](https://www.memrise.com/blog/changes-to-the-memrise-app), [Eurolinguiste](https://eurolinguiste.com/memrise-is-doing-away-with-user-generated-content-now-what/), [review analysis](https://kimola.com/reports/uncover-the-impact-memrise-apps-user-feedback-report-app-store-us-147885).
12. Language Transfer: [Ling review](https://ling-app.com/blog/language-transfer-review/), [Farsang interview](https://farsang.substack.com/p/interview-language-transfer-founder).
13. Dreaming Spanish: [FluentU](https://fluentu.com/blog/reviews/dreaming-spanish), [Palteca](https://palteca.com/dreaming-spanish-review), a competitor.
14. Lingoda: [Test Prep Insight](https://testprepinsight.com/reviews/lingoda-review/), [OnlineCourseing](https://onlinecourseing.com/lingoda-sprint-review/), [own page](https://lingoda.com/sprint).
15. Seedlang: [App Store](https://apps.apple.com/app/id1521550965), [Mezzoguild](https://www.mezzoguild.com/seedlang-review/), [Spanish listing](https://apps.appfollow.io/ios/learn-spanish-with-seedlang/1640500647?country=es).
16. Conjuguemos: [Merlot](https://www.merlot.org/merlot/viewMaterial.htm?id=88384), [All Language Resources](https://www.alllanguageresources.com/conjuguemos/).
17. [Mezzoguild on SpanishDict](https://www.mezzoguild.com/spanishdict-review/); [Actual Fluency on StudySpanish](https://actualfluency.com/studyspanish-com).
18. [Practice Makes Perfect on Goodreads](https://www.goodreads.com/book/show/28638537).
19. [Difusión, Aula internacional plus](https://difusion.com/tienda/producto/aula-internacional-plus-2-english-edition).
20. Kwiziq: [brainmaps FAQ](https://spanish.kwiziq.com/faq/brainmaps), [Actual Fluency](https://actualfluency.com/kwiziq-language), [All Language Resources](https://www.alllanguageresources.com/kwiziq-review/).
21. Bunpro: [Tofugu](https://www.tofugu.com/reviews/bunpro/), [WaniKani thread](https://community.wanikani.com/t/is-bunpro-really-worth-it/53632?page=2), [Quitting Bunpro](https://community.bunpro.jp/t/quitting-bunpro-kind-of/78246).
22. Satori Reader: [Tofugu](https://www.tofugu.com/reviews/satori-reader/), [appreciation thread](https://community.wanikani.com/t/satori-reader-appreciation-thread/64403), [App Store](https://apps.apple.com/app/id1382950847).
23. [Skycak on FIRe](https://justinmath.com/individualized-spaced-repetition-in-hierarchical-knowledge-structures/) (Read), [Math Academy](https://mathacademy.com/pedagogy), [Matuschak's notes](https://notes.andymatuschak.org/Math_Academy).
24. [Khan Academy mastery levels](https://support.khanacademy.org/hc/en-us/articles/115002552631).
25. Holt (2024), [The 5 Percent Problem](https://www.educationnext.org/5-percent-problem/), Education Next. Abstract.
26. Brilliant: [Skillscouter](https://skillscouter.com/brilliant-review-math-science-coding/), [Cedar Lila](https://cedarlila.substack.com/p/a-review-brilliant).
27. [Lichess puzzles](https://lichess.org/blog/X-S6gRUAAGjNX4ki/new-puzzles-are-here), [chess.com help](https://support.chess.com/en/articles/8712534-how-do-puzzles-work-android), [Lichess forum](https://lichess.org/forum/general-chess-discussion/puzzle-dashboard-2).
28. Wordle: [Northeastern](https://news.northeastern.edu/2022/01/21/what-makes-wordle-so-g-r-e-a-t/), [Smithsonian](https://www.smithsonianmag.com/smart-news/heres-why-the-word-game-wordle-went-viral-180979439/).
29. Strava: [Pratt design critique](https://ixd.prattsi.org/2026/02/design-critique-strava/), [Digital Trends](https://digitaltrends.com/?p=969618).
30. [Monkeytype features](https://www.mintlify.com/monkeytypegame/monkeytype/features).
31. [keybr.com README](https://cdn.jsdelivr.net/gh/aradzie/keybr.com@master/README.md) (Read).

**Research**

32. Lyster and Saito (2010), Studies in Second Language Acquisition, [abstract](https://www.cambridge.org/core/product/4999EE1C8379B2BF026B148EAF373CA1): 15 classroom studies, 827 learners, prompts over recasts, clearest on free responses. Abstract. Li (2010), Language Learning 60, 309 to 365. Secondary.
33. Silverman and Barasch (2023), Journal of Consumer Research 49(6), [repository](https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb). Abstract.
34. Izumi (2002), Studies in Second Language Acquisition 24(4), [abstract](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/output-input-enhancement-and-the-noticing-hypothesis/6A24AE05CFBBB36D88AB84E8672A5C43). Abstract. Task design not confirmed as text reconstruction.
35. Lee and Huang (2008), Studies in Second Language Acquisition 30, [abstract](https://resolve.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/visual-input-enhancement-and-grammar-learning-a-metaanalytic-review/B9D0C50B09928C20C94548B37B29A042). Secondary for the size. A later meta-analysis found g=0.54, [De Gruyter](https://www.degruyterbrill.com/document/doi/10.1515/iral-2025-0118/pdf?lang=de), so this is unsettled.
36. Boulton and Cobb (2017), Language Learning 67(2), DOI 10.1111/lang.12224, [PDF](https://www.lextutor.ca/cv/meta_early_view.pdf). **Read** (abstract page): 64 studies, 88 samples, d=0.95 and 1.50; durability needs more study.
37. Poehner, Zhang and Lu (2015), Language Testing 32(3), [related C-DA paper](https://journal.equinoxpub.com/LST/article/view/21006). Secondary.
38. Boers, Demecheleer, Coxhead and Webb (2014), [record](https://forrt.org/flora-replication-atlas/doi/10.1177/1362168813505389/); Boers, Dang and Strong (2017), [record](https://metatoc.com/papers/76043-comparing-the-effectiveness-of-phrase-focused-exercises-a-partial-replication-of-boers-demecheleer-coxhead-and-webb-2014). Abstract. These concern collocation matching, so applying them to error correction is my extension.
39. Nagata (1993), via Heift's [survey](https://web.stanford.edu/~efs/callsurvey/heift.html). Secondary. Heift (2004), ReCALL. Title only.
40. Meurers et al. (2019), Annual Review of Applied Linguistics 39, summarised in [pre-registration](https://psycharchives.org/en/item/26178cd5-1635-476a-8021-5686b472a611). Secondary. Effect size not found. L2 English in German schools.
41. Metcalfe (2017), Annual Review of Psychology 68, [PDF](https://wesleyan.edu/ofcd/resources/OFCD%20Resource%20Docs/Learning%20from%20Errors.pdf). Secondary.
42. Shintani (2015), Applied Linguistics 36(3), 42 experiments; [review note](https://linguistlist.org/issues/26/2968/). Existence confirmed, numbers not. Processing instruction work on Spanish clitics and the first-noun principle as cited in the project's own blueprint, docs/research.
43. Alfieri, Nokes-Malach and Schunn (2013), Educational Psychologist 48(2), [record](https://www.scinapse.io/papers/2124645092). 57 experiments. Secondary sources disagree on d=0.50 or 0.60. Mostly not language learning.
44. Pan, Tajran, Lovelett, Osuna and Rickard (2019), Journal of Educational Psychology 111(7), [lab page](https://rickardlab.ucsd.edu/publications.html). Abstract. Not uniformly replicated, one [thesis](https://repository.tcu.edu/handle/116099117/66764?show=full) found no difference.
45. Suzuki, Nakata and DeKeyser (2019), Modern Language Journal 103; Suzuki and DeKeyser (2017), [related](https://resolve-he.cambridge.org/core/journals/studies-in-second-language-acquisition/article/role-of-procedural-learning-ability-in-automatization-of-l2-morphology-under-different-learning-schedules/F45CDFDD2887BA1B4A09ABB673DDA6AB). Secondary.
46. Nakanishi (2015), TESOL Quarterly 49(1), thesis version [here](https://scholarshare.temple.edu/items/6a42a9ee-8c17-408d-b27f-aaa73550db1c): d=0.46 groups, 0.71 pre-post. Abstract; numbers may differ in the journal version.
47. Cognate awareness: [ELIA](https://revistas.uned.es/index.php/ELIA/article/download/26483/20924/58433), [Lubliner and Hiebert](https://textproject.org/wp-content/uploads/papers/Lubiner-Hiebert-2014-An-Analysis-of-English-Spanish-cognates.pdf). Excerpts. Mostly Spanish speakers learning English.
48. Hanaoka and Izumi (2012), Journal of Second Language Writing 21; Kim (2013), [record](https://www.earticle.net/Article/A236550); Santos, López-Serrano and Manchón (2010). Abstract.
49. Negueruela and Lantolf (2006); [Exploring boundedness, Modern Language Journal](https://onlinelibrary.wiley.com/journal/15404781), vol. 106, n=26. Secondary, seen only through a search listing, and that link is to the journal, not the paper.
50. Sinha and Kapur (2021), Review of Educational Research, DOI 10.3102/00346543211019105: 53 studies, g=0.87 after correction. Abstract. [Summary](https://www.weforum.org/stories/2021/09/students-who-productively-fail-learn-more/). Authors note no advantage for procedures.
51. Pelánek (2016), Computers and Education, [PDF](https://www.fi.muni.cz/~xpelanek/publications/CAE-elo.pdf). Abstract.

**From memory, not checked:** Nation's four strands; Hu and Nation (2000) on 98% coverage; Graham and Perin (2007) on sentence combining; the general benefit of glosses (Yun 2011 seen only in excerpt); general findings against unguided discovery; Safari storage eviction behaviour; LLM explanation features in rival apps.


