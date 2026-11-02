// npm run shipped -- keys
// npm run shipped -- snapshot [--content <dir>]... [--layout <dir>]
//
// The two chores that keep the course safe to rearrange (docs: content/_migrations, src/content/migrations.ts).
//
//   keys      give every unit day that has no key one, in place (content/units/*.json). A unit's first days
//             get `<unit>-d<index>`, as the days stood; a day added later gets the next number its unit has
//             not used, counting every key it ever shipped.
//   snapshot  add the ids in content/ (and in each --content dir, another tree of the same shape, such as
//             a git archive of the last release) to content/_shipped/ids.json. It only ever grows: an id
//             stays in it after it is retired, which is what lets the gate see a later one vanish. Run it
//             when a build is released. content/_shipped/path.json (where every day stood when positions
//             were two integers) is written once, from --layout (default: content/), and never again.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dayKeyOf, nextDayKey } from '../src/content/days';
import { ID_KINDS, packShipped, readShippedIds, SHIPPED_DIR, unpackShipped, emptyIds, type CourseIds } from './gate/continuity';

const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const readJson = (p: string): any => JSON.parse(readFileSync(p, 'utf8'));
/** A content file holds one record or an array of them. */
const records = (j: any): any[] => (Array.isArray(j) ? j : j && typeof j === 'object' ? [j] : []);
const jsonIn = (dir: string): string[] => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort().map((f) => join(dir, f)) : []);

/** The ids in a content tree, read straight from the files (no schema: this has to work on an old tree). */
export function collectIds(contentDir: string): CourseIds {
  const out = emptyIds();
  for (const p of jsonIn(join(contentDir, 'graph'))) for (const n of records(readJson(p))) out.nodes.push(n.id);
  for (const p of jsonIn(join(contentDir, 'units'))) {
    const u = readJson(p);
    (u.days ?? []).forEach((_: unknown, i: number) => out.days.push(dayKeyOf(u, i)));
  }
  for (const p of jsonIn(join(contentDir, 'bank'))) for (const r of records(readJson(p))) out.rows.push(r.id);
  for (const p of jsonIn(join(contentDir, 'story'))) for (const r of records(readJson(p))) out.chapters.push(r.id);
  for (const p of jsonIn(join(contentDir, 'scenes'))) for (const r of records(readJson(p))) out.scenes.push(r.id);
  for (const p of jsonIn(join(contentDir, 'writing'))) for (const r of records(readJson(p))) out.tasks.push(r.id);
  return out;
}

/** Where every day stands, unit by unit, in a content tree. */
export function layoutOf(contentDir: string): Record<string, string[]> {
  const units: Record<string, string[]> = {};
  for (const p of jsonIn(join(contentDir, 'units'))) {
    const u = readJson(p);
    units[u.id] = (u.days ?? []).map((_: unknown, i: number) => dayKeyOf(u, i));
  }
  return units;
}

/** Give each keyless day its key. Returns the files it wrote. */
export function giveKeys(contentDir: string, shippedDays: readonly string[] = []): string[] {
  const files = jsonIn(join(contentDir, 'units'));
  const taken = new Set<string>(shippedDays);
  const docs = files.map((p) => ({ p, text: readFileSync(p, 'utf8'), j: readJson(p) }));
  for (const d of docs) for (const day of d.j.days ?? []) if (day.key) taken.add(day.key);
  const wrote: string[] = [];
  for (const d of docs) {
    let changed = false;
    d.j.days = (d.j.days ?? []).map((day: any) => {
      if (day.key) return day;
      const key = nextDayKey(d.j.id, taken);
      taken.add(key);
      changed = true;
      return { key, ...day };
    });
    if (changed) { writeFileSync(d.p, JSON.stringify(d.j, null, 1) + (d.text.endsWith('\n') ? '\n' : '')); wrote.push(d.p); }
  }
  return wrote;
}

export function snapshot(contentDir: string, extra: readonly string[] = [], layout = contentDir): { ids: CourseIds; wrotePath: boolean } {
  const merged = emptyIds();
  const prior = readShippedIds(contentDir);
  const all: CourseIds[] = [...(prior ? [unpackShipped(prior)] : []), collectIds(contentDir), ...extra.map(collectIds)];
  for (const ids of all) for (const k of ID_KINDS) merged[k].push(...ids[k]);
  const dir = join(contentDir, SHIPPED_DIR);
  mkdirSync(dir, { recursive: true });
  const packed = packShipped(merged);
  writeFileSync(join(dir, 'ids.json'), JSON.stringify(packed, null, 1) + '\n');
  const pathFile = join(dir, 'path.json');
  let wrotePath = false;
  if (!existsSync(pathFile)) {
    const about = 'Where every day stood in the last build that kept a learner\'s place as two integers (unit, day). Those integers mean nothing without that course, so a path saved before day keys is read against this. Never regenerated.';
    writeFileSync(pathFile, JSON.stringify({ format: 1, about, units: layoutOf(layout) }, null, 1) + '\n');
    wrotePath = true;
  }
  return { ids: unpackShipped(packed), wrotePath };
}

function main(): void {
  const [cmd, ...rest] = process.argv.slice(2);
  const all = (name: string) => rest.flatMap((a, i) => (a === `--${name}` ? [resolve(rest[i + 1])] : []));
  const content = join(APP_DIR, 'content');
  if (cmd === 'keys') {
    const prior = readShippedIds(content);
    const wrote = giveKeys(content, prior?.days);
    console.log(wrote.length ? `gave keys to the days in ${wrote.length} unit file(s)` : 'every day has a key');
  } else if (cmd === 'snapshot') {
    const r = snapshot(content, all('content'), all('layout')[0] ?? content);
    console.log(`shipped: ${r.ids.nodes.length} nodes, ${r.ids.days.length} days, ${r.ids.rows.length} rows, ${r.ids.chapters.length} chapters, ${r.ids.scenes.length} scenes, ${r.ids.tasks.length} writing tasks${r.wrotePath ? '; wrote _shipped/path.json' : ''}`);
  } else {
    console.error('usage: npm run shipped -- keys | snapshot [--content <dir>]... [--layout <dir>]');
    process.exit(2);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
