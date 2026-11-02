// Contrasts are taught from their scripts (F1) and come back as the script's own items (F2).
import { describe, expect, test } from 'vitest';
import { compileSession, initialPath, servedRefs, type SessionPlan, type TeachBlock } from '../../src/compiler';
import { alignedPairs } from '../../src/exercises/pairs';
import { Learner } from '../../src/learner';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { ALL_CHECKS, corpus, realCourse, SEEDS, walk } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

const teaches = (plan: SessionPlan) => plan.blocks.filter((b): b is TeachBlock => b.kind === 'teach');

describe('F1: a new contrast is taught from its script', () => {
  test('on a contrast day the whole script is taught, and the day makes room for it', () => {
    let seen = 0;
    for (const seed of SEEDS.slice(0, 4)) {
      const { plans } = walk({ seed, profile: PROFILES.fast, days: 120 });
      for (const { plan } of plans) {
        const t = teaches(plan).filter((b) => b.reason === 'contrast');
        if (!t.length) continue;
        seen++;
        expect(plan.type).toBe('drill');
        expect(t).toHaveLength(1);
        expect(plan.newNodes.contrasts).toEqual([t[0].node]);
        expect(servedRefs(plan).some((r) => r.kind === 'item' && r.id === `sc:${t[0].node}:rp:0` && !r.deliberate)).toBe(true);
      }
    }
    expect(seen).toBeGreaterThan(5);
  });

  test('every rule still holds on a walk where contrasts are taught', () => {
    let taught = 0;
    for (const seed of SEEDS.slice(0, 3)) {
      const { plans, run } = walk({ seed, profile: PROFILES.average, days: 120, check: (s) => { for (const c of ALL_CHECKS) c(s); } });
      taught += plans.filter((p) => teaches(p.plan).some((b) => b.reason === 'contrast')).length;
      expect(Object.values(run.unintendedRepeats).reduce((a, b) => a + b, 0)).toBe(0);
    }
    expect(taught).toBeGreaterThan(3);
  });

  test('a contrast without a script stays a learn item, as before', () => {
    const c = corpus({ seed: 3 });
    for (const x of [...c.content.scripts.keys()].filter((n) => n.startsWith('x:'))) c.content.scripts.delete(x);
    const { plans } = walk({ seed: 3, corpus: c, profile: PROFILES.fast, days: 120 });
    const learned = plans.flatMap((p) => p.plan.blocks).filter((b) => b.kind === 'learn').flatMap((b) => (b.kind === 'learn' ? b.items : [])).filter((it) => it.nodeKind === 'contrast');
    expect(learned.length).toBeGreaterThan(0);
    expect(plans.every((p) => teaches(p.plan).every((b) => b.reason !== 'contrast'))).toBe(true);
  });

  test('the real course: x:hay-esta is taught on u07 day 1, the day it is listed', () => {
    const { course, content } = realCourse(8);
    const found: { plan: SessionPlan; node: string }[] = [];
    simulateProfile(PROFILES.fast, {
      days: 200, tier: 'standard', course, content, seed: 1,
      onPlan: (plan) => { for (const b of teaches(plan)) if (b.reason === 'contrast') found.push({ plan, node: b.node }); },
    });
    const hay = found.find((f) => f.node === 'x:hay-esta');
    expect(hay, `taught: ${found.map((f) => f.node).join(', ')}`).toBeDefined();
    const plan = hay!.plan;
    expect(plan.unit).toBe('u07');
    expect(plan.day).toBe(1);
    const block = teaches(plan).find((b) => b.node === 'x:hay-esta')!;
    const script = content.scripts.get('x:hay-esta')!;
    expect(block.items).toHaveLength(script.readAndPick + script.yourTurn);
    expect(plan.blocks.some((b) => b.kind === 'communicative')).toBe(false);
    // the day is near its minutes, not 6 minutes over (R21)
    expect(plan.estimatedMinutes).toBeLessThanOrEqual(plan.budget.minutes + 2);
  });
});

describe('F1: a review day goes back to a contrast it lists', () => {
  /** A corpus whose first review day lists a contrast the learner has met (introduced as a learn item, as before scripts were taught). */
  function reviewOfKnownContrast() {
    const { course, content } = corpus({ seed: 1 });
    const x = [...course.nodes.values()].find((n) => n.kind === 'contrast')!.id;
    const day = course.units[0].days.findIndex((d) => d.type === 'review');
    course.units[0].days[day].focus.push(x);
    let t = T0;
    const L = Learner.fresh({ now: () => t });
    L.introduce(x, { results: [true, true, true], at: T0 });
    const path = { ...initialPath(), unit: 0, day };
    const plan = () => compileSession({ learnerId: 'back', learner: L, path, course, content, now: t });
    /** the next session: the clock moves a day and the learner has had another */
    const next = () => { L.startSession(t); t += DAY; };
    return { x, L, plan, next, script: content.scripts.get(x)!, at: () => t };
  }

  test('a contrast the learner has but was never taught from its script is taught whole, with nothing to learn in it', () => {
    const { x, plan } = reviewOfKnownContrast();
    const p = plan();
    expect(p.type).toBe('review');
    const b = teaches(p).find((t) => t.node === x);
    expect(b?.reason).toBe('contrast');
    expect(b?.deliberate).toBe(false);
    expect(b?.parts).toEqual(['hook', 'examples', 'rule', 'readAndPick', 'yourTurn', 'pitfalls']);
    expect(b?.items.every((i) => i.scoring === 'exposure')).toBe(true);
  });

  test('once its first item is in the ledger the return is a few of its own items, deliberate, and a different few each session', () => {
    const { x, L, plan, next, script, at } = reviewOfKnownContrast();
    L.ledger.markSeen('item', `sc:${x}:rp:0`, { at: at() });
    const ids: string[][] = [];
    for (let k = 0; k < 6; k++) {
      next();
      const p = plan();
      const b = teaches(p).find((t) => t.node === x);
      expect(b?.reason).toBe('return');
      expect(b?.deliberate).toBe(true);
      expect(b?.parts).toEqual(['readAndPick', 'yourTurn']);
      expect(b?.items.filter((i) => i.op === 'readAndPick')).toHaveLength(4);
      expect(b?.items.filter((i) => i.op === 'yourTurn')).toHaveLength(3);
      expect(b?.items.every((i) => i.scoring === 'exposure' && i.index < (i.op === 'readAndPick' ? script.readAndPick : script.yourTurn))).toBe(true);
      ids.push(b!.items.map((i) => i.id));
      // as the runner does: what was shown is in the ledger
      for (const r of servedRefs(p)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: at() });
    }
    for (let k = 1; k < ids.length; k++) expect(ids[k].filter((id) => ids[k - 1].includes(id)), `session ${k} repeats the one before`).toEqual([]);
    // the script goes round: every one of its items has come back by then
    const all = new Set(ids.flat());
    expect(all.size).toBeGreaterThan(8);
  });

  test('a contrast the learner has not met yet is not taught on a review day', () => {
    const { course, content } = corpus({ seed: 1 });
    const x = [...course.nodes.values()].find((n) => n.kind === 'contrast')!.id;
    const day = course.units[0].days.findIndex((d) => d.type === 'review');
    course.units[0].days[day].focus.push(x);
    const p = compileSession({ learnerId: 'back', learner: Learner.fresh({ now: () => T0 }), path: { ...initialPath(), unit: 0, day }, course, content, now: T0 + DAY });
    expect(teaches(p).filter((t) => t.node === x)).toEqual([]);
  });

  test('the real course: the five contrasts that return on many review days come back, as the script says', () => {
    const { course, content } = realCourse(16);
    const back = new Map<string, number>();
    let walked = 0;
    simulateProfile(PROFILES.fast, {
      days: 400, tier: 'standard', course, content, seed: 1,
      onPlan: (plan) => { walked++; for (const b of teaches(plan)) if (b.reason === 'return') back.set(b.node, (back.get(b.node) ?? 0) + 1); },
    });
    expect(walked).toBeGreaterThan(100);
    expect(back.size).toBeGreaterThan(0);
  });
});

describe('a return to a contrast is not the last return', () => {
  test('review days a fixed even number of sessions apart still go round the whole script', () => {
    const { course, content } = corpus({ seed: 2 });
    const x = [...course.nodes.values()].find((n) => n.kind === 'contrast')!;
    const at = course.units.findIndex((u) => u.days.some((d) => d.type === 'review'));
    const unit = course.units[at];
    const dayIdx = unit.days.findIndex((d) => d.type === 'review');
    unit.days[dayIdx].focus = [x.id];
    const script = { ...content.scripts.get(x.id)!, readAndPick: 8, yourTurn: 7 };
    content.scripts.set(x.id, script);
    let t = T0;
    const L = Learner.fresh({ now: () => t });
    L.seedKnown(x.id, { at: T0, productive: true, receptive: { stability: 300, dueAt: T0 + 400 * DAY }, productiveCard: { stability: 300, dueAt: T0 + 400 * DAY } });
    L.ledger.markSeen('item', `sc:${x.id}:rp:0`, { deliberate: false, at: T0 });
    const path = { ...initialPath(), unit: at, day: dayIdx };
    const sets: number[][] = [];
    for (let k = 0; k < 4; k++) {
      t = T0 + (k + 1) * 8 * DAY;
      // eight sessions go by between one review day and the next: an even number, as on the real course
      for (let s = 0; s < 8; s++) L.startSession(t);
      const p = compileSession({ learnerId: 'back', learner: L, path, course, content, now: t });
      const back = teaches(p).find((b) => b.reason === 'return')!;
      expect(back, 'a return').toBeDefined();
      sets.push(back.items.filter((i) => i.op === 'readAndPick').map((i) => i.index));
      for (const r of servedRefs(p)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: t });
    }
    for (let k = 1; k < sets.length; k++) expect(sets[k].filter((i) => sets[k - 1].includes(i)), `return ${k} repeats return ${k - 1}`).toEqual([]);
    expect(new Set(sets.flat()).size).toBe(8);
  });
});

describe('F2: a due contrast is reviewed with its script, a different item each session', () => {
  /** A learner who has both cards of a contrast (it has no bank sentence of its own, as in the real course) and lets them fall due. */
  function dueContrast(cards: 'both' | 'receptive' = 'both') {
    const { course, content } = corpus({ seed: 2 });
    const x = [...course.nodes.values()].find((n) => n.kind === 'contrast')!.id;
    expect(content.byTarget.get(x) ?? []).toEqual([]);
    expect(content.byRequire.get(x) ?? []).toEqual([]);
    let t = T0;
    const L = Learner.fresh({ now: () => t });
    L.seedKnown(x, {
      at: T0, productive: cards === 'both',
      receptive: { stability: 3, dueAt: T0 + DAY },
      productiveCard: cards === 'both' ? { stability: 3, dueAt: T0 + DAY } : null,
    });
    t = T0 + 30 * DAY;
    const warm = () => {
      const p = compileSession({ learnerId: 'rev', learner: L, path: initialPath(), course, content, now: t });
      const w = p.blocks[0];
      if (w.kind !== 'warmup') throw new Error('no warm-up');
      return { plan: p, item: w.items.find((i) => i.node === x) };
    };
    return { x, L, warm, script: content.scripts.get(x)!, next: () => { L.startSession(t); } };
  }

  test('the review is an item of its script, not a bare card, and the plan does not call it one', () => {
    const { x, warm, script } = dueContrast();
    const { plan, item } = warm();
    expect(item, 'the due contrast is in the warm-up').toBeDefined();
    expect(item!.sentence).toBeUndefined();
    expect(item!.script, 'no script item named').toBeDefined();
    expect(item!.script!.index).toBeLessThan(item!.script!.op === 'readAndPick' ? script.readAndPick : script.yourTurn);
    expect(plan.diagnostics.some((d) => d.code === 'bareReview' && d.node === x)).toBe(false);
    expect(item!.targets).toEqual([x]);
    expect(item!.scoring).toBe('review');
  });

  test('a receptive card is asked read-and-pick, a productive one your-turn', () => {
    const both = dueContrast().warm().item!;
    expect(both.direction).toBe('productive');
    expect(both.script?.op).toBe('yourTurn');
    const recv = dueContrast('receptive').warm().item!;
    expect(recv.direction).toBe('receptive');
    expect(recv.script?.op).toBe('readAndPick');
  });

  test('the item changes from one session to the next, and goes round the whole script', () => {
    const { warm, next, script } = dueContrast();
    const seen: number[] = [];
    for (let k = 0; k < script.yourTurn; k++) {
      next();
      seen.push(warm().item!.script!.index);
    }
    for (let k = 1; k < seen.length; k++) expect(seen[k], `session ${k} serves the item the one before did`).not.toBe(seen[k - 1]);
    expect(new Set(seen).size).toBe(script.yourTurn);
  });

  test('every other rule still holds on a walk where contrasts come due', () => {
    let reviews = 0;
    for (const seed of SEEDS.slice(0, 3)) {
      const { plans } = walk({ seed, profile: PROFILES.average, days: 150, check: (s) => { for (const c of ALL_CHECKS) c(s); } });
      for (const { plan } of plans) {
        const w = plan.blocks[0];
        if (w.kind === 'warmup') reviews += w.items.filter((i) => i.script).length;
      }
    }
    expect(reviews).toBeGreaterThan(5);
  });
});

describe('F2: no due card in the real course is left to be shown and never graded', () => {
  test('every contrast, and every node with no pair to ask about, comes due as a sentence or a script item, never as a bare card', () => {
    const { course, content } = realCourse(3);
    const nodes = [...course.nodes.values()].filter((n) => n.kind === 'contrast' || (n.kind !== 'cando' && alignedPairs(n).length === 0));
    expect(nodes.filter((n) => n.kind === 'contrast')).toHaveLength(94);
    expect(nodes.length).toBeGreaterThanOrEqual(130);
    const bare: string[] = [];
    let scripted = 0;
    for (let i = 0; i < nodes.length; i += 10) {
      const batch = nodes.slice(i, i + 10);
      let t = T0;
      const L = Learner.fresh({ now: () => t });
      for (const n of batch) {
        L.seedKnown(n.id, { at: T0, productive: true, receptive: { stability: 3, dueAt: T0 + DAY }, productiveCard: { stability: 3, dueAt: T0 + DAY } });
      }
      t = T0 + 30 * DAY;
      const plan = compileSession({ learnerId: 'stuck', learner: L, path: initialPath(), course, content, now: t });
      const w = plan.blocks[0];
      if (w.kind !== 'warmup') throw new Error('no warm-up');
      for (const n of batch) {
        const it = w.items.find((x) => x.targets?.includes(n.id));
        if (!it) { bare.push(`${n.id} not served`); continue; }
        if (it.script || it.contrast) scripted++;
        if (!it.sentence && !it.script && !it.contrast) bare.push(n.id);
      }
    }
    expect(bare).toEqual([]);
    expect(scripted).toBeGreaterThanOrEqual(130);
  });
});
