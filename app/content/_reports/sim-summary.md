# Fluidez 2: simulator summary

Generated 2026-10-29T20:06:41.889Z by `npm run simulate -- --real --days 60 --tiers standard --placement u10,u20` (seed 1).
Modes: `--real` runs the app's own `ContentLoader` over the real A1 and A2 content (real sentences, scripts, chapters; no quotas.json write); `--synthetic` generates a corpus on the real unit map and graph; `--placement uNN` adds 30-day runs of a learner placed at that unit through the app's `applyPlacement`.
Model: grades follow the runner (`gradeOf`: first-try pass Good, retry pass Hard, miss Again; never Easy). A failed first draw is retried at P + (1 - P) x retryGain. Multi-target warm-up items are answered once, graded uniformly, and passed through `attributeGrades` (no card evidence in the simulator, so uniform). The recap block uses the runner's capacity rule and `planRecap`; lapsed re-asks are real reviews (op `recap`), new items exposure. Each choose/type/transform/recombine outcome steps the ladder (`stepRung`). Optional blocks are skipped and card runs cut when the plan's minutes are spent. Not modelled: "I don't know" (a miss either way), and the attribution evidence.
Corpus: the real content through the app's ContentLoader (`--real`: bands A1 and A2 only; sentences, scripts, chapters, scenes and writing tasks as the app loads them); 21 units, 6143 nodes, 21856 sentences.

## Budgets in force (src/compiler/budget.ts)

| band | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| standard session min | 20 | 22 | 25 | 28 | 30 |
| warm-up budget min | 7 | 7 | 8 | 9 | 9 |
| extended session min | 35 | 37 | 40 | 43 | 45 |

Minimum tier 10 min (warm-up 5). Extended = standard + 15 core minutes (over-budget reviews first, then ≤ 24 extra-reading sentences; no extra grammar). Throttle: due minutes > warm-up (+15 on extended); severe > 2×.
Multi-item reviews: ≤ 3 due nodes per sentence, cost 1.4× a single review. Review-context reuse after ≥ 120 days (`review-context-120d`). Production cards: grammar/pattern/chunk/contrast, lexemes with freqRank ≤ 3000 (no rank: A1-B1 productive, B2-C1 receptive-only). Learned nodes: productive card up to 365 d, receptive card suspended.

## Tuning log

- 2026-10-29 coordinator defaults: session minutes A1 20 / A2 22 / B1 25 / B2 28 / C1 30; warm-up A1 6 / A2 6 / B1 7 / B2 8 / C1 8; minimum 10; extended +15 core; multi-item reviews (≤ 3, cost 1.4×); review-context reuse after 120 d; production cards by policy; recognition-only maintenance. Result (seed 1, standard): average A1 176 d (was 211), B2 throttle 12.8% (was 51.7%); fast A1 116 d.
- 2026-10-29 canDoAnother costs due reviews the way the warm-up will (multi-target groups) when given the content index, instead of one review per due card; "another" is offered exactly when it would not throttle.
- 2026-10-29 BAND_WARMUP_MINUTES +1 per band → A1 7 / A2 7 / B1 8 / B2 9 / C1 9. 3-seed means, standard tier: average throttle A1 9→6%, A2 18→10%, B1 16→13%, B2 11→7%, C1 17→10%; fast A1 114→108 d with 0% throttle (target ≤ ~112 met). Average A1 stays ~160-172 d: see the summary, it is attendance-bound, not review-bound.
- 2026-10-29 tried and rejected: MULTI_REVIEW_SCAN 80→250 (targets/item +0.05, calendar change within seed noise, compile cost ×2.5); B2/C1 warm-up 10-12. Forgetful B2 throttle (2 seeds) 31% at 9 min, 25% at 10, 24.5% at 11, 17% at 12; the average profile is already ~5% at 9 and gains nothing. Kept 9: a 10-12 min warm-up turns the 28-min B2 session into a 16-18 min core for every learner to help only the forgetful one.
- 2026-10-29 simulator: synthetic supply 2× (32 sentences per lexeme) for the quota run, so measured demand is not capped by the synthetic bank (bare reviews 0-4 instead of hundreds for forgetful).
- 2026-10-29 playtest: SECONDS.learn 35→55 (what the player really takes); first-week ramp: at most 8 new items per session in the first 3 core sessions (day 1 listed 11); a plan over its session minutes drops new items from the end of the learn pool (owed, never lost) until it fits.

## Targets

Targets: average-profile A1 ≤ ~140 calendar days, fast ≤ ~112; B2 throttle conversions < 25%.

| profile | tier | A1 days | A1 target | B2 %throttled | < 25%? |
|---|---|---|---|---|---|

**Where the A1 days go** (A1 path = 133 unit days; a day advances only on a completed non-minimum, non-converted session):

| profile | tier | A1 cal. days | days studied | sessions | "another" | minimum | throttle conv. | other conv. | advancing / cal. day | A1 days at 0 throttle | A1 path days for the target |
|---|---|---|---|---|---|---|---|---|---|---|---|

`A1 days at 0 throttle` = (A1 path days) ÷ (advancing sessions per calendar day, had the throttle conversions advanced). `A1 path days for the target` = what the A1 unit map would have to shrink to for this profile to meet its target (average ≤ 140, fast ≤ 112) at its attendance.

## Calendar and load per profile, band and tier

`cal.days` = calendar days to finish the band (from the previous band's finish). `%throttled` = sessions converted to review by the backlog throttle. `load/budget` = mean due-review minutes ÷ the throttle threshold.

| profile | tier | band | start | finish | cal.days | sessions | est.min | sim.min | load/budget | %over | %throttled | %minimum | <4 rev/60d | recv-only <3/60d |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Retention

Measured from the learner's event log (`src/learner/events.ts`). The simulated answer is circular by design: P(first try) = R^exponent plus noise, R the FSRS retrievability, so the **average** profile (exponent 1) must land near the 90% target if the scheduler, the review budget and the warm-up cuts hold the promise; a drift is flagged. Fast (exponent 0.7) should sit above, forgetful (1.6) and irregular (long gaps) below. `first-try %` = scored reviews graded Good; `not-Again %` = Good or Hard (a retry pass counts); `mean R %` = mean retrievability just before the rating; `delayed >=7d` = reviews of nodes introduced at least 7 days earlier: first-try share, and `delayedAccuracy` (not-Again); `recombine` = not-Again on novel-recombination reviews; `production %` = `productionShare`; `chapter coverage %` = mean share of a chapter's required words that were stable when it was read (chapters never weighed count 100%); `deferred chapters` = chapters that waited for coverage at least once / chapters read or deferred.

| profile | tier | band | reviews | first-try % | not-Again % | mean R % | delayed >=7d first-try % / not-Again % (n) | recombine % (n) | production % | chapter coverage % | deferred chapters | flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

Event grades per run (again / hard / good / easy): .

Events by op: . Recap blocks: . Time cap: .

## Placement backlog

A learner placed at the start of a unit through the app's `applyPlacement` (skipped units seeded as known, first reviews spread over 28 days), no session on day 0, a session on day 1 (never skipped), then 30 days of the profile's normal attendance. `day-1 due min` = due-review minutes the compiler costs on the day after placement, against the warm-up budget (the throttle threshold); `within budget from day` = the first day after which every session fit the budget.

| profile | placed at | seeded nodes | day-1 due | day-1 due min | warm-up budget min | day-1 throttled | peak due min (day) | throttled sessions | within budget from day |
|---|---|---|---|---|---|---|---|---|---|
| fast | u10 (index 9) | 641 | 25 | 1.9 | 7.0 | no | 7.4 (15) | 0/33 | 15 |
| average | u10 (index 9) | 641 | 25 | 1.9 | 7.0 | no | 11.7 (15) | 1/28 | 30 |
| forgetful | u10 (index 9) | 641 | 25 | 1.9 | 7.0 | no | 14.2 (22) | 3/30 | 30 |
| irregular | u10 (index 9) | 641 | 25 | 1.9 | 7.0 | no | 16.9 (19) | 0/22 | 27 |
| fast | u20 (index 19) | 1262 | 26 | 2.0 | 7.0 | no | 9.9 (21) | 0/31 | 29 |
| average | u20 (index 19) | 1262 | 26 | 2.0 | 7.0 | no | 14.4 (12) | 2/31 | 30 |
| forgetful | u20 (index 19) | 1262 | 26 | 2.0 | 7.0 | no | 21.6 (25) | 6/26 | 29 |
| irregular | u20 (index 19) | 1262 | 26 | 2.0 | 7.0 | no | 14.8 (14) | 7/29 | 29 |

## Repeats, reviews and supply per run

`UNINTENDED REPEATS` must be 0 (stories, scenes, tasks, items, sentences re-shown without a label). `item rep.60d %` = non-deliberate exercise items repeated within 60 days (must be < 2%). `reused ctx` = review contexts re-served after ≥ 120 days (deliberate, `review-context-120d`). `multi %` = warm-up items reviewing 2-3 due nodes in one sentence.

| profile | tier | sessions | course done | unit reached | UNINTENDED REPEATS | item rep.60d % | (deliberate) | fresh sents | reused ctx | review items | multi % | targets/item | bare | shortages | recv-only | suspended | learned | owed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Sentences consumed per node (fresh), worst run

| kind | mean | p95 | max | quota (3 × p95) |
|---|---|---|---|---|

## Quota totals

| band | units | bank sentences | of which review ctx | chapters | scenes | writing tasks |
|---|---|---|---|---|---|---|
| A1 | 14 | 0 | 0 | 38 | 0 | 0 |
| A2 | 7 | 0 | 0 | 24 | 0 | 0 |
| **all** | 21 | **0** | 0 | 62 | 0 | 0 |

## Quotas per unit (3 × p95 demand across 0 runs; * = extrapolated)

| unit | sentences | (review ctx) | chapters | scenes | tasks | p95 demand s/c/sc/t | max demand s | shortages |
|---|---|---|---|---|---|---|---|---|
| u01* | 0 | 0 | 2 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u02* | 0 | 0 | 2 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u03* | 0 | 0 | 2 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u04* | 0 | 0 | 2 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u05* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u06* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u07* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u08* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u09* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u10* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u11* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u12* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u13* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u14* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u15* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u16* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u17* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u18* | 0 | 0 | 4 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u19* | 0 | 0 | 3 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u20* | 0 | 0 | 4 | 0 | 0 | 0/0/0/0 | 0 | 0 |
| u21* | 0 | 0 | 4 | 0 | 0 | 0/0/0/0 | 0 | 0 |

