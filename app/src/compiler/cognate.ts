// A rough cognate: the Spanish word reads as one of the words of its English gloss (idea, hotel, información).
// Between 20 and 38% of lexemes are (reports/03-acquisition.md, P14), and an English speaker needs fewer
// rungs for them. The same test tools/vocab/build.ts uses to leave cognates out of the card stream.

const deaccent = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

function stem(s: string): string {
  return deaccent(s.toLowerCase()).replace(/ción$/, 'tion').replace(/cion$/, 'tion').replace(/dad$/, 'ty').replace(/sión$/, 'sion').replace(/sion$/, 'sion')
    .replace(/mente$/, 'ly').replace(/oso$/, 'ous').replace(/ico$/, 'ic').replace(/ista$/, 'ist').replace(/ia$/, 'y').replace(/ar$|er$|ir$/, '').replace(/[aeo]$/, '')
    .replace(/ph/g, 'f').replace(/th/g, 't').replace(/y/g, 'i').replace(/k/g, 'c');
}

function lev(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** `es` may carry its article ("la idea"); `en` is the node's English gloss. */
export function isCognate(es: string, en: string): boolean {
  const word = es.trim().replace(/^(el|la|los|las|un|una)\s+/i, '');
  const s = stem(word);
  if (word.length < 4 || s.length < 3 || /\s/.test(word)) return false;
  return en.toLowerCase().replace(/^to /, '').split(/[^a-z]+/).filter((w) => w.length >= 4).some((w) => {
    const e = stem(w.replace(/e$/, ''));
    const k = Math.min(s.length, e.length);
    return lev(s.slice(0, k + 1), e.slice(0, k + 1)) <= Math.max(1, Math.floor(k / 5)) && Math.abs(s.length - e.length) <= 3;
  });
}
