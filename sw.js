
const CACHE_NAME = "tapsagoi-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/splash-1024.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Always fetch Firebase calls live (for real-time chats)
      if (event.request.url.includes("firebaseio.com") ||
          event.request.url.includes("firestore.googleapis.com")) {
        return fetch(event.request).catch(() => cached);
      }
      return cached || fetch(event.request).catch(() => caches.match("/index.html"));
    })
  );
});
