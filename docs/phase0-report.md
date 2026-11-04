# Phase 0 — audit of the restructure

28 October 2026. Inputs: `docs/research/Fluidez Spanish course sequencing.md`
(**SEQ**) and `docs/research/Structuring Spanish Learning for English-Speaking
Adults.md` (**BLUEPRINT**, the text-only revision from 19:04). Nothing structural
has changed. The new code is the read-only audit in `tools/reseq/`.

**Mode: restructure.** The repo is the existing Fluidez app, and its lesson ids
are exactly the CSV's ids.

## 1. The app as it stands

| | |
|---|---|
| Stack | Static, offline-first PWA (`index.html`, `sw.js`). Plain browser JS with `window.*` globals and no build step. Node scripts in `tools/` (content gate: `node tools/validate-content.js`). No `package.json`, no CI config. An untracked `server/league.sql` (Supabase) backs the weekly translation league only. |
| Teaching order | `data/course.js`: units that own their days (`{lesson}`, `{verbs:[5]}`, `{practice:true}`). It derives `COURSE_DAYS` (flat, 663 days), `COURSE_UNITS` (75, including 12 optional deep units) and `COURSE_BANDS` (A1 0, A2 107, B1 188, B2 353, C1 492). |
| Lesson content | `data/strand-lessons.js` (PCIC strand lessons, 38k lines) plus generated tense lessons from `data/grammar.js` / `data/grammar-docs.js`. `js/lessons.js` assembles `ALL_LESSONS` (674) and `GRAMMAR_LESSONS` (the 573 on the path). There are 101 `status:'reference'` lessons: 67 sit in deep units, and 34 are unplaced. |
| Existing merges | `js/lessons.js` `MERGES` already joins PCIC micro-lessons. The merged lesson keeps the head id and **concatenates** sections with a divider. |
| Readings and exercises | `data/passages.js` (818 passages, each with a precomputed `tenses` array), `data/apply.js` (cloze), `data/writing.js` (constraint-checked tasks). |
| Gating | By **tense only**. `js/session.js` `tenseReached()` checks a passage's or item's tenses against the lessons studied and the current day index. The content gate checks that no teaching section uses a verb form built later in the course. There is no gating on clitics, mood triggers, relatives, commands or vocabulary band. |
| Session | One uniform five-stage daily session: Repasar, Aprender, Comprender, Aplicar, Producir. Every day is shaped like an "Introduce" day. The A1–A2 path walks a day counter; B1 and above take the next unstudied lesson. Profiles (`js/profile.js`: beginner, standard, refresher) set pitch and pace. |
| SRS | `js/srs.js`: Leitner boxes `[0,1,2,4,8,16,32,64,120,180]` days, graduation, leeches, a session cap, and per-aspect ids (`v:<es>:meaning`, `v:<es>:gender`, `vm:`, `vt:`). It has no retention target and is not FSRS or half-life regression. |
| Learner state | **localStorage only, per device.** `fluidez.progress` holds `studied` (a set keyed by lesson id), `beginnerDay`, `courseSig` and `history`. `fluidez.srs` holds the item records. There is no server copy of anyone's progress. |
| Course moves | Already handled in part. When the course fingerprint changes, `session.js:333-375` rebuilds the learner's position **from the studied set**: it walks from day 0 and stops at the first day they have not done. |
| AI / network | None. The writing feedback is a deterministic checker (`js/checker.js` with the engine's morphological index). |
| Audio, images, video | No step depends on any. `js/speak.js` is an **optional** text-to-speech "hear it" control that hides itself when no Spanish voice is installed. The listening game was already retired (`js/games.js:85`). The only images are app icons. |

## 2. The CSV against SEQ and the app

`node tools/reseq/audit-csv.js` reads the CSV, the new-lesson table and the
unit tables directly from SEQ. **Every check passes. There are no count
mismatches.**

| Check | Result |
|---|---|
| Ids | 674, no duplicates |
| Actions | keep 295 · move 146 · merge 96 · split 6 · make optional 125 · cut 6 (all match SEQ) |
| By source | inv2 573 · inv3 67 · inv4 34 (matching the app's 573 path lessons, 67 deep-unit lessons and 34 unplaced reference lessons) |
| CSV ids missing from the app / app ids missing from the CSV | none / none |
| New-lesson ids already taken | none (all 17 are free) |
| `old_day` against today's `data/course.js` | 0 drift across the 573 path lessons |
| Merge targets | All exist; none is itself merged or cut; each merge's `new_day` equals its target's. Two targets are **new** lessons: `gr-tener-que-hay-que-a1` absorbs 2 lessons and `nt-frecuencia-a1` absorbs 1. |
| Splits | All 6 keep their own id and name new parts that are in the new-lesson table. (The prompt's `presente-irregular` is `gr-presente-irregular-a2` in the app.) |
| Non-numeric `new_day` | Every one is a track: B1–B2 vocab track (39), C1 vocabulary and idiom track (73), named deep units (59 kept, 6 re-banded to B2, 9 made optional, 2 merged into deep lessons), cut "—" (6). No optional or cut lesson carries a position. |
| Positions | 382 existing + 17 new = **399** path lessons with **no collisions** |
| Unit tables | All 25 A1–A2 units and 14 B1 units reconcile (range length = lessons + verb days + practice/review/writing days). No verb-day or practice-day slot is taken by a lesson. Every row's `new_unit` matches its range. |
| Path | 399 + 28 verb days + 110 practice/review/writing days = **537**, max position 536 |

### Issues the counts don't show

1. **The B1–B2 notion lessons going optional conflict with an earlier decision.**
   SEQ moves 109 `nt-` lessons to optional vocabulary tracks as "lexis-only".
   Last time notion lessons were shelved as vocabulary, reading them showed
   they teach lexico-grammatical patterns, and all twenty came back to the
   path. A crude scan finds pattern content (contrasts, `ser +`, periphrases)
   in 67 of the 112.
   - **The B2 ones clearly teach patterns.** `nt-cualidad-general-b2` has
     *ser + de* + category. `nt-formas-figuras-b2` has *tener forma de*.
     `nt-peso-b2` has *pesarse*. `nt-orientacion-direccion-b2` has
     *dirigirse a* with two meanings. `nt-distancia-b2` contrasts transitive
     with reflexive.
   - **Two specific losses.** `nt-textura-consistencia-b1` is the *húmedo*
     vs *mojado* lesson. `fn-recordar-olvidar-c1` is the remembering lesson
     that five functions were deliberately merged into.
   - **The C1 ones** (textures, sound verbs, finishes) look much more like
     word lists, so SEQ's call there is easier to defend.
2. **Seven B1 verb days have no position.** SEQ gives B1 7 verb days but does
   not say which set goes where. The sets are mejorar, imaginar, formar,
   ocupar, participar, adelantar and aprobar. Proposed placements:
   aprobar…preocuparse → b1-n31 Feelings; imaginar/dudar → b1-n26 What I think.
3. **The current merge mechanism does the wrong thing for hubs.** `MERGES`
   concatenates lessons, which is exactly what SEQ says not to do for the
   B1/B2/C1 emotion hubs. CSV merges need a different mechanism: an id alias
   (redirect, carrying progress and SRS records) plus a `needsRewrite` flag on
   the hub. They must not go through `applyMerges`.
4. **Two path lessons leave the path by merging into deep-unit lessons.**
   `dc-valores-ilocutivos-b1` goes into `dc-valores-ilocutivos-b2`, and
   `gr-imperativo-valores-b2` goes into `gr-imperativo-valores-b1`, which is
   itself made optional. This is fine, but anyone who has studied them will
   get the deep lesson marked done through the alias.

## 3. How the two documents' pacing fits together

SEQ's grammar points fit BLUEPRINT's budget almost exactly. The stretch comes
from somewhere else.

| Band | SEQ positions | Grammar points | Other lessons (fn/nt/gn/dc, tasks, chunks) | Grammar at BLUEPRINT's budget |
|---|---|---|---|---|
| A1 | 107 | 32 | 49 | 16 wk ≈ 112 days |
| A2 | 88 | 28 | 40 | 14 wk ≈ 98 days |
| B1 | 134 | 14 | 85 | ≈ 49 days |
| B2 | 112 | 9 | 70 | ≈ 42 days |
| C1 | 96 | 4 | 68 | ≈ 37 days |

BLUEPRINT's week has no slot for a function, notion or genre lesson. Its week
is Introduce, Drill, Input, Output and Review, and it assumes the can-do rides
along with the grammar.

- **Model A: strict BLUEPRINT week.** Each SEQ lesson takes an
  Introduce, Vocab/Input or Output slot. A1 grows to roughly **224 days**
  and the whole course to roughly **1,000 days**. That roughly doubles SEQ.
- **Model B: hybrid (recommended).** Each SEQ position stays one day, and
  its lesson type follows its content: grammar → Introduce; fn/nt/gn/dc →
  Vocab/Input; task → Output; practice → Mixed review; review/writing →
  Mixed review or Output. The scheduler enforces BLUEPRINT's grammar rules
  on top. Each Introduce gets a Drill within 1–3 days, which reuses an SEQ
  practice day where one falls within 2 days and is inserted otherwise, so
  no two Introduce days are ever adjacent. First-pass simulation: **+50
  days, 537 → 587** (A1 126, A2 103, B1 144, B2 114, C1 100).

These are estimates made from id prefixes. The milestone 3 simulation will
replace them, including the effect of the tiers (minimum-lesson days don't
advance the path).

## 4. The SEQ order against BLUEPRINT's PCIC table

These items get `placement: teaching_choice` with a note, and are never shown
as official PCIC levels:

- perfecto at 33 (A1)
- affirmative imperative at 91 (A1)
- future at 175 (A2)
- present subjunctive at 181, with formulas at 165 (A2; BLUEPRINT confirms "no subjunctive at A1–A2")
- *se lo* at 142 (level unverified)
- imperfect subjunctive, conditional perfect and perfect subjunctive at 238–240 (B1; B2 in BLUEPRINT)

## 5. Open decisions, with recommendations

1. **The calendar stretch.** I recommend **Model B** (≈ +50 days to ≈ 587),
   accepting the longer calendar rather than putting grammar inside Drill or
   Input days. Model A doubles the course for little gain. Under the hybrid,
   SEQ's function lessons already act as the "Input" and "Output" days.
2. **Default tier and minutes.** BLUEPRINT's 20-minute standard as the
   default. Make minutes-per-band a config value defaulting to SEQ's "longer
   sessions" row: 20/25/30/40/45. That row matches BLUEPRINT at A1 and
   follows SEQ's advice to raise minutes. Tiers (minimum, standard,
   extension) should be separate from the existing profiles (beginner,
   standard, refresher), which set pitch rather than time.
3. **The extensive-input and listening track.** Optional, tracked and
   credited to the streak, but **not gating**. UI and marketing then say
   "zero to the C1 syllabus" everywhere.
4. **AI for typed role-play and writing feedback.** This is the biggest
   departure: the app is fully offline and AI-free today. I recommend
   keeping the deterministic checker as the offline fallback and as the
   source of the single feedback point. Add AI role-play as an online-only
   Output-day block, called through a server function (the Supabase project
   already exists) so that no key ships in the client, with a per-learner
   daily cap. I'd choose the provider and model after a small cost test. What
   do you want to spend per active learner per month?
5. **Optional tracks feeding the SRS.** The C1 idiom track feeds the queue,
   since SEQ calls it SRS-fed. The B1–B2 vocabulary track feeds items only
   from lessons the learner opens, so new items stay within the weekly
   budget.
6. **The notion triage.** Accept SEQ's C1 track as written. Before applying
   the B1–B2 rows, triage the 39 lessons **one by one** ("does it teach a
   pattern or list words?"). Keep `nt-textura-consistencia-b1` and
   `fn-recordar-olvidar-c1` on the path. I can draft the per-lesson verdicts
   for you to approve.
7. **The optional text-to-speech button.** Keep it. No step depends on it,
   and BLUEPRINT's hard rule is about dependence. Removing it costs
   learners something and gains nothing.
8. **Learner migration dry-run.** There is no server copy of learner progress,
   so a dry run against "real learners" needs exported
   `fluidez.progress`/`fluidez.srs` blobs. Can you export them from your own
   devices and any testers? The migration itself will run client-side on
   load, built on the existing `courseSig` rebuild plus an id-alias table.
   One wrinkle: today's rebuild sends a learner back to the **first** gap,
   so someone at old day 120 would land on new day 17. SEQ asks for catch-up
   lessons instead: keep their place and queue the gaps alongside. I
   recommend the catch-up queue.

## Reproduce

```
node tools/reseq/audit-csv.js
```
