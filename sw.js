/* H.E.L.P. Center service worker — Web Push receiver.
   Shows notifications pushed from the backend (web-push) even when the
   PWA/dashboard is closed or backgrounded. */

self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { body: (event.data && event.data.text && event.data.text()) || '' }; }
  var title = data.title || 'H.E.L.P. Center';
  var options = {
    body: data.body || '',
    icon: data.icon || '/og-image.jpg',
    badge: data.badge || '/og-image.jpg',
    tag: data.tag || undefined,
    requireInteraction: !!data.requireInteraction,
    data: { url: data.url || '/help-center-system.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/help-center-system.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (wins) {
      for (var i = 0; i < wins.length; i++) {
        if (wins[i].url.indexOf(url) !== -1 && 'focus' in wins[i]) return wins[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
