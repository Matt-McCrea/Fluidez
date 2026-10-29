/* ============================================================================
 * FEATURE -> GRAPH NODE MAP  (keyed to content/graph/grammar.json, 172 nodes)
 *
 * The tagger speaks in dotted feature keys, most specific first
 * ("tense.presente.stem-ie", "subj.volition", "peri.ir-a"). This table says
 * which grammar node each key requires. It is deliberately separate from the
 * detectors so the curriculum can be re-cut without touching them.
 *
 * RESOLUTION. A key resolves by walking up its dots:
 *   tense.presente.irregular.ser -> tense.presente.irregular -> tense.presente
 * With a graph loaded (TagOptions.graphIds), the first mapped id that EXISTS
 * in the graph wins — so if the graph only has g:presente, every present form
 * requires g:presente, and if it splits out g:presente-e-ie, stem-changers
 * require that instead, with no code change. Without a graph the most
 * specific mapped id wins. `null` means "informative feature, no node".
 *
 * TO UPDATE: edit DEFAULT_NODE_MAP, or (no code change) drop a
 * content/graph/_featuremap.json of { "<feature key>": "<node id>" | null };
 * the gate passes it in as TagOptions.featureMap and it overrides this table.
 * ========================================================================== */
import type { NodeId, TagOptions } from './types';

export const DEFAULT_NODE_MAP: Readonly<Record<string, NodeId | null>> = {
  // ---- present ----
  'tense.presente': 'g:present-ar',
  'tense.presente.regular.ar': 'g:present-ar',
  'tense.presente.regular.er': 'g:present-er-ir',
  'tense.presente.regular.ir': 'g:present-er-ir',
  'tense.presente.spelling.ar': 'g:present-ar',
  'tense.presente.spelling.er': 'g:present-er-ir',
  'tense.presente.spelling.ir': 'g:present-er-ir',
  'tense.presente.stem-ie': 'g:stem-boot',
  'tense.presente.stem-ue': 'g:stem-boot',
  'tense.presente.stem-i': 'g:stem-e-i',
  'tense.presente.irregular-yo': 'g:yo-irregular',
  'tense.presente.irregular': 'g:yo-irregular',
  'tense.presente.irregular.ser': 'g:ser-identity',
  'tense.presente.irregular.estar': 'g:estar-location-states',
  'tense.presente.irregular.ir': 'g:ir-a-plans',
  // ---- preterite ----
  'tense.preterito': 'g:preterite-ar',
  'tense.preterito.regular.ar': 'g:preterite-ar',
  'tense.preterito.regular.er': 'g:preterite-er-ir',
  'tense.preterito.regular.ir': 'g:preterite-er-ir',
  'tense.preterito.spelling': 'g:preterite-spelling-stem',
  'tense.preterito.stem': 'g:preterite-spelling-stem',
  'tense.preterito.irregular': 'g:preterite-irregular-strong',
  'tense.preterito.irregular.ser-ir': 'g:preterite-ser-ir-hacer',
  'tense.preterito.irregular.hacer': 'g:preterite-ser-ir-hacer',
  // ---- imperfect, future, conditional ----
  'tense.imperfecto': 'g:imperfect-habitual',
  'tense.imperfecto.state': 'g:imperfect-states',
  'tense.futuro': 'g:future-promises',
  'tense.condicional': 'g:conditional',
  // ---- compounds ----
  'tense.perfecto': 'g:perfecto-experience',
  'tense.plusc': 'g:pluperfect',
  'tense.futperf': 'g:future-perfect',
  'tense.condperf': 'g:conditional-perfect',
  'participle.irregular': null,
  // ---- subjunctive tenses ----
  'tense.presubj': 'g:subj-wanting',
  'tense.presubj.irregular': 'g:subj-irregulars',
  'tense.impsubj': 'g:imperfect-subj',
  'tense.impsubj.se': 'g:se-form-recognition',
  'tense.perfsubj': 'g:subj-perfect',
  'tense.pluscsubj': 'g:pluperfect-subj',
  'tense.futsubj': 'g:future-subj-recognition',
  // ---- subjunctive triggers ----
  'subj.volition': 'g:subj-wanting',
  'subj.volition.want': 'g:subj-wanting',
  'subj.volition.hope': 'g:subj-wishes',
  'subj.volition.influence': 'g:subj-influence',
  'subj.volition.reported': 'g:reported-requests',
  'subj.volition.want.past': 'g:subj-past-triggers',
  'subj.volition.hope.past': 'g:subj-past-triggers',
  'subj.volition.influence.past': 'g:subj-past-triggers',
  'subj.volition.reported.past': 'g:reported-commands-past',
  'subj.emotion': 'g:subj-emotion',
  'subj.emotion.basic': 'g:subj-emotion-intro',
  'subj.emotion.past': 'g:subj-past-triggers',
  'subj.emotion.basic.past': 'g:subj-past-triggers',
  'subj.evaluation': 'g:subj-value',
  'subj.evaluation.past': 'g:subj-past-triggers',
  'subj.impersonal': 'g:subj-value',
  'subj.impersonal.past': 'g:subj-past-triggers',
  'subj.doubt': 'g:subj-doubt',
  'subj.doubt.possible': 'g:subj-doubt',
  'subj.doubt.negated-belief': 'g:subj-opinion-negated',
  'subj.doubt.negated-perception': 'g:subj-perception-negated',
  'subj.doubt.past': 'g:subj-past-triggers',
  'subj.doubt.possible.past': 'g:subj-past-triggers',
  'subj.doubt.negated-belief.past': 'g:subj-past-triggers',
  'subj.doubt.negated-perception.past': 'g:subj-perception-negated',
  'subj.ojala': 'g:subj-wishes',
  'subj.ojala.past': 'g:ojala-past',
  'subj.wish-que': 'g:subj-wishes',
  'subj.wish-que.quien': 'g:wish-exclamatives',
  'subj.adverb-doubt': 'g:quizas-a-lo-mejor',
  'subj.purpose': 'g:para-que',
  'subj.conj': 'g:subj-purpose-full',
  'subj.conj.condition': 'g:subj-conditions',
  'subj.conj.consequence': 'g:consecutive-advanced',
  'subj.temporal': 'g:subj-cuando-future',
  'subj.temporal.past': 'g:subj-future-in-past',
  'subj.concessive': 'g:subj-concessive',
  'subj.relative': 'g:subj-relative',
  'subj.relative.free': 'g:subj-free-relatives',
  'subj.como-si': 'g:como-si',
  'subj.si': 'g:si-hypothetical',
  'subj.factive': 'g:mood-choice-fine',
  'subj.courtesy': 'g:softening',
  'subj.unlicensed': null,
  'subj.fixed': null,
  // ---- conditional sentences ----
  'cond.real': 'g:si-present',
  'cond.hypothetical': 'g:si-hypothetical',
  'cond.past': 'g:si-past-unreal',
  // ---- commands ----
  'cmd.tu.aff': 'g:commands-tu',
  'cmd.usted.aff': 'g:commands-usted',
  'cmd.ustedes.aff': 'g:commands-usted',
  'cmd.tu.neg': 'g:negative-commands',
  'cmd.usted.neg': 'g:negative-commands',
  'cmd.ustedes.neg': 'g:negative-commands',
  'cmd.nosotros': null,
  'cmd.vosotros': 'g:vosotros-recognition',
  // ---- pronouns ----
  'clitic.do': 'g:direct-objects',
  'clitic.io': 'g:indirect-objects',
  'clitic.personal': 'g:direct-objects',
  'clitic.combined': 'g:double-pronouns',
  'clitic.se-lo': 'g:double-pronouns',
  'clitic.enclitic.inf': 'g:object-pronoun-position',
  'clitic.enclitic.ger': 'g:object-pronoun-position',
  'clitic.enclitic.cmd': 'g:commands-with-pronouns',
  'reflexive': 'g:reflexive-routine',
  'reflexive.meaning': 'g:se-meaning-change',
  'reflexive.change': 'g:verbs-of-change',
  'gustar': 'g:gustar-basic',
  'gustar.like': 'g:gustar-full',
  'gustar.like.parecer': 'g:parecer-quedar',
  'gustar.doubling': 'g:gustar-full',
  'pron.prep': 'g:prep-pronouns',
  // ---- se ----
  'se.impersonal': 'g:se-impersonal',
  'se.passive.basic': 'g:se-impersonal',
  'se.passive': 'g:passive-se',
  'se.accidental': 'g:se-accidental',
  // ---- relatives and clauses ----
  'rel.que': 'g:relative-que',
  'rel.quien': 'g:relatives-donde-lo-que',
  'rel.donde': 'g:relatives-donde-lo-que',
  'rel.lo-que': 'g:relatives-donde-lo-que',
  'rel.el-que': 'g:relatives-prepositions',
  'rel.prep': 'g:relatives-prepositions',
  'rel.cual': 'g:relatives-formal',
  'rel.cuyo': 'g:cuyo-relatives',
  'que.complement': 'g:that-clauses',
  'q.wh': 'g:questions',
  'q.wh.prep': 'g:questions-prepositions',
  'q.indirect': 'g:indirect-questions',
  'excl.que': 'g:exclamations',
  'conj.cuando.ind': 'g:cuando-indicative',
  'conj.aunque.ind': 'g:aunque-indicative',
  'conj.sino': 'g:pero-sino',
  // ---- periphrases ----
  'peri.ir-a': 'g:ir-a-plans',
  'peri.tener-que': 'g:tener-que-hay-que',
  'peri.hay-que': 'g:tener-que-hay-que',
  'peri.acabar-de': 'g:acabar-de-ya-todavia',
  'peri.estar-ger': 'g:estar-gerund',
  'peri.estar-ger.past': 'g:imperfect-progressive',
  'peri.seguir-ger': 'g:gerund-ways',
  'peri.llevar-ger': 'g:hace-que-desde',
  'peri.ir-ger': 'g:gerund-ways',
  'peri.volver-a': 'g:verb-infinitive',
  'peri.dejar-de': 'g:verb-infinitive',
  'peri.empezar-a': 'g:verb-infinitive',
  'peri.terminar-de': 'g:verb-infinitive',
  'peri.ponerse-a': 'g:verb-infinitive',
  'peri.soler': 'g:verb-infinitive',
  'peri.deber': 'g:deber-modal',
  'peri.poder': 'g:verb-infinitive',
  'peri.querer': 'g:verb-infinitive',
  'peri.estar-a-punto': null,
  // ---- ser / estar ----
  'ser': 'g:ser-identity',
  'ser.passive': 'g:passive-ser',
  'estar': 'g:estar-location-states',
  'estar.result': 'g:estar-participle',
  // ---- prepositions, comparison ----
  'prep.por': 'g:por-para-1',
  'prep.para': 'g:por-para-1',
  'por.fixed': null,
  'comp.mas-que': 'g:comparatives',
  'comp.tan-como': 'g:comparatives',
  'comp.irregular': 'g:comparatives',
  'comp.tanto-como': 'g:tanto-como',
  'comp.igual': 'g:tanto-como',
  'comp.mas-de': 'g:comparatives-advanced',
  'comp.cada-vez': 'g:comparatives-advanced',
  'sup.relative': 'g:superlatives',
  'sup.isimo': 'g:superlatives',
  // ---- noun phrase ----
  'np.article': 'g:gender-articles',
  'np.possessive': 'g:possessives',
  'np.possessive.stressed': 'g:possessives-stressed',
  'np.demonstrative': 'g:demonstratives',
  'np.indefinite': 'g:indefinites',
  'np.quantifier': 'g:quantifiers',
  'np.cada': 'g:cada-cualquier',
  'np.lo-adj': 'g:lo-adjective',
  'np.diminutive': 'g:diminutives',
  'neg.double': 'g:negation-words',
  'adv.mente': 'g:adverbs-mente',
  // ---- time, haber ----
  'hay': 'g:hay-vs-esta',
  'hay.tense': 'g:imperfect-states',
  'time.hace': 'g:hace-ago',
  'time.hace-que': 'g:hace-que-desde',
  // ---- non-finite ----
  'nonfinite.al-inf': 'g:prep-infinitive',
  'nonfinite.prep-inf': 'g:prep-infinitive',
  'nonfinite.perfect-inf': 'g:infinitive-perfect',
  'nonfinite.gerund': 'g:gerund-ways',
  // ---- connectors ----
  'conn.cause': 'g:cause-result',
  'conn.cause-adv': 'g:causal-advanced',
  'conn.consequence': 'g:consequence-connectors',
  'conn.consequence-adv': 'g:consecutive-advanced',
  'conn.despite': 'g:concession-despite',
  'conn.concessive-adv': 'g:concessive-advanced',
  'conn.discourse': 'g:discourse-structure',
  'conn.reformulation': 'g:reformulation',
  'conn.hedge': 'g:hedging-distance',
  'conn.sequence': 'g:time-sequence',
  'conn.maybe': 'g:quizas-a-lo-mejor',
  'conn.ya': 'g:acabar-de-ya-todavia',
  'np.lo-que-intensity': 'g:lo-que-intensity',
  'np.adj-agreement': 'g:adjective-agreement',
  'conn.temporal-adv': 'g:temporal-advanced',
  'comp.cuanto-mas': 'g:comparative-advanced-c1',
  'peri.impersonal-obligation': 'g:impersonal-obligation',
  'cond.de-haber': 'g:conditional-advanced',
  'subj.conj.como': 'g:conditional-advanced',
  'nonfinite.subject': 'g:infinitive-subject',
  'clitic.io.doubling': 'g:le-doubling',
  'reported.past': 'g:reported-past-basic',
  'reported.backshift': 'g:reported-backshift',
  'tense.mix': 'g:pret-vs-imperfect',
  // ---- informative only ----
  'dialect.vosotros': 'g:vosotros-recognition',
  'dialect.voseo': 'g:voseo-recognition',
};

function ancestors(key: string): string[] {
  const parts = key.split('.');
  const out: string[] = [];
  for (let n = parts.length; n >= 1; n--) out.push(parts.slice(0, n).join('.'));
  return out;
}

/** The node a feature key requires, given the graph (if any). */
export function resolveNode(key: string, opts: Pick<TagOptions, 'graphIds' | 'featureMap'> = {}): NodeId | null {
  if (key.startsWith('lex.')) return 'l:' + key.slice(4);
  if (key.startsWith('chunk.')) return key.slice(6);
  const map = (k: string): NodeId | null | undefined => {
    if (opts.featureMap && k in opts.featureMap) return opts.featureMap[k];
    return k in DEFAULT_NODE_MAP ? DEFAULT_NODE_MAP[k] : undefined;
  };
  const chain = ancestors(key);
  const mapped: NodeId[] = [];
  for (const k of chain) {
    const m = map(k);
    if (m === null) { if (!mapped.length) return null; break; }
    if (m !== undefined) mapped.push(m);
  }
  if (!mapped.length) return null;
  if (opts.graphIds && opts.graphIds.size) {
    const hit = mapped.find((m) => opts.graphIds!.has(m));
    if (hit) return hit;
  }
  return mapped[0];
}

/** Every feature key that maps to a node (for coverage reports). */
export function mappedKeys(): string[] {
  return Object.keys(DEFAULT_NODE_MAP).filter((k) => DEFAULT_NODE_MAP[k] !== null);
}
