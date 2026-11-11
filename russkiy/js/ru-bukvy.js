/* ============================================================================
 * RU BUKVY: stage 0, the Cyrillic course (docs/russian-plan.md, "Russian specifics").
 *
 * Seven lessons from data/letters.js. Each is a card (what to look at, the
 * letters, the words) and then a Hadi round of its own kinds, mixed with earlier
 * letters one in four. Eight of ten right passes the lesson. The exit test is
 * thirty items over every kind: 24 right opens the board and sets the start band
 * (28 or more starts at A2).
 *
 * Round kinds: sound, hear, shape (capital and small), pair (hard and soft
 * vowel), read, build (letter tiles), stress (which vowel is stressed) and
 * italic (a handwriting shape, pick the printed word). Stage 0 reading rounds
 * go Russian to English sounds: they are the only ones that do.
 * Every letter and lesson word is an SRS item (ids b:l: b:s: b:p: b:r: b:b: b:t: b:i:).
 * Progress is kept in svobodno.bukvy.
 * ========================================================================== */
window.RUBukvy = (function () {
  var UI = window.UI, RU = window.RU, GC = window.RUCore;
  var KEY = 'svobodno.bukvy';
  var PASS = 8, ROUND = 10, EXAM = 30, EXAM_PASS = 24, EXAM_A2 = 28;
  var HUE = '#e3a83a';
  var ACUTE = '́';
  var host = function () { return document.getElementById('stage-host'); };
  var nav = { board: function () {}, push: function () {}, back: function () {}, round: function () {} };
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
  function letters() { return window.RU_LETTERS || []; }
  function lessons() { return window.RU_LESSONS || []; }
  function lessonN(n) { return lessons().filter(function (l) { return l.n === n; })[0] || null; }
  function rnd(rng) { return (rng || Math.random)(); }
  function pick(a, rng) { return a.length ? a[Math.floor(rnd(rng) * a.length)] : null; }
  function shuffle(a, rng) { return GC.shuffle(a, rng); }
  function wordTr(w) { return w.tr || RU.translit(w.ru); }
  function bare(s) { return String(s || '').replace(new RegExp('[' + ACUTE + ']', 'g'), ''); }

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
  function base(over) {
    var it = { kind: 'bukvy', play: 'choose', cefr: 'A1', bonus: 0, topic: 'bukvy', level: null, stage0: true };
    for (var k in over) it[k] = over[k];
    return it;
  }
  /* Letters that look or sound alike (the `fam` field) come first among the wrong options. */
  function distinctPick(L, pool, rng, valueOf, bad) {
    var cands = pool.filter(function (o) { return o.id !== L.id; });
    var near = L.fam ? cands.filter(function (o) { return o.fam === L.fam; }) : [];
    var rest = cands.filter(function (o) { return near.indexOf(o) === -1; });
    var out = [], seen = {};
    seen[valueOf(L)] = 1;
    shuffle(near, rng).concat(shuffle(rest, rng)).forEach(function (o) {
      var v = valueOf(o);
      if (out.length >= 3 || !v || seen[v] || (bad && bad(o))) return;
      seen[v] = 1; out.push(v);
    });
    return out.length === 3 ? out : null;
  }
  function sameSound(L) { return function (o) { return o.tr === L.tr; }; }
  function hasSound(l) { return l.id !== 'soft' && l.id !== 'hard' && !!l.tr; }

  function soundItem(L, pool, rng, hear) {
    if (!hasSound(L)) return null;
    var snd = pool.filter(hasSound);
    var say = { t: L.nm, v: 'ru' };
    var it;
    if (hear) {
      var wrong = distinctPick(L, snd, rng, function (o) { return o.ch; }, sameSound(L));
      if (!wrong) return null;
      it = base({ id: 'b:l:' + L.id, answer: L.ch, options: shuffle([L.ch].concat(wrong), rng), optRu: true, optBig: true,
        promptSay: say, say: say, note: L.name + ': ' + L.say, ru: L.ch, drill: 'letter', hear: true, prompt: '',
        hearLabel: 'Listen, then pick the letter', level: 'full' });
      return it;
    }
    var wr = distinctPick(L, snd, rng, function (o) { return o.tr; }, sameSound(L));
    if (!wr) return null;
    return base({ id: 'b:l:' + L.id, prompt: L.ch, pRu: true, pBig: true, level: 'full', sub: 'Which sound is it?',
      answer: L.tr, ansLatin: true, options: shuffle([L.tr].concat(wr), rng), optRu: false,
      promptSay: say, say: say, note: L.name + ': ' + L.say, ru: L.ch, drill: 'letter' });
  }
  /* A capital and its small letter: given one, pick the other. */
  function shapeItem(L, pool, rng) {
    var toSmall = rnd(rng) < 0.5;
    var from = toSmall ? L.up : L.ch, ans = toSmall ? L.ch : L.up;
    var wrong = distinctPick(L, pool, rng, function (o) { return toSmall ? o.ch : o.up; });
    if (!wrong) return null;
    return base({ id: 'b:s:' + L.id + ':' + (toSmall ? 's' : 'c'), prompt: from, pRu: true, pBig: true, level: 'full',
      sub: toSmall ? 'Which is the small letter?' : 'Which is the capital letter?',
      answer: ans, options: shuffle([ans].concat(wrong), rng), optRu: true, optBig: true,
      say: { t: L.nm, v: 'ru' }, note: L.up + ' ' + L.ch + ' (' + L.name + ')', ru: from, drill: 'shape' });
  }
  /* Hard and soft vowel pairs: the soft one adds a y or softens the consonant before it. */
  var PAIRS = [['а', 'я'], ['э', 'е'], ['о', 'ё'], ['у', 'ю'], ['ы', 'и']];
  function pairItem(pool, rng) {
    var have = {};
    pool.forEach(function (l) { have[l.ch] = l; });
    var pairs = PAIRS.filter(function (p) { return have[p[0]] && have[p[1]]; });
    var pr = pick(pairs, rng);
    if (!pr) return null;
    var toSoft = rnd(rng) < 0.7;
    var from = toSoft ? pr[0] : pr[1], ans = toSoft ? pr[1] : pr[0];
    var vowels = PAIRS.reduce(function (a, p) { return a.concat(p); }, []).filter(function (c) { return have[c] && c !== from && c !== ans; });
    var wrong = shuffle(vowels, rng).slice(0, 3);
    if (wrong.length < 3) return null;
    return base({ id: 'b:p:' + from + ans, prompt: from, pRu: true, pBig: true, level: 'full',
      sub: toSoft ? 'Which is its soft partner?' : 'Which is its hard partner?',
      answer: ans, options: shuffle([ans].concat(wrong), rng), optRu: true, optBig: true,
      say: { t: have[ans].nm, v: 'ru' }, note: pr[0] + ' and ' + pr[1] + ' are a pair: ' + pr[1] + ' is the soft one.', ru: from, drill: 'pair' });
  }
  /* Read a word, pick how it sounds. The wrong sounds are other lesson words. */
  function readItem(W, wordPool, rng) {
    var t = wordTr(W), ans = bare(W.ru);
    var cands = wordPool.filter(function (o) { return o !== W && wordTr(o) !== t && bare(o.ru) !== ans; });
    var near = cands.filter(function (o) { return Math.abs(bare(o.ru).length - ans.length) <= 2; });
    var out = [], seen = {};
    seen[t] = 1;
    shuffle(near, rng).concat(shuffle(cands, rng)).forEach(function (o) {
      var v = wordTr(o);
      if (out.length < 3 && !seen[v]) { seen[v] = 1; out.push(v); }
    });
    if (out.length < 3) return null;
    return base({ id: 'b:r:' + W.ru, prompt: W.ru, pRu: true, level: 'full', sub: 'How is it said?', answer: t, ansLatin: true,
      options: shuffle([t].concat(out), rng), optRu: false, promptSay: { t: W.ru, v: 'ru' }, say: { t: W.ru, v: 'ru' },
      note: bare(W.ru) + ' means ' + W.en, ru: W.ru, en: W.en, drill: 'read' });
  }
  function buildItem(W, pool, rng) {
    var target = bare(W.ru).replace(/ /g, '');
    if (target.length < 2 || target.length > 9) return null;
    var inWord = {};
    target.split('').forEach(function (c) { inWord[c.toLowerCase()] = 1; });
    var decoys = shuffle(pool.map(function (l) { return l.ch; }).filter(function (c) { return !inWord[c]; }), rng).slice(0, 2);
    if (decoys.length < 2) return null;
    return base({ id: 'b:b:' + W.ru, play: 'build', prompt: W.en, pSub: wordTr(W), answer: W.ru, accept: [W.ru], target: target,
      tiles: shuffle(target.split('').concat(decoys), rng), promptSay: { t: W.ru, v: 'ru' }, say: { t: W.ru, v: 'ru' },
      note: null, ru: W.ru, en: W.en, drill: 'build' });
  }
  /* Which vowel is stressed? The word is shown without its accent, each option puts it somewhere else. */
  function stressItem(W, rng, minVowels) {
    var w = bare(W.ru);
    if (/[\s-]/.test(w) || w.indexOf('ё') !== -1) return null;
    var at = RU.stressOf(W.ru);
    var vs = [], i;
    for (i = 0; i < w.length; i++) if ('аеиоуыэюя'.indexOf(w.charAt(i)) !== -1) vs.push(i);
    if (vs.length < (minVowels || 2) || at < 0) return null;
    function placed(ix) { return w.slice(0, ix + 1) + ACUTE + w.slice(ix + 1); }
    var wrongIx = shuffle(vs.filter(function (x) { return x !== at; }), rng).slice(0, 3);
    return base({ id: 'b:t:' + w, prompt: w, pRu: true, pBig: true, level: 'full', sub: 'Which vowel is stressed?',
      answer: placed(at), options: shuffle([placed(at)].concat(wrongIx.map(placed)), rng), optRu: true, optBig: true,
      say: { t: W.ru, v: 'ru' }, note: W.en + ': ' + wordTr(W), ru: W.ru, en: W.en, drill: 'stress' });
  }
  /* A word in italics, pick the same word in print. */
  function italicItem(W, wordPool, rng) {
    var ans = bare(W.ru);
    if (/\s/.test(ans)) return null;
    var cands = wordPool.filter(function (o) { var b = bare(o.ru); return b !== ans && !/\s/.test(b); });
    var shapes = /[тдипг]/;
    var near = cands.filter(function (o) { return shapes.test(bare(o.ru)) && Math.abs(bare(o.ru).length - ans.length) <= 2; });
    var out = [];
    shuffle(near, rng).concat(shuffle(cands, rng)).forEach(function (o) {
      var v = bare(o.ru);
      if (out.length < 3 && out.indexOf(v) === -1) out.push(v);
    });
    if (out.length < 3) return null;
    return base({ id: 'b:i:' + ans, prompt: ans, pRu: true, pItalic: true, level: 'bare', sub: 'Which word is this in print?',
      answer: ans, options: shuffle([ans].concat(out), rng), optRu: true, optBig: true,
      say: { t: W.ru, v: 'ru' }, note: 'In print: ' + ans + ', ' + W.en, ru: ans, en: W.en, drill: 'italic' });
  }

  var LETTER_KINDS = ['sound', 'hear', 'shape'];
  /* One item of a kind. L: a letter, W: a word, pool: the letters in play, wordPool: the words in play. */
  function make(kind, L, W, pool, wordPool, rng) {
    var it = null;
    if (kind === 'hear' && L && !RU.has(L.nm)) kind = 'sound';
    if (kind === 'sound' || kind === 'hear') it = L && soundItem(L, pool, rng, kind === 'hear');
    else if (kind === 'shape') it = L && shapeItem(L, pool, rng);
    else if (kind === 'pair') it = pairItem(pool, rng);
    else if (kind === 'read') it = W && readItem(W, wordPool, rng);
    else if (kind === 'build') it = W && buildItem(W, pool, rng);
    else if (kind === 'stress') it = W && stressItem(W, rng, wordPool.exam ? 3 : 2);
    else if (kind === 'italic') it = W && italicItem(W, wordPool, rng);
    return it;
  }

  // ---- a lesson round --------------------------------------------------------------------
  function lettersOf(n) {
    var L = lessonN(n);
    return letters().filter(function (l) { return L && L.letters.indexOf(l.id) !== -1; });
  }
  function poolOf(n) { return letters().filter(function (l) { return l.lesson <= n; }); }
  function earlierOf(n) { return letters().filter(function (l) { return l.lesson < n; }); }
  function wordsUpTo(n) {
    var out = [];
    lessons().forEach(function (l) { if (l.n <= n) l.words.forEach(function (w) { out.push(w); }); });
    return out;
  }

  function lessonDealer(n) {
    var L = lessonN(n), pool = poolOf(n), earlier = earlierOf(n);
    var mine = lettersOf(n);
    var targets = mine.length ? mine : earlier;
    var words = (L && L.words) || [];
    var wordPool = wordsUpTo(n);
    var li = 0, wi = 0, ki = 0;
    var lo = null, wo = null;
    return function (rng) {
      for (var tries = 0; tries < 16; tries++) {
        var it = null;
        if (earlier.length && mine.length && rnd(rng) < 0.25) {
          // an earlier letter, in a letter kind
          it = make(pick(LETTER_KINDS, rng), pick(earlier, rng), null, pool, wordPool, rng);
        } else {
          var kind = L.kinds[ki++ % L.kinds.length];
          var letter = null, word = null;
          if (LETTER_KINDS.indexOf(kind) !== -1) {
            if (!lo || li >= lo.length) { lo = shuffle(targets, rng); li = 0; }
            letter = lo[li++];
          } else if (kind !== 'pair') {
            if (!wo || wi >= wo.length) { wo = shuffle(words, rng); wi = 0; }
            word = wo[wi++];
          }
          it = make(kind, letter, word, pool, wordPool, rng);
        }
        if (it) { lastItem = it; return it; }
      }
      return null;
    };
  }

  // ---- the exit test -------------------------------------------------------------------------
  function examItems(rng) {
    var all = letters(), pool = all;
    var words = wordsUpTo(99);
    var wordPool = words.slice();
    wordPool.exam = true;
    var kinds = ['sound', 'hear', 'shape', 'pair', 'read', 'build', 'stress', 'italic'];
    var out = [], used = {}, li = 0, wi = 0, lo = shuffle(all, rng), wo = shuffle(words, rng), ki = 0, guard = 0;
    while (out.length < EXAM && guard++ < 800) {
      var kind = kinds[ki++ % kinds.length];
      var L = lo[li++ % lo.length], W = wo[wi++ % wo.length];
      var it = make(kind, L, W, pool, wordPool, rng);
      if (!it) continue;
      var key = (it.prompt || '') + '|' + (it.ru || it.answer || '') + (it.hear ? 'h' : '');   // what the round engine calls a repeat
      if (used[key]) continue;
      used[key] = 1;
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
    var w = el('div', 'arc-stats arc-bukvy');
    w.style.setProperty('--g', HUE);
    return w;
  }
  function show(w) { var h = host(); clear(h); h.appendChild(w); }

  function strandHead(en, ru, tr) {
    var h = el('div', 'sp-strand');
    h.appendChild(el('b', null, en));
    h.appendChild(UI.ru(ru));
    h.appendChild(el('span', 'tr', tr));
    return h;
  }
  var NAME = { en: 'Letters', ru: 'Бу́квы', tr: 'Búkvy' };

  function firstOpen() {
    var w = el('div', 'arc arc-first');
    var brand = el('div', 'arc-first-brand');
    brand.appendChild(UI.ru('Свобо́дно', 'big'));
    brand.appendChild(el('div', 'arc-brand', 'Svobodno'));
    w.appendChild(brand);
    w.appendChild(el('p', 'arc-sub', 'You can start speaking Russian now, and learn the letters alongside. The games open when you pass the letters test.'));
    if (window.RUSpeak) window.RUSpeak.section(w, true);
    w.appendChild(strandHead(NAME.en, NAME.ru, NAME.tr));
    var b1 = button('arc-mode on', null, function () { load().started = true; save(); nav.push('card'); lessonCard(1); });
    b1.appendChild(el('b', null, 'I\'m new to Cyrillic'));
    b1.appendChild(el('span', null, 'Start with lesson 1: the first letters'));
    var b2 = button('arc-mode', null, function () { load().started = true; save(); nav.push('exam'); examIntro(); });
    b2.appendChild(el('b', null, 'I can read Russian'));
    b2.appendChild(el('span', null, 'Take the exit test: ' + EXAM + ' questions, ' + EXAM_PASS + ' to open the games'));
    var row = el('div', 'arc-modes');
    row.appendChild(b1); row.appendChild(b2);
    w.appendChild(row);
    show(w);
  }

  function path() {
    var open = unlocked();
    var w = wrapEl();
    w.appendChild(top(open ? 'Letters' : 'Svobodno', open ? nav.board : null));
    if (!open && window.RUSpeak) {
      window.RUSpeak.section(w, false);
      w.appendChild(strandHead(NAME.en, NAME.ru, NAME.tr));
    }
    w.appendChild(el('p', 'arc-sub', open
      ? 'The Cyrillic course. Lessons stay open for review.'
      : 'Seven lessons. Pass each round with 8 of 10 to open the next. Pass the exit test to open the games.'));
    var list = el('div', 'arc-picks');
    lessons().forEach(function (l) {
      var ok = lessonOpen(l.n), done = lessonDone(l.n);
      var b = el('button', 'arc-pick' + (done ? ' on' : ''));
      b.type = 'button';
      b.disabled = !ok;
      var t = el('b', null, l.n + '  ');
      t.appendChild(UI.ru(l.title));
      b.appendChild(t);
      b.appendChild(el('span', null, l.en + (done ? ' · passed' : ok ? '' : ' · locked')));
      b.addEventListener('click', function () { nav.push('card'); lessonCard(l.n); });
      list.appendChild(b);
    });
    w.appendChild(list);
    if (window.RU_CARDS && window.RU_CARDS.stress) {
      w.appendChild(button('arc-wtbtn', 'Read about stress', function () { if (window.RUArcade) window.RUArcade.cardScreen('stress'); }));
    }
    if (open) {
      w.appendChild(button('arc-wtbtn', 'Review the letters and words (10 questions)', function () { reviewRound(); }));
    }
    w.appendChild(button('arc-wtbtn', open ? 'Take the exit test again' : 'Skip to the exit test', function () { nav.push('exam'); examIntro(); }));
    show(w);
  }

  function letterCard(L) {
    var c = el('div', 'hr-letter');
    var head = el('div', 'hr-letter-head');
    head.appendChild(UI.ru(L.up + ' ' + L.ch, 'hr-big'));
    var meta = el('div', 'hr-meta');
    meta.appendChild(el('b', null, L.name));
    if (L.tr && hasSound(L)) meta.appendChild(UI.tr(L.tr, 'block'));
    head.appendChild(meta);
    var sp = UI.speaker(L.nm, 'ru');
    if (sp) head.appendChild(sp);
    c.appendChild(head);
    c.appendChild(el('p', 'hr-say', L.say));
    return c;
  }

  function lessonCard(n) {
    var L = lessonN(n);
    if (!L) { path(); return; }
    var w = wrapEl();
    var t = top('Lesson ' + n, function () { nav.back(); });
    w.appendChild(t);
    var title = el('div', 'hr-title');
    title.appendChild(UI.ru(L.title, 'big'));
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
        r.appendChild(UI.ru(x.ru, 'big'));
        var m = el('span', 'hr-wmeta');
        m.appendChild(UI.tr(wordTr(x)));
        m.appendChild(el('span', 'hr-wen', x.en));
        r.appendChild(m);
        var sp = UI.speaker(x.ru, 'ru');
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
      key: 'bukvy:t', title: 'Letters ' + n, kind: 'bukvy', hue: HUE, count: ROUND, duration: null,
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
      key: 'bukvy:t', title: 'Letters review', kind: 'bukvy', hue: HUE, count: ROUND, duration: null,
      draw: function (rng) { return pools[k++ % pools.length](rng) || deal(rng); },
      again: reviewRound, onExit: function () { path(); }
    });
  }

  function examIntro() {
    var w = wrapEl();
    w.appendChild(top('Exit test', function () { nav.back(); }));
    w.appendChild(el('p', 'arc-sub', EXAM + ' questions over every kind: sounds, shapes, reading, spelling and stress. Get ' + EXAM_PASS + ' right and the games open. ' + EXAM_A2 + ' or more starts you at A2.'));
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
      key: 'bukvy:x', title: 'Exit test', kind: 'bukvy', hue: HUE, count: EXAM, duration: null,
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
    if (window.RUSpeak) window.RUSpeak.init({ board: o.board, push: o.push, back: o.back, round: o.round, leave: function () { if (unlocked()) window.RUSpeak.home(); else path(); } });
  }

  return {
    init: init, state: state, unlocked: unlocked, started: started, lessonOpen: lessonOpen, lessonDone: lessonDone,
    firstOpen: firstOpen, path: path, markStarted: markStarted, lessonCard: lessonCard, startLessonRound: startLessonRound,
    reviewRound: reviewRound, examIntro: examIntro, startExam: startExam,
    lessonDealer: lessonDealer, examItems: examItems, make: make, PASS: PASS, EXAM: EXAM, EXAM_PASS: EXAM_PASS, EXAM_A2: EXAM_A2,
    NAME: NAME, last: function () { return lastItem; }, _reset: _reset, HUE: HUE
  };
})();
