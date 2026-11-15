/* ============================================================================
 * FR ITEMS: the item source for the round engine (js/gameround.js).
 *
 * Kinds: vb, genre, pron, neg, prep (the GAP banks, one array
 * window.FR_BANK filtered by k), mots (the word grind over window.FR_WORDS),
 * phrases (window.FR_PHRASES), jouer (the mix). The rule that runs through all of
 * them: TAP FIRST, TYPE ONCE KNOWN. An item answered right once (and not missed
 * since) comes back typed; the English is always the prompt or one tap away and
 * the French is always what is asked for.
 *
 * Banks may be empty or missing: every function degrades to null / 0.
 * ========================================================================== */
window.FRItems = (function () {
  var FR = window.FR, GC = window.FRCore;
  var BANDS = GC.BANDS;
  var GAP_KINDS = ['vb', 'genre', 'pron', 'neg', 'prep'];
  var GRAMMAR_KINDS = ['genre', 'pron', 'neg', 'prep'];
  var RECENT_KEY = 'couramment.recent', RECENT_KEEP = 80;

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
    var all = window.FR_BANK || [];
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
    if (kind === 'mots') return wordList().list.length;
    if (kind === 'phrases') return phraseList().list.length;
    if (kind === 'jouer') return GAP_KINDS.reduce(function (n, k) { return n + bank(k).length; }, 0) +
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
    var inFr = bandIx(playerBand()) >= 2, w = g.w || null, wf = g.wf || null;
    if (inFr && wf) return { note: wf, noteAlt: w, noteAltLabel: 'in English' };
    return { note: w, noteAlt: wf, noteAltLabel: 'en français' };
  }
  function gapItem(g, forceChoose) {
    var id = gapId(g), n = gapNote(g);
    return { kind: g.k, play: (!forceChoose && answeredRight(id)) ? 'type' : 'choose', cefr: g.b || 'A1',
      topic: g.k + ':' + (g.t || ''), id: id, prompt: g.q.replace(/___+/g, '＿＿＿'), answer: g.a,
      accept: [g.a].concat(g.x || []), options: shuffle(g.o.slice()),
      sub: null, peek: g.e || null, note: n.note, noteAlt: n.noteAlt, noteAltLabel: n.noteAltLabel,
      bonus: 20 };
  }
  // opts.tenses (ww) / opts.topics (the others): t values to keep
  function gapPool(kind, opts) {
    var pool = bank(kind);
    var only = kind === 'vb' ? (opts && opts.tenses) : (opts && opts.topics);
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

  /* The article a noun shows: le, la, l' (a vowel or a mute h: the gender then goes in brackets
   * after the word), le/la for either. Adjectives, verbs and the rest show none. */
  var H_ASPIRE = /^(hache|hamac|hamburger|hanche|handicap|hangar|haricot|harpe|hasard|haut|hérisson|héros|hêtre|hibou|hockey|homard|honte|huit|hurler|hublot|hall|halte|harceler|haïr|hanter|hasch|hennir)/;
  function articleOf(w, fr) {
    if (w.g !== 'm' && w.g !== 'f' && w.g !== 'mf') return null;
    var vowel = /^[aeiouyàâäéèêëîïôöùûüœ]/i.test(fr) || (/^h/i.test(fr) && !H_ASPIRE.test(fr.toLowerCase()));
    if (w.g === 'mf') return vowel ? "l'" : 'le/la';
    return vowel ? "l'" : w.g === 'm' ? 'le' : 'la';
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
    var src = window.FR_WORDS || [];
    if (WL && WL_KEY === src && WL.n === src.length) return WL;
    var seen = {}, list = [];
    src.forEach(function (w) {
      if (!w || !w.fr || !w.en) return;
      var fr = String(w.fr).trim();
      if (!fr || seen[fr]) return;
      seen[fr] = 1;
      var art = articleOf(w, fr), full = art ? (art.slice(-1) === "'" ? art + fr + ' (' + w.g + ')' : art + ' ' + fr) : fr;
      list.push({ fr: fr, full: full, art: art, en: String(w.en), g: w.g || null, pl: w.pl || null, fem: w.fem || null, th: w.th || null,
        b: w.b || 'A1', r: w.r || 1e9, pos: w.pos || 'x', id: 'w:' + fr, gl: glossSet(w.en), alt: w.alt || [] });
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
      if (o.fr === e.fr || glossClash(e, o) || e.alt.indexOf(o.fr) !== -1 || (o.alt || []).indexOf(e.fr) !== -1) return false;
      for (var i = 0; i < chosen.length; i++) if (chosen[i].fr === o.fr || glossClash(chosen[i], o)) return false;
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
   * above the player's. `sub` keeps one state per list inside a Jouer round. */
  function grindPick(opts, rng, G, sub) {
    if (!G.list.length) return null;
    var st = (opts && opts.grind) || { asked: 0, newN: 0, used: {} };
    if (sub && opts && opts.grind) st = st[sub] = st[sub] || { asked: 0, newN: 0, used: {} };
    st.used = st.used || {}; st.asked = st.asked || 0; st.newN = st.newN || 0;
    var L = !sub && opts && opts.theme && G.byTheme[opts.theme] ? G.byTheme[opts.theme] : G.list;
    /* opts.themes (an array) is the Phrases sheet's topic focus: the union of those themes, in rank order. */
    if (sub === 'ph' && opts && opts.gkind === 'phrases' && opts.themes && opts.themes.length) {
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
      var allowNew = counted && (opts.gkind === 'mots' || opts.gkind === 'phrases') ? st.newN < 4 : st.newN * 3 <= st.asked;
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
        return { e: got, mode: mode, G: G };
      }
      if (strict) return null;
      st.used = {};                                   // the whole list has been dealt this round: start over
    }
    return null;
  }

  function wordNote(e) {
    var bits = [];
    if (e.art) bits.push(e.full);
    if (e.fem) bits.push('feminine ' + e.fem);
    if (e.pl) bits.push('plural ' + e.pl);
    return bits.length ? bits.join(' · ') : null;
  }
  function wordItem(rung, rng, opts) {
    var p = grindPick(opts, rng, wordList());
    if (!p) return null;
    var e = p.e, G = p.G;
    var short = e.fr.split(/\s+/).length <= 3;
    var item = { kind: 'mots', cefr: e.b, bonus: 0, id: e.id, topic: null, note: wordNote(e), fr: e.fr,
      en: e.en, prompt: e.en, answer: e.full, grind: p.mode, rank: e.rank + 1, firstSight: p.mode === 'new' };
    var wrong = wordDistractors(e, G, rng);
    if (wrong) item.options = shuffle([e.full].concat(wrong.map(function (o) { return o.full; })), rng);
    if (short && answeredRight(e.id)) {
      item.play = 'type';
      item.accept = typedAccept(e, G);
      return item;
    }
    if (!wrong) return null;
    item.play = 'choose';
    return item;
  }

  // ---- PHRASES ----------------------------------------------------------------------------
  function phraseWords(fr) { return fr.replace(/[.,;:!?¿¡"“”]/g, '').replace(/\s+/g, ' ').trim().split(' '); }
  function phraseList() {
    var src = window.FR_PHRASES || [];
    if (PL && PL_KEY === src && PL.n === src.length) return PL;
    var list = [], byTheme = {}, byEn = {}, seen = {};
    src.forEach(function (p) {
      if (!p || !p.fr || !p.en || seen[p.fr]) return;
      seen[p.fr] = 1;
      var e = { fr: p.fr, en: p.en, alt: p.alt || [], th: p.th || 'phrases', b: p.b || 'A1', tier: p.t || 1,
        note: p.n || null, id: 'p:' + p.fr, rank: list.length, n: phraseWords(p.fr).length };
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
      if (o.fr === e.fr || o.en.toLowerCase() === e.en.toLowerCase() || e.alt.indexOf(o.fr) !== -1) return false;
      // another entry that is this one's alternative (or shares one) would be a second right answer
      if ((o.alt || []).indexOf(e.fr) !== -1 || (o.alt || []).some(function (a) { return e.alt.indexOf(a) !== -1; })) return false;
      for (var i = 0; i < chosen.length; i++) if (chosen[i].fr === o.fr || chosen[i].en.toLowerCase() === o.en.toLowerCase()) return false;
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
    var item = { kind: 'phrases', cefr: e.b, bonus: 0, id: e.id, topic: null, note: e.note, fr: e.fr, en: e.en,
      prompt: e.en, answer: e.fr, grind: p.mode, firstSight: p.mode === 'new', rank: e.rank + 1,
      noteOnRight: !!e.note };
    if (known && e.n <= 6) { item.play = 'type'; item.accept = [e.fr].concat(e.alt); return item; }
    if (known && e.n <= 8) {
      item.play = 'build'; item.words = phraseWords(e.fr); item.answer = item.words.join(' '); item.reveal = e.fr;
      return item;
    }
    var wrong = phraseDistractors(e, G, rng);
    if (!wrong) return null;
    item.play = 'choose';
    item.options = shuffle([e.fr].concat(wrong.map(function (o) { return o.fr; })), rng);
    return item;
  }

  // ---- the mix --------------------------------------------------------------------------------
  /* 35% vb, 35% mots, 10% phrases, 20% the four grammar tiles (5% each).
   * An empty bank is skipped: the draw falls to the next kind in a random order. */
  function mixItem(rung, rng, opts) {
    var table = [['vb', 35], ['mots', 35], ['phrases', 10]];
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
      case 'mots': return wordItem(rung, rng, opts);
      case 'phrases': return phraseItem(rung, rng, opts);
      case 'jouer': return mixItem(rung, rng, opts);
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
  /* 'good' | 'near' (an accent slip: een for één) | 'wrong' */
  function grade(item, input) { return FR.check(input, item.accept || [item.answer]); }
  // the words of a text, folded, for the round's correction diff
  function words(s) { return FR.fold(s).split(' ').filter(Boolean); }

  // ---- your own misses, as a deck ------------------------------------------------------------------
  /* Only the gap kinds are revisited (words and phrases are dealt missed-first by
   * their grind): the entry's id finds the bank row, and it comes back tapped. */
  function missDeck(kind, max) {
    if (!window.ErrorLog) return [];
    var out = [];
    window.ErrorLog.list().forEach(function (e) {
      if (out.length >= (max || 20)) return;
      if (!e.id || e.id.indexOf('g:') !== 0) return;
      if (kind && kind !== 'jouer' && kind !== 'mixed' && e.kind !== kind) return;
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
  // French label with the English, for every word theme and phrase theme in the data
  var THEME_LABELS = {
    base: 'Base (Basics)', faire: 'Faire (Doing)', decrire: 'Décrire (Describing)', nourriture: 'Nourriture (Food and drink)', nombres: 'Nombres (Numbers)',
    couleurs: 'Couleurs (Colours)', famille: 'Famille (Family)', gens: 'Gens (People)', corps: 'Corps (Body)',
    manger: 'Manger (Food and drink)', maison: 'Maison (Home)', ville: 'Ville (Town)', voyage: 'Voyage (Travel)',
    meteo: 'Météo (Weather)', temps: 'Temps (Time)', travail: 'Travail (Work)', ecole: 'École (School)',
    loisirs: 'Loisirs (Free time)', vetements: 'Vêtements (Clothes)', sentiments: 'Sentiments (Feelings)',
    nature: 'Nature (Nature)', langue: 'Langue (Language)', societe: 'Société (Society)',
    saluer: 'Saluer (Greetings)', moi: 'Moi (About me)', conversation: 'Conversation (Conversation)',
    magasin: 'Magasin (Shops and cafés)', aide: 'Aide (Asking for help)', fete: 'Fête (Celebrations)'
  };
  function prettyTheme(id) {
    if (THEME_LABELS[id]) return THEME_LABELS[id];
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
    var G = phraseList(), of = G.list.length, n = 0, focus = !!(themes && themes.length);
    var L = focus ? G.list.filter(function (e) { return themes.indexOf(e.th) !== -1 || themes.indexOf('id:' + e.id) !== -1; }) : G.list;
    if (focus) {
      L.forEach(function (e) { if (knownCard(stateOf(e.id))) n++; });
      return { n: n, of: L.length, text: L.length ? 'You know ' + thousands(n) + ' of ' + thousands(L.length) + ' phrases in these topics' : 'No phrases in these topics yet' };
    }
    G.list.forEach(function (e) { if (knownCard(stateOf(e.id))) n++; });
    return { n: n, of: of, text: of ? 'You know ' + thousands(n) + ' of ' + thousands(of) + ' phrases' : 'No phrases yet' };
  }
  /* Distinct verbs with a ww sentence known. */
  function verbsKnown() {
    var seen = {}, n = 0;
    bank('vb').forEach(function (g) {
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
  // tense keys (ww) or topic keys (the rest) that have items, in first-seen order
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

  // ---- the word test (Test de mots) --------------------------------------------------------------
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
  /* A typed word is right with or without its article (maison, la maison, l'arbre, arbre). */
  function typedAccept(e, G) {
    var acc = [e.full, e.fr].concat(e.alt || []);
    if (e.art && e.art.slice(-1) === "'") acc.push(e.art + e.fr);
    if (e.g === 'mf') acc.push('le ' + e.fr, 'la ' + e.fr);
    (G.byEn[e.en.toLowerCase()] || []).forEach(function (o) { if (o.fr !== e.fr) acc.push(o.full, o.fr); });
    return acc;
  }
  function wordTestAccept(e) {
    return typedAccept(e, wordList());
  }
  function wordTestGrade(e, input) {
    return FR.check(input, wordTestAccept(e)) === 'wrong' ? 'wrong' : 'good';
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
        if (wrong) out.push({ band: b, kind: 'mots', prompt: e.en, peek: null,
          options: shuffle([e.full].concat(wrong.map(function (o) { return o.full; })), rng), answer: e.full, accept: [e.full, e.fr] });
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
    coverage: coverage, phraseCoverage: phraseCoverage, mineReady: mineReady, verbsKnown: verbsKnown, gapCoverage: gapCoverage,
    grindThemes: grindThemes, grindList: wordList, phraseList: phraseList, prettyTheme: prettyTheme, thousands: thousands,
    wordTestNext: wordTestNext, wordTestGrade: wordTestGrade, wordTestRight: wordTestRight, wordTestMiss: wordTestMiss,
    placementItems: placementItems
  };
})();
