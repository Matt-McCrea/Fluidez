/* ============================================================================
 * VOCAB / SOURCES — readers for the downloaded data and the old deck.
 *
 *   dictionary()  tools/vocab/data/doozan-es-en.data (Wiktionary, CC BY-SA,
 *                 via doozan/spanish_data): lemma -> entries with POS, gender,
 *                 glosses and their qualifiers ("Spain", "Latin America" …).
 *   doozanForms() tools/vocab/data/doozan-frequency.csv: surface form -> lemma
 *                 (+ POS), used only to resolve forms the engine and the
 *                 tagger's lexicon cannot.
 *   oldDeck()     ../data/vocab.js (the old Peninsular PCIC deck).
 * ========================================================================== */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DATA = join(HERE, 'data');
export const ROOT = resolve(HERE, '..', '..', '..');   // /Users/Matthew/Fluidez

export interface Sense { gloss: string; q: string; syn: string }
export interface DictEntry { lemma: string; pos: string; g?: string; usage?: string; senses: Sense[] }

let DICT: Map<string, DictEntry[]> | null = null;
export function dictionary(): Map<string, DictEntry[]> {
  if (DICT) return DICT;
  DICT = new Map();
  const text = readFileSync(join(DATA, 'doozan-es-en.data'), 'utf8');
  for (const block of text.split('\n_____\n')) {
    const lines = block.split('\n');
    const lemma = lines[0].replace(/^_____$/, '').trim();
    if (!lemma) continue;
    let cur: DictEntry | null = null;
    let sense: Sense | null = null;
    for (const l of lines.slice(1)) {
      let m: RegExpMatchArray | null;
      if ((m = l.match(/^pos: (.+)$/))) { cur = { lemma, pos: m[1].trim(), senses: [] }; (DICT.get(lemma) ?? DICT.set(lemma, []).get(lemma)!).push(cur); sense = null; }
      else if (!cur) continue;
      else if ((m = l.match(/^ {2}g: (.+)$/))) cur.g = m[1].trim();
      else if ((m = l.match(/^ {2}usage: (.+)$/))) cur.usage = m[1].trim();
      else if ((m = l.match(/^ {2}q: (.+)$/))) { /* entry-level qualifier */ cur.usage = (cur.usage ? cur.usage + ' ' : '') + '[' + m[1] + ']'; }
      else if ((m = l.match(/^ {2}gloss: (.+)$/))) { sense = { gloss: m[1].trim(), q: '', syn: '' }; cur.senses.push(sense); }
      else if ((m = l.match(/^ {4}q: (.+)$/)) && sense) sense.q = m[1].trim();
      else if ((m = l.match(/^ {4}syn: (.+)$/)) && sense) sense.syn = m[1].trim();
    }
  }
  return DICT;
}

export interface DoozanRow { lemma: string; pos: string; count: number; forms: Array<[string, number]> }
export function doozanRows(): DoozanRow[] {
  const lines = readFileSync(join(DATA, 'doozan-frequency.csv'), 'utf8').split('\n').slice(1).filter(Boolean);
  return lines.map((l) => {
    const [count, lemma, pos, , usage = ''] = l.split(',');
    return { lemma, pos, count: Number(count), forms: usage.split('|').filter(Boolean).map((u) => { const [c, f] = u.split(':'); return [f, Number(c)] as [string, number]; }) };
  });
}
/** surface form -> [lemma, pos] (the form's commonest reading) */
export function doozanForms(): Map<string, [string, string]> {
  const best = new Map<string, [string, string, number]>();
  for (const r of doozanRows()) {
    if (r.pos === 'none' || r.pos === 'letter' || r.pos === 'prefix') continue;
    for (const [f, c] of r.forms) { const b = best.get(f); if (!b || c > b[2]) best.set(f, [r.lemma, r.pos, c]); }
  }
  return new Map([...best.entries()].map(([f, [l, p]]) => [f, [l, p]]));
}

export interface DeckRow { es: string; lemma: string; article?: string; en: string; cat?: string; cefr?: string; theme?: string; gender?: string; pcic?: string[] }
export function oldDeck(): DeckRow[] {
  const g = globalThis as unknown as { window: Record<string, unknown> };
  const had = g.window;
  g.window = {};
  (0, eval)(readFileSync(join(ROOT, 'data', 'vocab.js'), 'utf8'));
  const rows = (g.window.VOCAB as Array<Record<string, unknown>>);
  g.window = had;
  return rows.map((r) => {
    const es = String(r.es).trim();
    const m = es.match(/^(el|la|los|las|un|una)\s+(.+)$/);
    return {
      es, lemma: (m ? m[2] : es).trim(), article: m?.[1], en: String(r.en ?? ''), cat: r.cat as string | undefined,
      cefr: r.cefr as string | undefined, theme: r.theme as string | undefined, gender: r.gender as string | undefined, pcic: r.pcic as string[] | undefined,
    };
  });
}

/** A short learner-facing gloss from a Wiktionary sense. */
export function cleanGloss(s: string): string {
  let g = s.replace(/\{\{[^}]*\}\}/g, '').replace(/\[[^\]]*\]?/g, '').replace(/\s*\([^)]{16,}\)?/g, '').replace(/\s+/g, ' ').trim();
  g = g.replace(/^(?:a|an) (?=[a-z])/i, '').replace(/[“”"]/g, '');
  const parts = g.split(/;\s*/)[0].split(/,\s*/).map((x) => x.trim()).filter(Boolean);
  // a second synonym only when it is a single word ("table, desk"; not "important, that cares")
  g = parts.length > 1 && !/\s/.test(parts[1]) && parts[1].length <= 14 ? parts.slice(0, 2).join(', ') : (parts[0] ?? '');
  return g.replace(/[.;:(]$/, '').replace(/\($/, '').trim();
}
