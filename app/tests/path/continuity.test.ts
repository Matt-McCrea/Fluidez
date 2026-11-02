// The gate's continuity check: an id that shipped and has vanished needs an entry in
// content/_migrations; a retired id must not come back; the table must be whole; every day
// has its key. Then the real tree, which must pass with the two entries it has.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Unit } from '../../src/content/schema';
import { runGate, APP_DIR } from '../../tools/gate';
import {
  checkContinuity, emptyIds, packRows, packShipped, readLegacyPath, readMigrationFiles, readShippedIds, unpackRows, unpackShipped,
  type CourseIds, type MigrationFile,
} from '../../tools/gate/continuity';
import { collectIds } from '../../tools/shipped';
import { makeFixture } from '../gate/fixture';

const ids = (over: Partial<CourseIds> = {}): CourseIds => ({ ...emptyIds(), ...over });
const mig = (n: number, body: Record<string, unknown>): MigrationFile => {
  const raw = { id: n, note: 'test', ...body };
  return { file: `content/_migrations/${String(n).padStart(4, '0')}.json`, raw, parsed: raw as MigrationFile['parsed'] };
};
const unit = (id: string, keys: Array<string | undefined>): Unit => ({ id, days: keys.map((key) => ({ ...(key ? { key } : {}), type: 'drill', focus: [], chunks: [], lexemes: [] })) }) as unknown as Unit;
const run = (o: { current: CourseIds; shipped?: CourseIds; migrations?: MigrationFile[]; units?: Unit[] }) =>
  checkContinuity({ current: o.current, units: o.units ?? [], shipped: o.shipped, migrations: o.migrations ?? [] });
const problems = (o: Parameters<typeof run>[0]) => run(o).map((f) => f.problem);

describe('an id that shipped and is gone', () => {
  const shipped = ids({ nodes: ['g:a', 'l:old', 'l:kept'], rows: ['u01-0001', 'u01-0002'], days: ['u01-d0', 'u01-d1'], chapters: ['ch001'] });
  const current = ids({ nodes: ['g:a', 'l:new', 'l:kept'], rows: ['u01-0001'], days: ['u01-d0', 'u01-d1'], chapters: ['ch001'] });

  it('fails the gate with no entry, naming it and what to write', () => {
    const f = run({ current, shipped });
    expect(f.map((x) => x.problem).join(' | ')).toMatch(/1 node id\(s\) shipped and are gone with no content migration: l:old/);
    expect(f.map((x) => x.problem).join(' | ')).toMatch(/1 bank row id\(s\) shipped and are gone with no content migration: u01-0002/);
    expect(f.every((x) => x.severity === 'error' && x.check === 'continuity')).toBe(true);
    expect(f.find((x) => /l:old/.test(x.problem))?.fix).toMatch(/_migrations/);
  });

  it('passes when an entry renames or removes each', () => {
    const migrations = [mig(1, { nodes: { rename: { 'l:old': 'l:new' } } }), mig(2, { rows: { remove: ['u01-0002'] } })];
    expect(problems({ current, shipped, migrations })).toEqual([]);
  });

  it('fails a rename that lands on an id the content does not have', () => {
    const migrations = [mig(1, { nodes: { rename: { 'l:old': 'l:nowhere' } } }), mig(2, { rows: { remove: ['u01-0002'] } })];
    expect(problems({ current, shipped, migrations }).join('|')).toMatch(/l:old is renamed to l:nowhere, which is not in the content/);
  });

  it('follows a chain of renames', () => {
    const migrations = [mig(1, { nodes: { rename: { 'l:old': 'l:mid' } } }), mig(2, { nodes: { rename: { 'l:mid': 'l:new' } }, rows: { remove: ['u01-0002'] } })];
    expect(problems({ current, shipped, migrations })).toEqual([]);
  });

  it('fails a retired id that is back in the content', () => {
    const back = ids({ ...current, nodes: [...current.nodes, 'l:old'] });
    const migrations = [mig(1, { nodes: { rename: { 'l:old': 'l:new' } } }), mig(2, { rows: { remove: ['u01-0002'] } })];
    expect(problems({ current: back, shipped, migrations }).join('|')).toMatch(/node l:old was retired here and is back in the content/);
  });

  it('is not run when nothing has been snapshotted', () => {
    expect(problems({ current })).toEqual([]);
  });
});

describe('a day that shipped and is gone', () => {
  it('needs its key mapped, to the key it became or to null', () => {
    const shipped = ids({ days: ['u01-d0', 'u01-d1', 'u01-d2'] });
    const current = ids({ days: ['u01-d0', 'u01-d2', 'u01-d9'] });
    expect(problems({ current, shipped }).join('|')).toMatch(/1 day id\(s\) shipped and are gone with no content migration: u01-d1/);
    expect(problems({ current, shipped, migrations: [mig(1, { days: { 'u01-d1': 'u01-d9' } })] })).toEqual([]);
    expect(problems({ current, shipped, migrations: [mig(1, { days: { 'u01-d1': null } })] })).toEqual([]);
  });
});

describe('day keys on the units', () => {
  it('fails a day with no key, and two days with one key', () => {
    const f = problems({ current: ids(), units: [unit('u01', ['u01-d0', undefined, 'u01-d0'])] });
    expect(f).toEqual([expect.stringMatching(/day 1 has no key/), expect.stringMatching(/day 2 has the key u01-d0, which u01 day 0 has too/)]);
  });
  it('passes a course whose days all have their own', () => {
    expect(problems({ current: ids(), units: [unit('u01', ['u01-d0', 'u01-d1']), unit('u02', ['u02-d0', 'u01-d2'])] })).toEqual([]);
  });
});

describe('the table', () => {
  it('must be numbered from 1 with no gaps, each file named for its id', () => {
    const f = problems({ current: ids(), migrations: [mig(1, {}), mig(3, {})] });
    expect(f).toEqual([expect.stringMatching(/numbered 1, 2, 3 with no gaps.*entry 3 in position 2/)]);
  });
  it('reports a file that does not parse', () => {
    const bad: MigrationFile = { file: 'content/_migrations/0001.json', raw: {}, error: 'note Invalid input' };
    expect(problems({ current: ids(), migrations: [bad] })).toEqual(['note Invalid input']);
  });
});

describe('the shipped file', () => {
  it('packs row ids into ranges and gives back exactly them, whatever their shape', () => {
    const rows = ['u01-0001', 'u01-0002', 'u01-0003', 'u01-0010', 'u02-1', 'u02-2', 'u02-10', 'u60-t-x-0001', 'u60-t-x-0002', 'odd', 'x-9999', 'x-10000'];
    const packed = packRows(rows);
    expect(Object.keys(packed.rows).length).toBeLessThan(rows.length);
    expect(unpackRows(packed).sort()).toEqual([...rows].sort());
  });
  it('round-trips a course', () => {
    const c = ids({ nodes: ['g:a'], days: ['u01-d0'], rows: ['u01-0001', 'u01-0002'], chapters: ['ch001'], scenes: ['sc-u01-a'], tasks: ['w1'] });
    expect(unpackShipped(packShipped(c))).toEqual(c);
  });
});

describe('the gate on a tree', () => {
  it('reads content/_shipped and fails what vanished, and does not mistake the snapshot for content', () => {
    const fx = makeFixture();
    fx.write('_shipped/ids.json', packShipped(ids({ nodes: ['g:ser-identity', 'g:vanished'], days: ['u01-d0'] })));
    const r = runGate({ appDir: fx.app });
    const c = r.findings.filter((f) => f.check === 'continuity');
    expect(c.map((f) => f.problem).join('|')).toMatch(/node id\(s\) shipped and are gone with no content migration: g:vanished/);
    expect(c.map((f) => f.problem).join('|')).toMatch(/has no key/);
    expect(r.findings.filter((f) => f.check === 'schema' && /_shipped|_migrations/.test(f.file))).toEqual([]);
  });
  it('says nothing about continuity before a snapshot exists', () => {
    const fx = makeFixture();
    expect(runGate({ appDir: fx.app }).findings.filter((f) => f.check === 'continuity')).toEqual([]);
  });
});

describe('the real tree', () => {
  const content = join(APP_DIR, 'content');
  const units = readdirSync(join(content, 'units')).filter((f) => /^u\d{2}\.json$/.test(f)).sort().map((f) => Unit.parse(JSON.parse(readFileSync(join(content, 'units', f), 'utf8'))));

  it('has lost nothing that shipped, with the entries it has', () => {
    const shipped = readShippedIds(content);
    expect(shipped).toBeDefined();
    const f = checkContinuity({ current: collectIds(content), units, shipped: unpackShipped(shipped!), legacy: readLegacyPath(content), migrations: readMigrationFiles(content) });
    expect(f.map((x) => `${x.file} ${x.problem}`)).toEqual([]);
  });

  it('would fail without them: the two things that vanished are the two in the table', () => {
    const shipped = unpackShipped(readShippedIds(content)!);
    const f = checkContinuity({ current: collectIds(content), units, shipped, migrations: [] });
    const text = f.map((x) => x.problem).join(' | ');
    expect(text).toMatch(/1 node id\(s\).*l:profundar/);
    expect(text).toMatch(/7 bank row id\(s\).*u60-t-word-order-style-0022/);
    expect(f.length).toBe(2);
  });
});
