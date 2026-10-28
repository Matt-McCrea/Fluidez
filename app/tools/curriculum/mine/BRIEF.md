# Mining brief: old Fluidez lessons → skill-graph nodes (patterns, chunks, contrasts, can-dos)

You are a linguist and experienced ELE (Spanish as a foreign language) teacher helping build the
skill graph for **Fluidez 2**, a text-only Spanish app for English-speaking adults, A1→C1.
The app teaches **neutral Latin American Spanish** (story set in Bogotá, Colombia).

## Inputs (read all of them)
- Your lesson file (given in your task): old lessons with SEQ decisions, keywords, sections,
  exponents, contrasts, pitfalls, PCIC refs.
- `units-outline.txt` (same folder): the 60 units of the new course, with session ranges,
  theme, can-do and the grammar introduced in each. Use it to choose where each node goes.
- `grammar-index.txt` (same folder): every grammar node id (`g:…`) with the unit it is
  introduced in. These are the ONLY grammar ids you may reference.

## What to produce
One JSON file (path given in your task): `{ "nodes": [...], "triage": [...] }`.

### nodes: array of objects
```json
{
  "id": "p:seguir-gerundio",
  "kind": "pattern",               // pattern | chunk | contrast | cando
  "title": "Saying you're still doing something: sigo trabajando",
  "es": "seguir + -ando/-iendo: Sigo viviendo en Bogotá.",
  "en": "to still be doing something: I still live in Bogotá.",
  "unit": 31,                      // the unit (1-60) where it should first be taught
  "requires": ["g:gerund-ways"],   // g: ids from grammar-index.txt, or ids of nodes in YOUR output
  "contrasts": [],                 // for kind=contrast: the 2 (or 3) node ids being contrasted
  "unpacks": "g:…",                // chunks only, optional: the grammar node this chunk seeds
  "serves": ["d:describe-change"], // can-do ids (yours) this pattern/chunk helps achieve
  "pcic": ["nociones_generales:B1:532"],   // copy relevant refs from the source lesson
  "sources": ["nt-ciclo-accion-b1"],       // old lesson ids mined (exact ids from the file)
  "note": "for authors: pitfalls, what to contrast with, LatAm notes"
}
```

**Node kinds and id prefixes**
- `p:` **pattern** — a lexico-grammatical FRAME a learner must learn as a structure:
  verb + fixed preposition (*dirigirse a, darse cuenta de, acordarse de, contar con*),
  periphrases (*seguir + gerundio, dejar de + inf, volver a + inf, llevar + tiempo + gerundio*),
  meaning-changing pairs (*acercar / acercarse*), semantic contrasts in the lexicon
  (*húmedo* vs *mojado* — ONE pattern node covering the pair), frames like *tener forma de*,
  *ser de + material*, *hacer falta*, *quedar bien/mal*, discourse frames (*por un lado… por otro*),
  function exponent frames (*¿Te importa si…?*, *Te propongo que…*), collocation frames
  (*tomar una decisión, hacer una pregunta*), idioms that work as frames.
  One pattern = one teachable frame (or one tight pair/trio). Do not bundle 8 unrelated items.
- `c:` **chunk** — a fixed, high-frequency phrase learned whole (*¡Qué pena con usted!*,
  *¿Me regala un tinto?*, *Con mucho gusto*, *Que te mejores*, *Ni modo*, *¡Qué va!*).
  If the chunk seeds a grammar point taught later, set `unpacks` to that g: id.
  Social formulas, set reactions, conversation fillers and idioms that do not vary are chunks.
- `x:` **contrast** — only when two NODES are confusable and need mixed practice
  (e.g. `x:seguir-dejar-de` between `p:seguir-gerundio` and `p:dejar-de-inf`). Both sides must be
  node ids that exist (in grammar-index or in your own output). Do NOT make lexical-pair contrasts
  as x: — a lexical pair (húmedo/mojado, quedar/quedarse) is a p: pattern.
- `d:` **can-do** — "I can …" statements in plain English, one per real communicative function
  (merge near-duplicates, e.g. all the "agree" lessons at one level into one or two can-dos).
  `title` is the I-can statement. `unit` = where it is achievable.

### triage: one entry PER LESSON in your file
```json
{ "lesson": "nt-ciclo-accion-b1", "verdict": "patterns", "patterns": 4, "chunks": 0,
  "wordThemes": [], "note": "" }
```
verdict ∈ `patterns` (teaches frames → nodes), `wordlist` (a pure word list → becomes vocab
themes only, list them in wordThemes), `mixed` (both), `chunks` (mainly fixed formulas),
`function` (mainly a can-do + its exponent frames), `genre` (text-type skills → can-do +
frames), `task` (an output task → a can-do; maybe frames), `duplicate` (fully covered by
another lesson; say which in note), `skip` (teaches terminology only; say why).
**Triage per lesson, never per strand. Read the lesson, not its title**: "Textura y
consistencia" may be a semantic contrast (pattern), not a word list. The test is:
*does it teach a pattern, or list words?* Nothing that teaches a pattern may be shelved.

## Language rules (hard)
- **Neutral Latin American Spanish**: tú/usted/ustedes; never vosotros or voseo in es fields.
- Convert Peninsular items: *vale* → *listo / de acuerdo / bueno*; *coger* → *tomar/agarrar*;
  *coche* → *carro*; *móvil* → *celular*; *ordenador* → *computadora*; *piso* →
  *apartamento*; *zumo* → *jugo*; *conducir* → *manejar*; *gafas* → *gafas/lentes*;
  *¿me pones…?* → *¿me regala…? / ¿me da…?*; *tío/tía* (dude) → drop or *parce* (story only);
  *guay* → *chévere/bacano*; *quedar* (to meet) is fine; *ahora mismo* fine.
- Perfecto-for-today narratives are Peninsular: use the preterite (*Hoy fui…*). The
  LatAm perfecto is only for experience/"not yet"/open situations.
- Peninsular-only idioms: replace with a real LatAm/Colombian equivalent, or drop
  (say so in the lesson's triage note). Do not invent idioms; if unsure it is natural in
  Latin America, leave it out.
- lo/la standard (no leísmo). Drop leísmo notes.
- Colombian colour is welcome where natural and widely understood (*¿me regala…?*, *a la orden*,
  *qué pena*, *chévere*, *de una*, *listo*, *ahorita*, *tinto*); mark strongly regional slang
  (*parce, bacano, qué chimba*) in `note` as "story dialogue / recognition".
- Spanish must be correct and natural; accents always. English glosses natural.

## Titles: plain-English, learner-facing, no jargon
Good: "Saying you're still doing something: sigo trabajando". Bad: "Perífrasis aspectual
continuativa", "seguir + gerundio". A technical term may appear only in `note`.

## Placement (`unit`)
Pick the unit where the node serves that unit's theme/can-do AND all its `requires` are already
taught (grammar-index gives each g: node's unit; a pattern needing the subjunctive cannot go
before the unit that introduces it). The SEQ `day` in your file is a rough guide to band
position: SEQ A1 = days 0–106, A2 107–194, B1 195–328, B2 329–440, C1 441–536. Optional/deep
lessons belong in their own band. Spread nodes across the units of your band range; don't pile
everything into one unit. Prefer early placement for high-frequency, high-utility items.

## Volume and quality
Target counts are given in your task. Quality beats quantity: each node must be teachable in a
Patterns-day slot (a frame + 3 examples + its pitfall). Merge duplicates across lessons (one node,
several sources). ids: lowercase ascii, hyphens, no accents (`p:darse-cuenta-de`).
Check that every id you reference exists. Validate your JSON parses (`node -e` or `python3 -c`).
Do not write anywhere except your output file. Report back in ≤10 lines: counts by kind,
triage counts by verdict, and anything doubtful.
