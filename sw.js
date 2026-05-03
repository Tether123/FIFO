const CACHE_NAME = 'fiscal-tracker-v1';

const URLS_TO_CACHE = [
  './',
  './usd_fifo_fiscal_tracker_v2.html',
  './manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepción de peticiones (Cache First, Network Fallback)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve la respuesta desde la caché si existe
        if (response) {
          return response;
        }
        // Si no está en caché, hace la petición a la red
        return fetch(event.request);
      })
  );
});
