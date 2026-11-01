// public/sw.js
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Simple pass-through (chahe toh offline caching bhi add kar sakta hai)
  e.respondWith(fetch(e.request));
});