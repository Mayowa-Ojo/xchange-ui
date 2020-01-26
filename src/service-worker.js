// Fire an event when service worker is installed
self.addEventListener('install', function(e) {
    console.log("service worker installed")
    // make sure SW doesn't shut6down before caching
    e.waitUntil(
        // call the cache api
        caches.open('static')
            .then(function(cache) {
                cache.add('/')
                cache.add('./index.html')
                cache.add('./styles/style.css')
                cache.add('./scripts/script.js')
                cache.add('./assets/svg/canada.svg')
                cache.add('./assets/svg/nigeria.svg')
                cache.add('./assets/svg/usa.svg')
                // we can also cache urls from external sites
                // cache.addAll([
                //     '/',
                //     './index.html',
                //     '/src/scripts/script.js',
                //     '/src/styles/styles.css'
                // ])
        })
    )
})

// Listen to the activate event - fires when the user closes current tabs and reopens
self.addEventListener('activate', function() {
    console.log("service worker activated")
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
    )
})
