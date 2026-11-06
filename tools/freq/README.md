# tools/freq: Spanish word frequencies

`es_50k.txt` is "form count" per line, 50,000 Spanish word forms ranked by how often they
occur in the OpenSubtitles 2018 corpus (film and TV subtitles, so spoken, everyday Spanish).

- Source: https://github.com/hermitdave/FrequencyWords (`content/2018/es/es_50k.txt`)
- Licence: the content is CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/);
  the repository's code is MIT. Only the content is used here, as data.
- Attribution: "FrequencyWords by Herman Kiefus (hermitdave), derived from OpenSubtitles 2018".
- Share-alike: the ranking derived from it (`data/word-rank.js`) is shared under the same
  licence, CC BY-SA 4.0. The arcade's level screen carries the credit line.

Other files here:

- `overrides.json`  homographs the ranking would otherwise get wrong (see below).
- `exclude.json`    names, profanity, interjections and foreign words kept out of the
  ranking and out of the "missing common words" report.

`overrides.json` is keyed by the entry's Spanish exactly as it appears in the list
(for example `"el sobre"`): `{ "rank": "demote" | <number>, "note": "why" }`.
`demote` keeps the entry but counts only 5% of the form's frequency (the other 95% is
taken to be the function word); a number moves the entry to that position in its list.

Regenerate with `node tools/build-frequency.js`; `--check` exits 1 when the output is stale.
