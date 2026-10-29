// Types for the feature tagger. See ./index.ts for the overview.
import type { Analysis } from '../types';

export type NodeId = string;

export type Pos =
  | 'verb'      // finite verb
  | 'inf' | 'ger' | 'part'
  | 'noun' | 'adj' | 'adv' | 'x'   // x: open-class word of unknown exact POS
  | 'det' | 'poss' | 'dem' | 'quant' | 'num'
  | 'pron' | 'clitic' | 'prep' | 'conj' | 'rel' | 'int' | 'neg' | 'interj'
  | 'propn' | 'punct' | 'unknown';

export interface Token {
  /** index in the token array (punctuation included) */
  i: number;
  /** original spelling */
  text: string;
  /** lowercase */
  w: string;
  punct: boolean;
  /** Capitalised and not the first word of its sentence. */
  capMid: boolean;
  /** Capitalised (anywhere). */
  cap: boolean;
  /** First word of a sentence (after any opening punctuation). */
  sentStart: boolean;
}

export interface Word extends Token {
  pos: Pos;
  lemma: string;
  /** Finite verb readings that survived disambiguation (accent-exact). */
  verb?: Analysis[];
  /** The tense the tagger settled on for a finite verb. */
  tense?: string;
  /** Enclitic pronouns attached to a command, infinitive or gerund. */
  enclitics?: string[];
  /** Haber auxiliary of a compound / participle of a compound. */
  aux?: 'haber';
  compoundOf?: number;
  /** For a known noun/adjective: lemma from the lexicon. */
  known: boolean;
  /** Homograph decision taken on weak evidence. */
  weak?: string;
}

export interface Feature {
  /** Dotted feature key, most specific first: "tense.presente.stem-ie". */
  key: string;
  /** The graph node this feature requires (null: informative only). */
  node: NodeId | null;
  /** Inclusive token span (indices into TagResult.tokens). */
  span: [number, number];
  /** Chunks: the span of the chunk's own words, before the slot it takes (span covers both). */
  core?: [number, number];
  text: string;
  lemma?: string;
  /** For subjunctives: the licensing trigger, e.g. "quiero que". */
  trigger?: string;
}

export interface TagResult {
  requires: NodeId[];
  features: Feature[];
  confidence: 'high' | 'low';
  lowReasons: string[];
  /** The analysed tokens, for debugging and for the gate's lints. */
  tokens: Word[];
}

/** A chunk node: its Spanish, and the grammar node it seeds (`unpacks`), which a sentence
 *  using the chunk still requires, so it is practised once that grammar is taught. */
export interface ChunkSpec { id: NodeId; es: string; unpacks?: NodeId; priority?: number }
/** A pattern node: matched by its `match` surface patterns, else by its id's words (lemma or form). */
export interface PatternSpec { id: NodeId; match?: readonly string[] }

export interface TagOptions {
  /** Chunk nodes whose Spanish, when found verbatim, is tagged as the chunk. */
  chunks?: readonly ChunkSpec[];
  /** Pattern nodes the tagger looks for (heuristic: see index.ts patternPass). */
  patterns?: readonly PatternSpec[];
  /** Graph node ids that exist: feature keys resolve to the most specific
   *  mapped id present in this set. */
  graphIds?: ReadonlySet<string>;
  /** Overrides of the FEATURE -> node table (from content/graph/_featuremap.json). */
  featureMap?: Readonly<Record<string, string | null>>;
  /** Include lexeme nodes (l:...) in requires. Default true. */
  lexemes?: boolean;
}
