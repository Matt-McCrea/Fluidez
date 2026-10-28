import { GraphNode, Unit } from '/Users/Matthew/Fluidez/app/src/content/schema.ts';
import fs from 'node:fs';
const D = '/Users/Matthew/Fluidez/app/content/';
let bad = 0; const ids = new Map<string, any>();
for (const f of ['grammar', 'patterns', 'chunks', 'contrasts', 'candos']) {
  const arr = JSON.parse(fs.readFileSync(D + 'graph/' + f + '.json', 'utf8'));
  for (const n of arr) { const r = GraphNode.safeParse(n); if (!r.success) { bad++; if (bad < 5) console.log(f, n.id, r.error.issues[0]); } if (ids.has(n.id)) { bad++; console.log('dup', n.id); } ids.set(n.id, n); }
  console.log(f, arr.length);
}
let ub = 0;
for (const f of fs.readdirSync(D + 'units').filter(f => f.endsWith('.json')).sort()) {
  const u = JSON.parse(fs.readFileSync(D + 'units/' + f, 'utf8')); const r = Unit.safeParse(u);
  if (!r.success) { ub++; console.log(f, r.error.issues[0]); }
  for (const d of u.days) for (const x of [...d.focus, ...d.chunks]) if (!ids.has(x)) { ub++; console.log(f, 'missing', x); }
}
// priority before requires
let pe = 0; for (const n of ids.values()) for (const r of n.requires) { const q = ids.get(r); if (!q) { pe++; console.log('missing req', n.id, r); } else if (q.priority > n.priority || (q.priority === n.priority && n.kind !== 'cando')) { pe++; if (pe < 5) console.log('order', n.id, r); } }
console.log('node schema failures', bad, 'unit failures', ub, 'order failures', pe);
