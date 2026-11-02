// Contrasts are taught from their scripts (F1) and come back as the script's own items (F2).
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  buildContentIndex, buildCourse, compileSession, initialPath, servedRefs,
  type ContentIndex, type Course, type SessionPlan, type TeachBlock,
} from '../../src/compiler';
import { BankSentence, GraphNode, Scene, StoryChapter, TeachingScript, Unit, WritingTask } from '../../src/content/schema';
import { Learner } from '../../src/learner';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { ALL_CHECKS, corpus, SEEDS, walk } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

const root = path.resolve(__dirname, '../../content');
const json = (rel: string) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const files = (d: string, keep: (name: string) => boolean) => fs.readdirSync(path.join(root, d)).filter((f) => f.endsWith('.json') && !f.startsWith('_') && keep(f)).sort().map((f) => json(`${d}/${f}`));

/** The shipped content of the first units, as the app's loader would hand it to the compiler. */
function realCourse(through: number): { course: Course; content: ContentIndex } {
  const ids = Array.from({ length: through }, (_, i) => `u${String(i + 1).padStart(2, '0')}`);
  const nodes = ['grammar', 'patterns', 'chunks', 'contrasts', 'candos', 'lexemes'].flatMap((f) => (json(`graph/${f}.json`) as unknown[]).map((n) => GraphNode.parse(n)));
  const units = ids.map((u) => Unit.parse(json(`units/${u}.json`)));
  const course = buildCourse(units, nodes);
  const mine = new Set(ids);
  const ofUnit = (f: string) => mine.has(f.slice(0, 3));
  const content = buildContentIndex({
    sentences: files('bank', ofUnit).flat().map((b) => BankSentence.parse(b)).filter((b) => b.unit && mine.has(b.unit)),
    chapters: files('story', () => true).map((c) => StoryChapter.parse(c)).filter((c) => mine.has(c.unit)),
    scenes: files('scenes', (f) => mine.has(f.slice(3, 6))).map((c) => Scene.parse(c)),
    writing: files('writing', ofUnit).flat().map((w) => WritingTask.parse(w)),
    scripts: files('scripts', () => true).map((x) => TeachingScript.parse(x)),
  }, course);
  return { course, content };
}

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
      const b = teaches(plan()).find((t) => t.node === x);
      expect(b?.reason).toBe('return');
      expect(b?.deliberate).toBe(true);
      expect(b?.parts).toEqual(['readAndPick', 'yourTurn']);
      expect(b?.items.filter((i) => i.op === 'readAndPick')).toHaveLength(4);
      expect(b?.items.filter((i) => i.op === 'yourTurn')).toHaveLength(3);
      expect(b?.items.every((i) => i.scoring === 'exposure' && i.index < (i.op === 'readAndPick' ? script.readAndPick : script.yourTurn))).toBe(true);
      ids.push(b!.items.map((i) => i.id));
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
