/* ============================================================================
 * GA ITEMS: the item source for the round engine (js/gameround.js).
 *
 * Kinds: briathra, seimhiu, forainm, tais, freagair (the GAP banks, one array
 * window.GA_BANK filtered by k), focail (the word grind over window.GA_WORDS),
 * frasai (window.GA_PHRASES), imir (the mix). The rule that runs through all of
 * them: TAP FIRST, TYPE ONCE KNOWN. An item answered right once (and not missed
 * since) comes back typed; the English is always the prompt or one tap away and
 * the Irish is always what is asked for.
 *
 * Banks may be empty or missing: every function degrades to null / 0.
 * ========================================================================== */
window.GAItems = (function () {
  var GA = window.GA, GC = window.GACore;
  var BANDS = GC.BANDS;
  var GAP_KINDS = ['briathra', 'seimhiu', 'forainm', 'tais', 'freagair'];
  var GRAMMAR_KINDS = ['seimhiu', 'forainm', 'tais', 'freagair'];
  var RECENT_KEY = 'liofa.recent', RECENT_KEEP = 80;

  function rnd(rng) { return (rng || Math.random)(); }
  function pick(arr, rng) { return arr && arr.length ? arr[Math.floor(rnd(rng) * arr.length)] : null; }
  function shuffle(a, rng) { return GC.shuffle(a, rng); }
  function bandIx(b) { var i = BANDS.indexOf(b); return i < 0 ? 0 : i; }
  function playerBand() { return (window.Profile && window.Profile.current && window.Profile.current()) || 'A1'; }
  function stateOf(id) { return window.SRS && window.SRS.state ? window.SRS.state(id) : null; }
  function today() { return window.SRS && window.SRS.today ? window.SRS.today() : Math.floor(Date.now() / 864e5); }
  function thousands(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* KNOWN: learnt for good, or answered right and not missed since. NOT reps > 0:
   * the SRS counts every review in reps, wrong ones too. */
  function knownCard(c) {
    return !!(c && typeof c === 'object' && (c.learnt || (c.passed && !(c.consecMiss > 0))));
  }
  function answeredRight(id) { return id ? knownCard(stateOf(id)) : false; }

  // ---- the banks ---------------------------------------------------------------
  var BANK = null, BANK_N = -1, WL = null, WL_KEY = null, PL = null, PL_KEY = null;
  function bankIndex() {
    var all = window.GA_BANK || [];
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
    if (kind === 'focail') return wordList().list.length;
    if (kind === 'frasai') return phraseList().list.length;
    if (kind === 'imir') return GAP_KINDS.reduce(function (n, k) { return n + bank(k).length; }, 0) +
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
  function gapNote(g) {
    var inGa = bandIx(playerBand()) >= 2, w = g.w || null, wg = g.wg || null;
    if (inGa && wg) return { note: wg, noteAlt: w, noteAltLabel: 'in English' };
    return { note: w, noteAlt: wg, noteAltLabel: 'as Gaeilge' };
  }
  function gapItem(g, forceChoose) {
    var id = gapId(g), n = gapNote(g);
    return { kind: g.k, play: (!forceChoose && answeredRight(id)) ? 'type' : 'choose', cefr: g.b || 'A1',
      topic: g.k + ':' + (g.t || ''), id: id, prompt: g.q.replace(/___+/g, '＿＿＿'), answer: g.a,
      accept: [g.a].concat(g.x || []), options: shuffle(g.o.slice()),
      sub: null, peek: g.e || null, note: n.note, noteAlt: n.noteAlt, noteAltLabel: n.noteAltLabel,
      bonus: 20 };
  }
  // opts.tenses (briathra) / opts.topics (the others): t values to keep
  function gapPool(kind, opts) {
    var pool = bank(kind);
    var only = kind === 'briathra' ? (opts && opts.tenses) : (opts && opts.topics);
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
    var src = window.GA_WORDS || [];
    if (WL && WL_KEY === src && WL.n === src.length) return WL;
    var seen = {}, list = [];
    src.forEach(function (w) {
      if (!w || !w.ga || !w.en) return;
      var ga = String(w.ga).trim();
      if (!ga || seen[ga]) return;
      seen[ga] = 1;
      list.push({ ga: ga, en: String(w.en), g: w.g || null, pl: w.pl || null, th: w.th || null,
        b: w.b || 'A1', r: w.r || 1e9, pos: w.pos || 'x', id: 'w:' + ga, gl: glossSet(w.en) });
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
      if (o.ga === e.ga || glossClash(e, o)) return false;
      for (var i = 0; i < chosen.length; i++) if (chosen[i].ga === o.ga || glossClash(chosen[i], o)) return false;
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
   * above the player's. `sub` keeps one state per list inside a Imir round. */
  function grindPick(opts, rng, G, sub) {
    if (!G.list.length) return null;
    var st = (opts && opts.grind) || { asked: 0, newN: 0, used: {} };
    if (sub && opts && opts.grind) st = st[sub] = st[sub] || { asked: 0, newN: 0, used: {} };
    st.used = st.used || {}; st.asked = st.asked || 0; st.newN = st.newN || 0;
    var L = !sub && opts && opts.theme && G.byTheme[opts.theme] ? G.byTheme[opts.theme] : G.list;
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
          if (bandIx(e.b) > capIx) continue;
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
      var allowNew = counted && (opts.gkind === 'focail' || opts.gkind === 'frasai') ? st.newN < 4 : st.newN * 3 <= st.asked;
      var got = null, mode = null;
      if (due.length) {
        due.sort(function (a, b) { return a.d - b.d || a.e.rank - b.e.rank; });
        got = pick(due.filter(function (x) { return x.d === due[0].d; }).slice(0, 5), rng).e; mode = 'due';
      } else if (missed.length) {
        missed.sort(function (a, b) { return b.l - a.l; });
        got = missed[0].e; mode = 'missed';
      } else if (fresh && allowNew) {
        got = fresh; mode = 'new';
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
        return { e: got, mode: mode, G: G };
      }
      st.used = {};                                   // the whole list has been dealt this round: start over
    }
    return null;
  }

  function wordNote(e) {
    var bits = [];
    if (e.g) bits.push(e.ga + ', ' + (e.g === 'f' ? 'feminine' : 'masculine'));
    if (e.pl) bits.push('plural ' + e.pl);
    return bits.length ? bits.join(' · ') : null;
  }
  function wordItem(rung, rng, opts) {
    var p = grindPick(opts, rng, wordList());
    if (!p) return null;
    var e = p.e, G = p.G;
    var short = e.ga.split(/\s+/).length <= 3;
    var item = { kind: 'focail', cefr: e.b, bonus: 0, id: e.id, topic: null, note: wordNote(e), ga: e.ga,
      en: e.en, prompt: e.en, answer: e.ga, grind: p.mode, rank: e.rank + 1, firstSight: p.mode === 'new' };
    var wrong = wordDistractors(e, G, rng);
    if (wrong) item.options = shuffle([e.ga].concat(wrong.map(function (o) { return o.ga; })), rng);
    if (short && answeredRight(e.id)) {
      item.play = 'type';
      var acc = [e.ga];
      (G.byEn[e.en.toLowerCase()] || []).forEach(function (o) { if (o.ga !== e.ga) acc.push(o.ga); });
      item.accept = acc;
      return item;
    }
    if (!wrong) return null;
    item.play = 'choose';
    return item;
  }

  // ---- PHRASES ----------------------------------------------------------------------------
  function phraseWords(ga) { return ga.replace(/[.,;:!?¿¡"“”]/g, '').replace(/\s+/g, ' ').trim().split(' '); }
  function phraseList() {
    var src = window.GA_PHRASES || [];
    if (PL && PL_KEY === src && PL.n === src.length) return PL;
    var list = [], byTheme = {}, byEn = {}, seen = {};
    src.forEach(function (p) {
      if (!p || !p.ga || !p.en || seen[p.ga]) return;
      seen[p.ga] = 1;
      var e = { ga: p.ga, en: p.en, alt: p.alt || [], th: p.th || 'frasai', b: p.b || 'A1', tier: p.t || 1,
        note: p.n || null, id: 'p:' + p.ga, rank: list.length, n: phraseWords(p.ga).length };
      list.push(e);
      (byTheme[e.th] = byTheme[e.th] || []).push(e);
      (byEn[e.en.toLowerCase()] = byEn[e.en.toLowerCase()] || []).push(e);
    });
    PL = { list: list, byTheme: byTheme, byEn: byEn, bandCap: true, n: src.length };
    PL_KEY = src;
    return PL;
  }
  function phraseDistractors(e, G, rng) {
    var chosen = [];
    function ok(o) {
      if (o.ga === e.ga || o.en.toLowerCase() === e.en.toLowerCase() || e.alt.indexOf(o.ga) !== -1) return false;
      for (var i = 0; i < chosen.length; i++) if (chosen[i].ga === o.ga || chosen[i].en.toLowerCase() === o.en.toLowerCase()) return false;
      return true;
    }
    var th = G.byTheme[e.th] || [];
    var stages = [
      function () { return th.filter(function (o) { return o.tier === e.tier; }); },
      function () { return th; },
      function () { return G.list.filter(function (o) { return o.tier === e.tier && Math.abs(o.n - e.n) <= 2; }); },
      function () { return G.list; }
    ];
    for (var s = 0; s < stages.length && chosen.length < 3; s++) {
      var pool = shuffle(stages[s]().slice(), rng);
      for (var i = 0; i < pool.length && chosen.length < 3; i++) if (ok(pool[i])) chosen.push(pool[i]);
    }
    return chosen.length === 3 ? chosen : null;
  }
  /* Typed at six words or fewer, built from chips at seven or eight, tapped
   * until it has been answered right once. */
  function phraseItem(rung, rng, opts) {
    var G = phraseList();
    if (!G.list.length) return null;
    var p = grindPick(opts, rng, G, 'ph');
    if (!p) return null;
    var e = p.e, known = answeredRight(e.id);
    var item = { kind: 'frasai', cefr: e.b, bonus: 0, id: e.id, topic: null, note: e.note, ga: e.ga, en: e.en,
      prompt: e.en, answer: e.ga, grind: p.mode, firstSight: p.mode === 'new', rank: e.rank + 1,
      noteOnRight: !!e.note };
    if (known && e.n <= 6) { item.play = 'type'; item.accept = [e.ga].concat(e.alt); return item; }
    if (known && e.n <= 8) {
      item.play = 'build'; item.words = phraseWords(e.ga); item.answer = item.words.join(' '); item.reveal = e.ga;
      return item;
    }
    var wrong = phraseDistractors(e, G, rng);
    if (!wrong) return null;
    item.play = 'choose';
    item.options = shuffle([e.ga].concat(wrong.map(function (o) { return o.ga; })), rng);
    return item;
  }

  // ---- the mix --------------------------------------------------------------------------------
  /* 35% briathra, 35% focail, 10% frasai, 20% the four grammar tiles (5% each).
   * An empty bank is skipped: the draw falls to the next kind in a random order. */
  function mixItem(rung, rng, opts) {
    var table = [['briathra', 35], ['focail', 35], ['frasai', 10]];
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
      case 'focail': return wordItem(rung, rng, opts);
      case 'frasai': return phraseItem(rung, rng, opts);
      case 'imir': return mixItem(rung, rng, opts);
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
  /* 'good' | 'near' (a fada or n-/t- hyphen slip) | 'wrong' */
  function grade(item, input) { return GA.check(input, item.accept || [item.answer]); }
  // the words of a text, folded, for the round's correction diff
  function words(s) { return GA.fold(s).split(' ').filter(Boolean); }

  // ---- your own misses, as a deck ------------------------------------------------------------------
  /* Only the gap kinds are revisited (words and phrases are dealt missed-first by
   * their grind): the entry's id finds the bank row, and it comes back tapped. */
  function missDeck(kind, max) {
    if (!window.ErrorLog) return [];
    var out = [];
    window.ErrorLog.list().forEach(function (e) {
      if (out.length >= (max || 20)) return;
      if (!e.id || e.id.indexOf('g:') !== 0) return;
      if (kind && kind !== 'imir' && kind !== 'mixed' && e.kind !== kind) return;
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
  function phraseCoverage() {
    var G = phraseList(), of = G.list.length, n = 0;
    G.list.forEach(function (e) { if (knownCard(stateOf(e.id))) n++; });
    return { n: n, of: of, text: of ? 'You know ' + thousands(n) + ' of ' + thousands(of) + ' phrases' : 'No phrases yet' };
  }
  /* Distinct verbs with a briathra sentence known. */
  function verbsKnown() {
    var seen = {}, n = 0;
    bank('briathra').forEach(function (g) {
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
  // tense keys (briathra) or topic keys (the rest) that have items, in first-seen order
  function topicsOf(kind) {
    var seen = {}, out = [];
    bank(kind).forEach(function (g) { if (g.t && !seen[g.t]) { seen[g.t] = 1; out.push(g.t); } });
    return out;
  }
  function lowestBand(kind, t) {
    var best = null;
    bank(kind).forEach(function (g) { if (g.t === t && (best === null || bandIx(g.b) < best)) best = bandIx(g.b); });
    return best === null ? 0 : best;
  }

  // ---- PRUEBA: the word test (Triail focal) --------------------------------------------------------------
  /* Endless, down the frequency list. Right (typed) = permanently learnt; a miss
   * or "I don't know" enrols the word as NEW for tomorrow. */
  function wordTestNext(pos) {
    var G = wordList();
    for (var i = Math.max(0, pos || 0); i < G.list.length; i++) {
      var e = G.list[i];
      if (knownCard(stateOf(e.id))) continue;
      return { e: e, pos: i, rank: i + 1, total: G.list.length };
    }
    return null;
  }
  function wordTestAccept(e) {
    var G = wordList(), acc = [e.ga];
    (G.byEn[e.en.toLowerCase()] || []).forEach(function (o) { if (o.ga !== e.ga) acc.push(o.ga); });
    return acc;
  }
  function wordTestGrade(e, input) {
    return GA.check(input, wordTestAccept(e)) === 'wrong' ? 'wrong' : 'good';
  }
  function wordTestRight(e) { if (window.SRS) window.SRS.learn(e.id); }
  function wordTestMiss(e) { if (window.SRS) window.SRS.enrol(e.id, 1); }

  // ---- PLACEMENT: about twelve mixed questions, A1 to B2 -------------------------------------------------------
  /* Per band: two gap items from different kinds and one word, all tapped (four
   * real options). Returns [{ band, kind, prompt, peek, options, answer }]. */
  function placementItems(rng) {
    var out = [];
    BANDS.forEach(function (b) {
      var kinds = shuffle(GAP_KINDS.filter(function (k) {
        return bank(k).some(function (g) { return g.b === b; });
      }), rng);
      var used = {};
      kinds.slice(0, 2).forEach(function (k) {
        var g = pick(bank(k).filter(function (x) { return x.b === b && !used[x.q]; }), rng);
        if (!g) return;
        used[g.q] = 1;
        out.push({ band: b, kind: k, prompt: g.q.replace(/___+/g, '＿＿＿'), peek: g.e || null,
          options: shuffle(g.o.slice(), rng), answer: g.a, accept: [g.a].concat(g.x || []) });
      });
      // one gap short? take a second from the same kind
      if (kinds.length === 1) {
        var g2 = pick(bank(kinds[0]).filter(function (x) { return x.b === b && !used[x.q]; }), rng);
        if (g2) out.push({ band: b, kind: kinds[0], prompt: g2.q.replace(/___+/g, '＿＿＿'), peek: g2.e || null,
          options: shuffle(g2.o.slice(), rng), answer: g2.a, accept: [g2.a].concat(g2.x || []) });
      }
      var G = wordList();
      var ws = G.list.filter(function (e) { return e.b === b; });
      var e = pick(ws, rng);
      if (e) {
        var wrong = wordDistractors(e, G, rng);
        if (wrong) out.push({ band: b, kind: 'focail', prompt: e.en, peek: null,
          options: shuffle([e.ga].concat(wrong.map(function (o) { return o.ga; })), rng), answer: e.ga, accept: [e.ga] });
      }
      // no word to ask: top the band up to three with more gaps, so the test stays about twelve
      for (var extra = 0; extra < 6 && out.filter(function (x) { return x.band === b; }).length < 3; extra++) {
        var k2 = pick(GAP_KINDS.filter(function (k) { return bank(k).some(function (g) { return g.b === b && !used[g.q]; }); }), rng);
        if (!k2) break;
        var g3 = pick(bank(k2).filter(function (x) { return x.b === b && !used[x.q]; }), rng);
        used[g3.q] = 1;
        out.push({ band: b, kind: k2, prompt: g3.q.replace(/___+/g, '＿＿＿'), peek: g3.e || null,
          options: shuffle(g3.o.slice(), rng), answer: g3.a, accept: [g3.a].concat(g3.x || []) });
      }
    });
    return out;
  }

  return {
    GAP_KINDS: GAP_KINDS, GRAMMAR_KINDS: GRAMMAR_KINDS,
    draw: draw, next: next, grade: grade, reset: reset, words: words,
    deckItem: deckItem, missDeck: missDeck, knownCard: knownCard, answeredRight: answeredRight,
    bankCount: bankCount, bank: bank, topicsOf: topicsOf, lowestBand: lowestBand, gapId: gapId,
    coverage: coverage, phraseCoverage: phraseCoverage, verbsKnown: verbsKnown, gapCoverage: gapCoverage,
    grindThemes: grindThemes, grindList: wordList, phraseList: phraseList, prettyTheme: prettyTheme, thousands: thousands,
    wordTestNext: wordTestNext, wordTestGrade: wordTestGrade, wordTestRight: wordTestRight, wordTestMiss: wordTestMiss,
    placementItems: placementItems
  };
})();
