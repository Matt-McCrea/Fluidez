/* ============================================================================
 * LIBRARY — every passage and every serial chapter, open any time.
 *
 * Each row shows the title, band, word count and "N% known": the share of the
 * text's lemmas the learner already has. Sorted by that share within the
 * learner's band first. Nothing is removed from the list; texts above the
 * learner's band, or mostly unknown, are labelled "harder" and sit after the
 * rest (a "Show harder" toggle lists them all, otherwise a few are shown).
 *
 * Passages are lemmatised on the fly with ENGINE.analyzeToken and cached per
 * id in memory. Chapters carry their own `lemmas`. Chapter data files are not
 * in index.html: they are loaded on demand by injecting a script tag.
 * Finishing a passage marks fluidez.progress.read[id]; finishing a chapter
 * marks fluidez.progress.chaptersRead[id]. Both add the words to wordsRead.
 * ========================================================================== */
window.Library = (function () {
  var UI = window.UI;
  var PROG_KEY = 'fluidez.progress';
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var HARDER_BELOW = 70;      // % known under which a text is "harder"
  var HARDER_PREVIEW = 8;     // harder rows shown before "Show harder"
  var PAGE = 60;

  var lemmaCache = {};        // passage id -> [lemma]
  var chapterCache = {};      // chapter id -> chapter
  var fileWaiters = {};
  var state = { kind: 'passages', theme: '', unit: '', harder: false, shown: PAGE };

  function dayNumber() {
    if (window.SRS && window.SRS.today) return window.SRS.today();
    return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  }
  function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY)) || {}; } catch (e) { return {}; } }
  function saveProg(p) { try { localStorage.setItem(PROG_KEY, JSON.stringify(p)); } catch (e) {} }
  function rank(b) { var i = BANDS.indexOf(b); return i < 0 ? 0 : i; }
  function learnerBand() { return (window.Profile && window.Profile.current && window.Profile.current()) || 'A1'; }

  function bandOfLevel(level) {
    var found = 'A1';
    (window.LEVELS || []).forEach(function (L) { if (L.levels.indexOf(level) !== -1) found = L.code; });
    return found;
  }
  function wordCount(text) { return String(text || '').split(/\s+/).filter(Boolean).length; }

  /* ---- what the learner knows, as a test on one lemma --------------------- */
  function knownTest() {
    var prog = loadProg(), band = learnerBand();
    var hasKnown = !!(window.Known && window.Known.forLearner);
    var set = null;
    if (hasKnown) {
      try {
        var di = ((window.Curriculum && window.Curriculum.startOf) ? window.Curriculum.startOf(band) : 0) + (prog.beginnerDay || 0);
        set = window.Known.forLearner(prog, di);
      } catch (e) { set = null; }
    }
    var srsKnown = {}, srs = {};
    try { srs = JSON.parse(localStorage.getItem('fluidez.srs')) || {}; } catch (e) { srs = {}; }
    Object.keys(srs).forEach(function (id) {
      var r = srs[id] || {}, m = /^v:(.+):meaning$/.exec(id);
      if (m && ((r.reps || 0) > (r.lapses || 0) || r.consecCorrect > 0 || (r.box || 0) > 0)) {
        srsKnown[bare(m[1])] = 1;
      }
    });
    var bandVocab = null;
    if (!set) {
      bandVocab = {};
      (window.VOCAB || []).forEach(function (w) { if (w.es && rank(w.cefr || 'A1') <= rank(band)) bandVocab[bare(w.es)] = 1; });
    }
    var small = (window.LIB && window.LIB.gloss && window.LIB.gloss.SMALL_WORDS) || {};
    return function (lemma) {
      var l = String(lemma).toLowerCase();
      if (set && set.has('l:' + l)) return true;
      if (srsKnown[l]) return true;
      if (Object.prototype.hasOwnProperty.call(small, l)) return true;
      return !!(bandVocab && bandVocab[l]);
    };
  }
  function bare(es) { return String(es).trim().toLowerCase().replace(/^(el|la|los|las|un|una)\s+/, ''); }

  /* ---- lemmas ------------------------------------------------------------- */
  function lemmaOf(tok) {
    var t = tok.toLowerCase(), a = null;
    if (window.ENGINE && window.ENGINE.analyzeToken) {
      try { a = window.ENGINE.analyzeToken(t); } catch (e) { a = null; }
    }
    return (a && a.length && a[0].inf) || t;
  }
  function passageLemmas(p) {
    if (lemmaCache[p.id]) return lemmaCache[p.id];
    var seen = {}, out = [];
    (String(p.text || '').match(/\p{L}+/gu) || []).forEach(function (tok) {
      var lemma = lemmaOf(tok);
      if (!seen[lemma]) { seen[lemma] = 1; out.push(lemma); }
    });
    lemmaCache[p.id] = out;
    return out;
  }
  /* The words the passage glosses for the reader (surface forms and their lemmas) count as known for that passage:
   * a text that explains its own hard words is easier than the bare share says. */
  function withOwnGloss(p, test) {
    var gl = {};
    (p.gloss || []).forEach(function (g) {
      (String(g.es || '').match(/\p{L}+/gu) || []).forEach(function (w) { w = w.toLowerCase(); gl[w] = 1; gl[lemmaOf(w)] = 1; });
    });
    return function (lemma) { return test(lemma) || !!gl[String(lemma).toLowerCase()]; };
  }
  function share(lemmas, test) {
    if (!lemmas || !lemmas.length) return 0;
    var n = 0;
    lemmas.forEach(function (l) { if (test(l)) n++; });
    return Math.round(100 * n / lemmas.length);
  }

  /* A chapter's known share the way the session computes it (known lemmas, the
   * chapter's own gloss words, the small words): Session.chapterCoverage. */
  function chapterShare(ch, test) {
    var set = { has: function (k) { return test(String(k).replace(/^l:/, '')); } };
    if (window.Session && window.Session.chapterCoverage) return Math.round(100 * window.Session.chapterCoverage(ch, set));
    return share(ch.lemmas, withOwnGloss(ch, test));
  }
  /* The first chapter the learner has not read, in the order the serial serves it. */
  function nextUnreadIndex() {
    var idx = window.STORY_INDEX || [], e = null;
    if (window.Session && window.Session.nextChapterEntry) e = window.Session.nextChapterEntry();
    else { var cr = loadProg().chaptersRead || {}; e = idx.filter(function (c) { return !cr[c.id]; })[0] || null; }
    if (!e) return -1;
    for (var i = 0; i < idx.length; i++) if (idx[i].id === e.id) return i;
    return -1;
  }
  /* A placed learner joined the serial at their own band: position in a band above A1 and nothing read below it. */
  function placedBand() {
    var band = learnerBand();
    if (band === 'A1') return null;
    var idx = window.STORY_INDEX || [], first = -1;
    for (var i = 0; i < idx.length; i++) if (idx[i].band === band) { first = i; break; }
    if (first <= 0) return null;
    var cr = loadProg().chaptersRead || {};
    for (var j = 0; j < first; j++) if (cr[idx[j].id]) return null;
    return band;
  }
  /* The chapter's number inside its own band (1 for the band's first chapter). */
  function numberInBand(entry) {
    var n = 0;
    (window.STORY_INDEX || []).some(function (c) { if (c.band === entry.band) n++; return c.id === entry.id; });
    return n;
  }
  /* "u03" in the story index is the third unit of the course: COURSE_UNITS keys it as "a1-u03". */
  function unitTitle(id) {
    var U = window.COURSE_UNITS || {}, m = /^u(\d+)$/.exec(String(id));
    if (!m) return id;
    var k = Object.keys(U).filter(function (x) { return new RegExp('-u' + m[1] + '$').test(x); })[0];
    return (k && U[k].title) || ('Unit ' + parseInt(m[1], 10));
  }

  /* ---- the rows ----------------------------------------------------------- */
  function items(kind, test) {
    var band = learnerBand(), prog = loadProg(), out = [];
    if (kind === 'passages') {
      var read = prog.read || {};
      (window.PASSAGES || []).forEach(function (p) {
        var b = bandOfLevel(p.level);
        out.push({ kind: 'passage', id: p.id, title: p.title, band: b, words: wordCount(p.text),
                   theme: p.theme, known: share(passageLemmas(p), withOwnGloss(p, test)), read: !!read[p.id], src: p });
      });
    } else {
      var cr = prog.chaptersRead || {}, nx = nextUnreadIndex();
      (window.STORY_INDEX || []).forEach(function (c, n) {
        var ch = chapterCache[c.id], isRead = !!cr[c.id];
        // beyond the next unread chapter: listed, locked, so the plot is not given away
        var locked = nx >= 0 && n > nx && !isRead;
        out.push({ kind: 'chapter', id: c.id, title: c.title, band: c.band, words: c.words, unit: c.unit, order: n, bandNo: numberInBand(c),
                   known: ch && !locked ? chapterShare(ch, test) : null, read: isRead, locked: locked, src: c });
      });
    }
    out.forEach(function (it) {
      it.harder = !it.locked && (rank(it.band) > rank(band) || (it.known != null && it.known < HARDER_BELOW));
      it.mine = it.band === band;
    });
    // learner's band first, then the highest known share; the serial keeps its own order
    out.sort(function (a, b) {
      if (kind === 'chapters') return (a.locked - b.locked) || (a.order - b.order);
      return (b.mine - a.mine) || ((b.known == null ? -1 : b.known) - (a.known == null ? -1 : a.known));
    });
    return out;
  }

  /* ---- loading chapters on demand ---------------------------------------- */
  function loadBand(entry) {
    var band = entry.band, key = 'STORY_' + band;
    return new Promise(function (resolve, reject) {
      if (window[key]) return resolve(window[key]);
      if (!fileWaiters[entry.file]) {
        fileWaiters[entry.file] = new Promise(function (res, rej) {
          var s = document.createElement('script');
          s.src = entry.file;
          s.onload = function () { window[key] ? res(window[key]) : rej(new Error('no ' + key)); };
          s.onerror = function () { rej(new Error('offline')); };
          document.head.appendChild(s);
        });
        fileWaiters[entry.file].catch(function () { delete fileWaiters[entry.file]; });
      }
      fileWaiters[entry.file].then(resolve, reject);
    });
  }
  function loadChapter(entry) {
    if (chapterCache[entry.id]) return Promise.resolve(chapterCache[entry.id]);
    return loadBand(entry).then(function (list) {
      list.forEach(function (c) { chapterCache[c.id] = c; });
      return chapterCache[entry.id];
    });
  }

  /* ---- marking read ------------------------------------------------------- */
  function markPassage(p) {
    var prog = loadProg();
    prog.read = prog.read || {};
    if (prog.read[p.id]) return;
    prog.read[p.id] = dayNumber();
    prog.wordsRead = (prog.wordsRead || 0) + wordCount(p.text);
    saveProg(prog);
  }
  function markChapter(ch) {
    var prog = loadProg();
    prog.chaptersRead = prog.chaptersRead || {};
    if (prog.chaptersRead[ch.id]) return;
    prog.chaptersRead[ch.id] = dayNumber();
    var n = 0;
    (ch.parts || []).forEach(function (pt) { n += wordCount(pt.text); });
    prog.wordsRead = (prog.wordsRead || 0) + n;
    saveProg(prog);
  }

  /* ---- screens ------------------------------------------------------------ */
  var backFn = null;

  function render(host, back) {
    if (back) backFn = back;
    UI.clear(host);
    var wrap = UI.el('div', 'panel lib');
    var top = UI.el('div', 'lib-top');
    var bk = UI.el('button', 'ghost-btn', '← Back'); bk.type = 'button';
    bk.addEventListener('click', function () { if (backFn) backFn(); });
    top.appendChild(bk);
    wrap.appendChild(top);
    wrap.appendChild(UI.el('h1', null, 'Reading library'));
    wrap.appendChild(UI.el('p', 'muted', 'Every passage and chapter is here. Tap a word while you read to see what it means. "Known" is the share of its words you already have.'));
    var listHost = UI.el('div', 'lib-list');

    var tabs = UI.el('div', 'chip-row');
    [['passages', 'Passages'], ['chapters', 'Bogotá serial']].forEach(function (k) {
      var b = UI.el('button', 'topic-chip' + (state.kind === k[0] ? ' on' : ''), k[1]); b.type = 'button';
      b.addEventListener('click', function () { state.kind = k[0]; state.shown = PAGE; render(host); });
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs);

    // filters
    var bar = UI.el('div', 'lib-filters');
    var sel = UI.el('select', 'lib-select'); sel.setAttribute('aria-label', state.kind === 'passages' ? 'Theme' : 'Unit');
    var opts = [];
    if (state.kind === 'passages') {
      var seen = {};
      (window.PASSAGES || []).forEach(function (p) { if (p.theme && !seen[p.theme]) { seen[p.theme] = 1; opts.push(p.theme); } });
      opts.sort();
    } else {
      var su = {};
      (window.STORY_INDEX || []).forEach(function (c) { if (!su[c.unit]) { su[c.unit] = 1; opts.push(c.unit); } });
    }
    var cur = state.kind === 'passages' ? state.theme : state.unit;
    sel.appendChild(new Option(state.kind === 'passages' ? 'All themes' : 'All units', ''));
    opts.forEach(function (o) {
      var op = new Option(optName(o), o); if (o === cur) op.selected = true; sel.appendChild(op);
    });
    sel.addEventListener('change', function () {
      if (state.kind === 'passages') state.theme = sel.value; else state.unit = sel.value;
      state.shown = PAGE; fill();
    });
    bar.appendChild(sel);
    var tg = UI.el('label', 'lib-toggle');
    var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = state.harder;
    cb.addEventListener('change', function () { state.harder = cb.checked; fill(); });
    tg.appendChild(cb); tg.appendChild(document.createTextNode(' Show harder'));
    bar.appendChild(tg);
    wrap.appendChild(bar);
    wrap.appendChild(listHost);
    host.appendChild(wrap);

    function themeName(id) {
      if (state.kind !== 'passages') return id;
      var t = (window.THEMES || []).filter(function (x) { return x.id === id; })[0];
      return t ? t.en : id;
    }
    function optName(o) { return state.kind === 'passages' ? themeName(o) : unitTitle(o); }

    function fill() {
      UI.clear(listHost);
      listHost.appendChild(UI.el('p', 'muted small', 'Counting known words…'));
      setTimeout(function () {
        var test = knownTest();
        var all = items(state.kind, test).filter(function (it) {
          if (state.kind === 'passages') return !state.theme || it.theme === state.theme;
          return !state.unit || it.unit === state.unit;
        });
        /* A placed learner sees their own band's chapters first; the earlier bands fold under "Earlier in the story". */
        var earlier = [], pb = state.kind === 'chapters' ? placedBand() : null;
        if (pb) {
          earlier = all.filter(function (it) { return rank(it.band) < rank(pb); });
          all = all.filter(function (it) { return rank(it.band) >= rank(pb); });
        }
        var easy = all.filter(function (it) { return !it.harder; });
        var hard = all.filter(function (it) { return it.harder; });
        var rows = easy.slice(0, state.shown);
        var hardRows = [];
        if (rows.length >= easy.length) {
          hardRows = state.harder ? hard.slice(0, Math.max(state.shown - easy.length, PAGE)) : hard.slice(0, HARDER_PREVIEW);
        }
        UI.clear(listHost);
        if (!all.length) listHost.appendChild(UI.el('p', 'muted', 'Nothing here.'));
        rows.forEach(function (it) { listHost.appendChild(row(it, host)); });
        if (easy.length > rows.length) {
          var more = UI.el('button', 'ghost-btn', 'Show more (' + (easy.length - rows.length) + ')'); more.type = 'button';
          more.addEventListener('click', function () { state.shown += PAGE; fill(); });
          listHost.appendChild(more);
        }
        if (hard.length) {
          listHost.appendChild(UI.el('h3', null, 'Harder (' + hard.length + ')'));
          hardRows.forEach(function (it) { listHost.appendChild(row(it, host)); });
          if (hard.length > hardRows.length && rows.length >= easy.length) {
            var mh = UI.el('button', 'ghost-btn', 'Show harder (' + (hard.length - hardRows.length) + ' more)'); mh.type = 'button';
            mh.addEventListener('click', function () { state.harder = true; cb.checked = true; fill(); });
            listHost.appendChild(mh);
          }
        }
        if (earlier.length) {
          var det = document.createElement('details'); det.className = 'lib-earlier';
          var sm = document.createElement('summary'); sm.textContent = 'Earlier in the story (' + earlier.length + ')';
          det.appendChild(sm);
          earlier.forEach(function (it) { det.appendChild(row(it, host)); });
          listHost.appendChild(det);
        }
        if (state.kind === 'chapters') warmChapters(all);
      }, 0);
    }
    fill();
  }

  /* Chapter lemmas live in the band files, which are only fetched when a
   * chapter is opened. Fetch the learner's own band once so its percentages
   * appear; other bands show a dash until opened. */
  var warmed = {};
  function warmChapters() {
    var band = learnerBand();
    if (warmed[band]) return;
    var entry = (window.STORY_INDEX || []).filter(function (c) { return c.band === band; })[0];
    if (!entry) return;
    warmed[band] = 1;
    loadChapter(entry).then(function () {
      var h = document.querySelector('.lib-list');
      if (h && state.kind === 'chapters') {
        // re-render the list in place with the shares now known
        var host = document.getElementById('stage-host');
        if (host && host.querySelector('.lib')) render(host);
      }
    }, function () { delete warmed[band]; });
  }

  function row(it, host) {
    var b = UI.el('button', 'lib-row' + (it.harder ? ' harder' : '') + (it.locked ? ' locked' : '')); b.type = 'button';
    if (it.locked) {
      b.disabled = true; b.setAttribute('aria-disabled', 'true');
      b.appendChild(UI.el('span', 'lib-title', escapeHtml(it.title)));
      b.appendChild(UI.el('span', 'lib-meta muted small', it.band + ' · ' + it.words + ' words · Read the earlier chapters first'));
      return b;
    }
    var chNo = (it.kind === 'chapter' && placedBand() && it.band === placedBand()) ? 'Chapter ' + it.bandNo + ' of the ' + it.band + ' story · ' : '';
    var meta = chNo + it.band + ' · ' + it.words + ' words · ' + (it.known == null ? 'open to count' : it.known + '% known');
    b.appendChild(UI.el('span', 'lib-title', escapeHtml(it.title) + (it.read ? ' <span class="lib-read">read</span>' : '') +
      (it.harder ? ' <span class="lib-harder">harder</span>' : '')));
    b.appendChild(UI.el('span', 'lib-meta muted small', meta));
    b.addEventListener('click', function () { it.kind === 'passage' ? openPassage(host, it.src) : openChapter(host, it.src); });
    return b;
  }
  function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function backToList(host) { UI.clear(host); render(host); window.scrollTo && window.scrollTo(0, 0); }

  function openPassage(host, p) {
    UI.clear(host);
    var C = window.StageComprehend;
    if (!C) { backToList(host); return; }
    C.run(host, { passage: p, results: {} }, function () {
      markPassage(p);
      backToList(host);
    });
  }

  function openChapter(host, entry) {
    UI.clear(host);
    host.appendChild(UI.el('div', 'panel', '<p class="muted">Loading the chapter…</p>'));
    loadChapter(entry).then(function (ch) {
      if (!ch) throw new Error('missing');
      showPart(host, ch, 0);
    }).catch(function () {
      UI.clear(host);
      var w = UI.el('div', 'panel');
      w.appendChild(UI.el('p', null, 'This chapter needs a connection the first time. Try again when you are online.'));
      w.appendChild(UI.nextBtn('← Back to the library', function () { backToList(host); }));
      host.appendChild(w);
    });
  }

  function showPart(host, ch, i) {
    UI.clear(host);
    var part = ch.parts[i], last = i === ch.parts.length - 1;
    var title = ch.title + (ch.parts.length > 1 ? ' (part ' + (i + 1) + ' of ' + ch.parts.length + ')' : '');
    function next() {
      if (!last) { showPart(host, ch, i + 1); return; }
      markChapter(ch);
      UI.clear(host);
      var w = UI.el('div', 'panel');
      w.appendChild(UI.el('h2', null, 'Chapter finished'));
      var hook = ch.parts[ch.parts.length - 1].hook;
      if (hook) w.appendChild(UI.el('p', 'lib-hook', escapeHtml(hook)));
      w.appendChild(UI.nextBtn('← Back to the library', function () { backToList(host); }));
      host.appendChild(w);
    }
    if (i > 0 && ch.parts[i - 1].recap) {
      // a short recap of the part before, shown above the new part
      host.appendChild(UI.el('p', 'muted small lib-recap', 'Last time: ' + escapeHtml(ch.parts[i - 1].recap)));
    }
    var C = window.StageComprehend;
    var pseudo = { id: ch.id + '#' + i, title: title, text: part.text, gloss: ch.gloss || [], questions: part.questions || [] };
    if (!C) { next(); return; }
    var cont = UI.el('div'); host.appendChild(cont);
    C.run(cont, { passage: pseudo, results: {} }, next);
  }

  return { render: render, knownShare: share, passageLemmas: passageLemmas, knownTest: knownTest, unitTitle: unitTitle, bandOfLevel: bandOfLevel };
})();
