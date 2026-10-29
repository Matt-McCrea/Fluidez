// Every card the session builds from a real bank sentence: a production card
// (typed Spanish) never expects a whole multi-turn dialogue in one answer.
// A dialogue row shows the earlier turn(s) as Spanish context and asks for
// one turn; recognition cards may show the whole exchange.
import { beforeAll, describe, expect, test } from 'vitest';
import type { PracticeItem, PracticeOp, ReviewItem } from '../../src/compiler';
import type { BankSentence } from '../../src/content/schema';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { practiceCard, reviewCard, type Card } from '../../src/ui/session/cards';

let b: Bundle;
let dialogues: BankSentence[];
beforeAll(async () => {
  b = await new ContentLoader().load();
  dialogues = b.bank.filter((s) => /\n/.test(s.es));
}, 120_000);

const OPS: PracticeOp[] = ['pick', 'choose', 'type', 'transform', 'translate', 'respond', 'gap', 'comprehend', 'read'];
const NL = /\n|\\n/;

const review = (s: BankSentence, node: string): ReviewItem => ({
  op: 'review', id: `rv:${s.id}:${node}`, node, direction: 'productive', sentence: s.id, novel: false, scoring: 'review', credit: [node],
});
const practice = (s: BankSentence, node: string, op: PracticeOp): PracticeItem => ({
  op, id: `pr:${s.id}:${node}:${op}`, node, sentence: s.id, direction: 'productive', scoring: 'learning', credit: [node],
});

/** What a typed Spanish card expects, shown as the right version. */
const expected = (c: Card) => (c.type === 'type' && c.answerLang === 'es' ? c.check('\u0000').answer : null);

describe('dialogue rows as production cards', () => {
  test('the bank has dialogue rows to check', () => expect(dialogues.length).toBeGreaterThan(100));

  test('no warm-up review card expects a multi-turn answer', () => {
    for (const s of dialogues) {
      for (const node of s.targets.length ? s.targets : ['x']) {
        const c = reviewCard(review(s, node), b);
        const ans = expected(c);
        if (ans !== null) expect(ans, `${s.id} ${node}`).not.toMatch(NL);
      }
    }
  });

  test('no practice card of any op expects a multi-turn answer', () => {
    // a sample: a translate card scans the whole bank for same-English alternatives
    for (const s of dialogues.filter((_, i) => i % 40 === 0)) {
      const node = s.targets[0] ?? 'x';
      for (const op of OPS) {
        const ans = expected(practiceCard(practice(s, node, op), b, 1));
        if (ans !== null && op !== 'respond') expect(ans, `${s.id} ${op}`).not.toMatch(NL);
      }
    }
  }, 120_000);

  test('the reported card: the question is context, the reply is asked and checked', () => {
    const s = b.sentence('u02-0511')!;
    const c = reviewCard(review(s, 'g:present-ar'), b);
    expect(c.type).toBe('type');
    if (c.type !== 'type') return;
    expect(c.prompt).toEqual({ text: '¿Simón habla inglés?', lang: 'es' });
    expect(c.sub?.text).toMatch(/I don't know\./);
    expect(c.sub?.text).not.toMatch(/Simón/);
    expect(c.check('No sé.').pass).toBe(true);
    expect(c.check('no se').near || c.check('no se').pass).toBe(true);
    expect(c.check('¿Simón habla inglés? No sé.').pass).toBe(false);
    expect(c.check('Sí.').answer).toBe('No sé.');
  });

  test('recognition still shows the whole exchange', () => {
    const s = b.sentence('u02-0511')!;
    const c = reviewCard({ ...review(s, 'c:no-se'), direction: 'receptive' }, b);
    expect(c.type).toBe('mcq');
    if (c.type === 'mcq') expect(c.prompt?.text).toBe(s.es);
  });
});
