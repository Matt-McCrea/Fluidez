# Vocabulary sources

Everything under `tools/vocab/data/` was downloaded on 2026-10-29 by `fetch.sh`. Run `sh tools/vocab/fetch.sh` to refresh it.

| File | What it is | URL | Licence and attribution |
|---|---|---|---|
| `es_50k.txt` | The 50,000 most frequent Spanish word forms in OpenSubtitles 2018, with counts (413 M tokens) | https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/es/es_50k.txt | **CC BY-SA 4.0** (content). Hermit Dave, *FrequencyWords*, https://github.com/hermitdave/FrequencyWords, built from OpenSubtitles 2018 (P. Lison and J. Tiedemann, 2016, http://opus.nlpl.eu/OpenSubtitles2018.php). |
| `en_50k.txt` | The English list from the same project. Used only to spot English words and names in the Spanish list. | https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_50k.txt | CC BY-SA 4.0, same attribution. |
| `FrequencyWords-LICENSE.txt` | The repository's code licence (MIT). The README states CC BY-SA 4.0 for the content. | https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/LICENSE | — |
| `co_web_2015_50k.txt` | Cross-check list: the word list of the Leipzig Corpora Collection's Colombian web corpus (6.4 M tokens), lowercased and merged, top 50,000. A third column gives the share of capitalised uses, which flags names. The corpus sentences are not kept. | https://downloads.wortschatz-leipzig.de/corpora/spa-co_web_2015_300K.tar.gz | **CC BY 4.0** (Leipzig Corpora Collection terms of use). D. Goldhahn, T. Eckart and U. Quasthoff (2012), "Building Large Monolingual Dictionaries at the Leipzig Corpora Collection: From 100 to 200 Languages", *LREC 2012*. |
| `doozan-es-en.data` | A Spanish–English dictionary extracted from English Wiktionary: POS, gender, glosses and usage qualifiers such as "Spain" and "Latin America". It supplies glosses and genders where the old deck and `verbs.json` have none, and it detects Spain-only words. | https://raw.githubusercontent.com/doozan/spanish_data/master/es-en.data | **CC BY-SA** (Wiktionary content, https://en.wiktionary.org). Extracted by Jeff Doozan, https://github.com/doozan/spanish_data. |
| `doozan-frequency.csv` | Lemmatised OpenSubtitles frequency list with POS and word forms. It is used only as a fallback that maps a surface form to its lemma when the project engine and the tagger's lexicon cannot. | https://raw.githubusercontent.com/doozan/spanish_data/master/frequency.csv | CC BY-SA (derived from hermitdave/FrequencyWords). Jeff Doozan. |
| `doozan-LICENSE.txt` | The repository's licence file (CC BY 4.0). Per its README, the Wiktionary-derived data stays CC BY-SA. | https://raw.githubusercontent.com/doozan/spanish_data/master/LICENSE | — |

**ShareAlike.** Some glosses in `content/graph/lexemes.json` come from Wiktionary (CC BY-SA), and its `freqRank` values derive from CC BY-SA lists. Redistributing the lexeme file therefore carries the ShareAlike and attribution obligations above. If that matters for distribution, overwrite the Wiktionary-derived glosses (those not from the old deck, `verbs.json` or `curated/*.tsv`) with original wording.

**Project sources** (no licence question):
- `../data/vocab.js` (the old 5,820-row PCIC deck) supplies glosses, genders, PCIC themes and levels.
- `src/engine/verbs.json` supplies verb glosses.
- `curated/*.tsv` holds hand-written entries: closed-class glosses, LatAm forms with their Peninsular pairs, sense splits, gloss fixes, drops and band floors, plus the per-unit theme seeds in `units.tsv`.
