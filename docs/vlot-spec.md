# Vlot spec (nederlands/)

Vlot ("fluent", as in *vlot Nederlands spreken*) is Líofa (gaeilge/) rebuilt for Dutch: a self-contained app in `nederlands/`, served at `/Fluidez/nederlands/`. Started 14 Nov 2026 on `next`.

## Decisions (defaults, Matthew can change any)
- **Language:** standard Dutch as spoken in the Netherlands (ABN). Common Flemish variants are accepted when typed (as `x`/`alt`), never taught. Spelling: the Groene Boekje (2015).
- **Learner:** a complete beginner. English explains; Dutch is one tap away until B1 (Profile.term), as in Líofa.
- **Every card asks for the Dutch** (English prompt, Dutch answer). Tap first (options), typed once answered right. Learnt is permanent (typed right on first sight, or recalled 180+ days later); a miss un-learns. No eternal reviews.
- **No dashes in prose.** No AI in the app, no speech recognition. Conversations are voiced (nl-NL neural voices), as in Líofa.
- **Storage keys start `vlot.`**, never `fluidez.` or `liofa.` (same origin). Cache `vlot-<ver>`.
- **Look:** De Stijl, light, black lines and primary blocks; see docs/app-themes.md (replaced the first Delft navy palette on 14 Nov).
- Rounds: **Rustig** (10 questions, no clock) and **Tegen de klok** (60 s, pauses when hidden). Bands A1, A2, B1, B2; placement on first open.

## Board
Big **Speel** (mix: 35% werkwoorden, 35% woorden, 10% zinnen, 20% grammar tiles; misses and due first). Row: **Werkwoorden**, **Woorden**, **Zinnen**, **Gesprekken** (conversations). Grammar row: **De of het**, **Woordvolgorde**, **Niet of geen**, **Meervoud en -je**. Dutch label, small English line under it.

Tile colours: solid De Stijl blocks, see docs/app-themes.md.

Kind keys (map from Líofa): `briathra`→`ww`, `focail`→`woorden`, `frasai`→`zinnen`, `seimhiu`→`dehet`, `forainm`→`volg`, `tais`→`geen`, `freagair`→`mv`, `imir`→`speel`.

## Data files (nederlands/data/, all generated, each sets a window global)

### verbs.js: `window.NL_VERBS`
Built by tools/nl/build-verbs.js. Commonest first, about 250 verbs.
```
{ v: 'opbellen', en: 'call (on the phone)', r: 41, b: 'A1',
  aux: 'h' | 'z' | 'hz',          // perfect auxiliary: hebben, zijn, either (by meaning)
  sep: 'op',                       // separable prefix, absent if none
  refl: 1,                         // usually reflexive (zich wassen), absent if not
  f: { ott: { ik, jij, jinv, u, hij, wij, jullie, zij },   // present; jinv = jij after the verb (werk jij)
       ovt: { sg, pl },            // simple past: werkte / werkten
       vd: 'gewerkt',              // past participle
       imp: 'werk',                // imperative
       inf: 'werken' } }
```
Forms of a separable verb are stored JOINED (`opbel`, `opbelt`, `belde op` is stored as `opbelde`); `NL.form` splits them. u takes the hij form (u bent, u hebt/heeft: both accepted).

`NL.form(verb, tense, person, opts)` in nederlands/js/nl-text.js gives the gap word. `opts.inv` (jij/je after the verb: werk jij), `opts.sub` (subordinate clause: separable verb stays joined, *dat hij opbelt*). Main clause separable: the gap is the verb part only (*Hij belt me morgen op*: gap `belt`). Tenses for gaps:
- `ott` present, `ovt` simple past, `vtt` perfect (gap is the participle, auxiliary written in the sentence), `hz` (gap is the auxiliary form of hebben/zijn for this verb, in present or past: `tt: 'ott'|'ovt'`), `toek` future (gap is the zullen form), `cond` (gap is zou/zouden), `imp` imperative.

### The GAP banks: `window.NL_BANK` (one array, every gap tile)
Each file pushes into it. Same shape as Líofa's GA_BANK:
```
{ k: 'ww' | 'dehet' | 'volg' | 'geen' | 'mv',
  q: "Gisteren ___ (werken) ik tot zes uur.",   // one ___ gap; cue in brackets after it where needed
  a: "werkte", x: [...],                         // answer, other accepted typed answers
  o: ["werkte", "werk", "werkt", "werkten"],    // 2 to 4 options incl. a
  e: "Yesterday I worked until six.",            // English of the sentence
  w: "Gisteren: the simple past. werken, stem werk, k is in 't kofschip, so -te.",  // why, English, under 110 chars
  wn: "Gisteren: de verleden tijd.",              // why, Dutch (optional)
  b: 'A1', t: 'ovt',                             // band, topic
  v, p, inv, sub, tt                             // ww only
}
```
Topic keys:
- ww: `ott ovt vtt hz toek cond imp` (above).
- dehet: `art` (de/het), `dem` (deze/dit/die/dat; cue this/that), `adj` (adjective -e: een groot huis, een grote tafel, het grote huis), `rel` (relative die/dat), `bez` (possessives and pronouns: mijn/zijn/haar/hun/ons/onze).
- volg: `inv` (verb second after a fronted word: Morgen ga ik), `bijzin` (verb last after dat/omdat/als/wanneer/of/die), `scheid` (separable verbs: Hij staat om zeven uur op / omdat hij om zeven uur opstaat), `vraag` (questions, jij inversion), `te` (om te, te + infinitive, modals take no te), `cluster` (B1+: verb groups at the end: dat ik het heb kunnen doen). Options are chunks (same words in different orders) or single words.
- geen: `geen` (geen before an indefinite noun), `niet` (niet with verbs, definite nouns, adjectives, names), `pos` (where niet goes), `neg` (nooit, niemand, niets, nergens), `meer` (geen ... meer, niet meer, nog niet, nog geen).
- mv: `pl` (plural: -en, -s, -'s, vowel doubling boom/bomen, consonant doubling bus/bussen, irregular stad/steden, kind/kinderen), `dim` (diminutive -je -tje -pje -etje -kje, always het), `dimpl` (diminutive plural).

### words.js: `window.NL_WORDS`
`{ nl, en, th, pos ('n'|'v'|'adj'|'adv'|'prep'|'pron'|'num'|'x'), g ('de'|'het'|'dh' both, nouns only), pl, dim, ae (adjective -e form: grote, dikke, rode), r, b }`. Play: English shown, Dutch asked; correction shows the article (*het huis*). Typed accepts with or without the article.

### phrases.js: `window.NL_PHRASES`
`{ nl, en, alt [], th, b, t (tier 1 to 3), n (note) }`.

### cards.js: `window.NL_CARDS`
Líofa's card shape with `nl` in place of `ga`: `{ key: { kind, topic, name: {nl, en}, when: [{nl, en}], how: {nl, en}, table: {head, rows}, ex: [{nl, en}], tip: {nl, en} } }`. One per ww tense, plus `kofschip`, `scheid`, `modaal`, `wederkerend` (zich), `dehet`, `adj`, `volgorde`, `bijzin`, `te`, `geen`, `mv`, `dim`, `pron` (ik/mij/mijn), `er`, `getallen`.

### conversations.js: `window.NL_CONVOS` (tools/convos/nl.json via tools/build-convos.js nl)

## nederlands/js/nl-text.js: `window.NL` (also `module.exports` for Node)
Same check API Líofa's game code calls on `GA` (names kept), plus `form`. Typed answers: case, spaces, final punctuation, curly apostrophes and the ĳ ligature ignored. An accent-only slip (een for één, ideeen for ideeën, cafe for café) is a near miss. A d/t slip (word for wordt, gebeurt for gebeurd) is WRONG: that is the trap.

## Gate (tools/nl/checks, run by node tools/test-nederlands.js)
Every GAP item: exactly one `___`; a in o; o distinct, 2 to 4; no dashes in q/e/w; q 3 to 14 words; valid band and topic. ww: `a === NL.form(v, t, p, {inv, sub})` (hz: the aux form). dehet art/adj/rel, mv: a recomputed from words.js. volg chunk items: every option has the same words as a. Words: no duplicate `nl`, every noun has g. Every option of a ww item is a real form of that verb.

## Sources
- Forms, gender, plurals, diminutives, glosses: English Wiktionary via kaikki.org (Dutch extract, CC BY-SA 4.0), in tools/nl/vendor (gitignored). Gated and overridden by hand in tools/nl/src/*-fix.json.
- Order: hermitdave/FrequencyWords nl 2018 (OpenSubtitles, CC BY-SA 4.0).
- All sentences, phrases, conversations and cards written for Vlot.

## Sources for the gap banks (tools/nl/src/<kind>/*.json, built by tools/nl/build-gaps.js)
Authors write frames; the build computes what it can and the gate checks the rest.
- **ww** frame: `{ q, v, t, p, inv?, sub?, tt?, e, b, w? }`. q has `___ (inf)` at the verb. The build computes a = NL.form(...), and the options: the same person in confusable tenses, the jij/jinv twin, the d/t twin (wordt/word, gebeurd/gebeurt), all real forms of v. w is a per-topic template unless the frame gives one.
- **dehet** `art`: `{ q, n, t, e, b }`, the gap where the article goes (*___ huis staat aan de gracht.*); a = de/het from words.js, capitalised at the start; options de, het. `dem`: `{ q: "___ (this) boek ...", n, pl?, t, e, b }`; options deze, dit, die, dat. `adj`: `{ q: "Wij hebben een ___ (groot) huis.", n, adj, t, e, b }`; the build reads the word before the gap (een, de, het, geen, mijn..., or none) and computes groot/grote from words.js; options the two forms. `rel`: `{ q: "Het boek ___ ik lees, is mooi.", n, pl?, t, e, b }`; options die, dat. `bez`: fully authored (a, o).
- **mv**: `{ q: "Ik heb twee ___ (kat).", n, t: 'pl'|'dim'|'dimpl', e, b }`; a from words.js pl/dim; options are the right form and the classic wrong spellings (katen, kats, kattes) built by the build.
- **volg** and **geen**: fully authored `{ q, a, o, x?, e, w, wn?, t, b }`.

## Build and check (state 14 Nov 2026)
Banks: ww 1,480, dehet 659, volg 391, geen 316, mv 374; words 2,800; phrases 651; 12 voiced conversations; 22 cards (ovt and vtt carry strong-verb tabs).
- Data: `sh tools/nl/vendor-get.sh`, then `node tools/nl/build-verbs.js`, `build-words.js` (fixes: src/word-fix*.json, merged), `build-phrases.js`, `build-gaps.js` (tools/nl/gaps-lib.js holds the rules; src/drop.json drops by q), `build-cards.js`, `node tools/build-convos.js nl`, `tools/ar/vendor/venv/bin/python tools/build-convo-audio.py nl`.
- After any change under nederlands/: `node tools/nl/bump-cache.js`, then `node tools/test-nederlands.js && node tools/test-nederlands-app.js`.
- Blind judge: `node tools/nl/make-blind.js`, judges write tools/nl/judge/*.verdict.json, `node tools/nl/score-blind.js`. First pass: 3,230 judged, 99.7% agreed; 10 ambiguous items dropped, zal/kan/wil accepted beside zult/kunt/wilt for jij and u.
- Open: a native speaker read-through; words and phrases were curated and checked by machine, not blind-judged.
