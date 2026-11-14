/* ============================================================================
 * SERVICE WORKER: Líofa's own offline shell, scoped to /gaeilge/.
 *
 * Separate from the Spanish apps' workers on purpose: two workers cannot control
 * the same scope, and its cache name starts `liofa-` so the others never touch it.
 *
 * CACHE_VERSION must equal Perf.BUILD in js/perf.js (tools/test-gaeilge-app.js
 * checks). Change both whenever anything listed below changes, or installed copies
 * keep serving the old files.
 *
 * ASSETS must mirror every <script>/<link> in index.html plus the data files.
 * ========================================================================== */
var CACHE_VERSION = 'lca79dede';
var CACHE_NAME = 'liofa-' + CACHE_VERSION;

var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/liofa.css',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',

  './js/perf.js',
  './js/ga-text.js',
  './js/ga-core.js',
  './js/ui.js',
  './js/srs.js',
  './js/errorlog.js',
  './js/gamescore.js',

  './data/verbs.js',
  './data/words.js',
  './data/phrases.js',
  './data/conversations.js',
  './data/convo-audio.js',
  './data/cards.js',
  './data/gaps-briathra.js',
  './data/gaps-seimhiu.js',
  './data/gaps-forainm.js',
  './data/gaps-tais.js',
  './data/gaps-freagair.js',

  './js/ga-items.js',
  './js/gameround.js',
  './js/ga-check.js',
  './js/convo-audio.js',
  './js/ga-convo.js',
  './js/ga-arcade.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    /* {cache: 'reload'}: past the browser's HTTP cache. GitHub Pages serves max-age=600,
     * so a plain addAll could fill the NEW version's cache with the OLD files. */
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
    })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n.indexOf('liofa-') === 0 && n !== CACHE_NAME; })
             .map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// Cache-first: every question comes from a file that is either cached or not there at all.
// The page (js/ga-arcade.js) asks the browser for a new worker whenever the app comes
// back to the front, and reloads on the board once one has taken over.
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  // The conversation voices (audio/c-*.bin) are named by their content: kept in their own
  // cache, which a new version does not clear, so they are fetched once.
  var u = new URL(event.request.url);
  if (u.origin === self.location.origin && u.pathname.indexOf('/audio/') !== -1) {
    event.respondWith(caches.open('gaeilge-audio').then(function (cache) {
      return cache.match(event.request).then(function (hit) {
        return hit || fetch(event.request).then(function (res) {
          if (res && res.ok) cache.put(event.request, res.clone());
          return res;
        });
      });
    }));
    return;
  }
  if (new URL(event.request.url).origin !== self.location.origin) return;
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
