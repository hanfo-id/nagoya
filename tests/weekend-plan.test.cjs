const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const store={},c=vm.createContext({Intl,Date,URL,URLSearchParams,localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v},location:{href:'https://hanfo-id.github.io/nagoya/'}});
for(const file of ['trip-details.js','trip-data.js','map-locations.js','trip-state.js','ux.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
const run=s=>vm.runInContext(s,c),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
assert.equal(run('CITY_DAY'),2);assert.equal(run('PARK_DAY'),3);
assert.equal(run('isoDay(PARK_DAY)'),'2026-12-13');assert.equal(run('isoDay(CITY_DAY)'),'2026-12-12');
for(const [id,index] of [['d3-warehouse',3],['d3-extra',3],['d4-sushi',2],['d4-zoo-visit',2],['d5-ramen-alternative',4]])assert.equal(run(`eventDayIndex('${id}')`),index);
for(const [id,date] of [['ghibli-ticket','2026-12-13'],['monja','2026-12-13'],['sushi','2026-12-12']])assert.equal(run(`isoDay(RESERVATIONS.find(r=>r.id==='${id}').day)`),date);
run("state=freshState();state.options.zoo=true;state.filters.optional=false");
const park=json('getMapStops(state,PARK_DAY)'),parkIds=park.map(p=>p.id);
for(const id of ['warehouse','cafe','valley','mononoke'])assert.ok(parkIds.includes(id));
for(const id of ['forest','hill','zoo','osu','sushi'])assert.ok(!parkIds.includes(id));
assert.ok(json('baseEvents(CITY_DAY)').some(e=>e.id==='d4-zoo-visit'));
// Prior versions store these stable IDs and real booking dates. Neither is rewritten by moving a plan.
run("state=normalizeState({...freshState(),events:{'d3-warehouse':{status:'done'},'d4-sushi':{status:'progress'}},reservations:{'ghibli-ticket':{status:'confirmed',date:'2026-12-12',time:'11:00',note:'원래 기록'},sushi:{status:'requested',date:'2026-12-13',time:'17:30',note:'변경 문의 필요'}}});persist()");
const backup=json('validateBackup(JSON.stringify(backupEnvelope()))');
assert.equal(backup.reservations['ghibli-ticket'].date,'2026-12-12');assert.equal(backup.reservations.sushi.date,'2026-12-13');assert.equal(backup.reservations['ghibli-ticket'].note,'원래 기록');assert.equal(backup.events['d3-warehouse'].status,'done');
assert.equal(run("eventStatus(baseEvents(PARK_DAY).find(e=>e.id==='d3-warehouse'))"),'done');
assert.equal(run("eventStatus(baseEvents(CITY_DAY).find(e=>e.id==='d4-sushi'))"),'progress');
// Reservation -> itinerary uses the activity lookup, never the old d3/d4 calendar prefix.
run("let active=0;function openScreen(){};function showMapSelection(){};function openPlace(){};focusEvent('d3-warehouse')");assert.equal(run('active'),3);
run("focusEvent('d4-sushi')");assert.equal(run('active'),2);
run("focusEvent('d4-zoo-visit')");assert.equal(run('active'),2);assert.equal(run('state.options.zoo'),true);
console.log('PASS Sunday Standard areas; Saturday city/zoo; dinner and ticket dates; legacy progress/bookings/backups preserved; reservation deep links follow moved activities.');
