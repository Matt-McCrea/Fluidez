#!/usr/bin/env node
/* ============================================================================
 * build-words.js: francais/data/words.js (window.FR_WORDS) for Couramment.
 *   node tools/fr/build-words.js [--report]
 * Order: hermitdave FrequencyWords fr 2018, inflected words folded into their
 * lemma through kaikki form_of (maisons -> maison, grande -> grand, vais -> aller).
 * Gender, plural, feminine and plural adjective forms, gloss: English Wiktionary
 * via kaikki.org. Themes: the keyword map below, then hand fixes in src/word-fix*.json
 *   keep [words]   a noun/adj that is also a common verb form (sens, sort): keep as itself
 *   vf [words]     a word that is really a verb form (est, fait, a): count it for the verb
 *   drop [words]   en { word: gloss }   th { word: theme }   pos { word: pos }
 *   g { word: m|f|mf }   pl / fem / mpl / fpl { word: form | null }
 *   add [{ fr, en, th, pos, g?, pl?, fem?, mpl?, fpl?, after? }]
 * Bands by rank: A1 top 700, A2 to 1500, B1 to 2500, B2 rest.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const K = require('./kaikki-index.js');
// word-fix.json plus any word-fix-*.json (curation passes): lists concatenate, maps merge
const fix = {};
fs.readdirSync(path.join(__dirname, 'src')).filter(f => /^word-fix(-.+)?\.json$/.test(f)).sort().forEach(f => {
  const j = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', f), 'utf8'));
  Object.keys(j).forEach(k => {
    if (Array.isArray(j[k])) fix[k] = (fix[k] || []).concat(j[k]);
    else fix[k] = Object.assign(fix[k] || {}, j[k]);
  });
});
const TOTAL = 2800;
const THEMES = ['base', 'faire', 'decrire', 'nombres', 'couleurs', 'famille', 'gens', 'corps', 'nourriture', 'maison', 'ville', 'voyage', 'meteo', 'temps', 'travail', 'ecole', 'loisirs', 'vetements', 'sentiments', 'nature', 'langue', 'societe'];

const RUDE = new Set(['putain', 'putains', 'merde', 'merdes', 'merdique', 'con', 'cons', 'conne', 'connes', 'connard', 'connards', 'connasse', 'connerie', 'conneries', 'salope', 'salopes', 'salaud', 'salauds', 'salopard', 'pute', 'putes', 'bite', 'couille', 'couilles', 'cul', 'culs', 'chier', 'chiant', 'chiante', 'foutre', 'foutu', 'foutue', 'nique', 'niquer', 'enculé', 'enculer', 'enculés', 'bordel', 'nègre', 'négro', 'pédé', 'pédés', 'tapette', 'branler', 'branleur', 'baiser', 'baise', 'sexe', 'sexes', 'sexy', 'sexuel', 'sexuelle', 'sexuels', 'sexuelles', 'sexualité', 'nu', 'nue', 'nus', 'nues', 'nudité', 'porno', 'pornographie', 'pénis', 'vagin', 'sperme', 'érection', 'bander', 'zob', 'chatte', 'cocu', 'prostituée', 'prostituées', 'prostitution', 'prostitué', 'gouine', 'bougnoule', 'youpin', 'mongol', 'bâtard', 'bâtards', 'bâtarde', 'garce', 'garces', 'emmerder', 'emmerde', 'emmerdeur', 'nazi', 'nazis', 'meurtre', 'meurtres', 'meurtrier', 'meurtriers', 'meurtrière', 'viol', 'violer', 'violé', 'violeur', 'cadavre', 'cadavres', 'tuer', 'massacre', 'massacrer', 'tueur', 'tueurs', 'tuerie', 'crétin', 'crétins', 'imbécile', 'imbéciles', 'idiot', 'idiots', 'idiote', 'débile', 'débiles', 'ordure', 'ordures', 'fesse', 'fesses', 'seins', 'sein', 'nichons', 'poitrine', 'cochon', 'cochons', 'cochonne', 'salle', 'bordels', 'pisser', 'pisse', 'pipi', 'caca', 'crotte', 'fiche', 'fichu', 'fichue', 'dégueulasse', 'ta', 'poufiasse', 'pd', 'fdp', 'wesh', 'bouffon', 'bouffe', 'bouffer', 'enfoiré', 'enfoirés', 'trou', 'ptain', 'nom', 'sida', 'drogué', 'drogués', 'pervers', 'perverse', 'perversion', 'vierge', 'virginité', 'maîtresse', 'amant', 'amants', 'érotique', 'sensuel', 'sensuelle', 'gay', 'gays', 'lesbienne', 'lesbiennes', 'homosexuel', 'homosexuelle', 'homosexuels', 'gigolo', 'hôtesse', 'orgasme', 'masturbation', 'allumeuse', 'chienne', 'salopes', 'pétasse', 'connasses', 'mec', 'mecs', 'meuf', 'nana', 'nanas', 'flic', 'flics', 'keuf', 'poule', 'poules']);
// NOTE: 'salle', 'ta', 'nom', 'poule', 'mec', 'flic' etc. are NOT rude and are re-allowed below; the list above is trimmed here.
['salle', 'ta', 'nom', 'poule', 'poules', 'mec', 'mecs', 'flic', 'flics', 'nana', 'nanas', 'vierge', 'maîtresse', 'trou', 'fiche', 'fichu', 'fichue', 'bouffe', 'cochon', 'cochons', 'hôtesse', 'meuf', 'gay', 'gays', 'lesbienne', 'lesbiennes', 'homosexuel', 'homosexuelle', 'homosexuels', 'amant', 'amants', 'sein', 'seins', 'poitrine', 'nu', 'nue', 'nus', 'nues', 'drogué', 'drogués', 'sensuel', 'sensuelle'].forEach(w => RUDE.delete(w));
const BAD_TAGS = ['vulgar', 'offensive', 'derogatory', 'ethnic', 'slur', 'obscene', 'pejorative', 'sexual'];
const ODD_TAGS = ['rare', 'dated', 'archaic', 'obsolete', 'dialectal', 'Belgium', 'regional', 'nonstandard', 'colloquial', 'Quebec', 'Switzerland', 'Canada', 'Louisiana', 'Acadia', 'Africa', 'Cameroon', 'slang', 'literary', 'Cajun', 'Haiti', 'Morocco', 'Algeria', 'Tunisia', 'Lebanon', 'Mauritius', 'Réunion', 'Congo', 'Senegal'];
const FUNC = ['prep', 'postp', 'pron', 'conj', 'det', 'article', 'num', 'particle', 'contraction'];
const PRIORITY = ['prep', 'postp', 'pron', 'conj', 'det', 'article', 'contraction', 'num', 'particle', 'adj', 'adv', 'noun', 'intj', 'phrase'];
const POSMAP = { noun: 'n', verb: 'v', adj: 'adj', adv: 'adv', prep: 'prep', postp: 'prep', pron: 'pron', num: 'num', conj: 'x', det: 'x', article: 'x', particle: 'x', intj: 'x', phrase: 'x', contraction: 'x' };

function frequency() {
  return fs.readFileSync(path.join(__dirname, 'vendor', 'fr_50k.txt'), 'utf8').split('\n').map(l => l.split(' ')).filter(a => a[1]).map(a => [a[0], +a[1]]);
}
const isInf = (I, w) => (I[w] || []).some(e => e.pos === 'verb' && e.cf && e.cf.some(f => f[1].split(',').includes('infinitive')));
const lemmaEntries = (I, w) => (I[w] || []).filter(e => !e.of && POSMAP[e.pos] && !(e.pos === 'verb' && !(e.cf && e.cf.length)));
const badEntry = e => (e.tags || []).some(t => BAD_TAGS.includes(t)) || /^(abbreviation|initialism|acronym|surname|given name|female given|male given|syllable|letter)/i.test((e.gl || [])[0] || '');

/* ---- gloss ----------------------------------------------------------------- */
function gloss(e) {
  const gl = (e.gl || []).filter(g => !/^(alternative|obsolete|plural of|inflection|abbreviation|diminutive of|pronunciation|nonstandard|dated|eye dialect|clipping|feminine singular|masculine plural|feminine plural|spelling|misspelling|informal|archaic|Rectified|Superseded|Contraction)/i.test(g) && !/\bform of\b/i.test(g));
  const g = gl[0] || (e.gl || [])[0] || '';
  let s = g.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  if (e.pos === 'noun' || e.pos === 'adj') s = s.replace(/\s+(of an?|of the|used|that|which|who|especially|in the sense)\s.*$/, '');
  const parts = s.split(/\s*[;,]\s*/).map(x => x.replace(/^(a|an|the|to)\s+/i, '').trim()).filter(Boolean);
  let out = parts[0] || '';
  if (parts[1] && out.length <= 14 && (out + ', ' + parts[1]).length <= 26 && !/^(of|used|especially|male|female|human|any|someone|one)\b/.test(parts[1])) out += ', ' + parts[1];
  out = out.replace(/[–—]/g, ' ').replace(/\s-\s/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  out = out.replace(/:.*$/, '').replace(/\s+\d{3,4}\b.*$/, '').replace(/[\]\[.:;]+/g, '').replace(/\s+(in its various senses|in a|of either the|characteristic|including)\b.*$/, '').trim();
  if (out.length > 32) out = out.split(' ').slice(0, 4).join(' ');
  return out;
}

/* ---- themes ----------------------------------------------------------------- */
const KEY = [
  ['couleurs', 'red blue green yellow black white colour color orange pink purple grey gray brown violet'],
  ['famille', 'father mother brother sister son daughter parent parents child children family wife husband grandmother grandfather grandparent uncle aunt cousin baby kid sibling spouse relative nephew niece grandchild'],
  ['corps', 'head hand arm leg foot feet eye ear nose mouth hair face body heart finger skin blood tooth teeth back neck knee stomach throat doctor hospital medicine pain sick ill illness health healthy disease nurse bone lip tongue shoulder belly breath brain drug pill wound bath sleep'],
  ['nourriture', 'food eat drink meal bread water coffee tea milk cheese meat fish fruit vegetable egg beer wine breakfast lunch dinner restaurant sugar salt cake potato rice apple cook kitchen soup juice butter chicken pizza sandwich chocolate dish menu taste hungry thirsty bottle glass cup plate fork knife spoon'],
  ['maison', 'house home room door window bed table chair floor roof wall garden bathroom furniture key lamp apartment bedroom toilet stairs couch sofa carpet television tv heating rent lock flat shelf cupboard curtain address'],
  ['voyage', 'travel trip journey train bus car plane flight airport ticket hotel holiday vacation boat ship luggage road bike bicycle passport border taxi traffic drive abroad tourist map station track suitcase route'],
  ['meteo', 'weather rain sun sunny wind snow cloud storm cold hot warm temperature fog ice thunder dry wet'],
  ['temps', 'time day week month year hour minute second morning evening night today tomorrow yesterday moment season spring summer autumn winter monday tuesday wednesday thursday friday saturday sunday century date calendar noon afternoon midnight birthday january february march april may june july august september october november december future past present'],
  ['travail', 'work job office company business money pay salary price boss manager colleague meeting employee factory profession shop store customer client cost buy sell tax bank contract career industry trade'],
  ['ecole', 'school teacher student lesson class university exam book study education pupil learn homework college diploma grade subject test paper pen pencil library'],
  ['loisirs', 'game play sport football soccer music film movie party hobby song dance fun tv television holiday club concert theatre theater festival picnic swim walk ball team photo picture radio video guitar fishing paint art museum'],
  ['vetements', 'clothes clothing shirt dress coat shoe shoes hat trousers pants sock jacket wear suit skirt jeans sweater glove scarf belt bag purse uniform fashion cloth pocket button'],
  ['sentiments', 'feeling love fear joy anger happiness sadness emotion hope worry dream trust pride shame mood surprise excitement pity doubt jealousy courage laughter tear smile'],
  ['nature', 'animal dog cat bird horse tree flower forest sea river mountain earth sky moon star nature plant grass fish lake beach field cow pig sheep chicken mouse insect world sand stone rock island hill wood leaf air ocean water bee butterfly snake lion'],
  ['langue', 'word language sentence question answer name letter story speech dutch english french german phrase text dictionary meaning message conversation voice note sign grammar translation expression quote'],
  ['societe', 'law government country war state police rule peace freedom society politics news group president king queen army soldier crime court prison vote nation city public community church religion god official justice right election mayor'],
  ['ville', 'city town street shop market church village square building tower bridge neighbourhood neighborhood centre center park supermarket post pharmacy cinema theatre'],
  ['gens', 'man woman boy girl person people friend neighbour neighbor guy lady gentleman human stranger mister miss sir madam lad youth adult teenager individual somebody enemy partner guest']
];
const KEYSET = KEY.map(([t, s]) => [t, new Set(s.split(' '))]);
function theme(e, fr, pos, en) {
  if (fix.th && fix.th[fr]) return fix.th[fr];
  if (pos === 'num') return 'nombres';
  if (['prep', 'pron', 'x', 'adv'].includes(pos)) {
    const g = en.toLowerCase();
    if (/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|evening|today|tomorrow|yesterday|always|never|often|soon|now|then|later)\b/.test(g) && pos === 'adv') return 'temps';
    return 'base';
  }
  const toks = [];
  (e.gl || []).slice(0, 3).forEach(g => g.toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z]+/).forEach(t => t && toks.push(t)));
  const colorish = KEYSET[0][1];
  if (pos === 'adj') { return toks.slice(0, 4).some(t => colorish.has(t)) ? 'couleurs' : 'decrire'; }
  if (pos === 'v') return 'faire';
  for (const t of toks.slice(0, 8)) for (const [id, set] of KEYSET) if (set.has(t.replace(/s$/, '')) || set.has(t)) return id;
  return pos === 'n' ? 'societe' : 'base';
}

/* ---- noun, adjective details ------------------------------------------------ */
function nounGender(e) {
  const a = String(e.h1 || ''), x = e.hx || '';
  if (/^m,f|^f,m|^mf|^mfbysense/.test(a) || /\bm or f\b/.test(x)) return 'mf';
  if (/^m/.test(a)) return 'm';
  if (/^f/.test(a)) return 'f';
  const tags = e.tags || [];
  if (tags.includes('masculine') && tags.includes('feminine')) return 'mf';
  if (tags.includes('masculine')) return 'm';
  if (tags.includes('feminine')) return 'f';
  return null;
}
const forms = (e, only) => (e.fm || []).filter(f => { const t = f[1].split(','); return only.every(x => t.includes(x)) && f[0] !== '-' && !/\s/.test(f[0]) || false; }).map(f => f[0]);
const formsExact = (e, tags) => (e.fm || []).filter(f => f[1] === tags && f[0] !== '-' && !/\s/.test(f[0])).map(f => f[0]);
const REG = /^[a-zà-ÿœæ-]+$/;

function build() {
  const I = K.load();
  const verbsTable = fs.existsSync(path.join(ROOT, 'francais', 'data', 'verbs.js')) ? require(path.join(ROOT, 'francais', 'data', 'verbs.js')) : [];
  const topVerbs = new Set(verbsTable.filter(v => !v.pron).map(v => v.v));
  const score = {}, via = {};
  const add = (w, c, from) => { score[w] = (score[w] || 0) + c; if (from && from !== w) (via[w] = via[w] || {})[from] = c; };
  const dual = [];
  for (const [w, c] of frequency()) {
    if (!/^[a-zà-ÿœæ]+(-[a-zà-ÿœæ]+)?$/.test(w) || (w.length < 2 && !['a', 'à', 'y', 'ô'].includes(w)) || !I[w]) continue;
    if (RUDE.has(w) || (fix.drop || []).includes(w)) continue;
    const own = lemmaEntries(I, w).filter(e => !badEntry(e));
    const fo = (I[w] || []).filter(e => e.of);
    const verbTargets = [...new Set(fo.filter(e => e.pos === 'verb').flatMap(e => e.of))].filter(l => topVerbs.has(l) && l !== w);
    const otherTargets = [...new Set(fo.filter(e => e.pos !== 'verb').flatMap(e => e.of))].filter(l => l !== w && lemmaEntries(I, l).length);
    const keepOwn = (fix.keep || []).includes(w), verbOnly = (fix.vf || []).includes(w);
    let ownShare = 1, verbShare = 0, otherShare = 0;
    if (!own.length) { ownShare = 0; if (verbTargets.length && otherTargets.length) { verbShare = 0.7; otherShare = 0.3; } else if (verbTargets.length) verbShare = 1; else otherShare = 1; }
    else if (verbTargets.length || otherTargets.length) {
      const formAdj = fo.some(e => e.pos === 'adj');
      if (isInf(I, w) && !topVerbs.has(w) && !keepOwn) { ownShare = 0.1; verbShare = verbTargets.length ? 0.9 : 0; otherShare = verbTargets.length ? 0 : 0.9; }
      else if (isInf(I, w) || keepOwn) { ownShare = 0.85; otherShare = 0.15; verbShare = 0; }
      else if (formAdj && !verbTargets.length) { ownShare = 0.1; otherShare = 0.9; }
      else if (verbTargets.length && !own.some(e => FUNC.includes(e.pos) || e.pos === 'adv')) {
        ownShare = verbOnly ? 0.03 : 0.5; verbShare = 1 - ownShare; dual.push([w, own.map(e => e.pos).join('/'), verbTargets.join(','), verbOnly ? 'vf' : '']);
      } else { ownShare = 0.8; otherShare = 0.2; }
    }
    if (ownShare) add(w, c * ownShare);
    if (verbShare && verbTargets.length) verbTargets.forEach(l => add(l, c * verbShare / verbTargets.length, w));
    if (otherShare && otherTargets.length) otherTargets.forEach(l => add(l, c * otherShare / otherTargets.length, w));
    else if (otherShare && !otherTargets.length && own.length) add(w, c * otherShare);
  }
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]).map(a => a[0]);
  const out = [], problems = [], seen = new Set();
  for (const w of ranked) {
    if (out.length >= TOTAL) break;
    if ((fix.drop || []).includes(w) || RUDE.has(w)) continue;
    let ents = lemmaEntries(I, w).filter(e => !badEntry(e));
    if (!ents.length) continue;
    let e = null;
    const forcedPos = (fix.pos || {})[w];
    if (forcedPos) e = ents.find(x => POSMAP[x.pos] === forcedPos) || ents[0];
    if (!e && topVerbs.has(w)) e = ents.find(x => x.pos === 'verb');
    const odd = x => (x.tags || []).some(t => ['obsolete', 'archaic', 'dated'].includes(t)) || /^(alternative|obsolete|Rectified)/i.test((x.gl || [])[0] || '');
    const regional = x => (x.tags || []).some(t => ODD_TAGS.includes(t));
    const pickPos = p => { const c = ents.filter(x => x.pos === p); return c.find(x => !regional(x) && !odd(x)) || c.find(x => !odd(x)) || c[0]; };
    // function words first; otherwise the order of the Wiktionary page (maison is a noun before it is an adjective)
    if (!e) for (const p of PRIORITY.filter(p => FUNC.includes(p))) { const c = ents.filter(x => x.pos === p); if (c.length && c.every(odd) && ents.some(x => !odd(x))) continue; e = pickPos(p); if (e) break; }
    if (!e) { const good = ents.filter(x => !odd(x) && !regional(x)); const pool = good.length ? good : ents.filter(x => !odd(x)).length ? ents.filter(x => !odd(x)) : ents; const first = pool.find(x => x.pos !== 'phrase' && x.pos !== 'intj') || pool[0]; e = pickPos(first.pos); }
    if (!e) e = ents.find(x => x.pos === 'verb') || ents[0];
    const pos = forcedPos || POSMAP[e.pos];
    if (e.pos === 'verb' && !isInf(I, w)) continue;
    const fr = w;
    if (seen.has(fr)) continue; seen.add(fr);
    const vb = pos === 'v' && verbsTable.find(v => v.v === fr);
    const en = (fix.en || {})[fr] || (vb && vb.en) || gloss(e);
    if (!en) { problems.push(fr + ': no gloss'); continue; }
    if (!(fix.en || {})[fr] && /^(post|that$|whose|nonstandard|alternative|synonym|clipping|archaic|expressing|interjection|eye dialect|only used|variant|used|abruti|which does|whose)/i.test(en)) { problems.push(fr + ': junk gloss ' + en); continue; }
    const o = { fr, en, th: theme(e, fr, pos, en), pos };
    if (pos === 'n') {
      const g = (fix.g || {})[fr] || nounGender(e);
      if (!g) { problems.push(fr + ': noun with no gender'); continue; }
      o.g = g;
      const hx = e.hx || '';
      const pl = formsExact(e, 'plural')[0];
      if (pl) o.pl = pl;
      else if (/invariable|plural only|identical/.test(hx) || /^(m|f)-p$/.test(String(e.h1))) o.pl = fr;
      else if (!/uncountable/.test(hx)) { if (!/[sxz]$/.test(fr)) { o.pl = fr + 's'; problems.push(fr + ': noun with no plural form, guessed ' + o.pl); } else o.pl = fr; }
    } else if (pos === 'adj') {
      const hx = e.hx || '';
      const fem = formsExact(e, 'feminine')[0], mpl = formsExact(e, 'masculine,plural')[0], fpl = formsExact(e, 'feminine,plural')[0];
      const pl = formsExact(e, 'plural')[0];
      if (/invariable/.test(hx) && !fem) { o.fem = fr; o.mpl = fr; o.fpl = fr; }
      else {
        o.fem = fem || fr;
        o.mpl = mpl || pl || (/[sxz]$/.test(fr) ? fr : fr + 's');
        o.fpl = fpl || (fem ? (/s$/.test(fem) ? fem : fem + 's') : o.mpl);
        if (!fem && !/[e]$/.test(fr) && !/(identical|plural )/.test(hx)) problems.push(fr + ': adjective with no feminine form, using itself');
      }
    }
    ['pl', 'fem', 'mpl', 'fpl'].forEach(f => { if (fix[f] && fr in fix[f]) { if (fix[f][fr]) o[f] = fix[f][fr]; else delete o[f]; } });
    out.push(o);
  }
  (fix.add || []).forEach(a => { if (!seen.has(a.fr)) { seen.add(a.fr); const r = Object.assign({}, a); delete r.after; out.splice(Math.min(a.after || out.length, out.length), 0, r); } });
  out.forEach((o, i) => { o.r = i + 1; o.b = i < 700 ? 'A1' : i < 1500 ? 'A2' : i < 2500 ? 'B1' : 'B2'; });
  return { out, problems, dual, score, via };
}

if (require.main === module) {
  const { out, problems, dual } = build();
  const report = process.argv.includes('--report');
  if (report) { dual.slice(0, 120).forEach(d => console.log('  dual ' + d.join(' '))); }
  problems.slice(0, report ? 999 : 20).forEach(p => console.log('  PROBLEM ' + p));
  const byT = {}; out.forEach(e => { byT[e.th] = (byT[e.th] || 0) + 1; });
  const head = `/* ============================================================================
 * WORDS: GENERATED by tools/fr/build-words.js. Do not edit.
 * ${out.length} words, commonest first. { fr, en, th, pos, g, pl, fem, mpl, fpl, r, b }.
 * Gender, plural, adjective forms, gloss: English Wiktionary via kaikki.org
 * (CC BY-SA 4.0). Order: hermitdave FrequencyWords fr 2018, OpenSubtitles
 * (CC BY-SA 4.0). Themes by keyword map, hand fixes in tools/fr/src/word-fix*.json.
 * This table is shared under CC BY-SA 4.0.
 * ========================================================================== */
`;
  fs.mkdirSync(path.join(ROOT, 'francais', 'data'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'francais', 'data', 'words.js'), head +
    '(function (w) {\nw.FR_WORDS = [\n' + out.map(e => JSON.stringify(e)).join(',\n') +
    '\n];\nif (typeof module !== "undefined" && module.exports) module.exports = w.FR_WORDS;\n})(typeof window !== "undefined" ? window : globalThis);\n');
  console.log(`${out.length} words, ${problems.length} problems  ${JSON.stringify(byT)}`);
}
module.exports = { build, THEMES };
