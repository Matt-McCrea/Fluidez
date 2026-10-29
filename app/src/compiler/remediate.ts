// The remediation list on PathState: nodes the learner marked shaky (self-check,
// checkpoint reading check) that drills and remixes draw from first.
import type { Course } from './types';
import type { NodeId } from '../content/schema';
import type { PathState } from './types';

export type RemediateEntry = PathState['remediate'][number];

/** A node is served in an older set at most this many times before it leaves the list. */
export const REMEDIATE_MAX_SERVED = 2;

/** Grammar/pattern/contrast nodes that serve the can-do of `unitId` (can-do node ids are `d:<unit>-...`). */
export function canDoServers(course: Pick<Course, 'nodes'>, unitId: string): NodeId[] {
  const cando = [...course.nodes.values()].filter((n) => n.kind === 'cando' && n.id.startsWith(`d:${unitId}-`)).map((n) => n.id);
  if (!cando.length) return [];
  return [...course.nodes.values()]
    .filter((n) => ['grammar', 'pattern', 'contrast'].includes(n.kind) && (n.serves ?? []).some((s) => cando.includes(s)))
    .map((n) => n.id);
}

/** Add (or refresh) nodes; a refreshed node starts its servings again. Returns a new list. */
export function withRemediate(list: readonly RemediateEntry[], nodes: readonly NodeId[], reason: RemediateEntry['reason'], at: number): RemediateEntry[] {
  const add = new Set(nodes);
  return [...list.filter((e) => !add.has(e.node)), ...[...add].map((node) => ({ node, reason, at, served: 0 }))];
}

export function withoutRemediate(list: readonly RemediateEntry[], nodes: readonly NodeId[]): RemediateEntry[] {
  const drop = new Set(nodes);
  return list.filter((e) => !drop.has(e.node));
}
