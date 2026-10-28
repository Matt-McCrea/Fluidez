# Fluidez — teaching standards

*What a good lesson, reading and task looks like, at each level, for the learner
this app is for. Part 1 is measurable and checked by script. Part 2 is a
judgement rubric for a human or a reviewer agent. Part 3 is the principle the
rest follows from. Where this file and older notes disagree, this file wins.*

**Learner:** an English-speaking adult beginner, studying alone, about fifteen
minutes a day at A1, rising to thirty at B2 and above.

---

## Part 3 first — the principle: phrases before rules

At A1 and most of A2 the learner is collecting **ready-made phrases** that do a
job, not learning a grammar system. *Me llamo Ana* is taught as "this is how you
say your name", not as a reflexive verb. *Tengo treinta años* is "this is how you
say your age", not as a lesson on *tener* idioms. *¿Me pone un café?* is how you
order. The grammar inside those phrases is named later, once the learner owns
several phrases that share it and needs the rule to make new sentences.

Concretely:

1. **A1 teaches phrases by default.** A rule is explained only when the lesson's
   own task needs the learner to build new sentences with it (the present-tense
   endings, gender agreement), and then in three sentences or fewer, after the
   examples, not before.
2. **Grammar arrives as a reveal, not a prerequisite.** When a rule is finally
   taught, it opens with phrases the learner already knows: "You have been saying
   *me llamo*, *me levanto*, *me gusta*. Here is what that *me* is."
3. **A form above the learner's level is allowed only as a fixed phrase,**
   glossed as a whole and not analysed (*¡Que te vaya bien!* at A1 is fine; a
   subjunctive explanation is not).
4. **One lesson, one job.** One communicative goal or one grammar point. Two only
   when they are halves of the same idea (asking for information / giving it).
5. **Talk to a person, not a syllabus.** Titles and headings say what the learner
   can now do, in plain English or very simple Spanish. Abbreviations and PCIC
   labels never reach the screen.

---

## Part 1 — numeric targets

Measured per lesson (or passage, or task) by `tools/audit-standards.js`.
"Phrases to learn" means the lesson's keywords and exponents, counted once
each. Examples and contrast lines illustrate them and are not counted. A fixed
phrase (*¿Cómo te llamas?*) counts as one.

### Lessons

| Measure | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| Phrases to learn (max) | 10 | 12 | 14 | 16 | 18 |
| New keywords (max) | 8 | 8 | 10 | 10 | 12 |
| English explanation words (max) | 150 | 180 | 220 | 260 | 280 |
| Teaching sections (max) | 3 | 3 | 4 | 5 | 5 |
| Spanish grammar terms visible to learner | 0 | 0 | ≤2, each glossed | ≤4 | free |
| Abbreviations (OD, OI, CD…) in titles/headings | 0 | 0 | 0 | 0 | 0 |
| Probes that test the lesson's own point | ≥3 | ≥3 | ≥3 | ≥3 | ≥3 |
| Probes requiring production (typed, not chosen) | ≥1 | ≥1 | ≥2 | ≥2 | ≥2 |

English grammar words allowed in explanations at A1–A2, with no gloss needed:
*verb, noun, ending, question, singular, plural, masculine, feminine, formal,
informal, past, present, future*. Anything else (*clause, object, pronoun,
reflexive, subjunctive, auxiliary…*) needs a plain-words gloss with an example
the first time it appears in a lesson, and at A1 should be avoided altogether.

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
| C | **Phrase or rule, right for the level** | Teaches as phrases or as rules exactly as Part 3 says for this band | Mostly right; one rule explained a band early | Explains machinery a learner does not need yet | A1/A2 learner is given grammar analysis instead of something to say |
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
