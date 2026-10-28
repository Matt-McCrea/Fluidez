/* ============================================================================
 * LEXMATCH — which taught words does this text actually contain?
 *
 * One matcher for every consumer, because two matchers disagree: the session
 * picks the day's new words out of the passage the learner is about to read,
 * and the content tools check a passage carries its theme's vocabulary. If
 * those answer differently, the app teaches words the checker believes are
 * absent, and nobody finds out.
 *
 * Word boundaries are checked, and the only continuations allowed are a
 * plural -s or -es: `el libro` matches `los libros`, not `librito`, and `mar`
 * is not found inside `marzo`.
 *
 * Deliberately NOT lemmatised: `viajar` is not found in `viajé`. Vocabulary is
 * overwhelmingly nouns and phrases, so the loss is small and fails safe.
 * ========================================================================== */
const ACC: Record<string, string> = {
  'á': 'a', 'à': 'a', 'ä': 'a', 'é': 'e', 'è': 'e', 'ë': 'e',
  'í': 'i', 'ì': 'i', 'ï': 'i', 'ó': 'o', 'ò': 'o', 'ö': 'o',
  'ú': 'u', 'ù': 'u', 'ü': 'u',
};
const ARTICLE = /^(el|la|los|las|un|una|unos|unas)\s+/;

/** Fold every accent including ü (lexical matching only). ñ is a letter. */
export function lexDeaccent(s: string): string {
  return String(s).replace(/[áàäéèëíìïóòöúùü]/g, (c) => ACC[c] ?? c);
}

function clean(s: string | null | undefined): string {
  return lexDeaccent(String(s || '').toLowerCase()).replace(/[^a-z0-9ñ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function lexNorm(text: string): string { return ' ' + clean(text) + ' '; }

/** The form to look for: the entry without its article. */
export function lexBase(es: string): string { return clean(String(es || '').toLowerCase().replace(ARTICLE, '')); }

export interface LexIndex { has(es: string): boolean; text: string }

/** An index over one text, built once and queried per candidate word. */
export function lexIndex(text: string): LexIndex {
  const t = lexNorm(text);
  return {
    text: t,
    has(es: string): boolean {
      const b = lexBase(es);
      if (b.length < 3) return false;                 // "es", "un" match everywhere
      const needle = ' ' + b;
      let i = t.indexOf(needle);
      while (i !== -1) {
        const rest = t.slice(i + needle.length);
        if (rest.charAt(0) === ' ') return true;       // exact
        if (rest.slice(0, 2) === 's ') return true;    // libro / libros
        if (rest.slice(0, 3) === 'es ') return true;   // ciudad / ciudades
        i = t.indexOf(needle, i + 1);
      }
      return false;
    },
  };
}

/** How many of `words` (objects with .es, or plain strings) the text holds. */
export function countIn(text: string, words: ReadonlyArray<string | { es: string }>): number {
  const ix = lexIndex(text);
  let n = 0;
  for (const w of words) if (ix.has(typeof w === 'string' ? w : w.es)) n++;
  return n;
}
