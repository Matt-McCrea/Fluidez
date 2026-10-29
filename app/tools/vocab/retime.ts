/* ============================================================================
 * VOCAB / RETIME — apply the lexeme timing rules to the PUBLISHED inventory.
 *
 *   npx tsx tools/vocab/retime.ts          apply and write
 *   npx tsx tools/vocab/retime.ts --dry    print what would move
 *
 * build.ts picks and places the inventory from scratch; once content is written
 * against content/graph/lexemes.json its ids must stay, so this script re-times
 * the words in place. It only ever moves a word EARLIER:
 *   (a) every lexeme in a chunk's or pattern's `es` / `match` is needed by the
 *       node's day (first unit day that schedules it, else its priority);
 *   (b) numbers 0–100 and mil by u01's Input day, hundreds and millón by u03's;
 *   (d) a feminine person noun by its masculine's session (profesora ~ profesor);
 *   (c) curated/timing.txt: "<lemma> <TAB> uNN|sNNN" — needed by that unit's last
 *       day, or by that session.
 * A word needed before its priority:
 *   - closed or receptive (on no unit day): its priority becomes the need;
 *   - taught (on a unit day): it moves to the latest day on or before the need
 *     with a free slot (the slot it leaves is refilled by the commonest
 *     receptive word of the band due on or after that day); if every such day
 *     is full, it SWAPS with the rarest word there (rarer than itself, not one
 *     of the unit's theme seeds in curated/units.tsv) that no rule needs that
 *     early: that word is carded on the later day and keeps its old session as
 *     its priority, so it is known exactly when it was before. A swap never pushes a card more
 *     than MAX_PUSH sessions later.
 *     If every day up to the need is full of needed words, only its priority
 *     moves (the gate treats a lexeme as known from min(card day, priority)).
 *     Day caps (build-config CAP) are never exceeded.
 *   A unit whose bank is written (content/bank/uNN.json) is frozen: its card lists never change,
 *   so a word carded there, or needed before any unfrozen day, moves by priority only.
 * Writes only `"priority": N` values in lexemes.json (targeted replacement, the
 * file's formatting is kept) and the units' day `lexemes` arrays.
 * ========================================================================== */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tagSentence } from '../../src/engine/tagger';
import { registerLexemes } from '../../src/engine/tagger/lexicon';
import { GraphNode, Unit } from '../../src/content/schema';
import { CAP } from './build-config';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..', '..');
const DRY = process.argv.includes('--dry');
const LEX_PATH = join(APP, 'content', 'graph', 'lexemes.json');

const unitFiles = readdirSync(join(APP, 'content', 'units')).filter((f) => /^u\d\d\.json$/.test(f)).sort();
const rawUnits = unitFiles.map((f) => JSON.parse(readFileSync(join(APP, 'content', 'units', f), 'utf8')) as { id: string; days: Array<{ lexemes: string[] }> });
const units = rawUnits.map((u) => Unit.parse(u));
const graph: GraphNode[] = ['chunks', 'patterns', 'grammar']
  .flatMap((f) => (JSON.parse(readFileSync(join(APP, 'content', 'graph', f + '.json'), 'utf8')) as unknown[]).map((n) => GraphNode.parse(n)));
const lexText = readFileSync(LEX_PATH, 'utf8');
const lex = (JSON.parse(lexText) as unknown[]).map((n) => GraphNode.parse(n));
const lexById = new Map(lex.map((n) => [n.id, n]));
registerLexemes(lex.map((n) => ({ lemma: n.id.replace(/^l:/, '').replace(/#.*/, ''), pos: n.pos, gender: n.gender })));

/* ---- sessions and days ---- */
interface Day { unit: string; band: string; di: number; type: string; session: number; cap: number; ids: string[] }
const days: Day[] = [];
// a unit whose bank is written is frozen: its days' card lists stay exactly as they are (content was
// written against them), so a word carded there, or needed by then, only moves by priority
const frozen = new Set(units.filter((u) => existsSync(join(APP, 'content', 'bank', u.id + '.json'))).map((u) => u.id));
{
  let s = 0;
  units.forEach((u, ui) => u.days.forEach((d, di) => {
    s++;
    const ids = rawUnits[ui].days[di].lexemes;
    // (a hand-edited day may already hold more than its type's cap: never more than it has)
    days.push({ unit: u.id, band: u.band, di, type: d.type, session: s, cap: Math.max(CAP[u.band][d.type] ?? 0, ids.length), ids });
  }));
}
const unitDays = (id: string) => days.filter((d) => d.unit === id);
const dayOf = new Map<string, Day>();
for (const d of days) for (const id of d.ids) if (!dayOf.has(id)) dayOf.set(id, d);
const prio = new Map(lex.map((n) => [n.id, n.priority]));
const sessionOf = (id: string) => Math.min(dayOf.get(id)?.session ?? Infinity, prio.get(id)!);

/* ---- needs ---- */
const need = new Map<string, { at: number; why: string }>();
const setNeed = (id: string, at: number, why: string) => {
  if (!lexById.has(id)) return;
  const n = need.get(id);
  if (!n || at < n.at) need.set(id, { at, why });
};
const firstDay = new Map<string, number>();
for (const d of days) for (const id of [...units.find((u) => u.id === d.unit)!.days[d.di].focus, ...units.find((u) => u.id === d.unit)!.days[d.di].chunks]) if (!firstDay.has(id)) firstDay.set(id, d.session);
// (a) chunk and pattern words
for (const n of graph) {
  if (n.kind !== 'chunk' && n.kind !== 'pattern') continue;
  const at = firstDay.get(n.id) ?? n.priority;
  const texts = [...(n.es ?? '').split(/\s+[—/]\s+|[.!?¿¡:;]\s*/), ...(n.match ?? [])];
  for (const t of texts) {
    if (!t.trim()) continue;
    let r;
    try { r = tagSentence(t); } catch { continue; }
    for (const f of r.features) if (f.key.startsWith('lex.')) setNeed('l:' + f.key.slice(4), at, n.id);
  }
}
// (b) numbers
const firstInput = (u: string) => (unitDays(u).find((d) => d.type === 'input') ?? unitDays(u)[0]).session;
for (const n of lex) {
  const l = n.id.slice(2);
  if (/^(cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieciséis|diecisiete|dieciocho|diecinueve|veinte|veinti.*|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|ciento|mil)$/.test(l)) setNeed(n.id, firstInput('u01'), 'numbers 0–100, mil (u01)');
  if (/^(doscientos|trescientos|cuatrocientos|quinientos|seiscientos|setecientos|ochocientos|novecientos|millón)$/.test(l)) setNeed(n.id, firstInput('u03'), 'hundreds, millón (u03)');
}
// (c) curated timing
const missing: string[] = [];
for (const line of readFileSync(join(HERE, 'curated', 'timing.txt'), 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [lemma, when] = line.split('\t').map((x) => x.trim());
  const id = 'l:' + lemma;
  const at = /^u\d\d$/.test(when) ? unitDays(when).at(-1)?.session : /^s\d+$/.test(when) ? Number(when.slice(1)) : undefined;
  if (!lexById.has(id) || at === undefined) { missing.push(`${lemma} ${when}`); continue; }
  setNeed(id, at, 'timing.txt ' + when);
}

// (d) a feminine person noun is known with its masculine (profesora with profesor, médica with médico)
for (const n of lex) {
  if (n.pos !== 'noun' || !/(ora|ica|iga|ada|ana|esa|ona|ina|era|ela|ita|ía)$/.test(n.id)) continue;
  const base = n.id.slice(0, -1);
  for (const m of [base + 'o', base, base.replace(/es$/, 'és').replace(/on$/, 'ón').replace(/an$/, 'án')]) {
    const mn = lexById.get(m);
    if (!mn || mn.pos !== 'noun' || m === n.id) continue;
    setNeed(n.id, Math.min(sessionOf(m), need.get(m)?.at ?? Infinity), `feminine of ${m}`);
    break;
  }
}

// a unit's theme seeds (curated/units.tsv) keep their cards: they are what the unit is about
const seedOf = new Map<string, Set<string>>();
for (const line of readFileSync(join(HERE, 'curated', 'units.tsv'), 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [u, ...ws] = line.split('\t').map((x) => x.trim()).filter(Boolean);
  seedOf.set(u, new Set(ws.map((w) => 'l:' + w)));
}

/* ---- apply ---- */
const MAX_PUSH = 40;
const moved: string[] = [];
const evicted: string[] = [];
const promoted: string[] = [];
const swappedOut = new Set<string>();   // a word is pushed to a later card day at most once
const isTaught = (id: string) => dayOf.has(id);
const freqRank = (id: string) => lexById.get(id)?.freqRank ?? 1e9;
const needAt = (id: string) => need.get(id)?.at ?? Infinity;
const late = [...need.entries()].filter(([id, n]) => n.at < sessionOf(id)).sort((a, b) => a[1].at - b[1].at || freqRank(a[0]) - freqRank(b[0]));
const refillable = (d: Day) => lex.filter((n) => !isTaught(n.id) && (n.note ?? '').startsWith('receptive') && n.priority >= d.session
  && n.band === d.band && ['noun', 'verb', 'adj', 'adv'].includes(n.pos ?? '') && needAt(n.id) >= d.session)
  .sort((a, b) => (a.freqRank ?? 1e9) - (b.freqRank ?? 1e9));

for (const [id, n] of late) {
  const from = sessionOf(id);
  if (!isTaught(id)) { prio.set(id, n.at); moved.push(`${id} ${from}→${n.at} (${n.why})`); continue; }
  const old = dayOf.get(id)!;
  if (frozen.has(old.unit)) { prio.set(id, n.at); moved.push(`${id} ${from}→${n.at} (${n.why}; priority only, carded in written ${old.unit})`); continue; }
  const before = days.filter((d) => d.session <= n.at && d.cap > 0 && !frozen.has(d.unit));
  const target = [...before].reverse().find((d) => d.ids.length < d.cap);
  if (target) {
    old.ids.splice(old.ids.indexOf(id), 1);
    target.ids.push(id);
    dayOf.set(id, target);
    prio.set(id, target.session);
    moved.push(`${id} ${from}→${target.session} (${n.why}; ${target.unit} day ${target.di + 1})`);
    // refill the slot it left with the commonest receptive word of that band due then or later
    const y = refillable(old)[0];
    if (y) {
      old.ids.push(y.id);
      dayOf.set(y.id, old);
      promoted.push(`${y.id} ${y.priority}→${old.session} (now carded, ${old.unit} day ${old.di + 1})`);
      prio.set(y.id, old.session);
      y.note = 'taught';   // not receptive any more for the next refill
    }
    continue;
  }
  // SWAP with the rarest word on the latest full day on or before the need that nothing needs
  // that early (rarer than this one, not a theme seed of its unit): that word is carded on this
  // word's old day instead, and stays known from its old session (its priority)
  // (never pushes a card more than MAX_PUSH sessions later: a word known for months with no card is
  // worse than a story word known-not-carded)
  let swapped = false;
  for (const d of [...before].reverse()) {
    if (old.session - d.session > MAX_PUSH) break;
    const x = d.ids.filter((y) => needAt(y) > d.session && freqRank(y) > freqRank(id) && !seedOf.get(d.unit)?.has(y) && !swappedOut.has(y) && !moved.some((m) => m.startsWith(y + ' '))).sort((a, b) => freqRank(b) - freqRank(a))[0];
    if (!x) continue;
    d.ids[d.ids.indexOf(x)] = id;
    old.ids[old.ids.indexOf(id)] = x;
    dayOf.set(id, d); dayOf.set(x, old);
    prio.set(id, d.session);
    prio.set(x, Math.min(prio.get(x)!, d.session));
    swappedOut.add(x);
    moved.push(`${id} ${from}→${d.session} (${n.why}; ${d.unit} day ${d.di + 1})`);
    evicted.push(`${x} carded ${old.unit} day ${old.di + 1} (s${old.session}) instead of ${d.unit} day ${d.di + 1}; still known from s${d.session}`);
    swapped = true;
    break;
  }
  if (!swapped) {
    // every day up to the need is full of words needed there: the word is known from the need
    // (its priority; the gate reads min(day, priority)) and still carded on its own day
    prio.set(id, n.at);
    moved.push(`${id} ${from}→${n.at} (${n.why}; priority only, still carded ${old.unit} day ${old.di + 1})`);
  }
}

for (const d of days) if (d.ids.length > d.cap && d.cap) throw new Error(`over cap ${d.unit}:${d.di}`);

console.log(`retime: ${moved.length} moved earlier, ${evicted.length} swapped to a later card day (known as before), ${promoted.length} promoted to fill a slot`);
for (const m of moved) console.log('  moved    ' + m);
for (const m of evicted) console.log('  swapped  ' + m);
for (const m of promoted) console.log('  promoted ' + m);
if (missing.length) console.log('  timing.txt lines with no lexeme in the graph: ' + missing.join(', '));

if (!DRY) {
  // targeted replacement of each changed node's priority
  let text = lexText;
  let changes = 0;
  for (const n of lex) {
    const p = prio.get(n.id)!;
    if (p === n.priority) continue;
    const key = `"id": ${JSON.stringify(n.id)},`;
    const at = text.indexOf(key);
    if (at < 0) throw new Error('id not found ' + n.id);
    const re = /"priority": (\d+)/y;
    const pi = text.indexOf('"priority": ', at);
    re.lastIndex = pi;
    const m = re.exec(text);
    if (!m || Number(m[1]) !== n.priority) throw new Error('priority not found for ' + n.id);
    text = text.slice(0, pi) + `"priority": ${p}` + text.slice(pi + m[0].length);
    changes++;
  }
  writeFileSync(LEX_PATH, text);
  units.forEach((u, ui) => {
    const p = join(APP, 'content', 'units', unitFiles[ui]);
    const before = readFileSync(p, 'utf8');
    const after = JSON.stringify(rawUnits[ui], null, 1) + '\n';
    if (after !== before) writeFileSync(p, after);
  });
  console.log(`wrote ${changes} priorities and the units' lexemes arrays`);
}
