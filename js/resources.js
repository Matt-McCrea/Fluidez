/* ============================================================================
 * RESOURCES view — "Recursos": curated links to real Spanish input and
 * reference tools (data/resources.js). Opens in a new tab; the app itself
 * stays offline. This is where the "you already consume Spanish" habit gets
 * pointed at good material.
 *
 * Also the way into "Canciones" (data/songs.js): the playlist, with each
 * song's title and words in Spanish and English. Either side can be hidden to
 * test yourself, and the songs read as one list or one at a time. The app
 * ships no lyrics (see the header of data/songs.js); the learner can paste a
 * song's Spanish and English in, kept on this device in 'fluidez.lyrics' as
 * { "title|artist": { es, en } } and shown line against line.
 * ========================================================================== */
window.Resources = (function () {
  var UI = window.UI;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, UI.t('Recursos', 'Resources')));
    wrap.appendChild(UI.el('p', 'muted', 'Fluidez trains output; these give you input. Aim for material you understand ~80% of — interesting first, easy second.'));

    if ((window.SONGS || []).length) {
      var sb = UI.el('button', 'mas-row'); sb.type = 'button';
      sb.innerHTML = '<span class="mas-ico">🎵</span>' +
        '<span class="mas-text"><b>' + UI.t('Canciones', 'Songs') + '</b><br><span class="muted small">' +
        window.SONGS.length + ' songs from the playlist — titles, words, what they\'re about</span></span>' +
        '<span class="mas-chev">›</span>';
      sb.addEventListener('click', function () { renderSongs(host, function () { render(host, back); }); });
      wrap.appendChild(sb);
    }

    (window.RESOURCES || []).forEach(function (group) {
      wrap.appendChild(UI.el('h3', null, group.category));
      var list = UI.el('div', 'resource-list');
      (group.items || []).forEach(function (it) {
        var a = UI.el('a', 'resource-item');
        a.href = it.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.innerHTML = '<span class="res-label">' + it.label + ' ↗</span>' +
          (it.note ? '<span class="res-note muted">' + it.note + '</span>' : '');
        list.appendChild(a);
      });
      wrap.appendChild(list);
    });

    var home = UI.el('button', 'ghost-btn', '← Más'); home.type = 'button'; home.addEventListener('click', back);
    wrap.appendChild(home);
    host.appendChild(wrap);
  }

  // ---- Canciones --------------------------------------------------------------
  // show: 'both' | 'es' | 'en' — the hidden side is a tap-to-reveal blank.
  // mode: 'all' | 'one'. Both survive leaving the page, for this visit.
  var songState = { show: 'both', mode: 'all', index: 0 };

  var LYRICS_KEY = 'fluidez.lyrics';
  function songKey(song) { return song.title + '|' + song.artist; }
  function loadLyrics() { try { return JSON.parse(localStorage.getItem(LYRICS_KEY)) || {}; } catch (e) { return {}; } }
  function saveLyrics(song, es, en) {
    var all = loadLyrics(), k = songKey(song);
    if (es.trim() || en.trim()) all[k] = { es: es, en: en }; else delete all[k];
    try { localStorage.setItem(LYRICS_KEY, JSON.stringify(all)); } catch (e) {}
  }
  function lines(text) { return String(text || '').replace(/\r/g, '').replace(/^\n+|\n+$/g, '').split('\n'); }

  // Pasted lyrics, Spanish line i beside English line i. A blank line in the
  // Spanish is a verse break. If the two don't line up, that's the paste —
  // the Edit button is right there.
  function lyricsBlock(song, onChange) {
    var box = UI.el('div', 'song-lyrics');
    var saved = loadLyrics()[songKey(song)];
    var editing = false;

    function draw() {
      UI.clear(box);
      if (editing) {
        box.appendChild(UI.el('div', 'small muted', 'Paste the Spanish and the English, one line per line, so they line up.'));
        var es = UI.el('textarea', 'song-textarea'); es.placeholder = 'Letra en español…'; es.rows = 10;
        var en = UI.el('textarea', 'song-textarea'); en.placeholder = 'English translation…'; en.rows = 10;
        es.value = saved ? saved.es : ''; en.value = saved ? saved.en : '';
        var cols = UI.el('div', 'song-edit'); cols.appendChild(es); cols.appendChild(en);
        box.appendChild(cols);
        var row = UI.el('div', 'song-links small');
        var sv = UI.el('button', 'primary-btn', 'Guardar'); sv.type = 'button';
        sv.addEventListener('click', function () {
          saveLyrics(song, es.value, en.value); saved = loadLyrics()[songKey(song)]; editing = false; draw();
        });
        var cn = UI.el('button', 'ghost-btn', 'Cancelar'); cn.type = 'button';
        cn.addEventListener('click', function () { editing = false; draw(); });
        row.appendChild(sv); row.appendChild(cn);
        box.appendChild(row);
        return;
      }
      if (!saved) {
        var add = UI.el('button', 'ghost-btn small', '＋ Add lyrics'); add.type = 'button';
        add.addEventListener('click', function () { editing = true; draw(); });
        box.appendChild(add);
        return;
      }
      var esL = lines(saved.es), enL = lines(saved.en);
      var n = Math.max(esL.length, enL.length);
      var body = UI.el('div', 'song-lyric-lines');
      for (var i = 0; i < n; i++) {
        var a = esL[i] || '', b = enL[i] || '';
        if (!a.trim() && !b.trim()) { body.appendChild(UI.el('div', 'song-verse-gap')); continue; }
        var r = UI.el('div', 'song-pair song-line');
        r.appendChild(a.trim() ? side(a, 'es', 'song-es') : UI.el('span'));
        r.appendChild(b.trim() ? side(b, 'en', 'song-gloss') : UI.el('span'));
        body.appendChild(r);
      }
      var det = UI.el('details', 'song-lyrics-details');
      if (songState.mode === 'one') det.open = true;
      det.appendChild(UI.el('summary', null, 'Lyrics · ' + esL.filter(function (l) { return l.trim(); }).length + ' lines'));
      det.appendChild(body);
      var ed = UI.el('button', 'ghost-btn small', 'Edit lyrics'); ed.type = 'button';
      ed.addEventListener('click', function () { editing = true; draw(); });
      det.appendChild(ed);
      box.appendChild(det);
    }
    draw();
    return box;
  }

  function segmented(options, current, onPick) {
    var seg = UI.el('div', 'segmented');
    options.forEach(function (o) {
      var b = UI.el('button', 'seg' + (o[0] === current ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () { onPick(o[0]); });
      seg.appendChild(b);
    });
    return seg;
  }

  // One side of a pair. When that side is hidden it renders blanked, and a tap
  // shows it — so you can say the word first, then check.
  function side(text, lang, cls) {
    var hidden = songState.show !== 'both' && songState.show !== lang;
    var s = UI.el('span', cls + (hidden ? ' song-hidden' : ''), esc(text));
    if (hidden) {
      s.tabIndex = 0; s.setAttribute('role', 'button'); s.title = 'Tap to show';
      var reveal = function () { s.classList.remove('song-hidden'); s.removeAttribute('role'); };
      s.addEventListener('click', reveal);
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
    }
    return s;
  }

  function songCard(song) {
    var card = UI.el('div', 'song-card');
    var head = UI.el('div', 'song-head');
    head.appendChild(side(song.title, 'es', 'song-title'));
    head.appendChild(side(song.en, 'en', 'song-en'));
    card.appendChild(head);
    card.appendChild(UI.el('div', 'song-artist muted small', esc(song.artist) + (song.year ? ' · ' + song.year : '')));

    if (song.about) card.appendChild(UI.el('p', 'song-about', esc(song.about)));

    if (song.vocab && song.vocab.length) {
      var list = UI.el('div', 'song-vocab');
      song.vocab.forEach(function (pair) {
        var row = UI.el('div', 'song-pair');
        row.appendChild(side(pair[0], 'es', 'song-es'));
        row.appendChild(side(pair[1], 'en', 'song-gloss'));
        list.appendChild(row);
      });
      card.appendChild(list);
    }
    if (song.note) card.appendChild(UI.el('p', 'song-note small', '💡 ' + esc(song.note)));
    card.appendChild(lyricsBlock(song));

    var q = song.title + ' ' + song.artist.split(',')[0];
    var links = UI.el('div', 'song-links small');
    links.innerHTML =
      '<a target="_blank" rel="noopener noreferrer" href="https://www.google.com/search?q=' +
        encodeURIComponent(q + ' letra traducción inglés') + '">Lyrics + translation ↗</a>' +
      '<a target="_blank" rel="noopener noreferrer" href="https://open.spotify.com/search/' +
        encodeURIComponent(q) + '">Spotify ↗</a>';
    card.appendChild(links);
    return card;
  }

  function renderSongs(host, back) {
    var songs = window.SONGS || [];
    var redraw = function () { renderSongs(host, back); };
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, UI.t('Canciones', 'Songs')));
    wrap.appendChild(UI.el('p', 'muted small', 'The Spanish worth taking from each song. Hide one side to test yourself; tap a blank to check. Paste in a song\'s lyrics and translation to read them line by line.'));

    var bar = UI.el('div', 'song-controls');
    bar.appendChild(segmented([['both', 'ES + EN'], ['es', 'Español'], ['en', 'English']], songState.show,
      function (v) { songState.show = v; redraw(); }));
    bar.appendChild(segmented([['all', 'All'], ['one', 'One at a time']], songState.mode,
      function (v) { songState.mode = v; redraw(); }));
    wrap.appendChild(bar);

    if (songState.mode === 'all') {
      var jump = UI.el('select', 'write-select');
      jump.appendChild(UI.el('option', null, 'Jump to a song…'));
      songs.forEach(function (s, i) {
        var o = UI.el('option', null, esc(s.title) + ' — ' + esc(s.artist)); o.value = String(i); jump.appendChild(o);
      });
      jump.addEventListener('change', function () {
        var card = wrap.querySelectorAll('.song-card')[+jump.value];
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      wrap.appendChild(jump);
      songs.forEach(function (s) { wrap.appendChild(songCard(s)); });
    } else {
      var i = songState.index = Math.max(0, Math.min(songState.index, songs.length - 1));
      var nav = UI.el('div', 'song-nav');
      var prev = UI.el('button', 'ghost-btn', '← Anterior'); prev.type = 'button'; prev.disabled = i === 0;
      prev.addEventListener('click', function () { songState.index--; redraw(); });
      var next = UI.el('button', 'ghost-btn', 'Siguiente →'); next.type = 'button'; next.disabled = i === songs.length - 1;
      next.addEventListener('click', function () { songState.index++; redraw(); });
      nav.appendChild(prev);
      nav.appendChild(UI.el('span', 'muted small', (i + 1) + ' / ' + songs.length));
      nav.appendChild(next);
      wrap.appendChild(nav);
      if (songs[i]) wrap.appendChild(songCard(songs[i]));
    }

    var home = UI.el('button', 'ghost-btn', '← ' + UI.t('Recursos', 'Resources')); home.type = 'button';
    home.addEventListener('click', back);
    wrap.appendChild(home);
    host.appendChild(wrap);
  }

  return { render: render };
})();
