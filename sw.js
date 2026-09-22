/* ============================================================================
 * SERVICE WORKER — cache-first offline shell.
 *
 * CACHE_VERSION is DERIVED, not typed: it is a hash of the files listed in
 * ASSETS. Run `node tools/bump-cache.js` after changing any of them, and
 * tools/validate-content.js fails if you forget. It used to say "bump this on
 * every deploy that changes a cached file", which is a human step, and it
 * failed the way human steps do — nine changed files shipped behind a stale
 * version, so the work was live and invisible.
 * gets a fresh cache name, so nothing lingers stale — the old cache is deleted
 * on activate. js/pwa.js listens for a waiting worker and shows the update
 * banner; the user's tap calls skipWaiting via postMessage.
 *
 * ASSETS must mirror every <script>/<link> in index.html. No bundler here —
 * keep this list in sync by hand when a new data/js file is added there.
 * ========================================================================== */
var CACHE_VERSION = 'c5844ec4c';
var CACHE_NAME = 'fluidez-' + CACHE_VERSION;

var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/games.css',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',

  './js/perf.js',
  './data/taxonomy.js',
  './data/connectors.js',
  './data/rubrics.js',
  './data/verbs.js',
  './data/vocab.js',
  './data/idioms.js',
  './data/grammar-docs.js',
  './data/grammar.js',
  './data/passages.js',
  './data/apply.js',
  './data/writing.js',
  './data/topics.js',
  './data/strand-lessons.js',
  './data/course.js',
  './data/resources.js',

  './js/engine.js',
  './js/lessons.js',
  './js/checker.js',
  './js/srs.js',
  './js/profile.js',
  './js/curriculum.js',
  './js/ui.js',
  './js/speak.js',
  './js/vetoed.js',
  './js/accepted.js',
  './js/focus.js',
  './js/lexmatch.js',
  './js/errorlog.js',
  './js/capture.js',
  './js/userwords.js',
  './js/phrases.js',
  './js/deck.js',
  './js/essay.js',

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
  './js/deepdive.js',
  './js/suggest.js',
  './js/lessonrun.js',
  './js/unitcheck.js',
  './js/selector.js',
  './js/drills.js',
  './js/practice.js',
  './js/settings.js',
  './js/gamescore.js',
  './js/gameitems.js',
  './js/gameround.js',
  './js/games.js',
  './js/quickplay.js',

  './js/session.js',
  './js/onboarding.js',
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

  /* HANDS OFF THE ARCADE. This worker's scope is './' — the whole site — and
   * juegos/ is a separate build with its own worker and its own cache. While
   * this one answered requests for that page it could hand it a MIXTURE: the
   * arcade's new files were never in this cache so they arrived fresh, while
   * shared files like js/gamescore.js were in it and arrived stale. The new
   * board then called a function the old build had never heard of, and the
   * page went blank. Ignoring the directory entirely lets the first load of
   * the arcade come from the network and register its own worker, which then
   * controls every fetch that page makes.
   *
   * Note this must catch the arcade's OWN requests for shared files too, and
   * it does: once juegos/sw.js is the controller for that client, this worker
   * never sees them. Before that, the referrer is what distinguishes them —
   * but a navigation to juegos/ is enough to break the cycle. */
  if (event.request.url.indexOf('/juegos/') !== -1) return;

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
