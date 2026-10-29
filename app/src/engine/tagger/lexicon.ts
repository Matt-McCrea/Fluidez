/* ============================================================================
 * LEXICON — closed classes, the open-class lexicon and a small lemmatiser.
 *
 * Verbs never come from here: the engine is the authority on every
 * conjugated form (src/engine/analyze.ts). This file knows the words the
 * engine does not: articles, prepositions, pronouns, nouns and adjectives.
 *
 * Open-class sources, in order of trust:
 *   1. CORE below: hand-written high-frequency LatAm words with POS. The old
 *      data/vocab.js is PCIC-themed and Peninsular — it has "el ordenador"
 *      but not "alto" — so the everyday adjectives and the Colombian
 *      everyday nouns (carro, celular, jugo, plata) are listed here.
 *   2. data/lexicon.json, built from data/vocab.js (tools/gate/build-lexicon.ts).
 *   3. Lexemes registered at runtime from content (registerLexemes).
 *   4. data/forms.json: every word form of vocab.js and the PCIC examples,
 *      used ONLY to say "this is a real word" (no POS) and to let the
 *      lemmatiser strip a plural.
 * ========================================================================== */
import lexJson from './data/lexicon.json';
import formsJson from './data/forms.json';
import { deaccent } from '../ortho';
import type { Pos } from './types';

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));

export const ARTICLES = set('el la los las un una unos unas');
export const CONTRACTIONS = set('al del');
export const POSSESSIVES = set(`mi mis tu tus su sus nuestro nuestra nuestros nuestras vuestro vuestra vuestros vuestras
  mío mía míos mías tuyo tuya tuyos tuyas suyo suya suyos suyas`);
export const DEMONSTRATIVES = set('este esta estos estas ese esa esos esas aquel aquella aquellos aquellas');
export const DEM_PRONOUNS = set('esto eso aquello');
export const QUANTIFIERS = set(`mucho mucha muchos muchas poco poca pocos pocas todo toda todos todas otro otra otros otras
  cada varios varias algún alguno alguna algunos algunas ningún ninguno ninguna demasiado demasiada demasiados demasiadas
  bastante bastantes tanto tanta tantos tantas mismo misma mismos mismas cualquier cualquiera ambos ambas cierto cierta
  ciertos ciertas medio media tal tales unos unas`);
export const NUMBERS = set(`uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis
  diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete
  veintiocho veintinueve treinta cuarenta cincuenta sesenta setenta ochenta noventa cien ciento doscientos doscientas
  trescientos quinientos mil millón millones primer primero primera primeros primeras segundo segunda tercer tercero
  tercera cuarto cuarta quinto quinta último última últimos últimas`);
export const SUBJECT_PRONOUNS = set('yo tú él ella usted nosotros nosotras ellos ellas ustedes vosotros vosotras vos');
export const TONIC_PRONOUNS = set('mí ti sí conmigo contigo consigo');
export const CLITICS = set('me te se nos os lo la los las le les');
export const PREPOSITIONS = set(`a ante bajo con contra de desde durante en entre hacia hasta mediante para por según sin
  sobre tras excepto salvo incluso`);
export const CONJUNCTIONS = set('y e o u ni pero sino que porque aunque si cuando mientras como pues');
export const INTERROGATIVES = set('qué quién quiénes dónde adónde cuándo cómo cuánto cuánta cuántos cuántas cuál cuáles');
export const RELATIVES = set('que quien quienes donde adonde cual cuales cuyo cuya cuyos cuyas cuanto');
export const NEGATIVES = set('no nunca jamás tampoco nada nadie ninguno ninguna ningún');
export const INDEF_PRONOUNS = set('algo alguien nada nadie todo todos todas cualquiera');
export const INTERJECTIONS = set('hola adiós chao chau gracias ay oh eh uy ah ojalá sí ok okey uf guau');
export const ADVERBS = set(`muy más menos bien mal ya también tampoco siempre aquí allí ahí acá allá hoy ayer mañana ahora
  antes después luego todavía aún aun casi solo sólo tan tanto mucho poco bastante demasiado nunca jamás pronto tarde
  temprano entonces quizá quizás acaso además apenas despacio deprisa rápido arriba abajo cerca lejos dentro fuera afuera
  adentro encima debajo delante detrás enfrente atrás adelante anoche anteayer pasado así igual mejor peor mientras
  todavía incluso sobre_todo justo recién enseguida juntos juntas solamente seguramente realmente claro`);

/** Words whose primary reading is a function word even though the engine
 *  finds a verb in them (como = comer, para = parar, sobre = sobrar, entre
 *  = entrar, bajo = bajar, nada = nadar). The verb reading needs evidence. */
export const FUNCTION_HOMOGRAPHS = set(`como para sobre entre bajo nada mientras contra cerca medio claro cierto solo
  vale casi junto ante tras pasado seguro listo libre único`);

/* NOUN HOMOGRAPHS (ported from tools/lib/tense-scan.js, which earned them one
 * collision at a time). Noun only where a noun sits. */
export const NOUN_HOMOGRAPHS = set(`trabajo cena cambio viaje río ayuda parte partes cocina estudio desayuno vista recibo
  camino compra diseño pregunta preguntas gasto programa programas contrato negocio traje ducha recuerdo baño firma paso
  cuenta gusto metas despido sueño vuelo muestra paseo llamada visita respuesta comida bebida salida entrada parada
  llegada subida bajada apoyo duda falta juego lucha marcha nota pena prueba regalo reserva saludo vuelta reparto aumento
  ahorro consumo reforma demanda oferta reparo peso gobierno mando cargo encuentro fomento rechazo soluciones funciones
  proyecto casa centro queja proceso marca medio medios género artículo artículos público práctico práctica ópera
  ampliación estudios contratos negocios cambios viajes cosa cosas nieve alegre informe tema muela trámite sal sed vino
  sobre bajo carta canto cuento cocinas compras llamadas plato vaso mesa mano clase obra fin color calor café lleno
  limpio libre cambio pago envío orden olvido abrazo beso grito cuido descanso desarrollo intento cierre uso trato
  aviso viaje ruido baile camino cura dibujo ensayo charla siesta pelea cola copia multa critica pinta tapa carga
  espera cuesta vela venta alquiler mira manda parece ama amo cura llave hielo don papa vino`);

export const DETERMINER_LIKE = new Set([...ARTICLES, ...CONTRACTIONS, ...POSSESSIVES, ...DEMONSTRATIVES,
  'cada', 'otro', 'otra', 'otros', 'otras', 'mucho', 'mucha', 'muchos', 'muchas', 'poco', 'poca', 'pocos', 'pocas',
  'algún', 'alguna', 'algunos', 'algunas', 'ningún', 'ninguna', 'varios', 'varias', 'buen', 'buena', 'mal', 'gran',
  'primer', 'primera', 'tercer', 'último', 'última', 'nuevo', 'nueva', 'mismo', 'misma', 'demasiado', 'demasiada',
  'tanto', 'tanta', 'tantos', 'tantas', 'qué', 'cuánto', 'cuánta', 'cuántos', 'cuántas', 'dos', 'tres', 'cuatro']);

/* ---- CORE open-class words (LatAm, high frequency) ------------------------
 * a: adjective (masc. sg. lemma; feminine/plural forms lemmatise to it)
 * n:m / n:f / n:mf: noun with gender
 * d: adverb / other */
const CORE_ADJ = `alto bajo grande pequeño bueno malo nuevo viejo joven mayor menor mejor peor bonito lindo feo largo corto
  ancho estrecho gordo delgado flaco fuerte débil rápido lento fácil difícil caro barato rico pobre feliz triste contento
  cansado enfermo sano ocupado libre listo tranquilo nervioso aburrido divertido interesante importante necesario posible
  imposible probable seguro inseguro claro oscuro limpio sucio lleno vacío abierto cerrado caliente frío fresco tibio
  rojo azul verde amarillo blanco negro gris morado rosado café naranja marrón primero segundo último próximo pasado
  siguiente anterior simpático antipático amable chévere bacano raro normal extraño increíble terrible horrible genial
  perfecto excelente fantástico maravilloso precioso hermoso guapo serio alegre loco tonto inteligente listo amable
  tímido valiente orgulloso preocupado enojado bravo sorprendido emocionado asustado enamorado casado soltero
  divorciado separado viudo colombiano mexicano español inglés francés alemán americano latino caleño bogotano paisa
  costeño solo junto mismo propio cierto verdadero falso real público privado social político económico personal
  famoso popular moderno antiguo tradicional típico local nacional internacional principal general especial diferente
  igual parecido distinto mejor útil inútil agradable desagradable cómodo incómodo peligroso dulce salado amargo
  picante delicioso sabroso rico duro blando suave pesado ligero liviano lejano cercano diario semanal mensual anual
  único último entero medio doble húmedo seco soleado nublado lluvioso tropical cálido templado verde maduro crudo
  cocido frito asado mojado roto perdido preparado sentado parado acostado dormido despierto vivo muerto embarazada
  responsable puntual educado grosero callado hablador trabajador perezoso juicioso sencillo complicado fácil sano
  cariñoso celoso generoso tacaño honesto sincero mentiroso curioso feliz infeliz satisfecho harto agotado relajado
  estresado ansioso deprimido animado entusiasmado capaz incapaz digno exacto rápido actual reciente`;
const CORE_NOUN_M = `costo arriendo trancón parcero celular carro computador apartamento bus jugo durazno parqueadero tiquete boleto mesero almuerzo
  desayuno día mes año fin momento rato tiempo lugar sitio barrio pueblo país mundo centro parque mercado
  supermercado restaurante hotel aeropuerto hospital colegio trabajo dinero peso precio problema tema sistema mapa
  idioma español inglés papá hermano hijo abuelo tío primo amigo novio esposo señor hombre niño chico muchacho pelado
  compañero jefe vecino profesor estudiante doctor médico perro gato libro cuaderno lápiz esfero teléfono correo
  mensaje nombre apellido número cumpleaños regalo café té arroz pollo pescado huevo pan queso helado vino
  baño cuarto piso techo edificio balcón patio jardín cielo sol mar río lago viento frío calor invierno verano
  fútbol partido equipo juego deporte gimnasio cine teatro concierto museo viaje paseo pasaje tren avión metro taxi
  camino semáforo carro trancón tráfico tráfico cuerpo brazo pie ojo pelo corazón dolor estómago miedo sueño
  plan proyecto examen trabajo salario sueldo negocio banco cajero billete arepa tinto aguacate plátano banano
  video chofer coctel mijo parce fríjol maíz mango ajiaco sancocho bocadillo chocolate dulce postre vaso plato tenedor cuchillo almacén`;
const CORE_NOUN_F = `mija agua hambre casa calle ciudad plaza tienda oficina universidad escuela clase mamá madre hermana hija abuela tía
  prima amiga novia esposa señora mujer niña chica muchacha familia gente persona vida noche tarde mañana semana hora
  vez comida cena bebida agua leche carne fruta verdura papa sopa ensalada cerveza gaseosa torta mesa silla cama
  puerta ventana cocina sala nevera ducha llave ropa camisa camiseta falda chaqueta chompa ruana bolsa maleta plata
  cuenta palabra pregunta respuesta idea verdad mentira historia noticia película música canción fiesta playa montaña
  finca isla selva lluvia nube cabeza mano boca cara nariz espalda pierna salud fiebre gripa farmacia droguería
  medicina cita reunión tarea nota carrera empresa compañía tarjeta moneda factura cuenta foto cámara computadora
  red página aplicación contraseña clave buseta moto bicicleta estación parada esquina cuadra carrera calle avenida
  arepa empanada natilla buñuelo panadería tienda`;
const CORE_ADV = `ahorita acá allá enseguida siempre nunca juntos despacio rápido temprano tarde bastante demasiado ojalá
  también tampoco quizás quizá apenas casi solo solamente todavía aún además entonces luego después antes pronto
  ya`;

export interface LexEntry { pos: Pos; gender?: 'm' | 'f' | 'mf' }

const LEX = new Map<string, LexEntry>();
const FORMS = new Set<string>(formsJson as string[]);
/** deaccented lemma -> accented lemma, so "cancion" + es -> canción */
const DEAC_LEMMA = new Map<string, string>();

function put(lemma: string, e: LexEntry, override = false): void {
  const w = lemma.replace(/_$/, '').replace(/_/g, ' ');
  if (!w || (!override && LEX.has(w))) return;
  LEX.set(w, e);
  DEAC_LEMMA.set(deaccent(w), w);
}

for (const [k, v] of Object.entries(lexJson as Record<string, string[]>)) {
  const [p, g] = v;
  put(k, p === 'n' ? { pos: 'noun', gender: (g as 'm' | 'f' | 'mf') ?? 'm' } : p === 'v' ? { pos: 'inf' } : { pos: 'x' });
}
for (const w of set(CORE_ADJ)) put(w, { pos: 'adj' }, true);
for (const w of set(CORE_NOUN_M)) put(w, { pos: 'noun', gender: 'm' }, true);
for (const w of set(CORE_NOUN_F)) put(w, { pos: 'noun', gender: 'f' }, !LEX.has(w) || LEX.get(w)!.pos !== 'noun');
for (const w of set(CORE_ADV)) if (!LEX.has(w)) put(w, { pos: 'adv' });

/** Register content lexemes (from content/vocab or graph lexeme nodes). */
export function registerLexemes(entries: Iterable<{ lemma: string; pos?: string; gender?: string }>): void {
  for (const e of entries) {
    const lemma = e.lemma.toLowerCase().trim();
    if (!lemma || lemma.includes(' ')) continue;
    const p = (e.pos ?? '').toLowerCase();
    const pos: Pos = /^n/.test(p) ? 'noun' : /^adj/.test(p) ? 'adj' : /^adv/.test(p) ? 'adv' : /^v/.test(p) ? 'inf' : 'x';
    put(lemma, { pos, gender: (e.gender as LexEntry['gender']) || undefined }, !LEX.has(lemma));
    FORMS.add(lemma);
  }
}

/** Function-like adverbs and quantifiers that are never lexeme nodes. */
export const LEXEME_STOP = set('más menos muy tan ya no sí también tampoco aún aun todavía solo sólo casi tanto mucho poco bastante demasiado así luego entonces pues algo nada');

/* Proper names (the story cast): capitalised, they are names even at the
 * start of a sentence — "Vale cocina muy bien" is Valentina cooking, not
 * "OK, (he) cooks". The gate registers them from the units' story arcs. */
const NAMES = new Set<string>();
export function registerNames(names: Iterable<string>): void { for (const n of names) NAMES.add(n.toLowerCase()); }
export function isName(w: string): boolean { return NAMES.has(w); }

export function lexEntry(w: string): LexEntry | undefined { return LEX.get(w); }
export function isKnownForm(w: string): boolean { return FORMS.has(w) || LEX.has(w); }
export function addKnownForms(ws: Iterable<string>): void { for (const w of ws) FORMS.add(w); }

/** Closed-class words, by category. Order matters for multi-membership. */
export function closedClass(w: string): Pos | null {
  if (ARTICLES.has(w) || CONTRACTIONS.has(w)) return 'det';
  if (POSSESSIVES.has(w)) return 'poss';
  if (DEMONSTRATIVES.has(w)) return 'dem';
  if (DEM_PRONOUNS.has(w) || SUBJECT_PRONOUNS.has(w) || TONIC_PRONOUNS.has(w) || INDEF_PRONOUNS.has(w)) return 'pron';
  if (CLITICS.has(w)) return 'clitic';
  if (PREPOSITIONS.has(w)) return 'prep';
  if (INTERROGATIVES.has(w)) return 'int';
  if (w === 'no' || w === 'nunca' || w === 'jamás' || w === 'tampoco') return 'neg';
  if (RELATIVES.has(w) && w !== 'que' && w !== 'cuanto') return 'rel';
  if (CONJUNCTIONS.has(w)) return 'conj';
  if (QUANTIFIERS.has(w)) return 'quant';
  if (NUMBERS.has(w)) return 'num';
  if (INTERJECTIONS.has(w)) return 'interj';
  if (ADVERBS.has(w)) return 'adv';
  return null;
}

/* ---- lemmatiser for nouns and adjectives -----------------------------------
 * Plural: -es / -s (luces > luz, canciones > canción, exámenes > examen).
 * Feminine > masculine ONLY for words the lexicon knows as adjectives
 * (alta > alto, trabajadora > trabajador, inglesa > inglés) — "casa" must not
 * become "caso". */
function restore(cand: string): string | null {
  if (LEX.has(cand)) return cand;
  const r = DEAC_LEMMA.get(deaccent(cand));
  if (!r) return null;
  // an accent the candidate lacks is a different word unless it sits in the last syllable
  // (inglés > ingleses moves the stress); práctico is not "practica" (he practises)
  for (let k = 0; k < r.length; k++) {
    if (/[áéíóú]/.test(r[k]) && cand[k] !== r[k] && /[aeiouáéíóú]/.test(r.slice(k + 1))) return null;
  }
  return r;
}

function singulars(w: string): string[] {
  const out: string[] = [];
  if (w.endsWith('ces')) out.push(w.slice(0, -3) + 'z');
  if (w.endsWith('es')) out.push(w.slice(0, -2));
  if (w.endsWith('s')) out.push(w.slice(0, -1));
  return out;
}

/** Feminine endings of person nouns (profesora, médica, amiga, abogada, japonesa). */
const PERSON_FEM = /(ora|ica|iga|ada|ana|esa|ona|ina|era|ista|ela|ita|ía)$/;
function mascs(w: string): string[] {
  const out: string[] = [];
  if (w.endsWith('a')) { out.push(w.slice(0, -1) + 'o'); out.push(w.slice(0, -1)); }
  if (w.endsWith('esa')) out.push(w.slice(0, -3) + 'és');
  if (w.endsWith('ona')) out.push(w.slice(0, -3) + 'ón');
  if (w.endsWith('ana')) out.push(w.slice(0, -3) + 'án');
  return out;
}

const isAdjLike = (e?: LexEntry) => !!e && (e.pos === 'adj' || e.pos === 'x');

export interface Lemma { lemma: string; entry?: LexEntry; viaForms: boolean }

export function lemmatize(w: string): Lemma | null {
  const direct = LEX.get(w);
  if (direct && direct.pos !== 'x') return { lemma: w, entry: direct, viaForms: false };
  if (direct) {
    // "personas" listed bare in vocab.js: prefer the singular noun if there is one
    for (const s of singulars(w)) { const r = restore(s); if (r && LEX.get(r)!.pos === 'noun') return { lemma: r, entry: LEX.get(r), viaForms: false }; }
    return { lemma: w, entry: direct, viaForms: false };
  }
  // -ísimo superlatives: altísimo > alto, riquísimo > rico
  const isimo = w.match(/^(.+)ísim[oa]s?$/);
  if (isimo) {
    const b = isimo[1];
    for (const c of [b + 'o', b + 'e', b, b.replace(/qu$/, 'c') + 'o', b.replace(/gu$/, 'g') + 'o']) {
      const r = restore(c);
      if (r && isAdjLike(LEX.get(r))) return { lemma: r, entry: LEX.get(r), viaForms: false };
    }
  }
  const sing = [w, ...singulars(w)];
  for (const s of sing) {
    if (s !== w) {
      const r = restore(s);
      if (r) return { lemma: r, entry: LEX.get(r), viaForms: false };
    }
    for (const m of mascs(s)) {
      const r = restore(m);
      if (r && isAdjLike(LEX.get(r))) return { lemma: r, entry: LEX.get(r), viaForms: false };
      // a feminine noun of a person shares the masculine lexeme: profesora > profesor, médica > médico
      if (r && LEX.get(r)!.pos === 'noun' && (LEX.get(r)!.gender === 'm' || LEX.get(r)!.gender === 'mf') && PERSON_FEM.test(s)) return { lemma: r, entry: LEX.get(r), viaForms: false };
    }
    // jefa > jefe, presidenta > presidente
    if (/(jefa|nta)$/.test(s) && !LEX.has(s)) { const r = restore(s.slice(0, -1) + 'e'); if (r && LEX.get(r)!.pos === 'noun') return { lemma: r, entry: LEX.get(r), viaForms: false }; }
  }
  // -mente adverbs from a known adjective (rápida + mente)
  const mente = w.match(/^(.+)mente$/);
  if (mente) {
    const b = mente[1];
    if (restore(b) || restore(b.replace(/a$/, 'o')) || FORMS.has(b) || FORMS.has(b.replace(/a$/, 'o'))) return { lemma: w, entry: { pos: 'adv' }, viaForms: false };
  }
  if (FORMS.has(w)) {
    for (const s of singulars(w)) if (FORMS.has(s)) return { lemma: s, viaForms: true };
    return { lemma: w, viaForms: true };
  }
  // a plural or feminine of a known form: completos > completo, genuina > genuino
  for (const s of [...singulars(w), w]) {
    if (s !== w && FORMS.has(s)) return { lemma: s, viaForms: true };
    for (const m of mascs(s)) if (FORMS.has(m)) return { lemma: m, viaForms: true };
  }
  return null;
}
