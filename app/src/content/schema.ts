// The content contract. Every file under content/ parses against one of these,
// and every agent that writes content writes to these shapes. Change it here
// first, then migrate content; never let a generator invent fields.
import { z } from 'zod';

export const Band = z.enum(['A1', 'A2', 'B1', 'B2', 'C1']);
export type Band = z.infer<typeof Band>;

// Node ids are prefixed by kind: g: grammar, p: pattern, c: chunk, l: lexeme,
// x: contrast, d: can-do. Lexeme ids are `l:<lemma>` or `l:<lemma>#<sense>`.
export const NodeId = z.string().regex(/^[gpclxd]:.+$/);
export type NodeId = z.infer<typeof NodeId>;

export const NodeKind = z.enum(['grammar', 'pattern', 'chunk', 'lexeme', 'contrast', 'cando']);

export const GraphNode = z.object({
  id: NodeId,
  kind: NodeKind,
  band: Band,
  // Position in the teaching order (sessions from the start at the standard tier).
  // Chunks and lexemes carry the session they are first introduced.
  priority: z.number().int().nonnegative(),
  title: z.string(),                    // plain-English, learner-facing, no jargon
  es: z.string().optional(),            // the chunk / pattern / lemma in Spanish
  en: z.string().optional(),
  requires: z.array(NodeId).default([]),
  contrasts: z.array(NodeId).default([]),
  unpacks: NodeId.optional(),           // chunk -> grammar node it seeds
  serves: z.array(NodeId).default([]),  // pattern/grammar -> can-do
  pcic: z.array(z.string()).default([]),
  placement: z.enum(['pcic', 'teaching_choice']).default('pcic'),
  note: z.string().optional(),          // for authors, never shown to learners
  sources: z.array(z.string()).default([]), // old lesson ids mined for this node
  // lexeme-only
  pos: z.string().optional(),
  gender: z.enum(['m', 'f', 'mf']).optional(),
  freqRank: z.number().int().positive().optional(),
  peninsular: z.string().optional(),    // Peninsular variant, accepted not taught
});
export type GraphNode = z.infer<typeof GraphNode>;

export const LessonType = z.enum([
  'introduce', 'drill', 'input', 'patterns', 'output', 'review', 'checkpoint',
]);
export type LessonType = z.infer<typeof LessonType>;

export const UnitDay = z.object({
  type: LessonType,
  focus: z.array(NodeId).default([]),   // grammar/pattern nodes this day teaches or drills
  chunks: z.array(NodeId).default([]),  // chunks introduced (3-5 budget, outside the grammar cap)
  lexemes: z.array(NodeId).default([]), // new words introduced this day
  chapter: z.string().optional(),       // story chapter id read this day
  scene: z.string().optional(),         // scene id played this day
});

export const Unit = z.object({
  id: z.string().regex(/^u\d{2}$/),     // u01..u60, in order
  band: Band,
  title: z.string(),                    // learner-facing: "Ask, count, want"
  theme: z.string(),                    // PCIC Nociones específicas area
  canDo: z.string(),                    // "I can ..."
  days: z.array(UnitDay).min(7).max(10),
  storyArc: z.string(),                 // one paragraph: what happens to the cast this week
  quota: z.object({                     // minimum supply the burn must produce for this unit
    bankSentences: z.number().int(),
    chapters: z.number().int(),
    scenes: z.number().int(),
    writingTasks: z.number().int(),
  }),
});
export type Unit = z.infer<typeof Unit>;

export const BankSentence = z.object({
  id: z.string(),                       // stable: `<unit>-<n>` or `<source>-<n>`
  es: z.string(),
  en: z.string(),
  accept: z.array(z.string()).default([]),   // other correct Spanish for the en prompt
  acceptEn: z.array(z.string()).default([]), // other correct English for the es prompt
  requires: z.array(NodeId).default([]),     // computed by the tagger, never hand-written
  targets: z.array(NodeId).default([]),      // nodes this sentence was written to practise
  unit: z.string().optional(),
  theme: z.string().optional(),
  source: z.string().optional(),             // old id it was mined from, or 'gen'
});
export type BankSentence = z.infer<typeof BankSentence>;

export const TeachingScript = z.object({
  node: NodeId,
  hook: z.object({ line: z.string(), es: z.string(), en: z.string() }), // human reason + real line
  examples: z.array(z.object({ es: z.string(), en: z.string() })).min(3),
  rule: z.string(),                     // ≤90 s reading (~150 words), plain English at A1-A2
  smallPrint: z.string().optional(),    // the technical term, once
  soundTip: z.string().optional(),
  readAndPick: z.array(z.object({ es: z.string(), options: z.array(z.string()).min(2), answer: z.number().int() })).min(6),
  yourTurn: z.array(z.object({ prompt: z.string(), answer: z.string(), accept: z.array(z.string()).default([]), why: z.string() })).min(5),
  pitfalls: z.array(z.object({ wrong: z.string(), right: z.string(), why: z.string() })).default([]),
  personal: z.string(),                 // the closing "say something true about you" prompt
});
export type TeachingScript = z.infer<typeof TeachingScript>;

export const StoryChapter = z.object({
  id: z.string().regex(/^ch\d{3}$/),    // linear: ch001, ch002 ...
  unit: z.string(),
  title: z.string(),
  text: z.string(),
  gloss: z.array(z.object({ es: z.string(), en: z.string() })).default([]),
  questions: z.array(z.object({
    q: z.string(), options: z.array(z.string()).min(2).optional(), answer: z.union([z.number().int(), z.string()]),
  })).min(3),
  hook: z.string(),                     // the line that sets up tomorrow
});
export type StoryChapter = z.infer<typeof StoryChapter>;

export const SceneTurn = z.object({
  id: z.string(),
  npc: z.string(),                      // what the character says (Spanish)
  npcEn: z.string(),
  intent: z.string(),                   // what the learner must do, in plain English
  accept: z.array(z.string()).min(1),   // model answers; the matcher accepts their variants
  require: z.array(z.record(z.string(), z.unknown())).default([]), // checker constraints
  focus: NodeId.optional(),             // the one feature feedback is given on
  next: z.string().nullable(),          // next turn id, null ends the scene
});

export const Scene = z.object({
  id: z.string(),
  unit: z.string(),
  title: z.string(),
  brief: z.string(),
  turns: z.array(SceneTurn).min(3),
});
export type Scene = z.infer<typeof Scene>;

export const WritingTask = z.object({
  id: z.string(),
  unit: z.string(),
  prompt: z.string(),
  minWords: z.number().int(),
  maxWords: z.number().int(),
  constraints: z.array(z.record(z.string(), z.unknown())).default([]),
  model: z.string(),
  focus: NodeId.optional(),
});
export type WritingTask = z.infer<typeof WritingTask>;
