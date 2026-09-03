# Content generation brief — Fluidez

**Run with a fast model, low effort, in a fresh session.** Everything you need
is below or in a file it names. Read `tools/ARCHITECTURE_V2.md` only if you want
the reasoning.

You are writing the content of an A1→C1 Spanish course whose syllabus has
already been harvested from the Plan Curricular del Instituto Cervantes and
levelled. You are not designing anything.

---

## 1. Baseline check — do this first

```
git checkout pcic-architecture          # NOT main; main is the old app
```

If `spec/pcic.json` is missing, the derived inputs are gitignored and must be
rebuilt:

```
node tools/harvest/pcic.js && node tools/harvest/syllabus.js && node tools/harvest/build-vocab.js
```

All four gates must print ✅ before you write anything:

```
node tools/validate-content.js && node tools/test-checker.js && node tools/lint-spanish.js && node tools/audit-verbs.js
```

If they do not, you are on the wrong branch or the spec is not built. Stop.

## 2. What is left

**Do not guess, and do not work through `spec/syllabus-draft.json` from the
top — most of A1 and A2 is already written.** Ask:

```
node tools/todo.js                  # summary by level and strand
node tools/todo.js B1 function      # the actual units, with their PCIC source
node tools/todo.js --practice       # the passage / apply / writing gap
```

`todo.js` matches syllabus units to written lessons through the PCIC ids each
lesson records, so it lists only what is genuinely missing. Re-run it after
every batch; it is the definition of done.

As of writing: **463 lesson units outstanding of 1,071.**

| level | grammar | notion | function | discourse | genre | total |
|---|---|---|---|---|---|---|
| A1 | 11 | 0 | 4 | 1 | 1 | 17 |
| A2 | 20 | 0 | 6 | 0 | 4 | 30 |
| B1 | 14 | 1 | **66** | 4 | 14 | **99** |
| B2 | 33 | 11 | **92** | 9 | 19 | **164** |
| C1 | 34 | 13 | **79** | 11 | 16 | **153** |

Plus practice material, which is a separate axis and is **the larger gap**:

| | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| passages | 87 ✓ | 22 → 62 | 11 → 81 | **0 → 80** | **0 → 80** |
| apply | 118 ✓ | 163 ✓ | 61 → 141 | **0 → 120** | **0 → 120** |
| writing | 156 ✓ | 91 ✓ | 28 → 78 | **0 → 80** | **0 → 80** |

### Order of work

1. **Finish A1 and A2 lessons** (47) — small, and a learner meets them first.
2. **B1 lessons** (99), then **B1 practice material**.
3. **B2 lessons** (164) and **B2 practice material**.
4. **C1 lessons** (153) and **C1 practice material**.

Finish a level before starting the next. A learner walks the ladder in order,
so a hole at B1 is reached long before anything at C1. A level with lessons but
no passages gives the learner a lesson and then three empty stages.

## 3. Absolute rules

1. **Append only.** Never edit `js/` or `tools/`, never change existing entries.
   Never invent a field, lesson type, probe kind, constraint type, strand,
   register or theme that `data/taxonomy.js` does not declare.
2. **All four gates green after every batch.** Never fix a failure by weakening
   a validator or editing existing content.
3. **Accents are mandatory and exact** — `lint-spanish.js` fails the build.
4. **Every verb you conjugate must exist in `data/verbs.js`.** If one is
   missing, add it (`{ inf, en, type }`, plus `stem` for a stem-changer or
   `like` for a prefixed compound) — never write around it with an easier verb.
   `audit-verbs.js` checks the classification against 11,834 real sentences.
5. **Tag everything**: `cefr`, `level`, `pcic`, and `theme` where the content is
   about something. `level` must be one of that band's gates. **These decide
   which level section shows the item** — wrong tags hide it, they do not just
   misfile it. This applies to passages, apply items and writing tasks too:
   none of the existing 937 carry a `theme`, so none of them can ever appear in
   a themed track. Do not add to that backlog.

## 4. Inputs

| file | what |
|---|---|
| `spec/pcic.json` | 19,770 syllabus items, levelled, with 11,834 worked examples |
| `spec/syllabus-draft.json` | the 1,071 units, each with the `spec` points and `examples` it must teach |
| `data/taxonomy.js` | LEVELS, STRANDS, REGISTERS, the 20 THEMES — the only legal tag values |
| `data/connectors.js` | 72 discourse markers in the PCIC's own 12 classes |
| `data/strand-lessons.js` | **five worked templates, one per strand — read before writing** |
| `spec/verb-queue.json` | 3 verbs still missing |
| `spec/vocab-queue.json` | 32 entries needing an English gloss (`known:false`) |
| `spec/collocation-queue.json` | **2,263 collocations** to add as vocabulary entries; only `en` is missing |

Templates: `gr-demostrativos-a2` (grammar), `nt-existencia-a1` (notion),
`fn-acuerdo-b2` (function), `dc-atenuacion-c1` (discourse),
`gn-reclamacion-b2` (genre).

**Do not hand-write** vocabulary headwords, collocations, gender, part of
speech, or cloze answers. Those are derived by `tools/harvest/build-vocab.js`
and the conjugation engine. If a task looks like "expand the PCIC notation" or
"conjugate X", it is a script's job.

## 5. Writing lessons

All go in `data/strand-lessons.js`. Every lesson needs `title`, `summary` (2–3
sentences saying what the *difficulty* is), `sections` (2–4 `{h, html}`),
`examples` (≥3 `{es, en}`) and `probes`.

| strand | its own blocks |
|---|---|
| `grammar` | `contrasts`, `pitfalls` — no `exponents` |
| `notion` | `exponents`, `contrasts`, `pitfalls`. Exponents are grammatical means (haber / estar / tener), so **no register contrast is required**; `neutral` throughout is right |
| `function` | `exponents` (≥3, **two registers minimum** — enforced, the contrast IS the lesson), `contrasts`, `pitfalls` |
| `discourse` | `exponents`, `pitfalls` — no `contrasts` |
| `genre` | `moves` (≥2, the rhetorical structure in order), `model` (a real text, 120–250 words), `checklist` — no `exponents` |
| `lexis` | **never authored** — vocabulary days are derived from `data/vocab.js` |

**Probes** (3–6) are the most valuable thing you write: they drive placement,
the pre-lesson skip check and the mastery gate. Kinds are `recall`
(`front`/`back`), `mcq` (`q`, `options`, `answer` index) and `cloze` (`text`
with `___`, `accept`). Ids start `p:` and are globally unique. **A probe a
learner could pass without the lesson is wasted.**

### Register

The PCIC tags register on only 38 of 19,770 items, so you assign it. The
validator catches labels that are provably wrong — `formal`/`escrito` must not
address the listener as tú, `coloquial` must not use usted forms, and the same
exponent cannot be two registers in two lessons. That makes a label
not-obviously-wrong, not right. So:

- always write `note`, and make it state the **evidence** ("uses usted", "a
  formula from formal letters");
- when torn, choose `neutral`. An over-claimed `coloquial` teaches someone to
  sound wrong in an interview. Do not label ordinary neutral Spanish
  (`Esto es Venezuela`) as colloquial.

## 6. Writing practice material

This is the larger half of the work and it is **not optional** — without it the
upper levels have nothing to read or practise on.

**The B2/C1-specific views were never built.** Use the shapes that exist and
make the *content* harder inside them:

| file | permitted types |
|---|---|
| `data/passages.js` | questions: `mcq`, `short`, `translate` |
| `data/apply.js` | `cloze`, `transform` |
| `data/writing.js` | `build`, `translate`, `write`, `paragraph` |

`transform` is where reformulation lives — *"rewrite with `de ahí que`"*, *"say
this without naming who is responsible"*. `paragraph` plus constraints is where
argument lives. These constraints exist and are checked:

```
connectorFrom {class}        subjunctiveAfter {trigger}   avoidsPerson {person}
avoidsAny {words}            cliticCluster                sePassive
distinctTenses {n}           minSentences {n}
```

A C1 argumentative task is a `paragraph` with `connectorFrom:
contraargumentativo`, `subjunctiveAfter: 'aunque'`, `avoidsPerson: 'tú'`,
`minSentences: 5`. A formal-register task is `write` with `avoidsPerson: 'tú'`
and `avoidsAny` of colloquialisms. **Every model answer must satisfy its own
constraints** — `test-checker.js` enforces it.

### Passages

| | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| length | 30–60 | 60–100 | 100–160 | 200–300 | 320–450 |
| glossary | English | English | English | **Spanish definition** | **none** |

The glossary is the thing most often got wrong. At B2 the gloss is a Spanish
definition, not a translation (`la sequía — un periodo largo sin lluvia`); at
C1 there is none, so the passage must carry itself. This comes from
`glossLang` in `data/taxonomy.js`.

Each passage needs `gloss`, a **`theme`** from `data/taxonomy.js`, and 3–5
questions mixing `mcq`, `short` and exactly one `translate` whose line appears
**verbatim** in the text. At B2/C1 the `mcq` questions should test inference and
attitude — what the writer implies, which position is being reported — not fact
retrieval.

### Variety — the failure the gates cannot see

The B1 batch passed all four gates and was correct, level-appropriate Spanish.
It was also **the same passage 81 times**: 73% contained "Antes de …", 49%
"espera que", 31% "dudaba que", and a fifth used all three. The topics varied;
the sentence architecture did not, because each text was built around a grammar
point rather than around something to say. A learner meets the frame, not the
language.

```
node tools/variety.js B1
```

reports over-used frames, length against the band's target, theme coverage and
verb range. **Run it before calling a batch done.** Rules that follow from it:

- **No syntactic frame in more than a quarter of a level's passages.** If you
  need the pluscuamperfecto in twenty texts, reach it twenty different ways —
  not "Antes de X, había Y" twenty times.
- **Write to the length band.** B1 passages currently average 94 words against
  a 100–160 target; A1 averages 72 against 30–60. Count.
- **Vary the verbs.** `data/verbs.js` holds 1,004. The B1 apply items drill 51,
  and lean on `terminar`, `llegar`, `decir`, `tener`. Aim for at least one
  distinct verb per two items.
- **Start differently.** Ten of the 81 B1 passages open "Después de".

Spread them across the 20 themes in `data/taxonomy.js`. The existing ones
cluster on everyday life; `politica`, `economia`, `medios`, `ciencia` and
`naturaleza` have no coverage at all, and they are where register lives.

## 7. Quality bar

Natural, contemporary Spanish; peninsular conjugation (the app teaches
vosotros). Concrete and situated — real people, places, times. MCQ distractors
must be wrong for a *reason a learner would have*, never silly.

**The failure to avoid is content that is longer rather than harder.** A C1
lesson is not a B1 lesson with more words. What raises the level is register
with consequences, subordination and mood, discourse cohesion across sentences,
and connotation. **If a strong B1 learner could answer your C1 item, it is
wrong however advanced its vocabulary looks.**

## 8. Batch protocol

Work in batches of 10–15 items. After each batch:

1. run all four gates and fix everything before continuing;
2. for practice material, run `node tools/variety.js <level>` — correct is not
   the same as varied, and the gates only check correct;
3. re-run `node tools/todo.js` to see what remains;
4. report: what you added, gate status, and any unit you **skipped** with the
   reason. Skipping beats inventing — if a unit's `spec` points are too thin to
   teach (`teaches` < 3, or all entries are structural headings like "Forma"),
   skip and say so.

Commit each batch. Do not proceed with a red gate.

## 9. Things that do not exist yet — do not assume them

- Placement, skip checks and progression by sequence position are designed
  (probes exist) but not built.
- The B2/C1 apply and produce views (`register`, `reformular`, `extended`) —
  hence section 6.
- Enclitic parsing covers imperatives only; `decírselo` returns nothing.
