// npm run reconcile -- <backup.json>
//
// A rehearsal on real data. Reads a backup file (Settings, "Save a backup") and prints what the next
// build's reconcile would do to the learner in it, against the course in this checkout: which
// migrations it would apply and what they rename, which nodes it would put apart or owe, and where the
// learner would stand and whether it would move them. It writes nothing, to the backup or anywhere else. Run it on the owner's own backup before a release that moves the
// course, and read the output. Runs under vite-node (the content loader's import.meta.glob).
import { readFileSync } from 'node:fs';
import { BackupError } from '../src/learner/backup';
import { rehearse } from './rehearse';

async function main(): Promise<void> {
  const path = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (!path) { console.error('usage: npm run reconcile -- <backup.json>'); process.exit(2); }
  try { for (const l of await rehearse(readFileSync(path, 'utf8'))) console.log(l); } catch (e) {
    console.error(e instanceof BackupError ? `${e.message}${e.detail ? ` (${e.detail})` : ''}` : (e as Error).message);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
