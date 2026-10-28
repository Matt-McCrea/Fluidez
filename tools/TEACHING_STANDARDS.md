# Fluidez — teaching standards

*What a good lesson, reading and task looks like, at each level, for the learner
this app is for. Part 1 is measurable and checked by script. Part 2 is a
judgement rubric for a human or a reviewer agent. Part 3 is the principle the
rest follows from. Where this file and older notes disagree, this file wins.*

**Learner:** an English-speaking adult beginner, studying alone, about fifteen
minutes a day at A1, rising to thirty at B2 and above.

---

## Part 3 first — the principle: give adults the tools early

The learner is an intelligent adult. Adults learn rules quickly, and explicit
grammar teaching works for them: it lets one rule generate hundreds of
sentences instead of memorising each one. So the course hands over the
**grammar toolkit early and fast**, and spends the rest of its time making the
learner fluent with it.

Fixed phrases still have a job, but a narrower one: getting the learner talking
on day one, before the tools exist, and carrying things whose grammar is
genuinely out of reach for now.

Concretely:

1. **A grammar spine, front-loaded.** The core tools (Part 1, "Grammar spine")
   arrive on a schedule measured in days, not hundreds of days. Every other
   lesson (functions, topics, genres) is where those tools get used.
2. **Short, sharp explanations.** A rule is explained in plain English with a
   pattern table and three to five examples, then practised at once. Precise
   is better than long: one well-chosen table beats three paragraphs.
3. **Phrases first, then the reveal, quickly.** Week one runs on survival
   phrases (*me llamo*, *tengo treinta años*, *¿me pone un café?*). Within days
   the grammar inside them is named: "*me llamo* is literally 'I call myself' —
   here is how *me*, *te*, *se* work." The phrase is the hook, not a substitute
   for the rule.
4. **A form beyond the toolkit appears only as a fixed phrase,** glossed whole
   (*¡Que te vaya bien!* before the subjunctive has been taught).
5. **One lesson, one job.** One grammar point or one communicative goal. Two only
   when they are halves of the same idea (asking for information / giving it).
6. **Talk to a person, not a syllabus.** Titles and headings say what the learner
   can now do. Grammar terms are fine when they help (an adult benefits from
   knowing the word *preterite*), but each is explained in plain words the
   first time, and abbreviations and PCIC labels never reach the screen.

---

## Part 1 — numeric targets

Measured per lesson (or passage, or task) by `tools/audit-standards.js`.
"Phrases to learn" means the lesson's keywords and exponents, counted once
each. Examples and contrast lines illustrate them and are not counted. A fixed
phrase (*¿Cómo te llamas?*) counts as one.

### Grammar spine — the headline target

The day (in course order, one lesson a day) by which each core tool has been
taught. These are the targets the course is judged on first; everything else
in Part 1 is secondary. "Today" is the day the last lesson for that tool
appears in `data/course.js` now; `tools/audit-standards.js` prints both.

| Tool | Target day | Today |
|---|---|---|
| Present tense, regular verbs | 3 | 3 |
| Ser and estar | 5 | 5 |
| Gender, articles, plurals | 6 | 99 |
| Adjective agreement | 8 | 52 |
| Questions and negation | 8 | 11 |
| Key irregular presents (tener, ir, hacer…) and stem changes (quiero, puedo) | 12 | 179 |
| *Gustar* and verbs like it | 15 | 33 |
| *Ir a* + infinitive (the everyday future) | 15 | no lesson |
| Reflexive verbs | 18 | 75 |
| Possessives and demonstratives | 20 | 57 |
| Direct object pronouns, personal *a* | 25 | 121 |
| Preterite, regular and key irregulars | 30 | 46 |
| Imperfect | 40 | 107 |
| Preterite vs imperfect | 45 | 113 |
| Indirect object pronouns, *se lo* | 50 | 304 |
| Present perfect | 50 | 69 |
| Affirmative commands | 55 | 126 |
| Comparatives; *por* and *para* | 60 | 159 |
| Present subjunctive (wishes, *cuando* + future, *ojalá*) | 80 | 188 |
| Future and conditional | 90 | 217 |
| Negative commands; relative clauses | 100 | 297 |
| Imperfect subjunctive, *si* clauses, compound tenses | 130 | 342 |

So every main tense and mood by about day 130, against day 342 now. Learners
who want to go faster can take more than one lesson a day; the course already
offers the next lesson when one is finished.

### Lessons

These are diagnostics, not targets. A long lesson is fine if it teaches one
thing well; a short one that bundles three unrelated topics is not. The audit
reports them so a reviewer knows where to look.

| Measure | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| Phrases to learn (look if above) | 14 | 14 | 16 | 18 | 20 |
| English explanation words (look if above) | 250 | 250 | 280 | 300 | 300 |
| Teaching sections (look if above) | 4 | 4 | 5 | 5 | 5 |
| Abbreviations (OD, OI, CD…) in titles/headings | 0 | 0 | 0 | 0 | 0 |
| Probes that test the lesson's own point | ≥3 | ≥3 | ≥3 | ≥3 | ≥3 |
| Probes requiring production (typed, not chosen) | ≥1 | ≥1 | ≥2 | ≥2 | ≥2 |

Grammar terms are allowed at every level, as long as each is explained in plain
words with an example the first time a lesson uses it. Spanish-language
terminology (*complemento directo*, *oración subordinada*) stays out of A1–B1.

### Reading passages

The learner should already know or have glossed at least **95% of the running
words** of a passage (98% for extended reading at B2+). Below 95%, readers stop
reading and start decoding.

| Measure | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| Length in words | 40–80 | 80–140 | 140–220 | 220–320 | 300–450 |
| Mean words per sentence (max) | 10 | 12 | 16 | 22 | 28 |
| Words outside the 3,000 most frequent forms, not glossed, not names and not already taught (max) | 5% | 6% | 8% | 10% | 12% |
| Tenses above the learner's taught tenses | 0 | 0 | 0 | 0 | 0 |

The rare-word limit is reliable for A1–B1. At B2 and C1 the learner knows far
more than the 3,000 most frequent forms, so that row is provisional until the
check uses a larger list.

### Writing tasks

Model-answer length grows with the band. The anchors are roughly the lengths
of the DELE writing tasks at each level.

| Measure | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| Typical output (model answer) | 1–2 sentences, 8–25 words | 3–5 sentences, 30–70 | 80–130 | 140–200 | 200–280 |
| Share of tasks at band length or longer (min) | 40% | 50% | 50% | 60% | 60% |

Short translate and build tasks still belong at every level. The share target
stops them from being the whole of writing at B2 and above.

### The course as a whole

- **Smooth climb.** No measure above may fall by more than 15% from one band to
  the next, and none may rise more than 1.6× in one step.
- **Spacing of new grammar.** At A1, no more than one new rule-based grammar
  lesson in any three consecutive days. Phrase lessons do not count.
- **Daily time.** One A1 session (review, lesson, reading, apply, produce) fits
  in about fifteen minutes for a beginner.
- **Review only reviews.** The review stage shows only items the learner has
  actually met. A first session has no review stage.
- **Fair choices.** Multiple-choice distractors come from the same category as
  the answer (a greeting against other greetings), so the right answer cannot be
  found by elimination.

---

## Part 2 — the judgement rubric

Score each dimension 1–4. **A lesson passes with an average of 3 or more and
nothing below 2.** Reviewers quote the line that justifies any score of 1 or 2.

| | Dimension | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|
| A | **Sounds like a teacher** | Reads as a person talking to the learner; warm, plain, direct | Clear but a little stiff | Reads like reference notes; lists, slashes, notation | Reads like a database or a syllabus inventory |
| B | **One clear job** | One goal, obvious from the title | One main goal plus a closely related second | Two unrelated points, or a goal hidden in the detail | Several topics with no common thread |
| C | **Gives the learner a tool** | States the rule clearly and briefly, with a pattern the learner can use at once to make new sentences | Clear rule, but longer or later than it needs to be | Rule buried in detail, or a list to memorise where a rule would do | No usable rule; or terminology and analysis with nothing to say |
| D | **Natural Spanish** | Every line is something a native speaker (Spain) would say in that situation | Natural with one stilted line | Several textbook-only lines | Unnatural or wrong |
| E | **Worth learning now** | High-frequency, useful in the learner's first real conversations at this band | Useful, slightly niche | Low value at this band | Learner would rarely meet it |
| F | **Examples teach** | Examples run simple to harder, in a believable context, and show the point | Good examples, little progression | Examples are isolated or too long for the band | Examples don't show the point |
| G | **Practice matches** | Probes test exactly what was taught, including at least one produced answer | Mostly matched | Probes test something else or only recognition | No meaningful practice |
| H | **Fits where it sits** | Uses only what came before; sets up what comes next | Minor forward reference | Needs a later lesson to make sense | Out of place in the course order |

### Reference examples

- **4s across the board — `dlg-presentarse` (A1, day 0, "Dos personas se
  conocen").** A real first conversation, phrases glossed as phrases, one thing
  to notice (Spanish drops *yo*), told in plain words.
- **Fails A, B, C — `gr-pronombres-atonos-a2` ("Pronombres átonos: OD y OI").**
  The title uses abbreviations and a Spanish grammar label. Three sections in
  about a hundred words cover direct pronouns, indirect pronouns and the
  *le → se* swap. It never says what a direct object is in words an English
  speaker would use, and it mentions *le* replacing *lo* to a learner who has
  just met both. A passing version would open with phrases the learner knows
  (*¿Lo tienes? Sí, lo tengo*), teach *lo/la* alone, and leave *se lo* for a
  later lesson.
- **Fails B — `nt-referencias-generales-a1` ("La hora, los días y la
  frecuencia").** Telling the time, days of the week, parts of the day,
  how-often words and the double negative with *nunca* in one A1 lesson. That
  is at least two lessons, probably three.

---

## Open decisions

- Daily time budget at each band (fifteen minutes at A1 is assumed above).
- Whether the course stays Peninsular-only, or glosses common Latin American
  alternatives.
- Whether A1 titles are in English or in simple Spanish.
