#!/usr/bin/env node
/* ============================================================================
 * build-verbs.js: francais/data/verbs.js (window.FR_VERBS) for Couramment.
 *   node tools/fr/build-verbs.js [--report]
 * Order: hermitdave FrequencyWords fr 2018, inflected words mapped to their
 * infinitive through kaikki's form_of. Forms: kaikki conjugation tables
 * (English Wiktionary), cross-checked with a rule conjugator for the regular
 * groups (-er with the spelling changes, -ir in -issons, -re in -dre) and with
 * consistency rules for the irregulars (imparfait from nous, conditionnel from
 * the future stem, impératif from the présent). Every disagreement is printed;
 * settle it in src/verb-fix.json:
 *   set  { verb: { "pres.je": "...", "subj.nous": ..., "pp": ..., "imper.tu": ... } }  hand override
 *   ok   { verb: ["field", ...] | "all" }  the table is right, the rule is wrong
 *   en   { verb: "gloss" }   drop [verbs]   force [verbs]
 * Auxiliary (avoir/être) is not in the tables: src/verb-aux.json, which also
 * lists the pronominal verbs and where their forms come from.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const K = require('./kaikki-index.js');
const fix = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'verb-fix.json'), 'utf8'));
const AUX = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'verb-aux.json'), 'utf8'));
const N = 300;
const PERS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
const MUST = ['être', 'avoir', 'aller', 'faire', 'dire', 'pouvoir', 'vouloir', 'savoir', 'voir', 'venir', 'prendre', 'mettre', 'devoir', 'falloir', 'parler', 'manger', 'commencer', 'finir',
  'appeler', 'jeter', 'acheter', 'espérer', 'payer', 'nettoyer', 'envoyer', 'lever', 'préférer', 'répéter', 'choisir', 'vendre', 'attendre', 'répondre', 'pleuvoir', 'connaître', 'croire', 'vivre',
  'écrire', 'lire', 'ouvrir', 'offrir', 'partir', 'sortir', 'dormir', 'sentir', 'courir', 'mourir', 'naître', 'devenir', 'revenir', 'tenir', 'comprendre', 'apprendre', 'boire', 'recevoir',
  'rester', 'tomber', 'arriver', 'entrer', 'monter', 'descendre', 'passer', 'retourner', 'rentrer', 'aimer', 'habiter', 'travailler', 'jouer', 'regarder', 'écouter', 'donner', 'trouver',
  'penser', 'demander', 'chercher', 'marcher', 'voyager', 'cuisiner', 'danser', 'chanter', 'étudier', 'oublier', 'visiter', 'téléphoner', 'rencontrer', 'acheter', 'conduire', 'plaire', 'rire', 'suivre',
  'ouvrir', 'fermer', 'attendre', 'perdre', 'gagner', 'payer', 'essayer', 'ennuyer', 'se lever', 'se coucher', 'se laver', 'se réveiller', 'se souvenir', 's\'appeler'].concat(Object.keys(AUX.pron), fix.force || []);
// inflected forms that are really other words, and verbs too rare or too rude for a beginner
const DROP = new Set(['baiser', 'niquer', 'chier', 'foutre', 'bander', 'branler', 'enculer', 'pisser', 'merder', 'crever', 'buter', 'défoncer', 'sucer', 'violer', 'tuer', 'massacrer', 'torturer',
  'gêner', 'pouvoir_', 'poser_', 'puer', 'bouffer', 'piquer', 'virer', 'planter', 'balancer', 'péter', 'roter', 'cracher', 'mater', 'bosser', 'bouler', 'moudre', 'seoir', 'gésir', 'choir',
  'fier', 'advenir', 'sourdre', 'accroire', 'chaloir', 'clore', 'comparoir', 'déchoir', 'échoir', 'forclore', 'férir', 'issir', 'occire', 'ouïr', 'quérir', 'ravoir', 'surseoir', 'traire', 'vêtir'].concat(fix.drop || []));

/* ---- the rule conjugator -------------------------------------------------- */
const DOUBLE = /^(r?appeler|épeler|jeter|rejeter|projeter|surjeter|renouveler|ensorceler|étiqueter|feuilleter|cacheter|interpeller|hoqueter|décacheter|déjeter)$/;
const YER = /[^aeiouy]?(ay|oy|uy)er$/;
function stemPlus(stem, ending) {                    // g -> ge, c -> ç before a, o
  if (/^[aouâô]/.test(ending)) { if (/g$/.test(stem)) return stem + 'e' + ending; if (/c$/.test(stem)) return stem.slice(0, -1) + 'ç' + ending; }
  return stem + ending;
}
function erForms(inf) {
  const stem = inf.slice(0, -2);
  let mute = stem, fut = stem;                       // mute: before e es ent; fut: before -erai
  if (DOUBLE.test(inf)) { mute = stem + stem.slice(-1); fut = mute; }
  else if (YER.test(inf)) { mute = stem.slice(0, -1) + 'i'; fut = mute; }
  else if (/e[^aeiouyéèê]$/.test(stem) && !/^(?!)/.test(stem)) { mute = stem.slice(0, -2) + 'è' + stem.slice(-1); fut = mute; }
  else if (/é([^aeiouy]|[^aeiouy][lr])$/.test(stem)) { mute = stem.replace(/é([^é]*)$/, 'è$1'); }
  const ends = (a, b, c, d, e, f, s) => ({ je: s(a), tu: s(b), il: s(c), nous: d, vous: e, ils: s(f) });
  const m = x => mute + x;
  const pres = { je: m('e'), tu: m('es'), il: m('e'), nous: stemPlus(stem, 'ons'), vous: stem + 'ez', ils: m('ent') };
  const imp = {}; ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].forEach((e, i) => { imp[PERS[i]] = stemPlus(stem, e); });
  const fu = {}; ['erai', 'eras', 'era', 'erons', 'erez', 'eront'].forEach((e, i) => { fu[PERS[i]] = fut + e; });
  const co = {}; ['erais', 'erais', 'erait', 'erions', 'eriez', 'eraient'].forEach((e, i) => { co[PERS[i]] = fut + e; });
  const subj = { je: m('e'), tu: m('es'), il: m('e'), nous: stem + 'ions', vous: stem + 'iez', ils: m('ent') };
  return { pres, imp, fut: fu, cond: co, subj, imper: { tu: pres.je, nous: pres.nous, vous: pres.vous }, pp: stem + 'é', ppr: stemPlus(stem, 'ant') };
}
function irForms(inf) {
  const st = inf.slice(0, -1), s = st + 'ss';
  const pres = { je: st + 's', tu: st + 's', il: st + 't', nous: s + 'ons', vous: s + 'ez', ils: s + 'ent' };
  const imp = {}; ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].forEach((e, i) => { imp[PERS[i]] = s + e; });
  const fu = {}; ['ai', 'as', 'a', 'ons', 'ez', 'ont'].forEach((e, i) => { fu[PERS[i]] = inf + e; });
  const co = {}; ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].forEach((e, i) => { co[PERS[i]] = inf + e; });
  const subj = { je: s + 'e', tu: s + 'es', il: s + 'e', nous: s + 'ions', vous: s + 'iez', ils: s + 'ent' };
  return { pres, imp, fut: fu, cond: co, subj, imper: { tu: pres.tu, nous: pres.nous, vous: pres.vous }, pp: st, ppr: s + 'ant' };
}
function reForms(inf) {
  const st = inf.slice(0, -2);
  const pres = { je: st + 's', tu: st + 's', il: st, nous: st + 'ons', vous: st + 'ez', ils: st + 'ent' };
  const imp = {}; ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].forEach((e, i) => { imp[PERS[i]] = st + e; });
  const fu = {}; ['rai', 'ras', 'ra', 'rons', 'rez', 'ront'].forEach((e, i) => { fu[PERS[i]] = st + e; });
  const co = {}; ['rais', 'rais', 'rait', 'rions', 'riez', 'raient'].forEach((e, i) => { co[PERS[i]] = st + e; });
  const subj = { je: st + 'e', tu: st + 'es', il: st + 'e', nous: st + 'ions', vous: st + 'iez', ils: st + 'ent' };
  return { pres, imp, fut: fu, cond: co, subj, imper: { tu: pres.tu, nous: pres.nous, vous: pres.vous }, pp: st + 'u', ppr: st + 'ant' };
}
/* the rule conjugator for a verb whose group the table confirms, else null */
function ruleFor(inf, g) {
  if (/er$/.test(inf) && !/^(aller|envoyer|renvoyer)$/.test(inf)) return erForms(inf);
  if (/ir$/.test(inf) && g.pres && g.pres.nous && /issons$/.test(g.pres.nous) && !/^(haïr|fleurir|maudire)$/.test(inf)) return irForms(inf);
  if (/(end|ond|erd|ord)re$/.test(inf) && !/prendre$/.test(inf)) return reForms(inf);
  return null;
}
/* consistency checks that hold for nearly every French verb */
function consistency(g, inf) {
  const out = {};
  const nous = g.pres && g.pres.nous;
  if (nous && /ons$/.test(nous) && inf !== 'être') {
    const s = nous.slice(0, -3);
    out['imp.je'] = s + 'ais'; out['imp.nous'] = s + 'ions'; out['imp.ils'] = s + 'aient';
    if (g.ppr) out.ppr = s + 'ant';
  }
  if (g.fut && g.fut.je && /ai$/.test(g.fut.je)) {
    const s = g.fut.je.slice(0, -2);
    out['cond.je'] = s + 'ais'; out['cond.nous'] = s + 'ions'; out['cond.ils'] = s + 'aient';
    out['fut.nous'] = s + 'ons'; out['fut.il'] = s + 'a';
  }
  if (g.pres) { out['imper.nous'] = g.pres.nous; out['imper.vous'] = g.pres.vous; }
  if (g.pres && g.pres.tu) out['imper.tu'] = /er$|^(ouvrir|offrir|souffrir|couvrir|cueillir|accueillir|découvrir|savoir)$/.test(inf) && /es$/.test(g.pres.tu) ? g.pres.tu.slice(0, -1) : g.pres.tu;
  if (g.imp && g.subj && g.subj.nous) out['subj.nous'] = g.imp.nous;
  if (g.imp && g.subj && g.subj.vous) out['subj.vous'] = g.imp.vous;
  return out;
}

/* ---- tables -------------------------------------------------------------- */
const TAGS = (f) => f[1].split(',');
function firstBlock(cf) {                        // the table for the plain verb: up to the second infinitive
  let seen = 0;
  const out = [];
  for (const f of cf) { if (TAGS(f).includes('infinitive')) { seen++; if (seen > 1) break; } out.push(f); }
  return out;
}
const CLITIC = /^(me |te |se |nous |vous |m'|t'|s')/;
function clean(form, pron) {
  if (!form || form === '-') return null;
  let f = form;
  if (pron) f = f.replace(CLITIC, '').replace(/-(toi|nous|vous)$/, '');
  return f;
}
function table(e, pron) {
  const cf = firstBlock(e.cf || []);
  const has = (f, ...t) => t.every(x => TAGS(f).includes(x));
  const per = (f) => {
    const sg = has(f, 'singular'), pl = has(f, 'plural');
    if (has(f, 'first-person')) return sg ? 'je' : pl ? 'nous' : null;
    if (has(f, 'second-person')) return sg ? 'tu' : pl ? 'vous' : null;
    if (has(f, 'third-person')) return sg ? 'il' : pl ? 'ils' : null;
    return null;
  };
  const t = { pres: {}, imp: {}, fut: {}, cond: {}, subj: {}, imper: {} };
  for (const f of cf) {
    const p = per(f); const v = clean(f[0], pron);
    const tg = TAGS(f);
    if (tg.includes('infinitive')) continue;
    if (tg.includes('participle')) { if (tg.includes('past') && !t.pp) t.pp = v; else if (tg.includes('present') && !t.ppr) t.ppr = v; continue; }
    if (tg.includes('perfect') || tg.includes('pluperfect') || tg.includes('anterior')) continue;
    let tense = null;
    if (tg.includes('imperative')) { tense = 'imper'; }
    else if (tg.includes('subjunctive')) { tense = tg.includes('imperfect') ? null : 'subj'; }
    else if (tg.includes('indicative')) tense = tg.includes('imperfect') ? 'imp' : tg.includes('future') ? 'fut' : tg.includes('present') ? 'pres' : null;
    else if (tg.includes('conditional')) tense = 'cond';
    if (!tense) continue;
    if (tense === 'imper') { const ip = tg.includes('second-person') && tg.includes('singular') ? 'tu' : tg.includes('first-person') && tg.includes('plural') ? 'nous' : tg.includes('second-person') && tg.includes('plural') ? 'vous' : null; if (ip && !(ip in t.imper)) t.imper[ip] = v; continue; }
    if (p && !(p in t[tense])) t[tense][p] = v;
  }
  return t;
}

/* ---- candidates ------------------------------------------------------------ */
function frequency() {
  return fs.readFileSync(path.join(__dirname, 'vendor', 'fr_50k.txt'), 'utf8').split('\n').map(l => l.split(' ')).filter(a => a[1]).map(a => [a[0], +a[1]]);
}
function isInf(I, w) { return (I[w] || []).some(e => e.pos === 'verb' && e.cf && e.cf.some(f => TAGS(f).includes('infinitive'))); }
function scores(I) {
  const score = {};
  for (const [w, c] of frequency()) {
    const forms = (I[w] || []).filter(e => e.pos === 'verb' && e.of);
    const lem = [...new Set(forms.flatMap(e => e.of))].filter(l => isInf(I, l));
    if (isInf(I, w)) {
      score[w] = (score[w] || 0) + (lem.length ? c * 0.2 : c);
      lem.forEach(l => { score[l] = (score[l] || 0) + c * 0.8 / lem.length; });
      continue;
    }
    if (!lem.length) continue;
    const other = (I[w] || []).some(e => !e.of && !['name', 'abbrev', 'character', 'symbol'].includes(e.pos));
    if (other) continue;                       // fait, peut-être: the noun first; the infinitive carries the verb
    lem.forEach(l => { score[l] = (score[l] || 0) + c / lem.length; });
  }
  return score;
}
function gloss(e) {
  const g = (e.gl || [])[0] || '';
  let s = g.replace(/\([^)]*\)/g, '').split(/[;,]/)[0].trim().replace(/^to\s+/, '').replace(/[–—]/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ');
  if (s.length > 34 || !s) s = s.split(' ').slice(0, 3).join(' ');
  return s;
}
const getPath = (g, k) => { const [a, b] = k.split('.'); return b ? (g[a] || {})[b] : g[a]; };
const setPath = (g, k, v) => { const [a, b] = k.split('.'); if (b) { g[a] = g[a] || {}; g[a][b] = v; } else g[a] = v; };

function build() {
  const I = K.load();
  const sc = scores(I);
  const pronSrc = AUX.pron;
  const ranked = Object.entries(sc).sort((a, b) => b[1] - a[1]).map(a => a[0]).filter(v => !DROP.has(v) && !/[\s']/.test(v) && !(v in pronSrc));
  const chosen = new Set(MUST);
  for (const v of ranked) { if (chosen.size >= N) break; chosen.add(v); }
  const sortKey = v => sc[v] || sc[pronSrc[v]] * 0.4 || 0;
  const order = [...chosen].sort((a, b) => sortKey(b) - sortKey(a));
  const out = [], problems = [], settled = [], unsettled = [];
  for (const inf of order) {
    const src = pronSrc[inf] || inf, pron = inf in pronSrc;
    const srcPron = /^(se |s')/.test(src);
    const es = (I[src] || []).filter(x => x.pos === 'verb' && x.cf && x.cf.some(f => TAGS(f).includes('infinitive')));
    if (!es.length) { problems.push(inf + ': not in kaikki'); continue; }
    const e = es[0];
    const g = table(e, srcPron);
    const base = pron ? (srcPron ? src.replace(/^(se |s')/, '') : src) : inf;
    const F = (fix.set || {})[inf] || {}, OK = (fix.ok || {})[inf] || [];
    const RW = (fix.rule || {})[inf] || (/é([^aeiouy]|[^aeiouy][lr])er$/.test(base) ? ['fut', 'cond'] : []);   // the traditional é in répéterai, not Wiktionary's répèterai
    const defective = inf === 'falloir' || inf === 'pleuvoir';
    const rule = ruleFor(base, g);
    const cons = consistency(g, base);
    const check = (k, want, label) => {
      const got = getPath(g, k);
      if (!got || !want || got === want) return;
      if (F[k] !== undefined) settled.push(`${inf} ${k}: table ${got}, ${label} ${want}, set ${F[k]}`);
      else if (RW.some(t => k === t || k.startsWith(t + '.'))) settled.push(`${inf} ${k}: table ${got}, ${label} ${want}, rule kept`);
      else if (OK === 'all' || OK.includes(k) || OK.includes('*')) settled.push(`${inf} ${k}: table ${got}, ${label} ${want}, table kept`);
      else unsettled.push(`${inf} ${k}: table ${got}, ${label} ${want}`);
    };
    if (rule) {
      PERS.forEach(p => ['pres', 'imp', 'fut', 'cond', 'subj'].forEach(t => check(t + '.' + p, rule[t][p], 'rule')));
      ['tu', 'nous', 'vous'].forEach(p => check('imper.' + p, rule.imper[p], 'rule'));
      check('pp', rule.pp, 'rule'); check('ppr', rule.ppr, 'rule');
    } else Object.keys(cons).forEach(k => check(k, cons[k], 'consistency'));
    // fix.rule { verb: ["fut", "cond"] }: the rule wins for these tenses or fields (the traditional é in répéterai)
    if (rule) RW.forEach(t => { const keys = t.includes('.') ? [t] : t === 'pp' || t === 'ppr' ? [t] : PERS.map(p => t + '.' + p); keys.forEach(k => { const w = getPath(rule, k); if (w) setPath(g, k, w); }); });
    Object.keys(F).forEach(k => setPath(g, k, F[k]));
    const need = [];
    PERS.forEach(p => ['pres', 'imp', 'fut', 'cond', 'subj'].forEach(t => { if (!g[t][p]) need.push(t + '.' + p); }));
    // a verb with no imperative at all (pouvoir) simply has none
    if (['tu', 'nous', 'vous'].some(p => g.imper[p])) ['tu', 'nous', 'vous'].forEach(p => { if (!g.imper[p]) need.push('imper.' + p); });
    else delete g.imper;
    if (!g.pp) need.push('pp');
    if (need.length && !defective) problems.push(inf + ': table lacks ' + need.join(','));
    const aux = AUX.ae.includes(base) && !pron && AUX.e.includes(base) ? 'ae' : AUX.e.includes(inf) ? 'e' : 'a';
    const v = { v: inf, en: (fix.en || {})[inf] || gloss(e), r: 0, b: 'B1', aux: pron ? 'e' : aux };
    if (pron) v.pron = 1;
    if (defective) v.def = 1;
    const f = { pres: g.pres, imp: g.imp, fut: g.fut, cond: g.cond, subj: g.subj, imper: g.imper || undefined, pp: g.pp, ppr: g.ppr || null, inf };
    if (defective) { ['pres', 'imp', 'fut', 'cond', 'subj'].forEach(t => { f[t] = f[t].il ? { il: f[t].il } : {}; Object.keys(f[t]).length || delete f[t]; }); f.imper = undefined; delete f.imper; }
    v.f = f;
    out.push(v);
  }
  out.forEach((v, i) => { v.r = i + 1; v.b = i < 90 ? 'A1' : i < 200 ? 'A2' : 'B1'; });
  return { out, problems, settled, unsettled, sc };
}

if (require.main === module) {
  const { out, problems, settled, unsettled } = build();
  const report = process.argv.includes('--report');
  problems.forEach(p => console.log('  PROBLEM ' + p));
  unsettled.forEach(p => console.log('  UNSETTLED ' + p));
  if (report) settled.forEach(p => console.log('  settled ' + p));
  const head = `/* ============================================================================
 * VERBS: GENERATED by tools/fr/build-verbs.js. Do not edit.
 * ${out.length} verbs, commonest first. { v, en, r, b, aux ('a' | 'e' | 'ae'), pron?, def?, f: { pres, imp, fut, cond, subj, imper, pp, ppr, inf } }.
 * Forms: English Wiktionary conjugation tables via kaikki.org (CC BY-SA 4.0),
 * cross-checked with a rule conjugator and hand overrides (tools/fr/src/verb-fix.json).
 * Order: hermitdave FrequencyWords fr 2018, OpenSubtitles (CC BY-SA 4.0).
 * Pronominal verbs (pron) are stored without the pronoun: se lever has lève, not me lève.
 * Defective verbs (def: falloir, pleuvoir) have only the il forms.
 * This table is shared under CC BY-SA 4.0.
 * ========================================================================== */
`;
  fs.mkdirSync(path.join(ROOT, 'francais', 'data'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'francais', 'data', 'verbs.js'), head +
    '(function (w) {\nw.FR_VERBS = [\n' + out.map(e => JSON.stringify(e)).join(',\n') +
    '\n];\nif (typeof module !== "undefined" && module.exports) module.exports = w.FR_VERBS;\n})(typeof window !== "undefined" ? window : globalThis);\n');
  console.log(`${out.length} verbs, ${problems.length} problems, ${settled.length} disagreements settled, ${unsettled.length} unsettled`);
}
module.exports = { build, erForms, irForms, reForms };
