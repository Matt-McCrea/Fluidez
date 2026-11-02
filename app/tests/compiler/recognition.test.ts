// A node that is recognition only (voseo, the future subjunctive, ...) is taught receptive-only and practised by reading, never
// by typing (LC1-004, LC1-005): no production card, and no drill block that asks the learner to say it.
import { describe, expect, test } from 'vitest';
import { advancePath, buildContentIndex, buildCourse, compileSession, initialPath, servedRefs, type PathState, type SessionPlan } from '../../src/compiler';
import type { BankSentence, GraphNode, Unit } from '../../src/content/schema';
import { Learner } from '../../src/learner';
import { syntheticCorpus } from '../../tools/sim/synthetic';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

/** The synthetic course with its first grammar point marked "Recognition only", walked until it has been taught and drilled. */
function walkIt(recognition: boolean) {
  const c = syntheticCorpus({ maxUnits: 3, seed: 4 });
  const g = c.units[0].days.find((d) => d.type === 'introduce')!.focus[0];
  if (recognition) Object.assign(c.nodes.find((n) => n.id === g)!, { note: 'Recognition only (legal texts, proverbs).' });
  const course = buildCourse(c.units, c.nodes);
  const content = buildContentIndex(c.source, course);
  let t = T0;
  const L = Learner.fresh({ now: () => t });
  let path: PathState = initialPath();
  const plans: SessionPlan[] = [];
  for (let d = 0; d < 16; d++) {
    t = T0 + d * DAY;
    const plan = compileSession({ learnerId: 'rec', learner: L, path, course, content, now: t });
    plans.push(plan);
    L.startSession(t);
    for (const n of Object.values(plan.newNodes).flat()) L.introduce(n, { results: [true, true, true], at: t, productive: !plan.receptiveOnly.includes(n) });
    for (const r of servedRefs(plan)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: t });
    for (const b of plan.blocks) if (b.kind === 'warmup') for (const it of b.items) if (L.hasCard(it.node, it.direction)) L.review(it.node, it.direction, 3, { at: t });
    path = advancePath(path, plan, true);
  }
  return { g, L, plans };
}

describe('a recognition-only grammar point', () => {
  test('is introduced receptive-only and gets no production card', () => {
    const { g, L, plans } = walkIt(true);
    const intro = plans.find((p) => p.newNodes.grammar.includes(g))!;
    expect(intro.receptiveOnly).toContain(g);
    expect(L.hasCard(g, 'receptive')).toBe(true);
    expect(L.hasCard(g, 'productive')).toBe(false);
    const { L: other } = walkIt(false);
    expect(other.hasCard(g, 'receptive')).toBe(true);
  });

  test('is drilled by reading: picks, and no block that asks for it typed, no talk about you, no freer writing', () => {
    const { g, plans } = walkIt(true);
    const drill = plans.find((p) => p.blocks.some((b) => b.kind === 'ruleRecall' && b.node === g))!;
    expect(drill).toBeDefined();
    const kinds = drill.blocks.map((b) => b.kind);
    expect(kinds).toContain('structuredInput');
    expect(kinds).not.toContain('controlledOutput');
    expect(kinds).not.toContain('communicative');
    expect(drill.blocks.some((b) => b.kind === 'writing' && b.purpose === 'freer')).toBe(false);
    for (const b of drill.blocks) if ('items' in b && b.kind !== 'learn' && b.kind !== 'teach' && b.kind !== 'warmup') {
      for (const it of b.items as Array<{ op: string; node: string }>) if (it.node === g) expect(['pick', 'comprehend', 'read'], `${it.op} on ${g}`).toContain(it.op);
    }
    // the same point, not marked, is drilled as ever
    const normal = walkIt(false);
    expect(normal.plans.find((p) => p.blocks.some((b) => b.kind === 'ruleRecall' && b.node === normal.g))!.blocks.map((b) => b.kind)).toContain('controlledOutput');
  });

  test('is not typed in a remix or a back-to-these run either', () => {
    const { g, plans } = walkIt(true);
    for (const p of plans) for (const b of p.blocks) {
      if (b.kind === 'remix' || (b.kind === 'controlledOutput' && b.remedial)) for (const it of b.items) expect(it.node, `${b.kind} on ${g}`).not.toBe(g);
    }
  });
});

describe('a row that needs a recognition-only form, whichever node a card is about', () => {
  const node = (id: string, kind: GraphNode['kind'], extra: Partial<GraphNode> = {}) =>
    ({ id, kind, band: 'A1', priority: 0, title: id, requires: [], contrasts: [], serves: [], pcic: [], placement: 'pcic', sources: [], variety: 'neutral', ...extra }) as GraphNode;
  const row = (id: string, requires: string[]) => ({ id, es: `frase ${id}.`, en: id, accept: [], acceptEn: [], requires, lexemes: [], targets: requires.slice(0, 1), unit: 'u01', source: 'gen' }) as BankSentence;

  /** A learner who has l:a and the -se forms, both due, and two rows for l:a: the only unseen one but for `plain` is in the -se form. */
  function due(plain: boolean) {
    const g = 'g:se-form-recognition';
    const units: Unit[] = [{ id: 'u01', band: 'A1', title: 'u', theme: 't', canDo: 'c', storyArc: 'a', days: [{ type: 'review', focus: [], chunks: [], lexemes: [] }] } as Unit];
    const course = buildCourse(units, [node('l:a', 'lexeme'), node(g, 'grammar')]);
    const content = buildContentIndex({ sentences: [row('s-se', ['l:a', g]), ...(plain ? [row('s-plain', ['l:a'])] : [])], chapters: [], scenes: [], writing: [], scripts: [] }, course);
    let t = T0;
    const L = Learner.fresh({ now: () => t });
    L.seedKnown('l:a', { at: T0, productive: true, receptive: { stability: 3, dueAt: T0 + DAY }, productiveCard: { stability: 3, dueAt: T0 + DAY } });
    L.seedKnown(g, { at: T0, productive: false, receptive: { stability: 30, dueAt: T0 + 90 * DAY } });
    t = T0 + DAY + 3_600_000;
    return { content, plan: compileSession({ learnerId: 'rec', learner: L, path: initialPath(), course, content, now: t }) };
  }
  const warmItem = (p: SessionPlan) => { const w = p.blocks[0]; if (w.kind !== 'warmup') throw new Error('warm-up first'); return w.items.find((i) => i.node === 'l:a')!; };

  test('the index marks it, and only it', () => {
    const { content } = due(true);
    expect(content.sentences.get('s-se')!.readOnly).toBe(true);
    expect(content.sentences.get('s-plain')!.readOnly).toBeUndefined();
  });

  test('a productive review of another node takes another row', () => {
    const it = warmItem(due(true).plan);
    expect(it.direction).toBe('productive');
    expect(it.sentence).toBe('s-plain');
  });

  test('with no other row it goes without a sentence: the learner is not asked to type a form the course does not want said', () => {
    const it = warmItem(due(false).plan);
    expect(it.direction).toBe('productive');
    expect(it.sentence).toBeUndefined();
  });
});

describe('the day a recognition-only point is taught', () => {
  test('no "say something true": it is not said about yourself, any more than it is drilled that way', () => {
    const intro = (recognition: boolean) => { const { g, plans } = walkIt(recognition); return plans.find((p) => p.newNodes.grammar.includes(g))!.blocks.map((b) => b.kind); };
    expect(intro(true)).not.toContain('personal');
    expect(intro(false)).toContain('personal');
  });
});
