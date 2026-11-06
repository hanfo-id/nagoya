const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const dom={innerHTML:''};
const c=vm.createContext({Intl,Date,URL,localStorage:{getItem:()=>null},document:{body:{classList:{toggle(){}}},querySelector:()=>dom},esc:s=>String(s??''),link:(u,t)=>t,$:()=>dom,confirmedTime:()=>'',reservationTotals:()=>({confirmed:0,attention:6})});
for(const f of ['trip-details.js','trip-data.js','map-locations.js','trip-state.js','screen.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const run=s=>vm.runInContext(s,c),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
run('state=freshState();active=1;state.selectedDay=1');
const points=json('getMapStops(state,1)');assert.equal(points.filter(p=>p.id==='lachic').length,1);assert.ok(points.find(p=>p.id==='lachic').eventIds.includes('d2-rest'));
assert.ok(points.every(p=>!p.shopId&&!p.id.startsWith('shop-')));
assert.ok(json("AREA_GUIDES.lachic.places").includes('parco'));assert.ok(json('AREA_GUIDES.osu.places').includes('mandarake'));
assert.equal(run('Object.keys(AREA_GUIDES).length'),9);assert.equal(run('Object.keys(SHOP_GUIDE).length'),18);
for(const [area,guide] of Object.entries(json('AREA_GUIDES'))){assert.ok(guide.intro);for(const id of guide.places){const place=json(`SHOP_GUIDE['${id}']`);assert.ok(place.name&&place.jp&&place.query&&place.hours&&place.address);assert.ok(place.url.startsWith('https://'));assert.ok(place.picks.length>0);}}
run('state.filters.optional=false');assert.ok(json('getMapStops(state,1)').every(p=>!p.shopId));
run('state.filters.optional=true;state.filters.foodOnly=true');assert.ok(json('getMapStops(state,1)').every(p=>!p.shopId));
run("state.filters.foodOnly=false;state.events['d2-rest']={status:'done'}");assert.equal(run("eventStatus(baseEvents(1).find(e=>e.id==='d2-rest'))"),'done');assert.equal(run("validateBackup(JSON.stringify(backupEnvelope())).events['d2-rest'].status"),'done');
run("state.selectedEvent='d2-oasis';renderHomeCompact()");assert.ok(!dom.innerHTML.includes('data-place-detail'));assert.ok(!dom.innerHTML.includes('장소 상세'));assert.ok(dom.innerHTML.includes('고메다'));
for(const height of [500,722,900]){assert.equal(run(`nearestSheetLevel(${height},sheetStops(${height}).expanded)`),'expanded');assert.equal(run(`nearestSheetLevel(${height},sheetStops(${height}).map)`),'map');assert.ok(run(`sheetStops(${height}).expanded<sheetStops(${height}).balanced&&sheetStops(${height}).balanced<sheetStops(${height}).map`));}
console.log('PASS single Lachic stop with both legacy activity IDs; 18 child choices belong to 9 areas, never numbered or counted as itinerary events; old rest status and backup retained; home is independent of browsed place; sheet snap boundaries.');
