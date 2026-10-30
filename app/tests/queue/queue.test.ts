import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { hostname, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import {
  addJobs, burnLock, leaseNext, main, markDone, markFailed, paths, readJobs, release, requeueStale,
  retry, status, tryLock, withQueueLock, MAX_ATTEMPTS, APP_DIR,
} from '../../tools/queue';

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'fluidez-queue-')); });
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

const job = (id: string, extra: Record<string, unknown> = {}) => ({ id, kind: 'draft', band: 'A1', prompt: `do ${id}`, outputs: [`content/x/${id}.json`], ...extra });

describe('add / next / done', () => {
  test('leases ready jobs by priority, then band, then file order; respects deps', () => {
    addJobs([
      job('a1-mine', { priority: 5 }),
      job('a1-draft', { priority: 9, deps: ['a1-mine'] }),
      job('b1-mine', { band: 'B1', priority: 5 }),
      job('a2-mine', { band: 'A2', priority: 5 }),
      job('vocab-1', { kind: 'vocab', priority: 1 }),
    ], { dir });
    const first = leaseNext(2, { dir, by: 't' });
    expect(first.map((j) => j.id)).toEqual(['a1-mine', 'a2-mine']);
    expect(first[0].resolvedPrompt).toBe('do a1-mine');
    expect(readJobs(dir).find((j) => j.id === 'a1-mine')!.status).toBe('running');
    // a1-draft is blocked until a1-mine is done.
    expect(leaseNext(5, { dir }).map((j) => j.id)).toEqual(['b1-mine', 'vocab-1']);
    expect(leaseNext(5, { dir })).toEqual([]);
    markDone('a1-mine', { dir });
    expect(leaseNext(5, { dir }).map((j) => j.id)).toEqual(['a1-draft']);
  });

  test('rejects duplicates, unknown deps, cycles and invalid jobs without touching the file', () => {
    addJobs([job('a'), job('b', { deps: ['a'] })], { dir });
    const before = readFileSync(paths(dir).jobs, 'utf8');
    expect(() => addJobs(job('a'), { dir })).toThrow(/duplicate/);
    expect(() => addJobs(job('c', { deps: ['zzz'] }), { dir })).toThrow(/unknown dep/);
    expect(() => addJobs([job('x', { deps: ['y'] }), job('y', { deps: ['x'] })], { dir })).toThrow(/cycle/);
    expect(() => addJobs({ id: 'q', kind: 'draft', band: 'Z9', prompt: 'p' }, { dir })).toThrow();
    expect(() => addJobs({ id: 'q', kind: 'draft', band: 'A1' }, { dir })).toThrow(/prompt/);
    expect(readFileSync(paths(dir).jobs, 'utf8')).toBe(before);
  });

  test('promptRef is resolved at lease time', () => {
    addJobs(job('r', { prompt: undefined, promptRef: 'tests/queue/fixture-prompt.md' }), { dir });
    const [j] = leaseNext(1, { dir });
    expect(j.resolvedPrompt).toMatch(/fixture prompt/);
  });
});

describe('fail / retry / escalate', () => {
  test('attempts++ and back to pending until 3, then failed; the error reaches the next prompt', () => {
    addJobs(job('a', { model: 'sonnet' }), { dir });
    leaseNext(1, { dir });
    let j = markFailed('a', 'gate: 3 near-duplicates in bank/u01.json', { dir });
    expect([j.status, j.attempts, j.model]).toEqual(['pending', 1, 'sonnet']);
    const [again] = leaseNext(1, { dir });
    expect(again.resolvedPrompt).toMatch(/near-duplicates/);
    j = markFailed('a', 'still bad', { dir });
    expect([j.status, j.attempts, j.model, j.escalatedFrom]).toEqual(['pending', 2, 'opus', 'sonnet']);
    leaseNext(1, { dir });
    j = markFailed('a', 'third', { dir });
    expect([j.status, j.attempts]).toEqual(['failed', MAX_ATTEMPTS]);
    expect(j.log!.split('\n').filter((l) => l.startsWith('[')).length).toBe(3);
    expect(leaseNext(1, { dir })).toEqual([]);
    expect(() => markDone('a', { dir })).toThrow(/retry/);
    const s = status({ dir });
    expect(s.failures.map((f) => f.id)).toEqual(['a']);
    j = retry('a', { dir });
    expect([j.status, j.attempts, j.model]).toEqual(['pending', 0, 'sonnet']);
  });

  test('a failed dependency shows its dependants as blocked', () => {
    addJobs([job('a'), job('b', { deps: ['a'] }), job('c', { deps: ['b'] })], { dir });
    for (let i = 0; i < MAX_ATTEMPTS; i++) { leaseNext(1, { dir }); markFailed('a', 'x', { dir }); }
    expect(status({ dir }).blocked.map((b) => b.id)).toEqual(['b', 'c']);
  });
});

describe('leases', () => {
  test('requeue-stale returns only expired leases to pending, without counting an attempt', () => {
    addJobs([job('a'), job('b')], { dir });
    const t0 = Date.now();
    leaseNext(1, { dir, now: t0, leaseMin: 10 });
    leaseNext(1, { dir, now: t0, leaseMin: 60 });
    expect(requeueStale({ dir, now: t0 + 30 * 60_000 })).toEqual(['a']);
    const jobs = readJobs(dir);
    expect(jobs.map((j) => [j.id, j.status, j.attempts])).toEqual([['a', 'pending', 0], ['b', 'running', 0]]);
    expect(jobs[0].lease).toBeUndefined();
  });

  test('release by owner (usage-limit exit) puts leases back without an attempt', () => {
    addJobs([job('a'), job('b'), job('c')], { dir });
    leaseNext(2, { dir, by: 'burn-1' });
    leaseNext(1, { dir, by: 'burn-2' });
    expect(release({ by: 'burn-1' }, { dir }).sort()).toEqual(['a', 'b']);
    expect(readJobs(dir).map((j) => j.status)).toEqual(['pending', 'pending', 'running']);
  });
});

describe('locks and atomicity', () => {
  test('queue.lock is exclusive, removed after use, and broken when stale or its pid is dead', () => {
    const lock = paths(dir).lock;
    withQueueLock(dir, () => {
      expect(existsSync(lock)).toBe(true);
      expect(tryLock(lock).ok).toBe(false);
    });
    expect(existsSync(lock)).toBe(false);
    writeFileSync(lock, JSON.stringify({ pid: process.pid, at: Date.now() - 3 * 3_600_000, host: hostname() }));
    expect(tryLock(lock).ok).toBe(true); // older than 2h
    rmSync(lock);
    writeFileSync(lock, JSON.stringify({ pid: 2 ** 22 + 12345, at: Date.now(), host: hostname() }));
    expect(tryLock(lock).ok).toBe(true); // holder pid is gone
    rmSync(lock);
    writeFileSync(lock, JSON.stringify({ pid: process.pid, at: Date.now(), host: hostname() }));
    expect(() => withQueueLock(dir, () => 1, 200)).toThrow(/held/);
    rmSync(lock);
  });

  test('writes leave no temp files and the file is always parseable', () => {
    addJobs(Array.from({ length: 30 }, (_, i) => job(`j${i}`)), { dir });
    for (let i = 0; i < 10; i++) { leaseNext(2, { dir }); requeueStale({ dir, now: Date.now() + 1e9 }); }
    expect(readdirSync(dir).filter((f) => f.includes('.tmp-'))).toEqual([]);
    expect(readJobs(dir)).toHaveLength(30);
  });

  test('a corrupt line is an error, never silently dropped', () => {
    addJobs([job('a')], { dir });
    writeFileSync(paths(dir).jobs, readFileSync(paths(dir).jobs, 'utf8') + '{not json\n');
    expect(() => readJobs(dir)).toThrow(/line 2/);
  });

  test('burn.lock: acquire is exclusive while fresh, stale after the limit, release checks owner', () => {
    const now = Date.now();
    expect(burnLock('acquire', { dir, by: 'run-1', now }).ok).toBe(true);
    expect(burnLock('acquire', { dir, by: 'run-2', now: now + 60_000 }).ok).toBe(false);
    expect(burnLock('release', { dir, by: 'run-2' }).ok).toBe(false);
    expect(burnLock('refresh', { dir, by: 'run-1', now: now + 100 * 60_000 }).ok).toBe(true);
    expect(burnLock('acquire', { dir, by: 'run-2', now: now + 150 * 60_000 }).ok).toBe(false); // refreshed at +100
    expect(burnLock('acquire', { dir, by: 'run-2', now: now + 230 * 60_000 }).ok).toBe(true);  // > 2h since refresh
    expect(burnLock('release', { dir, by: 'run-2' }).ok).toBe(true);
    expect(existsSync(paths(dir).burnLock)).toBe(false);
  });
});

describe('CLI', () => {
  test('main() drives the same operations', () => {
    const write = process.stdout.write;
    const out: string[] = [];
    process.stdout.write = ((s: string) => { out.push(String(s)); return true; }) as typeof process.stdout.write;
    try {
      expect(main(['--dir', dir, 'add', JSON.stringify([job('a'), job('b', { band: 'A2' })])])).toBe(0);
      expect(main(['--dir', dir, 'next', '--n', '1', '--by', 'cli'])).toBe(0);
      expect(JSON.parse(out[1])[0].id).toBe('a');
      expect(main(['--dir', dir, 'fail', 'a', 'gate', 'said', 'no'])).toBe(0);
      expect(main(['--dir', dir, 'burn-lock', 'acquire', '--by', 'x'])).toBe(0);
      expect(main(['--dir', dir, 'burn-lock', 'acquire', '--by', 'y'])).toBe(3);
      expect(main(['--dir', dir, 'status'])).toBe(0);
      expect(out.at(-1)).toMatch(/A1.*1 pending/);
      expect(out.at(-1)).toMatch(/retrying:\n {2}a {2}attempt 1\/3/);
    } finally { process.stdout.write = write; }
  });

  test('parallel processes never lease the same job twice', async () => {
    addJobs(Array.from({ length: 24 }, (_, i) => job(`p${i}`)), { dir });
    const run = promisify(execFile);
    const tsx = resolve(__dirname, '../../node_modules/.bin/tsx');
    const queue = resolve(__dirname, '../../tools/queue.ts');
    const results = await Promise.all(Array.from({ length: 6 }, (_, i) =>
      run(tsx, [queue, '--dir', dir, 'next', '--n', '5', '--by', `w${i}`])));
    const ids = results.flatMap((r) => JSON.parse(r.stdout).map((j: { id: string }) => j.id));
    expect(ids.length).toBe(24);
    expect(new Set(ids).size).toBe(24);
    expect(readJobs(dir).every((j) => j.status === 'running')).toBe(true);
  }, 30_000);
});

describe('resolvePrompt', () => {
  test('rewrites the laptop app path to APP_DIR', () => {
    addJobs([job('p1', { prompt: 'APP = /Users/Matthew/Fluidez/app and cd /Users/Matthew/Fluidez/app/src; scratch /tmp/fluidez-burn/x' })], { dir });
    const [j] = leaseNext(1, { dir, by: 't' });
    expect(j.resolvedPrompt).toContain(APP_DIR);
    // On the laptop APP_DIR is the laptop path itself, so only assert absence elsewhere.
    if (APP_DIR !== '/Users/Matthew/Fluidez/app') expect(j.resolvedPrompt).not.toContain('/Users/Matthew/Fluidez/app');
    expect(j.resolvedPrompt).toContain(`APP = ${APP_DIR} and cd ${APP_DIR}/src`);
    expect(j.resolvedPrompt).toContain('/tmp/fluidez-burn/x');
  });
});
