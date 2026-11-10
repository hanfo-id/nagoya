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
// Fingerprints of the complete protected day objects at bd39b9db0443.
const protectedDays={
 0:'2174872559b225079870e0ca357421060a49ef7c48d374cea9351c9925dc162b',
 4:'04ea05192419c75aba233fe2a3f6a0ff13253becf0d072b229278af5bede016e'
};
const protectedSunday={
 A:'147e774fc8db9a62d74af8948180307eeab7ec9add5a1f7ec9b473a633e0b14b',
 B:'1897c38d34e2fe0c4ebafe5f65d34a805c0723c42b86e257e6c11d390393ac40'
};
const friday='f01 f02 f03 f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 f15 f16 f17 f19 f18 f20 s20 s18 s22 f21 f22 f23 f24 f25'.split(' ');
const saturday='s01 s02 s03 s04 s05 s06 s07 s08 s09 s10 s13 s14 s-coffee-transfer s-coffee-buriko s11 s12 s15 s16 s-osu-walk s23 s24 s25'.split(' ');
for(const [plan,count] of [['A',75],['B',81]]){
 const raw=JSON.parse(fs.readFileSync('data/nagoya_'+plan+'_detailed_enriched_2026-12-10_14.json','utf8').replace(/^\uFEFF/,''));
 for(const i of [0,3,4]){
  const digest=createHash('sha256').update(JSON.stringify(raw.days[i])).digest('hex');
  assert.equal(digest,i===3?protectedSunday[plan]:protectedDays[i],plan+' protected day '+i);
 }
 assert.deepEqual(raw.days[1].events.map(e=>e.id),friday);
 assert.deepEqual(raw.days[2].events.map(e=>e.id),saturday);
 const exported=JSON.parse(run('scripts/export-itinerary.cjs','--plan='+plan));
 assert.deepEqual(exported,evaluate('exportItinerary("'+plan+'")'));
 assert.equal(exported.plan,plan);
 assert.equal(exported.days.flatMap(d=>d.events).length,count);
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
    assert.equal(e[key],source[key],plan+' '+source.id+' '+key);
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
}
assert.equal(allGuideIds.size,92);
assert.equal([...guide.matchAll(/data-guide-event="/g)].length,92);
assert.match(guide,/id="sunday-a"/);
assert.match(guide,/id="sunday-b"/);
const guideDay=id=>guide.split('id="'+id+'"')[1].split('</section>')[0];
for(const id of ['s18','s20','s22']){
 assert.ok(guideDay('day-2').includes('data-guide-event="'+id+'"'));
 assert.ok(!guideDay('day-3').includes('data-guide-event="'+id+'"'));
}
for(const [id,start] of Object.entries({f22:'17:20',f24:'19:25','s-coffee-buriko':'15:30',s24:'18:40'})){
 assert.equal(evaluate('EVENTS_BY_ID.get('+JSON.stringify(id)+').time'),start);
}
for(const id of ['s17','s19','s21'])assert.equal(evaluate('EVENTS_BY_ID.has("'+id+'")'),false);
for(const [event,place] of Object.entries({'f05':'ramuchi','f21':'mutsumi','f23':'tower','s06':'kannon','d4-return':'jrNagoya','b02':'jrNagoya','b05':'gateTower','b12':'beerGarden','d5-lunch':'flightOfDreams'})){
 assert.equal(evaluate('EVENTS_BY_ID.get('+JSON.stringify(event)+').place.id'),place,event);
}
assert.doesNotMatch(guide,/이누야마|지브리파크|동물원/);
console.log('PASS: A75/B81, Fri28/Sat22, protected dates, event order, exact raw-to-app content, CLI export and guide.');
