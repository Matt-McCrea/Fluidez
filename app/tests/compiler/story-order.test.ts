// The story's order comes from the library, which lists every chapter whether or not the tab has
// loaded it (audit C4, F8). A learner who started part way through the course is served a chapter
// at their level, not the first chapter of the story.
import { describe, expect, test } from 'vitest';
import {
  advancePath, buildContentIndex, buildCourse, compileSession, initialPath, servedRefs,
  type CompileInput, type PathState, type SessionPlan,
} from '../../src/compiler';
import { libraryOf } from '../../src/content/library';
import { Learner } from '../../src/learner';
import { syntheticCorpus } from '../../tools/sim/synthetic';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

const synth = syntheticCorpus({ maxUnits: 6, seed: 1 });
const course = buildCourse(synth.units, synth.nodes);
const library = libraryOf(synth.source.chapters).chapters;
/** The index the browser has: the story listed whole, only the chapters of the loaded window in hand. */
const withLibrary = (loaded: (unit: string) => boolean = () => true) =>
  buildContentIndex({ ...synth.source, chapters: synth.source.chapters.filter((c) => loaded(c.unit)), library }, course);
const withoutLibrary = buildContentIndex(synth.source, course);

/** A learner who has been through everything before `day` of unit index `at`: the one placement makes. */
function placedLearner(at: number, day: number, now = T0) {
  const L = Learner.fresh({ now: () => now });
  for (let u = 0; u <= at; u++) {
    for (const [i, d] of course.units[u].days.entries()) {
      if (u === at && i >= day) break;
      for (const n of [...d.focus, ...d.chunks, ...d.lexemes]) if (!L.isIntroduced(n)) L.introduce(n, { results: [true, true, true], at: now });
    }
  }
  return L;
}

const readsIn = (plan: SessionPlan) => plan.blocks.flatMap((b) => (b.kind === 'read' ? [b.chapter] : []));
const unitOfChapter = (id: string) => course.unitIndex.get(synth.source.chapters.find((c) => c.id === id)!.unit)!;
/** The first day of a unit that reads a chapter. */
const readDay = (unit: number) => course.units[unit].days.findIndex((d) => d.chapter && (d.type === 'input' || d.type === 'introduce'));

describe('a chapter at the learner\'s level', () => {
  const AT = 2;
  const day = readDay(AT);
  const path: PathState = { ...initialPath(), unit: AT, day, coreSessions: 20 };
  const input = (extra: Partial<CompileInput> = {}): CompileInput => ({
    learnerId: 'learner-a', learner: placedLearner(AT, day), path, course, content: withLibrary(), now: T0 + DAY, ...extra,
  });

  test('the unit has a day that reads a chapter', () => {
    expect(day).toBeGreaterThanOrEqual(0);
  });

  test('a learner placed at unit 3 starts the story where their unit does, not at the first chapter', () => {
    const plan = compileSession(input({ placedAt: AT }));
    const read = readsIn(plan);
    expect(read).toHaveLength(1);
    expect(unitOfChapter(read[0])).toBeGreaterThanOrEqual(AT);
  });

  test('the first chapter of the story would otherwise be the one served', () => {
    const plan = compileSession(input());
    expect(readsIn(plan)).toEqual([library[0].id]);
  });

  test('a catch-up on a review day does not go back to chapters before the learner\'s unit either', () => {
    const review = course.units[AT].days.findIndex((d) => d.type === 'review');
    expect(review).toBeGreaterThanOrEqual(0);
    const plan = compileSession(input({ path: { ...path, day: review }, learner: placedLearner(AT, review), placedAt: AT }));
    for (const id of readsIn(plan)) expect(unitOfChapter(id), id).toBeGreaterThanOrEqual(AT);
  });

  test('the chapters of the learner\'s own unit are served in order, one after the other', () => {
    const L = placedLearner(AT, day);
    let p = path;
    const served: string[] = [];
    for (let k = 0; k < 6; k++) {
      const plan = compileSession({ learnerId: 'learner-a', learner: L, path: p, course, content: withLibrary(), now: T0 + (k + 1) * DAY, placedAt: AT });
      L.startSession(T0 + (k + 1) * DAY);
      for (const n of Object.values(plan.newNodes).flat()) L.introduce(n, { results: [true, true, true], at: T0 + (k + 1) * DAY });
      for (const r of servedRefs(plan)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: T0 + (k + 1) * DAY });
      served.push(...readsIn(plan));
      p = advancePath(p, plan, true);
    }
    expect(served.length).toBeGreaterThan(0);
    expect(served).toEqual(served.slice().sort());
    for (const id of served) expect(unitOfChapter(id)).toBeGreaterThanOrEqual(AT);
  });
});

describe('a learner who started at the beginning is not changed by the library', () => {
  test('six sessions compile to the same plans with the story listed whole as with the chapters alone', () => {
    const plans = (content: ReturnType<typeof withLibrary>) => {
      const L = Learner.fresh({ now: () => T0 });
      let p = initialPath();
      const out: string[] = [];
      for (let k = 0; k < 6; k++) {
        const now = T0 + k * DAY;
        const plan = compileSession({ learnerId: 'learner-a', learner: L, path: p, course, content, now });
        L.startSession(now);
        for (const n of Object.values(plan.newNodes).flat()) L.introduce(n, { results: [true, true, true], at: now });
        for (const r of servedRefs(plan)) L.ledger.markSeen(r.kind, r.id, { deliberate: r.deliberate, at: now });
        out.push(JSON.stringify(plan));
        p = advancePath(p, plan, true);
      }
      return out;
    };
    expect(plans(withLibrary())).toEqual(plans(withoutLibrary));
  });

  test('a chapter outside the window is skipped, as it always was, while it is not asked for', () => {
    // only unit 3's chapters are in hand: the earlier ones are in the library and not loaded
    const L = placedLearner(2, readDay(2));
    const plan = compileSession({
      learnerId: 'learner-a', learner: L, path: { ...initialPath(), unit: 2, day: readDay(2), coreSessions: 20 }, course,
      content: withLibrary((u) => u === 'u03'), now: T0 + DAY,
    });
    expect(readsIn(plan)).toHaveLength(1);
    expect(readsIn(plan).map(unitOfChapter).every((u) => u === 2)).toBe(true);
  });
});
