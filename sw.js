/* Schwamm drüber: Offline-Hilfe (Service Worker)
   Lädt die App zuerst aus dem Netz und merkt sie sich; ohne Netz kommt sie aus dem Speicher. */
const CACHE='schwamm-drueber';
const DATEIEN=['./','index.html','manifest.json','icon-32.png','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(DATEIEN.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res&&res.ok){const k=res.clone();caches.open(CACHE).then(c=>c.put(r,k));}
      return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
  );
});
