# The rebuild, mapped for salvage (4 November 2026)

Read-only reconnaissance of `app/` on branch `next`, with small scripts over the content JSON. Test counts come from the docs, not a run.

## 1. Architecture

TypeScript 7, Vite 7, Preact 11, `ts-fsrs`, `idb-keyval`, `zod`, `vite-plugin-pwa`, vitest 3, Playwright. Scripts: `dev`, `test`, `typecheck`, `build` (library, pitfalls, tsc, vite build), `gate`, `library`, `pitfalls`, `shipped`, `simulate`, `golden`, `reconcile`.

`src/` by directory: `engine/` (5.8k lines: `conjugate.ts`, `analyze.ts`, `english.ts`, `ortho.ts`, `verbs.json`, and `tagger/` with `index.ts`, `features.ts` 1231, `nodemap.ts`, `words.ts`, `lexicon.ts`, `patterns.ts`, `dialect.ts`, `accent.ts`, `data/lexicon.json`, `forms.json`); `compiler/` (3.0k: `compile.ts` 1806, `budget.ts`, `content.ts`, `remediate.ts`, `cognate.ts`); `learner/` (2.8k: `learner.ts` FSRS model, `scheduler.ts`, `state.ts`, `store.ts` IndexedDB, `ledger.ts`, `events.ts`, `backup.ts`, `reconcile.ts`, `weak.ts`, `metrics.ts`, `policy.ts`); `check/` (4.4k: `translate/`, `traps/`, `writing.ts`, `personal.ts`, `exact.ts`, `wordhint.ts`, `lexmatch.ts`); `exercises/` (3.4k: `ladder.ts`, `input.ts`, `reinflect.ts`, `recombine.ts`, `neighbours.ts`, `licence.ts`, `pairs.ts`, `spanish.ts`, `english.ts`); `games/` (1.3k); `content/` (`schema.ts`, `kinds.ts`, `library.ts`, `migrations.ts`, `days.ts`); `ui/` (11.4k: `app.tsx` shell with Home, Story, Look up, Progress, Settings; `screens/`, `blocks/`, `components/`, `session/` with `runner.ts`, `cards.ts`, `freeplay.ts`, `placement.ts`, `beats.ts`; `data/loader.ts`, `bundle.ts`); `styles/app.css` 330 lines with one desktop block at line 313.

Content (`app/content`, 76 MB, 42 MB bank): `graph/` 6 files, `units/` 60, `bank/` 99 files, `story/` ch001 to ch219, `scenes/` 270, `scripts/` 916, `writing/` 60, `contrasts/` 94; derived folders `_library`, `_pitfalls`, `_migrations`, `_shipped`, `_reports`, `_queue`. Loading: lazy `import.meta.glob` chunks; core at boot, a unit window (2 before, 3 after) fetched around the learner; a missing file converts the day to review; service worker precaches the first window.

State: IndexedDB via `idb-keyval`, one KV for learner and UI, a games document, a keep store, monthly snapshots, JSON backup and restore, versioned migrations. Tests: 177 files; the completion record says 5,340 pass; 3 Playwright specs.

## 2. Skill graph and tagger

Nodes by prefix: `g:` grammar 172, `p:` pattern 650, `c:` chunk 404, `l:` lexeme 4,560, `x:` contrast 94, `d:` can-do 269. Edges: `requires` (about 1,670), `contrasts`, `unpacks`, `serves`. Nodes carry `band`, `priority`, `pcic`, `forms`, `tags`, `variety`, `detectable`.

Tagger entry: `tagSentence(text, TagOptions)` in `src/engine/tagger/index.ts` returning `{requires, features with spans, confidence, lowReasons, tokens}`; pipeline `words.ts` then `features.ts` then `nodemap.ts` then chunk and pattern matching; never silent (`low` with reasons); exports `dialectLint`, `accentLint`, `focusSpan`, `splitSentences`. CLI `tools/tag.ts` with `--all-old` to run over the old app's `data/*.js`. The gate enforces stored `requires` equals the tagger's output (`npm run gate -- --fix`).

Standalone: pure TypeScript, no DOM, imports only `src/engine` and two JSON files; needs `TagOptions` from the graph (`graphIds`, `chunks`, `patterns`) and `registerLexemes()` for node ids. The engine is a TS port of the old `js/engine.js`; `tests/engine/parity.test.ts` diffs every verb, tense and person against the old file with `parity-whitelist.ts`.

## 3. Compiler and scheduler

`compileSession(input)` (`compile.ts:62`) is pure and seeded by learner id plus session index. Day types introduce, drill, input, patterns, output, review, checkpoint, plus the minimum tier; `decide()` (line 391) with precedence spacing, backlog throttle, path day; then `fitToBudget`, `dropBeatOverBudget`, `storyBeat`, `extraReading`, recap, close. Rules: one grammar point per session, never consecutive; drill within 3; contrasts only when both sides known; recognition-only nodes never asked; gate `requires ⊆ known ∪ introduced-today`; nothing in the ledger re-served except a review context after 120 days.

Scheduler (`learner/scheduler.ts`): FSRS-5 on `ts-fsrs`, 0.9 retention, no fuzz; in-lesson learning steps run by the app (3 to 5 retrievals); two cards per node (receptive es to en, productive en to es), productive unlocked after a passing receptive review; `policy.ts` gives productive cards to grammar, patterns, chunks, contrasts and lexemes ranked 3000 or better. Implicit credit (`learner.ts:71-73`, `creditSentence` 736): partial credit 0.3 on Good or Easy, capped. Sibling burying (`servableDue`, `compile.ts:570`). Budgets (`budget.ts`): minutes A1 20, A2 22, B1 25, B2 45, C1 52; warm-up 7, 7, 8, 14, 14; seconds per item learn 55, translate 35, type 25; new-item caps by day type; first-week ramp; throttle cuts new then converts days; debt policy (R18); re-entry after 7 days. Five-minute mode: `MINIMUM_MINUTES = 10`, `shortSlice`, `quickFinished`. Resume: `SavedSession` (`store/ui.ts:212`) with stable day keys and `reconcile.ts`.

## 4. Content inventory

Language policy (`tools/burn/brief.md`): neutral Latin American, Bogotá, tú/usted/ustedes, no vosotros or voseo, preterite as everyday past, Colombian colour in dialogue, Peninsular accepted and flagged.

Bank: 72,709 rows, zod `BankSentence` `{id, es, en, accept, acceptEn, requires, targets, kind, unit, theme, source, focus}`; 60,760 have `focus`; `accept` empty on nearly all rows. Chapters: 219, 87,234 words (mean 398), fields `id, unit, title, text, gloss, questions, hook, rereadQuestions, requires, lexemes`. Scenes: 270, 1,474 turns, `{id, unit, title, brief, turns:[{npc, npcEn, intent, accept[], require[], focus, next}]}`. Scripts: 916 (172 g, 650 p, 94 x), `{node, hook, examples, rule, smallPrint, readAndPick, yourTurn, pitfalls, personal}`. Writing: 875 tasks. Contrast store: 94 contrasts, 1,493 items (914 authored in `tools/contrast/authored`). Placement items generated at runtime (`placement.ts`). Vocab: 4,550 lexemes (2,519 taught, 192 closed-class, 1,839 receptive), frequency from OpenSubtitles and Leipzig Colombian (`tools/vocab/`).

## 5. Features and port estimates (to a vanilla-JS target)

| Feature | Files | Self-containment |
|---|---|---|
| Look-up (units, grammar by topic, words, verbs) | `ui/screens/reference/{index.tsx,model.ts,search.ts,topics.ts,verbs.ts,tenses.ts}` | Medium; `search.ts` and `topics.ts` pure and portable; `verbs.ts` needs the engine |
| Tap-a-word gloss | `Bundle.gloss()` `ui/data/bundle.ts:211-256`, `ui/blocks/read.tsx` | Medium; resolution order: chapter gloss, names, small words and clitics, lexeme list with plurals, verb form via engine, exact |
| Reading library | `ui/screens/story.tsx` | Easy; lists read chapters only |
| Weak spots | `learner/weak.ts`, `ui/screens/weak.tsx` | Medium-hard; needs event log and trap rules |
| Free practice | `ui/session/freeplay.ts`, `screens/practice.tsx` | Hard; tied to card model; verb workout most separable |
| Translation matcher | `check/translate/*` (`match.ts`, `canon.ts`, `variants.ts`, `hints.ts`, `swaps.ts`, `tense-swaps.ts`, `attempt.ts`), `exercises/spanish.ts` | Medium, high value; `matchTranslation(input, {es,en,accept})`; canonicalises pronoun drop, clitic climbing, adverb position, tú/usted/ustedes, Peninsular; `attempt.ts` self-correction; audit battery passed 49 of 192 valid answers so accept lists matter |
| Games | `games/*.ts`, `ui/games/*.tsx` | Hard; Relámpago most self-contained |
| Placement | `ui/session/placement.ts` | Hard; ladder separable |
| Checkpoints, week map, metrics | `compile.ts`, `home.tsx`, `learner/metrics.ts`, `screens/progress.tsx` | Design only |
| "I don't know" | `components/card.tsx:175` | Easy |
| Story beats | `ui/session/beats.ts`, `compile.ts storyBeat` | Medium |
| Contrast store | `content/contrasts`, `tools/contrast` | Easy as data |
| Reason lines and traps | `check/translate/hints.ts`, `check/traps/*`, `check/wordhint.ts` | Medium; four outcomes per R14 |
| Desktop layout | `styles/app.css:313` | Trivial |

## 6. Content pipeline

`tools/burn/`: `jobs.jsonl` queue in `content/_queue`, `cloud.sh lease N`, prompts in `tools/burn/prompts/*.md` (bank, bank-topup, scenes, scripts, story, writing, review, scene-fix, story-audit) plus `brief.md`; each job gates its outputs and retries twice; `launchd/` schedules; `/burn` skill. `tools/gate.ts` and `tools/gate/{checks,corpus,continuity,load,extract}.ts`: schema, accent, dialect, verbs, legality, requires, reading coverage (2% unknown unglossed, 5% with gloss), length by band, dupe (4-gram Jaccard over 0.6), frames, typeable, dashes, options (longest-option bias beyond chance plus 8% is an error), supply, daySupply, tagger confidence, continuity. `tools/sim/` and `simulate.ts` (profiles fast, average, forgetful, irregular, returner, lapsed, placed) write `content/_reports/`. `tools/supply/` day supply. `tools/contrast/` (`derive.ts`, `cue.ts` Cue and Guess tests, `authored/`). `tools/vocab/`. Also `tools/curriculum/` (initial unit map, not to be re-run), `tools/build/`, `golden.ts`, `reconcile.ts`.

## 7. Prior audit findings

Twenty reasons it fails a learner (product audit, swarm reports A, B, C): the checker refuses valid answers (1.4% of rows have accepts); placement does not measure level; day 1 grinds (42 cards before the chapter); the rule card hid the rule (394 scripts open with a colon); every session is the same machine (37 to 77 cards); sessions run longer than advertised (22 to 24 minutes at A1, 31 to 40 at B1 to C1); short days go nowhere; no acknowledgement of breaks; story sparse and inconsistent; story questions passable by length or option A; gloss notes on the wrong word (32%); contrasts never taught; the ladder collapses at B1 and above; feedback rarely explains (101 of 123 misses just repeat the pair); production rare in week 1 (20%); repeats (same prompt 6 to 19 times a session late on); interrupted work lost; layout (Home 1,328 px tall, story card below the fold, phone column on desktop); content depth shortfall (about 1,800 of 4,554 words delivered; mean sentence 5.1 words at A1, 8.4 at C1); never validated with a real learner (R32).

Rulings R1 to R32 and open decisions O1 to O12 are in `docs/swarm-audit/00-lead-rulings.md`; the ones this plan leans on: R18 debt policy, R24 stage labels not CEFR claims, R25 reader taps free and saves capped at 3 a day, R26 gloss rather than delay, R28 work on `next`, R29 curriculum moves wait for stable keys.

## 8. Playtest tooling

From `app/`: `npm test`; `tests/ui/driver.ts` headless learner; `npx vite-node tools/playtest/render.ts <unit> <days> [right|wrong]` (run from `app/`); `node tools/playtest/serve.mjs <profile> <port> [--desktop]` against `npm run dev` on 5173 with `?fixtures=0`, actions goto, click, fill, clock, shot, tap with policies first/last/random/learn; `npx playwright test` (preview on 4317); `npm run simulate -- --real --days 365 --profiles ... --tiers ...` (about 1 GB with `--through B`); `npm run gate`; `npx tsx tools/tag.ts "<sentence>"`.

## Overall judgement

Independently valuable, in order: the engine and translation matcher; the tagger plus graph as a content-quality tool; the gate checks; the contrast store, story and scripts as raw material; Look-up search and topics, gloss resolution, FSRS with implicit credit as designs. Not worth porting as code: the compiler, runner, placement and games.
