const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const c=vm.createContext({Intl,Date,URL,URLSearchParams,localStorage:{getItem:()=>null,setItem(){}},location:{href:'https://hanfo-id.github.io/nagoya/'}});
for(const file of ['trip-details.js','trip-data.js','map-locations.js','trip-state.js','ux.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
const run=s=>vm.runInContext(s,c),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
assert.equal(run('CITY_DAY'),2);assert.equal(run('EXCURSION_DAY'),3);
for(const [id,index] of [['sun-gero-private-bath',3],['d3-monja',3],['d4-sushi',2],['d4-zoo-visit',2]])assert.equal(run(`eventDayIndex('${id}')`),index);
assert.equal(run("eventDayIndex('d3-warehouse')"),-1);
assert.ok(!json('RESERVATIONS').some(r=>r.id==='ghibli-ticket'));
for(const [id,date] of [['monja','2026-12-13'],['sushi','2026-12-12']])assert.equal(run(`isoDay(RESERVATIONS.find(r=>r.id==='${id}').day)`),date);
for(const zoo of [false,true]){
 run(`state=freshState();state.options.zoo=${zoo}`);
 const ids=json('getMapStops(state,EXCURSION_DAY).map(p=>p.id)');
 for(const id of ['jrNagoya','geroStation','geroTown','geroLunch','ogawaya','geroRiver','hotel','monja'])assert.ok(ids.includes(id));
 for(const id of ['warehouse','cafe','valley','mononoke','forest','hill','parkstation','zoo'])assert.ok(!ids.includes(id));
}
run("state=normalizeState({...freshState(),selectedEvent:'d3-warehouse',events:{'d3-warehouse':{status:'done'},'d4-sushi':{status:'progress'}},reservations:{'ghibli-ticket':{status:'confirmed',date:'2026-12-12',time:'11:00',note:'previous'},monja:{status:'confirmed',date:'2026-12-13',time:'19:15',note:'keep'}}})");
const backup=json('validateBackup(JSON.stringify(backupEnvelope()))');
assert.equal(backup.reservations['ghibli-ticket'].note,'previous');assert.equal(backup.events['d3-warehouse'].status,'done');
assert.equal(backup.reservations.monja.time,'19:15');assert.equal(backup.selectedEvent,'');
assert.equal(run("eventStatus(baseEvents(EXCURSION_DAY).find(e=>e.id==='sun-gero-private-bath'))"),'planned');
run("let active=0;function openScreen(){};function showMapSelection(){};function openPlace(){};focusEvent('sun-gero-private-bath')");assert.equal(run('active'),3);
run("focusEvent('d4-sushi')");assert.equal(run('active'),2);
assert.deepEqual(json("baseEvents(EXCURSION_DAY).map(e=>e.time)"),['07:00','07:45','10:14','11:30','12:30','13:15','15:05','17:30','19:15']);
for(const [event,time] of [['sun-gero-outbound','08:43'],['sun-gero-private-bath','12:30'],['sun-gero-return','15:32']]){
 const def=json(`reservationFor(baseEvents(EXCURSION_DAY).find(e=>e.id==='${event}'))`);
 assert.equal(def.day,3);assert.equal(def.plan,time);assert.ok(def.url.startsWith('https://'));
}
assert.equal(run("baseEvents(CITY_DAY).find(e=>e.id==='d4-old-town').placeId"),'hotel');
console.log('PASS Gero itinerary, Hida and bath reservation targets, Saturday hotel rest, and legacy backups.');
