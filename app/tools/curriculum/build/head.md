# Fluidez 2 — unit map (for review)

The curriculum architect's map: 60 weekly units, A1→C1, neutral Latin American Spanish with the story set in Bogotá. Machine-readable versions live in `app/content/graph/*.json` (the skill graph) and `app/content/units/uNN.json` (one file per unit). Every node and unit parses against `src/content/schema.ts`, and a check confirms that no node's priority comes before anything it requires.

**What's in the graph.** 172 grammar points, 640 patterns, 395 chunks, 94 contrasts and 269 can-dos, across 593 sessions:

| Band | Units | Sessions | Grammar | Bank quota |
|---|---|---|---|---|
| A1 | 1–14 | 1–133 | 43 | 6,673 |
| A2 | 15–27 | 134–263 | 39 | 5,133 |
| B1 | 28–41 | 264–403 | 42 | 6,720 |
| B2 | 42–51 | 404–503 | 28 | 5,794 |
| C1 | 52–60 | 504–593 | 20 | 5,456 |
| **Total** | **60** | **593** | **172** | **29,776** |

Across all units the quotas also call for 219 story chapters, 108 scenes and 241 writing tasks. Lexemes are left to the vocab rebuild: each unit's `theme` field names its PCIC area, followed by the vocab themes for that unit.

**The week.**
- **A1–A2** use the BLUEPRINT rhythm with a third grammar point added: Introduce, Drill, Introduce, Drill, Input, (Patterns), Introduce, Drill, Output, Review. That gives three grammar points every 9–10 sessions, about 2.3 a week.
- **Unit 1** has four grammar points and no review day, because there is nothing to review yet.
- **B1** moves Input forward (Introduce, Drill, Input, …) and always has a Patterns day.
- **B2 and C1** introduce 2–3 points per unit. They have two Input or two Output days and Patterns days of up to ten frames, because upper-band lessons should be few and long.
- **Every fourth unit ends on a checkpoint** (✓ in the tables).

**The compiler's rules hold everywhere.**
- At most one grammar point is introduced per day.
- Introduce days are never consecutive.
- Every Introduce day is followed by a Drill within 1–3 sessions.
- New chunks are capped at 3 on Introduce days, 4 on Drill days and 5 on Input and Patterns days. Output, Review and Checkpoint days add no new items.
- Contrasts are drilled only after both sides have been taught.
- Each unit's can-do is dated no earlier than its last grammar point.

**The cast** (the story is the reason to come back):
- **Tomás Herrera** (34) was born in Bogotá and raised in Toronto. He is a laid-off software tester whose Spanish is rusty, like the learner's.
- **Valentina "Vale" Ospina** (28) is a sharp pastry chef from Medellín who ran the café with his grandmother.
- **Don Hernando Pacheco** (71) is a retired taxi driver and a regular for forty years. He tells terrible jokes and secretly loved Rosa.
- **Mariana Cifuentes** (33) is an investigative journalist and Tomás's childhood friend.
- **Simón** is the café parrot. He repeats chunks at the worst possible moment.

**The stakes.** Tomás inherits *La Esquina de Rosa* in La Candelaria just as Ricardo Altamira's hotel group is buying up the block. An unsent 1978 letter from Rosa to her estranged brother Joaquín leads the cast to Medellín and the Caribbean coast. It also leads to a heritage hearing, a cooperative and, slowly, Tomás and Vale.

## Grammar milestones (session index, standard tier)

| Milestone | Session | Plan target |
|---|---|---|
| present -ar (with irregular chunks from session 1) | 8 | 1 |
| gender and articles | 6 | ≤8 |
| stem-changers (boot verbs) | 22 | ≤26 |
| **preterite as a system** (-ar 29, -er/-ir 31, fui/hice 34, irregulars 50, spelling 98) | **29** | ~30 |
| imperfect of states (era, estaba, tenía, había) | 48 | ~45 |
| perfecto for experience and "not yet" only | 67 | ~60 |
| lo/la/los/las | 92 | — |
| full imperfect / preterite vs imperfect | 96 / 105 | ~95 |
| tú / usted commands | 115 / 117 | — |
| future (guesses first) / conditional | 184 / 190 | — |
| **present subjunctive** (wanting: *quiero que*) | **194** | ~175 |
| subjunctive of opinion and doubt | 264 / 274 | — |
| pluperfect | 294 | — |
| imperfect subjunctive / *si tuviera* | 384 / 387 | — |
| *si hubiera…, habría…* | 421 | — |
| Spain recognition (vosotros, *hoy he ido*) / voseo recognition | 494 / 574 | — |

## Supply quotas: the formula

```
bankSentences = 40 × grammar points introduced in the unit
              + 15 × patterns introduced
              +  6 × chunks introduced
              +  6 × expected new lexemes   (A1 35, A2 32, B1 30, B2 27, C1 25 per unit)
chapters      = number of days in the unit that carry a chapter id
                (A1 u01–04: 2; A1–A2: 3; B1: 3; B2–C1: 5)
scenes        = Output day (a) + second Output or last Drill from B1 (b) + checkpoint (c)
writingTasks  = max(3, band index + 2)  →  A1 3, A2 3, B1 4, B2 5, C1 6
```

**Why these multipliers.**
- **Reviews never repeat a cue** (plan §1). Every review of a word or grammar point uses a sentence the learner hasn't seen.
- **Grammar needs 40 sentences.** FSRS gives each grammar point about 8–10 scored retrievals in its first 2–3 months, in both directions. On top of that come drill days, the review-day remix and checkpoints. 40 sentences cover about 3× the simulator's expected consumption.
- **Patterns need 15.** They get about 5 scored contacts, and 15 sentences cover 3× that.
- **Chunks and lexemes need 6.** That is the plan's floor.
- **Contrasts get no separate quota.** They draw on the sentences of both sides.
- **Phase 3 calibrates these numbers.** The simulator should replace the constants once it reports real consumption, and supply must stay at least 3×.
