// Accent slips in a typed sentence, and whether the accent is what makes the word.
// Most are spelling: cafe for café, comi for comí. Some are another word: hablo is
// not habló, si is not sí, esta is not está. The first stay right with a note
// saying which word (R15); the second do not.
import { analyzeToken, deaccent } from '../engine';

/** A word as typed against the word it stands for, which differ only in a written accent. */
export interface AccentSlip { typed: string; expected: string }

/** Words a written accent turns into another word, with a meaning of its own. The accent is the whole difference there.
 *  The second block is the same thing where the engine has no verb to read it by: hacia is a preposition, seria an
 *  adjective, jugo a drink, tarde a time of day. A row that brings a new pair fails tests/translate/accent-sweep.test.ts.
 *  The question words (que, qué; donde, dónde) are not here: the tilde marks the question, and the sentence means what it meant. */
const DIACRITIC: ReadonlyArray<readonly [string, string]> = [
  ['tu', 'tú'], ['el', 'él'], ['mi', 'mí'], ['si', 'sí'], ['se', 'sé'], ['te', 'té'], ['de', 'dé'], ['mas', 'más'], ['aun', 'aún'],
  ['esta', 'está'], ['estas', 'estás'], ['este', 'esté'], ['papa', 'papá'], ['mama', 'mamá'],

  ['hacia', 'hacía'], ['seria', 'sería'], ['serias', 'serías'], ['sabia', 'sabía'], ['sabias', 'sabías'], ['ira', 'irá'], ['amplia', 'amplía'],
  ['jugo', 'jugó'], ['costo', 'costó'], ['cerro', 'cerró'], ['tarde', 'tardé'], ['daño', 'dañó'], ['clavo', 'clavó'], ['choque', 'choqué'],
  ['enojo', 'enojó'], ['insulto', 'insultó'], ['callo', 'calló'], ['empeño', 'empeñó'], ['conformo', 'conformó'], ['aparte', 'aparté'],
  ['papas', 'papás'], ['tomate', 'tómate'], ['carne', 'carné'], ['parques', 'parqués'], ['perdida', 'pérdida'], ['perdidas', 'pérdidas'],
];
const PAIRED = new Set(DIACRITIC.flat());
/** The engine reads the bare spelling as a verb, and nobody typing it means that verb: ¿Como estas?, Tomas abre el café, hace frio. */
const NOT_THE_VERB = new Set(['cómo', 'tomás', 'frío', 'río']);

const WORD = /\p{L}+/gu;

/**
 * The words of `typed` that are the words of `expected` but for an accent. Words
 * spelled the same in both are set aside first, so a pronoun left out or an
 * adverb moved does not hide a slip or invent one.
 */
export function accentSlips(typed: string, expected: string): AccentSlip[] {
  const open = expected.match(WORD) ?? [];   // as the sentence writes them: a note names Medellín, not medellín
  const left: string[] = [];
  for (const w of typed.toLowerCase().match(WORD) ?? []) {
    const i = open.findIndex((e) => e.toLowerCase() === w);
    if (i >= 0) open.splice(i, 1); else left.push(w);
  }
  const out: AccentSlip[] = [];
  for (const t of left) {
    const i = open.findIndex((e) => deaccent(e.toLowerCase()) === deaccent(t));
    if (i >= 0) out.push({ typed: t, expected: open.splice(i, 1)[0] });
  }
  return out;
}

/** The words of a text with no accents, for telling that two texts are one word for word. */
const bare = (s: string) => deaccent((s.toLowerCase().match(WORD) ?? []).join(' '));

/** The text with its slips put right, for the matcher to read again. Word for word it is the sentence itself, whichever of que and qué went where. */
export function mendSlips(typed: string, expected: string, slips: readonly AccentSlip[]): string {
  if (bare(typed) === bare(expected)) return expected;
  const left = [...slips];
  return typed.toLowerCase().replace(WORD, (w) => {
    const i = left.findIndex((s) => s.typed === w);
    return i < 0 ? w : left.splice(i, 1)[0].expected;
  });
}

/** Whether the word as typed is itself a word: a verb form spelled exactly, or one of the pairs the accent tells apart. */
export function changesWord({ typed, expected }: AccentSlip): boolean {
  if (PAIRED.has(typed)) return true;
  return !NOT_THE_VERB.has(expected.toLowerCase()) && analyzeToken(typed).some((a) => a.accentExact && !a.clitics);
}

/** The note for slips that are only spelling, or undefined when there are none or one of them is another word. */
export function forgiven(slips: readonly AccentSlip[]): string | undefined {
  return slips.length && !slips.some(changesWord) ? accentNote(slips) : undefined;
}

/** The same for a typed gap: the note, when `typed` is one of `answers` but for its accents and that is only spelling. */
export function gapSlipNote(typed: string, answers: readonly string[]): string | undefined {
  for (const a of answers) {
    const note = bare(a) === bare(typed) ? forgiven(accentSlips(typed, a)) : undefined;
    if (note) return note;
  }
  return undefined;
}

/** Which words to watch, for the pass screen. `*word*` is how content marks Spanish. */
export function accentNote(slips: readonly AccentSlip[]): string {
  const one = slips[0];
  if (slips.length === 1) return `Watch the accent on *${one.expected}*: you wrote *${one.typed}*.`;
  const names = slips.map((s) => `*${s.expected}*`);
  return `Watch the accents on ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}.`;
}
