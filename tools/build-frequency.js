#!/usr/bin/env node
/* ============================================================================
 * build-frequency.js — rank the app's words, verbs and phrases by how common
 * they are in real Spanish.
 *
 *   node tools/build-frequency.js            write data/word-rank.js
 *   node tools/build-frequency.js --check    exit 1 if it is stale
 *   node tools/build-frequency.js --report   print the numbers the report uses (JSON)
 *
 * WHY. Palabras (the word grind in the Juegos arcade) should teach the most
 * common Spanish first. VOCAB and the course graph have no frequency at all.
 *
 * SOURCE. tools/freq/es_50k.txt: 50,000 word forms and their counts from
 * OpenSubtitles 2018 (hermitdave/FrequencyWords). Content CC BY-SA 4.0, so the
 * ranking written here is shared under the same licence. See tools/freq/README.md.
 *
 * METHOD.
 *  - Words: data/vocab.js and the graph's lexemes are merged, deduped on the
 *    Spanish with its article stripped (VOCAB wins, so it keeps its theme; a
 *    graph-only word keeps its band as cefr and takes a theme from its PCIC
 *    notion tag, which maps to exactly one VOCAB theme). Score = count of the
 *    form + its plural, and for article-less -o words the feminine and plurals.
 *  - Verbs: every distinct form the engine can conjugate (all tenses, gerund,
 *    participles; compound forms keep only the participle, haber is ignored;
 *    forms that are also function words, like "para" and "como", are not
 *    counted). A reflexive verb is placed straight after its base verb, never
 *    above it, because it shares the base's forms.
 *  - Phrases: no n-gram data, so score = the count of the phrase's rarest
 *    content word (stopwords ignored; a verb counts as all its forms).
 *  - Homographs: tools/freq/overrides.json demotes entries whose form is mostly
 *    a function word in speech ("el sobre"). Demote = 5% of the count unless the override gives a share.
 *  - Glosses: tools/freq/glosses.json holds the reviewed English prompts, theme fixes and the g flag.
 *  - Left out: profanity, proper names, abbreviations and entries with notation.
 * Entries are { es, en, th (theme), c (cefr), r (rank in its list) }.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/word-rank.js');
const FREQ = path.join(__dirname, 'freq/es_50k.txt');
const WORDS_MAX = 6000, PHRASES_MAX = 2000, DEMOTE = 0.05;

function loadApp() {
  global.window = global;
  ['data/verbs.js', 'data/vocab.js', 'data/graph.js', 'js/engine.js']
    .forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
}
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'freq', f), 'utf8')); } catch (e) { return d; } };

/* function words: their counts are speech glue, never a noun's or verb's */
const FUNC = new Set(('de la que el en y a los se del las un por con no una su para es al lo como mas más pero sus le ya o este sí si porque esta ' +
  'entre cuando muy sin sobre también tambien me hasta hay donde quien desde todo nos durante todos uno les ni contra otros ese eso ante ellos e ' +
  'esto mí antes algunos qué que unos yo otro otras otra él tanto esa estos mucho quienes nada muchos cual poco ella estar estas algunas algo nosotros ' +
  'mi mis tú te ti tu tus ellas nosotras vosotros vosotras os así asi aquí aqui allí ahí ahora hacia según segun tras bajo salvo pues sino mientras ' +
  'aunque cada tan tal qué quién cuál cómo dónde cuándo cuánto aquel aquella aquello aquellos aquellas esas mío mía suyo suya').split(/\s+/));
const PH_STOP = new Set('de la el que a en y por un una se los las con para del al lo su sus mi tu me te le les no es o'.split(' '));
/* verb forms that are really a preposition/adverb/pronoun */
const FORM_STOP = new Set([...FUNC]);
const NOFEM = new Set(['pero', 'como', 'cuando', 'tanto', 'cuanto', 'poco', 'mucho', 'todo', 'otro', 'ese', 'este', 'aquel', 'uno', 'nuestro', 'vuestro', 'mio', 'mío', 'tuyo', 'suyo', 'ocho', 'ahora']);
const PLURAL_OK = new Set(['mi', 'tu', 'su']);
const ART = /^(el\/la|los\/las|el|la|los|las|un|una|unos|unas)\s+/i;
const COMPOUND = new Set(['perfecto', 'plusc', 'futperf', 'condperf', 'perfsubj']);
const HINT = {
  ie: new Set('tender arrendar despertar encerrar herir mentir interferir requerir concernir reventar transferir'.split(' ')),
  ue: new Set('almorzar soler volar soñar acostar morder torcer revolver concordar esforzar'.split(' ')),
  i: new Set('rendir competir perseguir impedir medir concebir'.split(' ')),
  like: { sostener: 'tener', disponer: 'poner', oponer: 'poner', interponer: 'poner', deshacer: 'hacer', satisfacer: 'hacer', predecir: 'decir', provenir: 'venir', distraer: 'traer' }
};
const INF_RE = /^[a-zñáéíóúü]+(ar|er|ir|ír|ér)(se)?$/;

function plural(w) {
  if (/s$/.test(w)) {
    /* stressed last syllable takes -es: mes>meses, dios>dioses, país>países, francés>franceses */
    const groups = (w.match(/[aeiouáéíóúü]+/g) || []).length;
    if (groups <= 1 && w.length > 2) return w + 'es';
    if (/[áéóú]s$/.test(w) && groups > 1) return w.slice(0, -2) + w[w.length - 2].normalize('NFD').replace(/[\u0300-\u036f]/g, '') + 'ses';
    if (/ís$/.test(w)) return w + 'es';
    return w;
  }
  if (/z$/.test(w)) return w.slice(0, -1) + 'ces';
  if (/[aeiouáéíóú]$/.test(w)) return w + 's';
  if (/ón$/.test(w)) return w.slice(0, -2) + 'ones';
  if (/án$/.test(w)) return w.slice(0, -2) + 'anes';
  if (/én$/.test(w)) return w.slice(0, -2) + 'enes';
  if (/ín$/.test(w)) return w.slice(0, -2) + 'ines';
  return w + 'es';
}

function compute() {
  loadApp();
  const raw = fs.readFileSync(FREQ, 'utf8').split('\n').filter(Boolean);
  const freq = new Map(), order = [];
  raw.forEach(l => { const p = l.split(' '); freq.set(p[0], +p[1]); order.push(p[0]); });
  const cnt = f => freq.get(f) || 0;
  const EX = readJson('exclude.json', {});
  const PROF = new Set(EX.profanity || []);
  const OV = readJson('overrides.json', {});
  const stats = { excluded: { notation: [], names: [], abbrev: [], profanity: [] }, autoDemoted: [] };

  /* ---- merge VOCAB and graph lexemes ----------------------------------- */
  const notion = {};
  window.VOCAB.forEach(v => (v.pcic || []).forEach(p => { if (v.theme && !notion[p]) notion[p] = v.theme; }));
  const cand = [];
  window.VOCAB.forEach(v => cand.push({ es: v.es, en: v.en, cefr: v.cefr || null, theme: v.theme || null, src: 'v' }));
  window.GRAPH.nodes.filter(n => n.kind === 'lexeme').forEach(n => {
    let th = null;
    (n.pcic || []).forEach(p => { if (!th && notion[p]) th = notion[p]; });
    cand.push({ es: n.es, en: n.en || n.title, cefr: n.band || null, theme: th, src: 'g', graphTheme: !!th });
  });
  const byKey = new Map();
  /* a musical-note gloss ("E (musical note)") must not shadow the word it shares a spelling with (mi, si) */
  cand.sort((a, b) => (/musical note/.test(a.en) ? 1 : 0) - (/musical note/.test(b.en) ? 1 : 0));
  cand.forEach(c => {
    const es = c.es.trim();
    const hasArt = ART.test(es);
    const bare = es.replace(ART, '').trim();
    const note = bare.replace(/^(el\/la|los\/las)\s+/, '');
    if (/[\[\]*()\/]|\.\.\./.test(bare) || /[\[\]*()]/.test(es)) { stats.excluded.notation.push(es); return; }
    if (/^[A-ZÁÉÍÓÚÑ]/.test(bare)) { stats.excluded.names.push(es); return; }
    if (/\.$|^[a-z]{1,3}\.$/.test(bare)) { stats.excluded.abbrev.push(es); return; }
    if (bare.split(/\s+/).some(t => PROF.has(t))) { stats.excluded.profanity.push(es); return; }
    const key = bare.toLowerCase();
    const prev = byKey.get(key);
    if (prev) { if (!prev.theme && c.theme) prev.theme = c.theme; if (!prev.cefr && c.cefr) prev.cefr = c.cefr; return; }
    byKey.set(key, { key, bare, es, hasArt, en: c.en, cefr: c.cefr, theme: c.theme, src: c.src });
  });
  const ents = [...byKey.values()];

  /* ---- verbs ------------------------------------------------------------ */
  const E = window.ENGINE;
  const verbs = new Map();   // inf -> { inf, en, refl, base, v }
  window.VERBS.forEach(v => verbs.set(v.inf, { inf: v.inf, en: v.en, v }));
  const entByKey = k => byKey.get(k);
  ents.forEach(e => {
    if (e.hasArt || /\s/.test(e.bare) || !INF_RE.test(e.bare) || verbs.has(e.bare)) return;
    if (!/^to /.test(e.en)) return;
    const m = e.bare.replace(/se$/, '');
    const t = /er$|ér$/.test(m) ? 'er' : /ir$|ír$/.test(m) ? 'ir' : 'ar';
    const v = { inf: e.bare, en: e.en, type: t };
    const b = e.bare.replace(/se$/, '');
    if (HINT.ie.has(b)) v.stem = 'ie'; else if (HINT.ue.has(b)) v.stem = 'ue'; else if (HINT.i.has(b)) v.stem = 'i';
    if (HINT.like[b]) v.like = HINT.like[b];
    verbs.set(e.bare, { inf: e.bare, en: e.en, v: v });
  });
  function formsOf(rec) {
    const v = rec.v, refl = /se$/.test(v.inf), set = new Set();
    const add = f => { f = String(f || '').toLowerCase().trim(); if (f && /^[a-zñáéíóúü]+$/.test(f)) set.add(f); };
    E.TENSES.forEach(t => {
      let arr; try { arr = E.conjugate(v, t.key); } catch (e) { return; }
      (arr || []).forEach(f => String(f || '').split(/\s*[\/,]\s*|\s+o\s+/).forEach(g => {
        const p = g.replace(/^no /, '').split(/\s+/);
        if (COMPOUND.has(t.key)) add(p[p.length - 1]);
        else { if (refl && p.length > 1) p.shift(); if (p.length === 1) add(p[0]); }
      }));
    });
    add(v.inf.replace(/se$/, ''));
    try { add(E.gerund(v)); } catch (e) { /* none */ }
    try {
      const pa = E.participle(v);
      if (pa) { add(pa); if (/o$/.test(pa)) { add(pa.replace(/o$/, 'a')); add(pa + 's'); add(pa.replace(/o$/, 'as')); } }
    } catch (e) { /* none */ }
    return [...set].filter(f => !FORM_STOP.has(f));
  }
  /* Forms come from the engine; the engine's regular conjugation is wrong for
   * stem-changers it was not told about, so the graph-only verbs get hints. */
  verbs.forEach(rec => {
    rec.refl = /se$/.test(rec.inf);
    rec.base = rec.refl ? rec.inf.slice(0, -2) : null;
    rec.forms = formsOf(rec);
  });
  /* Scoring. A form counts in full for the verb it belongs to, unless
   *  - it is also the bare form of a noun/adjective entry (cosa, trabajo, casa): 15%,
   *    because most of its subtitle count is the noun;
   *  - another verb makes it too (creo is creer and crear; siento is sentir and
   *    sentar): shared in proportion to each verb's unshared total. */
  const nounBare = new Set();
  ents.forEach(e => { if (!/\s/.test(e.bare) && !verbs.has(e.bare)) { nounBare.add(e.bare); nounBare.add(plural(e.bare)); } });
  const owners = new Map();
  verbs.forEach(r => { if (r.refl && verbs.has(r.base)) return; r.forms.forEach(f => { if (!owners.has(f)) owners.set(f, []); owners.get(f).push(r); }); });
  const weight = (r, f) => {
    if (!nounBare.has(f)) return 1;
    const pa = (() => { try { return E.participle(r.v); } catch (e) { return null; } })();
    let ge = null; try { ge = E.gerund(r.v); } catch (e) { /* none */ }
    return (f === r.inf.replace(/se$/, '') || f === ge || (pa && (f === pa || f === pa.replace(/o$/, 'a') || f === pa + 's'))) ? 1 : 0.15;
  };
  verbs.forEach(r => {
    r.unique = r.forms.reduce((t, f) => t + ((owners.get(f) || []).length === 1 ? weight(r, f) * cnt(f) : 0), 0);
  });
  verbs.forEach(r => {
    r.score = Math.round(r.forms.reduce((t, f) => {
      const o = owners.get(f) || [r];
      const tot = o.reduce((a, x) => a + x.unique + 1, 0);
      return t + weight(r, f) * cnt(f) * ((r.unique + 1) / tot);
    }, 0));
  });
  const allVerbForms = new Set();
  verbs.forEach(r => r.forms.forEach(f => allVerbForms.add(f)));

  /* ---- classify the rest ------------------------------------------------ */
  const words = [], phrases = [];
  const verbScoreOf = inf => { const r = verbs.get(inf); return r ? r.score : null; };
  const tokCount = t => {
    t = t.replace(/[.,;:¿?¡!]/g, '').toLowerCase();
    const vs = verbScoreOf(t); if (vs !== null) return vs;
    return cnt(t) + cnt(plural(t));
  };
  ents.forEach(e => {
    if (!e.hasArt && !/\s/.test(e.bare) && (verbs.has(e.bare))) {
      const r = verbs.get(e.bare); // fill the verb's cefr/theme from its VOCAB/graph entry
      r.cefr = e.cefr; r.theme = e.theme; r.vocabEs = e.es; return;
    }
    if (/\s/.test(e.bare)) {
      const toks = e.bare.split(/\s+/).map(t => t.replace(/[.,;:¿?¡!]/g, '').toLowerCase()).filter(Boolean);
      const content = toks.filter(t => !PH_STOP.has(t));
      const use = content.length ? content : toks;
      const isInf = t => verbs.has(t) || (/se$/.test(t) && verbs.has(t.slice(0, -2)));
      /* "ir salir estar" and "irse a" are notes about a verb, not phrases to translate */
      if (toks.every(isInf) || (content.length === 1 && isInf(content[0]))) { stats.excluded.verbFragments = (stats.excluded.verbFragments || []).concat(e.es); return; }
      e.score = Math.min.apply(null, use.map(tokCount));
      phrases.push(e);
      return;
    }
    const fs_ = new Set([e.bare]);
    const isFunc = FUNC.has(e.bare);
    /* a plural that has an entry of its own (personas, huevos) is scored there, not twice */
    if (!isFunc && (e.hasArt || e.bare.length >= 4 || PLURAL_OK.has(e.bare)) && !/^to /.test(e.en) && !byKey.has(plural(e.bare))) fs_.add(plural(e.bare));
    if (!e.hasArt && /o$/.test(e.bare) && e.bare.length > 3 && !NOFEM.has(e.bare) && !/^to /.test(e.en)) {
      const st = e.bare.slice(0, -1);
      fs_.add(st + 'a'); fs_.add(st + 'os'); fs_.add(st + 'as');
    }
    e.score = [...fs_].reduce((s, f) => s + cnt(f), 0);
    e.forms = [...fs_];
    words.push(e);
  });

  /* ---- region: Latin American Spanish ----------------------------------
   * The subtitles lean to Spain (coche ranked 236, carro 1,156), and Fluidez
   * teaches Latin American Spanish. tools/freq/region.json pairs a Spain word
   * with the word taught here: the LatAm word takes the pair's combined count
   * (it is the same meaning, said the other way), and the Spain word keeps 5%
   * and is marked sp: 1 so the grind never asks for it. A LatAm word the data
   * does not have yet (estacionar, enojarse) is skipped and listed. */
  const RG = readJson('region.json', {});
  stats.regionMissing = [];
  const findEntry = es => words.find(e => e.es === es) || verbs.get(es);
  Object.keys(RG).filter(k => k[0] !== '_').forEach(spain => {
    const a = findEntry(spain), b = findEntry(RG[spain]);
    if (!a || !b) { stats.regionMissing.push(spain + ' -> ' + RG[spain]); return; }
    b.score += a.score;
    a.score = Math.floor(a.score * DEMOTE);
    a.sp = true;
  });

  /* ---- overrides and automatic demotions ------------------------------- */
  const applyOv = list => {
    const moves = [];
    list.forEach(e => {
      let ov = OV[e.es];
      if (!ov && e.hasArt && /^[a-zñáéíóúü]+$/.test(e.bare) && (FUNC.has(e.bare) || (INF_RE.test(e.bare) && verbs.has(e.bare)))) {
        ov = { rank: 'demote', note: 'auto: noun whose form is a function word or an infinitive' };
        stats.autoDemoted.push(e.es);
      }
      if (!ov) return;
      e.ov = ov;
      if (ov.show) e.es = ov.show;
      if (ov.rank === 'exclude') { e.gone = true; return; }
      if (ov.rank === 'demote') e.score = Math.floor(e.score * (ov.share || DEMOTE));
      else if (typeof ov.rank === 'number') moves.push(e);
    });
    return moves;
  };
  const mv = { w: applyOv(words), p: applyOv(phrases) };
  const bandIx = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
  const cmp = (a, b) => b.score - a.score || ((bandIx[a.cefr] === undefined ? 9 : bandIx[a.cefr]) - (bandIx[b.cefr] === undefined ? 9 : bandIx[b.cefr])) ||
    a.bare.split(' ').length - b.bare.split(' ').length || (a.es < b.es ? -1 : a.es > b.es ? 1 : 0);
  const place = (list, moves) => {
    for (let i = list.length - 1; i >= 0; i--) if (list[i].gone) list.splice(i, 1);
    list.sort(cmp);
    moves.forEach(e => { list.splice(list.indexOf(e), 1); });
    moves.sort((a, b) => a.ov.rank - b.ov.rank).forEach(e => list.splice(e.ov.rank - 1, 0, e));
    return list;
  };
  place(words, mv.w); place(phrases, mv.p);

  /* verbs: reflexives directly after their base */
  const vlist = [...verbs.values()].filter(r => !r.refl || !verbs.has(r.base) || true);
  const baseList = vlist.filter(r => !(r.refl && verbs.has(r.base))).sort((a, b) => b.score - a.score ||
    (a.inf < b.inf ? -1 : 1));
  const reflOf = {};
  vlist.filter(r => r.refl && verbs.has(r.base)).forEach(r => (reflOf[r.base] = reflOf[r.base] || []).push(r));
  const verbOut = [];
  baseList.forEach(r => {
    verbOut.push(r);
    (reflOf[r.inf] || []).sort((a, b) => b.score - a.score).forEach(x => verbOut.push(x));
  });
  verbOut.forEach(r => {
    const e = byKey.get(r.inf) || (r.refl && byKey.get(r.inf));
    if (e) { r.cefr = r.cefr || e.cefr; r.theme = r.theme || e.theme; }
    const ov = OV[r.inf]; if (ov) r.ov = ov;
  });
  verbOut.forEach(r => { if (!r.cefr && r.refl) { const b = verbs.get(r.base); if (b) r.cefr = b.cefr; } });
  // profanity among verbs
  const verbFinal = verbOut.filter(r => !PROF.has(r.inf.replace(/se$/, '')) || (stats.excluded.profanity.push(r.inf), false));

  /* tools/freq/glosses.json: reviewed prompts. { "<es as listed>": { en, th (theme or null), g: 1 } }.
   * en replaces the gloss, th replaces the theme (null clears it), g: 1 marks a grammar word the
   * arcade grind skips (articles, clitics, possessive determiners). Every other gloss only gets
   * " / " and "; " turned into ", ". */
  const GL = readJson('glosses.json', {});
  const glUsed = new Set();
  const tidy = en => String(en).replace(/\s+\/\s+/g, ', ').replace(/;\s+/g, ', ');
  const pack = (list, kind) => list.map((e, i) => {
    const es = kind === 'v' ? e.inf : e.es;
    const o = { es: es, en: tidy(e.en) };
    o.th = e.theme || null;
    o.c = e.cefr || null;
    o.r = i + 1;
    if (e.sp) o.sp = 1;
    const gl = GL[es];
    if (gl && kind !== 'p') {
      glUsed.add(es);
      if (gl.en) o.en = gl.en;
      if (Object.prototype.hasOwnProperty.call(gl, 'th')) o.th = gl.th || null;
      if (gl.g) o.g = 1;
    }
    return o;
  });
  const data = {
    words: pack(words.slice(0, WORDS_MAX), 'w'),
    verbs: pack(verbFinal, 'v'),
    phrases: pack(phrases.slice(0, PHRASES_MAX), 'p')
  };
  stats.glossUnused = Object.keys(GL).filter(k => !glUsed.has(k));
  return { data, ctx: { freq, order, cnt, ents, words, verbs: verbFinal, phrases, stats, allVerbForms, EX, OV, plural, byKey, verbMap: verbs } };
}

function serialise(data) {
  const lit = o => '{es:' + JSON.stringify(o.es) + ',en:' + JSON.stringify(o.en) + (o.th ? ',th:' + JSON.stringify(o.th) : '') +
    (o.c ? ',c:"' + o.c + '"' : '') + ',r:' + o.r + (o.g ? ',g:1' : '') + '}';
  const arr = l => '[\n' + l.map(lit).join(',\n') + '\n]';
  return `/* ============================================================================
 * WORD RANK — GENERATED. Do not edit by hand.
 *
 *   node tools/build-frequency.js
 *
 * The most common Spanish words, verbs and phrases first, for Palabras in the
 * Juegos arcade. Entries are { es, en, th (theme or absent), c (cefr), r (rank
 * within its list, 1 = most common), g (1 = grammar word: article, clitic or
 * possessive; the grind skips it, it still counts for coverage) }. Glosses,
 * themes and g come from tools/freq/glosses.json.
 *
 * SOURCE. OpenSubtitles 2018 word-form counts (github.com/hermitdave/FrequencyWords,
 * tools/freq/es_50k.txt). Content licence CC BY-SA 4.0; this ranking is derived
 * from it and is shared under the same licence (creativecommons.org/licenses/by-sa/4.0/).
 *
 * METHOD. VOCAB and the course graph merged and deduped on the Spanish without
 * its article. Words: form + plural (+ feminine for -o adjectives). Verbs: the
 * sum of every conjugated form the engine makes; reflexives sit just after
 * their base. Phrases: the count of the rarest content word. Homographs such as
 * "el sobre" are demoted by tools/freq/overrides.json. Names, profanity,
 * abbreviations and entries with notation are left out.
 *
 * ${data.words.length} words, ${data.verbs.length} verbs, ${data.phrases.length} phrases.
 * ========================================================================== */
window.WORD_RANK = {
words: ${arr(data.words)},
verbs: ${arr(data.verbs)},
phrases: ${arr(data.phrases)}
};
`;
}

module.exports = { compute, serialise, plural };

if (require.main === module) {
  const { data, ctx } = compute();
  const stats = ctx.stats;
  const body = serialise(data);
  if (process.argv.indexOf('--check') !== -1) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (cur === body) { console.log('✅ data/word-rank.js is up to date.'); process.exit(0); }
    console.error('❌ data/word-rank.js is stale. Run: node tools/build-frequency.js');
    process.exit(1);
  }
  fs.writeFileSync(OUT, body);
  console.log('wrote data/word-rank.js: ' + data.words.length + ' words, ' + data.verbs.length + ' verbs, ' +
    data.phrases.length + ' phrases, ' + Math.round(body.length / 1024) + ' KB');
  if (stats.regionMissing.length) console.log('region pairs skipped (a side is missing): ' + stats.regionMissing.join(', '));
}
