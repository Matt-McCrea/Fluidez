// Per-day bank supply: for every unit day and every node the day drills, how many
// bank rows the session compiler could actually serve on that day. The compiler admits
// a sentence only when requires ⊆ known ∪ introduced this session, so a row counts for a
// day only when everything it requires is taught by that day's session (not the unit end,
// which is where the gate's legality check places a bank row).
import type { BankSentence, Scene, WritingTask } from '../../src/content/schema';
import type { Curriculum } from '../gate/load';
import { implicitNodes } from '../../src/compiler/content';

type Implicit = ReturnType<typeof implicitNodes> & { listed: Map<string, number>; untaughtSet: Set<string> };
const implicitCache = new WeakMap<Curriculum, Implicit>();
/** The compiler's own definition of nodes no unit day teaches (shared, not re-implemented). */
function implicitOf(cur: Curriculum) {
  let v = implicitCache.get(cur);
  if (!v) {
    const base = implicitNodes(cur.units, [...cur.nodes.values()]);
    // a day-listed word is known from its first day (the compiler ignores a lower graph priority)
    const listed = new Map<string, number>();
    for (const u of cur.units) u.days.forEach((d, i) => { const ss = cur.daySession.get(`${u.id}#${i}`)!; for (const l of d.lexemes) if (!listed.has(l)) listed.set(l, ss); });
    v = { ...base, listed, untaughtSet: new Set(base.untaught) };
    implicitCache.set(cur, v);
  }
  return v;
}

export const MIN = {
  structuredInput: 9,       // unseen rows per grammar/pattern node on an introduce day
  controlledOutput: 11,     // per node on a drill day
  communicative: 4,         // questions per node on a drill day
  unitByDrill: 40,          // usable rows per grammar node by its drill day
  firstDayRows: 12,         // bank prompt rule: rows legal by the node's first day
  firstDayQuestions: 6,     // ... of which questions
} as const;

export interface NodeSupply {
  node: string;
  block: 'structuredInput' | 'controlledOutput';
  usable: number;
  /** same count, but a lexeme counts only when a unit day carries it (the compiler only introduces day-listed words) */
  usableStrict: number;
  questions: number;
  min: number;
  minQuestions: number;
  short: boolean;
  shortQuestions: boolean;
}
export interface DaySupply {
  unit: string;
  day: number;              // 1-based within the unit
  session: number;          // global session index
  type: string;
  nodes: NodeSupply[];
  remixUsable: number;      // rows with a grammar target usable this day
}
export interface UnitNodeSupply {
  unit: string;
  node: string;
  drillDay: number;
  session: number;
  usable: number;
  min: number;
  short: boolean;
}
export interface DaySupplyReport { days: DaySupply[]; unitNodes: UnitNodeSupply[]; untargetable: string[] }

export const isQuestion = (b: BankSentence) => b.kind === 'question' || b.es.includes('¿');

/** requires ⊆ taught by `session`; a taught chunk in the same row covers the grammar it unpacks. */
export function usableAt(cur: Curriculum, b: BankSentence, session: number, dayAt?: Map<string, number>): boolean {
  const imp = implicitOf(cur);
  const has = (r: string) => {
    // strict (dayAt given): the legacy column, where only day-listed words are ever known
    if (!dayAt) {
      const from = imp.implicit.get(r);
      if (from !== undefined) return from <= session;
      if (imp.untaughtSet.has(r)) return false;
      const at = imp.listed.get(r);
      if (at !== undefined) return at <= session;
    }
    if (dayAt && r.startsWith('l:')) return (dayAt.get(r) ?? Infinity) <= session;
    const t = cur.taughtAt.get(r);
    return t === undefined ? !cur.graphIds.has(r) : t <= session;
  };
  for (const r of b.requires) {
    if (has(r)) continue;
    if (b.requires.some((c) => c !== r && has(c) && cur.nodes.get(c)?.unpacks === r)) continue;
    return false;
  }
  return true;
}

const drilled = (n: string) => /^[gp]:/.test(n);

export function computeDaySupply(cur: Curriculum, rows: BankSentence[], opts: { units?: Set<string> } = {}): DaySupplyReport {
  const byTarget = new Map<string, BankSentence[]>();
  for (const b of rows) for (const t of new Set(b.targets)) { const a = byTarget.get(t); if (a) a.push(b); else byTarget.set(t, [b]); }
  const dayAt = new Map<string, number>();
  for (const u of cur.units) u.days.forEach((d, i) => { const s = cur.daySession.get(`${u.id}#${i}`)!; for (const l of d.lexemes) if (!dayAt.has(l)) dayAt.set(l, s); });
  const days: DaySupply[] = [];
  const unitNodes: UnitNodeSupply[] = [];
  const untargetable = new Set<string>();
  for (const u of cur.units) {
    if (opts.units && !opts.units.has(u.id)) continue;
    const drillOf = new Map<string, { day: number; session: number }>();
    u.days.forEach((d, i) => {
      const session = cur.daySession.get(`${u.id}#${i}`)!;
      const nodes: NodeSupply[] = [];
      if (d.type === 'introduce' || d.type === 'drill') {
        for (const n of d.focus.filter(drilled)) {
          const all = byTarget.get(n) ?? [];
          if (!all.length) { untargetable.add(n); continue; }   // no tagger feature: nothing can target it
          const ok = all.filter((b) => usableAt(cur, b, session));
          const q = ok.filter(isQuestion).length;
          const intro = d.type === 'introduce';
          const min = intro ? MIN.structuredInput : MIN.controlledOutput;
          const minQuestions = intro ? 0 : MIN.communicative;
          nodes.push({ node: n, block: intro ? 'structuredInput' : 'controlledOutput', usable: ok.length, usableStrict: ok.filter((b) => usableAt(cur, b, session, dayAt)).length, questions: q, min, minQuestions, short: ok.length < min, shortQuestions: q < minQuestions });
          if (d.type === 'drill' && n.startsWith('g:')) drillOf.set(n, { day: i + 1, session });
        }
      }
      for (const n of d.focus) if (n.startsWith('g:') && !drillOf.has(n) && d.type !== 'drill') { /* fall back to the last day naming it */ drillOf.set(`~${n}`, { day: i + 1, session }); }
      days.push({ unit: u.id, day: i + 1, session, type: d.type, nodes, remixUsable: rows.filter((b) => b.targets.some((t) => t.startsWith('g:')) && usableAt(cur, b, session)).length });
    });
    // the unit-wide minimum: by the node's first drill day, else the last day that names it
    const seen = new Set<string>();
    for (const [key, v] of drillOf) {
      const n = key.replace(/^~/, '');
      if (key.startsWith('~') && drillOf.has(n)) continue;
      if (seen.has(n)) continue;
      seen.add(n);
      const all = byTarget.get(n) ?? [];
      if (!all.length) continue;
      const usable = all.filter((b) => usableAt(cur, b, v.session)).length;
      unitNodes.push({ unit: u.id, node: n, drillDay: v.day, session: v.session, usable, min: MIN.unitByDrill, short: usable < MIN.unitByDrill });
    }
  }
  return { days, unitNodes, untargetable: [...untargetable].sort() };
}

/* ---- writing tasks and scenes ------------------------------------------------------ */
export const MIN_TASKS = 1;       // the compiler needs one unseen gated task per drilled grammar node
export const TARGET_TASKS = 2;    // what the writing prompt asks for
type Gated = { requires: string[] };
const usableReq = (cur: Curriculum, r: Gated, session: number) => usableAt(cur, r as unknown as BankSentence, session);

export interface WritingSupply { unit: string; node: string; day: number; session: number; type: string; usable: number; total: number; min: number; short: boolean; usableIds: string[] }
export interface SceneSupply {
  unit: string; day: number; session: number; named: string | null; namedUsable: boolean;
  usable: string[];          // scenes the output day could serve (named, or an unreserved scene of the unit)
  spareUsable: string[];     // spare scenes usable by that day
  total: number; short: boolean;
}

/** Per grammar node, on its drill day (else its first introduce day): focused tasks usable by that day. */
export function computeWritingSupply(cur: Curriculum, tasks: WritingTask[], opts: { units?: Set<string> } = {}): WritingSupply[] {
  const out: WritingSupply[] = [];
  for (const u of cur.units) {
    if (opts.units && !opts.units.has(u.id)) continue;
    const mine = tasks.filter((t) => t.unit === u.id);
    const pick = new Map<string, number>();   // node -> day index
    u.days.forEach((d, i) => { if (d.type === 'drill') for (const n of d.focus) if (n.startsWith('g:') && !pick.has(n)) pick.set(n, i); });
    u.days.forEach((d, i) => { if (d.type === 'introduce') for (const n of d.focus) if (n.startsWith('g:') && !pick.has(n)) pick.set(n, i); });
    for (const [node, i] of pick) {
      const session = cur.daySession.get(`${u.id}#${i}`)!;
      const focused = mine.filter((t) => t.focus === node);
      const ok = focused.filter((t) => usableReq(cur, t, session));
      out.push({ unit: u.id, node, day: i + 1, session, type: u.days[i].type, usable: ok.length, total: focused.length, min: MIN_TASKS, short: ok.length < MIN_TASKS, usableIds: ok.map((t) => t.id) });
    }
  }
  return out.sort((a, b) => a.unit.localeCompare(b.unit) || a.day - b.day);
}

/** Per output day: a scene the compiler could serve, and the spare scenes usable by then. */
export function computeSceneSupply(cur: Curriculum, scenes: Scene[], opts: { units?: Set<string> } = {}): SceneSupply[] {
  const out: SceneSupply[] = [];
  for (const u of cur.units) {
    if (opts.units && !opts.units.has(u.id)) continue;
    const mine = scenes.filter((s) => s.unit === u.id);
    const reserved = new Set(u.days.map((d) => d.scene).filter(Boolean) as string[]);
    u.days.forEach((d, i) => {
      if (d.type !== 'output') return;
      const session = cur.daySession.get(`${u.id}#${i}`)!;
      const named = d.scene ?? null;
      const namedSc = named ? mine.find((s) => s.id === named) : undefined;
      const namedUsable = !!namedSc && usableReq(cur, namedSc, session);
      const usable = mine.filter((s) => usableReq(cur, s, session) && (s.id === named || !reserved.has(s.id))).map((s) => s.id);
      const spareUsable = mine.filter((s) => s.spare && usableReq(cur, s, session)).map((s) => s.id);
      out.push({ unit: u.id, day: i + 1, session, named, namedUsable, usable, spareUsable, total: mine.length, short: usable.length < 1 });
    });
  }
  return out;
}
