/* gaps-lib.js: the rules shared by tools/fr/build-gaps.js and
 * tools/test-francais.js. Computes answers (vb, genre) and gates every
 * finished GAP item (docs/couramment-spec.md, Gate; Vlot's gate). */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const FR = require(path.join(ROOT, 'francais/js/fr-text.js'));
const VERBS = require(path.join(ROOT, 'francais/data/verbs.js'));
const WORDS = require(path.join(ROOT, 'francais/data/words.js'));
FR.setVerbs(VERBS);
const byV = {}; VERBS.forEach(v => { byV[v.v] = v; });
const byW = {}; WORDS.forEach(w => { (byW[w.fr] = byW[w.fr] || []).push(w); });

const BANDS = ['A1', 'A2', 'B1', 'B2'];
const TOPICS = {
  vb: ['pres', 'imp', 'fut', 'cond', 'subj', 'imper', 'pc', 'ae', 'pqp', 'fp'],
  genre: ['art', 'part', 'contr', 'adj', 'dem', 'poss'],
  pron: ['cod', 'coi', 'y', 'en', 'ordre', 'ton', 'rel'],
  neg: ['pas', 'pasde', 'autres', 'que', 'familier'],
  prep: ['lieu', 'verbe', 'temps', 'moyen']
};
const dash = s => /[–—]|\s-\s/.test(s);
const toks = s => String(s).replace(/[.,;:!?"“”«»()]/g, ' ').trim().split(/\s+/).filter(Boolean);
const uniq = a => a.filter((x, i) => x && a.indexOf(x) === i);
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const low = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;

/* ---- vowels, h muet ------------------------------------------------------- */
const H_ASP = /^(h[aâ]ï|hache|haie|haine|halle|hall|halte|hamac|hamburger|hamster|hanche|handicap|hangar|haricot|harceler|hareng|harpe|hasard|hâte|hausse|haut|havre|hein|hérisson|héron|héros|heurt|hibou|hiérarchie|hip|hobby|hockey|hollandais|homard|hongrois|honte|honteux|hors|housse|hublot|huer|huit|hurler|hurlement|husky|hache)/i;
const NOEL = /^(onze|oui|yaourt|yoga|yoyo|yeux|ouistiti|whisky|week|ouate|uhlan|yacht)/i;
function startsVowel(w) {
  w = String(w || '').toLowerCase().replace(/^[^a-zàâäéèêëîïôöùûüœæç]+/, '');
  if (!w) return false;
  if (NOEL.test(w) && !/^yeux/.test(w)) return false;
  if (/^h/.test(w)) return !H_ASP.test(w);
  return /^[aeiouyàâäéèêëîïôöùûüœæ]/.test(w);
}
function noun(n) { return (byW[n] || []).find(x => x.pos === 'n') || null; }
function adjective(n) { return (byW[n] || []).find(x => x.pos === 'adj') || null; }
const ELIDE_BEFORE = { beau: 'bel', nouveau: 'nouvel', vieux: 'vieil', fou: 'fol', mou: 'mol' };

/* the word after the gap ('' when none) */
function nextWord(q) {
  const m = /___\)?[\s]*([^\s.,;:!?]+)/.exec(q.replace(/\([^)]*\)/g, ' '));
  return m ? m[1].replace(/^['’]+/, '') : '';
}
function wordAfterGap(q) {
  const m = /___[\s]*(?:\([^)]*\)\s*)?([^\s.,;:!?]+)/.exec(q);
  return m ? m[1] : '';
}

/* ---- vb ------------------------------------------------------------------------ */
const stripSe = s => s.replace(/^(se |s')/, '');
function allStrings(v) {
  const f = v.f, out = [];
  Object.keys(f).forEach(k => {
    const x = f[k];
    if (typeof x === 'string') out.push(x);
    else if (x && typeof x === 'object') Object.keys(x).forEach(p => { if (typeof x[p] === 'string') out.push(x[p]); });
  });
  if (f.pp) ['m', 'f', 'mp', 'fp'].forEach(a => out.push(FR.agreeing(f.pp, a)));
  out.push(stripSe(f.inf));
  return out;
}
function formsOf(v) {
  const all = allStrings(v);
  // typed variants the table spells the other way (paie/paye, assois/assieds)
  return uniq(all.concat(all.map(w => w.replace(/ai(?=e)/, 'ay')), all.map(w => w.replace(/ay(?=e)/, 'ai'))));
}
function realForms(it) {
  const v = byV[it.v]; if (!v) return [];
  if (it.t === 'ae') return uniq(formsOf(byV['avoir']).concat(formsOf(byV['être'])));
  if (it.t === 'fp') return formsOf(byV['aller']);
  return formsOf(v);
}
function vbOpts(it) {
  const o = {};
  if (it.agree) o.agree = it.agree; if (it.tt) o.tt = it.tt; if (it.aux) o.aux = it.aux;
  return o;
}
function vbAnswer(it) { return FR.form(it.v, it.t, it.p || 'je', vbOpts(it)); }
/* typed alternatives of the computed answer */
function vbAlt(it, a) {
  const x = [];
  const v = byV[it.v];
  if (!v) return x;
  if (/^(payer|essayer|balayer|effrayer|rayer|bégayer)$/.test(v.v) && ['pres', 'subj', 'fut', 'cond', 'imper'].indexOf(it.t) !== -1) {
    if (/ai(?=e)/.test(a)) x.push(a.replace(/ai(?=e)/, 'ay'));
    else if (/ay(?=e)/.test(a)) x.push(a.replace(/ay(?=e)/, 'ai'));
  }
  if (/^(s')?asseoir$|^s'asseoir$/.test(v.v)) {
    const P = { je: 'assieds', tu: 'assieds', il: 'assied', nous: 'asseyons', vous: 'asseyez', ils: 'asseyent' };
    const p = FR.PERSON[it.p];
    if (it.t === 'pres') x.push(P[p]);
    if (it.t === 'imper') x.push(p === 'tu' ? 'assieds' : p === 'nous' ? 'asseyons' : 'asseyez');
    if (it.t === 'fut') x.push(a.replace(/^assoir/, 'assiér'));
    if (it.t === 'cond') x.push(a.replace(/^assoir/, 'assiér'));
  }
  return uniq(x).filter(z => z && z !== a);
}

/* ---- templates: vb ----------------------------------------------------------------- */
const PN = { je: ['il', 'tu', 'ils'], tu: ['je', 'il', 'vous'], il: ['je', 'ils', 'tu'], nous: ['vous', 'ils', 'il'], vous: ['nous', 'ils', 'tu'], ils: ['il', 'nous', 'vous'] };
const PNAME = { je: 'Je', tu: 'Tu', il: 'Il/elle', nous: 'Nous', vous: 'Vous', ils: 'Ils/elles' };
const ER = { je: 'e', tu: 'es', il: 'e', nous: 'ons', vous: 'ez', ils: 'ent' };
const IMPE = { je: 'ais', tu: 'ais', il: 'ait', nous: 'ions', vous: 'iez', ils: 'aient' };
const FUTE = { je: 'ai', tu: 'as', il: 'a', nous: 'ons', vous: 'ez', ils: 'ont' };
const CONDE = IMPE;
const SUBE = { je: 'e', tu: 'es', il: 'e', nous: 'ions', vous: 'iez', ils: 'ent' };
const fit = (...c) => { const ok = c.filter(Boolean).find(s => s.length <= 110); return ok || c.filter(Boolean).pop().slice(0, 107).replace(/[ ,.]+\S*$/, '') + '.'; };
function beforeGapText(q) { return q.slice(0, q.indexOf('___')).trim(); }
function marker(list, q) {
  const l = ' ' + q.toLowerCase().replace(/[.,;:!?]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const hit = list.filter(m => l.indexOf(' ' + m + ' ') !== -1 || (m.endsWith("'") && l.indexOf(' ' + m) !== -1));
  return hit.length ? hit[0] : null;
}
const MARK = {
  pres: ['maintenant', 'en ce moment', "aujourd'hui", "d'habitude"],
  imp: ['autrefois', 'jadis', "à l'époque", 'pendant que', 'souvent', 'toujours', 'chaque jour', 'tous les jours'],
  fut: ['demain', 'bientôt', 'plus tard', 'un jour', "l'année prochaine", 'la semaine prochaine', 'le mois prochain', 'dès que', 'après-demain', 'ce soir'],
  pc: ['hier', 'hier soir', 'ce matin', 'la semaine dernière', "l'année dernière", 'soudain', 'tout à coup'],
  cond: []
};
function subjTrigger(q) {
  const b = beforeGapText(q).replace(/^[^A-Za-zÀ-ÿ]+/, '');
  const m = /((?:[\wÀ-ÿ']+\s+){0,3}(?:qu'|que))\s*(?:[\wÀ-ÿ']+\s*){0,2}$/i.exec(b);
  if (m) return m[1].replace(/\s+/g, ' ').replace(/^(.*?)(\bje|tu|il|elle|nous|vous|ils|elles)\s+(?=(?:[\wÀ-ÿ']+\s+){0,1}que$)/i, '$1$2 ') .trim();
  const m2 = /(\b(?:pour que|avant que|bien que|afin que|à condition que|jusqu'à ce que|sans que|quoique)\b)/i.exec(b);
  return m2 ? m2[1] : null;
}
function vbTemplate(it, a, v) {
  const p = FR.PERSON[it.p] || 'je', P = PNAME[p], V = cap(stripSe(v.v));
  const q = it.q, inf = stripSe(v.v);
  const nousStem = v.f.pres.nous ? v.f.pres.nous.replace(/ons$/, '') : '';
  const er = /er$/.test(inf) && inf !== 'aller' && ['je', 'tu', 'il', 'nous', 'vous', 'ils'].every(k => v.f.pres[k].endsWith(ER[k]));
  const M = marker(MARK[it.t] || [], q), Mc = M ? cap(M) : null;
  switch (it.t) {
    case 'pres': {
      let w, wf;
      if (p === 'nous' && er && /ger$/.test(inf)) { w = `Nous: ${inf} keeps the e before -ons, so ${a}.`; wf = `Nous : ${inf} garde le e devant -ons.`; }
      else if (p === 'nous' && er && /cer$/.test(inf)) { w = `Nous: c becomes ç before -ons, so ${a}.`; wf = `Nous : c devient ç devant -ons.`; }
      else if (er) { w = `${P}: -er verbs take -${ER[p]} in the present, so ${a}.`; wf = `${P} : les verbes en -er prennent -${ER[p]}.`; }
      else if (v.f.pres.je && /s$/.test(v.f.pres.je) && /ir$/.test(inf) && nousStem && a.indexOf(nousStem.replace(/iss$/, '')) === 0 && /iss/.test(nousStem)) { w = `${P}: ${inf} is an -ir verb (${nousStem}-), so ${a}.`; wf = `${P} : verbe en -ir, ${a}.`; }
      else { w = `${P}: ${inf} is irregular in the present, ${a}.`; wf = `${P} : ${inf} est irrégulier au présent, ${a}.`; }
      return { w: fit(Mc ? `${Mc}: the present. ${w}` : w, w), wf: fit(wf) };
    }
    case 'imp': {
      const end = IMPE[p];
      const reg = nousStem && a === nousStem + end;
      const w = reg ? `Imperfect: nous stem ${nousStem}- + -${end}, so ${a}.` : `${V} is irregular in the imperfect: ${a}.`;
      const wf = reg ? `Imparfait : radical de nous ${nousStem}- + -${end}.` : `${V} est irrégulier à l'imparfait : ${a}.`;
      return { w: fit(Mc && reg ? `${Mc}: a habit or scene, imperfect. ${nousStem}- + -${end}.` : w, w), wf: fit(wf) };
    }
    case 'fut': {
      const end = FUTE[p], stem = a.slice(0, a.length - end.length);
      const reg = stem === inf.replace(/e$/, '');
      const w = reg ? `Future: the infinitive ${inf.replace(/e$/, '')}- + -${end}, so ${a}.` : `Irregular future stem ${stem}- + -${end}, so ${a}.`;
      const wf = reg ? `Futur : infinitif ${inf.replace(/e$/, '')}- + -${end}.` : `Futur : radical irrégulier ${stem}- + -${end}.`;
      return { w: fit(Mc ? `${Mc}: the future. ${w}` : w, w), wf: fit(wf) };
    }
    case 'cond': {
      const end = CONDE[p], stem = a.slice(0, a.length - end.length);
      const si = /\bsi\b/i.test(beforeGapText(q)) && !/\bsi\b.*___/i.test('') ;
      const w0 = `Conditional: future stem ${stem}- + -${end}, so ${a}.`;
      const w = si ? `Si + imperfect, result in the conditional: ${stem}- + -${end}.` : w0;
      const wf = si ? `Si + imparfait : le conditionnel, ${stem}- + -${end}.` : `Conditionnel : radical du futur ${stem}- + -${end}.`;
      return { w: fit(w, w0), wf: fit(wf) };
    }
    case 'subj': {
      const tr = subjTrigger(q);
      const ils = v.f.pres.ils ? v.f.pres.ils.replace(/ent$/, '') : '';
      const reg = a === ils + SUBE[p] || (p === 'nous' && a === v.f.imp.nous.replace(/ais$/, '') + '') ;
      const w1 = tr ? `After "${low(tr)}": the subjunctive. ${reg ? `ils stem ${ils}- + -${SUBE[p]}` : V + ' is irregular'}, ${a}.` : null;
      const w2 = reg ? `The subjunctive: ils stem ${ils}- + -${SUBE[p]}, so ${a}.` : `${V} has an irregular subjunctive: ${a}.`;
      const wf = tr ? `Après « ${low(tr)} » : le subjonctif, ${a}.` : `Subjonctif : ${a}.`;
      return { w: fit(w1, w2), wf: fit(wf) };
    }
    case 'imper': {
      const pr = v.f.pres[p];
      let w, wf;
      if (p === 'tu' && er) { w = `Tu command of an -er verb drops the s: ${a}.`; wf = `Impératif tu d'un verbe en -er : pas de s, ${a}.`; }
      else if (a !== pr) { w = `${V} has an irregular imperative: ${a}.`; wf = `${V} a un impératif irrégulier : ${a}.`; }
      else { w = `${p === 'nous' ? 'Let\'s: ' : 'Command: '}the present form without the pronoun, ${a}.`; wf = `Impératif : le présent sans pronom, ${a}.`; }
      return { w: fit(w), wf: fit(wf) };
    }
    case 'pc': case 'pqp': {
      const pc = it.t === 'pc';
      const aux = v.pron ? 'e' : v.aux === 'ae' ? (it.aux === 'a' ? 'a' : 'e') : v.aux;
      const beforeG = beforeGapText(q).toLowerCase();
      const etreSeen = /\b(suis|es|est|sommes|êtes|sont|étais|était|étions|étiez|étaient)\s*(déjà\s*)?$/.test(beforeG) || /(s'est|se sont|m'est|t'es|nous sommes|vous êtes|s'était|s'étaient)\s*(déjà\s*)?$/.test(beforeG);
      const pp = v.f.pp, base = FR.agreeing(pp, null);
      let rule;
      if (/er$/.test(inf) && pp === inf.replace(/er$/, 'é')) rule = `-er verbs: participle in -é`;
      else if (/ir$/.test(inf) && pp === inf.replace(/ir$/, 'i')) rule = `-ir verbs: participle in -i`;
      else if (/re$/.test(inf) && pp === inf.replace(/re$/, 'u')) rule = `-re verbs: participle in -u`;
      else rule = `${inf} has an irregular participle`;
      let w, wf;
      if (it.agree && etreSeen) {
        w = `With être the participle agrees with the subject: ${base}${a === base ? '' : ' + agreement'}, ${a}.`;
        wf = `Avec être, le participe s'accorde avec le sujet : ${a}.`;
        if (v.pron) { w = `Reflexive verb: être, and the participle agrees with the subject: ${a}.`; wf = `Verbe pronominal : être, accord avec le sujet : ${a}.`; }
      } else if (etreSeen && aux === 'e') {
        w = `${V} takes être, but ${a} stays masculine singular here.`; wf = `${V} se conjugue avec être : ${a}.`;
      } else {
        w = `${pc ? 'Perfect' : 'Pluperfect'}: ${rule}, so ${a}. No agreement with avoir.`; wf = `${pc ? 'Passé composé' : 'Plus-que-parfait'} : ${a}. Pas d'accord avec avoir.`;
      }
      const w2 = `${rule}, so ${a}.`;
      const pre = Mc && pc && !etreSeen ? `${Mc}: the perfect. ${w2}` : null;
      return { w: fit(pre, w, w2), wf: fit(wf) };
    }
    case 'ae': {
      const im = it.tt === 'imp';
      let w, wf;
      if (v.pron) { w = `Reflexive verbs always take être: ${a}.`; wf = `Les verbes pronominaux prennent toujours être : ${a}.`; }
      else if (a === 'ai' || a === 'as' || a === 'a' || a === 'avons' || a === 'avez' || a === 'ont' || /^av/.test(a)) {
        if (v.aux === 'ae') { w = `${V} with a direct object takes avoir: ${a}.`; wf = `${V} avec un objet direct : avoir, ${a}.`; }
        else { w = `${V} takes avoir in compound tenses: ${a}.`; wf = `${V} se conjugue avec avoir : ${a}.`; }
      } else {
        if (v.aux === 'ae') { w = `${V} without an object takes être: ${a}.`; wf = `${V} sans objet direct : être, ${a}.`; }
        else { w = `${V} is a verb of movement or change: être, ${a}.`; wf = `${V} : verbe de mouvement, être, ${a}.`; }
      }
      if (im) { w = w.replace(/\.$/, '') + ' (pluperfect).'; }
      return { w: fit(w), wf: fit(wf) };
    }
    case 'fp': {
      return { w: fit(`Near future: aller + infinitive; aller with ${p} is ${a}.`), wf: fit(`Futur proche : aller + infinitif, ${a}.`) };
    }
  }
  return { w: 'The right form of the verb.', wf: 'La bonne forme du verbe.' };
}

/* ---- genre ----------------------------------------------------------------------------- */
const isPl = (it, w) => {
  if (it.pl === 1 || it.pl === true) return true;
  if (it.pl === 0 || it.pl === false) return false;
  if (['les', 'des', 'ces', 'aux', 'mes', 'tes', 'ses', 'nos', 'vos', 'leurs'].indexOf(String(it.a || '').toLowerCase()) !== -1) return true;
  const t = toks(it.q).map(x => x.toLowerCase());
  return !!w.pl && t.indexOf(w.pl.toLowerCase()) !== -1 && t.indexOf(w.fr.toLowerCase()) === -1 && w.pl !== w.fr;
};
/* gender candidates: 'm', 'f', or both for mf nouns (the author decides) */
function genders(w) { return w.g === 'mf' ? ['m', 'f'] : [w.g]; }
/* articleSets(it) -> { a: [accepted computed answers] } or { err } */
function genreAnswers(it) {
  const w = noun(it.n);
  if (!w) return { err: `noun "${it.n}" not in words.js` };
  if (!w.g) return { err: `noun "${it.n}" has no gender` };
  const pl = isPl(it, w);
  const nxt = wordAfterGap(it.q);
  const vow = startsVowel(nxt || w.fr);
  const gs = genders(w);
  const out = [];
  const t = it.t;
  const lq = it.q.toLowerCase();
  if (lq.indexOf(String(w.fr).toLowerCase()) === -1 && lq.indexOf(String(w.pl || '').toLowerCase()) === -1 && !(it.t === 'adj'))
    return { err: `q does not contain the noun "${it.n}"` };
  if (t === 'art') {
    const def = ['le', 'la', "l'", 'les'].indexOf(String(it.a).toLowerCase()) !== -1;
    const ind = ['un', 'une', 'des'].indexOf(String(it.a).toLowerCase()) !== -1;
    if (!def && !ind) return { err: `art answer "${it.a}" is not an article` };
    if (pl) out.push(def ? 'les' : 'des');
    else gs.forEach(g => out.push(def ? (vow ? "l'" : g === 'm' ? 'le' : 'la') : (g === 'm' ? 'un' : 'une')));
  } else if (t === 'part') {
    if (pl) out.push('des');
    else gs.forEach(g => out.push(vow ? "de l'" : g === 'm' ? 'du' : 'de la'));
  } else if (t === 'contr') {
    const pr = it.p;
    if (pr !== 'à' && pr !== 'de') return { err: 'contr needs p à or de' };
    if (pl) out.push(pr === 'à' ? 'aux' : 'des');
    else gs.forEach(g => out.push(vow ? pr + " l'" : g === 'm' ? (pr === 'à' ? 'au' : 'du') : pr + ' la'));
  } else if (t === 'dem') {
    if (pl) out.push('ces');
    else gs.forEach(g => out.push(g === 'f' ? 'cette' : vow ? 'cet' : 'ce'));
  } else if (t === 'poss') {
    const fam = { mon: 'mon', ma: 'mon', mes: 'mon', ton: 'ton', ta: 'ton', tes: 'ton', son: 'son', sa: 'son', ses: 'son', notre: 'notre', nos: 'notre', votre: 'votre', vos: 'votre', leur: 'leur', leurs: 'leur' }[String(it.a).toLowerCase()];
    if (!fam) return { err: `poss answer "${it.a}" is not a possessive` };
    if (['mon', 'ton', 'son'].indexOf(fam) !== -1) {
      const s = fam.slice(0, 1);
      if (pl) out.push(s + 'es');
      else gs.forEach(g => out.push(g === 'm' || vow ? fam : s + 'a'));
    } else out.push(pl ? (fam === 'leur' ? 'leurs' : fam === 'notre' ? 'nos' : 'vos') : fam);
  } else if (t === 'adj') {
    const aw = adjective(it.adj);
    if (!aw) return { err: `adjective "${it.adj}" not in words.js` };
    const nn = nextWord(it.q), before = /___/.test(it.q) && !!nn && nn.toLowerCase().replace(/[^a-zàâéèêëîïôùûüœç]/g, '') !== '' ;
    gs.forEach(g => {
      let a;
      if (pl) a = g === 'f' ? aw.fpl : aw.mpl;
      else if (g === 'f') a = aw.fem;
      else a = aw.fr;
      if (!pl && g === 'm' && ELIDE_BEFORE[aw.fr] && before && startsVowel(wordAfterGap(it.q))) a = ELIDE_BEFORE[aw.fr];
      out.push(a);
    });
  } else return { err: 'no rule for ' + t };
  return { a: uniq(out), w, pl, vow };
}

const GENRE_SETS = {
  art: { def: ["le", "la", "l'", "les"], ind: ['un', 'une', 'des'] },
  part: ['du', 'de la', "de l'", 'des'],
  contr: { 'à': ['au', 'aux', 'à la', "à l'"], de: ['du', 'des', 'de la', "de l'"] },
  dem: ['ce', 'cet', 'cette', 'ces'],
  poss: { mon: ['mon', 'ma', 'mes', 'ton'], ton: ['ton', 'ta', 'tes', 'son'], son: ['son', 'sa', 'ses', 'mon'], notre: ['notre', 'nos', 'votre', 'vos'], votre: ['votre', 'vos', 'notre', 'nos'], leur: ['leur', 'leurs', 'son', 'ses'] }
};
function genreOptions(it, a) {
  const w = noun(it.n);
  const la = a.toLowerCase();
  if (it.t === 'art') {
    const def = GENRE_SETS.art.def.indexOf(la) !== -1;
    return [a].concat((def ? GENRE_SETS.art.def : GENRE_SETS.art.ind).filter(x => x !== la));
  }
  if (it.t === 'part') return [a].concat(GENRE_SETS.part.filter(x => x !== la));
  if (it.t === 'contr') return [a].concat(GENRE_SETS.contr[it.p].filter(x => x !== la));
  if (it.t === 'dem') return [a].concat(GENRE_SETS.dem.filter(x => x !== la));
  if (it.t === 'poss') {
    const fam = { mon: 'mon', ma: 'mon', mes: 'mon', ton: 'ton', ta: 'ton', tes: 'ton', son: 'son', sa: 'son', ses: 'son', notre: 'notre', nos: 'notre', votre: 'votre', vos: 'votre', leur: 'leur', leurs: 'leur' }[la];
    let c = GENRE_SETS.poss[fam].slice();
    if (['mon', 'ton', 'son'].indexOf(fam) !== -1) {
      const s0 = fam.slice(0, 1), o0 = { m: 't', t: 's', s: 'm' }[s0];
      c = [fam, s0 + 'a', s0 + 'es', o0 + la.slice(1)];
    }
    return [a].concat(uniq(c).filter(x => x !== la));
  }
  if (it.t === 'adj') {
    const aw = adjective(it.adj);
    let c = [aw.fr, aw.fem, aw.mpl, aw.fpl];
    if (ELIDE_BEFORE[aw.fr]) c.splice(1, 0, ELIDE_BEFORE[aw.fr]);
    c = uniq(c).filter(x => x !== la);
    if (w && !w.pl && !c.length) c = [aw.fr];
    return [a].concat(c);
  }
  return [a];
}

function genreTemplate(it, a, w, pl, vow) {
  const N = cap(it.n), la = a.toLowerCase(), g = w.g === 'mf' ? (/^(le|la|un|une|du|de la|mon|ma|ce|cette|au)/.test(la) && !/^(la|une|de la|ma|cette)$/.test(la) ? 'm' : 'f') : w.g;
  const gw = g === 'm' ? 'masculine' : 'feminine', gf = g === 'm' ? 'masculin' : 'féminin';
  if (it.t === 'art') {
    const def = ['le', 'la', "l'", 'les'].indexOf(la) !== -1;
    if (pl) return { w: `${N} is plural, so ${def ? 'les' : 'des'}.`, wf: `${N} est au pluriel : ${def ? 'les' : 'des'}.` };
    if (la === "l'") return { w: `${N} starts with a vowel sound, so le and la both become l'.`, wf: `${N} commence par une voyelle : l'.` };
    return { w: `${N} is ${gw}, so ${a}.`, wf: `${N} est ${gf} : ${a}.` };
  }
  if (it.t === 'part') {
    if (pl) return { w: `Plural: some is des.`, wf: `Pluriel : des.` };
    if (la === "de l'") return { w: `${N} starts with a vowel sound: de l' for both genders.`, wf: `${N} commence par une voyelle : de l'.` };
    return { w: `${N} is ${gw}: some is ${a}.`, wf: `${N} est ${gf} : ${a}.` };
  }
  if (it.t === 'contr') {
    const pr = it.p;
    if (pl) return { w: `${pr} + les always contracts to ${a}.`, wf: `${pr} + les devient toujours ${a}.` };
    if (la.endsWith("l'")) return { w: `${pr} + l' before a vowel sound: ${a}.`, wf: `${pr} + l' devant une voyelle : ${a}.` };
    if (la === 'au' || la === 'du') return { w: `${pr} + le contracts to ${a}.`, wf: `${pr} + le devient ${a}.` };
    return { w: `${N} is feminine: ${pr} + la does not contract.`, wf: `${N} est féminin : ${pr} + la ne change pas.` };
  }
  if (it.t === 'dem') {
    if (pl) return { w: `Plural: this and that are both ces.`, wf: `Pluriel : ces.` };
    if (la === 'cet') return { w: `Masculine before a vowel sound: ce becomes cet.`, wf: `Masculin devant une voyelle : cet.` };
    if (la === 'cette') return { w: `${N} is feminine, so cette.`, wf: `${N} est féminin : cette.` };
    return { w: `${N} is masculine, so ce.`, wf: `${N} est masculin : ce.` };
  }
  if (it.t === 'poss') {
    if (pl && ['mes', 'tes', 'ses', 'nos', 'vos', 'leurs'].indexOf(la) !== -1) return { w: `Plural noun: ${a}.`, wf: `Nom pluriel : ${a}.` };
    if (['mon', 'ton', 'son'].indexOf(la) !== -1 && g === 'f') return { w: `Feminine noun starting with a vowel: ${a}, not ${la.charAt(0)}a.`, wf: `Féminin devant une voyelle : ${a}.` };
    return { w: `${N} is ${gw}${pl ? ' plural' : ''}, so ${a}.`, wf: `${N} est ${gf} : ${a}.` };
  }
  if (it.t === 'adj') {
    const aw = adjective(it.adj);
    if (ELIDE_BEFORE[aw.fr] && la === ELIDE_BEFORE[aw.fr]) return { w: `Before a masculine vowel sound ${aw.fr} becomes ${a}.`, wf: `${cap(aw.fr)} devient ${a} devant une voyelle.` };
    if (pl) return { w: `Plural ${gw} noun: ${a}.`, wf: `Pluriel ${gf} : ${a}.` };
    if (g === 'f') return { w: `${N} is feminine: ${a} (${aw.fr} + feminine).`, wf: `${N} est féminin : ${a}.` };
    return { w: `${N} is masculine singular: ${a}.`, wf: `${N} est masculin singulier : ${a}.` };
  }
  return { w: 'Gender and number decide the form.', wf: 'Le genre et le nombre décident.' };
}

/* ---- gate -------------------------------------------------------------------------------- */
const JVOW = /^j'\s*(\S)/i;
function elisionBad(it) {
  const all = [it.a].concat(it.o || []);
  if (/(^|[\s(])[jJ]'___/.test(it.q) && all.some(o => !startsVowel(o))) return "j'___ needs every option to start with a vowel or h muet";
  for (const o of all) { const m = JVOW.exec(o); if (m && !startsVowel(o.slice(2).trim())) return `option "${o}": j' before a consonant`; }
  return null;
}
/* gate(item) -> null when the item passes, else the reason. */
function gate(it) {
  if (!TOPICS[it.k]) return 'kind ' + it.k;
  if (TOPICS[it.k].indexOf(it.t) === -1) return `topic ${it.t} not valid for ${it.k}`;
  if (BANDS.indexOf(it.b) === -1) return 'band ' + it.b;
  if (typeof it.q !== 'string' || (it.q.match(/___/g) || []).length !== 1) return 'q needs exactly one ___';
  if (!it.e) return 'no English';
  if (!it.w) return 'no w';
  if (it.w.length > 110) return 'w over 110 chars';
  for (const f of ['q', 'e', 'w', 'wf', 'a']) if (it[f] && dash(it[f])) return 'dash in ' + f;
  for (const f of ['o', 'x']) if (it[f] && it[f].some(dash)) return 'dash in ' + f;
  const n = toks(it.q.replace(/\([^)]*\)/g, '')).length;
  if (n < 3 || n > 14) return `q is ${n} words`;
  if (!Array.isArray(it.o) || it.o.length < 2 || it.o.length > 4) return 'o needs 2 to 4 options';
  if (uniq(it.o).length !== it.o.length) return 'options not distinct';
  if (typeof it.a !== 'string' || !it.a) return 'no a';
  if (it.o.indexOf(it.a) === -1) return 'a not in o';
  if ((it.x || []).some(z => it.o.indexOf(z) !== -1 && z !== it.a)) return 'an accepted alternative is also a wrong option';
  const eb = elisionBad(it); if (eb) return eb;
  const lc = s => (/^___/.test(it.q) ? low(s) : s);
  if (it.k === 'vb') {
    const v = byV[it.v];
    if (!v) return 'verb ' + it.v + ' not in verbs.js';
    const want = vbAnswer(it);
    if (!want) return 'FR.form gives nothing';
    if (lc(it.a) !== want) return `a "${it.a}" but FR.form gives "${want}"`;
    const real = realForms(it);
    const bad = it.o.filter(o => real.indexOf(lc(o)) === -1);
    if (bad.length) return 'option(s) not real forms: ' + bad.join(', ');
  }
  if (it.k === 'genre') {
    if (!noun(it.n)) return `noun "${it.n}" not in words.js`;
    if (it.t === 'adj' && !adjective(it.adj)) return `adjective "${it.adj}" not in words.js`;
    const r = genreAnswers(it);
    if (r.err) return r.err;
    if (r.a.indexOf(lc(it.a)) === -1) return `a "${it.a}" but words.js gives "${r.a.join('/')}"`;
  }
  return null;
}

const FALLBACK = {};
module.exports = { FR, VERBS, WORDS, byV, byW, noun, adjective, TOPICS, BANDS, dash, toks, uniq, cap, low, startsVowel, formsOf, realForms,
  vbOpts, vbAnswer, vbAlt, vbTemplate, genreAnswers, genreOptions, genreTemplate, PN, FALLBACK, gate, isPl };
