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
var CACHE_VERSION = 't75f94702';
var CACHE_NAME = 'talaqa-' + CACHE_VERSION;

/* The letter clips (audio/l-*.mp3) are read from data/audio.js at install and
 * precached with the shell; every other clip is cached the first time it plays
 * (the fetch handler below puts any good same-origin GET in the cache). */
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

/* The clips named l-*.mp3 in data/audio.js: fetched past the HTTP cache like the shell.
 * A clip that fails to load never blocks the install. */
function letterClips(cache) {
  return fetch(new Request('./data/audio.js', { cache: 'reload' })).then(function (r) { return r.text(); }).then(function (t) {
    var files = {}, m, re = /"(audio\/l-[^"]+\.mp3)"/g;
    while ((m = re.exec(t))) files['./' + m[1]] = 1;
    return Promise.all(Object.keys(files).map(function (u) {
      return fetch(new Request(u, { cache: 'reload' })).then(function (res) { if (res && res.ok) return cache.put(u, res); }).catch(function () {});
    }));
  }).catch(function () {});
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    /* {cache: 'reload'}: past the browser's HTTP cache. GitHub Pages serves max-age=600,
     * so a plain addAll could fill the NEW version's cache with the OLD files. */
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); }))
        .then(function () { return letterClips(cache); });
    })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n.indexOf('talaqa-') === 0 && n !== CACHE_NAME; })
             .map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// Cache-first: every question comes from a file that is either cached or not there at all.
// Other audio/ clips are cached by the same rule the first time they play.
// The page (js/ga-arcade.js) asks the browser for a new worker whenever the app comes
// back to the front, and reloads on the board once one has taken over.
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
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
