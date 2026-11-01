// A transform card is built only on a sentence the engine has understood
// completely, and asks only for a tense the learner has been taught. With no
// list passed, the unit the sentence is from decides. Anything else falls back
// to a plain card (docs/swarm-audit, C2).
import { beforeAll, describe, expect, it } from 'vitest';
import type { PracticeItem } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { practiceCard, type Card } from '../../src/ui/session/cards';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ band: 'A1' }); }, 60_000);

const item = (op: 'transform' | 'recombine', id: string, node: string) => ({ op, id: `${op}:${id}`, node, sentence: id, direction: 'productive', scoring: 'exposure', credit: [] }) as unknown as PracticeItem;
const TENSE_ASK = /happened yesterday|like this before|will happen|Say it was/i;

describe('transform cards over real sentences', () => {
  it('never ask for a tense the unit has not taught', () => {
    const unit = b.bank.filter((s) => s.id.startsWith('u01-')).slice(0, 400);
    expect(unit.length).toBeGreaterThan(100);
    const asked: Card[] = [];
    for (const s of unit) {
      for (const op of ['transform', 'recombine'] as const) {
        const c = practiceCard(item(op, s.id, s.targets[0]), b, 1);
        asked.push(c);
        expect(`${c.ask}`, `${s.id} ${s.es}`).not.toMatch(TENSE_ASK);
        if (c.type === 'mcq') expect(c.options.map((o) => o.text).join(' | '), s.id).not.toMatch(/\b(Ayer|Antes|Mañana)\b/);
      }
    }
    // the licence is not a ban: person and negation transforms are still asked
    expect(asked.filter((c) => c.type === 'type' && /Say it about|negative/i.test(c.ask)).length).toBeGreaterThan(20);
  }, 60_000);
});
