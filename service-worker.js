const PRECACHE_REVISION = 1;

workbox.precaching.precacheAndRoute(self.__precacheManifest);
workbox.precaching.precacheAndRoute([{
    url: '/', revision: 1
}, {
    url: '/static/manifest.json',
    revision: PRECACHE_REVISION
}, {
    url: '/_next/static/style.css',
    revision: PRECACHE_REVISION
}, {
    url: '/static/nprogress.css',
    revision: PRECACHE_REVISION
}, {
    url: '/static/fonts/lato-v14-latin-100.woff2',
    revision: PRECACHE_REVISION
}, {
    url: '/static/fonts/lato-v14-latin-regular.woff2',
    revision: PRECACHE_REVISION
}, {
    url: '/static/fonts/lato-v14-latin-900.woff2',
    revision: PRECACHE_REVISION
}]);
workbox.routing.registerRoute(
    /\.(?:js|css|woff2)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'static-resources',
    }),
);
workbox.routing.registerRoute(
    /\/api\//,
    workbox.strategies.networkFirst({
        cacheName: 'api',
    }),
);
workbox.routing.registerRoute(
    ({ event }) => event.request.mode === 'navigate',
    ({ url }) => fetch(url.href).catch(() => caches.match('/'))
);
