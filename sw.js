const C = 'scull-v1.75';
 self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(r => {
      const rc = r.clone();
      caches.open(C).then(c => c.put(e.request, rc));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
