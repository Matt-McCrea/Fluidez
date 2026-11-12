/* ============================================================================
 * AR SPEAK: the second strand of stage 0, beside the script course (ar-huruf.js).
 * A learner can start speaking on the very first open, before any letter.
 *
 * Ten packs from data/speak.js (window.AR_SPEAK), each a few everyday phrases from
 * window.AR_PHRASES and a short dialogue. A pack opens with a card (the sound in
 * transliteration as the main line, the script smaller above it, the English, a
 * speaker), then a ten item round of four kinds:
 *   pick   English shown, pick the phrase (options in transliteration)
 *   build  English shown, tap the transliteration words in order
 *   say    English shown; say it aloud, listen, mark yourself. SELF-MARKED: it never
 *          counts toward passing and never touches the SRS (gameround.js item.self)
 * Eight in ten of the auto-graded items passes the pack, which opens the next.
 * SRS ids are 'sp:<phrase id>:<variety>'. Progress is kept in talaqa.speak.
 *
 * TO REUSE FOR ANOTHER LANGUAGE: only the "language bits" below are Arabic specific
 * (the text of a phrase in a variety, its transliteration, its clip, the variety
 * choice and the labels). Everything after them is language neutral.
 * ========================================================================== */
window.ARSpeak = (function () {
  var UI = window.UI, AR = window.AR, GC = window.ARCore;
  var KEY = 'talaqa.speak';
  var ROUND = 10, PASS_FRAC = 0.8;
  var HUE = '#e07a3f';
  var KINDS = ['pick', 'say', 'pick', 'build', 'pick', 'say', 'build', 'pick', 'build', 'pick'];

  // ---- the language bits (Arabic) ---------------------------------------------------------
  var NAME = { en: 'Speak', ar: 'تَكَلَّم', tr: 'Takallam' };
  var VARIETY_KEY = 'talaqa.arcade';                    // the Ibarat sheet keeps the variety here, as .pv
  var VARIETIES = [['msa', 'Fuṣḥā'], ['lev', 'Shāmī'], ['egy', 'Maṣrī']];
  var VARIETY_HELP = 'Shāmī is spoken in Syria, Lebanon, Jordan and Palestine. Maṣrī is Egyptian. Fuṣḥā is formal, for writing and news.';
  var DEFAULT_VARIETY = 'lev';
  /* The variety to speak: the Ibarat sheet's choice. 'all' or nothing means shāmī. */
  function variety() {
    var v;
    try { v = (JSON.parse(localStorage.getItem(VARIETY_KEY)) || {}).pv; } catch (e) { v = null; }
    return (v === 'msa' || v === 'lev' || v === 'egy') ? v : DEFAULT_VARIETY;
  }
  function setVariety(v) {
    var o;
    try { o = JSON.parse(localStorage.getItem(VARIETY_KEY)) || {}; } catch (e) { o = {}; }
    o.pv = v;
    try { localStorage.setItem(VARIETY_KEY, JSON.stringify(o)); } catch (e) {}
  }
  /* The text of a phrase in a variety (an empty one means the same as fuṣḥā). */
  function textOf(p, v) { return (p[v] && String(p[v]).trim()) || p.msa; }
  /* Its transliteration: the hand-written one, else the machine one. */
  function trOf(p, v) {
    var t = p.tr && (p.tr[v] || (!(p[v] && String(p[v]).trim()) ? p.tr.msa : ''));
    return t || AR.translit(textOf(p, v));
  }
  /* The clip to play: this text in this variety, else the fuṣḥā text, else none. */
  function clip(p, v) {
    var t = textOf(p, v);
    if (AR.has(t, v)) return { t: t, v: v };
    if (AR.has(p.msa, 'msa')) return { t: p.msa, v: 'msa' };
    return null;
  }
  function same(a, b) { return AR.strip(a) === AR.strip(b); }
  function scriptNode(text, cls) { return UI.ar(text, cls); }

  // ---- small helpers -------------------------------------------------------------------------
  var host = function () { return document.getElementById('stage-host'); };
  var nav = { board: function () {}, push: function () {}, back: function () {}, round: function () {}, leave: null };
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
  function rnd(rng) { return (rng || Math.random)(); }
  function shuffle(a, rng) { return GC.shuffle(a, rng); }
  function show(w) { var h = host(); clear(h); h.appendChild(w); }
  function wrapEl() {
    var w = el('div', 'arc-stats arc-speak');
    w.style.setProperty('--g', HUE);
    return w;
  }
  function top(title, onBack) {
    var t = el('div', 'arc-stats-top');
    if (onBack) t.appendChild(button('arc-back', '←', onBack));
    t.appendChild(el('h2', null, title));
    return t;
  }
  function strandHead(en, ar, tr) {
    var h = el('div', 'sp-strand');
    h.appendChild(el('b', null, en));
    h.appendChild(UI.ar(ar));
    h.appendChild(el('span', 'tr', tr));
    return h;
  }

  // ---- the data -------------------------------------------------------------------------------------
  var IDX = null, IDX_N = -1, IDX_SRC = null, lastItem = null;
  function phrases() {
    var src = window.AR_PHRASES || [];
    if (IDX && IDX_SRC === src && IDX_N === src.length) return IDX;
    IDX = {}; IDX_N = src.length; IDX_SRC = src;
    src.forEach(function (p) { if (p && p.id) IDX[p.id] = p; });
    return IDX;
  }
  function packs() { return window.AR_SPEAK || []; }
  function packN(n) { return packs().filter(function (k) { return k.n === n; })[0] || null; }
  function phraseOf(id) { return phrases()[id] || null; }
  function packPhrases(pack) { return pack.ids.map(phraseOf).filter(Boolean); }

  // ---- progress (talaqa.speak) ------------------------------------------------------------------------
  var mem = null;
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { mem = {}; }
    mem.passed = mem.passed || {};
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem || {})); } catch (e) {} }
  function packDone(n) { return !!load().passed[n]; }
  function packOpen(n) { return n === 1 || packDone(n - 1); }
  function _reset() { mem = null; }
  function markStarted() { if (window.ARHuruf && window.ARHuruf.markStarted) window.ARHuruf.markStarted(); }

  // ---- the items ------------------------------------------------------------------------------------------
  function base(pack, p, v, over) {
    var it = { kind: 'speak', play: 'choose', cefr: p.b || 'A1', bonus: 0, topic: 'speak', level: 'full', variety: null,
      note: p.n || null, en: p.en, speakPack: pack.n, speakKind: null };
    for (var k in over) it[k] = over[k];
    return it;
  }
  /* The ids to draw wrong options from: the same pack first, then earlier packs, then the rest. */
  function tiers(pack) {
    var t = [pack.ids.slice()];
    for (var n = pack.n - 1; n >= 1; n--) { var k = packN(n); if (k) t.push(k.ids.slice()); }
    var rest = [];
    packs().forEach(function (k) { if (k.n > pack.n) rest = rest.concat(k.ids); });
    t.push(rest);
    return t;
  }
  /* Three wrong phrases: nothing with the same English, the same sound or the same script as the right one
   * or as each other. `skip` lists phrase ids that must not appear. */
  function wrongOnes(pack, answerIds, v, rng, skip) {
    var want = answerIds.map(phraseOf).filter(Boolean);
    var out = [];
    function clash(o) {
      if (skip.indexOf(o.id) !== -1) return true;
      var list = want.concat(out);
      for (var i = 0; i < list.length; i++) {
        var q = list[i];
        if (q.id === o.id || q.en.toLowerCase() === o.en.toLowerCase() || trOf(q, v) === trOf(o, v) || same(textOf(q, v), textOf(o, v))) return true;
      }
      return false;
    }
    var seen = {};
    tiers(pack).forEach(function (ids) {
      shuffle(ids.filter(function (id) { if (seen[id]) return false; seen[id] = 1; return true; }), rng).forEach(function (id) {
        var o = phraseOf(id);
        if (out.length < 3 && o && !clash(o)) out.push(o);
      });
    });
    return out.length === 3 ? out : null;
  }
  function scriptMap(list, v) {
    var m = {};
    list.forEach(function (p) { m[trOf(p, v)] = textOf(p, v); });
    return m;
  }
  /* `ar` only makes the round's repeat guard see two kinds on one phrase as different prompts. */
  function keyed(kind, text) { return text + ' (' + kind + ')'; }

  function pickItem(pack, p, v, rng) {
    var wrong = wrongOnes(pack, [p.id], v, rng, []);
    if (!wrong) return null;
    var tr = trOf(p, v), all = [p].concat(wrong);
    return base(pack, p, v, { id: 'sp:' + p.id + ':' + v, speakKind: 'pick', prompt: p.en, answer: tr, ansLatin: true,
      options: shuffle(all.map(function (q) { return trOf(q, v); }), rng), optScript: scriptMap(all, v),
      say: clip(p, v), ar: textOf(p, v), key: keyed('pick', textOf(p, v)) });
  }
  function buildItem(pack, p, v, rng) {
    var tr = trOf(p, v), words = tr.replace(/\s+/g, ' ').trim().split(' ');
    if (words.length < 2 || words.length > 7) return null;
    return base(pack, p, v, { id: 'sp:' + p.id + ':' + v, speakKind: 'build', play: 'build', latin: true, prompt: p.en,
      words: words, answer: words.join(' '), accept: [words.join(' ')], reveal: tr,
      say: clip(p, v), ar: textOf(p, v), key: keyed('build', textOf(p, v)) });
  }
  function sayItem(pack, p, v) {
    return base(pack, p, v, { id: null, speakKind: 'say', play: 'say', self: true, prompt: p.en, answer: trOf(p, v),
      trAnswer: trOf(p, v), sayAr: textOf(p, v), say: clip(p, v), ar: textOf(p, v), key: keyed('say', textOf(p, v)) });
  }

  /* The ten items of one pack round, in the mix of KINDS. A kind that cannot be made falls back to a pick. */
  function packItems(n, v, rng) {
    var pack = packN(n);
    if (!pack) return [];
    var list = packPhrases(pack);
    if (!list.length) return [];
    var order = [], out = [], last = null;
    function nextPhrase() {
      if (!order.length) order = shuffle(list.slice(), rng);
      var p = order.shift();
      if (p === last && order.length) { order.push(p); p = order.shift(); }
      last = p;
      return p;
    }
    var used = {};
    function keyOf(it) { if (it.key) return it.key; return (it.prompt || '') + '|' + (it.ar || it.answer || ''); }
    function make(kind, p) {
      var it = null;
      if (kind === 'build') it = buildItem(pack, p, v, rng);
      else if (kind === 'say') it = sayItem(pack, p, v);
      else it = pickItem(pack, p, v, rng);
      return it && !used[keyOf(it)] ? it : null;
    }
    for (var k = 0; k < ROUND; k++) {
      var kind = KINDS[k % KINDS.length], it = null;
      // the round engine refuses a repeated prompt, so every item of the plan must be new
      for (var tries = 0; tries < list.length * 2 && !it; tries++) it = make(kind, nextPhrase());
      for (tries = 0; tries < list.length * 2 && !it; tries++) it = make('pick', nextPhrase());
      for (tries = 0; tries < list.length * 2 && !it; tries++) it = make('say', nextPhrase());
      if (!it) continue;
      used[keyOf(it)] = 1;
      out.push(it);
    }
    return out;
  }
  function dealer(n, v) {
    var items = packItems(n, v), i = 0;
    return function () { return items[i++] || null; };
  }

  // ---- screens ---------------------------------------------------------------------------------------------
  function packRow(k) {
    var open = packOpen(k.n), done = packDone(k.n);
    var b = el('button', 'arc-pick' + (done ? ' on' : ''));
    b.type = 'button';
    b.disabled = !open;
    var t = el('b', null, k.n + '  ');
    t.appendChild(document.createTextNode(k.en));
    b.appendChild(t);
    b.appendChild(el('span', null, done ? 'passed' : open ? 'open' : 'locked: pass pack ' + (k.n - 1) + ' first'));
    b.addEventListener('click', function () { nav.push('card'); packCard(k.n); });
    return b;
  }
  /* The Speak strand, for the stage-0 home. compact: just the pack to do next (the first open). */
  function section(parent, compact) {
    parent.appendChild(strandHead(NAME.en, NAME.ar, NAME.tr));
    var all = packs();
    if (!all.length) { parent.appendChild(el('p', 'arc-sub', 'The speaking packs are not here yet.')); return; }
    if (compact) {
      var nextK = all.filter(function (k) { return !packDone(k.n); })[0] || all[0];
      var b = el('button', 'arc-mode on');
      b.type = 'button';
      b.appendChild(el('b', null, 'Start speaking'));
      b.appendChild(el('span', null, 'Pack ' + nextK.n + ': ' + nextK.en));
      b.addEventListener('click', function () { nav.push('card'); packCard(nextK.n); });
      var row = el('div', 'arc-modes sp-modes');
      row.appendChild(b);
      parent.appendChild(row);
      return;
    }
    var list = el('div', 'arc-picks');
    all.forEach(function (k) { list.appendChild(packRow(k)); });
    parent.appendChild(list);
  }
  /* The Speak screen reached from the board once the games are open. */
  function home() {
    var w = wrapEl();
    w.appendChild(top(NAME.en, function () { nav.board(); }));
    w.appendChild(el('p', 'arc-sub', 'Short packs of everyday phrases. Pass a pack to open the next.'));
    section(w, false);
    if (window.ARConvo) window.ARConvo.section(w, null, home);
    show(w);
  }

  function leave() { if (nav.leave) nav.leave(); else home(); }

  // ---- Talk and Script: the two sides of the app, switchable at any time (talaqa.mode) ------------------------
  var MODE_KEY = 'talaqa.mode';
  /* 'talk' (the default) or 'script'. */
  function mode() {
    var m;
    try { m = localStorage.getItem(MODE_KEY); } catch (e) { m = null; }
    return m === 'script' ? 'script' : 'talk';
  }
  function setMode(m) { try { localStorage.setItem(MODE_KEY, m === 'script' ? 'script' : 'talk'); } catch (e) {} }
  /* The two-part control at the top of every home. */
  function modeToggle() {
    var seg = el('div', 'arc-seg');
    seg.setAttribute('role', 'group');
    seg.setAttribute('aria-label', 'Talk or Script');
    var cur = mode();
    [['talk', 'Talk', 'تَكَلَّم'], ['script', 'Script', 'حُرُوف']].forEach(function (x) {
      var b = el('button', 'arc-seg-b' + (x[0] === cur ? ' on' : ''));
      b.type = 'button';
      b.setAttribute('data-mode', x[0]);
      b.appendChild(el('b', null, x[1]));
      b.appendChild(UI.ar(x[2]));
      b.addEventListener('click', function () {
        if (x[0] !== mode()) { setMode(x[0]); nav.board(); }
      });
      seg.appendChild(b);
    });
    return seg;
  }
  /* The topic focus the phrase sheet keeps (talaqa.arcade .focus): theme ids, or none for all. */
  function focus() {
    var f;
    try { f = (JSON.parse(localStorage.getItem(VARIETY_KEY)) || {}).focus; } catch (e) { f = null; }
    return Array.isArray(f) ? f : [];
  }
  /* The Talk home: the speaking side, before and after the letters test. */
  function talkHome() {
    var H = window.ARHuruf;
    var w = el('div', 'arc arc-first arc-talk');
    w.appendChild(modeToggle());
    var brand = el('div', 'arc-first-brand');
    brand.appendChild(UI.ar('طَلَاقَة', 'big'));
    brand.appendChild(el('div', 'arc-brand', 'Ṭalāqa'));
    w.appendChild(brand);
    w.appendChild(el('p', 'arc-sub', H && H.unlocked()
      ? 'Talk: packs, conversations and phrases, led by the sound. Switch to Script for the games and the letters.'
      : 'You can start speaking Arabic now, and learn the letters alongside. Switch to Script for the letters. The games open when you pass the letters test.'));
    section(w, false);
    if (window.ARConvo) window.ARConvo.section(w, focus(), function () { nav.board(); });
    var books = window.AR_PHRASES || [];
    if (books.length && window.ARArcade && window.ARArcade.practisePhrases) {
      w.appendChild(strandHead('Phrases', 'عِبَارَات', 'ʿIbārāt'));
      var f = focus(), labels = window.ARArcade.themeLabels ? f.map(window.ARArcade.themeLabels) : f;
      var b = el('button', 'arc-mode on');
      b.type = 'button';
      b.appendChild(el('b', null, 'Practise phrases'));
      b.appendChild(el('span', null, f.length ? 'Topics: ' + labels.join(', ') : 'All topics'));
      b.addEventListener('click', function () { window.ARArcade.practisePhrases(); });
      var row = el('div', 'arc-modes sp-modes');
      row.appendChild(b);
      w.appendChild(row);
    }
    show(w);
  }

  function packCard(n) {
    var pack = packN(n);
    if (!pack) { leave(); return; }
    var w = wrapEl();
    w.appendChild(top('Pack ' + n, function () { nav.back(); }));
    w.appendChild(el('p', 'arc-sub', pack.en));
    var chooser = el('div', 'sp-choose');
    var chips = el('div', 'arc-chips');
    var cards = el('div', 'sp-cards');
    function paint() {
      var v = variety();
      clear(chips); clear(cards);
      VARIETIES.forEach(function (x) {
        chips.appendChild(button('arc-chip' + (x[0] === v ? ' on' : ''), x[1], function () { setVariety(x[0]); paint(); }));
      });
      packPhrases(pack).forEach(function (p) {
        var c = el('div', 'sp-card');
        var main = el('div', 'sp-main');
        main.appendChild(scriptNode(textOf(p, v), 'sp-ar'));
        main.appendChild(el('div', 'sp-tr', trOf(p, v)));
        main.appendChild(el('div', 'sp-en', p.en));
        c.appendChild(main);
        var cl = clip(p, v);
        var sp = cl && UI.speaker(cl.t, cl.v);
        if (sp) c.appendChild(sp);
        if (p.n) c.appendChild(UI.rich(el('p', 'sp-note'), p.n));
        cards.appendChild(c);
      });
    }
    chooser.appendChild(el('div', 'arc-group', 'How do you want to speak?'));
    chooser.appendChild(chips);
    chooser.appendChild(el('p', 'sp-help', VARIETY_HELP));
    w.appendChild(chooser);
    w.appendChild(el('div', 'arc-group', 'The phrases'));
    w.appendChild(cards);
    var go = el('button', 'arc-mode on hr-start');
    go.type = 'button';
    go.appendChild(el('b', null, 'Start'));
    go.appendChild(el('span', null, '10 questions, 80% right to pass'));
    go.addEventListener('click', function () { startRound(n); });
    var modes = el('div', 'arc-modes');
    modes.appendChild(go);
    w.appendChild(modes);
    paint();
    show(w);
  }

  function startRound(n) {
    var pack = packN(n);
    if (!pack) return;
    markStarted();
    var v = variety();
    var deal = dealer(n, v);
    var graded = 0, right = 0;
    if (nav.round) nav.round();
    window.GameRound.run(host(), {
      key: 'speak:' + n, title: 'Speak ' + n, kind: 'speak', hue: HUE, count: ROUND, duration: null,
      draw: function () { lastItem = deal(); return lastItem; },
      onResolve: function (item, result) {
        if (item.self) return;                         // self-marked: never counted
        graded++;
        if (result !== 'wrong') right++;
      },
      againLabel: 'Try again', again: function () { startRound(n); },
      onExit: function () { leave(); },
      onFinish: function () {
        var need = Math.ceil(graded * PASS_FRAC - 1e-9);
        var ok = graded > 0 && right >= need;
        var box = el('div', 'hr-result');
        if (ok) {
          load().passed[n] = true; save();
          box.appendChild(el('div', 'g-over-verdict pb', 'Pack ' + n + ' passed: ' + right + ' of ' + graded));
          if (packN(n + 1)) box.appendChild(button('arc-btn on', 'Next pack →', function () { nav.push('card'); packCard(n + 1); }));
          else box.appendChild(button('arc-btn on', 'Back to the packs', function () { leave(); }));
        } else {
          box.appendChild(el('div', 'g-over-verdict', right + ' of ' + graded + ' right. ' + need + ' are needed to pass.'));
          box.appendChild(button('arc-btn', 'Read the pack again', function () { nav.push('card'); packCard(n); }));
        }
        return box;
      }
    });
  }

  function init(o) { for (var k in o) nav[k] = o[k]; }

  return {
    init: init, nav: function () { return nav; }, mode: mode, setMode: setMode, modeToggle: modeToggle, talkHome: talkHome, focus: focus, packs: packs, packOpen: packOpen, packDone: packDone, section: section, home: home, packCard: packCard,
    startRound: startRound, packItems: packItems, variety: variety, setVariety: setVariety, trOf: trOf, textOf: textOf,
    clip: clip, state: load, last: function () { return lastItem; }, ROUND: ROUND, PASS_FRAC: PASS_FRAC, NAME: NAME, HUE: HUE, _reset: _reset
  };
})();
