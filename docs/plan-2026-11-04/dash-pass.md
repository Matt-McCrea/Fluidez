# Dash pass: data/strand-lessons.js and data/grammar.js

Stage 4 content pass, 2026-11-04. The owner's rule: no em dash, en dash or spaced hyphen in any learner-facing string. Each dash became a full stop, a comma, a colon, parentheses or two sentences; a dialogue raya became one turn per line (`<br>` in HTML fields, `\n` in plain fields), as bare lines because no lesson names its speakers; a gloss dash became a colon; a compound written with en dashes became hyphens. No word was added, removed or changed apart from the capital letter of a word that now opens a sentence, and no Spanish was touched beyond the dash itself.

## Counts

| | before | after |
|---|---|---|
| gate `dashes` errors in data/strand-lessons.js (uncapped) | 4,711 | 0 |
| same, as listed in the gate's JSON report (capped at 4,000 findings per check) | 3,958 | 0 |
| learner strings with a dash in data/strand-lessons.js, every field (`moves` and `checklist` included, which the gate does not scan) | 4,771 strings, 5,906 dashes | 0 |
| learner strings with a dash in data/grammar.js (the gate does not load this file) | 18 strings | 0 |
| strings using a plain hyphen as the dialogue raya ("-¿Vamos al cine? -Es que…"), which the gate regex misses | 82 strings | 0 |

The 42 dash errors the gate still reports are in data/passages.js (40) and data/apply.js (2). The "3,958" baseline was a truncated count: the gate's JSON keeps only the first 4,000 findings of each check, so the later strand-lesson dashes never made the list.

`node tools/validate-content.js`: every content check green; the three failures are the stale data/game-index.js, the stale data/lessons split and the sw.js cache version. Gate, my two files: no path gained a finding (accent errors 4 to 3, dialect warnings 805 to 773, option warnings 996 to 990).

## Method

1. A literal map (every string value in the file tied to its source literal, concatenations included) so edits replace single literals in place and the file layout is untouched: 4,601 lines of data/strand-lessons.js and 18 of data/grammar.js changed in place, none added, removed or moved.
2. Mechanical rules, 541 strings: plain strings that are only dialogue (one turn per line), HTML lines opening with a raya, an italic dialogue that stands as its own sentence (made a block with `<br>`), a trailing prompt dash (became a colon), the en-dash compound.
3. Prose: 4,230 strings in 13 batches of about 61 lessons, rewritten by Sonnet workers into the scratchpad. A checker enforced zero dashes, an identical word sequence (case aside), identical HTML tags apart from added `<br>`, and balanced parentheses, and flagged any punctuation change inside Spanish.
4. Review: I read every rewritten hunk of every batch. 9 corrections (two titles, one heading, four notes and summaries, two probe questions).
5. Hyphen rayas: 82 strings, same rules, read in full.
6. data/grammar.js: 18 strings by hand.
7. Applied by lesson id and field to a fresh read of the file (800 lessons, `gr-ir-a-infinitivo-a1` included, which had no dashes), checked that none of the 4,850 target strings had changed meanwhile, written to a temp file in data/ and moved over the original with `os.replace`.

## By field

| field | strings | dashes | mechanical | prose (Sonnet, reviewed) | hyphen raya | by hand |
|---|---|---|---|---|---|---|
| pitfalls[] | 1,167 | 1,178 | 1 | 1,162 | 0 | 4 |
| sections[].html | 1,029 | 1,221 | 29 | 982 | 16 | 5 |
| summary | 615 | 824 | 0 | 614 | 0 | 1 |
| contrasts[].note | 508 | 509 | 0 | 506 | 0 | 2 |
| exponents[].note | 369 | 369 | 0 | 369 | 0 | 0 |
| examples[].es | 161 | 289 | 141 | 8 | 12 | 0 |
| probes[].q | 149 | 161 | 12 | 134 | 2 | 1 |
| examples[].en | 140 | 257 | 125 | 8 | 7 | 0 |
| canDo | 108 | 109 | 0 | 107 | 0 | 1 |
| probes[].back | 108 | 109 | 0 | 108 | 0 | 0 |
| exponents[].es | 103 | 149 | 73 | 2 | 28 | 0 |
| exponents[].en | 75 | 126 | 60 | 5 | 10 | 0 |
| probes[].text | 68 | 93 | 27 | 34 | 5 | 2 |
| probes[].front | 49 | 49 | 0 | 49 | 0 | 0 |
| moves[].html | 43 | 64 | 9 | 34 | 0 | 0 |
| model.text | 41 | 269 | 20 | 21 | 0 | 0 |
| probes[].options[] | 32 | 32 | 0 | 32 | 0 | 0 |
| checklist[] | 17 | 17 | 0 | 17 | 0 | 0 |
| keywords[].en | 17 | 17 | 0 | 17 | 0 | 0 |
| contrasts[].en | 17 | 26 | 10 | 6 | 1 | 0 |
| contrasts[].es | 16 | 29 | 14 | 1 | 1 | 0 |
| sections[].h | 12 | 12 | 0 | 12 | 0 | 0 |
| moment[].es / .en | 20 | 22 | 20 | 0 | 0 | 0 |
| title | 2 | 2 | 0 | 2 | 0 | 0 |
| recall[].front (grammar.js) | 2 | 2 | 0 | 0 | 0 | 2 |
| **total** | **4,868** | **5,935** | **541** | **4,230** | **82** | **18** |

The "dashes" column counts em dashes, en dashes and spaced hyphens only; hyphen rayas come on top of it. Mechanical and prose rows add up to the strings; the hyphen column overlaps them where a string had both kinds.

What the dashes became (6,102 edit sites, a paired aside counted as two): colon 3,044; parentheses 611 (about 305 asides); line break between dialogue turns 679; raya dropped at the start of a turn 841; comma 513; full stop and a new sentence 386; semicolon 28; hyphen 3; slash 2.

## Ten examples

1. Explanation, `nt-familia-a1.summary`: "with the masculine plural — "mis hermanos" is brothers" became "with the masculine plural: "mis hermanos" is brothers".
2. Gloss, `gr-interrogativos-a1.sections[0].html`: `<b>qué</b> — <i>what</i>.` became `<b>qué</b>: <i>what</i>.`
3. Aside and gloss, `nt-familia-a1.sections[2].html`: "<i>mi hermana mayor</i> — my older sister." became "<i>mi hermana mayor</i> (my older sister)."; "a much younger sibling — <i>mi hermano pequeño</i> — but" became "a much younger sibling (<i>mi hermano pequeño</i>), but".
4. Afterthought, `fn-identificar-a1.pitfalls[0]`: "a shared view to mean anything — they do not work in writing" became "a shared view to mean anything. They do not work in writing".
5. Spanish model text, `task-c1-ensayo.model.text`: "y el problema — si es que lo hay — no nace en ella" became "y el problema (si es que lo hay) no nace en ella".
6. Dialogue in prose, `task-a2-experiencia.sections[1].html`: "WHEN and WHERE. <i>—¿Has estado en México? —Sí. —¿Cuándo fuiste?</i> That switch" became "WHEN and WHERE.<br><i>¿Has estado en México?<br>Sí.<br>¿Cuándo fuiste?</i><br>That switch".
7. Dialogue with a question after it, `fn-acuerdo-b2.probes[1].q`: "—No me convence nada esta idea. — ¿Cómo se expresa acuerdo?" became "No me convence nada esta idea.\n¿Cómo se expresa acuerdo?".
8. Hyphen raya, `dc-negacion-c1.probes[1].q`: `"-¿Te han dado el trabajo? -¡Qué va!" ¿Qué tipo de negación es esta?` became `"¿Te han dado el trabajo?\n¡Qué va!"\n¿Qué tipo de negación es esta?`.
9. Prompt, `gr-objeto-directo-a1.probes[0].q`: `"I have two sisters" —` became `"I have two sisters":`.
10. grammar.js, `ser-estar.sections[1].html`: "<i>Soy profesor.</i> — I'm a teacher." became "<i>Soy profesor.</i> (I'm a teacher.)"; and a title, `gr-indefinidos-negativos-b1.title`: "Algo, alguien, alguno — nada, nadie, ninguno" became "Algo, alguien, alguno / nada, nadie, ninguno".

## Open, for other owners

- Plain fields now hold dialogue turns separated by `\n` (examples, exponents, contrasts, moment, probe q/text). js/views/learn.js puts these into innerHTML, so the line breaks show as spaces until the view maps `\n` to `<br>` or gives `.ex-es`, `.ex-en`, `.moment-line` and `.guess-q` `white-space: pre-line`. The turns still read in order without it, but the break between speakers is lost.
- tools/gate: the dash regex misses a hyphen used as a raya (" -¿", " -Sí"); the gate does not scan `moves` or `checklist`, nor load data/grammar.js; and the JSON report truncates the dash list at 4,000.
- A handful of Q/A pairs inside a running Spanish sentence (`gr-sub-adv-temporales-c1.sections[4].html`) now break mid-sentence, because the rule puts each turn on its own line.
