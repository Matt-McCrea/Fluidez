// New words are produced in a sentence, not from a one-word gloss; productive
// reviews rotate cloze / transform / translate; a swap inside an
// interchangeable set passes as Hard.
import { beforeAll, describe, expect, it } from 'vitest';
import type { LearnItem, ReviewItem } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { learnRetrieval, productiveFormat, reviewCard, lexemeTypeCard, sentenceCheck, type Card } from '../../src/ui/session/cards';
import { formatOf, interleave, breakRuns } from '../../src/ui/session/order';
import { gradeOf } from '../../src/ui/session/runner';
import { Rating } from '../../src/learner';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ band: 'A1' }); }, 180_000);

const learn = (node: string, example?: string): LearnItem => ({ op: 'learn', id: `ln:${node}`, node, productive: true, example } as unknown as LearnItem);

describe('word production in context', () => {
  it('lexemes with a bank sentence are asked as a gap that accepts the bare word', () => {
    const lexNodes = [...b.course.nodes.values()].filter((n) => n.kind === 'lexeme' && b.index.byTarget.get(n.id)?.length);
    let gapped = 0, tried = 0;
    for (const n of lexNodes.slice(0, 150)) {
      const c = learnRetrieval(learn(n.id, b.index.byTarget.get(n.id)![0]), b, 2);
      tried++;
      if (c.type !== 'type' || !c.prompt?.text.includes('___')) continue;
      if (c.prompt.lang !== 'es' || c.ask !== 'Fill the gap with the new word') continue;
      gapped++;
      const lex = b.lexemeLike(n.id)!;
      const bare = lex.es.replace(/^(el|la|los|las|un|una)\s+/i, '');
      const shown = c.check('zzz qqq').answer;
      expect(c.check(shown).pass, `${n.id} ${shown}`).toBe(true);
      expect(c.check('zzz qqq').pass).toBe(false);
      expect(c.check('zzz qqq').answer.length).toBeGreaterThan(0);
    }
    expect(tried).toBeGreaterThan(20);
    expect(gapped).toBeGreaterThan(tried * 0.3);
  });

  it('a node with no sentence still gets the gloss card', () => {
    const n = [...b.course.nodes.values()].find((x) => x.kind === 'lexeme' && !b.index.byTarget.get(x.id)?.length && !b.index.byRequire.get(x.id)?.length);
    if (!n) return;
    const c = lexemeTypeCard('k', n.id, b);
    expect(c.type).toBe('type');
    if (c.type === 'type') { expect(c.ask).toMatch(/Spanish/); expect(c.prompt?.text).not.toContain('___'); }
  });
});

describe('productive review variety', () => {
  it('productiveFormat walks the wheel with no equal neighbours', () => {
    const seen = new Set<string>();
    for (const node of ['l:día', 'g:ser', 'c:a']) {
      for (let s = 0; s < 40; s++) {
        const f = productiveFormat(node, s);
        seen.add(f);
        expect(productiveFormat(node, s + 1)).not.toBe(f);
      }
    }
    expect(seen).toEqual(new Set(['translate', 'cloze', 'transform']));
    const counts: Record<string, number> = {};
    for (let s = 0; s < 20; s++) counts[productiveFormat('l:día', s)] = (counts[productiveFormat('l:día', s)] ?? 0) + 1;
    expect(counts).toEqual({ translate: 8, cloze: 8, transform: 4 });
  });

  it('a warm-up of 12 productive single-target reviews has no run over 4', () => {
    const seen = new Set<string>();
    const pool = b.bank.filter((s) => s.targets.length && !seen.has(s.targets[0]) && seen.add(s.targets[0]));
    for (let off = 0; off < 5; off++) {
      const items: ReviewItem[] = pool.slice(off * 12, off * 12 + 12).map((s) => ({
        op: 'review', id: `rv:${s.id}`, node: s.targets[0], targets: [s.targets[0]], direction: 'productive', sentence: s.id,
        novel: false, scoring: 'review', credit: [s.targets[0]],
      }) as ReviewItem);
      const cards: Card[] = items.map((it) => reviewCard(it, b));
      const order = interleave(cards, formatOf);
      breakRuns(cards, order, (i) => reviewCard(items[i], b, 'cloze'));
      let run = 0, last = '';
      for (const k of order) {
        const f = formatOf(cards[k]);
        run = f === last ? run + 1 : 1; last = f;
        expect(run).toBeLessThanOrEqual(4);
      }
    }
  });
});

describe('bounded leniency', () => {
  const s = { es: 'Vivo allí.', en: 'I live there.', accept: [] as string[] };
  it('a swap within an interchangeable set passes as lenient', () => {
    const r = sentenceCheck(s)('Vivo allá');
    expect(r.pass).toBe(true);
    expect(r.lenient).toBe(true);
    expect(r.hint).toMatch(/We'd say/);
    expect(r.answer).toBe(s.es);
  });
  it('a real wrong word still fails', () => {
    const r = sentenceCheck(s)('Vivo aquí');
    expect(r.pass).toBe(false);
    expect(r.lenient).toBeUndefined();
  });
  it('grades lenient as Hard', () => {
    expect(gradeOf({ correct: true, tries: 1, lenient: true })).toBe(Rating.Hard);
    expect(gradeOf({ correct: true, tries: 1 })).toBe(Rating.Good);
  });
});
