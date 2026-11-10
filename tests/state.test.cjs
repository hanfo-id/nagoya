const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {loadItinerary}=require('../scripts/load-itinerary.cjs');

const previous={
 version:2,selectedDay:3,selectedView:'map',selectionMode:'manual',selectedEvent:'sun-gero-outbound',
 events:{'d4-return':{status:'done'},'sun-gero-outbound':{status:'done'},'d2-wings':{status:'skipped'},'d5-keshiki':{status:'progress'}},
 reservations:{sushi:{status:'confirmed',date:'2026-12-12',time:'18:00',note:'old dinner'},
  'ogawaya-bath':{status:'confirmed',note:'old bath'},'ghibli-ticket':{status:'confirmed',note:'old ticket'},
  'hida-outbound':{status:'confirmed',date:'2026-12-13',time:'08:43',note:'JR QR'},
  mutsumi:{status:'confirmed',date:'2026-12-11',time:'17:30',note:'wing memo'}},
 expanded:{'sun-gero-outbound':true},memo:'개인 메모',checks:{flight:true},filters:{optional:true},options:{fieldMode:true,zoo:true}
};
const storage=new Map([['nagoya26-v2',JSON.stringify(previous)]]);
const localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
const context=loadItinerary({localStorage});
const run=code=>vm.runInContext(code,context);
const snapshot=code=>JSON.parse(run('JSON.stringify('+code+')'));
vm.runInContext(fs.readFileSync('ux.js','utf8'),context);
assert.equal(run('STORAGE_KEY'),'nagoya26-v3');
assert.equal(run('state.plan'),undefined);
assert.equal(run('state.selectedEvent'),'');
assert.equal(run('state.memo'),'개인 메모');
assert.equal(run('state.checks.flight'),true);
assert.equal(run('state.options.fieldMode'),true);
assert.equal(run('state.events["d4-train"].status'),'done');
assert.equal(run('state.events["f22"].status'),'skipped');
assert.equal(run('state.expanded["d4-train"]'),true);
assert.equal(run('state.events["d4-return"]'),undefined);
assert.equal(run('state.reservations["sushi-lunch"]'),undefined);
assert.equal(run('state.reservations["ogawaya-ruri"]'),undefined);
assert.deepEqual(snapshot('state.legacy'),previous);
assert.equal(run('state.reservations["hida-outbound"].note'),'JR QR');
assert.equal(run('persist()'),true);
assert.equal(storage.get('nagoya26-v2'),JSON.stringify(previous));

assert.equal(snapshot('baseEvents(SUNDAY).map(e=>e.id)').length,17);
assert.equal(run('eventDayIndex("d4-train")'),-1);
assert.equal(run('eventDayIndex("b07")'),3);
const bookings=snapshot('activeReservations().map(r=>r.id)');
assert.deepEqual(bookings,['ramuchi','mutsumi','sushi-lunch','monja-saturday','unayasu-lunch','nabana-ticket','keshiki']);
for(let day=0;day<5;day++){
 for(const food of [true,false])for(const optional of [true,false]){
  run('state.filters.foodOnly='+food+';state.filters.optional='+optional);
  const visible=snapshot('getVisibleEvents(state,'+day+').map(e=>e.id)');
  const pins=snapshot('getMapStops(state,'+day+').map(p=>p.eventId)');
  assert.deepEqual(pins,visible);
 }
}
run('state.events.b07={status:"progress"};state.reservations["nabana-ticket"]={status:"requested",note:"B"};persist()');
assert.equal(run('nextEvent(state,3,{date:"2026-12-13",time:"15:00"}).event.id'),'b07');
const backup=snapshot('backupEnvelope()');
const imported=snapshot('validateBackup('+JSON.stringify(JSON.stringify(backup))+')');
assert.equal(imported.plan,undefined);
assert.equal(imported.events['d4-train'].status,'done');
assert.equal(imported.events.b07.status,'progress');
assert.equal(imported.reservations['nabana-ticket'].note,'B');
assert.equal(imported.reservations['hida-outbound'].note,'JR QR');
assert.equal(imported.legacy.reservations.sushi.note,'old dinner');
const reloaded=loadItinerary({localStorage});
assert.equal(vm.runInContext('state.plan',reloaded),undefined);
assert.equal(vm.runInContext('state.events["d4-train"].status',reloaded),'done');
const oldImport=snapshot('validateBackup('+JSON.stringify(JSON.stringify({app:'nagoya-trip',state:previous}))+')');
assert.equal(oldImport.plan,undefined);
assert.equal(oldImport.legacy.reservations['ghibli-ticket'].note,'old ticket');
for(const bad of ['null','{}','invalid','{"app":"nagoya-trip","state":{"version":99}}'])assert.throws(()=>run('validateBackup('+JSON.stringify(bad)+')'));
assert.equal(run('japanClock(new Date("2026-12-12T15:00:00Z")).date'),'2026-12-13');
assert.equal(run('japanClock(new Date("2026-12-12T15:00:00Z")).time'),'00:00');
assert.equal(run('travelPhase({date:"2026-12-13"})'),'during');
const route=snapshot('readRoute(state,"https://example.com/nagoya/?page=plan&day=12-13&view=map&plan=A",{date:"2026-12-10"})');
assert.deepEqual(route,{active:3,view:'map',explicit:true});
const oldV3=snapshot('freshState()');
Object.assign(oldV3,{plan:'B',selectedDay:2,selectedEvent:'s18',selectionMode:'manual',memo:'v3 travel notes',
 events:{s18:{status:'done'},s17:{status:'done'},s19:{status:'skipped'},s21:{status:'progress'},s24:{status:'done'},'d4-bath':{status:'done'},b03:{status:'done'}},
 expanded:{s18:true,s17:true},reservations:{mutsumi:{status:'confirmed',date:'2026-12-11',time:'17:30',note:'Friday booking'},monja:{status:'confirmed',date:'2026-12-13',time:'19:15'},ibushigin:{status:'confirmed',note:'Old Saturday dinner'}}});
const routeStorage=new Map([['nagoya26-v3',JSON.stringify(oldV3)]]);
const routeContext=loadItinerary({localStorage:{getItem:key=>routeStorage.get(key)??null,setItem:(key,value)=>routeStorage.set(key,value)}});
const routeRun=code=>vm.runInContext(code,routeContext);
assert.equal(routeRun('state.selectedDay'),1);
assert.equal(routeRun('state.selectedEvent'),'s18');
assert.equal(routeRun('state.expanded.s18'),true);
assert.equal(routeRun('state.memo'),'v3 travel notes');
assert.equal(routeRun('state.reservations.mutsumi.note'),'Friday booking');
assert.equal(routeRun('state.plan'),undefined);
assert.equal(routeRun('persist()'),true);
assert.equal(JSON.parse(routeStorage.get('nagoya26-v3')).events.s17.status,'done');
const preserved=JSON.parse(routeRun('JSON.stringify(validateBackup(JSON.stringify(backupEnvelope())))'));
assert.equal(preserved.events.s18.status,'done');
assert.equal(preserved.events.s19.status,'skipped');
assert.equal(preserved.events.s21.status,'progress');
assert.equal(preserved.expanded.s17,true);
assert.equal(preserved.events.s24.status,'done');
assert.equal(preserved.events['d4-bath'].status,'done');
assert.equal(preserved.events.b03.status,'done');
assert.equal(preserved.events['sun-unayasu'],undefined);
assert.equal(preserved.reservations.monja.status,'confirmed');
assert.equal(preserved.reservations.ibushigin.note,'Old Saturday dinner');
assert.equal(routeRun('reservationValue(RESERVATIONS.find(r=>r.id==="monja-saturday")).status'),'unconfirmed');
for(const plan of ['A','B']){
 for(const id of ['s18','s20','s22'])assert.equal(run('eventDayIndex("'+id+'")'),1);
 const oldUrl='https://example.com/nagoya/?page=plan&day=12-12&view=map&plan='+plan+'&event=s22';
 assert.equal(run('readRoute(state,"'+oldUrl+'").active'),1);
}
assert.equal(run('eventDayIndex("s17")'),-1);
assert.equal(run('state.filters.foodOnly=false;state.filters.optional=false;getVisibleEvents(state,2).some(e=>e.id==="s-osu-walk")'),false);
assert.equal(run('state.filters.foodOnly=true;getVisibleEvents(state,2).some(e=>e.id==="s-coffee-buriko")'),true);
const corrupt=new Map([['nagoya26-v3','{broken'],['nagoya26-v2',JSON.stringify(previous)]]);
const recovered=loadItinerary({localStorage:{getItem:key=>corrupt.get(key)??null,setItem:(key,value)=>corrupt.set(key,value)}});
assert.equal(vm.runInContext('state.memo',recovered),'개인 메모');
assert.equal(corrupt.get('nagoya26-v3-unreadable'),'{broken');
const blocked=loadItinerary({localStorage:{getItem(){throw Error()},setItem(){throw Error()}}});
assert.equal(vm.runInContext('persist()',blocked),false);
console.log('PASS: v2 non-destructive migration, ID collisions, single Sunday and legacy URLs, filtered map IDs, backups, damaged/blocked storage, moved-event links and archived v3 transfers.');
