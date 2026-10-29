// A synthetic course + content corpus with the real schema's shapes, so the
// compiler and simulator can run (and quotas can be computed) before the burn
// produces content. Deterministic for a seed.
//
// With `units`/`nodes` given (the architect's real unit map), only the content
// (bank, chapters, scenes, writing tasks, scripts) is synthesised for them.
// Supply is deliberately generous (`supply` multiplies it) so the simulator
// measures demand, not shortage.
import type { Band, BankSentence, GraphNode, LessonType, NodeId, Scene, StoryChapter, Unit, WritingTask } from '../../src/content/schema';
import { makeRng, type ContentSource, type ScriptRef } from '../../src/compiler';

export interface SyntheticOptions {
  seed?: number;
  /** multiplies every per-node sentence count and per-unit scene/task count */
  supply?: number;
  /** use these instead of generating a unit map */
  units?: Unit[];
  nodes?: GraphNode[];
  /** limit the generated course to the first n units (tests) */
  maxUnits?: number;
  /**
   * Add synthetic lexemes to a unit map that has none (the vocab rebuild is a
   * separate queue): BLUEPRINT weekly budgets, poured into input/introduce/
   * drill/patterns days within the compiler's caps. Default: when no unit lists a lexeme.
   */
  injectLexemes?: boolean;
}

export interface SyntheticCorpus { units: Unit[]; nodes: GraphNode[]; source: ContentSource; injectedLexemes: number }

/** Units per band (plan: A1 ~14, A2 ~13, B1 ~14, B2 ~10, C1 ~9). */
export const BAND_UNITS: [Band, number][] = [['A1', 14], ['A2', 13], ['B1', 14], ['B2', 10], ['C1', 9]];

/** Sentences per node written for it (targets), before the supply multiplier. */
export const SENTENCES_PER_NODE: Record<GraphNode['kind'], number> = {
  lexeme: 16, chunk: 16, grammar: 90, pattern: 30, contrast: 20, cando: 0,
};

const CHAPTER_WORDS: Record<Band, number> = { A1: 150, A2: 250, B1: 350, B2: 500, C1: 650 };

function node(id: NodeId, kind: GraphNode['kind'], band: Band, priority: number, extra: Partial<GraphNode> = {}): GraphNode {
  return {
    id, kind, band, priority, title: id, requires: [], contrasts: [], serves: [], pcic: [],
    placement: 'pcic', sources: [], ...extra,
  } as GraphNode;
}

function day(type: LessonType, d: Partial<Unit['days'][number]> = {}): Unit['days'][number] {
  return { type, focus: [], chunks: [], lexemes: [], ...d };
}

/** The synthetic unit map: the A1-A2 week, B1+ shifts toward input/output; Patterns days where themes need them. */
export function syntheticCourse(_seed = 1, maxUnits?: number): { units: Unit[]; nodes: GraphNode[] } {
  const units: Unit[] = [];
  const nodes: GraphNode[] = [];
  let ui = 0;
  let prio = 0;
  let g = 0, l = 0, c = 0, p = 0, x = 0;
  const grammarSoFar: NodeId[] = [];
  const add = (n: GraphNode) => { nodes.push(n); return n.id; };
  for (const [band, count] of BAND_UNITS) {
    for (let k = 0; k < count; k++) {
      if (maxUnits !== undefined && ui >= maxUnits) break;
      ui++;
      const uid = `u${String(ui).padStart(2, '0')}`;
      const early = band === 'A1' || band === 'A2';
      const grammarCount = band === 'C1' ? (k % 2 === 0 ? 1 : 0) : band === 'B2' ? 1 : 2;
      const lexPerWeek = { A1: 32, A2: 30, B1: 28, B2: 26, C1: 24 }[band];
      const chunkPerWeek = ui <= 2 ? 25 : early ? 8 : 4;
      const hasPatterns = !early || k % 3 === 2;
      const gram = Array.from({ length: grammarCount }, () => add(node(`g:g${++g}`, 'grammar', band, prio++, { requires: grammarSoFar.slice(-2) })));
      const lex = Array.from({ length: lexPerWeek }, () => add(node(`l:w${++l}`, 'lexeme', band, prio++)));
      const chunks = Array.from({ length: chunkPerWeek }, () => add(node(`c:k${++c}`, 'chunk', band, prio++)));
      const pats = hasPatterns ? Array.from({ length: early ? 2 : 3 }, () => add(node(`p:p${++p}`, 'pattern', band, prio++, { requires: grammarSoFar.slice(-1) }))) : [];
      const contrast = grammarSoFar.length >= 3 && ui % 3 === 0
        ? add(node(`x:x${++x}`, 'contrast', band, prio++, { contrasts: [grammarSoFar[grammarSoFar.length - 1], grammarSoFar[grammarSoFar.length - 3]] }))
        : undefined;
      // the day skeleton, then words/chunks poured in within the compiler's per-day caps
      const [gA, gB] = gram;
      const prevB = grammarSoFar[grammarSoFar.length - 1];
      const days: Unit['days'] = [];
      if (gA) days.push(day('introduce', { focus: [gA] }), day('drill', { focus: prevB ? [gA, prevB] : [gA] }));
      days.push(day('input'));
      if (hasPatterns) days.push(day('patterns', { focus: pats }));
      if (gB) days.push(day('introduce', { focus: contrast ? [gB, contrast] : [gB] }), day('drill', { focus: [gB, gA] }));
      else days.push(day('input', { focus: contrast ? [contrast] : [] }));
      days.push(day('output'), day(ui % 4 === 0 ? 'checkpoint' : 'review'));
      // nominal shares first (input days carry the bulk), then fill to the caps, then an extra input day
      const lexNominal: Partial<Record<LessonType, number>> = { introduce: 5, drill: 2, input: 13, patterns: 3 };
      const lexCap: Partial<Record<LessonType, number>> = { introduce: 6, drill: 4, input: 16, patterns: 6 };
      const chunkCap = ui <= 2 ? 5 : 2;
      const pour = (q: NodeId[], key: 'lexemes' | 'chunks', share: (d: Unit['days'][number]) => number) => {
        for (const d of days) d[key].push(...q.splice(0, Math.max(0, share(d) - d[key].length)));
      };
      const lexQ = [...lex];
      const chunkQ = [...chunks];
      pour(lexQ, 'lexemes', (d) => lexNominal[d.type] ?? 0);
      pour(lexQ, 'lexemes', (d) => lexCap[d.type] ?? 0);
      pour(chunkQ, 'chunks', (d) => (lexCap[d.type] ? chunkCap : 0));
      pour(chunkQ, 'chunks', (d) => (lexCap[d.type] ? 5 : 0));
      while ((lexQ.length || chunkQ.length) && days.length < 10) {
        const extra = day('input', { lexemes: lexQ.splice(0, 16), chunks: chunkQ.splice(0, 5) });
        days.splice(days.length - 2, 0, extra);
      }
      grammarSoFar.push(...gram);
      units.push({
        id: uid, band, title: `Unit ${ui}`, theme: `theme ${ui}`, canDo: `I can do unit ${ui} things`,
        days, storyArc: `arc ${ui}`,
      });
    }
  }
  return { units, nodes };
}

/** Content for a unit map: bank sentences per node, a chapter per input/introduce day, scenes, tasks, scripts. */
export function syntheticCorpus(opts: SyntheticOptions = {}): SyntheticCorpus {
  const seed = opts.seed ?? 1;
  const supply = opts.supply ?? 1;
  const base = opts.units && opts.nodes ? { units: opts.units, nodes: opts.nodes } : syntheticCourse(seed, opts.maxUnits);
  const units = structuredClone(opts.maxUnits !== undefined ? base.units.slice(0, opts.maxUnits) : base.units);
  const nodes = [...base.nodes];
  const hasLexemes = units.some((u) => u.days.some((d) => d.lexemes.length));
  const injectedLexemes = (opts.injectLexemes ?? !hasLexemes) ? injectLexemes(units, nodes) : 0;
  const r = makeRng(seed);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // teaching order: the order nodes appear in the unit days
  const order: NodeId[] = [];
  const unitOf = new Map<NodeId, string>();
  const seenN = new Set<NodeId>();
  for (const u of units) for (const d of u.days) for (const n of [...d.focus, ...d.chunks, ...d.lexemes]) {
    if (seenN.has(n)) continue;
    seenN.add(n); order.push(n); unitOf.set(n, u.id);
  }
  const kind = (id: NodeId) => byId.get(id)?.kind ?? ({ g: 'grammar', p: 'pattern', c: 'chunk', l: 'lexeme', x: 'contrast', d: 'cando' } as const)[id[0] as 'g'];

  const sentences: BankSentence[] = [];
  let sn = 0;
  for (const [i, n] of order.entries()) {
    const k = kind(n);
    const count = Math.round(SENTENCES_PER_NODE[k] * supply);
    const unit = unitOf.get(n)!;
    for (let j = 0; j < count; j++) {
      const req = new Set<NodeId>([n]);
      // 3-6 other nodes known by this point, biased toward recent material
      const others = r.int(3, 6);
      for (let t = 0; t < others && i > 0; t++) {
        const back = Math.floor(Math.pow(r.next(), 2) * i);
        req.add(order[i - 1 - Math.min(back, i - 1)]);
      }
      if (k === 'contrast') for (const s of byId.get(n)?.contrasts ?? []) req.add(s);
      const q = r.next() < 0.3;
      sentences.push({
        id: `${unit}-${++sn}`, es: q ? `¿frase ${sn}?` : `frase ${sn}.`, en: `sentence ${sn}`,
        accept: [], acceptEn: [], requires: [...req], targets: [n], unit, source: 'gen',
      });
    }
  }

  const chapters: StoryChapter[] = [];
  const scenes: Scene[] = [];
  const writing: WritingTask[] = [];
  const scripts: ScriptRef[] = [];
  let chn = 0;
  // a real unit map assigns its own chapter slots; only synthesise slots when it has none
  const mapHasChapters = units.some((u) => u.days.some((d) => d.chapter));
  for (const u of units) {
    const grammar: NodeId[] = [];
    for (const [di, d] of u.days.entries()) {
      for (const f of d.focus) if (kind(f) === 'grammar') grammar.push(f);
      if (!mapHasChapters && !d.chapter && (d.type === 'input' || d.type === 'introduce')) {
        d.chapter = `ch${String(++chn).padStart(3, '0')}`;
      }
      if (d.chapter) {
        chapters.push({
          id: d.chapter, unit: u.id, title: `Chapter ${d.chapter}`,
          text: Array.from({ length: CHAPTER_WORDS[u.band] }, (_, w) => `w${w}`).join(' '),
          gloss: [], questions: Array.from({ length: 4 }, (_, qi) => ({ q: `q${qi}`, options: ['a', 'b'], answer: 0 })),
          rereadQuestions: [], requires: [], lexemes: [],
          hook: `hook ${d.chapter}`,
        });
      }
      if (d.type === 'output' && !d.scene) d.scene = `sc-${u.id}-${di}`;
      if (d.scene) scenes.push(mkScene(d.scene, u.id, grammar));
    }
    const extraScenes = Math.ceil(3 * supply);
    for (let s = 0; s < extraScenes; s++) scenes.push(mkScene(`sc-${u.id}-x${s}`, u.id, grammar));
    const unfocused = Math.ceil(4 * supply);
    for (let t = 0; t < unfocused; t++) writing.push(mkTask(`wt-${u.id}-${t}`, u, undefined));
    for (const gnode of grammar) for (let t = 0; t < Math.ceil(4 * supply); t++) writing.push(mkTask(`wt-${u.id}-${gnode.slice(2)}-${t}`, u, gnode));
  }
  for (const n of order) {
    const k = kind(n);
    if (k === 'grammar' || k === 'pattern') scripts.push({ node: n, readAndPick: 8, yourTurn: 6 });
  }
  return { units, nodes, source: { sentences, chapters, scenes, writing, scripts }, injectedLexemes };
}

/** BLUEPRINT weekly new-word budgets (A1 35-40 items incl. chunks → ~30 words), per 7 days. */
const LEX_PER_WEEK: Record<Band, number> = { A1: 30, A2: 28, B1: 28, B2: 26, C1: 24 };
const LEX_NOMINAL: Partial<Record<LessonType, number>> = { introduce: 4, drill: 1, input: 13, patterns: 2 };
const LEX_DAY_CAP: Partial<Record<LessonType, number>> = { introduce: 6, drill: 4, input: 16, patterns: 6 };

function injectLexemes(units: Unit[], nodes: GraphNode[]): number {
  let n = 0;
  let prio = nodes.reduce((a, x) => Math.max(a, x.priority), 0) + 1;
  for (const u of units) {
    const want = Math.round((LEX_PER_WEEK[u.band] * u.days.length) / 7);
    const q = Array.from({ length: want }, () => {
      const id = `l:syn${++n}`;
      nodes.push(node(id, 'lexeme', u.band, prio++));
      return id;
    });
    for (const share of [LEX_NOMINAL, LEX_DAY_CAP]) {
      for (const d of u.days) d.lexemes.push(...q.splice(0, Math.max(0, (share[d.type] ?? 0) - d.lexemes.length)));
    }
    // anything left (a unit with few word-carrying days) is dropped: the week is full
  }
  return n;
}

function mkScene(id: string, unit: string, grammar: NodeId[]): Scene {
  return {
    id, unit, title: id, brief: `brief ${id}`, spare: false,
    turns: Array.from({ length: 6 }, (_, t) => ({
      id: `t${t}`, npc: 'hola', npcEn: 'hi', intent: 'answer', accept: ['sí'], require: [],
      focus: grammar[t % Math.max(1, grammar.length)], next: t < 5 ? `t${t + 1}` : null,
    })),
    requires: [],
  };
}

function mkTask(id: string, u: Unit, focus: NodeId | undefined): WritingTask {
  const words = { A1: 30, A2: 60, B1: 100, B2: 200, C1: 300 }[u.band];
  return { id, unit: u.id, prompt: `write ${id}`, minWords: Math.round(words / 2), maxWords: words, constraints: [], model: 'modelo', focus, requires: [] };
}

