/* ============================================================================
 * SERVICE WORKER — the arcade's own offline shell, scoped to /juegos/.
 *
 * Separate from the root sw.js on purpose. Two workers cannot both control the
 * same scope, so the arcade lives in its own directory and registers here;
 * installing it does not disturb the full app's worker, and uninstalling one
 * leaves the other alone. Fetches from this page still pass through this
 * worker even when they reach up to ../data and ../js, because a worker sees
 * every request its clients make, not only those inside its scope.
 *
 * CACHE_VERSION is DERIVED, like the root worker's: run `node
 * tools/bump-cache.js` after changing anything listed below, and
 * tools/validate-content.js fails if it is stale.
 *
 * ASSETS must mirror every <script>/<link> in juegos/index.html. It is
 * deliberately short — that shortness is the entire feature.
 * ========================================================================== */
var CACHE_VERSION = 'j408560fb';
var CACHE_NAME = 'fluidez-juegos-' + CACHE_VERSION;

var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  '../css/styles.css',
  '../css/games.css',
  '../css/arcade.css',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',

  '../js/perf.js',
  '../data/taxonomy.js',
  '../data/game-index.js',
  '../data/verbs.js',

  '../js/engine.js',
  '../js/checker.js',
  '../js/ui.js',
  '../js/srs.js',
  '../js/profile.js',
  '../js/speak.js',
  '../js/accepted.js',
  '../js/errorlog.js',

  '../js/gamescore.js',
  '../js/gameitems.js',
  '../js/gameround.js',
  '../js/games.js',
  '../js/arcade.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n.indexOf('fluidez-juegos-') === 0 && n !== CACHE_NAME; })
             .map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// Cache-first. The arcade has no content that can go stale within a session —
// every question comes from a file that is either cached or not there at all.
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        }
        return res;
      }).catch(function () { return cached; });
    })
  );
});
