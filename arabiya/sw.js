/* ============================================================================
 * SERVICE WORKER: Ṭalāqa's own offline shell, scoped to /arabiya/.
 *
 * Separate from the Spanish apps' workers on purpose: two workers cannot control
 * the same scope, and its cache name starts `talaqa-` so the others never touch it.
 *
 * CACHE_VERSION must equal Perf.BUILD in js/perf.js (tools/test-arabiya-app.js
 * checks). Change both whenever anything listed below changes, or installed copies
 * keep serving the old files.
 *
 * ASSETS must mirror every <script>/<link> in index.html plus the data files.
 * ========================================================================== */
var CACHE_VERSION = 'td917f4eb';
var CACHE_NAME = 'talaqa-' + CACHE_VERSION;
/* Audio bundles are named by their content hash, so they never go stale: they live
 * in their own cache that a new version keeps, and nothing is downloaded twice. */
var AUDIO_CACHE = 'talaqa-audio';

/* The letter bundles (audio/l-*.bin) are read from data/audio.js at install and
 * precached; every other bundle is cached the first time one of its clips plays. */
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/talaqa.css',
  './fonts/naskh.woff2',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',

  './js/perf.js',
  './js/ar-text.js',
  './js/ar-core.js',
  './js/ui.js',
  './js/srs.js',
  './js/errorlog.js',
  './js/gamescore.js',
  './js/ar-audio.js',

  './data/letters.js',
  './data/audio.js',
  './data/verbs.js',
  './data/words.js',
  './data/phrases.js',
  './data/cards.js',
  './data/gaps-afal.js',
  './data/gaps-harakat.js',
  './data/gaps-jidhr.js',
  './data/gaps-jumu.js',
  './data/gaps-damair.js',

  './js/ar-items.js',
  './js/gameround.js',
  './js/ar-huruf.js',
  './js/ar-check.js',
  './js/ar-arcade.js'
];

/* The bundles named l-*.bin in data/audio.js, into the audio cache. A bundle that
 * fails to load never blocks the install. */
function letterClips() {
  return caches.open(AUDIO_CACHE).then(function (cache) {
    return fetch(new Request('./data/audio.js', { cache: 'reload' })).then(function (r) { return r.text(); }).then(function (t) {
      var files = {}, m, re = /"(audio\/l-[0-9a-f]+\.bin)#/g;
      while ((m = re.exec(t))) files['./' + m[1]] = 1;
      return Promise.all(Object.keys(files).map(function (u) {
        return cache.match(u).then(function (hit) {
          if (hit) return;
          return fetch(u).then(function (res) { if (res && res.ok) return cache.put(u, res); });
        }).catch(function () {});
      }));
    });
  }).catch(function () {});
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    /* {cache: 'reload'}: past the browser's HTTP cache. GitHub Pages serves max-age=600,
     * so a plain addAll could fill the NEW version's cache with the OLD files. */
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); }))
        .then(function () { return letterClips(); });
    })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n.indexOf('talaqa-') === 0 && n !== CACHE_NAME && n !== AUDIO_CACHE; })
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
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf('/audio/') !== -1) {
    event.respondWith(caches.open(AUDIO_CACHE).then(function (cache) {
      return cache.match(event.request).then(function (hit) {
        return hit || fetch(event.request).then(function (res) {
          if (res && res.ok) cache.put(event.request, res.clone());
          return res;
        });
      });
    }));
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
