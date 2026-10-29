/* ============================================================================
 * VOCAB / LEMMATIZE — word-form frequency list -> lemma frequency list.
 *
 *   npx tsx tools/vocab/lemmatize.ts
 *
 * Reads tools/vocab/data/es_50k.txt (hermitdave/FrequencyWords, OpenSubtitles
 * 2018, CC BY-SA 4.0 — see SOURCES.md) and credits every form's count to its
 * lemma(s):
 *   - closed-class words (articles, pronouns, prepositions …) to a function
 *     lemma from FUNCTION_LEMMA below (la/las/los -> el, mis -> mi …);
 *   - verb forms to the infinitive, via the project engine (analyzeToken,
 *     participlesOf); reflexive infinitives fold into the base verb;
 *   - nouns and adjectives via the tagger's lemmatiser (plural, feminine);
 *   - a form that is both (trabajo = noun + trabajar) is split 50/50.
 * Forms with no analysis are kept as "unresolved" so curation can see them.
 * Writes tools/vocab/out/lemma-freq.json and out/unresolved.json.
 * ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeToken, participlesOf, VERBS, gerund, conjugate, deaccent } from '../../src/engine';
import { closedClass, lemmatize, lexEntry, registerLexemes, FUNCTION_HOMOGRAPHS } from '../../src/engine/tagger/lexicon';
import { loadCurated } from './curated';
import { doozanForms } from './sources';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
mkdirSync(OUT, { recursive: true });

/** form -> function lemma (forms not listed are their own lemma). */
export const FUNCTION_LEMMA: Record<string, string> = {};
const fl = (lemma: string, forms: string) => { for (const f of forms.split(/\s+/).filter(Boolean)) FUNCTION_LEMMA[f] = lemma; };
fl('el', 'el la los las'); fl('un', 'un una unos unas'); fl('mi', 'mi mis'); fl('tu', 'tu tus'); fl('su', 'su sus');
fl('nuestro', 'nuestro nuestra nuestros nuestras'); fl('vuestro', 'vuestro vuestra vuestros vuestras');
fl('mío', 'mío mía míos mías'); fl('tuyo', 'tuyo tuya tuyos tuyas'); fl('suyo', 'suyo suya suyos suyas');
fl('este', 'este esta estos estas'); fl('ese', 'ese esa esos esas'); fl('aquel', 'aquel aquella aquellos aquellas');
fl('mucho', 'mucho mucha muchos muchas'); fl('poco', 'poco poca pocos pocas'); fl('todo', 'todo toda todos todas');
fl('otro', 'otro otra otros otras'); fl('alguno', 'algún alguno alguna algunos algunas'); fl('ninguno', 'ningún ninguno ninguna');
fl('varios', 'varios varias'); fl('demasiado', 'demasiado demasiada demasiados demasiadas'); fl('tanto', 'tanto tanta tantos tantas');
fl('mismo', 'mismo misma mismos mismas'); fl('cualquiera', 'cualquier cualquiera'); fl('ambos', 'ambos ambas');
fl('cierto', 'cierto cierta ciertos ciertas'); fl('medio', 'medio media'); fl('tal', 'tal tales'); fl('bastante', 'bastante bastantes');
fl('primero', 'primer primero primera primeros primeras'); fl('segundo', 'segundo segunda segundos segundas');
fl('tercero', 'tercer tercero tercera'); fl('último', 'último última últimos últimas'); fl('cuarto', 'cuarto cuarta');
fl('uno', 'uno'); fl('cuánto', 'cuánto cuánta cuántos cuántas'); fl('cuál', 'cuál cuáles'); fl('quién', 'quién quiénes');
fl('quien', 'quien quienes'); fl('cual', 'cual cuales'); fl('cuyo', 'cuyo cuya cuyos cuyas');
fl('él', 'él'); fl('ella', 'ella ellas'); fl('ellos', 'ellos'); fl('nosotros', 'nosotros nosotras'); fl('vosotros', 'vosotros vosotras');
fl('y', 'y e'); fl('o', 'o u'); fl('millón', 'millón millones'); fl('cien', 'cien ciento'); fl('doscientos', 'doscientos doscientas');

export interface LemmaFreq { lemma: string; count: number; rank: number; pos: string; forms: Array<[string, number]> }

/** deaccented infinitive / gerund / imperative -> infinitives, for forms with enclitics (hacerlo, diciéndole, cállate). */
function cliticIndex(base: (inf: string) => string): Map<string, Set<string>> {
  const idx = new Map<string, Set<string>>();
  const add = (f: string, inf: string) => { const k = deaccent(f); const s = idx.get(k) ?? new Set(); s.add(base(inf)); idx.set(k, s); };
  for (const v of VERBS) {
    if (/se$/.test(v.inf)) continue;
    add(v.inf, v.inf);
    try { add(gerund(v), v.inf); } catch { /* */ }
    try { for (const f of conjugate(v, 'imperativo' as never)) if (f) add(f, v.inf); } catch { /* */ }
  }
  return idx;
}
const CLITIC_RE = /(me|te|se|nos|os|lo|la|los|las|le|les)$/;
function stripClitics(w: string, idx: Map<string, Set<string>>): Set<string> | null {
  let cur = w;
  for (let k = 0; k < 3; k++) {
    const m = cur.match(CLITIC_RE);
    if (!m) break;
    cur = cur.slice(0, -m[1].length);
    // vámonos: vamos + nos drops the s
    const hit = idx.get(deaccent(cur)) ?? (m[1] === 'nos' ? idx.get(deaccent(cur + 's')) : undefined);
    if (hit && cur.length > 1) return hit;
  }
  return null;
}

export function readList(file: string): Array<[string, number]> {
  return readFileSync(join(HERE, 'data', file), 'utf8').split('\n').filter(Boolean).map((l) => { const [w, c] = l.trim().split(/\s+/); return [w, Number(c)] as [string, number]; });
}

export function lemmaFreq(input: Array<[string, number]>): { list: LemmaFreq[]; unresolved: Array<[string, number]>; total: number } {
  const curated = loadCurated();
  registerLexemes(curated.map((c) => ({ lemma: c.lemma, pos: c.pos, gender: c.gender })));
  const curatedMap = new Map(curated.map((c) => [c.lemma, c]));
  const formMap = new Map<string, string>();       // explicit form -> lemma from curated (forms column)
  for (const c of curated) for (const f of c.forms ?? []) formMap.set(f, c.lemma);
  const verbSet = new Set(VERBS.map((v) => v.inf));
  const base = (inf: string) => { const b = inf.replace(/se$/, ''); return verbSet.has(b) ? b : inf; };
  const cidx = cliticIndex(base);
  const dz = doozanForms();
  const DZPOS: Record<string, string> = { n: 'noun', adj: 'adj', adv: 'adv', v: 'verb', interj: 'interj', prop: 'prop', num: 'func:num' };
  // pass 1: each form -> candidate lemmas (+pos); counts credited later by EM
  type Cand = { lemma: string; pos: string };
  const rows: Array<{ w: string; n: number; cands: Cand[] }> = [];
  const unresolved: Array<[string, number]> = [];
  let total = 0;
  for (const [w, n] of input) {
    total += n || 0;
    if (!w || !n || !/^[a-záéíóúüñ]+$/.test(w)) continue;
    const push = (cands: Cand[]) => rows.push({ w, n, cands });
    if (formMap.has(w)) { const l = formMap.get(w)!; push([{ lemma: l, pos: curatedMap.get(l)!.pos }]); continue; }
    if (w === 'al') { push([{ lemma: 'a', pos: 'func:prep' }]); rows.push({ w, n, cands: [{ lemma: 'el', pos: 'func:det' }] }); continue; }
    if (w === 'del') { push([{ lemma: 'de', pos: 'func:prep' }]); rows.push({ w, n, cands: [{ lemma: 'el', pos: 'func:det' }] }); continue; }
    const cc = closedClass(w);
    if (cc && cc !== 'interj' && (cc !== 'adv' || !lexEntry(w))) { push([{ lemma: FUNCTION_LEMMA[w] ?? w, pos: 'func:' + cc }]); continue; }
    if (cc === 'interj') { push([{ lemma: w, pos: 'interj' }]); continue; }
    const verbs = new Set(analyzeToken(w).filter((a) => a.accentExact).map((a) => base(a.inf)));
    const parts = new Set(participlesOf(w).map((p) => base((p as { inf: string }).inf)));
    if (!verbs.size && !parts.size) {
      const direct = /(ndo|r)$/.test(w) ? cidx.get(deaccent(w)) : undefined;   // gerunds and infinitives
      const st = direct ?? stripClitics(w, cidx);
      if (st) for (const v of st) verbs.add(v);
    }
    if (!verbs.size && (verbSet.has(w) || verbSet.has(base(w.replace(/se$/, ''))))) verbs.add(base(w.replace(/se$/, '')));
    const lem = lemmatize(w);
    let nominal = lem && !lem.viaForms && lem.entry && lem.entry.pos !== 'inf' ? lem : null;
    if (nominal && nominal.entry!.pos === 'x') nominal = curatedMap.has(nominal.lemma) ? nominal : null;
    const nomPos = nominal ? (curatedMap.get(nominal.lemma)?.pos ?? nominal.entry!.pos) : '';
    const vlist = [...verbs, ...[...parts].filter((p) => !verbs.has(p))];
    if (nominal && parts.size && !verbs.size) { push([{ lemma: nominal.lemma, pos: nomPos }]); continue; }
    const cands: Cand[] = [];
    if (nominal) cands.push({ lemma: nominal.lemma, pos: nomPos });
    for (const v of vlist) cands.push({ lemma: v, pos: 'verb' });
    if (cands.length) { push(cands); continue; }
    if (cc === 'adv') { push([{ lemma: w, pos: 'adv' }]); continue; }
    const d = dz.get(w);
    if (d && DZPOS[d[1]]) { const l = d[1] === 'v' ? base(d[0]) : d[0]; push([{ lemma: l, pos: DZPOS[d[1]] }]); continue; }
    unresolved.push([w, n]);
  }
  // EM: start from unambiguous evidence, then split ambiguous forms in proportion
  let tot = new Map<string, number>();
  for (const r of rows) if (r.cands.length === 1) tot.set(r.cands[0].lemma, (tot.get(r.cands[0].lemma) ?? 0) + r.n);
  for (let it = 0; it < 4; it++) {
    const next = new Map<string, number>();
    for (const r of rows) {
      const ws = r.cands.map((c) => (tot.get(c.lemma) ?? 0) + 1000 + (c.pos !== 'verb' ? r.n * 0.25 : 0));
      const sum = ws.reduce((a, b) => a + b, 0);
      r.cands.forEach((c, i) => next.set(c.lemma, (next.get(c.lemma) ?? 0) + r.n * ws[i] / sum));
    }
    tot = next;
  }
  const acc = new Map<string, { count: number; pos: Map<string, number>; forms: Map<string, number> }>();
  for (const r of rows) {
    const ws = r.cands.map((c) => (tot.get(c.lemma) ?? 0) + 1000 + (c.pos !== 'verb' ? r.n * 0.25 : 0));
    const sum = ws.reduce((a, b) => a + b, 0);
    r.cands.forEach((c, i) => {
      const n = r.n * ws[i] / sum;
      const e = acc.get(c.lemma) ?? { count: 0, pos: new Map(), forms: new Map() };
      e.count += n; e.pos.set(c.pos, (e.pos.get(c.pos) ?? 0) + n); e.forms.set(r.w, (e.forms.get(r.w) ?? 0) + n);
      acc.set(c.lemma, e);
    });
  }
  const list: LemmaFreq[] = [...acc.entries()]
    .map(([lemma, e]) => ({ lemma, count: Math.round(e.count), rank: 0, pos: [...e.pos.entries()].sort((a, b) => b[1] - a[1])[0][0], forms: [...e.forms.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([f, c]) => [f, Math.round(c)] as [string, number]) }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);
  list.forEach((x, i) => { x.rank = i + 1; });
  return { list, unresolved, total };
}

export interface Combined { lemma: string; rank: number; ppm: number; sub: number; web: number; pos: string; forms: Array<[string, number]>; capShare: number }

/** Both lists lemmatised and averaged per million (spoken subtitles + Colombian web). */
export function combined(): { list: Combined[]; unresolvedSub: Array<[string, number]>; unresolvedWeb: Array<[string, number]> } {
  const sub = lemmaFreq(readList('es_50k.txt'));
  const webRaw = readFileSync(join(HERE, 'data', 'co_web_2015_50k.txt'), 'utf8').split('\n').filter(Boolean).map((l) => l.split(' '));
  const cap = new Map(webRaw.map(([w, , c]) => [w, Number(c)]));
  const web = lemmaFreq(webRaw.map(([w, n]) => [w, Number(n)] as [string, number]));
  const m = new Map<string, Combined>();
  for (const [src, r] of [['sub', sub], ['web', web]] as const) {
    for (const x of r.list) {
      const e = m.get(x.lemma) ?? { lemma: x.lemma, rank: 0, ppm: 0, sub: 0, web: 0, pos: x.pos, forms: x.forms, capShare: 0 };
      e[src] = (x.count / r.total) * 1e6;
      if (src === 'sub') { e.pos = x.pos; e.forms = x.forms; }
      m.set(x.lemma, e);
    }
  }
  for (const e of m.values()) {
    // geometric mean: a word must be common in speech AND in Colombian writing (damps subtitle crime-drama words)
    e.ppm = Math.sqrt((e.sub + 0.05) * (e.web + 0.05));
    // share of capitalised uses of the lemma's commonest form in the web corpus (names, places)
    e.capShare = cap.get(e.forms[0]?.[0] ?? e.lemma) ?? cap.get(e.lemma) ?? 0;
  }
  const list = [...m.values()].sort((a, b) => b.ppm - a.ppm);
  list.forEach((x, i) => { x.rank = i + 1; x.ppm = Math.round(x.ppm * 100) / 100; x.sub = Math.round(x.sub * 100) / 100; x.web = Math.round(x.web * 100) / 100; });
  return { list, unresolvedSub: sub.unresolved, unresolvedWeb: web.unresolved };
}

function main(): void {
  const { list, unresolvedSub, unresolvedWeb } = combined();
  writeFileSync(join(OUT, 'lemma-freq.json'), JSON.stringify(list));
  // unresolved forms of both lists merged per million, with the English rank and capitalised share for triage
  const en = new Map(readFileSync(join(HERE, 'data', 'en_50k.txt'), 'utf8').split('\n').map((l, i) => [l.split(' ')[0], i + 1] as [string, number]));
  const capMap = new Map(readFileSync(join(HERE, 'data', 'co_web_2015_50k.txt'), 'utf8').split('\n').filter(Boolean).map((l) => { const p = l.split(' '); return [p[0], Number(p[2])] as [string, number]; }));
  const subTot = readList('es_50k.txt').reduce((s, [, n]) => s + n, 0);
  const webTot = readList('co_web_2015_50k.txt').reduce((s, [, n]) => s + n, 0);
  const u = new Map<string, number>();
  for (const [w, n] of unresolvedSub) u.set(w, (u.get(w) ?? 0) + n / subTot * 1e6 / 2);
  for (const [w, n] of unresolvedWeb) u.set(w, (u.get(w) ?? 0) + n / webTot * 1e6 / 2);
  const rows = [...u.entries()].sort((a, b) => b[1] - a[1]).map(([w, p]) => ({ w, ppm: Math.round(p * 100) / 100, en: en.get(w) ?? 0, cap: capMap.get(w) ?? -1 }));
  writeFileSync(join(OUT, 'unresolved.json'), JSON.stringify(rows));
  console.log(`${list.length} lemmas; ${rows.length} unresolved forms`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
