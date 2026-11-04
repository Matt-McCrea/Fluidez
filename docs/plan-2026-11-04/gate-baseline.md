# Content gate baseline (4 November 2026)

`npm run gate` over the original app's data (818 passages, 718 Apply, 731 writing, 798 lessons, 5,820 vocab), report mode, before any content work. Full JSON was in the session scratchpad; re-run `npm run gate -- --json <path>` to regenerate.

| check | errors | warnings |
|---|---|---|
| dashes | 4924 | 0 |
| dupe | 1 | 0 |
| frames | 0 | 6 |
| accent | 3 | 18 |
| dialect | 0 | 1217 |
| typeable | 1 | 0 |
| options | 19 | 1188 |
| list-passage | 0 | 17 |
| answerability | 0 | 737 |
| gender-agreement | 0 | 0 |
| length | 0 | 0 |

What the numbers mean:

- **Dashes 4,924**: nearly all are Spanish dialogue rayas (`—Hola.`) and parenthetical em dashes in passage text. The rule is no dashes in learner text; dialogue becomes one turn per line with the speaker named. This is the Stage 4 passage pass, not a find-and-replace.
- **Options**: across all passage questions the longest option is right 79% of the time (chance 33%); lesson probes 60%, rising to about 80% at levels 8 and 9. Per-question, 1,188 have a correct option at least 1.5 times the length of every other. Stage 4 balances these (the rebuild's option-shortening tool is the model; its gate threshold is chance plus 8 points).
- **Answerability 737**: the correct option is the only one whose words all appear in the text. A loose signal, but it says most questions are matched by scanning rather than understanding.
- **Dialect 1,217** (worklist for the Latin American conversion): 998 Peninsular lexis, 218 vosotros, 1 voseo. Top words: coche 163, autobús 69, piso 64, móvil 54, ordenador 44, billete 41, vale 39, os 34, gafas 31, enfadado 27, vosotros 26, aparcamiento 22. By file: strand-lessons 526, passages 498, vocab 75, apply 67, writing 45.
- **List passages 17**: a1-pol-clase 56% of tokens inside enumerations, a1-cuerpo-gimnasio 49%, a1-cuerpo-familia 44%, a1-ident-carne 40%, and 13 more above 35%.
- **Frames**: "sin embargo" in 33 of 110 level-6 passages and 26 of 83 at level 9; "espera(n) que" and "para cuando" in a third of level 5.
- **Small fixes**: one duplicate Apply item (590 = 355), one probe accepting only ".", three missing opening ¿.
