// R15 over the real bank: every accented word of every row, typed without its
// accent. A forgiven slip must not be a word the course uses in its own right
// (hacia for hacía, seria for sería, jugo for jugó), and a word the checker calls
// spelling must not be refused because the matcher lost the sentence's shape
// (tambien, todavia, queria). A new row that brings a new pair fails here: add it
// to DIACRITIC in src/check/translate/accents.ts.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { matchTranslation } from '../../src/check/translate';
import { changesWord } from '../../src/check/translate/accents';
import type { BankSentence } from '../../src/content/schema';
import { deaccent } from '../../src/engine';

const BANK = join(__dirname, '../../content/bank');
const rows = readdirSync(BANK).filter((n) => /^u\d+\.json$/.test(n))
  .flatMap((f) => JSON.parse(readFileSync(join(BANK, f), 'utf8')) as BankSentence[])
  .filter((r) => !r.es.includes('\n'));
const wordsOf = (s: string) => s.match(/\p{L}+/gu) ?? [];
const used = new Set(rows.flatMap((r) => wordsOf(r.es).map((w) => w.toLowerCase())));

/** The tilde marks the question and the sentence means what it meant; guion is the RAE's own spelling of guión; Tomas, rio and the rest are in NOT_THE_VERB. */
const SPELLING = new Set(['qué', 'cuándo', 'cuánto', 'cuánta', 'cuántos', 'cuántas', 'cómo', 'quién', 'quiénes', 'dónde', 'adónde', 'cuál', 'cuáles', 'porqué', 'guión', 'río', 'tomás']);

describe('every accent slip the bank can produce', () => {
  const forgiven = new Set<string>();
  const lost = new Set<string>();
  let tried = 0;
  for (const r of rows) {
    for (const w of new Set(wordsOf(r.es))) {
      if (!/[áéíóú]/i.test(w)) continue;
      const bare = deaccent(w.toLowerCase());
      const typed = r.es.replace(new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, 'u'), bare);
      const m = matchTranslation(typed, r, { accents: 'lenient' });
      tried++;
      const pair = `${w.toLowerCase()}>${bare}`;
      if (m.pass && m.note) forgiven.add(pair);
      else if (!m.pass && !changesWord({ typed: bare, expected: w })) lost.add(`${pair} (${r.id})`);
    }
  }

  test('there are enough of them to mean something', () => { expect(tried).toBeGreaterThan(50_000); });

  test('none that is forgiven is a word the course uses in its own right', () => {
    const bad = [...forgiven].filter((p) => { const [e, t] = p.split('>'); return used.has(t) && !SPELLING.has(e); });
    expect(bad).toEqual([]);
  });

  test('none that is only spelling is refused: the matcher reads the sentence again with the slip put right', () => {
    expect([...lost]).toEqual([]);
  });
});
