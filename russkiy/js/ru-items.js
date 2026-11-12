/* ============================================================================
 * RU ITEMS: the item source for the round engine (js/gameround.js).
 *
 * Kinds: glagoly, vid, dvizhenie, padezhi, chisla (the GAP banks, one array
 * window.RU_BANK filtered by k), slova (the word grind over window.RU_WORDS),
 * frazy (window.RU_PHRASES), igrat (the mix). The rule that runs through all of
 * them: TAP FIRST, TYPE ONCE KNOWN. An item answered right once (and not missed
 * since) comes back typed; the English is the prompt or one tap away and the
 * Russian is always what is asked for.
 *
 * Every item carries its Russian with stress marks, plus `level` (how much of
 * that the screen shows, from RUCore) and the clip it plays (`say`, `promptSay`).
 * Banks may be empty or missing: every function degrades to null / 0.
 * ========================================================================== */
window.RUItems = (function () {
  var RU = window.RU, GC = window.RUCore;
  var BANDS = GC.BANDS;
  var GAP_KINDS = ['glagoly', 'padezhi', 'vid', 'dvizhenie', 'chisla'];
  var GRAMMAR_KINDS = ['padezhi', 'vid', 'dvizhenie', 'chisla'];
  var RECENT_KEY = 'svobodno.recent', RECENT_KEEP = 80;

  function rnd(rng) { return (rng || Math.random)(); }
  function pick(arr, rng) { return arr && arr.length ? arr[Math.floor(rnd(rng) * arr.length)] : null; }
  function shuffle(a, rng) { return GC.shuffle(a, rng); }
  function bandIx(b) { var i = BANDS.indexOf(b); return i < 0 ? 0 : i; }
  function playerBand() { return (window.Profile && window.Profile.current && window.Profile.current()) || 'A1'; }
  function stateOf(id) { return window.SRS && window.SRS.state ? window.SRS.state(id) : null; }
  function today() { return window.SRS && window.SRS.today ? window.SRS.today() : Math.floor(Date.now() / 864e5); }
  function thousands(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function same(a, b) { return RU.strip(a) === RU.strip(b); }

  /* KNOWN: learnt for good, or answered right and not missed since. NOT reps > 0:
   * the SRS counts every review in reps, wrong ones too. */
  function knownCard(c) {
    return !!(c && typeof c === 'object' && (c.learnt || (c.passed && !(c.consecMiss > 0))));
  }
  function answeredRight(id) { return id ? knownCard(stateOf(id)) : false; }

  // ---- the banks ---------------------------------------------------------------
  var BANK = null, BANK_N = -1, WL = null, WL_KEY = null, PL = null, PL_KEY = null;
  function bankIndex() {
    var all = window.RU_BANK || [];
    if (BANK && BANK_N === all.length) return BANK;
    BANK = { by: {}, byId: {} };
    all.forEach(function (g) {
      if (!g || !g.k || !g.q || !g.a || !g.o || g.o.length < 2) return;
      var id = gapId(g);
      BANK.byId[id] = g;
      (BANK.by[g.k] = BANK.by[g.k] || []).push(g);
    });
    BANK_N = all.length;
    return BANK;
  }
  function gapId(g) { return 'g:' + g.k + ':' + g.q; }
  function bank(kind) { return bankIndex().by[kind] || []; }

  function bankCount(kind) {
    if (kind === 'slova') return wordList().list.length;
    if (kind === 'frazy') return phraseList().list.length;
    if (kind === 'bukvy') return (window.RU_LETTERS || []).length;
    if (kind === 'igrat') return GAP_KINDS.reduce(function (n, k) { return n + bank(k).length; }, 0) +
      wordList().list.length + phraseList().list.length;
    return bank(kind).length;
  }
  function reset() { BANK = null; BANK_N = -1; WL = null; PL = null; recentMem = null; }

  // ---- recent memory -----------------------------------------------------------
  var recentMem = null;
  function recent() {
    if (recentMem) return recentMem;
    try { var r = JSON.parse(localStorage.getItem(RECENT_KEY)); recentMem = Array.isArray(r) ? r : []; } catch (e) { recentMem = []; }
    return recentMem;
  }
  function remember(q) {
    var r = recent().slice();
    r.push(q);
    if (r.length > RECENT_KEEP) r.splice(0, r.length - RECENT_KEEP);
    recentMem = r;
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(r)); } catch (e) {}
  }

  // ---- the gap items -------------------------------------------------------------
  /* Gap sentences follow the sentence rule by band: stress marks at A1 and A2, bare from B1. */
  function gapLevel(g, id) {
    return GC.sentenceLevel(g.b || 'A1');
  }
  /* What plays after the answer: the whole sentence with the answer in it where
   * there is a clip for that, else the answer word. */
  function sayText(g) {
    var full = g.q.replace(/___+/, g.a);
    return (window.RU && RU.has && RU.has(full)) ? full : g.a;
  }
  function gapItem(g, forceChoose) {
    var id = gapId(g);
    return { kind: g.k, play: (!forceChoose && answeredRight(id)) ? 'type' : 'choose', cefr: g.b || 'A1',
      topic: g.k + ':' + (g.t || ''), id: id, prompt: g.q.replace(/___+/g, '＿＿＿'), pRu: true,
      level: gapLevel(g, id), answer: g.a, accept: [g.a].concat(g.x || []),
      options: shuffle(g.o.slice()), optRu: true, cue: g.c || null,
      sub: null, peek: g.e || null, note: g.w || null, say: { t: sayText(g), v: 'ru' }, bonus: 20 };
  }
  // opts.topics: t values to keep
  function gapPool(kind, opts) {
    var pool = bank(kind);
    var only = opts && opts.topics;
    if (only && only.length) {
      var f = pool.filter(function (g) { return only.indexOf(g.t) !== -1; });
      if (f.length) pool = f;
    }
    return pool;
  }
  function dealGap(kind, rng, opts) {
    var pool = gapPool(kind, opts);
    if (!pool.length) return null;
    var pb = bandIx(playerBand());
    var cands = pool.filter(function (g) { return bandIx(g.b) <= pb + 1; });
    if (!cands.length) cands = pool;
    // learnt is permanent: never dealt again, unless that would leave nothing
    var live = cands.filter(function (g) { return !(window.SRS && window.SRS.isLearnt(gapId(g))); });
    if (live.length) cands = live;
    var rec = recent();
    var fresh = cands.filter(function (g) { return rec.indexOf(g.q) === -1; });
    if (!fresh.length) {                 // everything is recent: the one dealt longest ago
      fresh = [cands.slice().sort(function (a, b) { return rec.lastIndexOf(a.q) - rec.lastIndexOf(b.q); })[0]];
    }
    var td = today();
    // the player's band first, one band up half as likely, below it a little less; a miss or a due card first of all
    var wOf = function (g) {
      var d = bandIx(g.b) - pb, w = d === 0 ? 4 : d > 0 ? 2 : 1;
      var st = stateOf(gapId(g));
      if (st && !st.learnt) { if (st.consecMiss > 0) w *= 4; else if (st.due <= td) w *= 3; }
      return w;
    };
    var total = fresh.reduce(function (s, g) { return s + wOf(g); }, 0), at = rnd(rng) * total, g0 = fresh[0];
    for (var i = 0; i < fresh.length; i++) { at -= wOf(fresh[i]); if (at < 0) { g0 = fresh[i]; break; } }
    remember(g0.q);
    return gapItem(g0);
  }

  // ---- WORDS: the grind --------------------------------------------------------------
  function glossSet(en) {
    var out = {};
    String(en || '').toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[;,\/]|\bor\b/).forEach(function (p) {
      p = p.replace(/^\s*(to|the|a|an)\s+/, '').replace(/\s+/g, ' ').trim();
      if (p) out[p] = 1;
    });
    return out;
  }
  function glossClash(a, b) {
    for (var k in a.gl) if (b.gl[k]) return true;
    return a.en.toLowerCase() === b.en.toLowerCase();
  }
  function wordList() {
    var src = window.RU_WORDS || [];
    if (WL && WL_KEY === src && WL.n === src.length) return WL;
    var seen = {}, list = [];
    src.forEach(function (w) {
      if (!w || !w.ru || !w.en) return;
      var ru = String(w.ru).trim();
      if (!ru || seen[ru]) return;
      seen[ru] = 1;
      list.push({ ru: ru, en: String(w.en), g: w.g || null, th: w.th || null,
        b: w.b || 'A1', r: w.r == null ? 1e9 : w.r, pos: w.pos || 'x', id: 'w:' + ru, gl: glossSet(w.en), alt: w.alt || [] });
    });
    list.sort(function (a, b) { return a.r - b.r; });
    var byTheme = {}, byEn = {};
    list.forEach(function (e, i) {
      e.rank = i;
      if (e.th) (byTheme[e.th] = byTheme[e.th] || []).push(e);
      (byEn[e.en.toLowerCase()] = byEn[e.en.toLowerCase()] || []).push(e);
    });
    WL = { list: list, byTheme: byTheme, byEn: byEn, n: src.length };
    WL_KEY = src;
    return WL;
  }
  function wordDistractors(e, G, rng) {
    var chosen = [];
    function ok(o) {
      // two forms that differ only in their stress would look the same once faded
      if (o.ru === e.ru || same(o.ru, e.ru) || glossClash(e, o) || e.alt.indexOf(o.ru) !== -1 || (o.alt || []).indexOf(e.ru) !== -1) return false;
      for (var i = 0; i < chosen.length; i++) if (same(chosen[i].ru, o.ru) || glossClash(chosen[i], o)) return false;
      return true;
    }
    var th = e.th ? G.byTheme[e.th] : null;
    var stages = [
      function () { return th ? th.filter(function (o) { return o.b === e.b && o.pos === e.pos; }) : []; },
      function () { return th ? th.filter(function (o) { return o.b === e.b; }) : []; },
      function () { return th || []; },
      function () { return G.list.filter(function (o) { return o.b === e.b && o.pos === e.pos; }); },
      function () { return G.list.filter(function (o) { return o.pos === e.pos; }); },
      function () { return G.list; }
    ];
    for (var s = 0; s < stages.length && chosen.length < 3; s++) {
      var pool = shuffle(stages[s]().slice(), rng);
      for (var i = 0; i < pool.length && chosen.length < 3; i++) if (ok(pool[i])) chosen.push(pool[i]);
    }
    return chosen.length === 3 ? chosen : null;
  }

  /* grindPick deals from a ranked list ({ list, byTheme }): a card that is DUE,
   * a word MISSED recently, the next NEW one in rank order (capped per round),
   * a recently learnt one to fill, only then new ones beyond the cap. Learnt
   * entries are never dealt. G.bandCap holds new entries back more than a band
   * above the player's. `sub` keeps one state per list inside an Ilab round. */
  function grindPick(opts, rng, G, sub) {
    if (!G.list.length) return null;
    var st = (opts && opts.grind) || { asked: 0, newN: 0, used: {} };
    if (sub && opts && opts.grind) st = st[sub] = st[sub] || { asked: 0, newN: 0, used: {} };
    st.used = st.used || {}; st.asked = st.asked || 0; st.newN = st.newN || 0;
    var L = !sub && opts && opts.theme && G.byTheme[opts.theme] ? G.byTheme[opts.theme] : G.list;
    /* opts.themes (an array) is the phrase sheet's topic focus: the union of those themes, in rank order. */
    if (sub === 'ph' && opts && opts.gkind === 'frazy' && opts.themes && opts.themes.length) {
      var tset = {};
      opts.themes.forEach(function (t) { tset[t] = 1; });
      L = G.list.filter(function (e) { return tset[e.th] || tset['id:' + e.id]; });
    }
    /* With the learner's own phrases in the focus the round keeps strictly to the schedule:
     * due, then missed, then up to four new, each once, and the round ends when those run out.
     * Never a phrase that is not due yet, and their own picks are dealt whatever their band. */
    var strict = !!(tset && opts.themes.some(function (t) { return String(t).indexOf('id:') === 0; }));
    var capIx = G.bandCap ? bandIx(playerBand()) + 1 : 9;
    var td = today();
    /* A new item a B1+ player gets right at first sight was already theirs: it
     * does not use up the round's allowance of new ones. */
    if (st.lastNew) {
      if (knownCard(stateOf(st.lastNew)) && bandIx(playerBand()) >= 2) st.newN = Math.max(0, st.newN - 1);
      st.lastNew = null;
    }
    for (var pass = 0; pass < 2; pass++) {
      var due = [], missed = [], recentL = [], fresh = null, any = [];
      for (var i = 0; i < L.length; i++) {
        var e = L[i];
        if (st.used[e.id]) continue;
        var c = stateOf(e.id);
        if (c && c.learnt) continue;                   // permanently learnt: never dealt
        if (!c || (!(c.reps > 0) && (c.due == null ? 0 : c.due) > td)) {
          if (bandIx(e.b) > capIx && !(strict && tset['id:' + e.id])) continue;
          if (!fresh) fresh = e;
          continue;
        }
        any.push(e);
        var d = c.due == null ? 0 : c.due;
        if (d <= td) due.push({ e: e, d: d });
        else if (c.consecMiss > 0) missed.push({ e: e, l: c.last || 0 });
        else if (c.reps > 0) recentL.push({ e: e, l: c.last || 0 });
      }
      var counted = opts && opts.count;
      var allowNew = counted && (opts.gkind === 'slova' || opts.gkind === 'frazy') ? st.newN < 4 : st.newN * 3 <= st.asked;
      var got = null, mode = null;
      if (due.length) {
        due.sort(function (a, b) { return a.d - b.d || a.e.rank - b.e.rank; });
        got = pick(due.filter(function (x) { return x.d === due[0].d; }).slice(0, 5), rng).e; mode = 'due';
      } else if (missed.length) {
        missed.sort(function (a, b) { return b.l - a.l; });
        got = missed[0].e; mode = 'missed';
      } else if (fresh && (strict ? st.newN < 4 : allowNew)) {
        got = fresh; mode = 'new';
      } else if (strict) {
        got = null;
      } else if (recentL.length) {
        recentL.sort(function (a, b) { return b.l - a.l; });
        got = pick(recentL.slice(0, 12), rng).e; mode = 'recent';
      } else if (fresh) {
        got = fresh; mode = 'new';
      } else if (any.length) {
        got = pick(any, rng); mode = 'again';
      }
      if (got) {
        st.used[got.id] = 1; st.asked++;
        if (mode === 'new') { st.newN++; st.lastNew = got.id; }
        return { e: got, mode: mode, G: G, st: st };
      }
      if (strict) return null;
      st.used = {};                                   // the whole list has been dealt this round: start over
    }
    return null;
  }

  var GENDER = { m: 'masculine', f: 'feminine', n: 'neuter' };
  function wordNote(e) {
    var bits = [];
    if (e.pos === 'n' && GENDER[e.g]) bits.push(e.ru + ', ' + GENDER[e.g]);
    return bits.length ? bits.join(' · ') : null;
  }
  function trMap(texts) {
    var m = {};
    texts.forEach(function (t) { m[t] = RU.translit(t); });
    return m;
  }
  function wordItem(rung, rng, opts) {
    var p = grindPick(opts, rng, wordList());
    if (!p) return null;
    var e = p.e, G = p.G;
    var short = e.ru.split(/\s+/).length <= 3;
    var level = GC.wordLevel(e.id);
    var item = { kind: 'slova', cefr: e.b, bonus: 0, id: e.id, topic: null, note: wordNote(e), ru: e.ru,
      en: e.en, prompt: e.en, answer: e.ru, level: level, optRu: true, grind: p.mode, rank: e.rank + 1,
      firstSight: p.mode === 'new', say: { t: e.ru, v: 'ru' },
      trAnswer: (level !== 'bare' && GC.showTranslit(e.id, e.b)) ? RU.translit(e.ru) : null };
    var wrong = wordDistractors(e, G, rng);
    var known = answeredRight(e.id);
    if (wrong) {
      item.options = shuffle([e.ru].concat(wrong.map(function (o) { return o.ru; })), rng);
      if (level !== 'bare' && GC.showTranslit(e.id, e.b)) item.optTr = trMap(item.options);
    }
    // one in five known words is heard instead of read: play it, pick the written word
    if (known && wrong && window.RU.has(e.ru) && rnd(rng) < 0.2) {
      item.play = 'choose'; item.hear = true; item.prompt = ''; item.promptSay = { t: e.ru, v: 'ru' };
      item.sub = null; item.optTr = null;
      return item;
    }
    if (short && known) {
      item.play = 'type';
      var acc = [e.ru].concat(e.alt);
      (G.byEn[e.en.toLowerCase()] || []).forEach(function (o) { if (o.ru !== e.ru) acc.push(o.ru); });
      item.accept = acc;
      return item;
    }
    if (!wrong) return null;
    item.play = 'choose';
    return item;
  }

  // ---- PHRASES ----------------------------------------------------------------------------
  function phraseWords(t) {
    return String(t).replace(/[.,;:!?…"“”«»]|\s[\u2014\u2013]\s/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
  }
  function textOf(p) { return String(p.ru || '').trim(); }
  /* The hand-written transliteration of a phrase, else the machine one. */
  function trOf(p) { return p.tr || RU.translit(textOf(p)); }
  function phraseList() {
    var src = window.RU_PHRASES || [];
    if (PL && PL_KEY === src && PL.n === src.length) return PL;
    var list = [], byTheme = {}, byEn = {}, seen = {};
    src.forEach(function (p) {
      if (!p || !p.ru || !p.en) return;
      var id = p.id || p.ru;
      if (seen[id]) return;
      seen[id] = 1;
      var e = { raw: p, pid: id, en: p.en, th: p.th || 'frazy', b: p.b || 'A1', note: p.n || null,
        id: 'p:' + id, rank: list.length, alt: p.alt || [] };
      list.push(e);
      (byTheme[e.th] = byTheme[e.th] || []).push(e);
      (byEn[e.en.toLowerCase()] = byEn[e.en.toLowerCase()] || []).push(e);
    });
    PL = { list: list, byTheme: byTheme, byEn: byEn, bandCap: true, n: src.length };
    PL_KEY = src;
    return PL;
  }
  function phraseDistractors(e, G, rng) {
    var mine = textOf(e.raw), chosen = [];
    var myAlt = e.alt.concat([mine]);
    function ok(o) {
      var t = textOf(o.raw);
      if (o === e || o.en.toLowerCase() === e.en.toLowerCase()) return false;
      for (var i = 0; i < myAlt.length; i++) if (same(myAlt[i], t)) return false;
      for (i = 0; i < chosen.length; i++) if (same(chosen[i].t, t) || chosen[i].o.en.toLowerCase() === o.en.toLowerCase()) return false;
      return true;
    }
    var th = G.byTheme[e.th] || [];
    var len = phraseWords(mine).length;
    var stages = [
      function () { return th.filter(function (o) { return Math.abs(phraseWords(textOf(o.raw)).length - len) <= 1; }); },
      function () { return th; },
      function () { return G.list.filter(function (o) { return Math.abs(phraseWords(textOf(o.raw)).length - len) <= 2; }); },
      function () { return G.list; }
    ];
    for (var s = 0; s < stages.length && chosen.length < 3; s++) {
      var pool = shuffle(stages[s]().slice(), rng);
      for (var i = 0; i < pool.length && chosen.length < 3; i++) if (ok(pool[i])) chosen.push({ o: pool[i], t: textOf(pool[i].raw) });
    }
    return chosen.length === 3 ? chosen.map(function (c) { return { t: c.t, tr: trOf(c.o.raw) }; }) : null;
  }
  /* Typed at five words or fewer, built from chips at six to eight, tapped
   * until it has been answered right once. */
  function phraseItem(rung, rng, opts) {
    var G = phraseList();
    if (!G.list.length) return null;
    var p = grindPick(opts, rng, G, 'ph');
    if (!p) return null;
    var e = p.e, known = answeredRight(e.id), raw = e.raw;
    var text = textOf(raw), n = phraseWords(text).length;
    var talk = !!(opts && opts.talk);
    var item = { kind: 'frazy', cefr: e.b, bonus: 0, id: e.id, topic: null, note: e.note, ru: text, en: e.en,
      prompt: e.en, answer: text, accept: [text].concat(e.alt), level: GC.sentenceLevel(e.b), optRu: true,
      grind: p.mode, firstSight: p.mode === 'new', rank: e.rank + 1, noteOnRight: !!e.note,
      say: { t: text, v: 'ru' } };
    /* Script fade: the sound sits under the Cyrillic until the phrase is known, then the Cyrillic stands alone. */
    var showTr = !known || talk;
    if (showTr) item.trAnswer = trOf(raw);
    if (talk) return talkPhrase(item, e, G, rng, known);
    if (known && n <= 5) { item.play = 'type'; return item; }
    if (known && n <= 8) {
      item.play = 'build'; item.words = phraseWords(text); item.answer = item.words.join(' '); item.reveal = text;
      return item;
    }
    var wrong = phraseDistractors(e, G, rng);
    if (!wrong) return null;
    item.play = 'choose';
    item.options = shuffle([text].concat(wrong.map(function (w) { return w.t; })), rng);
    if (showTr) {
      item.optTr = {};
      item.optTr[text] = trOf(raw);
      wrong.forEach(function (w) { item.optTr[w.t] = w.tr; });
    }
    return item;
  }

  /* Talk mode: the sound leads and the Cyrillic sits smaller above it, whether or not the phrase is known.
   * Tapped only (a pick, or the sound's words once known), never typed. */
  function talkPhrase(item, e, G, rng, known) {
    var raw = e.raw, tr = trOf(raw), words = tr.replace(/\s+/g, ' ').trim().split(' ');
    delete item.trAnswer; delete item.optRu;
    item.accept = [tr]; item.level = 'full'; item.ansLatin = true;
    if (known && words.length >= 2 && words.length <= 7) {
      item.play = 'build'; item.latin = true; item.words = words; item.answer = words.join(' '); item.reveal = tr;
      return item;
    }
    var wrong = phraseDistractors(e, G, rng);
    if (!wrong) return null;
    var seen = {}, opts = [{ t: item.ru, tr: tr }];
    seen[tr] = 1;
    wrong.forEach(function (w) { if (!seen[w.tr]) { seen[w.tr] = 1; opts.push(w); } });
    if (opts.length < 4) return null;
    item.play = 'choose'; item.answer = tr;
    item.options = shuffle(opts.map(function (o) { return o.tr; }), rng);
    item.optScript = {};
    opts.forEach(function (o) { item.optScript[o.tr] = o.t; });
    return item;
  }

  // ---- the mix --------------------------------------------------------------------------------
  /* 35% glagoly, 35% slova, 10% frazy, 20% the four grammar tiles (5% each).
   * An empty bank is skipped: the draw falls to the next kind in a random order. */
  function mixItem(rung, rng, opts) {
    var table = [['glagoly', 35], ['slova', 35], ['frazy', 10]];
    GRAMMAR_KINDS.forEach(function (k) { table.push([k, 5]); });
    var live = table.filter(function (r) { return bankCount(r[0]) > 0; });
    var order = [];
    while (live.length) {
      var total = live.reduce(function (n, r) { return n + r[1]; }, 0), x = rnd(rng) * total, i = 0;
      for (; i < live.length - 1; i++) { x -= live[i][1]; if (x <= 0) break; }
      order.push(live[i][0]);
      live.splice(i, 1);
    }
    for (var j = 0; j < order.length; j++) {
      var it = draw(order[j], rung, rng, opts);
      if (it) return it;
    }
    return null;
  }

  function draw(kind, rung, rng, opts) {
    switch (kind) {
      case 'slova': return wordItem(rung, rng, opts);
      case 'frazy': return phraseItem(rung, rng, opts);
      case 'igrat': return mixItem(rung, rng, opts);
      default:
        return GAP_KINDS.indexOf(kind) !== -1 ? dealGap(kind, rng, opts) : mixItem(rung, rng, opts);
    }
  }
  // Retry around the generators, which legitimately return null when a draw lands somewhere thin.
  function next(kind, rung, rng, opts) {
    for (var i = 0; i < 12; i++) {
      var it = draw(kind, rung, rng, opts);
      if (it) return it;
    }
    return null;
  }

  // ---- grading -----------------------------------------------------------------------------------
  /* 'good' | 'near' (a soft sign, й, щ or э slip) | 'wrong'. Stress marks and ё never count. */
  function grade(item, input) { return RU.check(input, item.accept || [item.answer]); }
  // the words of a text without vowel marks, for the round's correction diff
  function words(s) { return RU.strip(s).split(' ').filter(Boolean); }

  // ---- your own misses, as a deck ------------------------------------------------------------------
  function missDeck(kind, max) {
    if (!window.ErrorLog) return [];
    var out = [];
    window.ErrorLog.list().forEach(function (e) {
      if (out.length >= (max || 20)) return;
      if (!e.id || e.id.indexOf('g:') !== 0) return;
      if (kind && kind !== 'igrat' && kind !== 'mixed' && e.kind !== kind) return;
      if (bankIndex().byId[e.id]) out.push({ id: e.id });
    });
    return out;
  }
  function deckItem(deck, rng) {
    var c = pick(deck, rng);
    var g = c && bankIndex().byId[c.id];
    return g ? gapItem(g, true) : null;
  }

  // ---- coverage, for the progress panel ---------------------------------------------------------------
  var MILESTONES = [100, 250, 500, 1000, 2000, 5000];
  function prettyTheme(id) {
    var s = String(id || '').replace(/[_-]+/g, ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function coverage(theme) {
    var G = wordList(), L = G.list;
    function known(e) { return knownCard(stateOf(e.id)); }
    var total = 0;
    L.forEach(function (e) { if (known(e)) total++; });
    var M = L.length;
    for (var i = 0; i < MILESTONES.length; i++) if (MILESTONES[i] > total) { M = Math.min(MILESTONES[i], L.length); break; }
    var n = 0;
    for (var j = 0; j < M; j++) if (known(L[j])) n++;
    var out = { n: n, of: M, total: total, theme: null,
      text: M ? 'You know ' + thousands(n) + ' of the ' + thousands(M) + ' commonest words' : 'No words yet' };
    if (theme && G.byTheme[theme]) {
      var tn = 0;
      G.byTheme[theme].forEach(function (e) { if (known(e)) tn++; });
      out.theme = { id: theme, n: tn, of: G.byTheme[theme].length, label: prettyTheme(theme),
        text: tn + ' of ' + G.byTheme[theme].length + ' in ' + prettyTheme(theme) };
    }
    return out;
  }
  /* Of the learner's own phrases ('id:' entries in themes): how many a round could ask today
   * (due, missed or new, none learnt). Under ROUND_LOW the sheet and the end screen say so. */
  function mineReady(themes) {
    var ids = {}, n = 0, total = 0, td = today();
    (themes || []).forEach(function (t) { if (String(t).indexOf('id:') === 0) ids[String(t).slice(3)] = 1; });
    phraseList().list.forEach(function (e) {
      if (!ids[e.id]) return;
      total++;
      var c = stateOf(e.id);
      if (c && c.learnt) return;
      if (!c || !(c.reps > 0) || (c.due == null ? 0 : c.due) <= td || c.consecMiss > 0) n++;
    });
    return { ready: n, total: total, low: total > 0 && n < 10 };
  }
  function phraseCoverage(themes) {
    var G = phraseList(), L = G.list, n = 0, focus = !!(themes && themes.length);
    if (focus) L = L.filter(function (e) { return themes.indexOf(e.th) !== -1 || themes.indexOf('id:' + e.id) !== -1; });
    var of = L.length;
    L.forEach(function (e) { if (knownCard(stateOf(e.id))) n++; });
    return { n: n, of: of, text: of ? 'You know ' + thousands(n) + ' of ' + thousands(of) + (focus ? ' phrases in these topics' : ' phrases') : 'No phrases yet' };
  }
  /* Distinct verbs with a glagoly sentence known. */
  function verbsKnown() {
    var seen = {}, n = 0;
    bank('glagoly').forEach(function (g) {
      if (g.v && !seen[g.v] && knownCard(stateOf(gapId(g)))) { seen[g.v] = 1; n++; }
    });
    return n;
  }
  function gapCoverage(kind) {
    var all = bank(kind), n = 0;
    all.forEach(function (g) { if (knownCard(stateOf(gapId(g)))) n++; });
    return { n: n, of: all.length };
  }
  function grindThemes() {
    var G = wordList();
    return Object.keys(G.byTheme).map(function (id) { return { id: id, label: prettyTheme(id), count: G.byTheme[id].length }; });
  }
  function topicsOf(kind) {
    var seen = {}, out = [];
    bank(kind).forEach(function (g) { if (g.t && !seen[g.t]) { seen[g.t] = 1; out.push(g.t); } });
    return out;
  }

  return {
    GAP_KINDS: GAP_KINDS, GRAMMAR_KINDS: GRAMMAR_KINDS,
    draw: draw, next: next, grade: grade, reset: reset, words: words, phraseWords: phraseWords,
    deckItem: deckItem, missDeck: missDeck, knownCard: knownCard, answeredRight: answeredRight,
    bankCount: bankCount, bank: bank, topicsOf: topicsOf, gapId: gapId,
    coverage: coverage, phraseCoverage: phraseCoverage, mineReady: mineReady, verbsKnown: verbsKnown, gapCoverage: gapCoverage,
    grindThemes: grindThemes, grindList: wordList, phraseList: phraseList, prettyTheme: prettyTheme, thousands: thousands,
    textOf: textOf, trOf: trOf
  };
})();
