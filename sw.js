const CACHE = 'messenger-v1';
const ASSETS = [
  '/mensageiro/index.html',
  '/mensageiro/pages/home.html',
  '/mensageiro/pages/chat.html',
  '/mensageiro/favicon.svg',
  '/mensageiro/manifest.json',
];

// Install — cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', e => {
  // Skip Firebase requests — always go to network
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Push notification (Web Push API)
self.addEventListener('push', e => {
  let data = { title: 'Messenger Online', body: 'Nova mensagem!' };
  try { data = e.data.json(); } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/mensageiro/favicon.svg',
      badge: '/mensageiro/favicon.svg',
      tag: 'messenger-msg',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: data.url || '/mensageiro/pages/home.html' }
    })
  );
});

// Notification click — open/focus the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = e.notification.data?.url || '/mensageiro/pages/home.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('mensageiro') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(target);
    })
  );
});
