// Builds the content-burn job queue from the unit map.
//
//   npx tsx tools/burn/load-queue.ts [--from u04] [--to u60] [--dry] [--pass 1|2]
//
// One chain of jobs per unit:
//   scripts-uNN, bank-uNN, scenes-uNN, writing-uNN  (independent)
//   story-uNN                                       (after story of the previous unit)
//   review-uNN                                      (after all of the above)
// Pass 2 tops the bank up from the first-pass size towards the full 3× quota once
// every unit has a first pass; its jobs rank below every pass-1 job.
// Jobs whose id is already in the queue are skipped, so re-running is safe.
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const APP = '/Users/Matthew/Fluidez/app';
const SCRATCH = '/tmp/fluidez-burn';
const args = process.argv.slice(2);
const opt = (k: string, d?: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const from = opt('--from', 'u04')!, to = opt('--to', 'u60')!;
const pass = Number(opt('--pass', '1'));
const dry = args.includes('--dry');

type Day = { type: string; focus: string[]; chunks: string[]; chapter?: string; scene?: string };
type Unit = { id: string; band: string; days: Day[] };

const units: Unit[] = readdirSync(join(APP, 'content/units')).filter((f) => /^u\d{2}\.json$/.test(f)).sort()
  .map((f) => JSON.parse(readFileSync(join(APP, 'content/units', f), 'utf8')));
const quotas = JSON.parse(readFileSync(join(APP, 'content/_reports/quotas.json'), 'utf8')).units as Record<string, any>;
const haveScript = new Set(readdirSync(join(APP, 'content/scripts')).map((f) => f.replace(/\.json$/, '').replace('_', ':')));
const template = (name: string) => readFileSync(join(APP, 'tools/burn/prompts', name + '.md'), 'utf8');

// a node's script belongs to the first unit whose day focus lists it
const firstUnit = new Map<string, string>();
for (const u of units) for (const d of u.days) for (const n of d.focus) if (!firstUnit.has(n)) firstUnit.set(n, u.id);

const existing = new Set<string>();
const qfile = join(APP, 'content/_queue/jobs.jsonl');
if (existsSync(qfile)) for (const line of readFileSync(qfile, 'utf8').split('\n')) if (line.trim()) existing.add(JSON.parse(line).id);

function fill(name: string, vars: Record<string, string>): string {
  let t = template(name);
  for (const [k, v] of Object.entries(vars)) t = t.split(`{${k}}`).join(v);
  const header = Object.entries(vars).map(([k, v]) => `- ${k} = ${v}`).join('\n');
  return `Inputs for this job (already filled in below):\n${header}\n\n${t}`;
}

const band = (u: Unit) => u.band;
const order = (u: Unit) => Number(u.id.slice(1));
const jobs: any[] = [];
const inRange = units.filter((u) => u.id >= from && u.id <= to);

for (const u of inRange) {
  const q = quotas[u.id] ?? {};
  const base = (pass === 1 ? 10_000 : 1_000) - order(u) * 10; // pass 1 first, then unit order
  const job = (id: string, kind: string, model: string, outputs: string[], prompt: string, deps: string[], p: number) => {
    if (existing.has(id)) return;
    jobs.push({ id, kind, band: band(u), unit: u.id, priority: p, deps, status: 'pending', attempts: 0, model, prompt, outputs });
  };
  const scratch = (id: string) => `${SCRATCH}/${id}`;
  const lowBand = u.band === 'A1' || u.band === 'A2';

  if (pass === 1) {
    const nodes = [...firstUnit].filter(([n, uid]) => uid === u.id && /^[gpx]:/.test(n) && !haveScript.has(n)).map(([n]) => n);
    const ids: string[] = [];
    if (nodes.length) {
      // big units split scripts into two jobs so no agent writes more than ~6
      const chunks: string[][] = [];
      for (let i = 0; i < nodes.length; i += 6) chunks.push(nodes.slice(i, i + 6));
      chunks.forEach((ns, k) => {
        const id = `scripts-${u.id}${chunks.length > 1 ? `-${k + 1}` : ''}`;
        ids.push(id);
        job(id, 'scripts', lowBand ? 'opus' : 'sonnet',
          ns.map((n) => `content/scripts/${n.replace(':', '_')}.json`),
          fill('scripts', { UNIT: u.id, NODES: ns.join(' '), APP, SCRATCH: scratch(id) }), [], base + 5);
      });
    }
    const bankCount = Math.ceil(1.15 * (q.p95Demand?.sentences ?? 0)) || (q.bankSentences ?? 0);
    job(`bank-${u.id}`, 'bank', 'sonnet', [`content/bank/${u.id}.json`],
      fill('bank', { UNIT: u.id, APP, SCRATCH: scratch(`bank-${u.id}`) }) + `\n\nTarget size for this unit: ${bankCount} sentences.`, [], base + 4);
    ids.push(`bank-${u.id}`);

    const nScenes = q.scenes ?? 3;
    const sceneIds = Array.from({ length: nScenes }, (_, i) => `sc-${u.id}-${String.fromCharCode(97 + i)}`);
    job(`scenes-${u.id}`, 'scenes', lowBand ? 'opus' : 'sonnet', sceneIds.map((s) => `content/scenes/${s}.json`),
      fill('scenes', { UNIT: u.id, SCENES: sceneIds.join(' '), APP, SCRATCH: scratch(`scenes-${u.id}`) }), [], base + 3);
    ids.push(`scenes-${u.id}`);

    const nWriting = q.writingTasks ?? 12;
    job(`writing-${u.id}`, 'writing', 'sonnet', [`content/writing/${u.id}.json`],
      fill('writing', { UNIT: u.id, COUNT: String(nWriting), APP, SCRATCH: scratch(`writing-${u.id}`) }), [], base + 3);
    ids.push(`writing-${u.id}`);

    const chapters = u.days.map((d) => d.chapter).filter((c): c is string => !!c && !existsSync(join(APP, 'content/story', c + '.json')));
    if (chapters.length) {
      const prev = units[units.indexOf(u) - 1];
      const prevStory = prev && units.indexOf(u) > 0 && inRange.includes(prev) ? [`story-${prev.id}`] : [];
      job(`story-${u.id}`, 'story', 'opus', chapters.map((c) => `content/story/${c}.json`),
        fill('story', { UNITS: u.id, CHAPTERS: chapters.join(' '), APP }), prevStory, base + 6);
      ids.push(`story-${u.id}`);
    }

    const all = jobs.filter((j) => j.unit === u.id).flatMap((j) => j.outputs);
    job(`review-${u.id}`, 'review', 'opus', all, fill('review', { UNIT: u.id, APP }), ids, base + 1);
  } else {
    const full = q.bankSentences ?? 0;
    job(`bank2-${u.id}`, 'bank', 'sonnet', [`content/bank/${u.id}-2.json`],
      fill('bank', { UNIT: u.id, APP, SCRATCH: scratch(`bank2-${u.id}`) }).split(`content/bank/${u.id}.json`).join(`content/bank/${u.id}-2.json`)
        + `\n\nThis is a TOP-UP file. content/bank/${u.id}.json already exists: read it and write ${Math.max(0, full - countBank(u.id))} NEW sentences that duplicate none of it (ids ${u.id}-2-0001…). Same rules.`,
      [`review-${u.id}`], base);
  }
}

function countBank(uid: string): number {
  const f = join(APP, 'content/bank', uid + '.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')).length : 0;
}

console.log(`${jobs.length} jobs (${new Set(jobs.map((j) => j.unit)).size} units, pass ${pass})`);
const byKind: Record<string, number> = {};
for (const j of jobs) byKind[j.kind] = (byKind[j.kind] ?? 0) + 1;
console.log(byKind);
if (!dry && jobs.length) {
  const tmp = join(SCRATCH, `load-${Date.now()}.json`);
  mkdirSync(SCRATCH, { recursive: true });
  writeFileSync(tmp, JSON.stringify(jobs));
  execFileSync('npx', ['tsx', 'tools/queue.ts', 'add', '--file', tmp], { cwd: APP, stdio: 'inherit' });
}
