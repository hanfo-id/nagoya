const assert = require('node:assert/strict');
const fs = require('node:fs');
const {createHash} = require('node:crypto');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const {root,loadItinerary} = require('../scripts/load-itinerary.cjs');

function run(file,...args){return execFileSync(process.execPath,[file,...args],{cwd:root,encoding:'utf8'})}
const assets=['data/itinerary.js','guide.html','index.html'];
const snapshots=assets.map(file=>fs.readFileSync(file,'utf8'));
run('scripts/build-itinerary.cjs');
run('scripts/build-guide.cjs');
run('scripts/stamp-release.cjs');
assets.forEach((file,i)=>assert.equal(fs.readFileSync(file,'utf8'),snapshots[i],file+' needs to be regenerated'));
const guide=snapshots[1];
const context=loadItinerary();
const evaluate=code=>JSON.parse(vm.runInContext('JSON.stringify('+code+')',context));
const escape=s=>s.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const allGuideIds=new Set();
// Thursday is preserved byte-for-byte after JSON parsing.
const thursdayDigest='2174872559b225079870e0ca357421060a49ef7c48d374cea9351c9925dc162b';
const friday='f01 f02 f03 f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 f15 f16 f17 f19 f18 f20 f-chiikawa s20 s18 s22 f21 f22 f23 f24 f25'.split(' ');
const saturday='s01 s02 s03 s04 s05 s06 s07 s-shinsuzume s08 s09 s10 s13 s14 s-coffee-transfer s-coffee-buriko s11 s12 s15 s16 s-osu-walk s-sakae-transfer s-okoge s25'.split(' ');
const raw=JSON.parse(fs.readFileSync('data/nagoya_2026-12-10_14.json','utf8'));
assert.equal(createHash('sha256').update(JSON.stringify(raw.days[0])).digest('hex'),thursdayDigest);
assert.deepEqual(raw.days[1].events.map(e=>e.id),friday);
assert.deepEqual(raw.days[2].events.map(e=>e.id),saturday);
assert.deepEqual(raw.days[3].events.map(e=>e.id),
 'b01 sun-unayasu b02 b04 b05 b05b b06 b07 b08 b09 b10 b11 b12 b13 b14 b15 b16'.split(' '));
const exported=JSON.parse(run('scripts/export-itinerary.cjs'));
assert.deepEqual(exported,evaluate('exportItinerary()'));
assert.equal(exported.plan,undefined);
assert.deepEqual(exported.days.map(d=>d.events.length),[6,29,23,17,8]);
raw.days.forEach((day,i)=>{
 const actual=exported.days[i];
 assert.equal(actual.date,day.date);
 assert.equal(actual.weekday,day.weekday);
 assert.equal(actual.title,day.title);
 assert.equal(actual.summary,day.summary);
 assert.equal(actual.note,day.note);
 assert.equal(actual.events.length,day.events.length);
 day.events.forEach((source,j)=>{
  const e=actual.events[j];
  for(const key of ['id','start','title','category','description','optional','source_url','transport_from_previous']){
   assert.equal(e[key],source[key],source.id+' '+key);
  }
  assert.equal(e.end,source.end??null);
  assert.ok(e.description.trim()&&e.details.length>=2&&e.details.every(line=>line.trim()));
  assert.deepEqual(e.place,source.place,e.id);
  assert.deepEqual(e.details,source.details,e.id);
  assert.deepEqual(e.card_notes,source.card_notes,e.id);
  assert.equal(new URL(e.place.mapUrl).searchParams.get('query'),e.place.japaneseName+' '+e.place.address,e.id);
  const entry=guide.split('data-guide-event="'+e.id+'">')[1]?.split('</article>')[0];
  assert.ok(entry,e.id);
  for(const text of [e.description,e.title,e.place.name,e.place.japaneseName,...e.details])assert.ok(entry.includes(escape(text)),e.id+' '+text);
  allGuideIds.add(e.id);
 });
});
assert.equal(allGuideIds.size,83);
assert.equal([...guide.matchAll(/data-guide-event="/g)].length,83);
assert.doesNotMatch(guide,/id="sunday-a"/);
assert.match(guide,/id="day-4"/);
const guideDay=id=>guide.split('id="'+id+'"')[1].split('</section>')[0];
for(const id of ['s18','s20','s22']){
 assert.ok(guideDay('day-2').includes('data-guide-event="'+id+'"'));
 assert.ok(!guideDay('day-3').includes('data-guide-event="'+id+'"'));
}
for(const [id,slot] of Object.entries({
 f20:['15:25','15:50'],'f-chiikawa':['15:50','16:00'],s20:['16:00','16:15'],f22:['17:20','18:55'],f24:['19:25','20:20'],
 s07:['13:20','13:35'],'s-shinsuzume':['13:35','13:45'],s08:['13:45','14:00'],'s-coffee-buriko':['15:30','16:00'],
 s16:['16:50','17:15'],'s-osu-walk':['17:15','18:00'],'s-sakae-transfer':['18:00','19:30'],'s-okoge':['19:30','20:45'],s25:['20:45','21:30'],
 'sun-unayasu':['11:00','11:45'],b02:['11:45','12:15'],b07:['15:01','15:18'],b12:['18:40','19:30'],b14:['20:10','20:35'],
 'd5-keshiki':['09:25','10:05']
})){
 assert.deepEqual(evaluate('(()=>{const e=EVENTS_BY_ID.get('+JSON.stringify(id)+');return [e.time,e.end]})()'),slot,id);
}
for(const id of ['s17','s19','s21','s23','s24','b03','d4-bath','d4-return'])assert.equal(evaluate('EVENTS_BY_ID.has("'+id+'")'),false);
for(const id of ['f-chiikawa','s-shinsuzume','sun-unayasu'])assert.equal(evaluate('EVENTS_BY_ID.get("'+id+'").optional'),true);
for(const [event,place] of Object.entries({'f05':'ramuchi','f21':'mutsumi','f23':'tower','s06':'kannon','s-okoge':'monja','b02':'jrNagoya','b05':'gateTower','b12':'beerGarden','d5-lunch':'flightOfDreams'})){
 assert.equal(evaluate('EVENTS_BY_ID.get('+JSON.stringify(event)+').place.id'),place,event);
}
assert.doesNotMatch(guide,/이누야마|지브리파크|동물원|게로 온천|이부시긴|마루야/);
console.log('PASS: 83 events, Fri29/Sat23, protected Thursday, event order, exact raw-to-app content, CLI export and guide.');
