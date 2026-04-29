// Bump CACHE_NAME any time you ship a change so phones pick up the new files.
// The page detects the new SW, shows an "Update available" banner, and reloads
// when the tech taps it (or on next app launch if they don't).
const CACHE_NAME = '4m-fire-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install: cache all assets. We do NOT call skipWaiting() here on purpose —
// we wait for the page to ask for it via a SKIP_WAITING message, so the tech
// isn't booted out of a half-filled form by an automatic reload.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate: clean old caches and take control of any open pages.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Listen for SKIP_WAITING from the page so we activate exactly when the user
// taps "Update now". This is what makes the in-app update banner work.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch: serve from cache, fall back to network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
