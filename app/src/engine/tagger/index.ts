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
import type { ChunkSpec, Feature, PatternSpec, TagOptions, TagResult, Word } from './types';
import { closedClass, isKnownForm, isName, lemmatize, lexEntry } from './lexicon';
import { compileSpec, findSpec, hasAnchors, isSpec, matchTokens, sentenceKeys, SpecError, type CompiledSpec } from './patterns';

export type { Feature, TagOptions, TagResult, Word, Token, Pos, ChunkSpec, PatternSpec, NodeId } from './types';
export { DEFAULT_NODE_MAP, resolveNode, mappedKeys } from './nodemap';
export { registerLexemes, registerNames, isName, lemmatize, lexEntry, isKnownForm, addKnownForms, closedClass } from './lexicon';
export { tokenize, analyzeWords } from './words';
export { formClass, queRole } from './features';
export { dialectLint, DIALECT_LEXICON } from './dialect';
export { parseSpec, isSpec, SpecError } from './patterns';
export type { DialectFinding, DialectEntry } from './dialect';
export { accentLint } from './accent';
export type { AccentFinding } from './accent';

/* ---- chunks taught as wholes ------------------------------------------------
 * A chunk node's `es` is written for learners, not for matching: several
 * alternatives ("Me llamo Tomás. ¿Cómo te llamas? / ¿Cómo se llama usted?"),
 * example names, quoted words, a set-up line before "—". It compiles to patterns:
 *   - the id slug: c:me-llamo -> "me llamo", c:quiero -> "quiero";
 *   - every FRAGMENT between / — … , . ? ! ¿ ¡ ; : that
 *       is one word (Igualmente. / Encantada. / ¡Vamos! / ayer / Disculpe, …), or
 *       is a whole "/" alternative by itself (Fue un desastre. for c:estuvo), or
 *       shares a word with the slug ("¿Cómo te llamas?" for c:me-llamo);
 *     so "Hace frío, ¿no?" gives "¿no?" to c:no-cierto, not "hace frío", and the
 *     set-up "¿Un tinto? —" is not c:no-te-voy-a-decir-que-no;
 *   - names, numbers and quoted words are slots ('*'): a slot takes a run of
 *     names, numbers, "y", don/doña ("Tengo treinta y dos años", "Don Hernando")
 *     or any one word. No other gaps: "¿Hay leche? Creo que no." is not c:hay-que,
 *     "Soy el nieto de Rosa" is not c:soy-de.
 * A one-word fragment that is a content word matches anywhere only when it shares the
 * id's stem or verb (Voy for c:voy-vas, Tenemos for c:tienes); a variant or reply turn
 * that does not (Listo. for c:me-parece-bien) matches only standing alone, and the
 * first word of a spelled-out id phrase (Bueno, in "Bueno, no sé") never alone.
 * A one-word fragment that is a function word (¿no?; adverbs such as ayer, anoche
 * match anywhere) or the head of a
 * "… que" chunk (", creo." for c:creo-que) matches only standing alone: nothing
 * but punctuation on either side.
 * A match also covers the slot after a frame (c:tengo-que + "trabajar", c:voy-a +
 * "comprar", ¿Me da + "un tinto"?, Estuvo + "buenísimo"): one infinitive, one noun
 * phrase or one adjective right after it — its grammar is part of the frame, its
 * words still have to be known.
 * Matching ignores accents, ñ and case. */
const fold = (s: string) => deaccent(s.toLowerCase()).replace(/ñ/g, 'n');
type Pattern = string[] & { alone?: boolean; q?: boolean };   // q: a tag question, followed by '?'   // '*' = slot; alone: a one-word fragment standing by itself
const PATTERNS = new WeakMap<readonly ChunkSpec[], Array<{ id: string; pats: Pattern[] }>>();
const SLOT_RUN = new Set(['y', 'don', 'dona', 'senor', 'senora']);
const SLOTS = new Set(['*', '#', '@']);
/** Words told apart only by their accent: a chunk written with one matches only that one. */
const TILDE_PAIRS = new Set(['él', 'tú', 'mí', 'sí', 'sé', 'té', 'dé', 'más', 'qué', 'cómo', 'dónde', 'cuándo', 'quién', 'cuánto', 'cuál']);
/** Words used as tag questions (¿no?, ¿verdad?, ¿cierto?, ¿sí?, ¿eh?). */
const TAG_WORDS = new Set(['no', 'verdad', 'cierto', 'si', 'sí', 'eh', 'ya', 'oyes', 'ves']);
/** Is `frag` written as a tag question (", ¿no?", ", ¿verdad?") in `alt`? */
const tagQ = (frag: string, alt: string) => new RegExp('¿\\s*' + frag.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\?').test(alt);
function compile(chunks: readonly ChunkSpec[]): Array<{ id: string; pats: Pattern[] }> {
  const hit = PATTERNS.get(chunks);
  if (hit) return hit;
  const out = chunks.map((c) => {
    const pats: Pattern[] = [];
    const seen = new Set<string>();
    const push = (p: Pattern) => { const k = (p.alone ? '!' : '') + (p.q ? '?' : '') + p.join(' '); if (p.length && p.some((t) => t !== '*') && !seen.has(k)) { seen.add(k); pats.push(p); } };
    const slug = fold(c.id.replace(/^c:/, '').replace(/#.*/, '')).split('-').filter(Boolean);
    const inSlug = new Set(slug);
    const verbLemma = (w: string) => { const a = analyzeWords(w)[0]; return a && a.pos === 'verb' ? a.lemma ?? '' : ''; };
    const slugLemmas = new Set(slug.map(verbLemma).filter(Boolean));
    // a word of the id, its first four letters, or another person of the id's verb (Tenemos for c:tienes)
    const shares = (t0: string) => { const t = t0.replace(/^=/, ''); return inSlug.has(t) || (t.length >= 4 && slug.some((sl) => sl.length >= 4 && sl.slice(0, 4) === t.slice(0, 4))) || (slugLemmas.size > 0 && slugLemmas.has(verbLemma(t))); };
    push(slug);
    const es = c.es.replace(/«[^»]*»|"[^"]*"|“[^”]*”/g, ' QQQ ');          // quoted words are slots
    const flat = ' ' + fold(c.es).replace(/[/—–]/g, ' | ').replace(/[^a-z|\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
    const phrase = slug.length >= 2 && flat.includes(' ' + slug.join(' ') + ' ');
    for (const alt of es.split(/\s*\/\s*/)) {
      const frags = alt.split(/—|–|…|\.\.\.|[.,?!¿¡;:()]/).map((f) => f.trim()).filter((f) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d]/.test(f));
      for (const frag of frags) {
        const raw = [...frag.matchAll(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+|\d+/g)].map((m) => m[0]);
        const toks: string[] = [];
        raw.forEach((t, k) => {
          // slots: '#' numbers, '@' names, '*' a quoted word
          // a diacritic minimal pair keeps its accent: "con él" is not "con el jefe"
          const f = t === 'QQQ' ? '*' : /^\d/.test(t) || closedClass(t.toLowerCase()) === 'num' ? '#' : k > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(t) ? '@' : TILDE_PAIRS.has(t.toLowerCase()) ? '=' + t.toLowerCase() : fold(t);
          if ((f === '#' || f === '@') && toks[toks.length - 1] === f) return;   // one slot for "treinta y cuatro", "Don Hernando"
          if (f === 'y' && toks[toks.length - 1] === '#' && k + 1 < raw.length && closedClass(raw[k + 1].toLowerCase()) === 'num') return;
          toks.push(f);
        });
        if (!toks.length || toks.every((t) => SLOTS.has(t))) continue;
        if (toks.length === 1) {
          const p: Pattern = [toks[0]];
          const w = raw[0].toLowerCase();
          const cc = closedClass(w);
          if ((cc && cc !== 'adv') || w.length <= 2) {
            // "No." in an answer line is every chunk's; ¿no? is c:no-cierto's because its id says so
            // and not when the id is a phrase it begins ("Sí, soy yo": "Sí" alone is not c:si-soy-yo)
            if (!inSlug.has(toks[0].replace(/^=/, '')) || phrase) continue;
            p.alone = true;
            // written as a tag question (¿no?), it is the chunk only as one: "No." and "No, gracias" are not
            if (TAG_WORDS.has(toks[0].replace(/^=/, '')) && tagQ(frag, alt)) p.q = true;
          } else if (slug.length >= 2 || !inSlug.has(toks[0].replace(/^=/, ''))) {   // (a one-word id, c:tranquilo, matches anywhere)
            // a content word that is one of several variants or reply turns ("Listo." for
            // c:me-parece-bien, "Tranquilo." for c:no-tiene-importancia, "Bueno," for
            // c:bueno-no-se) is the chunk only standing alone ("listo el pan" is not). The
            // first word of an id phrase the es spells out is covered by the phrase itself.
            // A bare frame that shares the id's stem (Voy / Vas, Tenemos, Hago) still matches anywhere;
            // a whole alternative that is the id's first word ("¡Vamos!") matches standing alone.
            // A one-word fragment beside others that is not the id's ("Bueno," before "ya veremos") is context.
            // A reply turn of its own ("Mucho gusto — Igualmente.") or a tag question (", ¿verdad?") is kept.
            const idWord = inSlug.has(toks[0].replace(/^=/, '')) && phrase;
            const q = TAG_WORDS.has(toks[0].replace(/^=/, '')) && tagQ(frag, alt);
            const ownTurn = alt.split(/—|–/).some((turn) => turn.replace(/[.,?!¿¡;:…\s]/g, '') === frag.replace(/[.,?!¿¡;:…\s]/g, ''));
            if (frags.length > 1 && !q && !ownTurn && (idWord || !shares(toks[0]))) continue;
            // only a verb frame of the id's (Voy, Tenemos, Hago, Compré) or one of its time
            // adverbs (ayer, anoche) matches inside a sentence
            const frame = shares(toks[0]) && (!!verbLemma(toks[0].replace(/^=/, '')) || cc === 'adv' || slug.length === 1) && !idWord;
            if (!frame) p.alone = true;
            if (q) p.q = true;
          }
          push(p);
          continue;
        }
        // "A cuatro mil" is no pattern; "Querida Vale" is (one content word of the id + a slot)
        const lits = toks.filter((t) => !SLOTS.has(t));
        if (lits.length < 2 && !(lits.length === 1 && shares(lits[0]) && !closedClass(lits[0]))) continue;
        if (frags.length === 1 || toks.some(shares)) {
          push(toks);
          // the frame before a noun phrase or an infinitive is the chunk too: "¿Me da la cuenta?" -> "me da"
          const tw = analyzeWords(frag);
          const cut = tw.findIndex((w, q) => q >= 2 && ['det', 'poss', 'dem', 'inf'].includes(w.pos));
          if (cut >= 2 && tw.length === toks.length) { const pre = toks.slice(0, cut); if (pre.every((t) => !SLOTS.has(t)) && pre.some(shares) && ['me', 'te', 'le', 'nos', 'les'].includes(pre[0])) push(pre); }
        }
      }
    }
    // the head of a "… que" chunk standing alone: ", creo." is c:creo-que
    if (slug.length >= 2 && slug[1] === 'que' && verbLemma(slug[0])) { const p: Pattern = [slug[0]]; p.alone = true; push(p); }
    return { id: c.id, pats };
  });
  PATTERNS.set(chunks, out);
  return out;
}

/** Match `pat` at ws[k]; returns the index after the match or -1. A slot takes a run of
 *  names/numbers/"y"/titles, or exactly one other word. */
type MW = { w: string; i: number; num: boolean; name: boolean; a: string };
function matchAt(ws: MW[], pat: string[], k: number, m = 0): number {
  if (m === pat.length) return k;
  if (k >= ws.length) return -1;
  if (pat[m][0] === '=') return ws[k].a === pat[m].slice(1) ? matchAt(ws, pat, k + 1, m + 1) : -1;
  if (!SLOTS.has(pat[m])) return ws[k].w === pat[m] ? matchAt(ws, pat, k + 1, m + 1) : -1;
  const fits = (x: { w: string; num: boolean; name: boolean }) => pat[m] === '#' ? x.num || x.w === 'y' : pat[m] === '@' ? x.name : x.num || x.name;
  if (!fits(ws[k])) return pat[m] === '*' ? matchAt(ws, pat, k + 1, m + 1) : -1;
  let end = k;
  while (end < ws.length && fits(ws[end])) end++;
  for (let e = end; e > k; e--) { const r = matchAt(ws, pat, e, m + 1); if (r >= 0) return r; }
  return -1;
}

/** Extend a frame chunk's span over the slot right after it (an infinitive, a noun phrase, an adjective). */
function slotEnd(words: Word[], b: number): number {
  let j = b + 1;
  const w = words[j];
  if (!w || w.punct) return b;
  if (w.pos === 'inf' || w.pos === 'ger') return j;
  if (['adj', 'part'].includes(w.pos)) return j;
  if (['det', 'poss', 'dem', 'num', 'quant'].includes(w.pos)) {
    while (words[j + 1] && !words[j + 1].punct && ['noun', 'adj', 'x', 'num', 'propn', 'part'].includes(words[j + 1].pos)) j++;
    return j;
  }
  return b;
}

function chunkPass(words: Word[], chunks: readonly ChunkSpec[], out: Feature[]): void {
  // a sentence boundary breaks every match; a name is only ever a slot ("Vale" the character is not c:vale-spain)
  const sentences: MW[][] = [[]];
  for (const w of words) {
    if (w.punct) { if (/[.?!…;:]/.test(w.w)) sentences.push([]); continue; }
    const f = fold(w.w);
    // a cast name or a mid-sentence capital is only ever a slot; an unknown capitalised first word
    // (¿Cuadramos…?, Dizque…) may still be the chunk's word
    const nameTok = w.pos === 'propn' && (w.capMid || isName(w.w));
    sentences[sentences.length - 1].push({ a: w.w.toLowerCase(), w: nameTok ? '\u0000' : f, i: w.i, num: w.pos === 'num' || closedClass(w.w) === 'num', name: w.pos === 'propn' || (SLOT_RUN.has(f) && f !== 'y') });
  }
  const isPunct = (k: number) => k < 0 || k >= words.length || words[k].punct;
  for (const c of compile(chunks)) {
    for (const ws of sentences) {
      for (const pat of c.pats) {
        for (let k = 0; k < ws.length; k++) {
          if (pat.alone && !(isPunct(ws[k].i - 1) && isPunct(ws[k].i + 1))) continue;
          if (pat.q && words[ws[k].i + 1]?.w !== '?') continue;
          const e = matchAt(ws, pat, k);
          if (e < 0 || e === k) continue;
          const a = ws[k].i;
          const b = slotEnd(words, ws[e - 1].i);
          out.push({ key: 'chunk.' + c.id, node: c.id, span: [a, b], core: [a, ws[e - 1].i], text: words.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(' ') });
        }
      }
    }
  }
}

/* ---- patterns ------------------------------------------------------------------
 * A pattern node is found by its `match` strings. A string written in the spec
 * language of ./patterns.ts ({tener} razón, {sentir} no? {inf}, desde {...} hasta,
 * somos {num}) matches the construction in any wording; a plain string is a legacy
 * literal (compiled like chunk fragments: folded words, '*' for names, numbers and
 * quoted words; a word also matches by lemma). With no `match`, when every word of
 * its id is Spanish, a pattern is found by its id: the words in order, each matching
 * a token's form or lemma, at most one other word in between, within one clause
 * (p:tener-hambre ~ "Tengo mucha hambre"; x/y in an id are slots: p:prefieres-x-o-y).
 * An id with English in it (p:ser-profession-no-article) and no `match` is not
 * detectable: the gate only warns about such targets. */
type PatMatcher = { id: string; seqs: string[][]; gaps: number; specs: CompiledSpec[] };
const PAT_CACHE = new WeakMap<readonly PatternSpec[], PatMatcher[]>();
/** Metalanguage in pattern ids (p:soler-inf, p:es-adj-inf, p:estar-a-price): never Spanish words. */
const PAT_META = new Set('inf adj adv sust noun verb subj ind indic place price time article plural singular mixed number numbers basic full past future'.split(' '));
const spanishWord = (w: string) => w.length > 1 && !PAT_META.has(w) && (!!lexEntry(w) || !!closedClass(w) || isKnownForm(w) || !!lemmatize(w));
function compilePatterns(specs: readonly PatternSpec[]): PatMatcher[] {
  const hit = PAT_CACHE.get(specs);
  if (hit) return hit;
  const out: PatMatcher[] = [];
  for (const p of specs) {
    if (p.match?.length) {
      const compiled: CompiledSpec[] = [];
      for (const m of p.match.filter(isSpec)) {
        try { compiled.push(compileSpec(m)); } catch (e) { if (!(e instanceof SpecError)) throw e; }   // tests/tagger lint every spec
      }
      // as in chunks, a diacritic minimal pair keeps its accent ("para mí" is not "para mi abuela")
      const seqs = p.match.filter((m) => !isSpec(m)).map((m) => [...m.matchAll(/"[^"]*"|“[^”]*”|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+|\d+/g)].map((x, k) => (/^["“\d]/.test(x[0]) || (k > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(x[0])) ? '*' : TILDE_PAIRS.has(x[0].toLowerCase()) ? '=' + x[0].toLowerCase() : fold(x[0])))).filter((q) => q.some((t) => t !== '*'));
      if (seqs.length || compiled.length) out.push({ id: p.id, seqs, gaps: 0, specs: compiled });
      continue;
    }
    const slug = fold(p.id.replace(/^p:/, '').replace(/#.*/, '')).split('-').filter(Boolean);
    const slots = slug.includes('x');
    const seq = slug.map((t) => (slots && ['x', 'y', 'z'].includes(t) ? '*' : t));
    if (seq.filter((t) => t !== '*').length < 2) continue;
    if (!seq.every((t) => t === '*' || spanishWord(t))) continue;
    if (slots) continue;                                   // "el * de *" (p:el-x-de-y) matches half the corpus
    out.push({ id: p.id, seqs: [seq], gaps: 1, specs: [] });
  }
  PAT_CACHE.set(specs, out);
  return out;
}
function patternPass(words: Word[], specs: readonly PatternSpec[], out: Feature[]): void {
  const pats = compilePatterns(specs);
  // spec patterns: over the whole sentence (a spec says where punctuation may sit)
  const ms = matchTokens(words);
  const keys = sentenceKeys(ms);
  const found = new Set<string>();
  for (const p of pats) {
    for (const sp of p.specs) {
      if (!hasAnchors(sp, keys)) continue;
      const m = findSpec(ms, sp);
      if (!m) continue;
      const a = ms[m[0]].i, b = ms[m[1]].i;
      out.push({ key: 'pattern.' + p.id, node: p.id, span: [a, b], text: words.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(' ') });
      found.add(p.id);
      break;
    }
  }
  // legacy literals and id patterns: within a clause, punctuation ends a match ("gracias. Un tinto, por favor" is not gracias por)
  const clauses: Word[][] = [[]];
  for (const w of words) { if (w.punct) clauses.push([]); else clauses[clauses.length - 1].push(w); }
  for (const ws of clauses) if (ws.length) patternClause(ws, words, pats, out, found);
}
function patternClause(ws: Word[], words: Word[], pats: PatMatcher[], out: Feature[], found: Set<string>): void {
  const is = (w: Word, t: string) => t === '*' || (t[0] === '=' ? w.w.toLowerCase() === t.slice(1) : fold(w.w) === t || fold(w.lemma || '') === t);
  for (const p of pats) {
    if (found.has(p.id) || !p.seqs.length) continue;
    let done = false;
    for (const seq of p.seqs) {
      for (let k = 0; k < ws.length && !done; k++) {
        if (!is(ws[k], seq[0])) continue;
        let m = 1, j = k + 1, gaps = 0;
        while (m < seq.length && j < ws.length && gaps <= p.gaps) { if (is(ws[j], seq[m])) m++; else gaps++; j++; }
        if (m === seq.length && gaps <= p.gaps) {
          const a = ws[k].i, b = ws[j - 1].i;
          out.push({ key: 'pattern.' + p.id, node: p.id, span: [a, b], text: words.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(' ') });
          found.add(p.id);
          done = true;
        }
      }
      if (done) break;
    }
  }
}
/** The pattern features of an already tagged sentence (TagResult.tokens): for tools that
 *  try pattern specs over a corpus without re-tagging it. */
export function patternFeatures(words: Word[], specs: readonly PatternSpec[]): Feature[] { const out: Feature[] = []; patternPass(words, specs, out); return out; }
/** Pattern ids the tagger can look for at all (others are never in requires). */
export function detectablePatterns(specs: readonly PatternSpec[]): Set<string> { return new Set(compilePatterns(specs).map((p) => p.id)); }

/** Tag one sentence (or a short text: sentences are handled independently
 *  by the detectors, which never look across a full stop). */
export function tagSentence(es: string, opts: TagOptions = {}): TagResult {
  const words = analyzeWords(es);
  const ctx: FeatureCtx = { words, features: [], low: [] };
  detect(ctx);
  if (opts.chunks?.length) chunkPass(words, opts.chunks, ctx.features);
  if (opts.patterns?.length) patternPass(words, opts.patterns, ctx.features);
  // a sentence that needs both pasts needs the contrast between them
  const pret = ctx.features.find((f) => f.key.startsWith('tense.preterito'));
  const imp = ctx.features.find((f) => f.key.startsWith('tense.imperfecto') || f.key === 'peri.estar-ger.past');
  if (pret && imp) ctx.features.push({ key: 'tense.mix', node: null, span: [Math.min(pret.span[0], imp.span[0]), Math.max(pret.span[1], imp.span[1])], text: `${pret.text} … ${imp.text}` });
  const lexemes = opts.lexemes !== false;
  // A chunk is known as a whole phrase, not as grammar: what lies inside a matched chunk's own
  // words ("Buenos días", "¿Me regala…?") requires the chunk, plus its words, not the grammar it
  // seeds. What reaches into the slot it takes ("Quiero ir": verb + infinitive) is still required.
  // The gate's legality check still sees every feature.
  const req = new Set<string>();
  for (const f of ctx.features) f.node = resolveNode(f.key, opts);
  // The grammar a chunk seeds (its `unpacks`) stays: "¿Te gusta el café?" practises g:gustar-basic
  // once that is taught, and a taught chunk that unpacks a node stands in for it until then.
  const unpacks = new Map((opts.chunks ?? []).filter((c) => c.unpacks).map((c) => [c.id, c.unpacks!]));
  // several chunks matching the same words ("Qué pena" is c:que-pena's and c:que-oso's): the
  // earliest taught is the one the sentence needs
  const prio = new Map((opts.chunks ?? []).map((c) => [c.id, c.priority ?? 0]));
  // (and a chunk inside one taught no later, "igual" in "Me da igual", is part of it)
  const sameSpan = (a: Feature, b: Feature) => a.span[0] === b.span[0] && a.span[1] === b.span[1];
  const within = (a: Feature, b: Feature) => a.span[0] >= b.span[0] && a.span[1] <= b.span[1] && !sameSpan(a, b);
  const pr = (f: Feature) => prio.get(f.node!) ?? 0;
  const chunkFts = ctx.features.filter((f) => f.key.startsWith('chunk.') && f.node && !ctx.features.some((g) => g !== f && g.key.startsWith('chunk.') && g.node && g.node !== f.node && (
    (sameSpan(f, g) && (pr(g) < pr(f) || (pr(g) === pr(f) && g.node < f.node!))) || (within(f, g) && pr(g) <= pr(f)))));
  const dropped = new Set(ctx.features.filter((f) => f.key.startsWith('chunk.') && !chunkFts.includes(f)));
  for (const f of ctx.features) {
    if (!f.node) continue;
    if (!lexemes && f.node.startsWith('l:')) continue;
    if (dropped.has(f)) continue;
    if (!f.node.startsWith('l:') && !f.key.startsWith('chunk.') && chunkFts.some((c) => f.span[0] >= (c.core ?? c.span)[0] && f.span[1] <= (c.core ?? c.span)[1]) && !chunkFts.some((c) => unpacks.get(c.node!) === f.node)) continue;
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

