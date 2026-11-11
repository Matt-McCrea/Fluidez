/* ============================================================================
 * AR HURUF: stage 0, the script course (docs/talaqa-spec.md, "Stage 0").
 *
 * Twelve lessons from data/letters.js. Each is a card (what to look at, the
 * letters with their four shapes, the words) and then a Hadi round of its own
 * kinds, mixed with earlier letters one in four. Eight of ten right passes the
 * lesson. The exit test is forty items over every kind: 32 right opens the
 * board and sets the start band (38 or more starts at A2).
 *
 * Round kinds: sound, hear, shape, vowel, read, build (letter tiles), and
 * article (lesson 10: is the l said?). Every letter, letter-and-position,
 * syllable and lesson word is an SRS item (ids h:l: h:s: h:v: h:w:).
 * Progress is kept in talaqa.huruf.
 * ========================================================================== */
window.ARHuruf = (function () {
  var UI = window.UI, AR = window.AR, GC = window.ARCore;
  var KEY = 'talaqa.huruf';
  var PASS = 8, ROUND = 10, EXAM = 40, EXAM_PASS = 32, EXAM_A2 = 38;
  var HUE = '#c9a227';
  var host = function () { return document.getElementById('stage-host'); };
  var nav = { board: function () {}, push: function () {}, back: function () {}, topBar: null };
  var lastItem = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function button(cls, text, fn) {
    var b = el('button', cls, text);
    b.type = 'button';
    if (fn) b.addEventListener('click', fn);
    return b;
  }
  function letters() { return window.AR_LETTERS || []; }
  function lessons() { return window.AR_LESSONS || []; }
  function lessonN(n) { return lessons().filter(function (l) { return l.n === n; })[0] || null; }
  function rnd(rng) { return (rng || Math.random)(); }
  function pick(a, rng) { return a.length ? a[Math.floor(rnd(rng) * a.length)] : null; }
  function shuffle(a, rng) { return GC.shuffle(a, rng); }
  function wordTr(w) { return w.tr || AR.translit(w.ar); }
  function isSyllable(w) { return /^the syllable/.test(w.en || ''); }

  // ---- progress -----------------------------------------------------------------
  var mem = null;
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { mem = {}; }
    mem.passed = mem.passed || {};
    mem.exam = mem.exam || {};
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem || {})); } catch (e) {} }
  function state() { return load(); }
  function unlocked() { return !!load().exam.passed; }
  function lessonOpen(n) { return unlocked() || n === 1 || !!load().passed[n - 1]; }
  function lessonDone(n) { return !!load().passed[n]; }
  function started() { var s = load(); return !!(s.started || s.exam.passed || (window.Profile && window.Profile.placed())); }
  function _reset() { mem = null; }
  function markStarted() { load().started = true; save(); }

  // ---- item building ----------------------------------------------------------------
  /* Letters that look alike, so the wrong options are the ones worth thinking about. */
  var FAM = { ba: 'tooth', ta: 'tooth', tha: 'tooth', nun: 'tooth', ya: 'tooth', maqsura: 'tooth',
    jim: 'cup', ha: 'cup', kha: 'cup', dal: 'd', dhal: 'd', ra: 'r', zay: 'r', sin: 's', shin: 's',
    sad: 'loop', dad: 'loop', tta: 'tall', zza: 'tall', ayn: 'ayn', ghayn: 'ayn', fa: 'fq', qaf: 'fq',
    ha2: 'h', hha: 'h', marbuta: 'h' };
  var POSITION = { initial: 'at the start of a word', medial: 'in the middle of a word', final: 'at the end of a word' };

  function base(over) {
    var it = { kind: 'huruf', play: 'choose', cefr: 'A1', bonus: 0, topic: 'huruf', level: null, stage0: true };
    for (var k in over) it[k] = over[k];
    return it;
  }
  function distinctPick(L, pool, rng, valueOf, bad) {
    var fam = FAM[L.id];
    var cands = pool.filter(function (o) { return o.id !== L.id; });
    var near = fam ? cands.filter(function (o) { return FAM[o.id] === fam; }) : [];
    var rest = cands.filter(function (o) { return near.indexOf(o) === -1; });
    var out = [], seen = {};
    seen[valueOf(L)] = 1;
    shuffle(near, rng).concat(shuffle(rest, rng)).forEach(function (o) {
      var v = valueOf(o);
      if (out.length >= 3 || seen[v] || (bad && bad(o))) return;
      seen[v] = 1; out.push(v);
    });
    return out.length === 3 ? out : null;
  }
  function sameSound(L) { return function (o) { return o.tr === L.tr; }; }

  function soundItem(L, pool, rng, hear) {
    var wrong = distinctPick(L, pool, rng, function (o) { return o.ch; }, sameSound(L));
    if (!wrong) return null;
    var it = base({ id: 'h:l:' + L.id, answer: L.ch, options: shuffle([L.ch].concat(wrong), rng), optAr: true, optBig: true,
      promptSay: { t: L.nm, v: 'msa' }, say: { t: L.nm, v: 'msa' }, note: L.name + ': ' + L.say, ar: L.ch, drill: 'letter' });
    if (hear) { it.hear = true; it.prompt = ''; it.hearLabel = 'Listen, then pick the letter'; }
    else { it.prompt = L.tr; it.pBig = true; it.pSub = L.name; }
    return it;
  }
  function shapeItem(L, pool, rng) {
    var f = AR.forms(L.ch);
    var onlyFinal = !AR.joins(L.ch) || L.id === 'marbuta' || L.id === 'maqsura';
    var pos = onlyFinal ? 'final' : pick(['initial', 'medial', 'final'], rng);
    var wrong = distinctPick(L, pool, rng, function (o) { return AR.forms(o.ch)[pos]; });
    if (!wrong) return null;
    var ans = f[pos];
    return base({ id: 'h:s:' + L.id + ':' + pos, prompt: L.ch, pBig: true, pSub: L.name + ', ' + POSITION[pos],
      answer: ans, options: shuffle([ans].concat(wrong), rng), optAr: true, optBig: true,
      sub: 'Which one is it ' + POSITION[pos] + '?', say: { t: L.nm, v: 'msa' }, note: L.name + ' ' + POSITION[pos] + ' looks like ' + ans, ar: L.ch, drill: 'shape' });
  }
  var SHORT = [['a', 'َ'], ['i', 'ِ'], ['u', 'ُ'], ['', 'ْ']];
  var TAN = [['a', 'َ'], ['an', 'ً'], ['in', 'ٍ'], ['un', 'ٌ']];
  function vowelItem(pool, rng, tanwin) {
    var cons = pool.filter(function (l) { return ['alif', 'hamza', 'marbuta', 'maqsura'].indexOf(l.id) === -1; });
    var C = pick(cons, rng);
    if (!C) return null;
    var set = tanwin ? TAN : SHORT, target = pick(set, rng);
    var syll = function (m) { return C.ch + m[1]; };
    var ans = syll(target);
    var t = AR.translit(ans);
    return base({ id: 'h:v:' + C.id + ':' + target[1].charCodeAt(0).toString(16), prompt: t, pBig: true,
      pSub: tanwin ? 'with its n ending' : (target[0] ? 'which vowel?' : 'no vowel'), answer: ans,
      options: shuffle(set.map(syll), rng), optAr: true, optBig: true, promptSay: { t: ans, v: 'msa' }, say: { t: ans, v: 'msa' },
      note: ans + ' is said ' + t, ar: ans, drill: 'vowel' });
  }
  /* Wrong spellings out loud for a transliteration: change one vowel. */
  function nearMisses(s, rng) {
    var alt = { a: ['i', 'u', 'ā'], i: ['a', 'u', 'ī'], u: ['a', 'i', 'ū'], 'ā': ['a'], 'ī': ['i'], 'ū': ['u'] };
    var out = [], seen = {};
    seen[s] = 1;
    for (var i = 0; i < s.length; i++) {
      (alt[s.charAt(i)] || []).forEach(function (r) {
        var v = s.slice(0, i) + r + s.slice(i + 1);
        if (!seen[v]) { seen[v] = 1; out.push(v); }
      });
    }
    return shuffle(out, rng);
  }
  function readItem(W, rng) {
    var t = wordTr(W);
    var wrong = nearMisses(t, rng).slice(0, 3);
    if (wrong.length < 3) return null;
    return base({ id: 'h:w:' + W.ar, prompt: W.ar, pAr: true, level: 'full', sub: 'How is it said?', answer: t, ansLatin: true,
      options: shuffle([t].concat(wrong), rng), optAr: false, promptSay: { t: W.ar, v: 'msa' }, say: { t: W.ar, v: 'msa' },
      note: W.ar + ' means ' + W.en, ar: W.ar, en: W.en, drill: 'read' });
  }
  function articleItem(W, rng) {
    var t = wordTr(W), wrong = [], m;
    if (/^al-/.test(t)) {
      m = /^al-(kh|gh|.)/.exec(t);
      if (m) wrong.push('a' + m[1] + '-' + t.slice(3));
    } else if ((m = /^a(.+?)-(.*)$/.exec(t))) {
      wrong.push('al-' + m[2]);
    }
    nearMisses(t, rng).forEach(function (v) { if (wrong.length < 3 && wrong.indexOf(v) === -1) wrong.push(v); });
    if (wrong.length < 3) return null;
    return base({ id: 'h:w:' + W.ar, prompt: W.ar, pAr: true, level: 'full', sub: 'The l: said or not said?', answer: t, ansLatin: true,
      options: shuffle([t].concat(wrong.slice(0, 3)), rng), optAr: false, promptSay: { t: W.ar, v: 'msa' }, say: { t: W.ar, v: 'msa' },
      note: W.ar + ' means ' + W.en, ar: W.ar, en: W.en, drill: 'article' });
  }
  function buildItem(W, pool, rng) {
    var target = AR.strip(W.ar).replace(/ /g, '');
    if (isSyllable(W) || target.length < 2 || target.length > 8) return null;
    var inWord = {};
    target.split('').forEach(function (c) { inWord[c] = 1; });
    var decoys = shuffle(pool.map(function (l) { return l.ch; }).filter(function (c) { return !inWord[c]; }), rng).slice(0, 2);
    if (decoys.length < 2) return null;
    return base({ id: 'h:w:' + W.ar, play: 'build', prompt: W.en, pSub: wordTr(W), answer: W.ar, accept: [W.ar], target: target,
      tiles: shuffle(target.split('').concat(decoys), rng), promptSay: { t: W.ar, v: 'msa' }, say: { t: W.ar, v: 'msa' },
      note: null, ar: W.ar, en: W.en, drill: 'build' });
  }

  var LETTER_KINDS = ['sound', 'hear', 'shape'];
  /* One item of a kind. L: a letter, W: a word, pool: the letters in play. */
  function make(kind, L, W, pool, rng, lessonNo) {
    var it = null;
    if (kind === 'hear' && L && !AR.has(L.nm, 'msa')) kind = 'sound';
    if (kind === 'sound' || kind === 'hear') it = L && soundItem(L, pool, rng, kind === 'hear');
    else if (kind === 'shape') it = L && shapeItem(L, pool, rng);
    else if (kind === 'vowel') it = vowelItem(pool, rng, lessonNo === 11);
    else if (kind === 'read') it = W && readItem(W, rng);
    else if (kind === 'article') it = W && articleItem(W, rng);
    else if (kind === 'build') it = W && buildItem(W, pool, rng);
    return it;
  }

  // ---- a lesson round --------------------------------------------------------------------
  function lettersOf(n) {
    var L = lessonN(n);
    return letters().filter(function (l) { return L && L.letters.indexOf(l.id) !== -1; });
  }
  function poolOf(n) { return letters().filter(function (l) { return l.lesson <= n; }); }
  function earlierOf(n) { return letters().filter(function (l) { return l.lesson < n; }); }

  function lessonDealer(n) {
    var L = lessonN(n), pool = poolOf(n), earlier = earlierOf(n);
    var mine = lettersOf(n);
    var targets = mine.length ? mine : earlier;
    var words = (L && L.words) || [];
    var li = 0, wi = 0, ki = 0;
    var lo = null, wo = null;
    return function (rng) {
      for (var tries = 0; tries < 12; tries++) {
        var it = null;
        if (earlier.length && mine.length && rnd(rng) < 0.25) {
          // an earlier letter, in a letter kind
          it = make(pick(LETTER_KINDS, rng), pick(earlier, rng), null, pool, rng, n);
        } else {
          var kind = L.kinds[ki++ % L.kinds.length];
          var letter = null, word = null;
          if (LETTER_KINDS.indexOf(kind) !== -1) {
            if (!lo || li >= lo.length) { lo = shuffle(targets, rng); li = 0; }
            letter = lo[li++];
          } else if (kind !== 'vowel') {
            if (!wo || wi >= wo.length) { wo = shuffle(words, rng); wi = 0; }
            word = wo[wi++];
          }
          it = make(kind, letter, word, pool, rng, n);
        }
        if (it) { lastItem = it; return it; }
      }
      return null;
    };
  }

  // ---- the exit test -------------------------------------------------------------------------
  function examItems(rng) {
    var all = letters(), pool = all;
    var words = [];
    lessons().forEach(function (l) { l.words.forEach(function (w) { words.push(w); }); });
    var kinds = ['sound', 'hear', 'shape', 'vowel', 'read', 'build', 'article'];
    var arts = words.filter(function (w) { return /^الْ|^ال/.test(w.ar) && AR.strip(w.ar).indexOf('ال') === 0; });
    var out = [], used = {}, li = 0, wi = 0, lo = shuffle(all, rng), wo = shuffle(words, rng), ki = 0, guard = 0;
    while (out.length < EXAM && guard++ < 600) {
      var kind = kinds[ki++ % kinds.length];
      var L = lo[li++ % lo.length], W = wo[wi++ % wo.length];
      if (kind === 'article') W = pick(arts, rng);
      var it = make(kind, L, W, pool, rng, 0);
      if (!it) continue;
      if (used[it.id + '|' + it.kind + '|' + (it.hear ? 'h' : '')] && guard < 400) continue;
      used[it.id + '|' + it.kind + '|' + (it.hear ? 'h' : '')] = 1;
      out.push(it);
    }
    return out;
  }
  function examDealer(rng) {
    var list = examItems(rng), i = 0;
    return function () { var it = list[i++] || null; if (it) lastItem = it; return it; };
  }

  // ---- screens -----------------------------------------------------------------------------------
  function top(title, onBack) {
    var t = el('div', 'arc-stats-top');
    if (onBack) t.appendChild(button('arc-back', '←', onBack));
    t.appendChild(el('h2', null, title));
    return t;
  }
  function wrapEl() {
    var w = el('div', 'arc-stats arc-huruf');
    w.style.setProperty('--g', HUE);
    return w;
  }
  function show(w) { var h = host(); clear(h); h.appendChild(w); }

  function strandHead(en, ar, tr) {
    var h = el('div', 'sp-strand');
    h.appendChild(el('b', null, en));
    h.appendChild(UI.ar(ar));
    h.appendChild(el('span', 'tr', tr));
    return h;
  }

  function firstOpen() {
    var w = el('div', 'arc arc-first');
    var brand = el('div', 'arc-first-brand');
    brand.appendChild(UI.ar('طَلَاقَة', 'big'));
    brand.appendChild(el('div', 'arc-brand', 'Ṭalāqa'));
    w.appendChild(brand);
    w.appendChild(el('p', 'arc-sub', 'You can start speaking Arabic now, and learn the letters alongside. The games open when you pass the letters test.'));
    if (window.ARSpeak) window.ARSpeak.section(w, true);
    w.appendChild(strandHead('Letters', 'حُرُوف', 'Ḥurūf'));
    var b1 = button('arc-mode on', null, function () { load().started = true; save(); nav.push('card'); lessonCard(1); });
    b1.appendChild(el('b', null, 'I\'m new to the script'));
    b1.appendChild(el('span', null, 'Start with lesson 1: the first letters'));
    var b2 = button('arc-mode', null, function () { load().started = true; save(); nav.push('exam'); examIntro(); });
    b2.appendChild(el('b', null, 'I can read Arabic'));
    b2.appendChild(el('span', null, 'Take the exit test: 40 questions, 32 to open the games'));
    var row = el('div', 'arc-modes');
    row.appendChild(b1); row.appendChild(b2);
    w.appendChild(row);
    show(w);
  }

  function path() {
    var open = unlocked();
    var w = wrapEl();
    w.appendChild(top(open ? 'Ḥurūf' : 'Ṭalāqa', open ? nav.board : null));
    if (!open && window.ARSpeak) {
      window.ARSpeak.section(w, false);
      w.appendChild(strandHead('Letters', 'حُرُوف', 'Ḥurūf'));
    }
    w.appendChild(el('p', 'arc-sub', open
      ? 'The script course. Lessons stay open for review.'
      : 'Twelve lessons. Pass each round with 8 of 10 to open the next. Pass the exit test to open the games.'));
    var list = el('div', 'arc-picks');
    lessons().forEach(function (l) {
      var ok = lessonOpen(l.n), done = lessonDone(l.n);
      var b = el('button', 'arc-pick' + (done ? ' on' : ''));
      b.type = 'button';
      b.disabled = !ok;
      var t = el('b', null, l.n + '  ');
      t.appendChild(UI.ar(l.title));
      b.appendChild(t);
      b.appendChild(el('span', null, l.en + (done ? ' · passed' : ok ? '' : ' · locked')));
      b.addEventListener('click', function () { nav.push('card'); lessonCard(l.n); });
      list.appendChild(b);
    });
    w.appendChild(list);
    if (open) {
      w.appendChild(button('arc-wtbtn', 'Review the letters and words (10 questions)', function () { reviewRound(); }));
    }
    w.appendChild(button('arc-wtbtn', open ? 'Take the exit test again' : 'Skip to the exit test', function () { nav.push('exam'); examIntro(); }));
    show(w);
  }

  function letterCard(L) {
    var c = el('div', 'hr-letter');
    var head = el('div', 'hr-letter-head');
    head.appendChild(UI.ar(L.ch, 'hr-big'));
    var meta = el('div', 'hr-meta');
    meta.appendChild(el('b', null, L.name));
    meta.appendChild(UI.tr(L.tr, 'block'));
    head.appendChild(meta);
    var sp = UI.speaker(L.nm, 'msa');
    if (sp) head.appendChild(sp);
    c.appendChild(head);
    c.appendChild(el('p', 'hr-say', L.say));
    var f = L.forms || AR.forms(L.ch);
    var row = el('div', 'hr-forms');
    row.setAttribute('dir', 'rtl');
    ['final', 'medial', 'initial', 'alone'].forEach(function (k) {
      var cell = el('span', 'hr-form');
      cell.appendChild(UI.ar(f[k]));
      cell.appendChild(el('small', null, k));
      row.appendChild(cell);
    });
    c.appendChild(row);
    return c;
  }

  function lessonCard(n) {
    var L = lessonN(n);
    if (!L) { path(); return; }
    var w = wrapEl();
    var t = top('Lesson ' + n, function () { nav.back(); });
    w.appendChild(t);
    var title = el('div', 'hr-title');
    title.appendChild(UI.ar(L.title, 'big'));
    title.appendChild(el('p', 'arc-sub', L.en));
    w.appendChild(title);
    if (L.card && L.card.how) {
      w.appendChild(el('div', 'arc-group', 'What to look at'));
      var ul = el('ul', 'arc-when');
      L.card.how.forEach(function (h) { ul.appendChild(UI.rich(el('li'), h)); });
      w.appendChild(ul);
    }
    var mine = lettersOf(n);
    if (mine.length) {
      w.appendChild(el('div', 'arc-group', mine.length === 1 ? 'The letter' : 'The letters'));
      mine.forEach(function (l) { w.appendChild(letterCard(l)); });
    }
    if (L.words && L.words.length) {
      w.appendChild(el('div', 'arc-group', 'Words to read'));
      L.words.forEach(function (x) {
        var r = el('div', 'hr-word');
        r.appendChild(UI.ar(x.ar, 'big'));
        var m = el('span', 'hr-wmeta');
        m.appendChild(UI.tr(wordTr(x)));
        m.appendChild(el('span', 'hr-wen', x.en));
        r.appendChild(m);
        var sp = UI.speaker(x.ar, 'msa');
        if (sp) r.appendChild(sp);
        w.appendChild(r);
      });
    }
    if (L.card && L.card.tip) {
      w.appendChild(el('div', 'arc-group', 'Tip'));
      w.appendChild(UI.rich(el('p', 'arc-how arc-tip'), L.card.tip));
    }
    var go = el('button', 'arc-mode on hr-start');
    go.type = 'button';
    go.appendChild(el('b', null, 'Start the round'));
    go.appendChild(el('span', null, '10 questions, 8 right to pass'));
    go.addEventListener('click', function () { startLessonRound(n); });
    var modes = el('div', 'arc-modes');
    modes.appendChild(go);
    w.appendChild(modes);
    show(w);
  }

  function runCfg(cfg) {
    nav.round();
    window.GameRound.run(host(), cfg);
  }

  function startLessonRound(n) {
    var L = lessonN(n);
    if (!L) return;
    var deal = lessonDealer(n);
    runCfg({
      key: 'huruf:t', title: 'Ḥurūf ' + n, kind: 'huruf', hue: HUE, count: ROUND, duration: null,
      draw: function (rng) { return deal(rng); },
      againLabel: 'Try again', again: function () { startLessonRound(n); },
      onExit: function () { path(); },
      onFinish: function (r) {
        var ok = r.right >= PASS;
        var box = el('div', 'hr-result');
        if (ok) {
          var s = load(); s.passed[n] = true; save();
          box.appendChild(el('div', 'g-over-verdict pb', 'Lesson ' + n + ' passed: ' + r.right + ' of ' + r.seen));
          var nextL = lessonN(n + 1);
          if (nextL) box.appendChild(button('arc-btn on', 'Next lesson →', function () { nav.push('card'); lessonCard(n + 1); }));
          else box.appendChild(button('arc-btn on', 'Take the exit test →', function () { nav.push('exam'); examIntro(); }));
        } else {
          box.appendChild(el('div', 'g-over-verdict', r.right + ' of ' + r.seen + ' right. ' + PASS + ' are needed to pass.'));
          box.appendChild(button('arc-btn', 'Read the card again', function () { nav.push('card'); lessonCard(n); }));
        }
        return box;
      }
    });
  }

  function reviewRound() {
    var mx = 0;
    lessons().forEach(function (l) { if (lessonDone(l.n) || unlocked()) mx = Math.max(mx, l.n); });
    var deal = lessonDealer(Math.max(1, mx));
    var pools = [];
    for (var i = 1; i <= Math.max(1, mx); i++) pools.push(lessonDealer(i));
    var k = 0;
    runCfg({
      key: 'huruf:t', title: 'Ḥurūf review', kind: 'huruf', hue: HUE, count: ROUND, duration: null,
      draw: function (rng) { return pools[k++ % pools.length](rng) || deal(rng); },
      again: reviewRound, onExit: function () { path(); }
    });
  }

  function examIntro() {
    var w = wrapEl();
    w.appendChild(top('Exit test', function () { nav.back(); }));
    w.appendChild(el('p', 'arc-sub', '40 questions over every kind: sounds, shapes, vowels, reading and spelling. Get 32 right and the games open. 38 or more starts you at A2.'));
    var row = el('div', 'arc-modes');
    var b = el('button', 'arc-mode on');
    b.type = 'button';
    b.appendChild(el('b', null, 'Start the exit test'));
    b.appendChild(el('span', null, 'No clock'));
    b.addEventListener('click', startExam);
    row.appendChild(b);
    w.appendChild(row);
    show(w);
  }

  function startExam() {
    var deal = examDealer();
    runCfg({
      key: 'huruf:x', title: 'Exit test', kind: 'huruf', hue: HUE, count: EXAM, duration: null,
      draw: function (rng) { return deal(rng); },
      againLabel: 'Take it again', again: startExam,
      onExit: function () { if (unlocked()) nav.board(); else path(); },
      onFinish: function (r) {
        var s = load(), box = el('div', 'hr-result');
        s.exam.best = Math.max(s.exam.best || 0, r.right);
        s.exam.last = r.right; s.exam.at = Date.now();
        if (r.right >= EXAM_PASS) {
          s.exam.passed = true;
          lessons().forEach(function (l) { s.passed[l.n] = true; });
          window.Profile.set(r.right >= EXAM_A2 ? 'A2' : 'A1');
          window.Profile.markPlaced();
          save();
          box.appendChild(el('div', 'g-over-verdict pb', 'Passed: ' + r.right + ' of ' + r.seen + '. The games are open, starting at ' + window.Profile.current() + '.'));
          box.appendChild(button('arc-btn on', 'Open the games →', function () { nav.board(); }));
        } else {
          save();
          box.appendChild(el('div', 'g-over-verdict', r.right + ' of ' + r.seen + '. ' + EXAM_PASS + ' are needed.'));
          box.appendChild(button('arc-btn', 'Go to the lessons', function () { path(); }));
        }
        return box;
      }
    });
  }

  function init(o) {
    for (var k in o) nav[k] = o[k];
    if (window.ARSpeak) window.ARSpeak.init({ board: o.board, push: o.push, back: o.back, round: o.round, leave: function () { if (unlocked()) window.ARSpeak.home(); else path(); } });
  }

  return {
    init: init, state: state, unlocked: unlocked, started: started, lessonOpen: lessonOpen, lessonDone: lessonDone,
    firstOpen: firstOpen, path: path, markStarted: markStarted, lessonCard: lessonCard, startLessonRound: startLessonRound,
    reviewRound: reviewRound, examIntro: examIntro, startExam: startExam,
    lessonDealer: lessonDealer, examItems: examItems, make: make, PASS: PASS, EXAM: EXAM, EXAM_PASS: EXAM_PASS,
    last: function () { return lastItem; }, _reset: _reset, HUE: HUE
  };
})();
