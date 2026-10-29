/* ============================================================================
 * DIALECT LINT — keep production content neutral Latin American Spanish.
 *
 * The course teaches tú/ustedes and LatAm vocabulary; the story is set in
 * Colombia. The old content was Peninsular throughout (vosotros, coche,
 * ordenador, "Hoy he ido…"), and fast models drift back to it, so every
 * Spanish string a learner is asked to produce or read is linted here.
 *
 * Three kinds of finding:
 *   - verb forms: any vosotros form (incl. vosotros commands) and voseo, from
 *     the engine's own `variety` flag, with the ustedes / tú form as the fix;
 *   - pronouns/possessives: vosotros, os, vuestro, vos;
 *   - lexicon: DIALECT_LEXICON below, ~90 Spain-only (or Spain-flavoured)
 *     words with a LatAm replacement. Each entry says whether it is an ERROR
 *     (unambiguously Peninsular, or vulgar in LatAm: coger) or a WARNING
 *     (understood across LatAm, but not what a Colombian says: conducir,
 *     autobús, gafas), and a context test where the word is only Peninsular
 *     in one sense (piso as flat not floor, billete as ticket not banknote,
 *     vale as "OK" not "it costs", tío as "guy" not "uncle");
 *   - narration: the present perfect for a finished event earlier today
 *     ("Hoy he ido al mercado") is Peninsular; LatAm uses the preterite
 *     ("Hoy fui al mercado"). A WARNING, never an error: "he vivido aquí
 *     tres años" is fine everywhere.
 * ========================================================================== */
import { conjugate, PERSONS, IMP_PERSONS, verbByInf } from '../index';
import { analyzeWords, bareOf } from './words';
import type { Word } from './types';

export interface DialectFinding {
  severity: 'error' | 'warning';
  word: string;
  index: number;
  problem: string;
  fix: string;
  rule: string;
}

type Ctx = (w: Word[], i: number) => boolean;
export interface DialectEntry {
  /** Surface forms (lowercase); a space means a multi-token phrase. */
  forms: string[];
  /** Or: a verb lemma (matches every conjugated / non-finite form). */
  verb?: string;
  severity: 'error' | 'warning';
  fix: string;
  note?: string;
  when?: Ctx;
}

const prev = (w: Word[], i: number, n = 1) => w[i - n]?.w ?? '';
const nextW = (w: Word[], i: number, n = 1) => w[i + n]?.w ?? '';
const DETPOSS = new Set(['un', 'una', 'mi', 'tu', 'su', 'nuestro', 'nuestra', 'el', 'la', 'este', 'esta', 'ese', 'esa', 'del', 'al', 'mis', 'tus', 'sus', 'los', 'las', 'unos', 'unas']);
const afterDet: Ctx = (w, i) => DETPOSS.has(prev(w, i)) || w[i - 1]?.pos === 'adj';
const standalone: Ctx = (w, i) => (!w[i - 1] || w[i - 1].punct) && (!w[i + 1] || w[i + 1].punct);
const nounUse: Ctx = (w, i) => afterDet(w, i) || ['de', 'en', 'con', 'sin', 'para', 'por'].includes(prev(w, i));

export const DIALECT_LEXICON: DialectEntry[] = [
  // transport and the street
  { forms: ['coche', 'coches'], severity: 'error', fix: 'carro' },
  { forms: ['aparcar'], verb: 'aparcar', severity: 'error', fix: 'parquear / estacionar' },
  { forms: ['aparcamiento', 'aparcamientos'], severity: 'error', fix: 'parqueadero / estacionamiento' },
  { forms: [], verb: 'conducir', severity: 'warning', fix: 'manejar', note: 'conducir is understood, but LatAm drives with manejar' },
  { forms: ['carné de conducir', 'carnet de conducir'], severity: 'error', fix: 'licencia de conducción / licencia de manejo' },
  { forms: ['autobús', 'autobuses'], severity: 'warning', fix: 'bus (Colombia) / camión (México)' },
  { forms: ['atasco', 'atascos'], severity: 'warning', fix: 'trancón (Colombia) / tráfico / embotellamiento' },
  { forms: ['billete', 'billetes'], severity: 'warning', fix: 'tiquete / boleto / pasaje (a billete is a banknote in LatAm)',
    when: (w, i) => !/^(de|mil|pesos|dólares)$/.test(nextW(w, i)) || /^(avión|tren|bus|autobús|metro|ida|vuelta)$/.test(nextW(w, i, 2)) },
  { forms: ['maletero'], severity: 'error', fix: 'baúl (Colombia) / cajuela (México)' },
  { forms: ['gasolinera'], severity: 'warning', fix: 'bomba / estación de servicio (Colombia)' },
  { forms: ['acera'], severity: 'warning', fix: 'andén (Colombia) / banqueta (México) / vereda' },
  // technology
  { forms: ['ordenador', 'ordenadores'], severity: 'error', fix: 'computador / computadora' },
  { forms: ['móvil', 'móviles'], severity: 'error', fix: 'celular', when: (w, i) => nounUse(w, i) || prev(w, i) === 'teléfono' },
  { forms: ['portátil', 'portátiles'], severity: 'warning', fix: 'portátil is fine as an adjective; the noun is "el portátil / el computador portátil / el laptop"', when: afterDet },
  // food and drink
  { forms: ['zumo', 'zumos'], severity: 'error', fix: 'jugo' },
  { forms: ['patata', 'patatas'], severity: 'error', fix: 'papa' },
  { forms: ['melocotón', 'melocotones'], severity: 'error', fix: 'durazno' },
  { forms: ['albaricoque', 'albaricoques'], severity: 'warning', fix: 'durazno / albaricoque (rare in Colombia)' },
  { forms: ['gamba', 'gambas'], severity: 'error', fix: 'camarón / camarones' },
  { forms: ['judías', 'judía'], severity: 'error', fix: 'fríjoles (Colombia) / frijoles; judías verdes = habichuelas' },
  { forms: ['guisantes', 'guisante'], severity: 'error', fix: 'arvejas' },
  { forms: ['cacahuete', 'cacahuetes'], severity: 'error', fix: 'maní' },
  { forms: ['tarta', 'tartas'], severity: 'warning', fix: 'torta / pastel' },
  { forms: ['bocadillo', 'bocadillos'], severity: 'error', fix: 'sándwich (in Colombia a bocadillo is guava paste)' },
  { forms: ['pimiento', 'pimientos'], severity: 'warning', fix: 'pimentón (Colombia) / chile / pimiento' },
  { forms: ['frigorífico', 'frigoríficos'], severity: 'error', fix: 'nevera / refrigerador' },
  { forms: ['caña', 'cañas'], severity: 'warning', fix: 'cerveza / una fría (a caña is a draught beer only in Spain)', when: (w, i) => /^(de|unas|una|tomar|una)$/.test(prev(w, i)) || /cerveza/.test(nextW(w, i, 2)) },
  { forms: ['ir de cañas', 'ir de tapas'], severity: 'error', fix: 'tomar algo / salir a tomar unas cervezas' },
  { forms: ['me pones', 'ponme', 'póngame', 'me pone'], severity: 'warning', fix: '¿me da…? / ¿me regala…? (Colombia) / quisiera…', when: (w, i) => w.slice(i, i + 4).some((x) => ['un', 'una', 'dos', 'otro', 'otra', 'café', 'cerveza'].includes(x.w)) },
  { forms: ['hacer la compra'], severity: 'warning', fix: 'hacer mercado (Colombia) / hacer las compras' },
  // clothes and home
  { forms: ['gafas'], severity: 'warning', fix: 'gafas is fine in Colombia; lentes / anteojos elsewhere' },
  { forms: ['jersey', 'jerséis', 'jerseys'], severity: 'error', fix: 'suéter / saco (Colombia)' },
  { forms: ['americana'], severity: 'warning', fix: 'saco / blazer', when: afterDet },
  { forms: ['bañador', 'bañadores'], severity: 'error', fix: 'vestido de baño (Colombia) / traje de baño' },
  { forms: ['chándal'], severity: 'error', fix: 'sudadera' },
  { forms: ['vaqueros'], severity: 'warning', fix: 'jeans / bluyín', when: (w, i) => afterDet(w, i) || prev(w, i) === 'unos' },
  { forms: ['zapatillas de deporte'], severity: 'error', fix: 'tenis' },
  { forms: ['cazadora', 'cazadoras'], severity: 'error', fix: 'chaqueta' },
  { forms: ['piso', 'pisos'], severity: 'warning', fix: 'apartamento (piso = floor in LatAm)',
    when: (w, i) => /^(un|mi|tu|su|nuestro|este|ese)$/.test(prev(w, i)) && !/^(de|arriba|abajo)$/.test(nextW(w, i)) || nextW(w, i) === 'compartido' || /^(compartir|alquilar|comprar|buscar)$/.test(prev(w, i)) },
  { forms: ['grifo', 'grifos'], severity: 'error', fix: 'llave (del agua)' },
  { forms: ['fregona'], severity: 'error', fix: 'trapeador' },
  { forms: [], verb: 'fregar', severity: 'warning', fix: 'lavar (los platos) / trapear' },
  { forms: ['tirita', 'tiritas'], severity: 'error', fix: 'curita' },
  { forms: ['cerilla', 'cerillas'], severity: 'error', fix: 'fósforo' },
  { forms: ['mechero', 'mecheros'], severity: 'error', fix: 'encendedor' },
  { forms: ['bolígrafo', 'bolígrafos', 'boli'], severity: 'warning', fix: 'esfero (Colombia) / lapicero / pluma' },
  { forms: ['folio', 'folios'], severity: 'error', fix: 'hoja' },
  { forms: ['chubasquero'], severity: 'error', fix: 'impermeable' },
  // people and talk
  { forms: ['tío', 'tía', 'tíos', 'tías'], severity: 'error', fix: 'amigo / man / parcero (Colombia) — tío only for uncle',
    when: (w, i) => (prev(w, i) === ',' || nextW(w, i) === ',' || ['¡', '!'].includes(prev(w, i)) || ['!'].includes(nextW(w, i)) || /^(un|una|ese|esa|este|esta|qué)$/.test(prev(w, i))) && !/^(mi|tu|su|el|la|nuestro|nuestra)$/.test(prev(w, i)) && nextW(w, i) !== 'de' },
  { forms: ['chaval', 'chavala', 'chavales'], severity: 'error', fix: 'muchacho / pelado (Colombia) / chico' },
  { forms: ['majo', 'maja', 'majos', 'majas'], severity: 'error', fix: 'simpático / amable / buena gente' },
  { forms: ['guay', 'guays'], severity: 'error', fix: 'chévere / bacano (Colombia) / genial' },
  { forms: ['mola', 'molan', 'molaba', 'molar', 'mole'], severity: 'error', fix: 'me encanta / es chévere', when: (w, i) => w[i].w !== 'mole' || prev(w, i) === 'me' },
  { forms: ['vale'], severity: 'error', fix: 'está bien / de acuerdo / listo / dale', when: (w, i) => standalone(w, i) || prev(w, i) === '¿' || (w[i].sentStart && nextW(w, i) === ',') || (prev(w, i) === ',' && (!w[i + 1] || w[i + 1].punct)) },
  { forms: ['venga'], severity: 'warning', fix: 'dale / listo / vamos (as an interjection)', when: standalone },
  { forms: ['gilipollas'], severity: 'error', fix: 'idiota / tonto (avoid insults in course content)' },
  { forms: ['joder', 'hostia', 'hostias', 'coño'], severity: 'error', fix: 'avoid (Peninsular vulgarity); uy / caramba / qué pena' },
  { forms: ['ostras'], severity: 'error', fix: 'uy / caramba / ¡no puede ser!', when: standalone },
  { forms: ['mogollón'], severity: 'error', fix: 'un montón / muchísimo' },
  { forms: ['currar', 'curro', 'curra', 'curras', 'curramos', 'curran', 'curré', 'curró'], severity: 'error', fix: 'trabajar / el trabajo / la chamba' },
  { forms: ['pasta'], severity: 'warning', fix: 'plata (money)', when: (w, i) => /^(mucha|poca|la|tanta|sin)$/.test(prev(w, i)) && !/^(con|de)$/.test(nextW(w, i)) },
  { forms: ['flipar', 'flipo', 'flipas', 'flipa', 'flipé', 'flipante'], severity: 'error', fix: 'quedar impresionado / ¡qué impresionante!' },
  { forms: ['cabrearse', 'cabreado', 'cabreada', 'cabreo'], severity: 'error', fix: 'enojarse / ponerse bravo (Colombia)' },
  { forms: [], verb: 'enfadarse', severity: 'warning', fix: 'enojarse / ponerse bravo (Colombia)' },
  { forms: ['enfadado', 'enfadada', 'enfadados', 'enfadadas'], severity: 'warning', fix: 'enojado / bravo (Colombia)' },
  { forms: ['pijo', 'pija', 'pijos'], severity: 'error', fix: 'gomelo (Colombia) / fresa (México) / creído' },
  { forms: ['cotilla', 'cotillas'], severity: 'error', fix: 'chismoso' },
  { forms: ['cotillear', 'cotilleo'], severity: 'error', fix: 'chismear / el chisme' },
  { forms: ['pillar', 'pillo', 'pillé', 'pilla'], severity: 'warning', fix: 'agarrar / entender / alcanzar' },
  { forms: ['chulo', 'chula', 'chulos', 'chulas'], severity: 'warning', fix: 'chévere / bonito / lindo' },
  { forms: ['mono', 'mona', 'monos', 'monas'], severity: 'warning', fix: 'lindo / bonito (mono = monkey; in Colombia mono = blond)', when: (w, i) => /^(qué|muy|tan|más)$/.test(prev(w, i)) },
  { forms: ['qué fuerte'], severity: 'warning', fix: '¡qué impresionante! / ¡no puede ser!', when: (w, i) => !w[i + 2] || w[i + 2].punct },
  { forms: ['enhorabuena'], severity: 'warning', fix: 'felicitaciones / felicidades' },
  { forms: ['echar de menos'], severity: 'warning', fix: 'extrañar' },
  { forms: [], verb: 'apetecer', severity: 'warning', fix: 'provocar (Colombia) / tener ganas de / antojarse' },
  { forms: [], verb: 'coger', severity: 'error', fix: 'tomar / agarrar (coger is vulgar in much of LatAm)' },
  { forms: [], verb: 'molar', severity: 'error', fix: 'gustar / encantar' },
  // school and work
  { forms: ['instituto'], severity: 'warning', fix: 'colegio', when: (w, i) => afterDet(w, i) || prev(w, i) === 'en' },
  { forms: ['deberes'], severity: 'warning', fix: 'tareas', when: (w, i) => /^(los|mis|tus|sus|hacer|de)$/.test(prev(w, i)) },
  { forms: ['suspender', 'suspendí', 'suspendió', 'suspendo', 'suspenso', 'suspensos'], severity: 'warning', fix: 'perder / reprobar (un examen)', when: (w, i) => w.slice(i, i + 4).some((x) => /examen|asignatura|materia|curso/.test(x.w)) || w[i].w.startsWith('suspenso') },
  { forms: ['camarero', 'camarera', 'camareros', 'camareras'], severity: 'warning', fix: 'mesero / mesera' },
  { forms: ['fontanero', 'fontanera', 'fontaneros'], severity: 'error', fix: 'plomero' },
  { forms: ['aseos', 'aseo'], severity: 'warning', fix: 'baño(s)', when: afterDet },
  { forms: ['el paro'], severity: 'warning', fix: 'el desempleo (paro = strike in Colombia)', when: (w, i) => /^(en|del|al)$/.test(prev(w, i)) || /^(está|estoy|estás|están)$/.test(prev(w, i, 2)) },
  { forms: ['parado', 'parada', 'parados'], severity: 'warning', fix: 'desempleado (parado = standing in LatAm)', when: (w, i) => /^(está|estoy|estás|están|estaba)$/.test(prev(w, i)) && /trabajo|empleo/.test(w.slice(i, i + 4).map((x) => x.w).join(' ')) },
  { forms: ['ordenador portátil'], severity: 'error', fix: 'computador portátil / laptop' },
  { forms: ['vacaciones de verano'], severity: 'warning', fix: 'vacaciones de mitad de año (Colombia has no summer)' },
];

/** Index lexicon entries by first token for speed. */
const BY_FIRST = new Map<string, DialectEntry[]>();
const BY_VERB = new Map<string, DialectEntry>();
for (const e of DIALECT_LEXICON) {
  for (const f of e.forms) { const k = f.split(' ')[0]; const l = BY_FIRST.get(k); if (l) l.push(e); else BY_FIRST.set(k, [e]); }
  if (e.verb) BY_VERB.set(e.verb, e);
}

const SAME_DAY = /\b(hoy|esta mañana|esta tarde|esta noche|este mediodía|hace un rato|hace poco|hace unos minutos|hace una hora|ahorita)\b/;

function ustedesForm(inf: string, tense: string): string | null {
  try {
    const v = verbByInf(inf) ?? verbByInf(bareOf(inf));
    if (!v) return null;
    if (tense === 'imperativo') return conjugate(v, 'imperativo')[IMP_PERSONS.indexOf('ustedes')];
    return conjugate(v, tense as never)[PERSONS.indexOf('ellos')];
  } catch { return null; }
}
function tuForm(inf: string, tense: string): string | null {
  try {
    const v = verbByInf(inf) ?? verbByInf(bareOf(inf));
    if (!v) return null;
    if (tense === 'imperativo') return conjugate(v, 'imperativo')[0];
    return conjugate(v, tense as never)[PERSONS.indexOf('tú')];
  } catch { return null; }
}

/** Lint one sentence/text. Pass `words` when the caller has already tagged it. */
export function dialectLint(text: string, words: Word[] = analyzeWords(text)): DialectFinding[] {
  const out: DialectFinding[] = [];
  const push = (f: DialectFinding) => out.push(f);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.punct || w.pos === 'propn') continue;
    // vosotros / voseo pronouns and possessives
    if (w.w === 'vosotros' || w.w === 'vosotras') push({ severity: 'error', word: w.text, index: i, rule: 'vosotros', problem: 'vosotros (Spain only)', fix: 'ustedes' });
    else if (w.w === 'os' && (w.pos === 'clitic' || words[i + 1]?.pos === 'verb')) push({ severity: 'error', word: w.text, index: i, rule: 'vosotros', problem: '"os" (vosotros pronoun, Spain only)', fix: 'les / los / se (ustedes)' });
    else if (/^vuestr[oa]s?$/.test(w.w)) push({ severity: 'error', word: w.text, index: i, rule: 'vosotros', problem: `"${w.w}" (vosotros possessive)`, fix: 'su / sus (de ustedes)' });
    else if (w.w === 'vos' && !w.capMid) push({ severity: 'error', word: w.text, index: i, rule: 'voseo', problem: '"vos" (voseo)', fix: 'tú' });
    // verb forms: the engine's variety flag
    if ((w.pos === 'verb') && w.verb?.length && w.verb.every((a) => a.variety)) {
      const a = w.verb[0];
      if (a.variety === 'vosotros') {
        const fix = ustedesForm(a.inf, a.tense);
        push({ severity: 'error', word: w.text, index: i, rule: 'vosotros', problem: `"${w.text}" is a vosotros form (${a.inf}, ${a.tense})`, fix: fix ? `ustedes: "${fix}"` : 'use the ustedes form' });
      } else if (a.variety === 'voseo') {
        const fix = tuForm(a.inf, a.tense);
        push({ severity: 'error', word: w.text, index: i, rule: 'voseo', problem: `"${w.text}" is voseo (${a.inf})`, fix: fix ? `tú: "${fix}"` : 'use the tú form' });
      }
    }
    // lexicon: verbs by lemma
    if (['verb', 'inf', 'ger', 'part'].includes(w.pos)) {
      const infs = new Set([w.lemma, bareOf(w.lemma), ...(w.verb ?? []).map((a) => a.inf), ...(w.verb ?? []).map((a) => bareOf(a.inf))]);
      for (const inf of infs) {
        const e = BY_VERB.get(inf);
        if (e && (!e.when || e.when(words, i))) {
          push({ severity: e.severity, word: w.text, index: i, rule: 'lexicon', problem: `"${w.text}" (${inf}) is Peninsular${e.note ? ` — ${e.note}` : ''}`, fix: e.fix });
          break;
        }
      }
    }
    // lexicon: surface forms and phrases
    for (const e of BY_FIRST.get(w.w) ?? []) {
      for (const f of e.forms) {
        const toks = f.split(' ');
        if (toks[0] !== w.w) continue;
        if (!toks.every((t, k) => words[i + k]?.w === t)) continue;
        if (e.when && !e.when(words, i)) continue;
        if (e.verb && ['verb', 'inf', 'ger', 'part'].includes(w.pos)) continue;   // already reported by lemma
        push({ severity: e.severity, word: toks.map((_, k) => words[i + k].text).join(' '), index: i, rule: 'lexicon', problem: `"${f}" is Peninsular${e.note ? ` — ${e.note}` : ''}`, fix: e.fix });
      }
    }
  }
  // perfecto for a finished event earlier today
  const lower = words.map((w) => w.w).join(' ');
  if (SAME_DAY.test(lower)) {
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (w.aux !== 'haber' || !w.verb?.some((a) => a.tense === 'presente' && a.inf === 'haber')) continue;
      const p = words.findIndex((x) => x.compoundOf === i);
      if (p < 0) continue;
      const person = w.verb.find((a) => a.inf === 'haber' && a.tense === 'presente')!.person;
      let fix = 'use the preterite';
      try {
        const v = verbByInf(words[p].lemma);
        if (v) fix = `preterite: "${conjugate(v, 'preterito')[PERSONS.indexOf(person as never)]}"`;
      } catch { /* keep generic */ }
      push({ severity: 'warning', word: `${w.text} ${words[p].text}`, index: i, rule: 'perfecto-hoy', problem: `"${w.text} ${words[p].text}" with a same-day time: LatAm narrates finished events in the preterite`, fix });
    }
  }
  return out;
}
