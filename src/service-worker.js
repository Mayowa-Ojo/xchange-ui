self.importScripts('./assets/data/cache-assets.js')

// globals
const cacheName = 'pwa-static-v2.1.2'
// Fire an event when service worker is installed
self.addEventListener('install', function(e) {
    console.log("service worker installed")
    // make sure SW doesn't shut6down before caching
    e.waitUntil(
        // call the cache api
        caches.open(cacheName)
            .then(function(cache) {
                // we can also cache urls from external sites
                cache.addAll(assets)
        })
    )
})

// Listen to the activate event - fires when the user closes current tabs and reopens
self.addEventListener('activate', function() {
    console.log("service worker activated")
    // delete old cache if there's a new version
    caches.keys().then(keys => {
        // console.log(keys)
        return Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))
    })
})

// add caching functionality for offline capabilities

// add event listner for the fetch event - which is triggered whenever you fetch something in the index.html file
self.addEventListener('fetch', function(e) {
    // change the default behaviour of the browser (making a network request)
    // use the service worker like a network proxy
    e.respondWith(
        // match the incoming request with some resource in our cache
        caches.match(e.request)
            .then(function(res) {
                // res is null if there's nothing in the cache
                if(res) {
                    return res
                } else {
                    return fetch(e.request)
                }
            })
            .catch(_ => {
                if(e.request.url.indexOf('flag.svg') != -1) {
                    return caches.match('./offline.html')
                }
                return caches.match('./offline.html')
            })
            
    )
})
