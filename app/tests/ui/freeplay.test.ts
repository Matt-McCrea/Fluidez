import { describe, expect, it } from 'vitest';
import { verbByInf } from '../../src/engine';
import { rng } from '../../src/exercises/rng';
import { knownSet } from '../../src/compiler';
import { Freeplay, bestKey, conjugationCard, taughtTenses, verbsMet } from '../../src/ui/session/freeplay';
import { emptyUi, migrateUi } from '../../src/ui/store/ui';
import { Learner, MemoryStore } from '../../src/learner';
import { ContentLoader } from '../../src/ui/data/loader';
import { applyPlacement } from '../../src/ui/session/placement';
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
    expect(fp.retried).toBe(1);
    expect(fp.answered).toBe(2);
  });

  it('a card shown but not answered is not counted', async () => {
    const w = await seeded();
    w.clock.t += 6 * DAY;
    const fp = new Freeplay({ kind: 'quickReview' }, deps(w));
    fp.next();
    expect(fp.answered).toBe(0);
    expect(fp.retried).toBe(0);
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

describe('a miss belongs to the node being trained', () => {
  // "Preterite, missed 15 of 15" with every preterite right: a workout's miss was logged against
  // every node the sentence needed, and Weak spots counts those events
  it('a nodes drill grades the target and only counts the words around it as seen', async () => {
    const bundle = await new ContentLoader().load({ band: 'A1' });
    const t = new Date(2026, 9, 1, 18).getTime();
    const learner = await Learner.open(new MemoryStore(), { now: () => t });
    applyPlacement(learner, bundle, 8, t);
    const ix = bundle.index;
    // a grammar node the learner has met, whose practice sentences lean on other nodes they have met
    const lean = (id: string, node: string) => ix.sentences.get(id)!.requires.filter((r) => r !== node && learner.isIntroduced(r));
    const node = [...ix.byTarget.keys()].find((n) => /^g:/.test(n) && learner.isIntroduced(n) && (ix.byTarget.get(n) ?? []).some((id) => lean(id, n).length >= 2))!;
    expect(node).toBeTruthy();
    const around = [...new Set((ix.byTarget.get(node) ?? []).flatMap((id) => lean(id, node)))];
    const seen = (n: string) => learner.node(n)?.exposures ?? 0;
    const before = around.map(seen);
    const fp = new Freeplay({ kind: 'nodes', nodes: [node] }, { learner, bundle, now: () => t, rng: rng('miss') });
    let c;
    while ((c = fp.next())) fp.answer({ correct: false, tries: 2, ms: 1000 });
    const ev = learner.events().filter((e) => e.op === 'train');
    expect(ev.length).toBeGreaterThan(0);
    expect([...new Set(ev.map((e) => e.node))]).toEqual([node]);
    expect(ev.every((e) => e.grade === 1)).toBe(true);
    // the words around it were still seen
    expect(around.map(seen).some((n, i) => n > before[i])).toBe(true);
  }, 60_000);

  it('a checkpoint charges the node it asked about, not the words around it', async () => {
    const bundle = await new ContentLoader().load({ band: 'A1' });
    const t = 1_700_000_000_000;
    const learner = await Learner.open(new MemoryStore(), { now: () => t });
    applyPlacement(learner, bundle, 2, t);
    const fp = new Freeplay({ kind: 'checkpoint' }, { learner, bundle, now: () => t, rng: rng('cp'), finished: 2 });
    let c;
    while ((c = fp.next())) fp.answer({ correct: false, tries: 2, ms: 1000 });
    const ev = learner.events().filter((e) => e.op === 'checkpoint');
    expect(ev.length).toBeGreaterThan(0);
    // one event per card, and it is for a grammar or pattern node the checkpoint chose
    expect(ev.length).toBe(fp.answered);
    expect(ev.every((e) => /^[gp]:/.test(e.node))).toBe(true);
  }, 60_000);
});

describe('the translation grind', () => {
  it('charges the sentence it asked about to one node, and counts the rest as seen', async () => {
    const bundle = await new ContentLoader().load({ band: 'A1' });
    const t = new Date(2026, 9, 1, 18).getTime();
    const learner = await Learner.open(new MemoryStore(), { now: () => t });
    applyPlacement(learner, bundle, 8, t);
    const fp = new Freeplay({ kind: 'translate' }, { learner, bundle, now: () => t, rng: rng('grind') });
    const seen = () => learner.nodes().reduce((n, id) => n + (learner.node(id)?.exposures ?? 0), 0);
    const before = seen();
    let cards = 0;
    while (fp.next() && cards < 12) { fp.answer({ correct: false, tries: 2, ms: 1000 }); cards++; }
    const ev = learner.events().filter((e) => e.op === 'grind');
    expect(cards).toBe(12);
    expect(ev.length).toBeLessThanOrEqual(cards);
    expect(seen() - before).toBeGreaterThan(cards);
  }, 60_000);
});

describe('Train it with nothing to practise', () => {
  it('names the week of a node whose unit is not loaded, instead of saying it has no sentences', async () => {
    const bundle = await new ContentLoader().load({ unit: 0 });
    const t = new Date(2026, 9, 1, 18).getTime();
    const learner = await Learner.open(new MemoryStore(), { now: () => t });
    const node = [...bundle.course.teachPos.keys()].find((n) => n.startsWith('g:') && !bundle.index.byTarget.has(n) && !bundle.index.byRequire.has(n) && bundle.course.teachPos.get(n)! > bundle.course.unitStart[20])!;
    expect(node).toBeTruthy();
    const fp = new Freeplay({ kind: 'nodes', nodes: [node] }, { learner, bundle, now: () => t, rng: rng('x') });
    expect(fp.next()).toBeUndefined();
    const week = Number(fp.emptyReason?.match(/week (\d+)\.$/)?.[1] ?? 0);
    expect(week, fp.emptyReason).toBeGreaterThan(20);
    expect(week).toBeLessThanOrEqual(bundle.course.units.length);
  }, 60_000);


  it('names a week of the course, never a priority number', async () => {
    const bundle = await new ContentLoader().load({ band: 'A1' });
    const t = new Date(2026, 9, 1, 18).getTime();
    const learner = await Learner.open(new MemoryStore(), { now: () => t });
    applyPlacement(learner, bundle, 1, t);
    const ix = bundle.index;
    const known = knownSet(learner, bundle.course);
    const gated = [...ix.byTarget.keys()].filter((n) => n.startsWith('g:') && !known.has(n)
      && [...(ix.byTarget.get(n) ?? []), ...(ix.byRequire.get(n) ?? [])].every((id) => ix.sentences.get(id)!.requires.some((r) => r.startsWith('g:') && !known.has(r) && r !== n)));
    expect(gated.length).toBeGreaterThan(5);
    for (const node of gated.slice(0, 40)) {
      const fp = new Freeplay({ kind: 'nodes', nodes: [node] }, { learner, bundle, now: () => t, rng: rng('x') });
      const week = Number(fp.emptyReason?.match(/week (\d+)\.$/)?.[1] ?? 0);
      expect(week, `${node}: ${fp.emptyReason}`).toBeGreaterThan(1);
      expect(week, node).toBeLessThanOrEqual(bundle.course.units.length);
    }
  }, 60_000);

  it('does not promise a week to a node no sentence can practise', async () => {
    const bundle = await new ContentLoader().load({ band: 'A1' });
    const t = new Date(2026, 9, 1, 18).getTime();
    const learner = await Learner.open(new MemoryStore(), { now: () => t });
    applyPlacement(learner, bundle, 30, t);
    // a can-do is no sentence's to practise: no row requires one, and no unit day teaches it
    const node = [...bundle.course.nodes.values()].find((n) => n.kind === 'cando' && !bundle.index.byTarget.has(n.id) && !bundle.index.byRequire.has(n.id) && !bundle.course.teachPos.has(n.id));
    expect(node).toBeTruthy();
    const fp = new Freeplay({ kind: 'nodes', nodes: [node!.id] }, { learner, bundle, now: () => t, rng: rng('x') });
    expect(fp.next()).toBeUndefined();
    expect(fp.emptyReason).toBeTruthy();
    expect(fp.emptyReason).not.toMatch(/week/);
  }, 60_000);
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

describe('practise this, on real content', () => {
  const place = async (unit: number) => {
    const bundle = await new ContentLoader().load({ band: 'A1' });
    const t = new Date(2026, 9, 1, 18).getTime();
    const learner = await Learner.open(new MemoryStore(), { now: () => t });
    applyPlacement(learner, bundle, unit, t);
    return { bundle, learner, t };
  };
  const cards = (fp: Freeplay) => { let n = 0; while (fp.next()) { fp.answer({ correct: true, tries: 1, ms: 1000 }); n++; } return n; };

  it('words and grammar a learner has met give at least 3 cards', async () => {
    const { bundle, learner, t } = await place(2);
    for (const node of ['l:tener', 'l:hacer', 'g:gustar-basic']) {
      if (!learner.isIntroduced(node)) continue;
      const fp = new Freeplay({ kind: 'nodes', nodes: [node] }, { learner, bundle, now: () => t, rng: rng(node) });
      expect(fp.emptyReason, node).toBeUndefined();
      expect(cards(fp), node).toBeGreaterThanOrEqual(3);
    }
    expect(learner.isIntroduced('l:tener') || learner.isIntroduced('l:hacer')).toBe(true);
  }, 60_000);

  it('says when the examples are beyond reach, and names the week', async () => {
    const { bundle, learner, t } = await place(1);
    const ix = bundle.index;
    const known = knownSet(learner, bundle.course);
    // a grammar node the learner has not met whose sentences all need an unmet grammar node
    const node = [...ix.byTarget.keys()].find((n) => n.startsWith('g:') && !known.has(n)
      && [...(ix.byTarget.get(n) ?? []), ...(ix.byRequire.get(n) ?? [])].every((id) => ix.sentences.get(id)!.requires.some((r) => r.startsWith('g:') && !known.has(r) && r !== n)));
    expect(node).toBeTruthy();
    const fp = new Freeplay({ kind: 'nodes', nodes: [node!] }, { learner, bundle, now: () => t, rng: rng('x') });
    expect(fp.next()).toBeUndefined();
    expect(fp.emptyReason).toMatch(/^The examples for this use things you have not met yet\. It comes up in week \d+\.$/);
  }, 60_000);
});

describe('checkpoint', () => {
  it('mixes finished units, ops, and tallies per unit', async () => {
    const bundle = await new ContentLoader().load({ band: 'A1' });
    const t = 1_700_000_000_000;
    const learner = await Learner.open(new MemoryStore(), { now: () => t });
    applyPlacement(learner, bundle, 2, t);
    const fp = new Freeplay({ kind: 'checkpoint' }, { learner, bundle, now: () => t, rng: rng('cp'), finished: 2 });
    expect(fp.total).toBeGreaterThan(0);
    expect(fp.total).toBeLessThanOrEqual(20);
    const ops = new Set<string>();
    let n = 0;
    let c;
    while ((c = fp.next())) { ops.add(fp.lastOp!); fp.answer({ correct: n % 3 !== 0, tries: 1, ms: 1000 }); n++; }
    expect(n).toBe(fp.total);
    expect(ops.size).toBeGreaterThan(1);
    expect([...fp.byUnit.keys()].sort()).toEqual(bundle.course.units.slice(0, 2).map((u) => u.id));
    expect([...fp.byUnit.values()].reduce((a, r) => a + r.total, 0)).toBe(fp.answered);
    expect(fp.missed.size).toBeGreaterThan(0);
    expect(learner.events().some((e) => e.op === 'checkpoint')).toBe(true);
  }, 60_000);
});
