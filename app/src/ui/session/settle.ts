// Boot's settling of a learner against the course this build carries. learner/reconcile.ts works out
// what the course moving under the documents needs (purely); this applies it: the learner's documents,
// the path, the names the ui keeps, and the saved lesson, written together.
import { buildCourse } from '../../compiler';
import type { ContentHistory } from '../../content/migrations';
import type { GraphNode, Unit } from '../../content/schema';
import type { Learner } from '../../learner';
import { reconcile, type ReconcileReport } from '../../learner/reconcile';
import type { SavedSession, UiStore } from '../store/ui';
import { sweepIntroductions } from './runner';

/**
 * Before settling rewrites a document of the learner's own, a copy of it as it was, kept beside it as
 * `<name>.pre-content-<version it was at>` and written once: a rename that goes wrong then costs a
 * redo, not a learner. Best effort, as the copy `UiStore.load` keeps before a migration is.
 */
async function keepCopies(ui: UiStore, from: number, docs: Array<[name: string, rewritten: boolean, doc: unknown]>): Promise<void> {
  for (const [name, rewritten, doc] of docs) {
    if (!rewritten) continue;
    const key = `${name}.pre-content-${from}`;
    try { if ((await ui.kv.get(key)) === undefined) await ui.kv.set(key, doc); } catch (e) { console.warn(`fluidez: could not keep a copy of ${name} before settling it`, e); }
  }
}

/**
 * Settle `learner` and `ui` against the course. A lesson the course has moved under is dropped, but
 * only after whatever it had begun has been handed to the scheduler (the same sweep a lesson nobody can
 * pick up gets), so no node is left mid-lesson with no lesson to finish it. With no units or no graph
 * there is no course to settle against and nothing is touched. Returns what it did.
 */
export async function settleContent(learner: Learner, ui: UiStore, units: Unit[], nodes: GraphNode[], history: ContentHistory, now: number): Promise<ReconcileReport | undefined> {
  if (!units.length || !nodes.length) return undefined;
  for (const p of history.problems) console.warn(`fluidez: ${p}`);
  const course = buildCourse(units, nodes);
  const docs = learner.documents();
  const out = reconcile<SavedSession>({ ...docs, path: ui.path, ui: ui.state, session: ui.session, course, history });
  ui.track(course, out.report.toVersion);
  for (const p of out.report.problems) console.warn(`fluidez: ${p}`);
  if (out.report.noop) return out.report;
  await keepCopies(ui, out.report.fromVersion, [['state', out.changed.state, docs.state], ['events', out.changed.events, docs.events], ['attempts', out.changed.attempts, docs.attempts]]);
  learner.adopt({ ...(out.changed.state ? { state: out.state } : {}), ...(out.changed.events ? { events: out.events } : {}), ...(out.changed.attempts ? { attempts: out.attempts } : {}) });
  if (out.session === null) sweepIntroductions(learner, now);
  await ui.adopt(learner, { path: out.path, ...(out.changed.ui ? { ui: out.ui } : {}), session: out.session });
  return out.report;
}
