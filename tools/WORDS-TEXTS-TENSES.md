# Words, Texts, Tenses — implementation brief

**Work on `main`.** Read `tools/GENERATION_BRIEF.md` for the content-authoring
conventions; this brief governs *what* to write and in *what order*, and
overrides it where the two disagree.

Step 1 is shipped (`4063c1e`). Steps 2 and 3 are open and **must be done in
this order** — step 3's content is written against the gate step 2 moves.

---

## 0. Baseline — do this first

```
git checkout main
node tools/validate-content.js && node tools/test-checker.js \
  && node tools/lint-spanish.js && node tools/audit-verbs.js
```

All four must print ✅. They do as of `4063c1e`; if they do not, stop and
report rather than working around it. Check exit codes directly — piping to
`tail` reports `tail`'s status and has hidden a real failure before.

`node tools/bump-cache.js` in any commit that changes a precached file, or
installed copies keep serving the old app.

**Do not run `node tools/worklist.js --force`.** It rewrites `WORKLIST.md` and
loses every tick.

---

## 1. Why this project exists (context — already measured, do not re-derive)

The daily session has five stages. The grammar lesson is a fixed sequence; the
new words, the passage and the writing were all chosen independently of each
other.

| measurement | value |
|---|---|
| New words appearing in the same day's reading, before step 1 | **2%** (7 of 336) |
| Taught-corpus words the average passage already contains | **27.6** (37 at B2, 42 at C1) |
| …of those, sharing the passage's own theme | **3.6** |
| First day the preterite is taught | **day 112 of 738** (imperfect 118, perfect 130) |
| A1 passages containing any past tense | **0 of 90** |

CEFR does not specify tenses — it describes what a learner can do. The
111-day wait is this course's own choice, recorded in `SEED` in
`js/lessons.js`. There is no external standard to argue with.

---

## 2. STEP 1 — shipped, for reference only

Commit `4063c1e`. The new-word drip now prefers words appearing in the passage
the same session shows two stages later, and the passage is chosen — among
those already right on grammar and theme — for how many **unmet** words it
carries.

| vocabulary already known | empty | 50% | 80% | 95% | 99% |
|---|---|---|---|---|---|
| drip preference only | 100% | 72% | 17% | 0% | 0% |
| + passage chosen for unmet words | 100% | 94% | 78% | 22% | 0% |

**You need two facts from this:**

- **`js/lexmatch.js` exists. Use it; do not write a second matcher.**
  `LexMatch.index(text).has(es)` and `LexMatch.countIn(text, words)`. It strips
  the article, deaccents, keeps ñ, and checks a word boundary allowing only a
  plural `-s`/`-es`, so `mar` is not found inside `marzo`. It loads in node the
  way the other browser modules do in `tools/validate-content.js` — `eval` the
  file against a `global.window` stub.
- **The 95%-known figure of 22% is a content shortage, not a bug.** Too few
  passages carrying too few unmet words between them. That is now the primary
  justification for step 3, ahead of the Focus feature it was originally for.
  The 99% figure cannot be fixed by anything: if a learner knows everything,
  there is nothing left to align.

---

## 3. DECIDE THIS BEFORE WRITING ANY CODE OR CONTENT

Flipping `preterito` to level 1 makes it legal in **every** level-1 passage,
including all 90 that exist and whatever is shown on day 3. **A1 is a single
level** — `LEVELS` gives it `levels:[1]`, so `maxGate` is 1 and level-2 lessons
are filtered out of an A1 learner's pool entirely. That is why moving the
course units alone does nothing and the `SEED` change is genuinely required,
and it is also why there is no "late A1" to put the past tense into.

| option | cost | verdict |
|---|---|---|
| **A.** Accept it; rely on the 90 present-only passages dominating early rotation | none | no guarantee — a day-3 learner can still be handed a preterite |
| **B.** Split A1 into two levels | renumbers every band; touches `level` on 393 passages, 674 apply items, 485 writing tasks | invasive and risky for the benefit |
| **C.** Gate passages by **taught tense** rather than by level | a precomputed `tenses` array per passage + a filter against `progress.studied` | **recommended** |

Option C replaces a proxy with the thing itself — the level integer has always
stood for "which tenses may appear" — and removes a latent version of the same
bug at every band. Compute the field with the logic `validate-content.js`
already uses (the **minimum** level across a token's possible analyses, so
ambiguous forms read generously: `habla` is present *or* imperative, and the
generous reading is the correct one). Generate it with a tool, never by hand.
Fall back to the unfiltered pool rather than empty a stage, exactly as
`safeVerbs` and `Focus.narrow` already do.

**This choice determines whether the 227 new passages need a tense field, so it
cannot be deferred.** If you disagree with C, say so and why before starting.

---

## 4. STEP 2 — move the past tense into A1

Not "more tenses earlier": bringing the future, conditional or subjunctive
forward would load a beginner with five tenses and teach none of them. The gap
is specifically the past — the two tenses that unlock narrative and answering
"what did you do at the weekend".

### Work on a branch, and do not merge it alone

Released by itself this teaches a learner the preterite and hands them zero
texts containing one. **Step 2 and step 3's A1/A2 passages merge as one.**

### Edits

| file | change |
|---|---|
| `js/lessons.js` · `SEED` | `{ id: 'preterito', level: 2 }` → `level: 1`; `perfecto` 3 → 1. **Leave `imperfecto` at 2 and `preterite-imperfect` at 2** — the contrast is the subtle part and stays. |
| `data/course.js` | Move `a2-u14` "Tell me what happened" (days 112–117) and `a2-u17` "Have you ever…?" (days 130–135) to after `a1-u09` "Your day" (days 80–86), targeting ~day 60. Units own their ordered days; place them by hand. |
| `data/passages.js` | If option C: add `tenses` to all 393, tool-generated. |
| `js/profile.js` | `verbOkAt` / `safeVerbs` withhold stem-changing verbs from A1 because PCIC introduces them at A2. The preterite brings its own irregulars — `fui`, `hizo`, `tuvo`, `estuvo`. Decide deliberately whether A1 may now produce them, and write the reasoning into the comment already there. |

`TENSE_LEVEL` in the validator derives from `SEED`, so the static level gate
follows with no edit.

### Risk: day indices shift

Moving a unit changes the day index of every unit after it. Lesson progress is
keyed by lesson id in `progress.studied`, so nobody loses their place — but
`progress.beginnerDay` is a plain counter used by the paced A1 path and will
point at a different lesson afterwards. Decide before editing: migrate it by
mapping the learner's last studied lesson to its new index, or accept the shift
and say so in the commit. **Do not discover this after shipping.**

### Acceptance

- Re-run the first-taught-tense audit; report the new day numbers.
- Four gates green.
- A level-1 passage containing `fui` validates; one containing `habría hablado`
  still does not.
- If option C: an A1 learner who has not reached the unit is never shown a
  past-tense passage, and no stage is ever empty as a result.
- Walk one A1 session in a browser.

---

## 5. STEP 3 — 227 passages, written to their theme's words

Target: every theme holds at least **six passages in its own band**.

| band | themes short | needed | worst (current count) |
|---|---|---|---|
| A1 | 15/20 | **49** | religión 0 · cuerpo 1 · carácter 1 · medios 1 · política 1 |
| A2 | 17/20 | **58** | cuerpo 2 · carácter 2 · alimentación 2 · ocio 2 · servicios 2 |
| B1 | 14/20 | **40** | cuerpo 1 · religión 1 · carácter 2 · identidad 2 |
| B2 | 19/20 | **40** | ocio 3 · vivienda 3 · compras 3 · viajes 3 |
| C1 | 20/20 | **40** | cuerpo 4 · carácter 4 · identidad 4 · relaciones 4 |
| | | **227** | |

Full A1 per-theme deficit: religión +6, cuerpo +5, carácter +5, medios +5,
política +5, servicios +4, identidad +3, viajes +3, economía +3,
alimentación +2, ciencia +2, arte +2, naturaleza +2, compras +1, salud +1.
(educación, ocio, vivienda, relaciones, trabajo already have 6 or more.)

### How many carry the past tense

| band | new | past tense? | why |
|---|---|---|---|
| A1 | 49 | **all of them** | the 90 existing A1 passages are *all* present-only — an ample reserve for the ~60 reading days before the past is taught. Present-only is over-supplied; past-containing is the entire gap. |
| A2 | 58 | no reservation | after step 2 every A2 learner has met the past; 79% of the existing 62 already carry a preterite |
| B1–C1 | 120 | unaffected | already legal at these levels — **independent of step 2, can be written first** |

There is no held-back batch. Write A1 against the flipped gate on step 2's
branch and merge the two together.

One soft spot: the 90 present-only A1 passages are unevenly themed (religión 0,
cuerpo 1, carácter 1), and a theme focus narrows the pool to one theme, so an
A1 focus in the first 60 days on a thin theme has very little present-only
material. Only two themes sustain an A1 focus today, so this is small — and
under option C it disappears, because the filter falls through to the wider
pool.

### The new authoring rule

Everything in `tools/GENERATION_BRIEF.md` applies — length bands, glossary
language per band (English to B1, **Spanish definition** at B2, **none** at
C1), 3–5 questions mixing `mcq`/`short` with exactly one `translate` whose line
appears verbatim, and the variety rules that exist because the B1 batch came
back as the same passage 81 times. Read `spec/genre-samples.json` before
writing. Run `node tools/variety.js <BAND>` before calling a batch done.

**One rule is new, and it is what makes steps 1 and 3 pay off:**

> Every new passage must contain at least **10 words from its own theme's
> vocabulary** in `data/vocab.js`. The current average is 3.6.

Write the passage *from* a shortlist of its theme's words rather than writing
it and hoping: pull the theme's unmet vocabulary at that band, pick twelve that
belong in one scene, and build the text around them.

**Enforce it.** Add the check to `tools/variety.js` using `LexMatch.countIn` —
report the count per passage and fail the batch on anything below 10. Do not
write a second matcher; the app and the checker disagreeing is the exact
failure `js/lexmatch.js` exists to prevent.

### Ordering

1. **B1–C1 (120) can start immediately** — no dependency on step 2.
2. **A1 and A2 (107) after the gate flips**, on the same branch, merged with it.
3. Within each band, thinnest themes first.

### Check the raw material before planning A1

17 of 20 themes report under 25 A1-banded words, which would make six A1
passages about `religión` very hard. **That count is distorted**: the 283 seed
vocabulary rows given a `theme` in `cf25464` still carry no `cefr`, so they are
invisible to any per-band count. Backfill `cefr` on those rows first, or the
A1 and A2 deficit figures are wrong in an unknown direction.

### Acceptance

- Four gates green; `variety.js` clean for every band touched, including the
  new density check.
- Report new per-theme, per-band passage counts as a table.
- **Three sample passages per band, for review, before the batch is done.**
- Re-run the step 1 overlap measurement and report how the 95%-known figure
  has moved from 22%.

---

## 6. Out of scope

- **Do not theme the Aplicar stage.** Its 674 cloze items carry
  `{type, level, text, inf, tense, person}` — they are conjugation drills, and
  theming them means authoring 674 new sentences. The grammar spine should be
  visible somewhere in the session; Aplicar is the honest place for it.
- **Do not move any tense other than `preterito` and `perfecto`.**
- **Do not widen the Focus feature** (`js/focus.js`) while these land. The
  offer-at-unit-boundary work is parked deliberately.
- **Do not regenerate `WORKLIST.md`.**

---

*Measurements against `main` at `4063c1e`, 18 September 2026. The 2%, 27.6 and
decay figures are reproducible from `data/passages.js` and `data/vocab.js` and
should be re-derived after step 3 rather than trusted.*
