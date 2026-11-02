// The sentences a generated card says to the learner read as sentences: no
// "said was like this before", no ".." after a full stop, and "Answer for
// yourself" only asks what a person can answer about themselves
// (docs/swarm-audit, H8 and M3, F25).
import { beforeAll, describe, expect, it } from 'vitest';
import type { PracticeItem, ReviewItem } from '../../src/compiler';
import type { TenseKey } from '../../src/engine';
import { askedOfYou } from '../../src/exercises/addressee';
import { namesOf, placesOf } from '../../src/exercises/licence';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { practiceCard, recombineCard, reviewCard, type Card } from '../../src/ui/session/cards';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ band: 'A1' }); }, 60_000);

const TAUGHT: readonly TenseKey[] = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional'];
const practice = (op: PracticeItem['op'], id: string, node: string) => ({ op, id: `${op}:${id}`, node, sentence: id, direction: 'productive', scoring: 'exposure', credit: [] }) as unknown as PracticeItem;
const review = (id: string, node: string) => ({ op: 'review', id: `rv:${id}`, node, direction: 'productive', novel: false, scoring: 'review', credit: [node], sentence: id }) as unknown as ReviewItem;
/** every sentence a card shows or says */
const said = (c: Card) => [c.ask, (c as { why?: string }).why, (c as { prompt?: { text: string } }).prompt?.text, (c as { sub?: { text: string } }).sub?.text].filter((x): x is string => !!x);

describe('the reason a transform card gives', () => {
  it('reads as a sentence, whatever the transform', () => {
    const whys = new Map<string, string>();
    const rows = b.bank.filter((s) => /^u(0[6-9]|1\d)-/.test(s.id) && s.targets[0]).filter((_, i) => i % 7 === 0).slice(0, 400);
    for (const s of rows) {
      for (let session = 0; session < 6; session++) {
        const c = reviewCard(review(s.id, s.targets[0]), b, 'meaning', session, TAUGHT);
        if (c.type === 'type' && c.ask === 'Change the sentence' && c.why) whys.set(c.why, s.id);
      }
      const p = practiceCard(practice('transform', s.id, s.targets[0]), b, 1, TAUGHT);
      if (p.type === 'type' && p.why) whys.set(p.why, s.id);
    }
    expect(whys.size).toBeGreaterThan(30);
    for (const [why, id] of whys) {
      // not the task's own words cut and pasted: "said was like this before", "said to a friend (tú)"
      expect(why, id).not.toMatch(/\bsaid (was|happened|will|to a friend|about one)|\((yo|tú|él \/ ella|nosotros|ellos)\)|\.\.|: start with|\bSay it\b/);
      expect(why, id).toMatch(/[.?!…]$/);
    }
  }, 90_000);
});

describe('a review reason never doubles a stop', () => {
  it('"It uses Saying hello at any time of day: Hola." has one stop', () => {
    const doubled: string[] = [];
    let uses = 0;
    for (const s of b.bank.filter((x) => /^u0[1-4]-/.test(x.id) && x.targets[0]).filter((_, i) => i % 3 === 0).slice(0, 500)) {
      for (const dir of ['receptive', 'productive'] as const) {
        const c = reviewCard({ ...review(s.id, s.targets[0]), direction: dir } as ReviewItem, b);
        const why = (c as { why?: string }).why ?? '';
        if (/^It uses /.test(why)) uses++;
        if (/(?<!\.)\.\.(?!\.)|[?!]\./.test(why)) doubled.push(`${s.id}: ${why}`);
      }
    }
    expect(uses).toBeGreaterThan(30);
    expect(doubled.slice(0, 10)).toEqual([]);
  }, 60_000);
});

describe('a recombine card never doubles its full stop', () => {
  it('"…del todo. Same sentence, new person."', () => {
    let built = 0;
    for (const s of b.bank.filter((x) => x.id.startsWith('u0')).filter((_, i) => i % 5 === 0).slice(0, 600)) {
      const c = recombineCard(practice('recombine', s.id, s.targets[0] ?? ''), s, b, 1, TAUGHT);
      if (!c) continue;
      built++;
      for (const t of said(c)) expect(t, s.id).not.toMatch(/[.?!]\.|\.\./);
    }
    expect(built).toBeGreaterThan(50);
  }, 90_000);
});

describe('"Answer for yourself"', () => {
  const names = () => namesOf(b.bank);
  const places = () => placesOf(b.bank);

  it('is not asked of a question to a character, a group, or about the story', () => {
    for (const es of ['¿Eres tú, Tomás?', '¿De dónde eres, Vale?', '¿Ustedes son Mariana y Hernando?', '¿Tomás salva La Esquina de Rosa?', '¿Qué dirá Altamira?', '¿Qué hora es?']) {
      const s = b.bank.find((x) => x.es === es);
      if (!s) continue;
      const c = practiceCard(practice('respond', s.id, s.targets[0] ?? ''), b, 1, TAUGHT);
      expect(c.ask, es).not.toBe('Answer for yourself');
    }
  });

  it('over the bank, every card it asks is a question the learner can answer for themselves', () => {
    let asked = 0;
    for (const s of b.bank.filter((x) => /^u(0\d|1\d)-/.test(x.id)).filter((_, i) => i % 3 === 0).slice(0, 1500)) {
      const c = practiceCard(practice('respond', s.id, s.targets[0] ?? ''), b, 1, TAUGHT);
      if (c.ask !== 'Answer for yourself') continue;
      asked++;
      expect(askedOfYou((c as { prompt?: { text: string } }).prompt!.text, names(), places()), s.es).toBe(true);
    }
    expect(asked).toBeGreaterThan(50);
  }, 90_000);
});
