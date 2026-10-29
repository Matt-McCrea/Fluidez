// Dialogue rows (two turns on two lines) are never asked as one typed answer.
// Checked over every row of the real bank: no production item's expected
// Spanish, or anything it accepts, spans more than one turn.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { BankSentence } from '../../src/content/schema';
import {
  checkItem, chooseItem, isMultiTurn, lexGapItem, productionView, recombinations, transformItems, translationItems, turnView, typeFormItem,
} from '../../src/exercises';

const BANK = join(__dirname, '../../content/bank');
const rows: BankSentence[] = readdirSync(BANK).filter((f) => f.endsWith('.json'))
  .flatMap((f) => (JSON.parse(readFileSync(join(BANK, f), 'utf8')) as unknown[]).map((x) => BankSentence.parse(x)));
const dialogues = rows.filter(isMultiTurn);
const NL = /\n|\\n/;

describe('dialogue rows in the real bank', () => {
  test('there are some', () => expect(dialogues.length).toBeGreaterThan(100));

  test('translation: one turn asked, one turn expected, earlier turns as context', () => {
    // the corpus alternatives (other rows with the same English) over a sample: the scan is quadratic
    const single = rows.filter((r) => !isMultiTurn(r)).slice(0, 4000);
    dialogues.forEach((s, i) => {
      for (const t of translationItems(s, i % 20 === 0 ? { bank: [...single, ...dialogues] } : {})) {
        expect(t.answer, s.id).not.toMatch(NL);
        expect(t.prompt, s.id).not.toMatch(NL);
        for (const a of t.accept) expect(a, s.id).not.toMatch(NL);
        if (t.context) expect(s.es.startsWith(t.context), s.id).toBe(true);
      }
    });
  }, 60_000);

  test('ladder: choose, type and transform answers are one turn', () => {
    for (const s of dialogues) {
      const ty = typeFormItem(s);
      if (ty) { expect(ty.answer).not.toMatch(NL); expect(ty.en, s.id).not.toMatch(NL); }
      const ch = chooseItem(s);
      if (ch) { for (const o of ch.options) expect(o).not.toMatch(NL); expect(ch.en, s.id).not.toMatch(NL); }
      for (const tr of transformItems(s)) {
        expect(tr.answer, s.id).not.toMatch(NL);
        expect(tr.source, s.id).not.toMatch(NL);
        for (const a of tr.accept) expect(a, s.id).not.toMatch(NL);
      }
    }
  });

  test('recombinations: production items are one turn', () => {
    for (const s of dialogues) {
      for (const r of recombinations(s)) {
        if (r.mode !== 'production') continue;
        expect(r.es, s.id).not.toMatch(NL);
        expect(r.en ?? '', s.id).not.toMatch(NL);
        for (const a of r.accept) expect(a, s.id).not.toMatch(NL);
      }
    }
  });

  test('cued gaps: the gap is in one turn, the answer is one word', () => {
    const s = rows.find((r) => r.id === 'u02-0511')!;
    const it = lexGapItem({ id: 'l:inglés', es: 'inglés', en: 'English' }, s);
    expect(it?.answer).toBe('inglés');
    expect(it?.en).toBe('Does Simón speak English?');
  });
});

describe('the reported card: ¿Simón habla inglés? / No sé.', () => {
  const s = rows.find((r) => r.id === 'u02-0511')!;
  test('the reply is asked, the question is the context', () => {
    const v = productionView(s)!;
    expect(v.context).toBe('¿Simón habla inglés?');
    expect(v.sentence.es).toBe('No sé.');
    expect(v.sentence.en).toBe("I don't know.");
  });
  test('only the reply is checked', () => {
    const [t] = translationItems(s, { dirs: ['en-es'] });
    expect(checkItem(t, 'No sé').pass).toBe(true);
    expect(checkItem(t, '¿Simón habla inglés? No sé.').pass).toBe(false);
  });
  test('a preferred turn is asked when it holds what the card practises', () => {
    const v = productionView(s, (es) => /simón/i.test(es))!;
    expect(v.sentence.es).toBe('¿Simón habla inglés?');
    expect(v.context).toBe('');
  });
  test('turns split by a literal backslash-n line up too', () => {
    const r = BankSentence.parse({ id: 'x', es: 'Oye, Vale.\nDime, Tomás.', en: 'Hey, Vale.\\nGo ahead, Tomás.' });
    expect(turnView(r, 1)?.sentence.en).toBe('Go ahead, Tomás.');
  });
  test('a whole-exchange accept gives its own turn; a one-line accept is dropped', () => {
    const r = BankSentence.parse({ id: 'x', es: 'Hola.\nNo sé.', en: 'Hi.\nI don\'t know.', accept: ['Buenas.\nNi idea.', 'Algo'] });
    expect(turnView(r, 1)?.sentence.accept).toEqual(['Ni idea.']);
  });
});
