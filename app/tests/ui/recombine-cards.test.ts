// Recombine cards: a known sentence, re-inflected. The answer is never in the prompt.
import { beforeAll, describe, expect, it } from 'vitest';
import type { PracticeItem } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { recombineCard, type Card } from '../../src/ui/session/cards';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ band: 'A1' }); }, 60_000);

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
const shown = (c: Card) => [(c as { prompt?: { text: string } }).prompt?.text, (c as { sub?: { text: string } }).sub?.text, c.ask].filter(Boolean).join(' | ');

describe('recombine cards over real u01 sentences', () => {
  it('differ from the base, never show the answer, and accept their own answer', () => {
    const sents = b.bank.filter((s) => s.id.startsWith('u01-')).slice(0, 200);
    expect(sents.length).toBeGreaterThan(50);
    let built = 0;
    for (const s of sents) {
      const item = { op: 'recombine', id: `recombine:${s.id}`, node: s.targets[0], sentence: s.id, direction: 'productive', scoring: 'exposure', credit: [] } as unknown as PracticeItem;
      const c = recombineCard(item, s, b, 1);
      if (!c) continue;
      built++;
      if (c.type === 'type') {
        const answer = c.check('').answer;
        expect(norm(answer), s.id).not.toBe(norm(s.es));
        expect(norm(shown(c)).includes(norm(answer)), `${s.id}: ${answer} in ${shown(c)}`).toBe(false);
        expect(c.check(answer).pass, `${s.id}: ${answer}`).toBe(true);
      } else if (c.type === 'mcq') {
        expect(norm(c.options[c.answer].text)).not.toBe(norm(s.es));
        expect(c.answer).toBeGreaterThanOrEqual(0);
      }
    }
    expect(built).toBeGreaterThan(30);
  }, 30_000);
});
