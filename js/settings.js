/* ============================================================================
 * SETTINGS (Ajustes) — export / import your data.
 *
 * There's no server — every install (a browser tab, an iOS home-screen app,
 * a Mac "Add to Dock" app) keeps its own separate localStorage sandbox, even
 * on the same device. Moving your progress from one install to another
 * (phone → Mac, Safari → home screen, one person's install → their other
 * device) is always: export on the source, send yourself the file, import on
 * the destination. This is also the app's only backup — nothing here is
 * stored anywhere else.
 * ========================================================================== */
window.Settings = (function () {
  var UI = window.UI;
  /* Every key Fluidez writes to localStorage — the single list, used by both
   * export and "Empezar de cero". tools/validate-content.js checks it against
   * the keys actually written in js/, so a new one cannot be forgotten by
   * either. fluidez.theme is exported but deliberately NOT reset: wiping your
   * Spanish should not turn off dark mode. */
  var KEYS = ['fluidez.srs', 'fluidez.srsSchema', 'fluidez.progress', 'fluidez.errors', 'fluidez.captured',
    'fluidez.userWords', 'fluidez.journal', 'fluidez.profile', 'fluidez.theme', 'fluidez.topicLevel', 'fluidez.caps',
    'fluidez.gameBest', 'fluidez.onboarded'];
  var KEEP_ON_RESET = { 'fluidez.theme': 1 };

  function exportData() {
    var out = { app: 'fluidez', exportedAt: new Date().toISOString(), data: {} };
    KEYS.forEach(function (k) {
      var v = null;
      try { v = localStorage.getItem(k); } catch (e) {}
      if (v != null) out.data[k] = v;
    });
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var stamp = out.exportedAt.slice(0, 10);
    a.href = url; a.download = 'fluidez-backup-' + stamp + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importData(text, onDone) {
    var parsed;
    try { parsed = JSON.parse(text); } catch (e) { onDone('That file isn\'t valid JSON.'); return; }
    if (!parsed || parsed.app !== 'fluidez' || !parsed.data) { onDone('That doesn\'t look like a Fluidez backup file.'); return; }
    try {
      Object.keys(parsed.data).forEach(function (k) {
        if (KEYS.indexOf(k) === -1) return;   // ignore unknown keys defensively
        localStorage.setItem(k, parsed.data[k]);
      });
    } catch (e) { onDone('Could not write to storage: ' + e.message); return; }
    onDone(null);
  }

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Ajustes'));

    /* Diagnostics first: "which build am I running" and "what is actually
     * slow" are the two questions that cannot be answered from a laptop. A
     * service worker is cache-first, so a fix can be committed, pushed and
     * still not be on the phone. */
    wrap.appendChild(UI.el('h3', null, 'Diagnóstico'));
    var diag = UI.el('div', 'diag');
    var build = (window.Perf && window.Perf.BUILD) || '?';
    diag.appendChild(UI.el('p', 'muted small', 'Build <b>' + build + '</b>. If this is not the newest build, the app is still running cached code — close it fully and reopen, or tap the update banner.'));
    var rows = (window.Perf ? window.Perf.summary() : []);
    if (!rows.length) diag.appendChild(UI.el('p', 'muted small', 'No timings yet — move between tabs, then come back here.'));
    else {
      var tbl = '<table class="contrast-table"><thead><tr><th>operación</th><th>peor</th><th>media</th><th>n</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        var slow = r.max >= 400 ? ' style="color:var(--bad)"' : '';
        tbl += '<tr' + slow + '><td>' + r.label + '</td><td>' + r.max + ' ms</td><td>' +
               Math.round(r.total / r.n) + ' ms</td><td>' + r.n + '</td></tr>';
      });
      diag.appendChild(UI.el('div', null, tbl + '</tbody></table>'));
    }
    var copy = UI.el('button', 'btn-secondary', 'Copiar diagnóstico'); copy.type = 'button';
    copy.addEventListener('click', function () {
      var txt = 'build ' + build + '\n' + (window.Perf ? window.Perf.summary() : [])
        .map(function (r) { return r.label + ': worst ' + r.max + ' ms, mean ' + Math.round(r.total / r.n) + ' ms, n=' + r.n; }).join('\n');
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      copy.textContent = 'Copiado ✓';
    });
    diag.appendChild(copy);
    wrap.appendChild(diag);

    wrap.appendChild(UI.el('h3', null, 'Empezar de cero'));
    wrap.appendChild(UI.el('p', 'muted',
      'Wipes every trace of your progress on THIS device — review history, lessons studied, saved words, your journal, error log, game scores, level and the walkthrough — and starts again at A1 as a brand-new learner. ' +
      'It cannot be undone, and nothing is stored anywhere else, so export first if there is any chance you want it back.'));

    var armed = false;
    var reset = UI.el('button', 'btn-danger', 'Empezar de cero'); reset.type = 'button';
    var note = UI.el('p', 'muted small', '');
    reset.addEventListener('click', function () {
      if (!armed) {                       // two taps, so it cannot happen by accident
        armed = true;
        reset.textContent = 'Tocar otra vez para borrarlo todo';
        note.textContent = 'This will erase everything on this device. Tap again to confirm, or leave this screen to cancel.';
        return;
      }
      KEYS.forEach(function (k) {
        if (KEEP_ON_RESET[k]) return;
        try { localStorage.removeItem(k); } catch (e) {}
      });
      try { location.reload(); } catch (e) {}
    });
    wrap.appendChild(reset);
    wrap.appendChild(note);

    wrap.appendChild(UI.el('h3', null, 'Exportar / importar datos'));
    wrap.appendChild(UI.el('p', 'muted',
      'Every install (phone, Mac, browser tab) keeps its own separate copy of your progress — moving it from one to another means exporting here, sending yourself the file (AirDrop, Files, email, whatever\'s easiest), and importing it on the other one. ' +
      'This file is also your only backup — nothing here is stored anywhere else.'));

    var exportBtn = UI.el('button', 'primary-btn', 'Exportar datos (.json)');
    exportBtn.type = 'button';
    exportBtn.addEventListener('click', exportData);
    wrap.appendChild(exportBtn);

    var importWrap = UI.el('div', null);
    importWrap.style.marginTop = '18px';
    var fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'application/json,.json';
    fileInput.style.display = 'none';
    var importBtn = UI.el('button', 'ghost-btn', 'Importar datos…');
    importBtn.type = 'button';
    importBtn.addEventListener('click', function () { fileInput.click(); });
    var status = UI.el('div', 'muted');
    status.style.marginTop = '10px';

    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        importData(String(reader.result), function (err) {
          if (err) { status.textContent = '⚠️ ' + err; status.style.color = 'var(--bad)'; return; }
          status.textContent = '✓ Importado — recargando…'; status.style.color = 'var(--good)';
          setTimeout(function () { window.location.reload(); }, 700);
        });
      };
      reader.readAsText(file);
    });

    importWrap.appendChild(importBtn);
    importWrap.appendChild(fileInput);
    importWrap.appendChild(status);
    wrap.appendChild(importWrap);

    if (window.Profile) {
      wrap.appendChild(UI.el('h3', null, 'Tope de repaso'));
      wrap.appendChild(UI.el('p', 'muted',
        'The most items Repasar will show in one session, per mode. When more are due than this, the highest-priority ones (leeches, then most overdue) are chosen and the rest are pushed a few days out — never a growing backlog.'));
      var capRow = UI.el('div', 'cap-row');
      window.Profile.all().forEach(function (pf) {
        var field = UI.el('div', 'cap-field');
        field.appendChild(UI.el('label', 'field-label', pf.label));
        var input = UI.el('input', 'answer-input'); input.type = 'number'; input.min = '1'; input.max = '200';
        input.value = String(window.Profile.capFor(pf.name));
        input.addEventListener('change', function () {
          var n = parseInt(input.value, 10);
          if (n > 0) window.Profile.setCap(pf.name, n);
          input.value = String(window.Profile.capFor(pf.name));
        });
        field.appendChild(input);
        capRow.appendChild(field);
      });
      wrap.appendChild(capRow);
    }

    var home = UI.el('button', 'ghost-btn', '← Más');
    home.type = 'button'; home.style.marginTop = '24px';
    home.addEventListener('click', back);
    wrap.appendChild(home);

    host.appendChild(wrap);
  }

  return { render: render, exportData: exportData, importData: importData };
})();
