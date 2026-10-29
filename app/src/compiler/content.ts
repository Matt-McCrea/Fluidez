// Building the compiler's lookup structures from content-schema objects, and
// the seeded RNG. Pure: no IO. Build once per content load, reuse for every
// compile.
import type {
  BankSentence, GraphNode, NodeId, Scene, StoryChapter, TeachingScript, Unit, WritingTask,
} from '../content/schema';
import type { ChapterRef, ContentIndex, Course, SceneRef, ScriptRef, SentenceRef, TaskRef } from './types';

/** Tagger output the schema does not carry yet (see the report's schema proposals). */
export interface Tagged { requires?: NodeId[] }

export interface ContentSource {
  sentences: BankSentence[];
  chapters: (StoryChapter & Tagged)[];
  scenes: (Scene & Tagged)[];
  writing: (WritingTask & Tagged)[];
  /** full scripts, or just their shape */
  scripts: (TeachingScript | ScriptRef)[];
}

export function buildCourse(units: Unit[], nodes: GraphNode[]): Course {
  const sorted = [...units].sort((a, b) => a.id.localeCompare(b.id));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const unitStart: number[] = [];
  const teachPos = new Map<NodeId, number>();
  const firstListed = new Map<NodeId, number>();
  let pos = 0;
  for (const u of sorted) {
    unitStart.push(pos);
    for (const d of u.days) {
      for (const n of dayNodes(d)) {
        if (!firstListed.has(n)) firstListed.set(n, pos);
        const grammar = (byId.get(n)?.kind ?? (n.startsWith('g:') ? 'grammar' : '')) === 'grammar';
        if (!teachPos.has(n) && (!grammar || (d.type === 'introduce' && d.focus.includes(n)))) teachPos.set(n, pos);
      }
      pos++;
    }
  }
  // grammar never on an introduce day: taught where first listed
  for (const [n, p] of firstListed) if (!teachPos.has(n)) teachPos.set(n, p);
  const { implicit, untaught } = implicitNodes(sorted, nodes);
  return { units: sorted, nodes: byId, unitIndex: new Map(sorted.map((u, i) => [u.id, i])), unitStart, teachPos, implicit, untaught };
}

/**
 * Graph nodes no unit day lists. Lexemes and chunks among them are allowed in
 * sentences from session max(1, priority) (the gate's rule for unscheduled
 * nodes); the rest (grammar, patterns, contrasts and the like) must be taught
 * explicitly, so they are reported as untaught and never known. With no units
 * there is no schedule, so nothing is implicit.
 */
/**
 * What counts as known for sentence legality: every introduced node, plus the lexemes and
 * chunks no unit day teaches once their priority session has come. `at` is the session
 * being compiled (the learner's next one unless given).
 */
export function knownSet(learner: { nodes(): NodeId[]; sessionIndex: number }, course: Pick<Course, 'implicit'>, at = learner.sessionIndex + 1): Set<NodeId> {
  const known = new Set<NodeId>(learner.nodes());
  for (const [id, from] of course.implicit) if (from <= at) known.add(id);
  return known;
}

export function implicitNodes(units: Unit[], nodes: GraphNode[]): { implicit: Map<NodeId, number>; untaught: NodeId[] } {
  const implicit = new Map<NodeId, number>();
  const untaught: NodeId[] = [];
  if (!units.length) return { implicit, untaught };
  const listed = new Set<NodeId>();
  for (const u of units) for (const d of u.days) for (const n of dayNodes(d)) listed.add(n);
  for (const n of nodes) {
    if (listed.has(n.id)) continue;
    if (n.kind === 'lexeme' || n.kind === 'chunk') implicit.set(n.id, Math.max(1, n.priority));
    else if (n.kind === 'grammar' || n.kind === 'pattern' || n.kind === 'contrast') untaught.push(n.id);
  }
  return { implicit, untaught: untaught.sort() };
}

/** Global position of a unit day. */
export function dayPos(course: Course, unitIdx: number, dayIdx: number): number {
  return (course.unitStart[unitIdx] ?? Infinity) + dayIdx;
}

/** Every node a unit day teaches. */
export function dayNodes(d: Unit['days'][number]): NodeId[] {
  return [...d.focus, ...d.chunks, ...d.lexemes];
}

/**
 * The position gate for content without tagger `requires`: the nodes the unit
 * lists on days [0, dayIdx] (undefined = the whole unit) that are TAUGHT by
 * then (a grammar point previewed in an output focus before its introduce
 * day is not required).
 */
function positionGate(course: Course, unit: Unit | undefined, dayIdx?: number): NodeId[] {
  if (!unit) return [];
  const last = dayIdx ?? unit.days.length - 1;
  const here = dayPos(course, course.unitIndex.get(unit.id) ?? -1, last);
  const out = new Set<NodeId>();
  unit.days.slice(0, last + 1).forEach((d) => dayNodes(d).forEach((n) => {
    if ((course.teachPos.get(n) ?? Infinity) <= here) out.add(n);
  }));
  return [...out];
}

function push<K, V>(m: Map<K, V[]>, k: K, v: V) {
  const a = m.get(k);
  if (a) a.push(v); else m.set(k, [v]);
}

const READ_WPM = 70;        // A1-B1 reading speed in words/min for a graded text (heuristic)

export function buildContentIndex(src: ContentSource, course: Course): ContentIndex {
  const unitById = new Map(course.units.map((u) => [u.id, u]));
  const dayOf = (unit: string, key: 'chapter' | 'scene', id: string) => {
    const u = unitById.get(unit);
    const i = u?.days.findIndex((d) => d[key] === id) ?? -1;
    return i >= 0 ? i : undefined;
  };
  // unlisted scenes/tasks: gated at the unit's first output-type day (else the whole unit);
  // a focused task: at the day that first teaches its focus
  const firstDay = (unit: string, pred: (d: Unit['days'][number]) => boolean) => {
    const i = unitById.get(unit)?.days.findIndex(pred) ?? -1;
    return i >= 0 ? i : undefined;
  };
  const outputDay = (unit: string) => firstDay(unit, (d) => d.type === 'output' || d.type === 'checkpoint');

  const sentences = new Map<string, SentenceRef>();
  const byTarget = new Map<NodeId, string[]>();
  const byRequire = new Map<NodeId, string[]>();
  const byUnit = new Map<string, string[]>();
  for (const s of src.sentences) {
    if (sentences.has(s.id)) continue; // first wins; the gate rejects duplicate ids
    const targets = [...new Set(s.targets ?? [])];
    const requires = [...new Set([...targets, ...(s.requires ?? [])])];
    sentences.set(s.id, { id: s.id, requires, targets, unit: s.unit, question: /[?¿]\s*$/.test(s.es.trim()) || s.es.includes('¿') });
    for (const t of targets) push(byTarget, t, s.id);
    for (const r of requires) if (!targets.includes(r)) push(byRequire, r, s.id);
    if (s.unit) push(byUnit, s.unit, s.id);
  }

  const chapters: ChapterRef[] = [...src.chapters]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((c, order) => ({
      id: c.id, unit: c.unit, order, day: dayOf(c.unit, 'chapter', c.id),
      requires: c.requires?.length ? c.requires : positionGate(course, unitById.get(c.unit), dayOf(c.unit, 'chapter', c.id)),
      questions: c.questions.length,
      minutes: Math.max(2, Math.round(((c.text.split(/\s+/).length / READ_WPM) + c.questions.length * 0.3) * 2) / 2),
    }));

  const scenes = new Map<string, SceneRef>();
  const scenesByUnit = new Map<string, string[]>();
  for (const s of src.scenes) {
    const focus = [...new Set(s.turns.map((t) => t.focus).filter((x): x is NodeId => !!x))];
    scenes.set(s.id, {
      id: s.id, unit: s.unit, focus, turns: s.turns.length,
      requires: s.requires?.length ? s.requires : positionGate(course, unitById.get(s.unit), dayOf(s.unit, 'scene', s.id) ?? outputDay(s.unit)),
      minutes: Math.max(3, Math.round(s.turns.length * 0.7)),
    });
    push(scenesByUnit, s.unit, s.id);
  }

  const tasks = new Map<string, TaskRef>();
  const tasksByUnit = new Map<string, string[]>();
  for (const t of src.writing) {
    tasks.set(t.id, {
      id: t.id, unit: t.unit, focus: t.focus,
      requires: t.requires?.length ? t.requires : [...new Set([
        ...positionGate(course, unitById.get(t.unit), t.focus ? firstDay(t.unit, (d) => d.focus.includes(t.focus!)) : outputDay(t.unit)),
        ...(t.focus ? [t.focus] : []),
      ])],
      minutes: Math.min(15, Math.max(3, Math.round(t.maxWords / 12))),
    });
    push(tasksByUnit, t.unit, t.id);
  }

  const scripts = new Map<NodeId, ScriptRef>();
  for (const s of src.scripts) {
    const ref: ScriptRef = 'hook' in s
      ? { node: s.node, readAndPick: s.readAndPick.length, yourTurn: s.yourTurn.length }
      : s;
    scripts.set(ref.node, ref);
  }

  return {
    sentences, byTarget, byRequire, byUnit,
    chapters, chapterById: new Map(chapters.map((c) => [c.id, c])),
    scenes, scenesByUnit, tasks, tasksByUnit, scripts,
  };
}

// ------------------------------------------------------------------ RNG

/** FNV-1a 32-bit. */
export function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

export interface Rng { next(): number; int(lo: number, hi: number): number; shuffle<T>(xs: T[]): T[] }

/** mulberry32 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    shuffle<T>(xs: T[]): T[] {
      for (let i = xs.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [xs[i], xs[j]] = [xs[j], xs[i]]; }
      return xs;
    },
  };
}

/** The session seed: learner id + session index. Never the lesson id. */
export function sessionSeed(learnerId: string, sessionIndex: number): number {
  return hash32(`${learnerId}#${sessionIndex}`);
}
