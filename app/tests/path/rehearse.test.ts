// The rehearsal tool: a backup file in, what the next build's reconcile would do to it, out, and nothing written.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ContentMigration } from '../../src/content/migrations';
import { backupText, BackupError, IdbStore, Learner, makeBackup } from '../../src/learner';
import { ContentLoader, type ContentFiles } from '../../src/ui/data/loader';
import { BACKUP_READERS, MemoryKV, PATH_KEY, UI_KEY, emptyUi } from '../../src/ui/store/ui';
import { initialPath } from '../../src/compiler';
import { rehearse } from '../../tools/rehearse';

const GOLDEN = fileURLToPath(new URL('../golden/', import.meta.url));
const AT = Date.UTC(2026, 9, 1, 18);

async function backupOf(kv: MemoryKV): Promise<string> {
  return backupText(await makeBackup(new IdbStore(kv), BACKUP_READERS, AT));
}

describe('rehearse', () => {
  it('says what the build would do to a learner the live site stored', async () => {
    const g = JSON.parse(readFileSync(`${GOLDEN}live-ee6aaec.json`, 'utf8')) as { kv: Record<string, unknown> };
    const kv = new MemoryKV();
    for (const [k, v] of Object.entries(g.kv)) kv.data.set(k, structuredClone(v));
    const before = JSON.stringify([...kv.data]);
    const lines = await rehearse(await backupOf(kv));
    expect(lines[0]).toMatch(/^fluidez-backup made 2026-10-0\d, 10 session\(s\), against 60 units/);
    expect(lines.join('\n')).toMatch(/settles these documents at content version 2 \(they are at 0\)/);
    expect(lines.join('\n')).toMatch(/applies content migrations 1, 2/);
    expect(lines.join('\n')).toMatch(/the learner is given keys; stays on unit 1 day 0 \(u02-d0\)/);
    expect(lines.join('\n')).not.toMatch(/PROBLEM|owes/);
    expect(JSON.stringify([...kv.data])).toBe(before);
  });

  it('shows a rename, an owed node and a move', async () => {
    const node = (id: string) => ({ id, kind: ({ g: 'grammar', l: 'lexeme' } as const)[id[0] as 'g'], band: 'A1', priority: 1, title: id });
    const day = (key: string, over: Record<string, unknown> = {}) => ({ key, type: 'drill', focus: [], chunks: [], lexemes: [], ...over });
    const unit = {
      id: 'u01', band: 'A1', title: 'u', theme: 't', canDo: 'c', storyArc: 's',
      days: [day('u01-d9', { lexemes: ['l:new'] }), day('u01-d0', { focus: ['g:x'], lexemes: ['l:aa'] }), day('u01-d1'), day('u01-d2'), day('u01-d3'), day('u01-d4'), day('u01-d5')],
    };
    const one = (d: unknown) => async () => d;
    const files: ContentFiles = {
      graph: { '/content/graph/a.json': one(['g:x', 'l:aa', 'l:new'].map(node)) }, units: { '/content/units/u01.json': one(unit) },
      bank: {}, scripts: {}, story: {}, scenes: {}, writing: {},
      history: { migrations: { a: ContentMigration.parse({ id: 1, note: 't', nodes: { rename: { 'l:a': 'l:aa' } } }) } },
    };
    const kv = new MemoryKV();
    const l = await Learner.open(new IdbStore(kv), { now: () => AT });
    for (const id of ['g:x', 'l:a']) l.introduce(id, { results: [true, true, true] });
    await l.flush();
    await kv.set(UI_KEY, { ...emptyUi('x'), onboarded: true });
    await kv.set(PATH_KEY, { ...initialPath(), version: 2, unit: 0, day: 3, dayKey: 'u01-d2', unitId: 'u01' });
    const lines = await rehearse(await backupOf(kv), new ContentLoader(files));
    const text = lines.join('\n');
    expect(text).toMatch(/renames: 1 in nodes/);
    expect(text).toMatch(/owes 1 node\(s\) the course now teaches earlier: l:new/);
    expect(text).toMatch(/the learner stays on unit 0 day 3 \(u01-d2\)/);
  });

  it('refuses a file that is not a backup, in words', async () => {
    await expect(rehearse('{"hello":1}')).rejects.toBeInstanceOf(BackupError);
  });
});
