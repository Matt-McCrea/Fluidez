# Story chapters: writer prompt

Fill in the inputs, then hand everything below the line to the writer.

**Inputs**
- `UNITS`: the unit ids, e.g. `u04 u05`
- `CHAPTERS`: the chapter ids, e.g. `ch007 ch008 ch009 ch010` (each must be the `chapter` of some day in those units)
- `APP`: `/Users/Matthew/Fluidez/app`

---

You are writing chapters `{CHAPTERS}` of the Fluidez story for units `{UNITS}`. Each chapter is one file, `{APP}/content/story/<id>.json`, and must parse as `StoryChapter` in `{APP}/src/content/schema.ts`. Write only those files. Do not edit the gate, the graph, the units or any other content. Do not commit.

## 1. Read first, in full

1. `tools/burn/brief.md`. These rules are binding.
2. `docs/unit-map.md`: the cast, the stakes and the story beat for every unit. Also look at the next two units, so you know where this week is heading.
3. `content/units/<unit>.json` for each unit: its `storyArc`, and for each day its `chapter`, `focus`, `chunks` and `lexemes`.
4. **Every earlier chapter** in `content/story/`, in order. Note the running jokes, what each character knows, the last hook (your first chapter has to pay it off) and the openings already used. Never reuse an opening or a plot device.
5. The graph nodes those days reference, in `content/graph/{grammar,patterns,chunks}.json`. Read their `es` examples.
6. `content/graph/lexemes.json`, for the vocabulary (see §2).

## 2. Work out what the reader knows on the chapter's day

**Session.** The days of all earlier units are counted, then this day's index (0-based) plus 1. For example, u01 has 10 days and u02 has 9, so u03 day 0 is session 20 and u03 day 4 is session 24. The gate works this out too (`chapterAt`), and that number is the one that counts.

The reader knows:
- **Grammar and patterns**: every `focus` node on any day up to this session. If a node is scheduled in no unit, it is known from its graph `priority`.
- **Chunks**: every chunk up to this session, but **only as whole phrases**. If a sentence uses a chunk's words in a different way, the chunk does not cover them.
- **Words**: every lexeme whose unit day, or else `priority`, is ≤ the session. Function words (articles, pronouns, prepositions, *no*, *sí*, *y*, *pero*, *muy*, *mucho*, *gracias*…) all have priority 1. The grammar can still make them illegal, though. See the traps below.

List the known nouns, verbs and adjectives before you write anything. Early on the list is tiny: at session 11 the reader does not know *hoy*, *casa*, *mañana*, *hora*, *abrir*, *mesa* or *carta*. Write the story with the words you have; don't write it first and translate it afterwards.

**What the gate actually enforces**
- **legality**: every grammar node, pattern and graph lexeme the tagger finds in the text or in a gloss must be taught by this session, unless it falls inside a chunk that is already taught. **An unknown word that is in the graph cannot be glossed past this check.** Its gloss entry fails legality as well.
- **reading**: at most 2% of words unknown and unglossed, and at most 5% unknown in all. Names (tagged propn) and numerals are not counted as words. Words inside chunks still count: *Me llamo* is read as `l:llamarse` (session 72), *¿has estado?* as `l:estar`, *me gusta* as `l:gustar`.
- So **you can only gloss words that are not in the graph** (*loro*, *pacto*, *tango*, *hostel*), or phrases that are legal anyway. A gloss is also a good way to give the meaning of a whole known-word phrase: `{"es": "Soy nieto de Rosa", "en": "I'm Rosa's grandson"}`.
- **dupe**: a sentence, including its `Name:` label, that exactly matches any sentence in the corpus is an error, and that includes the bank. Running catchphrases have to vary: *¡De una!* → *Hernando y Simón: ¡De una!*
- **accent**: every `?` and `!` needs its `¿` and `¡`, **English lines too**. English lines must not contain questions or exclamations.

**Known tagger traps (as of u01–u03)**
- At the start of a sentence, or straight after a `Name:` label, *Don* is read as `l:don`, *La* as an article and *Nombre* as a command. Put *Don Hernando* and *La Esquina de Rosa* mid-sentence.
- A one-word *¿Nombre?* or *¿Apellido?* is read as a verb. Use them in a full clause: *Tomás es nombre. Herrera es apellido.*
- *nada* can be read as *nadar*, *apuesta* as *apostar* and *silencio* as *silenciar*. Choose another word.
- Articles are illegal before session 6. So are possessives (*mi*, *su*) before 44, *muy* and *mucho* as quantifiers before 63, demonstratives (*este*, *esa*, *esto*) before 59, feminine adjective agreement (*contenta*, *colombiana*) before 40, question words outside chunks before 16, *por*/*para* before 164, *si* clauses before 154 and infinitive complements (*quiero comprar*) before 72.
- *¡Vamos!*, *vamos a + verb* and *hay que / tengo que + verb* may not match their chunks. Check them before you use them.
- English words the tagger treats as Spanish lexemes, such as *we*, *to*, *and*, *is* and *okay*, count as unknown words.

## 3. Shape and quality bar

- **Length**: A1 80–150 words, A2 150–250, B1 300–500, B2 500–700, C1 700–1,000. The first two chapters of the course are the exception: 40–90 words, mostly the chunks just met.
- **Input days**: every new word of an Input day appears at least twice. Where a word cannot appear legally (for example *empezar* before stem-changing verbs are taught), drop it and say so in your report.
- **Dialogue first at A1**, written as `Name: line`. Use present-tense narration only once the present is taught. At A1–A2, keep short lines of English (Vale treating Tomás as a tourist, a word he blurts out) for comedy or plot, never to carry the Spanish.
- **Every chapter has**:
  - a turn: something changes
  - a laugh, often Simón repeating a chunk at the worst moment
  - a small human moment
  - a thread back to the stakes (Altamira, the sale, the bet, Rosa's letter)
- **Pay off the previous hook in the first lines**, and end on a line that makes tomorrow matter.
- Follow the `storyArc`. When the vocabulary blocks a beat (*ajedrez* is at session 574, *buñuelo* at 92, *millón* at 148), adapt the beat and keep its spirit: a football match instead of the chess table, $2.000.000 written as a numeral, *trescientos sesenta y cinco días* for "a year". Write the deviation down in your report.
- Spanish must be neutral LatAm with Colombian colour in the dialogue (*tinto*, *¡qué pena con usted!*, *¿aló?*, *¡de una!*, *¿cuál empresa?*). No vosotros. The past follows LatAm usage.
- **questions**: 3–5 in all. Most are English multiple choice about meaning, motive or what happens next. Include one or two simple Spanish ones whose options are in Spanish. Each `answer` is an option index, and every option must be grammatical (*Muy contenta* for Vale, not *Contento*).
- **rereadQuestions**: 2–3, different from `questions`, and aimed at details a second read catches.
- **gloss**: one entry for every non-graph word in the text, plus phrase glosses where a known-word sentence carries a meaning the learner might miss.
- **hook**: one or two English sentences that set up the next chapter.
- Leave `requires` and `lexemes` out. The gate's `--fix` currently writes them only for bank files.

## 4. Procedure

1. Plan each chapter in one line: the opening (new), the turn, the joke, the stakes, the hook.
2. Draft the text with the known-word list open beside you.
3. Probe every draft with the coverage script (§5). Rewrite every `GRAM` line and every unknown `l:` that is in the graph. Gloss or remove words not in the graph (`@?`).
4. Write the JSON files. Then run the gate loop:
   ```
   cd {APP} && npm run gate -- --fix content/story/<your files>
   ```
   Fix every ERROR by rewriting the sentence. Never delete a check, a question or a sentence's meaning just to pass. Repeat until you get `gate: PASS — 0 error(s)`.
5. Run `npm run gate -- --strict content/story/<your files>` too. Low-confidence `tagger` errors from deliberate English lines or non-graph words such as *hostel* and *software* are acceptable. Fix anything else.
6. Reread each chapter aloud as the learner would. Is it funny? Does it follow on from the last one? Would you come back tomorrow?

## 5. Coverage probe (save it in your scratchpad as `cov.ts`)

```ts
// npx tsx cov.ts <session> "<text>"   |   npx tsx cov.ts content/story/chNNN.json
import { readFileSync } from 'node:fs';
import { tagSentence, splitSentences, lemmatize } from '/Users/Matthew/Fluidez/app/src/engine/tagger';
import { loadCurriculum } from '/Users/Matthew/Fluidez/app/tools/gate/load';
const cur = loadCurriculum('/Users/Matthew/Fluidez/app');
let at: number, text: string, gloss: string[] = [];
if (process.argv[2].endsWith('.json')) {
  const c = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  at = cur.chapterAt.get(c.id)!; text = c.text; gloss = c.gloss.map((g: any) => g.es.toLowerCase());
} else { at = Number(process.argv[2]); text = process.argv[3]; }
const glossed = new Set<string>();
for (const g of gloss) for (const w of g.split(/[^a-záéíóúñü]+/).filter(Boolean)) { glossed.add(w); const l = lemmatize(w); if (l) glossed.add(l.lemma); }
let words = 0, unk = 0, unG = 0;
for (const s of splitSentences(text)) {
  const r = tagSentence(s, cur.tagOpts);
  words += r.tokens.filter((w) => !w.punct && w.pos !== 'propn' && w.pos !== 'num').length;
  const spans = r.features.filter((x) => (x.key.startsWith('chunk.') || x.key.startsWith('pattern.')) && (cur.taughtAt.get(x.node!) ?? 1e9) <= at).map((x) => x.span);
  const inChunk = (sp: [number, number]) => spans.some(([a, b]) => sp[0] >= a && sp[1] <= b);
  const out: string[] = [];
  for (const ft of r.features) {
    if (ft.node?.startsWith('l:')) {
      const t = cur.taughtAt.get(ft.node);
      if (t !== undefined && t <= at) continue;
      unk++; const g = glossed.has(ft.node.slice(2)) || glossed.has(ft.text.toLowerCase()); if (!g) unG++;
      out.push(`${ft.text}=${ft.node}@${t ?? '?'}${g ? '(gl)' : ''}`);
    } else if (ft.node && !ft.key.startsWith('chunk.')) {
      const t = cur.taughtAt.get(ft.node);
      if ((t === undefined || t > at) && !inChunk(ft.span) && cur.graphIds.has(ft.node)) out.push(`GRAM ${ft.node}@${t ?? '?'} "${ft.text}"`);
    }
  }
  console.log(s, out.length ? '\n    ' + out.join('  ') : '');
}
console.log(`session ${at}: words ${words}, unknown ${unk} (${(100 * unk / words).toFixed(1)}%), unglossed ${unG} (${(100 * unG / words).toFixed(1)}%)`);
```

How to read its output:
- `GRAM g:x@N` is a legality error. Rewrite the sentence.
- `word=l:x@N`, where N is greater than the session, is a legality error too, because the lexeme is in the graph. Replace the word.
- `word=l:x@?` means the word is not in the graph. It counts toward reading coverage, so gloss it or cut it.
- Paste a whole batch of candidate sentences at once to learn what a session allows before you draft.

## 6. Report

For each chapter, report:
- the session and the word count (gate-counted and raw)
- unknown % and unglossed %
- the final gate line
- every place the arc was bent, or an Input word was skipped, because of vocabulary or grammar timing

End with a one-paragraph synopsis of the chapters.

## Rules added after the first playtest (binding; the gate enforces the first two)
- **No dashes.** No em dash (—), en dash (–) or spaced hyphen ( - ) in any learner-facing string, Spanish or English. The gate check `dashes` fails them. Dialogue turns are separate lines: `"¿Ya comiste?\nTodavía no."`, or `Vale: ¿Ya comiste?`. English prose uses commas, colons, brackets or full stops.
- **One exact pair.** Every English string is the exact translation of the Spanish beside it: same person, number, tense and formality. Never pack variants with " / ". A two-turn Spanish string has a two-line English string.
- **Graph nodes carry `forms`.** When you want a node's example lines, read its `forms` (aligned `{es, en}` pairs), not `es` split by hand. The chunk tagger matches every form, so a chunk's wording in `forms` is what it recognises.
- **Chunks gate as wholes.** A sentence inside a taught chunk requires the chunk, not the grammar it seeds; the chunk's `unpacks` node stays in `requires` and a taught chunk stands in for it. Write early content with the chunks the day has taught.
