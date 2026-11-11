/* ============================================================================
 * AR CONVO: example conversations (data/conversations.js, window.AR_CONVOS).
 *
 * Offered from the phrase sheet (filtered by the topic focus) and from the Talk home. A conversation
 * screen shows every line as a chat bubble, the learner's role on the right, and plays it all. Practise
 * is a round through the learner's lines in order, the other side's lines shown as context:
 *   pass 0   pick among four lines (this conversation's and others')
 *   pass 1   build: tap the words
 *   pass 2+  type it in Script mode, say it (self-marked) in Talk mode;
 *          (typed answers are checked with AR.check)
 * 80% of the learner's lines right passes it; the count is kept in talaqa.convos. SRS ids are
 * 'cv:<conversation>:<line>:<variety>'. A pick or a build never makes anything learnt.
 *
 * Before the board is open, or in Talk mode, the sound leads and the script is smaller above it.
 * In Script mode with the board open the script leads and the sound is under it.
 *
 * TO REUSE FOR ANOTHER LANGUAGE: only the "language bits" below are Arabic specific.
 * ========================================================================== */
window.ARConvo = (function () {
  var UI = window.UI, AR = window.AR, GC = window.ARCore;
  var KEY = 'talaqa.convos';
  var PASS_FRAC = 0.8;
  var HUE = '#e07a3f';

  // ---- the language bits (Arabic) ---------------------------------------------------------
  function SP() { return window.ARSpeak; }
  function variety() { return SP().variety(); }
  function textOf(l, v) { return SP().textOf(l, v); }
  function trOf(l, v) { return SP().trOf(l, v); }
  function clip(l, v) { return SP().clip(l, v); }
  function same(a, b) { return AR.strip(a) === AR.strip(b); }
  function wordsOf(t) { return window.ARItems.phraseWords(t); }
  function accepts(l, v) { var a = [textOf(l, v)]; if (l.msa && a.indexOf(l.msa) === -1) a.push(l.msa); return a; }
  function scriptNode(text, cls) { return UI.ar(text, cls); }
  function levelOf(c) { return GC.sentenceLevel ? GC.sentenceLevel(c.b || 'A1') : 'full'; }
  function playClip(c, done) { return !!(c && AR.play(c.t, c.v, done)); }
  function varietyChips(onChange) {
    var chips = el('div', 'arc-chips');
    [['msa', 'Fuṣḥā'], ['lev', 'Shāmī'], ['egy', 'Maṣrī']].forEach(function (x) {
      chips.appendChild(button('arc-chip' + (x[0] === variety() ? ' on' : ''), x[1], function () { SP().setVariety(x[0]); onChange(); }));
    });
    return chips;
  }
  function vkey(v) { return ':' + v; }

  // ---- helpers --------------------------------------------------------------------------------
  var host = function () { return document.getElementById('stage-host'); };
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
  function shuffle(a, rng) { return GC.shuffle(a, rng); }
  function show(w) { var h = host(); clear(h); h.appendChild(w); }
  function nav() { return SP().nav(); }
  var lastItem = null, origin = null;

  // ---- the data and progress ---------------------------------------------------------------------
  function all() { return window.AR_CONVOS || []; }
  function byId(id) { return all().filter(function (c) { return c.id === id; })[0] || null; }
  function forThemes(themes) {
    var l = all();
    return themes && themes.length ? l.filter(function (c) { return themes.indexOf(c.th) !== -1; }) : l;
  }
  var mem = null;
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { mem = {}; }
    mem.passed = mem.passed || {};
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem || {})); } catch (e) {} }
  function passes(id) { return load().passed[id] || 0; }
  function _reset() { mem = null; }
  /* The kind of the next practise: pick, then build, then type. */
  function kindFor(id) { var n = passes(id); return n >= 2 ? (SP().mode() === 'script' ? 'type' : 'say') : n === 1 ? 'build' : 'pick'; }
  function scriptLed() {
    var H = window.ARHuruf;
    return !!(H && H.unlocked() && SP().mode() === 'script');
  }
  function role(c, who) { return (c.roles && c.roles[who]) || (who === 'a' ? 'You' : 'Them'); }
  /* How to name the learner's part: a role that starts with "You" (e.g. "You (a man)") is just "you". */
  function isYou(c) { return /^you\b/i.test(role(c, c.you)); }
  function bracket(c) { var m = /\([^)]*\)/.exec(role(c, c.you)); return m ? ' ' + m[0] : ''; }
  function youPhrase(c) { return isYou(c) ? 'you' + bracket(c) : 'you are the ' + role(c, c.you); }
  function other(who) { return who === 'a' ? 'b' : 'a'; }

  // ---- the practise items ---------------------------------------------------------------------------
  /* Learner lines in order. Each carries the other side's lines that came just before it as its context. */
  function learnerLines(c) {
    var out = [], ctx = [];
    c.lines.forEach(function (l, i) {
      if (l.who === c.you) { out.push({ line: l, i: i, ctx: ctx }); ctx = []; }
      else ctx.push(l);
    });
    return out;
  }
  /* Wrong lines: other lines of this conversation first, then others' lines, deduped on the sound, the
   * script and the English. Null when there are fewer than three. */
  function wrongLines(c, line, v, rng) {
    var own = c.lines.slice();
    var rest = [];
    all().forEach(function (o) { if (o.id !== c.id) rest = rest.concat(o.lines); });
    var pools = [[own, 2], [rest, 3], [own, 3]];     // two from this conversation, the rest from others, then fill
    var out = [], seen = {};
    function key(l) { return trOf(l, v) + '|' + AR.strip(textOf(l, v)) + '|' + l.en.toLowerCase(); }
    function clash(l) {
      var list = [line].concat(out);
      for (var i = 0; i < list.length; i++) {
        var q = list[i];
        if (q === l || trOf(q, v) === trOf(l, v) || same(textOf(q, v), textOf(l, v)) || q.en.toLowerCase() === l.en.toLowerCase()) return true;
      }
      return false;
    }
    pools.forEach(function (p) {
      shuffle(p[0].slice(), rng).forEach(function (l) {
        var k = key(l);
        if (out.length < p[1] && !seen[k] && !clash(l)) { seen[k] = 1; out.push(l); }
      });
    });
    return out.length === 3 ? out : null;
  }
  function contextOf(c, ctx, v) {
    if (!ctx.length) return null;
    var last = ctx[ctx.length - 1];
    return {
      sub: role(c, last.who) + ': ' + ctx.map(function (l) { return trOf(l, v) + ' (' + l.en + ')'; }).join(' ... '),
      say: clip(last, v)
    };
  }
  function lineItem(c, ent, v, kind, led, rng) {
    var l = ent.line, text = textOf(l, v), tr = trOf(l, v), cx = contextOf(c, ent.ctx, v);
    var it = { kind: 'speak', cefr: c.b || 'A1', bonus: 0, topic: 'speak', variety: null, level: 'full',
      id: 'cv:' + c.id + ':' + ent.i + vkey(v), convo: c.id, convoLine: ent.i, convoKind: kind,
      prompt: l.en, sub: cx ? cx.sub : 'Your line' + bracket(c), en: l.en, ar: text,
      say: clip(l, v), key: 'cv:' + c.id + ':' + ent.i + ':' + kind };
    if (cx && cx.say) { it.promptSay = cx.say; it.playPrompt = true; }
    if (kind === 'pick') {
      var wrong = wrongLines(c, l, v, rng);
      if (!wrong) return null;
      var set = [l].concat(wrong);
      it.play = 'choose';
      if (led) {
        it.optAr = true; it.level = levelOf(c); it.answer = text;
        it.options = shuffle(set.map(function (q) { return textOf(q, v); }), rng);
        it.optTr = {};
        set.forEach(function (q) { it.optTr[textOf(q, v)] = trOf(q, v); });
      } else {
        it.ansLatin = true; it.answer = tr;
        it.options = shuffle(set.map(function (q) { return trOf(q, v); }), rng);
        it.optScript = {};
        set.forEach(function (q) { it.optScript[trOf(q, v)] = textOf(q, v); });
      }
      return it;
    }
    if (kind === 'build') {
      var ws = led ? wordsOf(text) : tr.replace(/\s+/g, ' ').trim().split(' ');
      if (ws.length < 2 || ws.length > 8) return lineItem(c, ent, v, 'pick', led, rng);
      it.play = 'build'; it.words = ws; it.answer = ws.join(' '); it.accept = [it.answer]; it.reveal = led ? text : tr;
      if (!led) it.latin = true;
      return it;
    }
    if (kind === 'say') {
      it.play = 'say'; it.self = true; it.speakKind = 'say'; it.id = null; it.answer = tr; it.trAnswer = tr; it.sayAr = text;
      return it;
    }
    it.play = 'type'; it.answer = text; it.accept = accepts(l, v); it.level = levelOf(c); it.trAnswer = tr;
    return it;
  }
  /* The learner's lines of a conversation, in line order, as round items. */
  function items(id, v, kind, led, rng) {
    var c = byId(id);
    if (!c) return [];
    var out = [];
    learnerLines(c).forEach(function (ent) {
      var it = lineItem(c, ent, v, kind, led, rng);
      if (it) out.push(it);
    });
    return out;
  }

  // ---- screens ----------------------------------------------------------------------------------------------
  function wrapEl() {
    var w = el('div', 'arc-stats arc-speak cv');
    w.style.setProperty('--g', HUE);
    return w;
  }
  function top(title, onBack) {
    var t = el('div', 'arc-stats-top');
    if (onBack) t.appendChild(button('arc-back', '←', onBack));
    t.appendChild(el('h2', null, title));
    return t;
  }
  /* The Conversations list: for the phrase sheet and the Talk home. */
  function section(parent, themes, from) {
    var list = forThemes(themes);
    if (!all().length) return;
    parent.appendChild(el('div', 'arc-group', 'Conversations'));
    if (!list.length) { parent.appendChild(el('p', 'arc-sub', 'No conversations in these topics yet.')); return; }
    var box = el('div', 'arc-picks cv-list');
    list.forEach(function (c) {
      var done = passes(c.id) > 0;
      var b = el('button', 'arc-pick cv-row' + (done ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('b', null, c.en));
      b.appendChild(el('span', null, (c.b || 'A1') + ' · ' + youPhrase(c) + (done ? ' · done ✓' : '')));
      b.addEventListener('click', function () { open(c.id, from); });
      box.appendChild(b);
    });
    parent.appendChild(box);
  }

  function lineNode(c, l, v, led) {
    var mine = l.who === c.you;
    var b = el('div', 'cv-bubble ' + (mine ? 'cv-me' : 'cv-them'));
    b.appendChild(el('div', 'cv-who', role(c, l.who)));
    var text = textOf(l, v);
    if (led) {
      b.appendChild(scriptNode(text, 'cv-ar'));
      b.appendChild(el('div', 'cv-tr', trOf(l, v)));
    } else {
      b.appendChild(scriptNode(text, 'sp-ar'));
      b.appendChild(el('div', 'sp-tr', trOf(l, v)));
    }
    b.appendChild(el('div', 'sp-en', l.en));
    var cl = clip(l, v), sp = cl && UI.speaker(cl.t, cl.v, 'cv-spk');
    if (sp) b.appendChild(sp);
    return b;
  }

  var playToken = 0;
  /* Play the lines in order, each clip after the last. */
  function playAll(c, v) {
    var mine = ++playToken, i = 0;
    function next() {
      if (mine !== playToken) return;
      while (i < c.lines.length) {
        var cl = clip(c.lines[i++], v);
        if (cl && playClip(cl, function () { setTimeout(next, 250); })) return;
      }
    }
    next();
  }

  function open(id, from) {
    if (from !== undefined) origin = from;
    var c = byId(id);
    if (!c) { nav().leave ? nav().leave() : nav().board(); return; }
    playToken++;
    var led = scriptLed();
    var w = wrapEl();
    w.appendChild(top(c.en, function () { playToken++; if (origin) origin(); else nav().board(); }));
    w.appendChild(el('p', 'arc-sub', (c.b || 'A1') + ' · ' + youPhrase(c) + ', talking to ' + role(c, other(c.you)) +
      (passes(c.id) ? ' · done ✓' : '')));
    if (c.n) w.appendChild(UI.rich(el('p', 'sp-note'), c.n));
    var chips = el('div', 'sp-choose'), chat = el('div', 'cv-chat');
    function paint() {
      var v = variety();
      clear(chat);
      c.lines.forEach(function (l) { chat.appendChild(lineNode(c, l, v, led)); });
    }
    if (VARIANTS) {
      chips.appendChild(el('div', 'arc-group', 'How do you want to speak?'));
      var holder = el('div');
      var draw = function () { clear(holder); holder.appendChild(varietyChips(function () { draw(); paint(); })); };
      draw();
      chips.appendChild(holder);
      w.appendChild(chips);
    }
    w.appendChild(chat);
    paint();
    w.appendChild(button('arc-wtbtn cv-playall', 'Play it all', function () { playAll(c, variety()); }));
    var go = el('button', 'arc-mode on hr-start cv-practise');
    go.type = 'button';
    go.appendChild(el('b', null, isYou(c) ? 'Practise your part' : 'Practise: ' + youPhrase(c)));
    var kind = kindFor(c.id);
    go.appendChild(el('span', null, (kind === 'pick' ? 'Pick the right line' : kind === 'build' ? 'Tap the words in order' : kind === 'say' ? 'Say each line, then mark yourself' : 'Type each line') + ', 80% right to pass'));
    go.addEventListener('click', function () { practise(c.id); });
    var modes = el('div', 'arc-modes');
    modes.appendChild(go);
    w.appendChild(modes);
    show(w);
  }

  function practise(id) {
    var c = byId(id);
    if (!c) return;
    playToken++;
    if (window.ARHuruf && window.ARHuruf.markStarted) window.ARHuruf.markStarted();
    var v = variety(), kind = kindFor(id), led = scriptLed();
    var list = items(id, v, kind, led);
    if (!list.length) { open(id); return; }
    var n = 0, graded = 0, right = 0;
    if (nav().round) nav().round();
    window.GameRound.run(host(), {
      key: 'convo:' + id, title: c.en, kind: 'speak', hue: HUE, count: list.length, duration: null,
      draw: function () { lastItem = list[n++] || null; return lastItem; },
      onResolve: function (item, result) { graded++; if (result !== 'wrong') right++; },
      againLabel: 'Try again', again: function () { practise(id); },
      onExit: function () { open(id); },
      onFinish: function () {
        var need = Math.ceil(graded * PASS_FRAC - 1e-9);
        var ok = graded > 0 && right >= need;
        var box = el('div', 'hr-result');
        if (ok) {
          load().passed[id] = passes(id) + 1; save();
          box.appendChild(el('div', 'g-over-verdict pb', 'Passed: ' + right + ' of ' + graded));
          box.appendChild(button('arc-btn on', 'Back to the conversation', function () { open(id); }));
        } else {
          box.appendChild(el('div', 'g-over-verdict', right + ' of ' + graded + ' right. ' + need + ' are needed to pass.'));
          box.appendChild(button('arc-btn', 'Read it again', function () { open(id); }));
        }
        return box;
      }
    });
  }

  var VARIANTS = true;
  return { all: all, byId: byId, forThemes: forThemes, section: section, open: open, practise: practise, items: items,
    passes: passes, kindFor: kindFor, scriptLed: scriptLed, state: load, last: function () { return lastItem; },
    learnerLines: learnerLines, HUE: HUE, PASS_FRAC: PASS_FRAC, _reset: _reset };
})();
