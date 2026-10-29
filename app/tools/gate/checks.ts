// Per-file checks: accent, dialect, verb coverage, legality, typeability,
// computed requires, reading coverage, structure.
import type { BankSentence, Scene, StoryChapter, TeachingScript, WritingTask } from '../../src/content/schema';
import { accentLint, dialectLint, splitSentences, tagSentence, lemmatize, lexEntry, closedClass, type TagResult } from '../../src/engine/tagger';
import { answerForms, checkWriting, type Constraint } from '../../src/check';
import { extractSpanish, type EsString } from './extract';
import { clip, type Finding } from './findings';
import type { Curriculum, Loaded } from './load';

export interface RunState {
  /** tag once per distinct sentence per run */
  cache?: Map<string, TagResult>;
  cur: Curriculum;
  findings: Finding[];
  strict: boolean;
  /** node ids the tagger produced that are not in the graph: id -> uses */
  unmapped: Map<string, number>;
  /** lexemes not in the graph: lemma -> uses */
  missingLex: Map<string, number>;
  /** one-off notices already printed */
  noticed: Set<string>;
}

export function tagCached(st: RunState, text: string): TagResult {
  st.cache ??= new Map();
  let r = st.cache.get(text);
  if (!r) { r = tagSentence(text, st.cur.tagOpts); st.cache.set(text, r); }
  return r;
}

function notice(st: RunState, key: string, f: Finding): void {
  if (st.noticed.has(key)) return;
  st.noticed.add(key);
  st.findings.push(f);
}

/* ---- legality ---------------------------------------------------------------- */
interface Position { at: number; label: string; allow?: Set<string> }

function unitPos(st: RunState, unit: string | undefined, file: string, path: string): Position | null {
  if (!unit) return null;
  const end = st.cur.unitEnd.get(unit);
  if (end === undefined) {
    st.findings.push({ severity: 'error', check: 'legality', file, path, problem: `unit "${unit}" is not in content/units`, fix: 'use an existing unit id (u01…)' });
    return null;
  }
  return { at: end, label: `end of ${unit}` };
}

export function positionOf(st: RunState, f: Loaded, item: Record<string, unknown> | null, path: string): Position | null {
  const cur = st.cur;
  if (!cur.units.length) return null;
  switch (f.kind) {
    case 'bank': case 'writing': return unitPos(st, item?.unit as string | undefined, f.rel, path);
    case 'story': {
      const ch = f.data as StoryChapter;
      const at = cur.chapterAt.get(ch.id);
      return at !== undefined ? { at, label: `${ch.unit} (chapter day)` } : unitPos(st, ch.unit, f.rel, 'unit');
    }
    case 'scene': {
      const sc = f.data as Scene;
      const at = cur.sceneAt.get(sc.id);
      return at !== undefined ? { at, label: `${sc.unit} (scene day)` } : unitPos(st, sc.unit, f.rel, 'unit');
    }
    case 'script': {
      const s = f.data as TeachingScript;
      const at = cur.scriptAt.get(s.node) ?? cur.taughtAt.get(s.node);
      if (at === undefined) {
        st.findings.push({ severity: 'warning', check: 'legality', file: f.rel, path: 'node', problem: `script node ${s.node} is not scheduled in any unit`, fix: 'add it to a unit day focus' });
        return null;
      }
      return { at, label: `when ${s.node} is taught`, allow: new Set([s.node]) };
    }
    default: return null;
  }
}

export function legality(st: RunState, r: TagResult, pos: Position, file: string, path: string, text: string): void {
  const cur = st.cur;
  const chunkSpans = r.features.filter((x) => x.key.startsWith('chunk.') && (cur.taughtAt.get(x.node!) ?? Infinity) <= pos.at).map((x) => x.span);
  const inChunk = (sp: [number, number]) => chunkSpans.some(([a, b]) => sp[0] >= a && sp[1] <= b);
  const bad: string[] = [];
  const seen = new Set<string>();
  for (const ft of r.features) {
    const n = ft.node;
    if (!n || seen.has(n) || ft.key.startsWith('chunk.')) continue;   // chunks only ever exempt
    if (!cur.graphIds.has(n)) {
      if (n.startsWith('l:')) { if (cur.hasLexemes) st.missingLex.set(n, (st.missingLex.get(n) ?? 0) + 1); }
      else if (cur.graphIds.size) st.unmapped.set(n, (st.unmapped.get(n) ?? 0) + 1);
      continue;
    }
    if (pos.allow?.has(n)) continue;
    const t = cur.taughtAt.get(n);
    if (t !== undefined && t <= pos.at) continue;
    if (inChunk(ft.span)) continue;
    seen.add(n);
    bad.push(`${n} "${ft.text}" (${t === undefined ? 'never taught' : 'taught ' + cur.taughtWhere.get(n)})`);
  }
  if (bad.length) {
    st.findings.push({
      severity: 'error', check: 'legality', file, path,
      problem: `"${clip(text, 60)}" uses what is not taught by ${pos.label}: ${bad.join('; ')}`,
      fix: 'rephrase with taught grammar and words (or teach the chunk first)',
    });
  }
}

/* ---- typeability ------------------------------------------------------------- */
const UNTYPEABLE = /[()[\]{}<>/_|*#…]|\.\.\./;
export function typeable(st: RunState, file: string, path: string, answer: string): void {
  const forms = answerForms(answer);
  const ok = forms.some((x) => x.trim() && !UNTYPEABLE.test(x) && /[a-záéíóúñü]/i.test(x) && x.length <= 240);
  if (!ok) {
    st.findings.push({ severity: 'error', check: 'typeable', file, path, problem: `answer "${clip(answer)}" has no form a learner can type`, fix: 'write each accepted answer as plain Spanish; put alternatives in accept[], no brackets/slashes/ellipses/blanks' });
  }
}

/* ---- verb coverage ----------------------------------------------------------- */
// -ería / -aría are nouns as often as conditionals (panadería, ferretería), -aste / -iste too (desgaste, chiste): left out
const FINITE_END = /(aron|ieron|ábamos|íamos|asteis|isteis|aba|abas|aban|ando|iendo|yendo|arse|erse|irse|aré|eré|iré|arás|erás|irás|ará|erá|irá|aremos|eremos|iremos|arán|erán|irán)$/;
const PART_END = /(ado|ido|ada|ida|ados|idos|adas|idas)$/;
const INF_END = /(ar|er|ir)$/;
// only after haber: "es delicado", "está abarrotado" are adjectives, whatever the engine knows
const HABER = /^(he|has|ha|hemos|han|había|habías|habíamos|habían|haya|hayas|hayan|hubiera|hubieras|hubieran|habría|habrías|habrían|habrá|habrán|haber|habiendo)$/;
const AR_NOUNS = new Set('lugar hogar mar par bar azar collar altar pilar militar familiar particular popular regular similar singular escolar solar polar titular dólar mujer placer taller alfiler ayer cráter carácter revólver menester porvenir elixir emir nadir tapir sur auxiliar exterior interior superior inferior anterior posterior mayor menor mejor peor alrededor'.split(' '));
const INF_SLOT = new Set(['a', 'de', 'para', 'sin', 'al', 'puedo', 'puede', 'pueden', 'quiero', 'quiere', 'quieren', 'debe', 'deben', 'debo', 'voy', 'va', 'van', 'vamos', 'tengo', 'tiene', 'tienen', 'hay', 'que', 'podemos', 'queremos', 'necesito', 'necesita', 'suele', 'suelo', 'sabe', 'sé']);

export function verbCoverage(st: RunState, r: TagResult, file: string, path: string, severity: 'error' | 'warning' = 'error'): void {
  const toks = r.tokens;
  const bad: string[] = [];
  toks.forEach((w, i) => {
    if (w.punct || w.capMid || w.pos === 'propn' || ['verb', 'inf', 'ger', 'part'].includes(w.pos) || w.w.length < 4 || closedClass(w.w)) return;
    const lx = lexEntry(w.w) ?? lemmatize(w.w)?.entry;
    if (lx && lx.pos !== 'x' && lx.pos !== 'inf') return;          // a known noun / adjective
    const prev = toks[i - 1]?.w ?? '';
    if (FINITE_END.test(w.w) && !(lx && lx.pos === 'x' && !/(ando|iendo|aron|ieron|aba|ábamos)$/.test(w.w)) && !(w.cap && /ando$/.test(w.w))) bad.push(w.w);
    else if (PART_END.test(w.w) && HABER.test(prev)) bad.push(w.w);
    else if (INF_END.test(w.w) && INF_SLOT.has(prev) && !lx && !AR_NOUNS.has(w.w)) bad.push(w.w);
  });
  if (bad.length) {
    st.findings.push({ severity, check: 'verbs', file, path, problem: `verb form(s) the engine cannot analyse: ${[...new Set(bad)].join(', ')}`, fix: 'use a verb the engine knows (src/engine/verbs.json) or rephrase; the engine is the authority on forms' });
  }
}

/* Content that is Peninsular or voseo ON PURPOSE (recognition chunks such as
 * c:vale-spain, scripts for g:vosotros-recognition) is exempt from the
 * dialect lint. Until GraphNode has a field for it (see the schema
 * proposals), it is recognised by its target node, its id or its note. */
const RECOGNITION_NODES = new Set(['g:vosotros-recognition', 'g:voseo-recognition', 'g:spain-pasts', 'g:se-form-recognition', 'g:future-subj-recognition']);
function isRecognitionNode(st: RunState, id: string | undefined): boolean {
  if (!id) return false;
  if (RECOGNITION_NODES.has(id)) return true;
  const n = st.cur.nodes.get(id);
  return !!n && (RECOGNITION_NODES.has(n.unpacks ?? '') || /-(spain|vosotros|voseo|peninsular)$/.test(n.id) || /recognition only/i.test(n.note ?? ''));
}
function isRecognitionItem(st: RunState, f: Loaded, row: Record<string, unknown> | null): boolean {
  if (f.kind === 'graph') return isRecognitionNode(st, row?.id as string | undefined) || /recognition only/i.test(String(row?.note ?? ''));
  if (f.kind === 'script') return isRecognitionNode(st, (f.data as TeachingScript).node);
  if (f.kind === 'bank') return ((row?.targets as string[] | undefined) ?? []).some((t) => isRecognitionNode(st, t));
  if (f.kind === 'writing' || f.kind === 'scene') return isRecognitionNode(st, (row?.focus as string | undefined));
  return false;
}

/* ---- the per-string pass ----------------------------------------------------- */
export function checkStrings(st: RunState, f: Loaded): void {
  const items = extractSpanish(f.abs, f.data, f.kind);
  const raw = f.data as unknown[] | Record<string, unknown>;
  for (const s of items) {
    if (s.wrong) continue;
    const isBankEs = f.kind === 'bank' && /^\[\d+\]\.es$/.test(s.path);
    const sentences = f.kind === 'story' && s.path === 'text' ? splitSentences(s.text) : [s.text];
    // position for legality: the bank row / writing row, else the file
    const rowIdx = s.path.match(/^\[(\d+)\]/)?.[1];
    const row = rowIdx !== undefined && Array.isArray(raw) ? (raw[Number(rowIdx)] as Record<string, unknown>) : (raw as Record<string, unknown>);
    const pos = s.lint ? positionOf(st, f, row, s.path) : null;
    const recognition = isRecognitionItem(st, f, row);
    for (const sent of sentences) {
      const r = tagCached(st, sent);
      const where = sentences.length > 1 ? `${s.path} "${clip(sent, 40)}"` : s.path;
      if (s.lint) {
        for (const a of accentLint(sent, r.tokens)) st.findings.push({ severity: a.severity, check: 'accent', file: f.rel, path: where, problem: `${a.problem}${a.index >= 0 ? '' : ': "' + clip(a.word, 40) + '"'}`, fix: a.fix });
        if (!recognition) for (const d of dialectLint(sent, r.tokens)) st.findings.push({ severity: d.severity, check: 'dialect', file: f.rel, path: where, problem: d.problem, fix: d.fix });
        verbCoverage(st, r, f.rel, where, f.kind === 'graph' ? 'warning' : 'error');
      }
      if (pos) legality(st, r, pos, f.rel, where, sent);
      if (r.confidence === 'low' && (isBankEs || st.strict)) {
        st.findings.push({ severity: st.strict ? 'error' : 'warning', check: 'tagger', file: f.rel, path: where, problem: `low-confidence tag: ${r.lowReasons.slice(0, 4).join('; ')}`, fix: 'use words in the lexicon and a licensed subjunctive, or add the word to the graph' });
      }
    }
    if (s.answer) typeable(st, f.rel, s.path, s.text);
  }
}

/* ---- bank: requires is computed ------------------------------------------- */
export function checkBank(st: RunState, f: Loaded, fix: boolean): unknown[] | null {
  const rows = f.data as BankSentence[];
  const raw = f.raw as Array<Record<string, unknown>>;
  let changed = false;
  const ids = new Set<string>();
  rows.forEach((b, i) => {
    if (ids.has(b.id)) st.findings.push({ severity: 'error', check: 'schema', file: f.rel, path: `[${i}].id`, problem: `duplicate id "${b.id}" in this file`, fix: 'ids are unique: <unit>-<n>' });
    ids.add(b.id);
    const r = tagCached(st, b.es);
    const want = r.requires;
    const have = [...b.requires].sort();
    if (want.join('|') !== have.join('|')) {
      if (fix) { raw[i] = withRequires(raw[i], want); changed = true; }
      else {
        const missing = want.filter((x) => !have.includes(x));
        const extra = have.filter((x) => !want.includes(x));
        st.findings.push({ severity: 'error', check: 'requires', file: f.rel, path: `[${i}].requires`, problem: `requires is computed by the tagger and differs (${[missing.length ? '+' + missing.join(' +') : '', extra.length ? '-' + extra.join(' -') : ''].filter(Boolean).join(' ')})`, fix: `run: npm run gate -- --fix ${f.rel}` });
      }
    }
    for (const t of b.targets) {
      if (!want.includes(t)) {
        const sev = st.cur.graphIds.has(t) || !st.cur.graphIds.size ? 'error' : 'warning';
        st.findings.push({ severity: sev, check: 'requires', file: f.rel, path: `[${i}].targets`, problem: `target ${t} is not in what "${clip(b.es, 50)}" actually contains (${want.filter((x) => !x.startsWith('l:')).join(' ') || 'no grammar nodes'})`, fix: 'rewrite the sentence so it uses the target, or fix targets' });
      }
    }
  });
  return changed ? raw : null;
}

function withRequires(row: Record<string, unknown>, req: string[]): Record<string, unknown> {
  if ('requires' in row) return Object.fromEntries(Object.entries(row).map(([k, v]) => [k, k === 'requires' ? req : v]));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) { out[k] = v; if (k === 'accept' || k === 'acceptEn') { /* keep order */ } }
  out.requires = req;
  return out;
}

/* ---- structure ---------------------------------------------------------------- */
export function checkStructure(st: RunState, f: Loaded): void {
  const push = (path: string, problem: string, fix?: string) => st.findings.push({ severity: 'error', check: 'schema', file: f.rel, path, problem, fix });
  if (f.kind === 'script') {
    const s = f.data as TeachingScript;
    s.readAndPick.forEach((q, i) => { if (q.answer < 0 || q.answer >= q.options.length) push(`readAndPick[${i}].answer`, `answer index ${q.answer} is outside options[0..${q.options.length - 1}]`); });
    if (st.cur.graphIds.size && !st.cur.graphIds.has(s.node)) push('node', `node ${s.node} is not in the graph`, 'use a node id from content/graph');
  }
  if (f.kind === 'story') {
    const c = f.data as StoryChapter;
    c.questions.forEach((q, i) => {
      if (q.options && typeof q.answer === 'number' && (q.answer < 0 || q.answer >= q.options.length)) push(`questions[${i}].answer`, `answer index ${q.answer} is outside options`);
      if (!q.options && typeof q.answer === 'number') push(`questions[${i}].answer`, 'a numeric answer needs options');
      if (typeof q.answer === 'string') typeable(st, f.rel, `questions[${i}].answer`, q.answer);
    });
  }
  if (f.kind === 'scene') {
    const sc = f.data as Scene;
    const ids = new Set(sc.turns.map((t) => t.id));
    sc.turns.forEach((t, i) => { if (t.next !== null && !ids.has(t.next)) push(`turns[${i}].next`, `next "${t.next}" is not a turn id`, 'point next at an existing turn id or null'); });
    if (!sc.turns.some((t) => t.next === null)) push('turns', 'no turn ends the scene (next: null)');
  }
  if (f.kind === 'writing') {
    (f.data as WritingTask[]).forEach((w, i) => {
      const n = w.model.split(/\s+/).filter(Boolean).length;
      if (w.minWords > w.maxWords) push(`[${i}]`, `minWords ${w.minWords} > maxWords ${w.maxWords}`);
      else if (n < w.minWords || n > w.maxWords) push(`[${i}].model`, `model has ${n} words, outside ${w.minWords}–${w.maxWords}`, 'the model must meet its own task');
      if (w.constraints.length) {
        try {
          const res = checkWriting({ constraints: w.constraints as unknown as Constraint[] }, w.model);
          for (const c of res.results.filter((x) => !x.pass)) push(`[${i}].constraints`, `model fails its own constraint: ${c.label} (${c.detail})`, 'every model answer must satisfy its task constraints');
        } catch (e) { push(`[${i}].constraints`, `constraints not checkable: ${(e as Error).message}`); }
      }
    });
  }
  if (f.kind === 'graph') {
    const ids = new Set<string>();
    (f.data as Array<{ id: string; requires: string[]; contrasts: string[] }>).forEach((n, i) => {
      if (ids.has(n.id)) push(`[${i}].id`, `duplicate node id ${n.id}`);
      ids.add(n.id);
      for (const r of [...n.requires, ...n.contrasts]) if (!st.cur.graphIds.has(r)) st.findings.push({ severity: 'warning', check: 'schema', file: f.rel, path: `[${i}]`, problem: `${n.id} references ${r}, which is not in the graph` });
    });
  }
}

/* ---- reading coverage --------------------------------------------------------- */
export function readingCoverage(st: RunState, f: Loaded): void {
  const c = f.data as StoryChapter;
  if (!st.cur.hasLexemes) {
    notice(st, 'reading-skip', { severity: 'warning', check: 'reading', file: '', problem: 'reading coverage skipped: no lexeme nodes in the graph and no unit-day lexemes yet' });
    return;
  }
  const pos = positionOf(st, f, null, 'text');
  if (!pos) return;
  const glossed = new Set<string>();
  for (const g of c.gloss) for (const w of g.es.toLowerCase().split(/[^a-záéíóúñü]+/).filter(Boolean)) { glossed.add(w); const l = lemmatize(w); if (l) glossed.add(l.lemma); }
  let words = 0;
  const unknown = new Map<string, number>();
  let unknownUnglossed = 0;
  for (const sent of splitSentences(c.text)) {
    const r = tagCached(st, sent);
    words += r.tokens.filter((w) => !w.punct && w.pos !== 'propn' && w.pos !== 'num').length;
    for (const ft of r.features) {
      if (!ft.node?.startsWith('l:')) continue;
      const t = st.cur.taughtAt.get(ft.node);
      if (t !== undefined && t <= pos.at) continue;
      const lemma = ft.node.slice(2);
      unknown.set(lemma, (unknown.get(lemma) ?? 0) + 1);
      if (!glossed.has(lemma) && !glossed.has(ft.text.toLowerCase())) unknownUnglossed++;
    }
  }
  const total = [...unknown.values()].reduce((a, b) => a + b, 0);
  const pAll = words ? total / words : 0;
  const pUn = words ? unknownUnglossed / words : 0;
  if (pUn > 0.02 || pAll > 0.05) {
    const top = [...unknown.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k}${v > 1 ? '×' + v : ''}`).join(', ');
    st.findings.push({
      severity: 'error', check: 'reading', file: f.rel, path: 'text',
      problem: `${(100 * pUn).toFixed(1)}% unknown unglossed words (max 2%), ${(100 * pAll).toFixed(1)}% unknown incl. glossed (max 5%) of ${words}: ${top}`,
      fix: 'replace words not yet introduced, or gloss a few (gloss[]) — never more than 5%',
    });
  }
}

export type { EsString };
