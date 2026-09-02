#!/usr/bin/env node
/* ============================================================================
 * build-vocab.js — derive the vocabulary skeleton from the Plan Curricular.
 *
 *   node tools/harvest/build-vocab.js        -> spec/vocab-queue.json
 *
 * The app's 395 hand-authored words cover about a fifth of the A1-B1 lexical
 * floor and almost none of B2/C1. The PCIC's "nociones específicas" inventory
 * supplies ~4,700 headwords and ~3,200 collocations, already sorted into 20
 * themes and levelled A1-C2 — so the Spanish side of the vocabulary is
 * DERIVED, not authored. Only the English gloss needs writing, and that is
 * what the queue this produces is for.
 *
 * GENDER is derived two ways, best evidence first:
 *   1. the PCIC itself often writes the article — "el bolso", "la costumbre"
 *   2. otherwise by ending, which in Spanish is highly regular
 * Each entry records which, so a reviewer can look at the guesses and ignore
 * the certainties. Getting gender into the dataset matters because the app
 * teaches nouns with their article ("Nouns include their article so gender is
 * learned with the word" — data/vocab.js).
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const LEX = require('./lexis.js');
const spec = require(path.join(ROOT, 'spec', 'pcic.json'));

global.window = {};
['data/taxonomy.js', 'data/vocab.js', 'data/verbs.js']
  .forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const T = window.TAXONOMY;
const haveVocab = new Set((window.VOCAB || []).map(v =>
  v.es.toLowerCase().replace(/^(el|la|los|las|un|una)\s+/, '')));
const haveVerbs = new Set((window.VERBS || []).map(v => v.inf));

/* ---- gender ------------------------------------------------------------- */
const FEM_ENDINGS = [/ción$/, /sión$/, /zón$/, /dad$/, /tad$/, /tud$/, /umbre$/,
  /ez$/, /eza$/, /icie$/, /itis$/, /sis$/, /ncia$/, /anza$/, /ura$/];
const MASC_ENDINGS = [/aje$/, /or$/, /ambre$/, /án$/, /ón$/, /ismo$/, /miento$/, /ado$/];
// Greek -ma nouns and the classic -o/-a exceptions
const MASC_MA = new Set(['problema', 'sistema', 'tema', 'programa', 'idioma', 'clima',
  'planeta', 'día', 'mapa', 'sofá', 'drama', 'poema', 'esquema', 'síntoma', 'diploma',
  'panorama', 'dilema', 'teorema', 'aroma', 'trauma', 'lema']);
const FEM_O = new Set(['mano', 'foto', 'moto', 'radio', 'libido']);

function genderOf(word, articleEvidence) {
  if (articleEvidence) return { g: articleEvidence, why: 'article in the PCIC' };
  const w = word.toLowerCase();
  if (w.indexOf(' ') !== -1) return { g: null, why: 'phrase' };
  if (MASC_MA.has(w)) return { g: 'm', why: 'Greek -ma / lexical exception' };
  if (FEM_O.has(w)) return { g: 'f', why: 'lexical exception' };
  for (const re of FEM_ENDINGS) if (re.test(w)) return { g: 'f', why: 'ending ' + re.source };
  for (const re of MASC_ENDINGS) if (re.test(w)) return { g: 'm', why: 'ending ' + re.source };
  if (/o$/.test(w)) return { g: 'm', why: 'ends -o' };
  if (/a$/.test(w)) return { g: 'f', why: 'ends -a' };
  if (/ista$/.test(w)) return { g: 'c', why: '-ista, common gender' };
  return { g: null, why: 'unclear — needs a human or a dictionary' };
}

/* Gender evidence mined from the WHOLE corpus, not just the entry itself.
 * The PCIC lists most nouns bare ("abogado, médico, profesor"), but its 11,834
 * example sentences and its collocation tails ("tener ~ una tienda/un negocio")
 * are full of article+noun pairs. Harvesting those gives observed gender for
 * thousands of words — real evidence rather than a guess from the ending. */
const GENDER_EVIDENCE = (function () {
  const tally = new Map();                       // word -> {m, f}
  const RE = /\b(el|la|los|las|un|una|unos|unas)\s+([a-záéíóúñü]{3,})\b/gi;
  const bump = (w, g) => {
    const t = tally.get(w) || { m: 0, f: 0 };
    t[g]++; tally.set(w, t);
  };
  spec.forEach(i => {
    const texts = [i.pattern].concat(i.examples || []);
    texts.forEach(t => {
      let m;
      const re = new RegExp(RE.source, 'gi');
      while ((m = re.exec(String(t)))) {
        const art = m[1].toLowerCase(), noun = m[2].toLowerCase();
        const plural = /^(los|las|unos|unas)$/.test(art);
        const g = /^(el|los|un|unos)$/.test(art) ? 'm' : 'f';
        // "el agua" is feminine despite the article — skip a-initial stressed nouns
        if (g === 'm' && !plural && /^[aá]/.test(noun)) continue;
        bump(plural ? noun.replace(/e?s$/, '') : noun, g);
      }
    });
  });
  return tally;
})();

function articleFor(pattern, word) {
  const t = GENDER_EVIDENCE.get(word.toLowerCase());
  if (!t) return null;
  if (t.m >= 2 && t.f === 0) return 'm';
  if (t.f >= 2 && t.m === 0) return 'f';
  if (t.m > 0 && t.f === 0) return 'm';
  if (t.f > 0 && t.m === 0) return 'f';
  return null;                                   // observed both ways: ambiguous
}

/* ---- part of speech ------------------------------------------------------
 * Gender is only a question for nouns. Asking it of "inteligente", "crecer" or
 * "código postal" produced a meaningless 50% "undetermined" rate, which hid the
 * real finding: the inventory's headword lists contain VERBS the dataset still
 * lacks (nacer, crecer, doler, divorciarse). Classify first, then ask the right
 * question of each class — and route the verbs to their own queue.
 *
 * Evidence beats morphology: a word observed with an article somewhere in the
 * corpus is a noun, whatever it looks like. */
const ADJ_ENDINGS = [/oso$/, /osa$/, /able$/, /ible$/, /ivo$/, /iva$/, /ante$/,
  /iente$/, /ico$/, /ica$/, /í$/, /án$/, /ario$/, /aria$/, /il$/];
function posOf(word, hasArticleEvidence) {
  const w = word.toLowerCase();
  if (w.indexOf(' ') !== -1) {
    return /^(ser|estar|tener|hacer|dar|ir|poner|echar|llevar|pasar|coger|dejar)\b/.test(w)
      ? 'verb-phrase' : 'phrase';
  }
  if (/(arse|erse|irse)$/.test(w)) return 'verb';
  if (hasArticleEvidence) return 'noun';
  if (haveVerbs.has(w)) return 'verb';
  if (/(ar|er|ir)$/.test(w) && !/[aeiou]{2}r$/.test(w)) return 'verb';
  for (const re of ADJ_ENDINGS) if (re.test(w)) return 'adjective';
  return 'noun';
}

/* ---- build --------------------------------------------------------------- */
const entries = new Map();                      // word -> entry
let collocationCount = 0;

spec.filter(i => i.inventory === 'nociones_especificas').forEach(i => {
  const theme = T.themeByPcicSection(i.section || '');
  if (!theme) return;
  const cefr = i.level;
  if (['A1', 'A2', 'B1', 'B2', 'C1'].indexOf(cefr) < 0) return;

  // "Lugares de trabajo", "Herramientas de un auxiliar administrativo" are
  // sub-headings the inventory prints above its word lists, not words to learn.
  // A real entry is a lowercase list; a heading is capitalised, comma-free prose.
  const pat = String(i.pattern).trim();
  if (/^[A-ZÁÉÍÓÚÑ]/.test(pat) && pat.indexOf(',') === -1 && pat.split(/\s+/).length >= 2
      && !/[~/]/.test(pat) && !/^(Internet|España|Europa|América)/.test(pat)) return;

  LEX.headwords(i.pattern).forEach(w => {
    if (haveVerbs.has(w)) return;               // verbs live in data/verbs.js
    const prev = entries.get(w);
    // keep the LOWEST level a word appears at — that is when it is first taught
    if (prev && ['A1', 'A2', 'B1', 'B2', 'C1'].indexOf(prev.cefr) <= ['A1', 'A2', 'B1', 'B2', 'C1'].indexOf(cefr)) {
      if (prev.themes.indexOf(theme.id) < 0) prev.themes.push(theme.id);
      return;
    }
    const evid = articleFor(i.pattern, w);
    const pos = posOf(w, !!evid);
    const g = pos === 'noun' ? genderOf(w, evid) : { g: null, why: 'not a noun' };
    entries.set(w, {
      es: w, en: null, pos, cat: theme.id, cefr, theme: theme.id, themes: prev ? prev.themes : [theme.id],
      gender: g.g, genderWhy: g.why, pcic: [i.id],
      known: haveVocab.has(w), collocations: []
    });
  });

  LEX.collocations(i.pattern).forEach(c => {
    const head = LEX.headwords(i.pattern)[0];
    const e = entries.get(head);
    if (e && e.collocations.indexOf(c) < 0 && e.collocations.length < 8) { e.collocations.push(c); collocationCount++; }
  });
});

const all = [...entries.values()];
const todo = all.filter(e => !e.known);
// verbs belong in data/verbs.js, where the engine can conjugate them
const verbTodo = todo.filter(e => e.pos === 'verb');
const lexTodo = todo.filter(e => e.pos !== 'verb');
fs.writeFileSync(path.join(ROOT, 'spec', 'verb-queue.json'), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  note: 'Verbs the PCIC teaches that data/verbs.js lacks. Each needs { inf, en, type } plus `stem` for a stem-changer or `like` for a prefixed compound.',
  count: verbTodo.length,
  verbs: verbTodo.map(e => ({ inf: e.es, cefr: e.cefr, theme: e.theme, pcic: e.pcic }))
}, null, 1));
fs.writeFileSync(path.join(ROOT, 'spec', 'vocab-queue.json'), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  note: 'Spanish side derived from the PCIC. `en` is null and must be authored; everything else is settled.',
  total: all.length, alreadyInApp: all.length - todo.length, toWrite: lexTodo.length,
  entries: lexTodo
}, null, 1));

/* ---- report -------------------------------------------------------------- */
const byPos = {};
todo.forEach(e => { byPos[e.pos] = (byPos[e.pos] || 0) + 1; });
console.log('by part of speech: ' + Object.keys(byPos).sort((a, b) => byPos[b] - byPos[a])
  .map(k => k + ' ' + byPos[k]).join('   '));
console.log('  -> ' + verbTodo.length + ' verbs written to spec/verb-queue.json (they need conjugating, not glossing)\n');

const nouns = lexTodo.filter(e => e.pos === 'noun');
const evid = nouns.filter(e => e.genderWhy === 'article in the PCIC').length;
const byTheme = {}, byLevel = {}, byGender = { m: 0, f: 0, c: 0, unknown: 0 };
lexTodo.forEach(e => {
  byTheme[e.cat] = (byTheme[e.cat] || 0) + 1;
  byLevel[e.cefr] = (byLevel[e.cefr] || 0) + 1;
  byGender[e.gender || 'unknown']++;
});
console.log(`derived ${all.length} headwords (${all.length - todo.length} already in the app), ` +
            `${collocationCount} collocations\n`);
console.log('by level:   ' + ['A1', 'A2', 'B1', 'B2', 'C1'].map(l => l + ' ' + (byLevel[l] || 0)).join('   '));
console.log('nouns:      ' + nouns.length + '   gender resolved for ' +
            (byGender.m + byGender.f) + ' (' +
            Math.round(100 * (byGender.m + byGender.f) / Math.max(1, nouns.length)) + '%)');
console.log('            of those, ' + evid + ' from an article the PCIC itself wrote\n');
console.log('by theme:');
Object.keys(byTheme).sort((a, b) => byTheme[b] - byTheme[a]).forEach(t =>
  console.log('   ' + String(byTheme[t]).padStart(5) + '  ' + t));
console.log('\n→ spec/vocab-queue.json');
