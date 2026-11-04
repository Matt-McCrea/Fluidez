// Spanish orthography: accents, syllable nuclei, stress, enclitics.
//
// The old engine placed accents with two local heuristics (accentLastVowel and
// addStressAccent). Both work for the common case and both broke on a word
// that already carried an accent: mantén + te came out "mánténte", enfría + te
// "énfríate", dé + se "dése". Here stress is computed once, from the written
// word, and the accent is then placed by the general rule, so the edge cases
// fall out of the same code as the ordinary ones.

const ACUTE: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
const PLAIN: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

/** Strip acute accents only. ñ and ü are letters here, not accents: año is not ano. */
export function deaccent(s: string): string {
  return s.replace(/[áéíóú]/g, (c) => PLAIN[c]);
}

const VOWELS = 'aeiouáéíóúü';
export function isVowel(c: string | undefined): boolean {
  return !!c && VOWELS.includes(c);
}
const isStrong = (c: string) => 'aeoáéó'.includes(c);
const isAccented = (c: string) => 'áéíóú'.includes(c);

/** Accent the last plain vowel (old engine's accentLastVowel; kept for the
 *  -ir vosotros imperative + os and the 1pl imperfect subjunctive). */
export function accentLastVowel(s: string): string {
  for (let i = s.length - 1; i >= 0; i--) {
    const a = ACUTE[s[i]];
    if (a) return s.slice(0, i) + a + s.slice(i + 1);
  }
  return s;
}

/** Index ranges [start, end) of each syllable nucleus. A run of vowels is one
 *  nucleus unless two strong vowels meet (le-er, ca-e) or an accented weak
 *  vowel sits beside a strong one (rí-o, a-ví-a), which is a hiatus. The u of
 *  gue/gui/que/qui is spelling, not a vowel. */
export function nuclei(word: string): Array<[number, number]> {
  const w = word.toLowerCase();
  const out: Array<[number, number]> = [];
  let i = 0;
  const vowelAt = (k: number) => {
    const c = w[k];
    if (!isVowel(c)) return false;
    if (c === 'u' && k > 0 && (w[k - 1] === 'g' || w[k - 1] === 'q') && 'eiéí'.includes(w[k + 1] ?? '')) return false;
    return true;
  };
  while (i < w.length) {
    if (!vowelAt(i)) { i++; continue; }
    let start = i;
    i++;
    while (i < w.length && vowelAt(i)) {
      const prev = w[i - 1], cur = w[i];
      const hiatus = (isStrong(prev) && isStrong(cur)) ||
        ((cur === 'í' || cur === 'ú') && isStrong(prev)) ||
        ((prev === 'í' || prev === 'ú') && isStrong(cur));
      if (hiatus) { out.push([start, i]); start = i; }
      i++;
    }
    out.push([start, i]);
  }
  return out;
}

/** Index (into nuclei()) of the stressed nucleus. */
export function stressedNucleus(word: string): number {
  const ns = nuclei(word);
  if (ns.length <= 1) return 0;
  for (let k = 0; k < ns.length; k++) {
    const [a, b] = ns[k];
    for (let j = a; j < b; j++) if (isAccented(word[j])) return k;
  }
  return /[aeiouns]$/.test(deaccent(word.toLowerCase())) ? ns.length - 2 : ns.length - 1;
}

/** Put the written accent on nucleus k: on its strong vowel, else its last vowel. */
function accentNucleusAt(word: string, k: number): string {
  const ns = nuclei(word);
  if (!ns[k]) return word;
  const [a, b] = ns[k];
  for (let j = a; j < b; j++) if (isAccented(word[j])) return word;
  let pos = -1;
  for (let j = a; j < b; j++) if (isStrong(word[j])) { pos = j; break; }
  if (pos < 0) pos = b - 1;
  const acc = ACUTE[word[pos]];
  return acc ? word.slice(0, pos) + acc + word.slice(pos + 1) : word;
}

/** Accent the (single) nucleus of a monosyllable: ten > tén, veis > véis, vio > vió. */
export function accentMonosyllable(word: string): string {
  return accentNucleusAt(word, nuclei(word).length - 1);
}

/** Is the accent at position i a hiatus marker (an accented weak vowel next to
 *  a strong one)? Those survive any re-stressing: avería + te > averíate. */
function isHiatusAccent(word: string, i: number): boolean {
  const c = word[i];
  if (c !== 'í' && c !== 'ú') return false;
  const prev = word[i - 1] === 'h' ? word[i - 2] : word[i - 1];
  const next = word[i + 1] === 'h' ? word[i + 2] : word[i + 1];
  return (!!prev && isStrong(prev)) || (!!next && isStrong(next));
}

function removeAccents(word: string, keepHiatus: boolean): string {
  let out = '';
  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    out += isAccented(c) && !(keepHiatus && isHiatusAccent(word, i)) ? PLAIN[c] : c;
  }
  return out;
}

/** Attach an enclitic (te, se, nos, me, lo…) to a verb form and fix the written
 *  accent: levanta + te > levántate, mantén + te > mantente, dé + se > dese,
 *  levantemo + nos > levantémonos, enfría + te > enfríate. */
export function attachEnclitic(word: string, enclitic: string): string {
  const n = nuclei(word).length;
  const s = stressedNucleus(word);
  const fromEnd = (n - 1 - s) + nuclei(enclitic).length;
  let w = word;
  if (fromEnd >= 2) {
    w = accentNucleusAt(w, s);
  } else {
    w = removeAccents(w, true);
  }
  return w + enclitic;
}

/** RAE 2010: orthographic monosyllables take no accent — rio, guio, fie, hui,
 *  riais, guieis. Returns the word unchanged unless it applies. dé and sé keep
 *  their diacritic accent. */
export function monosyllable2010(word: string): string {
  if (word === 'dé' || word === 'sé') return word;
  if (!/[áéíóú]/.test(word)) return word;
  if (nuclei(deaccent(word)).length !== 1) return word;
  for (let i = 0; i < word.length; i++) {
    if (isAccented(word[i]) && isHiatusAccent(word, i)) return word;
  }
  return deaccent(word);
}
