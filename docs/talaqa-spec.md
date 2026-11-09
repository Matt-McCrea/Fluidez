# Ṭalāqa spec (arabiya/)

Ṭalāqa (طلاقة, "fluency") is Juegos rebuilt for Arabic, a sibling of Líofa (gaeilge/). It is a self-contained app in `arabiya/`, served at `/Fluidez/arabiya/`.

- **Variety:** Modern Standard Arabic (fuṣḥā) for everything. The phrases also come in Levantine (shāmī, Lebanon and Jordan) and Egyptian (maṣrī).
- **Learner:** a complete beginner. English explains, and the app starts with a script course. Plan and research: docs/arabic-plan.md.

## Rules carried over from Líofa
- Every arcade item asks for the Arabic: an English or audio prompt, an Arabic answer. Stage 0 also has reading rounds (Arabic word → transliteration), because reading is the skill being learnt there. These are the only rounds that go the other way.
- Tap first (4 options). An item answered right once comes back typed.
- Learnt is permanent: typed right on first sight, or recalled right 180+ days after the previous review. A miss un-learns it. A right tap never counts on first sight.
- No dashes in prose. The hyphen in a transliterated article (al-bayt, ash-shams) is spelling, and is allowed.
- No AI in the app.
- Rounds: **Hādiʾ** (هادئ, calm: 10 questions, no clock) and **Ḍidd al-waqt** (ضد الوقت, against the clock: 60 s, pauses when hidden).
- Storage keys start `talaqa.`. Never `fluidez.` or `liofa.`: all three apps share the same origin.

## Listening (new in this app)
Matthew allowed listening for Arabic, because the sounds are hard for English speakers.

- **Audio files.** Every letter, every word and every phrase has a recorded clip: neural voices, generated at build time by tools/ar/build-audio.py and shipped as mp3 files. Nothing is synthesised in the app.
- **`arabiya/data/audio.js`** sets `window.AR_AUDIO = { "<fully vowelled text>|<msa|lev|egy>": "audio/<file>.mp3", ... }`.
- **`AR.play(text, variety)`** (in ar-audio.js) looks the clip up and plays it with one shared `Audio` element. It does nothing when there is no clip.
- **Speaker buttons.** A 🔊 button sits next to every Arabic prompt that has a clip.
- **After an answer.** The answer's clip plays after every answer when `talaqa.prefs.autoplay` is on. It is on by default, with a toggle in settings.
- **Listening rounds:**
  - stage 0 *hear*: play a sound, pick the letter;
  - Kalimāt *hear*: play a word, pick the written word. This is one item in five, once a word has been answered right once.
- **Service worker.** The letter clips (`audio/l-*.mp3`) are precached. Every other clip is cached the first time it plays (a runtime cache-first rule for `/audio/`), so the app works offline for anything already heard.

## Script, direction, font
- **Direction.** The page is `dir="ltr"` with English UI. Every Arabic node gets `dir="rtl" lang="ar"` and the class `.ar`.
- **`.ar` style.** `font-family: 'Naskh', 'Geeza Pro', serif; line-height: 1.9`, so the vowel marks do not clip, and 1.35× the surrounding size.
- **The font** is `arabiya/fonts/naskh.woff2` (Noto Naskh Arabic, OFL), loaded with `@font-face { font-family: 'Naskh'; font-display: swap }`.
- **Mixed text.** Always wrap Arabic inside English text in its own `<span class="ar" dir="rtl">`. Never let raw Arabic sit inside an English sentence.
- **Vowel level.** Every Arabic string in the data is stored fully vowelled. Before display it passes through `AR.fade(text, level, helpForm)`, with the level chosen like this:
  - **Words** (Kalimāt, Jumūʿ, Jidhr options and prompts):
    - Full while the word is new.
    - Help after 2 right answers.
    - Bare once learnt.
    - The setting `talaqa.prefs.vowels` (`auto` | `full` | `bare`) overrides this.
  - **Sentences** (the GAP banks):
    - A1: full.
    - A2: help.
    - B1 and B2: bare.
    - The same setting overrides this.
  - **Ḥarakāt items and every card example** always show full vowels.
  - **Hold to see the vowels.** Pressing and holding any faded Arabic text for 350 ms shows its full vowelling until release. It is not a miss.
- **Typed answers** use `AR.check(input, accepted)`:
  - Vowel marks never count.
  - A hamza seat, ة/ه or ى/ي slip is `near`, with a note from `AR.slip`.
  - The input box is `dir="rtl" lang="ar" autocapitalize="off" autocorrect="off" spellcheck="false"`.
- **Keyboard guide.** The first typed item ever shows a one-time sheet: "Add the Arabic keyboard: Settings → General → Keyboard → Keyboards → Add New Keyboard → Arabic, then tap 🌐 to switch". It has two buttons, "Done" and "Remind me later" (the flag `talaqa.kbd`).
- **Transliteration** (`AR.translit`) appears in small grey type under a word's Arabic:
  - in stage 0;
  - for A1 words until their second right answer.
  - It is never shown on bare text.

## Stage 0: Ḥurūf (the script course)
Data: `arabiya/data/letters.js`, written by hand.

- **Letters.** `window.AR_LETTERS = [{ id, ch, name, tr, say, forms?, lesson, ex: [{ar, tr, en}] }]`.
  - `say` is the English sound guide.
  - `forms` comes from `AR.forms(ch)` unless authored.
- **Lessons.** `window.AR_LESSONS = [{ n, title, en, letters: [ids], card: { how: [..], tip }, kinds: [...], words: [{ar, tr, en}] }]`.

Round kinds:
- `sound` (prompt: transliteration + audio; options: 4 letters)
- `hear` (audio only; options: 4 letters)
- `shape` (prompt: a letter alone + a position name; options: 4 shapes)
- `vowel` (prompt: audio + transliteration of one syllable such as *bu*; options: بَ بِ بُ بْ)
- `read` (prompt: a vowelled word; options: 4 transliterations)
- `build` (prompt: English + transliteration + audio; the learner taps letter tiles, in reading order, into a right-to-left answer row; 2 decoy tiles; a backspace tile)

How it plays:
- The lessons run in order. A lesson is passed with 8 of 10 right in a Hādiʾ round of its own kinds, mixed with earlier letters 1 in 4.
- Every letter, letter-and-position and lesson word becomes an SRS item.
- **Exit test:** 40 items over all kinds. 32 right opens the arcade board. The first-open screen offers "I'm new to the script" (lesson 1) or "I can read Arabic" (the exit test).
- **On the board.** After stage 0, Ḥurūf stays on the board as a small tile for review.

## Board
- **Big tile:** **Ilʿab** (العب, play). Its mix is 35% afʿāl, 35% kalimāt, 10% ʿibārāt and 20% the grammar tiles; misses and due items come first.
- **Row:** **Afʿāl** (verbs in sentences), **Kalimāt** (words), **ʿIbārāt** (phrases, with a variety chooser: Fuṣḥā, Shāmī, Maṣrī, or all three in turn).
- **Grammar row:** **Ḥarakāt** (vowels), **Jidhr** (root and pattern), **Jumūʿ** (plurals), **Ḍamāʾir** (pronouns), then **Ḥurūf**.
- **Labels.** Each label is in Arabic with the transliteration and English in a small line under it.
- **Hues:**
  - Ilʿab `#e9b44c`
  - Afʿāl `#2a9df4`
  - Kalimāt `#e07a3f`
  - ʿIbārāt `#b06ad6`
  - Ḥarakāt `#2ec4b6`
  - Jidhr `#6cbf4a`
  - Jumūʿ `#e05a7a`
  - Ḍamāʾir `#d9653b`
  - Ḥurūf `#c9a227`
- **Palette** (lapis night): `--bg #0b0f1c --panel #141a2e --panel-2 #1c2440 --border #28324f --text #eef1f8 --muted #95a0bd --accent #2ec4b6 --gold #e9b44c --good #46d98a --bad #ff6b5e`.
- **Icon:** ع in gold on `#12305a`.

## Bands
A1, A2, B1, B2. Stage 0 comes before A1. After stage 0 the exit test score sets the start band: A1, or A2 at 38/40 or better.

## Data files (arabiya/data/, generated, each sets a window global)

### verbs.js: `window.AR_VERBS`
Built by tools/ar/build-verbs.py with Qutrub (GPL, used at build time only) from my list tools/ar/src/verbs.json.

- **Entry:** `{ v, en, root, form (1 to 10), ms (maṣdar), b, r, f: { tense: { person: form } } }`, all fully vowelled.
- **Tenses:**
  - `madi`: past
  - `mudari`: present indicative
  - `mansub`: subjunctive, after an/lan
  - `majzum`: jussive, after lam/lā of prohibition
  - `amr`: imperative
  - `madi_m`: past passive
  - `mudari_m`: present passive
- **Persons:** `ana anta anti huwa hiya nahnu antum antunna hum hunna antuma huma humaf`.
- **Persons by band:** A1 uses the first 8 (to `antum`) plus `hum`; A2 adds `antunna` and `hunna`; B1 adds the duals.

### The GAP banks: `window.AR_BANK` (one array, all grammar tiles and afʿāl)
```
{ k:  'afal' | 'harakat' | 'jidhr' | 'jumu' | 'damair',
  q:  "أَمْسِ ___ الرِّسَالَةَ.",      // fully vowelled Arabic, one ___ gap
  c:  "write · he",                 // the cue, English, shown under the sentence (LTR)
  a:  "كَتَبَ",                      // the answer, fully vowelled
  x:  [],                           // other accepted answers (optional)
  o:  ["كَتَبَ", "يَكْتُبُ", "سَيَكْتُبُ", "كَتَبْتُ"],   // 4 options incl. a
  e:  "Yesterday he wrote the letter.",
  w:  "أَمْسِ, yesterday: the past.",   // why, English with Arabic in it, under 110 chars
  b:  'A1', t: 'madi',              // band, topic
  v, p                              // afal only: verb (past huwa form) and person
}
```
- **Topic keys.**
  - afal: `madi mudari mustaqbal amr lam lan la kana majhul`.
  - harakat: `wasl shadda tanwin majhul case`.
  - jidhr: `pattern` (pick the word for a meaning from one root) and `root` (which root).
  - jumu: `broken sound dual`.
  - damair: `poss` (on nouns), `obj` (on verbs) and `prep` (on prepositions).
- **Display.** `q` and the options are faded by the sentence rule. The cue `c` is plain English.

### words.js: `window.AR_WORDS`
`{ ar, en, g ('m'|'f'), pl (plural, vowelled, optional), root, pos ('n'|'v'|'adj'|'adv'|'prep'|'x'), th, b, r, h (helping form, optional), alt [] }`. Nouns are written without case endings (the pausal form, كِتَاب not كِتَابٌ).

### phrases.js: `window.AR_PHRASES`
`{ id, en, msa, lev, egy, th, b, n (note, optional), alt: { msa: [], lev: [], egy: [] } }`.

- **Where they are empty.** `lev` and `egy` may be empty where a phrase is the same everywhere.
- **Playing a phrase:**
  - Practice picks one variety (from the chooser) and asks for that version. The item shows a badge: Fuṣḥā / Shāmī / Maṣrī.
  - After the answer, the other varieties show with 🔊 buttons.
  - Typed at 5 words or fewer, chips at 6 to 8.
- **Spelling.** Dialect spellings vary, so `alt` carries the common ones.

### cards.js: `window.AR_CARDS` (the little pages)
- **Shape:** `{ key: { kind, topic, name: {ar, en}, when: [{ar, en}], how: {ar, en}, table: { head, rows }, ex: [{ar, en}], tip: {ar, en} } }`.
- **Marking Arabic:** card text uses `*word*` for Arabic inside English. The renderer wraps it in `.ar` spans.
- **Cards:** one per afʿāl topic, then `persons`, `forms` (verb forms I to X), `weak`, `harakat`, `article` (sun and moon letters), `root`, `plural`, `gender`, `nominal` (no "is"), `idafa`, `damair`, `numbers`, `dialects`.

## Gate (tools/ar/checks/*.js, run by node tools/test-arabiya.js)
Every GAP item must pass all of these:
- exactly one `___`;
- `a` is among `o`;
- `o` has 4 entries that are distinct after `AR.strip`;
- no dashes in `e` or `w`;
- `q` is 2 to 12 words;
- the band is valid;
- every Arabic string in `q`, `a` and `o` is fully vowelled (each letter carries a mark, except long-vowel letters, the article alif and final pausal letters).

Afʿāl items also need `a === AR_VERBS[v].f[tense][p]` for the topic's tense, with prefixes added: sa- for mustaqbal, kāna for kana. Words: no duplicate `ar`, and every noun has a gender. Audio: every word, phrase and letter has a clip in audio.js.
