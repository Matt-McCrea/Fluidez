/* gaps-lib.js: the rules shared by tools/nl/build-gaps.js and
 * tools/test-nederlands.js. Computes answers (dehet, mv) and gates every
 * finished GAP item (docs/vlot-spec.md, Gate). */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const NL = require(path.join(ROOT, 'nederlands/js/nl-text.js'));
const VERBS = require(path.join(ROOT, 'nederlands/data/verbs.js'));
const WORDS = require(path.join(ROOT, 'nederlands/data/words.js'));
NL.setVerbs(VERBS);
const byV = {}; VERBS.forEach(v => { byV[v.v] = v; });
const byW = {}; WORDS.forEach(w => { (byW[w.nl] = byW[w.nl] || []).push(w); });

const BANDS = ['A1', 'A2', 'B1', 'B2'];
const TOPICS = {
  ww: ['ott', 'ovt', 'vtt', 'hz', 'toek', 'cond', 'imp'],
  dehet: ['art', 'dem', 'adj', 'rel', 'bez'],
  volg: ['inv', 'bijzin', 'scheid', 'vraag', 'te', 'cluster'],
  geen: ['geen', 'niet', 'pos', 'neg', 'meer'],
  mv: ['pl', 'dim', 'dimpl']
};
const dash = s => /[–—]|\s-\s/.test(s);
const toks = s => String(s).replace(/[.,;:!?"“”()]/g, ' ').trim().split(/\s+/).filter(Boolean);
const uniq = a => a.filter((x, i) => x && a.indexOf(x) === i);
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
// Languages and infinitives used as nouns are always het (het Nederlands, het zwemmen).
const LANGS = ['Nederlands', 'Engels', 'Spaans', 'Frans', 'Duits', 'Italiaans', 'Arabisch', 'Chinees', 'Turks', 'Pools', 'Russisch'];
function noun(n) {
  const w = (byW[n] || []).find(x => x.pos === 'n');
  if (w) return w;
  if (LANGS.indexOf(n) !== -1 || byV[n]) return { nl: n.toLowerCase(), g: 'het', pos: 'n', _het: LANGS.indexOf(n) !== -1 ? 'lang' : 'inf' };
  return null;
}
function adjective(n) { return (byW[n] || []).find(w => w.pos === 'adj') || null; }

/* ---- ww: every real form of the verb the item is about --------------------- */
function formsOf(v) {
  const f = v.f, out = [];
  Object.keys(f.ott).forEach(k => out.push(f.ott[k]));
  out.push(f.ovt.sg, f.ovt.pl, f.vd, f.imp, f.inf);
  const all = out.filter(Boolean);
  // main-clause split forms of a separable verb
  return uniq(all.concat(all.map(w => NL.splitSep(v, w))));
}
function realForms(it) {
  if (it.t === 'hz') return uniq(formsOf(byV.hebben).concat(formsOf(byV.zijn)));
  if (it.t === 'toek' && it.v === 'gaan') return uniq(formsOf(byV.gaan).concat(formsOf(byV.zullen)));
  if (it.t === 'toek' || it.t === 'cond') return formsOf(byV.zullen);
  return byV[it.v] ? formsOf(byV[it.v]) : [];
}
function wwOpts(it) {
  const o = {};
  if (it.inv) o.inv = true; if (it.sub) o.sub = true; if (it.tt) o.tt = it.tt; if (it.aux) o.aux = it.aux;
  return o;
}
function wwAnswer(it) { return NL.form(it.v, it.t, it.p || 'ik', wwOpts(it)); }

/* ---- dehet ------------------------------------------------------------------- */
const DET_BARE = ['een', 'geen', 'elk', 'ieder', 'welk', 'zulk', 'veel', 'weinig', 'genoeg', "zo'n", 'zo’n'];
const DET_E = ['de', 'het', 'dit', 'dat', 'deze', 'die', 'mijn', 'jouw', 'je', 'zijn', 'haar', 'ons', 'onze', 'uw', 'hun', 'jullie', 'dezelfde', 'elke', 'iedere', 'welke', 'zulke', 'sommige'];
const INTENS = ['heel', 'erg', 'zeer', 'vrij', 'best', 'behoorlijk', 'te', 'zo', 'ook', 'nog', 'wel'];
const ADJ_FORMS = new Set(); WORDS.forEach(w => { if (w.pos === 'adj') { ADJ_FORMS.add(w.nl); if (w.ae) ADJ_FORMS.add(w.ae); } });
function beforeGap(q) {
  const t = toks(q.replace(/\([^)]*\)/g, '')).map(x => x.toLowerCase());
  return t.slice(0, t.indexOf('___'));
}
function isPlural(it, w) {
  if (it.pl === 1 || it.pl === true) return true;
  if (it.pl === 0 || it.pl === false) return false;
  const t = toks(it.q).map(x => x.toLowerCase());
  return t.indexOf(w.pl) !== -1 && t.indexOf(w.nl) === -1 && w.pl !== w.nl;
}
/* dehetAnswer(item) -> { a, x[] } or { err } for art, dem, adj, rel. item has n (and adj). */
function dehetAnswer(it) {
  const w = noun(it.n);
  if (!w) return { err: `noun "${it.n}" not in words.js` };
  if (!w.g) return { err: `noun "${it.n}" has no gender` };
  const q = it.q.toLowerCase();
  const pl = isPlural(it, w);
  if (it.t !== 'bez' && q.indexOf(w.nl) === -1 && q.indexOf(String(w.pl).toLowerCase()) === -1 && q.indexOf(String(w.dim).toLowerCase()) === -1)
    return { err: `q does not contain the noun "${it.n}"` };
  if (it.t === 'art') {
    if (pl) return { a: 'de', x: [] };
    if (w.g === 'dh') return { a: 'de', x: ['het'] };
    return { a: w.g, x: [] };
  }
  if (it.t === 'dem') {
    const m = /\((this|that|these|those)\)/.exec(it.q);
    if (!m) return { err: 'dem cue must be (this), (that), (these) or (those)' };
    const near = m[1] === 'this' || m[1] === 'these', plc = m[1] === 'these' || m[1] === 'those' || pl;
    const dd = near ? 'deze' : 'die', hh = near ? 'dit' : 'dat';
    if (plc) return { a: dd, x: [] };
    if (w.g === 'dh') return { a: dd, x: [hh] };
    return { a: w.g === 'het' ? hh : dd, x: [] };
  }
  if (it.t === 'rel') {
    if (pl) return { a: 'die', x: [] };
    if (w.g === 'dh') return { err: `"${it.n}" takes de or het, relative is ambiguous` };
    return { a: w.g === 'het' ? 'dat' : 'die', x: [] };
  }
  if (it.t === 'adj') {
    const aw = adjective(it.adj);
    if (!aw) return { err: `adjective "${it.adj}" not in words.js` };
    if (!aw.ae || aw.ae === aw.nl) return { err: `adjective "${it.adj}" has no distinct -e form` };
    let b = beforeGap(it.q);
    while (b.length && INTENS.indexOf(b[b.length - 1]) !== -1) b = b.slice(0, -1);
    const prev = b[b.length - 1] || '';
    if (ADJ_FORMS.has(prev)) return { err: `stacked adjectives (after "${prev}") not supported` };
    if (pl || w.g === 'de') return { a: aw.ae, x: [] };
    if (w.g === 'dh') return { err: `"${it.n}" takes de or het, -e is ambiguous` };
    if (DET_E.indexOf(prev) !== -1) return { a: aw.ae, x: [] };
    return { a: aw.nl, x: [] };   // een, geen, other indefinite, or none: het word, singular, no -e
  }
  return { err: 'no rule for ' + it.t };
}
function adjDet(it) {
  let b = beforeGap(it.q);
  while (b.length && INTENS.indexOf(b[b.length - 1]) !== -1) b = b.slice(0, -1);
  return b[b.length - 1] || '';
}

/* ---- mv -------------------------------------------------------------------------- */
function mvAnswer(it) {
  const w = noun(it.n);
  if (!w) return { err: `noun "${it.n}" not in words.js` };
  if (it.t === 'pl') return w.pl ? { a: w.pl } : { err: `"${it.n}" has no plural in words.js` };
  if (!w.dim) return { err: `"${it.n}" has no diminutive in words.js` };
  if (it.t === 'dim') return { a: w.dim };
  return { a: w.dim + 's' };
}
const VOW = /[aeiouyáéíóúëï]/;
/* wrong spellings: right-looking plurals / diminutives that are not the answer */
function mvWrong(it, a, x) {
  const w = noun(it.n), n = w.nl, last = n.slice(-1), c = [];
  const cons = !VOW.test(last);
  const undoubled = n.replace(/([aeou])\1([^aeiou]+)$/, '$1$2');
  const doubledV = /[^aeiou][aeou][^aeiou]$/.test(n) ? n.replace(/([aeou])([^aeiou])$/, '$1$1$2') : null;
  if (it.t === 'pl') {
    c.push(n + 'en', n + 's', cons ? n + last + 'es' : n + 'ens', cons ? n + last + 'en' : null, n + 'es', cons ? n + last + 's' : null);
    if (undoubled !== n) c.push(undoubled + 's', undoubled + 'es');
    if (doubledV) c.push(doubledV + 'en');
    if (/s$/.test(n)) c.push(n.slice(0, -1) + 'zes', n + 'sen');
    if (/f$/.test(n)) c.push(n.slice(0, -1) + 'ven', n + 'fen');
    if (/z$/.test(n)) c.push(n.slice(0, -1) + 'sen');
    if (/v$/.test(n)) c.push(n.slice(0, -1) + 'fen');
    if (/e$/.test(n)) c.push(n.slice(0, -1) + 'en', n + 'n', n + 'ns');
    if (/(el|er|em|en|aar)$/.test(n)) c.push(n + 'en', n + 'ren');
    if (/[aeiou]$/.test(n)) c.push(n + "'en", n + 's'); else c.push(n + "'s");
  } else if (it.t === 'dim') {
    c.push(n + 'je', n + 'tje', n + 'etje', cons ? n + last + 'etje' : null, cons ? n + last + 'je' : null, /m$/.test(n) ? n + 'pje' : null, /ng$/.test(n) ? n + 'kje' : null,
      undoubled !== n ? undoubled + 'je' : null, undoubled !== n ? undoubled + 'tje' : null, n + 'ke');
  } else {
    const d = w.dim;
    c.push(d, d + 'en', w.pl || null, (w.pl || n) + 'jes', n + 'jes', n + 'tjes', n + 'etjes', d.slice(0, -2) + 'es');
  }
  const ban = new Set([a].concat(x || [], [n]));
  return uniq(c.filter(z => z && !ban.has(z) && !/([^aeiou])\1$/.test(z) && !/(.)\1\1/.test(z)));
}

/* ---- templates ---------------------------------------------------------------- */
const MARK = {
  ovt: ['gisteren', 'toen', 'vroeger', 'eergisteren', 'laatst', 'vorige week', 'vorig jaar', 'afgelopen'],
  vtt: ['gisteren', 'al', 'net', 'nog nooit', 'vorige week', 'vorig jaar', 'afgelopen', 'vandaag', 'toen'],
  toek: ['morgen', 'volgende week', 'straks', 'binnenkort', 'later', 'volgend jaar', 'volgende', 'over'],
  cond: ['als', 'graag', 'misschien'],
  hz: ['gisteren', 'al', 'net', 'toen', 'vroeger', 'nog nooit', 'vorige week', 'vandaag'],
  ott: ['nu', 'vandaag', 'elke dag', 'altijd', 'meestal', 'vaak', 'soms', 'nooit', 'morgen'],
  imp: ['alsjeblieft', 'even', 'nu']
};
function marker(t, q) {
  const l = ' ' + q.toLowerCase().replace(/[.,;:!?'"]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const hit = (MARK[t] || []).filter(m => l.indexOf(' ' + m + ' ') !== -1 || l.indexOf(' ' + m + 'e ') !== -1);
  return hit.length ? cap(hit[0]) : null;
}
const STEM = v => { const w = NL.splitSep(v, v.f.ott.ik); return w; };
const KOF = /[tkfspxc]$|ch$/;
function wwTemplate(it, a, v) {
  const m = marker(it.t, it.q), pre = m ? m + ': ' : '';
  const stem = STEM(v), p = it.p === 'u' ? 'u' : it.p;
  const ending = a.length > stem.length && a.indexOf(stem) === 0 ? a.slice(stem.length) : null;
  let w, wn;
  switch (it.t) {
    case 'ott': {
      const pron = p === 'jij' && it.inv ? 'jij after the verb' : p;
      if (p === 'ik' || (p === 'jij' && it.inv)) w = `${cap(pron)}: ${v.v} takes the stem, no ending${a === stem ? '' : ', here ' + a}.`;
      else if (p === 'jij' || p === 'u' || p === 'hij') w = ending === 't' ? `${cap(p)}: stem plus t, ${a}.` : `${cap(p)}: the present of ${v.v} is ${a}.`;
      else w = `${cap(p)}: the plural present is the infinitive, ${a}.`;
      wn = (m ? m + ': ' : '') + 'de tegenwoordige tijd.'; if (!m) w = pre + w; else w = pre + 'present tense. ' + w;
      break;
    }
    case 'ovt': {
      if (ending === 'te' || ending === 'ten' || ending === 'de' || ending === 'den') {
        const k = KOF.test(stem);
        w = `${pre || ''}the simple past. ${stem} ends in ${stem.slice(KOF.test(stem) && /ch$/.test(stem) ? -2 : -1)}, ${k ? "in 't kofschip, so -te" : "not in 't kofschip, so -de"}${ending.length === 3 ? 'n' : ''}.`;
        if (!pre) w = cap(w);
        if (stem.endsWith('t') || stem.endsWith('d')) w = `${pre || ''}the simple past. ${stem} ends in ${stem.slice(-1)}, so ${ending}.`.replace(/^t/, 'T');
      } else w = `${pre || ''}the simple past of ${v.v} is irregular: ${a}.`.replace(/^t/, 'T');
      wn = (m ? m + ': ' : '') + 'de verleden tijd.';
      break;
    }
    case 'vtt': {
      const bare = it.sep ? stem : stem;
      if (a === 'ge' + stem) w = `Perfect: ge + ${stem}. ${stem} already ends in ${stem.slice(-1)}, so no extra ending.`;
      else if (/^ge.+[td]$/.test(a) && a.slice(2, -1) === stem.replace(/^(.*)$/, '$1').slice(0, a.length - 3)) w = `Perfect: ge + ${stem} + ${a.slice(-1)}${a.endsWith('t') ? (KOF.test(stem) ? ", " + stem.slice(-1) + " is in 't kofschip" : '') : ''}.`;
      else if (/en$/.test(a)) w = `Perfect: ${v.v} has an irregular participle, ${a}.`;
      else w = `Perfect: the participle of ${v.v} is ${a}.`;
      if (marker('vtt', it.q)) w = marker('vtt', it.q) + ': ' + w.charAt(0).toLowerCase() + w.slice(1);
      wn = 'Het voltooid deelwoord.'; break;
    }
    case 'hz': {
      const z = a === 'ben' || a === 'bent' || a === 'is' || a === 'zijn' || a === 'was' || a === 'waren';
      w = `${pre}${v.v} takes ${z ? 'zijn' : 'hebben'} in the perfect, so ${a}.`;
      wn = `${v.v} gaat met ${z ? 'zijn' : 'hebben'}.`; break;
    }
    case 'toek': w = it.v === 'gaan' ? `${pre}gaan + infinitive: the near future, here ${a}.` : `${pre}the future uses zullen: ${a}.`; wn = (m ? m + ': ' : '') + 'de toekomende tijd met zullen.'; break;
    case 'cond': w = `${pre}polite or unreal: zou or zouden, here ${a}.`; wn = 'Beleefd of onwerkelijk: zou, zouden.'; break;
    default: w = `Imperative: the stem of ${v.v}, ${a}, no ending.`; wn = 'De gebiedende wijs: de stam.';
  }
  return { w: w.length <= 110 ? w : w.slice(0, 107).replace(/[ ,.]+\S*$/, '') + '.', wn };
}
function dehetTemplate(it, a, w) {
  const N = cap(it.n), g = w.g, pl = isPlural(it, w);
  const gw = pl ? 'plural' : g === 'dh' ? 'de or het' : g;
  const o = { art: [pl ? `Plural nouns always take de, so ${a}.` : g === 'dh' ? `${N} can take de or het.` : `${N} is a ${g} word.`, `${N}: ${pl ? 'meervoud, altijd de' : g === 'dh' ? 'de of het' : 'een ' + g + '-woord'}.`],
    dem: [`${N} is ${pl ? 'plural' : 'a ' + g + ' word'}, so ${a}${/dit|dat/.test(a) ? '' : ''}.`, `${N}: ${pl ? 'meervoud' : g + '-woord'}, dus ${a}.`],
    rel: [`${N} is ${pl ? 'plural' : 'a ' + g + ' word'}, so the relative word is ${a}.`, `${N}: ${pl ? 'meervoud' : g + '-woord'}, dus ${a}.`] }[it.t];
  if (it.t === 'adj') {
    const det = adjDet(it), bare = a === it.adj;
    if (bare) return { w: `${N} is a het word, singular, ${det ? 'after ' + det : 'with no article'}: no -e.`, wn: `${N} is een het-woord: geen -e.` };
    if (pl) return { w: `Plural: the adjective always takes -e, ${a}.`, wn: 'Meervoud: altijd -e.' };
    if (g === 'de') return { w: `${N} is a de word: the adjective takes -e, ${a}.`, wn: `${N} is een de-woord: -e.` };
    return { w: `After ${det} a het word still takes -e: ${a}.`, wn: `Na ${det}: -e.` };
  }
  return { w: o[0], wn: o[1] };
}
function mvTemplate(it, a, w) {
  const n = w.nl, last = n.slice(-1);
  let t, wn;
  if (it.t === 'pl') {
    if (a === n + 'en' && /[aeiou][aeiou][^aeiou]$/.test(n)) { t = `${n}: the long vowel stays double, so ${a}.`; }
    else if (a === n + 'en') t = `${cap(n)}: add -en, ${a}.`;
    else if (a === n + 's') t = `${cap(n)}: this ending takes -s, ${a}.`;
    else if (a === n + "'s") t = `${cap(n)} ends on a long vowel sound: add 's, ${a}.`;
    else if (a === n + last + 'en') t = `${cap(n)}: short vowel, so double the consonant: ${a}.`;
    else if (a === n + last + 's') t = `${cap(n)}: short vowel, double the consonant: ${a}.`;
    else if (n.replace(/([aeou])\1([^aeiou]+)$/, '$1$2') + 'en' === a) t = `${cap(n)}: the vowel is written single before -en, ${a}.`;
    else if (/s$/.test(n) && a === n.slice(0, -1) + 'zen') t = `${cap(n)}: s becomes z before -en, ${a}.`;
    else if (/f$/.test(n) && a === n.slice(0, -1) + 'ven') t = `${cap(n)}: f becomes v before -en, ${a}.`;
    else t = `${cap(n)}: irregular plural, learn ${a}.`;
    wn = `${cap(n)}: meervoud ${a}.`;
  } else if (it.t === 'dim') {
    const sfx = a.startsWith(n) ? a.slice(n.length) : null;
    t = sfx === 'je' ? `${cap(n)}: diminutive -je, ${a}. Diminutives are always het.` : sfx === 'tje' ? `${cap(n)}: diminutive -tje, ${a}. Diminutives are always het.` : sfx === 'pje' ? `${cap(n)} ends in m: -pje, ${a}.` : sfx === 'etje' ? `${cap(n)}: short vowel plus l, n, r, ng or m: -etje, ${a}.` : `${cap(n)}: the diminutive is ${a}, always het.`;
    wn = `${cap(n)}: verkleinwoord ${a}.`;
  } else { t = `A diminutive plural always takes -s: ${a}.`; wn = `Verkleinwoord, meervoud: altijd -s.`; }
  return { w: t, wn };
}
const FALLBACK = {
  inv: 'A word in first place pushes the verb to second place.',
  bijzin: 'After the linking word the verb goes to the end.',
  scheid: 'The separable part goes to the end; in a bijzin it joins the verb.',
  vraag: 'In a question the verb comes before the subject.',
  te: 'Use om te or te with the infinitive; modals take no te.',
  cluster: 'In the final cluster the verbs stay together at the end.',
  geen: 'Geen goes before a noun with een or no article.',
  niet: 'Niet negates a verb, a definite noun, a name or an adjective.',
  pos: 'Niet goes before the final verb part or the information it negates.',
  neg: 'Use the negative word that fits: nooit, niemand, niets, nergens.',
  meer: 'Combine the negative with meer or nog: geen ... meer, nog niet.'
};

/* ---- gate ------------------------------------------------------------------------------- */
/* gate(item) -> null when the item passes, else the reason. Run on finished items
 * (build) and on the built files (test). */
function gate(it) {
  if (!TOPICS[it.k]) return 'kind ' + it.k;
  if (TOPICS[it.k].indexOf(it.t) === -1) return `topic ${it.t} not valid for ${it.k}`;
  if (BANDS.indexOf(it.b) === -1) return 'band ' + it.b;
  if (typeof it.q !== 'string' || (it.q.match(/___/g) || []).length !== 1) return 'q needs exactly one ___';
  if (!it.e) return 'no English';
  if (!it.w) return 'no w';
  if (it.w.length > 110) return 'w over 110 chars';
  for (const f of ['q', 'e', 'w', 'wn']) if (it[f] && dash(it[f])) return 'dash in ' + f;
  const n = toks(it.q.replace(/\([^)]*\)/g, '')).length;
  if (n < 3 || n > 14) return `q is ${n} words`;
  if (!Array.isArray(it.o) || it.o.length < 2 || it.o.length > 4) return 'o needs 2 to 4 options';
  if (uniq(it.o).length !== it.o.length) return 'options not distinct';
  if (typeof it.a !== 'string' || !it.a) return 'no a';
  if (it.o.indexOf(it.a) === -1) return 'a not in o';
  if ((it.x || []).some(z => it.o.indexOf(z) !== -1 && z !== it.a && it.k !== 'dehet')) return 'an accepted alternative is also a wrong option';
  const lc = s => (/^___/.test(it.q) ? s.charAt(0).toLowerCase() + s.slice(1) : s);
  if (it.k === 'ww') {
    const v = byV[it.v];
    if (!v) return 'verb ' + it.v + ' not in verbs.js';
    const want = wwAnswer(it);
    if (!want) return 'NL.form gives nothing';
    if (lc(it.a) !== want) return `a "${it.a}" but NL.form gives "${want}"`;
    const real = realForms(it);
    const bad = it.o.filter(o => real.indexOf(lc(o)) === -1);
    if (bad.length) return 'option(s) not real forms: ' + bad.join(', ');
  }
  if (it.k === 'volg') {
    const wa = toks(it.a).map(x => x.toLowerCase());
    const key = s => toks(s).map(x => x.toLowerCase()).sort().join(' ');
    if (wa.length > 1 && it.o.some(o => o !== it.a && key(o) === key(it.a))) {   // a chunk item: options reorder the same words
      const bad = it.o.filter(o => key(o) !== key(it.a));
      if (bad.length) return 'chunk option(s) with other words than a: ' + bad.join(' | ');
    }
  }
  if (it.k === 'dehet' && it.t !== 'bez' && it.n) {
    const r = dehetAnswer(it);
    if (r.err) return r.err;
    if (lc(it.a) !== r.a) return `a "${it.a}" but words.js gives "${r.a}"`;
  }
  if (it.k === 'mv' && it.n) {
    const r = mvAnswer(it);
    if (r.err) return r.err;
    if (lc(it.a) !== r.a) return `a "${it.a}" but words.js gives "${r.a}"`;
  }
  return null;
}

module.exports = { NL, VERBS, WORDS, byV, byW, noun, adjective, TOPICS, BANDS, dash, toks, uniq, cap, formsOf, realForms, wwOpts, wwAnswer,
  dehetAnswer, adjDet, isPlural, mvAnswer, mvWrong, wwTemplate, dehetTemplate, mvTemplate, FALLBACK, gate };
