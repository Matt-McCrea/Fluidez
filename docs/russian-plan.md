# Svobodno (Свободно): Russian Juegos, and speaking first in Ṭalāqa too

## Decisions (defaults, change any)
- **Language:** standard Russian, as spoken in Moscow. Pitched at a complete beginner. English explanations, with the Russian one tap away. English→Russian on every card, except the reading rounds in stage 0.
- **Name:** Svobodno, Свободно ("fluently", as in говорю свободно).
- **Folder:** `russkiy/`. Storage keys start `svobodno.`, and the cache is `svobodno-<ver>` plus a separate `svobodno-audio` cache.
- **Listening:** allowed, as in Ṭalāqa. Neural voices: ru-RU Svetlana and Dmitry, clips packed into bundles.
- **No AI in the app and no speech recognition.** Speaking is practised by saying a phrase aloud, hearing the recording, and marking yourself. A phrase you mark yourself on never counts as learnt.
- **Palette:** Khokhloma, black lacquer with red and gold: `--bg #110c0b`, `--accent #d2402f`, `--gold #e3a83a`.

## Speaking first (Svobodno and Ṭalāqa)
The script no longer stands between the learner and their first conversation.

**First open.** The home is a path with two strands side by side:
- **Speak** (Говорить / تَكَلَّم): short phrase packs.
- **Letters** (Буквы / حُرُوف): the script course.

**Unlocking.**
- Each pack opens after the one before it. The Letters strand keeps its own order.
- Neither strand blocks the other.
- The full board still opens on the letters exit test, as now.

**A pack** is 6 to 8 everyday phrases plus a short dialogue that uses them. It is taught as a card (each phrase with its English, the sound and a note), then a Hadi round of these kinds:
1. **Pick:** English is shown; pick the phrase. Options appear in transliteration.
2. **Build:** English is shown; tap the words, as transliteration tiles, in order.
3. **Say it:** English is shown; say it aloud, tap to hear it, then mark yourself "Got it" or "Not yet". This is self-marked, so it never makes a phrase learnt.
4. **Reply:** hear a line of the dialogue, then pick the right reply.

**Script fade on phrases.** This works like the vowel fade on Arabic words:
- **Before the letters are done:** transliteration is the main line, with the script shown smaller above it, so the eye gets used to it.
- **After the letters exit test:** the script is the main line, with the transliteration under it.
- **Once the phrase is known in script:** script only. Holding the phrase shows the transliteration.

**Sizes.** Ṭalāqa gets about 10 packs, made from the A1 phrases in the chosen variety. The packs mostly use shāmī/maṣrī, because people speak in dialect. Svobodno gets about 10 packs.

**Data.** `data/speak.js`, shaped as `AR_SPEAK` / `RU_SPEAK`. Each pack is `{n, title:{en,xx}, phrases:[ids], dialogue:[{who, id}]}`, and every phrase points into phrases.js.

## Russian specifics
**Stage 0, Буквы:** 7 lessons and a 30-item exit test.

| Lesson | Letters | What it covers |
|---|---|---|
| 1 | А К М О Т Е | Familiar shapes and sounds; what the stress mark means. |
| 2 | В Н Р С У Х | False friends: they look Latin but sound different. |
| 3 | Б Г Д З И Л П Ф Й | New shapes. |
| 4 | Ж Ц Ч Ш Щ | The hushing sounds and ts. |
| 5 | Ы Э Ю Я Ё | Hard and soft vowel pairs. |
| 6 | Ь Ъ | Soft and hard signs, unstressed о and е, final devoicing. |
| 7 | none new | Italic and cursive shapes that differ (т д и п г). |

**Stress is Russia's missing vowels.** Russian writes no stress, and stress changes the sound. Learner text carries stress marks (U+0301). They fade per word, full then bare, as the learner shows they know the word; holding a word shows its stress. Typed answers ignore stress marks and accept е for ё.

**Transliteration is phonetic, for speaking.** It reflects stress and vowel reduction (хорошо → kharashó), его → yevó, ться → tsa, and final devoicing.

**Tiles:**
- Играть: the mix.
- Глаголы: present, past with gender, perfective future, imperative.
- Слова.
- Фразы.
- The grammar row: Падежи (cases after prepositions and verbs), Вид (aspect in context), Движение (идти/ходить, ехать/ездить and prefixes), Числа (number plus case: 2 рубля, 5 рублей, год/года/лет).

## Sources
- OpenRussian.org dictionary data (github.com/Badestrand/russian-dictionary, CC BY-SA 4.0). Its rows are in frequency order and every form carries stress. It has 2,500 lemmas and the verb tables; the declensions feed Падежи.
- It has known errors (it gives лета as the plural of год), so every form goes through a gate and blind judges.

## Order
1. Tick the phrases you know, in all apps.
2. Speaking first in Ṭalāqa: the shell work, plus the speak packs written from the existing phrases.
3. ru-text.js (stress, translit, check) and letters.js, with tests.
4. Svobodno shell, copied from Ṭalāqa: tiles on placeholder data, speak first built in.
5. Content: verbs, words, phrases and speak packs, then the gaps for Глаголы and the four grammar tiles, then cards. Each passes the gate and the blind judges.
6. Audio, playtest, push when Matthew says.
