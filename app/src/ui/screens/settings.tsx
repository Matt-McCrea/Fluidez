// Settings: how hard reviews push, a backup file to keep and restore, and a
// reset. The length of the day is not here: learners do not choose it ("I need
// to stop" in the session covers the odd short day).
import { useEffect, useRef, useState } from 'preact/hooks';
import { Heading } from '../components/text';
import { SaveFailedError } from '../../learner';
import { BackupError, downloadBackup, provenBackup, readBackup, restoreBackup, type BackupSummary, type ReadBackup } from '../../learner/backup';
import { useApp } from '../context';
import { BACKUP_READERS, SESSION_KEY } from '../store/ui';

const RETENTION = [
  { v: 0.85, label: 'Relaxed', note: 'Fewer reviews; you\'ll forget a bit more.' },
  { v: 0.9, label: 'Balanced', note: 'Recommended.' },
  { v: 0.95, label: 'Thorough', note: 'More reviews; you\'ll forget less.' },
];

/** A backup now would miss the latest answers, because the store is refusing them. */
const UNSAVED = 'Your latest answers haven\'t been saved yet, so a backup now would miss them. Keep this page open and try again in a moment.';

/** What a learner is told about a backup before it replaces anything. */
export function describeBackup({ madeAt, sessions }: BackupSummary): string {
  const when = madeAt > 0 ? ` from ${new Date(madeAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}` : '';
  const n = sessions === 1 ? '1 session' : `${sessions} sessions`;
  return `This backup${when} has ${n} in it. Restoring replaces the progress on this device with it. We keep a copy of what is here now.`;
}

type Note = { text: string; problem?: boolean };

export function Settings() {
  const app = useApp();
  const { learner } = app;
  const [, force] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [pending, setPending] = useState<ReadBackup | null>(null);
  const [busy, setBusy] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  useEffect(() => learner.onSaveProblem(() => force((n) => n + 1)), [learner]);
  const s = learner.settings;
  const set = async (patch: Parameters<typeof learner.setSettings>[0]) => {
    learner.setSettings(patch);
    await learner.flush();
    force((n) => n + 1);
    app.refresh();
  };
  const fail = (e: unknown, otherwise: string): Note => ({
    text: e instanceof BackupError ? e.message : e instanceof SaveFailedError ? UNSAVED : otherwise, problem: true,
  });

  const save = async () => {
    setBusy(true);
    setNote(null);
    try {
      await learner.flush();
      const name = downloadBackup(await provenBackup(app.learnerStore, BACKUP_READERS, app.now()));
      setNote({ text: `Made ${name}. Check your downloads, and keep the file somewhere safe.` });
    } catch (e) { setNote(fail(e, 'Couldn\'t make a backup just now.')); }
    setBusy(false);
  };

  const pick = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // choosing the same file again must fire again
    if (!file) return;
    setNote(null);
    try { setPending(readBackup(await file.text(), BACKUP_READERS)); } catch (err) {
      setPending(null);
      setNote(fail(err, 'Couldn\'t read that file.'));
    }
  };

  const restore = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await learner.flush();
      await restoreBackup(app.learnerStore, pending, BACKUP_READERS, [SESSION_KEY]);
      learner.halt(); // what this page still holds must not be saved over what was just restored
      setPending(null);
      setNote({ text: 'Restored. Opening your progress…' });
      location.reload();
    } catch (e) {
      setNote(fail(e, 'Couldn\'t restore that backup.'));
      setBusy(false);
    }
  };

  return (
    <main class="screen" id="main">
      <Heading title="Settings" />
      {learner.saveProblem ? <section class="card danger" role="status"><p>{learner.saveProblem}</p></section> : null}
      <fieldset class="choices">
        <legend>How much to review</legend>
        {RETENTION.map((r) => (
          <label key={r.v} class={`choice${Math.abs(s.retention - r.v) < 0.001 ? ' on' : ''}`}>
            <input type="radio" name="retention" checked={Math.abs(s.retention - r.v) < 0.001} onChange={() => void set({ retention: r.v })} />
            <span><strong>{r.label}</strong><br /><span class="small">{r.note}</span></span>
          </label>
        ))}
      </fieldset>
      <section class="card">
        <p class="ask">Your progress</p>
        <p class="small">Everything you have learned is kept on this device only. A backup is a file you keep. If you change phone or clear your browser, restore it and carry on.</p>
        <div class="actions">
          <button class="btn" data-backup disabled={busy} onClick={() => void save()}>Save a backup</button>
          <button class="btn quiet" data-restore disabled={busy} onClick={() => picker.current?.click()}>Restore a backup…</button>
          <input ref={picker} type="file" accept=".json,application/json" hidden data-restore-file onChange={(e) => void pick(e)} />
        </div>
        {note ? <p class="small" role={note.problem ? 'alert' : 'status'}>{note.text}</p> : null}
        {pending ? (
          <>
            <p>{describeBackup(pending.summary)}</p>
            <div class="actions stack">
              <button class="btn danger" data-restore-go disabled={busy} onClick={() => void restore()}>Replace my progress with this backup</button>
              <button class="btn quiet" disabled={busy} onClick={() => setPending(null)}>Cancel</button>
            </div>
          </>
        ) : null}
      </section>
      <section class="card danger">
        <p class="ask">Start over</p>
        <p class="small">Deletes your progress on this device. This can't be undone.</p>
        {confirm ? (
          <div class="actions stack">
            <button class="btn danger" data-reset onClick={() => void app.resetAll()}>Yes, delete everything</button>
            <button class="btn quiet" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        ) : <div class="actions"><button class="btn quiet" onClick={() => setConfirm(true)}>Reset progress…</button></div>}
      </section>
      {app.bundle.fixture ? <p class="small">Using sample lessons while the full course is being written.</p> : null}
    </main>
  );
}
