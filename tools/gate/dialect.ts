/* Dialect lexicon, copied from app/src/engine/tagger/dialect.ts (word list and fixes; the
 * context tests are reduced to what a plain token window can see, with no part-of-speech tags). */
export interface W { w: string; text: string; punct: boolean; sentStart: boolean }
type Ctx = (w: W[], i: number) => boolean;
export interface DialectEntry { forms: string[]; verb?: string; severity: 'error' | 'warning'; fix: string; when?: Ctx }

const prev = (w: W[], i: number, n = 1) => w[i - n]?.w ?? '';
const nextW = (w: W[], i: number, n = 1) => w[i + n]?.w ?? '';
const DETPOSS = new Set(['un', 'una', 'mi', 'tu', 'su', 'nuestro', 'nuestra', 'el', 'la', 'este', 'esta', 'ese', 'esa', 'del', 'al', 'mis', 'tus', 'sus', 'los', 'las', 'unos', 'unas']);
const afterDet: Ctx = (w, i) => DETPOSS.has(prev(w, i));
const standalone: Ctx = (w, i) => (!w[i - 1] || w[i - 1].punct) && (!w[i + 1] || w[i + 1].punct);
const nounUse: Ctx = (w, i) => afterDet(w, i) || ['de', 'en', 'con', 'sin', 'para', 'por'].includes(prev(w, i));

export function tokenizeWords(text: string): W[] {
  const out: W[] = [];
  for (const m of text.matchAll(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu)) {
    const t = m[0];
    const punct = !/[\p{L}\p{N}]/u.test(t);
    const p = out[out.length - 1];
    out.push({ w: t.toLowerCase(), text: t, punct, sentStart: !p || (p.punct && /[.?!¿¡…—]/.test(p.text)) });
  }
  return out;
}

export const DIALECT_LEXICON: DialectEntry[] = [
  { forms: ['coche', 'coches'], severity: 'error', fix: 'carro' },
  { forms: ['aparcar'], verb: 'aparcar', severity: 'error', fix: 'parquear / estacionar' },
  { forms: ['aparcamiento', 'aparcamientos'], severity: 'error', fix: 'parqueadero / estacionamiento' },
  { forms: [], verb: 'conducir', severity: 'warning', fix: 'manejar' },
  { forms: ['carné de conducir', 'carnet de conducir'], severity: 'error', fix: 'licencia de conducción' },
  { forms: ['autobús', 'autobuses'], severity: 'warning', fix: 'bus (Colombia) / camión (México)' },
  { forms: ['atasco', 'atascos'], severity: 'warning', fix: 'trancón / tráfico / embotellamiento' },
  { forms: ['billete', 'billetes'], severity: 'warning', fix: 'tiquete / boleto / pasaje',
    when: (w, i) => !/^(de|mil|pesos|dólares)$/.test(nextW(w, i)) || /^(avión|tren|bus|autobús|metro|ida|vuelta)$/.test(nextW(w, i, 2)) },
  { forms: ['maletero'], severity: 'error', fix: 'baúl (Colombia) / cajuela (México)' },
  { forms: ['gasolinera'], severity: 'warning', fix: 'bomba / estación de servicio' },
  { forms: ['acera'], severity: 'warning', fix: 'andén / banqueta / vereda' },
  { forms: ['ordenador', 'ordenadores'], severity: 'error', fix: 'computador / computadora' },
  { forms: ['móvil', 'móviles'], severity: 'error', fix: 'celular', when: (w, i) => nounUse(w, i) || prev(w, i) === 'teléfono' },
  { forms: ['portátil', 'portátiles'], severity: 'warning', fix: 'el computador portátil / el laptop', when: afterDet },
  { forms: ['zumo', 'zumos'], severity: 'error', fix: 'jugo' },
  { forms: ['patata', 'patatas'], severity: 'error', fix: 'papa' },
  { forms: ['melocotón', 'melocotones'], severity: 'error', fix: 'durazno' },
  { forms: ['albaricoque', 'albaricoques'], severity: 'warning', fix: 'durazno / albaricoque' },
  { forms: ['gamba', 'gambas'], severity: 'error', fix: 'camarón / camarones' },
  { forms: ['judías', 'judía'], severity: 'error', fix: 'fríjoles / frijoles; judías verdes = habichuelas' },
  { forms: ['guisantes', 'guisante'], severity: 'error', fix: 'arvejas' },
  { forms: ['cacahuete', 'cacahuetes'], severity: 'error', fix: 'maní' },
  { forms: ['tarta', 'tartas'], severity: 'warning', fix: 'torta / pastel' },
  { forms: ['bocadillo', 'bocadillos'], severity: 'error', fix: 'sándwich' },
  { forms: ['pimiento', 'pimientos'], severity: 'warning', fix: 'pimentón / chile / pimiento' },
  { forms: ['frigorífico', 'frigoríficos'], severity: 'error', fix: 'nevera / refrigerador' },
  { forms: ['caña', 'cañas'], severity: 'warning', fix: 'cerveza / una fría', when: (w, i) => /^(de|unas|una|tomar)$/.test(prev(w, i)) || /cerveza/.test(nextW(w, i, 2)) },
  { forms: ['ir de cañas', 'ir de tapas'], severity: 'error', fix: 'tomar algo / salir a tomar unas cervezas' },
  { forms: ['me pones', 'ponme', 'póngame', 'me pone'], severity: 'warning', fix: '¿me da…? / ¿me regala…? / quisiera…', when: (w, i) => w.slice(i, i + 4).some((x) => ['un', 'una', 'dos', 'otro', 'otra', 'café', 'cerveza'].includes(x.w)) },
  { forms: ['hacer la compra'], severity: 'warning', fix: 'hacer mercado / hacer las compras' },
  { forms: ['gafas'], severity: 'warning', fix: 'gafas is fine in Colombia; lentes / anteojos elsewhere' },
  { forms: ['jersey', 'jerséis', 'jerseys'], severity: 'error', fix: 'suéter / saco' },
  { forms: ['americana'], severity: 'warning', fix: 'saco / blazer', when: afterDet },
  { forms: ['bañador', 'bañadores'], severity: 'error', fix: 'vestido de baño / traje de baño' },
  { forms: ['chándal'], severity: 'error', fix: 'sudadera' },
  { forms: ['vaqueros'], severity: 'warning', fix: 'jeans / bluyín', when: afterDet },
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
  { forms: ['bolígrafo', 'bolígrafos', 'boli'], severity: 'warning', fix: 'esfero / lapicero / pluma' },
  { forms: ['folio', 'folios'], severity: 'error', fix: 'hoja' },
  { forms: ['chubasquero'], severity: 'error', fix: 'impermeable' },
  { forms: ['tío', 'tía', 'tíos', 'tías'], severity: 'error', fix: 'amigo / man / parcero; tío only for uncle',
    when: (w, i) => (prev(w, i) === ',' || nextW(w, i) === ',' || ['¡', '!'].includes(prev(w, i)) || ['!'].includes(nextW(w, i)) || /^(un|una|ese|esa|este|esta|qué)$/.test(prev(w, i))) && !/^(mi|tu|su|el|la|nuestro|nuestra)$/.test(prev(w, i)) && nextW(w, i) !== 'de' },
  { forms: ['chaval', 'chavala', 'chavales'], severity: 'error', fix: 'muchacho / pelado / chico' },
  { forms: ['majo', 'maja', 'majos', 'majas'], severity: 'error', fix: 'simpático / amable / buena gente' },
  { forms: ['guay', 'guays'], severity: 'error', fix: 'chévere / bacano / genial' },
  { forms: ['mola', 'molan', 'molaba', 'molar', 'mole'], severity: 'error', fix: 'me encanta / es chévere', when: (w, i) => w[i].w !== 'mole' || prev(w, i) === 'me' },
  { forms: ['vale'], severity: 'error', fix: 'está bien / de acuerdo / listo / dale', when: (w, i) => standalone(w, i) || prev(w, i) === '¿' || (w[i].sentStart && nextW(w, i) === ',') || (prev(w, i) === ',' && (!w[i + 1] || w[i + 1].punct)) },
  { forms: ['venga'], severity: 'warning', fix: 'dale / listo / vamos (as an interjection)', when: standalone },
  { forms: ['gilipollas'], severity: 'error', fix: 'idiota / tonto' },
  { forms: ['joder', 'hostia', 'hostias', 'coño'], severity: 'error', fix: 'avoid (Peninsular vulgarity)' },
  { forms: ['ostras'], severity: 'error', fix: 'uy / caramba', when: standalone },
  { forms: ['mogollón'], severity: 'error', fix: 'un montón / muchísimo' },
  { forms: ['currar', 'curro', 'curra', 'curras', 'curramos', 'curran', 'curré', 'curró'], severity: 'error', fix: 'trabajar / el trabajo / la chamba' },
  { forms: ['pasta'], severity: 'warning', fix: 'plata (money)', when: (w, i) => /^(mucha|poca|la|tanta|sin)$/.test(prev(w, i)) && !/^(con|de)$/.test(nextW(w, i)) },
  { forms: ['flipar', 'flipo', 'flipas', 'flipa', 'flipé', 'flipante'], severity: 'error', fix: 'quedar impresionado' },
  { forms: ['cabrearse', 'cabreado', 'cabreada', 'cabreo'], severity: 'error', fix: 'enojarse / ponerse bravo' },
  { forms: [], verb: 'enfadarse', severity: 'warning', fix: 'enojarse / ponerse bravo' },
  { forms: ['enfadado', 'enfadada', 'enfadados', 'enfadadas'], severity: 'warning', fix: 'enojado / bravo' },
  { forms: ['pijo', 'pija', 'pijos'], severity: 'error', fix: 'gomelo / fresa / creído' },
  { forms: ['cotilla', 'cotillas'], severity: 'error', fix: 'chismoso' },
  { forms: ['cotillear', 'cotilleo'], severity: 'error', fix: 'chismear / el chisme' },
  { forms: ['pillar', 'pillo', 'pillé', 'pilla'], severity: 'warning', fix: 'agarrar / entender / alcanzar' },
  { forms: ['chulo', 'chula', 'chulos', 'chulas'], severity: 'warning', fix: 'chévere / bonito / lindo' },
  { forms: ['mono', 'mona', 'monos', 'monas'], severity: 'warning', fix: 'lindo / bonito', when: (w, i) => /^(qué|muy|tan|más)$/.test(prev(w, i)) },
  { forms: ['qué fuerte'], severity: 'warning', fix: '¡qué impresionante! / ¡no puede ser!', when: (w, i) => !w[i + 2] || w[i + 2].punct },
  { forms: ['enhorabuena'], severity: 'warning', fix: 'felicitaciones / felicidades' },
  { forms: ['echar de menos'], severity: 'warning', fix: 'extrañar' },
  { forms: [], verb: 'apetecer', severity: 'warning', fix: 'provocar / tener ganas de / antojarse' },
  { forms: [], verb: 'coger', severity: 'error', fix: 'tomar / agarrar (coger is vulgar in much of LatAm)' },
  { forms: [], verb: 'molar', severity: 'error', fix: 'gustar / encantar' },
  { forms: ['instituto'], severity: 'warning', fix: 'colegio', when: (w, i) => afterDet(w, i) || prev(w, i) === 'en' },
  { forms: ['deberes'], severity: 'warning', fix: 'tareas', when: (w, i) => /^(los|mis|tus|sus|hacer|de)$/.test(prev(w, i)) },
  { forms: ['suspender', 'suspendí', 'suspendió', 'suspendo', 'suspenso', 'suspensos'], severity: 'warning', fix: 'perder / reprobar (un examen)', when: (w, i) => w.slice(i, i + 4).some((x) => /examen|asignatura|materia|curso/.test(x.w)) || w[i].w.startsWith('suspenso') },
  { forms: ['camarero', 'camarera', 'camareros', 'camareras'], severity: 'warning', fix: 'mesero / mesera' },
  { forms: ['fontanero', 'fontanera', 'fontaneros'], severity: 'error', fix: 'plomero' },
  { forms: ['aseos', 'aseo'], severity: 'warning', fix: 'baño(s)', when: afterDet },
  { forms: ['el paro'], severity: 'warning', fix: 'el desempleo', when: (w, i) => /^(en|del|al)$/.test(prev(w, i)) || /^(está|estoy|estás|están)$/.test(prev(w, i, 2)) },
  { forms: ['parado', 'parada', 'parados'], severity: 'warning', fix: 'desempleado', when: (w, i) => /^(está|estoy|estás|están|estaba)$/.test(prev(w, i)) && /trabajo|empleo/.test(w.slice(i, i + 4).map((x) => x.w).join(' ')) },
  { forms: ['ordenador portátil'], severity: 'error', fix: 'computador portátil / laptop' },
  { forms: ['vacaciones de verano'], severity: 'warning', fix: 'vacaciones de mitad de año (Colombia has no summer)' },
];

export const BY_FIRST = new Map<string, DialectEntry[]>();
export const BY_VERB = new Map<string, DialectEntry>();
for (const e of DIALECT_LEXICON) {
  for (const f of e.forms) { const k = f.split(' ')[0]; const l = BY_FIRST.get(k); if (l) l.push(e); else BY_FIRST.set(k, [e]); }
  if (e.verb) BY_VERB.set(e.verb, e);
}
