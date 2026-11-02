// What the next build's reconcile would do to the learner in a backup, as lines to read. The tool is tools/reconcile.ts.
import { buildCourse } from '../src/compiler';
import { describeReport, reconcile } from '../src/learner/reconcile';
import { BACKUP_FORMAT, BackupError, readBackup } from '../src/learner/backup';
import { readEvents, type EventLog } from '../src/learner/events';
import { readAttempts, type AttemptLog } from '../src/learner/attempts';
import { migrate } from '../src/learner/state';
import { ContentLoader } from '../src/ui/data/loader';
import { BACKUP_READERS, migratePath, migrateUi } from '../src/ui/store/ui';

/** The lines to print for a backup's text. Throws a BackupError, in words, if it is not a backup this build can open. */
export async function rehearse(text: string, loader: ContentLoader = new ContentLoader()): Promise<string[]> {
  const { file, summary } = readBackup(text, BACKUP_READERS);
  const docs = file.documents;
  if (docs.path === undefined) throw new BackupError('unreadable', 'This backup has no path document, so there is no place to settle.');
  const { units, nodes } = await loader.core();
  if (loader.problems.length) throw new Error(`the course did not load: ${loader.problems[0]}`);
  const history = loader.history();
  const empty = { version: 1, events: [], summary: { upTo: 0, counts: {} } } as EventLog;
  const out = reconcile({
    state: migrate(docs.state),
    events: docs.events === undefined ? empty : readEvents(docs.events),
    attempts: docs.attempts === undefined ? ({ version: 1, rows: [] } as AttemptLog) : readAttempts(docs.attempts),
    path: migratePath(docs.path),
    ui: docs.ui === undefined ? undefined : migrateUi(docs.ui),
    course: buildCourse(units, nodes), history,
  });
  const made = summary.madeAt ? new Date(summary.madeAt).toISOString().slice(0, 10) : 'an unknown day';
  return [
    `${BACKUP_FORMAT} made ${made}, ${summary.sessions} session(s), against ${units.length} units and ${nodes.length} nodes (content version ${out.report.toVersion})`,
    ...describeReport(out.report).map((l) => `  ${l}`),
  ];
}
