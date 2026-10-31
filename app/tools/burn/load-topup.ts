// Queues the repair jobs the gate asks for.
//
//   npx tsx tools/burn/load-topup.ts [--node g:x] [--scenes] [--dry]
//
// Default: one `bank-topup` job per grammar node that fewer than 12 bank rows target
// (the compiler's drill day needs rows to build its Read and pick / Your turn blocks from).
// --node forces one node even if it is not thin.
// --scenes: one `scene-fix` job per scene (or chapter) set for a unit day that requires a
// non-word node taught after that day, so the day runs without it (gate check `schedule`).
// Jobs whose id is already in the queue are skipped, so re-running is safe.
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadCurriculum, lateRequires } from '../gate/load';

const APP = '/Users/Matthew/Fluidez/app';
const SCRATCH = '/tmp/fluidez-burn';
const THIN = 12;
const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const dry = args.includes('--dry');
const only = opt('--node');
const scenesMode = args.includes('--scenes');

type Day = { type: string; focus: string[]; scene?: string; chapter?: string };
type Unit = { id: string; band: string; days: Day[] };
const units: Unit[] = readdirSync(join(APP, 'content/units')).filter((f) => /^u\d{2}\.json$/.test(f)).sort()
  .map((f) => JSON.parse(readFileSync(join(APP, 'content/units', f), 'utf8')));
const template = (name: string) => readFileSync(join(APP, 'tools/burn/prompts', name + '.md'), 'utf8');
function fill(name: string, vars: Record<string, string>): string {
  let t = template(name);
  for (const [k, v] of Object.entries(vars)) t = t.split(`{${k}}`).join(v);
  const header = Object.entries(vars).map(([k, v]) => `- ${k} = ${v}`).join('\n');
  return `Inputs for this job (already filled in below):\n${header}\n\n${t}`;
}

const existing = new Set<string>();
const qfile = join(APP, 'content/_queue/jobs.jsonl');
if (existsSync(qfile)) for (const line of readFileSync(qfile, 'utf8').split('\n')) if (line.trim()) existing.add(JSON.parse(line).id);

const jobs: any[] = [];
const slug = (n: string) => n.replace(/^[a-z]:/, '').replace(/[^a-z0-9]+/gi, '-');

// session index of every unit day, in course order
const session = new Map<string, number>();
{ let s = 0; for (const u of units) u.days.forEach((_, i) => session.set(`${u.id}#${i}`, ++s)); }

if (!scenesMode) {
  const count = new Map<string, number>();
  const dir = join(APP, 'content/bank');
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    for (const b of JSON.parse(readFileSync(join(dir, f), 'utf8')) as Array<{ targets?: string[] }>) for (const t of new Set(b.targets ?? [])) count.set(t, (count.get(t) ?? 0) + 1);
  }
  // each grammar node: its first unit, and its drill day (else the last day naming it)
  const where = new Map<string, { unit: Unit; day: number; drill: boolean }>();
  for (const u of units) u.days.forEach((d, i) => {
    for (const n of d.focus) {
      if (!n.startsWith('g:')) continue;
      const cur = where.get(n);
      if (!cur) where.set(n, { unit: u, day: i, drill: d.type === 'drill' });
      else if (cur.unit === u && !cur.drill) where.set(n, { unit: u, day: i, drill: d.type === 'drill' });
    }
  });
  for (const [node, w] of where) {
    const have = count.get(node) ?? 0;
    if (only ? node !== only : have >= THIN) continue;
    const id = `bank-topup-${w.unit.id}-${slug(node)}`;
    if (existing.has(id)) continue;
    const S = session.get(`${w.unit.id}#${w.day}`)!;
    const out = `content/bank/${w.unit.id}-topup-${slug(node)}.json`;
    const lowBand = false;
    jobs.push({
      id, kind: 'bank-topup', band: w.unit.band, unit: w.unit.id, priority: 5_000 - Number(w.unit.id.slice(1)) * 10, deps: [], status: 'pending', attempts: 0,
      model: 'sonnet', outputs: [out], prompt: fill('bank-topup', { UNIT: w.unit.id, NODE: node, SESSION: String(S), DAY: String(w.day + 1), HAVE: String(have), OUT: out, IDPREFIX: `${w.unit.id}-t-${slug(node)}`, APP, SCRATCH: `${SCRATCH}/${id}` }),
    });
    void lowBand;
  }
} else {
  const cur = loadCurriculum(APP);
  const sceneFile = (id: string) => join(APP, 'content/scenes', id + '.json');
  for (const u of cur.units) u.days.forEach((d, i) => {
    if (!d.scene || !existsSync(sceneFile(d.scene))) return;
    const S = cur.daySession.get(`${u.id}#${i}`)!;
    const sc = JSON.parse(readFileSync(sceneFile(d.scene), 'utf8')) as { requires?: string[] };
    const bad = lateRequires(cur, sc.requires ?? [], S);
    if (!bad.length) return;
    const id = `scene-fix-${d.scene}`;
    if (existing.has(id) || jobs.some((j) => j.id === id)) return;
    const low = u.band === 'A1' || u.band === 'A2';
    jobs.push({
      id, kind: 'scene-fix', band: u.band, unit: u.id, priority: 5_500 - Number(u.id.slice(1)) * 10, deps: [], status: 'pending', attempts: 0,
      model: low ? 'opus' : 'sonnet', outputs: [`content/scenes/${d.scene}.json`],
      prompt: fill('scene-fix', { UNIT: u.id, SCENE: d.scene, DAY: String(i + 1), SESSION: String(S), BAD: bad.map((b) => `${b} (taught at session ${cur.taughtAt.get(b)})`).join(', '), APP, SCRATCH: `${SCRATCH}/${id}` }),
    });
  });
}

const kind = scenesMode ? 'scene-fix' : 'bank-topup';
console.log(`${jobs.length} ${kind} jobs`);
for (const j of jobs) console.log(`  ${j.id}  (${j.unit}, ${j.model}) -> ${j.outputs.join(' ')}`);
if (!dry && jobs.length) {
  const tmp = join(SCRATCH, `topup-${Date.now()}.json`);
  mkdirSync(SCRATCH, { recursive: true });
  writeFileSync(tmp, JSON.stringify(jobs));
  execFileSync('npx', ['tsx', 'tools/queue.ts', 'add', '--file', tmp], { cwd: APP, stdio: 'inherit' });
}
