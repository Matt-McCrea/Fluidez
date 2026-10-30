// The durable job queue for the content burn: content/_queue/jobs.jsonl, one
// job per line. Every read-modify-write holds content/_queue/queue.lock and
// writes atomically (temp file + rename), so concurrent runners and crashes
// can never leave a half-written queue.
//
//   npx tsx tools/queue.ts status                 counts per band/status, failures, last gate
//   npx tsx tools/queue.ts next --n 4 [--by ID] [--lease-min 120]
//                                                  lease up to N ready jobs; prints them as JSON
//   npx tsx tools/queue.ts done <id>
//   npx tsx tools/queue.ts fail <id> <msg> | --msg-file <path>
//                                                  attempts++; pending again until 3, then failed
//   npx tsx tools/queue.ts release <id...> | --by ID   lease back to pending, no attempt counted
//   npx tsx tools/queue.ts requeue-stale          expired leases → pending
//   npx tsx tools/queue.ts add '<json object or array>' | --file <path>
//   npx tsx tools/queue.ts retry <id>             failed → pending, attempts reset (human use)
//   npx tsx tools/queue.ts show <id>
//   npx tsx tools/queue.ts burn-lock acquire|release|refresh|show [--by ID] [--stale-min 120]
//
// Exit codes: 0 ok, 1 error, 3 burn-lock held by someone else (fresh).
// The queue directory is content/_queue next to this app, or $FLUIDEZ_QUEUE_DIR.
import { closeSync, existsSync, fsyncSync, openSync, readFileSync, renameSync, statSync, unlinkSync, writeSync } from 'node:fs';
import { hostname } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { z } from 'zod';
import { Band } from '../src/content/schema';

export const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_QUEUE_DIR = join(APP_DIR, 'content', '_queue');
export const MAX_ATTEMPTS = 3;
export const LOCK_STALE_MS = 2 * 3_600_000;
export const DEFAULT_LEASE_MIN = 120;
const LOG_MAX = 20_000;
const MSG_MAX = 6_000;

export const JobKind = z.string().regex(/^[a-z][a-z0-9-]*$/); // mine|draft|review|fix|gate|vocab|patterns|adapt|...
export const JobStatus = z.enum(['pending', 'running', 'done', 'failed']);
export type JobStatus = z.infer<typeof JobStatus>;
export const JobModel = z.enum(['opus', 'sonnet', 'haiku']);

export const Job = z.object({
  id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/),
  kind: JobKind,
  unit: z.string().optional(),
  band: Band,
  priority: z.number().default(0),          // higher runs first
  deps: z.array(z.string()).default([]),
  status: JobStatus.default('pending'),
  attempts: z.number().int().nonnegative().default(0),
  lease: z.object({ by: z.string(), until: z.number() }).optional(), // until = epoch ms
  model: JobModel.optional(),
  prompt: z.string().optional(),
  promptRef: z.string().optional(),         // path relative to app/, read at lease time
  outputs: z.array(z.string()).default([]), // paths relative to app/ the job may write
  log: z.string().optional(),               // appended failure history, newest last
  lastError: z.string().optional(),         // the most recent failure message in full (truncated)
  escalatedFrom: JobModel.optional(),       // set when the final attempt was moved to opus
  updatedAt: z.number().optional(),
}).refine((j) => j.prompt !== undefined || j.promptRef !== undefined, { message: 'job needs prompt or promptRef' });
export type Job = z.infer<typeof Job>;

const BAND_ORDER: Record<string, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

// ------------------------------------------------------------------ files

export function paths(dir = queueDir()) {
  return { dir, jobs: join(dir, 'jobs.jsonl'), lock: join(dir, 'queue.lock'), burnLock: join(dir, 'burn.lock'), lastGate: join(dir, 'last-gate.txt') };
}

export function queueDir(): string {
  return process.env.FLUIDEZ_QUEUE_DIR ? resolve(process.env.FLUIDEZ_QUEUE_DIR) : DEFAULT_QUEUE_DIR;
}

export function readJobs(dir = queueDir()): Job[] {
  const p = paths(dir).jobs;
  if (!existsSync(p)) return [];
  const out: Job[] = [];
  readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
    if (!line.trim()) return;
    let raw: unknown;
    try { raw = JSON.parse(line); } catch (e) { throw new Error(`jobs.jsonl line ${i + 1}: bad JSON: ${(e as Error).message}`); }
    const r = Job.safeParse(raw);
    if (!r.success) throw new Error(`jobs.jsonl line ${i + 1}: ${r.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`).join('; ')}`);
    out.push(r.data);
  });
  return out;
}

/** Write via temp file + fsync + rename: readers see the old file or the new one, never half. */
export function atomicWrite(file: string, text: string): void {
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
  const fd = openSync(tmp, 'w');
  try { writeSync(fd, text); fsyncSync(fd); } finally { closeSync(fd); }
  renameSync(tmp, file);
}

export function writeJobs(jobs: Job[], dir = queueDir()): void {
  atomicWrite(paths(dir).jobs, jobs.map((j) => JSON.stringify(j)).join('\n') + (jobs.length ? '\n' : ''));
}

// ------------------------------------------------------------------ locks

interface LockInfo { pid: number; at: number; host: string; by?: string }

function readLock(file: string): LockInfo | undefined {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return undefined; }
}

function pidAlive(pid: number): boolean {
  try { process.kill(pid, 0); return true; } catch (e) { return (e as NodeJS.ErrnoException).code === 'EPERM'; }
}

/** Try once to create `file` exclusively. Breaks the lock if stale. */
export function tryLock(file: string, opts: { staleMs?: number; by?: string; checkPid?: boolean; now?: number } = {}): { ok: true } | { ok: false; holder?: LockInfo } {
  const staleMs = opts.staleMs ?? LOCK_STALE_MS;
  for (let tries = 0; tries < 2; tries++) {
    try {
      const fd = openSync(file, 'wx');
      const info: LockInfo = { pid: process.pid, at: opts.now ?? Date.now(), host: hostname(), ...(opts.by ? { by: opts.by } : {}) };
      try { writeSync(fd, JSON.stringify(info)); fsyncSync(fd); } finally { closeSync(fd); }
      return { ok: true };
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e;
      const holder = readLock(file);
      const now = opts.now ?? Date.now();
      // An unreadable lock is either mid-write (fresh) or garbage; treat as stale only if old by mtime.
      const age = holder ? now - holder.at : 0;
      const dead = !!holder && opts.checkPid !== false && holder.host === hostname() && !pidAlive(holder.pid);
      if ((holder && age > staleMs) || dead || (!holder && tries === 0 && lockFileAgeMs(file, now) > staleMs)) {
        try { unlinkSync(file); } catch { /* someone else broke it first */ }
        continue;
      }
      return { ok: false, holder };
    }
  }
  return { ok: false, holder: readLock(file) };
}

function lockFileAgeMs(file: string, now: number): number {
  try { return now - statSync(file).mtimeMs; } catch { return 0; }
}

function sleepSync(ms: number) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

/** Run fn holding queue.lock; waits up to `waitMs` for another holder to finish. */
export function withQueueLock<T>(dir: string, fn: () => T, waitMs = 20_000): T {
  const file = paths(dir).lock;
  const deadline = Date.now() + waitMs;
  for (;;) {
    const r = tryLock(file);
    if (r.ok) break;
    if (Date.now() > deadline) throw new Error(`queue.lock held by ${JSON.stringify(r.holder)}; gave up after ${waitMs} ms`);
    sleepSync(50 + Math.random() * 100);
  }
  try { return fn(); } finally { try { unlinkSync(file); } catch { /* already gone */ } }
}

function mutate<T>(dir: string, fn: (jobs: Job[]) => T): T {
  return withQueueLock(dir, () => {
    const jobs = readJobs(dir);
    const out = fn(jobs);
    writeJobs(jobs, dir);
    return out;
  });
}

function find(jobs: Job[], id: string): Job {
  const j = jobs.find((x) => x.id === id);
  if (!j) throw new Error(`no such job: ${id}`);
  return j;
}

// ------------------------------------------------------------------ operations

export function isReady(j: Job, byId: Map<string, Job>): boolean {
  return j.status === 'pending' && j.deps.every((d) => byId.get(d)?.status === 'done');
}

export function readyOrder(jobs: Job[]): Job[] {
  const byId = new Map(jobs.map((j) => [j.id, j]));
  const index = new Map(jobs.map((j, i) => [j.id, i]));
  return jobs.filter((j) => isReady(j, byId)).sort((a, b) =>
    (b.priority - a.priority) || (BAND_ORDER[a.band] - BAND_ORDER[b.band]) || (index.get(a.id)! - index.get(b.id)!));
}

export interface LeasedJob extends Job { resolvedPrompt: string }

export function leaseNext(n: number, opts: { by?: string; leaseMin?: number; now?: number; dir?: string } = {}): LeasedJob[] {
  const dir = opts.dir ?? queueDir();
  const now = opts.now ?? Date.now();
  const by = opts.by ?? `pid-${process.pid}`;
  const leased = mutate(dir, (jobs) => {
    const pick = readyOrder(jobs).slice(0, Math.max(0, n));
    for (const j of pick) {
      j.status = 'running';
      j.lease = { by, until: now + (opts.leaseMin ?? DEFAULT_LEASE_MIN) * 60_000 };
      j.updatedAt = now;
    }
    return pick.map((j) => structuredClone(j));
  });
  return leased.map((j) => ({ ...j, resolvedPrompt: resolvePrompt(j) }));
}

export function resolvePrompt(j: Job): string {
  let text = j.prompt ?? '';
  if (j.promptRef) {
    const p = resolve(APP_DIR, j.promptRef);
    text = (text ? text + '\n\n' : '') + (existsSync(p) ? readFileSync(p, 'utf8') : `[promptRef missing: ${j.promptRef}]`);
  }
  text = text.split('/Users/Matthew/Fluidez/app').join(APP_DIR);
  if (j.lastError) text += `\n\n---\nPrevious attempt ${j.attempts} of ${MAX_ATTEMPTS} failed. Fix exactly this, keep everything else that passed:\n${j.lastError}`;
  return text;
}

export function markDone(id: string, opts: { dir?: string; now?: number } = {}): Job {
  return mutate(opts.dir ?? queueDir(), (jobs) => {
    const j = find(jobs, id);
    if (j.status === 'failed') throw new Error(`job ${id} is failed; use retry first`);
    j.status = 'done';
    delete j.lease;
    delete j.lastError;
    j.updatedAt = opts.now ?? Date.now();
    return structuredClone(j);
  });
}

export function markFailed(id: string, msg: string, opts: { dir?: string; now?: number } = {}): Job {
  const now = opts.now ?? Date.now();
  return mutate(opts.dir ?? queueDir(), (jobs) => {
    const j = find(jobs, id);
    if (j.status === 'done') throw new Error(`job ${id} is already done`);
    j.attempts += 1;
    const m = msg.length > MSG_MAX ? msg.slice(0, MSG_MAX / 2) + '\n…[truncated]…\n' + msg.slice(-MSG_MAX / 2) : msg;
    const entry = `[${new Date(now).toISOString()}] attempt ${j.attempts}${j.model ? ` (${j.model})` : ''}: ${m}`;
    const log = (j.log ? j.log + '\n' : '') + entry;
    j.log = log.length > LOG_MAX ? log.slice(-LOG_MAX) : log;
    j.lastError = m;
    delete j.lease;
    if (j.attempts >= MAX_ATTEMPTS) j.status = 'failed';
    else {
      j.status = 'pending';
      // The plan: up to 2 tries by the author, then the last attempt escalates to Opus.
      if (j.attempts === MAX_ATTEMPTS - 1 && j.model && j.model !== 'opus') { j.escalatedFrom = j.model; j.model = 'opus'; }
    }
    j.updatedAt = now;
    return structuredClone(j);
  });
}

/** Give leases back without counting an attempt (usage limits, aborted runs). */
export function release(sel: { ids?: string[]; by?: string }, opts: { dir?: string; now?: number } = {}): string[] {
  return mutate(opts.dir ?? queueDir(), (jobs) => {
    const out: string[] = [];
    for (const j of jobs) {
      if (j.status !== 'running') continue;
      if ((sel.ids && sel.ids.includes(j.id)) || (sel.by && j.lease?.by === sel.by)) {
        j.status = 'pending'; delete j.lease; j.updatedAt = opts.now ?? Date.now(); out.push(j.id);
      }
    }
    return out;
  });
}

export function requeueStale(opts: { dir?: string; now?: number } = {}): string[] {
  const now = opts.now ?? Date.now();
  return mutate(opts.dir ?? queueDir(), (jobs) => {
    const out: string[] = [];
    for (const j of jobs) {
      if (j.status === 'running' && (!j.lease || j.lease.until < now)) {
        j.status = 'pending'; delete j.lease; j.updatedAt = now; out.push(j.id);
      }
    }
    return out;
  });
}

export function retry(id: string, opts: { dir?: string; now?: number } = {}): Job {
  return mutate(opts.dir ?? queueDir(), (jobs) => {
    const j = find(jobs, id);
    j.status = 'pending'; j.attempts = 0; delete j.lease; j.updatedAt = opts.now ?? Date.now();
    if (j.escalatedFrom) { j.model = j.escalatedFrom; delete j.escalatedFrom; }
    return structuredClone(j);
  });
}

export function addJobs(input: unknown, opts: { dir?: string; now?: number } = {}): Job[] {
  const list = (Array.isArray(input) ? input : [input]).map((raw, i) => {
    const r = Job.safeParse(raw);
    if (!r.success) throw new Error(`job ${i}: ${r.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`).join('; ')}`);
    const j: Job = { ...r.data, status: 'pending', attempts: 0, updatedAt: opts.now ?? Date.now() };
    delete j.lease;
    return j;
  });
  return mutate(opts.dir ?? queueDir(), (jobs) => {
    const ids = new Set(jobs.map((j) => j.id));
    for (const j of list) {
      if (ids.has(j.id)) throw new Error(`duplicate job id: ${j.id}`);
      ids.add(j.id);
    }
    for (const j of list) for (const d of j.deps) if (!ids.has(d)) throw new Error(`job ${j.id}: unknown dep ${d}`);
    const all = [...jobs, ...list];
    assertAcyclic(all);
    jobs.push(...list);
    return list;
  });
}

function assertAcyclic(jobs: Job[]): void {
  const byId = new Map(jobs.map((j) => [j.id, j]));
  const state = new Map<string, 1 | 2>();
  const visit = (id: string, path: string[]) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) throw new Error(`dependency cycle: ${[...path, id].join(' → ')}`);
    state.set(id, 1);
    for (const d of byId.get(id)?.deps ?? []) visit(d, [...path, id]);
    state.set(id, 2);
  };
  for (const j of jobs) visit(j.id, []);
}

export interface Status {
  total: number;
  byStatus: Record<JobStatus, number>;
  byBand: Record<string, Record<JobStatus, number>>;
  ready: number;
  blocked: { id: string; on: string[] }[];   // pending jobs whose deps include a failed job
  running: { id: string; by: string; until: string; stale: boolean }[];
  failures: { id: string; attempts: number; lastError: string }[];
  retrying: { id: string; attempts: number }[];
}

export function status(opts: { dir?: string; now?: number } = {}): Status {
  const jobs = readJobs(opts.dir ?? queueDir());
  const now = opts.now ?? Date.now();
  const zero = (): Record<JobStatus, number> => ({ pending: 0, running: 0, done: 0, failed: 0 });
  const s: Status = { total: jobs.length, byStatus: zero(), byBand: {}, ready: readyOrder(jobs).length, blocked: [], running: [], failures: [], retrying: [] };
  const byId = new Map(jobs.map((j) => [j.id, j]));
  const failedUpstream = (j: Job, seen = new Set<string>()): string[] =>
    j.deps.flatMap((d) => { const x = byId.get(d); if (!x || seen.has(d)) return []; seen.add(d); return x.status === 'failed' ? [d] : failedUpstream(x, seen); });
  for (const j of jobs) {
    s.byStatus[j.status]++;
    (s.byBand[j.band] ??= zero())[j.status]++;
    if (j.status === 'failed') s.failures.push({ id: j.id, attempts: j.attempts, lastError: (j.lastError ?? '').slice(0, 400) });
    if (j.status === 'running') s.running.push({ id: j.id, by: j.lease?.by ?? '?', until: j.lease ? new Date(j.lease.until).toISOString() : '?', stale: !j.lease || j.lease.until < now });
    if (j.status === 'pending' && j.attempts > 0) s.retrying.push({ id: j.id, attempts: j.attempts });
    if (j.status === 'pending') { const on = failedUpstream(j); if (on.length) s.blocked.push({ id: j.id, on }); }
  }
  return s;
}

export function formatStatus(s: Status, dir = queueDir()): string {
  const lines: string[] = [];
  const row = (label: string, c: Record<JobStatus, number>) => `${label.padEnd(6)} ${String(c.done).padStart(5)} done ${String(c.running).padStart(4)} running ${String(c.pending).padStart(5)} pending ${String(c.failed).padStart(4)} failed`;
  lines.push(`queue: ${s.total} jobs, ${s.ready} ready now`);
  lines.push(row('all', s.byStatus));
  for (const b of Object.keys(s.byBand).sort((a, b) => (BAND_ORDER[a] ?? 9) - (BAND_ORDER[b] ?? 9))) lines.push(row(b, s.byBand[b]));
  if (s.running.length) lines.push('running:', ...s.running.map((r) => `  ${r.id}  by ${r.by} until ${r.until}${r.stale ? '  (STALE)' : ''}`));
  if (s.retrying.length) lines.push('retrying:', ...s.retrying.map((r) => `  ${r.id}  attempt ${r.attempts}/${MAX_ATTEMPTS} failed`));
  if (s.failures.length) lines.push('FAILED:', ...s.failures.map((f) => `  ${f.id}  (${f.attempts} attempts): ${f.lastError.split('\n')[0]}`));
  if (s.blocked.length) lines.push(`blocked by failures: ${s.blocked.length} jobs (${s.blocked.slice(0, 5).map((b) => b.id).join(', ')}${s.blocked.length > 5 ? ', …' : ''})`);
  const p = paths(dir);
  if (existsSync(p.lastGate)) lines.push('last gate:', ...readFileSync(p.lastGate, 'utf8').trimEnd().split('\n').slice(0, 25).map((l) => `  ${l}`));
  const bl = readLock(p.burnLock);
  if (bl) lines.push(`burn.lock: held by ${bl.by ?? bl.pid} since ${new Date(bl.at).toISOString()}`);
  return lines.join('\n');
}

// ------------------------------------------------------------------ burn lock

export function burnLock(action: 'acquire' | 'release' | 'refresh' | 'show', opts: { dir?: string; by?: string; staleMin?: number; now?: number } = {}): { ok: boolean; message: string } {
  const file = paths(opts.dir ?? queueDir()).burnLock;
  const staleMs = (opts.staleMin ?? 120) * 60_000;
  const now = opts.now ?? Date.now();
  const holder = readLock(file);
  const describe = (h?: LockInfo) => h ? `${h.by ?? `pid ${h.pid}`} since ${new Date(h.at).toISOString()} (${Math.round((now - h.at) / 60_000)} min ago)` : 'nobody';
  switch (action) {
    case 'show':
      return { ok: true, message: `burn.lock: ${describe(holder)}` };
    case 'acquire': {
      // The CLI process exits immediately, so its pid says nothing: staleness is by age only.
      const r = tryLock(file, { staleMs, by: opts.by, checkPid: false, now });
      return r.ok ? { ok: true, message: `burn.lock acquired by ${opts.by ?? process.pid}` } : { ok: false, message: `burn.lock held by ${describe(r.holder)}` };
    }
    case 'refresh': {
      if (!holder || (opts.by && holder.by !== opts.by)) return { ok: false, message: `burn.lock not held by ${opts.by}: ${describe(holder)}` };
      atomicWrite(file, JSON.stringify({ ...holder, at: now }));
      return { ok: true, message: 'burn.lock refreshed' };
    }
    case 'release': {
      if (!holder) return { ok: true, message: 'burn.lock was not held' };
      if (opts.by && holder.by && holder.by !== opts.by) return { ok: false, message: `burn.lock belongs to ${describe(holder)}; not releasing` };
      try { unlinkSync(file); } catch { /* gone */ }
      return { ok: true, message: 'burn.lock released' };
    }
  }
}

// ------------------------------------------------------------------ CLI

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
}

export function main(argv: string[]): number {
  const args = [...argv];
  const dir = flag(args, 'dir') ?? queueDir();
  const [cmd, ...rest] = args;
  const out = (x: unknown) => process.stdout.write((typeof x === 'string' ? x : JSON.stringify(x, null, 2)) + '\n');
  switch (cmd) {
    case 'status': {
      const s = status({ dir });
      if (rest.includes('--json')) out(s); else out(formatStatus(s, dir));
      return 0;
    }
    case 'next': {
      const n = Number(flag(rest, 'n') ?? '1');
      const by = flag(rest, 'by');
      const leaseMin = Number(flag(rest, 'lease-min') ?? DEFAULT_LEASE_MIN);
      out(leaseNext(n, { by, leaseMin, dir }));
      return 0;
    }
    case 'done':
      if (!rest[0]) throw new Error('usage: done <id>');
      for (const id of rest) out(`done ${markDone(id, { dir }).id}`);
      return 0;
    case 'fail': {
      const file = flag(rest, 'msg-file');
      const [id, ...msg] = rest;
      if (!id) throw new Error('usage: fail <id> <msg> | --msg-file <path>');
      const text = file ? readFileSync(file, 'utf8') : msg.join(' ') || 'failed (no message)';
      const j = markFailed(id, text, { dir });
      out(`${j.id}: attempt ${j.attempts}/${MAX_ATTEMPTS} failed → ${j.status}${j.escalatedFrom ? ` (escalated ${j.escalatedFrom} → opus)` : ''}`);
      return 0;
    }
    case 'release': {
      const by = flag(rest, 'by');
      const ids = release({ ids: rest.length ? rest : undefined, by }, { dir });
      out(`released ${ids.length}: ${ids.join(' ')}`);
      return 0;
    }
    case 'requeue-stale': {
      const ids = requeueStale({ dir });
      out(`requeued ${ids.length} stale: ${ids.join(' ')}`);
      return 0;
    }
    case 'add': {
      const file = flag(rest, 'file');
      const text = file ? readFileSync(file, 'utf8') : rest.join(' ');
      const trimmed = text.trim();
      let input: unknown;
      try { input = JSON.parse(trimmed); } catch { // JSONL accepted too
        input = trimmed.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
      }
      const added = addJobs(input, { dir });
      out(`added ${added.length}: ${added.map((j) => j.id).join(' ')}`);
      return 0;
    }
    case 'retry':
      for (const id of rest) out(`retry ${retry(id, { dir }).id}`);
      return 0;
    case 'show':
      out(find(readJobs(dir), rest[0] ?? ''));
      return 0;
    case 'burn-lock': {
      const action = rest[0] as 'acquire' | 'release' | 'refresh' | 'show';
      if (!['acquire', 'release', 'refresh', 'show'].includes(action)) throw new Error('usage: burn-lock acquire|release|refresh|show [--by ID] [--stale-min N]');
      const by = flag(rest, 'by');
      const staleMin = flag(rest, 'stale-min');
      const r = burnLock(action, { dir, by, staleMin: staleMin ? Number(staleMin) : undefined });
      out(r.message);
      return r.ok ? 0 : 3;
    }
    default:
      out('usage: queue.ts status|next --n N|done <id>|fail <id> <msg>|release <id...>|requeue-stale|add <json>|retry <id>|show <id>|burn-lock <action>');
      return cmd ? 1 : 0;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) {
    process.stderr.write(`queue: ${(e as Error).message}\n`);
    process.exitCode = 1;
  }
}
