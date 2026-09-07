/* ============================================================================
 * DATA ENGINE
 * Conjugates verbs from endings tables (regular) merged with stored irregular
 * forms, derives the tenses that follow exceptionless rules, and turns a
 * content selection into a flat list of quiz/flashcard cards.
 *
 * Person order for simple/compound tenses:
 *   [ yo, tú, él/ella, nosotros, vosotros, ellos/ellas ]
 * Imperative uses its own persons (no "yo").
 * ========================================================================== */
window.ENGINE = (function () {
  'use strict';

  var PERSONS = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos'];
  var IMP_PERSONS = ['tú', 'usted', 'nosotros', 'vosotros', 'ustedes'];

  // Ordered tense list used by the UI, grammar docs, and card generation.
  var TENSES = [
    { key: 'presente',    label: 'Presente',                     group: 'indicative' },
    { key: 'preterito',   label: 'Pretérito',                    group: 'indicative' },
    { key: 'imperfecto',  label: 'Imperfecto',                   group: 'indicative' },
    { key: 'futuro',      label: 'Futuro',                       group: 'indicative' },
    { key: 'condicional', label: 'Condicional',                  group: 'indicative' },
    { key: 'perfecto',    label: 'Presente perfecto',            group: 'compound' },
    { key: 'plusc',       label: 'Pluscuamperfecto',             group: 'compound' },
    { key: 'futperf',     label: 'Futuro perfecto',              group: 'compound' },
    { key: 'condperf',    label: 'Condicional perfecto',         group: 'compound' },
    { key: 'presubj',     label: 'Presente de subjuntivo',       group: 'subjunctive' },
    { key: 'impsubj',     label: 'Imperfecto de subjuntivo',     group: 'subjunctive' },
    { key: 'perfsubj',    label: 'Pretérito perfecto de subj.',  group: 'subjunctive' },
    { key: 'imperativo',  label: 'Imperativo (afirmativo)',      group: 'imperative' },
    { key: 'impneg',      label: 'Imperativo (negativo)',        group: 'imperative' }
  ];
  var TENSE_LABEL = {};
  TENSES.forEach(function (t) { TENSE_LABEL[t.key] = t.label; });

  // Regular endings.  Simple tenses attach to the stem (infinitive minus 2);
  // futuro/condicional attach to the whole infinitive.
  var END = {
    presente:    { ar:['o','as','a','amos','áis','an'],
                   er:['o','es','e','emos','éis','en'],
                   ir:['o','es','e','imos','ís','en'] },
    preterito:   { ar:['é','aste','ó','amos','asteis','aron'],
                   er:['í','iste','ió','imos','isteis','ieron'],
                   ir:['í','iste','ió','imos','isteis','ieron'] },
    imperfecto:  { ar:['aba','abas','aba','ábamos','abais','aban'],
                   er:['ía','ías','ía','íamos','íais','ían'],
                   ir:['ía','ías','ía','íamos','íais','ían'] },
    futuro:      { all:['é','ás','á','emos','éis','án'] },
    condicional: { all:['ía','ías','ía','íamos','íais','ían'] },
    presubj:     { ar:['e','es','e','emos','éis','en'],
                   er:['a','as','a','amos','áis','an'],
                   ir:['a','as','a','amos','áis','an'] }
  };

  // Auxiliary "haber" for compound tenses (person-aligned).
  var HABER = {
    perfecto: ['he','has','ha','hemos','habéis','han'],
    plusc:    ['había','habías','había','habíamos','habíais','habían'],
    futperf:  ['habré','habrás','habrá','habremos','habréis','habrán'],
    condperf: ['habría','habrías','habría','habríamos','habríais','habrían'],
    perfsubj: ['haya','hayas','haya','hayamos','hayáis','hayan']
  };

  function deaccent(s) {
    return s.replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i')
            .replace(/ó/g,'o').replace(/ú/g,'u');
  }
  function stemOf(inf)  { return inf.slice(0, -2); }
  function vowelOf(inf) {                                 // 'ar' | 'er' | 'ir'
    var e = inf.slice(-2);
    if (e === 'ír') return 'ir';                          // oír, reír
    return e;
  }

  function accentLastVowel(s) {
    var map = { a:'á', e:'é', i:'í', o:'ó', u:'ú' };
    for (var i = s.length - 1; i >= 0; i--) {
      if (map[s[i]]) return s.slice(0, i) + map[s[i]] + s.slice(i + 1);
    }
    return s;
  }

  function participle(v) {
    if (/(arse|erse|irse)$/.test(v.inf)) return participle({ inf: v.inf.slice(0, -2), part: v.part });
    if (v.part) return v.part;
    if (v.like && v.inf.slice(-v.like.length) === v.like) { var lb = verbByInf(v.like); if (lb) return prefixForms(v.inf, v.like, [participle(lb)])[0]; }
    var pvt = vowelOf(v.inf), pstem = stemOf(v.inf);
    if (pvt === 'ar') return pstem + 'ado';
    // a/e/o-final stems accent the i: leído, caído, oído (but incluido, construido)
    if (/[aeo]$/.test(pstem)) return pstem + 'ído';
    return pstem + 'ido';
  }

  function gerund(v) {
    if (/(arse|erse|irse)$/.test(v.inf)) return gerund({ inf: v.inf.slice(0, -2), ger: v.ger });
    if (v.ger) return v.ger;
    if (v.like && v.inf.slice(-v.like.length) === v.like) { var gb = verbByInf(v.like); if (gb) return prefixForms(v.inf, v.like, [gerund(gb)])[0]; }
    var gvt = vowelOf(v.inf), gstem = stemOf(v.inf);
    if (gvt === 'ar') return gstem + 'ando';
    // -ir stem-changers take their weaker vowel: sentir>sintiendo, dormir>durmiendo
    if (gvt === 'ir' && v.stem && SECONDARY[v.stem]) gstem = changeLastVowel(gstem, SECONDARY[v.stem]);
    // a vowel-final stem turns the i to y: leyendo, incluyendo, cayendo
    if (isVowel(gstem.charAt(gstem.length - 1)) && !/[gq]u$/.test(gstem)) return gstem + 'yendo';
    return gstem + 'iendo';
  }

  /* ==========================================================================
   * MORPHOLOGY — the systematic patterns of Spanish conjugation.
   *
   * Previously `regular()` was stem + ending with no adjustment, so EVERY
   * verb that deviates in a predictable way had to carry hand-typed `forms`.
   * That is unmaintainable at the scale of a full A1-C1 course, and it fails
   * silently: a -zar verb added without `forms` yields "actualizé" and the
   * engine — being the authority the validators trust — reports no error.
   *
   * These patterns are RULES, not irregularities. Encoding them here means a
   * new verb usually needs only { inf, en, type } plus, for a stem-changer,
   * one `stem` field. Genuinely irregular verbs (ser, ir, tener…) keep their
   * explicit `forms`, which always win: see conjugateBase().
   *
   * Covered:
   *   orthographic  buscar>busqué  llegar>llegué  realizar>realicé
   *                 averiguar>averigüé  vencer>venzo  coger>cojo  seguir>sigo
   *   inchoative    conocer>conozco  conducir>conduzco   (vowel + cer/cir)
   *   -uir          incluir>incluyo, incluyó, incluyendo
   *   vowel stems   leer>leyó/leíste/leído/leyendo   caer, oír
   *   stem changes  e>ie (pensar) · o>ue (contar) · e>i (pedir) · u>ue (jugar)
   *                 with the -ir verbs' second change in the subjunctive
   *                 nosotros/vosotros, 3rd-person preterite and gerund
   *                 (sentir>sintamos/sintió/sintiendo, dormir>durmió)
   * ======================================================================== */

  var VOWELS = 'aeiouáéíóú';
  function isVowel(c) { return VOWELS.indexOf(c) >= 0; }

  // Replace the LAST vowel of a stem — where every Spanish stem change lands.
  // The u of a "gu"/"qu" digraph is a spelling device, not a vowel, and must be
  // skipped: seguir's stem change is e>i giving "sigu-" (hence sigo, siguió),
  // never "segi-".
  function changeLastVowel(stem, target) {
    for (var i = stem.length - 1; i >= 0; i--) {
      if (!isVowel(stem[i])) continue;
      if (stem[i] === 'u' && i > 0 && (stem[i - 1] === 'g' || stem[i - 1] === 'q')) continue;
      return stem.slice(0, i) + target + stem.slice(i + 1);
    }
    return stem;
  }

  // -ir stem-changers make a second, weaker change where the first cannot apply.
  // 'í' and 'ú' are the -iar/-uar accent classes (enviar>envío, continuar>continúo):
  // the stem vowel takes a written accent in the boot rather than diphthongising,
  // so their "secondary" is themselves. Those verbs are all -ar, so the -ir
  // secondary path below never applies to them.
  var SECONDARY = { ie: 'i', ue: 'u', i: 'i', 'í': 'í', 'ú': 'ú' };

  // Which persons take the stem change: the "boot" — yo, tú, él, ellos.
  function inBoot(idx) { return idx === 0 || idx === 1 || idx === 2 || idx === 5; }

  function stemFor(v, base, tenseKey, idx, vt) {
    var sc = v.stem;
    if (!sc || !SECONDARY[sc]) return base;
    var second = SECONDARY[sc];
    if (tenseKey === 'presente') return inBoot(idx) ? changeLastVowel(base, sc) : base;
    if (tenseKey === 'presubj') {
      if (inBoot(idx)) return changeLastVowel(base, sc);
      // -ir verbs also change in nosotros/vosotros, to the weaker vowel
      return vt === 'ir' ? changeLastVowel(base, second) : base;
    }
    // -ir verbs only: 3rd person preterite (pidió, durmieron)
    if (tenseKey === 'preterito' && vt === 'ir' && (idx === 2 || idx === 5)) {
      return changeLastVowel(base, second);
    }
    return base;
  }

  /* Prefixing a base verb's forms. The one wrinkle is stress: a monosyllabic
   * form ending in a vowel, n or s (ten, pon, ven, vi, ves) becomes the final
   * stressed syllable of a longer word and must take a written accent —
   * ten > mantén, pon > propón, vi > preví. */
  function prefixForms(inf, likeInf, forms) {
    var pre = inf.slice(0, inf.length - likeInf.length);
    if (!pre) return forms.slice();
    return forms.map(function (f) {
      if (!f) return f;
      return f.split(' ').map(function (word, i) {
        if (i > 0) return word;                              // "he comido" -> prefix the first only
        // Monosyllable? One vowel, or a vowel pair that is a diphthong (which
        // needs a weak i/u). "vio" is one syllable and takes the accent when
        // prefixed (previó); "veo" is a hiatus, two syllables, and does not.
        var vg = word.match(/[aeiou]+/g) || [];
        var mono = word.length <= 3 && !/[áéíóú]/.test(word) &&
                   (isVowel(word.charAt(word.length - 1)) || /[ns]$/.test(word)) &&
                   vg.length === 1 && (vg[0].length === 1 || /[iu]/.test(vg[0]));
        return pre + (mono ? accentLastVowel(word) : word);
      }).join(' ');
    });
  }

  function likeTuCmd(v) {
    if (!v.like) return null;
    var b = verbByInf(v.like);
    if (!b || !b.tuCmd) return null;
    return prefixForms(v.inf, v.like, [b.tuCmd])[0];
  }

  var ZC_RE = /[aeiou]c(er|ir)$/;          // conocer, parecer, conducir -> -zc-
  var UIR_RE = /[^gq]uir$/;                // incluir, construir (not seguir/delinquir)

  /* Join stem and ending, applying the sound-preserving spelling changes.
   * Returns the finished form. */
  function joinForm(stem, ending, inf, vt) {
    var e0 = ending.charAt(0);
    var front = (e0 === 'e' || e0 === 'é' || e0 === 'i' || e0 === 'í');
    var back = (e0 === 'a' || e0 === 'á' || e0 === 'o' || e0 === 'ó');

    if (vt === 'ar') {
      // -ar verbs adjust before a FRONT vowel (preterite yo, all of the subjunctive)
      if (front) {
        if (/gu$/.test(stem)) return stem.slice(0, -2) + 'gü' + ending;   // averiguar
        if (/c$/.test(stem))  return stem.slice(0, -1) + 'qu' + ending;   // buscar
        if (/g$/.test(stem))  return stem + 'u' + ending;                 // llegar
        if (/z$/.test(stem))  return stem.slice(0, -1) + 'c' + ending;    // realizar
      }
    } else {
      // -er/-ir verbs adjust before a BACK vowel (present yo, all of the subjunctive)
      if (back) {
        if (ZC_RE.test(inf) && /c$/.test(stem)) return stem.slice(0, -1) + 'zc' + ending;
        if (/qu$/.test(stem)) return stem.slice(0, -2) + 'c' + ending;    // delinquir
        if (/gu$/.test(stem)) return stem.slice(0, -1) + ending;          // seguir -> sigo
        if (/g$/.test(stem))  return stem.slice(0, -1) + 'j' + ending;    // coger -> cojo
        if (/c$/.test(stem))  return stem.slice(0, -1) + 'z' + ending;    // vencer -> venzo
      }
      // stems ending in a vowel: the unstressed i of an ending becomes y
      // (leyó, incluyeron) and otherwise takes an accent (leíste, oímos)
      if (isVowel(stem.charAt(stem.length - 1)) && !/[gq]u$/.test(stem)) {
        if (ending === 'ió') return stem + 'yó';
        if (ending === 'ieron') return stem + 'yeron';
        if (UIR_RE.test(inf) && (back || e0 === 'e')) return stem + 'y' + ending;
        // a/e/o-final stems accent the i; u-final ones do not (incluiste)
        if (/[aeo]$/.test(stem) && e0 === 'i') return stem + 'í' + ending.slice(1);
      }
    }
    return stem + ending;
  }

  function regular(v, tenseKey) {
    var vt = vowelOf(v.inf);
    if (tenseKey === 'futuro' || tenseKey === 'condicional') {
      var fbase = deaccent(v.inf);   // oír→oir (oiré, not oíré)
      return END[tenseKey].all.map(function (e) { return fbase + e; });
    }
    var base = stemOf(v.inf);
    return END[tenseKey][vt].map(function (e, idx) {
      return joinForm(stemFor(v, base, tenseKey, idx, vt), e, v.inf, vt);
    });
  }

  // Returns an array of conjugated forms for the given tense, for a verb
  // whose OWN infinitive is what's conjugated directly (never called with a
  // reflexive "-se" infinitive — see conjugate() below, which resolves that
  // before delegating here).
  function conjugateBase(v, tenseKey) {
    // Compound tenses: haber + past participle (fully rule-based).
    if (HABER[tenseKey]) {
      var p = participle(v);
      return HABER[tenseKey].map(function (h) { return h + ' ' + p; });
    }

    // Imperfect subjunctive: derived from 3rd-person-plural preterite.
    if (tenseKey === 'impsubj') {
      var base = conjugateBase(v, 'preterito')[5].replace(/ron$/, '');
      return [
        base + 'ra',
        base + 'ras',
        base + 'ra',
        accentLastVowel(base) + 'ramos',
        base + 'rais',
        base + 'ran'
      ];
    }

    // Affirmative imperative (own person set).
    if (tenseKey === 'imperativo') {
      var pres = conjugateBase(v, 'presente');
      var subj = conjugateBase(v, 'presubj');
      return [
        v.tuCmd || likeTuCmd(v) || pres[2],   // tú
        subj[2],                         // usted
        subj[3],                         // nosotros
        v.inf.slice(0, -1) + 'd',        // vosotros
        subj[5]                          // ustedes
      ];
    }

    // Negative imperative: entirely subjunctive-based, including tú — the
    // one person that has its own special form in the affirmative
    // (¡Habla! vs ¡No hables!). Every other person is already subjunctive-
    // shaped in the affirmative too, so only tú actually changes form.
    if (tenseKey === 'impneg') {
      var nsubj = conjugateBase(v, 'presubj');
      return [
        'no ' + nsubj[1],   // tú
        'no ' + nsubj[2],   // usted
        'no ' + nsubj[3],   // nosotros
        'no ' + nsubj[4],   // vosotros
        'no ' + nsubj[5]    // ustedes
      ];
    }

    // Simple tenses: use stored irregular forms when present, else regular.
    if (v.forms && v.forms[tenseKey]) return v.forms[tenseKey].slice();
    // A prefixed compound of an irregular verb (mantener < tener, proponer <
    // poner, atraer < traer) inflects exactly like its base. Deriving that
    // beats re-typing the paradigm for each of the dozens of such verbs.
    // `like` is prefixing, so it only holds when the infinitive literally ends
    // with its base: mantener < tener, proponer < poner. "reducir" is NOT
    // "conducir" with a prefix — those share a Latin root, not a paradigm — so
    // guard it rather than silently producing "reduciconduje".
    if (v.like && v.inf.length > v.like.length && v.inf.slice(-v.like.length) === v.like) {
      var baseV = verbByInf(v.like);
      if (baseV) return prefixForms(v.inf, v.like, conjugateBase(baseV, tenseKey));
    }
    return regular(v, tenseKey);
  }

  // ---- reflexive verbs (levantarse, sentarse, irse…) -----------------------
  // Stored in verbs.js with their "-se" infinitive; conjugated exactly like
  // the base verb (levantar) with the reflexive pronoun added — never a
  // separate, hand-typed set of forms.
  function isReflexivo(inf) { return /(arse|erse|irse)$/.test(inf); }
  function reflexiveBase(inf) { return inf.slice(0, -2); }

  var REFLEX_PRON = ['me', 'te', 'se', 'nos', 'os', 'se'];       // aligned with PERSONS
  var STRONG_V = 'aeoáéó', WEAK_V = 'iuíú', ALL_V = 'aeiouáéíóúü';
  var ACCENT_MAP = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };

  // Adds a written accent to the vowel in the penultimate syllable-nucleus of
  // an unaccented word, to preserve its stress once an enclitic pronoun is
  // attached — the word is now stressed on the antepenultimate syllable,
  // which in Spanish always takes a written accent (levanta+te -> levántate,
  // siente+te -> siéntate). Only used for affirmative-imperative reflexives.
  function addStressAccent(word) {
    var nuclei = [], i = 0;
    while (i < word.length) {
      if (ALL_V.indexOf(word[i].toLowerCase()) !== -1) {
        var start = i;
        while (i < word.length && ALL_V.indexOf(word[i].toLowerCase()) !== -1) i++;
        nuclei.push([start, i]);
      } else i++;
    }
    if (nuclei.length < 2) return word;
    var target = nuclei[nuclei.length - 2];
    var chunk = word.slice(target[0], target[1]);
    var idxInChunk = 0;
    if (chunk.length === 2) {
      var c0 = chunk[0].toLowerCase(), c1 = chunk[1].toLowerCase();
      if (STRONG_V.indexOf(c0) !== -1 && WEAK_V.indexOf(c1) !== -1) idxInChunk = 0;
      else if (WEAK_V.indexOf(c0) !== -1 && STRONG_V.indexOf(c1) !== -1) idxInChunk = 1;
      else idxInChunk = chunk.length - 1;
    }
    var pos = target[0] + idxInChunk;
    var accented = ACCENT_MAP[word[pos].toLowerCase()] || word[pos];
    return word.slice(0, pos) + accented + word.slice(pos + 1);
  }

  // Applies the reflexive pronoun to already-conjugated base forms.
  function reflexivize(forms, tenseKey, baseInf) {
    if (tenseKey === 'imperativo') {
      return forms.map(function (f, i) {
        if (!f) return f;
        if (i === 2) return addStressAccent(f.slice(0, -1)) + 'nos';   // nosotros: -mos -> -mo + nos
        if (i === 3) {                                                  // vosotros: drop -d, + os
          var stem = f.slice(0, -1);
          return (vowelOf(baseInf) === 'ir' ? accentLastVowel(stem) : stem) + 'os';
        }
        return addStressAccent(f) + (i === 0 ? 'te' : 'se');            // tú / usted / ustedes
      });
    }
    if (tenseKey === 'impneg') {
      var pron = ['te', 'se', 'nos', 'os', 'se'];
      return forms.map(function (f, i) { return f ? f.replace(/^no /, 'no ' + pron[i] + ' ') : f; });
    }
    // every other tense: the pronoun word goes before the (possibly two-word,
    // compound) form — PERSONS-aligned, same order as REFLEX_PRON.
    return forms.map(function (f, i) { return f ? REFLEX_PRON[i] + ' ' + f : f; });
  }

  // Returns an array of conjugated forms for the given tense.
  function conjugate(v, tenseKey) {
    if (isReflexivo(v.inf)) {
      var baseInf = reflexiveBase(v.inf);
      var baseV = { inf: baseInf, forms: v.forms, part: v.part, ger: v.ger, tuCmd: v.tuCmd, en: v.en, stem: v.stem, like: v.like };
      return reflexivize(conjugateBase(baseV, tenseKey), tenseKey, baseInf);
    }
    return conjugateBase(v, tenseKey);
  }

  function personsFor(tenseKey) {
    return (tenseKey === 'imperativo' || tenseKey === 'impneg') ? IMP_PERSONS : PERSONS;
  }

  function isIrregular(v) {
    return !!(v.forms || v.part || v.ger || v.tuCmd);
  }

  // ---- normalization for STRICT answer checking --------------------------
  // Strict = accents required. We only trim, lowercase, and collapse spaces.
  function normalize(s) {
    return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  // ---- card generation ----------------------------------------------------
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // Resolve a translation pair into {front, back} per the chosen direction.
  function resolveDir(es, en, dir) {
    if (dir === 'es2en') return { front: es, back: en };
    if (dir === 'en2es') return { front: en, back: es };
    // mixed: randomize per card
    return Math.random() < 0.5 ? { front: en, back: es } : { front: es, back: en };
  }

  function transCard(es, en, kind, dir, hint) {
    var d = resolveDir(es, en, dir);
    return { front: d.front, back: d.back, kind: kind, hint: hint || null };
  }

  var MODEL_VERBS = { ar: 'hablar', er: 'comer', ir: 'vivir' };

  // ---- English phrasing for "translate + conjugate" cards -----------------
  // Turns a verb's `en` gloss + a tense/person into a natural English phrase
  // ("he ate"), plus a small disambiguating marker when English collapses a
  // distinction Spanish makes (subjunctive mood; tú/usted/vosotros/ustedes
  // commands all read as bare "you, ...!").
  var EN_SUBJECTS = ['I', 'you', 'he/she', 'we', 'you all', 'they'];
  var EN_IMP_PERSONS = ['tú', 'usted', 'nosotros', 'vosotros', 'ustedes'];

  // base -> [simple past, past participle]. Only entries actually reachable
  // from VERBS' `en` glosses are needed; anything else is formed by the
  // regular -ed/-d/-ied rules below.
  var EN_IRREGULAR = {
    be: ['was', 'been'], have: ['had', 'had'], do: ['did', 'done'],
    go: ['went', 'gone'], say: ['said', 'said'], see: ['saw', 'seen'],
    give: ['gave', 'given'], know: ['knew', 'known'], put: ['put', 'put'],
    come: ['came', 'come'], leave: ['left', 'left'], bring: ['brought', 'brought'],
    fall: ['fell', 'fallen'], hear: ['heard', 'heard'], sleep: ['slept', 'slept'],
    feel: ['felt', 'felt'], read: ['read', 'read'], drive: ['drove', 'driven'],
    think: ['thought', 'thought'], begin: ['began', 'begun'],
    understand: ['understood', 'understood'], lose: ['lost', 'lost'],
    find: ['found', 'found'], show: ['showed', 'shown'], cost: ['cost', 'cost'],
    pay: ['paid', 'paid'], take: ['took', 'taken'], write: ['wrote', 'written'],
    break: ['broke', 'broken'], speak: ['spoke', 'spoken'], buy: ['bought', 'bought'],
    win: ['won', 'won'], sing: ['sang', 'sung'], eat: ['ate', 'eaten'],
    drink: ['drank', 'drunk'], run: ['ran', 'run'], sell: ['sold', 'sold'],
    forget: ['forgot', 'forgotten'], draw: ['drew', 'drawn'], swim: ['swam', 'swum'],
    hide: ['hid', 'hidden'], build: ['built', 'built'],
    // regular verbs whose -ed spelling doubles the final consonant
    prefer: ['preferred', 'preferred'], occur: ['occurred', 'occurred'],
    permit: ['permitted', 'permitted'], admit: ['admitted', 'admitted']
  };

  // "to know (facts)" -> { base: 'know', qualifier: 'facts' }. The qualifier
  // (when present) is kept and re-appended verbatim, since it's often the
  // only thing distinguishing two verbs sharing one English gloss (ser vs.
  // estar both "to be"; saber vs. conocer both "to know").
  function enBaseAndQualifier(en) {
    var qualifier = null, rest = en;
    var m = rest.match(/\(([^)]+)\)/);
    if (m) { qualifier = m[1]; rest = rest.replace(m[0], '').replace(/\s+/g, ' ').trim(); }
    var first = rest.split('/')[0].trim().replace(/^to\s+/, '');
    return { base: first, qualifier: qualifier };
  }

  function splitHead(phrase) {
    var parts = phrase.split(' ');
    return { head: parts[0], rest: parts.slice(1).join(' ') };
  }

  function enPresent3rd(head) {
    if (head === 'have') return 'has';
    if (/[^aeiou]y$/.test(head)) return head.slice(0, -1) + 'ies';
    if (/(sh|ch|[sxzo])$/.test(head)) return head + 'es';
    return head + 's';
  }

  function enPast(head) {
    if (EN_IRREGULAR[head]) return EN_IRREGULAR[head][0];
    if (/[^aeiou]y$/.test(head)) return head.slice(0, -1) + 'ied';
    if (/e$/.test(head)) return head + 'd';
    return head + 'ed';
  }

  function enParticiple(head) {
    if (EN_IRREGULAR[head]) return EN_IRREGULAR[head][1];
    return enPast(head);
  }

  function reattach(conjugatedHead, rest) {
    return rest ? conjugatedHead + ' ' + rest : conjugatedHead;
  }

  // Returns { text, marker } — marker is non-null only when English can't
  // distinguish this form from another Spanish form without more context.
  function enPhrase(v, tenseKey, personIdx) {
    var bq = enBaseAndQualifier(v.en);
    var hr = splitHead(bq.base);
    var head = hr.head, rest = hr.rest;
    var qualifierSuffix = bq.qualifier ? ' (' + bq.qualifier + ')' : '';
    var marker = null, phrase;

    if (tenseKey === 'imperativo') {
      var impPerson = EN_IMP_PERSONS[personIdx];
      if (impPerson === 'nosotros') {
        phrase = "let's " + bq.base + '!';
      } else {
        phrase = reattach(head, rest) + '!';
        marker = impPerson;
      }
      return { text: phrase + qualifierSuffix, marker: marker };
    }
    if (tenseKey === 'impneg') {
      var impNegPerson = EN_IMP_PERSONS[personIdx];
      if (impNegPerson === 'nosotros') {
        phrase = "let's not " + bq.base + '!';
      } else {
        phrase = "don't " + reattach(head, rest) + '!';
        marker = impNegPerson;
      }
      return { text: phrase + qualifierSuffix, marker: marker };
    }

    var subj = EN_SUBJECTS[personIdx];
    function withSubj(verbPhrase) { return subj + ' ' + verbPhrase; }

    if (head === 'be' && tenseKey === 'presente') {
      phrase = withSubj(reattach(['am', 'are', 'is', 'are', 'are', 'are'][personIdx], rest));
    } else if (head === 'be' && (tenseKey === 'preterito' || tenseKey === 'impsubj')) {
      phrase = withSubj(reattach(['was', 'were', 'was', 'were', 'were', 'were'][personIdx], rest));
      if (tenseKey === 'impsubj') marker = 'subjunctive';
    }

    if (!phrase) {
      if (tenseKey === 'presente') {
        var pres = personIdx === 2 ? reattach(enPresent3rd(head), rest) : reattach(head, rest);
        phrase = withSubj(pres);
      } else if (tenseKey === 'preterito') {
        phrase = withSubj(reattach(enPast(head), rest));
      } else if (tenseKey === 'imperfecto') {
        phrase = withSubj('used to ' + reattach(head, rest));
      } else if (tenseKey === 'futuro') {
        phrase = withSubj('will ' + reattach(head, rest));
      } else if (tenseKey === 'condicional') {
        phrase = withSubj('would ' + reattach(head, rest));
      } else if (tenseKey === 'perfecto') {
        phrase = withSubj((personIdx === 2 ? 'has' : 'have') + ' ' + reattach(enParticiple(head), rest));
      } else if (tenseKey === 'plusc') {
        phrase = withSubj('had ' + reattach(enParticiple(head), rest));
      } else if (tenseKey === 'futperf') {
        phrase = withSubj('will have ' + reattach(enParticiple(head), rest));
      } else if (tenseKey === 'condperf') {
        phrase = withSubj('would have ' + reattach(enParticiple(head), rest));
      } else if (tenseKey === 'presubj') {
        phrase = withSubj(reattach(head, rest));   // bare form for every person
        marker = 'subjunctive';
      } else if (tenseKey === 'impsubj') {
        phrase = withSubj(reattach(enPast(head), rest));
        marker = 'subjunctive';
      } else if (tenseKey === 'perfsubj') {
        phrase = withSubj((personIdx === 2 ? 'has' : 'have') + ' ' + reattach(enParticiple(head), rest));
        marker = 'subjunctive';
      }
    }

    return { text: phrase + qualifierSuffix, marker: marker };
  }

  // opts.translateInf: front is a natural English phrase (+ small marker
  // when needed) instead of the Spanish infinitive, so answering also
  // requires translating.
  function conjCards(v, tenses, opts) {
    var useEn = !!(opts && opts.translateInf);
    var cards = [];
    tenses.forEach(function (tk) {
      var forms = conjugate(v, tk);
      var persons = personsFor(tk);
      forms.forEach(function (form, i) {
        var front, marker = null;
        if (useEn) {
          var p = enPhrase(v, tk, i);
          front = p.text; marker = p.marker;
        } else {
          front = v.inf + '  ·  ' + TENSE_LABEL[tk] + '  ·  ' + persons[i];
        }
        cards.push({ front: front, back: form, kind: 'conj', marker: marker, hint: null });
      });
    });
    return cards;
  }

  function verbByInf(inf) {
    for (var i = 0; i < window.VERBS.length; i++) {
      if (window.VERBS[i].inf === inf) return window.VERBS[i];
    }
    return null;
  }

  // Tenses whose regular endings are a clean single form (used by the
  // "verb endings" pattern cards). Compound / imperfect-subj / imperative
  // don't reduce to one ending, so they're excluded.
  var ENDING_TENSES = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'presubj'];

  // Abstract "ending pattern" cards, e.g.  Presente · -ar · tú  →  as
  function endingCards(tenses) {
    var cards = [];
    tenses.forEach(function (tk) {
      var tbl = END[tk];
      if (!tbl) return;
      ['ar', 'er', 'ir'].forEach(function (ty) {
        var arr = tbl.all || tbl[ty];  // futuro/condicional share one set
        arr.forEach(function (e, idx) {
          cards.push({
            front: TENSE_LABEL[tk] + '  ·  -' + ty + '  ·  ' + PERSONS[idx],
            back: e,
            kind: 'ending',
            hint: null
          });
        });
      });
    });
    return cards;
  }

  /*
   * selection = {
   *   vocab, verbs100, idioms            : booleans
   *   regConj, regConjTenses:[keys]      : regular model-verb conjugations
   *   irrConj, irrConjTenses:[keys], irrVerbs:[inf] (optional)
   *   direction : 'en2es' | 'es2en' | 'mixed'   (translation cards only)
   * }
   */
  function generateCards(sel) {
    var cards = [];
    var dir = sel.direction || 'en2es';

    if (sel.vocab) {
      window.VOCAB.forEach(function (w) {
        cards.push(transCard(w.es, w.en, 'vocab', dir));
      });
    }
    if (sel.verbs100) {
      var verbList = window.VERBS;
      // If verbs100Verbs is provided (an array), treat it as the explicit set:
      //   [...names] → just those verbs, [] → none. Omitted entirely → all.
      if (Array.isArray(sel.verbs100Verbs)) {
        verbList = verbList.filter(function (v) { return sel.verbs100Verbs.indexOf(v.inf) !== -1; });
      }
      verbList.forEach(function (v) {
        cards.push(transCard(v.inf, v.en, 'verb', dir));
      });
    }
    if (sel.idioms) {
      window.IDIOMS.forEach(function (x) {
        cards.push(transCard(x.es, x.en, 'idiom', dir, x.lit));
      });
    }
    var convOpts = { translateInf: !!sel.translateInf };
    if (sel.regConj && sel.regConjTenses && sel.regConjTenses.length) {
      // Wide pool: every fully-regular verb in the dataset, not just the
      // three model verbs — so you drill regular conjugation across many verbs.
      var regList = window.VERBS.filter(function (v) { return !isIrregular(v); });
      // If regVerbs is provided (an array), treat it as the explicit set:
      //   [...names] → just those verbs, [] → none. Omitted entirely → all.
      if (Array.isArray(sel.regVerbs)) {
        regList = regList.filter(function (v) { return sel.regVerbs.indexOf(v.inf) !== -1; });
      }
      regList.forEach(function (v) {
        cards = cards.concat(conjCards(v, sel.regConjTenses, convOpts));
      });
    }
    if (sel.endings && sel.endingsTenses && sel.endingsTenses.length) {
      cards = cards.concat(endingCards(sel.endingsTenses));
    }
    if (sel.irrConj && sel.irrConjTenses && sel.irrConjTenses.length) {
      var list = window.VERBS.filter(isIrregular);
      // If irrVerbs is provided (an array), treat it as the explicit set:
      //   [...names] → just those verbs, [] → none. Omitted entirely → all.
      if (Array.isArray(sel.irrVerbs)) {
        list = list.filter(function (v) { return sel.irrVerbs.indexOf(v.inf) !== -1; });
      }
      list.forEach(function (v) {
        cards = cards.concat(conjCards(v, sel.irrConjTenses, convOpts));
      });
    }
    return cards;
  }

  // ==========================================================================
  // MORPHOLOGICAL ANALYSIS  (powers the writing checker)
  // A reverse index maps every conjugated surface form back to the verb, tense
  // and person(s) it could be. Because the engine derives every form, this
  // index is always exhaustive and correct — no hand-maintained word lists.
  // ==========================================================================
  var _idx = null;         // single-word form (accent-stripped) -> [analysis]
  var _partIdx = null;     // participle (accent-stripped) -> [{inf,tense,...}]
  var _haberIdx = null;    // haber form (accent-stripped) -> [{tense,person}]

  function ensureIndex() {
    if (_idx) return;
    _idx = {}; _partIdx = {}; _haberIdx = {};
    var haber = verbByInf('haber');
    window.VERBS.forEach(function (v) {
      // Index the BARE conjugation (before the reflexive pronoun is added) —
      // a learner types "me levanto" as two separate tokens, so the token
      // that actually needs to be recognised as a verb form is "levanto",
      // not the two-word "me levanto". The true (reflexive) infinitive is
      // still what gets reported for the match.
      var reflexive = isReflexivo(v.inf);
      var baseV = reflexive ? { inf: reflexiveBase(v.inf), forms: v.forms, part: v.part, ger: v.ger, tuCmd: v.tuCmd, en: v.en, stem: v.stem, like: v.like } : v;
      TENSES.forEach(function (t) {
        var persons = personsFor(t.key);
        conjugateBase(baseV, t.key).forEach(function (form, i) {
          var lw = form.toLowerCase();
          if (lw.indexOf(' ') === -1) {
            var k = deaccent(lw);
            (_idx[k] = _idx[k] || []).push({
              inf: v.inf, tense: t.key, person: persons[i], form: form, type: vowelOf(baseV.inf)
            });
          } else {                                   // compound: haber + participle
            var part = deaccent(lw.split(' ').pop());
            (_partIdx[part] = _partIdx[part] || []).push({ inf: v.inf, tense: t.key });
          }
        });
      });
    });
    // haber's own simple forms, for detecting compound tenses in learner text
    ['presente', 'imperfecto', 'futuro', 'condicional', 'presubj', 'impsubj'].forEach(function (tk) {
      conjugate(haber, tk).forEach(function (form, i) {
        var k = deaccent(form.toLowerCase());
        if (k.indexOf(' ') !== -1) return;
        (_haberIdx[k] = _haberIdx[k] || []).push({ tense: tk, person: PERSONS[i] });
      });
    });
  }

  // Split learner text into lowercase word tokens (Spanish letters only).
  function tokenize(text) {
    return (text || '').toLowerCase()
      .replace(/[^a-záéíóúñü\s]/g, ' ')
      .split(/\s+/).filter(Boolean);
  }

  // Common function words whose accent-less spelling collides with a verb form
  // (de/dé, esta/está, hacia/hacía, se/sé, solo, si/sí…). For these, an
  // accent-INEXACT match is far more likely the function word than a typo'd
  // verb, so it doesn't count as a verb analysis. (Typing the accent still
  // matches: "dé" is always dar.)
  var FUNCTION_WORDS = { de: 1, se: 1, esta: 1, estas: 1, hacia: 1, solo: 1, si: 1, aun: 1, mas: 1, te: 1, mi: 1, tu: 1, el: 1 };

  // All analyses for one token. `accentExact` flags whether the accents matched
  // the canonical form (so the checker can nudge on "comio" vs "comió").
  /* ---- enclitic pronouns ---------------------------------------------------
   * Spanish attaches object pronouns to the END of an infinitive, a gerund or
   * an affirmative imperative: dímelo, ayúdame, levántate, decírselo. The index
   * holds only bare forms, so none of those were recognised at all — which
   * meant the writing checker could not see the very forms the imperative
   * lessons teach, and the accent linter could not check their (obligatory)
   * written accent.
   *
   * Stripping is only safe with the accent rule that comes with it. Attaching a
   * clitic shifts the stress, so the accent becomes obligatory unless the base
   * is a monosyllabic imperative: dame and dime need none, ayúdame and dedícale
   * do. Without that test "tomate" (the vegetable) would parse as tomar + te,
   * and "chocolate", "gente", "parte" and every other -te noun with it.
   * ------------------------------------------------------------------------ */
  var CLITICS = ['me', 'te', 'se', 'lo', 'la', 'le', 'nos', 'os', 'los', 'las', 'les'];
  var MONO_IMPERATIVES = { da: 1, di: 1, ve: 1, ven: 1, pon: 1, sal: 1, ten: 1, haz: 1, se: 1, oye: 1 };
  // Ordinary words that a monosyllabic imperative plus one clitic happens to
  // spell. Without these, "dios" parses as di+os and "vela" as ve+la.
  var CLITIC_STOPLIST = { dios: 1, vela: 1, velas: 1, velo: 1, velos: 1, dale: 1, dalia: 1, tenor: 1 };
  // Attachment is legal on an affirmative imperative, an infinitive and a
  // gerund. Only the imperative is handled: infinitives are not in the index,
  // and neither infinitives nor gerunds carry a person, which is what the
  // consumers of this (the writing checker, the address-consistency gate)
  // actually need. "decírselo" therefore still returns nothing.

  function stripClitics(t) {
    var out = [];                                  // [{ base, clitics }]
    for (var i = 0; i < CLITICS.length; i++) {
      var c1 = CLITICS[i];
      if (t.length <= c1.length + 1 || t.slice(-c1.length) !== c1) continue;
      var b1 = t.slice(0, -c1.length);
      out.push({ base: b1, clitics: [c1] });
      for (var j = 0; j < CLITICS.length; j++) {   // two pronouns: dá-me-lo
        var c2 = CLITICS[j];
        if (b1.length <= c2.length + 1 || b1.slice(-c2.length) !== c2) continue;
        out.push({ base: b1.slice(0, -c2.length), clitics: [c2, c1] });
      }
    }
    return out;
  }

  function analyzeBare(t) {
    return (_idx[deaccent(t)] || []).map(function (a) {
      return { inf: a.inf, tense: a.tense, person: a.person, form: a.form,
               type: a.type, accentExact: a.form.toLowerCase() === t };
    });
  }

  function analyzeToken(tok) {
    ensureIndex();
    var t = tok.toLowerCase();
    var list = analyzeBare(t);
    if (FUNCTION_WORDS[t]) {
      list = list.filter(function (a) { return a.accentExact; });
    }
    if (list.length) return list;

    if (CLITIC_STOPLIST[t]) return [];
    var accented = /[áéíóú]/.test(t);
    var found = [], seen = {};
    stripClitics(t).forEach(function (cand) {
      var single = cand.clitics.length === 1;
      // the vosotros imperative drops its -d before os: levantad + os > levantaos
      var vosOs = single && cand.clitics[0] === 'os';
      // For -os the vosotros imperative DROPS its -d (sentad + os > sentaos), so
      // only the restored-d form is valid. Trying the bare base too would parse
      // the participle "sentados" as sentad + os. The one exception is irse,
      // whose form keeps the d: idos.
      var bases;
      if (vosOs) {
        bases = [{ b: deaccent(cand.base) + 'd', free: true }];
        if (deaccent(cand.base) === 'id') bases.push({ b: 'id', free: true });
      } else {
        bases = [{ b: cand.base, free: false }, { b: deaccent(cand.base), free: false }];
      }
      bases.forEach(function (x) {
        analyzeBare(x.b).forEach(function (a) {
          if (a.tense !== 'imperativo') return;
          // vosotros + os is inherently reflexive (levantaos, sentaos, idos).
          // Without this, "correos" parses as corred + os and the post office
          // becomes an imperative.
          if (vosOs && !/(arse|erse|irse)$/.test(a.inf)) return;
          // an unaccented token can only be a monosyllabic imperative (dame,
          // hazlo) or the -os vosotros form, which never takes one (levantaos)
          // A vosotros imperative ends in -d and is stressed on that syllable,
          // so attaching one clitic leaves the stress penultimate and no accent
          // is written: dedicadle, dadme, vendedlo.
          var vosD = a.person === 'vosotros' && /d$/.test(x.b) && single;
          if (!accented && !x.free && !vosD && !MONO_IMPERATIVES[deaccent(x.b)]) return;
          var k = a.inf + a.person + cand.clitics.join('');
          if (seen[k]) return; seen[k] = 1;
          found.push({ inf: a.inf, tense: a.tense, person: a.person, form: a.form,
                       type: a.type, accentExact: true, clitics: cand.clitics });
        });
      });
    });
    return found;
  }

  function isParticiple(tok) { ensureIndex(); return !!_partIdx[deaccent(tok.toLowerCase())]; }
  function participlesOf(tok) { ensureIndex(); return _partIdx[deaccent(tok.toLowerCase())] || []; }
  function haberAnalyses(tok) { ensureIndex(); return _haberIdx[deaccent(tok.toLowerCase())] || []; }

  // Analyze a whole sentence: the tokens, every recognised verb form with its
  // analyses, and any compound (haber + participle) verb phrases detected.
  function analyzeSentence(text) {
    var toks = tokenize(text);
    var verbs = [], compounds = [];
    toks.forEach(function (tk, i) {
      var a = analyzeToken(tk);
      if (a.length) verbs.push({ token: tk, index: i, analyses: a });
      // compound: a haber form followed (allowing one adverb gap) by a participle
      var hb = haberAnalyses(tk);
      if (hb.length) {
        for (var j = i + 1; j <= i + 2 && j < toks.length; j++) {
          if (isParticiple(toks[j])) {
            compounds.push({ haber: tk, participle: toks[j], haberAnalyses: hb,
                             parts: participlesOf(toks[j]) });
            break;
          }
        }
      }
    });
    return { text: text, tokens: toks, verbs: verbs, compounds: compounds };
  }

  // ---- concept-lesson matching --------------------------------------------
  // Four lessons in the syllabus aren't a single conjugation tense (ser/estar,
  // gender & articles, preterite-vs-imperfect, por/para), so passages/cloze/
  // writing tasks can't be matched by comparing a `tense` field directly.
  // This gives each one a real definition of "relevant content" — used by both
  // the daily session (to align today's story/practice to the day's lesson)
  // and on-demand lesson-taking — plus a safe, self-consistent fallback
  // writing task for when the matched pool comes up empty.
  var CONCEPTS = {
    'ser-estar': {
      label: 'ser vs. estar',
      matchesText: function (text) {
        var a = analyzeSentence(text);
        return a.verbs.some(function (v) { return v.analyses.some(function (x) { return x.inf === 'ser' || x.inf === 'estar'; }); });
      },
      matchesCloze: function (it) { return it.inf === 'ser' || it.inf === 'estar'; },
      matchesConstraints: function (cs) {
        return (cs || []).some(function (c) { return (c.type === 'verbFormAny' || c.type === 'verbForm') && (c.inf === 'ser' || c.inf === 'estar'); });
      },
      fallbackWrites: function () { return [
        { prompt: 'Describe someone or something using “ser” (identity, characteristics).', hint: 'Use “es” or “soy”.',
          constraints: [{ type: 'verbFormAny', inf: 'ser', tense: 'presente' }, { type: 'minWords', n: 5 }],
          models: ['Mi hermana es muy simpática.'] },
        { prompt: 'Say how someone feels or where something is, using “estar”.', hint: 'Use “está” or “estoy”.',
          constraints: [{ type: 'verbFormAny', inf: 'estar', tense: 'presente' }, { type: 'minWords', n: 5 }],
          models: ['Estoy muy cansado y quiero dormir.'] }
      ]; }
    },
    'gender-articles': {
      label: 'gender & articles',
      matchesText: function () { return true; },        // gender/articles are present in any Spanish text
      matchesCloze: function () { return false; },       // no verb-conjugation cloze applies to this concept
      matchesConstraints: function () { return false; },
      fallbackWrites: function () { return [
        { prompt: 'Describe three objects around you, including their correct article (el/la/un/una).', hint: 'Pay attention to noun gender.',
          constraints: [{ type: 'minWords', n: 8 }], models: ['Veo una mesa, un libro y una ventana.'] }
      ]; }
    },
    'preterite-imperfect': {
      label: 'preterite vs. imperfect',
      matchesText: function (text) {
        var a = analyzeSentence(text);
        var has = function (t) { return a.verbs.some(function (v) { return v.analyses.some(function (x) { return x.tense === t; }); }); };
        return has('preterito') && has('imperfecto');
      },
      matchesCloze: function (it) { return it.tense === 'preterito' || it.tense === 'imperfecto'; },
      matchesConstraints: function (cs) {
        return (cs || []).some(function (c) { return c.type === 'anyVerbInTense' && (c.tense === 'preterito' || c.tense === 'imperfecto'); });
      },
      fallbackWrites: function () { return [
        { prompt: 'Tell a short story contrasting a background situation and an interrupting event.', hint: 'imperfecto for the background, pretérito for the event.',
          constraints: [{ type: 'anyVerbInTense', tense: 'imperfecto' }, { type: 'anyVerbInTense', tense: 'preterito' }, { type: 'minWords', n: 12 }],
          models: ['Yo dormía tranquilamente en mi habitación cuando de repente llegaste tú a casa.'] }
      ]; }
    },
    'por-para': {
      label: 'por vs. para',
      matchesText: function (text) { return /\bpor\b/i.test(text) || /\bpara\b/i.test(text); },
      matchesCloze: function () { return false; },        // cloze is verb-conjugation only, no por/para mechanic
      matchesConstraints: function (cs) {
        return (cs || []).some(function (c) {
          return (c.type === 'containsWord' && /^(por|para)$/i.test(c.word)) ||
                 (c.type === 'containsAny' && (c.words || []).some(function (w) { return /^(por|para)$/i.test(w); }));
        });
      },
      fallbackWrites: function () { return [
        { prompt: 'Write a sentence using “para” to express a purpose or destination.', hint: 'para + infinitive/noun.',
          constraints: [{ type: 'containsWord', word: 'para' }, { type: 'minWords', n: 5 }], models: ['Estudio español para viajar a España.'] },
        { prompt: 'Write a sentence using “por” to express a cause, duration, or exchange.', hint: 'por + reason/duration.',
          constraints: [{ type: 'containsWord', word: 'por' }, { type: 'minWords', n: 5 }], models: ['Caminé por el parque durante una hora.'] }
      ]; }
    }
  };

  // ---- vocab/verb-group matching (for vocab & verb lessons) ---------------
  // Both return a COUNT (not a boolean) so callers can require "at least K
  // matches" — a passage that merely mentions one word/verb in passing isn't
  // a good story for that lesson; one that uses several clearly is.
  function matchesVerbGroup(text, infs) {
    var a = analyzeSentence(text), n = 0;
    a.verbs.forEach(function (v) {
      if (v.analyses.some(function (x) { return infs.indexOf(x.inf) !== -1; })) n++;
    });
    return n;
  }
  function matchesVocabWords(text, words) {
    var t = ' ' + deaccent(text.toLowerCase()) + ' ';
    var n = 0;
    (words || []).forEach(function (w) {
      var noun = deaccent(w.toLowerCase().replace(/^(el |la |los |las |un |una )/, ''));
      if (t.indexOf(noun) !== -1) n++;
    });
    return n;
  }

  return {
    PERSONS: PERSONS,
    IMP_PERSONS: IMP_PERSONS,
    TENSES: TENSES,
    TENSE_LABEL: TENSE_LABEL,
    MODEL_VERBS: MODEL_VERBS,
    ENDING_TENSES: ENDING_TENSES,
    END: END,
    conjugate: conjugate,
    conjCards: conjCards,
    enPhrase: enPhrase,
    endingCards: endingCards,
    participle: participle,
    gerund: gerund,
    isIrregular: isIrregular,
    isReflexivo: isReflexivo,
    reflexiveBase: reflexiveBase,
    /* Is this verb irregular IN THIS TENSE? A stem-changer is irregular in the
     * present and the subjunctive but perfectly regular in the imperfect, and
     * an -ar verb with an orthographic change is regular in the present. Used
     * to keep unheralded irregulars out of a beginner's practice. */
    isIrregularIn: function (v, tenseKey) {
      if (!v) return false;
      if (v.forms && v.forms[tenseKey]) return true;
      if (v.like) return true;
      if (v.stem) {
        if (tenseKey === 'presente' || tenseKey === 'presubj' || tenseKey === 'imperativo') return true;
        if (tenseKey === 'preterito' && vowelOf(v.inf) === 'ir') return true;
      }
      return false;
    },
    personsFor: personsFor,
    verbByInf: verbByInf,
    normalize: normalize,
    shuffle: shuffle,
    generateCards: generateCards,
    deaccent: deaccent,
    tokenize: tokenize,
    analyzeToken: analyzeToken,
    analyzeSentence: analyzeSentence,
    isParticiple: isParticiple,
    CONCEPTS: CONCEPTS,
    matchesVerbGroup: matchesVerbGroup,
    matchesVocabWords: matchesVocabWords
  };
})();
