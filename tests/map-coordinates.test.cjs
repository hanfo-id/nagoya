const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {loadItinerary}=require('../scripts/load-itinerary.cjs');

const context=loadItinerary();
const run=code=>vm.runInContext(code,context);
const snapshot=code=>JSON.parse(run('JSON.stringify('+code+')'));
run("const esc=s=>String(s);");
vm.runInContext(fs.readFileSync('numbered-map.js','utf8'),context);
for(const plan of ['A','B']){
 run('state.plan="'+plan+'"');
 for(let i=0;i<5;i++){
  const pins=snapshot('getMapStops(state,'+i+')');
  pins.forEach((pin,index)=>{
   assert.equal(pin.number,index+1);
   assert.ok(pin.location.lat>34&&pin.location.lat<36,pin.eventId);
   assert.ok(pin.location.lng>136&&pin.location.lng<138,pin.eventId);
   assert.match(pin.location.source,/^https:\/\//);
   assert.ok(pin.address&&pin.jp&&pin.query,pin.eventId);
   if(pin.location.kind==='area-anchor')assert.ok(pin.location.note,pin.id);
  });
 }
}
assert.equal(run('EVENTS_BY_ID.get("d4-return").placeId'),'jrNagoya');
assert.equal(run('EVENTS_BY_ID.get("b07").placeId'),'nagashima');
assert.equal(run('REGION_IDS.city.has("nagashima")'),false);
assert.equal(run('REGION_IDS.city.has("geroStation")'),false);
assert.equal(run('REGION_IDS.gero.has("ogawaya")'),true);
assert.equal(run('REGION_IDS.nabana.has("beerGarden")'),true);
assert.ok(run('MAP_LOCATIONS.geroStation.lat>MAP_LOCATIONS.jrNagoya.lat'));
assert.ok(run('MAP_LOCATIONS.nabana.lng<MAP_LOCATIONS.jrNagoya.lng'));
const same=run('const friday=getMapStops(state,1);popupContent(friday.find(p=>p.eventId==="f17"),friday)');
assert.match(same,/같은 위치의 일정/);
for(const id of ['f16','f17','f18','f19','f20'])assert.ok(same.includes('data-place-detail="'+id+'"'));
assert.ok(run('MAP_LOCATIONS.animateParco.lng>MAP_LOCATIONS.mugiwara.lng'));
assert.ok(run('MAP_LOCATIONS.heroPopup.lat<MAP_LOCATIONS.mugiwara.lat'));
assert.ok(run('MAP_LOCATIONS.flightOfDreams.lat<MAP_LOCATIONS.airport.lat'));
assert.equal(run('MAP_LOCATIONS.bape.source'),'https://jp.bape.com/pages/store-list/nagoya');
assert.equal(run('MAP_LOCATIONS.hoods.source'),'https://www.doubledutch-jp.com/hoods-nagoya');
const map=fs.readFileSync('numbered-map.js','utf8');
assert.doesNotMatch(map,/setLatLng|layerPointToLatLng|polyline/);
console.log('PASS: all A/B event pins, sourced coordinates, region zoom subsets and same-coordinate selection without marker displacement.');
