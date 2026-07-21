/* ============================================================================
 * SERVICE WORKER — cache-first offline shell.
 *
 * Bump CACHE_VERSION on every deploy that changes a cached file. Every install
 * gets a fresh cache name, so nothing lingers stale — the old cache is deleted
 * on activate. js/pwa.js listens for a waiting worker and shows the update
 * banner; the user's tap calls skipWaiting via postMessage.
 *
 * ASSETS must mirror every <script>/<link> in index.html. No bundler here —
 * keep this list in sync by hand when a new data/js file is added there.
 * ========================================================================== */
var CACHE_VERSION = 'v11';
var CACHE_NAME = 'fluidez-' + CACHE_VERSION;

var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',

  './data/verbs.js',
  './data/vocab.js',
  './data/idioms.js',
  './data/grammar-docs.js',
  './data/grammar.js',
  './data/passages.js',
  './data/apply.js',
  './data/writing.js',
  './data/topics.js',
  './data/resources.js',

  './js/engine.js',
  './js/lessons.js',
  './js/checker.js',
  './js/srs.js',
  './js/profile.js',
  './js/curriculum.js',
  './js/ui.js',
  './js/errorlog.js',
  './js/capture.js',
  './js/userwords.js',
  './js/deck.js',

  './js/views/review.js',
  './js/views/learn.js',
  './js/views/comprehend.js',
  './js/views/apply.js',
  './js/views/produce.js',

  './js/hub.js',
  './js/progress.js',
  './js/resources.js',
  './js/write.js',
  './js/writer.js',
  './js/grammar.js',
  './js/lessonrun.js',
  './js/selector.js',
  './js/drills.js',
  './js/practice.js',
  './js/settings.js',
  './js/games.js',

  './js/session.js',
  './js/shell.js',
  './js/app.js',
  './js/pwa.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(ASSETS); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; })
             .map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// Cache-first, falling back to network (and stashing the network response for
// next time). Anything not in ASSETS still gets opportunistically cached.
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

// Let the page trigger the waiting worker to take over immediately.
self.addEventListener('message', function (event) {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
