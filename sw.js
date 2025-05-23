// WebXRゲームセンター Service Worker

const CACHE_NAME = 'webxr-gamecenter-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/logo_primary.webp',
  '/assets/images/mr_othello_package.webp',
  '/assets/images/mrvr_character.webp',
  '/assets/images/mrsecret_vr_widescreen.webp',
  '/assets/images/mr_othello_gameplay.jpg',
  '/assets/images/slide_game_1.webp',
  '/assets/images/slide_game_2.webp',
  '/assets/images/slide_game_3.webp',
  '/assets/images/slide_game_4.webp',
  '/assets/images/logo_secondary.webp',
  '/assets/images/mrsecret_vr_logo.webp',
  '/assets/images/solar_explorer_xr_package.webp',
  '/assets/images/solar_explorer_xr_gameplay.webp'
];

// インストール時にリソースをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('キャッシュを開きました');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベーション時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// フェッチイベントをインターセプトしてキャッシュから取得またはネットワークからフェッチ
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        
        // キャッシュになければネットワークから取得
        return fetch(event.request).then(
          response => {
            // 有効なレスポンスをチェック
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // レスポンスをキャッシュに保存（クローンして使用）
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
      .catch(() => {
        // オフライン用フォールバックページ
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
}); 