//Service worker

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('restaurantsCache').then(function(cache) {
      return cache.addAll([
        '/',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js',
        '/css/styles.css',
        //include all images
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg',
      ]);
    })
  );
});

// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           return cacheName.startsWith('restaurants') &&
//                  cacheName != 'restaurantsCache';
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });


self.addEventListener('fetch', function (event) {
  // TODO: respond to requests for the root page with
  // the page skeleton from the cache
  var requestUrl = new URL(event.request.url);

  // if (requestUrl.origin === location.origin) {
  //   if (requestUrl.pathname === '/') {
  //     console.log('passed');
  //     event.respondWith(
  //       caches.match('/restaurantsCache')
  //       .then(response => {
  //         console.log(response);
  //       }));
  //     return;
  //   }
  // }

  event.respondWith(caches.match(event.request)
    .then(function (response) {
      console.log(response)
      return response || fetch(event.request);
    }));
});

