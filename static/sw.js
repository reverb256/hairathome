// Enhanced PWA Service Worker with offline capabilities
const CACHE_NAME = 'hairathome-v2';
const STATIC_CACHE = 'hairathome-static-v2';
const DYNAMIC_CACHE = 'hairathome-dynamic-v2';
const IMAGE_CACHE = 'hairathome-images-v2';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/about/',
  '/services/',
  '/gallery/',
  '/booking/',
  '/faq/',
  '/areas/',
  '/offline/',
  '/manifest.json'
];

// External resources to cache
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', function(event) {
  console.log('[SW] Install event');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open('hairathome-external-v2').then(cache => {
        console.log('[SW] Caching external assets');
        return cache.addAll(EXTERNAL_ASSETS);
      })
    ]).then(() => {
      console.log('[SW] Skip waiting');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', function(event) {
  console.log('[SW] Activate event');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== IMAGE_CACHE &&
                cacheName !== 'hairathome-external-v2') {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Enhanced fetch event with different caching strategies
self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle different resource types
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    // Image caching strategy
    event.respondWith(handleImageRequest(request));
  } else if (url.origin === location.origin) {
    // Same-origin requests
    event.respondWith(handleSameOriginRequest(request));
  } else {
    // External requests
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle image requests with cache-first strategy
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

// Handle same-origin requests with network-first strategy
function handleSameOriginRequest(request) {
  return fetch(request)
    .then(response => {
      // Cache successful responses
      if (response.status === 200) {
        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, responseToCache);
        });
      }
      return response;
    })
    .catch(() => {
      // Fallback to cache
      return caches.match(request)
        .then(response => {
          if (response) return response;

          // Return offline page for navigation requests
          if (request.destination === 'document') {
            return caches.match('/offline/');
          }

          return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    });
}

// Handle external requests with cache-first strategy
function handleExternalRequest(request) {
  return caches.match(request)
    .then(response => {
      if (response) return response;

      return fetch(request).then(response => {
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open('hairathome-external-v2').then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
    });
}

// Background sync for failed requests
self.addEventListener('sync', function(event) {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  console.log('[SW] Performing background sync');
}

// Push notifications (for future PWA features)
self.addEventListener('push', function(event) {
  console.log('[SW] Push received:', event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon-192x192.png',
      badge: '/favicon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification click:', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Message handler for communication with main thread
self.addEventListener('message', function(event) {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});