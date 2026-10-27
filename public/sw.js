/* Offline cache: caches same-origin assets on use; online-first updates. */
const CACHE = 'frame-one-v09b-1';
const CORE = ['./', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(x => x.startsWith('frame-one-') && x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const u = new URL(event.request.url);
  if (u.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(resp => {
    if (resp.ok && resp.type === 'basic') {
      const copy = resp.clone();
      event.waitUntil(caches.open(CACHE).then(c => c.put(event.request, copy)));
    }
    return resp;
  }).catch(async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    if (event.request.mode === 'navigate') {
      const shell = await caches.match('./');
      if (shell) return shell;
    }
    return Response.error();
  }));
});
