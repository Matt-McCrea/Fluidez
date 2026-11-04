# Lexis pass: apply, writing, vocab, idioms, topics (4 November 2026)

Latin American conversion and dash removal for the five smaller data files. Counts are from `npm run gate` (dialect and dashes checks).

| file | dialect before | dialect after | dashes before | dashes after |
|---|---|---|---|---|
| data/apply.js | 67 | 0 | 29 | 2 |
| data/writing.js | 45 | 4 | 35 | 0 |
| data/vocab.js | 75 | 12 | 0 | 0 |
| data/idioms.js | 2 | 1 | 0 | 0 |
| data/topics.js | 4 | 0 | 5 | 0 |

## What remains and why

- apply dashes 2: the two `'—'` options (items 697, 698, "no word here") are the sentinel `js/ui.js` NOTHING reads and shows as "(nothing)". Changing them needs a `js/` change.
- Dialect leftovers are all accepted: `gafas` (allowed), `sed` read as a vosotros imperative (it is the noun, thirst), `escocés` read as voseo, `pasta` (the food), `aseo` in `aseo personal` (used in Latin America).
- `tools/gate/load.ts`: vocab entries carrying `variety` are now skipped, so the kept Peninsular entries do not count. One line.

## Changes

- apply: every vosotros item moved to ustedes (person `ellos`, or `ustedes` for imperatives) with the sentence changed to match, 5 transform items rebuilt (from and to), conducir to manejar, coche/ordenador/móvil/piso/billete/camarero swapped, "vale/guay/tío" register exercises now use listo/chévere/man, summer holiday wording dropped, one duplicate item (590) given its own sentence, all `why` and `instruction` dashes rewritten.
- writing: global lexis swaps (models and constraint words together), 4 vosotros tasks turned to ustedes (t-command-vosotros, w-command-vosotros-wait, t-hope-have-finished, b-wish, b-hope-rest-vosotros), two briefs with vosotros forms, `verbFormAny conducir` to manejar, `infinitiveUsed aparcar` to `containsWord estacionar` (estacionar is not in verbs.js), 35 dashes rewritten.
- vocab: 63 Peninsular entries marked `variety: 'es-ES'`, 54 Latin American counterparts added right after them at the same band, with collocations carried over and no `pcic` (as with jugo). Counterparts that already existed (jugo, the apartamento family, colegio, la hoja, el andén, la nevera) were not duplicated. The B1 `el carro` (trolley) entry was removed because `el carrito` already covers it, and the A1 `el carro` (car) took its name.
- idioms: `echar de menos` to `extrañar`.
- topics: coches, ordenador swapped; dashes rewritten.

## Ten before and after

1. apply: `Vosotros ___ (beber) demasiado café por la mañana.` person vosotros -> `Ustedes ___ (beber) ...` person ellos
2. apply: `Niños, ___ (organizar) vuestros juguetes antes de cenar.` vosotros -> `... sus juguetes ...` person ustedes
3. apply: `Rewrite as a vosotros command: Vosotros escucháis la música. -> Escuchad la música.` -> `Rewrite as an ustedes command: Ustedes escuchan la música. -> Escuchen la música.`
4. apply: `Mi abuelo ___ (conducir) un coche muy viejo` -> `Mi abuelo ___ (manejar) un carro muy viejo`
5. apply: `El precio del billete ___ (subir)` -> `El precio del boleto ___ (subir)`
6. apply why: `A job is what she is, not how she is — ser.` -> `A job is what she is, not how she is: ser.`
7. writing t-command-vosotros: `¡Escuchad la música!` -> `¡Escuchen la música!`
8. writing w-drove-verbos9: constraint `inf: 'conducir'` and model `Conduje hasta la montaña el sábado.` -> `inf: 'manejar'`, `Manejé hasta la montaña el sábado.`
9. vocab: `{es:'el zumo', ...}` gains `variety:'es-ES'`; `{es:'la patata', ...}` gains it and `{es:'la papa', en:'potato', ...}` follows
10. topics: `Talk about your family — who they are and what they do.` -> `Talk about your family: who they are and what they do.`

## Checks

`node tools/validate-content.js`: only the stale game-index, sw.js cache and `js/settings.js` complaints remain (not from these files). `node tools/test-checker.js`: OK, 732 writing tasks.
Gate JSON: `/private/tmp/claude-501/-Users-Matthew-Fluidez/5c1577ac-daa3-4d11-93f3-d865f75803b6/scratchpad/gate-lexis.json`.
