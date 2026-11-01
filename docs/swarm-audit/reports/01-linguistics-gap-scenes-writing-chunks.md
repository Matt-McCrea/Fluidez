# 01. Linguistics gap: chunks, scenes, writing, bank exactness, glosses

Claims: `docs/swarm-audit/claims/L-gap.jsonl` (102 claims, prefix LG: 1 critical, 19 high, 58 medium, 24 low). Every quote was checked verbatim against its file by script. Date: 2026-11-01. Branch: rebuild.

## Verdict

The Spanish these files show is strong. In 60 scenes and 180 writing models I found one grammar error (w-u42-02), one leísmo (sc-u45-c) and one line that needs a pronoun (sc-u07-c). In 540 bank rows I found no tense-for-tense error at all. The chunks are Latin American and correct.

The defects are where the content meets the machine:

- **The reader glosses words wrongly.** Tapping the name Ana shows "anus". Tapping Tomás shows "to take". 30 percent of all taps show an unrelated sentence.
- **Correct Spanish is refused.** Regexes are blind to accented letters, so the label's own example often fails. Scene constraints reject what a native would say.
- **A woman's correct answer can be marked wrong.** About 160 first-person rows refuse the feminine ending.
- **Chunk cards pair the wrong lines.** "Perdimos el bus." is carded against "What can you do?"

## What I read

| Item | Read | How |
|---|---|---|
| Chunks | All 404: title, es, en, every form, note | By eye, in order |
| Chunk cards | All 404 | Ran `alignedPairs`, the code that builds the cards |
| Scenes | 60 scenes, 328 turns, one per unit, letters rotated across units: sc-u01-a, sc-u02-b, sc-u03-c, sc-u04-d, sc-u05-a, sc-u06-b, sc-u07-c, sc-u08-a, sc-u09-a, sc-u10-b, sc-u11-c, sc-u12-e, sc-u13-a, sc-u14-b, sc-u15-c, sc-u16-b, sc-u17-b, sc-u18-b, sc-u19-c, sc-u20-f, sc-u21-c, sc-u22-a, sc-u23-b, sc-u24-f, sc-u25-a, sc-u26-b, sc-u27-c, sc-u28-d, sc-u29-b, sc-u30-c, sc-u31-a, sc-u32-b, sc-u33-c, sc-u34-a, sc-u35-b, sc-u36-f, sc-u37-a, sc-u38-b, sc-u39-c, sc-u40-d, sc-u41-b, sc-u42-f, sc-u43-a, sc-u44-b, sc-u45-c, sc-u46-a, sc-u47-b, sc-u48-f, sc-u49-a, sc-u50-b, sc-u51-c, sc-u52-g, sc-u53-e, sc-u54-f, sc-u55-a, sc-u56-b, sc-u57-c, sc-u58-a, sc-u59-e, sc-u60-f | By eye |
| All scenes | 270 scenes, 1,474 turns | By script: accepts against constraints, numbers and names in npc against npcEn, dashes, leísmo, Peninsular lexis, register across Hernando scenes |
| Writing | 180 tasks, 3 per unit | By eye: prompt, constraints, model |
| All writing | 875 tasks | By script: model against its own constraints, word counts, post-verbal negatives |
| Bank | 540 rows, 9 per unit, seeded random | By eye, English against Spanish, tense for tense |
| All bank | 72,693 rows | By script through the real matcher: register and gender variants, tags, spelling |
| Lexemes | 4,554 | Script scans, plus the real `Bundle.gloss` over 87,034 tokens in 219 chapters and 14,651 distinct words |

I also read the code that decides the outcome: `check/writing.ts`, `ui/session/scene.ts`, `check/translate/match.ts`, `variants.ts`, `exercises/pairs.ts`, `exercises/dialogue.ts` and the gloss path in `ui/data/bundle.ts`. Refusals in the claims were produced by the real functions, not inferred.

All 1,474 scene accepts and all 875 writing models pass their own constraints, so those gates are working. The faults below are false refusals of other answers.

## Findings by task

### 1. Chunks

Spanish, glosses and regional labels are sound. The problem is the cards.

- 6 chunks produce a card whose English translates a different Spanish line (LG-015 to LG-020), and LG-024 pairs a sentence with a dictionary gloss.
- 3 chunks lose their target because a colon makes the aligner drop the text before it (LG-021 to LG-023).
- 21 more have English that covers only part of the Spanish (LG-025 to LG-045).
- Two have parentheses in the answer, which refuses the full correct form (LG-046, LG-047).
- `forms` never reaches a card: 378 of 607 forms are unused. c:hola-buenos-dias teaches "Hola." and never asks Buenos días (LG-048).

### 2. Scenes

NPC lines are natural and Colombian, and the intents lead to their accepts. Three lines need fixing (LG-052, LG-054, LG-058). Hernando flips between tú and usted through u21 with no event to explain it (LG-060).

The real weakness is natural replies being refused. Each of these was run through `checkTurn`:

| Reply refused | Scene |
|---|---|
| Prohibido fumar. | sc-u27-c |
| Me alegra que estés aquí. | sc-u30-c, sc-u30-a |
| Ya verás que todo va a salir bien. | sc-u30-c |
| Siento mucho que estés tan triste. | sc-u30-c, sc-u30-a, sc-u30-b |
| Sí, ya le mandé un mensaje, pero no contesta. | sc-u25-a |
| Según él, rechazó la oferta. | sc-u46-a |
| Vivo en la calle 11. | sc-u02-b, and 11 more turns that refuse digits |

The refusal copy itself reads badly: "To do this, i'm glad: me alegro." (LG-079).

### 3. Writing

Models are natural, at level and faithful to their prompts. One grammar error: "Hasta hoy recibimos ninguna carta" (LG-082). Writing constraints are a checklist and not a gate, so a false refusal costs a tick and a "still missing" line, not progress.

- JavaScript `\b` and `\w` are ASCII. 148 of 1,955 regex constraints behave differently on real course Spanish when made Unicode-aware. "Me enteré", "la pasé", "para mí", "no sé", "Si Tomás hubiera" and "A Simón le gusta" all fail. A small change in `evaluate` fixes all of them (LG-086).
- `avoidsAny` is a substring test. "Turistas" and "estuvo" count as tú; "estas cartas" counts as estás (LG-087).
- Participle patterns omit -ído, so "haya leído" fails in 27 constraints (LG-091).
- "En la mañana" and "tres veces por semana" are refused (LG-083 to LG-085).

### 4. Bank exactness

540 rows read: no tense-for-tense error, and no English that fails to translate its Spanish. Two low notes came from the sample (LG-100, LG-101). What fails is what the English leaves open:

- **Gender.** "I'm ill, Vale." refuses "Estoy enferma, Vale." The matcher allows the other gender only when the copula is the row's first verb. 181 of 325 tested rows refuse it, about 160 after noise (LG-096).
- **Register.** An untagged "Do you want a bag?" with model ¿Quiere bolsa? refuses ¿Quieres bolsa? All 131 tested rows failed (LG-097).
- **The polite tag does nothing.** 1,920 rows say "(polite)", but only "(formal)" is read, so tú passes (LG-098).
- 169 multi-turn rows put the tag on the wrong line (LG-099).

### 5. Glosses

No mojibake and no article or gender mismatch in 4,554 lexemes. The rendering is the problem:

| Tap | Shows | Cause |
|---|---|---|
| Ana (20 tokens, ch214) | el ano, anus | a to o guess. Tagger also logs l:ano |
| Tomás (1,347) | from tomar, to take | voseo reading of a name |
| Vale (894), Gloria (347) | to be worth; glory | no name list |
| la, las, los | him, it | no article lexemes |
| de, la, el and others | an unrelated sentence, 26,198 tokens | phrase fallback ignores position |
| calla, lentes, pera, aceras, Cuba | street, slow, but, steel, bucket | loose ending swap |

Twelve adjectives are stored as nouns with an article, so a card expects "el presunto" for "alleged" (LG-008). "Mono" is glossed "overalls" and no lexeme means monkey (LG-010). "Inseguridad" is glossed "insecurity" (LG-012).

## Considered and not claimed

These looked like defects and were not, or I could not support them. They are recorded so nobody re-raises them on my word.

- **Adjunto les envío las firmas** (sc-u49-a, w-u49-01, w-u49-09). The invariable form is the DPD's accepted administrative use, and LB2-064 was amended on that basis. Not an error.
- **Le invito un tinto.** Un tinto is the direct object, so this is correct and not leísmo.
- **Nine hours against eleven hours** in sc-u18-b. The story has a nine-hour trip that took eleven.
- **Me quedé de piedra, no te lo vas a creer, desde luego, a lo mejor, yo que tú, qué va.** They lean Peninsular but are understood and used in Latin America. I could not show that any is wrong, so no claim.
- **Por la mañana, ducharse, chaqueta, alquiler in formal writing, sin prisa.** Neutral and fine. Only the mixed line in sc-u33-c is claimed, at low confidence.
- **w-u16-02 under its word minimum.** The engine's tokeniser says 24 and the UI's split says 25, and the UI is what the learner sees.
- **Me da pena in the Colombian sense** is already covered by CX-025 and LB1-042. LG-071 only adds that the turn refuses the safer replies.

## Limits

- The 60 scenes and 180 tasks were read by eye. The other 210 scenes and 695 tasks had scripts only.
- Counts for register and gender come from a parser, so a small share is noise. The claims say so.
- The regex comparison uses course sentences, so it shows where a constraint would change, not how often learners would hit it.
- Colombian usage rests on my judgement and the course's own notes. Where I lacked a source the confidence is lower. rae.es was not consulted directly in this pass, and DPD and Ortografía citations are from memory of the entries.
