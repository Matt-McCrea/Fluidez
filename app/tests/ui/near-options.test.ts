// The wrong options of a choice card, swept across the whole real course instead of the few cards a session shows:
// a word has company of its own part of speech and number, none of it a way of saying the same, about its length;
// a sentence with a name in it has that name in every option (audit F8: 63 of 74 such cards were solved by the one
// option holding the name), and no option stands out.
import { beforeAll, describe, expect, it } from 'vitest';
import type { LearnItem, ReviewItem } from '../../src/compiler';
import { namesOf } from '../../src/exercises/licence';
import { contentWords, lengthRoom } from '../../src/exercises/neighbours';
import { isMultiTurn } from '../../src/exercises/dialogue';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { learnRetrieval, otherEnglish, reviewCard, type Card } from '../../src/ui/session/cards';
import { namesIn, standsOut } from './guess-play';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load(); }, 120_000);

const group = (pos: string | undefined) => (pos === 'noun' || pos === 'verb' || pos === 'adj' || pos === 'adv' || pos === 'num' ? pos : 'little');

describe('a word on a choice card', () => {
  it('has company of its own part of speech and number, none that says the same, of about its length', { timeout: 120_000 }, () => {
    const lexemes = [...b.course.nodes.values()].filter((n) => n.kind === 'lexeme' && n.es && n.en);
    // which words a shown text could be (a gloss and a word with its article both name a node)
    const by = new Map<string, typeof lexemes>();
    for (const n of lexemes) for (const t of [b.segments(n.id)[0]?.es, b.segments(n.id)[0]?.en]) if (t) by.set(t, [...(by.get(t) ?? []), n]);
    const names = namesOf(b.bank);
    const bad: string[] = [];
    let cards = 0, typed = 0;
    for (const n of lexemes) {
      const item: LearnItem = { op: 'learn', id: `ln:${n.id}`, node: n.id, nodeKind: n.kind, retrievals: 4, productive: true, scoring: 'learning', credit: [n.id] };
      for (const round of [0, 1]) {
        const c = learnRetrieval(item, b, round);
        if (c.type !== 'mcq') { if (round === 0) typed++; continue; }
        cards++;
        const right = c.options[c.answer].text;
        const gloss = c.options.every((o) => o.lang === 'en');
        c.options.forEach((o, i) => {
          if (i === c.answer) return;
          const as = by.get(o.text) ?? [];
          if (!as.some((x) => group(x.pos) === group(n.pos))) bad.push(`${n.id}: "${o.text}" is not a ${group(n.pos)}`);
          if (!gloss && /^(los|las|unos|unas)\s/i.test(o.text) !== /^(los|las|unos|unas)\s/i.test(right)) bad.push(`${n.id}: "${o.text}" has another number than "${right}"`);
          if (Math.abs(o.text.length - right.length) > lengthRoom(right.length)) bad.push(`${n.id}: "${o.text}" is not the length of "${right}"`);
          if (gloss) {
            const mine = contentWords(right, 'en', names);
            if ([...contentWords(o.text, 'en', names)].some((w) => mine.has(w))) bad.push(`${n.id}: "${o.text}" shares a sense with "${right}"`);
          }
        });
      }
    }
    expect(cards).toBeGreaterThan(5000);
    expect(bad.slice(0, 15)).toEqual([]);
    // a word with no two neighbours is typed instead; that is the exception
    expect(typed / lexemes.length).toBeLessThan(0.02);
  });
});

describe('a sentence on a choice card', () => {
  const asked = (s: { id: string; targets: string[] }, how: 'pickSpanish' | 'meaning', session: number): Card => {
    const node = s.targets[0] ?? 'g:none';
    const item: ReviewItem = { op: 'review', id: `rv:${s.id}`, node, direction: 'receptive', sentence: s.id, novel: false, scoring: 'review', credit: [node] };
    return reviewCard(item, b, how, session);
  };

  it('holds the same names in every option, and no option stands out by a name or a tag', { timeout: 120_000 }, () => {
    const names = namesOf(b.bank);
    const rows = b.bank.filter((s) => namesIn(s.es, names).size > 0 && namesIn(s.en, names).size > 0).filter((_, i) => i % 25 === 0);
    expect(rows.length).toBeGreaterThan(400);
    const bad: string[] = [];
    let cards = 0, typed = 0, picks = 0;
    for (const s of rows) {
      for (const [how, session] of [['pickSpanish', 0], ['meaning', 1], ['meaning', 2], ['meaning', 3]] as const) {
        const c = asked(s, how, session);
        // "which one says this?" is always a choice; the other way is typed on some turns of the wheel by design
        if (how === 'pickSpanish') picks++;
        if (c.type !== 'mcq') { if (how === 'pickSpanish') typed++; continue; }
        cards++;
        if (c.options.length > 2 && standsOut(c, names)) bad.push(`${s.id}: ${c.options.map((o) => o.text).join(' | ')}`);
        // the names the prompt gives away are in every option
        const give = [...namesIn(c.prompt?.text ?? '', names)].filter((w) => namesIn(c.options[c.answer].text, names).has(w));
        for (const o of c.options) for (const w of give) if (!namesIn(o.text, names).has(w)) bad.push(`${s.id}: "${o.text}" lacks ${w}`);
        // no two options the same
        if (new Set(c.options.map((o) => o.text.toLowerCase())).size !== c.options.length) bad.push(`${s.id}: an option twice`);
      }
    }
    expect(cards).toBeGreaterThan(800);
    expect(bad.slice(0, 15)).toEqual([]);
    // a sentence with no two neighbours holding its names is typed instead; that is the exception
    console.log(`name-bearing sentences: ${cards} choice cards, ${typed} of ${picks} "which one says this?" typed instead`);
    expect(typed / picks).toBeLessThan(0.2);
  });
});

describe('an exchange with too few neighbours to choose among', () => {
  it('is never typed whole: its reply is, and nothing is a choice of two', { timeout: 300_000 }, () => {
    let thin = 0;
    for (const s of b.bank.filter((x) => isMultiTurn(x)).filter((_, i) => i % 3 === 0)) {
      if (otherEnglish(b, s, `rv:${s.id}`, 2).length >= 2) continue;
      thin++;
      const node = s.targets[0] ?? 'g:none';
      const item: ReviewItem = { op: 'review', id: `rv:${s.id}`, node, direction: 'receptive', sentence: s.id, novel: false, scoring: 'review', credit: [node] };
      const c = reviewCard(item, b, 'meaning', 0);
      if (c.type === 'type') expect(c.prompt?.text, s.id).not.toContain('\n');
      else if (c.type === 'mcq') expect(s.es.split('\n').length === s.en.split('\n').length, `${s.id}: a choice of ${c.options.length} on an exchange that has turns to type`).toBe(false);
    }
    expect(thin).toBeGreaterThan(50);
  });
});
