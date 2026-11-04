# A1 reading passages, Stage 4 (4 November 2026)

Scope: every passage in `data/passages.js` with `level` 1 or 2. That is **323 passages** (195 at level 1, 128 at level 2), 647 multiple-choice questions and about 21,800 words. Only `data/passages.js` was edited. Every `id` was kept, no passage was deleted, and the file keeps its two layouts: re-printed blocks match their neighbours byte for byte, and 322 of the 323 originals round-trip exactly through the printer. Nothing is committed.

## Result

| | count |
|---|---|
| passages touched | 323 of 323 |
| rewritten (new scene, same level, theme and tense set) | 151 |
| edited (dialogue lines, dialect, questions, glosses, wording) | 172 |
| retired | 0 (the app does not read `retired` yet, so rewriting was the better fix every time) |
| passages changed outside the A1 set | 0 |

Gate counts for the A1 set, from the real gate run uncapped and filtered to these 323 ids:

| check | before | after |
|---|---|---|
| dashes (strings with an em dash, en dash or spaced hyphen) | 22 | 0 |
| passages written with rayas | 20 | 0 (86 passages now have one turn per line as `Name: line`) |
| options: correct option is the longest | 64% (L1 61%, L2 69%; chance 33%) | 22% (L1 21%, L2 22%) |
| options: correct option is the shortest | 12% | 32% |
| options: correct option 1.5 times every other | 194 | 0 |
| options: level groups over the gate's limit | 2 (L1, L2) | 0 |
| answerability flags | 350 (318 only-verbatim, 22 none-in-text, 10 short answers not in the text) | 0 |
| list-passage flags | 17 | 0 |
| dialect hits | 255 | 20: 17 "gafas" (normal in Colombia, kept per the owner's rule), 3 "tengo sed" (a false alarm: the gate reads *sed* as a vosotros imperative) |
| accent errors | 0 | 11, all "jugo" (a false alarm: `data/vocab.js` has no *jugo*, so the gate's lexicon reads it as a misspelt *jugó*) |
| near-duplicate passages | 0 | 0 |

Whole-file gate after the merge: dashes 4,820 (4,924), dialect 977 (1,217), options 17 errors and 990 warnings (19 and 1,188), answerability 387 (737), list-passage 0 (17), accent 14 errors (3, the 11 "jugo" above). These whole-file numbers also include another agent's concurrent edits to other files; the A1 table above is mine alone.

`node tools/validate-content.js`: every content check passes, including the tense gate, the `tenses` field (regenerated with `node tools/tense-index.js`), translate lines found verbatim, and the course's named passages. Its one failure is the `sw.js` CACHE_VERSION hash, which was already stale before this work. The fix is `node tools/bump-cache.js`, which writes `sw.js` and `js/perf.js`, outside this task.

## What changed, by rule

1. **No dashes.** Dialogue is one turn per line (`\n` in the string) as `Name: line`, which `js/gloss.js` already renders as a speaker label. Unnamed speakers got ordinary Latin American names or a role label (Policía, Empleada, Recepcionista, Taquillera). The English gloss and model strings are clean too.
2. **Latin American Spanish.** All the Peninsular words the gate flags are gone, plus several it does not see: euros to pesos, soles or dólares; ayuntamiento to alcaldía; comisaría to estación de policía; cartera to billetera; DNI and carné to cédula; "del tercero" to "del tercer piso"; plano to mapa; barca to lancha; culebrón; entrar en to entrar a; hermano pequeño to hermano menor. Vosotros does not appear. Rewrites are set in Latin American places: Bogotá 29, Medellín 18, Cali 14, Cartagena 10, Quito 6, Lima 5, Guadalajara 3, and one or two each in Pasto, Ciudad de México, Cusco, Cancún, Manizales, Santa Marta and Guatapé. Five edited passages keep a Spanish place, as the rules allow: `u1-cafeteria`, `rutina`, `viaje`, `a2-relig-abuela-boda`, and `a1-pol-reyes` (Spain as a contrast with Colombia). One keeps euros: `a2-via-interrail`, a European rail trip.
3. **Lists in costume.** All 17 flagged passages, and the unflagged catalogues the read-through found (colours, numbers, professions, family adjectives, body parts), are now small scenes with a person who wants something. The three bureaucratic clones each have their own situation: a lost wallet reported at a police station in Bogotá, opening an account to be paid in Medellín, a card refused at a supermarket till.
4. **Fresh eyes.** Each text now says who, where and what is wanted. Incoherent passages were fixed:
   - The day 7 family, with a grandfather living upstairs and two "eldest" children.
   - "Ayer" under the title "Un lunes difícil".
   - "Buenos días" that closed on "buenas tardes".
   - A taxi driver who appeared from nowhere.
   - A camping trip that was a string of unrelated events.
5. **Questions.** Types and counts are unchanged everywhere. The wrong ones are fixed:
   - Feminine options for a brother.
   - "¿Por qué está Tom en Madrid?", with Madrid now named in the text.
   - "¿Quién vive con Daniel?", which the text never said.
   - Two options that were both correct.
   - A "how" question with a half-true "where" option.

   Correct options are paraphrased, and each question has a distractor built from a real detail of the text.
6. **Glosses.** These now cover what a learner in the first weeks lacks: an average of 6.7 entries rose to 17.1 at level 1, and 3.6 to 13.8 at level 2. Each entry uses the form the text uses, and every new word is glossed.
7. **Natural Spanish.** I read all 151 rewrites and a sample of the edits, and fixed what did not sound like Bogotá or Mexico City, for example "pensé que es antipático", "un poco de ahorro" and "no hubo wifi en media hora".

Other effects:
- **`tenses`.** Eight passages dropped a tense and none gained one. Four level 1 passages became present only, so the scheduler can now serve them before day 47: `a1-ident-clase`, `a1-car-jefe`, `a1-car-cambio` and `a1-eco-facturas`.
- **Titles.** All 323 titles in the set are now unique, and none clashes with a higher level.
- **Length.** Total words went from 21,785 to 21,866.

## Ten before and after excerpts

1. `u1-cafeteria` (day 1). Before: "—Hola, buenos días. ¿Está libre? —Sí, está libre." Then "¿Por qué está Tom en Madrid?", though Madrid was never said, and the correct option "Por la universidad" was the longest and the only one quoted. After: "Son las nueve de la mañana en una universidad de Madrid." Then "Tom: Hola, buenos días. ¿Está libre?" and "Ana: Sí, está libre.", with the options Para trabajar / **Para estudiar** / Para hablar español.
2. `a1-serv-policia` (day 2). Before: "—Buenos días. Hay un robo: no tengo mi cartera." and the officer's "Vamos a llamar a la policía del barrio." After: "Ana: Buenos días. No tengo mi billetera. Creo que está en el bus." and "Policía: Muy bien. Si alguien trae la billetera, la llamamos."
3. `a1-ident-bolso` (day 4). Before: "En mi bolso llevo el pasaporte, el carné, las llaves, la cartera y las gafas. También una agenda pequeña, una tarjeta de crédito, la tarjeta de estudiante y la tarjeta de la biblioteca." (42% enumeration). After: "Sofía sale para el trabajo, pero no encuentra las llaves." and "Sofía: Andrés, ¿sabes dónde están mis llaves? No están en el bolso."
4. `a1-ident-edad` (day 7). Before: "Mi hermana es una chica de veinte y mi hermano un chico de trece. Yo soy el mayor de los tres, y el señor mayor del piso de arriba es mi abuelo." After: "Jorge está con su familia en la taquilla del zoológico de Cali. Los niños menores de doce años no pagan." and "Jorge: La niña tiene ocho y el niño tiene trece."
5. `a1-car-miedo` (day 3). Before: "Mi hermano pequeño es muy tímido, reservado e inseguro." The options for him were Habladora / Tímida / Antipática. After: "Hoy hay una fiesta en la casa de la abuela, y Mateo no quiere hablar con nadie: está detrás de mi mamá. Pero con los primos es otro niño." The options are now **Muy tímido** / Sociable / Impaciente.
6. `a1-serv-tarjeta` (day 13, the third bank clone). Before: "—Buenas tardes. Mi tarjeta no funciona en el cajero automático y quiero cambiar dinero. —¿Tiene un documento de identidad?" After: "Lucía está en la caja de un supermercado. Quiere pagar con tarjeta, pero la tarjeta no funciona." and "Empleada: Lo siento, señora, la tarjeta no pasa. ¿Tiene otra?"
7. `a1-pol-paz` (day 14). Before: "Hay soldados, un general y mucho ejército. Un embajador va a la embajada y el cónsul al consulado." After: "Hoy Camila va con su papá a una manifestación por la paz frente al Congreso. Ella hace un cartel grande: “Queremos la paz”."
8. `cuadro-pintor-vocab10`. Before: "En su estudio, tiene botes de pintura roja, negra y blanca por todas partes. Para el cielo del cuadro, usa un gris suave, y para las flores, elige rosa y naranja brillante." After: "Mariana: ¡Cuánta pintura! ¿Cómo consigue el color verde?" and "Pintor: Mezclo azul y amarillo. Para el cielo uso un gris suave."
9. `a1-rel-vecino-nuevo` (day 10). Before: "—¡Hola, buenos días!", closing on "—Adiós, Marta. Buenas tardes.", and the question "¿Quién vive con Daniel?", which the text does not say. After: the passage opens "Daniel sube por la escalera del edificio con una caja grande." and closes "Daniel: Adiós, Marta. Hasta pronto.", and the question is "¿Qué familia tiene Daniel aquí?"
10. `a1-car-javier` (day 6), option balance. Before: "¿Por qué está serio hoy?" Porque es serio / **Porque trabaja mucho** / Porque está solo. The correct option was the longest and the only one quoted from the text. After: Porque es serio / **Por el trabajo** / Está enfermo. The gloss "character — the way somebody is" also lost its dash.

## Left for others

- **Cache version.** Run `node tools/bump-cache.js` before committing (`sw.js` CACHE_VERSION).
- **Stale tagger output.** `data/requires.js` and `data/lesson-nodes.js` were computed from the old passage text and are stale for these 323 ids. The arcade index may be stale too, since `tools/build-game-index.js` reads passages. Re-run the tagger and the index build.
- **Gate false alarms.**
  - Add "el jugo" to `data/vocab.js`, or add *jugo* to the gate's accent `KNOWN_CORRECT`.
  - Exempt "tener sed" from the vosotros-imperative reading.
  - The tense scanner misreads *tema*, *vista*, *caliente*, *perdone* and *buen viaje* as verbs, so the agents worded around them. It also read the subjunctive *calle* as "street", which let one subjunctive slip into a level 2 text (fixed in review).
- **`retired`.** The app does not read the field. Wire it into `js/session.js` before using it.
- **Edited texts.** The 172 edited passages keep their original prose. Some of the generated "verbos" and "vocab" families still read stiffly ("Cuando decidimos mudarnos, metemos todo en cajas grandes"), but nothing in them is wrong or Peninsular.

## Rewritten passages (151)

a1-serv-policia, a1-ident-bolso, a1-ident-edad, a1-serv-cuenta, a1-serv-tarjeta, a1-pol-paz, a1-car-miedo, un-dia-normal-verbos1, excursion-montana-verbos3, cena-vecinos-verbos22, clases-verano-verbos23, proyecto-comunitario-verbos24, reunion-vecinos-verbos25, reto-cocina-verbos26, terapia-grupo-verbos27, boda-presupuesto-verbos28, startup-nueva-verbos29, nuevo-portatil-verbos30, clinica-veterinaria-verbos31, equipo-disenio-verbos32, debate-medioambiente-verbos33, rutina-manana-verbos34, reunion-inversores-verbos35, directora-orquesta-verbos36, anillo-familia-verbos37, primer-dia-vecindario-vocab1, retrato-familia-vocab2, boda-familiar-vocab3, abuelos-nietos-vocab4, desayuno-saludable-vocab5, cena-especial-vocab6, numeros-loteria-vocab7, carrera-escolar-vocab8, planificador-semanal-vocab9, cuadro-pintor-vocab10, un-dia-por-la-ciudad-vocab11, paseo-domingo-vocab12, organizando-casa-vocab13, reforma-vecindario-vocab14, clase-yoga-vocab15, atardecer-playa-vocab16, maraton-ciudad-vocab18, primer-dia-escuela-vocab23, deportes-favoritos-vocab27, cambio-tiempo-vocab-weather, preparando-maleta-vocab-clothing, visita-granja-vocab-animals, lavando-platos-vocab-kitchen, formacion-profesional-vocab-career2, dia-profesiones-vocab-professions, etapas-pareja-vocab-relationships, noticias-locales-vocab-society, a2-cuerpo-carnet, a2-cuerpo-peluqueria, a2-caracter-examen, a2-alim-cena, a2-alim-mercado, a2-alim-restaurante, a2-ocio-concierto, a2-ocio-turista, a2-serv-documento, a2-salud-dentista, a2-salud-bano, a2-pol-alcalde, a2-arte-museo, a2-relig-navidad, a2-relig-barrio, a2-ident-formulario, a2-medios-postal, a2-compras-rebajas, a2-econ-alquiler, a2-edu-primer-dia, a2-viv-piso, a2-viv-compartir, a2-viajes-tren, a2-viajes-camping, a2-pol-reyes, a1-relig-clase, a1-relig-navidad, a1-relig-libro, a1-relig-abuela, a1-relig-viaje, a1-cuerpo-caida, a1-cuerpo-foto, a1-cuerpo-medico, a1-cuerpo-partido, a1-cuerpo-peluqueria, a1-caracter-companero, a1-caracter-hermanos, a1-caracter-profesor, a1-caracter-abuelo, a1-caracter-fiesta, a1-medios-quiosco, a1-medios-radio, a1-pol-elecciones, a1-pol-clase, a1-pol-television, a1-pol-capital, a1-serv-ambulancia, a1-serv-bomberos, a1-ident-ficha, a1-ident-clase, a1-viajes-tren, a1-viajes-hotel, a1-econ-primer-sueldo, a1-alim-bar, a1-alim-cena, a1-ciencia-clase, a1-arte-museo, a1-serv-emergencia, a1-salud-bano, a1-cuerpo-retrato, a1-cuerpo-gimnasio, a1-cuerpo-dentista, a1-cuerpo-familia, a1-cuerpo-manos, a1-cuerpo-paseo, a1-ident-carta, a1-car-clase, a1-car-hoy, a1-car-amigos, a1-car-jefe, a1-car-cambio, a1-medios-casa, a1-medios-carta, a1-medios-telefono, a1-medios-prensa, a1-medios-serie, a1-medios-radio-coche, a1-eco-facturas, a1-eco-pueblo, a1-eco-anuncio, a1-eco-pobreza, a1-eco-transporte, a1-eco-trabajo, a1-pol-reunion-distrito, a1-pol-reyes, a1-pol-votar-nacion, a1-pol-escuela, a1-pol-barrio, a1-via-aeropuerto, a1-via-tren, a1-via-hotel, a1-via-playa, a1-via-coche, a1-via-montana, a2-cuerpo-lesion, a2-cuerpo-abuelo, a2-cuerpo-foto, a2-car-vecino, a2-eco-publicidad.

The change log behind this (a `_change` and `_note` on every passage) and the batch scripts are in the session scratchpad under `a1/batches/`; `a1/final.json` is the merged set.
