const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const dom={innerHTML:''};
const c=vm.createContext({Intl,Date,URL,localStorage:{getItem:()=>null},document:{body:{classList:{toggle(){}}},querySelector:()=>dom},esc:s=>String(s??''),link:(u,t)=>t,$:()=>dom,confirmedTime:()=>'',reservationTotals:()=>({confirmed:0,attention:6})});
for(const f of ['trip-details.js','trip-data.js','map-locations.js','trip-state.js','screen.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const run=s=>vm.runInContext(s,c),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
run('state=freshState();active=1;state.selectedDay=1');
const points=json('getMapStops(state,1)');assert.equal(points.filter(p=>p.id==='lachic').length,1);assert.ok(points.find(p=>p.id==='lachic').eventIds.includes('d2-rest'));
assert.ok(points.every(p=>!p.shopId&&!p.id.startsWith('shop-')));
assert.ok(json("AREA_GUIDES.lachic.places").includes('parco'));assert.ok(json('AREA_GUIDES.osu.places').includes('mandarake'));
assert.equal(run('Object.keys(AREA_GUIDES).length'),9);assert.equal(run('Object.keys(SHOP_GUIDE).length'),26);
for(const [area,guide] of Object.entries(json('AREA_GUIDES'))){assert.ok(guide.intro);for(const id of guide.places){const place=json(`SHOP_GUIDE['${id}']`);assert.ok(place.name&&place.jp&&place.query&&place.hours&&place.address);assert.ok(place.url.startsWith('https://'));assert.ok(place.picks.length>0);}}
run('state.filters.optional=false');assert.ok(json('getMapStops(state,1)').every(p=>!p.shopId));
run('state.filters.optional=true;state.filters.foodOnly=true');assert.ok(json('getMapStops(state,1)').every(p=>!p.shopId));
run("state.filters.foodOnly=false;state.events['d2-rest']={status:'done'}");assert.equal(run("eventStatus(baseEvents(1).find(e=>e.id==='d2-rest'))"),'done');assert.equal(run("validateBackup(JSON.stringify(backupEnvelope())).events['d2-rest'].status"),'done');
run("state.selectedEvent='d2-oasis';renderHomeCompact()");assert.ok(!dom.innerHTML.includes('data-place-detail'));assert.ok(!dom.innerHTML.includes('장소 상세'));assert.ok(dom.innerHTML.includes('고메다'));
for(const height of [500,722,900]){assert.equal(run(`nearestSheetLevel(${height},sheetStops(${height}).expanded)`),'expanded');assert.equal(run(`nearestSheetLevel(${height},sheetStops(${height}).map)`),'map');assert.ok(run(`sheetStops(${height}).expanded<sheetStops(${height}).balanced&&sheetStops(${height}).balanced<sheetStops(${height}).map`));}
console.log('PASS single Lachic stop with both legacy activity IDs; 26 child choices belong to 9 areas, never numbered or counted as itinerary events; old rest status and backup retained; home is independent of browsed place; sheet snap boundaries.');

// Consecutive location visits are one visible stop; original records stay separately editable.
run('state=freshState();state.selectedDay=CITY_DAY');
const city=json('getMapStops(state,CITY_DAY)');assert.equal(city.filter(p=>p.id==='kannon').length,1);assert.ok(!city.some(p=>['kokusai','shike','endoji'].includes(p.id)));assert.ok(city.find(p=>p.id==='hotel'&&p.eventIds.includes('d4-market-transfer')).eventIds.includes('d4-old-town'));assert.equal(city.filter(p=>p.id==='osu').length,1);assert.ok(city.find(p=>p.id==='osu').eventIds.includes('d4-osu-lunch'));
const temple=city.find(p=>p.id==='kannon');assert.deepEqual(temple.eventIds,['d4-osu-transfer','d4-osu']);assert.equal(temple.time,'09:45');assert.equal(temple.end,'12:00');
run("state.events['d4-osu-transfer']={status:'done'}");assert.equal(run("getMapStops(state,CITY_DAY).find(p=>p.id==='kannon').status"),'planned');
run("state.events['d4-osu']={status:'done'}");assert.equal(run("getMapStops(state,CITY_DAY).find(p=>p.id==='kannon').status"),'done');assert.equal(run("validateBackup(JSON.stringify(backupEnvelope())).events['d4-osu-transfer'].status"),'done');
assert.equal(run("getMapStops(state,4).filter(p=>p.id==='hotel').length"),1);assert.equal(run("getMapStops(state,4).filter(p=>p.id==='airport').length"),1);
for(let day=0;day<5;day++)for(const p of json(`getMapStops(state,${day})`))assert.ok(run(`!!PLACE_INTROS['${p.id}']`),'missing place purpose '+p.id);
assert.equal(run("Object.values(SHOP_GUIDE).filter(p=>choiceCategory(p)==='clothes').length"),6);
assert.ok(run("AREA_GUIDES.osu.places.includes('wegoOsu')&&AREA_GUIDES.nagoya.places.includes('guGate')"));
console.log('PASS adjacent visits merged with original IDs/times/statuses intact; later return visits retained; all stops have a place purpose; six clothing options.');
