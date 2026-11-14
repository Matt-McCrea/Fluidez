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
var CACHE_VERSION = 'j1db9fd97';
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
  '../data/word-rank.js',
  '../data/verb-gaps.js',
  '../data/phrases.js',
  '../data/conversations.js',
  '../data/convo-audio.js',
  '../data/tense-cards.js',
  '../js/gameitems.js',
  '../js/gameround.js',
  '../js/games.js',
  '../js/liga.js',
  '../js/study.js',
  '../js/tensecheck.js',
  '../js/convo-audio.js',
  '../js/convo.js',
  '../js/arcade.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    /* {cache: 'reload'}: past the browser's HTTP cache. GitHub Pages serves max-age=600,
     * so a plain addAll could fill the NEW version's cache with the OLD files (9 Nov 2026). */
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
  // The conversation voices (audio/c-*.bin) are named by their content: kept in their own
  // cache, which a new version does not clear, so they are fetched once.
  var u = new URL(event.request.url);
  if (u.origin === self.location.origin && u.pathname.indexOf('/audio/') !== -1) {
    event.respondWith(caches.open('juegos-audio').then(function (cache) {
      return cache.match(event.request).then(function (hit) {
        return hit || fetch(event.request).then(function (res) {
          if (res && res.ok) cache.put(event.request, res.clone());
          return res;
        });
      });
    }));
    return;
  }
  // The league's board comes from Supabase and must never be served from here.
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
