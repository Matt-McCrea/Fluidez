// WHICH NODE DID THE LEARNER MISS? A multi-target review item (up to three due
// nodes in one sentence) is answered once, but one wrong word must not lapse
// all three. This reads the evidence the card gathered (the typed answer, or
// the option picked) and splits the outcome per node:
//   grades  nodes with a verdict: the attributed node gets the miss grade, a
//           node whose own word was typed right gets Good
//   expose  nodes the answer says nothing about: exposure only, no review
// Honesty rule: a miss that cannot be pinned on one node stays a miss for every
// node without positive evidence (the old behaviour), never a free pass.
import { analyzeToken, deaccent, tokenize } from '../../engine';
import type { Feature } from '../../exercises/types';
import type { GraphNode, NodeId } from '../../content/schema';
import { align, diagnose } from '../../check/translate/hints';
import { Rating, type Grade } from '../../learner';

/** What the card saw: set by the card views, read only here. */
export interface Evidence {
  /** the last thing typed */
  input?: string;
  /** the right version the checker showed */
  answer?: string;
  /** the option picked, or 'unsure' for "I don't know" */
  picked?: number | 'unsure';
  /** the one feature the multiple-choice options differ in */
  feature?: Feature;
}

export interface Attribution { grades: Record<NodeId, Grade>; expose: NodeId[] }

type Nodes = (id: NodeId) => GraphNode | undefined;
const GRAMMAR_KINDS = new Set(['grammar', 'pattern', 'contrast']);
const ARTICLE = /^(el|la|los|las|un|una|unos|unas)\s+/i;

const same = (a: string, b: string) => deaccent(a) === deaccent(b);
const nodeTexts = (n: GraphNode) => [n.es ?? '', ...(n.forms ?? []).map((f) => f.es)];

/** The tenses a node's own Spanish is written in. */
function tensesOf(n: GraphNode): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of nodeTexts(n).flatMap(tokenize)) {
    for (const a of analyzeToken(t)) if (a.accentExact && a.target && !a.clitics) m.set(a.tense, (m.get(a.tense) ?? 0) + 1);
  }
  return m;
}

/** Does this word belong to the node: its lemma, its surface word, or a word of the chunk? */
function wordIsNode(tok: string, id: NodeId, n: GraphNode | undefined): boolean {
  if (!n) return false;
  if (n.kind === 'lexeme') {
    const lemma = id.slice(2).split('#')[0];
    if (same(tok, lemma)) return true;
    const surface = (n.es ?? '').replace(ARTICLE, '');
    if (surface && surface.split(/\s+/).some((w) => same(w, tok))) return true;
    return analyzeToken(tok).some((a) => a.inf === lemma);
  }
  if (n.kind === 'chunk') return tokenize(n.es).some((w) => same(w, tok));
  return false;
}

/** The target of a grammar kind whose id names the topic, or undefined. */
const byId = (targets: NodeId[], nodes: Nodes, part: string) =>
  targets.find((t) => GRAMMAR_KINDS.has(nodes(t)?.kind ?? '') && t.includes(part));

/** The one grammar/pattern/contrast target concerned with any of these tenses. */
function byTense(targets: NodeId[], nodes: Nodes, tenses: Set<string>): NodeId | undefined {
  const scored = targets
    .filter((t) => GRAMMAR_KINDS.has(nodes(t)?.kind ?? ''))
    .map((t) => {
      const m = tensesOf(nodes(t)!);
      let s = 0;
      for (const x of tenses) s += m.get(x) ?? 0;
      return { t, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  if (!scored.length) return undefined;
  return scored.length === 1 || scored[0].s > scored[1].s ? scored[0].t : undefined;
}

function split(targets: NodeId[], miss: NodeId | undefined, grade: Grade, good: Set<NodeId>): Attribution {
  const grades: Record<NodeId, Grade> = {};
  const expose: NodeId[] = [];
  if (!miss) {
    // unattributable: a miss for everyone without positive evidence
    for (const t of targets) grades[t] = good.has(t) ? Rating.Good : grade;
    return { grades, expose };
  }
  for (const t of targets) {
    if (t === miss) grades[t] = grade;
    else if (good.has(t)) grades[t] = Rating.Good;
    else expose.push(t);
  }
  return { grades, expose };
}

function typedMiss(targets: NodeId[], nodes: Nodes, ev: Evidence, grade: Grade): Attribution {
  const input = tokenize(ev.input), expected = tokenize(ev.answer);
  if (!input.length || !expected.length) return split(targets, undefined, grade, new Set());
  const dg = diagnose(input, expected);
  const ops = align(input, expected);
  const real = ops.find((o) => o.op !== 'eq' && !(o.op === 'sub' && same(o.a!, o.b!)));
  // words typed exactly right: positive evidence for the nodes they belong to
  const right = ops.filter((o) => o.op === 'eq').map((o) => o.b!);
  const good = new Set(targets.filter((t) => right.some((w) => wordIsNode(w, t, nodes(t)))));
  const wanted = real?.b;
  let miss: NodeId | undefined;
  switch (dg.kind) {
    case 'ser-estar': miss = byId(targets, nodes, 'ser-estar'); break;
    case 'por-para': miss = byId(targets, nodes, 'por-para'); break;
    case 'verb-ending': {
      if (!wanted) break;
      const tenses = new Set(analyzeToken(wanted).filter((a) => a.accentExact).map((a) => a.tense));
      miss = byTense(targets, nodes, tenses);
      break;
    }
    case 'wrong-word': case 'missing-word': case 'spelling':
      if (wanted) miss = targets.find((t) => wordIsNode(wanted, t, nodes(t)));
      break;
  }
  if (miss) good.delete(miss);
  return split(targets, miss, grade, good);
}

function pickedMiss(targets: NodeId[], nodes: Nodes, ev: Evidence, grade: Grade): Attribution {
  const grammar = targets.filter((t) => GRAMMAR_KINDS.has(nodes(t)?.kind ?? ''));
  let miss: NodeId | undefined;
  switch (ev.feature) {
    case 'tense': case 'person': case 'mood': miss = grammar[0]; break;
    case 'copula': miss = byId(targets, nodes, 'ser-estar') ?? grammar[0]; break;
    case 'porpara': miss = byId(targets, nodes, 'por-para') ?? grammar[0]; break;
  }
  // a meaning question gives no evidence about a second node: the focus takes the miss
  return split(targets, miss ?? targets[0], grade, new Set());
}

/**
 * Split one outcome across the item's targets. `grade` is the uniform grade
 * (what a single target gets); `correct` outcomes and single targets are
 * returned unchanged.
 */
export function attributeGrades(targets: NodeId[], correct: boolean, grade: Grade, ev: Evidence | undefined, nodes: Nodes): Attribution {
  const uniform = (): Attribution => ({ grades: Object.fromEntries(targets.map((t) => [t, grade])), expose: [] });
  if (correct || targets.length < 2 || !ev) return uniform();
  if (ev.picked === 'unsure') return uniform();
  if (ev.picked !== undefined) return pickedMiss(targets, nodes, ev, grade);
  if (ev.input !== undefined && ev.answer) return typedMiss(targets, nodes, ev, grade);
  return uniform();
}
