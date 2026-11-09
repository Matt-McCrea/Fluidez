# Arabic Juegos: research and plan (draft, 9 Nov 2026)

Working name **Ṭalāqa** (طلاقة, "fluency", the Arabic for Fluidez and Líofa). Own folder `arabiya/`, own `talaqa.` storage, same engine as Líofa.

## 1. Why Arabic is a different job

Irish and Spanish start on day one with words. Arabic cannot, for four reasons:

1. **A new script.** It has 28 letters, written right to left. Most letters change shape by position (initial, medial, final, alone). Six letters never join to the next one (ا د ذ ر ز و). Many letters differ only by their dots (ب ت ث ن ي, ج ح خ).
2. **Short vowels are optional marks.** Everyday text writes only consonants and long vowels. The short vowels, ḥarakāt (َ ِ ُ ْ ّ ً ٍ ٌ), appear in children's books, the Qur'an and learner texts, and almost nowhere else. A reader has to know the word to know how to say it.
3. **Sounds English does not have.** ع ح خ غ ق and the emphatics ص ض ط ظ. The app has no listening (your rule), so these need a written answer. See decision D2.
4. **Diglossia.** Modern Standard Arabic (fuṣḥā) is what people read and write. Each country speaks its own dialect. See decision D1.

So the plan is to put a **script course, stage 0**, in front of the arcade. It is short and game shaped, and it has a hard exit test. The arcade tiles then open as the script is learnt.

## 2. The vowel strategy (the heart of the question)

Research: learners read faster and more accurately with ḥarakāt at first. Full vowelling slows skilled readers later. Staged removal worked in a 94-learner study (Alshehri & Ali 2023). A "semi-deep" proposal (Alqazlan 2023) drops vowels from the most frequent words first, and keeps them only where they decide the meaning, such as active and passive. No study gives a timetable, so the app uses evidence it collects itself.

### What the learner sees: vowels fade per word, not per level

Every word in the data is stored **fully vowelled** (كَتَبَ). The app shows it at one of three levels:

| Level | Shown as | When |
|---|---|---|
| Full | كَتَبَ | new words, all of stage 0, all of A1 |
| Helping | كتَب (only the vowels that decide the word, plus shadda) | the word has been read right twice |
| Bare | كتب | the word is learnt, and in everything from B1 up |

The level belongs to each word, and the learner's own record sets it. The vowels go once you know the word. Only real ambiguities keep a vowel at the Helping level: the passive (كُتِبَ against كَتَبَ), Form II shadda (درّس against درس), and words that would otherwise look the same.

**Case endings** (the final vowel of iʿrāb) are never required. They are shown only on a few grammar cards. Speakers drop them, and so do most courses before B2.

**One tap shows the vowels.** On any bare word, holding it shows the full vowelling. It does not count as a miss. It is the "English one tap away" idea, applied to vowels.

### What the learner types

- **Answers are checked without ḥarakāt by default.** The checker strips the vowels from both sides, then compares. If a learner types vowels and they are wrong, it is a near miss, not a wrong answer.
- **Vowels count only in the Ḥarakāt tile.** There the question is the vowel ("which is the passive?"), so tapping the right vowelled form is the whole point.
- **Spelling that does count:** hamza seats (أ إ ؤ ئ ء), tāʾ marbūṭa (ة, not ه), alif maqṣūra (ى, not ي), and the article ال. The first time a learner slips on one of these, it is a near miss with a note. After that it is wrong. Common keyboard habits are normalised: ي/ى at the end of a word only as a near miss, and Persian ک/ی mapped to Arabic.
- **Keyboard.** The iPhone Arabic keyboard has to be added once. The app shows a one-screen guide the first time a typed round starts. Stage 0 needs no keyboard at all, because the learner builds words from letter tiles.

### Transliteration

There is a transliteration line for stage 0 and A1 only. It is a simple scheme (ʿ ḥ ṣ ṭ etc., with 3 7 5 as typed aliases) under each new word, hidden after the word's second sighting. It is never accepted as an answer outside stage 0, so it does not become a crutch.

## 3. Stage 0: Ḥurūf (the script course)

The script course has about 12 short lessons, each a card and then rounds. All of them tap first and type later, and frequent letters come first, not alphabetical order.

1. ا ب ت ث ن ي and the idea of dots, with long ā and ī.
2. Joining: the four positions, and the six letters that do not join.
3. ج ح خ, د ذ, ر ز, and و with long ū.
4. س ش ص ض ط ظ (the emphatics, with a written guide to sound).
5. ع غ ف ق ك ل م ه.
6. The short vowels ـَ ـِ ـُ, sukūn ـْ and shadda ـّ.
7. tāʾ marbūṭa ة and alif maqṣūra ى.
8. Hamza and its seats (rules shown as a seat chart).
9. The article ال, and sun and moon letters (الشمس against القمر).
10. Tanwīn ـً ـٍ ـٌ and the alif of ـًا.
11. لا, the ligature, and common shapes that fool people (ـهـ, كـ, final ي without dots in Egypt).
12. Reading real words: the top 100 words, with vowels that fade.

Round types:
- **Which letter** (shape to name).
- **Find it** (the same letter in four positions).
- **Build** (tap letter tiles to spell a word you read in transliteration).
- **Read** (vowelled word to transliteration, tap).
- **Dots** (which one is this: ب ت ث ن ي).

The exit test is about 40 items, in the style of the Líofa placement. Passing it opens the arcade. Anyone who can already read skips straight to the test.

## 4. The grammar: what Arabic adds and what it drops

**Dropped from Spanish and Irish.** Mutations, gender articles (el/la), ser/estar, the many tenses, and the subjunctive as a tense group.

**Kept, renamed.**
- Verbs: past (al-māḍī) and present (al-muḍāriʿ), plus the future with sa / sawfa, the imperative, and lam / lan / lā for negation.
- Words, phrases, cards and the weekly check.

**New, and the reason Arabic needs its own tiles:**

| Topic | What the beginner trips on | Tile or card |
|---|---|---|
| Persons | 13 of them: you m/f, dual, they m/f plural, you plural m/f | inside Afʿāl (verbs); dual from A2 |
| Root and pattern | ك ت ب gives كتب كاتب مكتوب مكتب مكتبة كتاب | **Jidhr** tile (root tile) |
| Verb Forms I to X | darasa / darrasa / tadārasa; the forms change meaning in regular ways | cards, I to X in stages; in Afʿāl from A2 |
| Weak verbs | hollow (qāla), defective (mashā), assimilated (waṣala), doubled (radda), hamzated | in Afʿāl; this is where conjugation is hard |
| Broken plurals | كتاب → كُتُب, ولد → أولاد, بيت → بيوت (learnt word by word) | **Jumūʿ** tile (plurals tile) |
| Gender agreement | adjectives, verbs, and the rule that non-human plurals take feminine singular | inside Kalimāt and a card |
| No "is" in the present | البيت كبير "the house is big"; kāna in the past | card plus Jumla items |
| Iḍāfa | بابُ البيت "the door of the house", the first noun without ال | **Jumla** tile (sentence tile) |
| Attached pronouns | ـي ـك ـه ـها ـنا ـكم ـهم on nouns, verbs and prepositions | **Ḍamāʾir** tile (pronouns tile, the Forainm of Arabic) |
| Moods after particles | an / lan + subjunctive, lam + jussive (lam yaktub) | in Afʿāl as negation items, B1 |
| Numbers | 3 to 10 take the opposite gender; the counted noun is in the plural, from 11 up in the singular | card and B1 items |

**Board.** A big Ilʿab (play) tile. A row of Afʿāl (verbs), Kalimāt (words), ʿIbārāt (phrases). A grammar row of Ḥarakāt, Jidhr, Jumūʿ, Ḍamāʾir. Ḥurūf stays on the board after stage 0 as a script review.

## 5. Data sources (checked so far)

- **Conjugation:** Qutrub (Taha Zerrouki, Python, GPL) conjugates any vowelled verb in every tense, person and voice. We would run it at build time and keep only its output, as we did with BuNaMo. Arramooz (same author) has a vowelled verb list with Qutrub's data. The licence of the data files still needs checking (COPYING) before use.
- **Lexicon:** ArabLEX is a large vowelled MSA lexicon. CAMeL Lab has MSA frequency lists, but the licence is listed as "other" and must be read. The Parkinson Frequency Dictionary is commercial, so it is out.
- **Vowelling check:** run every authored sentence through a diacritiser (Mishkal or a CAMeL tool) and flag any disagreement, as the Irish gate flags a disagreement with the mutation library.
- **Dialect:** if D1 picks a dialect, the open data is thin. I would write the dialect layer myself and keep it small, since it is mostly the pronouns, negation, the present prefix b-, and the 300 commonest words.

## 6. Decisions for you

- **D1. Which Arabic?**
  - **Recommended: MSA throughout.** It is what is written, the only variety with good open data, and understood everywhere.
  - **MSA plus a dialect.** Levantine or Egyptian for Frásaí (phrases) and a "how people say it" note on cards.
  - **Dialect first.** This is how people actually speak, but it fits badly in a text-only app, because dialects are rarely written and there is no standard spelling.
- **D2. Letter sounds without audio.** Your rule is no listening.
  - **Recommended: keep it.** Use written sound guides ("ع: tighten the throat as if gagging, then voice it") with transliteration and minimal pairs.
  - **One narrow exception.** Allow a recorded sound for each of the 28 letters on the letter card only. These are not rounds and are not tested. This one exception would help stage 0 more than anything else.
- **D3. Who is it for?** A complete beginner again, I assume, with the skip test for anyone who can read.
- **D4. Name.** Ṭalāqa, or something else.

## 7. Build order (once D1 to D4 are settled)

1. **Script library and tests.**
   - `ar-text.js` handles letter forms, stripping and fading vowels, hamza and tāʾ marbūṭa normalising, and the checker with its near-miss rules.
   - Unit tests ported from test-gaeilge.js.
   - RTL support in the Líofa shell: `dir="rtl"` on Arabic text only, an Arabic font (Noto Naskh Arabic, self-hosted for offline), and a larger font size for vowel marks.
2. **Stage 0.** The Ḥurūf lessons, the build-a-word round, and the exit test. This is the new code. The rest is ported.
3. **Data.**
   - Qutrub verbs (about 150, frequency first, weak verbs included).
   - The word list with fully vowelled forms, gender, and broken plural.
   - Vowel-level metadata: which ḥarakāt decide each word.
4. **Banks, one at a time through the gate.**
   - Afʿāl sentences.
   - Kalimāt, ʿIbārāt, Jumūʿ, Jidhr, Ḍamāʾir, Ḥarakāt.
   - Blind judges as for Irish, plus the diacritiser check.
5. **Cards.** Twenty or so, written by me.
6. **Playtest and push.** A phone-width playtest, then push on your word.

Bigger than Líofa. Stage 0 and the vowel fading are new work, and Arabic verb data is harder (13 persons, weak roots). I would expect two or three sessions the size of the Irish one. A native-speaker read-through matters more here than it did for Irish.

## Sources
- [Qutrub](https://github.com/linuxscout/qutrub), [Arramooz](https://github.com/karimamer/arramooz)
- [ArabLEX vs CamelMorph report](https://www.cjk.org/wp-content/uploads/ArabLEX_vs_CamelMorph_report.pdf), [CAMeL frequency lists](https://awesome.ecosyste.ms/projects/github.com%2Fcamel-lab%2Fcamel_arabic_frequency_lists)
- [Staged diacritic removal study](https://ubjh.ub.edu.sa/home/vol2/iss3/14), [Arabic diacritics and reading (Alqazlan)](https://drepo.sdl.edu.sa/items/76a3df51-840e-4923-811a-ce26928bcbf7/full), [Al-Ali & Alhawary 2020](https://zendy.io/title/10.1111/modl.12642), [diacritics and skilled reading](https://arxiv.org/html/2401.08919v2)
