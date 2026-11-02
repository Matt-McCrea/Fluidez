# Fluidez 2: simulator summary

Generated 2026-11-02T08:04:22.344Z by `npm run simulate -- --real --days 365 --tiers standard` (seed 1).
Modes: `--real` runs the app's own `ContentLoader` over the real A1 and A2 content (real sentences, scripts, chapters; no quotas.json write); `--synthetic` generates a corpus on the real unit map and graph; `--placement uNN` adds 30-day runs of a learner placed at that unit through the app's `applyPlacement`.
Model: grades follow the runner (`gradeOf`: first-try pass Good, retry pass Hard, miss Again; never Easy). A failed first draw is retried at P + (1 - P) x retryGain. Multi-target warm-up items are answered once, graded uniformly, and passed through `attributeGrades` (no card evidence in the simulator, so uniform). The recap block uses the runner's capacity rule and `planRecap`; lapsed re-asks are real reviews (op `recap`), new items exposure. Each choose/type/transform/recombine outcome steps the ladder (`stepRung`). Optional blocks are skipped and card runs cut when the plan's minutes are spent. Not modelled: "I don't know" (a miss either way), and the attribution evidence.
Corpus: the real content through the app's ContentLoader (`--real`: bands A1 and A2 only; sentences, scripts, chapters, scenes and writing tasks as the app loads them); 27 units, 6149 nodes, 28377 sentences.

## Budgets in force (src/compiler/budget.ts)

| band | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| standard session min | 20 | 22 | 25 | 45 | 52 |
| warm-up budget min | 7 | 7 | 8 | 14 | 14 |
| extended session min | 35 | 37 | 40 | 60 | 67 |

Minimum tier 10 min (warm-up 5). Extended = standard + 15 core minutes (over-budget reviews first, then ≤ 24 extra-reading sentences; no extra grammar). Throttle: due minutes > warm-up (+15 on extended); severe > 2×.
Multi-item reviews: ≤ 3 due nodes per sentence, cost 1.4× a single review. Review-context reuse after ≥ 120 days (`review-context-120d`). Production cards: grammar/pattern/chunk/contrast, lexemes with freqRank ≤ 3000 (no rank: A1-B1 productive, B2-C1 receptive-only). Learned nodes: productive card up to 365 d, receptive card suspended.

## Tuning log

- 2026-10-29 coordinator defaults: session minutes A1 20 / A2 22 / B1 25 / B2 28 / C1 30; warm-up A1 6 / A2 6 / B1 7 / B2 8 / C1 8; minimum 10; extended +15 core; multi-item reviews (≤ 3, cost 1.4×); review-context reuse after 120 d; production cards by policy; recognition-only maintenance. Result (seed 1, standard): average A1 176 d (was 211), B2 throttle 12.8% (was 51.7%); fast A1 116 d.
- 2026-10-29 canDoAnother costs due reviews the way the warm-up will (multi-target groups) when given the content index, instead of one review per due card; "another" is offered exactly when it would not throttle.
- 2026-10-29 BAND_WARMUP_MINUTES +1 per band → A1 7 / A2 7 / B1 8 / B2 9 / C1 9. 3-seed means, standard tier: average throttle A1 9→6%, A2 18→10%, B1 16→13%, B2 11→7%, C1 17→10%; fast A1 114→108 d with 0% throttle (target ≤ ~112 met). Average A1 stays ~160-172 d: see the summary, it is attendance-bound, not review-bound.
- 2026-10-29 tried and rejected: MULTI_REVIEW_SCAN 80→250 (targets/item +0.05, calendar change within seed noise, compile cost ×2.5); B2/C1 warm-up 10-12. Forgetful B2 throttle (2 seeds) 31% at 9 min, 25% at 10, 24.5% at 11, 17% at 12; the average profile is already ~5% at 9 and gains nothing. Kept 9: a 10-12 min warm-up turns the 28-min B2 session into a 16-18 min core for every learner to help only the forgetful one.
- 2026-10-29 simulator: synthetic supply 2× (32 sentences per lexeme) for the quota run, so measured demand is not capped by the synthetic bank (bare reviews 0-4 instead of hundreds for forgetful).
- 2026-10-29 playtest: SECONDS.learn 35→55 (what the player really takes); first-week ramp: at most 8 new items per session in the first 3 core sessions (day 1 listed 11); a plan over its session minutes drops new items from the end of the learn pool (owed, never lost) until it fits.
- 2026-11-02 debt policy (R18): due cards more than a day overdue, or seeded by placement and not reviewed since, are debt: they no longer throttle, and are paid out of the warm-up budget the fresh cards leave, at most 20 cards a session (40 on a review day). A learner away 7 or more days gets a 10-card warm-up and the next chapter, and the day waits. Real A1 and A2, 365 days, seeds 1/2/3, policy off then on. Longest run of sessions without anything new: fast 1/2/1 to 1/1/1, average 2/2/3 to 1/1/1, forgetful 3/3/3 to 1/2/1, irregular 3/2/2 to 2/1/2, returner (away 21 days) 4/4/3 to 2/2/2, lapsed (away 60) 4/3/3 to 1/3/2, placed at u20 1/2/2 to 1/1/2, the same at 30 s a card 7/7/5 to 2/1/3. Two of 24 runs still reach 3: both a throttle on fresh cards (not debt), one with the day under it a scheduled review. Sessions throttled: average 22/25/27% to 6/2/4%, forgetful 40/38/40% to 9/10/6%, slow placed 58/61/54% to 26/33/26%. First-try recall within 1.6 points for every profile but forgetful (to 80.7 to 82.2 from 81.9 to 83.4) and the slow placed one (84.0 to 85.4 from 87.3 to 87.9). Cards due at the end of a year, forgetful seed 3: 214, 101 of them a week late (58 and none with the policy off). With 3 days instead of 1 the longest run stayed at 3 or 4 (seed 1). Tried and kept: 20 cards a session (12 left forgetful at 78.7).
- 2026-11-02 B2 and C1 minutes 28/30 to 45/52 (F16: a standing decision, and 28/30 contradicted it), warm-up 9/9 to 14/14. Real content through C1, placed at u45 (B2) and u58 (C1), 15 s a card, 120 days, seeds 1/2/3 (the u45 runs): 28/30 with warm-up 9: nodes introduced 503/511/494, owed at the end 148/95/118, sessions over their minutes 30%; 45/52 with warm-up 9: 660/610/631 introduced, owed 1/2/2, none over; 45/52 with warm-up 14: 611/570/707 introduced, owed 1/2/6, none over. The minutes buy the new items (+22 to +29%) and empty the owed queue. The larger warm-up lowers the share of B2 sessions the throttle converts (19/14/14% to 8/5/11%) but not the number of items introduced (634 against 629 on average), since the debt policy has already taken the throttle off most of them. Kept, as M8 asked; the plans use 33 of 47 minutes, because their content is capped by items, not minutes, until topic lessons exist (F16, L4).
- 2026-11-02 the story (L7, F13, L6): a chapter or a scene no longer waits for chunks, lexemes and patterns the unit has scheduled by today and the learner is owed (R26; they are glossed); a grammar point or a word the unit has not reached still gates it. A day with no chapter to read is not called a story day on Home, and on day 1 the first chapter comes after the new phrases and before the lesson (minute 14 to minute 8). Real A1 and A2, 365 days, seeds 1/2/3, before then after: share of core sessions that read a first chapter or play a scene, fast 42/41/41% to 43/43/43, average 40/41/41 to 43/43/43, forgetful 38/37/37 to 43/43/43, irregular 34/37/35 to 40/42/40, returner 37/37/36 to 42/43/43, lapsed 37/36/36 to 43/42/43, placed 42/46/43 to 44/45/40; the longest run without anything new, same seeds: forgetful 1/2/1 to 1/1/1, irregular 2/1/2 to 1/1/1, lapsed 1/3/2 to 1/2/1, returner 2/2/2 to 3/1/1 (a throttle on fresh cards, 3 days running). The 70% L7 asks for is not reached: chapters still come only on the days the unit lists them, and the serialised daily beat is not built.

## Targets

Targets: average-profile A1 ≤ ~140 calendar days, fast ≤ ~112; B2 throttle conversions < 25%.

| profile | tier | A1 days | A1 target | B2 %throttled | < 25%? |
|---|---|---|---|---|---|
| fast | standard | 117 | ✗ > 112 | - | - |
| average | standard | 153 | ✗ > 140 | - | - |
| forgetful | standard | 168 | - | - | - |
| irregular | standard | 277 | - | - | - |

**Where the A1 days go** (A1 path = 133 unit days; a day advances only on a completed non-minimum, non-converted session):

| profile | tier | A1 cal. days | days studied | sessions | "another" | minimum | throttle conv. | other conv. | advancing / cal. day | A1 days at 0 throttle | A1 path days for the target |
|---|---|---|---|---|---|---|---|---|---|---|---|
| fast | standard | 117 | 111 | 140 | 29 | 7 | 0 | 0 | 1.14 | 117 | 127 |
| average | standard | 153 | 136 | 146 | 10 | 13 | 0 | 0 | 0.87 | 153 | 121 |
| forgetful | standard | 168 | 144 | 152 | 8 | 16 | 2 | 0 | 0.80 | 164 | - |
| irregular | standard | 277 | 174 | 192 | 18 | 55 | 0 | 4 | 0.48 | 277 | - |

`A1 days at 0 throttle` = (A1 path days) ÷ (advancing sessions per calendar day, had the throttle conversions advanced). `A1 path days for the target` = what the A1 unit map would have to shrink to for this profile to meet its target (average ≤ 140, fast ≤ 112) at its attendance.

## Calendar and load per profile, band and tier

`cal.days` = calendar days to finish the band (from the previous band's finish). `%throttled` = sessions converted to review by the backlog throttle. `load/budget` = mean due-review minutes ÷ the throttle threshold.

| profile | tier | band | start | finish | cal.days | sessions | est.min | sim.min | load/budget | %over | %throttled | %minimum | <4 rev/60d | recv-only <3/60d |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fast | standard | A1 | 0 | 116 | 117 | 140 | 20.1 | 18.8 | 0.38 | 0.0 | 0.0 | 5.0 | 0/863 (0.0%) | 32/88 (36.4%) |
| fast | standard | A2 | 117 | 223 | 107 | 135 | 21.8 | 20.6 | 0.49 | 0.7 | 0.0 | 3.7 | 0/684 (0.0%) | 25/83 (30.1%) |
| fast | standard | B1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | 0/11 (0.0%) | - |
| fast | standard | B2 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | 0/4 (0.0%) | 1/2 (50.0%) |
| fast | standard | C1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | 0/1 (0.0%) | 1/3 (33.3%) |
| average | standard | A1 | 0 | 152 | 153 | 146 | 20.1 | 18.7 | 0.49 | 0.0 | 0.0 | 8.9 | 0/861 (0.0%) | 32/88 (36.4%) |
| average | standard | A2 | 153 | 297 | 145 | 144 | 21.4 | 20.3 | 0.61 | 4.9 | 0.0 | 9.7 | 0/287 (0.0%) | 8/27 (29.6%) |
| average | standard | B1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | 0/3 (0.0%) | - |
| average | standard | B2 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |
| average | standard | C1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |
| forgetful | standard | A1 | 0 | 167 | 168 | 151 | 20.0 | 18.7 | 0.59 | 8.6 | 1.3 | 10.6 | 0/777 (0.0%) | 20/79 (25.3%) |
| forgetful | standard | A2 | 167 | 346 | 179 | 157 | 21.1 | 19.9 | 0.71 | 17.8 | 1.9 | 15.3 | 0/167 (0.0%) | 1/2 (50.0%) |
| forgetful | standard | B1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |
| forgetful | standard | B2 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |
| forgetful | standard | C1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |
| irregular | standard | A1 | 0 | 276 | 277 | 192 | 17.0 | 15.9 | 0.41 | 1.6 | 0.0 | 28.6 | 5/735 (0.7%) | 30/79 (38.0%) |
| irregular | standard | A2 | 277 | - | - | 52 | 18.4 | 17.5 | 0.45 | 1.9 | 0.0 | 26.9 | 0/27 (0.0%) | - |
| irregular | standard | B1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |
| irregular | standard | B2 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |
| irregular | standard | C1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |

## Retention

Measured from the learner's event log (`src/learner/events.ts`). The simulated answer is circular by design: P(first try) = R^exponent plus noise, R the FSRS retrievability, so the **average** profile (exponent 1) must land near the 90% target if the scheduler, the review budget and the warm-up cuts hold the promise; a drift is flagged. Fast (exponent 0.7) should sit above, forgetful (1.6) and irregular (long gaps) below. `first-try %` = scored reviews graded Good; `not-Again %` = Good or Hard (a retry pass counts); `mean R %` = mean retrievability just before the rating; `delayed >=7d` = reviews of nodes introduced at least 7 days earlier: first-try share, and `delayedAccuracy` (not-Again); `recombine` = not-Again on novel-recombination reviews; `production %` = `productionShare`; `chapter coverage %` = mean share of a chapter's required words that were stable when it was read (chapters never weighed count 100%); `deferred chapters` = chapters that waited for coverage at least once / chapters read or deferred.

| profile | tier | band | reviews | first-try % | not-Again % | mean R % | delayed >=7d first-try % / not-Again % (n) | recombine % (n) | production % | chapter coverage % | deferred chapters | flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fast | standard | A1 | 7134 | 91.7 | 99.6 | 90.0 | 92.1 / 99.6 (4956) | 100.0 (89) | 59.2 | 98.5 | 3/38 |  |
| fast | standard | A2 | 5513 | 92.3 | 99.5 | 90.0 | 91.9 / 99.4 (3735) | 100.0 (7) | 56.2 | 99.6 | 0/44 |  |
| fast | standard | B1 | 84 | 92.9 | 100.0 | 89.9 | 91.2 / 100.0 (57) | - | 60.7 | - | - |  |
| fast | standard | B2 | 48 | 93.8 | 100.0 | 90.0 | 93.5 / 100.0 (31) | - | 52.1 | - | - |  |
| fast | standard | C1 | 25 | 92.0 | 100.0 | 89.4 | 93.8 / 100.0 (16) | - | 32.0 | - | - |  |
| fast | standard | all | 12804 | 92.0 | 99.5 | 90.0 | 92.0 / 99.5 (8795) | 100.0 (96) | 57.8 | 99.1 | 3/82 |  |
| average | standard | A1 | 7298 | 89.6 | 99.1 | 89.7 | 89.4 / 99.0 (4975) | 100.0 (89) | 57.8 | 97.9 | 5/38 |  |
| average | standard | A2 | 3366 | 88.6 | 99.2 | 89.7 | 88.2 / 99.2 (2022) | 100.0 (7) | 54.0 | 99.4 | 0/44 |  |
| average | standard | B1 | 30 | 96.7 | 100.0 | 89.6 | 94.4 / 100.0 (18) | - | 50.0 | - | - |  |
| average | standard | all | 10694 | 89.3 | 99.1 | 89.7 | 89.1 / 99.1 (7015) | 100.0 (96) | 56.6 | 98.7 | 5/82 |  |
| forgetful | standard | A1 | 7852 | 81.7 | 96.5 | 89.0 | 82.3 / 97.0 (5414) | 100.0 (88) | 55.8 | 97.5 | 6/38 |  |
| forgetful | standard | A2 | 1796 | 81.2 | 96.5 | 88.8 | 81.3 / 96.4 (1174) | 100.0 (9) | 53.7 | 98.9 | 2/44 |  |
| forgetful | standard | B1 | 4 | 100.0 | 100.0 | 89.4 | 100.0 / 100.0 (2) | - | 50.0 | - | - |  |
| forgetful | standard | all | 9652 | 81.6 | 96.5 | 88.9 | 82.2 / 96.9 (6590) | 100.0 (97) | 55.4 | 98.2 | 8/82 |  |
| irregular | standard | A1 | 6015 | 86.9 | 98.6 | 87.6 | 86.7 / 98.4 (4240) | 100.0 (61) | 57.4 | 98.5 | 3/38 |  |
| irregular | standard | A2 | 370 | 83.8 | 97.3 | 84.2 | 80.5 / 97.0 (231) | 100.0 (1) | 55.4 | 98.6 | 0/12 |  |
| irregular | standard | all | 6385 | 86.8 | 98.5 | 87.5 | 86.4 / 98.3 (4471) | 100.0 (62) | 57.3 | 98.5 | 3/50 |  |

Event grades per run (again / hard / good / easy): fast/standard 474/2062/38212/0; average/standard 977/2155/32490/0; forgetful/standard 1617/2976/26034/0; irregular/standard 624/1328/17628/0.

Events by op: fast/standard recap 1031, warmup 12752, recombine 96; average/standard recap 723, warmup 10578, recombine 96; forgetful/standard recap 455, warmup 10279, recombine 97; irregular/standard recap 315, warmup 6356, recombine 62. Recap blocks: fast 253 run (44 lapsed, 981 new re-asked), 135 empty; average 190 run (53 lapsed, 658 new re-asked), 128 empty; forgetful 136 run (122 lapsed, 325 new re-asked), 146 empty; irregular 97 run (38 lapsed, 269 new re-asked), 78 empty. Time cap: fast 20 sessions cut (24 blocks or runs); average 50 sessions cut (60 blocks or runs); forgetful 69 sessions cut (92 blocks or runs); irregular 36 sessions cut (54 blocks or runs).

## Repeats, reviews and supply per run

`UNINTENDED REPEATS` must be 0 (stories, scenes, tasks, items, sentences re-shown without a label). `item rep.60d %` = non-deliberate exercise items repeated within 60 days (must be < 2%). `reused ctx` = review contexts re-served after ≥ 120 days (deliberate, `review-context-120d`). `multi %` = warm-up items reviewing 2-3 due nodes in one sentence.

| profile | tier | sessions | course done | unit reached | UNINTENDED REPEATS | item rep.60d % | (deliberate) | fresh sents | reused ctx | review items | multi % | targets/item | bare | script | shortages | recv-only | suspended | learned | owed | due at end | (a week late) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fast | standard | 409 | 223 | 27 | 0 | 0.00 | 117 | 12777 | 621 | 11292 | 11.3 | 1.12 | 1989 | 351 | 191 | 177 | 1416 | 1584 | 0 | 13 | 0 |
| average | standard | 352 | 297 | 27 | 0 | 0.00 | 132 | 10783 | 396 | 9297 | 12.7 | 1.14 | 1769 | 348 | 154 | 144 | 1041 | 1156 | 256 | 12 | 0 |
| forgetful | standard | 324 | 346 | 27 | 0 | 0.00 | 186 | 8767 | 354 | 8214 | 14.2 | 1.15 | 2117 | 410 | 149 | 93 | 806 | 884 | 608 | 26 | 0 |
| irregular | standard | 244 | - | 17 | 0 | 0.00 | 71 | 6034 | 201 | 5208 | 18.5 | 1.21 | 1124 | 185 | 71 | 86 | 640 | 707 | 210 | 223 | 144 |

## Sentences consumed per node (fresh), worst run

| kind | mean | p95 | max | quota (3 × p95) |
|---|---|---|---|---|
| chunk | 6.1 | 11 | 22 | 33 |
| lexeme | 6.7 | 12 | 38 | 36 |
| grammar | 34.6 | 55 | 234 | 165 |
| pattern | 7.3 | 15 | 19 | 45 |

## Quota totals

| band | units | bank sentences | of which review ctx | chapters | scenes | writing tasks |
|---|---|---|---|---|---|---|
| A1 | 14 | 19755 | 13320 | 38 | 48 | 75 |
| A2 | 13 | 19587 | 12531 | 44 | 48 | 90 |
| **all** | 27 | **39342** | 25851 | 82 | 96 | 165 |

## Quotas per unit (3 × p95 demand across 4 runs; * = extrapolated)

| unit | sentences | (review ctx) | chapters | scenes | tasks | p95 demand s/c/sc/t | max demand s | shortages |
|---|---|---|---|---|---|---|---|---|
| u01 | 2307 | 1443 | 2 | 3 | 9 | 769/2/1/3 | 769 | 8 |
| u02 | 1701 | 1212 | 2 | 3 | 3 | 567/2/1/1 | 567 | 10 |
| u03 | 1434 | 1044 | 2 | 3 | 3 | 478/2/1/1 | 478 | 4 |
| u04 | 1287 | 822 | 2 | 3 | 9 | 429/2/1/3 | 429 | 4 |
| u05 | 1374 | 972 | 3 | 3 | 6 | 458/3/1/2 | 458 | 13 |
| u06 | 1281 | 864 | 3 | 3 | 6 | 427/3/1/2 | 427 | 6 |
| u07 | 1140 | 822 | 3 | 3 | 3 | 380/3/1/1 | 380 | 13 |
| u08 | 1281 | 816 | 3 | 6 | 6 | 427/3/2/2 | 427 | 2 |
| u09 | 1125 | 798 | 3 | 3 | 3 | 375/3/1/1 | 375 | 4 |
| u10 | 1227 | 810 | 3 | 3 | 3 | 409/3/1/1 | 409 | 4 |
| u11 | 1296 | 843 | 3 | 3 | 9 | 432/3/1/3 | 432 | 4 |
| u12 | 1368 | 930 | 3 | 6 | 9 | 456/3/2/3 | 456 | 8 |
| u13 | 1518 | 1044 | 3 | 3 | 3 | 506/3/1/1 | 506 | 12 |
| u14 | 1416 | 900 | 3 | 3 | 3 | 472/3/1/1 | 472 | 0 |
| u15 | 1266 | 855 | 3 | 3 | 3 | 422/3/1/1 | 422 | 12 |
| u16 | 1431 | 1014 | 3 | 6 | 12 | 477/3/2/4 | 477 | 7 |
| u17 | 1389 | 900 | 3 | 3 | 3 | 463/3/1/1 | 463 | 5 |
| u18 | 1524 | 1014 | 4 | 3 | 3 | 508/4/1/1 | 508 | 2 |
| u19 | 1413 | 957 | 3 | 3 | 9 | 471/3/1/3 | 471 | 3 |
| u20 | 1548 | 1137 | 4 | 6 | 6 | 516/4/2/2 | 516 | 1 |
| u21 | 1422 | 999 | 4 | 3 | 6 | 474/4/1/2 | 474 | 1 |
| u22 | 1533 | 1104 | 3 | 3 | 3 | 511/3/1/1 | 511 | 6 |
| u23 | 1383 | 990 | 4 | 3 | 6 | 461/4/1/2 | 461 | 5 |
| u24 | 1287 | 879 | 3 | 6 | 9 | 429/3/2/3 | 429 | 2 |
| u25 | 1587 | 1050 | 4 | 3 | 12 | 529/4/1/4 | 529 | 1 |
| u26 | 1614 | 843 | 3 | 3 | 12 | 538/3/1/4 | 538 | 5 |
| u27 | 2190 | 789 | 3 | 3 | 6 | 730/3/1/2 | 730 | 4 |

