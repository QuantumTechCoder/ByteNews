const CACHE_NAME = "bytenews-v1";
const STATIC_ASSETS = [
  "/",
  "/newest",
  "/manifest.json",
  "/icon.svg",
];

// Install: pre-cache static shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch:
// - Cache-first for static assets (_next/static, fonts, icons, svg)
// - Stale-While-Revalidate for HTML navigation and page requests
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass non-GET requests (e.g. Server Actions, POST)
  if (event.request.method !== "GET") {
    return;
  }

  // Bypass chrome-extension or external URLs
  if (url.origin !== self.location.origin) {
    return;
  }

  // 1. Static Assets: Cache-First
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 2. HTML and Page Requests: Stale-While-Revalidate
  // For page navigation, return cached version immediately if present,
  // then update the cache with fresh network content in the background.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails and no cached response, fallback to pre-cached root
          return cachedResponse || caches.match("/");
        });

      return cachedResponse || fetchPromise;
    })
  );
});
