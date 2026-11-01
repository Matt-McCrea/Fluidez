# Fluidez vocabulary and reading audit

Specialist: Vocabulary and Reading. Date: 2026-11-01. Branch: rebuild.

**Verdict.** The story is the best thing in the product, and the chapters are lexically well controlled. Everything around them falls short of the goal. On the default tier the course teaches about 1,800 of its 2,528 planned words, and almost none of the B2 and C1 words. Its headline of 4,554 words includes over 900 that appear in no sentence or chapter at all. A third of word taps in the reader show a note about a different sentence. The whole reading course is 82,000 words, one novel's length, all one soap opera, with sentences that barely lengthen from A1 to C1. A learner placed at B2 gets chapter 1 of the A1 story. The comprehension questions can be passed about 90% of the time by choosing the longest option. A learner who finishes this course cannot read a Spanish newspaper comfortably.

---

## 1. What was investigated

**Read in full**
- All 2,528 taught-tier glosses, plus every gloss of rank 1,400 or better. The rest of the receptive tier by pattern scans.
- `app/docs/vocab-report.md`, `app/tools/vocab/SOURCES.md`, `src/ui/blocks/read.tsx`, `src/ui/screens/story.tsx`, the gloss path in `src/ui/data/bundle.ts`, `src/ui/session/beats.ts`, `coverage()`, `chapterFor()`, `fitToBudget()` in `src/compiler/compile.ts`, `src/learner/policy.ts`, the gate's `readingCoverage` in `tools/gate/checks.ts`.
- 28 chapters as a reader, the samples for all five bands (ch079 only partly), plus parts of ch142, ch195, ch205 and ch219.

**Measured by script over all content**
- All 72,693 bank sentences, all 219 chapters (every token tagged with the project tagger), all 4,554 lexemes, the OpenSubtitles and Leipzig word lists behind the ranks.
- `Bundle.gloss()` run on every word token of every chapter (87,034 tokens, 77,820 after removing names).
- Five full-course simulations with the real compiler over real content, using `tools/sim/run.ts`: fast, average, forgetful, irregular on the standard tier, and average on the extended tier. Four more simulations for learners placed at u15, u28, u45 and u52.

**Used the running app**
- Placed through the real check to week 45, played to the reader, tapped words. Screenshots: `app/tools/playtest/.runs/shots/vr-reader/` (gitignored).

**Claims file:** 51 verified Spanish and gloss defects in `docs/swarm-audit/claims/vocab-reading.jsonl`. Every quote was checked by script against its source file.

---

## 2. Evidence from the actual application

### 2.1 Words a learner actually gets

Cumulative at the end of each band: lexemes introduced by the compiler, plus the 192 closed-class words. "Robust" means at least 8 contextual encounters and at least 3 reviews. Words picked up only inside chunks or by tapping are not counted, so these are floors.

| End of | Graph plan (all tiers) | Research target | Average learner, standard tier | Robust | Average learner, extended tier | Robust |
|---|---|---|---|---|---|---|
| A1 | 1,050 | 1,000 to 1,500 | **596** | 522 | 846 | 687 |
| A2 | 2,000 | 1,500 to 2,500 | **1,023** | 883 | 1,476 | 1,252 |
| B1 | 3,150 | about 3,250 | **1,469** | 1,319 | 2,008 | 1,766 |
| B2 | 3,700 | about 3,750 | **1,747** | 1,610 | 2,388 | 2,111 |
| C1 | 4,550 | about 4,500 | **2,014** | 1,854 | 2,720 | 2,425 |

Planned taught words actually introduced by the end of the course, by band of the plan:

| Profile, tier | A1 (654) | A2 (630) | B1 (532) | B2 (380) | C1 (332) | Total of 2,528 | Owed lexemes at end |
|---|---|---|---|---|---|---|---|
| fast, standard | 654 | 630 | 532 | 223 | 16 | 2,055 | 473 |
| average, standard | 654 | 630 | 508 | **19** | **11** | 1,822 | 706 |
| forgetful, standard | 654 | 630 | 274 | 22 | 11 | 1,591 | 987 |
| irregular, standard | 654 | 630 | 532 | 76 | 14 | 1,906 | 633 |
| average, extended | 654 | 630 | 532 | 380 | 332 | 2,528 | 0 |

### 2.2 Encounters

Whole corpus, bank plus chapters, by tagged lexeme:

| Tier | Lexemes | In no text at all | Under 8 occurrences | Median |
|---|---|---|---|---|
| Taught | 2,528 | 42 | 206 (85 by surface forms) | A1 114, A2 34, B1 18, B2 13, C1 11 |
| Receptive | 1,830 | **979 (53%); 918 by surface forms** | 1,600 (1,538 by surface forms) | 0 from A2 up |

One average learner across the course, sentences actually served plus chapters read:

| Tier | Zero encounters | Under 8 | Median |
|---|---|---|---|
| Taught, introduced | few | A1 18, A2 32, B1 94 | A1 56, A2 21, B1 12 |
| Taught, extended tier | | B2 57, C1 128 of 332 | B2 11, C1 9 |
| Receptive, 1,830 | **1,265** | 1,714 | 0 |

"Surface forms" is an independent check that ignores the tagger and matches inflected forms in the raw text. It confirms the receptive result and shows the tagger undercounts some taught words (V6).

The average learner sees 24,549 of 72,693 bank sentences (33.8%).

### 2.3 Reading volume and shape

| Band | Chapters | Words | Words in spoken lines | Mean sentence | Mean narration sentence | Longest narration paragraph (mean per chapter) | Content tokens above rank 3,000 |
|---|---|---|---|---|---|---|---|
| A1 | 38 | 6,084 | 65% | 5.1 | 6.9 | 19 | 12.9% |
| A2 | 44 | 10,423 | 63% | 6.1 | 8.3 | 22 | 9.0% |
| B1 | 42 | 13,657 | 64% | 7.1 | 8.8 | 25 | 9.6% |
| B2 | 50 | 21,085 | 64% | 7.4 | 9.4 | 30 | 8.8% |
| C1 | 45 | 30,915 | 53% | 8.5 | 11.4 | 44 | 12.0% |
| **All** | **219** | **82,164** | | | | | |

- Average learner: 82,000 new words plus about 63,000 re-read, 145,153 in all, over 789 calendar days. Plus 201,717 words of unconnected practice sentences.
- That is about 38,000 new connected words a year.
- Sessions in the simulation total about 283 hours. Reading blocks take 11% of plan minutes at A1, 14%, 15%, 18% and 24% at C1.
- Only 5.0% of C1 narration sentences reach 25 words. Only 38 quoted documents in the whole story reach 30 words; 9 reach 60; the longest is 123.

### 2.4 Lexical coverage of chapters

Share of running words (names and numbers excluded), tagged, against the position of each chapter.

| Band | Function + taught by then | + receptive tier by its priority | + chapter gloss | Against what the average standard-tier learner has met |
|---|---|---|---|---|
| A1 | 93.1% | 94.7% | 97.1% | 73.8% |
| A2 | 97.4% | 98.5% | 99.5% | 83.2% |
| B1 | 96.7% | 98.4% | 99.9% | 87.9% |
| B2 | 95.6% | 98.0% | 99.6% | 90.4% |
| C1 | 94.7% | 97.3% | 99.2% | 82.4% |

The authors wrote to the plan with real discipline. The last column is what the learner meets: the plan is not delivered. It is a floor, since a word met inside a chunk is not credited.

### 2.5 The reader, tap by tap (all 77,820 word tokens)

| What a tap returns | Tokens | Share |
|---|---|---|
| Lexeme gloss | 29,805 | 38.3% |
| **Phrase note from a different sentence** | **25,024** | **32.2%** |
| Phrase note for this sentence | 11,328 | 14.6% |
| Verb form note ("from X, he or she, past") | 8,708 | 11.2% |
| Chapter's own word gloss | 1,469 | 1.9% |
| "No note for this word yet" | 1,486 | 1.9% |

Sentence-level "EN" control present on 16 of 11,385 chapter sentences.

### 2.6 Comprehension questions

| Band | Questions, first read | Typed | In Spanish | Always picking the longest option scores (first read / re-read) |
|---|---|---|---|---|
| A1 | 174 | 0 | 26% | 78% / 59% |
| A2 | 199 | 0 | 24% | 84% / 60% |
| B1 | 197 | 0 | 22% | **92%** / 62% |
| B2 | 215 | 0 | 24% | **90%** / 74% |
| C1 | 192 | 0 | 23% | **88%** / 76% |

---

## 3. Specific problems discovered

### Vocabulary

#### V1. CRITICAL. The default tier cannot deliver the planned vocabulary
- **Locus:** `src/compiler/compile.ts`, `fitToBudget()` and the `owedNew` queue; `src/compiler/budget.ts`, `SECONDS.learn = 55`.
- **Evidence:** see 2.1. The owed queue starts growing in unit 1: 139 by unit 7, 255 at the end of A1, 455 at the end of A2, and it is still rising at unit 59 (727). `fitToBudget` removes learn items whenever the plan is over its minutes ("Reviews are never trimmed and the day's teaching is the point of the day, so what gives is the learn pool"). Owed items are repaid first, so each unit's own words sit behind an ever longer queue. A typical A2 Introduce or Drill session teaches about 3 new items of all kinds, where an Introduce day lists 6 words alone. At the end of the course the queue is 706 lexemes, 22 patterns and 2 contrasts, all in order: `l:deseo, l:encuentro, l:infantil, l:intercambiar, l:consciente, ...`.
- **Why nobody saw it:** `content/_reports/sim-summary.md` ran `--real` on A1 and A2 only, and reports time and retention, never words delivered. The day plan and `vocab-report.md` show what is listed, not what is taught.
- **Consequence:** a learner who finishes "C1" has met about 1,800 content words, 19 of the 380 B2 words and 11 of the 332 C1 words. Words that never arrive for the average learner include *la posibilidad, la tecnología, la cultura, la capital, la justicia, la crisis, el conflicto, la teoría, la institución, el autor, la evidencia, la violencia, producir, mencionar, confirmar, simple*, because bad ranks (V4) put them at the end of a queue that is never served. B2 and C1 chapters lean on words the learner has not seen (82.4% coverage at C1). The app never says so.
- **Fix, strongest design:** reverse the priority. Give new words a reserved slot in every session and let the other blocks fit round it. Over the course the demand for words alone is only 4.3 a day, about 4 minutes at 55 seconds. Add a fast path of about 20 seconds for cognates and derived forms of known words. Stop listing 16 words on an Input day, which cannot fit in 20 minutes on any day. Add a CI simulation that fails if any band's delivered words fall below 95% of plan on the average profile. Extended cannot be the answer: the owner's rule is one default lesson.

#### V2. CRITICAL. The headline vocabulary is inflated by a tier that is not taught and mostly not present
- **Locus:** `app/docs/vocab-report.md` ("1,839 are receptive (met in reading, not carded)"), `content/graph/lexemes.json`, `src/compiler/content.ts implicitNodes`.
- **Evidence:** the report promises "Words a reader meets in that unit's texts". 979 of 1,830 receptive lexemes occur in no bank sentence and no chapter by tag, and 918 by raw surface forms. 1,265 are never encountered by an average learner, 1,714 fewer than 8 times. The compiler treats them all as known and stable from their priority session: `for (const id of nowKnown) ... this.stable.add(id)`.
- **Also:** the tier is not limited to the transparent words it claims. 513 of 1,839 are opaque by string similarity, 131 of them in the top 3,000: *la cárcel* (1,074), *aportar*, *desempeñar*, *plantear*, *otorgar*, *el entorno*, *la encuesta*, *la bodega*, *la tarifa*. High-frequency false friends sit here too: *atender* (never carded) and *asumir*.
- **Consequence:** the claim of 4,550 words, and the targets it is measured against, are not real. Any progress figure built on this tier is fiction.
- **Fix:** report only words delivered. Split the tier in two: *guaranteed* (appears in at least 8 texts by a stated session, enforced by the gate) and *dictionary* (tappable, not counted). Move every opaque word above rank 3,000 into the taught tier. Add a card the first time a learner taps a receptive word (see R9).

#### V3. CRITICAL. The C1 target itself is too low for the owner's goal
- **Locus:** `docs/research/Structuring Spanish Learning...md` lines 178 and 225; `app/docs/vocab-report.md` coverage table.
- **Evidence:** the 4,500 figure comes from Milton and Alexiou, whose test stops at 5,000 words, so the C1 score is capped by the instrument. The project's own table shows the full 4,550 covers 89.7% of Colombian web text and the taught plus closed tiers 80.8%. Reading without strain needs 95 to 98% (Laufer and Ravenhorst-Kalovski 2010; Hu and Nation 2000), and the app's own research doc quotes 98%. Nation (2006) puts that at 8,000 to 9,000 word families for English written text.
- **Consequence:** with 2,014 lexemes the average finisher sits at about the project's B1 "taught + closed" row, 77% of written tokens and 88% of speech tokens (names inflate the denominator, so somewhat more in clean text). Roughly one running word in five is unknown in a newspaper paragraph. The goal "reads increasingly sophisticated material" cannot be met.
- **Fix:** replace the band targets with coverage targets on real corpora: 90% of written text at B1, 95% at B2, 97 to 98% at C1. Add a B2 and C1 layer of 3,000 to 4,000 receptive words, reached mostly through the reading track in R2, with the tap-to-card loop. Cost is real but the content is reading, which the course needs anyway.

#### V4. HIGH. Frequency ranks are corrupted by homographs, so selection and order are wrong
- **Locus:** `tools/vocab/lemmatize.ts`, output `tools/vocab/out/lemma-freq.json`.
- **Evidence:** 130 verbs get over 40% of their count from forms that are other words; 107 nouns are under-credited.

| Word | Rank in `lemma-freq.json` | Where the count came from | Effect |
|---|---|---|---|
| *coser*, to sew | 94 | *cosas* 424,801 and *cosa* 269,054, against *coser* 2,086 | Taught at session 210 |
| *casarse* | 67 | *casa* 340,671, *caso* 148,273 | Taught at session 26 |
| *partir* | 71 | *parte* 229,038 | Taught at session 34 |
| *acordar* | 120 | *acuerdo* 367,329 | Taught at session 53 |
| *parir* | 1,139 | *parís* 25,111 | Taught at A2 |
| *distanciarse* | 1,663 | *distancia* 20,553 | Taught at B1 |
| *cesar* | 1,388 | *césar* 6,540, a name, against *cesar* 2,152 | Taught at B1 |
| *tender* | 1,083 | *tienda* 23,461 | Receptive, priority 52 |

  The real nouns lose out. *La parte*, *la duda*, *la causa*, *el resultado*, *la diferencia* and *el deseo* have no rank at all. Others rank falsely low: *el acuerdo* at 2,811, *el resto* at 3,038 (taught at session 568), *el ataque* (534), *la marca* (506), *el tema* (356), *el suelo* (471), *el respeto* (379), *el resultado* (416), *la diferencia* (466). *El vino* (wine) is in the receptive tier and never carded. Rank-based policy then makes some of these receptive-only.
- **Late for other reasons, and not bugs:** *el proyecto* (session 278), *la posibilidad* (517), *la justicia* (524), *el proceso* (466), *la energía* (476), *la tecnología* (466), *la cultura* (496), *la capital* (448), *simple* (432), *el/la artista* (584), *la violencia* (566). In all, 127 lexemes of rank 1,000 or better start at session 264 or later, and 79 of rank 1,500 or better at B2 or later.
- **Early:** *la mazorca* at session 29, *bucear* 68, *el cafetal* 71, *obediente* and *travieso* 96, *el granizo* at A2. Theme words are fine, but these take slots from words that matter more.
- **Fix:** rebuild ranks from a POS-tagged lemma source (CORPES XXI lemma frequencies from the RAE or Davies' Frequency Dictionary). Hand-audit the top 3,000 homographs. Add a test that no verb gets more than a set share of its count from forms that are lexemes of another part of speech. Re-run placement, and move core abstract nouns into A2 and B1.

#### V5. HIGH. Glosses contain errors, junk and first-sense traps
- **Locus:** `content/graph/lexemes.json`, fields `en` and `es`. 42 entries in the claims file; many more minor ones were left out.
- **Wrong:**
  - *la parte*: "bulletin, report"
  - *la desgracia*: "disgrace", which is the false friend itself
  - *nuevamente*: "newly"
  - *plazo*: "period, phase"
  - *campamento*: "camping"
  - *el gestión*: wrong article and gender
- **Corrupted:** *la sombra*: "shadow is blocked by the shade of an object)"; *beneficiar*: "to benefit ] or +de]".
- **Taught nonsense:** *el repente* at A1, "attack, upsurge", when the learner needs *de repente*; *obstante*: "hindering"; *el do*, *la fa* (also the wrong gender).
- **Traps where the commonest sense is missing:**
  - *solo*: "alone; lonely", never "only", in a course that says *Solo hay mango* in u04
  - *siquiera*: "at least"
  - *sentido*: "deeply felt, heartfelt" (no noun entry, so *no tiene sentido* taps to that)
  - *hecho*: "done, completed" (no *fact*)
  - *cabo*: "cape (geography)" (no *llevar a cabo*)
  - *temporal*: "storm"
  - *antes*: "earlier"; *alto*: "tall"; *sencillo*: "plain"; *vía*: "track, platform"
  - *función*: "performance, show"; *partido*: "match / game"; *prueba*: "test" in a plot about evidence; *quieto*: "calm"
- **Dialect traps:** *mono*: "overalls"; *paradero*: "whereabouts"; *parado*: "stopped" (the course teaches *pararse*, to stand).
- **Claim to retest:** the vocab report says "The taught tier was read through once by hand". These survived it.
- **Fix:** apply the claims file. Then do a second-pass review of all taught glosses against one dictionary, with the rule that the first gloss is the commonest sense in the corpus. Add a gate check for bracket debris and unbalanced parentheses.

#### V6. HIGH. Sense splits and some inflected words can never have sentences
- **Locus:** tagger lexeme output against `l:<lemma>#<sense>` ids.
- **Evidence:** the tagger only emits base ids, as the vocab report states. So all 18 sense nodes have zero sentences: *llevar#wear*, *tomar#drink*, *quedar#fit*, *tiempo#weather*, *cuenta#bill*, *pedir#order*, *banco#bench*, *orden#command*, *seguro#insurance*, *pasado#past*, *dulce#candy* and the rest. So do words the tagger files under another lemma: *muerto*, *cerrado*, *perdido*, *olvidarse*, *reírse*, *pararse*, *aburrido*, *volverse* have no sentences by tag, and so none the compiler can pick, even where the raw word occurs. Result: 12.7% of lexeme reviews in the simulation (1,713 of 13,446) are bare, with no sentence. These are the top of the bare-review list.
- **Consequence:** *to wear*, *weather*, *the bill*, core A1 meanings, are drilled only as English cue to Spanish word, never in context.
- **Fix:** let the bank carry explicit sense tags on `targets`, written at generation time and checked by the gate. Map participial adjectives and pronominal lexemes to their base at the tagger.

#### V7. HIGH. Governed prepositions are not part of a word
- **Locus:** lexeme `es` and `en`; `content/graph/patterns.json`.
- **Evidence:** 0 of 973 verb entries show a preposition. *Soñar* is "to dream", *casarse* "to get married", *consistir* "to consist", *depender* "to depend". Of 104 common verb plus preposition pairs tested, 25 have a dedicated node, 22 are only mentioned somewhere, and 57 have nothing: *soñar con, casarse con, dudar de, quejarse de, enseñar a, preocuparse por, despedirse de, burlarse de, encargarse de, convertirse en, participar en, pertenecer a, referirse a, oponerse a, comprometerse a, contribuir a, enfrentarse a, amenazar con, acabar con, optar por, carecer de, recurrir a*.
- **Consequence:** this is the classic English-speaker error, *\*me casé a Juan*, *\*sueño de*, *\*depende en*. The checker can mark it wrong but nothing teaches it. C1 writing will fail here.
- **Fix:** add a `governs` field to verb lexemes and display *soñar con* on the card, in the tap note and in Look up. Add one pattern node per pair above a frequency floor. Build a recurring "which preposition" drill with typed answers.

#### V8. HIGH. Collocations and fixed expressions are thin, and news vocabulary is absent
- **Locus:** bank and chapters, measured with inflected matching. 97 collocations tested; 39 have a node.
- **Evidence:** zero occurrences in 72,693 sentences and 219 chapters: *llevar a cabo, medio ambiente, cambio climático, derechos humanos, opinión pública, seguridad social, sentido común, tercera edad, estado civil, poner en marcha, poner en práctica, dejar claro, sacar provecho, correr riesgos, pedir prestado, por una parte, sacar buenas notas*. Near zero: *dar un paseo* 1, *dar una vuelta* 1, *prestar atención* 2, *de vez en cuando* 2, *en vez de* 2, *a menudo* 3, *no obstante* 3, *a través de* 7.
- **Likely cause:** the vocabulary report says multiword items are left to the chunk graph because the tagger cannot match them, and they were listed as candidates that were then not fully added. The gate pushes writers towards words already on the list.
- **Consequence:** the C1 learner cannot read a headline about *cambio climático* or *derechos humanos*, and does not know that one *lleva a cabo* a plan. Knowing words without their collocates is what makes learner Spanish sound translated.
- **Fix:** add a collocation layer of 600 to 800 items from a corpus (delexical verbs, the 200 commonest connectors, fixed phrases, B2 and C1 news pairs), tagged as multiword lexemes, each with a sentence quota. The tagger needs multiword matching; the chunk matcher already does this.

#### V9. HIGH. False friends are not taught as a set
- **Evidence:** none of the 94 contrasts covers a false friend. A few are handled in passing, as notes on a pattern (`p:actualmente`, `p:por-casualidad`, `p:precisamente-concretamente`) or in about 15 scripts. There is no set and no recurring drill. *Embarazada* is not in the graph, has zero bank sentences, and appears once in ch142 ("estaría embarazada"). Absent from the graph: *decepción, disgusto, constipado, excitado, rudo, tópico, vagón*. The inventory has *actual*, *asistir*, *éxito*, *sensible*, with correct glosses and no warning, in only 9 to 19 bank sentences each. *Realizar* appears once as an exact form in the bank, *pretender* and *soportar* not at all as infinitives. *Desgracia* is taught with the wrong meaning (V5).
- **Consequence:** the highest-value items for an English speaker are treated as ordinary words. This is where English speakers make their most memorable mistakes, *estoy embarazado* for "embarrassed" among them.
- **Fix:** add 30 to 40 false-friend pairs as contrast nodes with their own drills, sequenced from A2. Mark them on the word card ("Not *actual*: this means *current*").

#### V10. MEDIUM. Word families are invisible
- **Evidence:** the schema has no family link. By a crude suffix rule, 280 of 878 verbs have a derived lexeme in the graph, and the family members are a median of 177 sessions apart. *Vender, venta, vendedor* are never connected on screen. The Look up word list is flat. There is no teaching of *-ción, -dad, -miento, -oso, -mente, des-, in-* as word-forming rules for reading.
- **Consequence:** the cheapest vocabulary multiplier available to a reader is lost, and the receptive tier relies on derivations the learner has never been shown.
- **Fix:** add `family` to the graph, show it on the word card and tap note, and add a short word-formation strand at B1 and B2. A tagged family also supports the fast path in V1.

#### V11. MEDIUM. Identical glosses make cue cards unfair and hide meaning differences
- **Evidence:** among taught words, 189 first-sense clusters and 70 groups with an identical full gloss. *Saber* and *conocer* are both "to know"; *la llave* and *la clave* are both "key"; *la pena* and *el duelo* are both "sorrow"; *to leave* has five verbs; *school* has four words. `lexemeTypeCard` prefers a sentence gap, but it falls back to the bare gloss when no sentence fits, and 12.7% of lexeme reviews are bare (V6). "Pick the Spanish" cards use the same gloss as their prompt.
- **Consequence:** on those cards a learner who knows *saber* can type it for *conocer* and be marked wrong. More importantly, the same English on both cards teaches that they are interchangeable.
- **Fix:** every gloss in a cluster gets a distinguishing tag ("to know (a fact)", "to know (a person, a place)"). The checker accepts a cluster mate with a friendly near-miss. The gate reports duplicates.

#### V12. MEDIUM. Word recognition options are easy to eliminate
- **Locus:** `otherNodes` in `src/ui/session/cards.ts`. Distractors are chosen by length and band, not part of speech.
- **Evidence from a real session (unit 22):** *el éxito*: "to notice | success | communist"; *brindar*: "to withdraw, to remove | to toast (a drink), to offer | property manager".
- **Consequence:** a noun with an article, a choice of one noun and one verb, and the answer is free. The first retrieval tests nothing.
- **Fix:** same part of speech, and for later rounds a semantic neighbour from the same theme.

#### V13. MEDIUM. Word cards carry almost no word knowledge
- **Evidence:** `Learn`'s present card shows the word, the gloss and one example. No note that *el agua* is feminine (the `gender` field exists, the article hides it), no plural, no stem-change or irregularity flag on the verb (*tener* is just "to have"), no governed preposition, no register, no collocate, no family.
- **Fix:** a one-line grammar strip on the present card and in the tap note: *el agua (f.)*, *pedir (e>i)*, *soñar con*, *formal*.

#### V14. MEDIUM. No register information
- **Evidence:** `variety` exists for 4 lexemes. No lexeme has a register label. *Parce, man, chévere, sumercé* are unlabelled beside *otorgar, proporcionar*. Vulgar words are filtered entirely, so *mierda* (rank 357), *puta*, *joder*, *culo*, *maldito*, *imbécil* and *cabrón* are absent, as are the Colombian *marica, güevón, hijueputa*.
- **Consequence:** a C1 reader of Colombian fiction, or anyone watching a film, meets these on the first page and has no way to know how strong they are.
- **Fix:** a `register` field (formal, neutral, informal, vulgar). A short recognition-only B2 pack on strong language, with the owner's sign-off.

### Reading

#### R1. CRITICAL. A third of tapped words show a note about a different sentence
- **Locus:** `src/ui/data/bundle.ts`, `gloss()`: `if (!phrase && toks.includes(w)) phrase = g;`
- **Evidence:** a word that appears anywhere in any gloss phrase of the chapter returns that phrase, before the word list is consulted. 32.2% of all tokens (25,024) get a note from another sentence. Live in the app, ch001, tapping *la* in *Tomás lleva una carta en la mano.* shows "en la puerta del café de Rosa: at the door of Rosa's café (La Esquina de Rosa, closed since her funeral)". Tapping *de* in *¿Una carta de Altamira?* gives the same. In ch003, *La* in *La verdad, Tomás* gives "Monday, six in the morning". In ch006, *Y* gives "And a parrot". Worse at C1 (36.7%), since glosses are denser.
- **Consequence:** the app says "Tap any word to see what it means" and then answers a different question. An adult beginner will quickly stop trusting the tap, and reading stops being a place where words are learned. The Save button then stores the entire phrase as a "word", which `savedWordNodes` cannot resolve.
- **Fix:** resolve a phrase gloss only if it covers the tapped occurrence in this sentence. Show both layers when the phrase applies: the word first, then "in this phrase: ...". One afternoon of work, and a test over all chapters that no token gets a note whose text is not in its sentence.

#### R2. CRITICAL. There is far too little reading to reach the goal
- **Evidence:** 82,164 words of connected Spanish in the entire course, about the length of one novel. An average learner gets 38,000 new connected words a year. The usual fluency figure is about 500,000 words a year for extensive reading (Nation and Waring); Nation (2014) estimates about 12 encounters across thousands of words needs millions of running words. The research docs say so themselves: "C1-level vocabulary needs millions of words of input" and "required extensive input", and that is not built.
- **Consequence:** the app rests its vocabulary on incidental encounters that do not happen, and fluency in reading never develops. *Words read* on the Progress screen will look fine and mean little.
- **Fix:** a required reading track that grows to at least 400,000 words over the course, roughly A1 15,000, A2 40,000, B1 80,000, B2 120,000, C1 150,000. Most of it is model-drafted through the gate, as is already established. Raise reading time to at least a third of each session from B1 and let some sessions be reading only.

#### R3. CRITICAL. A placed learner reads the wrong level, and the story from the beginning
- **Locus:** `src/ui/session/placement.ts` (never mentions chapters); `chapterFor` in `compile.ts` takes the first unread chapter that is reached; `src/ui/screens/home.tsx`.
- **Evidence:** placed in the real app at week 45, "The news", the first reading was ch001, *Hola, Bogotá*: "Me llamo Tomás Herrera." Home said "Tomás has just landed in Bogotá." In simulation, a learner placed at u45 reads ch001 to ch105 over 206 sessions: 38 A1, 44 A2, 23 B1, **0 B2, 0 C1**. Placed at u52: 38 A1, 25 A2. Placed at u28: all of A1, A2, B1, B2 behind level, 17 of 45 at C1.
- **Consequence:** the reading that should stretch a B2 learner is A1 Spanish. It also breaks the placement promise: "The weeks before it count as known".
- **Fix:** on placement, mark earlier chapters as available but not owed, start at the chapter of the placed unit, and show a one-page synopsis of the story so far, in Spanish at the learner's level. Offer earlier chapters in the library for pleasure.

#### R4. HIGH. There is no graded reading that is not the story
- **Evidence:** all 219 reading items are chapters of one serial. There is no other passage-length reading in `content/`. Genre appears only as short quotations inside the plot: 38 quoted passages over 30 words, 9 over 60. Examples are the two news lines in ch142, the review in ch216, the deed in ch184. `extraReading` is unconnected bank sentences.
- **Can-dos that promise more:** `d:u19-work-and-studies` "read a job ad", `d:u38-in-the-news` "follow a news story", `d:news-report`, `d:u45-the-news` "follow and write a news report", `d:u51-spanish-beyond-colombia` "read Spanish from Spain and other countries", `d:u55-institutional-spanish` "read and write institutional and legal Spanish". There is nothing long enough to show that any of these were achieved. The news text in ch142, the chapter for u45, is about 40 words.
- **Consequence:** the learner meets Spanish as one soap opera, in one voice, and has no practice with the conventions of the texts adults read: headlines, leads, recipes, forms, reviews, essays, poems.
- **Fix, strongest design:** a parallel in-world library, *La Gaceta de La Candelaria*, kept separate from the story so that it stands up as real genre. Mariana's articles, the community board, Vale's recipes as real recipes, Rosa's letters in full, Hernando's taxi log, Leonor's reviews, the Altamira press release, instructions, forms, adverts, opinion columns, then essays. From B2 add real authors in the public domain, glossed: José Asunción Silva, Tomás Carrasquilla, Rubén Darío, Horacio Quiroga, Gabriela Mistral, plus the *María* of Jorge Isaacs at C1. Each unit gets 2 to 4 pieces tied to its can-do.

#### R5. HIGH. Comprehension questions do not test comprehension
- **Evidence:** see 2.6. The right option is the longest in 88 to 92% of first-read questions from B1, so a learner who reads nothing can pass. The closing screen reports "3 of 4 questions right" as if it meant something. All 1,632 questions are multiple choice, none typed. English stays at 77% of questions at C1, unchanged from A1. The first-read questions at C1 are plot recall: "Where was Rengifo arrested?", "Who is on the jury?", "What does Wilson say he really is?" Re-read questions test trivia: "What colour does Vale use in the notebook for Hernando's accounts?" The Spanish questions lift their answers from the text in most cases (35 of 45 at C1). Distractors are often absurd: "Hernando wanted a clown", "Gloria trips".
- **Consequence:** the reading score is not evidence. Worse, the learner reads for facts to pick out, in English, not for meaning in Spanish.
- **Fix:** gate rule: the correct option is not the longest more than 30% of the time per band, and options must be matched in length and plausibility. Questions in Spanish from B1. From B2, at least one typed or short answer per chapter, inference and stance questions ("¿Qué quiere decir Gloria con...?"), and summary tasks. Move plot recall into the warm-up as "the story so far" if it is kept at all.

#### R6. HIGH. C1 text is not C1 text
- **Evidence:** see 2.3. Mean sentence length moves from 5.1 to 8.5 words, and narration sentences from 6.9 to 11.4. Real Spanish news and essay prose runs about 20 to 25 words a sentence by common estimates (my knowledge, not measured here). Word rarity is flat: above rank 3,000, 12.9% at A1 and 12.0% at C1, geometric mean rank 283 to 334. The form never changes: "Name: line" script at every band, 53 to 65% of words. The longest typical narration passage at C1 is 44 words. A C1 reader never holds a long sentence, a paragraph of argument, or a page of description.
- **Consequence:** C1 chapters are comfortable B1 reading with C1 grammar points inserted. The step from them to a Colombian newspaper or García Márquez is a cliff.
- **Fix:** a band specification, enforced by the gate: mean sentence length (B1 12, B2 15, C1 18 to 20), share of dialogue (at most 30% at C1), paragraph length, subordination rate, narration in prose rather than script from B2. C1 chapters of 1,200 to 2,000 words. The owner wants B2 and C1 lessons few and long: reading should be where that length goes.

#### R7. HIGH. The compiler's reading coverage check does not look at words
- **Locus:** `src/compiler/compile.ts coverage()`. Doc comment and diagnostic: "required words". `content/story/ch*.json`, field `requires`.
- **Evidence:** across all 219 chapters `requires` holds 7,329 grammar, 5,464 pattern and 2,318 chunk ids and **zero lexemes**. Words are in the separate field `lexemes`, which `coverage()` never reads. So the per-learner check "introduced but slipping" measures grammar. Bank sentences do gate on lexemes; chapters do not.
- **Consequence:** the reading coverage shown in the design documents is not enforced for any actual learner. A chapter is served whatever the learner's vocabulary. This is what makes V1 invisible.
- **Fix:** pass `lexemes` into `coverage()`. Then chapters above the unknown threshold either wait or auto-gloss the missing words. A personal coverage figure ("You know 96% of this") is motivating too.

#### R8. HIGH. The word note fails on the commonest forms and homographs
- **Evidence:**
  - No note at all: *del* 353, *al* 263, *hay* 119, *veces* 59, *primer* 37, and every gerund and participle not in the lexicon (*mirando, hablando, leído, firmado, venido*). The learner sees "No note for this word yet. Guess from the sentence." on *hay*.
  - Wrong word: *sé* gives "ser: to be" (58 tokens), *fue* always "to be" even when it means went (48), *vino* gives "wine" when it means came (13), *ve* gives "ir" (10), *visto* gives "vestirse" (7), *siéntese* gives "sentir" (9), *entera* gives "enterarse" (8), *cuento* gives "short story" in *te cuento* (6), *como* gives "like" for *I eat* (8), *dicho* gives "saying" (16), *traje* gives "suit" for *I brought*.
- **Cause:** lexeme lookup comes before morphology, and there is no use of the sentence. The tagger already resolves most of these at build time.
- **Fix:** precompute, at build time, the lemma and form of every chapter token with the tagger, ship it with the chapter, and hand-correct the residue. No runtime AI needed, which fits the owner's rule.

#### R9. MEDIUM. Saved and tapped words go nowhere
- **Locus:** `src/ui/blocks/read.tsx useGloss`, `src/ui/screens/story.tsx`, `src/ui/screens/reference/model.ts savedWordNodes`.
- **Evidence:** saving a word appends to a list in UI state. The compiler never sees it. "Practise saved words" is a manual drill (exposure only, no FSRS card) limited to 12 nodes. A receptive word cannot become a card. Tap events are not logged, so the strongest signal of an unknown word is thrown away. A saved word is never highlighted when met again.
- **Fix:** a tap creates a low-priority receptive card; a save creates a normal card; the next chapters with that word mark it lightly. "Save, meet it again, remember it" is the loop this reader was made for.

#### R10. MEDIUM. Sentence English is almost absent, and English never fades
- **Evidence:** the `EN` control appears only where a chapter sentence is identical to a bank sentence: 16 of 11,385. So the feature is effectively dead code. Conversely, at least 215 of 219 hooks are in English, even at C1, as are 77% of questions and all notes. The reader at C1 is still an English-language experience around a Spanish text.
- **Fix:** author one aligned English sentence for every chapter sentence up to B1, removable by setting. From B2, hide it by default. From B1, hooks in Spanish. From B2, tap notes offer a simple Spanish definition first.

#### R11. MEDIUM. The story's form has tics that wear thin over 219 chapters
- **Evidence:**
  - 28 chapters open with "A las...". Time stamps open about 3 lines per C1 chapter.
  - The parrot repeats the target phrase: 81 "¡...parce!" lines, nearly one per chapter at B2 and C1. "¡Lo cual! ¡Lo cual, parce!", "¡Lo tengo clarísimo!". It works as a device at A1 and A2; by C1 it announces the grammar point.
  - *Miró* occurs 131 times, *se rio* 62.
  - Every chapter ends on a hook, and the plot keeps generating new crises after what feels like its natural climax. This one is my opinion from the chapters I read.
- **Consequence:** this is a smaller problem than the rest, but boredom is how readers leave.
- **Fix:** bring in other narrators, documents as chapters, a chapter told entirely in letters, a chapter with no parrot. Retire the catchphrase at B2.

#### R12. MEDIUM. Target items are stuffed into the prose at the cost of natural Spanish
- **Evidence:** ch083 has four *no creo que* + subjunctive in 349 words. ch115 forces *debido a, a causa de, ya que, puesto que* into a café conversation and a TV interview. ch123 has a diver saying *mi jefe no concede vacaciones* and narration saying *Él fue muy consciente de sus manos en la espalda*. Other calques: *Tomás tragó.* (ch115), *se puso la mano en la boca* (ch107), *hacer un truco* (ch123). Off-dialect: *como no respire* and *nada más entrar* for Bogotá voices. The owner's rule is "Natural Spanish beats checker legality"; these break it. 8 such claims are filed. This is occasional, not pervasive: most lines I read are natural.
- **Fix:** let the chapter use the target naturally once or twice and leave saturation to the bank. Add a native-reader pass for B1 and above, focused on narration.

#### R13. LOW. One reading speed is assumed at all levels
- `READ_WPM = 70` in `src/compiler/content.ts` applies to all bands, with a comment "A1-B1". At C1 a 600-word chapter is budgeted at nearly 9 minutes. Timed re-reads are recorded, but no speed goal is set by band and the learner's own speed is not used in the plan. Use the measured speed, and set targets: about 100 words a minute at B1, 150 at C1.

#### R14. LOW. Spelling consistency
- *Se rió* in 11 chapters against *se rio* in 62, and *guión*. Normalise to the RAE 2010 spelling. Filed as a claim.

---

## 4. What the application does well and must be preserved

- **The story.** It has a real premise (the café, the lease, Altamira, the unsent letters), comic voices you can hear, and running payoffs. Hernando's 112 unsent lines and *Rosa: hoy sí te lo digo* at the funeral in ch202 are moving, in a language course. "Prever es ver venir el bus. Prevenir es salirse de la mitad de la calle." is writing, not filler. Do not rewrite this. Build around it.
- **Lexical control of chapters.** About 95 to 99% known against the plan, enforced by a gate that counts tokens. The research target is being met on paper; fix delivery, not the writing.
- **Beat-by-beat reading** with questions between beats (`beats.ts`), the labelled re-reads and timed fluency re-read. These are sound; few apps do them.
- **The verb form note** ("X, from Y, he or she, past"), when it fires. Keep it and extend it to every token.
- **Colombian vocabulary.** The curated LatAm list and its Peninsular pairs for acceptance are well judged.
- **Sense splitting as an idea.** The tag just needs to reach the sentences.
- **Presenting a word before retrieval,** with one real example sentence. The sequence pick, pick, type is right.
- **The honest "receptive-only" principle** for lower-frequency words, which keeps upper-band review load bounded. It needs delivery, not removal.

---

## 5. Missing capabilities

1. Non-story graded reading, across genres.
2. Authentic reading at C1, glossed.
3. A word-to-card path from tapping.
4. Per-learner lexical coverage of a text.
5. A library with level, genre and "you know X% of this".
6. Word families, governed prepositions, register, collocates on the word card.
7. A false-friend strand and a word-formation strand.
8. A multiword lexeme type in the tagger and the graph.
9. Spanish-language definitions, for a monolingual step at B2 to C1.
10. Story synopsis for placed learners and returning ones.
11. Vocabulary size feedback: a real measure of what the learner knows, by band.
12. A delivery metric in the simulator: words delivered against plan.

---

## 6. Recommended improvements

**Fix what is broken**
- Reader gloss resolution (R1), lemma per token at build time (R8).
- Reserve new-word time in the session, make the fit-to-budget path spare words, add the delivery test (V1).
- Apply the 51 claims (V5, R12).
- Placement chapters (R3).
- Pass lexemes to `coverage()` (R7).

**Rebuild the vocabulary foundations**
- Lemma frequency from a POS-tagged source, re-place (V4).
- Tier redesign, count delivered words only (V2).
- Sense tags in the bank (V6).
- `governs`, `family`, `register` fields and a word-card strip (V7, V10, V13, V14).
- Collocation layer of 600 to 800, false-friend pairs (V8, V9).

**Build the reading track**
- *La Gaceta* library, 2 to 4 pieces per unit, tied to can-dos (R4).
- Band prose specification in the gate; longer B2 and C1 chapters (R6).
- Question redesign, in Spanish, with typed and inference tasks (R5).
- Volume target of 400,000 words (R2), then coverage targets of 95% at B2 and 97% at C1 (V3).
- Public-domain authentic texts at C1.
- Tap-to-card loop, library screen (R9).

---

## 7. Uncertainties and limitations

- **Simulated learners are not people.** The compiler and its budgets are real, and the owed queue is deterministic in `fitToBudget`, but a human's speed differs from the profile. In the real app `SECONDS.learn` is the estimate that trims the pool, so the queue depends on the estimate, not the learner's true speed. I confirmed the mechanism in code and in `render.ts` output ("2 new item(s) owed: the plan was over 22 min"), not with real users.
- **Encounters are tagger based.** `requires` undercounts participles and pronominal forms (V6), so low counts for those words are too low. The surface-form check bounds this for the whole corpus; I did not repeat it per learner. Chapter coverage excludes names and numbers, and the tagger's lemma is not always right. Words first met within a chunk count as unknown in the simulated column, so that column is a floor.
- **The "longest option" figure** is a static property of the file. It does not show real learners using this strategy.
- **Frequency:** the Davies list and CORPES were not available to me. Comparisons with them are from memory and from the vocab report's Davies figures. I confirmed homograph pollution from the project's own form counts. The ranks are the project's, which were built from subtitles and Colombian web text.
- **External research** (Nation, Hu and Nation, Laufer and Ravenhorst-Kalovski, Milton and Alexiou, Waring and Takaki) is cited from memory, except what the research docs quote. Dictionary authorities in the claims file are named from knowledge, not opened during this audit.
- **Not inspected:** the other 187 chapters as a reader (I measured them, I did not read them); the receptive-tier glosses beyond the top 1,400 by rank plus pattern scans; scenes and writing tasks as reading; chapter gloss accuracy (only spot checks, and 11 of 3,848 gloss entries do not match the text literally, mostly inflection); pattern scripts; the old app. Comments on the bank's Spanish are limited to vocabulary use.
- **Grammar integration:** a tagger count put a unit's grammar in that unit's chapters 64%, 63%, 36%, 34% and 50% of the time by band, but the `requires` filter makes this unreliable, so I make no finding on it. My reading suggests the opposite problem at B1 (R12).
- **Vulgar vocabulary** is a product decision for the owner.
- **A limitation from a standing decision:** without listening, reading is the only input channel, so the reading shortfall matters more here than in most courses. The no-AI rule rules out graded text on demand, so volume must be prepared in advance.

---

## 8. Suggested implementation priorities

**Now, days of work**
1. R1 gloss resolution with an all-chapters test.
2. V5 and R12 claims: apply the 51 fixes, starting with *la parte, la desgracia, solo, nuevamente, sentido, hecho*.
3. R3 placement chapters and a story synopsis.
4. R7 pass lexemes into coverage.
5. R5 gate rule against the longest-option cue; rewrite the options that fail.

**Next, the structural vocabulary fix, one to two weeks**
6. V1 reserve new-word time and add the delivery test. This decides whether B2 and C1 vocabulary exists at all for most learners. Do it before writing any more content.
7. V4 frequency rebuild and re-placement. Do it together with V2 tier redesign and V6 sense tags, since all three rewrite `lexemes.json` and the units.
8. R8 build-time lemma per token.
9. R9 tap-to-card loop.

**Then, the word-knowledge layer**
10. V7 governed prepositions, V9 false friends, V8 collocations, V13 word card, V10 families, V14 register.

**Largest investment, and the one that changes outcomes most**
11. R4 and R2 the reading track: *La Gaceta*, the genre library, and a volume plan of about 400,000 words. Start at B1 to B2, where the can-dos already promise it.
12. R6 band prose specification, longer C1 chapters, and authentic texts at C1.
13. R5 Spanish questions, typed and inference tasks.
14. V3 coverage targets and the B2 and C1 reading vocabulary layer.
