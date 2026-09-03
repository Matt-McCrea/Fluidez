# Content generation brief — Fluidez v2

## Before anything: check you are on the right baseline

This work lives on the branch **`pcic-architecture`**, not on `main`. `main` is
the working app and is deliberately being left alone.

```
git checkout pcic-architecture
```

`main` still has the old 200-verb `data/verbs.js`, no `data/taxonomy.js`, no
strand lessons and three gates instead of four. Generating against it would
produce a thousand lessons on the wrong baseline — the precise failure this
rebuild exists to prevent.

The derived inputs under `spec/` are **gitignored**, so they exist only in a
working directory where they have been built. If `spec/pcic.json` is missing:

```
node tools/harvest/pcic.js && node tools/harvest/syllabus.js \
  && node tools/harvest/build-vocab.js
```

**Then confirm the baseline before writing anything** — all four must print ✅:

```
node tools/validate-content.js && node tools/test-checker.js \
  && node tools/lint-spanish.js && node tools/audit-verbs.js
```

If they do not, you are on the wrong branch or the spec has not been built.
Stop and fix that first; do not start generating.

---

**Run this with a fast model (Sonnet), low effort, in a FRESH session.** Nothing
below requires the design conversation that produced it; dragging that context
along is pure cost. Read `tools/ARCHITECTURE_V2.md` first for the why.

You are bulk-authoring the content of a complete A1→C1 Spanish course from an
official syllabus that has already been harvested and levelled. You are not
designing anything. Every decision that needed judgement has been made and is
expressed either as a schema the validator enforces or as a rule below.

## What is left, and in what order

A1–A2 lessons are largely written and have been reviewed. **B1 is not**: it has
45 of its 251 lessons and no function, discourse or genre lessons at all. B2 and
C1 have three lessons between them and no practice material whatsoever.

| | grammar | notion | function | discourse | genre | **missing** |
|---|---|---|---|---|---|---|
| A1 | 21 | 2 | 3 | 1 | 5 | 32 |
| A2 | 38 | 9 | 5 | 0 | 11 | 63 |
| B1 | 30 | 38 | **99** | 16 | 23 | **206** |
| B2 | 60 | 74 | 122 | 22 | 27 | **305** |
| C1 | 60 | 78 | 106 | 23 | 25 | **292** |

Work in this order:

1. **B1 lessons** (206) — the level is half-built and a learner can reach it today.
2. **B2 and C1 lessons** (597).
3. **Practice material for B1, B2 and C1** — see the targets below. Without it
   the upper levels give a learner a lesson and then three empty stages.

Do not start B2 before B1 is complete. A learner walks the ladder in order, and
a gap at B1 is reached long before anything at C1 is.

## Absolute rules

1. **Append only.** Never edit `js/`, `tools/`, or existing entries. Never add a
   field, lesson type, probe kind, constraint type, strand, register or theme
   that `data/taxonomy.js` does not already declare. The validator rejects them.
2. **Run all four gates after every batch, and fix everything before continuing:**
   ```
   node tools/validate-content.js && node tools/test-checker.js \
     && node tools/lint-spanish.js && node tools/audit-verbs.js
   ```
   Done means all four print ✅. **Never fix a failure by weakening a validator
   or editing existing content.**
3. **Accents are mandatory and exact.** `tools/lint-spanish.js` adjudicates
   against the engine's complete verb paradigms and will fail the build.
4. **Every verb you conjugate must exist in `data/verbs.js`** — but if the verb
   you need is missing, **add it** rather than writing round it. Writing a C1
   lesson out of beginner verbs is the failure this whole project exists to fix.
   `spec/verb-queue.json` lists the ~560 the syllabus still needs.
5. **Tag everything**: `cefr`, `level`, `pcic`, and `theme` where the content is
   about something. `level` must be one of that CEFR band's gates — the
   validator checks this contradiction.

## Your inputs

| File | What it is |
|---|---|
| `spec/pcic.json` | 19,770 Plan Curricular items, levelled A1–C2, with 11,834 worked examples and resolved cross-references |
| `spec/syllabus-draft.json` | 1,071 lesson units + 575 vocab days, each carrying the `spec` patterns and `examples` it must teach |
| `data/taxonomy.js` | LEVELS, STRANDS, REGISTERS, THEMES — the only legal tag values |
| `data/connectors.js` | 72 discourse markers in 12 PCIC classes |
| `data/strand-lessons.js` | **Five worked templates, one per strand — read these before writing anything** |
| `spec/verb-queue.json` | verbs the syllabus needs and `data/verbs.js` lacks |
| `spec/vocab-queue.json` | every derived vocabulary entry; `known:false` marks those still to write |
| `spec/collocation-queue.json` | ~1,850 collocations with no vocabulary entry to hang from — add as entries, only `en` is missing |

The seed lessons are the specification by example: `fn-acuerdo-b2` (function),
`dc-atenuacion-c1` (discourse), `gn-reclamacion-b2` (genre),
`nt-existencia-a1` (notion), `gr-demostrativos-a2` (grammar).

**Address consistency is now checked.** A text addressing one reader as tú must
not slip into vosotros — an A2 model read *"si tienes pareja, dedicadle más
tiempo"* and no gate could see it. The engine now also parses enclitic forms
(dímelo, ayúdame, levantaos), so the writing checker can finally see the
imperatives the app teaches.

## Phase 0 — the palette is built

Verbs and vocabulary come before lessons, because a generator told "every verb
you conjugate must exist in `data/verbs.js`" and given only beginner verbs will
write a thousand lessons in beginner Spanish. That work is essentially done —
**1,004 verbs and 5,812 vocabulary entries**, with gender, themes, CEFR levels
and collocations derived from the harvest. What remains:

- `spec/verb-queue.json` — 3 verbs. Add with `{ inf, en, type }` plus `stem`
  for a stem-changer or `like` for a prefixed compound;
  **`node tools/audit-verbs.js` checks your classification against 11,834 real
  sentences** and fails on one nothing supports.
- `spec/vocab-queue.json` — 32 entries still marked `known:false`, needing only
  an English gloss. Do not change `es`, and do not re-derive gender or theme.
- `spec/collocation-queue.json` — **2,263 collocations** with no vocabulary
  entry to hang from (`ser alto`, `llevar gafas`, `desempeñar un cargo`). Add
  them as vocabulary entries; only `en` is missing. These matter most at B2/C1,
  where the collocation IS the unit of vocabulary.

If you add a verb or a word, re-run `node tools/harvest/build-vocab.js` and
`node tools/harvest/fix-vocab.js --write` so the derived fields stay in step.

## Do NOT generate these — they are derived by script

Vocabulary headwords, collocations, gender, part of speech, level/theme/PCIC
tags, and cloze answers are produced mechanically from the spec and the
conjugation engine (`tools/harvest/build-vocab.js`, `tools/harvest/lexis.js`).
Writing them by hand introduces errors the scripts cannot. If a task looks like
"expand PCIC notation" or "conjugate X", it is a script's job, not yours.

## What to generate

Work through `spec/syllabus-draft.json` in `seq` order. For each lesson:

**All strands** — `title`, `summary` (2–3 sentences saying what the difficulty
actually is), `sections` (2–4, each `{h, html}`), `examples` (≥3 `{es, en}`),
`probes` (3–6; see below).

**`function`** — `exponents` (≥3, spanning **at least two registers**; the
validator enforces this because the register contrast IS the lesson), plus
`contrasts` and `pitfalls`. Take the exponents from the unit's `spec` array;
the PCIC supplies the Spanish, you supply the English, the register and the
`note`.

**`discourse`** — `exponents` and `pitfalls`. No `contrasts`.

**`notion`** — `exponents`, `contrasts`, `pitfalls`. These teach the linguistic
means for a semantic category (existence, quantity, space, time, quality), so
their exponents are grammatical choices, not social ones: **no register
contrast is required** and `neutral` throughout is correct. Template:
`nt-existencia-a1`.

**`grammar`** — `contrasts` and `pitfalls`, no `exponents`. Grammar lessons go
in `data/strand-lessons.js` like every other strand, NOT in `data/grammar.js`
(which keeps only the original hand-written concept lessons). `js/lessons.js`
merges them into the syllabus. Template: `gr-demostrativos-a2`.

**`lexis` — do not author.** A vocabulary day is derived from `data/vocab.js`
by `js/curriculum.js`: words, themes, levels, gender and collocations all come
from the harvest. The only lexis work is filling English glosses from
`spec/vocab-queue.json` (`known:false`) and `spec/collocation-queue.json`.

**`genre`** — `moves` (≥2, the rhetorical structure in order), `model` (a real
text of the genre, 120–250 words), `checklist` (≥2 pre-send checks). No
`exponents`.

**Probes** are the most important thing you write. They are used three ways —
placement, the pre-lesson skip check, and the mastery gate — so they must test
*exactly* what the lesson teaches and nothing else. Kinds: `recall`
(`front`/`back`), `mcq` (`q`, `options`, `answer` index), `cloze` (`text` with
`___`, `accept` array). Ids start `p:` and are globally unique. A probe a
learner could pass without the lesson is a wasted probe.

### Reachability — check this after any batch

A lesson or word that no code path selects is not content. `js/curriculum.js`
derives its category order from the vocabulary itself (`TAXONOMY.vocabOrder`),
and `Profile.wordAllowed()` gates by CEFR level rather than by a category
whitelist. Both were hardcoded lists that silently hid ~3,600 words. If you add
a new theme, category or strand, confirm it appears in those two paths before
declaring a batch done.

## Register — the one place to be careful

The PCIC does not tag register (only 38 of 19,770 items carry a mark), so you
are assigning it. The validator catches labels that are *provably* wrong:

- `formal` / `escrito` must not address the listener as tú/vosotros
- `coloquial` must not use usted/su forms or formal formulas
- the same exponent must not carry different registers in different lessons

Those rules do not make a label *right*, only not-obviously-wrong. So:

- Always write the `note` field, and make it state the **evidence** — "uses
  usted", "a formula from formal letters", "the teacher/parent we". A label
  without evidence is unreviewable.
- When unsure between two registers, choose `neutral`. An over-claimed
  `coloquial` teaches a learner to sound wrong in an interview.

## Batch protocol

Work in batches of 10–15 lessons per file. After each batch run the three
gates. Fix every error before the next batch. Do not proceed with a red gate.

Report per batch: lessons added, gate status, and any spec unit you skipped
with the reason. **Skipping is allowed and better than inventing** — if a unit's
`spec` patterns are too thin to teach (`teaches` < 3, or all entries are
structural headings like "Forma"), skip it and say so. A pruning pass expects
this.

## Quality bar

Natural, contemporary, neutral Spanish; peninsular conjugation (the app teaches
vosotros). Concrete and situated — real people, places, times. MCQ distractors
must be plausible and wrong for a *reason a learner would have*, never silly.
At B2 and above the English gloss disappears, so the Spanish must carry itself.

The failure mode to avoid: content that is *longer* rather than *harder*. A C1
lesson is not a B1 lesson with more words — it turns on register, connotation,
discourse structure or a genuine grammatical subtlety. If a C1 item would be
answerable by a strong B1 learner, it is wrong regardless of its vocabulary.

## Not yet done (do not assume these exist)

- Placement, skip checks and sequence-position progression are designed
  (probes exist on every lesson) but not built: the session still finds the
  next lesson by walking the syllabus for the first unstudied one.
- The B2/C1 apply and produce modes have no views. `applyMode: 'register'` and
  `'reformular'` and `produceStyle: 'extended'` are carried on the level as
  `applyModeTarget`/`produceStyleTarget` and fall back to typing.
- `SUPPORT` (guided/standard/fast) is declared in `data/taxonomy.js` but is not
  yet a separate control; each level currently fixes its own scaffolding.
- Enclitic parsing covers imperatives only; `decírselo` and other
  infinitive/gerund attachments still return nothing, because infinitives are
  not in the morphological index.

## What the app does with what you write

Every authored lesson goes in `data/strand-lessons.js` and needs no
registration anywhere: `js/lessons.js` merges it in and **derives the teaching
order** from its own `level`, `strand` and title — level first, then strand
(grammar and notion before the functions that use them, discourse and genre
after). `window.SYLLABUS` and `window.GRAMMAR_LESSONS` are both built from
that, so a new lesson takes its place in the ladder automatically.

The app is divided into **A1-C1 level sections** (`js/profile.js`, generated
from `window.LEVELS`), each with its own accent colour and its own content
gate: a learner at B1 sees only material at or below gate 5. So a lesson's
`cefr` and `level` are not decoration — they decide who ever sees it. Getting
them wrong hides the lesson rather than misfiling it.

## Writing for B2 and C1 — what actually makes it harder

The single failure to avoid is **content that is longer rather than harder**. A
C1 lesson is not a B1 lesson with more words. If a strong B1 learner could
answer your C1 item, it is wrong however advanced its vocabulary looks.

What genuinely raises the level:

- **Register and its consequences.** At B2 the exponents of a function stop
  being interchangeable; at C1 the choice carries social meaning that a wrong
  pick actively breaks. This is why `registerContrast` is enforced on function
  and discourse lessons.
- **Subordination and mood.** Concessives, consecutives, conditionals beyond
  `si + presente`, sequence of tenses, the subjunctive in relative and
  adverbial clauses.
- **Discourse.** Cohesion across sentences, reformulation, mitigation, reported
  speech, the argumentative connectors in `data/connectors.js`.
- **Connotation.** Words that differ in nuance rather than denotation, and the
  collocations already derived into `data/vocab.js`.

## Practice material — the shapes you have

`data/passages.js`, `data/apply.js` and `data/writing.js` feed the Comprender,
Aplicar and Producir stages. **The views for B2/C1-specific exercise types do
not exist**, so use the shapes that are implemented and make the CONTENT
harder inside them:

| file | permitted types |
|---|---|
| `passages.js` | questions: `mcq`, `short`, `translate` |
| `apply.js` | `cloze`, `transform` |
| `writing.js` | `build`, `translate`, `write`, `paragraph` |

`transform` is where reformulation lives — *"rewrite with `de ahí que`"*,
*"say this without naming who is responsible"*. `paragraph` plus the B2/C1
constraints is where argument lives. Those constraints exist and are checked:

```
connectorFrom {class}   avoidsAny {words}     avoidsPerson {person}
subjunctiveAfter {trigger}   cliticCluster    sePassive
distinctTenses {n}      minSentences {n}
```

So an argumentative C1 task is a `paragraph` with, say, `connectorFrom:
contraargumentativo`, `subjunctiveAfter: 'aunque'`, `avoidsPerson: 'tú'` and
`minSentences: 5`. A formal-register task is `write` with `avoidsPerson: 'tú'`
and `avoidsAny` of colloquialisms. Every model answer must satisfy its own
constraints — `test-checker.js` enforces that.

### Passage targets and how they change by level

| | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| have | 87 | 22 | 11 | 0 | 0 |
| add | — | +40 | +70 | +80 | +80 |
| length | 30–60 | 60–100 | 100–160 | 200–300 | 320–450 |
| glossary | English | English | English | **Spanish** | **none** |

The glossary language is the important one. **At B2 the gloss is a Spanish
definition, not a translation** (`la sequía — un periodo largo sin lluvia`), and
**at C1 there is none at all** — so a C1 passage must carry itself. This comes
from `glossLang` in `data/taxonomy.js`.

Also add per level: **apply** +80 B1, +120 B2, +120 C1; **writing** +50 B1,
+80 B2, +80 C1.

Spread passages across the 20 themes in `data/taxonomy.js`. The existing ones
cluster on everyday life, and the themes that carry real register at B2/C1 —
`politica`, `economia`, `medios`, `ciencia`, `naturaleza` — have no coverage at
all. Tag every passage with its `theme` and `cefr`: they decide which level
section ever shows it.

Each passage still needs `gloss`, and 3–5 questions mixing `mcq`, `short` and
exactly one `translate` whose line appears verbatim in the text. At B2/C1 the
`mcq` questions should test inference and attitude — what the writer implies,
which of two positions is being reported — not fact retrieval.

