// English re-inflections of a simple sentence ("I ate yesterday" -> "I eat",
// "we ate"): the distractors of a "pick the meaning" card that differ from the
// right answer in exactly ONE feature (who, or when). Closed and conservative:
// anything the rules do not fully understand returns null, and the caller
// falls back to other sentences. A variant is dropped whenever the Spanish
// verb could also be read as saying it (comia is "I" and "he").
import type { AnyPerson, TenseKey } from '../../engine';
import { parseClause, verbReadings } from '../../exercises/spanish';
import { rng, shuffle } from '../../exercises';

type Subj = 'I' | 'you' | 'he' | 'she' | 'we' | 'they';
type When = 'pres' | 'past' | 'fut';
const SUBJECTS: Subj[] = ['I', 'you', 'he', 'she', 'we', 'they'];
const PERSONS: Record<Subj, AnyPerson[]> = {
  I: ['yo'], you: ['tú', 'vosotros', 'él/ella', 'ellos'], he: ['él/ella'], she: ['él/ella'], we: ['nosotros'], they: ['ellos'],
};
const TENSES: Record<When, TenseKey[]> = { pres: ['presente'], past: ['preterito', 'imperfecto'], fut: ['futuro'] };

// base, third person singular, past
const VERBS: ReadonlyArray<readonly [string, string, string]> = [
  ['eat', 'eats', 'ate'], ['drink', 'drinks', 'drank'], ['go', 'goes', 'went'], ['see', 'sees', 'saw'], ['buy', 'buys', 'bought'],
  ['take', 'takes', 'took'], ['give', 'gives', 'gave'], ['come', 'comes', 'came'], ['write', 'writes', 'wrote'], ['speak', 'speaks', 'spoke'],
  ['sleep', 'sleeps', 'slept'], ['run', 'runs', 'ran'], ['know', 'knows', 'knew'], ['make', 'makes', 'made'], ['say', 'says', 'said'],
  ['get', 'gets', 'got'], ['find', 'finds', 'found'], ['bring', 'brings', 'brought'], ['leave', 'leaves', 'left'], ['sell', 'sells', 'sold'],
  ['work', 'works', 'worked'], ['live', 'lives', 'lived'], ['study', 'studies', 'studied'], ['want', 'wants', 'wanted'], ['need', 'needs', 'needed'],
  ['like', 'likes', 'liked'], ['love', 'loves', 'loved'], ['cook', 'cooks', 'cooked'], ['walk', 'walks', 'walked'], ['wait', 'waits', 'waited'],
  ['call', 'calls', 'called'], ['help', 'helps', 'helped'], ['play', 'plays', 'played'], ['watch', 'watches', 'watched'], ['visit', 'visits', 'visited'],
  ['open', 'opens', 'opened'], ['close', 'closes', 'closed'], ['clean', 'cleans', 'cleaned'], ['dance', 'dances', 'danced'], ['sing', 'sings', 'sang'],
  ['read', 'reads', 'read'], ['arrive', 'arrives', 'arrived'], ['start', 'starts', 'started'], ['travel', 'travels', 'traveled'],
  ['look', 'looks', 'looked'], ['talk', 'talks', 'talked'], ['learn', 'learns', 'learned'], ['pay', 'pays', 'paid'], ['wash', 'washes', 'washed'],
];
// verbs whose present and past look the same cannot tell the two apart
const AMBIGUOUS = new Set(['read']);
const TIME = /\b(yesterday|tomorrow|today|now|always|never|last|next|every|ago|used|usually|often|sometimes|later|soon|already|still|tonight|this)\b/i;
const OWNED = /\b(my|me|myself|your|yours|yourself|our|us|his|her|hers|their|them|himself|herself|each|together)\b/i;

function conj(verb: string, subj: Subj, when: When): string | null {
  if (verb === 'be') {
    if (when === 'fut') return 'will be';
    if (when === 'past') return subj === 'I' || subj === 'he' || subj === 'she' ? 'was' : 'were';
    return subj === 'I' ? 'am' : subj === 'he' || subj === 'she' ? 'is' : 'are';
  }
  if (verb === 'have') return when === 'fut' ? 'will have' : when === 'past' ? 'had' : subj === 'he' || subj === 'she' ? 'has' : 'have';
  const row = VERBS.find((v) => v[0] === verb);
  if (!row) return null;
  if (when === 'fut') return `will ${row[0]}`;
  if (when === 'past') return row[2];
  return subj === 'he' || subj === 'she' ? row[1] : row[0];
}

const CONTRACTED: Record<string, Subj> = { "i'm": 'I', "you're": 'you', "he's": 'he', "she's": 'she', "we're": 'we', "they're": 'they' };
const SHORT: Record<Subj, string> = { I: "I'm", you: "you're", he: "he's", she: "she's", we: "we're", they: "they're" };

function parseEn(en: string): { subj: Subj; when: When; verb: string; rest: string; short?: boolean } | null {
  const k = /^(I'm|you're|he's|she's|we're|they're)\s+(.*)$/i.exec(en.trim());
  if (k) {
    const rest = ' ' + k[2];
    const first = k[2].split(/\s+/)[0] ?? '';
    if (/[?]/.test(rest) || /ing$|ed$|en$/.test(first) || /^(not|going)\b/i.test(k[2])) return null;
    return { subj: CONTRACTED[k[1].toLowerCase()], when: 'pres', verb: 'be', rest, short: true };
  }
  const m = /^(I|you|he|she|we|they)\s+(will\s+)?([a-z]+)\b(.*)$/i.exec(en.trim());
  if (!m) return null;
  const subj = (m[1].toLowerCase() === 'i' ? 'I' : m[1].toLowerCase()) as Subj;
  const w = m[3].toLowerCase();
  const rest = m[4];
  if (/[?]/.test(rest) || /^\s*(n't|not)\b/.test(rest) || /^'/.test(rest)) return null;
  if (m[2]) {
    if (!VERBS.some((v) => v[0] === w) && w !== 'be' && w !== 'have') return null;
    return { subj, when: 'fut', verb: w, rest };
  }
  const first = rest.trim().split(/\s+/)[0] ?? '';
  if (/^(am|are|is|was|were)$/.test(w)) {
    if (/ing$|ed$|en$/.test(first)) return null;
    return { subj, when: /^(am|are|is)$/.test(w) ? 'pres' : 'past', verb: 'be', rest };
  }
  if (/^(have|has|had)$/.test(w)) {
    if (/ed$|en$|ne$/.test(first)) return null;
    return { subj, when: w === 'had' ? 'past' : 'pres', verb: 'have', rest };
  }
  for (const [b, s3, p] of VERBS) {
    if (AMBIGUOUS.has(b)) continue;
    if (w === b || w === s3) return { subj, when: 'pres', verb: b, rest };
    if (w === p) return { subj, when: 'past', verb: b, rest };
  }
  return null;
}

const readsAs = (rs: ReturnType<typeof verbReadings>, subj: Subj, when: When) =>
  rs.some((a) => PERSONS[subj].includes(a.person) && TENSES[when].includes(a.tense));

/**
 * Up to `n` English sentences that differ from `s.en` in exactly one of who
 * or when, none of which the Spanish could also be saying. null = cannot.
 */
export function englishVariants(s: { es: string; en: string }, key: string, n = 3): string[] | null {
  const p = parseEn(s.en);
  if (!p || OWNED.test(p.rest)) return null;
  const c = parseClause(s.es, s.en);
  if (!c || c.verb < 0 || c.participle >= 0 || c.neg >= 0) return null;
  const rs = verbReadings(c.toks[c.verb].core.toLowerCase());
  if (!rs.length || !readsAs(rs, p.subj, p.when)) return null;
  const timed = TIME.test(p.rest);
  const cands: Array<{ subj: Subj; when: When }> = [];
  for (const subj of SUBJECTS) {
    if (subj !== p.subj && !(subj === 'she' && p.subj === 'he') && !(subj === 'he' && p.subj === 'she')) cands.push({ subj, when: p.when });
  }
  if (!timed) for (const when of ['pres', 'past', 'fut'] as When[]) if (when !== p.when) cands.push({ subj: p.subj, when });
  const tail = p.rest.replace(/\s+$/, '');
  const seen = new Set([s.en.trim().toLowerCase().replace(/[.!]+$/, '')]);
  const out: string[] = [];
  for (const v of shuffle(cands, rng(`${key}:ev`))) {
    if (readsAs(rs, v.subj, v.when)) continue;
    const verb = conj(p.verb, v.subj, v.when);
    if (!verb) continue;
    const text = p.short && v.when === 'pres' ? `${SHORT[v.subj]}${tail}` : `${v.subj} ${verb}${tail}`;
    const k = text.toLowerCase().replace(/[.!]+$/, '');
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(text);
    if (out.length >= n) break;
  }
  return out.length >= 2 ? out : null;
}
