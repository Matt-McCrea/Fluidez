/* ============================================================================
 * PERSONAL: "is this Spanish, and does it use the day's form?"
 *
 * The app cannot grade open meaning (no AI), so this checks only what can be
 * checked honestly: the sentence is mostly Spanish words, and it uses the form
 * the lesson taught. Everything else is left to the learner, with a model
 * beside it for comparison.
 *
 *   spanishShare  the share of word tokens that are Spanish: a closed-class
 *                 word, a word in the lexicon (vocabulary and bank sentences),
 *                 a verb form the engine reads, or anything carrying an accent
 *                 or ñ. Capitalised words that do not open the sentence are
 *                 names and are left out of the count. Common English function
 *                 words are vetoed first ("a" and "no" stay: both are Spanish).
 *   usedForm      a token that is a form of the node's verb (any tense, any
 *                 person), or one of the node's words; for a lexeme node, the
 *                 lexeme itself.
 * ========================================================================== */
import { analyzeToken, deaccent } from '../engine';
import type { GraphNode, TeachingScript } from '../content/schema';
import { lexBase, lexIndex } from './lexmatch';

export const SPANISH_SHARE_MIN = 0.7;

const CLOSED = `a al algo alguien algun alguna algunas alguno algunos ante antes aqui asi aun aunque bien cada casi como con contra cual cuales cuando cuanto cuanta cuantos cuantas de del desde donde dos e el ella ellas ello ellos en entre esa esas ese eso esos esta estas este esto estos hasta hay hoy la las le les lo los mas me mi mia mias mio mios mis mucho mucha muchos muchas muy nada nadie ni no nos nosotros nosotras nuestro nuestra nuestros nuestras o os otra otras otro otros para pero poco poca pocos pocas por porque pues que quien quienes se sea segun ser si sin sobre su sus tambien tan tanto tanta te ti todo toda todos todas tras tu tus u un una uno unas unos usted ustedes vosotros vuestro y ya yo tu cuatro tres uno cinco seis siete ocho nueve diez cien mil ahora despues luego siempre nunca mañana ayer aca alla alli ahi aquel aquella aquellos aquellas mientras tal vez ademas entonces quiza quizas`.split(/\s+/);
const CLOSED_SET = new Set(CLOSED.map(deaccent));

// English words that are never Spanish. Words both languages own (a, no, me, he, son, pan, sin...) are not here.
const ENGLISH = new Set(`the i am is are was were be been being my your his her its our their you we they it and of to in from with for on at by this that these those what where when who why how not do does did have has had will would can could should an or but if so as about into than then there here very just also too some any all each every more most much many one two three which while because name live work like love want need go going she eat drink speak very good bad today tomorrow yesterday really only still even well hello hi thanks thank please yes`.split(/\s+/));

export interface Token { raw: string; norm: string; neutral: boolean }

/** Word tokens of a text: deaccented lower case; capitalised non-initial words are neutral (names). */
export function wordTokens(text: string): Token[] {
  const out: Token[] = [];
  const re = /\p{L}+/gu;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    const raw = m[0];
    const initial = i === 0 || /[.!?¿¡]\s*$/.test(text.slice(0, m.index));
    const cap = raw.length > 1 && raw[0] !== raw[0].toLowerCase() && raw.slice(1) === raw.slice(1).toLowerCase();
    out.push({ raw, norm: deaccent(raw.toLowerCase()), neutral: cap && !initial });
    i++;
  }
  return out;
}

/** Fold the Spanish words of some texts into a lexicon (deaccented lower case). */
export function addToLexicon(into: Set<string>, text: string): Set<string> {
  for (const m of text.match(/[\p{L}]+/gu) ?? []) into.add(deaccent(m.toLowerCase()));
  return into;
}

/** A lexicon of every word the vocabulary, forms and the given texts hold. */
export function buildLexicon(nodes: Iterable<GraphNode>, texts: Iterable<string> = []): Set<string> {
  const lex = new Set<string>();
  for (const n of nodes) {
    if (n.es) addToLexicon(lex, n.es);
    for (const f of n.forms ?? []) addToLexicon(lex, f.es);
  }
  for (const t of texts) addToLexicon(lex, t);
  return lex;
}

export function isSpanishToken(t: Token, lexicon?: ReadonlySet<string>): boolean {
  if (/[ñáéíóúü]/i.test(t.raw)) return true;
  if (CLOSED_SET.has(t.norm)) return true;
  if (ENGLISH.has(t.norm)) return false;
  if (lexicon?.has(t.norm)) return true;
  if (t.norm.length < 2) return false;
  return analyzeToken(t.norm).length > 0;
}

/** Share of the (non-name) tokens that are Spanish; 0 for none. */
export function spanishShare(text: string, lexicon?: ReadonlySet<string>): number {
  const toks = wordTokens(text).filter((t) => !t.neutral);
  if (!toks.length) return 0;
  return toks.filter((t) => isSpanishToken(t, lexicon)).length / toks.length;
}

export interface PersonalResult {
  pass: boolean;
  spanishShare: number;
  /** the token that carried the day's form */
  usedForm?: string;
  hint?: string;
}

export interface PersonalOpts {
  node?: string;
  script?: Pick<TeachingScript, 'hook' | 'examples'>;
  nodes?: Iterable<GraphNode> | ReadonlyMap<string, GraphNode>;
  /** extra surface words (deaccented) that count as the form */
  requireForms?: string[];
  lexicon?: ReadonlySet<string>;
  /** skip the form requirement (share and length only) */
  noForm?: boolean;
}

interface Need { infs: Set<string>; words: string[]; lexeme?: string; samples: string[] }

const stripPunct = (s: string) => s.replace(/[¿?¡!.,;:"“”()]/g, '').replace(/\s+/g, ' ').trim();
const openers = /^(el|la|los|las|un|una)\s+/i;

function findNode(opts: PersonalOpts): GraphNode | undefined {
  if (!opts.node || !opts.nodes) return undefined;
  const ns = opts.nodes as any;
  if (typeof ns.get === 'function') return ns.get(opts.node);
  for (const n of ns as Iterable<GraphNode>) if (n.id === opts.node) return n;
  return undefined;
}

/** What "the day's form" means for a node. */
export function needFor(opts: PersonalOpts): Need {
  const need: Need = { infs: new Set(), words: [], samples: [] };
  for (const w of opts.requireForms ?? []) { need.words.push(deaccent(w.toLowerCase())); need.samples.push(w); }
  const node = findNode(opts);
  if (!node) return need;
  if (node.kind === 'lexeme') {
    for (const alt of (node.es ?? '').split(/[/;,]/)) {
      const base = lexBase(alt.replace(openers, ''));
      if (base) { need.words.push(base); need.samples.push(alt.replace(openers, '').trim()); }
      if (/^[a-zñáéíóú]+(ar|er|ir|ár|ér|ír)(se)?$/i.test(alt.trim())) need.infs.add(alt.trim().toLowerCase().replace(/se$/, ''));
    }
    need.lexeme = node.es;
    return need;
  }
  const sources = [node.es ?? '', ...(node.forms ?? []).map((f) => f.es)];
  const addVerbs = (text: string, sample: boolean) => {
    for (const t of wordTokens(text)) {
      const a = analyzeToken(t.norm).filter((x) => x.target !== false);
      for (const x of a) need.infs.add(x.inf.replace(/se$/, ''));
      if (sample && a.length && need.samples.length < 2 && !need.samples.includes(t.raw.toLowerCase())) need.samples.push(t.raw.toLowerCase());
    }
  };
  for (const s of sources) addVerbs(s, s === sources[0]);
  if (!need.infs.size && opts.script) {
    addVerbs(opts.script.hook.es, true);
    for (const e of opts.script.examples) addVerbs(e.es, false);
  }
  if (!need.infs.size && node.es) {
    const phrase = stripPunct(node.es);
    const content = wordTokens(phrase).map((t) => t.norm).filter((w) => w.length >= 3 && !CLOSED_SET.has(w));
    need.words.push(...content);
    if (phrase.split(' ').length <= 4) need.samples.push(phrase.toLowerCase());
  }
  return need;
}

function usedFormIn(text: string, need: Need): string | undefined {
  if (!need.infs.size && !need.words.length) return undefined;
  const ix = lexIndex(text);
  for (const w of need.words) if (ix.has(w) || wordTokens(text).some((t) => t.norm === w)) return w;
  for (const t of wordTokens(text)) {
    if (analyzeToken(t.norm).some((a) => need.infs.has(a.inf.replace(/se$/, '')))) return t.raw;
  }
  return undefined;
}

function sayHint(need: Need): string {
  const s = need.samples.slice(0, 2);
  if (s.length === 2) return `Use *${s[0]}* or *${s[1]}* somewhere in it.`;
  if (s.length === 1) return `Use *${s[0]}* somewhere in it.`;
  return "Use today's new form somewhere in it.";
}

/** Is this Spanish, with the day's form? */
export function checkPersonal(text: string, opts: PersonalOpts = {}): PersonalResult {
  const toks = wordTokens(text);
  if (toks.length < 2) return { pass: false, spanishShare: 0, hint: 'A full sentence: two or three words is plenty.' };
  const share = spanishShare(text, opts.lexicon);
  if (share < SPANISH_SHARE_MIN) return { pass: false, spanishShare: share, hint: share < 0.4 ? 'Mostly English so far. Try it in Spanish.' : 'Some of that is English. Try it all in Spanish.' };
  if (opts.noForm) return { pass: true, spanishShare: share };
  const need = needFor(opts);
  const used = usedFormIn(text, need);
  if (used === undefined && (need.infs.size || need.words.length)) return { pass: false, spanishShare: share, hint: sayHint(need) };
  return { pass: true, spanishShare: share, ...(used ? { usedForm: used } : {}) };
}
