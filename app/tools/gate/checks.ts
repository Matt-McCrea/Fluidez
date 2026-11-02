// Per-file checks: accent, dialect, verb coverage, legality, typeability,
// computed requires, reading coverage, structure.
import type { BankSentence, ContrastFile, Scene, StoryChapter, TeachingScript, WritingTask } from '../../src/content/schema';
import { accentLint, dialectLint, splitSentences, tagSentence, lemmatize, lexEntry, closedClass, DEFAULT_NODE_MAP, detectablePatterns, type TagResult } from '../../src/engine/tagger';
import { answerForms, checkWriting, type Constraint } from '../../src/check';
import { givesAwayByLength, longestShare } from '../../src/exercises/neighbours';
import { extractSpanish, type EsString } from './extract';
import { clip, type Finding } from './findings';
import { lateRequires, type Curriculum, type Loaded } from './load';
import { computeDaySupply, computeSceneSupply, computeWritingSupply, MIN } from '../supply/day-supply-core';

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
      const at = sc.spare ? undefined : cur.sceneAt.get(sc.id);   // a spare scene is gated at the end of its unit, like bank rows
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
    case 'contrast': {
      // a contrast's items are legal wherever its script is: the sentences come from it and from the scripts of its sides
      const c = f.data as ContrastFile;
      const at = cur.scriptAt.get(c.node) ?? cur.taughtAt.get(c.node);
      if (at === undefined) {
        st.findings.push({ severity: 'warning', check: 'legality', file: f.rel, path: 'node', problem: `contrast ${c.node} is not scheduled in any unit`, fix: 'add it to a unit day focus' });
        return null;
      }
      return { at, label: `when ${c.node} is taught`, allow: new Set([c.node, ...(cur.nodes.get(c.node)?.contrasts ?? [])]) };
    }
    default: return null;
  }
}

/** Token spans covered by chunks and patterns taught by `at`: what is inside is known as part of the whole. */
export function taughtSpans(st: RunState, r: TagResult, at: number): Array<[number, number]> {
  return r.features.filter((x) => (x.key.startsWith('chunk.') || x.key.startsWith('pattern.')) && (st.cur.taughtAt.get(x.node!) ?? Infinity) <= at).map((x) => x.span);
}

/** requires ⊆ taught by pos. Grammar is never rescued; with lexemes: false (story chapters)
 *  words are left to the reading-coverage check, where a gloss can rescue them. Patterns are
 *  detected heuristically, so a pattern before its day is a warning. */
/** Story chapters are glossed reading input: they may use grammar a little ahead of
 *  the learner (i+1), so early chapters can be natural Spanish. Lessons, drills and
 *  banks stay strictly at level. */
export const STORY_LOOKAHEAD = 15;

export function legality(st: RunState, r: TagResult, pos: Position, file: string, path: string, text: string, o: { lexemes?: boolean } = {}): void {
  const cur = st.cur;
  const horizon = o.lexemes === false ? pos.at + STORY_LOOKAHEAD : pos.at;
  const chunkSpans = taughtSpans(st, r, pos.at);
  const inChunk = (sp: [number, number]) => chunkSpans.some(([a, b]) => sp[0] >= a && sp[1] <= b);
  const bad: string[] = [];
  const early: string[] = [];
  const seen = new Set<string>();
  for (const ft of r.features) {
    const n = ft.node;
    if (!n || seen.has(n) || ft.key.startsWith('chunk.')) continue;   // chunks only ever exempt
    if (o.lexemes === false && n.startsWith('l:')) {
      if (!cur.graphIds.has(n) && cur.hasLexemes) st.missingLex.set(n, (st.missingLex.get(n) ?? 0) + 1);
      continue;
    }
    if (ft.key.startsWith('pattern.')) {
      if (inChunk(ft.span)) continue;                                   // "Me da igual" is c:me-da-igual's
      const t = cur.taughtAt.get(n);
      if (t !== undefined && t > pos.at && !pos.allow?.has(n)) { seen.add(n); early.push(`${n} "${ft.text}" (taught ${cur.taughtWhere.get(n)})`); }
      continue;
    }
    if (!cur.graphIds.has(n)) {
      if (n.startsWith('l:')) { if (cur.hasLexemes) st.missingLex.set(n, (st.missingLex.get(n) ?? 0) + 1); }
      else if (cur.graphIds.size) st.unmapped.set(n, (st.unmapped.get(n) ?? 0) + 1);
      continue;
    }
    if (pos.allow?.has(n)) continue;
    const t = cur.taughtAt.get(n);
    if (t !== undefined && t <= horizon) continue;
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
  if (early.length) {
    // Meeting a pattern before its lesson is exposure, not an error, so --strict
    // does not escalate it; grammar and chunks above stay hard errors.
    st.findings.push({
      severity: 'warning', check: 'legality', file, path,
      problem: `"${clip(text, 60)}" looks like a pattern not taught by ${pos.label}: ${early.join('; ')}`,
      fix: 'rephrase, or ignore if the pattern match is a coincidence',
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
 * c:vale-spain, scripts for g:vosotros-recognition) is exempt from the dialect
 * lint. The graph says so: GraphNode.variety !== 'neutral'. The hard-coded set
 * and the id/note regex below are a fallback kept for one release (added
 * 2026-10-29); delete them once every such node carries a variety. */
const RECOGNITION_NODES = new Set(['g:vosotros-recognition', 'g:voseo-recognition', 'g:spain-pasts', 'g:se-form-recognition', 'g:future-subj-recognition']);
function isRecognitionNode(st: RunState, id: string | undefined): boolean {
  if (!id) return false;
  const n = st.cur.nodes.get(id);
  if (n && n.variety !== 'neutral') return true;
  if (n?.unpacks && (st.cur.nodes.get(n.unpacks)?.variety ?? 'neutral') !== 'neutral') return true;
  if (RECOGNITION_NODES.has(id)) return true;
  return !!n && (RECOGNITION_NODES.has(n.unpacks ?? '') || /-(spain|vosotros|voseo|peninsular)$/.test(n.id) || /recognition only/i.test(n.note ?? ''));
}
function isRecognitionItem(st: RunState, f: Loaded, row: Record<string, unknown> | null): boolean {
  if (f.kind === 'graph') return isRecognitionNode(st, row?.id as string | undefined) || (!!row && row.variety !== undefined && row.variety !== 'neutral') || /recognition only/i.test(String(row?.note ?? ''));
  if (f.kind === 'script') return isRecognitionNode(st, (f.data as TeachingScript).node);
  if (f.kind === 'contrast') return isRecognitionNode(st, (f.data as ContrastFile).node);
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
      // a gloss entry is the help, not the text: never gated for legality
      if (pos && !/^gloss\[/.test(s.path)) legality(st, r, pos, f.rel, where, sent, { lexemes: f.kind !== 'story' });
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
        // targets are author intent: a pattern or contrast (matched heuristically, or never), or a
        // node no tagger feature maps to (g:sounds-letters), only warns
        // a chunk the tagger matched in the sentence can swallow the target's own feature
        // (c:ojala hides subj.ojala.past), so a row that contains a chunk only warns
        const masked = want.some((x) => x.startsWith('c:'));
        const sev = masked || t.startsWith('p:') || t.startsWith('x:') || !producible(st, t) ? 'warning' : st.cur.graphIds.has(t) || !st.cur.graphIds.size ? 'error' : 'warning';
        st.findings.push({ severity: sev, check: 'requires', file: f.rel, path: `[${i}].targets`, problem: `target ${t} is not in what "${clip(b.es, 50)}" actually contains (${want.filter((x) => !x.startsWith('l:')).join(' ') || 'no grammar nodes'})`, fix: 'rewrite the sentence so it uses the target, or fix targets' });
      }
    }
  });
  return changed ? raw : null;
}

let PRODUCIBLE: { cur: Curriculum; set: Set<string> } | null = null;
/** Can the tagger ever put this node in requires? */
function producible(st: RunState, id: string): boolean {
  if (id.startsWith('l:') || id.startsWith('c:')) return true;
  if (PRODUCIBLE?.cur !== st.cur) {
    const set = new Set<string>([...Object.values(DEFAULT_NODE_MAP), ...Object.values(st.cur.featureMap ?? {})].filter((x): x is string => !!x));
    for (const p of detectablePatterns(st.cur.tagOpts.patterns ?? [])) set.add(p);
    PRODUCIBLE = { cur: st.cur, set };
  }
  return PRODUCIBLE.set.has(id);
}

/* ---- story, scene, writing: requires (and a chapter's lexemes) are computed ---- */
/** The tagger's requires over a file's own Spanish (chapter text, scene npc lines and
 *  accepts, writing models). Chapters split grammar/chunks (requires) from words (lexemes);
 *  scenes and writing tasks keep words in requires, as bank sentences do. */
export function computedRequires(st: RunState, f: Loaded): Array<{ index: number | null; requires: string[]; lexemes?: string[] }> {
  const union = (texts: string[]) => { const r = new Set<string>(); for (const t of texts) for (const sent of splitSentences(t)) for (const x of tagCached(st, sent).requires) r.add(x); return [...r].sort(); };
  if (f.kind === 'story') {
    const c = f.data as StoryChapter;
    const all = union([c.text]);
    // grammar used inside the lookahead is exposure, not a requirement: the chapter is
    // served on its own day without waiting for those lessons
    const pos = positionOf(st, f, null, 'text');
    const needed = (x: string) => !pos || (st.cur.taughtAt.get(x) ?? -1) <= pos.at;
    return [{ index: null, requires: all.filter((x) => !x.startsWith('l:') && needed(x)), lexemes: all.filter((x) => x.startsWith('l:')) }];
  }
  if (f.kind === 'scene') {
    const sc = f.data as Scene;
    return [{ index: null, requires: union(sc.turns.flatMap((t) => [t.npc, ...t.accept])) }];
  }
  if (f.kind === 'writing') return (f.data as WritingTask[]).map((w, i) => ({ index: i, requires: union([w.model]) }));
  return [];
}

/** Check (or with fix, write) the computed requires/lexemes of a chapter, scene or writing file. */
export function checkComputed(st: RunState, f: Loaded, fix: boolean): unknown | null {
  const raw = f.raw as Record<string, unknown> | Array<Record<string, unknown>>;
  let out: unknown = raw;
  let changed = false;
  for (const want of computedRequires(st, f)) {
    const row = (want.index === null ? raw : (raw as Array<Record<string, unknown>>)[want.index]) as Record<string, unknown>;
    const at = want.index === null ? '' : `[${want.index}].`;
    const fields: Array<[string, string[]]> = [['requires', want.requires], ...(want.lexemes ? [['lexemes', want.lexemes] as [string, string[]]] : [])];
    let next = row;
    for (const [k, v] of fields) {
      const have = Array.isArray(row[k]) ? [...(row[k] as string[])].sort() : [];
      if (have.join('|') === v.join('|')) continue;
      if (fix) { next = withField(next, k, v); changed = true; continue; }
      const missing = v.filter((x) => !have.includes(x)), extra = have.filter((x) => !v.includes(x));
      st.findings.push({ severity: 'error', check: 'requires', file: f.rel, path: at + k, problem: `${k} is computed by the tagger and differs (${[missing.length ? '+' + missing.slice(0, 8).join(' +') + (missing.length > 8 ? ` …+${missing.length - 8}` : '') : '', extra.length ? '-' + extra.slice(0, 8).join(' -') : ''].filter(Boolean).join(' ')})`, fix: `run: npm run gate -- --fix ${f.rel}` });
    }
    if (next !== row) {
      if (want.index === null) out = next;
      else (raw as Array<Record<string, unknown>>)[want.index] = next;
    }
  }
  return changed ? out : null;
}

function withField(row: Record<string, unknown>, key: string, v: string[]): Record<string, unknown> {
  if (key in row) return Object.fromEntries(Object.entries(row).map(([k, x]) => [k, k === key ? v : x]));
  return { ...row, [key]: v };
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
  if (f.kind === 'contrast') checkContrastShape(st, f);
  if (f.kind === 'story') {
    const c = f.data as StoryChapter;
    c.questions.forEach((q, i) => {
      if (q.options && typeof q.answer === 'number' && (q.answer < 0 || q.answer >= q.options.length)) push(`questions[${i}].answer`, `answer index ${q.answer} is outside options`);
      if (!q.options && typeof q.answer === 'number') push(`questions[${i}].answer`, 'a numeric answer needs options');
      if (typeof q.answer === 'string') typeable(st, f.rel, `questions[${i}].answer`, q.answer);
    });
    const tally = new Map<number, number>();
    let n = 0;
    for (const q of [...c.questions, ...(c.rereadQuestions ?? [])]) {
      if (typeof q.answer === 'number') { tally.set(q.answer, (tally.get(q.answer) ?? 0) + 1); n++; }
    }
    const top = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
    if (n >= 5 && top && top[1] / n > 0.6) {
      st.findings.push({ severity: 'warning', check: 'balance', file: f.rel, path: 'questions', problem: `answers lean on option ${top[0]} (${top[1]} of ${n})`, fix: 'vary which option is right' });
    }
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

/* ---- contrasts: the items of one contrast --------------------------------------
 * A file holds one contrast's items and is named for it. Every item is one decision: the right option
 * is the slice of es the gap names, the options differ from each other, and the English is one pair
 * with the Spanish (no packed "/" variants). */
export function checkContrastShape(st: RunState, f: Loaded): void {
  const c = f.data as ContrastFile;
  const push = (path: string, problem: string, fix?: string) => st.findings.push({ severity: 'error', check: 'schema', file: f.rel, path, problem, fix });
  const want = `${c.node.replace(':', '_')}.json`;
  if (!f.abs.endsWith(`/${want}`)) push('node', `node "${c.node}" does not match the file name`, `name the file ${want}`);
  const node = st.cur.nodes.get(c.node);
  if (st.cur.graphIds.size && !node) push('node', `contrast ${c.node} is not in the graph`, 'use a node id from content/graph');
  else if (node && node.kind !== 'contrast') push('node', `${c.node} is not a contrast`, 'a contrast file is named for an x: node');
  const sides = node?.contrasts ?? [];
  const ids = new Set<string>();
  c.items.forEach((it, i) => {
    const at = `items[${i}]`;
    if (it.node !== c.node) push(`${at}.node`, `item is for ${it.node}, in the file of ${c.node}`);
    if (!it.id.startsWith(`${c.node}#`)) push(`${at}.id`, `id "${it.id}" does not begin with "${c.node}#"`, `ids are ${c.node}#<source>`);
    if (ids.has(it.id)) push(`${at}.id`, `duplicate id "${it.id}"`);
    ids.add(it.id);
    if (sides.length && !sides.includes(it.side)) push(`${at}.side`, `side ${it.side} is not one of ${c.node}'s sides (${sides.join(', ')})`);
    const [a, b] = it.gap;
    if (!(a < b && b <= it.es.length)) { push(`${at}.gap`, `gap [${a}, ${b}] is not a place in "${clip(it.es, 40)}"`); return; }
    if (it.answer >= it.options.length) { push(`${at}.answer`, `answer index ${it.answer} is outside options[0..${it.options.length - 1}]`); return; }
    const filled = it.es.slice(a, b);
    if (it.options[it.answer] !== filled) push(`${at}.options`, `the right option "${it.options[it.answer]}" is not what the gap holds ("${filled}")`, 'options[answer] is es.slice(gap)');
    if (new Set(it.options.map((o) => o.toLowerCase())).size !== it.options.length) push(`${at}.options`, 'two options are the same');
    if (it.options.some((o) => !o.trim() || o !== o.trim())) push(`${at}.options`, 'an option is empty or has spaces at its ends');
    if (it.en.includes('/') || it.es.includes('/')) push(`${at}.en`, 'the English and the Spanish are one exact pair: no "/" variants');
  });
}

/** requires is computed by the tagger over es, as for a bank row (--fix writes it). */
export function checkContrastRequires(st: RunState, f: Loaded, fix: boolean): unknown | null {
  const c = f.data as ContrastFile;
  const raw = f.raw as { items: Array<Record<string, unknown>> };
  let changed = false;
  c.items.forEach((it, i) => {
    const want = tagCached(st, it.es).requires;
    const have = [...it.requires].sort();
    if (want.join('|') === have.join('|')) return;
    if (fix) { raw.items[i] = withRequires(raw.items[i], want); changed = true; return; }
    const missing = want.filter((x) => !have.includes(x));
    const extra = have.filter((x) => !want.includes(x));
    st.findings.push({ severity: 'error', check: 'requires', file: f.rel, path: `items[${i}].requires`, problem: `requires is computed by the tagger and differs (${[missing.length ? '+' + missing.join(' +') : '', extra.length ? '-' + extra.join(' -') : ''].filter(Boolean).join(' ')})`, fix: `run: npm run gate -- --fix ${f.rel}` });
  });
  return changed ? raw : null;
}

/* ---- options that give themselves away by length ---------------------------------
 * A choice whose right option is the longest is passed by a reader who reads nothing:
 * the chapter questions have it 68 to 83% of the time by band (chance is 25%), and the
 * script picks 45 to 52%. The warning is per file, once most of its choices do it, and per
 * band over the whole corpus. Writing the wrong options as long and as likely as the right
 * one is a person's work (a rule that shortened or padded them would change what they say). */
interface Choice { options: readonly string[]; answer: number }

function choicesOf(f: Loaded): Choice[] {
  const out: Choice[] = [];
  if (f.kind === 'story') {
    const c = f.data as StoryChapter;
    for (const q of [...c.questions, ...(c.rereadQuestions ?? [])]) if (q.options && typeof q.answer === 'number') out.push({ options: q.options, answer: q.answer });
  }
  if (f.kind === 'script') for (const q of (f.data as TeachingScript).readAndPick) out.push(q);
  return out.filter((q) => q.answer >= 0 && q.answer < q.options.length);
}

export function optionLengths(st: RunState, f: Loaded): void {
  const rows = choicesOf(f);
  if (rows.length < 4) return;
  const given = rows.filter((q) => givesAwayByLength(q.options, q.answer)).length;
  if (given / rows.length < (f.kind === 'story' ? 0.6 : 0.5)) return;
  st.findings.push({
    severity: 'warning', check: 'options', file: f.rel, path: f.kind === 'story' ? 'questions' : 'readAndPick',
    problem: `the right option is the longest in ${given} of ${rows.length} choices, so a reader who reads nothing passes`,
    fix: 'write the wrong options as long and as likely as the right one (or shorten the right one)',
  });
}

/** Per band, over the whole corpus: how often tapping the longest option is right, against chance. */
export function optionBands(st: RunState, loaded: Loaded[]): void {
  const tally = new Map<string, { n: number; got: number; chance: number }>();
  for (const f of loaded) {
    if (!f.ok || (f.kind !== 'story' && f.kind !== 'script')) continue;
    const band = f.kind === 'story' ? st.cur.unitBand.get((f.data as StoryChapter).unit) : st.cur.nodes.get((f.data as TeachingScript).node)?.band;
    if (!band) continue;
    const key = `${band} ${f.kind === 'story' ? 'chapter questions' : 'lesson script picks'}`;
    const t = tally.get(key) ?? { n: 0, got: 0, chance: 0 };
    for (const q of choicesOf(f)) { t.n++; t.got += longestShare(q.options, q.answer); t.chance += 1 / q.options.length; }
    tally.set(key, t);
  }
  for (const [key, t] of [...tally].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (t.n < 20 || t.got / t.n <= t.chance / t.n + 0.08) continue;
    st.findings.push({
      severity: 'warning', check: 'options', file: '', problem: `${key}: tapping the longest option is right ${Math.round((100 * t.got) / t.n)}% of the time over ${t.n} choices (chance ${Math.round((100 * t.chance) / t.n)}%)`,
      fix: 'a rewrite of the wrong options, by a person who reads the chapter or the lesson',
    });
  }
}

/* ---- dashes and packed variants ----------------------------------------------
 * Learners never see an em dash, an en dash or a spaced hyphen: dialogue turns are
 * separate lines ("¿Ya comiste?\nTodavía no.") or "Vale: ¿Ya comiste?", and English
 * prose uses commas, colons, brackets and full stops. A node's es/en is ONE exact
 * translation pair: variants go in forms[], never packed with " / ". */
const AUTHOR_ONLY = new Set(['side', 'decides', 'note', 'storyArc', 'theme', 'sources', 'pcic', 'source', 'id', 'node', 'unit', 'chapter', 'scene', 'requires', 'lexemes', 'targets', 'focus', 'chunks', 'serves', 'contrasts', 'unpacks', 'tags', 'match', 'peninsular', 'next', 'kind', 'band', 'type', 'placement', 'variety', 'pos', 'gender']);
const DASH = /[\u2014\u2013]|\s-\s|^-\s|\s-$/;
export function checkDashes(st: RunState, f: Loaded): void {
  if (!['graph', 'unit', 'bank', 'script', 'contrast', 'story', 'scene', 'writing'].includes(f.kind)) return;
  const push = (path: string, problem: string, fix: string) => st.findings.push({ severity: 'error', check: 'dashes', file: f.rel, path, problem, fix });
  const walk = (x: unknown, path: string, key: string): void => {
    if (typeof x === 'string') {
      if (DASH.test(x)) push(path, `dash in learner-facing text: "${clip(x, 60)}"`, 'no em dashes, en dashes or spaced hyphens: put dialogue turns on separate lines (\\n) or "Name: line"; in English use a comma, colon, brackets or a full stop');
      return;
    }
    if (Array.isArray(x)) { x.forEach((y, i) => walk(y, `${path}[${i}]`, key)); return; }
    if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) if (!AUTHOR_ONLY.has(k)) walk(v, path ? `${path}.${k}` : k, k);
  };
  walk(f.raw, '', '');
  if (f.kind === 'graph') {
    (f.raw as Array<Record<string, unknown>>).forEach((n, i) => {
      if (n.kind === 'lexeme' || n.kind === 'cando') return;
      const strs: Array<[string, unknown]> = [[`[${i}].es`, n.es], [`[${i}].en`, n.en], ...((n.forms as Array<{ es: string; en: string }> | undefined) ?? []).flatMap((p, k) => [[`[${i}].forms[${k}].es`, p.es], [`[${i}].forms[${k}].en`, p.en]] as Array<[string, unknown]>)];
      for (const [path, v] of strs) if (typeof v === 'string' && /\s\/\s/.test(v)) push(path, `${n.id} packs variants with " / ": "${clip(v, 60)}"`, 'one exact es/en pair per string: put each variant in forms[] as its own {es, en}');
      const forms = n.forms as Array<{ es: string; en: string }> | undefined;
      if (forms?.length && (forms[0].es !== n.es || forms[0].en !== n.en)) push(`[${i}].forms[0]`, `${n.id}: es/en must be the main form, forms[0]`, 'copy forms[0] into es and en');
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
    // words inside a chunk or pattern taught by then are known as part of it (Me llamo, ¿Cómo estás?)
    const spans = taughtSpans(st, r, pos.at);
    for (const ft of r.features) {
      if (!ft.node?.startsWith('l:')) continue;
      if (spans.some(([a, b]) => ft.span[0] >= a && ft.span[1] <= b)) continue;
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
  // The first weeks know too few words for natural text at 5%: early chapters may
  // lean on glosses (tap to see) rather than go telegraphic. Unglossed stays at 2%.
  const glossCap = pos.at < 40 ? 0.2 : pos.at < 135 ? 0.1 : 0.05;
  if (pUn > 0.02 || pAll > glossCap) {
    const top = [...unknown.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k}${v > 1 ? '×' + v : ''}`).join(', ');
    st.findings.push({
      severity: 'error', check: 'reading', file: f.rel, path: 'text',
      problem: `${(100 * pUn).toFixed(1)}% unknown unglossed words (max 2%), ${(100 * pAll).toFixed(1)}% unknown incl. glossed (max ${Math.round(glossCap * 100)}%) of ${words}: ${top}`,
      fix: `replace words not yet introduced, or gloss them (gloss[]); at most ${Math.round(glossCap * 100)}% glossed here`,
    });
  }
}

/* ---- chapter length by band --------------------------------------------------- */
export const CHAPTER_WORDS: Record<string, [number, number]> = { A1: [80, 180], A2: [150, 260], B1: [220, 350], B2: [300, 450], C1: [400, 600] };
export function chapterLength(st: RunState, f: Loaded): void {
  const c = f.data as StoryChapter;
  const band = st.cur.unitBand.get(c.unit);
  const range = band ? CHAPTER_WORDS[band] : undefined;
  if (!range) return;
  const n = c.text.split(/\s+/).filter(Boolean).length;
  const [lo, hi] = range;
  if (n > hi) st.findings.push({ severity: st.strict ? 'error' : 'warning', check: 'length', file: f.rel, path: 'text', problem: `${n} words, over the ${band} maximum (${lo} to ${hi})`, fix: 'cut scenes, not words: keep every sentence natural rather than telegraphic' });
  else if (n < lo) st.findings.push({ severity: 'warning', check: 'length', file: f.rel, path: 'text', problem: `${n} words, under the ${band} minimum (${lo} to ${hi})`, fix: 'give the chapter its moment: a want, a problem, a turn' });
}

export type { EsString };

/* ---- day supply ------------------------------------------------------------------ */
/** Bank rows are gated at the end of their unit, but the session compiler serves a row only
 *  when everything it requires is taught by that day. Warn for each (unit, day, node) whose
 *  usable rows fall under the minimum (9 on an introduce day, 11 and 4 questions on a drill
 *  day, 40 per grammar node by its drill day). Only units that have bank rows are checked. */
export function daySupply(st: RunState, loaded: Loaded[], only: Set<string> | null): void {
  const cur = st.cur;
  if (!cur.units.length) return;
  scheduleCheck(st, loaded, only);
  const rows = loaded.filter((f) => f.kind === 'bank' && f.ok).flatMap((f) => f.data as BankSentence[]);
  const withRows = new Set(rows.map((b) => b.unit).filter((u): u is string => !!u));
  const tasks = loaded.filter((f) => f.kind === 'writing' && f.ok).flatMap((f) => f.data as WritingTask[]);
  const scenes = loaded.filter((f) => f.kind === 'scene' && f.ok).map((f) => f.data as Scene);
  const wUnits = new Set(tasks.map((t) => t.unit)), sUnits = new Set(scenes.map((x) => x.unit));
  const wsUnits = new Set(cur.units.map((u) => u.id).filter((id) => (!only || only.has(id))));
  for (const w of computeWritingSupply(cur, tasks, { units: new Set([...wsUnits].filter((id) => wUnits.has(id))) })) {
    if (!w.short) continue;
    st.findings.push({
      severity: 'warning', check: 'daySupply', file: `content/writing/${w.unit}.json`, path: `${w.unit} day ${w.day}`,
      problem: `${w.node} on ${w.type} day ${w.day} (session ${w.session}): ${w.usable} usable writing tasks (${w.total} focused on it), needs ${w.min}; a task whose requires come later does not count`,
      fix: `add writing tasks focused on ${w.node} whose model uses only what is taught up to day ${w.day}`,
    });
  }
  for (const x of computeSceneSupply(cur, scenes, { units: new Set([...wsUnits].filter((id) => sUnits.has(id))) })) {
    if (!x.short) continue;
    st.findings.push({
      severity: 'warning', check: 'daySupply', file: `content/scenes/`, path: `${x.unit} day ${x.day}`,
      problem: `output day ${x.day} (session ${x.session}): no scene usable (named ${x.named ?? 'none'}${x.named && !x.namedUsable ? ', requires something taught later' : ''}; ${x.spareUsable.length} spare usable)`,
      fix: `add a scene for ${x.unit} that uses only what is taught up to day ${x.day}`,
    });
  }
  const units = new Set(cur.units.map((u) => u.id).filter((id) => withRows.has(id) && (!only || only.has(id))));
  if (!units.size) return;
  const rep = computeDaySupply(cur, rows, { units });
  const file = (u: string) => `content/bank/${u}.json`;
  for (const d of rep.days) for (const n of d.nodes) {
    if (!n.short && !n.shortQuestions) continue;
    const bits = [n.short ? `${n.usable} usable rows, needs ${n.min} for ${n.block}` : '', n.shortQuestions ? `${n.questions} usable questions, needs ${n.minQuestions}` : ''].filter(Boolean).join('; ');
    st.findings.push({
      severity: 'warning', check: 'daySupply', file: file(d.unit), path: `${d.unit} day ${d.day}`,
      problem: `${n.node} on ${d.type} day ${d.day} (session ${d.session}): ${bits} (rows legal only by the unit end do not count)`,
      fix: `add rows targeting ${n.node} that use only what is taught up to day ${d.day}`,
    });
  }
  for (const n of rep.unitNodes) {
    if (n.targeted < MIN.targeted) {
      // every grammar node has its top-up rows now (wave 3): in a band marked complete
      // (content/units/_complete.json) a thin node is an error; elsewhere it warns unless --strict
      const band = st.cur.units.find((u) => u.id === n.unit)?.band;
      st.findings.push({
        severity: st.strict || (band && st.cur.completeBands.has(band)) ? 'error' : 'warning', check: 'daySupply', file: file(n.unit), path: `${n.unit} day ${n.drillDay}`,
        problem: `${n.node}: ${n.targeted} bank rows target it (minimum ${MIN.targeted})`,
        fix: `queue a top-up: npx tsx tools/burn/load-topup.ts --node ${n.node}`,
      });
    }
    if (!n.short) continue;
    st.findings.push({
      severity: 'warning', check: 'daySupply', file: file(n.unit), path: `${n.unit} day ${n.drillDay}`,
      problem: `${n.node}: ${n.usable} rows usable by its drill day ${n.drillDay} (session ${n.session}), needs ${n.min}`,
      fix: `add rows targeting ${n.node} legal by day ${n.drillDay}`,
    });
  }
}

/* ---- the schedule: a day's scene, chapter or focused writing task must fit what is taught by then ---- */
/** The compiler gates a scene out when it requires a non-word node taught after the day's session, and
 *  the day then runs without it. Check every named scene and chapter, and every focused writing task at the
 *  first day that teaches its focus. */
export function scheduleCheck(st: RunState, loaded: Loaded[], only: Set<string> | null): void {
  const cur = st.cur;
  if (!cur.units.length) return;
  const scenes = new Map(loaded.filter((f) => f.kind === 'scene' && f.ok).map((f) => [(f.data as Scene).id, { s: f.data as Scene, rel: f.rel }]));
  const chapters = new Map(loaded.filter((f) => f.kind === 'story' && f.ok).map((f) => [(f.data as StoryChapter).id, { s: f.data as StoryChapter, rel: f.rel }]));
  const tasks = loaded.filter((f) => f.kind === 'writing' && f.ok).flatMap((f) => (f.data as WritingTask[]).map((t) => ({ t, rel: f.rel })));
  const late = (requires: string[], session: number) => lateRequires(cur, requires, session);
  for (const u of cur.units) {
    if (only && !only.has(u.id)) continue;
    u.days.forEach((d, i) => {
      const session = cur.daySession.get(`${u.id}#${i}`)!;
      const report = (kind: string, id: string, rel: string, bad: string[]) => st.findings.push({
        severity: st.strict ? 'error' : 'warning', check: 'schedule', file: rel, path: `${u.id} day ${i + 1}`,
        problem: `${kind} ${id} is set for ${u.id} day ${i + 1} (session ${session}) but requires ${bad.map((b) => `${b}@${cur.taughtAt.get(b)}`).join(', ')}, taught later`,
        fix: `rewrite ${kind === 'scene' ? 'the scene' : kind === 'chapter' ? 'the chapter' : 'the task'} to use only what is taught by session ${session}, or move it to a later day`,
      });
      if (d.scene && scenes.has(d.scene)) { const x = scenes.get(d.scene)!; const bad = late(x.s.requires, session); if (bad.length) report('scene', d.scene, x.rel, bad); }
      if (d.chapter && chapters.has(d.chapter)) { const x = chapters.get(d.chapter)!; const bad = late(x.s.requires ?? [], session); if (bad.length) report('chapter', d.chapter, x.rel, bad); }
    });
    // writing: a day that serves a task (output, drill, checkpoint) needs one admissible by its session
    const mine = tasks.filter((x) => x.t.unit === u.id);
    const dry: number[] = [];
    if (mine.length) u.days.forEach((d, i) => {
      if (!['output', 'drill', 'checkpoint'].includes(d.type)) return;
      const session = cur.daySession.get(`${u.id}#${i}`)!;
      if (!mine.some((x) => !late(x.t.requires, session).length)) dry.push(i + 1);
    });
    if (dry.length) st.findings.push({
      severity: st.strict ? 'error' : 'warning', check: 'schedule', file: `content/units/${u.id}.json`, path: `${u.id} day ${dry.join(', ')}`,
      problem: `no writing task of ${u.id} is admissible by the session of day ${dry.join(', ')} (${mine.length} task(s) in the unit)`,
      fix: `add or rewrite a ${u.id} writing task that uses only what is taught by day ${dry[0]}`,
    });
  }
}
