const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
(async()=>{
 const listeners={},entries=new Map(),deleted=[],requests=[];
 const scope='https://example.com/nagoya/';
 const cache={
  addAll:async assets=>{for(const request of assets){assert.equal(request.cache,'reload');entries.set(request.url,{cached:request.url})}},
  match:async key=>entries.get(String(key))
 };
 const c=vm.createContext({URL,Request,Response,self:{registration:{scope},addEventListener:(k,fn)=>listeners[k]=fn,clients:{claim:async()=>{}},skipWaiting:()=>{}},
  caches:{open:async()=>cache,keys:async()=>['nagoya-trip-old','other-app'],delete:async k=>deleted.push(k)},
  fetch:async request=>{requests.push(request.url);throw Error('offline')}});
 vm.runInContext(fs.readFileSync('sw.js','utf8'),c);
 const release=vm.runInContext('RELEASE',c);
 let pending;listeners.install({waitUntil(p){pending=p}});await pending;
 for(const file of ['index.html','guide.html','trip-data.js?v='+release,'data/itinerary.js?v='+release])assert.ok(entries.has(scope+file),file);
 assert.ok(![...entries.keys()].some(u=>u.includes('openstreetmap')));
 listeners.activate({waitUntil(p){pending=p}});await pending;assert.deepEqual(deleted,['nagoya-trip-old']);
 const fetchEvent=(url,mode='cors')=>{
  let intercepted;
  listeners.fetch({request:{url,method:'GET',mode},respondWith(result){intercepted=result}});
  return intercepted;
 };
 assert.equal((await fetchEvent(scope+'?day=12-13&plan=B','navigate')).cached,scope+'index.html');
 assert.equal((await fetchEvent(scope+'guide.html','navigate')).cached,scope+'guide.html');
 assert.equal((await fetchEvent(scope+'app.js?v='+release)).cached,scope+'app.js?v='+release);
 assert.equal((await fetchEvent(scope+'app.js?v=old')).status,409);
 assert.equal(fetchEvent('https://tile.openstreetmap.org/1/2/3.png'),undefined);
 assert.deepEqual(requests,[]);
 const html=fs.readFileSync('index.html','utf8');
 const scripts=[...html.matchAll(/<script src="([^"?]+)\?v=([^"]+)" integrity="sha256-([^"]+)"/g)];
 assert.equal(scripts.length,9);
 for(const [,name,version,hash] of scripts){
  assert.equal(version,release);
  assert.equal(createHash('sha256').update(fs.readFileSync(name)).digest('base64'),hash,name);
  assert.ok(entries.has(scope+name+'?v='+version),name);
 }
 console.log('PASS: release-specific app shell, offline query navigation, old-version isolation, script integrity and external-tile exclusion.');
})().catch(error=>{console.error(error);process.exitCode=1});
