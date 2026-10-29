/* ============================================================================
 * ACCEPTED VARIANTS of a model answer.
 *
 * The course teaches neutral Latin American Spanish. A learner is RIGHT if
 * they write any of:
 *  - the model, or any `accept` the author listed;
 *  - the same sentence in another register of "you", when the English
 *    leaves it open: tú, usted, ustedes. "Do you speak English?" is
 *    ¿Hablas inglés?, ¿Habla (usted) inglés? and ¿Hablan (ustedes) inglés?;
 *  - a Peninsular form: vosotros for plural "you", coche for carro,
 *    ordenador for computadora, conducir for manejar. Accepted, and FLAGGED
 *    (variant: 'peninsular') so the UI can name the Latin American word.
 *    Never required, never produced as a model answer.
 * ========================================================================== */
import { PERSONS, verbByInf } from '../../engine';
import type { Person } from '../../engine';
import { conjugateBareCells } from '../../engine/conjugate';
import { changePerson } from '../../exercises/reinflect';
import {
  EXPERIENCER, detGender, enYou, low, otherGender, parseClause, render, replaceCore, toToks, verbReadings, type Tok,
} from '../../exercises/spanish';

export type Register = 'tú' | 'usted' | 'ustedes' | 'vosotros';

export interface Variant {
  es: string;
  /** Set when the variant is Peninsular (accepted, flagged). */
  variant?: 'peninsular';
  /** Which "you" this variant uses, when it uses one. */
  register?: Register;
  /** The author's own form (sentence.es), as opposed to a derived one. */
  model?: boolean;
}

/** Latin American word → Peninsular word. Nouns carry the Peninsular gender
 *  when it differs, so the article can follow. Verbs are re-inflected. */
export const PENINSULAR_NOUNS: Readonly<Record<string, { es: string; gender?: 'm' | 'f' }>> = {
  carro: { es: 'coche' }, computadora: { es: 'ordenador', gender: 'm' }, celular: { es: 'móvil' }, jugo: { es: 'zumo' },
  papa: { es: 'patata' }, durazno: { es: 'melocotón' }, departamento: { es: 'piso' }, lentes: { es: 'gafas', gender: 'f' },
  boleto: { es: 'billete' }, frijoles: { es: 'judías', gender: 'f' }, refrigerador: { es: 'nevera', gender: 'f' },
  computadoras: { es: 'ordenadores', gender: 'm' }, carros: { es: 'coches' }, celulares: { es: 'móviles' }, papas: { es: 'patatas' },
  boletos: { es: 'billetes' }, duraznos: { es: 'melocotones' }, departamentos: { es: 'pisos' }, jugos: { es: 'zumos' },
  saco: { es: 'chaqueta', gender: 'f' }, cuadra: { es: 'manzana' }, mesero: { es: 'camarero' }, mesera: { es: 'camarera' },
};
export const PENINSULAR_VERBS: Readonly<Record<string, string>> = { manejar: 'conducir', rentar: 'alquilar', extrañar: 'echar de menos' };

/** Peninsular variants of one sentence: each LatAm word swapped, with its
 *  article and an adjective right after it following a gender change. */
export function peninsularVariants(es: string, extra: Readonly<Record<string, string>> = {}): string[] {
  const ts = toToks(es);
  const swaps: Array<(t: Tok[]) => Tok[] | null> = [];
  ts.forEach((tok, i) => {
    const w = low(tok);
    const extraTo = extra[w];
    const n = PENINSULAR_NOUNS[w] ?? (extraTo ? { es: extraTo } : undefined);
    if (n) {
      swaps.push((t) => {
        let out = replaceCore(t, i, n.es);
        if (n.gender) {
          const det = low(out[i - 1]);
          const dg = det ? detGender(det) : null;
          if (det && dg && dg !== det) out = replaceCore(out, i - 1, dg);
          const adj = low(out[i + 1]);
          if (adj && /[oa]s?$/.test(adj) && !verbReadings(adj).length) {
            const og = otherGender(adj);
            if (og) out = replaceCore(out, i + 1, og);
          }
          // a predicate adjective agreeing with this noun as subject: "mi computadora es nueva"
          const after = out.slice(i + 1).map(low);
          const cop = after.findIndex((x) => verbReadings(x).some((a) => /^(ser|estar)$/.test(a.inf)));
          if (cop >= 0) {
            const k = i + 1 + cop + 1 + (after[cop + 1] === 'muy' ? 1 : 0);
            const pa = low(out[k]);
            if (pa && k === out.length - 1) { const og = otherGender(pa); if (og) out = replaceCore(out, k, og); }
          }
        }
        return out;
      });
      return;
    }
    // every reading of an ambiguous form (manejamos: present AND preterite)
    const forms = new Set<string>();
    for (const a of verbReadings(w)) {
      const to = PENINSULAR_VERBS[a.inf];
      if (!to || a.tense === 'imperativo') continue;
      const v = verbByInf(to.split(' ')[0]);
      if (!v) continue;
      const cell = conjugateBareCells(v, a.tense)[PERSONS.indexOf(a.person as Person)];
      if (cell) forms.add(cell.form + (to.includes(' ') ? ' ' + to.split(' ').slice(1).join(' ') : ''));
    }
    for (const f of forms) swaps.push((t) => replaceCore(t, i, f));
  });
  if (!swaps.length) return [];
  const out = new Set<string>();
  // every non-empty subset, up to three swaps (a learner may mix the two)
  const n = Math.min(swaps.length, 3);
  for (let mask = 1; mask < 1 << n; mask++) {
    let t: Tok[] | null = ts;
    for (let k = 0; k < n && t; k++) if (mask & (1 << k)) t = swaps[k](t);
    if (t) out.add(render(t));
  }
  return [...out];
}

// ---- "you" registers --------------------------------------------------------------

const OBJ_YOU: Readonly<Record<'usted' | 'ustedes', string[]>> = { usted: ['lo', 'la', 'le'], ustedes: ['los', 'las', 'les'] };

/** "You" forms that are not the subject: te (object), ti, contigo, tu, tuyo. */
function swapNonSubjectYou(ts: Tok[], to: 'usted' | 'ustedes', skip: Set<number>): Tok[][] {
  let outs: Tok[][] = [ts];
  ts.forEach((tok, i) => {
    if (skip.has(i)) return;
    const w = low(tok);
    let reps: string[] | null = null;
    if (w === 'te') reps = OBJ_YOU[to];
    else if (w === 'ti') reps = [to];
    else if (w === 'contigo') reps = [`con ${to}`];
    else if (w === 'tu') reps = ['su'];
    else if (w === 'tus') reps = ['sus'];
    else if (/^tuy[oa]s?$/.test(w)) reps = [w.replace(/^tuy/, 'suy')];
    if (!reps) return;
    const next: Tok[][] = [];
    for (const o of outs) for (const r of reps) next.push(replaceCore(o, i, r));
    outs = next;
  });
  return outs;
}

function vosotrosFrom(es: string, en: string): string | null {
  const c = parseClause(es, en);
  if (!c || c.choice.person !== 'ellos') return null;
  const v = verbByInf(c.choice.inf);
  if (!v) return null;
  const cell = conjugateBareCells(v, c.choice.tense)[PERSONS.indexOf('vosotros')];
  if (!cell) return null;
  let ts = replaceCore(c.toks, c.verb, cell.form);
  if (c.subject >= 0) ts = replaceCore(ts, c.subject, 'vosotros');
  if (c.reflexive) ts = replaceCore(ts, c.proclitics[c.proclitics.length - 1], 'os');
  ts.forEach((t, i) => { if (/^sus?$/.test(low(t))) ts = replaceCore(ts, i, low(t) === 'su' ? 'vuestro' : 'vuestros'); });
  return render(ts);
}

/** Every register variant of a model answer the English allows. */
export function registerVariants(es: string, en: string): Variant[] {
  const mode = enYou(en);
  if (mode === 'none') return [];
  const out: Variant[] = [];
  const c = parseClause(es, en);
  const wants: Array<'tú' | 'usted' | 'ustedes'> =
    mode === 'formal' ? ['usted'] : mode === 'informal' ? ['tú'] : mode === 'plural' ? ['ustedes'] : mode === 'singular' ? ['tú', 'usted'] : ['tú', 'usted', 'ustedes'];
  const subjectYou = c && (c.choice.person === 'tú' || (c.subject >= 0 && /^(usted|ustedes)$/.test(low(c.toks[c.subject]))));
  const fromReg: Register | null = !c ? null
    : c.choice.person === 'tú' ? 'tú'
    : c.subject >= 0 && low(c.toks[c.subject]) === 'usted' ? 'usted'
    : c.subject >= 0 && low(c.toks[c.subject]) === 'ustedes' ? 'ustedes'
    : mode === 'plural' && c.choice.person === 'ellos' ? 'ustedes'
    : null;
  if (c && subjectYou && fromReg) {
    for (const to of wants) {
      if (to === fromReg) continue;
      const person: Person = to === 'tú' ? 'tú' : to === 'usted' ? 'él/ella' : 'ellos';
      const r = changePerson(c, person, { en, pronoun: 'keep' });
      if (!r) continue;
      let ts = r.toks;
      if (c.subject >= 0) ts = replaceCore(ts, c.subject, to);
      const skip = new Set<number>(c.reflexive ? [c.proclitics[c.proclitics.length - 1]] : []);
      if (to === 'tú') { out.push({ es: render(ts), register: to }); continue; }
      for (const v of swapNonSubjectYou(ts, to, skip)) out.push({ es: render(v), register: to });
    }
    if (mode === 'open' || mode === 'plural') {
      const ustedesForm = fromReg === 'ustedes' ? es : out.find((o) => o.register === 'ustedes')?.es;
      const vos = ustedesForm ? vosotrosFrom(ustedesForm, en) : null;
      if (vos) out.push({ es: vos, register: 'vosotros', variant: 'peninsular' });
    }
  } else {
    // "you" is not the subject: te quiero, es para ti
    const ts = toToks(es);
    if (!ts.some((t) => /^(te|ti|contigo|tu|tus|tuyos?|tuyas?)$/.test(low(t)))) return [];
    if (c?.reflexive && c.choice.person === 'tú') return [];
    // with gustar & co. "te" is an indirect object: only le / les
    const dativeOnly = ts.some((t) => verbReadings(low(t)).some((a) => EXPERIENCER.has(a.inf)));
    for (const to of wants) {
      if (to === 'tú') continue;
      for (const v of swapNonSubjectYou(ts, to, new Set())) {
        if (dativeOnly && v.some((t, i) => low(ts[i]) === 'te' && !/^les?$/.test(low(t)))) continue;
        out.push({ es: render(v), register: to });
      }
    }
  }
  return out;
}

// ---- the speaker's / listener's gender ------------------------------------------

const EN_GENDERED = /\b(he|she|him|her|his|hers|himself|herself|boy|girl|man|woman|men|women|mother|father|son|daughter|brother|sister|husband|wife|boyfriend|girlfriend|mr|mrs|ms|sir|madam)\b/i;
const COPULA_LIKE = /^(ser|estar|sentirse|quedarse|ponerse)$/;

/** "Estoy cansado" for "I'm tired": the English does not say who is
 *  speaking, so "Estoy cansada" is just as right. Only for yo / tú /
 *  nosotros / ustedes with a predicate adjective, and only when the English
 *  carries no gender of its own. */
export function genderVariants(es: string, en: string): string[] {
  if (EN_GENDERED.test(en)) return [];
  const c = parseClause(es, en);
  if (!c || !COPULA_LIKE.test(c.choice.inf)) return [];
  const p = c.choice.person;
  const ustedes = c.subject >= 0 && /^(usted|ustedes)$/.test(low(c.toks[c.subject]));
  if (!(p === 'yo' || p === 'tú' || p === 'nosotros' || ustedes || (/\byou\b/i.test(en) && (p === 'él/ella' || p === 'ellos')))) return [];
  let ts = c.toks;
  let changed = false;
  for (let j = (c.participle >= 0 ? c.participle : c.verb) + 1; j < ts.length; j++) {
    const w = low(ts[j]);
    if (/^(muy|tan|bastante|un|poco|algo|más|menos)$/.test(w)) continue;
    const og = otherGender(w);
    if (!og || verbReadings(w).length) break;
    ts = replaceCore(ts, j, og);
    changed = true;
    if (ts[j].post) break;
  }
  if (!changed) return [];
  if (c.subject >= 0) {
    const sw: Record<string, string> = { nosotros: 'nosotras', nosotras: 'nosotros' };
    const pr = low(ts[c.subject]);
    if (sw[pr]) ts = replaceCore(ts, c.subject, sw[pr]);
  }
  return [render(ts)];
}

export interface ExpandOptions {
  /** Other Spanish the course accepts for this English (other bank sentences
   *  with the same English: the acceptFor idea from js/gameitems.js). */
  also?: readonly string[];
  /** Extra Peninsular full-sentence variants. */
  peninsular?: readonly string[];
  /** Extra LatAm → Peninsular word swaps (from a lexeme node's `peninsular`). */
  peninsularWords?: Readonly<Record<string, string>>;
}

/** Every accepted form of a sentence's Spanish, flagged. */
export function expandAccepted(s: { es: string; en: string; accept?: readonly string[] }, opts: ExpandOptions = {}): Variant[] {
  const seen = new Set<string>();
  const out: Variant[] = [];
  const add = (v: Variant) => {
    const k = v.es.toLowerCase().replace(/[^a-záéíóúñü ]/g, '').replace(/\s+/g, ' ').trim();
    if (!k || seen.has(k)) return;
    seen.add(k);
    out.push(v);
  };
  const base = [s.es, ...(s.accept ?? []), ...(opts.also ?? [])];
  base.forEach((es, i) => add({ es, ...(i === 0 ? { model: true } : {}) }));
  for (const es of base) for (const v of registerVariants(es, s.en)) add(v);
  for (const v of out.slice()) for (const g of genderVariants(v.es, s.en)) add({ ...v, es: g, model: false });
  for (const es of opts.peninsular ?? []) add({ es, variant: 'peninsular' });
  for (const v of out.slice()) {
    for (const p of peninsularVariants(v.es, opts.peninsularWords)) add({ es: p, variant: 'peninsular', ...(v.register ? { register: v.register } : {}) });
  }
  return out;
}
