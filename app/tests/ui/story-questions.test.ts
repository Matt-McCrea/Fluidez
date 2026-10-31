// Story questions: the right answer must not sit on the first option every time.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { questionCard } from '../../src/ui/session/cards';

const dir = path.resolve(__dirname, '../../content/story');
const chapters = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as {
    id: string;
    questions: Array<{ q: string; options?: string[]; answer: number | string }>;
    rereadQuestions?: Array<{ q: string; options?: string[]; answer: number | string }>;
  });

describe('questionCard', () => {
  const q = { q: 'Where?', options: ['The café', 'The park', 'The market', 'The bank'], answer: 0 };
  it('the same key gives the same order', () => {
    const a = questionCard('read:ch001:0', q);
    const b = questionCard('read:ch001:0', q);
    expect(a.type === 'mcq' && b.type === 'mcq' && a.options.map((o) => o.text)).toEqual(b.type === 'mcq' ? b.options.map((o) => o.text) : []);
  });
  it('the answer index points at the right text', () => {
    for (let i = 0; i < 20; i++) {
      const c = questionCard(`read:chX:${i}`, q);
      if (c.type !== 'mcq') throw new Error('mcq expected');
      expect(c.options[c.answer].text).toBe('The café');
      expect(c.options.map((o) => o.text).sort()).toEqual([...q.options].sort());
    }
  });
  it("a trailing I don't know stays last", () => {
    const withDk = { q: 'Who?', options: ['Vale', 'Tomás', 'Rosa', "I don't know"], answer: 1 };
    for (let i = 0; i < 20; i++) {
      const c = questionCard(`read:chY:${i}`, withDk);
      if (c.type !== 'mcq') throw new Error('mcq expected');
      expect(c.options[3].text).toBe("I don't know");
      expect(c.options[c.answer].text).toBe('Tomás');
    }
  });
  it('over every real chapter, the right answer is on the first option less than half the time', () => {
    let total = 0, first = 0;
    for (const ch of chapters) {
      [...ch.questions, ...(ch.rereadQuestions ?? [])].forEach((x, i) => {
        if (!x.options?.length || typeof x.answer !== 'number') return;
        const c = questionCard(`read:${ch.id}:${i}`, x as { q: string; options: string[]; answer: number });
        if (c.type !== 'mcq') return;
        expect(c.options[c.answer].text).toBe(x.options[x.answer]);
        total++;
        if (c.answer === 0) first++;
      });
    }
    expect(total).toBeGreaterThan(100);
    expect(first / total).toBeLessThan(0.5);
  });
});
