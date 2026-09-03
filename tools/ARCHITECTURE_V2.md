# Fluidez v2 — architecture

The app becomes a complete A1→C1 course built on the **Plan Curricular del
Instituto Cervantes** (PCIC), harvested to `spec/pcic.json` by
`tools/harvest/pcic.js` (19,770 specification items, 7,642 with worked
examples, 1,550 cross-references resolved).

Derived syllabus: **1,071 lessons + 575 vocab days ≈ 1,646 lesson-days**
(`spec/syllabus-draft.json`, readable form in `spec/syllabus-outline.txt`).

## Decisions taken

1. **Existing content is not sacred.** The current 120 passages / 342 apply
   items / 650 writing tasks / 395 vocab entries are A1–B1 and were authored
   before there was a syllabus. Keep them as *style reference and seed*;
   regenerate against the PCIC ladder rather than retrofitting PCIC ids onto
   them. Anything that survives does so because it fits, not because it exists.
2. **Progression is by sequence position, not by date.** The current
   `day % lessons.length` in `js/session.js` silently skips content when days
   are missed. Position is stored in progress and advances on completion.
3. **A day is one lesson, but finishing one offers the next.** No daily cap.
   1,646 lesson-days is ~4.5 years at one a day and that is an honest number
   for a language; the learner sets the pace.
4. **Levels replace profiles.** `PROFILES` in `js/profile.js` is already a
   bundle of knobs — it becomes `LEVELS`, keyed A1/A2/B1/B2/C1. `beginner` and
   `refresher` were *placement* in disguise. What survives as a separate axis
   is **support** (guided / standard / fast).
5. **No new lower-level lessons once you have passed a level** — only review.
   The PCIC spiral means the B2 pass over articles is a genuinely different
   lesson from the A1 pass, not a repeat.
6. **Placement test at first run**, per strand (see below).
7. **Per-level theming.** `css/styles.css` is already fully tokenised, so a
   level accent is a `[data-level]` block overriding `--accent`/`--accent-2`.

## The four layers

| Layer | What | Count |
|---|---|---|
| **Level** | A1 · A2 · B1 · B2 · C1 | 5 |
| **Strand** | grammar · function · discourse · notion · genre · lexis | 6 |
| **Lesson** | one teaching unit in a strand at a level | ~1,646 |
| **Item** | generated exercises attached to a lesson | ~15–25k |

Orthogonal: **support** (guided / standard / fast) — scaffolding, independent
of level.

The five session stages (Repasar · Aprender · Comprender · Aplicar · Producir)
are unchanged. What changes is that the day's focus may come from any strand,
and the other four stages orient around it.

### Strands

- **grammar** — form and its use. What the app teaches today.
- **function** — the choice between forms for a social effect. *Expresar
  acuerdo* at B2 is 31 exponents differentiated by register and polarity; no
  new grammar, all new competence. This is the largest gap in the current app.
- **discourse** — cohesion, markers, register, mitigation, reported speech.
- **genre** — the shape of a real text: a complaint, an opinion column, a
  formal email, a report. Drives the Producir stage at B2+.
- **lexis** — themed vocabulary *and collocations*. `desempeñar un cargo
  directivo` is one item, not three words.

## Probes — one artefact, three jobs

Every lesson declares `probes`: 3–5 items that test exactly what it teaches.
(Generalises the `recall` array grammar lessons already carry.) The same probes
serve:

1. **Placement** — sample probes across the ladder to find the entry point.
   Run **per strand**, because a rusty ex-speaker is often strong on grammar
   and absent on pragmatics. A single global level would misplace them badly.
2. **Skip check** — a lesson's own probes offered *before* it. Pass ⇒ the
   lesson is marked known, its items enter SRS at a raised box, and the
   sequence advances without spending a day on it.
3. **Mastery gate** — the same probes after, and on an SRS schedule, to decide
   retention and whether the level is complete.

This is what makes "don't waste my time on what I know" tractable: it is one
data-modelling decision, not three subsystems. Passive evidence (cloze
accuracy, the writing checker's morphological analysis, `js/errorlog.js`) can
raise or lower confidence and pre-empt the skip check.

## Themed tracks

Beyond the daily sequence, a learner can choose to spend a week on one theme —
employment, climate, religion, health. The PCIC supports this directly: its
*nociones específicas* inventory is organised into 20 themes across every
level.

A track is a cross-cutting assembly, not a separate content set: the theme's
lexis days + passages tagged with the theme + writing tasks on it + the genres
it naturally uses (employment → cover letter, complaint; climate → opinion
column, report) + the functions it needs (arguing, conceding, hypothesising).

**This has a consequence that must be settled before generation, not after:
every generated item carries a `theme` tag** (and its PCIC id). Retrofitting
theme tags onto ~20k items later would be miserable.

## Content model changes

- `level: 1–5` → `cefr: A1|A2|B1|B2|C1` plus a numeric gate for ordering.
- Every item carries `pcic` (the spec id it teaches) and `theme`.
- Vocab gains **collocations** — `tools/harvest/lexis.js` already expands the
  PCIC notation into them.
- New lesson types `function` / `discourse` / `genre` need renderers; the
  existing stage views are the pattern to follow.
- New exercise types from the DELE task formats: banked cloze on connectors,
  reformulación with a mandated word, error correction, register rewrite,
  paragraph reordering, vocabulary-in-context, summary, C1 mediación.
- `checker.js` needs constraints for what advanced content asserts
  (`connectorFrom`, `relativePronoun`, `cliticCluster`, `register`) — `regex`
  covers some of it today but not readably.

## Order of work

1. ~~Schema + validators for the new layers, strands, probes and tags.~~ done
2. ~~One vertical slice: a function lesson, rendered.~~ done — plus a discourse
   and a genre lesson, so all three new shapes are exercised by real content.
3. ~~The palette: morphology rules, verbs, vocabulary.~~ engine + 457 verbs done;
   ~560 verbs and ~3,700 glosses remain, queued in `spec/`.
4. Prune the ladder against what the slices teach us.
5. Bulk generation, gated by the four gates.
6. Placement, skip checks, sequence-position progression.
7. Themed tracks (falls out of the tags, set in step 1).

**Phase 0 of any generation run is the palette.** The verb and vocabulary sets
must exist before lessons are written, or every lesson is capped at the
vocabulary of a beginner course — the exact failure the rebuild is for.

## The gates

| Gate | What it protects |
|---|---|
| `validate-content.js` | schema, taxonomy references, levels, probes, register coherence |
| `test-checker.js` | every model answer satisfies its own constraints |
| `lint-spanish.js` | accent errors in prose, adjudicated against engine paradigms |
| `audit-verbs.js` | verb classification, scored against 11,834 real sentences |

`validate-content.js` also checks address consistency (tú vs vosotros across a
text) and that a noun's article agrees with its recorded gender.

The engine is the authority the first three trust, which is why the fourth
exists: a verb filed in the wrong class makes the engine confidently wrong and
every other gate certifies the result.
