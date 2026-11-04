# Upper-band reading passages, Stage 4 and Stage 5b (4 November 2026)

Scope: every passage in `data/passages.js` with `level` 3 to 10. That is **495 passages** (L3 46, L4 113, L5 44, L6 110, L7 38, L8 53, L9 83, L10 8), 2,020 questions and about 111,000 words. Only `data/passages.js` was edited. Every `id` was kept and no passage was deleted or retired. The file keeps its layouts: all 495 originals round-trip byte for byte through the printer, and the 323 A1 passages are unchanged. Nothing is committed.

Bands follow `data/taxonomy.js` LEVELS: A2 is [2, 3], B1 [3, 4, 5], B2 [6, 7], C1 [8, 9, 10]. Level 3 belongs to both A2 and B1, so it is reported on its own. The gloss language follows the same table (English to L5, Spanish at L6 and L7, none at C1). The tables also give each level, so other groupings can be read off them.

## Method

The A1 method, scaled up:

- **Checker** (`up/check.ts` in the session scratchpad). It wraps the gate's own functions: dashes, dialect, accent, list share, option length, answerability and gender. It adds the validator's tense scanner (no new tense, no verb above the level), translate lines verbatim, and the band rules from this pass. Those rules are sentence length (average and a cap per sentence), padding density, gloss language and count, frame and opener shares across the batch, and narrative lines that the app would render as speaker labels.
- **Worked example** (`up/batches/b00.js`): five edits by the lead, one each at L3, L4, L5, L6 and L9.
- **Workers**: 23 Sonnet workers, 8 to 45 passages each (about 3,500 to 6,300 words), three or four at a time. Each was briefed by `up/BRIEF.md`, which was amended once with lessons from reviewing the first three batches.
- **Lead reading.** I read every passage in full, text and questions, all 495 of them, in all 23 batches. I sent b01 back once, to rewrite 15 vocabulary lists in costume. I then applied 74 fixes to 48 passages (`up/fixes/*.js`) and ran the checker over the merged set. The fixes covered:
  - Peninsular usage the gate does not see: facturar las maletas, ¿A que no sabes...?, quedar para, merecer la pena, reñir, ponerse malo, ternera, barca, la segunda planta, bajas por enfermedad, la sanidad pública.
  - Narrator gender in questions.
  - One wrong answer index (`renta-basica-economia-b2`, where the key pointed at "the debate is settled").
  - Contradictions: thirteen against fourteen days, adolescent against niña, a counterfactual job that did not exist.
  - Two passages at L6 and L9 that both had a last monk called Anselmo.
  - A few unnatural lines.

## Result

| | A2/B1 (L3) | B1 (L4, L5) | B2 (L6, L7) | C1 (L8 to L10) | all |
|---|---|---|---|---|---|
| passages touched | 46 | 157 | 148 | 144 | 495 |
| rewritten (new scene, same level, theme and tense set) | 16 | 4 | 0 | 0 | 20 |
| edited (re-sentenced, padding cut, lexis, questions, glosses) | 30 | 153 | 148 | 144 | 475 |
| retired | 0 | 0 | 0 | 0 | 0 |

At B1 to C1, "edited" means every sentence was written again. The content, the order of ideas, the people and the facts were kept. The upper prose was sound in substance but machine-built, with sentences of 30 to 70 words chained with commas. The 20 rewrites are the vocabulary lists in costume of the generated families: adjective catalogues for a boss, a friend or a team; rows of body parts; the parts of a letter; every political word in a row; a mountain hike with both a plano and a mapa and a tram back to the station. They are now small scenes.

### Gate counts for the upper set, before and after

From the real gate run uncapped (`up/measure.ts`), filtered to these 495 ids:

| check | A2/B1 (L3) | B1 (L4, L5) | B2 (L6, L7) | C1 (L8 to L10) | all |
|---|---|---|---|---|---|
| dashes (strings with an em dash, en dash or spaced hyphen) | 0 → 0 | 0 → 0 | 11 → 0 | 29 → 0 | 40 → 0 |
| correct option is the longest (chance 33%) | 64% → 20% | 84% → 26% | 90% → 24% | 94% → 25% | 88% → 24% |
| correct option is the shortest | 13% → 34% | 6% → 38% | 3% → 36% | 1% → 36% | 4% → 36% |
| correct option 1.5 times every other | 21 → 0 | 126 → 0 | 154 → 0 | 206 → 0 | 507 → 0 |
| level groups over the gate's option limit | L3 → none | L4, L5 → none | L6, L7 → none | L8, L9 → none | 7 → 0 |
| answerability flags | 58 → 0 | 165 → 0 | 52 → 0 | 112 → 0 | 387 → 0 |
| list-passage flags | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| dialect hits | 25 → 2 | 94 → 3 | 76 → 1 | 48 → 7 | 243 → 13 |
| accent errors | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| frame overuse (gate, per level) | none → none | L5 espera que 13/44, para cuando 14/44 → none | L6 sin embargo 33/110, L7 sin embargo 12/38 and antes de 10/38 → none | L9 sin embargo 26/83 → none | 6 → 0 |

The 13 remaining dialect hits are all false alarms:

- 4 are gafas, which is normal in Colombia.
- 8 are dificultad. The gate reads it as a vosotros imperative of dificultar.
- 1 is París. The gate reads it as a vosotros form of parir.

"Sin embargo" went from 95 passages to 1. The near-duplicate check found 0 before and 0 after.

### Sentence length, padding and glosses

| | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|
| words a sentence, before | 12.9 | 17.9 | 17.7 | 30.4 | 30.2 | 33.2 | 37.7 | 70.9 |
| words a sentence, after | 11.0 | 12.6 | 12.8 | 15.5 | 16.1 | 16.7 | 16.3 | 16.2 |
| words a passage, before → after | 77 → 72 | 121 → 115 | 114 → 111 | 258 → 230 | 253 → 228 | 351 → 323 | 357 → 320 | 363 → 296 |
| gloss entries a passage, before → after | 3.6 → 12.7 | 3.8 → 9.7 | 3.5 → 10.9 | 4.4 → 5.7 | 4.3 → 5.2 | 0 → 0 | 0 → 0 | 0 → 0.4 |

Averages by band: B1 went from 17.8 to 12.6 words a sentence (target 10 to 14). B2 went from 30.3 to 15.6, and C1 from 36.9 to 16.5 (target 12 to 18). No sentence exceeds 28 words at B1, 32 at B2 or 34 at C1.

Stock intensifiers fell from 0.94 to 0.06 per 100 words: completamente, profundamente, considerablemente, genuinamente, "de forma + adjective" and emphatic propio.

Total words went from 111,335 to 101,121, a cut of 9%. Almost all of it was padding.

Glosses at L3 to L5 are English and cover a B1 reader. At L6 and L7 they are short Spanish definitions. C1 keeps the no-gloss policy, apart from five rare words: cepas, cachés, se había valorizado, desalojos and tabiques.

### Other effects

- **Validator.** `node tools/validate-content.js` passes every content check, including the tense gate, the regenerated `tenses` field, translate lines found verbatim and the course's named passages. Its only failures are the two stale cache versions, `sw.js` and `juegos/sw.js`, which are not this task's.
- **`tenses`.** `node tools/tense-index.js` rewrote the field on 101 passages. They dropped 124 tenses between them and gained none. Most of the drops came from re-sentencing, for example an imperfect that is no longer needed. In the L5 grammar families, the future perfect and conditional perfect are kept and now used correctly. Before, there were lines like "Para cuando protestaron, el banco ya habrá trasladado", or "habrían tenido que viajar" for a future need.
- **Setting.** Placeless passages that read as Spain are now neutral or Latin American: alcaldía, pesos at realistic amounts, colegio, administración del edificio, arriendo, estación de policía, trancón, andén, celular, carro. Passages that name a Spanish place or are about Spain keep their setting, its institutions and euros. Examples are the Camino de Santiago, the Iberian lynx and wolf, the 2013 surname law, Spanish warranty law, the 1978 constitution, Sevilla, Madrid, Zaragoza and Vitoria. Their everyday words were still converted. Vosotros does not appear anywhere.
- **Titles.** All 818 titles in the file are unique.

## Ten before and after excerpts

1. `fue-una-pena-referendum` (L4).
   - Before: "Otros simplemente dijeron que no creían que su voto fuera a cambiar nada en una decisión ya tomada por el ayuntamiento."
   - After: "Otros dijeron que no creían que su voto fuera a cambiar nada, porque la alcaldía ya tenía la decisión tomada."
   - The question "¿Qué porcentaje de vecinos votó?" had the answer "Un veinte por ciento" quoted from the text. Its correct option is now "Uno de cada cinco".
2. `banco-cerrado` (L5), tense logic.
   - Before: "Para cuando los vecinos protestaron frente al edificio, el banco ya habrá trasladado todo el personal a la ciudad más cercana."
   - After: "Al día siguiente, los vecinos protestaron frente al edificio vacío. Para finales de mes, el banco ya habrá trasladado a todo el personal a la ciudad más cercana."
3. `compra-falsa-internet` (L5).
   - Before: "Para cuando intentó reclamar, la página web ya habrá desaparecido de internet sin dejar rastro."
   - After: "Intentó reclamar, pero la página ya no existía. Seguramente los dueños la habrán cerrado para no dejar rastro."
   - The future perfect now expresses a conjecture, which is how a speaker uses it. Zapatillas became tenis.
4. `coro-amateur-ocio-b2` (L6).
   - Before: "Cuando Marisol se apuntó al coro amateur del barrio, lo hizo casi por casualidad, después de ver un cartel pegado en la puerta del centro cultural que anunciaba ensayos los martes por la tarde, sin exigir ninguna experiencia musical previa." (42 words)
   - After: "Marisol entró al coro del barrio casi por casualidad. Un día vio un cartel en la puerta del centro cultural: había ensayos los martes por la tarde y no se pedía experiencia musical."
5. `muralista-legal-arte-c1` (L8).
   - Before: "Durante casi quince años, Nando pintó grafitis sin ningún permiso, principalmente de madrugada y en lugares donde la probabilidad de ser sorprendido por la policía municipal resultaba, según sus propios cálculos de entonces, razonablemente baja, hasta que un ayuntamiento vecino le propuso algo..."
   - After: "Durante casi quince años, Nando pintó grafitis sin permiso. Lo hacía de madrugada y en lugares donde, según sus cálculos de entonces, casi nadie lo veía."
6. `resistencia-antibioticos-salud-c1` (L10, where sentences averaged 71 words).
   - Before: "La resistencia bacteriana a los antibióticos no constituye, contra lo que a menudo se cree, un fenómeno nuevo provocado exclusivamente por el uso médico reciente de estos fármacos, sino un mecanismo evolutivo que..."
   - After: "Se suele creer que la resistencia a los antibióticos es un problema reciente, causado por el uso médico de estos fármacos. No es así."
7. `chatbot-atencion-servicios-c1` (L8).
   - Before: "¿A que no sabes cuánto tardé en conseguir que me devolvieran el dinero...?", followed by a list wrapped in em dashes.
   - After: "No te imaginas cuánto tardé en conseguir que me devolvieran el dinero de un vuelo cancelado." The list now reads "...las mismas tres opciones: reprogramar el vuelo, pedir un bono para viajes futuros o consultar la política de cancelaciones."
8. `a2-via-excursion3` (L3, rewrite).
   - Before: "Un montañero nos explicó el camino con un plano; una senderista llevaba el mapa. ... Comimos cerca de un campin y volvimos en tranvía hasta la estación."
   - After: "Una guía nos mostró el camino en un mapa. Comimos arepas cerca de un río y descansamos. Volvimos a la plaza caminando, al atardecer."
9. `a2-caracter-jefe` (L3, rewrite).
   - Before, an adjective catalogue: "es reservado, no es sociable y no habla nunca del fin de semana. Es abierto con las dudas y duro con las excusas. Es generoso con el tiempo y bastante tolerante con los errores nuevos..."
   - After, a scene: "Una vez cometí un error en un pedido y fui a decírselo con miedo. Me escuchó con paciencia y me ayudó a arreglarlo. Desde entonces lo veo distinto."
10. `inflacion-notas-educacion-c1` (L9), option balance.
    - Before: Una mejora real y sostenida del nivel académico / **Un conjunto de incentivos estructurales que empujan hacia calificaciones más generosas** / Un error sistemático en las pruebas externas. The correct option was the longest and was quoted from the text.
    - After: A alumnos más preparados / **A presiones que premian la generosidad** / A que los profesores han perdido el rigor. The last option is a view the text names and rejects.

## Left for others

- **Cache version.** Run `node tools/bump-cache.js` before committing. Both `sw.js` and `juegos/sw.js` are stale.
- **Stale tagger output.** `data/requires.js` and `data/lesson-nodes.js` were computed from the old text and are stale for these 495 ids. The arcade index from `tools/build-game-index.js` may be stale too. Re-run the tagger and the index build.
- **Gate false alarms.**
  - Exempt dificultad and París from the vosotros reading.
  - The gate also reads "¿Vale la pena...?" as Peninsular vale; one title was reworded around it.
  - The tense scanner misreads rechazara as a future, traslade as a preterite, mejores and señales as subjunctives, and participe as an imperative. The workers worded around these.
- **B2 length.** Cutting padding left B2 passages at 229 words on average, against the Stage 5b aim of 250 to 600 for "other voices". New long passages are burn work, not this pass. `b2-car-optimismo` is the shortest, at 193 words.
- **Cross-band twins.** The generated b2- and c1- families sometimes argue the same thesis at two levels. Examples:
  - `b2-pol-acuerdo` and `c1-pol-consenso`
  - `b2-salud-ansiedad2` and `c1-salud-mental`, which share the sentence "Nombrar un problema es el primer paso y no es ninguno de los siguientes"
  - `b2-medios-atencion` and `c1-medios-modelo`
  - `b2-eco-vivienda` and `c1-eco-vivienda2`
  - `b2-cuerpo-mayor` and `c1-cuerpo-longevidad`
  - `c1-nat-bosque` and `incendios-abandono-rural-naturaleza-c1`

  The gate's dupe check passes them. Still, a learner climbing bands meets the same argument twice, so they are the first candidates to replace with new Stage 5b passages. The same goes for a recurring "volunteer who helps with paperwork" motif, which appears at L4, L6, L8 and L9; two of the days were varied.
- **`retired`.** It was not used, as in the A1 pass. The app does not read the field yet.

## Files

The session scratchpad `up/` folder holds:

- the brief and the worked example
- the 23 worker scripts and outputs (`batches/bNN.js`, `bNN.out.json`, each passage with `_change` and `_note`)
- the lead's fixes (`fixes/*.js`)
- the merged set (`final.json`, with `_lead` on fixed passages)
- the checker, the measure and the merge scripts
- the gate measurements before and after (`before.json`, `after.json`)
- a work log (`LOG.txt`)

`up/batches/b13.js` was altered when another worker ran b13's patch script by mistake. `b13.out.json` was restored from the reviewed copy, and the merge reads the `.out.json` files, never the scripts.
