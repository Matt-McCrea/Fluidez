/* ============================================================================
 * PROGRESS — "Tu progreso": makes invisible progress visible.
 * Stat tiles, syllabus status, an SRS box distribution (single-hue magnitude
 * bars), a 10-week activity heatmap (single-hue presence over time), and your
 * weak spots from the error log. All data comes from localStorage — nothing
 * is computed on a server.
 * ========================================================================== */
window.Progress = (function () {
  var UI = window.UI, S = window.SRS;

  function loadProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }
  function loadSrs() { try { return JSON.parse(localStorage.getItem('fluidez.srs')) || {}; } catch (e) { return {}; } }
  var INTERVAL_LABELS = ['new', '1d', '2d', '4d', '8d', '16d', '32d', '64d'];

  function dayNumOf(d) { return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); }

  function tile(num, label) {
    var t = UI.el('div', 'stat-tile');
    t.appendChild(UI.el('div', 'stat-num', String(num)));
    t.appendChild(UI.el('div', 'stat-lbl muted', label));
    return t;
  }

  function render(host, back) {
    UI.clear(host);
    var p = loadProg(), srs = loadSrs();
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Tu progreso'));

    // ---- stat tiles ----
    var ids = Object.keys(srs);
    var wordsKnown = ids.filter(function (k) { return /^(v:|cap:)/.test(k); }).length;
    var due = window.Hub ? S.dueCount(window.Hub.reviewPool()) : 0;
    var tiles = UI.el('div', 'stat-row');
    tiles.appendChild(tile('🔥 ' + (p.streak || 0), 'day streak'));
    tiles.appendChild(tile(p.total || 0, 'sessions done'));
    tiles.appendChild(tile(wordsKnown, 'words learned'));
    tiles.appendChild(tile(due, 'due today'));
    wrap.appendChild(tiles);

    // ---- syllabus ----
    wrap.appendChild(UI.el('h3', null, 'Syllabus'));
    var studied = p.studied || {};
    var lessons = window.GRAMMAR_LESSONS || [];
    var nextIdx = lessons.findIndex(function (l) { return !studied[l.id]; });
    var syl = UI.el('div', 'syllabus');
    lessons.forEach(function (l, i) {
      var state = studied[l.id] ? 'done' : (i === nextIdx ? 'current' : 'locked');
      var mark = state === 'done' ? '✓' : (state === 'current' ? '●' : '○');
      var row = UI.el('button', 'syl-row ' + state);
      row.type = 'button';
      row.innerHTML = '<span class="syl-mark">' + mark + '</span><span class="syl-title">' + l.title +
        '</span><span class="syl-level muted">L' + (l.level || 1) + ' ›</span>';
      row.addEventListener('click', function () { window.App.go('grammar', l.id); });  // jump to any lesson freely
      syl.appendChild(row);
    });
    wrap.appendChild(syl);
    wrap.appendChild(UI.el('p', 'muted small', 'Tap any lesson to read it — you can move around freely.'));

    // ---- SRS box distribution (single-hue magnitude bars) ----
    wrap.appendChild(UI.el('h3', null, 'Memory strength'));
    var boxes = [0, 0, 0, 0, 0, 0, 0, 0];
    ids.forEach(function (k) { var b = srs[k].box || 0; boxes[Math.min(b, 7)]++; });
    var maxBox = Math.max(1, Math.max.apply(null, boxes));
    var dist = UI.el('div', 'box-dist');
    boxes.forEach(function (n, b) {
      var rowb = UI.el('div', 'box-row');
      rowb.appendChild(UI.el('span', 'box-lbl muted', INTERVAL_LABELS[b]));
      var track = UI.el('div', 'box-track');
      var fill = UI.el('div', 'box-fill'); fill.style.width = Math.round(100 * n / maxBox) + '%';
      track.appendChild(fill);
      rowb.appendChild(track);
      rowb.appendChild(UI.el('span', 'box-n muted', String(n)));
      dist.appendChild(rowb);
    });
    wrap.appendChild(dist);
    wrap.appendChild(UI.el('p', 'muted small', 'Cards move right as you keep getting them right — “new” are fragile, “64d” are close to permanent.'));

    // ---- activity heatmap (10 weeks, single-hue presence) ----
    wrap.appendChild(UI.el('h3', null, 'Activity'));
    var active = {};
    (p.history || []).forEach(function (d) { active[d] = 1; });
    var today = new Date();
    // start on the Monday of 9 weeks ago so columns are whole weeks
    var WEEKS = 10;
    var startOffset = ((today.getDay() + 6) % 7) + (WEEKS - 1) * 7;   // days back to that Monday
    var grid = UI.el('div', 'heatmap');
    for (var w = 0; w < WEEKS; w++) {
      var col = UI.el('div', 'hm-col');
      for (var dow = 0; dow < 7; dow++) {
        var d = new Date(today); d.setDate(today.getDate() - startOffset + w * 7 + dow);
        var cell = UI.el('div', 'hm-cell' + (d > today ? ' future' : (active[dayNumOf(d)] ? ' on' : '')));
        cell.title = d.toISOString().slice(0, 10);
        col.appendChild(cell);
      }
      grid.appendChild(col);
    }
    wrap.appendChild(grid);

    // ---- weak spots ----
    var errs = window.ErrorLog ? window.ErrorLog.list() : [];
    wrap.appendChild(UI.el('h3', null, 'Weak spots'));
    if (!errs.length) wrap.appendChild(UI.el('p', 'muted', 'None logged yet — mistakes you make show up here.'));
    else {
      var top = UI.el('div', 'weak-list');
      errs.slice(0, 8).forEach(function (e) {
        var row = UI.el('div', 'weak-row');
        row.appendChild(UI.el('span', 'weak-front', e.front));
        row.appendChild(UI.el('span', 'weak-back muted', e.back));
        row.appendChild(UI.el('span', 'weak-count', '×' + e.count));
        top.appendChild(row);
      });
      wrap.appendChild(top);
      if (errs.some(function (e) { return e.reviewable; })) {
        var drill = UI.el('button', 'ghost-btn', 'Drill your errors →'); drill.type = 'button';
        drill.addEventListener('click', function () { window.App.go('errors'); });
        wrap.appendChild(drill);
      }
    }

    var home = UI.el('button', 'ghost-btn', '← Inicio'); home.type = 'button'; home.addEventListener('click', back);
    wrap.appendChild(UI.el('div', null, '')); wrap.appendChild(home);
    host.appendChild(wrap);
  }

  return { render: render };
})();
