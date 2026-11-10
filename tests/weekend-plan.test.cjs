const assert = require('node:assert/strict');
const fs = require('node:fs');
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
for(const [plan,count] of [['A',75],['B',81]]){
 const raw=JSON.parse(fs.readFileSync('data/nagoya_'+plan+'_detailed_enriched_2026-12-10_14.json','utf8').replace(/^\uFEFF/,''));
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
for(const [event,place] of Object.entries({'f05':'ramuchi','f21':'mutsumi','f23':'tower','s06':'kannon','d4-return':'jrNagoya','b02':'jrNagoya','b05':'gateTower','b12':'beerGarden','d5-lunch':'flightOfDreams'})){
 assert.equal(evaluate('EVENTS_BY_ID.get('+JSON.stringify(event)+').place.id'),place,event);
}
assert.doesNotMatch(guide,/이누야마|지브리파크|동물원/);
console.log('PASS: A75/B81 source order, IDs, times, details, four shared dates, CLI export and both static guide branches.');
