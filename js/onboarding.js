/* ============================================================================
 * ONBOARDING — the first-run walkthrough and the placement check.
 *
 * A new learner used to land on Inicio with five tabs, a five-stage session and
 * a level switcher offering A1 through C1, and no way to know what any of it
 * was or which level was theirs. Picking your own CEFR level is a guess, and
 * getting it wrong is expensive: too high and every passage is opaque, too low
 * and you spend weeks on the present tense.
 *
 * Two parts, both skippable:
 *   1. three cards on what the app is and how a day works
 *   2. a placement check: an adaptive ladder over the course's own days, with
 *      items drawn from the sentence bank (gap choice at A1 and A2, typed
 *      cloze, translation and contrast items from B1). At most 14 questions;
 *      the result is a unit to start at, and everything before it is marked
 *      studied.
 *
 * Replayable from Más → "Cómo funciona". Shown once, tracked in localStorage.
 * ========================================================================== */
window.Onboarding = (function () {
  var UI = window.UI;
  var KEY = 'fluidez.onboarded';
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  function seen() { try { return !!localStorage.getItem(KEY); } catch (e) { return true; } }
  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  /* ---- the explainer ------------------------------------------------------ */
  /* Built per render, not as a constant: the stage names the app actually
   * shows change with level (UI.t), and a tour that names them in Spanish
   * while the session header says "Review" teaches the learner nothing. */
  function cards() {
    var T = UI.t;
    return [
    { h: T('Una sesión al día', 'One session a day'),
      p: 'Fluidez is one short session a day, about fifteen minutes. In your first week you will be able to greet someone, say who you are and where you are from, ask a name, a place or a price, and say when you have not understood. Tomorrow brings new material automatically.' },
    { h: T('Las cinco etapas', 'The five stages'),
      p: '<b>🔁 ' + T('Repasar', 'Review') + '</b>: check what you met before.<br>' +
         '<b>📖 ' + T('Aprender', 'Learn') + '</b>: one lesson, taught properly.<br>' +
         '<b>👂 ' + T('Comprender', 'Understand') + '</b>: read a passage and answer questions on it.<br>' +
         '<b>🧩 ' + T('Aplicar', 'Apply') + '</b>: use the grammar in sentences, not in a table.<br>' +
         '<b>✍️ ' + T('Producir', 'Produce') + '</b>: write something, checked as you type.' },
    { h: T('Dónde está todo', 'Where everything is'),
      p: '<b>Inicio</b> starts the day\'s session.<br>' +
         '<b>Jugar</b> has quick games against your own best score.<br>' +
         '<b>Practicar</b> has drills for when you want more.<br>' +
         '<b>Progreso</b> shows how you are doing and lists every lesson. All of them are open, so you are never locked out.<br>' +
         '<b>Buscar</b> is where you look up words, verbs and grammar.<br>' +
         '<b>Más</b> holds the grammar reference, free writing and settings.' }
    ];
  }

  /* ---- placement ---------------------------------------------------------- */
  /* An adaptive ladder over the course itself. Items are drawn from the
   * sentence bank (and the contrast items from B1) for a target course day, so
   * what is asked is what the course teaches around that day, not a separate
   * set of probes. A rung is a course day: five a band, spaced by the band's length. */
  var RUNG_STEP = 20, RUNGS_PER_BAND = 5, RUNG_OFFSET = 5, MAX_ITEMS = 14, WINDOW = 10;

  function days() { return window.COURSE_DAYS || []; }
  function bandStart(b) { return (window.COURSE_BANDS || {})[b] || 0; }

  var _rungs = null;
  function rungs() {
    if (_rungs && _rungs.n === days().length) return _rungs.list;
    var list = [], total = days().length;
    BANDS.forEach(function (b, i) {
      if (!(b in (window.COURSE_BANDS || {}))) return;
      var from = bandStart(b), to = i + 1 < BANDS.length && BANDS[i + 1] in window.COURSE_BANDS ? bandStart(BANDS[i + 1]) : total;
      /* Five rungs a band, spaced by the band's own length, so the climb from
       * A1 reaches B1 in the same number of items whatever the calendar (the
       * re-sequenced course of 5 November 2026 has 267 days before B1; at one
       * rung every 20 days the 14-item ladder could never get there). */
      var step = Math.max(RUNG_STEP, Math.floor((to - from) / RUNGS_PER_BAND));
      for (var k = 0, d = from + RUNG_OFFSET; k < RUNGS_PER_BAND && d < to; k++, d += step) list.push({ day: d, band: b });
    });
    _rungs = { n: total, list: list };
    return list;
  }
  function startRung(who) {
    var list = rungs(), want = who === 'new' ? 'A1' : who === 'some' ? 'A2' : 'B1';
    for (var i = 0; i < list.length; i++) if (list[i].band === want) return i;
    return 0;
  }

  /* ---- what may not be asked ------------------------------------------------- */
  function deacc(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function wordsOf(s) { return deacc(s).match(/[a-zñ]+/g) || []; }
  var NUMBER_WORD = /^(cero|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieci\w+|veinte|veinti\w+|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|ciento|cientos|doscientos|trescientos|cuatrocientos|quinientos|seiscientos|setecientos|ochocientos|novecientos|mil|millon|millones|primer|primero|primera|segundo|segunda|tercer|tercero|tercera|cuarto|quinto|sexto|septimo|octavo|noveno|decimo)$/;
  function cognateWord(w, en) {
    if (w.length < 4) return false;
    if (/(cion|dad|mente)$/.test(w)) return true;
    var p = w.slice(0, 4);
    return en.some(function (e) { return e.length >= 4 && e.slice(0, 4) === p; });
  }
  /* `answer` is the text the learner must supply; `at` is its offset in the
   * sentence (0 means sentence-initial, where a capital proves nothing). */
  function badAnswer(answer, en, at) {
    var a = String(answer || '');
    if (!a) return true;
    if (/\d/.test(a)) return true;
    if (at > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(a)) return true;                 // a proper name
    var ws = wordsOf(a), enw = wordsOf(en);
    if (!ws.length) return true;
    return ws.some(function (w) { return NUMBER_WORD.test(w) || cognateWord(w, enw); });
  }
  function capitalOnly(opts) {
    var seen = {};
    for (var i = 0; i < opts.length; i++) {
      var k = String(opts[i]).toLowerCase();
      if (seen[k]) return true;
      seen[k] = 1;
    }
    return false;
  }
  /* A whole sentence to translate: no names, numbers, or a sentence that is
   * nothing but cognates. */
  function badSentence(r) {
    var es = r.es;
    if (/\d|\n/.test(es) || /\(Spain\)/.test(r.en)) return true;
    if (/[a-záéíóúñ,]\s+[A-ZÁÉÍÓÚÑ]/.test(es.replace(/[¿¡]/g, ''))) return true;   // a capital after the first word
    var n = wordsOf(es).length;
    if (n < 3 || n > 8) return true;
    var enw = wordsOf(r.en);
    var content = wordsOf(es).filter(function (w) { return w.length >= 4; });
    if (content.length && content.every(function (w) { return cognateWord(w, enw); })) return true;
    return wordsOf(es).some(function (w) { return NUMBER_WORD.test(w); });
  }

  /* ---- drawing an item -------------------------------------------------------- */
  function shuffled(a, rng) {
    var c = a.slice();
    for (var i = c.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = c[i]; c[i] = c[j]; c[j] = t; }
    return c;
  }
  function flat(s) { return String(s || '').replace(/\s*\n\s*/g, ' '); }
  function nodesNear(di, span) {
    var K = window.Known;
    if (!K || !K.taughtBy) return null;
    var hi = K.taughtBy(di), lo = K.taughtBy(Math.max(-1, di - span - 1)), out = new Set();
    hi.forEach(function (n) { if (!lo.has(n) && n.charAt(0) !== 'l') out.add(n); });
    return out;
  }
  function bankRows(band) {
    var out = [], bi = BANDS.indexOf(band);
    for (var i = Math.max(0, bi - 1); i <= bi; i++) {
      var rows = window['BANK_' + BANDS[i]];
      if (rows) out = out.concat(rows);
    }
    return out;
  }
  function candidates(rungIdx, span, any) {
    var rg = rungs()[rungIdx], di = rg.day, near = any ? null : nodesNear(di, span);
    return bankRows(rg.band).filter(function (r) {
      if (r.d == null || r.d > di || r.d < di - span) return false;
      if (!near || !near.size) return true;
      return (r.t || []).some(function (t) { return near.has(t); });
    });
  }
  function typedBand(rungIdx) { return rungs()[rungIdx].band !== 'A1' && rungs()[rungIdx].band !== 'A2'; }

  function fromGap(r, rng) {
    var BI = window.BankItems, it = BI && BI.gap(r, rng);
    if (!it || !it.options || it.options.length < 2 || capitalOnly(it.options)) return null;
    if (badAnswer(r.es.slice(r.f[0], r.f[1]), r.en, r.f[0])) return null;
    return { mode: 'choice', prompt: it.text, options: it.options, answer: it.answer,
             answerText: it.options[it.answer], bankId: r.id, kind: 'gap' };
  }
  /* A form that is also a noun or adjective headword ("vista", "doble") reads
   * as a verb to the engine and gives a nonsense blank. */
  var _heads = null;
  function isHeadword(w) {
    if (!_heads) {
      _heads = {};
      (window.VOCAB || []).forEach(function (v) { _heads[deacc(String(v.es || '').replace(/^(el|la|los|las|un|una)\s+/i, '').trim())] = 1; });
    }
    return !!_heads[deacc(w)];
  }
  function fromCloze(r) {
    var BI = window.BankItems, it = BI && BI.cloze(r);
    if (!it || !r.f) return null;
    var ans = r.es.slice(r.f[0], r.f[1]);
    if (isHeadword(ans) || /\(Spain\)/.test(r.en)) return null;
    var before = deacc(r.es.slice(0, r.f[0])).match(/[a-zñ]+\s*$/);
    if (before && /^(el|la|los|las|un|una|unos|unas|mi|tu|su|mis|tus|sus|este|esta|del|al|propio|propia)\s*$/.test(before[0])) return null;   // a noun slot
    if (badAnswer(ans, r.en, r.f[0])) return null;
    return { mode: 'type', prompt: it.text, answerText: ans, bankId: r.id, kind: 'cloze',
             check: function (s) { return deacc(s).replace(/\s+/g, ' ').trim() === deacc(ans); } };
  }
  function fromTranslate(r) {
    var BI = window.BankItems;
    if (badSentence(r) || !BI) return null;
    var t = BI.translate(r), M = window.LIB && window.LIB.match;
    if (!M || !M.matchTranslation) return null;
    return { mode: 'type', prompt: 'Say it in Spanish: ' + flat(r.en), answerText: r.es, bankId: r.id, kind: 'translate',
             check: function (s) {
               try { return !!M.matchTranslation(s, { es: t.es, en: t.prompt, accept: t.accept || [] }, { accents: 'lenient' }).pass; }
               catch (e) { return false; }
             } };
  }
  function contrastItem(rungIdx, rng, used) {
    var items = window.CONTRAST_ITEMS, rg = rungs()[rungIdx];
    if (!items) return null;
    var pool = items.filter(function (c) {
      return c.d != null && c.d <= rg.day && c.d >= rg.day - 3 * WINDOW && c.options && c.options.length >= 2 && c.gap && !used[c.id];
    });
    pool = shuffled(pool, rng);
    for (var i = 0; i < pool.length; i++) {
      var c = pool[i], ans = c.options[c.answer];
      if (capitalOnly(c.options) || badAnswer(ans, c.en, c.gap[0])) continue;
      return { mode: 'choice', prompt: flat(c.es.slice(0, c.gap[0]) + '___' + c.es.slice(c.gap[1])) + '  «' + flat(c.en) + '»',
               options: c.options.slice(), answer: c.answer, answerText: ans, bankId: c.id, kind: 'contrast' };
    }
    return null;
  }

  /* One item for a rung; `used` is a set of ids already asked. Null if the
   * data has nothing usable there (the caller moves on). */
  function drawItem(rungIdx, rng, used) {
    used = used || {};
    var typed = typedBand(rungIdx), kinds;
    if (!typed) kinds = ['gap'];
    else {
      var x = rng();
      kinds = x < 0.25 ? ['contrast', 'cloze', 'translate'] : x < 0.65 ? ['cloze', 'translate'] : ['translate', 'cloze'];
    }
    /* Rows that target what the rung's own fortnight taught come first; when
     * none of them makes an item (a week of chunk lessons whose rows have no
     * gap, say), any row legal by the rung's day will do, so a rung is never
     * empty while the bank has rows for its band. */
    for (var pass = 0; pass < 2; pass++) for (var k = 0; k < kinds.length; k++) {
      if (kinds[k] === 'contrast') { if (pass) continue; var ci = contrastItem(rungIdx, rng, used); if (ci) { used[ci.bankId] = 1; return ci; } continue; }
      for (var span = WINDOW; span <= 3 * WINDOW; span += WINDOW) {
        var pool = shuffled(candidates(rungIdx, span, pass === 1), rng), tries = 0, seen = {};
        for (var i = 0; i < pool.length && tries < 400; i++) {
          var r = pool[i];
          if (used[r.id]) continue;
          var key = deacc(r.es);
          if (seen[key]) continue;
          seen[key] = 1; tries++;
          var it = kinds[k] === 'gap' ? fromGap(r, rng) : kinds[k] === 'cloze' ? fromCloze(r) : fromTranslate(r);
          if (it) { used[r.id] = 1; it.rung = rungIdx; return it; }
        }
      }
    }
    return null;
  }

  /* ---- the ladder --------------------------------------------------------------- */
  function newLadder(startIdx) {
    var n = rungs().length;
    var L = { cur: Math.max(0, Math.min(startIdx, n - 1)), asked: 0, done: false, st: [], n: n, clean: 0, skipped: {} };
    for (var i = 0; i < n; i++) L.st.push({ streak: 0, miss: 0, passed: false, failed: false });
    return L;
  }
  /* Two right in a row passes a rung and moves up (two rungs after three clean passes). A miss earns one more item
   * at the same rung; a second miss fails it and drops a rung. It stops after
   * 14 items, or once a passed rung sits directly under a failed one. */
  function answer(L, right) {
    if (L.done) return L;
    var s = L.st[L.cur], nxt;
    L.asked++;
    if (right) {
      s.streak++;
      if (s.streak >= 2 && !s.passed) {
        s.passed = true; nxt = L.cur + 1;
        /* three rungs passed in a row with no miss: the climb skips a rung */
        if (++L.clean >= 3 && nxt + 1 < L.n && !L.st[nxt + 1].failed) { L.skipped[nxt + 1] = nxt; nxt++; }
        if (nxt >= L.n || L.st[nxt].failed) L.done = true; else L.cur = nxt;
      }
    } else {
      s.streak = 0; s.miss++; L.clean = 0;
      var below = L.skipped[L.cur];
      /* a first miss after a skip tries the skipped rung before failing anything */
      if (below != null && s.miss === 1 && !L.st[below].passed && !L.st[below].failed) { L.cur = below; }
      else if (s.miss >= 2) {
        s.failed = true; nxt = L.cur - 1;
        if (nxt < 0 || L.st[nxt].passed) L.done = true; else L.cur = nxt;
      }
    }
    if (L.asked >= MAX_ITEMS) L.done = true;
    return L;
  }
  /* The highest passed rung with no failed rung beneath it (a miss below the
   * estimate counts against it); -1 when nothing was passed. */
  function resultOf(L) {
    var firstFail = L.n;
    for (var i = 0; i < L.n; i++) if (L.st[i].failed) { firstFail = i; break; }
    var best = -1;
    for (var j = 0; j < L.n && j < firstFail; j++) if (L.st[j].passed) best = j;
    return best;
  }
  function placeAt(rungIdx) { return rungIdx < 0 ? 0 : rungs()[rungIdx].day; }

  /* ---- applying a result ------------------------------------------------------- */
  function unitNo(id) { var m = /[uw](\d+)$/.exec(id || ''); return m ? parseInt(m[1], 10) : null; }   // a1-u01 and, since the re-sequence, a1-w003
  function describe(day) {
    var d = days()[day] || {}, id = d.unit, u = id && window.COURSE_UNITS && window.COURSE_UNITS[id];
    if (!u) for (var i = day; i >= 0 && !u; i--) { id = days()[i] && days()[i].unit; u = id && window.COURSE_UNITS[id]; }
    return { band: d.band || 'A1', unit: unitNo(id), title: u ? u.title : '' };
  }
  function headline(day) {
    var w = describe(day);
    if (w.band === 'A1' || w.band === 'A2') return 'Start at unit ' + (w.unit || 1) + (w.title ? ': ' + w.title : '');
    return 'Start at ' + w.band + ', unit ' + (w.unit || 1);
  }
  /* Profile to the band, beginnerDay to the day within it, and every lesson
   * and verb day before it marked studied. */
  function apply(day) {
    var w = describe(day), prog = {};
    try { prog = JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { prog = {}; }
    prog.studied = prog.studied || {};
    for (var i = 0; i < day && i < days().length; i++) {
      var d = days()[i];
      if (d.lesson) prog.studied[d.lesson] = 1;
      else if (d.verbs) prog.studied['verbs:' + d.verbs.join(',')] = 1;
    }
    prog.beginnerDay = day - bandStart(w.band);
    prog.dayBand = w.band;               // the counter is this band's (js/session.js pickFocus)
    try { localStorage.setItem('fluidez.progress', JSON.stringify(prog)); } catch (e) {}
    if (window.Profile) window.Profile.set(w.band);
    return w.band;
  }

  /* ---- the screens ----------------------------------------------------------------- */
  function ensureLoaded(rungIdx, cb) {
    var band = rungs()[rungIdx].band, BI = window.BankItems, C = window.Contrasts;
    function banks() { if (BI && BI.load) BI.load(band, function () { cb(); }); else cb(); }
    if (band !== 'A1' && band !== 'A2' && C && C.load) C.load(banks); else banks();
  }

  function runPlacement(host, onDone, who) {
    if (!who) return askWho(host, onDone);
    var L = newLadder(startRung(who)), used = {};
    var rng = UI.seededRandom(String(Date.now()));

    function loading() {
      UI.clear(host);
      var w = UI.el('div', 'panel'); w.appendChild(UI.el('p', 'doc-summary', 'One moment...')); host.appendChild(w);
    }
    function step() {
      if (L.done || L.asked >= MAX_ITEMS) return finish();
      loading();
      ensureLoaded(L.cur, function () {
        var it = null, guard = 0;
        while (!it && guard++ < 3) it = drawItem(L.cur, rng, used);
        if (!it) { L.done = true; return finish(); }
        show(it);
      });
    }
    function show(it) {
      UI.clear(host);
      var wrap = UI.el('div', 'panel'), settled = false;
      function settle(ok) { if (settled) return; settled = true; answer(L, ok); step(); }
      wrap.appendChild(UI.el('div', 'eyebrow', 'Question ' + (L.asked + 1)));
      wrap.appendChild(UI.el('h2', null, it.prompt));
      if (it.mode === 'choice') {
        var opts = UI.el('div', 'onb-options');
        it.options.forEach(function (o, n) {
          var b = UI.el('button', 'onb-option', o); b.type = 'button';
          b.addEventListener('click', function () { settle(n === it.answer); });
          opts.appendChild(b);
        });
        wrap.appendChild(opts);
      } else {
        var inp = document.createElement('input');
        inp.type = 'text'; inp.className = 'onb-input'; inp.autocomplete = 'off'; inp.autocapitalize = 'off'; inp.spellcheck = false;
        inp.setAttribute('aria-label', 'Your answer');
        var go = UI.nextBtn('Check', function () { if (inp.value.trim()) settle(!!it.check(inp.value)); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && inp.value.trim()) settle(!!it.check(inp.value)); });
        wrap.appendChild(inp); wrap.appendChild(go);
        setTimeout(function () { try { inp.focus(); } catch (e) {} }, 0);
      }
      var dk = UI.el('button', 'linkish muted', "I don't know"); dk.type = 'button';
      dk.addEventListener('click', function () { settle(false); });
      wrap.appendChild(dk);
      host.appendChild(wrap);
    }
    function finish() {
      var day = placeAt(resultOf(L));
      UI.clear(host);
      var wrap = UI.el('div', 'panel');
      wrap.appendChild(UI.el('h1', null, headline(day)));
      wrap.appendChild(UI.el('p', 'doc-summary',
        'That is where the first week will start. Nothing is locked: you can change level any time from Más, ' +
        'and every lesson stays open in Progreso.'));
      function go(d) { var band = apply(d); markSeen(); onDone(band); }
      wrap.appendChild(UI.nextBtn('Start here', function () { go(day); }));
      if (day > 0) {
        var zero = UI.el('button', 'linkish muted', 'Start from the very beginning instead'); zero.type = 'button';
        zero.addEventListener('click', function () { go(0); });
        wrap.appendChild(zero);
      }
      var other = UI.el('button', 'linkish muted', 'Prefiero elegir yo'); other.type = 'button';
      other.addEventListener('click', function () { markSeen(); onDone(null); });
      wrap.appendChild(other);
      host.appendChild(wrap);
    }
    step();
  }

  function askWho(host, onDone) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'How much Spanish do you have?'));
    wrap.appendChild(UI.el('p', 'doc-summary',
      'A few questions so the first week fits you. Guess if you are not sure, and tap I don\'t know when you are not.'));
    var opts = UI.el('div', 'onb-options');
    [['new', 'New to Spanish'], ['some', 'I know some'], ['lots', 'I have studied it for a while']].forEach(function (p) {
      var b = UI.el('button', 'onb-option', p[1]); b.type = 'button';
      b.addEventListener('click', function () { runPlacement(host, onDone, p[0]); });
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
    host.appendChild(wrap);
  }

  /* ---- the flow ----------------------------------------------------------- */
  function run(host, onDone) {
    var idx = 0;
    onDone = onDone || function () {};

    function card() {
      var CARDS = cards();
      if (idx >= CARDS.length) return offerPlacement();
      var c = CARDS[idx++];
      UI.clear(host);
      var wrap = UI.el('div', 'panel');
      wrap.appendChild(UI.el('div', 'eyebrow', idx + ' / ' + (CARDS.length + 1)));
      wrap.appendChild(UI.el('h1', null, c.h));
      wrap.appendChild(UI.el('div', 'lesson-body', c.p));
      wrap.appendChild(UI.nextBtn(idx < CARDS.length ? 'Siguiente →' : 'Casi →', card));
      var skip = UI.el('button', 'linkish muted', 'Saltar →'); skip.type = 'button';
      skip.addEventListener('click', function () { markSeen(); onDone(null); });
      wrap.appendChild(skip);
      host.appendChild(wrap);
    }

    function offerPlacement() {
      UI.clear(host);
      var wrap = UI.el('div', 'panel');
      var nCards = cards().length;
      wrap.appendChild(UI.el('div', 'eyebrow', (nCards + 1) + ' / ' + (nCards + 1)));
      wrap.appendChild(UI.el('h1', null, UI.t('¿Por dónde empezamos?', 'Where should we start?')));
      wrap.appendChild(UI.el('p', 'doc-summary',
        'A few questions so the first week fits you. It takes about two minutes, and you can change it afterwards.'));
      wrap.appendChild(UI.nextBtn('Hacer la prueba →', function () { runPlacement(host, onDone); }));
      var pick = UI.el('button', 'linkish muted', 'Elijo yo mi nivel →'); pick.type = 'button';
      pick.addEventListener('click', function () { markSeen(); onDone(null); });
      wrap.appendChild(pick);
      host.appendChild(wrap);
    }

    card();
  }

  return { run: run, runPlacement: runPlacement, seen: seen, markSeen: markSeen,
           placement: { rungs: rungs, startRung: startRung, drawItem: drawItem, newLadder: newLadder, answer: answer,
                        resultOf: resultOf, placeAt: placeAt, apply: apply, headline: headline, describe: describe,
                        badAnswer: badAnswer, badSentence: badSentence, MAX_ITEMS: MAX_ITEMS } };
})();
