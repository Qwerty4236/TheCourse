const CACHE_NAME = "site-cache-v1";
const ASSETS = [
  "/thecourse/index.html",
  "/thecourse/style.css",
  "/thecourse/script.js",
  "/thecourse/info/index.html",
  "/thecourse/info/style.css",
  "/thecourse/info/script.js",
  "/thecourse/work/index.html",
  "/thecourse/work/style.css",
  "/thecourse/work/script.js",
  "/thecourse/img/cover/analyse.png",
  "/thecourse/img/cover/ang.png",
  "/thecourse/img/cover/brick.png",
  "/thecourse/img/cover/cfl.png",
  "/thecourse/img/cover/devp.png",
  "/thecourse/img/cover/mrp.png",
  "/thecourse/img/cover/pgc.png",
  "/thecourse/img/pdcov/analyse.png",
  "/thecourse/img/pdcov/ang.png",
  "/thecourse/img/pdcov/brick.png",
  "/thecourse/img/pdcov/cfl.png",
  "/thecourse/img/pdcov/devp.png",
  "/thecourse/img/pdcov/mrp.png",
  "/thecourse/img/pdcov/pgc.png",
  "/thecourse/misc/pdf/analyse.pdf",
  "/thecourse/misc/pdf/ang.pdf",
  "/thecourse/misc/pdf/brick.pdf",
  "/thecourse/misc/pdf/cfl.pdf",
  "/thecourse/misc/pdf/devp.pdf",
  "/thecourse/misc/pdf/mrp.pdf",
  "/thecourse/misc/pdf/pgc.pdf",
  "/thecourse/misc/path.json",
  "/thecourse/offline.html",  // Offline fallback page
];

// Install Service Worker & Cache Assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching assets...");
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Service Worker & Clean Up Old Caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Service Worker: Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve Cached Files or Fetch & Cache Them
self.addEventListener("fetch", (event) => {
  console.log(`Service Worker: Fetching resource: ${event.request.url}`);

  // Normalize the URL to lowercase to handle case-sensitivity
  const normalizedUrl = event.request.url.toLowerCase();

  // Handle dynamic content (like JSON files) with Network First strategy
  if (normalizedUrl.includes("/thecourse/misc/path.json")) {
    console.log("Service Worker: Network First for dynamic content...");
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          console.log("Service Worker: Fetch succeeded, caching...");
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          console.log("Service Worker: Fetch failed, serving from cache...");
          return caches.match(event.request);
        })
    );
  } else {
    console.log("Service Worker: Cache First for static content...");
    event.respondWith(
      caches.match(normalizedUrl).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(`Service Worker: Returning cached response for ${event.request.url}`);
          return cachedResponse;
        }

        // If no cached response, try fetching it
        return fetch(event.request).catch(() => {
          // If both cache and network fail, serve the offline page
          return caches.match("/TheCourse/offline.html");
        });
      })
    );
  }
});

// Skip Waiting & Claim Clients (to activate the new version immediately)
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
