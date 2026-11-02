// What the learner typed against the right version, word by word (L8). A miss says where it went wrong by showing
// the two side by side with the words that differ marked: a word that is extra in the answer, a word that is
// missing from it, a word that is another word, and a word that is the right one but for its accents (marked apart,
// since it is a smaller thing). The alignment is the one the hints use (translate/hints.ts `align`), so a hint and a
// diff never disagree about which word is the first difference. Case and punctuation are not differences.
import { deaccent } from '../../engine';
import { align } from '../../check/translate/hints';

export interface DiffPiece {
  text: string;
  /** `off`: this word is not the one that belongs here (or has no partner); `accent`: the right word, with the accents not as they should be. */
  mark?: 'off' | 'accent';
}

export interface WordDiff {
  /** What was typed, in order, with the words that differ marked. */
  typed: DiffPiece[];
  /** The right version, in order, with the words the answer did not have or had otherwise marked. */
  right: DiffPiece[];
  /** Nothing differs but case and punctuation. */
  same: boolean;
}

const key = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/** The words of a text as it was written, with a mark that stands alone (¿, a dash) kept on the word beside it. */
function words(text: string): Array<{ text: string; key: string }> {
  const out: Array<{ text: string; key: string }> = [];
  let carry = '';
  for (const raw of text.trim().split(/\s+/).filter(Boolean)) {
    const k = key(raw);
    if (!k) { if (out.length) out[out.length - 1].text += raw; else carry += raw; continue; }
    out.push({ text: carry + raw, key: k });
    carry = '';
  }
  return out;
}

/** The two texts, word by word. Pieces are whole words as written; join them with a space. */
export function wordDiff(typed: string, right: string): WordDiff {
  const a = words(typed), b = words(right);
  const ops = align(a.map((w) => w.key), b.map((w) => w.key));
  const out: WordDiff = { typed: [], right: [], same: true };
  for (const o of ops) {
    if (o.op === 'eq') {
      out.typed.push({ text: a[o.i].text });
      out.right.push({ text: b[o.j].text });
      continue;
    }
    out.same = false;
    if (o.op === 'sub') {
      const mark = deaccent(a[o.i].key) === deaccent(b[o.j].key) ? 'accent' : 'off';
      out.typed.push({ text: a[o.i].text, mark });
      out.right.push({ text: b[o.j].text, mark });
    } else if (o.op === 'ins') {
      out.typed.push({ text: a[o.i].text, mark: 'off' });
    } else {
      out.right.push({ text: b[o.j].text, mark: 'off' });
    }
  }
  return out;
}
