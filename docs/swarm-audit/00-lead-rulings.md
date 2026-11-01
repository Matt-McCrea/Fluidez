# Lead rulings

These are the lead's rulings on what the specialists disputed. Where the specialists converged, the finding stands in their reports. This file only records what had to be decided, and why. Anything that needs the owner is listed last, with the default used until the owner says otherwise.

Reproduced by the lead rather than taken on trust:

- `npm test` exits 1 with all 2,668 tests passing, because of a Vitest RPC timeout.
- Contrast scripts never reach `teach()` (`compile.ts:841` and `:1114`).
- A rejected save poisons `Learner.touch` for the rest of the session.
- Real `matchTranslation` with no accept list: 8 of 10 valid answers refused, each with a false reason, and *Ella le gusta el café* and *Yo me gusta el café* both pass.

Reproduced by the architecture cross-review with measurements: nothing since `ee6aaec` is live, and `publish.yml` runs no tests or gate.

## 1. Rulings on the Spanish and the teaching

**R1. The subjunctive model.** "Is the speaker telling you this as news?" is rejected. It misfires on well over 1,000 bank rows on the indicative side (`u29-0429`, `u42-0045`, *No sabía que venías*, *Menos mal que llegaste*).

The course teaches this instead, combining the contrastive and linguist proposals:

- The ordinary verb says something is so. The subjunctive holds an idea up without saying it is so.
- The test is physical: cover the opening and read what is left. Is someone in the sentence saying that's so? Ordinary verb. If not, subjunctive.
- One named catch: an opening that reacts or judges takes the subjunctive even when the rest is true. *Me alegra que estés aquí.*
- Two riders: *si* and questions are looking for information, so they keep the ordinary form; a label on a fact (*lo bueno es que*, *menos mal que*) passes the fact on.
- One admitted leak: *a lo mejor viene* and *es posible que venga* mean the same and differ only by frame, so that one is memorised.
- Trigger lists stay central. Acquisition measured nearby words carrying about 83% of the mood decision. The model is for the residue and for new verbs.
- It grows door by door on the linguist's table (cross-review section 1.5), never as one statement at u21.

None of this has been tested on a learner. It is the best-reasoned proposal, not a proven one.

The news idea survives in one place only: at u52, as a lens on real mood choices such as *aunque*, for a learner who already has the model. It is not the core test and never appears before that.

**R2. Naming.** "Subjunctive" from `u21 d1`, in the rule body and not in the hook or day title. "The ordinary form" for the indicative in lessons, "indicative" once in small print and in look-up. "The dictionary form" for the infinitive. "Wish form" and "plain verb" retire. "The -ra form" stays as a nickname. No "statement form". The sweep is by hand per script, never find-and-replace, because "wish" often carries the reason. **This is an exception to the voice rule in `tools/burn/brief.md`, so it lands as its own commit and the owner can revert it.**

**R3. Ser and estar.** Refuse "permanent and temporary", and drop "portrait or snapshot" as an image, since a snapshot is a moment and *está muerto* is not one. Use the comparison test: than others, or than usual; then, did something happen?

**R4. Por and para.** Por si is not a por/para fact; it goes with *en caso de que* at u44. "Not para for how long" is false as an absolute. *Para* marks a booked or planned stretch (`u18-0367`, `u42-0551`, `u36-0186`).

**R5. Sequence of tenses** at u50 is a mapping governed by time, not harmony. `x:subj-present-past` states the reverse ("look at the first verb, not the clock"), is refuted by at least 18 rows, and must be rewritten in the same release that makes contrasts visible.

**R6. Verbs that change meaning in the preterite** are not a list. They are one idea: the preterite draws a boundary around a state.

**R7. Word formation** is recognition only. Spanish derivation is lexically arbitrary, and production drills would teach *llegación*.

**R8. Se.** Five sorts, not seven labels, using the contrastive review's list (section 3.6), placed at u36 after `g:passive-se`, translated both ways, never labelled by the learner. Add the missing job: it just happened.

**R8a. Rulings beat verified text.** Where a verified replacement still carries wording a ruling retired (LC-034's "portrait or snapshot" and CX-038's "Not *para*"), the ruling wins and the text is rewritten. On `p:perfecto-still-live`, the linguist's placement stands over the LC-028 verifier: first Patterns day after session 221, once stable day keys exist.

## 2. Rulings on practice and scoring

**R9. Credit for self-grades.** A claim of "Mine says the same thing" earns Hard through the existing lenient path and queues a fresh-sentence retest when one exists. Never Good, because Good lets recall fall to or below target for a typical overclaimer. Offered only on whole-sentence cards, from A2 up, never when a named trap fired. Three reviewers offered three grades and modelled them as about equal on memory, so the cheapest honest path wins. Claims are logged and feed the accept list. They never count as a novel pass, a rung climb or a weak-spot entry.

**R10. Contrast format depends on what decides the contrast.** Local-cue contrasts (about 30 of 94) can use forced choice. Aspect and other discourse-decided contrasts get connected verb gaps and translation with no clock. Near-synonym contrasts need phrase retrieval, not decks. A Cue Test sits beside the Guess Test: a cue table at most 65%, and always-commoner at most 55%, on meaning and discourse decks.

**R11. Contrast data.** One `ContrastItem` type, one file per contrast in `content/contrasts/`, used by lessons, games, placement and benchmarks. No new `Card` member. No `x:` ids written into `requires` or `targets` on existing rows, which would make them inadmissible. Start at 40 items a contrast and 150 for the five big ones, then measure.

**R12. `focus` is computed, not burned.** The tagger has a span on 95.4% of grammar rows. Only the 37 blind nodes need authoring. Sample 200 spans before relying on it.

**R13. Acceptance goes in `variants.ts` with swap reporting,** so that accepting *voy a pagar* on a `g:future-simple` card yields a pass with a note, never a silent pass. `irme`, digits, optional *a mí* stay in `canon`. Accept sidecars follow the engine, sized by what the battery still fails.

**R14. Trap rules have four outcomes:** Assert, Ask, Note, Silent. Aspect asserts only with an English lock or an action verb in plain narrative. Mood asserts only from a closed trigger list. Weak spots count Assert hits only. One module, `src/check/traps/`, with pitfalls scoped to the card's nodes. A gate battery of correct answers must produce no Assert. Trap rules wait for false pitfalls to be fixed.

**R15. Accent slips stay right with a note** unless the accent changes the word.

**R16. Grade recognition passes unchanged.** Acquisition withdrew its own evidence-weighting proposal after modelling a 63% rise in load. No learner-facing mastery number until it beats FSRS stability at predicting transfer probes.

**R17. Retention measures.** Log `fmt`, `given`, `rule`, `verdict`, `firstKeyMs`, `contentRev` now, in a separate capped document, not on `ReviewEvent`. Latency never affects a grade. No holdouts or hash arms until there are learners to measure.

**R18. No soft reset.** A compiler debt policy separates fresh due cards from old debt, pays debt at a capped rate, and does not throttle teaching. It touches no card and is reversible. It must be simulated before it ships.

**R19. Reconstruye as specified is rejected** (0 of 24 valid rebuilds accepted). Build connected verb gaps from chapters first.

## 3. Rulings on product

**R20. The daily budget has five parts** (warm up, new, practise, read, use) and every addition names what it replaces. Tune budgets only after the checker, contrast blocks and `focus` gaps have landed, but raise B2 and C1 minutes earlier, since that is a standing owner decision and `SESSION_MINUTES` contradicts it.

**R21. A contrast-teach day** keeps the full script and moves `communicative` and the freer `writing` off the day, recovering about 6 of the 6.6 minutes overrun. To be checked in the simulator.

**R22. No features that make a learner feel behind.** No falling ability number on return, no "behind your lessons", no "you stopped being able to". No shown level anchored to course position.

**R23. Games.** Four first: Relámpago, Uno u otro, De corrido, Rescate, offered when they open, with no locked outlines. El tinto waits for target scoring. Ordena, La escalera, the anchored level, challenge links and El Taller are dropped. Only due-card, no-clock play touches FSRS. `ms` never reaches `recordTime`. Speed scores are personal bests inside one game: there is no app-wide currency, which keeps the earlier "no XP, no hearts" decision.

**R24. Stage labels** replace CEFR claims in the shell. Per-skill CEFR stays as a reference only, once there is evidence for it.

**R25. Reader taps** stay free. A tap creates nothing; a save creates a card, at most three a day.

**R26. Chapters are not delayed for unknown words** and are not rewritten to the R6 prose spec. Gloss instead.

**R27. Backup comes before any game.** Backup, saved writing and the attempts log come before everything that depends on them.

## 4. Implementation

**R28. Work happens on a local `next` branch.** `rebuild` deploys on push, with no tests. Nothing is pushed in this session.

**R29. The first curriculum move waits for stable day keys and `reconcile`** (architecture P2). Any resequencing before that corrupts real learners.

**R30. One re-tag.** All tagger, lexeme and node-move changes batch into one commit.

**R31. Verdicts.** Final verdict for a claim is the second lens where there is one, otherwise the first. Refuted claims are dropped. Native-check items go to the owner. Rewrite-needed items go to a person who reads the whole script.

**R32. Reports are read as modelled, not observed.** No real learner has used any of this. No phone or Safari run has happened. Every minute figure is a model.

## 5. Open for the owner

| # | Decision | Default in force |
|---|---|---|
| O1 | Exception to the voice rule for "subjunctive" (R2) | Applied as its own revertable commit |
| O2 | When `next` goes live | Not pushed. See the final report |
| O3 | The say-it card (a self-graded, untyped translation, 13 s against 42 s). The product review calls it the idea that makes the budget fit. `docs/decisions.md` records removal of "say it aloud" on 2026-10-28, and acquisition objects to any self-grade earning Good | Not built |
| O4 | Reading volume (250k to 300k in lessons, against a generic shelf, against the plot's own documents, fares and a real book) | No reading burn |
| O5 | Whether B2 and C1 become document-led lessons, tested on one pilot at u45 with a kill rule | Units unchanged |
| O6 | Whether a human Colombian editor reads drafted Spanish | No drafted prose shipped beyond repairs |
| O7 | Bogotá usage checks (native-check verdicts): *igual* as maybe, *estar por* and others | Text left as it is |
| O8 | Leísmo: whether *le vi* for a man passes with a note | Passes with a note, as a Peninsular answer |
| O9 | Should *La fiesta está en mi casa* pass with a note | Passes with a note |
| O10 | "Event past" and "scene past" as the one pair of labels | Current labels unchanged |
| O11 | Whether Play replaces Settings as a tab | Settings stays; You/Play decision deferred |
| O12 | Open decisions already in `app/docs/unit-map.md` | Unchanged |
