# Full per-lesson content plan for Fluidez

Goal: **every lesson in the app** — not just the 17 grammar lessons — gets its
own original story and its own tasks, so the first time you take *any* lesson
(grammar, vocab, or verb-group) it's bespoke, not pooled/inferred content that
happens to match.

## Why this is bigger than it sounds

The app has three kinds of lesson, and today they are NOT on equal footing:

| Lesson type | Count | Source | Today's on-demand experience |
|---|---|---|---|
| Grammar | 17 | `window.GRAMMAR_LESSONS` (`js/lessons.js`, syllabus in same file) | Learn → Comprehend → Apply → Produce, content picked from the shared pools by tense/concept match |
| Verb groups | 37 | `js/progress.js` `verbLessons()` — chunks `data/verbs.js`'s ~181 infinitives into groups of 5 | **Learn only.** No story, no cloze, no writing — `js/lessonrun.js` only pushes `StageComprehend`/`StageApply`/`StageProduce` when `lesson` (a grammar lesson) is non-null |
| Vocab categories | 45 | `js/progress.js` `vocabLessons()` — chunks `data/vocab.js` by `cat`, 12 words/chunk | **Learn only.** Same gap. |

Run `node -e "..."` (see chat history) to reproduce these counts — they shift
slightly whenever `data/verbs.js`/`data/vocab.js` grow, so **recompute them
first** in the actual generation session rather than trusting the numbers
above verbatim.

**99 lessons today** (17 + 37 + 45). Verb/vocab lesson counts grow as those
data files grow, so this plan is written to be re-run, not a one-shot.

## Phase 0 — code prerequisite (do this FIRST, before any content)

Vocab and verb-group lessons need a Comprehend/Apply/Produce arc wired up in
`js/lessonrun.js`, mirroring the grammar-lesson arc and reusing the
concept-matching pattern already established in `js/engine.js` (`E.CONCEPTS`)
and `js/session.js` (`passageUsesFocus`/`clozeMatchesFocus`/`writeMatchesFocus`
for `focus.type === 'vocab' | 'verbs'`).

1. **Extract shared focus-matching helpers** so `session.js` (daily, pool-based)
   and `lessonrun.js` (on-demand, now per-lesson) can't drift apart the way
   they already had for grammar concepts. Candidate home: `js/engine.js`
   alongside `CONCEPTS`, e.g. `E.matchesVocabWords(text, words)` and
   `E.matchesVerbGroup(analysis, infs)`.
2. **Verb-group lessons** (`focus = { type: 'verbs', verbs: [...5 infinitives] }`):
   - Comprehend: a passage whose analyzed verbs include ≥2 of the group's
     infinitives (any tense, gated to a sensible level — verb-group lessons
     don't have a natural "level," so default to L1–L2 phrasing unless the
     verbs are inherently irregular/advanced).
   - Apply: cloze items whose `inf` is in the group (mechanic already exists,
     just needs wiring — same as `clozeMatchesFocus`'s `focus.type==='verbs'`
     branch already does for the daily session).
   - Produce: writing tasks with `verbFormAny`/`infinitiveUsed` referencing one
     of the group's verbs.
3. **Vocab-category lessons** (`focus = { type: 'vocab', cat, words }`):
   - Comprehend: a passage containing ≥6 of the category's words (reuse the
     noun/article-stripping match already in `passageUsesFocus`'s vocab
     branch).
   - Apply: **skip** — the cloze mechanic is verb-conjugation only; forcing
     vocab into it would mean inventing a new apply-item type, which breaks
     the "no new types" rule. Vocab lessons get Learn → Comprehend → Produce.
   - Produce: writing tasks with `containsWord`/`containsAny` referencing
     several of the category's words.
4. Update `js/lessonrun.js`'s `run()` to push these stages when `focus.type`
   is `'vocab'` or `'verbs'`, not just when `lesson` (grammar) is set.
5. Sanity-test the same way the grammar-concept fix was verified: a Node
   harness that stubs `window`/`localStorage`/`document`, loads all data +
   `js/engine.js`/`js/lessons.js`/`js/session.js`/`js/lessonrun.js`, and for
   **every** vocab/verb-group focus confirms a passage resolves, the produce
   tasks self-check (`Checker.checkWriting`), and first-time selection is
   reproducible via `UI.seededRandom`.

This phase is pure code — no data files touched — so run
`node tools/validate-content.js && node tools/test-checker.js` after it purely
as a regression check (should be unaffected).

## Phase 1 — content authoring, in priority order

For **each** lesson below, "own story" means: written specifically to showcase
that lesson's material, not merely found to satisfy a filter. Keep authoring
in the same style/quality bar as the existing `SONNET_EXPAND_PROMPT.md` batch:
natural contemporary Spanish, concrete situated scenes, correct accents,
dataset-only verbs, all schemas matched exactly, gates green after every batch.

### 1. Grammar lessons (17) — smallest batch, do first
Most already have decent pool matches from prior work. For each of the 17,
add **one dedicated "anchor" passage** (60–120 words, unambiguous — audit for
homograph false-positives like the `viaje`/`viaje` one already fixed) +
2–3 dedicated cloze items + 1–2 dedicated writing tasks, tagged so they will
reliably surface for that lesson specifically. This closes the gap between
"the pool happens to have something" and "this lesson has its own thing."

### 2. Verb-group lessons (37 groups × 5 verbs each)
For each group: **one original passage** (~60–90 words) naturally using
several of the group's 5 verbs across natural tenses (don't force all 5 —
3–4 used well beats 5 shoehorned in) + **4–6 cloze items** using those exact
verbs (varied tense/person, forced by context — same discipline as the main
brief) + **1–2 writing tasks** requiring one of the group's verbs
(`verbFormAny`/`infinitiveUsed`).

Recompute the actual 37 groups from `verbLessons()` at generation time (order
is: `hablar, trabajar, estudiar, comer, beber, vivir, aprender, escribir`
first, then every other verb in `data/verbs.js`'s array order, chunked by 5)
— don't hand-guess the groupings, they shift whenever verbs.js grows.

### 3. Vocab-category lessons (45 chunks across 31 categories)
For each chunk: **one original passage** (~60–90 words) using at least 6–8 of
the chunk's 12 words naturally (not a word-search puzzle — a real scene) +
**2 writing tasks** (`containsWord`/`containsAny`) requiring several of the
chunk's words. No cloze (see Phase 0 reasoning).

Recompute the actual 45 chunks from `vocabLessons()`'s category order at
generation time (same reason as above — `data/vocab.js` has grown twice
already this project).

## Volume estimate (recompute exactly before starting)

At today's counts: ~99 new passages (roughly 3× the current 34), ~37×5≈185 new
cloze items (verb-group lessons only), ~(17×1.5 + 37×1.5 + 45×2) ≈ 200 new
writing tasks. This is **much** larger than the last batch and should be
worked in small chunks (8–10 lessons per session), running
`node tools/validate-content.js && node tools/test-checker.js` after every
chunk, exactly like the last pass.

## Open design question worth a quick check-in before Phase 0

Content matching today is entirely **inferential** (does this passage's text
happen to use these verbs/words/tense?). An alternative is to add an explicit
optional tag (e.g. `verbGroup: 'hablar,trabajar,estudiar,comer,beber'` or
`vocabCat: 'food:2'`) to newly-authored items, making the lesson→content link
exact instead of inferred. That's a schema addition (against the "no new
fields" rule from the bulk-content brief, but that rule was written for a
narrower job) — worth 30 seconds of Matt's input before Phase 0 starts,
since it changes how much code work Phase 0 actually is. Recommendation:
**stay inferential** (no schema change) — it's already proven reliable in
testing, and it keeps every data file droppable into the existing validator
gates unchanged.
