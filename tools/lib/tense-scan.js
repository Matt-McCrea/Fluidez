/* ============================================================================
 * TENSE-SCAN — which tenses does this text actually require?
 *
 * One scanner, three consumers, because the alternative is three that
 * disagree: tools/validate-content.js gates a passage's verbs against its
 * level, tools/tense-index.js precomputes the `tenses` array each passage
 * carries, and tools/audit-tenses.js reports when the course first teaches
 * each one. If the generator and the gate ever read a token differently, the
 * app filters on a field the validator believes is wrong, and nobody finds
 * out — the same failure js/lexmatch.js exists to prevent for vocabulary.
 *
 * THE GENEROUS READING. Spanish spells several tenses the same way: `habla`
 * is present indicative OR affirmative imperative, `hablara` is imperfect
 * subjunctive OR (with an accent it has not got) something else again. A
 * reader who has only met the present reads `habla` as the present, and is
 * right. So a token is scored by the CHEAPEST analysis it admits — the
 * minimum syllabus level across its possible tenses — and it is that tense,
 * not the whole set, that the text is recorded as requiring.
 *
 * Ties at the same level break on SEED order (the tense ladder in
 * js/lessons.js), so the field is deterministic and does not move when the
 * course is re-ordered around it.
 *
 * NOUN HOMOGRAPHS. The morphological index maps every conjugated form back to
 * its verb, so a noun spelled like one reads as a verb: "la vista" (the view)
 * analyses as vestirse's subjunctive. The exemption requires BOTH that the
 * word is a known noun homograph AND that it sits where a noun sits. Neither
 * alone is safe — clitic la/los/las stand in front of verbs exactly where an
 * article would.
 *
 * Usage (node only; the browser never needs this — the field is precomputed):
 *   const scan = require('./lib/tense-scan.js')(window.ENGINE, TENSE_LEVEL, SEED_ORDER);
 *   scan.tensesOf(passage.text)   -> ['presente', 'preterito']
 * ========================================================================== */
'use strict';

/* Extend as new content introduces collisions; never widen DETERMINERS to
 * quantifiers (todo/mucho/poco/cada), which freely precede verbs. Run
 * tools/find-homographs.js to see what the corpus is hitting. */
const NOUN_HOMOGRAPHS = new Set([
  // observed in the current corpus
  'trabajo', 'cena', 'cambio', 'viaje', 'río', 'ayuda', 'parte', 'partes',
  'cocina', 'estudio', 'desayuno', 'vista', 'recibo', 'camino', 'compra',
  'diseño', 'pregunta', 'preguntas', 'gasto', 'programa', 'programas',
  'contrato', 'negocio', 'traje', 'ducha', 'recuerdo', 'baño', 'firma',
  'paso', 'cuenta', 'gusto', 'metas', 'despido',
  // high-frequency collisions expected as content moves into B1-C1
  'sueño', 'vuelo', 'muestra', 'paseo', 'llamada', 'visita', 'respuesta',
  'comida', 'bebida', 'salida', 'entrada', 'parada', 'llegada', 'subida',
  'bajada', 'apoyo', 'duda', 'falta', 'juego', 'lucha', 'marcha', 'nota',
  'pena', 'prueba', 'regalo', 'reserva', 'saludo', 'vuelta', 'reparto',
  'aumento', 'ahorro', 'consumo', 'reforma', 'demanda', 'oferta', 'reparo',
  'peso', 'gobierno', 'mando', 'cargo', 'encuentro', 'fomento', 'rechazo',
  // surfaced when the verb set grew from 200 to 460: more verbs means more
  // nouns shadowed by a conjugated form. Run tools/find-homographs.js after
  // any verb addition and add the genuine nouns here.
  'soluciones', 'funciones', 'proyecto', 'casa', 'regalo', 'centro', 'queja',
  'proceso', 'marca', 'medio', 'medios', 'género', 'artículo', 'artículos',
  'público', 'práctico', 'práctica', 'ópera', 'ampliación', 'reserva',
  'estudios', 'contratos', 'programas', 'negocios', 'cambios', 'viajes',
  // surfaced adding spec/verb-queue.json's B1-C1 batch (coser, nevar,
  // alegrarse, informar): their subjunctive forms shadow everyday nouns.
  'cosa', 'cosas', 'nieve', 'alegre', 'informe',
  // same batch, second pass (temer, moler, tramitar): more everyday nouns
  // shadowed.
  'tema', 'muela', 'trámite',
  /* Surfaced writing the A1/A2 food batches. These two are the hardest kind:
   * the spellings are genuinely identical, so the accent rule in tenseAt
   * cannot separate them. `sal` is salt and salir's tú imperative; `sed` is
   * thirst and ser's vosotros imperative. Both are core beginner vocabulary —
   * `la sal` and `tener sed` are A1 entries in data/vocab.js — so a gate that
   * banned them from A1 texts would be banning the words the band is for. */
  'sal', 'sed'
]);

const DETERMINERS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'mi', 'mis', 'tu', 'tus', 'su', 'sus',
  'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'vuestro', 'vuestra', 'vuestros', 'vuestras',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
  'aquel', 'aquella', 'aquellos', 'aquellas',
  // genuine determiner contractions (de+el, a+el) — not quantifiers, so this
  // does not touch the "never widen to todo/mucho/poco/cada" guidance above.
  'del', 'al'
]);

/* A few genuine noun readings that neither determiner-adjacency nor the
 * finite-verb-object heuristic below catches: a quantifier ("cada cosa"), an
 * intervening adjective ("pequeñas cosas"), or a determiner-less mass noun
 * after a verb of occurrence ("caer nieve", like "hacer sol"). Exact
 * two-token phrases only, not a general rule. */
const SAFE_NOUN_PHRASES = new Set([
  'cada cosa', 'pequeñas cosas', 'caer nieve', 'cada trámite', 'tanto trámite'
]);

module.exports = function makeScanner(E, TENSE_LEVEL, SEED_ORDER) {
  const order = tk => (SEED_ORDER && SEED_ORDER[tk] != null) ? SEED_ORDER[tk] : 99;
  const level = tk => (TENSE_LEVEL && TENSE_LEVEL[tk]) || 1;

  function isNounHere(toks, i) {
    if (!NOUN_HOMOGRAPHS.has(toks[i]) || i < 1) return false;
    const prev = toks[i - 1];
    if (DETERMINERS.has(prev)) return true;
    if (SAFE_NOUN_PHRASES.has(prev + ' ' + toks[i])) return true;
    /* Bare plurals take no article ("negocia soluciones justas"), so also
     * accept the object position: directly after a finite verb. Spanish does
     * not put two conjugated verbs side by side without a conjunction, so a
     * word there is a noun. Membership of NOUN_HOMOGRAPHS still does the real
     * gating — "la había comido" is untouched because "comido" is not on that
     * list. */
    const pa = E.analyzeToken(prev) || [];
    return pa.some(a => a.tense !== 'imperativo');
  }

  /* The cheapest tense this token admits, or null if it is not a verb form
   * (or is a noun standing where a noun stands).
   *
   * ACCENTS DECIDE WHETHER IT IS A VERB. The engine matches a token to a
   * paradigm ignoring accents and records on each analysis whether they
   * actually agreed (`accentExact`). A token whose ONLY readings are inexact
   * is not that verb: `este` is not `esté`, `seria` is not `sería`,
   * `practica` is not `práctica`. Discarding those tokens is safe because
   * accents in this corpus are not optional — tools/lint-spanish.js fails the
   * build on a dropped one, adjudicating against these same paradigms — so if
   * the text says `este`, it has already been verified to mean `este`.
   *
   * This is not a new idea, it is an existing one applied consistently —
   * js/engine.js already filters analyses this way for its function words.
   * Without it the demonstrative `este` forces level 4 (estar's present
   * subjunctive), which is why it appears in 102 passages and in not one
   * below level 4: an A1 word, taught in gr-demostrativos-distribucion-a1,
   * that no A1 text could contain. It also retires five entries that had been
   * added to NOUN_HOMOGRAPHS one collision at a time — práctica, público,
   * artículo, género, trámite — all of which are this same case. */
  function tenseAt(toks, i) {
    const analyses = E.analyzeToken(toks[i]);
    if (!analyses.length) return null;
    /* Applied ONLY to decide whether this is a verb at all, never to narrow
     * which tense it is. A token with no exact reading is not a verb; a token
     * that has one keeps every reading it admits, inexact ones included, so
     * the generous minimum below is exactly as generous as it has always been.
     * Narrowing here instead would quietly tighten the level gate — `entre`
     * has an exact reading as entrar's subjunctive and an inexact one as
     * `entré`, and dropping the second would make the preposition cost level
     * 4 in every passage that has ever used it. */
    if (!analyses.some(a => a.accentExact)) return null;
    if (isNounHere(toks, i)) return null;
    let best = null;
    analyses.forEach(a => {
      if (!a.tense) return;
      if (best === null) { best = a.tense; return; }
      const d = level(a.tense) - level(best) || order(a.tense) - order(best);
      if (d < 0) best = a.tense;
    });
    return best;
  }

  /* The minimum level this text needs — the number the static gate in
   * tools/validate-content.js compares against a passage's `level`. */
  function minLevelOf(text) {
    const toks = E.tokenize(text || '');
    let n = 1;
    toks.forEach((t, i) => { const tk = tenseAt(toks, i); if (tk) n = Math.max(n, level(tk)); });
    return n;
  }

  /* ---- compound tenses ---------------------------------------------------
   * `he hablado` is two tokens, and neither is the tense: `he` analyses as the
   * PRESENT of haber, `hablado` as no finite form at all. So a token-level
   * scan reads a present perfect as a present — which is why the level gate in
   * tools/validate-content.js has never gated one, and why 0 of the 90
   * level-1 passages register as carrying anything but `presente` while 228 of
   * the 393 contain a compound.
   *
   * That gap is survivable for a gate whose job is to reject content written
   * too hard for its band. It is not survivable for a field whose whole
   * purpose is to say whether a learner has been taught what the text
   * contains: `perfecto` moving to level 1 means nothing if no passage ever
   * records holding one. So the compound is read from the tense of its haber.
   *
   * The level gate is deliberately NOT changed to match. Widening it would
   * fail 228 existing passages that have been correct for as long as the gate
   * has existed, which is a content decision, not a side effect of this one.
   * The runtime filter is simply more accurate than the proxy it replaces —
   * that being the entire point of gating by tense rather than by level. */
  const COMPOUND_OF = {
    presente: 'perfecto', imperfecto: 'plusc', futuro: 'futperf',
    condicional: 'condperf', presubj: 'perfsubj',
    /* `hubiera hablado` is the pluscuamperfecto de subjuntivo, which the
     * ladder has no key for. `perfsubj` is the nearest thing on it and sits at
     * the same level, so gating on it is right even though the label is not
     * exactly the form's name. */
    impsubj: 'perfsubj'
  };

  function compoundTenses(text) {
    const out = [];
    (E.analyzeSentence(text || '').compounds || []).forEach(c => {
      // the generous reading again: the cheapest compound its haber admits
      let best = null;
      (c.haberAnalyses || []).forEach(h => {
        const tk = COMPOUND_OF[h.tense];
        if (!tk) return;
        if (best === null) { best = tk; return; }
        if ((level(tk) - level(best) || order(tk) - order(best)) < 0) best = tk;
      });
      if (best) out.push(best);
    });
    return out;
  }

  /* Every tense the text requires, deduplicated, in SEED order. This is the
   * `tenses` field data/passages.js carries and js/session.js filters on.
   *
   * Only LADDER tenses are recorded — the ones SEED gives a level, which is
   * exactly the set the `level` integer was ever a proxy for. `impneg` (the
   * negative imperative) is in the engine but not on the ladder, so
   * TENSE_LEVEL never gated it and neither does this: replacing a proxy with
   * the thing itself must not quietly gate forms the proxy let through. */
  function tensesOf(text) {
    const toks = E.tokenize(text || '');
    const seen = new Set();
    toks.forEach((t, i) => {
      const tk = tenseAt(toks, i);
      if (tk && TENSE_LEVEL && TENSE_LEVEL[tk] != null) seen.add(tk);
    });
    compoundTenses(text).forEach(tk => { if (TENSE_LEVEL[tk] != null) seen.add(tk); });
    return [...seen].sort((a, b) => order(a) - order(b) || a.localeCompare(b));
  }

  /* Which token forced a tense — the line a failure report needs to be
   * actionable rather than merely true. */
  function witness(text, tense) {
    const toks = E.tokenize(text || '');
    for (let i = 0; i < toks.length; i++) if (tenseAt(toks, i) === tense) return toks[i];
    return null;
  }

  return { isNounHere, tenseAt, tensesOf, minLevelOf, witness,
           NOUN_HOMOGRAPHS, DETERMINERS, SAFE_NOUN_PHRASES };
};
