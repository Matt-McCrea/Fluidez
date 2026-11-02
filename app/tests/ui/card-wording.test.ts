// Wording of cards built from real content: a review's "why" names a form that is
// really in the sentence, and every ask starts with a capital letter.
import { beforeAll, describe, expect, it } from 'vitest';
import type { PracticeItem, ReviewItem } from '../../src/compiler';
import type { PracticeOp } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { practiceCard, reviewCard, type Card } from '../../src/ui/session/cards';
import { deaccent } from '../../src/engine';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ band: 'A1' }); }, 60_000);

const words = (t: string) => deaccent(t.toLowerCase()).split(/[^\p{L}\p{N}]+/u).filter(Boolean).join(' ');

/** one sentence per node, first target of each, capped */
function sample(max: number) {
  const seen = new Set<string>();
  const out: Array<{ node: string; id: string }> = [];
  for (const s of b.bank) {
    const node = s.targets?.[0];
    if (!node || seen.has(node)) continue;
    seen.add(node);
    out.push({ node, id: s.id });
    if (out.length >= max) break;
  }
  return out;
}

const review = (node: string, sentence: string, direction: 'receptive' | 'productive'): ReviewItem =>
  ({ op: 'review', id: `rv:${node}:${direction}:${sentence}`, node, direction, novel: false, scoring: 'review', credit: [node], sentence } as ReviewItem);

describe('review "why" names the form in the sentence', () => {
  it('a productive review quotes only what the answer contains', { timeout: 60_000 }, () => {
    let checked = 0, quoted = 0;
    for (const { node, id } of sample(400)) {
      const card = reviewCard(review(node, id, 'productive'), b);
      if (card.type !== 'type' || !/^It uses /.test(card.why ?? '')) continue;
      checked++;
      const answer = words(card.check('\u0000').answer);
      const head = `It uses ${b.title(node).split(':')[0].trim().replace(/^([A-Z])([a-z])/, (_, f, r) => (/^(Spanish|English|Colombia)/.test(b.title(node)) ? f : f.toLowerCase()) + r)}`;
      expect(card.why!.startsWith(head), card.why).toBe(true);
      const form = card.why!.slice(head.length);
      if (form === '' || /^[.?!…]+$/.test(form)) continue;   // no form quoted: the title, stopped once
      quoted++;
      expect(form.startsWith(': ') && /[.?!…]$/.test(form) && !/[.?!…]{2}$/.test(form), card.why).toBe(true);
      expect(` ${answer} `, `${node}: ${card.why} / ${answer}`).toContain(` ${words(form.slice(2))} `);
    }
    expect(checked).toBeGreaterThan(30);
    expect(quoted).toBeGreaterThan(0);
  });
});

describe('every ask starts with a capital letter', () => {
  it('review, practice and read-and-pick cards on real content', { timeout: 90_000 }, () => {
    const bad: string[] = [];
    const ops: PracticeOp[] = ['pick', 'choose', 'type', 'transform', 'translate', 'respond'];
    const check = (card: Card, what: string) => { if (!/^\p{Lu}/u.test(card.ask)) bad.push(`${what}: "${card.ask}"`); };
    for (const { node, id } of sample(150)) {
      for (const d of ['receptive', 'productive'] as const) check(reviewCard(review(node, id, d), b), `review ${node} ${d}`);
      for (const op of ops) {
        const it: PracticeItem = { op, id: `${op}:${id}`, node, sentence: id, direction: 'productive', scoring: 'exposure', credit: [node] } as PracticeItem;
        check(practiceCard(it, b, 1), `${op} ${id}`);
      }
    }
    expect(bad.slice(0, 10)).toEqual([]);
  });
});

describe('reason lines are about the sentence on screen', () => {
  it('a receptive reason quotes a phrase only when the sentence has it, and never starts a mid-sentence title with a capital', { timeout: 60_000 }, () => {
    for (const { node, id } of sample(300)) {
      const card = reviewCard(review(node, id, 'receptive'), b) as { why?: string; es?: string; prompt?: unknown };
      const why = card.why ?? '';
      expect(why, why).not.toMatch(/^It uses [A-Z][a-z]+ [a-z]/);
      const m = /^(.+?) means "/.exec(why);
      if (m && card.es) expect(` ${words(card.es)} `, why).toContain(` ${words(m[1])} `);
    }
  });
});
