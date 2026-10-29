// Receptive reviews are asked three ways (type the English, pick the meaning
// with one-feature distractors, which one says this), rotated per node and
// session, so a half-memory plus elimination is not enough to pass.
import { beforeAll, describe, expect, it } from 'vitest';
import type { ReviewItem } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { receptiveFormat, reviewCard, type Card } from '../../src/ui/session/cards';
import { englishVariants } from '../../src/ui/session/engvariants';
import { formatOf } from '../../src/ui/session/order';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ band: 'A1' }); cards(); }, 180_000);

const SEEDS = [0, 1, 2];
function items(): ReviewItem[] {
  const seen = new Set<string>();
  const pool = [...b.bank.filter((s) => s.unit === 'u01'), ...b.bank].filter((s) => s.targets.length && !seen.has(s.targets[0]) && seen.add(s.targets[0]));
  return pool.slice(0, 300).map((s) => ({
    op: 'review', id: `rv:${s.id}`, node: s.targets[0], targets: [s.targets[0]], direction: 'receptive', sentence: s.id,
    novel: false, scoring: 'review', credit: [s.targets[0]],
  }));
}

let memo: Array<{ it: ReviewItem; seed: number; card: Card }> | undefined;
function cards(): Array<{ it: ReviewItem; seed: number; card: Card }> {
  if (memo) return memo;
  const out: Array<{ it: ReviewItem; seed: number; card: Card }> = [];
  for (const it of items()) for (const seed of SEEDS) out.push({ it, seed, card: reviewCard(it, b, 'meaning', seed) });
  return (memo = out);
}

describe('receptive review variety', () => {
  it('the rotation never repeats a node in consecutive sessions', () => {
    for (const node of ['c:a', 'l:día', 'g:ser', ...items().map((i) => i.node)]) {
      for (let s = 0; s < 30; s++) expect(receptiveFormat(node, s)).not.toBe(receptiveFormat(node, s + 1));
    }
  });

  it('is deterministic', () => {
    expect(receptiveFormat('l:día', 'rv:x')).toBe(receptiveFormat('l:día', 'rv:x'));
  });

  it('is at most 60% multiple choice over 300 nodes x 3 sessions', () => {
    const all = cards();
    expect(all.length).toBeGreaterThanOrEqual(600);
    const mcq = all.filter((c) => c.card.type === 'mcq').length;
    const typed = all.filter((c) => c.card.type === 'type' && c.card.answerLang === 'en').length;
    expect(mcq / all.length).toBeLessThanOrEqual(0.6);
    expect(typed / all.length).toBeGreaterThan(0.25);
  });

  it('every typed English card accepts its own meaning', () => {
    let n = 0;
    for (const { it, card } of cards()) {
      if (card.type !== 'type' || card.answerLang !== 'en') continue;
      n++;
      const s = b.sentence(it.sentence)!;
      expect(card.check(s.en).pass, s.en).toBe(true);
      for (const a of s.acceptEn ?? []) expect(card.check(a).pass, a).toBe(true);
      expect(card.check('zzz qqq').pass).toBe(false);
      expect(card.ask).toBe('Type the meaning in English');
      expect(formatOf(card)).toBe('type:es>en');
    }
    expect(n).toBeGreaterThan(100);
  });

  it('feature distractor cards are all English, with exactly one right answer', () => {
    let n = 0;
    for (const { it, card } of cards()) {
      if (card.type !== 'mcq' || card.prompt?.lang !== 'es' || card.options.length < 3) continue;
      const s = b.sentence(it.sentence)!;
      if (englishVariants(s, it.id) === null) continue;
      n++;
      expect(new Set(card.options.map((o) => o.lang))).toEqual(new Set(['en']));
      expect(card.options.filter((o) => o.text === s.en)).toHaveLength(1);
      expect(card.options[card.answer].text).toBe(s.en);
      expect(new Set(card.options.map((o) => o.text.toLowerCase())).size).toBe(card.options.length);
    }
    expect(n).toBeGreaterThan(20);
  });

  it('every card has one language per option set and never shows its answer in the prompt', () => {
    for (const { card } of cards()) {
      if (card.type === 'mcq') {
        expect(new Set(card.options.map((o) => o.lang)).size).toBe(1);
        expect(card.options.length).toBeGreaterThanOrEqual(3);
        expect(new Set(card.options.map((o) => o.text)).size).toBe(card.options.length);
        if (card.prompt) expect(card.options.some((o, i) => i !== card.answer && o.text === card.prompt!.text)).toBe(false);
      }
      if (card.prompt) {
        const ans = card.type === 'mcq' ? card.options[card.answer].text : undefined;
        if (ans) expect(card.prompt.text.toLowerCase()).not.toBe(ans.toLowerCase());
      }
    }
  });

  it('shares on real content', () => {
    const all = cards();
    const by = (f: (c: Card) => boolean) => all.filter((c) => f(c.card)).length / all.length;
    console.log('typeEn', by((c) => c.type === 'type'), 'mcq', by((c) => c.type === 'mcq'),
      'whichOne', by((c) => c.type === 'mcq' && c.ask === 'Which one says this?'),
      'feature', by((c) => c.type === 'mcq' && c.ask === 'What does this mean?' && c.prompt?.lang === 'es'));
  });
});

describe('English variants', () => {
  it('re-inflect on one feature and drop what the Spanish could also say', () => {
    const v = englishVariants({ es: 'Como pan.', en: 'I eat bread.' }, 'k', 12)!;
    expect(v).toBeTruthy();
    expect(v).not.toContain('I eat bread.');
    expect(v.every((x) => /bread\.$/.test(x))).toBe(true);
    expect(v).toContain('I ate bread.');
    expect(englishVariants({ es: 'Comía pan.', en: 'I ate bread.' }, 'k', 6)!.join('|')).not.toMatch(/^he /);
    expect(englishVariants({ es: 'Come mucho.', en: 'What a lot.' }, 'k')).toBeNull();
  });
});
