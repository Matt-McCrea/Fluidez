/** Capitalised and not at the start of a sentence: a name or a place. */
export function isName(word: string, sentence: string): boolean {
  if (!/^\p{Lu}/u.test(word)) return false;
  const at = sentence.indexOf(word);
  const before = sentence.slice(0, Math.max(0, at)).trim();
  return before !== '' && !/[.?!¿¡]$/.test(before);
}
