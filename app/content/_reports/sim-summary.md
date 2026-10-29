# Fluidez 2 — simulator summary

Generated 2026-10-29T07:20:28.256Z by `npm run simulate -- --synthetic --supply 2 --days 1100 --tiers standard,extended` (seed 1).
Corpus: synthetic content on the real unit map and graph (+2330 synthetic lexemes: the unit map lists none yet); 60 units, 3900 nodes, 160320 sentences.

## Budgets in force (src/compiler/budget.ts)

| band | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| standard session min | 20 | 22 | 25 | 28 | 30 |
| warm-up budget min | 7 | 7 | 8 | 9 | 9 |
| extended session min | 35 | 37 | 40 | 43 | 45 |

Minimum tier 10 min (warm-up 5). Extended = standard + 15 core minutes (over-budget reviews first, then ≤ 24 extra-reading sentences; no extra grammar). Throttle: due minutes > warm-up (+15 on extended); severe > 2×.
Multi-item reviews: ≤ 3 due nodes per sentence, cost 1.4× a single review. Review-context reuse after ≥ 120 days (`review-context-120d`). Production cards: grammar/pattern/chunk/contrast, lexemes with freqRank ≤ 3000 (no rank: A1–B1 productive, B2–C1 receptive-only). Learned nodes: productive card up to 365 d, receptive card suspended.

## Tuning log

- 2026-10-29 coordinator defaults: session minutes A1 20 / A2 22 / B1 25 / B2 28 / C1 30; warm-up A1 6 / A2 6 / B1 7 / B2 8 / C1 8; minimum 10; extended +15 core; multi-item reviews (≤ 3, cost 1.4×); review-context reuse after 120 d; production cards by policy; recognition-only maintenance. Result (seed 1, standard): average A1 176 d (was 211), B2 throttle 12.8% (was 51.7%); fast A1 116 d.
- 2026-10-29 canDoAnother costs due reviews the way the warm-up will (multi-target groups) when given the content index, instead of one review per due card; "another" is offered exactly when it would not throttle.
- 2026-10-29 BAND_WARMUP_MINUTES +1 per band → A1 7 / A2 7 / B1 8 / B2 9 / C1 9. 3-seed means, standard tier: average throttle A1 9→6%, A2 18→10%, B1 16→13%, B2 11→7%, C1 17→10%; fast A1 114→108 d with 0% throttle (target ≤ ~112 met). Average A1 stays ~160–172 d: see the summary, it is attendance-bound, not review-bound.
- 2026-10-29 tried and rejected: MULTI_REVIEW_SCAN 80→250 (targets/item +0.05, calendar change within seed noise, compile cost ×2.5); B2/C1 warm-up 10–12. Forgetful B2 throttle (2 seeds) 31% at 9 min, 25% at 10, 24.5% at 11, 17% at 12; the average profile is already ~5% at 9 and gains nothing. Kept 9: a 10–12 min warm-up turns the 28-min B2 session into a 16–18 min core for every learner to help only the forgetful one.
- 2026-10-29 simulator: synthetic supply 2× (32 sentences per lexeme) for the quota run, so measured demand is not capped by the synthetic bank (bare reviews 0–4 instead of hundreds for forgetful).

## Targets

Targets: average-profile A1 ≤ ~140 calendar days, fast ≤ ~112; B2 throttle conversions < 25%.

| profile | tier | A1 days | A1 target | B2 %throttled | < 25%? |
|---|---|---|---|---|---|
| fast | standard | 115 | ✗ > 112 | 0.0 | ✓ |
| average | standard | 156 | ✗ > 140 | 5.1 | ✓ |
| forgetful | standard | 181 | - | 28.0 | ✗ |
| irregular | standard | 262 | - | 4.0 | ✓ |
| fast | extended | 118 | ✗ > 112 | 0.0 | ✓ |
| average | extended | 153 | ✗ > 140 | 0.0 | ✓ |
| forgetful | extended | 172 | - | 0.0 | ✓ |
| irregular | extended | 265 | - | 0.0 | ✓ |

**Where the A1 days go** (A1 path = 133 unit days; a day advances only on a completed non-minimum, non-converted session):

| profile | tier | A1 cal. days | days studied | sessions | "another" | minimum | throttle conv. | other conv. | advancing / cal. day | A1 days at 0 throttle | A1 path days for the target |
|---|---|---|---|---|---|---|---|---|---|---|---|
| fast | standard | 115 | 108 | 136 | 28 | 3 | 0 | 0 | 1.16 | 115 | 129 |
| average | standard | 156 | 140 | 150 | 10 | 17 | 0 | 0 | 0.85 | 156 | 119 |
| forgetful | standard | 181 | 156 | 161 | 5 | 5 | 23 | 0 | 0.73 | 154 | - |
| irregular | standard | 262 | 161 | 178 | 17 | 39 | 5 | 0 | 0.51 | 251 | - |
| fast | extended | 118 | 111 | 141 | 30 | 7 | 0 | 0 | 1.14 | 117 | 127 |
| average | extended | 153 | 133 | 152 | 19 | 19 | 0 | 0 | 0.87 | 153 | 121 |
| forgetful | extended | 172 | 138 | 145 | 7 | 11 | 1 | 0 | 0.77 | 171 | - |
| irregular | extended | 265 | 138 | 158 | 20 | 24 | 1 | 0 | 0.50 | 263 | - |

`A1 days at 0 throttle` = (A1 path days) ÷ (advancing sessions per calendar day, had the throttle conversions advanced). `A1 path days for the target` = what the A1 unit map would have to shrink to for this profile to meet its target (average ≤ 140, fast ≤ 112) at its attendance.

## Calendar and load per profile, band and tier

`cal.days` = calendar days to finish the band (from the previous band's finish). `%throttled` = sessions converted to review by the backlog throttle. `load/budget` = mean due-review minutes ÷ the throttle threshold.

| profile | tier | band | start | finish | cal.days | sessions | est.min | sim.min | load/budget | %over | %throttled | %minimum | <4 rev/60d | recv-only <3/60d |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fast | standard | A1 | 0 | 114 | 115 | 136 | 18.6 | 19.0 | 0.46 | 2.9 | 0.0 | 2.2 | 18/850 (2.1%) | - |
| fast | standard | A2 | 115 | 232 | 118 | 142 | 19.6 | 19.6 | 0.57 | 11.3 | 2.8 | 5.6 | 13/702 (1.9%) | - |
| fast | standard | B1 | 234 | 352 | 120 | 148 | 22.4 | 22.4 | 0.58 | 7.4 | 1.4 | 4.1 | 13/824 (1.6%) | - |
| fast | standard | B2 | 353 | 441 | 89 | 104 | 27.9 | 28.0 | 0.50 | 1.9 | 0.0 | 3.8 | 8/278 (2.9%) | 215/370 (58.1%) |
| fast | standard | C1 | 441 | 519 | 78 | 96 | 28.2 | 28.4 | 0.53 | 6.3 | 0.0 | 6.3 | 7/301 (2.3%) | 166/306 (54.2%) |
| average | standard | A1 | 0 | 155 | 156 | 150 | 19.5 | 19.3 | 0.80 | 28.7 | 0.0 | 11.3 | 0/850 (0.0%) | - |
| average | standard | A2 | 156 | 309 | 154 | 151 | 21.8 | 21.0 | 1.03 | 45.7 | 8.6 | 5.3 | 1/702 (0.1%) | - |
| average | standard | B1 | 310 | 499 | 190 | 185 | 22.4 | 21.5 | 1.01 | 48.6 | 11.9 | 12.4 | 0/824 (0.0%) | - |
| average | standard | B2 | 500 | 616 | 117 | 117 | 27.8 | 27.2 | 0.94 | 31.6 | 5.1 | 9.4 | 1/278 (0.4%) | 139/370 (37.6%) |
| average | standard | C1 | 617 | 738 | 122 | 108 | 29.9 | 29.1 | 0.97 | 42.6 | 10.2 | 6.5 | 0/301 (0.0%) | 97/306 (31.7%) |
| forgetful | standard | A1 | 0 | 180 | 181 | 161 | 21.0 | 20.1 | 1.14 | 58.4 | 14.3 | 3.1 | 2/850 (0.2%) | - |
| forgetful | standard | A2 | 181 | 417 | 237 | 204 | 21.4 | 19.9 | 1.38 | 74.5 | 27.0 | 9.3 | 0/702 (0.0%) | - |
| forgetful | standard | B1 | 418 | 679 | 262 | 225 | 23.8 | 22.2 | 1.41 | 70.7 | 30.7 | 7.1 | 1/824 (0.1%) | - |
| forgetful | standard | B2 | 681 | 860 | 181 | 164 | 26.3 | 24.7 | 1.49 | 67.7 | 28.0 | 11.0 | 0/278 (0.0%) | 86/370 (23.2%) |
| forgetful | standard | C1 | 861 | 1069 | 209 | 169 | 28.8 | 26.9 | 1.53 | 77.5 | 36.7 | 10.1 | 0/249 (0.0%) | 45/271 (16.6%) |
| irregular | standard | A1 | 0 | 261 | 262 | 177 | 18.1 | 17.8 | 0.90 | 32.2 | 2.8 | 22.0 | 5/850 (0.6%) | - |
| irregular | standard | A2 | 261 | 643 | 382 | 182 | 19.0 | 18.1 | 1.18 | 38.5 | 6.6 | 22.0 | 7/702 (1.0%) | - |
| irregular | standard | B1 | 644 | 1018 | 375 | 217 | 20.3 | 19.4 | 1.20 | 42.4 | 11.5 | 24.0 | 5/824 (0.6%) | - |
| irregular | standard | B2 | 1019 | - | - | 50 | 26.8 | 26.2 | 1.06 | 32.0 | 4.0 | 14.0 | 0/46 (0.0%) | 28/62 (45.2%) |
| irregular | standard | C1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |
| fast | extended | A1 | 0 | 117 | 118 | 140 | 23.5 | 23.9 | 0.17 | 1.4 | 0.0 | 5.0 | 24/850 (2.8%) | - |
| fast | extended | A2 | 117 | 225 | 108 | 131 | 26.1 | 26.1 | 0.19 | 0.0 | 0.0 | 0.8 | 15/702 (2.1%) | - |
| fast | extended | B1 | 226 | 335 | 110 | 140 | 28.9 | 28.9 | 0.20 | 0.0 | 0.0 | 0.0 | 14/824 (1.7%) | - |
| fast | extended | B2 | 336 | 421 | 86 | 102 | 33.8 | 34.0 | 0.20 | 1.0 | 0.0 | 2.0 | 3/278 (1.1%) | 202/370 (54.6%) |
| fast | extended | C1 | 421 | 499 | 78 | 99 | 33.1 | 33.2 | 0.27 | 6.1 | 0.0 | 9.1 | 6/301 (2.0%) | 168/306 (54.9%) |
| average | extended | A1 | 0 | 152 | 153 | 152 | 24.6 | 24.4 | 0.38 | 7.9 | 0.0 | 12.5 | 2/850 (0.2%) | - |
| average | extended | A2 | 153 | 302 | 150 | 141 | 27.8 | 27.0 | 0.39 | 7.1 | 0.0 | 7.8 | 2/702 (0.3%) | - |
| average | extended | B1 | 303 | 479 | 177 | 167 | 28.7 | 27.9 | 0.63 | 15.0 | 0.0 | 16.2 | 3/824 (0.4%) | - |
| average | extended | B2 | 481 | 600 | 121 | 113 | 34.8 | 34.1 | 0.48 | 8.8 | 0.0 | 11.5 | 0/278 (0.0%) | 151/370 (40.8%) |
| average | extended | C1 | 601 | 699 | 99 | 96 | 37.7 | 36.9 | 0.44 | 5.2 | 0.0 | 6.3 | 0/301 (0.0%) | 123/306 (40.2%) |
| forgetful | extended | A1 | 0 | 171 | 172 | 145 | 28.3 | 27.3 | 0.51 | 7.6 | 0.7 | 7.6 | 0/850 (0.0%) | - |
| forgetful | extended | A2 | 172 | 326 | 155 | 141 | 31.3 | 29.5 | 0.61 | 7.8 | 0.7 | 7.1 | 0/702 (0.0%) | - |
| forgetful | extended | B1 | 327 | 505 | 179 | 154 | 34.8 | 32.6 | 0.79 | 14.3 | 0.6 | 8.4 | 0/824 (0.0%) | - |
| forgetful | extended | B2 | 506 | 630 | 125 | 106 | 41.3 | 39.1 | 0.75 | 9.4 | 0.0 | 5.7 | 0/278 (0.0%) | 89/370 (24.1%) |
| forgetful | extended | C1 | 631 | 759 | 129 | 105 | 42.4 | 39.9 | 0.85 | 17.1 | 5.7 | 8.6 | 0/301 (0.0%) | 52/306 (17.0%) |
| irregular | extended | A1 | 0 | 264 | 265 | 158 | 24.1 | 23.8 | 0.37 | 5.7 | 0.6 | 15.2 | 11/850 (1.3%) | - |
| irregular | extended | A2 | 266 | 564 | 300 | 176 | 23.7 | 22.9 | 0.67 | 20.5 | 0.6 | 25.6 | 8/702 (1.1%) | - |
| irregular | extended | B1 | 565 | 890 | 326 | 194 | 25.8 | 24.9 | 0.72 | 24.7 | 1.0 | 26.8 | 11/824 (1.3%) | - |
| irregular | extended | B2 | 891 | - | - | 133 | 29.9 | 29.1 | 0.81 | 18.8 | 0.0 | 27.1 | 0/218 (0.0%) | 104/263 (39.5%) |
| irregular | extended | C1 | - | - | - | 0 | 0.0 | 0.0 | 0.00 | 0.0 | 0.0 | 0.0 | - | - |

## Repeats, reviews and supply per run

`UNINTENDED REPEATS` must be 0 (stories, scenes, tasks, items, sentences re-shown without a label). `item rep.60d %` = non-deliberate exercise items repeated within 60 days (must be < 2%). `reused ctx` = review contexts re-served after ≥ 120 days (deliberate, `review-context-120d`). `multi %` = warm-up items reviewing 2–3 due nodes in one sentence.

| profile | tier | sessions | course done | unit reached | UNINTENDED REPEATS | item rep.60d % | (deliberate) | fresh sents | reused ctx | review items | multi % | targets/item | bare | shortages | recv-only | suspended | learned | owed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fast | standard | 1182 | 519 | 60 | 0 | 0.00 | 8 | 28126 | 5374 | 19401 | 57.3 | 1.70 | 5 | 459 | 676 | 2955 | 3608 | 0 |
| average | standard | 1013 | 738 | 60 | 0 | 0.00 | 75 | 30446 | 4853 | 21876 | 65.5 | 1.81 | 0 | 208 | 676 | 2955 | 3574 | 0 |
| forgetful | standard | 950 | 1069 | 60 | 0 | 0.00 | 76 | 36077 | 4711 | 27110 | 72.7 | 1.89 | 4 | 0 | 676 | 2835 | 3252 | 3 |
| irregular | standard | 626 | - | 45 | 0 | 0.00 | 236 | 19408 | 1648 | 13036 | 79.6 | 2.14 | 0 | 1 | 154 | 2379 | 2398 | 0 |
| fast | extended | 1185 | 499 | 60 | 0 | 0.00 | 14 | 41208 | 5411 | 19394 | 57.1 | 1.70 | 0 | 472 | 676 | 2955 | 3607 | 0 |
| average | extended | 1013 | 699 | 60 | 0 | 0.00 | 109 | 42651 | 5118 | 22096 | 65.3 | 1.81 | 1 | 237 | 676 | 2955 | 3560 | 0 |
| forgetful | extended | 927 | 759 | 60 | 0 | 0.00 | 53 | 46417 | 7052 | 29230 | 71.4 | 1.90 | 1 | 176 | 676 | 2950 | 3466 | 0 |
| irregular | extended | 661 | - | 50 | 0 | 0.00 | 264 | 31564 | 2070 | 14693 | 76.7 | 2.07 | 0 | 0 | 365 | 2582 | 2777 | 0 |

## Sentences consumed per node (fresh), worst run

| kind | mean | p95 | max | quota (3 × p95) |
|---|---|---|---|---|
| chunk | 14 | 38 | 257 | 114 |
| lexeme | 7.6 | 16 | 369 | 48 |
| grammar | 84.7 | 192 | 381 | 576 |
| pattern | 11.5 | 25 | 267 | 75 |
| contrast | 17 | 30 | 401 | 90 |

## Quota totals

| band | units | bank sentences | of which review ctx | chapters | scenes | writing tasks |
|---|---|---|---|---|---|---|
| A1 | 14 | 32136 | 15015 | 38 | 51 | 180 |
| A2 | 13 | 29430 | 14781 | 44 | 48 | 165 |
| B1 | 14 | 33030 | 17961 | 42 | 54 | 180 |
| B2 | 10 | 23025 | 11415 | 50 | 42 | 126 |
| C1 | 9 | 23472 | 11247 | 45 | 57 | 114 |
| **all** | 60 | **141093** | 70419 | 219 | 252 | 765 |

## Quotas per unit (3 × p95 demand across 8 runs; * = extrapolated)

| unit | sentences | (review ctx) | chapters | scenes | tasks | p95 demand s/c/sc/t | max demand s | shortages |
|---|---|---|---|---|---|---|---|---|
| u01 | 2643 | 1011 | 2 | 3 | 15 | 881/2/1/5 | 881 | 0 |
| u02 | 2349 | 885 | 2 | 3 | 12 | 783/2/1/4 | 783 | 0 |
| u03 | 2037 | 870 | 2 | 3 | 12 | 679/2/1/4 | 679 | 0 |
| u04 | 2046 | 849 | 2 | 6 | 15 | 682/2/2/5 | 682 | 0 |
| u05 | 2409 | 1113 | 3 | 3 | 12 | 803/3/1/4 | 803 | 0 |
| u06 | 2100 | 903 | 3 | 3 | 12 | 700/3/1/4 | 700 | 0 |
| u07 | 2412 | 1113 | 3 | 3 | 12 | 804/3/1/4 | 804 | 0 |
| u08 | 2175 | 1005 | 3 | 6 | 15 | 725/3/2/5 | 725 | 0 |
| u09 | 2478 | 1335 | 3 | 3 | 12 | 826/3/1/4 | 826 | 0 |
| u10 | 2709 | 1278 | 3 | 3 | 12 | 903/3/1/4 | 903 | 0 |
| u11 | 1980 | 1077 | 3 | 3 | 12 | 660/3/1/4 | 660 | 0 |
| u12 | 2187 | 1218 | 3 | 6 | 15 | 729/3/2/5 | 729 | 0 |
| u13 | 2565 | 1248 | 3 | 3 | 12 | 855/3/1/4 | 855 | 0 |
| u14 | 2046 | 1110 | 3 | 3 | 12 | 682/3/1/4 | 682 | 0 |
| u15 | 2235 | 1113 | 3 | 3 | 12 | 745/3/1/4 | 745 | 0 |
| u16 | 2553 | 1200 | 3 | 6 | 15 | 851/3/2/5 | 851 | 0 |
| u17 | 2292 | 1242 | 3 | 3 | 12 | 764/3/1/4 | 764 | 0 |
| u18 | 2178 | 1065 | 4 | 3 | 12 | 726/4/1/4 | 726 | 0 |
| u19 | 2217 | 1140 | 3 | 3 | 12 | 739/3/1/4 | 739 | 0 |
| u20 | 2265 | 1050 | 4 | 6 | 15 | 755/4/2/5 | 755 | 0 |
| u21 | 2166 | 1107 | 4 | 3 | 12 | 722/4/1/4 | 722 | 0 |
| u22 | 2262 | 1107 | 3 | 3 | 12 | 754/3/1/4 | 754 | 0 |
| u23 | 2178 | 1167 | 4 | 3 | 12 | 726/4/1/4 | 726 | 0 |
| u24 | 2424 | 1245 | 3 | 6 | 15 | 808/3/2/5 | 808 | 0 |
| u25 | 2067 | 1071 | 4 | 3 | 12 | 689/4/1/4 | 689 | 0 |
| u26 | 2274 | 1068 | 3 | 3 | 12 | 758/3/1/4 | 758 | 0 |
| u27 | 2319 | 1206 | 3 | 3 | 12 | 773/3/1/4 | 773 | 0 |
| u28 | 2475 | 1191 | 3 | 6 | 15 | 825/3/2/5 | 825 | 0 |
| u29 | 2400 | 1386 | 3 | 3 | 12 | 800/3/1/4 | 800 | 0 |
| u30 | 2580 | 1416 | 3 | 3 | 12 | 860/3/1/4 | 860 | 0 |
| u31 | 2241 | 1329 | 3 | 3 | 12 | 747/3/1/4 | 747 | 0 |
| u32 | 2799 | 1494 | 3 | 6 | 15 | 933/3/2/5 | 933 | 0 |
| u33 | 2253 | 1344 | 3 | 3 | 12 | 751/3/1/4 | 751 | 0 |
| u34 | 2412 | 1257 | 3 | 3 | 12 | 804/3/1/4 | 804 | 0 |
| u35 | 2274 | 1212 | 3 | 3 | 12 | 758/3/1/4 | 758 | 0 |
| u36 | 2139 | 1143 | 3 | 6 | 15 | 713/3/2/5 | 713 | 0 |
| u37 | 2547 | 1374 | 3 | 3 | 12 | 849/3/1/4 | 849 | 0 |
| u38 | 2226 | 1359 | 3 | 3 | 12 | 742/3/1/4 | 742 | 0 |
| u39 | 2241 | 1182 | 3 | 3 | 12 | 747/3/1/4 | 747 | 0 |
| u40 | 2154 | 1080 | 3 | 6 | 15 | 718/3/2/5 | 718 | 1 |
| u41 | 2289 | 1194 | 3 | 3 | 12 | 763/3/1/4 | 763 | 0 |
| u42 | 2382 | 1254 | 5 | 6 | 12 | 794/5/2/4 | 794 | 0 |
| u43 | 2748 | 1293 | 5 | 3 | 12 | 916/5/1/4 | 916 | 0 |
| u44 | 2658 | 1290 | 5 | 6 | 15 | 886/5/2/5 | 886 | 0 |
| u45 | 2163 | 1080 | 5 | 3 | 12 | 721/5/1/4 | 721 | 0 |
| u46 | 2352 | 1272 | 5 | 3 | 12 | 784/5/1/4 | 784 | 0 |
| u47 | 2325 | 1155 | 5 | 3 | 12 | 775/5/1/4 | 775 | 0 |
| u48 | 2139 | 1041 | 5 | 6 | 15 | 713/5/2/5 | 713 | 0 |
| u49 | 1974 | 900 | 5 | 6 | 12 | 658/5/2/4 | 658 | 0 |
| u50 | 2580 | 1431 | 5 | 3 | 12 | 860/5/1/4 | 860 | 0 |
| u51 | 1704 | 699 | 5 | 3 | 12 | 568/5/1/4 | 568 | 0 |
| u52 | 2031 | 906 | 5 | 9 | 15 | 677/5/3/5 | 677 | 0 |
| u53 | 2337 | 1251 | 5 | 6 | 12 | 779/5/2/4 | 779 | 0 |
| u54 | 2622 | 1458 | 5 | 6 | 12 | 874/5/2/4 | 874 | 0 |
| u55 | 2232 | 1149 | 5 | 3 | 12 | 744/5/1/4 | 744 | 0 |
| u56 | 2151 | 1029 | 5 | 9 | 15 | 717/5/3/5 | 717 | 0 |
| u57 | 2583 | 1281 | 5 | 6 | 12 | 861/5/2/4 | 861 | 0 |
| u58 | 2568 | 1377 | 5 | 3 | 9 | 856/5/1/3 | 856 | 0 |
| u59 | 3504 | 1530 | 5 | 6 | 12 | 1168/5/2/4 | 1168 | 0 |
| u60 | 3444 | 1266 | 5 | 9 | 15 | 1148/3/3/5 | 1148 | 0 |

