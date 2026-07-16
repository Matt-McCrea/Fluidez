# Content-generation brief (for a fast model on low effort)

You are expanding the Spanish content of **Fluidez** (`/Users/Matthew/Fluidez`),
a static offline learning app. You will ONLY add entries to four data files.
Every schema is self-documented by the header comment + existing entries in the
file — match them exactly.

## Hard rules

1. **Do not edit anything under `js/` or `tools/`, and do not change existing
   entries** — append new ones only. Do not invent new constraint types,
   question types, or fields.
2. **Verbs**: any verb you conjugate — in a cloze `inf`, a writing-task
   constraint, or a writing-task model answer — MUST exist in `data/verbs.js`
   (search it first). In passage prose, strongly prefer dataset verbs.
3. **Accents are mandatory and must be correct.** The validator analyses every
   conjugated form; sloppy accents will be rejected.
4. **Levels** (tag every new passage / apply item / writing task):
   - 1 = presente, ser/estar, gender & articles
   - 2 = pretérito, imperfecto, por/para
   - 3 = futuro, condicional, presente perfecto
   - 4 = subjuntivo (pres. + imp.), imperativo, pluscuamperfecto
   - 5 = futuro perfecto, condicional perfecto, perf. de subjuntivo
   An item's level = the HIGHEST-level tense it uses. A level-1 passage must
   contain no verb form beyond level 1.
5. **IDs** must be new and unique (writing tasks, passages; recall not needed —
   you are not writing lessons).
6. After EVERY batch, run **both** gates and fix every error before continuing:
   ```
   node tools/validate-content.js && node tools/test-checker.js
   ```
   You are done only when both print ✅. Never "fix" an error by weakening a
   validator or deleting someone else's content.

## What to add

- `data/passages.js` — **12 passages**: 4×level 1, 4×level 2, 2×level 3,
  2×level 4. 60–120 words each, everyday topics (routines, travel, food,
  work, family, weather). Each: 3–5 word `gloss`, 3–5 questions mixing `mcq`
  (plausible distractors), `short`, and exactly one `translate` whose `line`
  appears VERBATIM in the text.
- `data/apply.js` — **50 cloze + 12 transforms** spread across levels 1–4.
  Cloze sentences must FORCE the tense by meaning (time markers: ayer, mañana,
  de niño, todos los días, espero que…) — never leave the tense guessable.
  Vary person; don't overuse yo. Include the English gloss `en`.
- `data/writing.js` — **20 tasks**: 5 build, 5 translate, 10 write, spread
  across levels 1–4. Constraints: 2–4 per task, mixing a tense/person
  requirement with a vocabulary or structural one. Every `models` answer must
  satisfy ALL of its own task's constraints (the validator enforces this) and
  read as natural Spanish.
- `data/vocab.js` / `data/idioms.js` — **30 vocab** (with articles, useful
  everyday nouns/adjectives not already present) and **15 idioms/phrases**
  (format `{es,en,lit}`). No duplicates of existing `es` values.

## Spanish quality bar

Natural, contemporary, neutral Spanish. Standard peninsular conjugation is fine
(the app teaches vosotros). Keep sentences concrete and situated (people,
places, times). Passages should tell a tiny story or paint a scene, not read
like a grammar exercise.
