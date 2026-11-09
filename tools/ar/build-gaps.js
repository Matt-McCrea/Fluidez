#!/usr/bin/env node
/* Ṭalāqa GAP banks, into arabiya/data/gaps-<kind>.js (each pushes into window.AR_BANK).
 *   node tools/ar/build-gaps.js
 * afal:     authored frames tools/ar/src/afal/*.json {q, v, p, t, e, b, w?}; the answer and
 *           options are computed from verbs.js, so an authored disagreement cannot ship.
 * jidhr:    generated from words.js roots (pick the word of a root for a meaning).
 * jumu:     generated from words.js plurals.
 * harakat:  generated from look-alike words in words.js, plus tools/ar/src/harakat.json pairs.
 * damair:   generated: possessive endings on nouns, and the preposition table below. */
'use strict';
const fs = require('fs');
const path = require('path');
const AR = require('../../arabiya/js/ar-text.js');
const ROOT = path.join(__dirname, '..', '..');
const DATA = path.join(ROOT, 'arabiya', 'data');
const SRC = path.join(__dirname, 'src');
const V = require(path.join(DATA, 'verbs.js'));
const W = fs.existsSync(path.join(DATA, 'words.js')) && !/PLACEHOLDER/.test(fs.readFileSync(path.join(DATA, 'words.js'), 'utf8').slice(0, 40)) ? require(path.join(DATA, 'words.js')) : [];
const DROP = (() => { try { return JSON.parse(fs.readFileSync(path.join(SRC, 'drop.json'), 'utf8')).gaps || []; } catch (e) { return []; } })();
const verb = new Map(V.map(v => [v.v, v]));
const S = AR.strip;

// deterministic shuffle so builds are stable
function rng(seed) { let h = 2166136261; for (const c of seed) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }
function shuffle(a, seed) { const r = rng(seed), b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
// four options, the answer first, distinct without vowels (or with them, for harakat)
function opts(answer, pool, keep) {
  const key = keep ? (x => x) : S, seen = new Set([key(answer)]), out = [answer];
  for (const x of pool) { if (x && !seen.has(key(x))) { seen.add(key(x)); out.push(x); } if (out.length === 4) break; }
  return out.length === 4 ? out : null;
}

const PERS_EN = { ana: 'I', anta: 'you (m)', anti: 'you (f)', huwa: 'he', hiya: 'she', nahnu: 'we', antum: 'you (pl)', antunna: 'you (f pl)', hum: 'they', hunna: 'they (f)', antuma: 'you two', huma: 'they two', humaf: 'they two (f)' };
const OTHER = { ana: ['huwa', 'nahnu', 'anta'], anta: ['ana', 'anti', 'huwa'], anti: ['anta', 'hiya', 'ana'], huwa: ['hiya', 'hum', 'ana'], hiya: ['huwa', 'anti', 'hunna'], nahnu: ['ana', 'hum', 'antum'], antum: ['anta', 'hum', 'nahnu'], antunna: ['antum', 'hunna', 'anti'], hum: ['huwa', 'antum', 'nahnu'], hunna: ['hum', 'hiya', 'antunna'], antuma: ['antum', 'huma', 'anta'], huma: ['hum', 'huwa', 'antuma'], humaf: ['huma', 'hiya', 'hunna'] };
const SA = x => x ? 'سَ' + x : null;
const WHY = {
  madi: 'A finished action: the past. Its ending shows who did it (*كَتَبْتُ* I wrote, *كَتَبُوا* they wrote).',
  mudari: 'Now or usually: the present. The prefix shows who (*أَ* I, *تَ* you or she, *يَ* he, *نَ* we).',
  mustaqbal: 'The future: *سَ* joined to the front of the present form.',
  amr: 'An order: the imperative, the present form without its prefix.',
  lam: '*لَمْ* means did not, and cuts the present short (*يَكْتُبْ*, *يَكْتُبُوا*).',
  lan: '*لَنْ* means will not, and takes the subjunctive (*يَكْتُبَ*, *يَكْتُبُوا*).',
  la: '*لَا* before the present means does not.',
  kana: '*كَانَ* before the present: used to, or was doing.',
  majhul: 'Passive: the doer is not named. The past passive goes u then i (*كُتِبَ*).'
};
const TENSE = { madi: 'madi', mudari: 'mudari', mustaqbal: 'mudari', amr: 'amr', lam: 'majzum', lan: 'mansub', la: 'mudari', kana: 'mudari', majhul: 'madi_m' };

function afal() {
  const dir = path.join(SRC, 'afal'), out = [], errs = [];
  if (!fs.existsSync(dir)) return { out, errs };
  fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().forEach(file => {
    JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')).forEach((fr, i) => {
      const where = `${file}#${i} ${fr.q}`;
      const v = verb.get(fr.v);
      if (!v) return errs.push(`${where}: unknown verb ${fr.v}`);
      const tense = fr.tt || TENSE[fr.t];
      if (!tense) return errs.push(`${where}: unknown topic ${fr.t}`);
      const F = v.f, p = fr.p;
      const g = (t, pp) => (F[t] || {})[pp || p];
      let a = g(tense);
      if (!a) return errs.push(`${where}: ${fr.v} has no ${tense} for ${p}`);
      if (fr.t === 'mustaqbal') a = SA(a);
      const oth = OTHER[p] || [];
      const pools = {
        madi: [g('mudari'), SA(g('mudari')), ...oth.map(o => g('madi', o))],
        mudari: [g('madi'), SA(g('mudari')), ...oth.map(o => g('mudari', o))],
        mustaqbal: [g('madi'), ...oth.map(o => SA(g('mudari', o))), ...oth.map(o => g('madi', o))],   // the bare present can mean the future too, so never offer it
        amr: [g('mudari'), g('madi'), ...oth.map(o => g('amr', o)), g('majzum')],
        lam: [g('mudari'), g('madi'), SA(g('mudari')), ...oth.map(o => g('majzum', o))],
        lan: [g('mudari'), g('madi'), SA(g('mudari')), ...oth.map(o => g('mansub', o))],
        la: [g('madi'), SA(g('mudari')), ...oth.map(o => g('mudari', o))],
        kana: [g('madi'), SA(g('mudari')), ...oth.map(o => g('mudari', o))],
        majhul: [g('madi'), g('mudari_m'), g('mudari'), ...oth.map(o => g('madi_m', o))]
      };
      const all = Object.keys(F[tense] || {}).map(pp => fr.t === 'mustaqbal' ? SA(F[tense][pp]) : F[tense][pp]).concat(Object.values(F.madi || {}));
      const o = opts(a, pools[fr.t].concat(all));
      if (!o) return errs.push(`${where}: could not find 3 distinct options`);
      if ((fr.q.match(/___/g) || []).length !== 1) return errs.push(`${where}: needs exactly one ___`);
      const uv = AR.unvowelled(fr.q.replace('___', ' '));
      if (uv.length) return errs.push(`${where}: not fully vowelled: ${uv.join(' ')}`);
      if (/[-–—]/.test(fr.e + (fr.w || ''))) return errs.push(`${where}: dash in e or w`);
      if (!fr.e) return errs.push(`${where}: needs e`);
      out.push({ k: 'afal', q: fr.q, c: v.en.replace(/^to /, '') + ' · ' + (fr.t === 'majhul' ? 'passive, ' + ({ huwa: 'it, he', hiya: 'it (f), she' }[p] || PERS_EN[p]) : PERS_EN[p]), a, o: shuffle(o, fr.q), e: fr.e,
        w: fr.w || WHY[fr.t], b: fr.b || v.b, t: fr.t, v: fr.v, p });
    });
  });
  return { out, errs };
}

// ---- generated kinds ----------------------------------------------------------
const nouns = W.filter(w => w.pos === 'n' && w.ar.indexOf(' ') === -1);
const BANDS = ['A1', 'A2', 'B1', 'B2'];
const later = (a, b) => BANDS[Math.max(BANDS.indexOf(a), BANDS.indexOf(b))];

function jidhr() {
  const byRoot = new Map(), out = [];
  W.filter(w => w.root && w.root.length >= 3 && w.ar.indexOf(' ') === -1).forEach(w => byRoot.set(w.root, (byRoot.get(w.root) || []).concat(w)));
  byRoot.forEach((list, root) => {
    if (list.length < 4) return;
    list.forEach(w => {
      const others = shuffle(list.filter(x => x !== w && S(x.ar) !== S(w.ar)), w.ar).map(x => x.ar);
      const o = opts(w.ar, others);
      if (!o) return;
      out.push({ k: 'jidhr', q: root.split('').join(' ') + ' ← ___', c: w.en, a: w.ar, o: shuffle(o, 'j' + w.ar), e: `The root ${root.split('').join(' ')}: ${w.en}.`,
        w: 'One root, many words: the pattern of vowels and extra letters around the root letters gives each its meaning.', b: later(w.b, 'A2'), t: 'pattern' });
    });
  });
  return out;
}

function jumu() {
  const out = [], withPl = W.filter(w => w.pl && (w.pos === 'n' || w.pos === 'adj') && w.ar.indexOf(' ') === -1);
  withPl.forEach(w => {
    const st = S(w.pl), sound = /(ون|ين|ات)$/.test(st) && st.slice(0, -2).indexOf(S(w.ar).replace(/ة$/, '')) === 0;
    // wrong plurals: the sound plural the learner might build, then other broken plurals of the same shape
    const fakeSound = w.g === 'f' || /ة$/.test(S(w.ar)) ? w.ar.replace(/َة$|ة$/, '') + 'َات' : w.ar + 'ُونَ';
    const fakeAt = w.ar.replace(/َة$|ة$/, '') + 'َات';
    const peers = shuffle(withPl.filter(x => x !== w && S(x.pl).length === st.length), w.ar).slice(0, 6).map(x => x.pl);
    const o = opts(w.pl, [fakeAt, fakeSound, ...peers]);
    if (!o) return;
    out.push({ k: 'jumu', q: w.ar + ' ← ___', c: 'plural: ' + w.en, a: w.pl, o: shuffle(o, 'p' + w.ar), e: `${w.en}: the plural.`,
      w: sound ? 'A sound plural: the ending *ـُونَ* for men, *ـَات* for most feminine words.' : 'A broken plural: the vowels inside change. Learn it with the word.',
      b: later(w.b, 'A2'), t: sound ? 'sound' : 'broken' });
  });
  return out;
}

const POSS = [['ـِي', 'my', 'i'], ['ـُكَ', 'your (m)', 'uka'], ['ـُكِ', 'your (f)', 'uki'], ['ـُهُ', 'his', 'uhu'], ['ـُهَا', 'her', 'uhā'], ['ـُنَا', 'our', 'unā'], ['ـُكُمْ', 'your (pl)', 'ukum'], ['ـُهُمْ', 'their', 'uhum']];
function attach(noun, i) {
  let base = noun.replace(/ة$/, 'ت');
  const suf = POSS[i][0].replace('ـ', '');
  if (i === 0) return base + 'ِي';
  return base + suf;
}
const PREP = { // preposition: [my, your m, your f, his, her, our, your pl, their]
  'عِنْدَ': ['عِنْدِي', 'عِنْدَكَ', 'عِنْدَكِ', 'عِنْدَهُ', 'عِنْدَهَا', 'عِنْدَنَا', 'عِنْدَكُمْ', 'عِنْدَهُمْ'],
  'مَعَ': ['مَعِي', 'مَعَكَ', 'مَعَكِ', 'مَعَهُ', 'مَعَهَا', 'مَعَنَا', 'مَعَكُمْ', 'مَعَهُمْ'],
  'لِ': ['لِي', 'لَكَ', 'لَكِ', 'لَهُ', 'لَهَا', 'لَنَا', 'لَكُمْ', 'لَهُمْ'],
  'فِي': ['فِيَّ', 'فِيكَ', 'فِيكِ', 'فِيهِ', 'فِيهَا', 'فِينَا', 'فِيكُمْ', 'فِيهِمْ'],
  'عَلَى': ['عَلَيَّ', 'عَلَيْكَ', 'عَلَيْكِ', 'عَلَيْهِ', 'عَلَيْهَا', 'عَلَيْنَا', 'عَلَيْكُمْ', 'عَلَيْهِمْ'],
  'مِنْ': ['مِنِّي', 'مِنْكَ', 'مِنْكِ', 'مِنْهُ', 'مِنْهَا', 'مِنَّا', 'مِنْكُمْ', 'مِنْهُمْ'],
  'إِلَى': ['إِلَيَّ', 'إِلَيْكَ', 'إِلَيْكِ', 'إِلَيْهِ', 'إِلَيْهَا', 'إِلَيْنَا', 'إِلَيْكُمْ', 'إِلَيْهِمْ'],
  'عَنْ': ['عَنِّي', 'عَنْكَ', 'عَنْكِ', 'عَنْهُ', 'عَنْهَا', 'عَنَّا', 'عَنْكُمْ', 'عَنْهُمْ'],
  'بِ': ['بِي', 'بِكَ', 'بِكِ', 'بِهِ', 'بِهَا', 'بِنَا', 'بِكُمْ', 'بِهِمْ']
};
const PREP_EN = { 'عِنْدَ': 'at, with (have)', 'مَعَ': 'with', 'لِ': 'for, to', 'فِي': 'in', 'عَلَى': 'on', 'مِنْ': 'from', 'إِلَى': 'to', 'عَنْ': 'about', 'بِ': 'with, by' };
const PRON = ['me', 'you (m)', 'you (f)', 'him', 'her', 'us', 'you (pl)', 'them'];
function damair() {
  const out = [];
  // possessives on the commonest concrete nouns
  nouns.filter(w => ['A1', 'A2'].indexOf(w.b) !== -1 && ['people', 'body', 'home', 'clothes', 'food', 'town', 'school', 'nature'].indexOf(w.th) !== -1 && !/,|\(/.test(w.en) && !/[اىو]$|ي$|ء$/.test(S(w.ar)) && !/^ال/.test(S(w.ar))).slice(0, 160).forEach((w, n) => {
    [0, 1, 3, 4, 5, 7].forEach(i => {
      if ((n + i) % 3) return;               // a third of the grid is plenty
      const forms = POSS.map((_, j) => attach(w.ar, j));
      const pool = shuffle(forms.filter((_, j) => j !== i && !(i === 1 && j === 2) && !(i === 2 && j === 1)), w.ar + i);
      const o = opts(forms[i], pool);
      if (!o) return;
      out.push({ k: 'damair', q: 'هٰذَا ___', c: `${POSS[i][1]} ${w.en.split(',')[0].replace(/^an? /, '')}`, a: forms[i], o: shuffle(o, 'd' + w.ar + i),
        e: `This is ${POSS[i][1]} ${w.en.split(',')[0]}.`, w: 'The possessive is an ending on the noun: *ـِي* my, *ـُكَ* your, *ـُهُ* his, *ـُهَا* her. *ة* becomes *ت* before it.',
        b: w.b === 'A1' ? 'A1' : 'A2', t: 'poss' });
    });
  });
  Object.keys(PREP).forEach(pr => PREP[pr].forEach((form, i) => {
    const pool = shuffle(PREP[pr].filter((_, j) => j !== i && !(i === 1 && j === 2) && !(i === 2 && j === 1)), pr + i);
    const o = opts(form, pool);
    if (!o) return;
    out.push({ k: 'damair', q: '___', c: `${PREP_EN[pr].split(',')[0]} ${PRON[i]}`, a: form, o: shuffle(o, 'r' + form), e: `${PREP_EN[pr]} + ${PRON[i]}`,
      w: `The pronoun joins the preposition *${pr}* as an ending. After *ي* or *i*, *ـهُ* becomes *ـهِ*.`, b: ['عِنْدَ', 'مَعَ', 'لِ', 'فِي'].indexOf(pr) !== -1 ? 'A1' : 'A2', t: 'prep' });
  }));
  return out;
}

function harakat() {
  const out = [];
  // look-alike words in the word list: same letters, different vowels, different meanings
  const byBare = new Map();
  W.filter(w => w.ar.indexOf(' ') === -1).forEach(w => byBare.set(S(w.ar), (byBare.get(S(w.ar)) || []).concat(w)));
  byBare.forEach(list => {
    const uniq = []; list.forEach(w => { if (!uniq.find(x => x.ar === w.ar)) uniq.push(w); });
    if (uniq.length < 2) return;
    uniq.forEach(w => {
      const pool = uniq.filter(x => x !== w).map(x => x.ar).concat(fakeVowels(w.ar));
      const o = opts(w.ar, pool, true);
      if (!o) return;
      out.push({ k: 'harakat', q: '___', c: w.en, a: w.ar, o: shuffle(o, 'h' + w.ar), e: w.en, w: 'Same letters, different vowels, different word. The vowels decide.', b: later(w.b, 'A2'), t: 'pairs' });
    });
  });
  // active and passive from the verbs
  V.filter(v => v.f.madi_m && v.f.madi_m.huwa && ['A1', 'A2'].indexOf(v.b) !== -1).forEach(v => {
    const act = v.f.madi.huwa, pas = v.f.madi_m.huwa;
    if (S(act) !== S(pas)) return;
    const b = v.en.replace(/^to /, '').split(',')[0];
    if (!PAST[b] || /\s/.test(b)) return;
    [[act, 'he ' + past(v.en), 'active'], [pas, 'it was ' + pp(v.en), 'majhul']].forEach(([a, c, t]) => {
      const o = opts(a, [act, pas].concat(fakeVowels(act)), true);
      if (!o) return;
      out.push({ k: 'harakat', q: '___', c, a, o: shuffle(o, 'v' + a), e: c, w: WHY.majhul, b: 'B1', t: 'majhul' });
    });
  });
  const pairs = path.join(SRC, 'harakat.json');
  if (fs.existsSync(pairs)) JSON.parse(fs.readFileSync(pairs, 'utf8')).forEach(g => {
    g.forms.forEach(([a, c]) => {
      const o = opts(a, g.forms.map(x => x[0]).concat(fakeVowels(a)), true);
      if (o) out.push({ k: 'harakat', q: g.q || '___', c, a, o: shuffle(o, 'g' + a), e: c, w: g.w, b: g.b || 'A2', t: g.t || 'pairs' });
    });
  });
  return out;
}
// plausible wrong vowellings: swap the first vowel, or add or drop a shadda
function fakeVowels(ar) {
  const out = [], V3 = ['َ', 'ِ', 'ُ'];
  const i = ar.search(/[َ-ِ]/);
  if (i > -1) V3.forEach(m => { if (m !== ar[i]) out.push(ar.slice(0, i) + m + ar.slice(i + 1)); });
  const j = ar.indexOf('ّ');
  if (j > -1) out.push(ar.slice(0, j) + ar.slice(j + 1));
  return out;
}
const PAST = { write: ['wrote', 'written'], open: ['opened', 'opened'], eat: ['ate', 'eaten'], drink: ['drank', 'drunk'], take: ['took', 'taken'], see: ['saw', 'seen'], hear: ['heard', 'heard'], read: ['read', 'read'], make: ['made', 'made'], build: ['built', 'built'], break: ['broke', 'broken'], find: ['found', 'found'], send: ['sent', 'sent'], sell: ['sold', 'sold'], buy: ['bought', 'bought'], cut: ['cut', 'cut'], put: ['put', 'put'], hit: ['hit', 'hit'], understand: ['understood', 'understood'], forget: ['forgot', 'forgotten'], know: ['knew', 'known'], give: ['gave', 'given'], fill: ['filled', 'filled'], close: ['closed', 'closed'], use: ['used', 'used'], wash: ['washed', 'washed'], cook: ['cooked', 'cooked'], ask: ['asked', 'asked'], study: ['studied', 'studied'], draw: ['drew', 'drawn'], carry: ['carried', 'carried'], pay: ['paid', 'paid'], teach: ['taught', 'taught'], invite: ['invited', 'invited'], visit: ['visited', 'visited'], help: ['helped', 'helped'], watch: ['watched', 'watched'], collect: ['collected', 'collected'], repair: ['repaired', 'repaired'], choose: ['chose', 'chosen'], hit2: [] };
function past(en) { const b = en.replace(/^to /, '').split(',')[0]; return (PAST[b] || [b + 'ed'])[0]; }
function pp(en) { const b = en.replace(/^to /, '').split(',')[0]; return (PAST[b] || [0, b + 'ed'])[1]; }
function pastOld(en) { const b = en.replace(/^to /, '').split(',')[0]; return { write: 'wrote', open: 'opened', eat: 'ate', drink: 'drank', take: 'took', see: 'saw', hear: 'heard', read: 'read', make: 'made', build: 'built', break: 'broke', find: 'found', send: 'sent', sell: 'sold', buy: 'bought', cut: 'cut', put: 'put', hit: 'hit', understand: 'understood', forget: 'forgot', know: 'knew', give: 'gave', fill: 'filled' }[b.split(' ')[0]] || b + 'ed'; }
function ppOld(en) { const b = en.replace(/^to /, '').split(',')[0]; return { write: 'written', eat: 'eaten', drink: 'drunk', take: 'taken', see: 'seen', give: 'given', break: 'broken', forget: 'forgotten', know: 'known', make: 'made', build: 'built', find: 'found', send: 'sent', sell: 'sold', buy: 'bought', hear: 'heard', read: 'read', understand: 'understood', cut: 'cut', put: 'put', hit: 'hit' }[b.split(' ')[0]] || b + 'ed'; }

// ---- write --------------------------------------------------------------------
const af = afal();
const banks = { afal: af.out, jidhr: jidhr(), jumu: jumu(), damair: damair(), harakat: harakat() };
let total = 0;
Object.keys(banks).forEach(k => {
  const items = banks[k].filter(x => DROP.indexOf(x.q + '|' + x.a) === -1 && DROP.indexOf(x.a + '|' + x.k) === -1);
  total += items.length;
  if (!items.length) return;          // keep the shell's placeholder until there is real content
  fs.writeFileSync(path.join(DATA, `gaps-${k}.js`), `/* Ṭalāqa ${k} bank: generated by tools/ar/build-gaps.js. Do not edit. */\n` +
    `(window.AR_BANK = window.AR_BANK || []).push.apply(window.AR_BANK, ${JSON.stringify(items)});\n`);
  console.log(`gaps-${k}.js: ${items.length}`);
});
if (af.errs.length) { console.log(af.errs.length + ' frame errors:'); af.errs.slice(0, 40).forEach(e => console.log('  ' + e)); process.exitCode = 1; }
