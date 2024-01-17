/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE_KEY = 'precache-v1';
const UPDATED_PRECACHE_KEY = 'precache-v2';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = ['playground-wc.html', './css/main.css', './images/'];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE_KEY).then(cache => {
      // `Cache` instance for later use.
      return cache.addAll(PRECACHE_URLS);
    })
  );
});
// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [UPDATED_PRECACHE_KEY, RUNTIME];
  event.waitUntil(
    caches.keys().then(keys => {
      // Delete all caches that aren't in the allow list:
      return Promise.all(
        keys.map(key => {
          if (!currentCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  } else {
    return;
  }

  // Is this a request for an image?
  if (event.request.destination === 'image') {
    // Open the cache
    event.respondWith(
      caches.open(PRECACHE_KEY).then(cache => {
        // Respond with the image from the cache or from the network
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            console.log(cachedResponse);
            return cachedResponse;
          }

          return fetch(event.request.url).then(fetchedResponse => {
            // Add the network response to the cache for future visits.
            // Note: we need to make a copy of the response to save it in
            // the cache and use the original as the request response.
            cache.put(event.request, fetchedResponse.clone());

            // Return the network response
            return fetchedResponse;
          });
        });
      })
    );
  } else {
    return;
  }
});
