/* ============================================================================
 * SETTINGS (Ajustes) — export / import your data.
 *
 * iOS gives a home-screen web app its OWN storage sandbox, separate from
 * Safari's. Progress made in Safari will NOT appear once you install to the
 * home screen (and vice versa) — export from Safari, install, then import
 * once, on first launch. This is also the app's only backup: everything here
 * lives in localStorage on one device with nothing else keeping a copy.
 * ========================================================================== */
window.Settings = (function () {
  var UI = window.UI;
  // Every key Fluidez writes to localStorage. Keep this in sync by hand —
  // there's no build step to derive it automatically.
  var KEYS = ['fluidez.srs', 'fluidez.progress', 'fluidez.errors', 'fluidez.captured',
    'fluidez.journal', 'fluidez.profile', 'fluidez.theme', 'fluidez.topicLevel'];

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

    wrap.appendChild(UI.el('h3', null, 'Exportar / importar datos'));
    wrap.appendChild(UI.el('p', 'muted',
      'A home-screen install keeps its own storage, separate from Safari. ' +
      'Export here before installing, then import once inside the installed app. ' +
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

    var home = UI.el('button', 'ghost-btn', '← Más');
    home.type = 'button'; home.style.marginTop = '24px';
    home.addEventListener('click', back);
    wrap.appendChild(home);

    host.appendChild(wrap);
  }

  return { render: render, exportData: exportData, importData: importData };
})();
