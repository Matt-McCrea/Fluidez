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
 * ASSETS is GENERATED from index.html by tools/gen-assets.js (bump-cache.js
 * runs it first); never edit the list by hand. Data the page loads on demand
 * (data/lessons/<band>.js, data/requires/<band>.js, data/bank, story, scenes,
 * contrasts) is not precached: the data/ branch of the fetch handler below
 * caches each file the first time it is used and serves it from the cache
 * when offline. The hash in CACHE_VERSION covers those files too (see
 * tools/bump-cache.js), so changing one retires the cached copy.
 * ========================================================================== */
var CACHE_VERSION = 'ca4d2f03f';
var CACHE_NAME = 'fluidez-' + CACHE_VERSION;

var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './css/styles.css',
  './css/games.css',
  './icons/icon-192.png',
  './icons/icon-512-maskable.png',
  './icons/icon-512.png',
  './data/lessons/index.js',
  './js/bands-boot.js',
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
  './data/natural.js',
  './data/lessons/a1.js',
  './data/course.js',
  './data/lesson-aliases.js',
  './data/story/index.js',
  './data/graph.js',
  './data/requires/a1.js',
  './data/lesson-nodes.js',
  './data/resources.js',
  './js/lib.bundle.js',
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
  './js/gloss.js',
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
  './js/report.js',
  './js/lessonrun.js',
  './js/unitcheck.js',
  './js/selector.js',
  './js/drills.js',
  './js/library.js',
  './js/natural.js',
  './js/practice.js',
  './js/settings.js',
  './js/gamescore.js',
  './js/gameitems.js',
  './js/gameround.js',
  './js/games.js',
  './js/liga.js',
  './js/quickplay.js',
  './js/known.js',
  './js/bankitems.js',
  './js/scenes.js',
  './js/buildit.js',
  './js/contrasts.js',
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

  /* HANDS OFF OTHER ORIGINS. The league (js/liga.js) reads its board from
   * Supabase, and a cache-first worker would answer every later read with
   * the first one — a leaderboard frozen at the moment you joined. */
  if (new URL(event.request.url).origin !== self.location.origin) return;

  /* ON-DEMAND DATA. Band files and the sentence bank are big and not
   * precached. Cache-first like everything else: the first use fetches and
   * stores the file under this version's cache, every later use (and every
   * offline use) comes from the cache. A failed or partial response is never
   * stored, and with no network and no copy the request simply fails, which
   * the loaders treat as "band unavailable". */
  if (new URL(event.request.url).pathname.indexOf('/data/') !== -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (hit) {
          if (hit) return hit;
          return fetch(event.request).then(function (res) {
            if (res && res.status === 200) cache.put(event.request, res.clone());
            return res;
          });
        });
      })
    );
    return;
  }

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
