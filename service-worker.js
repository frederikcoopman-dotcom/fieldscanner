// Verhoog de versie om een update te forceren bij gebruikers
const CACHE_NAME = 'werkbon-app-cache-v3'; 
const urlsToCache = [
  'index.html',
  'manifest.json',
  'js/html2pdf.bundle.min.js', // Het script voor PDF's
  'images/icon-192.png',       // Het icoon
  'images/icon-512.png'        // Het grotere icoon
];

// Installeer de service worker en cache de bestanden
self.addEventListener('install', event => {
  // forceer de nieuwe service worker om onmiddellijk actief te worden
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache geopend en bestanden worden gecached');
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

// Ruim alle oude caches op wanneer de nieuwe service worker activeert
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Oude cache wordt verwijderd:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
