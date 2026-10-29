/* ============================================================================
 * THE FEATURE TAGGER — which grammar and words does this Spanish require?
 *
 *   tagSentence('Quiero que vengas mañana.')
 *   -> { requires: ['g:presente-subjuntivo-irregular', 'g:presente-e-ie', 'g:subjuntivo-deseo',
 *                   'l:mañana', 'l:querer', 'l:venir'],
 *        features: [...], confidence: 'high', lowReasons: [] }
 *
 * Pipeline: ./words.ts tokenises and gives each token one part of speech
 * (engine for verbs, lexicon for the rest, homograph rules in between);
 * ./features.ts detects grammar features with token spans; ./nodemap.ts maps
 * feature keys to graph node ids; chunks (taught as wholes) are matched last.
 *
 * NEVER SILENTLY PASS. Anything the tagger cannot settle — an unknown word,
 * a form whose only verb reading has the wrong accents, a subjunctive with
 * no licensing trigger, a sentence-initial form that is a tú command or a
 * present — sets confidence 'low' with a reason. The gate reports those; it
 * does not guess.
 *
 * `requires` is computed, never hand-written: the gate fails a bank sentence
 * whose stored requires differ from this, and `npm run gate -- --fix` writes it.
 * ========================================================================== */
import { analyzeWords, tokenize } from './words';
import { detect, type FeatureCtx } from './features';
import { resolveNode } from './nodemap';
import { deaccent } from '../ortho';
import type { ChunkSpec, Feature, TagOptions, TagResult, Word } from './types';

export type { Feature, TagOptions, TagResult, Word, Token, Pos, ChunkSpec, NodeId } from './types';
export { DEFAULT_NODE_MAP, resolveNode, mappedKeys } from './nodemap';
export { registerLexemes, registerNames, isName, lemmatize, lexEntry, isKnownForm, addKnownForms, closedClass } from './lexicon';
export { tokenize, analyzeWords } from './words';
export { formClass, queRole } from './features';
export { dialectLint, DIALECT_LEXICON } from './dialect';
export type { DialectFinding, DialectEntry } from './dialect';
export { accentLint } from './accent';
export type { AccentFinding } from './accent';

/* ---- chunks taught as wholes ------------------------------------------------
 * A chunk node's `es` is written for learners, not for matching: several
 * alternatives ("Me llamo Tomás. ¿Cómo te llamas? / ¿Cómo se llama usted?"),
 * example names, quoted words. It compiles to patterns:
 *   - the id slug: c:me-llamo -> "me llamo", c:quiero -> "quiero";
 *   - every fragment between / — . ? ! ; : that shares a word with the slug,
 *     with names, numbers and quoted words as one-token wildcards:
 *     "me llamo *", "cuantos anos tienes".
 * Matching ignores accents, ñ and case. */
const fold = (s: string) => deaccent(s.toLowerCase()).replace(/ñ/g, 'n');
type Pattern = string[];                      // '*' = any one word
const PATTERNS = new WeakMap<readonly ChunkSpec[], Array<{ id: string; pats: Pattern[] }>>();
function compile(chunks: readonly ChunkSpec[]): Array<{ id: string; pats: Pattern[] }> {
  const hit = PATTERNS.get(chunks);
  if (hit) return hit;
  const out = chunks.map((c) => {
    const pats: Pattern[] = [];
    const seen = new Set<string>();
    const push = (p: Pattern) => { const k = p.join(' '); if (p.length && p.some((t) => t !== '*') && !seen.has(k)) { seen.add(k); pats.push(p); } };
    const slug = fold(c.id.replace(/^c:/, '').replace(/#.*/, '')).split('-').filter(Boolean);
    const inSlug = new Set(slug);
    push(slug);
    for (const frag of c.es.split(/\s\/\s|\/|—|–|[.,?!;:…¿¡()]/)) {
      const toks = [...frag.matchAll(/"[^"]*"|“[^”]*”|'[^']*'|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+|\d+/g)].map((m, k) => {
        const t = m[0];
        if (/^["“']/.test(t) || /^\d/.test(t)) return '*';
        if (k > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(t)) return '*';
        return fold(t);
      });
      // a fragment is the chunk only if it shares a word with the id: "¿Un tinto?" is
      // the set-up line of c:no-te-voy-a-decir-que-no, not the chunk
      const shares = (t: string) => inSlug.has(t) || (t.length >= 4 && slug.some((sl) => sl.length >= 4 && sl.slice(0, 4) === t.slice(0, 4)));
      if (!toks.length || !toks.some(shares)) continue;
      if (toks.length === 1 && slug.length > 1) continue;      // "Sí" alone is not c:si-soy-yo
      push(toks);
    }
    return { id: c.id, pats };
  });
  PATTERNS.set(chunks, out);
  return out;
}

function chunkPass(words: Word[], chunks: readonly ChunkSpec[], out: Feature[]): void {
  // a name matches only a wildcard: "Vale" the character is not c:vale-spain
  const ws = words.map((w, i) => ({ w: w.punct ? '' : w.pos === 'propn' ? '\u0000' : fold(w.w), i })).filter((x) => x.w);
  for (const c of compile(chunks)) {
    let found = false;
    // the slug (first pattern) may have up to 3 words in between: c:tengo-anos ~ "Tengo treinta años"
    const slug = c.pats[0];
    if (slug && slug.length >= 2) {
      for (let k = 0; k < ws.length; k++) {
        if (ws[k].w !== slug[0]) continue;
        let m = 1, j = k + 1, gaps = 0;
        while (m < slug.length && j < ws.length && gaps <= 3) { if (ws[j].w === slug[m]) m++; else gaps++; j++; }
        if (m === slug.length && gaps <= 3 && gaps > 0) {
          const a = ws[k].i, b = ws[j - 1].i;
          out.push({ key: 'chunk.' + c.id, node: c.id, span: [a, b], text: words.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(' ') });
        }
      }
    }
    for (const pat of c.pats) {
      for (let k = 0; k + pat.length <= ws.length; k++) {
        if (pat.every((p, m) => p === '*' || ws[k + m].w === p)) {
          const a = ws[k].i, b = ws[k + pat.length - 1].i;
          out.push({ key: 'chunk.' + c.id, node: c.id, span: [a, b], text: words.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(' ') });
          found = true;
        }
      }
    }
    void found;
  }
}

/** Tag one sentence (or a short text: sentences are handled independently
 *  by the detectors, which never look across a full stop). */
export function tagSentence(es: string, opts: TagOptions = {}): TagResult {
  const words = analyzeWords(es);
  const ctx: FeatureCtx = { words, features: [], low: [] };
  detect(ctx);
  if (opts.chunks?.length) chunkPass(words, opts.chunks, ctx.features);
  // a sentence that needs both pasts needs the contrast between them
  const pret = ctx.features.find((f) => f.key.startsWith('tense.preterito'));
  const imp = ctx.features.find((f) => f.key.startsWith('tense.imperfecto') || f.key === 'peri.estar-ger.past');
  if (pret && imp) ctx.features.push({ key: 'tense.mix', node: null, span: [Math.min(pret.span[0], imp.span[0]), Math.max(pret.span[1], imp.span[1])], text: `${pret.text} … ${imp.text}` });
  const lexemes = opts.lexemes !== false;
  const req = new Set<string>();
  for (const f of ctx.features) {
    f.node = resolveNode(f.key, opts);
    if (!f.node) continue;
    if (!lexemes && f.node.startsWith('l:')) continue;
    req.add(f.node);
  }
  const lowReasons = [...new Set(ctx.low)];
  return {
    requires: [...req].sort(),
    features: ctx.features,
    confidence: lowReasons.length ? 'low' : 'high',
    lowReasons,
    tokens: words,
  };
}

/** Split a text into sentences (dialogue dashes and final punctuation). */
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  const parts = text.replace(/\s+/g, ' ').split(/(?<=[.!?…])\s+(?=[—¿¡"«A-ZÁÉÍÓÚÑ])|\s+(?=—)/);
  for (const p of parts) { const t = p.trim(); if (t && /[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(t)) out.push(t); }
  return out;
}

/** Tag a multi-sentence text: union of requires, all features, all reasons. */
export function tagText(text: string, opts: TagOptions = {}): TagResult & { sentences: number } {
  const sents = splitSentences(text);
  const req = new Set<string>();
  const features: Feature[] = [];
  const low = new Set<string>();
  const tokens: Word[] = [];
  for (const s of sents) {
    const r = tagSentence(s, opts);
    r.requires.forEach((x) => req.add(x));
    features.push(...r.features);
    r.lowReasons.forEach((x) => low.add(x));
    tokens.push(...r.tokens);
  }
  return { requires: [...req].sort(), features, confidence: low.size ? 'low' : 'high', lowReasons: [...low], tokens, sentences: sents.length };
}

