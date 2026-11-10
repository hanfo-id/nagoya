const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
(async()=>{
 const listeners={},entries=new Map(),deleted=[],requests=[];
 const scope='https://example.com/nagoya/',cache={addAll:async urls=>{for(const u of urls)entries.set(u,{cached:u})},put:async(k,v)=>entries.set(k,v),match:async k=>entries.get(String(k))};
 const c=vm.createContext({URL,Response,self:{registration:{scope},location:new URL(scope),addEventListener:(k,fn)=>listeners[k]=fn,clients:{claim:async()=>{}},skipWaiting:()=>{}},caches:{open:async()=>cache,keys:async()=>['nagoya-trip-old','other-app'],delete:async k=>deleted.push(k)},fetch:async request=>{requests.push(request.url);throw Error('offline')}});
 vm.runInContext(fs.readFileSync('sw.js','utf8'),c);
 let pending;listeners.install({waitUntil(p){pending=p}});await pending;
 assert.ok(entries.has(scope+'index.html'));assert.ok(entries.has(scope+'trip-data.js'));assert.ok(entries.has(scope+'data/itinerary.js'));assert.ok(entries.has(scope+'guide.html'));assert.ok(![...entries.keys()].some(u=>u.includes('openstreetmap')));
 listeners.activate({waitUntil(p){pending=p}});await pending;assert.deepEqual(deleted,['nagoya-trip-old']);
 listeners.fetch({request:{url:scope+'?day=12-12&view=map',method:'GET',mode:'navigate'},respondWith(p){pending=p}});let result=await pending;assert.equal(result.cached,scope);
 listeners.fetch({request:{url:scope+'app.js?v=current',method:'GET',mode:'cors'},respondWith(p){pending=p}});result=await pending;assert.equal(result.cached,scope+'app.js');
 let intercepted=false;listeners.fetch({request:{url:'https://tile.openstreetmap.org/1/2/3.png',method:'GET',mode:'cors'},respondWith(){intercepted=true}});assert.equal(intercepted,false);
 console.log('PASS: project-subpath offline navigation and query assets; core-only cache; external tiles excluded; prior project cache removed; unrelated cache preserved.');
})().catch(error=>{console.error(error);process.exitCode=1});
