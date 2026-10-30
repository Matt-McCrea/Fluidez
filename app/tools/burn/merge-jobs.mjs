// Git merge driver for content/_queue/jobs.jsonl: node merge-jobs.mjs <base> <ours> <theirs>
// Merges per job id; writes the result to <ours>. Exits non-zero only on unparseable input.
import { readFileSync, writeFileSync } from 'node:fs';

const [, , basePath, oursPath, theirsPath] = process.argv;

function load(path) {
  const map = new Map();
  let text = '';
  try { text = readFileSync(path, 'utf8'); } catch { return map; }
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const rec = JSON.parse(line);
    map.set(rec.id, rec);
  }
  return map;
}

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const isLeased = (r) => r.status === 'running' && !!r.lease;

function both(o, t) {
  if ((o.status === 'done') !== (t.status === 'done')) return o.status === 'done' ? o : t;
  if ((o.attempts ?? 0) !== (t.attempts ?? 0)) return (o.attempts ?? 0) > (t.attempts ?? 0) ? o : t;
  if (isLeased(o) !== isLeased(t)) return isLeased(o) ? o : t;
  if (isLeased(o) && isLeased(t)) return String(o.lease.until) <= String(t.lease.until) ? o : t;
  return t;
}

try {
  const base = load(basePath), ours = load(oursPath), theirs = load(theirsPath);
  const order = [...base.keys()];
  for (const id of ours.keys()) if (!base.has(id) && !order.includes(id)) order.push(id);
  for (const id of theirs.keys()) if (!base.has(id) && !order.includes(id)) order.push(id);
  const out = [];
  for (const id of order) {
    const b = base.get(id), o = ours.get(id), t = theirs.get(id);
    let r;
    if (!o && !t) continue;
    if (!b) r = o && t ? (eq(o, t) ? o : both(o, t)) : (o ?? t);
    else if (!o) r = eq(t, b) ? undefined : t; // deleted by ours
    else if (!t) r = eq(o, b) ? undefined : o; // deleted by theirs
    else if (eq(o, t)) r = o;
    else if (eq(o, b)) r = t;
    else if (eq(t, b)) r = o;
    else r = both(o, t);
    if (r) out.push(JSON.stringify(r) + '\n');
  }
  writeFileSync(oursPath, out.join(''));
} catch (e) {
  console.error('merge-jobs: ' + e.message);
  process.exit(1);
}
