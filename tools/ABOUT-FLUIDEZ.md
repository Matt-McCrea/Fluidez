# Fluidez — what this app is

*Paste this at the start of a session that needs to understand the codebase
before touching it. It explains the app; it asks for nothing. Task briefs
(`GENERATION_BRIEF.md`, and the one-off briefs beside it) sit on top of this.*

---

## In one paragraph

Fluidez is an offline, installable web app that teaches Spanish A1→C1 as **one
session a day**. It is plain static files — no build step, no framework, no
`package.json`, no server. Open `index.html` and the app *is* the session. Every
answer is checked in the browser, and every conjugation the learner is asked for
is **computed at runtime by a conjugation engine**, never stored as an answer
key, so the drills cannot drift from the grammar.

## The daily session

Five stages, in this order, and the order is the pedagogy — review protects
prior learning, input comes before output:

| | stage | what happens |
|---|---|---|
| 1 | **Repasar** | spaced-repetition review of what is due (vocab, idioms, lesson recall points) |
| 2 | **Aprender** | one grammar/function/genre lesson, ending in an active-recall check that enrols into the SRS |
| 3 | **Comprender** | read a passage with a glossary, answer questions, translate one line |
| 4 | **Aplicar** | cloze conjugation in context — the form is chosen from the *meaning* |
| 5 | **Producir** | build a sentence, translate one, then free writing against a live constraint checker |

Same day = same session (deterministic from the date); it rotates as days
advance. Session lengths (`rapido` / `corto` / `diaria` / `larga`) are subsets
of these same five — there is no second code path.

## The shape of the content

| | count |
|---|---|
| walked course days | 671 (A1 1–108, A2 109–189, B1 190–357, B2 358–496, C1 497–671) |
| core units / optional deep units | 63 / 12 |
| lessons on the path / authored in total | 581 / 682 |
| passages | 621 |
| apply (cloze) items | 674 |
| writing tasks | 485 |
| vocabulary / verbs / idioms | 5,822 / 1,166 / 83 |
| themes | 20 |

The syllabus is harvested from the **Plan Curricular del Instituto Cervantes**
(19,770 specification items → `spec/pcic.json`; `spec/` is gitignored and
rebuilt by `tools/harvest/`). `tools/ARCHITECTURE_V2.md` has the reasoning.

## The five ideas you need before editing anything

**1. `data/course.js` IS the teaching order.** It used to be a sort — level,
then strand, then title — and for ~600 lessons the *Spanish spelling of the
title* was the only tiebreaker, so the sequence was an artifact. Now units own
their days and a human reads the order. `COURSE_DAYS`, `COURSE_UNITS` and
`COURSE_BANDS` are all derived from it, so a band's start cannot drift.

**2. `level` means one thing: how hard the language is.** It is a 1–10 gate
(A1 gets 1, C1 gets 8–10). It used to do double duty as teaching order too, and
the two kept contradicting each other. Order lives in `course.js`; `level`
lives on the content.

**3. Reading is gated by TAUGHT TENSE, not by level.** Every passage carries a
generated `tenses` array (`tools/tense-index.js`) and the session withholds
anything whose tenses the learner has not reached. This exists because `level`
was only ever a *proxy* for "which tenses may appear", and A1 is a single level
— so making the preterite legal at level 1 made it legal on day 3 too. The
scanner that produces the field (`tools/lib/tense-scan.js`) is the same one the
content gate levels verbs with, deliberately, so the app and the gate cannot
disagree.

**4. Nothing is trusted; four gates decide.** Run all four before and after any
content change — check exit codes directly, piping to `tail` reports `tail`'s
status and has hidden a real failure before:

```
node tools/validate-content.js && node tools/test-checker.js \
  && node tools/lint-spanish.js && node tools/audit-verbs.js
```

- `validate-content.js` — every id resolves, every tag is legal, no verb form
  above a passage's level, `tenses` not stale, the course places every lesson
  exactly once
- `test-checker.js` — every writing task's model answer satisfies that task's
  own constraints
- `lint-spanish.js` — accent errors, adjudicated against the engine's paradigms
- `audit-verbs.js` — verb classification against 11,834 real sentences

Plus `tools/variety.js <BAND>`, which catches what the gates cannot see: 81 B1
passages once passed every gate and were *the same passage* — 73% contained
"Antes de …". It also enforces the rule that a passage must carry **≥10 words of
its own theme**, and that one sets the exit code.

**5. Never fix a red gate by weakening the gate.** If a gate is wrong, the fix
is a sharper rule, not a looser one — and say so out loud. `lint-spanish` has a
known blind spot where a correct noun deaccents onto a verb form (`averías`,
`íntegra`, `intérprete`); the answer there is to reword, or to fix the verb
table if the engine is genuinely wrong.

## Layout

```
index.html          the whole app; loads plain <script> tags in order
js/engine.js        conjugation + morphological analysis (the source of truth)
js/session.js       the daily orchestrator: picks the day's content
js/views/*.js       one file per stage
js/lessons.js       assembles the ordered syllabus; SEED is the tense ladder
js/lexmatch.js      "does this text contain this word" — ONE matcher, two callers
data/course.js      the teaching order
data/passages.js    reading texts (+ generated `tenses`)
data/apply.js       cloze/transform items
data/writing.js     writing tasks + constraints
data/vocab.js       vocabulary, banded and themed
data/taxonomy.js    LEVELS, STRANDS, the 20 THEMES — the only legal tag values
tools/              gates, generators, audits (all node, no deps)
```

## Conventions that bite if you miss them

- **Peninsular Spanish** — the app teaches *vosotros*. A passage may not mix
  tú and vosotros address; the gate checks it.
- **Glossary language is per band**: English to B1, a **Spanish definition** at
  B2, **none** at C1. Lengths 30–60 / 60–100 / 100–160 / 200–300 / 320–450 words.
- **`node tools/bump-cache.js`** in any commit touching a precached file, or
  installed copies keep serving the old app. The validator will tell you.
- **`WORKLIST.md` is hand-maintained.** Tick lines; never run
  `tools/worklist.js --force`, which rewrites it and loses every tick.
- **Generated fields are generated.** `tenses` comes from a tool. Vocabulary
  headwords, gender and cloze answers come from the harvest and the engine. If
  a task looks like "conjugate X" or "expand this notation", it is a script's
  job, not an authoring job.
- **The code explains itself in comments, at length, including what was tried
  and rejected.** Match that. A comment here says *why*, and often *what broke
  last time* — that is the house style, not decoration.
