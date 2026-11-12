/* ============================================================================
 * RU SPEAK: the second strand of stage 0, beside the Cyrillic course (ru-bukvy.js).
 * A learner can start speaking on the very first open, before any letter.
 *
 * Ten packs from data/speak.js (window.RU_SPEAK), each a few everyday phrases from
 * window.RU_PHRASES and a short dialogue. A pack opens with a card (the sound in
 * transliteration as the main line, the Cyrillic smaller above it, the English, a
 * speaker), then a ten item round of four kinds:
 *   pick   English shown, pick the phrase (options in transliteration)
 *   build  English shown, tap the transliteration words in order
 *   say    English shown; say it aloud, listen, mark yourself. SELF-MARKED: it never
 *          counts toward passing and never touches the SRS (gameround.js item.self)
 * Eight in ten of the auto-graded items passes the pack, which opens the next.
 * SRS ids are 'sp:<phrase id>'. Progress is kept in svobodno.speak.
 *
 * Ported from ar-speak.js with one variety: only the "language bits" below are
 * Russian specific.
 * ========================================================================== */
window.RUSpeak = (function () {
  var UI = window.UI, RU = window.RU, GC = window.RUCore;
  var KEY = 'svobodno.speak';
  var ARC_KEY = 'svobodno.arcade';
  var ROUND = 10, PASS_FRAC = 0.8;
  var HUE = '#2fb3a5';
  var KINDS = ['pick', 'say', 'pick', 'build', 'pick', 'say', 'build', 'pick', 'build', 'pick'];

  // ---- the language bits (Russian) ---------------------------------------------------------
  var NAME = { en: 'Speak', ru: 'Говори́ть', tr: 'Govorít' };
  /* The text of a phrase, with its stress marks. */
  function textOf(p) { return String(p.ru || '').trim(); }
  /* Its transliteration: the hand-written one, else the machine one. */
  function trOf(p) { return p.tr || RU.translit(textOf(p)); }
  /* The clip to play, else none. */
  function clip(p) {
    var t = textOf(p);
    return RU.has(t) ? { t: t, v: 'ru' } : null;
  }
  function same(a, b) { return RU.strip(a) === RU.strip(b); }
  function scriptNode(text, cls) { return UI.ru(text, cls); }

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
  function strandHead(en, ru, tr) {
    var h = el('div', 'sp-strand');
    h.appendChild(el('b', null, en));
    h.appendChild(UI.ru(ru));
    h.appendChild(el('span', 'tr', tr));
    return h;
  }

  // ---- the data -------------------------------------------------------------------------------------
  var IDX = null, IDX_N = -1, IDX_SRC = null, lastItem = null;
  function phrases() {
    var src = window.RU_PHRASES || [];
    if (IDX && IDX_SRC === src && IDX_N === src.length) return IDX;
    IDX = {}; IDX_N = src.length; IDX_SRC = src;
    src.forEach(function (p) { if (p && p.id) IDX[p.id] = p; });
    return IDX;
  }
  function packs() { return window.RU_SPEAK || []; }
  function packN(n) { return packs().filter(function (k) { return k.n === n; })[0] || null; }
  function phraseOf(id) { return phrases()[id] || null; }
  function packPhrases(pack) { return pack.ids.map(phraseOf).filter(Boolean); }

  // ---- progress (svobodno.speak) ------------------------------------------------------------------------
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
  function markStarted() { if (window.RUBukvy && window.RUBukvy.markStarted) window.RUBukvy.markStarted(); }

  // ---- the items ------------------------------------------------------------------------------------------
  function base(pack, p, over) {
    var it = { kind: 'speak', play: 'choose', cefr: p.b || 'A1', bonus: 0, topic: 'speak', level: 'full',
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
  function wrongOnes(pack, answerIds, rng, skip) {
    var want = answerIds.map(phraseOf).filter(Boolean);
    var out = [];
    function clash(o) {
      if (skip.indexOf(o.id) !== -1) return true;
      var list = want.concat(out);
      for (var i = 0; i < list.length; i++) {
        var q = list[i];
        if (q.id === o.id || q.en.toLowerCase() === o.en.toLowerCase() || trOf(q) === trOf(o) || same(textOf(q), textOf(o))) return true;
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
  function scriptMap(list) {
    var m = {};
    list.forEach(function (p) { m[trOf(p)] = textOf(p); });
    return m;
  }
  /* `ru` only makes the round's repeat guard see two kinds on one phrase as different prompts. */
  function keyed(kind, text) { return text + ' (' + kind + ')'; }

  function pickItem(pack, p, rng) {
    var wrong = wrongOnes(pack, [p.id], rng, []);
    if (!wrong) return null;
    var tr = trOf(p), all = [p].concat(wrong);
    return base(pack, p, { id: 'sp:' + p.id, speakKind: 'pick', prompt: p.en, answer: tr, ansLatin: true,
      options: shuffle(all.map(function (q) { return trOf(q); }), rng), optScript: scriptMap(all),
      say: clip(p), ru: textOf(p), key: keyed('pick', textOf(p)) });
  }
  function buildItem(pack, p, rng) {
    var tr = trOf(p), words = tr.replace(/\s+/g, ' ').trim().split(' ');
    if (words.length < 2 || words.length > 7) return null;
    return base(pack, p, { id: 'sp:' + p.id, speakKind: 'build', play: 'build', latin: true, prompt: p.en,
      words: words, answer: words.join(' '), accept: [words.join(' ')], reveal: tr,
      say: clip(p), ru: textOf(p), key: keyed('build', textOf(p)) });
  }
  function sayItem(pack, p) {
    return base(pack, p, { id: null, speakKind: 'say', play: 'say', self: true, prompt: p.en, answer: trOf(p),
      trAnswer: trOf(p), sayRu: textOf(p), say: clip(p), ru: textOf(p), key: keyed('say', textOf(p)) });
  }

  /* The ten items of one pack round, in the mix of KINDS. A kind that cannot be made falls back to a pick. */
  function packItems(n, rng) {
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
    function keyOf(it) { if (it.key) return it.key; return (it.prompt || '') + '|' + (it.ru || it.answer || ''); }
    function make(kind, p) {
      var it = null;
      if (kind === 'build') it = buildItem(pack, p, rng);
      else if (kind === 'say') it = sayItem(pack, p);
      else it = pickItem(pack, p, rng);
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
  function dealer(n) {
    var items = packItems(n), i = 0;
    return function () { return items[i++] || null; };
  }

  // ---- screens ---------------------------------------------------------------------------------------------
  function packRow(k) {
    var open = packOpen(k.n), done = packDone(k.n), prevN = k.n - 1;
    var b = el('button', 'arc-pick' + (done ? ' on' : ''));
    b.type = 'button';
    b.disabled = !open;
    var t = el('b', null, k.n + '  ');
    t.appendChild(document.createTextNode(k.en));
    b.appendChild(t);
    b.appendChild(el('span', null, done ? 'passed' : open ? 'open' : 'locked: pass pack ' + prevN + ' first'));
    b.addEventListener('click', function () { nav.push('card'); packCard(k.n); });
    return b;
  }
  /* The Speak strand, for the stage-0 home. compact: just the pack to do next (the first open). */
  function section(parent, compact) {
    parent.appendChild(strandHead(NAME.en, NAME.ru, NAME.tr));
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
    if (window.RUConvo) window.RUConvo.section(w, null, home);
    show(w);
  }

  function leave() { if (nav.leave) nav.leave(); else home(); }

  // ---- Talk and Script: the two sides of the app, switchable at any time (svobodno.mode) ------------------------
  var MODE_KEY = 'svobodno.mode';
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
    [['talk', 'Talk', 'Говори́ть'], ['script', 'Script', 'Бу́квы']].forEach(function (x) {
      var b = el('button', 'arc-seg-b' + (x[0] === cur ? ' on' : ''));
      b.type = 'button';
      b.setAttribute('data-mode', x[0]);
      b.appendChild(el('b', null, x[1]));
      b.appendChild(UI.ru(x[2]));
      b.addEventListener('click', function () {
        if (x[0] !== mode()) { setMode(x[0]); nav.board(); }
      });
      seg.appendChild(b);
    });
    return seg;
  }
  /* The topic focus the phrase sheet keeps (svobodno.arcade .focus): theme ids, or none for all. */
  function focus() {
    var f;
    try { f = (JSON.parse(localStorage.getItem(ARC_KEY)) || {}).focus; } catch (e) { f = null; }
    return Array.isArray(f) ? f : [];
  }
  /* The Talk home: the speaking side, before and after the letters test. */
  function talkHome() {
    var H = window.RUBukvy;
    var w = el('div', 'arc arc-first arc-talk');
    w.appendChild(modeToggle());
    var brand = el('div', 'arc-first-brand');
    brand.appendChild(UI.ru('Свобо́дно', 'big'));
    brand.appendChild(el('div', 'arc-brand', 'Svobodno'));
    w.appendChild(brand);
    w.appendChild(el('p', 'arc-sub', H && H.unlocked()
      ? 'Talk: packs, conversations and phrases, led by the sound. Switch to Script for the games and the letters.'
      : 'You can start speaking Russian now, and learn the letters alongside. Switch to Script for the letters. The games open when you pass the letters test.'));
    section(w, false);
    if (window.RUConvo) window.RUConvo.section(w, focus(), function () { nav.board(); });
    var books = window.RU_PHRASES || [];
    if (books.length && window.RUArcade && window.RUArcade.practisePhrases) {
      w.appendChild(strandHead('Phrases', 'Фра́зы', 'Frázy'));
      var f = focus(), labels = window.RUArcade.themeLabels ? f.map(window.RUArcade.themeLabels) : f;
      var b = el('button', 'arc-mode on');
      b.type = 'button';
      b.appendChild(el('b', null, 'Practise phrases'));
      b.appendChild(el('span', null, f.length ? 'Topics: ' + labels.join(', ') : 'All topics'));
      b.addEventListener('click', function () { window.RUArcade.practisePhrases(); });
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
    var cards = el('div', 'sp-cards');
    packPhrases(pack).forEach(function (p) {
      var c = el('div', 'sp-card');
      var main = el('div', 'sp-main');
      main.appendChild(scriptNode(textOf(p), 'sp-ru'));
      main.appendChild(el('div', 'sp-tr', trOf(p)));
      main.appendChild(el('div', 'sp-en', p.en));
      c.appendChild(main);
      var cl = clip(p);
      var sp = cl && UI.speaker(cl.t, cl.v);
      if (sp) c.appendChild(sp);
      if (p.n) c.appendChild(UI.rich(el('p', 'sp-note'), p.n));
      cards.appendChild(c);
    });
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
    show(w);
  }

  function startRound(n) {
    var pack = packN(n);
    if (!pack) return;
    markStarted();
    var deal = dealer(n);
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
    startRound: startRound, packItems: packItems, trOf: trOf, textOf: textOf,
    clip: clip, state: load, last: function () { return lastItem; }, ROUND: ROUND, PASS_FRAC: PASS_FRAC, NAME: NAME, HUE: HUE, _reset: _reset
  };
})();
