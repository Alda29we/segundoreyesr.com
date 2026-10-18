// Service Worker para PWA - Segundo Reyes
const CACHE_NAME = 'sr-cache-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css?v=2.1',
  '/script.js?v=2.1',
  '/manifest.webmanifest',
  '/assets/favicon.svg',
  '/assets/avatar.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Network-First: Siempre intenta obtener el archivo más reciente de la red
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignorar esquemas no soportados por Cache Storage (chrome-extension://, edge-extension://, moz-extension://)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Solo cachear respuestas válidas HTTP 200 de tipo básico o CORS
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En caso de no tener internet, usar la caché offline
        return caches.match(event.request);
      })
  );
});
