// A sweep of the real bank for the transform generators: every row of units
// 1 to 60 is put through a generator and each sentence it makes is linted for
// the ways the generator was seen to teach broken Spanish (docs/swarm-audit,
// C2 and LC1-001 to LC1-003). The lint reads the sentences it is given, not
// the generator's own rules, and takes the generator as a parameter so the
// same sweep can be run against an older one.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BankSentence } from '../../src/content/schema';
import { analyzeToken, type TenseKey } from '../../src/engine';
import { isKnownForm, lexEntry } from '../../src/engine/tagger/lexicon';
import type { RecombineItem, TransformItem } from '../../src/exercises/types';
import { licensedTenses } from '../../src/ui/session/tenses';

const CONTENT = join(__dirname, '../../content');
const json = (p: string) => JSON.parse(readFileSync(join(CONTENT, p), 'utf8')) as any[];

export const rows: BankSentence[] = readdirSync(join(CONTENT, 'bank')).filter((f) => f.endsWith('.json'))
  .flatMap((f) => json(`bank/${f}`).map((x) => BankSentence.parse(x)));

/** The tenses taught by the end of each unit: the grammar its days focus on, plus the present. */
export const taughtBy = new Map<string, readonly TenseKey[]>();
{
  const met = new Set<string>();
  for (const f of readdirSync(join(CONTENT, 'units')).filter((x) => x.endsWith('.json')).sort()) {
    const u = json(`units/${f}`) as unknown as { id: string; days: Array<{ focus: string[] }> };
    for (const d of u.days) for (const n of d.focus) met.add(n);
    taughtBy.set(u.id, licensedTenses(met));
  }
}
export const taughtFor = (s: BankSentence): readonly TenseKey[] => taughtBy.get(s.unit ?? 'u01') ?? licensedTenses([]);

// ---------------------------------------------------------------- the lint

/** Names and places: written with a capital in the middle of a sentence far more often than without. */
const NAMES = new Set<string>();
{
  const cap = new Map<string, number>();
  const lower = new Map<string, number>();
  const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
  for (const r of rows) {
    for (const sentence of r.es.split(/[\n.?!]\s*/)) {
      const ws = sentence.replace(/^[¿¡"«“\s]+/, '').split(/\s+/).slice(1);
      for (const w of ws) {
        const core = w.replace(/^[¿¡"«“(]+|[.,;:!?"»”)]+$/g, '');
        if (core) bump(/^\p{Lu}/u.test(core) ? cap : lower, core.toLowerCase());
      }
    }
  }
  for (const [w, n] of cap) if (n >= 2 && n > 4 * (lower.get(w) ?? 0)) NAMES.add(w);
}

const words = (s: string) => s.replace(/[¿¡.,;:!?"«»“”()]/g, ' ').split(/\s+/).filter(Boolean);
/** The words that are not names: a name capitalised in the middle of a sentence, or one the bank only ever writes capitalised. */
const plainWords = (s: string) => words(s).filter((w, i) => !(/^\p{Lu}/u.test(w) && (i > 0 || NAMES.has(w.toLowerCase()))));
const readings = (w: string) => analyzeToken(w.toLowerCase()).filter((a) => a.accentExact);
const isNoun = (w: string) => !!lexEntry(w.toLowerCase()) || !!lexEntry(w.toLowerCase().replace(/s$/, '')) || /^(sed|pésame)$/i.test(w);
/** Every exact reading of this word is a command (and it is not a noun). */
const onlyCommand = (w: string) => { const r = readings(w); return r.length > 0 && r.every((a) => a.tense === 'imperativo' || a.tense === 'impneg') && !isNoun(w); };
const isVoseo = (w: string) => /^vos(otros|otras)?$/i.test(w) || (readings(w).length > 0 && readings(w).every((a) => a.target === false) && !isNoun(w));
const NEGATIVE_FORCE = /(^|[\s¿¡])(poco|poca|pocos|pocas|apenas|rara vez|raras veces|casi nunca|difícilmente)(?=[\s,.!?])/i;
const FREQUENCY = /\b(rara vez|raras veces|a menudo|de vez en cuando|con frecuencia|frecuentemente|casi siempre|casi nunca|cada vez)\b/i;
const SENTENCE_END = /(?<=[.?!…])\s+(?=[¿¡"“«\p{Lu}])/u;

export interface Made { source: string; answer: string; op: string; to?: string; glued?: boolean }

/** The ways a generated sentence was seen to be wrong, by name. */
export function lint(t: Made, taught: readonly TenseKey[]): string[] {
  const { source, answer } = t;
  const out: string[] = [];
  const aw = words(answer);
  const pw = plainWords(answer);
  if (t.op === 'tense' && !taught.includes(t.to as TenseKey)) out.push('untaught-tense');
  if (pw.some(isVoseo)) out.push('voseo');
  if (t.op !== 'negate' && pw.some(onlyCommand)) out.push('command-kept');
  // "Antes tomás era canadiense": a name that lost its capital
  if (aw.some((x) => NAMES.has(x.toLowerCase()) && !isKnownForm(x.toLowerCase()) && /^\p{Ll}/u.test(x))) out.push('name-lowercased');
  // "Tomá y Simón", "Herreras": a name taken for a word and inflected
  const given = new Set(words(source).map((x) => x.toLowerCase()));
  if (aw.some((x, i) => i > 0 && /^\p{Lu}/u.test(x) && !given.has(x.toLowerCase()) && !/^(Ayer|Antes|Mañana)$/.test(x))) out.push('name-mangled');
  if (SENTENCE_END.test(answer) || /\n/.test(answer)) out.push('more-than-one-sentence');
  if (/,\s*[.?!]|\s,|,\s*,/.test(answer.replace(/¿/g, ''))) out.push('stray-punctuation');
  if (t.op === 'tense') {
    // "Ayer Cada uní…", "Ayer Poco ganó…": the opening word keeps a capital it only had for starting the sentence
    const second = answer.replace(/^[¿¡]/, '').split(/\s+/)[1] ?? '';
    const core = second.replace(/[^\p{L}]/gu, '');
    if (t.glued && /^\p{Lu}/u.test(core) && isKnownForm(core.toLowerCase()) && !NAMES.has(core.toLowerCase())) out.push('stray-capital');
    // "Antes Perdón, era de Cali.": a greeting or fragment in front of the verb
    const head = answer.split(/[,;:]/)[0];
    if (t.glued && /[,;:]/.test(answer) && !words(head).slice(1).some((w) => readings(w).some((a) => a.tense !== 'imperativo' && a.tense !== 'impneg'))) out.push('fragment-before-verb');
    if (FREQUENCY.test(answer)) out.push('time-clash');
  }
  // "Yo se conozco", "¿Cómo se digo": se in front of a verb that is not third person
  const w = aw.map((x) => x.toLowerCase());
  w.forEach((x, i) => {
    if (x !== 'se' || !w[i + 1]) return;
    const r = readings(w[i + 1]).filter((a) => a.tense !== 'imperativo' && a.tense !== 'impneg');
    if (r.length && r.every((a) => a.person === 'yo' || a.person === 'tú' || a.person === 'nosotros')) out.push('se-first-person');
  });
  // the story's Vale is a name, not valer
  if (/(^|[\s,¿])Vale\b/.test(source) && (/\bno Vale\b/.test(answer) || aw.some((x) => /^Val(ió|drá|ía|drían?)$/.test(x)))) out.push('name-as-verb');
  if (t.op === 'negate' && NEGATIVE_FORCE.test(answer)) out.push('double-negative');
  // "Perdón, no ¿vives aquí?": a word put in front of the ¿
  if (/\b(no|lo|la|los|las|le|les|me|te|se|nos|yo|tú|él|ella|nosotros|ellos|ayer|antes|mañana)\s+[¿¡]/i.test(answer)) out.push('before-opening-mark');
  // "¿Cómo no se escribe…?": a question word with a no after it in the same question
  if (t.op === 'negate' && /¿[^?]*\b(qué|dónde|cuándo|cómo|quién|quiénes|cuál|cuáles|cuánto|cuánta|cuántos|cuántas)\b[^?]*\bno\b/i.test(answer)) out.push('negated-question-word');
  if (t.op === 'person') {
    const speaker = t.to === 'yo' || t.to === 'nosotros';
    // "¿Soy yo, Tomás?": a question asked of a named person about oneself
    if (speaker && /[?]/.test(answer) && /,\s*\p{Lu}\p{L}+[.?!]*$/u.test(answer)) out.push('vocative-person');
    // "Yo soy Ana y Pedro": names joined by y, said about one person
    if (/\b\p{Lu}\p{L}+ y \p{Lu}\p{L}+\b/u.test(answer)) out.push('names-person');
  }
  return out;
}

// ---------------------------------------------------------------- the sweep

export interface Generators {
  transforms(row: BankSentence, taught: readonly TenseKey[]): TransformItem[];
  recombine(row: BankSentence, taught: readonly TenseKey[]): RecombineItem[];
}
export interface Violation { cls: string; id: string; source: string; answer: string }
export interface Sweep { made: number; byOp: Record<string, number>; violations: Violation[]; byClass: Record<string, number> }

const opOf = (t: { op: string }) => t.op;

/** Put every row through the generators; count what they make and lint it. */
export function sweep(gen: Generators): Sweep {
  const violations: Violation[] = [];
  const byOp: Record<string, number> = {};
  let made = 0;
  const note = (m: Made, id: string, taught: readonly TenseKey[]) => {
    made++;
    byOp[opOf(m)] = (byOp[opOf(m)] ?? 0) + 1;
    for (const cls of lint(m, taught)) violations.push({ cls, id, source: m.source, answer: m.answer });
  };
  for (const row of rows) {
    const taught = taughtFor(row);
    let items: TransformItem[] = [];
    let recs: RecombineItem[] = [];
    try { items = gen.transforms(row, taught); } catch { /* an item the generator cannot build is not a violation */ }
    try { recs = gen.recombine(row, taught); } catch { /* same */ }
    for (const it of items) {
      const made: Made = { source: it.source, answer: it.answer, op: it.transform.op, to: 'to' in it.transform ? it.transform.to : undefined, glued: true };
      note(made, it.id, taught);
      // the other answers a card accepts are marked right as well
      for (const alt of it.accept) for (const cls of lint({ ...made, answer: alt }, taught)) violations.push({ cls: `accept:${cls}`, id: it.id, source: it.source, answer: alt });
    }
    for (const rc of recs) note({ source: row.es, answer: rc.es, op: rc.transform.op, to: 'to' in rc.transform ? rc.transform.to : undefined }, rc.id, taught);
  }
  const byClass: Record<string, number> = {};
  for (const v of violations) byClass[v.cls] = (byClass[v.cls] ?? 0) + 1;
  return { made, byOp, violations, byClass };
}
