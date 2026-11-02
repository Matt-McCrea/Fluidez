// The card builders look sentences up in indexes instead of scanning the whole bank once per card
// (audit P11: corpusAlternatives, otherEnglish and otherSpanish cost 40 to 140 ms a card on the full
// bank, and dialogue-cards held the worker for over a minute). An index must change nothing about
// which card comes out, so it is checked three ways: against plain scans of the bank (the pools
// cut out with filter, then the same neighbours picked from them), on a bank that grows the way
// Bundle.extend grows it, and as whole cards against a sample written down
// (__snapshots__/bank-index-cards.txt, written again when the wrong options of a card changed:
// near neighbours, with the same names in every option, instead of sentences drawn at random).
import { beforeAll, describe, expect, test } from 'vitest';
import type { PracticeItem, PracticeOp, ReviewItem } from '../../src/compiler';
import { BankSentence } from '../../src/content/schema';
import { normEnglish } from '../../src/check/translate/english';
import { corpusAlternatives } from '../../src/exercises';
import { namesOf } from '../../src/exercises/licence';
import { nearest } from '../../src/exercises/neighbours';
import { fixtureContent } from '../../src/ui/fixtures';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { otherEnglish, otherSpanish, practiceCard, reviewCard, type Card } from '../../src/ui/session/cards';
import { fixtureBundle } from './driver';

// ---------------------------------------------------------------- the scans

const scanAlternatives = (bank: readonly BankSentence[], s: BankSentence): string[] => {
  const k = normEnglish(s.en);
  return bank.filter((b) => b.id !== s.id && !/\n/.test(b.es) && (normEnglish(b.en) === k || b.acceptEn.some((e) => normEnglish(e) === k))).map((b) => b.es);
};

/** The nearest other sentences (exercises/neighbours.ts), from pools cut out of the whole bank by plain filters, not by the index. */
function scanNear(bank: readonly BankSentence[], s: BankSentence, side: 'en' | 'es', key: string, n: number): string[] {
  const o = { side, n, key: `${key}:${side}`, names: namesOf(bank), pair: (r: BankSentence) => r };
  const own = s.unit ? nearest(s, bank.filter((r) => r.unit === s.unit), o) : [];
  return (own.length >= n ? own : nearest(s, bank, o)).map((r) => r[side]);
}

// ---------------------------------------------------------------- a bank built to collide

const SUBJECT = ['I', 'You', 'We', 'She'];
const VERB = ['eat', 'see', 'need', 'call', 'know', 'buy', 'read'];
const THING = ['fish', 'the book', 'the key', 'her', "what's new", 'bread', 'the news', 'a car', 'tea', 'it'];

/** n rows over seven units (u07 has two rows, a sixth of the rest have none); English repeats every 90 rows, Spanish
 *  repeats up to case, accents and punctuation, some rows answer another row's English through
 *  acceptEn, and some are two-turn dialogues. */
function collidingBank(n: number, from = 0): BankSentence[] {
  return Array.from({ length: n }, (_, j) => {
    const i = from + j;
    const e = i % 90;
    const unit = i < 3 ? 'u07' : `u0${i % 6}`;
    const es = `${['Él', 'El', 'él', 'Ella'][i % 4]} ${['sabía', 'sabia', 'vivía'][i % 3]} ${i % 40}${i % 2 ? '.' : ''}`;
    const en = `${SUBJECT[e % 4]} ${VERB[e % 7]} ${THING[e % 10]}${e % 5 ? '.' : ''}`;
    return BankSentence.parse({
      id: `${unit}-${i}`, es: i % 13 === 0 ? `${es}\n${es}` : es, en: i % 13 === 0 ? `${en}\n${en}` : en, unit,
      acceptEn: i % 11 === 0 ? [`${SUBJECT[(e + 1) % 4]} ${VERB[(e + 1) % 7]} ${THING[(e + 1) % 10]}.`, "I'm tired"] : [],
      ...(i % 17 === 0 ? { unit: undefined } : {}),
    });
  });
}

const KEYS = ['review:a', 'pr:u03-9:g:x:pick'];

/** Every function against its scan, for every third row of the bank as the question and a few keys, sizes and units. */
function expectSameAsScans(bank: readonly BankSentence[]) {
  for (const s of bank.filter((_, i) => i % 3 === 0)) {
    expect(corpusAlternatives(bank, s), s.id).toEqual(scanAlternatives(bank, s));
    for (const key of KEYS) {
      for (const n of [2, 3]) {
        const bundle = { bank } as unknown as Bundle;
        expect(otherEnglish(bundle, s, key, n), `${s.id} ${key} en`).toEqual(scanNear(bank, s, 'en', key, n));
        expect(otherSpanish(bundle, s, key, n), `${s.id} ${key} es`).toEqual(scanNear(bank, s, 'es', key, n));
      }
    }
  }
}

describe('the indexes give what the scans gave', () => {
  test('a bank with the same English, the same Spanish, accept lists, dialogues and tiny units', () => {
    const bank = collidingBank(300);
    expect(bank.filter((s) => scanAlternatives(bank, s).length > 0).length, 'the bank has alternatives to find').toBeGreaterThan(100);
    expect(bank.some((s) => !s.unit) && bank.some((s) => s.unit === 'u07'), 'unitless and tiny-unit rows').toBe(true);
    expectSameAsScans(bank);
  });

  test('a bank that grows, and one cut back and refilled under the same array', () => {
    const bank = collidingBank(120);
    expectSameAsScans(bank);
    bank.push(...collidingBank(90, 120));                       // Bundle.extend pushes onto the same array
    expectSameAsScans(bank);
    bank.length = 60;                                           // never happens in the app, but must not go stale
    expectSameAsScans(bank);
    bank.length = 40;
    bank.push(...collidingBank(250, 600));                      // longer than the index has read, with other rows in its place
    expectSameAsScans(bank);
  });

  test('another array of the same rows is its own bank', () => {
    const bank = collidingBank(100);
    const copy = bank.slice().reverse();
    expectSameAsScans(bank);
    expectSameAsScans(copy);
    expect(corpusAlternatives(copy, bank[3])).toEqual(scanAlternatives(copy, bank[3]));
  });
});

// ---------------------------------------------------------------- whole cards, from a bank written down

const OPS: PracticeOp[] = ['pick', 'choose', 'type', 'transform', 'translate', 'respond', 'gap', 'comprehend'];

const review = (s: BankSentence, direction: 'receptive' | 'productive'): ReviewItem => ({
  op: 'review', id: `rv:${s.id}`, node: s.targets[0] ?? 'x', direction, sentence: s.id, novel: false, scoring: 'review', credit: [s.targets[0] ?? 'x'],
});
const practice = (s: BankSentence, op: PracticeOp): PracticeItem => ({
  op, id: `pr:${s.id}:${op}`, node: s.targets[0] ?? 'x', sentence: s.id, direction: 'productive', scoring: 'learning', credit: [s.targets[0] ?? 'x'],
});

/** The fixture unit, then copies of it in u02 that keep half the English with other Spanish, answer
 *  some English through acceptEn, and drop one into a unit of two rows and one into no unit. */
function widerFixtureBundle(): Bundle {
  const b = fixtureBundle();
  const base = fixtureContent().source.sentences;
  const copies = base.map((s, i) => BankSentence.parse({
    ...s, id: `u02-${i}`, unit: i === 3 || i === 4 ? 'u03' : i === 5 ? undefined : 'u02',
    es: i % 2 ? s.es : s.es.replace(/^(\S)/, (c) => c.toLowerCase()),
    en: i % 5 === 0 ? `${s.en} (again)` : s.en,
    acceptEn: i % 5 === 0 ? [s.en] : s.acceptEn,
  }));
  b.extend({ sentences: copies, chapters: [], scenes: [], writing: [], scripts: [] });
  return b;
}

describe('cards on a fixture bank, against the sample written before the indexes', () => {
  test('every op and review look for a spread of rows', async () => {
    const b = widerFixtureBundle();
    const byEnglish = new Map<string, BankSentence[]>();
    for (const s of b.bank) byEnglish.set(normEnglish(s.en), [...(byEnglish.get(normEnglish(s.en)) ?? []), s]);
    const show = (what: string, s: BankSentence, c: Card) => {
      const sibs = (byEnglish.get(normEnglish(s.en)) ?? []).filter((x) => x.id !== s.id);
      const body = c.type === 'mcq' ? [c.options.map((o) => o.text), c.answer, c.after?.text]
        : c.type === 'type' ? [c.check('\u0000').answer, sibs.filter((x) => c.check(x.es).pass).map((x) => x.id)]
        : [c.es, c.en];
      return JSON.stringify([s.id, what, c.type, c.ask, c.prompt?.text, c.sub?.text, c.why, ...body]);
    };
    const rows = b.bank.filter((_, i) => i % 3 === 0 || i === 3 || i === 4 || i === 5 || i === 65 + 3 || i === 65 + 5);
    const lines: string[] = [];
    for (const s of rows) {
      for (const op of OPS) lines.push(show(op, s, practiceCard(practice(s, op), b, 1)));
      for (const session of [0, 1, 2]) lines.push(show(`receptive ${session}`, s, reviewCard(review(s, 'receptive'), b, 'meaning', session)));
      lines.push(show('pickSpanish', s, reviewCard(review(s, 'receptive'), b, 'pickSpanish')));
      lines.push(show('productive', s, reviewCard(review(s, 'productive'), b)));
    }
    await expect(lines.join('\n') + '\n').toMatchFileSnapshot('./__snapshots__/bank-index-cards.txt');
  });
});

// ---------------------------------------------------------------- the real bank

describe('on the real bank', () => {
  let b: Bundle;
  beforeAll(async () => { b = await new ContentLoader().load(); }, 120_000);

  test('a spread of rows, dialogues and rows with other English to find', () => {
    const rows = b.bank.filter((_, i) => i % 6000 === 0);
    rows.push(...b.bank.filter((s) => /\n/.test(s.es)).filter((_, i) => i % 2500 === 0));
    const seen = new Map<string, number>();
    for (const s of b.bank.slice(0, 20_000)) seen.set(normEnglish(s.en), (seen.get(normEnglish(s.en)) ?? 0) + 1);
    rows.push(...b.bank.slice(0, 20_000).filter((s) => (seen.get(normEnglish(s.en)) ?? 0) > 1).filter((_, i) => i % 200 === 0).slice(0, 4));
    expect(rows.length).toBeGreaterThan(15);
    for (const s of rows) {
      expect(corpusAlternatives(b.bank, s), s.id).toEqual(scanAlternatives(b.bank, s));
      expect(otherEnglish(b, s, `pr:${s.id}`, 2), s.id).toEqual(scanNear(b.bank, s, 'en', `pr:${s.id}`, 2));
      expect(otherSpanish(b, s, `pr:${s.id}`, 3), s.id).toEqual(scanNear(b.bank, s, 'es', `pr:${s.id}`, 3));
    }
    expect(rows.some((s) => scanAlternatives(b.bank, s).length > 0), 'some of the rows have other Spanish for the same English').toBe(true);
  }, 120_000);
});
