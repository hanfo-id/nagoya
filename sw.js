/* Cache only this project's application files. Never cache OSM or external pages. */
const CACHE='nagoya-trip-20261107-gero1';
const FILES=['./','index.html','guide.html','favicon.ico','favicon.svg','manifest.webmanifest','icons/apple-touch-icon.png','icons/favicon-32.png','icons/icon-192.png','icons/icon-512.png','style.css','controls.css','ux.css','travel.css','components.css','screen.css','screen.js','place-experiences.js','trip-details.js','trip-data.js','map-locations.js','trip-state.js','ux.js','numbered-map.js','app.js','vendor/leaflet/leaflet.css','vendor/leaflet/leaflet.js','vendor/leaflet/images/layers.png','vendor/leaflet/images/layers-2x.png'];
const urls=FILES.map(file=>new URL(file,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(urls))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nagoya-trip-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const canonical=url.origin+url.pathname;
 if(!urls.includes(canonical)&&request.mode!=='navigate')return;
 // Same-origin, project-scope navigation only. Query parameters remain in the browser URL.
 if(!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{const response=await fetch(request);if(response.ok&&urls.includes(canonical))await cache.put(canonical,response.clone());return response}
  catch{const hit=await cache.match(canonical)||request.mode==='navigate'&&await cache.match(new URL('index.html',self.registration.scope));if(hit)return hit;return new Response('오프라인에서 이 파일을 열 수 없습니다.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
 })());
});
