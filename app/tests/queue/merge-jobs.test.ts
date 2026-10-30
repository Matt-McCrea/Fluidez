// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const DRIVER = resolve(__dirname, '../../tools/burn/merge-jobs.mjs');
type J = Record<string, unknown>;
const job = (id: string, extra: J = {}): J => ({ id, status: 'pending', attempts: 0, ...extra });
const lease = (by: string, until: string): J => ({ status: 'running', lease: { by, until } });

function merge(base: J[], ours: J[], theirs: J[]): J[] {
  const dir = mkdtempSync(join(tmpdir(), 'mj-'));
  const w = (n: string, a: J[]) => writeFileSync(join(dir, n), a.map((r) => JSON.stringify(r) + '\n').join(''));
  w('base', base); w('ours', ours); w('theirs', theirs);
  execFileSync('node', [DRIVER, join(dir, 'base'), join(dir, 'ours'), join(dir, 'theirs')]);
  return readFileSync(join(dir, 'ours'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}
const byId = (a: J[], id: string) => a.find((r) => r.id === id)!;

describe('merge-jobs driver', () => {
  const base = [job('a'), job('b')];

  it('takes the only side that changed', () => {
    const m = merge(base, base, [job('a'), job('b', { status: 'done' })]);
    expect(byId(m, 'b').status).toBe('done');
    expect(byId(m, 'a').status).toBe('pending');
  });

  it('done beats a lease on the same job', () => {
    const m = merge(base, [job('a', { status: 'done' }), job('b')], [job('a', lease('x', '2026-01-01T01:00Z')), job('b')]);
    expect(byId(m, 'a').status).toBe('done');
  });

  it('a lease beats a release', () => {
    const b = [job('a', lease('x', '2026-01-01T01:00Z'))];
    const m = merge(b, [job('a')], [job('a', lease('y', '2026-01-01T02:00Z'))]);
    expect(byId(m, 'a').lease).toEqual({ by: 'y', until: '2026-01-01T02:00Z' });
  });

  it('both leased: earlier lease wins', () => {
    const m = merge([job('a')], [job('a', lease('x', '2026-01-01T03:00Z'))], [job('a', lease('y', '2026-01-01T02:00Z'))]);
    expect((byId(m, 'a').lease as J).by).toBe('y');
  });

  it('concurrent adds are both kept', () => {
    const m = merge(base, [...base, job('c')], [...base, job('d')]);
    expect(m.map((r) => r.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('real scenario: ours done j3,j4; theirs leases j2,j5', () => {
    const b = ['j1', 'j2', 'j3', 'j4', 'j5', 'j6'].map((id) => job(id));
    const ours = b.map((r) => (r.id === 'j3' || r.id === 'j4' ? { ...r, status: 'done' } : r));
    const theirs = b.map((r) => (r.id === 'j2' || r.id === 'j5' ? { ...r, ...lease('t', '2026-01-01T05:00Z') } : r));
    const m = merge(b, ours, theirs);
    expect(m.map((r) => r.status)).toEqual(['pending', 'running', 'done', 'done', 'running', 'pending']);
    expect(byId(m, 'j2').lease).toBeTruthy();
    expect(byId(m, 'j5').lease).toBeTruthy();
  });
});
