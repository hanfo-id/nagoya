const assert=require('node:assert/strict');
const vm=require('node:vm');
const {loadItinerary}=require('../scripts/load-itinerary.cjs');
const context=loadItinerary();
const read=code=>JSON.parse(vm.runInContext('JSON.stringify('+code+')',context));
const rules=read('BOOKING_RULES');
const audit=read('RESERVATION_AUDIT');
const events=read('ALL_EVENTS.map(e=>({id:e.id,kind:e.kind,placeId:e.placeId,classification:e.bookingClass}))');
assert.equal(events.length,85);
assert.equal(new Set(events.map(e=>e.placeId)).size,45);
assert.equal(Object.keys(rules).length+Object.keys(audit).length,events.length);
for(const event of events){
 assert.notEqual(Boolean(rules[event.id]),Boolean(audit[event.id]),event.id);
 assert.ok(Object.hasOwn(read('RESERVATION_CLASSES'),event.classification),event.id);
}
const ranks={google:1,tabelog:2,phone:3,'free-web':4,'paid-web':5};
const ids=new Set();
for(const [event,def] of Object.entries(rules)){
 assert.ok(!ids.has(def.id),def.id);
 ids.add(def.id);
 assert.ok(events.some(e=>e.id===event&&e.kind!=='이동'),event);
 assert.ok(def.methods.length,event);
 let rank=0;
 for(const method of def.methods){
  assert.ok(method.fee&&method.verification&&method.selection&&method.verifiedAt,event);
  assert.match(method.source,/^https:\/\//,event);
  assert.match(method.url,/^(https:\/\/|tel:\+81)/,event);
  assert.doesNotMatch(method.url,/google\.com\/maps\/(search|place)/,event);
  if(ranks[method.type]){
   assert.ok(ranks[method.type]>=rank,event);
   rank=ranks[method.type];
  }
 }
}
assert.equal(rules.f22.methods[0].type,'tabelog');
assert.equal(rules['s-okoge'].methods[0].url,'tel:+81522286998');
assert.equal(rules['d5-keshiki'].methods[0].type,'google');
assert.equal(rules['sun-unayasu'].methods[0].type,'tabelog');
assert.match(rules['d5-keshiki'].methods[1].fee,/¥500/);
assert.match(rules.b09.methods[1].note,/0268315/);
assert.match(rules.b09.methods[2].note,/117-561/);
assert.match(rules.f24.methods[0].url,/star-illumination-2026/);
assert.equal(rules['d5-kato'].record,false);
assert.ok(rules['d5-kato'].methods.every(method=>!method.url.includes('airrsv')));
assert.equal(read('RESERVATIONS.filter(d=>d.group==="advance").length'),4);
assert.equal(read('RESERVATIONS.filter(d=>d.required).length'),2);
console.log('PASS: all 85 audit classifications, verified route order, distinct booking IDs, exact ticket codes, and safe cafe fallback.');
