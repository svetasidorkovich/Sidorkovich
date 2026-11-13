// Чирик: работа без интернета
const CACHE='chirik-v4';
const FILES=['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'fonts/balsamiq-sans-cyrillic-400-normal.woff2', 'fonts/balsamiq-sans-cyrillic-700-normal.woff2', 'fonts/balsamiq-sans-latin-400-normal.woff2', 'fonts/balsamiq-sans-latin-700-normal.woff2', 'fonts/nunito-cyrillic-600-normal.woff2', 'fonts/nunito-cyrillic-800-normal.woff2', 'fonts/nunito-cyrillic-900-normal.woff2', 'fonts/nunito-latin-600-normal.woff2', 'fonts/nunito-latin-800-normal.woff2', 'fonts/nunito-latin-900-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    // страница: сначала из сети (чтобы приходили обновления), без сети из кэша
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('./',cp));return res}).catch(()=>caches.match('./').then(m=>m||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
