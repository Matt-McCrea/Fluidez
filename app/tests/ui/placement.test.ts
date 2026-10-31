// Placement on the real course: every item is decided by grammar (never a
// name, a number or a cognate), the ladder adapts and stays short, and
// placing late seeds the skipped weeks without a review avalanche.
import { beforeAll, describe, expect, it } from 'vitest';
import { BAND_WARMUP_MINUTES } from '../../src/compiler/budget';
import { Learner, MemoryStore, Rating } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import {
  applyPlacement, contentProbe, EARLY_STOP_MISSES, fairItem, isCognate, ladder, MAX_ITEMS, probeLevels,
  type ProbeItem,
} from '../../src/ui/session/placement';

const DAY = 86_400_000;
let b: Bundle;
/** the bank through B2 and a band beyond: what a learner who says they are advanced is checked on */
let upper: Bundle;
beforeAll(async () => {
  const loader = new ContentLoader();
  b = await loader.load({ band: 'A1' });
  upper = await new ContentLoader().load({ band: 'B2' });
}, 120_000);

const names = (s: string) => (s.match(/(?<![.?!¿¡]\s*|^)\b\p{Lu}\p{L}+/gu) ?? []).sort().join(',');

describe('placement items (real content)', () => {
  it('there are levels to climb', () => {
    expect(probeLevels(b).length).toBeGreaterThanOrEqual(2);
  });

  it('every item is decided by grammar: no digits, no names or cognates deciding it, options share their names', () => {
    for (const level of probeLevels(b)) {
      for (const it of level.items) {
        const s = b.sentences.get(it.sentence);
        expect(s, it.id).toBeTruthy();
        expect(fairItem(it, s!.es, s!.en), `${it.id}: ${it.options.map((o) => o.text).join(' | ')}`).toBe(true);
        const all = it.options.map((o) => o.text).join(' ');
        expect(all, it.id).not.toMatch(/\d/);
        if (it.kind === 'form') {
          // the names in every option are the same: only the grammar differs
          const sets = it.options.map((o) => names(o.text));
          expect(new Set(sets).size, `${it.id}: ${all}`).toBe(1);
        }
        expect(it.options.length).toBeGreaterThanOrEqual(2);
        expect(it.answer).toBeGreaterThanOrEqual(0);
        expect(it.answer).toBeLessThan(it.options.length);
      }
    }
  });

  it('cognates and names are caught', () => {
    expect(isCognate('café', 'a coffee in the café')).toBe(true);
    expect(isCognate('profesora', 'She is a teacher, a professor.')).toBe(true);
    expect(isCognate('soy', "I'm from Toronto")).toBe(false);
    const it = (o: string[]): Pick<ProbeItem, 'options' | 'answer'> => ({ options: o.map((text) => ({ text, lang: 'es' as const })), answer: 0 });
    expect(fairItem(it(['Vivo en Bogotá.', 'Vivo en Toronto.']), 'Vivo en Bogotá.', 'I live in Bogotá.')).toBe(false);
    expect(fairItem(it(['Tengo 3 hermanos.', 'Tengo 4 hermanos.']), 'Tengo 3 hermanos.', 'I have 3 brothers.')).toBe(false);
    expect(fairItem(it(['Somos de Bogotá.', 'Soy de Bogotá.']), 'Somos de Bogotá.', "We're from Bogotá.")).toBe(true);
  });

  it('a full run asks 12 to 23 items for someone in the middle, and places them', () => {
    const p = contentProbe(b, 'learner-x').start();
    let n = 0;
    for (let it = p.next(); it; it = p.next()) { p.answer(it.unit === 0 || n % 3 === 0); n++; }
    expect(n).toBeGreaterThanOrEqual(Math.min(12, MAX_ITEMS));
    expect(n).toBeLessThanOrEqual(MAX_ITEMS + 3);
    expect(p.result()).toBeGreaterThanOrEqual(0);
  });
});

describe('the ladder', () => {
  const level = (unit: number, n = 20) => ({ unit, items: Array.from({ length: n }, (_, k) => ({ id: `${unit}:${k}`, kind: 'form', sentence: '', unit, ask: '', prompt: { text: '', lang: 'en' }, options: [], answer: 0 } as ProbeItem)) });
  const levels = [0, 1, 2, 3, 4, 5].map((u) => level(u));
  const band = (u: number) => (u < 4 ? 'A1' : 'A2');

  it('starts in the middle of A1 and steps up on two right', () => {
    const p = ladder(levels, band);
    const first = p.next()!;
    expect(first.unit).toBe(1);
    p.answer(true);
    expect(p.next()!.unit).toBe(1);
    p.answer(true);
    expect(p.next()!.unit).toBe(3);
  });

  it('climbs two levels per streak until the first miss, then one', () => {
    const many = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((u) => level(u, 30));
    const p = ladder(many, (u) => (u < 3 ? 'A1' : 'A2'));
    const seen: number[] = [];
    for (let i = 0; i < 6; i++) { seen.push(p.next()!.unit); p.answer(true); }
    expect(seen).toEqual([1, 1, 3, 3, 5, 5]);
    p.next(); p.answer(false);                 // the miss: down one
    const after: number[] = [];
    for (let i = 0; i < 4; i++) { after.push(p.next()!.unit); p.answer(true); }
    expect(after).toEqual([6, 6, 7, 7]);       // up by one per streak from here on
  });

  it('starts at the first level of the band asked for, or the nearest lower band', () => {
    const bands = (u: number) => (u < 2 ? 'A1' : u < 4 ? 'A2' : u < 6 ? 'B1' : 'B2');
    const ten = [0, 1, 2, 3, 4, 5, 6, 7].map((u) => level(u));
    expect(ladder(ten, bands, 20, { start: 'B1' }).next()!.unit).toBe(4);
    expect(ladder(ten, bands, 20, { start: 'B2' }).next()!.unit).toBe(6);
    const noB2 = ten.slice(0, 6);
    expect(ladder(noB2, bands, 20, { start: 'B2' }).next()!.unit).toBe(4);
  });

  it('never asks more than MAX_ITEMS + 3, and a B2 result rests on three items from a B2 level', () => {
    const bands = (u: number) => (u < 2 ? 'A1' : u < 4 ? 'A2' : u < 6 ? 'B1' : 'B2');
    const lv = [0, 1, 2, 3, 4, 5, 6, 7].map((u) => level(u, 40));
    const p = ladder(lv, bands, 20, { start: 'B2' });
    const perUnit = new Map<number, number>();
    let n = 0;
    for (let it = p.next(); it; it = p.next()) { perUnit.set(it.unit, (perUnit.get(it.unit) ?? 0) + 1); p.answer(true); n++; }
    expect(n).toBeLessThanOrEqual(23);
    const placed = p.result() - 1;
    expect(bands(placed)).toBe('B2');
    expect(perUnit.get(placed) ?? 0).toBeGreaterThanOrEqual(3);
    // two lucky answers at B1 are not enough to place there
    const q = ladder(lv, bands, 20, { start: 'B1' });
    q.next(); q.answer(true); q.next(); q.answer(true);
    expect(q.result()).toBe(0);
  });

  it('steps down on a miss', () => {
    const p = ladder(levels, band);
    p.next(); p.answer(false);
    expect(p.next()!.unit).toBe(0);
  });

  it('always right: climbs to the top, starts after it', () => {
    const p = ladder(levels, band);
    let n = 0;
    while (p.next()) { p.answer(true); n++; }
    expect(n).toBe(MAX_ITEMS);
    expect(p.result()).toBe(6);
  });

  it('a true beginner is let go early and starts at zero', () => {
    const p = ladder(levels, band);
    let n = 0;
    while (p.next()) { p.answer(false); n++; }
    expect(n).toBeLessThanOrEqual(1 + EARLY_STOP_MISSES + 1);
    expect(p.result()).toBe(0);
  });

  it('knows units 0 to 2, not 3: starts at 3', () => {
    const p = ladder(levels, band);
    for (let it = p.next(); it; it = p.next()) p.answer(it.unit <= 2);
    expect(p.result()).toBe(3);
  });
});

describe('seeding the skipped weeks', () => {
  const T0 = new Date(2026, 9, 1, 18).getTime();
  const place = async (unit: number) => {
    const learner = await Learner.open(new MemoryStore(), { now: () => T0 });
    const path = applyPlacement(learner, b, unit, T0);
    return { learner, path };
  };

  it('placing at unit 3: everything before is known, nothing due today, first reviews spread out', async () => {
    const { learner, path } = await place(3);
    expect(path.unit).toBe(3);
    const ids = learner.nodes();
    expect(ids.length).toBeGreaterThan(30);
    for (const id of ids) expect(learner.isLearning(id)).toBe(false);
    expect(learner.due(T0)).toHaveLength(0);
    expect(learner.due(T0 + 3 * DAY).length).toBeLessThan(ids.length / 2);
  });

  for (const [band, unit] of [['A1', 9], ['A2', 19]] as const) {
    describe(`placed at index ${unit} (${band})`, () => {
      it('is deterministic', async () => {
        const a = await place(unit);
        const c = await place(unit);
        expect(a.learner.nodes()).toEqual(c.learner.nodes());
        for (const id of a.learner.nodes()) {
          for (const d of ['receptive', 'productive'] as const) expect(a.learner.card(id, d)).toEqual(c.learner.card(id, d));
        }
      });

      it('learned nodes have their receptive card suspended and count as learned', async () => {
        const { learner } = await place(unit);
        let learned = 0;
        for (const id of learner.nodes()) {
          if (!learner.isLearned(id)) continue;
          learned++;
          if (learner.hasProductiveTrack(id)) expect(learner.isSuspended(id, 'receptive'), id).toBe(true);
        }
        expect(learned).toBeGreaterThan(0);
      });

      it('30 days of all-Good reviews: the daily load fits the warm-up budget', async () => {
        const { learner } = await place(unit);
        const bandU = b.course.units[unit].band ?? band;
        const budget = BAND_WARMUP_MINUTES[bandU];
        const spr = learner.secondsPerReview();
        const minutes: number[] = [];
        for (let d = 1; d <= 30; d++) {
          const at = T0 + d * DAY;
          const due = learner.due(at);
          minutes.push((due.length * spr) / 60);
          for (const c of due) learner.review(c.node, c.direction, Rating.Good, { at });
        }
        expect(Math.max(...minutes), minutes.map((m) => m.toFixed(1)).join(' ')).toBeLessThanOrEqual(budget * 1.5);
        expect(minutes.reduce((a, c) => a + c, 0) / minutes.length).toBeLessThan(budget);
      }, 60_000);
    });
  }
});

describe('dialogue rows in placement items', () => {
  it('a second turn keeps its capital letter', async () => {
    const { itemsFor, capitaliseTurns } = await import('../../src/ui/session/placement');
    expect(capitaliseTurns('¿Qué pasó con el café? no hay, Tomás.')).toBe('¿Qué pasó con el café? No hay, Tomás.');
    const s: any = { id: 'u04-x', es: '¿Qué pasó con el café?\nHoy no hay, Tomás.', en: 'What happened to the coffee?\nThere is none today, Tomás.', accept: [], acceptEn: [], requires: [], targets: [], kind: 'dialogue', unit: 'u04' };
    for (const it of itemsFor(s, 4, 'a')) for (const o of it.options) expect(o.text).not.toMatch(/[?.!] \p{Ll}/u);
  });
});

describe('placement for people who already know some Spanish (real content)', () => {
  const bandOf = (u: number) => upper.course.units[u].band;

  it('starting at B1, the first item comes from a B1 unit', () => {
    const p = contentProbe(upper, 'learner-b1', { start: 'B1' }).start();
    expect(bandOf(p.next()!.unit)).toBe('B1');
  });

  it('some level above u05 carries a ser/estar or por/para item', () => {
    const levels = probeLevels(upper).filter((l) => l.unit > 5);
    const forms = levels.flatMap((l) => l.items.filter((it) => it.kind === 'form').map((it) => (it.id.split('|')[2] ?? '').split(':')[0]));
    expect(forms.some((f) => f === 'copula' || f === 'porpara'), [...new Set(forms)].join(',')).toBe(true);
    expect(levels.some((l) => (l.features ?? []).length > 0)).toBe(true);
  });

  it('answering everything right from B2 lands at B2 or later, in at most 23 items', () => {
    const p = contentProbe(upper, 'learner-b2', { start: 'B2' }).start();
    let n = 0;
    for (let it = p.next(); it; it = p.next()) { p.answer(true); n++; }
    expect(n).toBeLessThanOrEqual(23);
    expect(['B2', 'C1', 'C2']).toContain(bandOf(Math.max(0, p.result() - 1)));
  });

  it('a unit only shows tenses taught by then: no future or conditional forms in the first unit', () => {
    const first = probeLevels(upper)[0];
    for (const it of first.items) {
      if (it.kind === 'form') expect(it.id, it.options.map((o) => o.text).join(' | ')).not.toMatch(/\|tense:/);
    }
  });
});
