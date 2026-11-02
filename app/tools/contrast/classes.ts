// What decides each of the 94 contrasts (audit R10), which decides how it is asked. This is the
// acquisition review's classification, by reading each hook and rule (cross-review/acquisition-reviews-
// exercises.md, appendix), kept here as data so the derive tool writes it into each contrast's file.
// Single-rater: a contrast that is moved to another class is a one-line change here and a re-run of derive.
import type { ContrastDecides } from '../../src/content/schema';

const list = (s: string) => s.split(/\s+/).filter(Boolean);

/** A word or structure beside the slot decides it: matching the cue is the skill, so a forced choice is fair. */
const LOCAL = list(`
inf-vs-que-subj si-clause-no-future permitir-inf-que para-inf-que muy-mucho tan-tanto mas-que-mas-de-lo-que pero-sino
participle-agreement le-se-lo body-article-possessive mi-mio hace-desde-hace llevar-gerundio-sin dificil-de-es-dificil
tan-que-como-para subj-present-past ing-infinitive-gerund para-porque lo-le creo-no-creo supongo-vs-dudo fact-value
impresion-vs-no-estoy-seguro no-recuerdo-que-vs-haber yo-vs-a-mi-tambien tras-al-inf siento-que-vs-siento-no-haber
que-three-ways commands-tu-usted`);

/** What the speaker means decides it and the frame is silent: a situation cues it, and then both sides are typed. */
const MEANING = list(`
ser-estar-adj ser-estar-participle ser-estar-place ser-event-estar-location es-en-esta-en por-para por-inf-para-inf
saber-conocer saber-poder pedir-preguntar tener-estar-states tener-que-deber ir-irse decir-que-ind-subj
relative-ind-subj mientras-ind-subj cuando-ind-subj si-real-unreal si-past-present-unreal future-prediction-conjecture
future-guess-present-past deberias-vs-deberias-haber darse-cuenta-enterarse ir-a-future present-progressive tu-usted
se-three-ways`);

/** Earlier text, or what the listener knows, decides it: typed from the English, and never against a clock. */
const DISCOURSE = list(`
pret-imp perfecto-preterito pret-perfecto-latam pluperfect-preterite imperfecto-tres-usos aunque-ind-subj hay-esta
lo-que-el-que`);

/** Usage and register decide it: phrase retrieval in a situation, never a deck of two buttons. */
const SYNONYM = list(`
a-favor-vs-de-acuerdo acabar-por-llegar-a al-tiempo-que-a-medida-que antemano-antelacion conformarse-no-remedio
cualquier-dia-un-dia-cualquiera dar-igual-parecer-bien gracias-a-debido-a habria-que-vs-deberias hacerse-llegar-a-ser
juraria-vs-me-consta me-suena-vs-recuerdo medir-caber modo-de-ver-vs-yo-diria molesta-vs-no-soporto
no-hace-falta-vs-prohibido orden-escalera para-mi-que-vs-cabe parcial-vs-total pena-vs-rabia perdon-lo-siento
que-tal-si-vs-te-propongo-que reformular-vs-descartar segun-depende seguir-dejar-de talento-capacidad tardar-llegar-tarde
te-importa-si-vs-te-importaria-que vista-gorda-pasar-por-alto`);

export const DECIDES: ReadonlyMap<string, ContrastDecides> = new Map([
  ...LOCAL.map((n) => [`x:${n}`, 'local'] as const),
  ...MEANING.map((n) => [`x:${n}`, 'meaning'] as const),
  ...DISCOURSE.map((n) => [`x:${n}`, 'discourse'] as const),
  ...SYNONYM.map((n) => [`x:${n}`, 'synonym'] as const),
]);

/**
 * The contrasts the course returns to most: the graph's "Big five" (aspect, ser and estar, por and para, mood after
 * creer) and lo/le, which the unit map re-drills on as many review days as por and para. R11 starts them at 150 items
 * and the rest at 40, then measures.
 */
export const BIG: ReadonlySet<string> = new Set(['x:pret-imp', 'x:ser-estar-adj', 'x:por-para', 'x:creo-no-creo', 'x:lo-le']);

/** Items a contrast starts with (R11), before anyone has measured whether it is enough. */
export const TARGET_ITEMS = (node: string): number => (BIG.has(node) ? 150 : 40);
