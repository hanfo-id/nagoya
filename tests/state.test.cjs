const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
function context(store={},blocked=false){const c=vm.createContext({URL,URLSearchParams,Intl,Date,Set,Map,location:{href:'https://hanfo-id.github.io/nagoya/'},localStorage:{getItem(k){if(blocked)throw Error('blocked');return store[k]??null},setItem(k,v){if(blocked)throw Error('blocked');store[k]=v}}});for(const name of ['trip-details.js','trip-data.js','map-locations.js','trip-state.js','ux.js'])vm.runInContext(fs.readFileSync(name,'utf8'),c);return c}
const c=context(),run=s=>vm.runInContext(s,c),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
const original=vm.createContext({});vm.runInContext(fs.readFileSync('trip-details.js','utf8'),original);vm.runInContext(fs.readFileSync('trip-data.js','utf8'),original);
const facts=JSON.parse(vm.runInContext('JSON.stringify({days,restaurants,zooEvents})',original));for(const d of facts.days)for(const e of d.events){delete e.id;delete e.placeId}
assert.equal(json('days.flatMap(d=>d.events)').length,40);assert.equal(run('EVENT_IDS.size'),52);
assert.equal(new Set(json('days.flatMap(d=>d.events.map(e=>e.id))')).size,40);
// Date boundaries use Tokyo, independent of host timezone. Explicit URLs win over saved or automatic choices.
assert.deepEqual(json("japanClock(new Date('2026-12-09T15:01:00Z'))"),{date:'2026-12-10',time:'00:01'});
assert.equal(run("travelPhase(japanClock(new Date('2026-12-09T14:59:00Z')))"),'before');
assert.equal(run("travelPhase(japanClock(new Date('2026-12-14T15:00:00Z')))"),'after');
assert.equal(run("readRoute(freshState(),'https://x/nagoya/',{date:'2026-12-12',time:'08:00'}).active"),2);
assert.equal(run("readRoute({...freshState(),selectedDay:1,selectionMode:'manual'},'https://x/nagoya/',{date:'2026-12-12',time:'08:00'}).active"),1);
assert.equal(run("readRoute(freshState(),'https://x/nagoya/?day=12-14&view=map',{date:'2026-12-12',time:'08:00'}).active"),4);
assert.equal(run("readRoute({...freshState(),selectedDay:1},'https://x/nagoya/?day=bad',{date:'2026-12-15',time:'08:00'}).active"),1);
// The shared filter produces only mapped stops belonging to visible events, including zoo and optional choices.
for(let day=0;day<5;day++)for(const foodOnly of [false,true])for(const optional of [false,true])for(const zoo of [false,true]){
 run(`state=freshState();state.selectedDay=${day};state.filters.foodOnly=${foodOnly};state.filters.optional=${optional};state.options.zoo=${zoo}`);
 const events=json('getVisibleEvents()'),stops=json('getMapStops()');
 for(const stop of stops){assert.ok(stop.eventIds.every(id=>events.some(e=>e.id===id)));assert.ok(stop.location,stop.id)}
 if(foodOnly)assert.ok(events.every(e=>e.kind==='식사'));if(!optional)assert.ok(events.every(e=>!e.optional));
}
run("state=freshState();state.options.zoo=true");assert.ok(json('baseEvents(CITY_DAY)').some(e=>e.id==='d4-zoo-visit'));assert.equal(run("baseEvents(CITY_DAY).find(e=>e.id==='d4-old-town').time"),'16:45');
run("state=freshState();state.overrides.ramenMonday=true");assert.ok(json('baseEvents(4)').some(e=>e.id==='d5-ramen-alternative'));assert.ok(!json('baseEvents(4)').some(e=>e.id==='d5-shopping'));assert.equal(run("days[4].events[2].id"),'d5-shopping');
run('state=freshState();state.selectedDay=EXCURSION_DAY');
assert.equal(run("nextEvent(state,EXCURSION_DAY,{date:'2026-12-13',time:'08:30'}).event.id"),'sun-gero-outbound');
assert.deepEqual(json('state.events'),{}); // Passing time never writes completion.
run("state.events['sun-gero-outbound']={status:'done'}");assert.notEqual(run("nextEvent(state,EXCURSION_DAY,{date:'2026-12-13',time:'08:30'}).event.id"),'sun-gero-outbound');
run("state.events['sun-gero-town-am']={status:'progress'}");assert.equal(run("nextEvent(state,EXCURSION_DAY,{date:'2026-12-13',time:'08:30'}).event.id"),'sun-gero-town-am');
const migrated=json("migrateLegacy({memo:'여행 메모',zoo:true,day:3,c0:true,c1:true,c6:true,c7:true})");assert.equal(migrated.reservations['ghibli-ticket'].status,'confirmed');assert.equal(migrated.reservations.mutsumi.time,'');assert.equal(migrated.memo,'여행 메모');assert.equal(migrated.checks.flight,true);
run('state=freshState()');assert.deepEqual(json('validateBackup(JSON.stringify(backupEnvelope()))'),json('state'));
assert.throws(()=>run("validateBackup('{bad')"));assert.throws(()=>run("validateBackup(JSON.stringify({app:'nagoya-trip',state:{version:99}}))"));assert.throws(()=>run("validateBackup(JSON.stringify({app:'nagoya-trip',state:{version:2}}))"));
assert.equal(run("normalizeState({...freshState(),selectedDay:99,events:{'d1-arrival':{status:'invented'}}}).selectedDay"),0);
assert.deepEqual(json("normalizeState({...freshState(),events:{'__proto__':{status:'done'},'unknown':{status:'done'}}}).events"),{});
const brokenStore={'nagoya26-v2':'{bad'},broken=context(brokenStore);assert.equal(vm.runInContext('state.version',broken),2);assert.equal(brokenStore['nagoya26-v2-unreadable'],'{bad');
const blocked=context({},true);assert.equal(vm.runInContext('persist()',blocked),false);assert.equal(vm.runInContext('baseEvents(0).length',blocked),7);
// All travel facts survive state mutations. Only stable IDs / place IDs are added to the original events.
const unchanged=json('({days,restaurants,zooEvents})');for(const d of unchanged.days)for(const e of d.events){delete e.id;delete e.placeId}for(const e of unchanged.zooEvents){delete e.id;delete e.placeId}assert.deepEqual(unchanged,facts);
const url=run("routeBetween(PLACE.hotel,PLACE.mutsumi,'transit')"),params=new URL(url).searchParams;assert.equal(params.get('origin'),run('PLACE.hotel.query'));assert.equal(params.get('destination'),run('PLACE.mutsumi.query'));assert.equal(params.get('travelmode'),'transit');
console.log('PASS: Tokyo boundaries; URL/manual/auto precedence; 80 shared-filter combinations; stable IDs; unchanged travel facts; alternatives; explicit progress; legacy migration; backup validation; corrupted/blocked storage; origin/destination links.');

// Route revision retains IDs and fixed meal bookings while grouping city visits.
run('state=freshState()');
assert.deepEqual(json('baseEvents(CITY_DAY).map(e=>e.id)'),['d4-morning','d4-osu-transfer','d4-osu','d4-osu-lunch','d4-market-transfer','d4-old-town','d4-sushi','d4-return']);
for(let i=0;i<5;i++)assert.ok(json(`baseEvents(${i}).map(e=>e.time)`).every((t,j,a)=>j===0||a[j-1]<=t),'chronological day '+i);
assert.equal(run("baseEvents(CITY_DAY).find(e=>e.id==='d4-sushi').time"),'17:30');
assert.equal(run("baseEvents(1).find(e=>e.id==='d2-rest').placeId"),'lachic');
assert.equal(run("reservationFor(baseEvents(0).find(e=>e.id==='d1-checkin'))"),undefined);
console.log('PASS revised city route order, chronological times, unchanged sushi time and hotel without reservation target.');
