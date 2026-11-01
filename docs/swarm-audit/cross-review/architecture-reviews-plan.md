# Cross-review: the architect costs every proposal and fixes the build order

Role: Software Architecture Specialist, reviewing `reports/07-architecture.md` (my own) and the recommendations of every other report. Reviewed 1 November 2026 at `5f916ec` on `rebuild`. Everything labelled "measured" was run for this review. Nothing under `app/` was changed. Throwaway scripts and raw output are in `/private/tmp/claude-501/-Users-Matthew-Fluidez/40ef6734-a9c2-4284-b528-c9cc038164e6/scratchpad/archx/`.

**Verdict.** Most of the proposals are right and most of the costings are wrong, in both directions. The largest burn in the audit (`focus` on about 20,000 rows) mostly does not need to exist, because the tagger already locates the target on 95.4% of grammar rows. The smallest-sounding fix (run the contrast scripts, "a matter of days", "no new content") puts every contrast day over its session budget, by 3.4 to 6.6 minutes, and someone has to decide what gives. The reports offer five different designs for the same contrast data, and two of them designed the same error detector under two names. My own report is wrong in nine places, listed in section 4. The biggest finding is not in any report: **none of waves 1 to 3 is live**, the live site is six commits behind, and the workflow that publishes it runs no tests and no gate. Trunk has to move off the deploy branch before anything else, and that turns out to be cheap.

---

## 0. New measurements

| # | What | Result |
|---:|---|---|
| M1 | What is live | `git ls-remote` and the live `BUILD_SHA` both say `ee6aaec`. Local `rebuild` is 6 commits ahead, 0 behind. **Waves 1, 2 and 3, the thin-node gate and the conjecture tagger change have never been deployed** |
| M2 | Is the first push safe? | Yes. Live content against HEAD: 71,390 to 72,693 rows, **0 ids gone, 1 row whose Spanish changed**, 189 rows with changed `requires`, 0 graph nodes vanished, **0 of 3,848 listed nodes moved**, 593 days both sides. The only persisted change is `ui` v2 to v3, an existing migration |
| M3 | What guards the live site | `publish.yml` in `fluidez-next`: every 20 minutes, `npm ci`, `npm run build`, deploy. **No tests. No gate.** A commit that typechecks ships |
| M4 | Can `focus` be computed? | Tagger run over all target rows. A feature with `node === target` exists on **25,924 of 27,167 grammar rows (95.4%)**, 25,693 of 25,790 pattern rows (99.6%), 5,572 of 5,572 chunk rows. By band for grammar: A1 99.7%, A2 96.3%, B1 95.0%, B2 84.7%, C1 90.5%. **37 grammar nodes are blind, 1,243 rows**, and they include `g:ser-estar-adjectives`, `g:por-para-2`, `g:cuando-indicative`, `g:se-meaning-change` |
| M5 | Cost of a full tag | 56,479 sentences in 40 s, 0.71 ms each. Re-tagging is cheap in CPU. Its real cost is holding every bank file |
| M6 | Contrast teach on real plans | One simulated year, `average`, real corpus: 38 plans introduce a contrast. Today they estimate 21.2 min against a 21.4 budget, 0% over. **With the full script: 28.0 min, 100% over, by 6.6 min on average. With a short form (rule, examples, 4 picks, 3 typed, 4.55 min): 24.8 min, still 100% over** |
| M7 | Honest pace | Same run, `secs` 10 to 17 (the speed Report 05 Lower settled on in its headless walks). New items 1,389 to **1,128 (-19%)**. Owed at end 467 to **623 (+33%)**. Throttled 23.7% to **49.7%**. Converted 7.0% to **16.5%**. Final unit 28 to 26 |
| M8 | "Few and long" | Placed at u45, honest pace, 120 days. Today's minutes (28/30): 285 new items, 117 owed. B2 45, C1 52: **389 new, 0 owed**. Plus warm-up 14: **476 new, 1 owed, 75 sessions advanced against 62**. Longer sessions clear the queue. Only a bigger warm-up budget moves the throttle (74% to 54%) |
| M9 | Tagger as a chunk | esbuild, minified: **536 KB raw, 146 KB gzip**. Report 06 quotes 82 KB, which counted only data files |
| M10 | Contrast pools without a burn | Rows containing the thinner side of each contrast: minimum 21, median 153, 80 of 94 have at least 80. `x:por-para`, the flagship, has **one side** in `contrasts`: a data bug |
| M11 | Can a burn job edit the bank? | Median unit bank file 0.64 MB, largest 1.29 MB (`u57`, 1,913 rows, 676 bytes a row). The job contract is "Rewrite each output in full". **No agent can rewrite that file** |
| M12 | Room for consolidation weeks | `Unit.days` is `.max(10)`. 53 of 60 units are at 10, 7 at 9. u27, u41, u51 and u60 are full. Unit ids are `^u\d{2}$` |
| M13 | Verified content fixes | 599 verdicts: 268 confirmed, 200 amended, 56 rewrite-needed, 65 refuted, 10 native-check. **524 actionable**, in 221 files: scripts 343, bank 91, graph 68, story 14, code 8. 28 are in contrast scripts. 102 claims have no verdict |
| M14 | `given` on events | Bank rows average 8.8 `requires`, and `expose` writes one event per introduced node. Text stored on `ReviewEvent` would repeat up to about 9 times per answer |

M1 corrects something every report assumed, and something I wrote: that behaviour seen on the dev server is what learners get. M2 removes a worry: the first push is not the first re-sequencing. The first curriculum move will be.

---

## 1. Rulings at a glance

"Bottleneck" names which of `compile.ts`, `cards.ts`, `runner.ts` it touches. "Risk" is risk to saved learners.

| Proposal | Ruling | Bottleneck | Schema | Burn | Risk |
|---|---|---|---|---|---|
| Contrast scripts as teach blocks | **Change:** full script, but two blocks must move | compile | none | none, 94 scripts reviewed | none |
| Contrast cards and rows | **Change:** one new content type, no new `Card` member | compile, cards | new `ContrastItem` | 94 jobs | none |
| Contrast-aware gaps | **Change:** derive, do not burn | cards | computed `focus` | 37 nodes only | none |
| Acceptance in canon and variants | **Change:** most of it belongs in `variants`, not `canon` | cards, lightly | none | sidecar, later | none |
| Third verdict | **Split:** self-claim now, target scoring later | runner | none | none | low |
| Given answer and error kind | **Change:** a separate bounded log, not event fields | runner, after the seam | additive | none | low |
| Interference layer | **Keep, merge with F2** into one module | cards, lightly | none | none | none |
| Honest time costs | **Keep, tune late**, one exception | compile | additive | none | medium |
| Placement rebuild | **Keep, in three steps** | compile, lightly | new item file | small | medium |
| Welcome-back | **Change:** drop the soft reset | compile | none | none | none |
| Can-do evidence | **Keep, in two steps** | none | none | none | none |
| Library metadata | **Keep, merge with P5 and P7** | compile, lightly | derived file | none | low |
| Tap-gloss | **Keep, split:** R1 now, R8 after re-tag | none | additive | none | none |
| Backup and restore | **Keep, first** | none | none | none | it reduces risk |
| Saved writing | **Keep, now** | none | own key | none | none |
| Games layer | **Keep, free-running.** Does not need the store split | none | own key, own doc | one tool, then top-ups | low |
| Rayos X at runtime | **Keep. Report 06 beats my report** | none | none | none | none |
| Reading track | **Keep, library first** | later, small | new `ReadingPiece` | largest | none |
| Benchmark | **Keep, last** | none | new item file | small | none |

---

## 2. What each one really takes

### 2.1 Contrast scripts as teach blocks

**Today.** All 94 contrasts are listed only on drill days (93 listings) and review days (75). On a drill day, `takeNew` at `compile.ts:1016` puts the contrast in the learn pool, last in the day. `reviewDay` never reads `day.focus`, so all 75 review-day returns are inert. That is the true state of the "rotation in the data".

**Takes.** `compile.ts`: split contrast items out of `takeNew`'s result in `drill()`, call `teach(x, 'full')`, and make `reviewDay` run a deliberate return for a listed known contrast, the way `scriptFallback` already does. `compiler/types.ts`: one value on `TeachBlock.reason`. `session/labels.ts`: one heading. `Teach` needs nothing, because `run.present` and `learningStep` work for any node. Ledgering works through the existing `teach` case in `servedRefs`.

**Against Curriculum and Acquisition.** "A matter of days" holds for the code. "Needs no new content" and "the script needs no new content" do not hold, for two reasons.

1. **Time.** M6. `fitToBudget` only trims the learn pool, so a teach block does not make the plan run long. It silently eats that day's new words, as many as the pool holds, up to about seven, worsening V1. Past that the session simply runs long. The honest options are to shorten the lesson or to move something. My ruling: keep the full script, and on a contrast-teach day move `communicative` (4 × 45 s = 3 min) and the freer `writing` (at least 3 min) off the day. That returns at least 6 of the 6.6 minutes, which should land near budget. Verify it in the simulator. The owner can overrule this: the "light" depth is not an alternative as it stands, because `parts` for `light` has no rule, which is the whole point of the lesson.
2. **Nobody has ever seen these scripts.** They have never been played. The linguist found `x:subj-present-past` states the reverse of the truth, and 28 verified fixes sit in contrast scripts. **The script rewrites must ship in the same release as the teach block**, never after it.

**Tests.** A property: a new contrast yields a teach block and the plan stays within budget. A real-content test on u07 d1. A simulator metric for contrasts taught against contrasts listed.

**Saved learners.** No state change. Learners already past a contrast meet it on a review-day return. Detect "already taught" from the `sc:x:…:rp:0` ledger key, which means my P6 shrink must keep `sc:` keys (section 4).

### 2.2 Contrast cards and bank rows

Five designs are on the table:

| Report | Design |
|---|---|
| 03 | Bank rows plus `forcedChoice` |
| 06 Innovation F3 | Bank rows with `targets: [x:]`, "no code change beyond the gate rule" |
| 02 | Tag existing rows by contrast |
| 06 Games | `content/games/contrast/*.json` |
| 05 Upper | Derive the pool from member nodes |

**F3's "no code change" is false.** `practiceCard` calls `chooseItem(s, { seed, taught })`, which gaps whichever verb it finds. Nothing tells it what the contrast is, so a perfect bank row would still produce an off-target card. Rotation is also missing: `pickContrast` returns the first match in graph order.

**Report 02's tagging would damage supply.** `buildContentIndex` makes `requires = targets ∪ requires` (`content.ts:161`), and `unmetRequires` blocks on anything unknown. Writing `x:` into `targets` or `requires` on existing rows makes them **inadmissible until that contrast is introduced**. Those rows are today's ordinary supply.

**Ruling: one content type, one file per contrast, used by everyone.**

```ts
export const ContrastItem = z.object({
  id: z.string(), node: NodeId, side: NodeId, use: z.string().optional(), // use = sub-rule, for diagnosis
  rung: z.number().int().min(0).max(2),                                   // 0 meaning cue, 1 gap with English, 2 gap alone
  en: z.string(), es: z.string(),                                         // the exact pair, gap filled in
  gap: z.tuple([z.number().int(), z.number().int()]),                     // char offsets into es
  options: z.array(z.string()).min(2), answer: z.number().int(), why: z.string(),
  requires: z.array(NodeId).default([]),                                  // computed, as for bank rows
});
```

Files are `content/contrasts/x_<id>.json`. Reasons for not using the bank:

- A review at u40 of a contrast taught at u07 needs its rows now, and bank rows load by unit window (P7). Per-node files load by node.
- Games, placement and benchmarks need these with no compiler.
- One job writes one file, so nothing collides.

**No new `Card` member.** `McqCard` is a forced choice and `TypeCard` is a typed gap. A new `op: 'contrast'` item is enough, with its builder in its own file. Report 07's table implied more than this.

**Before the burn, for free (Stage 2).** A due contrast today falls through `planReviews` to a bare card, and a node with no segments (`x:saber-poder` is one) gets a read card that grades Good with no retrieval. Rotate that node's own read-and-pick and your-turn items, 1,471 in all. This needs a session number passed to `reviewCard`, and contrast scripts must be loadable outside the window. Treat `x_*` scripts as core content.

**Takes.** `schema.ts`, `loader.ts`, the gate's `load` and `extract` and `checks`, `tools/sim/load.ts`, `vite.config.ts`, `compile.ts` (`planReviews`, `drill`, `remix`, `reviewItem`, `servedRefs`), a new card builder, and registry entries. Tests: gate fixture, a gating property, and the Games "Guess Test" as a real CI test. Burn: a deterministic `tools/contrast/derive.ts` first (the Games report counts 255 twin sets, 82 in contrast scripts), then top-ups.

**Volume.** Reports say 40 to 80, 40 to 60, and 30 or 150. No evidence separates them. Start at 40 per contrast and 150 for the five big ones, about 4,200 items. Measure before writing more.

Fix `x:por-para`'s `contrasts` field first (M10).

### 2.3 Contrast-aware gaps (`focus`)

**This is the audit's biggest cost error.** Report 03 proposes a burn over about 20,000 target rows. M4 says the tagger already holds a span for 57,189 of 58,529 row targets. Only the 37 blind nodes need authoring, 1,243 rows.

**Ruling.** Treat `focus` exactly like `requires`: a computed field written by `gate --fix`, and an error if it differs from the tagger. Character offsets into `es`, so dialogue rows survive. Distractors come from the engine for verbs and from a small table per feature family for everything else (por/para, articles, clitics, relatives). Report 03 is right that blind nodes want authored spans, and those are the hardest nodes, so give them to Opus-reviewed jobs. Where the node is lexically detectable (`g:por-para-2`, `g:ser-estar-adjectives`), a tagger key is better than a sidecar. Mark the semantic ones `detectable: false`.

**Takes.** `schema.ts` (additive), `gate/checks.ts` (one clause in `checkBank`), `exercises/ladder.ts` (`chooseItem`, `typeFormItem`, `analyseGap` read `focus` first), and `practiceCard`, which must pass `item.node`. That also retires the missing `answerBelongs` guard in practice. About 2 MB more raw bank.

**Caveat.** M4 proves a feature with that node id exists on the row. It does not prove the span is the decision the learner should make. Sample 200 rows across bands before relying on it.

**Depends on** the re-tag: spans must be computed after tagger changes, once.

### 2.4 Acceptance expansion

**Where it goes.** I said four mechanical freedoms belong in `canon`. Having read it again, that is wrong for most of them. `canon` works on a flat token list with no constituents, so it cannot safely swap two post-verbal phrases. `variants.ts` already generates strings and lets the matcher compare, and `questionOrders` shows the pattern.

| Change | Home | Why |
|---|---|---|
| `irme` (`<=` to `<`), digits and the `xnum` leak, optional *a mí* | `canon`, `spanish.ts` | Token level, no meaning risk |
| Clause order around *si, cuando, aunque*; fronted place and *hace* phrases | `variants.ts` | Generate, then compare |
| Synonym classes with article and gender | `variants.ts` | `peninsularVariants` already does exactly this. Generalise it |
| Future and *ir a*, preterite and perfecto, *-ra* and *-se*, conditional and *-ra* | `variants.ts`, using `reinflect` | Engine forms |
| Two post-verbal phrases | **Drop for now** | Needs a chunker. Leave it to the sidecar |

**The trap no report named.** A swap can defeat the card. If the target is `g:future-simple` and the learner types *voy a pagar*, accepting silently removes the point of the card. So each generated variant carries what it swapped, `TranslationResult` reports it, and the card turns a pass into a pass with a note when the swap touches its target. That is target scoring at its cheapest, and the "nudge" Report 03 asks for.

**Tests.** The batteries already written (91, 47, 21 and 279 items) become one regression file, with negatives. Acceptance must rise, and false accepts must stay at 0. Add a latency budget, since expansion multiplies canon calls at 0.1 ms each.

**Sidecar, forced by M11.** Report 03 says `focus`, `accept` and contrast rows "can share one burn over the same files". They cannot. The job contract rewrites a whole output, and the outputs are 0.6 to 1.3 MB. So `content/accept/uNN.json` maps row id to alternatives, loaded with the bank, linted by the gate as answers. Jobs of about 200 rows, B1 and up first. Run it **after** the engine lands, sized from what the battery still fails.

### 2.5 The third verdict

Three reports, three grades: correct (05 Lower), Hard (05 Upper), self-graded compare (03).

**3a, the self-claim, Stage 2.** After a reveal on a whole-sentence card, "Mine says the same thing". `gradeOf` already has the path: `lenient` gives Hard. Takes `card.tsx`, one field on `Outcome`, and a log row. **Hard, not correct:** self-grading is biased, a Hard cannot lapse a card, and the row feeds the accept harvest. Suppress the button when a named trap fired. No schema change. `weak.ts` must skip claimed rows.

**3b, "Can't confirm: compare", later.** It needs a judgement of whether the target is right inside a failed sentence, so it depends on `focus`. Do not build it first.

### 2.6 Storing the given answer and the error kind

F0.1 says "hours" and I said "30 lines in 4 files". Both undercount.

- 12 scoring sites in `runner.ts`, 5 in `freeplay.ts` and 15 in the simulator would each need threading. **Do the attempt seam first.**
- M14: the text must not go on `ReviewEvent`. An exposure writes one event per node, so `given` multiplies by up to nine, inside a log that already rewrites whole on every save.

**Ruling.** `err` and `rule` go on the first event of an answer only, as short enums. Text goes in a separate capped document, about 1,000 newest rows of `{ at, node, op, sentence?, given, answer?, err?, rule?, claimed? }`, under its own key. A `fingerprint` rollup on `LearnerState` survives compaction, and it is an additive field, so no version bump. Backups must include the key. Honours the standing rule: misses locate, training stays form-based.

This is capture, and capture cannot be recovered later, so it lands in Stage 1.

### 2.7 The interference layer

Reports 02 and 06 designed the same thing as `interference.ts` and `traps.ts`. **One module, `src/check/traps/`:** `rules.ts` (the union of both tables), `pitfalls.ts`, `index.ts`.

- **Two entry points, and both matter.** `diagnose` for sentences, and `wordHint` and `itemCheck` for gaps, which Report 02 shows are the worse case.
- **Pitfalls must be scoped to the card's nodes.** Report 02's global dictionary conflicts with Report 06's evidence (unscoped: 20 hits, 5 wrong). Scoped wins. Ship one derived pitfall file, because a review's script may be out of window.
- **No tagger at runtime here.** F2 reads "tagger features of the expected sentence". Use `analyzeToken`, `focus`, and the trigger lists in `input.ts`.
- **Order.** Honest hints in Stage 0, acceptance before traps, or a trap will explain away a right answer.
- **Tests.** The batteries become a suite: 0 misleading. Extend `tests/ui/copy.test.ts` beyond `src/ui`, since rule text lives in `src/check`.

### 2.8 Honest per-format time costs

**Takes.** Three separate things.

1. Priors: edit `SECONDS`.
2. Measurement: an additive `timing.byFormat` rollup on `LearnerState`.
3. Costing a review by planned format. The format wheel lives in `cards.ts`, above the compiler, so it must move down to `exercises/` for the compiler to read it, and `ReviewItem` gains an optional `format`.

`compile.ts` has 28 uses of `SECONDS` or `spr`, and all should go through one `cost(op)`. The simulator needs per-op `secs`, which is one more reason for the attempt seam.

**What it does.** M7. Throttling doubles and a fifth of intake goes. That is not a bug to tune away. It is the true state, and reports 04 and 03 should be read together: V1 is already starving vocabulary at a pace that was too optimistic.

**Order.** Report 03 is right: tune after the checker, because false lapses inflate the load. I add two more: after contrast blocks and after `focus` gaps, because both change the card mix being timed. One exception, in 2.9.

**Seam.** I patched budget tables by hand in a process to run M8, and `simulate.ts` does the same. Turn the constants into a `Policy` passed in `CompileInput`. Everything after this needs it.

### 2.9 B2 and C1 minutes: the cheap one nobody costed

`SESSION_MINUTES` still says 28 and 30, which contradicts a standing decision. M8 says raising them clears the owed queue for a placed B2 learner, and raising the warm-up as well gives 67% more new items. That is two table rows. Do it in Stage 2 and re-tune in Stage 5. Topic lessons remain a separate, large job.

### 2.10 Placement

Three steps, not one.

1. **Stage 0, hours:** `ladder.result` (05 Lower C1).
2. **Stage 1 to 2:** stop the stall through the debt policy (2.11), and fix what placed learners read (R3). That needs chapter metadata from 2.13.
3. **Stage 6:** the rebuild. `ProbeSource` is a clean seam, so `onboarding.tsx` barely moves. Items come from `ContrastItem` plus typed sentences, which is why it follows both the contrast burn and acceptance. A typed placement item on today's checker would fail the learners it is meant to find.

Per-skill seeding needs almost nothing of its own: leave a failed skill unseeded and P2's `reconcile` owes it. Cap owed grammar, or one bad result floods the queue. "Change my level" comes last, because moving someone down rewrites their path.

### 2.11 Welcome-back, and why the soft reset goes

**Drop the soft reset** (05 Lower H2). Scaling stability writes a guess into the only honest record the learner has, across thousands of cards, irreversibly. FSRS already handles overdue cards.

**Instead, one compiler change fixes four reports' findings.** Today `throttled = dueMinutes > budget`, so old debt stops new teaching for weeks. Split due cards into *fresh* and *debt* (overdue well past their interval, or seeded by placement). Debt is paid at a capped rate per session and does not throttle. No card is touched, no state changes, and it is fully reversible. It addresses 05 Upper C2 (the wall), 05 Lower H2 (absence) and C4 (placed stall), and Report 03 P8 point 5 (never a fully review day).

On top: a cap in cards as well as minutes, and a return plan using the existing `reviewDay` machinery. Do **not** add a `LessonType`: it is a content enum used by `LEXEME_CAP`. Add `plan.reentry` and `LearnerView.lastSessionAt`, plus one line on Home.

**Unverified.** This design has not been run. It needs an absence profile and a placed profile in the simulator before it ships. Note too that "490 cards" in 05 Upper is partly the bot: `spr` is measured, and a bot answers in about a second. Real-pace evidence is 05 Lower's 61 cards. The cap is still right.

### 2.12 Can-do evidence

**Step 1, Stage 1, one file:** `progress.tsx`. Ticks need a check or a self-mark, "Covered, not yet checked" otherwise, and "Skipped at placement" is separate from "Earned". No content, no state.

**Step 2, Stage 6:** a real evidence function over rung, novel passes and the attempts log. It belongs after the fingerprint.

### 2.13 Library metadata in core

Reports 05 Upper (C4), 04 (R3) and my P5 and P7 are one problem: the compiler and the screens see only what this tab happened to load. Fix it once, as an **availability lane**.

1. A derived `library.json` built at gate time. No loader glob covers `content/_manifest.json`, so a manifest needs its own import, which my report overlooked.
2. Metadata only. 219 chapters of `requires` is too heavy for core.
3. A `prepare(learner, path)` async step before compile that fetches the window, the next unread chapter, and by-node rows.

`chapterFor` then works on metadata, and the sync compiler stays pure. Add the test 05 Upper asks for: real boot window, not the whole corpus.

### 2.14 Tap-gloss

**R1, Stage 1:** `bundle.gloss` takes the sentence and refuses a phrase that does not cover the tapped token. Two files, one all-chapters test. A Sonnet job.

**R8, after the re-tag:** per-token lemma and form written beside each chapter by `gate --fix`. It needs tagger precision, so it must not run first. The closed-class table (*del, al, hay*) can land any time.

### 2.15 Backup and restore

Keep, and do it first. Three constraints:

- **Allowlist keys, do not hard-code documents.** New keys are coming (attempts, writing, games).
- **Restore goes through migrations.** Store raw documents and let boot migrate, dry-run `migrate` before overwriting, write a `*.pre-restore` copy, and refuse a newer backup in human words.
- **Export through a store method**, so the later split does not rewrite this.

Bonus: a tool that reads a backup and prints what the next build's `reconcile` would do gives the owner a rehearsal on real data.

### 2.16 Saved writing

Own KV key, not `UiState`, because `ui.update` clones the document on every change. `blocks/writing.tsx` line 58 plus a small store. Include `personal` answers from the start. Capture now, view later.

### 2.17 Games

The Games report is well specified and I accept its shape. Four notes.

- **I was wrong that games wait on the store split.** `touch` coalesces saves, and `credit.ts` can batch one `expose` per round. Games need P11, not P6.
- **`ms` must never reach `recordTime`.** Add a test, since `spr` drives every budget.
- **`ContrastItem` comes from 2.2.** Drop its private schema and `content/games/contrast/`.
- **Relámpago needs no content and can start after Stage 1.** Uno u otro waits for the burn.

`src/games` touches none of the bottleneck files. Whether Play replaces Settings is the owner's call.

### 2.18 Rayos X at runtime

**Report 06 is right and I was wrong.** M9: a lazy chunk at 146 KB gzip against my build-time 2 MB. It also explains sentences no build step can see: engine transforms and the learner's own text. Do not repeat the 82 KB figure.

**Takes.** A new `src/explain/`, one link in card feedback and the reader, and moving `tagOpts` construction from `tools/gate/load.ts` into `src/engine/tagger/` so the app can build it from the graph. Measure first-call cost, because 650 pattern specs compile on load.

**What I keep from my report.** Precision first. `Habrá comida` read as future perfect would be stated to a learner as fact. Show a whitelist of feature families, and add a CI pass over the corpus that freezes their output. Do this after the re-tag.

### 2.19 Reading track

Keep, as a shelf first. Serving pieces in lessons can come later, and `LedgerKind 'reading'` already exists with zero entries, so no state change.

**Takes.** `ReadingPiece` schema, the kinds registry, the gate's band spec, a reader component export (`Passage` is private), and question rules.

**A trap in `vite.config.ts`.** `chunkFileNames` lists content kinds by regex, and anything else lands in `assets/`, which the precache glob takes whole. **A new `content/reading/` directory would silently add the entire library to the install.** The same applies to `contrasts` and `accept`. This is one of five hand-synced kind lists (`loader.ts`, `gate/load.ts`, `gate/extract.ts`, `sim/load.ts`, `vite.config.ts`). A registry goes in the Stage 1 seams, with a test that every content directory is runtime-cached.

**Spec conflict to settle before any writing.** Chapter length at C1 is 400 to 600 in the gate, 700 to 1,000 in the writers' brief, 1,200 to 2,000 in R6. Band limits must be one table.

**Depends on** the lexeme rebuild, because writers need the true word lists and coverage means nothing against corrupted ranks.

### 2.20 Benchmark

Last, because it consumes everything: passages, contrast items, a fair translation checker. It needs no compiler: a `Freeplay`-style runner, resumable, with held-out items the compiler must never serve. **Consolidation weeks need M12 solved.** Do not mint new unit ids, which would break the id regex, `unitWanter` and bank file names. Raise `days.max` and append at the end of a unit, which shifts no learner's integers even before stable keys. A C-test can ship much earlier as a cheap yardstick.

---

## 3. Other proposals, briefly

| Proposal | Ruling | Why |
|---|---|---|
| P6 store split | **Keep, do it early, into a new database** | Few learners means the migration is at its cheapest now. See section 9 |
| P7 by-node index | **Keep**, in the availability lane | Also what makes contrast and review rows window-independent |
| Lesson slices across days (05 H3) | **Keep, after P1 and P2** | A plan resumed days later needs `contentVersion` and the sweep |
| Transform whitelist (05 C2) | **Stage 0** | A one-line licence check and refusals. Teaching *¿Se puedo?* is worse than most of this list |
| Hash arms, 10% holdout (03, 06 F0.6) | **Drop for now** | With so few learners it cannot show anything, and it gives some nodes weaker teaching. Revisit with real numbers |
| Adaptive pacing | **Keep, after `Policy`** | Hard part is skipping, which needs stable keys |
| Reconstruye (F4) | **Keep**, after chapter English | Self-grade as exposure, as proposed |
| Word-level diff (05 H10) | **Keep, cheap** | `align` already produces it |
| Topic lessons at B2 and C1 | **Keep, Stage 5, needs P2** | This is the true re-sequencing, and the reason P2 exists |
| Hash routes, a11y, desktop | **Free-running** | No dependencies |

---

## 4. Corrections to my own report

| I said | Now | Why |
|---|---|---|
| Explain at build time, 2 MB gzip | **Runtime lazy chunk** | M9, and it can explain generated sentences |
| Four mechanical freedoms in `canon` | **Mostly `variants.ts`** | `canon` has no constituents (2.4) |
| Content-hash ids for bank rows | **Drop.** Keep positional ids, frozen | 91 verified fixes edit rows in place. A hash makes each a new sentence. Gate: an id never vanishes without a migration, and an `es` change warns |
| Split `compile.ts` before parallel work | **Defer** | It is a validation bottleneck, not a merge one. Budget changes interact, so they cannot be proved in parallel, and a file split does not change that. Serialise the lane instead. Split `cards.ts` |
| Games need the store split first | **No** | 2.17 |
| Fingerprint in 30 lines on `ReviewEvent` | **Separate log, after the seam** | 2.6 |
| Keep only `wt:` keys in the item ledger | **Keep `wt:`, `sc:`, `cx:`** | Contrast "already taught" reads `sc:` |
| Drop `state.prev` | **Replace it** with a snapshot per version, and only once backup exists | Rollback needs one copy, not one per save |
| "The deployed app rebuilds from this repo" | **Only on push** | M1. P1, P3 and P5 are still real, and most of what I measured is not yet deployed |

---

## 5. Dependencies

**Independent, any time after Stage 0:** R1 tap-gloss, can-do labels, saved writing, look-up aliases, a11y, word-level diff, Relámpago, Rescate.

**Eight chains.** Arrows mean "must land before".

```
A trust      next + CI -> golden learners -> P3, P12 -> backup -> P1 -> P2 -> any curriculum move
B attempts   op registry -> attempt seam -> attempts log -> fingerprint -> traps screen -> mastery -> strong can-dos
C checker    honest hints -> acceptance engine -> traps -> verdict 3b -> accept sidecar burn
D content    P11 -> P5 -> prepare + by-node index -> library -> chapter start for placed learners
E tagger     engine verbs -> lemmas + precision -> lexeme rebuild -> node moves -> RE-TAG -> focus + tokens -> gaps
F contrast   x-script fixes -> teach block -> derive tool + schema -> contrast burn -> reviews, Uno u otro, placement, benchmark
G time       C + F + gaps -> per-format timing -> budgets -> reserved word time
H reading    kinds registry + E -> ReadingPiece -> burn -> shelf -> coverage -> benchmark
```

**The joins that matter.** P2 before E's node moves. Script fixes before the teach block ships. Engine acceptance before the accept burn. E before F's burn, since contrast rows compute `requires`. C and F before G.

**Bottleneck files.**

- **`compile.ts`** is touched by contrast teach, contrast review, debt policy, cost, library, and a later reading slot. They sit in different functions, so git would merge them. The reason to serialise is that each changes budgets and needs its own simulator run. **One lane, one change at a time.**
- **`cards.ts`** is touched by contrast cards, `focus` and acceptance plumbing. **Split it in Stage 1,** after which these are separate files.
- **`runner.ts`** is touched by P1, verdict and attempts. **The attempt seam removes most of this.** After it, the file is small and stable.

The true shared hazards are `schema.ts`, `compiler/types.ts`, `graph/*`, `units/*`, `styles/app.css` and migration numbers.

---

## 6. Content order and the tagger

**Rules that follow from the code.**

1. The gate requires `requires == tagger output` across the corpus. **Any tagger or graph change is therefore atomic with a corpus re-tag**, or the whole-corpus gate fails while job-scoped gates pass.
2. So tagger changes batch up, and there is **one re-tag**, not many.
3. `gate --fix` rewrites every bank file, so nothing else may edit bank files during it.
4. Text edits to existing rows come before it. New rows go in new files after it.
5. Burn jobs write new files only (M11, and P2's frozen ids). `bank-topup` already works this way.
6. `CLOUD.md` forbids jobs from editing `src/`, so schema, gate, loader and prompt must all be on the branch **before** the first job of a kind. Run a pilot of three jobs before queueing the rest.

| Order | Work | Tagger? | Re-tag? | Burn? |
|---:|---|---|---|---|
| 1 | Verified fixes: scripts 343, graph titles and notes, chapters 14. The 8 code fixes go to their lanes | No | No (script legality only) | Yes: `claim-fix` by file, 221 files, Sonnet with Opus review. **Refuted claims excluded** |
| 2 | Verified bank fixes, 91, in place, ids kept | No | Those files only | Same job, or by hand |
| 3 | Mood model, naming and voice decisions | No | No | Script sweep, after the owner rules. The linguist's warning stands: it is not mechanical |
| 4 | Engine: 145 missing verbs, `vámonos`, diminutives, `splitEnclitic` | Feeds it | Yes, batched | No |
| 5 | Lemmas: `l:buena` and the 834 inflected rows, junk ids, phantom metric | Yes | Yes, batched | No |
| 6 | Precision: `comida`, `hubo`, `debe de`, `c:a-cuantas-cuotas`, spurious features, `detectable` | Yes | Yes, batched | No |
| 7 | Lexeme rebuild: V4, V2, V6 together, as Report 04 says | Yes | Yes, batched | Gloss review |
| 8 | Node moves 1 to 10: `nodemap`, new pattern specs, unit and graph edits, each with a content migration | Yes | Yes, batched | Rows at step 11 |
| 9 | **THE RE-TAG.** One commit. Then legality and day-supply worklists | | **This is it** | No |
| 10 | Derive: `focus`, chapter tokens, library, by-node index, pitfall file | Reads it | No | No |
| 11 | Blind nodes' `focus` (37), move top-ups, `scene-fix` | Via `gate --fix` | Per file | Yes. `load-topup.ts` covers most |
| 12 | Contrast sets, 94 jobs plus review | Via `gate --fix` | Per file | Yes |
| 13 | Accept sidecars | Legality lint | No | Yes, about 200 jobs |
| 14 | Chapter rewrites: R5 questions, R6 prose, R12 | Via `gate --fix` | Per file | Yes |
| 15 | Chapter English, 11,316 sentences. **After 14**, or it is written twice | No | No | Yes, by unit |
| 16 | Recycling rows, 5,000 to 8,000 | Via `gate --fix` | Per file | Yes, after moves, since rows target positions |
| 17 | Reading track | Via `gate --fix` | Per file | Largest. After 7, so word lists are real |
| 18 | Topic lessons, consolidation days, benchmarks, placement items | Via `gate --fix` | Per file | Yes, last |

**Before re-enabling the burn.** `load-topup.ts` hard-codes `APP`, and prompts embed absolute paths. `resolvePrompt` rewrites only the leased text, so a burn from a worktree would read the main checkout. `cloud.sh` and `CLOUD.md` hard-code `rebuild` and push straight to it. The routines' own prompts need checking: I did not read them.

---

## 7. The staged plan

Each stage ends with `npm test` exit 0, `npm run gate` 0 errors, `npm run build`, the golden-learner suite, and a played session on the dev server. Only then does `rebuild` move.

**What must land first, in order:**

1. `next` branch as trunk.
2. P11 index, so `npm test` exits 0. Until it does, "green" means nothing.
3. CI on push.
4. Golden learners.

### Stage 0: safe ground

| Agent | Work |
|---|---|
| **One, serial, first** | `next`, P11 index, CI, golden fixtures |
| `persist` | P3, P12, pre-migration snapshot, backup and restore |
| `session` | P1 sweep with simulator abandon profile, `ladder.result`, read cards are exposure only, `Rich` on `personal` |
| `check` | `irme`, `xnum`, honest hints, `mood` and `aspect` kinds, *a* + *el* |
| `gen` | Licensed transforms, refusals, Vale as a name |

**Exit:** first fast-forward of `rebuild`, carrying waves 1 to 3 as well. Owner decision: my view is to push after this stage, not before, so the release that bumps `ui` also carries the newer-document fix and backup. M2 says either is safe.

### Stage 1: seams, content truth, capture

| Agent | Work |
|---|---|
| **One, serial, first, no behaviour change** | Op registry, `cards.ts` split, content-kinds registry and vite test, attempt seam, exhaustive `servedRefs`, typed `ReviewEvent.op`, per-feature CSS, `Policy` |
| `path` | P2: day keys, shipped snapshot, migration table, `reconcile`, session `contentVersion`, gate vanish check |
| `avail` | P5, by-node index, `prepare`, library, service worker fixes |
| `capture` | Attempts log, `err`, read rows, monthly snapshot, log version, saved writing |
| `gate` | Triage classes, `detectable`, phantom metric, one length table |
| Free | R1, can-do labels, aliases, a11y |

**Exit:** `reconcile` proved against a synthetic moved course on golden learners. Release.

### Stage 2: repair the core, no new content

| Agent | Work |
|---|---|
| `compiler`, **serial** | Contrast teach and return, rotating contrast reviews, debt policy and welcome-back, B2 and C1 minutes. A simulator run after each |
| `check` | Acceptance engine with swap notes, traps, verdict 3a |
| `content` | The verified fixes, including **all contrast scripts**. Blocks release of the teach block |
| `persist` | P6 shrink, P13 locks, then the store split |
| Free | Relámpago, Rescate, word-level diff |

**Exit:** paraphrase battery up with 0 false accepts, trap battery 0 misleading, every contrast reachable, placed learner does not stall. Release. **The store split ships alone** in its own release.

### Stage 3: the tagger window

Content freeze on bank, graph and units. No burn runs. Lanes merge in this order, each one ready but held until the re-tag:

`engine`, `tagger`, `graph` (lexeme rebuild and node moves), then `retag` alone (one worktree, one commit), then `derive`, then `gaps`, then contrast schema, gate and derive tool.

**Exit:** gate clean, worklists produced, sampled `focus` spans reviewed, first real content migration passes on golden learners and on an owner backup. Release.

### Stage 4: the burns

Steps 11 to 16 of section 6. One burn runner at a time. Consumers already in code fall back on absence, so each job's output can ship when ready. Every pilot is reviewed before its queue is loaded.

### Stage 5: time and shape

Per-format timing, budgets with the owner choosing the trade-off from simulator tables, reserved word time, delivery test in CI, then topic lessons and consolidation days.

### Stage 6: proof and entry

Placement rebuild, mastery and strong can-dos, benchmark, verdict 3b.

**Free-running from their gate:** games (after Stage 1), Rayos X (after Stage 3), reading schema and shelf (after Stage 3), reading burn (after the lexeme rebuild).

---

## 8. File ownership and worktrees

One lane holds a file at a time. Bold rows are single-owner for the whole project.

| Lane | Owns | Stage |
|---|---|---|
| **trunk-keeper** (main session) | Merges, `next`, `rebuild`, `.github/` | All |
| **schema** | `content/schema.ts`, `compiler/types.ts`. Additive PRs, merged before the lane that needs them | All |
| **persist** | `learner/store.ts`, `state.ts`, `ledger.ts`, `events.ts`, `learner.ts`, `backup.ts`, `ui/store/ui.ts`, `screens/settings.tsx` | 0 to 2 |
| session | `runner.ts`, `attribute.ts`, `recap.ts`, `screens/session.tsx`, `attempt.ts` | 0 to 1 |
| **compiler** | `compile.ts`, `budget.ts`, `content.ts`, `remediate.ts`, `tests/compiler` | 2, 5 |
| check | `check/translate/*`, `check/wordhint.ts`, `check/traps/*` | 0, 2 |
| gen | `exercises/*` except the registry | 0, 3 |
| cards | `session/cards/*`, `ui/components/card*` | 1, 3 |
| avail | `ui/data/*`, `vite.config.ts`, `main.tsx`, `tools/build/*` | 1 |
| path | `reconcile.ts`, `content/_shipped/*`, `content/_migrations/*` | 1 onward |
| **gate** | `tools/gate*`, `tools/supply/*` | 1, 3 |
| **sim** | `tools/sim/*`, `tools/simulate.ts` | 1, 5 |
| engine | `engine/*.ts`, `verbs.json` | 3 |
| **tagger** | `engine/tagger/*` | 3 |
| **graph** | `content/graph/*`, `content/units/*` | 3, 5 |
| **retag** | Every computed field, for the length of one commit | 3 |
| **burn** | `tools/burn/*`, `tools/queue.ts`, `content/_queue/*`, new content files | 4 |
| reader | `blocks/read.tsx`, `screens/story.tsx` | Free |
| screens | One file under `ui/screens/` each | Free |
| games | `src/games/*`, `ui/games/*`, `styles/games.css` | Free |
| explain | `src/explain/*`, `ui/components/explain.tsx` | Free |
| reading | `content/reading/*`, its gate checks by request | Free |

**Append-only, conflicts trivial:** `exercises/ops.ts`, `src/content/kinds.ts`.

**Reserved versions, so nobody invents one:**

| Document | Now | Next | For |
|---|---:|---:|---|
| state | 2 | 3 | Store split. The only reshape planned |
| path | 2 | 3 | Stable keys |
| ui | 3 | none | New data takes its own key |
| session | 1 | 2 | `contentVersion` |
| event log | none | 1 | P12 |

**Worktrees.**

```
git worktree add ../wt/<lane> -b lane/<lane> next
cd ../wt/<lane>/app && npm ci
```

- Run `npm ci` in each. Do not symlink `node_modules`: concurrent runs would share Vite's cache. 167 MB each.
- Give each dev server its own port. `render.ts` and tests need none.
- Never run a whole-corpus `gate --fix` outside `retag`.
- No new dependency without approval. `package-lock.json` conflicts are avoidable.
- Stage only named paths. `docs/swarm-audit` and `tools/reseq/` are untracked in the main checkout and must not be swept in.
- Lanes rebase on `next`. The trunk-keeper merges one at a time, full suite on the rebased result.

---

## 9. Keeping saved state safe

**The live site deploys from `rebuild` within 20 minutes of a push, with no tests.** So:

1. **Trunk is `next`.** `rebuild` only fast-forwards, at stage ends, after CI. This needs no change in `fluidez-next`, no secrets, and keeps the deploy rule as it is. The burn moves to `next` too.
2. **Golden learners.** Real saved documents checked in: one at the live `ee6aaec` shape, one at HEAD, one mid-session, one placed. Every PR boots them through migration and reconcile and compiles a session. Assert no throw, no node lost, reps preserved, no orphan card, path valid. Generate them **before** any schema change, because the live shape can only be captured now.
3. **Additive first.** `migrate` keeps unknown fields, so an optional field needs no bump and survives a round trip through an older build. Bump only for a reshape.
4. **Tolerant reader first.** P12 must be live before the first bump. Today a newer document strands a learner on "Try again". Give it a release to spread.
5. **Snapshot before migrating.** One copy per version, written once, kept for the next version.
6. **The store split goes to a new database.** Do not upgrade `fluidez` in place, because an open older tab blocks it. Create a new database, copy, verify counts and a checksum, flip one flag, leave the old database untouched for two releases. A bug then costs a redo, not a learner. Add a property test: random operation sequences, reopen, state equal. A missed dirty mark is a silent lost write.
7. **Content migrations are append-only**, like `MIGRATIONS`. `reconcile` is pure and idempotent, and it runs at boot. The compiler stays integer-based and does not change.
8. **Saved sessions carry `contentVersion`.** A mismatch discards the plan, after the P1 sweep has handed its nodes on. So P1 lands first. Plan-shape changes stay additive or bump the session version.
9. **Burns append.** New files, no id changes, no renames without a migration, and a gate error if an id vanishes.
10. **Rollback.** Reverting code does not revert data. A release with a bump is a one-way door, so it ships alone, after a backup on the owner's own device and the backup rehearsal tool.
11. **Old tabs.** `registerType: 'prompt'` leaves a tab on the old build, asking for chunk names Pages no longer serves. P16 lands in Stage 1, and P13 locks land before the store split.

---

## 10. Who can implement what

**Sonnet alone, tests decide:** R1, can-do labels, `Rich`, copy fixes, `irme`, `xnum`, transform licensing, `ladder.result`, saved writing, aliases, a11y, word-level diff, CI, gate triage classes, CSS split, card split and op registry (mechanical, existing tests prove them), Relámpago shell, reading shelf UI. **Haiku:** flag and field sweeps.

**Sonnet with close review:** backup and restore, contrast cards, `focus` consumers, loader and `prepare`, welcome-back UI, placement items, games grading code, `claim-fix` jobs. Reason: each has a quiet failure mode.

**Needs design ownership and line-by-line review:**

| Work | Why |
|---|---|
| P1, P3 | Silent loss |
| P2 and `reconcile` | Wrong for every learner at once |
| Store split | Silent lost writes |
| Attempt seam | Every grade passes through it |
| Debt policy and budgets | Interact across the whole course |
| Acceptance rules | A false accept teaches wrong Spanish |
| Trap rules | Need a linguist as well as an engineer |
| Tagger features | Everything downstream reads them |
| The re-tag | Touches every row |
| FSRS evidence rules, game credit | Corrupt the schedule quietly |

**The owner or a native speaker, not an agent:** dialect calls (10 native-check verdicts), the subjunctive name, what gives on contrast days, and wrong Spanish shown on purpose.

---

## 11. Recorded disagreements

| With | Issue | My position | State |
|---|---|---|---|
| 03 P3 | `focus` burn on 20,000 rows | Derive it. 95.4% of grammar rows have a span. Burn 37 nodes | Resolved, span quality to sample |
| 03 §8 | One burn for `focus`, `accept`, contrast rows | Impossible (M11) and they have different inputs | Resolved |
| 06 F3 | Contrast rows need no code change | `chooseItem` ignores the contrast. Rotation is missing | Resolved |
| 02 §6.3 | Tag existing rows by contrast | Would make them inadmissible (`content.ts:161`) | Resolved |
| 06 Games, 03, 06 F3 | Where contrast data lives | One `content/contrasts/`, one `ContrastItem` | Resolved |
| 03, 06 Games, 06 F3 | Rows per contrast | Start 40, top five 150, measure | Evidence |
| 04, 03 P2 | Contrast teach is cheap, no content | Over budget on 100% of days; scripts unplayed, one backwards | Resolved |
| 04, 03 | How the time is found | Move `communicative` and freer `writing` | Owner |
| 05 Lower, 05 Upper, 03 | Grade of "mine is right" | Hard, via `lenient` | Owner |
| 05 Lower H2 | Soft reset scales stability | Drop. Compiler debt policy instead | Evidence: not yet simulated |
| 05 Upper C2 | 490 cards | Largely a bot-speed artefact. The cap still stands | Resolved |
| 02, 06 F2 | Two detectors | One module | Resolved |
| 02 §6.2 | Global pitfall dictionary | Scoped to the card's nodes, per 06 F2's evidence | Resolved |
| 06 F0.1, 07 | Given answer on events | Separate capped log | Resolved |
| 07 (me), 06 | Explain at build time | Runtime chunk. And it is 146 KB, not 82 | Resolved |
| 07 (me) | Freedoms in `canon` | `variants.ts` | Resolved |
| 07 (me) | Content-hash ids | Drop | Resolved |
| 07 (me) | Split `compile.ts` first | Defer. Serialise the lane | Resolved |
| 07 (me) | Games need the store split | They do not | Resolved |
| 04 | New consolidation weeks | Append days, raise `max`, no new ids | Resolved |
| 03, 06 | 10% holdout, hash arms | Not until there are learners to measure | Evidence |
| 04 V1 | Reserve word time | Agreed in principle. What gives is a table for the owner, in Stage 5 | Owner |
| 04, 04 Vocab, 06 | Reading volume and name: 300k, 400k, 500k | Pieces and spec first | Owner |
| Gate, brief, R6 | C1 chapter length | Must be one table | Owner |
| 06 Games | Play replaces Settings | No architectural objection | Owner |
| None | Pushing waves 1 to 3 | After Stage 0. M2 says now is also safe | Owner |

---

## 12. Limits of this review

- **Simulator.** One seed, one profile, a full content index rather than the browser window (my own P7), so absolute numbers are indicative. Pace 17 s comes from Report 05's runs, not real people. M8 is 120 days from one placement. Direction is reliable, percentages less so.
- **M6 is arithmetic**, plan estimates plus `SECONDS` constants, which are themselves unmeasured. The fix in 2.1 has not been run.
- **The debt policy in 2.11 is a design, not a result.**
- **M4 shows a feature exists on the row**, not that the span is the right decision to gap.
- **Costs of `prepare`, first-call tagger time and the store split are estimates.** No real phone or Safari. Tagger chunk size excludes the graph data needed to build its options at runtime, which is already in core.
- **Whole-gate run time was not measured**, only the tag pass.
- **Not read in full:** the five band reports and the coverage matrix (I used the linguist's cross-review and the verdict counts); `publish.yml` past its build job; the cloud routines' own prompts. 102 claims have no verdict and are excluded from M13. Report sections read were the recommendations and the findings each proposal rests on.
- **Whether real learners exist is still unknown.** Every safety rule here assumes they do. If the owner is the only learner, the same rules apply with less urgency, and the store split gets cheaper.
