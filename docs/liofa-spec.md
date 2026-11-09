# Líofa spec (gaeilge/)

Líofa is Juegos (juegos/, js/arcade.js) rebuilt for Irish: a self-contained app in `gaeilge/`, served at `/Fluidez/gaeilge/`. Standard: An Caighdeán Oifigiúil. Learner: a complete beginner, so English explains and Irish is one tap away until B1. Plan: /Users/Matthew/.claude/plans/ok-crazy-thought-but-splendid-waffle.md.

## Rules carried over from Fluidez
- Every card asks for the Irish (English prompt, Irish answer). Never Irish to English.
- Tap first (4 options); an item answered right once comes back typed.
- Learnt is permanent: typed right on first sight, or recalled right 180+ days after the previous review. A miss un-learns. A right tap never counts on first sight. No eternal reviews.
- No dashes in prose (the hyphen inside n-/t- forms like n-ól, t-uisce is spelling, and allowed). No listening, no AI in the app.
- Rounds: **Go réidh** (10 questions, no clock) and **In aghaidh an chloig** (60 s, pauses when hidden).
- Storage keys start `liofa.`, never `fluidez.` (same origin as the Spanish app).

## Board
Big **Imir** (mix: 35% briathra, 35% focail, 10% frásaí, 20% the four grammar tiles; misses and due first). Row: **Briathra** (verbs in sentences), **Focail** (words), **Frásaí** (phrases). Grammar row: **Séimhiú agus urú**, **Forainmneacha**, **Tá nó Is**, **Freagair**. Each label in Irish with a small English line under it.

Hues: Imir `#e8b64a`, Briathra `#2fae6e`, Focail `#a26bd1`, Frásaí `#3a8fd6`, Séimhiú/urú `#e0a526`, Forainmneacha `#d9653b`, Tá nó Is `#2fb3a5`, Freagair `#e05a7a`. Palette: `--bg #0b1311 --panel #13201b --panel-2 #1b2c25 --border #24382f --text #eef4ee --muted #8fa69a --accent #3fbf7f --gold #e8b64a --good #46d98a --bad #ff6b5e`.

## Bands
A1, A2, B1, B2. Placement on first open sets the band (Profile equivalent in `liofa.profile`).

## Data files (gaeilge/data/, all generated, each sets a window global)

### verbs.js: `window.GA_VERBS`
Built by tools/ga/build-verbs.js from BuNaMo. `{ v, en, vn, va, r, b, f: { tense: { person: [indep, dep|0, syn] } } }`, forms unmutated. Tenses: `lait` present, `gnathlait` (bí only: bíonn), `caite` past, `fhaist` future, `coinn` conditional, `gnath` past habitual, `ord` imperative. Persons: `me tu se si muid sibh siad saor`. `syn` = 1 when the person is inside the verb (déanaim, rinneamar, dhéanfainn): the sentence then shows no pronoun. gaeilge/js/ga-text.js `GA.formAfter(particle, verb, tense, person)` gives the mutated gap word.

### The GAP banks: `window.GA_BANK` (one array, every grammar tile)
Each file pushes into it: `(window.GA_BANK = window.GA_BANK || []).push(...)`. One shape for all five kinds:

```
{ k:  'briathra' | 'seimhiu' | 'forainm' | 'tais' | 'freagair',
  q:  "Inné ___ (feic) mé an madra.",   // one ___ gap; the cue in brackets after it
  a:  "chonaic",                       // the answer (gate-computed where it can be)
  x:  ["..."],                         // other accepted answers when typed (optional)
  o:  ["chonaic", "feicim", "feicfidh", "fhaca"],   // 4 options incl. a, all real Irish
  e:  "Yesterday I saw the dog.",      // English of the whole sentence (one tap away)
  w:  "Inné: the past. Past forms take séimhiú.",   // why, English, under 110 chars
  wg: "Inné: an aimsir chaite.",       // why, Irish (optional)
  b:  'A1',                            // band
  t:  'caite',                         // topic: tense key for briathra, rule key otherwise
  v, p, pt                             // briathra only: verb, person, particle before the gap
}
```
Topic keys by kind:
- briathra: the tense keys above, plus `saor` (autonomous, any tense; t='saor', tense in `tt`) and `ag` (ag + verbal noun).
- seimhiu: `poss` (mo/do/a/ár/bhur/a), `art` (an + noun, an t-, an ts, na h-), `prep` (ar, de, do, faoi, ó... ; i; ar an, ag an...), `num` (1 to 6 lenite, 7 to 10 eclipse), `adj` (adjective after feminine noun), `verb` (ní, an, go, nach, má, dá, a), `h` (h-prefix: a hathair, go hálainn, le hÉirinn).
- forainm: the preposition (`ag`, `ar`, `le`, `do`, `ó`, `chuig`, `as`, `de`, `faoi`, `i`, `roimh`, `thar`, `trí`, `um`).
- tais: `is` (copula), `ta` (bí), `ba` (copula past/conditional), `ea` (is ea / ní hea), `mo` (i mo + noun).
- freagair: `bi`, `verb`, `cop`. The q is the question, a gap and a cue, e.g. `"An bhfaca tú é? ___ (yes)"`, a is the echo answer (`"Chonaic"` / `"Ní fhaca"`).

### words.js: `window.GA_WORDS`
`{ ga, en, g ('m'|'f'|absent), pl (plural, optional), th (theme), b (band), r (rank, 1 = commonest), pos ('n'|'v'|'adj'|'adv'|'prep'|'x') }`. Play: English shown, Irish asked; tap (4 Irish words of the same theme and band) then typed. Typed accepts the bare word. Gender shown on the correction ("cailín, masculine").

### phrases.js: `window.GA_PHRASES`
`{ ga, en, alt [], th, b, t (tier 1 to 3), n (note, optional) }`. Typed at 6 words or fewer, chips at 7 or 8, tapped until right once.

### cards.js: `window.GA_CARDS` (the little pages)
`{ key: { kind: 'tense'|'grammar', topic, name: {ga, en}, when: [{ga, en}], how: {ga, en}, table: { head: [...], rows: [[...]] }, ex: [{ga, en}], tip: {ga, en} } }`. One per tense key, `saor`, `ag`, `dep` (dependent forms), `seimhiu`, `uru`, `prefix` (t and h), `copail`, `forainm`, `freagair`, `ginideach`, `uimhreacha`. Card text: `*word*` marks Irish inside English.

## Gate (tools/ga/checks/*.js, run by node tools/test-gaeilge.js)
Every GAP item: exactly one `___`; a is among o; o has 4 distinct entries; no dashes in q/e/w; q 3 to 12 words; band valid. Briathra: `a === GA.formAfter(pt, verb, tense, p)` and the word before the gap is `GA.particleWord(pt, ...)` when pt is set; for a synthetic person no pronoun follows the gap, for an analytic one the pronoun does. Séimhiú: a recomputed from the base in brackets and the rule. Words: no duplicates of `ga`; gender present on nouns.
