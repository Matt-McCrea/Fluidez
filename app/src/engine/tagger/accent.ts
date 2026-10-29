/* ============================================================================
 * ACCENT AND SPELLING LINT — port of tools/lint-spanish.js, plus context.
 *
 * A dropped accent is the single most common thing a fast model gets wrong
 * in Spanish, and every other gate is blind to it.
 *
 *   1. PARADIGM (error): the word is not a known form, and deaccenting it
 *      matches a form the ENGINE generates ("comio" -> "comió"). Adjudicated
 *      only against the engine's own complete paradigms, never against the
 *      corpus lexicon — Spanish is full of minimal accent pairs that are both
 *      correct (hablo/habló, esta/está, publico/publicó/público).
 *   2. LEXICON (error): the word is unknown, and the only known words that
 *      deaccent to it carry an accent ("tambien", "cancion", "despues").
 *   3. CLITIC STRESS (error): a gerund or command with attached pronouns that
 *      lost its accent ("diciendome", "levantate", "digamelo").
 *   4. CONTEXT (error): the accent pairs the paradigm cannot decide —
 *      ¿que/como/donde...? at the head of a question, "esta" before an
 *      adjective/participle/place ("esta cansado"), "el"/"mi" after a
 *      preposition at the end of a phrase ("para el."), "tu" before a verb,
 *      "yo se" / "no se." — and a "?" with no opening "¿".
 * ========================================================================== */
import { VERBS, TENSES, conjugate, participles, gerund, deaccent, attachEnclitic, analyzeToken, isCompound } from '../index';
import { isKnownForm, lexEntry, closedClass, lemmatize, isName } from './lexicon';
import { analyzeWords } from './words';
import type { Word } from './types';
import formsJson from './data/forms.json';

export interface AccentFinding {
  severity: 'error' | 'warning';
  word: string;
  index: number;
  problem: string;
  fix: string;
}

let ENGINE_DEAC: Map<string, Set<string>> | null = null;
let FORMS_DEAC: Map<string, Set<string>> | null = null;
function engineDeac(): Map<string, Set<string>> {
  if (ENGINE_DEAC) return ENGINE_DEAC;
  const m = new Map<string, Set<string>>();
  const add = (f: string) => {
    for (const w of f.toLowerCase().split(' ')) {
      if (!w || w === 'no') continue;
      const d = deaccent(w);
      const s = m.get(d); if (s) s.add(w); else m.set(d, new Set([w]));
    }
  };
  for (const v of VERBS) {
    add(v.inf.replace(/se$/, ''));
    for (const t of TENSES) {
      if (isCompound(t.key)) continue;
      try { conjugate(v, t.key).forEach((f) => f && add(f)); } catch { /* n/a */ }
    }
    try { participles(v).forEach(add); add(gerund(v)); } catch { /* n/a */ }
  }
  ENGINE_DEAC = m;
  return m;
}
function formsDeac(): Map<string, Set<string>> {
  if (FORMS_DEAC) return FORMS_DEAC;
  const m = new Map<string, Set<string>>();
  for (const w of formsJson as string[]) {
    if (!/[áéíóú]/.test(w)) continue;
    const d = deaccent(w);
    const s = m.get(d); if (s) s.add(w); else m.set(d, new Set([w]));
  }
  FORMS_DEAC = m;
  return m;
}

const INTERROG = new Map(Object.entries({ que: 'qué', como: 'cómo', donde: 'dónde', cuando: 'cuándo', quien: 'quién', quienes: 'quiénes', cual: 'cuál', cuales: 'cuáles', cuanto: 'cuánto', cuanta: 'cuánta', cuantos: 'cuántos', cuantas: 'cuántas', adonde: 'adónde' }));
const PREP_BEFORE_INT = new Set(['de', 'a', 'por', 'para', 'con', 'en', 'desde', 'hasta', 'sin']);
const LOC_AFTER_ESTA = new Set(['bien', 'mal', 'en', 'aquí', 'allí', 'ahí', 'acá', 'allá', 'muy', 'cerca', 'lejos', 'listo', 'lista', 'bastante', 'tan', 'demasiado', 'todavía', 'enfermo', 'enferma', 'contento', 'contenta', 'cansado', 'cansada', 'abierto', 'abierta', 'cerrado', 'cerrada', 'lleno', 'llena', 'libre', 'ocupado', 'ocupada', 'seguro', 'segura', 'loco', 'loca']);
const CL = '(me|te|se|lo|la|le|nos|los|las|les)';

function cliticStressFix(x: string, E: Map<string, Set<string>>): { what: string; fix: string } | null {
  if (/[áéíóú]/.test(x)) return null;
  for (const c2 of ['', 'me', 'te', 'se', 'lo', 'la', 'le', 'nos', 'los', 'las', 'les']) {
    for (const c1 of ['me', 'te', 'se', 'lo', 'la', 'le', 'nos', 'los', 'las', 'les']) {
      const cl = c1 + c2;
      if (!x.endsWith(cl) || x.length <= cl.length + 2) continue;
      if (/(al|el|il)es$/.test(x) && cl.endsWith('les')) continue;     // procesales, fieles: adjective plurals
      const base = x.slice(0, -cl.length);
      if (E.has(base) && /(ando|iendo|yendo)$/.test(base)) return { what: 'gerund', fix: attachEnclitic(base, cl) };
      const imp = analyzeToken(base).filter((a) => a.tense === 'imperativo' && a.accentExact && a.person !== 'vosotros');
      if (imp.length && base.length > 2 && !['da', 'di', 've', 'ten', 'pon', 'sal', 'haz', 'ven', 'sé'].includes(base)) {
        const fixed = attachEnclitic(imp[0].form, cl);
        if (fixed !== x) return { what: 'command', fix: fixed };
      }
    }
  }
  return null;
}

function isKnown(w: Word): boolean {
  // a capitalised first word that is not a known form is "propn" only by default
  if (w.pos === 'propn' && w.sentStart && !isName(w.w)) return isKnownForm(w.w) || !!lemmatize(w.w);
  if (w.pos !== 'unknown') return true;
  return isKnownForm(w.w) || !!closedClass(w.w) || !!lexEntry(w.w) || !!lemmatize(w.w);
}

export function accentLint(text: string, words: Word[] = analyzeWords(text)): AccentFinding[] {
  const out: AccentFinding[] = [];
  const E = engineDeac();
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.punct || w.capMid || /^\d/.test(w.w)) continue;
    const x = w.w;
    // 4. context rules
    const p = words[i - 1];
    const pp = words[i - 2];
    const nx = words[i + 1];
    const qHead = p && (p.w === '¿' || p.w === '¡') || (p && PREP_BEFORE_INT.has(p.w) && pp && (pp.w === '¿' || pp.w === '¡'));
    if (INTERROG.has(x) && qHead) {
      // "¡Que te mejores!" is a wish, not a question: only flag que after ¡ before an adjective/noun/adverb
      // "¡Que te mejores!", "¡Que no lo toques!", "¿Que has dejado el trabajo?" (echo): que before a verb is right
      if (!(x === 'que' && nx && (nx.pos === 'clitic' || nx.pos === 'verb' || nx.pos === 'neg' || nx.pos === 'pron' || nx.w === 'si'))) {
        out.push({ severity: 'error', word: w.text, index: i, problem: `interrogative "${x}" without its accent`, fix: INTERROG.get(x)! });
        continue;
      }
    }
    if (x === 'porque' && p && p.w === '¿') { out.push({ severity: 'error', word: w.text, index: i, problem: '"¿porque" in a question', fix: '¿por qué' }); continue; }
    const nn = words[i + 2];
    const attributive = nn && !nn.punct && ['noun', 'x', 'unknown'].includes(nn.pos) && nx && nx.pos !== 'ger';   // esta nueva etapa
    const nounNext = nx && (lexEntry(nx.w)?.pos === 'noun' || (nx.lemma && lexEntry(nx.lemma)?.pos === 'noun'));
    // "afecta esta subida", "que esta medida se deba": after a verb or before one, esta is the demonstrative
    const npSlot = (p && ['prep', 'verb', 'inf', 'ger'].includes(p.pos)) || (nn && ['verb', 'clitic'].includes(nn.pos));
    if (x === 'esta' && nx && !nx.punct && !attributive && !nounNext && !npSlot && (LOC_AFTER_ESTA.has(nx.w) || nx.pos === 'part' || nx.pos === 'ger' || (nx.pos === 'adj' && !['misma', 'otra', 'primera', 'última', 'próxima'].includes(nx.w)))) {
      out.push({ severity: 'error', word: w.text, index: i, problem: `"esta ${nx.w}" reads as the verb`, fix: 'está' }); continue;
    }
    if (x === 'el' && p && PREP_BEFORE_INT.has(p.w) && (!nx || nx.punct || ['y', 'o', 'pero', 'también'].includes(nx.w))) {
      out.push({ severity: 'error', word: w.text, index: i, problem: `"${p.w} el" with no noun: the pronoun`, fix: 'él' }); continue;
    }
    if (x === 'mi' && p && ['a', 'para', 'de', 'por', 'sin', 'en'].includes(p.w) && (!nx || nx.punct || ['y', 'o', 'también', 'mismo', 'misma'].includes(nx.w))) {
      out.push({ severity: 'error', word: w.text, index: i, problem: `"${p.w} mi" with no noun: the pronoun`, fix: 'mí' }); continue;
    }
    if (x === 'tu' && nx && nx.pos === 'verb' && nx.verb?.some((a) => a.person === 'tú' && a.tense !== 'imperativo') && !lexEntry(nx.w) && !(nx.lemma && lexEntry(nx.lemma)?.pos === 'noun')) {
      out.push({ severity: 'error', word: w.text, index: i, problem: `"tu ${nx.w}": the subject pronoun`, fix: 'tú' }); continue;
    }
    if (x === 'se' && p && (p.w === 'yo' || p.w === 'no' && (!nx || nx.punct || ['si', 'qué', 'cómo', 'dónde', 'cuándo', 'quién', 'nada', 'mucho', 'bien'].includes(nx.w)))) {
      out.push({ severity: 'error', word: w.text, index: i, problem: `"${p.w} se" here is saber`, fix: 'sé' }); continue;
    }
    if (x === 'mas' && p && !p.punct) { out.push({ severity: 'warning', word: w.text, index: i, problem: '"mas" (archaic "but")', fix: 'más' }); continue; }
    if (isKnown(w) || (w.pos === 'propn' && !w.sentStart) || isName(w.w)) continue;
    if (w.cap && w.sentStart && !analyzeToken(x).length && !formsDeac().has(deaccent(x)) && !cliticStressFix(x, E)) continue;  // a name at the start
    // 1. engine paradigm
    const cands = E.get(deaccent(x));
    if (cands && cands.size && !cands.has(x)) {
      out.push({ severity: 'error', word: w.text, index: i, problem: `"${x}" is not a form; the engine has`, fix: [...cands].join(' / ') });
      continue;
    }
    // 3. gerund / command + clitics without the accent
    const cs = cliticStressFix(x, E);
    if (cs) { out.push({ severity: 'error', word: w.text, index: i, problem: `"${x}" (${cs.what} + pronoun) needs a written accent`, fix: cs.fix }); continue; }
    // 2. lexicon: only accented words share this spelling
    const lc = formsDeac().get(deaccent(x));
    if (lc && lc.size && !lc.has(x)) {
      // an accent on the LAST letter (insultó beside insulto) is a verb form beside a noun: both may be right
      const finalOnly = [...lc].every((c) => /[áéíóú]$/.test(c));
      out.push({ severity: finalOnly ? 'warning' : 'error', word: w.text, index: i, problem: `"${x}" is missing an accent?`, fix: [...lc].slice(0, 3).join(' / ') });
    }
  }
  // inverted punctuation
  const sentences = text.split(/(?<=[.?!…])\s+/);
  for (const s of sentences) {
    if (/\?/.test(s) && !/¿/.test(s)) out.push({ severity: 'error', word: s.slice(0, 40), index: -1, problem: 'question without an opening "¿"', fix: 'add ¿ at the start of the question' });
    if (/!/.test(s) && !/¡/.test(s)) out.push({ severity: 'warning', word: s.slice(0, 40), index: -1, problem: 'exclamation without an opening "¡"', fix: 'add ¡ at the start of the exclamation' });
  }
  return out;
}
