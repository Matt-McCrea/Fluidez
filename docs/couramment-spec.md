# Couramment spec (francais/)

Couramment ("fluently", as in *parler couramment*) is Vlot (nederlands/, docs/vlot-spec.md) rebuilt for French: a self-contained app in `francais/`, served at `/Fluidez/francais/`. Started 15 Nov 2026 on `next`. Everything not said here works exactly as in Vlot: read docs/vlot-spec.md first.

## Decisions (defaults, Matthew can change any)
- **Language:** standard French of France. Belgian, Swiss and Québécois variants are accepted when typed (as `x`/`alt`), never taught. tu for friends, vous for strangers, both taught.
- **Learner:** a complete beginner; English explains, French one tap away until B1. Every card asks for the French.
- **Typed answers:** case, spaces, final punctuation, curly apostrophes and œ/oe ignored. An accent-only slip (ecole for école) is a near miss, UNLESS the slip spells another form of the same verb or another option (mange for mangé, a for à, ou for où): then it is wrong, because that is the trap.
- **Storage keys start `couramment.`**. Cache `couramment-<ver>`. Name on the icon: Couramment. Icon 🥐.
- **Voices:** conversations only, fr-FR-DeniseNeural and fr-FR-HenriNeural.
- **Rounds:** **Tranquille** (10 questions, no clock) and **Contre la montre** (60 s). Spotlight text "👇 Fais ça maintenant" / "Do this now".

## Look: Toile de Jouy
Linen and madder red, like an 18th century Jouy print; calm and elegant, light theme. Follow the rules at the top of docs/app-themes.md (AA contrast, offline, solid panels behind lesson text and chips, docs/app-themes.md is updated with a Couramment section).
- `--bg #f6efe1` (linen), `--panel #fffaf0`, `--panel-2 #efe5d0`, `--border #d9c9a8`, `--text #2a1d1a`, `--muted #6b5a4e`.
- `--accent #a3202e` (rouge de Jouy), `--accent-2 #c43a48`, toile blue `#2c4a8a`, `--gold #8a6413` (records), good `#1f7a48`, bad `#b3261e`.
- Headings `"Didot", "Bodoni 72", "Bodoni MT", Georgia, serif`, weight 700, used only for headings and the wordmark (calm: no small caps, no drop caps, no italics); body the system sans.
- Background: a faint treillage (the Versailles garden trellis: a diagonal lattice with a small four petal rosette at every crossing) in madder red at about 10%, drawn as an inline SVG data URI by a generator in tools/fr/ (like tools/ar/make-pattern.js).
- Tile hues: Jouer gold `#b8860b`, Verbes madder `#a3202e`, Mots toile blue `#2c4a8a`, Phrases sage `#4f7a4a`, Conversations lavender `#7a5aa6`, Le ou la rose `#b84a6e`, Pronoms ochre `#a86b12`, Négation slate `#4a5a6a`, Prépositions teal `#21706b`.

## Board
Big **Jouer** (mix: 35% verbes, 35% mots, 10% phrases, 20% grammar tiles). Row: **Verbes**, **Mots**, **Phrases**, **Conversations**. Grammar row: **Le ou la**, **Pronoms**, **Négation**, **Prépositions**.

Kind keys (map from Vlot): `ww`→`vb`, `woorden`→`mots`, `zinnen`→`phrases`, `dehet`→`genre`, `volg`→`pron`, `geen`→`neg`, `mv`→`prep`, `speel`→`jouer`. Globals `FR_VERBS FR_WORDS FR_PHRASES FR_CARDS FR_CONVOS FR_BANK`, rules in `francais/js/fr-text.js` (`window.FR`, also module.exports).

## Data
### verbs.js: `window.FR_VERBS`
About 300 verbs, commonest first, all three groups and the irregulars (être avoir aller faire dire pouvoir vouloir savoir voir venir prendre mettre devoir falloir, the -oir, -re, pronominal verbs).
```
{ v: 'finir', en: 'finish', r, b, aux: 'a' | 'e' | 'ae',   // passé composé auxiliary; 'ae' both by meaning (monter, sortir, passer)
  pron: 1,                         // pronominal (se lever): always être
  f: { pres:  { je, tu, il, nous, vous, ils },
       imp:   { je, tu, il, nous, vous, ils },      // imparfait
       fut:   { ... }, cond: { ... }, subj: { ... },
       imper: { tu, nous, vous },
       pp: 'fini', ppr: 'finissant', inf: 'finir' } }
```
`FR.form(verb, tense, person, opts)`: tenses `pres imp fut cond subj imper pc pqp fp ae`. `pc` and `pqp`: the gap is the participle (auxiliary written in the sentence); `opts.agree` 'f' | 'mp' | 'fp' adds the agreement (elles sont allées). `ae`: the gap is the auxiliary form of avoir/être, `opts.tt` 'pres' | 'imp'. `fp`: futur proche, the gap is the form of aller. Persons `je tu il nous vous ils` (elle and on count as il, elles as ils). Elision is not part of the form: a frame writes `j'___` only where it must and the gate checks je + vowel.

### words.js: `window.FR_WORDS`
`{ fr, en, th, pos, g ('m'|'f'|'mf'), pl, fem, mpl, fpl (adjectives), r, b }`. Correction shows the article (*la maison*, *l'arbre (m)*). Typed accepts with or without the article. About 2,800 lemmas, curated as in Vlot (word-fix*.json).

### The GAP banks: `window.FR_BANK`
Vlot's shape (`k q a x o e w wf b t`, `wf` the why in French). Topic keys:
- **vb:** `pres imp fut cond subj imper pc ae pqp fp`.
- **genre** (computed from words.js): `art` (le, la, l', les, un, une), `part` (du, de la, de l', des), `contr` (au, aux, du, des after à and de), `adj` (agreement and position: grand, grande, grands, grandes; beau, bel, belle), `dem` (ce, cet, cette, ces), `poss` (mon, ma, mes; mon before a feminine vowel noun).
- **pron** (authored): `cod` (le, la, les, l'), `coi` (lui, leur), `y`, `en`, `ordre` (je le lui donne, donne-le-moi), `ton` (moi, toi, lui, eux), `rel` (qui, que, dont, où).
- **neg** (authored): `pas` (ne ... pas round the verb, round the auxiliary, ne pas + infinitive), `pasde` (pas de after a negative), `autres` (jamais, plus, rien, personne, aucun, ni ... ni), `que` (ne ... que), `familier` recognised only (spoken French drops ne; typed answers accept it, never taught as the answer).
- **prep** (authored): `lieu` (à Paris, en France, au Japon, aux États-Unis, chez), `verbe` (commencer à, finir de, essayer de, penser à), `temps` (depuis, pendant, il y a, dans, en), `moyen` (en voiture, à pied, à vélo).

### Frames (tools/fr/src/<kind>/*.json, built by tools/fr/build-gaps.js)
- **vb:** `{ q, v, t, p, agree?, tt?, aux?, e, b, w? }`, cue `(inf)` after the gap. Options: the same person in confusable tenses (pres/subj, imp/pc, fut/cond: parlerai/parlerais), the participle with and without agreement, the wrong auxiliary, all real forms of v.
- **genre:** `art` `{ q, n, t, e, b }`; `adj` `{ q: "C'est une ___ (petit) maison.", n, adj, t, e, b }`; `dem`, `poss` with an English cue (this/that, my/your...); `part` and `contr` `{ q, n, t, e, b }`.
- **pron, neg, prep:** fully authored `{ q, a, o, x?, e, w, wf?, t, b }`.

### phrases.js, conversations.js, cards.js
As in Vlot, with `fr` in place of `nl`. Phrase themes: `saluer` (greetings), `moi`, `conversation`, `sentiments`, `temps` (time), `meteo`, `maison`, `magasin` (shops, café, restaurant, boulangerie), `aide` (directions, transport, doctor), `travail`, `fete`. Conversations: 12, as in Vlot (6 A1, 4 A2, 2 B1). Cards, one per vb tense plus `groupes` (the three groups), `accord` (participle agreement), `pronominaux`, `genre`, `partitif`, `adj`, `pronoms`, `y-en`, `negation`, `prepositions`, `subjonctif` (when to use it), `nombres`; tense cards show three verbs side by side (parler, finir, prendre) with endings marked, as Líofa's and Juegos's do, plus strong-verb tabs for the irregulars.

## Sources
- Forms, gender, plurals, glosses: English Wiktionary via kaikki.org (French extract, CC BY-SA 4.0), in tools/fr/vendor (gitignored), streamed, gated and overridden by hand.
- Order: hermitdave/FrequencyWords fr 2018 (OpenSubtitles, CC BY-SA 4.0).
- All sentences, phrases, conversations and cards written for Couramment, blind-judged.

## State (15 Nov 2026)
Banks: vb 1,668, genre 736, pron 399, neg 237, prep 300; words 2,810; phrases 693; 12 voiced conversations; 22 cards. Blind judge: 3,372 judged, 99.9% agreed; 32 doubtful items dropped (tools/fr/src/drop.json), and future items never offer the present as an option, since a time word often makes it right too. Rebuild and check as for Vlot with tools/fr/*; tests tools/test-francais.js and tools/test-francais-app.js; contrast tools/check-card-contrast.js. Open: a native speaker read-through; words and phrases curated, not blind-judged.
