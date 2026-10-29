# Fluidez `rebuild` branch: pedagogical and technical audit

Audited 2026-10-29 against the two briefs in `docs/research/` (the blueprint and the sequencing doc) and `docs/redesign.md`. Scope: `app/` (Preact + TypeScript, 15.7k lines of source, 35 test files). Text-only is taken as given. Paths below are relative to `app/` unless noted.

## Context

The `rebuild` branch replaces a fixed 663-day course with a computed one: a skill graph, a tagged sentence bank, an FSRS learner model, and a deterministic per-learner session compiler. The branch is three days old (first commit 2026-10-28), has 157 commits of which 127 are automated content burns, typechecks clean, and passes all 2,312 unit tests. Content exists for units 1–21 of 60 (A1 and the start of A2). The question this audit answers: are the bones right, where does the current build fall short of the research it was designed around, and what has to happen next to reach a polished MVP.

**Verdict in one line.** The scheduling and content architecture is well above the usual bar for a language app and is faithful to the research. The weak layer is the one the learner actually touches: several mechanisms that the architecture promises (the choose → type → transform ladder, recombination mastery tests, self-check feeding practice, checked personal output) are built or advertised but never reach a session, and a few scheduler details quietly corrupt the memory model. These are fixable in weeks, not months, and almost all of them are in `src/ui/session/`, `src/compiler/compile.ts` and `src/learner/`.

---

## 1. The good: foundations worth keeping

### 1.1 The curriculum is a graph, and content is gated by it
- 6,143 nodes in `content/graph/` (4,554 lexemes, 650 patterns, 404 chunks, 269 can-dos, 172 grammar, 94 contrasts) with four edge types: `requires` (1,670 edges), `contrasts`, `unpacks` (chunk seeds a later system) and `serves` (→ can-do). Schema in `src/content/schema.ts:16-47`.
- Every sentence, chapter, scene and writing task carries a tagger-computed `requires` list, and the compiler admits content only when `requires ⊆ known` (`src/compiler/compile.ts:234, 490-500`). This is the single most important architectural decision in the branch: it makes "never show grammar before it is taught" and "readings at 95–98% coverage" properties of the system rather than editorial discipline. The old app gated by tense only.
- The content gate (`tools/gate.ts`, `tools/gate/checks.ts`) enforces schema, dialect (LatAm, no vosotros), accent lint against the verb tables, legality (no grammar ahead of schedule), reading coverage, near-duplicate detection (4-gram Jaccard), frame monotony, typeability and dash bans. Few content pipelines have this.

### 1.2 The learner model is real spaced repetition, not a Leitner box
- `ts-fsrs` with FSRS-5 weights, configurable retention (0.85/0.9/0.95), 365-day cap (`src/learner/scheduler.ts:32-41`).
- **Two cards per node**: receptive (es→en) and productive (en→es), with the productive card unlocking only after a passing receptive review on a later day (`src/learner/learner.ts:313`). Grammar, patterns, chunks and contrasts are always productive; lexemes by frequency rank (`src/learner/policy.ts:18-26`). This matches the blueprint's "≥50% production direction" target by construction.
- **Implicit credit**: one sentence review gives bounded partial stability credit to every other reviewed node in that sentence (`learner.ts:328-366`), capped at 1.2× per step and 1.5× base stability, once per node per day. This is the mechanism that makes the blueprint's review-time arithmetic work at 30–50k sentences.
- **Backlog throttle that never trims reviews** (`src/compiler/budget.ts:56-58`, `compile.ts:330-332, 622-628`): new items are cut first, then input days convert to review days. Seconds-per-review is measured per learner with a 10 s prior (`learner.ts:462-467`). The minimum tier never advances the path. All of this is exactly what the blueprint's build decisions 2 and 3 ask for.
- Introduction is not a single exposure: 3–5 in-lesson retrievals, done at 3 with the last two correct (`learner.ts:39-41, 270-276`), and the first FSRS rating is derived from how those went.

### 1.3 The session compiler implements the six lesson types with enforced spacing
- Seven day types (introduce, drill, input, patterns, output, review, checkpoint) plus minimum. Decision precedence is spacing > throttle > path day (`compile.ts:310-356`): one grammar introduction per session, never consecutive, each followed by a drill within 3 core sessions.
- Drill days interleave ~60% latest point with up to 3 older points and a known contrast (`compile.ts:822-838`). Remix blocks pull from a 28-day window.
- Deterministic: seeded by learner id and session index (`src/compiler/content.ts:189`), so sessions are reproducible and testable.
- Property tests on random courses (`tests/compiler/properties.test.ts`, `random-course.test.ts`) check gating, no repeats, throttle, spacing and budgets. A simulator with four learner profiles and a tuning log (`budget.ts:176-183`, `content/_reports/sim-summary.md`) replaced guesswork about calendar length.

### 1.4 Checking and feedback are stronger than typical text apps
- The translation matcher (`src/check/translate/`) canonicalises subject-pronoun drop, clitic climbing, adverbial position, question subject order, tú/usted when the English is open, Peninsular forms (accepted and flagged, not failed), author `accept` lists and any other bank sentence with the same English. 152 matcher tests.
- `diagnose` (`src/check/translate/hints.ts`) names the first real error in plain English without revealing the answer (gender, one vs many, "who is doing it?" vs "when does it happen?", ser/estar, por/para, missing small word). The learner gets **one self-correction attempt** before the reveal, as the sequencing doc recommends.
- Accents are strict where they change meaning (verb gaps) and lenient on chunk and word cards. Every Spanish field has a 9-key accent bar that keeps the caret (`src/ui/components/answer.tsx`).

### 1.5 Lesson granularity is right
- Units are 9–10 days, days are 5–8 blocks, blocks are card runs of 4–12 cards. Nothing is monolithic. A card is one ask line, one prompt, an optional cue line, and 3–4 options or a field.
- Teaching scripts follow the blueprint anatomy: hook with a human reason → examples → rule → read-and-pick → your turn → pitfalls → personal sentence (`schema.ts:99-110`, `src/ui/blocks/teach.tsx`). 207 scripts exist for all 207 script-worthy nodes in u01–u21.
- `breakRuns` guarantees no more than 4 same-format cards in a row (`src/ui/session/order.ts:115-128`): the blueprint's "change the rhythm every 2–3 minutes" is enforced.

### 1.6 Voice and motivation follow the brief
- No jargon, no block names on screen, no XP, no hearts. Streak, first-time-right counts, can-do progress, a story cliffhanger on the close screen, and an optional "15 more minutes" offer gated on streak and backlog (`src/ui/session/more.ts`). Copy is tested (`tests/ui/copy.test.ts`).

### 1.7 Content volume and quality pipeline
- 21,856 bank sentences, 62 chapters (~15.9k words), 75 scenes (440 turns), 258 writing tasks, all for u01–u21; 466 queued burn jobs with 129 done; a per-unit LLM reviewer and story audit on top of the gate. The pipeline is self-resuming (launchd).

---

## 2. Pedagogical gaps and shortfalls

Ordered by how much they damage learning, not by effort.

### 2.1 Active recall: the ladder is promised but not delivered
- `src/exercises/ladder.ts` builds choose → type → transform per sentence, but the compiler assigns **one rung per sentence, round-robin, then shuffles** (`compile.ts:801, 829-838`), and the UI reshuffles by format. No item ever climbs. Nothing steps a learner up after success or down after a miss. The block heading still says "First choose, then type, then change it around" (`src/ui/session/labels.ts:53`).
- The recombination generator (`src/exercises/recombine.ts`), the explicit mastery test in `docs/redesign.md` §3, is **never called** from `src/ui` or `src/compiler`. Likewise `cueItem`, `lexGapItems`, `structuredInputAll` and the whole `check/translate/attempt.ts` flow. "A correct chunk is not mastery" is therefore not enforced; `novelPasses` only accrues from warm-up reviews on unseen sentences.
- New words are typed exactly once before they enter FSRS: the learn queue advances format by round number regardless of correctness (`order.ts`, `learner.ts:270-275`), so a learner who gets everything right sees recognise → pick → type and is done.

### 2.2 Recognition is too easy to game, and production starts late
- Every receptive review is a 3-option MCQ. With 3 options, elimination plus a half-memory passes, and the card is graded Good. es→en typed translation exists (`matchEnglish`) but `translateCard` only ever asks en→es (`src/ui/session/cards.ts:330`), and no real story question is typed (463 MCQ, 0 typed).
- There is no "I don't know" on session MCQs (only in placement). A guess that lands is rated Good; FSRS then schedules the item out ~3 days on evidence that does not exist. This is the single cheapest high-value fix.
- Productive cards unlock only after a receptive pass on a *later day*, so the first week is almost entirely recognition. The blueprint wants ≥50% production share of retrievals; the design intends it; the first-week ramp defeats it.

### 2.3 Unchecked output teaches learners that effort is optional
- The personal sentence accepts any 2+ words and always says "That's real Spanish about you." (`teach.tsx:212-224`). English or nonsense passes.
- `respondCheck` passes any 2+ words for non-tú questions (`cards.ts:345-360`). Scene constraints are mostly deaccented substring checks (`containsAny ['hola','buenos días']`). Writing rubric answers are discarded (`src/ui/blocks/writing.tsx:25, 70`). Story comprehension answers are explicitly not scored (`src/ui/blocks/read.tsx:107`).
- The checkpoint self-check says "It only changes what comes back for practice" (`labels.ts:71`) but only writes to `ui.canDos`; the scheduler never sees it. This is a promise the app breaks silently.
- The engine can check far more than these do: it can confirm a Spanish verb form from today's node is present, that the reply is mostly Spanish lexicon, that a question has ¿?, and so on (`src/check/writing.ts` already has `verbForm`, `anyVerbInTense`, `question`). The constraints exist; the blocks don't use them.

### 2.4 Spacing details that corrupt the memory model
1. **Sibling leak.** Both cards of one node can appear in the same warm-up (`compile.ts:438-439` keeps separate open sets per direction). The receptive card shows the Spanish that the productive card then asks for.
2. **Due order is by timestamp, not urgency** (`learner.ts:393`). Under a backlog the first cards served are the earliest-due, not the ones closest to being forgotten. FSRS exposes retrievability; the compiler should sort by it.
3. **Uniform multi-target grading.** A multi-node review item grades all targets the same (`src/ui/session/runner.ts:218`) even though `creditSentence` accepts per-target `grades` (`learner.ts:87-88, 336`). One wrong word lapses three nodes. The simulator grades targets independently, so its load numbers do not describe the app.
4. **No same-session re-encounter.** `learning_steps: []`, `relearning_steps: ['10m']`, but the plan is compiled once before the session, so the 10-minute relearn never runs; a lapse today is next seen at the next session. Day-1 fragility (the blueprint's "day 7 is most fragile") is addressed only by the 3-card RETRY_GAP inside the learn pool.
5. **Only the first practice item per node is a scored review**; the remaining 8–11 items in a drill are exposures (`compile.ts:801`). The intent (no same-day rating inflation) is right, but in-session misses then vanish: they neither feed leech detection nor change tomorrow's drill.
6. **Leeches are never suspended** and the leech block is exposure-only (`compile.ts:1068`).
7. **"Known" means introduced** (`compile.ts:234`). A node introduced two minutes ago satisfies the reading gate at full weight, so "98% coverage" is measured against introduction, not retention. For a learner at 85% retention that reading is nearer 90% coverage.

### 2.5 No review history, so no learning signal
- `LearnerState` holds only current card state; the ledger is an exposure log (`src/learner/ledger.ts`). There is no per-review event record. Consequences: FSRS weights can never be fitted per learner (`setWeights` has no external caller), the blueprint's primary metric (delayed-retrieval accuracy on items 7+ days old) cannot be computed, and scheduling bugs cannot be reproduced from a learner's data. The simulator reports calendar length and throttle rate but **no retention or accuracy metric at all** (`tools/sim/report.ts`).

### 2.6 Pacing is completion-only
- `advancePath` applies `pathAfter` whenever the core finishes (`compile.ts:54-56, 1150-1178`). Accuracy, mastery, self-check and checkpoint results never slow or redirect the path. The blueprint calls for a remediation block built from the weakest nodes after a checkpoint; nothing builds one. The throttle is the only adaptive brake, and it reacts to volume, not to error.
- Placement seeds every earlier node with an all-Good synthetic history and `novelPasses = 0` (`src/ui/session/placement.ts:317-372`). The simulator does not model placement, so the backlog a deep placement produces is untested.

### 2.7 Cognitive load: mostly good, with three dense screens
- The **examples card** shows a median of 6 Spanish/English pairs at once with "Spot what they have in common" (`teach.tsx`); the blueprint says never more than ~30 s of reading without doing.
- The **rule card** runs 61–153 words (median 97) as one card. Acceptable against the "≤90 s" rule, but there is no one-line "the trick" above the fold.
- **Story chapters** are far over the brief: A1 chapters run 118–254 words in ch001–ch014 against the 80–150 word A1 target; 61 of 62 chapters are outside their band's range and nothing in the gate checks length. Each is one continuous block with every word tappable, which is good, but inflected verbs without a chapter gloss show "No note for this word yet" because lookup does not lemmatise (`src/ui/data/bundle.ts:86-98`).
- The learn "present" card can stack several chunk variants plus two examples each.
- Feedback copy: every typed miss opens with "Almost." (`src/ui/components/card.tsx:125`) even when the answer is nowhere near; choose/type `why` lines restate the answer ("The English says X, so it's Y"); on reveal the targeted hint is discarded for every card type except translate (`card.tsx:121`).
- The progress bar counts blocks, not cards (`src/ui/screens/session.tsx`), so it jumps rather than moves.

### 2.8 Interleaving is schedule-driven, not learner-driven
- Within a session, reviews live only in the warm-up; new material is never mixed back into it. Structured input is 9 picks on one node; input and patterns days practise one node at a time. Grammar interleaving exists only in drill controlled output and in remix. The `requires` DAG would support graph-driven interleaving (pull a known contrast whenever its pair is drilled) but only the hand-written unit `focus` lists drive it. Across units, 67 of 172 grammar nodes recur in a later unit's focus; only 5 of 94 contrasts do.

---

## 3. Structural and code recommendations

### 3.1 Data model and state

**A. Add an append-only review event log** (new `src/learner/events.ts`, own IndexedDB key, compacted monthly).
```ts
interface ReviewEvent { at: number; node: NodeId; dir: Direction; grade: Grade; ms: number;
  sentence?: string; op: PracticeOp | 'warmup' | 'learn'; tries: 1|2; novel: boolean;
  session: number; retrievability: number /* R at the time, from FSRS */ }
```
Enables: the FSRS optimiser (ts-fsrs ships one), delayed-retrieval accuracy, production share, day-7/day-28 retention, leech detection, and reproducible bug reports. Write every outcome here, including the exposure-scored drill items; keep the "one FSRS rating per node per day" rule separate from "record what happened".

**B. Per-node ladder state.** Add `rung: 0 | 1 | 2` (choose / type / transform) and `rungStreak` to `NodeRecord` (or to `PathState` if you prefer scheduling state outside the memory model). The compiler picks the op from the rung instead of `ops[i % ops.length]`; the runner steps up after two consecutive first-try passes and down after a miss. The label in `labels.ts:53` becomes true. Recombine items become rung 3, served only from `rung ≥ 2`, and flagged `novel: true` so they feed `novelPasses`.

**C. Fix the four scheduler leaks** (all local, all testable with the existing property-test harness):
1. Bury siblings: when planning the warm-up, skip the productive card if the receptive card of the same node is in this session's groups (and vice versa) (`compile.ts:437-486`).
2. Sort due cards by retrievability ascending within the due set, not by `due` (`learner.ts:393`). `retrievability()` already exists.
3. Pass per-target grades from the UI. For MCQ, the chosen distractor identifies which target was missed; for typed, use `diagnose` to attribute the first error to a node where possible, else grade the targets the item was `focus`ed on and `expose()` the rest.
4. Add an `end-of-session` block: today's new items plus any card that lapsed this session, served as production cards, 2–3 minutes. Give it the 10-minute relearning semantics in-session (grade it, but let FSRS treat it as the relearning step).

**D. Tiered "known" for the content gate.** `known` becomes a map `NodeId → { introduced: true; stable: boolean }` where `stable` = retrievability ≥ target retention. Readings count a non-stable node as an unknown-glossed word for the coverage check; practice sentences may use either. This makes "98% coverage" mean what the blueprint means.

**E. Make the checkpoint and self-check act.** Store self-check marks and checkpoint reading-check results in `PathState` (`remediate: NodeId[]`). The next drill's `older` set draws from `remediate` first (`compile.ts:822-827`), and a "Not yet" self-check demotes the node's rung to 0.

**F. Persistence hygiene.** Save `state`, `path` and `ui` in one IndexedDB transaction (idb-keyval `setMany` or a single document); give `PathState` and `UiState` versioned migrations like `LearnerState` has (`state.ts:117-142`); never regenerate `learnerId` on a version mismatch; cap the ledger (sentence views older than 180 days can be summarised to counts).

**G. Content model fixes before scaling to u22–u60.**
- One quota source. `Unit.quota` is stale and unread by the app; `_reports/quotas.json` is what prompts use. Delete one and point the gate's `supply` check at the other.
- `BankSentence.lexemes`, `.chapter`, `.scene` are never filled (lexemes ride in `requires`, which works). Either drop the fields or make the tagger fill them; a schema that lies is worse than a narrower one.
- Add a chapter word-count check to the gate, by band (A1 80–150, A2 150–250, …), and a `spare: true` flag on scenes not named by any day (50 of 75 today).
- Extend `tools/curriculum/validate.ts` to check `UnitDay` refs (chapter, scene, lexemes), per-day caps (u02/u03 day 5 list 16 lexemes against an introduce cap of 6; 18 patterns days exceed `PATTERNS_DAY_CAP`), and the one ordering violation (`c:a-que-hora` before `p:telling-time`).
- The dialect lint should read `GraphNode.variety` instead of its hard-coded recognition set (`checks.ts:179-196`).
- Delete the empty `content/vocab/` glob or populate it.

**H. Simulator parity and retention metrics.** Make `tools/sim/run.ts` grade like the app (Again/Hard/Good, uniform-then-attributed multi-target) and report: recall rate at review vs target retention per band, accuracy on novel recombinations, production share, and the backlog after a placement at unit 10 and unit 20. Then rerun on real u01–u21 content, not synthetic.

### 3.2 UX for a text-only environment

Each of these is a small change in `src/ui/`; none needs new content.

1. **"I don't know" on every MCQ card** → Again, and no green flash of the right answer before the learner commits. Highest value per line of code in the branch.
2. **Honest feedback words.** "Almost." only when `near` or `diagnose` found a single error; otherwise "Not yet." Keep the targeted hint on reveal for all card types, and put the fixed `why` under it rather than instead of it (`card.tsx:121`). Rewrite choose/type `why` templates to explain the form, not restate the English.
3. **Vary receptive reviews.** Alternate 3-option MCQ with "type the English" (the matcher exists) and with 4-option MCQ where the distractors differ in one feature. Recognition then measures something.
4. **Chunk the dense cards.** Examples card: reveal 2–3 pairs per tap, with a one-tap "what do they share?" pick between groups. Rule card: a one-line "the trick" on top, the paragraph below a "Why?" disclosure. Learn present card: one variant at a time.
5. **Shorter chapters, or chapters in beats.** Until the gate enforces length, render chapters in 2–3 beats of ~100 words with one comprehension pick between beats. Score the picks as exposure plus receptive partial credit on the lexemes they contain.
6. **Lemmatise gloss lookup** with `analyzeToken` so an inflected verb finds its lemma; add a per-sentence "show English" toggle alongside per-word glosses.
7. **Progress bar by cards within the current block**, with the block bar underneath; show "about N minutes left" from measured seconds, which the runner already has.
8. **Make unchecked blocks honest or checked.** Personal sentence: require a Spanish-lexicon majority and today's verb form (`writing.ts` constraints), say "I can't judge the meaning, but the form is right" when it passes, and show the model only after an attempt. Scene: show "one way to say it" only after the retry. Writing: save the rubric and show it next time alongside last time's.
9. **Close screen that reports retention, not only today.** "8 of 10 from last week came back" (needs the event log), production share this week, and the streak freeze the blueprint recommends (one per week, earned by a completed session).
10. **Wire settings that exist.** Tier (minimum / standard / extended) and `Settings.minutes` are implemented in the compiler and ignored by the UI (`runner.ts:39, 64`, `compile.ts:253`). Either expose them in Settings or remove them from `Settings` so the model does not carry dead knobs. The onboarding goal is stored and never used; same choice.

---

## 4. Revised implementation roadmap to an MVP

**MVP definition:** units 1–21 (A1 through early A2, ~5 months of daily use) playable end to end on a phone, every learner action that claims to be checked is checked, every review feeds a memory model that can be audited, and the app reports delayed retention. Content beyond u21 continues through the burn in parallel and is not on the critical path.

Effort labels: S = under a day, M = 1–3 days, L = about a week. Each item names its tests.

### Phase 1: make the memory loop honest (do first; everything else measures against it)
1. **[M] Review event log** (`src/learner/events.ts`, new idb key, write from `runner.ts` on every outcome; migration bumps `STATE_VERSION` to 2). Tests: `tests/learner/persistence.test.ts` round-trip; property: every graded outcome has one event.
2. **[S] "I don't know" on MCQ cards** (`card.tsx`, `cards.ts` McqCard) → Rating.Again. Test: `tests/ui/session.test.ts`.
3. **[S] Bury sibling cards** in `planReviews` (`compile.ts:437-486`). Test: new property in `tests/compiler/properties.test.ts`: no session contains both directions of one node.
4. **[S] Sort due by retrievability** (`learner.ts:393`). Test: `tests/learner/scheduling.test.ts`.
5. **[M] Per-target grading** from the UI (`runner.ts:218`) using distractor identity and `diagnose`. Test: `tests/ui/dialogue-cards.test.ts` style, one miss lapses one node.
6. **[M] End-of-session re-encounter block** for today's new and lapsed items (`compile.ts` new block kind, `budget.ts` seconds, `labels.ts` heading "Before you go"). Test: compiler property: every item introduced this session appears once more after the core.
7. **[S] Atomic save + migrations for `path` and `ui`** (`src/ui/store/ui.ts:69-80`, `runner.ts:262-264`). Test: `tests/learner/persistence.test.ts`.

### Phase 2: deliver the output ladder the UI already promises
8. **[M] Per-node rung state and adaptive stepping** (`NodeRecord.rung`, `compile.ts:801` picks op by rung, `runner.ts` steps). Test: `tests/exercises/ladder.test.ts` plus a new runner test: two first-try passes climb, one miss descends.
9. **[M] Wire recombination as the mastery rung** (`recombine.ts` → new `PracticeOp 'recombine'`, `novel: true` credit). Test: `novelPasses` increments only from recombine or unseen-sentence warm-ups.
10. **[S] Honest feedback copy and hint retention on reveal** (`card.tsx:115-130`, `cards.ts` why templates). Test: `tests/ui/copy.test.ts` additions.
11. **[M] Vary receptive reviews** (es→en typed via `matchEnglish`, feature-contrast distractors from `input.ts`). Test: `tests/ui/cards-real.test.ts`: no more than 60% of warm-up cards are 3-option MCQ.
12. **[M] Check the unchecked**: personal sentence, `respondCheck`, scene turns use `writing.ts` constraints (verb form from today's node, Spanish-lexicon ratio ≥ 0.8, question marks); score story comprehension as exposure; persist writing rubric. Test: new `tests/ui/output-checks.test.ts`.
13. **[M] Self-check and checkpoint feed remediation** (`PathState.remediate`, drill `older` set, rung reset). Test: compiler property: a "Not yet" node appears in the next drill.


### Phase 2b: reference and free practice (added 2026-10-29 at Matthew's request)
Shared type: `src/ui/session/practice-spec.ts` (`PracticeSpec`: quickReview | conjugate | translate | nodes).
26. **[M] Reference tab** (`src/ui/screens/reference/`): search over verbs, grammar and words. Verb tables by infinitive or any form, taught tenses first. Grammar index grouped by what you want to say (now, the past, the future, wants and wishes, describing, pronouns, questions, connecting ideas), searchable by title, Spanish forms and plain-English labels; each entry opens its teaching script read-only, unit as a footnote. Word list with strength and last sentence. Every entry has "Practise this".
27. **[M] Practice modes** (`src/ui/screens/practice.tsx`, `src/ui/session/freeplay.ts`): Quick review (lowest retrievability first, due or not; graded as real reviews), conjugation grind (typed forms, timed, exposure events op `grind`), translation grind (typed en→es from the gated bank, matcher, op `grind`), and a nodes drill used by "Practise this" and "Train it". Reachable from Home and Reference.
28. **[M] Weak spots** (`src/learner/weak.ts`): aggregate Again/retry events over 14 days by node and by tense (via grammar node tags and attribution), minimum 3 attempts; Home shows up to three "keeps tripping you" items with "Train it" → `PracticeSpec.nodes`. Also a per-tense conjugation spec when the weak node is a tense.

### Phase 3: reading and cognitive load
14. **[S] Chapter length gate by band** in `tools/gate/checks.ts`; queue rewrites for the 61 over-length chapters through the existing story-audit job. Test: `tests/gate/gate.test.ts`.
15. **[M] Chapters rendered in beats with a pick between beats** (`read.tsx`). Test: `tests/ui/flow.test.ts`.
16. **[S] Lemmatised gloss lookup** (`bundle.ts:86-98` via `analyzeToken`). Test: `tests/ui/data.test.ts`: *comemos* finds *comer*.
17. **[M] Chunked examples / rule / present cards** (`teach.tsx`). Test: `tests/ui/real-session.test.ts`: no card renders more than 3 es/en pairs at once.
18. **[S] Card-level progress bar and "known" tiering for the reading gate** (`session.tsx`; `compile.ts:234` + `retrievability`). Test: compiler property: chapter coverage computed with non-stable nodes as unknown stays ≥ 95%.

### Phase 4: measurement and content hygiene (parallel with Phase 2–3, mostly tooling)
19. **[M] Simulator parity and retention metrics** (`tools/sim/run.ts`, `report.ts`), rerun on real u01–u21; add placement-at-u10/u20 scenarios. Output replaces the current `sim-summary.md`.
20. **[S] One quota source; remove or fill `lexemes`/`chapter`/`scene` on bank rows; scene `spare` flag; `variety` in dialect lint; delete empty `content/vocab/` glob** (`schema.ts`, `checks.ts:179-196`, `loader.ts:30`).
21. **[S] Extend `validate.ts`** to unit-day refs, per-day caps and day-placement ordering; fix the u02/u03 overflow days and `c:a-que-hora`. Test: `tests/compiler/compile.test.ts` loads real units without `shortage` diagnostics in the first 30 sessions.
22. **[S] Progress screen shows blueprint metrics** from the event log: delayed-retrieval accuracy (7+ days), backlog minutes vs budget, production share, words read and written. Streak freeze (one per week).

### Phase 5: MVP polish
23. **[S] Wire or remove dead settings** (tier, minutes, onboarding goal). If wired, expose extended tier as "15 more minutes, always" and minimum as the "I need to stop" path.
24. **[M] Real-content e2e** (`e2e/playtest.spec.ts`) through 10 consecutive sessions on u01–u02 with assertions on no repeats, bar progress and card counts; bundle-size budget (lexemes.json is 1.8 MB: lazy-load by band).
25. **[S] Answer the curriculum decisions in `docs/unit-map.md` "Decisions for Matthew"** (grammar density, subjunctive start, pattern trim, story beats, native check list). None blocks the MVP, but the subjunctive and density decisions change priorities for u22+ and should be settled before the burn passes u25.

### Execution approach (per Matthew, 2026-10-29)
- Implementation is delegated to subagents on **less intensive models**: Sonnet for code changes and tests (items 1–24), Haiku for mechanical work (copy edits, schema field removal, validator extensions, content flag passes). The main session only briefs, reviews diffs, runs `npm run typecheck && npm test`, and commits on `rebuild`.
- Each phase is one batch of parallel subagents where items are independent (for example Phase 1 items 2, 3, 4 and 7 can run together; 1 must precede 5 and 6). Each subagent gets the file paths and test names from its roadmap item and must leave the suite green.
- No single subagent touches `src/learner/state.ts` migrations and `src/ui/store/ui.ts` at the same time as another; persistence changes are serialised.

### Explicitly out of scope for MVP
Audio, images, AI feedback, listening track (per `docs/decisions.md`), server sync, placement beyond grammar MCQ, FSRS weight fitting in-app (collect events now, fit later).

---

## Status (end of 2026-10-29)

Landed on `rebuild`, in order: Phase 1 (items 1 to 7), Phase 2 (8 to 13), Phase 2b (26 to 28), Phase 3 (14 to 18), Phase 4 (19 to 22), Phase 5 (23 and 24). Suite: 52 files, 2,548 tests; Playwright: 4 tests including ten real sessions. Beyond the roadmap, the build also fixed three things the new tooling surfaced: the compiler now treats lexemes on no unit day as known from their priority (as the gate always did), placement seeds a review load that fits the budget, and recombination items carry the session in their id.

Queued in the burn: 59 chapter rewrites for length, 9 bank top-ups, writing and scene top-ups for the first units.

Open for Matthew (item 25, unchanged): grammar density, review days in u02/u03, A1 length, when the subjunctive starts, trimming patterns, story beats, the Colombian phrases for a native check, and whether the burn should continue past u21 before those are settled.

Known limits worth a look next: the retention line on Progress needs items at least 7 days old so it appears from the eighth day; simulated recombination accuracy is uninformative because the simulator's recall model is circular; the first install is still 5.5 MB because the whole graph ships (patterns.json is the largest file over the wire).

## Verification

- `npm run typecheck && npm test` in `app/` stays green (baseline today: 35 files, 2,312 tests, typecheck clean).
- After Phase 1: `npm run simulate -- --days 400 --tiers standard` on real content reports recall-at-review within ±3 points of the 0.9 target for the average profile; no session contains both directions of a node (new property test).
- After Phase 2: a scripted runner test climbs a node from choose to recombine in four sessions with all-correct answers and demotes it on one miss; `tests/ui/cards-real.test.ts` shows warm-ups are ≤ 60% MCQ.
- After Phase 3: `npm run gate` reports zero chapter-length errors for u01–u21; the real-session UI test shows no card with more than 3 pairs.
- Manual: play five consecutive real sessions on a phone (`?fixtures` off), confirm "I don't know" is present on every pick card, the close screen shows a retention line, and no block ends with a check it did not perform.
