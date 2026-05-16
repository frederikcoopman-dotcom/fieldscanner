const CACHE_NAME = 'werkbon-app-cache-v2'; // Verhoogd naar v2 om update te forceren
const urlsToCache = [
  'index.html',
  'manifest.json',
  'js/html2pdf.bundle.min.js' // BELANGRIJK: lokaal script wordt nu gecached
];

// Installeer de service worker en cache de bestanden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache geopend');
        return cache.addAll(urlsToCache);
      })
  );
});

// Vang netwerkverzoeken op en geef de gecachte versie terug
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Geef gecachte versie terug OF haal het van het netwerk als het niet in cache is
        return response || fetch(event.request);
      })
  );
});

// Ruim oude caches op
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
