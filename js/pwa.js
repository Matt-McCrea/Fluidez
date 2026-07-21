/* ============================================================================
 * PWA — service worker registration + "new version" update banner.
 * Registers sw.js, and when a new worker finishes installing (waiting to
 * activate), shows a small banner. Tapping it tells the waiting worker to
 * skipWaiting and reloads once the new one has taken control.
 * ========================================================================== */
(function () {
  if (!('serviceWorker' in navigator)) return;

  function showUpdateBanner(reg) {
    var b = document.createElement('div');
    b.className = 'sw-update-banner';
    b.textContent = 'Nueva versión — tocar para actualizar';
    b.addEventListener('click', function () {
      if (reg.waiting) reg.waiting.postMessage('skipWaiting');
    });
    document.body.appendChild(b);
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      // A worker already waiting (e.g. update installed while the tab was closed).
      if (reg.waiting) showUpdateBanner(reg);

      reg.addEventListener('updatefound', function () {
        var installing = reg.installing;
        if (!installing) return;
        installing.addEventListener('statechange', function () {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(reg);
          }
        });
      });
    }).catch(function () { /* offline-first is a bonus, not a requirement */ });

    // Once the new worker takes control, reload so the page picks up fresh assets.
    var reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  });
})();
