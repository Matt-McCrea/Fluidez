import { describe, expect, it } from 'vitest';
import { verbByInf } from '../../src/engine';
import { rng } from '../../src/exercises/rng';
import { Freeplay, bestKey, conjugationCard, taughtTenses, verbsMet } from '../../src/ui/session/freeplay';
import { emptyUi, migrateUi } from '../../src/ui/store/ui';
import { world } from './driver';
import { answer, answerFor } from './driver';

const DAY = 86_400_000;

async function seeded() {
  const w = await world();
  const { learner, clock } = w;
  for (const n of ['g:ser-identity', 'c:me-llamo', 'c:soy-de', 'l:café']) learner.introduce(n, { at: clock.t, results: [true, true, true] });
  return w;
}
const deps = (w: Awaited<ReturnType<typeof world>>, seed = 'x') => ({ learner: w.learner, bundle: w.bundle, now: w.now, rng: rng(seed) });

describe('quick review', () => {
  it('lines up due cards by retrievability, then not-yet-due ones, one direction per node', async () => {
    const w = await seeded();
    w.clock.t += 6 * DAY;
    const fp = new Freeplay({ kind: 'quickReview' }, deps(w));
    const keys: string[] = [];
    let c;
    while ((c = fp.next())) { keys.push(c.key); fp.answer({ correct: true, tries: 1, ms: 1000 }); }
    const nodes = keys.map((k) => k.split(':').slice(2, -1).join(':'));
    expect(new Set(nodes).size).toBe(nodes.length);
    expect(nodes.length).toBe(4);
    const rs = nodes.map((n) => w.learner.events().filter((e) => e.node === n).length);
    expect(rs.every((n) => n >= 1)).toBe(true);
  });

  it('orders by ascending retrievability and grades a real review', async () => {
    const w = await seeded();
    w.clock.t += 6 * DAY;
    const before = w.learner.due(w.now()).map((d) => d.r);
    expect([...before].sort((a, b) => a - b)).toEqual(before);
    const fp = new Freeplay({ kind: 'quickReview' }, deps(w));
    const first = fp.next()!;
    const node = first.key.split(':').slice(2, -1).join(':');
    expect(node).toBe(w.learner.due(w.now())[0].node);
    const dueBefore = w.learner.card(node, 'receptive')!.due;
    fp.answer({ correct: true, tries: 1, ms: 900 });
    const ev = w.learner.events().filter((e) => e.op === 'quick');
    expect(ev).toHaveLength(1);
    expect(ev[0].scored).toBe('review');
    expect(ev[0].grade).toBe(3);
    expect(w.learner.card(node, 'receptive')!.due).toBeGreaterThan(dueBefore);
    expect(fp.right).toBe(1);
  });

  it('a retry is Hard, a miss is Again', async () => {
    const w = await seeded();
    w.clock.t += 6 * DAY;
    const fp = new Freeplay({ kind: 'quickReview' }, deps(w));
    fp.next(); fp.answer({ correct: true, tries: 2, ms: 1 });
    fp.next(); fp.answer({ correct: false, tries: 2, ms: 1 });
    const g = w.learner.events().filter((e) => e.op === 'quick').map((e) => e.grade);
    expect(g).toEqual([2, 1]);
    expect(fp.right).toBe(0);
  });
});

describe('verb workout', () => {
  it('checks the right form strictly and logs grind exposure only', async () => {
    const w = await world();
    const { learner } = w;
    learner.introduce('l:comer', { results: [true, true, true] });
    learner.introduce('g:preterite-ar', { results: [true, true, true] });
    expect(verbsMet(learner)).toEqual(['comer']);
    expect(taughtTenses(learner)).toEqual(['presente', 'preterito']);
    const cardBefore = JSON.stringify([learner.card('l:comer', 'receptive'), learner.card('g:preterite-ar', 'receptive')]);
    const dueBefore = learner.due(w.now() + 30 * DAY).length;

    const fp = new Freeplay({ kind: 'conjugate', verbs: ['comer'], tenses: ['preterito'] }, deps(w));
    const c = fp.next()!;
    expect(c.type).toBe('type');
    if (c.type !== 'type') return;
    const right = c.check('zzz').answer;
    expect(c.check(right).pass).toBe(true);
    // accents are strict
    const comi = conjugationCard('k', verbByInf('comer')!, 'preterito', 0);
    expect(comi.check('comi').pass).toBe(false);
    expect(comi.check('comi').near).toBe(true);
    expect(comi.check('comí').pass).toBe(true);
    expect(comi.prompt!.text).toBe('(comer, yo, the past)');

    fp.answer({ correct: true, tries: 1, ms: 800 });
    const ev = learner.events().filter((e) => e.op === 'grind');
    expect(ev.length).toBeGreaterThan(0);
    expect(ev.every((e) => e.scored === 'exposure')).toBe(true);
    expect(learner.events().filter((e) => e.scored === 'review')).toEqual([]);
    expect(JSON.stringify([learner.card('l:comer', 'receptive'), learner.card('g:preterite-ar', 'receptive')])).toBe(cardBefore);
    expect(learner.due(w.now() + 30 * DAY).length).toBe(dueBefore);
  });

  it('keys a personal best by verbs and tenses, and old ui documents load with bests', () => {
    expect(bestKey({ kind: 'conjugate', verbs: ['ir', 'comer'], tenses: ['preterito'] })).toBe(bestKey({ kind: 'conjugate', verbs: ['comer', 'ir'], tenses: ['preterito'] }));
    const old: any = { ...emptyUi('abc'), version: 2 };
    delete old.bests;
    expect(migrateUi(old).bests).toEqual({});
  });
});

describe('translation grind', () => {
  it('only serves sentences whose requires are known, and logs grind exposure', async () => {
    const w = await seeded();
    const fp = new Freeplay({ kind: 'translate' }, deps(w));
    let n = 0;
    let c;
    while ((c = fp.next()) && n < 40) {
      n++;
      const id = c.key.replace(/^grind:\d+:/, '');
      const ref = w.bundle.index.sentences.get(id)!;
      expect(ref.requires.every((r) => w.learner.isIntroduced(r))).toBe(true);
      fp.answer(answer(c, 'right'));
    }
    expect(n).toBeGreaterThan(0);
    const ev = w.learner.events().filter((e) => e.op === 'grind');
    expect(ev.length).toBeGreaterThan(0);
    expect(ev.every((e) => e.scored === 'exposure')).toBe(true);
    expect(w.learner.events().filter((e) => e.scored === 'review')).toEqual([]);
  });

  it('serves nothing when nothing is known', async () => {
    const w = await world();
    expect(new Freeplay({ kind: 'translate' }, deps(w)).next()).toBeUndefined();
  });
});

describe('nodes drill', () => {
  it('serves items in rung order and steps the ladder', async () => {
    const w = await seeded();
    const node = 'g:ser-identity';
    expect(w.learner.rung(node)).toBe(0);
    const fp = new Freeplay({ kind: 'nodes', nodes: [node] }, deps(w));
    const ops: string[] = [];
    let c;
    while ((c = fp.next())) {
      ops.push(fp.lastOp!);
      fp.answer(answer(c, 'right'));
    }
    expect(ops).toEqual(['choose', 'choose', 'type']);
    expect(w.learner.rung(node)).toBe(1);
    const ev = w.learner.events().filter((e) => e.op === 'train');
    expect(ev.length).toBeGreaterThan(0);
    expect(ev.every((e) => e.scored === 'exposure')).toBe(true);
  });

  it('a miss drops the rung', async () => {
    const w = await seeded();
    const node = 'g:ser-identity';
    w.learner.stepRung(node, 'pass'); w.learner.stepRung(node, 'pass');
    expect(w.learner.rung(node)).toBe(1);
    const fp = new Freeplay({ kind: 'nodes', nodes: [node] }, deps(w));
    const c = fp.next()!;
    expect(fp.lastOp).toBe('type');
    fp.answer(answer(c, 'wrong'));
    expect(w.learner.rung(node)).toBe(0);
    void answerFor;
  });
});

describe('nodes drill beyond the loaded window', () => {
  it('has no sentences for an early node until ensureUnits brings the unit in', async () => {
    const { ContentLoader } = await import('../../src/ui/data/loader');
    const early = await new ContentLoader().load({ unit: 0 });
    const ref = [...early.index.sentences.values()].find((s) => s.unit === 'u01' && s.targets.length && s.requires.length);
    expect(ref).toBeTruthy();
    const node = ref!.targets[0];
    const late = await new ContentLoader().load({ unit: 30 });
    const w = await world();
    const learner = w.learner;
    for (const r of new Set([node, ...ref!.requires])) if (!learner.isIntroduced(r)) learner.introduce(r, { at: w.clock.t, results: [true, true, true] });
    const mk = () => new Freeplay({ kind: 'nodes', nodes: [node] }, { learner, bundle: late, now: w.now, rng: rng('w') });
    const count = (fp: Freeplay) => { let n = 0; while (fp.next()) { n++; fp.answer({ correct: true, tries: 1, ms: 500 }); } return n; };
    expect(count(mk())).toBe(0);
    expect(await late.ensureUnits({ to: 30 })).toBe(true);
    expect(count(mk())).toBeGreaterThan(0);
  }, 120_000);
});
