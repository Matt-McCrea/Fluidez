#!/usr/bin/env node
/* ============================================================================
 * build-words.js: nederlands/data/words.js (window.NL_WORDS) for Vlot.
 *   node tools/nl/build-words.js [--report]
 * Order: hermitdave FrequencyWords nl 2018, inflected words folded into their
 * lemma through kaikki form_of (huizen -> huis, grote -> groot, wil -> willen).
 * Gender, plural, diminutive, -e form, gloss: English Wiktionary via kaikki.org.
 * Themes: the keyword map below, then hand fixes in src/word-fix.json
 *   keep [words]   a noun/adj that is also a common verb form (kan, werk): keep as itself
 *   drop [words]   en { word: gloss }   th { word: theme }   pos { word: pos }
 *   g { word: de|het|dh }   add [{ nl, en, th, pos, g?, pl?, dim?, ae?, after? }]
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
const THEMES = ['basis', 'doen', 'beschrijven', 'getallen', 'kleur', 'familie', 'mensen', 'lichaam', 'eten', 'huis', 'stad', 'reizen', 'weer', 'tijd', 'werk', 'school', 'vrijetijd', 'kleding', 'gevoel', 'natuur', 'taal', 'samenleving'];

const RUDE = new Set(['neuken', 'klootzak', 'kut', 'kutten', 'fuck', 'shit', 'kanker', 'kankeren', 'hoer', 'lul', 'lullen', 'pik', 'tering', 'godverdomme', 'verdomme', 'verdomd', 'eikel', 'teef', 'slet', 'sukkel', 'idioot', 'klote', 'kloten', 'flikker', 'flikkeren', 'rotzak', 'lulhannes', 'sodemieter', 'sodemieteren', 'trut', 'stront', 'poep', 'poepen', 'kak', 'pis', 'pissen', 'reet', 'tieten', 'tiet', 'neger', 'nikker', 'mongool', 'hoeren', 'schijt', 'schijten', 'bitch', 'zak', 'sex', 'seks', 'naakt', 'penis', 'borst', 'borsten', 'dildo', 'condoom', 'prostituee', 'pornografie', 'porno', 'klootzakken', 'goddomme', 'godver', 'ballen', 'kont', 'lijk', 'moord']);
const BAD_TAGS = ['vulgar', 'offensive', 'derogatory', 'ethnic', 'slur', 'obscene'];
const ODD_TAGS = ['rare', 'dated', 'archaic', 'obsolete', 'dialectal', 'Belgium', 'regional', 'nonstandard', 'colloquial', 'Flanders'];
const FUNC = ['prep', 'postp', 'pron', 'conj', 'det', 'article', 'num', 'particle'];
const PRIORITY = ['prep', 'postp', 'pron', 'conj', 'det', 'article', 'num', 'particle', 'adj', 'adv', 'noun', 'intj', 'phrase'];
const POSMAP = { noun: 'n', verb: 'v', adj: 'adj', adv: 'adv', prep: 'prep', postp: 'prep', pron: 'pron', num: 'num', conj: 'x', det: 'x', article: 'x', particle: 'x', intj: 'x', phrase: 'x' };

function frequency() {
  return fs.readFileSync(path.join(__dirname, 'vendor', 'nl_50k.txt'), 'utf8').split('\n').map(l => l.split(' ')).filter(a => a[1]).map(a => [a[0], +a[1]]);
}
const isInf = (I, w) => (I[w] || []).some(e => e.pos === 'verb' && e.cf && e.cf.some(f => f[1] === 'infinitive'));
const lemmaEntries = (I, w) => (I[w] || []).filter(e => !e.of && POSMAP[e.pos] && !(e.pos === 'verb' && !(e.cf && e.cf.length)));
const badEntry = e => (e.tags || []).some(t => BAD_TAGS.includes(t)) || /^(abbreviation|initialism|acronym|surname|given name|female given|male given)/i.test((e.gl || [])[0] || '');

/* ---- gloss ----------------------------------------------------------------- */
function gloss(e) {
  const gl = (e.gl || []).filter(g => !/^(alternative|obsolete|plural of|inflection|abbreviation|diminutive of|pronunciation|nonstandard|dated|eye dialect|clipping|neuter singular|spelling|misspelling|informal)/i.test(g) && !/\bform of\b/i.test(g));
  const g = gl[0] || (e.gl || [])[0] || '';
  let s = g.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  if (e.pos === 'noun' || e.pos === 'adj') s = s.replace(/\s+(of an?|of the|used|that|which|who|especially|in the sense)\s.*$/, '');
  const parts = s.split(/\s*[;,]\s*/).map(x => x.replace(/^(a|an|the|to)\s+/i, '').trim()).filter(Boolean);
  let out = parts[0] || '';
  if (parts[1] && out.length <= 14 && (out + ', ' + parts[1]).length <= 26 && !/^(of|used|especially|male|female|human|any|someone|one)\b/.test(parts[1])) out += ', ' + parts[1];
  out = out.replace(/[–—]/g, ' ').replace(/\s-\s/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  if (out.length > 32) out = out.split(' ').slice(0, 4).join(' ');
  return out;
}

/* ---- themes ----------------------------------------------------------------- */
const KEY = [
  ['kleur', 'red blue green yellow black white colour color orange pink purple grey gray brown violet'],
  ['familie', 'father mother brother sister son daughter parent parents child children family wife husband grandmother grandfather grandparent uncle aunt cousin baby kid sibling spouse relative nephew niece grandchild'],
  ['lichaam', 'head hand arm leg foot feet eye ear nose mouth hair face body heart finger skin blood tooth teeth back neck knee stomach throat doctor hospital medicine pain sick ill illness health healthy disease nurse bone lip tongue shoulder belly breath brain drug pill wound bath sleep'],
  ['eten', 'food eat drink meal bread water coffee tea milk cheese meat fish fruit vegetable egg beer wine breakfast lunch dinner restaurant sugar salt cake potato rice apple cook kitchen soup juice butter chicken pizza sandwich chocolate dish menu taste hungry thirsty bottle glass cup plate fork knife spoon'],
  ['huis', 'house home room door window bed table chair floor roof wall garden bathroom furniture key lamp apartment bedroom toilet stairs couch sofa carpet television tv heating rent lock flat shelf cupboard curtain address'],
  ['reizen', 'travel trip journey train bus car plane flight airport ticket hotel holiday vacation boat ship luggage road bike bicycle passport border taxi traffic drive abroad tourist map station track suitcase route'],
  ['weer', 'weather rain sun sunny wind snow cloud storm cold hot warm temperature fog ice thunder dry wet'],
  ['tijd', 'time day week month year hour minute second morning evening night today tomorrow yesterday moment season spring summer autumn winter monday tuesday wednesday thursday friday saturday sunday century date calendar noon afternoon midnight birthday january february march april may june july august september october november december future past present'],
  ['werk', 'work job office company business money pay salary price boss manager colleague meeting employee factory profession shop store customer client cost buy sell tax bank contract career industry trade'],
  ['school', 'school teacher student lesson class university exam book study education pupil learn homework college diploma grade subject test paper pen pencil library'],
  ['vrijetijd', 'game play sport football soccer music film movie party hobby song dance fun tv television holiday club concert theatre theater festival picnic swim walk ball team photo picture radio video guitar fishing paint art museum'],
  ['kleding', 'clothes clothing shirt dress coat shoe shoes hat trousers pants sock jacket wear suit skirt jeans sweater glove scarf belt bag purse uniform fashion cloth pocket button'],
  ['gevoel', 'feeling love fear joy anger happiness sadness emotion hope worry dream trust pride shame mood surprise excitement pity doubt jealousy courage laughter tear smile'],
  ['natuur', 'animal dog cat bird horse tree flower forest sea river mountain earth sky moon star nature plant grass fish lake beach field cow pig sheep chicken mouse insect world sand stone rock island hill wood leaf air ocean water bee butterfly snake lion'],
  ['taal', 'word language sentence question answer name letter story speech dutch english french german phrase text dictionary meaning message conversation voice note sign grammar translation expression quote'],
  ['samenleving', 'law government country war state police rule peace freedom society politics news group president king queen army soldier crime court prison vote nation city public community church religion god official justice right election mayor'],
  ['stad', 'city town street shop market church village square building tower bridge neighbourhood neighborhood centre center park supermarket post pharmacy cinema theatre'],
  ['mensen', 'man woman boy girl person people friend neighbour neighbor guy lady gentleman human stranger mister miss sir madam lad youth adult teenager individual somebody enemy partner guest']
];
const KEYSET = KEY.map(([t, s]) => [t, new Set(s.split(' '))]);
function theme(e, nl, pos, en) {
  if (fix.th && fix.th[nl]) return fix.th[nl];
  if (pos === 'num') return 'getallen';
  if (['prep', 'pron', 'x', 'adv'].includes(pos)) {
    const g = en.toLowerCase();
    if (/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|evening|today|tomorrow|yesterday|always|never|often|soon|now|then|later)\b/.test(g) && pos === 'adv') return 'tijd';
    return 'basis';
  }
  const toks = [];
  (e.gl || []).slice(0, 3).forEach(g => g.toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z]+/).forEach(t => t && toks.push(t)));
  const colorish = KEYSET[0][1];
  if (pos === 'adj') { return toks.slice(0, 4).some(t => colorish.has(t)) ? 'kleur' : 'beschrijven'; }
  if (pos === 'v') return 'doen';
  for (const t of toks.slice(0, 8)) for (const [id, set] of KEYSET) if (set.has(t.replace(/s$/, '')) || set.has(t)) return id;
  return pos === 'n' ? 'samenleving' : 'basis';
}

/* ---- noun, adjective details ------------------------------------------------ */
function nounGender(e) {
  const tags = e.tags || [], a = String(e.h1 || ''), x = e.hx || '';
  const hasN = tags.includes('neuter') || /(^|[-, ])n($|[-, ])/.test(a) || /\bn\b/.test((x.match(/^[^(]*/) || [''])[0].trim().split(' ').slice(-2).join(' '));
  const hasC = tags.includes('masculine') || tags.includes('feminine') || tags.includes('common') || /[mf]/.test(a.replace(/[^mfn,-]/g, '').replace('?', ''));
  if (a === 'n' && !tags.includes('masculine') && !tags.includes('feminine')) return 'het';
  if (hasN && hasC) return 'dh';
  if (hasN) return 'het';
  if (hasC) return 'de';
  return null;
}
function formsWith(e, ...t) { return (e.fm || []).filter(f => t.every(x => f[1].split(',').includes(x)) && f[0] !== '-').map(f => f[0]); }

function build() {
  const I = K.load();
  const verbsTable = fs.existsSync(path.join(ROOT, 'nederlands', 'data', 'verbs.js')) ? require(path.join(ROOT, 'nederlands', 'data', 'verbs.js')) : [];
  const topVerbs = new Set(verbsTable.map(v => v.v));
  const score = {}, via = {};
  const add = (w, c, from) => { score[w] = (score[w] || 0) + c; if (from && from !== w) (via[w] = via[w] || {})[from] = c; };
  const dual = [];
  for (const [w, c] of frequency()) {
    if (!/^[a-zà-ÿ]+(-[a-zà-ÿ]+)?$/.test(w) || (w.length < 2 && w !== 'u') || !I[w]) continue;
    if (RUDE.has(w) || (fix.drop || []).includes(w)) continue;
    const own = lemmaEntries(I, w).filter(e => !badEntry(e));
    const forms = (I[w] || []).filter(e => e.of);
    const verbTargets = [...new Set(forms.filter(e => e.pos === 'verb').flatMap(e => e.of))].filter(l => topVerbs.has(l) && l !== w);
    const otherTargets = [...new Set(forms.filter(e => e.pos !== 'verb').flatMap(e => e.of))].filter(l => l !== w && lemmaEntries(I, l).length);
    const keepOwn = (fix.keep || []).includes(w), verbOnly = (fix.vf || []).includes(w);
    let ownShare = 1, verbShare = 0, otherShare = 0;
    if (!own.length) { ownShare = 0; if (verbTargets.length && otherTargets.length) { verbShare = 0.7; otherShare = 0.3; } else if (verbTargets.length) verbShare = 1; else otherShare = 1; }
    else if (verbTargets.length || otherTargets.length) {
      const formAdj = forms.some(e => e.pos === 'adj');
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
    let ents = lemmaEntries(I, w).filter(e => !badEntry(e)).filter(e => e.pos !== 'adj' || formsWith(e, 'definite', 'positive').length || formsWith(e, 'indefinite', 'masculine', 'positive').length || !lemmaEntries(I, w).some(x => x.pos !== 'adj'));
    // a diminutive entry is a lemma only when it is its own word (meisje, not huisje)
    ents = ents.filter(e => !(e.tags || []).includes('diminutive') || (fix.keep || []).includes(w));
    if (!ents.length) continue;
    let e = null;
    const forcedPos = (fix.pos || {})[w];
    if (forcedPos) e = ents.find(x => POSMAP[x.pos] === forcedPos) || ents[0];
    if (!e && topVerbs.has(w)) e = ents.find(x => x.pos === 'verb');
    const pickPos = p => { const c = ents.filter(x => x.pos === p); return c.find(x => !(x.tags || []).some(t => ODD_TAGS.includes(t)) && !/^(alternative|obsolete)/i.test((x.gl || [])[0] || '')) || c[0]; };
    const odd = x => (x.tags || []).some(t => ['obsolete', 'archaic', 'dated'].includes(t)) || /^(alternative|obsolete)/i.test((x.gl || [])[0] || '');
    if (!e) for (const p of PRIORITY) { const c = ents.filter(x => x.pos === p); if (c.length && c.every(odd) && ents.some(x => !odd(x))) continue; e = pickPos(p); if (e) break; }
    if (!e) e = ents.find(x => x.pos === 'verb') || ents[0];
    const pos = forcedPos || POSMAP[e.pos];
    if (e.pos === 'verb' && !isInf(I, w)) continue;
    const nl = w;
    const key = nl;
    if (seen.has(key)) continue; seen.add(key);
    const en = (fix.en || {})[nl] || gloss(e);
    if (!en) { problems.push(nl + ': no gloss'); continue; }
    const o = { nl, en, th: theme(e, nl, pos, en), pos };
    if (pos === 'n') {
      let g = (fix.g || {})[nl] || nounGender(e);
      if (!g) { problems.push(nl + ': noun with no gender'); continue; }
      o.g = g;
      const pl = formsWith(e, 'plural')[0]; if (pl) o.pl = pl;
      const dim = formsWith(e, 'diminutive')[0]; if (dim) o.dim = dim;
      // hand forms: a string replaces, null removes (uncountable, no diminutive)
      ['pl', 'dim'].forEach(f => { if (fix[f] && nl in fix[f]) { if (fix[f][nl]) o[f] = fix[f][nl]; else delete o[f]; } });
    } else if (pos === 'adj') {
      const ae = formsWith(e, 'definite', 'positive')[0] || formsWith(e, 'indefinite', 'masculine', 'positive')[0] || formsWith(e, 'positive', 'plural')[0];
      o.ae = (fix.ae || {})[nl] || ae || nl;
      if (!ae) problems.push(nl + ': adjective with no -e form, using itself');
    }
    out.push(o);
  }
  (fix.add || []).forEach(a => { if (!seen.has(a.nl)) { seen.add(a.nl); const pos = a.pos || 'n'; const r = Object.assign({}, a); delete r.after; out.splice(Math.min(a.after || out.length, out.length), 0, r); } });
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
 * WORDS: GENERATED by tools/nl/build-words.js. Do not edit.
 * ${out.length} words, commonest first. { nl, en, th, pos, g, pl, dim, ae, r, b }.
 * Gender, plural, diminutive, -e form, gloss: English Wiktionary via kaikki.org
 * (CC BY-SA 4.0). Order: hermitdave FrequencyWords nl 2018, OpenSubtitles
 * (CC BY-SA 4.0). Themes by keyword map, hand fixes in tools/nl/src/word-fix.json.
 * This table is shared under CC BY-SA 4.0.
 * ========================================================================== */
`;
  fs.writeFileSync(path.join(ROOT, 'nederlands', 'data', 'words.js'), head +
    '(function (w) {\nw.NL_WORDS = [\n' + out.map(e => JSON.stringify(e)).join(',\n') +
    '\n];\nif (typeof module !== "undefined" && module.exports) module.exports = w.NL_WORDS;\n})(typeof window !== "undefined" ? window : globalThis);\n');
  console.log(`${out.length} words, ${problems.length} problems  ${JSON.stringify(byT)}`);
}
module.exports = { build, THEMES };
