/* ============================================================================
 * CONVO: example conversations for Juegos (data/conversations.js, window.ES_CONVOS).
 *
 * Offered from the Frases sheet, filtered by the topic focus. A conversation screen shows every line
 * as a chat bubble, the learner's role on the right, with the English under each line. Practise is a
 * round through the learner's lines in order, the other side's lines shown as context:
 *   pass 0   pick among four lines (this conversation's and others')
 *   pass 1   build: tap the words
 *   pass 2+  type it (the round's own checker decides, so accents follow the usual near-miss rules)
 * 80% of the learner's lines right passes it; the count is kept in fluidez.convos. SRS ids are
 * 'cv:<conversation>:<line>'. A pick or a build never makes anything learnt (js/srs.js: only a typed
 * first sight does).
 *
 * The same module is in gaeilge/js/ga-convo.js; only the "language bits" differ.
 * ========================================================================== */
window.ESConvo = (function () {
  var KEY = 'fluidez.convos';
  var PASS_FRAC = 0.8;
  var HUE = '#e07a3f';

  // ---- the language bits (Spanish) ------------------------------------------------------------
  function textOf(l) { return l.es; }
  function wordsOf(t) { return t.replace(/[.,;:!?¿¡"“”]/g, '').replace(/\s+/g, ' ').trim().split(' '); }
  var TXT = {
    group: 'Conversaciones', none: 'Aún no hay conversaciones en estos temas.', done: 'hecha ✓',
    you: 'tú', roleIs: 'tu papel: ', talkingTo: ', hablando con ', yourLine: 'Tu frase',
    practise: 'Practica tu parte', practiseAs: 'Practica ',
    pick: 'Elige la frase correcta', build: 'Toca las palabras en orden', type: 'Escribe cada frase', toPass: ', 80 % para aprobar',
    passed: 'Aprobada: ', of: ' de ', right: ' bien. Hacen falta ', toPassEnd: ' para aprobar.',
    backTo: 'Volver a la conversación', again: 'Leerla otra vez', retry: 'Otra vez'
  };

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
  function shuffle(a, rng) {
    rng = rng || Math.random;
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function show(w) { var h = host(); clear(h); h.appendChild(w); }
  var lastItem = null, origin = null, setView = function () {};

  // ---- the data and progress ---------------------------------------------------------------------
  function all() { return window.ES_CONVOS || []; }
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
  function kindFor(id) { var n = passes(id); return n >= 2 ? 'type' : n === 1 ? 'build' : 'pick'; }
  /* The data names roles in English; Juegos speaks Spanish. */
  var ROLE_ES = { Guest: 'Invitado', Waiter: 'Mesero', Vendor: 'Vendedor', Passerby: 'Transeúnte', Driver: 'Conductor',
    Receptionist: 'Recepcionista', Pharmacist: 'Farmaceuta', Friend: 'Amigo', 'Ticket seller': 'Vendedor de tiquetes',
    Neighbour: 'Vecino', Customer: 'Cliente', Them: 'La otra persona' };
  function role(c, who) { var r = (c.roles && c.roles[who]) || (who === 'a' ? 'You' : 'Them'); return ROLE_ES[r] || r; }
  /* How to name the learner's part: a role that starts with "You" (e.g. "You (a man)") is just "tú". */
  function isYou(c) { return /^you\b/i.test(role(c, c.you)); }
  function bracket(c) { var m = /\([^)]*\)/.exec(role(c, c.you)); return m ? ' ' + m[0] : ''; }
  function youPhrase(c) { return isYou(c) ? TXT.you + bracket(c) : TXT.roleIs + role(c, c.you); }
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
  /* Wrong lines: other lines of this conversation first, then others' lines, deduped on the text and the
   * English. Null when there are fewer than three. */
  function wrongLines(c, line, rng) {
    var own = c.lines.slice(), rest = [];
    all().forEach(function (o) { if (o.id !== c.id) rest = rest.concat(o.lines); });
    var pools = [[own, 2], [rest, 3], [own, 3]];     // two from this conversation, the rest from others, then fill
    var out = [];
    function clash(l) {
      var list = [line].concat(out);
      for (var i = 0; i < list.length; i++) {
        var q = list[i];
        if (q === l || textOf(q) === textOf(l) || q.en.toLowerCase() === l.en.toLowerCase()) return true;
      }
      return false;
    }
    pools.forEach(function (p) {
      shuffle(p[0].slice(), rng).forEach(function (l) { if (out.length < p[1] && !clash(l)) out.push(l); });
    });
    return out.length === 3 ? out : null;
  }
  function contextOf(c, ctx) {
    if (!ctx.length) return null;
    var last = ctx[ctx.length - 1];
    return role(c, last.who) + ': ' + ctx.map(function (l) { return textOf(l) + ' (' + l.en + ')'; }).join(' ... ');
  }
  function lineItem(c, ent, kind, rng) {
    var l = ent.line, text = textOf(l), cx = contextOf(c, ent.ctx);
    var it = { kind: 'translate', cefr: c.b || 'A1', bonus: 0, topic: null, level: 'full',
      id: 'cv:' + c.id + ':' + ent.i, convo: c.id, convoLine: ent.i, convoKind: kind,
      prompt: l.en, sub: cx || (TXT.yourLine + bracket(c)), en: l.en, es: text, answer: text,
      key: 'cv:' + c.id + ':' + ent.i + ':' + kind };
    if (kind === 'pick') {
      var wrong = wrongLines(c, l, rng);
      if (!wrong) return null;
      it.play = 'choose';
      it.options = shuffle([l].concat(wrong).map(textOf), rng);
      return it;
    }
    if (kind === 'build') {
      var ws = wordsOf(text);
      if (ws.length < 2 || ws.length > 8) return lineItem(c, ent, 'pick', rng);
      it.play = 'build'; it.words = ws; it.answer = ws.join(' '); it.reveal = text;
      return it;
    }
    it.play = 'type'; it.accept = [text];
    return it;
  }
  /* The learner's lines of a conversation, in line order, as round items. */
  function items(id, kind, rng) {
    var c = byId(id);
    if (!c) return [];
    var out = [];
    learnerLines(c).forEach(function (ent) {
      var it = lineItem(c, ent, kind, rng);
      if (it) out.push(it);
    });
    return out;
  }

  // ---- screens ----------------------------------------------------------------------------------------------
  function wrapEl() {
    var w = el('div', 'arc-stats cv');
    w.style.setProperty('--g', HUE);
    return w;
  }
  function top(title, onBack) {
    var t = el('div', 'arc-stats-top');
    if (onBack) {
      var b = button('arc-back', '←', onBack);
      b.setAttribute('aria-label', 'Volver');
      t.appendChild(b);
    }
    t.appendChild(el('h2', null, title));
    return t;
  }
  /* The Conversaciones list, for the Frases sheet. setV tells the arcade which view is on screen. */
  function section(parent, themes, from, setV) {
    if (setV) setView = setV;
    var list = forThemes(themes);
    if (!all().length) return;
    parent.appendChild(el('div', 'arc-group', TXT.group));
    if (!list.length) { parent.appendChild(el('p', 'arc-sub', TXT.none)); return; }
    var box = el('div', 'arc-picks cv-list');
    list.forEach(function (c) {
      var done = passes(c.id) > 0;
      var b = el('button', 'arc-pick cv-row' + (done ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('b', null, c.en));
      b.appendChild(el('span', null, (c.b || 'A1') + ' · ' + youPhrase(c) + (done ? ' · ' + TXT.done : '')));
      b.addEventListener('click', function () { open(c.id, from); });
      box.appendChild(b);
    });
    parent.appendChild(box);
  }

  /* The recorded line: data/convo-audio.js, keyed "<id>#<line>". */
  function clipKey(c, i) { return c.id + '#' + i; }
  function hasClip(c, i) { return !!(window.ConvoAudio && window.ConvoAudio.has(clipKey(c, i))); }
  function lineNode(c, l, i) {
    var mine = l.who === c.you;
    var b = el('div', 'cv-bubble ' + (mine ? 'cv-me' : 'cv-them'));
    var who = role(c, l.who);
    b.appendChild(el('div', 'cv-who', /^you\b/i.test(who) ? 'Tú' + who.slice(3) : who));
    b.appendChild(el('div', 'cv-es', textOf(l)));
    b.appendChild(el('div', 'cv-en', l.en));
    if (i != null && hasClip(c, i)) {
      var sp = el('button', 'spk cv-spk', '🔊');
      sp.type = 'button';
      sp.setAttribute('aria-label', 'Escuchar');
      sp.addEventListener('click', function (e) {
        if (e && e.stopPropagation) e.stopPropagation();
        playToken++; lit(null);
        window.ConvoAudio.play(clipKey(c, i));
      });
      b.appendChild(sp);
    }
    return b;
  }

  /* Play the lines in order, each after the last, the speaking bubble lit. */
  var playToken = 0, bubbles = [];
  function lit(n) { bubbles.forEach(function (b, k) { if (b.classList) b.classList.toggle('cv-playing', k === n); }); }
  function playAll(c) {
    var mine = ++playToken, i = 0;
    function next() {
      if (mine !== playToken) return;
      while (i < c.lines.length) {
        var k = i++;
        lit(k);
        if (window.ConvoAudio.play(clipKey(c, k), function () { if (mine === playToken) { lit(null); setTimeout(next, 300); } })) return;
      }
      lit(null);
    }
    next();
  }
  function stopPlay() { playToken++; bubbles = []; if (window.ConvoAudio) window.ConvoAudio.stop(); }

  function open(id, from) {
    if (from !== undefined) origin = from;
    var c = byId(id);
    if (!c) { if (origin) origin(); return; }
    setView('sheet');
    var w = wrapEl();
    stopPlay();
    w.appendChild(top(c.en, function () { stopPlay(); if (origin) origin(); }));
    w.appendChild(el('p', 'arc-sub', (c.b || 'A1') + ' · ' + youPhrase(c) + TXT.talkingTo + role(c, other(c.you)) +
      (passes(c.id) ? ' · ' + TXT.done : '')));
    if (c.n) w.appendChild(el('p', 'cv-note', c.n));
    var chat = el('div', 'cv-chat');
    c.lines.forEach(function (l, i) { var b = lineNode(c, l, i); bubbles.push(b); chat.appendChild(b); });
    w.appendChild(chat);
    if (c.lines.some(function (l, i) { return hasClip(c, i); })) {
      var pa = el('button', 'arc-wtbtn cv-playall', '▶ ' + 'Escuchar todo');
      pa.type = 'button';
      pa.addEventListener('click', function () { playAll(c); });
      w.appendChild(pa);
    }
    var go = el('button', 'arc-mode on cv-practise');
    go.type = 'button';
    go.appendChild(el('b', null, isYou(c) ? TXT.practise : TXT.practiseAs + youPhrase(c)));
    var kind = kindFor(c.id);
    go.appendChild(el('span', null, TXT[kind] + TXT.toPass));
    go.addEventListener('click', function () { practise(c.id); });
    var modes = el('div', 'arc-modes');
    modes.appendChild(go);
    w.appendChild(modes);
    show(w);
  }

  function practise(id) {
    var c = byId(id);
    if (!c) return;
    stopPlay();
    var kind = kindFor(id);
    var list = items(id, kind);
    if (!list.length) { open(id); return; }
    setView('round');
    var n = 0, graded = 0, right = 0;
    window.GameRound.run(host(), {
      key: 'convo:' + id, title: c.en, kind: 'translate', hue: HUE, count: list.length, duration: null,
      draw: function () { lastItem = list[n++] || null; return lastItem; },
      onResolve: function (item, result) { graded++; if (result !== 'wrong') right++; },
      againLabel: TXT.retry, again: function () { practise(id); },
      onExit: function () { open(id); },
      onFinish: function () {
        var need = Math.ceil(graded * PASS_FRAC - 1e-9);
        var ok = graded > 0 && right >= need;
        var box = el('div', 'cv-result');
        if (ok) {
          load().passed[id] = passes(id) + 1; save();
          box.appendChild(el('div', 'g-over-verdict pb', TXT.passed + right + TXT.of + graded));
          box.appendChild(button('arc-btn on', TXT.backTo, function () { open(id); }));
        } else {
          box.appendChild(el('div', 'g-over-verdict', right + TXT.of + graded + TXT.right + need + TXT.toPassEnd));
          box.appendChild(button('arc-btn', TXT.again, function () { open(id); }));
        }
        return box;
      }
    });
  }

  return { all: all, byId: byId, forThemes: forThemes, section: section, open: open, practise: practise, items: items,
    passes: passes, kindFor: kindFor, state: load, last: function () { return lastItem; },
    learnerLines: learnerLines, HUE: HUE, PASS_FRAC: PASS_FRAC, _reset: _reset };
})();
