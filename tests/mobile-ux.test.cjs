const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {loadItinerary}=require('../scripts/load-itinerary.cjs');

const context=loadItinerary();
const run=code=>vm.runInContext(code,context);
const files=['numbered-map.js','screen.js','app.js'];
for(const file of files){
 const js=fs.readFileSync(file,'utf8');
 run(file==='app.js'?js.slice(0,js.lastIndexOf('\napplyRoute();')):js);
}
assert.equal(run('nearestSheetLevel(600,65)'),'expanded');
assert.equal(run('nearestSheetLevel(600,195)'),'balanced');
assert.equal(run('nearestSheetLevel(600,295)'),'map');
for(const plan of ['A','B']){
 run('state.plan="'+plan+'"');
 for(let i=0;i<5;i++){
  run('active='+i);
  const events=JSON.parse(run('JSON.stringify(baseEvents(active))')),collapsed=run('routeDayHTML(active)');
  assert.equal([...collapsed.matchAll(/data-event-id="/g)].length,events.length);
  assert.match(collapsed,/aria-label="12월 13일 일정 선택"/);
  for(const e of events){
   assert.ok(collapsed.includes(run('esc(EVENTS_BY_ID.get("'+e.id+'").desc)')),e.id);
   run('state.selectedEvent="'+e.id+'";state.expanded[state.selectedEvent]=true');
   const detail=run('routeDayHTML(active).split("inline-stop-detail")[1]?.split("</li></ol>")[0]');
   assert.ok(detail,e.id);
   assert.ok(detail.includes('data-event-status="'+e.id+'"'),e.id);
   assert.ok(detail.includes('lang="ja"'),e.id);
   assert.ok(detail.includes('교통·방문 메모'),e.id);
   assert.ok(detail.includes('이전·다음 장소로 이동'),e.id);
   for(const step of e.steps)assert.ok(detail.includes(run('esc('+JSON.stringify(step)+')')),e.id+' '+step);
   const printed=run('printedEvent(EVENTS_BY_ID.get("'+e.id+'"))');
   assert.ok(printed.includes('data-printed-event="'+e.id+'"'));
   assert.ok(printed.includes(run('esc(EVENTS_BY_ID.get("'+e.id+'").desc)')),e.id);
   assert.ok(!detail.includes('undefined')&&!printed.includes('undefined'),e.id);
  }
 }
}
assert.match(run('restaurantCard(EVENTS_BY_ID.get("s05"))'),/data-res-jump="sushi-lunch"/);
assert.doesNotMatch(run('restaurantCard(EVENTS_BY_ID.get("s01"))'),/data-res-jump/);
assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/id="zoo"|place-experiences\.js/);
console.log('PASS: every collapsed/expanded/printed event, all detail text, inline progress and routes, hotel without booking and mobile sheet snaps.');
