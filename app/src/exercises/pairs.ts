/* ============================================================================
 * ALIGNED PAIRS: the Spanish/English pairs a card may ask about.
 *
 * Graph nodes keep several variants in one string, with turn markers:
 *   es "¿A cómo está el aguacate? / ¿A cómo la libra? — A cuatro mil."
 *   en "How much are the avocados today? / How much a pound? — Four thousand."
 * A card must never pair an English fragment with a Spanish one it does not
 * translate. So both sides are split the same way (turns on a dash, variants
 * on " / ", then sentences) and paired by index ONLY where the counts match;
 * inside a turn whose variants do not match, only the first pair is kept; when
 * the turns themselves do not match, the node has no pair to ask about. A lexeme is one pair:
 * its gloss and the word with its article, never a sentence.
 * ========================================================================== */

export interface AlignedPair {
  /** the Spanish the card expects (and shows as the answer) */
  es: string;
  /** its exact English */
  en: string;
  /** other Spanish that answers the same English (variants of the same turn) */
  accept: string[];
}

export interface PairSource {
  kind: string;
  es?: string;
  en?: string;
  title?: string;
}

const DASH = /[—–]/;
/** A turn marker: a dash with space before it, or a leading dash. */
const TURN = /\s+[—–]\s*|^\s*[—–]\s*/;
const ALT = /\s+\/\s+/;
/** A sentence boundary: end punctuation, space, then something that starts a sentence. */
const SENTENCE = /(?<=[.?!…])\s+(?=[¿¡"“«A-ZÁÉÍÓÚÑ])/u;

/** Split on turn markers (leading dialogue dash dropped). */
export function turnsOf(s: string): string[] {
  return s.split(TURN).map((x) => x.trim()).filter(Boolean);
}

/** "pero: Es un cocinero excelente." -> "Es un cocinero excelente." (a short label before a colon). */
function stripLabel(s: string): string {
  const m = s.match(/^([^.?!¿¡:]{1,140}):\s+(?=\S)/u);
  return m ? s.slice(m[0].length) : s;
}

const startsSentence = (s: string) => /^[¿¡"“«\p{Lu}\d]/u.test(s);

function zip(es: string[], en: string[]): AlignedPair[] {
  return es.map((e, i) => ({ es: e, en: en[i], accept: [] }));
}

/** Pair one es fragment with one en fragment, splitting into sentences when both have the same count. */
function bySentence(es: string, en: string): AlignedPair[] {
  const a = stripLabel(es).split(SENTENCE).map((x) => x.trim()).filter(Boolean);
  const b = stripLabel(en).split(SENTENCE).map((x) => x.trim()).filter(Boolean);
  if (a.length === b.length) return zip(a, b);
  if (!a.length || !b.length) return [];
  // Different sentence counts: either the whole strings translate each other
  // ("Me llamo Tomás. ¿Cómo te llamas?" / "My name's Tomás, what's yours?") or
  // only the first sentences do (three Spanish examples, one English). The
  // pair whose lengths agree better wins.
  const whole = { es: a.join(' '), en: b.join(' '), accept: [] };
  const first = { es: a[0], en: b[0], accept: [] };
  const off = (p: AlignedPair) => Math.abs(Math.log(p.es.length / p.en.length));
  return [off(first) < off(whole) ? first : whole];
}

const oneSentence = (s: string) => s.split(SENTENCE).length === 1;

/** Aligned pairs of a phrase-like node (chunk, pattern, contrast, grammar). */
export function phrasePairs(esRawIn: string, enRawIn: string): AlignedPair[] {
  // "Not at all! / \u2014Nothing of the sort!": a variant of the same turn, not a new turn
  const esRaw = esRawIn.replace(/\/\s*[\u2014\u2013]\s*/g, '/ ');
  const enRaw = enRawIn.replace(/\/\s*[\u2014\u2013]\s*/g, '/ ');
  const esT = turnsOf(esRaw).map((t) => t.split(ALT).map((x) => x.trim()).filter(Boolean));
  const enT = turnsOf(enRaw).map((t) => t.split(ALT).map((x) => x.trim()).filter(Boolean));
  if (!esT.length || !enT.length) return [];
  const out: AlignedPair[] = [];
  const turn = (es: string[], en: string[]) => {
    if (es.length === en.length) {
      es.forEach((e, i) => out.push(...bySentence(e, en[i])));
      return;
    }
    // counts differ inside the turn: the first pair only; other Spanish variants of a
    // one-sentence turn answer the same one-sentence English ("¿Cómo estás? / ¿Cómo está?")
    const first = bySentence(es[0], en[0]);
    if (first.length === 1 && en.length === 1 && oneSentence(es[0]) && oneSentence(en[0])) {
      first[0].accept = es.slice(1).filter((x) => oneSentence(x) && startsSentence(x) === startsSentence(es[0]));
    }
    out.push(...first);
  };
  // A different number of turns ("\u2014¿Ya lo sabe? \u2014Así es." against "That's right."):
  // nothing says which turn the English translates, so nothing is asked.
  if (esT.length !== enT.length) return [];
  esT.forEach((t, i) => turn(t, enT[i]));
  // an elliptical English fragment ("the trip?") cannot stand alone as a cue
  const usable = out.filter((p, i) => i === 0 || (startsSentence(p.en) && startsSentence(p.es)));
  return usable.filter((p) => p.es && p.en && !DASH.test(p.es) && !DASH.test(p.en));
}

/** The gloss as a cue: "to call / to name" -> "to call, to name". */
export function glossCue(en: string): string {
  return en.split(ALT).map((x) => x.trim()).filter(Boolean).join(', ');
}

/** A lexeme's gloss as a cue, without a note that gives the word away ("which (el cual)" -> "which"). */
export function lexemeCue(en: string, es: string): string {
  const word = es.replace(/^(el|la|los|las|un|una)\s+/i, '').toLowerCase();
  const esc = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const has = (x: string) => new RegExp(`(^|[^\\p{L}])${esc}($|[^\\p{L}])`, 'u').test(x.toLowerCase());
  // drop a parenthetical, or a "; sense", that spells out the Spanish
  const cue = en
    .replace(/\s*\(([^)]*)\)/g, (m, inner: string) => (has(inner) ? '' : m))
    .split(/\s*;\s*/).filter((part) => part && !has(part)).join('; ')
    .trim();
  return glossCue(cue || en);
}

/** Aligned pairs for any graph node. Lexemes: [gloss, word with its article]. */
export function alignedPairs(n: PairSource): AlignedPair[] {
  if (!n.es) return [];
  const en = n.en ?? n.title ?? '';
  if (!en) return [];
  if (n.kind === 'lexeme') {
    const alts = n.es.split(/\s*[/;]\s*/).map((x) => x.trim()).filter(Boolean);
    if (!alts.length) return [];
    return [{ es: alts[0], en: lexemeCue(en, alts[0]), accept: alts.slice(1) }];
  }
  const pairs = phrasePairs(n.es, en);
  if (n.kind === 'chunk') return pairs;
  // patterns, contrasts, grammar: their strings mix a description with examples;
  // only clean sentence pairs are fit to ask about
  return pairs.filter((p) => fullSentence(p.es) && fullSentence(p.en) && !/[:=+·]|\bvs\b/.test(p.es + p.en));
}

const fullSentence = (s: string) => startsSentence(s) && /[.?!…]["”»]?$/.test(s);
