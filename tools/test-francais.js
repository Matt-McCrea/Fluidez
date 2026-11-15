#!/usr/bin/env node
/* Tests for Couramment (francais/): the answer checker, FR.form on hand-written
 * cases, and the data tables.   node tools/test-francais.js */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FR = require(path.join(ROOT, 'francais/js/fr-text.js'));
const V = require(path.join(ROOT, 'francais/data/verbs.js'));
const W = require(path.join(ROOT, 'francais/data/words.js'));
FR.setVerbs(V);

let fails = 0, passes = 0;
function eq(got, want, what) {
  if (got === want) { passes++; return; }
  fails++; console.log(`FAIL ${what}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
}
function ok(cond, what) { if (cond) passes++; else { fails++; console.log('FAIL ' + what); } }

// ---- fold, bare, check ------------------------------------------------------
eq(FR.fold('  École  Normale! '), 'école normale', 'fold');
eq(FR.fold('cœur'), 'coeur', 'fold oe ligature');
eq(FR.fold('Œuf'), 'oeuf', 'fold capital oe ligature');
eq(FR.fold('l’arbre'), "l'arbre", 'fold curly apostrophe');
eq(FR.fold("l' arbre"), "l'arbre", 'fold space after elision');
eq(FR.fold('Bonjour !'), 'bonjour', 'fold punctuation');
eq(FR.fold('donne-le-moi'), 'donne-le-moi', 'fold keeps hyphens');
eq(FR.bare('français'), 'francais', 'bare cedilla');
eq(FR.bare('où'), 'ou', 'bare grave');
[['ecole', ['école'], 'near'], ['École.', ['école'], 'good'], ['ECOLE.', ['école'], 'near'], ['mange', ['mangé'], 'wrong'], ['mangé', ['mangé'], 'good'],
 ['a', ['à'], 'wrong'], ['à', ['à'], 'good'], ['ou', ['où'], 'wrong'], ['où', ['où'], 'good'], ['coeur', ['cœur'], 'good'], ["l’arbre", ["l'arbre"], 'good'],
 ['cafe', ['café'], 'near'], ['francais', ['français'], 'near'], ['eleve', ['élève'], 'near'], ['etait', ['était'], 'near'], ['ete', ['été'], 'near'],
 ['sur', ['sûr'], 'wrong'], ['des', ['dès'], 'wrong'], ['la', ['là'], 'wrong'], ['crée', ['créé'], 'wrong'], ['cree', ['créé'], 'near'], ['age', ['âge'], 'near'],
 ['alle', ['allé'], 'near'], ['xyz', ['école'], 'wrong'], ['', ['école'], 'wrong'], ['maison', ['la maison', 'maison'], 'good'], ['la maison', ['la maison', 'maison'], 'good'],
 ['  VAS  ', ['vas'], 'good'], ['vas', ['va'], 'wrong']]
  .forEach(([i, a, w]) => eq(FR.check(i, a), w, `check ${i} ${a}`));
eq(FR.check('ecole', ['école'], { others: ['ecole'] }), 'wrong', 'check with extra trap');
eq(FR.check('etre', ['être'], { verb: 'être' }), 'near', 'check with verb option, not a form');
eq(FR.check('est', ['être'], { verb: 'être' }), 'wrong', 'check with verb option');

// ---- FR.form ---------------------------------------------------------------------
const F = (v, t, p, o) => FR.form(v, t, p, o);
[
  ['être', 'pres', 'je', {}, 'suis'], ['avoir', 'pres', 'tu', {}, 'as'], ['aller', 'pres', 'il', {}, 'va'], ['faire', 'pres', 'nous', {}, 'faisons'],
  ['dire', 'pres', 'vous', {}, 'dites'], ['faire', 'pres', 'ils', {}, 'font'], ['être', 'pres', 'ils', {}, 'sont'], ['aller', 'pres', 'elle', {}, 'va'],
  ['aller', 'pres', 'on', {}, 'va'], ['faire', 'pres', 'elles', {}, 'font'], ['pouvoir', 'pres', 'je', {}, 'peux'], ['vouloir', 'pres', 'nous', {}, 'voulons'],
  ['savoir', 'pres', 'vous', {}, 'savez'], ['prendre', 'pres', 'ils', {}, 'prennent'], ['venir', 'pres', 'il', {}, 'vient'], ['mettre', 'pres', 'tu', {}, 'mets'],
  ['devoir', 'pres', 'je', {}, 'dois'], ['finir', 'pres', 'nous', {}, 'finissons'], ['manger', 'pres', 'nous', {}, 'mangeons'], ['commencer', 'pres', 'nous', {}, 'commençons'],
  ['appeler', 'pres', 'il', {}, 'appelle'], ['appeler', 'pres', 'nous', {}, 'appelons'], ['espérer', 'pres', 'tu', {}, 'espères'], ['nettoyer', 'pres', 'il', {}, 'nettoie'],
  ['envoyer', 'pres', 'ils', {}, 'envoient'], ['boire', 'pres', 'vous', {}, 'buvez'], ['voir', 'pres', 'ils', {}, 'voient'], ['ouvrir', 'pres', 'je', {}, 'ouvre'],
  ['acheter', 'pres', 'je', {}, 'achète'], ['jeter', 'pres', 'tu', {}, 'jettes'], ['lire', 'pres', 'il', {}, 'lit'], ['parler', 'pres', 'ils', {}, 'parlent'],
  ['manger', 'imp', 'je', {}, 'mangeais'], ['commencer', 'imp', 'il', {}, 'commençait'], ['finir', 'imp', 'nous', {}, 'finissions'], ['être', 'imp', 'je', {}, 'étais'],
  ['faire', 'imp', 'nous', {}, 'faisions'], ['avoir', 'imp', 'vous', {}, 'aviez'],
  ['appeler', 'fut', 'je', {}, 'appellerai'], ['être', 'fut', 'je', {}, 'serai'], ['aller', 'fut', 'nous', {}, 'irons'], ['avoir', 'fut', 'tu', {}, 'auras'],
  ['faire', 'fut', 'il', {}, 'fera'], ['voir', 'fut', 'ils', {}, 'verront'], ['pouvoir', 'fut', 'je', {}, 'pourrai'], ['venir', 'fut', 'vous', {}, 'viendrez'],
  ['finir', 'cond', 'je', {}, 'finirais'], ['être', 'cond', 'tu', {}, 'serais'], ['aller', 'cond', 'il', {}, 'irait'], ['avoir', 'cond', 'nous', {}, 'aurions'],
  ['vouloir', 'cond', 'je', {}, 'voudrais'], ['faire', 'cond', 'vous', {}, 'feriez'],
  ['faire', 'subj', 'je', {}, 'fasse'], ['aller', 'subj', 'nous', {}, 'allions'], ['être', 'subj', 'il', {}, 'soit'], ['avoir', 'subj', 'tu', {}, 'aies'],
  ['pouvoir', 'subj', 'je', {}, 'puisse'], ['savoir', 'subj', 'je', {}, 'sache'], ['vouloir', 'subj', 'il', {}, 'veuille'], ['prendre', 'subj', 'nous', {}, 'prenions'],
  ['venir', 'subj', 'ils', {}, 'viennent'], ['parler', 'subj', 'je', {}, 'parle'],
  ['être', 'imper', 'tu', {}, 'sois'], ['aller', 'imper', 'nous', {}, 'allons'], ['venir', 'imper', 'vous', {}, 'venez'], ['aller', 'imper', 'tu', {}, 'va'],
  ['avoir', 'imper', 'tu', {}, 'aie'], ['faire', 'imper', 'vous', {}, 'faites'], ['manger', 'imper', 'tu', {}, 'mange'], ['finir', 'imper', 'tu', {}, 'finis'],
  ['finir', 'pc', 'je', {}, 'fini'], ['prendre', 'pc', 'je', {}, 'pris'], ['mettre', 'pc', 'il', {}, 'mis'], ['être', 'pc', 'je', {}, 'été'], ['avoir', 'pc', 'je', {}, 'eu'],
  ['faire', 'pc', 'je', {}, 'fait'], ['dire', 'pc', 'je', {}, 'dit'], ['voir', 'pc', 'je', {}, 'vu'], ['ouvrir', 'pc', 'je', {}, 'ouvert'], ['écrire', 'pc', 'je', {}, 'écrit'],
  ['pouvoir', 'pc', 'je', {}, 'pu'], ['boire', 'pc', 'je', {}, 'bu'], ['naître', 'pc', 'il', {}, 'né'],
  ['aller', 'pc', 'elles', { agree: 'fp' }, 'allées'], ['aller', 'pc', 'elle', { agree: 'f' }, 'allée'], ['aller', 'pc', 'ils', { agree: 'mp' }, 'allés'],
  ['prendre', 'pc', 'elles', { agree: 'fp' }, 'prises'], ['mettre', 'pc', 'elle', { agree: 'f' }, 'mise'], ['voir', 'pc', 'ils', { agree: 'mp' }, 'vus'],
  ['mettre', 'pc', 'ils', { agree: 'mp' }, 'mis'], ['mourir', 'pc', 'elle', { agree: 'f' }, 'morte'], ['aller', 'pqp', 'elles', { agree: 'fp' }, 'allées'],
  ['venir', 'ae', 'je', {}, 'suis'], ['finir', 'ae', 'je', {}, 'ai'], ['monter', 'ae', 'je', { aux: 'a' }, 'ai'], ['monter', 'ae', 'je', {}, 'suis'],
  ['sortir', 'ae', 'il', { aux: 'a' }, 'a'], ['sortir', 'ae', 'il', {}, 'est'], ['aller', 'ae', 'nous', {}, 'sommes'], ['aller', 'ae', 'je', { tt: 'imp' }, 'étais'],
  ['finir', 'ae', 'tu', { tt: 'imp' }, 'avais'], ['se lever', 'ae', 'nous', {}, 'sommes'], ['se lever', 'ae', 'ils', { tt: 'imp' }, 'étaient'], ['venir', 'ae', 'elle', {}, 'est'],
  ['descendre', 'ae', 'vous', { aux: 'a' }, 'avez'], ['passer', 'ae', 'ils', {}, 'sont'], ['rentrer', 'ae', 'elles', { aux: 'a' }, 'ont'],
  ['partir', 'fp', 'je', {}, 'vais'], ['manger', 'fp', 'tu', {}, 'vas'], ['faire', 'fp', 'nous', {}, 'allons'], ['venir', 'fp', 'ils', {}, 'vont'], ['finir', 'fp', 'elles', {}, 'vont'],
  ['se lever', 'pres', 'je', {}, 'lève'], ['se lever', 'pc', 'je', {}, 'levé'],
  ['falloir', 'pres', 'il', {}, 'faut'], ['falloir', 'fut', 'il', {}, 'faudra'], ['pleuvoir', 'pres', 'il', {}, 'pleut'],
  ['aller', 'imper', 'il', {}, null], ['pouvoir', 'imper', 'tu', {}, null], ['falloir', 'pres', 'je', {}, null], ['nonexistent', 'pres', 'je', {}, null], ['aller', 'pres', 'moi', {}, null]
].forEach(c => eq(F(c[0], c[1], c[2], c[3]), c[4], `form ${c[0]} ${c[1]} ${c[2]} ${JSON.stringify(c[3])}`));
eq(FR.verb('aller').aux, 'e', 'verb lookup');
eq(FR.verb('monter').aux, 'ae', 'verb lookup ae');
eq(FR.verb('nonexistent'), null, 'verb lookup miss');
eq(FR.verb('parler', V).v, 'parler', 'verb lookup with table');

// ---- data: verbs -----------------------------------------------------------------
const seenV = {};
const DEF = { falloir: 1, pleuvoir: 1 }, NOIMPER = { pouvoir: 1, falloir: 1, pleuvoir: 1 };
V.forEach((v, i) => {
  const w = 'verb ' + v.v;
  ok(!seenV[v.v], w + ' duplicate'); seenV[v.v] = 1;
  ok(v.en && !/[–—]|\s-\s|-/.test(v.en), w + ' gloss with dash or empty: ' + v.en);
  ok(['a', 'e', 'ae'].includes(v.aux), w + ' aux');
  ok(['A1', 'A2', 'B1'].includes(v.b), w + ' band');
  ok(v.r === i + 1, w + ' rank');
  ok(v.f && v.f.inf === v.v, w + ' inf');
  if (v.pron) ok(v.aux === 'e' && /^(se |s')/.test(v.v), w + ' pronominal: se/s\' and être');
  const want = [];
  ['pres', 'imp', 'fut', 'cond', 'subj'].forEach(t => ['je', 'tu', 'il', 'nous', 'vous', 'ils'].forEach(p => {
    if (DEF[v.v] && p !== 'il') return;
    want.push([t + '.' + p, v.f[t] && v.f[t][p]]);
  }));
  if (!NOIMPER[v.v]) ['tu', 'nous', 'vous'].forEach(p => want.push(['imper.' + p, v.f.imper && v.f.imper[p]]));
  want.push(['pp', v.f.pp]);
  want.forEach(([k, x]) => ok(typeof x === 'string' && x.length > 0 && x !== '-' && !/\s/.test(x), `${w} form ${k}: ${JSON.stringify(x)}`));
  // futur and conditionnel share a stem; imparfait follows nous
  if (!DEF[v.v]) {
    ok(v.f.cond.je === v.f.fut.je + 's' || v.f.cond.je === v.f.fut.je.slice(0, -2) + 'ais', `${w} cond vs fut`);
    if (v.v !== 'être') ok(v.f.imp.nous === v.f.pres.nous.replace(/geons$/, 'gions').replace(/çons$/, 'cions').replace(/([^i])ons$/, '$1ions').replace(/ions$/, m => v.f.imp.nous.endsWith('iions') ? 'iions' : m), `${w} imp nous ${v.f.imp.nous} vs pres nous ${v.f.pres.nous}`);
  }
});
['être', 'avoir', 'aller', 'faire', 'dire', 'pouvoir', 'vouloir', 'savoir', 'voir', 'venir', 'prendre', 'mettre', 'devoir', 'falloir', 'parler', 'finir', 'manger', 'commencer', 'appeler',
  'se lever', 'se souvenir', 's\'appeler', 'rester', 'arriver', 'partir', 'entrer', 'sortir', 'monter', 'descendre', 'naître', 'mourir', 'tomber', 'retourner', 'devenir', 'revenir', 'rentrer', 'passer']
  .forEach(x => ok(seenV[x], 'verb required: ' + x));
// the être verbs
['aller', 'venir', 'arriver', 'partir', 'entrer', 'naître', 'mourir', 'rester', 'tomber', 'devenir', 'revenir'].forEach(x => eq(FR.verb(x).aux, 'e', 'aux ' + x));
['monter', 'descendre', 'sortir', 'rentrer', 'passer', 'retourner'].forEach(x => eq(FR.verb(x).aux, 'ae', 'aux ' + x));
['parler', 'finir', 'manger', 'faire', 'avoir', 'être', 'prendre'].forEach(x => eq(FR.verb(x).aux, 'a', 'aux ' + x));
ok(V.length >= 290 && V.length <= 310, 'about 300 verbs, got ' + V.length);
ok(V.filter(v => v.b === 'A1').length === 90 && V.filter(v => v.b === 'A2').length === 110, 'verb bands 90 / 110');

// ---- data: words ----------------------------------------------------------------------
const THEMES = ['base', 'faire', 'decrire', 'nombres', 'couleurs', 'famille', 'gens', 'corps', 'nourriture', 'maison', 'ville', 'voyage', 'meteo', 'temps', 'travail', 'ecole', 'loisirs', 'vetements', 'sentiments', 'nature', 'langue', 'societe'];
const RUDE = ['putain', 'merde', 'connard', 'salope', 'pute', 'bite', 'couille', 'chier', 'enculé', 'bordel', 'nègre', 'pédé', 'sexe', 'viol', 'meurtre', 'cadavre', 'tuer'];
const seenW = {};
W.forEach((w, i) => {
  const t = 'word ' + w.fr;
  ok(!seenW[w.fr], t + ' duplicate fr'); seenW[w.fr] = 1;
  ok(w.en && !/[–—]|\s-\s|-/.test(w.en), t + ' gloss with dash or empty: ' + w.en);
  ok(THEMES.includes(w.th), t + ' theme ' + w.th);
  ok(['n', 'v', 'adj', 'adv', 'prep', 'pron', 'num', 'x'].includes(w.pos), t + ' pos ' + w.pos);
  ok(['A1', 'A2', 'B1', 'B2'].includes(w.b), t + ' band');
  ok(w.r === i + 1, t + ' rank');
  ok(!RUDE.includes(w.fr), t + ' is on the rude list');
  if (w.pos === 'n') { ok(['m', 'f', 'mf'].includes(w.g), t + ' noun needs g'); ok(typeof w.pl === 'string' && w.pl || w.pl === undefined, t + ' pl'); }
  if (w.pos === 'adj') ['fem', 'mpl', 'fpl'].forEach(k => ok(typeof w[k] === 'string' && w[k], t + ' adjective needs ' + k));
});
ok(W.length >= 2700 && W.length <= 2900, 'about 2800 words, got ' + W.length);
ok(W.filter(w => w.pos === 'n').length > 1000, 'plenty of nouns');
const bandAt = (r) => W[r - 1].b;
eq(bandAt(700), 'A1', 'band 700'); eq(bandAt(701), 'A2', 'band 701'); eq(bandAt(1501), 'B1', 'band 1501'); eq(bandAt(2501), 'B2', 'band 2501');
const wd = (x) => W.find(w => w.fr === x);
eq(wd('maison').g, 'f', 'maison f'); eq(wd('homme').g, 'm', 'homme m'); eq(wd('cheval').pl, 'chevaux', 'cheval pl'); eq(wd('grand').fem, 'grande', 'grand fem');
eq(wd('heureux').fpl, 'heureuses', 'heureux fpl'); eq(wd('beau').mpl, 'beaux', 'beau mpl'); eq(wd('enfant').g, 'mf', 'enfant mf');

// ---- data: gap banks (re-run the build gate on every built item) --------------------
const LIB = require(path.join(ROOT, 'tools/fr/gaps-lib.js'));
['vb', 'genre', 'pron', 'neg', 'prep'].forEach(k => {
  const items = require(path.join(ROOT, 'francais/data/gaps-' + k + '.js'));
  const seenQ = {};
  items.forEach((it, i) => {
    const g = LIB.gate(it);
    ok(!g && it.k === k, `gaps-${k} #${i} ${it.q}: ${g || 'wrong kind ' + it.k}`);
    ok(!seenQ[it.q], `gaps-${k} duplicate q ${it.q}`); seenQ[it.q] = 1;
  });
  ok(items.length > 0, `gaps-${k} is empty`);
});
// ---- data: phrases -------------------------------------------------------------------
{
  const P = require(path.join(ROOT, 'francais/data/phrases.js'));
  const seenP = {};
  ok(P.length > 0, 'phrases is empty');
  P.forEach(p => {
    const t = 'phrase ' + p.fr;
    ok(p.fr && p.en && p.th, t + ' needs fr, en, th');
    ok(['A1', 'A2', 'B1', 'B2'].includes(p.b) && [1, 2, 3].includes(p.t), t + ' band or tier');
    ok(!/[–—]|\s-\s/.test(JSON.stringify(p)), t + ' has a dash');
    ok(p.fr.replace(/[.,;:!?]/g, '').trim().split(/\s+/).length <= 8, t + ' over 8 words');
    ok(!seenP[p.fr], t + ' duplicate'); seenP[p.fr] = 1;
  });
}

console.log(`${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
