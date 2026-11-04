# The rebuild's content, judged (4 November 2026)

A read of `app/content` (story ch001 to ch030 in full plus ch059 to 061, 099, 100, 150, 200, 219; the first 12 taught scripts and 8 later ones; 8 scenes; 40 random bank rows) and of the code that serves it. Nothing was run or edited.

## Bottom line

The owner's impressions are accurate, but the main cause is not the writing. Most of the Spanish is better than it looks in the app. What breaks it is how it is served: each chapter is cut into 55-word pieces, one per session; the closing screen shows the same end-of-chapter hook after every piece; some questions are asked before the part that answers them; the same chapter or scene is shown again in several ways, all marked "deliberate", so the repeat checks never count them. There are real content faults as well: about a quarter of A1 chapters are bent around a grammar or vocabulary list, the premise sits in English glosses rather than in the Spanish, and the A1 scenes contradict the story.

| Content | Verdict | Why |
|---|---|---|
| Story (219 chapters) | Salvageable with rewrite | Plot holds through ch030 and gets strong later; early chapters need the premise in the Spanish and drill passages removed; word counts are pinned to caps |
| Teaching scripts (916) | Salvageable as is, light edits | Clear, forms shown, readable by a beginner |
| Scenes (270) | Salvageable with rewrite; u01 to u03 rewritten or discarded | Good format and decent mid-course dialogue; A1 scenes contradict the story; 128 scenes need items scheduled units later |
| Bank (72,709) | Salvageable after a cleaning pass | 32 of 40 natural, 0 wrong, 8 stilted; 5 English glosses off |

## 1. Story

Chapters read (coherence 5 = coherent and natural, 1 = incoherent): ch001 118 words 4 (premise only in glosses); ch002 4; ch003 4 (joke works only via gloss); ch004 4 (good twist); ch005 3; ch006 3 (gustar list); ch007 5 (best early chapter); ch008 3 (price drill); ch009 4; ch010 3 (numbers drill); ch011 3 (adjective list); ch012 4; ch013 3 (months list); ch014 4; ch015 2 (drops the letter after one line); ch016 3; ch017 3; ch018 2 (perfect drill); ch019 3; ch020 2 (19 days skipped in "Pasan los días"); ch021 3; ch022 2 (reflexive timetable); ch023 4 (strong); ch024 3; ch025 2 (lo/la joke invisible without gloss); ch026 4; ch027 4; ch028 2 (childhood vocabulary dump); ch029 3; ch030 3; ch060 (u21, 258 words) 2 (subjunctive-of-influence drill, lion/fish non sequitur); ch100 (u33, 342) 4; ch150 (u47, 443) 4; ch200 (u57, 597) 5; ch219 (u60, 978) 4.

The plot thread continues sensibly; weak spots are ch015 abandoning the letter, ch020 skipping 19 days, ch023 referring to a letter nobody has read. Length is set by caps, not scene: u03 to u14 run 166 to 183 words, u15 to u27 226 to 261, then about 350, 450, 600, 1,000. Glosses carry the premise: ch001 glosses "en la puerta del café de Rosa" as "(La Esquina de Rosa, closed since her funeral)" and "Altamira" as "a hotel company that is buying up the street"; the Spanish never says Rosa is dead until ch005's "Rosa no vuelve".

Questions are shuffled at display time (`app/src/ui/session/cards.ts:1011-1019`); the longest option is right in 22 to 31% of questions by unit band, close to chance, but length balancing clipped some correct options into telegraphic English ("Chess, sport", "She writes and eats all").

Worst (ch022): "Tomás borra los precios de la pizarra y escribe: «5:00: me despierto y me levanto. 5:05: me ducho, me afeito y me peino. 22:00: me acuesto». / Vale: ¿Y no te vistes? ¿Vienes al café en toalla?" Best (ch007): "Tomás: Bueno, compré mango. Yo pregunté: «¿Me hace una rebajita, señor?». Y él: «¿Cuántas libras lleva?». Y yo: «Cuarenta». / Vale: ¿Cuarenta libras de mango? / Tomás: Y una mazorca. Gratis." And ch200: "Desde el árbol, Simón miró la silla vacía y habló con la voz de Hernando. / Simón: ¿Y mi tinto, mijo? ¿Y mi tinto? / Gloria se rio con la cara mojada... / Gloria: Ese pájaro no respeta el luto."

### Why the story repeats

1. Every chapter is cut into 55-word pieces (`beats.ts:17`, `compiler/content.ts:216-222`, `pushRead` in `compile.ts:1341-1351`), 2 to 17 per chapter, labelled "Part n of N"; nothing recaps the previous piece (`storyline.ts:15-25` only when the previous chapter is unread).
2. The same end-of-chapter hook shows after every piece and gives away the ending (`compile.ts:1342`, `writing.tsx:174,194`).
3. Questions attach to the earliest piece holding most of their rarer words (`beats.ts:66-79`), so "How does the chapter end?" can be asked after Part 1 of 5.
4. A whole-chapter timed re-read follows the last piece on an input day (`compile.ts:1416`).
5. Review days re-read a chapter first read 14 to 21 days ago (`compile.ts:1581-1603`), and many days become review days (backlog, drill spacing, missing download, absence).
6. The 10-minute tier re-reads (`compile.ts:1659-1660`).
7. De corrido and the Story screen's "Read again" offer more re-reads (`games/reading.ts:25-28,68-71`, `story.tsx:35-39`).
8. Every output day replays its scene timed (`compile.ts:1455`).
9. Scenes sc-u01-a and sc-u01-d re-stage ch001; the first script's opener repeats "Hola, soy Tomás. Soy de Toronto."; the parrot echo gag appears in 23 of the first 30 chapters.
10. `unintendedRepeats` counts only re-shows not labelled deliberate (`ledger.ts:80-85`); the simulator reports 0 unintended against 138 deliberate re-shows for the average profile.

## 2. Teaching scripts

Each runs: "Today:" hook line, the Spanish and English, examples, "Here's the trick" (first rule paragraph), read-and-pick, your-turn (`teach.tsx:206-213`). The first 12 (ser-identity, sounds-letters, gender-articles, present-ar, present-er-ir, estar-location-states, adjective-agreement, questions, gustar-basic, stem-boot, verb-infinitive, ir-a-plans) all state the rule with forms visible. Edits needed: sounds-letters is about 15 rules in one and comes on day 2 after the learner has typed sentences; gender-articles' *el agua* and *-ma* exceptions are too much for week one; present-er-ir's close ("join in for everyone except I: *Vale sabe, hace, ve*") will confuse; adjective-agreement is dense; gustar-basic is excellent but about 300 words; stem-boot's "stress" jargon and a boot with no picture. Units 20 to 40 and 50 to 60 samples are all clear and competent. Verdict: the strongest content in the repo; lessons feel thin because of the session caps, not the writing.

## 3. Scenes

u01 to u03: natural Spanish, but sc-u01-a and sc-u01-d re-stage ch001; sc-u01-b makes Gloria a customer (she is the landlady in ch015); sc-u01-c's brief contradicts the rented premises; sc-u03-b uses Mariana before she exists (ch028). Learner turns are trivial: each prompt spells out the answer in English. Units 20 to 40: tied to the plot, with turns that carry some meaning (sc-u20-g good; sc-u29-a and sc-u37-b wedged in for a grammar point). Only 108 of 270 scenes are tied to a day; 110 of the other 162 and 18 of the 108 require an item scheduled units later (median gap 14 units).

## 4. Bank

Fixed-seed sample of 40: 32 natural, 8 stilted (rising from B2: drill frames), 0 ungrammatical, 5 English not an exact rendering. Bad: "¡Qué mal!" as "That is bad!"; "¿Hace frío en la calle?" as "Is it cold in the street?"; "Una tormenta caribe..." (*caribeña*); "Estaba tan enojado como para cortar la llamada" (*colgar* in Colombia); "Mesas libres no hay" as "Free tables there aren't any". Good: "Hoy no estoy para cuentos: dime qué pasó."; "¿Yo, preparar quinientos buñuelos? ¡Ni loca!"; "Para ser octubre, hace mucho calor." Side notes: unit files hold rows needing later grammar (u01-0638 preterite); some tags wrong (u01-1066 *Pasa, Mariana.* tagged present, is imperative).

## 5. Gating and length

Session minutes by band and tier only (`budget.ts:18`: A1 20, A2 22, B1 25, B2 45, C1 52; warm-up 7 of A1's 20; short tier 10). What each session teaches is capped by item counts (new words 6 introduce, 4 drill, 16 input, 0 output; phrases 5; 8 new items in each of the first 3 sessions; one grammar point, never consecutive). The repo's own notes: content "already ends under the session minutes in A1–B1" (`budget.ts:23-24`), "the plans use 33 of 47 minutes" (`budget.ts:231`). Story pieces give way first (`dropBeatOverBudget`, `compile.ts:1354-1358`); chapters wait on "slipping" items (`compile.ts:719-728, 785-813`); backlogs turn days into reviews; scenes come about one per 9 to 10 sessions and need every item known; the runner also cuts by the clock (`runner.ts:248`). The written prerequisites are clean; the gating the owner feels comes from live rules.

## Worth carrying over

All 916 scripts (with the edits above); the story outline, cast and the u31 to u60 chapters; the best A1 chapters as they stand (ch004, 007, 012, 014, 023, 026, 027); the scene format and the mid-course scenes; the bank after a cleaning pass; display-time option shuffling and the reread question sets. To salvage the story, change how it is served before rewriting it: whole chapters or pieces with a recap, no hook until the last piece, questions after the piece that answers them, one deliberate re-read path, a repeat metric that counts deliberate re-shows.
