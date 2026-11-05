// Surgical edits to data/strand-lessons.js for the re-sequence (build.ts --apply).
// The file is 3.4 MB of hand-and-burn-written lesson objects; this touches only the metadata at the top of an
// entry (the `id:` line and, for an own-line `deeper:`, the next line) and leaves every other byte alone.
//   status:  'reference' puts the lesson on the shelf (off the path), null puts it back on the path
//   deeper:  the lessons a lesson links to as "go deeper"; ids are added, and ids named in `drop` are removed
// Idempotent: running it twice changes nothing the second time.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export type Edit = { id: string; status?: 'reference' | null; addDeeper?: string[]; dropDeeper?: string[] };

const FILE = 'data/strand-lessons.js';

export function patchStrandLessons(root: string, edits: Edit[], write: boolean): { changed: string[]; missing: string[] } {
  const path = join(root, FILE);
  let src = readFileSync(path, 'utf8');
  const changed: string[] = [], missing: string[] = [];
  const byId = new Map<string, Edit>();
  edits.forEach((e) => { const p = byId.get(e.id); byId.set(e.id, p ? { ...p, ...e, addDeeper: [...(p.addDeeper || []), ...(e.addDeeper || [])], dropDeeper: [...(p.dropDeeper || []), ...(e.dropDeeper || [])] } : e); });
  // an entry's `id:` line is the only top-level one at two spaces' indent (a comment may sit between the brace and it); the head runs to the first "\n  title:" line
  const re = /\n  id: '([^']+)'/g;
  const starts: Array<{ id: string; at: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) starts.push({ id: m[1], at: m.index + 1 });
  const seen = new Set<string>();
  const out: string[] = [];
  let cursor = 0;
  for (const s of starts) {
    const e = byId.get(s.id);
    if (!e) continue;
    seen.add(s.id);
    const titleAt = src.indexOf('\n  title:', s.at);
    if (titleAt < 0) throw new Error(`${s.id}: no title line`);
    const head = src.slice(s.at, titleAt);
    const next = patchHead(s.id, head, e);
    if (next !== head) { out.push(src.slice(cursor, s.at), next); cursor = titleAt; changed.push(s.id); }
  }
  out.push(src.slice(cursor));
  for (const id of byId.keys()) if (!seen.has(id)) missing.push(id);
  if (write && changed.length) writeFileSync(path, out.join(''));
  return { changed, missing };
}

function patchHead(id: string, head: string, e: Edit): string {
  let h = head;
  const idTok = `id: '${id}',`;
  if (e.status !== undefined) {
    const has = /\bstatus: 'reference',/.test(h);
    if (e.status === 'reference' && !has) {
      if (!h.includes(idTok)) throw new Error(`${id}: id line has no trailing comma`);
      h = h.replace(idTok, `${idTok} status: 'reference',`);
    } else if (e.status === null && has) {
      h = h.replace(/ status: 'reference',/, '');
      if (/\bstatus: 'reference'/.test(h)) throw new Error(`${id}: status could not be removed`);
    }
  }
  if (e.addDeeper?.length || e.dropDeeper?.length) {
    const dm = /deeper: \[([^\]]*)\],?/.exec(h);
    const cur = dm ? [...dm[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
    const drop = new Set(e.dropDeeper || []);
    const next = cur.filter((x) => !drop.has(x));
    for (const x of e.addDeeper || []) if (!next.includes(x) && x !== id) next.push(x);
    if (next.join('|') !== cur.join('|')) {
      const lit = `deeper: [${next.map((x) => `'${x}'`).join(', ')}],`;
      if (dm) {
        const from = dm.index, to = dm.index + dm[0].length;
        const ownLine = h.slice(h.lastIndexOf('\n', from - 1) + 1, from).trim() === '' && h[to] === '\n';
        if (next.length) h = h.slice(0, from) + lit + h.slice(to);
        else if (ownLine) h = h.slice(0, h.lastIndexOf('\n', from - 1)) + h.slice(to);
        else h = h.slice(0, from).replace(/ $/, '') + h.slice(to).replace(/^ /, ' ');
      } else if (next.length) {
        if (!h.includes(idTok)) throw new Error(`${id}: id line has no trailing comma`);
        h = h.replace(idTok, `${idTok} ${lit}`);
      }
    }
  }
  return h;
}
