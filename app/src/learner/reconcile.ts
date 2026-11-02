// Reconcile: bring a learner's saved documents to the course this build carries.
//
// A learner's documents name the course by id (nodes, bank rows, chapters, scenes, writing
// tasks) and by place (two integers, and from path v3 the day's stable key beside them). The
// course gets rearranged; the documents have to follow, or a learner loses a node, repeats a
// day, or is never taught what moved in front of them. This is the one place that follows it:
//
//   1. every content migration past the learner's `contentVersion` is applied (renames reach the
//      nodes, the ledger, the events, the attempts, the path and the ui; a retired node's record
//      is kept apart in `state.orphans`, never deleted);
//   2. a node the course does not know and no migration explains is kept apart the same way, and
//      comes back if its id does;
//   3. the place is read from the key and the integers recomputed (a path from before keys is read
//      against the shipped course it was counted in);
//   4. a node the course now teaches before the learner's place and the learner was never given is
//      owed, so it is taught, and not silently skipped;
//   5. a saved lesson the course has moved under is discarded.
//
// It is pure and idempotent: nothing in its input is changed (a document it does not rewrite comes
// back as the same object), and reconciling its own output changes nothing. The compiler stays
// integer based: it never sees a key.
import type { Course, PathState } from '../compiler/types';
import { dayKeyOf, dayPlaces } from '../content/days';
import { contentVersionOf, movesOf, type ContentHistory, type ContentMigration, type MoveKind } from '../content/migrations';
import type { NodeId } from '../content/schema';
import type { AttemptLog } from './attempts';
import type { EventLog } from './events';
import type { LedgerEntry, LedgerKind, LearnerState, NodeRecord } from './state';

/** The parts of the ui document that name content. */
export interface UiNames { readSeconds: Record<string, number>; writing: Record<string, { at?: number }> }

/** The parts of a saved lesson reconcile reads: which course it was planned against, and where it stands. */
export interface SessionDoc {
  version: number;
  /** the content version it was planned at; a lesson saved before there were any has none (read as 0) */
  contentVersion?: number;
  /** the key of the day it was planned for */
  dayKey?: string;
  plan: { unit?: string; day?: number };
}

export interface ReconcileInput<S extends SessionDoc = SessionDoc> {
  state: LearnerState;
  events: EventLog;
  attempts: AttemptLog;
  path: PathState;
  ui?: UiNames;
  session?: S;
  course: Pick<Course, 'units' | 'nodes' | 'unitStart' | 'teachPos'>;
  history: Pick<ContentHistory, 'migrations' | 'legacy'>;
}

export interface PlaceNote { unit: number; day: number; unitId?: string; dayKey?: string }

export interface ReconcileReport {
  fromVersion: number;
  toVersion: number;
  /** the migrations applied, by number */
  migrations: number[];
  /** how many records each document had rewritten by renames */
  rewrote: { nodes: number; ledger: number; events: number; attempts: number; path: number; ui: number };
  /** nodes put aside, with why */
  orphaned: Array<{ node: NodeId; why: 'retired' | 'unknown' }>;
  restored: NodeId[];
  /** entries dropped from the path's lists because the course has no such node */
  dropped: NodeId[];
  /** nodes the course teaches before the learner's place that they were never given */
  owed: NodeId[];
  place: {
    before: PlaceNote;
    after: PlaceNote;
    /** `same` the day is where it was; `moved` it is somewhere else now; `lost` its key is gone and the integers were kept; `finished` the course is done; `stamped` a path from before keys was given its keys */
    how: 'same' | 'moved' | 'lost' | 'finished' | 'stamped';
  };
  session?: { action: 'kept' | 'restamped' | 'discarded'; why?: string };
  problems: string[];
  /** nothing was rewritten and nothing is owed */
  noop: boolean;
}

export interface Reconciled<S extends SessionDoc = SessionDoc> {
  state: LearnerState;
  events: EventLog;
  attempts: AttemptLog;
  path: PathState;
  ui?: UiNames;
  /** undefined: leave the saved lesson; null: discard it (after the lesson's nodes are handed on); an object: save this */
  session?: S | null;
  /** which documents differ from the input; the others are the input's own objects */
  changed: { state: boolean; events: boolean; attempts: boolean; path: boolean; ui: boolean; session: boolean };
  report: ReconcileReport;
}

// ---------------------------------------------------------------- ids through the table

/** An id through the migrations in order: itself, its new name, or null when retired. */
type Resolve = (id: string) => string | null;

function resolver(pending: readonly ContentMigration[], kind: MoveKind): Resolve | undefined {
  const steps = pending.map((m) => movesOf(m, kind)).filter((s) => Object.keys(s.rename).length || s.remove.length)
    .map((s) => ({ rename: s.rename, remove: new Set(s.remove) }));
  if (!steps.length) return undefined;
  return (id) => {
    let cur = id;
    for (const s of steps) {
      if (s.remove.has(cur)) return null;
      if (Object.hasOwn(s.rename, cur)) cur = s.rename[cur];
    }
    return cur;
  };
}

interface Resolvers { nodes?: Resolve; rows?: Resolve; chapters?: Resolve; scenes?: Resolve; tasks?: Resolve }

const NODE_ID = /^[gpclxd]:/;

/**
 * A ledger `item` key is `<prefix>:<id>[:more]`: `ln:` and `tr:` a node, `sc:<node>:rp:0` a script
 * item, `rv:`, `lr:` and the practice ops a bank row (`rv:<node>:<dir>:bare` a node), `wt:` a writing task.
 */
function itemKey(key: string, r: Resolvers): string {
  const at = key.indexOf(':');
  if (at < 0) return key;
  const prefix = key.slice(0, at);
  const rest = key.slice(at + 1);
  if (prefix === 'wt') {
    const to = r.tasks?.(rest);
    return to ? `wt:${to}` : key;
  }
  const parts = rest.split(':');
  if (NODE_ID.test(rest)) {
    const id = `${parts[0]}:${parts[1] ?? ''}`;
    const to = r.nodes?.(id);
    return to && to !== id ? `${prefix}:${to}${parts.length > 2 ? ':' + parts.slice(2).join(':') : ''}` : key;
  }
  const to = r.rows?.(parts[0]);
  return to && to !== parts[0] ? `${prefix}:${[to, ...parts.slice(1)].join(':')}` : key;
}

const mergeEntry = (a: LedgerEntry, b: LedgerEntry): LedgerEntry => ({
  first: Math.min(a.first, b.first), last: Math.max(a.last, b.last), views: [...a.views, ...b.views].sort((x, y) => x.at - y.at),
});

/** A table with its keys through `to`; undefined when no key changes. Keys that meet are merged. */
function rekey<V>(table: Record<string, V>, to: (key: string) => string, merge: (a: V, b: V) => V): { table: Record<string, V>; n: number } | undefined {
  let n = 0;
  const out: Record<string, V> = {};
  for (const [k, v] of Object.entries(table)) {
    const t = to(k);
    if (t !== k) n += 1;
    out[t] = Object.hasOwn(out, t) ? merge(out[t], v) : v;
  }
  return n ? { table: out, n } : undefined;
}

const only = (r: Resolve | undefined) => (r ? (k: string) => r(k) ?? k : (k: string) => k);

/** A list of ids through `r`: renamed, retired ones and those `keep` refuses dropped (and noted), repeats folded. undefined when nothing changes. */
function relist(list: readonly string[], r: Resolve | undefined, keep: (id: string) => boolean, dropped: string[]): string[] | undefined {
  let changed = false;
  const out: string[] = [];
  for (const id of list) {
    const to = r ? r(id) : id;
    if (to === null || !keep(to)) { dropped.push(id); changed = true; continue; }
    if (out.includes(to)) { changed = true; continue; }
    if (to !== id) changed = true;
    out.push(to);
  }
  return changed ? out : undefined;
}

/** The same for a list of records that carry a node. */
function relistBy<T extends { node: NodeId }>(list: readonly T[], r: Resolve | undefined, keep: (id: string) => boolean, dropped: string[]): T[] | undefined {
  let changed = false;
  const out: T[] = [];
  for (const x of list) {
    const to = r ? r(x.node) : x.node;
    if (to === null || !keep(to)) { dropped.push(x.node); changed = true; continue; }
    if (out.some((y) => y.node === to)) { changed = true; continue; }
    if (to !== x.node) changed = true;
    out.push(to === x.node ? x : { ...x, node: to });
  }
  return changed ? out : undefined;
}

const repsOf = (n: NodeRecord) => (n.receptive?.reps ?? 0) + (n.productive?.reps ?? 0) + n.novelPasses + n.exposures;

// ---------------------------------------------------------------- the place

interface Where { unit: number; day: number; how: 'same' | 'moved' | 'lost' | 'finished' | 'stamped' }

/** The day key a pair of integers meant: against the course they were counted in, or (no record of it) this one. */
function legacyKey(unit: number, day: number, history: Pick<ContentHistory, 'legacy'>, course: Pick<Course, 'units'>): string | null | 'finished' {
  const legacy = history.legacy;
  if (legacy) {
    const ids = Object.keys(legacy.units).sort((a, b) => a.localeCompare(b));
    const id = ids[unit];
    if (id === undefined) return 'finished';
    return legacy.units[id][day] ?? null;
  }
  const u = course.units[unit];
  if (!u) return 'finished';
  return u.days[day] ? dayKeyOf(u, day) : null;
}

/** A key through the migrations' `days` maps: the key it became, or null if the day is gone. */
function followDay(key: string, pending: readonly ContentMigration[]): string | null {
  let cur: string | null = key;
  for (const m of pending) {
    if (cur === null) break;
    if (m.days && Object.hasOwn(m.days, cur)) cur = m.days[cur];
  }
  return cur;
}

function place(path: PathState, input: ReconcileInput, pending: readonly ContentMigration[], problems: string[]): Where {
  const { course, history } = input;
  const units = course.units;
  const clamp = (): Where => {
    const unit = Math.max(0, Math.min(path.unit, units.length));
    return { unit, day: unit >= units.length ? 0 : Math.max(0, Math.min(path.day, units[unit].days.length - 1)), how: 'lost' };
  };
  let key: string | null | 'finished';
  let stamped = false;
  if (path.dayKey) key = path.dayKey;
  else { key = legacyKey(path.unit, path.day, history, course); stamped = true; }
  if (key === 'finished') {
    // the course was done when the integers were counted; units added since are where the integer now points
    return path.unit < units.length ? { unit: path.unit, day: path.day, how: stamped ? 'stamped' : 'same' } : { unit: Math.max(path.unit, 0), day: 0, how: 'finished' };
  }
  if (key === null) { problems.push(`the saved place (unit ${path.unit}, day ${path.day}) is not a day of the course it was counted in`); return clamp(); }
  const now = followDay(key, pending);
  const at = now === null ? undefined : dayPlaces(units).get(now);
  if (!at) { problems.push(`the day ${key} the learner is on is not in the course and no content migration says where it went`); return clamp(); }
  const same = at.unit === path.unit && at.day === path.day;
  return { unit: at.unit, day: at.day, how: same ? (stamped ? 'stamped' : 'same') : 'moved' };
}

/** A path with its place also written by name, and the content version it is settled at. A finished course has no day to name. */
export function stampPosition(path: PathState, course: Pick<Course, 'units'>, contentVersion: number): PathState {
  const { unitId: _u, dayKey: _d, ...rest } = path;
  const u = course.units[path.unit];
  return { ...rest, ...(u && u.days[path.day] ? { unitId: u.id, dayKey: dayKeyOf(u, path.day) } : {}), contentVersion };
}

const noteOf = (p: PathState): PlaceNote => ({ unit: p.unit, day: p.day, ...(p.unitId ? { unitId: p.unitId } : {}), ...(p.dayKey ? { dayKey: p.dayKey } : {}) });

// ---------------------------------------------------------------- the saved lesson

function namesIn(plan: unknown, pending: readonly ContentMigration[]): string | undefined {
  const text = JSON.stringify(plan);
  for (const m of pending) {
    for (const kind of ['nodes', 'rows', 'chapters', 'scenes', 'tasks'] as const) {
      const mv = movesOf(m, kind);
      for (const id of [...Object.keys(mv.rename), ...mv.remove]) if (text.includes(id)) return id;
    }
  }
  return undefined;
}

// ---------------------------------------------------------------- reconcile

/** A node taught before the learner's place that the learner has not got is owed in the list its kind belongs to. */
const OWED_LIST = (course: Pick<Course, 'nodes'>, id: NodeId): 'owedGrammar' | 'owedNew' | undefined => {
  const kind = course.nodes.get(id)?.kind ?? ({ g: 'grammar', p: 'pattern', c: 'chunk', l: 'lexeme', x: 'contrast', d: 'cando' } as const)[id[0] as 'g'];
  return kind === 'cando' ? undefined : kind === 'grammar' ? 'owedGrammar' : 'owedNew';
};

export function reconcile<S extends SessionDoc = SessionDoc>(input: ReconcileInput<S>): Reconciled<S> {
  const { course, history } = input;
  const latest = contentVersionOf(history.migrations);
  const from = input.path.contentVersion ?? 0;
  const pending = history.migrations.filter((m) => m.id > from);
  const problems: string[] = [];
  const rewrote = { nodes: 0, ledger: 0, events: 0, attempts: 0, path: 0, ui: 0 };
  if (from > latest) problems.push(`the learner's documents were settled by a newer build (content version ${from}, this one has ${latest}); no migration was applied`);

  const r: Resolvers = {
    nodes: resolver(pending, 'nodes'), rows: resolver(pending, 'rows'), chapters: resolver(pending, 'chapters'),
    scenes: resolver(pending, 'scenes'), tasks: resolver(pending, 'tasks'),
  };

  // ---- 1. renames and retirements, document by document
  let state = input.state;
  let events = input.events;
  let attempts = input.attempts;
  let ui = input.ui;
  const orphaned: ReconcileReport['orphaned'] = [];
  const restored: NodeId[] = [];

  if (r.nodes) {
    let nodes: Record<NodeId, NodeRecord> | undefined;
    let orphans: Record<NodeId, NodeRecord> | undefined;
    for (const [id, rec] of Object.entries(state.nodes)) {
      const to = r.nodes(id);
      if (to === id) continue;
      nodes ??= { ...state.nodes };
      orphans ??= { ...(state.orphans ?? {}) };
      delete nodes[id];
      rewrote.nodes += 1;
      if (to === null) { orphans[id] = rec; orphaned.push({ node: id, why: 'retired' }); continue; }
      const there = nodes[to];
      if (!there) nodes[to] = { ...rec, id: to };
      else {
        // the learner already has the node it became: the one with more behind it stays, the other is kept apart whole
        const [keep, spare, spareId] = repsOf(rec) > repsOf(there) ? [rec, there, to] : [there, rec, id];
        nodes[to] = { ...keep, id: to };
        orphans[spareId] = spare;
      }
    }
    if (nodes) state = { ...state, nodes, ...(orphans && (Object.keys(orphans).length || state.orphans) ? { orphans } : {}) };
  }

  const ledgerKinds: Array<[LedgerKind, (k: string) => string]> = [
    ['sentence', only(r.rows)], ['chapter', only(r.chapters)], ['reading', only(r.chapters)], ['scene', only(r.scenes)], ['item', (k) => itemKey(k, r)],
  ];
  if (r.nodes || r.rows || r.chapters || r.scenes || r.tasks) {
    let ledger: LearnerState['ledger'] | undefined;
    for (const [kind, to] of ledgerKinds) {
      const hit = rekey(state.ledger[kind], to, mergeEntry);
      if (!hit) continue;
      ledger ??= { ...state.ledger };
      ledger[kind] = hit.table;
      rewrote.ledger += hit.n;
    }
    if (ledger) state = { ...state, ledger };
  }

  if (r.nodes || r.rows) {
    const node = (id: string) => (r.nodes ? (r.nodes(id) ?? id) : id);
    const row = (id: string | undefined) => (id && r.rows ? (r.rows(id) ?? id) : id);
    let log = events;
    if (events.events.some((e) => node(e.node) !== e.node || row(e.sentence) !== e.sentence)) {
      log = {
        ...events,
        events: events.events.map((e) => {
          const n = node(e.node), sentence = row(e.sentence);
          if (n === e.node && sentence === e.sentence) return e;
          rewrote.events += 1;
          return { ...e, node: n, ...(sentence ? { sentence } : {}) };
        }),
      };
    }
    const counts = r.nodes ? rekey(events.summary.counts, only(r.nodes), (a, b) => ({ receptive: a.receptive + b.receptive, productive: a.productive + b.productive })) : undefined;
    if (counts) { log = { ...log, summary: { ...log.summary, counts: counts.table } }; rewrote.events += counts.n; }
    events = log;

    if (attempts.rows.some((a) => node(a.node) !== a.node || row(a.sentence) !== a.sentence)) {
      attempts = {
        ...attempts,
        rows: attempts.rows.map((a) => {
          const n = node(a.node), sentence = row(a.sentence);
          if (n === a.node && sentence === a.sentence) return a;
          rewrote.attempts += 1;
          return { ...a, node: n, ...(sentence ? { sentence } : {}) };
        }),
      };
    }
  }

  if (ui && (r.chapters || r.tasks)) {
    const read = r.chapters ? rekey(ui.readSeconds, only(r.chapters), (a, b) => Math.min(a, b)) : undefined;
    const wrote = r.tasks ? rekey(ui.writing, only(r.tasks), (a, b) => ((a.at ?? 0) >= (b.at ?? 0) ? a : b)) : undefined;
    if (read || wrote) {
      ui = { ...ui, ...(read ? { readSeconds: read.table } : {}), ...(wrote ? { writing: wrote.table } : {}) };
      rewrote.ui += (read?.n ?? 0) + (wrote?.n ?? 0);
    }
  }

  // ---- 2. nodes the course does not have: kept apart, and brought back when it has them again
  const nodeIds = Object.keys(state.nodes);
  const unknown = nodeIds.filter((id) => !course.nodes.has(id));
  const tooMany = unknown.length > Math.max(5, nodeIds.length * 0.1);
  if (tooMany) problems.push(`${unknown.length} of the learner's ${nodeIds.length} nodes are not in this course and no migration explains them; they were left alone, as this is more likely the wrong course than that many nodes going`);
  else if (unknown.length) {
    const nodes = { ...state.nodes };
    const orphans = { ...(state.orphans ?? {}) };
    for (const id of unknown) { orphans[id] = nodes[id]; delete nodes[id]; orphaned.push({ node: id, why: 'unknown' }); }
    state = { ...state, nodes, orphans };
  }
  if (state.orphans) {
    const back = Object.keys(state.orphans).filter((id) => course.nodes.has(id) && !state.nodes[id]);
    if (back.length) {
      const nodes = { ...state.nodes };
      const orphans = { ...state.orphans };
      for (const id of back) { nodes[id] = orphans[id]; delete orphans[id]; restored.push(id); }
      state = { ...state, nodes, orphans };
    }
  }
  // ---- 3. the path: its lists, then its place
  let path = input.path;
  // a course that is more likely the wrong one than a real change is not held against the path either
  const known = (id: string) => tooMany || course.nodes.has(id);
  const dropped: NodeId[] = [];
  const lists: Partial<PathState> = {};
  for (const k of ['owedNew', 'owedGrammar', 'recentGrammar'] as const) {
    const out = relist(path[k], r.nodes, known, dropped);
    if (out) { lists[k] = out; rewrote.path += 1; }
  }
  const drills = relistBy(path.pendingDrills, r.nodes, known, dropped);
  if (drills) { lists.pendingDrills = drills; rewrote.path += 1; }
  const shaky = relistBy(path.remediate, r.nodes, known, dropped);
  if (shaky) { lists.remediate = shaky; rewrote.path += 1; }
  const mapped = (id: string | undefined) => (id && r.nodes ? (r.nodes(id) ?? id) : id);
  if (path.log.some((e) => mapped(e.grammarIntro) !== e.grammarIntro || mapped(e.drilled) !== e.drilled)) {
    lists.log = path.log.map((e) => ({ ...e, ...(e.grammarIntro ? { grammarIntro: mapped(e.grammarIntro) } : {}), ...(e.drilled ? { drilled: mapped(e.drilled) } : {}) }));
    rewrote.path += 1;
  }
  if (Object.keys(lists).length) path = { ...path, ...lists };

  const where = place(path, input, pending, problems);
  const units = course.units;

  // ---- 4. what the course teaches before the learner's place that they were never given
  const owed: NodeId[] = [];
  if (where.how !== 'finished' && where.unit < units.length && !tooMany) {
    const here = (course.unitStart[where.unit] ?? 0) + where.day;
    const held = new Set<NodeId>([...path.owedNew, ...path.owedGrammar, ...path.pendingDrills.map((d) => d.node)]);
    const add: Record<'owedNew' | 'owedGrammar', NodeId[]> = { owedNew: [], owedGrammar: [] };
    for (const [id, pos] of course.teachPos) {
      if (pos >= here || state.nodes[id] || held.has(id) || !course.nodes.has(id)) continue;
      const list = OWED_LIST(course, id);
      if (!list) continue;
      add[list].push(id);
      owed.push(id);
    }
    if (owed.length) path = { ...path, owedNew: [...path.owedNew, ...add.owedNew], owedGrammar: [...path.owedGrammar, ...add.owedGrammar] };
  }

  // ---- 5. the place, by name; the version it is settled at
  const settled = Math.max(from, latest);
  const moved: PathState = { ...path, unit: where.unit, day: where.day };
  const stamped = stampPosition(moved, course, settled);
  const pathChanged = Object.keys(lists).length > 0 || owed.length > 0 || stamped.unit !== input.path.unit || stamped.day !== input.path.day
    || stamped.unitId !== input.path.unitId || stamped.dayKey !== input.path.dayKey || stamped.contentVersion !== input.path.contentVersion;

  // ---- 6. the saved lesson
  let session: S | null | undefined;
  let sessionNote: ReconcileReport['session'];
  if (input.session) {
    const s = input.session;
    const sv = s.contentVersion ?? 0;
    const since = history.migrations.filter((m) => m.id > sv);
    const touched = sv < latest ? namesIn(s.plan, since) : undefined;
    let moves: string | undefined;
    if (s.plan.unit !== undefined && s.plan.day !== undefined) {
      const ui0 = course.units.findIndex((u) => u.id === s.plan.unit);
      const key = s.dayKey ?? legacyKey(ui0, s.plan.day, history, course);
      const now = key && key !== 'finished' ? followDay(key, since) : null;
      const at = now ? dayPlaces(units).get(now) : undefined;
      if (!at || at.unit !== ui0 || at.day !== s.plan.day) moves = `the day it was planned for is no longer unit ${s.plan.unit}, day ${s.plan.day}`;
    }
    if (sv > latest) { session = null; sessionNote = { action: 'discarded', why: `it was planned by a newer build (content version ${sv})` }; }
    else if (touched) { session = null; sessionNote = { action: 'discarded', why: `it names ${touched}, which a content migration has moved` }; }
    else if (moves) { session = null; sessionNote = { action: 'discarded', why: moves }; }
    // finishing a lesson saves the path it was planned with (plan.pathAfter), which would lose what was just owed or dropped
    else if (owed.length || dropped.length) { session = null; sessionNote = { action: 'discarded', why: 'the path it was planned with has since changed' }; }
    else {
      // a lesson with no day (a review) has no key to name, and is current without one
      const u = units.find((x) => x.id === s.plan.unit);
      const dayKey = s.dayKey ?? (u && s.plan.day !== undefined && u.days[s.plan.day] ? dayKeyOf(u, s.plan.day) : undefined);
      if (s.version === 2 && sv === settled && s.dayKey === dayKey) sessionNote = { action: 'kept' };
      else {
        session = { ...s, version: 2, contentVersion: settled, ...(dayKey ? { dayKey } : {}) };
        sessionNote = { action: 'restamped' };
      }
    }
  }

  const changed = {
    state: state !== input.state, events: events !== input.events, attempts: attempts !== input.attempts,
    path: pathChanged, ui: ui !== input.ui, session: session !== undefined,
  };
  const report: ReconcileReport = {
    fromVersion: from, toVersion: settled, migrations: pending.map((m) => m.id), rewrote, orphaned, restored, dropped, owed,
    place: { before: noteOf(input.path), after: noteOf(stamped), how: where.how },
    ...(sessionNote ? { session: sessionNote } : {}), problems,
    noop: !changed.state && !changed.events && !changed.attempts && !changed.ui && !changed.path && session === undefined,
  };
  return { state, events, attempts, path: changed.path ? stamped : input.path, ui, session, changed, report };
}

// ---------------------------------------------------------------- for people

/** The report as lines to read: what a build's reconcile would do to these documents. */
export function describeReport(rep: ReconcileReport): string[] {
  const out: string[] = [];
  const at = (p: PlaceNote) => `unit ${p.unit} day ${p.day}${p.dayKey ? ` (${p.dayKey})` : ''}`;
  out.push(rep.noop ? 'nothing to do: these documents already fit the course' : `settles these documents at content version ${rep.toVersion} (they are at ${rep.fromVersion})`);
  if (rep.migrations.length) out.push(`applies content migration${rep.migrations.length > 1 ? 's' : ''} ${rep.migrations.join(', ')}`);
  const rw = Object.entries(rep.rewrote).filter(([, n]) => n > 0).map(([k, n]) => `${n} in ${k}`);
  if (rw.length) out.push(`renames: ${rw.join(', ')}`);
  if (rep.orphaned.length) out.push(`puts apart (kept whole): ${rep.orphaned.map((o) => `${o.node} (${o.why})`).join(', ')}`);
  if (rep.restored.length) out.push(`brings back: ${rep.restored.join(', ')}`);
  if (rep.dropped.length) out.push(`drops from the path's lists: ${rep.dropped.join(', ')}`);
  if (rep.owed.length) out.push(`owes ${rep.owed.length} node(s) the course now teaches earlier: ${rep.owed.slice(0, 12).join(', ')}${rep.owed.length > 12 ? ', ...' : ''}`);
  const how = { same: 'stays on', moved: 'moves to', lost: 'cannot find the day; keeps the integers', finished: 'has finished the course', stamped: 'is given keys; stays on' }[rep.place.how];
  out.push(`the learner ${how} ${rep.place.how === 'finished' ? '' : at(rep.place.after)}${rep.place.how === 'moved' ? ` (was ${at(rep.place.before)})` : ''}`.trim());
  if (rep.session) out.push(`the open lesson is ${rep.session.action}${rep.session.why ? `: ${rep.session.why}` : ''}`);
  for (const p of rep.problems) out.push(`PROBLEM: ${p}`);
  return out;
}
