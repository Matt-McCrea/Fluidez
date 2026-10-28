// Shared types for the Spanish morphology engine.

/** Person order for every simple and compound tense. */
export type Person = 'yo' | 'tú' | 'él/ella' | 'nosotros' | 'vosotros' | 'ellos';
/** Imperatives have their own person set (no yo). */
export type ImpPerson = 'tú' | 'usted' | 'nosotros' | 'vosotros' | 'ustedes';
/** `vos` only ever appears in analyses (voseo is recognised, never produced). */
export type AnyPerson = Person | ImpPerson | 'vos';

export type VerbClass = 'ar' | 'er' | 'ir';

/** e>ie, o>ue, e>i, u>ue (jugar) — and the -iar/-uar accent classes í / ú. */
export type StemChange = 'ie' | 'ue' | 'i' | 'í' | 'ú';

/** Tenses whose forms can be stored by hand in `forms`. */
export type StoredTense = 'presente' | 'preterito' | 'imperfecto' | 'futuro' | 'condicional' | 'presubj';

export type TenseKey =
  | StoredTense
  | 'perfecto' | 'plusc' | 'futperf' | 'condperf'
  | 'impsubj' | 'impsubjse' | 'perfsubj' | 'pluscsubj' | 'pluscsubjse' | 'futsubj'
  | 'imperativo' | 'impneg';

export type CompoundTense = 'perfecto' | 'plusc' | 'futperf' | 'condperf' | 'perfsubj' | 'pluscsubj' | 'pluscsubjse';

export type TenseGroup = 'indicative' | 'compound' | 'subjunctive' | 'imperative';

export interface TenseInfo {
  key: TenseKey;
  label: string;
  group: TenseGroup;
  /** Learners read it but are never asked to produce it (future subjunctive). */
  recognitionOnly?: boolean;
  /** An alternative spelling of another tense (-se imperfect subjunctive). */
  variantOf?: TenseKey;
}

export interface Verb {
  inf: string;
  en: string;
  type: VerbClass;
  stem?: StemChange;
  /** Base verb this one is a prefixed compound of (mantener < tener). */
  like?: string;
  part?: string;
  /** Other accepted participles (freído beside frito, proveído beside provisto). */
  partAlt?: string[];
  ger?: string;
  tuCmd?: string;
  /** Irregular affirmative nosotros command (ir: vamos, not vayamos). */
  nosCmd?: string;
  forms?: Partial<Record<StoredTense, string[]>>;
  /** Not in the old app's list — added in the port. */
  added?: boolean;
}

export type Variety = 'vosotros' | 'voseo';

export interface Analysis {
  inf: string;
  tense: TenseKey;
  person: AnyPerson;
  form: string;
  type: VerbClass;
  /** Did the accents match the canonical form (comió vs comio)? */
  accentExact: boolean;
  clitics?: string[];
  /** Is this a form the course teaches learners to produce? False for vosotros,
   *  voseo and recognition-only tenses: recognised, but not the target variety. */
  target: boolean;
  variety?: Variety;
}

export interface TokenAnalysis { token: string; index: number; analyses: Analysis[] }

export interface HaberAnalysis { tense: TenseKey; person: Person }
export interface ParticipleAnalysis { inf: string; tense: TenseKey }

export interface Compound {
  haber: string;
  participle: string;
  /** Token indices of the auxiliary and the participle. */
  haberIndex: number;
  participleIndex: number;
  haberAnalyses: HaberAnalysis[];
  /** Every compound tense the participle forms (kept for parity with the old app). */
  parts: ParticipleAnalysis[];
  /** The compound tense(s) this haber form actually builds: he comido = perfecto. */
  tenses: CompoundTense[];
}

export interface SentenceAnalysis {
  text: string;
  tokens: string[];
  verbs: TokenAnalysis[];
  compounds: Compound[];
}
