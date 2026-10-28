/* ============================================================================
 * LIGA — one Traducción round a week, against your friends.
 *
 * Everything else in the games is you against your own last score. This is
 * the one place a score leaves the device: a small league (server/league.sql,
 * on Supabase) where each player's BEST two-minute round of the week is the
 * number on the board.
 *
 * WHAT IS COUNTED. Words translated correctly — not sentences, and not the
 * games' usual points. Sentences lengthen with the band (3.8 words at A1, 6.2
 * at C1), so counting sentences would make promotion cost points and reward
 * staying low; counting words makes a round at your own level worth about the
 * same wherever that level is. An accents-only slip is worth half, as it is
 * everywhere else.
 *
 * WHO PLAYS WHAT. Nobody picks their level. One placement round finds it, and
 * from then on the server moves it, every Monday, on the week's rounds (the
 * rules are in appraise_week). Ten steps, two per band, and the two halves of
 * a band are NOT the same pool: the lower step deals the shorter half of that
 * band's sentences, the upper step the longer half — or promotion from A1 to
 * A1+ would change nothing at all. Four sentences in five come from your step
 * and one from the step above, which is the evidence the appraisal reads.
 *
 * THE SAME SENTENCES FOR EVERYONE on a step, all week: the dealer is seeded by
 * week and step, and the pools are sorted rather than taken in index order, so
 * the app (which builds its index from the corpus) and the arcade (which loads
 * data/game-index.js) agree on what "the 412th A2 sentence" is.
 *
 * OFFLINE FIRST. A finished round goes into an outbox in localStorage and is
 * sent whenever there is a connection; every write is idempotent, so sending
 * twice is harmless. Joining is the one thing that needs a connection.
 *
 * "ESO TAMBIÉN VALE" IS PRICED HERE. In a solo game the claim is free — see
 * js/accepted.js — because the only person it could fool is you. In a league
 * it scores at once and goes to the other players, and one 👎 takes the words
 * back. Approved claims come home into everyone's Accepted list, so the game
 * gets better at marking for the whole league.
 *
 * The key below is Supabase's PUBLISHABLE key: it is meant to ship in a page.
 * What it can do is fenced by row-level security and by the functions in
 * server/league.sql. The league's join code is the secret, and it is not in
 * this repository.
 * ========================================================================== */
window.Liga = (function () {
  var BASE = 'https://oemofcukgewjtokufkqv.supabase.co';
  var APIKEY = 'sb_publishable_F140eRcYaz-AuAXZqaiPnA_WEvqwz31';
  var SKEY = 'fluidez.liga', QKEY = 'fluidez.liga.outbox';
  var TZ = 'Europe/London';          // must match leagues.tz on the server
  var DURATION = 120000, NEXT_SHARE = 0.2, HUE = '#1d7f8c';
  var BUILD_FROM = 6;                // the same line js/gameitems.js draws
  var STEPS = ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+'];
  var DAY = 86400000;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function stepName(s) { return STEPS[(s || 1) - 1] || '—'; }
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }

  // ---- the store -----------------------------------------------------------
  /* { auth: {access, refresh, exp, uid}, name, step,
   *   board: {week, rows, at}, seen: {week, best: {id: words}},
   *   toVote: [{id, who, en, es}], told: [claim ids] } */
  function load() { try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(SKEY, JSON.stringify(o)); } catch (e) {} }
  function joined() { var s = load(); return !!(s.auth && s.name); }

  // ---- the week, in the league's time zone ---------------------------------
  function zoned(d) {
    try {
      var o = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: 'numeric',
        day: 'numeric', weekday: 'short' }).formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
      return { y: +o.year, m: +o.month, d: +o.day,
               wd: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(o.weekday) };
    } catch (e) {
      return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), wd: (d.getDay() + 6) % 7 };
    }
  }
  function isoDay(ms) { return new Date(ms).toISOString().slice(0, 10); }
  // The Monday that starts this week, as the server's week_of() would say it.
  function weekOf(d) {
    var z = zoned(d || new Date());
    return isoDay(Date.UTC(z.y, z.m - 1, z.d) - z.wd * DAY);
  }
  function daysLeft() { return 7 - zoned(new Date()).wd; }
  function localDay() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  // ---- the network ---------------------------------------------------------
  function http(method, path, body, token) {
    var headers = { apikey: APIKEY, 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    return fetch(BASE + path, {
      method: method, headers: headers, cache: 'no-store',
      body: body == null ? undefined : JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (t) {
        var data = null;
        try { data = t ? JSON.parse(t) : null; } catch (e) {}
        if (!res.ok) {
          var err = new Error((data && (data.message || data.msg || data.error_description)) || 'HTTP ' + res.status);
          err.status = res.status;
          err.code = data && data.code;
          throw err;
        }
        return data;
      });
    });
  }

  function uidOf(jwt) {
    try {
      var b = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      return JSON.parse(atob(b)).sub || null;
    } catch (e) { return null; }
  }
  function keep(a) {
    if (!a || !a.access_token) throw new Error('sin sesión');
    var s = load();
    s.auth = {
      access: a.access_token, refresh: a.refresh_token,
      exp: a.expires_at ? a.expires_at * 1000 : Date.now() + (a.expires_in || 3600) * 1000,
      uid: (a.user && a.user.id) || uidOf(a.access_token)
    };
    save(s);
    return s.auth.access;
  }
  /* An anonymous Supabase user IS the player: no email, no password, and the
   * identity lives in this browser. Re-read from storage every time, because
   * the other build may have refreshed the token in another tab — and a
   * refresh token is single-use, so renewing with a stale one would lose the
   * player for good. */
  var renewing = null;
  function token(force) {
    var a = load().auth;
    if (!a) return Promise.reject(new Error('not joined'));
    if (!force && a.exp - 60000 > Date.now()) return Promise.resolve(a.access);
    if (!renewing) {
      renewing = http('POST', '/auth/v1/token?grant_type=refresh_token', { refresh_token: a.refresh })
        .then(keep)
        .then(function (t) { renewing = null; return t; }, function (e) { renewing = null; throw e; });
    }
    return renewing;
  }
  function api(method, path, body) {
    return token().then(function (t) { return http(method, path, body, t); })
      .catch(function (e) {
        if (e.status !== 401) throw e;
        return token(true).then(function (t) { return http(method, path, body, t); });
      });
  }
  function rpc(fn, args) { return api('POST', '/rest/v1/rpc/' + fn, args || {}); }

  // ---- the outbox ----------------------------------------------------------
  function queue() { try { return JSON.parse(localStorage.getItem(QKEY)) || []; } catch (e) { return []; } }
  function setQueue(q) { try { localStorage.setItem(QKEY, JSON.stringify(q)); } catch (e) {} }
  function send(fn, args) {
    var q = queue();
    q.push({ id: newId(), fn: fn, args: args });
    setQueue(q);
    return flush();
  }
  /* In order, one at a time, stopping at the first failure that a retry could
   * fix. A refusal a retry will NOT fix (a 4xx from the server's own checks)
   * is dropped, or it would sit at the head of the queue blocking every round
   * behind it forever. */
  var flushing = null;
  function flush() {
    if (flushing) return flushing;
    if (!load().auth || !queue().length) return Promise.resolve();
    function step() {
      var job = queue()[0];
      if (!job) return null;
      function done() {
        setQueue(queue().filter(function (j) { return j.id !== job.id; }));
        return step();
      }
      return rpc(job.fn, job.args).then(done, function (e) {
        if (e.status >= 400 && e.status < 500 && [401, 408, 429].indexOf(e.status) === -1) return done();
        throw e;
      });
    }
    flushing = Promise.resolve().then(step).catch(function () {})
      .then(function () { flushing = null; });
    return flushing;
  }
  function pending() { return queue().length; }

  // ---- what is dealt -------------------------------------------------------
  var POOLS = null;
  function pools() {
    if (POOLS) return POOLS;
    var pairs = window.GameItems.index().pairs || {};
    POOLS = [];
    ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(function (band) {
      var list = (pairs[band] || []).slice().sort(function (a, b) {
        return (a.n - b.n) || (a.es < b.es ? -1 : a.es > b.es ? 1 : 0) || (a.en < b.en ? -1 : a.en > b.en ? 1 : 0);
      });
      var half = Math.ceil(list.length / 2);
      POOLS.push({ cefr: band, list: list.slice(0, half) });
      POOLS.push({ cefr: band, list: list.slice(half) });
    });
    return POOLS;
  }
  // Shaped exactly as js/gameitems.js shapes a Traducción item, so the round
  // renders, grades and files it like any other.
  function itemFrom(p, cefr) {
    var it = { kind: 'translate', cefr: cefr, bonus: 0, es: p.es, prompt: p.en, answer: p.es,
               note: p.note, topic: null, id: p.id || null, n: p.n || p.es.split(/\s+/).length };
    if (it.n < BUILD_FROM) { it.play = 'type'; it.accept = [p.es]; return it; }
    it.play = 'build';
    it.words = p.es.replace(/[.,;:!?¿¡"“”]/g, '').replace(/\s+/g, ' ').trim().split(' ');
    it.answer = it.words.join(' ');
    it.reveal = p.es;
    return it;
  }
  function drawAt(step, rng) {
    var pool = pools()[Math.max(1, Math.min(10, step)) - 1];
    if (!pool || !pool.list.length) return null;
    var it = itemFrom(pool.list[Math.floor(rng() * pool.list.length)], pool.cefr);
    it.ligaStep = step;
    return it;
  }
  function dealer(step) {
    return function (rng) {
      var next = step < 10 && rng() < NEXT_SHARE;
      var it = drawAt(next ? step + 1 : step, rng);
      if (it) it.ligaNext = next;
      return it;
    };
  }

  function award(item, result) {
    if (result === 'good') return { points: item.n, tags: [] };
    if (result === 'near') return { points: Math.floor(item.n / 2), tags: ['casi'] };
    return { points: 0, tags: [] };
  }

  // ---- the board, as last seen ---------------------------------------------
  function me() { var a = load().auth; return a ? a.uid : null; }
  function rows(week) {
    var b = load().board;
    if (!b || !b.rows) return [];
    if (b.week === week) return b.rows;
    // a new week: same players, nothing scored yet
    return b.rows.map(function (r) {
      return { player_id: r.player_id, name: r.name, step: r.step, best: 0, days: 0, reviews: 0, curve: null };
    });
  }
  function ranked(list) {
    return list.slice().sort(function (a, b) {
      return (b.best - a.best) || (b.days - a.days) || (a.name < b.name ? -1 : 1);
    });
  }
  /* Who to race: whoever is just above you, so the ghost is always the next
   * person to catch rather than always the leader — and your own best once
   * there is nobody above you. */
  function rival(list, myId) {
    var mine = list.filter(function (r) { return r.player_id === myId; })[0];
    var myBest = mine ? mine.best : 0;
    var above = ranked(list).filter(function (r) {
      return r.player_id !== myId && r.best > myBest && r.curve && r.curve.length >= 2;
    });
    if (above.length) return above[above.length - 1];
    if (mine && mine.curve && mine.curve.length >= 2) return { name: 'tú', curve: mine.curve, best: mine.best };
    return null;
  }

  // ---- playing -------------------------------------------------------------
  // Pop-ups already on screen go when a round starts: they would sit over the
  // clock (showHeld keeps new ones back until the round is over).
  function quiet() {
    var rack = document.querySelector('.liga-toasts');
    if (rack) clear(rack);
  }

  function play(opts) {
    var s = load();
    if (!s.step) return placement(opts);
    var step = s.step, week = weekOf(), myId = me();
    var list = rows(week);
    var mine = list.filter(function (r) { return r.player_id === myId; })[0];
    var foe = rival(list, myId);
    var t = { own_seen: 0, own_right: 0, next_seen: 0, next_right: 0, claims: [] };
    if (opts && opts.before) opts.before();
    quiet();
    window.Games.openRound({
      key: 'liga', title: 'Liga · ' + stepName(step), kind: 'translate',
      duration: DURATION, hue: HUE,
      seed: 'liga-' + week + '-' + step,
      draw: dealer(step), award: award,
      onResolve: function (item, result) {
        var k = item.ligaNext ? 'next' : 'own';
        t[k + '_seen']++;
        if (result !== 'wrong') t[k + '_right']++;
      },
      onClaim: function (item, typed) {
        if (!typed) return 0;
        t[(item.ligaNext ? 'next' : 'own') + '_right']++;
        t.claims.push({ en: item.prompt, es: typed, words: item.n, is_next: !!item.ligaNext });
        return item.n;
      },
      claimText: 'anotado — cuenta si los demás están de acuerdo',
      pb: mine ? mine.best : 0, pbLabel: 'tu mejor', recordText: '¡MEJOR DE LA SEMANA!',
      ghostAt: foe ? function (ms) { return window.GameScore.curveAt(foe.curve, ms); }
                   : function () { return null; },
      ghostName: foe ? foe.name : '',
      onFinish: function (r) { return filed(r, t, week); },
      again: function () { play(opts); }
    });
  }

  function filed(r, t, week) {
    var round = {
      client_id: newId(), played_at: new Date().toISOString(), words: r.score,
      own_seen: t.own_seen, own_right: t.own_right, next_seen: t.next_seen, next_right: t.next_right,
      ms: r.ms, curve: window.GameScore.downsample(r.curve, 24), claims: t.claims.slice(0, 20)
    };
    // The board as it now stands with this round on it, before the server
    // has heard — so the end screen can say where you are even offline.
    var s = load(), myId = me();
    var list = rows(week).map(function (x) { return Object.assign({}, x); });
    var mine = list.filter(function (x) { return x.player_id === myId; })[0];
    var before = mine ? mine.best : 0;
    if (mine && r.score > mine.best) { mine.best = r.score; mine.curve = round.curve; }
    s.board = { week: week, rows: list, at: (s.board && s.board.at) || 0 };
    save(s);
    send('submit_round', { r: round }).then(function () { refresh(true); });

    var box = el('div', 'liga-over');
    box.appendChild(el('div', 'g-over-verdict' + (r.score > before ? ' pb' : ''),
      r.score > before ? (before ? '¡Tu mejor de la semana! Antes ' + before : 'Tu primera marca de la semana')
                       : 'Tu mejor de la semana sigue en ' + before));
    var line = el('ol', 'liga-mini');
    ranked(list).forEach(function (x) {
      var li = el('li', x.player_id === myId ? 'me' : null);
      li.appendChild(el('span', null, x.player_id === myId ? 'Tú' : x.name));
      li.appendChild(el('b', null, String(x.best || 0)));
      line.appendChild(li);
    });
    box.appendChild(line);
    box.appendChild(el('p', 'liga-sync', navigator.onLine === false
      ? 'Sin conexión: se enviará en cuanto la haya.' : 'Enviado a la liga.'));
    if (t.claims.length) {
      box.appendChild(el('p', 'liga-sync', t.claims.length === 1
        ? 'Una respuesta tuya pasa a revisión: los demás deciden si vale.'
        : t.claims.length + ' respuestas tuyas pasan a revisión: los demás deciden si valen.'));
    }
    return box;
  }

  /* THE PLACEMENT ROUND. The ladder, but on the league's ten steps: up one for
   * a right answer, down one for a wrong one, starting at the bottom of the
   * level the profile claims. Where you SETTLE is your level — the average
   * step over the second half of the round, rounded down, because the first
   * half is the climb. Rounded down because promotion is a week away and an
   * over-placement is a miserable week. */
  function placement(opts) {
    var st = { step: Math.max(1, Math.min(10, window.GameScore.startRung())), trail: [] };
    if (opts && opts.before) opts.before();
    quiet();
    window.Games.openRound({
      key: 'liga-nivel', title: 'Liga · prueba de nivel', kind: 'translate',
      duration: DURATION, hue: HUE,
      draw: function (rng) { return drawAt(st.step, rng); },
      award: award,
      onResolve: function (item, result) {
        st.trail.push(item.ligaStep);
        if (result === 'good') st.step = Math.min(10, st.step + 1);
        else if (result === 'wrong') st.step = Math.max(1, st.step - 1);
      },
      pb: 0, ghostAt: function () { return null; },
      onFinish: function () {
        var tail = st.trail.slice(Math.floor(st.trail.length / 2));
        var step = tail.length
          ? Math.max(1, Math.floor(tail.reduce(function (a, b) { return a + b; }, 0) / tail.length))
          : st.step;
        var s = load();
        s.step = step;
        save(s);
        send('place', { p_step: step }).then(function () { refresh(true); });
        var box = el('div', 'liga-over');
        box.appendChild(el('div', 'g-over-verdict pb', 'Tu nivel en la liga: ' + stepName(step)));
        box.appendChild(el('p', 'liga-sync',
          'Juegas a este nivel toda la semana. Cada lunes la liga mira tus rondas y te sube cuando lo dominas.'));
        return box;
      },
      againLabel: 'Jugar la liga',
      again: function () { play(opts); }
    });
  }

  // ---- joining -------------------------------------------------------------
  function join(code, name) {
    var ready = load().auth ? Promise.resolve() : http('POST', '/auth/v1/signup', {}).then(keep);
    return ready.then(function () {
      return rpc('join_league', { p_code: code, p_name: name });
    }).then(function () {
      var s = load();
      s.name = name;
      save(s);
      return refresh(true);
    });
  }
  function joinError(e) {
    if (navigator.onLine === false) return 'Hace falta conexión para unirse.';
    if (/no league/.test(e.message)) return 'Ese código no existe.';
    if (e.code === '23505') return 'Ese nombre ya está cogido en la liga.';
    if (e.code === '23514') return 'El nombre tiene que tener entre 1 y 24 letras.';
    return 'No se ha podido: ' + e.message;
  }

  // ---- votes ---------------------------------------------------------------
  function vote(c, ok) {
    var s = load();
    s.toVote = (s.toVote || []).filter(function (x) { return x.id !== c.id; });
    save(s);
    redraw();
    return send('vote', { p_claim: c.id, p_ok: ok });
  }
  function expected(en) {
    var GI = window.GameItems;
    var alts = GI && GI.altsFor ? GI.altsFor(en) : [];
    return alts[0] || null;
  }

  // ---- keeping up ----------------------------------------------------------
  var lastRefresh = 0, inflight = null;
  function refresh(force) {
    if (!joined()) return Promise.resolve();
    if (inflight) return inflight;
    if (!force && Date.now() - lastRefresh < 30000) return Promise.resolve();
    lastRefresh = Date.now();
    var week = weekOf(), myId = me();
    inflight = flush().then(function () {
      return Promise.all([
        rpc('board', { p_week: week }),
        api('GET', '/rest/v1/claims?select=id,player_id,en,es,status&status=neq.rejected&order=id.desc&limit=200'),
        api('GET', '/rest/v1/votes?select=claim_id&voter_id=eq.' + myId)
      ]);
    }).then(function (res) {
      var list = res[0] || [], claims = res[1] || [], mine = res[2] || [];
      var s = load(), news = [];
      var names = {};
      list.forEach(function (r) { names[r.player_id] = r.name; });
      var me0 = list.filter(function (r) { return r.player_id === myId; })[0];
      if (me0 && me0.step) s.step = me0.step;

      // claims the league approved become everybody's accepted answers
      if (window.Accepted) {
        claims.forEach(function (c) { if (c.status === 'ok') window.Accepted.add(c.en, c.es); });
      }
      var voted = {};
      mine.forEach(function (v) { voted[v.claim_id] = 1; });
      s.toVote = claims.filter(function (c) {
        return c.status === 'pending' && c.player_id !== myId && !voted[c.id];
      }).map(function (c) { return { id: c.id, who: names[c.player_id] || '?', en: c.en, es: c.es }; });

      news = news.concat(overtaken(s.seen, list, week, myId));
      var told = s.told || [];
      s.toVote.forEach(function (c) {
        if (told.indexOf(c.id) !== -1) return;
        told.push(c.id);
        news.push({ text: c.who + ' dice que «' + c.es + '» vale. ¿Estás de acuerdo?', votes: true });
      });
      s.told = told.slice(-200);

      var lastWeek = s.seen && s.seen.week && s.seen.week !== week ? s.seen.week : null;
      var best = {};
      list.forEach(function (r) { best[r.player_id] = r.best; });
      s.seen = { week: week, best: best };
      s.board = { week: week, rows: list, at: Date.now() };
      save(s);
      return lastWeek ? weekResult(lastWeek, myId).then(function (n) { return n.concat(news); }) : news;
    }).then(function (news) {
      news.forEach(function (n) { notify(n); });
      redraw();
    }).catch(function () {}).then(function () { inflight = null; });
    return inflight;
  }

  /* THE POP-UP THE LEAGUE EXISTS FOR: somebody passed you. Only against what
   * you had already seen, so opening the app after a week away does not
   * replay every round anyone played. */
  function overtaken(seen, list, week, myId) {
    if (!seen || seen.week !== week) return [];
    var mine = list.filter(function (r) { return r.player_id === myId; })[0];
    var myBest = mine ? mine.best : 0, out = [];
    list.forEach(function (r) {
      if (r.player_id === myId || !r.best) return;
      var was = (seen.best || {})[r.player_id] || 0;
      if (r.best === was || r.best <= myBest) return;
      var wasAhead = was > ((seen.best || {})[myId] || 0);
      if (myBest && !wasAhead) out.push({ text: r.name + ' te ha adelantado en la liga: ' + r.best + ' palabras (tú ' + myBest + ').' });
      else if (!myBest) out.push({ text: r.name + ' ya tiene ' + r.best + ' palabras esta semana en la liga.' });
      else out.push({ text: r.name + ' sube a ' + r.best + ' palabras (tú ' + myBest + ').' });
    });
    return out;
  }

  // Who won the week you last saw, and what Monday's appraisal did to you.
  function weekResult(week, myId) {
    return Promise.all([
      rpc('board', { p_week: week }),
      api('GET', '/rest/v1/appraisals?select=player_id,from_step,to_step&week=eq.' + week)
    ]).then(function (res) {
      var out = [];
      var top = ranked(res[0] || [])[0];
      if (top && top.best) {
        out.push({ text: top.player_id === myId
          ? '¡Ganaste la semana pasada con ' + top.best + ' palabras!'
          : 'La semana pasada ganó ' + top.name + ' con ' + top.best + ' palabras.' });
      }
      var a = (res[1] || []).filter(function (x) { return x.player_id === myId; })[0];
      if (a) {
        out.push({ text: a.to_step > a.from_step ? 'Subes a ' + stepName(a.to_step) + ' en la liga. ¡Enhorabuena!'
                       : a.to_step < a.from_step ? 'Bajas a ' + stepName(a.to_step) + ' en la liga esta semana.'
                       : 'Sigues en ' + stepName(a.to_step) + ' en la liga esta semana.' });
      }
      return out;
    }, function () { return []; });
  }

  // ---- toasts --------------------------------------------------------------
  /* Held while a round is on screen: a pop-up over a running clock costs the
   * player the very points it is announcing. */
  var held = [];
  function notify(n) { held.push(n); showHeld(); }
  function showHeld() {
    if (!held.length || !document.body) return;
    if (document.querySelector('.g-shell')) { setTimeout(showHeld, 4000); return; }
    var rack = document.querySelector('.liga-toasts');
    if (!rack) { rack = el('div', 'liga-toasts'); document.body.appendChild(rack); }
    held.splice(0).forEach(function (n) {
      var t = el('button', 'liga-toast');
      t.type = 'button';
      t.appendChild(el('span', 'liga-toast-k', 'Liga'));
      t.appendChild(el('span', null, n.text));
      var gone = false;
      function close() { if (gone) return; gone = true; if (t.parentNode) t.parentNode.removeChild(t); }
      t.addEventListener('click', function () {
        close();
        if (n.votes) { var v = document.querySelector('.liga-votes'); if (v && v.scrollIntoView) v.scrollIntoView({ behavior: 'smooth' }); }
      });
      rack.appendChild(t);
      setTimeout(close, 9000);
    });
  }

  // ---- the card ------------------------------------------------------------
  var mounted = [];
  function card(opts) {
    var node = el('section', 'liga');
    draw(node, opts || {});
    mounted.push({ node: node, opts: opts || {} });
    refresh();
    setTimeout(showHeld, 0);
    return node;
  }
  function redraw() {
    mounted = mounted.filter(function (m) { return m.node.isConnected; });
    mounted.forEach(function (m) { draw(m.node, m.opts); });
  }

  function draw(node, opts) {
    clear(node);
    var s = load();
    var head = el('div', 'liga-head');
    head.appendChild(el('span', 'liga-k', 'La Liga'));
    var left = daysLeft();
    head.appendChild(el('span', 'liga-when', left === 1 ? 'último día de la semana' : 'quedan ' + left + ' días'));
    node.appendChild(head);

    if (!s.name) return drawJoin(node, opts);
    if (!s.step) {
      node.appendChild(el('p', 'liga-rule',
        'Antes de empezar, dos minutos de Traducción para saber tu nivel. Solo se hace una vez.'));
      var go0 = el('button', 'liga-go', 'Prueba de nivel');
      go0.type = 'button';
      go0.addEventListener('click', function () { placement(opts); });
      node.appendChild(go0);
      return;
    }

    var week = weekOf(), myId = me();
    var list = ranked(rows(week));
    node.appendChild(el('p', 'liga-rule',
      'Traducción · 2 minutos · cuenta tu mejor ronda en palabras. Mismas frases para todos los de tu nivel.'));
    var table = el('div', 'liga-table');
    var hdr = el('div', 'liga-row liga-hdr');
    ['', '', 'palabras', 'días'].forEach(function (h) { hdr.appendChild(el('span', null, h)); });
    table.appendChild(hdr);
    list.forEach(function (r, i) {
      var row = el('div', 'liga-row' + (r.player_id === myId ? ' me' : ''));
      row.appendChild(el('span', 'liga-pos', r.best ? String(i + 1) : '–'));
      var who = el('span', 'liga-who');
      who.appendChild(el('b', null, r.player_id === myId ? r.name + ' (tú)' : r.name));
      who.appendChild(el('span', 'liga-step', stepName(r.step)));
      row.appendChild(who);
      row.appendChild(el('span', 'liga-best', String(r.best || 0)));
      row.appendChild(el('span', 'liga-days', (r.days || 0) + '/7'));
      table.appendChild(row);
    });
    if (!list.length) table.appendChild(el('p', 'liga-sync', 'Cargando la clasificación…'));
    node.appendChild(table);

    var go = el('button', 'liga-go', 'Jugar · nivel ' + stepName(s.step));
    go.type = 'button';
    go.addEventListener('click', function () { play(opts); });
    node.appendChild(go);

    if ((s.toVote || []).length) node.appendChild(drawVotes(s.toVote));

    var foot = [];
    if (pending()) foot.push(pending() === 1 ? '1 envío pendiente' : pending() + ' envíos pendientes');
    if (s.board && s.board.at && Date.now() - s.board.at > 3600000) {
      foot.push('datos de hace ' + Math.round((Date.now() - s.board.at) / 3600000) + ' h');
    }
    foot.push('«días»: días con la sesión diaria terminada');
    node.appendChild(el('p', 'liga-sync', foot.join(' · ')));
  }

  function drawJoin(node, opts) {
    node.appendChild(el('p', 'liga-rule',
      'Una ronda de Traducción a la semana contra tus amigos. Necesitas el código de la liga.'));
    var form = el('form', 'liga-join');
    var code = el('input', 'liga-input');
    code.placeholder = 'Código';
    code.maxLength = 6;
    code.autocapitalize = 'characters';
    code.autocomplete = 'off';
    var name = el('input', 'liga-input');
    name.placeholder = 'Tu nombre';
    name.maxLength = 24;
    var btn = el('button', 'liga-go', 'Unirme');
    btn.type = 'submit';
    var msg = el('p', 'liga-err');
    form.appendChild(code); form.appendChild(name); form.appendChild(btn);
    node.appendChild(form);
    node.appendChild(msg);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = code.value.trim().toUpperCase(), n = name.value.trim();
      if (!c || !n) { msg.textContent = 'Hace falta el código y un nombre.'; return; }
      btn.disabled = true;
      msg.textContent = 'Uniéndote…';
      join(c, n).then(function () { draw(node, opts); }, function (err) {
        btn.disabled = false;
        msg.textContent = joinError(err);
      });
    });
  }

  function drawVotes(list) {
    var box = el('div', 'liga-votes');
    box.appendChild(el('h3', 'liga-votes-h', 'Por revisar'));
    box.appendChild(el('p', 'liga-sync', 'El juego dijo que no; tu amigo dice que sí. Un 👎 basta para anularlo.'));
    list.forEach(function (c) {
      var item = el('div', 'liga-claim');
      item.appendChild(el('span', 'liga-claim-en', c.en));
      var said = el('span', 'liga-claim-es');
      said.appendChild(el('b', null, c.who + ': '));
      said.appendChild(document.createTextNode(c.es));
      item.appendChild(said);
      var exp = expected(c.en);
      if (exp) item.appendChild(el('span', 'liga-claim-exp', 'el juego esperaba: ' + exp));
      var row = el('div', 'liga-claim-btns');
      [['👍 vale', true], ['👎 no vale', false]].forEach(function (b) {
        var x = el('button', 'liga-vote', b[0]);
        x.type = 'button';
        x.addEventListener('click', function () { vote(c, b[1]); });
        row.appendChild(x);
      });
      item.appendChild(row);
      box.appendChild(item);
    });
    return box;
  }

  // ---- Constancia ----------------------------------------------------------
  // Called by js/session.js when the daily session finishes.
  function sessionDone(reviews) {
    if (!joined()) return;
    send('log_session', { p_day: localDay(), p_reviews: reviews || 0 });
  }

  // ---- waking up -----------------------------------------------------------
  function boot() {
    if (!joined()) return;
    refresh(true);
  }
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('online', function () { refresh(true); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') refresh();
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }

  return {
    card: card, play: play, refresh: refresh, flush: flush, sessionDone: sessionDone,
    joined: joined, weekOf: weekOf, stepName: stepName,
    // for tools/test-liga.js
    _pools: pools, _dealer: dealer, _award: award, _ranked: ranked, _overtaken: overtaken
  };
})();
