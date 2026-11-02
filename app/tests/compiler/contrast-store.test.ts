// A due contrast is reviewed with one of its own items (content/contrasts), a different one each session (F3), where
// F2 gave it one of its script's. An item is shown only when everything its sentence needs is known; a contrast whose
// items are none the learner can be shown is reviewed with its script, as before.
import { describe, expect, it } from 'vitest';
import { admissible, buildContentIndex, buildCourse, compileSession, initialPath, knownSet, type SessionPlan } from '../../src/compiler';
import type { ContrastDecides, ContrastFile, ContrastItem } from '../../src/content/schema';
import { Learner } from '../../src/learner';
import { syntheticCorpus } from '../../tools/sim/synthetic';
import { PROFILES } from '../../tools/sim/profiles';
import { lightCourse, walk } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

const mk = (node: string, k: number, requires: string[] = []): ContrastItem => ({
  id: `${node}#t${k}`, node, side: 'g:a', rung: 1, en: `Sentence ${k}.`, es: `Frase ${k} por ti.`, gap: [`Frase ${k} `.length, `Frase ${k} por`.length], options: ['para', 'por'], answer: 1, why: 'w', requires,
});

/** A synthetic course whose first contrast has the items given, and a learner who has both cards of it and lets them fall due. */
function dueContrast(items: (node: string) => ContrastItem[], cards: 'both' | 'receptive' = 'both', decides: ContrastDecides = 'local') {
  const c = syntheticCorpus({ seed: 2, maxUnits: 6 });
  const course = buildCourse(c.units, c.nodes);
  const x = [...course.nodes.values()].find((n) => n.kind === 'contrast')!.id;
  const file: ContrastFile = { node: x, decides, items: items(x) };
  const content = buildContentIndex({ ...c.source, contrasts: file.items.length || decides !== 'local' ? [file] : [] }, course);
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  L.seedKnown(x, {
    at: T0, productive: cards === 'both',
    receptive: { stability: 3, dueAt: T0 + DAY },
    productiveCard: cards === 'both' ? { stability: 3, dueAt: T0 + DAY } : null,
  });
  t = T0 + 30 * DAY;
  const warm = () => {
    const p: SessionPlan = compileSession({ learnerId: 'rev', learner: L, path: initialPath(), course, content, now: t });
    const w = p.blocks[0];
    if (w.kind !== 'warmup') throw new Error('no warm-up');
    return { plan: p, item: w.items.find((i) => i.node === x) };
  };
  return { x, L, warm, file, content, next: () => { L.startSession(t); } };
}

describe('a due contrast is reviewed with one of its own items', () => {
  const many = (n: number) => (x: string) => Array.from({ length: n }, (_, k) => mk(x, k));

  it('the review names the item, and is neither a sentence, a script item nor a bare card', () => {
    const { x, warm, file } = dueContrast(many(6));
    const { plan, item } = warm();
    expect(item, 'the due contrast is in the warm-up').toBeDefined();
    expect(file.items.map((i) => i.id)).toContain(item!.contrast);
    expect(item!.sentence).toBeUndefined();
    expect(item!.script).toBeUndefined();
    expect(item!.targets).toEqual([x]);
    expect(item!.scoring).toBe('review');
    expect(plan.diagnostics.some((d) => d.code === 'bareReview' && d.node === x)).toBe(false);
  });

  it('is a different item each session, and goes round the whole pool', () => {
    const { warm, next } = dueContrast(many(6));
    const seen: string[] = [];
    for (let k = 0; k < 6; k++) {
      next();
      seen.push(warm().item!.contrast!);
    }
    for (let k = 1; k < seen.length; k++) expect(seen[k], `session ${k} asks the item the one before did`).not.toBe(seen[k - 1]);
    expect(new Set(seen).size).toBe(6);
  });

  it('a contrast a choice cannot test falls back on its script\'s typed turns, and never on a pick: its file says so even with no items in it', () => {
    for (const decides of ['discourse', 'synonym'] as const) {
      expect(dueContrast(() => [], 'receptive', decides).warm().item!.script?.op, decides).toBe('yourTurn');
      expect(dueContrast((n) => [mk(n, 0, ['g:not-taught-yet'])], 'receptive', decides).warm().item!.script?.op, decides).toBe('yourTurn');
    }
    expect(dueContrast((n) => [mk(n, 0, ['g:not-taught-yet'])], 'receptive', 'local').warm().item!.script?.op).toBe('readAndPick');
  });

  it('the same session, the same plan: the item is a function of the contrast and the session number', () => {
    const { warm } = dueContrast(many(6));
    expect(warm().item!.contrast).toBe(warm().item!.contrast);
  });

  it('never an item whose sentence needs what the learner does not know, and its script when none is left', () => {
    const { warm, next, file, x } = dueContrast((n) => [mk(n, 0), mk(n, 1, ['g:not-taught-yet']), mk(n, 2)]);
    const seen = new Set<string>();
    for (let k = 0; k < 6; k++) { next(); seen.add(warm().item!.contrast!); }
    expect([...seen].sort()).toEqual([file.items[0].id, file.items[2].id].sort());
    const none = dueContrast((n) => [mk(n, 0, ['g:not-taught-yet'])]);
    const { item } = none.warm();
    expect(item!.contrast).toBeUndefined();
    expect(item!.script, `${x} falls back to its script`).toBeDefined();
  });

  it('a contrast with no items is reviewed with its script, as before', () => {
    const { warm } = dueContrast(() => []);
    const { item } = warm();
    expect(item!.contrast).toBeUndefined();
    expect(item!.script).toBeDefined();
  });

  it('either card of the contrast, whichever is due', () => {
    for (const cards of ['both', 'receptive'] as const) {
      const { warm } = dueContrast(many(4), cards);
      expect(warm().item!.contrast, cards).toBeDefined();
    }
  });
});

describe('the real contrasts\' items are shown to a learner who has what the course teaches', () => {
  /** For each contrast, how many of its items the learner can be shown (everything the sentence needs is known) on the day it is taught, or once the whole course is. */
  function shownWhen(when: 'its day' | 'the end') {
    const { course, content } = lightCourse();
    const last = Math.max(...course.teachPos.values());
    const out = new Map<string, { shown: number; of: number }>();
    for (const [x, refs] of content.contrasts) {
      const pos = when === 'the end' ? last : course.teachPos.get(x);
      expect(pos, `${x} is taught somewhere`).toBeDefined();
      const L = Learner.fresh({ now: () => T0 });
      for (const [n, p] of course.teachPos) if (p <= pos! && course.nodes.get(n)?.kind !== 'cando') L.seedKnown(n, { at: T0, productive: false, receptive: { stability: 30, dueAt: T0 + 90 * DAY } });
      for (let s = 0; s <= pos!; s++) L.startSession(T0 + s * DAY);
      const known = knownSet(L, course);
      out.set(x, { shown: refs.filter((r) => admissible(r.requires, (id) => known.has(id), course.nodes)).length, of: refs.length });
    }
    return out;
  }

  it('on the day each contrast is taught, most of its items can be shown (the words some need are taught later, and the item waits for them)', () => {
    const day = shownWhen('its day');
    const items = [...day.values()].reduce((a, d) => a + d.of, 0);
    const shown = [...day.values()].reduce((a, d) => a + d.shown, 0);
    expect(items).toBeGreaterThan(500);
    expect(shown / items).toBeGreaterThan(0.8);
    // the exceptions: the words their items need come later, and until then they are reviewed with their script
    expect([...day].filter(([, d]) => d.shown === 0).map(([x]) => x)).toEqual(['x:medir-caber', 'x:pedir-preguntar', 'x:talento-capacidad']);
  }, 120_000);

  it('by the end of the course every item can be shown: none is out of reach for ever', () => {
    const end = shownWhen('the end');
    expect([...end].filter(([, d]) => d.shown < d.of).map(([x, d]) => `${x} ${d.shown}/${d.of}`)).toEqual([]);
  }, 120_000);
});

describe('interleaving: the known contrast mixed into a drill or remix is served as one of its own items', () => {
  it('a block that names a contrast carries a contrast item, gated on what the learner knows', () => {
    let named = 0, served = 0;
    for (const seed of [1, 2, 3]) {
      const { plans } = walk({ seed, profile: PROFILES.average, days: 150 });
      for (const { plan, input, known } of plans) {
        for (const b of plan.blocks) {
          if ((b.kind !== 'controlledOutput' && b.kind !== 'remix') || !b.contrast) continue;
          named++;
          const own = b.items.filter((i) => i.contrast);
          served += own.length ? 1 : 0;
          for (const it of own) {
            expect(it.node).toBe(b.contrast);
            const ref = input.content.contrasts.get(it.node)?.find((r) => r.id === it.contrast);
            expect(ref, `${it.contrast} is the contrast's own`).toBeDefined();
            expect(ref!.requires.filter((r) => !known.has(r) && !Object.values(plan.newNodes).flat().includes(r))).toEqual([]);
          }
        }
      }
    }
    expect(named).toBeGreaterThan(0);
    expect(served, 'a named contrast with items gets one').toBeGreaterThan(0);
  });
});
