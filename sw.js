// Cache and requests are isolated to this installation directory.
const SCOPE = new URL(self.registration.scope);
const CACHE_PREFIX = `money-save:${SCOPE.pathname}:`;
const CACHE = `${CACHE_PREFIX}pages-v9`;
const FILES = ['./','./index.html','./css/styles.css','./js/app.js','./js/budget.js','./js/storage.js','./js/views.js','./js/encouragement.js','./icons/icon.svg','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const ASSETS = FILES.map(file => new URL(file, SCOPE).href);
const ALLOWED = new Set(ASSETS);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(url => new Request(url, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  url.search = ''; url.hash = '';
  // Never intercept personal backups or resources outside the static asset list.
  if (!ALLOWED.has(url.href)) return;
  event.respondWith(caches.open(CACHE).then(cache => cache.match(url.href)).then(cached => cached || fetch(event.request)));
});
