# 07. Software architecture and quality

Audit of the rebuild in `app/` at commit `5f916ec` on branch `rebuild`, 1 November 2026. Everything labelled "measured" was run for this report. Throwaway scripts and raw results are in the session scratchpad (`arch/`). Nothing under `app/src`, `app/content` or any existing file was changed.

**The verdict in one paragraph.** The domain core is unusually good: a pure compiler, an honest learner model, an engine that got 162 of 162 hard forms right, 99% line coverage on the logic. The weakness is everything around that core, meaning what happens when real life interrupts it. A learner who walks away mid-lesson permanently loses the grammar point. One failed disk write silently stops saving and hangs the close screen. There is no backup. Nothing links saved progress to the version of the course, so the first re-sequencing will corrupt real learners without an error. Every answered card rewrites the whole learner, which after two years freezes a mid-range phone for over a second per card. These are all fixable without a rewrite, and most of the fixes are small. They should land before any parallel feature work and before any curriculum change ships.

---

## 1. What was investigated

Read in full: `src/compiler/compile.ts`, `compiler/types.ts`, `compiler/content.ts`, `compiler/budget.ts`, `ui/session/cards.ts`, `runner.ts`, `freeplay.ts`, `placement.ts`, `attribute.ts`, `recap.ts`, `learner/learner.ts`, `state.ts`, `store.ts`, `events.ts`, `ledger.ts`, `weak.ts`, `ui/store/ui.ts`, `ui/data/loader.ts`, `bundle.ts`, `ui/app.tsx`, `main.tsx`, `screens/session.tsx`, `home.tsx`, `onboarding.tsx`, `practice.tsx`, `settings.tsx`, `blocks/teach.tsx`, `blocks/practice.tsx`, `components/card.tsx`, `check/translate/match.ts`, `canon.ts`, `engine/conjugate.ts`, `engine/tagger/index.ts`, `content/schema.ts`, `vite.config.ts`.

Read in part: `tools/gate.ts`, `tools/gate/checks.ts`, `tools/sim/run.ts`, `tools/simulate.ts`, `blocks/read.tsx`, `styles/app.css`, `screens/progress.tsx`, `learner/metrics.ts`, `tagger/nodemap.ts`.

Experiments, all on real content:

| Experiment | How |
|---|---|
| Production bundle, chunk attribution | `vite build` to the scratchpad, module sizes from Rollup's `generateBundle` |
| Long-history growth | the real simulator (`simulateProfile`) over the full corpus, `average` profile, 100, 215, 365, 730 days, state and event log sampled |
| Compile cost and full vs windowed index | every 25th session recompiled against the full index and against the window the browser loads |
| Browser cost | production build in Chromium via Playwright, with real 100-day, 1-year and 2-year learner documents seeded into IndexedDB, at native speed and at 6x CPU throttle |
| Offline | real service worker, a seeded learner at u18, offline inside and past the cached window |
| State drift | a saved learner against a course with a renamed node, an inserted day, a new grammar node in a passed unit |
| Interrupted lesson | `SessionRunner` over real content, lesson opened, session abandoned, next day compiled |
| Failed write | `Learner` over a store that throws once |
| Conjugation and tagger | 162 hand-checked forms, 35 analyser cases, 85 hard sentences through the real tagger with real curriculum options |
| Translation matcher | 21 valid paraphrases and 2 wrong answers; latency over 312 real rows |
| Gate | every finding dumped uncapped through `runGate()` |
| Tests | full run with JSON report, line coverage for 61 of 63 files |
| Static | import graph, cycles, layering, unreferenced exports, contrast ratios computed from the CSS tokens |

---

## 2. Evidence from the actual application

### 2.1 Bundle

Measured with `vite build`.

| Item | Size |
|---|---|
| Main JS chunk | 781.6 KB, 212 KB gzip |
| Precache | 152 entries, 5.85 MB raw, 1.15 MB gzip |
| All content chunks | 42.6 MB raw, 8.55 MB gzip (bank 30.3 MB, scripts 4.7, graph 2.9, story 1.7, writing 1.5, scenes 1.3) |
| `dist` total | 46 MB |

What is in the main chunk (rendered bytes, before minification): `ui/data/loader.ts` 305 KB, nearly all of it the `import.meta.glob` map of 1,630 lazy content modules; `zod` 246 KB, used only to re-validate content the gate already validated; `verbs.json` 117 KB; `compile.ts` 65 KB; `ts-fsrs` 58 KB. The tagger is not in the bundle: `engine/tagger/index.ts` is never imported from `src`.

### 2.2 Startup and first card

Measured. Chromium, production build, no service worker, local network, so network time is excluded. 6x CPU throttle is my proxy for a mid-range Android phone and is an approximation.

| Scenario | Native | 6x |
|---|---|---|
| First ever visit to welcome screen | 0.9 s | 2.2 s (one 725 ms task) |
| Boot, 100-day learner | | 1.3 s |
| Boot, 1-year learner | | 2.1 s |
| Boot, 2-year learner | 1.0 s | 3.5 s (one 904 ms task) |
| Start tapped to first card, 2-year learner | 0.29 s | 2.1 s |

Startup is acceptable. Compile is not the problem: 8 to 40 ms against the window and 15 to 95 ms against the full index in Node at unit 28 and beyond. `compileSession` runs twice per start, once in Home's `useMemo` and once in Session's, both synchronously in render.

### 2.3 Growth of saved state

Measured. Simulator, `average` profile, sampled at the plan compiled that day.

| Day | Sessions | Unit | Nodes | Sentences ledgered | Items ledgered | State | Event log |
|---|---:|---:|---:|---:|---:|---:|---:|
| 103 | 101 | 8 | 469 | 2,779 | 3,758 | 1.1 MB | 8,825 events, 1.5 MB |
| 362 | 326 | 28 | 1,366 | 9,817 | 12,738 | 3.7 MB | 34,296 events, 6.2 MB |
| 703 | 651 | 54 | 2,770 | 21,635 | 27,502 | 8.1 MB | 78,191 events, 14.4 MB |

At the end of the two-year run the state document is 9.4 MB: nodes 2.1 MB, ledger 7.3 MB, of which the `item` ledger is 4.1 MB. The compiler only ever reads the `item` ledger for keys that start `wt:` (`compile.ts:667`, `:1011`). The rest of that 4.1 MB is read by nothing but the simulator's metrics.

Of the 81,431 events at the end, 46,434 are exposures, because `Learner.expose` writes one event per introduced node in the sentence (`learner.ts:541`). Events older than 365 days are dropped at boot, so a real two-year learner holds about 8 MB of events. Adding `state.prev`, which is a second full copy, puts roughly 27 MB in IndexedDB, plus the content cache.

### 2.4 Cost of saving

Measured in Chromium. `Learner.touch` runs for every mutation and `IdbStore.save` does a clone, a read of the previous document, a write of it to `state.prev`, a write of the state, a clone of the log and a write of the log. That is six whole-document structured-clone operations, on the main thread, for each answered card.

| Learner | Speed | One save | Main thread blocked per card | Longest task |
|---|---|---:|---:|---:|
| 100 days | 6x | 168 ms | 107 ms | 54 ms |
| 1 year | 6x | 678 ms | 667 ms | 220 ms |
| 2 years | 6x | 1,990 ms | 1,305 ms | 600 ms |
| 2 years | native | 324 ms | 217 ms | 88 ms |

The cost is linear in history, and it lands on the tap that follows each answer.

### 2.5 Cost of building a card

Measured in Node on this laptop, 60 cards per op.

| Op | Window loaded (8,078 sentences) | All units loaded (72,693) |
|---|---:|---:|
| translate | 15.8 ms | 137.6 ms |
| recombine | 14.7 ms | 130.1 ms |
| choose, type | 11.8 ms | 103.5 ms |
| transform | 9.8 ms | 88.9 ms |
| comprehend | 7.8 ms | 71.6 ms |
| pick | 4.8 ms | 43.6 ms |
| receptive review | 4.7 ms | 46.3 ms |

The cost is linear in the bank because `corpusAlternatives` (`translation.ts:14`), `otherEnglish` and `otherSpanish` (`cards.ts:87`, `:99`) filter the whole array with a regex normaliser per card, and `useOrdered` (`blocks/practice.tsx:17`) builds every card of a block at once. Heap after Quick review on a two-year learner, which loads every earlier unit: 518 MB.

### 2.6 Offline

Measured with the real service worker. A learner at u18: 151 precache entries, 111 runtime entries in `fluidez-content`. Reload offline inside the window works. Past the window the app boots normally and shows no warning (see P5).

### 2.7 Tests

Measured. 2,668 tests in 63 files, 2 minutes 31 seconds. My full run: 2,667 passed, 1 failed, exit code 1.

| Area | Tests | Line coverage |
|---|---:|---:|
| tagger | 1,422 | engine 99% |
| exercises | 337 | 99% |
| ui (logic) | 337 | `ui/session` 97%, `ui/store` 100%, `ui/data` 91% |
| translate + check | 260 | 98% |
| engine | 111 | 99% |
| learner | 64 | 90% (`metrics.ts` 21%) |
| compiler | 54 | 100% (`compile.ts` 99%, branches 93%) |
| **`ui/blocks`** | | **7%** |
| **`ui/screens`** | | **14%** |
| **`ui/components`** | | **19%** |
| **`ui/app.tsx`, `main.tsx`** | | **0%** |

Overall lines 81%, branches 94%. Coverage excludes `dialogue-cards` and `card-wording` because they are too slow under instrumentation. `session.tsx`, `home.tsx`, `practice.tsx`, `teach.tsx`, `scene.tsx`, `onboarding.tsx` are all at 0% unit coverage and reached only by three Playwright specs.

### 2.8 Engine and tagger

Measured against ground truth I wrote by hand.

- **Conjugation: 162 of 162 correct** across irregular preterites, -ir stem changes, orthographic changes, reflexive and clitic imperatives, compound participle families, RAE 2010 monosyllables. I had first marked `sonrió` as wrong; the engine is right and I was not. Twelve verbs I tried are absent from the 1,265 in the list: errar, maldecir, esparcir, delinquir, lucir, mecer, rehacer, inquirir, aullar, gruñir, bullir, tañer.
- **Analyser: 30 of 35.** Misses: `vámonos`, `sentémonos` (no reading at all); `yerro` (verb absent); `comprándolo`, `diciéndomelo` (analyser only; the tagger handles these through its enclitic rule).
- **Tagger: 85 hard sentences, about one in six with a flaw, and I chose them to break it.** All of the common traps came out right: como, fue, vino, cuando + subjunctive vs indicative, aunque both ways, every `se` type, si-clauses, reported commands, future of conjecture. Flaws are in P10. Almost all of them over-require, which is the safe direction for gating.

---

## 3. Specific problems

Ordered by severity.

### Critical

#### P1. An interrupted lesson permanently loses what it presented

**Locus.** `ui/blocks/teach.tsx:81` (`run.present(block.node)` on mount), `:30`; `runner.ts:329` to `:336`; `runner.ts:536` `abandon`; `learner.ts:361`; `compile.ts:398`, `:723`.

**Evidence.** `present` calls `learner.introduce` as soon as a block opens, which creates a record with `learning: { steps: [] }` and no FSRS card. Only `finish()` and `stop()` hand such nodes to the scheduler. `abandon()` does not, closing the tab does not, and no sweep exists. Measured with real content: u07 day 0, `g:hay-vs-esta`.

```
plan introduce unit u07 day 0 grammar [ 'g:hay-vs-esta' ] blocks warmup,learn,teach,read,personal,recap,close
after opening the lesson: introduced true learning true has card false
next day: type introduce converted undefined grammar [] teach block false blocks warmup,learn,read,recap,close
node still learning true has card false due list has it false
never due in 40 days
```

**Learner consequence.** The learner opens today's grammar lesson, reads the hook, takes a phone call and comes back tomorrow, or after three hours, or taps "Start over". The lesson is gone. It does not reappear, because the compiler treats any introduced node as known (`grammarCandidates` filters on `this.known`). It never comes up for review, because it has no card. Every sentence requiring it is now admissible, so they meet the grammar untaught in drills. The same happens to each new word that was presented and not finished. This is the most ordinary interruption there is, and it is silent. The existing test (`tests/ui/session.test.ts:192`) asserts only the ledger and the path, and the simulator does not model abandoning a session.

**Fix.** Two parts. Make the introduction transactional: when no resumable session exists, sweep nodes with `learning` set. Nodes with no steps are removed so they are taught again (a new `Learner.forgetUnstarted`). Nodes with steps go through `completeIntroduction`, which rates them from the steps they had. Call the sweep from `UiStore.clearSession` and at the top of `compilePlan`. Add a simulator profile that abandons 10% of sessions at a random block, plus a property test: after any abandon, every introduced node either has a card or is being learned inside a resumable session. Cost: small.

#### P2. Saved progress has no link to the course it was saved against

**Locus.** `compiler/types.ts:141` (`PathState.unit`, `.day` are integer indexes), `learner/state.ts` (`nodes` and `ledger` keyed by content ids), `store/ui.ts:143` (`SavedSession.plan`). No content version exists anywhere. `tools/reseq/` is sitting untracked at the repo root.

**Evidence.** Measured against a saved 215-day learner at u18 day 2:

```
1 rename c:buen-viaje: bare orphan card {"type":"read","ask":"Remember this one?","es":"buen viaje","en":"buen viaje"}
2 a day inserted at the start of the learner's unit: the learner's day index 2 now means day type drill, was introduce
3 new grammar in a passed unit: teachPos 133, learner day pos 165, known by learner false
  rows that now require the new node and can never be admitted for this learner: 200   pathAfter owes it? false
4 ledger keyed by positional id, e.g. u01-0001
```

**Learner consequence.** The deployed app rebuilds from this repo. If a learner is on it and a unit is reordered, `path.unit` silently points at a different unit. Insert a day and they skip one or repeat one. Move a grammar node before their position and they are never taught it, are never owed it, and every sentence requiring it disappears from their supply for good. Rename a node and they get an orphan: a read card whose English is a slug. Regenerate a bank file and the ledger says they have seen sentences they have not, because ids are positional. No error appears at any point. This report and its siblings will almost certainly recommend re-sequencing, so this has to land first.

**Fix.**
1. Emit `content/_manifest.json` at build with `contentVersion`, and store the version in `PathState` and in `SavedSession`.
2. Store position as stable keys: `{ unitId, dayKey }`, where each day gets a stable `key` in `Unit.days`. Keep integers as a derived cache.
3. Add `content/_migrations/NNNN.json`, a content migration table of `{ rename: {old: new}, remove: [...], split: {...} }`, applied to `nodes`, `ledger`, `path.owedNew`, `pendingDrills`, `recentGrammar`, `remediate`, with the same "never edit a shipped one" rule as `MIGRATIONS`.
4. Add a `reconcile(learner, course)` pass after migrations: any node whose `teachPos` is at or before the learner's position and which is not introduced becomes owed. Any orphan node with no migration is suspended, not shown.
5. Give bank rows content-hash ids, or at least assert in the gate that an existing id never changes its `es`.
6. Have the gate compare against the last shipped manifest and fail if an id vanishes without a migration entry.

Cost: medium. It is the prerequisite for all curriculum work.

#### P3. One failed write silently ends saving, then hangs the session

**Locus.** `learner.ts:185` (`this.saving = this.saving.then(...)`), `:204`, `runner.ts:510`, `session.tsx:100`.

**Evidence.** The promise chain has no catch. A single rejected `store.save` leaves `saving` rejected forever and `saveQueued` stuck at true, so later `.then` callbacks never run. Measured with a store that throws once, then works:

```
saves after recovery 2 (a healthy store would be saves+1)
flush REJECTS: quota
commit REJECTS: quota
exposures in memory 3 on disk 0
```

**Learner consequence.** A transient IndexedDB failure, which can be `QuotaExceededError`, an aborted transaction or a private window, means nothing else is saved. The learner keeps answering for twenty minutes. At the end `commit` rejects, `toClose` throws unhandled, and the screen stays on "Saving…" forever (`session.tsx:161`). They reload and the whole session is gone. There is no global error handler or error boundary either.

**Fix.** Catch inside the chain, reset `saveQueued`, keep `dirty` true, and retry with backoff. Surface a quiet non-blocking line ("Couldn't save just now. Keep going, we'll try again."). In `toClose`, catch and offer retry. Add a `storage` failure test to `persistence.test.ts`. Cost: small.

### High

#### P4. Progress lives on one device with no backup

**Locus.** `screens/settings.tsx` offers only "Deletes your progress on this device". A search for `Blob`, `createObjectURL` and `navigator.share` in `src` finds nothing. `app.tsx:46` asks for `storage.persist()` and ignores the answer.

**Consequence.** A year of learning, in a browser store, with no way out. Clearing site data, a new phone, or Safari's documented eviction of script-writable storage for sites not added to the home screen ends it. I did not test eviction on a device. A two-year learning record with no way to export it is not acceptable.

**Fix.** Settings gets "Save a backup" and "Restore a backup": one JSON file of state, events, path and ui, stamped with versions and run through the existing migrations on import. Show a gentle prompt once a month, and a line on Home if `persist()` was refused. This needs no server, so it respects the no-AI, offline stance. Cost: small.

#### P5. Missing content fails silently, and the path still advances

**Locus.** `ui/data/loader.ts:105` (`read` swallows errors), `:137` (`this.loaded.add(p)` before the read, so a failed path is never retried), `compile.ts:853` (no script: teach anyway), `app.tsx:45`. `.problems` is never read outside the loader.

**Evidence.** Measured. Learner cached u16 to u21, offline, path moved to u22 onward:

```
u22 d0 introduce => introduce advances true blocks warmup,learn,teach(NO SCRIPT),read,recap,close newG g:subj-wishes {"bareReview":14,"prereq":1,"shortage":3}
u22 d1 drill => drill advances true est 13.7 {"throttle":1,"bareReview":20,"shortage":5}
u22 d2 introduce => introduce advances true blocks warmup,teach(script),read,personal,recap,close newG g:negative-commands {"bareReview":26}
u22 d4 input => review advances false {"bareReview":69}
```

The real browser run agreed: Home showed "New: what or which: ¿qué? vs ¿cuál?" and a normal Start button, and the warm-up was 26 bare word cards. The only trace is `net::ERR_FAILED` in the console. The learner is told nothing.

**Learner consequence.** On a long trip, or on any flaky fetch at boot, grammar is marked taught with no lesson (the fallback shows the node's one example line, then "You've seen how it works. Now try it."), and the day is consumed. `reason: 'shortage'` deliberately advances the path, which was designed for gaps in authoring, not for a download that failed. In this state P1's consequences apply too.

The offline e2e test does not cover this, because it runs on `?fixtures=force`. `vite.config.ts` precaches only the first four units, and the comment in `main.tsx:6` ("precaches the whole build, every content chunk included") is no longer true.

**Fix.**
1. Do not claim a path until it has loaded, and retry on the next `ensureWindow`.
2. Give the compiler an honest input: `content.coverage(unitIndex)`. When the current unit's files are not all present, return a `needsContent` plan: reviews only, no introduce, no advance.
3. Show one human line: "The next lessons need a connection. Today is review."
4. Prefetch more aggressively in the background on good connections, and offer "Download the whole course (45 MB)" in Settings, which the owner's offline promise implies.
5. Add `ExpirationPlugin` to `fluidez-content`. It has none, so every content change leaves orphaned chunks in the cache forever.
6. Run the offline e2e on real content, past the window.

Cost: medium.

#### P6. Every answer rewrites the whole learner

**Locus.** `learner.ts:181` `touch`, `store.ts:81` `save`, `ledger.ts:17`. Measurements in 2.3 and 2.4.

**Consequence.** After a year, a mid-range phone stalls for about 0.7 s around every answer. After two years, 1.3 s, with a 600 ms freeze on the tap. A course whose whole promise is two years of daily practice gets slower exactly for the people who stayed. Any fast game is unplayable on top of this. `learner.events()` also deep-clones the whole log on Home (`home.tsx:38`), in the render body of Progress (`progress.tsx:25`), twice on Weak (`weak.tsx:26`, `:29`) and at the close screen (`writing.tsx:157`).

**Fix.** This is the one real structural change this report recommends, and the seam is already narrow, because `Learner` is the only owner of state and `LearnerStore` is a small interface.

- Replace idb-keyval's single store with object stores: `nodes` (one record per node), `ledger` (one record per unit bucket of seen ids), `events` (append-only with an auto-increment key), `meta` (settings, session, timing, path, ui).
- Writes become one record per mutation. `commit` stays one transaction.
- Shrink first, as that gets most of the benefit in a day: keep only `wt:` keys in the `item` ledger, compress `views` to `{ first, last, n, allReview }` (chapters keep their views), write exposure events once per item rather than once per node, and drop `state.prev` in favour of the backup in P4. Together these cut the state document by roughly 60% by my estimate, before any store split.
- `events()` becomes `eventsSince(t)` with no clone.

Cost: small for the shrink, medium for the split, plus one state migration (v2 to v3).

#### P7. The simulator validates a content index the browser never has

**Locus.** `tools/simulate.ts:72` uses `buildContentIndex` over the whole corpus. `loader.ts:84` loads 2 units before and 3 after the current one.

**Evidence.** Measured, same learner, same day, compiled both ways:

| Day | Unit | Bare reviews, full index | Bare reviews, browser window |
|---:|---:|---:|---:|
| 194 | 15 | 7 | 17 |
| 251 | 19 | 14 | 47 |
| 285 | 21 | 14 | 38 |
| 362 | 28 | 5 | 27 |
| 546 | 41 | 10 | 33 |
| 651 | 50 | 9 | 27 |

**Consequence.** A bare review drops the sentence context and asks for a word or chunk alone. The design says review in unseen sentences, and the simulator's quotas and reports all assume it, but real learners get two to five times as many bare cards in late sessions, because the old node's sentences live in units that are not loaded. Also, `compileSession` is documented as a pure function of its input, but its input changes with what this tab has happened to load: open Practice, and `extend` grows the index, so the next plan differs. The determinism promise holds only per loaded window.

**Fix.** Build a small per-node index at build time, `content/index/byNode/<kind>.json`, mapping node to a capped list of sentence ids with their `requires`. The compiler then chooses from all units, and the runtime fetches only the rows it needs. If that is too large, cap at 40 rows per node. Run the simulator through the same loader path so sim and browser can never differ. Cost: medium.

#### P8. Valid Spanish is marked wrong, and one bug is a single character

**Locus.** `exercises/spanish.ts:245` and `:248`; `check/translate/canon.ts`; `content/bank` `accept`.

**Evidence.** `splitEnclitic` skips when `w.length <= c1.length + 2`. So `irme`, `irte`, `irse` and `irnos` never split, and the clitic-climbing rule never fires for the verb `ir`. Measured:

```
Tengo que irme. => tengo que irme
Me tengo que ir => me tengo que ir      (different keys: rejected, hint extra-word)
Tengo que verlo => lo tengo que ver
Lo tengo que ver => lo tengo que ver    (same key: passes)
```

105 bank rows contain these forms. Beyond that, 21 valid paraphrases against the matcher: 4 passed, 17 failed. Failures that are purely mechanical:

| Model | Learner's valid answer | Result |
|---|---|---|
| Cuando llegue, te llamo. | Te llamo cuando llegue | word-order |
| Si tengo tiempo, voy. | Voy si tengo tiempo | word-order |
| Voy al trabajo en bus. | Voy en bus al trabajo | word-order |
| Le di el libro a Juan. | Le di a Juan el libro | word-order |
| Me gusta el café. | A mí me gusta el café | extra-word |
| Me duele la cabeza. | La cabeza me duele | word-order |

Failures that need data: "¿Cuál es tu nombre?" for "¿Cómo te llamas?", "Tengo que comprar leche" for "Necesito comprar leche", "¿Qué horas son?". `accept` is filled on **1,014 of 72,693 rows (1.4%)**, and `acceptEn` on 90. The matcher takes 0.10 ms median and 0.22 ms at p95, so there is a great deal of budget for more variants.

**Learner consequence.** "Not yet. Word order." on correct Spanish teaches a false rule, and it is the worst thing a checker can do to someone trying to build sentences independently. It hits hardest at B1 and above, where the learner has real choices.

**Fix.** Change `<=` to `<` now. Add four mechanical freedoms to `canon`: subordinate clause order around `cuando`, `si`, `aunque`, `porque`; order of two post-verbal constituents; subject after an unaccusative or `gustar`-type verb; optional `a mí`, `a ti` doubling. Each comes with negatives, as the file's FREE and NOT FREE header already demands. Then do the data layer described in section 5.

#### P9. The test run is red by exit code, and logic is tested far better than behaviour

**Locus.** `tests/ui/dialogue-cards.test.ts:45`, `tests/ui/card-wording.test.ts`. `vite.config.ts` `testTimeout`. No `.github/workflows` on this branch.

**Evidence.** Run alone, with all 5 tests passing:

```
Test Files  1 passed (1)   Tests  5 passed (5)   Errors  1 error
EXIT 1
Error: [vitest-worker]: Timeout calling "onTaskUpdate"
```

**Does the error matter? Yes, as a signal and as a practical fact.** It is not a flaky harness. The test holds the worker's event loop in a synchronous loop for over 60 seconds, so Vitest's RPC heartbeat times out. Vitest counts that as an unhandled error, and `vitest run` exits 1 even with every test green. In my full run the same test also passed its own 120-second limit (135 s) and failed outright. So `npm test` cannot currently be used as a gate, and its root cause is the production O(bank) scan in P11. The test's own comment says so: "a translate card scans the whole bank". Fix the scan and both the flake and the error go away.

What the 2,668 tests do not cover:
- anything interrupted: abandon followed by a later session, tab close, resume after the window lapses (P1)
- a failing store, quota, or a corrupted document (P3, P12)
- two tabs (P13)
- saved state against changed content (P2)
- offline on real content, or plans compiled against the window (P5, P7)
- any performance budget (P6, P11)
- accessibility
- the session screen, block routing, onboarding and practice UI at unit level, which are at 0%

More than half the tests (1,422 of 2,668) are tagger cases, which is valuable but says little about learner journeys. The 54 compiler tests cover the rules well. The simulator smoke test is synthetic, not real content. This repo has no CI on `rebuild`, so tests and gate run only when someone remembers. I could not inspect the workflow in the `fluidez-next` repo that builds the deployed app.

**Fix.** After P11, add CI on push (typecheck, tests, gate, build). Add a performance budget test: a saved 2-year fixture must save in under N ms and build a card in under N ms. Add a small set of Preact component tests with `@testing-library/preact` for Session, Teach and CardView, to cover the state machines rather than the look. Cost: small to medium.

### Medium

#### P10. The gate's 6,802 warnings hide the ones that matter

**Evidence.** The numbers in the brief (requires 735, legality 700, tagger 148, dupe 66) understate the truth, because `render` in `tools/gate/findings.ts` prints at most 40 lines per file. Uncapped, from `runGate()`:

| Check | Count | What they are | Verdict |
|---|---:|---|---|
| legality "looks like a pattern" | 3,747 | A pattern meets the learner before its lesson. Bank 2,503, scripts 762, story 290, scenes 125, writing 67. | **Noise as warnings.** The code's own comment says this is exposure, not an error. The compiler holds those rows until the pattern is known, so the real effect is supply: **4,401 rows (6.1%)** cannot be served in their own unit. Report it as one supply number. |
| requires "target not in sentence" | 1,369 | 70 semantic nodes the tagger cannot see (`g:conditional-past-guess`, `g:word-order-style`, `g:absolute-constructions`) | **Noise**, with real defects inside. Most sampled rows are right ("Hecho el pago, le enviaremos el recibo."). Some are not: "Mientras Mariana hablaba, yo miraba el celular." targets `g:cuando-indicative`, and there is no cuando in it. Mark these nodes `detectable: false` and review their rows by model once. |
| tagger unknown word | 728 | 268 distinct words | **Real, cheap.** Diminutives (momentico, ratico, tintico) need a rule. Real gaps: pereza, pepino, poncho. Verbs missing from the engine: rectificó, insinuó, dañó, empeñó, encareció, conformó. |
| tagger subjunctive, no trigger | 250+ | | **Mostly a tagger gap**, correct Spanish in the rows sampled |
| dupe | 213 | Jaccard 0.5, mostly a sentence and its longer version | **Noise at 0.5.** Raise the threshold. |
| balance | 179 | Story answers lean on one option | **Pure noise.** `questionCard` already shuffles at runtime (`cards.ts:765`). |
| daySupply | 150 | Too few usable rows or writing tasks on a real day | **Real.** Every one becomes a `shortage` at runtime. |
| dialect same-day perfect | 118 | 106 in u51 and u52, which teach Spanish pasts on purpose; the rest in chapters 172 and 176, and u45 | **Mostly noise.** Exempt taught variety; check the 12 others. |
| dialect Peninsular | 13 | `gafas`, `billete` | **False positives.** `gafas` is normal in Colombia. Fix the list. |
| length | 16 | C1 chapters over the maximum | **Noise.** The owner wants these long. Raise the cap. |
| verbs | 15 | Graph verbs the engine lacks (matizar, adaptarse, prescindir, demoler) | **Real, cheap.** |
| schedule, supply | 3 | | **Real.** |

About 5,900 of the 6,802 are noise for this purpose. About 900 are actionable, and those collapse to roughly 300 distinct fixes, because 728 of them are 268 words. The most serious content finding of all has only one line: "1136 lexeme(s) used but not in the graph". Behind that line:

- **5,687 bank rows (7.8%) require a phantom lexeme**, 918 distinct ids. `unmetRequires` treats any lexeme that is not a graph node as satisfied (`content.ts:265`), so these words are not gated at all.
- **834 rows are plain inflections that should have mapped to a taught lemma**: `l:buena` 336, `l:mala` 105, `l:hermanos` 59, `l:noticias` 52, `l:zapatos` 51, `l:hijos` 47. The gate is blind to these words.
- Real unlisted lemmas: `l:silencio`, `l:calma`, `l:alegrar`, `l:madrugar`. Also junk ids from the letters unit: `l:t`, `l:h`.

Tagger flaws from the hard-sentence check, none learner-visible today, all visible once an "explain" view exists:

- `Vámonos.`, `Sentémonos aquí.`: no command feature at **high** confidence, against the file's own "never silently pass" rule. Only 6 rows are affected.
- `Habrá comida para todos.`: read as `g:future-perfect` plus `l:comer`, because `comida` is treated as a participle.
- `Hubo una fiesta.`: mapped to `g:imperfect-states`.
- `Debe de estar en casa.`: mapped to `g:tener-que-hay-que`, though it is conjecture.
- Spurious features: `conn.cause` on "Como no vengas", `prep.por` and `comp.mas-que` on "Por más que", `comp.mas-que` on "Más vale".
- `c:a-cuantas-cuotas` falsely required on 137 rows ("Compramos el café a una señora de Huila.").

**Fix.** Sort warnings into three explicit classes: `defect` (shown), `supply` (one summary table), `advisory` (hidden unless `--all`). Add the `detectable` flag, and make phantom rows a counted metric that must fall.

#### P11. Card building and free practice scale with the corpus

Section 2.5 has the numbers. Extrapolating to 6x, a translate card with all units loaded costs about 800 ms, and `useOrdered` builds a whole block at once. Practice's `ensureFor` (`practice.tsx:27`) loads every unit up to the learner's position just to run Quick review: 2.9 to 3.2 s and a 518 MB heap on a two-year learner. A phone tab under memory pressure is a real risk.

**Fix.** Precompute on `Bundle`: `Map<normEn, ids>` for `corpusAlternatives`, per-unit distractor pools, and lazy card building, one at a time. Quick review should load only the units its queue touches, using the P7 index. Cost: small.

#### P12. Corrupted or newer documents brick the app

`UiStore.load` quarantines bad documents, but `Learner.open` does not. `migrate` throws into `App`'s catch and shows `learner state v3 is newer than this build (v2)` to the learner, with "Try again" as the only way out (`app.tsx:91`). `Learner.open` also casts the event log without checking its shape, and the log has no version at all. `state.prev` is only tried when `state` is absent, not when it fails to migrate. There are four independent version counters (state 2, path 2, ui 3, session 1), and no error boundary anywhere, so an exception in render, such as an unguarded `compilePlan` in `session.tsx:27`, gives a blank page mid-lesson. Home guards the same call with try/catch.

**Fix.** Validate persisted documents with a small hand-written guard, quarantine in `Learner.open`, fall back to `state.prev` on migration failure, version the log, and add one error boundary around `body` that offers Home and a backup download.

#### P13. Two tabs overwrite each other

`src` has no `BroadcastChannel` or `navigator.locks`. Each tab holds the whole state in memory and writes it whole. An installed PWA plus a browser tab, or simply a forgotten tab, loses a session to last-writer-wins. Writes become per-record under P6, which helps but does not solve it. **Fix:** take a `navigator.locks` lease per session and show "Fluidez is open elsewhere" in the other tab.

#### P14. Layering

Measured: no file-level import cycles, which is a real credit. Three issues remain.

- `learner/weak.ts` imports `ui/session/tenses.ts` and `practice-spec.ts`: the only upward import from the core.
- `src/ui/session/` holds 2,287 lines of pure domain logic with no Preact in it: cards, freeplay, placement, attribution, recap. Its name hides that.
- `exercises` and `check` import each other at folder level (8 and 4 edges).

**Hand-synced op lists are the real hazard.** Adding an op means updating lists that TypeScript cannot check: `stepLadder` in `runner.ts:356` and again in `tools/sim/run.ts:246`, `FORM` and `FREE_FORM` in `weak.ts:39`, `LOCATED` in `card.tsx:20`, `truncatable`, `softBlock`. `ReviewEvent.op` is a plain `string`, and `servedRefs` ends in `default: break`, so a new block kind compiles and silently is not ledgered, unlike `BlockView`, which is exhaustive. `gap` is absent from `FORM` in `weak.ts`, so misses on gap items never reach weak spots; that looks accidental. `tools/sim/run.ts` also re-implements the runner's scoring in 628 lines, which is how the simulator and app can drift apart.

#### P15. Accessibility

Checked in code. I did not test with a screen reader.

Good: `lang` is set on every Spanish string; a skip link exists; `aria-live` is on feedback; `:focus-visible` is styled; `.sr-only` exists; tap targets are 48 px. Contrast, computed from the tokens, passes AA for all text pairs in both themes. The lowest are `focus` on `bg` at 4.97 (light) and `muted` on `hintsoft` at 5.57 (dark).

Defects:

- `--line` on surface is **1.42:1 (light), 1.38:1 (dark)**. It is the input and option border, and WCAG 1.4.11 asks for 3:1 on component boundaries.
- `data-autofocus` on `Heading` (`text.tsx:92`) is read by nothing, so `tabIndex={-1}` is inert and focus is not moved to the new block when a block has no input. A screen-reader user is not told the block changed.
- The story reader makes **every word a `<button>`** (`read.tsx:92`). A 400-word C1 chapter is 400 tab stops and is read aloud as a list of buttons. It needs one tab stop, arrow keys inside it, and the plain text available to assistive technology.
- `Leave this session?` is `aria-modal` with no focus trap, no Escape and no focus return.
- The goal picker uses `role="radio"` on buttons with no arrow-key handling.
- `Heading` is `<h2>` and no screen in normal use has an `<h1>`.
- `prefers-reduced-motion` only covers the progress bar. That is the only transition in the file, so it is complete today.
- Body text is a fixed `18px`, so the browser's text-size preference is ignored.

#### P16. Service worker details

- `fluidez-content` has no expiration (P5).
- `registerType: 'prompt'` with no `clientsClaim`, so on the first ever visit the page is uncontrolled. From reading the config, a placed learner's first window is fetched before the worker controls the page and is only cached on a later visit. I did not measure that first visit in isolation.
- An old tab after a deploy points at chunk names GitHub Pages no longer serves, and the failure drops into P5's silent path.

**Fix.** `clientsClaim`, or call `ensureWindow` once `controllerchange` fires; handle `vite:preloadError`-style chunk failures by prompting for the update.

### Low

- **P17. Dead code.** Exports nothing uses: `delayedAccuracy28d`, `weakestNodes`, `patternFeatures`. Used by tests only: `findVerb`, `tagText`, `UiStore.sessionFinished`. `delayedAccuracy` duplicates `delayedCounts` line for line; `productionShare` duplicates `productionCounts`. `records()` is copied in `loader.ts` and `tools/sim/load.ts`. The `reading` ledger kind has zero entries. `ledger.seenBetween` has no caller outside its type. `lines()` and `undash()` still do runtime dash removal for content that the gate now keeps clean; retain them as a safety net or remove them deliberately. Stale comment: `main.tsx:6`.
- **P18. Two meanings of "day".** `learner.day()` rolls over at 04:00, while `localDayKey` in `store/ui.ts:283` rolls at midnight, so words read at 1 a.m. land on a different day from the session. Several writes use `Date.now()` rather than the injected clock (`blocks/practice.tsx:58`, `blocks/writing.tsx:60`, `:115`, `blocks/read.tsx:51`), which complicates tests.
- **P19. Type-safety holes.** Better than most codebases: only 18 `any` or unchecked casts in `src`, 8 of them in migrations. The holes:
  - `noUncheckedIndexedAccess` is off, with about 85 non-null assertions.
  - `NodeId` is an unbranded `string`.
  - `tools/curriculum` is excluded from `tsc`.
  - `Scene.turns[].require` and `WritingTask.constraints` are `record<string, unknown>` while `check/writing.ts` has a real `Constraint` type, so a typo in a constraint is a silent no-op unless the gate catches it.
  - `compile.ts:802` builds a fake plan with `as unknown as SessionPlan`.
  - `ReviewEvent.op` and hint kinds are strings.
- **P20. Runtime zod.** It adds 246 KB of rendered code and parses every row on the main thread for content the gate guarantees. Keeping a light shape check for corrupted chunks is fine; the full schema parse is not needed at runtime. Saves roughly 60 KB gzip and part of the boot cost. The glob map (305 KB) could become one small manifest file.

---

## 4. What the application does well and must be preserved

- **The compiler as a pure function of inputs.** A plan is plain JSON, can be logged and diffed, and can be replayed, resumed and simulated. This is the best decision in the codebase, and every capability in section 5 leans on it. Keep `compileSession` pure.
- **`Learner` as sole owner of state.** The mutation surface is small and well named. It is why the storage fix in P6 is feasible.
- **Evidence-based attribution.** `attribute.ts`'s rule that a miss which cannot be pinned on one node stays a miss, "never a free pass", is honest engineering. Keep it, and keep `creditSentence`'s bounded partial credit.
- **The engine.** 162 of 162. Rule-based morphology with stored exceptions and the RAE 2010 handling is right. Do not disturb it.
- **The tagger's direction of failure.** It over-requires, and `confidence: 'low'` is used honestly in all but the case in P10. The separation of detectors from `nodemap.ts` lets the curriculum be re-cut without touching detection.
- **The gate as a contract with generators.** One-line findings, usable as a fix prompt, with `requires` computed and never hand-written. The burn works because of this. It needs triage, not replacement.
- **Exhaustiveness on `Block` in `BlockView`**, and "every card carries its own checker and one reason". The `Card` type is a good boundary. Note its limit in section 5: it is the UI vocabulary and new card shapes must be added to it.
- **Migrations policy.** "Never edit a shipped migration", quarantine on `ui` and `path`, and atomic `saveAll` for session end. This is the right instinct; it only needs extending to content and the learner document.
- **No file-level import cycles** in 20,800 lines built largely by agents at speed. That is rare.
- **Session resume**, including saving the cursor per card. It works, and it is exactly what makes P1 a small fix rather than a redesign.
- **Semantic HTML, `lang` on Spanish, token-driven colour**, dark mode, and no hand-rolled ARIA where a native control works.

---

## 5. Missing capabilities

For each: what is easy, what is hard, what must change first.

### New exercise types

| Type | Easy | Hard | First |
|---|---|---|---|
| Error correction | It is a `TypeCard`. `matchTranslation` already checks the answer. | Plausible errors. Use `reinflect` for wrong person or tense and `diagnose` categories. Never show a corrupted sentence without a reveal. | Op registry |
| Word ordering | Tiles from `tokenize`; check by joining tiles and calling `matchTranslation`, so every order the matcher accepts is right. | Needs a new card shape, a11y for tile reordering, and sentences with one sensible order. | New `Card` member |
| Sentence building | Same tile view, with distractor tiles. | Distractors must never make a valid sentence. Verify each candidate with the matcher. | Word ordering done first |
| Conjugation tables | `conjugate` is complete; `conjugationCard` is one cell. | One card, many answers. Grading fits exposure (`grind`), not one FSRS grade. | Multi-field card; keep as exposure |

### A games layer that grades real FSRS cards

- **Easy:** `Freeplay` is already the pattern, a runner independent of the compiler that yields cards and takes outcomes. `planQuick` already picks at-risk cards. A game is a `Card` source with a different view.
- **Hard:** the grading policy. A 900 ms tap on a match pair is not the same evidence as a typed recall, so it must not be `Good`. Make an explicit `EvidenceStrength` per op, where only production-strength attempts on cards that are actually due count as FSRS reviews, and everything else is `expose`. `ms` from games must not go into `recordTime`, or `secondsPerReview` and all compiler budgets drift. Early reviews of cards not yet due earn little and can mislead stability.
- **First:** P6, otherwise 60 answers a minute means 60 full saves. P11, so that a game can fetch sentences for arbitrary nodes without loading the course. The `Attempt` seam in section 6.

### "Explain this sentence" from the tagger

- **Easy:** `TagResult` already has `features` with token spans and `tokens` with lemmas, and `tagger/index.ts` is tree-shaken out of the app today.
- **Hard:** precision. Gating fails safe, explaining does not: `Habrá comida` as future perfect would be shown to a learner as fact. The features need a precision pass first, and the feature-to-human mapping needs writing, since `nodemap` deliberately collapses keys.
- **Design:** do it at build time. Do not ship the tagger (forms.json 238 KB, lexicon 82 KB, about 3,300 lines). Write `content/explain/uNN.json`, one per unit, of `{ id: [[start, end, node]] }`, fetched on tap, which I estimate at about 150 bytes per row, so 11 MB raw and 2 MB gzip for the course. It must be regenerated by the gate so it cannot go stale.
- **First:** the P10 precision fixes; make prompt text tappable, since today only the story reader has tap-to-gloss.

### Per-learner error fingerprint

- **Easy:** the checker already computes it. `diagnose` returns a `hintKind` (`ser-estar`, `por-para`, `verb-ending`, `agreement`, `article`, `pronoun`, `word-order`), and `Check` carries it to `TypeView`, where it is **thrown away**: `Outcome` has no field for it, and `ReviewEvent` has none either. Options picked and `feature` on MCQs are only in `Evidence`, which is in memory and used for attribution, then lost. The first typed attempt is lost too.
- **Change:** add `err?: HintKind`, `feature?: Feature`, `first?: string` to `Outcome`, and record them. About 30 lines in 4 files. Keep a rollup `fingerprint: Record<kind, { n, miss, last }>` in state so it survives the 365-day compaction. Feed the top kinds into `path.remediate`, which `shakyNodes` already serves from.
- **Hard:** mapping a kind to the node that fixes it (`agreement` to which grammar node?) and honouring the standing decision that free-form misses are a signal only.
- **First:** version the event log (P12).

### Per-sentence paraphrase acceptance at scale

- **Easy:** the schema has `accept`; `expandAccepted` uses it; the gate already lints `accept[n]` for legality (186 of the legality warnings are on `accept` strings); the matcher has budget (0.1 ms).
- **Hard:** at 72,693 rows it needs a burn job, not an authoring pass. Generate 2 to 5 alternatives per production-eligible row at build time, gate each one: every alternative must be natural Spanish, must carry the same meaning, must have its tagger `requires` inside what the row's position allows, and must pass dialect. The owner's rule that the English is the exact translation of the expected Spanish is untouched, because `accept` only widens what passes; what is shown stays the model.
- **Size:** about 1 MB gzip more bank if done for all rows.
- **First:** mechanical `canon` freedoms (P8), because they remove whole classes of `accept` entries. Also an index for `corpusAlternatives`.

### Adaptive pacing

- **Easy:** adding repetition. `decide()` is one function, and a non-advancing session is a first-class idea (`advances: false`, `converted`). Extra drill on weak nodes is a day's work. `secondsPerReview` is already measured.
- **Hard:** going faster. `path` is a fixed `(unit, day)` tuple, and skipping days needs multi-day owed accounting that `pathAfter` does only for one day. All caps are module constants in `budget.ts`.
- **First:** turn `budget.ts` constants into a `Policy` value passed in `CompileInput`, defaulted from today's numbers. Pacing then only computes a `Policy` from history, and the simulator can test it. Keep it deterministic. Stable position keys (P2) make skipping safe.

### A mastery model

- **Easy:** a pure function of `NodeRecord` and events. `isLearned`, `rung`, `novelPasses`, `exposures`, `delayedCounts` all exist. `remediate.ts` already reads `serves`, the node to can-do link.
- **Hard:** the evidence is not rich enough. Reviews are not tagged by how demanding they were, and rungs move on exposure events. Grammar stability is driven by sentences where failure might be vocabulary, and `lastWeekCameBack`-style measures need the event log that is pruned at a year.
- **Design:** `mastery(node) = { stage: met | recognises | produces-cued | produces-free | retained, evidence }`, with per-stage rollups stored on `NodeRecord` so they survive compaction, and `can-do = min over serves`.
- **First:** op evidence strength (the same table as games), and the error fingerprint.

---

## 6. Recommended improvements

### How a new exercise type is added today

For a new op, for example `reorder`:

1. `src/exercises/types.ts`: add the `Item` kind.
2. `src/exercises/<generator>.ts`: the generator.
3. `src/exercises/index.ts`: exports and the `checkItem` switch (exhaustive, so the compiler helps).
4. `src/compiler/types.ts`: add to `PracticeOp`.
5. `src/compiler/budget.ts`: `SECONDS` entry.
6. `src/compiler/compile.ts`: `LADDER_OPS`, or an ops array in `drill`, `remix` or `patternsDay`.
7. `src/ui/session/cards.ts`: the `practiceCard` case (exhaustive), and a new `Card` member if the shape is new.
8. `src/ui/components/card.tsx`: the view and the `CardView` switch.
9. `src/ui/session/order.ts`: `formatOf`.
10. `src/ui/session/runner.ts`: the `stepLadder` allowlist. **Not checked by the compiler.**
11. `tools/sim/run.ts`: the duplicate `stepLadder`. **Not checked.**
12. `src/learner/weak.ts`: `FORM` or `FREE_FORM`. **Not checked; forgetting silently drops its misses.**
13. `src/ui/session/freeplay.ts`: `opAt`, if drills should use it.
14. Tests in `tests/exercises`, `tests/ui`, and possibly `tests/compiler`.

That is 13 source files and 3 test folders. Steps 10 to 12 fail silently.

### Seams worth cleaning before a parallel effort

One owner, mechanical, no behaviour change, about two days in total, verified by the existing tests:

1. **Op registry.** `src/exercises/ops.ts` with one record per op: `{ seconds, ladder, evidence, weakClass, build }`. `SECONDS`, `stepLadder`, `FORM`, `FREE_FORM` and `LOCATED` all derive from it. Steps 5, 10, 11, 12 disappear, and adding an op becomes one registry entry and one card builder.
2. **Split `cards.ts`** into `src/session/cards/{review,learn,script,practice,recombine,story,recall}.ts`, with `index.ts` re-exporting. Distractors go in their own module. New ops become new files, so they do not conflict.
3. **Split `compile.ts`** along its existing section comments: `reviews.ts`, `select.ts`, `new-items.ts`, `days/{introduce,drill,input,patterns,output,checkpoint,review,minimum}.ts`, `path.ts`, `served.ts`. Turn the class's private fields into a `Ctx` object. `compile.ts` stays as the orchestrator of about 200 lines, and `compileSession` is unchanged.
4. **Attempt seam.** A single `scoreAttempt(item, outcome, learner)` used by the runner, Freeplay and the simulator. It removes the 628-line simulator's copy of the scoring and gives one place for evidence strength and error logging.
5. **Move `src/ui/session/*` with no Preact to `src/session/`**, and fix the `learner/weak.ts` upward import by moving `tenses` to `engine` or `session`.
6. **Make `servedRefs` exhaustive**, and make `ReviewEvent.op` a union.
7. **Bundle indexes.** Precompute `alternativesFor` and distractor pools.

Not recommended: any framework change, moving away from Preact, moving off IndexedDB, a backend, a state library, or rewriting the compiler. The architecture is sound.

### File-ownership map for parallel work

After the seams above. "Lane" means one agent or one person at a time.

| Lane | Files | Concurrency |
|---|---|---|
| Storage and persistence | `learner/store.ts`, `state.ts`, `ledger.ts`, `events.ts`, `ui/store/ui.ts` | **One owner.** A shared migration number. |
| Learner model | `learner/learner.ts`, `policy.ts`, `scheduler.ts`, `metrics.ts`, `weak.ts` | One owner, coordinates with storage |
| Compiler orchestration | `compiler/compile.ts`, `types.ts`, `budget.ts` | **Bottleneck.** One owner, small merges, rebase often |
| Compiler day types | `compiler/days/*.ts` | Parallel, one file per lane |
| Op registry | `exercises/ops.ts` | **Bottleneck** but one-line additions; append-only, conflicts are trivial |
| Exercise generators | `exercises/<new>.ts` | Fully parallel |
| Card builders | `session/cards/<family>.ts`, new op files | Parallel by family |
| Card views | `ui/components/card/<kind>.tsx` (split `card.tsx`) | Parallel by kind |
| Checker | `check/translate/*`, `check/writing.ts` | One owner per file; `canon.ts` is delicate and has one owner |
| Engine | `engine/conjugate.ts`, `verbs.json`, `ortho.ts` | Parallel with everything; `verbs.json` append-only |
| Tagger | `engine/tagger/*` | One owner for `features.ts` (1,213 lines); `nodemap.ts` and lexicon are parallel |
| Gate | `tools/gate/*` | One owner |
| Simulator | `tools/sim/*` | One owner, after the attempt seam |
| Screens | one file under `ui/screens/` | Fully parallel |
| Blocks | one file under `ui/blocks/` | Parallel, except `index.tsx` (a one-line switch) |
| Styles | `styles/app.css` | **Bottleneck.** Split per feature before fan-out, or assign one owner |
| Session runner | `session/runner.ts`, `ui/screens/session.tsx` | **Bottleneck.** One owner |
| Schema | `content/schema.ts` | **Bottleneck.** One owner; change here first, as its header says |
| Content | `content/*`, by unit | Parallel by unit through the burn queue; `graph/*` has one owner, as it affects everyone |
| App shell | `ui/app.tsx`, `ui/context.ts`, `session/labels.ts` | Small, one owner, few changes |

Today, without the seams, `compile.ts`, `cards.ts`, `runner.ts`, `compiler/types.ts`, `schema.ts` and `app.css` would conflict on nearly every feature. Serialise changes to those files.

---

## 7. Uncertainties and limitations

- **Device performance is a proxy.** All browser numbers are Chromium on this laptop, with CPU throttling at 6x and no network cost. I did not run on a real phone or in Safari. The curve's shape is sound, but the absolute milliseconds are not. iPhones will likely do better than 6x and low-end Android worse. IndexedDB write time on flash storage is not represented by throttling.
- **Simulated learners are not real ones.** The history sizes come from the `average` profile, and the simulator does not abandon sessions, take free practice or do checkpoint practice. Real logs will be somewhat larger. The two-year run reached u56, so a whole-course figure is an extrapolation.
- **Eviction and quota.** Safari's storage eviction and the behaviour of `persist()` are from general knowledge, not tested. `navigator.storage.estimate()` returned a figure I do not trust in headless Chromium, so on-disk size in section 2.3 is estimated from JSON length.
- **Tagger accuracy.** 85 sentences is a hand-picked stress sample, not an accuracy estimate. Conjugation was 162 forms, not a full paradigm audit; the parity test covers the old engine in depth.
- **Gate triage** rests on samples of 8 to 14 per class, so the split into 5,900 and 900 is a judgement, not a count. Whether rows that fail the target check are semantically right needs a per-node review, which belongs to the linguistics reports.
- **Paraphrase probe.** 21 valid answers I chose to be plausible. It shows the kinds of failure, not a rate. A third "wrong answer" case in my script was malformed and I discarded it.
- **Coverage** excludes two slow test files, so some card code is a little better covered than reported.
- **Screen-reader experience** was assessed from code, not by running VoiceOver or TalkBack.
- **Not inspected:** the `fluidez-next` deployment repo and its workflow; `tools/burn/cloud.sh` beyond its gate invocation; `tools/queue.ts`; `tools/curriculum`; `tools/vocab`; `tools/supply`; `check/writing.ts` and `check/personal.ts` in depth; `src/exercises/input.ts`, `reinflect.ts`, `english.ts`; most of `engine/tagger/features.ts`; the old app at the repo root. `blocks/scene.tsx`, `writing.tsx` and `screens/reference/*` were only skimmed.
- **Whether real learners exist yet.** The brief says they may. The critical findings assume they do.
- **Limitation of standing decisions.** With no server, backup can only be a file the learner keeps, and there is no cross-device sync. That is a real cost to a two-year course, and it is the owner's call.

---

## 8. Suggested implementation priorities

Cost: S under a day, M a few days, L over a week.

**Stage 0. Stop the damage. Do this first, before any curriculum change or parallel work.**

| # | Item | Cost |
|---:|---|---:|
| 1 | P1: sweep unfinished introductions, property test, simulator abandon profile | S |
| 2 | P3: un-poison the save chain, retry, handle failed close | S |
| 3 | P8: `splitEnclitic` `<=` to `<`, with a test | S |
| 4 | P11: index `corpusAlternatives` and distractors; this also turns `npm test` green (P9) | S |
| 5 | P4: backup and restore file | S |
| 6 | P2: manifest, stable position keys, content migrations, reconcile, gate check on vanished ids | M |
| 7 | P5: honest loader, `needsContent` plan, one human line | M |
| 8 | CI on push: typecheck, tests, gate, build | S |

**Stage 1. Seams, so that many hands can work (section 6). About 2 days, one owner, no behaviour change.**

**Stage 2. Foundations for the long-term learner.**

| # | Item | Cost |
|---:|---|---:|
| 9 | P6 shrink: item ledger, `views`, exposure events, `state.prev` | S |
| 10 | P6 split into per-record stores, state v3 | M |
| 11 | P7: by-node index, simulator on the real loader path | M |
| 12 | P12, P13: guard documents, quarantine, error boundary, locks | S |
| 13 | P10: gate triage, `detectable`, phantom lexeme fix (lemmatise inflections) | M |
| 14 | P15: component borders, focus on block change, story reader, modal focus | M |
| 15 | P9: component tests, performance budget test | M |

**Stage 3. The capabilities, in dependency order.**

| # | Item | Depends on | Cost |
|---:|---|---|---:|
| 16 | P8 mechanical `canon` freedoms | Stage 0 | M |
| 17 | Error fingerprint | Attempt seam, log version | S |
| 18 | Error correction, word ordering, sentence building | Op registry | M each |
| 19 | Paraphrase burn over `accept` | item 16 | L, mostly model time |
| 20 | Mastery model and evidence strength | items 17, 18 | M |
| 21 | Games layer | items 10, 11, 20 | L |
| 22 | Explain this sentence | P10 precision | M |
| 23 | Adaptive pacing via `Policy` | item 20, P2 | M |

The order matters more than the estimates. Items 1 to 8 protect the data of whoever is already learning. Everything after them is safer to ship because of them.
