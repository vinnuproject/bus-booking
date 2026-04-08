const CACHE_NAME = 'bus-booking-v1';
const urlsToCache = [
  '/',
  '/src/main.js',
  '/src/App.vue',
  '/src/views/HomeView.vue',
  // Add other critical files
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});