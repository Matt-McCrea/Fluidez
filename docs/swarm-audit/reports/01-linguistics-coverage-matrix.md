# 01. Linguistics coverage matrix: the complete grammatical system

Specialist: Spanish linguistics, whole-system coverage. Claims: `docs/swarm-audit/claims/L-coverage.jsonl` (39 claims, prefix LC, every quote checked verbatim against its file by script).

## Verdict in one paragraph

The syllabus is broad and the writing is good. The hard-rule cleanliness of the Spanish is better than I expected: 24 mechanical grammar lints over 103,451 Spanish strings found six real errors, all the same spelling rule. The rule text in the 172 grammar scripts is mostly accurate, and many explanations give a model you can reuse. The problems are structural, and they are serious. The contrast layer, 94 scripts written to separate the exact pairs that English speakers confuse, is never taught in a lesson. Drills for contrast topics practise the wrong thing: a por/para drill asks "Which one is about us (we)?". Most grammar points are taught once and never named again. A small group of B2 mood rules teach falsehoods with total confidence. About 25 real gaps remain, the worst being the semantics of the preterite with state verbs, adjective position, derivational morphology and copular agreement.

## 1. What was investigated

Fully read, not sampled:
- `rule`, `smallPrint` and `pitfalls` of all 172 grammar scripts, in course order (231 KB).
- `app/src/compiler/compile.ts` (teach, drill, remix, warm-up, takeNew, decide), `app/src/ui/session/cards.ts` (review and practice cards), `app/src/ui/blocks/teach.tsx`, `app/src/exercises/ladder.ts` and parts of `input.ts`, `reinflect.ts`, `pairs.ts`.
- `sequence.md`.

Measured by script, over all content:
- Per node, for all 172 grammar, 94 contrast and 650 pattern nodes: bank target rows, rows requiring the node after its first unit, focus days and later focus days, writing focus, scene turn focus. Scripts are in the scratchpad (`lc/metrics.py`, `lc/matrix.py`).
- 24 hard-rule lints over all bank rows, accept lists, chapters, script examples, scenes and writing models (`lc/lint.py`).
- 591 real sessions, 31,096 cards: a learner placed at the start of each of the 60 units, 10 sessions each, using the app's own compiler, card builders and runner through the test driver (`lc/sim.ts`). One of the 60 runs stopped early (see section 7).
- 2 `render.ts` passes read card by card (u15, u16), plus drill cards pulled from the simulation for u08, u12, u18, u28 and u33.
- PCIC gramática item list (`spec/pcic.json`, 2,084 items A1 to C1) against every node's `pcic` field.
- 83 topic probes across graph, scripts and bank for suspected gaps (`lc/probe.py`).

Sampled only: script `examples`, `readAndPick` and `yourTurn` (read in full for about ten scripts); contrast scripts (full rule read for six, absolute claims scanned in all 94); patterns (ids and titles for all, rule text for about 12).

## 2. Evidence from the actual application

### 2.1 The size of the system

Of 172 grammar nodes: 132 have 60 or more target rows, 40 have fewer. 39 have zero rows anywhere listing them in `requires`, so they exist only in their own topup rows. 105 of 172 never appear in a later unit's focus list. 52 have at most one writing task, and 43 of those are B1 or above. 37 have at most two scene turns.

### 2.2 What a learner actually gets on a contrast

The compiler calls `this.teach()` from two places: line 841 for grammar, line 1115 for patterns. Neither reaches a contrast. In the 591 sessions:

| Teach blocks by node kind | Count |
|---|---|
| grammar | 159 |
| pattern | 93 |
| contrast | 0 |

A contrast node reaches the learner as a learn item. It shows a "New" card with its one aligned pair and several retrievals of that pair. `alignedPairs` reads only `es` and `en`, never `forms`. Result across the 94 contrasts: 84 have one pair, 3 have two, and 7 have none (x:pret-imp, x:saber-conocer, x:saber-poder, x:tu-usted, x:commands-tu-usted, x:para-porque, x:permitir-inf-que). For x:ser-estar-adj, the learner retrieves *Es aburrido = He's boring* and is never asked for *Está aburrido*. That is one side of the contrast, in the session named for the contrast (`render.ts 15`, day 2, cards 33, 36, 39).

Reviews do no better. No bank row lists an x: node in targets or requires (0 of 72,693), so `reviewItem` falls to a bare card every time: 663 contrast cards in the simulation, all in warm-up or recap, showing the same single pair. For the 7 with no pair, 67 cards say "Remember this one?", a read card with no question.

The promised interleaving does not exist. `drill()` and `remix()` call `pickContrast`, then `pickSentences(contrast, 1)`, which returns nothing. 269 blocks declared a contrast; none produced a contrast card. x:ser-estar-adj appears on 24 day focus lists and 23 of those are `review` days, which ignore contrast focus entirely. The 13 to 24 recurrences of x:pret-imp, x:lo-le, x:ser-estar-adj, x:por-para and x:creo-no-creo in the unit plans do nothing.

The scripts do exist in Look-up (`GRAMMAR_KINDS` in `reference/model.ts` includes contrast). A motivated learner could find them. No learner is sent there.

### 2.3 What a drill tests

`practiceCard` case `pick` shuffles all features and takes the first that fits the sentence, regardless of the node being drilled (`cards.ts` line 686). The ladder gaps only same-lemma forms and shows the infinitive as a cue (`ladder.ts`, `analyseGap`, `wrong`: "Forms of the same lemma the item rules OUT"). Sessions show what follows:

| Drill | Real cards |
|---|---|
| g:ser-estar-adjectives, u15 d2 | "Choose the right form: Esto ___ para ustedes." options es, fue, era, eres. "El jugo ___ rico." options estuvo, está, estoy, estás. Not one card offers ser against estar |
| g:por-para-1, u18 d1 | "Which one is about us (we)?": Pasé / Pasamos / Pasó por Honda. "Which one is about now?": ¿Por dónde pasa / pasó el bus? |
| g:pret-vs-imperfect, u12 d1 | "What does it mean?" for *Cuando volví, ya era de noche*, with distractors "I used to work more and sleep less" and "I pulled the chair up to Hernando's". The Spanish verbs need no processing |
| g:subj-opinion-negated, u28 d1 | 9 of 9 pick cards are meaning cards with unrelated distractors |

Across all 31,096 cards, minimal-pair cards that oppose the two sides (measured by a heuristic: options that contain both sides and differ by at most two words): ser/estar 1, hay/está 1, por/para 8, lo-la/le 11. saber/conocer and pedir/preguntar: none. The `copula` feature exists in `input.ts` and fired zero times in 1,456 structured-input cards. By feature: tense 398, person 113, mood 43, number 20, porpara 8, gender 8, clitic 3, and 863 plain meaning cards.

In fairness, translation does test production: 18,675 of 31,096 cards are typed, and a translation of *I don't think it's true* demands *sea*. But it tests only the form the English cues, and English does not cue ser/estar, por/para, or preterite/imperfect in the sentence. Where the choice is hard, the learner gets one attempt at the sentence with no contrast feedback. The why line is "It uses special." or "Here is how Spanish says it."

### 2.4 Thin nodes

40 grammar nodes have under 60 target rows, and they are the conceptually hardest: g:ser-estar-adjectives 21, g:exclamations 24, g:que-vs-cual 25, g:ojala-past 25, g:article-uses 28, g:reported-speech-full 30, g:ser-estar-c1 30, g:por-para-2 31, g:deber-modal 31, g:cleft-focus 33, g:topic-fronting 34, g:se-meaning-change 39, g:evaluative-adverbs 0. 39 of the 40 have no rows at all listing them in `requires` (g:discourse-structure has 106), because the tagger cannot detect them, so a thousand bank sentences that use ser or estar with an adjective never count. In `render.ts 15` the node's whole bank is used on its first drill day: "communicative: 0/4 unseen gated sentences" and "no unseen gated writing task". After that, reviews have nothing fresh for 120 days.

### 2.5 Production checks

These are better than the drills. 875 writing tasks and 1,474 scene turns. Of 777 grammar-focused turns only 24 have no `require`. There are 84 `subjunctiveAfter` scene checks and 11 in writing, plus `verbForm`, `anyVerbInTense` and regex. A learner must actually produce the structure in many cases. The weak spot is breadth: 43 B1 and above nodes have one writing task or none, and 61 of 94 contrasts have no scene turn, 77 no writing task.

### 2.6 Accuracy by lint

Over 103,451 strings: no article errors with feminine stressed a, no *un otro*, no *la problema*, no *hay el*, no *habían muchos*, no *si tendría*, no *cuando llegará*, no *ojalá viene*, no *no creo que es*, no *gusta los*, no dequeísmo after creer or pensar. One queísmo candidate (w-u46-13 "se acordó que") is correct: it means it was agreed. Real hits: 6, all of the y to e or o to u rule. This is a genuine strength and must be preserved.


### 2.7 The coverage matrix

Key. Q1: Y yes, P partial. Q2 and Q3: my reading of all grammar scripts on that topic. Q4: sequence. Q5, examples natural: hard-rule lint clean for every topic. I read samples for ser/estar, topic fronting and word order only, so treat Q5 as "no mechanical defects", not as proof of naturalness. Bank-sample readers should fill this. Q6 verdict: **T+** form cards and translation both test it; **T** translation tests it, no discrimination card; **D** the topic is a discrimination and no generated card makes that choice; **R** recognition by decision. Target rows count grammar and pattern targets in the topic; contrasts are always 0. Q7 reports later focus days, then bank rows requiring the topic after its first unit. Later focus days of contrasts are inert (section 2.2). Q8: writing tasks with this focus, then scene turns.

| Topic | Nodes | Units | Q1 exists | Q2 accurate | Q3 explained | Q4 sequence | Q6 verdict | Q6 target rows (thin nodes) | Q7 later focus days, rows requiring it later | Q8 writing, scene turns | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Articles, gender, agreement | 8 | u1 to u59 | Y | OK; -ma family absent (LC-033) | Good | OK | T+ | 798 (2) | 3, 51907 | 14, 20 | Agreement rule strong; zero-article is thin at 28 rows |
| Subject pronouns and tú/usted | 3 | u1 to u13 | Y, inside g:ser-identity | OK | Good | OK | T | 465 (0) | 0, 11048 | 5, 11 | x:tu-usted script never served |
| Demonstratives | 2 | u7 to u40 | Y | OK | Good | OK | T+ | 172 (1) | 1, 1926 | 5, 6 | Referring-back has one false pitfall (LC-007) |
| Possessives | 6 | u5 to u34 | Y | OK | Good | OK | T+ | 416 (1) | 2, 696 | 10, 15 | PCIC section 5 has only 5 of 49 items cited, but the scripts do cover the content |
| Quantifiers and indefinites | 6 | u5 to u34 | Y | OK | Good | OK | T+ | 703 (0) | 2, 3606 | 13, 23 | ambos, varios, demás, tal: no node |
| Numbers, dates, clock | 5 | u5 to u11 | P, patterns only | OK | Fair | OK | T | 0 (0) | 0, 1105 | 2, 4 | 0 target rows; no grammar script for cien/ciento, mil, millón de, gender of hundreds |
| ser and estar | 13 | u1 to u59 | Y | One heuristic fails (LC-034) | Good | OK | D | 1107 (2) | 24, 16887 | 17, 36 | Best model (portrait or snapshot) sits in an unserved script; 21 rows at A2 |
| hay | 2 | u7 to u7 | Y | OK | Good | OK | D | 222 (0) | 0, 1482 | 4, 4 | hay is taught as invariable; había also. Contrast unserved |
| Present regular | 3 | u1 to u9 | Y | OK | Good | OK | T+ | 892 (0) | 1, 21647 | 15, 13 | Strong |
| Irregular present | 3 | u3 to u10 | Y | OK | Good | OK | T+ | 711 (0) | 0, 13505 | 8, 12 | Strong; boot model is reusable |
| Reflexive and pronominal | 6 | u9 to u52 | P | OK | Fair | Late for aspectual se (B1, C1) | T | 389 (1) | 1, 4562 | 7, 7 | Meaning-change list is short: 3 pairs plus parecerse |
| Direct and indirect objects | 5 | u5 to u58 | Y | OK | Good | OK | D | 579 (0) | 15, 8438 | 13, 18 | No lo/le choice card outside scripts. Leísmo never named |
| Pronoun placement and clusters | 5 | u10 to u18 | Y | OK | Good | OK | T+ | 915 (0) | 7, 4838 | 18, 33 | Among the best sequences in the course |
| gustar family | 4 | u3 to u16 | Y | OK | Good | OK | T+ | 687 (0) | 1, 3226 | 14, 19 | provocar (Colombia) as pattern? not checked |
| Prepositions | 10 | u3 to u58 | P | Medium (LC-035, 036) | Fair | Late (g:verbs-prepositions at u49) | D | 373 (3) | 11, 4768 | 10, 26 | No core node for a, en, de, con, sobre as a system; por/para drill runs off target |
| Questions | 4 | u2 to u23 | Y | Low (cuál + noun, LC-024) | Good | OK | T | 395 (2) | 1, 4617 | 8, 17 | que-vs-cual 25 rows |
| Preterite forms | 5 | u4 to u11 | P | Omits saber stem (LC-027) | Good | OK | T+ | 1018 (0) | 1, 17775 | 17, 33 | No meaning-shift rule: supe, conocí, no quise |
| Imperfect and aspect | 6 | u6 to u58 | Y | OK | Good | OK | D | 694 (1) | 12, 7061 | 18, 29 | Scene and event model is strong and reusable. No card forces the choice |
| Perfect and pluperfect | 7 | u8 to u52 | Y | OK | Good | Continuative perfect far too late (LC-028) | T | 437 (1) | 1, 686 | 9, 25 | Sequence respects the owner's preterite-first decision |
| Future and conditional | 11 | u3 to u45 | Y | Low (rumour note) | Good | Conjecture before plain future: unusual, defensible | T | 1296 (2) | 3, 5717 | 26, 44 | 9 of 11 nodes never in a later focus list |
| Imperatives | 6 | u13 to u51 | P | OK | Good | OK | T | 797 (1) | 2, 2903 | 17, 28 | No nosotros imperative as a form: hablemos, vámonos, sentémonos; a + infinitive absent |
| Subjunctive forms | 7 | u21 to u60 | Y | Low (LC-009, LC-032) | Good | OK | T+ | 1800 (0) | 5, 8259 | 15, 25 | Built from known forms; ladder excludes subjunctive gaps |
| Subjunctive noun clauses | 12 | u21 to u59 | Y | High (LC-001 to 005) | Good | OK | T | 1518 (0) | 18, 1900 | 16, 38 | Strongest teaching of the course, with its worst factual error at B2 |
| Subjunctive adverbial | 8 | u27 to u44 | Y | Medium (LC-010, 012) | Good | OK | T+ | 792 (0) | 1, 786 | 9, 21 | Mood feature fires here (9 of 9 pick cards on cuando) |
| Subjunctive relative | 4 | u33 to u53 | Y | OK | Good | OK | T | 449 (0) | 2, 674 | 5, 17 | Exists-or-not model is reusable |
| Sequence of tenses | 3 | u41 to u50 | P | OK | Fair | OK | T | 348 (0) | 0, 596 | 2, 4 | No node for present main with past subordinate (me alegro de que vinieras) or for no backshift |
| Hypotheticals | 10 | u17 to u57 | Y | Medium (LC-014, 015) | Good | OK | T+ | 1211 (1) | 3, 1840 | 18, 36 | si + past indicative untaught |
| Reported speech | 9 | u12 to u46 | Y | Medium (LC-029) | Good | OK | T | 1333 (2) | 5, 11034 | 19, 27 | Nine nodes; good coverage |
| Passive and impersonal | 8 | u9 to u46 | Y | Medium (LC-013) | Good | OK | T | 737 (1) | 2, 2213 | 15, 25 | Impersonal se with personal a: absent |
| se system | 6 | u9 to u36 | P | OK | Fair | OK | D | 632 (1) | 1, 6314 | 13, 17 | x:se-three-ways is the only map of the system and it is unserved; no taxonomy for the learner |
| Relative clauses | 7 | u14 to u55 | Y | Medium (LC-006) | Good | OK | T | 693 (0) | 0, 3515 | 13, 25 | cuyo, el cual covered |
| Causal, consecutive, concessive, temporal | 11 | u9 to u58 | Y | Medium (LC-011, 025, 026) | Good | OK | T+ | 1649 (1) | 6, 2299 | 26, 38 | Strong breadth |
| Comparison | 8 | u11 to u58 | Y | OK | Good | OK | T+ | 949 (0) | 3, 1611 | 14, 30 | Strong |
| Periphrases of aspect | 15 | u8 to u52 | P | OK | Good | OK | T | 1067 (0) | 2, 1695 | 17, 21 | Each seen once. andar, venir + gerund, tener + participle, estar a punto de, acababa de: no node |
| Obligation and modality | 6 | u8 to u52 | Y | Medium (LC-013) | Good | OK | T | 364 (1) | 2, 577 | 8, 19 | Good handling of no tienes que vs no debes |
| Verbs of change | 3 | u30 to u43 | P | OK | Good | OK | T | 173 (0) | 0, 354 | 2, 2 | convertirse en: 0 nodes, 18 rows. 2 writing tasks, 2 scene turns for a central topic |
| Neuter lo | 5 | u28 to u52 | P | OK | Good | OK | T | 525 (0) | 2, 1102 | 7, 9 | Pro-predicate lo (lo es, lo estoy): absent, PCIC B2 |
| Diminutives and word formation | 4 | u22 to u56 | P | Low (LC-016) | Fair | OK | T | 466 (1) | 2, 717 | 7, 10 | No derivation: prefixes, suffixes, augmentatives. Largest true gap in vocabulary grammar |
| Negation | 6 | u5 to u54 | Y | OK | Good | OK | T+ | 493 (0) | 0, 1891 | 10, 21 | Good; ni siquiera and sino que are late |
| Doubling and topicalisation | 2 | u25 to u47 | Y | OK | Good | OK | T | 186 (1) | 0, 595 | 4, 8 | Direct object doubling with pronouns (la vi a ella) barely present |
| Clefts and focus | 4 | u42 to u60 | P | Omission (LC-037) | Fair | OK | T | 148 (3) | 0, 4 | 5, 14 | Verb-subject order for new subjects never taught; copular agreement absent |
| Discourse connectors | 6 | u26 to u60 | Y | OK | Good | OK | T | 537 (4) | 4, 162 | 9, 17 | evaluative-adverbs has 0 bank rows; oral markers live in chunks |
| Register and politeness | 6 | u27 to u59 | Y | OK | Good | OK | T | 254 (4) | 2, 9 | 6, 32 | Colombian softeners well done; sumercé absent in a Bogotá story |
| Non-finite clauses | 5 | u9 to u56 | Y | OK | Good | OK | T | 221 (3) | 3, 127 | 7, 13 | Three thin nodes |
| Regional recognition | 3 | u51 to u60 | Y | Low to medium (LC-008, 009) | Good | OK | R | 347 (1) | 2, 4 | 4, 17 | Recognition only, by decision. Leísmo missing |

Reading the matrix. Inflection, placement and clause-linking topics are in good shape. Everything marked D is a topic where English gives no cue, which is exactly where a learner needs the app most: ser/estar, hay/está, object pronouns, prepositions, the se system, preterite/imperfect.

### 2.8 True gaps: structures an advanced learner needs that no node covers

Checked by node titles and ids, script text and bank counts, then PCIC. "0 scripts" means no rule, smallPrint or pitfall mentions it.

| Gap | Evidence | Level | PCIC | Severity |
|---|---|---|---|---|
| Preterite meaning shift: supe, conocí, no quise, pude | 41 bank rows of saber preterite, 71 of conocer; bank translates them correctly, 0 scripts explain | A2 | not checked | high |
| Adjective position, apocope and meaning change: gran hombre, viejo amigo, pobre, único, buen, mal | 0 nodes; PCIC 2.4 items uncited; 34 bank rows of these | B1, B2 | 2.4 | high |
| Negated knowing with indicative: no sabía que | 18 bank rows, 0 scripts, and g:subj-perception-negated contradicts it | B1 | not checked | high |
| Word formation: des-, in-, re-, -ción, -dor, -ble, -oso, -ero, -ería, -dad, -ismo, -ista | 0 nodes; only p:subir-subida, p:encarecer-abaratar, p:cargar-descargar; g:nominalisation is one C1 lesson | A2 to C1 | partly (appreciative suffixes only found) | high |
| Copular agreement: lo importante son, el problema son, lo que necesito son | 0 nodes, 0 scripts, 0 bank rows | B1 | B1 item | medium |
| Unipersonal agreement: los colombianos somos, las mujeres sabemos, la mayoría estamos | 0 nodes, 4 bank rows | B1 | not checked | medium |
| Pro-predicate lo: ¿Estás cansado? Sí, lo estoy; lo es | 0 nodes, 12 bank rows | B2 | B2 | medium |
| Impersonal se with personal a: se ayudó a los vecinos, se los vio, se le ve cansado | 0 nodes, 2 bank rows | B2 | not checked | medium |
| Verb-subject order with new subjects: llegó Vale, se cayó la pared, faltan dos | No rule. g:word-order-style covers fronted quantifiers only | B1 | not checked | medium |
| Periphrases: estar a punto de (3 rows), andar + gerund, venir + gerund (5 rows), tener + participle (2 rows), acababa de (17 rows, 9 exact) | No node; g:acabar-de pitfall even says acabar stays in the present | B1, B2 | not checked | medium |
| Verbs of change: convertirse en | 0 nodes, 0 scripts, 18 bank rows | B1 | not checked | medium |
| Nosotros imperative: hablemos, sentémonos, vámonos; a + infinitive, ¡A comer! | Only chunks c:no-hablemos-de-eso, c:vamos-a. 80 bank rows use the forms | A2, B1 | not checked | medium |
| Si + past indicative: si llegó anoche, si tenía plata la gastaba | 0 nodes; x:si-real-unreal handles present only | B1 | not checked | medium |
| Whether-si against if-si | No contrast. Rule says would never follows si (LC-014) | B1 | not checked | medium |
| Present main with past subordinate: me alegro de que vinieras | Not stated. g:subj-perfect marks viniste wrong and gives only hayas venido | B2 | not checked | medium |
| No backshift when still true: dijo que viene mañana | 0 scripts | B1 | not checked | medium |
| Prepositions as a system: a, en, de, con, sobre, por space and time | 124 patterns by phrase; no node on en versus a for motion and place, en for on and in, de versus desde, sobre, hasta | A1, A2 | not checked | medium |
| Preposition before que; dequeísmo and queísmo as a rule | One line each in two scripts (LC-036) | B1 | Not listed | medium |
| Entre tú y yo, según tú, excepto yo | 0 nodes, 5 bank rows | A2 | not checked | medium |
| Reflexive sí mismo, consigo, por sí mismo | 0 nodes, 0 scripts, 19 bank rows | B2 | C1 | low |
| Leísmo and laísmo recognition; le for usted in Colombia | 0 anywhere. PCIC names Colombian varieties at B2 | B2 | B2, C1 | low to medium |
| Conjunctions e and u | No script; 6 errors found | A2 | 14.1 | low |
| tal como, ambos, no hay quien | 1, 6 and 5 bank rows, no nodes | B2 | not checked | low |
| Augmentatives and pejoratives: -ón, -azo, -ote, -ucho | 0 nodes, 0 bank rows | B2 | adjectives with appreciative suffixes at B2 | low |
| Pretérito anterior recognition: apenas hubo llegado | 0 nodes. Literary only | C1 | not found by search | low |
| Colombian focus ser: yo vivo es en Bogotá; sumercé | 0 nodes. The story is set in Bogotá. Not in PCIC, so absence is expected but it is a missed recognition item | C1 | No | low |
| Gender breakers as a family | LC-033 | A1 | 1.2 | medium |

Claims of "well covered" that held up after opening the scripts: object pronoun placement and clusters, stem change and yo-irregular verbs, comparatives, relative clause progression, the four-layer subjunctive route (wanting, wishes, opinion, value, doubt, then adverbial, then relative), hace and desde hace, sino and pero, por and para rule of thumb, narrative pasts, softening.

Node titles that promise more than the script gives: g:conditional-advanced (siempre y cuando, LC-031), g:exclamations (¡Qué tan lindo!, LC-030), g:se-meaning-change (3 pairs only), g:verbs-prepositions (7 verbs, at u49).

## 3. Specific problems

### P1. Contrast scripts are never taught. Critical.

Locus: `compile.ts` lines 841 and 1115; all 94 `app/content/scripts/x_*.json`.
Evidence: section 2.2. 0 of 252 teach blocks; 94 scripts, roughly 450 KB of rendered teaching.
Learner consequence: the course's answer to "tengo frío or estoy cansado", "lo or le", "fue or era", "saber or conocer" is a card that says *Es aburrido = He's boring*. The rule the owner paid for is in a reference page few will open. Pedagogically this is the largest single loss in the app, because these are the distinctions that English speakers carry for years.
Fix: treat a contrast as a teachable node. On the day it enters, push `teach(x, 'light')`: examples, rule, pairs, your turn. Budget: the block adds about 6 minutes; patterns days already do this for up to `PATTERNS_TAUGHT` nodes. Keep it to one a day. Cost: compiler change of a few lines plus budget tuning. All content exists already, though scripts need a review pass once they become live (they were written and never exposed to learners).

### P2. Contrast memory is a single sentence, or nothing. Critical.

Locus: `pairs.ts` `alignedPairs`, `cards.ts` bare review, 89 of 94 contrasts carry `forms` that are ignored.
Evidence: 84 with one pair, 7 with none; 663 bare cards; 67 "Remember this one?"; 0 bank rows target an x: node.
Consequence: a learner reviews x:ser-estar-adj for a year and is asked only for *Es aburrido*. FSRS records strength for a skill that was never tested.
Fix, strongest option: give contrasts their own exercise type. A contrast card takes one sentence with a gap and offers the two sides, drawn from the script's `yourTurn` and a new pool of 40 to 80 contrast rows per major contrast, tagged in `targets`. Build-time drafting through the gate is established practice. Interim fix: `segments` should use `forms`, and review should alternate sides.

### P3. Drills are off target. Critical for discrimination topics.

Locus: `cards.ts` line 686, `ladder.ts` `analyseGap`, `compile.ts` `drill()`.
Evidence: section 2.3.
Consequence: a learner finishes "por or para" day having chosen between hablo and hablamos. Where such a card scores, the node gets credit for a tense or person choice, so grades on the node say little about the distinction it names.
Fix: three changes. (a) A `drillFeature` map from node to feature, so the pick block prefers `copula` on ser/estar, `porpara` on por/para, `clitic` on lo/le, `mood` on subjunctive nodes, with `tense` restricted to aspect nodes. Small change. (b) Add lemma-crossing gaps: a `chooseAcross` item where the options are the competing words (es / está; por / para; lo / le; sepa / sabe) and the cue is the English meaning, never the infinitive. The English must then be disambiguating, which argues for hand or model-drafted rows. (c) Replace meaning cards in structured input with minimal English pairs: *He's boring / He's bored*. Meaning distractors from random sentences need no grammar.

### P4. Grammar is taught once and not re-taught. High.

Locus: unit plans; `compile.ts`.
Evidence: 105 of 172 grammar nodes have no later focus day. Topic clusters such as Relative clauses, Sequence of tenses, Verbs of change and Clefts have zero. Spaced review exists in FSRS, but it reviews a sentence, not the concept, and in practice serves whichever sentence is due.
Consequence: at u40 a learner has not seen an explanation of ser/estar since u15, or pret/imperfect since u12. Nothing connects u12 to u31 (g:narrative-pasts) to C1 (x:imperfecto-tres-usos). Spiral teaching is absent: the same topic is not reopened at a higher level, except for these chains: ser/estar (u1, u2, u15, u58), por/para (u18, u35), subjunctive. The review days listed in unit plans for the five main contrasts do nothing (section 2.2).
Fix: make review days real. For the top 12 contrasts, a review day shows a one-screen reminder of the model, then 8 to 10 contrast cards at the current band's vocabulary. Add spiral nodes only where needed: pret/imperfect at B1 with state verbs, ser/estar at B1 with passive and participles, por/para at B2 with idioms.

### P5. A B2 mood rule is false. High. LC-001, LC-002, LC-003.

Locus: `g_subj-perception-negated.json`.
Quote: "Put *no* in front and you are no longer vouching, so the verb after *que* switches to the past form that ends in *-ra*". Pitfalls strike through *No vi que Vale estaba enojada* and *No dijo que era urgente*.
Consequence: both are correct Spanish with a useful meaning. Mood is a choice here, and that choice is the whole point of B2 mood. The rule also contradicts bank rows at u26, u42 and u52 (*no sabía que Rosa tenía una deuda*). The learner is taught to overuse the subjunctive at the moment that they should be learning it carries meaning.
Fix: replacement text in the claims. Add a contrast node, no sabía que against no creo que.

### P6. The perfect's main Latin American job arrives at C1. High. LC-028.

Locus: `p_perfecto-still-live.json` at u52; `g_perfecto-experience.json` pitfall "*He* is for ever, never and not yet."
Consequence: continuing states (*Siempre he vivido aquí*, *Últimamente he estado cansado*) have no taught form for 44 units. This does not conflict with the preterite-first decision.
Fix: move the node to A2.

### P7. The preterite of state verbs is never explained. High. LC-027.

Locus: `g_preterite-irregular-strong.json`, and x:pret-imp, g:pret-vs-imperfect.
Consequence: the deepest thing about Spanish aspect, that *sabía* and *supe* are different events and that *conocí* means *met*, is left to inference from translation cards. An English speaker has no way to infer it from "I knew".
Fix: LC-027 now, and a node at B1: "Verbs that change meaning in the past": supe, conocí, quise, no quise, pude, no pude, tuve, hubo.

### P8. Adjective position has no node. High.

Locus: graph; PCIC 2.4 (15 items uncited by any node).
Consequence: g:adjective-agreement says the describing word "usually comes after the noun" and stops. Learners never get *un gran hombre* against *un hombre grande*, *mi viejo amigo*, *pobre hombre*, or apocope as a rule, though *buen*, *mal*, *gran* appear in 748 bank rows. C1 reading depends on this.
Fix: one A2 node (buen, mal, gran, primer, tercer) and one B2 node (meaning change and evaluative preposition). Scripts plus 120 target rows each, plus two contrasts.

### P9. Thin hard nodes. High.

Locus: 40 nodes, section 2.4.
Consequence: the rows run out on the first drill. Reviews go bare or wait 120 days. The hardest concepts get the fewest repetitions in the whole course.
Fix: raise the gate's floor for thin nodes to about 120 rows, and more importantly build tagger detection for these nodes so ordinary bank rows count. ser/estar + adjective is detectable. If detection is impossible, draft targeted rows through the gate.

### P10. Overconfident absolutes. Medium. LC-004 to 006, LC-009 to 015, LC-029.

Small print says *always* and *never* where Spanish offers a choice: *para que always takes the present subjunctive*, *they always take the subjunctive* (with siempre que), *after a preposition you need an article or quien*, *no dudo que* takes indicative, *the would form never follows si*. Each is a one-line fix in the claims. Deliberate early simplification is fine, but these ones are stated as laws and contradict other content.

### P11. Sequencing of verb and preposition. Medium. LC-036.

g:verbs-prepositions enters at u49, though g:questions-prepositions at u37 already relies on the idea and about 60 phrase-level patterns come earlier. Move the concept to around u28 and keep the formal list at B2.

### P12. Dialect drift. Low to medium. LC-024, LC-025, LC-026.

The script base is well localised, and that is rare. Three slips: *apenas* restricted to the past when Latin America uses it for the future too; *nada más* + infinitive unlabelled; *cuál* + noun treated as non-existent. Add accept entries in the checker for ¿Cuál libro…?

## 4. What the application does well and must be preserved

- **The Spanish itself.** Lint results in section 2.6 are unusual for a corpus of this size. Whatever gate and drafting process produced it should stay.
- **Reusable models.** The scene-and-event test for the two pasts ("try putting and then in front"), exists-or-not for relative mood, "declines to put the claim on the table" for negated opinion, boot verbs, person first then thing for clusters, portrait or snapshot for ser and estar. Teach more like these.
- **The order of the subjunctive.** Entering through usted commands, then wanting, then wishes, opinion, value, doubt, adverbial, relative, past, is a genuinely good route, and using command forms as the bridge reduces the load.
- **Colombian detail.** *¿Será que…?*, *me regala*, *un tintico*, *ya comiste*, *qué pena*, *cordial saludo*, the honest treatment of *hubiera* in both halves of a conditional. Preserve the voice.
- **Honest register labels.** Passive with ser: "expect to read this more than to say it". Future subjunctive: "never use it yourself". Good.
- **Scene and writing checks** that require the structure (`subjunctiveAfter`, `verbForm`, regex).
- **Translation as the main output.** It is 18,675 typed cards out of 31,096 and matches the owner's preference. The missing piece is discrimination, not more translation.
- **Pattern coverage.** 650 patterns catch much of what a grammar-only syllabus misses: personal a, soler, volver a, llevar + gerund, aspectual se, ni emphatic, reduplicative *pase lo que pase*.

## 5. Missing capabilities

1. A contrast exercise type: two competing words, one sentence, English that disambiguates, feedback that names the model.
2. A concept review: one screen recalling a model by name, then cards, tied to spaced scheduling on the concept and not only on sentences.
3. Node-to-feature mapping for drills.
4. Tagger coverage for discourse-level grammar, or a stated policy for nodes that cannot be tagged.
5. A learner-facing map of systems: all uses of *se*, all uses of *lo*, all uses of *que*, the mood decision. x:se-three-ways and x:que-three-ways are the seeds, unserved.
6. Spiral lessons: the same concept reopened with more depth at a later band.
7. Credit attribution that distinguishes "passed a tense card on a por/para sentence" from "chose por over para".

## 6. Recommended improvements

Ranked by learner value. Cost in brackets. The owner asked for the strongest option, so cost is not the filter.

1. Serve contrast scripts in lessons (small compiler change; budget tuning).
2. Add the contrast exercise type and rows for the top 25 contrasts (medium engineering; about 2,000 drafted rows).
3. Feature-aligned drills (small).
4. Make review days run real contrast review (small to medium).
5. Apply accepted claims (trivial).
6. New nodes: preterite meaning shift, adjective position (two), word formation (a strand of four to six), copular and unipersonal agreement, pro-predicate lo, impersonal se with a, verb-subject order, si + past indicative, if against whether, no sabía que against no creo que, nosotros imperative, periphrases group, convertirse en (medium, content pipeline exists).
7. Move p:perfecto-still-live to A2; move the verb-preposition concept to B1.
8. Deepen thin nodes (medium).
9. Spiral lessons for the five main contrasts (medium).

## 7. Uncertainties and limitations

- I did not read all script examples, readAndPick or yourTurn items, nor the 450 KB of contrast script text. The contrast scripts have not been tested on learners. Before serving them, someone must read all 94.
- Q5 of the matrix rests on lint and spot reading. I did not read the bank-sample files.
- Simulated sessions place a learner at each unit with earlier nodes known. Backlog shape differs from a real long-term learner. The bare-card counts for contrasts are therefore indicative in size, but the mechanism is confirmed by code.
- The simulator answers everything right, so remediation paths were not exercised.
- u02's run threw `FSRSValidationError: Invalid delta_t "-1"` on session 3 using the test driver. It may be a harness clock artefact. I did not investigate. Worth a look.
- Bank counts for gap topics use regexes and can undercount. "0 nodes" was checked by id and title, not exhaustively by reading 404 chunks; a chunk may partly cover a phrase.
- PCIC coverage: 73 section-level `pcic` references make many sections look 100 percent covered. Citing a section does not prove teaching, so I used item-level gaps as leads only.
- Confidence in claims is stated per claim. Regional claims (LC-016, LC-026, LC-024) are the softest. LC-001 to LC-003 are the ones I am most sure of among the teaching errors.
- Standing-decision limitation: no listening means *momentico*, voseo and vosotros recognition are text only; g:voseo-recognition says "You will hear it", though nothing in the app is heard.
- Not assessed: vocabulary, pronunciation, cultural content, checker behaviour beyond reading a few paths.

## 8. Suggested implementation priorities

Week one. Apply LC-001 to LC-003, then the remaining accepted claims. Make `pick` feature-aligned. Serve contrast scripts on the day they enter.

Next. Build the contrast card and rows for the 12 contrasts with the highest error risk: ser/estar adjective, ser/estar location and event, hay/está, por/para, pret/imperfect, lo/le, saber/conocer, indicative/subjunctive after creer, cuando, aunque, relative, and the si pair. Review days then point at them.

Then. Content additions from section 2.8, by severity: preterite meaning shift, adjective position, word formation strand, then the medium gaps. Move p:perfecto-still-live and the verb-preposition concept earlier.

After that. Tagger detection for thin nodes, spiral lessons, the system maps, and credit attribution by feature.
