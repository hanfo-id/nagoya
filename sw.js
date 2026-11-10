/* Install one release of the app shell. Public map tiles remain network-only. */
const RELEASE='20261110-route2';
const CACHE='nagoya-trip-'+RELEASE;
const VERSIONED=['style.css','controls.css','ux.css','travel.css','components.css','screen.css','screen.js','data/itinerary.js','trip-details.js','trip-data.js','map-locations.js','trip-state.js','ux.js','numbered-map.js','app.js','favicon.ico','favicon.svg','icons/apple-touch-icon.png','manifest.webmanifest'];
const STATIC=['index.html','guide.html','icons/favicon-32.png','icons/icon-192.png','icons/icon-512.png','vendor/leaflet/leaflet.css','vendor/leaflet/leaflet.js','vendor/leaflet/images/layers.png','vendor/leaflet/images/layers-2x.png'];
const root=self.registration.scope;
const urlFor=(path,version='')=>new URL(path+(version?'?v='+version:''),root).href;
const assets=new Map([...VERSIONED.map(path=>[urlFor(path),urlFor(path,RELEASE)]),...STATIC.map(path=>[urlFor(path),urlFor(path)])]);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(
 [...assets.values()].map(url=>new Request(url,{cache:'reload'}))
))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nagoya-trip-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||!url.href.startsWith(root))return;
 const canonical=url.origin+url.pathname;
 const navigation=request.mode==='navigate';
 const key=navigation&&canonical===root?urlFor('index.html'):assets.get(canonical);
 if(!key)return;
 // An explicit asset version always belongs to that release.
 if(!navigation&&url.searchParams.has('v')&&url.searchParams.get('v')!==RELEASE){
  event.respondWith(new Response('일정 앱 버전이 바뀌었습니다. 새로고침해 주세요.',{status:409}));
  return;
 }
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(key);
  if(cached)return cached;
  try{return await fetch(request)}
  catch{return new Response('오프라인에서 이 파일을 열 수 없습니다.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
 })());
});
