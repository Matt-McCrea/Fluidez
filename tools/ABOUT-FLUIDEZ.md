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

There are **two builds in one repository**. The full app at the root, and a
games-only arcade at `juegos/` with its own service worker, its own board and
its own icon. They share every module and every store.

## The daily session (the full app)

Five stages, in this order, and the order is the pedagogy — review protects
prior learning, input comes before output:

| | stage | what happens |
|---|---|---|
| 1 | **Repasar** | spaced-repetition review of what is due |
| 2 | **Aprender** | one grammar/function/genre lesson, ending in a recall check |
| 3 | **Comprender** | read a passage with a glossary, answer, translate one line |
| 4 | **Aplicar** | cloze conjugation in context — the form chosen from the *meaning* |
| 5 | **Producir** | build, translate, then free writing against a live constraint checker |

Same day = same session (deterministic from the date). Session lengths
(`rapido` / `corto` / `diaria` / `larga`) are subsets of the same five — there
is no second code path.

## The shape of the content

| | count |
|---|---|
| walked course days | 663 (A1 0–106, A2 107–187, B1 188–352, B2 353–491, C1 492–662) |
| units | 75 |
| strand lessons | 798 (A1 91 · A2 111 · B1 175 · B2 221 · C1 200) |
| passages | 818 |
| apply (cloze) items | 718 |
| writing tasks | 731, of which **26 are `essay`** |
| self-assessment rubrics | 3 |
| vocabulary / verbs / idioms | 5,820 / 1,166 / 83 |
| themes | 20 |

The syllabus is harvested from the **Plan Curricular del Instituto Cervantes**
(`spec/` is gitignored and rebuilt by `tools/harvest/`).
`tools/ARCHITECTURE_V2.md` has the reasoning.

## The seven ideas you need before editing anything

**1. `data/course.js` IS the teaching order.** Units own their days and a human
reads the order. `COURSE_DAYS`, `COURSE_UNITS` and `COURSE_BANDS` are derived
from it, so a band's start cannot drift.

**2. `level` means one thing: how hard the language is.** A 1–10 gate (A1 gets
1, C1 gets 8–10). Order lives in `course.js`; `level` lives on the content.

**3. Reading is gated by TAUGHT TENSE, not by level.** Every passage carries a
generated `tenses` array (`tools/tense-index.js`) and the session withholds
anything whose tenses the learner has not reached.

**4. Writing above B1 is an `essay`, and it carries a process.** A `brief` (the
situation, with a reader who wants something), a `plan` (the genre's moves), a
`rubric` id (`data/rubrics.js`), and a 150–250 word model. `js/essay.js` runs
four phases — plan, draft, model, self-mark — because a C1 text is planned
before it is written and revised after. The median `minWords` at B2/C1 was
**eight** before this existed.

**5. The checker verifies mechanics; the rubric hands back the rest.** No local
model can judge whether a concession was answered or merely admitted, so the
rubric asks questions that are *facts about the text* ("¿se sabe cuál es tu
postura antes del final del primer párrafo?") and carries a repair for each.
`connectorFrom` takes a `minLevel` — without it, "use a contraargumentativo" is
satisfied by `pero` and an advanced task asserts nothing.

**6. Nothing is trusted; seven gates decide.** Run them all before and after any
change, and **check exit codes directly** — piping to `tail` reports `tail`'s
status and has hidden a real failure before:

```
node tools/validate-content.js && node tools/test-checker.js \
  && node tools/lint-spanish.js && node tools/audit-verbs.js \
  && node tools/test-essay.js && node tools/test-arcade.js \
  && node tools/build-game-index.js --check
```

- `validate-content` — ids, tags, levels, stale `tenses`, the course placing
  every lesson once, the arcade's page/worker parity, every storage key
  registered in `js/settings.js`, both cache versions fresh
- `test-checker` — every model answer satisfies its own constraints
- `lint-spanish` — accent errors, adjudicated against the engine's paradigms
- `audit-verbs` — verb classification against 11,834 real sentences
- `test-essay` — drives the essay screen and the session's essay cadence
- `test-arcade` — 933 checks: every game deals with no corpus loaded, the board
  renders, back navigation lands, the error log retires
- `build-game-index --check` — the precomputed question bank matches the corpus

Plus `tools/variety.js <BAND>`, which catches what the gates cannot see: 81 B1
passages once passed every gate and were *the same passage*.

**7. Never fix a red gate by weakening the gate.** If a gate is wrong, the fix
is a sharper rule, not a looser one — and say so out loud. Three sharpenings of
`avoidsPerson` are in `js/checker.js`, each after it failed a *correct* text.

## The arcade (`juegos/`)

A games-only build: **27 files, 3.0 MB** against the app's **71 files, 7.5 MB**.
Its own service worker scoped to `/juegos/`, its own dark board
(`css/arcade.css`), its own 🔥 icon.

- `tools/build-game-index.js` precomputes the question bank (8,732 ES↔EN pairs,
  2,871 grammar questions, 5,820 words) so the arcade needs neither
  `strand-lessons.js` nor `passages.js`, `writing.js`, `apply.js` or `vocab.js`.
  **It does not know how to build an index** — it loads `js/gameitems.js` and
  calls it, because a generator that reimplemented the extraction would be right
  until somebody changed a filter.
- **The root `sw.js` ignores `/juegos/`.** Its scope is the whole site and it
  serves cache-first; while it answered for that page it handed it a mixture of
  fresh and stale files and the board went blank. `js/arcade.js` also checks the
  functions it needs before drawing and says on the page what is missing.
- Eight games. `Conjugación` (was Verbos — the key is still `verbos`, so records
  survive), `Vocabulario`, `Traducción`, `Gramática`, `Uno u otro` (ser/estar,
  por/para, pretérito/imperfecto — real sentences, one word removed, the
  alternative conjugated by the engine), `Racha`, `Supervivencia`, `Emparejar`.
- **Estudiar** (`js/study.js`) is the non-game: up to 12 cards a day — what you
  got wrong, what the SRS says is due, a few new words — as untimed flashcards,
  then the same words dealt as a round.
- One focus control, not two. A tense biases every game and locks Conjugación;
  a theme or "solo verbos" filters Vocabulario; "Mis fallos" deals every
  question from the error log.

## Mistakes, and how they come back

`js/errorlog.js` is the memory. Three routes back: **1 in 4** questions in an
ordinary round, **first into the daily pack**, and the **Mis fallos** focus.
An entry retires after **three correct in a row**; a fresh miss resets the run.

Two rules that look like bugs and are not:

- **A game never demotes an SRS card.** A correct answer grades up; a miss
  enrols and logs but does not lapse a mature card. A mistype at second 58 must
  not cost you a memory.
- **A miss with no SRS id is still recorded.** `ErrorLog` synthesises a `miss:`
  key. The contrast game carries an id on *none* of its items and translation on
  49%, so requiring one threw a whole game's mistakes away.

## Layout

```
index.html          the full app; plain <script> tags in order
juegos/index.html   the arcade; its own sw.js, manifest and icons
js/engine.js        conjugation + morphological analysis (the source of truth)
js/session.js       the daily orchestrator
js/views/*.js       one file per stage
js/checker.js       constraint verification for free-written Spanish
js/essay.js         the four-phase extended writing runner
js/gameitems.js     where every game question comes from
js/gameround.js     one universal round (clock, combo, ghost, revisits)
js/arcade.js        the arcade's board, stats and focus
js/study.js         the daily pack
data/course.js      the teaching order
data/rubrics.js     self-assessment templates
data/game-index.js  GENERATED — the arcade's question bank
data/taxonomy.js    LEVELS, STRANDS, the 20 THEMES — the only legal tag values
tools/              gates, generators, audits (all node, no deps)
```

## Conventions that bite if you miss them

- **Peninsular Spanish** — the app teaches *vosotros*, and a passage may not mix
  tú and vosotros address.
- **Glossary language is per band**: English to B1, a Spanish definition at B2,
  none at C1. Passage lengths 30–60 / 60–100 / 100–160 / 200–300 / 320–450 words.
- **`node tools/bump-cache.js`** in any commit touching a precached file — it
  versions *both* service workers. The validator fails if you forget.
- **`node tools/build-game-index.js`** after any change to the corpus the games
  read, or the arcade deals yesterday's questions.
- **`node tools/make-icons.js`** regenerates the arcade icon from the system
  emoji font (macOS only; the PNGs are committed so nobody else must run it).
- **A new `localStorage` key must be added to `KEYS` in `js/settings.js`**, or
  export and reset both miss it. The validator checks this.
- **`WORKLIST.md` is hand-maintained.** Tick lines; never run
  `tools/worklist.js --force`.
- **Generated fields are generated.** `tenses`, vocabulary headwords, gender and
  cloze answers come from tools and the engine. If a task looks like "conjugate
  X" or "expand this notation", it is a script's job.
- **The code explains itself in comments, at length, including what was tried
  and rejected.** Match that. A comment here says *why*, and often *what broke
  last time* — that is the house style, not decoration.
