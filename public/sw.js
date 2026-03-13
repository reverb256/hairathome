const CACHE_NAME = 'hairathome-v3';
const STATIC_CACHE = 'hairathome-static-v3';
const DYNAMIC_CACHE = 'hairathome-dynamic-v3';
const IMAGE_CACHE = 'hairathome-images-v3';

const STATIC_ASSETS = [
  '/',
  '/assets/css/main.css',
  '/assets/js/app.js',
  '/js/main.js',
  '/gallery/',
  '/manifest.json',
  '/images/brand/logo-hero.svg',
  '/images/brand/logo-hero-dark.svg',
  '/images/brand/logo-header.svg',
  '/images/brand/logo-header-dark.svg'
];

const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap'
];

self.addEventListener('install', function(event) {
  console.log('[SW] Install event');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open('hairathome-external-v3').then(cache => {
        console.log('[SW] Caching external assets');
        return cache.addAll(EXTERNAL_ASSETS).catch(() => {
          console.log('[SW] Some external assets failed to cache');
        });
      })
    ]).then(() => {
      console.log('[SW] Skip waiting');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Activate event');
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== IMAGE_CACHE &&
                cacheName !== 'hairathome-external-v3') {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    event.respondWith(handleImageRequest(request));
  } else if (url.origin === location.origin) {
    event.respondWith(handleSameOriginRequest(request));
  } else {
    event.respondWith(handleExternalRequest(request));
  }
});

function handleImageRequest(request) {
  return caches.match(request)
    .then(response => {
      if (response) return response;

      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(IMAGE_CACHE).then(cache => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    });
}

function handleSameOriginRequest(request) {
  return fetch(request)
    .then(response => {
      if (response.status === 200) {
        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, responseToCache);
        });
      }
      return response;
    })
    .catch(() => {
      return caches.match(request)
        .then(response => {
          if (response) return response;

          if (request.destination === 'document') {
            return caches.match('/');
          }

          return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    });
}

function handleExternalRequest(request) {
  return caches.match(request)
    .then(response => {
      if (response) return response;

      return fetch(request).then(response => {
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open('hairathome-external-v3').then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
    });
}

self.addEventListener('message', function(event) {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
