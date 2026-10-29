/* ============================================================================
 * VOCAB / BUILD — the lexeme inventory, its placement into unit days, and
 * the outputs.
 *
 *   npx tsx tools/vocab/build.ts            build and write everything
 *   npx tsx tools/vocab/build.ts --dry      build, print the summary, write only tools/vocab/out/
 *
 * Writes content/graph/lexemes.json, the `lexemes` arrays of
 * content/units/uNN.json (nothing else in those files), and
 * tools/vocab/out/{inventory.tsv,placement.json} for the report.
 *
 * THREE TIERS (one rule decides each, documented in docs/vocab-report.md):
 *   taught      in a day's `lexemes` array: the compiler presents and cards it.
 *               Day budgets: Input 12–16, Introduce 4–6, Drill 0–4, others 0.
 *   closed      words the tagger treats as closed class (articles, pronouns,
 *               prepositions, conjunctions, numbers, determiners, closed
 *               adverbs, interjections) and the verbs a grammar node is about
 *               (ser, estar, haber, ir, gustar). They are taught by grammar
 *               and chunks, so they are never carded; the node exists for
 *               coverage tracking, with priority = the first session a chunk,
 *               pattern or grammar example uses it.
 *   receptive   words met in reading and expected to be understood (most are
 *               transparent cognates or lower-frequency theme words); priority
 *               = the session of their unit's first Input day. Not carded.
 *               This tier is how the cumulative band totals reach the research
 *               targets, which the day budgets alone cannot (see report).
 * ========================================================================== */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERBS, deaccent } from '../../src/engine';
import { tagSentence } from '../../src/engine/tagger';
import { closedClass, lexEntry } from '../../src/engine/tagger/lexicon';
import * as LX from '../../src/engine/tagger/lexicon';
import { GraphNode, Unit, type Band } from '../../src/content/schema';
import { combined, FUNCTION_LEMMA } from './lemmatize';
import { CUM_TARGET, CAP } from './build-config';
import { loadCurated, type Curated } from './curated';
import { dictionary, oldDeck, cleanGloss, type DictEntry, type DeckRow } from './sources';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..', '..');
const OUT = join(HERE, 'out');
mkdirSync(OUT, { recursive: true });
const DRY = process.argv.includes('--dry');

const BANDS: Band[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const bandIdx = (b: Band) => BANDS.indexOf(b);

/** Content-word frequency rank ceilings for the general (non-theme) stream. */
const NATURAL: Array<[Band, number]> = [['A1', 900], ['A2', 1900], ['B1', 3000], ['B2', 3900], ['C1', Infinity]];
/** Verbs that a grammar node is about: closed tier, priority = that node. */
const GRAMMAR_VERBS: Record<string, string> = { ser: 'g:ser-identity', estar: 'g:estar-location-states', haber: 'g:hay-vs-esta', ir: 'g:ir-a-plans', gustar: 'g:gustar-basic' };
/** Closed words taught for recognition only. */
const VARIETY: Record<string, { variety: 'peninsular' | 'voseo'; node: string }> = {
  vosotros: { variety: 'peninsular', node: 'g:vosotros-recognition' }, vuestro: { variety: 'peninsular', node: 'g:vosotros-recognition' },
  os: { variety: 'peninsular', node: 'g:vosotros-recognition' }, vos: { variety: 'voseo', node: 'g:voseo-recognition' },
};
/** Feminine nouns that take "el" (stressed a-). */
const MONTHS = new Set('enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(' '));
const KEEP_PLURAL = new Set(['bienes', 'ganas', 'celos', 'urgencias', 'matemáticas', 'padres', 'gafas', 'tijeras', 'lentes', 'felicitaciones', 'vacaciones', 'onces', 'pasabocas', 'binoculares', 'esposas']);
const EL_FEM = new Set('agua águila alma arma hambre hacha área aula ala ave asma alba ancla arca arpa haba hada habla ama ansia acta álgebra aguja'.split(' ').filter((w) => !['aguja'].includes(w)));
const THEME_AREA: Record<string, number> = {
  cuerpo: 1, caracter: 2, identidad: 3, relaciones: 4, alimentacion: 5, educacion: 6, trabajo: 7, ocio: 8, medios: 9, vivienda: 10,
  servicios: 11, compras: 12, salud: 13, viajes: 14, economia: 15, ciencia: 16, politica: 17, arte: 18, religion: 19, naturaleza: 20,
};

type Tier = 'taught' | 'closed' | 'receptive';
interface Cand {
  id: string; lemma: string; sense?: string; pos: string; gender?: 'm' | 'f' | 'mf'; gloss: string; en: string;
  ppm: number; rank?: number; contentRank?: number; closed: boolean; cognate: boolean;
  areas: Set<number>; deckBand?: Band; pcic: string[]; pen?: string; variety?: 'peninsular' | 'voseo';
  sources: string[]; floor?: Band; display?: string; seedUnits: string[]; need?: number; needWhere?: string;
  seen?: number; seenWhere?: string;
  tier?: Tier; unit?: string; day?: number; session?: number; note?: string;
}

/* ---------------------------------------------------------------- inputs */
const units: Unit[] = readdirSync(join(APP, 'content', 'units')).filter((f) => /^u\d\d\.json$/.test(f)).sort()
  .map((f) => Unit.parse(JSON.parse(readFileSync(join(APP, 'content', 'units', f), 'utf8'))));
const graph: GraphNode[] = ['chunks', 'patterns', 'grammar', 'contrasts']
  .flatMap((f) => (JSON.parse(readFileSync(join(APP, 'content', 'graph', f + '.json'), 'utf8')) as unknown[]).map((n) => GraphNode.parse(n)));
const graphById = new Map(graph.map((n) => [n.id, n]));

// session index: sum of days of prior units + day index + 1
const sessionOf = new Map<string, number>();     // `${unit}:${day}` -> session
const unitStart = new Map<string, number>();
{
  let s = 0;
  for (const u of units) { unitStart.set(u.id, s + 1); u.days.forEach((_, i) => sessionOf.set(`${u.id}:${i}`, s + i + 1)); s += u.days.length; }
}
// verify against the graph: every node scheduled on a day should carry that day's session as priority
let sessionMismatch = 0;
for (const u of units) u.days.forEach((d, i) => { for (const id of [...d.focus, ...d.chunks]) { const n = graphById.get(id); if (n && n.priority > sessionOf.get(`${u.id}:${i}`)!) sessionMismatch++; } });

const curated = loadCurated();
const curByLemma = new Map<string, Curated[]>();
for (const c of curated) { if (c.file === 'units.tsv') continue; (curByLemma.get(c.lemma) ?? curByLemma.set(c.lemma, []).get(c.lemma)!).push(c); }
const dropped = new Set(curated.filter((c) => c.drop).map((c) => c.lemma));
const seeds = new Map<string, string[]>();      // unit -> lemma[#sense] list
for (const line of readFileSync(join(HERE, 'curated', 'units.tsv'), 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [u, ...ws] = line.split('\t').map((x) => x.trim()).filter(Boolean);
  seeds.set(u, ws.filter((w) => !w.includes('_') && w === w.toLowerCase()));
}
const multiwordSeeds = [...readFileSync(join(HERE, 'curated', 'units.tsv'), 'utf8').matchAll(/\t([^\t\n]*_[^\t\n]*)/g)].map((m) => m[1].replace(/_/g, ' '));

const dict = dictionary();
const deck = oldDeck();
const deckBy = new Map<string, DeckRow[]>();
for (const r of deck) if (!/\s/.test(r.lemma)) (deckBy.get(r.lemma) ?? deckBy.set(r.lemma, []).get(r.lemma)!).push(r);
const verbEn = new Map(VERBS.map((v) => [v.inf, v.en]));
const freq = combined().list;
const freqBy = new Map(freq.map((f) => [f.lemma, f]));

/* ---------------------------------------------------------------- helpers */
const BAD_Q = /obsolete|archaic|dated|rare|historical|vulgar|derogatory|offensive|slang|Philippines|Rioplatense|Chile|Mexico|Spain|Peru|Venezuela|Argentina|Cuba|Canary|Equatorial|uncommon|Lunfardo|Puerto Rico|Caribbean|Central America|Ecuador|Bolivia|Uruguay|Paraguay|Dominican|Guatemala|Honduras|Nicaragua|Salvador|Costa Rica|Panama|Andes|Cono Sur|pathology|anatomy|chemistry|biochemistry|mineralogy|botany|zoology|nautical|heraldry/;
const DICT_POS: Record<string, string> = { n: 'noun', v: 'verb', adj: 'adj', adv: 'adv', interj: 'interj', prep: 'prep', conj: 'conj', pron: 'pron', num: 'num', determiner: 'det', art: 'det', contraction: 'det', phrase: 'x', particle: 'x' };
function dictEntries(lemma: string): DictEntry[] { return dict.get(lemma) ?? []; }
function pickSense(e: DictEntry): string | null {
  const ok = e.senses.filter((s) => !/^(plural of|feminine of|masculine of|inflection of|alternative|obsolete|misspelling|superseded|eye dialect|apocopic|diminutive of|augmentative of|clipping of|ellipsis of|initialism|abbreviation|acronym|female equivalent|male equivalent|first-person|third-person|second-person|gerund|past participle)/i.test(s.gloss));
  const good = ok.find((s) => !BAD_Q.test(s.q)) ?? ok.find((s) => /Latin America|Colombia/.test(s.q));
  return good ? good.gloss : null;
}
/** Is the lemma used in LatAm in its main sense? false when every usable sense is marked Spain-only. */
function spainOnly(lemma: string, pos: string): boolean {
  const es = dictEntries(lemma).filter((e) => DICT_POS[e.pos] === pos || (pos === 'noun' && e.pos === 'n'));
  if (!es.length) return false;
  const senses = es.flatMap((e) => e.senses).filter((s) => !/obsolete|archaic|dated|rare/.test(s.q));
  if (!senses.length) return false;
  return senses.slice(0, 2).every((s) => /\bSpain\b/.test(s.q) && !/Latin America|Colombia|Mexico/.test(s.q));
}
function glossFor(lemma: string, pos: string): string {
  const rows = deckBy.get(lemma) ?? [];
  const d = rows.find((r) => r.en);
  if (pos === 'verb' && verbEn.get(lemma)) return verbEn.get(lemma)!.replace(/\s*\(.*?\)\s*$/, '');
  if (d) {
    let g = d.en.replace(/^(the|a|an) /i, '').trim();
    if (pos === 'verb' && !/^to /.test(g)) g = 'to ' + g;
    return g;
  }
  const es = dictEntries(lemma);
  const want = es.filter((e) => DICT_POS[e.pos] === pos || (pos === 'verb' && e.pos === 'v'));
  for (const e of [...want, ...es]) {
    const s = pickSense(e);
    if (s) { let g = cleanGloss(s); if (pos === 'verb' && !/^to /.test(g)) g = 'to ' + g; return g; }
  }
  return '';
}
function genderOf(lemma: string): 'm' | 'f' | 'mf' | undefined {
  if (/(ción|sión|dad|tad|tud|umbre)$/.test(lemma)) return 'f';
  const d = (deckBy.get(lemma) ?? []).find((r) => r.gender || r.article);
  if (d?.gender === 'm' || d?.gender === 'f' || d?.gender === 'mf') return d.gender as 'm' | 'f' | 'mf';
  const e = dictEntries(lemma).find((x) => x.pos === 'n' && x.g);
  if (e?.g) { const g = e.g.replace(/-p$/, ''); if (/^m.*f|^f.*m|mf|^mfbysense/.test(g)) return 'mf'; if (g.startsWith('m')) return 'm'; if (g.startsWith('f')) return 'f'; }
  const le = lexEntry(lemma);
  if (le?.gender) return le.gender;
  if (d?.article) return /^(la|las|una)$/.test(d.article) ? 'f' : 'm';
  return undefined;
}
function stem(s: string): string {
  return deaccent(s.toLowerCase()).replace(/ción$/, 'tion').replace(/cion$/, 'tion').replace(/dad$/, 'ty').replace(/sión$/, 'sion').replace(/sion$/, 'sion')
    .replace(/mente$/, 'ly').replace(/oso$/, 'ous').replace(/ico$/, 'ic').replace(/ista$/, 'ist').replace(/ia$/, 'y').replace(/ar$|er$|ir$/, '').replace(/[aeo]$/, '').replace(/ph/g, 'f').replace(/th/g, 't').replace(/y/g, 'i').replace(/k/g, 'c');
}
function lev(a: string, b: string): number {
  const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
/** A transparent cognate: the Spanish lemma reads as one of its English gloss words. */
function isCognate(lemma: string, gloss: string): boolean {
  const s = stem(lemma);
  if (s.length < 4) return false;
  return gloss.toLowerCase().replace(/^to /, '').split(/[^a-z]+/).filter((w) => w.length >= 4).some((w) => {
    const e = stem(w.replace(/e$/, ''));
    const k = Math.min(s.length, e.length);
    return lev(s.slice(0, k + 1), e.slice(0, k + 1)) <= Math.max(1, Math.floor(k / 5)) && Math.abs(s.length - e.length) <= 3;
  });
}
const POS_OF: Record<string, string> = { noun: 'noun', adj: 'adj', adv: 'adv', verb: 'verb', interj: 'interj', inf: 'verb', form: 'x', x: 'x' };
function closedPos(lemma: string): string | null {
  const c = closedClass(lemma);
  if (!c) return null;
  if (c === 'adv') return null;   // place and time adverbs (aquí, ayer, cerca) are vocabulary; only LEXEME_STOP ones are closed
  return ({ det: 'det', poss: 'det', dem: 'det', pron: 'pron', clitic: 'pron', prep: 'prep', int: 'pron', neg: 'adv', rel: 'pron', conj: 'conj', quant: 'det', num: 'num', interj: 'interj', adv: 'adv' } as Record<string, string>)[c] ?? 'x';
}

/* ---------------------------------------------------------------- candidates */
const cands = new Map<string, Cand>();
function addCand(lemma: string, opts: { posHint?: string; source: string; cur?: Curated }): Cand | null {
  const cur = opts.cur;
  const id = 'l:' + lemma + (cur?.sense ? '#' + cur.sense : '');
  const existing = cands.get(id);
  if (existing) { if (!existing.sources.includes(opts.source)) existing.sources.push(opts.source); return existing; }
  if (dropped.has(lemma) || !lemma || /\s/.test(lemma)) return null;
  if (!cur && (lemma.length === 1 || (lemma.length === 2 && !deckBy.has(lemma))) && !closedClass(lemma)) return null;   // la ma, la r
  // plurals ("los hermanos", "huevos") when the singular is a word: the singular is the lexeme.
  // Never when the dictionary has the form as a noun of its own (país, mes, lunes, crisis, tenis).
  if (!cur && /s$/.test(lemma) && !KEEP_PLURAL.has(lemma) && !verbEn.has(lemma)) {
    const ents = dictEntries(lemma);
    const ownNoun = ents.some((e) => e.pos === 'n' && e.senses.some((x) => !/^plural of/i.test(x.gloss)));
    const pluralOf = ents.some((e) => e.senses.some((x) => /^plural of/i.test(x.gloss)));
    const dk = deckBy.get(lemma)?.[0];
    const deckPlural = !!dk && /^(los|las)$/.test(dk.article ?? '') && [lemma.replace(/es$/, ''), lemma.replace(/s$/, '')].some((x) => deckBy.has(x) || dictEntries(x).some((e) => e.pos === 'n'));
    if (!ownNoun && (pluralOf || deckPlural)) return null;
  }
  // inflected forms the lists treat as lemmas (buena, buen, gran): every sense is "feminine of …"
  const des = dictEntries(lemma);
  if (!cur && des.length && des.every((e) => e.senses.length && e.senses.every((x) => /^(feminine|plural|masculine|apocopic|apocopated|inflection|feminine singular|masculine plural|feminine plural)\b/i.test(x.gloss)))) return null;
  // a pronominal verb shares its base verb's counts (the frequency lists fold them); half is a rough share
  const base = /(ar|er|ir|ír)se$/.test(lemma) ? freqBy.get(lemma.replace(/se$/, '')) : undefined;
  const f = freqBy.get(lemma) ?? (base ? { ...base, ppm: base.ppm * 0.5, pos: 'verb' } : undefined);
  const cp = closedPos(lemma);
  // closed = the tagger never emits it as a lexeme: closed class, LEXEME_STOP, interjections, grammar verbs
  const curPos = cur?.pos === 'v' ? 'verb' : cur?.pos;
  const isClosed = lemma in GRAMMAR_VERBS || LX.LEXEME_STOP.has(lemma) || (curPos
    ? ['det', 'pron', 'prep', 'conj', 'num', 'interj'].includes(curPos) || (curPos === 'adv' && closedClass(lemma) === 'neg')
    : (!!cp || f?.pos === 'interj'));
  let pos = cur ? (cur.pos === 'noun' ? 'noun' : cur.pos === 'v' ? 'verb' : cur.pos) : '';
  if (!pos) pos = cp ?? (lemma in GRAMMAR_VERBS ? 'verb' : '');
  if (!pos && opts.posHint) pos = opts.posHint;
  if (!pos && f) pos = f.pos.startsWith('func:') ? (closedPos(lemma) ?? 'x') : (POS_OF[f.pos] ?? '');
  if (!pos || pos === 'x') {
    const d = dictEntries(lemma).find((e) => DICT_POS[e.pos] && DICT_POS[e.pos] !== 'x');
    pos = d ? DICT_POS[d.pos] : (deckBy.has(lemma) ? ((deckBy.get(lemma)![0].article || deckBy.get(lemma)![0].gender) ? 'noun' : 'x') : 'x');
  }
  if (pos === 'verb' && !/(ar|er|ir|ír)(se)?$/.test(lemma)) pos = dictEntries(lemma).find((e) => e.pos !== 'v') ? DICT_POS[dictEntries(lemma).find((e) => e.pos !== 'v')!.pos] ?? 'x' : 'x';
  if (pos === 'x' && !cur) return null;
  // names and non-words: must be a lowercase dictionary word, a deck word, a verb, or curated
  const known = !!cur || deckBy.has(lemma) || verbEn.has(lemma) || isClosed || dictEntries(lemma).some((e) => e.pos !== 'prop' && e.senses.length);
  if (!known) return null;
  if (!cur && f && f.capShare > 0.85 && !deckBy.has(lemma) && pos !== 'verb') return null;
  if (!cur && !isClosed && spainOnly(lemma, pos)) return null;
  const gloss = cur?.en || glossFor(lemma, pos);
  if (!gloss) return null;
  const deckRows = deckBy.get(lemma) ?? [];
  const areas = new Set<number>(deckRows.map((r) => THEME_AREA[r.theme ?? '']).filter(Boolean));
  const cefrs = deckRows.map((r) => r.cefr).filter((c): c is Band => !!c && BANDS.includes(c as Band));
  const c: Cand = {
    id, lemma, sense: cur?.sense, pos, gender: pos === 'noun' ? (cur?.gender ?? (/ista$/.test(lemma) ? 'mf' : genderOf(lemma))) : undefined, gloss, en: gloss,
    ppm: f?.ppm ?? 0, closed: isClosed, cognate: !isClosed && isCognate(lemma, gloss),
    areas, deckBand: cefrs.length ? cefrs.sort((a, b) => bandIdx(a) - bandIdx(b))[0] : undefined,
    pcic: [...new Set(deckRows.flatMap((r) => r.pcic ?? []))], pen: cur?.pen?.split(', ')[0]?.replace(/ /g, ' '),
    variety: VARIETY[lemma]?.variety, sources: [opts.source], floor: cur?.band as Band | undefined, seedUnits: [], display: cur?.es,
  };
  if (deckRows.length && !c.sources.includes('vocab.js')) c.sources.push('vocab.js');
  if (f && !c.sources.includes('freq')) c.sources.push('freq');
  cands.set(id, c);
  return c;
}

// curated first (they define senses, LatAm forms and glosses)
for (const c of curated) if (!c.drop && c.file !== 'units.tsv') addCand(c.lemma, { source: 'curated', cur: c });
// frequency: the top of the combined list
const FREQ_POOL = 9000;
for (const f of freq.slice(0, FREQ_POOL)) {
  if (f.pos === 'prop') continue;
  const cur = (curByLemma.get(f.lemma) ?? []).find((c) => !c.sense);
  addCand(f.lemma, { source: 'freq', cur });
}
// deck: single-word lemmas
for (const [lemma, rows] of deckBy) {
  const cur = (curByLemma.get(lemma) ?? []).find((c) => !c.sense);
  addCand(lemma, { source: 'vocab.js', cur, posHint: rows[0].article ? 'noun' : undefined });
}
// seeds
const seedMissing: string[] = [];
for (const [u, ws] of seeds) for (const w of ws) {
  const [lemma, sense] = w.split('#');
  const cur = (curByLemma.get(lemma) ?? []).find((c) => (c.sense ?? '') === (sense ?? ''));
  const c = addCand(lemma, { source: 'seed:' + u, cur });
  if (c) c.seedUnits.push(u); else seedMissing.push(`${u}:${w}`);
  if (c?.closed) seedMissing.push(`${u}:${w} (closed class)`);
}
// closed-class lists from the tagger, so every function word is tracked
for (const s of [LX.ARTICLES, LX.POSSESSIVES, LX.DEMONSTRATIVES, LX.DEM_PRONOUNS, LX.SUBJECT_PRONOUNS, LX.TONIC_PRONOUNS, LX.CLITICS, LX.PREPOSITIONS, LX.CONJUNCTIONS, LX.INTERROGATIVES, LX.RELATIVES, LX.NEGATIVES, LX.INDEF_PRONOUNS, LX.QUANTIFIERS, LX.NUMBERS]) {
  for (const w of s) { const l = FUNCTION_LEMMA[w] ?? w; if (!cands.has('l:' + l)) addCand(l, { source: 'closed' }); }
}

// ranks: among accepted candidates with frequency data (base senses only)
const ranked = [...cands.values()].filter((c) => c.ppm > 0 && !c.sense).sort((a, b) => b.ppm - a.ppm);
ranked.forEach((c, i) => { c.rank = i + 1; });
// teaching order leans on speech: 70% subtitles, 30% Colombian web (freqRank stays the plain geometric mean)
const spoken = (c: Cand) => { const f = freqBy.get(c.lemma) ?? freqBy.get(c.lemma.replace(/se$/, '')); return f ? Math.pow(f.sub + 0.05, 0.7) * Math.pow(f.web + 0.05, 0.3) * (c.lemma !== f.lemma ? 0.5 : 1) : 0; };
ranked.filter((c) => !c.closed).sort((a, b) => spoken(b) - spoken(a)).forEach((c, i) => { c.contentRank = i + 1; });
for (const c of cands.values()) if (c.sense) { const b = cands.get('l:' + c.lemma); if (b) { c.rank = b.rank; c.contentRank = b.contentRank; c.ppm = b.ppm; } }
const naturalBand = (c: Cand): Band => {
  if (!c.contentRank) return c.floor ?? c.deckBand ?? 'C1';
  const fb = NATURAL.find(([, r]) => c.contentRank! <= r)![0];
  const b = c.floor && bandIdx(c.floor) > bandIdx(fb) ? c.floor : fb;
  return b;
};

/* ---------------------------------------------------------------- need sessions (chunks, patterns, grammar examples) */
const dayOfNode = new Map<string, number>();
units.forEach((u) => u.days.forEach((d, i) => { for (const id of [...d.focus, ...d.chunks]) if (!dayOfNode.has(id)) dayOfNode.set(id, sessionOf.get(`${u.id}:${i}`)!); }));
// A node needs the words its id names (c:tengo-anos needs tener and año; c:trabajo-en needs trabajar):
// the words of its Spanish text whose unaccented form is in the id. Example sentences around them do not count.
for (const n of graph) {
  if (!n.es || n.kind === 'contrast') continue;
  const at = dayOfNode.get(n.id) ?? n.priority;
  const slug = new Set(n.id.slice(2).split('#')[0].split('-').map((x) => deaccent(x.toLowerCase())));
  for (const part of n.es.split(/\s+[—/]\s+|[.!?¿¡]\s*/)) {
    if (!part.trim()) continue;
    let r;
    try { r = tagSentence(part); } catch { continue; }
    for (const w of r.tokens) {
      if (w.punct) continue;
      const any = cands.get('l:' + (FUNCTION_LEMMA[w.w.toLowerCase()] ?? w.w.toLowerCase()));
      if (any && (any.seen === undefined || at < any.seen)) { any.seen = at; any.seenWhere = n.id; }
      if (!slug.has(deaccent(w.w.toLowerCase()))) continue;
      const lemma = FUNCTION_LEMMA[w.w.toLowerCase()] ?? (w.lemma || w.w).toLowerCase();
      const c = cands.get('l:' + lemma.replace(/se$/, '')) ?? cands.get('l:' + lemma);
      if (!c) continue;
      if (c.need === undefined || at < c.need) { c.need = at; c.needWhere = n.id; }
    }
  }
}

/* ---------------------------------------------------------------- placement */
interface DaySlot { unit: Unit; di: number; type: string; cap: number; session: number; ids: string[] }
const slots: DaySlot[] = [];
const unitSlots = new Map<string, DaySlot[]>();
for (const u of units) {
  const ss = u.days.map((d, di) => ({ unit: u, di, type: d.type, cap: CAP[u.band][d.type] ?? 0, session: sessionOf.get(`${u.id}:${di}`)!, ids: [] as string[] }));
  unitSlots.set(u.id, ss); slots.push(...ss);
}
const place = (c: Cand, s: DaySlot) => { c.tier = 'taught'; c.unit = s.unit.id; c.day = s.di; c.session = s.session; s.ids.push(c.id); };
const free = (s: DaySlot) => s.cap - s.ids.length;
const unitAreas = (u: Unit) => new Set((u.theme.split(':')[0].match(/\d+/g) ?? []).map(Number).filter((n) => n >= 1 && n <= 20));
const eligibleTaught = (c: Cand) => !c.closed && !c.tier && c.pos !== 'x' && c.pos !== 'interj';
/** A band floor (matar: B1) moves a word into its band's range instead of to the front of it. */
const effRank = (c: Cand) => { const r = c.contentRank ?? 1e9; if (!c.floor || bandIdx(c.floor) === 0) return r; const prev = NATURAL[bandIdx(c.floor) - 1][1]; return r <= prev ? prev + r : r; };
const byRank = (a: Cand, b: Cand) => effRank(a) - effRank(b) || a.id.localeCompare(b.id);
const report = { needPlacedLate: [] as string[], needPlacedOnTime: 0 };

// the general stream: frequency order, non-cognates first-class (cognates from the top 400 still go in)
const stream = [...cands.values()].filter((c) => eligibleTaught(c) && c.contentRank && (!c.cognate || c.contentRank <= 400)).sort(byRank);
let streamAt = 0;
function nextStream(band: Band): Cand | null {
  while (streamAt < stream.length && stream[streamAt].tier) streamAt++;
  for (let i = streamAt; i < stream.length; i++) {
    const c = stream[i];
    if (c.tier) continue;
    const ceiling = NATURAL.find(([b]) => b === band)![1];
    if (effRank(c) > ceiling) return null;
    if (bandIdx(naturalBand(c)) > bandIdx(band)) continue;   // a band floor (matar: B1) holds it back
    return c;
  }
  return null;
}

const carry: Cand[] = [];   // seeds a full unit could not take: first in line in the next units
for (const u of units) {
  const ss = unitSlots.get(u.id)!;
  const band = u.band;
  const first = ss[0].session, last = ss[ss.length - 1].session;
  // 1. words this unit's chunks/patterns/grammar examples need, on or before their day
  const needs = [...cands.values()].filter((c) => eligibleTaught(c) && c.need !== undefined && c.need >= first && c.need <= last
    && (c.needWhere!.startsWith('c:') || bandIdx(naturalBand(c)) <= bandIdx(band) || c.seedUnits.includes(u.id) || (c.deckBand && bandIdx(c.deckBand) <= bandIdx(band))))
    .sort((a, b) => a.need! - b.need! || byRank(a, b));
  for (const c of needs) {
    const onOrBefore = ss.filter((s) => s.session <= c.need! && free(s) > 0 && s.type !== 'input');
    const target = onOrBefore.find((s) => s.session === c.need) ?? onOrBefore[onOrBefore.length - 1]
      ?? ss.filter((s) => s.session <= c.need! && free(s) > 0).pop();
    if (target) { place(c, target); report.needPlacedOnTime++; continue; }
    // earlier units of the same band with room (the word arrives before the chunk)
    const earlier = slots.filter((s) => s.session < first && s.unit.band === band && free(s) > 0 && s.type !== 'input').pop();
    if (earlier) { place(c, earlier); report.needPlacedOnTime++; continue; }
    const later = ss.find((s) => s.session > c.need! && free(s) > 0 && s.type !== 'input');
    if (later) { place(c, later); report.needPlacedLate.push(`${c.id} needed s${c.need} by ${c.needWhere}, taught s${later.session}`); }
  }
  // 2. Input day(s): the unit's seeds, then old-deck words of the unit's PCIC areas
  const inputs = ss.filter((s) => s.type === 'input');
  const areas = unitAreas(u);
  const seedCands = (seeds.get(u.id) ?? []).map((w) => cands.get('l:' + w)).filter((c): c is Cand => !!c && eligibleTaught(c));
  // old-deck theme words of about this level (an A1 deck word left over by C1 is better read than carded)
  const deckTheme = [...cands.values()].filter((c) => eligibleTaught(c) && [...c.areas].some((a) => areas.has(a))
    && ((c.deckBand && bandIdx(c.deckBand) <= bandIdx(band) && bandIdx(c.deckBand) >= bandIdx(band) - 1) || (!c.deckBand && bandIdx(naturalBand(c)) <= bandIdx(band))))
    .sort((a, b) => (bandIdx(a.deckBand ?? 'C1') - bandIdx(b.deckBand ?? 'C1')) || byRank(a, b));
  const themeQueue = [...seedCands, ...deckTheme];
  for (const s of inputs) {
    while (free(s) > 0) {
      const c = themeQueue.find((x) => !x.tier);
      if (!c) break;
      place(c, s);
    }
  }
  // 3. Introduce and Drill days: leftover seeds, then the general frequency stream
  for (const s of ss.filter((x) => x.type === 'introduce' || x.type === 'drill')) {
    while (free(s) > 0) {
      const seed = seedCands.find((x) => !x.tier) ?? carry.find((x) => !x.tier);
      const c = seed ?? nextStream(band);
      if (!c) break;
      place(c, s);
    }
  }
  // 4. an Input day still short: top up from the stream
  for (const s of inputs) while (free(s) > 0) { const c = nextStream(band); if (!c) break; place(c, s); }
  for (const c of seedCands) if (!c.tier && !carry.includes(c)) carry.push(c);
}

/* ---------------------------------------------------------------- closed tier */
const NUMBER_UNIT = (l: string): string | null => {
  if (/^(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieciséis|diecisiete|dieciocho|diecinueve|veinte)$/.test(l)) return 'u01';
  if (/^(veinti.*|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien)$/.test(l)) return 'u05';
  if (/^(doscientos|trescientos|quinientos|mil|millón)$/.test(l)) return 'u16';
  if (/^(primero|segundo|tercero|cuarto|quinto|último)$/.test(l)) return 'u09';
  return null;
};
const firstInput = (u: Unit) => (unitSlots.get(u.id)!.find((s) => s.type === 'input') ?? unitSlots.get(u.id)![0]).session;
const bandStart = new Map<Band, number>();
for (const u of units) if (!bandStart.has(u.band)) bandStart.set(u.band, unitStart.get(u.id)!);
const bandOfSession = (s: number): Band => units.find((u) => { const ss = unitSlots.get(u.id)!; return s >= ss[0].session && s <= ss[ss.length - 1].session; })?.band ?? 'C1';
for (const c of cands.values()) {
  if (!c.closed || c.tier) continue;
  c.tier = 'closed';
  const gv = GRAMMAR_VERBS[c.lemma] ?? VARIETY[c.lemma]?.node;
  const gnode = gv ? graphById.get(gv) : undefined;
  // numbers follow the unit themes (0–20 in u01, to 100 in u05, hundreds with prices in u16); else first use, else frequency
  const num = NUMBER_UNIT(c.lemma);
  const byFreq: Band = !c.rank ? 'C1' : c.rank <= 1000 ? 'A1' : c.rank <= 2500 ? 'A2' : c.rank <= 4000 ? 'B1' : c.rank <= 5500 ? 'B2' : 'C1';
  // closed words: the first chunk / pattern / grammar example that uses them, else frequency
  const firstUse = Math.min(c.need ?? Infinity, c.seen ?? Infinity);
  c.session = gnode ? gnode.priority : num ? firstInput(units.find((u) => u.id === num)!) : Math.min(firstUse, bandStart.get(byFreq)!);
  if (firstUse < Infinity && firstUse === c.session) { c.need = firstUse; c.needWhere = c.seen === firstUse ? c.seenWhere : c.needWhere; }
  if (VARIETY[c.lemma] && gnode) c.session = gnode.priority;
  c.note = gnode ? `closed: taught by ${gnode.id}` : num ? 'closed: number, taught with the unit theme' : c.need === c.session ? `closed: first used in ${c.needWhere}` : 'closed: grammar word, placed by frequency';
}

/* ---------------------------------------------------------------- receptive tier */
const placedIn = (b: Band) => [...cands.values()].filter((c) => c.tier && bandOfSession(c.session!) === b).length;
let cum = 0;
const pool = [...cands.values()].filter((c) => !c.tier && !c.closed && c.pos !== 'x' && c.pos !== 'interj');
for (const band of BANDS) {
  const bUnits = units.filter((u) => u.band === band);
  const have = placedIn(band);
  const quota = Math.max(0, CUM_TARGET[band] - cum - have);
  // theme words of this band's units first, then frequency (cognates and derived words read easily)
  const picks: Array<[Cand, Unit]> = [];
  for (const u of bUnits) {
    for (const w of seeds.get(u.id) ?? []) { const c = cands.get('l:' + w); if (c && !c.tier && !c.closed && c.pos !== 'interj' && !picks.some(([p]) => p === c)) picks.push([c, u]); }
  }
  const areaUnit = (c: Cand) => bUnits.find((u) => [...c.areas].some((a) => unitAreas(u).has(a)));
  // in band by frequency, by the old deck's level, or a cognate one band early (cognates read on sight)
  // A1–A2 readers meet theme words and cognates; from B1 any word of the band
  const early = bandIdx(band) <= 1;
  // everyday rather than institutional: at least half as common in speech as in Colombian web text
  const spokenish = (c: Cand) => { const f = freqBy.get(c.lemma); return !!f && f.sub >= 0.25 * f.web; };
  // word families: a derived word of something already taught reads easily (llegada < llegar, rápidamente < rápido)
  const stems = new Set([...cands.values()].filter((x) => x.tier === 'taught').map((x) => deaccent(x.lemma).replace(/(ar|er|ir)(se)?$|[aeo]$/, '')).filter((x) => x.length >= 4));
  const family = (c: Cand) => { const l = deaccent(c.lemma); for (let k = l.length - 2; k >= 4; k--) if (stems.has(l.slice(0, k))) return true; return false; };
  const rest = pool.filter((c) => !c.tier && bandIdx(naturalBand(c)) <= bandIdx(band) + (c.cognate && early ? 2 : c.cognate || family(c) || (early && areaUnit(c)) ? 1 : 0)
    && (!early || ((c.cognate || family(c)) && spokenish(c)) || (c.deckBand && bandIdx(c.deckBand) <= bandIdx(band)) || !!areaUnit(c)))
    .sort(byRank);
  let rr = 0;
  for (const c of rest) {
    if (picks.length >= quota) break;
    if (picks.some(([p]) => p === c)) continue;
    const u = areaUnit(c) ?? bUnits[rr++ % bUnits.length];
    picks.push([c, u]);
  }
  for (const [c, u] of picks.slice(0, quota)) {
    c.tier = 'receptive'; c.unit = u.id; c.session = firstInput(u);
    c.note = `receptive: met in reading from ${u.id}, not carded${c.cognate ? ' (cognate)' : ''}`;
  }
  cum += placedIn(band);
}

/* ---------------------------------------------------------------- outputs */
const final = [...cands.values()].filter((c) => c.tier).sort((a, b) => a.session! - b.session! || byRank(a, b));
const article = (c: Cand) => {
  if (c.display) return c.display;
  const dk = deckBy.get(c.lemma)?.[0];
  if (c.pos === 'noun' && dk && /^(los|las)$/.test(dk.article ?? '')) return `${dk.article} ${c.lemma}`;
  if (c.pos !== 'noun' || MONTHS.has(c.lemma)) return c.lemma;
  if (c.gender === 'mf') return `el/la ${c.lemma}`;
  if (c.gender === 'f') return (EL_FEM.has(c.lemma) ? 'el ' : 'la ') + c.lemma;
  return 'el ' + c.lemma;
};
const nodes: GraphNode[] = final.map((c) => GraphNode.parse({
  id: c.id, kind: 'lexeme', band: bandOfSession(c.session!), priority: c.session!,
  title: c.gloss, es: article(c), en: c.en,
  requires: [], contrasts: [], serves: [], pcic: c.pcic.slice(0, 6),
  placement: c.pcic.length ? 'pcic' : 'teaching_choice',
  ...(c.note ? { note: c.note } : {}),
  sources: c.sources,
  pos: c.pos, ...(c.gender ? { gender: c.gender } : {}), ...(c.rank ? { freqRank: c.rank } : {}),
  ...(c.pen ? { peninsular: c.pen } : {}), variety: c.variety ?? 'neutral',
}));
// ids must be unique
const ids = new Set<string>();
for (const n of nodes) { if (ids.has(n.id)) throw new Error('duplicate ' + n.id); ids.add(n.id); }
// no lexeme id may collide with another graph node
for (const n of nodes) if (graphById.has(n.id)) throw new Error('collides with graph ' + n.id);

const perBand: Record<string, Record<Tier, number>> = {};
for (const c of final) { const b = bandOfSession(c.session!); perBand[b] ??= { taught: 0, closed: 0, receptive: 0 }; perBand[b][c.tier!]++; }
console.log('session check: graph nodes scheduled before their priority:', sessionMismatch);
console.log('per band:', JSON.stringify(perBand));
let run = 0;
for (const b of BANDS) { const t = perBand[b]; run += t.taught + t.closed + t.receptive; console.log(`  ${b}: taught ${t.taught}, closed ${t.closed}, receptive ${t.receptive}; cumulative ${run} (target ${CUM_TARGET[b]})`); }
console.log('candidates', cands.size, 'final', final.length, 'needs on time', report.needPlacedOnTime, 'late', report.needPlacedLate.length, 'seed missing', seedMissing.length);
for (const s of slots) if (s.ids.length > s.cap) throw new Error('over cap ' + s.unit.id + ':' + s.di);

writeFileSync(join(OUT, 'placement.json'), JSON.stringify({
  perBand, late: report.needPlacedLate, seedMissing, multiwordSeeds, sessionMismatch,
  units: units.map((u) => ({ id: u.id, band: u.band, days: unitSlots.get(u.id)!.map((s) => ({ type: s.type, session: s.session, cap: s.cap, ids: s.ids })) })),
  receptiveByUnit: Object.fromEntries(units.map((u) => [u.id, final.filter((c) => c.tier === 'receptive' && c.unit === u.id).map((c) => c.id)])),
}, null, 1));
writeFileSync(join(OUT, 'inventory.tsv'), ['id\ttier\tband\tsession\tunit\tpos\tgender\trank\tppm\tcognate\tes\tgloss\tpeninsular\tsources']
  .concat(final.map((c) => [c.id, c.tier, bandOfSession(c.session!), c.session, c.unit ?? '', c.pos, c.gender ?? '', c.rank ?? '', c.ppm, c.cognate ? 'y' : '', article(c), c.gloss, c.pen ?? '', c.sources.join(',')].join('\t'))).join('\n') + '\n');
// everything not selected, for curation
writeFileSync(join(OUT, 'unselected.tsv'), [...cands.values()].filter((c) => !c.tier).sort(byRank).map((c) => [c.id, c.pos, c.contentRank ?? '', c.gloss].join('\t')).join('\n') + '\n');

if (!DRY) {
  writeFileSync(join(APP, 'content', 'graph', 'lexemes.json'), JSON.stringify(nodes, null, 1) + '\n');
  for (const u of units) {
    const p = join(APP, 'content', 'units', `${u.id}.json`);
    const raw = JSON.parse(readFileSync(p, 'utf8'));
    unitSlots.get(u.id)!.forEach((s, i) => { raw.days[i].lexemes = s.ids; });
    writeFileSync(p, JSON.stringify(raw, null, 1) + '\n');
  }
  console.log(`wrote ${nodes.length} lexemes and ${units.length} units`);
}
