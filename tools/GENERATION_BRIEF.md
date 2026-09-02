# Content generation brief — Fluidez v2

**Run this with a fast model (Sonnet), low effort, in a FRESH session.** Nothing
below requires the design conversation that produced it; dragging that context
along is pure cost. Read `tools/ARCHITECTURE_V2.md` first for the why.

You are bulk-authoring the content of a complete A1→C1 Spanish course from an
official syllabus that has already been harvested and levelled. You are not
designing anything. Every decision that needed judgement has been made and is
expressed either as a schema the validator enforces or as a rule below.

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
| `data/strand-lessons.js` | **Three worked templates — read these before writing anything** |
| `spec/verb-queue.json` | ~560 verbs the syllabus needs and `data/verbs.js` lacks |
| `spec/vocab-queue.json` | ~3,700 vocabulary entries needing only an English gloss |

The three seed lessons are the specification by example: `fn-acuerdo-b2`
(function), `dc-atenuacion-c1` (discourse), `gn-reclamacion-b2` (genre).

## Phase 0 — build the palette FIRST

Do not start lessons until the vocabulary and verbs exist. A generator obeying
rule 4 with only the starter verb set will produce a thousand lessons written in
beginner Spanish, which is exactly the outcome this rebuild is meant to prevent.

1. **Verbs** — work through `spec/verb-queue.json` into `data/verbs.js`. Most
   need only `{ inf, en, type }`; the morphology layer derives orthographic
   changes (`realizar>realicé`, `coger>cojo`, `conocer>conozco`,
   `incluir>incluyo`). Add `stem: 'ie'|'ue'|'i'|'í'|'ú'` for a stem-changer and
   `like: 'tener'` for a prefixed compound (`mantener`, `proponer`, `atraer`).
   **`node tools/audit-verbs.js` checks your classification against 11,834
   sentences of real Spanish** and fails on a verb nothing supports — so
   misfiling one is caught by evidence, not by review. Run it every batch.
2. **Vocabulary** — `spec/vocab-queue.json` holds ~3,700 non-verb entries with
   the Spanish, theme, CEFR level, part of speech, gender (83% resolved, with
   its evidence recorded) and collocations already derived. **Only the English
   gloss is missing.** Do not re-derive the rest and do not change `es`.

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

**`genre`** — `moves` (≥2, the rhetorical structure in order), `model` (a real
text of the genre, 120–250 words), `checklist` (≥2 pre-send checks). No
`exponents`.

**Probes** are the most important thing you write. They are used three ways —
placement, the pre-lesson skip check, and the mastery gate — so they must test
*exactly* what the lesson teaches and nothing else. Kinds: `recall`
(`front`/`back`), `mcq` (`q`, `options`, `answer` index), `cloze` (`text` with
`___`, `accept` array). Ids start `p:` and are globally unique. A probe a
learner could pass without the lesson is a wasted probe.

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

- The session does not yet *choose* a strand lesson as a day's focus
  (`js/selector.js`, `js/session.js`).
- `js/profile.js` still uses the old beginner/standard/refresher profiles;
  the LEVELS/SUPPORT split in `data/taxonomy.js` is not wired in.
- Per-level accent theming is declared in taxonomy but nothing sets
  `data-level` on the document yet.
- Placement, skip checks and sequence-position progression are designed
  (probes exist) but not built.
