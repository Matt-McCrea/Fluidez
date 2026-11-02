// Ways to rearrange the real course, for tests that settle a learner against it: move a day (inside a
// unit or into another), insert one, move a node to another day, rename a node or retire it. Each move
// edits a copy of the units and the graph and, where an id changed, records the content migration that
// says so, the way the real table would.
import type { ContentMigration } from '../../src/content/migrations';
import type { GraphNode, Unit } from '../../src/content/schema';

export interface Moved {
  units: Unit[];
  nodes: GraphNode[];
  /** the entries the moves needed: one for each rename and retirement */
  migrations: ContentMigration[];
}

type Day = Unit['days'][number];

export function copyCourse(units: readonly Unit[], nodes: readonly GraphNode[]): Moved {
  return { units: structuredClone(units) as Unit[], nodes: structuredClone(nodes) as GraphNode[], migrations: [] };
}

export const keyOf = (u: Unit, i: number) => u.days[i].key ?? `${u.id}-d${i}`;

export function findDay(m: Moved, key: string): { unit: number; day: number } | undefined {
  for (let unit = 0; unit < m.units.length; unit++) {
    const day = m.units[unit].days.findIndex((_, i) => keyOf(m.units[unit], i) === key);
    if (day >= 0) return { unit, day };
  }
  return undefined;
}

/** Take the day with this key out of its unit and put it at `toIndex` of unit `toUnit`. */
export function moveDay(m: Moved, key: string, toUnit: number, toIndex: number): void {
  const at = findDay(m, key);
  if (!at) throw new Error(`no day ${key}`);
  const [day] = m.units[at.unit].days.splice(at.day, 1);
  m.units[toUnit].days.splice(Math.min(toIndex, m.units[toUnit].days.length), 0, day);
}

/** A new day in a unit, with a key the course has not used. */
export function insertDay(m: Moved, unit: number, index: number, day: Partial<Day> & { key: string }): void {
  m.units[unit].days.splice(Math.min(index, m.units[unit].days.length), 0, { type: 'introduce', focus: [], chunks: [], lexemes: [], ...day } as Day);
}

const listFor = (kind: GraphNode['kind'] | undefined): 'focus' | 'chunks' | 'lexemes' => (kind === 'chunk' ? 'chunks' : kind === 'lexeme' ? 'lexemes' : 'focus');

/** Take a node off every day that lists it and list it on the day with `toKey`. */
export function moveNode(m: Moved, id: string, toKey: string): void {
  const kind = m.nodes.find((n) => n.id === id)?.kind;
  for (const u of m.units) for (const d of u.days) for (const l of ['focus', 'chunks', 'lexemes'] as const) d[l] = d[l].filter((x) => x !== id);
  const at = findDay(m, toKey);
  if (!at) throw new Error(`no day ${toKey}`);
  m.units[at.unit].days[at.day][listFor(kind)].push(id);
}

/** Give a node a new id everywhere in the course, and add the entry that says so. */
export function renameNode(m: Moved, from: string, to: string): void {
  const n = m.nodes.find((x) => x.id === from);
  if (!n) throw new Error(`no node ${from}`);
  n.id = to;
  for (const x of m.nodes) {
    x.requires = x.requires.map((r) => (r === from ? to : r));
    if (x.unpacks === from) x.unpacks = to;
  }
  for (const u of m.units) for (const d of u.days) for (const l of ['focus', 'chunks', 'lexemes'] as const) d[l] = d[l].map((x) => (x === from ? to : x));
  m.migrations.push({ id: 0, note: `a synthetic rename of ${from}`, nodes: { rename: { [from]: to } } });
}

/** Take a node out of the course for good, and add the entry that says so. */
export function retireNode(m: Moved, id: string): void {
  m.nodes = m.nodes.filter((n) => n.id !== id);
  for (const u of m.units) for (const d of u.days) for (const l of ['focus', 'chunks', 'lexemes'] as const) d[l] = d[l].filter((x) => x !== id);
  m.migrations.push({ id: 0, note: `a synthetic retirement of ${id}`, nodes: { remove: [id] } });
}

/** The table as `reconcile` reads it: the real entries, then these numbered after them, one for each rename or retirement, as a real table would carry them. */
export function withEntries(real: readonly ContentMigration[], m: Moved): ContentMigration[] {
  return [...real, ...m.migrations.map((e, i) => ({ ...e, id: real.length + i + 1 }))];
}
