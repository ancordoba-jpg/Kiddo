// ============================================================
// Kiddo PWA - Service Worker
// Versión: 1.0.0
// ============================================================

const CACHE_NAME = 'kiddo-v1.0.0';
const STATIC_CACHE = 'kiddo-static-v1';
const DYNAMIC_CACHE = 'kiddo-dynamic-v1';

// Archivos esenciales para el shell de la app (cache-first)
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/components.css',
  './css/screens.css',
  './css/parental.css',
  './css/games.css',
  './js/data.js',
  './js/audio.js',
  './js/puky3d.js',
  './js/puky2d.js',
  './js/stories.js',
  './js/missions.js',
  './js/parental.js',
  './js/games.js',
  './js/app.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './assets/decor_abc.png',
  './assets/decor_bee.png',
  './assets/decor_butterfly.png',
  './assets/decor_cloud_lilac.png',
  './assets/decor_cloud_mint.png',
  './assets/decor_flower.png',
  './assets/decor_rainbow.png',
  './assets/decor_rocket.png',
  './assets/decor_star.png',
  './assets/logo_kiddo.png',
  './assets/koala_transparent.png',
  './assets/koala_peeking.png',
];

// ============================================================
// INSTALL: Pre-cachear el App Shell
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[Kiddo SW] Instalando Service Worker v1.0.0...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Kiddo SW] Pre-cacheando App Shell...');
      return cache.addAll(APP_SHELL);
    }).then(() => {
      console.log('[Kiddo SW] App Shell cacheado exitosamente');
      return self.skipWaiting();
    }).catch((err) => {
      console.error('[Kiddo SW] Error al cachear App Shell:', err);
    })
  );
});

// ============================================================
// ACTIVATE: Limpiar caches viejos
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[Kiddo SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[Kiddo SW] Eliminando cache obsoleto:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[Kiddo SW] Service Worker activo y controlando clientes');
      return self.clients.claim();
    })
  );
});

// ============================================================
// FETCH: Estrategia Cache-First con fallback a Network
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones no GET
  if (request.method !== 'GET') return;

  // Ignorar peticiones a extensiones de Chrome y otras APIs
  if (url.protocol === 'chrome-extension:') return;

  // Ignorar peticiones a CDN externos (Three.js, Google Fonts, etc.)
  const externalHosts = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
  if (externalHosts.some(host => url.hostname.includes(host))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, cloned));
          }
          return response;
        }).catch(() => new Response('', { status: 408 }));
      })
    );
    return;
  }

  // Estrategia: Cache First → Network → Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Actualizar en background (Stale-While-Revalidate)
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(STATIC_CACHE).then(cache => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // No está en cache → ir a la red
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const clonedResponse = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, clonedResponse);
        });
        return networkResponse;
      }).catch(() => {
        // Fallback para navegación offline
        if (request.destination === 'document') {
          return caches.match('./index.html');
        }
        return new Response('Contenido no disponible sin conexión', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});

// ============================================================
// BACKGROUND SYNC: Sincronizar datos cuando vuelva la conexión
// ============================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'kiddo-sync') {
    console.log('[Kiddo SW] Sincronizando datos en background...');
  }
});

// ============================================================
// PUSH NOTIFICATIONS (preparado para futuro)
// ============================================================
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'Kiddo', {
    body: data.body || '¡Puky te espera para jugar! 🐨',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || './' }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || './')
  );
});

console.log('[Kiddo SW] Service Worker cargado ✓');
