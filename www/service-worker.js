// Имя кэша
const CACHE_NAME = 'super-trainer-cache-v1';
const OFFLINE_URL = './offline.html';

// Ресурсы для предварительного кэширования
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './img/logo.png',
  './cordova.js',
  './js/network-status.js'
];

// Установка сервис-воркера и предварительное кэширование
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Активация сервис-воркера
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Обработка запросов с стратегией "сначала кэш, затем сеть" и оффлайн-поддержкой
self.addEventListener('fetch', event => {
  // Проверяем, является ли запрос навигацией (запросом HTML-страницы)
  if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {
    
    event.respondWith(
      // Пытаемся получить ресурс из сети
      fetch(event.request)
        .catch(error => {
          // При ошибке сети возвращаем оффлайн-страницу
          console.log('Fetch failed; returning offline page instead.', error);
          return caches.match(OFFLINE_URL);
        })
    );
  } else {
    // Стандартная стратегия кэширования для не-HTML ресурсов
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // Кэшируем только успешные ответы
              if (response && response.status === 200 && response.type === 'basic') {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return response;
            })
            .catch(error => {
              // Для API-запросов или других non-HTML ресурсов
              // проверяем, можно ли вернуть что-то подходящее из кэша
              console.log('Network request failed, trying fallback', error);
              // Для изображений можно вернуть заглушку
              if (event.request.url.match(/\.(jpg|png|gif|svg)$/)) {
                return caches.match('./img/logo.png');
              }
              return new Response('Network error happened', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});

// Функция для кэширования новых ресурсов динамически
self.addEventListener('message', event => {
  // Проверяем, есть ли сообщение о кэшировании нового ресурса
  if (event.data && event.data.type === 'CACHE_NEW_ROUTE') {
    caches.open(CACHE_NAME)
      .then(cache => cache.add(event.data.url))
      .then(() => {
        console.log(`Cached new route: ${event.data.url}`);
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      })
      .catch(error => {
        console.error(`Failed to cache route: ${event.data.url}`, error);
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: false, error: error.message });
        }
      });
  }
});