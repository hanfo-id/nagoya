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
const renderedCategories=new Set();
for(let i=0;i<5;i++){
 run('active='+i);
 const events=JSON.parse(run('JSON.stringify(baseEvents(active))')),collapsed=run('routeDayHTML(active)');
 assert.equal([...collapsed.matchAll(/data-event-id="/g)].length,events.length);
 assert.equal(collapsed.includes('aria-label="12월 13일 일정 선택"'),false);
 assert.equal(collapsed.includes('data-plan='),false);
 for(const e of events){
  assert.ok(collapsed.includes(run('esc(EVENTS_BY_ID.get("'+e.id+'").desc)')),e.id);
  const category=run('eventCategory(EVENTS_BY_ID.get("'+e.id+'"))');
  const row=collapsed.split('data-event-id="'+e.id+'"')[1].split('</li>')[0];
  assert.ok(row.includes('data-category="'+category+'"'),e.id);
  assert.ok(row.includes(run('categoryBadge("'+category+'")')),e.id);
  assert.equal(row.includes('class="optional-label"'),e.optional,e.id);
  renderedCategories.add(category);
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
  assert.ok(printed.includes(run('categoryBadge("'+category+'")')),e.id);
  assert.ok(printed.includes(run('esc(EVENTS_BY_ID.get("'+e.id+'").desc)')),e.id);
  assert.ok(!detail.includes('undefined')&&!printed.includes('undefined'),e.id);
 }
}
assert.deepEqual([...renderedCategories].sort(),['lodging','meal','rest','shopping','sight','transit']);
for(const [id,category] of Object.entries({
 'd1-checkin':'lodging','b16':'lodging','b01':'meal','b15':'transit','d5-security':'transit','d5-flight':'transit',
 'f08':'shopping','s07':'sight','s-osu-walk':'sight','f20':'rest','f-chiikawa':'rest','s-kurin':'rest','s-kurin-transfer':'transit','s-donki':'shopping','d5-kato':'meal','d5-keshiki':'meal','d5-lunch':'meal','d5-flight-park':'sight',
 's-shinsuzume':'rest','sun-unayasu':'meal','s-okoge':'meal'
})){
 assert.equal(run('eventCategory(EVENTS_BY_ID.get("'+id+'"))'),category,id);
}
const guide=fs.readFileSync('guide.html','utf8');
assert.match(guide,/components\.css\?v=/);
assert.match(guide,/data-guide-event="f-chiikawa">[\s\S]*?category-badge" data-category="rest"/);
assert.match(run('restaurantCard(EVENTS_BY_ID.get("d5-keshiki"))'),/data-res-jump="keshiki-saturday"/);
assert.equal(run('EVENTS_BY_ID.get("s01").meal'),null);
const checked=run('Object.keys(SHOP_WALKS)');
assert.equal(checked.length,23);
for(const id of checked){
 const html=run('eventInfo(EVENTS_BY_ID.get("'+id+'"),{open:true})');
 assert.match(html,/오는 길 · 계획/);
 assert.match(html,/다음 장소 · 계획/);
 assert.match(html,/추천 방문|추천 메뉴/);
 assert.match(html,/영업·이용/);
 assert.match(html,/https:\/\//);
}
for(const id of ['f-chiikawa','s-shinsuzume','s-okoge','sun-unayasu','d5-keshiki','s-kurin','d5-kato','d5-lunch']){
 const html=run('restaurantCard(EVENTS_BY_ID.get("'+id+'"))');
 assert.match(html,/추천 메뉴/);
 assert.match(html,/영업·이용/);
 assert.match(html,/google\.com\/maps\/dir/);
}
assert.match(run('eventInfo(EVENTS_BY_ID.get("s-okoge"),{open:true})'),/돈키호테 본점까지/);
assert.match(run('eventInfo(EVENTS_BY_ID.get("s22"),{open:true})'),/12\/11 금요일 포함/);
assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/id="zoo"|place-experiences\.js/);
console.log('PASS: six shared visual categories, every collapsed/expanded/printed event, all detail text, inline progress and routes, hotel without booking and mobile sheet snaps.');
